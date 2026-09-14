/**
 * MAA102 — Linear Algebra (Đại số tuyến tính). Ngành Robotics & AI, FPTU, kỳ 2.
 * Giáo trình chuẩn: Gilbert Strang "Introduction to Linear Algebra" + MIT 18.06;
 * David Lay "Linear Algebra and Its Applications"; Axler "Linear Algebra Done
 * Right"; 3Blue1Brown "Essence of Linear Algebra". Song ngữ + ví dụ NumPy + quiz.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 * Công thức viết bằng chữ Latin (KHÔNG ký tự Hy Lạp/Cyrillic). "<" trong code → &lt;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('maa102-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách kinh điển (Strang, Lay, Axler), MIT 18.06, 3Blue1Brown, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">MAA102 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Linear Algebra</strong> for Robotics &amp; AI — vectors, matrices, linear systems, eigenvalues and SVD — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal, world-class resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for MAA102 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference textbooks</h3>
<ul>
<li><a href="https://math.mit.edu/~gs/linearalgebra/" target="_blank" rel="noopener">Gilbert Strang — <em>Introduction to Linear Algebra</em></a> (the MAA102 backbone)</li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/linear-algebra-and-its-applications/P200000006185" target="_blank" rel="noopener">David C. Lay — <em>Linear Algebra and Its Applications</em></a></li>
<li><a href="https://linear.axler.net/" target="_blank" rel="noopener">Sheldon Axler — <em>Linear Algebra Done Right</em></a> (free PDF, theory-first)</li>
</ul>
<h3>🌐 Official / free courses</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/" target="_blank" rel="noopener">MIT 18.06 Linear Algebra (Strang) — full video course, notes &amp; exams</a></li>
<li><a href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/" target="_blank" rel="noopener">MIT 18.06SC — self-paced with problem sessions</a></li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab" target="_blank" rel="noopener">3Blue1Brown — <em>Essence of Linear Algebra</em></a> (build the geometric intuition first)</li>
<li><a href="https://www.youtube.com/@mitocw" target="_blank" rel="noopener">MIT OpenCourseWare — Strang's 18.06 lectures</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://numpy.org/doc/stable/reference/routines.linalg.html" target="_blank" rel="noopener">NumPy <code>numpy.linalg</code></a> — solve systems, eigenvalues, SVD in Python</li>
<li><a href="https://www.geogebra.org/m/YCZa8TAH" target="_blank" rel="noopener">GeoGebra — linear transformation visualizer</a></li>
<li><a href="https://www.wolframalpha.com/" target="_blank" rel="noopener">WolframAlpha</a> — check row-reduction, determinants, eigenvalues step by step</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Intuition first</strong> — watch 3Blue1Brown's <em>Essence of Linear Algebra</em> to see vectors, matrices and determinants geometrically.</li>
<li><strong>Foundation / exam core</strong> — vectors &amp; spaces, solving Ax = b by Gaussian elimination, matrix algebra, determinants &amp; inverses.</li>
<li><strong>Go deeper</strong> — subspaces, basis &amp; rank, linear maps, eigenvalues &amp; diagonalization, orthogonality and SVD.</li>
<li><strong>Job-ready</strong> — reproduce every result in NumPy; apply SVD/least squares to graphics, ML and robot kinematics.</li>
</ol></div>`,
    `<span class="eyebrow">MAA102 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Đại số tuyến tính</strong> cho Robotics &amp; AI — vector, ma trận, hệ phương trình, trị riêng và SVD — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp, hàng đầu thế giới.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của MAA102 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://math.mit.edu/~gs/linearalgebra/" target="_blank" rel="noopener">Gilbert Strang — <em>Introduction to Linear Algebra</em></a> (xương sống của MAA102)</li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/linear-algebra-and-its-applications/P200000006185" target="_blank" rel="noopener">David C. Lay — <em>Linear Algebra and Its Applications</em></a></li>
<li><a href="https://linear.axler.net/" target="_blank" rel="noopener">Sheldon Axler — <em>Linear Algebra Done Right</em></a> (PDF miễn phí, nặng lý thuyết)</li>
</ul>
<h3>🌐 Khoá học chính thức / miễn phí</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/" target="_blank" rel="noopener">MIT 18.06 Linear Algebra (Strang) — trọn bộ video, ghi chú &amp; đề thi</a></li>
<li><a href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/" target="_blank" rel="noopener">MIT 18.06SC — bản tự học kèm buổi giải bài</a></li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab" target="_blank" rel="noopener">3Blue1Brown — <em>Essence of Linear Algebra</em></a> (xây trực giác hình học trước tiên)</li>
<li><a href="https://www.youtube.com/@mitocw" target="_blank" rel="noopener">MIT OpenCourseWare — bài giảng 18.06 của Strang</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://numpy.org/doc/stable/reference/routines.linalg.html" target="_blank" rel="noopener">NumPy <code>numpy.linalg</code></a> — giải hệ, trị riêng, SVD trong Python</li>
<li><a href="https://www.geogebra.org/m/YCZa8TAH" target="_blank" rel="noopener">GeoGebra — trực quan hoá phép biến đổi tuyến tính</a></li>
<li><a href="https://www.wolframalpha.com/" target="_blank" rel="noopener">WolframAlpha</a> — kiểm khử hàng, định thức, trị riêng từng bước</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Trực giác trước</strong> — xem <em>Essence of Linear Algebra</em> của 3Blue1Brown để thấy vector, ma trận và định thức bằng hình học.</li>
<li><strong>Nền / lõi thi</strong> — vector &amp; không gian, giải Ax = b bằng khử Gauss, đại số ma trận, định thức &amp; nghịch đảo.</li>
<li><strong>Đào sâu</strong> — không gian con, cơ sở &amp; hạng, ánh xạ tuyến tính, trị riêng &amp; chéo hoá, trực giao và SVD.</li>
<li><strong>Sẵn sàng đi làm</strong> — dựng lại mọi kết quả bằng NumPy; áp dụng SVD/bình phương tối thiểu vào đồ hoạ, ML và động học robot.</li>
</ol></div>`,
  ]]);

const intro = doc('maa102-0-1-overview', 'Course overview: Linear Algebra|||Tổng quan: Đại số tuyến tính',
  'Đại số tuyến tính là gì; vì sao là ngôn ngữ của robotics & AI; hai câu hỏi cốt lõi (giải Ax=b và Ax=lambda·x); lộ trình 8 chương.',
  [[
    `<span class="eyebrow">MAA102 · Lesson 0.1 · Overview</span>
<h2>Linear Algebra — the language of robotics &amp; AI</h2>
<p class="lead">Linear algebra is the mathematics of <strong>vectors</strong>, <strong>matrices</strong> and the <strong>linear transformations</strong> between them. It is the single most-used branch of math in machine learning, computer graphics and robotics: an image is a matrix, a neural-network layer is a matrix multiply, a robot's pose is a vector transformed by rotation matrices.</p>
<h3>Two questions the whole course answers</h3>
<ul>
<li><strong>Solve <code>A x = b</code></strong> — given a linear system, find the unknown vector x. This covers systems, elimination, inverses, rank and least squares.</li>
<li><strong>Solve <code>A x = lambda · x</code></strong> — find the special directions (eigenvectors) a matrix only stretches, and the factor lambda it stretches them by. This covers eigenvalues, diagonalization and SVD.</li>
</ul>
<h3>Why it matters for AI &amp; robots</h3>
<pre><code>image / dataset      -> a matrix of numbers
rotate / scale / move -> multiply by a matrix
neural net layer      -> y = W x + b   (matrix + vector)
compress / denoise    -> keep the top singular values (SVD)
robot arm pose        -> chain of rotation + translation matrices
</code></pre>
<h3>Roadmap — 8 chapters</h3>
<p>Vectors &amp; vector spaces → linear systems &amp; Gaussian elimination → matrices &amp; operations → determinants &amp; inverses → subspaces, basis, rank &amp; dimension → linear maps &amp; their matrices → eigenvalues, eigenvectors &amp; diagonalization → orthogonality, least squares &amp; SVD. Bilingual, with NumPy examples and a quiz per chapter.</p>`,
    `<span class="eyebrow">MAA102 · Bài 0.1 · Tổng quan</span>
<h2>Đại số tuyến tính — ngôn ngữ của robotics &amp; AI</h2>
<p class="lead">Đại số tuyến tính là toán học của <strong>vector</strong>, <strong>ma trận</strong> và các <strong>phép biến đổi tuyến tính</strong> giữa chúng. Đây là nhánh toán được dùng nhiều nhất trong học máy, đồ hoạ máy tính và robotics: một ảnh là một ma trận, một tầng mạng nơ-ron là một phép nhân ma trận, tư thế của robot là một vector được biến đổi bởi các ma trận xoay.</p>
<h3>Hai câu hỏi cả môn học trả lời</h3>
<ul>
<li><strong>Giải <code>A x = b</code></strong> — cho một hệ tuyến tính, tìm vector ẩn x. Bao gồm hệ phương trình, khử Gauss, nghịch đảo, hạng và bình phương tối thiểu.</li>
<li><strong>Giải <code>A x = lambda · x</code></strong> — tìm các hướng đặc biệt (vector riêng) mà ma trận chỉ kéo dãn, cùng hệ số lambda mà nó kéo dãn. Bao gồm trị riêng, chéo hoá và SVD.</li>
</ul>
<h3>Vì sao quan trọng với AI &amp; robot</h3>
<pre><code>ảnh / tập dữ liệu     -> một ma trận số
xoay / co dãn / dịch  -> nhân với một ma trận
tầng mạng nơ-ron      -> y = W x + b   (ma trận + vector)
nén / khử nhiễu       -> giữ các trị kỳ dị lớn nhất (SVD)
tư thế cánh tay robot -> chuỗi ma trận xoay + tịnh tiến
</code></pre>
<h3>Lộ trình — 8 chương</h3>
<p>Vector &amp; không gian vector → hệ tuyến tính &amp; khử Gauss → ma trận &amp; phép toán → định thức &amp; nghịch đảo → không gian con, cơ sở, hạng &amp; số chiều → ánh xạ tuyến tính &amp; ma trận biểu diễn → trị riêng, vector riêng &amp; chéo hoá → trực giao, bình phương tối thiểu &amp; SVD. Song ngữ, có ví dụ NumPy và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('maa102-1-1-vectors-spaces', '1.1 — Vectors, vector spaces & linear combinations|||1.1 — Vector, không gian vector & tổ hợp tuyến tính',
  'Vector trong R^n, cộng vector & nhân vô hướng; tổ hợp tuyến tính & span; phụ thuộc/độc lập tuyến tính; tiên đề không gian vector.',
  [[
    `<span class="eyebrow">MAA102 · Chapter 1 · Lesson 1.1</span>
<h2>Vectors, vector spaces &amp; linear combinations</h2>
<h3>What is a vector?</h3>
<p>A <strong>vector</strong> in R^n is an ordered list of n numbers — an arrow from the origin, or simply a point in n-dimensional space. Two operations define everything: <strong>addition</strong> (tip to tail) and <strong>scalar multiplication</strong> (stretch/shrink).</p>
<pre><code>u = (1, 2),  v = (3, 0)
u + v      = (4, 2)          # add componentwise
3 * u      = (3, 6)          # scale each component
2u - v     = (2,4) - (3,0) = (-1, 4)
</code></pre>
<h3>Linear combinations &amp; span</h3>
<p>A <strong>linear combination</strong> of vectors v1, v2, ..., vk is any sum <code>c1·v1 + c2·v2 + ... + ck·vk</code>. The set of ALL such combinations is their <strong>span</strong> — everything you can reach using those vectors. In R^2, two vectors that don't lie on the same line span the entire plane.</p>
<h3>Linear independence</h3>
<p>Vectors are <strong>linearly independent</strong> if the only way to combine them to get the zero vector is with all coefficients zero. If one vector is a combination of the others, they are <strong>dependent</strong> (redundant). Independence is what makes a set a good coordinate system.</p>
<h3>Vector space — the rules</h3>
<p>A <strong>vector space</strong> is any set where addition and scalar multiplication obey the usual rules (closure, a zero vector, associativity, distributivity...). R^n is the model, but polynomials and matrices form vector spaces too.</p>
<div class="callout"><span class="badge">Robotics view</span> A robot's position, velocity and force are all vectors in R^3. Combining motions = adding vectors; speeding up = scalar multiplication.</div>`,
    `<span class="eyebrow">MAA102 · Chương 1 · Bài 1.1</span>
<h2>Vector, không gian vector &amp; tổ hợp tuyến tính</h2>
<h3>Vector là gì?</h3>
<p>Một <strong>vector</strong> trong R^n là một danh sách có thứ tự gồm n số — một mũi tên từ gốc toạ độ, hay đơn giản là một điểm trong không gian n chiều. Hai phép toán định nghĩa tất cả: <strong>cộng</strong> (nối đuôi mũi tên) và <strong>nhân vô hướng</strong> (kéo dãn/co lại).</p>
<pre><code>u = (1, 2),  v = (3, 0)
u + v      = (4, 2)          # cộng theo từng thành phần
3 * u      = (3, 6)          # nhân mỗi thành phần
2u - v     = (2,4) - (3,0) = (-1, 4)
</code></pre>
<h3>Tổ hợp tuyến tính &amp; span</h3>
<p>Một <strong>tổ hợp tuyến tính</strong> của các vector v1, v2, ..., vk là mọi tổng dạng <code>c1·v1 + c2·v2 + ... + ck·vk</code>. Tập TẤT CẢ các tổ hợp đó là <strong>span</strong> của chúng — mọi điểm bạn có thể chạm tới bằng các vector này. Trong R^2, hai vector không cùng nằm trên một đường thẳng sẽ span toàn bộ mặt phẳng.</p>
<h3>Độc lập tuyến tính</h3>
<p>Các vector <strong>độc lập tuyến tính</strong> nếu cách duy nhất để tổ hợp chúng ra vector không là cho tất cả hệ số bằng 0. Nếu một vector là tổ hợp của các vector còn lại thì chúng <strong>phụ thuộc</strong> (thừa). Tính độc lập là thứ khiến một bộ vector trở thành hệ toạ độ tốt.</p>
<h3>Không gian vector — các quy tắc</h3>
<p>Một <strong>không gian vector</strong> là tập bất kỳ mà phép cộng và nhân vô hướng tuân theo các quy tắc quen thuộc (đóng kín, có vector không, kết hợp, phân phối...). R^n là mô hình chuẩn, nhưng đa thức và ma trận cũng lập thành không gian vector.</p>
<div class="callout"><span class="badge">Góc nhìn robotics</span> Vị trí, vận tốc và lực của robot đều là vector trong R^3. Kết hợp chuyển động = cộng vector; tăng tốc = nhân vô hướng.</div>`,
  ]]);

const c1q = quiz('maa102-quiz-1', 'Quiz 1 — Vectors & spaces|||Quiz 1 — Vector & không gian', [
  { id: 'q1', question: 'Với u = (1, 2) và v = (3, 0), thì 2u − v bằng?', options: ['(-1, 4)', '(5, 4)', '(-1, 2)', '(2, 4)'], correctIndex: 0, explanation: '2u = (2,4); (2,4) − (3,0) = (−1, 4).' },
  { id: 'q2', question: '"Span" của một bộ vector là gì?', options: ['Vector dài nhất trong bộ', 'Tập TẤT CẢ tổ hợp tuyến tính của chúng', 'Tổng các vector', 'Số phần tử của bộ'], correctIndex: 1, explanation: 'Span = mọi điểm chạm tới được bằng c1·v1 + ... + ck·vk.' },
  { id: 'q3', question: 'Một bộ vector phụ thuộc tuyến tính khi nào?', options: ['Chỉ tổ hợp hệ số 0 mới ra vector không', 'Ít nhất một vector là tổ hợp của các vector còn lại', 'Chúng vuông góc nhau', 'Chúng có cùng độ dài'], correctIndex: 1, explanation: 'Phụ thuộc = có vector thừa, viết được qua các vector khác.' },
]);

const c2 = doc('maa102-2-1-linear-systems', '2.1 — Linear systems & Gaussian elimination|||2.1 — Hệ phương trình tuyến tính & khử Gauss',
  'Hệ Ax=b & ma trận bổ sung; phép biến đổi hàng & dạng bậc thang (REF/RREF); pivot; vô nghiệm/duy nhất/vô số nghiệm.',
  [[
    `<span class="eyebrow">MAA102 · Chapter 2 · Lesson 2.1</span>
<h2>Linear systems &amp; Gaussian elimination</h2>
<h3>A system is a matrix equation</h3>
<p>A set of linear equations packs neatly into <code>A x = b</code>: A holds the coefficients, x the unknowns, b the right-hand side. We solve it by working on the <strong>augmented matrix</strong> [A | b].</p>
<pre><code>2x + y = 5          [ 2  1 | 5 ]
 x - y = 1    -->    [ 1 -1 | 1 ]
</code></pre>
<h3>Elementary row operations</h3>
<p>Three moves change the numbers but NOT the solution set: (1) swap two rows, (2) multiply a row by a nonzero scalar, (3) add a multiple of one row to another. <strong>Gaussian elimination</strong> uses them to reach <strong>row echelon form</strong> (staircase of leading entries = <em>pivots</em>), then <em>back-substitutes</em>.</p>
<pre><code>[ 2  1 | 5 ]  R2 &lt;- R2 - (1/2)R1   [ 2   1  |  5   ]
[ 1 -1 | 1 ]  ------------------>  [ 0 -1.5 | -1.5 ]
-1.5 y = -1.5  ->  y = 1;   2x + 1 = 5  ->  x = 2
</code></pre>
<h3>Three possible outcomes</h3>
<ul>
<li><strong>Unique solution</strong> — a pivot in every column of unknowns.</li>
<li><strong>No solution</strong> — a row says <code>0 = nonzero</code> (inconsistent).</li>
<li><strong>Infinitely many</strong> — a free column (no pivot) leaves a free variable.</li>
</ul>
<pre><code>import numpy as np
A = np.array([[2, 1], [1, -1]]); b = np.array([5, 1])
x = np.linalg.solve(A, b)      # -> [2. 1.]
</code></pre>
<div class="callout"><span class="badge">Reduced form</span> Keep eliminating upward and scale pivots to 1 to reach <strong>RREF</strong> — the unique "cleanest" form that reads the solution off directly.</div>`,
    `<span class="eyebrow">MAA102 · Chương 2 · Bài 2.1</span>
<h2>Hệ phương trình tuyến tính &amp; khử Gauss</h2>
<h3>Một hệ là một phương trình ma trận</h3>
<p>Một tập phương trình tuyến tính gói gọn thành <code>A x = b</code>: A chứa hệ số, x là ẩn, b là vế phải. Ta giải bằng cách thao tác trên <strong>ma trận bổ sung</strong> [A | b].</p>
<pre><code>2x + y = 5          [ 2  1 | 5 ]
 x - y = 1    -->    [ 1 -1 | 1 ]
</code></pre>
<h3>Phép biến đổi hàng sơ cấp</h3>
<p>Ba thao tác đổi các con số nhưng KHÔNG đổi tập nghiệm: (1) đổi chỗ hai hàng, (2) nhân một hàng với vô hướng khác 0, (3) cộng vào một hàng bội của hàng khác. <strong>Khử Gauss</strong> dùng chúng để đạt <strong>dạng bậc thang hàng</strong> (bậc thang các phần tử dẫn = <em>pivot</em>), rồi <em>thế ngược</em>.</p>
<pre><code>[ 2  1 | 5 ]  R2 &lt;- R2 - (1/2)R1   [ 2   1  |  5   ]
[ 1 -1 | 1 ]  ------------------>  [ 0 -1.5 | -1.5 ]
-1.5 y = -1.5  ->  y = 1;   2x + 1 = 5  ->  x = 2
</code></pre>
<h3>Ba khả năng xảy ra</h3>
<ul>
<li><strong>Nghiệm duy nhất</strong> — mỗi cột ẩn đều có pivot.</li>
<li><strong>Vô nghiệm</strong> — có hàng nói <code>0 = số khác 0</code> (mâu thuẫn).</li>
<li><strong>Vô số nghiệm</strong> — có cột tự do (không pivot) tạo biến tự do.</li>
</ul>
<pre><code>import numpy as np
A = np.array([[2, 1], [1, -1]]); b = np.array([5, 1])
x = np.linalg.solve(A, b)      # -> [2. 1.]
</code></pre>
<div class="callout"><span class="badge">Dạng rút gọn</span> Tiếp tục khử lên trên và chuẩn hoá pivot về 1 để đạt <strong>RREF</strong> — dạng "sạch nhất" duy nhất, đọc thẳng ra nghiệm.</div>`,
  ]]);

const c2q = quiz('maa102-quiz-2', 'Quiz 2 — Systems & elimination|||Quiz 2 — Hệ & khử Gauss', [
  { id: 'q1', question: 'Phép biến đổi hàng sơ cấp KHÔNG làm thay đổi điều gì?', options: ['Các con số trong ma trận', 'Tập nghiệm của hệ', 'Vị trí các hàng', 'Giá trị pivot'], correctIndex: 1, explanation: 'Ba phép biến đổi hàng giữ nguyên tập nghiệm; chỉ số liệu đổi.' },
  { id: 'q2', question: 'Trong khi khử, xuất hiện hàng dạng "0 = 5" nghĩa là?', options: ['Nghiệm duy nhất', 'Vô số nghiệm', 'Vô nghiệm (hệ mâu thuẫn)', 'Cần đổi hai hàng'], correctIndex: 2, explanation: '0 = số khác 0 là mâu thuẫn ⇒ hệ vô nghiệm.' },
  { id: 'q3', question: 'Một cột ẩn KHÔNG có pivot (cột tự do) dẫn đến?', options: ['Biến tự do ⇒ vô số nghiệm', 'Hệ vô nghiệm', 'Ma trận khả nghịch', 'Định thức bằng 1'], correctIndex: 0, explanation: 'Cột tự do sinh biến tự do ⇒ vô số nghiệm (nếu nhất quán).' },
]);

const c3 = doc('maa102-3-1-matrices', '3.1 — Matrices & matrix operations|||3.1 — Ma trận & phép toán ma trận',
  'Cộng/nhân vô hướng ma trận; nhân ma trận (hàng × cột, KHÔNG giao hoán); chuyển vị; ma trận đơn vị; ma trận như phép biến đổi.',
  [[
    `<span class="eyebrow">MAA102 · Chapter 3 · Lesson 3.1</span>
<h2>Matrices &amp; matrix operations</h2>
<h3>What a matrix is</h3>
<p>A <strong>matrix</strong> is a rectangular grid of numbers with m rows and n columns (an m x n matrix). It can store data, but its real power is representing a <strong>linear transformation</strong>: multiplying by A moves every vector to a new place.</p>
<h3>Addition &amp; scalar multiply</h3>
<p>Add matrices of the same shape entry by entry; scale by multiplying every entry — same as with vectors.</p>
<h3>Matrix multiplication</h3>
<p>To multiply A (m x n) by B (n x p), the inner dimensions must match; entry (i, j) of the product is the <strong>dot product of row i of A with column j of B</strong>.</p>
<pre><code>A = [1 2]   B = [5 6]
    [3 4]       [7 8]

AB = [1*5+2*7  1*6+2*8] = [19 22]
     [3*5+4*7  3*6+4*8]   [43 50]
</code></pre>
<p><strong>Order matters:</strong> in general <code>AB is not equal to BA</code>. Matrix multiplication is <em>not commutative</em> — it composes transformations, and the order you apply rotations/scalings changes the result.</p>
<h3>Transpose &amp; identity</h3>
<p>The <strong>transpose</strong> A^T flips rows and columns. The <strong>identity</strong> I has 1s on the diagonal and 0 elsewhere: <code>A I = I A = A</code> — the "do nothing" transformation.</p>
<pre><code>import numpy as np
A = np.array([[1,2],[3,4]]); B = np.array([[5,6],[7,8]])
A @ B        # matrix product [[19,22],[43,50]]
A.T          # transpose      [[1,3],[2,4]]
</code></pre>
<div class="callout"><span class="badge">AI view</span> A neural-network layer is exactly <code>y = W x + b</code>: matrix W times input vector x, plus a bias. Deep learning is stacked matrix multiplies.</div>`,
    `<span class="eyebrow">MAA102 · Chương 3 · Bài 3.1</span>
<h2>Ma trận &amp; phép toán ma trận</h2>
<h3>Ma trận là gì</h3>
<p>Một <strong>ma trận</strong> là lưới số chữ nhật gồm m hàng và n cột (ma trận m x n). Nó có thể lưu dữ liệu, nhưng sức mạnh thật sự là biểu diễn một <strong>phép biến đổi tuyến tính</strong>: nhân với A đưa mọi vector tới vị trí mới.</p>
<h3>Cộng &amp; nhân vô hướng</h3>
<p>Cộng hai ma trận cùng kích thước theo từng phần tử; nhân vô hướng bằng cách nhân mọi phần tử — giống với vector.</p>
<h3>Nhân ma trận</h3>
<p>Để nhân A (m x n) với B (n x p), hai chiều trong phải khớp; phần tử (i, j) của tích là <strong>tích vô hướng của hàng i của A với cột j của B</strong>.</p>
<pre><code>A = [1 2]   B = [5 6]
    [3 4]       [7 8]

AB = [1*5+2*7  1*6+2*8] = [19 22]
     [3*5+4*7  3*6+4*8]   [43 50]
</code></pre>
<p><strong>Thứ tự quan trọng:</strong> nói chung <code>AB khác BA</code>. Nhân ma trận <em>không giao hoán</em> — nó ghép các phép biến đổi, và thứ tự áp dụng xoay/co dãn làm đổi kết quả.</p>
<h3>Chuyển vị &amp; ma trận đơn vị</h3>
<p><strong>Chuyển vị</strong> A^T đổi hàng thành cột. <strong>Ma trận đơn vị</strong> I có số 1 trên đường chéo, 0 ở nơi khác: <code>A I = I A = A</code> — phép biến đổi "không làm gì".</p>
<pre><code>import numpy as np
A = np.array([[1,2],[3,4]]); B = np.array([[5,6],[7,8]])
A @ B        # tích ma trận [[19,22],[43,50]]
A.T          # chuyển vị    [[1,3],[2,4]]
</code></pre>
<div class="callout"><span class="badge">Góc nhìn AI</span> Một tầng mạng nơ-ron chính là <code>y = W x + b</code>: ma trận W nhân vector vào x, cộng độ lệch. Học sâu là các phép nhân ma trận chồng lên nhau.</div>`,
  ]]);

const c3q = quiz('maa102-quiz-3', 'Quiz 3 — Matrix operations|||Quiz 3 — Phép toán ma trận', [
  { id: 'q1', question: 'Để nhân được A·B với A cỡ m×n, thì B phải có cỡ?', options: ['m × bất kỳ', 'n × p (số hàng của B = số cột của A)', 'p × n', 'n × m'], correctIndex: 1, explanation: 'Chiều trong phải khớp: A (m×n) · B (n×p) → tích (m×p).' },
  { id: 'q2', question: 'Về nhân ma trận, phát biểu nào ĐÚNG?', options: ['Luôn AB = BA', 'Nói chung AB ≠ BA (không giao hoán)', 'AB = BA khi A vuông', 'Không bao giờ AB = BA'], correctIndex: 1, explanation: 'Nhân ma trận không giao hoán; đôi khi trùng nhưng không phải luật.' },
  { id: 'q3', question: 'Ma trận đơn vị I có tính chất gì?', options: ['A·I = I·A = A', 'A·I = 0', 'I·A = A^T', 'I nhân làm đổi dấu A'], correctIndex: 0, explanation: 'I là phần tử đơn vị của phép nhân: giữ nguyên mọi ma trận/vector.' },
]);

const c4 = doc('maa102-4-1-determinant-inverse', '4.1 — Determinants & the matrix inverse|||4.1 — Định thức & ma trận nghịch đảo',
  'Định thức 2×2, 3×3 & ý nghĩa (diện tích/thể tích, khả nghịch); ma trận nghịch đảo, công thức 2×2, giải Ax=b bằng A^{-1}.',
  [[
    `<span class="eyebrow">MAA102 · Chapter 4 · Lesson 4.1</span>
<h2>Determinants &amp; the matrix inverse</h2>
<h3>The determinant</h3>
<p>The <strong>determinant</strong> det(A) is a single number attached to a square matrix. Geometrically it is the <strong>area (2D) or volume (3D) scaling factor</strong> of the transformation A — and its <em>sign</em> tells you whether orientation is flipped.</p>
<pre><code>2x2:  det [a b] = a*d - b*c
          [c d]

det [1 2] = 1*4 - 2*3 = -2
    [3 4]
</code></pre>
<p>The key fact: <strong>A is invertible if and only if det(A) is not 0</strong>. A zero determinant means A squashes space into a lower dimension — information is lost, so it cannot be undone.</p>
<h3>The inverse</h3>
<p>The <strong>inverse</strong> A^(-1) undoes A: <code>A A^(-1) = A^(-1) A = I</code>. For a 2x2 matrix there is a formula:</p>
<pre><code>A^-1 = (1/det A) * [ d -b]
                   [-c  a]

A = [1 2], det = -2
    [3 4]
A^-1 = (1/-2)[ 4 -2] = [-2   1 ]
             [-3  1]   [ 1.5 -0.5]
</code></pre>
<p>If A is invertible, <code>A x = b</code> has the unique solution <code>x = A^(-1) b</code>. (In practice we solve by elimination, which is faster and more stable than forming the inverse.)</p>
<pre><code>import numpy as np
A = np.array([[1,2],[3,4]])
np.linalg.det(A)   # -2.0
np.linalg.inv(A)   # [[-2. ,  1. ], [ 1.5, -0.5]]
</code></pre>
<div class="callout"><span class="badge">Robotics view</span> A rotation matrix always has det = 1 (it preserves lengths and orientation); its inverse is simply its transpose.</div>`,
    `<span class="eyebrow">MAA102 · Chương 4 · Bài 4.1</span>
<h2>Định thức &amp; ma trận nghịch đảo</h2>
<h3>Định thức</h3>
<p><strong>Định thức</strong> det(A) là một con số gắn với ma trận vuông. Về hình học, nó là <strong>hệ số co dãn diện tích (2D) hay thể tích (3D)</strong> của phép biến đổi A — và <em>dấu</em> của nó cho biết hướng có bị lật hay không.</p>
<pre><code>2x2:  det [a b] = a*d - b*c
          [c d]

det [1 2] = 1*4 - 2*3 = -2
    [3 4]
</code></pre>
<p>Sự thật cốt lõi: <strong>A khả nghịch khi và chỉ khi det(A) khác 0</strong>. Định thức bằng 0 nghĩa là A ép không gian xuống chiều thấp hơn — mất thông tin, nên không thể hoàn tác.</p>
<h3>Ma trận nghịch đảo</h3>
<p><strong>Nghịch đảo</strong> A^(-1) hoàn tác A: <code>A A^(-1) = A^(-1) A = I</code>. Với ma trận 2x2 có công thức:</p>
<pre><code>A^-1 = (1/det A) * [ d -b]
                   [-c  a]

A = [1 2], det = -2
    [3 4]
A^-1 = (1/-2)[ 4 -2] = [-2   1 ]
             [-3  1]   [ 1.5 -0.5]
</code></pre>
<p>Nếu A khả nghịch, <code>A x = b</code> có nghiệm duy nhất <code>x = A^(-1) b</code>. (Thực tế ta giải bằng khử Gauss, nhanh và ổn định hơn việc lập nghịch đảo.)</p>
<pre><code>import numpy as np
A = np.array([[1,2],[3,4]])
np.linalg.det(A)   # -2.0
np.linalg.inv(A)   # [[-2. ,  1. ], [ 1.5, -0.5]]
</code></pre>
<div class="callout"><span class="badge">Góc nhìn robotics</span> Ma trận xoay luôn có det = 1 (giữ nguyên độ dài và hướng); nghịch đảo của nó chính là chuyển vị.</div>`,
  ]]);

const c4q = quiz('maa102-quiz-4', 'Quiz 4 — Determinant & inverse|||Quiz 4 — Định thức & nghịch đảo', [
  { id: 'q1', question: 'Định thức của ma trận [[1,2],[3,4]] bằng?', options: ['−2', '10', '2', '−10'], correctIndex: 0, explanation: 'det = a·d − b·c = 1·4 − 2·3 = 4 − 6 = −2.' },
  { id: 'q2', question: 'Ma trận vuông A khả nghịch khi nào?', options: ['Khi det(A) = 0', 'Khi det(A) ≠ 0', 'Khi A đối xứng', 'Luôn khả nghịch'], correctIndex: 1, explanation: 'det ≠ 0 ⇔ khả nghịch; det = 0 nghĩa là A ép không gian xuống chiều thấp.' },
  { id: 'q3', question: 'Ý nghĩa hình học của |det(A)| trong 2D là?', options: ['Chu vi', 'Hệ số co dãn DIỆN TÍCH của phép biến đổi', 'Số pivot', 'Độ dài vector'], correctIndex: 1, explanation: '|det| là hệ số nhân diện tích (2D)/thể tích (3D); dấu cho biết lật hướng.' },
]);

const c5 = doc('maa102-5-1-subspaces-basis-rank', '5.1 — Subspaces, basis, rank & dimension|||5.1 — Không gian con, cơ sở, hạng & số chiều',
  'Không gian con; bốn không gian con cơ bản (cột/hàng/null); cơ sở & số chiều; hạng (rank) & định lý hạng–vô hiệu.',
  [[
    `<span class="eyebrow">MAA102 · Chapter 5 · Lesson 5.1</span>
<h2>Subspaces, basis, rank &amp; dimension</h2>
<h3>Subspace</h3>
<p>A <strong>subspace</strong> is a subset of R^n that is itself a vector space: it contains the zero vector and is closed under addition and scaling (a line or plane through the origin). Every span is a subspace.</p>
<h3>Basis &amp; dimension</h3>
<p>A <strong>basis</strong> is a set of vectors that is (1) linearly independent and (2) spans the space — the minimal set of "building blocks". The number of vectors in any basis is the <strong>dimension</strong>. R^3 has dimension 3; its standard basis is (1,0,0), (0,1,0), (0,0,1).</p>
<h3>The column space &amp; null space</h3>
<ul>
<li><strong>Column space</strong> C(A) — the span of A's columns; all vectors b for which <code>A x = b</code> is solvable.</li>
<li><strong>Null space</strong> N(A) — all x with <code>A x = 0</code>; describes the free directions / the solution's freedom.</li>
</ul>
<h3>Rank</h3>
<p>The <strong>rank</strong> of A is the number of pivots = the dimension of its column space = number of independent rows (or columns). The <strong>rank–nullity theorem</strong> ties it together:</p>
<pre><code>rank(A) + dim(null space) = n   (number of columns)

A = [1 2 3]   after elimination -> 2 pivots
    [2 4 6]   row 2 = 2 * row 1  -> rank = 1
                                  -> nullity = 3 - 1 = 2
</code></pre>
<pre><code>import numpy as np
A = np.array([[1,2,3],[2,4,6]])
np.linalg.matrix_rank(A)    # 1
</code></pre>
<div class="callout"><span class="badge">Full rank matters</span> A matrix has "full rank" when its columns are all independent — the condition for a unique solution and for data with no redundant features.</div>`,
    `<span class="eyebrow">MAA102 · Chương 5 · Bài 5.1</span>
<h2>Không gian con, cơ sở, hạng &amp; số chiều</h2>
<h3>Không gian con</h3>
<p>Một <strong>không gian con</strong> là tập con của R^n mà bản thân là một không gian vector: chứa vector không và đóng kín với phép cộng và nhân vô hướng (một đường thẳng hay mặt phẳng đi qua gốc). Mọi span đều là không gian con.</p>
<h3>Cơ sở &amp; số chiều</h3>
<p>Một <strong>cơ sở</strong> là bộ vector vừa (1) độc lập tuyến tính vừa (2) span cả không gian — bộ "khối xây" tối thiểu. Số vector trong mọi cơ sở là <strong>số chiều</strong>. R^3 có số chiều 3; cơ sở chuẩn là (1,0,0), (0,1,0), (0,0,1).</p>
<h3>Không gian cột &amp; không gian null</h3>
<ul>
<li><strong>Không gian cột</strong> C(A) — span các cột của A; tất cả vector b để <code>A x = b</code> giải được.</li>
<li><strong>Không gian null</strong> N(A) — mọi x thoả <code>A x = 0</code>; mô tả các hướng tự do / độ tự do của nghiệm.</li>
</ul>
<h3>Hạng (rank)</h3>
<p><strong>Hạng</strong> của A là số pivot = số chiều không gian cột = số hàng (hoặc cột) độc lập. <strong>Định lý hạng–vô hiệu</strong> gắn chúng lại:</p>
<pre><code>rank(A) + dim(không gian null) = n   (số cột)

A = [1 2 3]   sau khử -> 2 pivot?
    [2 4 6]   hàng 2 = 2 * hàng 1  -> rank = 1
                                   -> nullity = 3 - 1 = 2
</code></pre>
<pre><code>import numpy as np
A = np.array([[1,2,3],[2,4,6]])
np.linalg.matrix_rank(A)    # 1
</code></pre>
<div class="callout"><span class="badge">Đủ hạng quan trọng</span> Ma trận "đủ hạng" khi các cột đều độc lập — điều kiện cho nghiệm duy nhất và cho dữ liệu không có đặc trưng thừa.</div>`,
  ]]);

const c5q = quiz('maa102-quiz-5', 'Quiz 5 — Basis & rank|||Quiz 5 — Cơ sở & hạng', [
  { id: 'q1', question: 'Một cơ sở của không gian vector phải thoả điều gì?', options: ['Chỉ cần span', 'Chỉ cần độc lập tuyến tính', 'Vừa độc lập tuyến tính, vừa span cả không gian', 'Gồm các vector đơn vị'], correctIndex: 2, explanation: 'Cơ sở = bộ vector độc lập tuyến tính và span toàn không gian (tối thiểu).' },
  { id: 'q2', question: 'Hạng (rank) của một ma trận bằng?', options: ['Số hàng của ma trận', 'Số pivot = số hàng/cột độc lập', 'Định thức', 'Số phần tử khác 0'], correctIndex: 1, explanation: 'Rank = số pivot = số chiều không gian cột.' },
  { id: 'q3', question: 'Định lý hạng–vô hiệu (n = số cột) phát biểu?', options: ['rank(A) + dim(null) = n', 'rank(A) × dim(null) = n', 'rank(A) − dim(null) = n', 'rank(A) = det(A)'], correctIndex: 0, explanation: 'rank(A) + dim(không gian null) = số cột n.' },
]);

const c6 = doc('maa102-6-1-linear-maps', '6.1 — Linear maps & their matrix representation|||6.1 — Ánh xạ tuyến tính & ma trận biểu diễn',
  'Ánh xạ tuyến tính T(u+v)=Tu+Tv; mỗi ánh xạ ↔ một ma trận (cột = ảnh của vector cơ sở); xoay/co dãn/chiếu; ghép = nhân ma trận.',
  [[
    `<span class="eyebrow">MAA102 · Chapter 6 · Lesson 6.1</span>
<h2>Linear maps &amp; their matrix representation</h2>
<h3>What makes a map linear</h3>
<p>A <strong>linear map</strong> (linear transformation) T is a function on vectors that respects addition and scaling:</p>
<pre><code>T(u + v) = T(u) + T(v)
T(c * u) = c * T(u)
</code></pre>
<p>Consequence: T sends the origin to the origin, and straight lines stay straight and evenly spaced. Rotations, scalings, projections and shears are all linear; "add 1 to every coordinate" is NOT.</p>
<h3>Every linear map is a matrix</h3>
<p>The big idea: a linear map from R^n to R^m is completely captured by an m x n matrix. The trick — <strong>the columns of the matrix are the images of the standard basis vectors</strong>. Know where (1,0) and (0,1) go, and you know T everywhere.</p>
<pre><code>Rotation by 90 degrees in the plane:
  e1 = (1,0) -> (0, 1)
  e2 = (0,1) -> (-1, 0)
  => matrix  [0 -1]
             [1  0]
</code></pre>
<h3>Common 2D transforms</h3>
<pre><code>scale by k    [k 0]      reflect over x-axis  [1  0]
              [0 k]                            [0 -1]

project onto x-axis [1 0]
                    [0 0]
</code></pre>
<h3>Composition = matrix multiplication</h3>
<p>Applying T then S is the map with matrix <code>S A</code> (S's matrix times A's). This is exactly WHY matrix multiplication is defined the way it is — and why order matters.</p>
<div class="callout"><span class="badge">Graphics &amp; robotics</span> Every rotate/scale/move in a game engine or a robot arm is a linear (or affine) map applied as a matrix; chaining joints = multiplying their matrices.</div>`,
    `<span class="eyebrow">MAA102 · Chương 6 · Bài 6.1</span>
<h2>Ánh xạ tuyến tính &amp; ma trận biểu diễn</h2>
<h3>Điều gì khiến một ánh xạ là tuyến tính</h3>
<p>Một <strong>ánh xạ tuyến tính</strong> (phép biến đổi tuyến tính) T là hàm trên vector tôn trọng phép cộng và nhân vô hướng:</p>
<pre><code>T(u + v) = T(u) + T(v)
T(c * u) = c * T(u)
</code></pre>
<p>Hệ quả: T đưa gốc về gốc, và các đường thẳng vẫn thẳng, cách đều. Xoay, co dãn, chiếu và trượt đều tuyến tính; "cộng 1 vào mọi toạ độ" thì KHÔNG.</p>
<h3>Mọi ánh xạ tuyến tính là một ma trận</h3>
<p>Ý tưởng lớn: một ánh xạ tuyến tính từ R^n sang R^m được nắm trọn bởi một ma trận m x n. Mẹo — <strong>các cột của ma trận là ảnh của các vector cơ sở chuẩn</strong>. Biết (1,0) và (0,1) đi về đâu là biết T ở khắp nơi.</p>
<pre><code>Xoay 90 độ trong mặt phẳng:
  e1 = (1,0) -> (0, 1)
  e2 = (0,1) -> (-1, 0)
  => ma trận [0 -1]
             [1  0]
</code></pre>
<h3>Vài phép biến đổi 2D thường gặp</h3>
<pre><code>co dãn k     [k 0]      đối xứng qua trục x  [1  0]
             [0 k]                           [0 -1]

chiếu lên trục x [1 0]
                 [0 0]
</code></pre>
<h3>Ghép = nhân ma trận</h3>
<p>Áp dụng T rồi S là ánh xạ có ma trận <code>S A</code> (ma trận của S nhân ma trận của A). Đây chính là LÝ DO nhân ma trận được định nghĩa như vậy — và vì sao thứ tự quan trọng.</p>
<div class="callout"><span class="badge">Đồ hoạ &amp; robotics</span> Mỗi phép xoay/co dãn/dịch trong game engine hay cánh tay robot là một ánh xạ tuyến tính (hoặc affine) áp dụng bằng ma trận; nối các khớp = nhân các ma trận của chúng.</div>`,
  ]]);

const c6q = quiz('maa102-quiz-6', 'Quiz 6 — Linear maps|||Quiz 6 — Ánh xạ tuyến tính', [
  { id: 'q1', question: 'Điều kiện để T là ánh xạ tuyến tính?', options: ['T(u+v)=T(u)+T(v) và T(cu)=cT(u)', 'T(u+v)=T(u)·T(v)', 'T đưa mọi vector về vector không', 'T giữ nguyên độ dài'], correctIndex: 0, explanation: 'Tuyến tính = bảo toàn phép cộng và nhân vô hướng.' },
  { id: 'q2', question: 'Cột của ma trận biểu diễn một ánh xạ tuyến tính là gì?', options: ['Các vector riêng', 'Ảnh của các vector cơ sở chuẩn', 'Các pivot', 'Định thức từng phần'], correctIndex: 1, explanation: 'Cột thứ i = ảnh T(e_i) của vector cơ sở thứ i.' },
  { id: 'q3', question: 'Áp dụng phép biến đổi A rồi phép S tương ứng với ma trận?', options: ['A + S', 'S·A (nhân ma trận, đúng thứ tự)', 'A·S luôn luôn', 'A^T·S'], correctIndex: 1, explanation: 'Ghép ánh xạ = nhân ma trận S·A; thứ tự quan trọng.' },
]);

const c7 = doc('maa102-7-1-eigen', '7.1 — Eigenvalues, eigenvectors & diagonalization|||7.1 — Trị riêng, vector riêng & chéo hoá',
  'Ax=lambda·x; phương trình đặc trưng det(A−lambda·I)=0; tìm vector riêng; chéo hoá A=P·D·P^{-1} & luỹ thừa ma trận.',
  [[
    `<span class="eyebrow">MAA102 · Chapter 7 · Lesson 7.1</span>
<h2>Eigenvalues, eigenvectors &amp; diagonalization</h2>
<h3>The special directions</h3>
<p>Most vectors get knocked off their line when you multiply by A. An <strong>eigenvector</strong> is a rare vector that A only stretches — it stays on its own line. The stretch factor is the <strong>eigenvalue</strong> lambda:</p>
<pre><code>A x = lambda * x     (x not the zero vector)
</code></pre>
<h3>Finding them</h3>
<p>Rearrange to <code>(A - lambda·I) x = 0</code>. For a nonzero x to exist, that matrix must be singular, so its determinant is zero — the <strong>characteristic equation</strong>:</p>
<pre><code>det(A - lambda*I) = 0

A = [2 1]   det [2-L   1 ] = (2-L)^2 - 1 = 0
    [1 2]       [ 1  2-L]
=> L = 1 and L = 3        (the eigenvalues)

L = 3:  (A-3I)x=0 -> x = (1, 1)
L = 1:  (A-1I)x=0 -> x = (1, -1)
</code></pre>
<h3>Diagonalization</h3>
<p>If A (n x n) has n independent eigenvectors, put them in the columns of P and the eigenvalues on the diagonal of D. Then:</p>
<pre><code>A = P D P^-1        (D diagonal)

Powers become trivial:
A^k = P D^k P^-1    (just raise each diagonal entry to k)
</code></pre>
<p>This turns a hard repeated multiplication into raising numbers to a power — the engine behind Markov chains, population models and PageRank.</p>
<pre><code>import numpy as np
A = np.array([[2,1],[1,2]])
vals, vecs = np.linalg.eig(A)   # vals -> [3., 1.]
</code></pre>
<div class="callout"><span class="badge">AI view</span> PCA finds the eigenvectors of the data's covariance matrix — the directions of greatest variance — to reduce dimensions while keeping the most information.</div>`,
    `<span class="eyebrow">MAA102 · Chương 7 · Bài 7.1</span>
<h2>Trị riêng, vector riêng &amp; chéo hoá</h2>
<h3>Những hướng đặc biệt</h3>
<p>Phần lớn vector bị hất khỏi đường thẳng của nó khi nhân với A. Một <strong>vector riêng</strong> là vector hiếm mà A chỉ kéo dãn — nó vẫn nằm trên đường thẳng của chính mình. Hệ số kéo dãn là <strong>trị riêng</strong> lambda:</p>
<pre><code>A x = lambda * x     (x khác vector không)
</code></pre>
<h3>Cách tìm</h3>
<p>Biến đổi về <code>(A - lambda·I) x = 0</code>. Để tồn tại x khác không, ma trận đó phải suy biến, nên định thức bằng 0 — <strong>phương trình đặc trưng</strong>:</p>
<pre><code>det(A - lambda*I) = 0

A = [2 1]   det [2-L   1 ] = (2-L)^2 - 1 = 0
    [1 2]       [ 1  2-L]
=> L = 1 và L = 3        (các trị riêng)

L = 3:  (A-3I)x=0 -> x = (1, 1)
L = 1:  (A-1I)x=0 -> x = (1, -1)
</code></pre>
<h3>Chéo hoá</h3>
<p>Nếu A (n x n) có n vector riêng độc lập, đặt chúng vào các cột của P và các trị riêng lên đường chéo của D. Khi đó:</p>
<pre><code>A = P D P^-1        (D là ma trận chéo)

Luỹ thừa trở nên đơn giản:
A^k = P D^k P^-1    (chỉ cần nâng mỗi phần tử chéo lên k)
</code></pre>
<p>Điều này biến phép nhân lặp khó nhằn thành nâng số lên luỹ thừa — động cơ sau xích Markov, mô hình dân số và PageRank.</p>
<pre><code>import numpy as np
A = np.array([[2,1],[1,2]])
vals, vecs = np.linalg.eig(A)   # vals -> [3., 1.]
</code></pre>
<div class="callout"><span class="badge">Góc nhìn AI</span> PCA tìm các vector riêng của ma trận hiệp phương sai dữ liệu — các hướng phương sai lớn nhất — để giảm chiều mà vẫn giữ nhiều thông tin nhất.</div>`,
  ]]);

const c7q = quiz('maa102-quiz-7', 'Quiz 7 — Eigenvalues|||Quiz 7 — Trị riêng', [
  { id: 'q1', question: 'Vector riêng x của A (ứng với trị riêng lambda) thoả?', options: ['A·x = x + lambda', 'A·x = lambda·x', 'A·x = 0 với mọi x', 'x·A = lambda'], correctIndex: 1, explanation: 'Định nghĩa: A·x = lambda·x, x khác vector không.' },
  { id: 'q2', question: 'Trị riêng được tìm bằng cách giải phương trình nào?', options: ['det(A) = 0', 'det(A − lambda·I) = 0 (phương trình đặc trưng)', 'A·x = b', 'rank(A) = n'], correctIndex: 1, explanation: 'Để (A − lambda·I)x = 0 có nghiệm khác 0 thì det(A − lambda·I) = 0.' },
  { id: 'q3', question: 'Chéo hoá A = P·D·P^(-1) giúp tính A^k dễ vì?', options: ['P = I', 'A^k = P·D^k·P^(-1), chỉ cần nâng phần tử chéo lên k', 'D = A', 'A^k = k·A'], correctIndex: 1, explanation: 'D chéo nên D^k tính từng phần tử; luỹ thừa ma trận trở nên đơn giản.' },
]);

const c8 = doc('maa102-8-1-orthogonality-svd', '8.1 — Orthogonality, least squares, SVD & applications|||8.1 — Trực giao, bình phương tối thiểu, SVD & ứng dụng',
  'Tích vô hướng & trực giao; chiếu & bình phương tối thiểu (A^T A x = A^T b); SVD A=U·S·V^T & ứng dụng nén ảnh/ML/robotics.',
  [[
    `<span class="eyebrow">MAA102 · Chapter 8 · Lesson 8.1</span>
<h2>Orthogonality, least squares, SVD &amp; applications</h2>
<h3>Dot product &amp; orthogonality</h3>
<p>The <strong>dot product</strong> <code>u · v = u1 v1 + u2 v2 + ...</code> measures alignment; two vectors are <strong>orthogonal</strong> (perpendicular) when their dot product is 0. An <strong>orthonormal</strong> set is orthogonal AND unit length — the cleanest possible basis.</p>
<h3>Least squares — the best fit</h3>
<p>When <code>A x = b</code> has NO exact solution (more equations than unknowns, e.g. fitting a line to noisy data), we find the x that minimizes the error. Projecting b onto the column space gives the <strong>normal equations</strong>:</p>
<pre><code>A^T A x = A^T b     ->   x = (A^T A)^-1 A^T b
</code></pre>
<p>This is linear regression — the workhorse of statistics and machine learning.</p>
<h3>Singular Value Decomposition (SVD)</h3>
<p>Every matrix — any shape — factors as:</p>
<pre><code>A = U S V^T
  U, V : orthogonal (rotations)
  S    : diagonal, the singular values s1 >= s2 >= ... >= 0
</code></pre>
<p>The singular values rank the matrix's "importance directions". Keep the top k and you get the <strong>best low-rank approximation</strong> — the core idea of image compression, noise removal, recommender systems and PCA.</p>
<pre><code>import numpy as np
A = np.array([[3,0],[0,1],[0,0]])
U, S, Vt = np.linalg.svd(A)     # S -> [3., 1.]
# least squares:
x, *_ = np.linalg.lstsq(A, b, rcond=None)
</code></pre>
<h3>Where it all lands</h3>
<ul>
<li><strong>Graphics</strong> — orthogonal matrices are rotations; SVD decomposes any transform into rotate–scale–rotate.</li>
<li><strong>Machine learning</strong> — least squares = regression; SVD/PCA = dimensionality reduction.</li>
<li><strong>Robotics</strong> — SVD gives the pseudo-inverse for inverse kinematics and solving over/under-determined pose systems.</li>
</ul>
<div class="callout"><span class="badge">Capstone</span> SVD is often called "the most important matrix factorization" — it unifies rank, least squares, compression and PCA in one decomposition.</div>`,
    `<span class="eyebrow">MAA102 · Chương 8 · Bài 8.1</span>
<h2>Trực giao, bình phương tối thiểu, SVD &amp; ứng dụng</h2>
<h3>Tích vô hướng &amp; trực giao</h3>
<p><strong>Tích vô hướng</strong> <code>u · v = u1 v1 + u2 v2 + ...</code> đo mức thẳng hàng; hai vector <strong>trực giao</strong> (vuông góc) khi tích vô hướng bằng 0. Một bộ <strong>trực chuẩn</strong> vừa trực giao VỪA có độ dài đơn vị — cơ sở sạch nhất có thể.</p>
<h3>Bình phương tối thiểu — khớp tốt nhất</h3>
<p>Khi <code>A x = b</code> KHÔNG có nghiệm chính xác (nhiều phương trình hơn ẩn, vd khớp đường thẳng vào dữ liệu nhiễu), ta tìm x làm nhỏ nhất sai số. Chiếu b lên không gian cột cho <strong>phương trình chuẩn tắc</strong>:</p>
<pre><code>A^T A x = A^T b     ->   x = (A^T A)^-1 A^T b
</code></pre>
<p>Đây chính là hồi quy tuyến tính — công cụ chủ lực của thống kê và học máy.</p>
<h3>Phân tích giá trị kỳ dị (SVD)</h3>
<p>Mọi ma trận — kích thước bất kỳ — đều phân tích được thành:</p>
<pre><code>A = U S V^T
  U, V : trực giao (các phép xoay)
  S    : chéo, các trị kỳ dị s1 >= s2 >= ... >= 0
</code></pre>
<p>Các trị kỳ dị xếp hạng "các hướng quan trọng" của ma trận. Giữ k trị lớn nhất là được <strong>xấp xỉ hạng thấp tốt nhất</strong> — ý tưởng cốt lõi của nén ảnh, khử nhiễu, hệ gợi ý và PCA.</p>
<pre><code>import numpy as np
A = np.array([[3,0],[0,1],[0,0]])
U, S, Vt = np.linalg.svd(A)     # S -> [3., 1.]
# bình phương tối thiểu:
x, *_ = np.linalg.lstsq(A, b, rcond=None)
</code></pre>
<h3>Tất cả đổ về đâu</h3>
<ul>
<li><strong>Đồ hoạ</strong> — ma trận trực giao là phép xoay; SVD tách mọi phép biến đổi thành xoay–co dãn–xoay.</li>
<li><strong>Học máy</strong> — bình phương tối thiểu = hồi quy; SVD/PCA = giảm chiều.</li>
<li><strong>Robotics</strong> — SVD cho giả nghịch đảo dùng trong động học ngược và giải hệ tư thế thừa/thiếu định.</li>
</ul>
<div class="callout"><span class="badge">Chương tổng kết</span> SVD thường được gọi là "phân tích ma trận quan trọng nhất" — nó hợp nhất hạng, bình phương tối thiểu, nén và PCA trong một phân tích.</div>`,
  ]]);

const c8q = quiz('maa102-quiz-8', 'Quiz 8 — Orthogonality & SVD|||Quiz 8 — Trực giao & SVD', [
  { id: 'q1', question: 'Hai vector trực giao (vuông góc) khi nào?', options: ['Cùng độ dài', 'Tích vô hướng u·v = 0', 'Cùng hướng', 'Tổng bằng vector không'], correctIndex: 1, explanation: 'Trực giao ⇔ tích vô hướng bằng 0.' },
  { id: 'q2', question: 'Phương trình chuẩn tắc của bài toán bình phương tối thiểu là?', options: ['A·x = b', 'A^T·A·x = A^T·b', 'det(A) = 0', 'A·x = lambda·x'], correctIndex: 1, explanation: 'Chiếu b lên không gian cột ⇒ A^T A x = A^T b (khi Ax=b vô nghiệm chính xác).' },
  { id: 'q3', question: 'Trong SVD A = U·S·V^T, giữ k trị kỳ dị lớn nhất cho ta?', options: ['Định thức của A', 'Xấp xỉ hạng thấp tốt nhất (nén/khử nhiễu)', 'Ma trận nghịch đảo', 'Các trị riêng của A'], correctIndex: 1, explanation: 'Giữ top-k trị kỳ dị = xấp xỉ hạng thấp tốt nhất; nền của nén ảnh, PCA.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'MAA102',
    slug: 'maa102-linear-algebra',
    title: 'Linear Algebra',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MAA102.webp',
    shortDescription: 'Linear algebra for robotics & AI: vectors & vector spaces, linear systems & Gauss elimination, matrices, determinants & inverses, subspaces, basis & rank, linear maps, eigenvalues & diagonalization, orthogonality, least squares & SVD. Bilingual + NumPy examples.|||Đại số tuyến tính cho robotics & AI: vector & không gian, hệ tuyến tính & khử Gauss, ma trận, định thức & nghịch đảo, không gian con, cơ sở & hạng, ánh xạ tuyến tính, trị riêng & chéo hoá, trực giao, bình phương tối thiểu & SVD.',
    description: 'Môn <strong>MAA102 — Linear Algebra</strong> (Đại số tuyến tính, ngành Robotics &amp; AI, kỳ 2) dạy <strong>ngôn ngữ toán của AI và robot</strong>. Từ <strong>vector &amp; không gian vector</strong> → <strong>hệ tuyến tính &amp; khử Gauss</strong> → <strong>ma trận &amp; phép toán</strong> → <strong>định thức &amp; nghịch đảo</strong> → <strong>không gian con, cơ sở, hạng</strong> → <strong>ánh xạ tuyến tính</strong> → <strong>trị riêng &amp; chéo hoá</strong> → <strong>trực giao, bình phương tối thiểu &amp; SVD</strong>. Bám giáo trình Strang (MIT 18.06), Lay, Axler và 3Blue1Brown; song ngữ, có ví dụ NumPy và quiz mỗi chương.',
    whatYouLearn: 'Vector, tổ hợp tuyến tính, span & độc lập tuyến tính; giải Ax=b bằng khử Gauss (REF/RREF, pivot); đại số ma trận (nhân, chuyển vị, đơn vị); định thức & ma trận nghịch đảo; không gian con, cơ sở, hạng & định lý hạng–vô hiệu; ánh xạ tuyến tính & ma trận biểu diễn; trị riêng, vector riêng & chéo hoá A=PDP^(-1); trực giao, bình phương tối thiểu (A^T A x = A^T b), SVD & ứng dụng đồ hoạ/ML/robotics; dựng lại mọi kết quả bằng NumPy.',
    requirements: 'Toán phổ thông (đại số, lượng giác cơ bản). Biết Python cơ bản để chạy ví dụ NumPy là một điểm cộng, nhưng không bắt buộc.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Strang (MIT 18.06), Lay, Axler, 3Blue1Brown, NumPy, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Đại số tuyến tính là gì, hai câu hỏi cốt lõi, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Vector & không gian|||Chapter 1 — Vectors & spaces', description: 'Vector, tổ hợp tuyến tính, span, độc lập tuyến tính.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Hệ & khử Gauss|||Chapter 2 — Systems & elimination', description: 'Ax=b, biến đổi hàng, REF/RREF, pivot, số nghiệm.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Ma trận & phép toán|||Chapter 3 — Matrices & operations', description: 'Nhân ma trận, chuyển vị, đơn vị, ma trận như biến đổi.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Định thức & nghịch đảo|||Chapter 4 — Determinant & inverse', description: 'Định thức, khả nghịch, A^(-1), giải Ax=b.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Không gian con, cơ sở, hạng|||Chapter 5 — Subspaces, basis, rank', description: 'Không gian cột/null, cơ sở, số chiều, hạng.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Ánh xạ tuyến tính|||Chapter 6 — Linear maps', description: 'Ánh xạ tuyến tính ↔ ma trận, xoay/co dãn/chiếu, ghép.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Trị riêng & chéo hoá|||Chapter 7 — Eigenvalues & diagonalization', description: 'Ax=lambda·x, phương trình đặc trưng, A=PDP^(-1).', lessons: [c7, c7q] },
    { title: 'Chương 8 — Trực giao, bình phương tối thiểu & SVD|||Chapter 8 — Orthogonality, least squares & SVD', description: 'Trực giao, hồi quy, SVD, ứng dụng đồ hoạ/ML/robotics.', lessons: [c8, c8q] },
  ],
};
