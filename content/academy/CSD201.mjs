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
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Big-O deep dive · balanced trees · Dijkstra &amp; MST</div><div class="lz-nsub">Toward algorithmic maturity</div></div></div>
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
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Big-O sâu · cây cân bằng · Dijkstra &amp; MST</div><div class="lz-nsub">Hướng tới độ chín về thuật toán</div></div></div>
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
          title: '2.2 — Priority Queues & Heaps|||2.2 — Hàng đợi ưu tiên & Heap',
          slug: 'csd201-priority-queue-heap',
          type: 'VIDEO',
          description: 'Hàng đợi ưu tiên luôn lấy phần tử "quan trọng nhất"; heap nhị phân cho phép O(log n).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
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
<span class="eyebrow">Chương 2 · Bài 2.2</span>
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
          title: '4.2 — Binary Search Trees|||4.2 — Cây nhị phân tìm kiếm (BST)',
          slug: 'csd201-bst',
          type: 'VIDEO',
          description: 'BST: trái < nút < phải → tìm/chèn/xóa O(log n) khi cân bằng, O(n) khi suy biến.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
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
<span class="eyebrow">Chương 4 · Bài 4.2</span>
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
      ],
    },

    /* ══════════════════ NÂNG CAO ══════════════════ */
    {
      title: 'Advanced — Beyond the syllabus|||Nâng cao — Ngoài giáo trình',
      description: 'Cây cân bằng và thuật toán đồ thị có trọng số — bước tiếp theo để thành thạo thuật toán.',
      lessons: [
        {
          title: 'A.1 — Balanced trees (AVL, Red-Black)|||A.1 — Cây cân bằng (AVL, Red-Black)',
          slug: 'csd201-cay-can-bang',
          type: 'VIDEO',
          description: 'Vì sao BST cần tự cân bằng, và cách AVL/Red-Black giữ O(log n) đảm bảo.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced · Lesson A.1</span>
<h2>Balanced trees — keeping O(log n) guaranteed</h2>
<p class="lead">A plain BST can degrade to O(n). Balanced trees fix this by re-balancing on every insert/delete so the height stays ~log n. This is what makes Java's <span class="badge">TreeMap</span> reliable.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>AVL tree</b> — strictly balanced: heights of the two subtrees differ by at most 1. Rotations restore balance. Fast lookups.</div>
  <div class="lz-layer"><b>Red-Black tree</b> — looser balance via colour rules; fewer rotations on insert/delete. Used by most standard libraries (TreeMap, C++ map).</div>
</div>
<div class="note-ct">You do not usually implement these from scratch, but knowing <em>why</em> they exist — to guarantee O(log n) — is a common exam and interview question.</div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms#module-811" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">Practise: Balanced Trees</span><span class="lc-sub">Advanced Data Structures module.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao · Bài A.1</span>
<h2>Cây cân bằng — giữ O(log n) đảm bảo</h2>
<p class="lead">BST thường có thể suy giảm về O(n). Cây cân bằng sửa điều này bằng cách tái cân bằng sau mỗi chèn/xóa để độ cao giữ ~log n. Đây là điều làm <span class="badge">TreeMap</span> của Java đáng tin.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Cây AVL</b> — cân bằng chặt: độ cao hai cây con chênh nhau tối đa 1. Phép xoay khôi phục cân bằng. Tra cứu nhanh.</div>
  <div class="lz-layer"><b>Cây Red-Black</b> — cân bằng lỏng hơn qua luật màu; ít phép xoay khi chèn/xóa. Dùng bởi hầu hết thư viện chuẩn (TreeMap, map của C++).</div>
</div>
<div class="note-ct">Bạn thường không tự cài từ đầu, nhưng biết <em>vì sao</em> chúng tồn tại — để đảm bảo O(log n) — là câu hỏi thi và phỏng vấn phổ biến.</div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms#module-811" target="_blank" rel="noopener">
  <span class="lc-ico">⚖️</span>
  <span class="lc-body"><span class="lc-title">Luyện: Balanced Trees</span><span class="lc-sub">Module Advanced Data Structures.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'A.2 — Weighted graphs: Dijkstra & MST|||A.2 — Đồ thị trọng số: Dijkstra & MST',
          slug: 'csd201-dijkstra-mst',
          type: 'VIDEO',
          description: 'Đường ngắn nhất (Dijkstra) và cây khung nhỏ nhất (Prim/Kruskal) — dùng heap & union-find.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced · Lesson A.2</span>
<h2>Weighted graphs — shortest paths &amp; spanning trees</h2>
<p class="lead">When edges carry weights (distances, costs), BFS is not enough. Two celebrated algorithms solve the classic problems, and both reuse structures from this course.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Dijkstra's algorithm</b> — shortest path from one source to all vertices in a non-negative weighted graph. Uses a <span class="badge">priority queue</span>; O((V+E) log V).</div>
  <div class="lz-layer"><b>Minimum Spanning Tree</b> — connect all vertices with minimum total edge weight. <b>Prim</b> grows from one vertex (priority queue); <b>Kruskal</b> adds cheapest edges avoiding cycles (union-find).</div>
</div>
<div class="note-ct">These power GPS routing, network design and clustering. They are the natural finale of a data-structures course — every earlier topic shows up here.</div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms#module-809" target="_blank" rel="noopener">
  <span class="lc-ico">🗺️</span>
  <span class="lc-body"><span class="lc-title">Practise: Union-Find & advanced graphs</span><span class="lc-sub">Dijkstra, MST and beyond.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao · Bài A.2</span>
<h2>Đồ thị trọng số — đường ngắn nhất &amp; cây khung</h2>
<p class="lead">Khi các cạnh mang trọng số (khoảng cách, chi phí), BFS không đủ. Hai thuật toán nổi tiếng giải các bài toán kinh điển, và cả hai tái dùng cấu trúc trong môn này.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Thuật toán Dijkstra</b> — đường ngắn nhất từ một nguồn tới mọi đỉnh trong đồ thị trọng số không âm. Dùng <span class="badge">hàng đợi ưu tiên</span>; O((V+E) log V).</div>
  <div class="lz-layer"><b>Cây khung nhỏ nhất (MST)</b> — nối mọi đỉnh với tổng trọng số cạnh nhỏ nhất. <b>Prim</b> mọc từ một đỉnh (hàng đợi ưu tiên); <b>Kruskal</b> thêm cạnh rẻ nhất tránh chu trình (union-find).</div>
</div>
<div class="note-ct">Chúng là động cơ của định tuyến GPS, thiết kế mạng và phân cụm. Đây là màn kết tự nhiên của môn cấu trúc dữ liệu — mọi chủ đề trước đó đều xuất hiện ở đây.</div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fdata-structures-and-algorithms%2Flearn&reflabel=CSD201%20%E2%80%94%20Data%20Structures%20and%20Algorithms#module-809" target="_blank" rel="noopener">
  <span class="lc-ico">🗺️</span>
  <span class="lc-body"><span class="lc-title">Luyện: Union-Find & đồ thị nâng cao</span><span class="lc-sub">Dijkstra, MST và hơn nữa.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
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
