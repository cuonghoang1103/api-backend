// Khoá TỰ SOẠN cho CVO201 — trường chưa công bố syllabus trên FLM (dò 09/11/2026). Soạn theo _HOP-DONG-TU-SOAN.md.
// Môn kỳ 5, hướng AI/dữ liệu. Khung bám thứ tự giáo trình chuẩn: Boyd & Vandenberghe "Convex Optimization"
// (Cambridge University Press 2004, bản PDF miễn phí của tác giả) + bài giảng Stanford EE364a; phần thuật toán đối chiếu
// Nocedal & Wright "Numerical Optimization" 2e (Springer 2006) và Beck "First-Order Methods in Optimization" (SIAM 2017).
// Nối tiếp MAA102 (đại số tuyến tính) và MLT201 (ma trận như phép biến đổi) — bài nào cần thì trỏ về đúng bài đó.
// Mọi đoạn code chạy thật trong venv riêng (Python 3.14, numpy 2.5.4, scipy 1.18.1, cvxpy 1.9.3, scikit-learn 1.9.1),
// output dán nguyên văn. Mọi link ngoài đã mở thử (HTTP 200 + tiêu đề / trang đầu PDF đúng chủ đề) ngày 09/11/2026.
// ⚠️ File này KHÔNG dùng chuỗi nội suy (dấu đô-la + ngoặc nhọn) và không backtick lồng.

const bi = (en, vi) => '<div class="ml-en">' + en + '</div>\n<div class="ml-vi">' + vi + '</div>';
const L = (slug, title, description, en, vi) => ({ title, slug, type: 'DOCUMENT', description, content: bi(en, vi) });
const Q = (id, question, options, correctIndex, explanation) => ({ id, question, options, correctIndex, points: 1, explanation });
const QZ = (ch, title, description, questions) => ({
  title, slug: 'cvo201-ts-quiz-' + ch, type: 'QUIZ', description,
  quiz: { timeLimitSeconds: 900, questions },
});
// ───────────────────────────── Mục 0 ─────────────────────────────
const m01 = L('cvo201-ts-0-1',
  '0.1 — Welcome to CVO201: why convex optimization is the engine of machine learning|||0.1 — Giới thiệu CVO201: vì sao tối ưu lồi là động cơ của học máy',
  'CVO201 học gì, dùng vào đâu (huấn luyện mô hình, SVM, hồi quy, danh mục đầu tư, lập kế hoạch), 8 chuẩn đầu ra tự soạn, nối tiếp MAA102/MLT201, cảnh báo: trường chưa công bố syllabus trên FLM.',
  `<span class="eyebrow">CVO201 · Section 0 · Lesson 0.1</span>
<h2>Welcome to Convex Optimization</h2>
<p class="lead">Almost every model you will train in the AI track — linear and logistic regression, support vector machines, Lasso, the last layer of a neural network — is found by <strong>solving an optimization problem</strong>. CVO201 teaches the class of problems we can solve <strong>reliably, globally and fast</strong>: convex problems.</p>
<div class="callout"><p>⚠️ <strong>Important.</strong> FPT University has <strong>not published the CVO201 syllabus on FLM</strong> (we searched the course code, its variants and the course name on 09/11/2026). This course framework is therefore <strong>self-authored</strong>, following the chapter order of the standard international textbook — Boyd &amp; Vandenberghe, <em>Convex Optimization</em>, and the Stanford course EE364a built on it. <strong>Grading weights, assessment format and exam dates are decided by your lecturer</strong> — always follow the course outline your lecturer gives in class.</p></div>
<h3>What is convex optimization?</h3>
<p>An optimization problem asks: among all choices x that satisfy some constraints, which one makes an objective f(x) smallest? In general this is hopeless — a function can have millions of valleys and no algorithm can be sure it found the deepest one. A problem is <strong>convex</strong> when the objective is bowl-shaped (convex) and the set of allowed choices has no dents (convex set). Then something remarkable happens: <strong>every local minimum is a global minimum</strong>, there is a precise certificate of optimality (the KKT conditions and the dual problem), and interior-point methods solve problems with thousands of variables in a few dozen iterations. In Boyd's words, the dividing line between “easy” and “hard” optimization is not linear versus nonlinear, but convex versus nonconvex.</p>
<h3>The course in five blocks</h3>
<ul>
<li><strong>Foundations</strong> (Ch. 1–3): optimization problems, the math toolkit (gradients, Hessians, positive semidefinite matrices), convex sets and convex functions, and how to <em>recognise</em> convexity.</li>
<li><strong>Problem classes</strong> (Ch. 4): linear programs (LP), quadratic programs (QP), second-order cone programs (SOCP) and semidefinite programs (SDP), modelled in CVXPY.</li>
<li><strong>Duality</strong> (Ch. 5): Lagrangian, dual problem, weak and strong duality, KKT conditions, shadow prices.</li>
<li><strong>Applications</strong> (Ch. 6): least squares and regularisation (ridge, Lasso), SVM, logistic regression, portfolio optimization.</li>
<li><strong>Algorithms</strong> (Ch. 7–9): gradient descent, line search, Newton's method, equality constraints, barrier and interior-point methods, and the first-order methods of machine learning — SGD, momentum, proximal gradient for Lasso.</li>
</ul>
<h3>Why does an AI / data student need it?</h3>
<ul>
<li><strong>Training = optimization.</strong> “Fit the model” always means “minimise a loss”. Knowing when that loss is convex tells you whether the answer is unique and whether the optimizer can be trusted (Lessons 6.1–6.4).</li>
<li><strong>Choosing optimizers and learning rates.</strong> Why does gradient descent crawl on badly scaled features? Why does momentum help? The condition number answers both (Lessons 7.1, 9.2).</li>
<li><strong>Regularisation and sparsity.</strong> Why does the ℓ1 penalty set coefficients exactly to zero while ℓ2 does not? Geometry of convex sets and the proximal operator (Lessons 6.2, 9.3).</li>
<li><strong>Beyond ML:</strong> scheduling, routing, resource allocation, portfolio construction and control are LPs, QPs and SOCPs solved daily in industry (Lessons 4.2, 6.5).</li>
<li><strong>Reading research papers:</strong> “the dual problem”, “KKT”, “strongly convex”, “L-smooth”, “O(1/k<sup>2</sup>) rate” appear in almost every ML paper.</li>
</ul>
<h3>Learning outcomes (self-authored)</h3>
<p>After this course you should be able to:</p>
<ol>
<li>Write a real decision problem in standard form (variables, objective, constraints) and decide whether it is convex.</li>
<li>Recognise and prove convexity of sets (halfspaces, balls, ellipsoids, polyhedra, the PSD cone) and functions (first- and second-order conditions, Jensen), and use the operations that preserve convexity.</li>
<li>Classify and model problems as LP, QP, SOCP or SDP, and solve them in Python with CVXPY and SciPy, reading the solver status correctly.</li>
<li>Form the Lagrangian and the dual problem, use weak/strong duality and Slater's condition, solve small problems by hand with the KKT conditions and interpret multipliers as shadow prices.</li>
<li>Formulate least squares, ridge, Lasso, soft-margin SVM, logistic regression and Markowitz portfolio problems as convex programs and explain their trade-off parameters.</li>
<li>Implement gradient descent with backtracking line search and Newton's method, and explain their convergence in terms of smoothness, strong convexity and the condition number.</li>
<li>Explain how equality-constrained Newton, the log-barrier and interior-point methods work, and why solvers need only tens of iterations.</li>
<li>Implement SGD, momentum/Nesterov, projected gradient and proximal gradient (ISTA/FISTA) for machine-learning problems and choose a suitable method for a given problem.</li>
</ol>
<h3>Related courses at FPTU</h3>
<p>CVO201 builds directly on <strong>MAA102 — Linear Algebra</strong> (matrices, least squares, eigenvalues, symmetric and positive definite matrices, SVD) and <strong>MLT201</strong> (matrices as geometric transformations, quadratic forms). Whenever we need one of their results we recall it in one line and point to the exact lesson, for example “MAA102 Lesson 10.1” for the spectral theorem or “MLT201 Lesson 9.3” for quadratic forms. You also need multivariable calculus (partial derivatives, gradient, chain rule) and basic Python with NumPy. Lessons 6.4 and 9.1 use the maximum-likelihood idea from probability and statistics (IPY111 / PSI221 if they are in your curriculum). The ideas are used again in the machine-learning and deep-learning courses of the AI track — check the exact course codes in your own curriculum.</p>
<h3>How to study this course</h3>
<ul>
<li>Every lesson has objectives, a lecture, a worked example solved step by step, common mistakes, a 📌 summary, 🔗 further learning and 🧪 practice with answers. Each chapter ends with a quiz.</li>
<li>Every code block was actually run; the grey box under it is the real output. <strong>Run the code yourself</strong>, change the numbers and predict the result before pressing Enter.</li>
<li>For every problem you meet, ask three questions: <em>Is it convex? Which class (LP/QP/SOCP/SDP)? What does its dual say?</em> That habit is the whole course in one line.</li>
</ul>`,
  `<span class="eyebrow">CVO201 · Mục 0 · Bài 0.1</span>
<h2>Chào mừng đến với Tối ưu lồi</h2>
<p class="lead">Gần như mọi mô hình bạn sẽ huấn luyện ở chuyên ngành AI — hồi quy tuyến tính và logistic, máy vectơ hỗ trợ (SVM), Lasso, lớp cuối của mạng nơ-ron — đều được tìm ra bằng cách <strong>giải một bài toán tối ưu</strong>. CVO201 dạy lớp bài toán ta giải được <strong>đáng tin, tới nghiệm toàn cục và nhanh</strong>: các bài toán lồi.</p>
<div class="callout"><p>⚠️ <strong>Lưu ý quan trọng.</strong> Trường <strong>chưa công bố syllabus của CVO201 trên FLM</strong> (đã dò mã môn, mã biến thể và tên môn ngày 09/11/2026). Vì vậy khung môn này là <strong>khung tự soạn</strong>, bám thứ tự chương của giáo trình chuẩn quốc tế — Boyd &amp; Vandenberghe, <em>Convex Optimization</em>, và khoá Stanford EE364a dựng trên cuốn sách đó. <strong>Cách tính điểm, hình thức đánh giá và lịch thi theo giảng viên</strong> — luôn theo đề cương giảng viên phát trên lớp.</p></div>
<h3>Tối ưu lồi là gì?</h3>
<p>Một bài toán tối ưu hỏi: trong mọi lựa chọn x thoả một số ràng buộc, lựa chọn nào làm hàm mục tiêu f(x) nhỏ nhất? Nói chung việc này vô vọng — một hàm có thể có hàng triệu thung lũng và không thuật toán nào chắc chắn đã tìm được thung lũng sâu nhất. Bài toán là <strong>lồi</strong> khi hàm mục tiêu có hình cái bát (hàm lồi) và tập lựa chọn được phép không có chỗ lõm (tập lồi). Khi đó điều kỳ diệu xảy ra: <strong>mọi cực tiểu địa phương đều là cực tiểu toàn cục</strong>, có một chứng chỉ tối ưu chính xác (điều kiện KKT và bài toán đối ngẫu), và phương pháp điểm trong giải bài toán hàng nghìn biến chỉ trong vài chục vòng lặp. Theo cách nói của Boyd, ranh giới giữa tối ưu “dễ” và “khó” không phải tuyến tính hay phi tuyến, mà là lồi hay không lồi.</p>
<h3>Môn học gồm năm khối</h3>
<ul>
<li><strong>Nền tảng</strong> (Ch. 1–3): bài toán tối ưu, bộ công cụ toán (gradient, Hessian, ma trận nửa xác định dương), tập lồi và hàm lồi, và cách <em>nhận ra</em> tính lồi.</li>
<li><strong>Các lớp bài toán</strong> (Ch. 4): quy hoạch tuyến tính (LP), quy hoạch toàn phương (QP), quy hoạch nón bậc hai (SOCP) và quy hoạch nửa xác định (SDP), mô hình hoá bằng CVXPY.</li>
<li><strong>Đối ngẫu</strong> (Ch. 5): hàm Lagrange, bài toán đối ngẫu, đối ngẫu yếu và mạnh, điều kiện KKT, giá bóng.</li>
<li><strong>Ứng dụng</strong> (Ch. 6): bình phương tối thiểu và chính quy hoá (ridge, Lasso), SVM, hồi quy logistic, tối ưu danh mục đầu tư.</li>
<li><strong>Thuật toán</strong> (Ch. 7–9): gradient descent, tìm bước (line search), phương pháp Newton, ràng buộc đẳng thức, phương pháp barrier và điểm trong, cùng các phương pháp bậc một của học máy — SGD, momentum, proximal gradient cho Lasso.</li>
</ul>
<h3>Sinh viên AI / dữ liệu cần nó để làm gì?</h3>
<ul>
<li><strong>Huấn luyện = tối ưu.</strong> “Khớp mô hình” luôn có nghĩa là “cực tiểu một hàm mất mát”. Biết khi nào hàm mất mát đó lồi cho bạn biết nghiệm có duy nhất không và có tin được bộ tối ưu không (Bài 6.1–6.4).</li>
<li><strong>Chọn bộ tối ưu và learning rate.</strong> Vì sao gradient descent bò chậm khi đặc trưng lệch thang đo? Vì sao momentum giúp nhanh hơn? Số điều kiện trả lời cả hai (Bài 7.1, 9.2).</li>
<li><strong>Chính quy hoá và tính thưa.</strong> Vì sao phạt ℓ1 đẩy hệ số về đúng 0 còn ℓ2 thì không? Hình học của tập lồi và toán tử proximal (Bài 6.2, 9.3).</li>
<li><strong>Ngoài học máy:</strong> xếp lịch, định tuyến, phân bổ tài nguyên, xây danh mục đầu tư và điều khiển là các bài LP, QP, SOCP được giải hằng ngày trong công nghiệp (Bài 4.2, 6.5).</li>
<li><strong>Đọc bài báo khoa học:</strong> “bài toán đối ngẫu”, “KKT”, “lồi mạnh”, “L-trơn”, “tốc độ O(1/k<sup>2</sup>)” xuất hiện trong gần như mọi bài báo học máy.</li>
</ul>
<h3>Chuẩn đầu ra (tự soạn)</h3>
<p>Học xong môn, bạn cần làm được:</p>
<ol>
<li>Viết một bài toán ra quyết định thật ở dạng chuẩn (biến, mục tiêu, ràng buộc) và xác định nó có lồi hay không.</li>
<li>Nhận ra và chứng minh tính lồi của tập (nửa không gian, quả cầu, ellipsoid, đa diện, nón PSD) và của hàm (điều kiện bậc một, bậc hai, Jensen), và dùng các phép toán bảo toàn tính lồi.</li>
<li>Phân loại và mô hình hoá bài toán thành LP, QP, SOCP hoặc SDP, giải bằng Python với CVXPY và SciPy, đọc đúng trạng thái của bộ giải.</li>
<li>Lập hàm Lagrange và bài toán đối ngẫu, dùng đối ngẫu yếu/mạnh và điều kiện Slater, giải tay bài toán nhỏ bằng điều kiện KKT và diễn giải nhân tử như giá bóng.</li>
<li>Phát biểu bình phương tối thiểu, ridge, Lasso, SVM lề mềm, hồi quy logistic và bài toán danh mục Markowitz thành quy hoạch lồi, giải thích tham số đánh đổi của chúng.</li>
<li>Cài đặt gradient descent với tìm bước backtracking và phương pháp Newton, giải thích tốc độ hội tụ qua độ trơn, độ lồi mạnh và số điều kiện.</li>
<li>Giải thích cách Newton có ràng buộc đẳng thức, hàm chắn log và phương pháp điểm trong hoạt động, và vì sao bộ giải chỉ cần vài chục vòng lặp.</li>
<li>Cài đặt SGD, momentum/Nesterov, projected gradient và proximal gradient (ISTA/FISTA) cho bài toán học máy và chọn phương pháp phù hợp cho từng bài.</li>
</ol>
<h3>Môn liên quan trong khung FPTU</h3>
<p>CVO201 xây trực tiếp trên <strong>MAA102 — Đại số tuyến tính</strong> (ma trận, bình phương tối thiểu, trị riêng, ma trận đối xứng và xác định dương, SVD) và <strong>MLT201</strong> (ma trận như phép biến đổi hình học, dạng toàn phương). Khi cần kết quả nào của hai môn đó, ta nhắc lại trong một dòng và trỏ đúng bài, ví dụ “MAA102 Bài 10.1” cho định lý phổ hay “MLT201 Bài 9.3” cho dạng toàn phương. Bạn cũng cần giải tích nhiều biến (đạo hàm riêng, gradient, quy tắc dây chuyền) và Python cơ bản với NumPy. Bài 6.4 và 9.1 dùng ý tưởng hợp lý cực đại của xác suất thống kê (IPY111 / PSI221 nếu có trong chương trình của bạn). Các ý tưởng của môn được dùng lại ở các môn học máy và học sâu của ngành AI — hãy kiểm mã môn chính xác trong chương trình của bạn.</p>
<h3>Cách học môn này</h3>
<ul>
<li>Mỗi bài có mục tiêu, bài giảng, một ví dụ giải từng bước, lỗi hay gặp, 📌 tóm tắt, 🔗 học thêm và 🧪 tự luyện có đáp án. Cuối mỗi chương có quiz.</li>
<li>Mọi khối code đã chạy thật; ô xám bên dưới là output thật. <strong>Hãy tự chạy code</strong>, đổi số và đoán kết quả trước khi bấm Enter.</li>
<li>Với mỗi bài toán gặp phải, hãy hỏi ba câu: <em>Nó có lồi không? Thuộc lớp nào (LP/QP/SOCP/SDP)? Bài toán đối ngẫu nói gì?</em> Thói quen đó là cả môn học gói trong một dòng.</li>
</ul>`);



const m02 = L('cvo201-ts-0-2',
  '0.2 — Textbooks & learning resources (verified)|||0.2 — Giáo trình & tài liệu học (đã kiểm)',
  'Giáo trình chuẩn kèm ISBN (Boyd & Vandenberghe; Nocedal & Wright; Beck; VMLS), khoá mở Stanford EE364a, CMU 10-725, UCLA ECE236C, MIT OCW, tài liệu CVXPY/SciPy, cách cài môi trường.',
  `<span class="eyebrow">CVO201 · Section 0 · Lesson 0.2</span>
<h2>Textbooks and learning resources</h2>
<p class="lead">Convex optimization has one of the best free textbooks in all of applied mathematics. Every resource below was opened and checked on 09/11/2026.</p>
<h3>📚 Main textbooks</h3>
<ol>
<li><strong>Stephen Boyd, Lieven Vandenberghe — <em>Convex Optimization</em>.</strong> Cambridge University Press, 2004 (the authors' free PDF is the seventh printing with corrections, 2009). ISBN 978-0-521-83378-3 (hardback). <a href="https://web.stanford.edu/~boyd/cvxbook/" target="_blank" rel="noopener">Book page</a> · <a href="https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf" target="_blank" rel="noopener">free PDF (with the publisher's permission)</a> · <a href="https://web.stanford.edu/~boyd/cvxbook/bv_cvxslides.pdf" target="_blank" rel="noopener">full lecture slides</a>. <strong>This is the course textbook.</strong> Chapters 2–5 (theory), 6–8 (applications) and 9–11 (algorithms) map onto our Chapters 2–9; each lesson names the section it follows.</li>
<li><strong>Jorge Nocedal, Stephen J. Wright — <em>Numerical Optimization</em>, 2nd edition.</strong> Springer (Springer Series in Operations Research and Financial Engineering), 2006. ISBN 978-0-387-30303-1. The standard reference for line search, Newton and quasi-Newton methods (BFGS, L-BFGS) and practical interior-point methods (used in Chapters 7–8).</li>
<li><strong>Amir Beck — <em>First-Order Methods in Optimization</em>.</strong> SIAM (MOS-SIAM Series on Optimization), 2017. ISBN 978-1-611974-98-0. Gradient, subgradient, proximal gradient, FISTA and their convergence rates — the mathematics behind Chapter 9.</li>
<li><strong>Stephen Boyd, Lieven Vandenberghe — <em>Introduction to Applied Linear Algebra: Vectors, Matrices, and Least Squares</em>.</strong> Cambridge University Press, 2018. ISBN 978-1-316-51896-0. <a href="https://web.stanford.edu/~boyd/vmls/" target="_blank" rel="noopener">Free online</a>. The gentlest bridge from MAA102 to this course: norms, least squares, regularised fitting and classification.</li>
</ol>
<p>Free monograph: <strong>Sébastien Bubeck — <em>Convex Optimization: Algorithms and Complexity</em></strong> — <a href="https://arxiv.org/abs/1405.4980" target="_blank" rel="noopener">arXiv 1405.4980</a>, a compact treatment of convergence rates for gradient-type methods.</p>
<h3>🎓 Open courses and lecture notes</h3>
<ul>
<li><a href="https://web.stanford.edu/class/ee364a/" target="_blank" rel="noopener">Stanford EE364a — Convex Optimization I</a> and its <a href="https://web.stanford.edu/class/ee364a/lectures.html" target="_blank" rel="noopener">lecture slides</a>: the course this framework follows chapter by chapter.</li>
<li><a href="https://see.stanford.edu/Course/EE364A" target="_blank" rel="noopener">Stanford Engineering Everywhere — EE364A</a>: the full set of recorded lectures by Stephen Boyd with handouts; <a href="https://www.youtube.com/watch?v=McLq1hEq3UY" target="_blank" rel="noopener">Lecture 1 on YouTube</a>.</li>
<li><a href="https://www.stat.cmu.edu/~ryantibs/convexopt/" target="_blank" rel="noopener">CMU 10-725 Convex Optimization (Ryan Tibshirani)</a>: a statistics/ML flavoured course with excellent slides on gradient descent, proximal methods, duality, KKT and Newton.</li>
<li><a href="https://www.seas.ucla.edu/~vandenbe/ee236c.html" target="_blank" rel="noopener">UCLA ECE236C — Optimization Methods for Large-Scale Systems (Vandenberghe)</a>: first-order methods in depth.</li>
<li><a href="https://ocw.mit.edu/courses/6-253-convex-analysis-and-optimization-spring-2012/" target="_blank" rel="noopener">MIT OCW 6.253 — Convex Analysis and Optimization</a>: the more theoretical (Bertsekas) view.</li>
<li><a href="https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/" target="_blank" rel="noopener">MIT OCW 18.065 (Gilbert Strang)</a>: linear algebra plus gradient descent and SGD for data science — continues MAA102 naturally.</li>
</ul>
<h3>🛠️ Software</h3>
<ul>
<li><a href="https://www.cvxpy.org/tutorial/intro/index.html" target="_blank" rel="noopener">CVXPY — What is CVXPY?</a>, <a href="https://www.cvxpy.org/tutorial/dcp/index.html" target="_blank" rel="noopener">Disciplined Convex Programming</a> and <a href="https://www.cvxpy.org/examples/index.html" target="_blank" rel="noopener">examples gallery</a>: the modelling language used throughout the course.</li>
<li><a href="https://docs.scipy.org/doc/scipy/tutorial/optimize.html" target="_blank" rel="noopener">SciPy optimize tutorial</a>: <code>minimize</code>, <code>linprog</code>, <code>nnls</code> — for comparing with our hand-written algorithms.</li>
<li><a href="https://dcp.stanford.edu/" target="_blank" rel="noopener">dcp.stanford.edu</a>: an interactive site that parses expressions and shows why they are (or are not) convex by the DCP rules.</li>
</ul>
<p>Environment used in this course: Python 3 with <code>pip install numpy scipy cvxpy scikit-learn</code>. The outputs printed in the lessons were produced with NumPy 2.5.4, SciPy 1.18.1, CVXPY 1.9.3 (default solvers Clarabel, OSQP, HiGHS, SCS) and scikit-learn 1.9.1. Other versions may print slightly different last digits or iteration counts — the optimal values agree to solver tolerance.</p>
<div class="meo"><p><strong>Study plan.</strong> For each lesson: read the lesson here → run the code → read the matching section of Boyd &amp; Vandenberghe or the EE364a slides → do the 🧪 practice on paper → take the chapter quiz. Plan about 6–8 hours per chapter.</p></div>`,
  `<span class="eyebrow">CVO201 · Mục 0 · Bài 0.2</span>
<h2>Giáo trình và tài liệu học</h2>
<p class="lead">Tối ưu lồi có một trong những giáo trình miễn phí hay nhất của toàn bộ toán ứng dụng. Mọi tài liệu dưới đây đã được mở và kiểm ngày 09/11/2026.</p>
<h3>📚 Giáo trình chính</h3>
<ol>
<li><strong>Stephen Boyd, Lieven Vandenberghe — <em>Convex Optimization</em>.</strong> Cambridge University Press, 2004 (bản PDF miễn phí của tác giả là lần in thứ bảy có sửa lỗi, 2009). ISBN 978-0-521-83378-3 (bìa cứng). <a href="https://web.stanford.edu/~boyd/cvxbook/" target="_blank" rel="noopener">Trang sách</a> · <a href="https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf" target="_blank" rel="noopener">PDF miễn phí (được NXB cho phép)</a> · <a href="https://web.stanford.edu/~boyd/cvxbook/bv_cvxslides.pdf" target="_blank" rel="noopener">trọn bộ slide bài giảng</a>. <strong>Đây là giáo trình của môn.</strong> Các chương 2–5 (lý thuyết), 6–8 (ứng dụng) và 9–11 (thuật toán) ứng với Chương 2–9 của khoá; mỗi bài ghi rõ mục sách nó bám theo.</li>
<li><strong>Jorge Nocedal, Stephen J. Wright — <em>Numerical Optimization</em>, tái bản lần 2.</strong> Springer (bộ Springer Series in Operations Research and Financial Engineering), 2006. ISBN 978-0-387-30303-1. Sách tham chiếu chuẩn về tìm bước, phương pháp Newton và tựa Newton (BFGS, L-BFGS) và phương pháp điểm trong thực dụng (dùng ở Chương 7–8).</li>
<li><strong>Amir Beck — <em>First-Order Methods in Optimization</em>.</strong> SIAM (bộ MOS-SIAM Series on Optimization), 2017. ISBN 978-1-611974-98-0. Gradient, subgradient, proximal gradient, FISTA và tốc độ hội tụ của chúng — phần toán đứng sau Chương 9.</li>
<li><strong>Stephen Boyd, Lieven Vandenberghe — <em>Introduction to Applied Linear Algebra: Vectors, Matrices, and Least Squares</em>.</strong> Cambridge University Press, 2018. ISBN 978-1-316-51896-0. <a href="https://web.stanford.edu/~boyd/vmls/" target="_blank" rel="noopener">Đọc miễn phí</a>. Cây cầu nhẹ nhàng nhất từ MAA102 sang môn này: chuẩn, bình phương tối thiểu, khớp có chính quy hoá và phân lớp.</li>
</ol>
<p>Chuyên khảo miễn phí: <strong>Sébastien Bubeck — <em>Convex Optimization: Algorithms and Complexity</em></strong> — <a href="https://arxiv.org/abs/1405.4980" target="_blank" rel="noopener">arXiv 1405.4980</a>, trình bày gọn tốc độ hội tụ của các phương pháp kiểu gradient.</p>
<h3>🎓 Khoá học mở và ghi chú bài giảng</h3>
<ul>
<li><a href="https://web.stanford.edu/class/ee364a/" target="_blank" rel="noopener">Stanford EE364a — Convex Optimization I</a> và <a href="https://web.stanford.edu/class/ee364a/lectures.html" target="_blank" rel="noopener">bộ slide bài giảng</a>: khoá mà khung này bám theo từng chương.</li>
<li><a href="https://see.stanford.edu/Course/EE364A" target="_blank" rel="noopener">Stanford Engineering Everywhere — EE364A</a>: trọn bộ bài giảng ghi hình của Stephen Boyd kèm tài liệu phát tay; <a href="https://www.youtube.com/watch?v=McLq1hEq3UY" target="_blank" rel="noopener">Bài giảng 1 trên YouTube</a>.</li>
<li><a href="https://www.stat.cmu.edu/~ryantibs/convexopt/" target="_blank" rel="noopener">CMU 10-725 Convex Optimization (Ryan Tibshirani)</a>: khoá thiên thống kê/học máy với slide rất hay về gradient descent, phương pháp proximal, đối ngẫu, KKT và Newton.</li>
<li><a href="https://www.seas.ucla.edu/~vandenbe/ee236c.html" target="_blank" rel="noopener">UCLA ECE236C — Optimization Methods for Large-Scale Systems (Vandenberghe)</a>: các phương pháp bậc một ở mức sâu.</li>
<li><a href="https://ocw.mit.edu/courses/6-253-convex-analysis-and-optimization-spring-2012/" target="_blank" rel="noopener">MIT OCW 6.253 — Convex Analysis and Optimization</a>: góc nhìn lý thuyết hơn (Bertsekas).</li>
<li><a href="https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/" target="_blank" rel="noopener">MIT OCW 18.065 (Gilbert Strang)</a>: đại số tuyến tính cộng gradient descent và SGD cho khoa học dữ liệu — nối tiếp MAA102 rất tự nhiên.</li>
</ul>
<h3>🛠️ Phần mềm</h3>
<ul>
<li><a href="https://www.cvxpy.org/tutorial/intro/index.html" target="_blank" rel="noopener">CVXPY — What is CVXPY?</a>, <a href="https://www.cvxpy.org/tutorial/dcp/index.html" target="_blank" rel="noopener">Disciplined Convex Programming</a> và <a href="https://www.cvxpy.org/examples/index.html" target="_blank" rel="noopener">thư viện ví dụ</a>: ngôn ngữ mô hình hoá dùng suốt khoá.</li>
<li><a href="https://docs.scipy.org/doc/scipy/tutorial/optimize.html" target="_blank" rel="noopener">Hướng dẫn SciPy optimize</a>: <code>minimize</code>, <code>linprog</code>, <code>nnls</code> — để đối chiếu với thuật toán ta tự viết.</li>
<li><a href="https://dcp.stanford.edu/" target="_blank" rel="noopener">dcp.stanford.edu</a>: trang tương tác phân tích biểu thức và chỉ ra vì sao nó lồi (hoặc không) theo luật DCP.</li>
</ul>
<p>Môi trường dùng trong khoá: Python 3 với <code>pip install numpy scipy cvxpy scikit-learn</code>. Output in trong bài được tạo bằng NumPy 2.5.4, SciPy 1.18.1, CVXPY 1.9.3 (bộ giải mặc định Clarabel, OSQP, HiGHS, SCS) và scikit-learn 1.9.1. Phiên bản khác có thể in khác vài chữ số cuối hoặc số vòng lặp — giá trị tối ưu vẫn khớp trong sai số của bộ giải.</p>
<div class="meo"><p><strong>Kế hoạch học.</strong> Mỗi bài: đọc bài ở đây → chạy code → đọc mục tương ứng trong Boyd &amp; Vandenberghe hoặc slide EE364a → làm 🧪 tự luyện ra giấy → làm quiz chương. Khoảng 6–8 giờ mỗi chương.</p></div>`);

const muc0 = {
  title: 'Section 0 — Course framework (self-authored, no FLM syllabus)|||Mục 0 — Khung môn học (tự soạn, trường chưa công bố syllabus)',
  description: 'Giới thiệu môn, chuẩn đầu ra tự soạn, nối tiếp MAA102/MLT201, giáo trình chuẩn kèm ISBN và tài liệu mở. Trường chưa công bố syllabus CVO201 trên FLM — điểm/lịch thi theo giảng viên.',
  lessons: [m01, m02],
};


// ───────────────────────────── Chương 1 — Bài toán tối ưu & bộ công cụ ─────────────────────────────
const c11 = L('cvo201-ts-1-1',
  '1.1 — Optimization problems: standard form, feasibility, local vs global optima|||1.1 — Bài toán tối ưu: dạng chuẩn, tính khả thi, cực trị địa phương và toàn cục',
  'Dạng chuẩn minimize f0(x) s.t. fi(x) ≤ 0, hi(x) = 0; miền khả thi, giá trị tối ưu p*, nghiệm tối ưu; khả thi/vô nghiệm/không bị chặn; cực tiểu địa phương vs toàn cục qua ví dụ scipy (Boyd §1.1, §4.1).',
  `<span class="eyebrow">CVO201 · Chapter 1 · Lesson 1.1</span>
<h2>Optimization problems: standard form, feasibility, local vs global optima</h2>
<p class="lead">Before we talk about convexity we need a precise language for “find the best decision”. Every problem in this course will be written in one standard form.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write a problem in standard form and name its parts.</li><li>Define the feasible set, the optimal value p* and an optimal point.</li><li>Distinguish infeasible, unbounded and solvable problems.</li><li>Explain the difference between a local and a global minimum.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Standard form (Boyd §4.1)</span>minimize f<sub>0</sub>(x)<br>subject to f<sub>i</sub>(x) ≤ 0, i = 1, …, m<br>            h<sub>i</sub>(x) = 0, i = 1, …, p</div>
<p>Here x ∈ ℝ<sup>n</sup> is the <strong>optimization variable</strong> (the decision), f<sub>0</sub> is the <strong>objective</strong> (cost, loss, risk), the f<sub>i</sub> are <strong>inequality constraint</strong> functions and the h<sub>i</sub> are <strong>equality constraint</strong> functions. Maximising a profit P(x) is the same as minimising −P(x); a constraint g(x) ≥ 3 is written 3 − g(x) ≤ 0. So the standard form loses nothing.</p>
<p>A point x is <strong>feasible</strong> if it satisfies all constraints; the set of feasible points is the <strong>feasible set</strong>. The <strong>optimal value</strong> is p* = inf { f<sub>0</sub>(x) : x feasible }. Three things can happen:</p>
<ul><li><strong>infeasible</strong>: no point satisfies the constraints, and by convention p* = +∞;</li><li><strong>unbounded below</strong>: we can push f<sub>0</sub> to −∞, so p* = −∞ (for example minimise x subject to x ≤ 5);</li><li><strong>solvable</strong>: there is a feasible x* with f<sub>0</sub>(x*) = p*, an <strong>optimal point</strong>.</li></ul>
<p>A feasible x is a <strong>local minimum</strong> if no nearby feasible point is better: f<sub>0</sub>(x) ≤ f<sub>0</sub>(z) for every feasible z with ‖z − x‖ ≤ R for some R &gt; 0. It is a <strong>global minimum</strong> if no feasible point at all is better. General-purpose local optimizers (gradient descent, <code>scipy.optimize.minimize</code>) only promise local minima. The point of this course is that for <strong>convex</strong> problems the two notions coincide (Lesson 4.1), so a local search is enough.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — two valleys.</b> f(x) = x<sup>4</sup> − 3x<sup>2</sup> + x on ℝ.</p>
<p>Step 1: f′(x) = 4x<sup>3</sup> − 6x + 1 = 0 has three real roots, near −1.30, 0.17 and 1.13. Step 2: f″(x) = 12x<sup>2</sup> − 6 is positive at −1.30 and 1.13 (minima) and negative at 0.17 (a maximum). Step 3: f(−1.30) ≈ −3.51 and f(1.13) ≈ −1.07, so −1.30 is the global minimum and 1.13 is only local. A local method started at x = 2 gets trapped at 1.13.</p></div>
<pre><code class="language-python">import numpy as np
from scipy.optimize import minimize

# a non-convex function of one variable: two valleys
f = lambda x: x[0]**4 - 3*x[0]**2 + x[0]
for x0 in [-2.0, 2.0]:
    r = minimize(f, x0=[x0])
    print(f"start {x0:+.1f} -&gt; x* = {r.x[0]:+.4f}, f(x*) = {r.fun:+.4f}")

# a convex function: every start reaches the same minimiser
g = lambda x: (x[0] - 1)**2 + np.exp(x[0])
for x0 in [-5.0, 0.0, 5.0]:
    r = minimize(g, x0=[x0])
    print(f"convex, start {x0:+.1f} -&gt; x* = {r.x[0]:+.4f}, g(x*) = {r.fun:.4f}")</code></pre>
<div class="out">start -2.0 -&gt; x* = -1.3008, f(x*) = -3.5139
start +2.0 -&gt; x* = +1.1309, f(x*) = -1.0702
convex, start -5.0 -&gt; x* = +0.3149, g(x*) = 1.8395
convex, start +0.0 -&gt; x* = +0.3149, g(x*) = 1.8395
convex, start +5.0 -&gt; x* = +0.3149, g(x*) = 1.8395</div>
<p>The convex function g(x) = (x − 1)<sup>2</sup> + e<sup>x</sup> has g″(x) = 2 + e<sup>x</sup> &gt; 0 everywhere; every starting point reaches the same answer x* ≈ 0.3149.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the sign flip when turning “maximise” into “minimise” — and then reporting −p* as the profit without flipping back.</li><li>Writing a constraint the wrong way round: x ≥ 2 is 2 − x ≤ 0, not x − 2 ≤ 0.</li><li>Trusting a single run of a local optimizer on a nonconvex function. Different starts can give different answers; the solver will still say “success”.</li><li>Confusing p* (a number) with x* (a point). A problem can have p* finite but no x* (minimise e<sup>x</sup>: p* = 0 is never attained).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Standard form: minimise f<sub>0</sub>(x) subject to f<sub>i</sub>(x) ≤ 0, h<sub>i</sub>(x) = 0.</li><li>p* = +∞ for infeasible, −∞ for unbounded problems.</li><li>Local minimum: best in a neighbourhood; global: best overall.</li><li>Local search finds global minima only when the problem is convex.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://web.stanford.edu/class/ee364a/lectures/intro.pdf" target="_blank" rel="noopener">Stanford EE364a — Lecture 1: Introduction (slides)</a></li><li><a href="https://www.stat.cmu.edu/~ryantibs/convexopt/lectures/intro.pdf" target="_blank" rel="noopener">CMU 10-725 — Introduction: Why optimization?</a></li><li><a href="https://en.wikipedia.org/wiki/Mathematical_optimization" target="_blank" rel="noopener">Wikipedia — Mathematical optimization</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write “maximise 3x<sub>1</sub> + 2x<sub>2</sub> subject to x<sub>1</sub> + x<sub>2</sub> ≥ 1, x<sub>1</sub> ≤ 4” in standard form.</li><li>Is “minimise −x<sub>1</sub> subject to x<sub>1</sub> − x<sub>2</sub> ≤ 0” solvable, infeasible or unbounded?</li><li>Find all local and global minima of f(x) = x<sup>3</sup> − 3x on the interval [−3, 3].</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) minimise −3x<sub>1</sub> − 2x<sub>2</sub> subject to 1 − x<sub>1</sub> − x<sub>2</sub> ≤ 0 and x<sub>1</sub> − 4 ≤ 0. 2) Unbounded: take x<sub>2</sub> = x<sub>1</sub> → ∞, the objective goes to −∞. 3) f′ = 3x<sup>2</sup> − 3 = 0 at x = ±1; x = 1 is a local minimum with f = −2; the endpoint x = −3 gives f = −18, the global minimum (the endpoint counts because the domain is constrained).</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 1 · Bài 1.1</span>
<h2>Bài toán tối ưu: dạng chuẩn, tính khả thi, cực trị địa phương và toàn cục</h2>
<p class="lead">Trước khi nói về tính lồi, ta cần một ngôn ngữ chính xác cho việc “tìm quyết định tốt nhất”. Mọi bài toán trong khoá sẽ được viết theo một dạng chuẩn duy nhất.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết bài toán ở dạng chuẩn và gọi tên các thành phần.</li><li>Định nghĩa miền khả thi, giá trị tối ưu p* và điểm tối ưu.</li><li>Phân biệt bài toán vô nghiệm, không bị chặn và giải được.</li><li>Giải thích khác biệt giữa cực tiểu địa phương và toàn cục.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Dạng chuẩn (Boyd §4.1)</span>minimize f<sub>0</sub>(x)<br>subject to f<sub>i</sub>(x) ≤ 0, i = 1, …, m<br>            h<sub>i</sub>(x) = 0, i = 1, …, p</div>
<p>Ở đây x ∈ ℝ<sup>n</sup> là <strong>biến tối ưu</strong> (quyết định), f<sub>0</sub> là <strong>hàm mục tiêu</strong> (chi phí, mất mát, rủi ro), các f<sub>i</sub> là hàm <strong>ràng buộc bất đẳng thức</strong> và các h<sub>i</sub> là hàm <strong>ràng buộc đẳng thức</strong>. Cực đại lợi nhuận P(x) cũng là cực tiểu −P(x); ràng buộc g(x) ≥ 3 viết thành 3 − g(x) ≤ 0. Vậy dạng chuẩn không mất tổng quát.</p>
<p>Điểm x là <strong>khả thi</strong> nếu thoả mọi ràng buộc; tập các điểm khả thi là <strong>miền khả thi</strong>. <strong>Giá trị tối ưu</strong> là p* = inf { f<sub>0</sub>(x) : x khả thi }. Có ba khả năng:</p>
<ul><li><strong>vô nghiệm (infeasible)</strong>: không điểm nào thoả ràng buộc, quy ước p* = +∞;</li><li><strong>không bị chặn dưới</strong>: đẩy được f<sub>0</sub> về −∞, nên p* = −∞ (ví dụ cực tiểu x với x ≤ 5);</li><li><strong>giải được</strong>: có x* khả thi với f<sub>0</sub>(x*) = p*, gọi là <strong>điểm tối ưu</strong>.</li></ul>
<p>Điểm khả thi x là <strong>cực tiểu địa phương</strong> nếu không điểm khả thi lân cận nào tốt hơn: f<sub>0</sub>(x) ≤ f<sub>0</sub>(z) với mọi z khả thi có ‖z − x‖ ≤ R, với R &gt; 0 nào đó. Nó là <strong>cực tiểu toàn cục</strong> nếu không có điểm khả thi nào tốt hơn. Các bộ tối ưu địa phương đa năng (gradient descent, <code>scipy.optimize.minimize</code>) chỉ hứa cực tiểu địa phương. Điểm mấu chốt của môn: với bài toán <strong>lồi</strong> hai khái niệm trùng nhau (Bài 4.1), nên tìm kiếm địa phương là đủ.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — hai thung lũng.</b> f(x) = x<sup>4</sup> − 3x<sup>2</sup> + x trên ℝ.</p>
<p>Bước 1: f′(x) = 4x<sup>3</sup> − 6x + 1 = 0 có ba nghiệm thực, gần −1,30; 0,17 và 1,13. Bước 2: f″(x) = 12x<sup>2</sup> − 6 dương tại −1,30 và 1,13 (cực tiểu) và âm tại 0,17 (cực đại). Bước 3: f(−1,30) ≈ −3,51 và f(1,13) ≈ −1,07, nên −1,30 là cực tiểu toàn cục, còn 1,13 chỉ là địa phương. Một phương pháp địa phương xuất phát từ x = 2 bị kẹt ở 1,13.</p></div>
<pre><code class="language-python">import numpy as np
from scipy.optimize import minimize

# a non-convex function of one variable: two valleys
f = lambda x: x[0]**4 - 3*x[0]**2 + x[0]
for x0 in [-2.0, 2.0]:
    r = minimize(f, x0=[x0])
    print(f"start {x0:+.1f} -&gt; x* = {r.x[0]:+.4f}, f(x*) = {r.fun:+.4f}")

# a convex function: every start reaches the same minimiser
g = lambda x: (x[0] - 1)**2 + np.exp(x[0])
for x0 in [-5.0, 0.0, 5.0]:
    r = minimize(g, x0=[x0])
    print(f"convex, start {x0:+.1f} -&gt; x* = {r.x[0]:+.4f}, g(x*) = {r.fun:.4f}")</code></pre>
<div class="out">start -2.0 -&gt; x* = -1.3008, f(x*) = -3.5139
start +2.0 -&gt; x* = +1.1309, f(x*) = -1.0702
convex, start -5.0 -&gt; x* = +0.3149, g(x*) = 1.8395
convex, start +0.0 -&gt; x* = +0.3149, g(x*) = 1.8395
convex, start +5.0 -&gt; x* = +0.3149, g(x*) = 1.8395</div>
<p>Hàm lồi g(x) = (x − 1)<sup>2</sup> + e<sup>x</sup> có g″(x) = 2 + e<sup>x</sup> &gt; 0 khắp nơi; mọi điểm xuất phát đều tới cùng đáp án x* ≈ 0,3149.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên đổi dấu khi chuyển “cực đại” thành “cực tiểu” — rồi báo −p* là lợi nhuận mà không đổi dấu lại.</li><li>Viết ngược chiều ràng buộc: x ≥ 2 là 2 − x ≤ 0, không phải x − 2 ≤ 0.</li><li>Tin vào một lần chạy bộ tối ưu địa phương trên hàm không lồi. Điểm xuất phát khác có thể cho đáp án khác; bộ giải vẫn báo “success”.</li><li>Nhầm p* (một con số) với x* (một điểm). Bài toán có thể có p* hữu hạn mà không có x* (cực tiểu e<sup>x</sup>: p* = 0 không bao giờ đạt được).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Dạng chuẩn: cực tiểu f<sub>0</sub>(x) với f<sub>i</sub>(x) ≤ 0, h<sub>i</sub>(x) = 0.</li><li>p* = +∞ khi vô nghiệm, −∞ khi không bị chặn.</li><li>Cực tiểu địa phương: tốt nhất trong một lân cận; toàn cục: tốt nhất trên toàn miền.</li><li>Tìm kiếm địa phương chỉ chắc chắn ra cực tiểu toàn cục khi bài toán lồi.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://web.stanford.edu/class/ee364a/lectures/intro.pdf" target="_blank" rel="noopener">Stanford EE364a — Bài 1: Giới thiệu (slide)</a></li><li><a href="https://www.stat.cmu.edu/~ryantibs/convexopt/lectures/intro.pdf" target="_blank" rel="noopener">CMU 10-725 — Giới thiệu: vì sao cần tối ưu?</a></li><li><a href="https://en.wikipedia.org/wiki/Mathematical_optimization" target="_blank" rel="noopener">Wikipedia — Mathematical optimization</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết “cực đại 3x<sub>1</sub> + 2x<sub>2</sub> với x<sub>1</sub> + x<sub>2</sub> ≥ 1, x<sub>1</sub> ≤ 4” ở dạng chuẩn.</li><li>Bài “cực tiểu −x<sub>1</sub> với x<sub>1</sub> − x<sub>2</sub> ≤ 0” giải được, vô nghiệm hay không bị chặn?</li><li>Tìm mọi cực tiểu địa phương và toàn cục của f(x) = x<sup>3</sup> − 3x trên đoạn [−3, 3].</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) cực tiểu −3x<sub>1</sub> − 2x<sub>2</sub> với 1 − x<sub>1</sub> − x<sub>2</sub> ≤ 0 và x<sub>1</sub> − 4 ≤ 0. 2) Không bị chặn: lấy x<sub>2</sub> = x<sub>1</sub> → ∞ thì mục tiêu về −∞. 3) f′ = 3x<sup>2</sup> − 3 = 0 tại x = ±1; x = 1 là cực tiểu địa phương với f = −2; đầu mút x = −3 cho f = −18, là cực tiểu toàn cục (đầu mút được tính vì miền bị ràng buộc).</p></div>`);

const c12 = L('cvo201-ts-1-2',
  '1.2 — The math toolkit: norms, gradients, Hessians and positive semidefinite matrices|||1.2 — Bộ công cụ toán: chuẩn, gradient, Hessian và ma trận nửa xác định dương',
  'Chuẩn ℓ1, ℓ2, ℓ∞; gradient và xấp xỉ bậc nhất; Hessian và xấp xỉ bậc hai; ma trận PSD/PD qua trị riêng (nhắc MAA102 Bài 10.1, MLT201 Bài 9.3); kiểm gradient bằng sai phân hữu hạn.',
  `<span class="eyebrow">CVO201 · Chapter 1 · Lesson 1.2</span>
<h2>The math toolkit: norms, gradients, Hessians and PSD matrices</h2>
<p class="lead">Four objects appear on almost every page of Boyd &amp; Vandenberghe: norms, gradients, Hessians and positive semidefinite matrices. This lesson collects what you need, with pointers back to MAA102 and MLT201.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute the ℓ<sub>1</sub>, ℓ<sub>2</sub> and ℓ<sub>∞</sub> norms and describe their unit balls.</li><li>Compute a gradient and a Hessian and use them in first- and second-order Taylor approximations.</li><li>Test whether a symmetric matrix is positive semidefinite (PSD) or positive definite (PD).</li><li>Check a hand-derived gradient numerically.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Norms.</strong> A norm ‖x‖ measures size: it is nonnegative, zero only at x = 0, scales as ‖tx‖ = |t|‖x‖ and satisfies the triangle inequality. The three we use most:</p>
<div class="formula"><span class="lbl">Common norms</span>‖x‖<sub>1</sub> = ∑ |x<sub>i</sub>|      ‖x‖<sub>2</sub> = √(∑ x<sub>i</sub><sup>2</sup>)      ‖x‖<sub>∞</sub> = max<sub>i</sub> |x<sub>i</sub>|</div>
<p>Their unit balls in ℝ<sup>2</sup> are a diamond (ℓ<sub>1</sub>), a disc (ℓ<sub>2</sub>) and a square (ℓ<sub>∞</sub>). The sharp corners of the ℓ<sub>1</sub> diamond on the axes are the reason Lasso produces sparse solutions (Lesson 6.2).</p>
<p><strong>Gradient.</strong> For f : ℝ<sup>n</sup> → ℝ the gradient ∇f(x) is the vector of partial derivatives. It gives the best linear approximation f(x + v) ≈ f(x) + ∇f(x)<sup>T</sup>v and points in the direction of steepest increase, so −∇f(x) is the steepest-descent direction (Lesson 7.1). Useful rules: ∇(a<sup>T</sup>x) = a, ∇(x<sup>T</sup>Px) = (P + P<sup>T</sup>)x, and for a symmetric P this is 2Px; ∇‖Ax − b‖<sub>2</sub><sup>2</sup> = 2A<sup>T</sup>(Ax − b).</p>
<p><strong>Hessian.</strong> The Hessian ∇<sup>2</sup>f(x) is the symmetric matrix of second partial derivatives. It gives the quadratic approximation f(x + v) ≈ f(x) + ∇f(x)<sup>T</sup>v + ½ v<sup>T</sup>∇<sup>2</sup>f(x)v — the model behind Newton's method (Lesson 7.3).</p>
<p><strong>PSD matrices.</strong> A symmetric matrix P is <strong>positive semidefinite</strong>, written P ⪰ 0, if v<sup>T</sup>Pv ≥ 0 for every v, and <strong>positive definite</strong> (P ≻ 0) if v<sup>T</sup>Pv &gt; 0 for v ≠ 0. By the spectral theorem (MAA102 Lesson 10.1) P = QΛQ<sup>T</sup> with orthonormal Q, so P ⪰ 0 exactly when <strong>all eigenvalues are ≥ 0</strong>. Geometrically (MLT201 Lesson 9.3) the quadratic form v<sup>T</sup>Pv is then a bowl, never a saddle. For a 2×2 matrix, P ⪰ 0 iff p<sub>11</sub> ≥ 0, p<sub>22</sub> ≥ 0 and det P ≥ 0.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example.</b> f(x) = 2x<sub>1</sub><sup>2</sup> + x<sub>1</sub>x<sub>2</sub> + x<sub>2</sub><sup>2</sup> + e<sup>x<sub>1</sub></sup>, at x = (0.5, −1).</p>
<p>Step 1 (gradient): ∂f/∂x<sub>1</sub> = 4x<sub>1</sub> + x<sub>2</sub> + e<sup>x<sub>1</sub></sup> = 2 − 1 + 1.6487 = 2.6487; ∂f/∂x<sub>2</sub> = x<sub>1</sub> + 2x<sub>2</sub> = −1.5. Step 2 (Hessian): [[4 + e<sup>x<sub>1</sub></sup>, 1], [1, 2]]. Step 3 (PSD test): 4 + e<sup>0.5</sup> &gt; 0, 2 &gt; 0, det = 2(4 + e<sup>0.5</sup>) − 1 &gt; 0, so the Hessian is positive definite — at this point and, since e<sup>x<sub>1</sub></sup> &gt; 0, at every point.</p></div>
<pre><code class="language-python">import numpy as np

def f(x):                       # f(x) = 2x1^2 + x1*x2 + x2^2 + exp(x1)
    return 2*x[0]**2 + x[0]*x[1] + x[1]**2 + np.exp(x[0])

def grad(x):
    return np.array([4*x[0] + x[1] + np.exp(x[0]), x[0] + 2*x[1]])

def hess(x):
    return np.array([[4 + np.exp(x[0]), 1.0], [1.0, 2.0]])

x = np.array([0.5, -1.0])
h = 1e-6
num = np.array([(f(x + h*e) - f(x - h*e)) / (2*h) for e in np.eye(2)])
print("analytic gradient :", grad(x).round(6))
print("numerical gradient:", num.round(6))
print("Hessian eigenvalues:", np.linalg.eigvalsh(hess(x)).round(4))
print("norms of v=(3,-4): l1 =", np.abs([3, -4]).sum(),
      " l2 =", np.linalg.norm([3, -4]), " linf =", np.abs([3, -4]).max())</code></pre>
<div class="out">analytic gradient : [ 2.648721 -1.5     ]
numerical gradient: [ 2.648721 -1.5     ]
Hessian eigenvalues: [1.7439 5.9048]
norms of v=(3,-4): l1 = 7  l2 = 5.0  linf = 4</div>
<p>The central-difference gradient agrees with the formula to six decimals — always run this check before trusting a hand-derived gradient inside an algorithm.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing ∇(x<sup>T</sup>Px) = Px: the correct result is 2Px for symmetric P.</li><li>Testing PSD by looking at the diagonal only: [[1, 2], [2, 1]] has a positive diagonal but eigenvalues −1 and 3.</li><li>Using <code>np.linalg.eig</code> on a symmetric matrix: use <code>eigvalsh</code>, which is faster and returns real, sorted eigenvalues.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>ℓ<sub>1</sub>, ℓ<sub>2</sub>, ℓ<sub>∞</sub> norms; unit balls diamond, disc, square.</li><li>Gradient = best linear model; −∇f is steepest descent.</li><li>Hessian = curvature; quadratic model of f.</li><li>P ⪰ 0 ⇔ all eigenvalues ≥ 0 ⇔ v<sup>T</sup>Pv ≥ 0 for all v.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Definite_matrix" target="_blank" rel="noopener">Wikipedia — Definite matrix (PSD and PD matrices)</a></li><li><a href="https://en.wikipedia.org/wiki/Hessian_matrix" target="_blank" rel="noopener">Wikipedia — Hessian matrix</a></li><li><a href="https://web.stanford.edu/~boyd/vmls/" target="_blank" rel="noopener">Boyd &amp; Vandenberghe — Introduction to Applied Linear Algebra (VMLS), free book</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Compute ‖x‖<sub>1</sub>, ‖x‖<sub>2</sub>, ‖x‖<sub>∞</sub> for x = (1, −2, 2).</li><li>Find ∇f and ∇<sup>2</sup>f for f(x) = ‖Ax − b‖<sub>2</sub><sup>2</sup>. Is the Hessian always PSD?</li><li>For which values of a is [[2, a], [a, 2]] positive semidefinite?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 5, 3, 2. 2) ∇f = 2A<sup>T</sup>(Ax − b), ∇<sup>2</sup>f = 2A<sup>T</sup>A; always PSD because v<sup>T</sup>A<sup>T</sup>Av = ‖Av‖<sup>2</sup> ≥ 0. 3) Eigenvalues 2 ± a, so PSD iff |a| ≤ 2 (equivalently det = 4 − a<sup>2</sup> ≥ 0).</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 1 · Bài 1.2</span>
<h2>Bộ công cụ toán: chuẩn, gradient, Hessian và ma trận PSD</h2>
<p class="lead">Bốn đối tượng xuất hiện ở gần như mọi trang của Boyd &amp; Vandenberghe: chuẩn, gradient, Hessian và ma trận nửa xác định dương. Bài này gom những gì bạn cần, kèm chỗ trỏ về MAA102 và MLT201.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính chuẩn ℓ<sub>1</sub>, ℓ<sub>2</sub>, ℓ<sub>∞</sub> và mô tả quả cầu đơn vị của chúng.</li><li>Tính gradient và Hessian, dùng chúng trong khai triển Taylor bậc một và bậc hai.</li><li>Kiểm một ma trận đối xứng có nửa xác định dương (PSD) hay xác định dương (PD).</li><li>Kiểm bằng số một gradient tính tay.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Chuẩn.</strong> Chuẩn ‖x‖ đo độ lớn: không âm, bằng 0 chỉ khi x = 0, co giãn ‖tx‖ = |t|‖x‖ và thoả bất đẳng thức tam giác. Ba chuẩn dùng nhiều nhất:</p>
<div class="formula"><span class="lbl">Các chuẩn thông dụng</span>‖x‖<sub>1</sub> = ∑ |x<sub>i</sub>|      ‖x‖<sub>2</sub> = √(∑ x<sub>i</sub><sup>2</sup>)      ‖x‖<sub>∞</sub> = max<sub>i</sub> |x<sub>i</sub>|</div>
<p>Trong ℝ<sup>2</sup>, quả cầu đơn vị của chúng là hình thoi (ℓ<sub>1</sub>), hình tròn (ℓ<sub>2</sub>) và hình vuông (ℓ<sub>∞</sub>). Các góc nhọn của hình thoi ℓ<sub>1</sub> nằm trên các trục chính là lý do Lasso cho nghiệm thưa (Bài 6.2).</p>
<p><strong>Gradient.</strong> Với f : ℝ<sup>n</sup> → ℝ, gradient ∇f(x) là vectơ các đạo hàm riêng. Nó cho xấp xỉ tuyến tính tốt nhất f(x + v) ≈ f(x) + ∇f(x)<sup>T</sup>v và chỉ hướng tăng nhanh nhất, nên −∇f(x) là hướng giảm dốc nhất (Bài 7.1). Quy tắc hữu ích: ∇(a<sup>T</sup>x) = a, ∇(x<sup>T</sup>Px) = (P + P<sup>T</sup>)x, với P đối xứng thì bằng 2Px; ∇‖Ax − b‖<sub>2</sub><sup>2</sup> = 2A<sup>T</sup>(Ax − b).</p>
<p><strong>Hessian.</strong> Hessian ∇<sup>2</sup>f(x) là ma trận đối xứng các đạo hàm riêng cấp hai. Nó cho xấp xỉ bậc hai f(x + v) ≈ f(x) + ∇f(x)<sup>T</sup>v + ½ v<sup>T</sup>∇<sup>2</sup>f(x)v — mô hình đứng sau phương pháp Newton (Bài 7.3).</p>
<p><strong>Ma trận PSD.</strong> Ma trận đối xứng P là <strong>nửa xác định dương</strong>, ký hiệu P ⪰ 0, nếu v<sup>T</sup>Pv ≥ 0 với mọi v, và <strong>xác định dương</strong> (P ≻ 0) nếu v<sup>T</sup>Pv &gt; 0 với v ≠ 0. Theo định lý phổ (MAA102 Bài 10.1) P = QΛQ<sup>T</sup> với Q trực chuẩn, nên P ⪰ 0 đúng khi <strong>mọi trị riêng ≥ 0</strong>. Về hình học (MLT201 Bài 9.3), dạng toàn phương v<sup>T</sup>Pv khi đó là một cái bát, không bao giờ là yên ngựa. Với ma trận 2×2, P ⪰ 0 khi và chỉ khi p<sub>11</sub> ≥ 0, p<sub>22</sub> ≥ 0 và det P ≥ 0.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ.</b> f(x) = 2x<sub>1</sub><sup>2</sup> + x<sub>1</sub>x<sub>2</sub> + x<sub>2</sub><sup>2</sup> + e<sup>x<sub>1</sub></sup>, tại x = (0,5; −1).</p>
<p>Bước 1 (gradient): ∂f/∂x<sub>1</sub> = 4x<sub>1</sub> + x<sub>2</sub> + e<sup>x<sub>1</sub></sup> = 2 − 1 + 1,6487 = 2,6487; ∂f/∂x<sub>2</sub> = x<sub>1</sub> + 2x<sub>2</sub> = −1,5. Bước 2 (Hessian): [[4 + e<sup>x<sub>1</sub></sup>, 1], [1, 2]]. Bước 3 (kiểm PSD): 4 + e<sup>0,5</sup> &gt; 0, 2 &gt; 0, det = 2(4 + e<sup>0,5</sup>) − 1 &gt; 0, nên Hessian xác định dương — tại điểm này và, vì e<sup>x<sub>1</sub></sup> &gt; 0, tại mọi điểm.</p></div>
<pre><code class="language-python">import numpy as np

def f(x):                       # f(x) = 2x1^2 + x1*x2 + x2^2 + exp(x1)
    return 2*x[0]**2 + x[0]*x[1] + x[1]**2 + np.exp(x[0])

def grad(x):
    return np.array([4*x[0] + x[1] + np.exp(x[0]), x[0] + 2*x[1]])

def hess(x):
    return np.array([[4 + np.exp(x[0]), 1.0], [1.0, 2.0]])

x = np.array([0.5, -1.0])
h = 1e-6
num = np.array([(f(x + h*e) - f(x - h*e)) / (2*h) for e in np.eye(2)])
print("analytic gradient :", grad(x).round(6))
print("numerical gradient:", num.round(6))
print("Hessian eigenvalues:", np.linalg.eigvalsh(hess(x)).round(4))
print("norms of v=(3,-4): l1 =", np.abs([3, -4]).sum(),
      " l2 =", np.linalg.norm([3, -4]), " linf =", np.abs([3, -4]).max())</code></pre>
<div class="out">analytic gradient : [ 2.648721 -1.5     ]
numerical gradient: [ 2.648721 -1.5     ]
Hessian eigenvalues: [1.7439 5.9048]
norms of v=(3,-4): l1 = 7  l2 = 5.0  linf = 4</div>
<p>Gradient sai phân trung tâm khớp công thức tới sáu chữ số thập phân — luôn chạy phép kiểm này trước khi tin một gradient tính tay đặt vào thuật toán.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết ∇(x<sup>T</sup>Px) = Px: đúng là 2Px với P đối xứng.</li><li>Kiểm PSD chỉ bằng đường chéo: [[1, 2], [2, 1]] có đường chéo dương nhưng trị riêng −1 và 3.</li><li>Dùng <code>np.linalg.eig</code> cho ma trận đối xứng: hãy dùng <code>eigvalsh</code>, nhanh hơn và trả trị riêng thực, đã sắp xếp.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Chuẩn ℓ<sub>1</sub>, ℓ<sub>2</sub>, ℓ<sub>∞</sub>; quả cầu đơn vị là hình thoi, hình tròn, hình vuông.</li><li>Gradient = mô hình tuyến tính tốt nhất; −∇f là hướng giảm dốc nhất.</li><li>Hessian = độ cong; mô hình bậc hai của f.</li><li>P ⪰ 0 ⇔ mọi trị riêng ≥ 0 ⇔ v<sup>T</sup>Pv ≥ 0 với mọi v.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Definite_matrix" target="_blank" rel="noopener">Wikipedia — Definite matrix (ma trận PSD và PD)</a></li><li><a href="https://en.wikipedia.org/wiki/Hessian_matrix" target="_blank" rel="noopener">Wikipedia — Hessian matrix</a></li><li><a href="https://web.stanford.edu/~boyd/vmls/" target="_blank" rel="noopener">Boyd &amp; Vandenberghe — Introduction to Applied Linear Algebra (VMLS), sách miễn phí</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tính ‖x‖<sub>1</sub>, ‖x‖<sub>2</sub>, ‖x‖<sub>∞</sub> với x = (1, −2, 2).</li><li>Tìm ∇f và ∇<sup>2</sup>f của f(x) = ‖Ax − b‖<sub>2</sub><sup>2</sup>. Hessian có luôn PSD không?</li><li>Với giá trị nào của a thì [[2, a], [a, 2]] nửa xác định dương?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 5, 3, 2. 2) ∇f = 2A<sup>T</sup>(Ax − b), ∇<sup>2</sup>f = 2A<sup>T</sup>A; luôn PSD vì v<sup>T</sup>A<sup>T</sup>Av = ‖Av‖<sup>2</sup> ≥ 0. 3) Trị riêng 2 ± a, nên PSD khi và chỉ khi |a| ≤ 2 (tương đương det = 4 − a<sup>2</sup> ≥ 0).</p></div>`);

const c13 = L('cvo201-ts-1-3',
  '1.3 — Your first convex models in CVXPY: a linear program and a least-squares fit|||1.3 — Mô hình lồi đầu tiên với CVXPY: một quy hoạch tuyến tính và một bài khớp bình phương tối thiểu',
  'Hai lớp bài toán kinh điển (Boyd §1.2): bình phương tối thiểu có nghiệm đóng và LP giải bằng thuật toán; mô hình hoá trong CVXPY (Variable, Problem, solve, status); giải tay LP sản xuất bằng hình học đỉnh.',
  `<span class="eyebrow">CVO201 · Chapter 1 · Lesson 1.3</span>
<h2>Your first convex models in CVXPY</h2>
<p class="lead">Boyd's Chapter 1 starts with the two problem classes that were “solved” long before convex optimization had a name: least squares and linear programming. Today we model both in a few lines.</p>
<h3>🎯 Objectives</h3>
<ul><li>Recognise least squares and linear programs as optimization problems.</li><li>Write and solve a model in CVXPY: variables, objective, constraints, <code>solve()</code>, <code>status</code>.</li><li>Solve a two-variable LP by hand using the corner (vertex) idea.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Least squares</strong> is the problem minimise ‖Ax − b‖<sub>2</sub><sup>2</sup>. Setting the gradient 2A<sup>T</sup>(Ax − b) to zero gives the normal equations A<sup>T</sup>Ax = A<sup>T</sup>b (MAA102 Lesson 9.2), a closed-form solution computed in time about n<sup>2</sup>k for A ∈ ℝ<sup>k×n</sup>. It is a mature technology: if you can turn a problem into least squares, it is solved.</p>
<p>A <strong>linear program (LP)</strong> has a linear objective and linear constraints: minimise c<sup>T</sup>x subject to a<sub>i</sub><sup>T</sup>x ≤ b<sub>i</sub>. There is no formula for the solution, but simplex and interior-point methods solve LPs with thousands of variables and constraints in a fraction of a second. The feasible set is a polygon (a polyhedron in higher dimensions) and, when an optimum exists, it is attained at a corner — that is the geometric idea of the simplex method.</p>
<p>Both are special cases of convex optimization, and a <strong>modelling language</strong> such as CVXPY lets you write them almost as on paper. CVXPY checks that the problem is convex (by the DCP rules of Lesson 3.3), converts it to a standard form and calls a solver (Clarabel, OSQP, HiGHS, SCS…). The basic workflow is always the same: create <code>cp.Variable</code>s, build an objective with <code>cp.Minimize</code> or <code>cp.Maximize</code>, list constraints, call <code>prob.solve()</code>, then read <code>prob.status</code>, <code>prob.value</code> and <code>x.value</code>.</p>
<h3>✍️ Worked example — a production plan</h3>
<div class="callout"><p><b>Problem.</b> A workshop makes tables (profit 70) and chairs (profit 50). A table needs 4 h of carpentry and 2 h of painting; a chair needs 3 h and 1 h. There are 240 carpentry and 100 painting hours. Maximise profit.</p>
<p>Step 1 (model): maximise 70x<sub>1</sub> + 50x<sub>2</sub> s.t. 4x<sub>1</sub> + 3x<sub>2</sub> ≤ 240, 2x<sub>1</sub> + x<sub>2</sub> ≤ 100, x ≥ 0. Step 2 (corners): the feasible polygon has vertices (0, 0), (50, 0), (0, 80) and the intersection of the two lines: from 2x<sub>1</sub> + x<sub>2</sub> = 100 we get x<sub>2</sub> = 100 − 2x<sub>1</sub>; substituting, 4x<sub>1</sub> + 300 − 6x<sub>1</sub> = 240 ⇒ x<sub>1</sub> = 30, x<sub>2</sub> = 40. Step 3 (evaluate): profits 0, 3500, 4000 and 70·30 + 50·40 = <b>4100</b>. The best plan is 30 tables and 40 chairs.</p></div>
<pre><code class="language-python">import cvxpy as cp
import numpy as np

# Production plan: tables (x1) and chairs (x2)
x = cp.Variable(2)
profit = 70*x[0] + 50*x[1]
constraints = [4*x[0] + 3*x[1] &lt;= 240,   # carpentry hours
               2*x[0] + 1*x[1] &lt;= 100,   # painting hours
               x &gt;= 0]
prob = cp.Problem(cp.Maximize(profit), constraints)
prob.solve()
print("status:", prob.status)
print("optimal plan x* =", x.value.round(4))
print("max profit      =", round(prob.value, 4))

# Least squares: fit y ~ a + b t
t = np.array([0, 1, 2, 3, 4.0]); y = np.array([1.1, 2.9, 5.2, 7.1, 8.8])
A = np.column_stack([np.ones_like(t), t])
w = cp.Variable(2)
cp.Problem(cp.Minimize(cp.sum_squares(A @ w - y))).solve()
print("cvxpy  (a, b) =", w.value.round(4))
print("lstsq  (a, b) =", np.linalg.lstsq(A, y, rcond=None)[0].round(4))</code></pre>
<div class="out">status: optimal
optimal plan x* = [30. 40.]
max profit      = 4100.0
cvxpy  (a, b) = [1.1  1.96]
lstsq  (a, b) = [1.1  1.96]</div>
<p>CVXPY reproduces the hand answer, and its least-squares fit y ≈ 1.1 + 1.96t matches <code>np.linalg.lstsq</code> exactly — a convex modelling tool reduces to the classical formula when the classical formula exists.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Reading <code>x.value</code> without checking <code>prob.status</code>. If the status is <code>infeasible</code> or <code>unbounded</code>, the values are <code>None</code> or meaningless.</li><li>Writing Python's <code>and</code> or chained comparisons like <code>0 &lt;= x &lt;= 1</code> inside constraints — write two separate constraints.</li><li>Using <code>*</code> for matrix–vector products in CVXPY: use <code>@</code>; <code>*</code> is only for scalars and <code>cp.multiply</code> is elementwise.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Least squares: closed form A<sup>T</sup>Ax = A<sup>T</sup>b; LP: no formula, but fast reliable algorithms.</li><li>An LP optimum, when it exists, is attained at a vertex of the feasible polyhedron.</li><li>CVXPY workflow: Variable → objective → constraints → solve → check status → read values.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.cvxpy.org/tutorial/intro/index.html" target="_blank" rel="noopener">CVXPY tutorial — What is CVXPY?</a></li><li><a href="https://www.cvxpy.org/examples/basic/linear_program.html" target="_blank" rel="noopener">CVXPY example — Linear program</a></li><li><a href="https://www.cvxpy.org/examples/basic/least_squares.html" target="_blank" rel="noopener">CVXPY example — Least-squares</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>In the production plan, painting hours rise to 120. Find the new optimal plan by checking corners.</li><li>Fit y = a + bt to the points (0, 1), (1, 3), (2, 4) using the normal equations.</li><li>What does CVXPY report for “maximise x subject to x ≥ 0” and why?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Corners: (0, 80) → 4000; (60, 0) → 4200; the lines 4x<sub>1</sub> + 3x<sub>2</sub> = 240 and 2x<sub>1</sub> + x<sub>2</sub> = 120 meet at x<sub>1</sub> = 60, x<sub>2</sub> = 0, the same corner. Best: 60 tables, profit 4200. 2) A<sup>T</sup>A = [[3, 3], [3, 5]], A<sup>T</sup>y = (8, 11); solving gives b = 1.5, a = 7/6 ≈ 1.167. 3) Status <code>unbounded</code> and value +∞ for a maximisation: x can grow forever.</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 1 · Bài 1.3</span>
<h2>Mô hình lồi đầu tiên với CVXPY</h2>
<p class="lead">Chương 1 của Boyd mở đầu bằng hai lớp bài toán đã được “giải xong” từ lâu trước khi tối ưu lồi có tên: bình phương tối thiểu và quy hoạch tuyến tính. Hôm nay ta mô hình hoá cả hai trong vài dòng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận ra bình phương tối thiểu và quy hoạch tuyến tính là bài toán tối ưu.</li><li>Viết và giải mô hình trong CVXPY: biến, mục tiêu, ràng buộc, <code>solve()</code>, <code>status</code>.</li><li>Giải tay một LP hai biến bằng ý tưởng đỉnh (góc).</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Bình phương tối thiểu</strong> là bài toán cực tiểu ‖Ax − b‖<sub>2</sub><sup>2</sup>. Cho gradient 2A<sup>T</sup>(Ax − b) bằng 0 ta được hệ phương trình chuẩn A<sup>T</sup>Ax = A<sup>T</sup>b (MAA102 Bài 9.2), nghiệm dạng đóng, tính trong thời gian cỡ n<sup>2</sup>k với A ∈ ℝ<sup>k×n</sup>. Đây là công nghệ đã chín: nếu biến được bài toán thành bình phương tối thiểu thì coi như đã giải xong.</p>
<p><strong>Quy hoạch tuyến tính (LP)</strong> có mục tiêu tuyến tính và ràng buộc tuyến tính: cực tiểu c<sup>T</sup>x với a<sub>i</sub><sup>T</sup>x ≤ b<sub>i</sub>. Không có công thức nghiệm, nhưng phương pháp đơn hình và điểm trong giải LP hàng nghìn biến và ràng buộc trong chưa tới một giây. Miền khả thi là một đa giác (đa diện ở chiều cao hơn) và khi có tối ưu, nó đạt tại một đỉnh — đó là ý tưởng hình học của phương pháp đơn hình.</p>
<p>Cả hai đều là trường hợp riêng của tối ưu lồi, và một <strong>ngôn ngữ mô hình hoá</strong> như CVXPY cho bạn viết chúng gần như trên giấy. CVXPY kiểm bài toán có lồi không (theo luật DCP ở Bài 3.3), chuyển về dạng chuẩn và gọi bộ giải (Clarabel, OSQP, HiGHS, SCS…). Quy trình luôn giống nhau: tạo <code>cp.Variable</code>, dựng mục tiêu bằng <code>cp.Minimize</code> hoặc <code>cp.Maximize</code>, liệt kê ràng buộc, gọi <code>prob.solve()</code>, rồi đọc <code>prob.status</code>, <code>prob.value</code> và <code>x.value</code>.</p>
<h3>✍️ Ví dụ giải từng bước — kế hoạch sản xuất</h3>
<div class="callout"><p><b>Bài toán.</b> Một xưởng làm bàn (lãi 70) và ghế (lãi 50). Một bàn cần 4 giờ mộc và 2 giờ sơn; một ghế cần 3 giờ và 1 giờ. Có 240 giờ mộc và 100 giờ sơn. Cực đại lợi nhuận.</p>
<p>Bước 1 (mô hình): cực đại 70x<sub>1</sub> + 50x<sub>2</sub> với 4x<sub>1</sub> + 3x<sub>2</sub> ≤ 240, 2x<sub>1</sub> + x<sub>2</sub> ≤ 100, x ≥ 0. Bước 2 (các đỉnh): đa giác khả thi có đỉnh (0, 0), (50, 0), (0, 80) và giao điểm hai đường: từ 2x<sub>1</sub> + x<sub>2</sub> = 100 được x<sub>2</sub> = 100 − 2x<sub>1</sub>; thế vào, 4x<sub>1</sub> + 300 − 6x<sub>1</sub> = 240 ⇒ x<sub>1</sub> = 30, x<sub>2</sub> = 40. Bước 3 (tính giá trị): lãi 0, 3500, 4000 và 70·30 + 50·40 = <b>4100</b>. Kế hoạch tốt nhất là 30 bàn và 40 ghế.</p></div>
<pre><code class="language-python">import cvxpy as cp
import numpy as np

# Production plan: tables (x1) and chairs (x2)
x = cp.Variable(2)
profit = 70*x[0] + 50*x[1]
constraints = [4*x[0] + 3*x[1] &lt;= 240,   # carpentry hours
               2*x[0] + 1*x[1] &lt;= 100,   # painting hours
               x &gt;= 0]
prob = cp.Problem(cp.Maximize(profit), constraints)
prob.solve()
print("status:", prob.status)
print("optimal plan x* =", x.value.round(4))
print("max profit      =", round(prob.value, 4))

# Least squares: fit y ~ a + b t
t = np.array([0, 1, 2, 3, 4.0]); y = np.array([1.1, 2.9, 5.2, 7.1, 8.8])
A = np.column_stack([np.ones_like(t), t])
w = cp.Variable(2)
cp.Problem(cp.Minimize(cp.sum_squares(A @ w - y))).solve()
print("cvxpy  (a, b) =", w.value.round(4))
print("lstsq  (a, b) =", np.linalg.lstsq(A, y, rcond=None)[0].round(4))</code></pre>
<div class="out">status: optimal
optimal plan x* = [30. 40.]
max profit      = 4100.0
cvxpy  (a, b) = [1.1  1.96]
lstsq  (a, b) = [1.1  1.96]</div>
<p>CVXPY cho lại đúng đáp án tính tay, và đường khớp bình phương tối thiểu y ≈ 1,1 + 1,96t trùng khít <code>np.linalg.lstsq</code> — công cụ mô hình lồi quy về công thức cổ điển khi công thức cổ điển tồn tại.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đọc <code>x.value</code> mà không kiểm <code>prob.status</code>. Nếu trạng thái là <code>infeasible</code> hay <code>unbounded</code> thì giá trị là <code>None</code> hoặc vô nghĩa.</li><li>Viết <code>and</code> của Python hay so sánh nối chuỗi kiểu <code>0 &lt;= x &lt;= 1</code> trong ràng buộc — hãy viết hai ràng buộc riêng.</li><li>Dùng <code>*</code> cho tích ma trận–vectơ trong CVXPY: dùng <code>@</code>; <code>*</code> chỉ cho vô hướng, còn <code>cp.multiply</code> là nhân từng phần tử.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Bình phương tối thiểu: nghiệm đóng A<sup>T</sup>Ax = A<sup>T</sup>b; LP: không có công thức nhưng có thuật toán nhanh, tin cậy.</li><li>Tối ưu của LP (nếu có) đạt tại một đỉnh của đa diện khả thi.</li><li>Quy trình CVXPY: Variable → mục tiêu → ràng buộc → solve → kiểm status → đọc giá trị.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.cvxpy.org/tutorial/intro/index.html" target="_blank" rel="noopener">Hướng dẫn CVXPY — What is CVXPY?</a></li><li><a href="https://www.cvxpy.org/examples/basic/linear_program.html" target="_blank" rel="noopener">Ví dụ CVXPY — Linear program</a></li><li><a href="https://www.cvxpy.org/examples/basic/least_squares.html" target="_blank" rel="noopener">Ví dụ CVXPY — Least-squares</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Trong kế hoạch sản xuất, giờ sơn tăng lên 120. Tìm kế hoạch tối ưu mới bằng cách kiểm các đỉnh.</li><li>Khớp y = a + bt với các điểm (0, 1), (1, 3), (2, 4) bằng hệ phương trình chuẩn.</li><li>CVXPY báo gì cho “cực đại x với x ≥ 0” và vì sao?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Các đỉnh: (0, 80) → 4000; (60, 0) → 4200; hai đường 4x<sub>1</sub> + 3x<sub>2</sub> = 240 và 2x<sub>1</sub> + x<sub>2</sub> = 120 cắt nhau tại x<sub>1</sub> = 60, x<sub>2</sub> = 0, cùng đỉnh đó. Tốt nhất: 60 bàn, lãi 4200. 2) A<sup>T</sup>A = [[3, 3], [3, 5]], A<sup>T</sup>y = (8, 11); giải ra b = 1,5, a = 7/6 ≈ 1,167. 3) Trạng thái <code>unbounded</code>, giá trị +∞ với bài cực đại: x tăng mãi được.</p></div>`);

const q1 = QZ(1, 'Quiz — Chapter 1: Optimization problems and the toolkit|||Quiz — Chương 1: Bài toán tối ưu và bộ công cụ',
  'Kiểm tra dạng chuẩn, p*, khả thi, cực trị địa phương/toàn cục, chuẩn, gradient, Hessian, PSD, quy trình CVXPY.', [
  Q('q1', 'In standard form, the constraint x₁ + x₂ ≥ 4 is written as|||Ở dạng chuẩn, ràng buộc x₁ + x₂ ≥ 4 được viết là',
    ['x₁ + x₂ − 4 ≤ 0|||x₁ + x₂ − 4 ≤ 0', '4 − x₁ − x₂ ≤ 0|||4 − x₁ − x₂ ≤ 0', 'x₁ + x₂ − 4 = 0|||x₁ + x₂ − 4 = 0', '−x₁ − x₂ − 4 ≤ 0|||−x₁ − x₂ − 4 ≤ 0'], 1,
    'Move everything to the left so that the inequality reads “≤ 0”.|||Chuyển hết sang trái để bất đẳng thức có dạng “≤ 0”.'),
  Q('q2', 'An infeasible minimisation problem has optimal value|||Bài toán cực tiểu vô nghiệm có giá trị tối ưu',
    ['p* = 0|||p* = 0', 'p* = −∞|||p* = −∞', 'p* = +∞|||p* = +∞', 'undefined|||không xác định'], 2,
    'The infimum over an empty set is +∞ by convention.|||Infimum trên tập rỗng quy ước là +∞.'),
  Q('q3', 'minimise e^x over x ∈ ℝ has|||Bài cực tiểu e^x trên x ∈ ℝ có',
    ['p* = 0 attained at x = 0|||p* = 0 đạt tại x = 0', 'p* = 0 but no optimal point|||p* = 0 nhưng không có điểm tối ưu', 'p* = −∞|||p* = −∞', 'p* = 1|||p* = 1'], 1,
    'e^x → 0 as x → −∞ but never equals 0.|||e^x → 0 khi x → −∞ nhưng không bao giờ bằng 0.'),
  Q('q4', 'For a general nonconvex function, scipy.optimize.minimize guarantees|||Với hàm không lồi tổng quát, scipy.optimize.minimize bảo đảm',
    ['a global minimum|||cực tiểu toàn cục', 'at best a local minimum (stationary point)|||nhiều nhất là cực tiểu địa phương (điểm dừng)', 'the exact optimal value|||giá trị tối ưu chính xác', 'nothing — it always fails|||không gì — nó luôn thất bại'], 1,
    'Local methods only see the neighbourhood of their iterates.|||Phương pháp địa phương chỉ thấy lân cận của các điểm lặp.'),
  Q('q5', 'For x = (3, −4): ‖x‖₁, ‖x‖₂, ‖x‖∞ equal|||Với x = (3, −4): ‖x‖₁, ‖x‖₂, ‖x‖∞ bằng',
    ['7, 5, 4|||7, 5, 4', '7, 25, 4|||7, 25, 4', '1, 5, 3|||1, 5, 3', '5, 7, 4|||5, 7, 4'], 0,
    '|3| + |−4| = 7, √(9 + 16) = 5, max = 4.|||3 + 4 = 7, √(9 + 16) = 5, max = 4.'),
  Q('q6', 'The gradient of f(x) = xᵀPx with P symmetric is|||Gradient của f(x) = xᵀPx với P đối xứng là',
    ['Px|||Px', '2Px|||2Px', 'xᵀP|||xᵀP', 'P|||P'], 1,
    '∇(xᵀPx) = (P + Pᵀ)x = 2Px.|||∇(xᵀPx) = (P + Pᵀ)x = 2Px.'),
  Q('q7', 'Which matrix is positive semidefinite?|||Ma trận nào nửa xác định dương?',
    ['[[1, 2], [2, 1]]|||[[1, 2], [2, 1]]', '[[2, 1], [1, 2]]|||[[2, 1], [1, 2]]', '[[−1, 0], [0, 3]]|||[[−1, 0], [0, 3]]', '[[0, 1], [1, 0]]|||[[0, 1], [1, 0]]'], 1,
    'Eigenvalues 1 and 3 are both ≥ 0; the others have a negative eigenvalue.|||Trị riêng 1 và 3 đều ≥ 0; các ma trận khác có trị riêng âm.'),
  Q('q8', 'The Hessian of ‖Ax − b‖₂² is|||Hessian của ‖Ax − b‖₂² là',
    ['2Aᵀ(Ax − b)|||2Aᵀ(Ax − b)', 'AAᵀ|||AAᵀ', '2AᵀA|||2AᵀA', 'A|||A'], 2,
    'Differentiate 2Aᵀ(Ax − b) once more; 2AᵀA is always PSD.|||Lấy đạo hàm 2Aᵀ(Ax − b) thêm lần nữa; 2AᵀA luôn PSD.'),
  Q('q9', 'When a linear program has an optimal solution, one is always found|||Khi một LP có nghiệm tối ưu, luôn có một nghiệm nằm',
    ['at the centroid of the feasible set|||ở trọng tâm miền khả thi', 'at a vertex of the feasible polyhedron|||tại một đỉnh của đa diện khả thi', 'where the gradient is zero|||nơi gradient bằng 0', 'at the origin|||tại gốc toạ độ'], 1,
    'A linear objective is extremised at a corner — the basis of the simplex method.|||Mục tiêu tuyến tính đạt cực trị tại một góc — cơ sở của phương pháp đơn hình.'),
  Q('q10', 'In CVXPY, after prob.solve() the FIRST thing to check is|||Trong CVXPY, sau prob.solve() điều cần kiểm ĐẦU TIÊN là',
    ['x.value|||x.value', 'prob.status|||prob.status', 'the solver name|||tên bộ giải', 'the number of constraints|||số ràng buộc'], 1,
    'Values are meaningful only when the status is optimal.|||Giá trị chỉ có nghĩa khi trạng thái là optimal.'),
]);

const ch1 = {
  title: 'Chapter 1 — Optimization problems and the mathematical toolkit|||Chương 1 — Bài toán tối ưu và bộ công cụ toán',
  description: 'Dạng chuẩn, khả thi, p*, cực trị địa phương/toàn cục; chuẩn, gradient, Hessian, ma trận PSD; mô hình LP và bình phương tối thiểu đầu tiên bằng CVXPY (Boyd Ch. 1, §4.1 · EE364a bài 1).',
  lessons: [c11, c12, c13, q1],
};


// ───────────────────────────── Chương 2 — Tập lồi ─────────────────────────────
const c21 = L('cvo201-ts-2-1',
  '2.1 — Affine sets, convex sets, convex combinations and convex hulls|||2.1 — Tập affine, tập lồi, tổ hợp lồi và bao lồi',
  'Đường thẳng và đoạn thẳng, tập affine, tập lồi, tổ hợp lồi, bao lồi, nón và tổ hợp nón (Boyd §2.1); kiểm điểm trong bao lồi bằng scipy.spatial.ConvexHull.',
  `<span class="eyebrow">CVO201 · Chapter 2 · Lesson 2.1</span>
<h2>Affine sets, convex sets, convex combinations and convex hulls</h2>
<p class="lead">Convexity starts with one picture: a set is convex if the straight segment between any two of its points stays inside it. Everything in the course grows from this definition.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define lines, segments, affine sets and convex sets.</li><li>Form convex combinations and the convex hull of a finite set of points.</li><li>Define cones and convex cones.</li><li>Decide whether a given set is convex, and prove it from the definition.</li></ul>
<h3>📖 Lecture</h3>
<p>For two points x<sub>1</sub>, x<sub>2</sub> ∈ ℝ<sup>n</sup>, the points θx<sub>1</sub> + (1 − θ)x<sub>2</sub> form the whole <strong>line</strong> through them when θ ranges over ℝ, and the <strong>segment</strong> between them when 0 ≤ θ ≤ 1.</p>
<div class="formula"><span class="lbl">Definitions (Boyd §2.1)</span>affine set: x<sub>1</sub>, x<sub>2</sub> ∈ C, θ ∈ ℝ ⇒ θx<sub>1</sub> + (1 − θ)x<sub>2</sub> ∈ C<br>convex set: x<sub>1</sub>, x<sub>2</sub> ∈ C, 0 ≤ θ ≤ 1 ⇒ θx<sub>1</sub> + (1 − θ)x<sub>2</sub> ∈ C<br>convex cone: x<sub>1</sub>, x<sub>2</sub> ∈ C, θ<sub>1</sub>, θ<sub>2</sub> ≥ 0 ⇒ θ<sub>1</sub>x<sub>1</sub> + θ<sub>2</sub>x<sub>2</sub> ∈ C</div>
<p>The solution set of a linear system {x : Ax = b} is the standard example of an affine set: if Ax<sub>1</sub> = b and Ax<sub>2</sub> = b then A(θx<sub>1</sub> + (1 − θ)x<sub>2</sub>) = θb + (1 − θ)b = b. Every affine set is convex, but not conversely: a disc is convex, not affine.</p>
<p>A <strong>convex combination</strong> of points x<sub>1</sub>, …, x<sub>k</sub> is θ<sub>1</sub>x<sub>1</sub> + … + θ<sub>k</sub>x<sub>k</sub> with θ<sub>i</sub> ≥ 0 and ∑θ<sub>i</sub> = 1 — a weighted average. A set is convex exactly when it contains all convex combinations of its points. The <strong>convex hull</strong> conv S is the set of all convex combinations of points of S; it is the smallest convex set containing S (think of a rubber band stretched around nails). A <strong>conic combination</strong> drops the condition ∑θ<sub>i</sub> = 1 and keeps θ<sub>i</sub> ≥ 0; a convex cone is closed under conic combinations, like the nonnegative orthant ℝ<sup>n</sup><sub>+</sub>.</p>
<p>Why do optimizers care? A weighted average of two feasible plans should still be feasible — that is exactly convexity of the feasible set, and it is what lets algorithms move along segments without falling out of the feasible region.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example 1 — hull of seven points.</b> Points (0,0), (4,0), (4,3), (0,3), (2,1), (1,2), (3,2.5). The first four are the corners of a 4 × 3 rectangle and the other three lie inside it, so the convex hull is the rectangle, with area 12. The convex combination 0.1·(0,0) + 0.2·(4,0) + 0.3·(4,3) + 0.4·(0,3) = (0.8 + 1.2, 0.9 + 1.2) = (2, 2.1) lies inside, as it must.</p>
<p><b>Example 2 — a nonconvex set.</b> The ring {x : 1 ≤ ‖x‖<sub>2</sub> ≤ 2} contains (1.5, 0) and (−1.5, 0), but their midpoint (0, 0) has norm 0 &lt; 1. One counterexample is enough to prove nonconvexity.</p></div>
<pre><code class="language-python">import numpy as np
from scipy.spatial import ConvexHull

pts = np.array([[0, 0], [4, 0], [4, 3], [0, 3], [2, 1], [1, 2], [3, 2.5]])
hull = ConvexHull(pts)
print("hull vertices (indices):", sorted(hull.vertices.tolist()))
print("hull area:", hull.volume)          # in 2-D, .volume is the area

# a convex combination of the 4 corners with weights summing to 1
theta = np.array([0.1, 0.2, 0.3, 0.4])
z = theta @ pts[:4]
print("weights sum to", theta.sum(), "-&gt; point", z)

# inside test: a point is in the hull iff A z + b &lt;= 0 for every facet
inside = lambda p: bool(np.all(hull.equations[:, :2] @ p + hull.equations[:, 2] &lt;= 1e-12))
print("z inside hull?", inside(z), "| (5, 1) inside?", inside(np.array([5.0, 1.0])))</code></pre>
<div class="out">hull vertices (indices): [0, 1, 2, 3]
hull area: 12.0
weights sum to 1.0 -&gt; point [2.  2.1]
z inside hull? True | (5, 1) inside? False</div>
<p><code>ConvexHull</code> returns the hull as a list of facets a<sup>T</sup>x + b ≤ 0 — the convex hull of finitely many points is a polyhedron, the set type of Lesson 2.2.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Checking convexity with only two “nice” points. You must show the segment property for <em>all</em> pairs — or find one pair that fails.</li><li>Forgetting the weights must be nonnegative <em>and</em> sum to one; (2, −1) weights give a point on the line but outside the segment.</li><li>Thinking a union of convex sets is convex: two disjoint discs are not.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Convex: contains every segment between its points; affine: contains every line.</li><li>Convex combination = weights θ<sub>i</sub> ≥ 0 summing to 1.</li><li>conv S = smallest convex set containing S.</li><li>Convex cone: closed under nonnegative combinations.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://web.stanford.edu/class/ee364a/lectures/sets.pdf" target="_blank" rel="noopener">Stanford EE364a — Lecture 2: Convex sets (slides)</a></li><li><a href="https://en.wikipedia.org/wiki/Convex_set" target="_blank" rel="noopener">Wikipedia — Convex set</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.ConvexHull.html" target="_blank" rel="noopener">SciPy — scipy.spatial.ConvexHull</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Is the set {(x, y) : y ≥ x<sup>2</sup>} convex? Is {(x, y) : y ≤ x<sup>2</sup>}?</li><li>Show that the intersection of two convex sets is convex.</li><li>Write the point (1, 1) as a convex combination of (0, 0), (2, 0) and (0, 2).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) The first (region above a parabola, an epigraph of a convex function) is convex; the second is not — (−1, 1) and (1, 1) belong to it but the midpoint (0, 1) has 1 &gt; 0<sup>2</sup>. 2) If x<sub>1</sub>, x<sub>2</sub> lie in both sets, the segment lies in each set, hence in the intersection. 3) (1, 1) = 0·(0, 0) + ½·(2, 0) + ½·(0, 2).</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 2 · Bài 2.1</span>
<h2>Tập affine, tập lồi, tổ hợp lồi và bao lồi</h2>
<p class="lead">Tính lồi bắt đầu từ một hình ảnh: một tập là lồi nếu đoạn thẳng nối hai điểm bất kỳ của nó nằm trọn bên trong. Mọi thứ trong môn đều mọc ra từ định nghĩa này.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa đường thẳng, đoạn thẳng, tập affine và tập lồi.</li><li>Lập tổ hợp lồi và bao lồi của một tập hữu hạn điểm.</li><li>Định nghĩa nón và nón lồi.</li><li>Xác định một tập có lồi không, và chứng minh từ định nghĩa.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Với hai điểm x<sub>1</sub>, x<sub>2</sub> ∈ ℝ<sup>n</sup>, các điểm θx<sub>1</sub> + (1 − θ)x<sub>2</sub> tạo thành cả <strong>đường thẳng</strong> qua chúng khi θ chạy trên ℝ, và <strong>đoạn thẳng</strong> nối chúng khi 0 ≤ θ ≤ 1.</p>
<div class="formula"><span class="lbl">Định nghĩa (Boyd §2.1)</span>tập affine: x<sub>1</sub>, x<sub>2</sub> ∈ C, θ ∈ ℝ ⇒ θx<sub>1</sub> + (1 − θ)x<sub>2</sub> ∈ C<br>tập lồi: x<sub>1</sub>, x<sub>2</sub> ∈ C, 0 ≤ θ ≤ 1 ⇒ θx<sub>1</sub> + (1 − θ)x<sub>2</sub> ∈ C<br>nón lồi: x<sub>1</sub>, x<sub>2</sub> ∈ C, θ<sub>1</sub>, θ<sub>2</sub> ≥ 0 ⇒ θ<sub>1</sub>x<sub>1</sub> + θ<sub>2</sub>x<sub>2</sub> ∈ C</div>
<p>Tập nghiệm của hệ tuyến tính {x : Ax = b} là ví dụ chuẩn của tập affine: nếu Ax<sub>1</sub> = b và Ax<sub>2</sub> = b thì A(θx<sub>1</sub> + (1 − θ)x<sub>2</sub>) = θb + (1 − θ)b = b. Mọi tập affine đều lồi, nhưng ngược lại thì không: hình tròn lồi mà không affine.</p>
<p><strong>Tổ hợp lồi</strong> của các điểm x<sub>1</sub>, …, x<sub>k</sub> là θ<sub>1</sub>x<sub>1</sub> + … + θ<sub>k</sub>x<sub>k</sub> với θ<sub>i</sub> ≥ 0 và ∑θ<sub>i</sub> = 1 — một trung bình có trọng số. Một tập là lồi đúng khi nó chứa mọi tổ hợp lồi của các điểm của nó. <strong>Bao lồi</strong> conv S là tập mọi tổ hợp lồi của các điểm thuộc S; nó là tập lồi nhỏ nhất chứa S (hình dung sợi dây chun căng quanh các cái đinh). <strong>Tổ hợp nón</strong> bỏ điều kiện ∑θ<sub>i</sub> = 1 và giữ θ<sub>i</sub> ≥ 0; nón lồi đóng với tổ hợp nón, như góc phần tư không âm ℝ<sup>n</sup><sub>+</sub>.</p>
<p>Vì sao người làm tối ưu quan tâm? Trung bình có trọng số của hai kế hoạch khả thi cũng phải khả thi — đó chính là tính lồi của miền khả thi, và nhờ nó thuật toán di chuyển dọc các đoạn thẳng mà không rơi ra khỏi miền.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — bao lồi của bảy điểm.</b> Các điểm (0,0), (4,0), (4,3), (0,3), (2,1), (1,2), (3;2,5). Bốn điểm đầu là góc của hình chữ nhật 4 × 3, ba điểm còn lại nằm trong nó, nên bao lồi là hình chữ nhật, diện tích 12. Tổ hợp lồi 0,1·(0,0) + 0,2·(4,0) + 0,3·(4,3) + 0,4·(0,3) = (0,8 + 1,2; 0,9 + 1,2) = (2; 2,1) nằm bên trong, đúng như phải thế.</p>
<p><b>Ví dụ 2 — một tập không lồi.</b> Hình vành khăn {x : 1 ≤ ‖x‖<sub>2</sub> ≤ 2} chứa (1,5; 0) và (−1,5; 0), nhưng trung điểm (0, 0) có chuẩn 0 &lt; 1. Một phản ví dụ là đủ chứng minh không lồi.</p></div>
<pre><code class="language-python">import numpy as np
from scipy.spatial import ConvexHull

pts = np.array([[0, 0], [4, 0], [4, 3], [0, 3], [2, 1], [1, 2], [3, 2.5]])
hull = ConvexHull(pts)
print("hull vertices (indices):", sorted(hull.vertices.tolist()))
print("hull area:", hull.volume)          # in 2-D, .volume is the area

# a convex combination of the 4 corners with weights summing to 1
theta = np.array([0.1, 0.2, 0.3, 0.4])
z = theta @ pts[:4]
print("weights sum to", theta.sum(), "-&gt; point", z)

# inside test: a point is in the hull iff A z + b &lt;= 0 for every facet
inside = lambda p: bool(np.all(hull.equations[:, :2] @ p + hull.equations[:, 2] &lt;= 1e-12))
print("z inside hull?", inside(z), "| (5, 1) inside?", inside(np.array([5.0, 1.0])))</code></pre>
<div class="out">hull vertices (indices): [0, 1, 2, 3]
hull area: 12.0
weights sum to 1.0 -&gt; point [2.  2.1]
z inside hull? True | (5, 1) inside? False</div>
<p><code>ConvexHull</code> trả bao lồi dưới dạng danh sách mặt a<sup>T</sup>x + b ≤ 0 — bao lồi của hữu hạn điểm là một đa diện, loại tập ở Bài 2.2.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Kiểm tính lồi chỉ với hai điểm “đẹp”. Phải chứng minh tính chất đoạn thẳng cho <em>mọi</em> cặp điểm — hoặc tìm một cặp làm hỏng.</li><li>Quên rằng trọng số phải không âm <em>và</em> có tổng bằng một; trọng số (2, −1) cho điểm trên đường thẳng nhưng ngoài đoạn.</li><li>Nghĩ hợp của các tập lồi là lồi: hai hình tròn rời nhau thì không lồi.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Lồi: chứa mọi đoạn thẳng nối các điểm của nó; affine: chứa mọi đường thẳng.</li><li>Tổ hợp lồi = trọng số θ<sub>i</sub> ≥ 0 có tổng 1.</li><li>conv S = tập lồi nhỏ nhất chứa S.</li><li>Nón lồi: đóng với tổ hợp không âm.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://web.stanford.edu/class/ee364a/lectures/sets.pdf" target="_blank" rel="noopener">Stanford EE364a — Bài 2: Tập lồi (slide)</a></li><li><a href="https://en.wikipedia.org/wiki/Convex_set" target="_blank" rel="noopener">Wikipedia — Convex set</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.ConvexHull.html" target="_blank" rel="noopener">SciPy — scipy.spatial.ConvexHull</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tập {(x, y) : y ≥ x<sup>2</sup>} có lồi không? Còn {(x, y) : y ≤ x<sup>2</sup>}?</li><li>Chứng minh giao của hai tập lồi là lồi.</li><li>Viết điểm (1, 1) thành tổ hợp lồi của (0, 0), (2, 0) và (0, 2).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Tập thứ nhất (miền phía trên parabol, trên đồ thị của một hàm lồi) là lồi; tập thứ hai không — (−1, 1) và (1, 1) thuộc nó nhưng trung điểm (0, 1) có 1 &gt; 0<sup>2</sup>. 2) Nếu x<sub>1</sub>, x<sub>2</sub> thuộc cả hai tập thì đoạn nối chúng nằm trong từng tập, nên nằm trong giao. 3) (1, 1) = 0·(0, 0) + ½·(2, 0) + ½·(0, 2).</p></div>`);

const c22 = L('cvo201-ts-2-2',
  '2.2 — The important convex sets: hyperplanes, halfspaces, balls, ellipsoids, polyhedra and the PSD cone|||2.2 — Các tập lồi quan trọng: siêu phẳng, nửa không gian, quả cầu, ellipsoid, đa diện và nón PSD',
  'Siêu phẳng, nửa không gian, quả cầu chuẩn, ellipsoid, nón chuẩn, đa diện {x : Ax ≤ b}, nón ma trận nửa xác định dương S+ (Boyd §2.2); kiểm thuộc tập bằng numpy.',
  `<span class="eyebrow">CVO201 · Chapter 2 · Lesson 2.2</span>
<h2>The important convex sets</h2>
<p class="lead">A short catalogue of convex sets covers almost every constraint you will ever write. Learn them by heart — modelling is mostly recognising them.</p>
<h3>🎯 Objectives</h3>
<ul><li>Describe hyperplanes, halfspaces, norm balls, ellipsoids and polyhedra by formulas.</li><li>Prove convexity of a norm ball with the triangle inequality.</li><li>Define the positive semidefinite cone and test membership by eigenvalues.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">The catalogue (Boyd §2.2)</span>hyperplane {x : a<sup>T</sup>x = b}       halfspace {x : a<sup>T</sup>x ≤ b}   (a ≠ 0)<br>norm ball {x : ‖x − x<sub>c</sub>‖ ≤ r}       norm cone {(x, t) : ‖x‖ ≤ t}<br>ellipsoid {x : (x − x<sub>c</sub>)<sup>T</sup>P<sup>−1</sup>(x − x<sub>c</sub>) ≤ 1}, P ≻ 0<br>polyhedron {x : Ax ≤ b, Cx = d}       PSD cone S<sup>n</sup><sub>+</sub> = {X = X<sup>T</sup> : X ⪰ 0}</div>
<p>A <strong>hyperplane</strong> is the set where a linear function takes one value; a is its normal vector. It splits space into two <strong>halfspaces</strong>. Halfspaces are convex because a<sup>T</sup>(θx + (1 − θ)y) = θa<sup>T</sup>x + (1 − θ)a<sup>T</sup>y ≤ θb + (1 − θ)b = b.</p>
<p>A <strong>norm ball</strong> is convex for <em>any</em> norm: if ‖x − x<sub>c</sub>‖ ≤ r and ‖y − x<sub>c</sub>‖ ≤ r then ‖θx + (1 − θ)y − x<sub>c</sub>‖ ≤ θ‖x − x<sub>c</sub>‖ + (1 − θ)‖y − x<sub>c</sub>‖ ≤ r by the triangle inequality. The <strong>second-order cone</strong> {(x, t) : ‖x‖<sub>2</sub> ≤ t} — an ice-cream cone — is the set behind SOCP (Lesson 4.3).</p>
<p>An <strong>ellipsoid</strong> is the image of the unit ball under an affine map; the eigenvectors of P give its axes and √λ<sub>i</sub> its semi-axis lengths (compare MLT201 Lesson 9.3). A <strong>polyhedron</strong> is a finite intersection of halfspaces and hyperplanes — the feasible set of every LP. Bounded polyhedra are polytopes (the triangle, the cube, the probability simplex {x ≥ 0, 1<sup>T</sup>x = 1}).</p>
<p>The <strong>PSD cone</strong> S<sup>n</sup><sub>+</sub> lives in the space of symmetric matrices. It is a convex cone: if X, Y ⪰ 0 and θ<sub>1</sub>, θ<sub>2</sub> ≥ 0 then v<sup>T</sup>(θ<sub>1</sub>X + θ<sub>2</sub>Y)v = θ<sub>1</sub>v<sup>T</sup>Xv + θ<sub>2</sub>v<sup>T</sup>Yv ≥ 0. It is the feasible set of semidefinite programming (Lesson 4.4) and appears in ML as the set of valid covariance and kernel matrices.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — ellipsoid membership.</b> x<sub>c</sub> = (1, 2), P = diag(4, 1): semi-axes 2 (horizontal) and 1 (vertical). Is x = (2.5, 2) inside?</p>
<p>Step 1: x − x<sub>c</sub> = (1.5, 0). Step 2: P<sup>−1</sup> = diag(1/4, 1). Step 3: (x − x<sub>c</sub>)<sup>T</sup>P<sup>−1</sup>(x − x<sub>c</sub>) = 1.5<sup>2</sup>/4 = 0.5625 ≤ 1 ⇒ <b>inside</b>. For (1, 3.5): difference (0, 1.5), value 2.25 &gt; 1 ⇒ outside.</p>
<p><b>PSD test.</b> X<sub>1</sub> = [[2, 1], [1, 1]] has det 1 and trace 3, so both eigenvalues are positive: X<sub>1</sub> ⪰ 0. The matrix [[1, 2], [2, 1]] has det −3 &lt; 0, so one eigenvalue is negative: not in the cone.</p></div>
<pre><code class="language-python">import numpy as np

# Ellipsoid E = {x : (x - c)^T P^{-1} (x - c) &lt;= 1}
c = np.array([1.0, 2.0]); P = np.array([[4.0, 0.0], [0.0, 1.0]])
inE = lambda x: (x - c) @ np.linalg.solve(P, x - c) &lt;= 1
print("(2.5, 2) in E:", inE(np.array([2.5, 2.0])), "| (1, 3.5) in E:", inE(np.array([1.0, 3.5])))

# Polyhedron {x : A x &lt;= b}: the triangle x1 &gt;= 0, x2 &gt;= 0, x1 + x2 &lt;= 1
A = np.array([[-1, 0], [0, -1], [1, 1.0]]); b = np.array([0, 0, 1.0])
inPoly = lambda x: bool(np.all(A @ x &lt;= b + 1e-12))
print("(0.2, 0.3) in triangle:", inPoly(np.array([0.2, 0.3])), "| (0.8, 0.4):", inPoly(np.array([0.8, 0.4])))

# PSD cone: X is PSD iff all eigenvalues &gt;= 0; a mix of two PSD matrices stays PSD
X1 = np.array([[2.0, 1.0], [1.0, 1.0]]); X2 = np.array([[1.0, -1.0], [-1.0, 3.0]])
for name, M in [("X1", X1), ("X2", X2), ("0.3*X1+0.7*X2", 0.3*X1 + 0.7*X2),
                ("[[1,2],[2,1]]", np.array([[1.0, 2.0], [2.0, 1.0]]))]:
    print(f"{name:14s} eigenvalues = {np.linalg.eigvalsh(M).round(4)}")</code></pre>
<div class="out">(2.5, 2) in E: True | (1, 3.5) in E: False
(0.2, 0.3) in triangle: True | (0.8, 0.4): False
X1             eigenvalues = [0.382 2.618]
X2             eigenvalues = [0.5858 3.4142]
0.3*X1+0.7*X2  eigenvalues = [1.1699 2.5301]
[[1,2],[2,1]]  eigenvalues = [-1.  3.]</div>
<p>The mixture 0.3X<sub>1</sub> + 0.7X<sub>2</sub> stays in the cone, exactly as convexity predicts.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using P instead of P<sup>−1</sup> in the ellipsoid formula — the semi-axes are √λ(P), not 1/√λ(P).</li><li>Thinking {x : ‖x‖ ≥ 1} is convex: the outside of a ball is not.</li><li>Treating a non-symmetric matrix as an element of S<sup>n</sup><sub>+</sub>; PSD is defined for symmetric matrices only.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Halfspaces, hyperplanes, norm balls, norm cones, ellipsoids, polyhedra and S<sup>n</sup><sub>+</sub> are all convex.</li><li>Norm balls are convex by the triangle inequality.</li><li>Polyhedra = feasible sets of LPs; the PSD cone = feasible sets of SDPs.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf" target="_blank" rel="noopener">Boyd &amp; Vandenberghe — Convex Optimization, §2.2 Some important examples (free PDF)</a></li><li><a href="https://en.wikipedia.org/wiki/Convex_cone" target="_blank" rel="noopener">Wikipedia — Convex cone</a></li><li><a href="https://en.wikipedia.org/wiki/Ellipsoid" target="_blank" rel="noopener">Wikipedia — Ellipsoid</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Describe the probability simplex in ℝ<sup>3</sup> as a polyhedron {x : Ax ≤ b, Cx = d}.</li><li>Is (3, 4, 5) in the second-order cone {(x<sub>1</sub>, x<sub>2</sub>, t) : √(x<sub>1</sub><sup>2</sup> + x<sub>2</sub><sup>2</sup>) ≤ t}? Is (3, 4, 4)?</li><li>For which a, b is [[a, 1], [1, b]] in S<sup>2</sup><sub>+</sub>?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) A = −I, b = 0 (x ≥ 0), C = [1 1 1], d = 1. 2) √(9 + 16) = 5 ≤ 5: yes (on the boundary); 5 &gt; 4: no. 3) a ≥ 0, b ≥ 0 and ab ≥ 1.</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 2 · Bài 2.2</span>
<h2>Các tập lồi quan trọng</h2>
<p class="lead">Một danh mục ngắn các tập lồi bao gần hết mọi ràng buộc bạn sẽ viết. Hãy thuộc lòng — mô hình hoá phần lớn là nhận ra chúng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mô tả bằng công thức siêu phẳng, nửa không gian, quả cầu chuẩn, ellipsoid và đa diện.</li><li>Chứng minh quả cầu chuẩn lồi bằng bất đẳng thức tam giác.</li><li>Định nghĩa nón nửa xác định dương và kiểm thuộc nón bằng trị riêng.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Danh mục (Boyd §2.2)</span>siêu phẳng {x : a<sup>T</sup>x = b}       nửa không gian {x : a<sup>T</sup>x ≤ b}   (a ≠ 0)<br>quả cầu chuẩn {x : ‖x − x<sub>c</sub>‖ ≤ r}       nón chuẩn {(x, t) : ‖x‖ ≤ t}<br>ellipsoid {x : (x − x<sub>c</sub>)<sup>T</sup>P<sup>−1</sup>(x − x<sub>c</sub>) ≤ 1}, P ≻ 0<br>đa diện {x : Ax ≤ b, Cx = d}       nón PSD S<sup>n</sup><sub>+</sub> = {X = X<sup>T</sup> : X ⪰ 0}</div>
<p><strong>Siêu phẳng</strong> là tập nơi một hàm tuyến tính nhận một giá trị; a là vectơ pháp tuyến. Nó chia không gian thành hai <strong>nửa không gian</strong>. Nửa không gian lồi vì a<sup>T</sup>(θx + (1 − θ)y) = θa<sup>T</sup>x + (1 − θ)a<sup>T</sup>y ≤ θb + (1 − θ)b = b.</p>
<p><strong>Quả cầu chuẩn</strong> lồi với <em>mọi</em> chuẩn: nếu ‖x − x<sub>c</sub>‖ ≤ r và ‖y − x<sub>c</sub>‖ ≤ r thì ‖θx + (1 − θ)y − x<sub>c</sub>‖ ≤ θ‖x − x<sub>c</sub>‖ + (1 − θ)‖y − x<sub>c</sub>‖ ≤ r theo bất đẳng thức tam giác. <strong>Nón bậc hai</strong> {(x, t) : ‖x‖<sub>2</sub> ≤ t} — hình ốc quế kem — là tập đứng sau SOCP (Bài 4.3).</p>
<p><strong>Ellipsoid</strong> là ảnh của quả cầu đơn vị qua một phép affine; vectơ riêng của P cho các trục và √λ<sub>i</sub> cho độ dài bán trục (so với MLT201 Bài 9.3). <strong>Đa diện</strong> là giao hữu hạn các nửa không gian và siêu phẳng — miền khả thi của mọi LP. Đa diện bị chặn là đa đỉnh (polytope): tam giác, khối lập phương, đơn hình xác suất {x ≥ 0, 1<sup>T</sup>x = 1}.</p>
<p><strong>Nón PSD</strong> S<sup>n</sup><sub>+</sub> sống trong không gian các ma trận đối xứng. Nó là nón lồi: nếu X, Y ⪰ 0 và θ<sub>1</sub>, θ<sub>2</sub> ≥ 0 thì v<sup>T</sup>(θ<sub>1</sub>X + θ<sub>2</sub>Y)v = θ<sub>1</sub>v<sup>T</sup>Xv + θ<sub>2</sub>v<sup>T</sup>Yv ≥ 0. Nó là miền khả thi của quy hoạch nửa xác định (Bài 4.4) và xuất hiện trong học máy như tập các ma trận hiệp phương sai và ma trận kernel hợp lệ.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — thuộc ellipsoid.</b> x<sub>c</sub> = (1, 2), P = diag(4, 1): bán trục 2 (ngang) và 1 (dọc). Điểm x = (2,5; 2) có nằm trong không?</p>
<p>Bước 1: x − x<sub>c</sub> = (1,5; 0). Bước 2: P<sup>−1</sup> = diag(1/4, 1). Bước 3: (x − x<sub>c</sub>)<sup>T</sup>P<sup>−1</sup>(x − x<sub>c</sub>) = 1,5<sup>2</sup>/4 = 0,5625 ≤ 1 ⇒ <b>nằm trong</b>. Với (1; 3,5): hiệu (0; 1,5), giá trị 2,25 &gt; 1 ⇒ nằm ngoài.</p>
<p><b>Kiểm PSD.</b> X<sub>1</sub> = [[2, 1], [1, 1]] có det 1 và vết 3, nên cả hai trị riêng dương: X<sub>1</sub> ⪰ 0. Ma trận [[1, 2], [2, 1]] có det −3 &lt; 0, nên có một trị riêng âm: không thuộc nón.</p></div>
<pre><code class="language-python">import numpy as np

# Ellipsoid E = {x : (x - c)^T P^{-1} (x - c) &lt;= 1}
c = np.array([1.0, 2.0]); P = np.array([[4.0, 0.0], [0.0, 1.0]])
inE = lambda x: (x - c) @ np.linalg.solve(P, x - c) &lt;= 1
print("(2.5, 2) in E:", inE(np.array([2.5, 2.0])), "| (1, 3.5) in E:", inE(np.array([1.0, 3.5])))

# Polyhedron {x : A x &lt;= b}: the triangle x1 &gt;= 0, x2 &gt;= 0, x1 + x2 &lt;= 1
A = np.array([[-1, 0], [0, -1], [1, 1.0]]); b = np.array([0, 0, 1.0])
inPoly = lambda x: bool(np.all(A @ x &lt;= b + 1e-12))
print("(0.2, 0.3) in triangle:", inPoly(np.array([0.2, 0.3])), "| (0.8, 0.4):", inPoly(np.array([0.8, 0.4])))

# PSD cone: X is PSD iff all eigenvalues &gt;= 0; a mix of two PSD matrices stays PSD
X1 = np.array([[2.0, 1.0], [1.0, 1.0]]); X2 = np.array([[1.0, -1.0], [-1.0, 3.0]])
for name, M in [("X1", X1), ("X2", X2), ("0.3*X1+0.7*X2", 0.3*X1 + 0.7*X2),
                ("[[1,2],[2,1]]", np.array([[1.0, 2.0], [2.0, 1.0]]))]:
    print(f"{name:14s} eigenvalues = {np.linalg.eigvalsh(M).round(4)}")</code></pre>
<div class="out">(2.5, 2) in E: True | (1, 3.5) in E: False
(0.2, 0.3) in triangle: True | (0.8, 0.4): False
X1             eigenvalues = [0.382 2.618]
X2             eigenvalues = [0.5858 3.4142]
0.3*X1+0.7*X2  eigenvalues = [1.1699 2.5301]
[[1,2],[2,1]]  eigenvalues = [-1.  3.]</div>
<p>Hỗn hợp 0,3X<sub>1</sub> + 0,7X<sub>2</sub> vẫn ở trong nón, đúng như tính lồi dự đoán.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng P thay cho P<sup>−1</sup> trong công thức ellipsoid — bán trục là √λ(P), không phải 1/√λ(P).</li><li>Nghĩ {x : ‖x‖ ≥ 1} lồi: phần ngoài quả cầu không lồi.</li><li>Coi ma trận không đối xứng là phần tử của S<sup>n</sup><sub>+</sub>; PSD chỉ định nghĩa cho ma trận đối xứng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Nửa không gian, siêu phẳng, quả cầu chuẩn, nón chuẩn, ellipsoid, đa diện và S<sup>n</sup><sub>+</sub> đều lồi.</li><li>Quả cầu chuẩn lồi nhờ bất đẳng thức tam giác.</li><li>Đa diện = miền khả thi của LP; nón PSD = miền khả thi của SDP.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf" target="_blank" rel="noopener">Boyd &amp; Vandenberghe — Convex Optimization, §2.2 Some important examples (PDF miễn phí)</a></li><li><a href="https://en.wikipedia.org/wiki/Convex_cone" target="_blank" rel="noopener">Wikipedia — Convex cone</a></li><li><a href="https://en.wikipedia.org/wiki/Ellipsoid" target="_blank" rel="noopener">Wikipedia — Ellipsoid</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Mô tả đơn hình xác suất trong ℝ<sup>3</sup> dưới dạng đa diện {x : Ax ≤ b, Cx = d}.</li><li>(3, 4, 5) có thuộc nón bậc hai {(x<sub>1</sub>, x<sub>2</sub>, t) : √(x<sub>1</sub><sup>2</sup> + x<sub>2</sub><sup>2</sup>) ≤ t} không? Còn (3, 4, 4)?</li><li>Với a, b nào thì [[a, 1], [1, b]] thuộc S<sup>2</sup><sub>+</sub>?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) A = −I, b = 0 (x ≥ 0), C = [1 1 1], d = 1. 2) √(9 + 16) = 5 ≤ 5: có (nằm trên biên); 5 &gt; 4: không. 3) a ≥ 0, b ≥ 0 và ab ≥ 1.</p></div>`);

const c23 = L('cvo201-ts-2-3',
  '2.3 — Operations that preserve convexity, and separating & supporting hyperplanes|||2.3 — Phép toán bảo toàn tính lồi, siêu phẳng tách và siêu phẳng tựa',
  'Giao, ảnh/nghịch ảnh qua phép affine, tổng Minkowski (Boyd §2.3); định lý siêu phẳng tách và siêu phẳng tựa (Boyd §2.5); tìm siêu phẳng tách hai đám điểm bằng CVXPY — bước đầu tới SVM.',
  `<span class="eyebrow">CVO201 · Chapter 2 · Lesson 2.3</span>
<h2>Operations that preserve convexity; separating and supporting hyperplanes</h2>
<p class="lead">In practice we rarely prove convexity from the definition. We build complicated sets from the simple ones of Lesson 2.2 with operations that are known to preserve convexity — and we use hyperplanes to tell convex sets apart.</p>
<h3>🎯 Objectives</h3>
<ul><li>List the operations that preserve convexity of sets: intersection, affine image and preimage, Minkowski sum.</li><li>State the separating and supporting hyperplane theorems.</li><li>Compute a separating hyperplane between two point clouds as a convex problem.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Intersection.</strong> Any intersection (even infinite) of convex sets is convex. That is why a polyhedron — an intersection of halfspaces — is convex, and why adding more constraints never destroys convexity of a feasible set. A classic infinite example: {x ∈ ℝ<sup>m</sup> : |p(t)| ≤ 1 for all |t| ≤ π/3}, where p(t) = x<sub>1</sub>cos t + … + x<sub>m</sub>cos mt, is an intersection of infinitely many slabs, so it is convex.</p>
<p><strong>Affine functions.</strong> If f(x) = Ax + b and S is convex, then the image f(S) and the preimage f<sup>−1</sup>(S) = {x : Ax + b ∈ S} are convex. Examples: scaling and translating a set; the solution set of a linear matrix inequality x<sub>1</sub>A<sub>1</sub> + … + x<sub>n</sub>A<sub>n</sub> ⪯ B (a preimage of the PSD cone); and the ellipsoid as the image of a ball. The <strong>Minkowski sum</strong> S<sub>1</sub> + S<sub>2</sub> = {x + y : x ∈ S<sub>1</sub>, y ∈ S<sub>2</sub>} is also convex.</p>
<div class="formula"><span class="lbl">Separating hyperplane theorem (Boyd §2.5.1)</span>If C and D are disjoint convex sets, there exist a ≠ 0 and b with a<sup>T</sup>x ≤ b for all x ∈ C and a<sup>T</sup>x ≥ b for all x ∈ D.</div>
<p>The hyperplane {x : a<sup>T</sup>x = b} separates the two sets. If one set is closed and bounded and the other closed, the separation can even be strict. The <strong>supporting hyperplane theorem</strong> says that at every boundary point x<sub>0</sub> of a convex set C there is a hyperplane a<sup>T</sup>x = a<sup>T</sup>x<sub>0</sub> with all of C on one side. These two theorems are the geometric heart of duality (Chapter 5) and of linear classification: a linear classifier <em>is</em> a separating hyperplane between the convex hulls of two classes.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — separating two point clouds.</b> Class A: 20 points around (0, 0); class B: 20 points around (3, 2). We look for a, b with a<sup>T</sup>x ≤ b − 1 on A and a<sup>T</sup>y ≥ b + 1 on B — a “thick” separation by a slab. The slab's width is 2/‖a‖<sub>2</sub>, so minimising ‖a‖<sub>2</sub> gives the widest slab.</p>
<p>Step 1: variables a ∈ ℝ<sup>2</sup>, b ∈ ℝ. Step 2: 40 linear inequality constraints (each is a halfspace in (a, b) — their intersection is convex). Step 3: convex objective ‖a‖<sub>2</sub>. This is a convex problem, and it is exactly the hard-margin support vector machine (Lesson 6.3).</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp

rng = np.random.default_rng(3)
X = rng.normal([0, 0], 0.6, size=(20, 2))      # class A around (0, 0)
Y = rng.normal([3, 2], 0.6, size=(20, 2))      # class B around (3, 2)

# Find a hyperplane a^T x = b with a^T x &lt;= b - 1 on X and a^T x &gt;= b + 1 on Y
a = cp.Variable(2); b = cp.Variable()
prob = cp.Problem(cp.Minimize(cp.norm(a, 2)),
                  [X @ a &lt;= b - 1, Y @ a &gt;= b + 1])
prob.solve()
print("status:", prob.status)
print("a =", a.value.round(4), " b =", round(float(b.value), 4))
print("max a^T x on A:", (X @ a.value).max().round(4), "| min a^T y on B:", (Y @ a.value).min().round(4))
print("gap between the two slabs = 2/||a|| =", round(2 / np.linalg.norm(a.value), 4))</code></pre>
<div class="out">status: optimal
a = [1.0662 0.8311]  b = 2.1035
max a^T x on A: 1.1035 | min a^T y on B: 3.1035
gap between the two slabs = 2/||a|| = 1.4794</div>
<p>The largest value of a<sup>T</sup>x on A is exactly b − 1 and the smallest on B exactly b + 1: the optimal slab touches both clouds — those touching points are the support vectors.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Assuming a union or a set difference of convex sets is convex — only intersections are safe.</li><li>Applying the separation theorem to nonconvex sets: a ring and the point at its centre are disjoint but cannot be separated by a line.</li><li>Writing strict inequalities a<sup>T</sup>x &lt; b in a solver; solvers work with closed sets, which is why we use the margin form ≤ b − 1.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Intersection, affine image, affine preimage and Minkowski sum preserve convexity.</li><li>Disjoint convex sets can be separated by a hyperplane; boundary points have supporting hyperplanes.</li><li>Finding a maximum-margin separating hyperplane is a convex problem — the SVM.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Hyperplane_separation_theorem" target="_blank" rel="noopener">Wikipedia — Hyperplane separation theorem</a></li><li><a href="https://en.wikipedia.org/wiki/Supporting_hyperplane" target="_blank" rel="noopener">Wikipedia — Supporting hyperplane</a></li><li><a href="https://web.stanford.edu/class/ee364a/lectures/sets.pdf" target="_blank" rel="noopener">Stanford EE364a — Convex sets: operations and separating hyperplanes (slides)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Show that {x : ‖Ax − b‖<sub>2</sub> ≤ c<sup>T</sup>x + d} is convex using an affine preimage.</li><li>Find a hyperplane separating the discs ‖x‖<sub>2</sub> ≤ 1 and ‖x − (4, 0)‖<sub>2</sub> ≤ 1.</li><li>Is {(x, y) : x ≥ 0, y ≥ 0, xy ≥ 1} convex? Can it be written as an intersection of halfspaces?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) It is the preimage of the second-order cone {(u, t) : ‖u‖<sub>2</sub> ≤ t} under the affine map x ↦ (Ax − b, c<sup>T</sup>x + d). 2) x<sub>1</sub> = 2 (a = (1, 0), b = 2) — the perpendicular bisector of the centres. 3) Yes, it is convex (it is the region above the convex curve y = 1/x in the first quadrant); every closed convex set is the intersection of all halfspaces containing it, here infinitely many tangent halfspaces.</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 2 · Bài 2.3</span>
<h2>Phép toán bảo toàn tính lồi; siêu phẳng tách và siêu phẳng tựa</h2>
<p class="lead">Trong thực tế ta hiếm khi chứng minh tính lồi từ định nghĩa. Ta dựng tập phức tạp từ những tập đơn giản ở Bài 2.2 bằng các phép toán đã biết là bảo toàn tính lồi — và dùng siêu phẳng để tách các tập lồi.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Liệt kê các phép toán bảo toàn tính lồi của tập: giao, ảnh và nghịch ảnh affine, tổng Minkowski.</li><li>Phát biểu định lý siêu phẳng tách và siêu phẳng tựa.</li><li>Tính một siêu phẳng tách hai đám điểm như một bài toán lồi.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Giao.</strong> Giao bất kỳ (kể cả vô hạn) của các tập lồi là lồi. Vì thế đa diện — giao của các nửa không gian — là lồi, và thêm ràng buộc không bao giờ phá tính lồi của miền khả thi. Một ví dụ vô hạn kinh điển: {x ∈ ℝ<sup>m</sup> : |p(t)| ≤ 1 với mọi |t| ≤ π/3}, với p(t) = x<sub>1</sub>cos t + … + x<sub>m</sub>cos mt, là giao của vô hạn dải, nên lồi.</p>
<p><strong>Hàm affine.</strong> Nếu f(x) = Ax + b và S lồi thì ảnh f(S) và nghịch ảnh f<sup>−1</sup>(S) = {x : Ax + b ∈ S} đều lồi. Ví dụ: co giãn và tịnh tiến một tập; tập nghiệm của bất đẳng thức ma trận tuyến tính x<sub>1</sub>A<sub>1</sub> + … + x<sub>n</sub>A<sub>n</sub> ⪯ B (nghịch ảnh của nón PSD); và ellipsoid là ảnh của quả cầu. <strong>Tổng Minkowski</strong> S<sub>1</sub> + S<sub>2</sub> = {x + y : x ∈ S<sub>1</sub>, y ∈ S<sub>2</sub>} cũng lồi.</p>
<div class="formula"><span class="lbl">Định lý siêu phẳng tách (Boyd §2.5.1)</span>Nếu C và D là hai tập lồi rời nhau thì tồn tại a ≠ 0 và b với a<sup>T</sup>x ≤ b với mọi x ∈ C và a<sup>T</sup>x ≥ b với mọi x ∈ D.</div>
<p>Siêu phẳng {x : a<sup>T</sup>x = b} tách hai tập. Nếu một tập đóng và bị chặn, tập kia đóng, thì có thể tách chặt. <strong>Định lý siêu phẳng tựa</strong> nói rằng tại mọi điểm biên x<sub>0</sub> của tập lồi C có một siêu phẳng a<sup>T</sup>x = a<sup>T</sup>x<sub>0</sub> để cả C nằm về một phía. Hai định lý này là trái tim hình học của đối ngẫu (Chương 5) và của phân lớp tuyến tính: một bộ phân lớp tuyến tính <em>chính là</em> siêu phẳng tách bao lồi của hai lớp.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — tách hai đám điểm.</b> Lớp A: 20 điểm quanh (0, 0); lớp B: 20 điểm quanh (3, 2). Ta tìm a, b với a<sup>T</sup>x ≤ b − 1 trên A và a<sup>T</sup>y ≥ b + 1 trên B — tách “dày” bằng một dải. Bề rộng dải là 2/‖a‖<sub>2</sub>, nên cực tiểu ‖a‖<sub>2</sub> cho dải rộng nhất.</p>
<p>Bước 1: biến a ∈ ℝ<sup>2</sup>, b ∈ ℝ. Bước 2: 40 ràng buộc bất đẳng thức tuyến tính (mỗi cái là một nửa không gian theo (a, b) — giao của chúng lồi). Bước 3: mục tiêu lồi ‖a‖<sub>2</sub>. Đây là bài toán lồi, và chính là máy vectơ hỗ trợ lề cứng (Bài 6.3).</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp

rng = np.random.default_rng(3)
X = rng.normal([0, 0], 0.6, size=(20, 2))      # class A around (0, 0)
Y = rng.normal([3, 2], 0.6, size=(20, 2))      # class B around (3, 2)

# Find a hyperplane a^T x = b with a^T x &lt;= b - 1 on X and a^T x &gt;= b + 1 on Y
a = cp.Variable(2); b = cp.Variable()
prob = cp.Problem(cp.Minimize(cp.norm(a, 2)),
                  [X @ a &lt;= b - 1, Y @ a &gt;= b + 1])
prob.solve()
print("status:", prob.status)
print("a =", a.value.round(4), " b =", round(float(b.value), 4))
print("max a^T x on A:", (X @ a.value).max().round(4), "| min a^T y on B:", (Y @ a.value).min().round(4))
print("gap between the two slabs = 2/||a|| =", round(2 / np.linalg.norm(a.value), 4))</code></pre>
<div class="out">status: optimal
a = [1.0662 0.8311]  b = 2.1035
max a^T x on A: 1.1035 | min a^T y on B: 3.1035
gap between the two slabs = 2/||a|| = 1.4794</div>
<p>Giá trị lớn nhất của a<sup>T</sup>x trên A đúng bằng b − 1 và nhỏ nhất trên B đúng bằng b + 1: dải tối ưu chạm cả hai đám — những điểm chạm đó là vectơ hỗ trợ.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Cho rằng hợp hay hiệu của các tập lồi là lồi — chỉ có giao là an toàn.</li><li>Áp định lý tách cho tập không lồi: hình vành khăn và điểm ở tâm rời nhau nhưng không tách được bằng một đường thẳng.</li><li>Viết bất đẳng thức chặt a<sup>T</sup>x &lt; b cho bộ giải; bộ giải làm việc với tập đóng, vì thế ta dùng dạng có lề ≤ b − 1.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Giao, ảnh affine, nghịch ảnh affine và tổng Minkowski bảo toàn tính lồi.</li><li>Hai tập lồi rời nhau tách được bằng một siêu phẳng; điểm biên có siêu phẳng tựa.</li><li>Tìm siêu phẳng tách có lề lớn nhất là bài toán lồi — chính là SVM.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Hyperplane_separation_theorem" target="_blank" rel="noopener">Wikipedia — Hyperplane separation theorem</a></li><li><a href="https://en.wikipedia.org/wiki/Supporting_hyperplane" target="_blank" rel="noopener">Wikipedia — Supporting hyperplane</a></li><li><a href="https://web.stanford.edu/class/ee364a/lectures/sets.pdf" target="_blank" rel="noopener">Stanford EE364a — Tập lồi: phép toán và siêu phẳng tách (slide)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Chứng minh {x : ‖Ax − b‖<sub>2</sub> ≤ c<sup>T</sup>x + d} lồi bằng nghịch ảnh affine.</li><li>Tìm một siêu phẳng tách hai hình tròn ‖x‖<sub>2</sub> ≤ 1 và ‖x − (4, 0)‖<sub>2</sub> ≤ 1.</li><li>Tập {(x, y) : x ≥ 0, y ≥ 0, xy ≥ 1} có lồi không? Có viết được thành giao các nửa không gian không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Nó là nghịch ảnh của nón bậc hai {(u, t) : ‖u‖<sub>2</sub> ≤ t} qua phép affine x ↦ (Ax − b, c<sup>T</sup>x + d). 2) x<sub>1</sub> = 2 (a = (1, 0), b = 2) — đường trung trực của hai tâm. 3) Có, nó lồi (miền phía trên đường cong lồi y = 1/x ở góc phần tư thứ nhất); mọi tập lồi đóng là giao của tất cả nửa không gian chứa nó, ở đây là vô hạn nửa không gian tiếp tuyến.</p></div>`);

const q2 = QZ(2, 'Quiz — Chapter 2: Convex sets|||Quiz — Chương 2: Tập lồi',
  'Kiểm tra định nghĩa tập lồi/affine, tổ hợp lồi, bao lồi, danh mục tập lồi, nón PSD, phép toán bảo toàn tính lồi, siêu phẳng tách.', [
  Q('q1', 'A set C is convex if for all x, y ∈ C|||Tập C lồi nếu với mọi x, y ∈ C',
    ['θx + (1 − θ)y ∈ C for all θ ∈ ℝ|||θx + (1 − θ)y ∈ C với mọi θ ∈ ℝ', 'θx + (1 − θ)y ∈ C for all 0 ≤ θ ≤ 1|||θx + (1 − θ)y ∈ C với mọi 0 ≤ θ ≤ 1', 'x + y ∈ C|||x + y ∈ C', 'θx ∈ C for all θ ≥ 0|||θx ∈ C với mọi θ ≥ 0'], 1,
    'Convex = contains the segment; θ ∈ ℝ would define an affine set.|||Lồi = chứa đoạn thẳng; θ ∈ ℝ sẽ định nghĩa tập affine.'),
  Q('q2', 'Which set is NOT convex?|||Tập nào KHÔNG lồi?',
    ['{x : Ax ≤ b}|||{x : Ax ≤ b}', '{x : ‖x‖₂ ≤ 3}|||{x : ‖x‖₂ ≤ 3}', '{x : 1 ≤ ‖x‖₂ ≤ 2}|||{x : 1 ≤ ‖x‖₂ ≤ 2}', '{x : aᵀx = b}|||{x : aᵀx = b}'], 2,
    'The ring fails: the midpoint of two opposite points is the centre, outside.|||Vành khăn hỏng: trung điểm hai điểm đối nhau là tâm, nằm ngoài.'),
  Q('q3', 'The weights of a convex combination must be|||Trọng số của tổ hợp lồi phải',
    ['any real numbers|||là số thực bất kỳ', 'nonnegative and sum to 1|||không âm và có tổng bằng 1', 'positive integers|||là số nguyên dương', 'sum to 0|||có tổng bằng 0'], 1,
    'A convex combination is a weighted average.|||Tổ hợp lồi là một trung bình có trọng số.'),
  Q('q4', 'The convex hull of a set S is|||Bao lồi của tập S là',
    ['the largest convex set inside S|||tập lồi lớn nhất nằm trong S', 'the smallest convex set containing S|||tập lồi nhỏ nhất chứa S', 'the boundary of S|||biên của S', 'always a ball|||luôn là một quả cầu'], 1,
    'It is the set of all convex combinations of points of S.|||Nó là tập mọi tổ hợp lồi của các điểm thuộc S.'),
  Q('q5', 'Why is every norm ball convex?|||Vì sao mọi quả cầu chuẩn đều lồi?',
    ['by the triangle inequality and homogeneity of the norm|||nhờ bất đẳng thức tam giác và tính thuần nhất của chuẩn', 'because it is bounded|||vì nó bị chặn', 'because it is symmetric|||vì nó đối xứng', 'it is convex only for the ℓ₂ norm|||nó chỉ lồi với chuẩn ℓ₂'], 0,
    '‖θx + (1 − θ)y − c‖ ≤ θ‖x − c‖ + (1 − θ)‖y − c‖ ≤ r.|||‖θx + (1 − θ)y − c‖ ≤ θ‖x − c‖ + (1 − θ)‖y − c‖ ≤ r.'),
  Q('q6', 'The feasible set of an LP is a|||Miền khả thi của một LP là',
    ['ellipsoid|||ellipsoid', 'polyhedron|||đa diện', 'PSD cone|||nón PSD', 'second-order cone|||nón bậc hai'], 1,
    'An intersection of finitely many halfspaces and hyperplanes.|||Giao hữu hạn các nửa không gian và siêu phẳng.'),
  Q('q7', 'Is [[2, 3], [3, 2]] in the PSD cone S²₊?|||[[2, 3], [3, 2]] có thuộc nón PSD S²₊ không?',
    ['yes, its diagonal is positive|||có, đường chéo dương', 'no, its determinant is −5 so an eigenvalue is negative|||không, định thức −5 nên có trị riêng âm', 'yes, it is symmetric|||có, nó đối xứng', 'cannot be decided|||không xác định được'], 1,
    'Eigenvalues are 5 and −1.|||Trị riêng là 5 và −1.'),
  Q('q8', 'Which operation does NOT preserve convexity of sets in general?|||Phép toán nào nói chung KHÔNG bảo toàn tính lồi của tập?',
    ['intersection|||giao', 'affine image|||ảnh affine', 'union|||hợp', 'affine preimage|||nghịch ảnh affine'], 2,
    'Two disjoint discs form a nonconvex union.|||Hai hình tròn rời nhau có hợp không lồi.'),
  Q('q9', 'The separating hyperplane theorem requires the two sets to be|||Định lý siêu phẳng tách đòi hỏi hai tập',
    ['convex and disjoint|||lồi và rời nhau', 'bounded|||bị chặn', 'polyhedra|||là đa diện', 'of equal size|||có cùng kích thước'], 0,
    'Convexity is essential: a ring and its centre cannot be separated.|||Tính lồi là thiết yếu: vành khăn và tâm của nó không tách được.'),
  Q('q10', 'In the max-margin separation problem, the slab width equals|||Trong bài toán tách lề lớn nhất, bề rộng dải bằng',
    ['‖a‖₂|||‖a‖₂', '2/‖a‖₂|||2/‖a‖₂', 'b|||b', '1/b|||1/b'], 1,
    'The planes aᵀx = b ± 1 are 2/‖a‖₂ apart, so minimising ‖a‖₂ maximises the margin.|||Hai mặt aᵀx = b ± 1 cách nhau 2/‖a‖₂, nên cực tiểu ‖a‖₂ là cực đại lề.'),
]);

const ch2 = {
  title: 'Chapter 2 — Convex sets|||Chương 2 — Tập lồi',
  description: 'Tập affine/lồi, tổ hợp lồi, bao lồi, nón; siêu phẳng, nửa không gian, quả cầu, ellipsoid, đa diện, nón PSD; phép toán bảo toàn tính lồi; siêu phẳng tách và tựa (Boyd Ch. 2 · EE364a bài 2).',
  lessons: [c21, c22, c23, q2],
};


// ───────────────────────────── Chương 3 — Hàm lồi ─────────────────────────────
const c31 = L('cvo201-ts-3-1',
  '3.1 — Convex functions: definition, Jensen’s inequality, epigraph and the first-order condition|||3.1 — Hàm lồi: định nghĩa, bất đẳng thức Jensen, trên đồ thị và điều kiện bậc một',
  'Định nghĩa hàm lồi/lõm/lồi chặt, bất đẳng thức Jensen, trên đồ thị (epigraph), điều kiện bậc một f(y) ≥ f(x) + ∇f(x)ᵀ(y − x) và hệ quả ∇f(x*) = 0 ⇒ tối ưu toàn cục (Boyd §3.1); kiểm số với log-sum-exp.',
  `<span class="eyebrow">CVO201 · Chapter 3 · Lesson 3.1</span>
<h2>Convex functions: definition, Jensen, epigraph and the first-order condition</h2>
<p class="lead">A convex function is one whose graph never rises above its chords. This single inequality is what makes local information (a gradient) tell the global truth.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the definition of convex, strictly convex and concave functions.</li><li>Connect convex functions and convex sets through the epigraph.</li><li>State and use the first-order condition, and deduce that a stationary point of a convex function is a global minimum.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Definition (Boyd §3.1.1)</span>f : ℝ<sup>n</sup> → ℝ is convex if dom f is convex and<br>f(θx + (1 − θ)y) ≤ θf(x) + (1 − θ)f(y)   for all x, y ∈ dom f, 0 ≤ θ ≤ 1</div>
<p>Geometrically, the chord between (x, f(x)) and (y, f(y)) lies above the graph. f is <strong>strictly convex</strong> if the inequality is strict for x ≠ y and 0 &lt; θ &lt; 1, and <strong>concave</strong> if −f is convex. Affine functions a<sup>T</sup>x + b are both convex and concave. The general form with many points, f(∑θ<sub>i</sub>x<sub>i</sub>) ≤ ∑θ<sub>i</sub>f(x<sub>i</sub>), is <strong>Jensen's inequality</strong>; for a random variable it reads f(E[X]) ≤ E[f(X)].</p>
<p>The <strong>epigraph</strong> epi f = {(x, t) : x ∈ dom f, f(x) ≤ t} is the region above the graph. A function is convex <strong>if and only if</strong> its epigraph is a convex set. This bridge is used constantly: minimising f(x) is the same as minimising t over (x, t) ∈ epi f — the epigraph trick of Lesson 4.1. The <strong>sublevel sets</strong> {x : f(x) ≤ α} of a convex function are convex too (the converse is false — such functions are called quasiconvex).</p>
<div class="formula"><span class="lbl">First-order condition (Boyd §3.1.3)</span>A differentiable f with convex domain is convex ⇔ f(y) ≥ f(x) + ∇f(x)<sup>T</sup>(y − x) for all x, y</div>
<p>The tangent plane at any point is a <strong>global under-estimator</strong>. Consequence: if ∇f(x*) = 0, then f(y) ≥ f(x*) for every y — a stationary point is a global minimiser. For nonconvex functions the tangent can cut through the graph, and ∇f = 0 may be a saddle or a local maximum.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example 1 — prove f(x) = x<sup>2</sup> is convex from the definition.</b> θx<sup>2</sup> + (1 − θ)y<sup>2</sup> − (θx + (1 − θ)y)<sup>2</sup> = θ(1 − θ)(x<sup>2</sup> − 2xy + y<sup>2</sup>) = θ(1 − θ)(x − y)<sup>2</sup> ≥ 0. Done — and the gap is strictly positive when x ≠ y and 0 &lt; θ &lt; 1, so x<sup>2</sup> is strictly convex.</p>
<p><b>Example 2 — Jensen gives AM–GM.</b> −log is convex, so −log(½a + ½b) ≤ −½log a − ½log b, i.e. log((a + b)/2) ≥ log √(ab), which is (a + b)/2 ≥ √(ab).</p>
<p><b>Example 3 — log-sum-exp.</b> f(x) = log(e<sup>x<sub>1</sub></sup> + … + e<sup>x<sub>n</sub></sup>) is a smooth approximation of max<sub>i</sub> x<sub>i</sub>: max x ≤ f(x) ≤ max x + log n. Its gradient is the softmax vector. Below we test both the chord inequality and the tangent inequality on 10,000 random points.</p></div>
<pre><code class="language-python">import numpy as np

rng = np.random.default_rng(0)
f = lambda x: np.log(np.sum(np.exp(x)))          # log-sum-exp, a smooth "max"
grad = lambda x: np.exp(x) / np.sum(np.exp(x))   # = softmax(x)

# 1) Jensen / chord test on 10,000 random pairs and weights
worst = np.inf
for _ in range(10_000):
    x, y = rng.normal(size=3) * 3, rng.normal(size=3) * 3
    th = rng.uniform()
    gap = th * f(x) + (1 - th) * f(y) - f(th * x + (1 - th) * y)
    worst = min(worst, gap)
print("smallest chord-minus-function gap:", round(worst, 6), "(never negative)")

# 2) first-order condition: f(y) &gt;= f(x) + grad(x)^T (y - x)
worst = np.inf
for _ in range(10_000):
    x, y = rng.normal(size=3) * 3, rng.normal(size=3) * 3
    worst = min(worst, f(y) - f(x) - grad(x) @ (y - x))
print("smallest f(y) - tangent(y):", round(worst, 6))

x = np.array([1.0, 2.0, 3.0])
print("max(x) =", x.max(), " lse(x) =", round(f(x), 4), " &lt;= max + log n =", round(x.max() + np.log(3), 4))</code></pre>
<div class="out">smallest chord-minus-function gap: 1e-06 (never negative)
smallest f(y) - tangent(y): 2.3e-05
max(x) = 3.0  lse(x) = 3.4076  &lt;= max + log n = 4.0986</div>
<p>Neither test ever goes negative (the tiny positive minima are the closest random cases, not errors). Numerical tests cannot prove convexity, but one negative value would disprove it — a useful sanity check before trusting a model.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the domain: 1/x is convex on x &gt; 0 but not on ℝ \ {0}, whose domain is not convex.</li><li>Believing “convex sublevel sets ⇒ convex function”: √|x| has interval sublevel sets but is not convex.</li><li>Using the first-order condition for a nondifferentiable function such as |x|; there we need subgradients (Lesson 9.3).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Convex: graph below every chord; Jensen generalises to many points and to expectations.</li><li>f convex ⇔ epi f convex set; sublevel sets of convex functions are convex.</li><li>First-order condition: tangents are global under-estimators, so ∇f(x*) = 0 ⇒ global minimum.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://web.stanford.edu/class/ee364a/lectures/functions.pdf" target="_blank" rel="noopener">Stanford EE364a — Lecture 3: Convex functions (slides)</a></li><li><a href="https://en.wikipedia.org/wiki/Jensen%27s_inequality" target="_blank" rel="noopener">Wikipedia — Jensen&#39;s inequality</a></li><li><a href="https://en.wikipedia.org/wiki/Epigraph_(mathematics)" target="_blank" rel="noopener">Wikipedia — Epigraph (mathematics)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Use the definition to show that f(x) = |x| is convex.</li><li>Write the first-order condition for f(x) = e<sup>x</sup> at x = 0 and check it at y = 1.</li><li>f is convex and ∇f(x<sub>0</sub>) = (0, 0). What can you say about f(x<sub>0</sub>)?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) |θx + (1 − θ)y| ≤ θ|x| + (1 − θ)|y| by the triangle inequality. 2) e<sup>y</sup> ≥ 1 + y; at y = 1: e ≈ 2.718 ≥ 2. 3) f(x<sub>0</sub>) = p*, the global minimum value of f.</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 3 · Bài 3.1</span>
<h2>Hàm lồi: định nghĩa, Jensen, trên đồ thị và điều kiện bậc một</h2>
<p class="lead">Hàm lồi là hàm có đồ thị không bao giờ vượt lên trên các dây cung. Chỉ một bất đẳng thức này mà thông tin địa phương (một gradient) nói được sự thật toàn cục.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu định nghĩa hàm lồi, lồi chặt và lõm.</li><li>Nối hàm lồi với tập lồi qua trên đồ thị (epigraph).</li><li>Phát biểu và dùng điều kiện bậc một, suy ra điểm dừng của hàm lồi là cực tiểu toàn cục.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Định nghĩa (Boyd §3.1.1)</span>f : ℝ<sup>n</sup> → ℝ lồi nếu dom f lồi và<br>f(θx + (1 − θ)y) ≤ θf(x) + (1 − θ)f(y)   với mọi x, y ∈ dom f, 0 ≤ θ ≤ 1</div>
<p>Về hình học, dây cung nối (x, f(x)) và (y, f(y)) nằm trên đồ thị. f <strong>lồi chặt</strong> nếu bất đẳng thức chặt khi x ≠ y và 0 &lt; θ &lt; 1, và <strong>lõm</strong> nếu −f lồi. Hàm affine a<sup>T</sup>x + b vừa lồi vừa lõm. Dạng tổng quát với nhiều điểm, f(∑θ<sub>i</sub>x<sub>i</sub>) ≤ ∑θ<sub>i</sub>f(x<sub>i</sub>), là <strong>bất đẳng thức Jensen</strong>; với biến ngẫu nhiên nó thành f(E[X]) ≤ E[f(X)].</p>
<p><strong>Trên đồ thị</strong> epi f = {(x, t) : x ∈ dom f, f(x) ≤ t} là miền phía trên đồ thị. Một hàm lồi <strong>khi và chỉ khi</strong> trên đồ thị của nó là tập lồi. Cây cầu này được dùng liên tục: cực tiểu f(x) cũng là cực tiểu t trên (x, t) ∈ epi f — mẹo epigraph ở Bài 4.1. Các <strong>tập mức dưới</strong> {x : f(x) ≤ α} của hàm lồi cũng lồi (điều ngược lại sai — các hàm như thế gọi là tựa lồi).</p>
<div class="formula"><span class="lbl">Điều kiện bậc một (Boyd §3.1.3)</span>f khả vi với miền lồi là lồi ⇔ f(y) ≥ f(x) + ∇f(x)<sup>T</sup>(y − x) với mọi x, y</div>
<p>Mặt phẳng tiếp tuyến tại mọi điểm là một <strong>cận dưới toàn cục</strong>. Hệ quả: nếu ∇f(x*) = 0 thì f(y) ≥ f(x*) với mọi y — điểm dừng là điểm cực tiểu toàn cục. Với hàm không lồi, tiếp tuyến có thể cắt xuyên đồ thị, và ∇f = 0 có thể là điểm yên ngựa hay cực đại địa phương.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — chứng minh f(x) = x<sup>2</sup> lồi từ định nghĩa.</b> θx<sup>2</sup> + (1 − θ)y<sup>2</sup> − (θx + (1 − θ)y)<sup>2</sup> = θ(1 − θ)(x<sup>2</sup> − 2xy + y<sup>2</sup>) = θ(1 − θ)(x − y)<sup>2</sup> ≥ 0. Xong — và hiệu này dương chặt khi x ≠ y và 0 &lt; θ &lt; 1, nên x<sup>2</sup> lồi chặt.</p>
<p><b>Ví dụ 2 — Jensen cho bất đẳng thức AM–GM.</b> −log lồi, nên −log(½a + ½b) ≤ −½log a − ½log b, tức log((a + b)/2) ≥ log √(ab), chính là (a + b)/2 ≥ √(ab).</p>
<p><b>Ví dụ 3 — log-sum-exp.</b> f(x) = log(e<sup>x<sub>1</sub></sup> + … + e<sup>x<sub>n</sub></sup>) là xấp xỉ trơn của max<sub>i</sub> x<sub>i</sub>: max x ≤ f(x) ≤ max x + log n. Gradient của nó là vectơ softmax. Dưới đây ta kiểm cả bất đẳng thức dây cung lẫn bất đẳng thức tiếp tuyến trên 10.000 điểm ngẫu nhiên.</p></div>
<pre><code class="language-python">import numpy as np

rng = np.random.default_rng(0)
f = lambda x: np.log(np.sum(np.exp(x)))          # log-sum-exp, a smooth "max"
grad = lambda x: np.exp(x) / np.sum(np.exp(x))   # = softmax(x)

# 1) Jensen / chord test on 10,000 random pairs and weights
worst = np.inf
for _ in range(10_000):
    x, y = rng.normal(size=3) * 3, rng.normal(size=3) * 3
    th = rng.uniform()
    gap = th * f(x) + (1 - th) * f(y) - f(th * x + (1 - th) * y)
    worst = min(worst, gap)
print("smallest chord-minus-function gap:", round(worst, 6), "(never negative)")

# 2) first-order condition: f(y) &gt;= f(x) + grad(x)^T (y - x)
worst = np.inf
for _ in range(10_000):
    x, y = rng.normal(size=3) * 3, rng.normal(size=3) * 3
    worst = min(worst, f(y) - f(x) - grad(x) @ (y - x))
print("smallest f(y) - tangent(y):", round(worst, 6))

x = np.array([1.0, 2.0, 3.0])
print("max(x) =", x.max(), " lse(x) =", round(f(x), 4), " &lt;= max + log n =", round(x.max() + np.log(3), 4))</code></pre>
<div class="out">smallest chord-minus-function gap: 1e-06 (never negative)
smallest f(y) - tangent(y): 2.3e-05
max(x) = 3.0  lse(x) = 3.4076  &lt;= max + log n = 4.0986</div>
<p>Không phép kiểm nào ra số âm (các giá trị dương rất nhỏ là những trường hợp ngẫu nhiên sát nhất, không phải lỗi). Kiểm bằng số không chứng minh được tính lồi, nhưng một giá trị âm là đủ bác bỏ — một phép kiểm tỉnh táo hữu ích trước khi tin một mô hình.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên miền xác định: 1/x lồi trên x &gt; 0 nhưng không lồi trên ℝ \ {0}, vì miền đó không lồi.</li><li>Tin “tập mức dưới lồi ⇒ hàm lồi”: √|x| có tập mức dưới là các khoảng nhưng không lồi.</li><li>Dùng điều kiện bậc một cho hàm không khả vi như |x|; ở đó cần dưới gradient (Bài 9.3).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Lồi: đồ thị nằm dưới mọi dây cung; Jensen mở rộng cho nhiều điểm và cho kỳ vọng.</li><li>f lồi ⇔ epi f là tập lồi; tập mức dưới của hàm lồi là lồi.</li><li>Điều kiện bậc một: tiếp tuyến là cận dưới toàn cục, nên ∇f(x*) = 0 ⇒ cực tiểu toàn cục.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://web.stanford.edu/class/ee364a/lectures/functions.pdf" target="_blank" rel="noopener">Stanford EE364a — Bài 3: Hàm lồi (slide)</a></li><li><a href="https://en.wikipedia.org/wiki/Jensen%27s_inequality" target="_blank" rel="noopener">Wikipedia — Jensen&#39;s inequality</a></li><li><a href="https://en.wikipedia.org/wiki/Epigraph_(mathematics)" target="_blank" rel="noopener">Wikipedia — Epigraph (mathematics)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Dùng định nghĩa chứng minh f(x) = |x| lồi.</li><li>Viết điều kiện bậc một cho f(x) = e<sup>x</sup> tại x = 0 và kiểm tại y = 1.</li><li>f lồi và ∇f(x<sub>0</sub>) = (0, 0). Bạn nói được gì về f(x<sub>0</sub>)?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) |θx + (1 − θ)y| ≤ θ|x| + (1 − θ)|y| theo bất đẳng thức tam giác. 2) e<sup>y</sup> ≥ 1 + y; tại y = 1: e ≈ 2,718 ≥ 2. 3) f(x<sub>0</sub>) = p*, giá trị nhỏ nhất toàn cục của f.</p></div>`);

const c32 = L('cvo201-ts-3-2',
  '3.2 — The second-order condition and a catalogue of convex functions|||3.2 — Điều kiện bậc hai và danh mục các hàm lồi',
  'Điều kiện bậc hai ∇²f ⪰ 0; danh mục hàm lồi một biến và nhiều biến (mũ, lũy thừa, −log, x log x, chuẩn, max, dạng toàn phương, log-sum-exp, x²/y); kiểm Hessian bằng trị riêng (Boyd §3.1.4–3.1.5).',
  `<span class="eyebrow">CVO201 · Chapter 3 · Lesson 3.2</span>
<h2>The second-order condition and a catalogue of convex functions</h2>
<p class="lead">For twice-differentiable functions, convexity is a statement about curvature: the Hessian must be positive semidefinite everywhere. Combined with a short catalogue, this lets you check most functions in a minute.</p>
<h3>🎯 Objectives</h3>
<ul><li>State and apply the second-order condition ∇<sup>2</sup>f(x) ⪰ 0.</li><li>Know the basic convex and concave functions of one and several variables.</li><li>Decide convexity of a quadratic function from its matrix.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Second-order condition (Boyd §3.1.4)</span>f twice differentiable on an open convex domain:  f convex ⇔ ∇<sup>2</sup>f(x) ⪰ 0 for all x ∈ dom f<br>∇<sup>2</sup>f(x) ≻ 0 for all x ⇒ f strictly convex   (the converse fails: x<sup>4</sup> has f″(0) = 0)</div>
<p>In one variable this is simply f″(x) ≥ 0: the slope never decreases. In several variables it says the curvature along every direction v, namely v<sup>T</sup>∇<sup>2</sup>f(x)v, is nonnegative. For a <strong>quadratic</strong> f(x) = ½x<sup>T</sup>Px + q<sup>T</sup>x + r the Hessian is the constant P, so f is convex exactly when P ⪰ 0 — check the eigenvalues (Lesson 1.2).</p>
<p><strong>Catalogue on ℝ.</strong> Convex: e<sup>ax</sup>; x<sup>a</sup> on x &gt; 0 for a ≥ 1 or a ≤ 0; |x|<sup>p</sup> for p ≥ 1; −log x and x log x on x &gt; 0. Concave: x<sup>a</sup> for 0 ≤ a ≤ 1 (e.g. √x), log x.</p>
<p><strong>Catalogue on ℝ<sup>n</sup>.</strong> Every norm ‖x‖ (by the triangle inequality); max<sub>i</sub> x<sub>i</sub>; log-sum-exp; the quadratic-over-linear function x<sup>2</sup>/y on y &gt; 0; affine functions. Concave: the geometric mean (∏x<sub>i</sub>)<sup>1/n</sup>, log det X on positive definite matrices, the minimum of linear functions.</p>
<p>The Hessian of log-sum-exp is ∇<sup>2</sup>f = diag(z) − zz<sup>T</sup>, where z is the softmax vector. For any v, v<sup>T</sup>∇<sup>2</sup>f v = ∑z<sub>i</sub>v<sub>i</sub><sup>2</sup> − (∑z<sub>i</sub>v<sub>i</sub>)<sup>2</sup> ≥ 0 by Cauchy–Schwarz (it is a variance under the weights z). This is why the cross-entropy loss of softmax classification is convex in the logits.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — f(x, y) = x<sup>2</sup>/y on y &gt; 0.</b></p>
<p>Step 1: f<sub>xx</sub> = 2/y, f<sub>xy</sub> = −2x/y<sup>2</sup>, f<sub>yy</sub> = 2x<sup>2</sup>/y<sup>3</sup>. Step 2: ∇<sup>2</sup>f = (2/y<sup>3</sup>)·[[y<sup>2</sup>, −xy], [−xy, x<sup>2</sup>]] = (2/y<sup>3</sup>)·(y, −x)(y, −x)<sup>T</sup>. Step 3: an outer product vv<sup>T</sup> is PSD and 2/y<sup>3</sup> &gt; 0, so ∇<sup>2</sup>f ⪰ 0: f is convex — but not strictly, one eigenvalue is 0 (f is linear along every ray from the origin, since f(sx, sy) = s·f(x, y)).</p>
<p><b>Quadratics.</b> P = [[2, 1], [1, 2]] has eigenvalues 1, 3: convex bowl. P = [[1, 3], [3, 1]] has eigenvalues −2, 4: a saddle, not convex.</p></div>
<pre><code class="language-python">import numpy as np

def hess_lse(x):                       # Hessian of log-sum-exp: diag(z) - z z^T, z = softmax(x)
    z = np.exp(x - x.max()); z /= z.sum()
    return np.diag(z) - np.outer(z, z)

rng = np.random.default_rng(1)
mins = [np.linalg.eigvalsh(hess_lse(rng.normal(size=4) * 2)).min() for _ in range(1000)]
print("log-sum-exp: smallest Hessian eigenvalue over 1000 points =", f"{min(mins):.2e}")

# quadratic f(x) = x^T P x + q^T x: convex iff P is PSD
for P in [np.array([[2.0, 1.0], [1.0, 2.0]]), np.array([[1.0, 3.0], [3.0, 1.0]])]:
    ev = np.linalg.eigvalsh(P)
    print("P =", P.tolist(), "eigenvalues", ev.round(4), "-&gt;", "convex" if ev.min() &gt;= 0 else "NOT convex")

# geometric mean-type check: f(x, y) = x^2 / y on y &gt; 0 (convex)
x, y = 1.5, 0.7
H = np.array([[2 / y, -2 * x / y**2], [-2 * x / y**2, 2 * x**2 / y**3]])
print("Hessian of x^2/y at (1.5, 0.7) eigenvalues:", np.linalg.eigvalsh(H).round(4))</code></pre>
<div class="out">log-sum-exp: smallest Hessian eigenvalue over 1000 points = -1.17e-16
P = [[2.0, 1.0], [1.0, 2.0]] eigenvalues [1. 3.] -&gt; convex
P = [[1.0, 3.0], [3.0, 1.0]] eigenvalues [-2.  4.] -&gt; NOT convex
Hessian of x^2/y at (1.5, 0.7) eigenvalues: [ 0.     15.9767]</div>
<p>The smallest Hessian eigenvalue of log-sum-exp is −1.17·10<sup>−16</sup>: that is zero up to floating-point rounding (the Hessian is singular along v = (1, …, 1) because adding a constant to every x<sub>i</sub> shifts f linearly). The Hessian of x<sup>2</sup>/y has eigenvalues 0 and 15.98, as predicted.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Checking only the diagonal of the Hessian (f<sub>xx</sub> ≥ 0 and f<sub>yy</sub> ≥ 0 is not enough — f(x, y) = xy has zero diagonal and is a saddle).</li><li>Concluding non-convexity from one negative eigenvalue at a point <em>outside</em> the domain.</li><li>Reading a tiny negative eigenvalue like −10<sup>−16</sup> as a proof of non-convexity: it is rounding error.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Second-order test: f convex ⇔ ∇<sup>2</sup>f ⪰ 0 on the (convex, open) domain.</li><li>Quadratic ½x<sup>T</sup>Px + q<sup>T</sup>x convex ⇔ P ⪰ 0.</li><li>Memorise the catalogue: exp, powers, −log, x log x, norms, max, log-sum-exp, x<sup>2</sup>/y; concave: log, √, geometric mean, log det.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf" target="_blank" rel="noopener">Boyd &amp; Vandenberghe — Convex Optimization, §3.1.4–3.1.5 Second-order conditions and examples (PDF)</a></li><li><a href="https://en.wikipedia.org/wiki/LogSumExp" target="_blank" rel="noopener">Wikipedia — LogSumExp</a></li><li><a href="https://en.wikipedia.org/wiki/Convex_function" target="_blank" rel="noopener">Wikipedia — Convex function</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Is f(x) = x log x convex on x &gt; 0? Use f″.</li><li>For which c is f(x, y) = x<sup>2</sup> + cxy + y<sup>2</sup> convex?</li><li>Is f(x) = 1/x convex on x &gt; 0?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) f′ = log x + 1, f″ = 1/x &gt; 0: yes, strictly convex. 2) P = [[2, c], [c, 2]] (Hessian), eigenvalues 2 ± c: convex iff |c| ≤ 2. 3) f″ = 2/x<sup>3</sup> &gt; 0 on x &gt; 0: yes.</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 3 · Bài 3.2</span>
<h2>Điều kiện bậc hai và danh mục các hàm lồi</h2>
<p class="lead">Với hàm khả vi hai lần, tính lồi là một phát biểu về độ cong: Hessian phải nửa xác định dương ở mọi nơi. Kết hợp với một danh mục ngắn, bạn kiểm được hầu hết các hàm trong một phút.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu và áp dụng điều kiện bậc hai ∇<sup>2</sup>f(x) ⪰ 0.</li><li>Biết các hàm lồi và lõm cơ bản một biến và nhiều biến.</li><li>Xác định tính lồi của hàm toàn phương từ ma trận của nó.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Điều kiện bậc hai (Boyd §3.1.4)</span>f khả vi hai lần trên miền lồi mở:  f lồi ⇔ ∇<sup>2</sup>f(x) ⪰ 0 với mọi x ∈ dom f<br>∇<sup>2</sup>f(x) ≻ 0 với mọi x ⇒ f lồi chặt   (chiều ngược sai: x<sup>4</sup> có f″(0) = 0)</div>
<p>Với một biến, đây đơn giản là f″(x) ≥ 0: độ dốc không bao giờ giảm. Với nhiều biến, nó nói độ cong theo mọi hướng v, tức v<sup>T</sup>∇<sup>2</sup>f(x)v, không âm. Với <strong>hàm toàn phương</strong> f(x) = ½x<sup>T</sup>Px + q<sup>T</sup>x + r, Hessian là hằng P, nên f lồi đúng khi P ⪰ 0 — kiểm trị riêng (Bài 1.2).</p>
<p><strong>Danh mục trên ℝ.</strong> Lồi: e<sup>ax</sup>; x<sup>a</sup> trên x &gt; 0 với a ≥ 1 hoặc a ≤ 0; |x|<sup>p</sup> với p ≥ 1; −log x và x log x trên x &gt; 0. Lõm: x<sup>a</sup> với 0 ≤ a ≤ 1 (vd √x), log x.</p>
<p><strong>Danh mục trên ℝ<sup>n</sup>.</strong> Mọi chuẩn ‖x‖ (nhờ bất đẳng thức tam giác); max<sub>i</sub> x<sub>i</sub>; log-sum-exp; hàm bình phương chia tuyến tính x<sup>2</sup>/y trên y &gt; 0; hàm affine. Lõm: trung bình nhân (∏x<sub>i</sub>)<sup>1/n</sup>, log det X trên ma trận xác định dương, min của các hàm tuyến tính.</p>
<p>Hessian của log-sum-exp là ∇<sup>2</sup>f = diag(z) − zz<sup>T</sup>, với z là vectơ softmax. Với mọi v, v<sup>T</sup>∇<sup>2</sup>f v = ∑z<sub>i</sub>v<sub>i</sub><sup>2</sup> − (∑z<sub>i</sub>v<sub>i</sub>)<sup>2</sup> ≥ 0 theo Cauchy–Schwarz (nó là một phương sai với trọng số z). Đó là lý do hàm mất mát cross-entropy của phân lớp softmax lồi theo logit.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — f(x, y) = x<sup>2</sup>/y trên y &gt; 0.</b></p>
<p>Bước 1: f<sub>xx</sub> = 2/y, f<sub>xy</sub> = −2x/y<sup>2</sup>, f<sub>yy</sub> = 2x<sup>2</sup>/y<sup>3</sup>. Bước 2: ∇<sup>2</sup>f = (2/y<sup>3</sup>)·[[y<sup>2</sup>, −xy], [−xy, x<sup>2</sup>]] = (2/y<sup>3</sup>)·(y, −x)(y, −x)<sup>T</sup>. Bước 3: tích ngoài vv<sup>T</sup> là PSD và 2/y<sup>3</sup> &gt; 0, nên ∇<sup>2</sup>f ⪰ 0: f lồi — nhưng không chặt, có một trị riêng bằng 0 (f tuyến tính dọc mọi tia xuất phát từ gốc, vì f(sx, sy) = s·f(x, y)).</p>
<p><b>Hàm toàn phương.</b> P = [[2, 1], [1, 2]] có trị riêng 1, 3: cái bát lồi. P = [[1, 3], [3, 1]] có trị riêng −2, 4: yên ngựa, không lồi.</p></div>
<pre><code class="language-python">import numpy as np

def hess_lse(x):                       # Hessian of log-sum-exp: diag(z) - z z^T, z = softmax(x)
    z = np.exp(x - x.max()); z /= z.sum()
    return np.diag(z) - np.outer(z, z)

rng = np.random.default_rng(1)
mins = [np.linalg.eigvalsh(hess_lse(rng.normal(size=4) * 2)).min() for _ in range(1000)]
print("log-sum-exp: smallest Hessian eigenvalue over 1000 points =", f"{min(mins):.2e}")

# quadratic f(x) = x^T P x + q^T x: convex iff P is PSD
for P in [np.array([[2.0, 1.0], [1.0, 2.0]]), np.array([[1.0, 3.0], [3.0, 1.0]])]:
    ev = np.linalg.eigvalsh(P)
    print("P =", P.tolist(), "eigenvalues", ev.round(4), "-&gt;", "convex" if ev.min() &gt;= 0 else "NOT convex")

# geometric mean-type check: f(x, y) = x^2 / y on y &gt; 0 (convex)
x, y = 1.5, 0.7
H = np.array([[2 / y, -2 * x / y**2], [-2 * x / y**2, 2 * x**2 / y**3]])
print("Hessian of x^2/y at (1.5, 0.7) eigenvalues:", np.linalg.eigvalsh(H).round(4))</code></pre>
<div class="out">log-sum-exp: smallest Hessian eigenvalue over 1000 points = -1.17e-16
P = [[2.0, 1.0], [1.0, 2.0]] eigenvalues [1. 3.] -&gt; convex
P = [[1.0, 3.0], [3.0, 1.0]] eigenvalues [-2.  4.] -&gt; NOT convex
Hessian of x^2/y at (1.5, 0.7) eigenvalues: [ 0.     15.9767]</div>
<p>Trị riêng nhỏ nhất của Hessian log-sum-exp là −1,17·10<sup>−16</sup>: đó là số 0 sai lệch do làm tròn số thực (Hessian suy biến theo hướng v = (1, …, 1) vì cộng cùng một hằng vào mọi x<sub>i</sub> làm f dịch tuyến tính). Hessian của x<sup>2</sup>/y có trị riêng 0 và 15,98, đúng như dự đoán.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chỉ kiểm đường chéo Hessian (f<sub>xx</sub> ≥ 0 và f<sub>yy</sub> ≥ 0 chưa đủ — f(x, y) = xy có đường chéo bằng 0 và là yên ngựa).</li><li>Kết luận không lồi từ một trị riêng âm tại điểm <em>ngoài</em> miền xác định.</li><li>Đọc một trị riêng âm cực nhỏ như −10<sup>−16</sup> là bằng chứng không lồi: đó là sai số làm tròn.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Kiểm bậc hai: f lồi ⇔ ∇<sup>2</sup>f ⪰ 0 trên miền (lồi, mở).</li><li>Hàm toàn phương ½x<sup>T</sup>Px + q<sup>T</sup>x lồi ⇔ P ⪰ 0.</li><li>Thuộc danh mục: exp, lũy thừa, −log, x log x, chuẩn, max, log-sum-exp, x<sup>2</sup>/y; lõm: log, √, trung bình nhân, log det.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf" target="_blank" rel="noopener">Boyd &amp; Vandenberghe — Convex Optimization, §3.1.4–3.1.5 Điều kiện bậc hai và ví dụ (PDF)</a></li><li><a href="https://en.wikipedia.org/wiki/LogSumExp" target="_blank" rel="noopener">Wikipedia — LogSumExp</a></li><li><a href="https://en.wikipedia.org/wiki/Convex_function" target="_blank" rel="noopener">Wikipedia — Convex function</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>f(x) = x log x có lồi trên x &gt; 0 không? Dùng f″.</li><li>Với c nào thì f(x, y) = x<sup>2</sup> + cxy + y<sup>2</sup> lồi?</li><li>f(x) = 1/x có lồi trên x &gt; 0 không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) f′ = log x + 1, f″ = 1/x &gt; 0: có, lồi chặt. 2) Hessian [[2, c], [c, 2]], trị riêng 2 ± c: lồi khi và chỉ khi |c| ≤ 2. 3) f″ = 2/x<sup>3</sup> &gt; 0 trên x &gt; 0: có.</p></div>`);

const c33 = L('cvo201-ts-3-3',
  '3.3 — Operations that preserve convexity and disciplined convex programming (DCP)|||3.3 — Phép toán bảo toàn tính lồi và quy hoạch lồi có kỷ luật (DCP)',
  'Tổng có trọng số không âm, hợp với hàm affine, max theo điểm, quy tắc hợp hàm (Boyd §3.2); luật DCP của CVXPY: curvature, is_dcp(), cách viết lại biểu thức để qua DCP.',
  `<span class="eyebrow">CVO201 · Chapter 3 · Lesson 3.3</span>
<h2>Operations that preserve convexity and DCP</h2>
<p class="lead">Checking Hessians by hand does not scale to real models. Instead we build functions from the catalogue with rules that are guaranteed to preserve convexity. CVXPY automates exactly these rules — they are called disciplined convex programming.</p>
<h3>🎯 Objectives</h3>
<ul><li>Apply the basic operations: nonnegative weighted sums, composition with an affine map, pointwise maximum.</li><li>Use the composition rules for h(g(x)).</li><li>Read CVXPY's curvature report and rewrite an expression that fails the DCP rules.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Operations that preserve convexity (Boyd §3.2)</span>1. f<sub>1</sub>, f<sub>2</sub> convex, w<sub>1</sub>, w<sub>2</sub> ≥ 0 ⇒ w<sub>1</sub>f<sub>1</sub> + w<sub>2</sub>f<sub>2</sub> convex<br>2. f convex ⇒ f(Ax + b) convex<br>3. f<sub>1</sub>, …, f<sub>m</sub> convex ⇒ max{f<sub>1</sub>(x), …, f<sub>m</sub>(x)} convex (also sup over infinitely many)<br>4. h convex, g convex, h nondecreasing ⇒ h(g(x)) convex<br>   h convex, g concave, h nonincreasing ⇒ h(g(x)) convex</div>
<p>Rule 2 immediately gives ‖Ax − b‖ (any norm) and log-sum-exp of affine functions; rule 1 gives regularised losses like ‖Ax − b‖<sub>2</sub><sup>2</sup> + λ‖x‖<sub>1</sub>; rule 3 gives the hinge loss max(0, 1 − y w<sup>T</sup>x), the largest eigenvalue λ<sub>max</sub>(X) = sup<sub>‖v‖=1</sub> v<sup>T</sup>Xv, and piecewise-linear functions. Rule 4 explains why e<sup>g(x)</sup> is convex for convex g (exp is convex and increasing) and why 1/g(x) is convex for concave positive g (1/u is convex and decreasing on u &gt; 0).</p>
<p><strong>Disciplined convex programming.</strong> CVXPY gives every expression a <em>sign</em> and a <em>curvature</em> (constant, affine, convex, concave or unknown) using only the rules above and a library of atoms whose curvature and monotonicity are known. A problem is accepted if the objective is convex (when minimising) or concave (when maximising) and every constraint has the form convex ≤ concave, concave ≥ convex, or affine == affine. DCP is <em>sufficient</em>, not necessary: some convex functions fail it when written badly, and you must rewrite them using the right atom.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — is f(x) = e<sup>‖Ax − b‖<sub>2</sub><sup>2</sup></sup> + max(x<sub>1</sub>, 2x<sub>2</sub> − 1) convex?</b></p>
<p>Step 1: Ax − b is affine; ‖·‖<sub>2</sub><sup>2</sup> is convex ⇒ g(x) = ‖Ax − b‖<sub>2</sub><sup>2</sup> convex (rule 2). Step 2: exp is convex and nondecreasing ⇒ e<sup>g(x)</sup> convex (rule 4). Step 3: x<sub>1</sub> and 2x<sub>2</sub> − 1 are affine ⇒ their max is convex (rule 3). Step 4: sum of convex functions ⇒ convex (rule 1).</p>
<p><b>A trap.</b> √(x<sup>2</sup>) = |x| is convex, but as written it is sqrt (concave, increasing) of square (convex) — rule 4 does not apply, so DCP rejects it. Write <code>cp.abs(x)</code> instead.</p></div>
<pre><code class="language-python">import cvxpy as cp

x = cp.Variable(3); y = cp.Variable(pos=True)
exprs = {
    "norm(x, 2) + 3*x[0]":            cp.norm(x, 2) + 3 * x[0],
    "square(x[0] - 1)":                cp.square(x[0] - 1),
    "max(exp(x)) (pointwise max)":     cp.max(cp.exp(x)),
    "log_sum_exp(x)":                  cp.log_sum_exp(x),
    "-log(y) + quad_over_lin(x, y)":   -cp.log(y) + cp.quad_over_lin(x, y),
    "sqrt(x[0])  (concave)":           cp.sqrt(x[0]),
    "square(x[0]) - square(x[1])":     cp.square(x[0]) - cp.square(x[1]),
    "sqrt(square(x[0]))":              cp.sqrt(cp.square(x[0])),
}
for name, e in exprs.items():
    print(f"{name:32s} curvature={e.curvature:9s} DCP={e.is_dcp()}")
print("abs(x[0]) is DCP:", cp.abs(x[0]).is_dcp(), "- the DCP way to write sqrt(square(.))")</code></pre>
<div class="out">norm(x, 2) + 3*x[0]              curvature=CONVEX    DCP=True
square(x[0] - 1)                 curvature=CONVEX    DCP=True
max(exp(x)) (pointwise max)      curvature=CONVEX    DCP=True
log_sum_exp(x)                   curvature=CONVEX    DCP=True
-log(y) + quad_over_lin(x, y)    curvature=CONVEX    DCP=True
sqrt(x[0])  (concave)            curvature=CONCAVE   DCP=True
square(x[0]) - square(x[1])      curvature=UNKNOWN   DCP=False
sqrt(square(x[0]))               curvature=QUASICONVEX DCP=False
abs(x[0]) is DCP: True - the DCP way to write sqrt(square(.))</div>
<p>The difference of two convex functions has <em>unknown</em> curvature, and <code>sqrt(square(x))</code> is reported only as quasiconvex: CVXPY refuses to guess. A DCP failure means “rewrite”, not necessarily “nonconvex”.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Subtracting convex functions or multiplying two variables (x*y): neither is DCP; products of variables are usually nonconvex.</li><li>Writing <code>cp.norm(x)**2</code> where <code>cp.sum_squares(x)</code> is cleaner and solver-friendly.</li><li>Writing a constraint concave ≤ constant, e.g. <code>cp.sqrt(x) &lt;= 1</code>: it is not DCP (its feasible set is fine, but write <code>x &lt;= 1</code>).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Nonnegative sums, affine composition, pointwise max/sup and the monotone composition rules preserve convexity.</li><li>DCP = these rules applied mechanically to atoms with known curvature and monotonicity.</li><li>DCP-failure ⇒ look for the right atom (abs, sum_squares, quad_over_lin, log_sum_exp, norm…).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.cvxpy.org/tutorial/dcp/index.html" target="_blank" rel="noopener">CVXPY — Disciplined Convex Programming</a></li><li><a href="https://dcp.stanford.edu/" target="_blank" rel="noopener">dcp.stanford.edu — interactive DCP analyser</a></li><li><a href="https://www.cvxpy.org/tutorial/functions/index.html" target="_blank" rel="noopener">CVXPY — Atomic functions (curvature and monotonicity table)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Show that f(w) = ∑<sub>i</sub> max(0, 1 − y<sub>i</sub>w<sup>T</sup>x<sub>i</sub>) + λ‖w‖<sub>2</sub><sup>2</sup> (λ ≥ 0) is convex.</li><li>Is −log(c<sup>T</sup>x + d) convex on c<sup>T</sup>x + d &gt; 0? Which rule?</li><li>Rewrite x<sup>2</sup>/y (y &gt; 0) in a DCP-compliant way in CVXPY.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Each term is a max of two affine functions of w (rule 3); the sum and the added λ‖w‖<sub>2</sub><sup>2</sup> keep convexity (rule 1). 2) Yes: −log is convex, composed with an affine map (rule 2). 3) <code>cp.quad_over_lin(x, y)</code>.</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 3 · Bài 3.3</span>
<h2>Phép toán bảo toàn tính lồi và DCP</h2>
<p class="lead">Kiểm Hessian bằng tay không theo kịp mô hình thật. Thay vào đó ta dựng hàm từ danh mục bằng những quy tắc chắc chắn bảo toàn tính lồi. CVXPY tự động hoá đúng các quy tắc này — gọi là quy hoạch lồi có kỷ luật (DCP).</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp dụng các phép toán cơ bản: tổng có trọng số không âm, hợp với phép affine, max theo điểm.</li><li>Dùng quy tắc hợp hàm cho h(g(x)).</li><li>Đọc báo cáo curvature của CVXPY và viết lại biểu thức không qua luật DCP.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Phép toán bảo toàn tính lồi (Boyd §3.2)</span>1. f<sub>1</sub>, f<sub>2</sub> lồi, w<sub>1</sub>, w<sub>2</sub> ≥ 0 ⇒ w<sub>1</sub>f<sub>1</sub> + w<sub>2</sub>f<sub>2</sub> lồi<br>2. f lồi ⇒ f(Ax + b) lồi<br>3. f<sub>1</sub>, …, f<sub>m</sub> lồi ⇒ max{f<sub>1</sub>(x), …, f<sub>m</sub>(x)} lồi (cả sup trên vô hạn hàm)<br>4. h lồi, g lồi, h không giảm ⇒ h(g(x)) lồi<br>   h lồi, g lõm, h không tăng ⇒ h(g(x)) lồi</div>
<p>Quy tắc 2 cho ngay ‖Ax − b‖ (mọi chuẩn) và log-sum-exp của các hàm affine; quy tắc 1 cho các hàm mất mát có chính quy hoá như ‖Ax − b‖<sub>2</sub><sup>2</sup> + λ‖x‖<sub>1</sub>; quy tắc 3 cho hinge loss max(0, 1 − y w<sup>T</sup>x), trị riêng lớn nhất λ<sub>max</sub>(X) = sup<sub>‖v‖=1</sub> v<sup>T</sup>Xv và các hàm tuyến tính từng khúc. Quy tắc 4 giải thích vì sao e<sup>g(x)</sup> lồi khi g lồi (exp lồi và tăng) và vì sao 1/g(x) lồi khi g lõm dương (1/u lồi và giảm trên u &gt; 0).</p>
<p><strong>Quy hoạch lồi có kỷ luật.</strong> CVXPY gán cho mọi biểu thức một <em>dấu</em> và một <em>curvature</em> (hằng, affine, lồi, lõm hay không rõ) chỉ dùng các quy tắc trên và một thư viện “nguyên tử” đã biết curvature và tính đơn điệu. Bài toán được chấp nhận nếu mục tiêu lồi (khi cực tiểu) hoặc lõm (khi cực đại) và mọi ràng buộc có dạng lồi ≤ lõm, lõm ≥ lồi, hoặc affine == affine. DCP là điều kiện <em>đủ</em>, không cần: vài hàm lồi bị loại khi viết vụng, và bạn phải viết lại bằng đúng nguyên tử.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — f(x) = e<sup>‖Ax − b‖<sub>2</sub><sup>2</sup></sup> + max(x<sub>1</sub>, 2x<sub>2</sub> − 1) có lồi không?</b></p>
<p>Bước 1: Ax − b affine; ‖·‖<sub>2</sub><sup>2</sup> lồi ⇒ g(x) = ‖Ax − b‖<sub>2</sub><sup>2</sup> lồi (quy tắc 2). Bước 2: exp lồi và không giảm ⇒ e<sup>g(x)</sup> lồi (quy tắc 4). Bước 3: x<sub>1</sub> và 2x<sub>2</sub> − 1 affine ⇒ max của chúng lồi (quy tắc 3). Bước 4: tổng các hàm lồi ⇒ lồi (quy tắc 1).</p>
<p><b>Một cái bẫy.</b> √(x<sup>2</sup>) = |x| là lồi, nhưng viết như vậy nó là sqrt (lõm, tăng) của square (lồi) — quy tắc 4 không áp được, nên DCP từ chối. Hãy viết <code>cp.abs(x)</code>.</p></div>
<pre><code class="language-python">import cvxpy as cp

x = cp.Variable(3); y = cp.Variable(pos=True)
exprs = {
    "norm(x, 2) + 3*x[0]":            cp.norm(x, 2) + 3 * x[0],
    "square(x[0] - 1)":                cp.square(x[0] - 1),
    "max(exp(x)) (pointwise max)":     cp.max(cp.exp(x)),
    "log_sum_exp(x)":                  cp.log_sum_exp(x),
    "-log(y) + quad_over_lin(x, y)":   -cp.log(y) + cp.quad_over_lin(x, y),
    "sqrt(x[0])  (concave)":           cp.sqrt(x[0]),
    "square(x[0]) - square(x[1])":     cp.square(x[0]) - cp.square(x[1]),
    "sqrt(square(x[0]))":              cp.sqrt(cp.square(x[0])),
}
for name, e in exprs.items():
    print(f"{name:32s} curvature={e.curvature:9s} DCP={e.is_dcp()}")
print("abs(x[0]) is DCP:", cp.abs(x[0]).is_dcp(), "- the DCP way to write sqrt(square(.))")</code></pre>
<div class="out">norm(x, 2) + 3*x[0]              curvature=CONVEX    DCP=True
square(x[0] - 1)                 curvature=CONVEX    DCP=True
max(exp(x)) (pointwise max)      curvature=CONVEX    DCP=True
log_sum_exp(x)                   curvature=CONVEX    DCP=True
-log(y) + quad_over_lin(x, y)    curvature=CONVEX    DCP=True
sqrt(x[0])  (concave)            curvature=CONCAVE   DCP=True
square(x[0]) - square(x[1])      curvature=UNKNOWN   DCP=False
sqrt(square(x[0]))               curvature=QUASICONVEX DCP=False
abs(x[0]) is DCP: True - the DCP way to write sqrt(square(.))</div>
<p>Hiệu của hai hàm lồi có curvature <em>không rõ</em> (UNKNOWN), và <code>sqrt(square(x))</code> chỉ được báo là tựa lồi (QUASICONVEX): CVXPY không đoán mò. DCP báo lỗi nghĩa là “hãy viết lại”, chưa chắc là “không lồi”.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Trừ các hàm lồi cho nhau hay nhân hai biến (x*y): cả hai đều không DCP; tích hai biến thường không lồi.</li><li>Viết <code>cp.norm(x)**2</code> trong khi <code>cp.sum_squares(x)</code> gọn và thân thiện với bộ giải hơn.</li><li>Viết ràng buộc lõm ≤ hằng, như <code>cp.sqrt(x) &lt;= 1</code>: không DCP (miền khả thi vẫn ổn, nhưng hãy viết <code>x &lt;= 1</code>).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tổng không âm, hợp affine, max/sup theo điểm và các quy tắc hợp hàm đơn điệu bảo toàn tính lồi.</li><li>DCP = áp máy móc các quy tắc đó lên các nguyên tử đã biết curvature và tính đơn điệu.</li><li>DCP báo lỗi ⇒ tìm đúng nguyên tử (abs, sum_squares, quad_over_lin, log_sum_exp, norm…).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.cvxpy.org/tutorial/dcp/index.html" target="_blank" rel="noopener">CVXPY — Disciplined Convex Programming</a></li><li><a href="https://dcp.stanford.edu/" target="_blank" rel="noopener">dcp.stanford.edu — công cụ phân tích DCP tương tác</a></li><li><a href="https://www.cvxpy.org/tutorial/functions/index.html" target="_blank" rel="noopener">CVXPY — Atomic functions (bảng curvature và tính đơn điệu)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Chứng minh f(w) = ∑<sub>i</sub> max(0, 1 − y<sub>i</sub>w<sup>T</sup>x<sub>i</sub>) + λ‖w‖<sub>2</sub><sup>2</sup> (λ ≥ 0) lồi.</li><li>−log(c<sup>T</sup>x + d) có lồi trên c<sup>T</sup>x + d &gt; 0 không? Quy tắc nào?</li><li>Viết lại x<sup>2</sup>/y (y &gt; 0) cho đúng DCP trong CVXPY.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Mỗi số hạng là max của hai hàm affine theo w (quy tắc 3); tổng và phần cộng λ‖w‖<sub>2</sub><sup>2</sup> giữ tính lồi (quy tắc 1). 2) Có: −log lồi, hợp với phép affine (quy tắc 2). 3) <code>cp.quad_over_lin(x, y)</code>.</p></div>`);

const q3 = QZ(3, 'Quiz — Chapter 3: Convex functions|||Quiz — Chương 3: Hàm lồi',
  'Kiểm tra định nghĩa, Jensen, epigraph, điều kiện bậc một/bậc hai, danh mục hàm lồi, phép toán bảo toàn tính lồi, luật DCP.', [
  Q('q1', 'f is convex if and only if|||f lồi khi và chỉ khi',
    ['its graph is a convex set|||đồ thị của nó là tập lồi', 'its epigraph is a convex set|||trên đồ thị của nó là tập lồi', 'its sublevel sets are convex|||tập mức dưới của nó lồi', 'f is differentiable|||f khả vi'], 1,
    'Convex sublevel sets are necessary but not sufficient (quasiconvexity).|||Tập mức dưới lồi là cần nhưng chưa đủ (tựa lồi).'),
  Q('q2', 'For a convex differentiable f, ∇f(x*) = 0 implies|||Với f lồi khả vi, ∇f(x*) = 0 suy ra',
    ['x* is a saddle point|||x* là điểm yên ngựa', 'x* is a global minimiser|||x* là điểm cực tiểu toàn cục', 'x* is only a local minimiser|||x* chỉ là cực tiểu địa phương', 'nothing|||không suy ra gì'], 1,
    'f(y) ≥ f(x*) + ∇f(x*)ᵀ(y − x*) = f(x*).|||f(y) ≥ f(x*) + ∇f(x*)ᵀ(y − x*) = f(x*).'),
  Q('q3', 'Jensen’s inequality for convex f and a random variable X states|||Bất đẳng thức Jensen với f lồi và biến ngẫu nhiên X là',
    ['E[f(X)] ≤ f(E[X])|||E[f(X)] ≤ f(E[X])', 'f(E[X]) ≤ E[f(X)]|||f(E[X]) ≤ E[f(X)]', 'f(E[X]) = E[f(X)]|||f(E[X]) = E[f(X)]', 'E[f(X)] ≥ 0|||E[f(X)] ≥ 0'], 1,
    'The function of the average is below the average of the function.|||Hàm của trung bình nằm dưới trung bình của hàm.'),
  Q('q4', 'f(x) = ½xᵀPx + qᵀx is convex exactly when|||f(x) = ½xᵀPx + qᵀx lồi đúng khi',
    ['q ≥ 0|||q ≥ 0', 'P is positive semidefinite|||P nửa xác định dương', 'P has a positive diagonal|||P có đường chéo dương', 'P is invertible|||P khả nghịch'], 1,
    'The Hessian is the constant matrix P.|||Hessian là ma trận hằng P.'),
  Q('q5', 'Which function is concave on its domain?|||Hàm nào lõm trên miền của nó?',
    ['e^x|||e^x', 'x log x (x > 0)|||x log x (x > 0)', '√x (x ≥ 0)|||√x (x ≥ 0)', '‖x‖₂|||‖x‖₂'], 2,
    'x^a is concave for 0 ≤ a ≤ 1.|||x^a lõm với 0 ≤ a ≤ 1.'),
  Q('q6', 'The Hessian of log-sum-exp is diag(z) − zzᵀ with z = softmax(x). It is|||Hessian của log-sum-exp là diag(z) − zzᵀ với z = softmax(x). Nó',
    ['negative definite|||xác định âm', 'positive semidefinite but singular|||nửa xác định dương nhưng suy biến', 'indefinite|||không xác định dấu', 'the identity|||là ma trận đơn vị'], 1,
    'vᵀ∇²f v is a weighted variance ≥ 0; it is 0 for v = (1, …, 1).|||vᵀ∇²f v là một phương sai có trọng số ≥ 0; bằng 0 khi v = (1, …, 1).'),
  Q('q7', 'Which expression is guaranteed convex?|||Biểu thức nào chắc chắn lồi?',
    ['f₁ − f₂ with f₁, f₂ convex|||f₁ − f₂ với f₁, f₂ lồi', 'max(f₁, f₂) with f₁, f₂ convex|||max(f₁, f₂) với f₁, f₂ lồi', 'f₁·f₂ with f₁, f₂ convex|||f₁·f₂ với f₁, f₂ lồi', 'min(f₁, f₂) with f₁, f₂ convex|||min(f₁, f₂) với f₁, f₂ lồi'], 1,
    'The pointwise maximum preserves convexity; min, products and differences do not.|||Max theo điểm bảo toàn tính lồi; min, tích và hiệu thì không.'),
  Q('q8', 'h convex and nondecreasing, g convex ⇒ h(g(x)) is|||h lồi không giảm, g lồi ⇒ h(g(x))',
    ['concave|||lõm', 'convex|||lồi', 'affine|||affine', 'unknown|||không rõ'], 1,
    'This is the scalar composition rule (e.g. e^{g(x)}).|||Đây là quy tắc hợp hàm vô hướng (vd e^{g(x)}).'),
  Q('q9', 'CVXPY reports cp.square(x) − cp.square(y) as|||CVXPY báo cp.square(x) − cp.square(y) là',
    ['CONVEX|||CONVEX', 'CONCAVE|||CONCAVE', 'UNKNOWN, not DCP|||UNKNOWN, không DCP', 'AFFINE|||AFFINE'], 2,
    'A difference of convex functions has unknown curvature under DCP.|||Hiệu hai hàm lồi có curvature không rõ theo DCP.'),
  Q('q10', 'A DCP-valid constraint has the form|||Một ràng buộc hợp lệ DCP có dạng',
    ['convex ≥ concave|||lồi ≥ lõm', 'convex ≤ concave|||lồi ≤ lõm', 'convex == convex|||lồi == lồi', 'concave ≤ convex|||lõm ≤ lồi'], 1,
    'convex ≤ concave (or affine == affine) defines a convex feasible set.|||lồi ≤ lõm (hoặc affine == affine) định nghĩa miền khả thi lồi.'),
]);

const ch3 = {
  title: 'Chapter 3 — Convex functions|||Chương 3 — Hàm lồi',
  description: 'Định nghĩa, Jensen, epigraph, điều kiện bậc một và bậc hai, danh mục hàm lồi, phép toán bảo toàn tính lồi, quy tắc hợp hàm và DCP trong CVXPY (Boyd Ch. 3 · EE364a bài 3).',
  lessons: [c31, c32, c33, q3],
};


// ───────────────────────────── Chương 4 — Bài toán tối ưu lồi: LP, QP, SOCP, SDP ─────────────────────────────
const c41 = L('cvo201-ts-4-1',
  '4.1 — Convex optimization problems: local = global, the optimality condition and equivalent reformulations|||4.1 — Bài toán tối ưu lồi: địa phương = toàn cục, điều kiện tối ưu và các phép biến đổi tương đương',
  'Dạng chuẩn của bài toán lồi, chứng minh cực tiểu địa phương là toàn cục, điều kiện tối ưu ∇f0(x)ᵀ(y − x) ≥ 0, biến đổi tương đương: epigraph, biến phụ (slack), loại ràng buộc đẳng thức (Boyd §4.1–4.2); Chebyshev fit ↔ LP.',
  `<span class="eyebrow">CVO201 · Chapter 4 · Lesson 4.1</span>
<h2>Convex optimization problems</h2>
<p class="lead">We now combine Chapters 2 and 3: a convex optimization problem minimises a convex function over a convex set described in a specific way. The payoff is the theorem that makes the whole subject work.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the standard form of a convex problem and check whether a given problem fits it.</li><li>Prove that every local minimum of a convex problem is global.</li><li>Use the optimality condition ∇f<sub>0</sub>(x)<sup>T</sup>(y − x) ≥ 0.</li><li>Transform problems equivalently with epigraph and slack variables.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Convex problem in standard form (Boyd §4.2)</span>minimize f<sub>0</sub>(x)   subject to f<sub>i</sub>(x) ≤ 0 (i = 1…m),  a<sub>i</sub><sup>T</sup>x = b<sub>i</sub> (i = 1…p)<br>f<sub>0</sub>, …, f<sub>m</sub> convex;  equality constraints affine</div>
<p>The feasible set is the intersection of convex sublevel sets {f<sub>i</sub> ≤ 0} with an affine set, hence convex. Note the equality constraints must be <strong>affine</strong>: x<sub>1</sub><sup>2</sup> + x<sub>2</sub><sup>2</sup> = 1 (a circle) is not a convex constraint even though the function is convex.</p>
<p><strong>Local = global.</strong> Suppose x is a local minimum but some feasible y has f<sub>0</sub>(y) &lt; f<sub>0</sub>(x). Take z = θy + (1 − θ)x with small θ &gt; 0. Then z is feasible (convex set), as close to x as we like, and f<sub>0</sub>(z) ≤ θf<sub>0</sub>(y) + (1 − θ)f<sub>0</sub>(x) &lt; f<sub>0</sub>(x) by convexity — contradicting local optimality. So no such y exists.</p>
<div class="formula"><span class="lbl">Optimality condition (differentiable f<sub>0</sub>, feasible set X)</span>x is optimal ⇔ x ∈ X and ∇f<sub>0</sub>(x)<sup>T</sup>(y − x) ≥ 0 for all y ∈ X</div>
<p>From x, every feasible direction goes “uphill”. If X = ℝ<sup>n</sup> this reduces to ∇f<sub>0</sub>(x) = 0. If x is interior to X, the gradient must also vanish; if x is on the boundary, −∇f<sub>0</sub>(x) must point out of X — it defines a supporting hyperplane (Lesson 2.3).</p>
<p><strong>Equivalent reformulations</strong> change the problem without changing its solution, and they are how we turn models into LP/QP/SOCP form:</p>
<ul><li><strong>Epigraph form:</strong> minimise t subject to f<sub>0</sub>(x) ≤ t — the objective becomes linear.</li><li><strong>Slack variables:</strong> a<sub>i</sub><sup>T</sup>x ≤ b<sub>i</sub> ⇔ a<sub>i</sub><sup>T</sup>x + s<sub>i</sub> = b<sub>i</sub>, s<sub>i</sub> ≥ 0.</li><li><strong>Eliminating equalities:</strong> write x = Fz + x<sub>0</sub> where F spans the nullspace of A (MAA102 Lesson 5.2).</li></ul>
<h3>✍️ Worked example — Chebyshev fit as an LP</h3>
<div class="callout"><p><b>Problem.</b> minimise ‖Ax − b‖<sub>∞</sub> = max<sub>i</sub> |a<sub>i</sub><sup>T</sup>x − b<sub>i</sub>|, the fit with the smallest worst-case error.</p>
<p>Step 1 (epigraph): minimise t subject to |a<sub>i</sub><sup>T</sup>x − b<sub>i</sub>| ≤ t for all i. Step 2: split each absolute value: −t ≤ a<sub>i</sub><sup>T</sup>x − b<sub>i</sub> ≤ t. Step 3: the objective t is linear and all 2k constraints are linear in (x, t): an LP with n + 1 variables. Both forms must give the same p*.</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp

rng = np.random.default_rng(4)
A = rng.normal(size=(30, 3)); b = rng.normal(size=30)

# (a) Chebyshev fit: minimize max_i |a_i^T x - b_i| written directly
x = cp.Variable(3)
p1 = cp.Problem(cp.Minimize(cp.norm(A @ x - b, "inf"))); p1.solve()

# (b) the same problem rewritten by hand as an LP with an epigraph variable t
x2 = cp.Variable(3); t = cp.Variable()
p2 = cp.Problem(cp.Minimize(t), [A @ x2 - b &lt;= t, A @ x2 - b &gt;= -t]); p2.solve()

print("norm-inf form : p* =", round(p1.value, 5), " x =", x.value.round(4))
print("LP epigraph   : p* =", round(p2.value, 5), " x =", x2.value.round(4))
print("least squares x =", np.linalg.lstsq(A, b, rcond=None)[0].round(4),
      " its max residual =", round(np.abs(A @ np.linalg.lstsq(A, b, rcond=None)[0] - b).max(), 5))</code></pre>
<div class="out">norm-inf form : p* = 1.31214  x = [0.2932 0.0984 0.137 ]
LP epigraph   : p* = 1.31214  x = [0.2932 0.0984 0.137 ]
least squares x = [ 0.1608  0.0847 -0.1442]  its max residual = 1.76833</div>
<p>Both formulations agree to every printed digit. The least-squares solution, which minimises the <em>sum of squares</em>, has a worse maximum residual (1.768 versus 1.312): different norms, different “best” answers.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing a nonaffine equality (‖x‖<sub>2</sub> = 1) and calling the problem convex. Relaxing it to ‖x‖<sub>2</sub> ≤ 1 is convex but may change the answer.</li><li>Maximising a convex function — that is <em>not</em> a convex problem (maximise ‖x‖ over a box is hard in general).</li><li>Forgetting that “equivalent” means same optimal x (after mapping back), not the same objective value in every reformulation.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Convex problem: convex objective, convex inequalities f<sub>i</sub> ≤ 0, affine equalities.</li><li>Every local minimum is global; the optimal set is convex.</li><li>Optimality: ∇f<sub>0</sub>(x)<sup>T</sup>(y − x) ≥ 0 for all feasible y.</li><li>Epigraph and slack reformulations turn models into standard classes.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://web.stanford.edu/class/ee364a/lectures/problems.pdf" target="_blank" rel="noopener">Stanford EE364a — Lecture 4: Convex optimization problems (slides)</a></li><li><a href="https://en.wikipedia.org/wiki/Convex_optimization" target="_blank" rel="noopener">Wikipedia — Convex optimization</a></li><li><a href="https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf" target="_blank" rel="noopener">Boyd &amp; Vandenberghe — §4.1–4.2 Optimization problems, convex optimization (PDF)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Is “minimise x<sub>1</sub><sup>2</sup> + x<sub>2</sub><sup>2</sup> subject to x<sub>1</sub>/(1 + x<sub>2</sub><sup>2</sup>) ≤ 0, (x<sub>1</sub> + x<sub>2</sub>)<sup>2</sup> = 0” convex as written? Is it equivalent to a convex problem?</li><li>Write minimise ‖Ax − b‖<sub>1</sub> as an LP.</li><li>Minimise f<sub>0</sub>(x) = x over X = [1, 3]. Check the optimality condition at x = 1.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Not as written (the first constraint function is not convex, the equality is not affine), but it is equivalent to minimise x<sub>1</sub><sup>2</sup> + x<sub>2</sub><sup>2</sup> s.t. x<sub>1</sub> ≤ 0, x<sub>1</sub> + x<sub>2</sub> = 0, which is convex (Boyd §4.2.1, problem (4.17)). 2) minimise 1<sup>T</sup>t s.t. −t ≤ Ax − b ≤ t. 3) f<sub>0</sub>′ = 1, and 1·(y − 1) ≥ 0 for every y ∈ [1, 3]: x = 1 is optimal.</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 4 · Bài 4.1</span>
<h2>Bài toán tối ưu lồi</h2>
<p class="lead">Giờ ta ghép Chương 2 và 3: bài toán tối ưu lồi cực tiểu một hàm lồi trên một tập lồi được mô tả theo một cách cụ thể. Phần thưởng là định lý làm nên cả môn học.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu dạng chuẩn của bài toán lồi và kiểm một bài toán có khớp dạng đó không.</li><li>Chứng minh mọi cực tiểu địa phương của bài toán lồi là toàn cục.</li><li>Dùng điều kiện tối ưu ∇f<sub>0</sub>(x)<sup>T</sup>(y − x) ≥ 0.</li><li>Biến đổi tương đương bằng biến epigraph và biến phụ.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Bài toán lồi dạng chuẩn (Boyd §4.2)</span>minimize f<sub>0</sub>(x)   subject to f<sub>i</sub>(x) ≤ 0 (i = 1…m),  a<sub>i</sub><sup>T</sup>x = b<sub>i</sub> (i = 1…p)<br>f<sub>0</sub>, …, f<sub>m</sub> lồi;  ràng buộc đẳng thức affine</div>
<p>Miền khả thi là giao của các tập mức dưới lồi {f<sub>i</sub> ≤ 0} với một tập affine, nên lồi. Lưu ý ràng buộc đẳng thức phải <strong>affine</strong>: x<sub>1</sub><sup>2</sup> + x<sub>2</sub><sup>2</sup> = 1 (một đường tròn) không phải ràng buộc lồi dù hàm vế trái lồi.</p>
<p><strong>Địa phương = toàn cục.</strong> Giả sử x là cực tiểu địa phương nhưng có y khả thi với f<sub>0</sub>(y) &lt; f<sub>0</sub>(x). Lấy z = θy + (1 − θ)x với θ &gt; 0 nhỏ. Khi đó z khả thi (tập lồi), gần x tuỳ ý, và f<sub>0</sub>(z) ≤ θf<sub>0</sub>(y) + (1 − θ)f<sub>0</sub>(x) &lt; f<sub>0</sub>(x) nhờ tính lồi — mâu thuẫn với tính tối ưu địa phương. Vậy không có y như thế.</p>
<div class="formula"><span class="lbl">Điều kiện tối ưu (f<sub>0</sub> khả vi, miền khả thi X)</span>x tối ưu ⇔ x ∈ X và ∇f<sub>0</sub>(x)<sup>T</sup>(y − x) ≥ 0 với mọi y ∈ X</div>
<p>Từ x, mọi hướng khả thi đều đi “lên dốc”. Nếu X = ℝ<sup>n</sup> điều kiện thành ∇f<sub>0</sub>(x) = 0. Nếu x nằm trong phần trong của X, gradient cũng phải bằng 0; nếu x nằm trên biên, −∇f<sub>0</sub>(x) phải chĩa ra ngoài X — nó xác định một siêu phẳng tựa (Bài 2.3).</p>
<p><strong>Biến đổi tương đương</strong> đổi dạng bài toán mà không đổi nghiệm, và là cách ta đưa mô hình về dạng LP/QP/SOCP:</p>
<ul><li><strong>Dạng epigraph:</strong> cực tiểu t với f<sub>0</sub>(x) ≤ t — mục tiêu thành tuyến tính.</li><li><strong>Biến phụ (slack):</strong> a<sub>i</sub><sup>T</sup>x ≤ b<sub>i</sub> ⇔ a<sub>i</sub><sup>T</sup>x + s<sub>i</sub> = b<sub>i</sub>, s<sub>i</sub> ≥ 0.</li><li><strong>Khử ràng buộc đẳng thức:</strong> viết x = Fz + x<sub>0</sub> với F sinh không gian không của A (MAA102 Bài 5.2).</li></ul>
<h3>✍️ Ví dụ giải từng bước — khớp Chebyshev thành LP</h3>
<div class="callout"><p><b>Bài toán.</b> cực tiểu ‖Ax − b‖<sub>∞</sub> = max<sub>i</sub> |a<sub>i</sub><sup>T</sup>x − b<sub>i</sub>|, bài khớp có sai số tệ nhất nhỏ nhất.</p>
<p>Bước 1 (epigraph): cực tiểu t với |a<sub>i</sub><sup>T</sup>x − b<sub>i</sub>| ≤ t với mọi i. Bước 2: tách mỗi giá trị tuyệt đối: −t ≤ a<sub>i</sub><sup>T</sup>x − b<sub>i</sub> ≤ t. Bước 3: mục tiêu t tuyến tính và cả 2k ràng buộc tuyến tính theo (x, t): một LP với n + 1 biến. Hai dạng phải cho cùng p*.</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp

rng = np.random.default_rng(4)
A = rng.normal(size=(30, 3)); b = rng.normal(size=30)

# (a) Chebyshev fit: minimize max_i |a_i^T x - b_i| written directly
x = cp.Variable(3)
p1 = cp.Problem(cp.Minimize(cp.norm(A @ x - b, "inf"))); p1.solve()

# (b) the same problem rewritten by hand as an LP with an epigraph variable t
x2 = cp.Variable(3); t = cp.Variable()
p2 = cp.Problem(cp.Minimize(t), [A @ x2 - b &lt;= t, A @ x2 - b &gt;= -t]); p2.solve()

print("norm-inf form : p* =", round(p1.value, 5), " x =", x.value.round(4))
print("LP epigraph   : p* =", round(p2.value, 5), " x =", x2.value.round(4))
print("least squares x =", np.linalg.lstsq(A, b, rcond=None)[0].round(4),
      " its max residual =", round(np.abs(A @ np.linalg.lstsq(A, b, rcond=None)[0] - b).max(), 5))</code></pre>
<div class="out">norm-inf form : p* = 1.31214  x = [0.2932 0.0984 0.137 ]
LP epigraph   : p* = 1.31214  x = [0.2932 0.0984 0.137 ]
least squares x = [ 0.1608  0.0847 -0.1442]  its max residual = 1.76833</div>
<p>Hai cách viết khớp nhau tới từng chữ số in ra. Nghiệm bình phương tối thiểu, vốn cực tiểu <em>tổng bình phương</em>, có phần dư lớn nhất tệ hơn (1,768 so với 1,312): chuẩn khác nhau, “tốt nhất” khác nhau.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết một đẳng thức không affine (‖x‖<sub>2</sub> = 1) mà gọi bài toán là lồi. Nới thành ‖x‖<sub>2</sub> ≤ 1 thì lồi nhưng có thể đổi đáp án.</li><li>Cực đại một hàm lồi — đó <em>không</em> phải bài toán lồi (cực đại ‖x‖ trên một hộp nói chung là khó).</li><li>Quên rằng “tương đương” nghĩa là cùng x tối ưu (sau khi ánh xạ ngược), không phải mọi cách viết đều cùng giá trị mục tiêu.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Bài toán lồi: mục tiêu lồi, bất đẳng thức lồi f<sub>i</sub> ≤ 0, đẳng thức affine.</li><li>Mọi cực tiểu địa phương là toàn cục; tập nghiệm tối ưu là tập lồi.</li><li>Tối ưu: ∇f<sub>0</sub>(x)<sup>T</sup>(y − x) ≥ 0 với mọi y khả thi.</li><li>Biến đổi epigraph và slack đưa mô hình về các lớp chuẩn.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://web.stanford.edu/class/ee364a/lectures/problems.pdf" target="_blank" rel="noopener">Stanford EE364a — Bài 4: Bài toán tối ưu lồi (slide)</a></li><li><a href="https://en.wikipedia.org/wiki/Convex_optimization" target="_blank" rel="noopener">Wikipedia — Convex optimization</a></li><li><a href="https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf" target="_blank" rel="noopener">Boyd &amp; Vandenberghe — §4.1–4.2 Bài toán tối ưu, tối ưu lồi (PDF)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Bài “cực tiểu x<sub>1</sub><sup>2</sup> + x<sub>2</sub><sup>2</sup> với x<sub>1</sub>/(1 + x<sub>2</sub><sup>2</sup>) ≤ 0, (x<sub>1</sub> + x<sub>2</sub>)<sup>2</sup> = 0” có lồi như đang viết không? Có tương đương một bài lồi không?</li><li>Viết bài cực tiểu ‖Ax − b‖<sub>1</sub> thành LP.</li><li>Cực tiểu f<sub>0</sub>(x) = x trên X = [1, 3]. Kiểm điều kiện tối ưu tại x = 1.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Như đang viết thì không (hàm ràng buộc thứ nhất không lồi, đẳng thức không affine), nhưng nó tương đương bài cực tiểu x<sub>1</sub><sup>2</sup> + x<sub>2</sub><sup>2</sup> với x<sub>1</sub> ≤ 0, x<sub>1</sub> + x<sub>2</sub> = 0, là bài lồi (Boyd §4.2.1, bài (4.17)). 2) cực tiểu 1<sup>T</sup>t với −t ≤ Ax − b ≤ t. 3) f<sub>0</sub>′ = 1, và 1·(y − 1) ≥ 0 với mọi y ∈ [1, 3]: x = 1 tối ưu.</p></div>`);

const c42 = L('cvo201-ts-4-2',
  '4.2 — Linear programming: forms, geometry and solving LPs with CVXPY and SciPy|||4.2 — Quy hoạch tuyến tính: các dạng, hình học và giải LP bằng CVXPY và SciPy',
  'Dạng tổng quát và dạng chuẩn của LP, hình học đỉnh của đa diện, đơn hình vs điểm trong, bài toán khẩu phần (diet), linprog(method="highs"), ràng buộc chặt (active) (Boyd §4.3).',
  `<span class="eyebrow">CVO201 · Chapter 4 · Lesson 4.2</span>
<h2>Linear programming</h2>
<p class="lead">Linear programs are the workhorse of operations research: production planning, transport, blending, scheduling and network flows are all LPs. They are also the simplest convex problems, and every solver is built around them.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write an LP in general form and in standard form.</li><li>Explain the vertex geometry of LP solutions.</li><li>Model and solve a diet (blending) problem in CVXPY and in <code>scipy.optimize.linprog</code>, and read which constraints are active.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">LP forms (Boyd §4.3)</span>general form: minimize c<sup>T</sup>x + d  subject to Gx ⪯ h, Ax = b<br>standard form: minimize c<sup>T</sup>x  subject to Ax = b, x ⪰ 0</div>
<p>(⪯ means componentwise ≤.) Any general LP can be put in standard form with slack variables and by splitting free variables as x = x<sup>+</sup> − x<sup>−</sup> with x<sup>±</sup> ⪰ 0. Solvers accept either form; modelling tools do the conversion for you.</p>
<p><strong>Geometry.</strong> The feasible set is a polyhedron; the objective's level sets c<sup>T</sup>x = const are parallel hyperplanes. Sliding the hyperplane in the direction −c until it last touches the polyhedron finds the optimum — at a vertex, or along a whole edge or face if c is perpendicular to it (multiple optima). The <strong>simplex method</strong> walks from vertex to vertex along edges that improve the objective; <strong>interior-point methods</strong> (Chapter 8) cut through the interior. Modern solvers such as HiGHS implement both.</p>
<p>A constraint is <strong>active</strong> (tight) at x* if it holds with equality. At a vertex in ℝ<sup>n</sup> at least n constraints are active. Active constraints are exactly the ones that matter: relaxing an inactive constraint a little does not change the solution, while relaxing an active one usually improves p* — measured by the dual variables of Chapter 5.</p>
<h3>✍️ Worked example — the diet problem</h3>
<div class="callout"><p><b>Problem.</b> Rice, eggs and beef cost 2, 3.5 and 8 per unit. They give 4, 6, 25 g protein and 80, 70, 90 (×10 kcal) energy per unit. We need at least 60 g protein and 1000 (×10 kcal), and at most 10 units of each food. Minimise cost.</p>
<p>Step 1 (variables): x ∈ ℝ<sup>3</sup>, x ⪰ 0. Step 2 (constraints): Nx ⪰ need, x ⪯ 10. Step 3 (objective): minimise c<sup>T</sup>x. Step 4 (intuition): rice is the cheapest energy (2/80 = 0.025 per unit of energy) so we expect rice at its cap 10; protein is cheapest from beef (8/25 = 0.32 per gram) versus eggs (3.5/6 ≈ 0.58), but eggs also bring energy — the solver balances this.</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp
from scipy.optimize import linprog

# Diet problem: 3 foods, 2 nutrients. cost per unit and nutrients per unit
cost = np.array([2.0, 3.5, 8.0])            # rice, eggs, beef
N = np.array([[4.0, 6.0, 25.0],             # protein per unit
              [80.0, 70.0, 90.0]])          # energy per unit (x10 kcal)
need = np.array([60.0, 1000.0])

x = cp.Variable(3, nonneg=True)
prob = cp.Problem(cp.Minimize(cost @ x), [N @ x &gt;= need, x &lt;= 10])
prob.solve()
print("cvxpy  : cost =", round(prob.value, 4), " x =", x.value.round(4))

# same LP in scipy: linprog wants A_ub x &lt;= b_ub, so flip the &gt;= rows
res = linprog(cost, A_ub=-N, b_ub=-need, bounds=[(0, 10)] * 3, method="highs")
print("linprog: cost =", round(res.fun, 4), " x =", res.x.round(4), " status:", res.message)
print("active constraints N x - need =", (N @ res.x - need).round(4))</code></pre>
<div class="out">cvxpy  : cost = 30.5785  x = [10.      2.6446  0.1653]
linprog: cost = 30.5785  x = [10.      2.6446  0.1653]  status: Optimization terminated successfully. (HiGHS Status 7: Optimal)
active constraints N x - need = [0. 0.]</div>
<p>Rice is at its upper bound and both nutrient constraints are active (residuals 0): we buy exactly the protein and energy we need. CVXPY and SciPy/HiGHS agree. Note that <code>linprog</code> only accepts ≤ constraints, so we multiply the ≥ rows by −1.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting nonnegativity: without x ⪰ 0 the diet LP would “buy negative beef” to cut costs.</li><li>Sign errors when converting ≥ to ≤ for <code>linprog</code> — always print N x − need after solving.</li><li>Expecting a unique solution: if c is parallel to a face, many plans are optimal and different solvers may return different ones.</li><li>Using an LP when the variables must be integers (number of trucks): that is integer programming, which is not convex.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>LP = linear objective + linear (in)equalities; feasible set = polyhedron.</li><li>Optima occur at vertices (or along faces); simplex walks vertices, interior-point cuts across.</li><li>Active constraints at x* are the binding resources.</li><li>CVXPY for modelling, <code>linprog(method="highs")</code> for direct matrix input.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.linprog.html" target="_blank" rel="noopener">SciPy — scipy.optimize.linprog</a></li><li><a href="https://en.wikipedia.org/wiki/Linear_programming" target="_blank" rel="noopener">Wikipedia — Linear programming</a></li><li><a href="https://en.wikipedia.org/wiki/Simplex_algorithm" target="_blank" rel="noopener">Wikipedia — Simplex algorithm</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Convert “minimise x<sub>1</sub> − x<sub>2</sub> s.t. x<sub>1</sub> + x<sub>2</sub> ≤ 4, x<sub>1</sub> free, x<sub>2</sub> ≥ 0” to standard form.</li><li>Solve by vertices: maximise x + y s.t. x + 2y ≤ 6, 3x + y ≤ 8, x, y ≥ 0.</li><li>In the diet output, which constraints are active? What would you expect if the protein requirement rose a little?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) x<sub>1</sub> = u − v; minimise u − v − x<sub>2</sub> s.t. u − v + x<sub>2</sub> + s = 4, u, v, x<sub>2</sub>, s ≥ 0. 2) Vertices (0, 0), (8/3, 0), (0, 3), and the intersection x = 2, y = 2; values 0, 2.67, 3, 4 ⇒ optimum (2, 2), value 4. 3) Rice ≤ 10, protein ≥ 60 and energy ≥ 1000 are active; raising the protein requirement must raise the cost (the protein constraint has a positive shadow price, Lesson 5.4).</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 4 · Bài 4.2</span>
<h2>Quy hoạch tuyến tính</h2>
<p class="lead">Quy hoạch tuyến tính là “ngựa thồ” của vận trù học: lập kế hoạch sản xuất, vận tải, pha trộn, xếp lịch và luồng mạng đều là LP. Chúng cũng là bài toán lồi đơn giản nhất, và mọi bộ giải đều xây quanh chúng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết LP ở dạng tổng quát và dạng chuẩn.</li><li>Giải thích hình học đỉnh của nghiệm LP.</li><li>Mô hình hoá và giải bài khẩu phần (pha trộn) bằng CVXPY và <code>scipy.optimize.linprog</code>, đọc ràng buộc nào chặt.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Các dạng LP (Boyd §4.3)</span>dạng tổng quát: minimize c<sup>T</sup>x + d  subject to Gx ⪯ h, Ax = b<br>dạng chuẩn: minimize c<sup>T</sup>x  subject to Ax = b, x ⪰ 0</div>
<p>(⪯ nghĩa là ≤ theo từng thành phần.) Mọi LP tổng quát đưa được về dạng chuẩn bằng biến phụ và tách biến tự do x = x<sup>+</sup> − x<sup>−</sup> với x<sup>±</sup> ⪰ 0. Bộ giải nhận dạng nào cũng được; công cụ mô hình hoá tự chuyển đổi giúp bạn.</p>
<p><strong>Hình học.</strong> Miền khả thi là đa diện; các tập mức của mục tiêu c<sup>T</sup>x = hằng là các siêu phẳng song song. Trượt siêu phẳng theo hướng −c tới lúc chạm đa diện lần cuối là tìm được tối ưu — tại một đỉnh, hoặc dọc cả một cạnh/mặt nếu c vuông góc với nó (nhiều nghiệm tối ưu). <strong>Phương pháp đơn hình</strong> đi từ đỉnh sang đỉnh dọc các cạnh làm mục tiêu tốt lên; <strong>phương pháp điểm trong</strong> (Chương 8) xuyên qua phần trong. Bộ giải hiện đại như HiGHS cài đặt cả hai.</p>
<p>Ràng buộc là <strong>chặt</strong> (active) tại x* nếu nó thoả với dấu bằng. Tại một đỉnh trong ℝ<sup>n</sup> có ít nhất n ràng buộc chặt. Ràng buộc chặt chính là những cái có ý nghĩa: nới nhẹ một ràng buộc không chặt không đổi nghiệm, còn nới một ràng buộc chặt thường làm p* tốt lên — đo bằng biến đối ngẫu ở Chương 5.</p>
<h3>✍️ Ví dụ giải từng bước — bài khẩu phần</h3>
<div class="callout"><p><b>Bài toán.</b> Gạo, trứng, thịt bò giá 2; 3,5 và 8 mỗi đơn vị. Chúng cho 4, 6, 25 g đạm và 80, 70, 90 (×10 kcal) năng lượng mỗi đơn vị. Cần ít nhất 60 g đạm và 1000 (×10 kcal), mỗi loại mua tối đa 10 đơn vị. Cực tiểu chi phí.</p>
<p>Bước 1 (biến): x ∈ ℝ<sup>3</sup>, x ⪰ 0. Bước 2 (ràng buộc): Nx ⪰ need, x ⪯ 10. Bước 3 (mục tiêu): cực tiểu c<sup>T</sup>x. Bước 4 (trực giác): gạo là nguồn năng lượng rẻ nhất (2/80 = 0,025 mỗi đơn vị năng lượng) nên ta đoán gạo chạm trần 10; đạm rẻ nhất từ bò (8/25 = 0,32 mỗi gam) so với trứng (3,5/6 ≈ 0,58), nhưng trứng còn cho năng lượng — bộ giải cân bằng việc này.</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp
from scipy.optimize import linprog

# Diet problem: 3 foods, 2 nutrients. cost per unit and nutrients per unit
cost = np.array([2.0, 3.5, 8.0])            # rice, eggs, beef
N = np.array([[4.0, 6.0, 25.0],             # protein per unit
              [80.0, 70.0, 90.0]])          # energy per unit (x10 kcal)
need = np.array([60.0, 1000.0])

x = cp.Variable(3, nonneg=True)
prob = cp.Problem(cp.Minimize(cost @ x), [N @ x &gt;= need, x &lt;= 10])
prob.solve()
print("cvxpy  : cost =", round(prob.value, 4), " x =", x.value.round(4))

# same LP in scipy: linprog wants A_ub x &lt;= b_ub, so flip the &gt;= rows
res = linprog(cost, A_ub=-N, b_ub=-need, bounds=[(0, 10)] * 3, method="highs")
print("linprog: cost =", round(res.fun, 4), " x =", res.x.round(4), " status:", res.message)
print("active constraints N x - need =", (N @ res.x - need).round(4))</code></pre>
<div class="out">cvxpy  : cost = 30.5785  x = [10.      2.6446  0.1653]
linprog: cost = 30.5785  x = [10.      2.6446  0.1653]  status: Optimization terminated successfully. (HiGHS Status 7: Optimal)
active constraints N x - need = [0. 0.]</div>
<p>Gạo chạm cận trên và cả hai ràng buộc dinh dưỡng đều chặt (phần dư 0): ta mua đúng lượng đạm và năng lượng cần. CVXPY và SciPy/HiGHS khớp nhau. Lưu ý <code>linprog</code> chỉ nhận ràng buộc ≤, nên ta nhân các dòng ≥ với −1.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên điều kiện không âm: thiếu x ⪰ 0, LP khẩu phần sẽ “mua thịt bò âm” để giảm chi phí.</li><li>Sai dấu khi chuyển ≥ thành ≤ cho <code>linprog</code> — luôn in N x − need sau khi giải.</li><li>Chờ nghiệm duy nhất: nếu c song song một mặt, nhiều kế hoạch cùng tối ưu và bộ giải khác nhau có thể trả nghiệm khác nhau.</li><li>Dùng LP khi biến phải là số nguyên (số xe tải): đó là quy hoạch nguyên, không lồi.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>LP = mục tiêu tuyến tính + (bất) đẳng thức tuyến tính; miền khả thi = đa diện.</li><li>Tối ưu đạt tại đỉnh (hoặc dọc mặt); đơn hình đi qua các đỉnh, điểm trong xuyên qua phần trong.</li><li>Ràng buộc chặt tại x* là các tài nguyên bị ràng buộc.</li><li>CVXPY để mô hình hoá, <code>linprog(method="highs")</code> khi nhập thẳng ma trận.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.linprog.html" target="_blank" rel="noopener">SciPy — scipy.optimize.linprog</a></li><li><a href="https://en.wikipedia.org/wiki/Linear_programming" target="_blank" rel="noopener">Wikipedia — Linear programming</a></li><li><a href="https://en.wikipedia.org/wiki/Simplex_algorithm" target="_blank" rel="noopener">Wikipedia — Simplex algorithm</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Chuyển “cực tiểu x<sub>1</sub> − x<sub>2</sub> với x<sub>1</sub> + x<sub>2</sub> ≤ 4, x<sub>1</sub> tự do, x<sub>2</sub> ≥ 0” về dạng chuẩn.</li><li>Giải bằng các đỉnh: cực đại x + y với x + 2y ≤ 6, 3x + y ≤ 8, x, y ≥ 0.</li><li>Trong output bài khẩu phần, ràng buộc nào chặt? Bạn đoán gì nếu nhu cầu đạm tăng nhẹ?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) x<sub>1</sub> = u − v; cực tiểu u − v − x<sub>2</sub> với u − v + x<sub>2</sub> + s = 4, u, v, x<sub>2</sub>, s ≥ 0. 2) Các đỉnh (0, 0), (8/3, 0), (0, 3) và giao điểm x = 2, y = 2; giá trị 0; 2,67; 3; 4 ⇒ tối ưu (2, 2), giá trị 4. 3) Gạo ≤ 10, đạm ≥ 60 và năng lượng ≥ 1000 chặt; tăng nhu cầu đạm chắc chắn tăng chi phí (ràng buộc đạm có giá bóng dương, Bài 5.4).</p></div>`);

const c43 = L('cvo201-ts-4-3',
  '4.3 — Quadratic programs and second-order cone programs|||4.3 — Quy hoạch toàn phương và quy hoạch nón bậc hai',
  'QP: mục tiêu toàn phương lồi, ràng buộc tuyến tính (chiếu lên đa diện, bình phương tối thiểu có ràng buộc); SOCP: ràng buộc ‖Ax + b‖₂ ≤ cᵀx + d, LP bền vững, điểm Fermat–Weber; thứ bậc LP ⊂ QP ⊂ SOCP (Boyd §4.4).',
  `<span class="eyebrow">CVO201 · Chapter 4 · Lesson 4.3</span>
<h2>Quadratic programs and second-order cone programs</h2>
<p class="lead">Replace the linear objective by a convex quadratic and you get a QP — the form of least squares with constraints, portfolio optimization and the SVM. Allow Euclidean-norm constraints and you get an SOCP, which covers robust LPs and geometric problems such as facility location.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write the standard forms of QP and SOCP and recognise them in applications.</li><li>Solve a projection problem (a QP) by hand and check it in CVXPY.</li><li>Model a sum-of-distances problem as an SOCP.</li><li>Explain the hierarchy LP ⊂ QP ⊂ SOCP ⊂ SDP.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">QP and SOCP (Boyd §4.4)</span>QP: minimize ½x<sup>T</sup>Px + q<sup>T</sup>x + r  subject to Gx ⪯ h, Ax = b,  with P ⪰ 0<br>SOCP: minimize f<sup>T</sup>x  subject to ‖A<sub>i</sub>x + b<sub>i</sub>‖<sub>2</sub> ≤ c<sub>i</sub><sup>T</sup>x + d<sub>i</sub> (i = 1…m), Fx = g</div>
<p>A <strong>QP</strong> minimises a convex quadratic over a polyhedron. Examples: least squares with bounds on x; the Euclidean projection of a point p onto a polyhedron (minimise ‖x − p‖<sub>2</sub><sup>2</sup> over the polyhedron); the Markowitz portfolio (Lesson 6.5); the soft-margin SVM (Lesson 6.3). Solvers such as OSQP are specialised for QPs.</p>
<p>An <strong>SOCP</strong> constraint says that an affine function of x lies in the second-order cone {(u, t) : ‖u‖<sub>2</sub> ≤ t} of Lesson 2.2. Every LP is an SOCP (take A<sub>i</sub> = 0), and every convex QP can be written as an SOCP (‖P<sup>1/2</sup>x‖<sub>2</sub><sup>2</sup> ≤ t is a second-order cone constraint after a rotation). A famous example is the <strong>robust LP</strong>: if the data a<sub>i</sub> is only known to lie in an ellipsoid {ā<sub>i</sub> + P<sub>i</sub>u : ‖u‖<sub>2</sub> ≤ 1}, requiring a<sub>i</sub><sup>T</sup>x ≤ b<sub>i</sub> for <em>all</em> such a<sub>i</sub> gives ā<sub>i</sub><sup>T</sup>x + ‖P<sub>i</sub><sup>T</sup>x‖<sub>2</sub> ≤ b<sub>i</sub> — an SOCP constraint. Another is the <strong>Fermat–Weber problem</strong>: place a warehouse z to minimise the total distance ∑‖z − c<sub>j</sub>‖<sub>2</sub> to cities c<sub>j</sub>; there is no closed formula, but it is an SOCP.</p>
<h3>✍️ Worked example — projection onto a polygon (QP)</h3>
<div class="callout"><p><b>Problem.</b> Find the point of the set {0 ≤ x ≤ 1, x<sub>1</sub> + x<sub>2</sub> ≤ 1.2} closest to p = (1.5, 0.9).</p>
<p>Step 1: p violates x<sub>1</sub> + x<sub>2</sub> ≤ 1.2 (sum 2.4). Project onto the line x<sub>1</sub> + x<sub>2</sub> = 1.2 along its normal (1, 1): subtract (2.4 − 1.2)/2 = 0.6 from each coordinate ⇒ (0.9, 0.3). Step 2: check the box: 0 ≤ 0.9 ≤ 1 and 0 ≤ 0.3 ≤ 1, so the box constraints are inactive and (0.9, 0.3) is the answer. Step 3: squared distance 0.6<sup>2</sup> + 0.6<sup>2</sup> = 0.72.</p>
<p><b>Then the SOCP.</b> Four cities at (0, 0), (10, 0), (0, 6), (9, 8). The centroid minimises the sum of <em>squared</em> distances; the Fermat–Weber point minimises the sum of distances and is slightly different.</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp

# QP: closest point to p inside the box [0,1]^2 intersected with x1 + x2 &lt;= 1.2
p = np.array([1.5, 0.9])
x = cp.Variable(2)
qp = cp.Problem(cp.Minimize(cp.sum_squares(x - p)), [x &gt;= 0, x &lt;= 1, cp.sum(x) &lt;= 1.2])
qp.solve()
print("QP  : x* =", x.value.round(4), " distance^2 =", round(qp.value, 4))

# SOCP: the Fermat-Weber point minimising the SUM of Euclidean distances to 4 cities
C = np.array([[0, 0], [10, 0], [0, 6], [9, 8.0]])
z = cp.Variable(2)
socp = cp.Problem(cp.Minimize(sum(cp.norm(z - c, 2) for c in C)))
socp.solve()
print("SOCP: z* =", z.value.round(4), " total distance =", round(socp.value, 4))
print("compare centroid", C.mean(axis=0), "total =", round(np.linalg.norm(C - C.mean(axis=0), axis=1).sum(), 4))</code></pre>
<div class="out">QP  : x* = [0.9 0.3]  distance^2 = 0.72
SOCP: z* = [4.0292 3.5819]  total distance = 23.7035
compare centroid [4.75 3.5 ] total = 23.7674</div>
<p>The QP matches the hand projection exactly. The Fermat–Weber point (4.03, 3.58) saves about 0.064 in total distance over the centroid (4.75, 3.5) — small here, but the two criteria really are different.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing a QP with an indefinite P (e.g. maximising risk) — it is no longer convex and CVXPY will reject <code>quad_form</code> with a non-PSD matrix.</li><li>Writing ‖Ax + b‖<sub>2</sub> ≥ c<sup>T</sup>x + d: the reversed inequality is not convex.</li><li>Squaring an SOCP constraint by hand to “simplify”: ‖u‖<sub>2</sub><sup>2</sup> ≤ t<sup>2</sup> loses the requirement t ≥ 0 and is not DCP.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>QP: convex quadratic objective (P ⪰ 0) + linear constraints; projections, constrained least squares, portfolios, SVM.</li><li>SOCP: constraints ‖A<sub>i</sub>x + b<sub>i</sub>‖<sub>2</sub> ≤ c<sub>i</sub><sup>T</sup>x + d<sub>i</sub>; robust LP, sums of distances.</li><li>LP ⊂ QP ⊂ SOCP ⊂ SDP: each class contains the previous one.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.cvxpy.org/examples/basic/quadratic_program.html" target="_blank" rel="noopener">CVXPY example — Quadratic program</a></li><li><a href="https://www.cvxpy.org/examples/basic/socp.html" target="_blank" rel="noopener">CVXPY example — Second-order cone program</a></li><li><a href="https://en.wikipedia.org/wiki/Second-order_cone_programming" target="_blank" rel="noopener">Wikipedia — Second-order cone programming</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Project p = (2, 2) onto {x : x<sub>1</sub> + x<sub>2</sub> ≤ 1} by hand.</li><li>Write “minimise ‖Ax − b‖<sub>2</sub> + ‖x‖<sub>1</sub>” in a form CVXPY accepts. Which class is it?</li><li>Write the robust constraint (a + u)<sup>T</sup>x ≤ b for all ‖u‖<sub>2</sub> ≤ ρ without the “for all”.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Excess 4 − 1 = 3, subtract 1.5 from each coordinate ⇒ (0.5, 0.5). 2) <code>cp.norm(A @ x - b, 2) + cp.norm1(x)</code>; an SOCP (the ℓ<sub>1</sub> part is linear after the epigraph trick). 3) The worst u is ρx/‖x‖<sub>2</sub>, so a<sup>T</sup>x + ρ‖x‖<sub>2</sub> ≤ b.</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 4 · Bài 4.3</span>
<h2>Quy hoạch toàn phương và quy hoạch nón bậc hai</h2>
<p class="lead">Thay mục tiêu tuyến tính bằng một hàm toàn phương lồi, ta được QP — dạng của bình phương tối thiểu có ràng buộc, tối ưu danh mục và SVM. Cho phép ràng buộc chuẩn Euclid, ta được SOCP, bao gồm LP bền vững và các bài hình học như chọn vị trí kho.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết dạng chuẩn của QP và SOCP và nhận ra chúng trong ứng dụng.</li><li>Giải tay một bài chiếu (một QP) và kiểm bằng CVXPY.</li><li>Mô hình hoá bài tổng khoảng cách thành SOCP.</li><li>Giải thích thứ bậc LP ⊂ QP ⊂ SOCP ⊂ SDP.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">QP và SOCP (Boyd §4.4)</span>QP: minimize ½x<sup>T</sup>Px + q<sup>T</sup>x + r  subject to Gx ⪯ h, Ax = b,  với P ⪰ 0<br>SOCP: minimize f<sup>T</sup>x  subject to ‖A<sub>i</sub>x + b<sub>i</sub>‖<sub>2</sub> ≤ c<sub>i</sub><sup>T</sup>x + d<sub>i</sub> (i = 1…m), Fx = g</div>
<p><strong>QP</strong> cực tiểu một hàm toàn phương lồi trên một đa diện. Ví dụ: bình phương tối thiểu có cận cho x; phép chiếu Euclid một điểm p lên đa diện (cực tiểu ‖x − p‖<sub>2</sub><sup>2</sup> trên đa diện); danh mục Markowitz (Bài 6.5); SVM lề mềm (Bài 6.3). Bộ giải như OSQP chuyên cho QP.</p>
<p>Ràng buộc <strong>SOCP</strong> nói rằng một hàm affine của x nằm trong nón bậc hai {(u, t) : ‖u‖<sub>2</sub> ≤ t} ở Bài 2.2. Mọi LP là SOCP (lấy A<sub>i</sub> = 0), và mọi QP lồi viết được thành SOCP (‖P<sup>1/2</sup>x‖<sub>2</sub><sup>2</sup> ≤ t là ràng buộc nón bậc hai sau một phép quay). Ví dụ nổi tiếng là <strong>LP bền vững</strong>: nếu dữ liệu a<sub>i</sub> chỉ biết nằm trong ellipsoid {ā<sub>i</sub> + P<sub>i</sub>u : ‖u‖<sub>2</sub> ≤ 1}, đòi a<sub>i</sub><sup>T</sup>x ≤ b<sub>i</sub> với <em>mọi</em> a<sub>i</sub> như thế cho ā<sub>i</sub><sup>T</sup>x + ‖P<sub>i</sub><sup>T</sup>x‖<sub>2</sub> ≤ b<sub>i</sub> — một ràng buộc SOCP. Ví dụ khác là <strong>bài Fermat–Weber</strong>: đặt kho z để cực tiểu tổng khoảng cách ∑‖z − c<sub>j</sub>‖<sub>2</sub> tới các thành phố c<sub>j</sub>; không có công thức đóng, nhưng nó là SOCP.</p>
<h3>✍️ Ví dụ giải từng bước — chiếu lên đa giác (QP)</h3>
<div class="callout"><p><b>Bài toán.</b> Tìm điểm của tập {0 ≤ x ≤ 1, x<sub>1</sub> + x<sub>2</sub> ≤ 1,2} gần p = (1,5; 0,9) nhất.</p>
<p>Bước 1: p vi phạm x<sub>1</sub> + x<sub>2</sub> ≤ 1,2 (tổng 2,4). Chiếu lên đường x<sub>1</sub> + x<sub>2</sub> = 1,2 theo pháp tuyến (1, 1): trừ (2,4 − 1,2)/2 = 0,6 khỏi mỗi toạ độ ⇒ (0,9; 0,3). Bước 2: kiểm hộp: 0 ≤ 0,9 ≤ 1 và 0 ≤ 0,3 ≤ 1, nên ràng buộc hộp không chặt và (0,9; 0,3) là đáp án. Bước 3: bình phương khoảng cách 0,6<sup>2</sup> + 0,6<sup>2</sup> = 0,72.</p>
<p><b>Rồi đến SOCP.</b> Bốn thành phố ở (0, 0), (10, 0), (0, 6), (9, 8). Trọng tâm cực tiểu tổng <em>bình phương</em> khoảng cách; điểm Fermat–Weber cực tiểu tổng khoảng cách và hơi khác.</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp

# QP: closest point to p inside the box [0,1]^2 intersected with x1 + x2 &lt;= 1.2
p = np.array([1.5, 0.9])
x = cp.Variable(2)
qp = cp.Problem(cp.Minimize(cp.sum_squares(x - p)), [x &gt;= 0, x &lt;= 1, cp.sum(x) &lt;= 1.2])
qp.solve()
print("QP  : x* =", x.value.round(4), " distance^2 =", round(qp.value, 4))

# SOCP: the Fermat-Weber point minimising the SUM of Euclidean distances to 4 cities
C = np.array([[0, 0], [10, 0], [0, 6], [9, 8.0]])
z = cp.Variable(2)
socp = cp.Problem(cp.Minimize(sum(cp.norm(z - c, 2) for c in C)))
socp.solve()
print("SOCP: z* =", z.value.round(4), " total distance =", round(socp.value, 4))
print("compare centroid", C.mean(axis=0), "total =", round(np.linalg.norm(C - C.mean(axis=0), axis=1).sum(), 4))</code></pre>
<div class="out">QP  : x* = [0.9 0.3]  distance^2 = 0.72
SOCP: z* = [4.0292 3.5819]  total distance = 23.7035
compare centroid [4.75 3.5 ] total = 23.7674</div>
<p>QP khớp đúng phép chiếu tính tay. Điểm Fermat–Weber (4,03; 3,58) tiết kiệm khoảng 0,064 tổng quãng đường so với trọng tâm (4,75; 3,5) — nhỏ ở đây, nhưng hai tiêu chí thật sự khác nhau.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết QP với P không xác định dấu (vd cực đại rủi ro) — bài không còn lồi và CVXPY sẽ từ chối <code>quad_form</code> với ma trận không PSD.</li><li>Viết ‖Ax + b‖<sub>2</sub> ≥ c<sup>T</sup>x + d: bất đẳng thức đảo chiều không lồi.</li><li>Tự bình phương ràng buộc SOCP cho “gọn”: ‖u‖<sub>2</sub><sup>2</sup> ≤ t<sup>2</sup> mất điều kiện t ≥ 0 và không DCP.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>QP: mục tiêu toàn phương lồi (P ⪰ 0) + ràng buộc tuyến tính; phép chiếu, bình phương tối thiểu có ràng buộc, danh mục, SVM.</li><li>SOCP: ràng buộc ‖A<sub>i</sub>x + b<sub>i</sub>‖<sub>2</sub> ≤ c<sub>i</sub><sup>T</sup>x + d<sub>i</sub>; LP bền vững, tổng khoảng cách.</li><li>LP ⊂ QP ⊂ SOCP ⊂ SDP: mỗi lớp chứa lớp trước.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.cvxpy.org/examples/basic/quadratic_program.html" target="_blank" rel="noopener">Ví dụ CVXPY — Quadratic program</a></li><li><a href="https://www.cvxpy.org/examples/basic/socp.html" target="_blank" rel="noopener">Ví dụ CVXPY — Second-order cone program</a></li><li><a href="https://en.wikipedia.org/wiki/Second-order_cone_programming" target="_blank" rel="noopener">Wikipedia — Second-order cone programming</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Chiếu tay p = (2, 2) lên {x : x<sub>1</sub> + x<sub>2</sub> ≤ 1}.</li><li>Viết “cực tiểu ‖Ax − b‖<sub>2</sub> + ‖x‖<sub>1</sub>” ở dạng CVXPY nhận. Nó thuộc lớp nào?</li><li>Viết ràng buộc bền vững (a + u)<sup>T</sup>x ≤ b với mọi ‖u‖<sub>2</sub> ≤ ρ mà không cần “với mọi”.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Phần vượt 4 − 1 = 3, trừ 1,5 khỏi mỗi toạ độ ⇒ (0,5; 0,5). 2) <code>cp.norm(A @ x - b, 2) + cp.norm1(x)</code>; là SOCP (phần ℓ<sub>1</sub> thành tuyến tính sau mẹo epigraph). 3) u tệ nhất là ρx/‖x‖<sub>2</sub>, nên a<sup>T</sup>x + ρ‖x‖<sub>2</sub> ≤ b.</p></div>`);

const c44 = L('cvo201-ts-4-4',
  '4.4 — Semidefinite programming: linear matrix inequalities and eigenvalue optimization|||4.4 — Quy hoạch nửa xác định: bất đẳng thức ma trận tuyến tính và tối ưu trị riêng',
  'SDP nhập môn: biến ma trận/LMI F(x) = F0 + x1F1 + … ⪰ 0, cực tiểu trị riêng lớn nhất, ràng buộc X ⪰ 0 trong CVXPY (>>), ứng dụng (ma trận tương quan, kernel, nới lỏng tổ hợp) (Boyd §4.6.2).',
  `<span class="eyebrow">CVO201 · Chapter 4 · Lesson 4.4</span>
<h2>Semidefinite programming</h2>
<p class="lead">In an SDP the inequality “≥ 0” is applied not to numbers but to symmetric matrices: a matrix built affinely from x must be positive semidefinite. SDP is the most general class in this course and it contains LP, QP and SOCP.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write the inequality form of an SDP with a linear matrix inequality (LMI).</li><li>Formulate “minimise the largest eigenvalue” as an SDP and verify it by hand.</li><li>Use the <code>&gt;&gt;</code> operator and <code>lambda_max</code> in CVXPY.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">SDP in inequality form (Boyd §4.6.2)</span>minimize c<sup>T</sup>x   subject to x<sub>1</sub>F<sub>1</sub> + … + x<sub>n</sub>F<sub>n</sub> + G ⪯ 0,  Ax = b      (F<sub>i</sub>, G symmetric k × k)</div>
<p>The constraint F(x) = x<sub>1</sub>F<sub>1</sub> + … + x<sub>n</sub>F<sub>n</sub> + G ⪯ 0 is a <strong>linear matrix inequality</strong>: −F(x) must lie in the PSD cone. Its feasible set is the affine preimage of a convex cone, so it is convex (Lesson 2.3). If all matrices are diagonal, the LMI is just k linear inequalities — an LP. A second-order cone constraint ‖u‖<sub>2</sub> ≤ t is equivalent to the LMI [[tI, u], [u<sup>T</sup>, t]] ⪰ 0 (by the Schur complement), so SOCPs are SDPs too.</p>
<p><strong>Eigenvalue optimization.</strong> For a symmetric A(x) = A<sub>0</sub> + x<sub>1</sub>A<sub>1</sub> + … + x<sub>n</sub>A<sub>n</sub>, the largest eigenvalue satisfies λ<sub>max</sub>(A(x)) ≤ t ⇔ tI − A(x) ⪰ 0. So minimising λ<sub>max</sub>(A(x)) is the SDP “minimise t subject to tI − A(x) ⪰ 0”. Because λ<sub>max</sub> is a supremum of linear functions (v<sup>T</sup>A(x)v over unit v), it is convex in x — consistent with Lesson 3.3.</p>
<p><strong>Where SDPs appear.</strong> Finding the nearest valid correlation matrix to noisy estimates (a PSD constraint plus unit diagonal), learning a kernel or a Mahalanobis metric (the matrix must stay PSD), robust control (Lyapunov inequalities), and convex relaxations of hard combinatorial problems such as MAX-CUT. SDP solvers (Clarabel, SCS, MOSEK) are slower than LP/QP solvers; for k × k matrices keep k in the hundreds unless the structure is special.</p>
<h3>✍️ Worked example — minimise λ<sub>max</sub></h3>
<div class="callout"><p><b>Problem.</b> A<sub>0</sub> = [[2, 1, 0], [1, 3, 1], [0, 1, 1]], A<sub>1</sub> = diag(1, −1, 0), A<sub>2</sub> has ones at positions (1,2), (2,1), (2,3), (3,2). Minimise λ<sub>max</sub>(A<sub>0</sub> + x<sub>1</sub>A<sub>1</sub> + x<sub>2</sub>A<sub>2</sub>).</p>
<p>Step 1: A(x) = [[2 + x<sub>1</sub>, 1 + x<sub>2</sub>, 0], [1 + x<sub>2</sub>, 3 − x<sub>1</sub>, 1 + x<sub>2</sub>], [0, 1 + x<sub>2</sub>, 1]]. Step 2: the off-diagonal entries all equal 1 + x<sub>2</sub>; choosing x<sub>2</sub> = −1 makes A(x) diagonal: diag(2 + x<sub>1</sub>, 3 − x<sub>1</sub>, 1). Step 3: the largest of 2 + x<sub>1</sub> and 3 − x<sub>1</sub> is smallest when they are equal: x<sub>1</sub> = 0.5, giving 2.5. Step 4: at x = 0, λ<sub>max</sub>(A<sub>0</sub>) ≈ 3.88, so the optimization lowers it to <b>2.5</b>. (The solver confirms that no other x does better.)</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp

A0 = np.array([[2.0, 1.0, 0.0], [1.0, 3.0, 1.0], [0.0, 1.0, 1.0]])
A1 = np.array([[1.0, 0.0, 0.0], [0.0, -1.0, 0.0], [0.0, 0.0, 0.0]])
A2 = np.array([[0.0, 1.0, 0.0], [1.0, 0.0, 1.0], [0.0, 1.0, 0.0]])

# minimise the largest eigenvalue of A(x) = A0 + x1 A1 + x2 A2  (an SDP)
x = cp.Variable(2); t = cp.Variable()
Ax = A0 + x[0] * A1 + x[1] * A2
prob = cp.Problem(cp.Minimize(t), [t * np.eye(3) - Ax &gt;&gt; 0])
prob.solve()
print("SDP with LMI : t* =", round(prob.value, 4), " x* =", x.value.round(4))
print("check eigvals of A(x*):", np.linalg.eigvalsh(A0 + x.value[0] * A1 + x.value[1] * A2).round(4))

# the same problem with the built-in atom
y = cp.Variable(2)
p2 = cp.Problem(cp.Minimize(cp.lambda_max(A0 + y[0] * A1 + y[1] * A2))); p2.solve()
print("lambda_max atom: value =", round(p2.value, 4))
print("at x = 0, lambda_max(A0) =", round(np.linalg.eigvalsh(A0).max(), 4))</code></pre>
<div class="out">SDP with LMI : t* = 2.5  x* = [ 0.5 -1. ]
check eigvals of A(x*): [1.  2.5 2.5]
lambda_max atom: value = 2.5
at x = 0, lambda_max(A0) = 3.8794</div>
<p>The LMI formulation and the built-in <code>lambda_max</code> atom give the same optimum t* = 2.5 at x* = (0.5, −1), matching the hand analysis; at the optimum the top eigenvalue is repeated (2.5, 2.5) — typical of eigenvalue optimization and the reason λ<sub>max</sub> is not differentiable there.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing <code>X &gt;= 0</code> for a matrix variable in CVXPY: that means elementwise nonnegative. PSD is <code>X &gt;&gt; 0</code> (or <code>cp.Variable((n, n), PSD=True)</code>).</li><li>Using a non-symmetric expression in an LMI; CVXPY requires symmetric arguments for <code>&gt;&gt;</code>.</li><li>Expecting λ<sub>max</sub> to be smooth: at the optimum eigenvalues often coincide, so gradient-based methods struggle — use an SDP solver.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>SDP: linear objective, LMI constraint F(x) ⪯ 0 (or X ⪰ 0 for a matrix variable).</li><li>LP ⊂ QP ⊂ SOCP ⊂ SDP.</li><li>λ<sub>max</sub>(A(x)) ≤ t ⇔ tI − A(x) ⪰ 0 turns eigenvalue minimisation into an SDP.</li><li>Applications: correlation and kernel matrices, metric learning, control, relaxations.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.cvxpy.org/examples/basic/sdp.html" target="_blank" rel="noopener">CVXPY example — Semidefinite program</a></li><li><a href="https://en.wikipedia.org/wiki/Semidefinite_programming" target="_blank" rel="noopener">Wikipedia — Semidefinite programming</a></li><li><a href="https://en.wikipedia.org/wiki/Linear_matrix_inequality" target="_blank" rel="noopener">Wikipedia — Linear matrix inequality</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Show that the LP constraints x<sub>1</sub> ≤ 1, x<sub>2</sub> ≤ 2 can be written as one LMI.</li><li>For which x is [[1, x], [x, 1]] ⪰ 0?</li><li>Minimise λ<sub>max</sub>(diag(1 + x, 3 − x)) by hand.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) diag(x<sub>1</sub> − 1, x<sub>2</sub> − 2) ⪯ 0. 2) Eigenvalues 1 ± x, so −1 ≤ x ≤ 1. 3) max(1 + x, 3 − x) is smallest when 1 + x = 3 − x, x = 1, value 2.</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 4 · Bài 4.4</span>
<h2>Quy hoạch nửa xác định</h2>
<p class="lead">Trong SDP, bất đẳng thức “≥ 0” không áp cho số mà cho ma trận đối xứng: một ma trận dựng affine từ x phải nửa xác định dương. SDP là lớp tổng quát nhất của môn và chứa LP, QP, SOCP.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết dạng bất đẳng thức của SDP với một bất đẳng thức ma trận tuyến tính (LMI).</li><li>Phát biểu “cực tiểu trị riêng lớn nhất” thành SDP và kiểm tay.</li><li>Dùng toán tử <code>&gt;&gt;</code> và <code>lambda_max</code> trong CVXPY.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">SDP dạng bất đẳng thức (Boyd §4.6.2)</span>minimize c<sup>T</sup>x   subject to x<sub>1</sub>F<sub>1</sub> + … + x<sub>n</sub>F<sub>n</sub> + G ⪯ 0,  Ax = b      (F<sub>i</sub>, G đối xứng k × k)</div>
<p>Ràng buộc F(x) = x<sub>1</sub>F<sub>1</sub> + … + x<sub>n</sub>F<sub>n</sub> + G ⪯ 0 là một <strong>bất đẳng thức ma trận tuyến tính</strong>: −F(x) phải thuộc nón PSD. Miền khả thi là nghịch ảnh affine của một nón lồi, nên lồi (Bài 2.3). Nếu mọi ma trận đều chéo, LMI chỉ là k bất đẳng thức tuyến tính — một LP. Ràng buộc nón bậc hai ‖u‖<sub>2</sub> ≤ t tương đương LMI [[tI, u], [u<sup>T</sup>, t]] ⪰ 0 (theo phần bù Schur), nên SOCP cũng là SDP.</p>
<p><strong>Tối ưu trị riêng.</strong> Với A(x) = A<sub>0</sub> + x<sub>1</sub>A<sub>1</sub> + … + x<sub>n</sub>A<sub>n</sub> đối xứng, trị riêng lớn nhất thoả λ<sub>max</sub>(A(x)) ≤ t ⇔ tI − A(x) ⪰ 0. Vậy cực tiểu λ<sub>max</sub>(A(x)) là SDP “cực tiểu t với tI − A(x) ⪰ 0”. Vì λ<sub>max</sub> là sup của các hàm tuyến tính (v<sup>T</sup>A(x)v trên các v đơn vị), nó lồi theo x — khớp với Bài 3.3.</p>
<p><strong>SDP xuất hiện ở đâu.</strong> Tìm ma trận tương quan hợp lệ gần nhất với ước lượng nhiễu (ràng buộc PSD cộng đường chéo bằng 1), học kernel hay metric Mahalanobis (ma trận phải giữ PSD), điều khiển bền vững (bất đẳng thức Lyapunov), và nới lỏng lồi của bài tổ hợp khó như MAX-CUT. Bộ giải SDP (Clarabel, SCS, MOSEK) chậm hơn bộ giải LP/QP; với ma trận k × k hãy giữ k ở cỡ hàng trăm trừ khi cấu trúc đặc biệt.</p>
<h3>✍️ Ví dụ giải từng bước — cực tiểu λ<sub>max</sub></h3>
<div class="callout"><p><b>Bài toán.</b> A<sub>0</sub> = [[2, 1, 0], [1, 3, 1], [0, 1, 1]], A<sub>1</sub> = diag(1, −1, 0), A<sub>2</sub> có số 1 tại các vị trí (1,2), (2,1), (2,3), (3,2). Cực tiểu λ<sub>max</sub>(A<sub>0</sub> + x<sub>1</sub>A<sub>1</sub> + x<sub>2</sub>A<sub>2</sub>).</p>
<p>Bước 1: A(x) = [[2 + x<sub>1</sub>, 1 + x<sub>2</sub>, 0], [1 + x<sub>2</sub>, 3 − x<sub>1</sub>, 1 + x<sub>2</sub>], [0, 1 + x<sub>2</sub>, 1]]. Bước 2: mọi phần tử ngoài đường chéo đều bằng 1 + x<sub>2</sub>; chọn x<sub>2</sub> = −1 làm A(x) thành chéo: diag(2 + x<sub>1</sub>, 3 − x<sub>1</sub>, 1). Bước 3: số lớn hơn giữa 2 + x<sub>1</sub> và 3 − x<sub>1</sub> nhỏ nhất khi chúng bằng nhau: x<sub>1</sub> = 0,5, cho 2,5. Bước 4: tại x = 0, λ<sub>max</sub>(A<sub>0</sub>) ≈ 3,88, nên tối ưu hạ nó xuống <b>2,5</b>. (Bộ giải xác nhận không x nào làm tốt hơn.)</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp

A0 = np.array([[2.0, 1.0, 0.0], [1.0, 3.0, 1.0], [0.0, 1.0, 1.0]])
A1 = np.array([[1.0, 0.0, 0.0], [0.0, -1.0, 0.0], [0.0, 0.0, 0.0]])
A2 = np.array([[0.0, 1.0, 0.0], [1.0, 0.0, 1.0], [0.0, 1.0, 0.0]])

# minimise the largest eigenvalue of A(x) = A0 + x1 A1 + x2 A2  (an SDP)
x = cp.Variable(2); t = cp.Variable()
Ax = A0 + x[0] * A1 + x[1] * A2
prob = cp.Problem(cp.Minimize(t), [t * np.eye(3) - Ax &gt;&gt; 0])
prob.solve()
print("SDP with LMI : t* =", round(prob.value, 4), " x* =", x.value.round(4))
print("check eigvals of A(x*):", np.linalg.eigvalsh(A0 + x.value[0] * A1 + x.value[1] * A2).round(4))

# the same problem with the built-in atom
y = cp.Variable(2)
p2 = cp.Problem(cp.Minimize(cp.lambda_max(A0 + y[0] * A1 + y[1] * A2))); p2.solve()
print("lambda_max atom: value =", round(p2.value, 4))
print("at x = 0, lambda_max(A0) =", round(np.linalg.eigvalsh(A0).max(), 4))</code></pre>
<div class="out">SDP with LMI : t* = 2.5  x* = [ 0.5 -1. ]
check eigvals of A(x*): [1.  2.5 2.5]
lambda_max atom: value = 2.5
at x = 0, lambda_max(A0) = 3.8794</div>
<p>Cách viết LMI và nguyên tử <code>lambda_max</code> có sẵn cho cùng tối ưu t* = 2,5 tại x* = (0,5; −1), khớp phân tích tay; tại tối ưu trị riêng lớn nhất bị lặp (2,5; 2,5) — đặc trưng của tối ưu trị riêng và là lý do λ<sub>max</sub> không khả vi ở đó.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết <code>X &gt;= 0</code> cho biến ma trận trong CVXPY: nghĩa là không âm từng phần tử. PSD là <code>X &gt;&gt; 0</code> (hoặc <code>cp.Variable((n, n), PSD=True)</code>).</li><li>Dùng biểu thức không đối xứng trong LMI; CVXPY đòi đối số đối xứng cho <code>&gt;&gt;</code>.</li><li>Chờ λ<sub>max</sub> trơn: tại tối ưu các trị riêng thường trùng nhau, nên phương pháp gradient gặp khó — hãy dùng bộ giải SDP.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>SDP: mục tiêu tuyến tính, ràng buộc LMI F(x) ⪯ 0 (hoặc X ⪰ 0 với biến ma trận).</li><li>LP ⊂ QP ⊂ SOCP ⊂ SDP.</li><li>λ<sub>max</sub>(A(x)) ≤ t ⇔ tI − A(x) ⪰ 0 biến bài cực tiểu trị riêng thành SDP.</li><li>Ứng dụng: ma trận tương quan và kernel, học metric, điều khiển, nới lỏng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.cvxpy.org/examples/basic/sdp.html" target="_blank" rel="noopener">Ví dụ CVXPY — Semidefinite program</a></li><li><a href="https://en.wikipedia.org/wiki/Semidefinite_programming" target="_blank" rel="noopener">Wikipedia — Semidefinite programming</a></li><li><a href="https://en.wikipedia.org/wiki/Linear_matrix_inequality" target="_blank" rel="noopener">Wikipedia — Linear matrix inequality</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Chứng tỏ các ràng buộc LP x<sub>1</sub> ≤ 1, x<sub>2</sub> ≤ 2 viết được thành một LMI.</li><li>Với x nào thì [[1, x], [x, 1]] ⪰ 0?</li><li>Cực tiểu tay λ<sub>max</sub>(diag(1 + x, 3 − x)).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) diag(x<sub>1</sub> − 1, x<sub>2</sub> − 2) ⪯ 0. 2) Trị riêng 1 ± x, nên −1 ≤ x ≤ 1. 3) max(1 + x, 3 − x) nhỏ nhất khi 1 + x = 3 − x, x = 1, giá trị 2.</p></div>`);

const q4 = QZ(4, 'Quiz — Chapter 4: Convex problems, LP, QP, SOCP, SDP|||Quiz — Chương 4: Bài toán lồi, LP, QP, SOCP, SDP',
  'Kiểm tra dạng chuẩn bài toán lồi, địa phương = toàn cục, điều kiện tối ưu, epigraph, LP, QP, SOCP, SDP và thứ bậc giữa chúng.', [
  Q('q1', 'In a convex problem in standard form, equality constraints must be|||Trong bài toán lồi dạng chuẩn, ràng buộc đẳng thức phải',
    ['convex|||lồi', 'affine|||affine', 'quadratic|||toàn phương', 'strictly convex|||lồi chặt'], 1,
    'Only affine equalities define a convex set in general.|||Nói chung chỉ đẳng thức affine mới định nghĩa tập lồi.'),
  Q('q2', 'For a convex problem, a local minimum is|||Với bài toán lồi, một cực tiểu địa phương',
    ['always global|||luôn là toàn cục', 'global only if unique|||chỉ toàn cục nếu duy nhất', 'never global|||không bao giờ toàn cục', 'global only for LPs|||chỉ toàn cục với LP'], 0,
    'The segment argument of Lesson 4.1.|||Lập luận đoạn thẳng ở Bài 4.1.'),
  Q('q3', 'The epigraph form of minimise f₀(x) is|||Dạng epigraph của bài cực tiểu f₀(x) là',
    ['minimise t s.t. f₀(x) ≤ t|||cực tiểu t với f₀(x) ≤ t', 'minimise f₀(x) + t|||cực tiểu f₀(x) + t', 'maximise t s.t. f₀(x) ≥ t|||cực đại t với f₀(x) ≥ t', 'minimise f₀(t)|||cực tiểu f₀(t)'], 0,
    'It makes the objective linear in (x, t).|||Nó làm mục tiêu tuyến tính theo (x, t).'),
  Q('q4', 'minimise ‖Ax − b‖∞ can be written as|||Bài cực tiểu ‖Ax − b‖∞ viết được thành',
    ['an LP|||một LP', 'only an SDP|||chỉ một SDP', 'a nonconvex problem|||bài không lồi', 'a least-squares problem|||bài bình phương tối thiểu'], 0,
    'minimise t s.t. −t ≤ Ax − b ≤ t.|||cực tiểu t với −t ≤ Ax − b ≤ t.'),
  Q('q5', 'If an LP has an optimum, it is attained|||Nếu LP có tối ưu, nó đạt được',
    ['only in the interior|||chỉ ở phần trong', 'at a vertex (possibly also along a face)|||tại một đỉnh (có thể cả dọc một mặt)', 'at the origin|||tại gốc', 'nowhere|||không ở đâu'], 1,
    'Linear objectives are extremised at vertices of polyhedra.|||Mục tiêu tuyến tính đạt cực trị tại đỉnh đa diện.'),
  Q('q6', 'A QP is convex when the quadratic matrix P is|||QP lồi khi ma trận toàn phương P',
    ['invertible|||khả nghịch', 'positive semidefinite|||nửa xác định dương', 'diagonal|||chéo', 'nonnegative entrywise|||không âm từng phần tử'], 1,
    'P ⪰ 0 makes ½xᵀPx convex.|||P ⪰ 0 làm ½xᵀPx lồi.'),
  Q('q7', 'The robust constraint (a + u)ᵀx ≤ b for all ‖u‖₂ ≤ ρ is equivalent to|||Ràng buộc bền vững (a + u)ᵀx ≤ b với mọi ‖u‖₂ ≤ ρ tương đương',
    ['aᵀx ≤ b|||aᵀx ≤ b', 'aᵀx + ρ‖x‖₂ ≤ b|||aᵀx + ρ‖x‖₂ ≤ b', 'aᵀx + ρ‖x‖₁ ≤ b|||aᵀx + ρ‖x‖₁ ≤ b', 'aᵀx − ρ‖x‖₂ ≤ b|||aᵀx − ρ‖x‖₂ ≤ b'], 1,
    'The worst case is u = ρx/‖x‖₂ — an SOCP constraint.|||Trường hợp tệ nhất u = ρx/‖x‖₂ — ràng buộc SOCP.'),
  Q('q8', 'Minimising the total distance Σ‖z − cⱼ‖₂ to given points is|||Cực tiểu tổng khoảng cách Σ‖z − cⱼ‖₂ tới các điểm cho trước là',
    ['an LP|||một LP', 'an SOCP|||một SOCP', 'nonconvex|||không lồi', 'solved by the centroid|||giải bằng trọng tâm'], 1,
    'Sums of Euclidean norms of affine functions are SOCP-representable; the centroid minimises squared distances.|||Tổng chuẩn Euclid của hàm affine biểu diễn được bằng SOCP; trọng tâm cực tiểu tổng bình phương.'),
  Q('q9', 'λmax(A(x)) ≤ t is equivalent to the LMI|||λmax(A(x)) ≤ t tương đương LMI',
    ['A(x) − tI ⪰ 0|||A(x) − tI ⪰ 0', 'tI − A(x) ⪰ 0|||tI − A(x) ⪰ 0', 'A(x) ⪰ 0|||A(x) ⪰ 0', 'tr A(x) ≤ t|||tr A(x) ≤ t'], 1,
    'All eigenvalues of tI − A(x) are t − λᵢ ≥ 0.|||Mọi trị riêng của tI − A(x) là t − λᵢ ≥ 0.'),
  Q('q10', 'Which inclusion of problem classes is correct?|||Bao hàm nào giữa các lớp bài toán là đúng?',
    ['SDP ⊂ SOCP ⊂ QP ⊂ LP|||SDP ⊂ SOCP ⊂ QP ⊂ LP', 'LP ⊂ QP ⊂ SOCP ⊂ SDP|||LP ⊂ QP ⊂ SOCP ⊂ SDP', 'QP ⊂ LP ⊂ SDP ⊂ SOCP|||QP ⊂ LP ⊂ SDP ⊂ SOCP', 'they are unrelated|||chúng không liên quan'], 1,
    'Each class can express the previous one.|||Mỗi lớp biểu diễn được lớp trước.'),
]);

const ch4 = {
  title: 'Chapter 4 — Convex optimization problems: LP, QP, SOCP and SDP|||Chương 4 — Bài toán tối ưu lồi: LP, QP, SOCP và SDP',
  description: 'Bài toán lồi dạng chuẩn, địa phương = toàn cục, điều kiện tối ưu, biến đổi tương đương; quy hoạch tuyến tính, toàn phương, nón bậc hai, nửa xác định với CVXPY/SciPy (Boyd Ch. 4 · EE364a bài 4).',
  lessons: [c41, c42, c43, c44, q4],
};


// ───────────────────────────── Chương 5 — Đối ngẫu & KKT ─────────────────────────────
const c51 = L('cvo201-ts-5-1',
  '5.1 — The Lagrangian and the dual function: lower bounds for free|||5.1 — Hàm Lagrange và hàm đối ngẫu: cận dưới miễn phí',
  'Hàm Lagrange L(x, λ, ν), nhân tử Lagrange, hàm đối ngẫu g(λ, ν) = inf L luôn lõm, tính chất cận dưới g ≤ p* (Boyd §5.1); ví dụ chuẩn nhỏ nhất: suy ra g(ν) = −¼νᵀAAᵀν − bᵀν và kiểm bằng số.',
  `<span class="eyebrow">CVO201 · Chapter 5 · Lesson 5.1</span>
<h2>The Lagrangian and the dual function</h2>
<p class="lead">Duality starts with a simple trick: instead of forbidding constraint violations, we <em>charge a price</em> for them. Every choice of prices gives a lower bound on the optimal value — even for problems we cannot solve.</p>
<h3>🎯 Objectives</h3>
<ul><li>Form the Lagrangian of a problem in standard form.</li><li>Define the dual function and explain why it is always concave.</li><li>Prove the lower-bound property g(λ, ν) ≤ p* for λ ⪰ 0.</li><li>Derive the dual function of the least-norm problem.</li></ul>
<h3>📖 Lecture</h3>
<p>Take a problem in standard form: minimise f<sub>0</sub>(x) s.t. f<sub>i</sub>(x) ≤ 0 (i = 1…m), h<sub>i</sub>(x) = 0 (i = 1…p), with optimal value p*. It need not be convex.</p>
<div class="formula"><span class="lbl">Lagrangian and dual function (Boyd §5.1)</span>L(x, λ, ν) = f<sub>0</sub>(x) + ∑<sub>i</sub> λ<sub>i</sub>f<sub>i</sub>(x) + ∑<sub>i</sub> ν<sub>i</sub>h<sub>i</sub>(x)<br>g(λ, ν) = inf<sub>x</sub> L(x, λ, ν)</div>
<p>λ<sub>i</sub> is the <strong>Lagrange multiplier</strong> (price) of the i-th inequality and ν<sub>i</sub> that of the i-th equality; together they are the <strong>dual variables</strong>. The infimum is taken over all x in the domain, with no constraints.</p>
<p><strong>g is concave</strong>, always: for each fixed x, L is an affine function of (λ, ν), and g is the pointwise infimum of affine functions (the mirror image of rule 3 in Lesson 3.3). This is true even when the original problem is wildly nonconvex.</p>
<p><strong>Lower-bound property.</strong> Let x̃ be feasible and λ ⪰ 0. Then f<sub>i</sub>(x̃) ≤ 0 gives λ<sub>i</sub>f<sub>i</sub>(x̃) ≤ 0, and h<sub>i</sub>(x̃) = 0, so L(x̃, λ, ν) ≤ f<sub>0</sub>(x̃). Hence g(λ, ν) ≤ L(x̃, λ, ν) ≤ f<sub>0</sub>(x̃). Taking the best feasible x̃ gives</p>
<div class="formula"><span class="lbl">Weak duality, first form</span>g(λ, ν) ≤ p*   for every λ ⪰ 0 and every ν</div>
<p>Interpretation: if violating constraint i costs λ<sub>i</sub> per unit (and satisfying it with slack earns λ<sub>i</sub> per unit), the cheapest unconstrained plan can never beat the best feasible plan.</p>
<h3>✍️ Worked example — least-norm solution of Ax = b</h3>
<div class="callout"><p><b>Problem.</b> minimise x<sup>T</sup>x subject to Ax = b, with A = [[1, 1, 1], [1, −1, 2]], b = (3, 1).</p>
<p>Step 1 (Lagrangian): L(x, ν) = x<sup>T</sup>x + ν<sup>T</sup>(Ax − b). Step 2 (minimise over x): ∇<sub>x</sub>L = 2x + A<sup>T</sup>ν = 0 ⇒ x = −½A<sup>T</sup>ν. Step 3 (substitute): g(ν) = ¼ν<sup>T</sup>AA<sup>T</sup>ν − ½ν<sup>T</sup>AA<sup>T</sup>ν − b<sup>T</sup>ν = <b>−¼ν<sup>T</sup>AA<sup>T</sup>ν − b<sup>T</sup>ν</b>, a concave quadratic. Step 4 (bounds): g(0) = 0; g(−1, 0) = −¼·3 + 3 = 2.25. Step 5 (best bound): ∇g = −½AA<sup>T</sup>ν − b = 0 ⇒ ν* = −2(AA<sup>T</sup>)<sup>−1</sup>b. With AA<sup>T</sup> = [[3, 2], [2, 6]] we get p* = b<sup>T</sup>(AA<sup>T</sup>)<sup>−1</sup>b = 45/14 ≈ 3.2143.</p></div>
<pre><code class="language-python">import numpy as np

# least-norm problem: minimize x^T x subject to A x = b
A = np.array([[1.0, 1.0, 1.0], [1.0, -1.0, 2.0]]); b = np.array([3.0, 1.0])

# dual function g(nu) = -(1/4) nu^T A A^T nu - b^T nu   (derived in the lesson)
g = lambda nu: -0.25 * nu @ (A @ A.T) @ nu - b @ nu
x_star = A.T @ np.linalg.solve(A @ A.T, b)          # primal optimum
p_star = x_star @ x_star
print("x* =", x_star.round(4), " p* =", round(p_star, 4))

for nu in [np.zeros(2), np.array([-1.0, 0.0]), np.array([-2.0, 1.0])]:
    print("g(", nu, ") =", round(g(nu), 4), "&lt;= p*")

nu_star = -2 * np.linalg.solve(A @ A.T, b)          # maximiser of g
print("nu* =", nu_star.round(4), " d* = g(nu*) =", round(g(nu_star), 4))</code></pre>
<div class="out">x* = [0.9286 1.3571 0.7143]  p* = 3.2143
g( [0. 0.] ) = 0.0 &lt;= p*
g( [-1.  0.] ) = 2.25 &lt;= p*
g( [-2.  1.] ) = 2.5 &lt;= p*
nu* = [-2.2857  0.4286]  d* = g(nu*) = 3.2143</div>
<p>Every ν gives a valid lower bound (0, 2.25, 2.5 …), and the best one, g(ν*), equals p* exactly. That equality is not an accident — it is strong duality, the subject of the next lesson.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Taking the infimum of L over the <em>feasible</em> set only. The dual function minimises over all x — that is what makes it easy to compute.</li><li>Forgetting λ ⪰ 0 for inequality multipliers; equality multipliers ν are free in sign.</li><li>Missing the case where the infimum is −∞: then g = −∞ and that (λ, ν) gives a useless bound (this is how dual constraints arise, Lesson 5.2).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>L = f<sub>0</sub> + ∑λ<sub>i</sub>f<sub>i</sub> + ∑ν<sub>i</sub>h<sub>i</sub>; g(λ, ν) = inf<sub>x</sub> L.</li><li>g is concave for any problem.</li><li>λ ⪰ 0 ⇒ g(λ, ν) ≤ p*: dual values certify lower bounds.</li><li>Least norm: g(ν) = −¼ν<sup>T</sup>AA<sup>T</sup>ν − b<sup>T</sup>ν.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://web.stanford.edu/class/ee364a/lectures/duality.pdf" target="_blank" rel="noopener">Stanford EE364a — Lecture 5: Duality (slides)</a></li><li><a href="https://www.stat.cmu.edu/~ryantibs/convexopt/lectures/dual-gen.pdf" target="_blank" rel="noopener">CMU 10-725 — Duality in general programs</a></li><li><a href="https://en.wikipedia.org/wiki/Duality_(optimization)" target="_blank" rel="noopener">Wikipedia — Duality (optimization)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write the Lagrangian of minimise x<sup>2</sup> s.t. x ≥ 1 and compute g(λ).</li><li>Maximise g(λ) from Exercise 1 over λ ≥ 0. Compare with p*.</li><li>Why is g concave even if f<sub>0</sub> is not convex?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) L = x<sup>2</sup> + λ(1 − x); minimiser x = λ/2; g(λ) = λ − λ<sup>2</sup>/4. 2) g′ = 1 − λ/2 = 0 ⇒ λ = 2, g = 1 = p* (x* = 1). 3) It is an infimum of functions that are affine in (λ, ν).</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 5 · Bài 5.1</span>
<h2>Hàm Lagrange và hàm đối ngẫu</h2>
<p class="lead">Đối ngẫu bắt đầu bằng một mẹo đơn giản: thay vì cấm vi phạm ràng buộc, ta <em>tính giá</em> cho việc vi phạm. Mỗi bộ giá cho một cận dưới của giá trị tối ưu — kể cả với bài ta không giải được.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Lập hàm Lagrange của bài toán dạng chuẩn.</li><li>Định nghĩa hàm đối ngẫu và giải thích vì sao nó luôn lõm.</li><li>Chứng minh tính chất cận dưới g(λ, ν) ≤ p* với λ ⪰ 0.</li><li>Suy ra hàm đối ngẫu của bài chuẩn nhỏ nhất.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Xét bài dạng chuẩn: cực tiểu f<sub>0</sub>(x) với f<sub>i</sub>(x) ≤ 0 (i = 1…m), h<sub>i</sub>(x) = 0 (i = 1…p), giá trị tối ưu p*. Bài không cần lồi.</p>
<div class="formula"><span class="lbl">Hàm Lagrange và hàm đối ngẫu (Boyd §5.1)</span>L(x, λ, ν) = f<sub>0</sub>(x) + ∑<sub>i</sub> λ<sub>i</sub>f<sub>i</sub>(x) + ∑<sub>i</sub> ν<sub>i</sub>h<sub>i</sub>(x)<br>g(λ, ν) = inf<sub>x</sub> L(x, λ, ν)</div>
<p>λ<sub>i</sub> là <strong>nhân tử Lagrange</strong> (giá) của bất đẳng thức thứ i và ν<sub>i</sub> của đẳng thức thứ i; gộp lại là các <strong>biến đối ngẫu</strong>. Infimum lấy trên mọi x thuộc miền xác định, không có ràng buộc.</p>
<p><strong>g luôn lõm</strong>: với mỗi x cố định, L là hàm affine theo (λ, ν), và g là infimum theo điểm của các hàm affine (ảnh gương của quy tắc 3 ở Bài 3.3). Điều này đúng kể cả khi bài gốc không lồi chút nào.</p>
<p><strong>Tính chất cận dưới.</strong> Cho x̃ khả thi và λ ⪰ 0. Khi đó f<sub>i</sub>(x̃) ≤ 0 cho λ<sub>i</sub>f<sub>i</sub>(x̃) ≤ 0, và h<sub>i</sub>(x̃) = 0, nên L(x̃, λ, ν) ≤ f<sub>0</sub>(x̃). Do đó g(λ, ν) ≤ L(x̃, λ, ν) ≤ f<sub>0</sub>(x̃). Lấy x̃ khả thi tốt nhất ta được</p>
<div class="formula"><span class="lbl">Đối ngẫu yếu, dạng đầu tiên</span>g(λ, ν) ≤ p*   với mọi λ ⪰ 0 và mọi ν</div>
<p>Diễn giải: nếu vi phạm ràng buộc i tốn λ<sub>i</sub> mỗi đơn vị (và thoả có dư thì được thưởng λ<sub>i</sub> mỗi đơn vị), thì kế hoạch không ràng buộc rẻ nhất không bao giờ thắng được kế hoạch khả thi tốt nhất.</p>
<h3>✍️ Ví dụ giải từng bước — nghiệm chuẩn nhỏ nhất của Ax = b</h3>
<div class="callout"><p><b>Bài toán.</b> cực tiểu x<sup>T</sup>x với Ax = b, A = [[1, 1, 1], [1, −1, 2]], b = (3, 1).</p>
<p>Bước 1 (Lagrange): L(x, ν) = x<sup>T</sup>x + ν<sup>T</sup>(Ax − b). Bước 2 (cực tiểu theo x): ∇<sub>x</sub>L = 2x + A<sup>T</sup>ν = 0 ⇒ x = −½A<sup>T</sup>ν. Bước 3 (thế vào): g(ν) = ¼ν<sup>T</sup>AA<sup>T</sup>ν − ½ν<sup>T</sup>AA<sup>T</sup>ν − b<sup>T</sup>ν = <b>−¼ν<sup>T</sup>AA<sup>T</sup>ν − b<sup>T</sup>ν</b>, một hàm toàn phương lõm. Bước 4 (các cận): g(0) = 0; g(−1, 0) = −¼·3 + 3 = 2,25. Bước 5 (cận tốt nhất): ∇g = −½AA<sup>T</sup>ν − b = 0 ⇒ ν* = −2(AA<sup>T</sup>)<sup>−1</sup>b. Với AA<sup>T</sup> = [[3, 2], [2, 6]] ta được p* = b<sup>T</sup>(AA<sup>T</sup>)<sup>−1</sup>b = 45/14 ≈ 3,2143.</p></div>
<pre><code class="language-python">import numpy as np

# least-norm problem: minimize x^T x subject to A x = b
A = np.array([[1.0, 1.0, 1.0], [1.0, -1.0, 2.0]]); b = np.array([3.0, 1.0])

# dual function g(nu) = -(1/4) nu^T A A^T nu - b^T nu   (derived in the lesson)
g = lambda nu: -0.25 * nu @ (A @ A.T) @ nu - b @ nu
x_star = A.T @ np.linalg.solve(A @ A.T, b)          # primal optimum
p_star = x_star @ x_star
print("x* =", x_star.round(4), " p* =", round(p_star, 4))

for nu in [np.zeros(2), np.array([-1.0, 0.0]), np.array([-2.0, 1.0])]:
    print("g(", nu, ") =", round(g(nu), 4), "&lt;= p*")

nu_star = -2 * np.linalg.solve(A @ A.T, b)          # maximiser of g
print("nu* =", nu_star.round(4), " d* = g(nu*) =", round(g(nu_star), 4))</code></pre>
<div class="out">x* = [0.9286 1.3571 0.7143]  p* = 3.2143
g( [0. 0.] ) = 0.0 &lt;= p*
g( [-1.  0.] ) = 2.25 &lt;= p*
g( [-2.  1.] ) = 2.5 &lt;= p*
nu* = [-2.2857  0.4286]  d* = g(nu*) = 3.2143</div>
<p>Mọi ν đều cho cận dưới hợp lệ (0; 2,25; 2,5 …), và cận tốt nhất g(ν*) bằng đúng p*. Đẳng thức đó không phải ngẫu nhiên — đó là đối ngẫu mạnh, chủ đề bài sau.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Lấy infimum của L chỉ trên tập <em>khả thi</em>. Hàm đối ngẫu cực tiểu trên mọi x — chính điều đó làm nó dễ tính.</li><li>Quên λ ⪰ 0 cho nhân tử của bất đẳng thức; nhân tử đẳng thức ν không ràng buộc dấu.</li><li>Bỏ sót trường hợp infimum bằng −∞: khi đó g = −∞ và (λ, ν) đó cho cận vô dụng (đây là cách ràng buộc đối ngẫu xuất hiện, Bài 5.2).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>L = f<sub>0</sub> + ∑λ<sub>i</sub>f<sub>i</sub> + ∑ν<sub>i</sub>h<sub>i</sub>; g(λ, ν) = inf<sub>x</sub> L.</li><li>g lõm với mọi bài toán.</li><li>λ ⪰ 0 ⇒ g(λ, ν) ≤ p*: giá trị đối ngẫu chứng nhận cận dưới.</li><li>Chuẩn nhỏ nhất: g(ν) = −¼ν<sup>T</sup>AA<sup>T</sup>ν − b<sup>T</sup>ν.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://web.stanford.edu/class/ee364a/lectures/duality.pdf" target="_blank" rel="noopener">Stanford EE364a — Bài 5: Đối ngẫu (slide)</a></li><li><a href="https://www.stat.cmu.edu/~ryantibs/convexopt/lectures/dual-gen.pdf" target="_blank" rel="noopener">CMU 10-725 — Đối ngẫu cho bài toán tổng quát</a></li><li><a href="https://en.wikipedia.org/wiki/Duality_(optimization)" target="_blank" rel="noopener">Wikipedia — Duality (optimization)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết hàm Lagrange của bài cực tiểu x<sup>2</sup> với x ≥ 1 và tính g(λ).</li><li>Cực đại g(λ) ở bài 1 trên λ ≥ 0. So với p*.</li><li>Vì sao g lõm kể cả khi f<sub>0</sub> không lồi?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) L = x<sup>2</sup> + λ(1 − x); điểm cực tiểu x = λ/2; g(λ) = λ − λ<sup>2</sup>/4. 2) g′ = 1 − λ/2 = 0 ⇒ λ = 2, g = 1 = p* (x* = 1). 3) Nó là infimum của các hàm affine theo (λ, ν).</p></div>`);

const c52 = L('cvo201-ts-5-2',
  '5.2 — The dual problem: weak duality, strong duality and Slater’s condition|||5.2 — Bài toán đối ngẫu: đối ngẫu yếu, đối ngẫu mạnh và điều kiện Slater',
  'Bài toán đối ngẫu max g(λ, ν) s.t. λ ⪰ 0, ràng buộc đối ngẫu ẩn, đối ngẫu yếu d* ≤ p*, khoảng cách đối ngẫu, đối ngẫu mạnh và điều kiện Slater (Boyd §5.2); đối ngẫu của LP, kiểm bằng CVXPY.',
  `<span class="eyebrow">CVO201 · Chapter 5 · Lesson 5.2</span>
<h2>The dual problem: weak duality, strong duality and Slater's condition</h2>
<p class="lead">Each dual variable gives a lower bound; the best lower bound is itself an optimization problem — the dual problem. For convex problems it usually has the same optimal value as the original.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write the Lagrange dual problem and find its implicit constraints.</li><li>State weak duality d* ≤ p* and define the duality gap.</li><li>State Slater's condition and the strong duality theorem.</li><li>Derive the dual of an LP and verify p* = d* numerically.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Lagrange dual problem (Boyd §5.2)</span>maximize g(λ, ν)   subject to λ ⪰ 0      optimal value d*</div>
<p>The dual is <strong>always a convex problem</strong> (maximise a concave function over a convex set), whatever the primal. Often g(λ, ν) = −∞ for some (λ, ν); we make the domain explicit by adding those conditions as constraints — the <strong>dual constraints</strong>.</p>
<p><strong>Weak duality:</strong> d* ≤ p*, always (Lesson 5.1). The difference p* − d* ≥ 0 is the <strong>optimal duality gap</strong>. Weak duality is useful even for hard nonconvex problems: the dual gives a certified lower bound, e.g. for MAX-CUT-type problems.</p>
<p><strong>Strong duality:</strong> d* = p*. It does not hold in general, but it does hold for most convex problems. The standard sufficient condition is</p>
<div class="formula"><span class="lbl">Slater's condition (Boyd §5.2.3)</span>The problem is convex and there is a strictly feasible x: f<sub>i</sub>(x) &lt; 0 for all i, Ax = b.<br>⇒ strong duality holds, and the dual optimum is attained (if d* &gt; −∞).</div>
<p>Affine inequality constraints need not be strict. In particular, <strong>every feasible LP and every feasible convex QP with linear constraints has zero duality gap</strong>. Slater can fail in degenerate cases, e.g. minimise x subject to x<sup>2</sup> ≤ 0: the only feasible point is 0, no strictly feasible point exists, and the dual optimum is not attained.</p>
<p><strong>The dual of an LP.</strong> For minimise c<sup>T</sup>x s.t. Ax ⪯ b, x ⪰ 0: L = c<sup>T</sup>x + y<sup>T</sup>(Ax − b) − z<sup>T</sup>x with y, z ⪰ 0. L is linear in x, so its infimum is −∞ unless c + A<sup>T</sup>y − z = 0, in which case g = −b<sup>T</sup>y. Eliminating z ⪰ 0 gives the dual LP: maximise −b<sup>T</sup>y s.t. A<sup>T</sup>y + c ⪰ 0, y ⪰ 0.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Primal.</b> maximise 3x<sub>1</sub> + 5x<sub>2</sub> s.t. x<sub>1</sub> ≤ 4, 2x<sub>2</sub> ≤ 12, 3x<sub>1</sub> + 2x<sub>2</sub> ≤ 18, x ⪰ 0 (minimise c<sup>T</sup>x with c = (−3, −5)).</p>
<p>Step 1 (primal by vertices): the binding pair 2x<sub>2</sub> = 12 and 3x<sub>1</sub> + 2x<sub>2</sub> = 18 gives x = (2, 6), profit 36 ⇒ p* = −36. Step 2 (dual): maximise −4y<sub>1</sub> − 12y<sub>2</sub> − 18y<sub>3</sub> s.t. y<sub>1</sub> + 3y<sub>3</sub> ≥ 3, 2y<sub>2</sub> + 2y<sub>3</sub> ≥ 5, y ⪰ 0. Step 3 (guess from the primal): constraint 1 is not tight, so y<sub>1</sub> = 0; both dual constraints tight: 3y<sub>3</sub> = 3 ⇒ y<sub>3</sub> = 1, 2y<sub>2</sub> + 2 = 5 ⇒ y<sub>2</sub> = 1.5. Dual value −12·1.5 − 18·1 = −36 = p*: strong duality, and y certifies that x is optimal.</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp

c = np.array([-3.0, -5.0])                       # maximise 3x1 + 5x2  &lt;=&gt;  minimise c^T x
A = np.array([[1.0, 0.0], [0.0, 2.0], [3.0, 2.0]]); b = np.array([4.0, 12.0, 18.0])

x = cp.Variable(2)
cons = [A @ x &lt;= b, x &gt;= 0]
primal = cp.Problem(cp.Minimize(c @ x), cons); primal.solve()

# dual of  min c^T x s.t. A x &lt;= b, x &gt;= 0  is  max -b^T y s.t. A^T y + c &gt;= 0, y &gt;= 0
y = cp.Variable(3)
dual = cp.Problem(cp.Maximize(-b @ y), [A.T @ y + c &gt;= 0, y &gt;= 0]); dual.solve()

print("primal p* =", round(primal.value, 4), " x* =", x.value.round(4))
print("dual   d* =", round(dual.value, 4), " y* =", y.value.round(4))
print("multipliers cvxpy reports for A x &lt;= b:", cons[0].dual_value.round(4))
print("duality gap =", round(primal.value - dual.value, 8))</code></pre>
<div class="out">primal p* = -36.0  x* = [2. 6.]
dual   d* = -36.0  y* = [0.  1.5 1. ]
multipliers cvxpy reports for A x &lt;= b: [0.  1.5 1. ]
duality gap = -1.6e-07</div>
<p>The dual LP solved separately gives exactly the multipliers CVXPY attaches to the primal constraints (<code>constraint.dual_value</code>). The gap of about −1.6·10<sup>−7</sup> is solver tolerance; mathematically it is zero.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the implicit constraints where g = −∞ — writing the dual of an LP without A<sup>T</sup>y + c ⪰ 0 gives nonsense.</li><li>Assuming strong duality for nonconvex problems; there the gap can be positive.</li><li>Requiring strict feasibility for linear inequalities in Slater: it is only needed for the nonlinear ones.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Dual: maximise g(λ, ν) s.t. λ ⪰ 0 — always convex.</li><li>Weak duality d* ≤ p* always; gap p* − d*.</li><li>Convex + Slater ⇒ strong duality d* = p*; feasible LPs always have zero gap.</li><li>The dual of an LP is an LP; dual optimal y is a certificate of optimality.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Slater%27s_condition" target="_blank" rel="noopener">Wikipedia — Slater&#39;s condition</a></li><li><a href="https://en.wikipedia.org/wiki/Weak_duality" target="_blank" rel="noopener">Wikipedia — Weak duality</a></li><li><a href="https://web.stanford.edu/class/ee364a/lectures/duality.pdf" target="_blank" rel="noopener">Stanford EE364a — Duality: dual problem, Slater, LP duality (slides)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write the dual of minimise c<sup>T</sup>x s.t. Ax = b, x ⪰ 0 (standard-form LP).</li><li>Does Slater hold for minimise x<sub>1</sub><sup>2</sup> + x<sub>2</sub><sup>2</sup> s.t. (x<sub>1</sub> − 1)<sup>2</sup> + x<sub>2</sub><sup>2</sup> ≤ 1?</li><li>A feasible x has f<sub>0</sub>(x) = 10.3 and a dual point gives g = 10.1. How far can x be from optimal?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) maximise −b<sup>T</sup>ν s.t. A<sup>T</sup>ν + c ⪰ 0 (writing L = c<sup>T</sup>x + ν<sup>T</sup>(Ax − b) − λ<sup>T</sup>x); equivalently maximise b<sup>T</sup>y s.t. A<sup>T</sup>y ⪯ c with y = −ν. 2) Yes: x = (1, 0) gives 0 &lt; 1, strictly feasible; strong duality holds. 3) f<sub>0</sub>(x) − p* ≤ 10.3 − 10.1 = 0.2: x is 0.2-suboptimal at most.</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 5 · Bài 5.2</span>
<h2>Bài toán đối ngẫu: đối ngẫu yếu, đối ngẫu mạnh và điều kiện Slater</h2>
<p class="lead">Mỗi biến đối ngẫu cho một cận dưới; cận dưới tốt nhất tự nó là một bài toán tối ưu — bài toán đối ngẫu. Với bài lồi, nó thường có cùng giá trị tối ưu với bài gốc.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết bài toán đối ngẫu Lagrange và tìm các ràng buộc ẩn của nó.</li><li>Phát biểu đối ngẫu yếu d* ≤ p* và định nghĩa khoảng cách đối ngẫu.</li><li>Phát biểu điều kiện Slater và định lý đối ngẫu mạnh.</li><li>Suy ra đối ngẫu của một LP và kiểm p* = d* bằng số.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Bài toán đối ngẫu Lagrange (Boyd §5.2)</span>maximize g(λ, ν)   subject to λ ⪰ 0      giá trị tối ưu d*</div>
<p>Bài đối ngẫu <strong>luôn là bài lồi</strong> (cực đại hàm lõm trên tập lồi), bất kể bài gốc. Thường g(λ, ν) = −∞ với một số (λ, ν); ta làm rõ miền bằng cách thêm các điều kiện đó thành ràng buộc — <strong>ràng buộc đối ngẫu</strong>.</p>
<p><strong>Đối ngẫu yếu:</strong> d* ≤ p*, luôn đúng (Bài 5.1). Hiệu p* − d* ≥ 0 là <strong>khoảng cách đối ngẫu tối ưu</strong>. Đối ngẫu yếu hữu ích cả với bài không lồi khó: bài đối ngẫu cho một cận dưới có chứng nhận, vd cho các bài kiểu MAX-CUT.</p>
<p><strong>Đối ngẫu mạnh:</strong> d* = p*. Nói chung không đúng, nhưng đúng với hầu hết bài lồi. Điều kiện đủ chuẩn là</p>
<div class="formula"><span class="lbl">Điều kiện Slater (Boyd §5.2.3)</span>Bài toán lồi và có x khả thi chặt: f<sub>i</sub>(x) &lt; 0 với mọi i, Ax = b.<br>⇒ đối ngẫu mạnh đúng, và tối ưu đối ngẫu đạt được (nếu d* &gt; −∞).</div>
<p>Ràng buộc bất đẳng thức affine không cần chặt. Đặc biệt, <strong>mọi LP khả thi và mọi QP lồi khả thi với ràng buộc tuyến tính đều có khoảng cách đối ngẫu bằng 0</strong>. Slater có thể hỏng trong trường hợp suy biến, vd cực tiểu x với x<sup>2</sup> ≤ 0: điểm khả thi duy nhất là 0, không có điểm khả thi chặt, và tối ưu đối ngẫu không đạt.</p>
<p><strong>Đối ngẫu của LP.</strong> Với cực tiểu c<sup>T</sup>x s.t. Ax ⪯ b, x ⪰ 0: L = c<sup>T</sup>x + y<sup>T</sup>(Ax − b) − z<sup>T</sup>x với y, z ⪰ 0. L tuyến tính theo x, nên infimum là −∞ trừ khi c + A<sup>T</sup>y − z = 0, khi đó g = −b<sup>T</sup>y. Khử z ⪰ 0 ta được LP đối ngẫu: cực đại −b<sup>T</sup>y s.t. A<sup>T</sup>y + c ⪰ 0, y ⪰ 0.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Bài gốc.</b> cực đại 3x<sub>1</sub> + 5x<sub>2</sub> với x<sub>1</sub> ≤ 4, 2x<sub>2</sub> ≤ 12, 3x<sub>1</sub> + 2x<sub>2</sub> ≤ 18, x ⪰ 0 (cực tiểu c<sup>T</sup>x với c = (−3, −5)).</p>
<p>Bước 1 (bài gốc qua các đỉnh): cặp ràng buộc chặt 2x<sub>2</sub> = 12 và 3x<sub>1</sub> + 2x<sub>2</sub> = 18 cho x = (2, 6), lãi 36 ⇒ p* = −36. Bước 2 (đối ngẫu): cực đại −4y<sub>1</sub> − 12y<sub>2</sub> − 18y<sub>3</sub> với y<sub>1</sub> + 3y<sub>3</sub> ≥ 3, 2y<sub>2</sub> + 2y<sub>3</sub> ≥ 5, y ⪰ 0. Bước 3 (đoán từ bài gốc): ràng buộc 1 không chặt nên y<sub>1</sub> = 0; cả hai ràng buộc đối ngẫu chặt: 3y<sub>3</sub> = 3 ⇒ y<sub>3</sub> = 1, 2y<sub>2</sub> + 2 = 5 ⇒ y<sub>2</sub> = 1,5. Giá trị đối ngẫu −12·1,5 − 18·1 = −36 = p*: đối ngẫu mạnh, và y chứng nhận x là tối ưu.</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp

c = np.array([-3.0, -5.0])                       # maximise 3x1 + 5x2  &lt;=&gt;  minimise c^T x
A = np.array([[1.0, 0.0], [0.0, 2.0], [3.0, 2.0]]); b = np.array([4.0, 12.0, 18.0])

x = cp.Variable(2)
cons = [A @ x &lt;= b, x &gt;= 0]
primal = cp.Problem(cp.Minimize(c @ x), cons); primal.solve()

# dual of  min c^T x s.t. A x &lt;= b, x &gt;= 0  is  max -b^T y s.t. A^T y + c &gt;= 0, y &gt;= 0
y = cp.Variable(3)
dual = cp.Problem(cp.Maximize(-b @ y), [A.T @ y + c &gt;= 0, y &gt;= 0]); dual.solve()

print("primal p* =", round(primal.value, 4), " x* =", x.value.round(4))
print("dual   d* =", round(dual.value, 4), " y* =", y.value.round(4))
print("multipliers cvxpy reports for A x &lt;= b:", cons[0].dual_value.round(4))
print("duality gap =", round(primal.value - dual.value, 8))</code></pre>
<div class="out">primal p* = -36.0  x* = [2. 6.]
dual   d* = -36.0  y* = [0.  1.5 1. ]
multipliers cvxpy reports for A x &lt;= b: [0.  1.5 1. ]
duality gap = -1.6e-07</div>
<p>LP đối ngẫu giải riêng cho đúng các nhân tử mà CVXPY gắn vào ràng buộc của bài gốc (<code>constraint.dual_value</code>). Khoảng cách cỡ −1,6·10<sup>−7</sup> là sai số của bộ giải; về toán học nó bằng 0.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên các ràng buộc ẩn nơi g = −∞ — viết đối ngẫu của LP mà thiếu A<sup>T</sup>y + c ⪰ 0 là vô nghĩa.</li><li>Mặc định đối ngẫu mạnh cho bài không lồi; ở đó khoảng cách có thể dương.</li><li>Đòi khả thi chặt cho cả bất đẳng thức tuyến tính trong Slater: chỉ cần cho các ràng buộc phi tuyến.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Đối ngẫu: cực đại g(λ, ν) với λ ⪰ 0 — luôn lồi.</li><li>Đối ngẫu yếu d* ≤ p* luôn đúng; khoảng cách p* − d*.</li><li>Lồi + Slater ⇒ đối ngẫu mạnh d* = p*; LP khả thi luôn có khoảng cách 0.</li><li>Đối ngẫu của LP là LP; y tối ưu đối ngẫu là chứng chỉ tối ưu.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Slater%27s_condition" target="_blank" rel="noopener">Wikipedia — Slater&#39;s condition</a></li><li><a href="https://en.wikipedia.org/wiki/Weak_duality" target="_blank" rel="noopener">Wikipedia — Weak duality</a></li><li><a href="https://web.stanford.edu/class/ee364a/lectures/duality.pdf" target="_blank" rel="noopener">Stanford EE364a — Đối ngẫu: bài đối ngẫu, Slater, đối ngẫu LP (slide)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết đối ngẫu của cực tiểu c<sup>T</sup>x với Ax = b, x ⪰ 0 (LP dạng chuẩn).</li><li>Slater có đúng với bài cực tiểu x<sub>1</sub><sup>2</sup> + x<sub>2</sub><sup>2</sup> với (x<sub>1</sub> − 1)<sup>2</sup> + x<sub>2</sub><sup>2</sup> ≤ 1 không?</li><li>Một x khả thi có f<sub>0</sub>(x) = 10,3 và một điểm đối ngẫu cho g = 10,1. x có thể cách tối ưu bao xa?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) cực đại −b<sup>T</sup>ν với A<sup>T</sup>ν + c ⪰ 0 (viết L = c<sup>T</sup>x + ν<sup>T</sup>(Ax − b) − λ<sup>T</sup>x); tương đương cực đại b<sup>T</sup>y với A<sup>T</sup>y ⪯ c, y = −ν. 2) Có: x = (1, 0) cho 0 &lt; 1, khả thi chặt; đối ngẫu mạnh đúng. 3) f<sub>0</sub>(x) − p* ≤ 10,3 − 10,1 = 0,2: x kém tối ưu nhiều nhất 0,2.</p></div>`);

const c53 = L('cvo201-ts-5-3',
  '5.3 — The KKT conditions: solving a constrained problem by hand|||5.3 — Điều kiện KKT: giải tay một bài toán có ràng buộc',
  'Bốn điều kiện KKT: khả thi gốc, khả thi đối ngẫu, bù trừ (complementary slackness), dừng; KKT cần và đủ cho bài lồi có Slater (Boyd §5.5); giải tay một QP bằng cách đoán tập ràng buộc chặt và kiểm bằng CVXPY.',
  `<span class="eyebrow">CVO201 · Chapter 5 · Lesson 5.3</span>
<h2>The KKT conditions</h2>
<p class="lead">When strong duality holds, the primal and dual optima are linked by four simple conditions — the Karush–Kuhn–Tucker (KKT) conditions. For convex problems they are the complete recipe for optimality, and many ML algorithms are nothing but ways to solve them.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the four KKT conditions.</li><li>Explain complementary slackness in words.</li><li>Know when KKT is necessary, sufficient, or both.</li><li>Solve a small constrained problem by hand with KKT and verify it numerically.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">KKT conditions (Boyd §5.5.3), differentiable f<sub>i</sub>, h<sub>i</sub></span>1. primal feasibility: f<sub>i</sub>(x*) ≤ 0, h<sub>i</sub>(x*) = 0<br>2. dual feasibility: λ<sub>i</sub>* ≥ 0<br>3. complementary slackness: λ<sub>i</sub>* f<sub>i</sub>(x*) = 0 for every i<br>4. stationarity: ∇f<sub>0</sub>(x*) + ∑λ<sub>i</sub>*∇f<sub>i</sub>(x*) + ∑ν<sub>i</sub>*∇h<sub>i</sub>(x*) = 0</div>
<p><strong>Where they come from.</strong> If strong duality holds with primal optimum x* and dual optimum (λ*, ν*), then f<sub>0</sub>(x*) = g(λ*, ν*) = inf<sub>x</sub> L(x, λ*, ν*) ≤ L(x*, λ*, ν*) ≤ f<sub>0</sub>(x*). Both inequalities are equalities: the second forces ∑λ<sub>i</sub>*f<sub>i</sub>(x*) = 0, i.e. complementary slackness; the first says x* minimises L(·, λ*, ν*), i.e. stationarity.</p>
<p><strong>Complementary slackness</strong> says: for each inequality, either the constraint is active (f<sub>i</sub> = 0) or its price is zero (λ<sub>i</sub> = 0). A resource you do not use up is free at the margin.</p>
<p><strong>Necessary and sufficient.</strong> For any problem with strong duality, KKT is <em>necessary</em> at the optimum. For a <em>convex</em> problem, KKT is <em>sufficient</em>: any (x̃, λ̃, ν̃) satisfying the four conditions is optimal with zero gap. So for convex problems satisfying Slater, x is optimal <strong>if and only if</strong> there are multipliers making KKT hold. For nonconvex problems KKT points are only candidates (they include saddles and maxima).</p>
<p><strong>The hand method.</strong> Guess which inequalities are active; set λ<sub>i</sub> = 0 for the inactive ones; solve the stationarity + active-constraint equations; then check λ ≥ 0 and feasibility. If a check fails, change the guess.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Problem.</b> minimise (x<sub>1</sub> − 2)<sup>2</sup> + (x<sub>2</sub> − 1)<sup>2</sup> s.t. f<sub>1</sub> = x<sub>1</sub> + x<sub>2</sub> − 2 ≤ 0, f<sub>2</sub> = −x<sub>1</sub> ≤ 0.</p>
<p>Step 1: the unconstrained minimiser (2, 1) violates f<sub>1</sub> (sum 3 &gt; 2), so guess f<sub>1</sub> active, f<sub>2</sub> inactive ⇒ λ<sub>2</sub> = 0. Step 2 (stationarity): 2(x<sub>1</sub> − 2) + λ<sub>1</sub> = 0 and 2(x<sub>2</sub> − 1) + λ<sub>1</sub> = 0 ⇒ x<sub>1</sub> − 2 = x<sub>2</sub> − 1 ⇒ x<sub>1</sub> = x<sub>2</sub> + 1. Step 3 (active constraint): x<sub>1</sub> + x<sub>2</sub> = 2 ⇒ x = (1.5, 0.5). Step 4: λ<sub>1</sub> = −2(1.5 − 2) = 1 ≥ 0 ✓; f<sub>2</sub> = −1.5 &lt; 0 ✓ (inactive, consistent with λ<sub>2</sub> = 0). All four conditions hold and the problem is convex ⇒ x* = (1.5, 0.5), p* = 0.25 + 0.25 = 0.5.</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp

# minimize (x1 - 2)^2 + (x2 - 1)^2  subject to  x1 + x2 &lt;= 2,  x1 &gt;= 0
x = cp.Variable(2)
cons = [x[0] + x[1] &lt;= 2, x[0] &gt;= 0]
prob = cp.Problem(cp.Minimize(cp.square(x[0] - 2) + cp.square(x[1] - 1)), cons)
prob.solve()
lam1, lam2 = cons[0].dual_value, cons[1].dual_value
print("x* =", x.value.round(4), " p* =", round(prob.value, 4))
print("lambda1 =", round(float(lam1), 4), " lambda2 =", round(float(lam2), 4))

# check the four KKT conditions at the solver's answer
xs = x.value
grad_f = np.array([2 * (xs[0] - 2), 2 * (xs[1] - 1)])
stationarity = grad_f + lam1 * np.array([1, 1]) + lam2 * np.array([-1, 0])
print("stationarity residual:", stationarity.round(6))
print("primal feasible:", xs[0] + xs[1] &lt;= 2 + 1e-8, xs[0] &gt;= -1e-8,
      "| dual feasible:", lam1 &gt;= 0, lam2 &gt;= 0)
print("complementary slackness:", round(float(lam1 * (xs[0] + xs[1] - 2)), 8), round(float(lam2 * xs[0]), 8))</code></pre>
<div class="out">x* = [1.5 0.5]  p* = 0.5
lambda1 = 1.0  lambda2 = 0.0
stationarity residual: [0. 0.]
primal feasible: True True | dual feasible: True True
complementary slackness: 0.0 0.0</div>
<p>The solver's multipliers are exactly λ = (1, 0), and every KKT residual is zero. Geometrically, −∇f<sub>0</sub>(x*) = (1, 1) points along the normal of the active line x<sub>1</sub> + x<sub>2</sub> = 2 — the gradient is “held back” by exactly one constraint.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Accepting a solution with a negative λ: it means the guessed active set is wrong (that constraint should be released).</li><li>Using KKT as a sufficient condition for a nonconvex problem.</li><li>Sign conventions: KKT as written assumes constraints of the form f<sub>i</sub> ≤ 0. Rewrite x<sub>1</sub> ≥ 0 as −x<sub>1</sub> ≤ 0 first.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>KKT = primal feasibility, λ ≥ 0, λ<sub>i</sub>f<sub>i</sub> = 0, ∇<sub>x</sub>L = 0.</li><li>Convex + Slater: x optimal ⇔ KKT holds for some (λ, ν).</li><li>Hand method: guess the active set, solve, check signs.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.stat.cmu.edu/~ryantibs/convexopt/lectures/kkt.pdf" target="_blank" rel="noopener">CMU 10-725 — Karush–Kuhn–Tucker conditions</a></li><li><a href="https://en.wikipedia.org/wiki/Karush%E2%80%93Kuhn%E2%80%93Tucker_conditions" target="_blank" rel="noopener">Wikipedia — Karush–Kuhn–Tucker conditions</a></li><li><a href="https://www.cvxpy.org/examples/applications/water_filling_BVex5.2.html" target="_blank" rel="noopener">CVXPY example — Water filling (Boyd Example 5.2, solved via KKT)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Solve minimise x<sub>1</sub><sup>2</sup> + x<sub>2</sub><sup>2</sup> s.t. x<sub>1</sub> + 2x<sub>2</sub> ≥ 5 with KKT.</li><li>In the worked example, move the target to (1, 0.5). Which constraints are active now?</li><li>Write the KKT conditions for minimise ½x<sup>T</sup>Px + q<sup>T</sup>x s.t. Ax = b (no inequalities).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Constraint 5 − x<sub>1</sub> − 2x<sub>2</sub> ≤ 0 active; 2x<sub>1</sub> = λ, 2x<sub>2</sub> = 2λ ⇒ x = (λ/2, λ); λ/2 + 2λ = 5 ⇒ λ = 2 ⇒ x* = (1, 2), p* = 5. 2) None: (1, 0.5) is feasible (sum 1.5 ≤ 2, x<sub>1</sub> ≥ 0), so λ = 0 and x* = (1, 0.5). 3) Px + q + A<sup>T</sup>ν = 0 and Ax = b — one linear system (Lesson 8.1).</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 5 · Bài 5.3</span>
<h2>Điều kiện KKT</h2>
<p class="lead">Khi đối ngẫu mạnh đúng, tối ưu gốc và tối ưu đối ngẫu được nối bằng bốn điều kiện đơn giản — điều kiện Karush–Kuhn–Tucker (KKT). Với bài lồi, chúng là công thức trọn vẹn của tính tối ưu, và nhiều thuật toán học máy chỉ là cách giải chúng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu bốn điều kiện KKT.</li><li>Giải thích bằng lời tính bù trừ (complementary slackness).</li><li>Biết khi nào KKT là cần, đủ, hoặc cả hai.</li><li>Giải tay một bài có ràng buộc nhỏ bằng KKT và kiểm bằng số.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Điều kiện KKT (Boyd §5.5.3), f<sub>i</sub>, h<sub>i</sub> khả vi</span>1. khả thi gốc: f<sub>i</sub>(x*) ≤ 0, h<sub>i</sub>(x*) = 0<br>2. khả thi đối ngẫu: λ<sub>i</sub>* ≥ 0<br>3. bù trừ: λ<sub>i</sub>* f<sub>i</sub>(x*) = 0 với mọi i<br>4. dừng: ∇f<sub>0</sub>(x*) + ∑λ<sub>i</sub>*∇f<sub>i</sub>(x*) + ∑ν<sub>i</sub>*∇h<sub>i</sub>(x*) = 0</div>
<p><strong>Chúng từ đâu ra.</strong> Nếu đối ngẫu mạnh đúng với tối ưu gốc x* và tối ưu đối ngẫu (λ*, ν*), thì f<sub>0</sub>(x*) = g(λ*, ν*) = inf<sub>x</sub> L(x, λ*, ν*) ≤ L(x*, λ*, ν*) ≤ f<sub>0</sub>(x*). Cả hai bất đẳng thức đều là đẳng thức: cái thứ hai buộc ∑λ<sub>i</sub>*f<sub>i</sub>(x*) = 0, tức tính bù trừ; cái thứ nhất nói x* cực tiểu L(·, λ*, ν*), tức điều kiện dừng.</p>
<p><strong>Tính bù trừ</strong> nói: với mỗi bất đẳng thức, hoặc ràng buộc chặt (f<sub>i</sub> = 0), hoặc giá của nó bằng 0 (λ<sub>i</sub> = 0). Tài nguyên bạn không dùng hết thì ở biên không có giá.</p>
<p><strong>Cần và đủ.</strong> Với mọi bài có đối ngẫu mạnh, KKT là điều kiện <em>cần</em> tại tối ưu. Với bài <em>lồi</em>, KKT là điều kiện <em>đủ</em>: mọi (x̃, λ̃, ν̃) thoả bốn điều kiện đều tối ưu với khoảng cách 0. Vậy với bài lồi thoả Slater, x tối ưu <strong>khi và chỉ khi</strong> có nhân tử làm KKT đúng. Với bài không lồi, điểm KKT chỉ là ứng viên (gồm cả yên ngựa và cực đại).</p>
<p><strong>Cách giải tay.</strong> Đoán bất đẳng thức nào chặt; đặt λ<sub>i</sub> = 0 cho các cái không chặt; giải hệ điều kiện dừng + ràng buộc chặt; rồi kiểm λ ≥ 0 và tính khả thi. Nếu một phép kiểm hỏng, đổi phỏng đoán.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Bài toán.</b> cực tiểu (x<sub>1</sub> − 2)<sup>2</sup> + (x<sub>2</sub> − 1)<sup>2</sup> với f<sub>1</sub> = x<sub>1</sub> + x<sub>2</sub> − 2 ≤ 0, f<sub>2</sub> = −x<sub>1</sub> ≤ 0.</p>
<p>Bước 1: điểm cực tiểu không ràng buộc (2, 1) vi phạm f<sub>1</sub> (tổng 3 &gt; 2), nên đoán f<sub>1</sub> chặt, f<sub>2</sub> không chặt ⇒ λ<sub>2</sub> = 0. Bước 2 (dừng): 2(x<sub>1</sub> − 2) + λ<sub>1</sub> = 0 và 2(x<sub>2</sub> − 1) + λ<sub>1</sub> = 0 ⇒ x<sub>1</sub> − 2 = x<sub>2</sub> − 1 ⇒ x<sub>1</sub> = x<sub>2</sub> + 1. Bước 3 (ràng buộc chặt): x<sub>1</sub> + x<sub>2</sub> = 2 ⇒ x = (1,5; 0,5). Bước 4: λ<sub>1</sub> = −2(1,5 − 2) = 1 ≥ 0 ✓; f<sub>2</sub> = −1,5 &lt; 0 ✓ (không chặt, khớp λ<sub>2</sub> = 0). Cả bốn điều kiện đúng và bài lồi ⇒ x* = (1,5; 0,5), p* = 0,25 + 0,25 = 0,5.</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp

# minimize (x1 - 2)^2 + (x2 - 1)^2  subject to  x1 + x2 &lt;= 2,  x1 &gt;= 0
x = cp.Variable(2)
cons = [x[0] + x[1] &lt;= 2, x[0] &gt;= 0]
prob = cp.Problem(cp.Minimize(cp.square(x[0] - 2) + cp.square(x[1] - 1)), cons)
prob.solve()
lam1, lam2 = cons[0].dual_value, cons[1].dual_value
print("x* =", x.value.round(4), " p* =", round(prob.value, 4))
print("lambda1 =", round(float(lam1), 4), " lambda2 =", round(float(lam2), 4))

# check the four KKT conditions at the solver's answer
xs = x.value
grad_f = np.array([2 * (xs[0] - 2), 2 * (xs[1] - 1)])
stationarity = grad_f + lam1 * np.array([1, 1]) + lam2 * np.array([-1, 0])
print("stationarity residual:", stationarity.round(6))
print("primal feasible:", xs[0] + xs[1] &lt;= 2 + 1e-8, xs[0] &gt;= -1e-8,
      "| dual feasible:", lam1 &gt;= 0, lam2 &gt;= 0)
print("complementary slackness:", round(float(lam1 * (xs[0] + xs[1] - 2)), 8), round(float(lam2 * xs[0]), 8))</code></pre>
<div class="out">x* = [1.5 0.5]  p* = 0.5
lambda1 = 1.0  lambda2 = 0.0
stationarity residual: [0. 0.]
primal feasible: True True | dual feasible: True True
complementary slackness: 0.0 0.0</div>
<p>Nhân tử của bộ giải đúng là λ = (1, 0), và mọi phần dư KKT bằng 0. Về hình học, −∇f<sub>0</sub>(x*) = (1, 1) chĩa theo pháp tuyến của đường chặt x<sub>1</sub> + x<sub>2</sub> = 2 — gradient bị “giữ lại” bởi đúng một ràng buộc.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chấp nhận nghiệm có λ âm: nghĩa là tập chặt đoán sai (ràng buộc đó phải được thả ra).</li><li>Dùng KKT như điều kiện đủ cho bài không lồi.</li><li>Quy ước dấu: KKT như viết giả định ràng buộc dạng f<sub>i</sub> ≤ 0. Hãy viết x<sub>1</sub> ≥ 0 thành −x<sub>1</sub> ≤ 0 trước.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>KKT = khả thi gốc, λ ≥ 0, λ<sub>i</sub>f<sub>i</sub> = 0, ∇<sub>x</sub>L = 0.</li><li>Lồi + Slater: x tối ưu ⇔ KKT đúng với (λ, ν) nào đó.</li><li>Cách giải tay: đoán tập chặt, giải, kiểm dấu.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.stat.cmu.edu/~ryantibs/convexopt/lectures/kkt.pdf" target="_blank" rel="noopener">CMU 10-725 — Điều kiện Karush–Kuhn–Tucker</a></li><li><a href="https://en.wikipedia.org/wiki/Karush%E2%80%93Kuhn%E2%80%93Tucker_conditions" target="_blank" rel="noopener">Wikipedia — Karush–Kuhn–Tucker conditions</a></li><li><a href="https://www.cvxpy.org/examples/applications/water_filling_BVex5.2.html" target="_blank" rel="noopener">Ví dụ CVXPY — Water filling (Boyd Ví dụ 5.2, giải qua KKT)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Giải bằng KKT: cực tiểu x<sub>1</sub><sup>2</sup> + x<sub>2</sub><sup>2</sup> với x<sub>1</sub> + 2x<sub>2</sub> ≥ 5.</li><li>Trong ví dụ, dời đích về (1; 0,5). Giờ ràng buộc nào chặt?</li><li>Viết điều kiện KKT cho cực tiểu ½x<sup>T</sup>Px + q<sup>T</sup>x với Ax = b (không có bất đẳng thức).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Ràng buộc 5 − x<sub>1</sub> − 2x<sub>2</sub> ≤ 0 chặt; 2x<sub>1</sub> = λ, 2x<sub>2</sub> = 2λ ⇒ x = (λ/2, λ); λ/2 + 2λ = 5 ⇒ λ = 2 ⇒ x* = (1, 2), p* = 5. 2) Không cái nào: (1; 0,5) khả thi (tổng 1,5 ≤ 2, x<sub>1</sub> ≥ 0), nên λ = 0 và x* = (1; 0,5). 3) Px + q + A<sup>T</sup>ν = 0 và Ax = b — một hệ tuyến tính (Bài 8.1).</p></div>`);

const c54 = L('cvo201-ts-5-4',
  '5.4 — Sensitivity analysis: Lagrange multipliers as shadow prices|||5.4 — Phân tích độ nhạy: nhân tử Lagrange là giá bóng',
  'Bài toán nhiễu p*(u, v), công thức độ nhạy ∂p*/∂ui = −λi*, diễn giải giá bóng (shadow price), đọc dual_value trong CVXPY, kiểm dự đoán bằng cách giải lại (Boyd §5.6).',
  `<span class="eyebrow">CVO201 · Chapter 5 · Lesson 5.4</span>
<h2>Sensitivity analysis: multipliers as shadow prices</h2>
<p class="lead">Dual variables are not only a mathematical device: they tell you how much the optimal value changes when you loosen or tighten a constraint. In economics they are called shadow prices; in engineering, sensitivities.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define the perturbed problem and its optimal value p*(u, v).</li><li>State the global and local sensitivity results.</li><li>Read and interpret dual values from CVXPY, and verify predictions by re-solving.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Perturbed problem (Boyd §5.6)</span>minimize f<sub>0</sub>(x)  subject to f<sub>i</sub>(x) ≤ u<sub>i</sub>,  h<sub>i</sub>(x) = v<sub>i</sub>      optimal value p*(u, v)</div>
<p>u<sub>i</sub> &gt; 0 loosens the i-th constraint, u<sub>i</sub> &lt; 0 tightens it. For a convex problem p*(u, v) is a convex function of (u, v). Suppose strong duality holds and (λ*, ν*) is dual optimal for the unperturbed problem. Then for all u, v:</p>
<div class="formula"><span class="lbl">Global sensitivity inequality</span>p*(u, v) ≥ p*(0, 0) − λ*<sup>T</sup>u − ν*<sup>T</sup>v</div>
<p>and, if p* is differentiable at 0, the <strong>local sensitivity</strong> λ<sub>i</sub>* = −∂p*/∂u<sub>i</sub>, ν<sub>i</sub>* = −∂p*/∂v<sub>i</sub>. Consequences you can read off without re-solving:</p>
<ul><li>λ<sub>i</sub>* large: tightening constraint i hurts a lot; loosening it helps a lot (to first order).</li><li>λ<sub>i</sub>* = 0 (inactive constraint): small changes do nothing — matching complementary slackness.</li><li>The inequality is global but one-sided: tightening by u<sub>i</sub> &lt; 0 increases p* by <em>at least</em> −λ<sub>i</sub>*u<sub>i</sub>; loosening gives a first-order estimate that is exact only while the set of active constraints does not change.</li></ul>
<p>For a <strong>maximisation</strong> (profit) problem the same multipliers measure the profit gained per unit of extra resource: the <strong>shadow price</strong> of that resource. A manager should pay at most the shadow price for one more hour of a scarce machine.</p>
<h3>✍️ Worked example — the workshop of Lesson 1.3</h3>
<div class="callout"><p><b>Problem.</b> maximise 70x<sub>1</sub> + 50x<sub>2</sub> s.t. 4x<sub>1</sub> + 3x<sub>2</sub> ≤ 240 (carpentry), 2x<sub>1</sub> + x<sub>2</sub> ≤ 100 (painting), x ⪰ 0. Optimum (30, 40), profit 4100.</p>
<p>Step 1 (dual by hand): both resource constraints are active and x &gt; 0, so the dual constraints are tight: 4y<sub>1</sub> + 2y<sub>2</sub> = 70 and 3y<sub>1</sub> + y<sub>2</sub> = 50. Step 2: from the second, y<sub>2</sub> = 50 − 3y<sub>1</sub>; substituting, 4y<sub>1</sub> + 100 − 6y<sub>1</sub> = 70 ⇒ y<sub>1</sub> = <b>15</b>, y<sub>2</sub> = <b>5</b>. Step 3 (check): 240·15 + 100·5 = 4100 = profit ✓ (strong duality). Step 4 (interpretation): one more carpentry hour is worth 15, one more painting hour 5.</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp

def solve(hours):
    x = cp.Variable(2)
    cons = [4*x[0] + 3*x[1] &lt;= hours, 2*x[0] + x[1] &lt;= 100, x &gt;= 0]
    prob = cp.Problem(cp.Maximize(70*x[0] + 50*x[1]), cons); prob.solve()
    return prob.value, cons[0].dual_value, cons[1].dual_value

p0, y1, y2 = solve(240)
print("profit =", round(p0, 4), "| shadow price carpentry =", round(float(y1), 4),
      "| shadow price painting =", round(float(y2), 4))
for h in [241, 250, 260]:
    p, _, _ = solve(h)
    print(f"carpentry hours {h}: profit = {p:.4f}  change = {p - p0:+.4f}  "
          f"predicted = {y1 * (h - 240):+.4f}")</code></pre>
<div class="out">profit = 4100.0 | shadow price carpentry = 15.0 | shadow price painting = 5.0
carpentry hours 241: profit = 4115.0000  change = +15.0000  predicted = +15.0000
carpentry hours 250: profit = 4250.0000  change = +150.0000  predicted = +150.0000
carpentry hours 260: profit = 4400.0000  change = +300.0000  predicted = +300.0000</div>
<p>Re-solving with 241, 250 and 260 carpentry hours changes the profit by exactly 15 per hour, as predicted. The prediction stays exact here because the same two constraints remain active; beyond about 300 hours (when x<sub>1</sub> reaches 0) the active set changes and the shadow price drops.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Extrapolating a shadow price over huge changes — it is a local (first-order) quantity.</li><li>Mixing sign conventions: for minimisation with f<sub>i</sub> ≤ u<sub>i</sub>, ∂p*/∂u<sub>i</sub> = −λ<sub>i</sub>* (loosening lowers the cost).</li><li>Reading <code>dual_value</code> of an equality constraint and expecting it to be nonnegative: ν can have either sign.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Perturb f<sub>i</sub> ≤ u<sub>i</sub>, h<sub>i</sub> = v<sub>i</sub>; p*(u, v) ≥ p* − λ*<sup>T</sup>u − ν*<sup>T</sup>v.</li><li>Locally λ<sub>i</sub>* = −∂p*/∂u<sub>i</sub>: the multiplier is the marginal value of the constraint.</li><li>In CVXPY: <code>constraint.dual_value</code> after <code>solve()</code>.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Shadow_price" target="_blank" rel="noopener">Wikipedia — Shadow price</a></li><li><a href="https://www.cvxpy.org/tutorial/intro/index.html" target="_blank" rel="noopener">CVXPY tutorial — dual variables section</a></li><li><a href="https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf" target="_blank" rel="noopener">Boyd &amp; Vandenberghe — §5.6 Perturbation and sensitivity analysis (PDF)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Using the shadow prices, estimate the profit if painting hours rise from 100 to 104.</li><li>In the diet LP of Lesson 4.2, what is the sign of the multiplier on “protein ≥ 60”, and what does it mean?</li><li>Why is the multiplier of x<sub>1</sub> ≥ 0 zero at the workshop optimum?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 4100 + 4·5 = 4120 (exact, the active set does not change). 2) Positive: one more gram of required protein raises the minimum cost by that amount. 3) x<sub>1</sub> = 30 &gt; 0, the constraint is inactive, so complementary slackness forces its multiplier to 0.</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 5 · Bài 5.4</span>
<h2>Phân tích độ nhạy: nhân tử là giá bóng</h2>
<p class="lead">Biến đối ngẫu không chỉ là công cụ toán học: chúng cho biết giá trị tối ưu đổi bao nhiêu khi bạn nới hay siết một ràng buộc. Trong kinh tế gọi là giá bóng; trong kỹ thuật gọi là độ nhạy.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa bài toán nhiễu và giá trị tối ưu p*(u, v).</li><li>Phát biểu kết quả độ nhạy toàn cục và địa phương.</li><li>Đọc và diễn giải giá trị đối ngẫu từ CVXPY, kiểm dự đoán bằng cách giải lại.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Bài toán nhiễu (Boyd §5.6)</span>minimize f<sub>0</sub>(x)  subject to f<sub>i</sub>(x) ≤ u<sub>i</sub>,  h<sub>i</sub>(x) = v<sub>i</sub>      giá trị tối ưu p*(u, v)</div>
<p>u<sub>i</sub> &gt; 0 nới ràng buộc thứ i, u<sub>i</sub> &lt; 0 siết nó. Với bài lồi, p*(u, v) là hàm lồi theo (u, v). Giả sử đối ngẫu mạnh đúng và (λ*, ν*) tối ưu đối ngẫu cho bài chưa nhiễu. Khi đó với mọi u, v:</p>
<div class="formula"><span class="lbl">Bất đẳng thức độ nhạy toàn cục</span>p*(u, v) ≥ p*(0, 0) − λ*<sup>T</sup>u − ν*<sup>T</sup>v</div>
<p>và nếu p* khả vi tại 0 thì có <strong>độ nhạy địa phương</strong> λ<sub>i</sub>* = −∂p*/∂u<sub>i</sub>, ν<sub>i</sub>* = −∂p*/∂v<sub>i</sub>. Hệ quả đọc được mà không cần giải lại:</p>
<ul><li>λ<sub>i</sub>* lớn: siết ràng buộc i gây hại nhiều; nới nó lợi nhiều (ở bậc một).</li><li>λ<sub>i</sub>* = 0 (ràng buộc không chặt): thay đổi nhỏ không có tác dụng — khớp tính bù trừ.</li><li>Bất đẳng thức là toàn cục nhưng một phía: siết một lượng u<sub>i</sub> &lt; 0 làm p* tăng <em>ít nhất</em> −λ<sub>i</sub>*u<sub>i</sub>; nới cho ước lượng bậc một, chỉ chính xác khi tập ràng buộc chặt không đổi.</li></ul>
<p>Với bài <strong>cực đại</strong> (lợi nhuận), cùng các nhân tử đó đo lợi nhuận thu thêm trên mỗi đơn vị tài nguyên tăng thêm: <strong>giá bóng</strong> của tài nguyên. Người quản lý chỉ nên trả tối đa bằng giá bóng cho thêm một giờ máy đang khan hiếm.</p>
<h3>✍️ Ví dụ giải từng bước — xưởng ở Bài 1.3</h3>
<div class="callout"><p><b>Bài toán.</b> cực đại 70x<sub>1</sub> + 50x<sub>2</sub> với 4x<sub>1</sub> + 3x<sub>2</sub> ≤ 240 (mộc), 2x<sub>1</sub> + x<sub>2</sub> ≤ 100 (sơn), x ⪰ 0. Tối ưu (30, 40), lãi 4100.</p>
<p>Bước 1 (đối ngẫu bằng tay): cả hai ràng buộc tài nguyên chặt và x &gt; 0, nên các ràng buộc đối ngẫu chặt: 4y<sub>1</sub> + 2y<sub>2</sub> = 70 và 3y<sub>1</sub> + y<sub>2</sub> = 50. Bước 2: từ phương trình thứ hai, y<sub>2</sub> = 50 − 3y<sub>1</sub>; thế vào, 4y<sub>1</sub> + 100 − 6y<sub>1</sub> = 70 ⇒ y<sub>1</sub> = <b>15</b>, y<sub>2</sub> = <b>5</b>. Bước 3 (kiểm): 240·15 + 100·5 = 4100 = lãi ✓ (đối ngẫu mạnh). Bước 4 (diễn giải): thêm một giờ mộc đáng 15, thêm một giờ sơn đáng 5.</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp

def solve(hours):
    x = cp.Variable(2)
    cons = [4*x[0] + 3*x[1] &lt;= hours, 2*x[0] + x[1] &lt;= 100, x &gt;= 0]
    prob = cp.Problem(cp.Maximize(70*x[0] + 50*x[1]), cons); prob.solve()
    return prob.value, cons[0].dual_value, cons[1].dual_value

p0, y1, y2 = solve(240)
print("profit =", round(p0, 4), "| shadow price carpentry =", round(float(y1), 4),
      "| shadow price painting =", round(float(y2), 4))
for h in [241, 250, 260]:
    p, _, _ = solve(h)
    print(f"carpentry hours {h}: profit = {p:.4f}  change = {p - p0:+.4f}  "
          f"predicted = {y1 * (h - 240):+.4f}")</code></pre>
<div class="out">profit = 4100.0 | shadow price carpentry = 15.0 | shadow price painting = 5.0
carpentry hours 241: profit = 4115.0000  change = +15.0000  predicted = +15.0000
carpentry hours 250: profit = 4250.0000  change = +150.0000  predicted = +150.0000
carpentry hours 260: profit = 4400.0000  change = +300.0000  predicted = +300.0000</div>
<p>Giải lại với 241, 250 và 260 giờ mộc, lợi nhuận đổi đúng 15 mỗi giờ như dự đoán. Dự đoán vẫn chính xác ở đây vì hai ràng buộc chặt vẫn giữ nguyên; quá khoảng 300 giờ (khi x<sub>1</sub> về 0) tập chặt thay đổi và giá bóng giảm.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Ngoại suy giá bóng cho thay đổi rất lớn — nó là đại lượng địa phương (bậc một).</li><li>Lẫn quy ước dấu: với bài cực tiểu và f<sub>i</sub> ≤ u<sub>i</sub>, ∂p*/∂u<sub>i</sub> = −λ<sub>i</sub>* (nới làm giảm chi phí).</li><li>Đọc <code>dual_value</code> của ràng buộc đẳng thức và chờ nó không âm: ν có thể mang dấu bất kỳ.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Nhiễu f<sub>i</sub> ≤ u<sub>i</sub>, h<sub>i</sub> = v<sub>i</sub>; p*(u, v) ≥ p* − λ*<sup>T</sup>u − ν*<sup>T</sup>v.</li><li>Địa phương λ<sub>i</sub>* = −∂p*/∂u<sub>i</sub>: nhân tử là giá trị biên của ràng buộc.</li><li>Trong CVXPY: <code>constraint.dual_value</code> sau <code>solve()</code>.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Shadow_price" target="_blank" rel="noopener">Wikipedia — Shadow price</a></li><li><a href="https://www.cvxpy.org/tutorial/intro/index.html" target="_blank" rel="noopener">Hướng dẫn CVXPY — mục dual variables</a></li><li><a href="https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf" target="_blank" rel="noopener">Boyd &amp; Vandenberghe — §5.6 Nhiễu và phân tích độ nhạy (PDF)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Dùng giá bóng, ước lượng lợi nhuận nếu giờ sơn tăng từ 100 lên 104.</li><li>Trong LP khẩu phần ở Bài 4.2, nhân tử của “đạm ≥ 60” mang dấu gì, nghĩa là gì?</li><li>Vì sao nhân tử của x<sub>1</sub> ≥ 0 bằng 0 tại tối ưu của xưởng?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 4100 + 4·5 = 4120 (chính xác, tập chặt không đổi). 2) Dương: tăng nhu cầu đạm thêm một gam làm chi phí tối thiểu tăng đúng lượng đó. 3) x<sub>1</sub> = 30 &gt; 0, ràng buộc không chặt, nên tính bù trừ buộc nhân tử của nó bằng 0.</p></div>`);

const q5 = QZ(5, 'Quiz — Chapter 5: Duality and KKT|||Quiz — Chương 5: Đối ngẫu và KKT',
  'Kiểm tra hàm Lagrange, hàm đối ngẫu, đối ngẫu yếu/mạnh, Slater, đối ngẫu LP, bốn điều kiện KKT, giá bóng.', [
  Q('q1', 'The dual function g(λ, ν) = infₓ L(x, λ, ν) is|||Hàm đối ngẫu g(λ, ν) = infₓ L(x, λ, ν)',
    ['convex only if the primal is convex|||lồi chỉ khi bài gốc lồi', 'always concave|||luôn lõm', 'always linear|||luôn tuyến tính', 'concave only for LPs|||lõm chỉ với LP'], 1,
    'An infimum of affine functions of (λ, ν) is concave.|||Infimum của các hàm affine theo (λ, ν) là lõm.'),
  Q('q2', 'Weak duality states|||Đối ngẫu yếu phát biểu',
    ['d* ≥ p*|||d* ≥ p*', 'd* ≤ p* for every problem|||d* ≤ p* với mọi bài toán', 'd* = p* for convex problems|||d* = p* với bài lồi', 'p* ≤ 0|||p* ≤ 0'], 1,
    'Every dual-feasible point gives a lower bound.|||Mọi điểm khả thi đối ngẫu cho một cận dưới.'),
  Q('q3', 'Slater’s condition requires|||Điều kiện Slater đòi hỏi',
    ['a convex problem with a strictly feasible point|||bài lồi có một điểm khả thi chặt', 'a unique optimum|||nghiệm tối ưu duy nhất', 'a bounded feasible set|||miền khả thi bị chặn', 'differentiable constraints|||ràng buộc khả vi'], 0,
    'Strict feasibility is needed only for nonlinear inequalities.|||Khả thi chặt chỉ cần cho bất đẳng thức phi tuyến.'),
  Q('q4', 'For a feasible LP, the duality gap is|||Với LP khả thi, khoảng cách đối ngẫu',
    ['always positive|||luôn dương', 'always zero|||luôn bằng 0', 'undefined|||không xác định', 'equal to the number of constraints|||bằng số ràng buộc'], 1,
    'Linear constraints satisfy the refined Slater condition.|||Ràng buộc tuyến tính thoả điều kiện Slater dạng tinh chỉnh.'),
  Q('q5', 'The dual of min cᵀx s.t. Ax ⪯ b, x ⪰ 0 is|||Đối ngẫu của min cᵀx s.t. Ax ⪯ b, x ⪰ 0 là',
    ['max −bᵀy s.t. Aᵀy + c ⪰ 0, y ⪰ 0|||max −bᵀy s.t. Aᵀy + c ⪰ 0, y ⪰ 0', 'max bᵀy s.t. Ay ⪯ c|||max bᵀy s.t. Ay ⪯ c', 'min bᵀy s.t. y ⪰ 0|||min bᵀy s.t. y ⪰ 0', 'max cᵀy s.t. Aᵀy = b|||max cᵀy s.t. Aᵀy = b'], 0,
    'Minimising L over x is finite only if c + Aᵀy − z = 0 with z ⪰ 0.|||Cực tiểu L theo x hữu hạn chỉ khi c + Aᵀy − z = 0 với z ⪰ 0.'),
  Q('q6', 'Complementary slackness says that for each inequality|||Tính bù trừ nói rằng với mỗi bất đẳng thức',
    ['λᵢ = fᵢ(x*)|||λᵢ = fᵢ(x*)', 'λᵢ fᵢ(x*) = 0|||λᵢ fᵢ(x*) = 0', 'λᵢ > 0|||λᵢ > 0', 'fᵢ(x*) = 0|||fᵢ(x*) = 0'], 1,
    'Either the constraint is active or its multiplier is zero.|||Hoặc ràng buộc chặt, hoặc nhân tử bằng 0.'),
  Q('q7', 'For a convex problem satisfying Slater, KKT conditions are|||Với bài lồi thoả Slater, điều kiện KKT',
    ['necessary only|||chỉ cần', 'sufficient only|||chỉ đủ', 'necessary and sufficient for optimality|||cần và đủ cho tính tối ưu', 'neither|||không cần không đủ'], 2,
    'Strong duality gives necessity; convexity gives sufficiency.|||Đối ngẫu mạnh cho tính cần; tính lồi cho tính đủ.'),
  Q('q8', 'Solving KKT by hand you find λ₁ = −0.5 for a guessed active constraint. You should|||Giải KKT bằng tay bạn được λ₁ = −0,5 cho một ràng buộc đoán là chặt. Bạn nên',
    ['accept the solution|||chấp nhận nghiệm', 'release that constraint and re-solve|||thả ràng buộc đó và giải lại', 'set λ₁ = 0.5|||đặt λ₁ = 0,5', 'add more constraints|||thêm ràng buộc'], 1,
    'Dual feasibility λ ≥ 0 fails, so the active-set guess is wrong.|||Khả thi đối ngẫu λ ≥ 0 hỏng, nên phỏng đoán tập chặt sai.'),
  Q('q9', 'A feasible x has f₀(x) = 7.4 and some dual point has g = 7.1. Then|||x khả thi có f₀(x) = 7,4 và một điểm đối ngẫu có g = 7,1. Khi đó',
    ['p* = 7.1|||p* = 7,1', 'f₀(x) − p* ≤ 0.3|||f₀(x) − p* ≤ 0,3', 'x is optimal|||x tối ưu', 'nothing can be said|||không kết luận được gì'], 1,
    'g ≤ p* ≤ f₀(x), so the suboptimality is at most the gap 0.3.|||g ≤ p* ≤ f₀(x), nên độ kém tối ưu không quá khoảng cách 0,3.'),
  Q('q10', 'In a profit-maximising LP, a resource has shadow price 15. One extra unit of it|||Trong LP cực đại lợi nhuận, một tài nguyên có giá bóng 15. Thêm một đơn vị',
    ['raises profit by about 15 (to first order)|||tăng lợi nhuận khoảng 15 (bậc một)', 'raises profit by exactly 15 forever|||luôn tăng lợi nhuận đúng 15 mãi mãi', 'costs 15|||tốn 15', 'has no effect|||không có tác dụng'], 0,
    'Shadow prices are local sensitivities, exact only while the active set is unchanged.|||Giá bóng là độ nhạy địa phương, chính xác khi tập chặt chưa đổi.'),
]);

const ch5 = {
  title: 'Chapter 5 — Duality and the KKT conditions|||Chương 5 — Đối ngẫu và điều kiện KKT',
  description: 'Hàm Lagrange, hàm đối ngẫu, bài toán đối ngẫu, đối ngẫu yếu/mạnh, điều kiện Slater, đối ngẫu LP, điều kiện KKT giải tay, phân tích độ nhạy và giá bóng (Boyd Ch. 5 · EE364a bài 5 · CMU 10-725).',
  lessons: [c51, c52, c53, c54, q5],
};


// ───────────────────────────── Chương 6 — Ứng dụng: khớp dữ liệu, học máy, tài chính ─────────────────────────────
const c61 = L('cvo201-ts-6-1',
  '6.1 — Least squares and norm approximation: normal equations, conditioning and robust penalties|||6.1 — Bình phương tối thiểu và xấp xỉ chuẩn: phương trình chuẩn, số điều kiện và hàm phạt bền vững',
  'Bài xấp xỉ chuẩn min ‖Ax − b‖, bình phương tối thiểu và hệ phương trình chuẩn (nhắc MAA102 Bài 9.2), số điều kiện của AᵀA, so sánh phạt ℓ2/ℓ1/Huber với ngoại lai (Boyd §6.1).',
  `<span class="eyebrow">CVO201 · Chapter 6 · Lesson 6.1</span>
<h2>Least squares and norm approximation</h2>
<p class="lead">Fitting a model to data is the most common optimization problem in the world. Least squares is its oldest and fastest form; choosing a different norm or penalty changes what “best fit” means.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write a fitting problem as norm approximation minimise ‖Ax − b‖.</li><li>Solve least squares by the normal equations and by a QR/SVD-based solver, and explain why the latter is preferred.</li><li>Use the condition number to predict numerical trouble.</li><li>Choose between ℓ<sub>2</sub>, ℓ<sub>1</sub> and Huber penalties when the data contain outliers.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Norm approximation (Boyd §6.1)</span>minimize ‖Ax − b‖      A ∈ ℝ<sup>m×n</sup>, m ≥ n<br>least squares (ℓ<sub>2</sub>):  A<sup>T</sup>Ax = A<sup>T</sup>b ⇒ x* = (A<sup>T</sup>A)<sup>−1</sup>A<sup>T</sup>b  if A has full column rank</div>
<p>Each row a<sub>i</sub><sup>T</sup>x − b<sub>i</sub> is a <strong>residual</strong>: the prediction error on data point i. Polynomial fitting, linear regression with many features, signal deconvolution and calibration all have this form: the columns of A are the features (or basis functions) evaluated at the data points. The least-squares residual r = Ax* − b is orthogonal to every column of A (A<sup>T</sup>r = 0): Ax* is the orthogonal projection of b onto the column space (MAA102 Lesson 9.2, MLT201 Lesson 9.1).</p>
<p><strong>Numerics.</strong> Forming A<sup>T</sup>A squares the condition number: cond(A<sup>T</sup>A) = cond(A)<sup>2</sup>. With cond(A) = 10<sup>6</sup> you lose about 12 of the 16 digits of double precision. Library solvers (<code>np.linalg.lstsq</code>, which uses the SVD, or a QR factorisation) work with A directly and lose only about cond(A) digits. Rule: derive with the normal equations, compute with <code>lstsq</code>.</p>
<p><strong>Other penalties.</strong> The general penalty problem is minimise ∑φ(r<sub>i</sub>). Squares (φ = u<sup>2</sup>) punish large residuals heavily, so a few outliers drag the whole fit. The ℓ<sub>1</sub> penalty (φ = |u|) is far more tolerant and gives many residuals that are exactly zero. The <strong>Huber</strong> penalty is quadratic for |u| ≤ M and linear beyond — least squares for normal points, ℓ<sub>1</sub> for outliers (Boyd §6.1.2). All are convex, so CVXPY handles them with <code>cp.norm1</code> or <code>cp.huber</code>.</p>
<h3>✍️ Worked example — a quadratic fit</h3>
<div class="callout"><p><b>Problem.</b> 20 noisy samples of y = 1 + 2t − 3t<sup>2</sup> on [0, 1]. Fit w<sub>0</sub> + w<sub>1</sub>t + w<sub>2</sub>t<sup>2</sup>.</p>
<p>Step 1: build A with columns 1, t, t<sup>2</sup> (a 20 × 3 matrix). Step 2: solve A<sup>T</sup>Aw = A<sup>T</sup>y (3 × 3 system) or call <code>lstsq</code>. Step 3: check A<sup>T</sup>r = 0. Step 4: look at the conditioning — fine for degree 2, catastrophic for degree 9 on [0, 1], because the columns t<sup>k</sup> become nearly parallel.</p></div>
<pre><code class="language-python">import numpy as np

# fit y = w0 + w1 t + w2 t^2 to noisy data
rng = np.random.default_rng(6)
t = np.linspace(0, 1, 20)
y = 1 + 2 * t - 3 * t**2 + 0.05 * rng.normal(size=t.size)
A = np.column_stack([np.ones_like(t), t, t**2])

w_normal = np.linalg.solve(A.T @ A, A.T @ y)          # normal equations
w_lstsq = np.linalg.lstsq(A, y, rcond=None)[0]        # QR/SVD based
print("normal equations :", w_normal.round(4))
print("np.linalg.lstsq  :", w_lstsq.round(4))
r = A @ w_lstsq - y
print("residual norm    :", round(np.linalg.norm(r), 4), "| A^T r =", (A.T @ r).round(10))
print("cond(A) =", round(np.linalg.cond(A), 1), " cond(A^T A) =", round(np.linalg.cond(A.T @ A), 1))

# high-degree polynomial: conditioning explodes
A9 = np.vander(t, 10, increasing=True)
print("degree 9: cond(A) = %.2e, cond(A^T A) = %.2e" % (np.linalg.cond(A9), np.linalg.cond(A9.T @ A9)))</code></pre>
<div class="out">normal equations : [ 1.037   1.8709 -2.8517]
np.linalg.lstsq  : [ 1.037   1.8709 -2.8517]
residual norm    : 0.2333 | A^T r = [0. 0. 0.]
cond(A) = 20.9  cond(A^T A) = 436.2
degree 9: cond(A) = 3.79e+06, cond(A^T A) = 1.44e+13</div>
<p>The estimate (1.04, 1.87, −2.85) is close to the true (1, 2, −3), the residual is orthogonal to the columns, and cond(A<sup>T</sup>A) ≈ 20.9<sup>2</sup>. For degree 9 the normal-equation matrix has condition number 1.4·10<sup>13</sup> — only about three trustworthy digits remain.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Computing <code>inv(A.T @ A) @ A.T @ b</code> in production code — slow and numerically fragile.</li><li>Using least squares on data with gross outliers and trusting the result; try Huber or ℓ<sub>1</sub> and compare.</li><li>Fitting high-degree polynomials in the monomial basis; rescale t to [−1, 1] or use orthogonal polynomials.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Norm approximation minimise ‖Ax − b‖; least squares is the ℓ<sub>2</sub> case with closed form A<sup>T</sup>Ax = A<sup>T</sup>b.</li><li>A<sup>T</sup>r = 0: the fit is an orthogonal projection.</li><li>cond(A<sup>T</sup>A) = cond(A)<sup>2</sup>; compute with QR/SVD.</li><li>ℓ<sub>1</sub> and Huber penalties are robust to outliers and still convex.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://web.stanford.edu/class/ee364a/lectures/approx.pdf" target="_blank" rel="noopener">Stanford EE364a — Lecture 6: Approximation and fitting (slides)</a></li><li><a href="https://en.wikipedia.org/wiki/Least_squares" target="_blank" rel="noopener">Wikipedia — Least squares</a></li><li><a href="https://en.wikipedia.org/wiki/Huber_loss" target="_blank" rel="noopener">Wikipedia — Huber loss</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Fit y = a + bt to (0, 0), (1, 1), (2, 1), (3, 3) by the normal equations.</li><li>cond(A) = 10<sup>5</sup>. Roughly how many correct digits does solving the normal equations in double precision give?</li><li>Write the Huber fit of Ax ≈ b with M = 1 in CVXPY.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) A<sup>T</sup>A = [[4, 6], [6, 14]], A<sup>T</sup>y = (5, 12); det = 20; a = (14·5 − 6·12)/20 = −0.1, b = (4·12 − 6·5)/20 = 0.9. 2) cond(A<sup>T</sup>A) = 10<sup>10</sup>, so about 16 − 10 = 6 digits. 3) <code>cp.Minimize(cp.sum(cp.huber(A @ x - b, 1)))</code>.</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 6 · Bài 6.1</span>
<h2>Bình phương tối thiểu và xấp xỉ chuẩn</h2>
<p class="lead">Khớp mô hình với dữ liệu là bài tối ưu phổ biến nhất thế giới. Bình phương tối thiểu là dạng lâu đời và nhanh nhất của nó; chọn chuẩn hay hàm phạt khác là đổi nghĩa của “khớp tốt nhất”.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết bài khớp dữ liệu thành bài xấp xỉ chuẩn cực tiểu ‖Ax − b‖.</li><li>Giải bình phương tối thiểu bằng hệ phương trình chuẩn và bằng bộ giải dựa trên QR/SVD, giải thích vì sao nên dùng cái sau.</li><li>Dùng số điều kiện để dự đoán trục trặc số học.</li><li>Chọn giữa phạt ℓ<sub>2</sub>, ℓ<sub>1</sub> và Huber khi dữ liệu có ngoại lai.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Xấp xỉ chuẩn (Boyd §6.1)</span>minimize ‖Ax − b‖      A ∈ ℝ<sup>m×n</sup>, m ≥ n<br>bình phương tối thiểu (ℓ<sub>2</sub>):  A<sup>T</sup>Ax = A<sup>T</sup>b ⇒ x* = (A<sup>T</sup>A)<sup>−1</sup>A<sup>T</sup>b  nếu A có hạng cột đầy đủ</div>
<p>Mỗi dòng a<sub>i</sub><sup>T</sup>x − b<sub>i</sub> là một <strong>phần dư</strong>: sai số dự đoán trên điểm dữ liệu i. Khớp đa thức, hồi quy tuyến tính nhiều đặc trưng, giải chập tín hiệu và hiệu chuẩn đều có dạng này: các cột của A là đặc trưng (hay hàm cơ sở) tính tại các điểm dữ liệu. Phần dư bình phương tối thiểu r = Ax* − b trực giao với mọi cột của A (A<sup>T</sup>r = 0): Ax* là hình chiếu trực giao của b lên không gian cột (MAA102 Bài 9.2, MLT201 Bài 9.1).</p>
<p><strong>Tính toán số.</strong> Lập A<sup>T</sup>A làm bình phương số điều kiện: cond(A<sup>T</sup>A) = cond(A)<sup>2</sup>. Với cond(A) = 10<sup>6</sup> bạn mất khoảng 12 trên 16 chữ số của số thực double. Bộ giải thư viện (<code>np.linalg.lstsq</code> dùng SVD, hoặc phân tích QR) làm việc trực tiếp với A và chỉ mất cỡ cond(A) chữ số. Quy tắc: suy luận bằng phương trình chuẩn, tính toán bằng <code>lstsq</code>.</p>
<p><strong>Hàm phạt khác.</strong> Bài phạt tổng quát là cực tiểu ∑φ(r<sub>i</sub>). Bình phương (φ = u<sup>2</sup>) phạt nặng phần dư lớn, nên vài ngoại lai kéo lệch cả đường khớp. Phạt ℓ<sub>1</sub> (φ = |u|) chịu đựng tốt hơn nhiều và cho nhiều phần dư đúng bằng 0. Phạt <strong>Huber</strong> là bình phương khi |u| ≤ M và tuyến tính khi vượt — bình phương tối thiểu cho điểm thường, ℓ<sub>1</sub> cho ngoại lai (Boyd §6.1.2). Tất cả đều lồi, nên CVXPY xử lý bằng <code>cp.norm1</code> hay <code>cp.huber</code>.</p>
<h3>✍️ Ví dụ giải từng bước — khớp bậc hai</h3>
<div class="callout"><p><b>Bài toán.</b> 20 mẫu nhiễu của y = 1 + 2t − 3t<sup>2</sup> trên [0, 1]. Khớp w<sub>0</sub> + w<sub>1</sub>t + w<sub>2</sub>t<sup>2</sup>.</p>
<p>Bước 1: dựng A với các cột 1, t, t<sup>2</sup> (ma trận 20 × 3). Bước 2: giải A<sup>T</sup>Aw = A<sup>T</sup>y (hệ 3 × 3) hoặc gọi <code>lstsq</code>. Bước 3: kiểm A<sup>T</sup>r = 0. Bước 4: xem số điều kiện — ổn với bậc 2, thảm hoạ với bậc 9 trên [0, 1], vì các cột t<sup>k</sup> gần như song song.</p></div>
<pre><code class="language-python">import numpy as np

# fit y = w0 + w1 t + w2 t^2 to noisy data
rng = np.random.default_rng(6)
t = np.linspace(0, 1, 20)
y = 1 + 2 * t - 3 * t**2 + 0.05 * rng.normal(size=t.size)
A = np.column_stack([np.ones_like(t), t, t**2])

w_normal = np.linalg.solve(A.T @ A, A.T @ y)          # normal equations
w_lstsq = np.linalg.lstsq(A, y, rcond=None)[0]        # QR/SVD based
print("normal equations :", w_normal.round(4))
print("np.linalg.lstsq  :", w_lstsq.round(4))
r = A @ w_lstsq - y
print("residual norm    :", round(np.linalg.norm(r), 4), "| A^T r =", (A.T @ r).round(10))
print("cond(A) =", round(np.linalg.cond(A), 1), " cond(A^T A) =", round(np.linalg.cond(A.T @ A), 1))

# high-degree polynomial: conditioning explodes
A9 = np.vander(t, 10, increasing=True)
print("degree 9: cond(A) = %.2e, cond(A^T A) = %.2e" % (np.linalg.cond(A9), np.linalg.cond(A9.T @ A9)))</code></pre>
<div class="out">normal equations : [ 1.037   1.8709 -2.8517]
np.linalg.lstsq  : [ 1.037   1.8709 -2.8517]
residual norm    : 0.2333 | A^T r = [0. 0. 0.]
cond(A) = 20.9  cond(A^T A) = 436.2
degree 9: cond(A) = 3.79e+06, cond(A^T A) = 1.44e+13</div>
<p>Ước lượng (1,04; 1,87; −2,85) gần giá trị thật (1, 2, −3), phần dư trực giao với các cột, và cond(A<sup>T</sup>A) ≈ 20,9<sup>2</sup>. Với bậc 9, ma trận phương trình chuẩn có số điều kiện 1,4·10<sup>13</sup> — chỉ còn khoảng ba chữ số đáng tin.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tính <code>inv(A.T @ A) @ A.T @ b</code> trong mã thật — chậm và dễ sai số.</li><li>Dùng bình phương tối thiểu cho dữ liệu có ngoại lai lớn rồi tin kết quả; hãy thử Huber hoặc ℓ<sub>1</sub> và so sánh.</li><li>Khớp đa thức bậc cao với cơ sở đơn thức; hãy co t về [−1, 1] hoặc dùng đa thức trực giao.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Xấp xỉ chuẩn cực tiểu ‖Ax − b‖; bình phương tối thiểu là trường hợp ℓ<sub>2</sub> với nghiệm đóng A<sup>T</sup>Ax = A<sup>T</sup>b.</li><li>A<sup>T</sup>r = 0: đường khớp là phép chiếu trực giao.</li><li>cond(A<sup>T</sup>A) = cond(A)<sup>2</sup>; hãy tính bằng QR/SVD.</li><li>Phạt ℓ<sub>1</sub> và Huber bền với ngoại lai mà vẫn lồi.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://web.stanford.edu/class/ee364a/lectures/approx.pdf" target="_blank" rel="noopener">Stanford EE364a — Bài 6: Xấp xỉ và khớp dữ liệu (slide)</a></li><li><a href="https://en.wikipedia.org/wiki/Least_squares" target="_blank" rel="noopener">Wikipedia — Least squares</a></li><li><a href="https://en.wikipedia.org/wiki/Huber_loss" target="_blank" rel="noopener">Wikipedia — Huber loss</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Khớp y = a + bt với (0, 0), (1, 1), (2, 1), (3, 3) bằng phương trình chuẩn.</li><li>cond(A) = 10<sup>5</sup>. Giải phương trình chuẩn bằng double cho khoảng bao nhiêu chữ số đúng?</li><li>Viết bài khớp Huber Ax ≈ b với M = 1 trong CVXPY.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) A<sup>T</sup>A = [[4, 6], [6, 14]], A<sup>T</sup>y = (5, 12); det = 20; a = (14·5 − 6·12)/20 = −0,1, b = (4·12 − 6·5)/20 = 0,9. 2) cond(A<sup>T</sup>A) = 10<sup>10</sup>, nên khoảng 16 − 10 = 6 chữ số. 3) <code>cp.Minimize(cp.sum(cp.huber(A @ x - b, 1)))</code>.</p></div>`);

const c62 = L('cvo201-ts-6-2',
  '6.2 — Regularisation: ridge (Tikhonov), Lasso and the bias–variance trade-off|||6.2 — Chính quy hoá: ridge (Tikhonov), Lasso và đánh đổi độ chệch–phương sai',
  'Bài toán hai mục tiêu ‖Ax − b‖² và ‖x‖, đường đánh đổi; ridge có nghiệm đóng (AᵀA + λI)⁻¹Aᵀb; Lasso với phạt ℓ1 cho nghiệm thưa — vì sao (góc của hình thoi); cp.Parameter (Boyd §6.3).',
  `<span class="eyebrow">CVO201 · Chapter 6 · Lesson 6.2</span>
<h2>Regularisation: ridge, Lasso and the trade-off curve</h2>
<p class="lead">With many features and little data, plain least squares overfits: it chases noise with large, unstable coefficients. Regularisation adds a second objective — keep x small — and the two objectives trade off along a curve.</p>
<h3>🎯 Objectives</h3>
<ul><li>Formulate regularised least squares as a scalarised bi-criterion problem.</li><li>Derive the closed form of ridge regression and explain why it is always well posed.</li><li>Explain why the ℓ<sub>1</sub> penalty (Lasso) produces sparse solutions.</li><li>Use <code>cp.Parameter</code> to sweep the regularisation weight.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Regularised approximation (Boyd §6.3)</span>ridge (Tikhonov):  minimize ‖Ax − b‖<sub>2</sub><sup>2</sup> + λ‖x‖<sub>2</sub><sup>2</sup>   ⇒  x* = (A<sup>T</sup>A + λI)<sup>−1</sup>A<sup>T</sup>b<br>Lasso (ℓ<sub>1</sub>):  minimize ‖Ax − b‖<sub>2</sub><sup>2</sup> + λ‖x‖<sub>1</sub>      (λ ≥ 0)</div>
<p>We really have two goals: small residual and small x. There is usually no x that is best for both, so we look at the <strong>Pareto (trade-off) curve</strong> of achievable pairs (‖Ax − b‖, ‖x‖) and pick a point on it by minimising a weighted sum. Increasing λ moves the solution toward smaller x and larger residual. In ML the choice of λ is the bias–variance trade-off, made by cross-validation.</p>
<p><strong>Ridge.</strong> Setting the gradient 2A<sup>T</sup>(Ax − b) + 2λx to zero gives (A<sup>T</sup>A + λI)x = A<sup>T</sup>b. The matrix A<sup>T</sup>A + λI has eigenvalues σ<sub>i</sub><sup>2</sup> + λ ≥ λ &gt; 0, so it is invertible even when A has more columns than rows, and its condition number is at most (σ<sub>max</sub><sup>2</sup> + λ)/λ. Ridge shrinks all coefficients smoothly but rarely makes any exactly zero. Statistically it is the MAP estimate under a Gaussian prior on x.</p>
<p><strong>Lasso.</strong> The ℓ<sub>1</sub> norm is convex but has kinks at the axes. Picture the level curves of the residual (ellipses) growing until they touch the ℓ<sub>1</sub> diamond: the first contact is usually at a corner, where some coordinates are exactly zero. Algebraically, the optimality condition (with subgradients, Lesson 9.3) says x<sub>j</sub> = 0 whenever |2a<sub>j</sub><sup>T</sup>r| ≤ λ. So the Lasso performs <strong>feature selection</strong> — a convex heuristic for the hard problem “use at most k features” (Boyd §6.3.2). There is no closed form; we solve it with CVXPY or proximal gradient (Lesson 9.3).</p>
<h3>✍️ Worked example — which features matter?</h3>
<div class="callout"><p><b>Problem.</b> 40 samples, 10 features, but the true weight vector has only 3 nonzeros: w = (3, −2, 0, 0, 1.5, 0, 0, 0, 0, 0), plus noise.</p>
<p>Step 1: declare <code>lam = cp.Parameter(nonneg=True)</code> so the problem is built once and re-solved quickly for each value. Step 2: solve ridge and Lasso for λ = 1 and λ = 20. Step 3: count coefficients with |w<sub>j</sub>| &gt; 10<sup>−4</sup>. Step 4: compare ridge with its closed form.</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp

rng = np.random.default_rng(7)
n, d = 40, 10
X = rng.normal(size=(n, d))
w_true = np.array([3, -2, 0, 0, 1.5, 0, 0, 0, 0, 0.0])     # only 3 nonzeros
y = X @ w_true + 0.5 * rng.normal(size=n)

w = cp.Variable(d); lam = cp.Parameter(nonneg=True)
ridge = cp.Problem(cp.Minimize(cp.sum_squares(X @ w - y) + lam * cp.sum_squares(w)))
lasso = cp.Problem(cp.Minimize(cp.sum_squares(X @ w - y) + lam * cp.norm1(w)))

for name, prob in [("ridge", ridge), ("lasso", lasso)]:
    for val in [1.0, 20.0]:
        lam.value = val; prob.solve()
        nz = int(np.sum(np.abs(w.value) &gt; 1e-4))
        print(f"{name} lam={val:4.0f}: w = {np.round(w.value, 2)}  nonzeros = {nz}")

# ridge has a closed form: (X^T X + lam I)^{-1} X^T y
lam.value = 20.0; ridge.solve()
w_closed = np.linalg.solve(X.T @ X + 20.0 * np.eye(d), X.T @ y)
print("ridge closed form matches cvxpy:", np.allclose(w_closed, w.value, atol=1e-4))</code></pre>
<div class="out">ridge lam=   1: w = [ 2.88 -2.06  0.06 -0.02  1.47 -0.1  -0.04  0.07 -0.07  0.1 ]  nonzeros = 10
ridge lam=  20: w = [ 1.8  -1.35 -0.28  0.01  0.86  0.15  0.19  0.16  0.01  0.04]  nonzeros = 10
lasso lam=   1: w = [ 2.96 -2.1   0.07 -0.01  1.51 -0.11 -0.05  0.05 -0.07  0.1 ]  nonzeros = 10
lasso lam=  20: w = [ 2.64 -1.87 -0.   -0.    1.17  0.   -0.    0.   -0.   -0.  ]  nonzeros = 3
ridge closed form matches cvxpy: True</div>
<p>At λ = 20 the Lasso keeps exactly the three true features (1, 2 and 5) and sets the other seven to zero (the “−0.” entries are zeros up to solver precision); ridge shrinks everything but keeps all ten nonzero. Both shrink the true coefficients toward zero — the price of regularisation (bias).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Regularising without standardising features: the penalty then depends on the units of each column.</li><li>Penalising the intercept; usually only the slopes are regularised.</li><li>Reading Lasso coefficients as unbiased effects — they are shrunk; refit least squares on the selected features if you need unbiased values.</li><li>Comparing λ between libraries without checking scaling: scikit-learn's Lasso uses (1/(2m))‖Ax − b‖<sup>2</sup> + α‖x‖<sub>1</sub>.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Regularisation = bi-criterion problem; λ picks a point on the trade-off curve.</li><li>Ridge: closed form (A<sup>T</sup>A + λI)<sup>−1</sup>A<sup>T</sup>b, always invertible, smooth shrinkage.</li><li>Lasso: ℓ<sub>1</sub> corners give exact zeros — convex feature selection.</li><li><code>cp.Parameter</code> makes sweeping λ cheap.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.cvxpy.org/examples/machine_learning/lasso_regression.html" target="_blank" rel="noopener">CVXPY example — Machine Learning: Lasso Regression</a></li><li><a href="https://www.cvxpy.org/examples/machine_learning/ridge_regression.html" target="_blank" rel="noopener">CVXPY example — Machine Learning: Ridge Regression</a></li><li><a href="https://en.wikipedia.org/wiki/Lasso_(statistics)" target="_blank" rel="noopener">Wikipedia — Lasso (statistics)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>One feature: minimise (x − 3)<sup>2</sup> + λx<sup>2</sup>. Find x*(λ).</li><li>One feature: minimise (x − 3)<sup>2</sup> + λ|x|. Find x*(λ) and the λ at which x* becomes 0.</li><li>Why is A<sup>T</sup>A + λI invertible for every λ &gt; 0?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 2(x − 3) + 2λx = 0 ⇒ x* = 3/(1 + λ): never exactly 0. 2) For x &gt; 0: 2(x − 3) + λ = 0 ⇒ x* = 3 − λ/2, valid while λ &lt; 6; for λ ≥ 6, x* = 0 (soft thresholding). 3) Its eigenvalues are σ<sub>i</sub><sup>2</sup> + λ ≥ λ &gt; 0.</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 6 · Bài 6.2</span>
<h2>Chính quy hoá: ridge, Lasso và đường đánh đổi</h2>
<p class="lead">Nhiều đặc trưng mà ít dữ liệu, bình phương tối thiểu thuần sẽ quá khớp: nó đuổi theo nhiễu bằng các hệ số lớn và bất ổn. Chính quy hoá thêm mục tiêu thứ hai — giữ x nhỏ — và hai mục tiêu đánh đổi nhau dọc một đường cong.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu bình phương tối thiểu có chính quy hoá như bài hai tiêu chí được vô hướng hoá.</li><li>Suy ra nghiệm đóng của hồi quy ridge và giải thích vì sao nó luôn đặt chỉnh.</li><li>Giải thích vì sao phạt ℓ<sub>1</sub> (Lasso) cho nghiệm thưa.</li><li>Dùng <code>cp.Parameter</code> để quét trọng số chính quy hoá.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Xấp xỉ có chính quy hoá (Boyd §6.3)</span>ridge (Tikhonov):  minimize ‖Ax − b‖<sub>2</sub><sup>2</sup> + λ‖x‖<sub>2</sub><sup>2</sup>   ⇒  x* = (A<sup>T</sup>A + λI)<sup>−1</sup>A<sup>T</sup>b<br>Lasso (ℓ<sub>1</sub>):  minimize ‖Ax − b‖<sub>2</sub><sup>2</sup> + λ‖x‖<sub>1</sub>      (λ ≥ 0)</div>
<p>Thật ra ta có hai mục tiêu: phần dư nhỏ và x nhỏ. Thường không có x tốt nhất cho cả hai, nên ta nhìn <strong>đường Pareto (đánh đổi)</strong> của các cặp (‖Ax − b‖, ‖x‖) đạt được và chọn một điểm trên đó bằng cách cực tiểu tổng có trọng số. Tăng λ đẩy nghiệm về phía x nhỏ hơn và phần dư lớn hơn. Trong học máy, chọn λ chính là đánh đổi độ chệch–phương sai, làm bằng kiểm định chéo.</p>
<p><strong>Ridge.</strong> Cho gradient 2A<sup>T</sup>(Ax − b) + 2λx bằng 0 được (A<sup>T</sup>A + λI)x = A<sup>T</sup>b. Ma trận A<sup>T</sup>A + λI có trị riêng σ<sub>i</sub><sup>2</sup> + λ ≥ λ &gt; 0, nên khả nghịch kể cả khi A có nhiều cột hơn dòng, và số điều kiện không quá (σ<sub>max</sub><sup>2</sup> + λ)/λ. Ridge co mọi hệ số một cách trơn nhưng hiếm khi đưa hệ số nào về đúng 0. Về thống kê nó là ước lượng MAP với tiên nghiệm Gauss trên x.</p>
<p><strong>Lasso.</strong> Chuẩn ℓ<sub>1</sub> lồi nhưng có chỗ gãy trên các trục. Hãy hình dung các đường mức của phần dư (ellipse) phình ra tới khi chạm hình thoi ℓ<sub>1</sub>: điểm chạm đầu tiên thường ở một góc, nơi một số toạ độ bằng đúng 0. Về đại số, điều kiện tối ưu (với dưới gradient, Bài 9.3) nói x<sub>j</sub> = 0 mỗi khi |2a<sub>j</sub><sup>T</sup>r| ≤ λ. Vậy Lasso thực hiện <strong>chọn đặc trưng</strong> — một heuristic lồi cho bài khó “dùng tối đa k đặc trưng” (Boyd §6.3.2). Không có nghiệm đóng; ta giải bằng CVXPY hoặc proximal gradient (Bài 9.3).</p>
<h3>✍️ Ví dụ giải từng bước — đặc trưng nào quan trọng?</h3>
<div class="callout"><p><b>Bài toán.</b> 40 mẫu, 10 đặc trưng, nhưng vectơ trọng số thật chỉ có 3 phần tử khác 0: w = (3, −2, 0, 0, 1,5, 0, 0, 0, 0, 0), cộng nhiễu.</p>
<p>Bước 1: khai báo <code>lam = cp.Parameter(nonneg=True)</code> để dựng bài một lần và giải lại nhanh cho mỗi giá trị. Bước 2: giải ridge và Lasso với λ = 1 và λ = 20. Bước 3: đếm hệ số có |w<sub>j</sub>| &gt; 10<sup>−4</sup>. Bước 4: so ridge với nghiệm đóng.</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp

rng = np.random.default_rng(7)
n, d = 40, 10
X = rng.normal(size=(n, d))
w_true = np.array([3, -2, 0, 0, 1.5, 0, 0, 0, 0, 0.0])     # only 3 nonzeros
y = X @ w_true + 0.5 * rng.normal(size=n)

w = cp.Variable(d); lam = cp.Parameter(nonneg=True)
ridge = cp.Problem(cp.Minimize(cp.sum_squares(X @ w - y) + lam * cp.sum_squares(w)))
lasso = cp.Problem(cp.Minimize(cp.sum_squares(X @ w - y) + lam * cp.norm1(w)))

for name, prob in [("ridge", ridge), ("lasso", lasso)]:
    for val in [1.0, 20.0]:
        lam.value = val; prob.solve()
        nz = int(np.sum(np.abs(w.value) &gt; 1e-4))
        print(f"{name} lam={val:4.0f}: w = {np.round(w.value, 2)}  nonzeros = {nz}")

# ridge has a closed form: (X^T X + lam I)^{-1} X^T y
lam.value = 20.0; ridge.solve()
w_closed = np.linalg.solve(X.T @ X + 20.0 * np.eye(d), X.T @ y)
print("ridge closed form matches cvxpy:", np.allclose(w_closed, w.value, atol=1e-4))</code></pre>
<div class="out">ridge lam=   1: w = [ 2.88 -2.06  0.06 -0.02  1.47 -0.1  -0.04  0.07 -0.07  0.1 ]  nonzeros = 10
ridge lam=  20: w = [ 1.8  -1.35 -0.28  0.01  0.86  0.15  0.19  0.16  0.01  0.04]  nonzeros = 10
lasso lam=   1: w = [ 2.96 -2.1   0.07 -0.01  1.51 -0.11 -0.05  0.05 -0.07  0.1 ]  nonzeros = 10
lasso lam=  20: w = [ 2.64 -1.87 -0.   -0.    1.17  0.   -0.    0.   -0.   -0.  ]  nonzeros = 3
ridge closed form matches cvxpy: True</div>
<p>Ở λ = 20, Lasso giữ đúng ba đặc trưng thật (1, 2 và 5) và đưa bảy cái còn lại về 0 (các ô “−0.” là số 0 trong sai số bộ giải); ridge co mọi thứ nhưng cả mười hệ số vẫn khác 0. Cả hai đều co hệ số thật về phía 0 — cái giá của chính quy hoá (độ chệch).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chính quy hoá mà không chuẩn hoá đặc trưng: hàm phạt khi đó phụ thuộc đơn vị của từng cột.</li><li>Phạt cả hệ số chặn; thường chỉ phạt các hệ số góc.</li><li>Đọc hệ số Lasso như hiệu ứng không chệch — chúng đã bị co; hãy khớp lại bình phương tối thiểu trên các đặc trưng được chọn nếu cần giá trị không chệch.</li><li>So λ giữa các thư viện mà không kiểm thang đo: Lasso của scikit-learn dùng (1/(2m))‖Ax − b‖<sup>2</sup> + α‖x‖<sub>1</sub>.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Chính quy hoá = bài hai tiêu chí; λ chọn một điểm trên đường đánh đổi.</li><li>Ridge: nghiệm đóng (A<sup>T</sup>A + λI)<sup>−1</sup>A<sup>T</sup>b, luôn khả nghịch, co trơn.</li><li>Lasso: góc của ℓ<sub>1</sub> cho số 0 chính xác — chọn đặc trưng bằng tối ưu lồi.</li><li><code>cp.Parameter</code> giúp quét λ rẻ.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.cvxpy.org/examples/machine_learning/lasso_regression.html" target="_blank" rel="noopener">Ví dụ CVXPY — Machine Learning: Lasso Regression</a></li><li><a href="https://www.cvxpy.org/examples/machine_learning/ridge_regression.html" target="_blank" rel="noopener">Ví dụ CVXPY — Machine Learning: Ridge Regression</a></li><li><a href="https://en.wikipedia.org/wiki/Lasso_(statistics)" target="_blank" rel="noopener">Wikipedia — Lasso (statistics)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Một đặc trưng: cực tiểu (x − 3)<sup>2</sup> + λx<sup>2</sup>. Tìm x*(λ).</li><li>Một đặc trưng: cực tiểu (x − 3)<sup>2</sup> + λ|x|. Tìm x*(λ) và λ tại đó x* thành 0.</li><li>Vì sao A<sup>T</sup>A + λI khả nghịch với mọi λ &gt; 0?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 2(x − 3) + 2λx = 0 ⇒ x* = 3/(1 + λ): không bao giờ đúng bằng 0. 2) Với x &gt; 0: 2(x − 3) + λ = 0 ⇒ x* = 3 − λ/2, đúng khi λ &lt; 6; với λ ≥ 6, x* = 0 (ngưỡng mềm). 3) Trị riêng của nó là σ<sub>i</sub><sup>2</sup> + λ ≥ λ &gt; 0.</p></div>`);

const c63 = L('cvo201-ts-6-3',
  '6.3 — Support vector machines: the maximum-margin classifier as a QP|||6.3 — Máy vectơ hỗ trợ: bộ phân lớp lề cực đại là một QP',
  'SVM lề cứng và lề mềm, biến chùng ξ, hinge loss, tham số C, vectơ hỗ trợ và tính bù trừ, so sánh CVXPY với sklearn SVC (Boyd §8.6.1).',
  `<span class="eyebrow">CVO201 · Chapter 6 · Lesson 6.3</span>
<h2>Support vector machines as a QP</h2>
<p class="lead">In Lesson 2.3 we separated two point clouds with the widest possible slab. Real data overlap, so we allow violations and pay for them: that is the soft-margin support vector machine, a textbook QP.</p>
<h3>🎯 Objectives</h3>
<ul><li>Formulate the hard- and soft-margin SVM as convex problems.</li><li>Rewrite the soft-margin SVM with the hinge loss.</li><li>Identify support vectors from the margins and relate them to complementary slackness.</li><li>Solve an SVM with CVXPY and match scikit-learn.</li></ul>
<h3>📖 Lecture</h3>
<p>Data: points x<sub>i</sub> ∈ ℝ<sup>n</sup> with labels y<sub>i</sub> ∈ {−1, +1}. A linear classifier predicts sign(w<sup>T</sup>x + b). The functional margin of point i is y<sub>i</sub>(w<sup>T</sup>x<sub>i</sub> + b); it is positive when the point is correctly classified.</p>
<div class="formula"><span class="lbl">Soft-margin SVM (Boyd §8.6.1; C &gt; 0)</span>minimize ½‖w‖<sub>2</sub><sup>2</sup> + C ∑<sub>i</sub> ξ<sub>i</sub><br>subject to y<sub>i</sub>(w<sup>T</sup>x<sub>i</sub> + b) ≥ 1 − ξ<sub>i</sub>,  ξ<sub>i</sub> ≥ 0</div>
<p>Without the slack variables ξ this is the <strong>hard-margin SVM</strong>: the margin between the planes w<sup>T</sup>x + b = ±1 is 2/‖w‖<sub>2</sub>, so minimising ‖w‖<sub>2</sub><sup>2</sup> maximises it — but it is infeasible when the classes overlap. The slack ξ<sub>i</sub> measures how far point i violates its margin. The problem is a QP: convex quadratic objective, linear constraints in (w, b, ξ).</p>
<p><strong>Hinge-loss form.</strong> At the optimum ξ<sub>i</sub> = max(0, 1 − y<sub>i</sub>(w<sup>T</sup>x<sub>i</sub> + b)), so the SVM is equivalently minimise ∑ max(0, 1 − y<sub>i</sub>(w<sup>T</sup>x<sub>i</sub> + b)) + (1/(2C))‖w‖<sup>2</sup> — hinge loss plus ridge penalty, a regularised empirical risk (Lesson 9.1). C is the trade-off: large C punishes violations (narrow margin, may overfit), small C prefers a wide margin.</p>
<p><strong>Support vectors.</strong> By complementary slackness, the multiplier α<sub>i</sub> of the margin constraint is zero for points strictly outside the margin. Only points on or inside the margin (y<sub>i</sub>(w<sup>T</sup>x<sub>i</sub> + b) ≤ 1) have α<sub>i</sub> &gt; 0, and the stationarity condition gives w = ∑α<sub>i</sub>y<sub>i</sub>x<sub>i</sub>: the classifier depends only on these <strong>support vectors</strong>. The dual depends on the data only through inner products x<sub>i</sub><sup>T</sup>x<sub>j</sub>, which is what makes the kernel trick possible.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Problem.</b> 30 points around (2, 2) labelled +1 and 30 around (−1, −1) labelled −1, with overlap. C = 1.</p>
<p>Step 1: variables w ∈ ℝ<sup>2</sup>, b, ξ ∈ ℝ<sup>60</sup>, ξ ⪰ 0. Step 2: constraints <code>cp.multiply(y, X @ w + b) &gt;= 1 - xi</code> — elementwise product with the labels. Step 3: objective ½‖w‖<sup>2</sup> + C·1<sup>T</sup>ξ. Step 4: compare with <code>sklearn.svm.SVC(kernel="linear", C=1)</code>, which solves exactly this problem through its dual. Step 5: count points with margin ≤ 1.</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp
from sklearn.svm import SVC

rng = np.random.default_rng(8)
Xp = rng.normal([2, 2], 1.0, size=(30, 2)); Xn = rng.normal([-1, -1], 1.0, size=(30, 2))
X = np.vstack([Xp, Xn]); y = np.r_[np.ones(30), -np.ones(30)]

C = 1.0
w = cp.Variable(2); b = cp.Variable(); xi = cp.Variable(60, nonneg=True)
prob = cp.Problem(cp.Minimize(0.5 * cp.sum_squares(w) + C * cp.sum(xi)),
                  [cp.multiply(y, X @ w + b) &gt;= 1 - xi])
prob.solve()
print("cvxpy  : w =", w.value.round(3), " b =", round(float(b.value), 3), " objective =", round(prob.value, 4))

clf = SVC(kernel="linear", C=C).fit(X, y)
print("sklearn: w =", clf.coef_[0].round(3), " b =", round(clf.intercept_[0], 3))
margins = y * (X @ w.value + b.value)
print("points with margin &lt;= 1 (support vectors):", int(np.sum(margins &lt;= 1 + 1e-4)),
      "| sklearn n_support:", int(clf.n_support_.sum()))
print("training accuracy:", np.mean(np.sign(X @ w.value + b.value) == y))</code></pre>
<div class="out">cvxpy  : w = [0.869 1.566]  b = -0.798  objective = 6.3971
sklearn: w = [0.869 1.566]  b = -0.798
points with margin &lt;= 1 (support vectors): 9 | sklearn n_support: 9
training accuracy: 0.95</div>
<p>CVXPY and scikit-learn agree to three decimals. Exactly 9 of the 60 points are support vectors — the remaining 51 could be deleted without changing the classifier. The training accuracy is 95%: 3 points sit on the wrong side, each paid for by its slack.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using labels {0, 1} instead of {−1, +1} in the margin constraint.</li><li>Forgetting to scale features: the margin is measured in Euclidean distance, so one feature in large units dominates.</li><li>Confusing C with λ: C multiplies the loss, so larger C means <em>less</em> regularisation.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Soft-margin SVM: minimise ½‖w‖<sup>2</sup> + C∑ξ<sub>i</sub> s.t. y<sub>i</sub>(w<sup>T</sup>x<sub>i</sub> + b) ≥ 1 − ξ<sub>i</sub>, ξ ⪰ 0 — a QP.</li><li>Equivalent to hinge loss + ridge penalty.</li><li>Only support vectors (margin ≤ 1) have nonzero multipliers; w = ∑α<sub>i</sub>y<sub>i</sub>x<sub>i</sub>.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/svm.html" target="_blank" rel="noopener">scikit-learn — Support Vector Machines (user guide, includes the mathematical formulation)</a></li><li><a href="https://web.stanford.edu/class/ee364a/lectures/geom.pdf" target="_blank" rel="noopener">Stanford EE364a — Geometric problems: linear discrimination and SVM (slides)</a></li><li><a href="https://en.wikipedia.org/wiki/Support_vector_machine" target="_blank" rel="noopener">Wikipedia — Support vector machine</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Two points: x<sub>1</sub> = (1, 0) with y = +1, x<sub>2</sub> = (−1, 0) with y = −1. Find the hard-margin SVM by hand.</li><li>A point has y(w<sup>T</sup>x + b) = 0.4. What is its slack, and is it a support vector?</li><li>What happens to the number of support vectors as C → ∞ on separable data?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) By symmetry b = 0, w = (w<sub>1</sub>, 0); constraints w<sub>1</sub> ≥ 1 ⇒ w = (1, 0), margin 2/‖w‖ = 2 (the full distance between the points). 2) ξ = 1 − 0.4 = 0.6 &gt; 0; yes, it lies inside the margin. 3) The problem tends to the hard-margin SVM; typically only the few points touching the widest slab remain support vectors.</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 6 · Bài 6.3</span>
<h2>Máy vectơ hỗ trợ là một QP</h2>
<p class="lead">Ở Bài 2.3 ta tách hai đám điểm bằng dải rộng nhất có thể. Dữ liệu thật chồng lấn, nên ta cho phép vi phạm và trả giá cho nó: đó là máy vectơ hỗ trợ lề mềm, một QP kinh điển.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu SVM lề cứng và lề mềm thành bài lồi.</li><li>Viết lại SVM lề mềm bằng hinge loss.</li><li>Nhận ra vectơ hỗ trợ từ lề và liên hệ với tính bù trừ.</li><li>Giải SVM bằng CVXPY và khớp với scikit-learn.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Dữ liệu: các điểm x<sub>i</sub> ∈ ℝ<sup>n</sup> với nhãn y<sub>i</sub> ∈ {−1, +1}. Bộ phân lớp tuyến tính dự đoán sign(w<sup>T</sup>x + b). Lề hàm của điểm i là y<sub>i</sub>(w<sup>T</sup>x<sub>i</sub> + b); nó dương khi điểm được phân lớp đúng.</p>
<div class="formula"><span class="lbl">SVM lề mềm (Boyd §8.6.1; C &gt; 0)</span>minimize ½‖w‖<sub>2</sub><sup>2</sup> + C ∑<sub>i</sub> ξ<sub>i</sub><br>subject to y<sub>i</sub>(w<sup>T</sup>x<sub>i</sub> + b) ≥ 1 − ξ<sub>i</sub>,  ξ<sub>i</sub> ≥ 0</div>
<p>Bỏ biến chùng ξ ta có <strong>SVM lề cứng</strong>: lề giữa hai mặt w<sup>T</sup>x + b = ±1 là 2/‖w‖<sub>2</sub>, nên cực tiểu ‖w‖<sub>2</sub><sup>2</sup> là cực đại lề — nhưng bài vô nghiệm khi hai lớp chồng lấn. Biến chùng ξ<sub>i</sub> đo điểm i vi phạm lề bao xa. Bài là QP: mục tiêu toàn phương lồi, ràng buộc tuyến tính theo (w, b, ξ).</p>
<p><strong>Dạng hinge loss.</strong> Tại tối ưu ξ<sub>i</sub> = max(0, 1 − y<sub>i</sub>(w<sup>T</sup>x<sub>i</sub> + b)), nên SVM tương đương cực tiểu ∑ max(0, 1 − y<sub>i</sub>(w<sup>T</sup>x<sub>i</sub> + b)) + (1/(2C))‖w‖<sup>2</sup> — hinge loss cộng phạt ridge, một rủi ro thực nghiệm có chính quy hoá (Bài 9.1). C là tham số đánh đổi: C lớn phạt nặng vi phạm (lề hẹp, dễ quá khớp), C nhỏ ưu tiên lề rộng.</p>
<p><strong>Vectơ hỗ trợ.</strong> Theo tính bù trừ, nhân tử α<sub>i</sub> của ràng buộc lề bằng 0 với các điểm nằm hẳn ngoài lề. Chỉ những điểm nằm trên hoặc trong lề (y<sub>i</sub>(w<sup>T</sup>x<sub>i</sub> + b) ≤ 1) mới có α<sub>i</sub> &gt; 0, và điều kiện dừng cho w = ∑α<sub>i</sub>y<sub>i</sub>x<sub>i</sub>: bộ phân lớp chỉ phụ thuộc các <strong>vectơ hỗ trợ</strong> này. Bài đối ngẫu chỉ phụ thuộc dữ liệu qua tích vô hướng x<sub>i</sub><sup>T</sup>x<sub>j</sub>, điều làm nên mẹo kernel.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Bài toán.</b> 30 điểm quanh (2, 2) nhãn +1 và 30 điểm quanh (−1, −1) nhãn −1, có chồng lấn. C = 1.</p>
<p>Bước 1: biến w ∈ ℝ<sup>2</sup>, b, ξ ∈ ℝ<sup>60</sup>, ξ ⪰ 0. Bước 2: ràng buộc <code>cp.multiply(y, X @ w + b) &gt;= 1 - xi</code> — nhân từng phần tử với nhãn. Bước 3: mục tiêu ½‖w‖<sup>2</sup> + C·1<sup>T</sup>ξ. Bước 4: so với <code>sklearn.svm.SVC(kernel="linear", C=1)</code>, vốn giải đúng bài này qua bài đối ngẫu. Bước 5: đếm điểm có lề ≤ 1.</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp
from sklearn.svm import SVC

rng = np.random.default_rng(8)
Xp = rng.normal([2, 2], 1.0, size=(30, 2)); Xn = rng.normal([-1, -1], 1.0, size=(30, 2))
X = np.vstack([Xp, Xn]); y = np.r_[np.ones(30), -np.ones(30)]

C = 1.0
w = cp.Variable(2); b = cp.Variable(); xi = cp.Variable(60, nonneg=True)
prob = cp.Problem(cp.Minimize(0.5 * cp.sum_squares(w) + C * cp.sum(xi)),
                  [cp.multiply(y, X @ w + b) &gt;= 1 - xi])
prob.solve()
print("cvxpy  : w =", w.value.round(3), " b =", round(float(b.value), 3), " objective =", round(prob.value, 4))

clf = SVC(kernel="linear", C=C).fit(X, y)
print("sklearn: w =", clf.coef_[0].round(3), " b =", round(clf.intercept_[0], 3))
margins = y * (X @ w.value + b.value)
print("points with margin &lt;= 1 (support vectors):", int(np.sum(margins &lt;= 1 + 1e-4)),
      "| sklearn n_support:", int(clf.n_support_.sum()))
print("training accuracy:", np.mean(np.sign(X @ w.value + b.value) == y))</code></pre>
<div class="out">cvxpy  : w = [0.869 1.566]  b = -0.798  objective = 6.3971
sklearn: w = [0.869 1.566]  b = -0.798
points with margin &lt;= 1 (support vectors): 9 | sklearn n_support: 9
training accuracy: 0.95</div>
<p>CVXPY và scikit-learn khớp tới ba chữ số thập phân. Đúng 9 trên 60 điểm là vectơ hỗ trợ — 51 điểm còn lại có thể xoá mà bộ phân lớp không đổi. Độ chính xác huấn luyện 95%: 3 điểm nằm sai phía, mỗi điểm được “trả giá” bằng biến chùng của nó.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng nhãn {0, 1} thay vì {−1, +1} trong ràng buộc lề.</li><li>Quên chuẩn hoá đặc trưng: lề đo bằng khoảng cách Euclid, nên một đặc trưng có đơn vị lớn sẽ áp đảo.</li><li>Lẫn C với λ: C nhân với hàm mất mát, nên C lớn nghĩa là chính quy hoá <em>ít</em> hơn.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>SVM lề mềm: cực tiểu ½‖w‖<sup>2</sup> + C∑ξ<sub>i</sub> với y<sub>i</sub>(w<sup>T</sup>x<sub>i</sub> + b) ≥ 1 − ξ<sub>i</sub>, ξ ⪰ 0 — một QP.</li><li>Tương đương hinge loss + phạt ridge.</li><li>Chỉ vectơ hỗ trợ (lề ≤ 1) có nhân tử khác 0; w = ∑α<sub>i</sub>y<sub>i</sub>x<sub>i</sub>.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/svm.html" target="_blank" rel="noopener">scikit-learn — Support Vector Machines (hướng dẫn, có phần công thức toán)</a></li><li><a href="https://web.stanford.edu/class/ee364a/lectures/geom.pdf" target="_blank" rel="noopener">Stanford EE364a — Bài toán hình học: phân biệt tuyến tính và SVM (slide)</a></li><li><a href="https://en.wikipedia.org/wiki/Support_vector_machine" target="_blank" rel="noopener">Wikipedia — Support vector machine</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Hai điểm: x<sub>1</sub> = (1, 0) với y = +1, x<sub>2</sub> = (−1, 0) với y = −1. Tìm tay SVM lề cứng.</li><li>Một điểm có y(w<sup>T</sup>x + b) = 0,4. Biến chùng của nó bằng bao nhiêu, nó có là vectơ hỗ trợ không?</li><li>Số vectơ hỗ trợ thay đổi thế nào khi C → ∞ với dữ liệu tách được?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Do đối xứng b = 0, w = (w<sub>1</sub>, 0); ràng buộc w<sub>1</sub> ≥ 1 ⇒ w = (1, 0), lề 2/‖w‖ = 2 (bằng cả khoảng cách giữa hai điểm). 2) ξ = 1 − 0,4 = 0,6 &gt; 0; có, nó nằm trong lề. 3) Bài tiến về SVM lề cứng; thường chỉ còn vài điểm chạm dải rộng nhất là vectơ hỗ trợ.</p></div>`);

const c64 = L('cvo201-ts-6-4',
  '6.4 — Logistic regression: maximum likelihood as convex optimization|||6.4 — Hồi quy logistic: hợp lý cực đại là tối ưu lồi',
  'Mô hình logistic, hàm log-hợp lý âm (cross-entropy) là lồi, gradient Xᵀ(σ(Xw) − y), chính quy hoá L2, khớp tham số giữa CVXPY (cp.logistic) và sklearn (C = 1/(nλ)) (Boyd §7.1.1, §8.6.3).',
  `<span class="eyebrow">CVO201 · Chapter 6 · Lesson 6.4</span>
<h2>Logistic regression as convex optimization</h2>
<p class="lead">Logistic regression is the first classifier of every ML course and the last layer of many neural networks. Its training problem — maximum likelihood — is convex, which is why it is so reliable.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write the negative log-likelihood (cross-entropy) of the logistic model.</li><li>Prove that it is convex and compute its gradient and Hessian.</li><li>Fit a regularised logistic regression in CVXPY and reproduce it in scikit-learn by matching the scaling of the penalty.</li></ul>
<h3>📖 Lecture</h3>
<p>The model: P(y = 1 | x) = σ(w<sup>T</sup>x + b), where σ(z) = 1/(1 + e<sup>−z</sup>) is the sigmoid. Given data (x<sub>i</sub>, y<sub>i</sub>) with y<sub>i</sub> ∈ {0, 1}, maximum likelihood (PSI221-style estimation) maximises ∏P(y<sub>i</sub> | x<sub>i</sub>). Taking −log and writing z<sub>i</sub> = w<sup>T</sup>x<sub>i</sub> + b:</p>
<div class="formula"><span class="lbl">Logistic loss (Boyd §7.1.1)</span>ℓ(w, b) = ∑<sub>i</sub> [ log(1 + e<sup>z<sub>i</sub></sup>) − y<sub>i</sub>z<sub>i</sub> ]      ∇<sub>w</sub>ℓ = X<sup>T</sup>(σ(z) − y)      ∇<sup>2</sup><sub>w</sub>ℓ = X<sup>T</sup>diag(σ(z)(1 − σ(z)))X</div>
<p><strong>Convexity.</strong> log(1 + e<sup>z</sup>) is log-sum-exp of (0, z), hence convex in z (Lesson 3.2); composing with the affine map (w, b) ↦ z<sub>i</sub> keeps convexity (rule 2), −y<sub>i</sub>z<sub>i</sub> is affine, and a sum of convex functions is convex. The Hessian confirms it: X<sup>T</sup>DX with D a nonnegative diagonal is PSD. In CVXPY the atom <code>cp.logistic(z)</code> is exactly log(1 + e<sup>z</sup>).</p>
<p><strong>Why regularise?</strong> If the classes are perfectly separable, the likelihood can be pushed to 1 by scaling w → ∞: the minimum is not attained. Adding (λ/2)‖w‖<sup>2</sup> makes the objective strongly convex, so a unique minimiser exists. Statistically it is a Gaussian prior; numerically it improves conditioning for Newton's method (Lesson 7.4).</p>
<p><strong>Matching libraries.</strong> We minimise (1/n)ℓ + (λ/2)‖w‖<sup>2</sup>. scikit-learn's <code>LogisticRegression</code> minimises ½‖w‖<sup>2</sup> + C·ℓ. Multiplying ours by 1/λ shows the two coincide when C = 1/(nλ) — always check such scalings before comparing results across tools.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Problem.</b> n = 200 points in ℝ<sup>2</sup>, labels drawn from the true model P(y = 1) = σ(0.5 + 2x<sub>1</sub> − x<sub>2</sub>). Fit with λ = 0.1.</p>
<p>Step 1: z = Xw + b (affine). Step 2: loss <code>cp.sum(cp.logistic(z) - cp.multiply(y, z))</code>, divided by n. Step 3: add <code>lam/2 * cp.sum_squares(w)</code> (the intercept is not penalised). Step 4: in scikit-learn set C = 1/(200·0.1) = 0.05 and a tight tolerance.</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp
from sklearn.linear_model import LogisticRegression

rng = np.random.default_rng(9)
n = 200
X = rng.normal(size=(n, 2))
p = 1 / (1 + np.exp(-(0.5 + 2 * X[:, 0] - 1 * X[:, 1])))
y = (rng.uniform(size=n) &lt; p).astype(float)            # labels in {0, 1}

w = cp.Variable(2); b = cp.Variable(); lam = 0.1
z = X @ w + b
# negative log-likelihood: sum log(1 + e^z) - y z   (logistic = log(1+exp))
nll = cp.sum(cp.logistic(z) - cp.multiply(y, z))
prob = cp.Problem(cp.Minimize(nll / n + lam / 2 * cp.sum_squares(w)))
prob.solve()
print("cvxpy  : w =", w.value.round(4), " b =", round(float(b.value), 4))

# sklearn minimises 0.5||w||^2 + C * sum(loss): C = 1 / (n * lam) gives the same problem
clf = LogisticRegression(C=1 / (n * lam), tol=1e-10, max_iter=10_000).fit(X, y)
print("sklearn: w =", clf.coef_[0].round(4), " b =", round(clf.intercept_[0], 4))
print("accuracy:", np.mean((X @ w.value + b.value &gt; 0) == y))</code></pre>
<div class="out">cvxpy  : w = [ 0.9596 -0.4334]  b = 0.408
sklearn: w = [ 0.9596 -0.4334]  b = 0.408
accuracy: 0.81</div>
<p>The two fits agree to four decimals. The estimate (0.96, −0.43) has the right signs and ratio-ish shape but is much smaller than the true (2, −1): with λ = 0.1 the penalty shrinks w strongly. With a smaller λ the estimate moves toward the truth (try it). The accuracy of 81% reflects label noise — even the true model misclassifies many points.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing the loss as <code>cp.log(1 + cp.exp(z))</code>: mathematically right but not DCP (log of a convex expression). Use <code>cp.logistic</code>.</li><li>Computing log(1 + e<sup>z</sup>) naively in NumPy for large z — it overflows; use <code>np.logaddexp(0, z)</code>.</li><li>Comparing coefficients across libraries without matching C and the intercept treatment.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Negative log-likelihood of logistic regression = ∑[log(1 + e<sup>z<sub>i</sub></sup>) − y<sub>i</sub>z<sub>i</sub>], convex in (w, b).</li><li>Gradient X<sup>T</sup>(σ − y), Hessian X<sup>T</sup>DX ⪰ 0.</li><li>L2 regularisation guarantees a unique minimiser; sklearn's C = 1/(nλ).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html" target="_blank" rel="noopener">scikit-learn — LogisticRegression (API and objective)</a></li><li><a href="https://www.cvxpy.org/examples/machine_learning/logistic_regression.html" target="_blank" rel="noopener">CVXPY example — Logistic regression with ℓ1 regularization</a></li><li><a href="https://web.stanford.edu/class/ee364a/lectures/stat.pdf" target="_blank" rel="noopener">Stanford EE364a — Statistical estimation: maximum likelihood, logistic regression (slides)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Show that σ′(z) = σ(z)(1 − σ(z)).</li><li>Compute the loss of a single point with y = 1 and z = 0. What if z = 3?</li><li>Why does the minimum fail to exist on separable data without regularisation?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) σ = (1 + e<sup>−z</sup>)<sup>−1</sup> ⇒ σ′ = e<sup>−z</sup>/(1 + e<sup>−z</sup>)<sup>2</sup> = σ·(1 − σ). 2) z = 0: log 2 − 0 ≈ 0.693; z = 3: log(1 + e<sup>3</sup>) − 3 = log(1 + e<sup>−3</sup>) ≈ 0.0486. 3) If w separates the data, scaling w by t → ∞ drives every term to 0 without reaching it: the infimum 0 is not attained.</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 6 · Bài 6.4</span>
<h2>Hồi quy logistic là tối ưu lồi</h2>
<p class="lead">Hồi quy logistic là bộ phân lớp đầu tiên của mọi khoá học máy và là lớp cuối của nhiều mạng nơ-ron. Bài huấn luyện của nó — hợp lý cực đại — là lồi, vì thế nó rất đáng tin.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết hàm log-hợp lý âm (cross-entropy) của mô hình logistic.</li><li>Chứng minh nó lồi, tính gradient và Hessian.</li><li>Khớp hồi quy logistic có chính quy hoá bằng CVXPY và tái tạo trong scikit-learn bằng cách khớp thang đo của hàm phạt.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Mô hình: P(y = 1 | x) = σ(w<sup>T</sup>x + b), với σ(z) = 1/(1 + e<sup>−z</sup>) là hàm sigmoid. Cho dữ liệu (x<sub>i</sub>, y<sub>i</sub>) với y<sub>i</sub> ∈ {0, 1}, hợp lý cực đại (kiểu ước lượng ở PSI221) cực đại ∏P(y<sub>i</sub> | x<sub>i</sub>). Lấy −log và đặt z<sub>i</sub> = w<sup>T</sup>x<sub>i</sub> + b:</p>
<div class="formula"><span class="lbl">Hàm mất mát logistic (Boyd §7.1.1)</span>ℓ(w, b) = ∑<sub>i</sub> [ log(1 + e<sup>z<sub>i</sub></sup>) − y<sub>i</sub>z<sub>i</sub> ]      ∇<sub>w</sub>ℓ = X<sup>T</sup>(σ(z) − y)      ∇<sup>2</sup><sub>w</sub>ℓ = X<sup>T</sup>diag(σ(z)(1 − σ(z)))X</div>
<p><strong>Tính lồi.</strong> log(1 + e<sup>z</sup>) là log-sum-exp của (0, z), nên lồi theo z (Bài 3.2); hợp với phép affine (w, b) ↦ z<sub>i</sub> giữ tính lồi (quy tắc 2), −y<sub>i</sub>z<sub>i</sub> là affine, và tổng các hàm lồi là lồi. Hessian xác nhận: X<sup>T</sup>DX với D chéo không âm là PSD. Trong CVXPY nguyên tử <code>cp.logistic(z)</code> chính là log(1 + e<sup>z</sup>).</p>
<p><strong>Vì sao cần chính quy hoá?</strong> Nếu hai lớp tách được hoàn toàn, có thể đẩy hợp lý về 1 bằng cách phóng w → ∞: cực tiểu không đạt được. Thêm (λ/2)‖w‖<sup>2</sup> làm mục tiêu lồi mạnh, nên có điểm cực tiểu duy nhất. Về thống kê đó là tiên nghiệm Gauss; về số học nó cải thiện số điều kiện cho phương pháp Newton (Bài 7.4).</p>
<p><strong>Khớp giữa các thư viện.</strong> Ta cực tiểu (1/n)ℓ + (λ/2)‖w‖<sup>2</sup>. <code>LogisticRegression</code> của scikit-learn cực tiểu ½‖w‖<sup>2</sup> + C·ℓ. Nhân hàm của ta với 1/λ thấy hai bài trùng nhau khi C = 1/(nλ) — luôn kiểm thang đo như vậy trước khi so kết quả giữa các công cụ.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Bài toán.</b> n = 200 điểm trong ℝ<sup>2</sup>, nhãn sinh từ mô hình thật P(y = 1) = σ(0,5 + 2x<sub>1</sub> − x<sub>2</sub>). Khớp với λ = 0,1.</p>
<p>Bước 1: z = Xw + b (affine). Bước 2: mất mát <code>cp.sum(cp.logistic(z) - cp.multiply(y, z))</code>, chia cho n. Bước 3: cộng <code>lam/2 * cp.sum_squares(w)</code> (không phạt hệ số chặn). Bước 4: trong scikit-learn đặt C = 1/(200·0,1) = 0,05 và sai số dừng nhỏ.</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp
from sklearn.linear_model import LogisticRegression

rng = np.random.default_rng(9)
n = 200
X = rng.normal(size=(n, 2))
p = 1 / (1 + np.exp(-(0.5 + 2 * X[:, 0] - 1 * X[:, 1])))
y = (rng.uniform(size=n) &lt; p).astype(float)            # labels in {0, 1}

w = cp.Variable(2); b = cp.Variable(); lam = 0.1
z = X @ w + b
# negative log-likelihood: sum log(1 + e^z) - y z   (logistic = log(1+exp))
nll = cp.sum(cp.logistic(z) - cp.multiply(y, z))
prob = cp.Problem(cp.Minimize(nll / n + lam / 2 * cp.sum_squares(w)))
prob.solve()
print("cvxpy  : w =", w.value.round(4), " b =", round(float(b.value), 4))

# sklearn minimises 0.5||w||^2 + C * sum(loss): C = 1 / (n * lam) gives the same problem
clf = LogisticRegression(C=1 / (n * lam), tol=1e-10, max_iter=10_000).fit(X, y)
print("sklearn: w =", clf.coef_[0].round(4), " b =", round(clf.intercept_[0], 4))
print("accuracy:", np.mean((X @ w.value + b.value &gt; 0) == y))</code></pre>
<div class="out">cvxpy  : w = [ 0.9596 -0.4334]  b = 0.408
sklearn: w = [ 0.9596 -0.4334]  b = 0.408
accuracy: 0.81</div>
<p>Hai lời giải khớp tới bốn chữ số. Ước lượng (0,96; −0,43) đúng dấu nhưng nhỏ hơn nhiều so với giá trị thật (2, −1): với λ = 0,1 hàm phạt co w mạnh. Với λ nhỏ hơn, ước lượng tiến về giá trị thật (hãy thử). Độ chính xác 81% phản ánh nhiễu nhãn — ngay cả mô hình thật cũng phân sai nhiều điểm.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết mất mát là <code>cp.log(1 + cp.exp(z))</code>: đúng về toán nhưng không DCP (log của biểu thức lồi). Hãy dùng <code>cp.logistic</code>.</li><li>Tính log(1 + e<sup>z</sup>) ngây thơ trong NumPy với z lớn — tràn số; hãy dùng <code>np.logaddexp(0, z)</code>.</li><li>So hệ số giữa các thư viện mà không khớp C và cách xử lý hệ số chặn.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Log-hợp lý âm của hồi quy logistic = ∑[log(1 + e<sup>z<sub>i</sub></sup>) − y<sub>i</sub>z<sub>i</sub>], lồi theo (w, b).</li><li>Gradient X<sup>T</sup>(σ − y), Hessian X<sup>T</sup>DX ⪰ 0.</li><li>Chính quy hoá L2 bảo đảm điểm cực tiểu duy nhất; C của sklearn = 1/(nλ).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html" target="_blank" rel="noopener">scikit-learn — LogisticRegression (API và hàm mục tiêu)</a></li><li><a href="https://www.cvxpy.org/examples/machine_learning/logistic_regression.html" target="_blank" rel="noopener">Ví dụ CVXPY — Logistic regression with ℓ1 regularization</a></li><li><a href="https://web.stanford.edu/class/ee364a/lectures/stat.pdf" target="_blank" rel="noopener">Stanford EE364a — Ước lượng thống kê: hợp lý cực đại, hồi quy logistic (slide)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Chứng minh σ′(z) = σ(z)(1 − σ(z)).</li><li>Tính mất mát của một điểm với y = 1 và z = 0. Còn z = 3?</li><li>Vì sao không có cực tiểu trên dữ liệu tách được nếu không chính quy hoá?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) σ = (1 + e<sup>−z</sup>)<sup>−1</sup> ⇒ σ′ = e<sup>−z</sup>/(1 + e<sup>−z</sup>)<sup>2</sup> = σ·(1 − σ). 2) z = 0: log 2 − 0 ≈ 0,693; z = 3: log(1 + e<sup>3</sup>) − 3 = log(1 + e<sup>−3</sup>) ≈ 0,0486. 3) Nếu w tách được dữ liệu, nhân w với t → ∞ đẩy mọi số hạng về 0 mà không chạm tới: infimum 0 không đạt được.</p></div>`);

const c65 = L('cvo201-ts-6-5',
  '6.5 — Portfolio optimization: the Markowitz risk–return trade-off|||6.5 — Tối ưu danh mục đầu tư: đánh đổi rủi ro–lợi nhuận Markowitz',
  'Bài Markowitz: lợi nhuận kỳ vọng μᵀw, rủi ro wᵀΣw, ràng buộc ngân sách và không bán khống, tham số ngại rủi ro γ, đường biên hiệu quả — một QP; diễn giải kết quả và giới hạn của mô hình (Boyd §4.4.1, §4.7.6).',
  `<span class="eyebrow">CVO201 · Chapter 6 · Lesson 6.5</span>
<h2>Portfolio optimization: the Markowitz trade-off</h2>
<p class="lead">How should you split money between assets that have different expected returns and that move together? Markowitz's answer is a QP, and it is still the starting point of quantitative finance.</p>
<h3>🎯 Objectives</h3>
<ul><li>Model expected return and risk of a portfolio with μ and Σ.</li><li>Write the Markowitz problem as a QP with budget and no-short-selling constraints.</li><li>Trace the efficient frontier by sweeping the risk-aversion parameter γ.</li><li>Discuss the limitations of the model honestly.</li></ul>
<h3>📖 Lecture</h3>
<p>Let w ∈ ℝ<sup>n</sup> be the fractions of wealth in n assets (1<sup>T</sup>w = 1). If the asset returns r have mean μ and covariance matrix Σ (always PSD — Lesson 2.2), the portfolio return w<sup>T</sup>r has mean μ<sup>T</sup>w and variance w<sup>T</sup>Σw. Return is good, variance (risk) is bad: again a bi-criterion problem.</p>
<div class="formula"><span class="lbl">Markowitz portfolio problem (Boyd §4.4.1, risk–return trade-off §4.7.6)</span>maximize μ<sup>T</sup>w − γ w<sup>T</sup>Σw   subject to 1<sup>T</sup>w = 1, w ⪰ 0      (γ &gt; 0: risk aversion)<br>equivalent: minimize w<sup>T</sup>Σw  subject to μ<sup>T</sup>w ≥ r<sub>min</sub>, 1<sup>T</sup>w = 1, w ⪰ 0</div>
<p>Because Σ ⪰ 0 the objective is concave (we maximise), the constraints are linear: a QP. The constraint w ⪰ 0 forbids short selling; drop it and short positions appear. Sweeping γ from small to large traces the <strong>efficient frontier</strong>: portfolios for which no other portfolio has both higher return and lower risk. Small γ: chase return (concentrate in the riskiest, highest-return asset). Large γ: minimise risk (load the safest asset). Diversification appears automatically because correlations below 1 make the portfolio variance smaller than the weighted variances.</p>
<p>Extensions that stay convex: limits on each weight (w ⪯ 0.4), sector limits, transaction costs ‖w − w<sub>0</sub>‖<sub>1</sub>, a leverage limit ‖w‖<sub>1</sub> ≤ L, and loss-risk constraints, which become SOCPs (Boyd Example 4.8). A cardinality limit (“at most 5 assets”) is not convex — the ℓ<sub>1</sub> trick of Lesson 6.2 is the usual heuristic.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Data.</b> Four assets: expected returns μ = (8%, 12%, 15%, 5%), volatilities (10%, 20%, 30%, 2%); assets 1–3 are correlated, asset 4 (a bond-like asset) is uncorrelated. Σ = diag(vol)·R·diag(vol).</p>
<p>Step 1: build Σ and check that it is PSD. Step 2: declare γ as a <code>cp.Parameter</code>. Step 3: solve for γ = 0.5, 2, 8, 50 and print return, risk √(w<sup>T</sup>Σw) and weights. Step 4: read the frontier.</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp

mu = np.array([0.08, 0.12, 0.15, 0.05])                 # expected yearly returns
vol = np.array([0.10, 0.20, 0.30, 0.02])                # volatilities
R = np.array([[1.0, 0.3, 0.2, 0.0], [0.3, 1.0, 0.5, 0.0],
              [0.2, 0.5, 1.0, 0.0], [0.0, 0.0, 0.0, 1.0]])
Sigma = np.outer(vol, vol) * R                          # covariance matrix

w = cp.Variable(4); gamma = cp.Parameter(nonneg=True)
prob = cp.Problem(cp.Maximize(mu @ w - gamma * cp.quad_form(w, Sigma)),
                  [cp.sum(w) == 1, w &gt;= 0])
print("gamma   return   risk(sd)   weights")
for g in [0.5, 2.0, 8.0, 50.0]:
    gamma.value = g; prob.solve()
    ret = mu @ w.value; sd = np.sqrt(w.value @ Sigma @ w.value)
    print(f"{g:5.1f}   {ret:.4f}   {sd:.4f}     {np.round(w.value, 3)}")</code></pre>
<div class="out">gamma   return   risk(sd)   weights
  0.5   0.1371   0.2268     [0.    0.429 0.571 0.   ]
  2.0   0.0985   0.1103     [0.512 0.238 0.165 0.085]
  8.0   0.0632   0.0335     [0.155 0.062 0.042 0.741]
 50.0   0.0533   0.0201     [0.055 0.013 0.007 0.925]</div>
<p>At γ = 0.5 the portfolio holds only the two high-return assets (return 13.7%, risk 22.7%). As γ grows, weight moves to the low-risk asset 4 and the risk falls to 2%, close to that asset's own volatility, with a return of 5.3%. At γ = 2 all four assets are used — diversification chosen by the optimizer, not imposed.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Treating μ and Σ as known: they are estimates, and the optimizer happily exploits their errors (“error maximisation”). Robust or regularised versions help.</li><li>Using a non-PSD covariance estimate (e.g. from missing data): <code>quad_form</code> will fail DCP. Fix the estimate first (nearest PSD matrix — an SDP, Lesson 4.4).</li><li>Confusing variance with standard deviation when reporting risk.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Return μ<sup>T</sup>w, risk w<sup>T</sup>Σw with Σ ⪰ 0.</li><li>Markowitz: maximise μ<sup>T</sup>w − γw<sup>T</sup>Σw s.t. 1<sup>T</sup>w = 1, w ⪰ 0 — a QP.</li><li>Sweeping γ traces the efficient frontier; diversification emerges from correlations.</li><li>Many practical constraints keep the problem convex; cardinality does not.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Modern_portfolio_theory" target="_blank" rel="noopener">Wikipedia — Modern portfolio theory</a></li><li><a href="https://en.wikipedia.org/wiki/Efficient_frontier" target="_blank" rel="noopener">Wikipedia — Efficient frontier</a></li><li><a href="https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf" target="_blank" rel="noopener">Boyd &amp; Vandenberghe — §4.4.1 Markowitz portfolio optimization and §4.7.6 risk–return trade-off (PDF)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Two uncorrelated assets with variances 0.04 and 0.01. Find the minimum-variance portfolio (w<sub>1</sub> + w<sub>2</sub> = 1).</li><li>Why can the minimum-variance portfolio have lower risk than the safest single asset?</li><li>Add the constraint “no asset above 40%” to the CVXPY model. What changes at γ = 0.5?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Minimise 0.04w<sub>1</sub><sup>2</sup> + 0.01(1 − w<sub>1</sub>)<sup>2</sup>: 0.08w<sub>1</sub> − 0.02(1 − w<sub>1</sub>) = 0 ⇒ w<sub>1</sub> = 0.2, w<sub>2</sub> = 0.8, variance 0.04·0.04 + 0.01·0.64 = 0.008 &lt; 0.01. 2) Imperfect correlation: errors partly cancel. 3) <code>w &lt;= 0.4</code>; the 57% in asset 3 is capped at 40% and the rest is spread to the next best assets, lowering both return and risk.</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 6 · Bài 6.5</span>
<h2>Tối ưu danh mục: đánh đổi Markowitz</h2>
<p class="lead">Nên chia tiền thế nào giữa các tài sản có lợi nhuận kỳ vọng khác nhau và biến động cùng nhau? Câu trả lời của Markowitz là một QP, và vẫn là điểm xuất phát của tài chính định lượng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mô hình hoá lợi nhuận kỳ vọng và rủi ro của danh mục bằng μ và Σ.</li><li>Viết bài Markowitz thành QP với ràng buộc ngân sách và không bán khống.</li><li>Vẽ đường biên hiệu quả bằng cách quét tham số ngại rủi ro γ.</li><li>Bàn thẳng thắn về giới hạn của mô hình.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Cho w ∈ ℝ<sup>n</sup> là tỉ lệ tài sản đặt vào n tài sản (1<sup>T</sup>w = 1). Nếu lợi suất r của các tài sản có trung bình μ và ma trận hiệp phương sai Σ (luôn PSD — Bài 2.2), lợi suất danh mục w<sup>T</sup>r có trung bình μ<sup>T</sup>w và phương sai w<sup>T</sup>Σw. Lợi suất là tốt, phương sai (rủi ro) là xấu: lại là bài hai tiêu chí.</p>
<div class="formula"><span class="lbl">Bài danh mục Markowitz (Boyd §4.4.1, đánh đổi rủi ro–lợi nhuận §4.7.6)</span>maximize μ<sup>T</sup>w − γ w<sup>T</sup>Σw   subject to 1<sup>T</sup>w = 1, w ⪰ 0      (γ &gt; 0: mức ngại rủi ro)<br>tương đương: minimize w<sup>T</sup>Σw  subject to μ<sup>T</sup>w ≥ r<sub>min</sub>, 1<sup>T</sup>w = 1, w ⪰ 0</div>
<p>Vì Σ ⪰ 0 nên mục tiêu lõm (ta cực đại), ràng buộc tuyến tính: một QP. Ràng buộc w ⪰ 0 cấm bán khống; bỏ nó đi thì xuất hiện vị thế bán khống. Quét γ từ nhỏ đến lớn vẽ nên <strong>đường biên hiệu quả</strong>: các danh mục mà không danh mục nào khác vừa lợi suất cao hơn vừa rủi ro thấp hơn. γ nhỏ: đuổi theo lợi suất (dồn vào tài sản rủi ro, lợi suất cao nhất). γ lớn: cực tiểu rủi ro (dồn vào tài sản an toàn nhất). Đa dạng hoá tự xuất hiện vì tương quan nhỏ hơn 1 làm phương sai danh mục nhỏ hơn phương sai có trọng số.</p>
<p>Các mở rộng vẫn lồi: giới hạn từng trọng số (w ⪯ 0,4), giới hạn theo ngành, chi phí giao dịch ‖w − w<sub>0</sub>‖<sub>1</sub>, giới hạn đòn bẩy ‖w‖<sub>1</sub> ≤ L, và ràng buộc rủi ro thua lỗ, vốn thành SOCP (Boyd Ví dụ 4.8). Giới hạn số tài sản (“tối đa 5 mã”) không lồi — mẹo ℓ<sub>1</sub> của Bài 6.2 là heuristic thường dùng.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Dữ liệu.</b> Bốn tài sản: lợi suất kỳ vọng μ = (8%, 12%, 15%, 5%), độ biến động (10%, 20%, 30%, 2%); tài sản 1–3 tương quan với nhau, tài sản 4 (kiểu trái phiếu) không tương quan. Σ = diag(vol)·R·diag(vol).</p>
<p>Bước 1: dựng Σ và kiểm PSD. Bước 2: khai báo γ là <code>cp.Parameter</code>. Bước 3: giải với γ = 0,5; 2; 8; 50 và in lợi suất, rủi ro √(w<sup>T</sup>Σw) và trọng số. Bước 4: đọc đường biên.</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp

mu = np.array([0.08, 0.12, 0.15, 0.05])                 # expected yearly returns
vol = np.array([0.10, 0.20, 0.30, 0.02])                # volatilities
R = np.array([[1.0, 0.3, 0.2, 0.0], [0.3, 1.0, 0.5, 0.0],
              [0.2, 0.5, 1.0, 0.0], [0.0, 0.0, 0.0, 1.0]])
Sigma = np.outer(vol, vol) * R                          # covariance matrix

w = cp.Variable(4); gamma = cp.Parameter(nonneg=True)
prob = cp.Problem(cp.Maximize(mu @ w - gamma * cp.quad_form(w, Sigma)),
                  [cp.sum(w) == 1, w &gt;= 0])
print("gamma   return   risk(sd)   weights")
for g in [0.5, 2.0, 8.0, 50.0]:
    gamma.value = g; prob.solve()
    ret = mu @ w.value; sd = np.sqrt(w.value @ Sigma @ w.value)
    print(f"{g:5.1f}   {ret:.4f}   {sd:.4f}     {np.round(w.value, 3)}")</code></pre>
<div class="out">gamma   return   risk(sd)   weights
  0.5   0.1371   0.2268     [0.    0.429 0.571 0.   ]
  2.0   0.0985   0.1103     [0.512 0.238 0.165 0.085]
  8.0   0.0632   0.0335     [0.155 0.062 0.042 0.741]
 50.0   0.0533   0.0201     [0.055 0.013 0.007 0.925]</div>
<p>Ở γ = 0,5 danh mục chỉ giữ hai tài sản lợi suất cao (lợi suất 13,7%, rủi ro 22,7%). Khi γ tăng, trọng số chuyển sang tài sản 4 ít rủi ro và rủi ro giảm còn 2%, gần độ biến động của chính tài sản đó, với lợi suất 5,3%. Ở γ = 2 cả bốn tài sản đều được dùng — đa dạng hoá do bộ tối ưu chọn, không bị áp đặt.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Coi μ và Σ là đã biết: chúng là ước lượng, và bộ tối ưu sẵn sàng khai thác sai số của chúng (“cực đại hoá sai số”). Các bản bền vững hay có chính quy hoá giúp giảm điều này.</li><li>Dùng ước lượng hiệp phương sai không PSD (vd do thiếu dữ liệu): <code>quad_form</code> sẽ không qua DCP. Hãy sửa ước lượng trước (ma trận PSD gần nhất — một SDP, Bài 4.4).</li><li>Lẫn phương sai với độ lệch chuẩn khi báo cáo rủi ro.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Lợi suất μ<sup>T</sup>w, rủi ro w<sup>T</sup>Σw với Σ ⪰ 0.</li><li>Markowitz: cực đại μ<sup>T</sup>w − γw<sup>T</sup>Σw với 1<sup>T</sup>w = 1, w ⪰ 0 — một QP.</li><li>Quét γ vẽ đường biên hiệu quả; đa dạng hoá nảy sinh từ tương quan.</li><li>Nhiều ràng buộc thực tế giữ bài lồi; giới hạn số tài sản thì không.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Modern_portfolio_theory" target="_blank" rel="noopener">Wikipedia — Modern portfolio theory</a></li><li><a href="https://en.wikipedia.org/wiki/Efficient_frontier" target="_blank" rel="noopener">Wikipedia — Efficient frontier</a></li><li><a href="https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf" target="_blank" rel="noopener">Boyd &amp; Vandenberghe — §4.4.1 danh mục Markowitz và §4.7.6 đánh đổi rủi ro–lợi nhuận (PDF)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Hai tài sản không tương quan có phương sai 0,04 và 0,01. Tìm danh mục phương sai nhỏ nhất (w<sub>1</sub> + w<sub>2</sub> = 1).</li><li>Vì sao danh mục phương sai nhỏ nhất có thể ít rủi ro hơn cả tài sản an toàn nhất?</li><li>Thêm ràng buộc “không tài sản nào quá 40%” vào mô hình CVXPY. Ở γ = 0,5 điều gì thay đổi?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Cực tiểu 0,04w<sub>1</sub><sup>2</sup> + 0,01(1 − w<sub>1</sub>)<sup>2</sup>: 0,08w<sub>1</sub> − 0,02(1 − w<sub>1</sub>) = 0 ⇒ w<sub>1</sub> = 0,2, w<sub>2</sub> = 0,8, phương sai 0,04·0,04 + 0,01·0,64 = 0,008 &lt; 0,01. 2) Tương quan không hoàn hảo: sai lệch triệt tiêu một phần. 3) <code>w &lt;= 0.4</code>; 57% ở tài sản 3 bị chặn còn 40% và phần còn lại chia sang các tài sản tốt kế tiếp, làm giảm cả lợi suất lẫn rủi ro.</p></div>`);

const q6 = QZ(6, 'Quiz — Chapter 6: Applications|||Quiz — Chương 6: Ứng dụng',
  'Kiểm tra bình phương tối thiểu, số điều kiện, Huber, ridge, Lasso, SVM, hồi quy logistic, danh mục Markowitz.', [
  Q('q1', 'The least-squares residual r = Ax* − b satisfies|||Phần dư bình phương tối thiểu r = Ax* − b thoả',
    ['r = 0|||r = 0', 'Aᵀr = 0|||Aᵀr = 0', 'Ar = 0|||Ar = 0', '‖r‖ = 1|||‖r‖ = 1'], 1,
    'The residual is orthogonal to the column space (normal equations).|||Phần dư trực giao với không gian cột (phương trình chuẩn).'),
  Q('q2', 'If cond(A) = 10⁴, then cond(AᵀA) is about|||Nếu cond(A) = 10⁴ thì cond(AᵀA) khoảng',
    ['10²|||10²', '10⁴|||10⁴', '10⁸|||10⁸', '10¹⁶|||10¹⁶'], 2,
    'Forming AᵀA squares the condition number.|||Lập AᵀA bình phương số điều kiện.'),
  Q('q3', 'Which penalty is most robust to a few large outliers?|||Hàm phạt nào bền nhất với vài ngoại lai lớn?',
    ['u²|||u²', 'Huber or |u||||Huber hoặc |u|', 'u⁴|||u⁴', 'e^u|||e^u'], 1,
    'Linear growth for large residuals limits the outliers’ influence.|||Tăng tuyến tính với phần dư lớn hạn chế ảnh hưởng của ngoại lai.'),
  Q('q4', 'Ridge regression has the closed form|||Hồi quy ridge có nghiệm đóng',
    ['(AᵀA)⁻¹Aᵀb|||(AᵀA)⁻¹Aᵀb', '(AᵀA + λI)⁻¹Aᵀb|||(AᵀA + λI)⁻¹Aᵀb', '(AAᵀ + λI)⁻¹b|||(AAᵀ + λI)⁻¹b', 'none|||không có'], 1,
    'Set 2Aᵀ(Ax − b) + 2λx = 0.|||Cho 2Aᵀ(Ax − b) + 2λx = 0.'),
  Q('q5', 'The Lasso produces exactly-zero coefficients because|||Lasso cho hệ số đúng bằng 0 vì',
    ['it is nonconvex|||nó không lồi', 'the ℓ₁ ball has corners on the axes|||quả cầu ℓ₁ có góc trên các trục', 'it uses integers|||nó dùng số nguyên', 'λ is large|||λ lớn'], 1,
    'Level sets of the loss typically first touch the ℓ₁ ball at a corner.|||Tập mức của hàm mất mát thường chạm quả cầu ℓ₁ đầu tiên tại một góc.'),
  Q('q6', 'In the soft-margin SVM, increasing C|||Trong SVM lề mềm, tăng C',
    ['increases regularisation|||tăng chính quy hoá', 'punishes margin violations more|||phạt vi phạm lề nặng hơn', 'removes the constraints|||bỏ các ràng buộc', 'makes the problem nonconvex|||làm bài không lồi'], 1,
    'C multiplies the slack sum; large C means less regularisation.|||C nhân với tổng biến chùng; C lớn là chính quy hoá ít hơn.'),
  Q('q7', 'SVM support vectors are the points with|||Vectơ hỗ trợ của SVM là các điểm có',
    ['margin y(wᵀx + b) ≤ 1 (nonzero multiplier)|||lề y(wᵀx + b) ≤ 1 (nhân tử khác 0)', 'the largest norm|||chuẩn lớn nhất', 'label +1|||nhãn +1', 'margin > 1|||lề > 1'], 0,
    'Complementary slackness makes the other multipliers zero.|||Tính bù trừ làm các nhân tử khác bằng 0.'),
  Q('q8', 'The logistic negative log-likelihood is convex because|||Log-hợp lý âm logistic lồi vì',
    ['the sigmoid is convex|||sigmoid lồi', 'log(1 + e^z) is convex and z is affine in (w, b)|||log(1 + e^z) lồi và z affine theo (w, b)', 'labels are binary|||nhãn nhị phân', 'it is quadratic|||nó là bậc hai'], 1,
    'Convex function of an affine map, plus an affine term.|||Hàm lồi của một phép affine, cộng một số hạng affine.'),
  Q('q9', 'Our objective (1/n)ℓ + (λ/2)‖w‖² matches sklearn’s ½‖w‖² + C·ℓ when|||Mục tiêu (1/n)ℓ + (λ/2)‖w‖² khớp ½‖w‖² + C·ℓ của sklearn khi',
    ['C = λ|||C = λ', 'C = 1/(nλ)|||C = 1/(nλ)', 'C = n/λ|||C = n/λ', 'C = 1|||C = 1'], 1,
    'Multiply our objective by 1/λ.|||Nhân mục tiêu của ta với 1/λ.'),
  Q('q10', 'In the Markowitz problem, increasing the risk aversion γ|||Trong bài Markowitz, tăng mức ngại rủi ro γ',
    ['raises expected return|||tăng lợi suất kỳ vọng', 'lowers portfolio risk (and usually return)|||giảm rủi ro danh mục (và thường cả lợi suất)', 'makes the problem an LP|||biến bài thành LP', 'has no effect|||không có tác dụng'], 1,
    'Larger γ moves along the efficient frontier toward the minimum-variance portfolio.|||γ lớn hơn đi dọc đường biên hiệu quả về danh mục phương sai nhỏ nhất.'),
]);

const ch6 = {
  title: 'Chapter 6 — Applications: fitting, regularisation, SVM, logistic regression, portfolios|||Chương 6 — Ứng dụng: khớp dữ liệu, chính quy hoá, SVM, hồi quy logistic, danh mục',
  description: 'Bình phương tối thiểu và xấp xỉ chuẩn, ridge và Lasso, SVM lề mềm, hồi quy logistic bằng hợp lý cực đại, danh mục Markowitz — mô hình hoá và giải bằng CVXPY, đối chiếu scikit-learn (Boyd Ch. 6, §7.1, §8.6, §4.4).',
  lessons: [c61, c62, c63, c64, c65, q6],
};


// ───────────────────────────── Chương 7 — Cực tiểu không ràng buộc ─────────────────────────────
const c71 = L('cvo201-ts-7-1',
  '7.1 — Gradient descent: descent directions, smoothness, strong convexity and the condition number|||7.1 — Gradient descent: hướng giảm, độ trơn, lồi mạnh và số điều kiện',
  'Phương pháp giảm tổng quát, gradient descent x⁺ = x − t∇f(x), hàm L-trơn và μ-lồi mạnh, bước 1/L, tốc độ hội tụ tuyến tính (1 − μ/L)ᵏ, ảnh hưởng của số điều kiện κ = L/μ, phân kỳ khi t > 2/L (Boyd §9.1–9.3).',
  `<span class="eyebrow">CVO201 · Chapter 7 · Lesson 7.1</span>
<h2>Gradient descent and the condition number</h2>
<p class="lead">CVXPY hides the algorithm. From now on we open the box: how does a computer actually minimise a convex function? The simplest answer — walk downhill along −∇f — is also the basis of every deep-learning optimizer.</p>
<h3>🎯 Objectives</h3>
<ul><li>Describe a general descent method and the gradient descent update.</li><li>Define L-smoothness and μ-strong convexity and interpret them as bounds on curvature.</li><li>State the convergence rate of gradient descent and the role of the condition number κ = L/μ.</li><li>Explain why too large a step makes gradient descent diverge.</li></ul>
<h3>📖 Lecture</h3>
<p>For unconstrained minimisation of a differentiable convex f, optimality means ∇f(x*) = 0 (Lesson 3.1). Except for quadratics we cannot solve this equation in closed form, so we iterate: x<sup>(k+1)</sup> = x<sup>(k)</sup> + t<sup>(k)</sup>Δx<sup>(k)</sup>. Δx is a <strong>descent direction</strong> if ∇f(x)<sup>T</sup>Δx &lt; 0 — then a small enough step decreases f. The steepest choice for the Euclidean norm is Δx = −∇f(x):</p>
<div class="formula"><span class="lbl">Gradient descent (Boyd §9.3)</span>x<sup>(k+1)</sup> = x<sup>(k)</sup> − t ∇f(x<sup>(k)</sup>)      stop when ‖∇f(x)‖<sub>2</sub> ≤ ε</div>
<p><strong>Curvature bounds.</strong> f is <strong>L-smooth</strong> if ∇<sup>2</sup>f(x) ⪯ LI (curvature at most L) and <strong>μ-strongly convex</strong> if ∇<sup>2</sup>f(x) ⪰ μI with μ &gt; 0 (curvature at least μ). For a quadratic ½x<sup>T</sup>Px, L and μ are the largest and smallest eigenvalues of P. Their ratio κ = L/μ is the <strong>condition number</strong>: geometrically, how elongated the level sets (ellipses) are.</p>
<div class="formula"><span class="lbl">Convergence with fixed step t = 1/L</span>convex, L-smooth:  f(x<sup>(k)</sup>) − p* ≤ L‖x<sup>(0)</sup> − x*‖<sup>2</sup>/(2k)      (sublinear, O(1/k))<br>μ-strongly convex:  f(x<sup>(k)</sup>) − p* ≤ (1 − μ/L)<sup>k</sup> (f(x<sup>(0)</sup>) − p*)      (linear)</div>
<p>“Linear” convergence means the number of correct digits grows linearly with k, at a rate set by κ: roughly κ·log(1/ε) iterations. On a round bowl (κ = 1) one step reaches the minimum; on a narrow valley (κ = 1000) gradient descent zig-zags across the valley and needs thousands of steps. This is exactly why we standardise features in ML: it reduces κ. And the step must be small enough: on a quadratic, gradient descent converges iff 0 &lt; t &lt; 2/L; beyond that, the error in the steepest direction is multiplied by |1 − tL| &gt; 1 at every step.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Problem.</b> f(x) = ½(x<sub>1</sub><sup>2</sup> + γx<sub>2</sub><sup>2</sup>), so μ = 1, L = γ, κ = γ. Start at (γ, 1), step t = 1/L.</p>
<p>Step 1: ∇f = (x<sub>1</sub>, γx<sub>2</sub>), so the update is x<sub>1</sub> ← (1 − 1/γ)x<sub>1</sub>, x<sub>2</sub> ← (1 − γ/γ)x<sub>2</sub> = 0. Step 2: the x<sub>2</sub> coordinate is solved in one step, but x<sub>1</sub> shrinks only by the factor 1 − 1/κ per step. Step 3: to reduce the error by 10<sup>−6</sup> we need (1 − 1/κ)<sup>k</sup> ≤ 10<sup>−6</sup>, i.e. k ≥ log(10<sup>−6</sup>)/log(1 − 1/κ) ≈ 13.8κ. Step 4: with t = 2.1/L the x<sub>2</sub> coordinate is multiplied by 1 − 2.1 = −1.1 each step and blows up.</p></div>
<pre><code class="language-python">import numpy as np
np.seterr(over='ignore', invalid='ignore')   # the divergent runs overflow on purpose

def gd(gamma, t, iters=5000):
    # f(x) = 0.5 (x1^2 + gamma x2^2): condition number = gamma (for gamma &gt;= 1)
    x = np.array([gamma, 1.0]); f = lambda x: 0.5 * (x[0]**2 + gamma * x[1]**2)
    for k in range(iters):
        g = np.array([x[0], gamma * x[1]])
        if f(x) &lt; 1e-8: return k
        x = x - t * g
    return None

for gamma in [1, 10, 100]:
    L = gamma                       # largest Hessian eigenvalue
    print(f"kappa = {gamma:3d}: step 1/L -&gt; {gd(gamma, 1 / L):3d} iterations to f &lt; 1e-8;"
          f"  step 2.1/L -&gt; f blows up: {gd(gamma, 2.1 / L) is None}")

# the classic rate: with t = 1/L each step multiplies the error by at most (1 - 1/kappa)
for kappa in [10, 100, 1000]:
    print(f"kappa = {kappa:4d}: (1 - 1/kappa)^k &lt;= 1e-6 needs k &gt;= {int(np.ceil(np.log(1e-6) / np.log(1 - 1 / kappa)))}")</code></pre>
<div class="out">kappa =   1: step 1/L -&gt;   1 iterations to f &lt; 1e-8;  step 2.1/L -&gt; f blows up: True
kappa =  10: step 1/L -&gt; 106 iterations to f &lt; 1e-8;  step 2.1/L -&gt; f blows up: True
kappa = 100: step 1/L -&gt; 1341 iterations to f &lt; 1e-8;  step 2.1/L -&gt; f blows up: True
kappa =   10: (1 - 1/kappa)^k &lt;= 1e-6 needs k &gt;= 132
kappa =  100: (1 - 1/kappa)^k &lt;= 1e-6 needs k &gt;= 1375
kappa = 1000: (1 - 1/kappa)^k &lt;= 1e-6 needs k &gt;= 13809</div>
<p>Iterations grow in proportion to κ: 1 → 106 → 1341. The bound (1 − 1/κ)<sup>k</sup> is a worst-case estimate; the measured counts are of the same order. Every run with t = 2.1/L diverges.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Choosing the learning rate by habit (0.01) instead of from L: a step that is fine for one problem diverges on another with larger curvature.</li><li>Stopping on a small change in f rather than on ‖∇f‖ — on flat valleys f changes slowly long before the optimum.</li><li>Forgetting that rescaling variables changes κ and hence the speed of gradient descent (but not the solution).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Gradient descent: x ← x − t∇f(x); converges for 0 &lt; t &lt; 2/L.</li><li>L = max curvature, μ = min curvature, κ = L/μ.</li><li>Rate: O(1/k) for convex L-smooth; (1 − μ/L)<sup>k</sup> for strongly convex.</li><li>Iterations ∝ κ: badly scaled problems are slow — preconditioning and Newton fix this.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://web.stanford.edu/class/ee364a/lectures/unconstrained.pdf" target="_blank" rel="noopener">Stanford EE364a — Lecture 9: Unconstrained minimization (slides)</a></li><li><a href="https://www.stat.cmu.edu/~ryantibs/convexopt/lectures/grad-descent.pdf" target="_blank" rel="noopener">CMU 10-725 — Gradient descent (convergence analysis)</a></li><li><a href="https://www.youtube.com/watch?v=IHZwWFHWa-w" target="_blank" rel="noopener">3Blue1Brown — Gradient descent, how neural networks learn (video)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>For f(x) = 2x<sub>1</sub><sup>2</sup> + 8x<sub>2</sub><sup>2</sup>, find L, μ, κ and the largest stable fixed step.</li><li>Do one gradient-descent step with t = 1/L from x = (1, 1) on that f.</li><li>Roughly how many iterations does κ = 50 need to gain six digits of accuracy?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Hessian diag(4, 16): L = 16, μ = 4, κ = 4; stable for t &lt; 2/16 = 0.125. 2) ∇f = (4, 16); x ← (1, 1) − (1/16)(4, 16) = (0.75, 0). 3) About 13.8·50 ≈ 690 iterations.</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 7 · Bài 7.1</span>
<h2>Gradient descent và số điều kiện</h2>
<p class="lead">CVXPY giấu thuật toán đi. Từ giờ ta mở hộp: máy tính thật sự cực tiểu một hàm lồi thế nào? Câu trả lời đơn giản nhất — đi xuống dốc theo −∇f — cũng là nền của mọi bộ tối ưu học sâu.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mô tả phương pháp giảm tổng quát và bước cập nhật gradient descent.</li><li>Định nghĩa L-trơn và μ-lồi mạnh, hiểu chúng như cận của độ cong.</li><li>Phát biểu tốc độ hội tụ của gradient descent và vai trò của số điều kiện κ = L/μ.</li><li>Giải thích vì sao bước quá lớn làm gradient descent phân kỳ.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Với bài cực tiểu không ràng buộc của hàm lồi khả vi f, tối ưu nghĩa là ∇f(x*) = 0 (Bài 3.1). Trừ hàm toàn phương, ta không giải được phương trình này dạng đóng, nên ta lặp: x<sup>(k+1)</sup> = x<sup>(k)</sup> + t<sup>(k)</sup>Δx<sup>(k)</sup>. Δx là <strong>hướng giảm</strong> nếu ∇f(x)<sup>T</sup>Δx &lt; 0 — khi đó một bước đủ nhỏ làm f giảm. Lựa chọn dốc nhất với chuẩn Euclid là Δx = −∇f(x):</p>
<div class="formula"><span class="lbl">Gradient descent (Boyd §9.3)</span>x<sup>(k+1)</sup> = x<sup>(k)</sup> − t ∇f(x<sup>(k)</sup>)      dừng khi ‖∇f(x)‖<sub>2</sub> ≤ ε</div>
<p><strong>Cận độ cong.</strong> f là <strong>L-trơn</strong> nếu ∇<sup>2</sup>f(x) ⪯ LI (độ cong tối đa L) và <strong>μ-lồi mạnh</strong> nếu ∇<sup>2</sup>f(x) ⪰ μI với μ &gt; 0 (độ cong ít nhất μ). Với hàm toàn phương ½x<sup>T</sup>Px, L và μ là trị riêng lớn nhất và nhỏ nhất của P. Tỉ số κ = L/μ là <strong>số điều kiện</strong>: về hình học, các tập mức (ellipse) dẹt cỡ nào.</p>
<div class="formula"><span class="lbl">Hội tụ với bước cố định t = 1/L</span>lồi, L-trơn:  f(x<sup>(k)</sup>) − p* ≤ L‖x<sup>(0)</sup> − x*‖<sup>2</sup>/(2k)      (dưới tuyến tính, O(1/k))<br>μ-lồi mạnh:  f(x<sup>(k)</sup>) − p* ≤ (1 − μ/L)<sup>k</sup> (f(x<sup>(0)</sup>) − p*)      (tuyến tính)</div>
<p>Hội tụ “tuyến tính” nghĩa là số chữ số đúng tăng tuyến tính theo k, với tốc độ do κ quyết định: khoảng κ·log(1/ε) vòng lặp. Trên cái bát tròn (κ = 1) một bước là tới đáy; trên thung lũng hẹp (κ = 1000) gradient descent đi zig-zag qua lại và cần hàng nghìn bước. Đó chính là lý do ta chuẩn hoá đặc trưng trong học máy: để giảm κ. Và bước phải đủ nhỏ: trên hàm toàn phương, gradient descent hội tụ khi và chỉ khi 0 &lt; t &lt; 2/L; quá ngưỡng đó, sai số theo hướng dốc nhất bị nhân với |1 − tL| &gt; 1 ở mỗi bước.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Bài toán.</b> f(x) = ½(x<sub>1</sub><sup>2</sup> + γx<sub>2</sub><sup>2</sup>), nên μ = 1, L = γ, κ = γ. Xuất phát từ (γ, 1), bước t = 1/L.</p>
<p>Bước 1: ∇f = (x<sub>1</sub>, γx<sub>2</sub>), nên cập nhật là x<sub>1</sub> ← (1 − 1/γ)x<sub>1</sub>, x<sub>2</sub> ← (1 − γ/γ)x<sub>2</sub> = 0. Bước 2: toạ độ x<sub>2</sub> được giải trong một bước, còn x<sub>1</sub> chỉ co theo hệ số 1 − 1/κ mỗi bước. Bước 3: muốn giảm sai số 10<sup>−6</sup> lần cần (1 − 1/κ)<sup>k</sup> ≤ 10<sup>−6</sup>, tức k ≥ log(10<sup>−6</sup>)/log(1 − 1/κ) ≈ 13,8κ. Bước 4: với t = 2,1/L, toạ độ x<sub>2</sub> bị nhân với 1 − 2,1 = −1,1 mỗi bước và bùng nổ.</p></div>
<pre><code class="language-python">import numpy as np
np.seterr(over='ignore', invalid='ignore')   # the divergent runs overflow on purpose

def gd(gamma, t, iters=5000):
    # f(x) = 0.5 (x1^2 + gamma x2^2): condition number = gamma (for gamma &gt;= 1)
    x = np.array([gamma, 1.0]); f = lambda x: 0.5 * (x[0]**2 + gamma * x[1]**2)
    for k in range(iters):
        g = np.array([x[0], gamma * x[1]])
        if f(x) &lt; 1e-8: return k
        x = x - t * g
    return None

for gamma in [1, 10, 100]:
    L = gamma                       # largest Hessian eigenvalue
    print(f"kappa = {gamma:3d}: step 1/L -&gt; {gd(gamma, 1 / L):3d} iterations to f &lt; 1e-8;"
          f"  step 2.1/L -&gt; f blows up: {gd(gamma, 2.1 / L) is None}")

# the classic rate: with t = 1/L each step multiplies the error by at most (1 - 1/kappa)
for kappa in [10, 100, 1000]:
    print(f"kappa = {kappa:4d}: (1 - 1/kappa)^k &lt;= 1e-6 needs k &gt;= {int(np.ceil(np.log(1e-6) / np.log(1 - 1 / kappa)))}")</code></pre>
<div class="out">kappa =   1: step 1/L -&gt;   1 iterations to f &lt; 1e-8;  step 2.1/L -&gt; f blows up: True
kappa =  10: step 1/L -&gt; 106 iterations to f &lt; 1e-8;  step 2.1/L -&gt; f blows up: True
kappa = 100: step 1/L -&gt; 1341 iterations to f &lt; 1e-8;  step 2.1/L -&gt; f blows up: True
kappa =   10: (1 - 1/kappa)^k &lt;= 1e-6 needs k &gt;= 132
kappa =  100: (1 - 1/kappa)^k &lt;= 1e-6 needs k &gt;= 1375
kappa = 1000: (1 - 1/kappa)^k &lt;= 1e-6 needs k &gt;= 13809</div>
<p>Số vòng lặp tăng tỉ lệ với κ: 1 → 106 → 1341. Cận (1 − 1/κ)<sup>k</sup> là ước lượng trường hợp xấu nhất; số đo thực cùng bậc. Mọi lần chạy với t = 2,1/L đều phân kỳ.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chọn learning rate theo thói quen (0,01) thay vì từ L: bước ổn cho bài này phân kỳ ở bài khác có độ cong lớn hơn.</li><li>Dừng khi f đổi ít thay vì dựa vào ‖∇f‖ — trên thung lũng phẳng f đổi chậm từ rất lâu trước khi tới tối ưu.</li><li>Quên rằng đổi thang đo biến làm đổi κ và do đó đổi tốc độ gradient descent (nhưng không đổi nghiệm).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Gradient descent: x ← x − t∇f(x); hội tụ với 0 &lt; t &lt; 2/L.</li><li>L = độ cong lớn nhất, μ = độ cong nhỏ nhất, κ = L/μ.</li><li>Tốc độ: O(1/k) với hàm lồi L-trơn; (1 − μ/L)<sup>k</sup> với hàm lồi mạnh.</li><li>Số vòng lặp ∝ κ: bài lệch thang đo thì chậm — tiền điều kiện và Newton khắc phục.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://web.stanford.edu/class/ee364a/lectures/unconstrained.pdf" target="_blank" rel="noopener">Stanford EE364a — Bài 9: Cực tiểu không ràng buộc (slide)</a></li><li><a href="https://www.stat.cmu.edu/~ryantibs/convexopt/lectures/grad-descent.pdf" target="_blank" rel="noopener">CMU 10-725 — Gradient descent (phân tích hội tụ)</a></li><li><a href="https://www.youtube.com/watch?v=IHZwWFHWa-w" target="_blank" rel="noopener">3Blue1Brown — Gradient descent, how neural networks learn (video)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Với f(x) = 2x<sub>1</sub><sup>2</sup> + 8x<sub>2</sub><sup>2</sup>, tìm L, μ, κ và bước cố định lớn nhất còn ổn định.</li><li>Làm một bước gradient descent với t = 1/L từ x = (1, 1) trên hàm đó.</li><li>Với κ = 50, cần khoảng bao nhiêu vòng lặp để được thêm sáu chữ số chính xác?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Hessian diag(4, 16): L = 16, μ = 4, κ = 4; ổn định khi t &lt; 2/16 = 0,125. 2) ∇f = (4, 16); x ← (1, 1) − (1/16)(4, 16) = (0,75; 0). 3) Khoảng 13,8·50 ≈ 690 vòng lặp.</p></div>`);

const c72 = L('cvo201-ts-7-2',
  '7.2 — Line search: exact and backtracking (Armijo) step sizes|||7.2 — Tìm bước: tìm bước chính xác và backtracking (Armijo)',
  'Tìm bước chính xác vs backtracking, điều kiện Armijo f(x + tΔx) ≤ f(x) + αt∇fᵀΔx, tham số α, β, điều kiện Wolfe; cài đặt gradient descent với backtracking trên ví dụ (9.20) của Boyd (Boyd §9.2).',
  `<span class="eyebrow">CVO201 · Chapter 7 · Lesson 7.2</span>
<h2>Line search: choosing the step size</h2>
<p class="lead">A fixed step 1/L needs L, which we rarely know, and it is often too cautious far from the optimum. A line search chooses the step adaptively at each iteration, using only function values.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain exact line search and why it is rarely used.</li><li>State the Armijo sufficient-decrease condition and the backtracking algorithm.</li><li>Implement gradient descent with backtracking and compare it with a fixed step.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Exact line search</strong> chooses t = argmin<sub>s ≥ 0</sub> f(x + sΔx). It is a one-dimensional problem, but solving it accurately at every iteration costs many function evaluations and buys little; it is used when the 1-D minimum has a formula (e.g. quadratics).</p>
<p><strong>Backtracking</strong> only asks for a step that decreases f “enough”. Start with t = 1 and shrink t ← βt until</p>
<div class="formula"><span class="lbl">Armijo condition (Boyd §9.2), 0 &lt; α &lt; 0.5, 0 &lt; β &lt; 1</span>f(x + tΔx) ≤ f(x) + α t ∇f(x)<sup>T</sup>Δx</div>
<p>The right-hand side is the tangent line, rotated upward by the factor α (∇f<sup>T</sup>Δx &lt; 0 for a descent direction). Because the true f lies above its tangent and curves upward, for small t the condition always holds, so the loop terminates. Typical values: α between 0.01 and 0.3, β between 0.1 and 0.8. For an L-smooth function backtracking always accepts a step t ≥ β/L, so we get the convergence rate of Lesson 7.1 without knowing L — and often much larger steps far from the optimum.</p>
<p>Quasi-Newton codes use the stronger <strong>Wolfe conditions</strong>, which add a curvature condition to rule out steps that are too short. SciPy's <code>minimize</code> does this internally; deep-learning optimizers instead use schedules (Lesson 9.1) because exact function values are too expensive on huge datasets.</p>
<h3>✍️ Worked example — Boyd's example (9.20)</h3>
<div class="callout"><p><b>Problem.</b> f(x) = e<sup>x<sub>1</sub> + 3x<sub>2</sub> − 0.1</sup> + e<sup>x<sub>1</sub> − 3x<sub>2</sub> − 0.1</sup> + e<sup>−x<sub>1</sub> − 0.1</sup>, start (−1, 1).</p>
<p>Step 1 (optimum by hand): by symmetry in x<sub>2</sub> the minimiser has x<sub>2</sub> = 0. Then f = 2e<sup>x<sub>1</sub> − 0.1</sup> + e<sup>−x<sub>1</sub> − 0.1</sup>, and f′ = 0 gives e<sup>2x<sub>1</sub></sup> = 1/2, x<sub>1</sub>* = −ln 2/2 ≈ −0.3466, p* = 2√2·e<sup>−0.1</sup> ≈ 2.5593. Step 2: run gradient descent with t = 0.1 and with backtracking (α = 0.3, β = 0.7) until f − p* &lt; 10<sup>−10</sup>.</p></div>
<pre><code class="language-python">import numpy as np

# Boyd &amp; Vandenberghe example: f(x) = e^{x1+3x2-0.1} + e^{x1-3x2-0.1} + e^{-x1-0.1}
def f(x):
    return np.exp(x[0] + 3*x[1] - 0.1) + np.exp(x[0] - 3*x[1] - 0.1) + np.exp(-x[0] - 0.1)
def grad(x):
    a, b, c = np.exp(x[0] + 3*x[1] - 0.1), np.exp(x[0] - 3*x[1] - 0.1), np.exp(-x[0] - 0.1)
    return np.array([a + b - c, 3*a - 3*b])

p_star = f(np.array([-np.log(2) / 2, 0.0]))     # optimum is at x* = (-ln2/2, 0)

def backtracking(x, g, alpha=0.3, beta=0.7):
    t = 1.0
    while f(x - t * g) &gt; f(x) - alpha * t * g @ g:   # Armijo condition
        t *= beta
    return t

for rule in ["fixed t=0.1", "backtracking"]:
    x = np.array([-1.0, 1.0])
    for k in range(1, 1001):
        g = grad(x)
        t = 0.1 if rule.startswith("fixed") else backtracking(x, g)
        x = x - t * g
        if f(x) - p_star &lt; 1e-10: break
    print(f"{rule:13s}: {k:4d} iterations, x = {x.round(6)}, f - p* = {f(x) - p_star:.1e}")
print("p* =", round(p_star, 6), " at x* = (-ln2/2, 0) =", (-np.log(2) / 2).round(6))</code></pre>
<div class="out">fixed t=0.1  :   42 iterations, x = [-0.346581 -0.      ], f - p* = 7.0e-11
backtracking :   22 iterations, x = [-3.46581e-01 -2.00000e-06], f - p* = 9.1e-11
p* = 2.559267  at x* = (-ln2/2, 0) = -0.346574</div>
<p>Backtracking halves the iteration count here without any knowledge of L. Both runs end at the hand-computed optimum (the tiny x<sub>2</sub> = −2·10<sup>−6</sup> is within the tolerance). Note the cost: each backtracking iteration may evaluate f several times.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Choosing α ≥ 0.5: then the condition can reject good steps even on a quadratic.</li><li>Forgetting the domain: for functions such as −log, x + tΔx may leave the domain — backtrack until it is inside first (we do this in Lesson 8.2).</li><li>Starting each search from a tiny t: the point of backtracking is to try the full step first.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Exact line search: minimise along the ray; expensive, rarely worth it.</li><li>Backtracking: shrink t by β until f(x + tΔx) ≤ f(x) + αt∇f<sup>T</sup>Δx.</li><li>It needs no L and guarantees sufficient decrease; Wolfe conditions add a curvature test.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Backtracking_line_search" target="_blank" rel="noopener">Wikipedia — Backtracking line search</a></li><li><a href="https://en.wikipedia.org/wiki/Wolfe_conditions" target="_blank" rel="noopener">Wikipedia — Wolfe conditions</a></li><li><a href="https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf" target="_blank" rel="noopener">Boyd &amp; Vandenberghe — §9.2 Descent methods and §9.3 gradient descent examples (PDF)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>f(x) = x<sup>2</sup>, x = 1, Δx = −f′(1) = −2, α = 0.25, β = 0.5. Which t does backtracking accept?</li><li>For a quadratic f = ½x<sup>T</sup>Px + q<sup>T</sup>x, derive the exact line-search step along Δx = −g.</li><li>Why must α be less than 1?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) t = 1: f(1 − 2) = 1 &gt; 1 + 0.25·1·(−4) = 0, reject; t = 0.5: f(0) = 0 ≤ 1 − 0.5 = 0.5, accept. 2) t = g<sup>T</sup>g / (g<sup>T</sup>Pg). 3) With α = 1 the condition demands the tangent-line decrease, which a convex f never achieves for t &gt; 0 unless it is linear.</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 7 · Bài 7.2</span>
<h2>Tìm bước: chọn độ dài bước</h2>
<p class="lead">Bước cố định 1/L cần biết L, điều ta hiếm khi biết, và thường quá dè dặt khi còn xa tối ưu. Tìm bước chọn độ dài bước thích nghi ở mỗi vòng, chỉ dùng giá trị hàm.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích tìm bước chính xác và vì sao ít dùng.</li><li>Phát biểu điều kiện giảm đủ Armijo và thuật toán backtracking.</li><li>Cài đặt gradient descent với backtracking và so với bước cố định.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Tìm bước chính xác</strong> chọn t = argmin<sub>s ≥ 0</sub> f(x + sΔx). Đó là bài một chiều, nhưng giải chính xác ở mỗi vòng tốn nhiều lần tính hàm mà lợi chẳng bao nhiêu; chỉ dùng khi cực tiểu một chiều có công thức (vd hàm toàn phương).</p>
<p><strong>Backtracking</strong> chỉ đòi một bước làm f giảm “đủ”. Bắt đầu với t = 1 và co t ← βt cho tới khi</p>
<div class="formula"><span class="lbl">Điều kiện Armijo (Boyd §9.2), 0 &lt; α &lt; 0,5, 0 &lt; β &lt; 1</span>f(x + tΔx) ≤ f(x) + α t ∇f(x)<sup>T</sup>Δx</div>
<p>Vế phải là đường tiếp tuyến được xoay lên theo hệ số α (∇f<sup>T</sup>Δx &lt; 0 với hướng giảm). Vì f thật nằm trên tiếp tuyến và cong lên, với t nhỏ điều kiện luôn đúng, nên vòng lặp kết thúc. Giá trị thường dùng: α từ 0,01 đến 0,3, β từ 0,1 đến 0,8. Với hàm L-trơn, backtracking luôn nhận bước t ≥ β/L, nên ta có tốc độ hội tụ như Bài 7.1 mà không cần biết L — và thường bước dài hơn nhiều khi còn xa tối ưu.</p>
<p>Mã tựa Newton dùng <strong>điều kiện Wolfe</strong> mạnh hơn, thêm điều kiện độ cong để loại bước quá ngắn. <code>minimize</code> của SciPy làm việc này bên trong; còn bộ tối ưu học sâu dùng lịch learning rate (Bài 9.1) vì tính giá trị hàm chính xác trên tập dữ liệu khổng lồ quá đắt.</p>
<h3>✍️ Ví dụ giải từng bước — ví dụ (9.20) của Boyd</h3>
<div class="callout"><p><b>Bài toán.</b> f(x) = e<sup>x<sub>1</sub> + 3x<sub>2</sub> − 0,1</sup> + e<sup>x<sub>1</sub> − 3x<sub>2</sub> − 0,1</sup> + e<sup>−x<sub>1</sub> − 0,1</sup>, xuất phát (−1, 1).</p>
<p>Bước 1 (tối ưu bằng tay): do đối xứng theo x<sub>2</sub>, điểm cực tiểu có x<sub>2</sub> = 0. Khi đó f = 2e<sup>x<sub>1</sub> − 0,1</sup> + e<sup>−x<sub>1</sub> − 0,1</sup>, và f′ = 0 cho e<sup>2x<sub>1</sub></sup> = 1/2, x<sub>1</sub>* = −ln 2/2 ≈ −0,3466, p* = 2√2·e<sup>−0,1</sup> ≈ 2,5593. Bước 2: chạy gradient descent với t = 0,1 và với backtracking (α = 0,3, β = 0,7) tới khi f − p* &lt; 10<sup>−10</sup>.</p></div>
<pre><code class="language-python">import numpy as np

# Boyd &amp; Vandenberghe example: f(x) = e^{x1+3x2-0.1} + e^{x1-3x2-0.1} + e^{-x1-0.1}
def f(x):
    return np.exp(x[0] + 3*x[1] - 0.1) + np.exp(x[0] - 3*x[1] - 0.1) + np.exp(-x[0] - 0.1)
def grad(x):
    a, b, c = np.exp(x[0] + 3*x[1] - 0.1), np.exp(x[0] - 3*x[1] - 0.1), np.exp(-x[0] - 0.1)
    return np.array([a + b - c, 3*a - 3*b])

p_star = f(np.array([-np.log(2) / 2, 0.0]))     # optimum is at x* = (-ln2/2, 0)

def backtracking(x, g, alpha=0.3, beta=0.7):
    t = 1.0
    while f(x - t * g) &gt; f(x) - alpha * t * g @ g:   # Armijo condition
        t *= beta
    return t

for rule in ["fixed t=0.1", "backtracking"]:
    x = np.array([-1.0, 1.0])
    for k in range(1, 1001):
        g = grad(x)
        t = 0.1 if rule.startswith("fixed") else backtracking(x, g)
        x = x - t * g
        if f(x) - p_star &lt; 1e-10: break
    print(f"{rule:13s}: {k:4d} iterations, x = {x.round(6)}, f - p* = {f(x) - p_star:.1e}")
print("p* =", round(p_star, 6), " at x* = (-ln2/2, 0) =", (-np.log(2) / 2).round(6))</code></pre>
<div class="out">fixed t=0.1  :   42 iterations, x = [-0.346581 -0.      ], f - p* = 7.0e-11
backtracking :   22 iterations, x = [-3.46581e-01 -2.00000e-06], f - p* = 9.1e-11
p* = 2.559267  at x* = (-ln2/2, 0) = -0.346574</div>
<p>Backtracking giảm một nửa số vòng lặp ở đây mà không cần biết L. Cả hai lần chạy dừng ở đúng tối ưu tính tay (x<sub>2</sub> = −2·10<sup>−6</sup> rất nhỏ nằm trong sai số). Lưu ý chi phí: mỗi vòng backtracking có thể tính f vài lần.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chọn α ≥ 0,5: khi đó điều kiện có thể loại bước tốt kể cả trên hàm toàn phương.</li><li>Quên miền xác định: với hàm như −log, x + tΔx có thể rời khỏi miền — hãy lùi bước tới khi nằm trong miền trước (ta làm thế ở Bài 8.2).</li><li>Bắt đầu mỗi lần tìm từ t rất nhỏ: ý nghĩa của backtracking là thử bước đầy đủ trước.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tìm bước chính xác: cực tiểu dọc tia; đắt, ít đáng dùng.</li><li>Backtracking: co t theo β tới khi f(x + tΔx) ≤ f(x) + αt∇f<sup>T</sup>Δx.</li><li>Không cần L và bảo đảm giảm đủ; điều kiện Wolfe thêm phép kiểm độ cong.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Backtracking_line_search" target="_blank" rel="noopener">Wikipedia — Backtracking line search</a></li><li><a href="https://en.wikipedia.org/wiki/Wolfe_conditions" target="_blank" rel="noopener">Wikipedia — Wolfe conditions</a></li><li><a href="https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf" target="_blank" rel="noopener">Boyd &amp; Vandenberghe — §9.2 Phương pháp giảm và §9.3 ví dụ gradient descent (PDF)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>f(x) = x<sup>2</sup>, x = 1, Δx = −f′(1) = −2, α = 0,25, β = 0,5. Backtracking nhận t nào?</li><li>Với hàm toàn phương f = ½x<sup>T</sup>Px + q<sup>T</sup>x, suy ra bước tìm chính xác dọc Δx = −g.</li><li>Vì sao α phải nhỏ hơn 1?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) t = 1: f(1 − 2) = 1 &gt; 1 + 0,25·1·(−4) = 0, loại; t = 0,5: f(0) = 0 ≤ 1 − 0,5 = 0,5, nhận. 2) t = g<sup>T</sup>g / (g<sup>T</sup>Pg). 3) Với α = 1 điều kiện đòi mức giảm bằng tiếp tuyến, điều mà hàm lồi không bao giờ đạt với t &gt; 0 trừ khi nó tuyến tính.</p></div>`);

const c73 = L('cvo201-ts-7-3',
  '7.3 — Newton’s method: the Newton step, the Newton decrement and quadratic convergence|||7.3 — Phương pháp Newton: bước Newton, độ giảm Newton và hội tụ bậc hai',
  'Bước Newton Δx = −∇²f⁻¹∇f từ mô hình bậc hai, độ giảm Newton λ(x)² = ∇fᵀ∇²f⁻¹∇f làm tiêu chí dừng, Newton có backtracking, pha tắt dần và pha hội tụ bậc hai, bất biến affine (Boyd §9.5).',
  `<span class="eyebrow">CVO201 · Chapter 7 · Lesson 7.3</span>
<h2>Newton's method</h2>
<p class="lead">Gradient descent uses only the slope. Newton's method also uses the curvature: it jumps to the minimum of the local quadratic model. Near the optimum the number of correct digits doubles at every step.</p>
<h3>🎯 Objectives</h3>
<ul><li>Derive the Newton step from the second-order Taylor model.</li><li>Use the Newton decrement as a stopping criterion.</li><li>Describe the damped and the quadratically convergent phases.</li><li>Explain affine invariance and the cost per iteration.</li></ul>
<h3>📖 Lecture</h3>
<p>Around x, f(x + v) ≈ f(x) + ∇f(x)<sup>T</sup>v + ½v<sup>T</sup>∇<sup>2</sup>f(x)v (Lesson 1.2). If ∇<sup>2</sup>f(x) ≻ 0, this quadratic is minimised where its gradient vanishes: ∇f(x) + ∇<sup>2</sup>f(x)v = 0.</p>
<div class="formula"><span class="lbl">Newton step and decrement (Boyd §9.5)</span>Δx<sub>nt</sub> = −∇<sup>2</sup>f(x)<sup>−1</sup>∇f(x)      λ(x)<sup>2</sup> = ∇f(x)<sup>T</sup>∇<sup>2</sup>f(x)<sup>−1</sup>∇f(x) = −∇f(x)<sup>T</sup>Δx<sub>nt</sub><br>f(x) − inf<sub>v</sub> (quadratic model) = λ(x)<sup>2</sup>/2      stop when λ<sup>2</sup>/2 ≤ ε</div>
<p>The Newton step is a descent direction (∇f<sup>T</sup>Δx<sub>nt</sub> = −λ<sup>2</sup> &lt; 0). The <strong>Newton decrement</strong> λ<sup>2</sup>/2 estimates the remaining gap f(x) − p*, and it is the natural stopping test: unlike ‖∇f‖ it does not depend on how the variables are scaled.</p>
<p><strong>Damped Newton.</strong> Far from x*, the quadratic model can be poor, so we combine the Newton direction with backtracking (Lesson 7.2). The analysis (Boyd §9.5.3) shows two phases: a <strong>damped phase</strong> where t &lt; 1 and f decreases by at least a fixed amount per step, and a <strong>pure Newton phase</strong> where t = 1 is always accepted and the error satisfies e<sub>k+1</sub> ≤ c·e<sub>k</sub><sup>2</sup> — <strong>quadratic convergence</strong>. In practice the second phase takes about 5–6 iterations from “roughly right” to machine precision.</p>
<p><strong>Affine invariance.</strong> If we change variables x = Ty, Newton's iterates transform exactly the same way, so the method is insensitive to the condition number κ that ruins gradient descent. <strong>The price:</strong> each iteration forms the n × n Hessian and solves a linear system, about n<sup>3</sup>/3 flops with a Cholesky factorisation. For n up to a few thousand (or with sparse structure) this is cheap; for millions of parameters it is impossible, which is why ML uses first-order methods (Chapter 9).</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Problem.</b> The same f as Lesson 7.2, start (−1, 1). With a = e<sup>x<sub>1</sub> + 3x<sub>2</sub> − 0.1</sup>, b = e<sup>x<sub>1</sub> − 3x<sub>2</sub> − 0.1</sup>, c = e<sup>−x<sub>1</sub> − 0.1</sup>:</p>
<p>Step 1: ∇f = (a + b − c, 3a − 3b). Step 2: ∇<sup>2</sup>f = [[a + b + c, 3a − 3b], [3a − 3b, 9a + 9b]]. Step 3: each iteration solves ∇<sup>2</sup>f Δx = −∇f, computes λ<sup>2</sup> = −∇f<sup>T</sup>Δx, stops if λ<sup>2</sup>/2 &lt; 10<sup>−12</sup>, otherwise backtracks along Δx. Step 4: watch the exponent of f − p*: it should roughly double each iteration near the end.</p></div>
<pre><code class="language-python">import numpy as np

def f(x):
    return np.exp(x[0] + 3*x[1] - 0.1) + np.exp(x[0] - 3*x[1] - 0.1) + np.exp(-x[0] - 0.1)
def grad(x):
    a, b, c = np.exp(x[0] + 3*x[1] - 0.1), np.exp(x[0] - 3*x[1] - 0.1), np.exp(-x[0] - 0.1)
    return np.array([a + b - c, 3*a - 3*b])
def hess(x):
    a, b, c = np.exp(x[0] + 3*x[1] - 0.1), np.exp(x[0] - 3*x[1] - 0.1), np.exp(-x[0] - 0.1)
    return np.array([[a + b + c, 3*a - 3*b], [3*a - 3*b, 9*a + 9*b]])

p_star = f(np.array([-np.log(2) / 2, 0.0]))
x = np.array([-1.0, 1.0])
print(" k   f(x) - p*        lambda^2/2 (Newton decrement)   step t")
for k in range(8):
    g, H = grad(x), hess(x)
    dx = -np.linalg.solve(H, g)              # Newton step
    lam2 = -g @ dx                           # lambda(x)^2 = g^T H^{-1} g
    print(f"{k:2d}   {f(x) - p_star:.3e}        {lam2 / 2:.3e}", end="")
    if lam2 / 2 &lt; 1e-12: print("   stop"); break
    t = 1.0
    while f(x + t * dx) &gt; f(x) + 0.3 * t * g @ dx:   # backtracking on the Newton direction
        t *= 0.7
    print(f"                    {t:.3f}")
    x = x + t * dx</code></pre>
<div class="out"> k   f(x) - p*        lambda^2/2 (Newton decrement)   step t
 0   6.603e+00        4.452e+00                    1.000
 1   1.175e+00        8.626e-01                    1.000
 2   1.574e-01        1.386e-01                    1.000
 3   4.777e-03        4.670e-03                    1.000
 4   5.615e-06        5.611e-06                    1.000
 5   7.863e-12        7.863e-12                    1.000
 6   0.000e+00        1.564e-23   stop</div>
<p>From iteration 3 on, the error goes 4.8·10<sup>−3</sup> → 5.6·10<sup>−6</sup> → 7.9·10<sup>−12</sup> → 0: the exponent doubles — quadratic convergence. The Newton decrement tracks f − p* almost exactly, and the full step t = 1 was accepted every time. Gradient descent needed 22–42 iterations for 10<sup>−10</sup>; Newton needs 6.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Computing <code>inv(H) @ g</code>: solve the system with <code>np.linalg.solve</code> (or Cholesky) instead.</li><li>Using pure Newton (t = 1 always) far from the optimum — it can diverge; always add a line search.</li><li>Applying Newton when the Hessian is singular or indefinite (nonconvex problems): the step may not be a descent direction.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Newton step Δx = −H<sup>−1</sup>g minimises the local quadratic model.</li><li>Stop when λ<sup>2</sup>/2 = −g<sup>T</sup>Δx/2 ≤ ε.</li><li>Damped phase then quadratic convergence: few iterations, affine invariant.</li><li>Cost O(n<sup>3</sup>) per iteration — great for moderate n, impossible for deep nets.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.stat.cmu.edu/~ryantibs/convexopt/lectures/newton.pdf" target="_blank" rel="noopener">CMU 10-725 — Newton&#39;s method</a></li><li><a href="https://en.wikipedia.org/wiki/Newton%27s_method_in_optimization" target="_blank" rel="noopener">Wikipedia — Newton&#39;s method in optimization</a></li><li><a href="https://web.stanford.edu/class/ee364a/lectures/unconstrained.pdf" target="_blank" rel="noopener">Stanford EE364a — Unconstrained minimization: Newton&#39;s method (slides)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Apply one Newton step to f(x) = ½x<sup>T</sup>Px − q<sup>T</sup>x (P ≻ 0) from any x. Where do you land?</li><li>f(x) = x − log x on x &gt; 0. Do two Newton steps from x = 0.5.</li><li>Why is λ(x) unchanged by a change of variables x = Ty?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Δx = −P<sup>−1</sup>(Px − q) ⇒ x + Δx = P<sup>−1</sup>q, the exact minimiser in one step. 2) f′ = 1 − 1/x, f″ = 1/x<sup>2</sup>, step −f′/f″ = x − x<sup>2</sup>; x: 0.5 → 0.75 → 0.9375 (error 0.5 → 0.25 → 0.0625: squared each time; x* = 1). 3) Gradient and Hessian transform as T<sup>T</sup>g and T<sup>T</sup>HT, so g<sup>T</sup>H<sup>−1</sup>g is the same number.</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 7 · Bài 7.3</span>
<h2>Phương pháp Newton</h2>
<p class="lead">Gradient descent chỉ dùng độ dốc. Phương pháp Newton dùng cả độ cong: nó nhảy tới cực tiểu của mô hình bậc hai địa phương. Gần tối ưu, số chữ số đúng tăng gấp đôi sau mỗi bước.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Suy ra bước Newton từ mô hình Taylor bậc hai.</li><li>Dùng độ giảm Newton làm tiêu chí dừng.</li><li>Mô tả pha tắt dần và pha hội tụ bậc hai.</li><li>Giải thích tính bất biến affine và chi phí mỗi vòng.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Quanh x, f(x + v) ≈ f(x) + ∇f(x)<sup>T</sup>v + ½v<sup>T</sup>∇<sup>2</sup>f(x)v (Bài 1.2). Nếu ∇<sup>2</sup>f(x) ≻ 0, hàm bậc hai này đạt cực tiểu nơi gradient của nó bằng 0: ∇f(x) + ∇<sup>2</sup>f(x)v = 0.</p>
<div class="formula"><span class="lbl">Bước và độ giảm Newton (Boyd §9.5)</span>Δx<sub>nt</sub> = −∇<sup>2</sup>f(x)<sup>−1</sup>∇f(x)      λ(x)<sup>2</sup> = ∇f(x)<sup>T</sup>∇<sup>2</sup>f(x)<sup>−1</sup>∇f(x) = −∇f(x)<sup>T</sup>Δx<sub>nt</sub><br>f(x) − inf<sub>v</sub> (mô hình bậc hai) = λ(x)<sup>2</sup>/2      dừng khi λ<sup>2</sup>/2 ≤ ε</div>
<p>Bước Newton là hướng giảm (∇f<sup>T</sup>Δx<sub>nt</sub> = −λ<sup>2</sup> &lt; 0). <strong>Độ giảm Newton</strong> λ<sup>2</sup>/2 ước lượng khoảng cách còn lại f(x) − p*, và là phép dừng tự nhiên: khác ‖∇f‖, nó không phụ thuộc cách co giãn biến.</p>
<p><strong>Newton tắt dần.</strong> Xa x*, mô hình bậc hai có thể kém, nên ta kết hợp hướng Newton với backtracking (Bài 7.2). Phân tích (Boyd §9.5.3) cho hai pha: <strong>pha tắt dần</strong> với t &lt; 1 và f giảm ít nhất một lượng cố định mỗi bước, và <strong>pha Newton thuần</strong> nơi t = 1 luôn được nhận và sai số thoả e<sub>k+1</sub> ≤ c·e<sub>k</sub><sup>2</sup> — <strong>hội tụ bậc hai</strong>. Thực tế pha thứ hai mất khoảng 5–6 vòng từ “gần đúng” tới độ chính xác máy.</p>
<p><strong>Bất biến affine.</strong> Nếu đổi biến x = Ty, các điểm lặp Newton biến đổi y hệt, nên phương pháp không nhạy với số điều kiện κ vốn làm hỏng gradient descent. <strong>Cái giá:</strong> mỗi vòng phải lập Hessian n × n và giải một hệ tuyến tính, khoảng n<sup>3</sup>/3 phép tính với phân tích Cholesky. Với n tới vài nghìn (hoặc có cấu trúc thưa) chi phí này rẻ; với hàng triệu tham số thì bất khả, vì thế học máy dùng phương pháp bậc một (Chương 9).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Bài toán.</b> Cùng f như Bài 7.2, xuất phát (−1, 1). Đặt a = e<sup>x<sub>1</sub> + 3x<sub>2</sub> − 0,1</sup>, b = e<sup>x<sub>1</sub> − 3x<sub>2</sub> − 0,1</sup>, c = e<sup>−x<sub>1</sub> − 0,1</sup>:</p>
<p>Bước 1: ∇f = (a + b − c, 3a − 3b). Bước 2: ∇<sup>2</sup>f = [[a + b + c, 3a − 3b], [3a − 3b, 9a + 9b]]. Bước 3: mỗi vòng giải ∇<sup>2</sup>f Δx = −∇f, tính λ<sup>2</sup> = −∇f<sup>T</sup>Δx, dừng nếu λ<sup>2</sup>/2 &lt; 10<sup>−12</sup>, ngược lại lùi bước dọc Δx. Bước 4: theo dõi số mũ của f − p*: gần cuối nó phải tăng gấp đôi mỗi vòng.</p></div>
<pre><code class="language-python">import numpy as np

def f(x):
    return np.exp(x[0] + 3*x[1] - 0.1) + np.exp(x[0] - 3*x[1] - 0.1) + np.exp(-x[0] - 0.1)
def grad(x):
    a, b, c = np.exp(x[0] + 3*x[1] - 0.1), np.exp(x[0] - 3*x[1] - 0.1), np.exp(-x[0] - 0.1)
    return np.array([a + b - c, 3*a - 3*b])
def hess(x):
    a, b, c = np.exp(x[0] + 3*x[1] - 0.1), np.exp(x[0] - 3*x[1] - 0.1), np.exp(-x[0] - 0.1)
    return np.array([[a + b + c, 3*a - 3*b], [3*a - 3*b, 9*a + 9*b]])

p_star = f(np.array([-np.log(2) / 2, 0.0]))
x = np.array([-1.0, 1.0])
print(" k   f(x) - p*        lambda^2/2 (Newton decrement)   step t")
for k in range(8):
    g, H = grad(x), hess(x)
    dx = -np.linalg.solve(H, g)              # Newton step
    lam2 = -g @ dx                           # lambda(x)^2 = g^T H^{-1} g
    print(f"{k:2d}   {f(x) - p_star:.3e}        {lam2 / 2:.3e}", end="")
    if lam2 / 2 &lt; 1e-12: print("   stop"); break
    t = 1.0
    while f(x + t * dx) &gt; f(x) + 0.3 * t * g @ dx:   # backtracking on the Newton direction
        t *= 0.7
    print(f"                    {t:.3f}")
    x = x + t * dx</code></pre>
<div class="out"> k   f(x) - p*        lambda^2/2 (Newton decrement)   step t
 0   6.603e+00        4.452e+00                    1.000
 1   1.175e+00        8.626e-01                    1.000
 2   1.574e-01        1.386e-01                    1.000
 3   4.777e-03        4.670e-03                    1.000
 4   5.615e-06        5.611e-06                    1.000
 5   7.863e-12        7.863e-12                    1.000
 6   0.000e+00        1.564e-23   stop</div>
<p>Từ vòng 3, sai số đi 4,8·10<sup>−3</sup> → 5,6·10<sup>−6</sup> → 7,9·10<sup>−12</sup> → 0: số mũ gấp đôi — hội tụ bậc hai. Độ giảm Newton bám sát f − p*, và bước đầy đủ t = 1 luôn được nhận. Gradient descent cần 22–42 vòng để đạt 10<sup>−10</sup>; Newton cần 6.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tính <code>inv(H) @ g</code>: hãy giải hệ bằng <code>np.linalg.solve</code> (hoặc Cholesky).</li><li>Dùng Newton thuần (luôn t = 1) khi còn xa tối ưu — có thể phân kỳ; luôn thêm tìm bước.</li><li>Dùng Newton khi Hessian suy biến hay không xác định dấu (bài không lồi): bước có thể không phải hướng giảm.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Bước Newton Δx = −H<sup>−1</sup>g cực tiểu mô hình bậc hai địa phương.</li><li>Dừng khi λ<sup>2</sup>/2 = −g<sup>T</sup>Δx/2 ≤ ε.</li><li>Pha tắt dần rồi hội tụ bậc hai: ít vòng, bất biến affine.</li><li>Chi phí O(n<sup>3</sup>) mỗi vòng — tuyệt vời với n vừa phải, bất khả với mạng sâu.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.stat.cmu.edu/~ryantibs/convexopt/lectures/newton.pdf" target="_blank" rel="noopener">CMU 10-725 — Newton&#39;s method</a></li><li><a href="https://en.wikipedia.org/wiki/Newton%27s_method_in_optimization" target="_blank" rel="noopener">Wikipedia — Newton&#39;s method in optimization</a></li><li><a href="https://web.stanford.edu/class/ee364a/lectures/unconstrained.pdf" target="_blank" rel="noopener">Stanford EE364a — Cực tiểu không ràng buộc: phương pháp Newton (slide)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Làm một bước Newton cho f(x) = ½x<sup>T</sup>Px − q<sup>T</sup>x (P ≻ 0) từ x bất kỳ. Bạn tới đâu?</li><li>f(x) = x − log x trên x &gt; 0. Làm hai bước Newton từ x = 0,5.</li><li>Vì sao λ(x) không đổi khi đổi biến x = Ty?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Δx = −P<sup>−1</sup>(Px − q) ⇒ x + Δx = P<sup>−1</sup>q, đúng điểm cực tiểu sau một bước. 2) f′ = 1 − 1/x, f″ = 1/x<sup>2</sup>, bước −f′/f″ = x − x<sup>2</sup>; x: 0,5 → 0,75 → 0,9375 (sai số 0,5 → 0,25 → 0,0625: bình phương mỗi lần; x* = 1). 3) Gradient và Hessian biến đổi thành T<sup>T</sup>g và T<sup>T</sup>HT, nên g<sup>T</sup>H<sup>−1</sup>g là cùng một số.</p></div>`);

const c74 = L('cvo201-ts-7-4',
  '7.4 — Quasi-Newton methods and choosing an unconstrained solver in practice|||7.4 — Phương pháp tựa Newton và chọn bộ giải không ràng buộc trong thực tế',
  'Ý tưởng BFGS/L-BFGS (xấp xỉ Hessian từ gradient), conjugate gradient, Newton-CG; so sánh số vòng lặp trên hồi quy logistic lệch thang đo với scipy.optimize.minimize; bảng chọn phương pháp (Nocedal & Wright Ch. 6–7).',
  `<span class="eyebrow">CVO201 · Chapter 7 · Lesson 7.4</span>
<h2>Quasi-Newton methods and choosing a solver</h2>
<p class="lead">Between cheap-but-slow gradient descent and fast-but-expensive Newton lies a family of methods that build curvature information from gradients alone. They are the default in SciPy and in many ML libraries.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain the secant idea behind BFGS and the memory-saving L-BFGS variant.</li><li>Know conjugate gradient and Newton-CG at the idea level.</li><li>Compare methods on a real convex ML loss with <code>scipy.optimize.minimize</code>.</li><li>Choose a sensible method from the problem size and structure.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>BFGS.</strong> Newton needs ∇<sup>2</sup>f. Quasi-Newton methods maintain an approximation B<sub>k</sub> ≈ ∇<sup>2</sup>f (or H<sub>k</sub> ≈ its inverse) and update it after each step using s<sub>k</sub> = x<sub>k+1</sub> − x<sub>k</sub> and y<sub>k</sub> = ∇f(x<sub>k+1</sub>) − ∇f(x<sub>k</sub>). The update is chosen so that the new matrix satisfies the <strong>secant equation</strong> B<sub>k+1</sub>s<sub>k</sub> = y<sub>k</sub> (the curvature seen along the last step is reproduced) while staying symmetric positive definite. BFGS uses a rank-two update costing O(n<sup>2</sup>) per iteration instead of Newton's O(n<sup>3</sup>), and converges <strong>superlinearly</strong> near the optimum (Nocedal &amp; Wright Ch. 6).</p>
<p><strong>L-BFGS</strong> stores only the last m pairs (s, y), typically m = 5–20, so memory is O(mn) — it handles millions of variables and is the workhorse for smooth convex ML losses (scikit-learn's default solver for logistic regression is L-BFGS).</p>
<p><strong>Conjugate gradient (CG)</strong> solves a quadratic in at most n steps by choosing directions that are conjugate with respect to the Hessian; its nonlinear version needs only gradients and O(n) memory. <strong>Newton-CG</strong> computes the Newton step approximately with CG, using only Hessian–vector products — Newton's speed without forming the matrix.</p>
<table><tr><th>Method</th><th>Needs</th><th>Cost / iteration</th><th>Typical use</th></tr>
<tr><td>Gradient descent / SGD</td><td>∇f</td><td>O(n)</td><td>huge n, deep learning</td></tr>
<tr><td>L-BFGS</td><td>∇f</td><td>O(mn)</td><td>smooth losses, n up to millions</td></tr>
<tr><td>BFGS</td><td>∇f</td><td>O(n<sup>2</sup>)</td><td>n up to a few thousand</td></tr>
<tr><td>Newton / Newton-CG</td><td>∇f, ∇<sup>2</sup>f (or Hv)</td><td>O(n<sup>3</sup>) / CG steps</td><td>high accuracy, moderate n, inside interior-point solvers</td></tr></table>
<h3>✍️ Worked example — regularised logistic regression with badly scaled features</h3>
<div class="callout"><p><b>Problem.</b> 500 samples, 20 features scaled from 0.2 to 5 (so the Hessian is ill-conditioned), regularised logistic loss with λ = 0.01 (strongly convex).</p>
<p>Step 1: write f, ∇f and ∇<sup>2</sup>f as in Lesson 6.4 (with <code>np.logaddexp</code> for stability). Step 2: call <code>minimize</code> with CG, BFGS, L-BFGS-B and Newton-CG to gradient tolerance 10<sup>−8</sup>. Step 3: run plain gradient descent with t = 1/L, where L = λ<sub>max</sub>(X<sup>T</sup>X)/(4n) + λ (the sigmoid derivative is at most 1/4).</p></div>
<pre><code class="language-python">import numpy as np
from scipy.optimize import minimize

rng = np.random.default_rng(10)
n, d = 500, 20
X = rng.normal(size=(n, d)) * np.linspace(0.2, 5, d)      # badly scaled features
w_true = rng.normal(size=d)
y = (rng.uniform(size=n) &lt; 1 / (1 + np.exp(-X @ w_true / 4))).astype(float)
lam = 1e-2

def f(w):          # regularised logistic loss (convex)
    z = X @ w
    return np.mean(np.logaddexp(0, z) - y * z) + lam / 2 * w @ w
def g(w):
    z = X @ w
    return X.T @ (1 / (1 + np.exp(-z)) - y) / n + lam * w
def H(w):
    s = 1 / (1 + np.exp(-X @ w))
    return (X.T * (s * (1 - s))) @ X / n + lam * np.eye(d)

w0 = np.zeros(d)
opts = {"CG": {"gtol": 1e-8}, "BFGS": {"gtol": 1e-8},
        "L-BFGS-B": {"gtol": 1e-8, "ftol": 1e-15}, "Newton-CG": {"xtol": 1e-10}}
for method, o in opts.items():
    r = minimize(f, w0, jac=g, hess=H if method == "Newton-CG" else None, method=method, options=o)
    print(f"{method:9s}: iterations = {r.nit:4d}  f* = {r.fun:.8f}  ||grad|| = {np.linalg.norm(g(r.x)):.1e}")

# plain gradient descent with step 1/L, L = largest eigenvalue bound of the Hessian
L = np.linalg.eigvalsh(X.T @ X / (4 * n)).max() + lam
w = w0.copy()
for k in range(1, 20001):
    w -= g(w) / L
    if np.linalg.norm(g(w)) &lt; 1e-6: break
print(f"GD 1/L   : iterations = {k:5d}  f  = {f(w):.8f}  ||grad|| = {np.linalg.norm(g(w)):.1e}")</code></pre>
<div class="out">CG       : iterations =  115  f* = 0.27610697  ||grad|| = 1.9e-08
BFGS     : iterations =   47  f* = 0.27610697  ||grad|| = 5.8e-09
L-BFGS-B : iterations =   74  f* = 0.27610697  ||grad|| = 2.1e-08
Newton-CG: iterations =   14  f* = 0.27610697  ||grad|| = 1.9e-08
GD 1/L   : iterations =  3594  f  = 0.27610697  ||grad|| = 1.0e-06</div>
<p>All methods reach the same f* = 0.27610697 (the problem is strongly convex, so the minimiser is unique). Newton-CG needs 14 iterations, BFGS 47, L-BFGS 74, CG 115 — and gradient descent 3594 to a looser tolerance. Iteration counts are not the whole story (a Newton iteration costs more), but on ill-conditioned problems curvature information wins clearly.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Calling <code>minimize</code> without <code>jac=</code>: SciPy then uses finite differences, costing n extra function evaluations per gradient.</li><li>Passing solver options that do not exist for that method (SciPy warns, e.g. <code>gtol</code> is not an option of Newton-CG, which uses <code>xtol</code>).</li><li>Using BFGS on a problem with 10<sup>6</sup> variables: its n × n matrix needs terabytes; use L-BFGS.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Quasi-Newton: build B ≈ ∇<sup>2</sup>f from gradient differences via the secant equation.</li><li>BFGS O(n<sup>2</sup>), L-BFGS O(mn): superlinear-ish speed with only gradients.</li><li>Newton-CG: Newton steps through Hessian–vector products.</li><li>Choose by size and accuracy: GD/SGD for huge n, L-BFGS for smooth medium–large, Newton for high accuracy.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.stat.cmu.edu/~ryantibs/convexopt/lectures/quasi-newton.pdf" target="_blank" rel="noopener">CMU 10-725 — Quasi-Newton methods</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.minimize.html" target="_blank" rel="noopener">SciPy — scipy.optimize.minimize (all methods and options)</a></li><li><a href="https://en.wikipedia.org/wiki/Broyden%E2%80%93Fletcher%E2%80%93Goldfarb%E2%80%93Shanno_algorithm" target="_blank" rel="noopener">Wikipedia — BFGS algorithm</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>In one dimension, the secant equation B<sub>k+1</sub>s<sub>k</sub> = y<sub>k</sub> determines B<sub>k+1</sub> completely. What is it, and which classical method do you get?</li><li>Estimate the memory for BFGS with n = 10<sup>5</sup> (double precision) and for L-BFGS with m = 10.</li><li>Why can L = λ<sub>max</sub>(X<sup>T</sup>X)/(4n) + λ be used as a smoothness constant for the logistic loss?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) B = (f′(x<sub>k+1</sub>) − f′(x<sub>k</sub>))/(x<sub>k+1</sub> − x<sub>k</sub>): the secant method for f′ = 0. 2) BFGS: 10<sup>10</sup> numbers × 8 bytes = 80 GB; L-BFGS: 2·10·10<sup>5</sup> × 8 bytes ≈ 16 MB. 3) The Hessian is X<sup>T</sup>DX/n + λI with D ⪯ ¼I, so it is ⪯ (λ<sub>max</sub>(X<sup>T</sup>X)/(4n) + λ)I.</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 7 · Bài 7.4</span>
<h2>Phương pháp tựa Newton và chọn bộ giải</h2>
<p class="lead">Giữa gradient descent rẻ mà chậm và Newton nhanh mà đắt là một họ phương pháp xây thông tin độ cong chỉ từ gradient. Chúng là mặc định trong SciPy và nhiều thư viện học máy.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích ý tưởng cát tuyến của BFGS và bản tiết kiệm bộ nhớ L-BFGS.</li><li>Biết conjugate gradient và Newton-CG ở mức ý tưởng.</li><li>So sánh các phương pháp trên một hàm mất mát học máy lồi thật bằng <code>scipy.optimize.minimize</code>.</li><li>Chọn phương pháp hợp lý theo kích thước và cấu trúc bài toán.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>BFGS.</strong> Newton cần ∇<sup>2</sup>f. Phương pháp tựa Newton giữ một xấp xỉ B<sub>k</sub> ≈ ∇<sup>2</sup>f (hoặc H<sub>k</sub> ≈ nghịch đảo của nó) và cập nhật sau mỗi bước bằng s<sub>k</sub> = x<sub>k+1</sub> − x<sub>k</sub> và y<sub>k</sub> = ∇f(x<sub>k+1</sub>) − ∇f(x<sub>k</sub>). Cập nhật được chọn để ma trận mới thoả <strong>phương trình cát tuyến</strong> B<sub>k+1</sub>s<sub>k</sub> = y<sub>k</sub> (tái tạo độ cong thấy được dọc bước vừa đi) mà vẫn đối xứng xác định dương. BFGS dùng cập nhật hạng hai tốn O(n<sup>2</sup>) mỗi vòng thay vì O(n<sup>3</sup>) của Newton, và hội tụ <strong>siêu tuyến tính</strong> gần tối ưu (Nocedal &amp; Wright Ch. 6).</p>
<p><strong>L-BFGS</strong> chỉ lưu m cặp (s, y) gần nhất, thường m = 5–20, nên bộ nhớ O(mn) — xử lý hàng triệu biến và là “ngựa thồ” cho hàm mất mát học máy trơn và lồi (bộ giải mặc định của hồi quy logistic trong scikit-learn là L-BFGS).</p>
<p><strong>Conjugate gradient (CG)</strong> giải hàm toàn phương trong tối đa n bước bằng cách chọn các hướng liên hợp theo Hessian; bản phi tuyến chỉ cần gradient và bộ nhớ O(n). <strong>Newton-CG</strong> tính xấp xỉ bước Newton bằng CG, chỉ dùng tích Hessian–vectơ — tốc độ Newton mà không phải lập ma trận.</p>
<table><tr><th>Phương pháp</th><th>Cần</th><th>Chi phí / vòng</th><th>Dùng khi</th></tr>
<tr><td>Gradient descent / SGD</td><td>∇f</td><td>O(n)</td><td>n khổng lồ, học sâu</td></tr>
<tr><td>L-BFGS</td><td>∇f</td><td>O(mn)</td><td>hàm mất mát trơn, n tới hàng triệu</td></tr>
<tr><td>BFGS</td><td>∇f</td><td>O(n<sup>2</sup>)</td><td>n tới vài nghìn</td></tr>
<tr><td>Newton / Newton-CG</td><td>∇f, ∇<sup>2</sup>f (hoặc Hv)</td><td>O(n<sup>3</sup>) / các bước CG</td><td>cần độ chính xác cao, n vừa, bên trong bộ giải điểm trong</td></tr></table>
<h3>✍️ Ví dụ giải từng bước — hồi quy logistic có chính quy hoá, đặc trưng lệch thang đo</h3>
<div class="callout"><p><b>Bài toán.</b> 500 mẫu, 20 đặc trưng co giãn từ 0,2 tới 5 (nên Hessian có số điều kiện xấu), mất mát logistic có chính quy hoá λ = 0,01 (lồi mạnh).</p>
<p>Bước 1: viết f, ∇f và ∇<sup>2</sup>f như Bài 6.4 (dùng <code>np.logaddexp</code> cho ổn định). Bước 2: gọi <code>minimize</code> với CG, BFGS, L-BFGS-B và Newton-CG tới sai số gradient 10<sup>−8</sup>. Bước 3: chạy gradient descent thuần với t = 1/L, trong đó L = λ<sub>max</sub>(X<sup>T</sup>X)/(4n) + λ (đạo hàm sigmoid không quá 1/4).</p></div>
<pre><code class="language-python">import numpy as np
from scipy.optimize import minimize

rng = np.random.default_rng(10)
n, d = 500, 20
X = rng.normal(size=(n, d)) * np.linspace(0.2, 5, d)      # badly scaled features
w_true = rng.normal(size=d)
y = (rng.uniform(size=n) &lt; 1 / (1 + np.exp(-X @ w_true / 4))).astype(float)
lam = 1e-2

def f(w):          # regularised logistic loss (convex)
    z = X @ w
    return np.mean(np.logaddexp(0, z) - y * z) + lam / 2 * w @ w
def g(w):
    z = X @ w
    return X.T @ (1 / (1 + np.exp(-z)) - y) / n + lam * w
def H(w):
    s = 1 / (1 + np.exp(-X @ w))
    return (X.T * (s * (1 - s))) @ X / n + lam * np.eye(d)

w0 = np.zeros(d)
opts = {"CG": {"gtol": 1e-8}, "BFGS": {"gtol": 1e-8},
        "L-BFGS-B": {"gtol": 1e-8, "ftol": 1e-15}, "Newton-CG": {"xtol": 1e-10}}
for method, o in opts.items():
    r = minimize(f, w0, jac=g, hess=H if method == "Newton-CG" else None, method=method, options=o)
    print(f"{method:9s}: iterations = {r.nit:4d}  f* = {r.fun:.8f}  ||grad|| = {np.linalg.norm(g(r.x)):.1e}")

# plain gradient descent with step 1/L, L = largest eigenvalue bound of the Hessian
L = np.linalg.eigvalsh(X.T @ X / (4 * n)).max() + lam
w = w0.copy()
for k in range(1, 20001):
    w -= g(w) / L
    if np.linalg.norm(g(w)) &lt; 1e-6: break
print(f"GD 1/L   : iterations = {k:5d}  f  = {f(w):.8f}  ||grad|| = {np.linalg.norm(g(w)):.1e}")</code></pre>
<div class="out">CG       : iterations =  115  f* = 0.27610697  ||grad|| = 1.9e-08
BFGS     : iterations =   47  f* = 0.27610697  ||grad|| = 5.8e-09
L-BFGS-B : iterations =   74  f* = 0.27610697  ||grad|| = 2.1e-08
Newton-CG: iterations =   14  f* = 0.27610697  ||grad|| = 1.9e-08
GD 1/L   : iterations =  3594  f  = 0.27610697  ||grad|| = 1.0e-06</div>
<p>Mọi phương pháp tới cùng f* = 0,27610697 (bài lồi mạnh nên điểm cực tiểu duy nhất). Newton-CG cần 14 vòng, BFGS 47, L-BFGS 74, CG 115 — còn gradient descent 3594 vòng với sai số lỏng hơn. Số vòng không phải toàn bộ câu chuyện (một vòng Newton đắt hơn), nhưng trên bài số điều kiện xấu, thông tin độ cong thắng rõ ràng.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Gọi <code>minimize</code> mà không có <code>jac=</code>: SciPy khi đó dùng sai phân hữu hạn, tốn thêm n lần tính hàm cho mỗi gradient.</li><li>Truyền tuỳ chọn không tồn tại cho phương pháp đó (SciPy cảnh báo, vd <code>gtol</code> không phải tuỳ chọn của Newton-CG, vốn dùng <code>xtol</code>).</li><li>Dùng BFGS cho bài 10<sup>6</sup> biến: ma trận n × n cần hàng terabyte; hãy dùng L-BFGS.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tựa Newton: dựng B ≈ ∇<sup>2</sup>f từ hiệu gradient qua phương trình cát tuyến.</li><li>BFGS O(n<sup>2</sup>), L-BFGS O(mn): tốc độ gần siêu tuyến tính chỉ với gradient.</li><li>Newton-CG: bước Newton qua tích Hessian–vectơ.</li><li>Chọn theo kích thước và độ chính xác: GD/SGD cho n khổng lồ, L-BFGS cho bài trơn vừa–lớn, Newton khi cần chính xác cao.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.stat.cmu.edu/~ryantibs/convexopt/lectures/quasi-newton.pdf" target="_blank" rel="noopener">CMU 10-725 — Quasi-Newton methods</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.minimize.html" target="_blank" rel="noopener">SciPy — scipy.optimize.minimize (mọi phương pháp và tuỳ chọn)</a></li><li><a href="https://en.wikipedia.org/wiki/Broyden%E2%80%93Fletcher%E2%80%93Goldfarb%E2%80%93Shanno_algorithm" target="_blank" rel="noopener">Wikipedia — BFGS algorithm</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Trong một chiều, phương trình cát tuyến B<sub>k+1</sub>s<sub>k</sub> = y<sub>k</sub> xác định hoàn toàn B<sub>k+1</sub>. Nó bằng gì, và ta được phương pháp cổ điển nào?</li><li>Ước lượng bộ nhớ cho BFGS với n = 10<sup>5</sup> (double) và cho L-BFGS với m = 10.</li><li>Vì sao L = λ<sub>max</sub>(X<sup>T</sup>X)/(4n) + λ dùng được làm hằng số trơn cho mất mát logistic?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) B = (f′(x<sub>k+1</sub>) − f′(x<sub>k</sub>))/(x<sub>k+1</sub> − x<sub>k</sub>): phương pháp cát tuyến cho f′ = 0. 2) BFGS: 10<sup>10</sup> số × 8 byte = 80 GB; L-BFGS: 2·10·10<sup>5</sup> × 8 byte ≈ 16 MB. 3) Hessian là X<sup>T</sup>DX/n + λI với D ⪯ ¼I, nên nó ⪯ (λ<sub>max</sub>(X<sup>T</sup>X)/(4n) + λ)I.</p></div>`);

const q7 = QZ(7, 'Quiz — Chapter 7: Unconstrained minimization|||Quiz — Chương 7: Cực tiểu không ràng buộc',
  'Kiểm tra gradient descent, độ trơn L, lồi mạnh μ, số điều kiện, backtracking Armijo, bước và độ giảm Newton, hội tụ bậc hai, BFGS/L-BFGS.', [
  Q('q1', 'Δx is a descent direction at x if|||Δx là hướng giảm tại x nếu',
    ['∇f(x)ᵀΔx > 0|||∇f(x)ᵀΔx > 0', '∇f(x)ᵀΔx < 0|||∇f(x)ᵀΔx < 0', '‖Δx‖ = 1|||‖Δx‖ = 1', 'Δx = ∇f(x)|||Δx = ∇f(x)'], 1,
    'A negative directional derivative means f decreases for small steps.|||Đạo hàm theo hướng âm nghĩa là f giảm với bước nhỏ.'),
  Q('q2', 'On a quadratic with largest curvature L, gradient descent with fixed step t converges iff|||Trên hàm toàn phương có độ cong lớn nhất L, gradient descent bước cố định t hội tụ khi và chỉ khi',
    ['t < 1/L|||t < 1/L', '0 < t < 2/L|||0 < t < 2/L', 't > 2/L|||t > 2/L', 'any t > 0|||mọi t > 0'], 1,
    'The error along the top eigenvector is multiplied by |1 − tL|.|||Sai số theo vectơ riêng lớn nhất bị nhân với |1 − tL|.'),
  Q('q3', 'The condition number κ = L/μ mainly affects|||Số điều kiện κ = L/μ chủ yếu ảnh hưởng tới',
    ['the solution x*|||nghiệm x*', 'the number of gradient-descent iterations|||số vòng lặp gradient descent', 'convexity|||tính lồi', 'the optimal value|||giá trị tối ưu'], 1,
    'Iterations scale roughly like κ·log(1/ε).|||Số vòng lặp tỉ lệ cỡ κ·log(1/ε).'),
  Q('q4', 'For a μ-strongly convex, L-smooth f, gradient descent with t = 1/L converges|||Với f μ-lồi mạnh, L-trơn, gradient descent với t = 1/L hội tụ',
    ['sublinearly O(1/k)|||dưới tuyến tính O(1/k)', 'linearly, factor (1 − μ/L) per step|||tuyến tính, hệ số (1 − μ/L) mỗi bước', 'quadratically|||bậc hai', 'not at all|||không hội tụ'], 1,
    'Strong convexity gives linear (geometric) convergence.|||Lồi mạnh cho hội tụ tuyến tính (cấp số nhân).'),
  Q('q5', 'The Armijo backtracking condition is|||Điều kiện backtracking Armijo là',
    ['f(x + tΔx) ≤ f(x) + αt∇f(x)ᵀΔx|||f(x + tΔx) ≤ f(x) + αt∇f(x)ᵀΔx', 'f(x + tΔx) ≥ f(x)|||f(x + tΔx) ≥ f(x)', '‖∇f(x + tΔx)‖ = 0|||‖∇f(x + tΔx)‖ = 0', 't = 1/L|||t = 1/L'], 0,
    'Sufficient decrease relative to a flattened tangent line.|||Giảm đủ so với tiếp tuyến bị làm thoải.'),
  Q('q6', 'The Newton step is|||Bước Newton là',
    ['−∇f(x)|||−∇f(x)', '−∇²f(x)⁻¹∇f(x)|||−∇²f(x)⁻¹∇f(x)', '−∇²f(x)∇f(x)|||−∇²f(x)∇f(x)', '∇f(x)/‖∇f(x)‖|||∇f(x)/‖∇f(x)‖'], 1,
    'It minimises the second-order Taylor model.|||Nó cực tiểu mô hình Taylor bậc hai.'),
  Q('q7', 'Half the squared Newton decrement, λ(x)²/2, estimates|||Nửa bình phương độ giảm Newton, λ(x)²/2, ước lượng',
    ['‖x − x*‖|||‖x − x*‖', 'f(x) − p*|||f(x) − p*', 'the step size|||độ dài bước', 'the condition number|||số điều kiện'], 1,
    'It is the decrease predicted by the quadratic model.|||Đó là mức giảm mô hình bậc hai dự đoán.'),
  Q('q8', 'Near the optimum, Newton’s method converges|||Gần tối ưu, phương pháp Newton hội tụ',
    ['linearly|||tuyến tính', 'quadratically (digits double each step)|||bậc hai (số chữ số đúng gấp đôi mỗi bước)', 'sublinearly|||dưới tuyến tính', 'only with t < 1|||chỉ khi t < 1'], 1,
    'Pure Newton phase: e_{k+1} ≤ c·e_k².|||Pha Newton thuần: e_{k+1} ≤ c·e_k².'),
  Q('q9', 'Why is Newton’s method rarely used to train deep networks?|||Vì sao hiếm dùng Newton để huấn luyện mạng sâu?',
    ['it does not converge|||nó không hội tụ', 'forming and solving with an n × n Hessian is too expensive for huge n|||lập và giải với Hessian n × n quá đắt khi n khổng lồ', 'it needs integer variables|||nó cần biến nguyên', 'it only works for LPs|||nó chỉ dùng cho LP'], 1,
    'O(n²) memory and O(n³) time per step.|||Bộ nhớ O(n²) và thời gian O(n³) mỗi bước.'),
  Q('q10', 'L-BFGS differs from BFGS mainly by|||L-BFGS khác BFGS chủ yếu ở',
    ['using the exact Hessian|||dùng Hessian chính xác', 'storing only the last m (s, y) pairs (O(mn) memory)|||chỉ lưu m cặp (s, y) gần nhất (bộ nhớ O(mn))', 'not using gradients|||không dùng gradient', 'being nonconvex|||không lồi'], 1,
    'Limited memory makes it usable for millions of variables.|||Bộ nhớ giới hạn giúp dùng được với hàng triệu biến.'),
]);

const ch7 = {
  title: 'Chapter 7 — Unconstrained minimization: gradient descent and Newton’s method|||Chương 7 — Cực tiểu không ràng buộc: gradient descent và phương pháp Newton',
  description: 'Gradient descent, độ trơn và lồi mạnh, số điều kiện, tìm bước backtracking, phương pháp Newton và độ giảm Newton, tựa Newton BFGS/L-BFGS, chọn bộ giải với scipy (Boyd Ch. 9 · Nocedal & Wright Ch. 3, 6 · CMU 10-725).',
  lessons: [c71, c72, c73, c74, q7],
};


// ───────────────────────────── Chương 8 — Ràng buộc đẳng thức & phương pháp điểm trong ─────────────────────────────
const c81 = L('cvo201-ts-8-1',
  '8.1 — Equality-constrained minimization: the KKT system and Newton’s method with equality constraints|||8.1 — Cực tiểu có ràng buộc đẳng thức: hệ KKT và Newton có ràng buộc đẳng thức',
  'Bài min f(x) s.t. Ax = b, điều kiện tối ưu ∇f(x*) + Aᵀν* = 0, Ax* = b; QP có đẳng thức giải bằng một hệ KKT; bước Newton có đẳng thức (điểm đầu khả thi, AΔx = 0); ví dụ entropy cực đại (Boyd §10.1–10.2).',
  `<span class="eyebrow">CVO201 · Chapter 8 · Lesson 8.1</span>
<h2>Equality-constrained minimization</h2>
<p class="lead">Interior-point methods reduce every convex problem to a sequence of problems with only linear equality constraints. So the first step is to solve those well — and Newton's method extends to them with one small change.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write the optimality conditions of minimise f(x) s.t. Ax = b.</li><li>Solve an equality-constrained QP with one linear KKT system.</li><li>Derive the Newton step with equality constraints and run it from a feasible start.</li></ul>
<h3>📖 Lecture</h3>
<p>Consider minimise f(x) subject to Ax = b, with f convex and twice differentiable and A ∈ ℝ<sup>p×n</sup> of full row rank. The KKT conditions of Lesson 5.3 (no inequalities) are necessary and sufficient:</p>
<div class="formula"><span class="lbl">Optimality conditions (Boyd §10.1)</span>Ax* = b,      ∇f(x*) + A<sup>T</sup>ν* = 0</div>
<p>Geometrically, ∇f(x*) must be orthogonal to the nullspace of A — moving within the feasible affine set cannot decrease f to first order. For a <strong>quadratic</strong> f = ½x<sup>T</sup>Px + q<sup>T</sup>x the conditions are linear:</p>
<div class="formula"><span class="lbl">KKT system of an equality-constrained QP</span>[ P   A<sup>T</sup> ] [ x* ]   [ −q ]<br>[ A    0  ] [ ν* ] = [  b ]</div>
<p>One linear solve gives both the primal solution and the multiplier. The KKT matrix is nonsingular when P is positive definite on the nullspace of A.</p>
<p><strong>Newton with equality constraints.</strong> For a general f, replace f by its quadratic model at a feasible x and require the step to stay feasible (AΔx = 0). This gives the Newton step as the solution of</p>
<div class="formula"><span class="lbl">Newton step with equality constraints (Boyd §10.2)</span>[ ∇<sup>2</sup>f(x)   A<sup>T</sup> ] [ Δx<sub>nt</sub> ]   [ −∇f(x) ]<br>[   A       0  ] [   w   ] = [    0   ]</div>
<p>The Newton decrement λ<sup>2</sup> = Δx<sub>nt</sub><sup>T</sup>∇<sup>2</sup>f(x)Δx<sub>nt</sub> again estimates the gap, backtracking keeps x in the domain, and because AΔx = 0 every iterate remains feasible. The convergence theory is identical to the unconstrained case: a damped phase then quadratic convergence. (If no feasible start is available, the infeasible-start Newton method of Boyd §10.3 reaches feasibility along the way.)</p>
<h3>✍️ Worked example — maximum entropy with a mean constraint</h3>
<div class="callout"><p><b>Problem.</b> A die-like variable takes values 1, 2, 3. Find the distribution x with maximum entropy −∑x<sub>i</sub>log x<sub>i</sub> whose mean is 2.3: minimise ∑x<sub>i</sub>log x<sub>i</sub> s.t. x<sub>1</sub> + x<sub>2</sub> + x<sub>3</sub> = 1, x<sub>1</sub> + 2x<sub>2</sub> + 3x<sub>3</sub> = 2.3.</p>
<p>Step 1: feasible start x = (0.2, 0.3, 0.5): sum 1, mean 0.2 + 0.6 + 1.5 = 2.3 ✓. Step 2: ∇f = log x + 1, ∇<sup>2</sup>f = diag(1/x<sub>i</sub>). Step 3: solve the 5 × 5 KKT system for Δx, backtrack keeping x &gt; 0. Step 4 (theory check): stationarity gives log x<sub>i</sub> + 1 + ν<sub>1</sub> + iν<sub>2</sub> = 0, so x<sub>i</sub> ∝ e<sup>−iν<sub>2</sub></sup> — a geometric (Gibbs) distribution, so x<sub>2</sub><sup>2</sup> = x<sub>1</sub>x<sub>3</sub> at the optimum.</p>
<p>Before that, a warm-up: an equality-constrained QP with P = [[4, 1, 0], [1, 3, 0], [0, 0, 2]], q = (−1, 0, 1), constraint x<sub>1</sub> + x<sub>2</sub> + x<sub>3</sub> = 1, solved by one KKT system.</p></div>
<pre><code class="language-python">import numpy as np

# (a) equality-constrained QP: one linear solve of the KKT system
P = np.array([[4.0, 1.0, 0.0], [1.0, 3.0, 0.0], [0.0, 0.0, 2.0]]); q = np.array([-1.0, 0.0, 1.0])
A = np.array([[1.0, 1.0, 1.0]]); b = np.array([1.0])
K = np.block([[P, A.T], [A, np.zeros((1, 1))]])
sol = np.linalg.solve(K, np.r_[-q, b])
x, nu = sol[:3], sol[3:]
print("QP: x* =", x.round(4), " nu* =", nu.round(4), " A x* =", (A @ x).round(6))
print("    stationarity P x + q + A^T nu =", (P @ x + q + A.T @ nu).round(10))

# (b) Newton's method with equality constraints: maximise entropy  sum x log x -&gt; min
#     subject to x1+x2+x3 = 1 and the mean 1*x1 + 2*x2 + 3*x3 = 2.3
A = np.array([[1.0, 1.0, 1.0], [1.0, 2.0, 3.0]]); b = np.array([1.0, 2.3])
f = lambda x: np.sum(x * np.log(x))
x = np.array([0.2, 0.3, 0.5])                      # feasible start: A x = b
for k in range(10):
    g = np.log(x) + 1; H = np.diag(1 / x)
    KKT = np.block([[H, A.T], [A, np.zeros((2, 2))]])
    dx = np.linalg.solve(KKT, np.r_[-g, 0, 0])[:3]    # A dx = 0 keeps feasibility
    lam2 = dx @ H @ dx
    print(f"k={k}  f = {f(x):.10f}  lambda^2/2 = {lam2 / 2:.2e}")
    if lam2 / 2 &lt; 1e-12: break
    t = 1.0
    while np.any(x + t * dx &lt;= 0) or f(x + t * dx) &gt; f(x) + 0.25 * t * g @ dx:
        t *= 0.5
    x = x + t * dx
print("x* =", x.round(6), " A x* =", (A @ x).round(6))</code></pre>
<div class="out">QP: x* = [0.5238 0.2857 0.1905]  nu* = [-1.381]  A x* = [1.]
    stationarity P x + q + A^T nu = [0. 0. 0.]
k=0  f = -1.0296530141  lambda^2/2 = 2.73e-04
k=1  f = -1.0299273312  lambda^2/2 = 1.48e-08
k=2  f = -1.0299273460  lambda^2/2 = 3.78e-17
x* = [0.19478 0.31044 0.49478]  A x* = [1.  2.3]</div>
<p>The QP is solved exactly by one linear system. Newton's method on the entropy problem stays feasible at every step (A x* = (1, 2.3)) and the decrement falls 2.7·10<sup>−4</sup> → 1.5·10<sup>−8</sup> → 3.8·10<sup>−17</sup>: quadratic convergence in three iterations. Check the Gibbs structure: 0.31044<sup>2</sup> ≈ 0.0964 ≈ 0.19478·0.49478.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Starting the feasible-start method at a point with Ax ≠ b: the iterates then never become feasible.</li><li>Forming the KKT matrix with A of deficient row rank (redundant equalities): it is singular — remove redundant rows.</li><li>Ignoring the domain: the backtracking must keep x &gt; 0 for log x.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Optimality: Ax* = b and ∇f(x*) + A<sup>T</sup>ν* = 0.</li><li>Equality-constrained QP = one KKT linear system.</li><li>Newton step from the KKT system with ∇<sup>2</sup>f; AΔx = 0 keeps feasibility; same fast convergence.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://web.stanford.edu/class/ee364a/lectures/equality.pdf" target="_blank" rel="noopener">Stanford EE364a — Lecture 10: Equality constrained minimization (slides)</a></li><li><a href="https://en.wikipedia.org/wiki/Lagrange_multiplier" target="_blank" rel="noopener">Wikipedia — Lagrange multiplier</a></li><li><a href="https://www.cvxpy.org/examples/applications/max_entropy.html" target="_blank" rel="noopener">CVXPY example — Entropy maximization</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Solve minimise x<sub>1</sub><sup>2</sup> + 2x<sub>2</sub><sup>2</sup> s.t. x<sub>1</sub> + x<sub>2</sub> = 3 with the KKT system.</li><li>Show that the Newton step satisfies AΔx = 0 and explain why that keeps feasibility.</li><li>Without the mean constraint, what is the maximum-entropy distribution on {1, 2, 3}?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 2x<sub>1</sub> + ν = 0, 4x<sub>2</sub> + ν = 0, x<sub>1</sub> + x<sub>2</sub> = 3 ⇒ x<sub>1</sub> = 2x<sub>2</sub> ⇒ x = (2, 1), ν = −4, p* = 6. 2) It is the second block row of the system; A(x + tΔx) = Ax + 0 = b. 3) Uniform (1/3, 1/3, 1/3) — the mean is then 2.</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 8 · Bài 8.1</span>
<h2>Cực tiểu có ràng buộc đẳng thức</h2>
<p class="lead">Phương pháp điểm trong quy mọi bài lồi về một dãy bài chỉ có ràng buộc đẳng thức tuyến tính. Nên bước đầu tiên là giải tốt những bài đó — và phương pháp Newton mở rộng sang chúng chỉ với một thay đổi nhỏ.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết điều kiện tối ưu của bài cực tiểu f(x) với Ax = b.</li><li>Giải QP có ràng buộc đẳng thức bằng một hệ KKT tuyến tính.</li><li>Suy ra bước Newton có ràng buộc đẳng thức và chạy nó từ điểm đầu khả thi.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Xét bài cực tiểu f(x) với Ax = b, f lồi khả vi hai lần và A ∈ ℝ<sup>p×n</sup> có hạng dòng đầy đủ. Điều kiện KKT ở Bài 5.3 (không có bất đẳng thức) là cần và đủ:</p>
<div class="formula"><span class="lbl">Điều kiện tối ưu (Boyd §10.1)</span>Ax* = b,      ∇f(x*) + A<sup>T</sup>ν* = 0</div>
<p>Về hình học, ∇f(x*) phải trực giao với không gian không của A — di chuyển trong tập affine khả thi không làm f giảm ở bậc một. Với f <strong>toàn phương</strong> = ½x<sup>T</sup>Px + q<sup>T</sup>x các điều kiện là tuyến tính:</p>
<div class="formula"><span class="lbl">Hệ KKT của QP có đẳng thức</span>[ P   A<sup>T</sup> ] [ x* ]   [ −q ]<br>[ A    0  ] [ ν* ] = [  b ]</div>
<p>Một lần giải hệ tuyến tính cho cả nghiệm gốc lẫn nhân tử. Ma trận KKT khả nghịch khi P xác định dương trên không gian không của A.</p>
<p><strong>Newton có ràng buộc đẳng thức.</strong> Với f tổng quát, thay f bằng mô hình bậc hai tại một x khả thi và đòi bước giữ khả thi (AΔx = 0). Bước Newton là nghiệm của</p>
<div class="formula"><span class="lbl">Bước Newton có ràng buộc đẳng thức (Boyd §10.2)</span>[ ∇<sup>2</sup>f(x)   A<sup>T</sup> ] [ Δx<sub>nt</sub> ]   [ −∇f(x) ]<br>[   A       0  ] [   w   ] = [    0   ]</div>
<p>Độ giảm Newton λ<sup>2</sup> = Δx<sub>nt</sub><sup>T</sup>∇<sup>2</sup>f(x)Δx<sub>nt</sub> lại ước lượng khoảng cách, backtracking giữ x trong miền, và vì AΔx = 0 mọi điểm lặp vẫn khả thi. Lý thuyết hội tụ y hệt trường hợp không ràng buộc: pha tắt dần rồi hội tụ bậc hai. (Nếu không có điểm đầu khả thi, phương pháp Newton xuất phát không khả thi ở Boyd §10.3 đạt khả thi dọc đường.)</p>
<h3>✍️ Ví dụ giải từng bước — entropy cực đại với ràng buộc trung bình</h3>
<div class="callout"><p><b>Bài toán.</b> Một biến kiểu xúc xắc nhận giá trị 1, 2, 3. Tìm phân phối x có entropy −∑x<sub>i</sub>log x<sub>i</sub> lớn nhất mà trung bình bằng 2,3: cực tiểu ∑x<sub>i</sub>log x<sub>i</sub> với x<sub>1</sub> + x<sub>2</sub> + x<sub>3</sub> = 1, x<sub>1</sub> + 2x<sub>2</sub> + 3x<sub>3</sub> = 2,3.</p>
<p>Bước 1: điểm đầu khả thi x = (0,2; 0,3; 0,5): tổng 1, trung bình 0,2 + 0,6 + 1,5 = 2,3 ✓. Bước 2: ∇f = log x + 1, ∇<sup>2</sup>f = diag(1/x<sub>i</sub>). Bước 3: giải hệ KKT 5 × 5 tìm Δx, lùi bước giữ x &gt; 0. Bước 4 (kiểm lý thuyết): điều kiện dừng cho log x<sub>i</sub> + 1 + ν<sub>1</sub> + iν<sub>2</sub> = 0, nên x<sub>i</sub> ∝ e<sup>−iν<sub>2</sub></sup> — phân phối hình học (Gibbs), nên tại tối ưu x<sub>2</sub><sup>2</sup> = x<sub>1</sub>x<sub>3</sub>.</p>
<p>Trước đó, khởi động: một QP có đẳng thức với P = [[4, 1, 0], [1, 3, 0], [0, 0, 2]], q = (−1, 0, 1), ràng buộc x<sub>1</sub> + x<sub>2</sub> + x<sub>3</sub> = 1, giải bằng một hệ KKT.</p></div>
<pre><code class="language-python">import numpy as np

# (a) equality-constrained QP: one linear solve of the KKT system
P = np.array([[4.0, 1.0, 0.0], [1.0, 3.0, 0.0], [0.0, 0.0, 2.0]]); q = np.array([-1.0, 0.0, 1.0])
A = np.array([[1.0, 1.0, 1.0]]); b = np.array([1.0])
K = np.block([[P, A.T], [A, np.zeros((1, 1))]])
sol = np.linalg.solve(K, np.r_[-q, b])
x, nu = sol[:3], sol[3:]
print("QP: x* =", x.round(4), " nu* =", nu.round(4), " A x* =", (A @ x).round(6))
print("    stationarity P x + q + A^T nu =", (P @ x + q + A.T @ nu).round(10))

# (b) Newton's method with equality constraints: maximise entropy  sum x log x -&gt; min
#     subject to x1+x2+x3 = 1 and the mean 1*x1 + 2*x2 + 3*x3 = 2.3
A = np.array([[1.0, 1.0, 1.0], [1.0, 2.0, 3.0]]); b = np.array([1.0, 2.3])
f = lambda x: np.sum(x * np.log(x))
x = np.array([0.2, 0.3, 0.5])                      # feasible start: A x = b
for k in range(10):
    g = np.log(x) + 1; H = np.diag(1 / x)
    KKT = np.block([[H, A.T], [A, np.zeros((2, 2))]])
    dx = np.linalg.solve(KKT, np.r_[-g, 0, 0])[:3]    # A dx = 0 keeps feasibility
    lam2 = dx @ H @ dx
    print(f"k={k}  f = {f(x):.10f}  lambda^2/2 = {lam2 / 2:.2e}")
    if lam2 / 2 &lt; 1e-12: break
    t = 1.0
    while np.any(x + t * dx &lt;= 0) or f(x + t * dx) &gt; f(x) + 0.25 * t * g @ dx:
        t *= 0.5
    x = x + t * dx
print("x* =", x.round(6), " A x* =", (A @ x).round(6))</code></pre>
<div class="out">QP: x* = [0.5238 0.2857 0.1905]  nu* = [-1.381]  A x* = [1.]
    stationarity P x + q + A^T nu = [0. 0. 0.]
k=0  f = -1.0296530141  lambda^2/2 = 2.73e-04
k=1  f = -1.0299273312  lambda^2/2 = 1.48e-08
k=2  f = -1.0299273460  lambda^2/2 = 3.78e-17
x* = [0.19478 0.31044 0.49478]  A x* = [1.  2.3]</div>
<p>QP được giải chính xác bằng một hệ tuyến tính. Newton trên bài entropy giữ khả thi ở mọi bước (A x* = (1; 2,3)) và độ giảm rơi 2,7·10<sup>−4</sup> → 1,5·10<sup>−8</sup> → 3,8·10<sup>−17</sup>: hội tụ bậc hai trong ba vòng. Kiểm cấu trúc Gibbs: 0,31044<sup>2</sup> ≈ 0,0964 ≈ 0,19478·0,49478.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Khởi động phương pháp điểm đầu khả thi tại điểm có Ax ≠ b: các điểm lặp sẽ không bao giờ khả thi.</li><li>Lập ma trận KKT với A thiếu hạng dòng (đẳng thức thừa): ma trận suy biến — hãy bỏ các dòng thừa.</li><li>Bỏ qua miền xác định: backtracking phải giữ x &gt; 0 cho log x.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tối ưu: Ax* = b và ∇f(x*) + A<sup>T</sup>ν* = 0.</li><li>QP có đẳng thức = một hệ tuyến tính KKT.</li><li>Bước Newton từ hệ KKT với ∇<sup>2</sup>f; AΔx = 0 giữ khả thi; hội tụ nhanh như cũ.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://web.stanford.edu/class/ee364a/lectures/equality.pdf" target="_blank" rel="noopener">Stanford EE364a — Bài 10: Cực tiểu có ràng buộc đẳng thức (slide)</a></li><li><a href="https://en.wikipedia.org/wiki/Lagrange_multiplier" target="_blank" rel="noopener">Wikipedia — Lagrange multiplier</a></li><li><a href="https://www.cvxpy.org/examples/applications/max_entropy.html" target="_blank" rel="noopener">Ví dụ CVXPY — Entropy maximization</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Giải bằng hệ KKT: cực tiểu x<sub>1</sub><sup>2</sup> + 2x<sub>2</sub><sup>2</sup> với x<sub>1</sub> + x<sub>2</sub> = 3.</li><li>Chứng tỏ bước Newton thoả AΔx = 0 và giải thích vì sao điều đó giữ khả thi.</li><li>Không có ràng buộc trung bình, phân phối entropy cực đại trên {1, 2, 3} là gì?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 2x<sub>1</sub> + ν = 0, 4x<sub>2</sub> + ν = 0, x<sub>1</sub> + x<sub>2</sub> = 3 ⇒ x<sub>1</sub> = 2x<sub>2</sub> ⇒ x = (2, 1), ν = −4, p* = 6. 2) Đó là khối dòng thứ hai của hệ; A(x + tΔx) = Ax + 0 = b. 3) Đều (1/3, 1/3, 1/3) — khi đó trung bình bằng 2.</p></div>`);

const c82 = L('cvo201-ts-8-2',
  '8.2 — The log barrier and the barrier method: following the central path|||8.2 — Hàm chắn log và phương pháp barrier: đi theo đường trung tâm',
  'Thay ràng buộc bất đẳng thức bằng hàm chắn −∑log(−fi(x)), bài xấp xỉ t·f0 + φ, đường trung tâm x*(t), cận khoảng cách m/t, thuật toán barrier (centering bằng Newton, tăng t); cài đặt cho một LP nhỏ và so với CVXPY (Boyd §11.2–11.3).',
  `<span class="eyebrow">CVO201 · Chapter 8 · Lesson 8.2</span>
<h2>The log barrier and the barrier method</h2>
<p class="lead">How do we handle inequality constraints with Newton's method, which needs smooth unconstrained problems? Put a “wall” at the boundary: a barrier function that goes to +∞ as a constraint becomes active. Then slowly make the wall thinner.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define the logarithmic barrier and the approximating problem.</li><li>Describe the central path and prove the gap bound m/t.</li><li>Implement the barrier method for a small LP and watch it converge.</li></ul>
<h3>📖 Lecture</h3>
<p>Start from minimise f<sub>0</sub>(x) s.t. f<sub>i</sub>(x) ≤ 0 (i = 1…m), Ax = b, convex, strictly feasible. The ideal reformulation puts an indicator I(u) (0 if u ≤ 0, +∞ otherwise) on each constraint — exact but not differentiable. Approximate it by −(1/t)log(−u), smooth and convex, which tends to the indicator as t → ∞:</p>
<div class="formula"><span class="lbl">Log barrier and centering problem (Boyd §11.2)</span>φ(x) = −∑<sub>i</sub> log(−f<sub>i</sub>(x)),   dom φ = {x : f<sub>i</sub>(x) &lt; 0}<br>x*(t) = argmin  t·f<sub>0</sub>(x) + φ(x)  subject to Ax = b</div>
<p>For an LP with constraints a<sub>i</sub><sup>T</sup>x ≤ b<sub>i</sub>, φ(x) = −∑log(b<sub>i</sub> − a<sub>i</sub><sup>T</sup>x), with gradient ∑a<sub>i</sub>/(b<sub>i</sub> − a<sub>i</sub><sup>T</sup>x) and Hessian ∑a<sub>i</sub>a<sub>i</sub><sup>T</sup>/(b<sub>i</sub> − a<sub>i</sub><sup>T</sup>x)<sup>2</sup>. Each centering problem is smooth and equality-constrained — exactly what Lesson 8.1 solves with Newton.</p>
<p>The curve t ↦ x*(t) is the <strong>central path</strong>; it runs through the interior and ends at the optimum. Remarkably, each central point comes with a dual feasible point: λ<sub>i</sub>*(t) = −1/(t f<sub>i</sub>(x*(t))). Plugging it into the dual function gives</p>
<div class="formula"><span class="lbl">Duality gap on the central path</span>f<sub>0</sub>(x*(t)) − p* ≤ m/t</div>
<p>So we know exactly how far we are from optimal. The <strong>barrier method</strong>: start from a strictly feasible x and some t<sup>(0)</sup> &gt; 0; repeat (1) centering: compute x*(t) by Newton starting from the previous x; (2) stop if m/t &lt; ε; (3) t ← μt with μ around 10–100. Each centering is warm-started near its solution, so it needs few Newton steps; the total is typically a few dozen Newton steps, almost independent of problem size (Boyd §11.3).</p>
<h3>✍️ Worked example — a 2-variable LP</h3>
<div class="callout"><p><b>Problem.</b> minimise −x<sub>1</sub> − 2x<sub>2</sub> s.t. x<sub>1</sub> + x<sub>2</sub> ≤ 4, −x<sub>1</sub> + 2x<sub>2</sub> ≤ 4, x<sub>1</sub> ≤ 3, x ⪰ 0 (m = 5).</p>
<p>Step 1 (answer by vertices): the lines x<sub>1</sub> + x<sub>2</sub> = 4 and −x<sub>1</sub> + 2x<sub>2</sub> = 4 meet at x<sub>2</sub> = 8/3, x<sub>1</sub> = 4/3; objective −4/3 − 16/3 = −20/3 ≈ −6.6667; the other vertices are worse. Step 2: start at the interior point (1, 1), t = 1. Step 3: centre with Newton + backtracking that keeps b − Ax &gt; 0; multiply t by 10 until m/t &lt; 10<sup>−6</sup>.</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp

# LP: minimise c^T x subject to A x &lt;= b  (a small polygon)
c = np.array([-1.0, -2.0])
A = np.array([[1.0, 1.0], [-1.0, 2.0], [1.0, 0.0], [-1.0, 0.0], [0.0, -1.0]])
b = np.array([4.0, 4.0, 3.0, 0.0, 0.0])

def centering(t, x):                       # minimise t c^T x - sum log(b - A x) by Newton
    phi = lambda x: t * c @ x - np.sum(np.log(b - A @ x))
    for _ in range(50):
        s = b - A @ x
        g = t * c + A.T @ (1 / s); H = A.T @ np.diag(1 / s**2) @ A
        dx = -np.linalg.solve(H, g)
        if -g @ dx / 2 &lt; 1e-10: break
        step = 1.0
        while np.any(b - A @ (x + step * dx) &lt;= 0) or phi(x + step * dx) &gt; phi(x) + 0.25 * step * g @ dx:
            step *= 0.5
        x = x + step * dx
    return x

x, t, m = np.array([1.0, 1.0]), 1.0, len(b)   # strictly feasible start
print("   t       x*(t)              c^T x     gap bound m/t")
while m / t &gt; 1e-6:
    x = centering(t, x)
    print(f"{t:8.0f}  ({x[0]:.6f}, {x[1]:.6f})  {c @ x:.6f}   {m / t:.1e}")
    t *= 10

y = cp.Variable(2); p = cp.Problem(cp.Minimize(c @ y), [A @ y &lt;= b]); p.solve()
print("cvxpy:      x* =", y.value.round(6), " p* =", round(p.value, 6))</code></pre>
<div class="out">   t       x*(t)              c^T x     gap bound m/t
       1  (1.524804, 1.809783)  -5.144370   5.0e+00
      10  (1.381291, 2.544827)  -6.470945   5.0e-01
     100  (1.338319, 2.654194)  -6.646706   5.0e-02
    1000  (1.333833, 2.665417)  -6.664667   5.0e-03
   10000  (1.333383, 2.666542)  -6.666467   5.0e-04
  100000  (1.333338, 2.666654)  -6.666647   5.0e-05
 1000000  (1.333334, 2.666665)  -6.666665   5.0e-06
cvxpy:      x* = [1.333333 2.666667]  p* = -6.666667</div>
<p>The central points march from the interior (1.52, 1.81) toward the vertex (4/3, 8/3), and at every stage the true gap is below the bound m/t (at t = 10<sup>6</sup> the gap is 2·10<sup>−6</sup> ≤ 5·10<sup>−6</sup>). Our 30-line barrier method agrees with CVXPY.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Starting from a point that is not strictly feasible: φ is undefined there. Finding one is a “phase I” problem (Boyd §11.4).</li><li>Letting Newton steps leave the domain: the line search must first shrink t until b − A(x + tΔx) &gt; 0.</li><li>Choosing μ huge to finish in one stage: the centering then starts far from its solution and needs many damped Newton steps.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Log barrier φ = −∑log(−f<sub>i</sub>) replaces inequalities by a smooth wall.</li><li>Central path x*(t); gap ≤ m/t, with dual points λ<sub>i</sub> = −1/(t f<sub>i</sub>).</li><li>Barrier method: centre by Newton, increase t by μ, stop when m/t &lt; ε.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://web.stanford.edu/class/ee364a/lectures/barrier.pdf" target="_blank" rel="noopener">Stanford EE364a — Lecture 11: Interior-point methods (slides)</a></li><li><a href="https://www.stat.cmu.edu/~ryantibs/convexopt/lectures/barr-method.pdf" target="_blank" rel="noopener">CMU 10-725 — Barrier method</a></li><li><a href="https://en.wikipedia.org/wiki/Barrier_function" target="_blank" rel="noopener">Wikipedia — Barrier function</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>One variable: minimise x s.t. x ≥ 1. Compute x*(t) for the barrier problem t·x − log(x − 1).</li><li>An LP has m = 200 constraints. What t guarantees a gap below 10<sup>−6</sup>? With μ = 10 and t<sup>(0)</sup> = 1, how many centering stages?</li><li>Why is λ<sub>i</sub> = −1/(t f<sub>i</sub>(x*(t))) positive?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) t − 1/(x − 1) = 0 ⇒ x*(t) = 1 + 1/t; gap 1/t = m/t with m = 1. 2) t ≥ 2·10<sup>8</sup>; 10<sup>k</sup> ≥ 2·10<sup>8</sup> ⇒ k = 9 increases, i.e. 10 centerings counting the first. 3) f<sub>i</sub>(x*(t)) &lt; 0 strictly in the interior and t &gt; 0.</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 8 · Bài 8.2</span>
<h2>Hàm chắn log và phương pháp barrier</h2>
<p class="lead">Xử lý ràng buộc bất đẳng thức thế nào với phương pháp Newton, vốn cần bài trơn không ràng buộc? Dựng một “bức tường” ở biên: hàm chắn tiến tới +∞ khi ràng buộc sắp chặt. Rồi làm bức tường mỏng dần.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa hàm chắn logarit và bài toán xấp xỉ.</li><li>Mô tả đường trung tâm và chứng minh cận khoảng cách m/t.</li><li>Cài đặt phương pháp barrier cho một LP nhỏ và xem nó hội tụ.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Xuất phát từ bài cực tiểu f<sub>0</sub>(x) với f<sub>i</sub>(x) ≤ 0 (i = 1…m), Ax = b, lồi, khả thi chặt. Cách viết lý tưởng là đặt hàm chỉ thị I(u) (0 nếu u ≤ 0, +∞ nếu không) lên mỗi ràng buộc — chính xác nhưng không khả vi. Xấp xỉ nó bằng −(1/t)log(−u), trơn và lồi, tiến tới hàm chỉ thị khi t → ∞:</p>
<div class="formula"><span class="lbl">Hàm chắn log và bài định tâm (Boyd §11.2)</span>φ(x) = −∑<sub>i</sub> log(−f<sub>i</sub>(x)),   dom φ = {x : f<sub>i</sub>(x) &lt; 0}<br>x*(t) = argmin  t·f<sub>0</sub>(x) + φ(x)  subject to Ax = b</div>
<p>Với LP có ràng buộc a<sub>i</sub><sup>T</sup>x ≤ b<sub>i</sub>, φ(x) = −∑log(b<sub>i</sub> − a<sub>i</sub><sup>T</sup>x), gradient ∑a<sub>i</sub>/(b<sub>i</sub> − a<sub>i</sub><sup>T</sup>x) và Hessian ∑a<sub>i</sub>a<sub>i</sub><sup>T</sup>/(b<sub>i</sub> − a<sub>i</sub><sup>T</sup>x)<sup>2</sup>. Mỗi bài định tâm là trơn và chỉ có đẳng thức — đúng loại Bài 8.1 giải bằng Newton.</p>
<p>Đường cong t ↦ x*(t) là <strong>đường trung tâm</strong>; nó chạy qua phần trong và kết thúc tại tối ưu. Đáng chú ý, mỗi điểm trung tâm đi kèm một điểm khả thi đối ngẫu: λ<sub>i</sub>*(t) = −1/(t f<sub>i</sub>(x*(t))). Thế vào hàm đối ngẫu ta được</p>
<div class="formula"><span class="lbl">Khoảng cách đối ngẫu trên đường trung tâm</span>f<sub>0</sub>(x*(t)) − p* ≤ m/t</div>
<p>Vậy ta biết chính xác mình còn cách tối ưu bao xa. <strong>Phương pháp barrier</strong>: xuất phát từ x khả thi chặt và t<sup>(0)</sup> &gt; 0; lặp (1) định tâm: tính x*(t) bằng Newton xuất phát từ x trước đó; (2) dừng nếu m/t &lt; ε; (3) t ← μt với μ khoảng 10–100. Mỗi lần định tâm khởi động ấm gần nghiệm của nó, nên cần ít bước Newton; tổng cộng thường vài chục bước Newton, gần như không phụ thuộc kích thước bài (Boyd §11.3).</p>
<h3>✍️ Ví dụ giải từng bước — LP hai biến</h3>
<div class="callout"><p><b>Bài toán.</b> cực tiểu −x<sub>1</sub> − 2x<sub>2</sub> với x<sub>1</sub> + x<sub>2</sub> ≤ 4, −x<sub>1</sub> + 2x<sub>2</sub> ≤ 4, x<sub>1</sub> ≤ 3, x ⪰ 0 (m = 5).</p>
<p>Bước 1 (đáp án qua các đỉnh): hai đường x<sub>1</sub> + x<sub>2</sub> = 4 và −x<sub>1</sub> + 2x<sub>2</sub> = 4 cắt nhau tại x<sub>2</sub> = 8/3, x<sub>1</sub> = 4/3; mục tiêu −4/3 − 16/3 = −20/3 ≈ −6,6667; các đỉnh khác tệ hơn. Bước 2: xuất phát tại điểm trong (1, 1), t = 1. Bước 3: định tâm bằng Newton + backtracking giữ b − Ax &gt; 0; nhân t với 10 tới khi m/t &lt; 10<sup>−6</sup>.</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp

# LP: minimise c^T x subject to A x &lt;= b  (a small polygon)
c = np.array([-1.0, -2.0])
A = np.array([[1.0, 1.0], [-1.0, 2.0], [1.0, 0.0], [-1.0, 0.0], [0.0, -1.0]])
b = np.array([4.0, 4.0, 3.0, 0.0, 0.0])

def centering(t, x):                       # minimise t c^T x - sum log(b - A x) by Newton
    phi = lambda x: t * c @ x - np.sum(np.log(b - A @ x))
    for _ in range(50):
        s = b - A @ x
        g = t * c + A.T @ (1 / s); H = A.T @ np.diag(1 / s**2) @ A
        dx = -np.linalg.solve(H, g)
        if -g @ dx / 2 &lt; 1e-10: break
        step = 1.0
        while np.any(b - A @ (x + step * dx) &lt;= 0) or phi(x + step * dx) &gt; phi(x) + 0.25 * step * g @ dx:
            step *= 0.5
        x = x + step * dx
    return x

x, t, m = np.array([1.0, 1.0]), 1.0, len(b)   # strictly feasible start
print("   t       x*(t)              c^T x     gap bound m/t")
while m / t &gt; 1e-6:
    x = centering(t, x)
    print(f"{t:8.0f}  ({x[0]:.6f}, {x[1]:.6f})  {c @ x:.6f}   {m / t:.1e}")
    t *= 10

y = cp.Variable(2); p = cp.Problem(cp.Minimize(c @ y), [A @ y &lt;= b]); p.solve()
print("cvxpy:      x* =", y.value.round(6), " p* =", round(p.value, 6))</code></pre>
<div class="out">   t       x*(t)              c^T x     gap bound m/t
       1  (1.524804, 1.809783)  -5.144370   5.0e+00
      10  (1.381291, 2.544827)  -6.470945   5.0e-01
     100  (1.338319, 2.654194)  -6.646706   5.0e-02
    1000  (1.333833, 2.665417)  -6.664667   5.0e-03
   10000  (1.333383, 2.666542)  -6.666467   5.0e-04
  100000  (1.333338, 2.666654)  -6.666647   5.0e-05
 1000000  (1.333334, 2.666665)  -6.666665   5.0e-06
cvxpy:      x* = [1.333333 2.666667]  p* = -6.666667</div>
<p>Các điểm trung tâm đi từ phần trong (1,52; 1,81) về đỉnh (4/3; 8/3), và ở mọi giai đoạn khoảng cách thật nằm dưới cận m/t (ở t = 10<sup>6</sup> khoảng cách là 2·10<sup>−6</sup> ≤ 5·10<sup>−6</sup>). Phương pháp barrier 30 dòng của ta khớp CVXPY.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Xuất phát từ điểm không khả thi chặt: φ không xác định ở đó. Tìm một điểm như thế là bài “pha I” (Boyd §11.4).</li><li>Để bước Newton rời khỏi miền: tìm bước phải co t trước cho tới khi b − A(x + tΔx) &gt; 0.</li><li>Chọn μ cực lớn để xong trong một giai đoạn: khi đó bài định tâm bắt đầu xa nghiệm và cần nhiều bước Newton tắt dần.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Hàm chắn log φ = −∑log(−f<sub>i</sub>) thay bất đẳng thức bằng bức tường trơn.</li><li>Đường trung tâm x*(t); khoảng cách ≤ m/t, với điểm đối ngẫu λ<sub>i</sub> = −1/(t f<sub>i</sub>).</li><li>Phương pháp barrier: định tâm bằng Newton, tăng t theo μ, dừng khi m/t &lt; ε.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://web.stanford.edu/class/ee364a/lectures/barrier.pdf" target="_blank" rel="noopener">Stanford EE364a — Bài 11: Phương pháp điểm trong (slide)</a></li><li><a href="https://www.stat.cmu.edu/~ryantibs/convexopt/lectures/barr-method.pdf" target="_blank" rel="noopener">CMU 10-725 — Barrier method</a></li><li><a href="https://en.wikipedia.org/wiki/Barrier_function" target="_blank" rel="noopener">Wikipedia — Barrier function</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Một biến: cực tiểu x với x ≥ 1. Tính x*(t) của bài barrier t·x − log(x − 1).</li><li>Một LP có m = 200 ràng buộc. t nào bảo đảm khoảng cách dưới 10<sup>−6</sup>? Với μ = 10 và t<sup>(0)</sup> = 1, cần bao nhiêu giai đoạn định tâm?</li><li>Vì sao λ<sub>i</sub> = −1/(t f<sub>i</sub>(x*(t))) dương?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) t − 1/(x − 1) = 0 ⇒ x*(t) = 1 + 1/t; khoảng cách 1/t = m/t với m = 1. 2) t ≥ 2·10<sup>8</sup>; 10<sup>k</sup> ≥ 2·10<sup>8</sup> ⇒ k = 9 lần tăng, tức 10 lần định tâm tính cả lần đầu. 3) f<sub>i</sub>(x*(t)) &lt; 0 chặt ở phần trong và t &gt; 0.</p></div>`);

const c83 = L('cvo201-ts-8-3',
  '8.3 — Primal–dual interior-point methods and how modern solvers work|||8.3 — Phương pháp điểm trong gốc–đối ngẫu và cách bộ giải hiện đại hoạt động',
  'Ý tưởng điểm trong gốc–đối ngẫu: KKT nhiễu λi fi(x) = −1/t, một bước Newton cho cả (x, λ, ν), độ phức tạp vài chục vòng; quy trình CVXPY → dạng nón → Clarabel/OSQP/HiGHS/SCS; đo số vòng lặp khi kích thước tăng (Boyd §11.7).',
  `<span class="eyebrow">CVO201 · Chapter 8 · Lesson 8.3</span>
<h2>Primal–dual interior-point methods and modern solvers</h2>
<p class="lead">The barrier method of Lesson 8.2 is the clearest way to understand interior-point methods. Production solvers use a refined version — primal–dual — and wrap it in a pipeline that starts from your CVXPY model. This lesson explains that pipeline at the idea level.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain the modified (perturbed) KKT conditions behind primal–dual methods.</li><li>Describe what CVXPY does between <code>prob.solve()</code> and the answer.</li><li>Observe that the number of interior-point iterations grows very slowly with problem size.</li><li>Choose a solver class sensibly.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Perturbed KKT.</strong> The central point x*(t) of Lesson 8.2 together with λ<sub>i</sub> = −1/(t f<sub>i</sub>) satisfies the KKT conditions of Lesson 5.3 with one change: complementary slackness λ<sub>i</sub>f<sub>i</sub>(x) = 0 is replaced by</p>
<div class="formula"><span class="lbl">Modified KKT (Boyd §11.3.4, §11.7)</span>∇f<sub>0</sub>(x) + ∑λ<sub>i</sub>∇f<sub>i</sub>(x) + A<sup>T</sup>ν = 0,   −λ<sub>i</sub>f<sub>i</sub>(x) = 1/t,   Ax = b,   f<sub>i</sub>(x) &lt; 0,  λ &gt; 0</div>
<p>A <strong>primal–dual interior-point method</strong> applies one Newton step to this system of equations in all variables (x, λ, ν) at once, then increases t — it does not solve each centering problem to completion. The iterates are not exactly on the central path but stay near it; the <em>surrogate duality gap</em> −∑λ<sub>i</sub>f<sub>i</sub>(x) measures progress. Modern variants (Mehrotra predictor–corrector, homogeneous self-dual embedding) add tricks that detect infeasibility and unboundedness automatically. The headline facts: each iteration costs one structured linear solve, and the number of iterations is typically <strong>10–50 regardless of size</strong>; theory guarantees O(√m log(1/ε)) iterations.</p>
<p><strong>The CVXPY pipeline.</strong> (1) Your model is checked against the DCP rules (Lesson 3.3). (2) It is <em>canonicalised</em>: every atom is replaced by its cone representation — norms become second-order cones, <code>quad_form</code> becomes a QP term or SOC, <code>lambda_max</code> becomes an LMI, <code>exp/log</code> become exponential cones. (3) The resulting conic problem is passed to a solver: <strong>Clarabel</strong> (interior point for LP/QP/SOCP/SDP/exponential cones; one of CVXPY's default solvers), <strong>OSQP</strong> (ADMM-based first-order QP solver, fast at moderate accuracy), <strong>HiGHS</strong> (simplex and interior point for LP/MILP), <strong>SCS</strong> (first-order conic solver for very large problems). (4) The solution and the dual values are mapped back to your variables and constraints.</p>
<h3>✍️ Worked example — iterations versus size</h3>
<div class="callout"><p><b>Experiment.</b> Random LPs minimise c<sup>T</sup>x s.t. Ax ⪯ b with n variables and m = 3n constraints, for n = 50, 100, 200, 400. We construct b so that a known point is strictly feasible and c = −A<sup>T</sup>y with y ⪰ 0 so the LP is bounded (by LP duality — Lesson 5.2).</p>
<p>Step 1: build the problem in CVXPY. Step 2: solve with Clarabel and read <code>prob.solver_stats.num_iters</code>. Step 3: time it. Prediction: iterations grow very slowly (8× more variables, not 8× more iterations); the time grows like the cost of the linear solves with these dense matrices.</p></div>
<pre><code class="language-python">import time
import numpy as np
import cvxpy as cp

rng = np.random.default_rng(11)
print("   n     m   solver     iterations   time (s)")
for n in [50, 100, 200, 400]:
    m = 3 * n
    A = rng.normal(size=(m, n)); x0 = rng.uniform(size=n)
    b = A @ x0 + rng.uniform(0.1, 1.0, size=m)      # x0 is strictly feasible
    c = -A.T @ rng.uniform(size=m)                  # keeps the LP bounded
    x = cp.Variable(n)
    prob = cp.Problem(cp.Minimize(c @ x), [A @ x &lt;= b])
    t0 = time.perf_counter(); prob.solve(solver=cp.CLARABEL); dt = time.perf_counter() - t0
    print(f"{n:4d}  {m:4d}   CLARABEL   {prob.solver_stats.num_iters:6d}       {dt:7.3f}")</code></pre>
<div class="out">   n     m   solver     iterations   time (s)
  50   150   CLARABEL       10         0.011
 100   300   CLARABEL       13         0.089
 200   600   CLARABEL       13         0.453
 400  1200   CLARABEL       15         2.673</div>
<p>Multiplying the size by 8 raised the iteration count only from 10 to 15, while the time per iteration grew because each Newton system is larger and dense. (Times depend on your machine; iteration counts may differ slightly between solver versions.)</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Blaming the solver for “slow” when the model is huge and dense; exploit sparsity (use <code>scipy.sparse</code> matrices) and the time drops dramatically.</li><li>Asking for 10<sup>−12</sup> accuracy from a first-order solver (SCS, OSQP); they are meant for moderate accuracy — use an interior-point solver for high accuracy.</li><li>Ignoring <code>prob.status</code> values such as <code>optimal_inaccurate</code>: the answer may be usable but should be checked.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Primal–dual IPM: Newton on the perturbed KKT system −λ<sub>i</sub>f<sub>i</sub> = 1/t, increasing t.</li><li>Tens of iterations, each a structured linear solve; O(√m log(1/ε)) in theory.</li><li>CVXPY: DCP check → cone canonicalisation → solver (Clarabel, OSQP, HiGHS, SCS) → map back primal and dual values.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.stat.cmu.edu/~ryantibs/convexopt/lectures/primal-dual.pdf" target="_blank" rel="noopener">CMU 10-725 — Primal-dual interior-point methods</a></li><li><a href="https://en.wikipedia.org/wiki/Interior-point_method" target="_blank" rel="noopener">Wikipedia — Interior-point method</a></li><li><a href="https://www.cvxpy.org/tutorial/solvers/index.html" target="_blank" rel="noopener">CVXPY — Solver features (which solver handles which cones)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Which KKT condition is relaxed in the primal–dual method, and to what?</li><li>A solver reports surrogate gap −∑λ<sub>i</sub>f<sub>i</sub> = 3·10<sup>−7</sup> at a primal and dual feasible point. What do you know about f<sub>0</sub>(x) − p*?</li><li>You need to solve 10<sup>5</sup> small QPs per second for a controller. Which solver type would you try first?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Complementary slackness λ<sub>i</sub>f<sub>i</sub> = 0 becomes −λ<sub>i</sub>f<sub>i</sub> = 1/t. 2) At a feasible primal–dual pair the gap bounds suboptimality: f<sub>0</sub>(x) − p* ≤ 3·10<sup>−7</sup>. 3) A specialised QP solver with warm starting, e.g. OSQP — moderate accuracy, very fast repeated solves.</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 8 · Bài 8.3</span>
<h2>Phương pháp điểm trong gốc–đối ngẫu và bộ giải hiện đại</h2>
<p class="lead">Phương pháp barrier ở Bài 8.2 là cách rõ nhất để hiểu phương pháp điểm trong. Bộ giải thực tế dùng bản tinh chỉnh — gốc–đối ngẫu — và bọc nó trong một quy trình bắt đầu từ mô hình CVXPY của bạn. Bài này giải thích quy trình đó ở mức ý tưởng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích điều kiện KKT nhiễu (biến đổi) đứng sau phương pháp gốc–đối ngẫu.</li><li>Mô tả CVXPY làm gì giữa <code>prob.solve()</code> và đáp án.</li><li>Quan sát số vòng lặp điểm trong tăng rất chậm theo kích thước bài.</li><li>Chọn loại bộ giải hợp lý.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>KKT nhiễu.</strong> Điểm trung tâm x*(t) ở Bài 8.2 cùng λ<sub>i</sub> = −1/(t f<sub>i</sub>) thoả điều kiện KKT của Bài 5.3 với một thay đổi: tính bù trừ λ<sub>i</sub>f<sub>i</sub>(x) = 0 được thay bằng</p>
<div class="formula"><span class="lbl">KKT biến đổi (Boyd §11.3.4, §11.7)</span>∇f<sub>0</sub>(x) + ∑λ<sub>i</sub>∇f<sub>i</sub>(x) + A<sup>T</sup>ν = 0,   −λ<sub>i</sub>f<sub>i</sub>(x) = 1/t,   Ax = b,   f<sub>i</sub>(x) &lt; 0,  λ &gt; 0</div>
<p><strong>Phương pháp điểm trong gốc–đối ngẫu</strong> áp một bước Newton cho hệ phương trình này theo mọi biến (x, λ, ν) cùng lúc, rồi tăng t — nó không giải trọn từng bài định tâm. Các điểm lặp không nằm đúng trên đường trung tâm nhưng ở gần nó; <em>khoảng cách đối ngẫu thay thế</em> −∑λ<sub>i</sub>f<sub>i</sub>(x) đo tiến độ. Các biến thể hiện đại (dự báo–hiệu chỉnh Mehrotra, nhúng tự đối ngẫu thuần nhất) thêm mẹo tự phát hiện vô nghiệm và không bị chặn. Điểm chính: mỗi vòng tốn một lần giải hệ tuyến tính có cấu trúc, và số vòng lặp thường <strong>10–50 bất kể kích thước</strong>; lý thuyết bảo đảm O(√m log(1/ε)) vòng.</p>
<p><strong>Quy trình CVXPY.</strong> (1) Mô hình được kiểm theo luật DCP (Bài 3.3). (2) Nó được <em>chính tắc hoá</em>: mỗi nguyên tử thay bằng biểu diễn nón của nó — chuẩn thành nón bậc hai, <code>quad_form</code> thành số hạng QP hay SOC, <code>lambda_max</code> thành LMI, <code>exp/log</code> thành nón mũ. (3) Bài nón thu được chuyển cho bộ giải: <strong>Clarabel</strong> (điểm trong cho LP/QP/SOCP/SDP/nón mũ; một trong các bộ giải mặc định của CVXPY), <strong>OSQP</strong> (bộ giải QP bậc một dựa trên ADMM, nhanh ở độ chính xác vừa phải), <strong>HiGHS</strong> (đơn hình và điểm trong cho LP/MILP), <strong>SCS</strong> (bộ giải nón bậc một cho bài rất lớn). (4) Nghiệm và giá trị đối ngẫu được ánh xạ ngược về biến và ràng buộc của bạn.</p>
<h3>✍️ Ví dụ giải từng bước — số vòng lặp theo kích thước</h3>
<div class="callout"><p><b>Thí nghiệm.</b> LP ngẫu nhiên cực tiểu c<sup>T</sup>x với Ax ⪯ b, n biến và m = 3n ràng buộc, với n = 50, 100, 200, 400. Ta dựng b sao cho một điểm biết trước khả thi chặt và c = −A<sup>T</sup>y với y ⪰ 0 để LP bị chặn (theo đối ngẫu LP — Bài 5.2).</p>
<p>Bước 1: dựng bài trong CVXPY. Bước 2: giải bằng Clarabel và đọc <code>prob.solver_stats.num_iters</code>. Bước 3: đo thời gian. Dự đoán: số vòng tăng rất chậm (biến nhiều gấp 8 chứ vòng không gấp 8); thời gian tăng theo chi phí giải hệ tuyến tính với các ma trận đặc này.</p></div>
<pre><code class="language-python">import time
import numpy as np
import cvxpy as cp

rng = np.random.default_rng(11)
print("   n     m   solver     iterations   time (s)")
for n in [50, 100, 200, 400]:
    m = 3 * n
    A = rng.normal(size=(m, n)); x0 = rng.uniform(size=n)
    b = A @ x0 + rng.uniform(0.1, 1.0, size=m)      # x0 is strictly feasible
    c = -A.T @ rng.uniform(size=m)                  # keeps the LP bounded
    x = cp.Variable(n)
    prob = cp.Problem(cp.Minimize(c @ x), [A @ x &lt;= b])
    t0 = time.perf_counter(); prob.solve(solver=cp.CLARABEL); dt = time.perf_counter() - t0
    print(f"{n:4d}  {m:4d}   CLARABEL   {prob.solver_stats.num_iters:6d}       {dt:7.3f}")</code></pre>
<div class="out">   n     m   solver     iterations   time (s)
  50   150   CLARABEL       10         0.011
 100   300   CLARABEL       13         0.089
 200   600   CLARABEL       13         0.453
 400  1200   CLARABEL       15         2.673</div>
<p>Tăng kích thước 8 lần chỉ làm số vòng tăng từ 10 lên 15, còn thời gian mỗi vòng tăng vì mỗi hệ Newton lớn hơn và đặc. (Thời gian phụ thuộc máy của bạn; số vòng có thể hơi khác giữa các phiên bản bộ giải.)</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đổ lỗi bộ giải “chậm” khi mô hình khổng lồ và đặc; hãy khai thác tính thưa (dùng ma trận <code>scipy.sparse</code>) và thời gian giảm mạnh.</li><li>Đòi độ chính xác 10<sup>−12</sup> từ bộ giải bậc một (SCS, OSQP); chúng dành cho độ chính xác vừa phải — dùng bộ giải điểm trong khi cần chính xác cao.</li><li>Bỏ qua các trạng thái như <code>optimal_inaccurate</code>: đáp án có thể dùng được nhưng phải kiểm lại.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>IPM gốc–đối ngẫu: Newton trên hệ KKT nhiễu −λ<sub>i</sub>f<sub>i</sub> = 1/t, tăng dần t.</li><li>Vài chục vòng, mỗi vòng một lần giải hệ tuyến tính có cấu trúc; lý thuyết O(√m log(1/ε)).</li><li>CVXPY: kiểm DCP → chính tắc hoá thành nón → bộ giải (Clarabel, OSQP, HiGHS, SCS) → ánh xạ ngược nghiệm gốc và đối ngẫu.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.stat.cmu.edu/~ryantibs/convexopt/lectures/primal-dual.pdf" target="_blank" rel="noopener">CMU 10-725 — Primal-dual interior-point methods</a></li><li><a href="https://en.wikipedia.org/wiki/Interior-point_method" target="_blank" rel="noopener">Wikipedia — Interior-point method</a></li><li><a href="https://www.cvxpy.org/tutorial/solvers/index.html" target="_blank" rel="noopener">CVXPY — Solver features (bộ giải nào xử lý nón nào)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Điều kiện KKT nào được nới trong phương pháp gốc–đối ngẫu, và nới thành gì?</li><li>Bộ giải báo khoảng cách thay thế −∑λ<sub>i</sub>f<sub>i</sub> = 3·10<sup>−7</sup> tại một cặp điểm khả thi gốc và đối ngẫu. Bạn biết gì về f<sub>0</sub>(x) − p*?</li><li>Bạn cần giải 10<sup>5</sup> QP nhỏ mỗi giây cho một bộ điều khiển. Bạn thử loại bộ giải nào trước?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Tính bù trừ λ<sub>i</sub>f<sub>i</sub> = 0 thành −λ<sub>i</sub>f<sub>i</sub> = 1/t. 2) Tại cặp gốc–đối ngẫu khả thi, khoảng cách chặn độ kém tối ưu: f<sub>0</sub>(x) − p* ≤ 3·10<sup>−7</sup>. 3) Bộ giải QP chuyên dụng có khởi động ấm, vd OSQP — độ chính xác vừa phải, giải lặp lại rất nhanh.</p></div>`);

const q8 = QZ(8, 'Quiz — Chapter 8: Equality constraints and interior-point methods|||Quiz — Chương 8: Ràng buộc đẳng thức và phương pháp điểm trong',
  'Kiểm tra điều kiện tối ưu có đẳng thức, hệ KKT, Newton có đẳng thức, hàm chắn log, đường trung tâm, cận m/t, IPM gốc–đối ngẫu, quy trình CVXPY.', [
  Q('q1', 'For minimise f(x) s.t. Ax = b (convex f), x* is optimal iff|||Với cực tiểu f(x) s.t. Ax = b (f lồi), x* tối ưu khi và chỉ khi',
    ['∇f(x*) = 0|||∇f(x*) = 0', 'Ax* = b and ∇f(x*) + Aᵀν = 0 for some ν|||Ax* = b và ∇f(x*) + Aᵀν = 0 với ν nào đó', 'Ax* = 0|||Ax* = 0', 'f(x*) = 0|||f(x*) = 0'], 1,
    'KKT without inequalities.|||KKT không có bất đẳng thức.'),
  Q('q2', 'An equality-constrained QP can be solved by|||QP có ràng buộc đẳng thức giải được bằng',
    ['one linear KKT system|||một hệ KKT tuyến tính', 'gradient descent only|||chỉ gradient descent', 'the simplex method only|||chỉ phương pháp đơn hình', 'it has no solution|||nó không có nghiệm'], 0,
    '[[P, Aᵀ], [A, 0]] [x; ν] = [−q; b].|||[[P, Aᵀ], [A, 0]] [x; ν] = [−q; b].'),
  Q('q3', 'In feasible-start Newton with equality constraints, the step satisfies|||Trong Newton có đẳng thức xuất phát khả thi, bước thoả',
    ['AΔx = b|||AΔx = b', 'AΔx = 0|||AΔx = 0', 'Δx = 0|||Δx = 0', '‖Δx‖ = 1|||‖Δx‖ = 1'], 1,
    'So every iterate stays on the affine set Ax = b.|||Nên mọi điểm lặp ở lại trên tập affine Ax = b.'),
  Q('q4', 'The log barrier for constraints fᵢ(x) ≤ 0 is|||Hàm chắn log cho các ràng buộc fᵢ(x) ≤ 0 là',
    ['∑ log fᵢ(x)|||∑ log fᵢ(x)', '−∑ log(−fᵢ(x))|||−∑ log(−fᵢ(x))', '∑ fᵢ(x)²|||∑ fᵢ(x)²', 'max fᵢ(x)|||max fᵢ(x)'], 1,
    'It is +∞ at the boundary and convex inside.|||Nó bằng +∞ ở biên và lồi bên trong.'),
  Q('q5', 'On the central path, the duality gap satisfies|||Trên đường trung tâm, khoảng cách đối ngẫu thoả',
    ['f₀(x*(t)) − p* ≤ m/t|||f₀(x*(t)) − p* ≤ m/t', 'f₀(x*(t)) − p* = 0|||f₀(x*(t)) − p* = 0', 'f₀(x*(t)) − p* ≤ t/m|||f₀(x*(t)) − p* ≤ t/m', 'it is unknown|||không biết được'], 0,
    'λᵢ = −1/(t fᵢ) is dual feasible with gap m/t.|||λᵢ = −1/(t fᵢ) khả thi đối ngẫu với khoảng cách m/t.'),
  Q('q6', 'In the barrier method, after each centering step we|||Trong phương pháp barrier, sau mỗi lần định tâm ta',
    ['decrease t|||giảm t', 'increase t by a factor μ > 1|||tăng t theo hệ số μ > 1', 'restart from x = 0|||khởi động lại từ x = 0', 'remove a constraint|||bỏ một ràng buộc'], 1,
    'Larger t means a thinner barrier and a smaller gap bound.|||t lớn hơn nghĩa là bức tường mỏng hơn và cận khoảng cách nhỏ hơn.'),
  Q('q7', 'The barrier method requires a starting point that is|||Phương pháp barrier đòi điểm xuất phát',
    ['optimal|||tối ưu', 'strictly feasible|||khả thi chặt', 'on the boundary|||nằm trên biên', 'infeasible|||không khả thi'], 1,
    'The barrier is undefined outside the interior; phase I finds such a point.|||Hàm chắn không xác định ngoài phần trong; pha I tìm điểm như thế.'),
  Q('q8', 'Primal–dual interior-point methods replace complementary slackness by|||Phương pháp điểm trong gốc–đối ngẫu thay tính bù trừ bằng',
    ['λᵢ = 0|||λᵢ = 0', '−λᵢ fᵢ(x) = 1/t|||−λᵢ fᵢ(x) = 1/t', 'fᵢ(x) = 0|||fᵢ(x) = 0', 'λᵢ = t|||λᵢ = t'], 1,
    'The perturbed KKT system, solved by Newton steps.|||Hệ KKT nhiễu, giải bằng các bước Newton.'),
  Q('q9', 'Typical number of interior-point iterations as problem size grows is|||Số vòng lặp điểm trong điển hình khi bài toán lớn lên',
    ['proportional to n|||tỉ lệ với n', 'roughly constant, tens of iterations|||gần như không đổi, vài chục vòng', 'exponential in n|||mũ theo n', 'always exactly n|||luôn đúng bằng n'], 1,
    'Each iteration costs more, but the count grows very slowly.|||Mỗi vòng đắt hơn, nhưng số vòng tăng rất chậm.'),
  Q('q10', 'Which solver is a first-order (ADMM-based) QP solver used by CVXPY?|||Bộ giải nào là bộ giải QP bậc một (dựa trên ADMM) mà CVXPY dùng?',
    ['HiGHS|||HiGHS', 'OSQP|||OSQP', 'Clarabel|||Clarabel', 'BFGS|||BFGS'], 1,
    'Clarabel is interior point; HiGHS is simplex/IPM for LP; BFGS is not a QP solver.|||Clarabel là điểm trong; HiGHS là đơn hình/IPM cho LP; BFGS không phải bộ giải QP.'),
]);

const ch8 = {
  title: 'Chapter 8 — Equality constraints and interior-point methods|||Chương 8 — Ràng buộc đẳng thức và phương pháp điểm trong',
  description: 'Điều kiện tối ưu và hệ KKT với ràng buộc đẳng thức, Newton có đẳng thức, hàm chắn log, đường trung tâm, phương pháp barrier, ý tưởng điểm trong gốc–đối ngẫu và quy trình của CVXPY/Clarabel (Boyd Ch. 10–11 · EE364a bài 10–11).',
  lessons: [c81, c82, c83, q8],
};


// ───────────────────────────── Chương 9 — Phương pháp bậc một cho học máy ─────────────────────────────
const c91 = L('cvo201-ts-9-1',
  '9.1 — Stochastic gradient descent: empirical risk, mini-batches and learning-rate schedules|||9.1 — SGD: rủi ro thực nghiệm, mini-batch và lịch learning rate',
  'Cực tiểu rủi ro thực nghiệm (1/n)∑ℓi(w), gradient ngẫu nhiên không chệch, SGD và mini-batch, vì sao bước cố định dừng ở một “vùng nhiễu”, lịch giảm learning rate, so sánh full-batch/SGD/mini-batch trên 10.000 điểm (CMU 10-725 SGD).',
  `<span class="eyebrow">CVO201 · Chapter 9 · Lesson 9.1</span>
<h2>Stochastic gradient descent</h2>
<p class="lead">When the objective is an average over millions of data points, even one exact gradient is expensive. SGD replaces it by a cheap, noisy estimate from a few points — and this is how essentially every neural network is trained.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write training as empirical risk minimisation (ERM).</li><li>Explain why a mini-batch gradient is an unbiased estimate of the full gradient.</li><li>Explain the noise floor of constant-step SGD and the role of decaying learning rates.</li><li>Compare full-batch GD, SGD and mini-batch SGD per epoch.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Empirical risk minimisation</span>minimize F(w) = (1/n) ∑<sub>i=1</sub><sup>n</sup> ℓ<sub>i</sub>(w)      ∇F(w) = (1/n) ∑ ∇ℓ<sub>i</sub>(w)  costs n gradient evaluations</div>
<p>Least squares, logistic regression and the SVM (Lessons 6.1–6.4) all have this form with convex ℓ<sub>i</sub>. <strong>SGD</strong> picks a random index (or a random mini-batch B of size b) and steps along its gradient:</p>
<div class="formula"><span class="lbl">Mini-batch SGD</span>w<sub>k+1</sub> = w<sub>k</sub> − η<sub>k</sub> · (1/b) ∑<sub>i∈B<sub>k</sub></sub> ∇ℓ<sub>i</sub>(w<sub>k</sub>)      E[ mini-batch gradient ] = ∇F(w<sub>k</sub>)</div>
<p>The estimate is <strong>unbiased</strong> but noisy; its variance shrinks like 1/b. One pass through the data (an <strong>epoch</strong>) gives n/b updates instead of one. Far from the optimum, all ∇ℓ<sub>i</sub> roughly agree and SGD makes rapid progress for a fraction of the cost. Near the optimum the individual gradients disagree (∇F(w*) = 0 but ∇ℓ<sub>i</sub>(w*) ≠ 0), so with a constant step η the iterates keep bouncing in a <strong>noise ball</strong> whose size is proportional to η. To converge exactly, the step must decrease: classical conditions ∑η<sub>k</sub> = ∞, ∑η<sub>k</sub><sup>2</sup> &lt; ∞, e.g. η<sub>k</sub> = η<sub>0</sub>/(1 + ck). For convex problems SGD then converges at rate O(1/√k) (O(1/k) if strongly convex) — slower per iteration than GD, but each iteration is n/b times cheaper.</p>
<p>In practice: shuffle the data each epoch, use mini-batches (32–1024) for hardware efficiency, tune η<sub>0</sub> (too large diverges as in Lesson 7.1), and use a schedule (step decay, 1/k, cosine) or an adaptive method (momentum, Adam — Lesson 9.2).</p>
<h3>✍️ Worked example — least squares with n = 10,000</h3>
<div class="callout"><p><b>Problem.</b> F(w) = (1/2n)‖Xw − y‖<sup>2</sup> with 10,000 samples, 5 features, noise variance 1. The optimum F* ≈ 0.5 (half the noise variance).</p>
<p>Step 1: compute F* exactly with <code>lstsq</code>. Step 2: run 5 epochs each of (a) full-batch GD with η = 0.5 (5 updates), (b) SGD with b = 1 and constant η = 0.01 (50,000 updates), (c) SGD with b = 1 and decaying η<sub>k</sub> = 0.05/(1 + 0.01k), (d) mini-batch b = 64, η = 0.1 (785 updates). Step 3: compare F − F* at equal data passes.</p></div>
<pre><code class="language-python">import numpy as np

rng = np.random.default_rng(12)
n, d = 10_000, 5
X = rng.normal(size=(n, d)); w_true = np.arange(1, d + 1, dtype=float)
y = X @ w_true + rng.normal(size=n)
w_ls = np.linalg.lstsq(X, y, rcond=None)[0]
loss = lambda w: 0.5 * np.mean((X @ w - y) ** 2)
print("least-squares optimum loss:", round(loss(w_ls), 5))

def run(batch, lr, epochs=5, decay=False):
    w = np.zeros(d); steps = 0
    for ep in range(epochs):
        idx = rng.permutation(n)
        for s in range(0, n, batch):
            B = idx[s:s + batch]
            g = X[B].T @ (X[B] @ w - y[B]) / len(B)      # gradient on the mini-batch
            eta = lr / (1 + 0.01 * steps) if decay else lr
            w -= eta * g; steps += 1
    return loss(w), steps

for name, batch, lr, decay in [("full-batch GD", n, 0.5, False), ("SGD b=1, lr 0.01", 1, 0.01, False),
                               ("SGD b=1, decaying", 1, 0.05, True), ("mini-batch b=64", 64, 0.1, False)]:
    L, steps = run(batch, lr, decay=decay)
    print(f"{name:20s}: loss after 5 epochs = {L:.5f}  ({steps} updates)")</code></pre>
<div class="out">least-squares optimum loss: 0.50274
full-batch GD       : loss after 5 epochs = 0.52884  (5 updates)
SGD b=1, lr 0.01    : loss after 5 epochs = 0.51113  (50000 updates)
SGD b=1, decaying   : loss after 5 epochs = 0.50275  (50000 updates)
mini-batch b=64     : loss after 5 epochs = 0.50444  (785 updates)</div>
<p>With the same five passes over the data, full-batch GD is still far away (0.529 vs 0.503) because it made only five steps. Constant-step SGD stalls at its noise floor (0.511); the decaying schedule reaches 0.50275, within 10<sup>−5</sup> of the optimum; mini-batches give a good compromise with only 785 updates, which vectorise well on real hardware.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Not shuffling data that are sorted (e.g. by label): consecutive mini-batches are then biased.</li><li>Judging convergence from the noisy mini-batch loss; evaluate the full (or validation) loss periodically.</li><li>Keeping the learning rate constant and wondering why the loss plateaus — that is the noise ball.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>ERM: F = average of per-example losses; SGD uses an unbiased stochastic gradient.</li><li>Constant step ⇒ convergence to a noise ball ∝ η; decaying steps ⇒ convergence.</li><li>Rates O(1/√k) (convex) and O(1/k) (strongly convex) per stochastic step.</li><li>Mini-batches trade variance for parallelism.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.stat.cmu.edu/~ryantibs/convexopt/lectures/stochastic-gd.pdf" target="_blank" rel="noopener">CMU 10-725 — Stochastic gradient descent</a></li><li><a href="https://scikit-learn.org/stable/modules/sgd.html" target="_blank" rel="noopener">scikit-learn — Stochastic Gradient Descent (user guide)</a></li><li><a href="https://en.wikipedia.org/wiki/Stochastic_gradient_descent" target="_blank" rel="noopener">Wikipedia — Stochastic gradient descent</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Show that for a uniformly random index i, E[∇ℓ<sub>i</sub>(w)] = ∇F(w).</li><li>n = 10<sup>6</sup>, b = 100. How many updates per epoch? How many per epoch for full-batch GD?</li><li>Does η<sub>k</sub> = 1/k satisfy ∑η<sub>k</sub> = ∞ and ∑η<sub>k</sub><sup>2</sup> &lt; ∞? Does η<sub>k</sub> = 1/k<sup>2</sup>?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) E[∇ℓ<sub>i</sub>] = ∑(1/n)∇ℓ<sub>i</sub> = ∇F. 2) 10<sup>4</sup> updates per epoch; full-batch GD makes 1. 3) 1/k: yes and yes (harmonic series diverges, ∑1/k<sup>2</sup> = π<sup>2</sup>/6). 1/k<sup>2</sup>: ∑η<sub>k</sub> &lt; ∞, so the steps die out too fast and SGD may stop short of the optimum.</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 9 · Bài 9.1</span>
<h2>Stochastic gradient descent</h2>
<p class="lead">Khi mục tiêu là trung bình trên hàng triệu điểm dữ liệu, ngay một gradient chính xác cũng đắt. SGD thay nó bằng một ước lượng rẻ, có nhiễu từ vài điểm — và đó là cách gần như mọi mạng nơ-ron được huấn luyện.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết bài huấn luyện thành cực tiểu rủi ro thực nghiệm (ERM).</li><li>Giải thích vì sao gradient mini-batch là ước lượng không chệch của gradient đầy đủ.</li><li>Giải thích “sàn nhiễu” của SGD bước cố định và vai trò của learning rate giảm dần.</li><li>So sánh GD full-batch, SGD và SGD mini-batch theo mỗi epoch.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Cực tiểu rủi ro thực nghiệm</span>minimize F(w) = (1/n) ∑<sub>i=1</sub><sup>n</sup> ℓ<sub>i</sub>(w)      ∇F(w) = (1/n) ∑ ∇ℓ<sub>i</sub>(w)  tốn n lần tính gradient</div>
<p>Bình phương tối thiểu, hồi quy logistic và SVM (Bài 6.1–6.4) đều có dạng này với ℓ<sub>i</sub> lồi. <strong>SGD</strong> chọn một chỉ số ngẫu nhiên (hoặc một mini-batch B cỡ b) và bước theo gradient của nó:</p>
<div class="formula"><span class="lbl">SGD mini-batch</span>w<sub>k+1</sub> = w<sub>k</sub> − η<sub>k</sub> · (1/b) ∑<sub>i∈B<sub>k</sub></sub> ∇ℓ<sub>i</sub>(w<sub>k</sub>)      E[ gradient mini-batch ] = ∇F(w<sub>k</sub>)</div>
<p>Ước lượng <strong>không chệch</strong> nhưng có nhiễu; phương sai giảm như 1/b. Một lượt qua dữ liệu (một <strong>epoch</strong>) cho n/b lần cập nhật thay vì một. Khi còn xa tối ưu, mọi ∇ℓ<sub>i</sub> gần như cùng hướng và SGD tiến nhanh với một phần nhỏ chi phí. Gần tối ưu các gradient riêng lẻ bất đồng (∇F(w*) = 0 nhưng ∇ℓ<sub>i</sub>(w*) ≠ 0), nên với bước cố định η các điểm lặp cứ nảy trong một <strong>quả cầu nhiễu</strong> có kích thước tỉ lệ η. Muốn hội tụ chính xác, bước phải giảm dần: điều kiện cổ điển ∑η<sub>k</sub> = ∞, ∑η<sub>k</sub><sup>2</sup> &lt; ∞, vd η<sub>k</sub> = η<sub>0</sub>/(1 + ck). Với bài lồi SGD khi đó hội tụ tốc độ O(1/√k) (O(1/k) nếu lồi mạnh) — chậm hơn GD tính theo vòng, nhưng mỗi vòng rẻ hơn n/b lần.</p>
<p>Thực hành: xáo trộn dữ liệu mỗi epoch, dùng mini-batch (32–1024) cho hiệu quả phần cứng, tinh chỉnh η<sub>0</sub> (quá lớn sẽ phân kỳ như Bài 7.1), và dùng lịch giảm (giảm theo bậc, 1/k, cosine) hoặc phương pháp thích nghi (momentum, Adam — Bài 9.2).</p>
<h3>✍️ Ví dụ giải từng bước — bình phương tối thiểu với n = 10.000</h3>
<div class="callout"><p><b>Bài toán.</b> F(w) = (1/2n)‖Xw − y‖<sup>2</sup> với 10.000 mẫu, 5 đặc trưng, phương sai nhiễu 1. Tối ưu F* ≈ 0,5 (một nửa phương sai nhiễu).</p>
<p>Bước 1: tính F* chính xác bằng <code>lstsq</code>. Bước 2: chạy mỗi cách 5 epoch: (a) GD full-batch với η = 0,5 (5 cập nhật), (b) SGD b = 1, η cố định 0,01 (50.000 cập nhật), (c) SGD b = 1 với η<sub>k</sub> = 0,05/(1 + 0,01k) giảm dần, (d) mini-batch b = 64, η = 0,1 (785 cập nhật). Bước 3: so F − F* khi cùng số lượt qua dữ liệu.</p></div>
<pre><code class="language-python">import numpy as np

rng = np.random.default_rng(12)
n, d = 10_000, 5
X = rng.normal(size=(n, d)); w_true = np.arange(1, d + 1, dtype=float)
y = X @ w_true + rng.normal(size=n)
w_ls = np.linalg.lstsq(X, y, rcond=None)[0]
loss = lambda w: 0.5 * np.mean((X @ w - y) ** 2)
print("least-squares optimum loss:", round(loss(w_ls), 5))

def run(batch, lr, epochs=5, decay=False):
    w = np.zeros(d); steps = 0
    for ep in range(epochs):
        idx = rng.permutation(n)
        for s in range(0, n, batch):
            B = idx[s:s + batch]
            g = X[B].T @ (X[B] @ w - y[B]) / len(B)      # gradient on the mini-batch
            eta = lr / (1 + 0.01 * steps) if decay else lr
            w -= eta * g; steps += 1
    return loss(w), steps

for name, batch, lr, decay in [("full-batch GD", n, 0.5, False), ("SGD b=1, lr 0.01", 1, 0.01, False),
                               ("SGD b=1, decaying", 1, 0.05, True), ("mini-batch b=64", 64, 0.1, False)]:
    L, steps = run(batch, lr, decay=decay)
    print(f"{name:20s}: loss after 5 epochs = {L:.5f}  ({steps} updates)")</code></pre>
<div class="out">least-squares optimum loss: 0.50274
full-batch GD       : loss after 5 epochs = 0.52884  (5 updates)
SGD b=1, lr 0.01    : loss after 5 epochs = 0.51113  (50000 updates)
SGD b=1, decaying   : loss after 5 epochs = 0.50275  (50000 updates)
mini-batch b=64     : loss after 5 epochs = 0.50444  (785 updates)</div>
<p>Cùng năm lượt qua dữ liệu, GD full-batch vẫn còn xa (0,529 so với 0,503) vì nó chỉ đi năm bước. SGD bước cố định kẹt ở sàn nhiễu (0,511); lịch giảm dần đạt 0,50275, cách tối ưu chưa tới 10<sup>−5</sup>; mini-batch là thoả hiệp tốt với chỉ 785 cập nhật, vốn vector hoá tốt trên phần cứng thật.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Không xáo trộn dữ liệu đã sắp xếp (vd theo nhãn): các mini-batch liên tiếp khi đó bị lệch.</li><li>Đánh giá hội tụ bằng mất mát mini-batch đầy nhiễu; hãy định kỳ tính mất mát đầy đủ (hoặc trên tập kiểm định).</li><li>Giữ learning rate cố định rồi thắc mắc vì sao mất mát đi ngang — đó là quả cầu nhiễu.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>ERM: F = trung bình mất mát từng mẫu; SGD dùng gradient ngẫu nhiên không chệch.</li><li>Bước cố định ⇒ hội tụ tới quả cầu nhiễu ∝ η; bước giảm dần ⇒ hội tụ.</li><li>Tốc độ O(1/√k) (lồi) và O(1/k) (lồi mạnh) theo số bước ngẫu nhiên.</li><li>Mini-batch đổi phương sai lấy tính song song.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.stat.cmu.edu/~ryantibs/convexopt/lectures/stochastic-gd.pdf" target="_blank" rel="noopener">CMU 10-725 — Stochastic gradient descent</a></li><li><a href="https://scikit-learn.org/stable/modules/sgd.html" target="_blank" rel="noopener">scikit-learn — Stochastic Gradient Descent (hướng dẫn)</a></li><li><a href="https://en.wikipedia.org/wiki/Stochastic_gradient_descent" target="_blank" rel="noopener">Wikipedia — Stochastic gradient descent</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Chứng minh với chỉ số i ngẫu nhiên đều, E[∇ℓ<sub>i</sub>(w)] = ∇F(w).</li><li>n = 10<sup>6</sup>, b = 100. Bao nhiêu cập nhật mỗi epoch? GD full-batch thì bao nhiêu?</li><li>η<sub>k</sub> = 1/k có thoả ∑η<sub>k</sub> = ∞ và ∑η<sub>k</sub><sup>2</sup> &lt; ∞ không? Còn η<sub>k</sub> = 1/k<sup>2</sup>?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) E[∇ℓ<sub>i</sub>] = ∑(1/n)∇ℓ<sub>i</sub> = ∇F. 2) 10<sup>4</sup> cập nhật mỗi epoch; GD full-batch được 1. 3) 1/k: có và có (chuỗi điều hoà phân kỳ, ∑1/k<sup>2</sup> = π<sup>2</sup>/6). 1/k<sup>2</sup>: ∑η<sub>k</sub> &lt; ∞, bước tắt quá nhanh và SGD có thể dừng trước tối ưu.</p></div>`);

const c92 = L('cvo201-ts-9-2',
  '9.2 — Momentum and Nesterov acceleration: beating the condition number|||9.2 — Momentum và gia tốc Nesterov: vượt qua số điều kiện',
  'Heavy-ball momentum, gradient tăng tốc Nesterov, tốc độ phụ thuộc √κ thay vì κ, chọn hệ số momentum, liên hệ Adam/RMSProp; đo số vòng trên hàm toàn phương κ = 100 (CMU 10-725, Distill “Why Momentum Really Works”).',
  `<span class="eyebrow">CVO201 · Chapter 9 · Lesson 9.2</span>
<h2>Momentum and Nesterov acceleration</h2>
<p class="lead">Gradient descent needs about κ iterations (Lesson 7.1). A tiny change — remembering the previous step — brings this down to about √κ. For κ = 10,000 that is the difference between 10,000 and 100 iterations.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write the heavy-ball (Polyak) momentum and the Nesterov accelerated gradient updates.</li><li>Explain why momentum helps in narrow valleys.</li><li>State the accelerated rates and compare iteration counts on an ill-conditioned quadratic.</li><li>Relate momentum to the optimizers used in deep learning.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Heavy-ball momentum</span>v<sub>k+1</sub> = β v<sub>k</sub> − t ∇f(x<sub>k</sub>),      x<sub>k+1</sub> = x<sub>k</sub> + v<sub>k+1</sub>      (0 ≤ β &lt; 1)</div>
<p>The velocity v is an exponentially weighted sum of past gradients. In a narrow valley the gradient components across the valley alternate in sign and cancel in v, while the small component along the valley keeps the same sign and accumulates — the iterate rolls along the valley floor instead of zig-zagging. On quadratics, with t and β tuned to L and μ, heavy-ball converges like (1 − c/√κ)<sup>k</sup>.</p>
<div class="formula"><span class="lbl">Nesterov accelerated gradient (strongly convex version)</span>x<sub>k+1</sub> = y<sub>k</sub> − (1/L)∇f(y<sub>k</sub>),      y<sub>k+1</sub> = x<sub>k+1</sub> + q(x<sub>k+1</sub> − x<sub>k</sub>),   q = (√L − √μ)/(√L + √μ)</div>
<p>Nesterov evaluates the gradient at the <em>look-ahead</em> point y, which makes acceleration provable for all smooth convex functions, not only quadratics: f(x<sub>k</sub>) − p* = O(1/k<sup>2</sup>) for convex L-smooth f (versus O(1/k) for GD) and O((1 − 1/√κ)<sup>k</sup>) for strongly convex f. These rates are optimal: no method that only uses gradients can do better in the worst case (Nesterov's lower bound; see Bubeck's monograph). The price: the objective no longer decreases monotonically.</p>
<p><strong>In deep learning</strong> “SGD with momentum” (β ≈ 0.9) and Nesterov momentum are standard; <strong>Adam</strong> combines momentum with per-coordinate step sizes scaled by a running average of squared gradients (an RMSProp-style diagonal preconditioner) — a cheap way to reduce the effective condition number.</p>
<h3>✍️ Worked example — κ = 100</h3>
<div class="callout"><p><b>Problem.</b> f(x) = ½(x<sub>1</sub><sup>2</sup> + 100x<sub>2</sub><sup>2</sup>): L = 100, μ = 1, κ = 100, start (1, 1), stop when f &lt; 10<sup>−10</sup>.</p>
<p>Step 1: GD with t = 1/L — prediction about κ·ln(10<sup>10</sup>)/2 ≈ 100·11.5 ≈ 1150 iterations. Step 2: heavy-ball with β = 0.5 and 0.9 (same t). Step 3: Nesterov with q = (10 − 1)/(10 + 1) = 9/11 ≈ 0.818 — prediction about √κ·11.5 ≈ 115 iterations.</p></div>
<pre><code class="language-python">import numpy as np

# ill-conditioned quadratic f(x) = 0.5 x^T diag(1, 100) x, kappa = 100
D = np.array([1.0, 100.0]); L, mu = 100.0, 1.0
f = lambda x: 0.5 * np.sum(D * x**2); grad = lambda x: D * x

def gd(x):
    for k in range(1, 5001):
        x = x - grad(x) / L
        if f(x) &lt; 1e-10: return k

def heavy_ball(x, beta):
    v = np.zeros_like(x)
    for k in range(1, 5001):
        v = beta * v - grad(x) / L
        x = x + v
        if f(x) &lt; 1e-10: return k

def nesterov(x):
    y, x_prev = x.copy(), x.copy()
    q = (np.sqrt(L) - np.sqrt(mu)) / (np.sqrt(L) + np.sqrt(mu))   # strongly convex momentum
    for k in range(1, 5001):
        x_new = y - grad(y) / L
        y = x_new + q * (x_new - x_prev); x_prev = x_new
        if f(x_new) &lt; 1e-10: return k

x0 = np.array([1.0, 1.0])
print("gradient descent, t = 1/L     :", gd(x0), "iterations")
for beta in [0.5, 0.9]:
    print(f"heavy-ball momentum beta = {beta}:", heavy_ball(x0, beta), "iterations")
print("Nesterov accelerated gradient :", nesterov(x0), "iterations")
print("sqrt(kappa) =", np.sqrt(L / mu), " vs kappa =", L / mu)</code></pre>
<div class="out">gradient descent, t = 1/L     : 1112 iterations
heavy-ball momentum beta = 0.5: 543 iterations
heavy-ball momentum beta = 0.9: 214 iterations
Nesterov accelerated gradient : 132 iterations
sqrt(kappa) = 10.0  vs kappa = 100.0</div>
<p>GD needs 1112 iterations, matching the prediction; heavy-ball with β = 0.9 needs 214; Nesterov 132 — almost an order of magnitude fewer, in line with √κ = 10 versus κ = 100.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Increasing β toward 1 without lowering the step: the iterates oscillate and may diverge.</li><li>Expecting monotone decrease from accelerated methods — small increases are normal (restart schemes exist).</li><li>Thinking Adam guarantees convergence on any problem; on some convex problems it needs care with the step schedule.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Momentum accumulates gradients, damping zig-zags across narrow valleys.</li><li>Nesterov: gradient at a look-ahead point; O(1/k<sup>2</sup>) convex, (1 − 1/√κ)<sup>k</sup> strongly convex — optimal for first-order methods.</li><li>Iterations ∝ √κ instead of κ.</li><li>SGD + momentum and Adam are the deep-learning descendants.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://distill.pub/2017/momentum/" target="_blank" rel="noopener">Distill — Why Momentum Really Works (interactive article)</a></li><li><a href="https://www.ruder.io/optimizing-gradient-descent/" target="_blank" rel="noopener">Sebastian Ruder — An overview of gradient descent optimization algorithms</a></li><li><a href="https://www.deeplearningbook.org/contents/optimization.html" target="_blank" rel="noopener">Goodfellow, Bengio, Courville — Deep Learning, Ch. 8: Optimization for training deep models</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Compute q for κ = 10,000. About how many iterations does Nesterov need versus GD for 10<sup>−10</sup>?</li><li>Write two heavy-ball steps from x<sub>0</sub> = 1, v<sub>0</sub> = 0 for f(x) = x<sup>2</sup>/2 with t = 0.5, β = 0.5.</li><li>Why does averaging gradients cancel the components across a valley?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) √κ = 100, q = 99/101 ≈ 0.980; roughly 100·11.5 ≈ 1150 versus 10,000·11.5 ≈ 115,000. 2) v<sub>1</sub> = −0.5, x<sub>1</sub> = 0.5; v<sub>2</sub> = 0.5·(−0.5) − 0.5·0.5 = −0.5, x<sub>2</sub> = 0. 3) Across the valley the gradient flips sign at each zig-zag, so positive and negative terms cancel in the weighted sum; along the valley they add up.</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 9 · Bài 9.2</span>
<h2>Momentum và gia tốc Nesterov</h2>
<p class="lead">Gradient descent cần khoảng κ vòng (Bài 7.1). Một thay đổi nhỏ — nhớ bước trước đó — hạ con số này xuống khoảng √κ. Với κ = 10.000, đó là khác biệt giữa 10.000 và 100 vòng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết cập nhật momentum heavy-ball (Polyak) và gradient tăng tốc Nesterov.</li><li>Giải thích vì sao momentum giúp ở thung lũng hẹp.</li><li>Phát biểu tốc độ tăng tốc và so số vòng trên hàm toàn phương có số điều kiện xấu.</li><li>Liên hệ momentum với các bộ tối ưu dùng trong học sâu.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Momentum heavy-ball</span>v<sub>k+1</sub> = β v<sub>k</sub> − t ∇f(x<sub>k</sub>),      x<sub>k+1</sub> = x<sub>k</sub> + v<sub>k+1</sub>      (0 ≤ β &lt; 1)</div>
<p>Vận tốc v là tổng có trọng số giảm mũ của các gradient trước. Trong thung lũng hẹp, thành phần gradient ngang thung lũng đổi dấu liên tục và triệt tiêu trong v, còn thành phần nhỏ dọc thung lũng giữ nguyên dấu và cộng dồn — điểm lặp lăn dọc đáy thung lũng thay vì đi zig-zag. Trên hàm toàn phương, với t và β chỉnh theo L và μ, heavy-ball hội tụ như (1 − c/√κ)<sup>k</sup>.</p>
<div class="formula"><span class="lbl">Gradient tăng tốc Nesterov (bản lồi mạnh)</span>x<sub>k+1</sub> = y<sub>k</sub> − (1/L)∇f(y<sub>k</sub>),      y<sub>k+1</sub> = x<sub>k+1</sub> + q(x<sub>k+1</sub> − x<sub>k</sub>),   q = (√L − √μ)/(√L + √μ)</div>
<p>Nesterov tính gradient tại điểm <em>nhìn trước</em> y, nhờ đó chứng minh được tăng tốc cho mọi hàm lồi trơn, không chỉ hàm toàn phương: f(x<sub>k</sub>) − p* = O(1/k<sup>2</sup>) với f lồi L-trơn (so với O(1/k) của GD) và O((1 − 1/√κ)<sup>k</sup>) với f lồi mạnh. Các tốc độ này là tối ưu: không phương pháp nào chỉ dùng gradient làm tốt hơn trong trường hợp xấu nhất (cận dưới Nesterov; xem chuyên khảo của Bubeck). Cái giá: hàm mục tiêu không còn giảm đơn điệu.</p>
<p><strong>Trong học sâu</strong> “SGD có momentum” (β ≈ 0,9) và momentum Nesterov là chuẩn; <strong>Adam</strong> kết hợp momentum với bước riêng cho từng toạ độ, co theo trung bình trượt của bình phương gradient (một tiền điều kiện chéo kiểu RMSProp) — cách rẻ để giảm số điều kiện hiệu dụng.</p>
<h3>✍️ Ví dụ giải từng bước — κ = 100</h3>
<div class="callout"><p><b>Bài toán.</b> f(x) = ½(x<sub>1</sub><sup>2</sup> + 100x<sub>2</sub><sup>2</sup>): L = 100, μ = 1, κ = 100, xuất phát (1, 1), dừng khi f &lt; 10<sup>−10</sup>.</p>
<p>Bước 1: GD với t = 1/L — dự đoán khoảng κ·ln(10<sup>10</sup>)/2 ≈ 100·11,5 ≈ 1150 vòng. Bước 2: heavy-ball với β = 0,5 và 0,9 (cùng t). Bước 3: Nesterov với q = (10 − 1)/(10 + 1) = 9/11 ≈ 0,818 — dự đoán khoảng √κ·11,5 ≈ 115 vòng.</p></div>
<pre><code class="language-python">import numpy as np

# ill-conditioned quadratic f(x) = 0.5 x^T diag(1, 100) x, kappa = 100
D = np.array([1.0, 100.0]); L, mu = 100.0, 1.0
f = lambda x: 0.5 * np.sum(D * x**2); grad = lambda x: D * x

def gd(x):
    for k in range(1, 5001):
        x = x - grad(x) / L
        if f(x) &lt; 1e-10: return k

def heavy_ball(x, beta):
    v = np.zeros_like(x)
    for k in range(1, 5001):
        v = beta * v - grad(x) / L
        x = x + v
        if f(x) &lt; 1e-10: return k

def nesterov(x):
    y, x_prev = x.copy(), x.copy()
    q = (np.sqrt(L) - np.sqrt(mu)) / (np.sqrt(L) + np.sqrt(mu))   # strongly convex momentum
    for k in range(1, 5001):
        x_new = y - grad(y) / L
        y = x_new + q * (x_new - x_prev); x_prev = x_new
        if f(x_new) &lt; 1e-10: return k

x0 = np.array([1.0, 1.0])
print("gradient descent, t = 1/L     :", gd(x0), "iterations")
for beta in [0.5, 0.9]:
    print(f"heavy-ball momentum beta = {beta}:", heavy_ball(x0, beta), "iterations")
print("Nesterov accelerated gradient :", nesterov(x0), "iterations")
print("sqrt(kappa) =", np.sqrt(L / mu), " vs kappa =", L / mu)</code></pre>
<div class="out">gradient descent, t = 1/L     : 1112 iterations
heavy-ball momentum beta = 0.5: 543 iterations
heavy-ball momentum beta = 0.9: 214 iterations
Nesterov accelerated gradient : 132 iterations
sqrt(kappa) = 10.0  vs kappa = 100.0</div>
<p>GD cần 1112 vòng, khớp dự đoán; heavy-ball với β = 0,9 cần 214; Nesterov 132 — ít hơn gần một bậc, đúng như √κ = 10 so với κ = 100.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tăng β về gần 1 mà không giảm bước: điểm lặp dao động và có thể phân kỳ.</li><li>Chờ phương pháp tăng tốc giảm đơn điệu — tăng nhẹ là bình thường (có các sơ đồ khởi động lại).</li><li>Nghĩ Adam bảo đảm hội tụ trên mọi bài; trên một số bài lồi nó cần chú ý lịch bước.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Momentum cộng dồn gradient, dập zig-zag ngang thung lũng hẹp.</li><li>Nesterov: gradient tại điểm nhìn trước; O(1/k<sup>2</sup>) với hàm lồi, (1 − 1/√κ)<sup>k</sup> với hàm lồi mạnh — tối ưu cho phương pháp bậc một.</li><li>Số vòng ∝ √κ thay vì κ.</li><li>SGD + momentum và Adam là hậu duệ trong học sâu.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://distill.pub/2017/momentum/" target="_blank" rel="noopener">Distill — Why Momentum Really Works (bài tương tác)</a></li><li><a href="https://www.ruder.io/optimizing-gradient-descent/" target="_blank" rel="noopener">Sebastian Ruder — An overview of gradient descent optimization algorithms</a></li><li><a href="https://www.deeplearningbook.org/contents/optimization.html" target="_blank" rel="noopener">Goodfellow, Bengio, Courville — Deep Learning, Ch. 8: Tối ưu cho huấn luyện mô hình sâu</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tính q với κ = 10.000. Nesterov cần khoảng bao nhiêu vòng so với GD để đạt 10<sup>−10</sup>?</li><li>Viết hai bước heavy-ball từ x<sub>0</sub> = 1, v<sub>0</sub> = 0 cho f(x) = x<sup>2</sup>/2 với t = 0,5, β = 0,5.</li><li>Vì sao lấy trung bình gradient làm triệt tiêu thành phần ngang thung lũng?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) √κ = 100, q = 99/101 ≈ 0,980; khoảng 100·11,5 ≈ 1150 so với 10.000·11,5 ≈ 115.000. 2) v<sub>1</sub> = −0,5, x<sub>1</sub> = 0,5; v<sub>2</sub> = 0,5·(−0,5) − 0,5·0,5 = −0,5, x<sub>2</sub> = 0. 3) Ngang thung lũng gradient đổi dấu sau mỗi lần zig-zag, nên các số hạng dương và âm triệt tiêu trong tổng có trọng số; dọc thung lũng chúng cộng dồn.</p></div>`);

const c93 = L('cvo201-ts-9-3',
  '9.3 — Subgradients and the proximal gradient method: ISTA and FISTA for the Lasso|||9.3 — Dưới gradient và phương pháp proximal gradient: ISTA và FISTA cho Lasso',
  'Dưới gradient của hàm không trơn (|x|, chuẩn ℓ1), điều kiện tối ưu 0 ∈ ∂f, toán tử proximal, ngưỡng mềm (soft thresholding), proximal gradient = ISTA, bản tăng tốc FISTA O(1/k²); giải Lasso n < d và so với CVXPY (Beck 2017; Vandenberghe ECE236C).',
  `<span class="eyebrow">CVO201 · Chapter 9 · Lesson 9.3</span>
<h2>Subgradients and proximal gradient: ISTA and FISTA</h2>
<p class="lead">The Lasso objective ½‖Xw − y‖<sup>2</sup> + λ‖w‖<sub>1</sub> has a kink at every w<sub>j</sub> = 0 — exactly where we want the solution to be. Gradient descent does not apply. The proximal gradient method splits the problem into a smooth part (gradient step) and a simple nonsmooth part (closed-form prox step).</p>
<h3>🎯 Objectives</h3>
<ul><li>Define subgradients and the subdifferential, and state the optimality condition 0 ∈ ∂f(x*).</li><li>Define the proximal operator and derive soft thresholding.</li><li>Implement ISTA and FISTA for the Lasso and compare their speed.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Subgradients.</strong> For a convex f, g is a subgradient at x if f(y) ≥ f(x) + g<sup>T</sup>(y − x) for all y — the first-order condition of Lesson 3.1 without differentiability. The set of all subgradients is the subdifferential ∂f(x). For |x|: ∂|x| = {sign x} if x ≠ 0 and the whole interval [−1, 1] at x = 0. Optimality becomes <strong>0 ∈ ∂f(x*)</strong>. For the Lasso this gives: x<sup>T</sup><sub>j</sub>(y − Xw) = λ sign(w<sub>j</sub>) if w<sub>j</sub> ≠ 0 and |x<sup>T</sup><sub>j</sub>(y − Xw)| ≤ λ if w<sub>j</sub> = 0 — the precise reason for exact zeros (Lesson 6.2). The plain subgradient method w ← w − t g works but is slow (O(1/√k)) and does not produce exact zeros.</p>
<div class="formula"><span class="lbl">Proximal operator and soft thresholding</span>prox<sub>th</sub>(v) = argmin<sub>u</sub> ( h(u) + (1/(2t))‖u − v‖<sub>2</sub><sup>2</sup> )<br>h = λ‖·‖<sub>1</sub>:  prox<sub>th</sub>(v)<sub>j</sub> = sign(v<sub>j</sub>)·max(|v<sub>j</sub>| − tλ, 0)   (soft thresholding)</div>
<p>For a composite objective F(w) = g(w) + h(w) with g smooth (L-smooth) and h convex with an easy prox, the <strong>proximal gradient method</strong> takes a gradient step on g and then a prox step on h:</p>
<div class="formula"><span class="lbl">ISTA / FISTA (step t = 1/L)</span>ISTA:  w<sub>k+1</sub> = prox<sub>th</sub>( w<sub>k</sub> − t∇g(w<sub>k</sub>) )                      F − F* = O(1/k)<br>FISTA:  w<sub>k+1</sub> = prox<sub>th</sub>( z<sub>k</sub> − t∇g(z<sub>k</sub>) ),  s<sub>k+1</sub> = (1 + √(1 + 4s<sub>k</sub><sup>2</sup>))/2,  z<sub>k+1</sub> = w<sub>k+1</sub> + ((s<sub>k</sub> − 1)/s<sub>k+1</sub>)(w<sub>k+1</sub> − w<sub>k</sub>)      O(1/k<sup>2</sup>)</div>
<p>If h = 0 this is gradient descent; if h is the indicator of a convex set, the prox is the Euclidean projection and we get projected gradient (Lesson 9.4). FISTA is Nesterov's acceleration (Lesson 9.2) transplanted to composite problems (Beck and Teboulle). Each iteration costs two matrix–vector products plus an elementwise threshold — scalable to millions of features.</p>
<h3>✍️ Worked example — a Lasso with more features than samples</h3>
<div class="callout"><p><b>Problem.</b> n = 60 samples, d = 200 features (so X<sup>T</sup>X is singular — not strongly convex), true w with 3 nonzeros at positions 1, 7, 20; λ = 10.</p>
<p>Step 1: g(w) = ½‖Xw − y‖<sup>2</sup>, ∇g = X<sup>T</sup>(Xw − y), L = λ<sub>max</sub>(X<sup>T</sup>X), t = 1/L. Step 2: soft-threshold with level tλ. Step 3: compute F* with CVXPY (Clarabel) as a reference. Step 4: compare F − F* after 20, 100, 500 iterations; finally read off the support.</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp

rng = np.random.default_rng(13)
n, d = 60, 200
X = rng.normal(size=(n, d)); w_true = np.zeros(d); w_true[[1, 7, 20]] = [4, -3, 2]
y = X @ w_true + 0.3 * rng.normal(size=n)
lam = 10.0
F = lambda w: 0.5 * np.sum((X @ w - y) ** 2) + lam * np.sum(np.abs(w))

soft = lambda v, k: np.sign(v) * np.maximum(np.abs(v) - k, 0)    # prox of k*||.||_1
L = np.linalg.eigvalsh(X.T @ X).max(); t = 1 / L

# reference solution from cvxpy
w = cp.Variable(d)
cp.Problem(cp.Minimize(0.5 * cp.sum_squares(X @ w - y) + lam * cp.norm1(w))).solve(solver=cp.CLARABEL)
F_star = F(w.value)

def ista(iters):
    w = np.zeros(d)
    for _ in range(iters):
        w = soft(w - t * X.T @ (X @ w - y), t * lam)
    return w

def fista(iters):
    w = z = np.zeros(d); s = 1.0
    for _ in range(iters):
        w_new = soft(z - t * X.T @ (X @ z - y), t * lam)
        s_new = (1 + np.sqrt(1 + 4 * s * s)) / 2
        z = w_new + (s - 1) / s_new * (w_new - w); w, s = w_new, s_new
    return w

for k in [20, 100, 500]:
    print(f"k={k:3d}:  ISTA F - F* = {F(ista(k)) - F_star:.2e}   FISTA F - F* = {F(fista(k)) - F_star:.2e}")
wf = fista(3000)
print("nonzeros found:", np.flatnonzero(np.abs(wf) &gt; 1e-6).tolist(), " values:", wf[[1, 7, 20]].round(3))</code></pre>
<div class="out">k= 20:  ISTA F - F* = 6.83e+01   FISTA F - F* = 1.05e+00
k=100:  ISTA F - F* = 3.50e-03   FISTA F - F* = 4.50e-07
k=500:  ISTA F - F* = -6.41e-08   FISTA F - F* = -6.41e-08
nonzeros found: [1, 7, 20]  values: [ 3.902 -2.843  1.85 ]</div>
<p>FISTA is far ahead early (after 100 iterations its gap is 4.5·10<sup>−7</sup> versus 3.5·10<sup>−3</sup> for ISTA). By 500 iterations both have converged; the small <em>negative</em> gap means the first-order methods found a slightly better point than the interior-point reference, whose accuracy is about 10<sup>−8</sup>. The recovered support is exactly {1, 7, 20}, with values shrunk by λ as Lesson 6.2 predicted.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thresholding at λ instead of tλ — the prox level scales with the step.</li><li>Using a step larger than 1/L: ISTA can diverge just like gradient descent.</li><li>Using the subgradient method and expecting exact zeros; only the prox step produces them.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Subgradient: f(y) ≥ f(x) + g<sup>T</sup>(y − x); optimality 0 ∈ ∂f(x*).</li><li>prox of λ‖·‖<sub>1</sub> = soft thresholding.</li><li>Proximal gradient: gradient step on smooth part, prox on the rest; ISTA O(1/k), FISTA O(1/k<sup>2</sup>).</li><li>Lasso with millions of features is solved this way.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.stat.cmu.edu/~ryantibs/convexopt/lectures/prox-grad.pdf" target="_blank" rel="noopener">CMU 10-725 — Proximal gradient descent (and acceleration)</a></li><li><a href="https://www.seas.ucla.edu/~vandenbe/236C/lectures/proxgrad.pdf" target="_blank" rel="noopener">Vandenberghe, UCLA ECE236C — Proximal gradient method (slides)</a></li><li><a href="https://web.stanford.edu/~boyd/papers/prox_algs.html" target="_blank" rel="noopener">Parikh &amp; Boyd — Proximal Algorithms (free monograph)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find ∂f(0) for f(x) = |x| + x<sup>2</sup>, and decide whether 0 is the minimiser.</li><li>Soft-threshold v = (3, −0.5, 1.2) with level 1.</li><li>Show that prox of the indicator of a convex set C is the Euclidean projection onto C.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) ∂f(0) = [−1, 1] + 0 = [−1, 1] ∋ 0, so x* = 0. 2) (2, 0, 0.2). 3) The indicator is 0 on C and +∞ outside, so the prox minimises ‖u − v‖<sup>2</sup> over u ∈ C — the projection.</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 9 · Bài 9.3</span>
<h2>Dưới gradient và proximal gradient: ISTA và FISTA</h2>
<p class="lead">Mục tiêu Lasso ½‖Xw − y‖<sup>2</sup> + λ‖w‖<sub>1</sub> có chỗ gãy tại mọi w<sub>j</sub> = 0 — đúng nơi ta muốn nghiệm nằm. Gradient descent không áp được. Phương pháp proximal gradient tách bài thành phần trơn (bước gradient) và phần không trơn đơn giản (bước prox có công thức).</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa dưới gradient và dưới vi phân, phát biểu điều kiện tối ưu 0 ∈ ∂f(x*).</li><li>Định nghĩa toán tử proximal và suy ra ngưỡng mềm.</li><li>Cài đặt ISTA và FISTA cho Lasso và so tốc độ.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Dưới gradient.</strong> Với f lồi, g là dưới gradient tại x nếu f(y) ≥ f(x) + g<sup>T</sup>(y − x) với mọi y — điều kiện bậc một ở Bài 3.1 mà không cần khả vi. Tập mọi dưới gradient là dưới vi phân ∂f(x). Với |x|: ∂|x| = {sign x} nếu x ≠ 0 và cả đoạn [−1, 1] tại x = 0. Điều kiện tối ưu thành <strong>0 ∈ ∂f(x*)</strong>. Với Lasso điều này cho: x<sup>T</sup><sub>j</sub>(y − Xw) = λ sign(w<sub>j</sub>) nếu w<sub>j</sub> ≠ 0 và |x<sup>T</sup><sub>j</sub>(y − Xw)| ≤ λ nếu w<sub>j</sub> = 0 — lý do chính xác của các số 0 (Bài 6.2). Phương pháp dưới gradient thuần w ← w − t g chạy được nhưng chậm (O(1/√k)) và không cho số 0 chính xác.</p>
<div class="formula"><span class="lbl">Toán tử proximal và ngưỡng mềm</span>prox<sub>th</sub>(v) = argmin<sub>u</sub> ( h(u) + (1/(2t))‖u − v‖<sub>2</sub><sup>2</sup> )<br>h = λ‖·‖<sub>1</sub>:  prox<sub>th</sub>(v)<sub>j</sub> = sign(v<sub>j</sub>)·max(|v<sub>j</sub>| − tλ, 0)   (ngưỡng mềm)</div>
<p>Với mục tiêu ghép F(w) = g(w) + h(w), g trơn (L-trơn) và h lồi có prox dễ tính, <strong>phương pháp proximal gradient</strong> đi một bước gradient theo g rồi một bước prox theo h:</p>
<div class="formula"><span class="lbl">ISTA / FISTA (bước t = 1/L)</span>ISTA:  w<sub>k+1</sub> = prox<sub>th</sub>( w<sub>k</sub> − t∇g(w<sub>k</sub>) )                      F − F* = O(1/k)<br>FISTA:  w<sub>k+1</sub> = prox<sub>th</sub>( z<sub>k</sub> − t∇g(z<sub>k</sub>) ),  s<sub>k+1</sub> = (1 + √(1 + 4s<sub>k</sub><sup>2</sup>))/2,  z<sub>k+1</sub> = w<sub>k+1</sub> + ((s<sub>k</sub> − 1)/s<sub>k+1</sub>)(w<sub>k+1</sub> − w<sub>k</sub>)      O(1/k<sup>2</sup>)</div>
<p>Nếu h = 0 đây là gradient descent; nếu h là hàm chỉ thị của một tập lồi, prox là phép chiếu Euclid và ta được projected gradient (Bài 9.4). FISTA là gia tốc Nesterov (Bài 9.2) cấy sang bài ghép (Beck và Teboulle). Mỗi vòng tốn hai phép nhân ma trận–vectơ cộng một phép ngưỡng từng phần tử — mở rộng được tới hàng triệu đặc trưng.</p>
<h3>✍️ Ví dụ giải từng bước — Lasso nhiều đặc trưng hơn số mẫu</h3>
<div class="callout"><p><b>Bài toán.</b> n = 60 mẫu, d = 200 đặc trưng (nên X<sup>T</sup>X suy biến — không lồi mạnh), w thật có 3 phần tử khác 0 tại vị trí 1, 7, 20; λ = 10.</p>
<p>Bước 1: g(w) = ½‖Xw − y‖<sup>2</sup>, ∇g = X<sup>T</sup>(Xw − y), L = λ<sub>max</sub>(X<sup>T</sup>X), t = 1/L. Bước 2: ngưỡng mềm với mức tλ. Bước 3: tính F* bằng CVXPY (Clarabel) làm mốc. Bước 4: so F − F* sau 20, 100, 500 vòng; cuối cùng đọc tập hỗ trợ.</p></div>
<pre><code class="language-python">import numpy as np
import cvxpy as cp

rng = np.random.default_rng(13)
n, d = 60, 200
X = rng.normal(size=(n, d)); w_true = np.zeros(d); w_true[[1, 7, 20]] = [4, -3, 2]
y = X @ w_true + 0.3 * rng.normal(size=n)
lam = 10.0
F = lambda w: 0.5 * np.sum((X @ w - y) ** 2) + lam * np.sum(np.abs(w))

soft = lambda v, k: np.sign(v) * np.maximum(np.abs(v) - k, 0)    # prox of k*||.||_1
L = np.linalg.eigvalsh(X.T @ X).max(); t = 1 / L

# reference solution from cvxpy
w = cp.Variable(d)
cp.Problem(cp.Minimize(0.5 * cp.sum_squares(X @ w - y) + lam * cp.norm1(w))).solve(solver=cp.CLARABEL)
F_star = F(w.value)

def ista(iters):
    w = np.zeros(d)
    for _ in range(iters):
        w = soft(w - t * X.T @ (X @ w - y), t * lam)
    return w

def fista(iters):
    w = z = np.zeros(d); s = 1.0
    for _ in range(iters):
        w_new = soft(z - t * X.T @ (X @ z - y), t * lam)
        s_new = (1 + np.sqrt(1 + 4 * s * s)) / 2
        z = w_new + (s - 1) / s_new * (w_new - w); w, s = w_new, s_new
    return w

for k in [20, 100, 500]:
    print(f"k={k:3d}:  ISTA F - F* = {F(ista(k)) - F_star:.2e}   FISTA F - F* = {F(fista(k)) - F_star:.2e}")
wf = fista(3000)
print("nonzeros found:", np.flatnonzero(np.abs(wf) &gt; 1e-6).tolist(), " values:", wf[[1, 7, 20]].round(3))</code></pre>
<div class="out">k= 20:  ISTA F - F* = 6.83e+01   FISTA F - F* = 1.05e+00
k=100:  ISTA F - F* = 3.50e-03   FISTA F - F* = 4.50e-07
k=500:  ISTA F - F* = -6.41e-08   FISTA F - F* = -6.41e-08
nonzeros found: [1, 7, 20]  values: [ 3.902 -2.843  1.85 ]</div>
<p>FISTA vượt xa lúc đầu (sau 100 vòng khoảng cách của nó là 4,5·10<sup>−7</sup> so với 3,5·10<sup>−3</sup> của ISTA). Tới 500 vòng cả hai đã hội tụ; khoảng cách <em>âm</em> nhỏ nghĩa là phương pháp bậc một tìm được điểm tốt hơn chút ít so với mốc điểm trong, vốn chính xác cỡ 10<sup>−8</sup>. Tập hỗ trợ khôi phục đúng là {1, 7, 20}, với giá trị bị co theo λ như Bài 6.2 dự đoán.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Lấy ngưỡng ở λ thay vì tλ — mức prox co giãn theo bước.</li><li>Dùng bước lớn hơn 1/L: ISTA có thể phân kỳ y như gradient descent.</li><li>Dùng phương pháp dưới gradient rồi chờ số 0 chính xác; chỉ bước prox mới tạo ra chúng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Dưới gradient: f(y) ≥ f(x) + g<sup>T</sup>(y − x); tối ưu 0 ∈ ∂f(x*).</li><li>prox của λ‖·‖<sub>1</sub> = ngưỡng mềm.</li><li>Proximal gradient: bước gradient cho phần trơn, prox cho phần còn lại; ISTA O(1/k), FISTA O(1/k<sup>2</sup>).</li><li>Lasso hàng triệu đặc trưng được giải theo cách này.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.stat.cmu.edu/~ryantibs/convexopt/lectures/prox-grad.pdf" target="_blank" rel="noopener">CMU 10-725 — Proximal gradient descent (và tăng tốc)</a></li><li><a href="https://www.seas.ucla.edu/~vandenbe/236C/lectures/proxgrad.pdf" target="_blank" rel="noopener">Vandenberghe, UCLA ECE236C — Proximal gradient method (slide)</a></li><li><a href="https://web.stanford.edu/~boyd/papers/prox_algs.html" target="_blank" rel="noopener">Parikh &amp; Boyd — Proximal Algorithms (chuyên khảo miễn phí)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm ∂f(0) với f(x) = |x| + x<sup>2</sup>, và xác định 0 có phải điểm cực tiểu không.</li><li>Ngưỡng mềm v = (3; −0,5; 1,2) với mức 1.</li><li>Chứng minh prox của hàm chỉ thị tập lồi C là phép chiếu Euclid lên C.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) ∂f(0) = [−1, 1] + 0 = [−1, 1] ∋ 0, nên x* = 0. 2) (2; 0; 0,2). 3) Hàm chỉ thị bằng 0 trên C và +∞ ngoài C, nên prox cực tiểu ‖u − v‖<sup>2</sup> trên u ∈ C — chính là phép chiếu.</p></div>`);

const c94 = L('cvo201-ts-9-4',
  '9.4 — Projected gradient, ADMM in one page, and choosing an algorithm|||9.4 — Projected gradient, ADMM trong một trang, và chọn thuật toán',
  'Projected gradient = proximal gradient với hàm chỉ thị; phép chiếu lên hộp, nửa không gian, đơn hình; bình phương tối thiểu không âm so với scipy nnls; ý tưởng ADMM; bảng chọn phương pháp cho cả môn (Beck 2017; Boyd et al. ADMM).',
  `<span class="eyebrow">CVO201 · Chapter 9 · Lesson 9.4</span>
<h2>Projected gradient, ADMM, and choosing an algorithm</h2>
<p class="lead">Many ML constraints are simple sets — boxes, nonnegativity, the probability simplex, norm balls. Projected gradient handles them with one extra line of code. We close the course with a map of which method to use when.</p>
<h3>🎯 Objectives</h3>
<ul><li>State projected gradient as a special case of proximal gradient.</li><li>Compute projections onto a box, a halfspace, a ball and the simplex.</li><li>Solve nonnegative least squares by projected gradient and check it against SciPy.</li><li>Describe ADMM at the idea level and choose a method for a given problem.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Projected gradient (constraint set C convex, closed)</span>x<sub>k+1</sub> = Π<sub>C</sub>( x<sub>k</sub> − t∇f(x<sub>k</sub>) ),      Π<sub>C</sub>(v) = argmin<sub>u∈C</sub> ‖u − v‖<sub>2</sub></div>
<p>It is proximal gradient with h = indicator of C (Lesson 9.3), so it inherits the same rates: O(1/k) with t = 1/L, linear if f is strongly convex, and O(1/k<sup>2</sup>) with FISTA-style acceleration. It is worth it whenever the projection is cheap:</p>
<ul><li><strong>Box</strong> l ⪯ x ⪯ u: clip each coordinate, Π(v) = min(max(v, l), u). Nonnegativity is the special case max(v, 0).</li><li><strong>Halfspace</strong> a<sup>T</sup>x ≤ b: if violated, v − ((a<sup>T</sup>v − b)/‖a‖<sup>2</sup>)a (Lesson 4.3).</li><li><strong>ℓ<sub>2</sub> ball</strong> ‖x‖ ≤ r: rescale v to length r if it is longer (used in gradient clipping and in projected SGD).</li><li><strong>Probability simplex</strong> {x ⪰ 0, 1<sup>T</sup>x = 1}: sort and threshold, O(n log n): subtract a constant τ from every coordinate and clip at 0, with τ chosen so the result sums to 1.</li></ul>
<p><strong>ADMM in one paragraph.</strong> For minimise f(x) + g(z) subject to x − z = 0 (or Ax + Bz = c), the alternating direction method of multipliers alternates: minimise the augmented Lagrangian over x, then over z, then take a dual ascent step on the multiplier. Each subproblem only involves f or g alone, so complicated problems split into simple pieces that can run in parallel or on different machines. OSQP (Lesson 8.3) is an ADMM-based QP solver; ADMM is popular for distributed ML and consensus problems (Boyd, Parikh, Chu, Peleato, Eckstein).</p>
<table><tr><th>Problem</th><th>Size</th><th>Method</th></tr>
<tr><td>LP / QP / SOCP / SDP, need accuracy and duals</td><td>up to ~10<sup>5</sup> variables (sparse)</td><td>CVXPY + interior point (Clarabel, HiGHS)</td></tr>
<tr><td>Smooth convex loss (logistic, ridge)</td><td>medium–large</td><td>L-BFGS or Newton-CG</td></tr>
<tr><td>Smooth + simple nonsmooth (Lasso, constraints with easy projection)</td><td>large</td><td>proximal / projected gradient, FISTA</td></tr>
<tr><td>Average over huge data, deep nets</td><td>huge</td><td>SGD, momentum, Adam</td></tr>
<tr><td>Separable structure, distributed data</td><td>large</td><td>ADMM</td></tr></table>
<h3>✍️ Worked example — nonnegative least squares</h3>
<div class="callout"><p><b>Problem.</b> minimise ½‖Ax − b‖<sup>2</sup> s.t. x ⪰ 0, A ∈ ℝ<sup>40×6</sup> with nonnegative entries; true x = (0, 2, 0, 1, 0.5, 0) plus noise.</p>
<p>Step 1: L = λ<sub>max</sub>(A<sup>T</sup>A), t = 1/L. Step 2: x ← max(x − tA<sup>T</sup>(Ax − b), 0). Step 3: stop when the iterate stops moving. Step 4: compare with <code>scipy.optimize.nnls</code> (an active-set method) and with unconstrained least squares, which may produce negative entries. Step 5: also project the vector (0.9, 0.6, −0.2, 0.1) onto the simplex: try τ = 0.25 on the two largest entries: 0.65 + 0.35 = 1 ✓, and the other entries minus τ are negative ⇒ 0.</p></div>
<pre><code class="language-python">import numpy as np
from scipy.optimize import nnls

rng = np.random.default_rng(14)
A = rng.uniform(size=(40, 6)); x_true = np.array([0.0, 2.0, 0.0, 1.0, 0.5, 0.0])
b = A @ x_true + 0.05 * rng.normal(size=40)

# projected gradient for  minimise 0.5 ||A x - b||^2  subject to  x &gt;= 0
L = np.linalg.eigvalsh(A.T @ A).max()
x = np.zeros(6)
for k in range(1, 20001):
    x_new = np.maximum(x - A.T @ (A @ x - b) / L, 0)      # gradient step, then project
    if np.linalg.norm(x_new - x) &lt; 1e-10: break
    x = x_new
print(f"projected gradient ({k} iterations):", x.round(4))
print("scipy.optimize.nnls             :", nnls(A, b)[0].round(4))
print("unconstrained lstsq (may go &lt; 0):", np.linalg.lstsq(A, b, rcond=None)[0].round(4))

# projection onto the probability simplex {x &gt;= 0, sum x = 1}
def proj_simplex(v):
    u = np.sort(v)[::-1]; css = np.cumsum(u)
    rho = np.nonzero(u - (css - 1) / np.arange(1, len(v) + 1) &gt; 0)[0][-1]
    return np.maximum(v - (css[rho] - 1) / (rho + 1), 0)
p = proj_simplex(np.array([0.9, 0.6, -0.2, 0.1]))
print("projection of (0.9, 0.6, -0.2, 0.1) onto simplex:", p.round(4), " sum =", p.sum())</code></pre>
<div class="out">projected gradient (672 iterations): [0.0114 1.9915 0.     0.9863 0.5285 0.    ]
scipy.optimize.nnls             : [0.0114 1.9915 0.     0.9863 0.5285 0.    ]
unconstrained lstsq (may go &lt; 0): [ 0.0089  1.9952 -0.0106  0.9917  0.5299  0.0034]
projection of (0.9, 0.6, -0.2, 0.1) onto simplex: [0.65 0.35 0.   0.  ]  sum = 1.0</div>
<p>Projected gradient and the active-set solver agree to four decimals. Plain least squares gives −0.0106 for a quantity that must be nonnegative — the constraint matters. The simplex projection gives (0.65, 0.35, 0, 0), as computed by hand.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Projecting onto a set whose projection is itself a hard problem (e.g. a general polyhedron) — then use a QP solver or ADMM instead.</li><li>Projecting only at the end of optimisation: the projection must be applied at every iteration.</li><li>Clipping coordinates to project onto the simplex: clipping alone does not make the sum 1.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Projected gradient = gradient step + projection; same rates as proximal gradient.</li><li>Cheap projections: box (clip), halfspace, ball (rescale), simplex (sort + threshold).</li><li>ADMM splits problems into simple subproblems linked by a multiplier update.</li><li>Choose by structure and size: interior point → L-BFGS/Newton → proximal → SGD.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://web.stanford.edu/~boyd/papers/admm_distr_stats.html" target="_blank" rel="noopener">Boyd et al. — Distributed Optimization and Statistical Learning via ADMM</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.nnls.html" target="_blank" rel="noopener">SciPy — scipy.optimize.nnls</a></li><li><a href="https://arxiv.org/abs/1405.4980" target="_blank" rel="noopener">Bubeck — Convex Optimization: Algorithms and Complexity (arXiv)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Project v = (2, −1, 0.5) onto the box [0, 1]<sup>3</sup>.</li><li>Project v = (3, 4) onto the disc ‖x‖<sub>2</sub> ≤ 1.</li><li>Project v = (0.5, 0.5, 0.5) onto the probability simplex.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (1, 0, 0.5). 2) ‖v‖ = 5, so (0.6, 0.8). 3) Subtract τ = (1.5 − 1)/3 = 1/6 from each: (1/3, 1/3, 1/3).</p></div>`,
  `<span class="eyebrow">CVO201 · Chương 9 · Bài 9.4</span>
<h2>Projected gradient, ADMM và chọn thuật toán</h2>
<p class="lead">Nhiều ràng buộc trong học máy là tập đơn giản — hộp, không âm, đơn hình xác suất, quả cầu chuẩn. Projected gradient xử lý chúng chỉ với một dòng code thêm. Ta khép lại môn học bằng một tấm bản đồ: dùng phương pháp nào khi nào.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu projected gradient như trường hợp riêng của proximal gradient.</li><li>Tính phép chiếu lên hộp, nửa không gian, quả cầu và đơn hình.</li><li>Giải bình phương tối thiểu không âm bằng projected gradient và kiểm với SciPy.</li><li>Mô tả ADMM ở mức ý tưởng và chọn phương pháp cho một bài cụ thể.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Projected gradient (tập ràng buộc C lồi, đóng)</span>x<sub>k+1</sub> = Π<sub>C</sub>( x<sub>k</sub> − t∇f(x<sub>k</sub>) ),      Π<sub>C</sub>(v) = argmin<sub>u∈C</sub> ‖u − v‖<sub>2</sub></div>
<p>Đây là proximal gradient với h = hàm chỉ thị của C (Bài 9.3), nên thừa hưởng cùng tốc độ: O(1/k) với t = 1/L, tuyến tính nếu f lồi mạnh, và O(1/k<sup>2</sup>) với tăng tốc kiểu FISTA. Đáng dùng mỗi khi phép chiếu rẻ:</p>
<ul><li><strong>Hộp</strong> l ⪯ x ⪯ u: cắt từng toạ độ, Π(v) = min(max(v, l), u). Không âm là trường hợp riêng max(v, 0).</li><li><strong>Nửa không gian</strong> a<sup>T</sup>x ≤ b: nếu vi phạm, v − ((a<sup>T</sup>v − b)/‖a‖<sup>2</sup>)a (Bài 4.3).</li><li><strong>Quả cầu ℓ<sub>2</sub></strong> ‖x‖ ≤ r: co v về độ dài r nếu nó dài hơn (dùng trong gradient clipping và projected SGD).</li><li><strong>Đơn hình xác suất</strong> {x ⪰ 0, 1<sup>T</sup>x = 1}: sắp xếp rồi lấy ngưỡng, O(n log n): trừ một hằng τ khỏi mọi toạ độ và cắt ở 0, với τ chọn sao cho tổng bằng 1.</li></ul>
<p><strong>ADMM trong một đoạn.</strong> Với bài cực tiểu f(x) + g(z) với x − z = 0 (hoặc Ax + Bz = c), phương pháp nhân tử hướng luân phiên (ADMM) luân phiên: cực tiểu Lagrange tăng cường theo x, rồi theo z, rồi một bước đi lên đối ngẫu cho nhân tử. Mỗi bài con chỉ chứa riêng f hoặc g, nên bài phức tạp được tách thành các mảnh đơn giản có thể chạy song song hay trên nhiều máy. OSQP (Bài 8.3) là bộ giải QP dựa trên ADMM; ADMM phổ biến cho học máy phân tán và bài đồng thuận (Boyd, Parikh, Chu, Peleato, Eckstein).</p>
<table><tr><th>Bài toán</th><th>Kích thước</th><th>Phương pháp</th></tr>
<tr><td>LP / QP / SOCP / SDP, cần chính xác và biến đối ngẫu</td><td>tới ~10<sup>5</sup> biến (thưa)</td><td>CVXPY + điểm trong (Clarabel, HiGHS)</td></tr>
<tr><td>Mất mát lồi trơn (logistic, ridge)</td><td>vừa–lớn</td><td>L-BFGS hoặc Newton-CG</td></tr>
<tr><td>Trơn + không trơn đơn giản (Lasso, ràng buộc chiếu dễ)</td><td>lớn</td><td>proximal / projected gradient, FISTA</td></tr>
<tr><td>Trung bình trên dữ liệu khổng lồ, mạng sâu</td><td>khổng lồ</td><td>SGD, momentum, Adam</td></tr>
<tr><td>Cấu trúc tách được, dữ liệu phân tán</td><td>lớn</td><td>ADMM</td></tr></table>
<h3>✍️ Ví dụ giải từng bước — bình phương tối thiểu không âm</h3>
<div class="callout"><p><b>Bài toán.</b> cực tiểu ½‖Ax − b‖<sup>2</sup> với x ⪰ 0, A ∈ ℝ<sup>40×6</sup> có phần tử không âm; x thật = (0, 2, 0, 1, 0,5, 0) cộng nhiễu.</p>
<p>Bước 1: L = λ<sub>max</sub>(A<sup>T</sup>A), t = 1/L. Bước 2: x ← max(x − tA<sup>T</sup>(Ax − b), 0). Bước 3: dừng khi điểm lặp không còn di chuyển. Bước 4: so với <code>scipy.optimize.nnls</code> (phương pháp tập chặt) và với bình phương tối thiểu không ràng buộc, vốn có thể cho phần tử âm. Bước 5: chiếu thêm vectơ (0,9; 0,6; −0,2; 0,1) lên đơn hình: thử τ = 0,25 cho hai phần tử lớn nhất: 0,65 + 0,35 = 1 ✓, các phần tử còn lại trừ τ thì âm ⇒ 0.</p></div>
<pre><code class="language-python">import numpy as np
from scipy.optimize import nnls

rng = np.random.default_rng(14)
A = rng.uniform(size=(40, 6)); x_true = np.array([0.0, 2.0, 0.0, 1.0, 0.5, 0.0])
b = A @ x_true + 0.05 * rng.normal(size=40)

# projected gradient for  minimise 0.5 ||A x - b||^2  subject to  x &gt;= 0
L = np.linalg.eigvalsh(A.T @ A).max()
x = np.zeros(6)
for k in range(1, 20001):
    x_new = np.maximum(x - A.T @ (A @ x - b) / L, 0)      # gradient step, then project
    if np.linalg.norm(x_new - x) &lt; 1e-10: break
    x = x_new
print(f"projected gradient ({k} iterations):", x.round(4))
print("scipy.optimize.nnls             :", nnls(A, b)[0].round(4))
print("unconstrained lstsq (may go &lt; 0):", np.linalg.lstsq(A, b, rcond=None)[0].round(4))

# projection onto the probability simplex {x &gt;= 0, sum x = 1}
def proj_simplex(v):
    u = np.sort(v)[::-1]; css = np.cumsum(u)
    rho = np.nonzero(u - (css - 1) / np.arange(1, len(v) + 1) &gt; 0)[0][-1]
    return np.maximum(v - (css[rho] - 1) / (rho + 1), 0)
p = proj_simplex(np.array([0.9, 0.6, -0.2, 0.1]))
print("projection of (0.9, 0.6, -0.2, 0.1) onto simplex:", p.round(4), " sum =", p.sum())</code></pre>
<div class="out">projected gradient (672 iterations): [0.0114 1.9915 0.     0.9863 0.5285 0.    ]
scipy.optimize.nnls             : [0.0114 1.9915 0.     0.9863 0.5285 0.    ]
unconstrained lstsq (may go &lt; 0): [ 0.0089  1.9952 -0.0106  0.9917  0.5299  0.0034]
projection of (0.9, 0.6, -0.2, 0.1) onto simplex: [0.65 0.35 0.   0.  ]  sum = 1.0</div>
<p>Projected gradient và bộ giải tập chặt khớp tới bốn chữ số. Bình phương tối thiểu thường cho −0,0106 cho một đại lượng phải không âm — ràng buộc có ý nghĩa. Phép chiếu đơn hình cho (0,65; 0,35; 0; 0), đúng như tính tay.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chiếu lên tập mà phép chiếu tự nó là bài khó (vd một đa diện tổng quát) — khi đó hãy dùng bộ giải QP hoặc ADMM.</li><li>Chỉ chiếu ở cuối quá trình tối ưu: phép chiếu phải áp ở mọi vòng.</li><li>Cắt toạ độ để chiếu lên đơn hình: chỉ cắt thì tổng chưa chắc bằng 1.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Projected gradient = bước gradient + phép chiếu; cùng tốc độ với proximal gradient.</li><li>Phép chiếu rẻ: hộp (cắt), nửa không gian, quả cầu (co lại), đơn hình (sắp xếp + ngưỡng).</li><li>ADMM tách bài thành các bài con đơn giản nối bằng cập nhật nhân tử.</li><li>Chọn theo cấu trúc và kích thước: điểm trong → L-BFGS/Newton → proximal → SGD.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://web.stanford.edu/~boyd/papers/admm_distr_stats.html" target="_blank" rel="noopener">Boyd và cộng sự — Distributed Optimization and Statistical Learning via ADMM</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.nnls.html" target="_blank" rel="noopener">SciPy — scipy.optimize.nnls</a></li><li><a href="https://arxiv.org/abs/1405.4980" target="_blank" rel="noopener">Bubeck — Convex Optimization: Algorithms and Complexity (arXiv)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Chiếu v = (2; −1; 0,5) lên hộp [0, 1]<sup>3</sup>.</li><li>Chiếu v = (3, 4) lên hình tròn ‖x‖<sub>2</sub> ≤ 1.</li><li>Chiếu v = (0,5; 0,5; 0,5) lên đơn hình xác suất.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (1; 0; 0,5). 2) ‖v‖ = 5, nên (0,6; 0,8). 3) Trừ τ = (1,5 − 1)/3 = 1/6 khỏi mỗi phần tử: (1/3, 1/3, 1/3).</p></div>`);

const q9 = QZ(9, 'Quiz — Chapter 9: First-order methods for machine learning|||Quiz — Chương 9: Phương pháp bậc một cho học máy',
  'Kiểm tra SGD, mini-batch, lịch learning rate, momentum, Nesterov, dưới gradient, toán tử prox, ngưỡng mềm, ISTA/FISTA, projected gradient, ADMM.', [
  Q('q1', 'A mini-batch gradient is|||Gradient mini-batch là',
    ['an unbiased estimate of the full gradient|||ước lượng không chệch của gradient đầy đủ', 'always equal to the full gradient|||luôn bằng gradient đầy đủ', 'a biased estimate|||ước lượng chệch', 'the Hessian|||Hessian'], 0,
    'E[(1/b)∑∇ℓᵢ] = ∇F for uniformly sampled indices.|||E[(1/b)∑∇ℓᵢ] = ∇F với chỉ số lấy mẫu đều.'),
  Q('q2', 'With a constant learning rate, SGD on a convex problem typically|||Với learning rate cố định, SGD trên bài lồi thường',
    ['converges exactly|||hội tụ chính xác', 'stalls in a noise ball whose size grows with the step|||kẹt trong quả cầu nhiễu có kích thước tăng theo bước', 'always diverges|||luôn phân kỳ', 'becomes Newton’s method|||thành phương pháp Newton'], 1,
    'Individual gradients do not vanish at the optimum; decaying steps fix this.|||Gradient riêng lẻ không bằng 0 tại tối ưu; bước giảm dần khắc phục.'),
  Q('q3', 'Which step-size schedule satisfies Σηₖ = ∞ and Σηₖ² < ∞?|||Lịch bước nào thoả Σηₖ = ∞ và Σηₖ² < ∞?',
    ['ηₖ = 1/k|||ηₖ = 1/k', 'ηₖ = 1/k²|||ηₖ = 1/k²', 'ηₖ = 1|||ηₖ = 1', 'ηₖ = 2⁻ᵏ|||ηₖ = 2⁻ᵏ'], 0,
    'Harmonic series diverges; Σ1/k² converges.|||Chuỗi điều hoà phân kỳ; Σ1/k² hội tụ.'),
  Q('q4', 'Accelerated (Nesterov) methods need about how many iterations on a strongly convex problem with condition number κ?|||Phương pháp tăng tốc (Nesterov) cần khoảng bao nhiêu vòng trên bài lồi mạnh có số điều kiện κ?',
    ['κ|||κ', '√κ (times log(1/ε))|||√κ (nhân log(1/ε))', 'κ²|||κ²', 'log κ|||log κ'], 1,
    'Versus κ·log(1/ε) for plain gradient descent.|||So với κ·log(1/ε) của gradient descent thuần.'),
  Q('q5', 'For convex L-smooth f, Nesterov’s method achieves|||Với f lồi L-trơn, phương pháp Nesterov đạt',
    ['O(1/k)|||O(1/k)', 'O(1/k²)|||O(1/k²)', 'O(1/√k)|||O(1/√k)', 'quadratic convergence|||hội tụ bậc hai'], 1,
    'This is optimal among first-order methods.|||Đây là tốc độ tối ưu trong các phương pháp bậc một.'),
  Q('q6', 'The subdifferential of |x| at x = 0 is|||Dưới vi phân của |x| tại x = 0 là',
    ['{0}|||{0}', '[−1, 1]|||[−1, 1]', '{−1, 1}|||{−1, 1}', 'empty|||rỗng'], 1,
    'Every slope between −1 and 1 gives a supporting line.|||Mọi độ dốc giữa −1 và 1 cho một đường tựa.'),
  Q('q7', 'The prox of tλ‖·‖₁ applied to v = (2, −0.3) with tλ = 0.5 is|||prox của tλ‖·‖₁ áp lên v = (2, −0.3) với tλ = 0,5 là',
    ['(1.5, 0)|||(1,5; 0)', '(2, −0.3)|||(2; −0,3)', '(1.5, −0.8)|||(1,5; −0,8)', '(2.5, 0.2)|||(2,5; 0,2)'], 0,
    'Soft thresholding: shrink by 0.5, set to 0 if |vⱼ| ≤ 0.5.|||Ngưỡng mềm: co 0,5, về 0 nếu |vⱼ| ≤ 0,5.'),
  Q('q8', 'ISTA and FISTA have convergence rates|||ISTA và FISTA có tốc độ hội tụ',
    ['O(1/k) and O(1/k²)|||O(1/k) và O(1/k²)', 'both O(1/k)|||cả hai O(1/k)', 'O(1/√k) and O(1/k)|||O(1/√k) và O(1/k)', 'both quadratic|||cả hai bậc hai'], 0,
    'FISTA is the accelerated version.|||FISTA là bản tăng tốc.'),
  Q('q9', 'Projected gradient onto a closed convex set C is the proximal gradient method with h equal to|||Projected gradient lên tập lồi đóng C là proximal gradient với h bằng',
    ['‖x‖₁|||‖x‖₁', 'the indicator function of C|||hàm chỉ thị của C', '0|||0', '‖x‖₂²|||‖x‖₂²'], 1,
    'The prox of an indicator is the Euclidean projection.|||prox của hàm chỉ thị là phép chiếu Euclid.'),
  Q('q10', 'ADMM is especially useful when|||ADMM đặc biệt hữu ích khi',
    ['the problem splits into simple pieces linked by a constraint (e.g. distributed data)|||bài tách được thành các mảnh đơn giản nối bằng một ràng buộc (vd dữ liệu phân tán)', 'n = 2|||n = 2', 'high accuracy (10⁻¹²) is needed|||cần độ chính xác rất cao (10⁻¹²)', 'the problem is nonconvex only|||chỉ khi bài không lồi'], 0,
    'It alternates simple subproblems with a multiplier update.|||Nó luân phiên các bài con đơn giản với cập nhật nhân tử.'),
]);

const ch9 = {
  title: 'Chapter 9 — First-order methods for machine learning|||Chương 9 — Phương pháp bậc một cho học máy',
  description: 'SGD và mini-batch, lịch learning rate, momentum và gia tốc Nesterov, dưới gradient, toán tử proximal, ISTA/FISTA cho Lasso, projected gradient, ADMM và bảng chọn thuật toán (Beck 2017 · CMU 10-725 · UCLA ECE236C).',
  lessons: [c91, c92, c93, c94, q9],
};


export default [muc0, ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9];
