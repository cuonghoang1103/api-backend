/**
 * MAD102 — Discrete Mathematics (Toán rời rạc). Ngành Khoa học Máy tính FPTU.
 * Nền toán của CNTT: logic & chứng minh, tập hợp/quan hệ/hàm, thuật toán &
 * độ phức tạp, lý thuyết số, đếm & tổ hợp, truy hồi & xác suất, đồ thị & cây.
 * Sách chuẩn: Rosen "Discrete Mathematics and Its Applications"; Epp; MIT 6.042.
 * Song ngữ VI+EN + ví dụ + khối công thức. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick lồng/${...} trong HTML; & -> &amp; chỉ trong content HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('mad102-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Rosen, Epp), khoá học miễn phí (MIT 6.042, Brilliant, Khan), YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">MAD102 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Discrete Mathematics</strong> — the mathematical backbone of computer science — in one place. The official FPTU slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The FPTU giáo trình &amp; lecture slides for MAD102 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><strong>Kenneth Rosen — <em>Discrete Mathematics and Its Applications</em></strong> (McGraw-Hill). The standard textbook worldwide and the closest match to the FPTU syllabus.</li>
<li><strong>Susanna Epp — <em>Discrete Mathematics with Applications</em></strong>. Gentler, superb on proofs and logic.</li>
</ul>
<h3>🌐 Free courses &amp; documentation</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/" target="_blank" rel="noopener">MIT 6.042J — Mathematics for Computer Science (OpenCourseWare)</a> — full lectures, notes &amp; problem sets.</li>
<li><a href="https://brilliant.org/" target="_blank" rel="noopener">Brilliant — Logic, Number Theory &amp; Combinatorics</a> — interactive, intuition-first.</li>
<li><a href="https://www.khanacademy.org/computing/computer-science/cryptography" target="_blank" rel="noopener">Khan Academy — Cryptography &amp; modular arithmetic</a>.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@TrevTutor" target="_blank" rel="noopener">TheTrevTutor</a> — a full discrete-math playlist that tracks Rosen chapter by chapter.</li>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — visual intuition for probability, combinatorics &amp; graphs.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.wolframalpha.com/" target="_blank" rel="noopener">WolframAlpha</a> — check truth tables, GCDs, modular arithmetic, binomial coefficients.</li>
<li><a href="https://csacademy.com/app/graph_editor/" target="_blank" rel="noopener">CS Academy Graph Editor</a> — draw graphs &amp; trees and run algorithms visually.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — logic (propositions, quantifiers, inference) and proof techniques, especially mathematical induction.</li>
<li><strong>Structures</strong> — sets, relations, functions, then number theory (modular arithmetic, GCD).</li>
<li><strong>Counting &amp; analysis</strong> — combinatorics, Big-O growth, recurrences and discrete probability.</li>
<li><strong>Job-ready</strong> — model problems as graphs/trees and reason about correctness the way algorithm interviews expect.</li>
</ol></div>`,
    `<span class="eyebrow">MAD102 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Toán rời rạc</strong> — xương sống toán học của khoa học máy tính — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng của MAD102 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><strong>Kenneth Rosen — <em>Discrete Mathematics and Its Applications</em></strong> (McGraw-Hill). Sách chuẩn trên toàn thế giới và bám sát giáo trình FPTU nhất.</li>
<li><strong>Susanna Epp — <em>Discrete Mathematics with Applications</em></strong>. Dễ vào hơn, rất mạnh về chứng minh và logic.</li>
</ul>
<h3>🌐 Khoá học &amp; tài liệu miễn phí</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/" target="_blank" rel="noopener">MIT 6.042J — Mathematics for Computer Science (OpenCourseWare)</a> — trọn bộ bài giảng, ghi chú &amp; bài tập.</li>
<li><a href="https://brilliant.org/" target="_blank" rel="noopener">Brilliant — Logic, Lý thuyết số &amp; Tổ hợp</a> — tương tác, ưu tiên trực giác.</li>
<li><a href="https://www.khanacademy.org/computing/computer-science/cryptography" target="_blank" rel="noopener">Khan Academy — Mã hoá &amp; số học modulo</a>.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@TrevTutor" target="_blank" rel="noopener">TheTrevTutor</a> — playlist toán rời rạc đầy đủ, bám theo Rosen từng chương.</li>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — trực giác hình ảnh cho xác suất, tổ hợp &amp; đồ thị.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.wolframalpha.com/" target="_blank" rel="noopener">WolframAlpha</a> — kiểm bảng chân trị, ƯCLN, số học modulo, hệ số nhị thức.</li>
<li><a href="https://csacademy.com/app/graph_editor/" target="_blank" rel="noopener">CS Academy Graph Editor</a> — vẽ đồ thị &amp; cây và chạy thuật toán trực quan.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — logic (mệnh đề, lượng từ, suy luận) và các phương pháp chứng minh, đặc biệt là quy nạp toán học.</li>
<li><strong>Cấu trúc</strong> — tập hợp, quan hệ, hàm, rồi lý thuyết số (số học modulo, ƯCLN).</li>
<li><strong>Đếm &amp; phân tích</strong> — tổ hợp, độ tăng Big-O, truy hồi và xác suất rời rạc.</li>
<li><strong>Sẵn sàng đi làm</strong> — mô hình hoá bài toán bằng đồ thị/cây và lập luận về tính đúng đắn như phỏng vấn thuật toán yêu cầu.</li>
</ol></div>`,
  ]]);

const intro = doc('mad102-0-1-overview', 'Course overview: what is discrete mathematics?|||Tổng quan: toán rời rạc là gì?',
  'Toán rời rạc nghiên cứu các cấu trúc RỜI RẠC (đếm được) — logic, tập hợp, số nguyên, đồ thị — nền của mọi thuật toán, cấu trúc dữ liệu và mã hoá; lộ trình 8 chương.',
  [[
    `<span class="eyebrow">MAD102 · Lesson 0.1 · Overview</span>
<h2>What is discrete mathematics?</h2>
<p class="lead"><strong>Discrete mathematics</strong> is the study of structures that are <strong>separate and countable</strong> — integers, logic statements, sets, graphs — rather than the smooth, continuous quantities of calculus. It is the native language of computers, because a computer only ever deals with discrete states: 0 and 1, true and false, one node or the next.</p>
<h3>Why every CS student needs it</h3>
<ul>
<li><strong>Logic</strong> is how you reason about program correctness and write conditions.</li>
<li><strong>Proofs &amp; induction</strong> are how you show an algorithm is correct for all inputs.</li>
<li><strong>Sets, relations, functions</strong> underpin databases, types and data models.</li>
<li><strong>Counting &amp; probability</strong> tell you how long code runs and how likely events are.</li>
<li><strong>Number theory</strong> powers cryptography and hashing.</li>
<li><strong>Graphs &amp; trees</strong> model networks, file systems, dependencies and routes.</li>
</ul>
<h3>Discrete vs continuous</h3>
<pre><code>Continuous math (calculus): real numbers, limits, smooth curves
Discrete math:              integers, logic, sets, graphs, steps

A road speedometer   -> continuous (any value)
Counting people/nodes -> discrete  (whole, countable)</code></pre>
<h3>Roadmap — 8 chapters</h3>
<p>Logic &amp; predicates → proof techniques (induction) → sets, relations &amp; functions → algorithms &amp; complexity (Big-O) → number theory &amp; cryptography → counting &amp; combinatorics → recurrences &amp; discrete probability → graphs &amp; trees. Each chapter is bilingual with worked examples and a short quiz.</p>`,
    `<span class="eyebrow">MAD102 · Bài 0.1 · Tổng quan</span>
<h2>Toán rời rạc là gì?</h2>
<p class="lead"><strong>Toán rời rạc</strong> nghiên cứu các cấu trúc <strong>tách rời và đếm được</strong> — số nguyên, mệnh đề logic, tập hợp, đồ thị — chứ không phải các đại lượng liên tục, trơn mượt như trong giải tích. Đây là ngôn ngữ mẹ đẻ của máy tính, vì máy tính chỉ làm việc với các trạng thái rời rạc: 0 và 1, đúng và sai, nút này hay nút kế.</p>
<h3>Vì sao mọi sinh viên CNTT đều cần</h3>
<ul>
<li><strong>Logic</strong> là cách bạn lập luận về tính đúng của chương trình và viết điều kiện.</li>
<li><strong>Chứng minh &amp; quy nạp</strong> là cách chứng tỏ thuật toán đúng với mọi đầu vào.</li>
<li><strong>Tập hợp, quan hệ, hàm</strong> làm nền cho cơ sở dữ liệu, kiểu dữ liệu và mô hình dữ liệu.</li>
<li><strong>Đếm &amp; xác suất</strong> cho biết code chạy bao lâu và biến cố có khả năng xảy ra thế nào.</li>
<li><strong>Lý thuyết số</strong> làm động cơ cho mã hoá và băm (hashing).</li>
<li><strong>Đồ thị &amp; cây</strong> mô hình mạng, hệ thống tệp, phụ thuộc và tuyến đường.</li>
</ul>
<h3>Rời rạc và liên tục</h3>
<pre><code>Toán liên tục (giải tích): số thực, giới hạn, đường cong trơn
Toán rời rạc:              số nguyên, logic, tập hợp, đồ thị, bước

Đồng hồ tốc độ xe   -> liên tục (giá trị bất kỳ)
Đếm người/nút        -> rời rạc  (nguyên, đếm được)</code></pre>
<h3>Lộ trình — 8 chương</h3>
<p>Logic &amp; vị từ → kỹ thuật chứng minh (quy nạp) → tập hợp, quan hệ &amp; hàm → thuật toán &amp; độ phức tạp (Big-O) → lý thuyết số &amp; mã hoá → đếm &amp; tổ hợp → truy hồi &amp; xác suất rời rạc → đồ thị &amp; cây. Mỗi chương song ngữ, có ví dụ mẫu và một quiz ngắn.</p>`,
  ]]);

const c1 = doc('mad102-1-1-logic', '1.1 — Propositional & predicate logic|||1.1 — Logic mệnh đề & vị từ',
  'Mệnh đề, phép nối (¬, ∧, ∨, →, ↔), bảng chân trị, tương đương logic; vị từ & lượng từ (∀, ∃); quy tắc suy luận (modus ponens).',
  [[
    `<span class="eyebrow">MAD102 · Chapter 1 · Lesson 1.1</span>
<h2>Propositional &amp; predicate logic</h2>
<h3>Propositions &amp; connectives</h3>
<p>A <strong>proposition</strong> is a statement that is either <strong>true (T)</strong> or <strong>false (F)</strong> — never both. We combine them with <strong>logical connectives</strong>:</p>
<ul>
<li><strong>NOT</strong> ¬p — negation (flips the truth value)</li>
<li><strong>AND</strong> p ∧ q — true only when both are true (conjunction)</li>
<li><strong>OR</strong> p ∨ q — true when at least one is true (disjunction)</li>
<li><strong>IMPLIES</strong> p → q — false only when p is true and q is false (conditional)</li>
<li><strong>IFF</strong> p ↔ q — true when both sides match (biconditional)</li>
</ul>
<h3>Truth table for implication</h3>
<pre><code> p | q | p -&gt; q
---+---+-------
 T | T |   T
 T | F |   F      &lt;- the only false row
 F | T |   T
 F | F |   T      (vacuously true)</code></pre>
<p>A statement always true is a <strong>tautology</strong>; always false is a <strong>contradiction</strong>. Two statements with identical truth tables are <strong>logically equivalent</strong> (≡), e.g. De Morgan: ¬(p ∧ q) ≡ ¬p ∨ ¬q.</p>
<h3>Predicates &amp; quantifiers</h3>
<p>A <strong>predicate</strong> P(x) is a statement with a variable, e.g. "x &gt; 0". Quantifiers turn it into a proposition:</p>
<ul>
<li><strong>Universal</strong> ∀x P(x) — "for ALL x, P(x)"</li>
<li><strong>Existential</strong> ∃x P(x) — "there EXISTS an x with P(x)"</li>
</ul>
<p>Negation flips them: ¬∀x P(x) ≡ ∃x ¬P(x).</p>
<h3>Rules of inference</h3>
<pre><code>Modus ponens:   p -&gt; q ,  p    therefore  q
Modus tollens:  p -&gt; q ,  ¬q   therefore  ¬p</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Every <code>if</code> condition, every SQL <code>WHERE</code>, every loop guard is propositional/predicate logic. Getting De Morgan and implication right is the difference between a correct condition and a subtle bug.</div>`,
    `<span class="eyebrow">MAD102 · Chương 1 · Bài 1.1</span>
<h2>Logic mệnh đề &amp; vị từ</h2>
<h3>Mệnh đề &amp; phép nối</h3>
<p>Một <strong>mệnh đề</strong> là câu khẳng định hoặc <strong>đúng (T)</strong> hoặc <strong>sai (F)</strong> — không thể cả hai. Ta ghép chúng bằng <strong>phép nối logic</strong>:</p>
<ul>
<li><strong>PHỦ ĐỊNH</strong> ¬p — đảo giá trị chân trị</li>
<li><strong>VÀ</strong> p ∧ q — đúng chỉ khi cả hai đúng (hội)</li>
<li><strong>HOẶC</strong> p ∨ q — đúng khi ít nhất một đúng (tuyển)</li>
<li><strong>KÉO THEO</strong> p → q — sai chỉ khi p đúng mà q sai (điều kiện)</li>
<li><strong>TƯƠNG ĐƯƠNG</strong> p ↔ q — đúng khi hai vế cùng giá trị</li>
</ul>
<h3>Bảng chân trị của phép kéo theo</h3>
<pre><code> p | q | p -&gt; q
---+---+-------
 T | T |   T
 T | F |   F      &lt;- dòng SAI duy nhất
 F | T |   T
 F | F |   T      (đúng hình thức)</code></pre>
<p>Mệnh đề luôn đúng gọi là <strong>hằng đúng (tautology)</strong>; luôn sai là <strong>mâu thuẫn</strong>. Hai mệnh đề có bảng chân trị giống hệt là <strong>tương đương logic</strong> (≡), vd De Morgan: ¬(p ∧ q) ≡ ¬p ∨ ¬q.</p>
<h3>Vị từ &amp; lượng từ</h3>
<p>Một <strong>vị từ</strong> P(x) là câu có biến, vd "x &gt; 0". Lượng từ biến nó thành mệnh đề:</p>
<ul>
<li><strong>Với mọi</strong> ∀x P(x) — "với MỌI x, P(x)"</li>
<li><strong>Tồn tại</strong> ∃x P(x) — "TỒN TẠI x sao cho P(x)"</li>
</ul>
<p>Phủ định đảo chúng: ¬∀x P(x) ≡ ∃x ¬P(x).</p>
<h3>Quy tắc suy luận</h3>
<pre><code>Modus ponens:   p -&gt; q ,  p    suy ra  q
Modus tollens:  p -&gt; q ,  ¬q   suy ra  ¬p</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Mọi điều kiện <code>if</code>, mọi <code>WHERE</code> trong SQL, mọi điều kiện vòng lặp đều là logic mệnh đề/vị từ. Nắm đúng De Morgan và phép kéo theo là khác biệt giữa điều kiện đúng và một lỗi tinh vi.</div>`,
  ]]);

const c1q = quiz('mad102-quiz-1', 'Quiz 1 — Logic|||Quiz 1 — Logic', [
  { id: 'q1', question: 'Mệnh đề p → q (p kéo theo q) SAI khi nào?', options: ['p đúng và q đúng', 'p đúng và q sai', 'p sai và q đúng', 'p sai và q sai'], correctIndex: 1, explanation: 'p → q chỉ sai ở đúng một dòng: p đúng còn q sai.' },
  { id: 'q2', question: 'Theo luật De Morgan, ¬(p ∧ q) tương đương với?', options: ['¬p ∧ ¬q', '¬p ∨ ¬q', 'p ∨ q', '¬p → q'], correctIndex: 1, explanation: 'De Morgan: phủ định của hội là tuyển các phủ định.' },
  { id: 'q3', question: 'Phủ định của ∀x P(x) là?', options: ['∀x ¬P(x)', '∃x ¬P(x)', '∃x P(x)', '¬∃x P(x)'], correctIndex: 1, explanation: '¬∀x P(x) ≡ ∃x ¬P(x): "không phải mọi" = "tồn tại một cái không".' },
]);

const c2 = doc('mad102-2-1-proofs', '2.1 — Proof techniques & induction|||2.1 — Kỹ thuật chứng minh & quy nạp',
  'Chứng minh trực tiếp, phản đảo (contrapositive), phản chứng (contradiction); quy nạp toán học (bước cơ sở + bước quy nạp) và quy nạp mạnh.',
  [[
    `<span class="eyebrow">MAD102 · Chapter 2 · Lesson 2.1</span>
<h2>Proof techniques &amp; mathematical induction</h2>
<p class="lead">A <strong>proof</strong> is an airtight argument that a statement is true for <em>every</em> case, not just the ones you tested. This is exactly what "correct for all inputs" means in programming.</p>
<h3>Direct methods</h3>
<ul>
<li><strong>Direct proof:</strong> assume the hypothesis p, then derive the conclusion q step by step (p → q).</li>
<li><strong>Contrapositive:</strong> instead of p → q, prove the equivalent ¬q → ¬p. Often much easier.</li>
<li><strong>Contradiction:</strong> assume the statement is FALSE, then derive an impossibility — so it must be true. (Classic: √2 is irrational.)</li>
</ul>
<h3>Mathematical induction</h3>
<p>To prove P(n) holds for all integers n ≥ 1, prove two things:</p>
<pre><code>1. Base case:      show P(1) is true
2. Inductive step: assume P(k) is true (the hypothesis),
                   then show P(k+1) follows

If both hold, P(n) is true for ALL n &gt;= 1
(like dominoes: first falls, and each knocks the next)</code></pre>
<h3>Worked example</h3>
<pre><code>Claim: 1 + 2 + ... + n = n(n+1)/2

Base: n=1 -&gt; left = 1, right = 1(2)/2 = 1     OK
Step: assume 1+...+k = k(k+1)/2
      then 1+...+k+(k+1) = k(k+1)/2 + (k+1)
                         = (k+1)(k+2)/2         = P(k+1)  OK</code></pre>
<p><strong>Strong induction</strong> assumes P holds for ALL values up to k (not just k) — useful for recursion where a case depends on several smaller ones.</p>
<div class="callout"><span class="badge">Why it matters</span> Induction is how we prove loops and recursive functions are correct — the base case is the smallest input, the inductive step is "if it works up to here, it works for the next one".</div>`,
    `<span class="eyebrow">MAD102 · Chương 2 · Bài 2.1</span>
<h2>Kỹ thuật chứng minh &amp; quy nạp toán học</h2>
<p class="lead">Một <strong>chứng minh</strong> là lập luận kín kẽ rằng mệnh đề đúng với <em>mọi</em> trường hợp, không chỉ những cái bạn thử. Đây chính là ý nghĩa của "đúng với mọi đầu vào" trong lập trình.</p>
<h3>Các phương pháp trực tiếp</h3>
<ul>
<li><strong>Chứng minh trực tiếp:</strong> giả sử giả thiết p, rồi suy ra kết luận q từng bước (p → q).</li>
<li><strong>Phản đảo (contrapositive):</strong> thay vì p → q, chứng minh mệnh đề tương đương ¬q → ¬p. Thường dễ hơn nhiều.</li>
<li><strong>Phản chứng (contradiction):</strong> giả sử mệnh đề SAI, rồi suy ra điều vô lý — nên nó phải đúng. (Kinh điển: √2 là số vô tỉ.)</li>
</ul>
<h3>Quy nạp toán học</h3>
<p>Để chứng minh P(n) đúng với mọi số nguyên n ≥ 1, chứng minh hai điều:</p>
<pre><code>1. Bước cơ sở:    chứng minh P(1) đúng
2. Bước quy nạp:  giả sử P(k) đúng (giả thiết quy nạp),
                  rồi chứng minh P(k+1) đúng theo

Nếu cả hai đúng, P(n) đúng với MỌI n &gt;= 1
(như quân domino: quân đầu đổ, mỗi quân đẩy quân kế)</code></pre>
<h3>Ví dụ mẫu</h3>
<pre><code>Khẳng định: 1 + 2 + ... + n = n(n+1)/2

Cơ sở: n=1 -&gt; trái = 1, phải = 1(2)/2 = 1     OK
Bước:  giả sử 1+...+k = k(k+1)/2
       thì 1+...+k+(k+1) = k(k+1)/2 + (k+1)
                         = (k+1)(k+2)/2         = P(k+1)  OK</code></pre>
<p><strong>Quy nạp mạnh</strong> giả sử P đúng với MỌI giá trị đến k (không chỉ k) — hữu ích cho đệ quy khi một trường hợp phụ thuộc nhiều trường hợp nhỏ hơn.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Quy nạp là cách ta chứng minh vòng lặp và hàm đệ quy đúng — bước cơ sở là đầu vào nhỏ nhất, bước quy nạp là "nếu đúng tới đây thì đúng cho cái kế".</div>`,
  ]]);

const c2q = quiz('mad102-quiz-2', 'Quiz 2 — Proofs & induction|||Quiz 2 — Chứng minh & quy nạp', [
  { id: 'q1', question: 'Quy nạp toán học gồm hai bước nào?', options: ['Giả thiết & kết luận', 'Bước cơ sở & bước quy nạp', 'Trực tiếp & phản chứng', 'Phủ định & suy luận'], correctIndex: 1, explanation: 'Chứng minh P(1) (cơ sở) và P(k) → P(k+1) (bước quy nạp).' },
  { id: 'q2', question: 'Chứng minh phản đảo của p → q nghĩa là chứng minh?', options: ['p → q trực tiếp', '¬q → ¬p', 'p ∧ ¬q vô lý', 'q → p'], correctIndex: 1, explanation: 'p → q tương đương ¬q → ¬p (phản đảo).' },
  { id: 'q3', question: 'Chứng minh √2 vô tỉ bằng cách giả sử nó hữu tỉ rồi suy ra vô lý là phương pháp?', options: ['Quy nạp', 'Phản chứng (contradiction)', 'Trực tiếp', 'Vét cạn'], correctIndex: 1, explanation: 'Giả sử mệnh đề sai, dẫn tới mâu thuẫn → phản chứng.' },
]);

const c3 = doc('mad102-3-1-sets-relations-functions', '3.1 — Sets, relations & functions|||3.1 — Tập hợp, quan hệ & hàm',
  'Tập hợp & phép toán (∪, ∩, \\, ⊆), tập lũy thừa; quan hệ & quan hệ tương đương (phản xạ/đối xứng/bắc cầu); hàm (đơn ánh/toàn ánh/song ánh); lực lượng (cardinality).',
  [[
    `<span class="eyebrow">MAD102 · Chapter 3 · Lesson 3.1</span>
<h2>Sets, relations &amp; functions</h2>
<h3>Sets &amp; operations</h3>
<p>A <strong>set</strong> is an unordered collection of distinct objects. Core operations:</p>
<ul>
<li><strong>Union</strong> A ∪ B — in A or B</li>
<li><strong>Intersection</strong> A ∩ B — in both</li>
<li><strong>Difference</strong> A \\ B — in A but not B</li>
<li><strong>Subset</strong> A ⊆ B — every element of A is in B</li>
</ul>
<p>The <strong>power set</strong> P(A) is the set of all subsets; if |A| = n then |P(A)| = 2ⁿ. The <strong>Cartesian product</strong> A × B is all ordered pairs (a, b).</p>
<h3>Relations</h3>
<p>A <strong>relation</strong> on a set is any subset of A × A. A relation is an <strong>equivalence relation</strong> if it is:</p>
<pre><code>Reflexive:   a R a           (every element relates to itself)
Symmetric:   a R b -&gt; b R a
Transitive:  a R b and b R c -&gt; a R c</code></pre>
<p>An equivalence relation partitions a set into <strong>equivalence classes</strong> (e.g. "same remainder mod 3" splits integers into 3 classes).</p>
<h3>Functions</h3>
<p>A <strong>function</strong> f: A → B assigns each input exactly one output. Types:</p>
<ul>
<li><strong>Injective (one-to-one):</strong> different inputs → different outputs</li>
<li><strong>Surjective (onto):</strong> every element of B is hit</li>
<li><strong>Bijective:</strong> both — a perfect pairing (invertible)</li>
</ul>
<h3>Cardinality</h3>
<p>|A| is the number of elements. Two sets have the same cardinality if a bijection exists between them — this is how we compare even <em>infinite</em> sets (ℕ and ℤ are the same size; ℝ is strictly bigger).</p>
<div class="callout"><span class="badge">Why it matters</span> Sets are databases and types; a bijection is a lossless key mapping; equivalence classes are exactly how hashing and deduplication group "equal" items.</div>`,
    `<span class="eyebrow">MAD102 · Chương 3 · Bài 3.1</span>
<h2>Tập hợp, quan hệ &amp; hàm</h2>
<h3>Tập hợp &amp; phép toán</h3>
<p>Một <strong>tập hợp</strong> là bộ sưu tập không thứ tự gồm các phần tử phân biệt. Phép toán chính:</p>
<ul>
<li><strong>Hợp</strong> A ∪ B — thuộc A hoặc B</li>
<li><strong>Giao</strong> A ∩ B — thuộc cả hai</li>
<li><strong>Hiệu</strong> A \\ B — thuộc A nhưng không thuộc B</li>
<li><strong>Tập con</strong> A ⊆ B — mọi phần tử của A đều thuộc B</li>
</ul>
<p><strong>Tập lũy thừa</strong> P(A) là tập mọi tập con; nếu |A| = n thì |P(A)| = 2ⁿ. <strong>Tích Descartes</strong> A × B là mọi cặp có thứ tự (a, b).</p>
<h3>Quan hệ</h3>
<p>Một <strong>quan hệ</strong> trên tập là một tập con bất kỳ của A × A. Quan hệ là <strong>quan hệ tương đương</strong> nếu nó:</p>
<pre><code>Phản xạ:    a R a           (mọi phần tử quan hệ với chính nó)
Đối xứng:   a R b -&gt; b R a
Bắc cầu:    a R b và b R c -&gt; a R c</code></pre>
<p>Quan hệ tương đương chia tập thành các <strong>lớp tương đương</strong> (vd "cùng số dư mod 3" chia số nguyên thành 3 lớp).</p>
<h3>Hàm</h3>
<p>Một <strong>hàm</strong> f: A → B gán mỗi đầu vào đúng một đầu ra. Các loại:</p>
<ul>
<li><strong>Đơn ánh (injective):</strong> đầu vào khác nhau → đầu ra khác nhau</li>
<li><strong>Toàn ánh (surjective):</strong> mọi phần tử của B đều được nhắm tới</li>
<li><strong>Song ánh (bijective):</strong> cả hai — ghép cặp hoàn hảo (khả nghịch)</li>
</ul>
<h3>Lực lượng (cardinality)</h3>
<p>|A| là số phần tử. Hai tập có cùng lực lượng nếu tồn tại song ánh giữa chúng — đây là cách so sánh cả tập <em>vô hạn</em> (ℕ và ℤ cùng cỡ; ℝ lớn hơn hẳn).</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Tập hợp là cơ sở dữ liệu và kiểu dữ liệu; song ánh là ánh xạ khoá không mất mát; lớp tương đương chính là cách băm và khử trùng lặp gom các phần tử "bằng nhau".</div>`,
  ]]);

const c3q = quiz('mad102-quiz-3', 'Quiz 3 — Sets, relations & functions|||Quiz 3 — Tập hợp, quan hệ & hàm', [
  { id: 'q1', question: 'Nếu |A| = n thì tập lũy thừa P(A) có bao nhiêu phần tử?', options: ['n', 'n²', '2ⁿ', 'n!'], correctIndex: 2, explanation: 'Mỗi phần tử có/không trong tập con → 2ⁿ tập con.' },
  { id: 'q2', question: 'Quan hệ tương đương phải có ba tính chất nào?', options: ['Phản xạ, đối xứng, bắc cầu', 'Đơn ánh, toàn ánh, song ánh', 'Hợp, giao, hiệu', 'Phản xạ, phản đối xứng, bắc cầu'], correctIndex: 0, explanation: 'Phản xạ + đối xứng + bắc cầu = quan hệ tương đương.' },
  { id: 'q3', question: 'Hàm vừa đơn ánh vừa toàn ánh gọi là?', options: ['Đơn ánh', 'Toàn ánh', 'Song ánh (bijective)', 'Hàm hằng'], correctIndex: 2, explanation: 'Vừa 1-1 vừa lên = song ánh, khả nghịch.' },
]);

const c4 = doc('mad102-4-1-algorithms-complexity', '4.1 — Algorithms & complexity (Big-O)|||4.1 — Thuật toán & độ phức tạp (Big-O)',
  'Thuật toán là gì; độ tăng của hàm; ký hiệu Big-O, Big-Ω, Big-Θ; các lớp phổ biến O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ); phân tích vòng lặp.',
  [[
    `<span class="eyebrow">MAD102 · Chapter 4 · Lesson 4.1</span>
<h2>Algorithms &amp; complexity</h2>
<h3>What is an algorithm?</h3>
<p>An <strong>algorithm</strong> is a finite, unambiguous sequence of steps that solves a problem for any valid input. To compare algorithms we ask how their cost <strong>grows</strong> as the input size n grows — not the exact time on one machine.</p>
<h3>Big-O notation</h3>
<p><strong>Big-O</strong> gives an <em>upper bound</em> on growth, ignoring constants and lower-order terms:</p>
<pre><code>f(n) = O(g(n))  means f grows no faster than g (for large n)

Big-O (O)  : upper bound  (worst case)
Big-Omega  : lower bound
Big-Theta  : tight bound  (upper AND lower)</code></pre>
<h3>Common growth classes (best → worst)</h3>
<pre><code>O(1)       constant     hash lookup
O(log n)   logarithmic  binary search
O(n)       linear       scan a list
O(n log n) linearithmic good sorting (merge/heap sort)
O(n^2)     quadratic    nested loops (bubble sort)
O(2^n)     exponential  brute-force subsets
O(n!)      factorial    brute-force permutations</code></pre>
<h3>Analysing loops</h3>
<pre><code>for i in 1..n:          # runs n times
    for j in 1..n:      # n times each
        do_work()       # -&gt; n * n = O(n^2)

x = n
while x &gt; 1: x = x / 2   # halves each step -&gt; O(log n)</code></pre>
<div class="callout"><span class="badge">Why it matters</span> The gap between O(n log n) and O(n²) is the gap between a search that returns instantly and one that times out. Big-O is the vocabulary every technical interview and code review uses.</div>`,
    `<span class="eyebrow">MAD102 · Chương 4 · Bài 4.1</span>
<h2>Thuật toán &amp; độ phức tạp</h2>
<h3>Thuật toán là gì?</h3>
<p>Một <strong>thuật toán</strong> là dãy bước hữu hạn, rõ ràng, giải được bài toán với mọi đầu vào hợp lệ. Để so sánh thuật toán ta hỏi chi phí <strong>tăng</strong> thế nào khi cỡ đầu vào n tăng — không phải thời gian cụ thể trên một máy.</p>
<h3>Ký hiệu Big-O</h3>
<p><strong>Big-O</strong> cho <em>chặn trên</em> của độ tăng, bỏ qua hằng số và các số hạng bậc thấp:</p>
<pre><code>f(n) = O(g(n))  nghĩa là f tăng không nhanh hơn g (với n lớn)

Big-O (O)  : chặn trên   (trường hợp xấu nhất)
Big-Omega  : chặn dưới
Big-Theta  : chặn khít   (cả trên VÀ dưới)</code></pre>
<h3>Các lớp độ tăng phổ biến (tốt → xấu)</h3>
<pre><code>O(1)       hằng số      tra cứu hash
O(log n)   logarit      tìm kiếm nhị phân
O(n)       tuyến tính   quét một danh sách
O(n log n) tuyến-log    sắp xếp tốt (merge/heap sort)
O(n^2)     bậc hai      vòng lặp lồng (bubble sort)
O(2^n)     mũ           vét cạn tập con
O(n!)      giai thừa    vét cạn hoán vị</code></pre>
<h3>Phân tích vòng lặp</h3>
<pre><code>for i in 1..n:          # chạy n lần
    for j in 1..n:      # mỗi lần n lần
        do_work()       # -&gt; n * n = O(n^2)

x = n
while x &gt; 1: x = x / 2   # chia đôi mỗi bước -&gt; O(log n)</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Khoảng cách giữa O(n log n) và O(n²) là khoảng cách giữa một truy vấn trả kết quả tức thì và một truy vấn treo timeout. Big-O là từ vựng mọi buổi phỏng vấn kỹ thuật và review code đều dùng.</div>`,
  ]]);

const c4q = quiz('mad102-quiz-4', 'Quiz 4 — Complexity|||Quiz 4 — Độ phức tạp', [
  { id: 'q1', question: 'Tìm kiếm nhị phân (binary search) trên danh sách đã sắp có độ phức tạp?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctIndex: 1, explanation: 'Mỗi bước loại nửa số phần tử → O(log n).' },
  { id: 'q2', question: 'Hai vòng lặp lồng nhau, mỗi vòng chạy n lần, cho độ phức tạp?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'], correctIndex: 2, explanation: 'n × n = n² → O(n²).' },
  { id: 'q3', question: 'Big-O mô tả điều gì về một thuật toán?', options: ['Thời gian chính xác trên một máy', 'Chặn trên của độ tăng khi n lớn', 'Bộ nhớ tối thiểu', 'Số dòng code'], correctIndex: 1, explanation: 'Big-O là chặn trên tiệm cận, bỏ hằng số và số hạng bậc thấp.' },
]);

const c5 = doc('mad102-5-1-number-theory', '5.1 — Number theory & applications|||5.1 — Lý thuyết số & ứng dụng',
  'Chia hết & số nguyên tố; số học modulo (đồng dư); ƯCLN & thuật toán Euclid; ứng dụng: băm, kiểm tra, và ý tưởng mã hoá khoá công khai (RSA).',
  [[
    `<span class="eyebrow">MAD102 · Chapter 5 · Lesson 5.1</span>
<h2>Number theory &amp; its applications</h2>
<h3>Divisibility &amp; primes</h3>
<p>We say <strong>a divides b</strong> (a | b) if b = a·k for some integer k. A <strong>prime</strong> has exactly two divisors: 1 and itself. Every integer &gt; 1 factors uniquely into primes (Fundamental Theorem of Arithmetic).</p>
<h3>Modular arithmetic</h3>
<p><strong>a mod m</strong> is the remainder when a is divided by m. Two numbers are <strong>congruent mod m</strong> (a ≡ b mod m) if they leave the same remainder — clock arithmetic is mod 12.</p>
<pre><code>17 mod 5 = 2
17 ≡ 2 (mod 5)   because 17 - 2 = 15 = 3*5

Rules:
(a + b) mod m = ((a mod m) + (b mod m)) mod m
(a * b) mod m = ((a mod m) * (b mod m)) mod m</code></pre>
<h3>GCD &amp; the Euclidean algorithm</h3>
<p>The <strong>greatest common divisor</strong> gcd(a, b) is the largest integer dividing both. Euclid's algorithm finds it fast:</p>
<pre><code>gcd(a, b):
    while b != 0:
        a, b = b, a mod b
    return a

gcd(48, 18): 48 mod 18 = 12; 18 mod 12 = 6; 12 mod 6 = 0 -&gt; 6</code></pre>
<h3>Application: cryptography</h3>
<p>Modular exponentiation is the engine of <strong>RSA public-key cryptography</strong>: it is easy to multiply two large primes but extremely hard to factor the product back — that gap is what keeps HTTPS and digital signatures secure. Modular arithmetic also powers hash functions and checksums.</p>
<div class="callout"><span class="badge">Why it matters</span> Every time you see the padlock in your browser, number theory is doing the work. gcd and mod are also everyday tools: cycle detection, hashing into buckets, and wrap-around indexing.</div>`,
    `<span class="eyebrow">MAD102 · Chương 5 · Bài 5.1</span>
<h2>Lý thuyết số &amp; ứng dụng</h2>
<h3>Chia hết &amp; số nguyên tố</h3>
<p>Ta nói <strong>a chia hết b</strong> (a | b) nếu b = a·k với số nguyên k nào đó. Một <strong>số nguyên tố</strong> có đúng hai ước: 1 và chính nó. Mọi số nguyên &gt; 1 phân tích duy nhất thành tích số nguyên tố (Định lý cơ bản của số học).</p>
<h3>Số học modulo</h3>
<p><strong>a mod m</strong> là số dư khi chia a cho m. Hai số <strong>đồng dư mod m</strong> (a ≡ b mod m) nếu cùng số dư — số học đồng hồ là mod 12.</p>
<pre><code>17 mod 5 = 2
17 ≡ 2 (mod 5)   vì 17 - 2 = 15 = 3*5

Quy tắc:
(a + b) mod m = ((a mod m) + (b mod m)) mod m
(a * b) mod m = ((a mod m) * (b mod m)) mod m</code></pre>
<h3>ƯCLN &amp; thuật toán Euclid</h3>
<p><strong>Ước chung lớn nhất</strong> gcd(a, b) là số nguyên lớn nhất chia hết cả hai. Thuật toán Euclid tìm nó rất nhanh:</p>
<pre><code>gcd(a, b):
    while b != 0:
        a, b = b, a mod b
    return a

gcd(48, 18): 48 mod 18 = 12; 18 mod 12 = 6; 12 mod 6 = 0 -&gt; 6</code></pre>
<h3>Ứng dụng: mã hoá</h3>
<p>Lũy thừa modulo là động cơ của <strong>mã hoá khoá công khai RSA</strong>: nhân hai số nguyên tố lớn thì dễ nhưng phân tích ngược tích ra thì cực khó — khoảng cách đó giữ cho HTTPS và chữ ký số an toàn. Số học modulo cũng làm nền cho hàm băm và checksum.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Mỗi lần bạn thấy ổ khoá trên trình duyệt, lý thuyết số đang làm việc. gcd và mod cũng là công cụ hằng ngày: phát hiện chu kỳ, băm vào bucket, và đánh chỉ số vòng.</div>`,
  ]]);

const c5q = quiz('mad102-quiz-5', 'Quiz 5 — Number theory|||Quiz 5 — Lý thuyết số', [
  { id: 'q1', question: 'Giá trị của 17 mod 5 là?', options: ['1', '2', '3', '5'], correctIndex: 1, explanation: '17 = 3×5 + 2, số dư là 2.' },
  { id: 'q2', question: 'Thuật toán Euclid dùng để tìm?', options: ['Số nguyên tố', 'ƯCLN (gcd)', 'Bội chung nhỏ nhất trực tiếp', 'Số dư duy nhất'], correctIndex: 1, explanation: 'Euclid: lặp a,b = b, a mod b cho tới b=0 → gcd.' },
  { id: 'q3', question: 'Mã hoá RSA dựa vào việc khó thực hiện điều gì?', options: ['Cộng số lớn', 'Nhân hai số nguyên tố', 'Phân tích tích của hai số nguyên tố lớn', 'Tính mod'], correctIndex: 2, explanation: 'Nhân thì dễ, phân tích ngược ra thừa số nguyên tố thì cực khó.' },
]);

const c6 = doc('mad102-6-1-counting-combinatorics', '6.1 — Counting & combinatorics|||6.1 — Đếm & tổ hợp',
  'Quy tắc cộng & nhân; hoán vị (P) & tổ hợp (C); nguyên lý chuồng bồ câu (pigeonhole); hệ số nhị thức & khai triển (a+b)ⁿ.',
  [[
    `<span class="eyebrow">MAD102 · Chapter 6 · Lesson 6.1</span>
<h2>Counting &amp; combinatorics</h2>
<h3>The two basic rules</h3>
<ul>
<li><strong>Product rule:</strong> if a task has k steps with n1, n2, ... choices, the total is n1 × n2 × ... (choices multiply). A 4-digit PIN: 10 × 10 × 10 × 10 = 10,000.</li>
<li><strong>Sum rule:</strong> if you must pick ONE option from disjoint groups, add the sizes.</li>
</ul>
<h3>Permutations vs combinations</h3>
<p><strong>Order matters → permutation. Order does not → combination.</strong></p>
<pre><code>Permutations of n taken r:  P(n,r) = n! / (n-r)!
Combinations of n taken r:  C(n,r) = n! / (r! (n-r)!)

Pick 3 from 5, order matters:  P(5,3) = 60
Pick 3 from 5, order ignored:  C(5,3) = 10</code></pre>
<h3>Pigeonhole principle</h3>
<p>If n items go into m boxes and n &gt; m, at least one box holds ≥ 2 items. Simple but powerful:</p>
<pre><code>13 people -&gt; at least two share a birth MONTH (12 months)
Generalized: at least ceil(n/m) items in some box</code></pre>
<h3>Binomial coefficients</h3>
<p>C(n, r) is also written as the binomial coefficient, and it appears in the expansion:</p>
<pre><code>(a + b)^n = sum over k of C(n,k) * a^(n-k) * b^k

(a + b)^2 = a^2 + 2ab + b^2   (coeffs 1, 2, 1 = row of Pascal's triangle)</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Counting is how we size a problem: password strength, hash-collision odds, the number of test cases, and the state space an algorithm must search all come straight from these rules.</div>`,
    `<span class="eyebrow">MAD102 · Chương 6 · Bài 6.1</span>
<h2>Đếm &amp; tổ hợp</h2>
<h3>Hai quy tắc cơ bản</h3>
<ul>
<li><strong>Quy tắc nhân:</strong> nếu một việc có k bước với n1, n2, ... lựa chọn, tổng là n1 × n2 × ... (nhân các lựa chọn). Mã PIN 4 chữ số: 10 × 10 × 10 × 10 = 10.000.</li>
<li><strong>Quy tắc cộng:</strong> nếu phải chọn MỘT phương án từ các nhóm rời nhau, cộng các cỡ.</li>
</ul>
<h3>Hoán vị và tổ hợp</h3>
<p><strong>Thứ tự quan trọng → hoán vị. Thứ tự không quan trọng → tổ hợp.</strong></p>
<pre><code>Hoán vị chập r của n:  P(n,r) = n! / (n-r)!
Tổ hợp chập r của n:   C(n,r) = n! / (r! (n-r)!)

Chọn 3 từ 5, có thứ tự:    P(5,3) = 60
Chọn 3 từ 5, không thứ tự:  C(5,3) = 10</code></pre>
<h3>Nguyên lý chuồng bồ câu (pigeonhole)</h3>
<p>Nếu n vật vào m ngăn và n &gt; m, ít nhất một ngăn chứa ≥ 2 vật. Đơn giản mà mạnh:</p>
<pre><code>13 người -&gt; ít nhất hai người cùng THÁNG sinh (12 tháng)
Tổng quát: có ngăn chứa ít nhất ceil(n/m) vật</code></pre>
<h3>Hệ số nhị thức</h3>
<p>C(n, r) còn được viết là hệ số nhị thức, và nó xuất hiện trong khai triển:</p>
<pre><code>(a + b)^n = tổng theo k của C(n,k) * a^(n-k) * b^k

(a + b)^2 = a^2 + 2ab + b^2   (hệ số 1, 2, 1 = một dòng tam giác Pascal)</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Đếm là cách ta ước lượng độ lớn bài toán: độ mạnh mật khẩu, xác suất đụng độ hash, số ca kiểm thử, và không gian trạng thái mà thuật toán phải duyệt đều từ các quy tắc này.</div>`,
  ]]);

const c6q = quiz('mad102-quiz-6', 'Quiz 6 — Counting|||Quiz 6 — Đếm & tổ hợp', [
  { id: 'q1', question: 'Chọn 3 người từ 5 người mà KHÔNG quan tâm thứ tự, có bao nhiêu cách?', options: ['P(5,3) = 60', 'C(5,3) = 10', '5! = 120', '5³ = 125'], correctIndex: 1, explanation: 'Không thứ tự → tổ hợp C(5,3) = 10.' },
  { id: 'q2', question: 'Nguyên lý chuồng bồ câu nói gì khi có 13 vật xếp vào 12 ngăn?', options: ['Mỗi ngăn đúng 1 vật', 'Ít nhất một ngăn có ≥ 2 vật', 'Có ngăn trống', 'Không kết luận được'], correctIndex: 1, explanation: 'n > m nên ít nhất một ngăn chứa từ 2 vật trở lên.' },
  { id: 'q3', question: 'Số PIN 4 chữ số (mỗi vị trí 0-9) có bao nhiêu khả năng?', options: ['40', '10000', '5040', '24'], correctIndex: 1, explanation: 'Quy tắc nhân: 10⁴ = 10.000.' },
]);

const c7 = doc('mad102-7-1-recurrence-probability', '7.1 — Recurrence relations & discrete probability|||7.1 — Quan hệ truy hồi & xác suất rời rạc',
  'Quan hệ truy hồi (định nghĩa theo chính nó, vd Fibonacci) & cách giải; xác suất rời rạc: không gian mẫu, biến cố, xác suất có điều kiện, kỳ vọng.',
  [[
    `<span class="eyebrow">MAD102 · Chapter 7 · Lesson 7.1</span>
<h2>Recurrence relations &amp; discrete probability</h2>
<h3>Recurrence relations</h3>
<p>A <strong>recurrence</strong> defines a term using earlier terms — the mathematics of recursion. The classic:</p>
<pre><code>Fibonacci:  F(0)=0, F(1)=1, F(n) = F(n-1) + F(n-2)
            -&gt; 0, 1, 1, 2, 3, 5, 8, 13, ...

Merge sort cost: T(n) = 2 T(n/2) + n   -&gt; solves to O(n log n)</code></pre>
<p>We <strong>solve</strong> a recurrence to get a closed form (a direct formula). Techniques include substitution, characteristic equations for linear recurrences, and the Master Theorem for divide-and-conquer costs.</p>
<h3>Discrete probability</h3>
<p>The <strong>sample space</strong> S is the set of all outcomes; an <strong>event</strong> is a subset. For equally likely outcomes:</p>
<pre><code>P(event) = (favorable outcomes) / (total outcomes)

One die, P(even) = 3/6 = 1/2
0 &lt;= P(E) &lt;= 1 ,  P(S) = 1 ,  P(not E) = 1 - P(E)</code></pre>
<h3>Conditional probability &amp; expectation</h3>
<pre><code>Conditional:  P(A | B) = P(A and B) / P(B)
Independent:  P(A and B) = P(A) * P(B)
Expected value: E[X] = sum of (value * probability)</code></pre>
<p><strong>Expectation</strong> is the long-run average — the basis of average-case analysis (e.g. quicksort averages O(n log n) even though its worst case is O(n²)).</p>
<div class="callout"><span class="badge">Why it matters</span> Recurrences tell you the running time of recursive algorithms; probability tells you their average behaviour and drives randomized algorithms, load balancing, and machine learning.</div>`,
    `<span class="eyebrow">MAD102 · Chương 7 · Bài 7.1</span>
<h2>Quan hệ truy hồi &amp; xác suất rời rạc</h2>
<h3>Quan hệ truy hồi</h3>
<p>Một <strong>quan hệ truy hồi</strong> định nghĩa một số hạng theo các số hạng trước — toán học của đệ quy. Kinh điển:</p>
<pre><code>Fibonacci:  F(0)=0, F(1)=1, F(n) = F(n-1) + F(n-2)
            -&gt; 0, 1, 1, 2, 3, 5, 8, 13, ...

Chi phí merge sort: T(n) = 2 T(n/2) + n   -&gt; ra O(n log n)</code></pre>
<p>Ta <strong>giải</strong> quan hệ truy hồi để có dạng đóng (công thức trực tiếp). Kỹ thuật gồm thế (substitution), phương trình đặc trưng cho truy hồi tuyến tính, và Định lý Thợ (Master Theorem) cho chi phí chia-để-trị.</p>
<h3>Xác suất rời rạc</h3>
<p><strong>Không gian mẫu</strong> S là tập mọi kết quả; một <strong>biến cố</strong> là một tập con. Với các kết quả đồng khả năng:</p>
<pre><code>P(biến cố) = (số kết quả thuận lợi) / (tổng số kết quả)

Một con xúc xắc, P(chẵn) = 3/6 = 1/2
0 &lt;= P(E) &lt;= 1 ,  P(S) = 1 ,  P(không E) = 1 - P(E)</code></pre>
<h3>Xác suất có điều kiện &amp; kỳ vọng</h3>
<pre><code>Có điều kiện:  P(A | B) = P(A và B) / P(B)
Độc lập:       P(A và B) = P(A) * P(B)
Kỳ vọng:       E[X] = tổng của (giá trị * xác suất)</code></pre>
<p><strong>Kỳ vọng</strong> là trung bình về lâu dài — nền của phân tích trường hợp trung bình (vd quicksort trung bình O(n log n) dù xấu nhất O(n²)).</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Truy hồi cho biết thời gian chạy của thuật toán đệ quy; xác suất cho biết hành vi trung bình của chúng và làm động lực cho thuật toán ngẫu nhiên, cân bằng tải, và học máy.</div>`,
  ]]);

const c7q = quiz('mad102-quiz-7', 'Quiz 7 — Recurrence & probability|||Quiz 7 — Truy hồi & xác suất', [
  { id: 'q1', question: 'Dãy Fibonacci F(n) = F(n-1) + F(n-2) là một ví dụ của?', options: ['Hàm song ánh', 'Quan hệ truy hồi', 'Quan hệ tương đương', 'Bảng chân trị'], correctIndex: 1, explanation: 'Số hạng định nghĩa qua các số hạng trước → truy hồi.' },
  { id: 'q2', question: 'Tung một con xúc xắc 6 mặt, xác suất ra số chẵn là?', options: ['1/6', '1/3', '1/2', '2/3'], correctIndex: 2, explanation: '3 kết quả chẵn (2,4,6) trên 6 → 3/6 = 1/2.' },
  { id: 'q3', question: 'Với hai biến cố ĐỘC LẬP A, B thì P(A và B) bằng?', options: ['P(A) + P(B)', 'P(A) × P(B)', 'P(A) − P(B)', 'P(A | B)'], correctIndex: 1, explanation: 'Độc lập: P(A và B) = P(A)·P(B).' },
]);

const c8 = doc('mad102-8-1-graphs-trees', '8.1 — Graphs & trees|||8.1 — Đồ thị & cây',
  'Đồ thị (đỉnh/cạnh, bậc, có hướng/vô hướng); đường đi Euler & Hamilton; cây & cây khung (spanning tree); tô màu đồ thị (coloring).',
  [[
    `<span class="eyebrow">MAD102 · Chapter 8 · Lesson 8.1</span>
<h2>Graphs &amp; trees</h2>
<h3>Graph basics</h3>
<p>A <strong>graph</strong> G = (V, E) is a set of <strong>vertices</strong> (nodes) joined by <strong>edges</strong>. Graphs model almost anything relational — social networks, roads, web links, dependencies.</p>
<ul>
<li><strong>Directed</strong> vs <strong>undirected</strong> edges (one-way vs two-way)</li>
<li><strong>Degree</strong> of a vertex — how many edges touch it</li>
<li><strong>Path</strong> — a sequence of edges; a <strong>cycle</strong> returns to the start</li>
<li><strong>Connected</strong> — a path exists between every pair of vertices</li>
</ul>
<h3>Euler vs Hamilton</h3>
<pre><code>Euler path/circuit:    uses every EDGE exactly once
   -&gt; exists (circuit) iff every vertex has EVEN degree
Hamilton path/circuit: visits every VERTEX exactly once
   -&gt; no simple rule; checking it is NP-hard</code></pre>
<h3>Trees</h3>
<p>A <strong>tree</strong> is a connected graph with <strong>no cycles</strong>. Key facts: a tree with n vertices has exactly n − 1 edges, and there is a unique path between any two vertices. A <strong>spanning tree</strong> of a graph is a tree that touches all vertices using a subset of edges; a <strong>minimum spanning tree</strong> (MST) does so at least total edge weight (Kruskal, Prim).</p>
<h3>Graph coloring</h3>
<p><strong>Coloring</strong> assigns colors to vertices so no two adjacent vertices share one; the fewest colors needed is the <strong>chromatic number</strong>. It models scheduling, register allocation, and map coloring (any map needs at most 4 colors).</p>
<div class="callout"><span class="badge">Why it matters</span> Trees are file systems, DOM, parse trees and B-trees; graph search (BFS/DFS) underlies routing, dependency resolution and page ranking. This chapter is where discrete math meets everyday code most directly.</div>`,
    `<span class="eyebrow">MAD102 · Chương 8 · Bài 8.1</span>
<h2>Đồ thị &amp; cây</h2>
<h3>Kiến thức nền về đồ thị</h3>
<p>Một <strong>đồ thị</strong> G = (V, E) là tập <strong>đỉnh</strong> (nút) nối bởi các <strong>cạnh</strong>. Đồ thị mô hình gần như mọi quan hệ — mạng xã hội, đường sá, liên kết web, phụ thuộc.</p>
<ul>
<li><strong>Có hướng</strong> và <strong>vô hướng</strong> (một chiều và hai chiều)</li>
<li><strong>Bậc</strong> của một đỉnh — số cạnh chạm vào nó</li>
<li><strong>Đường đi</strong> — dãy cạnh; một <strong>chu trình</strong> quay về điểm xuất phát</li>
<li><strong>Liên thông</strong> — tồn tại đường đi giữa mọi cặp đỉnh</li>
</ul>
<h3>Euler và Hamilton</h3>
<pre><code>Đường/chu trình Euler:    dùng mỗi CẠNH đúng một lần
   -&gt; tồn tại (chu trình) khi và chỉ khi mọi đỉnh có bậc CHẴN
Đường/chu trình Hamilton: thăm mỗi ĐỈNH đúng một lần
   -&gt; không có quy tắc đơn giản; kiểm tra là NP-khó</code></pre>
<h3>Cây</h3>
<p>Một <strong>cây</strong> là đồ thị liên thông <strong>không có chu trình</strong>. Sự kiện then chốt: cây n đỉnh có đúng n − 1 cạnh, và có đường đi duy nhất giữa hai đỉnh bất kỳ. <strong>Cây khung (spanning tree)</strong> của đồ thị là cây chạm mọi đỉnh bằng một tập con cạnh; <strong>cây khung nhỏ nhất</strong> (MST) làm vậy với tổng trọng số cạnh nhỏ nhất (Kruskal, Prim).</p>
<h3>Tô màu đồ thị</h3>
<p><strong>Tô màu</strong> gán màu cho đỉnh sao cho không hai đỉnh kề nào cùng màu; số màu ít nhất cần dùng là <strong>số sắc (chromatic number)</strong>. Nó mô hình lập lịch, cấp phát thanh ghi, và tô bản đồ (mọi bản đồ chỉ cần tối đa 4 màu).</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Cây là hệ thống tệp, DOM, cây phân tích và B-tree; duyệt đồ thị (BFS/DFS) làm nền cho định tuyến, giải phụ thuộc và xếp hạng trang. Chương này là nơi toán rời rạc gặp code hằng ngày trực tiếp nhất.</div>`,
  ]]);

const c8q = quiz('mad102-quiz-8', 'Quiz 8 — Graphs & trees|||Quiz 8 — Đồ thị & cây', [
  { id: 'q1', question: 'Một cây (tree) có n đỉnh thì có bao nhiêu cạnh?', options: ['n', 'n − 1', 'n + 1', '2n'], correctIndex: 1, explanation: 'Cây liên thông không chu trình luôn có đúng n − 1 cạnh.' },
  { id: 'q2', question: 'Một đường đi Euler dùng mỗi thứ gì đúng một lần?', options: ['Mỗi đỉnh', 'Mỗi cạnh', 'Mỗi chu trình', 'Mỗi màu'], correctIndex: 1, explanation: 'Euler đi qua mỗi CẠNH đúng một lần (Hamilton là mỗi ĐỈNH).' },
  { id: 'q3', question: 'Tô màu đồ thị yêu cầu điều gì?', options: ['Mọi đỉnh cùng màu', 'Hai đỉnh kề nhau khác màu', 'Số cạnh nhỏ nhất', 'Không có chu trình'], correctIndex: 1, explanation: 'Không hai đỉnh kề nào được cùng màu; số màu ít nhất là số sắc.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'MAD102',
    slug: 'mad102-discrete-mathematics',
    title: 'Discrete Mathematics',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MAD102.webp',
    shortDescription: 'The math foundation of CS: logic & proofs (induction), sets/relations/functions, algorithms & Big-O, number theory & crypto, counting & combinatorics, recurrences & discrete probability, graphs & trees. Bilingual, examples & quizzes.|||Nền toán của CNTT: logic & chứng minh (quy nạp), tập hợp/quan hệ/hàm, thuật toán & Big-O, lý thuyết số & mã hoá, đếm & tổ hợp, truy hồi & xác suất rời rạc, đồ thị & cây. Song ngữ, ví dụ & quiz.',
    description: 'Môn <strong>MAD102 — Discrete Mathematics (Toán rời rạc)</strong> là nền toán học của khoa học máy tính. Lộ trình 8 chương: <strong>logic mệnh đề &amp; vị từ</strong> → <strong>kỹ thuật chứng minh &amp; quy nạp</strong> → <strong>tập hợp, quan hệ &amp; hàm</strong> → <strong>thuật toán &amp; độ phức tạp (Big-O)</strong> → <strong>lý thuyết số &amp; mã hoá</strong> → <strong>đếm &amp; tổ hợp</strong> → <strong>quan hệ truy hồi &amp; xác suất rời rạc</strong> → <strong>đồ thị &amp; cây</strong>. Bám sách chuẩn Rosen &amp; Epp, song ngữ VI+EN, có ví dụ, khối công thức và quiz mỗi chương.',
    whatYouLearn: 'Logic mệnh đề & vị từ (bảng chân trị, De Morgan, lượng từ, suy luận); chứng minh trực tiếp/phản đảo/phản chứng & quy nạp toán học; tập hợp, quan hệ tương đương, hàm (đơn/toàn/song ánh), lực lượng; thuật toán & Big-O (O(1)→O(2ⁿ)); chia hết, số học modulo, ƯCLN/Euclid, ý tưởng RSA; đếm, hoán vị & tổ hợp, chuồng bồ câu, nhị thức; quan hệ truy hồi & xác suất rời rạc (kỳ vọng); đồ thị, Euler/Hamilton, cây khung, tô màu.',
    requirements: 'Toán phổ thông (đại số cơ bản). Không cần lập trình trước, nhưng biết đọc mã giả (pseudocode) sẽ giúp thấy rõ ứng dụng vào thuật toán.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách Rosen/Epp, MIT 6.042, Brilliant, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Toán rời rạc là gì; rời rạc vs liên tục; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Logic mệnh đề & vị từ|||Chapter 1 — Propositional & predicate logic', description: 'Mệnh đề, phép nối, bảng chân trị, lượng từ, suy luận.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Chứng minh & quy nạp|||Chapter 2 — Proofs & induction', description: 'Trực tiếp, phản đảo, phản chứng, quy nạp toán học.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Tập hợp, quan hệ & hàm|||Chapter 3 — Sets, relations & functions', description: 'Phép toán tập, quan hệ tương đương, hàm, lực lượng.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Thuật toán & độ phức tạp|||Chapter 4 — Algorithms & complexity', description: 'Thuật toán, Big-O/Ω/Θ, các lớp độ tăng, phân tích vòng lặp.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Lý thuyết số & ứng dụng|||Chapter 5 — Number theory & applications', description: 'Chia hết, số nguyên tố, modulo, ƯCLN/Euclid, RSA.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Đếm & tổ hợp|||Chapter 6 — Counting & combinatorics', description: 'Quy tắc cộng/nhân, hoán vị, tổ hợp, chuồng bồ câu, nhị thức.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Truy hồi & xác suất|||Chapter 7 — Recurrence & probability', description: 'Quan hệ truy hồi, xác suất rời rạc, có điều kiện, kỳ vọng.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đồ thị & cây|||Chapter 8 — Graphs & trees', description: 'Đồ thị, Euler/Hamilton, cây, cây khung, tô màu.', lessons: [c8, c8q] },
  ],
};
