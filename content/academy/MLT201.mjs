/**
 * MLT201 — Matrices and Linear Transformations (Ma trận & Biến đổi tuyến tính /
 * Đại số tuyến tính). Ngành Khoa học Máy tính FPTU. KHUNG chất lượng — 8 chương.
 * Sách chuẩn: Gilbert Strang "Introduction to Linear Algebra" + MIT 18.06;
 * David Lay "Linear Algebra and Its Applications"; 3Blue1Brown; Khan Academy.
 * Song ngữ + công thức/ma trận + ví dụ giải + khối pre. Giữ NGUYÊN
 * slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "&"→&amp; trong content.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('mlt201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Strang, Lay), khoá miễn phí (MIT 18.06, Khan Academy), 3Blue1Brown, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">MLT201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>linear algebra</strong> — linear systems, matrices, determinants, vector spaces, linear transformations, eigenvalues, orthogonality and applications — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for MLT201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://math.mit.edu/~gs/linearalgebra/" target="_blank" rel="noopener">Gilbert Strang — <em>Introduction to Linear Algebra</em></a> (the standard, paired with MIT 18.06)</li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/linear-algebra-and-its-applications/P200000006194" target="_blank" rel="noopener">David C. Lay — <em>Linear Algebra and Its Applications</em></a></li>
</ul>
<h3>🌐 Official / free courses</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/" target="_blank" rel="noopener">MIT OCW 18.06 — full video lectures by Strang</a></li>
<li><a href="https://www.khanacademy.org/math/linear-algebra" target="_blank" rel="noopener">Khan Academy — Linear Algebra</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab" target="_blank" rel="noopener">3Blue1Brown — Essence of Linear Algebra</a> (build the geometric intuition first)</li>
<li><a href="https://www.youtube.com/@mitocw" target="_blank" rel="noopener">MIT OpenCourseWare</a> — the 18.06 lecture series</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://numpy.org/doc/stable/reference/routines.linalg.html" target="_blank" rel="noopener">NumPy linalg</a> — solve, inv, det, eig, svd in Python</li>
<li><a href="https://www.wolframalpha.com/" target="_blank" rel="noopener">WolframAlpha</a> — row-reduce, eigenvalues, check your work</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Intuition</strong> — watch 3Blue1Brown to see vectors, matrices and transformations geometrically before the algebra.</li>
<li><strong>Foundation / exam core</strong> — Gauss elimination, matrix operations, inverses, determinants; drill until row reduction is automatic.</li>
<li><strong>Go deeper</strong> — vector spaces, linear transformations, eigenvalues &amp; diagonalization, orthogonality &amp; least squares.</li>
<li><strong>Job-ready</strong> — SVD, PCA and how linear algebra powers graphics, data science and machine learning; reproduce results in NumPy.</li>
</ol></div>`,
    `<span class="eyebrow">MLT201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>đại số tuyến tính</strong> — hệ tuyến tính, ma trận, định thức, không gian vector, biến đổi tuyến tính, trị riêng, trực giao và ứng dụng — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của MLT201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://math.mit.edu/~gs/linearalgebra/" target="_blank" rel="noopener">Gilbert Strang — <em>Introduction to Linear Algebra</em></a> (sách chuẩn, đi kèm MIT 18.06)</li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/linear-algebra-and-its-applications/P200000006194" target="_blank" rel="noopener">David C. Lay — <em>Linear Algebra and Its Applications</em></a></li>
</ul>
<h3>🌐 Khoá học chính thức / miễn phí</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/" target="_blank" rel="noopener">MIT OCW 18.06 — trọn bộ video của Strang</a></li>
<li><a href="https://www.khanacademy.org/math/linear-algebra" target="_blank" rel="noopener">Khan Academy — Linear Algebra</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab" target="_blank" rel="noopener">3Blue1Brown — Essence of Linear Algebra</a> (xây trực giác hình học trước)</li>
<li><a href="https://www.youtube.com/@mitocw" target="_blank" rel="noopener">MIT OpenCourseWare</a> — bộ bài giảng 18.06</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://numpy.org/doc/stable/reference/routines.linalg.html" target="_blank" rel="noopener">NumPy linalg</a> — solve, inv, det, eig, svd trong Python</li>
<li><a href="https://www.wolframalpha.com/" target="_blank" rel="noopener">WolframAlpha</a> — khử hàng, trị riêng, kiểm lại bài</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Trực giác</strong> — xem 3Blue1Brown để thấy vector, ma trận và biến đổi bằng hình học trước khi vào đại số.</li>
<li><strong>Nền / lõi thi</strong> — khử Gauss, phép toán ma trận, nghịch đảo, định thức; luyện đến khi khử hàng thành phản xạ.</li>
<li><strong>Đào sâu</strong> — không gian vector, biến đổi tuyến tính, trị riêng &amp; chéo hoá, trực giao &amp; bình phương tối thiểu.</li>
<li><strong>Sẵn sàng đi làm</strong> — SVD, PCA và cách đại số tuyến tính vận hành đồ hoạ, khoa học dữ liệu, học máy; dựng lại kết quả bằng NumPy.</li>
</ol></div>`,
  ]]);

const intro = doc('mlt201-0-1-overview', 'Course overview: Matrices & linear transformations|||Tổng quan: Ma trận & biến đổi tuyến tính',
  'Đại số tuyến tính làm gì; hai cách đọc một hệ Ax = b (hàng và cột); vì sao ma trận là ngôn ngữ của biến đổi; lộ trình 8 chương từ hệ tuyến tính đến SVD/PCA.',
  [[
    `<span class="eyebrow">MLT201 · Lesson 0.1 · Overview</span>
<h2>Matrices &amp; linear transformations</h2>
<p class="lead">Linear algebra is the mathematics of <strong>vectors, matrices and linear transformations</strong> — the engine behind computer graphics, machine learning, data compression, search engines and scientific computing. This course teaches you to <strong>compute</strong> with matrices and to <strong>see</strong> what they do to space.</p>
<h3>One equation, two views</h3>
<p>The central object is a linear system written compactly as <strong>Ax = b</strong>. Read it two ways:</p>
<ul>
<li><strong>Row view</strong> — each row is one equation; the solution is where the lines/planes intersect.</li>
<li><strong>Column view</strong> — Ax is a <em>combination of the columns of A</em>; solving means finding the mix that reaches b.</li>
</ul>
<p>The column view is what makes matrices the natural language of <strong>linear transformations</strong>: a matrix takes a vector in and returns a transformed vector out.</p>
<h3>Roadmap (8 chapters)</h3>
<pre><code>1. Linear systems  -> Gauss elimination, echelon form
2. Matrices        -> add / multiply / transpose / inverse
3. Determinants    -> volume, invertibility, Cramer
4. Vector spaces   -> independence, basis, dimension
5. Transformations -> matrix of a map, kernel / image, rank
6. Eigenvalues     -> eigenvectors, diagonalization
7. Orthogonality   -> Gram-Schmidt, projection, least squares
8. Applications    -> SVD, PCA, graphics &amp; ML
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Almost every large-scale computation — rendering a 3D scene, training a model, ranking web pages — reduces to operations on matrices. Master this and you hold a key that unlocks most of applied computing.</div>`,
    `<span class="eyebrow">MLT201 · Bài 0.1 · Tổng quan</span>
<h2>Ma trận &amp; biến đổi tuyến tính</h2>
<p class="lead">Đại số tuyến tính là toán học của <strong>vector, ma trận và biến đổi tuyến tính</strong> — động cơ sau đồ hoạ máy tính, học máy, nén dữ liệu, công cụ tìm kiếm và tính toán khoa học. Môn này dạy bạn vừa <strong>tính</strong> với ma trận vừa <strong>nhìn thấy</strong> ma trận làm gì với không gian.</p>
<h3>Một phương trình, hai cách đọc</h3>
<p>Đối tượng trung tâm là hệ tuyến tính viết gọn thành <strong>Ax = b</strong>. Đọc theo hai cách:</p>
<ul>
<li><strong>Cách hàng</strong> — mỗi hàng là một phương trình; nghiệm là chỗ các đường/mặt phẳng cắt nhau.</li>
<li><strong>Cách cột</strong> — Ax là <em>tổ hợp các cột của A</em>; giải nghĩa là tìm cách pha để chạm tới b.</li>
</ul>
<p>Cách cột chính là điều khiến ma trận trở thành ngôn ngữ tự nhiên của <strong>biến đổi tuyến tính</strong>: ma trận nhận một vector vào và trả ra một vector đã biến đổi.</p>
<h3>Lộ trình (8 chương)</h3>
<pre><code>1. He tuyen tinh    -> khu Gauss, dang bac thang
2. Ma tran          -> cong / nhan / chuyen vi / nghich dao
3. Dinh thuc        -> the tich, kha nghich, Cramer
4. Khong gian vector-> doc lap, co so, chieu
5. Bien doi         -> ma tran cua anh xa, kernel / image, rank
6. Tri rieng        -> vector rieng, cheo hoa
7. Truc giao        -> Gram-Schmidt, chieu, binh phuong toi thieu
8. Ung dung         -> SVD, PCA, do hoa &amp; ML
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Gần như mọi tính toán quy mô lớn — dựng cảnh 3D, huấn luyện mô hình, xếp hạng trang web — đều rút về phép toán trên ma trận. Nắm chắc phần này là cầm chìa mở phần lớn ngành tính toán ứng dụng.</div>`,
  ]]);

const c1 = doc('mlt201-1-1-linear-systems', '1.1 — Linear systems & Gauss elimination|||1.1 — Hệ phương trình tuyến tính & khử Gauss',
  'Hệ tuyến tính, ma trận bổ sung, ba phép biến đổi hàng, dạng bậc thang (REF) & bậc thang rút gọn (RREF), pivot; ba loại nghiệm: duy nhất, vô số, vô nghiệm.',
  [[
    `<span class="eyebrow">MLT201 · Chapter 1 · Lesson 1.1</span>
<h2>Linear systems &amp; Gauss elimination</h2>
<h3>The augmented matrix</h3>
<p>A system of linear equations becomes a matrix. Write the coefficients as A and stack b on the right to get the <strong>augmented matrix [A | b]</strong>. Solving the system means simplifying this matrix with <strong>row operations</strong>.</p>
<h3>Three elementary row operations</h3>
<ul>
<li><strong>Swap</strong> two rows.</li>
<li><strong>Scale</strong> a row by a nonzero number.</li>
<li><strong>Add</strong> a multiple of one row to another.</li>
</ul>
<p>None of them changes the solution set. Apply them to reach <strong>row echelon form (REF)</strong> — a staircase of leading entries called <strong>pivots</strong> — then continue to <strong>reduced row echelon form (RREF)</strong> where each pivot is 1 and alone in its column.</p>
<pre><code>Solve:  x + 2y =  5
       3x + 4y = 11

[ 1  2 |  5 ]   R2 <- R2 - 3R1   [ 1  2 |  5 ]
[ 3  4 | 11 ] ----------------->  [ 0 -2 | -4 ]

R2 <- R2 / (-2):  [ 1  2 | 5 ]     back-substitute:
                  [ 0  1 | 2 ]     y = 2, x = 5 - 2y = 1
Solution: (x, y) = (1, 2)
</code></pre>
<h3>Three possible outcomes</h3>
<ul>
<li><strong>Unique solution</strong> — a pivot in every variable column.</li>
<li><strong>Infinitely many</strong> — at least one <em>free</em> variable (a column with no pivot).</li>
<li><strong>No solution</strong> — a row like [0 0 | 5], i.e. 0 = 5, a contradiction.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> Gauss elimination is just organized substitution. Every later topic — inverses, determinants, rank — is elimination in disguise.</div>`,
    `<span class="eyebrow">MLT201 · Chương 1 · Bài 1.1</span>
<h2>Hệ tuyến tính &amp; khử Gauss</h2>
<h3>Ma trận bổ sung</h3>
<p>Một hệ phương trình tuyến tính chuyển thành ma trận. Viết các hệ số thành A và ghép b bên phải để được <strong>ma trận bổ sung [A | b]</strong>. Giải hệ là làm gọn ma trận này bằng <strong>phép biến đổi hàng</strong>.</p>
<h3>Ba phép biến đổi hàng sơ cấp</h3>
<ul>
<li><strong>Đổi chỗ</strong> hai hàng.</li>
<li><strong>Nhân</strong> một hàng với một số khác 0.</li>
<li><strong>Cộng</strong> một bội của hàng này vào hàng khác.</li>
</ul>
<p>Không phép nào làm đổi tập nghiệm. Áp dụng để đưa về <strong>dạng bậc thang (REF)</strong> — một cầu thang các phần tử dẫn đầu gọi là <strong>pivot</strong> — rồi tiếp tục tới <strong>dạng bậc thang rút gọn (RREF)</strong> nơi mỗi pivot bằng 1 và đứng một mình trong cột.</p>
<pre><code>Giai:  x + 2y =  5
      3x + 4y = 11

[ 1  2 |  5 ]   R2 <- R2 - 3R1   [ 1  2 |  5 ]
[ 3  4 | 11 ] ----------------->  [ 0 -2 | -4 ]

R2 <- R2 / (-2):  [ 1  2 | 5 ]     the nguoc:
                  [ 0  1 | 2 ]     y = 2, x = 5 - 2y = 1
Nghiem: (x, y) = (1, 2)
</code></pre>
<h3>Ba khả năng nghiệm</h3>
<ul>
<li><strong>Nghiệm duy nhất</strong> — mỗi cột biến đều có pivot.</li>
<li><strong>Vô số nghiệm</strong> — có ít nhất một biến <em>tự do</em> (cột không có pivot).</li>
<li><strong>Vô nghiệm</strong> — xuất hiện hàng dạng [0 0 | 5], tức 0 = 5, mâu thuẫn.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> Khử Gauss chỉ là phép thế có tổ chức. Mọi chủ đề sau — nghịch đảo, định thức, hạng — đều là khử Gauss trá hình.</div>`,
  ]]);

const c1q = quiz('mlt201-quiz-1', 'Quiz 1 — Linear systems|||Quiz 1 — Hệ tuyến tính', [
  { id: 'q1', question: 'Phép biến đổi hàng nào KHÔNG được phép (làm đổi tập nghiệm)?|||Phép biến đổi hàng nào KHÔNG được phép (làm đổi tập nghiệm)?', options: ['Đổi chỗ hai hàng|||Đổi chỗ hai hàng', 'Nhân một hàng với số 0|||Nhân một hàng với số 0', 'Cộng bội của hàng này vào hàng khác|||Cộng bội của hàng này vào hàng khác', 'Nhân một hàng với 2|||Nhân một hàng với 2'], correctIndex: 1, explanation: 'Nhân với 0 xoá phương trình, làm mất thông tin và đổi tập nghiệm; chỉ được nhân với số KHÁC 0.' },
  { id: 'q2', question: 'Xuất hiện hàng [0 0 0 | 5] trong RREF nghĩa là hệ?|||Xuất hiện hàng [0 0 0 | 5] trong RREF nghĩa là hệ?', options: ['Có nghiệm duy nhất|||Có nghiệm duy nhất', 'Vô số nghiệm|||Vô số nghiệm', 'Vô nghiệm|||Vô nghiệm', 'Có nghiệm bằng 0|||Có nghiệm bằng 0'], correctIndex: 2, explanation: 'Hàng đó tương ứng 0 = 5, mâu thuẫn, nên hệ vô nghiệm.' },
  { id: 'q3', question: 'Hệ có nghiệm duy nhất khi nào?|||Hệ có nghiệm duy nhất khi nào?', options: ['Có biến tự do|||Có biến tự do', 'Mỗi cột biến đều có pivot|||Mỗi cột biến đều có pivot', 'Có hàng toàn số 0|||Có hàng toàn số 0', 'Số phương trình lớn hơn số ẩn|||Số phương trình lớn hơn số ẩn'], correctIndex: 1, explanation: 'Không có biến tự do (mọi cột biến có pivot) và không mâu thuẫn thì nghiệm là duy nhất.' },
]);

const c2 = doc('mlt201-2-1-matrix-operations', '2.1 — Matrix operations & the inverse|||2.1 — Phép toán ma trận & nghịch đảo',
  'Cộng, nhân vô hướng, nhân ma trận (hàng nhân cột, không giao hoán), chuyển vị; ma trận đơn vị; ma trận nghịch đảo A⁻¹, công thức 2×2, tìm nghịch đảo bằng Gauss-Jordan.',
  [[
    `<span class="eyebrow">MLT201 · Chapter 2 · Lesson 2.1</span>
<h2>Matrix operations &amp; the inverse</h2>
<h3>Add, scale, multiply</h3>
<ul>
<li><strong>Addition</strong> and <strong>scalar multiplication</strong> are entry-by-entry (matrices must match in size to add).</li>
<li><strong>Matrix multiplication</strong> is row-times-column: entry (i, j) of AB is the dot product of row i of A with column j of B. To multiply A (m by n) and B, B must have n rows.</li>
</ul>
<p><strong>Warning:</strong> multiplication is generally <em>not commutative</em> — AB is usually not BA. It IS associative: (AB)C = A(BC).</p>
<pre><code>A = [ 1  2 ]   B = [ 5  6 ]
    [ 3  4 ]       [ 7  8 ]

AB = [ 1*5+2*7  1*6+2*8 ] = [ 19  22 ]
     [ 3*5+4*7  3*6+4*8 ]   [ 43  50 ]
</code></pre>
<h3>Transpose &amp; identity</h3>
<p>The <strong>transpose</strong> A^T flips rows and columns; (AB)^T = B^T A^T. The <strong>identity</strong> I has 1s on the diagonal and acts like the number 1: AI = IA = A.</p>
<h3>The inverse</h3>
<p>A^-1 is the matrix with A·A^-1 = I. For a 2 by 2 matrix:</p>
<pre><code>A = [ a  b ]     A^-1 = 1/(ad - bc) [  d  -b ]
    [ c  d ]                        [ -c   a ]

Example: A = [ 4  7 ],  det = 4*6 - 7*2 = 10
             [ 2  6 ]
A^-1 = 1/10 [  6  -7 ] = [  0.6  -0.7 ]
            [ -2   4 ]   [ -0.2   0.4 ]
</code></pre>
<p>If ad - bc = 0 the inverse does not exist. For larger matrices, augment [A | I] and row-reduce to [I | A^-1] (Gauss-Jordan).</p>
<div class="callout"><span class="badge">Why inverses matter</span> If A is invertible, Ax = b has the single solution x = A^-1 b. In practice we solve by elimination, not by forming A^-1 — but the concept anchors the whole theory.</div>`,
    `<span class="eyebrow">MLT201 · Chương 2 · Bài 2.1</span>
<h2>Phép toán ma trận &amp; nghịch đảo</h2>
<h3>Cộng, nhân vô hướng, nhân</h3>
<ul>
<li><strong>Phép cộng</strong> và <strong>nhân vô hướng</strong> làm theo từng phần tử (muốn cộng thì hai ma trận phải cùng cỡ).</li>
<li><strong>Nhân ma trận</strong> là hàng nhân cột: phần tử (i, j) của AB là tích vô hướng của hàng i của A với cột j của B. Muốn nhân A (m nhân n) với B thì B phải có n hàng.</li>
</ul>
<p><strong>Lưu ý:</strong> phép nhân nói chung <em>không giao hoán</em> — AB thường khác BA. Nhưng có kết hợp: (AB)C = A(BC).</p>
<pre><code>A = [ 1  2 ]   B = [ 5  6 ]
    [ 3  4 ]       [ 7  8 ]

AB = [ 1*5+2*7  1*6+2*8 ] = [ 19  22 ]
     [ 3*5+4*7  3*6+4*8 ]   [ 43  50 ]
</code></pre>
<h3>Chuyển vị &amp; ma trận đơn vị</h3>
<p><strong>Chuyển vị</strong> A^T đổi hàng thành cột; (AB)^T = B^T A^T. <strong>Ma trận đơn vị</strong> I có số 1 trên đường chéo và đóng vai như số 1: AI = IA = A.</p>
<h3>Ma trận nghịch đảo</h3>
<p>A^-1 là ma trận sao cho A·A^-1 = I. Với ma trận 2 nhân 2:</p>
<pre><code>A = [ a  b ]     A^-1 = 1/(ad - bc) [  d  -b ]
    [ c  d ]                        [ -c   a ]

Vi du: A = [ 4  7 ],  det = 4*6 - 7*2 = 10
           [ 2  6 ]
A^-1 = 1/10 [  6  -7 ] = [  0.6  -0.7 ]
            [ -2   4 ]   [ -0.2   0.4 ]
</code></pre>
<p>Nếu ad - bc = 0 thì không có nghịch đảo. Với ma trận lớn hơn, ghép [A | I] rồi khử về [I | A^-1] (Gauss-Jordan).</p>
<div class="callout"><span class="badge">Vì sao cần nghịch đảo</span> Nếu A khả nghịch, Ax = b có đúng một nghiệm x = A^-1 b. Thực tế ta giải bằng khử Gauss chứ ít khi lập A^-1 — nhưng khái niệm này neo giữ toàn bộ lý thuyết.</div>`,
  ]]);

const c2q = quiz('mlt201-quiz-2', 'Quiz 2 — Matrix operations|||Quiz 2 — Phép toán ma trận', [
  { id: 'q1', question: 'Phát biểu nào ĐÚNG về nhân ma trận?|||Phát biểu nào ĐÚNG về nhân ma trận?', options: ['Luôn giao hoán: AB = BA|||Luôn giao hoán: AB = BA', 'Không giao hoán nói chung, nhưng có kết hợp|||Không giao hoán nói chung, nhưng có kết hợp', 'Làm theo từng phần tử như phép cộng|||Làm theo từng phần tử như phép cộng', 'Chỉ nhân được ma trận vuông|||Chỉ nhân được ma trận vuông'], correctIndex: 1, explanation: 'AB thường khác BA; nhưng (AB)C = A(BC). Nhân là hàng-nhân-cột, không phải theo từng phần tử.' },
  { id: 'q2', question: 'Ma trận 2×2 khả nghịch khi nào?|||Ma trận 2×2 khả nghịch khi nào?', options: ['ad - bc = 0|||ad - bc = 0', 'ad - bc khác 0|||ad - bc khác 0', 'a = d|||a = d', 'Mọi ma trận đều khả nghịch|||Mọi ma trận đều khả nghịch'], correctIndex: 1, explanation: 'Định thức ad - bc phải khác 0; nếu bằng 0 thì công thức nghịch đảo chia cho 0, không tồn tại.' },
  { id: 'q3', question: 'Để tìm nghịch đảo bằng Gauss-Jordan, ta khử ma trận nào?|||Để tìm nghịch đảo bằng Gauss-Jordan, ta khử ma trận nào?', options: ['[A | b] về [I | x]|||[A | b] về [I | x]', '[A | I] về [I | A⁻¹]|||[A | I] về [I | A⁻¹]', 'Chỉ riêng A về I|||Chỉ riêng A về I', 'A^T về A|||A^T về A'], correctIndex: 1, explanation: 'Ghép đơn vị I bên phải, khử A thành I thì phần bên phải trở thành A⁻¹.' },
]);

const c3 = doc('mlt201-3-1-determinants', '3.1 — Determinants & Cramer|||3.1 — Định thức & quy tắc Cramer',
  'Định thức 2×2 và 3×3, khai triển theo hàng/cột; ý nghĩa diện tích/thể tích; tính chất (det(AB)=det A·det B, det khác 0 ⇔ khả nghịch); quy tắc Cramer.',
  [[
    `<span class="eyebrow">MLT201 · Chapter 3 · Lesson 3.1</span>
<h2>Determinants &amp; Cramer</h2>
<h3>What a determinant measures</h3>
<p>The <strong>determinant</strong> det(A) is a single number attached to a square matrix. Geometrically it is the <em>scaling factor of area (2D) or volume (3D)</em> under the transformation A. If det(A) = 0, the transformation squashes space flat — the matrix is <strong>not invertible</strong>.</p>
<pre><code>2x2:  det [ a  b ] = ad - bc
          [ c  d ]

3x3 (cofactor along the top row):
det [ a b c ]
    [ d e f ] = a(ei - fh) - b(di - fg) + c(dh - eg)
    [ g h i ]
</code></pre>
<h3>Key properties</h3>
<ul>
<li>det(I) = 1; swapping two rows flips the sign.</li>
<li>det(AB) = det(A)·det(B).</li>
<li>det(A^T) = det(A).</li>
<li><strong>A is invertible if and only if det(A) is not 0.</strong></li>
</ul>
<h3>Cramer's rule</h3>
<p>For Ax = b with det(A) not 0, each unknown is a ratio of determinants: replace column i of A with b to get A_i, then x_i = det(A_i) / det(A).</p>
<pre><code>Solve  x +  y = 3
       x + 2y = 5
det A = |1 1; 1 2| = 1
x = |3 1; 5 2| / 1 = (6 - 5) = 1
y = |1 3; 1 5| / 1 = (5 - 3) = 2
</code></pre>
<div class="callout"><span class="badge">Practical note</span> Cramer's rule is elegant but slow for big systems — elimination is far faster. Use the determinant mainly as an invertibility test and a volume gauge.</div>`,
    `<span class="eyebrow">MLT201 · Chương 3 · Bài 3.1</span>
<h2>Định thức &amp; quy tắc Cramer</h2>
<h3>Định thức đo cái gì</h3>
<p><strong>Định thức</strong> det(A) là một con số gắn với ma trận vuông. Về hình học, nó là <em>hệ số co giãn diện tích (2D) hay thể tích (3D)</em> dưới biến đổi A. Nếu det(A) = 0, biến đổi ép không gian bẹp lại — ma trận <strong>không khả nghịch</strong>.</p>
<pre><code>2x2:  det [ a  b ] = ad - bc
          [ c  d ]

3x3 (khai trien theo hang tren):
det [ a b c ]
    [ d e f ] = a(ei - fh) - b(di - fg) + c(dh - eg)
    [ g h i ]
</code></pre>
<h3>Tính chất chính</h3>
<ul>
<li>det(I) = 1; đổi chỗ hai hàng làm đổi dấu.</li>
<li>det(AB) = det(A)·det(B).</li>
<li>det(A^T) = det(A).</li>
<li><strong>A khả nghịch khi và chỉ khi det(A) khác 0.</strong></li>
</ul>
<h3>Quy tắc Cramer</h3>
<p>Với Ax = b và det(A) khác 0, mỗi ẩn là một tỉ số định thức: thay cột i của A bằng b để được A_i, rồi x_i = det(A_i) / det(A).</p>
<pre><code>Giai  x +  y = 3
      x + 2y = 5
det A = |1 1; 1 2| = 1
x = |3 1; 5 2| / 1 = (6 - 5) = 1
y = |1 3; 1 5| / 1 = (5 - 3) = 2
</code></pre>
<div class="callout"><span class="badge">Lưu ý thực tế</span> Cramer đẹp nhưng chậm với hệ lớn — khử Gauss nhanh hơn hẳn. Dùng định thức chủ yếu để kiểm khả nghịch và đo thể tích.</div>`,
  ]]);

const c3q = quiz('mlt201-quiz-3', 'Quiz 3 — Determinants|||Quiz 3 — Định thức', [
  { id: 'q1', question: 'det(A) = 0 nghĩa là?|||det(A) = 0 nghĩa là?', options: ['A khả nghịch|||A khả nghịch', 'A KHÔNG khả nghịch|||A KHÔNG khả nghịch', 'A là ma trận đơn vị|||A là ma trận đơn vị', 'A có nghịch đảo bằng 0|||A có nghịch đảo bằng 0'], correctIndex: 1, explanation: 'A khả nghịch khi và chỉ khi det(A) khác 0; det = 0 nghĩa là không khả nghịch (biến đổi ép không gian bẹp).' },
  { id: 'q2', question: 'Định thức của ma trận [[3, 8],[4, 6]] bằng?|||Định thức của ma trận [[3, 8],[4, 6]] bằng?', options: ['-14', '14', '50', '-50'], correctIndex: 0, explanation: 'ad - bc = 3*6 - 8*4 = 18 - 32 = -14.' },
  { id: 'q3', question: 'Tính chất nào ĐÚNG?|||Tính chất nào ĐÚNG?', options: ['det(AB) = det(A) + det(B)|||det(AB) = det(A) + det(B)', 'det(AB) = det(A)·det(B)|||det(AB) = det(A)·det(B)', 'det(A^T) = -det(A)|||det(A^T) = -det(A)', 'det(I) = 0|||det(I) = 0'], correctIndex: 1, explanation: 'Định thức của tích bằng tích các định thức; det(A^T) = det(A) và det(I) = 1.' },
]);

const c4 = doc('mlt201-4-1-vector-spaces', '4.1 — Vector spaces, basis & dimension|||4.1 — Không gian vector, cơ sở & chiều',
  'Không gian vector & không gian con, tổ hợp tuyến tính & span, độc lập/phụ thuộc tuyến tính, cơ sở, chiều; các không gian con của ma trận (cột, hàng, null).',
  [[
    `<span class="eyebrow">MLT201 · Chapter 4 · Lesson 4.1</span>
<h2>Vector spaces, basis &amp; dimension</h2>
<h3>Vector space &amp; subspace</h3>
<p>A <strong>vector space</strong> is a set of vectors closed under addition and scalar multiplication (you never leave the set by adding or scaling). A <strong>subspace</strong> is a subset that is itself a vector space — it must contain the zero vector and be closed under both operations. Lines and planes through the origin in R^3 are subspaces.</p>
<h3>Span, independence, basis</h3>
<ul>
<li><strong>Linear combination</strong> — c1·v1 + c2·v2 + ... The <strong>span</strong> is the set of all such combinations.</li>
<li><strong>Linearly independent</strong> — no vector is a combination of the others; the only way to get the zero vector is all coefficients 0.</li>
<li><strong>Basis</strong> — an independent set that spans the whole space: enough vectors to reach everything, none wasted.</li>
<li><strong>Dimension</strong> — the number of vectors in any basis (it is always the same).</li>
</ul>
<pre><code>Are v1=(1,2), v2=(2,4) independent?
c1(1,2) + c2(2,4) = 0  ->  v2 = 2*v1
They are DEPENDENT: v2 lies on the line through v1.
Basis of R^2 needs 2 independent vectors, e.g. (1,0),(0,1) -> dim = 2
</code></pre>
<h3>The four subspaces of a matrix</h3>
<p>Every matrix A carries a <strong>column space</strong> (span of its columns — where Ax can land), a <strong>row space</strong>, and a <strong>null space</strong> (all x with Ax = 0). Their dimensions are tied together by rank, the theme of the next chapter.</p>
<div class="callout"><span class="badge">Mental model</span> A basis is a minimal set of building blocks and dimension is how many blocks you need. Coordinates are simply the recipe of a vector in a chosen basis.</div>`,
    `<span class="eyebrow">MLT201 · Chương 4 · Bài 4.1</span>
<h2>Không gian vector, cơ sở &amp; chiều</h2>
<h3>Không gian vector &amp; không gian con</h3>
<p>Một <strong>không gian vector</strong> là tập vector đóng với phép cộng và nhân vô hướng (cộng hay nhân vẫn không ra khỏi tập). Một <strong>không gian con</strong> là tập con mà bản thân nó là không gian vector — phải chứa vector 0 và đóng với cả hai phép. Đường thẳng và mặt phẳng qua gốc trong R^3 là các không gian con.</p>
<h3>Span, độc lập, cơ sở</h3>
<ul>
<li><strong>Tổ hợp tuyến tính</strong> — c1·v1 + c2·v2 + ... <strong>Span</strong> là tập mọi tổ hợp như vậy.</li>
<li><strong>Độc lập tuyến tính</strong> — không vector nào là tổ hợp của các vector còn lại; cách duy nhất ra vector 0 là mọi hệ số bằng 0.</li>
<li><strong>Cơ sở</strong> — một tập độc lập mà span cả không gian: đủ vector để chạm mọi nơi, không thừa.</li>
<li><strong>Chiều</strong> — số vector trong một cơ sở bất kỳ (luôn như nhau).</li>
</ul>
<pre><code>v1=(1,2), v2=(2,4) co doc lap khong?
c1(1,2) + c2(2,4) = 0  ->  v2 = 2*v1
PHU THUOC: v2 nam tren duong qua v1.
Co so cua R^2 can 2 vector doc lap, vd (1,0),(0,1) -> dim = 2
</code></pre>
<h3>Bốn không gian con của ma trận</h3>
<p>Mỗi ma trận A mang một <strong>không gian cột</strong> (span các cột — nơi Ax có thể tới), một <strong>không gian hàng</strong>, và một <strong>không gian null</strong> (mọi x với Ax = 0). Chiều của chúng buộc với nhau qua hạng (rank), chủ đề chương sau.</p>
<div class="callout"><span class="badge">Mô hình tư duy</span> Cơ sở là tập khối dựng tối thiểu và chiều là số khối cần dùng. Toạ độ chỉ là công thức pha một vector trong cơ sở đã chọn.</div>`,
  ]]);

const c4q = quiz('mlt201-quiz-4', 'Quiz 4 — Vector spaces|||Quiz 4 — Không gian vector', [
  { id: 'q1', question: 'Một tập vector độc lập tuyến tính khi?|||Một tập vector độc lập tuyến tính khi?', options: ['Có vector là tổ hợp của các vector khác|||Có vector là tổ hợp của các vector khác', 'Cách duy nhất để tổ hợp ra vector 0 là mọi hệ số bằng 0|||Cách duy nhất để tổ hợp ra vector 0 là mọi hệ số bằng 0', 'Chúng cùng nằm trên một đường thẳng|||Chúng cùng nằm trên một đường thẳng', 'Có nhiều vector hơn số chiều|||Có nhiều vector hơn số chiều'], correctIndex: 1, explanation: 'Độc lập tuyến tính: c1v1 + ... = 0 chỉ khi tất cả ci = 0; không vector nào là tổ hợp của phần còn lại.' },
  { id: 'q2', question: 'Cơ sở của một không gian vector là?|||Cơ sở của một không gian vector là?', options: ['Tập vector bất kỳ trong không gian|||Tập vector bất kỳ trong không gian', 'Tập độc lập tuyến tính và span cả không gian|||Tập độc lập tuyến tính và span cả không gian', 'Tập chứa vector 0|||Tập chứa vector 0', 'Tập có nhiều vector nhất có thể|||Tập có nhiều vector nhất có thể'], correctIndex: 1, explanation: 'Cơ sở vừa độc lập vừa span: đủ để dựng mọi vector, không thừa; số phần tử chính là chiều.' },
  { id: 'q3', question: 'Không gian null của A gồm?|||Không gian null của A gồm?', options: ['Mọi x thoả Ax = 0|||Mọi x thoả Ax = 0', 'Span các cột của A|||Span các cột của A', 'Các hàng của A|||Các hàng của A', 'Mọi b thoả Ax = b có nghiệm|||Mọi b thoả Ax = b có nghiệm'], correctIndex: 0, explanation: 'Không gian null (kernel) là tập tất cả nghiệm của Ax = 0.' },
]);

const c5 = doc('mlt201-5-1-linear-transformations', '5.1 — Linear transformations & rank|||5.1 — Biến đổi tuyến tính & hạng',
  'Biến đổi tuyến tính T(x)=Ax, tính chất bảo toàn cộng & nhân; ma trận biểu diễn (ảnh của cơ sở); kernel (null) & image (cột); định lý hạng - số khuyết (rank + nullity = n).',
  [[
    `<span class="eyebrow">MLT201 · Chapter 5 · Lesson 5.1</span>
<h2>Linear transformations &amp; rank</h2>
<h3>What makes a map linear</h3>
<p>A transformation T is <strong>linear</strong> if it preserves the two operations: T(u + v) = T(u) + T(v) and T(c·u) = c·T(u). Every linear map on finite dimensions is <em>multiplication by a matrix</em>: T(x) = Ax. Rotations, scalings, projections and shears are all linear.</p>
<h3>Building the matrix</h3>
<p>To find A, feed the transformation the basis vectors: <strong>the columns of A are the images of e1, e2, ...</strong></p>
<pre><code>Rotation by 90 degrees in the plane:
T(1,0) = (0, 1)     T(0,1) = (-1, 0)
So A = [ 0  -1 ]
       [ 1   0 ]
Check: A(2,1) = (0*2 + (-1)*1, 1*2 + 0*1) = (-1, 2)
</code></pre>
<h3>Kernel, image, rank</h3>
<ul>
<li><strong>Kernel (null space)</strong> — inputs that map to 0.</li>
<li><strong>Image (column space)</strong> — all reachable outputs.</li>
<li><strong>Rank</strong> — dimension of the image = number of pivots = number of independent columns.</li>
</ul>
<p><strong>Rank-nullity theorem:</strong> for A with n columns, rank(A) + nullity(A) = n. What the map keeps (rank) plus what it collapses (nullity) accounts for every input dimension.</p>
<div class="callout"><span class="badge">Big picture</span> A matrix is a verb, not a noun: it does something to space. Rank tells you how many dimensions survive; nullity tells you how many get crushed to zero.</div>`,
    `<span class="eyebrow">MLT201 · Chương 5 · Bài 5.1</span>
<h2>Biến đổi tuyến tính &amp; hạng</h2>
<h3>Điều gì làm một ánh xạ tuyến tính</h3>
<p>Một biến đổi T là <strong>tuyến tính</strong> nếu nó bảo toàn hai phép: T(u + v) = T(u) + T(v) và T(c·u) = c·T(u). Mọi ánh xạ tuyến tính trên chiều hữu hạn đều là <em>phép nhân với một ma trận</em>: T(x) = Ax. Quay, co giãn, chiếu và trượt đều tuyến tính.</p>
<h3>Dựng ma trận</h3>
<p>Để tìm A, cho biến đổi ăn các vector cơ sở: <strong>các cột của A là ảnh của e1, e2, ...</strong></p>
<pre><code>Quay 90 do trong mat phang:
T(1,0) = (0, 1)     T(0,1) = (-1, 0)
Vay A = [ 0  -1 ]
        [ 1   0 ]
Kiem: A(2,1) = (0*2 + (-1)*1, 1*2 + 0*1) = (-1, 2)
</code></pre>
<h3>Kernel, image, hạng</h3>
<ul>
<li><strong>Kernel (không gian null)</strong> — các đầu vào ánh xạ về 0.</li>
<li><strong>Image (không gian cột)</strong> — mọi đầu ra có thể chạm tới.</li>
<li><strong>Hạng (rank)</strong> — chiều của image = số pivot = số cột độc lập.</li>
</ul>
<p><strong>Định lý hạng - số khuyết:</strong> với A có n cột, rank(A) + nullity(A) = n. Cái ánh xạ giữ lại (hạng) cộng cái nó ép về 0 (số khuyết) đủ đúng mọi chiều đầu vào.</p>
<div class="callout"><span class="badge">Bức tranh lớn</span> Ma trận là động từ, không phải danh từ: nó làm gì đó với không gian. Hạng cho biết bao nhiêu chiều sống sót; số khuyết cho biết bao nhiêu chiều bị ép về 0.</div>`,
  ]]);

const c5q = quiz('mlt201-quiz-5', 'Quiz 5 — Linear transformations|||Quiz 5 — Biến đổi tuyến tính', [
  { id: 'q1', question: 'Các cột của ma trận biểu diễn một biến đổi tuyến tính là?|||Các cột của ma trận biểu diễn một biến đổi tuyến tính là?', options: ['Ảnh của các vector cơ sở (e1, e2, ...)|||Ảnh của các vector cơ sở (e1, e2, ...)', 'Các vector 0|||Các vector 0', 'Các trị riêng|||Các trị riêng', 'Nghiệm của Ax = 0|||Nghiệm của Ax = 0'], correctIndex: 0, explanation: 'Cột thứ j của A chính là T(ej); dựng ma trận bằng cách áp biến đổi lên từng vector cơ sở.' },
  { id: 'q2', question: 'Định lý hạng - số khuyết phát biểu (A có n cột)?|||Định lý hạng - số khuyết phát biểu (A có n cột)?', options: ['rank(A) - nullity(A) = n|||rank(A) - nullity(A) = n', 'rank(A) + nullity(A) = n|||rank(A) + nullity(A) = n', 'rank(A) · nullity(A) = n|||rank(A) · nullity(A) = n', 'rank(A) = nullity(A)|||rank(A) = nullity(A)'], correctIndex: 1, explanation: 'rank + nullity = số cột n: chiều ảnh cộng chiều nhân đúng bằng chiều đầu vào.' },
  { id: 'q3', question: 'Kernel (không gian null) của biến đổi T(x) = Ax là?|||Kernel (không gian null) của biến đổi T(x) = Ax là?', options: ['Mọi đầu ra có thể chạm tới|||Mọi đầu ra có thể chạm tới', 'Các đầu vào ánh xạ về vector 0|||Các đầu vào ánh xạ về vector 0', 'Các cột độc lập của A|||Các cột độc lập của A', 'Số pivot của A|||Số pivot của A'], correctIndex: 1, explanation: 'Kernel gồm mọi x với T(x) = Ax = 0; chiều của nó là nullity.' },
]);

const c6 = doc('mlt201-6-1-eigenvalues', '6.1 — Eigenvalues, eigenvectors & diagonalization|||6.1 — Trị riêng, vector riêng & chéo hoá',
  'Trị riêng & vector riêng (Av = λv), phương trình đặc trưng det(A - λI) = 0; ý nghĩa hướng bất biến; chéo hoá A = PDP⁻¹ và luỹ thừa ma trận A^k.',
  [[
    `<span class="eyebrow">MLT201 · Chapter 6 · Lesson 6.1</span>
<h2>Eigenvalues, eigenvectors &amp; diagonalization</h2>
<h3>Directions the matrix does not turn</h3>
<p>An <strong>eigenvector</strong> v of A is a nonzero vector whose direction is unchanged by A — it is only stretched: <strong>Av = λv</strong>. The scalar λ is the matching <strong>eigenvalue</strong> (the stretch factor). These special directions reveal what a matrix truly does.</p>
<h3>Finding them</h3>
<p>Av = λv means (A - λI)v = 0 has a nonzero solution, so A - λI must be singular:</p>
<pre><code>Characteristic equation:  det(A - λI) = 0

A = [ 2  1 ]   det [ 2-L   1  ] = (2-L)^2 - 1 = 0
    [ 1  2 ]       [  1   2-L ]
-> (2-L) = +/-1  ->  L = 3  or  L = 1
L=3: (A-3I)v=0 -> v = (1, 1)
L=1: (A-1I)v=0 -> v = (1, -1)
</code></pre>
<h3>Diagonalization</h3>
<p>Put the eigenvectors as columns of P and the eigenvalues on the diagonal of D. Then <strong>A = P D P^-1</strong>. This makes powers trivial:</p>
<pre><code>A^k = P D^k P^-1     (D^k just raises each diagonal entry to the k)
</code></pre>
<p>Diagonalization works when there are enough independent eigenvectors to fill P. It powers Markov chains, differential equations and repeated dynamics.</p>
<div class="callout"><span class="badge">Why it matters</span> In eigen-coordinates a complicated matrix becomes pure scaling. Google PageRank, PCA and vibration analysis all live on eigenvalues.</div>`,
    `<span class="eyebrow">MLT201 · Chương 6 · Bài 6.1</span>
<h2>Trị riêng, vector riêng &amp; chéo hoá</h2>
<h3>Những hướng ma trận không quay</h3>
<p>Một <strong>vector riêng</strong> v của A là vector khác 0 mà A không đổi hướng — chỉ kéo giãn: <strong>Av = λv</strong>. Số λ là <strong>trị riêng</strong> tương ứng (hệ số giãn). Những hướng đặc biệt này lộ ra bản chất ma trận làm gì.</p>
<h3>Cách tìm</h3>
<p>Av = λv nghĩa là (A - λI)v = 0 có nghiệm khác 0, nên A - λI phải suy biến:</p>
<pre><code>Phuong trinh dac trung:  det(A - λI) = 0

A = [ 2  1 ]   det [ 2-L   1  ] = (2-L)^2 - 1 = 0
    [ 1  2 ]       [  1   2-L ]
-> (2-L) = +/-1  ->  L = 3  hoac  L = 1
L=3: (A-3I)v=0 -> v = (1, 1)
L=1: (A-1I)v=0 -> v = (1, -1)
</code></pre>
<h3>Chéo hoá</h3>
<p>Đặt các vector riêng làm cột của P và các trị riêng trên đường chéo của D. Khi đó <strong>A = P D P^-1</strong>. Điều này khiến luỹ thừa trở nên dễ:</p>
<pre><code>A^k = P D^k P^-1     (D^k chi viec nang moi phan tu cheo len luy thua k)
</code></pre>
<p>Chéo hoá được khi có đủ vector riêng độc lập để lấp đầy P. Nó vận hành xích Markov, phương trình vi phân và động lực lặp.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Trong hệ toạ độ riêng, một ma trận phức tạp trở thành phép co giãn thuần. PageRank của Google, PCA và phân tích rung động đều sống trên trị riêng.</div>`,
  ]]);

const c6q = quiz('mlt201-quiz-6', 'Quiz 6 — Eigenvalues|||Quiz 6 — Trị riêng', [
  { id: 'q1', question: 'Vector riêng v của A thoả điều kiện nào?|||Vector riêng v của A thoả điều kiện nào?', options: ['Av = 0 với v khác 0|||Av = 0 với v khác 0', 'Av = λv với v khác 0|||Av = λv với v khác 0', 'A^T v = v|||A^T v = v', 'det(v) = 0|||det(v) = 0'], correctIndex: 1, explanation: 'Av = λv, v khác 0: A chỉ kéo giãn v theo hệ số λ mà không đổi hướng.' },
  { id: 'q2', question: 'Trị riêng tìm bằng cách giải phương trình nào?|||Trị riêng tìm bằng cách giải phương trình nào?', options: ['det(A) = 0|||det(A) = 0', 'det(A - λI) = 0|||det(A - λI) = 0', 'A - λI = I|||A - λI = I', 'trace(A) = λ|||trace(A) = λ'], correctIndex: 1, explanation: 'Phương trình đặc trưng det(A - λI) = 0 cho các trị riêng λ.' },
  { id: 'q3', question: 'Nếu A = PDP⁻¹ thì A^k bằng?|||Nếu A = PDP⁻¹ thì A^k bằng?', options: ['P^k D P⁻¹|||P^k D P⁻¹', 'P D^k P⁻¹|||P D^k P⁻¹', 'D^k|||D^k', '(PDP⁻¹)^k = P D P^k|||(PDP⁻¹)^k = P D P^k'], correctIndex: 1, explanation: 'Các P⁻¹P triệt tiêu nhau nên A^k = P D^k P⁻¹; chỉ cần nâng mỗi phần tử chéo lên luỹ thừa k.' },
]);

const c7 = doc('mlt201-7-1-orthogonality', '7.1 — Orthogonality & least squares|||7.1 — Trực giao & bình phương tối thiểu',
  'Tích vô hướng, trực giao & chuẩn; chiếu vector lên đường/không gian con; Gram-Schmidt tạo cơ sở trực chuẩn; phương trình chuẩn A^T A x = A^T b cho bình phương tối thiểu.',
  [[
    `<span class="eyebrow">MLT201 · Chapter 7 · Lesson 7.1</span>
<h2>Orthogonality &amp; least squares</h2>
<h3>Dot product, length, angle</h3>
<p>The <strong>dot product</strong> u·v measures alignment. Length is |v| = sqrt(v·v); two vectors are <strong>orthogonal</strong> (perpendicular) when u·v = 0. Orthogonal directions are independent and easy to work with — no cross-talk.</p>
<h3>Projection</h3>
<p>The projection of b onto the line through a is the closest point on that line to b:</p>
<pre><code>proj_a(b) = ( (a . b) / (a . a) ) * a
The error e = b - proj is orthogonal to a  (a . e = 0)
</code></pre>
<h3>Gram-Schmidt</h3>
<p>Turn any independent set into an <strong>orthonormal basis</strong> (mutually perpendicular, each length 1): take each vector, subtract its projections onto the ones already fixed, then normalize.</p>
<h3>Least squares</h3>
<p>When Ax = b has no exact solution (more equations than unknowns — think fitting a line to noisy points), find the x that minimizes the error |Ax - b|. The best x solves the <strong>normal equations</strong>:</p>
<pre><code>A^T A x = A^T b     ->     x = (A^T A)^-1 A^T b
Geometry: Ax is the projection of b onto the column space of A.
</code></pre>
<div class="callout"><span class="badge">Where you meet it</span> Least squares is linear regression. Every trend line, sensor calibration and data fit is this one formula projecting data onto a model.</div>`,
    `<span class="eyebrow">MLT201 · Chương 7 · Bài 7.1</span>
<h2>Trực giao &amp; bình phương tối thiểu</h2>
<h3>Tích vô hướng, độ dài, góc</h3>
<p><strong>Tích vô hướng</strong> u·v đo mức thẳng hàng. Độ dài là |v| = sqrt(v·v); hai vector <strong>trực giao</strong> (vuông góc) khi u·v = 0. Các hướng trực giao thì độc lập và dễ làm việc — không nhiễu chéo nhau.</p>
<h3>Phép chiếu</h3>
<p>Hình chiếu của b lên đường qua a là điểm gần b nhất trên đường đó:</p>
<pre><code>proj_a(b) = ( (a . b) / (a . a) ) * a
Sai so e = b - proj truc giao voi a  (a . e = 0)
</code></pre>
<h3>Gram-Schmidt</h3>
<p>Biến một tập độc lập bất kỳ thành <strong>cơ sở trực chuẩn</strong> (đôi một vuông góc, mỗi vector dài 1): lấy từng vector, trừ đi các hình chiếu lên những vector đã cố định, rồi chuẩn hoá.</p>
<h3>Bình phương tối thiểu</h3>
<p>Khi Ax = b không có nghiệm đúng (nhiều phương trình hơn ẩn — như khớp một đường thẳng qua các điểm nhiễu), tìm x làm nhỏ nhất sai số |Ax - b|. x tốt nhất giải <strong>phương trình chuẩn</strong>:</p>
<pre><code>A^T A x = A^T b     ->     x = (A^T A)^-1 A^T b
Hinh hoc: Ax la hinh chieu cua b len khong gian cot cua A.
</code></pre>
<div class="callout"><span class="badge">Gặp ở đâu</span> Bình phương tối thiểu chính là hồi quy tuyến tính. Mọi đường xu hướng, hiệu chuẩn cảm biến và khớp dữ liệu đều là công thức này chiếu dữ liệu lên mô hình.</div>`,
  ]]);

const c7q = quiz('mlt201-quiz-7', 'Quiz 7 — Orthogonality|||Quiz 7 — Trực giao', [
  { id: 'q1', question: 'Hai vector u, v trực giao (vuông góc) khi?|||Hai vector u, v trực giao (vuông góc) khi?', options: ['u · v = 0|||u · v = 0', 'u · v = 1|||u · v = 1', 'u = v|||u = v', '|u| = |v||||=|u| = |v|'], correctIndex: 0, explanation: 'Tích vô hướng bằng 0 nghĩa là hai vector vuông góc.' },
  { id: 'q2', question: 'Gram-Schmidt dùng để?|||Gram-Schmidt dùng để?', options: ['Tính định thức|||Tính định thức', 'Tạo cơ sở trực chuẩn từ một tập độc lập|||Tạo cơ sở trực chuẩn từ một tập độc lập', 'Tìm trị riêng|||Tìm trị riêng', 'Giải hệ có nghiệm duy nhất|||Giải hệ có nghiệm duy nhất'], correctIndex: 1, explanation: 'Gram-Schmidt biến tập độc lập thành cơ sở trực chuẩn: trừ hình chiếu rồi chuẩn hoá.' },
  { id: 'q3', question: 'Nghiệm bình phương tối thiểu của Ax = b giải phương trình nào?|||Nghiệm bình phương tối thiểu của Ax = b giải phương trình nào?', options: ['Ax = b|||Ax = b', 'A^T A x = A^T b|||A^T A x = A^T b', 'A A^T x = b|||A A^T x = b', 'A^T x = b|||A^T x = b'], correctIndex: 1, explanation: 'Phương trình chuẩn A^T A x = A^T b cho x làm nhỏ nhất |Ax - b|; Ax là hình chiếu của b lên không gian cột.' },
]);

const c8 = doc('mlt201-8-1-applications', '8.1 — SVD, PCA & applications|||8.1 — SVD, PCA & ứng dụng',
  'Phân tích giá trị suy biến SVD (A = U Σ V^T) như tổng quát của chéo hoá; PCA giảm chiều dữ liệu; ứng dụng: nén ảnh, đồ hoạ (ma trận biến đổi), học máy.',
  [[
    `<span class="eyebrow">MLT201 · Chapter 8 · Lesson 8.1</span>
<h2>SVD, PCA &amp; applications</h2>
<h3>Singular Value Decomposition</h3>
<p>The <strong>SVD</strong> factors <em>any</em> matrix (not just square) into <strong>A = U Σ V^T</strong>: an orthogonal rotation V^T, a diagonal scaling Σ of nonnegative <em>singular values</em>, and another rotation U. It is the grand generalization of diagonalization and the most useful matrix factorization in applied work.</p>
<pre><code>A (m x n) = U (m x m) . Sigma (m x n) . V^T (n x n)
Sigma = diag(s1 >= s2 >= ... >= 0)   the singular values
Keep the top k singular values -> best rank-k approximation of A
</code></pre>
<h3>PCA — principal component analysis</h3>
<p><strong>PCA</strong> finds the directions of greatest variance in data. Center the data, then take the top eigenvectors of the covariance matrix (equivalently the top singular vectors). Projecting onto a few of them <strong>reduces dimension</strong> while keeping most of the information — the core trick of data compression and visualization.</p>
<h3>Where linear algebra runs the world</h3>
<ul>
<li><strong>Graphics</strong> — every rotation, scale, translation and 3D-to-2D projection is a matrix; a pipeline multiplies them.</li>
<li><strong>Image compression</strong> — keep only the largest singular values (low-rank SVD).</li>
<li><strong>Machine learning</strong> — data is matrices; training is matrix multiplication, gradients and factorizations.</li>
<li><strong>Search &amp; recommendations</strong> — PageRank is an eigenvector; recommenders factor a ratings matrix.</li>
</ul>
<div class="callout"><span class="badge">The payoff</span> SVD and PCA turn the whole course — systems, matrices, eigenvalues, orthogonality — into working tools for compressing, understanding and learning from real data.</div>`,
    `<span class="eyebrow">MLT201 · Chương 8 · Bài 8.1</span>
<h2>SVD, PCA &amp; ứng dụng</h2>
<h3>Phân tích giá trị suy biến (SVD)</h3>
<p><strong>SVD</strong> phân tích <em>mọi</em> ma trận (không cần vuông) thành <strong>A = U Σ V^T</strong>: một phép quay trực giao V^T, một phép co giãn chéo Σ gồm các <em>giá trị suy biến</em> không âm, và một phép quay U nữa. Đây là tổng quát lớn của chéo hoá và là phân tích ma trận hữu dụng nhất trong ứng dụng.</p>
<pre><code>A (m x n) = U (m x m) . Sigma (m x n) . V^T (n x n)
Sigma = diag(s1 >= s2 >= ... >= 0)   cac gia tri suy bien
Giu k gia tri suy bien lon nhat -> xap xi hang-k tot nhat cua A
</code></pre>
<h3>PCA — phân tích thành phần chính</h3>
<p><strong>PCA</strong> tìm các hướng biến thiên lớn nhất trong dữ liệu. Trừ trung bình, rồi lấy các vector riêng lớn nhất của ma trận hiệp phương sai (tương đương các vector suy biến lớn nhất). Chiếu lên vài hướng đó <strong>giảm chiều</strong> mà vẫn giữ hầu hết thông tin — chiêu cốt lõi của nén và trực quan hoá dữ liệu.</p>
<h3>Đại số tuyến tính vận hành thế giới ở đâu</h3>
<ul>
<li><strong>Đồ hoạ</strong> — mọi phép quay, co giãn, tịnh tiến và chiếu 3D-xuống-2D đều là ma trận; một pipeline nhân chúng lại.</li>
<li><strong>Nén ảnh</strong> — chỉ giữ các giá trị suy biến lớn nhất (SVD hạng thấp).</li>
<li><strong>Học máy</strong> — dữ liệu là ma trận; huấn luyện là nhân ma trận, đạo hàm và phân tích.</li>
<li><strong>Tìm kiếm &amp; gợi ý</strong> — PageRank là một vector riêng; hệ gợi ý phân tích ma trận đánh giá.</li>
</ul>
<div class="callout"><span class="badge">Thành quả</span> SVD và PCA biến cả môn học — hệ, ma trận, trị riêng, trực giao — thành công cụ làm việc để nén, hiểu và học từ dữ liệu thật.</div>`,
  ]]);

const c8q = quiz('mlt201-quiz-8', 'Quiz 8 — SVD, PCA & applications|||Quiz 8 — SVD, PCA & ứng dụng', [
  { id: 'q1', question: 'SVD phân tích ma trận A thành?|||SVD phân tích ma trận A thành?', options: ['A = P D P⁻¹|||A = P D P⁻¹', 'A = U Σ V^T|||A = U Σ V^T', 'A = A^T A|||A = A^T A', 'A = L U|||A = L U'], correctIndex: 1, explanation: 'SVD: A = U Σ V^T — hai phép quay trực giao và một phép co giãn chéo; áp dụng cho MỌI ma trận, không cần vuông.' },
  { id: 'q2', question: 'PCA chủ yếu dùng để?|||PCA chủ yếu dùng để?', options: ['Giảm chiều dữ liệu, giữ hướng biến thiên lớn nhất|||Giảm chiều dữ liệu, giữ hướng biến thiên lớn nhất', 'Giải hệ phương trình tuyến tính|||Giải hệ phương trình tuyến tính', 'Tính định thức nhanh|||Tính định thức nhanh', 'Đảo ngược một ma trận|||Đảo ngược một ma trận'], correctIndex: 0, explanation: 'PCA chiếu dữ liệu lên các thành phần chính (vector riêng lớn nhất của hiệp phương sai) để giảm chiều mà giữ hầu hết thông tin.' },
  { id: 'q3', question: 'Trong đồ hoạ máy tính, một phép quay hay co giãn 3D được biểu diễn bằng?|||Trong đồ hoạ máy tính, một phép quay hay co giãn 3D được biểu diễn bằng?', options: ['Một số vô hướng|||Một số vô hướng', 'Một ma trận biến đổi|||Một ma trận biến đổi', 'Một định thức|||Một định thức', 'Một trị riêng|||Một trị riêng'], correctIndex: 1, explanation: 'Mỗi phép quay/co giãn/tịnh tiến là một ma trận; pipeline đồ hoạ nhân các ma trận biến đổi này lại với nhau.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'MLT201',
    slug: 'mlt201-matrices-and-linear-transformations',
    title: 'Matrices and Linear Transformations',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MLT201.webp',
    shortDescription: 'Linear algebra for CS — linear systems (Gauss), matrices & inverses, determinants, vector spaces, linear transformations, eigenvalues & diagonalization, orthogonality & least squares, SVD & PCA. Bilingual, worked examples & quizzes.|||Đại số tuyến tính cho KHMT — hệ tuyến tính (Gauss), ma trận & nghịch đảo, định thức, không gian vector, biến đổi tuyến tính, trị riêng & chéo hoá, trực giao & bình phương tối thiểu, SVD & PCA. Song ngữ, ví dụ & quiz.',
    description: 'Môn <strong>MLT201 — Matrices and Linear Transformations</strong> (Đại số tuyến tính, kỳ 2) dạy bạn vừa <strong>tính</strong> với ma trận vừa <strong>nhìn thấy</strong> ma trận biến đổi không gian. Từ <strong>hệ tuyến tính &amp; khử Gauss</strong> → <strong>phép toán &amp; nghịch đảo ma trận</strong> → <strong>định thức</strong> (Cramer) → <strong>không gian vector</strong> (độc lập, cơ sở, chiều) → <strong>biến đổi tuyến tính</strong> (kernel/image, rank-nullity) → <strong>trị riêng &amp; chéo hoá</strong> → <strong>trực giao &amp; bình phương tối thiểu</strong> → <strong>SVD, PCA &amp; ứng dụng</strong> (đồ hoạ, học máy). Bám sách chuẩn Strang &amp; Lay, song ngữ, có ví dụ giải và quiz mỗi chương.',
    whatYouLearn: 'Khử Gauss & dạng bậc thang (REF/RREF); cộng/nhân/chuyển vị & nghịch đảo ma trận (Gauss-Jordan); định thức 2×2/3×3, tính chất & Cramer; không gian vector, span, độc lập tuyến tính, cơ sở & chiều; biến đổi tuyến tính, ma trận biểu diễn, kernel/image, định lý rank-nullity; trị riêng/vector riêng, phương trình đặc trưng & chéo hoá A = PDP⁻¹; tích vô hướng, trực giao, Gram-Schmidt, phép chiếu & bình phương tối thiểu; SVD (A = UΣV^T), PCA và ứng dụng đồ hoạ/học máy.',
    requirements: 'Toán phổ thông (đại số, hệ phương trình). Nên biết Python/NumPy cơ bản để kiểm lại kết quả (không bắt buộc).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn (Strang, Lay), MIT 18.06, 3Blue1Brown, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Đại số tuyến tính làm gì, Ax = b, hai cách đọc hàng/cột.', lessons: [intro] },
    { title: 'Chương 1 — Hệ tuyến tính|||Chapter 1 — Linear systems', description: 'Khử Gauss, dạng bậc thang, ba loại nghiệm.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Ma trận & phép toán|||Chapter 2 — Matrix operations', description: 'Cộng/nhân/chuyển vị, nghịch đảo, Gauss-Jordan.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Định thức|||Chapter 3 — Determinants', description: 'Định thức, tính chất, Cramer.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Không gian vector|||Chapter 4 — Vector spaces', description: 'Span, độc lập, cơ sở, chiều.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Biến đổi tuyến tính|||Chapter 5 — Linear transformations', description: 'Ma trận biểu diễn, kernel/image, rank-nullity.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Trị riêng & vector riêng|||Chapter 6 — Eigenvalues', description: 'Av = λv, phương trình đặc trưng, chéo hoá.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Trực giao & bình phương tối thiểu|||Chapter 7 — Orthogonality', description: 'Chiếu, Gram-Schmidt, phương trình chuẩn.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ứng dụng|||Chapter 8 — Applications', description: 'SVD, PCA, đồ hoạ & học máy.', lessons: [c8, c8q] },
  ],
};
