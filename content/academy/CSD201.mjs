/**
 * CSD201 — Data Structures and Algorithms (Cấu trúc dữ liệu và giải thuật). Kỳ 3.
 * Bám syllabus FPTU (sylID 10368, 8 CLO) + giáo trình Goodrich/Tamassia/Goldwasser
 * "Data Structures and Algorithms in Java 6e". Tiên quyết PRO192. Java + Eclipse.
 * Song ngữ EN/VN (.ml-en/.ml-vi, tiêu đề EN|||VI). Code Java <pre>+.tok-*+.out; sơ đồ lz-*.
 * Luyện: CodeLab data-structures-algorithms (#module-503..508) + java-core + /algorithms.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/CSD201.mjs --apply
 */
export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'CSD201',
    slug: 'data-structures-and-algorithms',
    title: 'Data Structures and Algorithms',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'The toolbox every programmer builds on: arrays, linked lists, stacks, queues, trees, graphs, hashing — and the algorithms that traverse, sort and search them. Learn to pick the right structure and prove why, in Java.|||Bộ đồ nghề mọi lập trình viên dựa vào: mảng, danh sách liên kết, ngăn xếp, hàng đợi, cây, đồ thị, băm — và các thuật toán duyệt, sắp xếp, tìm kiếm chúng. Học cách chọn đúng cấu trúc và chứng minh vì sao, bằng Java.',
    description: 'Môn nền tảng của khoa học máy tính: cách tổ chức dữ liệu trong bộ nhớ và các thuật toán vận hành trên chúng. Học mảng, danh sách liên kết, ngăn xếp, hàng đợi, cây nhị phân tìm kiếm, đồ thị, bảng băm; phân tích độ phức tạp (Big-O); các thuật toán sắp xếp, tìm kiếm, duyệt; và biết chọn cấu trúc/thuật toán phù hợp cho bài toán thực tế. Cài đặt bằng Java. Tiên quyết: PRO192.',
    whatYouLearn: 'Phân tích độ phức tạp Big-O; mảng & danh sách liên kết (đơn/vòng/đôi); ngăn xếp, hàng đợi, deque, hàng đợi ưu tiên; đệ quy; cây, cây nhị phân, cây nhị phân tìm kiếm (BST); đồ thị & thuật toán duyệt (BFS/DFS); các thuật toán sắp xếp cơ bản & nâng cao (quick/merge/heap sort); bảng băm & xử lý va chạm; xử lý văn bản (Huffman, LZW, RLE); và cách chọn cấu trúc/thuật toán tối ưu.',
    requirements: 'Tiên quyết: đạt PRO192 (vững lớp/đối tượng, generic, đệ quy trong Java). Cần JDK 8+ và một IDE (Eclipse theo syllabus, hoặc IntelliJ/NetBeans).',
    documentsNote: 'Giáo trình chính: Goodrich, Tamassia, Goldwasser — Data Structures and Algorithms in Java, 6th ed. (2014). Kèm slide FU, bài tập FU (pdf), code Java mẫu. Công cụ: JDK 8+, Eclipse. Luyện tập: track Code Lab Data Structures & Algorithms + Algorithm Visualizer (/algorithms). Kèm file syllabus gốc CSD201.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học là gì, điều kiện qua môn, chuẩn đầu ra, công cụ và cách học.',
      lessons: [
        {
          title: '0.1 — About CSD201 & the course map|||0.1 — Giới thiệu CSD201 & bản đồ môn học',
          slug: 'csd201-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Vì sao cấu trúc dữ liệu quan trọng, và toàn cảnh lộ trình môn học.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About CSD201 — Data Structures and Algorithms</h2>
<p class="lead">A program is data plus the operations on it. CSD201 is where you learn to organise that data well. The same task can run in a blink or grind for minutes purely based on the <strong>structure</strong> you chose and the <strong>algorithm</strong> you ran on it. This course teaches you to choose wisely — and to prove your choice with Big-O.</p>
<p>It is the foundation for interviews, for competitive programming, and for every performance-sensitive system you will ever write. In PRO192 you learned Java; here you use Java to build the classic structures from scratch.</p>
<h3>Course map</h3>
<div class="lz-map">
  <div class="lz-stage">Foundations</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Lists &amp; Linked Lists</div><div class="lz-nsub">Array · singly · circular · doubly</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Stacks, Queues &amp; Priority Queues</div><div class="lz-nsub">LIFO · FIFO · deque · heap-backed</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Recursion</div><div class="lz-nsub">Definitions · algorithms · the call stack</div></div></div>
  <div class="lz-stage">Hierarchies &amp; networks</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Trees &amp; BST</div><div class="lz-nsub">Binary trees · search trees · traversals</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Graphs</div><div class="lz-nsub">Representation · BFS · DFS</div></div></div>
  <div class="lz-stage">Algorithms on data</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Sorting</div><div class="lz-nsub">Basic → quick · merge · heap</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Hashing</div><div class="lz-nsub">Hash functions · collisions · maps</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Text Processing</div><div class="lz-nsub">Huffman · LZW · run-length</div></div></div>
  <div class="lz-stage">Exam &amp; advanced</div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Exam preparation</div><div class="lz-nsub">PE 85' strategy · 120-question bank · cheat sheet</div></div></div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Red-Black · B-tree · skip list · Union-Find</div><div class="lz-nsub">Toward algorithmic maturity</div></div></div>
</div>
<div class="callout ok">Data structures click when you <em>see</em> them move. This course pairs every topic with the Algorithm Visualizer and hands-on Java exercises — build each structure yourself.</div>
<a class="link-card codelab" href="/algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Algorithm Visualizer</span><span class="lc-sub">Watch sorts, searches and structures animate step by step.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu CSD201 — Cấu trúc dữ liệu và giải thuật</h2>
<p class="lead">Một chương trình là dữ liệu cộng với các thao tác trên nó. CSD201 là nơi bạn học cách tổ chức dữ liệu đó cho tốt. Cùng một việc có thể chạy trong nháy mắt hay ì ạch vài phút chỉ dựa trên <strong>cấu trúc</strong> bạn chọn và <strong>thuật toán</strong> bạn chạy trên nó. Môn này dạy bạn chọn khôn ngoan — và chứng minh lựa chọn bằng Big-O.</p>
<p>Đây là nền tảng cho phỏng vấn, cho lập trình thi đấu, và cho mọi hệ thống nhạy hiệu năng bạn sẽ viết. Ở PRO192 bạn học Java; ở đây bạn dùng Java để xây các cấu trúc kinh điển từ đầu.</p>
<h3>Bản đồ môn học</h3>
<div class="lz-map">
  <div class="lz-stage">Nền tảng</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Danh sách &amp; Danh sách liên kết</div><div class="lz-nsub">Mảng · đơn · vòng · đôi</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Ngăn xếp, Hàng đợi &amp; Hàng đợi ưu tiên</div><div class="lz-nsub">LIFO · FIFO · deque · dùng heap</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Đệ quy</div><div class="lz-nsub">Định nghĩa · thuật toán · call stack</div></div></div>
  <div class="lz-stage">Phân cấp &amp; mạng lưới</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Cây &amp; BST</div><div class="lz-nsub">Cây nhị phân · cây tìm kiếm · duyệt</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Đồ thị</div><div class="lz-nsub">Biểu diễn · BFS · DFS</div></div></div>
  <div class="lz-stage">Thuật toán trên dữ liệu</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Sắp xếp</div><div class="lz-nsub">Cơ bản → quick · merge · heap</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Băm</div><div class="lz-nsub">Hàm băm · va chạm · map</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Xử lý văn bản</div><div class="lz-nsub">Huffman · LZW · run-length</div></div></div>
  <div class="lz-stage">Ôn thi &amp; nâng cao</div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Ôn thi</div><div class="lz-nsub">Chiến lược PE 85' · ngân hàng 120 câu · bảng tra</div></div></div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Đỏ-đen · B-tree · danh sách nhảy · Union-Find</div><div class="lz-nsub">Hướng tới độ chín về thuật toán</div></div></div>
</div>
<div class="callout ok">Cấu trúc dữ liệu "thấm" khi bạn <em>thấy</em> chúng chuyển động. Môn này ghép mỗi chủ đề với Algorithm Visualizer và bài tập Java thực hành — tự xây từng cấu trúc.</div>
<a class="link-card codelab" href="/algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Algorithm Visualizer</span><span class="lc-sub">Xem sắp xếp, tìm kiếm và cấu trúc chạy từng bước.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Passing requirements & grading|||0.2 — Điều kiện qua môn & cấu trúc điểm',
          slug: 'csd201-dieu-kien-qua-mon',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Tổng giờ, tiên quyết, điểm sàn và các cột điểm (có thi thực hành PE).',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Passing requirements &amp; grading</h2>
<p class="lead">From the official CSD201 syllabus. There is both a theory exam and a practical exam, so you must both <em>understand</em> the structures and be able to <em>code</em> them.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Total hours</span><span class="v">150h <small>45h class + TE + PE + self-study</small></span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">Pass PRO192</span></div>
  <div class="kv"><span class="k">Grading scale</span><span class="v">10 <small>pass when average ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Exam eligibility</span><span class="v">Attend ≥ 80% of sessions</span></div>
</div>
<div class="callout warn">The course has a <strong>Practical Exam (PE, ~85 min)</strong> where you implement structures/algorithms in Java, plus a Theory Exam. Understanding a linked list on paper is not enough — you must code it under time. Do the exercises.</div>
<div class="note-ct">The exact component weights are set each term on the LMS. Whatever they are, both exams matter: study the theory (Big-O, definitions) and practise the implementation in equal measure.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn &amp; cấu trúc điểm</h2>
<p class="lead">Từ syllabus chính thức CSD201. Có cả thi lý thuyết và thi thực hành, nên bạn vừa phải <em>hiểu</em> cấu trúc vừa phải <em>code</em> được chúng.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Tổng giờ</span><span class="v">150h <small>45h lớp + TE + PE + tự học</small></span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">Đạt PRO192</span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10 <small>qua khi trung bình ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Điều kiện dự thi</span><span class="v">Dự ≥ 80% buổi</span></div>
</div>
<div class="callout warn">Môn có <strong>thi thực hành (PE, ~85 phút)</strong> nơi bạn cài đặt cấu trúc/thuật toán bằng Java, cộng thi lý thuyết. Hiểu danh sách liên kết trên giấy là chưa đủ — bạn phải code được nó dưới áp lực thời gian. Hãy làm bài tập.</div>
<div class="note-ct">Trọng số từng cột điểm đặt theo kỳ trên LMS. Dù là gì, cả hai kỳ thi đều quan trọng: học lý thuyết (Big-O, định nghĩa) và luyện cài đặt như nhau.</div>
</div>
`,
        },
        {
          title: '0.3 — Big-O: the language of efficiency|||0.3 — Big-O: ngôn ngữ của hiệu năng',
          slug: 'csd201-big-o',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Ký hiệu Big-O, các lớp phức tạp thường gặp và cách so sánh thuật toán — nền cho cả môn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Big-O — the language of efficiency</h2>
<p class="lead">Every choice in this course is justified with Big-O: how the running time grows as the input <span class="badge">n</span> grows. Master this notation now and the rest of CSD201 becomes a set of trade-offs you can reason about.</p>
<table>
  <thead><tr><th>Big-O</th><th>Name</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><span class="badge">O(1)</span></td><td>constant</td><td>array access, hash lookup</td></tr>
    <tr><td><span class="badge">O(log n)</span></td><td>logarithmic</td><td>binary search, balanced BST</td></tr>
    <tr><td><span class="badge">O(n)</span></td><td>linear</td><td>scan a list</td></tr>
    <tr><td><span class="badge">O(n log n)</span></td><td>linearithmic</td><td>merge/quick/heap sort</td></tr>
    <tr><td><span class="badge">O(n²)</span></td><td>quadratic</td><td>bubble/selection sort</td></tr>
    <tr><td><span class="badge">O(2ⁿ)</span></td><td>exponential</td><td>naive recursion (Fibonacci)</td></tr>
  </tbody>
</table>
<p>Big-O keeps only the <strong>dominant term</strong> and drops constants: 3n + 5 is O(n); n²/2 is O(n²). We care how it <em>scales</em>, not the exact count. Doubling <span class="badge">n</span> on O(n²) roughly quadruples the work — the reason a "works on 10 items" solution can freeze on 10,000.</p>
<div class="note-ct">Also mind space complexity — an O(n) extra-memory sort (merge) versus an in-place O(1) one (heap) can decide the right tool for a memory-limited problem.</div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms#module-504" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Practise: complexity & recursion fundamentals</span><span class="lc-sub">Searching, Sorting &amp; Recursion module.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Big-O — ngôn ngữ của hiệu năng</h2>
<p class="lead">Mọi lựa chọn trong môn này được biện minh bằng Big-O: thời gian chạy tăng thế nào khi đầu vào <span class="badge">n</span> tăng. Thành thạo ký hiệu này ngay và phần còn lại của CSD201 thành một tập đánh đổi mà bạn có thể lập luận.</p>
<table>
  <thead><tr><th>Big-O</th><th>Tên</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td><span class="badge">O(1)</span></td><td>hằng</td><td>truy cập mảng, tra băm</td></tr>
    <tr><td><span class="badge">O(log n)</span></td><td>logarit</td><td>tìm nhị phân, BST cân bằng</td></tr>
    <tr><td><span class="badge">O(n)</span></td><td>tuyến tính</td><td>duyệt một danh sách</td></tr>
    <tr><td><span class="badge">O(n log n)</span></td><td>tuyến-log</td><td>merge/quick/heap sort</td></tr>
    <tr><td><span class="badge">O(n²)</span></td><td>bậc hai</td><td>bubble/selection sort</td></tr>
    <tr><td><span class="badge">O(2ⁿ)</span></td><td>mũ</td><td>đệ quy ngây thơ (Fibonacci)</td></tr>
  </tbody>
</table>
<p>Big-O chỉ giữ <strong>số hạng trội</strong> và bỏ hằng số: 3n + 5 là O(n); n²/2 là O(n²). Ta quan tâm nó <em>co giãn</em> ra sao, không phải số đếm chính xác. Gấp đôi <span class="badge">n</span> trên O(n²) khiến công việc tăng ~gấp bốn — lý do một lời giải "chạy với 10 phần tử" có thể treo với 10.000.</p>
<div class="note-ct">Cũng để ý độ phức tạp không gian — sắp xếp tốn O(n) bộ nhớ phụ (merge) so với tại-chỗ O(1) (heap) có thể quyết định công cụ đúng cho bài toán hạn chế bộ nhớ.</div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms#module-504" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Luyện: độ phức tạp & đệ quy nền tảng</span><span class="lc-sub">Module Searching, Sorting &amp; Recursion.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.4 — Set up JDK & Eclipse|||0.4 — Cài JDK & Eclipse',
          slug: 'csd201-cai-dat',
          type: 'VIDEO',
          description: 'Cài môi trường Java để cài đặt & chạy các cấu trúc dữ liệu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Set up your Java environment</h2>
<p class="lead">CSD201 implements structures in Java. The syllabus names <strong>Eclipse</strong>, but any Java IDE (IntelliJ, NetBeans, VS Code) works. You need a JDK and an IDE — that is all.</p>
<div class="lz-flow">
  <div class="lz-step">Install JDK 8+</div>
  <div class="lz-step">Install Eclipse (or your IDE)</div>
  <div class="lz-step">Create a Java project</div>
  <div class="lz-step">Run a "Hello" to confirm</div>
</div>
<a class="link-card exphub" href="/exp-hub/csd201-cai-dat-eclipse?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Install JDK &amp; Eclipse</span><span class="lc-sub">Step-by-step with official download links — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Cài môi trường Java</h2>
<p class="lead">CSD201 cài đặt cấu trúc bằng Java. Syllabus nêu <strong>Eclipse</strong>, nhưng IDE Java nào (IntelliJ, NetBeans, VS Code) cũng được. Bạn cần một JDK và một IDE — vậy là đủ.</p>
<div class="lz-flow">
  <div class="lz-step">Cài JDK 8+</div>
  <div class="lz-step">Cài Eclipse (hoặc IDE của bạn)</div>
  <div class="lz-step">Tạo Java project</div>
  <div class="lz-step">Chạy "Hello" để xác nhận</div>
</div>
<a class="link-card exphub" href="/exp-hub/csd201-cai-dat-eclipse?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Cài JDK &amp; Eclipse</span><span class="lc-sub">Từng bước kèm link tải chính chủ — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 1 — DANH SÁCH & LIÊN KẾT ══════════════════ */
    {
      title: 'Chapter 1 — Lists & Linked Lists|||Chương 1 — Danh sách & Danh sách liên kết',
      description: 'Cấu trúc tuyến tính nền tảng: mảng, danh sách liên kết đơn, vòng, đôi — và khi nào dùng cái nào.',
      lessons: [
        {
          title: '1.1 — Arrays & dynamic arrays|||1.1 — Mảng & mảng động',
          slug: 'csd201-mang',
          simulation: {
            url: 'https://media.cuongthai.com/videos/academy/CSD201/csd201-mang.mp4',
            poster: 'https://media.cuongthai.com/videos/academy/CSD201/csd201-mang.jpg',
            scenario: 'list-vs-linked',
            durationSeconds: 25,
            caption: { en: "A contiguous array and the cache line that makes it fast", vi: "Mảng liền khối và dòng cache khiến nó nhanh" },
          },
          type: 'VIDEO',
          description: 'Mảng: truy cập O(1) nhưng chèn/xóa O(n); ArrayList và cách nó tự lớn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Arrays &amp; dynamic arrays</h2>
<p class="lead">An array stores items in one contiguous block, so reading position <span class="badge">i</span> is instant — O(1). The price: a fixed size, and inserting or deleting in the middle shifts everything after it — O(n).</p>
<pre><span class="tok-type">int</span>[] a = <span class="tok-keyword">new</span> <span class="tok-type">int</span>[5];
a[2] = 7;              <span class="tok-comment">// O(1) access</span>
<span class="tok-comment">// insert at front → shift all right: O(n)</span></pre>
<div class="out"><b>ArrayList</b> wraps an array and doubles its capacity when full, giving amortised O(1) append while keeping O(1) random access.</div>
<table>
  <thead><tr><th>Operation</th><th>Array / ArrayList</th></tr></thead>
  <tbody>
    <tr><td>access by index</td><td>O(1)</td></tr>
    <tr><td>append (amortised)</td><td>O(1)</td></tr>
    <tr><td>insert/delete middle</td><td>O(n)</td></tr>
    <tr><td>search (unsorted)</td><td>O(n)</td></tr>
  </tbody>
</table>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Amortized analysis of array doubling.</b> The single O(n) resize when a dynamic array grows is paid off by the many O(1) appends around it, so the average cost per append stays O(1) — this is amortized, not worst-case, time. Doubling the capacity (rather than adding a fixed amount) is precisely what makes the total work for n appends a geometric series that sums to O(n). <em>Textbooks state "amortised O(1)" but rarely prove why doubling, not fixed growth, is what guarantees it.</em></div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms#module-503" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">Practise: Linear Data Structures</span><span class="lc-sub">Arrays, dynamic arrays and their trade-offs.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Mảng &amp; mảng động</h2>
<p class="lead">Mảng lưu các phần tử trong một khối liền kề, nên đọc vị trí <span class="badge">i</span> là tức thì — O(1). Cái giá: kích thước cố định, và chèn/xóa ở giữa phải dời mọi thứ phía sau — O(n).</p>
<pre><span class="tok-type">int</span>[] a = <span class="tok-keyword">new</span> <span class="tok-type">int</span>[5];
a[2] = 7;              <span class="tok-comment">// truy cập O(1)</span>
<span class="tok-comment">// chèn đầu → dời cả sang phải: O(n)</span></pre>
<div class="out"><b>ArrayList</b> bọc một mảng và gấp đôi dung lượng khi đầy, cho phép append O(1) khấu hao mà vẫn giữ truy cập ngẫu nhiên O(1).</div>
<table>
  <thead><tr><th>Thao tác</th><th>Mảng / ArrayList</th></tr></thead>
  <tbody>
    <tr><td>truy cập theo chỉ số</td><td>O(1)</td></tr>
    <tr><td>append (khấu hao)</td><td>O(1)</td></tr>
    <tr><td>chèn/xóa ở giữa</td><td>O(n)</td></tr>
    <tr><td>tìm (chưa sắp)</td><td>O(n)</td></tr>
  </tbody>
</table>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Phân tích khấu hao khi mảng nhân đôi.</b> Một lần resize O(n) khi mảng động lớn lên được "trả góp" bởi rất nhiều lần append O(1) xung quanh, nên chi phí trung bình mỗi append vẫn là O(1) — đây là thời gian khấu hao, không phải xấu nhất. Nhân đôi dung lượng (thay vì cộng thêm một lượng cố định) chính là điều khiến tổng công việc cho n lần append là một chuỗi hình học cộng lại thành O(n). <em>Giáo trình nói "khấu hao O(1)" nhưng hiếm khi chứng minh vì sao phải nhân đôi chứ không phải tăng cố định.</em></div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms#module-503" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">Luyện: Linear Data Structures</span><span class="lc-sub">Mảng, mảng động và các đánh đổi.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '1.2 — Singly, circular & doubly linked lists|||1.2 — Danh sách liên kết đơn, vòng & đôi',
          slug: 'csd201-linked-list',
          simulation: {
            url: 'https://media.cuongthai.com/videos/academy/CSD201/csd201-linked-list.mp4',
            poster: 'https://media.cuongthai.com/videos/academy/CSD201/csd201-linked-list.jpg',
            scenario: 'list-vs-linked',
            durationSeconds: 26,
            caption: { en: "Insert in the middle: pointer swap versus shifting everything", vi: "Chèn vào giữa: đổi con trỏ so với dời cả mảng" },
          },
          type: 'VIDEO',
          description: 'Node + con trỏ next/prev: chèn/xóa O(1) tại nút đã biết, nhưng truy cập O(n).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Linked lists — nodes wired together</h2>
<p class="lead">A linked list stores each item in a <strong>node</strong> that points to the next. There is no shifting: inserting or deleting at a known node is O(1). The trade-off is the mirror of arrays — no index jump, so reaching position <span class="badge">i</span> is O(n).</p>
<div class="lz-flow">
  <div class="lz-step">Head → [7|•]</div>
  <div class="lz-step">→ [3|•]</div>
  <div class="lz-step">→ [9|null]</div>
</div>
<pre><span class="tok-keyword">class</span> <span class="tok-type">Node</span> {
    <span class="tok-type">int</span> data;
    <span class="tok-type">Node</span> next;               <span class="tok-comment">// doubly: also &#96;Node prev&#96;</span>
}
<span class="tok-comment">// insert after a node p:</span>
newNode.next = p.next;  p.next = newNode;   <span class="tok-comment">// O(1)</span></pre>
<table>
  <thead><tr><th>Variant</th><th>Extra</th></tr></thead>
  <tbody>
    <tr><td>Singly</td><td>one <span class="badge">next</span> pointer, forward only</td></tr>
    <tr><td>Circular</td><td>last node points back to head</td></tr>
    <tr><td>Doubly</td><td>both <span class="badge">next</span> &amp; <span class="badge">prev</span> — walk both ways</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>Trap:</b> when deleting, fix the neighbour pointers <em>before</em> losing the reference, and handle the head/tail edge cases. A dropped pointer means a lost list.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Skip lists — a linked list that searches in O(log n).</b> By stacking several linked lists with express lanes that skip over many nodes, a skip list reaches any element in expected O(log n) instead of O(n), using randomised levels rather than tree rotations. It delivers balanced-tree performance with far simpler code, which is why databases like Redis use it for sorted sets. <em>The chapter stops at O(n) list traversal; the probabilistic O(log n) upgrade is a graduate-level idea.</em></div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms#module-505" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Practise: Linked Lists</span><span class="lc-sub">Build singly/doubly lists and their operations.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Danh sách liên kết — các nút nối với nhau</h2>
<p class="lead">Danh sách liên kết lưu mỗi phần tử trong một <strong>nút (node)</strong> trỏ tới nút kế. Không phải dời gì: chèn hoặc xóa tại một nút đã biết là O(1). Đánh đổi ngược với mảng — không nhảy theo chỉ số, nên tới vị trí <span class="badge">i</span> là O(n).</p>
<div class="lz-flow">
  <div class="lz-step">Head → [7|•]</div>
  <div class="lz-step">→ [3|•]</div>
  <div class="lz-step">→ [9|null]</div>
</div>
<pre><span class="tok-keyword">class</span> <span class="tok-type">Node</span> {
    <span class="tok-type">int</span> data;
    <span class="tok-type">Node</span> next;               <span class="tok-comment">// đôi: thêm &#96;Node prev&#96;</span>
}
<span class="tok-comment">// chèn sau nút p:</span>
newNode.next = p.next;  p.next = newNode;   <span class="tok-comment">// O(1)</span></pre>
<table>
  <thead><tr><th>Biến thể</th><th>Thêm</th></tr></thead>
  <tbody>
    <tr><td>Đơn</td><td>một con trỏ <span class="badge">next</span>, chỉ tiến</td></tr>
    <tr><td>Vòng</td><td>nút cuối trỏ về head</td></tr>
    <tr><td>Đôi</td><td>cả <span class="badge">next</span> &amp; <span class="badge">prev</span> — đi hai chiều</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>Bẫy:</b> khi xóa, sửa con trỏ hàng xóm <em>trước khi</em> mất tham chiếu, và xử lý ca biên head/tail. Rớt một con trỏ là mất cả danh sách.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Skip list — danh sách liên kết tìm kiếm trong O(log n).</b> Bằng cách xếp chồng nhiều danh sách liên kết với các "làn tốc hành" nhảy qua nhiều nút, skip list tới được phần tử bất kỳ trong kỳ vọng O(log n) thay vì O(n), dùng tầng ngẫu nhiên chứ không phải phép xoay cây. Nó cho hiệu năng như cây cân bằng nhưng code đơn giản hơn nhiều, nên các CSDL như Redis dùng nó cho sorted set. <em>Chương này dừng ở duyệt danh sách O(n); bản nâng cấp xác suất O(log n) là ý tưởng nâng cao.</em></div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms#module-505" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Luyện: Linked Lists</span><span class="lc-sub">Xây danh sách đơn/đôi và các thao tác.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '1.3 — Doubly linked lists with sentinels|||1.3 — Danh sách liên kết đôi & nút lính canh',
          slug: 'csd201-doubly-sentinel',
          type: 'VIDEO',
          description: 'Cài đặt đầy đủ danh sách liên kết đôi có header/trailer — mọi phép chèn/xoá về đúng một trường hợp, O(1).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Doubly linked lists — and the sentinel trick that removes every special case</h2>
<p class="lead">A singly linked list can only walk forward, and deleting a node needs its <em>predecessor</em>. A <strong>doubly linked list</strong> stores both <span class="badge">prev</span> and <span class="badge">next</span>, so given a node you can splice it out in O(1) without searching. Goodrich adds two dummy nodes — <strong>header</strong> and <strong>trailer</strong> (sentinels) — that hold no data and never get deleted. That one idea kills every "is it the first? is it the last? is the list empty?" branch.</p>

<h3>The shape</h3>
<div class="diagram">header ⇄ [A] ⇄ [B] ⇄ [C] ⇄ trailer</div>
<p>An empty list is simply <span class="badge">header ⇄ trailer</span>. Every real node therefore always has a non-null <span class="badge">prev</span> and a non-null <span class="badge">next</span> — no null checks anywhere in insert/delete.</p>

<h3>The core pattern — memorise these six lines</h3>
<pre><span class="tok-comment">// insert newest between predecessor p and successor s</span>
<span class="tok-keyword">private void</span> <span class="tok-function">addBetween</span>(<span class="tok-type">E</span> e, Node&lt;E&gt; p, Node&lt;E&gt; s) {
    Node&lt;E&gt; newest = <span class="tok-keyword">new</span> Node&lt;&gt;(e, p, s);
    p.next = newest;
    s.prev = newest;
    size++;
}

<span class="tok-comment">// remove node n (never header/trailer)</span>
<span class="tok-keyword">private</span> <span class="tok-type">E</span> <span class="tok-function">remove</span>(Node&lt;E&gt; n) {
    n.prev.next = n.next;
    n.next.prev = n.prev;
    size--;
    <span class="tok-keyword">return</span> n.element;
}</pre>
<p>Then every public operation is a one-liner: <span class="badge">addFirst(e)</span> = <span class="badge">addBetween(e, header, header.next)</span>; <span class="badge">addLast(e)</span> = <span class="badge">addBetween(e, trailer.prev, trailer)</span>; <span class="badge">removeLast()</span> = <span class="badge">remove(trailer.prev)</span>.</p>

<h3>Worked example — deleting B from A ⇄ B ⇄ C, step by step</h3>
<div class="out"><b>Start:</b> header ⇄ A ⇄ B ⇄ C ⇄ trailer, call <span class="badge">remove(B)</span>.<br>
<b>Step 1</b> — <span class="badge">n.prev.next = n.next</span> → A.next now points at C.<br>
<b>Step 2</b> — <span class="badge">n.next.prev = n.prev</span> → C.prev now points at A.<br>
<b>Step 3</b> — size-- → 2. B is now unreachable; the garbage collector reclaims it.<br>
<b>Result:</b> header ⇄ A ⇄ C ⇄ trailer, in <b>2 pointer writes</b> — O(1), regardless of list length. Compare with a singly linked list, where you must first walk from the head to find A: O(n).</div>

<h3>Cost table — why you would ever pick this</h3>
<table><thead><tr><th>Operation</th><th>Array</th><th>Singly linked</th><th>Doubly linked + sentinels</th></tr></thead><tbody>
<tr><td>addFirst / removeFirst</td><td>O(n) shift</td><td>O(1)</td><td>O(1)</td></tr>
<tr><td>addLast</td><td>O(1) amortised</td><td>O(1) with tail</td><td>O(1)</td></tr>
<tr><td>removeLast</td><td>O(1)</td><td><b>O(n)</b> (no prev!)</td><td><b>O(1)</b></td></tr>
<tr><td>get(i) by index</td><td><b>O(1)</b></td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>delete a node you already hold</td><td>O(n)</td><td>O(n)</td><td><b>O(1)</b></td></tr>
</tbody></table>

<div class="pitfall"><b>Classic exam trap.</b> Students write <span class="badge">n.next.prev = n.prev</span> <em>after</em> already overwriting <span class="badge">n.prev</span>, or forget one of the two writes — the list looks fine walking forward and is corrupt walking backward. Always update both directions before touching anything else, and never delete the header/trailer.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Sentinels cost 2 nodes and buy you correctness.</b> This is a general engineering pattern: pay a tiny constant to erase a whole class of edge cases. The Linux kernel's <span class="badge">list_head</span>, LRU caches, and Java's own <span class="badge">LinkedList</span> internals all use circular/sentinel layouts for the same reason. <em>Beyond syllabus because the textbook presents sentinels as an implementation detail, while in practice it is a design principle: prefer designs where the special case does not exist over designs where you remember to handle it.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Danh sách liên kết đôi — và mẹo nút lính canh xoá sạch mọi trường hợp đặc biệt</h2>
<p class="lead">Danh sách liên kết đơn chỉ đi tới được, và muốn xoá một nút thì phải có <em>nút đứng trước</em>. <strong>Danh sách liên kết đôi</strong> lưu cả <span class="badge">prev</span> lẫn <span class="badge">next</span>, nên cầm một nút trong tay là tháo được nó ra trong O(1) mà không cần tìm kiếm. Goodrich thêm hai nút giả — <strong>header</strong> và <strong>trailer</strong> (lính canh) — không chứa dữ liệu và không bao giờ bị xoá. Chỉ một ý tưởng đó giết sạch các nhánh "có phải nút đầu không? nút cuối không? danh sách rỗng không?".</p>

<h3>Hình dạng</h3>
<div class="diagram">header ⇄ [A] ⇄ [B] ⇄ [C] ⇄ trailer</div>
<p>Danh sách rỗng đơn giản là <span class="badge">header ⇄ trailer</span>. Nhờ vậy mọi nút thật luôn có <span class="badge">prev</span> khác null và <span class="badge">next</span> khác null — không cần kiểm tra null ở bất kỳ đâu trong chèn/xoá.</p>

<h3>Mẫu cốt lõi — thuộc lòng sáu dòng này</h3>
<pre><span class="tok-comment">// chèn newest vào giữa nút trước p và nút sau s</span>
<span class="tok-keyword">private void</span> <span class="tok-function">addBetween</span>(<span class="tok-type">E</span> e, Node&lt;E&gt; p, Node&lt;E&gt; s) {
    Node&lt;E&gt; newest = <span class="tok-keyword">new</span> Node&lt;&gt;(e, p, s);
    p.next = newest;
    s.prev = newest;
    size++;
}

<span class="tok-comment">// xoá nút n (không bao giờ là header/trailer)</span>
<span class="tok-keyword">private</span> <span class="tok-type">E</span> <span class="tok-function">remove</span>(Node&lt;E&gt; n) {
    n.prev.next = n.next;
    n.next.prev = n.prev;
    size--;
    <span class="tok-keyword">return</span> n.element;
}</pre>
<p>Sau đó mọi thao tác công khai chỉ còn một dòng: <span class="badge">addFirst(e)</span> = <span class="badge">addBetween(e, header, header.next)</span>; <span class="badge">addLast(e)</span> = <span class="badge">addBetween(e, trailer.prev, trailer)</span>; <span class="badge">removeLast()</span> = <span class="badge">remove(trailer.prev)</span>.</p>

<h3>Ví dụ có lời giải — xoá B khỏi A ⇄ B ⇄ C, từng bước</h3>
<div class="out"><b>Ban đầu:</b> header ⇄ A ⇄ B ⇄ C ⇄ trailer, gọi <span class="badge">remove(B)</span>.<br>
<b>Bước 1</b> — <span class="badge">n.prev.next = n.next</span> → A.next giờ trỏ tới C.<br>
<b>Bước 2</b> — <span class="badge">n.next.prev = n.prev</span> → C.prev giờ trỏ tới A.<br>
<b>Bước 3</b> — size-- → 2. B không còn ai trỏ tới; bộ dọn rác thu hồi nó.<br>
<b>Kết quả:</b> header ⇄ A ⇄ C ⇄ trailer, chỉ với <b>2 phép ghi con trỏ</b> — O(1), bất kể danh sách dài bao nhiêu. So với liên kết đơn: phải đi từ đầu để tìm A trước, tức O(n).</div>

<h3>Bảng chi phí — vì sao có lúc phải chọn cấu trúc này</h3>
<table><thead><tr><th>Thao tác</th><th>Mảng</th><th>Liên kết đơn</th><th>Liên kết đôi + lính canh</th></tr></thead><tbody>
<tr><td>addFirst / removeFirst</td><td>O(n) dời chỗ</td><td>O(1)</td><td>O(1)</td></tr>
<tr><td>addLast</td><td>O(1) khấu hao</td><td>O(1) nếu có tail</td><td>O(1)</td></tr>
<tr><td>removeLast</td><td>O(1)</td><td><b>O(n)</b> (không có prev!)</td><td><b>O(1)</b></td></tr>
<tr><td>get(i) theo chỉ số</td><td><b>O(1)</b></td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>xoá một nút đang cầm sẵn</td><td>O(n)</td><td>O(n)</td><td><b>O(1)</b></td></tr>
</tbody></table>

<div class="pitfall"><b>Bẫy thi kinh điển.</b> Sinh viên viết <span class="badge">n.next.prev = n.prev</span> <em>sau khi</em> đã ghi đè <span class="badge">n.prev</span>, hoặc quên một trong hai phép ghi — danh sách đi xuôi thì trông vẫn đúng, đi ngược thì hỏng. Luôn cập nhật cả hai chiều trước khi đụng vào thứ khác, và đừng bao giờ xoá header/trailer.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Lính canh tốn 2 nút và mua lại sự đúng đắn.</b> Đây là một mẫu kỹ thuật tổng quát: trả một hằng số bé xíu để xoá sổ cả một lớp trường hợp biên. <span class="badge">list_head</span> của nhân Linux, các cache LRU, và cả ruột <span class="badge">LinkedList</span> của Java đều dùng bố cục vòng/lính canh vì lý do đó. <em>Ngoài giáo trình vì sách trình bày lính canh như một chi tiết cài đặt, trong khi thực tế nó là một nguyên tắc thiết kế: hãy ưu tiên thiết kế khiến trường hợp đặc biệt không tồn tại, thay vì thiết kế bắt bạn phải nhớ xử lý nó.</em></div>
</div>
`,
        },
        {
          title: '1.4 — Java in practice: ArrayList vs LinkedList|||1.4 — Java thực chiến: ArrayList vs LinkedList',
          slug: 'csd201-java-list-api',
          type: 'VIDEO',
          description: 'Chi phí thật của hai cài đặt List trong JDK, iterator, ConcurrentModificationException và cách chọn đúng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>The two Lists in the JDK — and which one to actually use</h2>
<p class="lead">Java ships both structures you just built: <span class="badge">ArrayList</span> (dynamic array) and <span class="badge">LinkedList</span> (doubly linked with sentinel-ish head/tail). They implement the same <span class="badge">List</span> interface, so the compiler will never tell you that you picked the slow one. Only the cost model will.</p>

<h3>The cost model</h3>
<table><thead><tr><th>Operation</th><th>ArrayList</th><th>LinkedList</th></tr></thead><tbody>
<tr><td><span class="badge">get(i)</span> / <span class="badge">set(i,e)</span></td><td><b>O(1)</b></td><td>O(n)</td></tr>
<tr><td><span class="badge">add(e)</span> at the end</td><td>O(1) amortised</td><td>O(1)</td></tr>
<tr><td><span class="badge">add(0,e)</span> at the front</td><td>O(n)</td><td><b>O(1)</b></td></tr>
<tr><td><span class="badge">remove(i)</span></td><td>O(n)</td><td>O(n) to find + O(1) to unlink</td></tr>
<tr><td><span class="badge">iterator.remove()</span></td><td>O(n) per removal</td><td><b>O(1)</b></td></tr>
<tr><td>Memory per element</td><td>1 reference (+ slack)</td><td>1 node = 3 references</td></tr>
</tbody></table>

<h3>Worked example — the loop that turns O(n) into O(n²)</h3>
<pre><span class="tok-type">List</span>&lt;<span class="tok-type">Integer</span>&gt; list = <span class="tok-keyword">new</span> <span class="tok-type">LinkedList</span>&lt;&gt;();
<span class="tok-comment">// ... 100_000 elements ...</span>
<span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = 0; i &lt; list.<span class="tok-function">size</span>(); i++) {
    sum += list.<span class="tok-function">get</span>(i);   <span class="tok-comment">// ← O(i) walk, EVERY iteration</span>
}</pre>
<div class="out"><b>Analysis:</b> iteration i walks i nodes, so total work = 0+1+2+…+(n−1) = <b>n(n−1)/2 ≈ n²/2</b>. With n = 100,000 that is about <b>5 × 10⁹</b> pointer hops — seconds instead of milliseconds.<br>
<b>Fix:</b> use the iterator (or the for-each loop, which compiles to it):<br>
<span class="badge">for (int x : list) sum += x;</span> → each step is one <span class="badge">next</span> hop → total <b>O(n)</b>.<br>
<b>Lesson:</b> the same code is fast on ArrayList and quadratic on LinkedList. Index-based loops are an <em>array</em> idiom.</div>

<h3>Iterators and the exception everyone hits</h3>
<pre><span class="tok-keyword">for</span> (<span class="tok-type">String</span> s : list) {
    <span class="tok-keyword">if</span> (s.<span class="tok-function">isEmpty</span>()) list.<span class="tok-function">remove</span>(s);   <span class="tok-comment">// ✗ ConcurrentModificationException</span>
}

<span class="tok-type">Iterator</span>&lt;<span class="tok-type">String</span>&gt; it = list.<span class="tok-function">iterator</span>();
<span class="tok-keyword">while</span> (it.<span class="tok-function">hasNext</span>()) {
    <span class="tok-keyword">if</span> (it.<span class="tok-function">next</span>().<span class="tok-function">isEmpty</span>()) it.<span class="tok-function">remove</span>();   <span class="tok-comment">// ✓ correct</span>
}</pre>
<p>The collection keeps a <span class="badge">modCount</span>; the iterator remembers the value it saw at creation. Any structural change made behind the iterator's back makes the counters disagree, and the next <span class="badge">next()</span> throws — <strong>fail-fast</strong>, so you get an exception at the bug instead of silent corruption.</p>

<div class="pitfall"><b>"LinkedList is faster for insertion" — half true.</b> Inserting is O(1) only if you are <em>already at the position</em> (holding an iterator). <span class="badge">list.add(k, e)</span> still walks k nodes first. In real benchmarks ArrayList usually wins anyway because arrays are contiguous and CPU-cache friendly, while list nodes are scattered across the heap.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Amortised analysis of ArrayList growth.</b> When full, ArrayList allocates a new array of size ≈1.5× and copies. A single add can cost O(n) — yet <em>n</em> adds cost O(n) total, because the copies happen at sizes 1, 2, 4… whose sum is under 2n. Averaged per operation, that is O(1) <strong>amortised</strong>. <em>Beyond syllabus because the course states "amortised O(1)" without the geometric-series argument — and that argument is exactly what an interviewer asks you to reproduce.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Hai loại List trong JDK — và cái nào nên dùng thật</h2>
<p class="lead">Java có sẵn cả hai cấu trúc bạn vừa dựng: <span class="badge">ArrayList</span> (mảng động) và <span class="badge">LinkedList</span> (liên kết đôi có đầu/đuôi kiểu lính canh). Cả hai cùng hiện thực giao diện <span class="badge">List</span>, nên trình biên dịch sẽ không bao giờ nhắc bạn rằng bạn vừa chọn cái chậm. Chỉ mô hình chi phí mới nói cho bạn biết.</p>

<h3>Mô hình chi phí</h3>
<table><thead><tr><th>Thao tác</th><th>ArrayList</th><th>LinkedList</th></tr></thead><tbody>
<tr><td><span class="badge">get(i)</span> / <span class="badge">set(i,e)</span></td><td><b>O(1)</b></td><td>O(n)</td></tr>
<tr><td><span class="badge">add(e)</span> ở cuối</td><td>O(1) khấu hao</td><td>O(1)</td></tr>
<tr><td><span class="badge">add(0,e)</span> ở đầu</td><td>O(n)</td><td><b>O(1)</b></td></tr>
<tr><td><span class="badge">remove(i)</span></td><td>O(n)</td><td>O(n) để tìm + O(1) để tháo</td></tr>
<tr><td><span class="badge">iterator.remove()</span></td><td>O(n) mỗi lần xoá</td><td><b>O(1)</b></td></tr>
<tr><td>Bộ nhớ mỗi phần tử</td><td>1 tham chiếu (+ chỗ dư)</td><td>1 nút = 3 tham chiếu</td></tr>
</tbody></table>

<h3>Ví dụ có lời giải — vòng lặp biến O(n) thành O(n²)</h3>
<pre><span class="tok-type">List</span>&lt;<span class="tok-type">Integer</span>&gt; list = <span class="tok-keyword">new</span> <span class="tok-type">LinkedList</span>&lt;&gt;();
<span class="tok-comment">// ... 100_000 phần tử ...</span>
<span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = 0; i &lt; list.<span class="tok-function">size</span>(); i++) {
    sum += list.<span class="tok-function">get</span>(i);   <span class="tok-comment">// ← đi bộ O(i), MỖI vòng lặp</span>
}</pre>
<div class="out"><b>Phân tích:</b> vòng thứ i phải đi qua i nút, nên tổng công = 0+1+2+…+(n−1) = <b>n(n−1)/2 ≈ n²/2</b>. Với n = 100.000 là khoảng <b>5 × 10⁹</b> bước nhảy con trỏ — mất vài giây thay vì vài mili-giây.<br>
<b>Cách sửa:</b> dùng iterator (hoặc vòng for-each, vốn biên dịch ra iterator):<br>
<span class="badge">for (int x : list) sum += x;</span> → mỗi bước chỉ một cú nhảy <span class="badge">next</span> → tổng <b>O(n)</b>.<br>
<b>Bài học:</b> cùng một đoạn code chạy nhanh trên ArrayList và bậc hai trên LinkedList. Vòng lặp theo chỉ số là thành ngữ của <em>mảng</em>.</div>

<h3>Iterator và ngoại lệ ai cũng dính</h3>
<pre><span class="tok-keyword">for</span> (<span class="tok-type">String</span> s : list) {
    <span class="tok-keyword">if</span> (s.<span class="tok-function">isEmpty</span>()) list.<span class="tok-function">remove</span>(s);   <span class="tok-comment">// ✗ ConcurrentModificationException</span>
}

<span class="tok-type">Iterator</span>&lt;<span class="tok-type">String</span>&gt; it = list.<span class="tok-function">iterator</span>();
<span class="tok-keyword">while</span> (it.<span class="tok-function">hasNext</span>()) {
    <span class="tok-keyword">if</span> (it.<span class="tok-function">next</span>().<span class="tok-function">isEmpty</span>()) it.<span class="tok-function">remove</span>();   <span class="tok-comment">// ✓ đúng</span>
}</pre>
<p>Tập hợp giữ một biến đếm <span class="badge">modCount</span>; iterator nhớ giá trị nó thấy lúc được tạo. Bất kỳ thay đổi cấu trúc nào làm sau lưng iterator đều khiến hai bộ đếm lệch nhau, và lần <span class="badge">next()</span> kế tiếp ném ngoại lệ — <strong>fail-fast</strong>, tức bạn nhận lỗi ngay tại chỗ sai thay vì hỏng dữ liệu âm thầm.</p>

<div class="pitfall"><b>"LinkedList chèn nhanh hơn" — đúng một nửa.</b> Chèn chỉ O(1) khi bạn <em>đã đứng sẵn ở vị trí đó</em> (đang cầm iterator). <span class="badge">list.add(k, e)</span> vẫn phải đi qua k nút trước. Trong đo đạc thực tế ArrayList thường thắng, vì mảng nằm liền nhau và thân thiện với cache CPU, còn các nút liên kết rải rác khắp heap.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Phân tích khấu hao cho phép nở của ArrayList.</b> Khi đầy, ArrayList cấp phát mảng mới cỡ ≈1,5× rồi chép sang. Một lần add có thể tốn O(n) — nhưng <em>n</em> lần add tốn tổng O(n), vì các lần chép xảy ra ở kích thước 1, 2, 4… mà tổng của chúng nhỏ hơn 2n. Bình quân mỗi thao tác là O(1) <strong>khấu hao</strong>. <em>Ngoài giáo trình vì môn học chỉ ghi "O(1) khấu hao" mà không đưa lập luận cấp số nhân — và chính lập luận đó là thứ người phỏng vấn bắt bạn trình bày lại.</em></div>
</div>
`,
        },
        {
          title: '1.5 — Three classic list problems, solved|||1.5 — Ba bài toán danh sách kinh điển, có lời giải',
          slug: 'csd201-luyen-tap-list',
          type: 'VIDEO',
          description: 'Đảo danh sách, phát hiện chu trình bằng hai con trỏ (Floyd), trộn hai danh sách đã sắp — giải từng bước.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.5</span>
<h2>Three problems that appear in every exam and every interview</h2>
<p class="lead">These three are the standard workout for linked lists. Learn the shape of each — reversal is "three pointers", cycle detection is "two speeds", merging is "compare heads" — and most list questions become variations you already know.</p>

<h3>Problem 1 — Reverse a singly linked list, in place</h3>
<pre>Node&lt;E&gt; <span class="tok-function">reverse</span>(Node&lt;E&gt; head) {
    Node&lt;E&gt; prev = <span class="tok-keyword">null</span>, cur = head;
    <span class="tok-keyword">while</span> (cur != <span class="tok-keyword">null</span>) {
        Node&lt;E&gt; next = cur.next;   <span class="tok-comment">// 1. remember the rest</span>
        cur.next = prev;           <span class="tok-comment">// 2. flip this link</span>
        prev = cur;                <span class="tok-comment">// 3. shift the window</span>
        cur  = next;
    }
    <span class="tok-keyword">return</span> prev;                   <span class="tok-comment">// new head</span>
}</pre>
<div class="out"><b>Trace on A → B → C → null:</b><br>
start: prev=null, cur=A<br>
iter 1: next=B; A.next=null; prev=A; cur=B &nbsp;→&nbsp; list so far: A→null<br>
iter 2: next=C; B.next=A; prev=B; cur=C &nbsp;→&nbsp; B→A→null<br>
iter 3: next=null; C.next=B; prev=C; cur=null &nbsp;→&nbsp; C→B→A→null<br>
loop ends, return prev = <b>C</b>. Cost: <b>O(n) time, O(1) extra space</b>.<br>
<b>Why "next" must be saved first:</b> line 2 destroys <span class="badge">cur.next</span>; without the copy you lose the rest of the list forever.</div>

<h3>Problem 2 — Detect a cycle (Floyd's tortoise and hare)</h3>
<pre><span class="tok-type">boolean</span> <span class="tok-function">hasCycle</span>(Node&lt;E&gt; head) {
    Node&lt;E&gt; slow = head, fast = head;
    <span class="tok-keyword">while</span> (fast != <span class="tok-keyword">null</span> &amp;&amp; fast.next != <span class="tok-keyword">null</span>) {
        slow = slow.next;          <span class="tok-comment">// 1 step</span>
        fast = fast.next.next;     <span class="tok-comment">// 2 steps</span>
        <span class="tok-keyword">if</span> (slow == fast) <span class="tok-keyword">return</span> <span class="tok-keyword">true</span>;
    }
    <span class="tok-keyword">return</span> <span class="tok-keyword">false</span>;
}</pre>
<div class="out"><b>Why it must work:</b> inside a cycle of length c, the fast pointer gains exactly 1 position on the slow pointer per iteration. The gap therefore takes every value 0,1,…,c−1 and must hit 0 within c steps — a meeting is guaranteed. If there is no cycle, fast walks off the end first.<br>
<b>Trace on 1→2→3→4→2 (cycle back to 2):</b> (slow,fast) = (2,3) → (3,2) → (4,4) <b>meet at 4</b> → cycle detected.<br>
<b>Cost:</b> O(n) time, O(1) space — beats the "store every visited node in a HashSet" solution, which needs O(n) memory.</div>

<h3>Problem 3 — Merge two sorted lists</h3>
<pre>Node&lt;<span class="tok-type">Integer</span>&gt; <span class="tok-function">merge</span>(Node&lt;<span class="tok-type">Integer</span>&gt; a, Node&lt;<span class="tok-type">Integer</span>&gt; b) {
    Node&lt;<span class="tok-type">Integer</span>&gt; dummy = <span class="tok-keyword">new</span> Node&lt;&gt;(0), tail = dummy;
    <span class="tok-keyword">while</span> (a != <span class="tok-keyword">null</span> &amp;&amp; b != <span class="tok-keyword">null</span>) {
        <span class="tok-keyword">if</span> (a.element &lt;= b.element) { tail.next = a; a = a.next; }
        <span class="tok-keyword">else</span>                        { tail.next = b; b = b.next; }
        tail = tail.next;
    }
    tail.next = (a != <span class="tok-keyword">null</span>) ? a : b;   <span class="tok-comment">// attach the leftover tail</span>
    <span class="tok-keyword">return</span> dummy.next;
}</pre>
<div class="out"><b>Trace on a = 1→4→7, b = 2→3→9:</b><br>
compare 1,2 → take 1 · compare 4,2 → take 2 · compare 4,3 → take 3 · compare 4,9 → take 4 · compare 7,9 → take 7 · a exhausted → attach 9.<br>
<b>Result:</b> 1→2→3→4→7→9 in <b>O(n+m)</b> with no extra array. Note the <span class="badge">dummy</span> node — the same sentinel trick from 1.3, so you never special-case "the result list is still empty".<br>
<b>This is the merge step of merge-sort</b> (Chapter 6) — you have already written half of that algorithm.</div>

<div class="pitfall"><b>Use <span class="badge">&lt;=</span>, not <span class="badge">&lt;</span>, when comparing equal keys.</b> With <span class="badge">&lt;=</span> the element from list <em>a</em> is taken first, which keeps the merge <strong>stable</strong> — equal records preserve their original relative order. That single character is the difference between a stable and an unstable sort.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Floyd also finds <em>where</em> the cycle starts.</b> After the meeting, reset one pointer to the head and advance both one step at a time; they meet exactly at the cycle entrance. Proof sketch: if the tail before the cycle has length μ and the meeting point is λ into the cycle, then the distance from the head to the entrance and from the meeting point to the entrance are congruent modulo the cycle length. <em>Beyond syllabus because the course only asks "is there a cycle?", while the entrance version is the actual interview question — and the same idea powers Pollard's rho factorisation.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.5</span>
<h2>Ba bài toán xuất hiện trong mọi kỳ thi và mọi buổi phỏng vấn</h2>
<p class="lead">Ba bài này là bài tập thể lực chuẩn cho danh sách liên kết. Nhớ lấy hình dạng của từng bài — đảo danh sách là "ba con trỏ", phát hiện chu trình là "hai tốc độ", trộn là "so hai đầu" — thì hầu hết câu hỏi về danh sách chỉ còn là biến thể bạn đã biết.</p>

<h3>Bài 1 — Đảo ngược danh sách liên kết đơn, tại chỗ</h3>
<pre>Node&lt;E&gt; <span class="tok-function">reverse</span>(Node&lt;E&gt; head) {
    Node&lt;E&gt; prev = <span class="tok-keyword">null</span>, cur = head;
    <span class="tok-keyword">while</span> (cur != <span class="tok-keyword">null</span>) {
        Node&lt;E&gt; next = cur.next;   <span class="tok-comment">// 1. nhớ phần còn lại</span>
        cur.next = prev;           <span class="tok-comment">// 2. lật liên kết này</span>
        prev = cur;                <span class="tok-comment">// 3. dời cửa sổ</span>
        cur  = next;
    }
    <span class="tok-keyword">return</span> prev;                   <span class="tok-comment">// đầu mới</span>
}</pre>
<div class="out"><b>Chạy tay trên A → B → C → null:</b><br>
đầu: prev=null, cur=A<br>
vòng 1: next=B; A.next=null; prev=A; cur=B &nbsp;→&nbsp; đến giờ: A→null<br>
vòng 2: next=C; B.next=A; prev=B; cur=C &nbsp;→&nbsp; B→A→null<br>
vòng 3: next=null; C.next=B; prev=C; cur=null &nbsp;→&nbsp; C→B→A→null<br>
hết vòng, trả về prev = <b>C</b>. Chi phí: <b>O(n) thời gian, O(1) bộ nhớ phụ</b>.<br>
<b>Vì sao phải lưu "next" trước:</b> dòng 2 phá huỷ <span class="badge">cur.next</span>; không có bản sao là mất luôn phần đuôi danh sách.</div>

<h3>Bài 2 — Phát hiện chu trình (rùa và thỏ của Floyd)</h3>
<pre><span class="tok-type">boolean</span> <span class="tok-function">hasCycle</span>(Node&lt;E&gt; head) {
    Node&lt;E&gt; slow = head, fast = head;
    <span class="tok-keyword">while</span> (fast != <span class="tok-keyword">null</span> &amp;&amp; fast.next != <span class="tok-keyword">null</span>) {
        slow = slow.next;          <span class="tok-comment">// 1 bước</span>
        fast = fast.next.next;     <span class="tok-comment">// 2 bước</span>
        <span class="tok-keyword">if</span> (slow == fast) <span class="tok-keyword">return</span> <span class="tok-keyword">true</span>;
    }
    <span class="tok-keyword">return</span> <span class="tok-keyword">false</span>;
}</pre>
<div class="out"><b>Vì sao chắc chắn đúng:</b> bên trong chu trình dài c, con trỏ nhanh rút ngắn khoảng cách với con trỏ chậm đúng 1 vị trí mỗi vòng. Vậy khoảng cách nhận đủ mọi giá trị 0,1,…,c−1 và bắt buộc chạm 0 trong vòng c bước — gặp nhau là chắc chắn. Nếu không có chu trình, con nhanh sẽ ra khỏi đuôi trước.<br>
<b>Chạy tay trên 1→2→3→4→2 (quay lại 2):</b> (slow,fast) = (2,3) → (3,2) → (4,4) <b>gặp nhau tại 4</b> → có chu trình.<br>
<b>Chi phí:</b> O(n) thời gian, O(1) bộ nhớ — hơn hẳn cách "lưu mọi nút đã thăm vào HashSet" vốn tốn O(n) bộ nhớ.</div>

<h3>Bài 3 — Trộn hai danh sách đã sắp xếp</h3>
<pre>Node&lt;<span class="tok-type">Integer</span>&gt; <span class="tok-function">merge</span>(Node&lt;<span class="tok-type">Integer</span>&gt; a, Node&lt;<span class="tok-type">Integer</span>&gt; b) {
    Node&lt;<span class="tok-type">Integer</span>&gt; dummy = <span class="tok-keyword">new</span> Node&lt;&gt;(0), tail = dummy;
    <span class="tok-keyword">while</span> (a != <span class="tok-keyword">null</span> &amp;&amp; b != <span class="tok-keyword">null</span>) {
        <span class="tok-keyword">if</span> (a.element &lt;= b.element) { tail.next = a; a = a.next; }
        <span class="tok-keyword">else</span>                        { tail.next = b; b = b.next; }
        tail = tail.next;
    }
    tail.next = (a != <span class="tok-keyword">null</span>) ? a : b;   <span class="tok-comment">// nối phần đuôi còn lại</span>
    <span class="tok-keyword">return</span> dummy.next;
}</pre>
<div class="out"><b>Chạy tay trên a = 1→4→7, b = 2→3→9:</b><br>
so 1,2 → lấy 1 · so 4,2 → lấy 2 · so 4,3 → lấy 3 · so 4,9 → lấy 4 · so 7,9 → lấy 7 · a hết → nối 9.<br>
<b>Kết quả:</b> 1→2→3→4→7→9 trong <b>O(n+m)</b>, không cần mảng phụ. Để ý nút <span class="badge">dummy</span> — chính mẹo lính canh ở bài 1.3, nhờ đó không phải xét riêng trường hợp "danh sách kết quả còn rỗng".<br>
<b>Đây chính là bước trộn của merge-sort</b> (Chương 6) — bạn đã viết xong một nửa thuật toán đó rồi.</div>

<div class="pitfall"><b>Dùng <span class="badge">&lt;=</span> chứ không phải <span class="badge">&lt;</span> khi hai khoá bằng nhau.</b> Với <span class="badge">&lt;=</span>, phần tử của danh sách <em>a</em> được lấy trước, giữ cho phép trộn <strong>ổn định</strong> — các bản ghi bằng nhau giữ nguyên thứ tự tương đối ban đầu. Đúng một ký tự đó là ranh giới giữa sắp xếp ổn định và không ổn định.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Floyd còn tìm được <em>chỗ bắt đầu</em> của chu trình.</b> Sau khi gặp nhau, đưa một con trỏ về đầu danh sách rồi cho cả hai đi từng bước một; chúng gặp nhau đúng tại cửa vào chu trình. Ý chứng minh: nếu đoạn đuôi trước chu trình dài μ và điểm gặp nằm cách cửa vào λ bước trong chu trình, thì khoảng cách từ đầu tới cửa vào và từ điểm gặp tới cửa vào đồng dư theo độ dài chu trình. <em>Ngoài giáo trình vì môn học chỉ hỏi "có chu trình không?", còn bản tìm cửa vào mới là câu phỏng vấn thật — và cùng ý tưởng đó là nền của thuật toán phân tích thừa số Pollard rho.</em></div>
</div>
`,
        },
        {
          title: 'Quiz 1 — Lists & Linked Lists|||Quiz 1 — Danh sách & Liên kết',
          slug: 'csd201-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra mảng vs danh sách liên kết.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'Accessing element i in an array is…|||Truy cập phần tử i trong mảng là…', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], correctIndex: 1, points: 1 },
              { question: 'Inserting at the front of an array is O(n) because…|||Chèn đầu mảng là O(n) vì…', options: ['arrays are slow|||mảng chậm', 'all following elements must shift right|||mọi phần tử sau phải dời phải', 'it re-sorts|||nó sắp lại', 'it copies to disk|||nó copy ra đĩa'], correctIndex: 1, points: 1 },
              { question: 'A linked list beats an array when you…|||Danh sách liên kết hơn mảng khi bạn…', options: ['need random access by index|||cần truy cập ngẫu nhiên theo chỉ số', 'insert/delete often at known nodes|||chèn/xóa thường tại nút đã biết', 'need contiguous memory|||cần bộ nhớ liền kề', 'never change it|||không bao giờ đổi'], correctIndex: 1, points: 1 },
              { question: 'A doubly linked list node stores…|||Một nút danh sách liên kết đôi lưu…', options: ['only next|||chỉ next', 'both next and prev pointers|||cả con trỏ next và prev', 'an index|||một chỉ số', 'nothing extra|||không thêm gì'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 2 — STACK, QUEUE, PRIORITY QUEUE ══════════════════ */
    {
      title: 'Chapter 2 — Stacks, Queues & Priority Queues|||Chương 2 — Ngăn xếp, Hàng đợi & Hàng đợi ưu tiên',
      description: 'Cấu trúc truy cập có kỷ luật: LIFO, FIFO, deque và hàng đợi ưu tiên dựa trên heap.',
      lessons: [
        {
          title: '2.1 — Stacks (LIFO) & Queues (FIFO)|||2.1 — Ngăn xếp (LIFO) & Hàng đợi (FIFO)',
          slug: 'csd201-stack-queue',
          type: 'VIDEO',
          description: 'Ngăn xếp push/pop đầu; hàng đợi enqueue cuối/dequeue đầu; deque hai đầu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Stacks &amp; Queues — disciplined access</h2>
<p class="lead">A <strong>stack</strong> is last-in-first-out: you only touch the top. A <strong>queue</strong> is first-in-first-out: add at the back, remove at the front. Both are simple, both are everywhere.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Stack (LIFO)</b> — <span class="badge">push</span> / <span class="badge">pop</span> / <span class="badge">peek</span>, all O(1). Undo, function calls, expression evaluation, DFS.</div>
  <div class="lz-layer"><b>Queue (FIFO)</b> — <span class="badge">enqueue</span> / <span class="badge">dequeue</span>, O(1). Task scheduling, BFS, buffers.</div>
  <div class="lz-layer"><b>Deque</b> — a double-ended queue: add/remove at either end.</div>
</div>
<pre><span class="tok-type">Deque</span>&lt;<span class="tok-type">Integer</span>&gt; stack = <span class="tok-keyword">new</span> <span class="tok-function">ArrayDeque</span>&lt;&gt;();
stack.<span class="tok-function">push</span>(1); stack.<span class="tok-function">push</span>(2);
stack.<span class="tok-function">pop</span>();     <span class="tok-comment">// → 2 (last in, first out)</span></pre>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Ring buffers — why a queue must not shift.</b> Implementing a queue on a plain array by shifting every element on dequeue is O(n); real systems use a circular (ring) buffer with head and tail indices that wrap around with modulo, keeping enqueue and dequeue at true O(1). This is how OS I/O buffers and bounded producer–consumer queues are built. <em>The syllabus states queue ops are O(1) but leaves out the wrap-around trick that actually delivers it on an array.</em></div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms#module-503" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Practise: stacks, queues & deques</span><span class="lc-sub">Linear Data Structures module.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Ngăn xếp &amp; Hàng đợi — truy cập có kỷ luật</h2>
<p class="lead"><strong>Ngăn xếp</strong> là vào-sau-ra-trước: chỉ chạm đỉnh. <strong>Hàng đợi</strong> là vào-trước-ra-trước: thêm ở cuối, lấy ở đầu. Cả hai đơn giản, cả hai có mặt khắp nơi.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Ngăn xếp (LIFO)</b> — <span class="badge">push</span> / <span class="badge">pop</span> / <span class="badge">peek</span>, đều O(1). Undo, lời gọi hàm, tính biểu thức, DFS.</div>
  <div class="lz-layer"><b>Hàng đợi (FIFO)</b> — <span class="badge">enqueue</span> / <span class="badge">dequeue</span>, O(1). Lập lịch tác vụ, BFS, bộ đệm.</div>
  <div class="lz-layer"><b>Deque</b> — hàng đợi hai đầu: thêm/lấy ở cả hai đầu.</div>
</div>
<pre><span class="tok-type">Deque</span>&lt;<span class="tok-type">Integer</span>&gt; stack = <span class="tok-keyword">new</span> <span class="tok-function">ArrayDeque</span>&lt;&gt;();
stack.<span class="tok-function">push</span>(1); stack.<span class="tok-function">push</span>(2);
stack.<span class="tok-function">pop</span>();     <span class="tok-comment">// → 2 (vào sau, ra trước)</span></pre>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Bộ đệm vòng (ring buffer) — vì sao hàng đợi không được dời.</b> Cài hàng đợi trên mảng thường bằng cách dời mọi phần tử khi dequeue là O(n); hệ thống thực dùng bộ đệm vòng với chỉ số head và tail quay vòng bằng phép chia lấy dư, giữ enqueue và dequeue thật sự O(1). Đây là cách xây bộ đệm I/O của hệ điều hành và hàng đợi sản xuất–tiêu thụ có giới hạn. <em>Giáo trình nói thao tác hàng đợi là O(1) nhưng bỏ qua mẹo quay vòng thực sự tạo ra điều đó trên mảng.</em></div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms#module-503" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Luyện: ngăn xếp, hàng đợi & deque</span><span class="lc-sub">Module Linear Data Structures.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '2.2 — Implementing stacks & queues: circular array vs linked|||2.2 — Cài đặt stack & queue: mảng vòng vs liên kết',
          slug: 'csd201-stack-queue-cai-dat',
          type: 'VIDEO',
          description: 'Hai cách cài đặt, phép chia dư biến mảng thành vòng, và cách phân biệt đầy/rỗng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Two ways to build them — and the modulo trick that makes an array circular</h2>
<p class="lead">A stack is easy either way: push/pop always happen at one end. A <strong>queue</strong> is where the array version gets interesting, because naively removing from the front means shifting everything left — O(n) per dequeue. The fix is to never move the data: move the <em>indices</em> instead, and wrap them around with <span class="badge">%</span>.</p>

<h3>The circular array queue</h3>
<pre><span class="tok-keyword">public class</span> <span class="tok-type">ArrayQueue</span>&lt;E&gt; {
    <span class="tok-keyword">private</span> <span class="tok-type">E</span>[] data;
    <span class="tok-keyword">private</span> <span class="tok-type">int</span> f = 0;      <span class="tok-comment">// index of the front element</span>
    <span class="tok-keyword">private</span> <span class="tok-type">int</span> sz = 0;     <span class="tok-comment">// number of elements</span>

    <span class="tok-keyword">public void</span> <span class="tok-function">enqueue</span>(<span class="tok-type">E</span> e) {
        <span class="tok-keyword">if</span> (sz == data.length) <span class="tok-keyword">throw new</span> <span class="tok-type">IllegalStateException</span>(<span class="tok-string">"Queue full"</span>);
        <span class="tok-type">int</span> avail = (f + sz) % data.length;   <span class="tok-comment">// ← the wrap</span>
        data[avail] = e;
        sz++;
    }
    <span class="tok-keyword">public</span> <span class="tok-type">E</span> <span class="tok-function">dequeue</span>() {
        <span class="tok-keyword">if</span> (sz == 0) <span class="tok-keyword">return null</span>;
        <span class="tok-type">E</span> answer = data[f];
        data[f] = <span class="tok-keyword">null</span>;                       <span class="tok-comment">// help the GC</span>
        f = (f + 1) % data.length;            <span class="tok-comment">// ← the wrap</span>
        sz--;
        <span class="tok-keyword">return</span> answer;
    }
}</pre>

<h3>Worked example — watch the indices wrap</h3>
<div class="out"><b>Capacity 5, start empty (f=0, sz=0).</b><br>
enqueue A,B,C,D → slots 0..3 filled, f=0, sz=4 → [A B C D _]<br>
dequeue ×2 → returns A then B; f moves 0→1→2, sz=2 → [_ _ C D _]<br>
enqueue E → avail = (2+2)%5 = 4 → [_ _ C D E], sz=3<br>
enqueue F → avail = (2+3)%5 = <b>0</b> → wraps to the front! → [F _ C D E], sz=4<br>
<b>Logical order is still C, D, E, F</b> — the physical order in the array is meaningless; only <span class="badge">f</span> and <span class="badge">sz</span> define the queue. Every operation is <b>O(1)</b>, nothing is ever shifted.</div>

<h3>Why store <span class="badge">size</span> instead of a rear index</h3>
<p>If you keep only <span class="badge">f</span> and <span class="badge">r</span>, then "empty" (f == r) and "full" (f == r) look identical. Textbooks solve it by wasting one slot (full means <span class="badge">(r+1)%N == f</span>). Keeping <span class="badge">sz</span> is simpler and uses the whole array.</p>

<h3>Linked implementation — the other choice</h3>
<table><thead><tr><th></th><th>Circular array</th><th>Singly linked (head + tail)</th></tr></thead><tbody>
<tr><td>enqueue / dequeue</td><td>O(1)</td><td>O(1)</td></tr>
<tr><td>Capacity</td><td>Fixed (or resize + copy)</td><td>Unbounded</td></tr>
<tr><td>Memory per element</td><td>1 slot</td><td>Node = data + next</td></tr>
<tr><td>Cache behaviour</td><td><b>Excellent</b> (contiguous)</td><td>Poor (scattered)</td></tr>
</tbody></table>

<div class="pitfall"><b>Forgetting <span class="badge">data[f] = null</span> after dequeue</b> is a real memory leak: the array still references an object nobody can reach, so the garbage collector cannot free it. This is exactly the bug Java's own <span class="badge">ArrayDeque</span> had to be careful about.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Circular buffers run the real world.</b> Audio drivers, network cards, keyboard input, and logging systems all use a fixed-size circular buffer (a "ring buffer"): a producer writes at the head, a consumer reads at the tail, and if the producer laps the consumer you drop the oldest data on purpose. LMAX Disruptor — a famous low-latency trading queue — is a ring buffer whose size is a power of two, so <span class="badge">% N</span> becomes a single bitwise <span class="badge">&amp; (N−1)</span>. <em>Beyond syllabus because the course stops at "modulo makes it circular", while the industrial version adds the power-of-two trick and the overwrite policy.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Hai cách dựng — và mẹo chia dư biến mảng thành vòng tròn</h2>
<p class="lead">Ngăn xếp thì dễ theo cả hai cách: push/pop luôn xảy ra ở một đầu. <strong>Hàng đợi</strong> mới là chỗ bản mảng trở nên thú vị, vì lấy phần tử đầu ra một cách ngây thơ nghĩa là dời toàn bộ sang trái — O(n) mỗi lần lấy. Cách chữa là đừng bao giờ dời dữ liệu: hãy dời <em>chỉ số</em>, và cho chúng quay vòng bằng <span class="badge">%</span>.</p>

<h3>Hàng đợi bằng mảng vòng</h3>
<pre><span class="tok-keyword">public class</span> <span class="tok-type">ArrayQueue</span>&lt;E&gt; {
    <span class="tok-keyword">private</span> <span class="tok-type">E</span>[] data;
    <span class="tok-keyword">private</span> <span class="tok-type">int</span> f = 0;      <span class="tok-comment">// chỉ số phần tử đầu</span>
    <span class="tok-keyword">private</span> <span class="tok-type">int</span> sz = 0;     <span class="tok-comment">// số phần tử</span>

    <span class="tok-keyword">public void</span> <span class="tok-function">enqueue</span>(<span class="tok-type">E</span> e) {
        <span class="tok-keyword">if</span> (sz == data.length) <span class="tok-keyword">throw new</span> <span class="tok-type">IllegalStateException</span>(<span class="tok-string">"Queue full"</span>);
        <span class="tok-type">int</span> avail = (f + sz) % data.length;   <span class="tok-comment">// ← chỗ quay vòng</span>
        data[avail] = e;
        sz++;
    }
    <span class="tok-keyword">public</span> <span class="tok-type">E</span> <span class="tok-function">dequeue</span>() {
        <span class="tok-keyword">if</span> (sz == 0) <span class="tok-keyword">return null</span>;
        <span class="tok-type">E</span> answer = data[f];
        data[f] = <span class="tok-keyword">null</span>;                       <span class="tok-comment">// giúp bộ dọn rác</span>
        f = (f + 1) % data.length;            <span class="tok-comment">// ← chỗ quay vòng</span>
        sz--;
        <span class="tok-keyword">return</span> answer;
    }
}</pre>

<h3>Ví dụ có lời giải — nhìn chỉ số quay vòng</h3>
<div class="out"><b>Sức chứa 5, bắt đầu rỗng (f=0, sz=0).</b><br>
enqueue A,B,C,D → lấp ô 0..3, f=0, sz=4 → [A B C D _]<br>
dequeue ×2 → trả A rồi B; f dời 0→1→2, sz=2 → [_ _ C D _]<br>
enqueue E → avail = (2+2)%5 = 4 → [_ _ C D E], sz=3<br>
enqueue F → avail = (2+3)%5 = <b>0</b> → quay về đầu mảng! → [F _ C D E], sz=4<br>
<b>Thứ tự logic vẫn là C, D, E, F</b> — thứ tự vật lý trong mảng không có ý nghĩa; chỉ <span class="badge">f</span> và <span class="badge">sz</span> mới định nghĩa hàng đợi. Mọi thao tác đều <b>O(1)</b>, không bao giờ phải dời chỗ.</div>

<h3>Vì sao lưu <span class="badge">size</span> thay vì chỉ số cuối</h3>
<p>Nếu chỉ giữ <span class="badge">f</span> và <span class="badge">r</span> thì "rỗng" (f == r) và "đầy" (f == r) trông y hệt nhau. Sách giải quyết bằng cách bỏ phí một ô (đầy nghĩa là <span class="badge">(r+1)%N == f</span>). Giữ <span class="badge">sz</span> vừa đơn giản hơn vừa dùng hết mảng.</p>

<h3>Bản liên kết — lựa chọn còn lại</h3>
<table><thead><tr><th></th><th>Mảng vòng</th><th>Liên kết đơn (head + tail)</th></tr></thead><tbody>
<tr><td>enqueue / dequeue</td><td>O(1)</td><td>O(1)</td></tr>
<tr><td>Sức chứa</td><td>Cố định (hoặc nở + chép)</td><td>Không giới hạn</td></tr>
<tr><td>Bộ nhớ mỗi phần tử</td><td>1 ô</td><td>Nút = dữ liệu + next</td></tr>
<tr><td>Ứng xử với cache</td><td><b>Rất tốt</b> (liền nhau)</td><td>Kém (rải rác)</td></tr>
</tbody></table>

<div class="pitfall"><b>Quên <span class="badge">data[f] = null</span> sau khi dequeue</b> là rò rỉ bộ nhớ thật: mảng vẫn giữ tham chiếu tới một đối tượng không ai với tới được, nên bộ dọn rác không giải phóng được. Đây đúng là lỗi mà <span class="badge">ArrayDeque</span> của chính Java phải cẩn thận tránh.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Bộ đệm vòng vận hành thế giới thật.</b> Trình điều khiển âm thanh, card mạng, bộ nhập bàn phím và hệ thống ghi log đều dùng bộ đệm vòng cỡ cố định ("ring buffer"): bên sản xuất ghi ở đầu, bên tiêu thụ đọc ở đuôi, và nếu bên sản xuất vượt qua bên tiêu thụ thì cố ý bỏ dữ liệu cũ nhất. LMAX Disruptor — hàng đợi độ trễ cực thấp nổi tiếng của giới giao dịch — là một ring buffer có kích thước luỹ thừa của 2, nhờ đó <span class="badge">% N</span> trở thành một phép <span class="badge">&amp; (N−1)</span> trên bit. <em>Ngoài giáo trình vì môn học dừng ở "chia dư làm nó thành vòng", còn bản công nghiệp thêm mẹo luỹ thừa 2 và chính sách ghi đè.</em></div>
</div>
`,
        },
        {
          title: '2.3 — Stack applications: brackets, RPN, undo|||2.3 — Ứng dụng ngăn xếp: dấu ngoặc, RPN, undo',
          slug: 'csd201-stack-ung-dung',
          type: 'VIDEO',
          description: 'Bốn ứng dụng kinh điển của stack, giải từng bước — và vì sao stack luôn xuất hiện khi có tính lồng nhau.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>Where stacks show up — anywhere something is nested</h2>
<p class="lead">One rule explains every stack application: <strong>whenever the most recently opened thing must be closed first, you need a stack.</strong> Brackets, HTML tags, function calls, undo history, backtracking — all the same shape.</p>

<h3>Application 1 — Balanced brackets</h3>
<pre><span class="tok-type">boolean</span> <span class="tok-function">isBalanced</span>(<span class="tok-type">String</span> s) {
    <span class="tok-type">Deque</span>&lt;<span class="tok-type">Character</span>&gt; st = <span class="tok-keyword">new</span> <span class="tok-type">ArrayDeque</span>&lt;&gt;();
    <span class="tok-type">String</span> open = <span class="tok-string">"([{"</span>, close = <span class="tok-string">")]}"</span>;
    <span class="tok-keyword">for</span> (<span class="tok-type">char</span> c : s.<span class="tok-function">toCharArray</span>()) {
        <span class="tok-keyword">if</span> (open.<span class="tok-function">indexOf</span>(c) &gt;= 0) st.<span class="tok-function">push</span>(c);
        <span class="tok-keyword">else if</span> (close.<span class="tok-function">indexOf</span>(c) &gt;= 0) {
            <span class="tok-keyword">if</span> (st.<span class="tok-function">isEmpty</span>()) <span class="tok-keyword">return false</span>;                 <span class="tok-comment">// closed with nothing open</span>
            <span class="tok-keyword">if</span> (open.<span class="tok-function">indexOf</span>(st.<span class="tok-function">pop</span>()) != close.<span class="tok-function">indexOf</span>(c))
                <span class="tok-keyword">return false</span>;                              <span class="tok-comment">// wrong type</span>
        }
    }
    <span class="tok-keyword">return</span> st.<span class="tok-function">isEmpty</span>();                                <span class="tok-comment">// nothing left open</span>
}</pre>
<div class="out"><b>Trace on <span class="badge">{[a+(b)]}</span>:</b> push { · push [ · push ( · see ) → pop ( ✓ · see ] → pop [ ✓ · see } → pop { ✓ · end, stack empty → <b>true</b>.<br>
<b>Trace on <span class="badge">([)]</span>:</b> push ( · push [ · see ) → pop gives [ , which does not match ( → <b>false</b>. Note that counting brackets would wrongly accept this string — order matters, and only a stack captures order.</div>

<h3>Application 2 — Evaluating postfix (RPN)</h3>
<p>In Reverse Polish Notation the operator follows its operands: <span class="badge">3 4 + 2 *</span> means (3+4)×2. No brackets are needed, and evaluation is a single pass.</p>
<div class="out"><b>Evaluate <span class="badge">5 1 2 + 4 * + 3 −</span>:</b><br>
push 5 → [5] · push 1 → [5,1] · push 2 → [5,1,2]<br>
<span class="badge">+</span> → pop 2, pop 1 → push 3 → [5,3]<br>
push 4 → [5,3,4] · <span class="badge">*</span> → pop 4, pop 3 → push 12 → [5,12]<br>
<span class="badge">+</span> → pop 12, pop 5 → push 17 → [17]<br>
push 3 → [17,3] · <span class="badge">−</span> → pop 3, pop 17 → push <b>14</b><br>
<b>Answer: 14.</b> Watch the operand order: for <span class="badge">−</span> and <span class="badge">/</span> the <em>second</em> value popped is the left operand. Swapping them is the most common exam mistake.</div>

<h3>Application 3 — Undo/redo</h3>
<p>Two stacks. Every action is pushed onto <em>undo</em>. Ctrl+Z pops from <em>undo</em>, applies the inverse, and pushes onto <em>redo</em>. Ctrl+Y does the reverse. Performing a brand-new action clears <em>redo</em> — which is exactly why your redo history disappears the moment you type something after undoing.</p>

<h3>Application 4 — Removing recursion</h3>
<p>Any recursive algorithm can be rewritten iteratively with an explicit stack, because that is precisely what the JVM does for you: each call frame (parameters, locals, return address) is pushed on the <strong>call stack</strong>. Chapter 3 uses this to explain <span class="badge">StackOverflowError</span>, and Chapter 4 uses it for iterative tree traversal.</p>

<div class="pitfall"><b>Do not use <span class="badge">java.util.Stack</span>.</b> It extends <span class="badge">Vector</span>, so every method is synchronised (slow), and — worse — it iterates from the <em>bottom</em> up, the opposite of what you expect. The JDK's own docs recommend <span class="badge">ArrayDeque</span>: <span class="badge">Deque&lt;E&gt; st = new ArrayDeque&lt;&gt;();</span> with push/pop/peek.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Infix → postfix: the shunting-yard algorithm.</b> Dijkstra's algorithm converts ordinary <span class="badge">3+4*2</span> into RPN with one stack for operators and one output list, popping while the operator on top has higher-or-equal precedence. It is how calculators, spreadsheet formula engines and expression parsers work. <em>Beyond syllabus because CSD201 only evaluates postfix that is handed to you; producing it is the step a real compiler front-end must perform.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Ngăn xếp xuất hiện ở đâu — ở bất cứ đâu có sự lồng nhau</h2>
<p class="lead">Một quy tắc giải thích mọi ứng dụng của stack: <strong>khi nào thứ mở gần nhất phải được đóng trước, khi đó bạn cần một ngăn xếp.</strong> Dấu ngoặc, thẻ HTML, lời gọi hàm, lịch sử hoàn tác, quay lui — tất cả cùng một hình dạng.</p>

<h3>Ứng dụng 1 — Kiểm tra dấu ngoặc cân bằng</h3>
<pre><span class="tok-type">boolean</span> <span class="tok-function">isBalanced</span>(<span class="tok-type">String</span> s) {
    <span class="tok-type">Deque</span>&lt;<span class="tok-type">Character</span>&gt; st = <span class="tok-keyword">new</span> <span class="tok-type">ArrayDeque</span>&lt;&gt;();
    <span class="tok-type">String</span> open = <span class="tok-string">"([{"</span>, close = <span class="tok-string">")]}"</span>;
    <span class="tok-keyword">for</span> (<span class="tok-type">char</span> c : s.<span class="tok-function">toCharArray</span>()) {
        <span class="tok-keyword">if</span> (open.<span class="tok-function">indexOf</span>(c) &gt;= 0) st.<span class="tok-function">push</span>(c);
        <span class="tok-keyword">else if</span> (close.<span class="tok-function">indexOf</span>(c) &gt;= 0) {
            <span class="tok-keyword">if</span> (st.<span class="tok-function">isEmpty</span>()) <span class="tok-keyword">return false</span>;                 <span class="tok-comment">// đóng mà chưa mở</span>
            <span class="tok-keyword">if</span> (open.<span class="tok-function">indexOf</span>(st.<span class="tok-function">pop</span>()) != close.<span class="tok-function">indexOf</span>(c))
                <span class="tok-keyword">return false</span>;                              <span class="tok-comment">// sai loại ngoặc</span>
        }
    }
    <span class="tok-keyword">return</span> st.<span class="tok-function">isEmpty</span>();                                <span class="tok-comment">// không còn gì đang mở</span>
}</pre>
<div class="out"><b>Chạy tay trên <span class="badge">{[a+(b)]}</span>:</b> push { · push [ · push ( · gặp ) → pop ( ✓ · gặp ] → pop [ ✓ · gặp } → pop { ✓ · hết chuỗi, stack rỗng → <b>true</b>.<br>
<b>Chạy tay trên <span class="badge">([)]</span>:</b> push ( · push [ · gặp ) → pop ra [ , không khớp ( → <b>false</b>. Để ý: cách "đếm số dấu ngoặc" sẽ chấp nhận nhầm chuỗi này — thứ tự mới là điều quan trọng, và chỉ ngăn xếp mới nắm được thứ tự.</div>

<h3>Ứng dụng 2 — Tính biểu thức hậu tố (RPN)</h3>
<p>Trong ký pháp Ba Lan ngược, toán tử đứng sau toán hạng: <span class="badge">3 4 + 2 *</span> nghĩa là (3+4)×2. Không cần dấu ngoặc, và tính chỉ trong một lượt duyệt.</p>
<div class="out"><b>Tính <span class="badge">5 1 2 + 4 * + 3 −</span>:</b><br>
push 5 → [5] · push 1 → [5,1] · push 2 → [5,1,2]<br>
<span class="badge">+</span> → pop 2, pop 1 → push 3 → [5,3]<br>
push 4 → [5,3,4] · <span class="badge">*</span> → pop 4, pop 3 → push 12 → [5,12]<br>
<span class="badge">+</span> → pop 12, pop 5 → push 17 → [17]<br>
push 3 → [17,3] · <span class="badge">−</span> → pop 3, pop 17 → push <b>14</b><br>
<b>Đáp số: 14.</b> Để ý thứ tự toán hạng: với <span class="badge">−</span> và <span class="badge">/</span> thì giá trị pop ra <em>thứ hai</em> mới là toán hạng bên trái. Đảo hai cái này là lỗi thi phổ biến nhất.</div>

<h3>Ứng dụng 3 — Hoàn tác/làm lại</h3>
<p>Hai ngăn xếp. Mỗi hành động được push vào <em>undo</em>. Ctrl+Z pop khỏi <em>undo</em>, thi hành phép nghịch đảo, rồi push vào <em>redo</em>. Ctrl+Y làm ngược lại. Thực hiện một hành động mới sẽ xoá sạch <em>redo</em> — chính vì thế lịch sử làm-lại biến mất ngay khi bạn gõ thêm gì đó sau khi hoàn tác.</p>

<h3>Ứng dụng 4 — Khử đệ quy</h3>
<p>Mọi thuật toán đệ quy đều viết lại được thành vòng lặp với một ngăn xếp tường minh, bởi vì đó đúng là điều JVM làm hộ bạn: mỗi khung lời gọi (tham số, biến cục bộ, địa chỉ trở về) được đẩy lên <strong>call stack</strong>. Chương 3 dùng điều này để giải thích <span class="badge">StackOverflowError</span>, còn Chương 4 dùng nó để duyệt cây không đệ quy.</p>

<div class="pitfall"><b>Đừng dùng <span class="badge">java.util.Stack</span>.</b> Nó kế thừa <span class="badge">Vector</span> nên mọi phương thức đều đồng bộ hoá (chậm), và tệ hơn — nó duyệt từ <em>đáy</em> lên, ngược với trực giác. Chính tài liệu JDK khuyên dùng <span class="badge">ArrayDeque</span>: <span class="badge">Deque&lt;E&gt; st = new ArrayDeque&lt;&gt;();</span> với push/pop/peek.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Trung tố → hậu tố: thuật toán sân ga (shunting-yard).</b> Thuật toán của Dijkstra biến biểu thức thường <span class="badge">3+4*2</span> thành RPN bằng một ngăn xếp toán tử và một danh sách kết quả, cứ pop khi toán tử trên đỉnh có độ ưu tiên lớn hơn hoặc bằng. Đó là cách máy tính bỏ túi, bộ máy công thức bảng tính và các trình phân tích biểu thức hoạt động. <em>Ngoài giáo trình vì CSD201 chỉ tính biểu thức hậu tố đã cho sẵn; còn tạo ra nó mới là bước mà một trình biên dịch thật phải làm.</em></div>
</div>
`,
        },
        {
          title: '2.4 — Deques & the sliding-window maximum|||2.4 — Deque & bài toán cửa sổ trượt',
          slug: 'csd201-deque',
          type: 'VIDEO',
          description: 'Hàng đợi hai đầu: API, cài đặt, và bài toán kinh điển deque giải trong O(n) còn cách ngây thơ mất O(nk).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>Deque — a queue that opens at both ends</h2>
<p class="lead">A <strong>double-ended queue</strong> (pronounced "deck") supports insert and remove at <em>both</em> the front and the rear, all in O(1). It is a strict superset of both a stack and a queue — which is why <span class="badge">ArrayDeque</span> is the JDK's recommended implementation of both.</p>

<h3>The API (Goodrich naming vs Java naming)</h3>
<table><thead><tr><th>Goodrich</th><th>Java <span class="badge">Deque</span></th><th>Meaning</th></tr></thead><tbody>
<tr><td>addFirst(e)</td><td>addFirst / push / offerFirst</td><td>insert at the front</td></tr>
<tr><td>addLast(e)</td><td>addLast / offer / offerLast</td><td>insert at the rear</td></tr>
<tr><td>removeFirst()</td><td>removeFirst / pop / poll</td><td>remove from the front</td></tr>
<tr><td>removeLast()</td><td>removeLast / pollLast</td><td>remove from the rear</td></tr>
<tr><td>first() / last()</td><td>peekFirst / peekLast</td><td>look without removing</td></tr>
</tbody></table>
<p>Use it as a <strong>stack</strong> with push/pop (both at the front), or as a <strong>queue</strong> with offer/poll (rear in, front out). One class, two behaviours.</p>

<h3>Worked example — sliding-window maximum in O(n)</h3>
<p>Given an array and a window of width k, report the maximum of every window. The naive solution rescans each window: O(n·k). The deque solution keeps <em>indices</em> in decreasing order of value, so the front is always the current maximum.</p>
<pre><span class="tok-type">int</span>[] <span class="tok-function">maxWindow</span>(<span class="tok-type">int</span>[] a, <span class="tok-type">int</span> k) {
    <span class="tok-type">Deque</span>&lt;<span class="tok-type">Integer</span>&gt; dq = <span class="tok-keyword">new</span> <span class="tok-type">ArrayDeque</span>&lt;&gt;();     <span class="tok-comment">// holds indices</span>
    <span class="tok-type">int</span>[] out = <span class="tok-keyword">new</span> <span class="tok-type">int</span>[a.length - k + 1];
    <span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = 0; i &lt; a.length; i++) {
        <span class="tok-keyword">while</span> (!dq.<span class="tok-function">isEmpty</span>() &amp;&amp; dq.<span class="tok-function">peekFirst</span>() &lt;= i - k) dq.<span class="tok-function">pollFirst</span>();   <span class="tok-comment">// expired</span>
        <span class="tok-keyword">while</span> (!dq.<span class="tok-function">isEmpty</span>() &amp;&amp; a[dq.<span class="tok-function">peekLast</span>()] &lt;= a[i]) dq.<span class="tok-function">pollLast</span>();  <span class="tok-comment">// dominated</span>
        dq.<span class="tok-function">addLast</span>(i);
        <span class="tok-keyword">if</span> (i &gt;= k - 1) out[i - k + 1] = a[dq.<span class="tok-function">peekFirst</span>()];
    }
    <span class="tok-keyword">return</span> out;
}</pre>
<div class="out"><b>Trace on a = [1, 3, −1, −3, 5], k = 3</b> (deque shown as values):<br>
i=0: push 1 → [1]<br>
i=1: 3 ≥ 1 → drop 1, push 3 → [3]<br>
i=2: −1 &lt; 3 → push → [3, −1] · window complete → max = <b>3</b><br>
i=3: −3 &lt; −1 → push → [3, −1, −3] · front index 1 still inside → max = <b>3</b><br>
i=4: 5 ≥ −3, ≥ −1, ≥ 3 → drop all three, push 5 → [5] → max = <b>5</b><br>
<b>Output: [3, 3, 5].</b> Each index is pushed once and popped at most once → total work <b>O(n)</b>, versus O(n·k) for rescanning.</div>

<div class="pitfall"><b>Store indices, not values.</b> You must know <em>when</em> an element leaves the window; a bare value cannot tell you that. This is the single detail that makes the algorithm work — and the one students most often get wrong.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The "monotonic deque" is a whole technique.</b> Keeping a deque sorted by value turns many O(n·k) scanning problems into O(n): sliding-window minimum, the largest rectangle in a histogram, "next greater element", and several dynamic-programming optimisations. <em>Beyond syllabus because CSD201 introduces the deque as a data structure only; competitive programming treats it as an algorithmic tool with its own name — and it is one of the highest-value patterns to recognise in an interview.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Deque — hàng đợi mở ở cả hai đầu</h2>
<p class="lead"><strong>Hàng đợi hai đầu</strong> (đọc là "đếc") cho phép chèn và xoá ở <em>cả</em> đầu lẫn đuôi, tất cả trong O(1). Nó là tập cha nghiêm ngặt của cả ngăn xếp lẫn hàng đợi — đó là lý do <span class="badge">ArrayDeque</span> là cài đặt được JDK khuyên dùng cho cả hai.</p>

<h3>Bộ thao tác (tên theo Goodrich vs tên trong Java)</h3>
<table><thead><tr><th>Goodrich</th><th>Java <span class="badge">Deque</span></th><th>Ý nghĩa</th></tr></thead><tbody>
<tr><td>addFirst(e)</td><td>addFirst / push / offerFirst</td><td>chèn vào đầu</td></tr>
<tr><td>addLast(e)</td><td>addLast / offer / offerLast</td><td>chèn vào đuôi</td></tr>
<tr><td>removeFirst()</td><td>removeFirst / pop / poll</td><td>lấy ra từ đầu</td></tr>
<tr><td>removeLast()</td><td>removeLast / pollLast</td><td>lấy ra từ đuôi</td></tr>
<tr><td>first() / last()</td><td>peekFirst / peekLast</td><td>xem mà không lấy ra</td></tr>
</tbody></table>
<p>Dùng nó như <strong>ngăn xếp</strong> với push/pop (cùng ở đầu), hoặc như <strong>hàng đợi</strong> với offer/poll (vào đuôi, ra đầu). Một lớp, hai hành vi.</p>

<h3>Ví dụ có lời giải — cực đại cửa sổ trượt trong O(n)</h3>
<p>Cho một mảng và cửa sổ rộng k, hãy báo cực đại của từng cửa sổ. Cách ngây thơ quét lại mỗi cửa sổ: O(n·k). Cách dùng deque giữ <em>chỉ số</em> theo thứ tự giá trị giảm dần, nên đầu deque luôn là cực đại hiện tại.</p>
<pre><span class="tok-type">int</span>[] <span class="tok-function">maxWindow</span>(<span class="tok-type">int</span>[] a, <span class="tok-type">int</span> k) {
    <span class="tok-type">Deque</span>&lt;<span class="tok-type">Integer</span>&gt; dq = <span class="tok-keyword">new</span> <span class="tok-type">ArrayDeque</span>&lt;&gt;();     <span class="tok-comment">// chứa chỉ số</span>
    <span class="tok-type">int</span>[] out = <span class="tok-keyword">new</span> <span class="tok-type">int</span>[a.length - k + 1];
    <span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = 0; i &lt; a.length; i++) {
        <span class="tok-keyword">while</span> (!dq.<span class="tok-function">isEmpty</span>() &amp;&amp; dq.<span class="tok-function">peekFirst</span>() &lt;= i - k) dq.<span class="tok-function">pollFirst</span>();   <span class="tok-comment">// hết hạn</span>
        <span class="tok-keyword">while</span> (!dq.<span class="tok-function">isEmpty</span>() &amp;&amp; a[dq.<span class="tok-function">peekLast</span>()] &lt;= a[i]) dq.<span class="tok-function">pollLast</span>();  <span class="tok-comment">// bị lấn át</span>
        dq.<span class="tok-function">addLast</span>(i);
        <span class="tok-keyword">if</span> (i &gt;= k - 1) out[i - k + 1] = a[dq.<span class="tok-function">peekFirst</span>()];
    }
    <span class="tok-keyword">return</span> out;
}</pre>
<div class="out"><b>Chạy tay trên a = [1, 3, −1, −3, 5], k = 3</b> (deque hiển thị theo giá trị):<br>
i=0: đẩy 1 → [1]<br>
i=1: 3 ≥ 1 → bỏ 1, đẩy 3 → [3]<br>
i=2: −1 &lt; 3 → đẩy → [3, −1] · cửa sổ đủ → cực đại = <b>3</b><br>
i=3: −3 &lt; −1 → đẩy → [3, −1, −3] · chỉ số đầu là 1 vẫn còn trong cửa sổ → cực đại = <b>3</b><br>
i=4: 5 ≥ −3, ≥ −1, ≥ 3 → bỏ cả ba, đẩy 5 → [5] → cực đại = <b>5</b><br>
<b>Kết quả: [3, 3, 5].</b> Mỗi chỉ số vào đúng một lần và ra nhiều nhất một lần → tổng công <b>O(n)</b>, so với O(n·k) nếu quét lại.</div>

<div class="pitfall"><b>Lưu chỉ số, đừng lưu giá trị.</b> Bạn phải biết phần tử <em>khi nào</em> rời khỏi cửa sổ; một giá trị trần trụi không nói được điều đó. Đây chính là chi tiết làm thuật toán chạy đúng — và cũng là chỗ sinh viên hay sai nhất.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Deque đơn điệu" là cả một kỹ thuật.</b> Giữ deque sắp theo giá trị biến rất nhiều bài quét O(n·k) thành O(n): cực tiểu cửa sổ trượt, hình chữ nhật lớn nhất trong biểu đồ cột, "phần tử lớn kế tiếp", và vài phép tối ưu quy hoạch động. <em>Ngoài giáo trình vì CSD201 chỉ giới thiệu deque như một cấu trúc dữ liệu; giới lập trình thi đấu coi nó là một công cụ thuật toán có tên riêng — và là một trong những mẫu đáng nhận ra nhất khi phỏng vấn.</em></div>
</div>
`,
        },
        {
          title: '2.5 — Priority Queues & Heaps|||2.5 — Hàng đợi ưu tiên & Heap',
          slug: 'csd201-priority-queue-heap',
          type: 'VIDEO',
          description: 'Hàng đợi ưu tiên luôn lấy phần tử "quan trọng nhất"; heap nhị phân cho phép O(log n).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2>Priority Queues &amp; Heaps</h2>
<p class="lead">A <strong>priority queue</strong> always removes the highest-priority item, not the oldest. The efficient implementation is a <strong>binary heap</strong> — a complete binary tree kept in an array where each parent outranks its children.</p>
<div class="out"><b>Min-heap:</b> the smallest element is always at the root. Insert and remove-min are both O(log n); peek-min is O(1).</div>
<pre><span class="tok-type">PriorityQueue</span>&lt;<span class="tok-type">Integer</span>&gt; pq = <span class="tok-keyword">new</span> <span class="tok-function">PriorityQueue</span>&lt;&gt;();
pq.<span class="tok-function">add</span>(5); pq.<span class="tok-function">add</span>(1); pq.<span class="tok-function">add</span>(3);
pq.<span class="tok-function">poll</span>();   <span class="tok-comment">// → 1 (smallest first)</span></pre>
<p>Heaps power heap sort, Dijkstra's shortest path, and Huffman coding — you will meet all three later in this course.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Building a heap is O(n), not O(n log n).</b> Inserting n elements one by one costs O(n log n), but Floyd's bottom-up heapify — sift down from the last internal node up to the root — builds the whole heap in O(n). The proof relies on most nodes sitting near the leaves where sift-down is cheap, so the sum telescopes to linear. <em>Courses teach insert as O(log n) and stop; the surprising O(n) bulk-build is a favourite exam trick.</em></div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms#module-507" target="_blank" rel="noopener">
  <span class="lc-ico">⛰️</span>
  <span class="lc-body"><span class="lc-title">Practise: Heaps (with sorting & hashing)</span><span class="lc-sub">Advanced Sorting, Hashing &amp; Heaps module.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2>Hàng đợi ưu tiên &amp; Heap</h2>
<p class="lead"><strong>Hàng đợi ưu tiên</strong> luôn lấy phần tử ưu tiên cao nhất, không phải cũ nhất. Cách cài đặt hiệu quả là <strong>heap nhị phân</strong> — một cây nhị phân đầy đủ lưu trong mảng, nơi mỗi cha "trội" hơn các con.</p>
<div class="out"><b>Min-heap:</b> phần tử nhỏ nhất luôn ở gốc. Chèn và lấy-min đều O(log n); xem-min là O(1).</div>
<pre><span class="tok-type">PriorityQueue</span>&lt;<span class="tok-type">Integer</span>&gt; pq = <span class="tok-keyword">new</span> <span class="tok-function">PriorityQueue</span>&lt;&gt;();
pq.<span class="tok-function">add</span>(5); pq.<span class="tok-function">add</span>(1); pq.<span class="tok-function">add</span>(3);
pq.<span class="tok-function">poll</span>();   <span class="tok-comment">// → 1 (nhỏ nhất trước)</span></pre>
<p>Heap là động cơ của heap sort, tìm đường ngắn nhất Dijkstra, và mã hóa Huffman — bạn sẽ gặp cả ba sau trong môn này.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Dựng một heap là O(n), không phải O(n log n).</b> Chèn từng phần tử một tốn O(n log n), nhưng heapify từ dưới lên của Floyd — sift-down từ nút trong cuối cùng lên tới gốc — dựng cả heap trong O(n). Chứng minh dựa vào việc hầu hết nút nằm gần lá nơi sift-down rẻ, nên tổng co lại thành tuyến tính. <em>Giáo trình dạy chèn là O(log n) rồi dừng; cách dựng hàng loạt O(n) bất ngờ là mẹo thi ưa thích.</em></div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms#module-507" target="_blank" rel="noopener">
  <span class="lc-ico">⛰️</span>
  <span class="lc-body"><span class="lc-title">Luyện: Heap (kèm sắp xếp & băm)</span><span class="lc-sub">Module Advanced Sorting, Hashing &amp; Heaps.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 3 — ĐỆ QUY ══════════════════ */
    {
      title: 'Chapter 3 — Recursion|||Chương 3 — Đệ quy',
      description: 'Hàm gọi chính nó: định nghĩa đệ quy, ca cơ sở, và call stack.',
      lessons: [
        {
          title: '3.1 — Recursion & the call stack|||3.1 — Đệ quy & call stack',
          slug: 'csd201-de-quy',
          simulation: {
            url: 'https://media.cuongthai.com/videos/academy/CSD201/csd201-de-quy.mp4',
            poster: 'https://media.cuongthai.com/videos/academy/CSD201/csd201-de-quy.jpg',
            scenario: 'stack-heap',
            durationSeconds: 25,
            caption: { en: "Frames pile up until the stack runs out", vi: "Khung hàm chồng lên nhau cho tới khi hết ngăn xếp" },
          },
          type: 'VIDEO',
          description: 'Ca cơ sở + ca đệ quy; call stack; và bẫy đệ quy ngây thơ O(2ⁿ).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Recursion — a function that calls itself</h2>
<p class="lead">A recursive solution defines a problem in terms of smaller versions of itself. It needs two things: a <strong>base case</strong> that stops, and a <strong>recursive case</strong> that moves toward it.</p>
<pre><span class="tok-type">long</span> <span class="tok-function">factorial</span>(<span class="tok-type">int</span> n) {
    <span class="tok-keyword">if</span> (n &lt;= 1) <span class="tok-keyword">return</span> 1;      <span class="tok-comment">// base case</span>
    <span class="tok-keyword">return</span> n * <span class="tok-function">factorial</span>(n - 1); <span class="tok-comment">// recursive case</span>
}</pre>
<div class="out">factorial(4) = 4·3·2·1 = 24. Each call waits on the stack until the one below returns.</div>
<div class="pitfall"><b>Trap:</b> naive recursion can explode. Fibonacci as <span class="badge">fib(n-1)+fib(n-2)</span> recomputes the same values billions of times — O(2ⁿ). Add memoisation (cache results) to make it O(n). Also: a missing base case → <span class="badge">StackOverflowError</span>.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Tail-call optimisation — and why Java lacks it.</b> When a recursive call is the very last action, some compilers reuse the current stack frame instead of adding a new one, turning the recursion into a loop that never overflows the stack. Scheme, Scala and many functional languages guarantee this, but the JVM deliberately does not — so deep tail recursion in Java still throws StackOverflowError and must be rewritten as iteration. <em>The syllabus warns about stack overflow but not that the usual fix is a language-level optimisation Java chose to omit.</em></div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms#module-504" target="_blank" rel="noopener">
  <span class="lc-ico">🌀</span>
  <span class="lc-body"><span class="lc-title">Practise: Recursion fundamentals</span><span class="lc-sub">Searching, Sorting &amp; Recursion module.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Đệ quy — hàm gọi chính nó</h2>
<p class="lead">Lời giải đệ quy định nghĩa bài toán theo các phiên bản nhỏ hơn của chính nó. Nó cần hai thứ: một <strong>ca cơ sở</strong> để dừng, và một <strong>ca đệ quy</strong> tiến về phía đó.</p>
<pre><span class="tok-type">long</span> <span class="tok-function">factorial</span>(<span class="tok-type">int</span> n) {
    <span class="tok-keyword">if</span> (n &lt;= 1) <span class="tok-keyword">return</span> 1;      <span class="tok-comment">// ca cơ sở</span>
    <span class="tok-keyword">return</span> n * <span class="tok-function">factorial</span>(n - 1); <span class="tok-comment">// ca đệ quy</span>
}</pre>
<div class="out">factorial(4) = 4·3·2·1 = 24. Mỗi lời gọi chờ trên call stack tới khi lời gọi dưới trả về.</div>
<div class="pitfall"><b>Bẫy:</b> đệ quy ngây thơ có thể bùng nổ. Fibonacci dạng <span class="badge">fib(n-1)+fib(n-2)</span> tính lại cùng giá trị hàng tỷ lần — O(2ⁿ). Thêm ghi nhớ (cache kết quả) để thành O(n). Ngoài ra: thiếu ca cơ sở → <span class="badge">StackOverflowError</span>.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Tối ưu đệ quy đuôi — và vì sao Java không có.</b> Khi lời gọi đệ quy là hành động cuối cùng, một số trình biên dịch tái dùng khung ngăn xếp hiện tại thay vì thêm khung mới, biến đệ quy thành vòng lặp không bao giờ tràn stack. Scheme, Scala và nhiều ngôn ngữ hàm đảm bảo điều này, nhưng JVM cố ý không — nên đệ quy đuôi sâu trong Java vẫn ném StackOverflowError và phải viết lại thành vòng lặp. <em>Giáo trình cảnh báo tràn stack nhưng không nói cách sửa thường là một tối ưu cấp ngôn ngữ mà Java chọn bỏ.</em></div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms#module-504" target="_blank" rel="noopener">
  <span class="lc-ico">🌀</span>
  <span class="lc-body"><span class="lc-title">Luyện: Đệ quy nền tảng</span><span class="lc-sub">Module Searching, Sorting &amp; Recursion.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '3.2 — The four classic recursions|||3.2 — Bốn ví dụ đệ quy kinh điển',
          slug: 'csd201-de-quy-vi-du',
          type: 'VIDEO',
          description: 'Giai thừa, vẽ thước, tìm kiếm nhị phân đệ quy, duyệt cây thư mục — bốn ví dụ của Goodrich, giải từng bước.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Four recursions that teach four different shapes</h2>
<p class="lead">Goodrich opens the recursion chapter with four examples on purpose: each has a different <em>branching pattern</em>, and the pattern decides the cost. Learn to see the shape, not just the code.</p>

<h3>1. Factorial — linear recursion (one call per level)</h3>
<pre><span class="tok-type">int</span> <span class="tok-function">fact</span>(<span class="tok-type">int</span> n) {
    <span class="tok-keyword">if</span> (n == 0) <span class="tok-keyword">return</span> 1;        <span class="tok-comment">// base case</span>
    <span class="tok-keyword">return</span> n * <span class="tok-function">fact</span>(n - 1);      <span class="tok-comment">// recursive case</span>
}</pre>
<div class="out"><b>Trace fact(4):</b> fact(4) → 4·fact(3) → 4·3·fact(2) → 4·3·2·fact(1) → 4·3·2·1·fact(0) → 4·3·2·1·1 = <b>24</b>.<br>
The stack grows to depth n and then unwinds: <b>O(n) time, O(n) stack space</b>. Notice the multiplication happens on the way <em>back up</em> — nothing is computed on the way down.</div>

<h3>2. The English ruler — multiple recursion (two calls, drawing between them)</h3>
<pre><span class="tok-keyword">void</span> <span class="tok-function">drawInterval</span>(<span class="tok-type">int</span> len) {
    <span class="tok-keyword">if</span> (len &gt; 0) {
        <span class="tok-function">drawInterval</span>(len - 1);   <span class="tok-comment">// upper half</span>
        <span class="tok-function">drawLine</span>(len);           <span class="tok-comment">// the centre tick</span>
        <span class="tok-function">drawInterval</span>(len - 1);   <span class="tok-comment">// lower half</span>
    }
}</pre>
<div class="out"><b>drawInterval(3)</b> prints ticks of length 1,2,1,3,1,2,1 — that is 2³−1 = <b>7 lines</b> from 2⁴−1 = 15 calls. Each extra unit of length <em>doubles</em> the work: <b>O(2ⁿ)</b>. This is the shape that makes naive Fibonacci exponential too.</div>

<h3>3. Binary search — binary recursion that discards half</h3>
<pre><span class="tok-type">int</span> <span class="tok-function">bsearch</span>(<span class="tok-type">int</span>[] a, <span class="tok-type">int</span> target, <span class="tok-type">int</span> lo, <span class="tok-type">int</span> hi) {
    <span class="tok-keyword">if</span> (lo &gt; hi) <span class="tok-keyword">return</span> -1;                       <span class="tok-comment">// not found</span>
    <span class="tok-type">int</span> mid = lo + (hi - lo) / 2;                 <span class="tok-comment">// overflow-safe midpoint</span>
    <span class="tok-keyword">if</span> (a[mid] == target) <span class="tok-keyword">return</span> mid;
    <span class="tok-keyword">if</span> (a[mid] &gt; target)  <span class="tok-keyword">return</span> <span class="tok-function">bsearch</span>(a, target, lo, mid - 1);
    <span class="tok-keyword">else</span>                  <span class="tok-keyword">return</span> <span class="tok-function">bsearch</span>(a, target, mid + 1, hi);
}</pre>
<div class="out"><b>Search 22 in [2,4,5,7,8,9,12,14,17,19,22,25,27,28,33,37] (n=16):</b><br>
lo=0, hi=15 → mid=7 → a[7]=14 &lt; 22 → search right half<br>
lo=8, hi=15 → mid=11 → a[11]=25 &gt; 22 → search left<br>
lo=8, hi=10 → mid=9 → a[9]=19 &lt; 22 → search right<br>
lo=10, hi=10 → mid=10 → a[10]=22 ✓ → <b>found at index 10 in 4 probes</b>.<br>
Each call halves the range: log₂16 = 4 — <b>O(log n)</b>. Two calls appear in the code but only <em>one</em> ever runs, so the recursion is a single chain.</div>

<h3>4. File-system traversal — recursion over a tree</h3>
<pre><span class="tok-type">long</span> <span class="tok-function">diskUsage</span>(<span class="tok-type">File</span> root) {
    <span class="tok-type">long</span> total = root.<span class="tok-function">length</span>();
    <span class="tok-keyword">if</span> (root.<span class="tok-function">isDirectory</span>())
        <span class="tok-keyword">for</span> (<span class="tok-type">String</span> child : root.<span class="tok-function">list</span>())
            total += <span class="tok-function">diskUsage</span>(<span class="tok-keyword">new</span> <span class="tok-type">File</span>(root, child));
    <span class="tok-keyword">return</span> total;
}</pre>
<p>The recursion mirrors the data: a directory contains directories. This is the first time recursion is not an optimisation but the <em>natural</em> expression of the structure — the same reason tree traversal in Chapter 4 is written recursively.</p>

<div class="pitfall"><b>Missing or unreachable base case = <span class="badge">StackOverflowError</span>.</b> <span class="badge">fact(-1)</span> in the code above never hits <span class="badge">n == 0</span> and recurses forever. Always ask: does every recursive call move <em>strictly</em> toward the base case? Guard the input, or use <span class="badge">if (n &lt;= 0) return 1;</span>.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why <span class="badge">lo + (hi − lo) / 2</span> and not <span class="badge">(lo + hi) / 2</span>.</b> For arrays larger than 2³⁰ elements, <span class="badge">lo + hi</span> overflows a 32-bit <span class="badge">int</span> and goes negative, producing a negative index. This exact bug lived in Java's own <span class="badge">Arrays.binarySearch</span> — and in the JDK's merge sort — for nine years, until Joshua Bloch published "Nearly All Binary Searches Are Broken" in 2006. <em>Beyond syllabus because the textbook writes the naive midpoint; the safe form is what production code and interviewers expect.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Bốn phép đệ quy dạy bốn hình dạng khác nhau</h2>
<p class="lead">Goodrich mở đầu chương đệ quy bằng bốn ví dụ một cách có chủ đích: mỗi ví dụ có một <em>kiểu phân nhánh</em> riêng, và chính kiểu phân nhánh quyết định chi phí. Hãy học cách nhìn ra hình dạng, chứ không chỉ đọc code.</p>

<h3>1. Giai thừa — đệ quy tuyến tính (một lời gọi mỗi tầng)</h3>
<pre><span class="tok-type">int</span> <span class="tok-function">fact</span>(<span class="tok-type">int</span> n) {
    <span class="tok-keyword">if</span> (n == 0) <span class="tok-keyword">return</span> 1;        <span class="tok-comment">// trường hợp cơ sở</span>
    <span class="tok-keyword">return</span> n * <span class="tok-function">fact</span>(n - 1);      <span class="tok-comment">// trường hợp đệ quy</span>
}</pre>
<div class="out"><b>Chạy tay fact(4):</b> fact(4) → 4·fact(3) → 4·3·fact(2) → 4·3·2·fact(1) → 4·3·2·1·fact(0) → 4·3·2·1·1 = <b>24</b>.<br>
Ngăn xếp lớn dần tới độ sâu n rồi cuộn ngược: <b>O(n) thời gian, O(n) bộ nhớ ngăn xếp</b>. Để ý phép nhân xảy ra trên đường <em>quay về</em> — lúc đi xuống không tính gì cả.</div>

<h3>2. Thước Anh — đệ quy bội (hai lời gọi, vẽ ở giữa)</h3>
<pre><span class="tok-keyword">void</span> <span class="tok-function">drawInterval</span>(<span class="tok-type">int</span> len) {
    <span class="tok-keyword">if</span> (len &gt; 0) {
        <span class="tok-function">drawInterval</span>(len - 1);   <span class="tok-comment">// nửa trên</span>
        <span class="tok-function">drawLine</span>(len);           <span class="tok-comment">// vạch ở giữa</span>
        <span class="tok-function">drawInterval</span>(len - 1);   <span class="tok-comment">// nửa dưới</span>
    }
}</pre>
<div class="out"><b>drawInterval(3)</b> in ra các vạch dài 1,2,1,3,1,2,1 — tức 2³−1 = <b>7 dòng</b> từ 2⁴−1 = 15 lời gọi. Mỗi đơn vị độ dài tăng thêm làm khối lượng công việc <em>nhân đôi</em>: <b>O(2ⁿ)</b>. Đây cũng là hình dạng khiến Fibonacci đệ quy ngây thơ trở nên hàm mũ.</div>

<h3>3. Tìm kiếm nhị phân — đệ quy nhị phân nhưng bỏ đi một nửa</h3>
<pre><span class="tok-type">int</span> <span class="tok-function">bsearch</span>(<span class="tok-type">int</span>[] a, <span class="tok-type">int</span> target, <span class="tok-type">int</span> lo, <span class="tok-type">int</span> hi) {
    <span class="tok-keyword">if</span> (lo &gt; hi) <span class="tok-keyword">return</span> -1;                       <span class="tok-comment">// không tìm thấy</span>
    <span class="tok-type">int</span> mid = lo + (hi - lo) / 2;                 <span class="tok-comment">// điểm giữa an toàn tràn số</span>
    <span class="tok-keyword">if</span> (a[mid] == target) <span class="tok-keyword">return</span> mid;
    <span class="tok-keyword">if</span> (a[mid] &gt; target)  <span class="tok-keyword">return</span> <span class="tok-function">bsearch</span>(a, target, lo, mid - 1);
    <span class="tok-keyword">else</span>                  <span class="tok-keyword">return</span> <span class="tok-function">bsearch</span>(a, target, mid + 1, hi);
}</pre>
<div class="out"><b>Tìm 22 trong [2,4,5,7,8,9,12,14,17,19,22,25,27,28,33,37] (n=16):</b><br>
lo=0, hi=15 → mid=7 → a[7]=14 &lt; 22 → tìm nửa phải<br>
lo=8, hi=15 → mid=11 → a[11]=25 &gt; 22 → tìm nửa trái<br>
lo=8, hi=10 → mid=9 → a[9]=19 &lt; 22 → tìm nửa phải<br>
lo=10, hi=10 → mid=10 → a[10]=22 ✓ → <b>tìm thấy ở chỉ số 10 sau 4 lần so</b>.<br>
Mỗi lời gọi cắt đôi phạm vi: log₂16 = 4 — <b>O(log n)</b>. Code có hai lời gọi nhưng chỉ <em>một</em> cái thực sự chạy, nên đệ quy vẫn là một chuỗi đơn.</div>

<h3>4. Duyệt hệ thống tệp — đệ quy trên cây</h3>
<pre><span class="tok-type">long</span> <span class="tok-function">diskUsage</span>(<span class="tok-type">File</span> root) {
    <span class="tok-type">long</span> total = root.<span class="tok-function">length</span>();
    <span class="tok-keyword">if</span> (root.<span class="tok-function">isDirectory</span>())
        <span class="tok-keyword">for</span> (<span class="tok-type">String</span> child : root.<span class="tok-function">list</span>())
            total += <span class="tok-function">diskUsage</span>(<span class="tok-keyword">new</span> <span class="tok-type">File</span>(root, child));
    <span class="tok-keyword">return</span> total;
}</pre>
<p>Đệ quy ở đây phản chiếu chính dữ liệu: một thư mục chứa các thư mục. Đây là lần đầu đệ quy không phải là mẹo tối ưu mà là cách diễn đạt <em>tự nhiên</em> của cấu trúc — cũng là lý do phép duyệt cây ở Chương 4 được viết đệ quy.</p>

<div class="pitfall"><b>Thiếu hoặc không bao giờ chạm tới trường hợp cơ sở = <span class="badge">StackOverflowError</span>.</b> <span class="badge">fact(-1)</span> trong code trên không bao giờ gặp <span class="badge">n == 0</span> nên đệ quy vô tận. Luôn tự hỏi: mọi lời gọi đệ quy có tiến <em>nghiêm ngặt</em> về phía cơ sở không? Hãy chặn đầu vào, hoặc viết <span class="badge">if (n &lt;= 0) return 1;</span>.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao viết <span class="badge">lo + (hi − lo) / 2</span> chứ không phải <span class="badge">(lo + hi) / 2</span>.</b> Với mảng lớn hơn 2³⁰ phần tử, <span class="badge">lo + hi</span> tràn kiểu <span class="badge">int</span> 32-bit và thành số âm, sinh ra chỉ số âm. Đúng lỗi này từng nằm trong chính <span class="badge">Arrays.binarySearch</span> của Java — và trong merge sort của JDK — suốt chín năm, cho tới khi Joshua Bloch công bố bài "Nearly All Binary Searches Are Broken" năm 2006. <em>Ngoài giáo trình vì sách viết điểm giữa theo kiểu ngây thơ; dạng an toàn mới là thứ code sản xuất và người phỏng vấn mong đợi.</em></div>
</div>
`,
        },
        {
          title: '3.3 — Analysing recursion: recursion trees & the Master theorem|||3.3 — Phân tích đệ quy: cây đệ quy & định lý Thợ',
          slug: 'csd201-de-quy-phan-tich',
          type: 'VIDEO',
          description: 'Cách biến một hàm đệ quy thành hệ thức truy hồi rồi ra Big-O — kèm bộ công thức tra nhanh.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>From code to recurrence to Big-O</h2>
<p class="lead">You cannot count loops in a recursive method — there are none. Instead you write a <strong>recurrence</strong>: the cost T(n) expressed in terms of the cost of the smaller calls. Then you solve it. Two tools do 95% of the work: the recursion tree, and the Master theorem.</p>

<h3>Step 1 — read the recurrence off the code</h3>
<div class="formula"><span class="lbl">RECURRENCE</span>T(n) = a · T(n / b) + f(n)</div>
<ul>
<li><b>a</b> = how many recursive calls actually run</li>
<li><b>n / b</b> = the size each call receives (use n − 1 if you subtract instead of divide)</li>
<li><b>f(n)</b> = the work done in this call outside the recursion (the combine/partition step)</li>
</ul>

<h3>Step 2 — the Master theorem (for T(n) = a·T(n/b) + f(n), a ≥ 1, b &gt; 1)</h3>
<div class="formula"><span class="lbl">COMPARE</span>f(n) &nbsp;vs&nbsp; n<sup>log<sub>b</sub>a</sup></div>
<table><thead><tr><th>Case</th><th>Condition</th><th>Result</th></tr></thead><tbody>
<tr><td>1 — leaves dominate</td><td>f(n) grows slower than n<sup>log<sub>b</sub>a</sup></td><td>T(n) = Θ(n<sup>log<sub>b</sub>a</sup>)</td></tr>
<tr><td>2 — balanced</td><td>f(n) = Θ(n<sup>log<sub>b</sub>a</sup>)</td><td>T(n) = Θ(n<sup>log<sub>b</sub>a</sup> · log n)</td></tr>
<tr><td>3 — root dominates</td><td>f(n) grows faster (and is regular)</td><td>T(n) = Θ(f(n))</td></tr>
</tbody></table>

<h3>Worked example 1 — merge sort</h3>
<div class="out">Merge sort makes 2 calls on n/2 and merges in linear time: <b>T(n) = 2T(n/2) + n</b>.<br>
a = 2, b = 2 → n<sup>log₂2</sup> = n¹ = n. And f(n) = n. They are equal → <b>Case 2</b>.<br>
<b>T(n) = Θ(n log n).</b> ✓ matches the known bound.</div>

<h3>Worked example 2 — binary search</h3>
<div class="out">One call on n/2, constant work: <b>T(n) = T(n/2) + 1</b>.<br>
a = 1, b = 2 → n<sup>log₂1</sup> = n⁰ = 1. f(n) = 1 → equal → <b>Case 2</b> with log factor:<br>
<b>T(n) = Θ(log n).</b> ✓</div>

<h3>Worked example 3 — naive Fibonacci (why it explodes)</h3>
<div class="out"><span class="badge">fib(n) = fib(n−1) + fib(n−2)</span> subtracts instead of dividing, so the Master theorem does not apply. Draw the recursion tree: the depth is n and each level nearly doubles → about <b>1.618ⁿ</b> calls (the golden ratio φ).<br>
<b>Check by hand:</b> fib(5) makes 15 calls, fib(10) makes 177, fib(30) makes over 2.7 million — and fib(50) would take days.<br>
<b>Fix — memoisation:</b> store each computed value in an array; every subproblem is then solved once → <b>O(n)</b>. This one-line change is the doorway to dynamic programming.</div>

<h3>Quick-reference table</h3>
<table><thead><tr><th>Recurrence</th><th>Solution</th><th>Typical algorithm</th></tr></thead><tbody>
<tr><td>T(n) = T(n−1) + 1</td><td>O(n)</td><td>linear recursion, factorial</td></tr>
<tr><td>T(n) = T(n−1) + n</td><td>O(n²)</td><td>quicksort worst case, selection sort</td></tr>
<tr><td>T(n) = T(n/2) + 1</td><td>O(log n)</td><td>binary search</td></tr>
<tr><td>T(n) = 2T(n/2) + 1</td><td>O(n)</td><td>tree traversal, build-heap</td></tr>
<tr><td>T(n) = 2T(n/2) + n</td><td>O(n log n)</td><td>merge sort, average quicksort</td></tr>
<tr><td>T(n) = 2T(n−1) + 1</td><td>O(2ⁿ)</td><td>Hanoi towers, the English ruler</td></tr>
</tbody></table>

<div class="pitfall"><b>Count the calls that <em>run</em>, not the calls that <em>appear</em>.</b> Binary search has two recursive calls in the source but executes only one, so a = 1, not 2. Reading a = 2 there gives O(n) instead of O(log n) — a wrong answer for the classic exam question.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Recursion also costs memory, and the stack is small.</b> Each frame stores parameters, locals and a return address; the JVM's default thread stack is about 512 KB–1 MB, which overflows at roughly 10,000–20,000 frames. So an O(n)-depth recursion on a million-element list crashes even though its time complexity looks fine. That is why quicksort implementations recurse into the <em>smaller</em> half and loop on the larger one — bounding stack depth to O(log n). <em>Beyond syllabus because the course analyses time only, while depth is the constraint that actually breaks production code.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Từ code tới hệ thức truy hồi rồi ra Big-O</h2>
<p class="lead">Bạn không thể đếm vòng lặp trong một hàm đệ quy — làm gì có vòng lặp nào. Thay vào đó hãy viết một <strong>hệ thức truy hồi</strong>: chi phí T(n) diễn đạt qua chi phí của các lời gọi nhỏ hơn. Rồi giải nó. Hai công cụ làm 95% công việc: cây đệ quy và định lý Thợ (Master theorem).</p>

<h3>Bước 1 — đọc hệ thức truy hồi ra từ code</h3>
<div class="formula"><span class="lbl">HỆ THỨC</span>T(n) = a · T(n / b) + f(n)</div>
<ul>
<li><b>a</b> = có bao nhiêu lời gọi đệ quy thực sự chạy</li>
<li><b>n / b</b> = kích thước mỗi lời gọi nhận được (dùng n − 1 nếu bạn trừ thay vì chia)</li>
<li><b>f(n)</b> = công làm trong lời gọi này ngoài phần đệ quy (bước gộp/phân hoạch)</li>
</ul>

<h3>Bước 2 — định lý Thợ (cho T(n) = a·T(n/b) + f(n), a ≥ 1, b &gt; 1)</h3>
<div class="formula"><span class="lbl">SO SÁNH</span>f(n) &nbsp;với&nbsp; n<sup>log<sub>b</sub>a</sup></div>
<table><thead><tr><th>Trường hợp</th><th>Điều kiện</th><th>Kết quả</th></tr></thead><tbody>
<tr><td>1 — lá chiếm ưu thế</td><td>f(n) tăng chậm hơn n<sup>log<sub>b</sub>a</sup></td><td>T(n) = Θ(n<sup>log<sub>b</sub>a</sup>)</td></tr>
<tr><td>2 — cân bằng</td><td>f(n) = Θ(n<sup>log<sub>b</sub>a</sup>)</td><td>T(n) = Θ(n<sup>log<sub>b</sub>a</sup> · log n)</td></tr>
<tr><td>3 — gốc chiếm ưu thế</td><td>f(n) tăng nhanh hơn (và đều đặn)</td><td>T(n) = Θ(f(n))</td></tr>
</tbody></table>

<h3>Ví dụ có lời giải 1 — merge sort</h3>
<div class="out">Merge sort gọi 2 lần trên n/2 và trộn trong thời gian tuyến tính: <b>T(n) = 2T(n/2) + n</b>.<br>
a = 2, b = 2 → n<sup>log₂2</sup> = n¹ = n. Còn f(n) = n. Hai bên bằng nhau → <b>Trường hợp 2</b>.<br>
<b>T(n) = Θ(n log n).</b> ✓ khớp với cận đã biết.</div>

<h3>Ví dụ có lời giải 2 — tìm kiếm nhị phân</h3>
<div class="out">Một lời gọi trên n/2, công hằng số: <b>T(n) = T(n/2) + 1</b>.<br>
a = 1, b = 2 → n<sup>log₂1</sup> = n⁰ = 1. f(n) = 1 → bằng nhau → <b>Trường hợp 2</b> nên nhân thêm log:<br>
<b>T(n) = Θ(log n).</b> ✓</div>

<h3>Ví dụ có lời giải 3 — Fibonacci ngây thơ (vì sao nó nổ)</h3>
<div class="out"><span class="badge">fib(n) = fib(n−1) + fib(n−2)</span> trừ đi chứ không chia, nên định lý Thợ không áp dụng được. Hãy vẽ cây đệ quy: độ sâu là n và mỗi tầng gần như nhân đôi → khoảng <b>1,618ⁿ</b> lời gọi (tỉ lệ vàng φ).<br>
<b>Kiểm bằng tay:</b> fib(5) tốn 15 lời gọi, fib(10) tốn 177, fib(30) hơn 2,7 triệu — còn fib(50) thì mất nhiều ngày.<br>
<b>Cách chữa — ghi nhớ (memoisation):</b> lưu mỗi giá trị đã tính vào mảng; mỗi bài toán con khi đó chỉ giải một lần → <b>O(n)</b>. Thay đổi một dòng này chính là cánh cửa dẫn vào quy hoạch động.</div>

<h3>Bảng tra nhanh</h3>
<table><thead><tr><th>Hệ thức</th><th>Nghiệm</th><th>Thuật toán tiêu biểu</th></tr></thead><tbody>
<tr><td>T(n) = T(n−1) + 1</td><td>O(n)</td><td>đệ quy tuyến tính, giai thừa</td></tr>
<tr><td>T(n) = T(n−1) + n</td><td>O(n²)</td><td>quicksort xấu nhất, selection sort</td></tr>
<tr><td>T(n) = T(n/2) + 1</td><td>O(log n)</td><td>tìm kiếm nhị phân</td></tr>
<tr><td>T(n) = 2T(n/2) + 1</td><td>O(n)</td><td>duyệt cây, build-heap</td></tr>
<tr><td>T(n) = 2T(n/2) + n</td><td>O(n log n)</td><td>merge sort, quicksort trung bình</td></tr>
<tr><td>T(n) = 2T(n−1) + 1</td><td>O(2ⁿ)</td><td>tháp Hà Nội, thước Anh</td></tr>
</tbody></table>

<div class="pitfall"><b>Đếm số lời gọi <em>chạy</em>, không phải số lời gọi <em>xuất hiện</em>.</b> Tìm kiếm nhị phân có hai lời gọi đệ quy trong mã nguồn nhưng chỉ chạy một, nên a = 1 chứ không phải 2. Đọc thành a = 2 sẽ ra O(n) thay vì O(log n) — đáp án sai cho đúng câu hỏi thi kinh điển.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đệ quy còn tốn bộ nhớ, và ngăn xếp thì nhỏ.</b> Mỗi khung lưu tham số, biến cục bộ và địa chỉ trở về; ngăn xếp luồng mặc định của JVM khoảng 512 KB–1 MB, tràn ở cỡ 10.000–20.000 khung. Vậy nên một đệ quy sâu O(n) trên danh sách một triệu phần tử sẽ sập dù độ phức tạp thời gian trông vẫn ổn. Đó là lý do các cài đặt quicksort đệ quy vào nửa <em>nhỏ hơn</em> và lặp trên nửa lớn — chặn độ sâu ngăn xếp ở O(log n). <em>Ngoài giáo trình vì môn học chỉ phân tích thời gian, trong khi độ sâu mới là ràng buộc làm sập code thật.</em></div>
</div>
`,
        },
        {
          title: '3.4 — Designing recursion & eliminating tail calls|||3.4 — Thiết kế đệ quy & khử đệ quy đuôi',
          slug: 'csd201-de-quy-thiet-ke',
          type: 'VIDEO',
          description: 'Quy trình 4 bước thiết kế hàm đệ quy, ba dạng đệ quy, và cách chuyển đệ quy đuôi thành vòng lặp.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>How to design a recursion — and when to remove it</h2>
<p class="lead">Recursion feels like magic until you have a checklist. Then it becomes mechanical: identify the base case, shrink the problem, trust the recursive call, combine. The hardest part is the third step — the "leap of faith" that the smaller call already works.</p>

<h3>The four-step recipe</h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>1. Base case</b><span>The smallest input you can answer with no recursion at all.</span></div>
  <div class="lz-fitem"><b>2. Shrink</b><span>Express the problem in terms of a strictly smaller one.</span></div>
  <div class="lz-fitem"><b>3. Leap of faith</b><span>Assume the recursive call returns the correct answer for that smaller input.</span></div>
  <div class="lz-fitem"><b>4. Combine</b><span>Build this level's answer from the sub-answer.</span></div>
</div>

<h3>Worked example — sum of an array, designed step by step</h3>
<div class="out"><b>1. Base case:</b> an empty range (lo &gt; hi) sums to 0.<br>
<b>2. Shrink:</b> sum(a, lo, hi) = a[lo] + sum(a, lo+1, hi) — one element smaller.<br>
<b>3. Faith:</b> assume sum(a, lo+1, hi) is right.<br>
<b>4. Combine:</b> add a[lo].<br>
<b>Verify on [3, 7, 2]:</b> sum(0,2) = 3 + sum(1,2) = 3 + (7 + sum(2,2)) = 3 + (7 + (2 + 0)) = <b>12</b> ✓<br>
<b>Alternative shrink (binary):</b> split in half — sum(lo,mid) + sum(mid+1,hi). Same O(n) work, but depth drops from n to log n, so it survives a million elements.</div>

<h3>The three shapes, named</h3>
<table><thead><tr><th>Shape</th><th>Calls per level</th><th>Example</th><th>Typical cost</th></tr></thead><tbody>
<tr><td><b>Linear</b></td><td>1</td><td>factorial, list sum, reverse</td><td>O(n)</td></tr>
<tr><td><b>Binary</b></td><td>2, each on ~half</td><td>merge sort, tree traversal</td><td>O(n log n) or O(n)</td></tr>
<tr><td><b>Multiple</b></td><td>2+ on nearly the whole input</td><td>Fibonacci, ruler, subsets</td><td>exponential</td></tr>
</tbody></table>

<h3>Tail recursion — and how to erase it</h3>
<p>A call is <strong>tail recursive</strong> when the recursive call is the very last action, with nothing left to compute afterwards. Such a call carries no pending work, so its stack frame is pure waste — you can rewrite it as a loop mechanically.</p>
<pre><span class="tok-comment">// tail recursive: nothing happens after the call</span>
<span class="tok-type">int</span> <span class="tok-function">bsearch</span>(<span class="tok-type">int</span>[] a, <span class="tok-type">int</span> t, <span class="tok-type">int</span> lo, <span class="tok-type">int</span> hi) {
    <span class="tok-keyword">if</span> (lo &gt; hi) <span class="tok-keyword">return</span> -1;
    <span class="tok-type">int</span> mid = lo + (hi - lo) / 2;
    <span class="tok-keyword">if</span> (a[mid] == t) <span class="tok-keyword">return</span> mid;
    <span class="tok-keyword">return</span> a[mid] &gt; t ? <span class="tok-function">bsearch</span>(a, t, lo, mid-1) : <span class="tok-function">bsearch</span>(a, t, mid+1, hi);
}

<span class="tok-comment">// the same thing as a loop: O(1) stack</span>
<span class="tok-type">int</span> <span class="tok-function">bsearchIter</span>(<span class="tok-type">int</span>[] a, <span class="tok-type">int</span> t) {
    <span class="tok-type">int</span> lo = 0, hi = a.length - 1;
    <span class="tok-keyword">while</span> (lo &lt;= hi) {
        <span class="tok-type">int</span> mid = lo + (hi - lo) / 2;
        <span class="tok-keyword">if</span> (a[mid] == t) <span class="tok-keyword">return</span> mid;
        <span class="tok-keyword">if</span> (a[mid] &gt; t) hi = mid - 1; <span class="tok-keyword">else</span> lo = mid + 1;
    }
    <span class="tok-keyword">return</span> -1;
}</pre>
<p><b>The mechanical rule:</b> wrap the body in a <span class="badge">while (true)</span>, replace the recursive call by assigning the new arguments to the parameters, and <span class="badge">continue</span>. Factorial is <em>not</em> tail recursive as written (the multiplication happens after the call) — you must add an accumulator parameter first.</p>

<div class="pitfall"><b>Java does not optimise tail calls.</b> Unlike Scala, Kotlin (<span class="badge">tailrec</span>) or functional languages, the JVM keeps every frame — so a tail-recursive method in Java still overflows at ~10,000 deep. Writing a loop is not stylistic preference here; it is the only way to be safe.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Any recursion can be removed, not only the tail ones.</b> For a non-tail recursion you simulate the JVM by hand: push an explicit frame object (parameters + a "which phase am I in" marker) onto your own <span class="badge">Deque</span>. That is how iterative post-order tree traversal and iterative quicksort are written — and it is exactly how a compiler implements recursion in the first place. <em>Beyond syllabus because the course only converts tail recursion; the general transformation is what lets you process a 10-million-node tree without touching JVM stack settings.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Cách thiết kế một phép đệ quy — và khi nào nên bỏ nó đi</h2>
<p class="lead">Đệ quy có vẻ như phép màu cho tới khi bạn có một danh sách kiểm. Sau đó nó thành cơ học: xác định trường hợp cơ sở, thu nhỏ bài toán, tin tưởng lời gọi đệ quy, rồi gộp lại. Khó nhất là bước ba — "cú nhảy niềm tin" rằng lời gọi nhỏ hơn đã chạy đúng.</p>

<h3>Công thức bốn bước</h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>1. Trường hợp cơ sở</b><span>Đầu vào nhỏ nhất mà bạn trả lời được không cần đệ quy.</span></div>
  <div class="lz-fitem"><b>2. Thu nhỏ</b><span>Diễn đạt bài toán qua một bài toán nhỏ hơn nghiêm ngặt.</span></div>
  <div class="lz-fitem"><b>3. Cú nhảy niềm tin</b><span>Giả định lời gọi đệ quy trả về đúng đáp án cho đầu vào nhỏ đó.</span></div>
  <div class="lz-fitem"><b>4. Gộp lại</b><span>Dựng đáp án của tầng này từ đáp án con.</span></div>
</div>

<h3>Ví dụ có lời giải — tổng một mảng, thiết kế từng bước</h3>
<div class="out"><b>1. Cơ sở:</b> đoạn rỗng (lo &gt; hi) có tổng bằng 0.<br>
<b>2. Thu nhỏ:</b> sum(a, lo, hi) = a[lo] + sum(a, lo+1, hi) — nhỏ đi một phần tử.<br>
<b>3. Niềm tin:</b> giả định sum(a, lo+1, hi) đúng.<br>
<b>4. Gộp:</b> cộng a[lo] vào.<br>
<b>Kiểm trên [3, 7, 2]:</b> sum(0,2) = 3 + sum(1,2) = 3 + (7 + sum(2,2)) = 3 + (7 + (2 + 0)) = <b>12</b> ✓<br>
<b>Cách thu nhỏ khác (nhị phân):</b> chia đôi — sum(lo,mid) + sum(mid+1,hi). Cùng O(n) công, nhưng độ sâu giảm từ n xuống log n, nên sống sót với cả triệu phần tử.</div>

<h3>Ba hình dạng, gọi đúng tên</h3>
<table><thead><tr><th>Hình dạng</th><th>Lời gọi mỗi tầng</th><th>Ví dụ</th><th>Chi phí điển hình</th></tr></thead><tbody>
<tr><td><b>Tuyến tính</b></td><td>1</td><td>giai thừa, tổng danh sách, đảo danh sách</td><td>O(n)</td></tr>
<tr><td><b>Nhị phân</b></td><td>2, mỗi cái ~một nửa</td><td>merge sort, duyệt cây</td><td>O(n log n) hoặc O(n)</td></tr>
<tr><td><b>Bội</b></td><td>2+ trên gần như toàn bộ đầu vào</td><td>Fibonacci, thước, sinh tập con</td><td>hàm mũ</td></tr>
</tbody></table>

<h3>Đệ quy đuôi — và cách xoá nó đi</h3>
<p>Một lời gọi là <strong>đệ quy đuôi</strong> khi lời gọi đệ quy là hành động cuối cùng, sau đó không còn gì phải tính. Lời gọi như vậy không mang theo công việc đang treo, nên khung ngăn xếp của nó là lãng phí thuần tuý — bạn viết lại thành vòng lặp một cách máy móc được.</p>
<pre><span class="tok-comment">// đệ quy đuôi: sau lời gọi không còn gì xảy ra</span>
<span class="tok-type">int</span> <span class="tok-function">bsearch</span>(<span class="tok-type">int</span>[] a, <span class="tok-type">int</span> t, <span class="tok-type">int</span> lo, <span class="tok-type">int</span> hi) {
    <span class="tok-keyword">if</span> (lo &gt; hi) <span class="tok-keyword">return</span> -1;
    <span class="tok-type">int</span> mid = lo + (hi - lo) / 2;
    <span class="tok-keyword">if</span> (a[mid] == t) <span class="tok-keyword">return</span> mid;
    <span class="tok-keyword">return</span> a[mid] &gt; t ? <span class="tok-function">bsearch</span>(a, t, lo, mid-1) : <span class="tok-function">bsearch</span>(a, t, mid+1, hi);
}

<span class="tok-comment">// đúng nó, viết bằng vòng lặp: ngăn xếp O(1)</span>
<span class="tok-type">int</span> <span class="tok-function">bsearchIter</span>(<span class="tok-type">int</span>[] a, <span class="tok-type">int</span> t) {
    <span class="tok-type">int</span> lo = 0, hi = a.length - 1;
    <span class="tok-keyword">while</span> (lo &lt;= hi) {
        <span class="tok-type">int</span> mid = lo + (hi - lo) / 2;
        <span class="tok-keyword">if</span> (a[mid] == t) <span class="tok-keyword">return</span> mid;
        <span class="tok-keyword">if</span> (a[mid] &gt; t) hi = mid - 1; <span class="tok-keyword">else</span> lo = mid + 1;
    }
    <span class="tok-keyword">return</span> -1;
}</pre>
<p><b>Quy tắc máy móc:</b> bọc thân hàm trong <span class="badge">while (true)</span>, thay lời gọi đệ quy bằng việc gán tham số mới cho chính các tham số, rồi <span class="badge">continue</span>. Giai thừa <em>không</em> phải đệ quy đuôi như đã viết (phép nhân xảy ra sau lời gọi) — phải thêm tham số tích luỹ trước đã.</p>

<div class="pitfall"><b>Java không tối ưu lời gọi đuôi.</b> Khác với Scala, Kotlin (<span class="badge">tailrec</span>) hay các ngôn ngữ hàm, JVM giữ nguyên mọi khung — nên một phương thức đệ quy đuôi trong Java vẫn tràn ở độ sâu ~10.000. Viết vòng lặp ở đây không phải sở thích phong cách; đó là cách duy nhất để an toàn.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Mọi đệ quy đều khử được, không chỉ đệ quy đuôi.</b> Với đệ quy không đuôi, bạn mô phỏng JVM bằng tay: đẩy một đối tượng khung tường minh (tham số + cờ đánh dấu "đang ở giai đoạn nào") vào <span class="badge">Deque</span> của chính mình. Đó là cách viết duyệt cây hậu thứ tự không đệ quy và quicksort không đệ quy — và cũng đúng là cách trình biên dịch hiện thực đệ quy ngay từ đầu. <em>Ngoài giáo trình vì môn học chỉ chuyển đệ quy đuôi; phép biến đổi tổng quát mới là thứ cho phép bạn xử lý cây 10 triệu nút mà không phải đụng vào tham số ngăn xếp của JVM.</em></div>
</div>
`,
        },
        {
          title: 'Quiz 2 — Stacks, Queues & Recursion|||Quiz 2 — Ngăn xếp, Hàng đợi & Đệ quy',
          slug: 'csd201-quiz-2',
          type: 'QUIZ',
          description: 'Kiểm tra stack/queue/heap/đệ quy.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'A stack removes…|||Ngăn xếp lấy ra…', options: ['the oldest item (FIFO)|||phần tử cũ nhất (FIFO)', 'the most recently added item (LIFO)|||phần tử thêm gần nhất (LIFO)', 'the smallest item|||phần tử nhỏ nhất', 'a random item|||phần tử ngẫu nhiên'], correctIndex: 1, points: 1 },
              { question: 'A binary min-heap gives insert/remove-min in…|||Heap nhị phân min cho chèn/lấy-min trong…', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctIndex: 1, points: 1 },
              { question: 'BFS (breadth-first search) naturally uses a…|||BFS (tìm theo chiều rộng) tự nhiên dùng…', options: ['stack|||ngăn xếp', 'queue|||hàng đợi', 'heap', 'tree|||cây'], correctIndex: 1, points: 1 },
              { question: 'Naive recursive Fibonacci is O(2ⁿ) because it…|||Fibonacci đệ quy ngây thơ là O(2ⁿ) vì nó…', options: ['uses too much memory|||dùng quá nhiều bộ nhớ', 'recomputes the same subproblems repeatedly|||tính lại cùng bài toán con nhiều lần', 'has no base case|||không có ca cơ sở', 'uses a loop|||dùng vòng lặp'], correctIndex: 1, points: 1 },
              { question: 'Memoisation improves recursion by…|||Ghi nhớ cải thiện đệ quy bằng cách…', options: ['removing the base case|||bỏ ca cơ sở', 'caching results so each subproblem is computed once|||cache kết quả để mỗi bài toán con tính một lần', 'making it iterative|||biến nó thành lặp', 'using more stack|||dùng nhiều stack hơn'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 4 — CÂY & BST ══════════════════ */
    {
      title: 'Chapter 4 — Trees & Binary Search Trees|||Chương 4 — Cây & Cây nhị phân tìm kiếm',
      description: 'Cấu trúc phân cấp: cây tổng quát, cây nhị phân, duyệt cây, và BST cho tìm kiếm O(log n).',
      lessons: [
        {
          title: '4.1 — Trees & traversals|||4.1 — Cây & phép duyệt',
          slug: 'csd201-cay-duyet',
          type: 'VIDEO',
          description: 'Thuật ngữ cây (gốc/lá/độ cao), cây nhị phân, và ba phép duyệt in/pre/post-order.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Trees &amp; traversals</h2>
<p class="lead">A <strong>tree</strong> is a hierarchy: one root, each node with children, no cycles. A <strong>binary tree</strong> limits each node to two children (left, right). Trees model file systems, org charts, expression parsing and more.</p>
<div class="lz-flow">
  <div class="lz-step">Pre-order: node → left → right</div>
  <div class="lz-step">In-order: left → node → right</div>
  <div class="lz-step">Post-order: left → right → node</div>
</div>
<div class="out">On a binary search tree, <b>in-order</b> traversal visits the values in sorted order — a key property.</div>
<pre><span class="tok-keyword">void</span> <span class="tok-function">inorder</span>(<span class="tok-type">Node</span> n) {
    <span class="tok-keyword">if</span> (n == <span class="tok-keyword">null</span>) <span class="tok-keyword">return</span>;
    <span class="tok-function">inorder</span>(n.left);
    <span class="tok-function">visit</span>(n.data);
    <span class="tok-function">inorder</span>(n.right);
}</pre>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Morris traversal — in-order with O(1) extra space.</b> Recursive or stack-based in-order traversal uses O(h) memory for the call stack; Morris traversal instead threads temporary links from each node to its in-order predecessor, walking the whole tree with no stack and no recursion, in O(1) auxiliary space. The links are created and undone during the walk, so the tree is left unchanged. <em>The three standard traversals are taught with recursion; achieving the same visit order in constant space is an advanced pointer technique.</em></div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms#module-506" target="_blank" rel="noopener">
  <span class="lc-ico">🌳</span>
  <span class="lc-body"><span class="lc-title">Practise: Trees & BST</span><span class="lc-sub">Traversals and tree operations.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Cây &amp; phép duyệt</h2>
<p class="lead"><strong>Cây</strong> là một phân cấp: một gốc, mỗi nút có con, không chu trình. <strong>Cây nhị phân</strong> giới hạn mỗi nút tối đa hai con (trái, phải). Cây mô hình hệ thống tệp, sơ đồ tổ chức, phân tích biểu thức và hơn thế.</p>
<div class="lz-flow">
  <div class="lz-step">Pre-order: nút → trái → phải</div>
  <div class="lz-step">In-order: trái → nút → phải</div>
  <div class="lz-step">Post-order: trái → phải → nút</div>
</div>
<div class="out">Trên cây nhị phân tìm kiếm, duyệt <b>in-order</b> thăm các giá trị theo thứ tự đã sắp — một tính chất then chốt.</div>
<pre><span class="tok-keyword">void</span> <span class="tok-function">inorder</span>(<span class="tok-type">Node</span> n) {
    <span class="tok-keyword">if</span> (n == <span class="tok-keyword">null</span>) <span class="tok-keyword">return</span>;
    <span class="tok-function">inorder</span>(n.left);
    <span class="tok-function">visit</span>(n.data);
    <span class="tok-function">inorder</span>(n.right);
}</pre>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Duyệt Morris — in-order với O(1) bộ nhớ phụ.</b> Duyệt in-order bằng đệ quy hay ngăn xếp tốn O(h) bộ nhớ cho call stack; duyệt Morris thay vào đó luồn các liên kết tạm từ mỗi nút tới nút liền trước theo in-order, đi khắp cây mà không cần stack lẫn đệ quy, chỉ O(1) bộ nhớ phụ. Các liên kết được tạo rồi gỡ trong lúc đi nên cây giữ nguyên. <em>Ba phép duyệt chuẩn được dạy bằng đệ quy; đạt cùng thứ tự thăm với bộ nhớ hằng số là kỹ thuật con trỏ nâng cao.</em></div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms#module-506" target="_blank" rel="noopener">
  <span class="lc-ico">🌳</span>
  <span class="lc-body"><span class="lc-title">Luyện: Cây & BST</span><span class="lc-sub">Phép duyệt và thao tác trên cây.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '4.2 — Binary trees: properties & two implementations|||4.2 — Cây nhị phân: tính chất & hai cách cài đặt',
          slug: 'csd201-cay-nhi-phan',
          type: 'VIDEO',
          description: 'Các tính chất đếm được của cây nhị phân, cài đặt bằng liên kết và bằng mảng, khi nào chọn cái nào.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Binary trees — the properties you can compute, and two ways to store them</h2>
<p class="lead">A <strong>binary tree</strong> gives every node at most two children, named <em>left</em> and <em>right</em> — and the names matter: swapping them gives a different tree. That single restriction unlocks a set of exact counting rules, and an array layout with no pointers at all.</p>

<h3>Vocabulary you are expected to use precisely</h3>
<table><thead><tr><th>Term</th><th>Definition</th></tr></thead><tbody>
<tr><td><b>Depth</b> of a node</td><td>number of edges from the root to it (root has depth 0)</td></tr>
<tr><td><b>Height</b> of a node</td><td>longest path down to a leaf (leaves have height 0)</td></tr>
<tr><td><b>Height</b> of the tree</td><td>height of the root = maximum depth</td></tr>
<tr><td><b>Proper / full</b></td><td>every internal node has exactly 2 children</td></tr>
<tr><td><b>Complete</b></td><td>every level full except possibly the last, filled left to right</td></tr>
<tr><td><b>Perfect</b></td><td>all internal nodes have 2 children and all leaves are at the same depth</td></tr>
</tbody></table>

<h3>The counting rules</h3>
<div class="formula"><span class="lbl">LEVEL d</span>at most 2<sup>d</sup> nodes</div>
<div class="formula"><span class="lbl">HEIGHT h</span>h + 1 ≤ n ≤ 2<sup>h+1</sup> − 1 &nbsp;⟹&nbsp; log₂(n+1) − 1 ≤ h ≤ n − 1</div>
<div class="formula"><span class="lbl">PROPER TREE</span>leaves = internal nodes + 1 &nbsp;·&nbsp; n = 2·(internal) + 1</div>

<h3>Worked example — reading a tree's numbers</h3>
<div class="out"><b>A perfect binary tree of height 3.</b><br>
Level 0: 1 node · level 1: 2 · level 2: 4 · level 3: 8 → <b>n = 1+2+4+8 = 15 = 2⁴ − 1</b> ✓ upper bound reached.<br>
Leaves = 8, internal = 7 → 8 = 7 + 1 ✓ the proper-tree rule.<br>
<b>And in reverse:</b> if a complete tree holds n = 1,000,000 nodes, its height is ⌊log₂(1,000,000)⌋ = <b>19</b>. That is why a balanced tree search touches only ~20 nodes out of a million — the whole point of Chapter 4.</div>

<h3>Implementation A — linked structure</h3>
<pre><span class="tok-keyword">class</span> <span class="tok-type">Node</span>&lt;E&gt; {
    <span class="tok-type">E</span> element;
    <span class="tok-type">Node</span>&lt;E&gt; parent, left, right;   <span class="tok-comment">// parent is optional but handy</span>
}</pre>
<p>Flexible, grows to any shape, one node per element. Costs three references of overhead per element, and the nodes are scattered in memory.</p>

<h3>Implementation B — array layout (the heap trick)</h3>
<div class="formula"><span class="lbl">INDEX RULES</span>left(i) = 2i + 1 &nbsp;·&nbsp; right(i) = 2i + 2 &nbsp;·&nbsp; parent(i) = (i − 1) / 2</div>
<div class="out"><b>Store the perfect tree A(root) B C D E F G as an array:</b><br>
index: 0=A, 1=B, 2=C, 3=D, 4=E, 5=F, 6=G<br>
left(1) = 2·1+1 = 3 → D ✓ &nbsp; right(1) = 4 → E ✓ &nbsp; parent(6) = (6−1)/2 = 2 → C ✓<br>
No pointers stored at all: the <em>arithmetic</em> is the structure. This is exactly how heaps (lesson 4.7) are built.</div>
<div class="pitfall"><b>The array layout is only economical for complete trees.</b> A degenerate tree of height h (a "stick") would need 2<sup>h+1</sup>−1 slots to store h+1 nodes — 1 million slots for 20 nodes. Use arrays for heaps; use links for BSTs.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Cache locality is why the array version can be several times faster.</b> Modern CPUs read memory in 64-byte cache lines. In an array-backed tree, a node and its children are usually in the same or an adjacent line, so a traversal costs few cache misses. In a linked tree, each node may sit anywhere in the heap, so almost every step is a miss costing ~100 cycles — the constant factor that Big-O deliberately hides. <em>Beyond syllabus because complexity analysis rates the two identical, while the machine does not.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Cây nhị phân — các tính chất tính được, và hai cách lưu trữ</h2>
<p class="lead"><strong>Cây nhị phân</strong> cho mỗi nút nhiều nhất hai con, gọi tên là <em>trái</em> và <em>phải</em> — và cái tên có ý nghĩa: đổi chỗ hai con là ra cây khác. Chỉ một ràng buộc đó mở khoá cho một bộ quy tắc đếm chính xác, cùng một cách bố trí trên mảng không cần con trỏ nào.</p>

<h3>Từ vựng phải dùng cho chuẩn</h3>
<table><thead><tr><th>Thuật ngữ</th><th>Định nghĩa</th></tr></thead><tbody>
<tr><td><b>Độ sâu</b> của một nút</td><td>số cạnh từ gốc tới nó (gốc có độ sâu 0)</td></tr>
<tr><td><b>Chiều cao</b> của một nút</td><td>đường đi dài nhất xuống tới lá (lá có chiều cao 0)</td></tr>
<tr><td><b>Chiều cao</b> của cây</td><td>chiều cao của gốc = độ sâu lớn nhất</td></tr>
<tr><td><b>Cây đúng (proper/full)</b></td><td>mọi nút trong đều có đúng 2 con</td></tr>
<tr><td><b>Cây đầy đủ (complete)</b></td><td>mọi tầng đầy trừ tầng cuối, và tầng cuối lấp từ trái sang phải</td></tr>
<tr><td><b>Cây hoàn hảo (perfect)</b></td><td>mọi nút trong có 2 con và mọi lá cùng độ sâu</td></tr>
</tbody></table>

<h3>Các quy tắc đếm</h3>
<div class="formula"><span class="lbl">TẦNG d</span>nhiều nhất 2<sup>d</sup> nút</div>
<div class="formula"><span class="lbl">CHIỀU CAO h</span>h + 1 ≤ n ≤ 2<sup>h+1</sup> − 1 &nbsp;⟹&nbsp; log₂(n+1) − 1 ≤ h ≤ n − 1</div>
<div class="formula"><span class="lbl">CÂY ĐÚNG</span>số lá = số nút trong + 1 &nbsp;·&nbsp; n = 2·(nút trong) + 1</div>

<h3>Ví dụ có lời giải — đọc các con số của một cây</h3>
<div class="out"><b>Một cây nhị phân hoàn hảo chiều cao 3.</b><br>
Tầng 0: 1 nút · tầng 1: 2 · tầng 2: 4 · tầng 3: 8 → <b>n = 1+2+4+8 = 15 = 2⁴ − 1</b> ✓ chạm cận trên.<br>
Số lá = 8, nút trong = 7 → 8 = 7 + 1 ✓ đúng quy tắc cây đúng.<br>
<b>Và ngược lại:</b> nếu một cây đầy đủ chứa n = 1.000.000 nút thì chiều cao là ⌊log₂(1.000.000)⌋ = <b>19</b>. Đó là lý do tìm kiếm trên cây cân bằng chỉ chạm ~20 nút trong một triệu — đúng tinh thần của Chương 4.</div>

<h3>Cài đặt A — cấu trúc liên kết</h3>
<pre><span class="tok-keyword">class</span> <span class="tok-type">Node</span>&lt;E&gt; {
    <span class="tok-type">E</span> element;
    <span class="tok-type">Node</span>&lt;E&gt; parent, left, right;   <span class="tok-comment">// parent không bắt buộc nhưng tiện</span>
}</pre>
<p>Linh hoạt, mọc theo hình dạng bất kỳ, mỗi phần tử một nút. Đổi lại tốn ba tham chiếu phụ trội mỗi phần tử, và các nút nằm rải rác trong bộ nhớ.</p>

<h3>Cài đặt B — bố trí trên mảng (mẹo của heap)</h3>
<div class="formula"><span class="lbl">QUY TẮC CHỈ SỐ</span>trái(i) = 2i + 1 &nbsp;·&nbsp; phải(i) = 2i + 2 &nbsp;·&nbsp; cha(i) = (i − 1) / 2</div>
<div class="out"><b>Lưu cây hoàn hảo A(gốc) B C D E F G thành mảng:</b><br>
chỉ số: 0=A, 1=B, 2=C, 3=D, 4=E, 5=F, 6=G<br>
trái(1) = 2·1+1 = 3 → D ✓ &nbsp; phải(1) = 4 → E ✓ &nbsp; cha(6) = (6−1)/2 = 2 → C ✓<br>
Không lưu con trỏ nào cả: <em>phép số học</em> chính là cấu trúc. Đây đúng là cách heap (bài 4.7) được dựng.</div>
<div class="pitfall"><b>Bố trí mảng chỉ tiết kiệm với cây đầy đủ.</b> Một cây suy biến chiều cao h (hình "cái gậy") sẽ cần 2<sup>h+1</sup>−1 ô để lưu h+1 nút — một triệu ô cho 20 nút. Dùng mảng cho heap; dùng liên kết cho BST.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Tính cục bộ cache là lý do bản mảng có thể nhanh gấp mấy lần.</b> CPU hiện đại đọc bộ nhớ theo dòng cache 64 byte. Trong cây trên mảng, một nút và các con thường nằm cùng dòng hoặc dòng kề, nên duyệt cây tốn rất ít lần trượt cache. Trong cây liên kết, mỗi nút có thể nằm bất cứ đâu trên heap, nên gần như mỗi bước là một lần trượt tốn ~100 chu kỳ — chính hằng số nhân mà Big-O cố tình giấu đi. <em>Ngoài giáo trình vì phân tích độ phức tạp chấm hai bản như nhau, còn cái máy thì không.</em></div>
</div>
`,
        },
        {
          title: '4.3 — The four traversals & expression trees|||4.3 — Bốn phép duyệt & cây biểu thức',
          slug: 'csd201-duyet-cay',
          type: 'VIDEO',
          description: 'Preorder, inorder, postorder, level-order — chạy tay trên cùng một cây, và mỗi phép duyệt dùng để làm gì.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Four traversals — same tree, four different answers</h2>
<p class="lead">A traversal visits every node exactly once; the only question is <em>when</em> you process a node relative to its children. Three answers give the three depth-first orders; using a queue instead of recursion gives the fourth.</p>

<h3>The three depth-first orders</h3>
<pre><span class="tok-keyword">void</span> <span class="tok-function">preOrder</span>(Node n)  { <span class="tok-keyword">if</span> (n == <span class="tok-keyword">null</span>) <span class="tok-keyword">return</span>;
    <span class="tok-function">visit</span>(n); <span class="tok-function">preOrder</span>(n.left); <span class="tok-function">preOrder</span>(n.right); }      <span class="tok-comment">// node, L, R</span>

<span class="tok-keyword">void</span> <span class="tok-function">inOrder</span>(Node n)   { <span class="tok-keyword">if</span> (n == <span class="tok-keyword">null</span>) <span class="tok-keyword">return</span>;
    <span class="tok-function">inOrder</span>(n.left); <span class="tok-function">visit</span>(n); <span class="tok-function">inOrder</span>(n.right); }        <span class="tok-comment">// L, node, R</span>

<span class="tok-keyword">void</span> <span class="tok-function">postOrder</span>(Node n) { <span class="tok-keyword">if</span> (n == <span class="tok-keyword">null</span>) <span class="tok-keyword">return</span>;
    <span class="tok-function">postOrder</span>(n.left); <span class="tok-function">postOrder</span>(n.right); <span class="tok-function">visit</span>(n); }    <span class="tok-comment">// L, R, node</span></pre>

<h3>Worked example — run all four on one tree</h3>
<div class="diagram">        A
      /   \\
     B     C
    / \\     \\
   D   E     F</div>
<div class="out"><b>Pre-order (node first):</b> A B D E C F — <em>use it to copy a tree, or to print a nested outline.</em><br>
<b>In-order (node in the middle):</b> D B E A C F — <em>on a BST this prints the keys sorted; that is the defining property.</em><br>
<b>Post-order (node last):</b> D E B F C A — <em>use it to delete a tree or to compute sizes/heights bottom-up: you need both children's answers before your own.</em><br>
<b>Level-order (breadth-first):</b> A B C D E F — <em>use it to print level by level or to find the shallowest match.</em></div>

<h3>Level-order needs a queue, not recursion</h3>
<pre><span class="tok-keyword">void</span> <span class="tok-function">levelOrder</span>(Node root) {
    <span class="tok-type">Queue</span>&lt;Node&gt; q = <span class="tok-keyword">new</span> <span class="tok-type">LinkedList</span>&lt;&gt;();
    <span class="tok-keyword">if</span> (root != <span class="tok-keyword">null</span>) q.<span class="tok-function">add</span>(root);
    <span class="tok-keyword">while</span> (!q.<span class="tok-function">isEmpty</span>()) {
        Node n = q.<span class="tok-function">poll</span>();
        <span class="tok-function">visit</span>(n);
        <span class="tok-keyword">if</span> (n.left != <span class="tok-keyword">null</span>)  q.<span class="tok-function">add</span>(n.left);
        <span class="tok-keyword">if</span> (n.right != <span class="tok-keyword">null</span>) q.<span class="tok-function">add</span>(n.right);
    }
}</pre>
<p>Swap the queue for a stack and you get an iterative pre-order — the difference between breadth-first and depth-first is <em>only</em> the container. That idea returns in Chapter 5 for graphs, unchanged.</p>

<h3>Expression trees — where the orders become meaningful</h3>
<div class="diagram">        *
      /   \\
     +     3
    / \\
   2   5</div>
<div class="out"><b>In-order</b> → 2 + 5 * 3 — the familiar infix form (ambiguous without brackets).<br>
<b>Post-order</b> → 2 5 + 3 * — <b>exactly the RPN from lesson 2.3</b>, evaluated with one stack.<br>
<b>Pre-order</b> → * + 2 5 3 — prefix (Polish) notation, used by Lisp.<br>
<b>Evaluate post-order:</b> push 2, push 5, see + → 7, push 3, see * → <b>21</b> ✓ = (2+5)×3.</div>

<div class="pitfall"><b>Reconstructing a tree needs <em>two</em> traversals, and one of them must be in-order.</b> Pre-order + in-order determines the tree uniquely; pre-order + post-order does not (it cannot tell a single left child from a single right child). This is a favourite exam question.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The Euler tour unifies all three.</b> Walk around the tree keeping your left hand on the wall: you pass each node exactly three times — on the left, from below, on the right. Print on the first visit → pre-order; on the second → in-order; on the third → post-order. One template with three hooks generates all three orders, and the same tour is the basis of the "Euler tour technique" that reduces tree ancestor queries to range-minimum queries on an array. <em>Beyond syllabus because the textbook mentions the Euler tour in passing, while it is the concept that makes the three orders one idea instead of three memorised code shapes.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Bốn phép duyệt — cùng một cây, bốn đáp án khác nhau</h2>
<p class="lead">Một phép duyệt thăm mỗi nút đúng một lần; câu hỏi duy nhất là bạn xử lý nút <em>vào lúc nào</em> so với các con của nó. Ba câu trả lời cho ba thứ tự theo chiều sâu; dùng hàng đợi thay cho đệ quy sẽ cho thứ tự thứ tư.</p>

<h3>Ba thứ tự theo chiều sâu</h3>
<pre><span class="tok-keyword">void</span> <span class="tok-function">preOrder</span>(Node n)  { <span class="tok-keyword">if</span> (n == <span class="tok-keyword">null</span>) <span class="tok-keyword">return</span>;
    <span class="tok-function">visit</span>(n); <span class="tok-function">preOrder</span>(n.left); <span class="tok-function">preOrder</span>(n.right); }      <span class="tok-comment">// nút, T, P</span>

<span class="tok-keyword">void</span> <span class="tok-function">inOrder</span>(Node n)   { <span class="tok-keyword">if</span> (n == <span class="tok-keyword">null</span>) <span class="tok-keyword">return</span>;
    <span class="tok-function">inOrder</span>(n.left); <span class="tok-function">visit</span>(n); <span class="tok-function">inOrder</span>(n.right); }        <span class="tok-comment">// T, nút, P</span>

<span class="tok-keyword">void</span> <span class="tok-function">postOrder</span>(Node n) { <span class="tok-keyword">if</span> (n == <span class="tok-keyword">null</span>) <span class="tok-keyword">return</span>;
    <span class="tok-function">postOrder</span>(n.left); <span class="tok-function">postOrder</span>(n.right); <span class="tok-function">visit</span>(n); }    <span class="tok-comment">// T, P, nút</span></pre>

<h3>Ví dụ có lời giải — chạy cả bốn trên một cây</h3>
<div class="diagram">        A
      /   \\
     B     C
    / \\     \\
   D   E     F</div>
<div class="out"><b>Tiền thứ tự (nút trước):</b> A B D E C F — <em>dùng để sao chép cây, hoặc in dàn ý lồng nhau.</em><br>
<b>Trung thứ tự (nút ở giữa):</b> D B E A C F — <em>trên BST, phép này in ra khoá đã sắp xếp; đó là tính chất định nghĩa.</em><br>
<b>Hậu thứ tự (nút sau cùng):</b> D E B F C A — <em>dùng để xoá cây hoặc tính kích thước/chiều cao từ dưới lên: phải có đáp án của cả hai con trước khi có đáp án của mình.</em><br>
<b>Theo tầng (chiều rộng):</b> A B C D E F — <em>dùng để in theo từng tầng hoặc tìm kết quả nông nhất.</em></div>

<h3>Duyệt theo tầng cần hàng đợi, không phải đệ quy</h3>
<pre><span class="tok-keyword">void</span> <span class="tok-function">levelOrder</span>(Node root) {
    <span class="tok-type">Queue</span>&lt;Node&gt; q = <span class="tok-keyword">new</span> <span class="tok-type">LinkedList</span>&lt;&gt;();
    <span class="tok-keyword">if</span> (root != <span class="tok-keyword">null</span>) q.<span class="tok-function">add</span>(root);
    <span class="tok-keyword">while</span> (!q.<span class="tok-function">isEmpty</span>()) {
        Node n = q.<span class="tok-function">poll</span>();
        <span class="tok-function">visit</span>(n);
        <span class="tok-keyword">if</span> (n.left != <span class="tok-keyword">null</span>)  q.<span class="tok-function">add</span>(n.left);
        <span class="tok-keyword">if</span> (n.right != <span class="tok-keyword">null</span>) q.<span class="tok-function">add</span>(n.right);
    }
}</pre>
<p>Đổi hàng đợi thành ngăn xếp là bạn có tiền thứ tự không đệ quy — khác biệt giữa duyệt theo chiều rộng và chiều sâu <em>chỉ nằm ở</em> cái vật chứa. Ý tưởng đó quay lại nguyên vẹn ở Chương 5 với đồ thị.</p>

<h3>Cây biểu thức — nơi các thứ tự trở nên có nghĩa</h3>
<div class="diagram">        *
      /   \\
     +     3
    / \\
   2   5</div>
<div class="out"><b>Trung thứ tự</b> → 2 + 5 * 3 — dạng trung tố quen thuộc (nhập nhằng nếu không có ngoặc).<br>
<b>Hậu thứ tự</b> → 2 5 + 3 * — <b>đúng là biểu thức RPN ở bài 2.3</b>, tính bằng một ngăn xếp.<br>
<b>Tiền thứ tự</b> → * + 2 5 3 — ký pháp tiền tố (Ba Lan), dùng trong Lisp.<br>
<b>Tính hậu thứ tự:</b> đẩy 2, đẩy 5, gặp + → 7, đẩy 3, gặp * → <b>21</b> ✓ = (2+5)×3.</div>

<div class="pitfall"><b>Muốn dựng lại cây phải có <em>hai</em> phép duyệt, và một trong hai bắt buộc là trung thứ tự.</b> Tiền + trung xác định cây duy nhất; tiền + hậu thì không (không phân biệt được con trái đơn độc với con phải đơn độc). Đây là câu hỏi thi rất được ưa chuộng.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hành trình Euler gộp cả ba làm một.</b> Đi vòng quanh cây, tay trái luôn chạm tường: bạn đi ngang qua mỗi nút đúng ba lần — bên trái, từ dưới lên, bên phải. In ở lần gặp thứ nhất → tiền thứ tự; lần thứ hai → trung thứ tự; lần thứ ba → hậu thứ tự. Một khuôn mẫu với ba móc nối sinh ra cả ba thứ tự, và chính hành trình đó là nền của "kỹ thuật Euler tour" quy truy vấn tổ tiên trên cây về truy vấn cực tiểu đoạn trên mảng. <em>Ngoài giáo trình vì sách chỉ nhắc hành trình Euler thoáng qua, trong khi đó là khái niệm biến ba thứ tự thành một ý tưởng thay vì ba đoạn code học thuộc.</em></div>
</div>
`,
        },
        {
          title: '4.4 — Binary Search Trees|||4.4 — Cây nhị phân tìm kiếm (BST)',
          slug: 'csd201-bst',
          type: 'VIDEO',
          description: 'BST: trái < nút < phải → tìm/chèn/xóa O(log n) khi cân bằng, O(n) khi suy biến.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>Binary Search Trees</h2>
<p class="lead">A <strong>BST</strong> keeps an invariant at every node: all values on the left are smaller, all on the right are larger. That lets search, insert and delete each halve the problem — O(log n) when the tree is balanced.</p>
<div class="out"><b>Search 7:</b> start at the root; go left if 7 is smaller, right if larger; stop when found or you hit null. Like binary search, but on a tree.</div>
<div class="pitfall"><b>Trap:</b> if you insert already-sorted data into a plain BST, it degenerates into a linked list — every operation becomes O(n). That is exactly why <strong>balanced</strong> trees (AVL, Red-Black) exist — covered in the advanced section.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Deleting a node with two children.</b> Removing a BST node that has both children can't simply unlink it; the standard fix replaces its value with its in-order successor (the smallest node in the right subtree), then deletes that successor, which by construction has at most one child. This preserves the BST invariant in O(h) time and is the trickiest of the three delete cases. <em>Insert and search are shown in class, but the two-child delete via successor is where most implementations get subtly wrong.</em></div>
<a class="link-card codelab" href="/algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Visualize a BST</span><span class="lc-sub">Watch insert/search animate on the Algorithm Visualizer.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Cây nhị phân tìm kiếm (BST)</h2>
<p class="lead"><strong>BST</strong> giữ một bất biến tại mọi nút: mọi giá trị bên trái nhỏ hơn, mọi giá trị bên phải lớn hơn. Điều đó cho phép tìm, chèn, xóa mỗi lần chia đôi bài toán — O(log n) khi cây cân bằng.</p>
<div class="out"><b>Tìm 7:</b> bắt đầu từ gốc; đi trái nếu 7 nhỏ hơn, phải nếu lớn hơn; dừng khi thấy hoặc chạm null. Giống tìm nhị phân, nhưng trên cây.</div>
<div class="pitfall"><b>Bẫy:</b> nếu chèn dữ liệu đã sắp vào BST thường, nó suy biến thành danh sách liên kết — mọi thao tác thành O(n). Đó chính là lý do cây <strong>cân bằng</strong> (AVL, Red-Black) tồn tại — có ở phần nâng cao.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Xóa một nút có hai con.</b> Xóa một nút BST có cả hai con thì không thể chỉ gỡ liên kết; cách chuẩn là thay giá trị của nó bằng nút liền sau theo in-order (nút nhỏ nhất trong cây con phải), rồi xóa nút liền sau đó — nút này theo cách xây dựng có tối đa một con. Điều này giữ bất biến BST trong O(h) và là ca khó nhất trong ba ca xóa. <em>Chèn và tìm được minh họa trên lớp, nhưng xóa nút hai con qua nút liền sau là chỗ hầu hết cài đặt sai tinh vi.</em></div>
<a class="link-card codelab" href="/algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Trực quan hóa BST</span><span class="lc-sub">Xem chèn/tìm chạy trên Algorithm Visualizer.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
</div>
`,
        },
        {
          title: '4.5 — BST insertion & the three deletion cases|||4.5 — BST: chèn & ba trường hợp xoá',
          slug: 'csd201-bst-chen-xoa',
          type: 'VIDEO',
          description: 'Chèn vào BST, và ba trường hợp xoá (lá, một con, hai con) giải từng bước với nút kế vị.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.5</span>
<h2>Changing a BST without breaking it</h2>
<p class="lead">Searching a BST is easy — go left if smaller, right if larger. <strong>Modifying</strong> one is where the exam questions live, because the BST property (everything in the left subtree &lt; node &lt; everything in the right subtree) must survive every operation.</p>

<h3>Insertion — always lands at a leaf</h3>
<pre>Node <span class="tok-function">insert</span>(Node n, <span class="tok-type">int</span> key) {
    <span class="tok-keyword">if</span> (n == <span class="tok-keyword">null</span>) <span class="tok-keyword">return new</span> Node(key);        <span class="tok-comment">// found the empty spot</span>
    <span class="tok-keyword">if</span> (key &lt; n.key)      n.left  = <span class="tok-function">insert</span>(n.left, key);
    <span class="tok-keyword">else if</span> (key &gt; n.key) n.right = <span class="tok-function">insert</span>(n.right, key);
    <span class="tok-comment">// key == n.key → duplicate: ignore, or keep a counter</span>
    <span class="tok-keyword">return</span> n;
}</pre>
<div class="out"><b>Insert 30, 20, 40, 35 into an empty tree:</b><br>
30 → becomes the root.<br>
20 &lt; 30 → left of 30.<br>
40 &gt; 30 → right of 30.<br>
35: 35 &gt; 30 → go right to 40; 35 &lt; 40 → left of 40.<br>
<b>Result:</b> 30(20, 40(35, −)). Cost = the depth reached = O(h).</div>

<h3>Deletion — three cases, and only the third is hard</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Case 1 — the node is a leaf.</b> Just detach it: set the parent's link to null.</div>
  <div class="lz-layer"><b>Case 2 — one child.</b> Splice the node out: the parent adopts the single child. The subtree's whole key range stays on the correct side, so the BST property is preserved for free.</div>
  <div class="lz-layer"><b>Case 3 — two children.</b> You cannot remove the node itself; instead <em>replace its key</em> with its <b>in-order successor</b> (the smallest key in the right subtree), then delete that successor — which, by construction, has at most one child, so you fall back to case 1 or 2.</div>
</div>

<h3>Worked example — delete 30 (two children) step by step</h3>
<div class="diagram">        30                          35
      /    \\                      /    \\
     20     40      ⟶            20     40
           /  \\                        /  \\
         35    50                     38    50
           \\
            38</div>
<div class="out"><b>Step 1</b> — the successor of 30 = the leftmost node of its right subtree: go right to 40, then left as far as possible → <b>35</b>.<br>
<b>Step 2</b> — copy the key 35 into the node that held 30. The tree now has two 35s temporarily.<br>
<b>Step 3</b> — delete the original 35 node. It has one child (38, on the right) → case 2: 40's left link now points to 38.<br>
<b>Check the result:</b> in-order traversal gives 20, 35, 38, 40, 50 — sorted ✓, so the BST property held.<br>
<b>Why the successor works:</b> it is the smallest key greater than the deleted one, so it is larger than everything on the left and smaller than everything else on the right — exactly the slot it must fill. The in-order <em>predecessor</em> (largest key in the left subtree) works just as well; pick one and be consistent.</div>

<h3>Cost — and the reason Chapter 4 does not stop here</h3>
<table><thead><tr><th>Operation</th><th>Balanced tree</th><th>Degenerate tree (sorted input)</th></tr></thead><tbody>
<tr><td>search / insert / delete</td><td>O(log n)</td><td><b>O(n)</b></td></tr>
<tr><td>height of 1,000,000 nodes</td><td>~20</td><td><b>1,000,000</b></td></tr>
</tbody></table>
<div class="pitfall"><b>Inserting sorted data destroys a plain BST.</b> Insert 1,2,3,4,5… and every node becomes a right child: the tree degenerates into a linked list, and every operation drops to O(n). Since importing already-sorted records is extremely common, this is not a theoretical worry — it is exactly why AVL trees (lesson 4.6) exist.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Deleting with the successor every time makes the tree lean.</b> Hibbard's classic result: repeatedly deleting with the in-order successor drives the expected height from Θ(log n) up to Θ(√n) after enough random deletions, because you always steal from the right subtree. Real implementations alternate between successor and predecessor, or randomise the choice, to keep the tree symmetric. <em>Beyond syllabus because the textbook gives the successor rule as if it were neutral, while the asymmetry it introduces is a known, measurable defect.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.5</span>
<h2>Sửa một BST mà không làm hỏng nó</h2>
<p class="lead">Tìm kiếm trên BST thì dễ — nhỏ hơn thì rẽ trái, lớn hơn thì rẽ phải. <strong>Thay đổi</strong> nó mới là chỗ các câu hỏi thi nằm, vì tính chất BST (mọi thứ trong cây con trái &lt; nút &lt; mọi thứ trong cây con phải) phải sống sót qua mọi thao tác.</p>

<h3>Chèn — luôn hạ cánh ở một lá</h3>
<pre>Node <span class="tok-function">insert</span>(Node n, <span class="tok-type">int</span> key) {
    <span class="tok-keyword">if</span> (n == <span class="tok-keyword">null</span>) <span class="tok-keyword">return new</span> Node(key);        <span class="tok-comment">// tìm được chỗ trống</span>
    <span class="tok-keyword">if</span> (key &lt; n.key)      n.left  = <span class="tok-function">insert</span>(n.left, key);
    <span class="tok-keyword">else if</span> (key &gt; n.key) n.right = <span class="tok-function">insert</span>(n.right, key);
    <span class="tok-comment">// key == n.key → trùng khoá: bỏ qua, hoặc giữ một bộ đếm</span>
    <span class="tok-keyword">return</span> n;
}</pre>
<div class="out"><b>Chèn 30, 20, 40, 35 vào cây rỗng:</b><br>
30 → thành gốc.<br>
20 &lt; 30 → nằm bên trái 30.<br>
40 &gt; 30 → nằm bên phải 30.<br>
35: 35 &gt; 30 → sang phải tới 40; 35 &lt; 40 → nằm bên trái 40.<br>
<b>Kết quả:</b> 30(20, 40(35, −)). Chi phí = độ sâu đi tới = O(h).</div>

<h3>Xoá — ba trường hợp, và chỉ trường hợp thứ ba là khó</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Trường hợp 1 — nút là lá.</b> Chỉ việc tháo ra: đặt liên kết của cha thành null.</div>
  <div class="lz-layer"><b>Trường hợp 2 — có một con.</b> Tháo nút ra và nối tắt: cha nhận luôn đứa con duy nhất. Cả dải khoá của cây con đó vẫn nằm đúng phía, nên tính chất BST được giữ miễn phí.</div>
  <div class="lz-layer"><b>Trường hợp 3 — có hai con.</b> Bạn không xoá được chính nút đó; thay vào đó hãy <em>thay khoá của nó</em> bằng <b>nút kế vị theo trung thứ tự</b> (khoá nhỏ nhất trong cây con phải), rồi xoá nút kế vị đó — mà theo cách xây dựng, nút này có nhiều nhất một con, nên bạn lùi về trường hợp 1 hoặc 2.</div>
</div>

<h3>Ví dụ có lời giải — xoá 30 (hai con) từng bước</h3>
<div class="diagram">        30                          35
      /    \\                      /    \\
     20     40      ⟶            20     40
           /  \\                        /  \\
         35    50                     38    50
           \\
            38</div>
<div class="out"><b>Bước 1</b> — nút kế vị của 30 = nút trái nhất trong cây con phải: sang phải tới 40, rồi rẽ trái hết mức → <b>35</b>.<br>
<b>Bước 2</b> — chép khoá 35 vào nút đang chứa 30. Cây tạm thời có hai số 35.<br>
<b>Bước 3</b> — xoá nút 35 gốc. Nó có một con (38, bên phải) → trường hợp 2: liên kết trái của 40 giờ trỏ tới 38.<br>
<b>Kiểm kết quả:</b> duyệt trung thứ tự cho 20, 35, 38, 40, 50 — đã sắp xếp ✓, tức tính chất BST được giữ.<br>
<b>Vì sao dùng nút kế vị:</b> nó là khoá nhỏ nhất lớn hơn khoá bị xoá, nên nó lớn hơn mọi thứ bên trái và nhỏ hơn mọi thứ còn lại bên phải — đúng cái khe nó phải lấp. Nút <em>tiền nhiệm</em> (khoá lớn nhất trong cây con trái) cũng dùng được y hệt; chọn một và làm nhất quán.</div>

<h3>Chi phí — và lý do Chương 4 chưa dừng ở đây</h3>
<table><thead><tr><th>Thao tác</th><th>Cây cân bằng</th><th>Cây suy biến (đầu vào đã sắp)</th></tr></thead><tbody>
<tr><td>tìm / chèn / xoá</td><td>O(log n)</td><td><b>O(n)</b></td></tr>
<tr><td>chiều cao với 1.000.000 nút</td><td>~20</td><td><b>1.000.000</b></td></tr>
</tbody></table>
<div class="pitfall"><b>Chèn dữ liệu đã sắp xếp làm hỏng BST thường.</b> Chèn 1,2,3,4,5… thì mọi nút đều thành con phải: cây suy biến thành danh sách liên kết, và mọi thao tác tụt về O(n). Vì nạp dữ liệu đã sắp sẵn là chuyện cực kỳ phổ biến, đây không phải nỗi lo lý thuyết — nó đúng là lý do cây AVL (bài 4.6) tồn tại.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Luôn xoá bằng nút kế vị sẽ làm cây lệch.</b> Kết quả kinh điển của Hibbard: xoá đi xoá lại bằng nút kế vị theo trung thứ tự đẩy chiều cao kỳ vọng từ Θ(log n) lên Θ(√n) sau đủ nhiều lần xoá ngẫu nhiên, vì bạn luôn "ăn" của cây con phải. Các cài đặt thật luân phiên giữa kế vị và tiền nhiệm, hoặc chọn ngẫu nhiên, để giữ cây cân đối. <em>Ngoài giáo trình vì sách đưa quy tắc dùng nút kế vị như thể nó trung tính, trong khi sự bất đối xứng nó gây ra là một khiếm khuyết đã được đo đạc.</em></div>
</div>
`,
        },
        {
          title: '4.6 — AVL trees: the four rotations|||4.6 — Cây AVL: bốn phép xoay',
          slug: 'csd201-avl',
          type: 'VIDEO',
          description: 'Hệ số cân bằng, bốn ca mất cân bằng LL/RR/LR/RL và cách xoay lại — có ví dụ dựng cây từng bước.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.6</span>
<h2>AVL — a BST that refuses to degenerate</h2>
<p class="lead">An <strong>AVL tree</strong> is a BST with one extra rule, checked after every insert and delete:</p>
<div class="formula"><span class="lbl">AVL INVARIANT</span>for every node: | height(left) − height(right) | ≤ 1</div>
<p>That number is the node's <strong>balance factor</strong>. Keeping it in {−1, 0, +1} forces the height to stay Θ(log n), so search/insert/delete are O(log n) <em>guaranteed</em> — not just on average.</p>

<h3>Detecting the four cases</h3>
<p>After an insertion, walk back up to the first node whose balance factor became ±2. Call it <span class="badge">z</span>, its taller child <span class="badge">y</span>, and <em>y</em>'s taller child <span class="badge">x</span>. The path z→y→x names the case:</p>
<table><thead><tr><th>Case</th><th>Path</th><th>Fix</th></tr></thead><tbody>
<tr><td><b>LL</b></td><td>left, left</td><td>one right rotation at z</td></tr>
<tr><td><b>RR</b></td><td>right, right</td><td>one left rotation at z</td></tr>
<tr><td><b>LR</b></td><td>left, right</td><td>left-rotate y, then right-rotate z</td></tr>
<tr><td><b>RL</b></td><td>right, left</td><td>right-rotate y, then left-rotate z</td></tr>
</tbody></table>
<p><b>Rule of thumb:</b> if the two steps go the same way, one rotation the opposite way fixes it; if they zig-zag, you need two rotations — first straighten the zig-zag into a straight line, then rotate as in the simple case.</p>

<h3>The rotation itself (right rotation at z)</h3>
<pre>Node <span class="tok-function">rotateRight</span>(Node z) {
    Node y = z.left;
    z.left = y.right;      <span class="tok-comment">// y's right subtree moves under z</span>
    y.right = z;           <span class="tok-comment">// z becomes y's right child</span>
    <span class="tok-function">updateHeight</span>(z);      <span class="tok-comment">// z first — it is now lower</span>
    <span class="tok-function">updateHeight</span>(y);
    <span class="tok-keyword">return</span> y;              <span class="tok-comment">// y is the new subtree root</span>
}</pre>
<div class="diagram">      z                y
     / \\              / \\
    y   T4   ⟶       x   z
   / \\              / \\  / \\
  x   T3           T1 T2 T3 T4
 / \\
T1  T2</div>
<p>Notice that the in-order sequence T1 x T2 y T3 z T4 is identical before and after — a rotation changes the shape, never the ordering. That is why the BST property survives.</p>

<h3>Worked example — insert 10, 20, 30, 25 step by step</h3>
<div class="out"><b>Insert 10:</b> root = 10. Balanced.<br>
<b>Insert 20:</b> right child of 10. Balance factor of 10 = 0 − 1 = −1. Still legal.<br>
<b>Insert 30:</b> right of 20. Node 10 now has left height −1, right height 1 → factor −2 → <b>RR case</b> (right, right).<br>
&nbsp;&nbsp;→ left-rotate at 10: <b>20 becomes the root</b>, with children 10 and 30. Heights: 1. ✓<br>
<b>Insert 25:</b> 25 &gt; 20 → right to 30; 25 &lt; 30 → left of 30. Node 20: left height 0, right height 1 → factor −1 ✓ still legal. No rotation needed.<br>
<b>Final tree:</b> 20(10, 30(25, −)), height 2 for 4 nodes. Compare with a plain BST fed 10,20,30,25: it would be a chain of height 3 — and with 1,000 sorted keys, height 999 versus AVL's 10.</div>

<h3>Cost of maintaining balance</h3>
<table><thead><tr><th></th><th>Plain BST</th><th>AVL</th></tr></thead><tbody>
<tr><td>Search / insert / delete</td><td>O(h), h up to n</td><td><b>O(log n) guaranteed</b></td></tr>
<tr><td>Rotations per insert</td><td>—</td><td>at most 1 (single or double)</td></tr>
<tr><td>Rotations per delete</td><td>—</td><td>up to O(log n) going up</td></tr>
<tr><td>Extra memory</td><td>—</td><td>1 height/balance field per node</td></tr>
</tbody></table>

<div class="pitfall"><b>Update heights bottom-up, and update z before y.</b> After a rotation the child that moved down must be recomputed first, otherwise the parent reads a stale height and the next balance check is wrong. Most buggy AVL submissions fail on exactly this line ordering, not on the rotation logic.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>AVL vs Red-Black — why databases picked the other one.</b> AVL is more rigidly balanced (height ≤ 1.44·log₂n) so lookups are faster, while Red-Black tolerates height up to 2·log₂n but needs fewer rotations on write. Read-heavy in-memory indexes favour AVL; write-heavy structures such as Java's <span class="badge">TreeMap</span>, C++ <span class="badge">std::map</span> and the Linux scheduler use Red-Black. Databases go further and use B-trees, because on disk what matters is not comparisons but the number of blocks read. <em>Beyond syllabus because CSD201 stops at "AVL keeps it balanced", while the engineering question is always which balance/rotation trade-off matches your workload.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.6</span>
<h2>AVL — một BST không chịu suy biến</h2>
<p class="lead"><strong>Cây AVL</strong> là BST kèm đúng một quy tắc, được kiểm sau mỗi lần chèn và xoá:</p>
<div class="formula"><span class="lbl">BẤT BIẾN AVL</span>với mọi nút: | chiều cao(trái) − chiều cao(phải) | ≤ 1</div>
<p>Con số đó là <strong>hệ số cân bằng</strong> của nút. Giữ nó trong {−1, 0, +1} buộc chiều cao luôn là Θ(log n), nên tìm/chèn/xoá là O(log n) <em>đảm bảo</em> — không chỉ trung bình.</p>

<h3>Nhận diện bốn trường hợp</h3>
<p>Sau khi chèn, đi ngược lên tới nút đầu tiên có hệ số cân bằng thành ±2. Gọi nó là <span class="badge">z</span>, con cao hơn của nó là <span class="badge">y</span>, và con cao hơn của <em>y</em> là <span class="badge">x</span>. Đường đi z→y→x đặt tên cho trường hợp:</p>
<table><thead><tr><th>Trường hợp</th><th>Đường đi</th><th>Cách sửa</th></tr></thead><tbody>
<tr><td><b>LL</b></td><td>trái, trái</td><td>một phép xoay phải tại z</td></tr>
<tr><td><b>RR</b></td><td>phải, phải</td><td>một phép xoay trái tại z</td></tr>
<tr><td><b>LR</b></td><td>trái, phải</td><td>xoay trái tại y, rồi xoay phải tại z</td></tr>
<tr><td><b>RL</b></td><td>phải, trái</td><td>xoay phải tại y, rồi xoay trái tại z</td></tr>
</tbody></table>
<p><b>Mẹo nhớ:</b> nếu hai bước cùng chiều thì một phép xoay ngược chiều là xong; nếu chúng zic-zắc thì cần hai phép xoay — trước hết bẻ zic-zắc thành đường thẳng, rồi xoay như trường hợp đơn giản.</p>

<h3>Bản thân phép xoay (xoay phải tại z)</h3>
<pre>Node <span class="tok-function">rotateRight</span>(Node z) {
    Node y = z.left;
    z.left = y.right;      <span class="tok-comment">// cây con phải của y chuyển xuống dưới z</span>
    y.right = z;           <span class="tok-comment">// z thành con phải của y</span>
    <span class="tok-function">updateHeight</span>(z);      <span class="tok-comment">// z trước — giờ nó nằm thấp hơn</span>
    <span class="tok-function">updateHeight</span>(y);
    <span class="tok-keyword">return</span> y;              <span class="tok-comment">// y là gốc mới của cây con</span>
}</pre>
<div class="diagram">      z                y
     / \\              / \\
    y   T4   ⟶       x   z
   / \\              / \\  / \\
  x   T3           T1 T2 T3 T4
 / \\
T1  T2</div>
<p>Để ý dãy trung thứ tự T1 x T2 y T3 z T4 giống hệt nhau trước và sau — phép xoay đổi hình dạng chứ không bao giờ đổi thứ tự. Nhờ vậy tính chất BST được giữ nguyên.</p>

<h3>Ví dụ có lời giải — chèn 10, 20, 30, 25 từng bước</h3>
<div class="out"><b>Chèn 10:</b> gốc = 10. Cân bằng.<br>
<b>Chèn 20:</b> con phải của 10. Hệ số cân bằng của 10 = 0 − 1 = −1. Vẫn hợp lệ.<br>
<b>Chèn 30:</b> bên phải 20. Nút 10 giờ có chiều cao trái −1, phải 1 → hệ số −2 → <b>ca RR</b> (phải, phải).<br>
&nbsp;&nbsp;→ xoay trái tại 10: <b>20 trở thành gốc</b>, hai con là 10 và 30. Chiều cao: 1. ✓<br>
<b>Chèn 25:</b> 25 &gt; 20 → sang phải tới 30; 25 &lt; 30 → bên trái 30. Nút 20: cao trái 0, cao phải 1 → hệ số −1 ✓ vẫn hợp lệ. Không cần xoay.<br>
<b>Cây cuối:</b> 20(10, 30(25, −)), chiều cao 2 với 4 nút. So với BST thường nhận 10,20,30,25: nó sẽ là một chuỗi chiều cao 3 — và với 1.000 khoá đã sắp, chiều cao 999 so với 10 của AVL.</div>

<h3>Cái giá của việc giữ cân bằng</h3>
<table><thead><tr><th></th><th>BST thường</th><th>AVL</th></tr></thead><tbody>
<tr><td>Tìm / chèn / xoá</td><td>O(h), h có thể tới n</td><td><b>O(log n) đảm bảo</b></td></tr>
<tr><td>Số phép xoay mỗi lần chèn</td><td>—</td><td>nhiều nhất 1 (đơn hoặc kép)</td></tr>
<tr><td>Số phép xoay mỗi lần xoá</td><td>—</td><td>tới O(log n) khi đi ngược lên</td></tr>
<tr><td>Bộ nhớ phụ</td><td>—</td><td>1 trường chiều cao/hệ số mỗi nút</td></tr>
</tbody></table>

<div class="pitfall"><b>Cập nhật chiều cao từ dưới lên, và cập nhật z trước y.</b> Sau phép xoay, đứa con vừa bị hạ xuống phải được tính lại trước, nếu không nút cha đọc phải chiều cao cũ và lần kiểm cân bằng kế tiếp sẽ sai. Phần lớn bài AVL nộp bị lỗi đúng ở thứ tự hai dòng này, chứ không phải ở logic xoay.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>AVL với Red-Black — vì sao cơ sở dữ liệu chọn cái kia.</b> AVL cân bằng chặt hơn (chiều cao ≤ 1,44·log₂n) nên tra cứu nhanh hơn, còn Red-Black chấp nhận chiều cao tới 2·log₂n nhưng cần ít phép xoay hơn khi ghi. Chỉ mục trong bộ nhớ thiên về đọc thì hợp AVL; các cấu trúc thiên về ghi như <span class="badge">TreeMap</span> của Java, <span class="badge">std::map</span> của C++ và bộ lập lịch Linux dùng Red-Black. Cơ sở dữ liệu còn đi xa hơn và dùng B-tree, vì trên đĩa thứ quan trọng không phải số phép so sánh mà là số khối phải đọc. <em>Ngoài giáo trình vì CSD201 dừng ở "AVL giữ cây cân bằng", trong khi câu hỏi kỹ thuật luôn là đánh đổi cân bằng/xoay nào hợp với tải công việc của bạn.</em></div>
</div>
`,
        },
        {
          title: '4.7 — Building a heap: sift-up, sift-down, Floyd|||4.7 — Dựng heap: sift-up, sift-down, Floyd',
          slug: 'csd201-heap-cai-dat',
          type: 'VIDEO',
          description: 'Cài đặt heap trên mảng, hai phép sửa vị trí, và vì sao build-heap tốn O(n) chứ không phải O(n log n).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.7</span>
<h2>The heap, built by hand</h2>
<p class="lead">Lesson 2.5 used a heap as a black box behind <span class="badge">PriorityQueue</span>. Here you build it. A <strong>binary min-heap</strong> is a <em>complete</em> binary tree stored in an array, where every parent is ≤ its children. Completeness is what makes the array layout exact — no gaps, no wasted slots.</p>

<div class="formula"><span class="lbl">ARRAY MAP</span>left(i) = 2i + 1 &nbsp;·&nbsp; right(i) = 2i + 2 &nbsp;·&nbsp; parent(i) = (i − 1) / 2</div>
<div class="formula"><span class="lbl">HEAP ORDER</span>a[parent(i)] ≤ a[i] &nbsp; for every i &gt; 0 &nbsp;(min-heap)</div>

<h3>Two repair operations — that is the whole data structure</h3>
<pre><span class="tok-comment">// sift-up: a new element at the end may be too small</span>
<span class="tok-keyword">void</span> <span class="tok-function">siftUp</span>(<span class="tok-type">int</span> i) {
    <span class="tok-keyword">while</span> (i &gt; 0 &amp;&amp; a[(i-1)/2] &gt; a[i]) { <span class="tok-function">swap</span>(i, (i-1)/2); i = (i-1)/2; }
}
<span class="tok-comment">// sift-down: the root may be too large after a removal</span>
<span class="tok-keyword">void</span> <span class="tok-function">siftDown</span>(<span class="tok-type">int</span> i) {
    <span class="tok-keyword">while</span> (2*i + 1 &lt; n) {
        <span class="tok-type">int</span> c = 2*i + 1;
        <span class="tok-keyword">if</span> (c + 1 &lt; n &amp;&amp; a[c+1] &lt; a[c]) c++;   <span class="tok-comment">// the smaller child</span>
        <span class="tok-keyword">if</span> (a[i] &lt;= a[c]) <span class="tok-keyword">break</span>;
        <span class="tok-function">swap</span>(i, c); i = c;
    }
}</pre>
<p><b>insert(e)</b> = append at the end, then sift-up → O(log n). &nbsp; <b>removeMin()</b> = take a[0], move the last element to the root, shrink, then sift-down → O(log n). &nbsp; <b>peek()</b> = a[0] → O(1).</p>

<h3>Worked example — insert 5 into [2, 4, 8, 9, 7]</h3>
<div class="out"><b>Array:</b> [2, 4, 8, 9, 7] (a valid min-heap). Append 5 → [2, 4, 8, 9, 7, <b>5</b>] at index 5.<br>
parent(5) = (5−1)/2 = 2 → a[2] = 8 &gt; 5 → swap → [2, 4, <b>5</b>, 9, 7, 8], now at index 2.<br>
parent(2) = 0 → a[0] = 2 ≤ 5 → stop.<br>
<b>Result:</b> [2, 4, 5, 9, 7, 8] — two swaps, the height of the tree. ✓</div>

<h3>Worked example — removeMin from [2, 4, 5, 9, 7, 8]</h3>
<div class="out">Return a[0] = <b>2</b>. Move the last element (8) to the root and shrink: [8, 4, 5, 9, 7].<br>
sift-down at 0: children are 4 and 5 → smaller is 4 → 8 &gt; 4 → swap → [4, 8, 5, 9, 7], now at index 1.<br>
children of 1 are index 3 (9) and 4 (7) → smaller is 7 → 8 &gt; 7 → swap → [4, 7, 5, 9, 8], now at index 4 → no children → stop.<br>
<b>Result:</b> [4, 7, 5, 9, 8], a valid heap with the new minimum 4 at the root. ✓</div>

<h3>Floyd's build-heap — the O(n) surprise</h3>
<pre><span class="tok-keyword">void</span> <span class="tok-function">buildHeap</span>() {
    <span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = n/2 - 1; i &gt;= 0; i--) <span class="tok-function">siftDown</span>(i);   <span class="tok-comment">// last internal node → root</span>
}</pre>
<div class="out"><b>Build a heap from [9, 4, 7, 1, −2, 6, 5] (n = 7):</b><br>
start at i = 7/2 − 1 = 2 → a[2] = 7, children 6 and 5 → swap with 5 → [9, 4, <b>5</b>, 1, −2, 6, 7]<br>
i = 1 → a[1] = 4, children 1 and −2 → swap with −2 → [9, <b>−2</b>, 5, 1, 4, 6, 7]<br>
i = 0 → a[0] = 9, children −2 and 5 → swap with −2 → [−2, 9, 5, …] → 9 sifts down again against 1 and 4 → swap with 1 → <b>[−2, 1, 5, 9, 4, 6, 7]</b> ✓<br>
<b>Why it is O(n), not O(n log n):</b> half the nodes are leaves and cost 0; a quarter sit one level up and cost ≤ 1 swap; an eighth cost ≤ 2… The total is n·Σ(k / 2<sup>k</sup>) which converges to <b>2n</b>. Inserting the same n elements one at a time really is O(n log n) — the bulk build is genuinely cheaper.</div>

<div class="pitfall"><b>A heap is <em>not</em> sorted.</b> [2, 4, 5, 9, 7, 8] is a valid heap but not a sorted array; the only guarantee is parent ≤ child. Printing the array is not a sorted output — you must repeatedly removeMin (that is heap sort, lesson 6.5).</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Changing a key in the middle — the operation Dijkstra needs.</b> Lowering a key requires sift-up, raising it requires sift-down, both O(log n) — but first you must <em>find</em> the element, which is O(n) in a bare heap. Real implementations keep a side map from element to array index, updated on every swap ("indexed priority queue"). Java's <span class="badge">PriorityQueue</span> has no such map, which is why textbook Dijkstra instead pushes a duplicate entry and skips stale ones when popped. <em>Beyond syllabus because the course presents the heap API as insert/removeMin only, while decrease-key is what makes Dijkstra (lesson 5.5) run in O((n+m) log n).</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.7</span>
<h2>Heap, dựng bằng tay</h2>
<p class="lead">Bài 2.5 dùng heap như một hộp đen sau lưng <span class="badge">PriorityQueue</span>. Ở đây bạn dựng nó. <strong>Heap nhị phân min</strong> là một cây nhị phân <em>đầy đủ</em> lưu trên mảng, trong đó mọi nút cha ≤ các con. Chính tính đầy đủ làm bố trí mảng khít khao — không lỗ hổng, không ô lãng phí.</p>

<div class="formula"><span class="lbl">ÁNH XẠ MẢNG</span>trái(i) = 2i + 1 &nbsp;·&nbsp; phải(i) = 2i + 2 &nbsp;·&nbsp; cha(i) = (i − 1) / 2</div>
<div class="formula"><span class="lbl">THỨ TỰ HEAP</span>a[cha(i)] ≤ a[i] &nbsp; với mọi i &gt; 0 &nbsp;(heap min)</div>

<h3>Hai phép sửa — đó là toàn bộ cấu trúc dữ liệu</h3>
<pre><span class="tok-comment">// sift-up: phần tử mới ở cuối có thể quá nhỏ</span>
<span class="tok-keyword">void</span> <span class="tok-function">siftUp</span>(<span class="tok-type">int</span> i) {
    <span class="tok-keyword">while</span> (i &gt; 0 &amp;&amp; a[(i-1)/2] &gt; a[i]) { <span class="tok-function">swap</span>(i, (i-1)/2); i = (i-1)/2; }
}
<span class="tok-comment">// sift-down: gốc có thể quá lớn sau khi lấy phần tử ra</span>
<span class="tok-keyword">void</span> <span class="tok-function">siftDown</span>(<span class="tok-type">int</span> i) {
    <span class="tok-keyword">while</span> (2*i + 1 &lt; n) {
        <span class="tok-type">int</span> c = 2*i + 1;
        <span class="tok-keyword">if</span> (c + 1 &lt; n &amp;&amp; a[c+1] &lt; a[c]) c++;   <span class="tok-comment">// con nhỏ hơn</span>
        <span class="tok-keyword">if</span> (a[i] &lt;= a[c]) <span class="tok-keyword">break</span>;
        <span class="tok-function">swap</span>(i, c); i = c;
    }
}</pre>
<p><b>insert(e)</b> = thêm vào cuối rồi sift-up → O(log n). &nbsp; <b>removeMin()</b> = lấy a[0], đưa phần tử cuối lên gốc, thu nhỏ, rồi sift-down → O(log n). &nbsp; <b>peek()</b> = a[0] → O(1).</p>

<h3>Ví dụ có lời giải — chèn 5 vào [2, 4, 8, 9, 7]</h3>
<div class="out"><b>Mảng:</b> [2, 4, 8, 9, 7] (là heap min hợp lệ). Thêm 5 vào cuối → [2, 4, 8, 9, 7, <b>5</b>] tại chỉ số 5.<br>
cha(5) = (5−1)/2 = 2 → a[2] = 8 &gt; 5 → đổi chỗ → [2, 4, <b>5</b>, 9, 7, 8], giờ ở chỉ số 2.<br>
cha(2) = 0 → a[0] = 2 ≤ 5 → dừng.<br>
<b>Kết quả:</b> [2, 4, 5, 9, 7, 8] — hai phép đổi chỗ, đúng bằng chiều cao cây. ✓</div>

<h3>Ví dụ có lời giải — removeMin từ [2, 4, 5, 9, 7, 8]</h3>
<div class="out">Trả về a[0] = <b>2</b>. Đưa phần tử cuối (8) lên gốc và thu nhỏ: [8, 4, 5, 9, 7].<br>
sift-down tại 0: hai con là 4 và 5 → nhỏ hơn là 4 → 8 &gt; 4 → đổi chỗ → [4, 8, 5, 9, 7], giờ ở chỉ số 1.<br>
con của 1 là chỉ số 3 (9) và 4 (7) → nhỏ hơn là 7 → 8 &gt; 7 → đổi chỗ → [4, 7, 5, 9, 8], giờ ở chỉ số 4 → không còn con → dừng.<br>
<b>Kết quả:</b> [4, 7, 5, 9, 8], heap hợp lệ với cực tiểu mới là 4 ở gốc. ✓</div>

<h3>Build-heap của Floyd — bất ngờ O(n)</h3>
<pre><span class="tok-keyword">void</span> <span class="tok-function">buildHeap</span>() {
    <span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = n/2 - 1; i &gt;= 0; i--) <span class="tok-function">siftDown</span>(i);   <span class="tok-comment">// nút trong cuối → gốc</span>
}</pre>
<div class="out"><b>Dựng heap từ [9, 4, 7, 1, −2, 6, 5] (n = 7):</b><br>
bắt đầu tại i = 7/2 − 1 = 2 → a[2] = 7, con là 6 và 5 → đổi với 5 → [9, 4, <b>5</b>, 1, −2, 6, 7]<br>
i = 1 → a[1] = 4, con là 1 và −2 → đổi với −2 → [9, <b>−2</b>, 5, 1, 4, 6, 7]<br>
i = 0 → a[0] = 9, con là −2 và 5 → đổi với −2 → [−2, 9, 5, …] → 9 lại sift xuống, so với 1 và 4 → đổi với 1 → <b>[−2, 1, 5, 9, 4, 6, 7]</b> ✓<br>
<b>Vì sao là O(n) chứ không O(n log n):</b> một nửa số nút là lá và tốn 0; một phần tư nằm cao hơn một tầng và tốn ≤ 1 phép đổi; một phần tám tốn ≤ 2… Tổng là n·Σ(k / 2<sup>k</sup>) hội tụ về <b>2n</b>. Còn chèn từng phần tử một thì đúng là O(n log n) — dựng hàng loạt rẻ hơn thật.</div>

<div class="pitfall"><b>Heap <em>không</em> phải mảng đã sắp xếp.</b> [2, 4, 5, 9, 7, 8] là heap hợp lệ nhưng không phải mảng sắp xếp; đảm bảo duy nhất là cha ≤ con. In mảng ra không cho kết quả đã sắp — phải removeMin liên tục (đó chính là heap sort, bài 6.5).</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đổi khoá ở giữa heap — thao tác mà Dijkstra cần.</b> Giảm khoá thì sift-up, tăng khoá thì sift-down, đều O(log n) — nhưng trước hết phải <em>tìm</em> được phần tử, mà việc đó là O(n) trên heap trần. Các cài đặt thật giữ thêm một bản đồ từ phần tử sang chỉ số mảng, cập nhật sau mỗi lần đổi chỗ ("hàng đợi ưu tiên có chỉ mục"). <span class="badge">PriorityQueue</span> của Java không có bản đồ đó, nên Dijkstra kiểu sách giáo khoa thay vào đó đẩy một bản ghi trùng và bỏ qua bản cũ khi lấy ra. <em>Ngoài giáo trình vì môn học chỉ trình bày heap với insert/removeMin, trong khi decrease-key mới là thứ giúp Dijkstra (bài 5.5) chạy trong O((n+m) log n).</em></div>
</div>
`,
        },
        {
          title: 'Quiz 3 — Trees & BST|||Quiz 3 — Cây & BST',
          slug: 'csd201-quiz-3',
          type: 'QUIZ',
          description: 'Kiểm tra cây, duyệt cây và BST.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'In-order traversal of a BST visits values…|||Duyệt in-order một BST thăm các giá trị…', options: ['in reverse|||theo thứ tự ngược', 'in sorted order|||theo thứ tự đã sắp', 'randomly|||ngẫu nhiên', 'by level|||theo tầng'], correctIndex: 1, points: 1 },
              { question: 'A balanced BST supports search in…|||BST cân bằng hỗ trợ tìm trong…', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctIndex: 1, points: 1 },
              { question: 'Inserting already-sorted data into a plain BST makes it…|||Chèn dữ liệu đã sắp vào BST thường khiến nó…', options: ['faster|||nhanh hơn', 'degenerate into a linked list (O(n))|||suy biến thành danh sách liên kết (O(n))', 'self-balance|||tự cân bằng', 'a heap|||một heap'], correctIndex: 1, points: 1 },
              { question: 'Pre-order traversal visits…|||Duyệt pre-order thăm…', options: ['left, node, right|||trái, nút, phải', 'node, left, right|||nút, trái, phải', 'left, right, node|||trái, phải, nút', 'right, node, left|||phải, nút, trái'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 5 — ĐỒ THỊ ══════════════════ */
    {
      title: 'Chapter 5 — Graphs|||Chương 5 — Đồ thị',
      description: 'Mạng lưới đỉnh & cạnh: biểu diễn (ma trận/danh sách kề) và duyệt BFS/DFS.',
      lessons: [
        {
          title: '5.1 — Graph representation & traversal|||5.1 — Biểu diễn & duyệt đồ thị',
          slug: 'csd201-do-thi',
          type: 'VIDEO',
          description: 'Ma trận kề vs danh sách kề; BFS (hàng đợi) và DFS (ngăn xếp/đệ quy).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Graphs — vertices &amp; edges</h2>
<p class="lead">A <strong>graph</strong> is a set of vertices connected by edges. It models roads, social networks, dependencies, the web. Two ways to store it, each with a trade-off:</p>
<table>
  <thead><tr><th>Representation</th><th>Space</th><th>Good for</th></tr></thead>
  <tbody>
    <tr><td>Adjacency matrix</td><td>O(V²)</td><td>dense graphs, O(1) edge check</td></tr>
    <tr><td>Adjacency list</td><td>O(V+E)</td><td>sparse graphs, cheap iteration</td></tr>
  </tbody>
</table>
<div class="lz-stack">
  <div class="lz-layer"><b>BFS (breadth-first)</b> — a <span class="badge">queue</span>; explores level by level. Finds the shortest path in an unweighted graph.</div>
  <div class="lz-layer"><b>DFS (depth-first)</b> — a <span class="badge">stack</span> or recursion; goes deep first. Used for cycle detection, topological sort, connectivity.</div>
</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Topological sort — ordering a DAG.</b> On a directed acyclic graph, a topological sort lists vertices so that every edge points forward — the basis of build systems, task schedulers and course prerequisites. Kahn's algorithm repeatedly removes vertices of in-degree zero using a queue in O(V+E); if any vertices remain, the graph had a cycle, giving a free cycle-detection test. <em>The syllabus teaches BFS/DFS as traversals; using DFS finish-order or in-degrees to produce a valid ordering is the next step.</em></div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms#module-508" target="_blank" rel="noopener">
  <span class="lc-ico">🕸️</span>
  <span class="lc-body"><span class="lc-title">Practise: Graph Algorithms</span><span class="lc-sub">Representation, BFS, DFS and more.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Đồ thị — đỉnh &amp; cạnh</h2>
<p class="lead"><strong>Đồ thị</strong> là một tập đỉnh nối bởi các cạnh. Nó mô hình đường sá, mạng xã hội, phụ thuộc, web. Hai cách lưu, mỗi cách một đánh đổi:</p>
<table>
  <thead><tr><th>Biểu diễn</th><th>Không gian</th><th>Tốt cho</th></tr></thead>
  <tbody>
    <tr><td>Ma trận kề</td><td>O(V²)</td><td>đồ thị dày, kiểm cạnh O(1)</td></tr>
    <tr><td>Danh sách kề</td><td>O(V+E)</td><td>đồ thị thưa, duyệt rẻ</td></tr>
  </tbody>
</table>
<div class="lz-stack">
  <div class="lz-layer"><b>BFS (chiều rộng)</b> — một <span class="badge">hàng đợi</span>; khám phá theo từng tầng. Tìm đường ngắn nhất trong đồ thị không trọng số.</div>
  <div class="lz-layer"><b>DFS (chiều sâu)</b> — một <span class="badge">ngăn xếp</span> hoặc đệ quy; đi sâu trước. Dùng phát hiện chu trình, sắp xếp tô-pô, kiểm liên thông.</div>
</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Sắp xếp tô-pô — thứ tự cho DAG.</b> Trên đồ thị có hướng không chu trình, sắp xếp tô-pô liệt kê các đỉnh sao cho mọi cạnh đều chỉ về phía trước — nền của hệ thống build, bộ lập lịch tác vụ và môn tiên quyết. Thuật toán Kahn liên tục loại các đỉnh có bậc vào bằng 0 bằng một hàng đợi trong O(V+E); nếu còn đỉnh sót thì đồ thị có chu trình, cho luôn một phép kiểm chu trình miễn phí. <em>Giáo trình dạy BFS/DFS như phép duyệt; dùng thứ tự kết thúc DFS hoặc bậc vào để tạo một thứ tự hợp lệ là bước tiếp theo.</em></div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms#module-508" target="_blank" rel="noopener">
  <span class="lc-ico">🕸️</span>
  <span class="lc-body"><span class="lc-title">Luyện: Graph Algorithms</span><span class="lc-sub">Biểu diễn, BFS, DFS và hơn nữa.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '5.2 — Three ways to store a graph|||5.2 — Ba cách lưu một đồ thị',
          slug: 'csd201-do-thi-bieu-dien',
          type: 'VIDEO',
          description: 'Danh sách cạnh, danh sách kề, ma trận kề — bảng chi phí đầy đủ và cách chọn theo mật độ đồ thị.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Edge list, adjacency list, adjacency matrix</h2>
<p class="lead">A graph is a set of vertices V and edges E. How you <em>store</em> E decides which questions are cheap. Get this table right and half of Chapter 5 becomes obvious.</p>

<h3>The same graph, three ways</h3>
<div class="diagram">A —— B
|   / |
|  /  |
C ——— D        edges: A-B, A-C, B-C, B-D, C-D</div>

<h4>1. Edge list — just a bag of pairs</h4>
<pre>[(A,B), (A,C), (B,C), (B,D), (C,D)]</pre>
<p>Tiny and simple. "Are A and D adjacent?" needs a full scan: O(m). Used when you only ever iterate over all edges — Kruskal's MST sorts exactly this list.</p>

<h4>2. Adjacency list — per-vertex neighbours (the default)</h4>
<pre>A → [B, C]
B → [A, C, D]
C → [A, B, D]
D → [B, C]</pre>
<pre><span class="tok-type">Map</span>&lt;<span class="tok-type">String</span>, <span class="tok-type">List</span>&lt;<span class="tok-type">String</span>&gt;&gt; g = <span class="tok-keyword">new</span> <span class="tok-type">HashMap</span>&lt;&gt;();
g.<span class="tok-function">computeIfAbsent</span>(<span class="tok-string">"A"</span>, k -&gt; <span class="tok-keyword">new</span> <span class="tok-type">ArrayList</span>&lt;&gt;()).<span class="tok-function">add</span>(<span class="tok-string">"B"</span>);   <span class="tok-comment">// undirected: add both ways</span>
g.<span class="tok-function">computeIfAbsent</span>(<span class="tok-string">"B"</span>, k -&gt; <span class="tok-keyword">new</span> <span class="tok-type">ArrayList</span>&lt;&gt;()).<span class="tok-function">add</span>(<span class="tok-string">"A"</span>);</pre>
<p>Memory O(n + m), and "list the neighbours of v" — the operation every traversal performs — is O(deg(v)). This is what BFS, DFS, Dijkstra and Prim all want.</p>

<h4>3. Adjacency matrix — an n×n table of booleans/weights</h4>
<pre>     A  B  C  D
  A  0  1  1  0
  B  1  0  1  1
  C  1  1  0  1
  D  0  1  1  0</pre>
<p>"Is (u,v) an edge?" is a single array read: O(1). The price is n² memory whether or not the edges exist, and listing one vertex's neighbours costs O(n) because you must scan its whole row.</p>

<h3>The cost table</h3>
<table><thead><tr><th>Operation</th><th>Edge list</th><th>Adjacency list</th><th>Adjacency matrix</th></tr></thead><tbody>
<tr><td>Memory</td><td>O(m)</td><td>O(n + m)</td><td><b>O(n²)</b></td></tr>
<tr><td>isAdjacent(u,v)</td><td>O(m)</td><td>O(deg(u))</td><td><b>O(1)</b></td></tr>
<tr><td>neighbours(v)</td><td>O(m)</td><td><b>O(deg(v))</b></td><td>O(n)</td></tr>
<tr><td>insertEdge</td><td>O(1)</td><td>O(1)</td><td>O(1)</td></tr>
<tr><td>removeVertex</td><td>O(m)</td><td>O(m)</td><td>O(n²) (rebuild)</td></tr>
<tr><td>Full traversal (BFS/DFS)</td><td>—</td><td><b>O(n + m)</b></td><td>O(n²)</td></tr>
</tbody></table>

<h3>Worked example — pick one for a real workload</h3>
<div class="out"><b>Case A — a social network:</b> n = 1,000,000 users, average 200 friends → m ≈ 100 million.<br>
Matrix: 10¹² cells ≈ 1 TB even as single bits → <b>impossible</b>. Adjacency list: 100M entries ≈ a few GB → <b>the only option</b>. Such a graph is <em>sparse</em> (m ≪ n²).<br>
<b>Case B — a 300-city road-distance table:</b> n = 300, nearly every pair connected → m ≈ 45,000, close to n²/2 (<em>dense</em>).<br>
Matrix: 90,000 cells ≈ 720 KB, with O(1) lookup → <b>the right choice</b>; Floyd–Warshall all-pairs shortest paths is written directly on the matrix.<br>
<b>Rule:</b> sparse → adjacency list; dense or you need instant edge tests → matrix.</div>

<div class="pitfall"><b>In an undirected graph, insert every edge twice.</b> Adding only <span class="badge">A → B</span> silently makes the graph directed, and your BFS will fail to reach half the vertices. Also remember Σdeg(v) = 2m, so the neighbour lists hold twice the edge count.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Compressed Sparse Row (CSR) — how real graph engines store graphs.</b> Instead of a list of objects per vertex, keep two flat arrays: <span class="badge">offset[]</span> of length n+1 and <span class="badge">target[]</span> of length m. Vertex v's neighbours are <span class="badge">target[offset[v] .. offset[v+1]−1]</span>. Same O(n+m) memory but contiguous, so traversal is far more cache-friendly — and it maps directly onto GPU kernels. Neo4j, SciPy sparse matrices and most PageRank implementations use exactly this. <em>Beyond syllabus because the course stops at the three textbook forms, while the fourth is the one production systems actually use.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Danh sách cạnh, danh sách kề, ma trận kề</h2>
<p class="lead">Đồ thị là một tập đỉnh V và tập cạnh E. Cách bạn <em>lưu</em> E quyết định câu hỏi nào rẻ. Nắm chắc bảng này thì một nửa Chương 5 trở nên hiển nhiên.</p>

<h3>Cùng một đồ thị, ba cách</h3>
<div class="diagram">A —— B
|   / |
|  /  |
C ——— D        cạnh: A-B, A-C, B-C, B-D, C-D</div>

<h4>1. Danh sách cạnh — chỉ là một túi các cặp</h4>
<pre>[(A,B), (A,C), (B,C), (B,D), (C,D)]</pre>
<p>Nhỏ gọn và đơn giản. "A với D có kề nhau không?" phải quét toàn bộ: O(m). Dùng khi bạn chỉ duyệt qua tất cả các cạnh — thuật toán Kruskal sắp xếp đúng danh sách này.</p>

<h4>2. Danh sách kề — hàng xóm theo từng đỉnh (mặc định)</h4>
<pre>A → [B, C]
B → [A, C, D]
C → [A, B, D]
D → [B, C]</pre>
<pre><span class="tok-type">Map</span>&lt;<span class="tok-type">String</span>, <span class="tok-type">List</span>&lt;<span class="tok-type">String</span>&gt;&gt; g = <span class="tok-keyword">new</span> <span class="tok-type">HashMap</span>&lt;&gt;();
g.<span class="tok-function">computeIfAbsent</span>(<span class="tok-string">"A"</span>, k -&gt; <span class="tok-keyword">new</span> <span class="tok-type">ArrayList</span>&lt;&gt;()).<span class="tok-function">add</span>(<span class="tok-string">"B"</span>);   <span class="tok-comment">// vô hướng: thêm cả hai chiều</span>
g.<span class="tok-function">computeIfAbsent</span>(<span class="tok-string">"B"</span>, k -&gt; <span class="tok-keyword">new</span> <span class="tok-type">ArrayList</span>&lt;&gt;()).<span class="tok-function">add</span>(<span class="tok-string">"A"</span>);</pre>
<p>Bộ nhớ O(n + m), và "liệt kê hàng xóm của v" — thao tác mà mọi phép duyệt đều làm — là O(deg(v)). Đây là thứ mà BFS, DFS, Dijkstra và Prim đều cần.</p>

<h4>3. Ma trận kề — bảng n×n các bit/trọng số</h4>
<pre>     A  B  C  D
  A  0  1  1  0
  B  1  0  1  1
  C  1  1  0  1
  D  0  1  1  0</pre>
<p>"(u,v) có phải cạnh không?" chỉ là một phép đọc mảng: O(1). Cái giá là n² ô bộ nhớ dù cạnh có tồn tại hay không, và liệt kê hàng xóm của một đỉnh tốn O(n) vì phải quét cả hàng.</p>

<h3>Bảng chi phí</h3>
<table><thead><tr><th>Thao tác</th><th>Danh sách cạnh</th><th>Danh sách kề</th><th>Ma trận kề</th></tr></thead><tbody>
<tr><td>Bộ nhớ</td><td>O(m)</td><td>O(n + m)</td><td><b>O(n²)</b></td></tr>
<tr><td>isAdjacent(u,v)</td><td>O(m)</td><td>O(deg(u))</td><td><b>O(1)</b></td></tr>
<tr><td>neighbours(v)</td><td>O(m)</td><td><b>O(deg(v))</b></td><td>O(n)</td></tr>
<tr><td>insertEdge</td><td>O(1)</td><td>O(1)</td><td>O(1)</td></tr>
<tr><td>removeVertex</td><td>O(m)</td><td>O(m)</td><td>O(n²) (dựng lại)</td></tr>
<tr><td>Duyệt toàn bộ (BFS/DFS)</td><td>—</td><td><b>O(n + m)</b></td><td>O(n²)</td></tr>
</tbody></table>

<h3>Ví dụ có lời giải — chọn cấu trúc cho tải công việc thật</h3>
<div class="out"><b>Ca A — mạng xã hội:</b> n = 1.000.000 người dùng, trung bình 200 bạn → m ≈ 100 triệu.<br>
Ma trận: 10¹² ô, dù mỗi ô 1 bit cũng ≈ 1 TB → <b>bất khả thi</b>. Danh sách kề: 100 triệu mục ≈ vài GB → <b>lựa chọn duy nhất</b>. Đồ thị như vậy là <em>thưa</em> (m ≪ n²).<br>
<b>Ca B — bảng khoảng cách 300 thành phố:</b> n = 300, gần như mọi cặp đều nối → m ≈ 45.000, xấp xỉ n²/2 (<em>dày</em>).<br>
Ma trận: 90.000 ô ≈ 720 KB, tra cứu O(1) → <b>lựa chọn đúng</b>; thuật toán Floyd–Warshall tìm đường ngắn nhất mọi cặp viết thẳng trên ma trận.<br>
<b>Quy tắc:</b> thưa → danh sách kề; dày hoặc cần kiểm cạnh tức thì → ma trận.</div>

<div class="pitfall"><b>Với đồ thị vô hướng, phải chèn mỗi cạnh hai lần.</b> Chỉ thêm <span class="badge">A → B</span> là âm thầm biến đồ thị thành có hướng, và BFS của bạn sẽ không tới được một nửa số đỉnh. Cũng nhớ Σdeg(v) = 2m, nên các danh sách kề chứa gấp đôi số cạnh.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Compressed Sparse Row (CSR) — cách các bộ máy đồ thị thật lưu đồ thị.</b> Thay vì một danh sách đối tượng cho mỗi đỉnh, hãy giữ hai mảng phẳng: <span class="badge">offset[]</span> dài n+1 và <span class="badge">target[]</span> dài m. Hàng xóm của đỉnh v là <span class="badge">target[offset[v] .. offset[v+1]−1]</span>. Vẫn O(n+m) bộ nhớ nhưng liền khối, nên duyệt thân thiện với cache hơn hẳn — và ánh xạ thẳng lên nhân GPU. Neo4j, ma trận thưa của SciPy và hầu hết cài đặt PageRank đều dùng đúng cách này. <em>Ngoài giáo trình vì môn học dừng ở ba dạng sách vở, còn dạng thứ tư mới là thứ hệ thống thật dùng.</em></div>
</div>
`,
        },
        {
          title: '5.3 — DFS: cycles, components, topological order|||5.3 — DFS: chu trình, thành phần liên thông, sắp xếp tô-pô',
          slug: 'csd201-dfs',
          type: 'VIDEO',
          description: 'Duyệt theo chiều sâu, phân loại cạnh, và ba ứng dụng rút ra trực tiếp từ cây DFS.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Depth-first search — go deep, then back up</h2>
<p class="lead">DFS follows one path as far as it goes, then backtracks. Written recursively it is six lines; what makes it powerful is what you can read off the traversal afterwards — cycles, connected components and a valid ordering of dependencies all fall out of the same walk.</p>

<pre><span class="tok-keyword">void</span> <span class="tok-function">dfs</span>(<span class="tok-type">String</span> v, <span class="tok-type">Set</span>&lt;<span class="tok-type">String</span>&gt; visited) {
    visited.<span class="tok-function">add</span>(v);
    <span class="tok-function">visit</span>(v);                                <span class="tok-comment">// pre-order position</span>
    <span class="tok-keyword">for</span> (<span class="tok-type">String</span> u : g.<span class="tok-function">getOrDefault</span>(v, <span class="tok-type">List</span>.<span class="tok-function">of</span>()))
        <span class="tok-keyword">if</span> (!visited.<span class="tok-function">contains</span>(u)) <span class="tok-function">dfs</span>(u, visited);
    <span class="tok-comment">// post-order position — used for topological sort</span>
}</pre>
<p>Cost <b>O(n + m)</b> with an adjacency list: every vertex is marked once, every edge inspected once (twice if undirected).</p>

<h3>Worked example — trace DFS from A</h3>
<div class="diagram">A → B → D
↓       ↑
C ——————┘        edges: A→B, A→C, B→D, C→D</div>
<div class="out"><b>Start dfs(A):</b> visit A, mark {A}.<br>
&nbsp;&nbsp;neighbour B unvisited → dfs(B): visit B, mark {A,B}.<br>
&nbsp;&nbsp;&nbsp;&nbsp;neighbour D unvisited → dfs(D): visit D, mark {A,B,D}; D has no out-edges → return.<br>
&nbsp;&nbsp;back in B: no more neighbours → return.<br>
&nbsp;&nbsp;back in A: neighbour C unvisited → dfs(C): visit C; its neighbour D is already visited → skip → return.<br>
<b>Visit order (pre-order): A, B, D, C.</b> &nbsp; <b>Finish order (post-order): D, B, C, A.</b><br>
The <em>reverse</em> of the finish order — A, C, B, D — is a valid topological ordering: every edge points forward in that list. Check: A→B ✓, A→C ✓, B→D ✓, C→D ✓.</div>

<h3>Iterative DFS — the stack version</h3>
<pre><span class="tok-type">Deque</span>&lt;<span class="tok-type">String</span>&gt; st = <span class="tok-keyword">new</span> <span class="tok-type">ArrayDeque</span>&lt;&gt;();
st.<span class="tok-function">push</span>(start);
<span class="tok-keyword">while</span> (!st.<span class="tok-function">isEmpty</span>()) {
    <span class="tok-type">String</span> v = st.<span class="tok-function">pop</span>();
    <span class="tok-keyword">if</span> (!visited.<span class="tok-function">add</span>(v)) <span class="tok-keyword">continue</span>;       <span class="tok-comment">// add() returns false if already there</span>
    <span class="tok-function">visit</span>(v);
    <span class="tok-keyword">for</span> (<span class="tok-type">String</span> u : g.<span class="tok-function">get</span>(v)) <span class="tok-keyword">if</span> (!visited.<span class="tok-function">contains</span>(u)) st.<span class="tok-function">push</span>(u);
}</pre>
<p>Same traversal, no recursion — and no <span class="badge">StackOverflowError</span> on a graph with a million vertices. Replace the stack with a queue and you have BFS (lesson 5.4): the algorithms differ only in the container.</p>

<h3>Three things DFS gives you for free</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Connected components.</b> Loop over all vertices; each time you find an unvisited one, run DFS and increment a counter. The number of DFS launches = the number of components. O(n + m) total.</div>
  <div class="lz-layer"><b>Cycle detection.</b> Undirected: a cycle exists if DFS meets an already-visited vertex that is not the parent it came from. Directed: keep three colours (white = unseen, grey = on the current path, black = finished); an edge into a <em>grey</em> vertex is a back edge, and a back edge means a cycle.</div>
  <div class="lz-layer"><b>Topological sort.</b> On a DAG, push each vertex onto a stack when it <em>finishes</em>; popping gives an order where every task comes before the tasks that depend on it. This is how build systems, course prerequisites and package managers schedule work.</div>
</div>

<div class="pitfall"><b>Mark a vertex as visited when you <em>push</em> or <em>enter</em> it, not when you process it later.</b> If you check "visited" only at pop time in a dense graph, the stack fills with duplicates and the memory blows up; in a cyclic graph the recursive version loops forever.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Edge classification and Tarjan's SCC.</b> A DFS on a directed graph splits every edge into tree, back, forward or cross edges — and that classification is the foundation of the strongly-connected-components algorithm (Tarjan, 1972), which finds all mutually reachable groups in one pass using low-link numbers. It is how compilers detect mutually recursive functions, how deadlock detectors find dependency cycles, and how link analysis condenses the web graph. <em>Beyond syllabus because CSD201 stops at "DFS visits everything reachable", while the low-link idea turns the same O(n+m) walk into a much stronger structural result.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Tìm kiếm theo chiều sâu — đi sâu rồi lùi lại</h2>
<p class="lead">DFS đi theo một đường tới hết mức rồi quay lui. Viết đệ quy chỉ sáu dòng; điều làm nó mạnh là những gì bạn đọc được từ phép duyệt sau đó — chu trình, thành phần liên thông và một thứ tự phụ thuộc hợp lệ đều rơi ra từ cùng một lần đi.</p>

<pre><span class="tok-keyword">void</span> <span class="tok-function">dfs</span>(<span class="tok-type">String</span> v, <span class="tok-type">Set</span>&lt;<span class="tok-type">String</span>&gt; visited) {
    visited.<span class="tok-function">add</span>(v);
    <span class="tok-function">visit</span>(v);                                <span class="tok-comment">// vị trí tiền thứ tự</span>
    <span class="tok-keyword">for</span> (<span class="tok-type">String</span> u : g.<span class="tok-function">getOrDefault</span>(v, <span class="tok-type">List</span>.<span class="tok-function">of</span>()))
        <span class="tok-keyword">if</span> (!visited.<span class="tok-function">contains</span>(u)) <span class="tok-function">dfs</span>(u, visited);
    <span class="tok-comment">// vị trí hậu thứ tự — dùng cho sắp xếp tô-pô</span>
}</pre>
<p>Chi phí <b>O(n + m)</b> với danh sách kề: mỗi đỉnh được đánh dấu một lần, mỗi cạnh được xét một lần (hai lần nếu vô hướng).</p>

<h3>Ví dụ có lời giải — chạy tay DFS từ A</h3>
<div class="diagram">A → B → D
↓       ↑
C ——————┘        cạnh: A→B, A→C, B→D, C→D</div>
<div class="out"><b>Bắt đầu dfs(A):</b> thăm A, đánh dấu {A}.<br>
&nbsp;&nbsp;hàng xóm B chưa thăm → dfs(B): thăm B, đánh dấu {A,B}.<br>
&nbsp;&nbsp;&nbsp;&nbsp;hàng xóm D chưa thăm → dfs(D): thăm D, đánh dấu {A,B,D}; D không có cạnh ra → trở về.<br>
&nbsp;&nbsp;về lại B: hết hàng xóm → trở về.<br>
&nbsp;&nbsp;về lại A: hàng xóm C chưa thăm → dfs(C): thăm C; hàng xóm D của nó đã thăm → bỏ qua → trở về.<br>
<b>Thứ tự thăm (tiền thứ tự): A, B, D, C.</b> &nbsp; <b>Thứ tự kết thúc (hậu thứ tự): D, B, C, A.</b><br>
<em>Đảo ngược</em> thứ tự kết thúc — A, C, B, D — là một thứ tự tô-pô hợp lệ: mọi cạnh đều chỉ về phía trước trong danh sách đó. Kiểm: A→B ✓, A→C ✓, B→D ✓, C→D ✓.</div>

<h3>DFS không đệ quy — bản dùng ngăn xếp</h3>
<pre><span class="tok-type">Deque</span>&lt;<span class="tok-type">String</span>&gt; st = <span class="tok-keyword">new</span> <span class="tok-type">ArrayDeque</span>&lt;&gt;();
st.<span class="tok-function">push</span>(start);
<span class="tok-keyword">while</span> (!st.<span class="tok-function">isEmpty</span>()) {
    <span class="tok-type">String</span> v = st.<span class="tok-function">pop</span>();
    <span class="tok-keyword">if</span> (!visited.<span class="tok-function">add</span>(v)) <span class="tok-keyword">continue</span>;       <span class="tok-comment">// add() trả false nếu đã có</span>
    <span class="tok-function">visit</span>(v);
    <span class="tok-keyword">for</span> (<span class="tok-type">String</span> u : g.<span class="tok-function">get</span>(v)) <span class="tok-keyword">if</span> (!visited.<span class="tok-function">contains</span>(u)) st.<span class="tok-function">push</span>(u);
}</pre>
<p>Cùng phép duyệt, không đệ quy — và không <span class="badge">StackOverflowError</span> trên đồ thị một triệu đỉnh. Thay ngăn xếp bằng hàng đợi là bạn có BFS (bài 5.4): hai thuật toán chỉ khác nhau ở cái vật chứa.</p>

<h3>Ba thứ DFS cho bạn miễn phí</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Thành phần liên thông.</b> Duyệt qua mọi đỉnh; mỗi lần gặp một đỉnh chưa thăm thì chạy DFS và tăng bộ đếm. Số lần khởi động DFS = số thành phần. Tổng O(n + m).</div>
  <div class="lz-layer"><b>Phát hiện chu trình.</b> Vô hướng: có chu trình nếu DFS gặp một đỉnh đã thăm mà không phải nút cha vừa đi tới. Có hướng: dùng ba màu (trắng = chưa gặp, xám = đang nằm trên đường đi hiện tại, đen = đã xong); một cạnh đi vào đỉnh <em>xám</em> là cạnh lùi, và cạnh lùi nghĩa là có chu trình.</div>
  <div class="lz-layer"><b>Sắp xếp tô-pô.</b> Trên DAG, đẩy mỗi đỉnh vào ngăn xếp khi nó <em>kết thúc</em>; lấy ra sẽ được thứ tự trong đó mọi việc đứng trước những việc phụ thuộc vào nó. Đây là cách hệ thống build, môn tiên quyết và trình quản lý gói lập lịch công việc.</div>
</div>

<div class="pitfall"><b>Đánh dấu đã thăm lúc <em>đẩy vào</em> hoặc <em>bước vào</em> đỉnh, chứ không phải lúc xử lý xong.</b> Nếu chỉ kiểm "đã thăm" khi lấy ra, trên đồ thị dày ngăn xếp sẽ đầy bản trùng và bộ nhớ nổ; còn trên đồ thị có chu trình thì bản đệ quy lặp vô tận.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Phân loại cạnh và thuật toán SCC của Tarjan.</b> DFS trên đồ thị có hướng chia mọi cạnh thành cạnh cây, cạnh lùi, cạnh tiến hoặc cạnh chéo — và cách phân loại đó là nền của thuật toán tìm thành phần liên thông mạnh (Tarjan, 1972), tìm mọi nhóm đỉnh tới được lẫn nhau chỉ trong một lượt nhờ chỉ số low-link. Đó là cách trình biên dịch phát hiện các hàm đệ quy tương hỗ, cách bộ dò khoá chết tìm chu trình phụ thuộc, và cách phân tích liên kết cô đặc đồ thị web. <em>Ngoài giáo trình vì CSD201 dừng ở "DFS thăm mọi thứ tới được", trong khi ý tưởng low-link biến đúng phép đi O(n+m) đó thành một kết quả cấu trúc mạnh hơn nhiều.</em></div>
</div>
`,
        },
        {
          title: '5.4 — BFS & shortest paths in unweighted graphs|||5.4 — BFS & đường đi ngắn nhất trên đồ thị không trọng số',
          slug: 'csd201-bfs',
          type: 'VIDEO',
          description: 'Duyệt theo chiều rộng bằng hàng đợi, cây BFS, và vì sao BFS cho đường đi ít cạnh nhất.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>Breadth-first search — level by level</h2>
<p class="lead">BFS explores every vertex at distance 1, then every vertex at distance 2, and so on. Because it never skips a level, <strong>the first time it reaches a vertex it has used the fewest possible edges</strong> — that single fact makes BFS the shortest-path algorithm for unweighted graphs.</p>

<pre><span class="tok-keyword">void</span> <span class="tok-function">bfs</span>(<span class="tok-type">String</span> src) {
    <span class="tok-type">Map</span>&lt;<span class="tok-type">String</span>,<span class="tok-type">Integer</span>&gt; dist = <span class="tok-keyword">new</span> <span class="tok-type">HashMap</span>&lt;&gt;();
    <span class="tok-type">Map</span>&lt;<span class="tok-type">String</span>,<span class="tok-type">String</span>&gt;  parent = <span class="tok-keyword">new</span> <span class="tok-type">HashMap</span>&lt;&gt;();
    <span class="tok-type">Queue</span>&lt;<span class="tok-type">String</span>&gt; q = <span class="tok-keyword">new</span> <span class="tok-type">ArrayDeque</span>&lt;&gt;();
    dist.<span class="tok-function">put</span>(src, 0); q.<span class="tok-function">add</span>(src);
    <span class="tok-keyword">while</span> (!q.<span class="tok-function">isEmpty</span>()) {
        <span class="tok-type">String</span> v = q.<span class="tok-function">poll</span>();
        <span class="tok-keyword">for</span> (<span class="tok-type">String</span> u : g.<span class="tok-function">getOrDefault</span>(v, <span class="tok-type">List</span>.<span class="tok-function">of</span>())) {
            <span class="tok-keyword">if</span> (!dist.<span class="tok-function">containsKey</span>(u)) {          <span class="tok-comment">// first time = shortest</span>
                dist.<span class="tok-function">put</span>(u, dist.<span class="tok-function">get</span>(v) + 1);
                parent.<span class="tok-function">put</span>(u, v);                 <span class="tok-comment">// remember how we got here</span>
                q.<span class="tok-function">add</span>(u);
            }
        }
    }
}</pre>

<h3>Worked example — BFS from A</h3>
<div class="diagram">A —— B —— E
|     |
C —— D —— F        edges: A-B, A-C, B-D, B-E, C-D, D-F</div>
<div class="out"><b>Queue trace</b> (dist in brackets):<br>
start: q = [A(0)]<br>
pop A → discover B(1), C(1) → q = [B, C]<br>
pop B → A seen; discover D(2), E(2) → q = [C, D, E]<br>
pop C → A seen, D already discovered at 2 → q = [D, E]<br>
pop D → discover F(3) → q = [E, F]<br>
pop E, pop F → queue empty.<br>
<b>Distances from A:</b> B=1, C=1, D=2, E=2, F=3.<br>
<b>Reconstruct the path to F:</b> follow parents backwards F←D←B←A → the path is <b>A → B → D → F</b>, 3 edges — and no shorter path exists.<br>
<b>Note C→D:</b> D was already found at distance 2 through B, so the edge C–D is ignored. Once a vertex is dequeued its distance is final.</div>

<h3>DFS or BFS? A decision table</h3>
<table><thead><tr><th>You need</th><th>Use</th><th>Why</th></tr></thead><tbody>
<tr><td>Fewest-edges path</td><td><b>BFS</b></td><td>explores by increasing distance</td></tr>
<tr><td>Any path / reachability</td><td>either</td><td>both visit everything reachable</td></tr>
<tr><td>Cycle detection, topological order</td><td><b>DFS</b></td><td>needs finish times / back edges</td></tr>
<tr><td>Deep graph, memory is tight</td><td>DFS</td><td>stack holds one path: O(h)</td></tr>
<tr><td>Wide graph (huge branching)</td><td>DFS</td><td>a BFS queue can hold O(n) vertices at once</td></tr>
<tr><td>"Closest to me" queries</td><td>BFS</td><td>friends-of-friends, degrees of separation</td></tr>
</tbody></table>

<div class="pitfall"><b>Mark a vertex when you <em>enqueue</em> it, not when you dequeue it.</b> Otherwise the same vertex enters the queue once per incoming edge — the queue swells to O(m) and, on a dense graph, the run degenerates badly. This is the single most common BFS bug.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Bidirectional BFS halves the exponent.</b> Searching from the source and the target at the same time and stopping when the two frontiers meet explores about 2·b<sup>d/2</sup> vertices instead of b<sup>d</sup> — for branching factor b = 100 and distance d = 6 that is roughly 2 million instead of 10¹². Routing engines and social-graph "degrees of separation" queries use it routinely; the tricky part is that both frontiers must expand level by level in lockstep. <em>Beyond syllabus because the course presents BFS as a single-source walk, while the two-sided variant is the version that makes web-scale queries feasible.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Tìm kiếm theo chiều rộng — từng tầng một</h2>
<p class="lead">BFS khám phá mọi đỉnh cách 1, rồi mọi đỉnh cách 2, và cứ thế. Vì không bao giờ nhảy cóc tầng nào, <strong>lần đầu nó chạm tới một đỉnh là lần dùng ít cạnh nhất có thể</strong> — chỉ sự thật đó làm BFS trở thành thuật toán đường đi ngắn nhất cho đồ thị không trọng số.</p>

<pre><span class="tok-keyword">void</span> <span class="tok-function">bfs</span>(<span class="tok-type">String</span> src) {
    <span class="tok-type">Map</span>&lt;<span class="tok-type">String</span>,<span class="tok-type">Integer</span>&gt; dist = <span class="tok-keyword">new</span> <span class="tok-type">HashMap</span>&lt;&gt;();
    <span class="tok-type">Map</span>&lt;<span class="tok-type">String</span>,<span class="tok-type">String</span>&gt;  parent = <span class="tok-keyword">new</span> <span class="tok-type">HashMap</span>&lt;&gt;();
    <span class="tok-type">Queue</span>&lt;<span class="tok-type">String</span>&gt; q = <span class="tok-keyword">new</span> <span class="tok-type">ArrayDeque</span>&lt;&gt;();
    dist.<span class="tok-function">put</span>(src, 0); q.<span class="tok-function">add</span>(src);
    <span class="tok-keyword">while</span> (!q.<span class="tok-function">isEmpty</span>()) {
        <span class="tok-type">String</span> v = q.<span class="tok-function">poll</span>();
        <span class="tok-keyword">for</span> (<span class="tok-type">String</span> u : g.<span class="tok-function">getOrDefault</span>(v, <span class="tok-type">List</span>.<span class="tok-function">of</span>())) {
            <span class="tok-keyword">if</span> (!dist.<span class="tok-function">containsKey</span>(u)) {          <span class="tok-comment">// lần đầu = ngắn nhất</span>
                dist.<span class="tok-function">put</span>(u, dist.<span class="tok-function">get</span>(v) + 1);
                parent.<span class="tok-function">put</span>(u, v);                 <span class="tok-comment">// nhớ đã tới đây bằng đường nào</span>
                q.<span class="tok-function">add</span>(u);
            }
        }
    }
}</pre>

<h3>Ví dụ có lời giải — BFS từ A</h3>
<div class="diagram">A —— B —— E
|     |
C —— D —— F        cạnh: A-B, A-C, B-D, B-E, C-D, D-F</div>
<div class="out"><b>Diễn biến hàng đợi</b> (khoảng cách trong ngoặc):<br>
đầu: q = [A(0)]<br>
lấy A → phát hiện B(1), C(1) → q = [B, C]<br>
lấy B → A đã gặp; phát hiện D(2), E(2) → q = [C, D, E]<br>
lấy C → A đã gặp, D đã được phát hiện ở 2 → q = [D, E]<br>
lấy D → phát hiện F(3) → q = [E, F]<br>
lấy E, lấy F → hàng đợi rỗng.<br>
<b>Khoảng cách từ A:</b> B=1, C=1, D=2, E=2, F=3.<br>
<b>Dựng lại đường đi tới F:</b> lần theo cha đi ngược F←D←B←A → đường đi là <b>A → B → D → F</b>, 3 cạnh — và không có đường nào ngắn hơn.<br>
<b>Chú ý cạnh C→D:</b> D đã được tìm thấy ở khoảng cách 2 qua B, nên cạnh C–D bị bỏ qua. Một khi đỉnh đã ra khỏi hàng đợi thì khoảng cách của nó là chung cuộc.</div>

<h3>DFS hay BFS? Bảng quyết định</h3>
<table><thead><tr><th>Bạn cần</th><th>Dùng</th><th>Vì sao</th></tr></thead><tbody>
<tr><td>Đường ít cạnh nhất</td><td><b>BFS</b></td><td>khám phá theo khoảng cách tăng dần</td></tr>
<tr><td>Đường bất kỳ / kiểm tới được</td><td>cái nào cũng được</td><td>cả hai đều thăm mọi thứ tới được</td></tr>
<tr><td>Phát hiện chu trình, sắp xếp tô-pô</td><td><b>DFS</b></td><td>cần thời điểm kết thúc / cạnh lùi</td></tr>
<tr><td>Đồ thị sâu, bộ nhớ eo hẹp</td><td>DFS</td><td>ngăn xếp chỉ giữ một đường: O(h)</td></tr>
<tr><td>Đồ thị rộng (phân nhánh lớn)</td><td>DFS</td><td>hàng đợi BFS có thể giữ O(n) đỉnh cùng lúc</td></tr>
<tr><td>Truy vấn "gần tôi nhất"</td><td>BFS</td><td>bạn của bạn, số bậc quen biết</td></tr>
</tbody></table>

<div class="pitfall"><b>Đánh dấu đỉnh khi <em>đưa vào</em> hàng đợi, không phải khi lấy ra.</b> Nếu không, cùng một đỉnh vào hàng đợi một lần cho mỗi cạnh đi tới nó — hàng đợi phình lên O(m) và trên đồ thị dày thì chạy tệ hẳn đi. Đây là lỗi BFS phổ biến nhất.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>BFS hai chiều cắt đôi số mũ.</b> Tìm đồng thời từ nguồn và từ đích rồi dừng khi hai mặt sóng gặp nhau chỉ khám phá khoảng 2·b<sup>d/2</sup> đỉnh thay vì b<sup>d</sup> — với hệ số phân nhánh b = 100 và khoảng cách d = 6, đó là khoảng 2 triệu thay vì 10¹². Các bộ máy định tuyến và truy vấn "số bậc quen biết" trên mạng xã hội dùng nó thường xuyên; chỗ khó là cả hai mặt sóng phải nở từng tầng đồng bộ với nhau. <em>Ngoài giáo trình vì môn học trình bày BFS như phép đi từ một nguồn, còn biến thể hai đầu mới là bản làm cho truy vấn quy mô web trở nên khả thi.</em></div>
</div>
`,
        },
        {
          title: '5.5 — Dijkstra step by step|||5.5 — Dijkstra từng bước',
          slug: 'csd201-dijkstra',
          type: 'VIDEO',
          description: 'Đường đi ngắn nhất có trọng số: bảng chạy tay đầy đủ, vai trò hàng đợi ưu tiên, và vì sao sập với cạnh âm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.5</span>
<h2>Dijkstra — shortest paths when edges have weights</h2>
<p class="lead">BFS counts edges. Once edges carry a <strong>cost</strong> (kilometres, minutes, price), the path with the fewest edges is often not the cheapest. Dijkstra's algorithm repeatedly finalises the <em>nearest unfinalised vertex</em> — a greedy choice that is provably correct as long as no weight is negative.</p>

<h3>The algorithm in four rules</h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>1. Init</b><span>dist[src] = 0, every other dist = ∞.</span></div>
  <div class="lz-fitem"><b>2. Pick</b><span>Take the unfinalised vertex with the smallest dist (use a min-heap).</span></div>
  <div class="lz-fitem"><b>3. Relax</b><span>For each neighbour u: if dist[v] + w(v,u) &lt; dist[u], improve dist[u] and set parent[u] = v.</span></div>
  <div class="lz-fitem"><b>4. Finalise</b><span>Mark v done; its distance can never improve again. Repeat until all are done.</span></div>
</div>
<div class="formula"><span class="lbl">RELAXATION</span>dist[u] = min( dist[u], &nbsp;dist[v] + w(v, u) )</div>

<h3>Worked example — full table, source A</h3>
<div class="diagram">      4         8
  A ————— B ————— C
  |     / |      /|
 2|  1/   |3  2/  |6
  | /     |  /    |
  D ————— E ————— F
      7        5

weights: A-B 4, A-D 2, B-D 1, B-C 8, B-E 3, D-E 7, C-E 2, C-F 6, E-F 5</div>
<div class="out"><b>Round 0 —</b> dist: A=0, others ∞. Heap: [A(0)].<br>
<b>Round 1 — finalise A(0).</b> Relax A-B: 0+4 = 4 &lt; ∞ → B=4 (parent A). Relax A-D: 0+2 = 2 → D=2 (parent A).<br>
&nbsp;&nbsp;dist: B=4, D=2, rest ∞.<br>
<b>Round 2 — smallest is D(2), finalise.</b> Relax D-B: 2+1 = 3 &lt; 4 → <b>B improves to 3</b> (parent D). Relax D-E: 2+7 = 9 → E=9.<br>
<b>Round 3 — smallest is B(3), finalise.</b> Relax B-C: 3+8 = 11 → C=11. Relax B-E: 3+3 = 6 &lt; 9 → <b>E improves to 6</b> (parent B).<br>
<b>Round 4 — smallest is E(6), finalise.</b> Relax E-C: 6+2 = 8 &lt; 11 → <b>C improves to 8</b> (parent E). Relax E-F: 6+5 = 11 → F=11.<br>
<b>Round 5 — smallest is C(8), finalise.</b> Relax C-F: 8+6 = 14, not better than 11 → no change.<br>
<b>Round 6 — finalise F(11).</b> Done.<br>
<b>Final distances from A:</b> A=0, D=2, B=3, E=6, C=8, F=11.<br>
<b>Path to F:</b> follow parents F←E←B←D←A → <b>A → D → B → E → F</b>, total 2+1+3+5 = 11. Note it uses <em>four</em> edges while the direct-looking A→B→C→F costs 4+8+6 = 18. Fewest edges ≠ cheapest.</div>

<h3>Cost</h3>
<table><thead><tr><th>Priority queue</th><th>Complexity</th><th>Best for</th></tr></thead><tbody>
<tr><td>Linear scan for the minimum</td><td>O(n²)</td><td>dense graphs (m ≈ n²)</td></tr>
<tr><td>Binary heap</td><td><b>O((n + m) log n)</b></td><td>sparse graphs — the usual case</td></tr>
<tr><td>Fibonacci heap</td><td>O(m + n log n)</td><td>theory; constants too large in practice</td></tr>
</tbody></table>

<pre><span class="tok-type">PriorityQueue</span>&lt;<span class="tok-type">int</span>[]&gt; pq = <span class="tok-keyword">new</span> <span class="tok-type">PriorityQueue</span>&lt;&gt;((x, y) -&gt; x[1] - y[1]);  <span class="tok-comment">// {vertex, dist}</span>
pq.<span class="tok-function">add</span>(<span class="tok-keyword">new</span> <span class="tok-type">int</span>[]{src, 0});
<span class="tok-keyword">while</span> (!pq.<span class="tok-function">isEmpty</span>()) {
    <span class="tok-type">int</span>[] top = pq.<span class="tok-function">poll</span>();
    <span class="tok-keyword">if</span> (top[1] &gt; dist[top[0]]) <span class="tok-keyword">continue</span>;      <span class="tok-comment">// stale entry — skip (see 4.7 ★)</span>
    <span class="tok-keyword">for</span> (Edge e : adj[top[0]])
        <span class="tok-keyword">if</span> (dist[top[0]] + e.w &lt; dist[e.to]) {
            dist[e.to] = dist[top[0]] + e.w;
            pq.<span class="tok-function">add</span>(<span class="tok-keyword">new</span> <span class="tok-type">int</span>[]{e.to, dist[e.to]});
        }
}</pre>

<div class="pitfall"><b>Dijkstra breaks on negative edges.</b> The greedy step assumes that once a vertex is finalised nothing can make it cheaper — a negative edge discovered later violates exactly that. Use Bellman–Ford (O(n·m)) when weights can be negative; it also detects negative cycles, where "shortest path" stops being defined at all.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>A* = Dijkstra plus a hint.</b> Prioritise by <span class="badge">dist[v] + h(v)</span>, where h(v) is a heuristic guess of the remaining distance (for maps: straight-line distance). If h never overestimates ("admissible"), A* returns the same optimal path while expanding far fewer vertices — this is what makes Google Maps and game pathfinding interactive. Dijkstra is exactly A* with h ≡ 0. <em>Beyond syllabus because CSD201 teaches the uninformed version, while every practical routing system adds the heuristic.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.5</span>
<h2>Dijkstra — đường đi ngắn nhất khi cạnh có trọng số</h2>
<p class="lead">BFS đếm số cạnh. Khi cạnh mang một <strong>chi phí</strong> (ki-lô-mét, phút, tiền), đường ít cạnh nhất thường không phải đường rẻ nhất. Thuật toán Dijkstra liên tục chốt <em>đỉnh gần nhất chưa chốt</em> — một lựa chọn tham lam nhưng chứng minh được là đúng, miễn không có trọng số âm.</p>

<h3>Thuật toán trong bốn quy tắc</h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>1. Khởi tạo</b><span>dist[nguồn] = 0, mọi dist khác = ∞.</span></div>
  <div class="lz-fitem"><b>2. Chọn</b><span>Lấy đỉnh chưa chốt có dist nhỏ nhất (dùng heap min).</span></div>
  <div class="lz-fitem"><b>3. Nới lỏng</b><span>Với mỗi hàng xóm u: nếu dist[v] + w(v,u) &lt; dist[u] thì cải thiện dist[u] và đặt parent[u] = v.</span></div>
  <div class="lz-fitem"><b>4. Chốt</b><span>Đánh dấu v xong; khoảng cách của nó không thể tốt hơn nữa. Lặp tới khi hết đỉnh.</span></div>
</div>
<div class="formula"><span class="lbl">PHÉP NỚI LỎNG</span>dist[u] = min( dist[u], &nbsp;dist[v] + w(v, u) )</div>

<h3>Ví dụ có lời giải — bảng đầy đủ, nguồn A</h3>
<div class="diagram">      4         8
  A ————— B ————— C
  |     / |      /|
 2|  1/   |3  2/  |6
  | /     |  /    |
  D ————— E ————— F
      7        5

trọng số: A-B 4, A-D 2, B-D 1, B-C 8, B-E 3, D-E 7, C-E 2, C-F 6, E-F 5</div>
<div class="out"><b>Vòng 0 —</b> dist: A=0, còn lại ∞. Heap: [A(0)].<br>
<b>Vòng 1 — chốt A(0).</b> Nới A-B: 0+4 = 4 &lt; ∞ → B=4 (cha A). Nới A-D: 0+2 = 2 → D=2 (cha A).<br>
&nbsp;&nbsp;dist: B=4, D=2, còn lại ∞.<br>
<b>Vòng 2 — nhỏ nhất là D(2), chốt.</b> Nới D-B: 2+1 = 3 &lt; 4 → <b>B cải thiện còn 3</b> (cha D). Nới D-E: 2+7 = 9 → E=9.<br>
<b>Vòng 3 — nhỏ nhất là B(3), chốt.</b> Nới B-C: 3+8 = 11 → C=11. Nới B-E: 3+3 = 6 &lt; 9 → <b>E cải thiện còn 6</b> (cha B).<br>
<b>Vòng 4 — nhỏ nhất là E(6), chốt.</b> Nới E-C: 6+2 = 8 &lt; 11 → <b>C cải thiện còn 8</b> (cha E). Nới E-F: 6+5 = 11 → F=11.<br>
<b>Vòng 5 — nhỏ nhất là C(8), chốt.</b> Nới C-F: 8+6 = 14, không tốt hơn 11 → giữ nguyên.<br>
<b>Vòng 6 — chốt F(11).</b> Xong.<br>
<b>Khoảng cách cuối từ A:</b> A=0, D=2, B=3, E=6, C=8, F=11.<br>
<b>Đường tới F:</b> lần theo cha F←E←B←D←A → <b>A → D → B → E → F</b>, tổng 2+1+3+5 = 11. Để ý nó dùng tới <em>bốn</em> cạnh, trong khi đường trông có vẻ thẳng A→B→C→F tốn 4+8+6 = 18. Ít cạnh nhất ≠ rẻ nhất.</div>

<h3>Chi phí</h3>
<table><thead><tr><th>Hàng đợi ưu tiên</th><th>Độ phức tạp</th><th>Hợp với</th></tr></thead><tbody>
<tr><td>Quét tuyến tính tìm cực tiểu</td><td>O(n²)</td><td>đồ thị dày (m ≈ n²)</td></tr>
<tr><td>Heap nhị phân</td><td><b>O((n + m) log n)</b></td><td>đồ thị thưa — trường hợp thường gặp</td></tr>
<tr><td>Heap Fibonacci</td><td>O(m + n log n)</td><td>lý thuyết; hằng số quá lớn trong thực tế</td></tr>
</tbody></table>

<pre><span class="tok-type">PriorityQueue</span>&lt;<span class="tok-type">int</span>[]&gt; pq = <span class="tok-keyword">new</span> <span class="tok-type">PriorityQueue</span>&lt;&gt;((x, y) -&gt; x[1] - y[1]);  <span class="tok-comment">// {đỉnh, dist}</span>
pq.<span class="tok-function">add</span>(<span class="tok-keyword">new</span> <span class="tok-type">int</span>[]{src, 0});
<span class="tok-keyword">while</span> (!pq.<span class="tok-function">isEmpty</span>()) {
    <span class="tok-type">int</span>[] top = pq.<span class="tok-function">poll</span>();
    <span class="tok-keyword">if</span> (top[1] &gt; dist[top[0]]) <span class="tok-keyword">continue</span>;      <span class="tok-comment">// bản ghi cũ — bỏ qua (xem ★ bài 4.7)</span>
    <span class="tok-keyword">for</span> (Edge e : adj[top[0]])
        <span class="tok-keyword">if</span> (dist[top[0]] + e.w &lt; dist[e.to]) {
            dist[e.to] = dist[top[0]] + e.w;
            pq.<span class="tok-function">add</span>(<span class="tok-keyword">new</span> <span class="tok-type">int</span>[]{e.to, dist[e.to]});
        }
}</pre>

<div class="pitfall"><b>Dijkstra sai với cạnh âm.</b> Bước tham lam giả định rằng một khi đỉnh đã chốt thì không gì làm nó rẻ hơn được — một cạnh âm phát hiện sau đó vi phạm đúng điều này. Dùng Bellman–Ford (O(n·m)) khi trọng số có thể âm; nó còn phát hiện được chu trình âm, nơi khái niệm "đường ngắn nhất" không còn được định nghĩa.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>A* = Dijkstra cộng thêm một gợi ý.</b> Ưu tiên theo <span class="badge">dist[v] + h(v)</span>, với h(v) là ước lượng phần đường còn lại (với bản đồ: khoảng cách đường chim bay). Nếu h không bao giờ ước lượng vượt ("chấp nhận được"), A* trả về đúng đường tối ưu mà mở rộng ít đỉnh hơn hẳn — đó là thứ làm Google Maps và tìm đường trong game phản hồi tức thì. Dijkstra chính là A* với h ≡ 0. <em>Ngoài giáo trình vì CSD201 dạy bản không có thông tin dẫn đường, trong khi mọi hệ thống định tuyến thực tế đều thêm hàm gợi ý.</em></div>
</div>
`,
        },
        {
          title: '5.6 — Minimum spanning trees: Prim & Kruskal|||5.6 — Cây khung nhỏ nhất: Prim & Kruskal',
          slug: 'csd201-mst',
          type: 'VIDEO',
          description: 'Hai thuật toán tham lam dựng cây khung nhỏ nhất, chạy tay trên cùng đồ thị, và cấu trúc Union-Find.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.6</span>
<h2>Minimum spanning tree — connect everything, spend the least</h2>
<p class="lead">A <strong>spanning tree</strong> of a connected graph with n vertices touches every vertex using exactly n−1 edges and contains no cycle. The <em>minimum</em> spanning tree is the one whose total weight is smallest — the cheapest way to wire up every building, lay every cable, connect every node.</p>
<div class="formula"><span class="lbl">CUT PROPERTY</span>For any split of the vertices into two groups, the cheapest edge crossing the split belongs to some MST.</div>
<p>Both algorithms below are just different ways of applying that one property, which is why both are greedy and both are correct.</p>

<h3>Prim — grow one tree outward</h3>
<p>Start from any vertex. Repeatedly add the cheapest edge that connects the tree to a vertex <em>outside</em> it. Stop after n−1 edges. With a heap: <b>O(m log n)</b>.</p>
<div class="diagram">      4         8
  A ————— B ————— C
  |     / |      /|
 2|  1/   |3  2/  |6
  | /     |  /    |
  D ————— E ————— F
      7        5</div>
<div class="out"><b>Prim from A:</b><br>
tree = {A}; candidate edges A-B(4), A-D(2) → cheapest <b>A-D(2)</b> → tree = {A,D}<br>
candidates: A-B(4), D-B(1), D-E(7) → cheapest <b>D-B(1)</b> → tree = {A,D,B}<br>
candidates: B-C(8), B-E(3), D-E(7) → cheapest <b>B-E(3)</b> → tree = {A,D,B,E}<br>
candidates: B-C(8), E-C(2), E-F(5) → cheapest <b>E-C(2)</b> → tree = {A,D,B,E,C}<br>
candidates: E-F(5), C-F(6) → cheapest <b>E-F(5)</b> → tree = all 6 vertices, 5 edges → stop.<br>
<b>MST = {A-D 2, D-B 1, B-E 3, E-C 2, E-F 5}, total weight 13.</b></div>

<h3>Kruskal — sort all edges, take the safe ones</h3>
<p>Sort every edge by weight ascending. Take an edge if its two endpoints are in <em>different</em> components (otherwise it would close a cycle). Stop after n−1 edges. <b>O(m log m)</b>, dominated by the sort.</p>
<div class="out"><b>Kruskal on the same graph.</b> Sorted edges: D-B(1), A-D(2), C-E(2), B-E(3), A-B(4), E-F(5), C-F(6), D-E(7), B-C(8).<br>
D-B(1) → components {D,B} → <b>take</b><br>
A-D(2) → A and D differ → <b>take</b> → {A,D,B}<br>
C-E(2) → C and E differ → <b>take</b> → {C,E}<br>
B-E(3) → B ∈ {A,D,B}, E ∈ {C,E} → differ → <b>take</b> → {A,D,B,C,E}<br>
A-B(4) → both already in the same component → <b>reject</b> (would make a cycle)<br>
E-F(5) → F is on its own → <b>take</b> → all 6 vertices, 5 edges → stop.<br>
<b>MST = {D-B 1, A-D 2, C-E 2, B-E 3, E-F 5}, total weight 13</b> — the same set and the same total as Prim. ✓</div>

<h3>Union-Find — how Kruskal answers "same component?" in near O(1)</h3>
<pre><span class="tok-type">int</span>[] parent;
<span class="tok-type">int</span> <span class="tok-function">find</span>(<span class="tok-type">int</span> x) {                      <span class="tok-comment">// with path compression</span>
    <span class="tok-keyword">if</span> (parent[x] != x) parent[x] = <span class="tok-function">find</span>(parent[x]);
    <span class="tok-keyword">return</span> parent[x];
}
<span class="tok-type">boolean</span> <span class="tok-function">union</span>(<span class="tok-type">int</span> a, <span class="tok-type">int</span> b) {
    <span class="tok-type">int</span> ra = <span class="tok-function">find</span>(a), rb = <span class="tok-function">find</span>(b);
    <span class="tok-keyword">if</span> (ra == rb) <span class="tok-keyword">return false</span>;             <span class="tok-comment">// already connected → cycle</span>
    parent[ra] = rb;                       <span class="tok-comment">// merge (add rank/size for speed)</span>
    <span class="tok-keyword">return true</span>;
}</pre>
<p>With path compression plus union by rank, m operations cost O(m·α(n)) where α is the inverse Ackermann function — below 5 for any input that fits in the universe. Effectively constant.</p>

<h3>Which one?</h3>
<table><thead><tr><th></th><th>Prim</th><th>Kruskal</th></tr></thead><tbody>
<tr><td>Data structure</td><td>priority queue</td><td>sorted edge list + union-find</td></tr>
<tr><td>Complexity</td><td>O(m log n)</td><td>O(m log m)</td></tr>
<tr><td>Better on</td><td><b>dense</b> graphs</td><td><b>sparse</b> graphs / edges already sorted</td></tr>
<tr><td>Intermediate state</td><td>always one connected tree</td><td>a forest that merges</td></tr>
</tbody></table>

<div class="pitfall"><b>An MST is not a shortest-path tree.</b> In the graph above, the MST path from A to F is A-D-B-E-F = 11 — which happens to match here — but in general minimising the <em>total</em> weight says nothing about the distance between any particular pair. Do not use an MST to answer routing questions; that is Dijkstra's job.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>MST powers clustering.</b> Build the MST of your data points, then delete the k−1 heaviest edges: the remaining components are exactly single-linkage clustering into k clusters. The same trick underlies image segmentation and network-outage analysis. Union-Find on its own also drives percolation models and Kruskal-based maze generation. <em>Beyond syllabus because the course frames MST as a wiring-cost problem, while its real modern use is as a clustering primitive.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.6</span>
<h2>Cây khung nhỏ nhất — nối hết mọi thứ, tốn ít nhất</h2>
<p class="lead"><strong>Cây khung</strong> của một đồ thị liên thông n đỉnh chạm tới mọi đỉnh bằng đúng n−1 cạnh và không chứa chu trình. Cây khung <em>nhỏ nhất</em> là cây có tổng trọng số bé nhất — cách rẻ nhất để nối điện mọi toà nhà, kéo mọi sợi cáp, nối mọi nút mạng.</p>
<div class="formula"><span class="lbl">TÍNH CHẤT LÁT CẮT</span>Với mọi cách chia tập đỉnh thành hai nhóm, cạnh rẻ nhất bắc qua lát cắt đó thuộc về một cây khung nhỏ nhất nào đó.</div>
<p>Cả hai thuật toán dưới đây chỉ là hai cách áp dụng đúng tính chất ấy, nên cả hai đều tham lam và cả hai đều đúng.</p>

<h3>Prim — nuôi một cây lớn dần ra ngoài</h3>
<p>Bắt đầu từ một đỉnh bất kỳ. Liên tục thêm cạnh rẻ nhất nối cây với một đỉnh <em>bên ngoài</em> cây. Dừng sau n−1 cạnh. Dùng heap: <b>O(m log n)</b>.</p>
<div class="diagram">      4         8
  A ————— B ————— C
  |     / |      /|
 2|  1/   |3  2/  |6
  | /     |  /    |
  D ————— E ————— F
      7        5</div>
<div class="out"><b>Prim từ A:</b><br>
cây = {A}; cạnh ứng viên A-B(4), A-D(2) → rẻ nhất <b>A-D(2)</b> → cây = {A,D}<br>
ứng viên: A-B(4), D-B(1), D-E(7) → rẻ nhất <b>D-B(1)</b> → cây = {A,D,B}<br>
ứng viên: B-C(8), B-E(3), D-E(7) → rẻ nhất <b>B-E(3)</b> → cây = {A,D,B,E}<br>
ứng viên: B-C(8), E-C(2), E-F(5) → rẻ nhất <b>E-C(2)</b> → cây = {A,D,B,E,C}<br>
ứng viên: E-F(5), C-F(6) → rẻ nhất <b>E-F(5)</b> → cây = đủ 6 đỉnh, 5 cạnh → dừng.<br>
<b>MST = {A-D 2, D-B 1, B-E 3, E-C 2, E-F 5}, tổng trọng số 13.</b></div>

<h3>Kruskal — sắp mọi cạnh, lấy những cạnh an toàn</h3>
<p>Sắp mọi cạnh theo trọng số tăng dần. Lấy một cạnh nếu hai đầu của nó nằm ở <em>hai</em> thành phần khác nhau (nếu không sẽ khép thành chu trình). Dừng sau n−1 cạnh. <b>O(m log m)</b>, chi phí chủ yếu do sắp xếp.</p>
<div class="out"><b>Kruskal trên cùng đồ thị.</b> Cạnh đã sắp: D-B(1), A-D(2), C-E(2), B-E(3), A-B(4), E-F(5), C-F(6), D-E(7), B-C(8).<br>
D-B(1) → thành phần {D,B} → <b>lấy</b><br>
A-D(2) → A và D khác nhau → <b>lấy</b> → {A,D,B}<br>
C-E(2) → C và E khác nhau → <b>lấy</b> → {C,E}<br>
B-E(3) → B ∈ {A,D,B}, E ∈ {C,E} → khác nhau → <b>lấy</b> → {A,D,B,C,E}<br>
A-B(4) → cả hai đã cùng thành phần → <b>loại</b> (sẽ tạo chu trình)<br>
E-F(5) → F còn đứng riêng → <b>lấy</b> → đủ 6 đỉnh, 5 cạnh → dừng.<br>
<b>MST = {D-B 1, A-D 2, C-E 2, B-E 3, E-F 5}, tổng trọng số 13</b> — cùng tập cạnh và cùng tổng như Prim. ✓</div>

<h3>Union-Find — cách Kruskal trả lời "cùng thành phần không?" gần như O(1)</h3>
<pre><span class="tok-type">int</span>[] parent;
<span class="tok-type">int</span> <span class="tok-function">find</span>(<span class="tok-type">int</span> x) {                      <span class="tok-comment">// có nén đường đi</span>
    <span class="tok-keyword">if</span> (parent[x] != x) parent[x] = <span class="tok-function">find</span>(parent[x]);
    <span class="tok-keyword">return</span> parent[x];
}
<span class="tok-type">boolean</span> <span class="tok-function">union</span>(<span class="tok-type">int</span> a, <span class="tok-type">int</span> b) {
    <span class="tok-type">int</span> ra = <span class="tok-function">find</span>(a), rb = <span class="tok-function">find</span>(b);
    <span class="tok-keyword">if</span> (ra == rb) <span class="tok-keyword">return false</span>;             <span class="tok-comment">// đã nối rồi → chu trình</span>
    parent[ra] = rb;                       <span class="tok-comment">// gộp (thêm rank/size để nhanh hơn)</span>
    <span class="tok-keyword">return true</span>;
}</pre>
<p>Với nén đường đi cộng gộp theo hạng, m thao tác tốn O(m·α(n)) trong đó α là hàm Ackermann ngược — nhỏ hơn 5 với mọi đầu vào lọt trong vũ trụ này. Coi như hằng số.</p>

<h3>Chọn cái nào?</h3>
<table><thead><tr><th></th><th>Prim</th><th>Kruskal</th></tr></thead><tbody>
<tr><td>Cấu trúc dữ liệu</td><td>hàng đợi ưu tiên</td><td>danh sách cạnh đã sắp + union-find</td></tr>
<tr><td>Độ phức tạp</td><td>O(m log n)</td><td>O(m log m)</td></tr>
<tr><td>Hợp với</td><td>đồ thị <b>dày</b></td><td>đồ thị <b>thưa</b> / cạnh đã sắp sẵn</td></tr>
<tr><td>Trạng thái giữa chừng</td><td>luôn là một cây liên thông</td><td>một rừng cây dần gộp lại</td></tr>
</tbody></table>

<div class="pitfall"><b>Cây khung nhỏ nhất không phải cây đường đi ngắn nhất.</b> Trong đồ thị trên, đường A tới F theo MST là A-D-B-E-F = 11 — ở đây tình cờ trùng nhau — nhưng nói chung việc tối tiểu <em>tổng</em> trọng số chẳng nói gì về khoảng cách giữa một cặp cụ thể. Đừng dùng MST để trả lời câu hỏi định tuyến; đó là việc của Dijkstra.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>MST là nền của phân cụm.</b> Dựng MST cho tập điểm dữ liệu rồi xoá k−1 cạnh nặng nhất: các thành phần còn lại chính là phân cụm liên kết đơn thành k cụm. Cùng mẹo đó nằm sau phân đoạn ảnh và phân tích sự cố mạng. Bản thân Union-Find còn là nền của mô hình thấm (percolation) và sinh mê cung kiểu Kruskal. <em>Ngoài giáo trình vì môn học đóng khung MST như bài toán chi phí đi dây, còn ứng dụng hiện đại thật của nó là một nguyên thuỷ dùng để phân cụm.</em></div>
</div>
`,
        },
        {
          title: '5.7 — Euler tours, Euler cycles & Hamilton|||5.7 — Đường & chu trình Euler, và Hamilton',
          slug: 'csd201-euler',
          type: 'VIDEO',
          description: 'Điều kiện tồn tại đường/chu trình Euler, thuật toán Hierholzer, và vì sao bài Hamilton lại khó hơn hẳn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.7</span>
<h2>Walk every edge once — and the question that looks similar but is not</h2>
<p class="lead">Euler's 1736 question about the seven bridges of Königsberg founded graph theory: can you cross every bridge exactly once? His answer was a rule you can check in O(n + m) just by counting degrees.</p>

<h3>The rules</h3>
<table><thead><tr><th>Goal</th><th>Condition (undirected, connected)</th></tr></thead><tbody>
<tr><td><b>Euler cycle</b> (every edge once, back to the start)</td><td>every vertex has <b>even</b> degree</td></tr>
<tr><td><b>Euler path</b> (every edge once, may end elsewhere)</td><td>exactly <b>0 or 2</b> vertices have odd degree; start at one odd vertex</td></tr>
<tr><td>Neither</td><td>4 or more odd-degree vertices</td></tr>
</tbody></table>
<p><b>Why:</b> every time your walk enters a vertex it must also leave, consuming two edges. So each intermediate vertex needs an even count. Only the start and the end may be left unbalanced — and if the walk returns to the start, even those are even.</p>

<h3>Worked example 1 — Königsberg</h3>
<div class="diagram">The four land masses had degrees 3, 3, 3, 5 — four odd vertices.</div>
<div class="out">More than two odd-degree vertices → <b>no Euler path exists</b>. The famous walk is impossible, and Euler proved it without trying a single route — the whole point of the theorem.</div>

<h3>Worked example 2 — a graph that does work</h3>
<div class="diagram">A —— B
| \\  |
|  \\ |
C —— D      edges: A-B, A-C, A-D, B-D, C-D</div>
<div class="out"><b>Degrees:</b> A = 3 (B, C, D) · B = 2 (A, D) · C = 2 (A, D) · D = 3 (A, B, C).<br>
Odd vertices: A and D — exactly two → <b>an Euler path exists, and it must start at A and end at D</b> (or the reverse).<br>
<b>Find one:</b> A → B → D → C → A → D. Check the 5 edges: A-B ✓, B-D ✓, D-C ✓, C-A ✓, A-D ✓ — each used exactly once. ✓<br>
<b>No Euler cycle</b>, because the two odd vertices force the walk to end somewhere other than where it began.</div>

<h3>Hierholzer's algorithm — O(n + m)</h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>1</b><span>From any vertex, follow unused edges until you return and get stuck — this closes a cycle.</span></div>
  <div class="lz-fitem"><b>2</b><span>Find a vertex on that cycle that still has unused edges.</span></div>
  <div class="lz-fitem"><b>3</b><span>Walk a new cycle from there and splice it into the first one.</span></div>
  <div class="lz-fitem"><b>4</b><span>Repeat until no unused edges remain.</span></div>
</div>
<p>Each edge is consumed once, so the whole construction is linear in the number of edges.</p>

<h3>Euler vs Hamilton — one word of difference, worlds apart</h3>
<table><thead><tr><th></th><th>Euler</th><th>Hamilton</th></tr></thead><tbody>
<tr><td>Visit every…</td><td><b>edge</b> exactly once</td><td><b>vertex</b> exactly once</td></tr>
<tr><td>Existence test</td><td>count degrees: O(n + m)</td><td><b>NP-complete</b> — no known efficient test</td></tr>
<tr><td>Construction</td><td>Hierholzer, linear</td><td>backtracking, exponential in the worst case</td></tr>
<tr><td>Real use</td><td>DNA fragment assembly, street sweeping, plotter paths</td><td>travelling salesman, tour planning, chip routing</td></tr>
</tbody></table>

<div class="pitfall"><b>Check connectivity first.</b> The degree rule only applies if all vertices carrying edges are in one connected component. A graph made of two separate even-degree triangles satisfies "all degrees even" but has no Euler cycle, because no walk can jump between components.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Euler paths sequence genomes.</b> Modern DNA assemblers build a de Bruijn graph whose edges are k-mers (short overlapping reads) and then look for an Euler path — reconstructing the genome in linear time. The Hamiltonian formulation of the same problem (one vertex per read) is the natural first idea and is NP-hard, which stalled assembly for years. Choosing edges instead of vertices turned an intractable problem into a linear one. <em>Beyond syllabus because CSD201 presents Euler tours as a historical puzzle, while this reframing is one of the most consequential modelling decisions in computational biology.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.7</span>
<h2>Đi qua mọi cạnh đúng một lần — và câu hỏi trông giống nhưng không hề giống</h2>
<p class="lead">Câu hỏi năm 1736 của Euler về bảy cây cầu ở Königsberg đã khai sinh lý thuyết đồ thị: có thể đi qua mỗi cây cầu đúng một lần không? Câu trả lời của ông là một quy tắc bạn kiểm được trong O(n + m) chỉ bằng cách đếm bậc.</p>

<h3>Các quy tắc</h3>
<table><thead><tr><th>Mục tiêu</th><th>Điều kiện (vô hướng, liên thông)</th></tr></thead><tbody>
<tr><td><b>Chu trình Euler</b> (mọi cạnh một lần, quay về chỗ xuất phát)</td><td>mọi đỉnh có bậc <b>chẵn</b></td></tr>
<tr><td><b>Đường đi Euler</b> (mọi cạnh một lần, có thể kết thúc chỗ khác)</td><td>đúng <b>0 hoặc 2</b> đỉnh bậc lẻ; xuất phát từ một đỉnh lẻ</td></tr>
<tr><td>Không có cả hai</td><td>từ 4 đỉnh bậc lẻ trở lên</td></tr>
</tbody></table>
<p><b>Vì sao:</b> mỗi lần hành trình đi vào một đỉnh thì cũng phải đi ra, tiêu tốn hai cạnh. Vậy mỗi đỉnh trung gian cần số cạnh chẵn. Chỉ điểm đầu và điểm cuối được phép lệch — và nếu hành trình quay về điểm xuất phát thì đến hai đỉnh đó cũng chẵn.</p>

<h3>Ví dụ có lời giải 1 — Königsberg</h3>
<div class="diagram">Bốn dải đất có bậc 3, 3, 3, 5 — bốn đỉnh lẻ.</div>
<div class="out">Nhiều hơn hai đỉnh bậc lẻ → <b>không tồn tại đường đi Euler</b>. Cuộc dạo bộ nổi tiếng đó là bất khả, và Euler chứng minh được mà không cần thử lấy một lộ trình nào — đó chính là ý nghĩa của định lý.</div>

<h3>Ví dụ có lời giải 2 — một đồ thị có nghiệm</h3>
<div class="diagram">A —— B
| \\  |
|  \\ |
C —— D      cạnh: A-B, A-C, A-D, B-D, C-D</div>
<div class="out"><b>Bậc:</b> A = 3 (B, C, D) · B = 2 (A, D) · C = 2 (A, D) · D = 3 (A, B, C).<br>
Đỉnh lẻ: A và D — đúng hai → <b>tồn tại đường đi Euler, và nó bắt buộc bắt đầu ở A và kết thúc ở D</b> (hoặc ngược lại).<br>
<b>Tìm một đường:</b> A → B → D → C → A → D. Kiểm 5 cạnh: A-B ✓, B-D ✓, D-C ✓, C-A ✓, A-D ✓ — mỗi cạnh đúng một lần. ✓<br>
<b>Không có chu trình Euler</b>, vì hai đỉnh lẻ buộc hành trình phải kết thúc ở chỗ khác nơi xuất phát.</div>

<h3>Thuật toán Hierholzer — O(n + m)</h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>1</b><span>Từ một đỉnh bất kỳ, đi theo các cạnh chưa dùng tới khi quay về và bí — như vậy là khép được một chu trình.</span></div>
  <div class="lz-fitem"><b>2</b><span>Tìm trên chu trình đó một đỉnh vẫn còn cạnh chưa dùng.</span></div>
  <div class="lz-fitem"><b>3</b><span>Đi một chu trình mới từ đó rồi ghép nó vào chu trình cũ.</span></div>
  <div class="lz-fitem"><b>4</b><span>Lặp cho tới khi không còn cạnh nào chưa dùng.</span></div>
</div>
<p>Mỗi cạnh bị tiêu thụ đúng một lần, nên toàn bộ quá trình dựng là tuyến tính theo số cạnh.</p>

<h3>Euler với Hamilton — khác một chữ, cách nhau một trời</h3>
<table><thead><tr><th></th><th>Euler</th><th>Hamilton</th></tr></thead><tbody>
<tr><td>Đi qua mọi…</td><td><b>cạnh</b> đúng một lần</td><td><b>đỉnh</b> đúng một lần</td></tr>
<tr><td>Kiểm tồn tại</td><td>đếm bậc: O(n + m)</td><td><b>NP-đầy đủ</b> — chưa có phép kiểm hiệu quả nào</td></tr>
<tr><td>Dựng lời giải</td><td>Hierholzer, tuyến tính</td><td>quay lui, hàm mũ trong trường hợp xấu nhất</td></tr>
<tr><td>Ứng dụng thật</td><td>lắp ráp mảnh DNA, quét dọn đường phố, đường vẽ máy plotter</td><td>người bán hàng rong, lập tuyến tham quan, định tuyến vi mạch</td></tr>
</tbody></table>

<div class="pitfall"><b>Phải kiểm liên thông trước.</b> Quy tắc về bậc chỉ áp dụng khi mọi đỉnh có cạnh đều nằm trong một thành phần liên thông. Đồ thị gồm hai tam giác rời nhau thoả "mọi bậc đều chẵn" nhưng không có chu trình Euler, vì không hành trình nào nhảy được giữa hai thành phần.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đường Euler dùng để giải mã bộ gen.</b> Các bộ lắp ráp DNA hiện đại dựng đồ thị de Bruijn với cạnh là các k-mer (đoạn đọc ngắn chồng lấn) rồi tìm một đường đi Euler — tái dựng bộ gen trong thời gian tuyến tính. Cách phát biểu theo Hamilton của cùng bài toán (mỗi đoạn đọc là một đỉnh) là ý tưởng đầu tiên rất tự nhiên nhưng lại NP-khó, khiến ngành lắp ráp bế tắc nhiều năm. Chọn cạnh thay vì đỉnh đã biến một bài toán bất trị thành bài toán tuyến tính. <em>Ngoài giáo trình vì CSD201 trình bày hành trình Euler như một câu đố lịch sử, trong khi cách đóng khung lại này là một trong những quyết định mô hình hoá có hệ quả lớn nhất của tin sinh học.</em></div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 6 — SẮP XẾP ══════════════════ */
    {
      title: 'Chapter 6 — Sorting|||Chương 6 — Sắp xếp',
      description: 'Từ sắp xếp cơ bản O(n²) tới quick/merge/heap O(n log n) — cơ chế, chi phí, và khi nào dùng.',
      lessons: [
        {
          title: '6.1 — Basic sorts (O(n²))|||6.1 — Sắp xếp cơ bản (O(n²))',
          slug: 'csd201-sap-xep-co-ban',
          type: 'VIDEO',
          description: 'Bubble, selection, insertion — đơn giản, tại chỗ, nhưng chậm với n lớn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Basic sorts — simple but quadratic</h2>
<p class="lead">Bubble, selection and insertion sort all run in O(n²). They are easy to write and fine for tiny inputs, but each doubling of <span class="badge">n</span> roughly quadruples the work.</p>
<table>
  <thead><tr><th>Sort</th><th>Idea</th><th>Note</th></tr></thead>
  <tbody>
    <tr><td>Bubble</td><td>swap adjacent out-of-order pairs</td><td>stable</td></tr>
    <tr><td>Selection</td><td>pick the min, put it in front</td><td>fewest swaps</td></tr>
    <tr><td>Insertion</td><td>insert each item into the sorted left</td><td>fast on nearly-sorted data</td></tr>
  </tbody>
</table>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Counting &amp; radix sort — beating O(n log n).</b> The O(n log n) barrier applies only to comparison sorts; when keys are small integers you can sort in O(n) without ever comparing two elements. Counting sort tallies how many of each value occur, and radix sort applies it digit by digit — this is how many databases sort integer keys and how bucketed sorts work. <em>Basic sorts are all comparison-based; the idea that you can sidestep comparisons entirely reframes what "fast" means.</em></div>
<a class="link-card codelab" href="/algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Watch sorts animate</span><span class="lc-sub">Compare bubble/selection/insertion on the visualizer.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Sắp xếp cơ bản — đơn giản nhưng bậc hai</h2>
<p class="lead">Bubble, selection và insertion sort đều chạy O(n²). Chúng dễ viết và ổn với đầu vào nhỏ, nhưng mỗi lần gấp đôi <span class="badge">n</span> khiến công việc tăng ~gấp bốn.</p>
<table>
  <thead><tr><th>Sắp xếp</th><th>Ý tưởng</th><th>Ghi chú</th></tr></thead>
  <tbody>
    <tr><td>Bubble</td><td>đổi chỗ cặp liền kề sai thứ tự</td><td>ổn định</td></tr>
    <tr><td>Selection</td><td>chọn min, đưa lên đầu</td><td>ít đổi chỗ nhất</td></tr>
    <tr><td>Insertion</td><td>chèn mỗi phần tử vào phần trái đã sắp</td><td>nhanh với dữ liệu gần sắp</td></tr>
  </tbody>
</table>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Counting &amp; radix sort — vượt O(n log n).</b> Rào cản O(n log n) chỉ áp dụng cho sắp xếp bằng so sánh; khi khóa là số nguyên nhỏ, bạn có thể sắp trong O(n) mà không hề so sánh hai phần tử. Counting sort đếm mỗi giá trị xuất hiện bao nhiêu lần, còn radix sort áp dụng nó theo từng chữ số — đây là cách nhiều CSDL sắp khóa số nguyên và cách các sort theo bucket hoạt động. <em>Các sort cơ bản đều dựa trên so sánh; ý tưởng có thể né hoàn toàn việc so sánh định nghĩa lại "nhanh" nghĩa là gì.</em></div>
<a class="link-card codelab" href="/algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Xem sắp xếp chạy</span><span class="lc-sub">So sánh bubble/selection/insertion trên visualizer.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
</div>
`,
        },
        {
          title: '6.2 — Efficient sorts: quick, merge, heap|||6.2 — Sắp xếp hiệu quả: quick, merge, heap',
          slug: 'csd201-sap-xep-hieu-qua',
          type: 'VIDEO',
          description: 'Ba thuật toán O(n log n): chia-để-trị (quick/merge) và dùng heap — đặc điểm và đánh đổi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Efficient sorts — O(n log n)</h2>
<p class="lead">The workhorses. All three sort in O(n log n), but they differ in stability, memory and worst case — the details that make one the right choice.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Quick sort</b> — partition around a pivot, recurse. Fast in practice, in-place; worst case O(n²) on a bad pivot (mitigate with random/median pivot).</div>
  <div class="lz-layer"><b>Merge sort</b> — split in half, sort each, merge. Guaranteed O(n log n), stable; needs O(n) extra memory.</div>
  <div class="lz-layer"><b>Heap sort</b> — build a heap, repeatedly extract the max. O(n log n), in-place; not stable.</div>
</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Timsort — the sort Java and Python actually ship.</b> Real-world data is often partly ordered, so production libraries don't use textbook quicksort or mergesort: Timsort finds already-sorted "runs", extends them with insertion sort, then merges them with a stable, adaptive mergesort that approaches O(n) on nearly-sorted input. Java uses it for Arrays.sort on objects, and Python's sorted() is Timsort. <em>The course compares the three classic sorts, but the industrial answer is a clever hybrid of two of them.</em></div>
<div class="note-ct">Rule of thumb: merge sort when you need stability or guaranteed time; quick sort when average speed and low memory matter; heap sort when you need O(1) extra space with a guaranteed bound.</div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms#module-507" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">Practise: Advanced Sorting</span><span class="lc-sub">Quick, merge, heap sort and hashing.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Sắp xếp hiệu quả — O(n log n)</h2>
<p class="lead">Những con ngựa thồ. Cả ba sắp xếp O(n log n), nhưng khác nhau về tính ổn định, bộ nhớ và trường hợp xấu nhất — chi tiết quyết định cái nào là lựa chọn đúng.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Quick sort</b> — phân hoạch quanh chốt, đệ quy. Nhanh thực tế, tại chỗ; xấu nhất O(n²) với chốt tệ (giảm bằng chốt ngẫu nhiên/trung vị).</div>
  <div class="lz-layer"><b>Merge sort</b> — chia đôi, sắp mỗi nửa, trộn. Đảm bảo O(n log n), ổn định; cần O(n) bộ nhớ phụ.</div>
  <div class="lz-layer"><b>Heap sort</b> — dựng heap, liên tục lấy max. O(n log n), tại chỗ; không ổn định.</div>
</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Timsort — thuật toán sort mà Java và Python thực sự dùng.</b> Dữ liệu thực thường đã sắp một phần, nên thư viện sản xuất không dùng quicksort hay mergesort sách giáo khoa: Timsort tìm các "run" đã sắp sẵn, mở rộng bằng insertion sort, rồi trộn chúng bằng mergesort ổn định và thích nghi, đạt gần O(n) với đầu vào gần sắp. Java dùng nó cho Arrays.sort trên đối tượng, và sorted() của Python là Timsort. <em>Môn học so sánh ba thuật toán sort kinh điển, nhưng lời giải công nghiệp là một bản lai khéo léo của hai trong số đó.</em></div>
<div class="note-ct">Nguyên tắc: merge sort khi cần ổn định hoặc thời gian đảm bảo; quick sort khi cần tốc độ trung bình và ít bộ nhớ; heap sort khi cần O(1) bộ nhớ phụ với cận đảm bảo.</div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms#module-507" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">Luyện: Advanced Sorting</span><span class="lc-sub">Quick, merge, heap sort và băm.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '6.3 — Quick-sort: partitioning in detail|||6.3 — Quick-sort: phân hoạch chi tiết',
          slug: 'csd201-quicksort',
          type: 'VIDEO',
          description: 'Phân hoạch Lomuto và Hoare, chọn chốt, trường hợp xấu nhất và cách phòng — chạy tay đầy đủ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>Quick-sort — the fastest sort in practice, and the one easiest to get wrong</h2>
<p class="lead">Quick-sort picks a <strong>pivot</strong>, moves everything smaller to its left and everything larger to its right (that is <em>partitioning</em>), and then sorts the two sides recursively. The pivot lands in its final position immediately, so there is no merge step — all the work happens on the way down.</p>

<h3>Lomuto partition — the one to memorise for an exam</h3>
<pre><span class="tok-type">int</span> <span class="tok-function">partition</span>(<span class="tok-type">int</span>[] a, <span class="tok-type">int</span> lo, <span class="tok-type">int</span> hi) {
    <span class="tok-type">int</span> pivot = a[hi];              <span class="tok-comment">// last element as pivot</span>
    <span class="tok-type">int</span> i = lo - 1;                 <span class="tok-comment">// end of the "smaller" zone</span>
    <span class="tok-keyword">for</span> (<span class="tok-type">int</span> j = lo; j &lt; hi; j++)
        <span class="tok-keyword">if</span> (a[j] &lt;= pivot) { i++; <span class="tok-function">swap</span>(a, i, j); }
    <span class="tok-function">swap</span>(a, i + 1, hi);            <span class="tok-comment">// put the pivot in its place</span>
    <span class="tok-keyword">return</span> i + 1;
}
<span class="tok-keyword">void</span> <span class="tok-function">quickSort</span>(<span class="tok-type">int</span>[] a, <span class="tok-type">int</span> lo, <span class="tok-type">int</span> hi) {
    <span class="tok-keyword">if</span> (lo &lt; hi) {
        <span class="tok-type">int</span> p = <span class="tok-function">partition</span>(a, lo, hi);
        <span class="tok-function">quickSort</span>(a, lo, p - 1);
        <span class="tok-function">quickSort</span>(a, p + 1, hi);
    }
}</pre>

<h3>Worked example — partition [7, 2, 9, 4, 3, 8, 5] with pivot 5</h3>
<div class="out"><b>pivot = a[6] = 5, i = −1.</b><br>
j=0: a[0]=7 &gt; 5 → skip<br>
j=1: a[1]=2 ≤ 5 → i=0, swap(0,1) → [<b>2</b>, 7, 9, 4, 3, 8, 5]<br>
j=2: 9 &gt; 5 → skip<br>
j=3: 4 ≤ 5 → i=1, swap(1,3) → [2, <b>4</b>, 9, 7, 3, 8, 5]<br>
j=4: 3 ≤ 5 → i=2, swap(2,4) → [2, 4, <b>3</b>, 7, 9, 8, 5]<br>
j=5: 8 &gt; 5 → skip<br>
end: swap(i+1=3, hi=6) → <b>[2, 4, 3, 5, 9, 8, 7]</b>, pivot index = 3.<br>
<b>Invariant check:</b> everything left of index 3 is ≤ 5, everything right is &gt; 5. The pivot 5 is now in its final sorted position and never moves again.<br>
Recurse on [2, 4, 3] and [9, 8, 7]. Final: [2, 3, 4, 5, 7, 8, 9].</div>

<h3>Complexity — and where it goes wrong</h3>
<table><thead><tr><th>Case</th><th>Recurrence</th><th>Cost</th><th>When</th></tr></thead><tbody>
<tr><td>Best / average</td><td>T(n) = 2T(n/2) + n</td><td><b>O(n log n)</b></td><td>pivot lands near the middle</td></tr>
<tr><td>Worst</td><td>T(n) = T(n−1) + n</td><td><b>O(n²)</b></td><td>pivot is always the min or max</td></tr>
</tbody></table>
<div class="out"><b>The classic disaster:</b> sort an <em>already sorted</em> array with "last element as pivot". Every partition puts n−1 elements on one side and 0 on the other → n levels of recursion, each costing n → n²/2 comparisons. For n = 100,000 that is 5 × 10⁹ operations <em>and</em> a recursion depth of 100,000 → <span class="badge">StackOverflowError</span> before it even finishes.</div>

<h3>Three fixes, in order of value</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>1. Median-of-three.</b> Take the median of a[lo], a[mid], a[hi] as the pivot. Sorted and reverse-sorted input become the <em>best</em> case instead of the worst.</div>
  <div class="lz-layer"><b>2. Random pivot.</b> Swap a random element into the pivot slot. No specific input can be adversarial any more; the expected cost is O(n log n) whatever the data.</div>
  <div class="lz-layer"><b>3. Recurse into the smaller half, loop on the larger.</b> Bounds stack depth to O(log n) regardless of pivot quality.</div>
</div>

<h3>Hoare partition — what real libraries use</h3>
<p>Two indices walk toward each other, swapping out-of-place pairs. It performs about three times fewer swaps than Lomuto and handles many duplicate keys far better, but its boundaries are easier to get wrong — which is exactly why exams teach Lomuto and libraries ship Hoare.</p>

<div class="pitfall"><b>Lomuto degrades to O(n²) on arrays with many equal keys.</b> With <span class="badge">a[j] &lt;= pivot</span>, an array of all-identical values sends every element to the left side. Production sorts use <em>three-way</em> partitioning (&lt;, =, &gt;) so duplicates are finished in one pass.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Introsort — what <span class="badge">Arrays.sort(int[])</span> actually runs.</b> Start with quick-sort, count the recursion depth, and if it exceeds ~2·log₂n (a sign that pivots are behaving badly), switch to heap-sort, which is O(n log n) guaranteed. Below ~47 elements, switch again to insertion sort, which wins on tiny arrays because of its minute constants. So the "one algorithm" you call is really three, chosen at run time. <em>Beyond syllabus because the course compares the sorts one by one, while the engineering answer is to compose them and eliminate each one's worst case.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Quick-sort — nhanh nhất trong thực tế, và dễ viết sai nhất</h2>
<p class="lead">Quick-sort chọn một <strong>chốt</strong> (pivot), dồn mọi thứ nhỏ hơn sang trái và lớn hơn sang phải (đó là <em>phân hoạch</em>), rồi sắp xếp đệ quy hai bên. Chốt lập tức nằm đúng vị trí cuối cùng của nó, nên không có bước trộn — mọi công việc xảy ra trên đường đi xuống.</p>

<h3>Phân hoạch Lomuto — bản nên thuộc để đi thi</h3>
<pre><span class="tok-type">int</span> <span class="tok-function">partition</span>(<span class="tok-type">int</span>[] a, <span class="tok-type">int</span> lo, <span class="tok-type">int</span> hi) {
    <span class="tok-type">int</span> pivot = a[hi];              <span class="tok-comment">// lấy phần tử cuối làm chốt</span>
    <span class="tok-type">int</span> i = lo - 1;                 <span class="tok-comment">// biên cuối của vùng "nhỏ hơn"</span>
    <span class="tok-keyword">for</span> (<span class="tok-type">int</span> j = lo; j &lt; hi; j++)
        <span class="tok-keyword">if</span> (a[j] &lt;= pivot) { i++; <span class="tok-function">swap</span>(a, i, j); }
    <span class="tok-function">swap</span>(a, i + 1, hi);            <span class="tok-comment">// đặt chốt vào đúng chỗ</span>
    <span class="tok-keyword">return</span> i + 1;
}
<span class="tok-keyword">void</span> <span class="tok-function">quickSort</span>(<span class="tok-type">int</span>[] a, <span class="tok-type">int</span> lo, <span class="tok-type">int</span> hi) {
    <span class="tok-keyword">if</span> (lo &lt; hi) {
        <span class="tok-type">int</span> p = <span class="tok-function">partition</span>(a, lo, hi);
        <span class="tok-function">quickSort</span>(a, lo, p - 1);
        <span class="tok-function">quickSort</span>(a, p + 1, hi);
    }
}</pre>

<h3>Ví dụ có lời giải — phân hoạch [7, 2, 9, 4, 3, 8, 5] với chốt 5</h3>
<div class="out"><b>chốt = a[6] = 5, i = −1.</b><br>
j=0: a[0]=7 &gt; 5 → bỏ qua<br>
j=1: a[1]=2 ≤ 5 → i=0, đổi(0,1) → [<b>2</b>, 7, 9, 4, 3, 8, 5]<br>
j=2: 9 &gt; 5 → bỏ qua<br>
j=3: 4 ≤ 5 → i=1, đổi(1,3) → [2, <b>4</b>, 9, 7, 3, 8, 5]<br>
j=4: 3 ≤ 5 → i=2, đổi(2,4) → [2, 4, <b>3</b>, 7, 9, 8, 5]<br>
j=5: 8 &gt; 5 → bỏ qua<br>
cuối: đổi(i+1=3, hi=6) → <b>[2, 4, 3, 5, 9, 8, 7]</b>, chỉ số chốt = 3.<br>
<b>Kiểm bất biến:</b> mọi thứ bên trái chỉ số 3 đều ≤ 5, bên phải đều &gt; 5. Chốt 5 giờ đã nằm đúng vị trí cuối cùng và không bao giờ dịch nữa.<br>
Đệ quy trên [2, 4, 3] và [9, 8, 7]. Kết quả: [2, 3, 4, 5, 7, 8, 9].</div>

<h3>Độ phức tạp — và chỗ nó hỏng</h3>
<table><thead><tr><th>Trường hợp</th><th>Hệ thức</th><th>Chi phí</th><th>Khi nào</th></tr></thead><tbody>
<tr><td>Tốt nhất / trung bình</td><td>T(n) = 2T(n/2) + n</td><td><b>O(n log n)</b></td><td>chốt rơi gần giữa</td></tr>
<tr><td>Xấu nhất</td><td>T(n) = T(n−1) + n</td><td><b>O(n²)</b></td><td>chốt luôn là min hoặc max</td></tr>
</tbody></table>
<div class="out"><b>Thảm hoạ kinh điển:</b> sắp một mảng <em>đã sắp sẵn</em> với chốt là "phần tử cuối". Mỗi lần phân hoạch dồn n−1 phần tử sang một bên và 0 sang bên kia → n tầng đệ quy, mỗi tầng tốn n → n²/2 phép so sánh. Với n = 100.000 là 5 × 10⁹ thao tác <em>và</em> độ sâu đệ quy 100.000 → <span class="badge">StackOverflowError</span> trước cả khi chạy xong.</div>

<h3>Ba cách chữa, xếp theo giá trị</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>1. Trung vị của ba.</b> Lấy trung vị của a[lo], a[mid], a[hi] làm chốt. Đầu vào đã sắp xuôi và sắp ngược trở thành trường hợp <em>tốt nhất</em> thay vì xấu nhất.</div>
  <div class="lz-layer"><b>2. Chốt ngẫu nhiên.</b> Đổi một phần tử ngẫu nhiên vào ô chốt. Không đầu vào cụ thể nào còn "chơi xấu" được nữa; chi phí kỳ vọng là O(n log n) với mọi dữ liệu.</div>
  <div class="lz-layer"><b>3. Đệ quy vào nửa nhỏ, lặp trên nửa lớn.</b> Chặn độ sâu ngăn xếp ở O(log n) bất kể chốt tốt hay xấu.</div>
</div>

<h3>Phân hoạch Hoare — thứ các thư viện thật dùng</h3>
<p>Hai chỉ số đi ngược về phía nhau, đổi chỗ các cặp nằm sai chỗ. Nó thực hiện ít hơn khoảng ba lần số phép đổi chỗ so với Lomuto và xử lý dữ liệu nhiều khoá trùng tốt hơn nhiều, nhưng biên của nó dễ viết sai hơn — chính vì thế kỳ thi dạy Lomuto còn thư viện xuất xưởng Hoare.</p>

<div class="pitfall"><b>Lomuto tụt xuống O(n²) trên mảng nhiều khoá bằng nhau.</b> Với điều kiện <span class="badge">a[j] &lt;= pivot</span>, một mảng toàn giá trị giống nhau sẽ dồn mọi phần tử sang trái. Các bản sắp xếp sản xuất dùng phân hoạch <em>ba đường</em> (&lt;, =, &gt;) để xử lý xong phần trùng trong một lượt.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Introsort — thứ mà <span class="badge">Arrays.sort(int[])</span> thật sự chạy.</b> Bắt đầu bằng quick-sort, đếm độ sâu đệ quy, và nếu vượt ~2·log₂n (dấu hiệu chốt đang tệ) thì chuyển sang heap-sort, vốn O(n log n) đảm bảo. Dưới ~47 phần tử lại chuyển sang insertion sort, thắng trên mảng bé nhờ hằng số tí hon. Vậy "một thuật toán" bạn gọi thực ra là ba, chọn lúc chạy. <em>Ngoài giáo trình vì môn học so sánh từng thuật toán riêng lẻ, còn câu trả lời kỹ thuật là ghép chúng lại và triệt tiêu trường hợp xấu nhất của từng cái.</em></div>
</div>
`,
        },
        {
          title: '6.4 — Merge-sort & stability|||6.4 — Merge-sort & tính ổn định',
          slug: 'csd201-mergesort',
          type: 'VIDEO',
          description: 'Chia để trị, bước trộn, vì sao merge sort ổn định và vì sao nó thắng khi dữ liệu không nằm vừa bộ nhớ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Merge-sort — split blindly, combine carefully</h2>
<p class="lead">Quick-sort does clever work before recursing; merge-sort does the opposite. It splits the array in half without looking at any value, sorts both halves, and puts all the intelligence into the <strong>merge</strong> — which you already wrote in lesson 1.5.</p>

<pre><span class="tok-keyword">void</span> <span class="tok-function">mergeSort</span>(<span class="tok-type">int</span>[] a, <span class="tok-type">int</span> lo, <span class="tok-type">int</span> hi) {
    <span class="tok-keyword">if</span> (lo &gt;= hi) <span class="tok-keyword">return</span>;               <span class="tok-comment">// 0 or 1 element is already sorted</span>
    <span class="tok-type">int</span> mid = lo + (hi - lo) / 2;
    <span class="tok-function">mergeSort</span>(a, lo, mid);
    <span class="tok-function">mergeSort</span>(a, mid + 1, hi);
    <span class="tok-function">merge</span>(a, lo, mid, hi);              <span class="tok-comment">// needs a temporary array</span>
}</pre>

<h3>Worked example — sort [38, 27, 43, 3, 9, 82, 10]</h3>
<div class="out"><b>Split phase (no comparisons at all):</b><br>
[38, 27, 43, 3, 9, 82, 10] → [38, 27, 43, 3] + [9, 82, 10]<br>
→ [38, 27] [43, 3] [9, 82] [10] → single elements.<br>
<b>Merge phase (all the work):</b><br>
merge [38] [27] → [27, 38] · merge [43] [3] → [3, 43]<br>
merge [27, 38] [3, 43] → compare 27,3 → 3 · 27,43 → 27 · 38,43 → 38 · leftover 43 → <b>[3, 27, 38, 43]</b><br>
merge [9] [82] → [9, 82] · merge [9, 82] [10] → [9, 10, 82]<br>
final merge [3, 27, 38, 43] with [9, 10, 82]:<br>
3 vs 9 → 3 · 27 vs 9 → 9 · 27 vs 10 → 10 · 27 vs 82 → 27 · 38 → 38 · 43 → 43 · leftover 82<br>
<b>Result: [3, 9, 10, 27, 38, 43, 82].</b><br>
<b>Count the work:</b> log₂7 ≈ 3 levels, each level merges all n elements → <b>Θ(n log n) always</b> — best, average and worst case identical.</div>

<h3>Stability — the property that matters in real applications</h3>
<p>A sort is <strong>stable</strong> if records with equal keys keep their original relative order. Merge-sort is stable as long as you take from the left half when the two fronts are equal (<span class="badge">&lt;=</span>, not <span class="badge">&lt;</span>).</p>
<div class="out"><b>Why anyone cares.</b> Sort a table of employees by name, then sort the result by department. With a <em>stable</em> sort, employees inside each department are still alphabetical — you obtain a two-key sort by sorting twice. With an unstable sort (quick-sort, heap-sort) that second pass scrambles the first one, and you must write a compound comparator instead.<br>
<b>In Java:</b> <span class="badge">Arrays.sort(Object[])</span> is stable (TimSort); <span class="badge">Arrays.sort(int[])</span> is <em>not</em> (dual-pivot quicksort). The difference is deliberate: primitives have no identity, so stability is unobservable for them.</div>

<h3>Merge-sort vs quick-sort</h3>
<table><thead><tr><th></th><th>Merge-sort</th><th>Quick-sort</th></tr></thead><tbody>
<tr><td>Worst case</td><td><b>O(n log n)</b> guaranteed</td><td>O(n²)</td></tr>
<tr><td>Extra memory</td><td>O(n)</td><td><b>O(log n)</b> stack only</td></tr>
<tr><td>Stable</td><td><b>yes</b></td><td>no</td></tr>
<tr><td>Cache behaviour</td><td>good (sequential)</td><td><b>excellent</b> (in place)</td></tr>
<tr><td>Linked lists</td><td><b>ideal</b> — merge needs no random access, O(1) extra</td><td>poor (no indexing)</td></tr>
<tr><td>Data larger than RAM</td><td><b>the only choice</b></td><td>unusable</td></tr>
</tbody></table>

<div class="pitfall"><b>Do not allocate a new temporary array inside every merge call.</b> That turns O(n) auxiliary memory into O(n log n) allocations and hammers the garbage collector. Allocate one buffer of size n up front and pass it down.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>External merge sort — sorting 100 GB with 8 GB of RAM.</b> Read the file in chunks that fit in memory, sort each chunk and write it back as a sorted "run"; then merge all the runs with a k-way merge driven by a min-heap, reading only a block from each. Total disk cost is 2 passes for the runs plus 2 per merge round. This is how databases perform <span class="badge">ORDER BY</span> on tables that do not fit in memory, and how MapReduce shuffles. <em>Beyond syllabus because CSD201 assumes the array is in RAM, while merge-sort's real claim to fame is that it does not need that assumption.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Merge-sort — chia một cách mù quáng, gộp một cách cẩn thận</h2>
<p class="lead">Quick-sort làm phần khôn ngoan trước khi đệ quy; merge-sort thì ngược lại. Nó cắt đôi mảng mà không nhìn giá trị nào, sắp cả hai nửa, rồi dồn toàn bộ trí tuệ vào bước <strong>trộn</strong> — mà bạn đã viết ở bài 1.5.</p>

<pre><span class="tok-keyword">void</span> <span class="tok-function">mergeSort</span>(<span class="tok-type">int</span>[] a, <span class="tok-type">int</span> lo, <span class="tok-type">int</span> hi) {
    <span class="tok-keyword">if</span> (lo &gt;= hi) <span class="tok-keyword">return</span>;               <span class="tok-comment">// 0 hoặc 1 phần tử là đã sắp</span>
    <span class="tok-type">int</span> mid = lo + (hi - lo) / 2;
    <span class="tok-function">mergeSort</span>(a, lo, mid);
    <span class="tok-function">mergeSort</span>(a, mid + 1, hi);
    <span class="tok-function">merge</span>(a, lo, mid, hi);              <span class="tok-comment">// cần một mảng tạm</span>
}</pre>

<h3>Ví dụ có lời giải — sắp [38, 27, 43, 3, 9, 82, 10]</h3>
<div class="out"><b>Giai đoạn chia (không so sánh gì cả):</b><br>
[38, 27, 43, 3, 9, 82, 10] → [38, 27, 43, 3] + [9, 82, 10]<br>
→ [38, 27] [43, 3] [9, 82] [10] → còn từng phần tử.<br>
<b>Giai đoạn trộn (toàn bộ công việc):</b><br>
trộn [38] [27] → [27, 38] · trộn [43] [3] → [3, 43]<br>
trộn [27, 38] [3, 43] → so 27,3 → 3 · 27,43 → 27 · 38,43 → 38 · còn dư 43 → <b>[3, 27, 38, 43]</b><br>
trộn [9] [82] → [9, 82] · trộn [9, 82] [10] → [9, 10, 82]<br>
trộn cuối [3, 27, 38, 43] với [9, 10, 82]:<br>
3 với 9 → 3 · 27 với 9 → 9 · 27 với 10 → 10 · 27 với 82 → 27 · 38 → 38 · 43 → 43 · còn dư 82<br>
<b>Kết quả: [3, 9, 10, 27, 38, 43, 82].</b><br>
<b>Đếm công:</b> log₂7 ≈ 3 tầng, mỗi tầng trộn đủ n phần tử → <b>Θ(n log n) luôn luôn</b> — tốt nhất, trung bình và xấu nhất y hệt nhau.</div>

<h3>Tính ổn định — tính chất có ý nghĩa trong ứng dụng thật</h3>
<p>Một phép sắp xếp là <strong>ổn định</strong> nếu các bản ghi có khoá bằng nhau giữ nguyên thứ tự tương đối ban đầu. Merge-sort ổn định miễn là khi hai đầu bằng nhau thì bạn lấy từ nửa trái (<span class="badge">&lt;=</span>, không phải <span class="badge">&lt;</span>).</p>
<div class="out"><b>Vì sao ai cũng quan tâm.</b> Sắp bảng nhân viên theo tên, rồi sắp kết quả theo phòng ban. Với phép sắp <em>ổn định</em>, nhân viên trong mỗi phòng vẫn theo thứ tự bảng chữ cái — bạn có phép sắp hai khoá chỉ bằng cách sắp hai lần. Với phép sắp không ổn định (quick-sort, heap-sort), lượt thứ hai làm loạn lượt thứ nhất, và bạn buộc phải viết bộ so sánh ghép.<br>
<b>Trong Java:</b> <span class="badge">Arrays.sort(Object[])</span> ổn định (TimSort); <span class="badge">Arrays.sort(int[])</span> thì <em>không</em> (quicksort hai chốt). Khác biệt này là cố ý: kiểu nguyên thuỷ không có bản sắc riêng nên tính ổn định không quan sát được.</div>

<h3>Merge-sort với quick-sort</h3>
<table><thead><tr><th></th><th>Merge-sort</th><th>Quick-sort</th></tr></thead><tbody>
<tr><td>Trường hợp xấu nhất</td><td><b>O(n log n)</b> đảm bảo</td><td>O(n²)</td></tr>
<tr><td>Bộ nhớ phụ</td><td>O(n)</td><td><b>O(log n)</b> chỉ ngăn xếp</td></tr>
<tr><td>Ổn định</td><td><b>có</b></td><td>không</td></tr>
<tr><td>Ứng xử với cache</td><td>tốt (tuần tự)</td><td><b>rất tốt</b> (tại chỗ)</td></tr>
<tr><td>Danh sách liên kết</td><td><b>lý tưởng</b> — trộn không cần truy cập ngẫu nhiên, phụ trội O(1)</td><td>kém (không đánh chỉ số được)</td></tr>
<tr><td>Dữ liệu lớn hơn RAM</td><td><b>lựa chọn duy nhất</b></td><td>không dùng được</td></tr>
</tbody></table>

<div class="pitfall"><b>Đừng cấp phát mảng tạm mới trong mỗi lời gọi trộn.</b> Làm vậy biến bộ nhớ phụ O(n) thành O(n log n) lần cấp phát và hành hạ bộ dọn rác. Hãy cấp phát sẵn một vùng đệm cỡ n từ đầu rồi truyền xuống.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Sắp xếp ngoài — sắp 100 GB với 8 GB RAM.</b> Đọc tệp theo từng khối vừa bộ nhớ, sắp từng khối rồi ghi trở lại thành một "run" đã sắp; sau đó trộn tất cả các run bằng phép trộn k đường điều khiển bởi heap min, mỗi run chỉ đọc một block. Tổng chi phí đĩa là 2 lượt cho các run cộng 2 lượt mỗi vòng trộn. Đây là cách cơ sở dữ liệu thực hiện <span class="badge">ORDER BY</span> trên bảng không nằm vừa bộ nhớ, và là cách MapReduce xáo dữ liệu. <em>Ngoài giáo trình vì CSD201 giả định mảng nằm trong RAM, trong khi danh tiếng thật của merge-sort là nó không cần giả định đó.</em></div>
</div>
`,
        },
        {
          title: '6.5 — Heap-sort|||6.5 — Heap-sort',
          slug: 'csd201-heapsort',
          type: 'VIDEO',
          description: 'Dùng heap để sắp tại chỗ trong O(n log n) đảm bảo — chạy tay đầy đủ và so với quick/merge.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.5</span>
<h2>Heap-sort — the guaranteed O(n log n) that needs no extra memory</h2>
<p class="lead">You built the heap in lesson 4.7; sorting with it takes two lines. Heap-sort is the only classic sort that is simultaneously <strong>O(n log n) in the worst case</strong> and <strong>in place</strong>. Its weakness is a poor constant factor caused by jumping around memory.</p>

<h3>The algorithm</h3>
<pre><span class="tok-keyword">void</span> <span class="tok-function">heapSort</span>(<span class="tok-type">int</span>[] a) {
    <span class="tok-type">int</span> n = a.length;
    <span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = n/2 - 1; i &gt;= 0; i--) <span class="tok-function">siftDown</span>(a, i, n);   <span class="tok-comment">// 1. build a MAX-heap: O(n)</span>
    <span class="tok-keyword">for</span> (<span class="tok-type">int</span> end = n - 1; end &gt; 0; end--) {
        <span class="tok-function">swap</span>(a, 0, end);                                     <span class="tok-comment">// 2. biggest → its final slot</span>
        <span class="tok-function">siftDown</span>(a, 0, end);                                 <span class="tok-comment">// 3. repair the smaller heap</span>
    }
}</pre>
<p>Use a <b>max</b>-heap so that the largest element ends up at the back — that gives ascending order with no reversal.</p>

<h3>Worked example — sort [4, 10, 3, 5, 1]</h3>
<div class="out"><b>Phase 1 — build the max-heap</b> (start at i = 5/2 − 1 = 1):<br>
i=1: a[1]=10, children a[3]=5, a[4]=1 → 10 is already the largest → no change.<br>
i=0: a[0]=4, children 10 and 3 → swap with 10 → [10, 4, 3, 5, 1] → sift 4 further: children a[3]=5, a[4]=1 → swap with 5 → <b>[10, 5, 3, 4, 1]</b> = a valid max-heap.<br>
<b>Phase 2 — extract repeatedly:</b><br>
end=4: swap a[0]↔a[4] → [1, 5, 3, 4, <b>10</b>]; sift-down over the first 4 → [5, 4, 3, 1 | 10]<br>
end=3: swap a[0]↔a[3] → [1, 4, 3, <b>5</b>, 10]; sift over the first 3 → [4, 1, 3 | 5, 10]<br>
end=2: swap a[0]↔a[2] → [3, 1, <b>4</b>, 5, 10]; sift over the first 2 → [3, 1 | 4, 5, 10]<br>
end=1: swap a[0]↔a[1] → [1, <b>3</b>, 4, 5, 10]<br>
<b>Result: [1, 3, 4, 5, 10]</b> ✓ — sorted, and no array other than the original was ever used.</div>

<h3>Cost</h3>
<table><thead><tr><th>Phase</th><th>Cost</th></tr></thead><tbody>
<tr><td>Build the heap (Floyd)</td><td>O(n)</td></tr>
<tr><td>n extractions × sift-down O(log n)</td><td>O(n log n)</td></tr>
<tr><td><b>Total</b></td><td><b>O(n log n) in every case</b>, O(1) extra memory</td></tr>
</tbody></table>

<h3>So why is quick-sort still the default?</h3>
<div class="out"><b>Cache misses.</b> Sift-down jumps from index i to 2i+1 — a distance that doubles at every step, so it leaves the current cache line almost immediately. Quick-sort's partition scans strictly left to right, which the hardware prefetcher predicts perfectly. On real machines heap-sort typically runs <b>2–3× slower</b> than quick-sort despite an identical Big-O.<br>
<b>Where heap-sort still wins:</b> hard real-time systems (no O(n²) risk allowed), memory-constrained embedded code (no O(n) buffer available), and as the safety net inside introsort.</div>

<div class="pitfall"><b>Do not confuse "the array is a heap" with "the array is sorted".</b> After phase 1 the array is [10, 5, 3, 4, 1] — a perfectly valid heap and completely unsorted. Only the repeated extraction of phase 2 produces order.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Partial sorting — "top k" is much cheaper than a full sort.</b> To get the 10 largest of a million items, do not sort a million; keep a min-heap of size 10, push each item and pop when the size exceeds 10. Cost O(n log k) ≈ n·3 comparisons instead of n log n ≈ n·20 — and memory O(k) instead of O(n), so it works on a stream that never fits in RAM. This is exactly how "top N" dashboards and search result pages are computed. <em>Beyond syllabus because the course only asks for a fully sorted array, while production systems almost always need just the head of it.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.5</span>
<h2>Heap-sort — O(n log n) đảm bảo mà không cần bộ nhớ phụ</h2>
<p class="lead">Bạn đã dựng heap ở bài 4.7; sắp xếp bằng nó chỉ tốn hai dòng. Heap-sort là phép sắp kinh điển duy nhất vừa <strong>O(n log n) ở trường hợp xấu nhất</strong> vừa <strong>tại chỗ</strong>. Điểm yếu của nó là hằng số nhân xấu do phải nhảy loạn xạ trong bộ nhớ.</p>

<h3>Thuật toán</h3>
<pre><span class="tok-keyword">void</span> <span class="tok-function">heapSort</span>(<span class="tok-type">int</span>[] a) {
    <span class="tok-type">int</span> n = a.length;
    <span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = n/2 - 1; i &gt;= 0; i--) <span class="tok-function">siftDown</span>(a, i, n);   <span class="tok-comment">// 1. dựng heap MAX: O(n)</span>
    <span class="tok-keyword">for</span> (<span class="tok-type">int</span> end = n - 1; end &gt; 0; end--) {
        <span class="tok-function">swap</span>(a, 0, end);                                     <span class="tok-comment">// 2. lớn nhất → về đúng ô cuối</span>
        <span class="tok-function">siftDown</span>(a, 0, end);                                 <span class="tok-comment">// 3. sửa lại heap nhỏ hơn</span>
    }
}</pre>
<p>Dùng heap <b>max</b> để phần tử lớn nhất bị đẩy về cuối — nhờ đó có thứ tự tăng dần mà không phải đảo lại.</p>

<h3>Ví dụ có lời giải — sắp [4, 10, 3, 5, 1]</h3>
<div class="out"><b>Giai đoạn 1 — dựng heap max</b> (bắt đầu tại i = 5/2 − 1 = 1):<br>
i=1: a[1]=10, con là a[3]=5, a[4]=1 → 10 đã lớn nhất → giữ nguyên.<br>
i=0: a[0]=4, con là 10 và 3 → đổi với 10 → [10, 4, 3, 5, 1] → tiếp tục sift 4 xuống: con là a[3]=5, a[4]=1 → đổi với 5 → <b>[10, 5, 3, 4, 1]</b> = heap max hợp lệ.<br>
<b>Giai đoạn 2 — rút liên tiếp:</b><br>
end=4: đổi a[0]↔a[4] → [1, 5, 3, 4, <b>10</b>]; sift-down trên 4 phần tử đầu → [5, 4, 3, 1 | 10]<br>
end=3: đổi a[0]↔a[3] → [1, 4, 3, <b>5</b>, 10]; sift trên 3 phần tử đầu → [4, 1, 3 | 5, 10]<br>
end=2: đổi a[0]↔a[2] → [3, 1, <b>4</b>, 5, 10]; sift trên 2 phần tử đầu → [3, 1 | 4, 5, 10]<br>
end=1: đổi a[0]↔a[1] → [1, <b>3</b>, 4, 5, 10]<br>
<b>Kết quả: [1, 3, 4, 5, 10]</b> ✓ — đã sắp, và không hề dùng mảng nào ngoài mảng gốc.</div>

<h3>Chi phí</h3>
<table><thead><tr><th>Giai đoạn</th><th>Chi phí</th></tr></thead><tbody>
<tr><td>Dựng heap (Floyd)</td><td>O(n)</td></tr>
<tr><td>n lần rút × sift-down O(log n)</td><td>O(n log n)</td></tr>
<tr><td><b>Tổng</b></td><td><b>O(n log n) trong mọi trường hợp</b>, bộ nhớ phụ O(1)</td></tr>
</tbody></table>

<h3>Vậy vì sao quick-sort vẫn là mặc định?</h3>
<div class="out"><b>Trượt cache.</b> Sift-down nhảy từ chỉ số i sang 2i+1 — khoảng cách nhân đôi sau mỗi bước, nên gần như lập tức ra khỏi dòng cache hiện tại. Còn phân hoạch của quick-sort quét đúng từ trái sang phải, thứ mà bộ nạp trước của phần cứng đoán chính xác tuyệt đối. Trên máy thật, heap-sort thường chạy <b>chậm hơn 2–3 lần</b> quick-sort dù Big-O y hệt.<br>
<b>Chỗ heap-sort vẫn thắng:</b> hệ thống thời gian thực khắt khe (không được phép có rủi ro O(n²)), mã nhúng eo hẹp bộ nhớ (không có chỗ cho vùng đệm O(n)), và làm lưới an toàn bên trong introsort.</div>

<div class="pitfall"><b>Đừng nhầm "mảng là một heap" với "mảng đã được sắp".</b> Sau giai đoạn 1, mảng là [10, 5, 3, 4, 1] — một heap hoàn toàn hợp lệ và hoàn toàn chưa sắp. Chỉ việc rút liên tiếp ở giai đoạn 2 mới tạo ra thứ tự.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Sắp xếp một phần — lấy "top k" rẻ hơn sắp toàn bộ rất nhiều.</b> Muốn lấy 10 phần tử lớn nhất trong một triệu, đừng sắp cả triệu; hãy giữ một heap min cỡ 10, đẩy từng phần tử vào và lấy ra khi kích thước vượt 10. Chi phí O(n log k) ≈ n·3 phép so sánh thay vì n log n ≈ n·20 — và bộ nhớ O(k) thay vì O(n), nên chạy được trên luồng dữ liệu không bao giờ nằm vừa RAM. Đây đúng là cách các bảng "top N" và trang kết quả tìm kiếm được tính. <em>Ngoài giáo trình vì môn học chỉ yêu cầu mảng sắp đầy đủ, còn hệ thống thật hầu như luôn chỉ cần phần đầu của nó.</em></div>
</div>
`,
        },
        {
          title: '6.6 — Linear-time sorting: bucket & radix|||6.6 — Sắp xếp tuyến tính: bucket & radix',
          slug: 'csd201-sap-xep-tuyen-tinh',
          type: 'VIDEO',
          description: 'Vượt qua cận Ω(n log n) bằng cách không so sánh — counting, bucket và radix sort, có ví dụ từng lượt.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.6</span>
<h2>Sorting faster than n log n — by not comparing at all</h2>
<p class="lead">Every sort so far asks "is a &lt; b?". Lesson 6.7 proves such algorithms cannot beat Ω(n log n). The way around it is to stop comparing and start <em>indexing</em>: if a key can be turned directly into an array position, sorting becomes counting.</p>

<h3>Counting sort — the base case</h3>
<pre><span class="tok-type">int</span>[] <span class="tok-function">countingSort</span>(<span class="tok-type">int</span>[] a, <span class="tok-type">int</span> k) {      <span class="tok-comment">// keys in 0..k</span>
    <span class="tok-type">int</span>[] count = <span class="tok-keyword">new</span> <span class="tok-type">int</span>[k + 1];
    <span class="tok-keyword">for</span> (<span class="tok-type">int</span> x : a) count[x]++;                  <span class="tok-comment">// 1. tally</span>
    <span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = 1; i &lt;= k; i++) count[i] += count[i-1];   <span class="tok-comment">// 2. prefix sums</span>
    <span class="tok-type">int</span>[] out = <span class="tok-keyword">new</span> <span class="tok-type">int</span>[a.length];
    <span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = a.length - 1; i &gt;= 0; i--)      <span class="tok-comment">// 3. backwards keeps it STABLE</span>
        out[--count[a[i]]] = a[i];
    <span class="tok-keyword">return</span> out;
}</pre>
<div class="out"><b>Sort [2, 5, 3, 0, 2, 3, 0, 3] with k = 5:</b><br>
counts: 0→2, 2→2, 3→3, 5→1 → count = [2, 0, 2, 3, 0, 1]<br>
prefix sums → [2, 2, 4, 7, 7, 8] (count[v] = how many keys are ≤ v)<br>
place from the right: a[7]=3 → out[6]=3 · a[6]=0 → out[1]=0 · a[5]=3 → out[5]=3 …<br>
<b>Result: [0, 0, 2, 2, 3, 3, 3, 5]</b> in <b>O(n + k)</b> — linear when k is comparable to n.<br>
<b>The catch:</b> k = 1,000,000,000 would allocate a billion counters for 8 values. Counting sort is only for small key ranges.</div>

<h3>Radix sort — counting sort applied digit by digit</h3>
<p>Sort by the least significant digit first, then the next, using a <em>stable</em> sort each round. After d rounds the array is fully sorted. Cost <b>O(d · (n + b))</b> for d digits in base b.</p>
<div class="out"><b>Sort [170, 45, 75, 90, 802, 24, 2, 66] by digits (b = 10, d = 3):</b><br>
<b>Pass 1 — units digit:</b> 170, 90, 802, 2, 24, 45, 75, 66<br>
&nbsp;&nbsp;(buckets: 0→[170,90], 2→[802,2], 4→[24], 5→[45,75], 6→[66])<br>
<b>Pass 2 — tens digit:</b> 802, 2, 24, 45, 66, 170, 75, 90<br>
&nbsp;&nbsp;(0→[802,2], 2→[24], 4→[45], 6→[66], 7→[170,75], 9→[90])<br>
<b>Pass 3 — hundreds digit:</b> 2, 24, 45, 66, 75, 90, 170, 802 ✓ <b>sorted</b><br>
<b>Why stability is essential:</b> in pass 3 the keys 2, 24, 45, 66, 75, 90 all have hundreds digit 0 — they stay in the order pass 2 left them, which was already correct on the lower digits. An unstable inner sort would destroy the previous passes and the whole algorithm collapses.</div>

<h3>Bucket sort — for keys spread evenly over a range</h3>
<p>Split [0,1) into n buckets, drop each key into ⌊n·key⌋, sort each bucket with insertion sort, then concatenate. With a uniform distribution each bucket holds ~1 element, giving <b>O(n) expected</b>; with a skewed distribution everything lands in one bucket and it degrades to O(n²).</p>

<h3>Which linear sort, when</h3>
<table><thead><tr><th>Algorithm</th><th>Cost</th><th>Requires</th><th>Typical use</th></tr></thead><tbody>
<tr><td>Counting</td><td>O(n + k)</td><td>small integer range</td><td>ages, grades, byte values</td></tr>
<tr><td>Radix</td><td>O(d(n + b))</td><td>fixed-length keys</td><td>IDs, IPv4, dates, strings</td></tr>
<tr><td>Bucket</td><td>O(n) expected</td><td>uniform distribution</td><td>floats in a known range</td></tr>
</tbody></table>

<div class="pitfall"><b>"Linear" hides the key length.</b> Radix sort on n distinct keys needs d ≥ log_b n digits, so O(d·n) is really O(n log n) in disguise — the win is a much smaller constant and no branch mispredictions, not a change of complexity class. Do not claim radix sort "beats the Ω(n log n) bound"; it sidesteps the bound by using a different model (indexing, not comparison).</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Radix sort is how databases and GPUs sort.</b> Column stores sort integer keys with LSD radix because it is branch-free and vectorisable; CUDA's <span class="badge">thrust::sort</span> on integers is a radix sort and beats comparison sorts by an order of magnitude on a GPU. The same idea powers suffix-array construction for text indexing. <em>Beyond syllabus because the course treats non-comparison sorts as a curiosity, while on modern hardware they are the fastest thing available whenever the keys allow it.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.6</span>
<h2>Sắp nhanh hơn n log n — bằng cách không so sánh gì cả</h2>
<p class="lead">Mọi phép sắp tới giờ đều hỏi "a &lt; b không?". Bài 6.7 chứng minh các thuật toán như vậy không thể vượt cận Ω(n log n). Cách đi vòng là thôi so sánh và bắt đầu <em>đánh chỉ số</em>: nếu khoá biến thẳng được thành một vị trí trong mảng thì sắp xếp trở thành đếm.</p>

<h3>Counting sort — trường hợp nền</h3>
<pre><span class="tok-type">int</span>[] <span class="tok-function">countingSort</span>(<span class="tok-type">int</span>[] a, <span class="tok-type">int</span> k) {      <span class="tok-comment">// khoá trong 0..k</span>
    <span class="tok-type">int</span>[] count = <span class="tok-keyword">new</span> <span class="tok-type">int</span>[k + 1];
    <span class="tok-keyword">for</span> (<span class="tok-type">int</span> x : a) count[x]++;                  <span class="tok-comment">// 1. đếm</span>
    <span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = 1; i &lt;= k; i++) count[i] += count[i-1];   <span class="tok-comment">// 2. tổng tiền tố</span>
    <span class="tok-type">int</span>[] out = <span class="tok-keyword">new</span> <span class="tok-type">int</span>[a.length];
    <span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = a.length - 1; i &gt;= 0; i--)      <span class="tok-comment">// 3. đi ngược để giữ ỔN ĐỊNH</span>
        out[--count[a[i]]] = a[i];
    <span class="tok-keyword">return</span> out;
}</pre>
<div class="out"><b>Sắp [2, 5, 3, 0, 2, 3, 0, 3] với k = 5:</b><br>
đếm: 0→2, 2→2, 3→3, 5→1 → count = [2, 0, 2, 3, 0, 1]<br>
tổng tiền tố → [2, 2, 4, 7, 7, 8] (count[v] = số khoá ≤ v)<br>
đặt từ phải sang: a[7]=3 → out[6]=3 · a[6]=0 → out[1]=0 · a[5]=3 → out[5]=3 …<br>
<b>Kết quả: [0, 0, 2, 2, 3, 3, 3, 5]</b> trong <b>O(n + k)</b> — tuyến tính khi k xấp xỉ n.<br>
<b>Chỗ vướng:</b> k = 1.000.000.000 sẽ cấp phát một tỉ bộ đếm cho 8 giá trị. Counting sort chỉ dùng được khi dải khoá nhỏ.</div>

<h3>Radix sort — counting sort áp dụng theo từng chữ số</h3>
<p>Sắp theo chữ số hàng đơn vị trước, rồi tới hàng kế tiếp, mỗi lượt dùng một phép sắp <em>ổn định</em>. Sau d lượt, mảng đã sắp hoàn toàn. Chi phí <b>O(d · (n + b))</b> với d chữ số trong cơ số b.</p>
<div class="out"><b>Sắp [170, 45, 75, 90, 802, 24, 2, 66] theo chữ số (b = 10, d = 3):</b><br>
<b>Lượt 1 — hàng đơn vị:</b> 170, 90, 802, 2, 24, 45, 75, 66<br>
&nbsp;&nbsp;(rổ: 0→[170,90], 2→[802,2], 4→[24], 5→[45,75], 6→[66])<br>
<b>Lượt 2 — hàng chục:</b> 802, 2, 24, 45, 66, 170, 75, 90<br>
&nbsp;&nbsp;(0→[802,2], 2→[24], 4→[45], 6→[66], 7→[170,75], 9→[90])<br>
<b>Lượt 3 — hàng trăm:</b> 2, 24, 45, 66, 75, 90, 170, 802 ✓ <b>đã sắp</b><br>
<b>Vì sao tính ổn định là bắt buộc:</b> ở lượt 3, các khoá 2, 24, 45, 66, 75, 90 đều có hàng trăm bằng 0 — chúng giữ nguyên thứ tự mà lượt 2 để lại, vốn đã đúng theo các chữ số thấp. Một phép sắp bên trong không ổn định sẽ phá huỷ các lượt trước và cả thuật toán sụp đổ.</div>

<h3>Bucket sort — cho khoá rải đều trên một dải</h3>
<p>Chia [0,1) thành n rổ, thả mỗi khoá vào rổ ⌊n·khoá⌋, sắp từng rổ bằng insertion sort rồi nối lại. Với phân bố đều, mỗi rổ chứa ~1 phần tử, cho <b>O(n) kỳ vọng</b>; với phân bố lệch, mọi thứ rơi vào một rổ và tụt về O(n²).</p>

<h3>Chọn phép sắp tuyến tính nào</h3>
<table><thead><tr><th>Thuật toán</th><th>Chi phí</th><th>Yêu cầu</th><th>Dùng điển hình</th></tr></thead><tbody>
<tr><td>Counting</td><td>O(n + k)</td><td>dải số nguyên nhỏ</td><td>tuổi, điểm số, giá trị byte</td></tr>
<tr><td>Radix</td><td>O(d(n + b))</td><td>khoá độ dài cố định</td><td>mã ID, IPv4, ngày tháng, chuỗi</td></tr>
<tr><td>Bucket</td><td>O(n) kỳ vọng</td><td>phân bố đều</td><td>số thực trong dải đã biết</td></tr>
</tbody></table>

<div class="pitfall"><b>Chữ "tuyến tính" đang giấu độ dài khoá.</b> Radix sort trên n khoá phân biệt cần d ≥ log_b n chữ số, nên O(d·n) thực ra là O(n log n) trá hình — cái được là hằng số nhỏ hơn nhiều và không có dự đoán rẽ nhánh sai, chứ không phải đổi lớp độ phức tạp. Đừng nói radix sort "phá được cận Ω(n log n)"; nó né cận đó bằng cách dùng mô hình khác (đánh chỉ số, không so sánh).</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Radix sort là cách cơ sở dữ liệu và GPU sắp xếp.</b> Các kho cột sắp khoá số nguyên bằng radix LSD vì nó không rẽ nhánh và véc-tơ hoá được; <span class="badge">thrust::sort</span> của CUDA trên số nguyên là một radix sort và nhanh hơn các phép sắp so sánh cả bậc độ lớn trên GPU. Cùng ý tưởng đó là nền để dựng mảng hậu tố cho đánh chỉ mục văn bản. <em>Ngoài giáo trình vì môn học coi các phép sắp không so sánh như một sự lạ, trong khi trên phần cứng hiện đại chúng là thứ nhanh nhất có được mỗi khi kiểu khoá cho phép.</em></div>
</div>
`,
        },
        {
          title: '6.7 — Choosing a sort: the full comparison|||6.7 — Chọn thuật toán sắp xếp: bảng so sánh đầy đủ',
          slug: 'csd201-so-sanh-sap-xep',
          type: 'VIDEO',
          description: 'Bảng tổng hợp mọi thuật toán, cận dưới Ω(n log n), tính ổn định/tại chỗ, và cây quyết định chọn nhanh.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.7</span>
<h2>The one table to memorise before the exam</h2>
<p class="lead">Every sorting question — in a test or an interview — reduces to reading this table correctly and justifying one row.</p>

<table><thead><tr><th>Algorithm</th><th>Best</th><th>Average</th><th>Worst</th><th>Memory</th><th>Stable</th><th>In place</th></tr></thead><tbody>
<tr><td>Bubble (with early exit)</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>✔</td><td>✔</td></tr>
<tr><td>Selection</td><td>O(n²)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>✘</td><td>✔</td></tr>
<tr><td>Insertion</td><td><b>O(n)</b></td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>✔</td><td>✔</td></tr>
<tr><td>Quick</td><td>O(n log n)</td><td><b>O(n log n)</b></td><td>O(n²)</td><td>O(log n)</td><td>✘</td><td>✔</td></tr>
<tr><td>Merge</td><td>O(n log n)</td><td>O(n log n)</td><td><b>O(n log n)</b></td><td>O(n)</td><td>✔</td><td>✘</td></tr>
<tr><td>Heap</td><td>O(n log n)</td><td>O(n log n)</td><td><b>O(n log n)</b></td><td>O(1)</td><td>✘</td><td>✔</td></tr>
<tr><td>Counting</td><td>O(n+k)</td><td>O(n+k)</td><td>O(n+k)</td><td>O(k)</td><td>✔</td><td>✘</td></tr>
<tr><td>Radix</td><td>O(d(n+b))</td><td>O(d(n+b))</td><td>O(d(n+b))</td><td>O(n+b)</td><td>✔</td><td>✘</td></tr>
</tbody></table>

<h3>Why no comparison sort can beat n log n</h3>
<div class="formula"><span class="lbl">LOWER BOUND</span>n! ≤ 2<sup>h</sup> &nbsp;⟹&nbsp; h ≥ log₂(n!) = Ω(n log n)</div>
<div class="out"><b>The decision-tree argument.</b> A comparison sort is a binary decision tree: each internal node is one comparison with two outcomes, and each leaf is one possible permutation of the output. To sort correctly the tree must have at least n! leaves. A binary tree of height h has at most 2<sup>h</sup> leaves, so 2<sup>h</sup> ≥ n!, hence h ≥ log₂(n!). By Stirling's approximation log₂(n!) ≈ n log₂n − 1.44n = <b>Ω(n log n)</b>.<br>
<b>Reading it correctly:</b> h is the length of the <em>longest</em> path = the worst-case number of comparisons. So no comparison-based algorithm — invented or yet to be invented — can have a worst case below n log n. Radix and counting sort escape only because they never perform a comparison.</div>

<h3>Decision tree — pick a sort in ten seconds</h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>n &lt; 50?</b><span>Insertion sort. Tiny constants beat everything asymptotic.</span></div>
  <div class="lz-fitem"><b>Nearly sorted?</b><span>Insertion sort — O(n + inversions), effectively linear.</span></div>
  <div class="lz-fitem"><b>Small integer keys?</b><span>Counting or radix sort — linear time.</span></div>
  <div class="lz-fitem"><b>Need stability?</b><span>Merge sort (or TimSort in a library).</span></div>
  <div class="lz-fitem"><b>Worst case must be bounded?</b><span>Heap sort or merge sort; never plain quick-sort.</span></div>
  <div class="lz-fitem"><b>Data bigger than RAM?</b><span>External merge sort.</span></div>
  <div class="lz-fitem"><b>Otherwise</b><span>Quick-sort with a good pivot — the practical default.</span></div>
</div>

<h3>Worked example — three exam-style scenarios</h3>
<div class="out"><b>1) Sort a 10-million-row log by timestamp, and rows with the same timestamp must keep their file order.</b><br>
→ Stability is required, n is large → <b>merge sort / TimSort</b>. Quick-sort and heap-sort are excluded by stability, not by speed.<br>
<b>2) Sort 200,000 exam marks in the range 0–100 inside an embedded device with 64 KB of free memory.</b><br>
→ k = 101 is tiny → <b>counting sort</b>: one array of 101 counters, O(n + k), a single pass. n log n comparisons would be pure waste.<br>
<b>3) Sort 1,000 records that are already almost in order (a few were appended at the end).</b><br>
→ <b>Insertion sort</b>: cost is O(n + number of inversions), so a nearly sorted array is nearly linear — and it beats quick-sort here despite the "worse" Big-O.</div>

<div class="pitfall"><b>Do not answer "quick-sort, because it is the fastest".</b> The examiner is testing whether you know the constraints: stability, memory, worst case, key type. State the constraint first, then the algorithm it forces.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>TimSort — the sort your language actually calls.</b> Invented for Python in 2002 and now used by Java for objects, Android, V8 and Rust, TimSort scans for already-sorted "runs", extends short runs with binary insertion, then merges runs while maintaining size invariants. On real-world data, which is full of partially ordered stretches, it approaches O(n); on random data it matches merge sort. Its worst case is O(n log n) and it is stable. <em>Beyond syllabus because textbooks present the classic seven in isolation, while every modern standard library ships an adaptive hybrid instead.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.7</span>
<h2>Bảng duy nhất cần thuộc trước khi thi</h2>
<p class="lead">Mọi câu hỏi về sắp xếp — trong bài kiểm tra hay buổi phỏng vấn — đều quy về việc đọc đúng bảng này và biện minh cho một dòng trong đó.</p>

<table><thead><tr><th>Thuật toán</th><th>Tốt nhất</th><th>Trung bình</th><th>Xấu nhất</th><th>Bộ nhớ</th><th>Ổn định</th><th>Tại chỗ</th></tr></thead><tbody>
<tr><td>Bubble (có thoát sớm)</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>✔</td><td>✔</td></tr>
<tr><td>Selection</td><td>O(n²)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>✘</td><td>✔</td></tr>
<tr><td>Insertion</td><td><b>O(n)</b></td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>✔</td><td>✔</td></tr>
<tr><td>Quick</td><td>O(n log n)</td><td><b>O(n log n)</b></td><td>O(n²)</td><td>O(log n)</td><td>✘</td><td>✔</td></tr>
<tr><td>Merge</td><td>O(n log n)</td><td>O(n log n)</td><td><b>O(n log n)</b></td><td>O(n)</td><td>✔</td><td>✘</td></tr>
<tr><td>Heap</td><td>O(n log n)</td><td>O(n log n)</td><td><b>O(n log n)</b></td><td>O(1)</td><td>✘</td><td>✔</td></tr>
<tr><td>Counting</td><td>O(n+k)</td><td>O(n+k)</td><td>O(n+k)</td><td>O(k)</td><td>✔</td><td>✘</td></tr>
<tr><td>Radix</td><td>O(d(n+b))</td><td>O(d(n+b))</td><td>O(d(n+b))</td><td>O(n+b)</td><td>✔</td><td>✘</td></tr>
</tbody></table>

<h3>Vì sao không phép sắp so sánh nào vượt được n log n</h3>
<div class="formula"><span class="lbl">CẬN DƯỚI</span>n! ≤ 2<sup>h</sup> &nbsp;⟹&nbsp; h ≥ log₂(n!) = Ω(n log n)</div>
<div class="out"><b>Lập luận cây quyết định.</b> Một phép sắp so sánh là một cây quyết định nhị phân: mỗi nút trong là một phép so sánh với hai kết cục, mỗi lá là một hoán vị đầu ra khả dĩ. Muốn sắp đúng thì cây phải có ít nhất n! lá. Cây nhị phân chiều cao h có nhiều nhất 2<sup>h</sup> lá, nên 2<sup>h</sup> ≥ n!, suy ra h ≥ log₂(n!). Theo xấp xỉ Stirling, log₂(n!) ≈ n log₂n − 1,44n = <b>Ω(n log n)</b>.<br>
<b>Đọc cho đúng:</b> h là độ dài đường đi <em>dài nhất</em> = số phép so sánh ở trường hợp xấu nhất. Vậy không thuật toán dựa trên so sánh nào — đã có hay chưa được nghĩ ra — có trường hợp xấu nhất dưới n log n. Radix và counting sort thoát được chỉ vì chúng không hề thực hiện phép so sánh nào.</div>

<h3>Cây quyết định — chọn thuật toán trong mười giây</h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>n &lt; 50?</b><span>Insertion sort. Hằng số tí hon thắng mọi thứ tiệm cận.</span></div>
  <div class="lz-fitem"><b>Gần như đã sắp?</b><span>Insertion sort — O(n + số nghịch thế), coi như tuyến tính.</span></div>
  <div class="lz-fitem"><b>Khoá là số nguyên nhỏ?</b><span>Counting hoặc radix sort — thời gian tuyến tính.</span></div>
  <div class="lz-fitem"><b>Cần ổn định?</b><span>Merge sort (hoặc TimSort trong thư viện).</span></div>
  <div class="lz-fitem"><b>Phải chặn trường hợp xấu nhất?</b><span>Heap sort hoặc merge sort; tuyệt đối không quick-sort trần.</span></div>
  <div class="lz-fitem"><b>Dữ liệu lớn hơn RAM?</b><span>Merge sort ngoài.</span></div>
  <div class="lz-fitem"><b>Còn lại</b><span>Quick-sort với chốt tốt — mặc định thực dụng.</span></div>
</div>

<h3>Ví dụ có lời giải — ba tình huống kiểu đề thi</h3>
<div class="out"><b>1) Sắp 10 triệu dòng log theo mốc thời gian, và các dòng cùng mốc phải giữ nguyên thứ tự trong tệp.</b><br>
→ Bắt buộc ổn định, n lớn → <b>merge sort / TimSort</b>. Quick-sort và heap-sort bị loại vì tính ổn định, không phải vì tốc độ.<br>
<b>2) Sắp 200.000 điểm thi trong dải 0–100 trên một thiết bị nhúng còn 64 KB bộ nhớ.</b><br>
→ k = 101 rất nhỏ → <b>counting sort</b>: một mảng 101 bộ đếm, O(n + k), một lượt duy nhất. Bỏ ra n log n phép so sánh là lãng phí thuần tuý.<br>
<b>3) Sắp 1.000 bản ghi gần như đã đúng thứ tự (vài bản mới được nối vào cuối).</b><br>
→ <b>Insertion sort</b>: chi phí là O(n + số nghịch thế), nên mảng gần sắp là gần tuyến tính — và nó thắng quick-sort ở đây bất chấp Big-O "tệ hơn".</div>

<div class="pitfall"><b>Đừng trả lời "quick-sort, vì nó nhanh nhất".</b> Người chấm đang kiểm xem bạn có nắm các ràng buộc không: ổn định, bộ nhớ, trường hợp xấu nhất, kiểu khoá. Hãy nêu ràng buộc trước, rồi mới tới thuật toán mà ràng buộc đó bắt buộc.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>TimSort — phép sắp mà ngôn ngữ của bạn thật sự gọi.</b> Được nghĩ ra cho Python năm 2002 và nay dùng trong Java cho đối tượng, Android, V8 và Rust, TimSort quét tìm các "run" đã sắp sẵn, kéo dài run ngắn bằng chèn nhị phân, rồi trộn các run trong khi giữ các bất biến về kích thước. Trên dữ liệu đời thực vốn đầy những đoạn có thứ tự một phần, nó tiệm cận O(n); trên dữ liệu ngẫu nhiên nó ngang merge sort. Xấu nhất vẫn O(n log n) và nó ổn định. <em>Ngoài giáo trình vì sách giáo khoa trình bày bảy thuật toán kinh điển tách rời nhau, trong khi mọi thư viện chuẩn hiện đại đều xuất xưởng một bản lai thích nghi.</em></div>
</div>
`,
        },
        {
          title: 'Quiz 4 — Graphs & Sorting|||Quiz 4 — Đồ thị & Sắp xếp',
          slug: 'csd201-quiz-4',
          type: 'QUIZ',
          description: 'Kiểm tra đồ thị và sắp xếp.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'BFS finds the shortest path in…|||BFS tìm đường ngắn nhất trong…', options: ['a weighted graph|||đồ thị có trọng số', 'an unweighted graph|||đồ thị không trọng số', 'any graph|||đồ thị bất kỳ', 'a tree only|||chỉ cây'], correctIndex: 1, points: 1 },
              { question: 'An adjacency list uses space…|||Danh sách kề dùng không gian…', options: ['O(V²)', 'O(V+E)', 'O(1)', 'O(E²)'], correctIndex: 1, points: 1 },
              { question: 'Merge sort is preferred when you need…|||Merge sort được ưu tiên khi bạn cần…', options: ['minimum memory|||bộ nhớ tối thiểu', 'stability and guaranteed O(n log n)|||ổn định và đảm bảo O(n log n)', 'O(n) time|||thời gian O(n)', 'in-place sorting|||sắp xếp tại chỗ'], correctIndex: 1, points: 1 },
              { question: 'Quick sort\'s worst case is O(n²) when…|||Trường hợp xấu nhất của quick sort là O(n²) khi…', options: ['the array is empty|||mảng rỗng', 'the pivot is consistently bad|||chốt liên tục tệ', 'it is stable|||nó ổn định', 'n is even|||n chẵn'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 7 — BĂM ══════════════════ */
    {
      title: 'Chapter 7 — Hashing|||Chương 7 — Băm',
      description: 'Bảng băm: hàm băm, xử lý va chạm, và cách đạt tra cứu O(1) trung bình.',
      lessons: [
        {
          title: '7.1 — Hash tables & collisions|||7.1 — Bảng băm & va chạm',
          slug: 'csd201-bam',
          simulation: {
            url: 'https://media.cuongthai.com/videos/academy/CSD201/csd201-bam.mp4',
            poster: 'https://media.cuongthai.com/videos/academy/CSD201/csd201-bam.jpg',
            scenario: 'hash-map',
            durationSeconds: 25,
            caption: { en: "Hash → slot index → jump; and the collision that always comes", vi: "Băm → chỉ số ô → nhảy thẳng; và va chạm kiểu gì cũng tới" },
          },
          type: 'VIDEO',
          description: 'Hàm băm ánh xạ khóa → chỉ số; chaining vs open addressing để xử lý va chạm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Hash tables — O(1) lookup on average</h2>
<p class="lead">A <strong>hash function</strong> turns a key into an array index, so you can jump straight to a value — average O(1) for insert, search and delete. This is how Java's <span class="badge">HashMap</span> and <span class="badge">HashSet</span> work.</p>
<div class="out">"apple" → hash() → 4 → bucket[4]. When two keys hash to the same bucket, that is a <b>collision</b> — and every hash table must handle them.</div>
<div class="lz-stack">
  <div class="lz-layer"><b>Chaining</b> — each bucket holds a linked list of entries. Simple; degrades to O(n) if many collide.</div>
  <div class="lz-layer"><b>Open addressing</b> — on collision, probe for the next free slot (linear/quadratic/double hashing).</div>
</div>
<div class="pitfall"><b>Trap:</b> a good hash spreads keys evenly. A bad one (or a full table) piles everything into a few buckets, and O(1) collapses to O(n). Keep the load factor low and resize when needed.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Java 8 HashMaps treeify long buckets.</b> Since Java 8, a HashMap bucket that grows past 8 colliding entries converts its linked list into a red-black tree, so worst-case lookup degrades to O(log n) instead of O(n). This was a direct defence against hash-collision denial-of-service attacks, where an attacker crafts keys that all land in one bucket. <em>The syllabus says collisions degrade chaining to O(n); the standard library quietly caps that at O(log n).</em></div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms#module-507" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">Practise: Hashing</span><span class="lc-sub">Hash functions and collision handling.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Bảng băm — tra cứu O(1) trung bình</h2>
<p class="lead"><strong>Hàm băm</strong> biến một khóa thành chỉ số mảng, để bạn nhảy thẳng tới giá trị — trung bình O(1) cho chèn, tìm và xóa. Đây là cách <span class="badge">HashMap</span> và <span class="badge">HashSet</span> của Java hoạt động.</p>
<div class="out">"apple" → hash() → 4 → bucket[4]. Khi hai khóa băm về cùng bucket, đó là <b>va chạm</b> — và mọi bảng băm phải xử lý chúng.</div>
<div class="lz-stack">
  <div class="lz-layer"><b>Chaining (dây chuyền)</b> — mỗi bucket giữ một danh sách liên kết các mục. Đơn giản; suy giảm về O(n) nếu nhiều va chạm.</div>
  <div class="lz-layer"><b>Open addressing (địa chỉ mở)</b> — khi va chạm, dò tới ô trống kế (linear/quadratic/double hashing).</div>
</div>
<div class="pitfall"><b>Bẫy:</b> hàm băm tốt rải khóa đều. Hàm tệ (hoặc bảng đầy) dồn mọi thứ vào vài bucket, và O(1) sụp về O(n). Giữ hệ số tải thấp và resize khi cần.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>HashMap của Java 8 "cây hóa" bucket dài.</b> Từ Java 8, một bucket của HashMap khi vượt quá 8 mục va chạm sẽ chuyển danh sách liên kết của nó thành cây đỏ-đen, nên tra cứu xấu nhất suy giảm về O(log n) thay vì O(n). Đây là phòng thủ trực tiếp trước tấn công từ chối dịch vụ bằng va chạm băm, khi kẻ tấn công tạo các khóa đều rơi vào một bucket. <em>Giáo trình nói va chạm làm chaining suy giảm về O(n); thư viện chuẩn lặng lẽ chặn ở O(log n).</em></div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms#module-507" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">Luyện: Hashing</span><span class="lc-sub">Hàm băm và xử lý va chạm.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '7.2 — Hash functions & the hashCode/equals contract|||7.2 — Hàm băm & giao ước hashCode/equals',
          slug: 'csd201-ham-bam',
          type: 'VIDEO',
          description: 'Ba phép băm kinh điển (chia, nhân, MAD), tiêu chuẩn hàm băm tốt, và giao ước bắt buộc trong Java.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Turning a key into an index</h2>
<p class="lead">Hashing has two stages: a <strong>hash code</strong> maps any object to an integer, then a <strong>compression function</strong> squeezes that integer into 0..N−1, the range of your table. Both stages can ruin performance if you get them wrong.</p>

<h3>Stage 2 — three compression functions</h3>
<div class="formula"><span class="lbl">DIVISION</span>h(k) = k mod N &nbsp;&nbsp;(choose N prime)</div>
<div class="formula"><span class="lbl">MULTIPLY–ADD–DIVIDE (MAD)</span>h(k) = ((a·k + b) mod p) mod N &nbsp;&nbsp;(p prime &gt; N, a ≢ 0)</div>
<div class="formula"><span class="lbl">MULTIPLICATIVE</span>h(k) = ⌊N · (k·A mod 1)⌋ &nbsp;&nbsp;(A ≈ 0.618, the golden ratio)</div>

<h3>Worked example — why N must be prime</h3>
<div class="out"><b>Table size N = 10, keys are prices ending in 0:</b> 100, 250, 370, 480, 990.<br>
h(k) = k mod 10 → every key hashes to <b>0</b>. All five collide; the table degenerates into one long chain and lookups become O(n).<br>
<b>Now N = 11 (prime):</b> 100 mod 11 = 1 · 250 mod 11 = 8 · 370 mod 11 = 7 · 480 mod 11 = 7 · 990 mod 11 = 0.<br>
One collision (370 and 480) instead of five. A prime modulus has no factors in common with the pattern in the data, so regular structure gets broken up.<br>
<b>Rule:</b> never use a table size that is a power of ten, and be careful with powers of two — <span class="badge">k mod 2^m</span> keeps only the low m bits and throws away all the high-bit information.</div>

<h3>Stage 1 — hash codes for compound objects</h3>
<pre><span class="tok-comment">// polynomial accumulation — what String.hashCode() does</span>
<span class="tok-type">int</span> h = 0;
<span class="tok-keyword">for</span> (<span class="tok-type">char</span> c : s.<span class="tok-function">toCharArray</span>()) h = 31 * h + c;

<span class="tok-comment">// for your own classes, let the JDK build it</span>
<span class="tok-keyword">@Override public int</span> <span class="tok-function">hashCode</span>() { <span class="tok-keyword">return</span> <span class="tok-type">Objects</span>.<span class="tok-function">hash</span>(id, name); }
<span class="tok-keyword">@Override public boolean</span> <span class="tok-function">equals</span>(<span class="tok-type">Object</span> o) {
    <span class="tok-keyword">if</span> (<span class="tok-keyword">this</span> == o) <span class="tok-keyword">return true</span>;
    <span class="tok-keyword">if</span> (!(o <span class="tok-keyword">instanceof</span> <span class="tok-type">Student</span> s)) <span class="tok-keyword">return false</span>;
    <span class="tok-keyword">return</span> id == s.id &amp;&amp; <span class="tok-type">Objects</span>.<span class="tok-function">equals</span>(name, s.name);
}</pre>
<div class="out"><b>Why the multiplier is 31.</b> It is an odd prime, so it does not throw away bits the way an even factor would, and the JVM turns <span class="badge">31*h</span> into <span class="badge">(h &lt;&lt; 5) − h</span> — a shift and a subtraction instead of a multiplication. Using a small even number such as 2 would push every character's contribution out of the top of the int within a few characters, so long strings would collide constantly.</div>

<h3>The contract you must not break</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>1. If a.equals(b) then a.hashCode() == b.hashCode().</b> Mandatory. Break it and a HashMap will store duplicates it cannot find.</div>
  <div class="lz-layer"><b>2. Equal hash codes do not imply equality.</b> That is just a collision, and it is normal.</div>
  <div class="lz-layer"><b>3. The hash code must not change while the object is a key in a map.</b> Mutating a field used by hashCode makes the entry unreachable — a genuine memory leak.</div>
</div>
<div class="out"><b>The classic bug, demonstrated:</b><br>
<span class="badge">Set&lt;Point&gt; s = new HashSet&lt;&gt;(); Point p = new Point(1,1); s.add(p);</span><br>
<span class="badge">p.x = 99; s.contains(p) → false</span> — and even <span class="badge">s.remove(p)</span> fails. The object is stored in the bucket computed from x = 1, but the search now goes to the bucket for x = 99. The element is in the set and unreachable at the same time. <b>Use immutable keys.</b></div>

<h3>What makes a hash function good</h3>
<table><thead><tr><th>Property</th><th>Why it matters</th></tr></thead><tbody>
<tr><td>Deterministic</td><td>the same key must always land in the same bucket</td></tr>
<tr><td>Uniform</td><td>spreads keys evenly → short chains</td></tr>
<tr><td>Fast</td><td>it runs on every get and put</td></tr>
<tr><td>Avalanche</td><td>one changed input bit flips about half the output bits</td></tr>
</tbody></table>

<div class="pitfall"><b>Overriding <span class="badge">equals</span> without overriding <span class="badge">hashCode</span> is the most common Java bug in this whole course.</b> Two objects that are equal then land in different buckets, so <span class="badge">map.get(key)</span> returns null even though the entry is right there. Always override both, and always from the same fields.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Hash flooding — when a hash table becomes a denial-of-service vector.</b> If an attacker knows your hash function, they can craft thousands of keys that all collide, turning every O(1) lookup into O(n) and freezing the server. This hit PHP, Java, Python and Ruby web frameworks in 2011 (CVE-2011-4815). The fix is a <em>randomised</em> hash seeded per process (SipHash), so the attacker cannot predict the buckets — which is why Java 8's HashMap also converts long chains into red-black trees, capping the damage at O(log n). <em>Beyond syllabus because the course treats collisions as a performance topic, while they are also a security topic.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Biến một khoá thành một chỉ số</h2>
<p class="lead">Băm có hai chặng: <strong>mã băm</strong> ánh xạ một đối tượng bất kỳ thành số nguyên, rồi <strong>hàm nén</strong> ép số nguyên đó về dải 0..N−1 của bảng. Cả hai chặng đều có thể phá nát hiệu năng nếu làm sai.</p>

<h3>Chặng 2 — ba hàm nén</h3>
<div class="formula"><span class="lbl">CHIA</span>h(k) = k mod N &nbsp;&nbsp;(chọn N là số nguyên tố)</div>
<div class="formula"><span class="lbl">NHÂN–CỘNG–CHIA (MAD)</span>h(k) = ((a·k + b) mod p) mod N &nbsp;&nbsp;(p nguyên tố &gt; N, a ≢ 0)</div>
<div class="formula"><span class="lbl">NHÂN</span>h(k) = ⌊N · (k·A mod 1)⌋ &nbsp;&nbsp;(A ≈ 0,618, tỉ lệ vàng)</div>

<h3>Ví dụ có lời giải — vì sao N phải là số nguyên tố</h3>
<div class="out"><b>Bảng cỡ N = 10, khoá là các mức giá kết thúc bằng 0:</b> 100, 250, 370, 480, 990.<br>
h(k) = k mod 10 → mọi khoá đều băm về <b>0</b>. Cả năm va chạm; bảng suy biến thành một dây xích dài và tra cứu thành O(n).<br>
<b>Giờ lấy N = 11 (nguyên tố):</b> 100 mod 11 = 1 · 250 mod 11 = 8 · 370 mod 11 = 7 · 480 mod 11 = 7 · 990 mod 11 = 0.<br>
Chỉ một va chạm (370 và 480) thay vì năm. Mô-đun nguyên tố không có ước chung với quy luật trong dữ liệu, nên cấu trúc đều đặn bị phá vỡ.<br>
<b>Quy tắc:</b> đừng bao giờ lấy cỡ bảng là luỹ thừa của mười, và hãy cẩn thận với luỹ thừa của hai — <span class="badge">k mod 2^m</span> chỉ giữ m bit thấp và vứt bỏ toàn bộ thông tin ở bit cao.</div>

<h3>Chặng 1 — mã băm cho đối tượng ghép</h3>
<pre><span class="tok-comment">// tích luỹ đa thức — đúng thứ String.hashCode() làm</span>
<span class="tok-type">int</span> h = 0;
<span class="tok-keyword">for</span> (<span class="tok-type">char</span> c : s.<span class="tok-function">toCharArray</span>()) h = 31 * h + c;

<span class="tok-comment">// với lớp của bạn, để JDK dựng hộ</span>
<span class="tok-keyword">@Override public int</span> <span class="tok-function">hashCode</span>() { <span class="tok-keyword">return</span> <span class="tok-type">Objects</span>.<span class="tok-function">hash</span>(id, name); }
<span class="tok-keyword">@Override public boolean</span> <span class="tok-function">equals</span>(<span class="tok-type">Object</span> o) {
    <span class="tok-keyword">if</span> (<span class="tok-keyword">this</span> == o) <span class="tok-keyword">return true</span>;
    <span class="tok-keyword">if</span> (!(o <span class="tok-keyword">instanceof</span> <span class="tok-type">Student</span> s)) <span class="tok-keyword">return false</span>;
    <span class="tok-keyword">return</span> id == s.id &amp;&amp; <span class="tok-type">Objects</span>.<span class="tok-function">equals</span>(name, s.name);
}</pre>
<div class="out"><b>Vì sao hệ số là 31.</b> Nó là số nguyên tố lẻ nên không vứt mất bit như một hệ số chẵn, và JVM biến <span class="badge">31*h</span> thành <span class="badge">(h &lt;&lt; 5) − h</span> — một phép dịch bit và một phép trừ thay cho phép nhân. Dùng một số chẵn nhỏ như 2 sẽ đẩy đóng góp của từng ký tự ra khỏi đầu kiểu int chỉ sau vài ký tự, khiến các chuỗi dài va chạm liên tục.</div>

<h3>Giao ước không được phép phá</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>1. Nếu a.equals(b) thì a.hashCode() == b.hashCode().</b> Bắt buộc. Phá điều này thì HashMap sẽ lưu các bản trùng mà chính nó không tìm lại được.</div>
  <div class="lz-layer"><b>2. Mã băm bằng nhau không suy ra hai đối tượng bằng nhau.</b> Đó chỉ là va chạm, và là chuyện bình thường.</div>
  <div class="lz-layer"><b>3. Mã băm không được đổi khi đối tượng đang làm khoá trong map.</b> Sửa một trường mà hashCode dùng sẽ khiến mục đó không thể với tới — một rò rỉ bộ nhớ thật sự.</div>
</div>
<div class="out"><b>Lỗi kinh điển, minh hoạ:</b><br>
<span class="badge">Set&lt;Point&gt; s = new HashSet&lt;&gt;(); Point p = new Point(1,1); s.add(p);</span><br>
<span class="badge">p.x = 99; s.contains(p) → false</span> — và cả <span class="badge">s.remove(p)</span> cũng thất bại. Đối tượng nằm ở rổ tính từ x = 1, nhưng phép tìm giờ đi tới rổ của x = 99. Phần tử vừa nằm trong tập vừa không thể với tới. <b>Hãy dùng khoá bất biến.</b></div>

<h3>Thế nào là một hàm băm tốt</h3>
<table><thead><tr><th>Tính chất</th><th>Vì sao quan trọng</th></tr></thead><tbody>
<tr><td>Tất định</td><td>cùng một khoá phải luôn rơi vào cùng một rổ</td></tr>
<tr><td>Phân bố đều</td><td>rải khoá đều → dây xích ngắn</td></tr>
<tr><td>Nhanh</td><td>nó chạy trong mọi lần get và put</td></tr>
<tr><td>Hiệu ứng tuyết lở</td><td>đổi một bit đầu vào làm lật khoảng một nửa số bit đầu ra</td></tr>
</tbody></table>

<div class="pitfall"><b>Ghi đè <span class="badge">equals</span> mà không ghi đè <span class="badge">hashCode</span> là lỗi Java phổ biến nhất trong cả môn này.</b> Hai đối tượng bằng nhau khi đó rơi vào hai rổ khác nhau, nên <span class="badge">map.get(key)</span> trả về null dù mục dữ liệu nằm ngay đó. Luôn ghi đè cả hai, và luôn từ cùng một bộ trường.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hash flooding — khi bảng băm trở thành lỗ hổng từ chối dịch vụ.</b> Nếu kẻ tấn công biết hàm băm của bạn, họ có thể chế ra hàng nghìn khoá cùng va chạm, biến mọi lần tra cứu O(1) thành O(n) và làm treo máy chủ. Chuyện này giáng xuống các framework web PHP, Java, Python và Ruby năm 2011 (CVE-2011-4815). Cách chữa là hàm băm <em>ngẫu nhiên hoá</em> với hạt giống riêng mỗi tiến trình (SipHash), khiến kẻ tấn công không đoán được rổ — và cũng vì thế HashMap của Java 8 chuyển các dây xích dài thành cây đỏ-đen, chặn thiệt hại ở O(log n). <em>Ngoài giáo trình vì môn học coi va chạm là chuyện hiệu năng, trong khi nó còn là chuyện an ninh.</em></div>
</div>
`,
        },
        {
          title: '7.3 — Collision handling in depth|||7.3 — Xử lý va chạm chuyên sâu',
          slug: 'csd201-va-cham',
          type: 'VIDEO',
          description: 'Chaining và bốn kiểu địa chỉ mở (linear/quadratic/double hashing), kèm bài toán xoá phần tử.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>Two families of answers to "that slot is taken"</h2>
<p class="lead">Collisions are not a bug — by the pigeonhole principle they are unavoidable once you map a large key space into a small table. What matters is the strategy for resolving them, and there are exactly two families.</p>

<h3>Family 1 — separate chaining</h3>
<p>Each slot holds a list (or, in Java 8+, a tree once the list grows past 8). Colliding keys simply join the list.</p>
<div class="diagram">bucket 0 → [ ]
bucket 1 → [ "Ann" ] → [ "Bob" ]        ← collided
bucket 2 → [ "Cara" ]
bucket 3 → [ ]</div>
<p>Simple, tolerates a load factor above 1, and deletion is trivial. Costs one node object per entry and follows pointers on every probe.</p>

<h3>Family 2 — open addressing (everything lives in the array)</h3>
<table><thead><tr><th>Scheme</th><th>Probe sequence</th><th>Problem</th></tr></thead><tbody>
<tr><td>Linear probing</td><td>h(k), h(k)+1, h(k)+2, …</td><td><b>primary clustering</b> — occupied runs merge and grow</td></tr>
<tr><td>Quadratic probing</td><td>h(k)+1², h(k)+2², h(k)+3², …</td><td>secondary clustering; may fail to find a free slot unless N is prime and the load factor &lt; 0.5</td></tr>
<tr><td>Double hashing</td><td>h(k) + i·h'(k)</td><td>best distribution; needs a second hash never equal to 0</td></tr>
</tbody></table>

<h3>Worked example — insert with linear probing</h3>
<div class="out"><b>Table N = 7, h(k) = k mod 7. Insert 15, 11, 27, 8, 12.</b><br>
15 mod 7 = 1 → slot 1 free → place. Table: [_, 15, _, _, _, _, _]<br>
11 mod 7 = 4 → free → place. [_, 15, _, _, 11, _, _]<br>
27 mod 7 = 6 → free → place. [_, 15, _, _, 11, _, 27]<br>
8 mod 7 = 1 → <b>taken by 15</b> → probe 2 → free → place. [_, 15, 8, _, 11, _, 27]<br>
12 mod 7 = 5 → free → place. [_, 15, 8, _, 11, 12, 27]<br>
<b>Now search for 22:</b> 22 mod 7 = 1 → slot 1 holds 15, not 22 → probe 2 → holds 8 → probe 3 → <b>empty → 22 is not present</b>. The search stops at the first empty slot, which is exactly why deletion is a problem.</div>

<h3>The deletion problem — and tombstones</h3>
<div class="out"><b>Delete 15 from slot 1 by clearing it:</b> [_, _, 8, _, 11, 12, 27].<br>
Now search for 8: 8 mod 7 = 1 → slot 1 is <b>empty</b> → conclude "not found" — <b>wrong</b>, 8 is sitting in slot 2. Clearing the slot broke the probe chain of every key that ever passed through it.<br>
<b>Fix — the tombstone:</b> mark the slot DELETED rather than EMPTY. A search continues past a tombstone; an insert may reuse it. The cost is that tombstones accumulate and slow searches down, so the table must be rehashed periodically.</div>

<h3>Choosing between them</h3>
<table><thead><tr><th></th><th>Chaining</th><th>Open addressing</th></tr></thead><tbody>
<tr><td>Load factor α</td><td>can exceed 1</td><td>must stay &lt; 1 (ideally ≤ 0.7)</td></tr>
<tr><td>Memory</td><td>array + one node per entry</td><td>array only — <b>compact</b></td></tr>
<tr><td>Cache behaviour</td><td>poor (pointer chasing)</td><td><b>excellent</b> (contiguous probing)</td></tr>
<tr><td>Deletion</td><td><b>trivial</b></td><td>needs tombstones</td></tr>
<tr><td>Used by</td><td>Java HashMap</td><td>Python dict, Go maps, C++ dense_hash</td></tr>
</tbody></table>

<div class="pitfall"><b>Quadratic probing can fail even when the table is not full.</b> The probe sequence only reaches about half the slots unless N is prime and α &lt; 0.5. An insert can then loop forever while free slots exist. Always guard the loop with a probe counter.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Robin Hood hashing evens out the pain.</b> On a collision, compare how far each key has travelled from its home slot; if the incoming key has travelled further than the resident one, they swap places — the "rich" entry gives way to the "poor" one. This dramatically shrinks the <em>variance</em> of probe lengths, so worst-case lookups approach the average. Rust's standard HashMap used it for years, and cuckoo hashing goes further still with a guaranteed O(1) worst case using two tables and two hash functions. <em>Beyond syllabus because the course presents only the three textbook probe sequences, while modern hash tables are built around controlling the tail of the distribution, not the mean.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Hai họ câu trả lời cho tình huống "ô đó có người rồi"</h2>
<p class="lead">Va chạm không phải lỗi — theo nguyên lý chuồng bồ câu, chúng là không tránh khỏi khi ánh xạ một không gian khoá lớn vào một bảng nhỏ. Điều quan trọng là chiến lược giải quyết, và có đúng hai họ.</p>

<h3>Họ 1 — dây xích riêng (separate chaining)</h3>
<p>Mỗi ô giữ một danh sách (hoặc, từ Java 8, một cây khi danh sách vượt quá 8 phần tử). Các khoá va chạm chỉ việc nối vào danh sách.</p>
<div class="diagram">rổ 0 → [ ]
rổ 1 → [ "Ann" ] → [ "Bob" ]        ← va chạm
rổ 2 → [ "Cara" ]
rổ 3 → [ ]</div>
<p>Đơn giản, chịu được hệ số tải lớn hơn 1, và xoá thì cực dễ. Đổi lại tốn một đối tượng nút cho mỗi mục và phải lần theo con trỏ ở mọi lần dò.</p>

<h3>Họ 2 — địa chỉ mở (mọi thứ nằm trong mảng)</h3>
<table><thead><tr><th>Cách</th><th>Dãy dò</th><th>Vấn đề</th></tr></thead><tbody>
<tr><td>Dò tuyến tính</td><td>h(k), h(k)+1, h(k)+2, …</td><td><b>vón cục sơ cấp</b> — các đoạn đã lấp dính vào nhau và dài ra</td></tr>
<tr><td>Dò bậc hai</td><td>h(k)+1², h(k)+2², h(k)+3², …</td><td>vón cục thứ cấp; có thể không tìm được ô trống nếu N không nguyên tố và hệ số tải ≥ 0,5</td></tr>
<tr><td>Băm kép</td><td>h(k) + i·h'(k)</td><td>phân bố tốt nhất; cần hàm băm thứ hai không bao giờ bằng 0</td></tr>
</tbody></table>

<h3>Ví dụ có lời giải — chèn với dò tuyến tính</h3>
<div class="out"><b>Bảng N = 7, h(k) = k mod 7. Chèn 15, 11, 27, 8, 12.</b><br>
15 mod 7 = 1 → ô 1 trống → đặt. Bảng: [_, 15, _, _, _, _, _]<br>
11 mod 7 = 4 → trống → đặt. [_, 15, _, _, 11, _, _]<br>
27 mod 7 = 6 → trống → đặt. [_, 15, _, _, 11, _, 27]<br>
8 mod 7 = 1 → <b>đã có 15</b> → dò sang 2 → trống → đặt. [_, 15, 8, _, 11, _, 27]<br>
12 mod 7 = 5 → trống → đặt. [_, 15, 8, _, 11, 12, 27]<br>
<b>Giờ tìm 22:</b> 22 mod 7 = 1 → ô 1 chứa 15, không phải 22 → dò 2 → chứa 8 → dò 3 → <b>trống → kết luận 22 không có</b>. Phép tìm dừng ở ô trống đầu tiên, và đó chính là lý do việc xoá gây rắc rối.</div>

<h3>Bài toán xoá — và bia mộ (tombstone)</h3>
<div class="out"><b>Xoá 15 khỏi ô 1 bằng cách để trống ô đó:</b> [_, _, 8, _, 11, 12, 27].<br>
Giờ tìm 8: 8 mod 7 = 1 → ô 1 <b>trống</b> → kết luận "không tìm thấy" — <b>sai</b>, 8 đang nằm ở ô 2. Việc xoá trắng ô đã cắt đứt dãy dò của mọi khoá từng đi qua nó.<br>
<b>Cách chữa — bia mộ:</b> đánh dấu ô là ĐÃ XOÁ thay vì TRỐNG. Phép tìm đi tiếp qua bia mộ; phép chèn được phép dùng lại ô đó. Cái giá là bia mộ tích tụ dần làm phép tìm chậm đi, nên bảng phải được băm lại định kỳ.</div>

<h3>Chọn giữa hai họ</h3>
<table><thead><tr><th></th><th>Dây xích</th><th>Địa chỉ mở</th></tr></thead><tbody>
<tr><td>Hệ số tải α</td><td>có thể vượt 1</td><td>phải &lt; 1 (lý tưởng ≤ 0,7)</td></tr>
<tr><td>Bộ nhớ</td><td>mảng + một nút mỗi mục</td><td>chỉ mảng — <b>gọn</b></td></tr>
<tr><td>Ứng xử với cache</td><td>kém (đuổi theo con trỏ)</td><td><b>rất tốt</b> (dò liền khối)</td></tr>
<tr><td>Xoá</td><td><b>rất dễ</b></td><td>cần bia mộ</td></tr>
<tr><td>Được dùng bởi</td><td>HashMap của Java</td><td>dict của Python, map của Go, dense_hash của C++</td></tr>
</tbody></table>

<div class="pitfall"><b>Dò bậc hai có thể thất bại ngay cả khi bảng chưa đầy.</b> Dãy dò chỉ với tới khoảng một nửa số ô trừ khi N nguyên tố và α &lt; 0,5. Khi đó một phép chèn có thể lặp vô tận trong lúc vẫn còn ô trống. Luôn chặn vòng lặp bằng một bộ đếm số lần dò.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Băm Robin Hood san đều nỗi đau.</b> Khi va chạm, so xem mỗi khoá đã đi bao xa khỏi ô nhà của nó; nếu khoá mới tới đã đi xa hơn khoá đang ngồi đó thì hai bên đổi chỗ — mục "giàu" nhường cho mục "nghèo". Cách này thu hẹp mạnh <em>phương sai</em> của độ dài dò, nên tra cứu xấu nhất tiệm cận mức trung bình. HashMap chuẩn của Rust dùng nó nhiều năm, còn băm cuckoo còn đi xa hơn với O(1) xấu nhất đảm bảo nhờ hai bảng và hai hàm băm. <em>Ngoài giáo trình vì môn học chỉ trình bày ba dãy dò kinh điển, trong khi bảng băm hiện đại được thiết kế quanh việc kiểm soát cái đuôi của phân bố chứ không phải giá trị trung bình.</em></div>
</div>
`,
        },
        {
          title: '7.4 — Load factor, rehashing & Java HashMap|||7.4 — Hệ số tải, rehash & HashMap trong Java',
          slug: 'csd201-load-factor',
          type: 'VIDEO',
          description: 'Công thức số lần dò kỳ vọng, khi nào phải nở bảng, và ruột HashMap của Java 8 (treeify).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>The number that decides whether your hash table is O(1)</h2>
<div class="formula"><span class="lbl">LOAD FACTOR</span>α = n / N &nbsp;&nbsp;(entries ÷ buckets)</div>
<p class="lead">Everything about hash-table performance follows from α. Hashing is only "O(1)" while α stays bounded — which is why every real implementation resizes itself.</p>

<h3>Expected probes as a function of α</h3>
<div class="formula"><span class="lbl">CHAINING</span>average chain length = α &nbsp;·&nbsp; unsuccessful search ≈ 1 + α</div>
<div class="formula"><span class="lbl">LINEAR PROBING</span>successful ≈ ½(1 + 1/(1−α)) &nbsp;·&nbsp; unsuccessful ≈ ½(1 + 1/(1−α)²)</div>
<div class="out"><b>Plug in the numbers for linear probing:</b><br>
α = 0.5 → successful ≈ 1.5 probes, unsuccessful ≈ 2.5<br>
α = 0.75 → successful ≈ 2.5, unsuccessful ≈ 8.5<br>
α = 0.9 → successful ≈ 5.5, unsuccessful ≈ <b>50.5</b><br>
α = 0.99 → unsuccessful ≈ <b>5000</b> probes<br>
<b>Read the shape:</b> the cost is flat until roughly α = 0.7 and then explodes, because 1/(1−α)² blows up as α approaches 1. That is exactly why 0.75 is the default threshold in Java: the last comfortable point before the cliff.</div>

<h3>Rehashing — doubling the table</h3>
<pre><span class="tok-keyword">void</span> <span class="tok-function">rehash</span>() {
    Entry[] old = table;
    table = <span class="tok-keyword">new</span> Entry[old.length * 2];      <span class="tok-comment">// or the next prime</span>
    size = 0;
    <span class="tok-keyword">for</span> (Entry e : old)
        <span class="tok-keyword">if</span> (e != <span class="tok-keyword">null</span> &amp;&amp; !e.deleted) <span class="tok-function">put</span>(e.key, e.value);   <span class="tok-comment">// re-hash EVERY key</span>
}</pre>
<p>You cannot copy the slots across: the index depends on N, so every key must be hashed again. One rehash costs O(n), but because the table doubles, the cost <em>amortises</em> to O(1) per insertion — the same geometric argument as ArrayList growth in lesson 1.4.</p>

<h3>Worked example — total cost of 1,000 insertions</h3>
<div class="out">Start with N = 16, threshold 0.75 → resize at 12, 24, 48, 96, 192, 384, 768 entries.<br>
Work spent on rehashing = 12 + 24 + 48 + 96 + 192 + 384 + 768 = <b>1,524 re-insertions</b> for 1,000 inserts — under 2 per element, a constant.<br>
<b>If instead you grew by +1 slot each time:</b> 1 + 2 + 3 + … + 1000 ≈ <b>500,000</b> re-insertions. Doubling versus incrementing is the difference between amortised O(1) and O(n) per insert.<br>
<b>Practical tip:</b> if you know the final size, pre-size the map — <span class="badge">new HashMap&lt;&gt;(expected / 0.75 + 1)</span> — and you skip every rehash.</div>

<h3>Inside Java's HashMap (8+)</h3>
<table><thead><tr><th>Detail</th><th>Value / behaviour</th></tr></thead><tbody>
<tr><td>Default capacity</td><td>16, always a power of two</td></tr>
<tr><td>Index computation</td><td><span class="badge">(n − 1) &amp; hash</span> — a bitmask, no division</td></tr>
<tr><td>Hash spreading</td><td><span class="badge">h ^ (h &gt;&gt;&gt; 16)</span> mixes the high bits into the low ones</td></tr>
<tr><td>Default load factor</td><td>0.75</td></tr>
<tr><td>Collision structure</td><td>linked list; converts to a <b>red-black tree</b> at 8 nodes in one bucket (and back to a list below 6)</td></tr>
<tr><td>Worst-case lookup</td><td>O(log n) thanks to treeify, instead of O(n)</td></tr>
</tbody></table>
<p>The power-of-two size is why the extra spreading step exists: masking keeps only the low bits, so without mixing, two keys differing only in their high bits would always collide.</p>

<div class="pitfall"><b>Resizing is not free at the wrong moment.</b> A rehash of a large map is a single O(n) pause — in a latency-sensitive service that shows up as a spike. Pre-size maps you expect to fill, and never let an unbounded cache grow into a map that rehashes during peak traffic.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Consistent hashing — resizing without rehashing everything.</b> In a distributed cache, adding one server should not invalidate every key. Consistent hashing places servers and keys on a ring; a key belongs to the next server clockwise, so adding a node only moves the keys in one arc — about 1/N of them instead of all of them. Redis Cluster, DynamoDB, Cassandra and every CDN use it. <em>Beyond syllabus because CSD201 studies a hash table inside one process, while the same maths at cluster scale is the difference between a smooth deploy and a total cache stampede.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Con số quyết định bảng băm của bạn có thật sự O(1) hay không</h2>
<div class="formula"><span class="lbl">HỆ SỐ TẢI</span>α = n / N &nbsp;&nbsp;(số mục ÷ số rổ)</div>
<p class="lead">Mọi thứ về hiệu năng bảng băm đều suy ra từ α. Băm chỉ "O(1)" chừng nào α còn bị chặn — và đó là lý do mọi cài đặt thật đều tự nở bảng.</p>

<h3>Số lần dò kỳ vọng theo α</h3>
<div class="formula"><span class="lbl">DÂY XÍCH</span>độ dài xích trung bình = α &nbsp;·&nbsp; tìm không thấy ≈ 1 + α</div>
<div class="formula"><span class="lbl">DÒ TUYẾN TÍNH</span>tìm thấy ≈ ½(1 + 1/(1−α)) &nbsp;·&nbsp; tìm không thấy ≈ ½(1 + 1/(1−α)²)</div>
<div class="out"><b>Thay số cho dò tuyến tính:</b><br>
α = 0,5 → tìm thấy ≈ 1,5 lần dò, không thấy ≈ 2,5<br>
α = 0,75 → tìm thấy ≈ 2,5, không thấy ≈ 8,5<br>
α = 0,9 → tìm thấy ≈ 5,5, không thấy ≈ <b>50,5</b><br>
α = 0,99 → không thấy ≈ <b>5000</b> lần dò<br>
<b>Đọc hình dạng:</b> chi phí gần như phẳng tới khoảng α = 0,7 rồi bùng nổ, vì 1/(1−α)² tăng vọt khi α tiến tới 1. Đó đúng là lý do ngưỡng mặc định trong Java là 0,75: điểm dễ chịu cuối cùng trước vách đá.</div>

<h3>Rehash — nhân đôi bảng</h3>
<pre><span class="tok-keyword">void</span> <span class="tok-function">rehash</span>() {
    Entry[] old = table;
    table = <span class="tok-keyword">new</span> Entry[old.length * 2];      <span class="tok-comment">// hoặc số nguyên tố kế tiếp</span>
    size = 0;
    <span class="tok-keyword">for</span> (Entry e : old)
        <span class="tok-keyword">if</span> (e != <span class="tok-keyword">null</span> &amp;&amp; !e.deleted) <span class="tok-function">put</span>(e.key, e.value);   <span class="tok-comment">// băm lại MỌI khoá</span>
}</pre>
<p>Không thể chép nguyên các ô sang: chỉ số phụ thuộc vào N, nên mọi khoá đều phải băm lại. Một lần rehash tốn O(n), nhưng vì bảng nhân đôi nên chi phí được <em>khấu hao</em> về O(1) mỗi lần chèn — đúng lập luận cấp số nhân như phép nở của ArrayList ở bài 1.4.</p>

<h3>Ví dụ có lời giải — tổng chi phí cho 1.000 lần chèn</h3>
<div class="out">Bắt đầu N = 16, ngưỡng 0,75 → nở bảng tại 12, 24, 48, 96, 192, 384, 768 mục.<br>
Công dành cho rehash = 12 + 24 + 48 + 96 + 192 + 384 + 768 = <b>1.524 lần chèn lại</b> cho 1.000 lần chèn — chưa tới 2 lần mỗi phần tử, tức một hằng số.<br>
<b>Nếu thay vào đó mỗi lần chỉ nở thêm 1 ô:</b> 1 + 2 + 3 + … + 1000 ≈ <b>500.000</b> lần chèn lại. Nhân đôi so với cộng thêm là khác biệt giữa O(1) khấu hao và O(n) mỗi lần chèn.<br>
<b>Mẹo thực dụng:</b> nếu biết trước cỡ cuối, hãy cấp phát sẵn — <span class="badge">new HashMap&lt;&gt;(số_dự_kiến / 0.75 + 1)</span> — và bạn bỏ qua được mọi lần rehash.</div>

<h3>Bên trong HashMap của Java (8 trở lên)</h3>
<table><thead><tr><th>Chi tiết</th><th>Giá trị / hành vi</th></tr></thead><tbody>
<tr><td>Sức chứa mặc định</td><td>16, luôn là luỹ thừa của hai</td></tr>
<tr><td>Cách tính chỉ số</td><td><span class="badge">(n − 1) &amp; hash</span> — mặt nạ bit, không có phép chia</td></tr>
<tr><td>Trộn mã băm</td><td><span class="badge">h ^ (h &gt;&gt;&gt; 16)</span> pha bit cao xuống bit thấp</td></tr>
<tr><td>Hệ số tải mặc định</td><td>0,75</td></tr>
<tr><td>Cấu trúc va chạm</td><td>danh sách liên kết; chuyển thành <b>cây đỏ-đen</b> khi một rổ có 8 nút (và quay lại danh sách khi dưới 6)</td></tr>
<tr><td>Tra cứu xấu nhất</td><td>O(log n) nhờ treeify, thay vì O(n)</td></tr>
</tbody></table>
<p>Kích thước luỹ thừa hai chính là lý do phải có bước trộn bit thêm: mặt nạ chỉ giữ các bit thấp, nên nếu không trộn, hai khoá chỉ khác nhau ở bit cao sẽ luôn va chạm.</p>

<div class="pitfall"><b>Nở bảng không miễn phí nếu rơi vào lúc xấu.</b> Rehash một map lớn là một khoảng dừng O(n) — trong dịch vụ nhạy cảm độ trễ, nó hiện lên thành một gai đột biến. Hãy cấp phát sẵn cho các map bạn biết sẽ đầy, và đừng để một cache không giới hạn phình thành map rehash ngay giờ cao điểm.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Băm nhất quán — nở bảng mà không phải băm lại toàn bộ.</b> Trong một cache phân tán, thêm một máy chủ không nên làm vô hiệu mọi khoá. Băm nhất quán đặt máy chủ và khoá lên một vòng tròn; một khoá thuộc về máy chủ kế tiếp theo chiều kim đồng hồ, nên thêm một nút chỉ dời các khoá trong một cung — khoảng 1/N số khoá thay vì tất cả. Redis Cluster, DynamoDB, Cassandra và mọi CDN đều dùng nó. <em>Ngoài giáo trình vì CSD201 nghiên cứu bảng băm bên trong một tiến trình, trong khi cùng phép toán đó ở quy mô cụm máy là ranh giới giữa một lần triển khai êm ả và một cơn giẫm đạp cache toàn hệ thống.</em></div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 8 — XỬ LÝ VĂN BẢN ══════════════════ */
    {
      title: 'Chapter 8 — Text Processing|||Chương 8 — Xử lý văn bản',
      description: 'Nén dữ liệu và thuật toán trên chuỗi: Huffman, LZW, run-length encoding.',
      lessons: [
        {
          title: '8.1 — Compression: Huffman, LZW, RLE|||8.1 — Nén: Huffman, LZW, RLE',
          slug: 'csd201-nen-van-ban',
          type: 'VIDEO',
          description: 'Ba thuật toán nén kinh điển: mã Huffman theo tần suất, LZW theo từ điển, RLE theo chuỗi lặp.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Text processing &amp; compression</h2>
<p class="lead">The final CLO applies your structures to real text problems — mostly compression, which shrinks data by exploiting patterns. Three classics:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Huffman coding</b> — assign short bit-codes to frequent characters, long ones to rare ones, using a <span class="badge">priority queue</span> to build the code tree. Optimal prefix code.</div>
  <div class="lz-layer"><b>LZW</b> — build a <span class="badge">dictionary</span> of repeated substrings on the fly; used in GIF and old ZIP.</div>
  <div class="lz-layer"><b>Run-length encoding (RLE)</b> — replace runs of the same symbol with a count: <span class="badge">AAAB → 3A1B</span>. Great for images with flat regions.</div>
</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Huffman is optimal — but only among prefix codes.</b> Huffman coding provably produces the best possible per-symbol prefix code, yet it must spend a whole number of bits per symbol, so it can't beat Shannon's entropy limit when the ideal code length is a fraction of a bit. Arithmetic (and modern range/ANS) coding encodes an entire message as one number and gets arbitrarily close to the entropy bound, which is why it underlies formats like JPEG and modern compressors. <em>The course presents Huffman as "optimal" without the caveat that a different model beats it in practice.</em></div>
<div class="note-ct">Notice how these reuse everything you learned: Huffman needs a heap and a tree; LZW needs a hash map. Data structures are the building blocks, not the destination.</div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms#module-807" target="_blank" rel="noopener">
  <span class="lc-ico">🗜️</span>
  <span class="lc-body"><span class="lc-title">Practise: string algorithms</span><span class="lc-sub">Tries &amp; String Algorithms module.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Xử lý văn bản &amp; nén</h2>
<p class="lead">CLO cuối áp dụng các cấu trúc của bạn vào bài toán văn bản thật — chủ yếu là nén, thu nhỏ dữ liệu bằng cách khai thác mẫu. Ba thuật toán kinh điển:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Mã Huffman</b> — gán mã bit ngắn cho ký tự hay xuất hiện, mã dài cho ký tự hiếm, dùng <span class="badge">hàng đợi ưu tiên</span> để dựng cây mã. Mã tiền tố tối ưu.</div>
  <div class="lz-layer"><b>LZW</b> — dựng <span class="badge">từ điển</span> các chuỗi con lặp lại ngay khi chạy; dùng trong GIF và ZIP cũ.</div>
  <div class="lz-layer"><b>Run-length encoding (RLE)</b> — thay chuỗi ký tự lặp bằng số đếm: <span class="badge">AAAB → 3A1B</span>. Tốt cho ảnh có vùng phẳng.</div>
</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Huffman là tối ưu — nhưng chỉ trong lớp mã tiền tố.</b> Mã Huffman chứng minh được là cho mã tiền tố tốt nhất trên mỗi ký hiệu, nhưng nó phải dùng số bit nguyên cho mỗi ký hiệu, nên không thể vượt giới hạn entropy của Shannon khi độ dài mã lý tưởng là một phần lẻ của bit. Mã số học (và range/ANS hiện đại) mã hóa cả một thông điệp thành một con số duy nhất và tiến sát tùy ý tới cận entropy, nên nó là nền của các định dạng như JPEG và các bộ nén hiện đại. <em>Môn học trình bày Huffman là "tối ưu" mà không kèm lưu ý rằng một mô hình khác thắng nó trong thực tế.</em></div>
<div class="note-ct">Để ý các thuật toán này tái dùng mọi thứ bạn đã học: Huffman cần heap và cây; LZW cần hash map. Cấu trúc dữ liệu là viên gạch, không phải đích đến.</div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms#module-807" target="_blank" rel="noopener">
  <span class="lc-ico">🗜️</span>
  <span class="lc-body"><span class="lc-title">Luyện: thuật toán chuỗi</span><span class="lc-sub">Module Tries &amp; String Algorithms.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '8.2 — Pattern matching: brute force & KMP|||8.2 — So khớp mẫu: vét cạn & KMP',
          slug: 'csd201-kmp',
          type: 'VIDEO',
          description: 'Vì sao vét cạn tốn O(n·m), mảng thất bại của KMP dựng từng bước, và cách KMP không bao giờ lùi lại.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Finding a pattern in a text — twice, badly then well</h2>
<p class="lead">Given a text T of length n and a pattern P of length m, where does P occur? The obvious algorithm re-examines characters it has already read. Knuth–Morris–Pratt never does — and that single idea takes it from O(n·m) to O(n + m).</p>

<h3>Brute force — and its worst case</h3>
<pre><span class="tok-type">int</span> <span class="tok-function">bruteForce</span>(<span class="tok-type">String</span> t, <span class="tok-type">String</span> p) {
    <span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = 0; i &lt;= t.<span class="tok-function">length</span>() - p.<span class="tok-function">length</span>(); i++) {
        <span class="tok-type">int</span> j = 0;
        <span class="tok-keyword">while</span> (j &lt; p.<span class="tok-function">length</span>() &amp;&amp; t.<span class="tok-function">charAt</span>(i+j) == p.<span class="tok-function">charAt</span>(j)) j++;
        <span class="tok-keyword">if</span> (j == p.<span class="tok-function">length</span>()) <span class="tok-keyword">return</span> i;      <span class="tok-comment">// full match at i</span>
    }
    <span class="tok-keyword">return</span> -1;
}</pre>
<div class="out"><b>Worst case:</b> T = "aaaaaaaaab" (n = 10), P = "aaaab" (m = 5).<br>
At i = 0 the inner loop matches a,a,a,a then fails on b → 5 comparisons wasted.<br>
At i = 1 the same thing happens. And at i = 2, 3, 4, 5 …<br>
Total ≈ (n − m + 1) × m = <b>O(n·m)</b>. Every restart re-reads characters the algorithm already knows are 'a'.<br>
<b>Average text is kinder</b> (a mismatch usually happens on the first character), which is why brute force survives in practice — but the worst case is real and easy to trigger.</div>

<h3>KMP's insight — remember the prefix you already matched</h3>
<p>When P fails at position j, the first j characters of P <em>did</em> match. If a proper prefix of those j characters is also a suffix of them, that prefix is already aligned with the text — so instead of restarting at j = 0, jump to the length of that longest border. The precomputed table of border lengths is the <strong>failure function</strong>.</p>

<h3>Worked example — build the failure table for P = "ABABAC"</h3>
<div class="out"><b>fail[j] = length of the longest proper prefix of P[0..j] that is also a suffix.</b><br>
j=0 'A' → no proper prefix → <b>0</b><br>
j=1 "AB" → prefixes A; suffixes B → no match → <b>0</b><br>
j=2 "ABA" → prefix "A" = suffix "A" ✓ → <b>1</b><br>
j=3 "ABAB" → prefix "AB" = suffix "AB" ✓ → <b>2</b><br>
j=4 "ABABA" → prefix "ABA" = suffix "ABA" ✓ → <b>3</b><br>
j=5 "ABABAC" → "ABABA" vs "BABAC" ✗ … no border → <b>0</b><br>
<b>fail = [0, 0, 1, 2, 3, 0]</b></div>

<h3>Worked example — search with that table</h3>
<div class="out"><b>T = "ABABABACA", P = "ABABAC".</b><br>
i=0..4: A,B,A,B,A match → j = 5. T[5] = 'B' vs P[5] = 'C' → <b>mismatch</b>.<br>
Instead of restarting, look up fail[4] = 3 → set j = 3 and <em>keep i where it is</em>. This means "I already know P[0..2] = 'ABA' is aligned here".<br>
Compare T[5]='B' with P[3]='B' ✓ → j = 4 · T[6]='A' vs P[4]='A' ✓ → j = 5 · T[7]='C' vs P[5]='C' ✓ → j = 6 = m → <b>match found at index 7 − 6 + 1 = 2</b>.<br>
<b>Count:</b> the text index i never went backwards, so each character of T is examined at most twice → <b>O(n + m)</b> in total.</div>

<h3>Comparison</h3>
<table><thead><tr><th>Algorithm</th><th>Preprocess</th><th>Search</th><th>Note</th></tr></thead><tbody>
<tr><td>Brute force</td><td>—</td><td>O(n·m)</td><td>fine for short patterns, no memory</td></tr>
<tr><td><b>KMP</b></td><td>O(m)</td><td><b>O(n + m)</b></td><td>never backs up in the text — ideal for streams</td></tr>
<tr><td>Boyer–Moore</td><td>O(m + Σ)</td><td>O(n/m) best</td><td>scans the pattern right-to-left; what <span class="badge">grep</span> uses</td></tr>
<tr><td>Rabin–Karp</td><td>O(m)</td><td>O(n + m) expected</td><td>rolling hash; best for multi-pattern search</td></tr>
</tbody></table>

<div class="pitfall"><b>fail[j] must be a <em>proper</em> prefix — strictly shorter than the substring itself.</b> Otherwise the table for "AAAA" would be [1,2,3,4], j would never decrease on a mismatch, and the search would loop forever. The correct table is [0,1,2,3].</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The failure function solves problems that have nothing to do with searching.</b> It answers "what is the longest border of every prefix?", which immediately gives you the shortest repeating unit of a string (n − fail[n−1] when it divides n), the number of occurrences of every prefix, and — via the Z-algorithm, its twin — fast string periodicity tests. It is also the seed of the Aho–Corasick automaton, which matches thousands of patterns in one pass and drives antivirus scanners and intrusion-detection systems. <em>Beyond syllabus because the course presents the table as a KMP implementation detail, while it is a general string-structure tool.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Tìm một mẫu trong văn bản — hai lần, dở trước rồi hay sau</h2>
<p class="lead">Cho văn bản T dài n và mẫu P dài m, P xuất hiện ở đâu? Thuật toán hiển nhiên đọc lại những ký tự nó đã đọc rồi. Knuth–Morris–Pratt không bao giờ làm thế — và chỉ ý tưởng đó đưa nó từ O(n·m) xuống O(n + m).</p>

<h3>Vét cạn — và trường hợp xấu nhất của nó</h3>
<pre><span class="tok-type">int</span> <span class="tok-function">bruteForce</span>(<span class="tok-type">String</span> t, <span class="tok-type">String</span> p) {
    <span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = 0; i &lt;= t.<span class="tok-function">length</span>() - p.<span class="tok-function">length</span>(); i++) {
        <span class="tok-type">int</span> j = 0;
        <span class="tok-keyword">while</span> (j &lt; p.<span class="tok-function">length</span>() &amp;&amp; t.<span class="tok-function">charAt</span>(i+j) == p.<span class="tok-function">charAt</span>(j)) j++;
        <span class="tok-keyword">if</span> (j == p.<span class="tok-function">length</span>()) <span class="tok-keyword">return</span> i;      <span class="tok-comment">// khớp trọn tại i</span>
    }
    <span class="tok-keyword">return</span> -1;
}</pre>
<div class="out"><b>Trường hợp xấu nhất:</b> T = "aaaaaaaaab" (n = 10), P = "aaaab" (m = 5).<br>
Tại i = 0, vòng trong khớp a,a,a,a rồi hỏng ở b → phí 5 phép so sánh.<br>
Tại i = 1 chuyện y hệt lặp lại. Và tại i = 2, 3, 4, 5 …<br>
Tổng ≈ (n − m + 1) × m = <b>O(n·m)</b>. Mỗi lần khởi động lại là một lần đọc lại những ký tự mà thuật toán đã biết là 'a'.<br>
<b>Văn bản trung bình thì tử tế hơn</b> (thường lệch ngay ký tự đầu), nên vét cạn vẫn sống được trong thực tế — nhưng trường hợp xấu nhất là có thật và rất dễ kích hoạt.</div>

<h3>Tia sáng của KMP — nhớ lấy phần tiền tố đã khớp</h3>
<p>Khi P hỏng ở vị trí j, thì j ký tự đầu của P <em>đã</em> khớp. Nếu một tiền tố thực sự của j ký tự đó cũng đồng thời là hậu tố của chúng, thì tiền tố ấy đã nằm sẵn đúng chỗ trong văn bản — nên thay vì quay về j = 0, hãy nhảy tới độ dài của biên dài nhất đó. Bảng độ dài biên tính sẵn chính là <strong>hàm thất bại</strong>.</p>

<h3>Ví dụ có lời giải — dựng bảng thất bại cho P = "ABABAC"</h3>
<div class="out"><b>fail[j] = độ dài tiền tố thực sự dài nhất của P[0..j] mà đồng thời là hậu tố.</b><br>
j=0 'A' → không có tiền tố thực sự → <b>0</b><br>
j=1 "AB" → tiền tố A; hậu tố B → không khớp → <b>0</b><br>
j=2 "ABA" → tiền tố "A" = hậu tố "A" ✓ → <b>1</b><br>
j=3 "ABAB" → tiền tố "AB" = hậu tố "AB" ✓ → <b>2</b><br>
j=4 "ABABA" → tiền tố "ABA" = hậu tố "ABA" ✓ → <b>3</b><br>
j=5 "ABABAC" → "ABABA" với "BABAC" ✗ … không có biên → <b>0</b><br>
<b>fail = [0, 0, 1, 2, 3, 0]</b></div>

<h3>Ví dụ có lời giải — tìm kiếm với bảng đó</h3>
<div class="out"><b>T = "ABABABACA", P = "ABABAC".</b><br>
i=0..4: A,B,A,B,A khớp → j = 5. T[5] = 'B' với P[5] = 'C' → <b>lệch</b>.<br>
Thay vì khởi động lại, tra fail[4] = 3 → đặt j = 3 và <em>giữ nguyên i</em>. Nghĩa là "tôi đã biết P[0..2] = 'ABA' đang nằm khớp ở đây".<br>
So T[5]='B' với P[3]='B' ✓ → j = 4 · T[6]='A' với P[4]='A' ✓ → j = 5 · T[7]='C' với P[5]='C' ✓ → j = 6 = m → <b>tìm thấy tại chỉ số 7 − 6 + 1 = 2</b>.<br>
<b>Đếm công:</b> chỉ số văn bản i không bao giờ lùi lại, nên mỗi ký tự của T bị xem xét nhiều nhất hai lần → tổng <b>O(n + m)</b>.</div>

<h3>So sánh</h3>
<table><thead><tr><th>Thuật toán</th><th>Tiền xử lý</th><th>Tìm kiếm</th><th>Ghi chú</th></tr></thead><tbody>
<tr><td>Vét cạn</td><td>—</td><td>O(n·m)</td><td>ổn với mẫu ngắn, không tốn bộ nhớ</td></tr>
<tr><td><b>KMP</b></td><td>O(m)</td><td><b>O(n + m)</b></td><td>không bao giờ lùi trong văn bản — lý tưởng cho luồng dữ liệu</td></tr>
<tr><td>Boyer–Moore</td><td>O(m + Σ)</td><td>O(n/m) tốt nhất</td><td>quét mẫu từ phải sang trái; thứ <span class="badge">grep</span> dùng</td></tr>
<tr><td>Rabin–Karp</td><td>O(m)</td><td>O(n + m) kỳ vọng</td><td>băm cuốn chiếu; hợp nhất khi tìm nhiều mẫu</td></tr>
</tbody></table>

<div class="pitfall"><b>fail[j] phải là tiền tố <em>thực sự</em> — ngắn hơn hẳn chính xâu con đó.</b> Nếu không, bảng của "AAAA" sẽ là [1,2,3,4], j không bao giờ giảm khi lệch, và phép tìm lặp vô tận. Bảng đúng là [0,1,2,3].</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hàm thất bại giải cả những bài chẳng liên quan gì tới tìm kiếm.</b> Nó trả lời "biên dài nhất của mọi tiền tố là bao nhiêu?", từ đó cho ngay đơn vị lặp ngắn nhất của một xâu (n − fail[n−1] khi số này là ước của n), số lần xuất hiện của mọi tiền tố, và — qua thuật toán Z, người anh em sinh đôi của nó — phép kiểm tính tuần hoàn của xâu. Nó cũng là hạt giống của ô-tô-mát Aho–Corasick, thứ khớp hàng nghìn mẫu trong một lượt và là động cơ của phần mềm diệt vi-rút cùng các hệ phát hiện xâm nhập. <em>Ngoài giáo trình vì môn học trình bày bảng này như một chi tiết cài đặt của KMP, trong khi nó là một công cụ tổng quát về cấu trúc xâu.</em></div>
</div>
`,
        },
        {
          title: '8.3 — Huffman coding, built step by step|||8.3 — Mã Huffman, dựng từng bước',
          slug: 'csd201-huffman',
          type: 'VIDEO',
          description: 'Dựng cây Huffman bằng hàng đợi ưu tiên, sinh bảng mã, tính tỉ lệ nén thật và chứng minh tính tiền tố.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Huffman — give short codes to frequent symbols</h2>
<p class="lead">Fixed-width encoding spends 8 bits on 'e' and 8 bits on 'z', although 'e' appears far more often. Huffman coding assigns each symbol a <em>variable-length</em> code so that frequent symbols get short bit strings — and it is provably optimal among all per-symbol prefix codes.</p>

<h3>The algorithm — a greedy merge driven by a min-heap</h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>1</b><span>Count the frequency of every symbol.</span></div>
  <div class="lz-fitem"><b>2</b><span>Put each symbol into a min-heap keyed by frequency.</span></div>
  <div class="lz-fitem"><b>3</b><span>Remove the two smallest, join them under a new node whose weight is their sum, push it back.</span></div>
  <div class="lz-fitem"><b>4</b><span>Repeat until one node remains — that is the root. Left edge = 0, right edge = 1.</span></div>
</div>

<h3>Worked example — encode "ABRACADABRA"</h3>
<div class="out"><b>Frequencies:</b> A = 5, B = 2, R = 2, C = 1, D = 1 (11 characters total).<br>
<b>Merge 1:</b> take C(1) and D(1) → node <b>CD(2)</b>. Heap: B(2), R(2), CD(2), A(5).<br>
<b>Merge 2:</b> take B(2) and R(2) → node <b>BR(4)</b>. Heap: CD(2), BR(4), A(5).<br>
<b>Merge 3:</b> take CD(2) and BR(4) → node <b>CDBR(6)</b>. Heap: A(5), CDBR(6).<br>
<b>Merge 4:</b> take A(5) and CDBR(6) → <b>root(11)</b>. Done.<br>
<b>Read the codes</b> (left = 0, right = 1):<br>
A = <b>0</b> (1 bit) · C = <b>1000</b> · D = <b>1001</b> · B = <b>1010</b> · R = <b>1011</b> (4 bits each)<br>
<b>Compressed size:</b> A appears 5× × 1 bit = 5 · B 2×4 = 8 · R 2×4 = 8 · C 1×4 = 4 · D 1×4 = 4 → <b>29 bits</b>.<br>
<b>Fixed-width comparison:</b> 5 distinct symbols need ⌈log₂5⌉ = 3 bits → 11 × 3 = 33 bits. ASCII would need 11 × 8 = 88 bits.<br>
<b>Compression ratio vs ASCII:</b> 29 / 88 ≈ <b>33%</b> — a 67% saving, achieved purely from the frequency skew.</div>

<h3>Why the codes are decodable — the prefix property</h3>
<p>Every symbol sits at a <em>leaf</em>, so no code is a prefix of another. Decoding therefore needs no separators: read bits and walk down the tree; when you reach a leaf, emit the symbol and jump back to the root.</p>
<div class="out"><b>Decode 0 1010 1011 0:</b> bit 0 → left → leaf A → emit <b>A</b>, back to root. 1,0,1,0 → leaf B → emit <b>B</b>. 1,0,1,1 → leaf R → emit <b>R</b>. 0 → <b>A</b>. Result: "ABRA" ✓ — no ambiguity at any point.<br>
<b>Counter-example:</b> if A = 0 and B = 01, then reading "01" is ambiguous — it could be B, or A followed by the start of something else. Assigning codes to internal nodes would create exactly this defect.</div>

<h3>Cost and practical notes</h3>
<table><thead><tr><th>Step</th><th>Cost</th></tr></thead><tbody>
<tr><td>Counting frequencies</td><td>O(n)</td></tr>
<tr><td>Building the tree (heap)</td><td>O(k log k), k = number of distinct symbols</td></tr>
<tr><td>Encoding / decoding</td><td>O(n) plus the output length</td></tr>
</tbody></table>
<p>The compressed file must also carry the tree (or the frequency table) so the decoder can rebuild it — which is why Huffman can <em>enlarge</em> a very short file.</p>

<div class="pitfall"><b>Huffman gains nothing on uniform data.</b> If all symbols are equally frequent, every code ends up the same length and you have re-invented fixed-width encoding — plus the overhead of storing the tree. Compression exploits skew; already-compressed data (JPEG, ZIP, MP4) has almost none, which is why zipping a ZIP file is pointless.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The entropy bound, and what beats Huffman.</b> Shannon proved no per-symbol code can average fewer than H = −Σ p·log₂p bits per symbol; Huffman always lands within 1 bit of H. The residual gap matters when one symbol has probability 0.9 — its ideal code is 0.15 bits, but Huffman must spend a whole bit. <strong>Arithmetic coding</strong> and modern <strong>ANS</strong> encode a whole message as one number and do reach fractional bit costs; that is why they are used in JPEG2000, CABAC in H.264/H.265, and Zstandard. <em>Beyond syllabus because the course stops at "Huffman is optimal", which is true only inside the restricted class of per-symbol prefix codes.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Huffman — cho ký hiệu hay gặp một mã ngắn</h2>
<p class="lead">Mã hoá độ dài cố định tiêu 8 bit cho 'e' và cũng 8 bit cho 'z', dù 'e' xuất hiện nhiều hơn hẳn. Mã Huffman gán cho mỗi ký hiệu một mã <em>độ dài thay đổi</em> sao cho ký hiệu hay gặp nhận chuỗi bit ngắn — và nó tối ưu có chứng minh trong lớp các mã tiền tố theo từng ký hiệu.</p>

<h3>Thuật toán — phép gộp tham lam điều khiển bởi heap min</h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>1</b><span>Đếm tần suất mọi ký hiệu.</span></div>
  <div class="lz-fitem"><b>2</b><span>Đưa từng ký hiệu vào heap min khoá theo tần suất.</span></div>
  <div class="lz-fitem"><b>3</b><span>Lấy ra hai cái nhỏ nhất, gộp dưới một nút mới có trọng số bằng tổng, đẩy trở lại.</span></div>
  <div class="lz-fitem"><b>4</b><span>Lặp tới khi còn một nút — đó là gốc. Cạnh trái = 0, cạnh phải = 1.</span></div>
</div>

<h3>Ví dụ có lời giải — mã hoá "ABRACADABRA"</h3>
<div class="out"><b>Tần suất:</b> A = 5, B = 2, R = 2, C = 1, D = 1 (tổng 11 ký tự).<br>
<b>Gộp 1:</b> lấy C(1) và D(1) → nút <b>CD(2)</b>. Heap: B(2), R(2), CD(2), A(5).<br>
<b>Gộp 2:</b> lấy B(2) và R(2) → nút <b>BR(4)</b>. Heap: CD(2), BR(4), A(5).<br>
<b>Gộp 3:</b> lấy CD(2) và BR(4) → nút <b>CDBR(6)</b>. Heap: A(5), CDBR(6).<br>
<b>Gộp 4:</b> lấy A(5) và CDBR(6) → <b>gốc(11)</b>. Xong.<br>
<b>Đọc mã ra</b> (trái = 0, phải = 1):<br>
A = <b>0</b> (1 bit) · C = <b>1000</b> · D = <b>1001</b> · B = <b>1010</b> · R = <b>1011</b> (mỗi cái 4 bit)<br>
<b>Kích thước sau nén:</b> A xuất hiện 5 lần × 1 bit = 5 · B 2×4 = 8 · R 2×4 = 8 · C 1×4 = 4 · D 1×4 = 4 → <b>29 bit</b>.<br>
<b>So với độ dài cố định:</b> 5 ký hiệu phân biệt cần ⌈log₂5⌉ = 3 bit → 11 × 3 = 33 bit. ASCII thì cần 11 × 8 = 88 bit.<br>
<b>Tỉ lệ nén so với ASCII:</b> 29 / 88 ≈ <b>33%</b> — tiết kiệm 67%, đạt được thuần tuý nhờ tần suất lệch.</div>

<h3>Vì sao giải mã được — tính chất tiền tố</h3>
<p>Mọi ký hiệu đều nằm ở <em>lá</em>, nên không mã nào là tiền tố của mã khác. Nhờ vậy giải mã không cần dấu phân cách: đọc từng bit và đi xuống theo cây; tới lá thì phát ra ký hiệu và nhảy về gốc.</p>
<div class="out"><b>Giải mã 0 1010 1011 0:</b> bit 0 → rẽ trái → lá A → phát <b>A</b>, về gốc. 1,0,1,0 → lá B → phát <b>B</b>. 1,0,1,1 → lá R → phát <b>R</b>. 0 → <b>A</b>. Kết quả: "ABRA" ✓ — không nhập nhằng ở bất kỳ điểm nào.<br>
<b>Phản ví dụ:</b> nếu A = 0 và B = 01 thì đọc "01" là nhập nhằng — có thể là B, cũng có thể là A rồi tới đầu của thứ khác. Gán mã cho các nút trong sẽ tạo ra đúng khiếm khuyết này.</div>

<h3>Chi phí và lưu ý thực dụng</h3>
<table><thead><tr><th>Bước</th><th>Chi phí</th></tr></thead><tbody>
<tr><td>Đếm tần suất</td><td>O(n)</td></tr>
<tr><td>Dựng cây (heap)</td><td>O(k log k), k = số ký hiệu phân biệt</td></tr>
<tr><td>Mã hoá / giải mã</td><td>O(n) cộng độ dài đầu ra</td></tr>
</tbody></table>
<p>Tệp nén còn phải mang theo cả cây (hoặc bảng tần suất) để bên giải mã dựng lại — đó là lý do Huffman có thể làm <em>phình</em> một tệp rất ngắn.</p>

<div class="pitfall"><b>Huffman chẳng được gì trên dữ liệu phân bố đều.</b> Nếu mọi ký hiệu có tần suất như nhau thì mọi mã đều dài bằng nhau và bạn vừa phát minh lại mã độ dài cố định — cộng thêm chi phí lưu cây. Nén sống nhờ độ lệch; dữ liệu đã nén rồi (JPEG, ZIP, MP4) gần như không còn độ lệch, nên nén lại một tệp ZIP là vô ích.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Cận entropy, và thứ thắng được Huffman.</b> Shannon chứng minh không mã theo từng ký hiệu nào có thể trung bình dưới H = −Σ p·log₂p bit mỗi ký hiệu; Huffman luôn nằm trong khoảng 1 bit so với H. Khoảng chênh còn lại trở nên quan trọng khi một ký hiệu có xác suất 0,9 — mã lý tưởng của nó là 0,15 bit, nhưng Huffman buộc phải tiêu trọn một bit. <strong>Mã số học (arithmetic coding)</strong> và <strong>ANS</strong> hiện đại mã hoá cả thông điệp thành một con số và đạt được chi phí bit lẻ; vì thế chúng được dùng trong JPEG2000, CABAC của H.264/H.265, và Zstandard. <em>Ngoài giáo trình vì môn học dừng ở "Huffman là tối ưu", điều chỉ đúng bên trong lớp hẹp các mã tiền tố theo từng ký hiệu.</em></div>
</div>
`,
        },
        {
          title: '8.4 — LZW & RLE, encoded and decoded|||8.4 — LZW & RLE, mã hoá và giải mã',
          slug: 'csd201-lzw-rle',
          type: 'VIDEO',
          description: 'Nén theo từ điển LZW (có ca đặc biệt) và run-length encoding — chạy tay cả hai chiều.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>Two compressors that exploit repetition instead of frequency</h2>
<p class="lead">Huffman looks at how often each <em>symbol</em> appears. LZW and RLE look for repeated <em>sequences</em> — which is why they win on text, on screenshots and on scanned documents, where the same runs and phrases recur.</p>

<h3>RLE — run-length encoding</h3>
<p>Replace each run of identical symbols with (count, symbol).</p>
<div class="out"><b>Encode "AAAAABBBCCCCCCCCD":</b> → <span class="badge">5A 3B 8C 1D</span> — 17 characters become 8 → ratio ≈ 47%.<br>
<b>Decode 5A3B8C1D:</b> repeat A five times, B three times, C eight times, D once → the original string ✓ (lossless).<br>
<b>The failure case:</b> "ABCDEF" has no runs → <span class="badge">1A 1B 1C 1D 1E 1F</span> = <b>12 characters from 6</b>. RLE can double the size of unfavourable input, so real formats include an "uncompressed literal" marker.<br>
<b>Where it does work:</b> fax (long white runs), bitmap icons, and inside JPEG after quantisation, where long stretches of zero coefficients appear.</div>

<h3>LZW — build a dictionary as you go</h3>
<p>Start with a dictionary of every single character (codes 0–255). Read the longest string <span class="badge">w</span> already in the dictionary, output its code, then add <span class="badge">w + next character</span> as a new entry. The decoder rebuilds the same dictionary from the code stream, so nothing has to be transmitted with the data.</p>
<div class="out"><b>Encode "ABABABA" (dictionary starts A=1, B=2):</b><br>
w="A", next 'B' → "AB" not in dict → <b>output 1</b>, add <b>AB = 3</b>, w="B"<br>
w="B", next 'A' → "BA" not in dict → <b>output 2</b>, add <b>BA = 4</b>, w="A"<br>
w="A", next 'B' → "AB" <em>is</em> in dict → w="AB", next 'A' → "ABA" not in dict → <b>output 3</b>, add <b>ABA = 5</b>, w="A"<br>
w="A", next 'B' → "AB" in dict → w="AB", next 'A' → "ABA" in dict → w="ABA", input ends → <b>output 5</b><br>
<b>Result: [1, 2, 3, 5]</b> — 7 characters compressed to 4 codes, and the longer the repetition, the better it gets.</div>
<div class="out"><b>Decode [1, 2, 3, 5] and watch the tricky case:</b><br>
read 1 → "A", output A<br>
read 2 → "B", add previous+first("AB") = 3, output B<br>
read 3 → "AB", add "BA" = 4, output AB<br>
read 5 → <b>5 is not in the dictionary yet!</b> This is the famous LZW edge case: it happens exactly when the encoder used an entry it had just created. The rule is <span class="badge">entry = previous + previous[0]</span> = "AB" + "A" = "ABA" → output ABA, add it as 5.<br>
<b>Total output: A + B + AB + ABA = "ABABABA"</b> ✓ — identical to the input.</div>

<h3>Choosing a compressor</h3>
<table><thead><tr><th>Method</th><th>Exploits</th><th>Dictionary sent?</th><th>Used in</th></tr></thead><tbody>
<tr><td>RLE</td><td>runs of one symbol</td><td>no</td><td>fax, BMP, TGA, JPEG stage</td></tr>
<tr><td>Huffman</td><td>symbol frequency</td><td><b>yes</b> (tree)</td><td>DEFLATE, JPEG, MP3</td></tr>
<tr><td>LZW</td><td>repeated substrings</td><td>no (rebuilt)</td><td>GIF, TIFF, classic Unix <span class="badge">compress</span></td></tr>
<tr><td>DEFLATE</td><td>both (LZ77 + Huffman)</td><td>yes</td><td>ZIP, gzip, PNG, HTTP</td></tr>
</tbody></table>

<div class="pitfall"><b>All three are lossless — do not confuse them with JPEG or MP3.</b> Lossy formats discard information the human eye or ear will not notice and can therefore compress far harder, but the original is gone forever. For source code, databases and archives only lossless compression is acceptable.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>DEFLATE — why every real format combines the ideas.</b> ZIP, gzip and PNG run LZ77 (a sliding window that emits "go back d bytes and copy l bytes" pairs) and then Huffman-code the resulting literals and lengths. Repetition is captured first, residual frequency skew second — each stage removes a kind of redundancy the other cannot see. Modern Zstandard replaces the Huffman stage with ANS and adds a trained dictionary, reaching gzip's ratio at several times the speed. <em>Beyond syllabus because the course studies the three algorithms separately, while every deployed compressor is a pipeline of them.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>Hai bộ nén khai thác sự lặp lại thay vì tần suất</h2>
<p class="lead">Huffman nhìn xem mỗi <em>ký hiệu</em> xuất hiện bao nhiêu lần. LZW và RLE thì tìm các <em>chuỗi</em> lặp lại — vì thế chúng thắng trên văn bản, ảnh chụp màn hình và tài liệu quét, nơi cùng những đoạn và cụm từ cứ tái diễn.</p>

<h3>RLE — mã hoá theo độ dài loạt</h3>
<p>Thay mỗi loạt ký hiệu giống nhau bằng cặp (số lần, ký hiệu).</p>
<div class="out"><b>Mã hoá "AAAAABBBCCCCCCCCD":</b> → <span class="badge">5A 3B 8C 1D</span> — 17 ký tự còn 8 → tỉ lệ ≈ 47%.<br>
<b>Giải mã 5A3B8C1D:</b> lặp A năm lần, B ba lần, C tám lần, D một lần → đúng chuỗi gốc ✓ (không mất mát).<br>
<b>Ca thất bại:</b> "ABCDEF" không có loạt nào → <span class="badge">1A 1B 1C 1D 1E 1F</span> = <b>12 ký tự từ 6</b>. RLE có thể làm phình gấp đôi dữ liệu bất lợi, nên các định dạng thật đều có cờ đánh dấu "đoạn nguyên bản không nén".<br>
<b>Chỗ nó thật sự hiệu quả:</b> fax (những loạt trắng dài), biểu tượng bitmap, và bên trong JPEG sau bước lượng tử hoá, nơi xuất hiện những dải hệ số 0 rất dài.</div>

<h3>LZW — vừa chạy vừa dựng từ điển</h3>
<p>Khởi đầu với từ điển chứa mọi ký tự đơn (mã 0–255). Đọc chuỗi dài nhất <span class="badge">w</span> đã có trong từ điển, xuất mã của nó, rồi thêm <span class="badge">w + ký tự kế tiếp</span> làm mục mới. Bên giải mã dựng lại đúng từ điển đó từ dòng mã, nên không phải gửi kèm gì cả.</p>
<div class="out"><b>Mã hoá "ABABABA" (từ điển khởi đầu A=1, B=2):</b><br>
w="A", kế 'B' → "AB" chưa có → <b>xuất 1</b>, thêm <b>AB = 3</b>, w="B"<br>
w="B", kế 'A' → "BA" chưa có → <b>xuất 2</b>, thêm <b>BA = 4</b>, w="A"<br>
w="A", kế 'B' → "AB" <em>đã có</em> → w="AB", kế 'A' → "ABA" chưa có → <b>xuất 3</b>, thêm <b>ABA = 5</b>, w="A"<br>
w="A", kế 'B' → "AB" đã có → w="AB", kế 'A' → "ABA" đã có → w="ABA", hết đầu vào → <b>xuất 5</b><br>
<b>Kết quả: [1, 2, 3, 5]</b> — 7 ký tự nén còn 4 mã, và chuỗi lặp càng dài thì càng lợi.</div>
<div class="out"><b>Giải mã [1, 2, 3, 5] và để ý ca hóc búa:</b><br>
đọc 1 → "A", xuất A<br>
đọc 2 → "B", thêm trước+ký_tự_đầu("AB") = 3, xuất B<br>
đọc 3 → "AB", thêm "BA" = 4, xuất AB<br>
đọc 5 → <b>5 chưa có trong từ điển!</b> Đây là ca biên nổi tiếng của LZW: nó xảy ra đúng khi bên mã hoá vừa dùng ngay mục mà nó vừa tạo. Quy tắc là <span class="badge">mục = chuỗi trước + ký tự đầu của chuỗi trước</span> = "AB" + "A" = "ABA" → xuất ABA, thêm nó làm mã 5.<br>
<b>Tổng đầu ra: A + B + AB + ABA = "ABABABA"</b> ✓ — trùng khít đầu vào.</div>

<h3>Chọn bộ nén</h3>
<table><thead><tr><th>Phương pháp</th><th>Khai thác</th><th>Có gửi từ điển?</th><th>Dùng trong</th></tr></thead><tbody>
<tr><td>RLE</td><td>loạt cùng một ký hiệu</td><td>không</td><td>fax, BMP, TGA, một chặng của JPEG</td></tr>
<tr><td>Huffman</td><td>tần suất ký hiệu</td><td><b>có</b> (cây)</td><td>DEFLATE, JPEG, MP3</td></tr>
<tr><td>LZW</td><td>xâu con lặp lại</td><td>không (dựng lại)</td><td>GIF, TIFF, lệnh <span class="badge">compress</span> cổ điển của Unix</td></tr>
<tr><td>DEFLATE</td><td>cả hai (LZ77 + Huffman)</td><td>có</td><td>ZIP, gzip, PNG, HTTP</td></tr>
</tbody></table>

<div class="pitfall"><b>Cả ba đều không mất mát — đừng nhầm chúng với JPEG hay MP3.</b> Các định dạng mất mát vứt đi thông tin mà mắt hay tai người không nhận ra nên nén mạnh hơn nhiều, nhưng bản gốc thì mất vĩnh viễn. Với mã nguồn, cơ sở dữ liệu và bản lưu trữ, chỉ nén không mất mát mới chấp nhận được.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>DEFLATE — vì sao mọi định dạng thật đều ghép các ý tưởng lại.</b> ZIP, gzip và PNG chạy LZ77 (một cửa sổ trượt phát ra các cặp "lùi lại d byte và chép l byte") rồi mã hoá Huffman các ký tự nguyên bản và độ dài thu được. Sự lặp lại được bắt trước, độ lệch tần suất còn dư được bắt sau — mỗi chặng dọn một loại dư thừa mà chặng kia không nhìn thấy. Zstandard hiện đại thay chặng Huffman bằng ANS và thêm từ điển huấn luyện sẵn, đạt tỉ lệ ngang gzip với tốc độ cao gấp mấy lần. <em>Ngoài giáo trình vì môn học nghiên cứu ba thuật toán tách rời, trong khi mọi bộ nén được triển khai thật đều là một dây chuyền ghép chúng lại.</em></div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ NÂNG CAO ══════════════════ */
    {
      title: 'Advanced — Beyond the syllabus|||Nâng cao — Ngoài giáo trình',
      description: 'Red-Black/B-tree/skip list, Union-Find và phân tích khấu hao — bước tiếp theo để thành thạo thuật toán.',
      lessons: [
        {
          title: 'A.1 — Red-Black, B-trees & skip lists|||A.1 — Red-Black, B-tree & danh sách nhảy',
          slug: 'csd201-cay-can-bang',
          type: 'VIDEO',
          description: 'Ba cấu trúc cân bằng KHÁC AVL: luật màu Red-Black, B-tree cho đĩa, và skip list xác suất.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced · Lesson A.1</span>
<h2>Three balancing schemes that are not AVL</h2>
<p class="lead">Lesson 4.6 covered AVL and its four rotations. AVL is not the only answer — and it is not the one most libraries chose. Each structure below trades balance strictness for something else: fewer writes, fewer disk reads, or simpler code.</p>

<h3>1. Red-Black trees — the library default</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Rule 1.</b> Every node is red or black; the root and all null leaves are black.</div>
  <div class="lz-layer"><b>Rule 2.</b> A red node cannot have a red child (no two reds in a row).</div>
  <div class="lz-layer"><b>Rule 3.</b> Every path from a node down to a null leaf contains the same number of black nodes ("black height").</div>
</div>
<div class="out"><b>What those rules buy.</b> The shortest possible path is all black; the longest alternates red and black, so it is at most twice the shortest. Height ≤ 2·log₂(n+1) — looser than AVL's 1.44·log₂n, but still O(log n).<br>
<b>The pay-off:</b> an insert needs at most <b>2 rotations</b> and a delete at most <b>3</b>, whereas AVL deletion can rotate all the way up, O(log n) times. Fewer structural writes means less cache invalidation and cheaper persistence — so <span class="badge">TreeMap</span>, <span class="badge">std::map</span>, the Linux CFS scheduler and Java 8's HashMap buckets all use red-black trees.<br>
<b>Rule of thumb:</b> read-heavy → AVL; write-heavy → red-black.</div>

<h3>2. B-trees — balancing for disks, not for RAM</h3>
<p>A B-tree node holds many keys (often hundreds) and has many children. All leaves sit at the same depth, and the tree is kept between half-full and full.</p>
<div class="out"><b>Why the shape changes when data lives on disk.</b> A disk or SSD read costs about 10 000× a memory read, and it always transfers a whole page (4–16 KB). The metric is therefore <em>pages read</em>, not comparisons.<br>
<b>Numbers:</b> 1,000,000 records in a binary tree → height ≈ 20 → up to <b>20 page reads</b>. The same records in a B-tree of order 100 → height = log₁₀₀(10⁶) = <b>3</b> → 3 page reads, and the top levels stay cached, so in practice it is 1.<br>
<b>That is why every database index is a B+ tree</b> (a B-tree with all data in the leaves, leaves linked for range scans): MySQL InnoDB, PostgreSQL, SQLite, Oracle. A range query <span class="badge">WHERE age BETWEEN 20 AND 30</span> descends once and then walks the leaf chain sequentially.</div>

<h3>3. Skip lists — balance by coin flip</h3>
<p>A sorted linked list with extra "express lanes": each node is promoted to the next level with probability ½, so level 1 holds ~n/2 nodes, level 2 ~n/4, and so on. Searching starts at the top lane and drops down when the next node overshoots.</p>
<div class="diagram">L3: 1 ──────────────────→ 9
L2: 1 ──────→ 5 ────────→ 9
L1: 1 → 3 →  5 → 6 → 7 → 9</div>
<div class="out"><b>Search 7:</b> L3: 1 → next is 9 &gt; 7 → drop. L2: from 1 → 5 ≤ 7 → move; next is 9 → drop. L1: from 5 → 6 → 7 ✓ — <b>4 steps instead of 6</b>.<br>
<b>Expected height O(log n)</b> and expected search O(log n) — no rotations and no rebalancing code at all, which makes lock-free concurrent versions far easier to write. Redis sorted sets (ZSET), LevelDB/RocksDB memtables and java's <span class="badge">ConcurrentSkipListMap</span> use exactly this.</div>

<table><thead><tr><th></th><th>AVL</th><th>Red-Black</th><th>B-tree</th><th>Skip list</th></tr></thead><tbody>
<tr><td>Height bound</td><td>1.44 log n</td><td>2 log n</td><td>log_B n</td><td>O(log n) expected</td></tr>
<tr><td>Rotations per write</td><td>up to O(log n)</td><td><b>≤ 3</b></td><td>splits/merges</td><td><b>none</b></td></tr>
<tr><td>Best for</td><td>read-heavy in RAM</td><td>general purpose</td><td><b>disk / SSD</b></td><td>concurrency</td></tr>
</tbody></table>

<div class="pitfall"><b>"Balanced" never means "perfectly balanced".</b> Insisting on perfect balance would force O(n) rebuilding on every insert. All four structures deliberately accept some slack — that slack is precisely what makes updates cheap.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>LSM-trees invert the trade-off entirely.</b> Cassandra, RocksDB, HBase and ClickHouse do not update a B-tree in place; they append writes to a memtable, flush sorted runs to disk and merge them in the background. Writes become sequential (fast on both HDD and SSD) at the cost of reads touching several runs — mitigated with Bloom filters. Choosing B-tree versus LSM is the single biggest structural decision in a modern storage engine. <em>Beyond syllabus because CSD201 assumes data in RAM, where the write-amplification question the whole database industry argues about does not even arise.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao · Bài A.1</span>
<h2>Ba cơ chế cân bằng khác AVL</h2>
<p class="lead">Bài 4.6 đã nói về AVL và bốn phép xoay. AVL không phải câu trả lời duy nhất — và cũng không phải cái mà đa số thư viện chọn. Mỗi cấu trúc dưới đây đánh đổi độ chặt của cân bằng lấy một thứ khác: ít phép ghi hơn, ít lần đọc đĩa hơn, hoặc mã đơn giản hơn.</p>

<h3>1. Cây đỏ-đen — mặc định của các thư viện</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Luật 1.</b> Mọi nút là đỏ hoặc đen; gốc và mọi lá null đều đen.</div>
  <div class="lz-layer"><b>Luật 2.</b> Nút đỏ không được có con đỏ (không hai đỏ liền nhau).</div>
  <div class="lz-layer"><b>Luật 3.</b> Mọi đường đi từ một nút xuống lá null chứa cùng số nút đen ("chiều cao đen").</div>
</div>
<div class="out"><b>Ba luật đó mua được gì.</b> Đường ngắn nhất có thể là toàn đen; đường dài nhất xen kẽ đỏ-đen nên dài nhiều nhất gấp đôi đường ngắn nhất. Chiều cao ≤ 2·log₂(n+1) — lỏng hơn mức 1,44·log₂n của AVL, nhưng vẫn O(log n).<br>
<b>Phần thưởng:</b> một lần chèn cần nhiều nhất <b>2 phép xoay</b> và một lần xoá nhiều nhất <b>3</b>, trong khi xoá trên AVL có thể phải xoay ngược lên tận gốc, O(log n) lần. Ít phép ghi cấu trúc nghĩa là ít làm hỏng cache và lưu trữ bền rẻ hơn — nên <span class="badge">TreeMap</span>, <span class="badge">std::map</span>, bộ lập lịch CFS của Linux và các rổ của HashMap Java 8 đều dùng cây đỏ-đen.<br>
<b>Mẹo chọn:</b> thiên đọc → AVL; thiên ghi → đỏ-đen.</div>

<h3>2. B-tree — cân bằng cho đĩa, không phải cho RAM</h3>
<p>Một nút B-tree chứa rất nhiều khoá (thường hàng trăm) và có rất nhiều con. Mọi lá nằm cùng độ sâu, và cây luôn được giữ đầy từ một nửa trở lên.</p>
<div class="out"><b>Vì sao hình dạng đổi khi dữ liệu nằm trên đĩa.</b> Một lần đọc đĩa hay SSD tốn khoảng 10.000 lần một lần đọc bộ nhớ, và luôn chuyển nguyên một trang (4–16 KB). Vậy thước đo là <em>số trang đọc</em>, không phải số phép so sánh.<br>
<b>Con số:</b> 1.000.000 bản ghi trong cây nhị phân → chiều cao ≈ 20 → tới <b>20 lần đọc trang</b>. Cũng ngần ấy bản ghi trong B-tree bậc 100 → chiều cao = log₁₀₀(10⁶) = <b>3</b> → 3 lần đọc trang, mà các tầng trên luôn nằm trong cache nên thực tế chỉ còn 1.<br>
<b>Đó là lý do mọi chỉ mục cơ sở dữ liệu đều là B+ tree</b> (B-tree với toàn bộ dữ liệu ở lá, các lá nối với nhau để quét khoảng): MySQL InnoDB, PostgreSQL, SQLite, Oracle. Một truy vấn khoảng <span class="badge">WHERE age BETWEEN 20 AND 30</span> đi xuống một lần rồi chạy tuần tự dọc dây lá.</div>

<h3>3. Danh sách nhảy — cân bằng bằng tung đồng xu</h3>
<p>Một danh sách liên kết đã sắp kèm các "làn cao tốc": mỗi nút được thăng lên tầng trên với xác suất ½, nên tầng 1 giữ ~n/2 nút, tầng 2 ~n/4, và cứ thế. Tìm kiếm bắt đầu ở làn trên cùng rồi tụt xuống khi nút kế tiếp vượt quá.</p>
<div class="diagram">L3: 1 ──────────────────→ 9
L2: 1 ──────→ 5 ────────→ 9
L1: 1 → 3 →  5 → 6 → 7 → 9</div>
<div class="out"><b>Tìm 7:</b> L3: từ 1 → kế là 9 &gt; 7 → tụt. L2: từ 1 → 5 ≤ 7 → đi; kế là 9 → tụt. L1: từ 5 → 6 → 7 ✓ — <b>4 bước thay vì 6</b>.<br>
<b>Chiều cao kỳ vọng O(log n)</b> và tìm kiếm kỳ vọng O(log n) — không phép xoay nào, không mã tái cân bằng nào, nhờ đó viết bản đồng thời không khoá dễ hơn hẳn. Sorted set của Redis (ZSET), memtable của LevelDB/RocksDB và <span class="badge">ConcurrentSkipListMap</span> của Java dùng đúng cấu trúc này.</div>

<table><thead><tr><th></th><th>AVL</th><th>Đỏ-đen</th><th>B-tree</th><th>Danh sách nhảy</th></tr></thead><tbody>
<tr><td>Cận chiều cao</td><td>1,44 log n</td><td>2 log n</td><td>log_B n</td><td>O(log n) kỳ vọng</td></tr>
<tr><td>Số phép xoay mỗi lần ghi</td><td>tới O(log n)</td><td><b>≤ 3</b></td><td>tách/gộp nút</td><td><b>không có</b></td></tr>
<tr><td>Hợp nhất với</td><td>thiên đọc, trong RAM</td><td>đa dụng</td><td><b>đĩa / SSD</b></td><td>xử lý đồng thời</td></tr>
</tbody></table>

<div class="pitfall"><b>"Cân bằng" không bao giờ nghĩa là "cân bằng hoàn hảo".</b> Đòi hỏi cân bằng tuyệt đối sẽ buộc phải dựng lại O(n) sau mỗi lần chèn. Cả bốn cấu trúc đều cố ý chấp nhận một độ lỏng — và chính độ lỏng đó làm phép cập nhật trở nên rẻ.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Cây LSM lật ngược hoàn toàn phép đánh đổi.</b> Cassandra, RocksDB, HBase và ClickHouse không cập nhật B-tree tại chỗ; chúng nối thêm bản ghi vào memtable, xả ra đĩa thành các run đã sắp rồi trộn dần ở nền. Phép ghi trở thành tuần tự (nhanh trên cả HDD lẫn SSD), đổi lại phép đọc phải chạm nhiều run — được giảm nhẹ bằng bộ lọc Bloom. Chọn B-tree hay LSM là quyết định cấu trúc lớn nhất trong một bộ máy lưu trữ hiện đại. <em>Ngoài giáo trình vì CSD201 giả định dữ liệu nằm trong RAM, nơi câu hỏi về khuếch đại ghi mà cả ngành cơ sở dữ liệu tranh cãi thậm chí không phát sinh.</em></div>
</div>
`,
        },
        {
          title: 'A.2 — Union-Find & amortised analysis|||A.2 — Union-Find & phân tích khấu hao',
          slug: 'csd201-dijkstra-mst',
          type: 'VIDEO',
          description: 'Cấu trúc tập hợp rời nhau với nén đường đi & gộp theo hạng, và phương pháp phân tích khấu hao.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced · Lesson A.2</span>
<h2>Union-Find — the tiny structure with the strangest complexity</h2>
<p class="lead">Lesson 5.6 used union-find as a helper inside Kruskal. It deserves its own study, because two one-line optimisations take it from O(n) per operation to a bound so close to constant that it is written with the inverse Ackermann function.</p>

<h3>The three versions</h3>
<pre><span class="tok-comment">// v1 — naive: find walks up to the root</span>
<span class="tok-type">int</span> <span class="tok-function">find</span>(<span class="tok-type">int</span> x) { <span class="tok-keyword">while</span> (parent[x] != x) x = parent[x]; <span class="tok-keyword">return</span> x; }   <span class="tok-comment">// O(n) worst case</span>

<span class="tok-comment">// v2 — union by rank: always hang the shorter tree under the taller</span>
<span class="tok-keyword">void</span> <span class="tok-function">union</span>(<span class="tok-type">int</span> a, <span class="tok-type">int</span> b) {
    <span class="tok-type">int</span> ra = <span class="tok-function">find</span>(a), rb = <span class="tok-function">find</span>(b);
    <span class="tok-keyword">if</span> (ra == rb) <span class="tok-keyword">return</span>;
    <span class="tok-keyword">if</span> (rank[ra] &lt; rank[rb]) { <span class="tok-type">int</span> t = ra; ra = rb; rb = t; }
    parent[rb] = ra;
    <span class="tok-keyword">if</span> (rank[ra] == rank[rb]) rank[ra]++;
}                                                        <span class="tok-comment">// height ≤ log n</span>

<span class="tok-comment">// v3 — path compression: flatten the path on the way back</span>
<span class="tok-type">int</span> <span class="tok-function">find</span>(<span class="tok-type">int</span> x) {
    <span class="tok-keyword">if</span> (parent[x] != x) parent[x] = <span class="tok-function">find</span>(parent[x]);
    <span class="tok-keyword">return</span> parent[x];
}</pre>

<h3>Worked example — path compression in action</h3>
<div class="out"><b>Before:</b> 1 → 2 → 3 → 4 → 5 (5 is the root), a chain of depth 4.<br>
Call <span class="badge">find(1)</span>: the recursion reaches 5, and on the way back every node is re-pointed straight at 5.<br>
<b>After:</b> parent[1] = parent[2] = parent[3] = parent[4] = 5 — the tree is now flat.<br>
The <em>next</em> find on any of those nodes costs <b>1 step</b>. One expensive traversal pays for all the cheap ones that follow — the essence of amortised analysis.</div>

<div class="formula"><span class="lbl">COMPLEXITY</span>m operations on n elements: O(m · α(n)), &nbsp;α(n) &lt; 5 for n &lt; 2<sup>65536</sup></div>
<p>α is the inverse Ackermann function; it grows so slowly that for any input that could ever exist it is at most 4. In practice union-find is treated as constant time.</p>

<h3>Amortised analysis — three ways to prove it</h3>
<table><thead><tr><th>Method</th><th>Idea</th><th>Classic example</th></tr></thead><tbody>
<tr><td><b>Aggregate</b></td><td>bound the total cost of n operations, then divide</td><td>ArrayList doubling: total &lt; 2n copies → O(1) each</td></tr>
<tr><td><b>Accounting</b></td><td>overcharge cheap operations, save the credit to pay for expensive ones</td><td>charge 3 units per push; the saved units pay for the resize</td></tr>
<tr><td><b>Potential</b></td><td>define Φ(state) as "stored energy"; amortised cost = real cost + ΔΦ</td><td>path compression, splay trees</td></tr>
</tbody></table>
<div class="out"><b>Accounting applied to a dynamic array.</b> Charge 3 units for every <span class="badge">add</span>: 1 to write the element, 1 saved to copy this element at the next resize, 1 saved to copy an older element that has already used up its credit. When the array of size k doubles, exactly the k/2 newest elements each carry 2 saved units — enough to pay for all k copies. Cost is never negative, so 3 units per operation is a valid bound → <b>O(1) amortised</b>.</div>

<h3>Where else union-find appears</h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>Kruskal MST</b><span>cycle detection while adding edges (lesson 5.6)</span></div>
  <div class="lz-fitem"><b>Connected components</b><span>on a stream of edges, without storing the graph</span></div>
  <div class="lz-fitem"><b>Percolation</b><span>does water reach the bottom of the grid?</span></div>
  <div class="lz-fitem"><b>Image processing</b><span>connected-component labelling of pixels</span></div>
  <div class="lz-fitem"><b>Compilers</b><span>type unification in Hindley–Milner inference</span></div>
</div>

<div class="pitfall"><b>Amortised is not average, and not worst case.</b> "O(1) amortised" guarantees that <em>any</em> sequence of m operations costs O(m) — a stronger promise than an average over random inputs. But a single operation can still take O(n), which is why hard real-time systems avoid structures that resize.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Union-find cannot un-union.</b> The structure is one-way: there is no efficient way to split a set again, because path compression has destroyed the original shape. Problems that need deletions use "offline dynamic connectivity" — process the whole query sequence in advance with a segment tree over time, adding and rolling back unions (which forbids path compression and uses union by rank plus an undo stack). <em>Beyond syllabus because the course only ever adds edges, while the inability to remove them is the structure's defining limitation.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao · Bài A.2</span>
<h2>Union-Find — cấu trúc tí hon với độ phức tạp kỳ lạ nhất</h2>
<p class="lead">Bài 5.6 dùng union-find như một công cụ phụ bên trong Kruskal. Nó xứng đáng được học riêng, vì hai phép tối ưu mỗi cái một dòng đưa nó từ O(n) mỗi thao tác xuống một cận gần hằng số tới mức phải viết bằng hàm Ackermann ngược.</p>

<h3>Ba phiên bản</h3>
<pre><span class="tok-comment">// v1 — ngây thơ: find đi bộ lên tận gốc</span>
<span class="tok-type">int</span> <span class="tok-function">find</span>(<span class="tok-type">int</span> x) { <span class="tok-keyword">while</span> (parent[x] != x) x = parent[x]; <span class="tok-keyword">return</span> x; }   <span class="tok-comment">// O(n) xấu nhất</span>

<span class="tok-comment">// v2 — gộp theo hạng: luôn treo cây thấp dưới cây cao</span>
<span class="tok-keyword">void</span> <span class="tok-function">union</span>(<span class="tok-type">int</span> a, <span class="tok-type">int</span> b) {
    <span class="tok-type">int</span> ra = <span class="tok-function">find</span>(a), rb = <span class="tok-function">find</span>(b);
    <span class="tok-keyword">if</span> (ra == rb) <span class="tok-keyword">return</span>;
    <span class="tok-keyword">if</span> (rank[ra] &lt; rank[rb]) { <span class="tok-type">int</span> t = ra; ra = rb; rb = t; }
    parent[rb] = ra;
    <span class="tok-keyword">if</span> (rank[ra] == rank[rb]) rank[ra]++;
}                                                        <span class="tok-comment">// chiều cao ≤ log n</span>

<span class="tok-comment">// v3 — nén đường đi: làm phẳng đường đi lúc quay về</span>
<span class="tok-type">int</span> <span class="tok-function">find</span>(<span class="tok-type">int</span> x) {
    <span class="tok-keyword">if</span> (parent[x] != x) parent[x] = <span class="tok-function">find</span>(parent[x]);
    <span class="tok-keyword">return</span> parent[x];
}</pre>

<h3>Ví dụ có lời giải — nén đường đi tại trận</h3>
<div class="out"><b>Trước:</b> 1 → 2 → 3 → 4 → 5 (5 là gốc), một dây xích sâu 4.<br>
Gọi <span class="badge">find(1)</span>: đệ quy chạm tới 5, và trên đường quay về mọi nút được trỏ thẳng vào 5.<br>
<b>Sau:</b> parent[1] = parent[2] = parent[3] = parent[4] = 5 — cây giờ phẳng lì.<br>
Lần find <em>kế tiếp</em> trên bất kỳ nút nào trong số đó chỉ tốn <b>1 bước</b>. Một lần duyệt đắt trả tiền cho tất cả những lần rẻ theo sau — đó là tinh thần của phân tích khấu hao.</div>

<div class="formula"><span class="lbl">ĐỘ PHỨC TẠP</span>m thao tác trên n phần tử: O(m · α(n)), &nbsp;α(n) &lt; 5 với n &lt; 2<sup>65536</sup></div>
<p>α là hàm Ackermann ngược; nó tăng chậm tới mức với mọi đầu vào từng có thể tồn tại thì nó nhiều nhất bằng 4. Trong thực tế, union-find được coi là thời gian hằng số.</p>

<h3>Phân tích khấu hao — ba cách chứng minh</h3>
<table><thead><tr><th>Phương pháp</th><th>Ý tưởng</th><th>Ví dụ kinh điển</th></tr></thead><tbody>
<tr><td><b>Tổng gộp</b></td><td>chặn tổng chi phí của n thao tác rồi chia ra</td><td>ArrayList nhân đôi: tổng &lt; 2n lần chép → O(1) mỗi lần</td></tr>
<tr><td><b>Kế toán</b></td><td>thu quá tay ở thao tác rẻ, để dành trả cho thao tác đắt</td><td>tính 3 đơn vị mỗi lần push; phần để dành trả cho lần nở mảng</td></tr>
<tr><td><b>Thế năng</b></td><td>định nghĩa Φ(trạng thái) như "năng lượng tích trữ"; chi phí khấu hao = chi phí thật + ΔΦ</td><td>nén đường đi, cây splay</td></tr>
</tbody></table>
<div class="out"><b>Áp dụng phương pháp kế toán cho mảng động.</b> Thu 3 đơn vị cho mỗi lần <span class="badge">add</span>: 1 để ghi phần tử, 1 để dành chép chính phần tử này ở lần nở tới, 1 để dành chép một phần tử cũ đã tiêu hết tín dụng của nó. Khi mảng cỡ k nhân đôi, đúng k/2 phần tử mới nhất mỗi cái mang 2 đơn vị để dành — vừa đủ trả cho cả k lần chép. Số dư không bao giờ âm, nên 3 đơn vị mỗi thao tác là một cận hợp lệ → <b>O(1) khấu hao</b>.</div>

<h3>Union-find còn xuất hiện ở đâu</h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>Kruskal MST</b><span>phát hiện chu trình khi thêm cạnh (bài 5.6)</span></div>
  <div class="lz-fitem"><b>Thành phần liên thông</b><span>trên một luồng cạnh, không cần lưu cả đồ thị</span></div>
  <div class="lz-fitem"><b>Bài toán thấm</b><span>nước có chảy được xuống đáy lưới không?</span></div>
  <div class="lz-fitem"><b>Xử lý ảnh</b><span>gán nhãn thành phần liên thông cho điểm ảnh</span></div>
  <div class="lz-fitem"><b>Trình biên dịch</b><span>hợp nhất kiểu trong suy diễn Hindley–Milner</span></div>
</div>

<div class="pitfall"><b>Khấu hao không phải trung bình, cũng không phải xấu nhất.</b> "O(1) khấu hao" đảm bảo <em>mọi</em> dãy m thao tác tốn O(m) — một lời hứa mạnh hơn giá trị trung bình trên đầu vào ngẫu nhiên. Nhưng một thao tác đơn lẻ vẫn có thể tốn O(n), nên các hệ thời gian thực khắt khe tránh những cấu trúc phải nở kích thước.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Union-find không thể "gộp ngược".</b> Cấu trúc này một chiều: không có cách hiệu quả nào tách một tập ra lại, vì nén đường đi đã phá huỷ hình dạng ban đầu. Các bài toán cần xoá dùng "liên thông động ngoại tuyến" — xử lý trước cả dãy truy vấn bằng cây đoạn theo trục thời gian, thêm rồi hoàn tác các phép gộp (điều này cấm nén đường đi và phải dùng gộp theo hạng cộng một ngăn xếp hoàn tác). <em>Ngoài giáo trình vì môn học chỉ thêm cạnh, trong khi việc không gỡ được cạnh mới là giới hạn định danh của cấu trúc này.</em></div>
</div>
`,
        },
        {
          title: 'Quiz 5 — Hashing, Text & Advanced|||Quiz 5 — Băm, Văn bản & Nâng cao',
          slug: 'csd201-quiz-5',
          type: 'QUIZ',
          description: 'Kiểm tra băm, nén và chủ đề nâng cao.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'A hash table gives average-case lookup of…|||Bảng băm cho tra cứu trung bình…', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], correctIndex: 1, points: 1 },
              { question: 'Chaining handles collisions by…|||Chaining xử lý va chạm bằng cách…', options: ['ignoring them|||bỏ qua', 'storing colliding entries in a list at the bucket|||lưu các mục va chạm trong một danh sách tại bucket', 'resizing to O(1)|||resize về O(1)', 'sorting the table|||sắp bảng'], correctIndex: 1, points: 1 },
              { question: 'Huffman coding builds its code tree using a…|||Mã Huffman dựng cây mã bằng…', options: ['stack|||ngăn xếp', 'priority queue (heap)|||hàng đợi ưu tiên (heap)', 'hash map', 'graph|||đồ thị'], correctIndex: 1, points: 1 },
              { question: 'Balanced trees (AVL/Red-Black) exist to…|||Cây cân bằng (AVL/Red-Black) tồn tại để…', options: ['save memory|||tiết kiệm bộ nhớ', 'guarantee O(log n) operations|||đảm bảo thao tác O(log n)', 'sort faster|||sắp nhanh hơn', 'avoid recursion|||tránh đệ quy'], correctIndex: 1, points: 1 },
              { question: 'Dijkstra\'s shortest-path algorithm relies on a…|||Thuật toán đường ngắn nhất Dijkstra dựa vào…', options: ['queue|||hàng đợi', 'priority queue|||hàng đợi ưu tiên', 'stack|||ngăn xếp', 'hash set'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 9 — ÔN THI ══════════════════ */
    {
      title: 'Exam preparation (PE & FE)|||Ôn thi cuối kỳ (PE & FE)',
      description: 'Chuẩn bị thi thực hành 85 phút và thi trắc nghiệm cuối kỳ: khung code, chiến lược, ngân hàng câu hỏi.',
      lessons: [
        {
          title: '9.1 — The 85-minute Practical Exam: strategy & template|||9.1 — Thi thực hành 85 phút: chiến lược & khung code',
          slug: 'csd201-on-pe',
          type: 'VIDEO',
          description: 'Cấu trúc điểm, phân bổ thời gian, khung Java dùng lại được, và ba đề mẫu có lời giải.',
          content: `
<div class="ml-en">
<span class="eyebrow">Exam prep · Lesson 9.1</span>
<h2>The PE is a time-management exam disguised as a coding exam</h2>
<p class="lead">CSD201 is graded on Progress Tests 20% + Assignments 20% + <b>Practical Exam 30%</b> + Final Exam 30% (FE must reach 4/10). The PE gives you 85 minutes to implement a data structure and a few operations on it. Most people who fail do not fail on the algorithm — they fail by starting the hard part with 15 minutes left.</p>

<h3>Time budget for 85 minutes</h3>
<table><thead><tr><th>Minutes</th><th>Do this</th><th>Why</th></tr></thead><tbody>
<tr><td>0–5</td><td>Read the whole paper. Mark each task's marks and difficulty.</td><td>You must know where the marks are before you write a line.</td></tr>
<tr><td>5–15</td><td>Type the skeleton: node class, structure class, <span class="badge">main</span> with a menu, and a hard-coded test sample.</td><td>A compiling program with a menu already scores partial marks.</td></tr>
<tr><td>15–55</td><td>Implement the required operations, easiest first, testing each one immediately.</td><td>Four working operations beat six broken ones.</td></tr>
<tr><td>55–75</td><td>Attack the hardest operation (usually delete, or a traversal with a condition).</td><td>Deletion is where the marks and the bugs both concentrate.</td></tr>
<tr><td>75–85</td><td>Re-read the requirements, check output format, submit.</td><td>Wrong output format loses marks that the algorithm already earned.</td></tr>
</tbody></table>

<h3>The reusable skeleton — type this from memory in 5 minutes</h3>
<pre><span class="tok-keyword">import</span> java.util.*;

<span class="tok-keyword">public class</span> <span class="tok-type">Main</span> {
    <span class="tok-keyword">static class</span> <span class="tok-type">Node</span> {
        <span class="tok-type">int</span> key; <span class="tok-type">Node</span> left, right, next;
        <span class="tok-type">Node</span>(<span class="tok-type">int</span> k) { key = k; }
    }
    <span class="tok-keyword">static</span> <span class="tok-type">Node</span> root;              <span class="tok-comment">// tree root or list head</span>

    <span class="tok-keyword">public static void</span> <span class="tok-function">main</span>(<span class="tok-type">String</span>[] args) {
        <span class="tok-type">int</span>[] sample = {50, 30, 70, 20, 40, 60, 80};   <span class="tok-comment">// data from the paper</span>
        <span class="tok-keyword">for</span> (<span class="tok-type">int</span> k : sample) root = <span class="tok-function">insert</span>(root, k);

        <span class="tok-type">Scanner</span> sc = <span class="tok-keyword">new</span> <span class="tok-type">Scanner</span>(<span class="tok-type">System</span>.in);
        <span class="tok-keyword">while</span> (<span class="tok-keyword">true</span>) {
            <span class="tok-type">System</span>.out.<span class="tok-function">println</span>(<span class="tok-string">"1.Insert 2.Delete 3.Inorder 4.Search 0.Exit"</span>);
            <span class="tok-keyword">switch</span> (sc.<span class="tok-function">nextInt</span>()) {
                <span class="tok-keyword">case</span> 1 -&gt; root = <span class="tok-function">insert</span>(root, sc.<span class="tok-function">nextInt</span>());
                <span class="tok-keyword">case</span> 2 -&gt; root = <span class="tok-function">delete</span>(root, sc.<span class="tok-function">nextInt</span>());
                <span class="tok-keyword">case</span> 3 -&gt; { <span class="tok-function">inorder</span>(root); <span class="tok-type">System</span>.out.<span class="tok-function">println</span>(); }
                <span class="tok-keyword">case</span> 4 -&gt; <span class="tok-type">System</span>.out.<span class="tok-function">println</span>(<span class="tok-function">search</span>(root, sc.<span class="tok-function">nextInt</span>()));
                <span class="tok-keyword">default</span> -&gt; { <span class="tok-keyword">return</span>; }
            }
        }
    }
}</pre>
<p>Every CSD201 practical fits this shape. Learn to type it without thinking, so your 85 minutes go to the actual algorithm.</p>

<h3>Three sample tasks, with the solution outline</h3>
<div class="out"><b>Task A — "Build a BST from the input, print the in-order traversal, then delete a key and print again."</b><br>
Marks live in: insert (easy) → in-order (easy) → <em>delete with two children</em> (hard). Do insert and in-order first, print something, then attack delete with the successor rule from lesson 4.5. Even if delete fails, you have most of the marks.<br>
<b>Task B — "Read a list of students, sort by GPA descending, print the top 3."</b><br>
Do not write your own sort unless required: <span class="badge">list.sort(Comparator.comparingDouble(S::gpa).reversed())</span>. If the paper says "implement quick sort", write the Lomuto version from lesson 6.3 and test on 5 elements first.<br>
<b>Task C — "Given a graph as an edge list, print BFS and DFS from vertex 1, and count the connected components."</b><br>
Build the adjacency list first (lesson 5.2), then BFS (queue) and DFS (recursion) are ten lines each, and components is a loop over unvisited vertices calling DFS — three tasks from one structure.</div>

<div class="pitfall"><b>The three mistakes that cost the most marks.</b> (1) Handing in code that does not compile — always keep a compiling version, comment out anything broken. (2) Forgetting the null/empty check at the head of every method, which crashes on the examiner's first empty-structure test. (3) Printing in a different format from the sample output — an automated grader marks that as wrong even though your algorithm is correct.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Write the test before the feature, even under time pressure.</b> Two minutes spent hard-coding <span class="badge">{50,30,70,20,40}</span> and an expected in-order output gives you an oracle for every subsequent change. Without it you debug by staring; with it you debug by comparison. Professionals call it a regression test — in an exam it is simply the fastest way to know whether the last edit broke anything. <em>Beyond syllabus because the course never grades your test approach, yet it is the single habit that most changes how fast you finish.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Ôn thi · Bài 9.1</span>
<h2>PE là bài thi quản lý thời gian đội lốt bài thi lập trình</h2>
<p class="lead">CSD201 chấm theo Progress Test 20% + Assignment 20% + <b>Thi thực hành 30%</b> + Thi cuối kỳ 30% (FE phải đạt 4/10). PE cho bạn 85 phút để cài một cấu trúc dữ liệu và vài thao tác trên nó. Đa số người trượt không trượt vì thuật toán — họ trượt vì bắt đầu phần khó khi chỉ còn 15 phút.</p>

<h3>Phân bổ thời gian cho 85 phút</h3>
<table><thead><tr><th>Phút</th><th>Làm việc này</th><th>Vì sao</th></tr></thead><tbody>
<tr><td>0–5</td><td>Đọc hết đề. Đánh dấu điểm số và độ khó từng câu.</td><td>Phải biết điểm nằm ở đâu trước khi gõ dòng nào.</td></tr>
<tr><td>5–15</td><td>Gõ bộ khung: lớp Node, lớp cấu trúc, <span class="badge">main</span> có menu, và một bộ dữ liệu thử gán cứng.</td><td>Một chương trình biên dịch được và có menu đã ăn điểm thành phần.</td></tr>
<tr><td>15–55</td><td>Cài các thao tác yêu cầu, dễ trước, thử ngay từng cái.</td><td>Bốn thao tác chạy được hơn sáu thao tác hỏng.</td></tr>
<tr><td>55–75</td><td>Đánh vào thao tác khó nhất (thường là xoá, hoặc duyệt có điều kiện).</td><td>Xoá là chỗ tập trung cả điểm số lẫn lỗi.</td></tr>
<tr><td>75–85</td><td>Đọc lại yêu cầu, kiểm định dạng in ra, nộp bài.</td><td>Sai định dạng đầu ra làm mất số điểm mà thuật toán đã kiếm được.</td></tr>
</tbody></table>

<h3>Bộ khung dùng lại — gõ thuộc lòng trong 5 phút</h3>
<pre><span class="tok-keyword">import</span> java.util.*;

<span class="tok-keyword">public class</span> <span class="tok-type">Main</span> {
    <span class="tok-keyword">static class</span> <span class="tok-type">Node</span> {
        <span class="tok-type">int</span> key; <span class="tok-type">Node</span> left, right, next;
        <span class="tok-type">Node</span>(<span class="tok-type">int</span> k) { key = k; }
    }
    <span class="tok-keyword">static</span> <span class="tok-type">Node</span> root;              <span class="tok-comment">// gốc cây hoặc đầu danh sách</span>

    <span class="tok-keyword">public static void</span> <span class="tok-function">main</span>(<span class="tok-type">String</span>[] args) {
        <span class="tok-type">int</span>[] sample = {50, 30, 70, 20, 40, 60, 80};   <span class="tok-comment">// dữ liệu lấy từ đề</span>
        <span class="tok-keyword">for</span> (<span class="tok-type">int</span> k : sample) root = <span class="tok-function">insert</span>(root, k);

        <span class="tok-type">Scanner</span> sc = <span class="tok-keyword">new</span> <span class="tok-type">Scanner</span>(<span class="tok-type">System</span>.in);
        <span class="tok-keyword">while</span> (<span class="tok-keyword">true</span>) {
            <span class="tok-type">System</span>.out.<span class="tok-function">println</span>(<span class="tok-string">"1.Insert 2.Delete 3.Inorder 4.Search 0.Exit"</span>);
            <span class="tok-keyword">switch</span> (sc.<span class="tok-function">nextInt</span>()) {
                <span class="tok-keyword">case</span> 1 -&gt; root = <span class="tok-function">insert</span>(root, sc.<span class="tok-function">nextInt</span>());
                <span class="tok-keyword">case</span> 2 -&gt; root = <span class="tok-function">delete</span>(root, sc.<span class="tok-function">nextInt</span>());
                <span class="tok-keyword">case</span> 3 -&gt; { <span class="tok-function">inorder</span>(root); <span class="tok-type">System</span>.out.<span class="tok-function">println</span>(); }
                <span class="tok-keyword">case</span> 4 -&gt; <span class="tok-type">System</span>.out.<span class="tok-function">println</span>(<span class="tok-function">search</span>(root, sc.<span class="tok-function">nextInt</span>()));
                <span class="tok-keyword">default</span> -&gt; { <span class="tok-keyword">return</span>; }
            }
        }
    }
}</pre>
<p>Mọi đề thực hành CSD201 đều vừa cái khuôn này. Hãy luyện gõ nó mà không cần suy nghĩ, để 85 phút của bạn dành cho thuật toán thật sự.</p>

<h3>Ba đề mẫu, kèm hướng giải</h3>
<div class="out"><b>Đề A — "Dựng BST từ dữ liệu vào, in duyệt trung thứ tự, rồi xoá một khoá và in lại."</b><br>
Điểm nằm ở: chèn (dễ) → trung thứ tự (dễ) → <em>xoá nút có hai con</em> (khó). Hãy làm chèn và trung thứ tự trước, in ra được cái gì đó, rồi mới đánh vào phần xoá bằng quy tắc nút kế vị ở bài 4.5. Kể cả xoá hỏng, bạn vẫn giữ được phần lớn điểm.<br>
<b>Đề B — "Đọc danh sách sinh viên, sắp theo GPA giảm dần, in ra 3 người đứng đầu."</b><br>
Đừng tự viết thuật toán sắp nếu đề không bắt: <span class="badge">list.sort(Comparator.comparingDouble(S::gpa).reversed())</span>. Nếu đề ghi "cài đặt quick sort" thì viết bản Lomuto ở bài 6.3 và thử trên 5 phần tử trước đã.<br>
<b>Đề C — "Cho đồ thị dạng danh sách cạnh, in BFS và DFS từ đỉnh 1, và đếm số thành phần liên thông."</b><br>
Dựng danh sách kề trước (bài 5.2), rồi BFS (hàng đợi) và DFS (đệ quy) mỗi cái mười dòng, còn đếm thành phần chỉ là vòng lặp qua các đỉnh chưa thăm gọi DFS — ba câu hỏi từ một cấu trúc.</div>

<div class="pitfall"><b>Ba lỗi làm mất điểm nhiều nhất.</b> (1) Nộp bài không biên dịch được — luôn giữ một bản chạy được, chỗ nào hỏng thì chú thích lại. (2) Quên kiểm null/rỗng ở đầu mọi phương thức, khiến chương trình sập ngay ở phép thử cấu trúc rỗng đầu tiên của người chấm. (3) In khác định dạng đầu ra mẫu — bộ chấm tự động sẽ đánh sai dù thuật toán của bạn đúng.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Viết phép thử trước khi viết tính năng, kể cả khi đang chạy đua thời gian.</b> Hai phút bỏ ra để gán cứng <span class="badge">{50,30,70,20,40}</span> cùng một kết quả trung thứ tự mong đợi cho bạn một "trọng tài" cho mọi thay đổi sau đó. Không có nó, bạn gỡ lỗi bằng cách trân trân nhìn màn hình; có nó, bạn gỡ lỗi bằng cách so sánh. Dân chuyên nghiệp gọi đó là kiểm thử hồi quy — trong phòng thi, đó đơn giản là cách nhanh nhất để biết chỉnh sửa vừa rồi có làm hỏng gì không. <em>Ngoài giáo trình vì môn học không bao giờ chấm cách bạn kiểm thử, nhưng đó lại là thói quen thay đổi tốc độ hoàn thành của bạn nhiều nhất.</em></div>
</div>
`,
        },
        {
          title: '9.2 — Oral question bank (the 120 syllabus CQs by CLO)|||9.2 — Ngân hàng câu hỏi vấn đáp (120 câu CQ theo CLO)',
          slug: 'csd201-ngan-hang-cau-hoi',
          type: 'VIDEO',
          description: 'Các câu hỏi kiến tạo trong syllabus, nhóm theo CLO, kèm câu trả lời mẫu ngắn gọn đúng trọng tâm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Exam prep · Lesson 9.2</span>
<h2>The questions your instructor is actually holding</h2>
<p class="lead">The CSD201 syllabus ships 120 "constructive questions" tied to specific sessions — and progress tests and oral checks are drawn from them. Below is each CLO's core set with a model answer: two sentences, a cost, and an example. That is the shape a full-mark answer takes.</p>

<h3>CLO1 — Lists</h3>
<div class="out"><b>Q: Advantages of a linked list over an array?</b> Insertion and deletion at a known position are O(1) (no shifting), and the size grows without reallocation. <em>Cost:</em> you lose O(1) indexing and pay 1–2 extra references per node.<br>
<b>Q: Disadvantages of a linked list?</b> No random access (get(i) is O(n)), extra memory per node, and poor cache locality because nodes are scattered.<br>
<b>Q: Difference between singly, circular and doubly linked lists?</b> Singly: one <span class="badge">next</span>, forward only. Circular: the last node points back to the first, so there is no null end — good for round-robin. Doubly: <span class="badge">prev</span> as well, so removeLast and "delete this node" become O(1) (lesson 1.3).</div>

<h3>CLO2 — Stacks &amp; queues</h3>
<div class="out"><b>Q: What is a stack, and where is the principle used in daily life?</b> LIFO — the last item in is the first out. Everyday: a stack of plates, the browser back button, Ctrl+Z.<br>
<b>Q: The three primary stack methods?</b> <span class="badge">push</span>, <span class="badge">pop</span>, <span class="badge">peek/top</span> (plus isEmpty), all O(1).<br>
<b>Q: Difference between a stack and a queue?</b> Stack removes the newest (LIFO), queue removes the oldest (FIFO). DFS uses a stack; BFS uses a queue — same traversal code, different container.<br>
<b>Q: What is a priority queue?</b> Removal is by priority, not arrival order — an ambulance jumping the queue. Implemented with a heap: insert and removeMin in O(log n).</div>

<h3>CLO3 — Recursion</h3>
<div class="out"><b>Q: How many parts does a recursive algorithm have?</b> Two: the base case and the recursive case that moves strictly toward it.<br>
<b>Q: Pros and cons of recursion?</b> Pro: mirrors recursive data (trees, file systems), shorter and clearer code. Con: each call costs a stack frame, so deep recursion risks <span class="badge">StackOverflowError</span>, and naive branching recursion repeats work (Fibonacci).<br>
<b>Q: What is the recursive step in the Fibonacci definition?</b> F(n) = F(n−1) + F(n−2) with base cases F(0) = 0, F(1) = 1.</div>

<h3>CLO4 — Trees</h3>
<div class="out"><b>Q: Binary tree versus binary search tree?</b> A binary tree only limits each node to two children; a BST additionally requires left subtree &lt; node &lt; right subtree, which is what makes O(log n) search possible.<br>
<b>Q: What happens if you insert a sorted array into a BST?</b> It degenerates into a linked list of height n and every operation becomes O(n) — the motivation for AVL (lesson 4.6).<br>
<b>Q: BST versus AVL, and the complexity of an AVL search?</b> AVL is a BST that keeps |height(left) − height(right)| ≤ 1 through rotations, so its height is Θ(log n) and search is <b>O(log n) guaranteed</b>, versus O(n) worst case for a plain BST.<br>
<b>Q: What is a heap; min-heap versus max-heap?</b> A complete binary tree in an array where every parent outranks its children — smallest at the root (min) or largest (max). Not sorted; only the root is guaranteed.</div>

<h3>CLO5 — Graphs</h3>
<div class="out"><b>Q: Ways to represent a graph, and when to use each?</b> Edge list (compact, O(m) lookups), adjacency list (O(n+m) memory, best for sparse graphs and traversal), adjacency matrix (O(n²) memory, O(1) edge test, best for dense graphs).<br>
<b>Q: DFS versus BFS?</b> DFS goes deep with a stack/recursion — used for cycles, components, topological order. BFS goes level by level with a queue — gives the fewest-edges shortest path.<br>
<b>Q: What is a Hamiltonian cycle, and can we test for one?</b> A cycle visiting every <em>vertex</em> exactly once. Unlike the Euler test (count odd degrees, O(n+m)), deciding Hamiltonicity is NP-complete — no efficient algorithm is known.</div>

<h3>CLO6 — Sorting</h3>
<div class="out"><b>Q: Complexity of selection, insertion and bubble sort?</b> All O(n²) average and worst; insertion and bubble reach O(n) on already-sorted input, selection never does because it always scans the whole remainder.<br>
<b>Q: Which of the three is fastest, and why?</b> Insertion sort in practice: it stops early on sorted runs and performs shifts instead of swaps (three times fewer writes).<br>
<b>Q: What is quick sort's key idea, and which sorts are divide and conquer?</b> Partition around a pivot so the pivot is final and the two sides are independent. Divide and conquer: quick sort, merge sort (and binary search, though it is not a sort).<br>
<b>Q: Which sorting algorithm needs the most extra space?</b> Merge sort — O(n) for the temporary buffer; quick sort needs only O(log n) of stack; heap sort O(1).</div>

<h3>CLO7 &amp; CLO8 — Hashing and text</h3>
<div class="out"><b>Q: Advantages and disadvantages of hashing?</b> O(1) average insert/search/delete; but no order (you cannot ask for "the next largest key"), performance depends on the hash function and load factor, and the worst case is O(n) under collisions.<br>
<b>Q: How do you choose a good hash function?</b> Deterministic, uniform, fast, and avalanche-like; compress with a prime modulus, and in Java keep the equals/hashCode contract (lesson 7.2).<br>
<b>Q: How many ways to resolve collisions, and how do they compare?</b> Chaining (simple, allows α &gt; 1, easy deletion) versus open addressing — linear/quadratic probing and double hashing (compact, cache-friendly, but needs tombstones for deletion).<br>
<b>Q: Complexity of brute force and of KMP?</b> Brute force O(n·m); KMP O(n + m) after O(m) preprocessing, because the failure array lets the text index never move backwards.<br>
<b>Q: Lossy versus lossless compression; Huffman versus LZW?</b> Lossless (RLE, Huffman, LZW) restores the original exactly; lossy (JPEG, MP3) discards imperceptible detail. Huffman exploits symbol frequency and must ship its tree; LZW builds a dictionary of repeated substrings that the decoder rebuilds by itself.</div>

<div class="pitfall"><b>Do not answer with a definition alone.</b> The rubric rewards a complexity figure and a concrete example. "A stack is LIFO" earns half; "A stack is LIFO, push/pop/peek are O(1), and it is how DFS and the undo feature work" earns full marks.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Answer with the trade-off, not the winner.</b> Whenever a question compares two structures, the strongest answer names the workload that decides it: "linked list if I insert and delete at known positions; array if I index or scan, because of cache locality". Examiners and interviewers both grade for this: recognising that there is no universally better structure is the actual learning outcome of CSD201. <em>Beyond syllabus because the question list asks "which is better", while the professional answer is always "for what workload".</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Ôn thi · Bài 9.2</span>
<h2>Những câu hỏi mà giảng viên đang cầm sẵn trong tay</h2>
<p class="lead">Syllabus CSD201 kèm 120 "câu hỏi kiến tạo" gắn với từng buổi học — và các bài progress test cùng phần vấn đáp đều rút ra từ đó. Dưới đây là bộ cốt lõi theo từng CLO kèm câu trả lời mẫu: hai câu, một con số độ phức tạp, và một ví dụ. Đó là hình dạng của một câu trả lời trọn điểm.</p>

<h3>CLO1 — Danh sách</h3>
<div class="out"><b>Hỏi: Ưu điểm của danh sách liên kết so với mảng?</b> Chèn và xoá tại vị trí đã biết là O(1) (không phải dời chỗ), và kích thước lớn dần mà không phải cấp phát lại. <em>Cái giá:</em> mất khả năng truy cập theo chỉ số O(1) và tốn thêm 1–2 tham chiếu mỗi nút.<br>
<b>Hỏi: Nhược điểm của danh sách liên kết?</b> Không truy cập ngẫu nhiên được (get(i) là O(n)), tốn bộ nhớ phụ mỗi nút, và tính cục bộ cache kém vì các nút nằm rải rác.<br>
<b>Hỏi: Khác biệt giữa liên kết đơn, vòng và đôi?</b> Đơn: một con trỏ <span class="badge">next</span>, chỉ đi tới. Vòng: nút cuối trỏ về nút đầu nên không có điểm kết null — hợp cho quay vòng lần lượt. Đôi: có thêm <span class="badge">prev</span>, nhờ đó removeLast và "xoá chính nút này" thành O(1) (bài 1.3).</div>

<h3>CLO2 — Ngăn xếp &amp; hàng đợi</h3>
<div class="out"><b>Hỏi: Ngăn xếp là gì, nguyên lý đó dùng ở đâu trong đời sống?</b> LIFO — vào sau ra trước. Đời thường: chồng đĩa, nút Back của trình duyệt, Ctrl+Z.<br>
<b>Hỏi: Ba phương thức chính của ngăn xếp?</b> <span class="badge">push</span>, <span class="badge">pop</span>, <span class="badge">peek/top</span> (thêm isEmpty), tất cả O(1).<br>
<b>Hỏi: Khác biệt giữa ngăn xếp và hàng đợi?</b> Ngăn xếp lấy ra phần tử mới nhất (LIFO), hàng đợi lấy ra phần tử cũ nhất (FIFO). DFS dùng ngăn xếp; BFS dùng hàng đợi — cùng đoạn code duyệt, khác cái vật chứa.<br>
<b>Hỏi: Hàng đợi ưu tiên là gì?</b> Lấy ra theo độ ưu tiên chứ không theo thứ tự đến — như xe cứu thương được ưu tiên qua cổng. Cài bằng heap: chèn và lấy-min đều O(log n).</div>

<h3>CLO3 — Đệ quy</h3>
<div class="out"><b>Hỏi: Một thuật toán đệ quy có mấy phần chính?</b> Hai: trường hợp cơ sở và trường hợp đệ quy tiến nghiêm ngặt về phía cơ sở.<br>
<b>Hỏi: Ưu và nhược của đệ quy?</b> Ưu: phản chiếu dữ liệu đệ quy (cây, hệ thống tệp), code ngắn và rõ hơn. Nhược: mỗi lời gọi tốn một khung ngăn xếp nên đệ quy sâu có nguy cơ <span class="badge">StackOverflowError</span>, và đệ quy phân nhánh ngây thơ lặp lại công việc (Fibonacci).<br>
<b>Hỏi: Bước đệ quy trong định nghĩa Fibonacci là gì?</b> F(n) = F(n−1) + F(n−2) với cơ sở F(0) = 0, F(1) = 1.</div>

<h3>CLO4 — Cây</h3>
<div class="out"><b>Hỏi: Cây nhị phân khác cây nhị phân tìm kiếm ở đâu?</b> Cây nhị phân chỉ giới hạn mỗi nút có hai con; BST đòi hỏi thêm cây con trái &lt; nút &lt; cây con phải, và chính điều đó cho phép tìm kiếm O(log n).<br>
<b>Hỏi: Chuyện gì xảy ra nếu chèn một mảng đã sắp vào BST?</b> Nó suy biến thành danh sách liên kết chiều cao n và mọi thao tác thành O(n) — đó là động cơ ra đời của AVL (bài 4.6).<br>
<b>Hỏi: BST với AVL, và độ phức tạp tìm kiếm trên AVL?</b> AVL là BST giữ |chiều cao(trái) − chiều cao(phải)| ≤ 1 bằng các phép xoay, nên chiều cao là Θ(log n) và tìm kiếm <b>O(log n) đảm bảo</b>, so với O(n) xấu nhất của BST thường.<br>
<b>Hỏi: Heap là gì; heap min khác heap max ra sao?</b> Là cây nhị phân đầy đủ lưu trên mảng, mọi nút cha đều trội hơn các con — nhỏ nhất ở gốc (min) hoặc lớn nhất ở gốc (max). Nó không được sắp; chỉ gốc là chắc chắn.</div>

<h3>CLO5 — Đồ thị</h3>
<div class="out"><b>Hỏi: Có những cách nào biểu diễn đồ thị, và khi nào dùng cái nào?</b> Danh sách cạnh (gọn, tra cứu O(m)), danh sách kề (bộ nhớ O(n+m), tốt nhất cho đồ thị thưa và cho việc duyệt), ma trận kề (bộ nhớ O(n²), kiểm cạnh O(1), tốt nhất cho đồ thị dày).<br>
<b>Hỏi: DFS khác BFS thế nào?</b> DFS đi sâu bằng ngăn xếp/đệ quy — dùng cho chu trình, thành phần liên thông, thứ tự tô-pô. BFS đi từng tầng bằng hàng đợi — cho đường đi ngắn nhất theo số cạnh.<br>
<b>Hỏi: Chu trình Hamilton là gì, có kiểm được không?</b> Là chu trình đi qua mọi <em>đỉnh</em> đúng một lần. Khác phép kiểm Euler (đếm số đỉnh bậc lẻ, O(n+m)), việc quyết định tồn tại chu trình Hamilton là NP-đầy đủ — chưa ai biết thuật toán hiệu quả.</div>

<h3>CLO6 — Sắp xếp</h3>
<div class="out"><b>Hỏi: Độ phức tạp của selection, insertion và bubble sort?</b> Cả ba đều O(n²) trung bình và xấu nhất; insertion và bubble đạt O(n) trên đầu vào đã sắp, còn selection thì không bao giờ vì luôn quét hết phần còn lại.<br>
<b>Hỏi: Trong ba cái đó cái nào nhanh nhất, vì sao?</b> Insertion sort trong thực tế: nó dừng sớm trên các đoạn đã có thứ tự và thực hiện phép dời chỗ thay vì đổi chỗ (ít hơn ba lần số phép ghi).<br>
<b>Hỏi: Ý tưởng cốt lõi của quick sort, và những thuật toán nào là chia để trị?</b> Phân hoạch quanh một chốt sao cho chốt về đúng chỗ cuối cùng và hai bên độc lập nhau. Chia để trị: quick sort, merge sort (và tìm kiếm nhị phân, dù nó không phải phép sắp).<br>
<b>Hỏi: Thuật toán sắp xếp nào tốn bộ nhớ phụ nhiều nhất?</b> Merge sort — O(n) cho vùng đệm tạm; quick sort chỉ cần O(log n) ngăn xếp; heap sort O(1).</div>

<h3>CLO7 &amp; CLO8 — Băm và văn bản</h3>
<div class="out"><b>Hỏi: Ưu và nhược điểm của băm?</b> Chèn/tìm/xoá O(1) trung bình; nhưng không có thứ tự (không hỏi được "khoá lớn kế tiếp"), hiệu năng phụ thuộc hàm băm và hệ số tải, và xấu nhất là O(n) khi va chạm nhiều.<br>
<b>Hỏi: Chọn hàm băm tốt thế nào?</b> Tất định, phân bố đều, nhanh, và có hiệu ứng tuyết lở; nén bằng mô-đun nguyên tố, và trong Java phải giữ giao ước equals/hashCode (bài 7.2).<br>
<b>Hỏi: Có mấy cách xử lý va chạm, so sánh chúng?</b> Dây xích (đơn giản, cho phép α &gt; 1, xoá dễ) so với địa chỉ mở — dò tuyến tính/bậc hai và băm kép (gọn, thân thiện cache, nhưng phải dùng bia mộ khi xoá).<br>
<b>Hỏi: Độ phức tạp của vét cạn và của KMP?</b> Vét cạn O(n·m); KMP O(n + m) sau khi tiền xử lý O(m), vì mảng thất bại làm chỉ số văn bản không bao giờ lùi lại.<br>
<b>Hỏi: Nén mất mát khác không mất mát; Huffman khác LZW?</b> Không mất mát (RLE, Huffman, LZW) khôi phục nguyên bản chính xác; mất mát (JPEG, MP3) vứt đi chi tiết mắt/tai không nhận ra. Huffman khai thác tần suất ký hiệu và phải gửi kèm cây; LZW dựng từ điển các xâu con lặp lại mà bên giải mã tự dựng lại được.</div>

<div class="pitfall"><b>Đừng trả lời chỉ bằng một định nghĩa.</b> Thang chấm thưởng cho con số độ phức tạp và một ví dụ cụ thể. "Ngăn xếp là LIFO" được nửa điểm; "Ngăn xếp là LIFO, push/pop/peek đều O(1), và nó là cách DFS cùng tính năng hoàn tác hoạt động" mới trọn điểm.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Trả lời bằng sự đánh đổi, không phải bằng kẻ thắng cuộc.</b> Mỗi khi câu hỏi so sánh hai cấu trúc, câu trả lời mạnh nhất nêu ra tải công việc quyết định điều đó: "danh sách liên kết nếu tôi chèn và xoá ở vị trí đã biết; mảng nếu tôi truy cập theo chỉ số hoặc quét, vì tính cục bộ cache". Cả người chấm lẫn người phỏng vấn đều chấm điểm chỗ này: nhận ra rằng không có cấu trúc nào tốt hơn một cách phổ quát mới đúng là chuẩn đầu ra thật của CSD201. <em>Ngoài giáo trình vì danh sách câu hỏi hỏi "cái nào tốt hơn", còn câu trả lời chuyên nghiệp luôn là "tốt hơn cho tải công việc nào".</em></div>
</div>
`,
        },
        {
          title: '9.3 — The complexity cheat sheet & 12 exam traps|||9.3 — Bảng tra độ phức tạp & 12 bẫy đề thi',
          slug: 'csd201-bang-tra-do-phuc-tap',
          type: 'VIDEO',
          description: 'Một bảng tra duy nhất cho mọi cấu trúc/thuật toán trong môn, kèm 12 khẳng định sai hay bị mắc bẫy.',
          content: `
<div class="ml-en">
<span class="eyebrow">Exam prep · Lesson 9.3</span>
<h2>Everything on one page</h2>
<p class="lead">Print this. Most multiple-choice questions in the FE are a single cell of one of these tables — and most wrong answers come from the twelve traps at the end.</p>

<h3>Data structures</h3>
<table><thead><tr><th>Structure</th><th>Access</th><th>Search</th><th>Insert</th><th>Delete</th><th>Memory</th></tr></thead><tbody>
<tr><td>Array</td><td><b>O(1)</b></td><td>O(n)</td><td>O(n)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>Sorted array</td><td><b>O(1)</b></td><td><b>O(log n)</b></td><td>O(n)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>Singly linked list</td><td>O(n)</td><td>O(n)</td><td>O(1)*</td><td>O(1)*</td><td>O(n)</td></tr>
<tr><td>Doubly linked list</td><td>O(n)</td><td>O(n)</td><td>O(1)*</td><td><b>O(1)*</b></td><td>O(n)</td></tr>
<tr><td>Stack / Queue / Deque</td><td>O(1) at the ends</td><td>O(n)</td><td><b>O(1)</b></td><td><b>O(1)</b></td><td>O(n)</td></tr>
<tr><td>Binary heap</td><td>O(1) root</td><td>O(n)</td><td>O(log n)</td><td>O(log n)</td><td>O(n)</td></tr>
<tr><td>BST (average)</td><td>—</td><td>O(log n)</td><td>O(log n)</td><td>O(log n)</td><td>O(n)</td></tr>
<tr><td>BST (worst)</td><td>—</td><td><b>O(n)</b></td><td>O(n)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>AVL / Red-Black</td><td>—</td><td><b>O(log n)</b></td><td>O(log n)</td><td>O(log n)</td><td>O(n)</td></tr>
<tr><td>Hash table (average)</td><td>—</td><td><b>O(1)</b></td><td><b>O(1)</b></td><td><b>O(1)</b></td><td>O(n)</td></tr>
<tr><td>Hash table (worst)</td><td>—</td><td>O(n)</td><td>O(n)</td><td>O(n)</td><td>O(n)</td></tr>
</tbody></table>
<p>* provided you already hold a reference to the position; finding it first costs O(n).</p>

<h3>Graph algorithms (adjacency list, n vertices, m edges)</h3>
<table><thead><tr><th>Algorithm</th><th>Cost</th><th>Answers</th></tr></thead><tbody>
<tr><td>BFS</td><td>O(n + m)</td><td>fewest-edges path, levels</td></tr>
<tr><td>DFS</td><td>O(n + m)</td><td>components, cycles, topological order</td></tr>
<tr><td>Dijkstra (binary heap)</td><td>O((n + m) log n)</td><td>shortest path, weights ≥ 0</td></tr>
<tr><td>Bellman–Ford</td><td>O(n · m)</td><td>shortest path with negative weights</td></tr>
<tr><td>Prim (heap)</td><td>O(m log n)</td><td>MST, dense graphs</td></tr>
<tr><td>Kruskal</td><td>O(m log m)</td><td>MST, sparse graphs</td></tr>
<tr><td>Union-Find</td><td>O(α(n)) ≈ O(1)</td><td>"same component?"</td></tr>
</tbody></table>

<h3>The twelve traps — each of these statements is FALSE</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>1.</b> "A heap is a sorted array." — No. Only parent ≤ child holds; siblings are unordered (lesson 4.7).</div>
  <div class="lz-layer"><b>2.</b> "Quick sort is always O(n log n)." — Its worst case is O(n²), on sorted input with a bad pivot (6.3).</div>
  <div class="lz-layer"><b>3.</b> "Hash tables are always O(1)." — Average, not worst. All-colliding keys give O(n) (7.3).</div>
  <div class="lz-layer"><b>4.</b> "Binary search works on any array." — Only on a <em>sorted</em> one.</div>
  <div class="lz-layer"><b>5.</b> "In-order traversal of any binary tree gives sorted output." — Only for a BST (4.3).</div>
  <div class="lz-layer"><b>6.</b> "Dijkstra handles negative weights." — It does not; use Bellman–Ford (5.5).</div>
  <div class="lz-layer"><b>7.</b> "The MST also gives shortest paths." — Different problems; the MST minimises the total, not any pair's distance (5.6).</div>
  <div class="lz-layer"><b>8.</b> "A linked list inserts in O(1) at any index." — Only once you are at the position; <span class="badge">add(k, e)</span> walks k nodes first (1.4).</div>
  <div class="lz-layer"><b>9.</b> "Merge sort sorts in place." — It needs an O(n) buffer (6.4).</div>
  <div class="lz-layer"><b>10.</b> "Radix sort beats the Ω(n log n) lower bound." — It sidesteps it by not comparing; the bound only covers comparison sorts (6.6/6.7).</div>
  <div class="lz-layer"><b>11.</b> "Deleting from an open-addressing table means clearing the slot." — That breaks the probe chain; you need a tombstone (7.3).</div>
  <div class="lz-layer"><b>12.</b> "All degrees even ⟹ an Euler cycle exists." — Only if the graph is also connected (5.7).</div>
</div>

<h3>How to answer a "which structure?" question in three lines</h3>
<div class="out"><b>Template:</b> (1) name the operation that dominates the workload; (2) give its cost in each candidate structure; (3) pick, and state the price you pay.<br>
<b>Example — "A system must find a customer by ID and also list all customers in ID order. Which structure?"</b><br>
(1) Two operations: point lookup and ordered iteration. (2) Hash table = O(1) lookup but <em>no order</em>; balanced BST = O(log n) lookup and O(n) in-order iteration. (3) Choose the balanced tree (TreeMap): the ordering requirement rules the hash table out entirely, and O(log n) ≈ 20 steps for a million customers is cheap. Price: lookups are logarithmic rather than constant.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Learn the absolute numbers, not just the symbols.</b> A modern CPU does ~10⁹ simple operations per second. So n = 10⁶ with an O(n²) algorithm is 10¹² operations ≈ 15 minutes, while O(n log n) is 2 × 10⁷ ≈ 0.02 s. Under a 1-second limit the practical ceilings are roughly: O(n!) → n ≤ 11 · O(2ⁿ) → n ≤ 25 · O(n³) → n ≤ 500 · O(n²) → n ≤ 10,000 · O(n log n) → n ≤ 10⁶ · O(n) → n ≤ 10⁸. Reading the input size therefore tells you which complexity class the intended solution belongs to — before you have thought about the problem at all. <em>Beyond syllabus because the course teaches asymptotics abstractly, while competitive programmers use this table to choose the algorithm from the constraints.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Ôn thi · Bài 9.3</span>
<h2>Toàn bộ môn học trên một trang</h2>
<p class="lead">Hãy in trang này ra. Phần lớn câu trắc nghiệm trong FE chính là một ô của các bảng dưới đây — và phần lớn đáp án sai đến từ mười hai cái bẫy ở cuối bài.</p>

<h3>Cấu trúc dữ liệu</h3>
<table><thead><tr><th>Cấu trúc</th><th>Truy cập</th><th>Tìm kiếm</th><th>Chèn</th><th>Xoá</th><th>Bộ nhớ</th></tr></thead><tbody>
<tr><td>Mảng</td><td><b>O(1)</b></td><td>O(n)</td><td>O(n)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>Mảng đã sắp</td><td><b>O(1)</b></td><td><b>O(log n)</b></td><td>O(n)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>Liên kết đơn</td><td>O(n)</td><td>O(n)</td><td>O(1)*</td><td>O(1)*</td><td>O(n)</td></tr>
<tr><td>Liên kết đôi</td><td>O(n)</td><td>O(n)</td><td>O(1)*</td><td><b>O(1)*</b></td><td>O(n)</td></tr>
<tr><td>Stack / Queue / Deque</td><td>O(1) ở hai đầu</td><td>O(n)</td><td><b>O(1)</b></td><td><b>O(1)</b></td><td>O(n)</td></tr>
<tr><td>Heap nhị phân</td><td>O(1) tại gốc</td><td>O(n)</td><td>O(log n)</td><td>O(log n)</td><td>O(n)</td></tr>
<tr><td>BST (trung bình)</td><td>—</td><td>O(log n)</td><td>O(log n)</td><td>O(log n)</td><td>O(n)</td></tr>
<tr><td>BST (xấu nhất)</td><td>—</td><td><b>O(n)</b></td><td>O(n)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>AVL / Đỏ-đen</td><td>—</td><td><b>O(log n)</b></td><td>O(log n)</td><td>O(log n)</td><td>O(n)</td></tr>
<tr><td>Bảng băm (trung bình)</td><td>—</td><td><b>O(1)</b></td><td><b>O(1)</b></td><td><b>O(1)</b></td><td>O(n)</td></tr>
<tr><td>Bảng băm (xấu nhất)</td><td>—</td><td>O(n)</td><td>O(n)</td><td>O(n)</td><td>O(n)</td></tr>
</tbody></table>
<p>* với điều kiện bạn đã cầm sẵn tham chiếu tới vị trí đó; tìm ra nó trước thì tốn O(n).</p>

<h3>Thuật toán đồ thị (danh sách kề, n đỉnh, m cạnh)</h3>
<table><thead><tr><th>Thuật toán</th><th>Chi phí</th><th>Trả lời câu hỏi</th></tr></thead><tbody>
<tr><td>BFS</td><td>O(n + m)</td><td>đường ít cạnh nhất, phân tầng</td></tr>
<tr><td>DFS</td><td>O(n + m)</td><td>thành phần liên thông, chu trình, thứ tự tô-pô</td></tr>
<tr><td>Dijkstra (heap nhị phân)</td><td>O((n + m) log n)</td><td>đường ngắn nhất, trọng số ≥ 0</td></tr>
<tr><td>Bellman–Ford</td><td>O(n · m)</td><td>đường ngắn nhất có trọng số âm</td></tr>
<tr><td>Prim (heap)</td><td>O(m log n)</td><td>MST, đồ thị dày</td></tr>
<tr><td>Kruskal</td><td>O(m log m)</td><td>MST, đồ thị thưa</td></tr>
<tr><td>Union-Find</td><td>O(α(n)) ≈ O(1)</td><td>"cùng thành phần không?"</td></tr>
</tbody></table>

<h3>Mười hai cái bẫy — mọi khẳng định dưới đây đều SAI</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>1.</b> "Heap là một mảng đã sắp." — Không. Chỉ có cha ≤ con; hai nút anh em không có thứ tự (bài 4.7).</div>
  <div class="lz-layer"><b>2.</b> "Quick sort luôn O(n log n)." — Xấu nhất của nó là O(n²), trên đầu vào đã sắp với chốt tệ (6.3).</div>
  <div class="lz-layer"><b>3.</b> "Bảng băm luôn O(1)." — Trung bình, không phải xấu nhất. Khoá va chạm hết thì thành O(n) (7.3).</div>
  <div class="lz-layer"><b>4.</b> "Tìm kiếm nhị phân chạy trên mảng bất kỳ." — Chỉ trên mảng <em>đã sắp</em>.</div>
  <div class="lz-layer"><b>5.</b> "Duyệt trung thứ tự cây nhị phân bất kỳ cho kết quả đã sắp." — Chỉ đúng với BST (4.3).</div>
  <div class="lz-layer"><b>6.</b> "Dijkstra xử lý được trọng số âm." — Không; hãy dùng Bellman–Ford (5.5).</div>
  <div class="lz-layer"><b>7.</b> "MST cũng cho đường đi ngắn nhất." — Hai bài toán khác nhau; MST tối tiểu tổng, không tối tiểu khoảng cách của cặp nào (5.6).</div>
  <div class="lz-layer"><b>8.</b> "Danh sách liên kết chèn O(1) ở chỉ số bất kỳ." — Chỉ khi đã đứng ở vị trí đó; <span class="badge">add(k, e)</span> vẫn phải đi qua k nút (1.4).</div>
  <div class="lz-layer"><b>9.</b> "Merge sort sắp tại chỗ." — Nó cần vùng đệm O(n) (6.4).</div>
  <div class="lz-layer"><b>10.</b> "Radix sort phá được cận dưới Ω(n log n)." — Nó né cận đó bằng cách không so sánh; cận này chỉ áp cho các phép sắp so sánh (6.6/6.7).</div>
  <div class="lz-layer"><b>11.</b> "Xoá khỏi bảng địa chỉ mở là xoá trắng ô đó." — Làm vậy đứt dãy dò; phải dùng bia mộ (7.3).</div>
  <div class="lz-layer"><b>12.</b> "Mọi bậc đều chẵn ⟹ tồn tại chu trình Euler." — Chỉ đúng nếu đồ thị còn liên thông nữa (5.7).</div>
</div>

<h3>Cách trả lời câu "chọn cấu trúc nào?" trong ba dòng</h3>
<div class="out"><b>Khuôn:</b> (1) gọi tên thao tác chiếm ưu thế trong tải công việc; (2) nêu chi phí của nó ở từng ứng viên; (3) chọn, và nói rõ cái giá phải trả.<br>
<b>Ví dụ — "Hệ thống cần tra khách hàng theo mã và cũng cần liệt kê mọi khách theo thứ tự mã. Chọn cấu trúc nào?"</b><br>
(1) Hai thao tác: tra một điểm và duyệt theo thứ tự. (2) Bảng băm = tra O(1) nhưng <em>không có thứ tự</em>; cây cân bằng = tra O(log n) và duyệt trung thứ tự O(n). (3) Chọn cây cân bằng (TreeMap): yêu cầu về thứ tự loại thẳng bảng băm, còn O(log n) ≈ 20 bước cho một triệu khách là quá rẻ. Cái giá: tra cứu là lô-ga-rít thay vì hằng số.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hãy thuộc con số tuyệt đối, đừng chỉ thuộc ký hiệu.</b> Một CPU hiện đại làm ~10⁹ thao tác đơn giản mỗi giây. Vậy n = 10⁶ với thuật toán O(n²) là 10¹² thao tác ≈ 15 phút, còn O(n log n) là 2 × 10⁷ ≈ 0,02 giây. Dưới giới hạn 1 giây, trần thực dụng đại khái là: O(n!) → n ≤ 11 · O(2ⁿ) → n ≤ 25 · O(n³) → n ≤ 500 · O(n²) → n ≤ 10.000 · O(n log n) → n ≤ 10⁶ · O(n) → n ≤ 10⁸. Nhờ vậy, đọc cỡ dữ liệu vào là biết lời giải mong đợi thuộc lớp độ phức tạp nào — trước cả khi nghĩ về bài toán. <em>Ngoài giáo trình vì môn học dạy tiệm cận một cách trừu tượng, còn dân lập trình thi đấu dùng đúng bảng này để chọn thuật toán từ ràng buộc đề bài.</em></div>
</div>
`,
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
          "slug": "csd201-final-exam-pe",
          "type": "article",
          "description": "Khung thi thực hành (PE) của môn — format, cách chấm và cách chuẩn bị. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · PE</span>\n<h2>PE — Practical Exam</h2>\n<p class=\"lead\">The Practical Exam (PE) is a <strong>hands-on coding exam</strong>: you are given a problem or feature and must write (and usually run) working code on the machine within a time limit. It is graded on correctness, whether it runs, and good practice.</p>\n<h3>How to prepare</h3>\n<ul>\n<li>Rebuild small features from a blank file, <em>without notes</em> &mdash; copying tutorials is not enough.</li>\n<li>Practise the core pattern of this subject end-to-end until you can do it from memory.</li>\n<li>Read the requirement twice; build the smallest working version first, then extend.</li>\n<li>Test as you go; a program that runs and does 80% beats one that does not compile.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> A real practical prompt bank for this subject will be added here later, in the exam room. Use the guidance above to prepare now.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · PE</span>\n<h2>PE — Thi thực hành</h2>\n<p class=\"lead\">Thi thực hành (PE) là <strong>thi code trực tiếp</strong>: bạn được giao một bài toán/tính năng và phải viết (thường là chạy) code hoạt động trên máy trong thời gian quy định. Chấm theo tính đúng, có chạy được không, và thực hành tốt.</p>\n<h3>Cách chuẩn bị</h3>\n<ul>\n<li>Dựng lại các tính năng nhỏ từ một file trống, <em>không nhìn ghi chú</em> &mdash; chép tutorial là chưa đủ.</li>\n<li>Luyện mẫu cốt lõi của môn đầu-cuối tới khi làm được từ trí nhớ.</li>\n<li>Đọc yêu cầu hai lần; dựng bản chạy được nhỏ nhất trước, rồi mở rộng.</li>\n<li>Test dọc đường; một chương trình chạy và làm được 80% hơn một chương trình không biên dịch nổi.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Ngân hàng đề thực hành thật cho môn này sẽ được thêm vào đây sau, trong trang phòng thi. Dùng hướng dẫn trên để chuẩn bị ngay từ giờ.</div>\n</div>"
        },
        {
          "title": "FE — Final Exam (Multiple Choice)|||FE — Thi trắc nghiệm cuối kỳ",
          "slug": "csd201-final-exam-fe",
          "type": "article",
          "description": "Khung thi trắc nghiệm cuối kỳ (FE) + vài câu mẫu từ môn. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · FE</span>\n<h2>FE — Final Exam (Multiple Choice)</h2>\n<p class=\"lead\">The Final Exam (FE) for this subject is a <strong>computer-graded multiple-choice test</strong>. For the exact number of questions, duration, weight and pass mark, see <em>Lesson 0.2 — Grading</em>.</p>\n<h3>How to do well</h3>\n<ul>\n<li>Pace yourself: divide time by the number of questions; flag hard ones and return at the end.</li>\n<li>Eliminate clearly wrong options first, then choose among the rest.</li>\n<li>For \"what should you do / which is best\" items, answer by this subject's method, not gut feeling.</li>\n<li>Never leave the gated final blank &mdash; an educated guess beats an empty answer.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> The questions below are <strong>sample questions</strong> drawn from this course to show the format. The <em>real past-exam questions</em> will be added here later, in the exam room.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · FE</span>\n<h2>FE — Thi trắc nghiệm cuối kỳ</h2>\n<p class=\"lead\">Bài thi cuối kỳ (FE) của môn này là <strong>thi trắc nghiệm, máy chấm</strong>. Số câu, thời gian, trọng số và điểm qua cụ thể: xem <em>Bài 0.2 — Thang điểm</em>.</p>\n<h3>Cách làm tốt</h3>\n<ul>\n<li>Phân bổ thời gian: chia đều theo số câu; đánh dấu câu khó, quay lại ở cuối.</li>\n<li>Loại phương án sai rõ ràng trước, rồi chọn trong số còn lại.</li>\n<li>Câu \"nên làm gì / cái nào tốt nhất\" &mdash; trả lời theo phương pháp của môn, không theo cảm tính.</li>\n<li>Đừng bao giờ bỏ trống bài thi có cổng &mdash; đoán có suy luận vẫn hơn để trống.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Các câu dưới đây là <strong>câu mẫu</strong> lấy từ chính môn học để minh hoạ format. <em>Đề thi thật</em> sẽ được thêm vào đây sau, trong trang phòng thi.</div>\n</div>",
          "quiz": {
            "timeLimitSeconds": 360,
            "questions": [
              {
                "id": "q1",
                "points": 1,
                "question": "Accessing element i in an array is…|||Truy cập phần tử i trong mảng là…",
                "options": [
                  "O(n)",
                  "O(1)",
                  "O(log n)",
                  "O(n²)"
                ],
                "correctIndex": 1
              },
              {
                "id": "q2",
                "points": 1,
                "question": "Inserting at the front of an array is O(n) because…|||Chèn đầu mảng là O(n) vì…",
                "options": [
                  "arrays are slow|||mảng chậm",
                  "all following elements must shift right|||mọi phần tử sau phải dời phải",
                  "it re-sorts|||nó sắp lại",
                  "it copies to disk|||nó copy ra đĩa"
                ],
                "correctIndex": 1
              },
              {
                "id": "q3",
                "points": 1,
                "question": "A linked list beats an array when you…|||Danh sách liên kết hơn mảng khi bạn…",
                "options": [
                  "need random access by index|||cần truy cập ngẫu nhiên theo chỉ số",
                  "insert/delete often at known nodes|||chèn/xóa thường tại nút đã biết",
                  "need contiguous memory|||cần bộ nhớ liền kề",
                  "never change it|||không bao giờ đổi"
                ],
                "correctIndex": 1
              },
              {
                "id": "q4",
                "points": 1,
                "question": "A doubly linked list node stores…|||Một nút danh sách liên kết đôi lưu…",
                "options": [
                  "only next|||chỉ next",
                  "both next and prev pointers|||cả con trỏ next và prev",
                  "an index|||một chỉ số",
                  "nothing extra|||không thêm gì"
                ],
                "correctIndex": 1
              },
              {
                "id": "q5",
                "points": 1,
                "question": "A stack removes…|||Ngăn xếp lấy ra…",
                "options": [
                  "the oldest item (FIFO)|||phần tử cũ nhất (FIFO)",
                  "the most recently added item (LIFO)|||phần tử thêm gần nhất (LIFO)",
                  "the smallest item|||phần tử nhỏ nhất",
                  "a random item|||phần tử ngẫu nhiên"
                ],
                "correctIndex": 1
              },
              {
                "id": "q6",
                "points": 1,
                "question": "A binary min-heap gives insert/remove-min in…|||Heap nhị phân min cho chèn/lấy-min trong…",
                "options": [
                  "O(1)",
                  "O(log n)",
                  "O(n)",
                  "O(n²)"
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
