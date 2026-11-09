// Khoá TỰ SOẠN cho MAA102 — trường chưa công bố syllabus trên FLM (dò 09/11/2026). Soạn theo _HOP-DONG-TU-SOAN.md.
// Khung bám thứ tự giáo trình chuẩn: Gilbert Strang "Introduction to Linear Algebra" (6th ed., 2023) + MIT 18.06,
// đối chiếu Lay–Lay–McDonald "Linear Algebra and Its Applications" (6th ed.) và Axler "Linear Algebra Done Right" (4th ed.).
// Mọi ví dụ số đã kiểm bằng sympy; mọi đoạn code NumPy/SciPy đã chạy thật (NumPy 2.5, SciPy 1.18) và dán output thật.
// Mọi link ngoài đã mở thử (HTTP 200 + tiêu đề trang đúng chủ đề) ngày 09/11/2026.
// Ma trận hiển thị bằng <table class="matrix"> (bảng HTML). KHÔNG LaTeX. KHÔNG chuỗi nội suy (đô-la + ngoặc nhọn), không backtick lồng.

const bi = (en, vi) => '<div class="ml-en">' + en + '</div>\n<div class="ml-vi">' + vi + '</div>';
const L = (slug, title, description, en, vi) => ({ title, slug, type: 'DOCUMENT', description, content: bi(en, vi) });
// Đáp án đúng được xoay vị trí theo một số cố định suy từ câu hỏi (tất định), để đáp án không dồn về một cột.
const Q = (id, question, options, correctIndex, explanation) => {
  const k = [...question].reduce((a, ch) => a + ch.charCodeAt(0), 0) % options.length;
  const opts = options.map((_, i) => options[(i + k) % options.length]);
  return { id, question, options: opts, correctIndex: (correctIndex - k + options.length) % options.length, points: 1, explanation };
};
const QZ = (ch, title, description, questions) => ({
  title, slug: 'maa102-ts-quiz-' + ch, type: 'QUIZ', description,
  quiz: { timeLimitSeconds: 900, questions },
});

// ───────────────────────────── Mục 0 ─────────────────────────────
const m01 = L('maa102-ts-0-1',
  '0.1 — Welcome to MAA102: what Linear Algebra is and why AI needs it|||0.1 — Giới thiệu MAA102: Đại số tuyến tính học gì, vì sao AI cần nó',
  'Đại số tuyến tính học gì, dùng vào đâu (học máy, đồ hoạ, robot, tìm kiếm), 8 chuẩn đầu ra tự soạn, môn liên quan, cảnh báo: trường chưa công bố syllabus MAA102 trên FLM.',
  `<span class="eyebrow">MAA102 · Section 0 · Lesson 0.1</span>
<h2>Welcome to Linear Algebra</h2>
<p class="lead">Linear algebra is the mathematics of <strong>vectors</strong> and <strong>matrices</strong>: lists of numbers, tables of numbers, and the linear rules that turn one list into another. It is the single most used branch of mathematics in computing — every image, every word embedding, every neural-network layer is a vector or a matrix.</p>
<div class="callout"><p>⚠️ <strong>Important.</strong> FPT University has <strong>not published the MAA102 syllabus on FLM</strong> (we searched the code, its variants and the course name on 09/11/2026). This course framework is therefore <strong>self-authored</strong>, following the chapter order of the international standard textbooks (Strang <em>Introduction to Linear Algebra</em>, 6th ed., and Lay–Lay–McDonald <em>Linear Algebra and Its Applications</em>). <strong>Grading weights, assessment format and exam dates are decided by your lecturer</strong> — always follow the course outline your lecturer gives in class.</p></div>
<h3>What is Linear Algebra about?</h3>
<p>The central object is the equation <strong>Ax = b</strong>: a matrix A acts on an unknown vector x and produces a vector b. Two big questions run through the whole course:</p>
<ul>
<li><strong>Solving:</strong> given A and b, find every x with Ax = b (Gaussian elimination, inverses, LU, least squares when there is no exact solution).</li>
<li><strong>Understanding A:</strong> what does the matrix <em>do</em> to space? Which directions does it stretch (eigenvectors), which vectors does it kill (nullspace), what is its true size (rank), and what is its best simple approximation (SVD)?</li>
</ul>
<h3>Why does a computer-science / AI student need it?</h3>
<ul>
<li><strong>Machine learning:</strong> a dataset is a matrix (rows = samples, columns = features); a neural-network layer computes y = Wx + b; training multiplies huge matrices on GPUs. Linear regression is exactly the least-squares problem of Chapter 9.</li>
<li><strong>Natural language &amp; search:</strong> words and documents become vectors (embeddings); “how similar are two sentences?” is a dot product (cosine similarity). Google's original PageRank is an eigenvector.</li>
<li><strong>Computer graphics &amp; games:</strong> rotating, scaling and projecting a 3D model are matrix multiplications — a GPU does billions per second.</li>
<li><strong>Data science:</strong> PCA, recommender systems and image compression are applications of the singular value decomposition (Chapter 10).</li>
<li><strong>Robotics &amp; control:</strong> robot poses, camera calibration and sensor fusion are built from rotation matrices and linear systems.</li>
</ul>
<h3>Learning outcomes (self-authored)</h3>
<p>After this course you should be able to:</p>
<ol>
<li>Compute with vectors (linear combinations, dot product, length, angle) and interpret Ax as a combination of the columns of A.</li>
<li>Solve linear systems by Gaussian / Gauss–Jordan elimination, read off pivots and free variables, and describe the complete solution set.</li>
<li>Perform matrix algebra, compute inverses, and factor A = LU (with row exchanges PA = LU).</li>
<li>Compute determinants by cofactors and by elimination, use their properties, and interpret them as signed volume.</li>
<li>Work with vector spaces and subspaces; decide linear independence; find bases, dimension and rank, and the four fundamental subspaces of a matrix.</li>
<li>Represent linear transformations by matrices, compose them, and change basis.</li>
<li>Find eigenvalues and eigenvectors, diagonalize matrices, and apply them to powers, Markov chains and PageRank.</li>
<li>Use orthogonality: projections, least squares, Gram–Schmidt and QR; compute and apply the SVD (low-rank approximation, PCA).</li>
</ol>
<h3>Related courses at FPTU</h3>
<p>In the Academy curriculum MAA102 sits in <strong>semester 2</strong>, next to <strong>CAL111 — Calculus I</strong> (semester 1) as the second pillar of mathematics for computing. If you have seen matrices and determinants in <strong>MAE101 — Mathematics for Engineering</strong>, Chapters 2–4 will feel familiar but go much deeper. The ideas are used again in <strong>MAS291 — Statistics &amp; Probability</strong> (covariance matrices, regression) and in every later AI / machine-learning course. Required background: high-school algebra; basic Python helps for the NumPy examples but is not required.</p>
<h3>How to study this course</h3>
<ul>
<li>Every lesson has objectives, a lecture, step-by-step worked examples, common mistakes, a 📌 summary, 🔗 further learning and 🧪 practice with answers. Each chapter ends with a quiz.</li>
<li>Do the practice <strong>by hand first</strong> (small 2×2 and 3×3 matrices), then check with NumPy. In the exam you will not have a computer.</li>
<li>Watch the matching 3Blue1Brown video for the <em>picture</em>, and the matching MIT 18.06 lecture for the <em>algebra</em>.</li>
</ul>`,
  `<span class="eyebrow">MAA102 · Mục 0 · Bài 0.1</span>
<h2>Chào mừng đến với Đại số tuyến tính</h2>
<p class="lead">Đại số tuyến tính là toán học của <strong>vectơ</strong> và <strong>ma trận</strong>: danh sách số, bảng số, và các quy tắc tuyến tính biến danh sách này thành danh sách khác. Đây là nhánh toán được dùng nhiều nhất trong tin học — mỗi bức ảnh, mỗi word embedding, mỗi lớp mạng nơ-ron đều là một vectơ hoặc một ma trận.</p>
<div class="callout"><p>⚠️ <strong>Lưu ý quan trọng.</strong> Trường <strong>chưa công bố syllabus của MAA102 trên FLM</strong> (đã dò mã môn, mã biến thể và tên môn ngày 09/11/2026). Vì vậy khung môn này là <strong>khung tự soạn</strong>, bám thứ tự chương của giáo trình chuẩn quốc tế (Strang <em>Introduction to Linear Algebra</em>, tái bản lần 6, và Lay–Lay–McDonald <em>Linear Algebra and Its Applications</em>). <strong>Cách tính điểm, hình thức đánh giá và lịch thi theo giảng viên</strong> — luôn theo đề cương giảng viên phát trên lớp.</p></div>
<h3>Đại số tuyến tính học gì?</h3>
<p>Đối tượng trung tâm là phương trình <strong>Ax = b</strong>: ma trận A tác động lên vectơ ẩn x và cho ra vectơ b. Hai câu hỏi lớn chạy suốt môn học:</p>
<ul>
<li><strong>Giải:</strong> biết A và b, tìm mọi x thoả Ax = b (khử Gauss, ma trận nghịch đảo, phân tích LU, bình phương tối thiểu khi không có nghiệm đúng).</li>
<li><strong>Hiểu A:</strong> ma trận <em>làm gì</em> với không gian? Nó kéo giãn theo hướng nào (vectơ riêng), “giết” những vectơ nào (không gian null), kích thước thật của nó là bao nhiêu (hạng), và xấp xỉ đơn giản tốt nhất của nó là gì (SVD)?</li>
</ul>
<h3>Sinh viên CNTT / AI cần nó để làm gì?</h3>
<ul>
<li><strong>Học máy:</strong> tập dữ liệu là một ma trận (hàng = mẫu, cột = đặc trưng); một lớp mạng nơ-ron tính y = Wx + b; huấn luyện là nhân các ma trận khổng lồ trên GPU. Hồi quy tuyến tính chính là bài toán bình phương tối thiểu ở Chương 9.</li>
<li><strong>Xử lý ngôn ngữ &amp; tìm kiếm:</strong> từ và văn bản thành vectơ (embedding); “hai câu giống nhau cỡ nào?” là một tích vô hướng (độ tương tự cosine). PageRank gốc của Google là một vectơ riêng.</li>
<li><strong>Đồ hoạ máy tính &amp; game:</strong> xoay, co giãn, chiếu một mô hình 3D là phép nhân ma trận — GPU làm hàng tỉ phép mỗi giây.</li>
<li><strong>Khoa học dữ liệu:</strong> PCA, hệ gợi ý và nén ảnh là ứng dụng của phân tích giá trị kỳ dị SVD (Chương 10).</li>
<li><strong>Robot &amp; điều khiển:</strong> tư thế robot, hiệu chỉnh camera, hợp nhất cảm biến dựng từ ma trận quay và hệ phương trình tuyến tính.</li>
</ul>
<h3>Chuẩn đầu ra (tự soạn)</h3>
<p>Học xong môn, bạn cần làm được:</p>
<ol>
<li>Tính toán với vectơ (tổ hợp tuyến tính, tích vô hướng, độ dài, góc) và hiểu Ax là tổ hợp các cột của A.</li>
<li>Giải hệ phương trình tuyến tính bằng khử Gauss / Gauss–Jordan, đọc ra pivot và biến tự do, mô tả toàn bộ tập nghiệm.</li>
<li>Thực hiện đại số ma trận, tính ma trận nghịch đảo, phân tích A = LU (có đổi hàng PA = LU).</li>
<li>Tính định thức bằng khai triển phần bù đại số và bằng khử, dùng các tính chất, hiểu định thức là thể tích có dấu.</li>
<li>Làm việc với không gian vectơ và không gian con; xét độc lập tuyến tính; tìm cơ sở, số chiều, hạng và bốn không gian con cơ bản của ma trận.</li>
<li>Biểu diễn ánh xạ tuyến tính bằng ma trận, hợp các ánh xạ, đổi cơ sở.</li>
<li>Tìm trị riêng, vectơ riêng, chéo hoá ma trận và áp dụng vào luỹ thừa ma trận, xích Markov, PageRank.</li>
<li>Dùng tính trực giao: hình chiếu, bình phương tối thiểu, Gram–Schmidt và QR; tính và ứng dụng SVD (xấp xỉ hạng thấp, PCA).</li>
</ol>
<h3>Môn liên quan trong khung FPTU</h3>
<p>Trong khung chương trình của Academy, MAA102 nằm ở <strong>kỳ 2</strong>, đi cùng <strong>CAL111 — Giải tích I</strong> (kỳ 1) làm trụ cột toán thứ hai cho tin học. Nếu bạn đã gặp ma trận và định thức trong <strong>MAE101 — Toán cho kỹ thuật</strong>, Chương 2–4 sẽ quen nhưng đi sâu hơn nhiều. Kiến thức được dùng lại ở <strong>MAS291 — Xác suất thống kê</strong> (ma trận hiệp phương sai, hồi quy) và mọi môn AI / học máy về sau. Kiến thức cần có: đại số phổ thông; biết Python cơ bản giúp chạy ví dụ NumPy nhưng không bắt buộc.</p>
<h3>Học môn này thế nào cho hiệu quả</h3>
<ul>
<li>Mỗi bài có mục tiêu, bài giảng, ví dụ giải từng bước, lỗi hay gặp, 📌 tóm tắt, 🔗 học thêm và 🧪 tự luyện có đáp án. Cuối mỗi chương có quiz.</li>
<li>Làm bài tự luyện <strong>bằng tay trước</strong> (ma trận 2×2, 3×3), rồi mới kiểm bằng NumPy. Trong phòng thi bạn không có máy tính.</li>
<li>Xem video 3Blue1Brown tương ứng để có <em>hình ảnh</em>, và bài giảng MIT 18.06 tương ứng để có <em>đại số</em>.</li>
</ul>`);

const m02 = L('maa102-ts-0-2',
  '0.2 — Textbooks & learning resources (verified)|||0.2 — Giáo trình & tài liệu học (đã kiểm)',
  'Ba giáo trình chuẩn kèm ISBN đã kiểm (Strang 6e, Lay–Lay–McDonald 6e, Axler 4e miễn phí), MIT 18.06 / 18.06SC / 18.065, 3Blue1Brown, Interactive Linear Algebra (Georgia Tech), Coursera, NumPy.',
  `<span class="eyebrow">MAA102 · Section 0 · Lesson 0.2</span>
<h2>Textbooks &amp; learning resources</h2>
<p class="lead">This course follows the chapter order of Strang's textbook and MIT 18.06. You do <strong>not</strong> need to buy anything: Axler's book, the Georgia Tech textbook and all MIT lectures are free and legal online, and every lesson links to the matching section or lecture.</p>
<h3>📘 Main textbooks</h3>
<ol>
<li><strong>Gilbert Strang — <em>Introduction to Linear Algebra</em>, 6th edition.</strong> Wellesley-Cambridge Press, 2023. ISBN 978-1-7331466-7-8. <a href="https://math.mit.edu/~gs/linearalgebra/ila6/indexila6.html" target="_blank" rel="noopener">Author's book page</a>. The backbone of this course and of MIT 18.06: elimination → the four subspaces → orthogonality → determinants → eigenvalues → SVD.</li>
<li><strong>David C. Lay, Steven R. Lay, Judi J. McDonald — <em>Linear Algebra and Its Applications</em>, 6th edition, Global Edition.</strong> Pearson, 2021. ISBN 978-1-292-35121-6 (paperback). <a href="https://www.pearson.com/en-gb/subject-catalog/p/linear-algebra-and-its-applications-global-edition/P200000004712/9781292351285" target="_blank" rel="noopener">Publisher page</a>. Very clear, many worked examples and applications (economics, graphics, Markov chains); the most common first-course text in the USA.</li>
<li><strong>Sheldon Axler — <em>Linear Algebra Done Right</em>, 4th edition.</strong> Springer, Undergraduate Texts in Mathematics, 2024 (published online October 2023). Hardcover ISBN 978-3-031-41025-3; eBook ISBN 978-3-031-41026-0. Open Access (CC BY-NC). <a href="https://linear.axler.net/" target="_blank" rel="noopener">Free PDF / HTML from the author</a> · <a href="https://link.springer.com/book/10.1007/978-3-031-41026-0" target="_blank" rel="noopener">Springer page</a>. Theory-first (vector spaces and linear maps before matrices) — read it after this course, or for the proofs in Chapters 5–7.</li>
</ol>
<h3>🎓 Open courses</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/" target="_blank" rel="noopener">MIT OpenCourseWare 18.06 — Linear Algebra (Gilbert Strang)</a>: 34 legendary video lectures, problem sets and exams with solutions. Each lesson here links to the matching lecture.</li>
<li><a href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/" target="_blank" rel="noopener">MIT OCW 18.06SC — self-paced version</a> with short recitation videos that solve problems step by step.</li>
<li><a href="https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/" target="_blank" rel="noopener">MIT 18.065 — Matrix Methods in Data Analysis, Signal Processing, and Machine Learning</a>: the follow-up course (SVD, PCA, least squares for ML).</li>
<li><a href="https://textbooks.math.gatech.edu/ila/" target="_blank" rel="noopener">Interactive Linear Algebra (Margalit &amp; Rabinoff, Georgia Tech)</a>: a free textbook with interactive figures you can drag.</li>
<li><a href="https://www.coursera.org/learn/linear-algebra-machine-learning" target="_blank" rel="noopener">Coursera — Mathematics for Machine Learning: Linear Algebra (Imperial College London)</a>.</li>
</ul>
<h3>▶️ Visual intuition</h3>
<ul>
<li><a href="https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab" target="_blank" rel="noopener">3Blue1Brown — Essence of Linear Algebra (YouTube playlist)</a> and the <a href="https://www.3blue1brown.com/topics/linear-algebra" target="_blank" rel="noopener">same lessons as text + animations</a>. Watch the whole series once early on: it gives the geometric picture that the formulas describe.</li>
</ul>
<h3>🛠️ Tools for checking your work</h3>
<ul>
<li><a href="https://numpy.org/doc/stable/reference/routines.linalg.html" target="_blank" rel="noopener">NumPy <code>numpy.linalg</code></a> — solve, inv, det, eig, svd, qr, lstsq. All code in this course was run with NumPy 2.5 and SciPy 1.18; the output shown is the real output.</li>
<li><a href="https://www.wolframalpha.com/" target="_blank" rel="noopener">WolframAlpha</a> — type “row reduce {{1,2},{3,4}}” or “eigenvalues {{4,1},{2,3}}” to check hand work.</li>
</ul>
<div class="meo"><p><strong>Study plan.</strong> For each lesson: read the lesson here → watch the linked 3Blue1Brown / MIT video → do 5–10 exercises from Strang or the Georgia Tech book → do the 🧪 practice by hand → check with NumPy → take the chapter quiz. About 6–8 hours per chapter.</p></div>`,
  `<span class="eyebrow">MAA102 · Mục 0 · Bài 0.2</span>
<h2>Giáo trình &amp; tài liệu học</h2>
<p class="lead">Khoá này bám thứ tự chương của sách Strang và khoá MIT 18.06. Bạn <strong>không</strong> cần mua sách: sách của Axler, sách Georgia Tech và toàn bộ bài giảng MIT đều miễn phí, hợp pháp, và mỗi bài đều dẫn tới đúng mục hoặc bài giảng tương ứng.</p>
<h3>📘 Giáo trình chính</h3>
<ol>
<li><strong>Gilbert Strang — <em>Introduction to Linear Algebra</em>, tái bản lần 6.</strong> Wellesley-Cambridge Press, 2023. ISBN 978-1-7331466-7-8. <a href="https://math.mit.edu/~gs/linearalgebra/ila6/indexila6.html" target="_blank" rel="noopener">Trang sách của tác giả</a>. Xương sống của khoá này và của MIT 18.06: khử → bốn không gian con → trực giao → định thức → trị riêng → SVD.</li>
<li><strong>David C. Lay, Steven R. Lay, Judi J. McDonald — <em>Linear Algebra and Its Applications</em>, tái bản lần 6, Global Edition.</strong> Pearson, 2021. ISBN 978-1-292-35121-6 (bìa mềm). <a href="https://www.pearson.com/en-gb/subject-catalog/p/linear-algebra-and-its-applications-global-edition/P200000004712/9781292351285" target="_blank" rel="noopener">Trang nhà xuất bản</a>. Rất rõ ràng, nhiều ví dụ giải sẵn và ứng dụng (kinh tế, đồ hoạ, xích Markov); giáo trình nhập môn phổ biến nhất ở Mỹ.</li>
<li><strong>Sheldon Axler — <em>Linear Algebra Done Right</em>, tái bản lần 4.</strong> Springer, bộ Undergraduate Texts in Mathematics, 2024 (bản điện tử phát hành tháng 10/2023). ISBN bìa cứng 978-3-031-41025-3; ISBN eBook 978-3-031-41026-0. Truy cập mở (CC BY-NC). <a href="https://linear.axler.net/" target="_blank" rel="noopener">PDF / HTML miễn phí từ tác giả</a> · <a href="https://link.springer.com/book/10.1007/978-3-031-41026-0" target="_blank" rel="noopener">Trang Springer</a>. Thiên về lý thuyết (không gian vectơ và ánh xạ tuyến tính trước ma trận) — đọc sau khoá này, hoặc để xem chứng minh cho Chương 5–7.</li>
</ol>
<h3>🎓 Khoá học mở</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/" target="_blank" rel="noopener">MIT OpenCourseWare 18.06 — Đại số tuyến tính (Gilbert Strang)</a>: 34 bài giảng video kinh điển, bài tập và đề thi có lời giải. Mỗi bài ở đây dẫn tới đúng bài giảng tương ứng.</li>
<li><a href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/" target="_blank" rel="noopener">MIT OCW 18.06SC — bản tự học</a>, có video ngắn giải bài tập từng bước.</li>
<li><a href="https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/" target="_blank" rel="noopener">MIT 18.065 — Phương pháp ma trận trong phân tích dữ liệu, xử lý tín hiệu và học máy</a>: khoá học tiếp theo (SVD, PCA, bình phương tối thiểu cho ML).</li>
<li><a href="https://textbooks.math.gatech.edu/ila/" target="_blank" rel="noopener">Interactive Linear Algebra (Margalit &amp; Rabinoff, Georgia Tech)</a>: sách miễn phí có hình tương tác kéo thả được.</li>
<li><a href="https://www.coursera.org/learn/linear-algebra-machine-learning" target="_blank" rel="noopener">Coursera — Mathematics for Machine Learning: Linear Algebra (Imperial College London)</a>.</li>
</ul>
<h3>▶️ Trực quan hình học</h3>
<ul>
<li><a href="https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab" target="_blank" rel="noopener">3Blue1Brown — Essence of Linear Algebra (danh sách phát YouTube)</a> và <a href="https://www.3blue1brown.com/topics/linear-algebra" target="_blank" rel="noopener">bản bài viết + hoạt hình</a>. Xem trọn bộ một lượt từ sớm: nó cho bạn bức tranh hình học mà các công thức mô tả.</li>
</ul>
<h3>🛠️ Công cụ tự kiểm bài</h3>
<ul>
<li><a href="https://numpy.org/doc/stable/reference/routines.linalg.html" target="_blank" rel="noopener">NumPy <code>numpy.linalg</code></a> — solve, inv, det, eig, svd, qr, lstsq. Mọi đoạn code trong khoá đã chạy bằng NumPy 2.5 và SciPy 1.18; output in ra là output thật.</li>
<li><a href="https://www.wolframalpha.com/" target="_blank" rel="noopener">WolframAlpha</a> — gõ “row reduce {{1,2},{3,4}}” hay “eigenvalues {{4,1},{2,3}}” để kiểm bài làm tay.</li>
</ul>
<div class="meo"><p><strong>Kế hoạch học.</strong> Mỗi bài: đọc bài ở đây → xem video 3Blue1Brown / MIT được dẫn → làm 5–10 bài tập trong Strang hoặc sách Georgia Tech → làm 🧪 tự luyện bằng tay → kiểm bằng NumPy → làm quiz chương. Khoảng 6–8 giờ mỗi chương.</p></div>`);

const muc0 = {
  title: 'Section 0 — Course framework (self-authored, no FLM syllabus)|||Mục 0 — Khung môn học (tự soạn, trường chưa công bố syllabus)',
  description: 'Giới thiệu môn, chuẩn đầu ra tự soạn, giáo trình chuẩn kèm ISBN và tài liệu mở. Trường chưa công bố syllabus MAA102 trên FLM — điểm/lịch thi theo giảng viên.',
  lessons: [m01, m02],
};


// ───────────────────────────── Chương 1 — Vectơ ─────────────────────────────
const c11 = L('maa102-ts-1-1',
  '1.1 — Vectors and linear combinations|||1.1 — Vectơ và tổ hợp tuyến tính',
  'Vectơ là mũi tên và là danh sách số; cộng vectơ, nhân vô hướng, tổ hợp tuyến tính cv + dw, span (bao tuyến tính) trong R² và R³, vectơ đặc trưng trong dữ liệu.',
  `<span class="eyebrow">MAA102 · Chapter 1 · Lesson 1.1</span>
<h2>Vectors and linear combinations</h2>
<p class="lead">Linear algebra starts with two operations only: adding vectors and multiplying them by numbers. Put together they give <strong>linear combinations</strong> — and almost every question in this course is a question about linear combinations.</p>
<h3>🎯 Objectives</h3>
<ul><li>Read a vector both as an arrow and as an ordered list of numbers.</li><li>Add vectors and multiply them by scalars, algebraically and geometrically.</li><li>Form linear combinations cv + dw and find the coefficients that produce a target vector.</li><li>Describe the span of one, two or three vectors.</li></ul>
<h3>📖 Lecture</h3>
<p>A vector in <strong>R<sup>n</sup></strong> is an ordered list of n real numbers, written as a column: v = (v<sub>1</sub>, v<sub>2</sub>, …, v<sub>n</sub>). In R<sup>2</sup> and R<sup>3</sup> we draw it as an arrow from the origin to the point with those coordinates. In computing, n is often huge: a 28×28 grey-scale image is a vector in R<sup>784</sup>; a house described by (area, bedrooms, age, distance to centre) is a vector in R<sup>4</sup>. The arrow picture stops working, but the algebra is identical.</p>
<p>The two operations are done <strong>component by component</strong>:</p>
<div class="formula"><span class="lbl">Vector addition and scalar multiplication</span>v + w = (v<sub>1</sub> + w<sub>1</sub>, …, v<sub>n</sub> + w<sub>n</sub>)    c·v = (c v<sub>1</sub>, …, c v<sub>n</sub>)</div>
<p>Geometrically, v + w is the diagonal of the parallelogram built on v and w (put the tail of w at the head of v); c·v stretches v by the factor c, and reverses it when c &lt; 0. The zero vector 0 = (0, …, 0) is the origin.</p>
<p>A <strong>linear combination</strong> of v and w is any vector cv + dw with real numbers c, d. The set of <em>all</em> linear combinations is called the <strong>span</strong>:</p>
<ul><li>All multiples cv of one non-zero vector fill a <strong>line</strong> through the origin.</li><li>All combinations cv + dw of two non-parallel vectors in R<sup>2</sup> fill the whole <strong>plane</strong> R<sup>2</sup>; in R<sup>3</sup> they fill a <strong>plane through the origin</strong>.</li><li>Three vectors in R<sup>3</sup> that do not lie in one plane span all of R<sup>3</sup>.</li></ul>
<p>Every span contains the zero vector (take all coefficients 0). The key question “is b a combination of v and w?” leads directly to a system of linear equations — Chapter 2.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — a combination.</b> u = (1, 2), v = (3, −1). Then 2u + v = (2, 4) + (3, −1) = <b>(5, 3)</b>.</p></div>
<div class="callout"><p><b>Example 2 — find the coefficients.</b> Write b = (7, 0) as c(1, 2) + d(3, −1).</p>
<p>Step 1: compare components: c + 3d = 7 and 2c − d = 0. Step 2: the second equation gives d = 2c. Step 3: substitute: c + 6c = 7, so c = 1 and d = 2. Check: (1, 2) + (6, −2) = (7, 0) ✓.</p></div>
<div class="callout"><p><b>Example 3 — a span that is only a line.</b> v = (1, 2) and w = (2, 4). Since w = 2v, every combination cv + dw = (c + 2d)v is a multiple of v: the span is the line y = 2x, not the plane. The vector (3, 7) is <b>not</b> in this span (7 ≠ 2·3).</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Adding vectors of different sizes: (1, 2) + (1, 2, 3) is undefined.</li><li>Assuming two vectors always span a plane — parallel vectors span only a line.</li><li>Forgetting that a span always passes through the origin, so the line y = 2x + 1 is not a span.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Vectors are lists of numbers; operations act component by component.</li><li>A linear combination is cv + dw (+ …); the span is the set of all of them.</li><li>Span of one vector: a line; two independent vectors: a plane; three independent vectors in R<sup>3</sup>: all of R<sup>3</sup>.</li><li>“Is b in the span?” = “does a linear system have a solution?”.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/vectors" target="_blank" rel="noopener">3Blue1Brown — Vectors, what even are they?</a></li><li><a href="https://www.3blue1brown.com/lessons/span" target="_blank" rel="noopener">3Blue1Brown — Linear combinations, span, and basis vectors</a></li><li><a href="https://textbooks.math.gatech.edu/ila/spans.html" target="_blank" rel="noopener">Interactive Linear Algebra — Vector Equations and Spans</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-1-the-geometry-of-linear-equations/" target="_blank" rel="noopener">MIT 18.06 — Lecture 1: The geometry of linear equations</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Compute 3(1, −2, 0) − 2(0, 1, 4).</li><li>Write (4, 5) as a combination of (1, 1) and (1, −1).</li><li>Is (1, 0, 0) in the span of (1, 1, 0) and (0, 1, 1)?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (3, −6, 0) − (0, 2, 8) = (3, −8, −8). 2) c + d = 4, c − d = 5 ⇒ c = 4.5, d = −0.5. 3) c(1, 1, 0) + d(0, 1, 1) = (c, c + d, d) = (1, 0, 0) forces c = 1, d = 0, but then c + d = 1 ≠ 0. <b>No.</b></p></div>`,
  `<span class="eyebrow">MAA102 · Chương 1 · Bài 1.1</span>
<h2>Vectơ và tổ hợp tuyến tính</h2>
<p class="lead">Đại số tuyến tính bắt đầu chỉ với hai phép toán: cộng vectơ và nhân vectơ với một số. Ghép lại, chúng cho ra <strong>tổ hợp tuyến tính</strong> — và gần như mọi câu hỏi trong môn này đều là câu hỏi về tổ hợp tuyến tính.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Hiểu vectơ vừa là mũi tên vừa là danh sách số có thứ tự.</li><li>Cộng vectơ, nhân vô hướng — bằng đại số và bằng hình học.</li><li>Lập tổ hợp tuyến tính cv + dw và tìm hệ số để ra một vectơ cho trước.</li><li>Mô tả span (bao tuyến tính) của một, hai, ba vectơ.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Một vectơ trong <strong>R<sup>n</sup></strong> là danh sách có thứ tự gồm n số thực, viết thành cột: v = (v<sub>1</sub>, v<sub>2</sub>, …, v<sub>n</sub>). Trong R<sup>2</sup> và R<sup>3</sup> ta vẽ nó là mũi tên từ gốc toạ độ tới điểm có các toạ độ đó. Trong tin học, n thường rất lớn: ảnh xám 28×28 là một vectơ trong R<sup>784</sup>; một căn nhà mô tả bởi (diện tích, số phòng ngủ, tuổi nhà, khoảng cách tới trung tâm) là vectơ trong R<sup>4</sup>. Hình mũi tên không vẽ được nữa, nhưng đại số y hệt.</p>
<p>Hai phép toán làm <strong>theo từng thành phần</strong>:</p>
<div class="formula"><span class="lbl">Cộng vectơ và nhân vô hướng</span>v + w = (v<sub>1</sub> + w<sub>1</sub>, …, v<sub>n</sub> + w<sub>n</sub>)    c·v = (c v<sub>1</sub>, …, c v<sub>n</sub>)</div>
<p>Về hình học, v + w là đường chéo hình bình hành dựng trên v và w (đặt gốc của w vào ngọn của v); c·v kéo giãn v theo hệ số c, và đảo chiều khi c &lt; 0. Vectơ không 0 = (0, …, 0) là gốc toạ độ.</p>
<p>Một <strong>tổ hợp tuyến tính</strong> của v và w là mọi vectơ cv + dw với c, d thực. Tập <em>tất cả</em> tổ hợp tuyến tính gọi là <strong>span</strong> (bao tuyến tính):</p>
<ul><li>Mọi bội cv của một vectơ khác 0 lấp đầy một <strong>đường thẳng</strong> qua gốc.</li><li>Mọi tổ hợp cv + dw của hai vectơ không cùng phương trong R<sup>2</sup> lấp đầy cả <strong>mặt phẳng</strong> R<sup>2</sup>; trong R<sup>3</sup> chúng lấp đầy một <strong>mặt phẳng qua gốc</strong>.</li><li>Ba vectơ trong R<sup>3</sup> không cùng nằm trên một mặt phẳng thì span là cả R<sup>3</sup>.</li></ul>
<p>Mọi span đều chứa vectơ không (lấy mọi hệ số bằng 0). Câu hỏi then chốt “b có phải tổ hợp của v và w không?” dẫn thẳng tới một hệ phương trình tuyến tính — Chương 2.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — một tổ hợp.</b> u = (1, 2), v = (3, −1). Khi đó 2u + v = (2, 4) + (3, −1) = <b>(5, 3)</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — tìm hệ số.</b> Viết b = (7, 0) dưới dạng c(1, 2) + d(3, −1).</p>
<p>Bước 1: so từng thành phần: c + 3d = 7 và 2c − d = 0. Bước 2: phương trình thứ hai cho d = 2c. Bước 3: thế vào: c + 6c = 7, nên c = 1 và d = 2. Kiểm: (1, 2) + (6, −2) = (7, 0) ✓.</p></div>
<div class="callout"><p><b>Ví dụ 3 — span chỉ là một đường thẳng.</b> v = (1, 2) và w = (2, 4). Vì w = 2v nên mọi tổ hợp cv + dw = (c + 2d)v đều là bội của v: span là đường thẳng y = 2x, không phải mặt phẳng. Vectơ (3, 7) <b>không</b> thuộc span này (7 ≠ 2·3).</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Cộng hai vectơ khác số chiều: (1, 2) + (1, 2, 3) không xác định.</li><li>Cho rằng hai vectơ luôn sinh ra mặt phẳng — hai vectơ cùng phương chỉ sinh ra đường thẳng.</li><li>Quên rằng span luôn đi qua gốc, nên đường thẳng y = 2x + 1 không phải là một span.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Vectơ là danh sách số; phép toán làm theo từng thành phần.</li><li>Tổ hợp tuyến tính là cv + dw (+ …); span là tập tất cả chúng.</li><li>Span của một vectơ: đường thẳng; hai vectơ độc lập: mặt phẳng; ba vectơ độc lập trong R<sup>3</sup>: cả R<sup>3</sup>.</li><li>“b có thuộc span không?” = “một hệ tuyến tính có nghiệm không?”.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/vectors" target="_blank" rel="noopener">3Blue1Brown — Vectơ thực ra là gì?</a></li><li><a href="https://www.3blue1brown.com/lessons/span" target="_blank" rel="noopener">3Blue1Brown — Tổ hợp tuyến tính, span và vectơ cơ sở</a></li><li><a href="https://textbooks.math.gatech.edu/ila/spans.html" target="_blank" rel="noopener">Interactive Linear Algebra — Phương trình vectơ và span</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-1-the-geometry-of-linear-equations/" target="_blank" rel="noopener">MIT 18.06 — Bài 1: Hình học của phương trình tuyến tính</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tính 3(1, −2, 0) − 2(0, 1, 4).</li><li>Viết (4, 5) thành tổ hợp của (1, 1) và (1, −1).</li><li>(1, 0, 0) có thuộc span của (1, 1, 0) và (0, 1, 1) không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (3, −6, 0) − (0, 2, 8) = (3, −8, −8). 2) c + d = 4, c − d = 5 ⇒ c = 4,5, d = −0,5. 3) c(1, 1, 0) + d(0, 1, 1) = (c, c + d, d) = (1, 0, 0) buộc c = 1, d = 0, nhưng khi đó c + d = 1 ≠ 0. <b>Không.</b></p></div>`);

const c12 = L('maa102-ts-1-2',
  '1.2 — Dot product, length, angle and cosine similarity|||1.2 — Tích vô hướng, độ dài, góc và độ tương tự cosine',
  'Tích vô hướng, độ dài (chuẩn), vectơ đơn vị, góc giữa hai vectơ, vuông góc, bất đẳng thức Cauchy–Schwarz và tam giác, độ tương tự cosine trong tìm kiếm/embedding — có code NumPy.',
  `<span class="eyebrow">MAA102 · Chapter 1 · Lesson 1.2</span>
<h2>Dot product, length, angle and cosine similarity</h2>
<p class="lead">The dot product turns two vectors into one number. That number measures length, angle and perpendicularity — and, in AI, <em>similarity</em>: search engines and chatbots rank documents by the cosine of the angle between embedding vectors.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute v·w, the length ‖v‖ and the unit vector v/‖v‖.</li><li>Find the angle between two vectors and test perpendicularity.</li><li>State the Cauchy–Schwarz and triangle inequalities.</li><li>Compute cosine similarity by hand and with NumPy.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Dot product and length</span>v·w = v<sub>1</sub>w<sub>1</sub> + v<sub>2</sub>w<sub>2</sub> + … + v<sub>n</sub>w<sub>n</sub>    ‖v‖ = √(v·v)</div>
<p>The dot product is symmetric (v·w = w·v) and linear in each vector. The length (norm) ‖v‖ is Pythagoras in n dimensions. Dividing a non-zero vector by its length gives the <strong>unit vector</strong> u = v/‖v‖ with ‖u‖ = 1 — same direction, length one. This is the “normalize” step in almost every ML pipeline.</p>
<p>The geometric meaning comes from the law of cosines:</p>
<div class="formula"><span class="lbl">Angle formula</span>cos θ = (v·w) / (‖v‖ ‖w‖)</div>
<ul><li>v·w = 0 ⇔ θ = 90°: the vectors are <strong>perpendicular (orthogonal)</strong>.</li><li>v·w &gt; 0: angle below 90°; v·w &lt; 0: angle above 90°.</li></ul>
<p>Because |cos θ| ≤ 1 we get two inequalities that hold in every R<sup>n</sup>:</p>
<div class="formula"><span class="lbl">Cauchy–Schwarz and triangle inequalities</span>|v·w| ≤ ‖v‖ ‖w‖    ‖v + w‖ ≤ ‖v‖ + ‖w‖</div>
<p><strong>Cosine similarity</strong> is just cos θ. Two documents represented by word-count vectors point in similar directions when they use the same words in similar proportions — regardless of length. A long and a short article about AI should be “similar”; that is why we compare angles, not raw distances.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — perpendicular.</b> v = (1, 2, 2), w = (2, 0, −1). v·w = 2 + 0 − 2 = 0, so v ⟂ w. Also ‖v‖ = √(1 + 4 + 4) = 3, so the unit vector is (1/3, 2/3, 2/3).</p></div>
<div class="callout"><p><b>Example 2 — an angle.</b> v = (1, 0), w = (1, 1): v·w = 1, ‖v‖ = 1, ‖w‖ = √2, so cos θ = 1/√2 and θ = 45°.</p></div>
<div class="callout"><p><b>Example 3 — document similarity.</b> Count the words [ai, music, data] in three texts: d1 = (3, 0, 1), d2 = (1, 0, 1), d3 = (0, 4, 0). Then d1·d2 = 4, ‖d1‖ = √10, ‖d2‖ = √2, so cos = 4/√20 ≈ 0.8944: very similar. d1·d3 = 0: nothing in common.</p></div>
<pre><code class="language-python">import numpy as np
# three tiny "documents" as word-count vectors over the words [ai, music, data]
d1 = np.array([3, 0, 1])
d2 = np.array([1, 0, 1])
d3 = np.array([0, 4, 0])
def cos_sim(a, b):
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))
print(round(cos_sim(d1, d2), 4))
print(round(cos_sim(d1, d3), 4))
print(np.linalg.norm(np.array([1, 2, 2])))</code></pre>
<div class="out">0.8944<br>0.0<br>3.0</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing ‖v + w‖ = ‖v‖ + ‖w‖ — true only when v and w point the same way.</li><li>Forgetting the square root in the length: ‖(3, 4)‖ = 5, not 25.</li><li>Normalizing the zero vector — it has no direction.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>v·w = sum of products of components; ‖v‖ = √(v·v).</li><li>cos θ = v·w / (‖v‖‖w‖); v·w = 0 means perpendicular.</li><li>|v·w| ≤ ‖v‖‖w‖ (Cauchy–Schwarz) and ‖v + w‖ ≤ ‖v‖ + ‖w‖.</li><li>Cosine similarity compares directions; it is the standard similarity for embeddings.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/dot-products" target="_blank" rel="noopener">3Blue1Brown — Dot products and duality</a></li><li><a href="https://textbooks.math.gatech.edu/ila/dot-product.html" target="_blank" rel="noopener">Interactive Linear Algebra — Dot Products and Orthogonality</a></li><li><a href="https://en.wikipedia.org/wiki/Cosine_similarity" target="_blank" rel="noopener">Wikipedia — Cosine similarity</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html" target="_blank" rel="noopener">NumPy — numpy.linalg.norm</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find ‖(2, −1, 2)‖ and the unit vector in its direction.</li><li>For which k is (1, k, 3) perpendicular to (2, 1, −1)?</li><li>Compute the angle between (1, 1, 0) and (0, 1, 1).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) √(4 + 1 + 4) = 3; unit vector (2/3, −1/3, 2/3). 2) 2 + k − 3 = 0 ⇒ k = 1. 3) dot = 1, both lengths √2 ⇒ cos θ = 1/2 ⇒ θ = 60°.</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 1 · Bài 1.2</span>
<h2>Tích vô hướng, độ dài, góc và độ tương tự cosine</h2>
<p class="lead">Tích vô hướng biến hai vectơ thành một số. Con số đó đo độ dài, góc, tính vuông góc — và trong AI, đo <em>độ giống nhau</em>: công cụ tìm kiếm và chatbot xếp hạng tài liệu theo cosin của góc giữa các vectơ embedding.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính v·w, độ dài ‖v‖ và vectơ đơn vị v/‖v‖.</li><li>Tìm góc giữa hai vectơ và kiểm tra vuông góc.</li><li>Phát biểu bất đẳng thức Cauchy–Schwarz và bất đẳng thức tam giác.</li><li>Tính độ tương tự cosine bằng tay và bằng NumPy.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Tích vô hướng và độ dài</span>v·w = v<sub>1</sub>w<sub>1</sub> + v<sub>2</sub>w<sub>2</sub> + … + v<sub>n</sub>w<sub>n</sub>    ‖v‖ = √(v·v)</div>
<p>Tích vô hướng có tính đối xứng (v·w = w·v) và tuyến tính theo từng vectơ. Độ dài (chuẩn) ‖v‖ là định lý Pytago trong n chiều. Chia một vectơ khác 0 cho độ dài của nó được <strong>vectơ đơn vị</strong> u = v/‖v‖ với ‖u‖ = 1 — cùng hướng, dài bằng một. Đây là bước “chuẩn hoá” trong hầu hết pipeline học máy.</p>
<p>Ý nghĩa hình học đến từ định lý cosin:</p>
<div class="formula"><span class="lbl">Công thức góc</span>cos θ = (v·w) / (‖v‖ ‖w‖)</div>
<ul><li>v·w = 0 ⇔ θ = 90°: hai vectơ <strong>vuông góc (trực giao)</strong>.</li><li>v·w &gt; 0: góc nhỏ hơn 90°; v·w &lt; 0: góc lớn hơn 90°.</li></ul>
<p>Vì |cos θ| ≤ 1 nên ta có hai bất đẳng thức đúng trong mọi R<sup>n</sup>:</p>
<div class="formula"><span class="lbl">Bất đẳng thức Cauchy–Schwarz và tam giác</span>|v·w| ≤ ‖v‖ ‖w‖    ‖v + w‖ ≤ ‖v‖ + ‖w‖</div>
<p><strong>Độ tương tự cosine</strong> chính là cos θ. Hai văn bản biểu diễn bằng vectơ đếm từ sẽ cùng hướng khi chúng dùng cùng các từ theo tỉ lệ giống nhau — bất kể dài ngắn. Một bài dài và một bài ngắn cùng về AI phải được coi là “giống”; vì thế ta so góc, không so khoảng cách thô.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — vuông góc.</b> v = (1, 2, 2), w = (2, 0, −1). v·w = 2 + 0 − 2 = 0, nên v ⟂ w. Ngoài ra ‖v‖ = √(1 + 4 + 4) = 3, nên vectơ đơn vị là (1/3, 2/3, 2/3).</p></div>
<div class="callout"><p><b>Ví dụ 2 — một góc.</b> v = (1, 0), w = (1, 1): v·w = 1, ‖v‖ = 1, ‖w‖ = √2, nên cos θ = 1/√2 và θ = 45°.</p></div>
<div class="callout"><p><b>Ví dụ 3 — độ giống của văn bản.</b> Đếm các từ [ai, music, data] trong ba văn bản: d1 = (3, 0, 1), d2 = (1, 0, 1), d3 = (0, 4, 0). Khi đó d1·d2 = 4, ‖d1‖ = √10, ‖d2‖ = √2, nên cos = 4/√20 ≈ 0,8944: rất giống. d1·d3 = 0: không có gì chung.</p></div>
<pre><code class="language-python">import numpy as np
# three tiny "documents" as word-count vectors over the words [ai, music, data]
d1 = np.array([3, 0, 1])
d2 = np.array([1, 0, 1])
d3 = np.array([0, 4, 0])
def cos_sim(a, b):
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))
print(round(cos_sim(d1, d2), 4))
print(round(cos_sim(d1, d3), 4))
print(np.linalg.norm(np.array([1, 2, 2])))</code></pre>
<div class="out">0.8944<br>0.0<br>3.0</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết ‖v + w‖ = ‖v‖ + ‖w‖ — chỉ đúng khi v và w cùng hướng.</li><li>Quên căn bậc hai khi tính độ dài: ‖(3, 4)‖ = 5, không phải 25.</li><li>Chuẩn hoá vectơ không — nó không có hướng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>v·w = tổng các tích thành phần; ‖v‖ = √(v·v).</li><li>cos θ = v·w / (‖v‖‖w‖); v·w = 0 nghĩa là vuông góc.</li><li>|v·w| ≤ ‖v‖‖w‖ (Cauchy–Schwarz) và ‖v + w‖ ≤ ‖v‖ + ‖w‖.</li><li>Độ tương tự cosine so hướng; là thước đo chuẩn cho embedding.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/dot-products" target="_blank" rel="noopener">3Blue1Brown — Tích vô hướng và tính đối ngẫu</a></li><li><a href="https://textbooks.math.gatech.edu/ila/dot-product.html" target="_blank" rel="noopener">Interactive Linear Algebra — Tích vô hướng và tính trực giao</a></li><li><a href="https://en.wikipedia.org/wiki/Cosine_similarity" target="_blank" rel="noopener">Wikipedia — Cosine similarity</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html" target="_blank" rel="noopener">NumPy — numpy.linalg.norm</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm ‖(2, −1, 2)‖ và vectơ đơn vị cùng hướng.</li><li>Với k nào thì (1, k, 3) vuông góc với (2, 1, −1)?</li><li>Tính góc giữa (1, 1, 0) và (0, 1, 1).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) √(4 + 1 + 4) = 3; vectơ đơn vị (2/3, −1/3, 2/3). 2) 2 + k − 3 = 0 ⇒ k = 1. 3) tích vô hướng = 1, hai độ dài đều là √2 ⇒ cos θ = 1/2 ⇒ θ = 60°.</p></div>`);

const c13 = L('maa102-ts-1-3',
  '1.3 — Matrices: Ax as a combination of columns|||1.3 — Ma trận: Ax là tổ hợp các cột',
  'Ma trận m×n, tích ma trận–vectơ theo hai cách nhìn (tổ hợp cột và tích vô hướng theo hàng), phương trình Ax = b, lớp nơ-ron y = ReLU(Wx + b) — có code NumPy.',
  `<span class="eyebrow">MAA102 · Chapter 1 · Lesson 1.3</span>
<h2>Matrices: Ax as a combination of columns</h2>
<p class="lead">A matrix packs several vectors side by side. Multiplying a matrix by a vector is <em>the</em> operation of linear algebra — and it is exactly what one layer of a neural network does.</p>
<h3>🎯 Objectives</h3>
<ul><li>Read the size m×n of a matrix and its entries a<sub>ij</sub>.</li><li>Compute Ax in two ways: by columns and by rows.</li><li>Rewrite a linear system as a single matrix equation Ax = b.</li><li>Recognise y = Wx + b as a neural-network layer.</li></ul>
<h3>📖 Lecture</h3>
<p>An <strong>m×n matrix</strong> A has m rows and n columns; a<sub>ij</sub> is the entry in row i, column j. A can multiply a vector x only if x has n components, and the result Ax has m components.</p>
<p><strong>Column picture.</strong> Ax is the linear combination of the columns of A with weights x<sub>1</sub>, …, x<sub>n</sub>:</p>
<div class="formula"><span class="lbl">Ax by columns</span>Ax = x<sub>1</sub>·(column 1) + x<sub>2</sub>·(column 2) + … + x<sub>n</sub>·(column n)</div>
<p><strong>Row picture.</strong> Entry i of Ax is the dot product of row i of A with x. Both pictures give the same numbers; the column picture is the one that explains the theory (Ax = b has a solution exactly when b is a combination of the columns).</p>
<p>A whole system of equations becomes one equation. The system x<sub>1</sub> + 2x<sub>2</sub> = 5, 3x<sub>1</sub> − x<sub>2</sub> = 1 is Ax = b with</p>
<div class="formula"><span class="lbl">Matrix form</span><table class="matrix"><caption>A</caption><tbody><tr><td>1</td><td>2</td></tr><tr><td>3</td><td>−1</td></tr></tbody></table> x = (x<sub>1</sub>, x<sub>2</sub>),  b = (5, 1)</div>
<p>The <strong>identity matrix</strong> I (ones on the diagonal, zeros elsewhere) satisfies Ix = x for every x.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — both pictures.</b> Let x = (2, 1, −1) and</p>
<table class="matrix"><caption>A</caption><tbody><tr><td>1</td><td>2</td><td>0</td></tr><tr><td>0</td><td>1</td><td>−1</td></tr><tr><td>3</td><td>0</td><td>1</td></tr></tbody></table>
<p>Columns: 2·(1, 0, 3) + 1·(2, 1, 0) − 1·(0, −1, 1) = (2 + 2 + 0, 0 + 1 + 1, 6 + 0 − 1) = <b>(4, 2, 5)</b>.</p>
<p>Rows: (1, 2, 0)·x = 4, (0, 1, −1)·x = 2, (3, 0, 1)·x = 5. Same answer ✓.</p></div>
<p><strong>AI connection.</strong> A dense layer with 3 inputs and 2 outputs stores a 2×3 weight matrix W and a bias b ∈ R<sup>2</sup>, and computes y = ReLU(Wx + b), where ReLU replaces negative numbers by 0. A large language model is, to a first approximation, thousands of such matrix–vector products.</p>
<pre><code class="language-python">import numpy as np
A = np.array([[1, 2, 0],
              [0, 1, -1],
              [3, 0, 1]])
x = np.array([2, 1, -1])
print(A @ x)                                      # matrix times vector
print(2*A[:, 0] + 1*A[:, 1] + (-1)*A[:, 2])       # same thing: combination of columns
# one dense layer of a neural network: y = ReLU(W x + b)
W = np.array([[0.5, -1.0, 2.0],
              [1.5,  0.0, -0.5]])
b = np.array([0.1, -0.2])
z = W @ x + b
print(z, np.maximum(z, 0))</code></pre>
<div class="out">[4 2 5]<br>[4 2 5]<br>[-1.9  3.3] [0.  3.3]</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Mismatched sizes: a 3×2 matrix cannot multiply a vector in R<sup>3</sup>.</li><li>Confusing rows and columns: a<sub>23</sub> is row 2, column 3.</li><li>In NumPy, <code>A * x</code> multiplies entry-wise (broadcasting); the matrix product is <code>A @ x</code>.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>(m×n matrix)·(vector in R<sup>n</sup>) = vector in R<sup>m</sup>.</li><li>Ax = combination of the columns of A (column picture) = dot products with the rows (row picture).</li><li>A linear system is one matrix equation Ax = b.</li><li>A neural-network layer is y = activation(Wx + b).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/linear-transformations" target="_blank" rel="noopener">3Blue1Brown — Linear transformations and matrices</a></li><li><a href="https://textbooks.math.gatech.edu/ila/matrix-equations.html" target="_blank" rel="noopener">Interactive Linear Algebra — Matrix Equations</a></li><li><a href="https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-1-the-column-space-of-a-contains-all-vectors-ax/" target="_blank" rel="noopener">MIT 18.065 — Lecture 1: The column space of A contains all vectors Ax</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Compute Ax for A = [[2, −1], [0, 3], [1, 1]] and x = (1, 2), using the column picture.</li><li>Write the system 2x − y + z = 3, x + 4z = 0 as Ax = b. What size is A?</li><li>For which vector x does [[1, 0], [0, 1]]x give (7, −2)?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 1·(2, 0, 1) + 2·(−1, 3, 1) = (0, 6, 3). 2) A = [[2, −1, 1], [1, 0, 4]] (2×3), x = (x, y, z), b = (3, 0). 3) This is the identity matrix, so x = (7, −2).</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 1 · Bài 1.3</span>
<h2>Ma trận: Ax là tổ hợp các cột</h2>
<p class="lead">Ma trận xếp nhiều vectơ cạnh nhau. Nhân ma trận với vectơ là phép toán <em>trung tâm</em> của đại số tuyến tính — và đó đúng là việc một lớp mạng nơ-ron làm.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Đọc cỡ m×n của ma trận và các phần tử a<sub>ij</sub>.</li><li>Tính Ax theo hai cách: theo cột và theo hàng.</li><li>Viết một hệ phương trình tuyến tính thành một phương trình ma trận Ax = b.</li><li>Nhận ra y = Wx + b là một lớp mạng nơ-ron.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Một <strong>ma trận m×n</strong> A có m hàng và n cột; a<sub>ij</sub> là phần tử ở hàng i, cột j. A chỉ nhân được với vectơ x có n thành phần, và kết quả Ax có m thành phần.</p>
<p><strong>Cách nhìn theo cột.</strong> Ax là tổ hợp tuyến tính các cột của A với trọng số x<sub>1</sub>, …, x<sub>n</sub>:</p>
<div class="formula"><span class="lbl">Ax theo cột</span>Ax = x<sub>1</sub>·(cột 1) + x<sub>2</sub>·(cột 2) + … + x<sub>n</sub>·(cột n)</div>
<p><strong>Cách nhìn theo hàng.</strong> Thành phần thứ i của Ax là tích vô hướng của hàng i của A với x. Hai cách cho cùng kết quả; cách nhìn theo cột là cách giải thích được lý thuyết (Ax = b có nghiệm đúng khi b là tổ hợp các cột).</p>
<p>Cả một hệ phương trình trở thành một phương trình. Hệ x<sub>1</sub> + 2x<sub>2</sub> = 5, 3x<sub>1</sub> − x<sub>2</sub> = 1 chính là Ax = b với</p>
<div class="formula"><span class="lbl">Dạng ma trận</span><table class="matrix"><caption>A</caption><tbody><tr><td>1</td><td>2</td></tr><tr><td>3</td><td>−1</td></tr></tbody></table> x = (x<sub>1</sub>, x<sub>2</sub>),  b = (5, 1)</div>
<p><strong>Ma trận đơn vị</strong> I (số 1 trên đường chéo, 0 ở chỗ khác) thoả Ix = x với mọi x.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — hai cách nhìn.</b> Cho x = (2, 1, −1) và</p>
<table class="matrix"><caption>A</caption><tbody><tr><td>1</td><td>2</td><td>0</td></tr><tr><td>0</td><td>1</td><td>−1</td></tr><tr><td>3</td><td>0</td><td>1</td></tr></tbody></table>
<p>Theo cột: 2·(1, 0, 3) + 1·(2, 1, 0) − 1·(0, −1, 1) = (2 + 2 + 0, 0 + 1 + 1, 6 + 0 − 1) = <b>(4, 2, 5)</b>.</p>
<p>Theo hàng: (1, 2, 0)·x = 4, (0, 1, −1)·x = 2, (3, 0, 1)·x = 5. Cùng kết quả ✓.</p></div>
<p><strong>Liên hệ AI.</strong> Một lớp dense có 3 đầu vào, 2 đầu ra lưu ma trận trọng số W cỡ 2×3 và độ lệch b ∈ R<sup>2</sup>, rồi tính y = ReLU(Wx + b), trong đó ReLU thay số âm bằng 0. Một mô hình ngôn ngữ lớn, nói gần đúng, là hàng nghìn phép nhân ma trận–vectơ như vậy.</p>
<pre><code class="language-python">import numpy as np
A = np.array([[1, 2, 0],
              [0, 1, -1],
              [3, 0, 1]])
x = np.array([2, 1, -1])
print(A @ x)                                      # matrix times vector
print(2*A[:, 0] + 1*A[:, 1] + (-1)*A[:, 2])       # same thing: combination of columns
# one dense layer of a neural network: y = ReLU(W x + b)
W = np.array([[0.5, -1.0, 2.0],
              [1.5,  0.0, -0.5]])
b = np.array([0.1, -0.2])
z = W @ x + b
print(z, np.maximum(z, 0))</code></pre>
<div class="out">[4 2 5]<br>[4 2 5]<br>[-1.9  3.3] [0.  3.3]</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Lệch cỡ: ma trận 3×2 không nhân được với vectơ trong R<sup>3</sup>.</li><li>Nhầm hàng và cột: a<sub>23</sub> là hàng 2, cột 3.</li><li>Trong NumPy, <code>A * x</code> nhân từng phần tử (broadcasting); tích ma trận là <code>A @ x</code>.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>(ma trận m×n)·(vectơ trong R<sup>n</sup>) = vectơ trong R<sup>m</sup>.</li><li>Ax = tổ hợp các cột của A (theo cột) = các tích vô hướng với hàng (theo hàng).</li><li>Một hệ tuyến tính là một phương trình ma trận Ax = b.</li><li>Một lớp mạng nơ-ron là y = hàm kích hoạt(Wx + b).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/linear-transformations" target="_blank" rel="noopener">3Blue1Brown — Phép biến đổi tuyến tính và ma trận</a></li><li><a href="https://textbooks.math.gatech.edu/ila/matrix-equations.html" target="_blank" rel="noopener">Interactive Linear Algebra — Phương trình ma trận</a></li><li><a href="https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-1-the-column-space-of-a-contains-all-vectors-ax/" target="_blank" rel="noopener">MIT 18.065 — Bài 1: Không gian cột của A chứa mọi vectơ Ax</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tính Ax với A = [[2, −1], [0, 3], [1, 1]] và x = (1, 2), dùng cách nhìn theo cột.</li><li>Viết hệ 2x − y + z = 3, x + 4z = 0 thành Ax = b. A có cỡ bao nhiêu?</li><li>Vectơ x nào làm [[1, 0], [0, 1]]x bằng (7, −2)?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 1·(2, 0, 1) + 2·(−1, 3, 1) = (0, 6, 3). 2) A = [[2, −1, 1], [1, 0, 4]] (2×3), x = (x, y, z), b = (3, 0). 3) Đây là ma trận đơn vị nên x = (7, −2).</p></div>`);

const q1 = QZ(1, 'Quiz — Chapter 1: Vectors, dot product, matrices|||Quiz — Chương 1: Vectơ, tích vô hướng, ma trận', 'Kiểm tra chương 1: tổ hợp tuyến tính, span, tích vô hướng, độ dài, góc, độ tương tự cosine, tích ma trận–vectơ.', [
  Q('q1', '2(1, −1) + 3(0, 2) =|||2(1, −1) + 3(0, 2) =',
    ['(2, 4)|||(2, 4)', '(2, 1)|||(2, 1)', '(5, 1)|||(5, 1)', '(2, −8)|||(2, −8)'], 0,
    '(2, −2) + (0, 6) = (2, 4).|||(2, −2) + (0, 6) = (2, 4).'),
  Q('q2', 'The vectors (1, 2, 2) and (2, 0, −1) are|||Hai vectơ (1, 2, 2) và (2, 0, −1)',
    ['parallel|||cùng phương', 'perpendicular|||vuông góc', 'at 45°|||tạo góc 45°', 'equal in length|||có cùng độ dài'], 1,
    'Dot product 2 + 0 − 2 = 0.|||Tích vô hướng 2 + 0 − 2 = 0.'),
  Q('q3', '‖(3, 4)‖ =|||‖(3, 4)‖ =',
    ['7|||7', '25|||25', '5|||5', '√7|||√7'], 2,
    '√(9 + 16) = 5.|||√(9 + 16) = 5.'),
  Q('q4', 'The angle between (1, 0) and (1, 1) is|||Góc giữa (1, 0) và (1, 1) là',
    ['30°|||30°', '45°|||45°', '60°|||60°', '90°|||90°'], 1,
    'cos θ = 1/√2.|||cos θ = 1/√2.'),
  Q('q5', 'The span of (1, 2) and (2, 4) in R² is|||Span của (1, 2) và (2, 4) trong R² là',
    ['all of R²|||cả R²', 'a line through the origin|||một đường thẳng qua gốc', 'just the origin|||chỉ gốc toạ độ', 'two points|||hai điểm'], 1,
    '(2, 4) = 2(1, 2): the vectors are parallel.|||(2, 4) = 2(1, 2): hai vectơ cùng phương.'),
  Q('q6', 'For A = [[1, 2], [3, 4]] and x = (1, 1), Ax =|||Với A = [[1, 2], [3, 4]] và x = (1, 1), Ax =',
    ['(4, 6)|||(4, 6)', '(3, 7)|||(3, 7)', '(1, 3)|||(1, 3)', '(2, 4)|||(2, 4)'], 1,
    'Sum of the two columns: (1, 3) + (2, 4).|||Tổng hai cột: (1, 3) + (2, 4).'),
  Q('q7', 'A is 3×4. For Ax to be defined, x must lie in … and Ax lies in …|||A cỡ 3×4. Để Ax xác định, x phải thuộc … và Ax thuộc …',
    ['R³, R⁴|||R³, R⁴', 'R⁴, R³|||R⁴, R³', 'R⁴, R⁴|||R⁴, R⁴', 'R¹², R³|||R¹², R³'], 1,
    'x needs one entry per column (4); Ax has one entry per row (3).|||x cần một thành phần cho mỗi cột (4); Ax có một thành phần cho mỗi hàng (3).'),
  Q('q8', 'The unit vector in the direction of (0, 3, 4) is|||Vectơ đơn vị cùng hướng (0, 3, 4) là',
    ['(0, 3, 4)|||(0, 3, 4)', '(0, 1, 1)|||(0, 1, 1)', '(0, 3/5, 4/5)|||(0, 3/5, 4/5)', '(0, 3/7, 4/7)|||(0, 3/7, 4/7)'], 2,
    'Divide by the length 5.|||Chia cho độ dài 5.'),
  Q('q9', 'Which inequality always holds?|||Bất đẳng thức nào luôn đúng?',
    ['(v·w)² ≤ ‖v‖²‖w‖²|||(v·w)² ≤ ‖v‖²‖w‖²', '‖v + w‖ ≥ ‖v‖ + ‖w‖|||‖v + w‖ ≥ ‖v‖ + ‖w‖', 'v·w ≥ 0|||v·w ≥ 0', '‖v‖ ≤ v·v|||‖v‖ ≤ v·v'], 0,
    'Cauchy–Schwarz.|||Bất đẳng thức Cauchy–Schwarz.'),
]);

const ch1 = {
  title: 'Chapter 1 — Vectors, dot products and matrices|||Chương 1 — Vectơ, tích vô hướng và ma trận',
  description: 'Vectơ, tổ hợp tuyến tính, span; tích vô hướng, độ dài, góc, độ tương tự cosine; ma trận nhân vectơ và lớp mạng nơ-ron (Strang ch.1 · MIT 18.06 bài 1).',
  lessons: [c11, c12, c13, q1],
};


// ───────────────────────────── Chương 2 — Hệ phương trình & khử Gauss ─────────────────────────────
const c21 = L('maa102-ts-2-1',
  '2.1 — Linear systems: row picture, column picture, augmented matrix|||2.1 — Hệ phương trình tuyến tính: hình ảnh hàng, hình ảnh cột, ma trận mở rộng',
  'Hệ tuyến tính, nghiệm, ba khả năng (vô nghiệm, một nghiệm, vô số nghiệm), hình ảnh hàng (giao các đường/mặt) và hình ảnh cột (tổ hợp cột), ma trận mở rộng và ba phép biến đổi hàng.',
  `<span class="eyebrow">MAA102 · Chapter 2 · Lesson 2.1</span>
<h2>Linear systems: row picture, column picture, augmented matrix</h2>
<p class="lead">A linear system asks for numbers that satisfy several linear equations at once. Before solving anything, learn to <em>see</em> a system in two ways — and to know in advance that only three outcomes are possible.</p>
<h3>🎯 Objectives</h3>
<ul><li>Recognise a linear equation and a linear system.</li><li>Interpret a system by rows (intersecting lines/planes) and by columns (combining columns).</li><li>Know that a system has no solution, exactly one, or infinitely many.</li><li>Write the augmented matrix and apply the three elementary row operations.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>linear equation</strong> in x<sub>1</sub>, …, x<sub>n</sub> has the form a<sub>1</sub>x<sub>1</sub> + … + a<sub>n</sub>x<sub>n</sub> = b: no products of unknowns, no powers, no sin x. A <strong>linear system</strong> is a collection of such equations; a <strong>solution</strong> is a vector x satisfying all of them.</p>
<p><strong>Row picture.</strong> In two unknowns each equation is a line; the solution is where the lines meet. In three unknowns each equation is a plane. <strong>Column picture.</strong> The same system asks: which combination x<sub>1</sub>·(column 1) + x<sub>2</sub>·(column 2) produces the right-hand side b? (Lesson 1.3.)</p>
<p>Two lines in a plane either meet once, are parallel (never meet), or coincide (meet everywhere). The same holds in any dimension:</p>
<div class="formula"><span class="lbl">Three possibilities</span>no solution (inconsistent)    exactly one solution    infinitely many solutions</div>
<p>It is impossible to have exactly two solutions: if x and y both solve Ax = b, then every point (1 − t)x + ty on the line through them does too.</p>
<p><strong>Augmented matrix.</strong> We drop the unknowns and keep the numbers: the system's coefficient matrix A with b attached as an extra column, written [A | b]. The <strong>elementary row operations</strong> do not change the solution set:</p>
<ol><li><strong>Replacement:</strong> add a multiple of one row to another row.</li><li><strong>Interchange:</strong> swap two rows.</li><li><strong>Scaling:</strong> multiply a row by a <em>non-zero</em> constant.</li></ol>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — one solution.</b> x + 2y = 5, 3x − y = 1.</p>
<p>Augmented matrix:</p>
<table class="matrix"><tbody><tr><td>1</td><td>2</td><td>│</td><td>5</td></tr><tr><td>3</td><td>−1</td><td>│</td><td>1</td></tr></tbody></table>
<p>Replace R2 by R2 − 3R1: (0, −7 | −14), so y = 2; then x = 5 − 2·2 = 1. Row picture: the lines meet at (1, 2). Column picture: 1·(1, 3) + 2·(2, −1) = (5, 1) ✓.</p></div>
<div class="callout"><p><b>Example 2 — no solution.</b> x + y = 2 and 2x + 2y = 5. R2 − 2R1 gives 0 = 1: contradiction. The lines are parallel.</p></div>
<div class="callout"><p><b>Example 3 — infinitely many.</b> x + y = 2 and 2x + 2y = 4. R2 − 2R1 gives 0 = 0. One equation is left: y = t is free, x = 2 − t. The two lines coincide.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting to apply a row operation to the right-hand side column too.</li><li>“Scaling” a row by 0 — that destroys an equation and can create fake solutions.</li><li>Thinking “more equations than unknowns ⇒ no solution”. It depends on the numbers, not only on the counts.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Row picture: intersect lines/planes. Column picture: combine columns to reach b.</li><li>Every linear system has 0, 1 or infinitely many solutions.</li><li>Work on the augmented matrix [A | b].</li><li>Replacement, interchange and non-zero scaling keep the solution set.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/systems-of-eqns.html" target="_blank" rel="noopener">Interactive Linear Algebra — Systems of Linear Equations</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-1-the-geometry-of-linear-equations/" target="_blank" rel="noopener">MIT 18.06 — Lecture 1: The geometry of linear equations</a></li><li><a href="https://en.wikipedia.org/wiki/System_of_linear_equations" target="_blank" rel="noopener">Wikipedia — System of linear equations</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Solve 2x + y = 7, x − y = −1 and check with the column picture.</li><li>For which k does x + ky = 1, 2x + 4y = 3 have no solution?</li><li>Can a system of 3 equations in 2 unknowns have exactly one solution? Give an example.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Adding the equations: 3x = 6 ⇒ x = 2, y = 3; 2·(2, 1) + 3·(1, −1) = (7, −1) ✓. 2) The lines are parallel when 1/2 = k/4, i.e. k = 2; then 2x + 4y = 2 contradicts 2x + 4y = 3, so <b>k = 2</b>. 3) Yes: x = 1, y = 2, x + y = 3 (three lines through one point).</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 2 · Bài 2.1</span>
<h2>Hệ phương trình tuyến tính: hình ảnh hàng, hình ảnh cột, ma trận mở rộng</h2>
<p class="lead">Một hệ tuyến tính đòi tìm các số thoả nhiều phương trình tuyến tính cùng lúc. Trước khi giải, hãy học cách <em>nhìn</em> hệ theo hai kiểu — và biết trước rằng chỉ có ba khả năng xảy ra.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận biết phương trình tuyến tính và hệ tuyến tính.</li><li>Hiểu hệ theo hàng (giao các đường/mặt phẳng) và theo cột (tổ hợp các cột).</li><li>Biết rằng hệ vô nghiệm, có đúng một nghiệm hoặc vô số nghiệm.</li><li>Viết ma trận mở rộng và dùng ba phép biến đổi hàng sơ cấp.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Một <strong>phương trình tuyến tính</strong> theo x<sub>1</sub>, …, x<sub>n</sub> có dạng a<sub>1</sub>x<sub>1</sub> + … + a<sub>n</sub>x<sub>n</sub> = b: không có tích các ẩn, không có luỹ thừa, không có sin x. Một <strong>hệ tuyến tính</strong> là tập các phương trình như vậy; một <strong>nghiệm</strong> là vectơ x thoả tất cả.</p>
<p><strong>Hình ảnh hàng.</strong> Với hai ẩn, mỗi phương trình là một đường thẳng; nghiệm là giao điểm. Với ba ẩn, mỗi phương trình là một mặt phẳng. <strong>Hình ảnh cột.</strong> Cùng hệ đó hỏi: tổ hợp x<sub>1</sub>·(cột 1) + x<sub>2</sub>·(cột 2) nào cho ra vế phải b? (Bài 1.3.)</p>
<p>Hai đường thẳng trong mặt phẳng hoặc cắt nhau tại một điểm, hoặc song song (không cắt), hoặc trùng nhau (cắt ở mọi điểm). Điều đó đúng ở mọi số chiều:</p>
<div class="formula"><span class="lbl">Ba khả năng</span>vô nghiệm (không tương thích)    đúng một nghiệm    vô số nghiệm</div>
<p>Không thể có đúng hai nghiệm: nếu x và y cùng là nghiệm của Ax = b thì mọi điểm (1 − t)x + ty trên đường thẳng qua chúng cũng là nghiệm.</p>
<p><strong>Ma trận mở rộng.</strong> Bỏ các ẩn, giữ các số: ma trận hệ số A ghép thêm cột b, viết [A | b]. Các <strong>phép biến đổi hàng sơ cấp</strong> không làm đổi tập nghiệm:</p>
<ol><li><strong>Thay thế:</strong> cộng vào một hàng một bội của hàng khác.</li><li><strong>Đổi chỗ:</strong> hoán vị hai hàng.</li><li><strong>Co giãn:</strong> nhân một hàng với hằng số <em>khác 0</em>.</li></ol>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — một nghiệm.</b> x + 2y = 5, 3x − y = 1.</p>
<p>Ma trận mở rộng:</p>
<table class="matrix"><tbody><tr><td>1</td><td>2</td><td>│</td><td>5</td></tr><tr><td>3</td><td>−1</td><td>│</td><td>1</td></tr></tbody></table>
<p>Thay R2 bằng R2 − 3R1: (0, −7 | −14), nên y = 2; rồi x = 5 − 2·2 = 1. Hình ảnh hàng: hai đường cắt nhau tại (1, 2). Hình ảnh cột: 1·(1, 3) + 2·(2, −1) = (5, 1) ✓.</p></div>
<div class="callout"><p><b>Ví dụ 2 — vô nghiệm.</b> x + y = 2 và 2x + 2y = 5. R2 − 2R1 cho 0 = 1: mâu thuẫn. Hai đường song song.</p></div>
<div class="callout"><p><b>Ví dụ 3 — vô số nghiệm.</b> x + y = 2 và 2x + 2y = 4. R2 − 2R1 cho 0 = 0. Còn một phương trình: y = t tự do, x = 2 − t. Hai đường trùng nhau.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên áp phép biến đổi hàng cho cả cột vế phải.</li><li>“Co giãn” một hàng với hệ số 0 — làm mất một phương trình và có thể sinh nghiệm giả.</li><li>Nghĩ “nhiều phương trình hơn ẩn ⇒ vô nghiệm”. Điều đó phụ thuộc các con số, không chỉ phụ thuộc số lượng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Hình ảnh hàng: giao các đường/mặt. Hình ảnh cột: tổ hợp các cột để ra b.</li><li>Mọi hệ tuyến tính có 0, 1 hoặc vô số nghiệm.</li><li>Làm việc trên ma trận mở rộng [A | b].</li><li>Thay thế, đổi chỗ và co giãn khác 0 giữ nguyên tập nghiệm.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/systems-of-eqns.html" target="_blank" rel="noopener">Interactive Linear Algebra — Hệ phương trình tuyến tính</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-1-the-geometry-of-linear-equations/" target="_blank" rel="noopener">MIT 18.06 — Bài 1: Hình học của phương trình tuyến tính</a></li><li><a href="https://en.wikipedia.org/wiki/System_of_linear_equations" target="_blank" rel="noopener">Wikipedia — System of linear equations</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Giải 2x + y = 7, x − y = −1 rồi kiểm bằng hình ảnh cột.</li><li>Với k nào thì hệ x + ky = 1, 2x + 4y = 3 vô nghiệm?</li><li>Hệ 3 phương trình 2 ẩn có thể có đúng một nghiệm không? Cho ví dụ.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Cộng hai phương trình: 3x = 6 ⇒ x = 2, y = 3; 2·(2, 1) + 3·(1, −1) = (7, −1) ✓. 2) Hai đường song song khi 1/2 = k/4, tức k = 2; khi đó 2x + 4y = 2 mâu thuẫn với 2x + 4y = 3, nên <b>k = 2</b>. 3) Có: x = 1, y = 2, x + y = 3 (ba đường thẳng đồng quy).</p></div>`);

const c22 = L('maa102-ts-2-2',
  '2.2 — Gaussian elimination and back substitution|||2.2 — Khử Gauss và thế ngược',
  'Thuật toán khử Gauss: pivot, hệ số nhân, dạng bậc thang (tam giác trên), thế ngược, đổi hàng khi pivot bằng 0, chi phí ~n³/3 phép tính, numpy.linalg.solve.',
  `<span class="eyebrow">MAA102 · Chapter 2 · Lesson 2.2</span>
<h2>Gaussian elimination and back substitution</h2>
<p class="lead">Elimination is the algorithm every computer uses to solve Ax = b. It turns any square system into a triangular one, which is then solved from the bottom up.</p>
<h3>🎯 Objectives</h3>
<ul><li>Run forward elimination: pivots, multipliers, upper-triangular form U.</li><li>Solve the triangular system by back substitution.</li><li>Exchange rows when a pivot is zero, and recognise singular systems.</li><li>Know the cost of elimination and use <code>numpy.linalg.solve</code>.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Forward elimination.</strong> Work column by column. The first non-zero entry used to clear a column is the <strong>pivot</strong>. For every row below, subtract</p>
<div class="formula"><span class="lbl">Multiplier</span>l<sub>ij</sub> = (entry to eliminate) / (pivot)    row i ← row i − l<sub>ij</sub> · (pivot row)</div>
<p>After all columns are cleared the matrix is <strong>upper triangular</strong> U (zeros below the diagonal), which is a special case of <strong>row echelon form</strong>. <strong>Back substitution</strong> then solves the last equation first and moves upward.</p>
<p><strong>Zero pivots.</strong> If a pivot position contains 0, swap with a lower row that has a non-zero entry in that column. If no such row exists, the matrix is <strong>singular</strong>: it has fewer than n pivots, and the system has either no solution or infinitely many (Lesson 2.3). A non-singular n×n matrix has n non-zero pivots and a unique solution.</p>
<p><strong>Cost.</strong> Eliminating an n×n matrix takes about n<sup>3</sup>/3 multiply–subtract operations; back substitution only about n<sup>2</sup>/2. For n = 1000 that is roughly 3.3·10<sup>8</sup> operations — a fraction of a second on a laptop. Libraries (LAPACK, used by NumPy) also choose the <em>largest</em> available pivot in each column (<strong>partial pivoting</strong>) to limit rounding errors.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Solve</b> x + y + z = 6, 2x + 3y + z = 11, x − y + 2z = 5.</p>
<table class="matrix"><caption>[A │ b]</caption><tbody><tr><td>1</td><td>1</td><td>1</td><td>│</td><td>6</td></tr><tr><td>2</td><td>3</td><td>1</td><td>│</td><td>11</td></tr><tr><td>1</td><td>−1</td><td>2</td><td>│</td><td>5</td></tr></tbody></table>
<p>Step 1 (pivot 1 in column 1): R2 ← R2 − 2R1 gives (0, 1, −1 | −1); R3 ← R3 − 1·R1 gives (0, −2, 1 | −1).</p>
<p>Step 2 (pivot 1 in column 2): R3 ← R3 − (−2)R2 = R3 + 2R2 gives (0, 0, −1 | −3).</p>
<table class="matrix"><caption>[U │ c]</caption><tbody><tr><td>1</td><td>1</td><td>1</td><td>│</td><td>6</td></tr><tr><td>0</td><td>1</td><td>−1</td><td>│</td><td>−1</td></tr><tr><td>0</td><td>0</td><td>−1</td><td>│</td><td>−3</td></tr></tbody></table>
<p>Step 3 (back substitution): −z = −3 ⇒ z = 3; y − z = −1 ⇒ y = 2; x + y + z = 6 ⇒ x = 1. The pivots are 1, 1, −1 and the solution is <b>(1, 2, 3)</b>. Check: 2 + 6 + 3 = 11 ✓, 1 − 2 + 6 = 5 ✓.</p></div>
<pre><code class="language-python">import numpy as np
A = np.array([[1, 1, 1],
              [2, 3, 1],
              [1, -1, 2]], dtype=float)
b = np.array([6, 11, 5], dtype=float)
x = np.linalg.solve(A, b)   # LU with partial pivoting under the hood (LAPACK)
print(x)
print(np.allclose(A @ x, b))</code></pre>
<div class="out">[1. 2. 3.]<br>True</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Sign errors with negative multipliers: “subtract −2 times” means <em>add</em> 2 times.</li><li>Using a row that has already been used as a pivot row to eliminate upward during forward elimination — you undo your zeros.</li><li>Stopping when a pivot is 0 instead of trying a row exchange first.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Pivot, multiplier l = entry/pivot, subtract l × pivot row.</li><li>Goal: upper-triangular U, then back substitution from the bottom.</li><li>Zero pivot ⇒ exchange rows; impossible ⇒ singular matrix.</li><li>Cost ≈ n<sup>3</sup>/3; in practice call <code>np.linalg.solve</code> (never compute an inverse just to solve).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-2-elimination-with-matrices/" target="_blank" rel="noopener">MIT 18.06 — Lecture 2: Elimination with matrices</a></li><li><a href="https://textbooks.math.gatech.edu/ila/row-reduction.html" target="_blank" rel="noopener">Interactive Linear Algebra — Row Reduction</a></li><li><a href="https://en.wikipedia.org/wiki/Gaussian_elimination" target="_blank" rel="noopener">Wikipedia — Gaussian elimination</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.solve.html" target="_blank" rel="noopener">NumPy — numpy.linalg.solve</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Solve by elimination: x + y + z = 2, x + 2y + 3z = 3, 2x + y − z = 2.</li><li>The system y + z = 3, x + y = 3, x + z = 2 has a zero first pivot. What is the first step? Solve it.</li><li>Roughly how many operations does elimination need for n = 2000 compared with n = 1000?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) R2 − R1: (0, 1, 2 | 1); R3 − 2R1: (0, −1, −3 | −2); R3 + R2: (0, 0, −1 | −1) ⇒ z = 1, y = −1, x = 2. 2) Swap rows 1 and 2 (or 1 and 3); solution x = 1, y = 2, z = 1. 3) n<sup>3</sup> grows 2<sup>3</sup> = 8 times: about 8 times more work.</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 2 · Bài 2.2</span>
<h2>Khử Gauss và thế ngược</h2>
<p class="lead">Phép khử là thuật toán mọi máy tính dùng để giải Ax = b. Nó biến mọi hệ vuông thành hệ tam giác, rồi giải từ dưới lên.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Thực hiện khử xuôi: pivot, hệ số nhân, dạng tam giác trên U.</li><li>Giải hệ tam giác bằng thế ngược.</li><li>Đổi hàng khi pivot bằng 0 và nhận ra hệ suy biến.</li><li>Biết chi phí của phép khử và dùng <code>numpy.linalg.solve</code>.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Khử xuôi.</strong> Làm lần lượt từng cột. Phần tử khác 0 dùng để khử một cột gọi là <strong>pivot</strong> (phần tử trụ). Với mỗi hàng bên dưới, trừ đi</p>
<div class="formula"><span class="lbl">Hệ số nhân</span>l<sub>ij</sub> = (phần tử cần khử) / (pivot)    hàng i ← hàng i − l<sub>ij</sub> · (hàng pivot)</div>
<p>Khử xong mọi cột, ma trận thành <strong>tam giác trên</strong> U (toàn số 0 dưới đường chéo) — một trường hợp riêng của <strong>dạng bậc thang</strong>. <strong>Thế ngược</strong> giải phương trình cuối trước rồi đi dần lên.</p>
<p><strong>Pivot bằng 0.</strong> Nếu vị trí pivot là 0, đổi chỗ với một hàng bên dưới có phần tử khác 0 ở cột đó. Nếu không có hàng nào như vậy, ma trận <strong>suy biến</strong>: có ít hơn n pivot, và hệ vô nghiệm hoặc vô số nghiệm (Bài 2.3). Ma trận n×n không suy biến có n pivot khác 0 và hệ có nghiệm duy nhất.</p>
<p><strong>Chi phí.</strong> Khử một ma trận n×n tốn khoảng n<sup>3</sup>/3 phép nhân–trừ; thế ngược chỉ khoảng n<sup>2</sup>/2. Với n = 1000 là khoảng 3,3·10<sup>8</sup> phép tính — chưa tới một giây trên laptop. Thư viện (LAPACK, NumPy gọi tới) còn chọn pivot có trị tuyệt đối <em>lớn nhất</em> trong cột (<strong>chọn pivot từng phần</strong>) để hạn chế sai số làm tròn.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Giải</b> x + y + z = 6, 2x + 3y + z = 11, x − y + 2z = 5.</p>
<table class="matrix"><caption>[A │ b]</caption><tbody><tr><td>1</td><td>1</td><td>1</td><td>│</td><td>6</td></tr><tr><td>2</td><td>3</td><td>1</td><td>│</td><td>11</td></tr><tr><td>1</td><td>−1</td><td>2</td><td>│</td><td>5</td></tr></tbody></table>
<p>Bước 1 (pivot 1 ở cột 1): R2 ← R2 − 2R1 cho (0, 1, −1 | −1); R3 ← R3 − 1·R1 cho (0, −2, 1 | −1).</p>
<p>Bước 2 (pivot 1 ở cột 2): R3 ← R3 − (−2)R2 = R3 + 2R2 cho (0, 0, −1 | −3).</p>
<table class="matrix"><caption>[U │ c]</caption><tbody><tr><td>1</td><td>1</td><td>1</td><td>│</td><td>6</td></tr><tr><td>0</td><td>1</td><td>−1</td><td>│</td><td>−1</td></tr><tr><td>0</td><td>0</td><td>−1</td><td>│</td><td>−3</td></tr></tbody></table>
<p>Bước 3 (thế ngược): −z = −3 ⇒ z = 3; y − z = −1 ⇒ y = 2; x + y + z = 6 ⇒ x = 1. Các pivot là 1, 1, −1 và nghiệm là <b>(1, 2, 3)</b>. Kiểm: 2 + 6 + 3 = 11 ✓, 1 − 2 + 6 = 5 ✓.</p></div>
<pre><code class="language-python">import numpy as np
A = np.array([[1, 1, 1],
              [2, 3, 1],
              [1, -1, 2]], dtype=float)
b = np.array([6, 11, 5], dtype=float)
x = np.linalg.solve(A, b)   # LU with partial pivoting under the hood (LAPACK)
print(x)
print(np.allclose(A @ x, b))</code></pre>
<div class="out">[1. 2. 3.]<br>True</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Sai dấu với hệ số nhân âm: “trừ −2 lần” nghĩa là <em>cộng</em> 2 lần.</li><li>Trong lúc khử xuôi lại dùng một hàng pivot đã xong để khử ngược lên — làm hỏng các số 0 đã tạo.</li><li>Dừng lại khi gặp pivot 0 thay vì thử đổi hàng trước.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Pivot, hệ số nhân l = phần tử/pivot, trừ l × hàng pivot.</li><li>Mục tiêu: tam giác trên U, rồi thế ngược từ dưới lên.</li><li>Pivot 0 ⇒ đổi hàng; không đổi được ⇒ ma trận suy biến.</li><li>Chi phí ≈ n<sup>3</sup>/3; thực tế gọi <code>np.linalg.solve</code> (đừng tính nghịch đảo chỉ để giải hệ).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-2-elimination-with-matrices/" target="_blank" rel="noopener">MIT 18.06 — Bài 2: Khử bằng ma trận</a></li><li><a href="https://textbooks.math.gatech.edu/ila/row-reduction.html" target="_blank" rel="noopener">Interactive Linear Algebra — Rút gọn hàng</a></li><li><a href="https://en.wikipedia.org/wiki/Gaussian_elimination" target="_blank" rel="noopener">Wikipedia — Gaussian elimination</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.solve.html" target="_blank" rel="noopener">NumPy — numpy.linalg.solve</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Giải bằng phép khử: x + y + z = 2, x + 2y + 3z = 3, 2x + y − z = 2.</li><li>Hệ y + z = 3, x + y = 3, x + z = 2 có pivot đầu tiên bằng 0. Bước đầu tiên là gì? Giải hệ.</li><li>Với n = 2000, phép khử tốn khoảng bao nhiêu lần so với n = 1000?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) R2 − R1: (0, 1, 2 | 1); R3 − 2R1: (0, −1, −3 | −2); R3 + R2: (0, 0, −1 | −1) ⇒ z = 1, y = −1, x = 2. 2) Đổi hàng 1 với hàng 2 (hoặc hàng 3); nghiệm x = 1, y = 2, z = 1. 3) n<sup>3</sup> tăng 2<sup>3</sup> = 8 lần: tốn khoảng gấp 8.</p></div>`);

const c23 = L('maa102-ts-2-3',
  '2.3 — Reduced row echelon form, free variables and solution sets|||2.3 — Dạng bậc thang rút gọn, biến tự do và tập nghiệm',
  'Dạng bậc thang và bậc thang rút gọn (RREF), cột pivot, biến tự do, nghiệm dạng tham số, định lý tồn tại/duy nhất, hệ thuần nhất — có code sympy rref().',
  `<span class="eyebrow">MAA102 · Chapter 2 · Lesson 2.3</span>
<h2>Reduced row echelon form, free variables and solution sets</h2>
<p class="lead">When a matrix is not square, or is singular, elimination does not end in a neat triangle. Gauss–Jordan elimination goes one step further to the <strong>reduced row echelon form</strong>, from which the entire solution set can be read off.</p>
<h3>🎯 Objectives</h3>
<ul><li>Recognise echelon form and reduced row echelon form (RREF).</li><li>Identify pivot columns, the rank, and free variables.</li><li>Write the solution set in parametric (vector) form.</li><li>Apply the existence and uniqueness theorem; reason about homogeneous systems.</li></ul>
<h3>📖 Lecture</h3>
<p>A matrix is in <strong>row echelon form</strong> if all zero rows are at the bottom and each row's leading entry (pivot) is to the right of the pivot above it. It is in <strong>reduced row echelon form</strong> if, in addition, every pivot equals 1 and is the only non-zero entry in its column. Every matrix has <strong>exactly one</strong> RREF; Gauss–Jordan elimination reaches it by also clearing the entries above each pivot.</p>
<p>Columns that contain a pivot are <strong>pivot columns</strong>; their variables are <strong>basic</strong>. The other variables are <strong>free</strong>: they may take any value, and the basic variables are expressed in terms of them. The number of pivots is the <strong>rank</strong> r of the matrix.</p>
<div class="formula"><span class="lbl">Existence and uniqueness</span>consistent ⇔ no row [0 0 … 0 │ c] with c ≠ 0    unique ⇔ consistent and no free variables (r = n)</div>
<p>A <strong>homogeneous</strong> system Ax = 0 always has the trivial solution x = 0. If it has more unknowns than equations (n &gt; m), there must be a free variable, so it has infinitely many solutions.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Solve</b> x<sub>1</sub> + 2x<sub>2</sub> + 3x<sub>4</sub> = 5, x<sub>3</sub> − x<sub>4</sub> = 2, x<sub>1</sub> + 2x<sub>2</sub> + x<sub>3</sub> + 2x<sub>4</sub> = 7.</p>
<table class="matrix"><caption>[A │ b]</caption><tbody><tr><td>1</td><td>2</td><td>0</td><td>3</td><td>│</td><td>5</td></tr><tr><td>0</td><td>0</td><td>1</td><td>−1</td><td>│</td><td>2</td></tr><tr><td>1</td><td>2</td><td>1</td><td>2</td><td>│</td><td>7</td></tr></tbody></table>
<p>Step 1: R3 ← R3 − R1 gives (0, 0, 1, −1 | 2). Step 2: R3 ← R3 − R2 gives a zero row (0, 0, 0, 0 | 0). The RREF is</p>
<table class="matrix"><caption>RREF</caption><tbody><tr><td>1</td><td>2</td><td>0</td><td>3</td><td>│</td><td>5</td></tr><tr><td>0</td><td>0</td><td>1</td><td>−1</td><td>│</td><td>2</td></tr><tr><td>0</td><td>0</td><td>0</td><td>0</td><td>│</td><td>0</td></tr></tbody></table>
<p>Step 3: pivots in columns 1 and 3 ⇒ rank 2, free variables x<sub>2</sub> = s and x<sub>4</sub> = t. Step 4: x<sub>1</sub> = 5 − 2s − 3t, x<sub>3</sub> = 2 + t. In vector form:</p>
<div class="formula"><span class="lbl">Parametric solution</span>x = (5, 0, 2, 0) + s·(−2, 1, 0, 0) + t·(−3, 0, 1, 1),   s, t ∈ R</div>
<p>A plane of solutions in R<sup>4</sup>. If the third right-hand side were 8 instead of 7, the last row would read 0 = 1 and there would be <b>no</b> solution.</p></div>
<pre><code class="language-python">from sympy import Matrix
Ab = Matrix([[1, 2, 0, 3, 5],
             [0, 0, 1, -1, 2],
             [1, 2, 1, 2, 7]])
R, pivots = Ab.rref()
print(R)
print(pivots)</code></pre>
<div class="out">Matrix([[1, 2, 0, 3, 5], [0, 0, 1, -1, 2], [0, 0, 0, 0, 0]])<br>(0, 2)</div>
<p>SymPy works with exact fractions, so it is the right tool for checking RREF by hand; the pivot indices are 0-based (columns 1 and 3).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Treating a zero row [0 … 0 | 0] as a contradiction — it is harmless; only [0 … 0 | c ≠ 0] is.</li><li>Choosing pivot variables as parameters. Parameters must be the <em>free</em> variables.</li><li>Forgetting the particular part (5, 0, 2, 0) and writing only the combination of direction vectors.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>RREF: pivots equal 1, zeros above and below each pivot; it is unique.</li><li>Rank = number of pivots; free variables = n − r.</li><li>Solution set = particular solution + combinations of direction vectors.</li><li>No bad row ⇒ consistent; no free variable ⇒ unique.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/parametric-form.html" target="_blank" rel="noopener">Interactive Linear Algebra — Parametric Form</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-8-solving-ax-b-row-reduced-form-r/" target="_blank" rel="noopener">MIT 18.06 — Lecture 8: Solving Ax = b, row reduced form R</a></li><li><a href="https://en.wikipedia.org/wiki/Row_echelon_form" target="_blank" rel="noopener">Wikipedia — Row echelon form</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write all solutions of the single equation x + 2y − z = 1 in R<sup>3</sup>.</li><li>Is the system with RREF [[1, 0, 2 | 3], [0, 1, −1 | 1], [0, 0, 0 | 4]] consistent?</li><li>A homogeneous system has 4 equations and 6 unknowns. How many solutions can it have?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) y = s, z = t free: x = (1, 0, 0) + s(−2, 1, 0) + t(1, 0, 1). 2) No: the last row says 0 = 4. 3) Infinitely many (at least 6 − 4 = 2 free variables).</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 2 · Bài 2.3</span>
<h2>Dạng bậc thang rút gọn, biến tự do và tập nghiệm</h2>
<p class="lead">Khi ma trận không vuông, hoặc suy biến, phép khử không kết thúc bằng một tam giác gọn gàng. Phép khử Gauss–Jordan đi thêm một bước tới <strong>dạng bậc thang rút gọn</strong>, từ đó đọc ra toàn bộ tập nghiệm.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận biết dạng bậc thang và dạng bậc thang rút gọn (RREF).</li><li>Xác định cột pivot, hạng và biến tự do.</li><li>Viết tập nghiệm ở dạng tham số (dạng vectơ).</li><li>Áp dụng định lý tồn tại và duy nhất; lập luận về hệ thuần nhất.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Ma trận ở <strong>dạng bậc thang</strong> nếu mọi hàng 0 nằm dưới cùng và phần tử khác 0 đầu tiên (pivot) của mỗi hàng nằm bên phải pivot của hàng trên. Ma trận ở <strong>dạng bậc thang rút gọn</strong> nếu thêm: mọi pivot bằng 1 và là phần tử khác 0 duy nhất trong cột của nó. Mỗi ma trận có <strong>đúng một</strong> RREF; phép khử Gauss–Jordan đạt tới nó bằng cách khử cả các phần tử phía trên pivot.</p>
<p>Cột chứa pivot gọi là <strong>cột pivot</strong>; biến ứng với nó là <strong>biến cơ sở</strong>. Các biến còn lại là <strong>biến tự do</strong>: nhận giá trị tuỳ ý, và các biến cơ sở được biểu diễn theo chúng. Số pivot là <strong>hạng</strong> r của ma trận.</p>
<div class="formula"><span class="lbl">Tồn tại và duy nhất</span>có nghiệm ⇔ không có hàng [0 0 … 0 │ c] với c ≠ 0    nghiệm duy nhất ⇔ có nghiệm và không có biến tự do (r = n)</div>
<p>Hệ <strong>thuần nhất</strong> Ax = 0 luôn có nghiệm tầm thường x = 0. Nếu nó có nhiều ẩn hơn phương trình (n &gt; m) thì chắc chắn có biến tự do, nên có vô số nghiệm.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Giải</b> x<sub>1</sub> + 2x<sub>2</sub> + 3x<sub>4</sub> = 5, x<sub>3</sub> − x<sub>4</sub> = 2, x<sub>1</sub> + 2x<sub>2</sub> + x<sub>3</sub> + 2x<sub>4</sub> = 7.</p>
<table class="matrix"><caption>[A │ b]</caption><tbody><tr><td>1</td><td>2</td><td>0</td><td>3</td><td>│</td><td>5</td></tr><tr><td>0</td><td>0</td><td>1</td><td>−1</td><td>│</td><td>2</td></tr><tr><td>1</td><td>2</td><td>1</td><td>2</td><td>│</td><td>7</td></tr></tbody></table>
<p>Bước 1: R3 ← R3 − R1 cho (0, 0, 1, −1 | 2). Bước 2: R3 ← R3 − R2 cho hàng 0 (0, 0, 0, 0 | 0). RREF là</p>
<table class="matrix"><caption>RREF</caption><tbody><tr><td>1</td><td>2</td><td>0</td><td>3</td><td>│</td><td>5</td></tr><tr><td>0</td><td>0</td><td>1</td><td>−1</td><td>│</td><td>2</td></tr><tr><td>0</td><td>0</td><td>0</td><td>0</td><td>│</td><td>0</td></tr></tbody></table>
<p>Bước 3: pivot ở cột 1 và 3 ⇒ hạng 2, biến tự do x<sub>2</sub> = s và x<sub>4</sub> = t. Bước 4: x<sub>1</sub> = 5 − 2s − 3t, x<sub>3</sub> = 2 + t. Dạng vectơ:</p>
<div class="formula"><span class="lbl">Nghiệm dạng tham số</span>x = (5, 0, 2, 0) + s·(−2, 1, 0, 0) + t·(−3, 0, 1, 1),   s, t ∈ R</div>
<p>Một mặt phẳng nghiệm trong R<sup>4</sup>. Nếu vế phải thứ ba là 8 thay vì 7, hàng cuối sẽ là 0 = 1 và hệ <b>vô nghiệm</b>.</p></div>
<pre><code class="language-python">from sympy import Matrix
Ab = Matrix([[1, 2, 0, 3, 5],
             [0, 0, 1, -1, 2],
             [1, 2, 1, 2, 7]])
R, pivots = Ab.rref()
print(R)
print(pivots)</code></pre>
<div class="out">Matrix([[1, 2, 0, 3, 5], [0, 0, 1, -1, 2], [0, 0, 0, 0, 0]])<br>(0, 2)</div>
<p>SymPy tính bằng phân số chính xác, nên là công cụ đúng để kiểm RREF làm tay; chỉ số pivot đếm từ 0 (tức cột 1 và 3).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Coi hàng 0 [0 … 0 | 0] là mâu thuẫn — nó vô hại; chỉ [0 … 0 | c ≠ 0] mới là mâu thuẫn.</li><li>Chọn biến pivot làm tham số. Tham số phải là biến <em>tự do</em>.</li><li>Quên phần nghiệm riêng (5, 0, 2, 0), chỉ viết tổ hợp các vectơ chỉ phương.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>RREF: pivot bằng 1, số 0 ở trên và dưới mỗi pivot; RREF là duy nhất.</li><li>Hạng = số pivot; số biến tự do = n − r.</li><li>Tập nghiệm = một nghiệm riêng + tổ hợp các vectơ chỉ phương.</li><li>Không có hàng xấu ⇒ có nghiệm; không có biến tự do ⇒ nghiệm duy nhất.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/parametric-form.html" target="_blank" rel="noopener">Interactive Linear Algebra — Dạng tham số</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-8-solving-ax-b-row-reduced-form-r/" target="_blank" rel="noopener">MIT 18.06 — Bài 8: Giải Ax = b, dạng rút gọn R</a></li><li><a href="https://en.wikipedia.org/wiki/Row_echelon_form" target="_blank" rel="noopener">Wikipedia — Row echelon form</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết mọi nghiệm của phương trình x + 2y − z = 1 trong R<sup>3</sup>.</li><li>Hệ có RREF [[1, 0, 2 | 3], [0, 1, −1 | 1], [0, 0, 0 | 4]] có nghiệm không?</li><li>Một hệ thuần nhất có 4 phương trình và 6 ẩn. Nó có thể có bao nhiêu nghiệm?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) y = s, z = t tự do: x = (1, 0, 0) + s(−2, 1, 0) + t(1, 0, 1). 2) Không: hàng cuối nói 0 = 4. 3) Vô số (ít nhất 6 − 4 = 2 biến tự do).</p></div>`);

const q2 = QZ(2, 'Quiz — Chapter 2: Linear systems & elimination|||Quiz — Chương 2: Hệ tuyến tính & phép khử', 'Kiểm tra chương 2: số nghiệm của hệ, phép biến đổi hàng, pivot và hệ số nhân, RREF, biến tự do, hệ thuần nhất.', [
  Q('q1', 'The system x + y = 2, 2x + 2y = 5 has|||Hệ x + y = 2, 2x + 2y = 5 có',
    ['exactly one solution|||đúng một nghiệm', 'no solution|||không có nghiệm', 'infinitely many solutions|||vô số nghiệm', 'exactly two solutions|||đúng hai nghiệm'], 1,
    'R2 − 2R1 gives 0 = 1: parallel lines.|||R2 − 2R1 cho 0 = 1: hai đường song song.'),
  Q('q2', 'The solution of x + 2y = 5, 3x − y = 1 is|||Nghiệm của x + 2y = 5, 3x − y = 1 là',
    ['(2, 1)|||(2, 1)', '(1, 2)|||(1, 2)', '(3, 1)|||(3, 1)', '(−1, 3)|||(−1, 3)'], 1,
    'y = 2 from −7y = −14, then x = 1.|||y = 2 từ −7y = −14, rồi x = 1.'),
  Q('q3', 'Eliminating [[2, 1], [4, 5]]: the multiplier and the second pivot are|||Khử [[2, 1], [4, 5]]: hệ số nhân và pivot thứ hai là',
    ['2 and 3|||2 và 3', '2 and 5|||2 và 5', '4 and 1|||4 và 1', '1/2 and 3|||1/2 và 3'], 0,
    'l = 4/2 = 2; 5 − 2·1 = 3.|||l = 4/2 = 2; 5 − 2·1 = 3.'),
  Q('q4', 'Which operation is NOT an allowed row operation?|||Phép nào KHÔNG phải phép biến đổi hàng hợp lệ?',
    ['swap two rows|||đổi chỗ hai hàng', 'add 3 × row 1 to row 2|||cộng 3 × hàng 1 vào hàng 2', 'multiply a row by 0|||nhân một hàng với 0', 'multiply a row by −5|||nhân một hàng với −5'], 2,
    'Scaling must use a non-zero constant.|||Co giãn phải dùng hằng số khác 0.'),
  Q('q5', 'RREF [[1, 0, 2 │ 3], [0, 1, −1 │ 1]] in unknowns x₁, x₂, x₃ has how many free variables?|||RREF [[1, 0, 2 │ 3], [0, 1, −1 │ 1]] với ẩn x₁, x₂, x₃ có bao nhiêu biến tự do?',
    ['0|||0', '1|||1', '2|||2', '3|||3'], 1,
    'Pivots in columns 1, 2; x₃ is free.|||Pivot ở cột 1, 2; x₃ tự do.'),
  Q('q6', 'An echelon form contains the row [0 0 0 │ 5]. The system|||Một dạng bậc thang chứa hàng [0 0 0 │ 5]. Hệ',
    ['has a unique solution|||có nghiệm duy nhất', 'has infinitely many solutions|||có vô số nghiệm', 'has no solution|||vô nghiệm', 'has x = 5|||có x = 5'], 2,
    'The row says 0 = 5.|||Hàng đó nói 0 = 5.'),
  Q('q7', 'A homogeneous system with 3 equations and 5 unknowns has|||Hệ thuần nhất 3 phương trình, 5 ẩn có',
    ['only x = 0|||chỉ nghiệm x = 0', 'no solution|||không có nghiệm', 'infinitely many solutions|||vô số nghiệm', 'exactly 2 solutions|||đúng 2 nghiệm'], 2,
    'At most 3 pivots, so at least 2 free variables.|||Tối đa 3 pivot, nên ít nhất 2 biến tự do.'),
  Q('q8', 'The rank of [[1, 2, 0, 3], [0, 0, 1, −1], [0, 0, 0, 0]] is|||Hạng của [[1, 2, 0, 3], [0, 0, 1, −1], [0, 0, 0, 0]] là',
    ['1|||1', '2|||2', '3|||3', '4|||4'], 1,
    'Two pivots.|||Hai pivot.'),
  Q('q9', 'Gaussian elimination on an n×n matrix costs about|||Khử Gauss trên ma trận n×n tốn khoảng',
    ['n operations|||n phép tính', 'n² operations|||n² phép tính', 'n³/3 operations|||n³/3 phép tính', '2ⁿ operations|||2ⁿ phép tính'], 2,
    'Back substitution is only about n²/2.|||Thế ngược chỉ khoảng n²/2.'),
]);

const ch2 = {
  title: 'Chapter 2 — Linear systems and Gaussian elimination|||Chương 2 — Hệ phương trình tuyến tính và khử Gauss',
  description: 'Hình ảnh hàng/cột, ma trận mở rộng, khử Gauss và thế ngược, RREF, biến tự do, tập nghiệm dạng tham số (Strang ch.2 · Lay ch.1 · MIT 18.06 bài 1–2, 7–8).',
  lessons: [c21, c22, c23, q2],
};


// ───────────────────────────── Chương 3 — Đại số ma trận ─────────────────────────────
const c31 = L('maa102-ts-3-1',
  '3.1 — Matrix multiplication, its four views, and the transpose|||3.1 — Nhân ma trận: bốn cách nhìn, và ma trận chuyển vị',
  'Quy tắc cỡ (m×n)(n×p), bốn cách nhìn tích AB (hàng·cột, theo cột, theo hàng, tổng cột×hàng), AB ≠ BA, tính chất kết hợp/phân phối, chuyển vị, (AB)ᵀ = BᵀAᵀ, ma trận đối xứng, nhân theo lô trong học sâu.',
  `<span class="eyebrow">MAA102 · Chapter 3 · Lesson 3.1</span>
<h2>Matrix multiplication, its four views, and the transpose</h2>
<p class="lead">Multiplying two matrices is not “multiply the entries”. AB means “first apply B, then apply A”, and it can be computed in four equivalent ways — each one useful somewhere.</p>
<h3>🎯 Objectives</h3>
<ul><li>Check when AB is defined and what size it has.</li><li>Compute AB by the row–column rule and interpret it by columns, by rows and as a sum of rank-one pieces.</li><li>Use the algebra rules — and remember that AB ≠ BA in general.</li><li>Compute transposes and use (AB)<sup>T</sup> = B<sup>T</sup>A<sup>T</sup>; recognise symmetric matrices.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Size rule</span>(m×n) · (n×p) = (m×p)    the inner sizes must match</div>
<p>The four views of the same product C = AB:</p>
<ol><li><strong>Row times column:</strong> c<sub>ij</sub> = (row i of A)·(column j of B).</li><li><strong>By columns:</strong> column j of AB = A·(column j of B). Each column of AB is a combination of the columns of A.</li><li><strong>By rows:</strong> row i of AB = (row i of A)·B. Each row of AB is a combination of the rows of B.</li><li><strong>Column times row:</strong> AB = Σ<sub>k</sub> (column k of A)(row k of B), a sum of n rank-one matrices. This view leads to the SVD in Chapter 10.</li></ol>
<p><strong>Rules that hold:</strong> (AB)C = A(BC) (associative), A(B + C) = AB + AC (distributive), c(AB) = (cA)B, IA = AI = A. <strong>Rules that fail:</strong> AB ≠ BA in general; AB = 0 does not imply A = 0 or B = 0; (A + B)<sup>2</sup> = A<sup>2</sup> + AB + BA + B<sup>2</sup>, not A<sup>2</sup> + 2AB + B<sup>2</sup>.</p>
<p>The <strong>transpose</strong> A<sup>T</sup> turns rows into columns: (A<sup>T</sup>)<sub>ij</sub> = a<sub>ji</sub>. Important facts:</p>
<div class="formula"><span class="lbl">Transpose rules</span>(A + B)<sup>T</sup> = A<sup>T</sup> + B<sup>T</sup>    (AB)<sup>T</sup> = B<sup>T</sup>A<sup>T</sup>    x·y = x<sup>T</sup>y</div>
<p>A matrix is <strong>symmetric</strong> if S<sup>T</sup> = S. For every matrix A, both A<sup>T</sup>A and AA<sup>T</sup> are symmetric, because (A<sup>T</sup>A)<sup>T</sup> = A<sup>T</sup>(A<sup>T</sup>)<sup>T</sup> = A<sup>T</sup>A. Covariance matrices in statistics have exactly this form.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>AB versus BA.</b></p>
<table class="matrix"><caption>A</caption><tbody><tr><td>1</td><td>2</td></tr><tr><td>3</td><td>4</td></tr></tbody></table>
<table class="matrix"><caption>B</caption><tbody><tr><td>0</td><td>1</td></tr><tr><td>1</td><td>0</td></tr></tbody></table>
<p>Row–column rule: c<sub>11</sub> = 1·0 + 2·1 = 2, c<sub>12</sub> = 1·1 + 2·0 = 1, c<sub>21</sub> = 3·0 + 4·1 = 4, c<sub>22</sub> = 3·1 + 4·0 = 3.</p>
<table class="matrix"><caption>AB</caption><tbody><tr><td>2</td><td>1</td></tr><tr><td>4</td><td>3</td></tr></tbody></table>
<table class="matrix"><caption>BA</caption><tbody><tr><td>3</td><td>4</td></tr><tr><td>1</td><td>2</td></tr></tbody></table>
<p>Multiplying by B on the <em>right</em> swapped the <b>columns</b> of A; multiplying on the <em>left</em> swapped the <b>rows</b>. Different results: AB ≠ BA.</p></div>
<p><strong>AI connection.</strong> A neural network processes a <em>batch</em> of inputs at once: stack 64 input vectors as the rows of X (64×784) and compute XW for a weight matrix W (784×128). One matrix–matrix product replaces 64 matrix–vector products and is what GPUs are built to do fast.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Multiplying entry by entry (that is the Hadamard product <code>A * B</code> in NumPy, not <code>A @ B</code>).</li><li>Writing (AB)<sup>T</sup> = A<sup>T</sup>B<sup>T</sup> — the order reverses.</li><li>“Cancelling”: from AB = AC you cannot conclude B = C unless A is invertible.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>(m×n)(n×p) = m×p; entry ij = row i · column j.</li><li>Columns of AB combine columns of A; rows of AB combine rows of B.</li><li>Associative and distributive, but not commutative.</li><li>(AB)<sup>T</sup> = B<sup>T</sup>A<sup>T</sup>; A<sup>T</sup>A is always symmetric.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/matrix-multiplication" target="_blank" rel="noopener">3Blue1Brown — Matrix multiplication as composition</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-3-multiplication-and-inverse-matrices/" target="_blank" rel="noopener">MIT 18.06 — Lecture 3: Multiplication and inverse matrices</a></li><li><a href="https://textbooks.math.gatech.edu/ila/matrix-multiplication.html" target="_blank" rel="noopener">Interactive Linear Algebra — Matrix Multiplication</a></li><li><a href="https://en.wikipedia.org/wiki/Transpose" target="_blank" rel="noopener">Wikipedia — Transpose</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Compute [[1, 0, 2], [−1, 3, 1]] · [[3, 1], [2, 1], [1, 0]].</li><li>A is 2×3 and B is 3×4. Which of AB, BA, A<sup>T</sup>A, AA<sup>T</sup> are defined, and what are their sizes?</li><li>Expand (A + B)<sup>2</sup>. When does it equal A<sup>2</sup> + 2AB + B<sup>2</sup>?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) [[5, 1], [4, 2]]. 2) AB is 2×4; BA is undefined (4 ≠ 2); A<sup>T</sup>A is 3×3; AA<sup>T</sup> is 2×2. 3) A<sup>2</sup> + AB + BA + B<sup>2</sup>; equal exactly when AB = BA.</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 3 · Bài 3.1</span>
<h2>Nhân ma trận: bốn cách nhìn, và ma trận chuyển vị</h2>
<p class="lead">Nhân hai ma trận không phải là “nhân từng phần tử”. AB nghĩa là “áp B trước, rồi áp A”, và có thể tính theo bốn cách tương đương — mỗi cách có chỗ dùng riêng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Kiểm tra khi nào AB xác định và có cỡ bao nhiêu.</li><li>Tính AB bằng quy tắc hàng–cột và hiểu nó theo cột, theo hàng, và như tổng các mảnh hạng một.</li><li>Dùng các quy tắc đại số — và nhớ rằng nói chung AB ≠ BA.</li><li>Tính chuyển vị, dùng (AB)<sup>T</sup> = B<sup>T</sup>A<sup>T</sup>; nhận biết ma trận đối xứng.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Quy tắc cỡ</span>(m×n) · (n×p) = (m×p)    hai cỡ ở giữa phải bằng nhau</div>
<p>Bốn cách nhìn cùng một tích C = AB:</p>
<ol><li><strong>Hàng nhân cột:</strong> c<sub>ij</sub> = (hàng i của A)·(cột j của B).</li><li><strong>Theo cột:</strong> cột j của AB = A·(cột j của B). Mỗi cột của AB là tổ hợp các cột của A.</li><li><strong>Theo hàng:</strong> hàng i của AB = (hàng i của A)·B. Mỗi hàng của AB là tổ hợp các hàng của B.</li><li><strong>Cột nhân hàng:</strong> AB = Σ<sub>k</sub> (cột k của A)(hàng k của B), tổng của n ma trận hạng một. Cách nhìn này dẫn tới SVD ở Chương 10.</li></ol>
<p><strong>Quy tắc đúng:</strong> (AB)C = A(BC) (kết hợp), A(B + C) = AB + AC (phân phối), c(AB) = (cA)B, IA = AI = A. <strong>Quy tắc sai:</strong> nói chung AB ≠ BA; AB = 0 không suy ra A = 0 hay B = 0; (A + B)<sup>2</sup> = A<sup>2</sup> + AB + BA + B<sup>2</sup>, không phải A<sup>2</sup> + 2AB + B<sup>2</sup>.</p>
<p><strong>Chuyển vị</strong> A<sup>T</sup> biến hàng thành cột: (A<sup>T</sup>)<sub>ij</sub> = a<sub>ji</sub>. Các sự kiện quan trọng:</p>
<div class="formula"><span class="lbl">Quy tắc chuyển vị</span>(A + B)<sup>T</sup> = A<sup>T</sup> + B<sup>T</sup>    (AB)<sup>T</sup> = B<sup>T</sup>A<sup>T</sup>    x·y = x<sup>T</sup>y</div>
<p>Ma trận <strong>đối xứng</strong> nếu S<sup>T</sup> = S. Với mọi ma trận A, cả A<sup>T</sup>A và AA<sup>T</sup> đều đối xứng, vì (A<sup>T</sup>A)<sup>T</sup> = A<sup>T</sup>(A<sup>T</sup>)<sup>T</sup> = A<sup>T</sup>A. Ma trận hiệp phương sai trong thống kê có đúng dạng này.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>AB so với BA.</b></p>
<table class="matrix"><caption>A</caption><tbody><tr><td>1</td><td>2</td></tr><tr><td>3</td><td>4</td></tr></tbody></table>
<table class="matrix"><caption>B</caption><tbody><tr><td>0</td><td>1</td></tr><tr><td>1</td><td>0</td></tr></tbody></table>
<p>Quy tắc hàng–cột: c<sub>11</sub> = 1·0 + 2·1 = 2, c<sub>12</sub> = 1·1 + 2·0 = 1, c<sub>21</sub> = 3·0 + 4·1 = 4, c<sub>22</sub> = 3·1 + 4·0 = 3.</p>
<table class="matrix"><caption>AB</caption><tbody><tr><td>2</td><td>1</td></tr><tr><td>4</td><td>3</td></tr></tbody></table>
<table class="matrix"><caption>BA</caption><tbody><tr><td>3</td><td>4</td></tr><tr><td>1</td><td>2</td></tr></tbody></table>
<p>Nhân B ở <em>bên phải</em> đã đổi chỗ các <b>cột</b> của A; nhân ở <em>bên trái</em> đổi chỗ các <b>hàng</b>. Kết quả khác nhau: AB ≠ BA.</p></div>
<p><strong>Liên hệ AI.</strong> Mạng nơ-ron xử lý cả một <em>lô</em> (batch) đầu vào cùng lúc: xếp 64 vectơ đầu vào thành các hàng của X (64×784) rồi tính XW với ma trận trọng số W (784×128). Một phép nhân ma trận–ma trận thay cho 64 phép nhân ma trận–vectơ, và GPU được thiết kế để làm đúng việc đó thật nhanh.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nhân từng phần tử (đó là tích Hadamard <code>A * B</code> trong NumPy, không phải <code>A @ B</code>).</li><li>Viết (AB)<sup>T</sup> = A<sup>T</sup>B<sup>T</sup> — thứ tự phải đảo.</li><li>“Giản ước”: từ AB = AC không suy ra B = C trừ khi A khả nghịch.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>(m×n)(n×p) = m×p; phần tử ij = hàng i · cột j.</li><li>Cột của AB tổ hợp các cột của A; hàng của AB tổ hợp các hàng của B.</li><li>Có tính kết hợp và phân phối, nhưng không giao hoán.</li><li>(AB)<sup>T</sup> = B<sup>T</sup>A<sup>T</sup>; A<sup>T</sup>A luôn đối xứng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/matrix-multiplication" target="_blank" rel="noopener">3Blue1Brown — Nhân ma trận là hợp các phép biến đổi</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-3-multiplication-and-inverse-matrices/" target="_blank" rel="noopener">MIT 18.06 — Bài 3: Phép nhân và ma trận nghịch đảo</a></li><li><a href="https://textbooks.math.gatech.edu/ila/matrix-multiplication.html" target="_blank" rel="noopener">Interactive Linear Algebra — Nhân ma trận</a></li><li><a href="https://en.wikipedia.org/wiki/Transpose" target="_blank" rel="noopener">Wikipedia — Transpose</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tính [[1, 0, 2], [−1, 3, 1]] · [[3, 1], [2, 1], [1, 0]].</li><li>A cỡ 2×3 và B cỡ 3×4. Trong AB, BA, A<sup>T</sup>A, AA<sup>T</sup>, cái nào xác định, cỡ bao nhiêu?</li><li>Khai triển (A + B)<sup>2</sup>. Khi nào nó bằng A<sup>2</sup> + 2AB + B<sup>2</sup>?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) [[5, 1], [4, 2]]. 2) AB cỡ 2×4; BA không xác định (4 ≠ 2); A<sup>T</sup>A cỡ 3×3; AA<sup>T</sup> cỡ 2×2. 3) A<sup>2</sup> + AB + BA + B<sup>2</sup>; bằng nhau đúng khi AB = BA.</p></div>`);

const c32 = L('maa102-ts-3-2',
  '3.2 — Inverse matrices and Gauss–Jordan elimination|||3.2 — Ma trận nghịch đảo và phép khử Gauss–Jordan',
  'Định nghĩa ma trận khả nghịch, công thức nghịch đảo 2×2, tìm A⁻¹ bằng Gauss–Jordan [A | I] → [I | A⁻¹], (AB)⁻¹ = B⁻¹A⁻¹, định lý ma trận khả nghịch, vì sao không dùng inv() để giải hệ.',
  `<span class="eyebrow">MAA102 · Chapter 3 · Lesson 3.2</span>
<h2>Inverse matrices and Gauss–Jordan elimination</h2>
<p class="lead">If A transforms x into b, the inverse matrix A<sup>−1</sup> transforms b back into x. Not every matrix can be undone — and knowing exactly which ones can is one of the central theorems of the course.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define the inverse and test invertibility.</li><li>Invert 2×2 matrices by formula and n×n matrices by Gauss–Jordan.</li><li>Use (AB)<sup>−1</sup> = B<sup>−1</sup>A<sup>−1</sup> and (A<sup>T</sup>)<sup>−1</sup> = (A<sup>−1</sup>)<sup>T</sup>.</li><li>State the equivalent conditions of the invertible matrix theorem.</li></ul>
<h3>📖 Lecture</h3>
<p>A square matrix A is <strong>invertible</strong> (non-singular) if there is a matrix A<sup>−1</sup> with A<sup>−1</sup>A = I and AA<sup>−1</sup> = I. Then Ax = b has the unique solution x = A<sup>−1</sup>b. For 2×2 matrices there is a formula:</p>
<div class="formula"><span class="lbl">2×2 inverse</span>A = [[a, b], [c, d]]  ⇒  A<sup>−1</sup> = (1/(ad − bc)) · [[d, −b], [−c, a]]   (needs ad − bc ≠ 0)</div>
<p><strong>Gauss–Jordan.</strong> For larger matrices, row-reduce the block matrix [A | I]. If A reduces to I, the right block has become A<sup>−1</sup>. If a zero row appears on the left, A is singular. This works because each row operation is multiplication by an invertible matrix (Lesson 3.3).</p>
<div class="formula"><span class="lbl">Rules</span>(AB)<sup>−1</sup> = B<sup>−1</sup>A<sup>−1</sup>    (A<sup>T</sup>)<sup>−1</sup> = (A<sup>−1</sup>)<sup>T</sup>    (cA)<sup>−1</sup> = (1/c)A<sup>−1</sup></div>
<p><strong>The invertible matrix theorem.</strong> For an n×n matrix A the following are all equivalent: A is invertible · A has n pivots · the RREF of A is I · Ax = 0 has only x = 0 · the columns of A are independent and span R<sup>n</sup> · Ax = b has exactly one solution for every b · det A ≠ 0 (Chapter 4) · 0 is not an eigenvalue (Chapter 8).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — 2×2.</b> A = [[2, 1], [5, 3]]: ad − bc = 6 − 5 = 1, so A<sup>−1</sup> = [[3, −1], [−5, 2]]. Check: [[2, 1], [5, 3]]·[[3, −1], [−5, 2]] = [[6 − 5, −2 + 2], [15 − 15, −5 + 6]] = I ✓.</p></div>
<div class="callout"><p><b>Example 2 — Gauss–Jordan on a 3×3.</b></p>
<table class="matrix"><caption>[A │ I]</caption><tbody><tr><td>2</td><td>1</td><td>0</td><td>│</td><td>1</td><td>0</td><td>0</td></tr><tr><td>1</td><td>2</td><td>1</td><td>│</td><td>0</td><td>1</td><td>0</td></tr><tr><td>0</td><td>1</td><td>2</td><td>│</td><td>0</td><td>0</td><td>1</td></tr></tbody></table>
<p>Down: R2 ← R2 − ½R1 = (0, 3/2, 1 | −1/2, 1, 0); R3 ← R3 − ⅔R2 = (0, 0, 4/3 | 1/3, −2/3, 1). Pivots 2, 3/2, 4/3 — all non-zero, so A is invertible.</p>
<p>Up: R2 ← R2 − ¾R3 = (0, 3/2, 0 | −3/4, 3/2, −3/4); R1 ← R1 − ⅔R2 = (2, 0, 0 | 3/2, −1, 1/2). Divide by the pivots:</p>
<table class="matrix"><caption>A<sup>−1</sup></caption><tbody><tr><td>3/4</td><td>−1/2</td><td>1/4</td></tr><tr><td>−1/2</td><td>1</td><td>−1/2</td></tr><tr><td>1/4</td><td>−1/2</td><td>3/4</td></tr></tbody></table>
<p>That is (1/4)·[[3, −2, 1], [−2, 4, −2], [1, −2, 3]]. Notice the product of the pivots 2 · 3/2 · 4/3 = 4 — that is det A (Chapter 4).</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>(AB)<sup>−1</sup> = A<sup>−1</sup>B<sup>−1</sup> — wrong order. Socks and shoes: undo the last step first.</li><li>Forgetting the factor 1/(ad − bc), or swapping the wrong entries in the 2×2 formula.</li><li>Computing <code>np.linalg.inv(A) @ b</code> to solve a system. It is slower and less accurate than <code>np.linalg.solve(A, b)</code>; in numerical work you almost never form an inverse.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>A<sup>−1</sup>A = AA<sup>−1</sup> = I; exists only for square matrices with n pivots.</li><li>2×2: swap a and d, negate b and c, divide by ad − bc.</li><li>Gauss–Jordan: [A | I] → [I | A<sup>−1</sup>].</li><li>(AB)<sup>−1</sup> = B<sup>−1</sup>A<sup>−1</sup>; many equivalent tests for invertibility.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/inverse-matrices" target="_blank" rel="noopener">3Blue1Brown — Inverse matrices, column space, and null space</a></li><li><a href="https://textbooks.math.gatech.edu/ila/matrix-inverses.html" target="_blank" rel="noopener">Interactive Linear Algebra — Matrix Inverses</a></li><li><a href="https://textbooks.math.gatech.edu/ila/invertible-matrix-thm.html" target="_blank" rel="noopener">Interactive Linear Algebra — The Invertible Matrix Theorem</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.inv.html" target="_blank" rel="noopener">NumPy — numpy.linalg.inv</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the inverse of [[4, 7], [2, 6]].</li><li>Is [[1, 2], [2, 4]] invertible? Give two reasons.</li><li>Use the inverse from Example 1 to solve 2x + y = 1, 5x + 3y = 2.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) ad − bc = 24 − 14 = 10 ⇒ (1/10)[[6, −7], [−2, 4]] = [[0.6, −0.7], [−0.2, 0.4]]. 2) No: ad − bc = 0, and column 2 = 2 × column 1 (only one pivot). 3) x = [[3, −1], [−5, 2]](1, 2) = (1, −1). Check: 2 − 1 = 1, 5 − 3 = 2 ✓.</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 3 · Bài 3.2</span>
<h2>Ma trận nghịch đảo và phép khử Gauss–Jordan</h2>
<p class="lead">Nếu A biến x thành b, ma trận nghịch đảo A<sup>−1</sup> biến b ngược về x. Không phải ma trận nào cũng “hoàn tác” được — và biết chính xác ma trận nào làm được là một định lý trung tâm của môn học.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa ma trận nghịch đảo và kiểm tra tính khả nghịch.</li><li>Nghịch đảo ma trận 2×2 bằng công thức và ma trận n×n bằng Gauss–Jordan.</li><li>Dùng (AB)<sup>−1</sup> = B<sup>−1</sup>A<sup>−1</sup> và (A<sup>T</sup>)<sup>−1</sup> = (A<sup>−1</sup>)<sup>T</sup>.</li><li>Phát biểu các điều kiện tương đương của định lý ma trận khả nghịch.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Ma trận vuông A <strong>khả nghịch</strong> (không suy biến) nếu có ma trận A<sup>−1</sup> với A<sup>−1</sup>A = I và AA<sup>−1</sup> = I. Khi đó Ax = b có nghiệm duy nhất x = A<sup>−1</sup>b. Với ma trận 2×2 có công thức:</p>
<div class="formula"><span class="lbl">Nghịch đảo 2×2</span>A = [[a, b], [c, d]]  ⇒  A<sup>−1</sup> = (1/(ad − bc)) · [[d, −b], [−c, a]]   (cần ad − bc ≠ 0)</div>
<p><strong>Gauss–Jordan.</strong> Với ma trận lớn hơn, rút gọn hàng ma trận khối [A | I]. Nếu A rút gọn được về I, khối bên phải đã thành A<sup>−1</sup>. Nếu bên trái xuất hiện hàng 0, A suy biến. Cách này đúng vì mỗi phép biến đổi hàng là nhân với một ma trận khả nghịch (Bài 3.3).</p>
<div class="formula"><span class="lbl">Quy tắc</span>(AB)<sup>−1</sup> = B<sup>−1</sup>A<sup>−1</sup>    (A<sup>T</sup>)<sup>−1</sup> = (A<sup>−1</sup>)<sup>T</sup>    (cA)<sup>−1</sup> = (1/c)A<sup>−1</sup></div>
<p><strong>Định lý ma trận khả nghịch.</strong> Với ma trận n×n A, các điều sau tương đương: A khả nghịch · A có n pivot · RREF của A là I · Ax = 0 chỉ có nghiệm x = 0 · các cột của A độc lập và sinh ra R<sup>n</sup> · Ax = b có đúng một nghiệm với mọi b · det A ≠ 0 (Chương 4) · 0 không phải trị riêng (Chương 8).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — 2×2.</b> A = [[2, 1], [5, 3]]: ad − bc = 6 − 5 = 1, nên A<sup>−1</sup> = [[3, −1], [−5, 2]]. Kiểm: [[2, 1], [5, 3]]·[[3, −1], [−5, 2]] = [[6 − 5, −2 + 2], [15 − 15, −5 + 6]] = I ✓.</p></div>
<div class="callout"><p><b>Ví dụ 2 — Gauss–Jordan cho ma trận 3×3.</b></p>
<table class="matrix"><caption>[A │ I]</caption><tbody><tr><td>2</td><td>1</td><td>0</td><td>│</td><td>1</td><td>0</td><td>0</td></tr><tr><td>1</td><td>2</td><td>1</td><td>│</td><td>0</td><td>1</td><td>0</td></tr><tr><td>0</td><td>1</td><td>2</td><td>│</td><td>0</td><td>0</td><td>1</td></tr></tbody></table>
<p>Đi xuống: R2 ← R2 − ½R1 = (0, 3/2, 1 | −1/2, 1, 0); R3 ← R3 − ⅔R2 = (0, 0, 4/3 | 1/3, −2/3, 1). Pivot 2, 3/2, 4/3 — đều khác 0, nên A khả nghịch.</p>
<p>Đi lên: R2 ← R2 − ¾R3 = (0, 3/2, 0 | −3/4, 3/2, −3/4); R1 ← R1 − ⅔R2 = (2, 0, 0 | 3/2, −1, 1/2). Chia cho các pivot:</p>
<table class="matrix"><caption>A<sup>−1</sup></caption><tbody><tr><td>3/4</td><td>−1/2</td><td>1/4</td></tr><tr><td>−1/2</td><td>1</td><td>−1/2</td></tr><tr><td>1/4</td><td>−1/2</td><td>3/4</td></tr></tbody></table>
<p>Tức là (1/4)·[[3, −2, 1], [−2, 4, −2], [1, −2, 3]]. Để ý tích các pivot 2 · 3/2 · 4/3 = 4 — đó chính là det A (Chương 4).</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>(AB)<sup>−1</sup> = A<sup>−1</sup>B<sup>−1</sup> — sai thứ tự. Như đi tất rồi đi giày: muốn tháo thì tháo giày trước.</li><li>Quên hệ số 1/(ad − bc), hoặc đổi nhầm phần tử trong công thức 2×2.</li><li>Tính <code>np.linalg.inv(A) @ b</code> để giải hệ. Cách đó chậm hơn và kém chính xác hơn <code>np.linalg.solve(A, b)</code>; trong tính toán số gần như không bao giờ lập ma trận nghịch đảo.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>A<sup>−1</sup>A = AA<sup>−1</sup> = I; chỉ tồn tại cho ma trận vuông có n pivot.</li><li>2×2: đổi chỗ a và d, đổi dấu b và c, chia cho ad − bc.</li><li>Gauss–Jordan: [A | I] → [I | A<sup>−1</sup>].</li><li>(AB)<sup>−1</sup> = B<sup>−1</sup>A<sup>−1</sup>; có nhiều phép thử tương đương cho tính khả nghịch.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/inverse-matrices" target="_blank" rel="noopener">3Blue1Brown — Ma trận nghịch đảo, không gian cột và không gian null</a></li><li><a href="https://textbooks.math.gatech.edu/ila/matrix-inverses.html" target="_blank" rel="noopener">Interactive Linear Algebra — Ma trận nghịch đảo</a></li><li><a href="https://textbooks.math.gatech.edu/ila/invertible-matrix-thm.html" target="_blank" rel="noopener">Interactive Linear Algebra — Định lý ma trận khả nghịch</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.inv.html" target="_blank" rel="noopener">NumPy — numpy.linalg.inv</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm nghịch đảo của [[4, 7], [2, 6]].</li><li>[[1, 2], [2, 4]] có khả nghịch không? Nêu hai lý do.</li><li>Dùng nghịch đảo ở Ví dụ 1 để giải 2x + y = 1, 5x + 3y = 2.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) ad − bc = 24 − 14 = 10 ⇒ (1/10)[[6, −7], [−2, 4]] = [[0,6; −0,7], [−0,2; 0,4]]. 2) Không: ad − bc = 0, và cột 2 = 2 × cột 1 (chỉ một pivot). 3) x = [[3, −1], [−5, 2]](1, 2) = (1, −1). Kiểm: 2 − 1 = 1, 5 − 3 = 2 ✓.</p></div>`);

const c33 = L('maa102-ts-3-3',
  '3.3 — Elementary matrices, A = LU and PA = LU|||3.3 — Ma trận sơ cấp, phân tích A = LU và PA = LU',
  'Mỗi phép biến đổi hàng là nhân với ma trận sơ cấp; khử Gauss chính là phân tích A = LU (L chứa hệ số nhân); giải Lc = b rồi Ux = c; ma trận hoán vị và PA = LU; code scipy.linalg.lu.',
  `<span class="eyebrow">MAA102 · Chapter 3 · Lesson 3.3</span>
<h2>Elementary matrices, A = LU and PA = LU</h2>
<p class="lead">Elimination is not just an algorithm — it is a <strong>factorization</strong>. Recording the multipliers in a lower-triangular L gives A = LU, the form in which every numerical library actually stores a solved system.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write a row operation as left-multiplication by an elementary matrix E.</li><li>Build L from the multipliers and U from the pivots so that A = LU.</li><li>Solve Ax = b with two triangular systems Lc = b, Ux = c.</li><li>Use permutation matrices and PA = LU when row exchanges are needed.</li></ul>
<h3>📖 Lecture</h3>
<p>An <strong>elementary matrix</strong> is the identity with one row operation applied. For 3×3, “subtract 2 × row 1 from row 2” is</p>
<table class="matrix"><caption>E<sub>21</sub></caption><tbody><tr><td>1</td><td>0</td><td>0</td></tr><tr><td>−2</td><td>1</td><td>0</td></tr><tr><td>0</td><td>0</td><td>1</td></tr></tbody></table>
<p>and E<sub>21</sub>A performs that operation on A. Its inverse simply <em>adds</em> 2 × row 1 back: the −2 becomes +2.</p>
<p>Forward elimination is E<sub>32</sub>E<sub>31</sub>E<sub>21</sub>A = U. Multiplying by the inverses in reverse order gives A = LU, where the inverses combine beautifully: <strong>L is lower triangular with 1s on the diagonal and the multipliers l<sub>ij</sub> in their natural positions.</strong></p>
<div class="formula"><span class="lbl">LU factorization (no row exchanges)</span>A = LU    L = lower triangular, diagonal 1s, entries l<sub>ij</sub>    U = upper triangular, pivots on the diagonal</div>
<p><strong>Solving with LU.</strong> Ax = b becomes L(Ux) = b: first solve <strong>Lc = b</strong> by forward substitution, then <strong>Ux = c</strong> by back substitution. Factoring costs ~n<sup>3</sup>/3 once; each new right-hand side costs only ~n<sup>2</sup>. That is why a simulation solving the same A with thousands of different b factors A once.</p>
<p><strong>Row exchanges.</strong> A <strong>permutation matrix</strong> P is the identity with its rows reordered; PA reorders the rows of A. P<sup>−1</sup> = P<sup>T</sup>. With row exchanges the factorization becomes <strong>PA = LU</strong>; every invertible matrix has one. Libraries always exchange rows to use the largest pivot available (partial pivoting), for numerical stability.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Factor and solve</b> with b = (5, −2, 9).</p>
<table class="matrix"><caption>A</caption><tbody><tr><td>2</td><td>1</td><td>1</td></tr><tr><td>4</td><td>−6</td><td>0</td></tr><tr><td>−2</td><td>7</td><td>2</td></tr></tbody></table>
<p>Step 1: l<sub>21</sub> = 4/2 = 2, l<sub>31</sub> = −2/2 = −1: rows become (0, −8, −2) and (0, 8, 3). Step 2: l<sub>32</sub> = 8/(−8) = −1: row 3 becomes (0, 0, 1).</p>
<table class="matrix"><caption>L</caption><tbody><tr><td>1</td><td>0</td><td>0</td></tr><tr><td>2</td><td>1</td><td>0</td></tr><tr><td>−1</td><td>−1</td><td>1</td></tr></tbody></table>
<table class="matrix"><caption>U</caption><tbody><tr><td>2</td><td>1</td><td>1</td></tr><tr><td>0</td><td>−8</td><td>−2</td></tr><tr><td>0</td><td>0</td><td>1</td></tr></tbody></table>
<p>Step 3: Lc = b: c<sub>1</sub> = 5, c<sub>2</sub> = −2 − 2·5 = −12, c<sub>3</sub> = 9 + 5 − 12 = 2. Step 4: Ux = c: x<sub>3</sub> = 2, −8x<sub>2</sub> − 4 = −12 ⇒ x<sub>2</sub> = 1, 2x<sub>1</sub> + 1 + 2 = 5 ⇒ x<sub>1</sub> = 1. So <b>x = (1, 1, 2)</b>.</p></div>
<p>SciPy uses partial pivoting, so it picks 4 (the largest entry of column 1) as the first pivot and returns a permutation — a different but equally valid factorization, in its convention A = PLU:</p>
<pre><code class="language-python">import numpy as np
from scipy.linalg import lu
A = np.array([[2, 1, 1],
              [4, -6, 0],
              [-2, 7, 2]], dtype=float)
P, L, U = lu(A)          # SciPy convention: A = P @ L @ U
print(P)
print(L)
print(U)
print(np.allclose(P @ L @ U, A))</code></pre>
<div class="out">[[0. 1. 0.]<br> [1. 0. 0.]<br> [0. 0. 1.]]<br>[[ 1.   0.   0. ]<br> [ 0.5  1.   0. ]<br> [-0.5  1.   1. ]]<br>[[ 4. -6.  0.]<br> [ 0.  4.  1.]<br> [ 0.  0.  1.]]<br>True</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Putting −l<sub>ij</sub> in L. L stores the multipliers with their own sign (the inverse operations add back).</li><li>Solving Ux = b directly, forgetting the forward step Lc = b.</li><li>Mixing conventions: textbooks write PA = LU; SciPy returns P with A = PLU (its P is the transpose of the textbook one).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Row operation = multiply on the left by an elementary matrix.</li><li>Elimination = factorization A = LU; L holds the multipliers, U the pivots.</li><li>Solve Lc = b, then Ux = c; factor once, reuse for many b.</li><li>With row exchanges: PA = LU, permutation matrices satisfy P<sup>−1</sup> = P<sup>T</sup>.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-4-factorization-into-a-lu/" target="_blank" rel="noopener">MIT 18.06 — Lecture 4: Factorization into A = LU</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-5-transposes-permutations-spaces-r-n/" target="_blank" rel="noopener">MIT 18.06 — Lecture 5: Transposes, permutations, spaces Rⁿ</a></li><li><a href="https://en.wikipedia.org/wiki/LU_decomposition" target="_blank" rel="noopener">Wikipedia — LU decomposition</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.linalg.lu.html" target="_blank" rel="noopener">SciPy — scipy.linalg.lu</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write the 2×2 elementary matrix that subtracts 3 × row 1 from row 2, and its inverse.</li><li>Factor A = [[2, 1], [6, 8]] as LU.</li><li>Let P swap rows 1 and 2 of a 3×3 matrix. What is P<sup>2</sup>? What is P<sup>−1</sup>?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) E = [[1, 0], [−3, 1]], E<sup>−1</sup> = [[1, 0], [3, 1]]. 2) l<sub>21</sub> = 3: L = [[1, 0], [3, 1]], U = [[2, 1], [0, 5]]. 3) Swapping twice restores the order: P<sup>2</sup> = I, so P<sup>−1</sup> = P (= P<sup>T</sup>).</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 3 · Bài 3.3</span>
<h2>Ma trận sơ cấp, phân tích A = LU và PA = LU</h2>
<p class="lead">Phép khử không chỉ là một thuật toán — nó là một <strong>phép phân tích</strong>. Ghi các hệ số nhân vào ma trận tam giác dưới L ta được A = LU, đúng dạng mà mọi thư viện tính toán số lưu một hệ đã giải.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết một phép biến đổi hàng thành phép nhân trái với ma trận sơ cấp E.</li><li>Dựng L từ các hệ số nhân và U từ các pivot sao cho A = LU.</li><li>Giải Ax = b bằng hai hệ tam giác Lc = b, Ux = c.</li><li>Dùng ma trận hoán vị và PA = LU khi cần đổi hàng.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Ma trận sơ cấp</strong> là ma trận đơn vị sau khi áp một phép biến đổi hàng. Với 3×3, “trừ 2 × hàng 1 khỏi hàng 2” là</p>
<table class="matrix"><caption>E<sub>21</sub></caption><tbody><tr><td>1</td><td>0</td><td>0</td></tr><tr><td>−2</td><td>1</td><td>0</td></tr><tr><td>0</td><td>0</td><td>1</td></tr></tbody></table>
<p>và E<sub>21</sub>A thực hiện phép biến đổi đó trên A. Nghịch đảo của nó chỉ việc <em>cộng</em> lại 2 × hàng 1: số −2 thành +2.</p>
<p>Khử xuôi là E<sub>32</sub>E<sub>31</sub>E<sub>21</sub>A = U. Nhân với các nghịch đảo theo thứ tự ngược lại được A = LU, và các nghịch đảo ghép lại rất đẹp: <strong>L là tam giác dưới, đường chéo toàn số 1, các hệ số nhân l<sub>ij</sub> nằm đúng vị trí tự nhiên của chúng.</strong></p>
<div class="formula"><span class="lbl">Phân tích LU (không đổi hàng)</span>A = LU    L = tam giác dưới, đường chéo 1, phần tử l<sub>ij</sub>    U = tam giác trên, pivot trên đường chéo</div>
<p><strong>Giải bằng LU.</strong> Ax = b thành L(Ux) = b: trước hết giải <strong>Lc = b</strong> bằng thế xuôi, rồi <strong>Ux = c</strong> bằng thế ngược. Phân tích tốn ~n<sup>3</sup>/3 một lần; mỗi vế phải mới chỉ tốn ~n<sup>2</sup>. Vì thế một chương trình mô phỏng giải cùng A với hàng nghìn b khác nhau sẽ phân tích A đúng một lần.</p>
<p><strong>Đổi hàng.</strong> <strong>Ma trận hoán vị</strong> P là ma trận đơn vị đã xếp lại các hàng; PA xếp lại các hàng của A. P<sup>−1</sup> = P<sup>T</sup>. Có đổi hàng thì phép phân tích thành <strong>PA = LU</strong>; mọi ma trận khả nghịch đều có dạng này. Thư viện luôn đổi hàng để dùng pivot lớn nhất có thể (chọn pivot từng phần) cho ổn định số.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Phân tích và giải</b> với b = (5, −2, 9).</p>
<table class="matrix"><caption>A</caption><tbody><tr><td>2</td><td>1</td><td>1</td></tr><tr><td>4</td><td>−6</td><td>0</td></tr><tr><td>−2</td><td>7</td><td>2</td></tr></tbody></table>
<p>Bước 1: l<sub>21</sub> = 4/2 = 2, l<sub>31</sub> = −2/2 = −1: các hàng thành (0, −8, −2) và (0, 8, 3). Bước 2: l<sub>32</sub> = 8/(−8) = −1: hàng 3 thành (0, 0, 1).</p>
<table class="matrix"><caption>L</caption><tbody><tr><td>1</td><td>0</td><td>0</td></tr><tr><td>2</td><td>1</td><td>0</td></tr><tr><td>−1</td><td>−1</td><td>1</td></tr></tbody></table>
<table class="matrix"><caption>U</caption><tbody><tr><td>2</td><td>1</td><td>1</td></tr><tr><td>0</td><td>−8</td><td>−2</td></tr><tr><td>0</td><td>0</td><td>1</td></tr></tbody></table>
<p>Bước 3: Lc = b: c<sub>1</sub> = 5, c<sub>2</sub> = −2 − 2·5 = −12, c<sub>3</sub> = 9 + 5 − 12 = 2. Bước 4: Ux = c: x<sub>3</sub> = 2, −8x<sub>2</sub> − 4 = −12 ⇒ x<sub>2</sub> = 1, 2x<sub>1</sub> + 1 + 2 = 5 ⇒ x<sub>1</sub> = 1. Vậy <b>x = (1, 1, 2)</b>.</p></div>
<p>SciPy chọn pivot từng phần, nên lấy 4 (phần tử lớn nhất cột 1) làm pivot đầu và trả về một hoán vị — một phép phân tích khác nhưng cũng đúng, theo quy ước A = PLU của nó:</p>
<pre><code class="language-python">import numpy as np
from scipy.linalg import lu
A = np.array([[2, 1, 1],
              [4, -6, 0],
              [-2, 7, 2]], dtype=float)
P, L, U = lu(A)          # SciPy convention: A = P @ L @ U
print(P)
print(L)
print(U)
print(np.allclose(P @ L @ U, A))</code></pre>
<div class="out">[[0. 1. 0.]<br> [1. 0. 0.]<br> [0. 0. 1.]]<br>[[ 1.   0.   0. ]<br> [ 0.5  1.   0. ]<br> [-0.5  1.   1. ]]<br>[[ 4. -6.  0.]<br> [ 0.  4.  1.]<br> [ 0.  0.  1.]]<br>True</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đặt −l<sub>ij</sub> vào L. L giữ hệ số nhân với đúng dấu của nó (phép nghịch đảo là cộng lại).</li><li>Giải thẳng Ux = b, quên bước xuôi Lc = b.</li><li>Lẫn quy ước: sách viết PA = LU; SciPy trả P với A = PLU (P của SciPy là chuyển vị của P trong sách).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Phép biến đổi hàng = nhân trái với một ma trận sơ cấp.</li><li>Phép khử = phân tích A = LU; L giữ hệ số nhân, U giữ pivot.</li><li>Giải Lc = b rồi Ux = c; phân tích một lần, dùng lại cho nhiều b.</li><li>Có đổi hàng: PA = LU; ma trận hoán vị thoả P<sup>−1</sup> = P<sup>T</sup>.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-4-factorization-into-a-lu/" target="_blank" rel="noopener">MIT 18.06 — Bài 4: Phân tích A = LU</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-5-transposes-permutations-spaces-r-n/" target="_blank" rel="noopener">MIT 18.06 — Bài 5: Chuyển vị, hoán vị, không gian Rⁿ</a></li><li><a href="https://en.wikipedia.org/wiki/LU_decomposition" target="_blank" rel="noopener">Wikipedia — LU decomposition</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.linalg.lu.html" target="_blank" rel="noopener">SciPy — scipy.linalg.lu</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết ma trận sơ cấp 2×2 trừ 3 × hàng 1 khỏi hàng 2, và nghịch đảo của nó.</li><li>Phân tích A = [[2, 1], [6, 8]] thành LU.</li><li>P đổi chỗ hàng 1 và 2 của ma trận 3×3. P<sup>2</sup> bằng gì? P<sup>−1</sup> bằng gì?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) E = [[1, 0], [−3, 1]], E<sup>−1</sup> = [[1, 0], [3, 1]]. 2) l<sub>21</sub> = 3: L = [[1, 0], [3, 1]], U = [[2, 1], [0, 5]]. 3) Đổi hai lần thì về như cũ: P<sup>2</sup> = I, nên P<sup>−1</sup> = P (= P<sup>T</sup>).</p></div>`);

const q3 = QZ(3, 'Quiz — Chapter 3: Matrix algebra, inverses, LU|||Quiz — Chương 3: Đại số ma trận, nghịch đảo, LU', 'Kiểm tra chương 3: nhân ma trận, cỡ, chuyển vị, nghịch đảo 2×2, (AB)⁻¹, ma trận khả nghịch, phân tích LU.', [
  Q('q1', '[[1, 2], [3, 4]] · [[0, 1], [1, 0]] =|||[[1, 2], [3, 4]] · [[0, 1], [1, 0]] =',
    ['[[3, 4], [1, 2]]|||[[3, 4], [1, 2]]', '[[2, 1], [4, 3]]|||[[2, 1], [4, 3]]', '[[0, 2], [3, 0]]|||[[0, 2], [3, 0]]', '[[1, 2], [3, 4]]|||[[1, 2], [3, 4]]'], 1,
    'Right-multiplying by this B swaps the columns.|||Nhân phải với B này đổi chỗ hai cột.'),
  Q('q2', 'A is 2×3 and B is 3×4. The size of AB is|||A cỡ 2×3, B cỡ 3×4. Cỡ của AB là',
    ['3×3|||3×3', '2×4|||2×4', '4×2|||4×2', 'undefined|||không xác định'], 1,
    '(2×3)(3×4) = 2×4.|||(2×3)(3×4) = 2×4.'),
  Q('q3', '(AB)ᵀ equals|||(AB)ᵀ bằng',
    ['AᵀBᵀ|||AᵀBᵀ', 'BᵀAᵀ|||BᵀAᵀ', 'BA|||BA', 'AB|||AB'], 1,
    'The order reverses.|||Thứ tự đảo ngược.'),
  Q('q4', 'The inverse of [[2, 1], [5, 3]] is|||Nghịch đảo của [[2, 1], [5, 3]] là',
    ['[[3, −1], [−5, 2]]|||[[3, −1], [−5, 2]]', '[[3, 1], [5, 2]]|||[[3, 1], [5, 2]]', '[[−3, 1], [5, −2]]|||[[−3, 1], [5, −2]]', '[[2, −5], [−1, 3]]|||[[2, −5], [−1, 3]]'], 0,
    'ad − bc = 1; swap a, d and negate b, c.|||ad − bc = 1; đổi a, d và đổi dấu b, c.'),
  Q('q5', '(AB)⁻¹ equals|||(AB)⁻¹ bằng',
    ['A⁻¹B⁻¹|||A⁻¹B⁻¹', 'B⁻¹A⁻¹|||B⁻¹A⁻¹', 'BA|||BA', '(BA)⁻¹|||(BA)⁻¹'], 1,
    'Undo the last operation (B was applied first, A last) in reverse order.|||Hoàn tác theo thứ tự ngược (B áp trước, A áp sau).'),
  Q('q6', 'Why is [[1, 2], [2, 4]] not invertible?|||Vì sao [[1, 2], [2, 4]] không khả nghịch?',
    ['it is symmetric|||vì nó đối xứng', 'its second column is twice the first|||cột hai gấp đôi cột một', 'it has no zero entries|||vì không có phần tử 0', 'it is 2×2|||vì nó cỡ 2×2'], 1,
    'Only one pivot; ad − bc = 4 − 4 = 0.|||Chỉ một pivot; ad − bc = 4 − 4 = 0.'),
  Q('q7', 'In A = LU (no row exchanges), the matrix L|||Trong A = LU (không đổi hàng), ma trận L',
    ['holds the pivots on its diagonal|||chứa pivot trên đường chéo', 'is lower triangular with 1s on the diagonal and the multipliers below|||tam giác dưới, đường chéo là 1, hệ số nhân ở dưới', 'is a permutation matrix|||là ma trận hoán vị', 'equals A⁻¹|||bằng A⁻¹'], 1,
    'U holds the pivots; L the multipliers.|||U giữ pivot; L giữ hệ số nhân.'),
  Q('q8', 'The main practical advantage of storing A = LU is|||Lợi ích thực tế chính của việc lưu A = LU là',
    ['it makes A symmetric|||làm A đối xứng', 'each new right-hand side b costs only about n² operations|||mỗi vế phải b mới chỉ tốn khoảng n² phép tính', 'it computes eigenvalues|||nó tính được trị riêng', 'it avoids all rounding errors|||tránh mọi sai số làm tròn'], 1,
    'Factor once (n³/3), then two triangular solves per b.|||Phân tích một lần (n³/3), rồi hai lần giải tam giác cho mỗi b.'),
  Q('q9', 'For every matrix A, the matrix AᵀA is|||Với mọi ma trận A, ma trận AᵀA',
    ['invertible|||khả nghịch', 'symmetric|||đối xứng', 'diagonal|||chéo', 'equal to AAᵀ|||bằng AAᵀ'], 1,
    '(AᵀA)ᵀ = AᵀA. It need not be invertible.|||(AᵀA)ᵀ = AᵀA. Nó không nhất thiết khả nghịch.'),
]);

const ch3 = {
  title: 'Chapter 3 — Matrix algebra, inverses and LU factorization|||Chương 3 — Đại số ma trận, nghịch đảo và phân tích LU',
  description: 'Bốn cách nhìn phép nhân ma trận, chuyển vị và ma trận đối xứng, nghịch đảo và Gauss–Jordan, định lý ma trận khả nghịch, ma trận sơ cấp, A = LU và PA = LU (Strang 2.4–2.7 · MIT 18.06 bài 3–5).',
  lessons: [c31, c32, c33, q3],
};


// ───────────────────────────── Chương 4 — Định thức ─────────────────────────────
const c41 = L('maa102-ts-4-1',
  '4.1 — Determinants: definition, cofactor expansion, area and volume|||4.1 — Định thức: định nghĩa, khai triển phần bù đại số, diện tích và thể tích',
  'Định thức 2×2 và 3×3, khai triển theo hàng/cột bằng phần bù đại số (cofactor), định thức ma trận tam giác, ý nghĩa hình học: hệ số co giãn diện tích/thể tích có dấu (hướng).',
  `<span class="eyebrow">MAA102 · Chapter 4 · Lesson 4.1</span>
<h2>Determinants: definition, cofactor expansion, area and volume</h2>
<p class="lead">The determinant compresses a square matrix into one number that answers two questions at once: <em>is A invertible?</em> (det A ≠ 0) and <em>by how much does A scale area or volume?</em> (|det A|).</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute 2×2 and 3×3 determinants.</li><li>Expand a determinant along any row or column using cofactors.</li><li>Read off the determinant of a triangular matrix.</li><li>Interpret det A as a signed area/volume scaling factor.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">2×2 determinant</span>det [[a, b], [c, d]] = ad − bc</div>
<p>For larger matrices, delete row i and column j of A to get the (n−1)×(n−1) <strong>minor</strong> M<sub>ij</sub>. The <strong>cofactor</strong> is C<sub>ij</sub> = (−1)<sup>i+j</sup> det M<sub>ij</sub>; the signs follow a checkerboard + − + / − + − / + − +. Then for <em>any</em> row i (or any column):</p>
<div class="formula"><span class="lbl">Cofactor (Laplace) expansion</span>det A = a<sub>i1</sub>C<sub>i1</sub> + a<sub>i2</sub>C<sub>i2</sub> + … + a<sub>in</sub>C<sub>in</sub></div>
<p>Choose the row or column with the most zeros. For a <strong>triangular</strong> matrix, repeatedly expanding along the first column gives the product of the diagonal entries.</p>
<p><strong>Geometric meaning.</strong> The columns of a 2×2 matrix span a parallelogram whose area is |det A|; the columns of a 3×3 matrix span a parallelepiped whose volume is |det A|. More generally, the linear map x ↦ Ax multiplies every area (volume) by |det A|. The <strong>sign</strong> records orientation: det A &lt; 0 means A flips the plane like a mirror. det A = 0 means the shape is squashed flat — the columns are dependent and A is not invertible.</p>
<div class="note-ct"><p>Cofactor expansion of an n×n matrix needs about n! multiplications — 20! ≈ 2.4·10<sup>18</sup>. It is a tool for small matrices and for theory. Computers use elimination (Lesson 4.2).</p></div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — 3×3 by cofactors.</b></p>
<table class="matrix"><caption>A</caption><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>0</td><td>4</td><td>5</td></tr><tr><td>1</td><td>0</td><td>6</td></tr></tbody></table>
<p>Expand along column 1 (it has a zero): det A = 1·det[[4, 5], [0, 6]] − 0·(…) + 1·det[[2, 3], [4, 5]] = 1·24 + 1·(10 − 12) = <b>22</b>.</p>
<p>Check along row 1: 1·(24 − 0) − 2·(0 − 5) + 3·(0 − 4) = 24 + 10 − 12 = 22 ✓.</p></div>
<div class="callout"><p><b>Example 2 — area.</b> The vectors (3, 1) and (1, 2) span a parallelogram of area |det [[3, 1], [1, 2]]| = |6 − 1| = <b>5</b>. Swapping the two columns gives det = −5: same area, opposite orientation.</p></div>
<div class="callout"><p><b>Example 3 — triangular.</b> det [[2, 7, 1], [0, 3, 5], [0, 0, −1]] = 2 · 3 · (−1) = <b>−6</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the checkerboard signs (the cofactor of a<sub>12</sub> carries a minus).</li><li>Applying the 3×3 “diagonal rule” (Sarrus) to 4×4 matrices — it only works for 3×3.</li><li>Thinking det(A + B) = det A + det B. It is false in general.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>2×2: ad − bc. Larger: expand along any row/column with cofactors (−1)<sup>i+j</sup>M<sub>ij</sub>.</li><li>Triangular: product of the diagonal.</li><li>|det A| = area/volume scaling; sign = orientation.</li><li>det A = 0 ⇔ A is singular.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/determinant" target="_blank" rel="noopener">3Blue1Brown — The determinant</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-19-determinant-formulas-and-cofactors/" target="_blank" rel="noopener">MIT 18.06 — Lecture 19: Determinant formulas and cofactors</a></li><li><a href="https://textbooks.math.gatech.edu/ila/determinants-cofactors.html" target="_blank" rel="noopener">Interactive Linear Algebra — Cofactor Expansions</a></li><li><a href="https://textbooks.math.gatech.edu/ila/determinants-volumes.html" target="_blank" rel="noopener">Interactive Linear Algebra — Determinants and Volumes</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Compute det [[2, −1], [3, 4]].</li><li>Compute det [[1, 0, 2], [3, 1, 0], [0, 2, 1]] by cofactors.</li><li>Find the area of the parallelogram spanned by (4, 1) and (1, 3).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 8 − (−3) = 11. 2) Row 1: 1·(1·1 − 0·2) − 0 + 2·(3·2 − 1·0) = 1 + 12 = 13. 3) |4·3 − 1·1| = 11.</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 4 · Bài 4.1</span>
<h2>Định thức: định nghĩa, khai triển phần bù đại số, diện tích và thể tích</h2>
<p class="lead">Định thức nén một ma trận vuông thành một con số trả lời hai câu hỏi cùng lúc: <em>A có khả nghịch không?</em> (det A ≠ 0) và <em>A co giãn diện tích, thể tích bao nhiêu lần?</em> (|det A|).</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính định thức 2×2 và 3×3.</li><li>Khai triển định thức theo một hàng hoặc cột bất kỳ bằng phần bù đại số.</li><li>Đọc ngay định thức của ma trận tam giác.</li><li>Hiểu det A là hệ số co giãn diện tích/thể tích có dấu.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Định thức 2×2</span>det [[a, b], [c, d]] = ad − bc</div>
<p>Với ma trận lớn hơn, xoá hàng i và cột j của A được <strong>định thức con</strong> M<sub>ij</sub> cỡ (n−1)×(n−1). <strong>Phần bù đại số</strong> là C<sub>ij</sub> = (−1)<sup>i+j</sup> det M<sub>ij</sub>; dấu theo hình bàn cờ + − + / − + − / + − +. Khi đó với <em>mọi</em> hàng i (hoặc mọi cột):</p>
<div class="formula"><span class="lbl">Khai triển Laplace</span>det A = a<sub>i1</sub>C<sub>i1</sub> + a<sub>i2</sub>C<sub>i2</sub> + … + a<sub>in</sub>C<sub>in</sub></div>
<p>Hãy chọn hàng hoặc cột có nhiều số 0 nhất. Với ma trận <strong>tam giác</strong>, khai triển liên tiếp theo cột đầu cho tích các phần tử trên đường chéo.</p>
<p><strong>Ý nghĩa hình học.</strong> Các cột của ma trận 2×2 dựng một hình bình hành có diện tích |det A|; các cột của ma trận 3×3 dựng một hình hộp có thể tích |det A|. Tổng quát hơn, ánh xạ x ↦ Ax nhân mọi diện tích (thể tích) với |det A|. <strong>Dấu</strong> ghi lại hướng: det A &lt; 0 nghĩa là A lật mặt phẳng như tấm gương. det A = 0 nghĩa là hình bị ép dẹt — các cột phụ thuộc và A không khả nghịch.</p>
<div class="note-ct"><p>Khai triển phần bù đại số cho ma trận n×n tốn khoảng n! phép nhân — 20! ≈ 2,4·10<sup>18</sup>. Nó là công cụ cho ma trận nhỏ và cho lý thuyết. Máy tính dùng phép khử (Bài 4.2).</p></div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — 3×3 bằng phần bù đại số.</b></p>
<table class="matrix"><caption>A</caption><tbody><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>0</td><td>4</td><td>5</td></tr><tr><td>1</td><td>0</td><td>6</td></tr></tbody></table>
<p>Khai triển theo cột 1 (có số 0): det A = 1·det[[4, 5], [0, 6]] − 0·(…) + 1·det[[2, 3], [4, 5]] = 1·24 + 1·(10 − 12) = <b>22</b>.</p>
<p>Kiểm theo hàng 1: 1·(24 − 0) − 2·(0 − 5) + 3·(0 − 4) = 24 + 10 − 12 = 22 ✓.</p></div>
<div class="callout"><p><b>Ví dụ 2 — diện tích.</b> Hai vectơ (3, 1) và (1, 2) dựng hình bình hành có diện tích |det [[3, 1], [1, 2]]| = |6 − 1| = <b>5</b>. Đổi chỗ hai cột được det = −5: cùng diện tích, ngược hướng.</p></div>
<div class="callout"><p><b>Ví dụ 3 — tam giác.</b> det [[2, 7, 1], [0, 3, 5], [0, 0, −1]] = 2 · 3 · (−1) = <b>−6</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên dấu bàn cờ (phần bù đại số của a<sub>12</sub> mang dấu trừ).</li><li>Dùng “quy tắc đường chéo” (Sarrus) cho ma trận 4×4 — nó chỉ đúng với 3×3.</li><li>Nghĩ det(A + B) = det A + det B. Nói chung là sai.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>2×2: ad − bc. Lớn hơn: khai triển theo hàng/cột bất kỳ với phần bù (−1)<sup>i+j</sup>M<sub>ij</sub>.</li><li>Tam giác: tích đường chéo.</li><li>|det A| = hệ số co giãn diện tích/thể tích; dấu = hướng.</li><li>det A = 0 ⇔ A suy biến.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/determinant" target="_blank" rel="noopener">3Blue1Brown — Định thức</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-19-determinant-formulas-and-cofactors/" target="_blank" rel="noopener">MIT 18.06 — Bài 19: Công thức định thức và phần bù đại số</a></li><li><a href="https://textbooks.math.gatech.edu/ila/determinants-cofactors.html" target="_blank" rel="noopener">Interactive Linear Algebra — Khai triển phần bù đại số</a></li><li><a href="https://textbooks.math.gatech.edu/ila/determinants-volumes.html" target="_blank" rel="noopener">Interactive Linear Algebra — Định thức và thể tích</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tính det [[2, −1], [3, 4]].</li><li>Tính det [[1, 0, 2], [3, 1, 0], [0, 2, 1]] bằng phần bù đại số.</li><li>Tìm diện tích hình bình hành dựng trên (4, 1) và (1, 3).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 8 − (−3) = 11. 2) Theo hàng 1: 1·(1·1 − 0·2) − 0 + 2·(3·2 − 1·0) = 1 + 12 = 13. 3) |4·3 − 1·1| = 11.</p></div>`);

const c42 = L('maa102-ts-4-2',
  '4.2 — Properties of determinants and computing them by elimination|||4.2 — Tính chất của định thức và tính định thức bằng phép khử',
  'Ảnh hưởng của ba phép biến đổi hàng lên định thức, det = ± tích các pivot, det(AB) = det A·det B, det Aᵀ = det A, det A⁻¹ = 1/det A, det(cA) = cⁿ det A — có code NumPy và sai số dấu phẩy động.',
  `<span class="eyebrow">MAA102 · Chapter 4 · Lesson 4.2</span>
<h2>Properties of determinants and computing them by elimination</h2>
<p class="lead">Three simple rules about row operations determine everything else about determinants — and they give a fast way to compute them: eliminate, then multiply the pivots.</p>
<h3>🎯 Objectives</h3>
<ul><li>Know how each row operation changes the determinant.</li><li>Compute det A as ± the product of the pivots.</li><li>Use det(AB) = det A · det B, det A<sup>T</sup> = det A, det A<sup>−1</sup> = 1/det A and det(cA) = c<sup>n</sup> det A.</li><li>Understand why NumPy prints 0.9999999999999998 instead of 1.</li></ul>
<h3>📖 Lecture</h3>
<p>The determinant is the unique function of square matrices with det I = 1 that changes sign when two rows are swapped and is linear in each row separately. From these properties:</p>
<div class="formula"><span class="lbl">Row operations and det</span>replacement (row i − l·row j): det unchanged    swap two rows: det × (−1)    multiply a row by c: det × c</div>
<p>Consequences: a matrix with two equal rows, or a zero row, has det = 0. If elimination with k row swaps produces U with pivots d<sub>1</sub>, …, d<sub>n</sub>, then</p>
<div class="formula"><span class="lbl">Determinant by elimination</span>det A = (−1)<sup>k</sup> · d<sub>1</sub> d<sub>2</sub> ⋯ d<sub>n</sub></div>
<p>This costs about n<sup>3</sup>/3 operations, the same as solving a system. Two deeper rules:</p>
<div class="formula"><span class="lbl">Product and transpose rules</span>det(AB) = det A · det B    det A<sup>T</sup> = det A</div>
<p>Because det A<sup>T</sup> = det A, everything said about rows also holds for columns. From the product rule: det(A<sup>−1</sup>) = 1/det A (since det A · det A<sup>−1</sup> = det I = 1), and det(cA) = c<sup>n</sup> det A for an n×n matrix (every one of the n rows is multiplied by c). Geometrically, the product rule says that scaling factors multiply when maps are composed.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Determinant by elimination.</b></p>
<table class="matrix"><caption>A</caption><tbody><tr><td>1</td><td>2</td><td>1</td></tr><tr><td>2</td><td>5</td><td>4</td></tr><tr><td>−1</td><td>1</td><td>6</td></tr></tbody></table>
<p>Step 1: R2 − 2R1 = (0, 1, 2); R3 + R1 = (0, 3, 7) — replacements, det unchanged. Step 2: R3 − 3R2 = (0, 0, 1). Step 3: U has pivots 1, 1, 1 and no swaps were made, so <b>det A = 1</b>.</p></div>
<pre><code class="language-python">import numpy as np
A = np.array([[1, 2, 1],
              [2, 5, 4],
              [-1, 1, 6]], dtype=float)
B = np.array([[2, 0, 1],
              [1, 3, 0],
              [0, 1, 1]], dtype=float)
print(np.linalg.det(A))
print(np.linalg.det(B))
print(np.linalg.det(A @ B), np.linalg.det(A) * np.linalg.det(B))
print(np.linalg.det(2 * A))     # 2**3 * det(A)</code></pre>
<div class="out">0.9999999999999998<br>6.999999999999999<br>6.999999999999992 6.999999999999997<br>7.999999999999995</div>
<p>The exact values are 1, 7, 7 and 8. NumPy computes det from an LU factorization in floating-point arithmetic, so the last digits carry rounding error. Never test <code>det(A) == 0</code> to decide singularity; use <code>np.linalg.matrix_rank</code> or the condition number instead.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing det(2A) = 2 det A. For a 3×3 matrix it is 8 det A.</li><li>Scaling a row to make a pivot 1 and forgetting to divide the determinant by that factor.</li><li>Forgetting the sign change for each row swap.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Replacement keeps det; swap flips the sign; scaling a row scales det.</li><li>det A = ± product of pivots — the efficient method.</li><li>det(AB) = det A det B; det A<sup>T</sup> = det A; det A<sup>−1</sup> = 1/det A; det(cA) = c<sup>n</sup>det A.</li><li>Floating-point det is approximate; do not compare it with 0 exactly.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-18-properties-of-determinants/" target="_blank" rel="noopener">MIT 18.06 — Lecture 18: Properties of determinants</a></li><li><a href="https://textbooks.math.gatech.edu/ila/determinants-definitions-properties.html" target="_blank" rel="noopener">Interactive Linear Algebra — Determinants: Definition</a></li><li><a href="https://en.wikipedia.org/wiki/Determinant" target="_blank" rel="noopener">Wikipedia — Determinant</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.det.html" target="_blank" rel="noopener">NumPy — numpy.linalg.det</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A is 3×3 with det A = 3. Find det(2A), det(A<sup>−1</sup>), det(A<sup>T</sup>A).</li><li>Compute det [[0, 1, 2], [1, 0, 3], [4, −3, 8]] by elimination.</li><li>Rows 1 and 3 of a 4×4 matrix with det 5 are swapped, then row 2 is multiplied by −2. New determinant?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 2<sup>3</sup>·3 = 24; 1/3; 3·3 = 9. 2) Swap R1, R2 (sign −): [[1, 0, 3], [0, 1, 2], [4, −3, 8]]; R3 − 4R1 = (0, −3, −4); R3 + 3R2 = (0, 0, 2). Pivots 1, 1, 2 ⇒ det = −2. 3) 5 · (−1) · (−2) = 10.</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 4 · Bài 4.2</span>
<h2>Tính chất của định thức và tính định thức bằng phép khử</h2>
<p class="lead">Ba quy tắc đơn giản về phép biến đổi hàng quyết định mọi điều khác về định thức — và cho ta cách tính nhanh: khử, rồi nhân các pivot.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Biết mỗi phép biến đổi hàng làm định thức thay đổi thế nào.</li><li>Tính det A bằng ± tích các pivot.</li><li>Dùng det(AB) = det A · det B, det A<sup>T</sup> = det A, det A<sup>−1</sup> = 1/det A và det(cA) = c<sup>n</sup> det A.</li><li>Hiểu vì sao NumPy in 0.9999999999999998 thay vì 1.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Định thức là hàm duy nhất trên ma trận vuông thoả det I = 1, đổi dấu khi đổi chỗ hai hàng, và tuyến tính theo từng hàng. Từ các tính chất đó:</p>
<div class="formula"><span class="lbl">Phép biến đổi hàng và det</span>thay thế (hàng i − l·hàng j): det không đổi    đổi chỗ hai hàng: det × (−1)    nhân một hàng với c: det × c</div>
<p>Hệ quả: ma trận có hai hàng bằng nhau, hoặc có hàng 0, thì det = 0. Nếu phép khử với k lần đổi hàng cho U có các pivot d<sub>1</sub>, …, d<sub>n</sub> thì</p>
<div class="formula"><span class="lbl">Định thức bằng phép khử</span>det A = (−1)<sup>k</sup> · d<sub>1</sub> d<sub>2</sub> ⋯ d<sub>n</sub></div>
<p>Cách này tốn khoảng n<sup>3</sup>/3 phép tính, bằng với giải một hệ. Hai quy tắc sâu hơn:</p>
<div class="formula"><span class="lbl">Quy tắc tích và chuyển vị</span>det(AB) = det A · det B    det A<sup>T</sup> = det A</div>
<p>Vì det A<sup>T</sup> = det A, mọi điều nói về hàng cũng đúng với cột. Từ quy tắc tích: det(A<sup>−1</sup>) = 1/det A (vì det A · det A<sup>−1</sup> = det I = 1), và det(cA) = c<sup>n</sup> det A với ma trận n×n (cả n hàng đều bị nhân với c). Về hình học, quy tắc tích nói rằng các hệ số co giãn nhân với nhau khi hợp các ánh xạ.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Định thức bằng phép khử.</b></p>
<table class="matrix"><caption>A</caption><tbody><tr><td>1</td><td>2</td><td>1</td></tr><tr><td>2</td><td>5</td><td>4</td></tr><tr><td>−1</td><td>1</td><td>6</td></tr></tbody></table>
<p>Bước 1: R2 − 2R1 = (0, 1, 2); R3 + R1 = (0, 3, 7) — phép thay thế, det không đổi. Bước 2: R3 − 3R2 = (0, 0, 1). Bước 3: U có pivot 1, 1, 1 và không đổi hàng lần nào, nên <b>det A = 1</b>.</p></div>
<pre><code class="language-python">import numpy as np
A = np.array([[1, 2, 1],
              [2, 5, 4],
              [-1, 1, 6]], dtype=float)
B = np.array([[2, 0, 1],
              [1, 3, 0],
              [0, 1, 1]], dtype=float)
print(np.linalg.det(A))
print(np.linalg.det(B))
print(np.linalg.det(A @ B), np.linalg.det(A) * np.linalg.det(B))
print(np.linalg.det(2 * A))     # 2**3 * det(A)</code></pre>
<div class="out">0.9999999999999998<br>6.999999999999999<br>6.999999999999992 6.999999999999997<br>7.999999999999995</div>
<p>Giá trị chính xác là 1, 7, 7 và 8. NumPy tính det từ phân tích LU bằng số thực dấu phẩy động, nên mấy chữ số cuối mang sai số làm tròn. Đừng bao giờ kiểm <code>det(A) == 0</code> để kết luận suy biến; hãy dùng <code>np.linalg.matrix_rank</code> hoặc số điều kiện.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết det(2A) = 2 det A. Với ma trận 3×3 phải là 8 det A.</li><li>Chia một hàng để pivot thành 1 rồi quên chia định thức cho đúng hệ số đó.</li><li>Quên đổi dấu cho mỗi lần đổi hàng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Thay thế giữ nguyên det; đổi chỗ đổi dấu; nhân một hàng thì nhân det.</li><li>det A = ± tích các pivot — cách tính hiệu quả.</li><li>det(AB) = det A det B; det A<sup>T</sup> = det A; det A<sup>−1</sup> = 1/det A; det(cA) = c<sup>n</sup>det A.</li><li>det tính bằng số thực là xấp xỉ; đừng so đúng bằng 0.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-18-properties-of-determinants/" target="_blank" rel="noopener">MIT 18.06 — Bài 18: Tính chất của định thức</a></li><li><a href="https://textbooks.math.gatech.edu/ila/determinants-definitions-properties.html" target="_blank" rel="noopener">Interactive Linear Algebra — Định thức: định nghĩa</a></li><li><a href="https://en.wikipedia.org/wiki/Determinant" target="_blank" rel="noopener">Wikipedia — Determinant</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.det.html" target="_blank" rel="noopener">NumPy — numpy.linalg.det</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>A cỡ 3×3 với det A = 3. Tìm det(2A), det(A<sup>−1</sup>), det(A<sup>T</sup>A).</li><li>Tính det [[0, 1, 2], [1, 0, 3], [4, −3, 8]] bằng phép khử.</li><li>Ma trận 4×4 có det 5; đổi chỗ hàng 1 và 3, rồi nhân hàng 2 với −2. Định thức mới?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 2<sup>3</sup>·3 = 24; 1/3; 3·3 = 9. 2) Đổi R1, R2 (dấu −): [[1, 0, 3], [0, 1, 2], [4, −3, 8]]; R3 − 4R1 = (0, −3, −4); R3 + 3R2 = (0, 0, 2). Pivot 1, 1, 2 ⇒ det = −2. 3) 5 · (−1) · (−2) = 10.</p></div>`);

const c43 = L('maa102-ts-4-3',
  "4.3 — Cramer's rule, the adjugate inverse, and the Jacobian|||4.3 — Quy tắc Cramer, nghịch đảo qua ma trận phụ hợp, và Jacobian",
  'Quy tắc Cramer cho hệ n×n, công thức A⁻¹ = adj(A)/det A, diện tích tam giác và thể tích hình hộp bằng định thức, định thức Jacobian khi đổi biến và trong normalizing flows.',
  `<span class="eyebrow">MAA102 · Chapter 4 · Lesson 4.3</span>
<h2>Cramer's rule, the adjugate inverse, and the Jacobian</h2>
<p class="lead">Determinants give explicit <em>formulas</em> for the solution of Ax = b and for A<sup>−1</sup>. They are too slow for big computations, but they are exactly what you need for 2×2 and 3×3 problems, for proofs — and for measuring how a map distorts volume.</p>
<h3>🎯 Objectives</h3>
<ul><li>Solve small systems with Cramer's rule.</li><li>Compute A<sup>−1</sup> with the adjugate (cofactor) formula.</li><li>Compute areas of triangles and volumes of parallelepipeds.</li><li>Explain the Jacobian determinant in change of variables and in AI models.</li></ul>
<h3>📖 Lecture</h3>
<p>Let A be invertible and let A<sub>j</sub> be A with column j replaced by b. Then</p>
<div class="formula"><span class="lbl">Cramer's rule</span>x<sub>j</sub> = det A<sub>j</sub> / det A,   j = 1, …, n</div>
<p>Applying Cramer's rule to the columns of I gives the inverse. Build the cofactor matrix C (entries C<sub>ij</sub> from Lesson 4.1); its transpose is the <strong>adjugate</strong> adj A = C<sup>T</sup>:</p>
<div class="formula"><span class="lbl">Adjugate formula</span>A<sup>−1</sup> = adj(A) / det A = C<sup>T</sup> / det A</div>
<p>For a 2×2 matrix this is exactly the swap-and-negate formula of Lesson 3.2. Both formulas need n + 1 determinants (or n<sup>2</sup> cofactors), so for large n elimination is far cheaper.</p>
<p><strong>Areas and volumes.</strong> The triangle with vertices 0, u, v in the plane has area ½|det[u v]|. For vertices P, Q, R, use u = Q − P, v = R − P. The parallelepiped spanned by three vectors in R<sup>3</sup> has volume |det[u v w]|.</p>
<p><strong>The Jacobian.</strong> A non-linear map behaves like a linear map near each point; its matrix of partial derivatives is the Jacobian J, and |det J| is the local area/volume scaling. That is why polar coordinates give dx dy = r dr dθ (det J = r). In machine learning, <em>normalizing flows</em> transform a simple probability distribution with invertible maps and must add log|det J| to the log-likelihood — they are designed so that J is triangular and the determinant is just a product of diagonal entries.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — Cramer.</b> 2x + y = 5, x + 3y = 10. det A = 2·3 − 1·1 = 5.</p>
<p>x = det[[5, 1], [10, 3]] / 5 = (15 − 10)/5 = <b>1</b>; y = det[[2, 5], [1, 10]] / 5 = (20 − 5)/5 = <b>3</b>. Check: 2 + 3 = 5, 1 + 9 = 10 ✓.</p></div>
<div class="callout"><p><b>Example 2 — adjugate.</b> For A = [[1, 2, 3], [0, 4, 5], [1, 0, 6]] (det A = 22, Lesson 4.1), the first-row cofactors are C<sub>11</sub> = +(24 − 0) = 24, C<sub>12</sub> = −(0 − 5) = 5, C<sub>13</sub> = +(0 − 4) = −4. Computing all nine and transposing:</p>
<table class="matrix"><caption>adj A</caption><tbody><tr><td>24</td><td>−12</td><td>−2</td></tr><tr><td>5</td><td>3</td><td>−5</td></tr><tr><td>−4</td><td>2</td><td>4</td></tr></tbody></table>
<p>so A<sup>−1</sup> = adj A / 22. Check the (1,1) entry of A·adj A: 1·24 + 2·5 + 3·(−4) = 22 ✓.</p></div>
<div class="callout"><p><b>Example 3 — volume.</b> u = (2, 0, 0), v = (1, 3, 0), w = (1, 1, 4): det of the lower-triangular matrix with these rows = 2·3·4 = <b>24</b> cubic units.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Replacing a <em>row</em> instead of a column with b in Cramer's rule.</li><li>Forgetting to transpose the cofactor matrix — adj A = C<sup>T</sup>, not C.</li><li>Using Cramer when det A = 0: the rule does not apply (no unique solution).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Cramer: x<sub>j</sub> = det A<sub>j</sub>/det A.</li><li>A<sup>−1</sup> = C<sup>T</sup>/det A.</li><li>Triangle area = ½|det|; parallelepiped volume = |det|.</li><li>|det J| measures local volume change — change of variables, normalizing flows.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/cramers-rule" target="_blank" rel="noopener">3Blue1Brown — Cramer's rule, explained geometrically</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-20-cramers-rule-inverse-matrix-and-volume/" target="_blank" rel="noopener">MIT 18.06 — Lecture 20: Cramer's rule, inverse matrix, and volume</a></li><li><a href="https://en.wikipedia.org/wiki/Cramer%27s_rule" target="_blank" rel="noopener">Wikipedia — Cramer's rule</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Solve 3x − 2y = 4, x + y = 3 by Cramer's rule.</li><li>Find the inverse of [[1, 2], [3, 4]] with the adjugate formula.</li><li>Find the area of the triangle with vertices (1, 1), (4, 2), (2, 5).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) det A = 3 + 2 = 5; x = (4·1 − (−2)·3)/5 = 2; y = (3·3 − 4·1)/5 = 1. 2) det = −2; adj = [[4, −2], [−3, 1]]; A<sup>−1</sup> = [[−2, 1], [1.5, −0.5]]. 3) u = (3, 1), v = (1, 4): ½|12 − 1| = 5.5.</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 4 · Bài 4.3</span>
<h2>Quy tắc Cramer, nghịch đảo qua ma trận phụ hợp, và Jacobian</h2>
<p class="lead">Định thức cho các <em>công thức</em> tường minh cho nghiệm của Ax = b và cho A<sup>−1</sup>. Chúng quá chậm cho tính toán lớn, nhưng đúng là thứ cần cho bài 2×2, 3×3, cho chứng minh — và để đo một ánh xạ làm méo thể tích thế nào.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải hệ nhỏ bằng quy tắc Cramer.</li><li>Tính A<sup>−1</sup> bằng công thức ma trận phụ hợp (phần bù đại số).</li><li>Tính diện tích tam giác và thể tích hình hộp.</li><li>Giải thích định thức Jacobian trong đổi biến và trong các mô hình AI.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Cho A khả nghịch và A<sub>j</sub> là A với cột j thay bằng b. Khi đó</p>
<div class="formula"><span class="lbl">Quy tắc Cramer</span>x<sub>j</sub> = det A<sub>j</sub> / det A,   j = 1, …, n</div>
<p>Áp quy tắc Cramer cho các cột của I sẽ ra ma trận nghịch đảo. Lập ma trận phần bù đại số C (phần tử C<sub>ij</sub> như Bài 4.1); chuyển vị của nó là <strong>ma trận phụ hợp</strong> adj A = C<sup>T</sup>:</p>
<div class="formula"><span class="lbl">Công thức phụ hợp</span>A<sup>−1</sup> = adj(A) / det A = C<sup>T</sup> / det A</div>
<p>Với ma trận 2×2 đây đúng là công thức đổi chỗ–đổi dấu ở Bài 3.2. Cả hai công thức cần n + 1 định thức (hoặc n<sup>2</sup> phần bù), nên với n lớn phép khử rẻ hơn nhiều.</p>
<p><strong>Diện tích và thể tích.</strong> Tam giác có đỉnh 0, u, v trong mặt phẳng có diện tích ½|det[u v]|. Với các đỉnh P, Q, R, dùng u = Q − P, v = R − P. Hình hộp dựng trên ba vectơ trong R<sup>3</sup> có thể tích |det[u v w]|.</p>
<p><strong>Jacobian.</strong> Một ánh xạ phi tuyến, gần mỗi điểm, cư xử như một ánh xạ tuyến tính; ma trận các đạo hàm riêng của nó là Jacobian J, và |det J| là hệ số co giãn diện tích/thể tích tại chỗ. Vì thế toạ độ cực cho dx dy = r dr dθ (det J = r). Trong học máy, <em>normalizing flows</em> biến đổi một phân phối xác suất đơn giản bằng các ánh xạ khả nghịch và phải cộng log|det J| vào log-likelihood — chúng được thiết kế để J tam giác, khi đó định thức chỉ là tích các phần tử đường chéo.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — Cramer.</b> 2x + y = 5, x + 3y = 10. det A = 2·3 − 1·1 = 5.</p>
<p>x = det[[5, 1], [10, 3]] / 5 = (15 − 10)/5 = <b>1</b>; y = det[[2, 5], [1, 10]] / 5 = (20 − 5)/5 = <b>3</b>. Kiểm: 2 + 3 = 5, 1 + 9 = 10 ✓.</p></div>
<div class="callout"><p><b>Ví dụ 2 — phụ hợp.</b> Với A = [[1, 2, 3], [0, 4, 5], [1, 0, 6]] (det A = 22, Bài 4.1), các phần bù của hàng 1 là C<sub>11</sub> = +(24 − 0) = 24, C<sub>12</sub> = −(0 − 5) = 5, C<sub>13</sub> = +(0 − 4) = −4. Tính đủ chín phần bù rồi chuyển vị:</p>
<table class="matrix"><caption>adj A</caption><tbody><tr><td>24</td><td>−12</td><td>−2</td></tr><tr><td>5</td><td>3</td><td>−5</td></tr><tr><td>−4</td><td>2</td><td>4</td></tr></tbody></table>
<p>nên A<sup>−1</sup> = adj A / 22. Kiểm phần tử (1,1) của A·adj A: 1·24 + 2·5 + 3·(−4) = 22 ✓.</p></div>
<div class="callout"><p><b>Ví dụ 3 — thể tích.</b> u = (2, 0, 0), v = (1, 3, 0), w = (1, 1, 4): định thức của ma trận tam giác dưới có các hàng này = 2·3·4 = <b>24</b> đơn vị khối.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Thay một <em>hàng</em> thay vì một cột bằng b trong quy tắc Cramer.</li><li>Quên chuyển vị ma trận phần bù — adj A = C<sup>T</sup>, không phải C.</li><li>Dùng Cramer khi det A = 0: quy tắc không áp dụng (không có nghiệm duy nhất).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Cramer: x<sub>j</sub> = det A<sub>j</sub>/det A.</li><li>A<sup>−1</sup> = C<sup>T</sup>/det A.</li><li>Diện tích tam giác = ½|det|; thể tích hình hộp = |det|.</li><li>|det J| đo thay đổi thể tích tại chỗ — đổi biến, normalizing flows.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/cramers-rule" target="_blank" rel="noopener">3Blue1Brown — Quy tắc Cramer, giải thích bằng hình học</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-20-cramers-rule-inverse-matrix-and-volume/" target="_blank" rel="noopener">MIT 18.06 — Bài 20: Quy tắc Cramer, ma trận nghịch đảo và thể tích</a></li><li><a href="https://en.wikipedia.org/wiki/Cramer%27s_rule" target="_blank" rel="noopener">Wikipedia — Cramer's rule</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Giải 3x − 2y = 4, x + y = 3 bằng quy tắc Cramer.</li><li>Tìm nghịch đảo của [[1, 2], [3, 4]] bằng công thức phụ hợp.</li><li>Tìm diện tích tam giác có đỉnh (1, 1), (4, 2), (2, 5).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) det A = 3 + 2 = 5; x = (4·1 − (−2)·3)/5 = 2; y = (3·3 − 4·1)/5 = 1. 2) det = −2; adj = [[4, −2], [−3, 1]]; A<sup>−1</sup> = [[−2, 1], [1,5; −0,5]]. 3) u = (3, 1), v = (1, 4): ½|12 − 1| = 5,5.</p></div>`);

const q4 = QZ(4, 'Quiz — Chapter 4: Determinants|||Quiz — Chương 4: Định thức', 'Kiểm tra chương 4: định thức 2×2/3×3, ma trận tam giác, tính chất (đổi hàng, det(cA), det(AB)), quy tắc Cramer, diện tích.', [
  Q('q1', 'det [[3, 1], [1, 2]] =|||det [[3, 1], [1, 2]] =',
    ['7|||7', '5|||5', '6|||6', '−5|||−5'], 1,
    '3·2 − 1·1 = 5.|||3·2 − 1·1 = 5.'),
  Q('q2', 'det [[2, 7, 1], [0, 3, 5], [0, 0, −1]] =|||det [[2, 7, 1], [0, 3, 5], [0, 0, −1]] =',
    ['6|||6', '−6|||−6', '4|||4', '−42|||−42'], 1,
    'Triangular: 2·3·(−1).|||Tam giác: 2·3·(−1).'),
  Q('q3', 'Swapping two rows of a matrix|||Đổi chỗ hai hàng của một ma trận',
    ['leaves det unchanged|||giữ nguyên det', 'changes the sign of det|||đổi dấu det', 'doubles det|||nhân đôi det', 'makes det 0|||làm det = 0'], 1,
    'Each swap multiplies det by −1.|||Mỗi lần đổi chỗ nhân det với −1.'),
  Q('q4', 'A is 3×3 with det A = 5. det(2A) =|||A cỡ 3×3, det A = 5. det(2A) =',
    ['10|||10', '40|||40', '25|||25', '30|||30'], 1,
    '2³ · 5 = 40.|||2³ · 5 = 40.'),
  Q('q5', 'det A = 2 and det B = −3. det(AB) =|||det A = 2 và det B = −3. det(AB) =',
    ['−1|||−1', '−6|||−6', '6|||6', '−5|||−5'], 1,
    'Product rule.|||Quy tắc tích.'),
  Q('q6', 'det A = 0 means|||det A = 0 nghĩa là',
    ['A = 0|||A = 0', 'A is not invertible|||A không khả nghịch', 'A is symmetric|||A đối xứng', 'Ax = b always has a solution|||Ax = b luôn có nghiệm'], 1,
    'Columns are dependent; the map squashes volume to 0.|||Các cột phụ thuộc; ánh xạ ép thể tích về 0.'),
  Q('q7', 'det [[1, 2, 3], [0, 4, 5], [1, 0, 6]] =|||det [[1, 2, 3], [0, 4, 5], [1, 0, 6]] =',
    ['22|||22', '24|||24', '−2|||−2', '26|||26'], 0,
    'Column 1 expansion: 24 + (10 − 12).|||Khai triển cột 1: 24 + (10 − 12).'),
  Q('q8', "By Cramer's rule, x in 2x + y = 5, x + 3y = 10 is|||Theo quy tắc Cramer, x trong hệ 2x + y = 5, x + 3y = 10 là",
    ['1|||1', '3|||3', '5|||5', '2|||2'], 0,
    'det[[5, 1], [10, 3]] / det A = 5/5.|||det[[5, 1], [10, 3]] / det A = 5/5.'),
  Q('q9', 'The area of the parallelogram spanned by (3, 1) and (1, 2) is|||Diện tích hình bình hành dựng trên (3, 1) và (1, 2) là',
    ['7|||7', '5|||5', '6|||6', '2.5|||2,5'], 1,
    'Area = abs(6 − 1) = 5.|||Diện tích = abs(6 − 1) = 5.'),
]);

const ch4 = {
  title: 'Chapter 4 — Determinants|||Chương 4 — Định thức',
  description: 'Định thức: khai triển phần bù đại số, ý nghĩa diện tích/thể tích có dấu, tính chất và cách tính bằng phép khử, det(AB), quy tắc Cramer, ma trận phụ hợp, Jacobian (Strang ch.5 · MIT 18.06 bài 18–20).',
  lessons: [c41, c42, c43, q4],
};


// ───────────────────────────── Chương 5 — Không gian vectơ & không gian con ─────────────────────────────
const c51 = L('maa102-ts-5-1',
  '5.1 — Vector spaces and subspaces|||5.1 — Không gian vectơ và không gian con',
  'Định nghĩa không gian vectơ (Rⁿ, ma trận, đa thức, hàm số), phép thử không gian con ba điều kiện, ví dụ và phản ví dụ (mặt phẳng qua gốc, góc phần tư, hợp hai đường thẳng, ma trận có det = 0), span luôn là không gian con.',
  `<span class="eyebrow">MAA102 · Chapter 5 · Lesson 5.1</span>
<h2>Vector spaces and subspaces</h2>
<p class="lead">Everything we did with vectors in R<sup>n</sup> — adding, scaling, combining — also works for matrices, polynomials and functions. A <strong>vector space</strong> is any collection where these two operations behave as usual; a <strong>subspace</strong> is a vector space sitting inside a bigger one.</p>
<h3>🎯 Objectives</h3>
<ul><li>State what a vector space is and give examples beyond R<sup>n</sup>.</li><li>Apply the three-condition subspace test.</li><li>Recognise common subspaces and common non-subspaces.</li><li>Explain why every span is a subspace.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>vector space</strong> V is a set with an addition and a multiplication by real scalars such that sums and multiples stay in V and the usual rules hold: u + v = v + u, (u + v) + w = u + (v + w), there is a zero vector 0, every v has a negative −v, c(u + v) = cu + cv, (c + d)v = cv + dv, c(dv) = (cd)v and 1v = v. Examples:</p>
<ul><li><strong>R<sup>n</sup></strong> — column vectors.</li><li><strong>M<sub>m×n</sub></strong> — all m×n matrices (add entry-wise).</li><li><strong>P<sub>n</sub></strong> — polynomials of degree ≤ n, e.g. P<sub>2</sub> = {a + bx + cx<sup>2</sup>}.</li><li><strong>F(R)</strong> — all functions f: R → R, with (f + g)(x) = f(x) + g(x).</li></ul>
<p>A <strong>subspace</strong> W of V is a subset that is itself a vector space. Thanks to the rules inherited from V, only three checks are needed:</p>
<div class="formula"><span class="lbl">Subspace test</span>(1) 0 ∈ W    (2) u, v ∈ W ⇒ u + v ∈ W    (3) v ∈ W, c ∈ R ⇒ cv ∈ W</div>
<p>Equivalently: W is non-empty and closed under linear combinations. The subspaces of R<sup>3</sup> are exactly: {0}, lines through 0, planes through 0, and R<sup>3</sup> itself. The <strong>span</strong> of any set of vectors is always a subspace — the smallest one containing them — because a combination of combinations is again a combination.</p>
<div class="note-ct"><p><strong>AI view.</strong> Embedding vectors live in R<sup>768</sup> or more. Analyses of such models often find that a property (sentiment, gender, tense) varies mainly along a few directions; the span of those directions is a low-dimensional subspace. Projecting onto it (Chapter 9) isolates the property; removing it is a known technique for de-biasing embeddings.</p></div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — a plane.</b> W = {(x, y, z) : x + y − z = 0}. (1) (0, 0, 0) satisfies it. (2) If both u and v satisfy it, adding the two equations shows u + v does. (3) Multiplying the equation by c shows cv does. <b>Subspace</b> (a plane through 0).</p></div>
<div class="callout"><p><b>Example 2 — four non-subspaces.</b></p>
<ul><li>{x + y − z = 1}: does not contain 0.</li><li>The first quadrant {x ≥ 0, y ≥ 0}: (1, 1) is in it but −1·(1, 1) is not.</li><li>The union of the x-axis and the y-axis: (1, 0) + (0, 1) = (1, 1) is on neither axis.</li><li>Polynomials of degree <em>exactly</em> 2: x<sup>2</sup> + (−x<sup>2</sup> + x) = x has degree 1.</li></ul></div>
<div class="callout"><p><b>Example 3 — inside M<sub>2×2</sub> and P<sub>2</sub>.</b> Symmetric 2×2 matrices [[a, b], [b, d]] form a subspace (sum and multiples of symmetric matrices are symmetric). Polynomials p in P<sub>2</sub> with p(0) = 0, i.e. bx + cx<sup>2</sup>, form a subspace.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Checking only one or two of the three conditions. Always test 0 first — it is the fastest way to reject.</li><li>Testing closure with specific numbers only: to <em>prove</em> a subspace use general vectors; to <em>disprove</em> one counterexample is enough.</li><li>Thinking a line not through the origin is a subspace.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Vector space: addition and scalar multiplication with the usual rules (R<sup>n</sup>, matrices, polynomials, functions).</li><li>Subspace test: contains 0, closed under + and under scalar multiples.</li><li>Subspaces of R<sup>3</sup>: {0}, lines and planes through 0, R<sup>3</sup>.</li><li>Every span is a subspace.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/abstract-vector-spaces" target="_blank" rel="noopener">3Blue1Brown — Abstract vector spaces</a></li><li><a href="https://textbooks.math.gatech.edu/ila/subspaces.html" target="_blank" rel="noopener">Interactive Linear Algebra — Subspaces</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-5-transposes-permutations-spaces-r-n/" target="_blank" rel="noopener">MIT 18.06 — Lecture 5: Transposes, permutations, spaces Rⁿ</a></li><li><a href="https://en.wikipedia.org/wiki/Vector_space" target="_blank" rel="noopener">Wikipedia — Vector space</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Is {(x, y, z) : z = 2x} a subspace of R<sup>3</sup>?</li><li>Is {(x, y) : xy ≥ 0} a subspace of R<sup>2</sup>?</li><li>Is the set of 2×2 matrices with determinant 0 a subspace of M<sub>2×2</sub>?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Yes: it is the plane 2x − z = 0 through the origin. 2) No: (1, 0) and (0, −1) are in it, but their sum (1, −1) has xy = −1. 3) No: [[1, 0], [0, 0]] and [[0, 0], [0, 1]] have det 0, their sum I has det 1.</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 5 · Bài 5.1</span>
<h2>Không gian vectơ và không gian con</h2>
<p class="lead">Mọi việc ta làm với vectơ trong R<sup>n</sup> — cộng, nhân vô hướng, lập tổ hợp — cũng làm được với ma trận, đa thức và hàm số. <strong>Không gian vectơ</strong> là mọi tập hợp mà hai phép toán đó hoạt động như thường lệ; <strong>không gian con</strong> là một không gian vectơ nằm bên trong một không gian lớn hơn.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu không gian vectơ là gì và cho ví dụ ngoài R<sup>n</sup>.</li><li>Áp dụng phép thử không gian con ba điều kiện.</li><li>Nhận ra các không gian con hay gặp và các tập hay bị nhầm là không gian con.</li><li>Giải thích vì sao mọi span đều là không gian con.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Không gian vectơ</strong> V là một tập có phép cộng và phép nhân với số thực sao cho tổng và bội vẫn nằm trong V, và các quy tắc quen thuộc đúng: u + v = v + u, (u + v) + w = u + (v + w), có vectơ không 0, mỗi v có vectơ đối −v, c(u + v) = cu + cv, (c + d)v = cv + dv, c(dv) = (cd)v và 1v = v. Ví dụ:</p>
<ul><li><strong>R<sup>n</sup></strong> — vectơ cột.</li><li><strong>M<sub>m×n</sub></strong> — mọi ma trận m×n (cộng theo phần tử).</li><li><strong>P<sub>n</sub></strong> — đa thức bậc ≤ n, vd P<sub>2</sub> = {a + bx + cx<sup>2</sup>}.</li><li><strong>F(R)</strong> — mọi hàm f: R → R, với (f + g)(x) = f(x) + g(x).</li></ul>
<p><strong>Không gian con</strong> W của V là một tập con mà bản thân nó là không gian vectơ. Nhờ các quy tắc thừa hưởng từ V, chỉ cần kiểm ba điều:</p>
<div class="formula"><span class="lbl">Phép thử không gian con</span>(1) 0 ∈ W    (2) u, v ∈ W ⇒ u + v ∈ W    (3) v ∈ W, c ∈ R ⇒ cv ∈ W</div>
<p>Tương đương: W khác rỗng và đóng với tổ hợp tuyến tính. Các không gian con của R<sup>3</sup> chính là: {0}, các đường thẳng qua 0, các mặt phẳng qua 0, và chính R<sup>3</sup>. <strong>Span</strong> của mọi tập vectơ luôn là không gian con — không gian con nhỏ nhất chứa chúng — vì tổ hợp của các tổ hợp lại là một tổ hợp.</p>
<div class="note-ct"><p><strong>Góc nhìn AI.</strong> Vectơ embedding sống trong R<sup>768</sup> hoặc hơn. Các phân tích mô hình thường thấy một thuộc tính (cảm xúc, giới tính, thì của động từ) thay đổi chủ yếu theo vài hướng; span của các hướng đó là một không gian con ít chiều. Chiếu lên nó (Chương 9) tách được thuộc tính; loại bỏ nó là một kỹ thuật đã biết để giảm thiên lệch của embedding.</p></div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — một mặt phẳng.</b> W = {(x, y, z) : x + y − z = 0}. (1) (0, 0, 0) thoả. (2) Nếu u và v đều thoả, cộng hai phương trình cho thấy u + v thoả. (3) Nhân phương trình với c cho thấy cv thoả. <b>Là không gian con</b> (mặt phẳng qua 0).</p></div>
<div class="callout"><p><b>Ví dụ 2 — bốn tập không phải không gian con.</b></p>
<ul><li>{x + y − z = 1}: không chứa 0.</li><li>Góc phần tư thứ nhất {x ≥ 0, y ≥ 0}: (1, 1) thuộc nó nhưng −1·(1, 1) thì không.</li><li>Hợp của trục x và trục y: (1, 0) + (0, 1) = (1, 1) không nằm trên trục nào.</li><li>Đa thức bậc <em>đúng bằng</em> 2: x<sup>2</sup> + (−x<sup>2</sup> + x) = x có bậc 1.</li></ul></div>
<div class="callout"><p><b>Ví dụ 3 — trong M<sub>2×2</sub> và P<sub>2</sub>.</b> Các ma trận đối xứng 2×2 [[a, b], [b, d]] tạo thành không gian con (tổng và bội của ma trận đối xứng vẫn đối xứng). Các đa thức p trong P<sub>2</sub> với p(0) = 0, tức bx + cx<sup>2</sup>, tạo thành không gian con.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chỉ kiểm một hoặc hai trong ba điều kiện. Luôn kiểm 0 trước — đó là cách loại nhanh nhất.</li><li>Kiểm tính đóng chỉ bằng vài số cụ thể: để <em>chứng minh</em> phải dùng vectơ tổng quát; để <em>bác bỏ</em> chỉ cần một phản ví dụ.</li><li>Nghĩ một đường thẳng không qua gốc là không gian con.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Không gian vectơ: phép cộng và nhân vô hướng với các quy tắc quen thuộc (R<sup>n</sup>, ma trận, đa thức, hàm số).</li><li>Phép thử không gian con: chứa 0, đóng với phép cộng và phép nhân vô hướng.</li><li>Không gian con của R<sup>3</sup>: {0}, đường thẳng và mặt phẳng qua 0, R<sup>3</sup>.</li><li>Mọi span đều là không gian con.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/abstract-vector-spaces" target="_blank" rel="noopener">3Blue1Brown — Không gian vectơ trừu tượng</a></li><li><a href="https://textbooks.math.gatech.edu/ila/subspaces.html" target="_blank" rel="noopener">Interactive Linear Algebra — Không gian con</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-5-transposes-permutations-spaces-r-n/" target="_blank" rel="noopener">MIT 18.06 — Bài 5: Chuyển vị, hoán vị, không gian Rⁿ</a></li><li><a href="https://en.wikipedia.org/wiki/Vector_space" target="_blank" rel="noopener">Wikipedia — Vector space</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>{(x, y, z) : z = 2x} có là không gian con của R<sup>3</sup> không?</li><li>{(x, y) : xy ≥ 0} có là không gian con của R<sup>2</sup> không?</li><li>Tập các ma trận 2×2 có định thức 0 có là không gian con của M<sub>2×2</sub> không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Có: đó là mặt phẳng 2x − z = 0 qua gốc. 2) Không: (1, 0) và (0, −1) thuộc tập, nhưng tổng (1, −1) có xy = −1. 3) Không: [[1, 0], [0, 0]] và [[0, 0], [0, 1]] có det 0, tổng của chúng là I có det 1.</p></div>`);

const c52 = L('maa102-ts-5-2',
  '5.2 — Column space and nullspace|||5.2 — Không gian cột và không gian null',
  'Không gian cột C(A) ⊂ Rᵐ (mọi Ax), Ax = b có nghiệm ⇔ b ∈ C(A), không gian null N(A) ⊂ Rⁿ (mọi nghiệm của Ax = 0), điều kiện để b thuộc C(A), đặc trưng trùng lặp (đa cộng tuyến) trong học máy.',
  `<span class="eyebrow">MAA102 · Chapter 5 · Lesson 5.2</span>
<h2>Column space and nullspace</h2>
<p class="lead">Every matrix carries two subspaces that answer the two basic questions about Ax = b: <em>for which b is there a solution?</em> (the column space) and <em>how non-unique are the solutions?</em> (the nullspace).</p>
<h3>🎯 Objectives</h3>
<ul><li>Define C(A) and N(A) and say in which space each lives.</li><li>Decide whether a given b lies in C(A), and find the condition on b.</li><li>Find a spanning set of N(A) from elimination.</li><li>Interpret redundant features in a data matrix.</li></ul>
<h3>📖 Lecture</h3>
<p>Let A be m×n.</p>
<div class="formula"><span class="lbl">The two subspaces</span>C(A) = {Ax : x ∈ R<sup>n</sup>} = span of the columns ⊂ R<sup>m</sup>    N(A) = {x : Ax = 0} ⊂ R<sup>n</sup></div>
<p>C(A) is a subspace because it is a span. N(A) is a subspace because A0 = 0, A(x + y) = Ax + Ay = 0 and A(cx) = cAx = 0. Notice the sizes: column space lives in R<sup>m</sup> (outputs), nullspace in R<sup>n</sup> (inputs).</p>
<p>The column picture of Lesson 1.3 says Ax is a combination of columns, so:</p>
<div class="formula"><span class="lbl">Solvability</span>Ax = b has a solution ⇔ b ∈ C(A)</div>
<p>The nullspace measures non-uniqueness: if Ax<sub>p</sub> = b and x<sub>n</sub> ∈ N(A), then A(x<sub>p</sub> + x<sub>n</sub>) = b as well. When N(A) = {0}, solutions (if any) are unique; for a square matrix that is exactly invertibility.</p>
<p>To find N(A), row-reduce A (no right-hand side needed — it stays 0), set each free variable to 1 in turn (others 0) and solve for the pivot variables. The resulting <strong>special solutions</strong> span N(A). To find which b are reachable, row-reduce [A | b] with b symbolic; each zero row of A gives one equation that b must satisfy.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>A matrix with a redundant column.</b></p>
<table class="matrix"><caption>A</caption><tbody><tr><td>1</td><td>1</td><td>2</td></tr><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>1</td><td>3</td><td>4</td></tr></tbody></table>
<p>Step 1 — eliminate [A | b]: R2 − R1 = (0, 1, 1 | b<sub>2</sub> − b<sub>1</sub>); R3 − R1 = (0, 2, 2 | b<sub>3</sub> − b<sub>1</sub>); R3 − 2R2 = (0, 0, 0 | b<sub>1</sub> − 2b<sub>2</sub> + b<sub>3</sub>).</p>
<p>Step 2 — column space: solvable ⇔ <b>b<sub>1</sub> − 2b<sub>2</sub> + b<sub>3</sub> = 0</b>. C(A) is a plane in R<sup>3</sup>, spanned by the pivot columns (1, 1, 1) and (1, 2, 3). For b = (3, 5, 7): 3 − 10 + 7 = 0 ✓ reachable. For b = (1, 0, 0): 1 ≠ 0 ✗.</p>
<p>Step 3 — nullspace: x<sub>3</sub> is free. Set x<sub>3</sub> = −1: then x<sub>2</sub> + x<sub>3</sub> = 0 gives x<sub>2</sub> = 1, and x<sub>1</sub> + x<sub>2</sub> + 2x<sub>3</sub> = 0 gives x<sub>1</sub> = 1. N(A) is the line through <b>(1, 1, −1)</b>. Check: column 1 + column 2 − column 3 = 0 ✓ — the nullspace vector records the dependency “column 3 = column 1 + column 2”.</p></div>
<p><strong>Data-science connection.</strong> If a data matrix has a feature that is the sum of two others (e.g. total = part A + part B), its nullspace is non-zero. Then a linear model's weights are <em>not unique</em> — adding any nullspace vector does not change predictions. Statisticians call this <strong>multicollinearity</strong>; regularization (ridge regression) is one cure.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Taking the columns of the <em>reduced</em> matrix as a basis of C(A). Row operations change the column space; use the pivot columns of the <em>original</em> A.</li><li>Mixing up where they live: C(A) ⊂ R<sup>m</sup>, N(A) ⊂ R<sup>n</sup>.</li><li>Saying N(A) is empty when Ax = 0 has only the trivial solution — it is {0}, which is not empty.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>C(A) = all Ax = span of the columns; Ax = b solvable ⇔ b ∈ C(A).</li><li>N(A) = all solutions of Ax = 0; spanned by the special solutions.</li><li>Zero rows after elimination give the conditions on b.</li><li>Non-zero nullspace = dependent columns = non-unique solutions.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-6-column-space-and-nullspace/" target="_blank" rel="noopener">MIT 18.06 — Lecture 6: Column space and nullspace</a></li><li><a href="https://www.3blue1brown.com/lessons/inverse-matrices" target="_blank" rel="noopener">3Blue1Brown — Inverse matrices, column space, and null space</a></li><li><a href="https://en.wikipedia.org/wiki/Kernel_(linear_algebra)" target="_blank" rel="noopener">Wikipedia — Kernel (linear algebra)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Describe C(A) and N(A) for A = [[1, 2], [2, 4]].</li><li>For the matrix of the worked example, is (2, 3, 4) in C(A)? If so, find x.</li><li>What are N(I) and C(I) for the n×n identity?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) C(A) = line through (1, 2) in R<sup>2</sup>; N(A) = line through (−2, 1). 2) 2 − 6 + 4 = 0, yes; with x<sub>3</sub> = 0: x<sub>1</sub> + x<sub>2</sub> = 2, x<sub>1</sub> + 2x<sub>2</sub> = 3 ⇒ x = (1, 1, 0) (check row 3: 1 + 3 = 4 ✓). 3) N(I) = {0}, C(I) = R<sup>n</sup>.</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 5 · Bài 5.2</span>
<h2>Không gian cột và không gian null</h2>
<p class="lead">Mỗi ma trận mang theo hai không gian con trả lời hai câu hỏi cơ bản về Ax = b: <em>với b nào thì có nghiệm?</em> (không gian cột) và <em>nghiệm “không duy nhất” đến mức nào?</em> (không gian null).</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa C(A) và N(A), biết mỗi cái nằm trong không gian nào.</li><li>Quyết định một b cho trước có thuộc C(A) không, và tìm điều kiện trên b.</li><li>Tìm tập sinh của N(A) từ phép khử.</li><li>Hiểu các đặc trưng trùng lặp trong ma trận dữ liệu.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Cho A cỡ m×n.</p>
<div class="formula"><span class="lbl">Hai không gian con</span>C(A) = {Ax : x ∈ R<sup>n</sup>} = span các cột ⊂ R<sup>m</sup>    N(A) = {x : Ax = 0} ⊂ R<sup>n</sup></div>
<p>C(A) là không gian con vì nó là một span. N(A) là không gian con vì A0 = 0, A(x + y) = Ax + Ay = 0 và A(cx) = cAx = 0. Để ý cỡ: không gian cột nằm trong R<sup>m</sup> (đầu ra), không gian null nằm trong R<sup>n</sup> (đầu vào).</p>
<p>Hình ảnh cột ở Bài 1.3 nói Ax là tổ hợp các cột, nên:</p>
<div class="formula"><span class="lbl">Điều kiện có nghiệm</span>Ax = b có nghiệm ⇔ b ∈ C(A)</div>
<p>Không gian null đo độ không duy nhất: nếu Ax<sub>p</sub> = b và x<sub>n</sub> ∈ N(A) thì A(x<sub>p</sub> + x<sub>n</sub>) = b. Khi N(A) = {0}, nghiệm (nếu có) là duy nhất; với ma trận vuông, đó đúng là tính khả nghịch.</p>
<p>Để tìm N(A), rút gọn hàng A (không cần vế phải — nó luôn là 0), lần lượt cho mỗi biến tự do bằng 1 (các biến tự do khác bằng 0) rồi giải các biến pivot. Các <strong>nghiệm đặc biệt</strong> thu được sinh ra N(A). Để biết b nào đạt được, rút gọn [A | b] với b là chữ; mỗi hàng 0 của A cho một phương trình mà b phải thoả.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ma trận có một cột thừa.</b></p>
<table class="matrix"><caption>A</caption><tbody><tr><td>1</td><td>1</td><td>2</td></tr><tr><td>1</td><td>2</td><td>3</td></tr><tr><td>1</td><td>3</td><td>4</td></tr></tbody></table>
<p>Bước 1 — khử [A | b]: R2 − R1 = (0, 1, 1 | b<sub>2</sub> − b<sub>1</sub>); R3 − R1 = (0, 2, 2 | b<sub>3</sub> − b<sub>1</sub>); R3 − 2R2 = (0, 0, 0 | b<sub>1</sub> − 2b<sub>2</sub> + b<sub>3</sub>).</p>
<p>Bước 2 — không gian cột: có nghiệm ⇔ <b>b<sub>1</sub> − 2b<sub>2</sub> + b<sub>3</sub> = 0</b>. C(A) là một mặt phẳng trong R<sup>3</sup>, sinh bởi các cột pivot (1, 1, 1) và (1, 2, 3). Với b = (3, 5, 7): 3 − 10 + 7 = 0 ✓ đạt được. Với b = (1, 0, 0): 1 ≠ 0 ✗.</p>
<p>Bước 3 — không gian null: x<sub>3</sub> tự do. Cho x<sub>3</sub> = −1: x<sub>2</sub> + x<sub>3</sub> = 0 cho x<sub>2</sub> = 1, và x<sub>1</sub> + x<sub>2</sub> + 2x<sub>3</sub> = 0 cho x<sub>1</sub> = 1. N(A) là đường thẳng qua <b>(1, 1, −1)</b>. Kiểm: cột 1 + cột 2 − cột 3 = 0 ✓ — vectơ null ghi lại quan hệ phụ thuộc “cột 3 = cột 1 + cột 2”.</p></div>
<p><strong>Liên hệ khoa học dữ liệu.</strong> Nếu ma trận dữ liệu có một đặc trưng bằng tổng hai đặc trưng khác (vd tổng = phần A + phần B), không gian null của nó khác {0}. Khi đó trọng số của mô hình tuyến tính <em>không duy nhất</em> — cộng thêm bất kỳ vectơ null nào cũng không đổi dự đoán. Dân thống kê gọi đó là <strong>đa cộng tuyến</strong>; chuẩn hoá (ridge regression) là một cách chữa.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Lấy các cột của ma trận <em>đã rút gọn</em> làm cơ sở của C(A). Phép biến đổi hàng làm đổi không gian cột; hãy dùng các cột pivot của A <em>ban đầu</em>.</li><li>Nhầm chỗ ở: C(A) ⊂ R<sup>m</sup>, N(A) ⊂ R<sup>n</sup>.</li><li>Nói N(A) rỗng khi Ax = 0 chỉ có nghiệm tầm thường — nó là {0}, không rỗng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>C(A) = mọi Ax = span các cột; Ax = b có nghiệm ⇔ b ∈ C(A).</li><li>N(A) = mọi nghiệm của Ax = 0; sinh bởi các nghiệm đặc biệt.</li><li>Các hàng 0 sau khi khử cho điều kiện trên b.</li><li>Không gian null khác {0} = các cột phụ thuộc = nghiệm không duy nhất.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-6-column-space-and-nullspace/" target="_blank" rel="noopener">MIT 18.06 — Bài 6: Không gian cột và không gian null</a></li><li><a href="https://www.3blue1brown.com/lessons/inverse-matrices" target="_blank" rel="noopener">3Blue1Brown — Ma trận nghịch đảo, không gian cột và không gian null</a></li><li><a href="https://en.wikipedia.org/wiki/Kernel_(linear_algebra)" target="_blank" rel="noopener">Wikipedia — Kernel (linear algebra)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Mô tả C(A) và N(A) với A = [[1, 2], [2, 4]].</li><li>Với ma trận trong ví dụ, (2, 3, 4) có thuộc C(A) không? Nếu có, tìm x.</li><li>N(I) và C(I) của ma trận đơn vị n×n là gì?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) C(A) = đường thẳng qua (1, 2) trong R<sup>2</sup>; N(A) = đường thẳng qua (−2, 1). 2) 2 − 6 + 4 = 0, có; với x<sub>3</sub> = 0: x<sub>1</sub> + x<sub>2</sub> = 2, x<sub>1</sub> + 2x<sub>2</sub> = 3 ⇒ x = (1, 1, 0) (kiểm hàng 3: 1 + 3 = 4 ✓). 3) N(I) = {0}, C(I) = R<sup>n</sup>.</p></div>`);

const c53 = L('maa102-ts-5-3',
  '5.3 — The complete solution x = xₚ + xₙ and the role of rank|||5.3 — Nghiệm tổng quát x = xₚ + xₙ và vai trò của hạng',
  'Nghiệm tổng quát của Ax = b bằng một nghiệm riêng cộng không gian null, hình học của tập nghiệm (không gian con dịch chuyển), bảng bốn trường hợp theo hạng r, m, n — có code sympy gauss_jordan_solve.',
  `<span class="eyebrow">MAA102 · Chapter 5 · Lesson 5.3</span>
<h2>The complete solution x = x<sub>p</sub> + x<sub>n</sub> and the role of rank</h2>
<p class="lead">Every solvable system Ax = b has the same shape of answer: <em>one</em> particular solution plus <em>everything</em> in the nullspace. And the rank r alone tells you, before any computation, which of four situations you are in.</p>
<h3>🎯 Objectives</h3>
<ul><li>Find a particular solution by setting free variables to 0.</li><li>Write the complete solution x = x<sub>p</sub> + x<sub>n</sub>.</li><li>Describe the solution set geometrically.</li><li>Use r, m, n to predict the number of solutions.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Complete solution</span>x = x<sub>p</sub> + x<sub>n</sub>    A x<sub>p</sub> = b (one particular solution),   x<sub>n</sub> ∈ N(A) (any nullspace vector)</div>
<p>Why: if x and x<sub>p</sub> both solve Ax = b, then A(x − x<sub>p</sub>) = b − b = 0, so x − x<sub>p</sub> is in the nullspace. <strong>Recipe:</strong> (1) reduce [A | b]; (2) check consistency; (3) set all free variables to 0 and solve for the pivot variables — that is x<sub>p</sub>; (4) find the special solutions of Ax = 0; (5) add.</p>
<p><strong>Geometry.</strong> The solution set is the subspace N(A) <em>shifted</em> by x<sub>p</sub> — a line or plane that does not pass through the origin when b ≠ 0. That is why the solution set of Ax = b with b ≠ 0 is <em>not</em> a subspace.</p>
<p><strong>Rank decides everything.</strong> For an m×n matrix of rank r (number of pivots, r ≤ m and r ≤ n):</p>
<ul><li><strong>r = m = n</strong> (square, invertible): exactly 1 solution for every b.</li><li><strong>r = n &lt; m</strong> (tall, full column rank): N(A) = {0}; 0 or 1 solution.</li><li><strong>r = m &lt; n</strong> (wide, full row rank): every b is reachable; ∞ solutions (n − r free variables).</li><li><strong>r &lt; m and r &lt; n</strong>: 0 or ∞ solutions.</li></ul>
<p>The tall case is typical of data fitting (many more measurements than unknowns): usually there is <em>no</em> exact solution, and we look for the best approximate one — least squares, Chapter 9. The wide case is typical of under-determined problems (more parameters than data), which is the regime of modern over-parameterised neural networks.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Solve</b> Ax = b with A = [[1, 1, 2], [1, 2, 3], [1, 3, 4]] and b = (3, 5, 7) (Lesson 5.2).</p>
<p>Step 1: elimination gives x<sub>1</sub> + x<sub>2</sub> + 2x<sub>3</sub> = 3, x<sub>2</sub> + x<sub>3</sub> = 2, and 0 = 3 − 10 + 7 = 0 ✓ consistent.</p>
<p>Step 2: free x<sub>3</sub> = 0 ⇒ x<sub>2</sub> = 2, x<sub>1</sub> = 1: <b>x<sub>p</sub> = (1, 2, 0)</b>.</p>
<p>Step 3: N(A) is spanned by (1, 1, −1). Step 4:</p>
<div class="formula"><span class="lbl">Complete solution</span>x = (1, 2, 0) + t·(1, 1, −1),   t ∈ R</div>
<p>Here m = n = 3, r = 2 &lt; 3: the “0 or ∞” case, and this b gives ∞. Check t = 1: x = (2, 3, −1) and A x = (2 + 3 − 2, 2 + 6 − 3, 2 + 9 − 4) = (3, 5, 7) ✓.</p></div>
<pre><code class="language-python">from sympy import Matrix
A = Matrix([[1, 1, 2],
            [1, 2, 3],
            [1, 3, 4]])
b = Matrix([3, 5, 7])
sol, params = A.gauss_jordan_solve(b)
print(sol.T)              # tau0 is the free parameter
print(A.nullspace())      # basis of N(A)
print(A.columnspace())    # basis of C(A): the pivot columns</code></pre>
<div class="out">Matrix([[1 - tau0, 2 - tau0, tau0]])<br>[Matrix([<br>[-1],<br>[-1],<br>[ 1]])]<br>[Matrix([<br>[1],<br>[1],<br>[1]]), Matrix([<br>[1],<br>[2],<br>[3]])]</div>
<p>SymPy writes the same line with parameter τ<sub>0</sub> = −t and nullspace vector (−1, −1, 1) = −(1, 1, −1): a different but equivalent description.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting x<sub>p</sub>, or forgetting x<sub>n</sub>, in the final answer.</li><li>Thinking the parametrisation is unique — different choices of x<sub>p</sub> and of basis give the same set.</li><li>Concluding “infinitely many solutions” from r &lt; n without checking consistency first.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>x = x<sub>p</sub> + x<sub>n</sub>: particular solution (free variables = 0) plus nullspace.</li><li>Solution set = shifted copy of N(A).</li><li>r = n ⇒ at most one solution; r = m ⇒ always solvable.</li><li>Tall systems ⇒ least squares; wide systems ⇒ many solutions.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-7-solving-ax-0-pivot-variables-special-solutions/" target="_blank" rel="noopener">MIT 18.06 — Lecture 7: Solving Ax = 0, pivot variables, special solutions</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-8-solving-ax-b-row-reduced-form-r/" target="_blank" rel="noopener">MIT 18.06 — Lecture 8: Solving Ax = b, row reduced form R</a></li><li><a href="https://textbooks.math.gatech.edu/ila/solution-sets.html" target="_blank" rel="noopener">Interactive Linear Algebra — Solution Sets</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write the complete solution of the single equation x + y + z = 3.</li><li>A is 3×5 with rank 3. How many solutions does Ax = b have, for each b?</li><li>A is 5×3 with rank 3. Can Ax = b have infinitely many solutions?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) x = (3, 0, 0) + s(−1, 1, 0) + t(−1, 0, 1). 2) r = m = 3 ⇒ always solvable, with 5 − 3 = 2 free variables ⇒ infinitely many. 3) No: r = n ⇒ N(A) = {0} ⇒ 0 or 1 solution.</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 5 · Bài 5.3</span>
<h2>Nghiệm tổng quát x = x<sub>p</sub> + x<sub>n</sub> và vai trò của hạng</h2>
<p class="lead">Mọi hệ Ax = b có nghiệm đều có cùng một dạng đáp án: <em>một</em> nghiệm riêng cộng <em>toàn bộ</em> không gian null. Và chỉ riêng hạng r cho biết trước, chưa cần tính gì, ta đang ở trường hợp nào trong bốn trường hợp.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tìm một nghiệm riêng bằng cách cho các biến tự do bằng 0.</li><li>Viết nghiệm tổng quát x = x<sub>p</sub> + x<sub>n</sub>.</li><li>Mô tả tập nghiệm bằng hình học.</li><li>Dùng r, m, n để dự đoán số nghiệm.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Nghiệm tổng quát</span>x = x<sub>p</sub> + x<sub>n</sub>    A x<sub>p</sub> = b (một nghiệm riêng),   x<sub>n</sub> ∈ N(A) (vectơ null bất kỳ)</div>
<p>Lý do: nếu x và x<sub>p</sub> cùng là nghiệm của Ax = b thì A(x − x<sub>p</sub>) = b − b = 0, nên x − x<sub>p</sub> thuộc không gian null. <strong>Công thức làm:</strong> (1) rút gọn [A | b]; (2) kiểm tính tương thích; (3) cho mọi biến tự do bằng 0 và giải các biến pivot — đó là x<sub>p</sub>; (4) tìm các nghiệm đặc biệt của Ax = 0; (5) cộng lại.</p>
<p><strong>Hình học.</strong> Tập nghiệm là không gian con N(A) <em>bị dịch chuyển</em> bởi x<sub>p</sub> — một đường thẳng hay mặt phẳng không qua gốc khi b ≠ 0. Vì vậy tập nghiệm của Ax = b với b ≠ 0 <em>không</em> phải là không gian con.</p>
<p><strong>Hạng quyết định tất cả.</strong> Với ma trận m×n hạng r (số pivot, r ≤ m và r ≤ n):</p>
<ul><li><strong>r = m = n</strong> (vuông, khả nghịch): đúng 1 nghiệm với mọi b.</li><li><strong>r = n &lt; m</strong> (cao, hạng cột đầy đủ): N(A) = {0}; 0 hoặc 1 nghiệm.</li><li><strong>r = m &lt; n</strong> (rộng, hạng hàng đầy đủ): mọi b đều đạt được; vô số nghiệm (n − r biến tự do).</li><li><strong>r &lt; m và r &lt; n</strong>: 0 hoặc vô số nghiệm.</li></ul>
<p>Trường hợp “cao” điển hình cho khớp dữ liệu (số phép đo nhiều hơn số ẩn rất nhiều): thường <em>không</em> có nghiệm đúng, và ta tìm nghiệm xấp xỉ tốt nhất — bình phương tối thiểu, Chương 9. Trường hợp “rộng” điển hình cho bài toán thiếu ràng buộc (nhiều tham số hơn dữ liệu), chính là chế độ của các mạng nơ-ron hiện đại có quá nhiều tham số.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Giải</b> Ax = b với A = [[1, 1, 2], [1, 2, 3], [1, 3, 4]] và b = (3, 5, 7) (Bài 5.2).</p>
<p>Bước 1: phép khử cho x<sub>1</sub> + x<sub>2</sub> + 2x<sub>3</sub> = 3, x<sub>2</sub> + x<sub>3</sub> = 2, và 0 = 3 − 10 + 7 = 0 ✓ tương thích.</p>
<p>Bước 2: biến tự do x<sub>3</sub> = 0 ⇒ x<sub>2</sub> = 2, x<sub>1</sub> = 1: <b>x<sub>p</sub> = (1, 2, 0)</b>.</p>
<p>Bước 3: N(A) sinh bởi (1, 1, −1). Bước 4:</p>
<div class="formula"><span class="lbl">Nghiệm tổng quát</span>x = (1, 2, 0) + t·(1, 1, −1),   t ∈ R</div>
<p>Ở đây m = n = 3, r = 2 &lt; 3: trường hợp “0 hoặc vô số”, và b này cho vô số. Kiểm t = 1: x = (2, 3, −1) và A x = (2 + 3 − 2, 2 + 6 − 3, 2 + 9 − 4) = (3, 5, 7) ✓.</p></div>
<pre><code class="language-python">from sympy import Matrix
A = Matrix([[1, 1, 2],
            [1, 2, 3],
            [1, 3, 4]])
b = Matrix([3, 5, 7])
sol, params = A.gauss_jordan_solve(b)
print(sol.T)              # tau0 is the free parameter
print(A.nullspace())      # basis of N(A)
print(A.columnspace())    # basis of C(A): the pivot columns</code></pre>
<div class="out">Matrix([[1 - tau0, 2 - tau0, tau0]])<br>[Matrix([<br>[-1],<br>[-1],<br>[ 1]])]<br>[Matrix([<br>[1],<br>[1],<br>[1]]), Matrix([<br>[1],<br>[2],<br>[3]])]</div>
<p>SymPy viết cùng đường thẳng đó với tham số τ<sub>0</sub> = −t và vectơ null (−1, −1, 1) = −(1, 1, −1): cách mô tả khác nhưng tương đương.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên x<sub>p</sub>, hoặc quên x<sub>n</sub>, trong đáp số cuối.</li><li>Nghĩ cách tham số hoá là duy nhất — chọn x<sub>p</sub> và cơ sở khác nhau vẫn cho cùng một tập.</li><li>Kết luận “vô số nghiệm” từ r &lt; n mà chưa kiểm tính tương thích.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>x = x<sub>p</sub> + x<sub>n</sub>: nghiệm riêng (biến tự do = 0) cộng không gian null.</li><li>Tập nghiệm = bản sao của N(A) bị dịch chuyển.</li><li>r = n ⇒ nhiều nhất một nghiệm; r = m ⇒ luôn có nghiệm.</li><li>Hệ “cao” ⇒ bình phương tối thiểu; hệ “rộng” ⇒ nhiều nghiệm.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-7-solving-ax-0-pivot-variables-special-solutions/" target="_blank" rel="noopener">MIT 18.06 — Bài 7: Giải Ax = 0, biến pivot, nghiệm đặc biệt</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-8-solving-ax-b-row-reduced-form-r/" target="_blank" rel="noopener">MIT 18.06 — Bài 8: Giải Ax = b, dạng rút gọn R</a></li><li><a href="https://textbooks.math.gatech.edu/ila/solution-sets.html" target="_blank" rel="noopener">Interactive Linear Algebra — Tập nghiệm</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết nghiệm tổng quát của phương trình x + y + z = 3.</li><li>A cỡ 3×5 có hạng 3. Ax = b có bao nhiêu nghiệm, với mỗi b?</li><li>A cỡ 5×3 có hạng 3. Ax = b có thể có vô số nghiệm không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) x = (3, 0, 0) + s(−1, 1, 0) + t(−1, 0, 1). 2) r = m = 3 ⇒ luôn có nghiệm, với 5 − 3 = 2 biến tự do ⇒ vô số. 3) Không: r = n ⇒ N(A) = {0} ⇒ 0 hoặc 1 nghiệm.</p></div>`);

const q5 = QZ(5, 'Quiz — Chapter 5: Vector spaces, column space, nullspace|||Quiz — Chương 5: Không gian vectơ, không gian cột, không gian null', 'Kiểm tra chương 5: phép thử không gian con, C(A) và N(A), điều kiện có nghiệm, nghiệm tổng quát, bốn trường hợp theo hạng.', [
  Q('q1', 'Which set is a subspace of R²?|||Tập nào là không gian con của R²?',
    ['the line y = 2x + 1|||đường thẳng y = 2x + 1', 'the line y = 3x|||đường thẳng y = 3x', 'the first quadrant|||góc phần tư thứ nhất', 'the union of both axes|||hợp của hai trục'], 1,
    'Only a line through the origin is closed under + and scalar multiplication.|||Chỉ đường thẳng qua gốc là đóng với phép cộng và nhân vô hướng.'),
  Q('q2', 'The fastest first check that a set is NOT a subspace is|||Cách kiểm nhanh nhất để thấy một tập KHÔNG là không gian con là',
    ['whether it is finite|||nó có hữu hạn không', 'whether it contains the zero vector|||nó có chứa vectơ không không', 'whether it contains (1, 1)|||nó có chứa (1, 1) không', 'whether it is bounded|||nó có bị chặn không'], 1,
    'Every subspace contains 0.|||Mọi không gian con đều chứa 0.'),
  Q('q3', 'A is 4×6. C(A) and N(A) are subspaces of|||A cỡ 4×6. C(A) và N(A) là không gian con của',
    ['R⁶ and R⁴|||R⁶ và R⁴', 'R⁴ and R⁶|||R⁴ và R⁶', 'R⁴ and R⁴|||R⁴ và R⁴', 'R⁶ and R⁶|||R⁶ và R⁶'], 1,
    'Outputs Ax are in R⁴; inputs x are in R⁶.|||Đầu ra Ax thuộc R⁴; đầu vào x thuộc R⁶.'),
  Q('q4', 'Ax = b has a solution exactly when|||Ax = b có nghiệm đúng khi',
    ['b ∈ N(A)|||b ∈ N(A)', 'b ∈ C(A)|||b ∈ C(A)', 'b = 0|||b = 0', 'A is square|||A vuông'], 1,
    'Ax is a combination of the columns.|||Ax là tổ hợp các cột.'),
  Q('q5', 'For A = [[1, 1, 2], [1, 2, 3], [1, 3, 4]], which vector spans N(A)?|||Với A = [[1, 1, 2], [1, 2, 3], [1, 3, 4]], vectơ nào sinh ra N(A)?',
    ['(1, 1, 1)|||(1, 1, 1)', '(1, 1, −1)|||(1, 1, −1)', '(1, −2, 1)|||(1, −2, 1)', '(2, 3, 4)|||(2, 3, 4)'], 1,
    'Column 1 + column 2 − column 3 = 0.|||Cột 1 + cột 2 − cột 3 = 0.'),
  Q('q6', 'For that same A, which b is in C(A)?|||Với cùng A đó, b nào thuộc C(A)?',
    ['(1, 0, 0)|||(1, 0, 0)', '(3, 5, 7)|||(3, 5, 7)', '(1, 1, 0)|||(1, 1, 0)', '(0, 0, 1)|||(0, 0, 1)'], 1,
    'Condition b₁ − 2b₂ + b₃ = 0: 3 − 10 + 7 = 0.|||Điều kiện b₁ − 2b₂ + b₃ = 0: 3 − 10 + 7 = 0.'),
  Q('q7', 'If xₚ solves Ax = b, every solution has the form|||Nếu xₚ là nghiệm của Ax = b, mọi nghiệm có dạng',
    ['xₚ + any vector of C(A)|||xₚ + vectơ bất kỳ của C(A)', 'xₚ + any vector of N(A)|||xₚ + vectơ bất kỳ của N(A)', 'c·xₚ|||c·xₚ', 'xₚ only|||chỉ xₚ'], 1,
    'A(x − xₚ) = 0.|||A(x − xₚ) = 0.'),
  Q('q8', 'A is 5×3 with rank 3. Ax = b has|||A cỡ 5×3 có hạng 3. Ax = b có',
    ['always infinitely many solutions|||luôn vô số nghiệm', '0 or 1 solution|||0 hoặc 1 nghiệm', 'always exactly 1 solution|||luôn đúng 1 nghiệm', '0 or infinitely many|||0 hoặc vô số'], 1,
    'r = n ⇒ N(A) = {0}; but r < m so some b are unreachable.|||r = n ⇒ N(A) = {0}; nhưng r < m nên có b không đạt được.'),
  Q('q9', 'The set of all solutions of Ax = b with b ≠ 0 is|||Tập mọi nghiệm của Ax = b với b ≠ 0 là',
    ['always a subspace|||luôn là không gian con', 'never a subspace|||không bao giờ là không gian con', 'a subspace only if A is square|||là không gian con chỉ khi A vuông', 'the column space|||không gian cột'], 1,
    'It does not contain 0, since A0 = 0 ≠ b.|||Nó không chứa 0, vì A0 = 0 ≠ b.'),
]);

const ch5 = {
  title: 'Chapter 5 — Vector spaces and subspaces|||Chương 5 — Không gian vectơ và không gian con',
  description: 'Không gian vectơ (Rⁿ, ma trận, đa thức, hàm), phép thử không gian con, không gian cột và không gian null, nghiệm tổng quát x = xₚ + xₙ, bốn trường hợp theo hạng (Strang 3.1–3.3 · MIT 18.06 bài 5–8).',
  lessons: [c51, c52, c53, q5],
};


// ───────────────────────────── Chương 6 — Độc lập tuyến tính, cơ sở, số chiều, hạng ─────────────────────────────
const c61 = L('maa102-ts-6-1',
  '6.1 — Linear independence|||6.1 — Độc lập tuyến tính',
  'Định nghĩa độc lập/phụ thuộc tuyến tính, phép thử bằng Ax = 0 và bằng hạng/định thức, các sự kiện nhanh (chứa vectơ 0, nhiều hơn n vectơ trong Rⁿ, hai vectơ cùng phương), độc lập của hàm số.',
  `<span class="eyebrow">MAA102 · Chapter 6 · Lesson 6.1</span>
<h2>Linear independence</h2>
<p class="lead">A set of vectors is independent when none of them is redundant — no vector can be built from the others. Independence is what makes a description of a space efficient, and it is the first half of the definition of a basis.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the definition of linear independence and dependence.</li><li>Test independence by solving Ax = 0, by rank, or (square case) by determinant.</li><li>Find an explicit dependency relation when one exists.</li><li>Use quick facts to decide independence without computation.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Definition</span>v<sub>1</sub>, …, v<sub>k</sub> are linearly independent ⇔ c<sub>1</sub>v<sub>1</sub> + … + c<sub>k</sub>v<sub>k</sub> = 0 only for c<sub>1</sub> = … = c<sub>k</sub> = 0</div>
<p>If some non-trivial combination gives 0, the vectors are <strong>dependent</strong>, and at least one of them is a combination of the others (solve the relation for a vector whose coefficient is non-zero).</p>
<p><strong>Matrix test.</strong> Put the vectors as the columns of A. The relation c<sub>1</sub>v<sub>1</sub> + … + c<sub>k</sub>v<sub>k</sub> = 0 is Ac = 0. So:</p>
<div class="formula"><span class="lbl">Independence test</span>columns of A independent ⇔ N(A) = {0} ⇔ rank A = k (a pivot in every column)    (square: ⇔ det A ≠ 0)</div>
<p><strong>Quick facts.</strong></p>
<ul><li>Any set containing the zero vector is dependent (1·0 = 0).</li><li>Two vectors are dependent exactly when one is a multiple of the other.</li><li>More than n vectors in R<sup>n</sup> are always dependent (at most n pivots).</li><li>Removing vectors from an independent set keeps it independent; adding vectors to a dependent set keeps it dependent.</li></ul>
<p>Independence also makes sense in other vector spaces: the functions 1, x, x<sup>2</sup> are independent in F(R) because a + bx + cx<sup>2</sup> = 0 for <em>all</em> x forces a = b = c = 0.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — dependent.</b> v<sub>1</sub> = (1, 2, 3), v<sub>2</sub> = (4, 5, 6), v<sub>3</sub> = (7, 8, 9).</p>
<table class="matrix"><caption>A</caption><tbody><tr><td>1</td><td>4</td><td>7</td></tr><tr><td>2</td><td>5</td><td>8</td></tr><tr><td>3</td><td>6</td><td>9</td></tr></tbody></table>
<p>Step 1: elimination: R2 − 2R1 = (0, −3, −6), R3 − 3R1 = (0, −6, −12), R3 − 2R2 = (0, 0, 0). Only 2 pivots ⇒ dependent (and det A = 0). Step 2: x<sub>3</sub> free = 1: −3x<sub>2</sub> − 6 = 0 ⇒ x<sub>2</sub> = −2; x<sub>1</sub> − 8 + 7 = 0 ⇒ x<sub>1</sub> = 1. So <b>v<sub>1</sub> − 2v<sub>2</sub> + v<sub>3</sub> = 0</b>, i.e. v<sub>3</sub> = 2v<sub>2</sub> − v<sub>1</sub>. Check: (8, 10, 12) − (1, 2, 3) = (7, 8, 9) ✓.</p></div>
<div class="callout"><p><b>Example 2 — independent.</b> (1, 0, 1), (1, 1, 0), (0, 1, 1) as columns: det = 1·(1·1 − 1·0) − 1·(0·1 − 1·1) + 0 = 1 + 1 = 2 ≠ 0 ⇒ <b>independent</b>; they even form a basis of R<sup>3</sup>.</p></div>
<div class="callout"><p><b>Example 3 — no computation.</b> (1, 2), (0, 5), (3, −1) in R<sup>2</sup>: three vectors in R<sup>2</sup> ⇒ dependent.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Checking only pairs: three vectors can be pairwise non-parallel and still dependent (Example 1).</li><li>Using det for a non-square set — use rank instead.</li><li>Concluding “dependent” from the fact that c = 0 is a solution; c = 0 is <em>always</em> a solution. The question is whether it is the <em>only</em> one.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Independent ⇔ only the trivial combination gives 0.</li><li>Test: columns of A independent ⇔ N(A) = {0} ⇔ rank = number of vectors.</li><li>Dependent ⇒ a dependency relation from a nullspace vector.</li><li>Zero vector or more than n vectors in R<sup>n</sup> ⇒ dependent.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/linear-independence.html" target="_blank" rel="noopener">Interactive Linear Algebra — Linear Independence</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-9-independence-basis-and-dimension/" target="_blank" rel="noopener">MIT 18.06 — Lecture 9: Independence, basis, and dimension</a></li><li><a href="https://en.wikipedia.org/wiki/Linear_independence" target="_blank" rel="noopener">Wikipedia — Linear independence</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Are (1, 2) and (3, 6) independent?</li><li>Decide whether (1, 1, 0), (0, 1, 1), (1, 0, −1) are independent; if not, find a relation.</li><li>Can 4 vectors in R<sup>3</sup> be independent? Can 2 vectors in R<sup>3</sup> span R<sup>3</sup>?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) No: (3, 6) = 3(1, 2). 2) det of the columns = 0 ⇒ dependent; indeed (1, 1, 0) − (0, 1, 1) = (1, 0, −1). 3) No (more than 3 vectors in R<sup>3</sup>); no (at most 2 pivots, need 3).</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 6 · Bài 6.1</span>
<h2>Độc lập tuyến tính</h2>
<p class="lead">Một tập vectơ độc lập khi không có vectơ nào thừa — không vectơ nào dựng được từ các vectơ còn lại. Độc lập làm cho việc mô tả một không gian trở nên tiết kiệm, và là nửa đầu của định nghĩa cơ sở.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu định nghĩa độc lập và phụ thuộc tuyến tính.</li><li>Kiểm tra độc lập bằng cách giải Ax = 0, bằng hạng, hoặc (trường hợp vuông) bằng định thức.</li><li>Tìm quan hệ phụ thuộc tường minh khi có.</li><li>Dùng các sự kiện nhanh để kết luận mà không cần tính.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Định nghĩa</span>v<sub>1</sub>, …, v<sub>k</sub> độc lập tuyến tính ⇔ c<sub>1</sub>v<sub>1</sub> + … + c<sub>k</sub>v<sub>k</sub> = 0 chỉ khi c<sub>1</sub> = … = c<sub>k</sub> = 0</div>
<p>Nếu có một tổ hợp không tầm thường bằng 0, các vectơ <strong>phụ thuộc</strong>, và ít nhất một vectơ là tổ hợp của các vectơ còn lại (giải quan hệ theo vectơ có hệ số khác 0).</p>
<p><strong>Phép thử bằng ma trận.</strong> Xếp các vectơ làm cột của A. Quan hệ c<sub>1</sub>v<sub>1</sub> + … + c<sub>k</sub>v<sub>k</sub> = 0 chính là Ac = 0. Vậy:</p>
<div class="formula"><span class="lbl">Phép thử độc lập</span>các cột của A độc lập ⇔ N(A) = {0} ⇔ hạng A = k (cột nào cũng có pivot)    (vuông: ⇔ det A ≠ 0)</div>
<p><strong>Sự kiện nhanh.</strong></p>
<ul><li>Tập chứa vectơ không luôn phụ thuộc (1·0 = 0).</li><li>Hai vectơ phụ thuộc đúng khi một vectơ là bội của vectơ kia.</li><li>Nhiều hơn n vectơ trong R<sup>n</sup> luôn phụ thuộc (tối đa n pivot).</li><li>Bớt vectơ khỏi tập độc lập vẫn độc lập; thêm vectơ vào tập phụ thuộc vẫn phụ thuộc.</li></ul>
<p>Độc lập cũng có nghĩa trong các không gian vectơ khác: các hàm 1, x, x<sup>2</sup> độc lập trong F(R) vì a + bx + cx<sup>2</sup> = 0 với <em>mọi</em> x buộc a = b = c = 0.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — phụ thuộc.</b> v<sub>1</sub> = (1, 2, 3), v<sub>2</sub> = (4, 5, 6), v<sub>3</sub> = (7, 8, 9).</p>
<table class="matrix"><caption>A</caption><tbody><tr><td>1</td><td>4</td><td>7</td></tr><tr><td>2</td><td>5</td><td>8</td></tr><tr><td>3</td><td>6</td><td>9</td></tr></tbody></table>
<p>Bước 1: khử: R2 − 2R1 = (0, −3, −6), R3 − 3R1 = (0, −6, −12), R3 − 2R2 = (0, 0, 0). Chỉ 2 pivot ⇒ phụ thuộc (và det A = 0). Bước 2: x<sub>3</sub> tự do = 1: −3x<sub>2</sub> − 6 = 0 ⇒ x<sub>2</sub> = −2; x<sub>1</sub> − 8 + 7 = 0 ⇒ x<sub>1</sub> = 1. Vậy <b>v<sub>1</sub> − 2v<sub>2</sub> + v<sub>3</sub> = 0</b>, tức v<sub>3</sub> = 2v<sub>2</sub> − v<sub>1</sub>. Kiểm: (8, 10, 12) − (1, 2, 3) = (7, 8, 9) ✓.</p></div>
<div class="callout"><p><b>Ví dụ 2 — độc lập.</b> (1, 0, 1), (1, 1, 0), (0, 1, 1) làm cột: det = 1·(1·1 − 1·0) − 1·(0·1 − 1·1) + 0 = 1 + 1 = 2 ≠ 0 ⇒ <b>độc lập</b>; chúng còn là một cơ sở của R<sup>3</sup>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — không cần tính.</b> (1, 2), (0, 5), (3, −1) trong R<sup>2</sup>: ba vectơ trong R<sup>2</sup> ⇒ phụ thuộc.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chỉ kiểm từng cặp: ba vectơ có thể đôi một không cùng phương mà vẫn phụ thuộc (Ví dụ 1).</li><li>Dùng det cho tập không vuông — hãy dùng hạng.</li><li>Kết luận “phụ thuộc” vì c = 0 là một nghiệm; c = 0 <em>luôn</em> là nghiệm. Câu hỏi là nó có phải nghiệm <em>duy nhất</em> không.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Độc lập ⇔ chỉ tổ hợp tầm thường mới bằng 0.</li><li>Phép thử: các cột của A độc lập ⇔ N(A) = {0} ⇔ hạng = số vectơ.</li><li>Phụ thuộc ⇒ quan hệ phụ thuộc lấy từ một vectơ null.</li><li>Có vectơ không hoặc nhiều hơn n vectơ trong R<sup>n</sup> ⇒ phụ thuộc.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/linear-independence.html" target="_blank" rel="noopener">Interactive Linear Algebra — Độc lập tuyến tính</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-9-independence-basis-and-dimension/" target="_blank" rel="noopener">MIT 18.06 — Bài 9: Độc lập, cơ sở và số chiều</a></li><li><a href="https://en.wikipedia.org/wiki/Linear_independence" target="_blank" rel="noopener">Wikipedia — Linear independence</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>(1, 2) và (3, 6) có độc lập không?</li><li>(1, 1, 0), (0, 1, 1), (1, 0, −1) có độc lập không; nếu không, tìm một quan hệ.</li><li>4 vectơ trong R<sup>3</sup> có thể độc lập không? 2 vectơ trong R<sup>3</sup> có thể sinh ra R<sup>3</sup> không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Không: (3, 6) = 3(1, 2). 2) det các cột = 0 ⇒ phụ thuộc; thật vậy (1, 1, 0) − (0, 1, 1) = (1, 0, −1). 3) Không (hơn 3 vectơ trong R<sup>3</sup>); không (tối đa 2 pivot, cần 3).</p></div>`);

const c62 = L('maa102-ts-6-2',
  '6.2 — Basis, dimension and coordinates|||6.2 — Cơ sở, số chiều và toạ độ',
  'Cơ sở = độc lập + sinh, cơ sở chính tắc, số chiều của Rⁿ, Pₙ, M₂ₓ₂, mặt phẳng; toạ độ của vectơ theo một cơ sở, ma trận đổi cơ sở, vì sao nén ảnh là chọn cơ sở tốt.',
  `<span class="eyebrow">MAA102 · Chapter 6 · Lesson 6.2</span>
<h2>Basis, dimension and coordinates</h2>
<p class="lead">A <strong>basis</strong> is a minimal set of building blocks for a space: enough vectors to build everything, and no redundant ones. The number of building blocks is the space's <strong>dimension</strong> — and changing the basis is how compression and many AI tricks work.</p>
<h3>🎯 Objectives</h3>
<ul><li>Decide whether a set is a basis.</li><li>Find a basis and the dimension of common subspaces.</li><li>Compute coordinates of a vector relative to a basis.</li><li>Use the change-of-basis matrix.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Basis</span>a basis of V = a set of vectors that is (1) linearly independent and (2) spans V</div>
<p>The <strong>standard basis</strong> of R<sup>n</sup> is e<sub>1</sub> = (1, 0, …, 0), …, e<sub>n</sub> = (0, …, 0, 1). A space has infinitely many bases, but <strong>all bases have the same number of vectors</strong>; that number is the <strong>dimension</strong> dim V.</p>
<ul><li>dim R<sup>n</sup> = n; dim P<sub>2</sub> = 3 (basis 1, x, x<sup>2</sup>); dim M<sub>2×2</sub> = 4; symmetric 2×2 matrices: 3; {0}: 0.</li><li>In an n-dimensional space, n independent vectors automatically span, and n spanning vectors are automatically independent — you only need to check one condition.</li></ul>
<p><strong>Coordinates.</strong> If B = {b<sub>1</sub>, …, b<sub>n</sub>} is a basis, every x can be written <em>in exactly one way</em> as x = c<sub>1</sub>b<sub>1</sub> + … + c<sub>n</sub>b<sub>n</sub> (uniqueness comes from independence). The numbers [x]<sub>B</sub> = (c<sub>1</sub>, …, c<sub>n</sub>) are the coordinates of x in basis B. With P<sub>B</sub> = [b<sub>1</sub> … b<sub>n</sub>] (basis vectors as columns):</p>
<div class="formula"><span class="lbl">Change of basis</span>x = P<sub>B</sub> [x]<sub>B</sub>    [x]<sub>B</sub> = P<sub>B</sub><sup>−1</sup> x</div>
<p><strong>Why it matters.</strong> The same vector can look complicated in one basis and simple in another. JPEG stores an 8×8 block of pixels in a cosine basis (the DCT) where most coordinates are nearly 0 and can be dropped; PCA (Chapter 10) finds the basis in which data varies along the first few axes; eigenvectors (Chapter 8) are the basis in which a matrix becomes diagonal.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — coordinates.</b> B: b<sub>1</sub> = (1, 1), b<sub>2</sub> = (1, −1). Find [x]<sub>B</sub> for x = (5, 1).</p>
<p>Solve c<sub>1</sub> + c<sub>2</sub> = 5, c<sub>1</sub> − c<sub>2</sub> = 1 ⇒ c<sub>1</sub> = 3, c<sub>2</sub> = 2. So [x]<sub>B</sub> = <b>(3, 2)</b>: 3(1, 1) + 2(1, −1) = (5, 1) ✓.</p></div>
<div class="callout"><p><b>Example 2 — basis of a plane.</b> W = {x + y − z = 0}. Solve for z = x + y with x, y free: (x, y, x + y) = x(1, 0, 1) + y(0, 1, 1). The vectors (1, 0, 1), (0, 1, 1) span W and are independent (not parallel): a basis, <b>dim W = 2</b>.</p></div>
<div class="callout"><p><b>Example 3 — is it a basis of R<sup>3</sup>?</b> (1, 0, 1), (1, 1, 0), (0, 1, 1): three vectors in a 3-dimensional space with det 2 ≠ 0 (Lesson 6.1) ⇒ independent ⇒ basis.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Saying “the basis” — a space has many bases; only the dimension is unique.</li><li>Confusing the dimension of a subspace with the size of its vectors: a plane in R<sup>3</sup> has vectors with 3 components but dimension 2.</li><li>Forgetting to check independence: (1, 0), (0, 1), (1, 1) spans R<sup>2</sup> but is not a basis.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Basis = independent + spanning; every vector has unique coordinates.</li><li>Dimension = number of basis vectors (same for every basis).</li><li>[x]<sub>B</sub> = P<sub>B</sub><sup>−1</sup>x; x = P<sub>B</sub>[x]<sub>B</sub>.</li><li>Good bases make data simple: DCT in JPEG, principal components, eigenvectors.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/dimension.html" target="_blank" rel="noopener">Interactive Linear Algebra — Basis and Dimension</a></li><li><a href="https://textbooks.math.gatech.edu/ila/bases-as-coord-systems.html" target="_blank" rel="noopener">Interactive Linear Algebra — Bases as Coordinate Systems</a></li><li><a href="https://www.3blue1brown.com/lessons/change-of-basis" target="_blank" rel="noopener">3Blue1Brown — Change of basis</a></li><li><a href="https://en.wikipedia.org/wiki/Basis_(linear_algebra)" target="_blank" rel="noopener">Wikipedia — Basis (linear algebra)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find a basis and the dimension of {(x, y, z) : x − 2y + z = 0}.</li><li>Find the coordinates of (3, 7) in the basis (1, 2), (0, 1).</li><li>What is the dimension of P<sub>3</sub>? Give a basis.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) x = 2y − z: (2y − z, y, z) = y(2, 1, 0) + z(−1, 0, 1); basis (2, 1, 0), (−1, 0, 1); dim 2. 2) c<sub>1</sub> = 3, 2·3 + c<sub>2</sub> = 7 ⇒ c<sub>2</sub> = 1: (3, 1). 3) dim 4; basis 1, x, x<sup>2</sup>, x<sup>3</sup>.</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 6 · Bài 6.2</span>
<h2>Cơ sở, số chiều và toạ độ</h2>
<p class="lead"><strong>Cơ sở</strong> là bộ “viên gạch” tối thiểu của một không gian: đủ vectơ để dựng mọi thứ, và không có vectơ thừa. Số viên gạch là <strong>số chiều</strong> của không gian — và đổi cơ sở là cách nén dữ liệu cùng nhiều mẹo AI hoạt động.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Quyết định một tập có phải cơ sở không.</li><li>Tìm cơ sở và số chiều của các không gian con hay gặp.</li><li>Tính toạ độ của một vectơ theo một cơ sở.</li><li>Dùng ma trận đổi cơ sở.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Cơ sở</span>cơ sở của V = tập vectơ (1) độc lập tuyến tính và (2) sinh ra V</div>
<p><strong>Cơ sở chính tắc</strong> của R<sup>n</sup> là e<sub>1</sub> = (1, 0, …, 0), …, e<sub>n</sub> = (0, …, 0, 1). Một không gian có vô số cơ sở, nhưng <strong>mọi cơ sở có cùng số vectơ</strong>; con số đó là <strong>số chiều</strong> dim V.</p>
<ul><li>dim R<sup>n</sup> = n; dim P<sub>2</sub> = 3 (cơ sở 1, x, x<sup>2</sup>); dim M<sub>2×2</sub> = 4; ma trận đối xứng 2×2: 3; {0}: 0.</li><li>Trong không gian n chiều, n vectơ độc lập tự động sinh ra không gian, và n vectơ sinh ra không gian tự động độc lập — chỉ cần kiểm một điều kiện.</li></ul>
<p><strong>Toạ độ.</strong> Nếu B = {b<sub>1</sub>, …, b<sub>n</sub>} là cơ sở, mọi x viết được <em>theo đúng một cách</em> x = c<sub>1</sub>b<sub>1</sub> + … + c<sub>n</sub>b<sub>n</sub> (duy nhất nhờ tính độc lập). Các số [x]<sub>B</sub> = (c<sub>1</sub>, …, c<sub>n</sub>) là toạ độ của x theo cơ sở B. Với P<sub>B</sub> = [b<sub>1</sub> … b<sub>n</sub>] (các vectơ cơ sở làm cột):</p>
<div class="formula"><span class="lbl">Đổi cơ sở</span>x = P<sub>B</sub> [x]<sub>B</sub>    [x]<sub>B</sub> = P<sub>B</sub><sup>−1</sup> x</div>
<p><strong>Vì sao quan trọng.</strong> Cùng một vectơ có thể trông phức tạp ở cơ sở này mà đơn giản ở cơ sở khác. JPEG lưu một khối 8×8 điểm ảnh theo cơ sở cosin (DCT), ở đó hầu hết toạ độ gần 0 và bỏ đi được; PCA (Chương 10) tìm cơ sở mà dữ liệu biến thiên chủ yếu theo vài trục đầu; vectơ riêng (Chương 8) là cơ sở làm ma trận trở thành chéo.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — toạ độ.</b> B: b<sub>1</sub> = (1, 1), b<sub>2</sub> = (1, −1). Tìm [x]<sub>B</sub> với x = (5, 1).</p>
<p>Giải c<sub>1</sub> + c<sub>2</sub> = 5, c<sub>1</sub> − c<sub>2</sub> = 1 ⇒ c<sub>1</sub> = 3, c<sub>2</sub> = 2. Vậy [x]<sub>B</sub> = <b>(3, 2)</b>: 3(1, 1) + 2(1, −1) = (5, 1) ✓.</p></div>
<div class="callout"><p><b>Ví dụ 2 — cơ sở của một mặt phẳng.</b> W = {x + y − z = 0}. Giải z = x + y với x, y tự do: (x, y, x + y) = x(1, 0, 1) + y(0, 1, 1). Hai vectơ (1, 0, 1), (0, 1, 1) sinh ra W và độc lập (không cùng phương): là cơ sở, <b>dim W = 2</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — có phải cơ sở của R<sup>3</sup>?</b> (1, 0, 1), (1, 1, 0), (0, 1, 1): ba vectơ trong không gian 3 chiều với det 2 ≠ 0 (Bài 6.1) ⇒ độc lập ⇒ cơ sở.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nói “cơ sở” như thể chỉ có một — không gian có nhiều cơ sở; chỉ số chiều là duy nhất.</li><li>Nhầm số chiều của không gian con với số thành phần của vectơ: mặt phẳng trong R<sup>3</sup> có vectơ 3 thành phần nhưng số chiều 2.</li><li>Quên kiểm độc lập: (1, 0), (0, 1), (1, 1) sinh ra R<sup>2</sup> nhưng không phải cơ sở.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Cơ sở = độc lập + sinh; mọi vectơ có toạ độ duy nhất.</li><li>Số chiều = số vectơ cơ sở (như nhau với mọi cơ sở).</li><li>[x]<sub>B</sub> = P<sub>B</sub><sup>−1</sup>x; x = P<sub>B</sub>[x]<sub>B</sub>.</li><li>Cơ sở tốt làm dữ liệu đơn giản: DCT trong JPEG, thành phần chính, vectơ riêng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/dimension.html" target="_blank" rel="noopener">Interactive Linear Algebra — Cơ sở và số chiều</a></li><li><a href="https://textbooks.math.gatech.edu/ila/bases-as-coord-systems.html" target="_blank" rel="noopener">Interactive Linear Algebra — Cơ sở như hệ toạ độ</a></li><li><a href="https://www.3blue1brown.com/lessons/change-of-basis" target="_blank" rel="noopener">3Blue1Brown — Đổi cơ sở</a></li><li><a href="https://en.wikipedia.org/wiki/Basis_(linear_algebra)" target="_blank" rel="noopener">Wikipedia — Basis (linear algebra)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm một cơ sở và số chiều của {(x, y, z) : x − 2y + z = 0}.</li><li>Tìm toạ độ của (3, 7) theo cơ sở (1, 2), (0, 1).</li><li>Số chiều của P<sub>3</sub> là bao nhiêu? Cho một cơ sở.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) x = 2y − z: (2y − z, y, z) = y(2, 1, 0) + z(−1, 0, 1); cơ sở (2, 1, 0), (−1, 0, 1); dim 2. 2) c<sub>1</sub> = 3, 2·3 + c<sub>2</sub> = 7 ⇒ c<sub>2</sub> = 1: (3, 1). 3) dim 4; cơ sở 1, x, x<sup>2</sup>, x<sup>3</sup>.</p></div>`);

const c63 = L('maa102-ts-6-3',
  '6.3 — Rank, rank–nullity and the four fundamental subspaces|||6.3 — Hạng, định lý hạng–số chiều hạt nhân và bốn không gian con cơ bản',
  'Hạng của ma trận, bốn không gian con C(A), C(Aᵀ), N(A), N(Aᵀ) với số chiều r, r, n − r, m − r, quan hệ vuông góc, định lý rank–nullity, ma trận hạng một uvᵀ, xấp xỉ hạng thấp trong hệ gợi ý — có code NumPy/SciPy.',
  `<span class="eyebrow">MAA102 · Chapter 6 · Lesson 6.3</span>
<h2>Rank, rank–nullity and the four fundamental subspaces</h2>
<p class="lead">Strang calls this “the fundamental theorem of linear algebra”: every m×n matrix has four subspaces, their dimensions are fixed by one number — the rank r — and they fit together at right angles.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define the rank and compute it.</li><li>Find bases of C(A), C(A<sup>T</sup>), N(A), N(A<sup>T</sup>) and state their dimensions.</li><li>Apply the rank–nullity theorem.</li><li>Explain orthogonality of the subspaces and rank-one matrices.</li></ul>
<h3>📖 Lecture</h3>
<p>The <strong>rank</strong> r of A is the number of pivots = dim C(A) = number of independent columns = number of independent rows. The four fundamental subspaces of an m×n matrix A:</p>
<ul><li><strong>Column space</strong> C(A) ⊂ R<sup>m</sup>, dimension r. Basis: the pivot columns of A.</li><li><strong>Row space</strong> C(A<sup>T</sup>) ⊂ R<sup>n</sup>, dimension r. Basis: the non-zero rows of the RREF.</li><li><strong>Nullspace</strong> N(A) ⊂ R<sup>n</sup>, dimension n − r. Basis: the special solutions.</li><li><strong>Left nullspace</strong> N(A<sup>T</sup>) ⊂ R<sup>m</sup>, dimension m − r: all y with A<sup>T</sup>y = 0, i.e. y<sup>T</sup>A = 0 — the combinations of rows that give the zero row.</li></ul>
<div class="formula"><span class="lbl">Rank–nullity</span>dim C(A) + dim N(A) = r + (n − r) = n  (number of columns)</div>
<p><strong>Orthogonality.</strong> If Ax = 0, then every row of A has dot product 0 with x: the nullspace is perpendicular to the row space. Likewise the left nullspace is perpendicular to the column space. In R<sup>n</sup>, row space and nullspace are <strong>orthogonal complements</strong>: their dimensions r and n − r add up to n.</p>
<p><strong>Rank one.</strong> A matrix uv<sup>T</sup> (column times row) has rank 1: every column is a multiple of u. Every rank-r matrix is a sum of r rank-one matrices. Recommender systems (the Netflix-prize approach) assume the huge users × movies rating matrix is close to <em>low rank</em> — a few “taste” factors explain most ratings — and fill in missing entries from that structure.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>All four subspaces.</b></p>
<table class="matrix"><caption>A</caption><tbody><tr><td>1</td><td>2</td><td>1</td></tr><tr><td>2</td><td>4</td><td>3</td></tr><tr><td>3</td><td>6</td><td>4</td></tr></tbody></table>
<p>Step 1: R2 − 2R1 = (0, 0, 1); R3 − 3R1 = (0, 0, 1); R3 − R2 = 0; R1 − R2 = (1, 2, 0). RREF = [[1, 2, 0], [0, 0, 1], [0, 0, 0]], pivots in columns 1 and 3 ⇒ <b>r = 2</b>.</p>
<p>Step 2: C(A): basis (1, 2, 3), (1, 3, 4) — columns 1 and 3 of the <em>original</em> A. Row space: basis (1, 2, 0), (0, 0, 1).</p>
<p>Step 3: N(A): x<sub>2</sub> free, x<sub>1</sub> = −2x<sub>2</sub>, x<sub>3</sub> = 0 ⇒ basis (−2, 1, 0); dimension 3 − 2 = 1.</p>
<p>Step 4: N(A<sup>T</sup>): row 1 + row 2 = row 3, so y = (1, 1, −1); dimension 3 − 2 = 1.</p>
<p>Checks: (1, 2, 1)·(−2, 1, 0) = 0 and (2, 4, 3)·(−2, 1, 0) = 0 (nullspace ⟂ rows) ✓; (1, 1, −1)·(1, 2, 3) = 0 and (1, 1, −1)·(1, 3, 4) = 0 (left nullspace ⟂ columns) ✓.</p></div>
<pre><code class="language-python">import numpy as np
from scipy.linalg import null_space
A = np.array([[1, 2, 1],
              [2, 4, 3],
              [3, 6, 4]], dtype=float)
r = np.linalg.matrix_rank(A)
print("rank:", r, " nullity:", A.shape[1] - r)
N = null_space(A)               # orthonormal basis of N(A)
print(N.round(4))
print(np.allclose(A @ N, 0))</code></pre>
<div class="out">rank: 2  nullity: 1<br>[[ 0.8944]<br> [-0.4472]<br> [-0.    ]]<br>True</div>
<p>SciPy returns a <em>unit</em> vector: (0.8944, −0.4472, 0) = −(−2, 1, 0)/√5, the same line.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using rows of the RREF as a basis of the <em>column</em> space (they span the row space).</li><li>Mixing n and m in rank–nullity: dim N(A) = n − r where n is the number of <em>columns</em>.</li><li>Thinking rank depends on whether you count rows or columns — row rank always equals column rank.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Rank r = number of pivots = independent columns = independent rows.</li><li>Dimensions: C(A) r, C(A<sup>T</sup>) r, N(A) n − r, N(A<sup>T</sup>) m − r.</li><li>N(A) ⟂ row space; N(A<sup>T</sup>) ⟂ column space.</li><li>uv<sup>T</sup> has rank 1; low-rank structure powers recommender systems.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-10-the-four-fundamental-subspaces/" target="_blank" rel="noopener">MIT 18.06 — Lecture 10: The four fundamental subspaces</a></li><li><a href="https://textbooks.math.gatech.edu/ila/rank-thm.html" target="_blank" rel="noopener">Interactive Linear Algebra — The Rank Theorem</a></li><li><a href="https://en.wikipedia.org/wiki/Rank%E2%80%93nullity_theorem" target="_blank" rel="noopener">Wikipedia — Rank–nullity theorem</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.linalg.null_space.html" target="_blank" rel="noopener">SciPy — scipy.linalg.null_space</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A is 4×7 with rank 3. Give the dimensions of the four subspaces.</li><li>Write u v<sup>T</sup> for u = (1, 2), v = (3, 1, 0). What is its rank?</li><li>A is 5×5 and dim N(A) = 2. What is the rank? Is A invertible?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) C(A): 3, row space: 3, N(A): 7 − 3 = 4, N(A<sup>T</sup>): 4 − 3 = 1. 2) [[3, 1, 0], [6, 2, 0]], rank 1. 3) r = 5 − 2 = 3; not invertible (needs r = 5).</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 6 · Bài 6.3</span>
<h2>Hạng, định lý hạng–số chiều hạt nhân và bốn không gian con cơ bản</h2>
<p class="lead">Strang gọi đây là “định lý cơ bản của đại số tuyến tính”: mọi ma trận m×n có bốn không gian con, số chiều của chúng được quyết định bởi một con số — hạng r — và chúng ghép với nhau theo góc vuông.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa hạng và tính hạng.</li><li>Tìm cơ sở của C(A), C(A<sup>T</sup>), N(A), N(A<sup>T</sup>) và nêu số chiều.</li><li>Áp dụng định lý hạng–số chiều hạt nhân (rank–nullity).</li><li>Giải thích tính vuông góc giữa các không gian con và ma trận hạng một.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Hạng</strong> r của A là số pivot = dim C(A) = số cột độc lập = số hàng độc lập. Bốn không gian con cơ bản của ma trận m×n A:</p>
<ul><li><strong>Không gian cột</strong> C(A) ⊂ R<sup>m</sup>, số chiều r. Cơ sở: các cột pivot của A.</li><li><strong>Không gian hàng</strong> C(A<sup>T</sup>) ⊂ R<sup>n</sup>, số chiều r. Cơ sở: các hàng khác 0 của RREF.</li><li><strong>Không gian null</strong> N(A) ⊂ R<sup>n</sup>, số chiều n − r. Cơ sở: các nghiệm đặc biệt.</li><li><strong>Không gian null trái</strong> N(A<sup>T</sup>) ⊂ R<sup>m</sup>, số chiều m − r: mọi y với A<sup>T</sup>y = 0, tức y<sup>T</sup>A = 0 — các tổ hợp hàng cho ra hàng 0.</li></ul>
<div class="formula"><span class="lbl">Rank–nullity</span>dim C(A) + dim N(A) = r + (n − r) = n  (số cột)</div>
<p><strong>Tính vuông góc.</strong> Nếu Ax = 0 thì mọi hàng của A có tích vô hướng 0 với x: không gian null vuông góc với không gian hàng. Tương tự, không gian null trái vuông góc với không gian cột. Trong R<sup>n</sup>, không gian hàng và không gian null là <strong>phần bù trực giao</strong> của nhau: số chiều r và n − r cộng lại bằng n.</p>
<p><strong>Hạng một.</strong> Ma trận uv<sup>T</sup> (cột nhân hàng) có hạng 1: mọi cột là bội của u. Mọi ma trận hạng r là tổng của r ma trận hạng một. Hệ gợi ý (hướng tiếp cận của giải Netflix) giả định ma trận đánh giá người dùng × phim khổng lồ gần với <em>hạng thấp</em> — vài “yếu tố sở thích” giải thích phần lớn đánh giá — và điền các ô thiếu nhờ cấu trúc đó.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Đủ bốn không gian con.</b></p>
<table class="matrix"><caption>A</caption><tbody><tr><td>1</td><td>2</td><td>1</td></tr><tr><td>2</td><td>4</td><td>3</td></tr><tr><td>3</td><td>6</td><td>4</td></tr></tbody></table>
<p>Bước 1: R2 − 2R1 = (0, 0, 1); R3 − 3R1 = (0, 0, 1); R3 − R2 = 0; R1 − R2 = (1, 2, 0). RREF = [[1, 2, 0], [0, 0, 1], [0, 0, 0]], pivot ở cột 1 và 3 ⇒ <b>r = 2</b>.</p>
<p>Bước 2: C(A): cơ sở (1, 2, 3), (1, 3, 4) — cột 1 và 3 của A <em>ban đầu</em>. Không gian hàng: cơ sở (1, 2, 0), (0, 0, 1).</p>
<p>Bước 3: N(A): x<sub>2</sub> tự do, x<sub>1</sub> = −2x<sub>2</sub>, x<sub>3</sub> = 0 ⇒ cơ sở (−2, 1, 0); số chiều 3 − 2 = 1.</p>
<p>Bước 4: N(A<sup>T</sup>): hàng 1 + hàng 2 = hàng 3, nên y = (1, 1, −1); số chiều 3 − 2 = 1.</p>
<p>Kiểm: (1, 2, 1)·(−2, 1, 0) = 0 và (2, 4, 3)·(−2, 1, 0) = 0 (null ⟂ các hàng) ✓; (1, 1, −1)·(1, 2, 3) = 0 và (1, 1, −1)·(1, 3, 4) = 0 (null trái ⟂ các cột) ✓.</p></div>
<pre><code class="language-python">import numpy as np
from scipy.linalg import null_space
A = np.array([[1, 2, 1],
              [2, 4, 3],
              [3, 6, 4]], dtype=float)
r = np.linalg.matrix_rank(A)
print("rank:", r, " nullity:", A.shape[1] - r)
N = null_space(A)               # orthonormal basis of N(A)
print(N.round(4))
print(np.allclose(A @ N, 0))</code></pre>
<div class="out">rank: 2  nullity: 1<br>[[ 0.8944]<br> [-0.4472]<br> [-0.    ]]<br>True</div>
<p>SciPy trả về vectơ <em>đơn vị</em>: (0,8944; −0,4472; 0) = −(−2, 1, 0)/√5, cùng một đường thẳng.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng các hàng của RREF làm cơ sở của không gian <em>cột</em> (chúng sinh ra không gian hàng).</li><li>Lẫn n và m trong rank–nullity: dim N(A) = n − r với n là số <em>cột</em>.</li><li>Nghĩ hạng phụ thuộc việc đếm hàng hay đếm cột — hạng hàng luôn bằng hạng cột.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Hạng r = số pivot = số cột độc lập = số hàng độc lập.</li><li>Số chiều: C(A) r, C(A<sup>T</sup>) r, N(A) n − r, N(A<sup>T</sup>) m − r.</li><li>N(A) ⟂ không gian hàng; N(A<sup>T</sup>) ⟂ không gian cột.</li><li>uv<sup>T</sup> có hạng 1; cấu trúc hạng thấp là nền của hệ gợi ý.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-10-the-four-fundamental-subspaces/" target="_blank" rel="noopener">MIT 18.06 — Bài 10: Bốn không gian con cơ bản</a></li><li><a href="https://textbooks.math.gatech.edu/ila/rank-thm.html" target="_blank" rel="noopener">Interactive Linear Algebra — Định lý hạng</a></li><li><a href="https://en.wikipedia.org/wiki/Rank%E2%80%93nullity_theorem" target="_blank" rel="noopener">Wikipedia — Rank–nullity theorem</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.linalg.null_space.html" target="_blank" rel="noopener">SciPy — scipy.linalg.null_space</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>A cỡ 4×7 có hạng 3. Nêu số chiều của bốn không gian con.</li><li>Viết u v<sup>T</sup> với u = (1, 2), v = (3, 1, 0). Hạng của nó là bao nhiêu?</li><li>A cỡ 5×5 và dim N(A) = 2. Hạng bằng bao nhiêu? A có khả nghịch không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) C(A): 3, không gian hàng: 3, N(A): 7 − 3 = 4, N(A<sup>T</sup>): 4 − 3 = 1. 2) [[3, 1, 0], [6, 2, 0]], hạng 1. 3) r = 5 − 2 = 3; không khả nghịch (cần r = 5).</p></div>`);

const q6 = QZ(6, 'Quiz — Chapter 6: Independence, basis, dimension, rank|||Quiz — Chương 6: Độc lập, cơ sở, số chiều, hạng', 'Kiểm tra chương 6: độc lập tuyến tính, cơ sở, số chiều, toạ độ, hạng, rank–nullity, bốn không gian con.', [
  Q('q1', 'The vectors (1, 2, 3), (4, 5, 6), (7, 8, 9) are|||Ba vectơ (1, 2, 3), (4, 5, 6), (7, 8, 9)',
    ['independent|||độc lập', 'dependent: v₃ = 2v₂ − v₁|||phụ thuộc: v₃ = 2v₂ − v₁', 'orthogonal|||trực giao', 'a basis of R³|||một cơ sở của R³'], 1,
    '2(4, 5, 6) − (1, 2, 3) = (7, 8, 9).|||2(4, 5, 6) − (1, 2, 3) = (7, 8, 9).'),
  Q('q2', 'Any 4 vectors in R³ are|||4 vectơ bất kỳ trong R³',
    ['independent|||độc lập', 'dependent|||phụ thuộc', 'a basis|||là một cơ sở', 'orthogonal|||trực giao'], 1,
    'At most 3 pivots for 4 columns.|||Tối đa 3 pivot cho 4 cột.'),
  Q('q3', 'The dimension of the plane x + y − z = 0 in R³ is|||Số chiều của mặt phẳng x + y − z = 0 trong R³ là',
    ['1|||1', '2|||2', '3|||3', '0|||0'], 1,
    'Basis (1, 0, 1), (0, 1, 1).|||Cơ sở (1, 0, 1), (0, 1, 1).'),
  Q('q4', 'The coordinates of (5, 1) in the basis (1, 1), (1, −1) are|||Toạ độ của (5, 1) theo cơ sở (1, 1), (1, −1) là',
    ['(5, 1)|||(5, 1)', '(3, 2)|||(3, 2)', '(2, 3)|||(2, 3)', '(6, 4)|||(6, 4)'], 1,
    '3(1, 1) + 2(1, −1) = (5, 1).|||3(1, 1) + 2(1, −1) = (5, 1).'),
  Q('q5', 'dim P₂ (polynomials of degree ≤ 2) =|||dim P₂ (đa thức bậc ≤ 2) =',
    ['2|||2', '3|||3', '4|||4', 'infinite|||vô hạn'], 1,
    'Basis 1, x, x².|||Cơ sở 1, x, x².'),
  Q('q6', 'A is 3×5 with rank 2. dim N(A) =|||A cỡ 3×5 có hạng 2. dim N(A) =',
    ['1|||1', '2|||2', '3|||3', '5|||5'], 2,
    'n − r = 5 − 2.|||n − r = 5 − 2.'),
  Q('q7', 'The nullspace N(A) is orthogonal to|||Không gian null N(A) vuông góc với',
    ['the column space|||không gian cột', 'the row space|||không gian hàng', 'the left nullspace|||không gian null trái', 'nothing in particular|||không gì cả'], 1,
    'Ax = 0 means every row · x = 0.|||Ax = 0 nghĩa là mọi hàng · x = 0.'),
  Q('q8', 'For an m×n matrix of rank r, dim N(Aᵀ) =|||Với ma trận m×n hạng r, dim N(Aᵀ) =',
    ['n − r|||n − r', 'm − r|||m − r', 'r|||r', 'm + n − r|||m + n − r'], 1,
    'Aᵀ is n×m with rank r; its nullspace lives in Rᵐ.|||Aᵀ cỡ n×m hạng r; không gian null của nó nằm trong Rᵐ.'),
  Q('q9', 'The rank of a non-zero matrix uvᵀ is|||Hạng của ma trận khác 0 dạng uvᵀ là',
    ['0|||0', '1|||1', '2|||2', 'min(m, n)|||min(m, n)'], 1,
    'Every column is a multiple of u.|||Mọi cột là bội của u.'),
]);

const ch6 = {
  title: 'Chapter 6 — Independence, basis, dimension and rank|||Chương 6 — Độc lập tuyến tính, cơ sở, số chiều và hạng',
  description: 'Độc lập tuyến tính, cơ sở, số chiều, toạ độ và đổi cơ sở, hạng, định lý rank–nullity, bốn không gian con cơ bản và tính vuông góc, ma trận hạng một (Strang 3.4–3.5 · MIT 18.06 bài 9–10).',
  lessons: [c61, c62, c63, q6],
};


// ───────────────────────────── Chương 7 — Ánh xạ tuyến tính ─────────────────────────────
const c71 = L('maa102-ts-7-1',
  '7.1 — Linear transformations and their matrices|||7.1 — Ánh xạ tuyến tính và ma trận của nó',
  'Định nghĩa ánh xạ tuyến tính T(u + v) = T(u) + T(v), T(cv) = cT(v); ma trận chuẩn có cột là T(eⱼ); ví dụ và phản ví dụ (tịnh tiến, tích xy); phép lấy đạo hàm trên P₃ là một ma trận.',
  `<span class="eyebrow">MAA102 · Chapter 7 · Lesson 7.1</span>
<h2>Linear transformations and their matrices</h2>
<p class="lead">So far a matrix was a table of numbers. Now we see what it really is: a <strong>linear transformation</strong> — a rule that moves every vector, keeps grid lines parallel and evenly spaced, and keeps the origin fixed. Every such rule between R<sup>n</sup> and R<sup>m</sup> <em>is</em> a matrix.</p>
<h3>🎯 Objectives</h3>
<ul><li>State and check the two linearity conditions.</li><li>Build the standard matrix of T from the images of the basis vectors.</li><li>Recognise maps that are not linear.</li><li>Represent a linear map between other vector spaces (polynomials) by a matrix.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Linearity</span>T(u + v) = T(u) + T(v)    T(cv) = c T(v)    (together: T(cu + dv) = cT(u) + dT(v))</div>
<p>Consequences: T(0) = 0, and T sends lines to lines (or to a point). Every matrix gives a linear map x ↦ Ax, because A(cu + dv) = cAu + dAv.</p>
<p><strong>The converse is the key theorem.</strong> If T: R<sup>n</sup> → R<sup>m</sup> is linear, write x = x<sub>1</sub>e<sub>1</sub> + … + x<sub>n</sub>e<sub>n</sub>. Linearity gives T(x) = x<sub>1</sub>T(e<sub>1</sub>) + … + x<sub>n</sub>T(e<sub>n</sub>) — a combination of the vectors T(e<sub>j</sub>), i.e. a matrix times x:</p>
<div class="formula"><span class="lbl">Standard matrix</span>A = [ T(e<sub>1</sub>)  T(e<sub>2</sub>)  …  T(e<sub>n</sub>) ]  (column j = image of the j-th basis vector)   T(x) = Ax</div>
<p>So a linear map is completely determined by what it does to a basis. 3Blue1Brown's slogan: “the columns of a matrix tell you where the basis vectors land.”</p>
<p><strong>Beyond R<sup>n</sup>.</strong> Differentiation D(p) = p′ is linear on polynomials: (p + q)′ = p′ + q′ and (cp)′ = cp′. In the basis 1, x, x<sup>2</sup>, x<sup>3</sup> of P<sub>3</sub> and 1, x, x<sup>2</sup> of P<sub>2</sub>, D(1) = 0, D(x) = 1, D(x<sup>2</sup>) = 2x, D(x<sup>3</sup>) = 3x<sup>2</sup>, so its matrix is 3×4:</p>
<table class="matrix"><caption>D</caption><tbody><tr><td>0</td><td>1</td><td>0</td><td>0</td></tr><tr><td>0</td><td>0</td><td>2</td><td>0</td></tr><tr><td>0</td><td>0</td><td>0</td><td>3</td></tr></tbody></table>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — standard matrix.</b> T(x, y) = (x + 2y, 3x, y − x). Then T(e<sub>1</sub>) = T(1, 0) = (1, 3, −1) and T(e<sub>2</sub>) = T(0, 1) = (2, 0, 1):</p>
<table class="matrix"><caption>A</caption><tbody><tr><td>1</td><td>2</td></tr><tr><td>3</td><td>0</td></tr><tr><td>−1</td><td>1</td></tr></tbody></table>
<p>Check at (2, 1): A(2, 1) = 2(1, 3, −1) + (2, 0, 1) = (4, 6, −1), and directly T(2, 1) = (2 + 2, 6, 1 − 2) = (4, 6, −1) ✓.</p></div>
<div class="callout"><p><b>Example 2 — derivative as a matrix.</b> p(x) = 2 + 3x − x<sup>2</sup> + 4x<sup>3</sup> has coordinates (2, 3, −1, 4). D·(2, 3, −1, 4) = (3, −2, 12), i.e. p′(x) = 3 − 2x + 12x<sup>2</sup> ✓.</p></div>
<div class="callout"><p><b>Example 3 — not linear.</b> Translation T(x) = x + (1, 0) moves the origin: T(0) ≠ 0. T(x, y) = (xy, x) fails scaling: T(2, 2) = (4, 2) but 2T(1, 1) = (2, 2). T(x) = |x| fails additivity: |1 + (−1)| ≠ |1| + |−1|.</p></div>
<div class="note-ct"><p><strong>AI view.</strong> A neural network alternates linear maps (matrices W) with non-linear activations (ReLU, GELU). Without the activations the whole network would collapse into a single matrix product — one linear map — no matter how many layers it had.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Putting T(e<sub>j</sub>) as <em>rows</em> instead of columns.</li><li>Calling y = mx + b with b ≠ 0 “linear”: in linear algebra it is <em>affine</em>, not linear.</li><li>Checking linearity at one pair of vectors only; a proof needs arbitrary u, v, c.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Linear ⇔ T(cu + dv) = cT(u) + dT(v); then T(0) = 0.</li><li>Every linear T: R<sup>n</sup> → R<sup>m</sup> is T(x) = Ax with columns T(e<sub>j</sub>).</li><li>A linear map is fixed by its values on a basis.</li><li>Translation, products and absolute values are not linear.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/linear-transformations" target="_blank" rel="noopener">3Blue1Brown — Linear transformations and matrices</a></li><li><a href="https://textbooks.math.gatech.edu/ila/linear-transformations.html" target="_blank" rel="noopener">Interactive Linear Algebra — Linear Transformations</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-30-linear-transformations-and-their-matrices/" target="_blank" rel="noopener">MIT 18.06 — Lecture 30: Linear transformations and their matrices</a></li><li><a href="https://en.wikipedia.org/wiki/Linear_map" target="_blank" rel="noopener">Wikipedia — Linear map</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Is T(x, y) = (2x, x − y) linear? If so, give its matrix.</li><li>Show that T(x, y) = (x<sup>2</sup>, y) is not linear.</li><li>T: R<sup>2</sup> → R<sup>2</sup> is linear with T(e<sub>1</sub>) = (1, 3) and T(e<sub>2</sub>) = (−2, 0). Find T(4, 1).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Yes: A = [[2, 0], [1, −1]]. 2) T(2, 0) = (4, 0) but 2T(1, 0) = (2, 0). 3) 4(1, 3) + 1(−2, 0) = (2, 12).</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 7 · Bài 7.1</span>
<h2>Ánh xạ tuyến tính và ma trận của nó</h2>
<p class="lead">Đến giờ ma trận là một bảng số. Giờ ta thấy bản chất của nó: một <strong>ánh xạ tuyến tính</strong> — quy tắc di chuyển mọi vectơ, giữ các đường lưới song song và cách đều, và giữ gốc toạ độ đứng yên. Mọi quy tắc như vậy giữa R<sup>n</sup> và R<sup>m</sup> <em>đều là</em> một ma trận.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu và kiểm tra hai điều kiện tuyến tính.</li><li>Dựng ma trận chuẩn của T từ ảnh của các vectơ cơ sở.</li><li>Nhận ra các ánh xạ không tuyến tính.</li><li>Biểu diễn ánh xạ tuyến tính giữa các không gian khác (đa thức) bằng ma trận.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Tính tuyến tính</span>T(u + v) = T(u) + T(v)    T(cv) = c T(v)    (gộp lại: T(cu + dv) = cT(u) + dT(v))</div>
<p>Hệ quả: T(0) = 0, và T biến đường thẳng thành đường thẳng (hoặc một điểm). Mọi ma trận cho một ánh xạ tuyến tính x ↦ Ax, vì A(cu + dv) = cAu + dAv.</p>
<p><strong>Chiều ngược lại là định lý then chốt.</strong> Nếu T: R<sup>n</sup> → R<sup>m</sup> tuyến tính, viết x = x<sub>1</sub>e<sub>1</sub> + … + x<sub>n</sub>e<sub>n</sub>. Tính tuyến tính cho T(x) = x<sub>1</sub>T(e<sub>1</sub>) + … + x<sub>n</sub>T(e<sub>n</sub>) — một tổ hợp của các vectơ T(e<sub>j</sub>), tức là một ma trận nhân x:</p>
<div class="formula"><span class="lbl">Ma trận chuẩn</span>A = [ T(e<sub>1</sub>)  T(e<sub>2</sub>)  …  T(e<sub>n</sub>) ]  (cột j = ảnh của vectơ cơ sở thứ j)   T(x) = Ax</div>
<p>Vậy một ánh xạ tuyến tính được xác định hoàn toàn bởi việc nó làm gì với một cơ sở. Khẩu hiệu của 3Blue1Brown: “các cột của ma trận cho biết các vectơ cơ sở rơi vào đâu.”</p>
<p><strong>Ngoài R<sup>n</sup>.</strong> Phép lấy đạo hàm D(p) = p′ tuyến tính trên đa thức: (p + q)′ = p′ + q′ và (cp)′ = cp′. Với cơ sở 1, x, x<sup>2</sup>, x<sup>3</sup> của P<sub>3</sub> và 1, x, x<sup>2</sup> của P<sub>2</sub>, D(1) = 0, D(x) = 1, D(x<sup>2</sup>) = 2x, D(x<sup>3</sup>) = 3x<sup>2</sup>, nên ma trận của nó cỡ 3×4:</p>
<table class="matrix"><caption>D</caption><tbody><tr><td>0</td><td>1</td><td>0</td><td>0</td></tr><tr><td>0</td><td>0</td><td>2</td><td>0</td></tr><tr><td>0</td><td>0</td><td>0</td><td>3</td></tr></tbody></table>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — ma trận chuẩn.</b> T(x, y) = (x + 2y, 3x, y − x). Khi đó T(e<sub>1</sub>) = T(1, 0) = (1, 3, −1) và T(e<sub>2</sub>) = T(0, 1) = (2, 0, 1):</p>
<table class="matrix"><caption>A</caption><tbody><tr><td>1</td><td>2</td></tr><tr><td>3</td><td>0</td></tr><tr><td>−1</td><td>1</td></tr></tbody></table>
<p>Kiểm tại (2, 1): A(2, 1) = 2(1, 3, −1) + (2, 0, 1) = (4, 6, −1), và tính thẳng T(2, 1) = (2 + 2, 6, 1 − 2) = (4, 6, −1) ✓.</p></div>
<div class="callout"><p><b>Ví dụ 2 — đạo hàm là một ma trận.</b> p(x) = 2 + 3x − x<sup>2</sup> + 4x<sup>3</sup> có toạ độ (2, 3, −1, 4). D·(2, 3, −1, 4) = (3, −2, 12), tức p′(x) = 3 − 2x + 12x<sup>2</sup> ✓.</p></div>
<div class="callout"><p><b>Ví dụ 3 — không tuyến tính.</b> Phép tịnh tiến T(x) = x + (1, 0) dời gốc: T(0) ≠ 0. T(x, y) = (xy, x) hỏng phép nhân vô hướng: T(2, 2) = (4, 2) nhưng 2T(1, 1) = (2, 2). T(x) = |x| hỏng phép cộng: |1 + (−1)| ≠ |1| + |−1|.</p></div>
<div class="note-ct"><p><strong>Góc nhìn AI.</strong> Mạng nơ-ron xen kẽ ánh xạ tuyến tính (ma trận W) với hàm kích hoạt phi tuyến (ReLU, GELU). Không có hàm kích hoạt, cả mạng sẽ sụp thành một tích ma trận duy nhất — một ánh xạ tuyến tính — dù có bao nhiêu lớp.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đặt T(e<sub>j</sub>) làm <em>hàng</em> thay vì làm cột.</li><li>Gọi y = mx + b với b ≠ 0 là “tuyến tính”: trong đại số tuyến tính nó là <em>afin</em>, không tuyến tính.</li><li>Kiểm tính tuyến tính chỉ ở một cặp vectơ; chứng minh cần u, v, c tuỳ ý.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tuyến tính ⇔ T(cu + dv) = cT(u) + dT(v); khi đó T(0) = 0.</li><li>Mọi T tuyến tính R<sup>n</sup> → R<sup>m</sup> có dạng T(x) = Ax với các cột T(e<sub>j</sub>).</li><li>Ánh xạ tuyến tính được xác định bởi giá trị trên một cơ sở.</li><li>Tịnh tiến, tích và trị tuyệt đối không tuyến tính.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/linear-transformations" target="_blank" rel="noopener">3Blue1Brown — Phép biến đổi tuyến tính và ma trận</a></li><li><a href="https://textbooks.math.gatech.edu/ila/linear-transformations.html" target="_blank" rel="noopener">Interactive Linear Algebra — Ánh xạ tuyến tính</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-30-linear-transformations-and-their-matrices/" target="_blank" rel="noopener">MIT 18.06 — Bài 30: Ánh xạ tuyến tính và ma trận của chúng</a></li><li><a href="https://en.wikipedia.org/wiki/Linear_map" target="_blank" rel="noopener">Wikipedia — Linear map</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>T(x, y) = (2x, x − y) có tuyến tính không? Nếu có, cho ma trận.</li><li>Chứng tỏ T(x, y) = (x<sup>2</sup>, y) không tuyến tính.</li><li>T: R<sup>2</sup> → R<sup>2</sup> tuyến tính với T(e<sub>1</sub>) = (1, 3), T(e<sub>2</sub>) = (−2, 0). Tìm T(4, 1).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Có: A = [[2, 0], [1, −1]]. 2) T(2, 0) = (4, 0) nhưng 2T(1, 0) = (2, 0). 3) 4(1, 3) + 1(−2, 0) = (2, 12).</p></div>`);

const c72 = L('maa102-ts-7-2',
  '7.2 — Geometric transformations in 2D/3D and computer graphics|||7.2 — Phép biến đổi hình học 2D/3D và đồ hoạ máy tính',
  'Ma trận quay, phản xạ, co giãn, trượt (shear), chiếu; hợp các phép biến đổi là nhân ma trận (thứ tự quan trọng); định thức của từng loại; toạ độ thuần nhất để tịnh tiến; pipeline đồ hoạ — có code NumPy.',
  `<span class="eyebrow">MAA102 · Chapter 7 · Lesson 7.2</span>
<h2>Geometric transformations in 2D/3D and computer graphics</h2>
<p class="lead">Rotations, mirrors, stretches and shears are the vocabulary of computer graphics, game engines and robotics. Each one is a small matrix, and doing one after another is just matrix multiplication.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write the matrices of rotation, reflection, scaling, shear and projection in R<sup>2</sup>.</li><li>Compose transformations by multiplying matrices in the right order.</li><li>Relate the determinant to what each transformation does to area.</li><li>Use homogeneous coordinates to include translations.</li></ul>
<h3>📖 Lecture</h3>
<p>Using “columns = where e<sub>1</sub> and e<sub>2</sub> land” (Lesson 7.1):</p>
<ul><li><strong>Rotation</strong> by θ counter-clockwise: R(θ) = [[cos θ, −sin θ], [sin θ, cos θ]]. det = 1.</li><li><strong>Reflection</strong> across the x-axis: [[1, 0], [0, −1]]; across y = x: [[0, 1], [1, 0]]. det = −1.</li><li><strong>Scaling</strong>: [[s<sub>x</sub>, 0], [0, s<sub>y</sub>]]. det = s<sub>x</sub>s<sub>y</sub>.</li><li><strong>Shear</strong> (horizontal): [[1, k], [0, 1]]. det = 1 — areas preserved, shapes slanted.</li><li><strong>Projection</strong> onto the x-axis: [[1, 0], [0, 0]]. det = 0 — not invertible.</li></ul>
<div class="formula"><span class="lbl">Composition</span>“first S, then T” = T(S(x)) = (TS)x    the matrix applied first stands on the RIGHT</div>
<p>Since matrix multiplication is not commutative, the order of transformations matters — and the determinant of a composition is the product of the determinants.</p>
<p><strong>Homogeneous coordinates.</strong> Translation x ↦ x + t is not linear, so no 2×2 matrix does it. Graphics systems append a 1 to each point, (x, y) → (x, y, 1), and use 3×3 matrices:</p>
<table class="matrix"><caption>T(t)</caption><tbody><tr><td>1</td><td>0</td><td>t<sub>x</sub></td></tr><tr><td>0</td><td>1</td><td>t<sub>y</sub></td></tr><tr><td>0</td><td>0</td><td>1</td></tr></tbody></table>
<p>Now rotation, scaling and translation are all matrix products, and an entire chain “scale → rotate → move → camera → projection” collapses into one matrix applied to millions of vertices on the GPU. 3D graphics (OpenGL, WebGL, game engines) uses 4×4 matrices in the same way.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — order matters.</b> R = rotation by 90° = [[0, −1], [1, 0]], F = reflection across the x-axis = [[1, 0], [0, −1]].</p>
<table class="matrix"><caption>FR (rotate, then reflect)</caption><tbody><tr><td>0</td><td>−1</td></tr><tr><td>−1</td><td>0</td></tr></tbody></table>
<table class="matrix"><caption>RF (reflect, then rotate)</caption><tbody><tr><td>0</td><td>1</td></tr><tr><td>1</td><td>0</td></tr></tbody></table>
<p>FR is the reflection across the line y = −x; RF is the reflection across y = x. Both have det = 1 · (−1) = −1 (they are mirrors), but they are different mirrors.</p></div>
<div class="callout"><p><b>Example 2 — translation.</b> Move (2, 3) by t = (5, −1): [[1, 0, 5], [0, 1, −1], [0, 0, 1]]·(2, 3, 1) = (7, 2, 1), i.e. the point (7, 2).</p></div>
<p>Rotate the unit square by 30° and shear it, with its corners stored as the columns of one matrix:</p>
<pre><code class="language-python">import numpy as np
theta = np.radians(30)
R = np.array([[np.cos(theta), -np.sin(theta)],
              [np.sin(theta),  np.cos(theta)]])
square = np.array([[0, 1, 1, 0],
                   [0, 0, 1, 1]])          # corners as columns
print((R @ square).round(3))
print(round(np.linalg.det(R), 6))          # rotations keep area: det = 1
S = np.array([[1, 0.5], [0, 1]])           # horizontal shear
print(S @ square)</code></pre>
<div class="out">[[ 0.     0.866  0.366 -0.5  ]<br> [ 0.     0.5    1.366  0.866]]<br>1.0<br>[[0.  1.  1.5 0.5]<br> [0.  0.  1.  1. ]]</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing the composition in reading order: “rotate then reflect” is FR, not RF.</li><li>Using degrees in <code>np.cos</code> — NumPy expects radians.</li><li>Forgetting that a rotation matrix's inverse is its transpose: R(θ)<sup>−1</sup> = R(−θ) = R(θ)<sup>T</sup>.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Rotation (det 1), reflection (det −1), scaling (det s<sub>x</sub>s<sub>y</sub>), shear (det 1), projection (det 0).</li><li>Composition = product; the first map is on the right; order matters.</li><li>Homogeneous coordinates turn translations into matrix products.</li><li>Graphics pipelines chain 3×3 / 4×4 matrices into one.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/matrix-multiplication" target="_blank" rel="noopener">3Blue1Brown — Matrix multiplication as composition</a></li><li><a href="https://www.3blue1brown.com/lessons/3d-transformations" target="_blank" rel="noopener">3Blue1Brown — Three-dimensional linear transformations</a></li><li><a href="https://en.wikipedia.org/wiki/Transformation_matrix" target="_blank" rel="noopener">Wikipedia — Transformation matrix</a></li><li><a href="https://en.wikipedia.org/wiki/Homogeneous_coordinates" target="_blank" rel="noopener">Wikipedia — Homogeneous coordinates</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write the matrix that rotates by 90° clockwise.</li><li>What is the matrix of the projection onto the x-axis? Its determinant? Is it invertible?</li><li>Find the 3×3 homogeneous matrix that first rotates by 90° counter-clockwise, then translates by (1, 2). Where does (1, 0) go?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) R(−90°) = [[0, 1], [−1, 0]]. 2) [[1, 0], [0, 0]], det 0, not invertible (all of the y-axis goes to 0). 3) T·R = [[0, −1, 1], [1, 0, 2], [0, 0, 1]]; (1, 0, 1) ↦ (1, 3, 1): the point (1, 3).</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 7 · Bài 7.2</span>
<h2>Phép biến đổi hình học 2D/3D và đồ hoạ máy tính</h2>
<p class="lead">Quay, lấy đối xứng, co giãn và trượt là “từ vựng” của đồ hoạ máy tính, game engine và robot. Mỗi phép là một ma trận nhỏ, và làm phép này rồi phép kia chỉ là nhân ma trận.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết ma trận của phép quay, phản xạ, co giãn, trượt và chiếu trong R<sup>2</sup>.</li><li>Hợp các phép biến đổi bằng cách nhân ma trận đúng thứ tự.</li><li>Liên hệ định thức với việc mỗi phép biến đổi làm gì với diện tích.</li><li>Dùng toạ độ thuần nhất để đưa phép tịnh tiến vào.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Dùng “các cột = nơi e<sub>1</sub> và e<sub>2</sub> rơi vào” (Bài 7.1):</p>
<ul><li><strong>Quay</strong> góc θ ngược chiều kim đồng hồ: R(θ) = [[cos θ, −sin θ], [sin θ, cos θ]]. det = 1.</li><li><strong>Phản xạ</strong> qua trục x: [[1, 0], [0, −1]]; qua đường y = x: [[0, 1], [1, 0]]. det = −1.</li><li><strong>Co giãn</strong>: [[s<sub>x</sub>, 0], [0, s<sub>y</sub>]]. det = s<sub>x</sub>s<sub>y</sub>.</li><li><strong>Trượt</strong> (ngang): [[1, k], [0, 1]]. det = 1 — giữ diện tích, làm nghiêng hình.</li><li><strong>Chiếu</strong> lên trục x: [[1, 0], [0, 0]]. det = 0 — không khả nghịch.</li></ul>
<div class="formula"><span class="lbl">Hợp ánh xạ</span>“S trước, rồi T” = T(S(x)) = (TS)x    ma trận áp trước đứng bên PHẢI</div>
<p>Vì phép nhân ma trận không giao hoán, thứ tự các phép biến đổi là quan trọng — và định thức của phép hợp là tích các định thức.</p>
<p><strong>Toạ độ thuần nhất.</strong> Tịnh tiến x ↦ x + t không tuyến tính, nên không ma trận 2×2 nào làm được. Hệ đồ hoạ thêm số 1 vào mỗi điểm, (x, y) → (x, y, 1), và dùng ma trận 3×3:</p>
<table class="matrix"><caption>T(t)</caption><tbody><tr><td>1</td><td>0</td><td>t<sub>x</sub></td></tr><tr><td>0</td><td>1</td><td>t<sub>y</sub></td></tr><tr><td>0</td><td>0</td><td>1</td></tr></tbody></table>
<p>Giờ quay, co giãn và tịnh tiến đều là tích ma trận, và cả chuỗi “co giãn → quay → di chuyển → camera → phép chiếu” gộp thành một ma trận áp lên hàng triệu đỉnh trên GPU. Đồ hoạ 3D (OpenGL, WebGL, game engine) dùng ma trận 4×4 theo đúng cách đó.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — thứ tự quan trọng.</b> R = quay 90° = [[0, −1], [1, 0]], F = phản xạ qua trục x = [[1, 0], [0, −1]].</p>
<table class="matrix"><caption>FR (quay, rồi phản xạ)</caption><tbody><tr><td>0</td><td>−1</td></tr><tr><td>−1</td><td>0</td></tr></tbody></table>
<table class="matrix"><caption>RF (phản xạ, rồi quay)</caption><tbody><tr><td>0</td><td>1</td></tr><tr><td>1</td><td>0</td></tr></tbody></table>
<p>FR là phép đối xứng qua đường y = −x; RF là phép đối xứng qua y = x. Cả hai có det = 1 · (−1) = −1 (đều là gương), nhưng là hai tấm gương khác nhau.</p></div>
<div class="callout"><p><b>Ví dụ 2 — tịnh tiến.</b> Dời (2, 3) theo t = (5, −1): [[1, 0, 5], [0, 1, −1], [0, 0, 1]]·(2, 3, 1) = (7, 2, 1), tức điểm (7, 2).</p></div>
<p>Quay hình vuông đơn vị 30° rồi trượt nó, các đỉnh lưu thành các cột của một ma trận:</p>
<pre><code class="language-python">import numpy as np
theta = np.radians(30)
R = np.array([[np.cos(theta), -np.sin(theta)],
              [np.sin(theta),  np.cos(theta)]])
square = np.array([[0, 1, 1, 0],
                   [0, 0, 1, 1]])          # corners as columns
print((R @ square).round(3))
print(round(np.linalg.det(R), 6))          # rotations keep area: det = 1
S = np.array([[1, 0.5], [0, 1]])           # horizontal shear
print(S @ square)</code></pre>
<div class="out">[[ 0.     0.866  0.366 -0.5  ]<br> [ 0.     0.5    1.366  0.866]]<br>1.0<br>[[0.  1.  1.5 0.5]<br> [0.  0.  1.  1. ]]</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết phép hợp theo thứ tự đọc: “quay rồi phản xạ” là FR, không phải RF.</li><li>Dùng độ trong <code>np.cos</code> — NumPy cần radian.</li><li>Quên rằng nghịch đảo của ma trận quay là chuyển vị của nó: R(θ)<sup>−1</sup> = R(−θ) = R(θ)<sup>T</sup>.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Quay (det 1), phản xạ (det −1), co giãn (det s<sub>x</sub>s<sub>y</sub>), trượt (det 1), chiếu (det 0).</li><li>Hợp ánh xạ = tích; ánh xạ đầu tiên đứng bên phải; thứ tự quan trọng.</li><li>Toạ độ thuần nhất biến phép tịnh tiến thành tích ma trận.</li><li>Pipeline đồ hoạ gộp các ma trận 3×3 / 4×4 thành một.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/matrix-multiplication" target="_blank" rel="noopener">3Blue1Brown — Nhân ma trận là hợp các phép biến đổi</a></li><li><a href="https://www.3blue1brown.com/lessons/3d-transformations" target="_blank" rel="noopener">3Blue1Brown — Phép biến đổi tuyến tính ba chiều</a></li><li><a href="https://en.wikipedia.org/wiki/Transformation_matrix" target="_blank" rel="noopener">Wikipedia — Transformation matrix</a></li><li><a href="https://en.wikipedia.org/wiki/Homogeneous_coordinates" target="_blank" rel="noopener">Wikipedia — Homogeneous coordinates</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết ma trận quay 90° theo chiều kim đồng hồ.</li><li>Ma trận của phép chiếu lên trục x là gì? Định thức? Có khả nghịch không?</li><li>Tìm ma trận thuần nhất 3×3 quay 90° ngược chiều kim đồng hồ rồi tịnh tiến theo (1, 2). Điểm (1, 0) đi đâu?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) R(−90°) = [[0, 1], [−1, 0]]. 2) [[1, 0], [0, 0]], det 0, không khả nghịch (cả trục y bị đưa về 0). 3) T·R = [[0, −1, 1], [1, 0, 2], [0, 0, 1]]; (1, 0, 1) ↦ (1, 3, 1): điểm (1, 3).</p></div>`);

const c73 = L('maa102-ts-7-3',
  '7.3 — Kernel and range, one-to-one and onto, change of basis and similar matrices|||7.3 — Hạt nhân và ảnh, đơn ánh và toàn ánh, đổi cơ sở và ma trận đồng dạng',
  'Hạt nhân ker T = N(A), ảnh range T = C(A), đơn ánh ⇔ ker = {0}, toàn ánh ⇔ hạng = m; ma trận của T theo cơ sở khác B = P⁻¹AP, ma trận đồng dạng và các bất biến (det, vết, hạng, trị riêng); ví dụ phép chiếu thành ma trận chéo.',
  `<span class="eyebrow">MAA102 · Chapter 7 · Lesson 7.3</span>
<h2>Kernel and range, one-to-one and onto, change of basis and similar matrices</h2>
<p class="lead">The same linear map can be described by many matrices — one for each choice of basis. Choosing a clever basis can turn a messy matrix into a diagonal one. This lesson prepares the idea that drives the rest of the course.</p>
<h3>🎯 Objectives</h3>
<ul><li>Identify the kernel and range of T with N(A) and C(A).</li><li>Decide whether T is one-to-one and/or onto using the rank.</li><li>Compute the matrix of T in a new basis: B = P<sup>−1</sup>AP.</li><li>List the quantities shared by similar matrices.</li></ul>
<h3>📖 Lecture</h3>
<p>For T(x) = Ax with A of size m×n:</p>
<ul><li><strong>Kernel</strong> ker T = {x : T(x) = 0} = N(A) ⊂ R<sup>n</sup>.</li><li><strong>Range</strong> (image) range T = {T(x)} = C(A) ⊂ R<sup>m</sup>.</li></ul>
<div class="formula"><span class="lbl">One-to-one and onto</span>T one-to-one ⇔ ker T = {0} ⇔ rank = n    T onto ⇔ range T = R<sup>m</sup> ⇔ rank = m</div>
<p>So a map R<sup>n</sup> → R<sup>m</sup> with n &gt; m can never be one-to-one (it must crush some directions), and with n &lt; m it can never be onto. For square A, one-to-one ⇔ onto ⇔ invertible. Rank–nullity reads dim ker T + dim range T = n.</p>
<p><strong>Change of basis.</strong> Let the columns of P be a new basis b<sub>1</sub>, …, b<sub>n</sub> of R<sup>n</sup>. A vector with new coordinates y is the vector x = Py. Applying A and converting back to new coordinates gives P<sup>−1</sup>APy. Hence:</p>
<div class="formula"><span class="lbl">Matrix of T in basis P</span>B = P<sup>−1</sup> A P    (A and B are called similar)</div>
<p><strong>Similar matrices represent the same map</strong>, so they share every basis-independent quantity: determinant, trace, rank, characteristic polynomial and eigenvalues. When the new basis consists of eigenvectors, B is diagonal — that is diagonalization, Chapter 8.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — kernel and range.</b> T: R<sup>3</sup> → R<sup>2</sup>, A = [[1, 0, 1], [0, 1, 1]]. Two pivots ⇒ rank 2 = m ⇒ <b>onto</b>. ker T is spanned by (−1, −1, 1) (dimension 3 − 2 = 1) ⇒ <b>not one-to-one</b>: T(x) and T(x + t(−1, −1, 1)) are equal.</p></div>
<div class="callout"><p><b>Example 2 — a projection becomes diagonal.</b> Orthogonal projection onto the line y = x has standard matrix</p>
<table class="matrix"><caption>A</caption><tbody><tr><td>1/2</td><td>1/2</td></tr><tr><td>1/2</td><td>1/2</td></tr></tbody></table>
<p>Choose b<sub>1</sub> = (1, 1) (on the line: projected to itself) and b<sub>2</sub> = (1, −1) (perpendicular: projected to 0). With P = [b<sub>1</sub> b<sub>2</sub>] = [[1, 1], [1, −1]]:</p>
<table class="matrix"><caption>P<sup>−1</sup>AP</caption><tbody><tr><td>1</td><td>0</td></tr><tr><td>0</td><td>0</td></tr></tbody></table>
<p>In the adapted basis the map just says “keep the first coordinate, kill the second”. Check invariants: det A = 1/4 − 1/4 = 0 = det B; trace A = 1 = trace B ✓.</p></div>
<div class="callout"><p><b>Example 3 — reflection.</b> The reflection across y = x, [[0, 1], [1, 0]], in the same basis becomes [[1, 0], [0, −1]]: b<sub>1</sub> stays, b<sub>2</sub> flips.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing PAP<sup>−1</sup> instead of P<sup>−1</sup>AP — the inverse goes on the left when P's columns are the new basis.</li><li>Thinking similar matrices are equal: they are the same map in different coordinates, usually with different entries.</li><li>Concluding “onto” from rank = n instead of rank = m.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>ker T = N(A), range T = C(A).</li><li>One-to-one ⇔ rank = n; onto ⇔ rank = m; square: both ⇔ invertible.</li><li>New basis (columns of P): B = P<sup>−1</sup>AP.</li><li>Similar matrices share det, trace, rank and eigenvalues; a good basis makes B diagonal.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/one-to-one-onto.html" target="_blank" rel="noopener">Interactive Linear Algebra — One-to-one and Onto Transformations</a></li><li><a href="https://textbooks.math.gatech.edu/ila/similarity.html" target="_blank" rel="noopener">Interactive Linear Algebra — Similarity</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-31-change-of-basis-image-compression/" target="_blank" rel="noopener">MIT 18.06 — Lecture 31: Change of basis; image compression</a></li><li><a href="https://www.3blue1brown.com/lessons/change-of-basis" target="_blank" rel="noopener">3Blue1Brown — Change of basis</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>T: R<sup>4</sup> → R<sup>3</sup> has rank 3. Is it one-to-one? Onto? What is dim ker T?</li><li>Can a linear map R<sup>2</sup> → R<sup>3</sup> be onto? Explain.</li><li>A and B are similar and det A = 6, trace A = 5. What are det B and trace B?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Onto (rank = m = 3); not one-to-one; dim ker = 4 − 3 = 1. 2) No: rank ≤ 2 &lt; 3, so the range is at most a plane in R<sup>3</sup>. 3) det B = 6, trace B = 5.</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 7 · Bài 7.3</span>
<h2>Hạt nhân và ảnh, đơn ánh và toàn ánh, đổi cơ sở và ma trận đồng dạng</h2>
<p class="lead">Cùng một ánh xạ tuyến tính có thể mô tả bằng nhiều ma trận — mỗi cách chọn cơ sở cho một ma trận. Chọn cơ sở khéo có thể biến một ma trận rối rắm thành ma trận chéo. Bài này chuẩn bị ý tưởng dẫn dắt toàn bộ phần còn lại của môn.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Đồng nhất hạt nhân và ảnh của T với N(A) và C(A).</li><li>Quyết định T có đơn ánh và/hoặc toàn ánh không bằng hạng.</li><li>Tính ma trận của T theo cơ sở mới: B = P<sup>−1</sup>AP.</li><li>Liệt kê các đại lượng chung của các ma trận đồng dạng.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Với T(x) = Ax, A cỡ m×n:</p>
<ul><li><strong>Hạt nhân</strong> ker T = {x : T(x) = 0} = N(A) ⊂ R<sup>n</sup>.</li><li><strong>Ảnh</strong> range T = {T(x)} = C(A) ⊂ R<sup>m</sup>.</li></ul>
<div class="formula"><span class="lbl">Đơn ánh và toàn ánh</span>T đơn ánh ⇔ ker T = {0} ⇔ hạng = n    T toàn ánh ⇔ range T = R<sup>m</sup> ⇔ hạng = m</div>
<p>Vậy ánh xạ R<sup>n</sup> → R<sup>m</sup> với n &gt; m không bao giờ đơn ánh (nó phải ép dẹt vài hướng), và với n &lt; m không bao giờ toàn ánh. Với A vuông: đơn ánh ⇔ toàn ánh ⇔ khả nghịch. Rank–nullity viết lại là dim ker T + dim range T = n.</p>
<p><strong>Đổi cơ sở.</strong> Cho các cột của P là một cơ sở mới b<sub>1</sub>, …, b<sub>n</sub> của R<sup>n</sup>. Vectơ có toạ độ mới y chính là vectơ x = Py. Áp A rồi đổi về toạ độ mới được P<sup>−1</sup>APy. Do đó:</p>
<div class="formula"><span class="lbl">Ma trận của T theo cơ sở P</span>B = P<sup>−1</sup> A P    (A và B gọi là đồng dạng)</div>
<p><strong>Các ma trận đồng dạng biểu diễn cùng một ánh xạ</strong>, nên chúng có chung mọi đại lượng không phụ thuộc cơ sở: định thức, vết, hạng, đa thức đặc trưng và trị riêng. Khi cơ sở mới gồm các vectơ riêng, B là ma trận chéo — đó là chéo hoá, Chương 8.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — hạt nhân và ảnh.</b> T: R<sup>3</sup> → R<sup>2</sup>, A = [[1, 0, 1], [0, 1, 1]]. Hai pivot ⇒ hạng 2 = m ⇒ <b>toàn ánh</b>. ker T sinh bởi (−1, −1, 1) (số chiều 3 − 2 = 1) ⇒ <b>không đơn ánh</b>: T(x) và T(x + t(−1, −1, 1)) bằng nhau.</p></div>
<div class="callout"><p><b>Ví dụ 2 — phép chiếu thành ma trận chéo.</b> Phép chiếu vuông góc lên đường y = x có ma trận chuẩn</p>
<table class="matrix"><caption>A</caption><tbody><tr><td>1/2</td><td>1/2</td></tr><tr><td>1/2</td><td>1/2</td></tr></tbody></table>
<p>Chọn b<sub>1</sub> = (1, 1) (nằm trên đường: chiếu thành chính nó) và b<sub>2</sub> = (1, −1) (vuông góc: chiếu thành 0). Với P = [b<sub>1</sub> b<sub>2</sub>] = [[1, 1], [1, −1]]:</p>
<table class="matrix"><caption>P<sup>−1</sup>AP</caption><tbody><tr><td>1</td><td>0</td></tr><tr><td>0</td><td>0</td></tr></tbody></table>
<p>Theo cơ sở phù hợp, ánh xạ chỉ nói “giữ toạ độ thứ nhất, xoá toạ độ thứ hai”. Kiểm bất biến: det A = 1/4 − 1/4 = 0 = det B; vết A = 1 = vết B ✓.</p></div>
<div class="callout"><p><b>Ví dụ 3 — phản xạ.</b> Phép đối xứng qua y = x, [[0, 1], [1, 0]], theo cùng cơ sở đó thành [[1, 0], [0, −1]]: b<sub>1</sub> giữ nguyên, b<sub>2</sub> bị lật.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết PAP<sup>−1</sup> thay vì P<sup>−1</sup>AP — nghịch đảo đứng bên trái khi các cột của P là cơ sở mới.</li><li>Nghĩ các ma trận đồng dạng thì bằng nhau: chúng là cùng một ánh xạ ở các toạ độ khác nhau, thường có phần tử khác nhau.</li><li>Kết luận “toàn ánh” từ hạng = n thay vì hạng = m.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>ker T = N(A), range T = C(A).</li><li>Đơn ánh ⇔ hạng = n; toàn ánh ⇔ hạng = m; ma trận vuông: cả hai ⇔ khả nghịch.</li><li>Cơ sở mới (các cột của P): B = P<sup>−1</sup>AP.</li><li>Ma trận đồng dạng có chung det, vết, hạng và trị riêng; cơ sở tốt làm B thành ma trận chéo.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/one-to-one-onto.html" target="_blank" rel="noopener">Interactive Linear Algebra — Đơn ánh và toàn ánh</a></li><li><a href="https://textbooks.math.gatech.edu/ila/similarity.html" target="_blank" rel="noopener">Interactive Linear Algebra — Đồng dạng</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-31-change-of-basis-image-compression/" target="_blank" rel="noopener">MIT 18.06 — Bài 31: Đổi cơ sở; nén ảnh</a></li><li><a href="https://www.3blue1brown.com/lessons/change-of-basis" target="_blank" rel="noopener">3Blue1Brown — Đổi cơ sở</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>T: R<sup>4</sup> → R<sup>3</sup> có hạng 3. Nó có đơn ánh không? Toàn ánh không? dim ker T bằng bao nhiêu?</li><li>Ánh xạ tuyến tính R<sup>2</sup> → R<sup>3</sup> có thể toàn ánh không? Giải thích.</li><li>A và B đồng dạng, det A = 6, vết A = 5. det B và vết B bằng bao nhiêu?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Toàn ánh (hạng = m = 3); không đơn ánh; dim ker = 4 − 3 = 1. 2) Không: hạng ≤ 2 &lt; 3, nên ảnh nhiều nhất là một mặt phẳng trong R<sup>3</sup>. 3) det B = 6, vết B = 5.</p></div>`);

const q7 = QZ(7, 'Quiz — Chapter 7: Linear transformations|||Quiz — Chương 7: Ánh xạ tuyến tính', 'Kiểm tra chương 7: tính tuyến tính, ma trận chuẩn, quay/phản xạ/chiếu, hợp ánh xạ, toạ độ thuần nhất, đơn ánh/toàn ánh, ma trận đồng dạng.', [
  Q('q1', 'Which map R² → R² is linear?|||Ánh xạ R² → R² nào tuyến tính?',
    ['T(x, y) = (x + 1, y)|||T(x, y) = (x + 1, y)', 'T(x, y) = (3x − y, 2y)|||T(x, y) = (3x − y, 2y)', 'T(x, y) = (xy, y)|||T(x, y) = (xy, y)', 'T(x, y) = (x², y)|||T(x, y) = (x², y)'], 1,
    'It is Ax with A = [[3, −1], [0, 2]].|||Nó là Ax với A = [[3, −1], [0, 2]].'),
  Q('q2', 'The columns of the standard matrix of T are|||Các cột của ma trận chuẩn của T là',
    ['the eigenvectors of T|||các vectơ riêng của T', 'T(e₁), …, T(eₙ)|||T(e₁), …, T(eₙ)', 'the rows of T|||các hàng của T', 'the kernel vectors|||các vectơ hạt nhân'], 1,
    'T(x) = x₁T(e₁) + … + xₙT(eₙ).|||T(x) = x₁T(e₁) + … + xₙT(eₙ).'),
  Q('q3', 'The matrix of rotation by 90° counter-clockwise is|||Ma trận quay 90° ngược chiều kim đồng hồ là',
    ['[[0, 1], [−1, 0]]|||[[0, 1], [−1, 0]]', '[[0, −1], [1, 0]]|||[[0, −1], [1, 0]]', '[[1, 0], [0, −1]]|||[[1, 0], [0, −1]]', '[[−1, 0], [0, −1]]|||[[−1, 0], [0, −1]]'], 1,
    'e₁ → (0, 1), e₂ → (−1, 0).|||e₁ → (0, 1), e₂ → (−1, 0).'),
  Q('q4', 'The determinant of any reflection in R² is|||Định thức của mọi phép phản xạ trong R² là',
    ['1|||1', '−1|||−1', '0|||0', '2|||2'], 1,
    'It preserves area and reverses orientation.|||Nó giữ diện tích và đảo hướng.'),
  Q('q5', 'R = rotation by 90°, F = reflection across the x-axis. “Rotate, then reflect” has matrix|||R = quay 90°, F = phản xạ qua trục x. “Quay rồi phản xạ” có ma trận',
    ['RF = [[0, 1], [1, 0]]|||RF = [[0, 1], [1, 0]]', 'FR = [[0, −1], [−1, 0]]|||FR = [[0, −1], [−1, 0]]', 'R + F|||R + F', 'R − F|||R − F'], 1,
    'The map applied first stands on the right.|||Ánh xạ áp trước đứng bên phải.'),
  Q('q6', 'Why do graphics systems use 3×3 matrices for 2D points?|||Vì sao hệ đồ hoạ dùng ma trận 3×3 cho điểm 2D?',
    ['to make rotation faster|||để quay nhanh hơn', 'so that translations become matrix products (homogeneous coordinates)|||để phép tịnh tiến thành tích ma trận (toạ độ thuần nhất)', 'to store colour|||để lưu màu', 'because 2×2 matrices are not invertible|||vì ma trận 2×2 không khả nghịch'], 1,
    'Translation is not linear in R², but it is linear on (x, y, 1).|||Tịnh tiến không tuyến tính trong R², nhưng tuyến tính trên (x, y, 1).'),
  Q('q7', 'A linear map T: R⁵ → R³|||Một ánh xạ tuyến tính T: R⁵ → R³',
    ['can be one-to-one|||có thể đơn ánh', 'cannot be one-to-one|||không thể đơn ánh', 'is always onto|||luôn toàn ánh', 'is always zero|||luôn bằng 0'], 1,
    'Rank ≤ 3 < 5, so dim ker T ≥ 2.|||Hạng ≤ 3 < 5, nên dim ker T ≥ 2.'),
  Q('q8', 'Similar matrices A and B = P⁻¹AP always have the same|||Hai ma trận đồng dạng A và B = P⁻¹AP luôn có cùng',
    ['entries|||các phần tử', 'eigenvalues, determinant and trace|||trị riêng, định thức và vết', 'eigenvectors|||vectơ riêng', 'columns|||các cột'], 1,
    'They represent the same map in different bases.|||Chúng biểu diễn cùng một ánh xạ theo các cơ sở khác nhau.'),
  Q('q9', 'With the derivative matrix D on P₃, the derivative of 2 + 3x − x² + 4x³ is|||Dùng ma trận đạo hàm D trên P₃, đạo hàm của 2 + 3x − x² + 4x³ là',
    ['3 − 2x + 12x²|||3 − 2x + 12x²', '3 − x + 4x²|||3 − x + 4x²', '2 + 3x − x²|||2 + 3x − x²', '3 + 2x + 12x²|||3 + 2x + 12x²'], 0,
    'D(2, 3, −1, 4) = (3, −2, 12).|||D(2, 3, −1, 4) = (3, −2, 12).'),
]);

const ch7 = {
  title: 'Chapter 7 — Linear transformations|||Chương 7 — Ánh xạ tuyến tính',
  description: 'Ánh xạ tuyến tính và ma trận chuẩn, phép quay/phản xạ/co giãn/trượt/chiếu, hợp ánh xạ, toạ độ thuần nhất trong đồ hoạ, hạt nhân và ảnh, đổi cơ sở, ma trận đồng dạng (Strang ch.8 · Lay ch.1.8–1.9, 4.7, 5.4 · MIT 18.06 bài 30–31).',
  lessons: [c71, c72, c73, q7],
};


// ───────────────────────────── Chương 8 — Trị riêng & vectơ riêng ─────────────────────────────
const c81 = L('maa102-ts-8-1',
  '8.1 — Eigenvalues and eigenvectors|||8.1 — Trị riêng và vectơ riêng',
  'Ax = λx, phương trình đặc trưng det(A − λI) = 0, tìm không gian riêng, trị riêng của ma trận tam giác/phép chiếu/phép quay (trị riêng phức), vết = tổng, det = tích — có code numpy.linalg.eig.',
  `<span class="eyebrow">MAA102 · Chapter 8 · Lesson 8.1</span>
<h2>Eigenvalues and eigenvectors</h2>
<p class="lead">Most vectors change direction when a matrix acts on them. A few special ones do not — they are only stretched. These <strong>eigenvectors</strong> and their stretch factors, the <strong>eigenvalues</strong>, reveal what a matrix really does, and they are behind PageRank, vibration analysis, PCA and the stability of every dynamical system.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the definition Ax = λx and check a proposed eigenpair.</li><li>Find eigenvalues from the characteristic equation det(A − λI) = 0.</li><li>Find eigenvectors as the nullspace of A − λI.</li><li>Use trace = sum and det = product of eigenvalues; recognise complex eigenvalues.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Definition</span>Ax = λx,  x ≠ 0    λ = eigenvalue, x = eigenvector</div>
<p>Rewrite as (A − λI)x = 0. A non-zero solution exists exactly when A − λI is singular:</p>
<div class="formula"><span class="lbl">Characteristic equation</span>det(A − λI) = 0   (a polynomial of degree n in λ ⇒ n eigenvalues, counted with multiplicity, possibly complex)</div>
<p><strong>Recipe.</strong> (1) Compute det(A − λI) and find its roots λ. (2) For each λ, solve (A − λI)x = 0; the solutions (minus 0) are the eigenvectors, and together with 0 they form the <strong>eigenspace</strong> N(A − λI). Any non-zero multiple of an eigenvector is again an eigenvector.</p>
<p><strong>Shortcuts.</strong></p>
<ul><li>For 2×2: λ<sup>2</sup> − (trace)λ + det = 0.</li><li>Always: λ<sub>1</sub> + … + λ<sub>n</sub> = trace A (sum of the diagonal) and λ<sub>1</sub>λ<sub>2</sub>⋯λ<sub>n</sub> = det A. So A is invertible ⇔ 0 is not an eigenvalue.</li><li>Triangular matrix: the eigenvalues are the diagonal entries.</li><li>If Ax = λx then A<sup>k</sup>x = λ<sup>k</sup>x and A<sup>−1</sup>x = (1/λ)x.</li></ul>
<p><strong>Geometric examples.</strong> A projection P has eigenvalues 1 (vectors on the target line/plane) and 0 (vectors projected to 0). A reflection has eigenvalues 1 and −1. A rotation by 90°, [[0, −1], [1, 0]], turns every real vector, so it has no real eigenvector: λ<sup>2</sup> + 1 = 0 gives λ = ± i. Complex eigenvalues signal rotation.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Find all eigenpairs</b> of</p>
<table class="matrix"><caption>A</caption><tbody><tr><td>4</td><td>1</td></tr><tr><td>2</td><td>3</td></tr></tbody></table>
<p>Step 1: det(A − λI) = (4 − λ)(3 − λ) − 2 = λ<sup>2</sup> − 7λ + 10 = (λ − 5)(λ − 2). Eigenvalues <b>λ<sub>1</sub> = 5, λ<sub>2</sub> = 2</b>. (Check: 5 + 2 = 7 = trace, 5·2 = 10 = det ✓.)</p>
<p>Step 2: λ = 5: A − 5I = [[−1, 1], [2, −2]] ⇒ −x<sub>1</sub> + x<sub>2</sub> = 0 ⇒ <b>x<sub>1</sub> = (1, 1)</b>. Check: A(1, 1) = (5, 5) ✓.</p>
<p>Step 3: λ = 2: A − 2I = [[2, 1], [2, 1]] ⇒ 2x<sub>1</sub> + x<sub>2</sub> = 0 ⇒ <b>x<sub>2</sub> = (1, −2)</b>. Check: A(1, −2) = (2, −4) = 2(1, −2) ✓.</p></div>
<pre><code class="language-python">import numpy as np
A = np.array([[4, 1],
              [2, 3]], dtype=float)
vals, vecs = np.linalg.eig(A)
print(vals)
print(vecs.round(4))            # columns are unit eigenvectors
v = vecs[:, 0]
print(np.allclose(A @ v, vals[0] * v))
print(np.trace(A), round(np.linalg.det(A), 6))</code></pre>
<div class="out">[5.+0.j 2.+0.j]<br>[[ 0.7071+0.j -0.4472+0.j]<br> [ 0.7071+0.j  0.8944+0.j]]<br>True<br>7.0 10.0</div>
<p>NumPy normalises eigenvectors to length 1: (0.7071, 0.7071) = (1, 1)/√2 and (−0.4472, 0.8944) = −(1, −2)/√5. The NumPy version used here (2.5) returns a complex dtype even though the imaginary parts are 0; for symmetric matrices use <code>np.linalg.eigh</code>, which returns real results (Lesson 10.1).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Accepting x = 0 as an eigenvector — it is excluded by definition.</li><li>Computing det(A) − λ instead of det(A − λI).</li><li>Thinking row reduction preserves eigenvalues — it does not (it changes the matrix).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Ax = λx with x ≠ 0; eigenvalues are the roots of det(A − λI) = 0.</li><li>Eigenvectors for λ = non-zero vectors of N(A − λI).</li><li>Sum of eigenvalues = trace; product = det.</li><li>Triangular ⇒ diagonal entries; rotations ⇒ complex eigenvalues.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/eigenvalues" target="_blank" rel="noopener">3Blue1Brown — Eigenvectors and eigenvalues</a></li><li><a href="https://www.3blue1brown.com/lessons/quick-eigen" target="_blank" rel="noopener">3Blue1Brown — A quick trick for computing eigenvalues</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-21-eigenvalues-and-eigenvectors/" target="_blank" rel="noopener">MIT 18.06 — Lecture 21: Eigenvalues and eigenvectors</a></li><li><a href="https://textbooks.math.gatech.edu/ila/characteristic-polynomial.html" target="_blank" rel="noopener">Interactive Linear Algebra — The Characteristic Polynomial</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the eigenvalues of [[2, 0], [0, −3]] and of [[3, 7], [0, −1]].</li><li>Find the eigenvalues and eigenvectors of [[3, 1], [0, 2]].</li><li>A 2×2 matrix has eigenvalues 2 and 5. Find its trace and determinant, and the eigenvalues of A<sup>2</sup> and A<sup>−1</sup>.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 2, −3; 3, −1 (triangular). 2) λ = 3: (1, 0); λ = 2: A − 2I = [[1, 1], [0, 0]] ⇒ (1, −1). 3) trace 7, det 10; A<sup>2</sup>: 4, 25; A<sup>−1</sup>: 1/2, 1/5.</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 8 · Bài 8.1</span>
<h2>Trị riêng và vectơ riêng</h2>
<p class="lead">Hầu hết vectơ bị đổi hướng khi ma trận tác động. Vài vectơ đặc biệt thì không — chúng chỉ bị kéo giãn. Các <strong>vectơ riêng</strong> đó và hệ số giãn của chúng, các <strong>trị riêng</strong>, cho thấy ma trận thực sự làm gì, và đứng sau PageRank, phân tích dao động, PCA và tính ổn định của mọi hệ động lực.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu định nghĩa Ax = λx và kiểm một cặp riêng cho trước.</li><li>Tìm trị riêng từ phương trình đặc trưng det(A − λI) = 0.</li><li>Tìm vectơ riêng là không gian null của A − λI.</li><li>Dùng vết = tổng, det = tích các trị riêng; nhận ra trị riêng phức.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Định nghĩa</span>Ax = λx,  x ≠ 0    λ = trị riêng, x = vectơ riêng</div>
<p>Viết lại thành (A − λI)x = 0. Có nghiệm khác 0 đúng khi A − λI suy biến:</p>
<div class="formula"><span class="lbl">Phương trình đặc trưng</span>det(A − λI) = 0   (đa thức bậc n theo λ ⇒ n trị riêng, tính cả bội, có thể phức)</div>
<p><strong>Cách làm.</strong> (1) Tính det(A − λI) và tìm nghiệm λ. (2) Với mỗi λ, giải (A − λI)x = 0; các nghiệm (trừ 0) là vectơ riêng, và cùng với 0 chúng tạo thành <strong>không gian riêng</strong> N(A − λI). Mọi bội khác 0 của một vectơ riêng vẫn là vectơ riêng.</p>
<p><strong>Mẹo tính nhanh.</strong></p>
<ul><li>Với 2×2: λ<sup>2</sup> − (vết)λ + det = 0.</li><li>Luôn có: λ<sub>1</sub> + … + λ<sub>n</sub> = vết A (tổng đường chéo) và λ<sub>1</sub>λ<sub>2</sub>⋯λ<sub>n</sub> = det A. Vậy A khả nghịch ⇔ 0 không phải trị riêng.</li><li>Ma trận tam giác: trị riêng là các phần tử đường chéo.</li><li>Nếu Ax = λx thì A<sup>k</sup>x = λ<sup>k</sup>x và A<sup>−1</sup>x = (1/λ)x.</li></ul>
<p><strong>Ví dụ hình học.</strong> Phép chiếu P có trị riêng 1 (vectơ nằm trên đường/mặt đích) và 0 (vectơ bị chiếu về 0). Phép phản xạ có trị riêng 1 và −1. Phép quay 90°, [[0, −1], [1, 0]], làm mọi vectơ thực đổi hướng, nên không có vectơ riêng thực: λ<sup>2</sup> + 1 = 0 cho λ = ± i. Trị riêng phức báo hiệu có sự quay.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Tìm mọi cặp riêng</b> của</p>
<table class="matrix"><caption>A</caption><tbody><tr><td>4</td><td>1</td></tr><tr><td>2</td><td>3</td></tr></tbody></table>
<p>Bước 1: det(A − λI) = (4 − λ)(3 − λ) − 2 = λ<sup>2</sup> − 7λ + 10 = (λ − 5)(λ − 2). Trị riêng <b>λ<sub>1</sub> = 5, λ<sub>2</sub> = 2</b>. (Kiểm: 5 + 2 = 7 = vết, 5·2 = 10 = det ✓.)</p>
<p>Bước 2: λ = 5: A − 5I = [[−1, 1], [2, −2]] ⇒ −x<sub>1</sub> + x<sub>2</sub> = 0 ⇒ <b>x<sub>1</sub> = (1, 1)</b>. Kiểm: A(1, 1) = (5, 5) ✓.</p>
<p>Bước 3: λ = 2: A − 2I = [[2, 1], [2, 1]] ⇒ 2x<sub>1</sub> + x<sub>2</sub> = 0 ⇒ <b>x<sub>2</sub> = (1, −2)</b>. Kiểm: A(1, −2) = (2, −4) = 2(1, −2) ✓.</p></div>
<pre><code class="language-python">import numpy as np
A = np.array([[4, 1],
              [2, 3]], dtype=float)
vals, vecs = np.linalg.eig(A)
print(vals)
print(vecs.round(4))            # columns are unit eigenvectors
v = vecs[:, 0]
print(np.allclose(A @ v, vals[0] * v))
print(np.trace(A), round(np.linalg.det(A), 6))</code></pre>
<div class="out">[5.+0.j 2.+0.j]<br>[[ 0.7071+0.j -0.4472+0.j]<br> [ 0.7071+0.j  0.8944+0.j]]<br>True<br>7.0 10.0</div>
<p>NumPy chuẩn hoá vectơ riêng về độ dài 1: (0,7071; 0,7071) = (1, 1)/√2 và (−0,4472; 0,8944) = −(1, −2)/√5. Bản NumPy dùng ở đây (2.5) trả về kiểu số phức dù phần ảo bằng 0; với ma trận đối xứng hãy dùng <code>np.linalg.eigh</code>, hàm này trả kết quả thực (Bài 10.1).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nhận x = 0 là vectơ riêng — định nghĩa đã loại trừ nó.</li><li>Tính det(A) − λ thay vì det(A − λI).</li><li>Nghĩ phép biến đổi hàng giữ nguyên trị riêng — không (nó làm đổi ma trận).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Ax = λx với x ≠ 0; trị riêng là nghiệm của det(A − λI) = 0.</li><li>Vectơ riêng ứng với λ = các vectơ khác 0 của N(A − λI).</li><li>Tổng trị riêng = vết; tích = det.</li><li>Tam giác ⇒ các phần tử đường chéo; phép quay ⇒ trị riêng phức.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/eigenvalues" target="_blank" rel="noopener">3Blue1Brown — Vectơ riêng và trị riêng</a></li><li><a href="https://www.3blue1brown.com/lessons/quick-eigen" target="_blank" rel="noopener">3Blue1Brown — Mẹo tính nhanh trị riêng</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-21-eigenvalues-and-eigenvectors/" target="_blank" rel="noopener">MIT 18.06 — Bài 21: Trị riêng và vectơ riêng</a></li><li><a href="https://textbooks.math.gatech.edu/ila/characteristic-polynomial.html" target="_blank" rel="noopener">Interactive Linear Algebra — Đa thức đặc trưng</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm trị riêng của [[2, 0], [0, −3]] và của [[3, 7], [0, −1]].</li><li>Tìm trị riêng và vectơ riêng của [[3, 1], [0, 2]].</li><li>Ma trận 2×2 có trị riêng 2 và 5. Tìm vết, định thức, và trị riêng của A<sup>2</sup>, A<sup>−1</sup>.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 2, −3; 3, −1 (tam giác). 2) λ = 3: (1, 0); λ = 2: A − 2I = [[1, 1], [0, 0]] ⇒ (1, −1). 3) vết 7, det 10; A<sup>2</sup>: 4, 25; A<sup>−1</sup>: 1/2, 1/5.</p></div>`);

const c82 = L('maa102-ts-8-2',
  '8.2 — Diagonalization and powers of a matrix|||8.2 — Chéo hoá và luỹ thừa của ma trận',
  'A = PDP⁻¹ khi có n vectơ riêng độc lập, điều kiện chéo hoá được (trị riêng phân biệt), ma trận không chéo hoá được, Aᵏ = PDᵏP⁻¹, số Fibonacci bằng trị riêng — có code NumPy.',
  `<span class="eyebrow">MAA102 · Chapter 8 · Lesson 8.2</span>
<h2>Diagonalization and powers of a matrix</h2>
<p class="lead">In the basis of its eigenvectors a matrix becomes diagonal — it just stretches each axis. That makes high powers A<sup>k</sup>, which describe a system evolving step by step, almost free to compute and easy to understand.</p>
<h3>🎯 Objectives</h3>
<ul><li>Diagonalize A = PDP<sup>−1</sup> when possible.</li><li>Decide whether a matrix is diagonalizable.</li><li>Compute A<sup>k</sup> and predict its long-term behaviour from the largest eigenvalue.</li><li>Derive the Fibonacci formula from eigenvalues.</li></ul>
<h3>📖 Lecture</h3>
<p>Suppose A (n×n) has n independent eigenvectors x<sub>1</sub>, …, x<sub>n</sub> with eigenvalues λ<sub>1</sub>, …, λ<sub>n</sub>. Put them as the columns of P and the eigenvalues on the diagonal of D. Then AP = PD (column by column this is Ax<sub>i</sub> = λ<sub>i</sub>x<sub>i</sub>), so:</p>
<div class="formula"><span class="lbl">Diagonalization</span>A = P D P<sup>−1</sup>    D = diag(λ<sub>1</sub>, …, λ<sub>n</sub>),   P = [x<sub>1</sub> … x<sub>n</sub>]</div>
<p>This is the change of basis of Lesson 7.3 with the eigenvectors as the new basis. <strong>When does it work?</strong></p>
<ul><li>If the n eigenvalues are <strong>distinct</strong>, the eigenvectors are automatically independent ⇒ diagonalizable.</li><li>With repeated eigenvalues it may fail: [[1, 1], [0, 1]] has λ = 1 twice, but A − I = [[0, 1], [0, 0]] has a one-dimensional nullspace, so only one independent eigenvector ⇒ <strong>not diagonalizable</strong>.</li><li>Symmetric matrices are always diagonalizable, even with an orthogonal P (Chapter 10).</li></ul>
<div class="formula"><span class="lbl">Powers</span>A<sup>k</sup> = P D<sup>k</sup> P<sup>−1</sup>    D<sup>k</sup> = diag(λ<sub>1</sub><sup>k</sup>, …, λ<sub>n</sub><sup>k</sup>)</div>
<p><strong>Dynamics.</strong> For u<sub>k+1</sub> = Au<sub>k</sub>, write u<sub>0</sub> = c<sub>1</sub>x<sub>1</sub> + … + c<sub>n</sub>x<sub>n</sub>; then u<sub>k</sub> = c<sub>1</sub>λ<sub>1</sub><sup>k</sup>x<sub>1</sub> + … + c<sub>n</sub>λ<sub>n</sub><sup>k</sup>x<sub>n</sub>. The term with the largest |λ| dominates: if all |λ| &lt; 1 the system decays to 0; if some |λ| &gt; 1 it blows up. The same principle explains exploding and vanishing gradients in deep recurrent networks — repeated multiplication by the same weight matrix.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — diagonalize and compute A<sup>3</sup>.</b> A = [[4, 1], [2, 3]] with λ = 5, x = (1, 1) and λ = 2, x = (1, −2) (Lesson 8.1).</p>
<table class="matrix"><caption>P</caption><tbody><tr><td>1</td><td>1</td></tr><tr><td>1</td><td>−2</td></tr></tbody></table>
<table class="matrix"><caption>D</caption><tbody><tr><td>5</td><td>0</td></tr><tr><td>0</td><td>2</td></tr></tbody></table>
<table class="matrix"><caption>P<sup>−1</sup></caption><tbody><tr><td>2/3</td><td>1/3</td></tr><tr><td>1/3</td><td>−1/3</td></tr></tbody></table>
<p>Then A<sup>3</sup> = P·diag(125, 8)·P<sup>−1</sup> = [[86, 39], [78, 47]] — the same as multiplying A·A·A directly. And A<sup>10</sup>(1, 1) = 5<sup>10</sup>(1, 1) = (9 765 625, 9 765 625) with no multiplication of matrices at all.</p></div>
<div class="callout"><p><b>Example 2 — Fibonacci.</b> F<sub>k+2</sub> = F<sub>k+1</sub> + F<sub>k</sub> is u<sub>k+1</sub> = Au<sub>k</sub> with u<sub>k</sub> = (F<sub>k+1</sub>, F<sub>k</sub>) and A = [[1, 1], [1, 0]]. Its eigenvalues solve λ<sup>2</sup> − λ − 1 = 0: φ = (1 + √5)/2 ≈ 1.618 and ψ = (1 − √5)/2 ≈ −0.618. Diagonalizing gives Binet's formula F<sub>n</sub> = (φ<sup>n</sup> − ψ<sup>n</sup>)/√5; since |ψ| &lt; 1, F<sub>n</sub> grows like φ<sup>n</sup>/√5 and F<sub>n+1</sub>/F<sub>n</sub> → φ, the golden ratio.</p></div>
<pre><code class="language-python">import numpy as np
F = np.array([[1, 1],
              [1, 0]])
print(np.linalg.matrix_power(F, 10))
phi = (1 + 5 ** 0.5) / 2
psi = (1 - 5 ** 0.5) / 2
n = 10
print(round((phi**n - psi**n) / 5 ** 0.5))
print(np.linalg.eigvals(F.astype(float)).real.round(6))</code></pre>
<div class="out">[[89 55]<br> [55 34]]<br>55<br>[ 1.618034 -0.618034]</div>
<p>F<sup>10</sup> = [[F<sub>11</sub>, F<sub>10</sub>], [F<sub>10</sub>, F<sub>9</sub>]] = [[89, 55], [55, 34]], and Binet's formula gives F<sub>10</sub> = 55 ✓.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Putting the eigenvalues in D in a different order from the eigenvectors in P.</li><li>Writing A = P<sup>−1</sup>DP — with eigenvectors as the columns of P it is A = PDP<sup>−1</sup>.</li><li>Assuming every matrix is diagonalizable; check for n independent eigenvectors.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>n independent eigenvectors ⇒ A = PDP<sup>−1</sup>.</li><li>Distinct eigenvalues ⇒ diagonalizable; repeated ones may fail ([[1, 1], [0, 1]]).</li><li>A<sup>k</sup> = PD<sup>k</sup>P<sup>−1</sup>; the largest |λ| controls long-run growth.</li><li>Fibonacci grows like φ<sup>n</sup>, φ = golden ratio = largest eigenvalue.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-22-diagonalization-and-powers-of-a/" target="_blank" rel="noopener">MIT 18.06 — Lecture 22: Diagonalization and powers of A</a></li><li><a href="https://textbooks.math.gatech.edu/ila/diagonalization.html" target="_blank" rel="noopener">Interactive Linear Algebra — Diagonalization</a></li><li><a href="https://en.wikipedia.org/wiki/Diagonalizable_matrix" target="_blank" rel="noopener">Wikipedia — Diagonalizable matrix</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Diagonalize [[3, 1], [0, 2]].</li><li>Is [[2, 1], [0, 2]] diagonalizable?</li><li>For A = [[4, 1], [2, 3]], compute A<sup>10</sup>(1, −2) without multiplying matrices.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) P = [[1, 1], [0, −1]], D = diag(3, 2) (eigenvectors (1, 0) for 3 and (1, −1) for 2). 2) No: λ = 2 twice, A − 2I = [[0, 1], [0, 0]] gives only one independent eigenvector. 3) (1, −2) is an eigenvector for λ = 2: 2<sup>10</sup>(1, −2) = (1024, −2048).</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 8 · Bài 8.2</span>
<h2>Chéo hoá và luỹ thừa của ma trận</h2>
<p class="lead">Theo cơ sở gồm các vectơ riêng, ma trận trở thành ma trận chéo — nó chỉ kéo giãn từng trục. Nhờ đó luỹ thừa cao A<sup>k</sup>, thứ mô tả một hệ tiến triển từng bước, gần như được tính miễn phí và dễ hiểu.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Chéo hoá A = PDP<sup>−1</sup> khi có thể.</li><li>Quyết định một ma trận có chéo hoá được không.</li><li>Tính A<sup>k</sup> và dự đoán hành vi dài hạn từ trị riêng lớn nhất.</li><li>Rút ra công thức Fibonacci từ trị riêng.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Giả sử A (n×n) có n vectơ riêng độc lập x<sub>1</sub>, …, x<sub>n</sub> với trị riêng λ<sub>1</sub>, …, λ<sub>n</sub>. Xếp chúng làm cột của P và đặt trị riêng lên đường chéo của D. Khi đó AP = PD (theo từng cột đó là Ax<sub>i</sub> = λ<sub>i</sub>x<sub>i</sub>), nên:</p>
<div class="formula"><span class="lbl">Chéo hoá</span>A = P D P<sup>−1</sup>    D = diag(λ<sub>1</sub>, …, λ<sub>n</sub>),   P = [x<sub>1</sub> … x<sub>n</sub>]</div>
<p>Đây là phép đổi cơ sở ở Bài 7.3 với các vectơ riêng làm cơ sở mới. <strong>Khi nào làm được?</strong></p>
<ul><li>Nếu n trị riêng <strong>phân biệt</strong>, các vectơ riêng tự động độc lập ⇒ chéo hoá được.</li><li>Có trị riêng lặp thì có thể hỏng: [[1, 1], [0, 1]] có λ = 1 hai lần, nhưng A − I = [[0, 1], [0, 0]] có không gian null một chiều, nên chỉ có một vectơ riêng độc lập ⇒ <strong>không chéo hoá được</strong>.</li><li>Ma trận đối xứng luôn chéo hoá được, thậm chí với P trực giao (Chương 10).</li></ul>
<div class="formula"><span class="lbl">Luỹ thừa</span>A<sup>k</sup> = P D<sup>k</sup> P<sup>−1</sup>    D<sup>k</sup> = diag(λ<sub>1</sub><sup>k</sup>, …, λ<sub>n</sub><sup>k</sup>)</div>
<p><strong>Động lực học.</strong> Với u<sub>k+1</sub> = Au<sub>k</sub>, viết u<sub>0</sub> = c<sub>1</sub>x<sub>1</sub> + … + c<sub>n</sub>x<sub>n</sub>; khi đó u<sub>k</sub> = c<sub>1</sub>λ<sub>1</sub><sup>k</sup>x<sub>1</sub> + … + c<sub>n</sub>λ<sub>n</sub><sup>k</sup>x<sub>n</sub>. Số hạng có |λ| lớn nhất áp đảo: nếu mọi |λ| &lt; 1 hệ tắt dần về 0; nếu có |λ| &gt; 1 hệ bùng nổ. Cùng nguyên lý đó giải thích hiện tượng gradient bùng nổ và tiêu biến trong mạng hồi quy sâu — nhân lặp lại với cùng một ma trận trọng số.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — chéo hoá và tính A<sup>3</sup>.</b> A = [[4, 1], [2, 3]] với λ = 5, x = (1, 1) và λ = 2, x = (1, −2) (Bài 8.1).</p>
<table class="matrix"><caption>P</caption><tbody><tr><td>1</td><td>1</td></tr><tr><td>1</td><td>−2</td></tr></tbody></table>
<table class="matrix"><caption>D</caption><tbody><tr><td>5</td><td>0</td></tr><tr><td>0</td><td>2</td></tr></tbody></table>
<table class="matrix"><caption>P<sup>−1</sup></caption><tbody><tr><td>2/3</td><td>1/3</td></tr><tr><td>1/3</td><td>−1/3</td></tr></tbody></table>
<p>Khi đó A<sup>3</sup> = P·diag(125, 8)·P<sup>−1</sup> = [[86, 39], [78, 47]] — đúng bằng nhân trực tiếp A·A·A. Và A<sup>10</sup>(1, 1) = 5<sup>10</sup>(1, 1) = (9 765 625, 9 765 625) mà không cần nhân ma trận nào.</p></div>
<div class="callout"><p><b>Ví dụ 2 — Fibonacci.</b> F<sub>k+2</sub> = F<sub>k+1</sub> + F<sub>k</sub> chính là u<sub>k+1</sub> = Au<sub>k</sub> với u<sub>k</sub> = (F<sub>k+1</sub>, F<sub>k</sub>) và A = [[1, 1], [1, 0]]. Trị riêng của nó là nghiệm của λ<sup>2</sup> − λ − 1 = 0: φ = (1 + √5)/2 ≈ 1,618 và ψ = (1 − √5)/2 ≈ −0,618. Chéo hoá cho công thức Binet F<sub>n</sub> = (φ<sup>n</sup> − ψ<sup>n</sup>)/√5; vì |ψ| &lt; 1 nên F<sub>n</sub> tăng như φ<sup>n</sup>/√5 và F<sub>n+1</sub>/F<sub>n</sub> → φ, tỉ lệ vàng.</p></div>
<pre><code class="language-python">import numpy as np
F = np.array([[1, 1],
              [1, 0]])
print(np.linalg.matrix_power(F, 10))
phi = (1 + 5 ** 0.5) / 2
psi = (1 - 5 ** 0.5) / 2
n = 10
print(round((phi**n - psi**n) / 5 ** 0.5))
print(np.linalg.eigvals(F.astype(float)).real.round(6))</code></pre>
<div class="out">[[89 55]<br> [55 34]]<br>55<br>[ 1.618034 -0.618034]</div>
<p>F<sup>10</sup> = [[F<sub>11</sub>, F<sub>10</sub>], [F<sub>10</sub>, F<sub>9</sub>]] = [[89, 55], [55, 34]], và công thức Binet cho F<sub>10</sub> = 55 ✓.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Xếp trị riêng trong D khác thứ tự với vectơ riêng trong P.</li><li>Viết A = P<sup>−1</sup>DP — khi vectơ riêng là cột của P thì A = PDP<sup>−1</sup>.</li><li>Cho rằng ma trận nào cũng chéo hoá được; hãy kiểm có n vectơ riêng độc lập.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>n vectơ riêng độc lập ⇒ A = PDP<sup>−1</sup>.</li><li>Trị riêng phân biệt ⇒ chéo hoá được; trị riêng lặp có thể hỏng ([[1, 1], [0, 1]]).</li><li>A<sup>k</sup> = PD<sup>k</sup>P<sup>−1</sup>; |λ| lớn nhất quyết định tăng trưởng dài hạn.</li><li>Fibonacci tăng như φ<sup>n</sup>, φ = tỉ lệ vàng = trị riêng lớn nhất.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-22-diagonalization-and-powers-of-a/" target="_blank" rel="noopener">MIT 18.06 — Bài 22: Chéo hoá và luỹ thừa của A</a></li><li><a href="https://textbooks.math.gatech.edu/ila/diagonalization.html" target="_blank" rel="noopener">Interactive Linear Algebra — Chéo hoá</a></li><li><a href="https://en.wikipedia.org/wiki/Diagonalizable_matrix" target="_blank" rel="noopener">Wikipedia — Diagonalizable matrix</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Chéo hoá [[3, 1], [0, 2]].</li><li>[[2, 1], [0, 2]] có chéo hoá được không?</li><li>Với A = [[4, 1], [2, 3]], tính A<sup>10</sup>(1, −2) mà không nhân ma trận.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) P = [[1, 1], [0, −1]], D = diag(3, 2) (vectơ riêng (1, 0) cho 3 và (1, −1) cho 2). 2) Không: λ = 2 hai lần, A − 2I = [[0, 1], [0, 0]] chỉ cho một vectơ riêng độc lập. 3) (1, −2) là vectơ riêng ứng λ = 2: 2<sup>10</sup>(1, −2) = (1024, −2048).</p></div>`);

const c83 = L('maa102-ts-8-3',
  '8.3 — Applications: Markov chains and Google PageRank|||8.3 — Ứng dụng: xích Markov và Google PageRank',
  'Ma trận Markov (cột tổng bằng 1), trạng thái dừng là vectơ riêng ứng trị riêng 1, trị riêng thứ hai quyết định tốc độ hội tụ, phương pháp luỹ thừa, PageRank với hệ số giảm chấn 0,85 — có code NumPy chạy thật.',
  `<span class="eyebrow">MAA102 · Chapter 8 · Lesson 8.3</span>
<h2>Applications: Markov chains and Google PageRank</h2>
<p class="lead">How do market shares settle down? How did Google decide which page is most important among billions? Both questions have the same answer: find the eigenvector of a Markov matrix for the eigenvalue 1.</p>
<h3>🎯 Objectives</h3>
<ul><li>Recognise a Markov (column-stochastic) matrix and set up a Markov chain.</li><li>Find the steady state as the eigenvector for λ = 1.</li><li>Explain convergence with the second eigenvalue and the power method.</li><li>Build and compute a small PageRank.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>Markov matrix</strong> M has non-negative entries and every <em>column</em> sums to 1. Entry m<sub>ij</sub> is the probability of moving from state j to state i in one step. A probability vector x<sub>k</sub> (non-negative, entries sum to 1) evolves by x<sub>k+1</sub> = Mx<sub>k</sub>.</p>
<div class="formula"><span class="lbl">Key facts</span>λ = 1 is always an eigenvalue    all other |λ| ≤ 1    steady state: Mx = x</div>
<p>Why 1? Each column sums to 1, so (1, 1, …, 1)M = (1, 1, …, 1): the all-ones vector is an eigenvector of M<sup>T</sup> with eigenvalue 1, and M has the same eigenvalues as M<sup>T</sup>. If all entries of M are positive, the steady state is unique and every starting distribution converges to it; the error shrinks like |λ<sub>2</sub>|<sup>k</sup>, where λ<sub>2</sub> is the second-largest eigenvalue in absolute value.</p>
<p><strong>The power method.</strong> Repeatedly multiplying any starting vector by M is the simplest algorithm for the dominant eigenvector — and the only practical one for a matrix with billions of rows, because each step only needs a sparse matrix–vector product.</p>
<p><strong>PageRank.</strong> Model a random surfer: from a page with k outgoing links, follow each with probability 1/k. This gives a Markov matrix L. To guarantee a unique answer, with probability 1 − d (Google used d = 0.85) the surfer jumps to a random page:</p>
<div class="formula"><span class="lbl">Google matrix</span>G = d·L + ((1 − d)/n)·J    (J = all-ones matrix)    PageRank r: Gr = r, entries sum to 1</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — market share.</b> Two phone networks A and B. Each month 10% of A's customers switch to B and 20% of B's switch to A:</p>
<table class="matrix"><caption>M</caption><tbody><tr><td>0.9</td><td>0.2</td></tr><tr><td>0.1</td><td>0.8</td></tr></tbody></table>
<p>Step 1: eigenvalues: trace 1.7, det 0.72 − 0.02 = 0.7 ⇒ λ = 1 and λ = 0.7. Step 2: (M − I)x = 0: −0.1x<sub>1</sub> + 0.2x<sub>2</sub> = 0 ⇒ x<sub>1</sub> = 2x<sub>2</sub>. Normalise to sum 1: <b>steady state (2/3, 1/3)</b>. In the long run A holds two thirds of the market, whatever the starting shares. Step 3: the gap to the steady state shrinks by the factor 0.7 each month.</p></div>
<div class="callout"><p><b>Example 2 — four web pages.</b> Links: 1 → 2, 3; 2 → 3; 3 → 1; 4 → 1, 3. Column j of L spreads page j's vote over its out-links.</p></div>
<pre><code class="language-python">import numpy as np
M = np.array([[0.9, 0.2],
              [0.1, 0.8]])        # columns sum to 1
x = np.array([0.5, 0.5])
for k in range(1, 31):
    x = M @ x
    if k in (1, 2, 10, 30):
        print(k, x.round(4))
# PageRank on 4 pages: 1->2,3  2->3  3->1  4->1,3
L = np.array([[0,   0, 1, 0.5],
              [0.5, 0, 0, 0  ],
              [0.5, 1, 0, 0.5],
              [0,   0, 0, 0  ]])
d, n = 0.85, 4
G = d * L + (1 - d) / n * np.ones((n, n))
r = np.ones(n) / n
for _ in range(100):
    r = G @ r
print(r.round(4), r.sum().round(4))</code></pre>
<div class="out">1 [0.55 0.45]<br>2 [0.585 0.415]<br>10 [0.662 0.338]<br>30 [0.6667 0.3333]<br>[0.3797 0.1989 0.3839 0.0375] 1.0</div>
<p>The market converges to (2/3, 1/3). In the web, page 3 ranks highest (it receives links from three pages), page 1 is close behind (it receives page 3's whole vote), and page 4 — which no page links to — gets only the random-jump share (1 − 0.85)/4 = 0.0375.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Making <em>rows</em> sum to 1 and then multiplying Mx — with column vectors, columns must sum to 1.</li><li>Forgetting to normalise the eigenvector so its entries sum to 1.</li><li>Leaving out the damping term: with pages that have no out-links or closed loops, L alone may have no unique steady state.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Markov matrix: non-negative, columns sum to 1; x<sub>k+1</sub> = Mx<sub>k</sub>.</li><li>Steady state = eigenvector for λ = 1, scaled to sum 1.</li><li>Convergence speed ∼ |λ<sub>2</sub>|<sup>k</sup>; the power method finds the dominant eigenvector.</li><li>PageRank = steady state of G = dL + (1 − d)J/n.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/stochastic-matrices.html" target="_blank" rel="noopener">Interactive Linear Algebra — Stochastic Matrices (includes PageRank)</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-24-markov-matrices-fourier-series/" target="_blank" rel="noopener">MIT 18.06 — Lecture 24: Markov matrices; Fourier series</a></li><li><a href="https://en.wikipedia.org/wiki/PageRank" target="_blank" rel="noopener">Wikipedia — PageRank</a></li><li><a href="https://en.wikipedia.org/wiki/Stochastic_matrix" target="_blank" rel="noopener">Wikipedia — Stochastic matrix</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the steady state of M = [[0.5, 0.25], [0.5, 0.75]].</li><li>What is the second eigenvalue of that M, and what does it say about convergence?</li><li>In the four-page example, why is page 4's rank exactly 0.0375?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) −0.5x<sub>1</sub> + 0.25x<sub>2</sub> = 0 ⇒ x<sub>2</sub> = 2x<sub>1</sub> ⇒ (1/3, 2/3). 2) trace 1.25 = 1 + λ<sub>2</sub> ⇒ λ<sub>2</sub> = 0.25: the error shrinks 4 times per step (fast). 3) No page links to it, so it only receives the random-jump probability (1 − d)/n = 0.15/4.</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 8 · Bài 8.3</span>
<h2>Ứng dụng: xích Markov và Google PageRank</h2>
<p class="lead">Thị phần ổn định về đâu? Google đã quyết định trang nào quan trọng nhất trong hàng tỉ trang như thế nào? Hai câu hỏi có cùng một đáp án: tìm vectơ riêng của một ma trận Markov ứng với trị riêng 1.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận biết ma trận Markov (ngẫu nhiên theo cột) và lập một xích Markov.</li><li>Tìm trạng thái dừng là vectơ riêng ứng λ = 1.</li><li>Giải thích sự hội tụ bằng trị riêng thứ hai và phương pháp luỹ thừa.</li><li>Dựng và tính một PageRank nhỏ.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Ma trận Markov</strong> M có các phần tử không âm và mỗi <em>cột</em> có tổng bằng 1. Phần tử m<sub>ij</sub> là xác suất chuyển từ trạng thái j sang trạng thái i sau một bước. Một vectơ xác suất x<sub>k</sub> (không âm, tổng các phần tử bằng 1) tiến triển theo x<sub>k+1</sub> = Mx<sub>k</sub>.</p>
<div class="formula"><span class="lbl">Sự kiện then chốt</span>λ = 1 luôn là trị riêng    mọi |λ| khác ≤ 1    trạng thái dừng: Mx = x</div>
<p>Vì sao là 1? Mỗi cột có tổng 1, nên (1, 1, …, 1)M = (1, 1, …, 1): vectơ toàn số 1 là vectơ riêng của M<sup>T</sup> ứng trị riêng 1, và M có cùng trị riêng với M<sup>T</sup>. Nếu mọi phần tử của M dương, trạng thái dừng là duy nhất và mọi phân phối ban đầu đều hội tụ về nó; sai số giảm như |λ<sub>2</sub>|<sup>k</sup>, với λ<sub>2</sub> là trị riêng có trị tuyệt đối lớn thứ hai.</p>
<p><strong>Phương pháp luỹ thừa.</strong> Nhân lặp lại một vectơ ban đầu bất kỳ với M là thuật toán đơn giản nhất để tìm vectơ riêng trội — và là cách thực tế duy nhất cho ma trận có hàng tỉ hàng, vì mỗi bước chỉ cần một phép nhân ma trận thưa với vectơ.</p>
<p><strong>PageRank.</strong> Mô hình người lướt web ngẫu nhiên: từ một trang có k liên kết ra, đi theo mỗi liên kết với xác suất 1/k. Điều đó cho ma trận Markov L. Để chắc chắn có đáp án duy nhất, với xác suất 1 − d (Google dùng d = 0,85) người lướt nhảy tới một trang ngẫu nhiên:</p>
<div class="formula"><span class="lbl">Ma trận Google</span>G = d·L + ((1 − d)/n)·J    (J = ma trận toàn số 1)    PageRank r: Gr = r, tổng các phần tử bằng 1</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — thị phần.</b> Hai nhà mạng A và B. Mỗi tháng 10% khách của A chuyển sang B và 20% khách của B chuyển sang A:</p>
<table class="matrix"><caption>M</caption><tbody><tr><td>0.9</td><td>0.2</td></tr><tr><td>0.1</td><td>0.8</td></tr></tbody></table>
<p>Bước 1: trị riêng: vết 1,7, det 0,72 − 0,02 = 0,7 ⇒ λ = 1 và λ = 0,7. Bước 2: (M − I)x = 0: −0,1x<sub>1</sub> + 0,2x<sub>2</sub> = 0 ⇒ x<sub>1</sub> = 2x<sub>2</sub>. Chuẩn hoá cho tổng bằng 1: <b>trạng thái dừng (2/3, 1/3)</b>. Về lâu dài A giữ hai phần ba thị trường, bất kể thị phần ban đầu. Bước 3: khoảng cách tới trạng thái dừng giảm theo hệ số 0,7 mỗi tháng.</p></div>
<div class="callout"><p><b>Ví dụ 2 — bốn trang web.</b> Liên kết: 1 → 2, 3; 2 → 3; 3 → 1; 4 → 1, 3. Cột j của L chia “phiếu bầu” của trang j đều cho các liên kết ra của nó.</p></div>
<pre><code class="language-python">import numpy as np
M = np.array([[0.9, 0.2],
              [0.1, 0.8]])        # columns sum to 1
x = np.array([0.5, 0.5])
for k in range(1, 31):
    x = M @ x
    if k in (1, 2, 10, 30):
        print(k, x.round(4))
# PageRank on 4 pages: 1->2,3  2->3  3->1  4->1,3
L = np.array([[0,   0, 1, 0.5],
              [0.5, 0, 0, 0  ],
              [0.5, 1, 0, 0.5],
              [0,   0, 0, 0  ]])
d, n = 0.85, 4
G = d * L + (1 - d) / n * np.ones((n, n))
r = np.ones(n) / n
for _ in range(100):
    r = G @ r
print(r.round(4), r.sum().round(4))</code></pre>
<div class="out">1 [0.55 0.45]<br>2 [0.585 0.415]<br>10 [0.662 0.338]<br>30 [0.6667 0.3333]<br>[0.3797 0.1989 0.3839 0.0375] 1.0</div>
<p>Thị phần hội tụ về (2/3, 1/3). Trong mạng web, trang 3 xếp cao nhất (được ba trang liên kết tới), trang 1 sát sau (nhận trọn phiếu của trang 3), còn trang 4 — không trang nào liên kết tới — chỉ nhận phần nhảy ngẫu nhiên (1 − 0,85)/4 = 0,0375.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Cho các <em>hàng</em> có tổng 1 rồi tính Mx — với vectơ cột, các cột phải có tổng 1.</li><li>Quên chuẩn hoá vectơ riêng cho tổng các phần tử bằng 1.</li><li>Bỏ số hạng giảm chấn: với trang không có liên kết ra hoặc vòng kín, riêng L có thể không có trạng thái dừng duy nhất.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Ma trận Markov: không âm, cột có tổng 1; x<sub>k+1</sub> = Mx<sub>k</sub>.</li><li>Trạng thái dừng = vectơ riêng ứng λ = 1, chia cho tổng.</li><li>Tốc độ hội tụ ∼ |λ<sub>2</sub>|<sup>k</sup>; phương pháp luỹ thừa tìm vectơ riêng trội.</li><li>PageRank = trạng thái dừng của G = dL + (1 − d)J/n.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/stochastic-matrices.html" target="_blank" rel="noopener">Interactive Linear Algebra — Ma trận ngẫu nhiên (có PageRank)</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-24-markov-matrices-fourier-series/" target="_blank" rel="noopener">MIT 18.06 — Bài 24: Ma trận Markov; chuỗi Fourier</a></li><li><a href="https://en.wikipedia.org/wiki/PageRank" target="_blank" rel="noopener">Wikipedia — PageRank</a></li><li><a href="https://en.wikipedia.org/wiki/Stochastic_matrix" target="_blank" rel="noopener">Wikipedia — Stochastic matrix</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm trạng thái dừng của M = [[0,5; 0,25], [0,5; 0,75]].</li><li>Trị riêng thứ hai của M đó là bao nhiêu, và nó nói gì về sự hội tụ?</li><li>Trong ví dụ bốn trang, vì sao hạng của trang 4 đúng bằng 0,0375?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) −0,5x<sub>1</sub> + 0,25x<sub>2</sub> = 0 ⇒ x<sub>2</sub> = 2x<sub>1</sub> ⇒ (1/3, 2/3). 2) vết 1,25 = 1 + λ<sub>2</sub> ⇒ λ<sub>2</sub> = 0,25: sai số giảm 4 lần mỗi bước (nhanh). 3) Không trang nào liên kết tới nó, nên nó chỉ nhận xác suất nhảy ngẫu nhiên (1 − d)/n = 0,15/4.</p></div>`);

const q8 = QZ(8, 'Quiz — Chapter 8: Eigenvalues, diagonalization, Markov|||Quiz — Chương 8: Trị riêng, chéo hoá, Markov', 'Kiểm tra chương 8: phương trình đặc trưng, vectơ riêng, vết/định thức, trị riêng phức, chéo hoá, luỹ thừa ma trận, trạng thái dừng Markov.', [
  Q('q1', 'The eigenvalues of [[4, 1], [2, 3]] are|||Trị riêng của [[4, 1], [2, 3]] là',
    ['4 and 3|||4 và 3', '5 and 2|||5 và 2', '7 and 10|||7 và 10', '1 and 6|||1 và 6'], 1,
    'λ² − 7λ + 10 = (λ − 5)(λ − 2).|||λ² − 7λ + 10 = (λ − 5)(λ − 2).'),
  Q('q2', 'An eigenvector of [[4, 1], [2, 3]] for λ = 5 is|||Một vectơ riêng của [[4, 1], [2, 3]] ứng λ = 5 là',
    ['(1, −2)|||(1, −2)', '(1, 1)|||(1, 1)', '(2, 1)|||(2, 1)', '(0, 0)|||(0, 0)'], 1,
    'A(1, 1) = (5, 5).|||A(1, 1) = (5, 5).'),
  Q('q3', 'The sum of the eigenvalues of A equals|||Tổng các trị riêng của A bằng',
    ['det A|||det A', 'the trace of A|||vết của A', 'the rank of A|||hạng của A', 'the largest entry|||phần tử lớn nhất'], 1,
    'And their product equals det A.|||Còn tích của chúng bằng det A.'),
  Q('q4', 'The eigenvalues of [[3, 7], [0, −1]] are|||Trị riêng của [[3, 7], [0, −1]] là',
    ['3 and −1|||3 và −1', '7 and 0|||7 và 0', '3 and 7|||3 và 7', '2 and −3|||2 và −3'], 0,
    'Triangular: read the diagonal.|||Tam giác: đọc đường chéo.'),
  Q('q5', 'The rotation by 90°, [[0, −1], [1, 0]], has eigenvalues|||Phép quay 90°, [[0, −1], [1, 0]], có trị riêng',
    ['1 and −1|||1 và −1', 'i and −i|||i và −i', '0 and 1|||0 và 1', '90 and −90|||90 và −90'], 1,
    'λ² + 1 = 0: no real eigenvector.|||λ² + 1 = 0: không có vectơ riêng thực.'),
  Q('q6', 'If A = PDP⁻¹ then Aᵏ =|||Nếu A = PDP⁻¹ thì Aᵏ =',
    ['PᵏDᵏ(P⁻¹)ᵏ only for k = 2|||PᵏDᵏ(P⁻¹)ᵏ chỉ khi k = 2', 'PDᵏP⁻¹|||PDᵏP⁻¹', 'P⁻¹DᵏP|||P⁻¹DᵏP', 'kPDP⁻¹|||kPDP⁻¹'], 1,
    'The inner P⁻¹P pairs cancel.|||Các cặp P⁻¹P ở giữa triệt tiêu.'),
  Q('q7', 'Which matrix is NOT diagonalizable?|||Ma trận nào KHÔNG chéo hoá được?',
    ['[[2, 0], [0, 3]]|||[[2, 0], [0, 3]]', '[[1, 1], [0, 1]]|||[[1, 1], [0, 1]]', '[[4, 1], [2, 3]]|||[[4, 1], [2, 3]]', '[[0, 1], [1, 0]]|||[[0, 1], [1, 0]]'], 1,
    'λ = 1 twice but only one independent eigenvector.|||λ = 1 hai lần nhưng chỉ một vectơ riêng độc lập.'),
  Q('q8', 'The steady state of M = [[0.9, 0.2], [0.1, 0.8]] is|||Trạng thái dừng của M = [[0.9, 0.2], [0.1, 0.8]] là',
    ['(1/2, 1/2)|||(1/2, 1/2)', '(2/3, 1/3)|||(2/3, 1/3)', '(1/3, 2/3)|||(1/3, 2/3)', '(0.9, 0.1)|||(0,9; 0,1)'], 1,
    '−0.1x₁ + 0.2x₂ = 0 ⇒ x₁ = 2x₂.|||−0,1x₁ + 0,2x₂ = 0 ⇒ x₁ = 2x₂.'),
  Q('q9', 'A square matrix is invertible exactly when|||Ma trận vuông khả nghịch đúng khi',
    ['all eigenvalues are positive|||mọi trị riêng dương', '0 is not an eigenvalue|||0 không phải trị riêng', '1 is an eigenvalue|||1 là trị riêng', 'it is diagonalizable|||nó chéo hoá được'], 1,
    'det A = product of eigenvalues.|||det A = tích các trị riêng.'),
]);

const ch8 = {
  title: 'Chapter 8 — Eigenvalues, eigenvectors and diagonalization|||Chương 8 — Trị riêng, vectơ riêng và chéo hoá',
  description: 'Ax = λx, phương trình đặc trưng, vết/định thức, trị riêng phức, chéo hoá A = PDP⁻¹, luỹ thừa ma trận và Fibonacci, xích Markov, phương pháp luỹ thừa và PageRank (Strang ch.6 · MIT 18.06 bài 21–24).',
  lessons: [c81, c82, c83, q8],
};


// ───────────────────────────── Chương 9 — Trực giao ─────────────────────────────
const c91 = L('maa102-ts-9-1',
  '9.1 — Orthogonal subspaces and projections|||9.1 — Không gian con trực giao và phép chiếu',
  'Không gian con trực giao, phần bù trực giao, hình chiếu lên đường thẳng p = (aᵀb / aᵀa)a, ma trận chiếu P = aaᵀ/aᵀa và P = A(AᵀA)⁻¹Aᵀ, tính chất P² = P = Pᵀ, chiếu lên mặt phẳng.',
  `<span class="eyebrow">MAA102 · Chapter 9 · Lesson 9.1</span>
<h2>Orthogonal subspaces and projections</h2>
<p class="lead">Projection answers “what is the closest point of a subspace to b?”. The answer is always found by dropping a perpendicular — and that single idea leads to least squares, Gram–Schmidt and PCA.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define orthogonal subspaces and orthogonal complements.</li><li>Project a vector onto a line and onto a subspace.</li><li>Build projection matrices and know their properties.</li><li>Split a vector into a part in a subspace and a part perpendicular to it.</li></ul>
<h3>📖 Lecture</h3>
<p>Two subspaces V and W are <strong>orthogonal</strong> if every v ∈ V is perpendicular to every w ∈ W. The <strong>orthogonal complement</strong> V<sup>⊥</sup> is the set of <em>all</em> vectors perpendicular to V; dim V + dim V<sup>⊥</sup> = n. From Lesson 6.3: N(A) = C(A<sup>T</sup>)<sup>⊥</sup> and N(A<sup>T</sup>) = C(A)<sup>⊥</sup>. Every b in R<sup>n</sup> splits uniquely as b = p + e with p ∈ V and e ∈ V<sup>⊥</sup>.</p>
<p><strong>Projection onto a line</strong> through a. We want p = x̂a with the error e = b − x̂a perpendicular to a: a<sup>T</sup>(b − x̂a) = 0.</p>
<div class="formula"><span class="lbl">Projection onto a line</span>x̂ = a<sup>T</sup>b / a<sup>T</sup>a    p = (a<sup>T</sup>b / a<sup>T</sup>a) a    P = a a<sup>T</sup> / a<sup>T</sup>a</div>
<p><strong>Projection onto a subspace</strong> C(A) (columns of A independent). The error must be perpendicular to every column: A<sup>T</sup>(b − Ax̂) = 0.</p>
<div class="formula"><span class="lbl">Projection onto C(A)</span>A<sup>T</sup>A x̂ = A<sup>T</sup>b    p = A x̂    P = A(A<sup>T</sup>A)<sup>−1</sup>A<sup>T</sup></div>
<p>Every projection matrix satisfies <strong>P<sup>2</sup> = P</strong> (projecting twice changes nothing) and <strong>P<sup>T</sup> = P</strong>. Its eigenvalues are 1 (on the subspace) and 0 (on the complement). I − P projects onto the orthogonal complement. For a plane with normal vector n in R<sup>3</sup>, the shortcut is P = I − nn<sup>T</sup>/n<sup>T</sup>n.</p>
<div class="note-ct"><p><strong>Where it is used.</strong> Shadows in graphics are projections. In NLP, removing a bias direction from word embeddings is x − (projection of x onto that direction). In signal processing, projecting onto a subspace of “clean” signals removes noise.</p></div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — onto a line.</b> a = (1, 2, 2), b = (1, 1, 1).</p>
<p>Step 1: a<sup>T</sup>b = 5, a<sup>T</sup>a = 9, so x̂ = 5/9. Step 2: p = (5/9)(1, 2, 2) = (5/9, 10/9, 10/9). Step 3: e = b − p = (4/9, −1/9, −1/9). Check: e·a = 4/9 − 2/9 − 2/9 = 0 ✓.</p></div>
<div class="callout"><p><b>Example 2 — onto a plane.</b> Project b = (3, 0, 0) onto the plane x + y + z = 0 (normal n = (1, 1, 1)).</p>
<p>The component along n is (n·b / n·n) n = (3/3)(1, 1, 1) = (1, 1, 1). So p = b − (1, 1, 1) = <b>(2, −1, −1)</b>. Check: 2 − 1 − 1 = 0, p lies in the plane ✓. The matrix is</p>
<table class="matrix"><caption>P = I − nnᵀ/3</caption><tbody><tr><td>2/3</td><td>−1/3</td><td>−1/3</td></tr><tr><td>−1/3</td><td>2/3</td><td>−1/3</td></tr><tr><td>−1/3</td><td>−1/3</td><td>2/3</td></tr></tbody></table>
<p>and P(3, 0, 0) = (2, −1, −1) ✓.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Dividing by ‖a‖ instead of ‖a‖<sup>2</sup> = a<sup>T</sup>a in the projection formula.</li><li>Using P = A(A<sup>T</sup>A)<sup>−1</sup>A<sup>T</sup> = AA<sup>−1</sup>(A<sup>T</sup>)<sup>−1</sup>A<sup>T</sup> = I — that “simplification” is only valid when A is square and invertible.</li><li>Forgetting that p must lie <em>in</em> the subspace and e must be perpendicular to <em>all</em> of it.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>b = p + e with p in the subspace and e ⟂ the subspace; p is the closest point.</li><li>Line: p = (a<sup>T</sup>b/a<sup>T</sup>a)a, P = aa<sup>T</sup>/a<sup>T</sup>a.</li><li>Subspace C(A): A<sup>T</sup>Ax̂ = A<sup>T</sup>b, P = A(A<sup>T</sup>A)<sup>−1</sup>A<sup>T</sup>.</li><li>P<sup>2</sup> = P = P<sup>T</sup>; I − P projects onto the complement.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-14-orthogonal-vectors-and-subspaces/" target="_blank" rel="noopener">MIT 18.06 — Lecture 14: Orthogonal vectors and subspaces</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-15-projections-onto-subspaces/" target="_blank" rel="noopener">MIT 18.06 — Lecture 15: Projections onto subspaces</a></li><li><a href="https://textbooks.math.gatech.edu/ila/orthogonal-complements.html" target="_blank" rel="noopener">Interactive Linear Algebra — Orthogonal Complements</a></li><li><a href="https://textbooks.math.gatech.edu/ila/projections.html" target="_blank" rel="noopener">Interactive Linear Algebra — Orthogonal Projection</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Project b = (2, 3) onto the line through a = (1, 1); give p and e.</li><li>Write the projection matrix onto the line through (1, 2). Check P<sup>2</sup> = P on one entry.</li><li>Project (1, 2, 3) onto the plane x + y + z = 0.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) x̂ = 5/2: p = (2.5, 2.5), e = (−0.5, 0.5) ⟂ (1, 1). 2) P = (1/5)[[1, 2], [2, 4]]; (P<sup>2</sup>)<sub>11</sub> = (1·1 + 2·2)/25 = 1/5 ✓. 3) n·b/n·n = 6/3 = 2 ⇒ (1, 2, 3) − 2(1, 1, 1) = (−1, 0, 1).</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 9 · Bài 9.1</span>
<h2>Không gian con trực giao và phép chiếu</h2>
<p class="lead">Phép chiếu trả lời câu hỏi “điểm nào của không gian con gần b nhất?”. Đáp án luôn tìm bằng cách hạ đường vuông góc — và chỉ một ý tưởng đó dẫn tới bình phương tối thiểu, Gram–Schmidt và PCA.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa không gian con trực giao và phần bù trực giao.</li><li>Chiếu một vectơ lên đường thẳng và lên không gian con.</li><li>Lập ma trận chiếu và biết các tính chất của nó.</li><li>Tách một vectơ thành phần nằm trong không gian con và phần vuông góc với nó.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Hai không gian con V và W <strong>trực giao</strong> nếu mọi v ∈ V vuông góc với mọi w ∈ W. <strong>Phần bù trực giao</strong> V<sup>⊥</sup> là tập <em>mọi</em> vectơ vuông góc với V; dim V + dim V<sup>⊥</sup> = n. Từ Bài 6.3: N(A) = C(A<sup>T</sup>)<sup>⊥</sup> và N(A<sup>T</sup>) = C(A)<sup>⊥</sup>. Mọi b trong R<sup>n</sup> tách duy nhất thành b = p + e với p ∈ V và e ∈ V<sup>⊥</sup>.</p>
<p><strong>Chiếu lên đường thẳng</strong> qua a. Ta muốn p = x̂a với sai số e = b − x̂a vuông góc với a: a<sup>T</sup>(b − x̂a) = 0.</p>
<div class="formula"><span class="lbl">Chiếu lên đường thẳng</span>x̂ = a<sup>T</sup>b / a<sup>T</sup>a    p = (a<sup>T</sup>b / a<sup>T</sup>a) a    P = a a<sup>T</sup> / a<sup>T</sup>a</div>
<p><strong>Chiếu lên không gian con</strong> C(A) (các cột của A độc lập). Sai số phải vuông góc với mọi cột: A<sup>T</sup>(b − Ax̂) = 0.</p>
<div class="formula"><span class="lbl">Chiếu lên C(A)</span>A<sup>T</sup>A x̂ = A<sup>T</sup>b    p = A x̂    P = A(A<sup>T</sup>A)<sup>−1</sup>A<sup>T</sup></div>
<p>Mọi ma trận chiếu thoả <strong>P<sup>2</sup> = P</strong> (chiếu hai lần không đổi gì) và <strong>P<sup>T</sup> = P</strong>. Trị riêng của nó là 1 (trên không gian con) và 0 (trên phần bù). I − P chiếu lên phần bù trực giao. Với mặt phẳng có vectơ pháp tuyến n trong R<sup>3</sup>, công thức nhanh là P = I − nn<sup>T</sup>/n<sup>T</sup>n.</p>
<div class="note-ct"><p><strong>Dùng ở đâu.</strong> Bóng đổ trong đồ hoạ là phép chiếu. Trong NLP, xoá một hướng thiên lệch khỏi word embedding là x − (hình chiếu của x lên hướng đó). Trong xử lý tín hiệu, chiếu lên không gian con của các tín hiệu “sạch” giúp khử nhiễu.</p></div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — lên đường thẳng.</b> a = (1, 2, 2), b = (1, 1, 1).</p>
<p>Bước 1: a<sup>T</sup>b = 5, a<sup>T</sup>a = 9, nên x̂ = 5/9. Bước 2: p = (5/9)(1, 2, 2) = (5/9, 10/9, 10/9). Bước 3: e = b − p = (4/9, −1/9, −1/9). Kiểm: e·a = 4/9 − 2/9 − 2/9 = 0 ✓.</p></div>
<div class="callout"><p><b>Ví dụ 2 — lên mặt phẳng.</b> Chiếu b = (3, 0, 0) lên mặt phẳng x + y + z = 0 (pháp tuyến n = (1, 1, 1)).</p>
<p>Thành phần theo n là (n·b / n·n) n = (3/3)(1, 1, 1) = (1, 1, 1). Vậy p = b − (1, 1, 1) = <b>(2, −1, −1)</b>. Kiểm: 2 − 1 − 1 = 0, p nằm trong mặt phẳng ✓. Ma trận là</p>
<table class="matrix"><caption>P = I − nnᵀ/3</caption><tbody><tr><td>2/3</td><td>−1/3</td><td>−1/3</td></tr><tr><td>−1/3</td><td>2/3</td><td>−1/3</td></tr><tr><td>−1/3</td><td>−1/3</td><td>2/3</td></tr></tbody></table>
<p>và P(3, 0, 0) = (2, −1, −1) ✓.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chia cho ‖a‖ thay vì ‖a‖<sup>2</sup> = a<sup>T</sup>a trong công thức chiếu.</li><li>“Rút gọn” P = A(A<sup>T</sup>A)<sup>−1</sup>A<sup>T</sup> = AA<sup>−1</sup>(A<sup>T</sup>)<sup>−1</sup>A<sup>T</sup> = I — chỉ đúng khi A vuông và khả nghịch.</li><li>Quên rằng p phải nằm <em>trong</em> không gian con và e phải vuông góc với <em>toàn bộ</em> nó.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>b = p + e với p trong không gian con và e ⟂ không gian con; p là điểm gần nhất.</li><li>Đường thẳng: p = (a<sup>T</sup>b/a<sup>T</sup>a)a, P = aa<sup>T</sup>/a<sup>T</sup>a.</li><li>Không gian con C(A): A<sup>T</sup>Ax̂ = A<sup>T</sup>b, P = A(A<sup>T</sup>A)<sup>−1</sup>A<sup>T</sup>.</li><li>P<sup>2</sup> = P = P<sup>T</sup>; I − P chiếu lên phần bù.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-14-orthogonal-vectors-and-subspaces/" target="_blank" rel="noopener">MIT 18.06 — Bài 14: Vectơ và không gian con trực giao</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-15-projections-onto-subspaces/" target="_blank" rel="noopener">MIT 18.06 — Bài 15: Chiếu lên không gian con</a></li><li><a href="https://textbooks.math.gatech.edu/ila/orthogonal-complements.html" target="_blank" rel="noopener">Interactive Linear Algebra — Phần bù trực giao</a></li><li><a href="https://textbooks.math.gatech.edu/ila/projections.html" target="_blank" rel="noopener">Interactive Linear Algebra — Phép chiếu trực giao</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Chiếu b = (2, 3) lên đường thẳng qua a = (1, 1); cho p và e.</li><li>Viết ma trận chiếu lên đường thẳng qua (1, 2). Kiểm P<sup>2</sup> = P ở một phần tử.</li><li>Chiếu (1, 2, 3) lên mặt phẳng x + y + z = 0.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) x̂ = 5/2: p = (2,5; 2,5), e = (−0,5; 0,5) ⟂ (1, 1). 2) P = (1/5)[[1, 2], [2, 4]]; (P<sup>2</sup>)<sub>11</sub> = (1·1 + 2·2)/25 = 1/5 ✓. 3) n·b/n·n = 6/3 = 2 ⇒ (1, 2, 3) − 2(1, 1, 1) = (−1, 0, 1).</p></div>`);

const c92 = L('maa102-ts-9-2',
  '9.2 — Least squares and linear regression|||9.2 — Bình phương tối thiểu và hồi quy tuyến tính',
  'Hệ Ax = b vô nghiệm (nhiều dữ liệu hơn ẩn), nghiệm bình phương tối thiểu từ phương trình chuẩn AᵀAx̂ = Aᵀb, khớp đường thẳng qua dữ liệu, liên hệ hàm mất mát MSE trong học máy — có code numpy.linalg.lstsq.',
  `<span class="eyebrow">MAA102 · Chapter 9 · Lesson 9.2</span>
<h2>Least squares and linear regression</h2>
<p class="lead">Real data never lies exactly on a line. With more equations than unknowns, Ax = b usually has no solution — so we find the x̂ that makes the error as small as possible. This is <strong>linear regression</strong>, the first model of every machine-learning course.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain why an over-determined system usually has no exact solution.</li><li>Derive and solve the normal equations A<sup>T</sup>Ax̂ = A<sup>T</sup>b.</li><li>Fit a straight line to data points and compute the error.</li><li>Connect least squares with the mean-squared-error loss in ML.</li></ul>
<h3>📖 Lecture</h3>
<p>Suppose we measure y at times t<sub>1</sub>, …, t<sub>m</sub> and want a line y = C + Dt. Each point gives an equation C + Dt<sub>i</sub> = y<sub>i</sub>: m equations, 2 unknowns. In matrix form Ax = b with rows (1, t<sub>i</sub>). Since b is usually not in the plane C(A), we choose x̂ to minimise the squared error</p>
<div class="formula"><span class="lbl">Least-squares problem</span>minimise ‖b − Ax‖<sup>2</sup> = e<sub>1</sub><sup>2</sup> + e<sub>2</sub><sup>2</sup> + … + e<sub>m</sub><sup>2</sup></div>
<p>The closest point of C(A) to b is the projection p = Ax̂ (Lesson 9.1), so the error e = b − Ax̂ is perpendicular to every column of A:</p>
<div class="formula"><span class="lbl">Normal equations</span>A<sup>T</sup>A x̂ = A<sup>T</sup>b</div>
<p>If the columns of A are independent, A<sup>T</sup>A is invertible and x̂ is unique. Calculus gives the same equations: the gradient of ‖Ax − b‖<sup>2</sup> is 2A<sup>T</sup>(Ax − b), and setting it to 0 is exactly the normal equations. In machine learning that loss divided by m is the <strong>mean squared error</strong>; gradient descent on it converges to the same x̂, which is how huge regressions are solved when A<sup>T</sup>A is too big to form.</p>
<p>The model only has to be linear in the <em>unknowns</em>: fitting a parabola y = C + Dt + Et<sup>2</sup> uses columns 1, t, t<sup>2</sup> and is still least squares. In practice libraries solve least squares with QR or SVD (<code>np.linalg.lstsq</code>), which is more accurate than forming A<sup>T</sup>A.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Fit a line</b> through (0, 6), (1, 0), (2, 0).</p>
<table class="matrix"><caption>A</caption><tbody><tr><td>1</td><td>0</td></tr><tr><td>1</td><td>1</td></tr><tr><td>1</td><td>2</td></tr></tbody></table>
<p>b = (6, 0, 0). Step 1: A<sup>T</sup>A = [[3, 3], [3, 5]], A<sup>T</sup>b = (6, 0). Step 2: 3C + 3D = 6 and 3C + 5D = 0 ⇒ 2D = −6 ⇒ D = −3, C = 5. Best line <b>y = 5 − 3t</b>.</p>
<p>Step 3: p = Ax̂ = (5, 2, −1), e = b − p = (1, −2, 1), ‖e‖<sup>2</sup> = 1 + 4 + 1 = 6. Check e ⟂ columns: (1, 1, 1)·e = 0, (0, 1, 2)·e = −2 + 2 = 0 ✓.</p></div>
<pre><code class="language-python">import numpy as np
t = np.array([0, 1, 2], dtype=float)
b = np.array([6, 0, 0], dtype=float)
A = np.column_stack([np.ones_like(t), t])   # columns: 1, t
x_hat, res, rank, sv = np.linalg.lstsq(A, b, rcond=None)
print(x_hat)                  # [C, D] in y = C + D t
print(A @ x_hat)              # projection p
print(res)                    # squared error ||b - p||^2
print(np.linalg.solve(A.T @ A, A.T @ b))   # normal equations give the same</code></pre>
<div class="out">[ 5. -3.]<br>[ 5.  2. -1.]<br>[6.]<br>[ 5. -3.]</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Solving Ax = b by dropping equations until it is square — that ignores data and is not the best fit.</li><li>Forgetting the column of 1s (the intercept C).</li><li>Minimising the sum of errors instead of the sum of <em>squared</em> errors: positive and negative errors would cancel.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Over-determined Ax = b: minimise ‖b − Ax‖<sup>2</sup>.</li><li>Normal equations A<sup>T</sup>Ax̂ = A<sup>T</sup>b; p = Ax̂ is the projection of b onto C(A).</li><li>e = b − Ax̂ is perpendicular to all columns.</li><li>Linear regression = least squares; MSE gradient = 0 ⇔ normal equations.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-16-projection-matrices-and-least-squares/" target="_blank" rel="noopener">MIT 18.06 — Lecture 16: Projection matrices and least squares</a></li><li><a href="https://textbooks.math.gatech.edu/ila/least-squares.html" target="_blank" rel="noopener">Interactive Linear Algebra — The Method of Least Squares</a></li><li><a href="https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-9-four-ways-to-solve-least-squares-problems/" target="_blank" rel="noopener">MIT 18.065 — Lecture 9: Four ways to solve least squares problems</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.lstsq.html" target="_blank" rel="noopener">NumPy — numpy.linalg.lstsq</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Fit y = C + Dt to (0, 1), (1, 3), (2, 4).</li><li>If b already lies in C(A), what is the least-squares solution and the error?</li><li>Why must e be perpendicular to the column of 1s? What does that say about the sum of the errors?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) A<sup>T</sup>A = [[3, 3], [3, 5]], A<sup>T</sup>b = (8, 11) ⇒ D = 3/2, C = 7/6: y = 7/6 + 1.5t. 2) The exact solution of Ax = b, with e = 0. 3) Because e ⟂ every column; (1, …, 1)·e = 0 means the errors sum to 0 (the best line passes through the mean point).</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 9 · Bài 9.2</span>
<h2>Bình phương tối thiểu và hồi quy tuyến tính</h2>
<p class="lead">Dữ liệu thật không bao giờ nằm đúng trên một đường thẳng. Khi số phương trình nhiều hơn số ẩn, Ax = b thường vô nghiệm — nên ta tìm x̂ làm sai số nhỏ nhất có thể. Đó là <strong>hồi quy tuyến tính</strong>, mô hình đầu tiên của mọi khoá học máy.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích vì sao hệ quá xác định thường không có nghiệm đúng.</li><li>Rút ra và giải phương trình chuẩn A<sup>T</sup>Ax̂ = A<sup>T</sup>b.</li><li>Khớp đường thẳng qua các điểm dữ liệu và tính sai số.</li><li>Liên hệ bình phương tối thiểu với hàm mất mát sai số bình phương trung bình trong ML.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Giả sử ta đo y tại các thời điểm t<sub>1</sub>, …, t<sub>m</sub> và muốn một đường thẳng y = C + Dt. Mỗi điểm cho một phương trình C + Dt<sub>i</sub> = y<sub>i</sub>: m phương trình, 2 ẩn. Dạng ma trận Ax = b với các hàng (1, t<sub>i</sub>). Vì b thường không nằm trong mặt phẳng C(A), ta chọn x̂ cực tiểu hoá sai số bình phương</p>
<div class="formula"><span class="lbl">Bài toán bình phương tối thiểu</span>cực tiểu ‖b − Ax‖<sup>2</sup> = e<sub>1</sub><sup>2</sup> + e<sub>2</sub><sup>2</sup> + … + e<sub>m</sub><sup>2</sup></div>
<p>Điểm của C(A) gần b nhất là hình chiếu p = Ax̂ (Bài 9.1), nên sai số e = b − Ax̂ vuông góc với mọi cột của A:</p>
<div class="formula"><span class="lbl">Phương trình chuẩn</span>A<sup>T</sup>A x̂ = A<sup>T</sup>b</div>
<p>Nếu các cột của A độc lập, A<sup>T</sup>A khả nghịch và x̂ duy nhất. Giải tích cho cùng phương trình đó: gradient của ‖Ax − b‖<sup>2</sup> là 2A<sup>T</sup>(Ax − b), cho bằng 0 chính là phương trình chuẩn. Trong học máy, hàm mất mát đó chia cho m là <strong>sai số bình phương trung bình (MSE)</strong>; gradient descent trên nó hội tụ về cùng x̂, và đó là cách giải các bài hồi quy khổng lồ khi A<sup>T</sup>A quá lớn để lập ra.</p>
<p>Mô hình chỉ cần tuyến tính theo <em>ẩn</em>: khớp parabol y = C + Dt + Et<sup>2</sup> dùng các cột 1, t, t<sup>2</sup> và vẫn là bình phương tối thiểu. Thực tế các thư viện giải bình phương tối thiểu bằng QR hoặc SVD (<code>np.linalg.lstsq</code>), chính xác hơn việc lập A<sup>T</sup>A.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Khớp đường thẳng</b> qua (0, 6), (1, 0), (2, 0).</p>
<table class="matrix"><caption>A</caption><tbody><tr><td>1</td><td>0</td></tr><tr><td>1</td><td>1</td></tr><tr><td>1</td><td>2</td></tr></tbody></table>
<p>b = (6, 0, 0). Bước 1: A<sup>T</sup>A = [[3, 3], [3, 5]], A<sup>T</sup>b = (6, 0). Bước 2: 3C + 3D = 6 và 3C + 5D = 0 ⇒ 2D = −6 ⇒ D = −3, C = 5. Đường tốt nhất <b>y = 5 − 3t</b>.</p>
<p>Bước 3: p = Ax̂ = (5, 2, −1), e = b − p = (1, −2, 1), ‖e‖<sup>2</sup> = 1 + 4 + 1 = 6. Kiểm e ⟂ các cột: (1, 1, 1)·e = 0, (0, 1, 2)·e = −2 + 2 = 0 ✓.</p></div>
<pre><code class="language-python">import numpy as np
t = np.array([0, 1, 2], dtype=float)
b = np.array([6, 0, 0], dtype=float)
A = np.column_stack([np.ones_like(t), t])   # columns: 1, t
x_hat, res, rank, sv = np.linalg.lstsq(A, b, rcond=None)
print(x_hat)                  # [C, D] in y = C + D t
print(A @ x_hat)              # projection p
print(res)                    # squared error ||b - p||^2
print(np.linalg.solve(A.T @ A, A.T @ b))   # normal equations give the same</code></pre>
<div class="out">[ 5. -3.]<br>[ 5.  2. -1.]<br>[6.]<br>[ 5. -3.]</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Giải Ax = b bằng cách bỏ bớt phương trình cho thành hệ vuông — bỏ phí dữ liệu và không phải đường khớp tốt nhất.</li><li>Quên cột toàn số 1 (hệ số tự do C).</li><li>Cực tiểu tổng sai số thay vì tổng <em>bình phương</em> sai số: sai số dương và âm sẽ triệt tiêu nhau.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Hệ quá xác định Ax = b: cực tiểu ‖b − Ax‖<sup>2</sup>.</li><li>Phương trình chuẩn A<sup>T</sup>Ax̂ = A<sup>T</sup>b; p = Ax̂ là hình chiếu của b lên C(A).</li><li>e = b − Ax̂ vuông góc với mọi cột.</li><li>Hồi quy tuyến tính = bình phương tối thiểu; gradient MSE = 0 ⇔ phương trình chuẩn.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-16-projection-matrices-and-least-squares/" target="_blank" rel="noopener">MIT 18.06 — Bài 16: Ma trận chiếu và bình phương tối thiểu</a></li><li><a href="https://textbooks.math.gatech.edu/ila/least-squares.html" target="_blank" rel="noopener">Interactive Linear Algebra — Phương pháp bình phương tối thiểu</a></li><li><a href="https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-9-four-ways-to-solve-least-squares-problems/" target="_blank" rel="noopener">MIT 18.065 — Bài 9: Bốn cách giải bài toán bình phương tối thiểu</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.lstsq.html" target="_blank" rel="noopener">NumPy — numpy.linalg.lstsq</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Khớp y = C + Dt với (0, 1), (1, 3), (2, 4).</li><li>Nếu b đã nằm trong C(A), nghiệm bình phương tối thiểu và sai số là gì?</li><li>Vì sao e phải vuông góc với cột toàn số 1? Điều đó nói gì về tổng các sai số?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) A<sup>T</sup>A = [[3, 3], [3, 5]], A<sup>T</sup>b = (8, 11) ⇒ D = 3/2, C = 7/6: y = 7/6 + 1,5t. 2) Nghiệm đúng của Ax = b, với e = 0. 3) Vì e ⟂ mọi cột; (1, …, 1)·e = 0 nghĩa là tổng các sai số bằng 0 (đường tốt nhất đi qua điểm trung bình).</p></div>`);

const c93 = L('maa102-ts-9-3',
  '9.3 — Orthonormal bases, Gram–Schmidt and A = QR|||9.3 — Cơ sở trực chuẩn, Gram–Schmidt và A = QR',
  'Vectơ trực chuẩn, ma trận trực giao QᵀQ = I (giữ độ dài, nghịch đảo là chuyển vị), toạ độ theo cơ sở trực chuẩn, quy trình Gram–Schmidt từng bước, phân tích A = QR và bình phương tối thiểu bằng QR — có code numpy.linalg.qr.',
  `<span class="eyebrow">MAA102 · Chapter 9 · Lesson 9.3</span>
<h2>Orthonormal bases, Gram–Schmidt and A = QR</h2>
<p class="lead">The best basis to compute with is an <strong>orthonormal</strong> one: perpendicular unit vectors. Coordinates become dot products, projections become QQ<sup>T</sup>, and nothing gets amplified by rounding errors. Gram–Schmidt manufactures such a basis from any independent set.</p>
<h3>🎯 Objectives</h3>
<ul><li>Recognise orthonormal vectors and orthogonal matrices.</li><li>Compute coordinates and projections with an orthonormal basis.</li><li>Run Gram–Schmidt by hand.</li><li>Factor A = QR and use it for least squares.</li></ul>
<h3>📖 Lecture</h3>
<p>Vectors q<sub>1</sub>, …, q<sub>n</sub> are <strong>orthonormal</strong> if q<sub>i</sub>·q<sub>j</sub> = 0 for i ≠ j and ‖q<sub>i</sub>‖ = 1. With them as the columns of Q:</p>
<div class="formula"><span class="lbl">Orthonormal columns</span>Q<sup>T</sup>Q = I    coordinates of b: c<sub>i</sub> = q<sub>i</sub>·b    projection onto C(Q): P = QQ<sup>T</sup></div>
<p>A <strong>square</strong> Q with orthonormal columns is an <strong>orthogonal matrix</strong>: Q<sup>−1</sup> = Q<sup>T</sup>, ‖Qx‖ = ‖x‖ (lengths and angles preserved) and det Q = ±1. Rotations and reflections are the examples.</p>
<p><strong>Gram–Schmidt.</strong> Given independent a<sub>1</sub>, a<sub>2</sub>, a<sub>3</sub>, …: subtract from each vector its projections onto the q's already built, then normalise.</p>
<div class="formula"><span class="lbl">Gram–Schmidt</span>v<sub>1</sub> = a<sub>1</sub>    v<sub>j</sub> = a<sub>j</sub> − (q<sub>1</sub>·a<sub>j</sub>)q<sub>1</sub> − … − (q<sub>j−1</sub>·a<sub>j</sub>)q<sub>j−1</sub>    q<sub>j</sub> = v<sub>j</sub>/‖v<sub>j</sub>‖</div>
<p>Recording the coefficients gives <strong>A = QR</strong>: Q has orthonormal columns spanning C(A), and R = Q<sup>T</sup>A is upper triangular with r<sub>ij</sub> = q<sub>i</sub>·a<sub>j</sub>. Least squares then becomes Rx̂ = Q<sup>T</sup>b, solved by back substitution — the stable method used by libraries. QR is also the engine of the QR algorithm that computes eigenvalues in practice.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Gram–Schmidt</b> on a<sub>1</sub> = (1, 1, 0), a<sub>2</sub> = (1, 0, 1), a<sub>3</sub> = (0, 1, 1).</p>
<p>Step 1: q<sub>1</sub> = (1, 1, 0)/√2.</p>
<p>Step 2: q<sub>1</sub>·a<sub>2</sub> = 1/√2, so v<sub>2</sub> = (1, 0, 1) − ½(1, 1, 0) = (½, −½, 1); ‖v<sub>2</sub>‖ = √(3/2), q<sub>2</sub> = (1, −1, 2)/√6.</p>
<p>Step 3: q<sub>1</sub>·a<sub>3</sub> = 1/√2 and q<sub>2</sub>·a<sub>3</sub> = (0 − 1 + 2)/√6 = 1/√6, so v<sub>3</sub> = (0, 1, 1) − ½(1, 1, 0) − (1/6)(1, −1, 2) = (−2/3, 2/3, 2/3); q<sub>3</sub> = (−1, 1, 1)/√3.</p>
<p>Check: q<sub>1</sub>·q<sub>2</sub> = (1 − 1 + 0)/√12 = 0, q<sub>1</sub>·q<sub>3</sub> = 0, q<sub>2</sub>·q<sub>3</sub> = (−1 − 1 + 2)/√18 = 0 ✓. R has diagonal ‖v<sub>j</sub>‖ = √2, √(3/2), 2/√3.</p></div>
<pre><code class="language-python">import numpy as np
A = np.array([[1, 1, 0],
              [1, 0, 1],
              [0, 1, 1]], dtype=float)
Q, R = np.linalg.qr(A)
print(Q.round(4))
print(R.round(4))
print(np.allclose(Q.T @ Q, np.eye(3)), np.allclose(Q @ R, A))</code></pre>
<div class="out">[[-0.7071  0.4082 -0.5774]<br> [-0.7071 -0.4082  0.5774]<br> [-0.      0.8165  0.5774]]<br>[[-1.4142 -0.7071 -0.7071]<br> [ 0.      1.2247  0.4082]<br> [ 0.      0.      1.1547]]<br>True True</div>
<p>NumPy (Householder reflections) returns q<sub>1</sub> with the opposite sign: −(1, 1, 0)/√2 and r<sub>11</sub> = −√2. Columns of Q are unique only up to sign; q<sub>2</sub> = (0.4082, −0.4082, 0.8165) and q<sub>3</sub> = (−0.5774, 0.5774, 0.5774) match ours exactly.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Projecting a<sub>j</sub> onto the original a's instead of onto the new q's.</li><li>Forgetting to normalise, then using q·a as if ‖q‖ = 1.</li><li>Calling a rectangular Q with orthonormal columns “orthogonal” and using QQ<sup>T</sup> = I — that only holds when Q is square.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Orthonormal columns: Q<sup>T</sup>Q = I; coordinates are dot products; P = QQ<sup>T</sup>.</li><li>Orthogonal (square) Q: Q<sup>−1</sup> = Q<sup>T</sup>, preserves lengths, det = ±1.</li><li>Gram–Schmidt: subtract projections on earlier q's, normalise.</li><li>A = QR with R upper triangular; least squares via Rx̂ = Q<sup>T</sup>b.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-17-orthogonal-matrices-and-gram-schmidt/" target="_blank" rel="noopener">MIT 18.06 — Lecture 17: Orthogonal matrices and Gram-Schmidt</a></li><li><a href="https://textbooks.math.gatech.edu/ila/orthogonal-sets.html" target="_blank" rel="noopener">Interactive Linear Algebra — Orthogonal Sets (Gram–Schmidt)</a></li><li><a href="https://en.wikipedia.org/wiki/Gram%E2%80%93Schmidt_process" target="_blank" rel="noopener">Wikipedia — Gram–Schmidt process</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.qr.html" target="_blank" rel="noopener">NumPy — numpy.linalg.qr</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Apply Gram–Schmidt to (3, 4), (1, 0).</li><li>Is Q = [[0.6, −0.8], [0.8, 0.6]] orthogonal? What is Q<sup>−1</sup>?</li><li>Find the coordinates of (2, 1) in the orthonormal basis q<sub>1</sub> = (1, 1)/√2, q<sub>2</sub> = (1, −1)/√2.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) q<sub>1</sub> = (0.6, 0.8); v<sub>2</sub> = (1, 0) − 0.6(0.6, 0.8) = (0.64, −0.48), ‖v<sub>2</sub>‖ = 0.8 ⇒ q<sub>2</sub> = (0.8, −0.6). 2) Yes (columns are perpendicular unit vectors; it is a rotation); Q<sup>−1</sup> = Q<sup>T</sup> = [[0.6, 0.8], [−0.8, 0.6]]. 3) c<sub>1</sub> = q<sub>1</sub>·(2, 1) = 3/√2, c<sub>2</sub> = 1/√2.</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 9 · Bài 9.3</span>
<h2>Cơ sở trực chuẩn, Gram–Schmidt và A = QR</h2>
<p class="lead">Cơ sở tốt nhất để tính toán là cơ sở <strong>trực chuẩn</strong>: các vectơ đơn vị đôi một vuông góc. Toạ độ thành tích vô hướng, phép chiếu thành QQ<sup>T</sup>, và không gì bị sai số làm tròn khuếch đại. Gram–Schmidt sản xuất một cơ sở như vậy từ bất kỳ tập độc lập nào.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận biết vectơ trực chuẩn và ma trận trực giao.</li><li>Tính toạ độ và hình chiếu bằng cơ sở trực chuẩn.</li><li>Thực hiện Gram–Schmidt bằng tay.</li><li>Phân tích A = QR và dùng nó cho bình phương tối thiểu.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Các vectơ q<sub>1</sub>, …, q<sub>n</sub> <strong>trực chuẩn</strong> nếu q<sub>i</sub>·q<sub>j</sub> = 0 khi i ≠ j và ‖q<sub>i</sub>‖ = 1. Xếp chúng làm cột của Q:</p>
<div class="formula"><span class="lbl">Các cột trực chuẩn</span>Q<sup>T</sup>Q = I    toạ độ của b: c<sub>i</sub> = q<sub>i</sub>·b    chiếu lên C(Q): P = QQ<sup>T</sup></div>
<p>Ma trận <strong>vuông</strong> Q có các cột trực chuẩn là <strong>ma trận trực giao</strong>: Q<sup>−1</sup> = Q<sup>T</sup>, ‖Qx‖ = ‖x‖ (giữ độ dài và góc) và det Q = ±1. Phép quay và phép phản xạ là các ví dụ.</p>
<p><strong>Gram–Schmidt.</strong> Cho a<sub>1</sub>, a<sub>2</sub>, a<sub>3</sub>, … độc lập: trừ khỏi mỗi vectơ hình chiếu của nó lên các q đã dựng, rồi chuẩn hoá.</p>
<div class="formula"><span class="lbl">Gram–Schmidt</span>v<sub>1</sub> = a<sub>1</sub>    v<sub>j</sub> = a<sub>j</sub> − (q<sub>1</sub>·a<sub>j</sub>)q<sub>1</sub> − … − (q<sub>j−1</sub>·a<sub>j</sub>)q<sub>j−1</sub>    q<sub>j</sub> = v<sub>j</sub>/‖v<sub>j</sub>‖</div>
<p>Ghi lại các hệ số được <strong>A = QR</strong>: Q có các cột trực chuẩn sinh ra C(A), và R = Q<sup>T</sup>A là tam giác trên với r<sub>ij</sub> = q<sub>i</sub>·a<sub>j</sub>. Khi đó bình phương tối thiểu thành Rx̂ = Q<sup>T</sup>b, giải bằng thế ngược — phương pháp ổn định mà thư viện dùng. QR cũng là động cơ của thuật toán QR dùng để tính trị riêng trong thực tế.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Gram–Schmidt</b> cho a<sub>1</sub> = (1, 1, 0), a<sub>2</sub> = (1, 0, 1), a<sub>3</sub> = (0, 1, 1).</p>
<p>Bước 1: q<sub>1</sub> = (1, 1, 0)/√2.</p>
<p>Bước 2: q<sub>1</sub>·a<sub>2</sub> = 1/√2, nên v<sub>2</sub> = (1, 0, 1) − ½(1, 1, 0) = (½, −½, 1); ‖v<sub>2</sub>‖ = √(3/2), q<sub>2</sub> = (1, −1, 2)/√6.</p>
<p>Bước 3: q<sub>1</sub>·a<sub>3</sub> = 1/√2 và q<sub>2</sub>·a<sub>3</sub> = (0 − 1 + 2)/√6 = 1/√6, nên v<sub>3</sub> = (0, 1, 1) − ½(1, 1, 0) − (1/6)(1, −1, 2) = (−2/3, 2/3, 2/3); q<sub>3</sub> = (−1, 1, 1)/√3.</p>
<p>Kiểm: q<sub>1</sub>·q<sub>2</sub> = (1 − 1 + 0)/√12 = 0, q<sub>1</sub>·q<sub>3</sub> = 0, q<sub>2</sub>·q<sub>3</sub> = (−1 − 1 + 2)/√18 = 0 ✓. R có đường chéo ‖v<sub>j</sub>‖ = √2, √(3/2), 2/√3.</p></div>
<pre><code class="language-python">import numpy as np
A = np.array([[1, 1, 0],
              [1, 0, 1],
              [0, 1, 1]], dtype=float)
Q, R = np.linalg.qr(A)
print(Q.round(4))
print(R.round(4))
print(np.allclose(Q.T @ Q, np.eye(3)), np.allclose(Q @ R, A))</code></pre>
<div class="out">[[-0.7071  0.4082 -0.5774]<br> [-0.7071 -0.4082  0.5774]<br> [-0.      0.8165  0.5774]]<br>[[-1.4142 -0.7071 -0.7071]<br> [ 0.      1.2247  0.4082]<br> [ 0.      0.      1.1547]]<br>True True</div>
<p>NumPy (dùng phép phản xạ Householder) trả q<sub>1</sub> ngược dấu: −(1, 1, 0)/√2 và r<sub>11</sub> = −√2. Các cột của Q chỉ duy nhất sai khác dấu; q<sub>2</sub> = (0,4082; −0,4082; 0,8165) và q<sub>3</sub> = (−0,5774; 0,5774; 0,5774) khớp đúng kết quả của ta.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chiếu a<sub>j</sub> lên các a ban đầu thay vì lên các q mới.</li><li>Quên chuẩn hoá, rồi dùng q·a như thể ‖q‖ = 1.</li><li>Gọi Q chữ nhật có cột trực chuẩn là “trực giao” và dùng QQ<sup>T</sup> = I — điều đó chỉ đúng khi Q vuông.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Cột trực chuẩn: Q<sup>T</sup>Q = I; toạ độ là tích vô hướng; P = QQ<sup>T</sup>.</li><li>Q trực giao (vuông): Q<sup>−1</sup> = Q<sup>T</sup>, giữ độ dài, det = ±1.</li><li>Gram–Schmidt: trừ hình chiếu lên các q trước đó, rồi chuẩn hoá.</li><li>A = QR với R tam giác trên; bình phương tối thiểu qua Rx̂ = Q<sup>T</sup>b.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-17-orthogonal-matrices-and-gram-schmidt/" target="_blank" rel="noopener">MIT 18.06 — Bài 17: Ma trận trực giao và Gram-Schmidt</a></li><li><a href="https://textbooks.math.gatech.edu/ila/orthogonal-sets.html" target="_blank" rel="noopener">Interactive Linear Algebra — Tập trực giao (Gram–Schmidt)</a></li><li><a href="https://en.wikipedia.org/wiki/Gram%E2%80%93Schmidt_process" target="_blank" rel="noopener">Wikipedia — Gram–Schmidt process</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.qr.html" target="_blank" rel="noopener">NumPy — numpy.linalg.qr</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Áp dụng Gram–Schmidt cho (3, 4), (1, 0).</li><li>Q = [[0,6; −0,8], [0,8; 0,6]] có trực giao không? Q<sup>−1</sup> là gì?</li><li>Tìm toạ độ của (2, 1) theo cơ sở trực chuẩn q<sub>1</sub> = (1, 1)/√2, q<sub>2</sub> = (1, −1)/√2.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) q<sub>1</sub> = (0,6; 0,8); v<sub>2</sub> = (1, 0) − 0,6(0,6; 0,8) = (0,64; −0,48), ‖v<sub>2</sub>‖ = 0,8 ⇒ q<sub>2</sub> = (0,8; −0,6). 2) Có (các cột là vectơ đơn vị vuông góc; đó là một phép quay); Q<sup>−1</sup> = Q<sup>T</sup> = [[0,6; 0,8], [−0,8; 0,6]]. 3) c<sub>1</sub> = q<sub>1</sub>·(2, 1) = 3/√2, c<sub>2</sub> = 1/√2.</p></div>`);

const q9 = QZ(9, 'Quiz — Chapter 9: Orthogonality, projections, least squares, QR|||Quiz — Chương 9: Trực giao, phép chiếu, bình phương tối thiểu, QR', 'Kiểm tra chương 9: hình chiếu lên đường thẳng, ma trận chiếu, phương trình chuẩn, đường khớp tốt nhất, ma trận trực giao, Gram–Schmidt, QR.', [
  Q('q1', 'The projection of b = (2, 3) onto the line through a = (1, 1) is|||Hình chiếu của b = (2, 3) lên đường thẳng qua a = (1, 1) là',
    ['(2, 3)|||(2, 3)', '(2.5, 2.5)|||(2,5; 2,5)', '(5, 5)|||(5, 5)', '(1, 1)|||(1, 1)'], 1,
    'aᵀb / aᵀa = 5/2.|||aᵀb / aᵀa = 5/2.'),
  Q('q2', 'In b = p + e (projection onto a subspace), the error e is|||Trong b = p + e (chiếu lên không gian con), sai số e',
    ['parallel to p|||cùng phương với p', 'perpendicular to the subspace|||vuông góc với không gian con', 'always zero|||luôn bằng 0', 'equal to b|||bằng b'], 1,
    'That is what makes p the closest point.|||Chính điều đó làm p là điểm gần nhất.'),
  Q('q3', 'Every projection matrix P satisfies|||Mọi ma trận chiếu P thoả',
    ['P² = P|||P² = P', 'P² = I|||P² = I', 'P² = 0|||P² = 0', 'det P = 1|||det P = 1'], 0,
    'Projecting twice changes nothing (and Pᵀ = P).|||Chiếu hai lần không đổi gì (và Pᵀ = P).'),
  Q('q4', 'The least-squares solution x̂ of Ax = b solves|||Nghiệm bình phương tối thiểu x̂ của Ax = b thoả',
    ['Ax̂ = b|||Ax̂ = b', 'AᵀAx̂ = Aᵀb|||AᵀAx̂ = Aᵀb', 'AAᵀx̂ = b|||AAᵀx̂ = b', 'x̂ = A⁻¹b|||x̂ = A⁻¹b'], 1,
    'The normal equations: Aᵀ(b − Ax̂) = 0.|||Phương trình chuẩn: Aᵀ(b − Ax̂) = 0.'),
  Q('q5', 'The best line y = C + Dt through (0, 6), (1, 0), (2, 0) is|||Đường y = C + Dt khớp tốt nhất qua (0, 6), (1, 0), (2, 0) là',
    ['y = 6 − 3t|||y = 6 − 3t', 'y = 5 − 3t|||y = 5 − 3t', 'y = 2|||y = 2', 'y = 4 − 2t|||y = 4 − 2t'], 1,
    '3C + 3D = 6, 3C + 5D = 0.|||3C + 3D = 6, 3C + 5D = 0.'),
  Q('q6', 'If Q has orthonormal columns, then|||Nếu Q có các cột trực chuẩn thì',
    ['QᵀQ = I|||QᵀQ = I', 'Q = I|||Q = I', 'det Q = 0|||det Q = 0', 'Q is symmetric|||Q đối xứng'], 0,
    'Entry (i, j) of QᵀQ is qᵢ·qⱼ.|||Phần tử (i, j) của QᵀQ là qᵢ·qⱼ.'),
  Q('q7', 'Gram–Schmidt on (3, 4), (1, 0) gives q₁ =|||Gram–Schmidt cho (3, 4), (1, 0) cho q₁ =',
    ['(3, 4)|||(3, 4)', '(0.6, 0.8)|||(0,6; 0,8)', '(1, 0)|||(1, 0)', '(0.8, −0.6)|||(0,8; −0,6)'], 1,
    'Normalise a₁: length 5.|||Chuẩn hoá a₁: độ dài 5.'),
  Q('q8', 'In A = QR from Gram–Schmidt, R is|||Trong A = QR từ Gram–Schmidt, R là',
    ['orthogonal|||trực giao', 'upper triangular|||tam giác trên', 'diagonal|||chéo', 'a permutation|||một hoán vị'], 1,
    'r_ij = qᵢ·aⱼ is 0 when i > j.|||r_ij = qᵢ·aⱼ bằng 0 khi i > j.'),
  Q('q9', 'An orthogonal matrix Q always|||Một ma trận trực giao Q luôn',
    ['has det 0|||có det 0', 'preserves lengths: ‖Qx‖ = ‖x‖|||giữ độ dài: ‖Qx‖ = ‖x‖', 'is diagonal|||là ma trận chéo', 'has only positive entries|||chỉ có phần tử dương'], 1,
    '‖Qx‖² = xᵀQᵀQx = xᵀx.|||‖Qx‖² = xᵀQᵀQx = xᵀx.'),
]);

const ch9 = {
  title: 'Chapter 9 — Orthogonality, least squares and QR|||Chương 9 — Trực giao, bình phương tối thiểu và QR',
  description: 'Không gian con trực giao, phép chiếu và ma trận chiếu, bình phương tối thiểu và hồi quy tuyến tính, cơ sở trực chuẩn, ma trận trực giao, Gram–Schmidt và A = QR (Strang ch.4 · MIT 18.06 bài 14–17).',
  lessons: [c91, c92, c93, q9],
};


// ───────────────────────────── Chương 10 — Ma trận đối xứng, SVD & ứng dụng ─────────────────────────────
const c101 = L('maa102-ts-10-1',
  '10.1 — Symmetric matrices, the spectral theorem and positive definiteness|||10.1 — Ma trận đối xứng, định lý phổ và tính xác định dương',
  'Ma trận đối xứng có trị riêng thực và vectơ riêng trực giao, định lý phổ S = QΛQᵀ, dạng toàn phương xᵀSx, năm phép thử xác định dương, phân tích Cholesky, ma trận Hessian và hiệp phương sai — có code numpy.linalg.eigh.',
  `<span class="eyebrow">MAA102 · Chapter 10 · Lesson 10.1</span>
<h2>Symmetric matrices, the spectral theorem and positive definiteness</h2>
<p class="lead">Symmetric matrices are the best-behaved matrices in all of mathematics, and they are everywhere in data science: covariance matrices, Gram matrices A<sup>T</sup>A, Hessians of loss functions. Their eigenvalues are real and their eigenvectors are perpendicular.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the spectral theorem S = QΛQ<sup>T</sup>.</li><li>Diagonalize a symmetric matrix with an orthogonal matrix.</li><li>Write a quadratic form x<sup>T</sup>Sx and decide whether S is positive definite.</li><li>Explain why covariance matrices and Hessians are symmetric, and what positive definiteness means for optimisation.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Spectral theorem</span>S = S<sup>T</sup>  ⇒  S = QΛQ<sup>T</sup> = λ<sub>1</sub>q<sub>1</sub>q<sub>1</sub><sup>T</sup> + … + λ<sub>n</sub>q<sub>n</sub>q<sub>n</sub><sup>T</sup>    (λ<sub>i</sub> real, Q orthogonal)</div>
<p>Every real symmetric matrix has real eigenvalues and a full set of orthonormal eigenvectors, so it is always diagonalizable, and the inverse of the eigenvector matrix is just its transpose. The second form writes S as a weighted sum of projections onto perpendicular directions.</p>
<p>A symmetric S defines a <strong>quadratic form</strong> f(x) = x<sup>T</sup>Sx. S is <strong>positive definite</strong> if x<sup>T</sup>Sx &gt; 0 for every x ≠ 0 — geometrically, f is a bowl with a single minimum at 0. Equivalent tests (any one is enough):</p>
<ol><li>all eigenvalues λ<sub>i</sub> &gt; 0;</li><li>all pivots of elimination &gt; 0;</li><li>all leading principal minors (upper-left determinants) &gt; 0;</li><li>x<sup>T</sup>Sx &gt; 0 for all x ≠ 0;</li><li>S = A<sup>T</sup>A for some A with independent columns (e.g. the Cholesky factor, S = LL<sup>T</sup>).</li></ol>
<p>With ≥ instead of &gt; we get <strong>positive semidefinite</strong>. Mixed signs ⇒ <strong>indefinite</strong> (a saddle).</p>
<div class="note-ct"><p><strong>AI and statistics.</strong> A covariance matrix Σ = (1/m)X<sub>c</sub><sup>T</sup>X<sub>c</sub> of centred data is symmetric and positive semidefinite; its eigenvectors are the principal components (Lesson 10.3). The Hessian H of a loss function (matrix of second derivatives) is symmetric; at a critical point, H positive definite ⇒ local minimum, indefinite ⇒ saddle point. Optimisers in deep learning spend much of their time near saddle points.</p></div>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Diagonalize and test</b></p>
<table class="matrix"><caption>S</caption><tbody><tr><td>2</td><td>1</td></tr><tr><td>1</td><td>2</td></tr></tbody></table>
<p>Step 1: λ<sup>2</sup> − 4λ + 3 = 0 ⇒ λ = 3, 1. Step 2: λ = 3: (1, 1)/√2; λ = 1: (1, −1)/√2 — perpendicular, as promised. Step 3: S = 3·q<sub>1</sub>q<sub>1</sub><sup>T</sup> + 1·q<sub>2</sub>q<sub>2</sub><sup>T</sup>.</p>
<p>Step 4: x<sup>T</sup>Sx = 2x<sup>2</sup> + 2xy + 2y<sup>2</sup> = (x + y)<sup>2</sup> + x<sup>2</sup> + y<sup>2</sup> &gt; 0 for (x, y) ≠ 0. Also eigenvalues 3, 1 &gt; 0; pivots 2 and 2 − 1/2 = 3/2 &gt; 0; minors 2 and det = 3 &gt; 0. <b>Positive definite</b>.</p></div>
<pre><code class="language-python">import numpy as np
S = np.array([[2, 1],
              [1, 2]], dtype=float)
lam, Q = np.linalg.eigh(S)        # eigh: for symmetric matrices, ascending order
print(lam)
print(Q.round(4))
print(np.allclose(Q @ np.diag(lam) @ Q.T, S))
print(np.linalg.cholesky(S).round(4))   # exists only for positive definite S</code></pre>
<div class="out">[1. 3.]<br>[[-0.7071  0.7071]<br> [ 0.7071  0.7071]]<br>True<br>[[1.4142 0.    ]<br> [0.7071 1.2247]]</div>
<p><code>eigh</code> returns real eigenvalues in ascending order and orthonormal eigenvectors (here (−1, 1)/√2 for λ = 1). The Cholesky factor L satisfies LL<sup>T</sup> = S; NumPy raises an error if S is not positive definite — a practical test.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Concluding “positive definite” from positive <em>entries</em>: [[1, 2], [2, 1]] has positive entries but eigenvalues 3 and −1.</li><li>Applying the tests to a non-symmetric matrix — symmetrise first: x<sup>T</sup>Ax = x<sup>T</sup>((A + A<sup>T</sup>)/2)x.</li><li>Using <code>eig</code> instead of <code>eigh</code> for symmetric matrices (slower, may return non-orthogonal vectors for repeated eigenvalues).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Symmetric ⇒ real eigenvalues, orthonormal eigenvectors, S = QΛQ<sup>T</sup>.</li><li>Positive definite ⇔ all λ &gt; 0 ⇔ pivots &gt; 0 ⇔ leading minors &gt; 0 ⇔ x<sup>T</sup>Sx &gt; 0.</li><li>Covariance matrices are positive semidefinite; Hessians decide minima vs saddles.</li><li>Cholesky S = LL<sup>T</sup> exists exactly for positive definite S.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-25-symmetric-matrices-and-positive-definiteness/" target="_blank" rel="noopener">MIT 18.06 — Lecture 25: Symmetric matrices and positive definiteness</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-27-positive-definite-matrices-and-minima/" target="_blank" rel="noopener">MIT 18.06 — Lecture 27: Positive definite matrices and minima</a></li><li><a href="https://en.wikipedia.org/wiki/Spectral_theorem" target="_blank" rel="noopener">Wikipedia — Spectral theorem</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.eigh.html" target="_blank" rel="noopener">NumPy — numpy.linalg.eigh</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Is [[1, 2], [2, 1]] positive definite? Find its eigenvalues.</li><li>For which b is [[1, b], [b, 4]] positive definite?</li><li>Write x<sup>T</sup>Sx for S = [[3, −1], [−1, 3]] and decide its type.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) No: det = 1 − 4 = −3 &lt; 0; eigenvalues 3 and −1 (indefinite). 2) Minors 1 &gt; 0 and 4 − b<sup>2</sup> &gt; 0 ⇒ −2 &lt; b &lt; 2. 3) 3x<sup>2</sup> − 2xy + 3y<sup>2</sup>; eigenvalues 3 ± 1 = 4, 2 &gt; 0 ⇒ positive definite.</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 10 · Bài 10.1</span>
<h2>Ma trận đối xứng, định lý phổ và tính xác định dương</h2>
<p class="lead">Ma trận đối xứng là loại ma trận “ngoan” nhất trong toán học, và chúng ở khắp nơi trong khoa học dữ liệu: ma trận hiệp phương sai, ma trận Gram A<sup>T</sup>A, Hessian của hàm mất mát. Trị riêng của chúng là số thực và vectơ riêng đôi một vuông góc.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu định lý phổ S = QΛQ<sup>T</sup>.</li><li>Chéo hoá ma trận đối xứng bằng một ma trận trực giao.</li><li>Viết dạng toàn phương x<sup>T</sup>Sx và quyết định S có xác định dương không.</li><li>Giải thích vì sao ma trận hiệp phương sai và Hessian đối xứng, và tính xác định dương có ý nghĩa gì cho tối ưu.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Định lý phổ</span>S = S<sup>T</sup>  ⇒  S = QΛQ<sup>T</sup> = λ<sub>1</sub>q<sub>1</sub>q<sub>1</sub><sup>T</sup> + … + λ<sub>n</sub>q<sub>n</sub>q<sub>n</sub><sup>T</sup>    (λ<sub>i</sub> thực, Q trực giao)</div>
<p>Mọi ma trận đối xứng thực có trị riêng thực và đủ bộ vectơ riêng trực chuẩn, nên luôn chéo hoá được, và nghịch đảo của ma trận vectơ riêng chỉ là chuyển vị của nó. Dạng thứ hai viết S thành tổng có trọng số của các phép chiếu lên các hướng vuông góc.</p>
<p>Ma trận đối xứng S xác định một <strong>dạng toàn phương</strong> f(x) = x<sup>T</sup>Sx. S <strong>xác định dương</strong> nếu x<sup>T</sup>Sx &gt; 0 với mọi x ≠ 0 — về hình học, f là một cái bát có đúng một cực tiểu tại 0. Các phép thử tương đương (chỉ cần một):</p>
<ol><li>mọi trị riêng λ<sub>i</sub> &gt; 0;</li><li>mọi pivot của phép khử &gt; 0;</li><li>mọi định thức con chính góc trên trái &gt; 0;</li><li>x<sup>T</sup>Sx &gt; 0 với mọi x ≠ 0;</li><li>S = A<sup>T</sup>A với A có các cột độc lập (vd thừa số Cholesky, S = LL<sup>T</sup>).</li></ol>
<p>Thay &gt; bằng ≥ ta có <strong>nửa xác định dương</strong>. Dấu lẫn lộn ⇒ <strong>không xác định</strong> (điểm yên ngựa).</p>
<div class="note-ct"><p><strong>AI và thống kê.</strong> Ma trận hiệp phương sai Σ = (1/m)X<sub>c</sub><sup>T</sup>X<sub>c</sub> của dữ liệu đã trừ trung bình là đối xứng và nửa xác định dương; vectơ riêng của nó là các thành phần chính (Bài 10.3). Hessian H của hàm mất mát (ma trận đạo hàm cấp hai) đối xứng; tại điểm dừng, H xác định dương ⇒ cực tiểu địa phương, không xác định ⇒ điểm yên ngựa. Các bộ tối ưu trong học sâu mất nhiều thời gian quanh điểm yên ngựa.</p></div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Chéo hoá và kiểm tra</b></p>
<table class="matrix"><caption>S</caption><tbody><tr><td>2</td><td>1</td></tr><tr><td>1</td><td>2</td></tr></tbody></table>
<p>Bước 1: λ<sup>2</sup> − 4λ + 3 = 0 ⇒ λ = 3, 1. Bước 2: λ = 3: (1, 1)/√2; λ = 1: (1, −1)/√2 — vuông góc, đúng như hứa. Bước 3: S = 3·q<sub>1</sub>q<sub>1</sub><sup>T</sup> + 1·q<sub>2</sub>q<sub>2</sub><sup>T</sup>.</p>
<p>Bước 4: x<sup>T</sup>Sx = 2x<sup>2</sup> + 2xy + 2y<sup>2</sup> = (x + y)<sup>2</sup> + x<sup>2</sup> + y<sup>2</sup> &gt; 0 với (x, y) ≠ 0. Ngoài ra trị riêng 3, 1 &gt; 0; pivot 2 và 2 − 1/2 = 3/2 &gt; 0; định thức con 2 và det = 3 &gt; 0. <b>Xác định dương</b>.</p></div>
<pre><code class="language-python">import numpy as np
S = np.array([[2, 1],
              [1, 2]], dtype=float)
lam, Q = np.linalg.eigh(S)        # eigh: for symmetric matrices, ascending order
print(lam)
print(Q.round(4))
print(np.allclose(Q @ np.diag(lam) @ Q.T, S))
print(np.linalg.cholesky(S).round(4))   # exists only for positive definite S</code></pre>
<div class="out">[1. 3.]<br>[[-0.7071  0.7071]<br> [ 0.7071  0.7071]]<br>True<br>[[1.4142 0.    ]<br> [0.7071 1.2247]]</div>
<p><code>eigh</code> trả trị riêng thực theo thứ tự tăng dần và vectơ riêng trực chuẩn (ở đây (−1, 1)/√2 cho λ = 1). Thừa số Cholesky L thoả LL<sup>T</sup> = S; NumPy báo lỗi nếu S không xác định dương — một phép thử thực tế.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Kết luận “xác định dương” vì các <em>phần tử</em> dương: [[1, 2], [2, 1]] có phần tử dương nhưng trị riêng 3 và −1.</li><li>Áp phép thử cho ma trận không đối xứng — hãy đối xứng hoá trước: x<sup>T</sup>Ax = x<sup>T</sup>((A + A<sup>T</sup>)/2)x.</li><li>Dùng <code>eig</code> thay cho <code>eigh</code> với ma trận đối xứng (chậm hơn, có thể trả vectơ không trực giao khi trị riêng lặp).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Đối xứng ⇒ trị riêng thực, vectơ riêng trực chuẩn, S = QΛQ<sup>T</sup>.</li><li>Xác định dương ⇔ mọi λ &gt; 0 ⇔ pivot &gt; 0 ⇔ định thức con chính &gt; 0 ⇔ x<sup>T</sup>Sx &gt; 0.</li><li>Ma trận hiệp phương sai nửa xác định dương; Hessian phân biệt cực tiểu với yên ngựa.</li><li>Cholesky S = LL<sup>T</sup> tồn tại đúng khi S xác định dương.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-25-symmetric-matrices-and-positive-definiteness/" target="_blank" rel="noopener">MIT 18.06 — Bài 25: Ma trận đối xứng và tính xác định dương</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-27-positive-definite-matrices-and-minima/" target="_blank" rel="noopener">MIT 18.06 — Bài 27: Ma trận xác định dương và cực tiểu</a></li><li><a href="https://en.wikipedia.org/wiki/Spectral_theorem" target="_blank" rel="noopener">Wikipedia — Spectral theorem</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.eigh.html" target="_blank" rel="noopener">NumPy — numpy.linalg.eigh</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>[[1, 2], [2, 1]] có xác định dương không? Tìm trị riêng.</li><li>Với b nào thì [[1, b], [b, 4]] xác định dương?</li><li>Viết x<sup>T</sup>Sx với S = [[3, −1], [−1, 3]] và xác định loại của nó.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Không: det = 1 − 4 = −3 &lt; 0; trị riêng 3 và −1 (không xác định). 2) Định thức con 1 &gt; 0 và 4 − b<sup>2</sup> &gt; 0 ⇒ −2 &lt; b &lt; 2. 3) 3x<sup>2</sup> − 2xy + 3y<sup>2</sup>; trị riêng 3 ± 1 = 4, 2 &gt; 0 ⇒ xác định dương.</p></div>`);

const c102 = L('maa102-ts-10-2',
  '10.2 — The singular value decomposition (SVD)|||10.2 — Phân tích giá trị kỳ dị (SVD)',
  'Mọi ma trận A = UΣVᵀ: giá trị kỳ dị là căn trị riêng của AᵀA, vectơ kỳ dị phải/trái, hình học quay–giãn–quay, tổng các mảnh hạng một σᵢuᵢvᵢᵀ, hạng = số σ khác 0, ma trận giả nghịch đảo — có code numpy.linalg.svd.',
  `<span class="eyebrow">MAA102 · Chapter 10 · Lesson 10.2</span>
<h2>The singular value decomposition (SVD)</h2>
<p class="lead">Eigenvalues need a square matrix and do not always exist in the nice form. The SVD works for <strong>every</strong> matrix, of any shape: it says that every linear map is a rotation, then a stretch along perpendicular axes, then another rotation. Strang calls it the climax of linear algebra.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the SVD A = UΣV<sup>T</sup> and the meaning of each factor.</li><li>Compute singular values and singular vectors of a 2×2 matrix by hand.</li><li>Write A as a sum of rank-one pieces and read the rank and norm from Σ.</li><li>Know the pseudo-inverse A<sup>+</sup>.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Singular value decomposition</span>A = U Σ V<sup>T</sup>    (m×n) = (m×m orthogonal)(m×n diagonal, σ<sub>1</sub> ≥ σ<sub>2</sub> ≥ … ≥ 0)(n×n orthogonal)</div>
<ul><li>The columns v<sub>i</sub> of V (<strong>right singular vectors</strong>) are orthonormal eigenvectors of A<sup>T</sup>A.</li><li>The <strong>singular values</strong> σ<sub>i</sub> = √(eigenvalues of A<sup>T</sup>A) ≥ 0.</li><li>The columns u<sub>i</sub> of U (<strong>left singular vectors</strong>) are u<sub>i</sub> = Av<sub>i</sub>/σ<sub>i</sub>; they are eigenvectors of AA<sup>T</sup>.</li></ul>
<p>The key equation is Av<sub>i</sub> = σ<sub>i</sub>u<sub>i</sub>: A maps the orthonormal basis v<sub>i</sub> to the orthonormal basis u<sub>i</sub>, stretched by σ<sub>i</sub>. Geometrically, A sends the unit circle to an ellipse whose semi-axes are σ<sub>1</sub>u<sub>1</sub> and σ<sub>2</sub>u<sub>2</sub>.</p>
<div class="formula"><span class="lbl">Sum of rank-one pieces</span>A = σ<sub>1</sub>u<sub>1</sub>v<sub>1</sub><sup>T</sup> + σ<sub>2</sub>u<sub>2</sub>v<sub>2</sub><sup>T</sup> + … + σ<sub>r</sub>u<sub>r</sub>v<sub>r</sub><sup>T</sup></div>
<p>Consequences: <strong>rank A = number of non-zero σ<sub>i</sub></strong>; the largest stretch ‖Ax‖/‖x‖ is σ<sub>1</sub> (the matrix 2-norm); for square A, |det A| = σ<sub>1</sub>σ<sub>2</sub>⋯σ<sub>n</sub>; the ratio σ<sub>1</sub>/σ<sub>n</sub> is the <strong>condition number</strong>, which measures how much rounding errors can be amplified when solving Ax = b. The vectors v<sub>1</sub>…v<sub>r</sub>, u<sub>1</sub>…u<sub>r</sub> are orthonormal bases of the row space and column space — the four subspaces of Lesson 6.3, now with perfect bases.</p>
<p><strong>Pseudo-inverse.</strong> A<sup>+</sup> = VΣ<sup>+</sup>U<sup>T</sup>, where Σ<sup>+</sup> inverts the non-zero σ's. x = A<sup>+</sup>b is the least-squares solution of smallest length, and it exists even when A is not square or not invertible (<code>np.linalg.pinv</code>).</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>SVD by hand.</b></p>
<table class="matrix"><caption>A</caption><tbody><tr><td>3</td><td>0</td></tr><tr><td>4</td><td>5</td></tr></tbody></table>
<p>Step 1: A<sup>T</sup>A = [[25, 20], [20, 25]], eigenvalues 45 and 5 ⇒ <b>σ<sub>1</sub> = √45 = 3√5 ≈ 6.7082, σ<sub>2</sub> = √5 ≈ 2.2361</b>.</p>
<p>Step 2: eigenvectors of A<sup>T</sup>A: v<sub>1</sub> = (1, 1)/√2, v<sub>2</sub> = (−1, 1)/√2.</p>
<p>Step 3: u<sub>1</sub> = Av<sub>1</sub>/σ<sub>1</sub> = (3, 9)/(√2·3√5) = (1, 3)/√10; u<sub>2</sub> = Av<sub>2</sub>/σ<sub>2</sub> = (−3, 1)/(√2·√5) = (−3, 1)/√10. Check: u<sub>1</sub>·u<sub>2</sub> = (−3 + 3)/10 = 0 ✓, and σ<sub>1</sub>σ<sub>2</sub> = √225 = 15 = |det A| ✓.</p></div>
<pre><code class="language-python">import numpy as np
A = np.array([[3, 0],
              [4, 5]], dtype=float)
U, s, Vt = np.linalg.svd(A)
print(s.round(4), (np.sqrt(45)).round(4), np.sqrt(5).round(4))
print(U.round(4))
print(Vt.round(4))
print(np.allclose(U @ np.diag(s) @ Vt, A))</code></pre>
<div class="out">[6.7082 2.2361] 6.7082 2.2361<br>[[-0.3162 -0.9487]<br> [-0.9487  0.3162]]<br>[[-0.7071 -0.7071]<br> [-0.7071  0.7071]]<br>True</div>
<p>NumPy returns V<sup>T</sup> (rows are v<sub>i</sub>) and flips the sign of the pair u<sub>1</sub>, v<sub>1</sub>: (−0.3162, −0.9487) = −(1, 3)/√10 and (−0.7071, −0.7071) = −v<sub>1</sub>. Flipping both u<sub>i</sub> and v<sub>i</sub> together leaves σ<sub>i</sub>u<sub>i</sub>v<sub>i</sub><sup>T</sup> unchanged.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Confusing singular values with eigenvalues: for A = [[3, 0], [4, 5]] the eigenvalues are 3 and 5, the singular values 6.7082 and 2.2361.</li><li>Choosing u<sub>i</sub> as eigenvectors of AA<sup>T</sup> independently of v<sub>i</sub> — signs may not match; compute u<sub>i</sub> = Av<sub>i</sub>/σ<sub>i</sub>.</li><li>Forgetting that NumPy returns V<sup>T</sup>, not V.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Every matrix: A = UΣV<sup>T</sup> (rotate – stretch – rotate).</li><li>σ<sub>i</sub> = √λ<sub>i</sub>(A<sup>T</sup>A); Av<sub>i</sub> = σ<sub>i</sub>u<sub>i</sub>.</li><li>A = Σσ<sub>i</sub>u<sub>i</sub>v<sub>i</sub><sup>T</sup>; rank = number of σ<sub>i</sub> &gt; 0; ‖A‖ = σ<sub>1</sub>.</li><li>Pseudo-inverse A<sup>+</sup> = VΣ<sup>+</sup>U<sup>T</sup>.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-29-singular-value-decomposition/" target="_blank" rel="noopener">MIT 18.06 — Lecture 29: Singular value decomposition</a></li><li><a href="https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-6-singular-value-decomposition-svd/" target="_blank" rel="noopener">MIT 18.065 — Lecture 6: Singular value decomposition (SVD)</a></li><li><a href="https://en.wikipedia.org/wiki/Singular_value_decomposition" target="_blank" rel="noopener">Wikipedia — Singular value decomposition</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.svd.html" target="_blank" rel="noopener">NumPy — numpy.linalg.svd</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>What are the singular values of diag(3, −2)?</li><li>A 3×3 matrix has singular values 5, 2, 0. What is its rank? Is it invertible?</li><li>What are the singular values of any 2×2 rotation matrix, and why?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 3 and 2 (A<sup>T</sup>A = diag(9, 4); singular values are never negative). 2) Rank 2; not invertible (|det| = 5·2·0 = 0). 3) Both equal 1: a rotation preserves lengths, so it stretches nothing (A<sup>T</sup>A = I).</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 10 · Bài 10.2</span>
<h2>Phân tích giá trị kỳ dị (SVD)</h2>
<p class="lead">Trị riêng cần ma trận vuông và không phải lúc nào cũng có dạng đẹp. SVD áp dụng cho <strong>mọi</strong> ma trận, mọi cỡ: nó nói rằng mọi ánh xạ tuyến tính là một phép quay, rồi một phép giãn dọc các trục vuông góc, rồi một phép quay nữa. Strang gọi đó là đỉnh cao của đại số tuyến tính.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu SVD A = UΣV<sup>T</sup> và ý nghĩa từng thừa số.</li><li>Tính giá trị kỳ dị và vectơ kỳ dị của ma trận 2×2 bằng tay.</li><li>Viết A thành tổng các mảnh hạng một và đọc hạng, chuẩn từ Σ.</li><li>Biết ma trận giả nghịch đảo A<sup>+</sup>.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Phân tích giá trị kỳ dị</span>A = U Σ V<sup>T</sup>    (m×n) = (m×m trực giao)(m×n chéo, σ<sub>1</sub> ≥ σ<sub>2</sub> ≥ … ≥ 0)(n×n trực giao)</div>
<ul><li>Các cột v<sub>i</sub> của V (<strong>vectơ kỳ dị phải</strong>) là vectơ riêng trực chuẩn của A<sup>T</sup>A.</li><li>Các <strong>giá trị kỳ dị</strong> σ<sub>i</sub> = √(trị riêng của A<sup>T</sup>A) ≥ 0.</li><li>Các cột u<sub>i</sub> của U (<strong>vectơ kỳ dị trái</strong>) là u<sub>i</sub> = Av<sub>i</sub>/σ<sub>i</sub>; chúng là vectơ riêng của AA<sup>T</sup>.</li></ul>
<p>Phương trình then chốt là Av<sub>i</sub> = σ<sub>i</sub>u<sub>i</sub>: A đưa cơ sở trực chuẩn v<sub>i</sub> sang cơ sở trực chuẩn u<sub>i</sub>, giãn theo hệ số σ<sub>i</sub>. Về hình học, A biến đường tròn đơn vị thành một elip có các bán trục σ<sub>1</sub>u<sub>1</sub> và σ<sub>2</sub>u<sub>2</sub>.</p>
<div class="formula"><span class="lbl">Tổng các mảnh hạng một</span>A = σ<sub>1</sub>u<sub>1</sub>v<sub>1</sub><sup>T</sup> + σ<sub>2</sub>u<sub>2</sub>v<sub>2</sub><sup>T</sup> + … + σ<sub>r</sub>u<sub>r</sub>v<sub>r</sub><sup>T</sup></div>
<p>Hệ quả: <strong>hạng A = số σ<sub>i</sub> khác 0</strong>; độ giãn lớn nhất ‖Ax‖/‖x‖ là σ<sub>1</sub> (chuẩn 2 của ma trận); với A vuông, |det A| = σ<sub>1</sub>σ<sub>2</sub>⋯σ<sub>n</sub>; tỉ số σ<sub>1</sub>/σ<sub>n</sub> là <strong>số điều kiện</strong>, đo mức sai số làm tròn có thể bị khuếch đại khi giải Ax = b. Các vectơ v<sub>1</sub>…v<sub>r</sub>, u<sub>1</sub>…u<sub>r</sub> là cơ sở trực chuẩn của không gian hàng và không gian cột — bốn không gian con ở Bài 6.3, giờ có cơ sở hoàn hảo.</p>
<p><strong>Giả nghịch đảo.</strong> A<sup>+</sup> = VΣ<sup>+</sup>U<sup>T</sup>, trong đó Σ<sup>+</sup> nghịch đảo các σ khác 0. x = A<sup>+</sup>b là nghiệm bình phương tối thiểu có độ dài nhỏ nhất, và tồn tại kể cả khi A không vuông hay không khả nghịch (<code>np.linalg.pinv</code>).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>SVD bằng tay.</b></p>
<table class="matrix"><caption>A</caption><tbody><tr><td>3</td><td>0</td></tr><tr><td>4</td><td>5</td></tr></tbody></table>
<p>Bước 1: A<sup>T</sup>A = [[25, 20], [20, 25]], trị riêng 45 và 5 ⇒ <b>σ<sub>1</sub> = √45 = 3√5 ≈ 6,7082, σ<sub>2</sub> = √5 ≈ 2,2361</b>.</p>
<p>Bước 2: vectơ riêng của A<sup>T</sup>A: v<sub>1</sub> = (1, 1)/√2, v<sub>2</sub> = (−1, 1)/√2.</p>
<p>Bước 3: u<sub>1</sub> = Av<sub>1</sub>/σ<sub>1</sub> = (3, 9)/(√2·3√5) = (1, 3)/√10; u<sub>2</sub> = Av<sub>2</sub>/σ<sub>2</sub> = (−3, 1)/(√2·√5) = (−3, 1)/√10. Kiểm: u<sub>1</sub>·u<sub>2</sub> = (−3 + 3)/10 = 0 ✓, và σ<sub>1</sub>σ<sub>2</sub> = √225 = 15 = |det A| ✓.</p></div>
<pre><code class="language-python">import numpy as np
A = np.array([[3, 0],
              [4, 5]], dtype=float)
U, s, Vt = np.linalg.svd(A)
print(s.round(4), (np.sqrt(45)).round(4), np.sqrt(5).round(4))
print(U.round(4))
print(Vt.round(4))
print(np.allclose(U @ np.diag(s) @ Vt, A))</code></pre>
<div class="out">[6.7082 2.2361] 6.7082 2.2361<br>[[-0.3162 -0.9487]<br> [-0.9487  0.3162]]<br>[[-0.7071 -0.7071]<br> [-0.7071  0.7071]]<br>True</div>
<p>NumPy trả về V<sup>T</sup> (các hàng là v<sub>i</sub>) và đổi dấu cặp u<sub>1</sub>, v<sub>1</sub>: (−0,3162; −0,9487) = −(1, 3)/√10 và (−0,7071; −0,7071) = −v<sub>1</sub>. Đổi dấu đồng thời u<sub>i</sub> và v<sub>i</sub> không làm đổi σ<sub>i</sub>u<sub>i</sub>v<sub>i</sub><sup>T</sup>.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nhầm giá trị kỳ dị với trị riêng: với A = [[3, 0], [4, 5]] trị riêng là 3 và 5, còn giá trị kỳ dị là 6,7082 và 2,2361.</li><li>Chọn u<sub>i</sub> là vectơ riêng của AA<sup>T</sup> một cách độc lập với v<sub>i</sub> — dấu có thể lệch; hãy tính u<sub>i</sub> = Av<sub>i</sub>/σ<sub>i</sub>.</li><li>Quên rằng NumPy trả V<sup>T</sup>, không phải V.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Mọi ma trận: A = UΣV<sup>T</sup> (quay – giãn – quay).</li><li>σ<sub>i</sub> = √λ<sub>i</sub>(A<sup>T</sup>A); Av<sub>i</sub> = σ<sub>i</sub>u<sub>i</sub>.</li><li>A = Σσ<sub>i</sub>u<sub>i</sub>v<sub>i</sub><sup>T</sup>; hạng = số σ<sub>i</sub> &gt; 0; ‖A‖ = σ<sub>1</sub>.</li><li>Giả nghịch đảo A<sup>+</sup> = VΣ<sup>+</sup>U<sup>T</sup>.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-29-singular-value-decomposition/" target="_blank" rel="noopener">MIT 18.06 — Bài 29: Phân tích giá trị kỳ dị</a></li><li><a href="https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-6-singular-value-decomposition-svd/" target="_blank" rel="noopener">MIT 18.065 — Bài 6: Phân tích giá trị kỳ dị (SVD)</a></li><li><a href="https://en.wikipedia.org/wiki/Singular_value_decomposition" target="_blank" rel="noopener">Wikipedia — Singular value decomposition</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.svd.html" target="_blank" rel="noopener">NumPy — numpy.linalg.svd</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Giá trị kỳ dị của diag(3, −2) là gì?</li><li>Ma trận 3×3 có giá trị kỳ dị 5, 2, 0. Hạng bằng bao nhiêu? Có khả nghịch không?</li><li>Giá trị kỳ dị của một ma trận quay 2×2 bất kỳ là gì, vì sao?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 3 và 2 (A<sup>T</sup>A = diag(9, 4); giá trị kỳ dị không bao giờ âm). 2) Hạng 2; không khả nghịch (|det| = 5·2·0 = 0). 3) Cả hai bằng 1: phép quay giữ độ dài, nên không giãn gì (A<sup>T</sup>A = I).</p></div>`);

const c103 = L('maa102-ts-10-3',
  '10.3 — SVD in action: low-rank approximation, image compression and PCA|||10.3 — SVD trong thực tế: xấp xỉ hạng thấp, nén ảnh và PCA',
  'Định lý Eckart–Young (xấp xỉ hạng k tốt nhất), nén ảnh bằng SVD cắt cụt và khử nhiễu, PCA bằng SVD của dữ liệu đã trừ trung bình, tỉ lệ phương sai giải thích, liên hệ hệ gợi ý và embedding — có code NumPy chạy thật.',
  `<span class="eyebrow">MAA102 · Chapter 10 · Lesson 10.3</span>
<h2>SVD in action: low-rank approximation, image compression and PCA</h2>
<p class="lead">Because the singular values come sorted from largest to smallest, keeping only the first few terms of A = Σσ<sub>i</sub>u<sub>i</sub>v<sub>i</sub><sup>T</sup> gives the best possible simple approximation of A. That one fact powers image compression, noise removal, recommender systems and principal component analysis.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the Eckart–Young theorem for the best rank-k approximation.</li><li>Compress an image (a matrix) with a truncated SVD and measure error and storage.</li><li>Perform PCA with the SVD of centred data and read the explained-variance ratio.</li><li>Connect low rank with recommender systems and embeddings.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Eckart–Young theorem</span>A<sub>k</sub> = σ<sub>1</sub>u<sub>1</sub>v<sub>1</sub><sup>T</sup> + … + σ<sub>k</sub>u<sub>k</sub>v<sub>k</sub><sup>T</sup> is the closest rank-k matrix to A;   ‖A − A<sub>k</sub>‖<sub>F</sub><sup>2</sup> = σ<sub>k+1</sub><sup>2</sup> + … + σ<sub>r</sub><sup>2</sup></div>
<p><strong>Compression.</strong> A grey-scale image is an m×n matrix of brightness values. Storing A<sub>k</sub> needs only k(m + n + 1) numbers (k columns u<sub>i</sub>, k rows v<sub>i</sub><sup>T</sup>, k values σ<sub>i</sub>) instead of mn. If the singular values drop quickly, a small k already looks almost identical. Small singular values often carry mostly <strong>noise</strong>, so truncating also <strong>denoises</strong>.</p>
<p><strong>PCA (principal component analysis).</strong> Put m data points (samples) as the rows of X, one column per feature. (1) <em>Centre</em> it: subtract each column's mean to get X<sub>c</sub>. (2) Compute the SVD X<sub>c</sub> = UΣV<sup>T</sup>. (3) The rows of V<sup>T</sup> (the vectors v<sub>i</sub>) are the <strong>principal directions</strong> — the eigenvectors of the covariance matrix X<sub>c</sub><sup>T</sup>X<sub>c</sub>/(m − 1) — and σ<sub>i</sub><sup>2</sup>/(m − 1) is the variance along v<sub>i</sub>. (4) The share σ<sub>i</sub><sup>2</sup>/Σσ<sub>j</sub><sup>2</sup> is the <strong>explained variance ratio</strong>. (5) Projecting onto the first k directions, Z = X<sub>c</sub>V<sub>k</sub>, reduces the data to k dimensions while keeping as much variance as possible.</p>
<p>PCA is used to visualise high-dimensional data in 2D, to compress features before training, and to remove correlated features. Recommender systems approximate the users × items rating matrix by a low-rank product, and word embeddings were historically obtained from a truncated SVD of a word co-occurrence matrix (LSA).</p>
<h3>✍️ Worked example 1 — compressing a 100×100 “image”</h3>
<pre><code class="language-python">import numpy as np
rng = np.random.default_rng(0)
# a 100x100 "image": a smooth rank-2 pattern plus a little noise
x = np.linspace(0, 1, 100)
smooth = np.outer(np.sin(3 * x), np.cos(2 * x)) + 0.5 * np.outer(x, x**2)
img = smooth + 0.02 * rng.standard_normal((100, 100))
U, s, Vt = np.linalg.svd(img)
for k in (1, 2, 5, 20):
    Ak = U[:, :k] @ np.diag(s[:k]) @ Vt[:k, :]
    err = np.linalg.norm(img - Ak) / np.linalg.norm(img)
    store = k * (100 + 100 + 1) / (100 * 100)
    print(k, round(err, 4), f"{store:.1%}")
print(s[:4].round(3))</code></pre>
<div class="out">1 0.1526 2.0%<br>2 0.0404 4.0%<br>5 0.0381 10.1%<br>20 0.0284 40.2%<br>[47.854  7.127  0.388  0.369]</div>
<p><b>Reading the output.</b> The first two singular values (47.9 and 7.1) are large, then they collapse to about 0.4: the image is “rank 2 plus noise”. With k = 2 (4% of the storage) the relative error is 4.0%; going to k = 20 only removes noise (2.8%). The remaining error is the noise itself — which is why A<sub>2</sub> is actually a <em>cleaner</em> image than the original.</p>
<h3>✍️ Worked example 2 — PCA of 2-D data</h3>
<pre><code class="language-python">import numpy as np
rng = np.random.default_rng(1)
# 200 points stretched along the direction (2, 1)
t = rng.standard_normal(200)
X = np.column_stack([2 * t, t]) + 0.3 * rng.standard_normal((200, 2))
Xc = X - X.mean(axis=0)                  # 1) centre the data
U, s, Vt = np.linalg.svd(Xc, full_matrices=False)
print(Vt[0].round(3))                    # 2) first principal direction
print((s**2 / (s**2).sum()).round(3))    # 3) explained variance ratio
Z = Xc @ Vt[0]                           # 4) 1-D coordinates (projection)
print(Z.shape)</code></pre>
<div class="out">[-0.895 -0.447]<br>[0.98 0.02]<br>(200,)</div>
<p>The first principal direction is ±(0.894, 0.447) = ±(2, 1)/√5 — exactly the direction we built in — and it explains 98% of the variance. Replacing each 2-D point by one number Z loses only 2% of the information. <a href="https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html" target="_blank" rel="noopener">scikit-learn's PCA</a> does the same steps (centring + SVD).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Running PCA without centring the data — the first “component” then just points at the mean.</li><li>Mixing features with very different units (metres and millimetres) without standardising — PCA then follows the largest unit.</li><li>Keeping k by habit: look at the singular values (or the explained-variance curve) and cut where they drop.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Eckart–Young: the truncated SVD A<sub>k</sub> is the best rank-k approximation; error = the dropped σ's.</li><li>Compression: store k(m + n + 1) numbers instead of mn; small σ's are often noise.</li><li>PCA = SVD of the centred data; v<sub>i</sub> = principal directions, σ<sub>i</sub><sup>2</sup> ∝ variance.</li><li>Low rank is the hidden structure behind recommenders, LSA embeddings and denoising.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-7-eckart-young-the-closest-rank-k-matrix-to-a/" target="_blank" rel="noopener">MIT 18.065 — Lecture 7: Eckart-Young, the closest rank k matrix to A</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-31-change-of-basis-image-compression/" target="_blank" rel="noopener">MIT 18.06 — Lecture 31: Change of basis; image compression</a></li><li><a href="https://en.wikipedia.org/wiki/Principal_component_analysis" target="_blank" rel="noopener">Wikipedia — Principal component analysis</a></li><li><a href="https://en.wikipedia.org/wiki/Low-rank_approximation" target="_blank" rel="noopener">Wikipedia — Low-rank approximation</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A 1000×800 image is stored as a rank-50 approximation. How many numbers are stored, and what fraction of the original?</li><li>A matrix has singular values 10, 5, 1, 0.1. What is the Frobenius error of the best rank-2 approximation?</li><li>In a PCA, the explained-variance ratios are 0.70, 0.20, 0.06, 0.04. How many components keep at least 90% of the variance?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 50·(1000 + 800 + 1) = 90 050 numbers, ≈ 11.3% of 800 000. 2) √(1<sup>2</sup> + 0.1<sup>2</sup>) = √1.01 ≈ 1.005. 3) Two (0.70 + 0.20 = 0.90).</p></div>`,
  `<span class="eyebrow">MAA102 · Chương 10 · Bài 10.3</span>
<h2>SVD trong thực tế: xấp xỉ hạng thấp, nén ảnh và PCA</h2>
<p class="lead">Vì các giá trị kỳ dị được xếp từ lớn đến nhỏ, giữ lại vài số hạng đầu của A = Σσ<sub>i</sub>u<sub>i</sub>v<sub>i</sub><sup>T</sup> cho xấp xỉ đơn giản tốt nhất có thể của A. Chỉ một sự kiện đó đã vận hành nén ảnh, khử nhiễu, hệ gợi ý và phân tích thành phần chính.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu định lý Eckart–Young về xấp xỉ hạng k tốt nhất.</li><li>Nén một ảnh (một ma trận) bằng SVD cắt cụt, đo sai số và dung lượng lưu.</li><li>Làm PCA bằng SVD của dữ liệu đã trừ trung bình và đọc tỉ lệ phương sai giải thích.</li><li>Liên hệ hạng thấp với hệ gợi ý và embedding.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Định lý Eckart–Young</span>A<sub>k</sub> = σ<sub>1</sub>u<sub>1</sub>v<sub>1</sub><sup>T</sup> + … + σ<sub>k</sub>u<sub>k</sub>v<sub>k</sub><sup>T</sup> là ma trận hạng k gần A nhất;   ‖A − A<sub>k</sub>‖<sub>F</sub><sup>2</sup> = σ<sub>k+1</sub><sup>2</sup> + … + σ<sub>r</sub><sup>2</sup></div>
<p><strong>Nén ảnh.</strong> Ảnh xám là ma trận m×n các giá trị độ sáng. Lưu A<sub>k</sub> chỉ cần k(m + n + 1) số (k cột u<sub>i</sub>, k hàng v<sub>i</sub><sup>T</sup>, k giá trị σ<sub>i</sub>) thay vì mn. Nếu giá trị kỳ dị giảm nhanh, k nhỏ đã trông gần như y hệt. Các giá trị kỳ dị nhỏ thường chủ yếu mang <strong>nhiễu</strong>, nên cắt cụt cũng là <strong>khử nhiễu</strong>.</p>
<p><strong>PCA (phân tích thành phần chính).</strong> Xếp m điểm dữ liệu (mẫu) làm các hàng của X, mỗi cột một đặc trưng. (1) <em>Trừ trung bình</em>: trừ trung bình của mỗi cột được X<sub>c</sub>. (2) Tính SVD X<sub>c</sub> = UΣV<sup>T</sup>. (3) Các hàng của V<sup>T</sup> (các vectơ v<sub>i</sub>) là <strong>hướng chính</strong> — vectơ riêng của ma trận hiệp phương sai X<sub>c</sub><sup>T</sup>X<sub>c</sub>/(m − 1) — và σ<sub>i</sub><sup>2</sup>/(m − 1) là phương sai theo v<sub>i</sub>. (4) Tỉ lệ σ<sub>i</sub><sup>2</sup>/Σσ<sub>j</sub><sup>2</sup> là <strong>tỉ lệ phương sai giải thích</strong>. (5) Chiếu lên k hướng đầu, Z = X<sub>c</sub>V<sub>k</sub>, giảm dữ liệu về k chiều mà giữ được nhiều phương sai nhất.</p>
<p>PCA dùng để trực quan hoá dữ liệu nhiều chiều trên mặt phẳng 2D, nén đặc trưng trước khi huấn luyện, và loại đặc trưng tương quan. Hệ gợi ý xấp xỉ ma trận đánh giá người dùng × sản phẩm bằng một tích hạng thấp, và word embedding thời đầu được lấy từ SVD cắt cụt của ma trận đồng xuất hiện từ (LSA).</p>
<h3>✍️ Ví dụ 1 — nén một “ảnh” 100×100</h3>
<pre><code class="language-python">import numpy as np
rng = np.random.default_rng(0)
# a 100x100 "image": a smooth rank-2 pattern plus a little noise
x = np.linspace(0, 1, 100)
smooth = np.outer(np.sin(3 * x), np.cos(2 * x)) + 0.5 * np.outer(x, x**2)
img = smooth + 0.02 * rng.standard_normal((100, 100))
U, s, Vt = np.linalg.svd(img)
for k in (1, 2, 5, 20):
    Ak = U[:, :k] @ np.diag(s[:k]) @ Vt[:k, :]
    err = np.linalg.norm(img - Ak) / np.linalg.norm(img)
    store = k * (100 + 100 + 1) / (100 * 100)
    print(k, round(err, 4), f"{store:.1%}")
print(s[:4].round(3))</code></pre>
<div class="out">1 0.1526 2.0%<br>2 0.0404 4.0%<br>5 0.0381 10.1%<br>20 0.0284 40.2%<br>[47.854  7.127  0.388  0.369]</div>
<p><b>Đọc kết quả.</b> Hai giá trị kỳ dị đầu (47,9 và 7,1) lớn, rồi sụt về khoảng 0,4: ảnh là “hạng 2 cộng nhiễu”. Với k = 2 (4% dung lượng) sai số tương đối là 4,0%; tăng lên k = 20 chỉ bớt thêm nhiễu (2,8%). Phần sai số còn lại chính là nhiễu — vì thế A<sub>2</sub> thực ra là ảnh <em>sạch hơn</em> ảnh gốc.</p>
<h3>✍️ Ví dụ 2 — PCA của dữ liệu 2 chiều</h3>
<pre><code class="language-python">import numpy as np
rng = np.random.default_rng(1)
# 200 points stretched along the direction (2, 1)
t = rng.standard_normal(200)
X = np.column_stack([2 * t, t]) + 0.3 * rng.standard_normal((200, 2))
Xc = X - X.mean(axis=0)                  # 1) centre the data
U, s, Vt = np.linalg.svd(Xc, full_matrices=False)
print(Vt[0].round(3))                    # 2) first principal direction
print((s**2 / (s**2).sum()).round(3))    # 3) explained variance ratio
Z = Xc @ Vt[0]                           # 4) 1-D coordinates (projection)
print(Z.shape)</code></pre>
<div class="out">[-0.895 -0.447]<br>[0.98 0.02]<br>(200,)</div>
<p>Hướng chính thứ nhất là ±(0,894; 0,447) = ±(2, 1)/√5 — đúng hướng ta đã tạo dữ liệu — và nó giải thích 98% phương sai. Thay mỗi điểm 2 chiều bằng một số Z chỉ mất 2% thông tin. <a href="https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html" target="_blank" rel="noopener">PCA của scikit-learn</a> làm đúng các bước này (trừ trung bình + SVD).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chạy PCA mà không trừ trung bình — “thành phần” đầu tiên khi đó chỉ chỉ về phía trung bình.</li><li>Trộn các đặc trưng có đơn vị rất khác nhau (mét và milimét) mà không chuẩn hoá — PCA sẽ đi theo đơn vị lớn nhất.</li><li>Chọn k theo thói quen: hãy nhìn các giá trị kỳ dị (hoặc đường phương sai giải thích) và cắt ở chỗ chúng sụt.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Eckart–Young: SVD cắt cụt A<sub>k</sub> là xấp xỉ hạng k tốt nhất; sai số = các σ bị bỏ.</li><li>Nén: lưu k(m + n + 1) số thay vì mn; σ nhỏ thường là nhiễu.</li><li>PCA = SVD của dữ liệu đã trừ trung bình; v<sub>i</sub> = hướng chính, σ<sub>i</sub><sup>2</sup> ∝ phương sai.</li><li>Hạng thấp là cấu trúc ẩn đằng sau hệ gợi ý, embedding LSA và khử nhiễu.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-7-eckart-young-the-closest-rank-k-matrix-to-a/" target="_blank" rel="noopener">MIT 18.065 — Bài 7: Eckart-Young, ma trận hạng k gần A nhất</a></li><li><a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-31-change-of-basis-image-compression/" target="_blank" rel="noopener">MIT 18.06 — Bài 31: Đổi cơ sở; nén ảnh</a></li><li><a href="https://en.wikipedia.org/wiki/Principal_component_analysis" target="_blank" rel="noopener">Wikipedia — Principal component analysis</a></li><li><a href="https://en.wikipedia.org/wiki/Low-rank_approximation" target="_blank" rel="noopener">Wikipedia — Low-rank approximation</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Một ảnh 1000×800 được lưu bằng xấp xỉ hạng 50. Lưu bao nhiêu số, bằng bao nhiêu phần của bản gốc?</li><li>Một ma trận có giá trị kỳ dị 10, 5, 1, 0,1. Sai số Frobenius của xấp xỉ hạng 2 tốt nhất là bao nhiêu?</li><li>Trong một PCA, tỉ lệ phương sai giải thích là 0,70; 0,20; 0,06; 0,04. Cần bao nhiêu thành phần để giữ ít nhất 90% phương sai?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 50·(1000 + 800 + 1) = 90 050 số, ≈ 11,3% của 800 000. 2) √(1<sup>2</sup> + 0,1<sup>2</sup>) = √1,01 ≈ 1,005. 3) Hai (0,70 + 0,20 = 0,90).</p></div>`);

const q10 = QZ(10, 'Quiz — Chapter 10: Symmetric matrices, SVD, PCA|||Quiz — Chương 10: Ma trận đối xứng, SVD, PCA', 'Kiểm tra chương 10: định lý phổ, xác định dương, giá trị kỳ dị, A = UΣVᵀ, hạng từ SVD, Eckart–Young, nén ảnh, PCA.', [
  Q('q1', 'A real symmetric matrix always has|||Một ma trận đối xứng thực luôn có',
    ['complex eigenvalues|||trị riêng phức', 'real eigenvalues and orthogonal eigenvectors|||trị riêng thực và vectơ riêng trực giao', 'determinant 1|||định thức 1', 'only positive entries|||chỉ phần tử dương'], 1,
    'Spectral theorem: S = QΛQᵀ.|||Định lý phổ: S = QΛQᵀ.'),
  Q('q2', 'Which matrix is positive definite?|||Ma trận nào xác định dương?',
    ['[[1, 2], [2, 1]]|||[[1, 2], [2, 1]]', '[[2, 1], [1, 2]]|||[[2, 1], [1, 2]]', '[[0, 1], [1, 0]]|||[[0, 1], [1, 0]]', '[[1, 0], [0, −1]]|||[[1, 0], [0, −1]]'], 1,
    'Eigenvalues 3 and 1 are both positive.|||Trị riêng 3 và 1 đều dương.'),
  Q('q3', 'The singular values of A are|||Các giá trị kỳ dị của A là',
    ['the eigenvalues of A|||trị riêng của A', 'the square roots of the eigenvalues of AᵀA|||căn bậc hai của trị riêng của AᵀA', 'the diagonal entries of A|||phần tử đường chéo của A', 'the pivots of A|||các pivot của A'], 1,
    'σᵢ = √λᵢ(AᵀA) ≥ 0.|||σᵢ = √λᵢ(AᵀA) ≥ 0.'),
  Q('q4', 'The singular values of [[3, 0], [4, 5]] are|||Giá trị kỳ dị của [[3, 0], [4, 5]] là',
    ['3 and 5|||3 và 5', '3√5 and √5|||3√5 và √5', '45 and 5|||45 và 5', '7 and 2|||7 và 2'], 1,
    'AᵀA = [[25, 20], [20, 25]] has eigenvalues 45 and 5.|||AᵀA = [[25, 20], [20, 25]] có trị riêng 45 và 5.'),
  Q('q5', 'In A = UΣVᵀ, the matrices U and V are|||Trong A = UΣVᵀ, các ma trận U và V',
    ['triangular|||tam giác', 'orthogonal|||trực giao', 'diagonal|||chéo', 'symmetric|||đối xứng'], 1,
    'Their columns are orthonormal singular vectors.|||Các cột của chúng là vectơ kỳ dị trực chuẩn.'),
  Q('q6', 'The rank of A equals|||Hạng của A bằng',
    ['the largest singular value|||giá trị kỳ dị lớn nhất', 'the number of non-zero singular values|||số giá trị kỳ dị khác 0', 'the sum of the singular values|||tổng các giá trị kỳ dị', 'the number of rows|||số hàng'], 1,
    'A = σ₁u₁v₁ᵀ + … + σᵣuᵣvᵣᵀ.|||A = σ₁u₁v₁ᵀ + … + σᵣuᵣvᵣᵀ.'),
  Q('q7', 'Singular values 10, 5, 1, 0.1. The Frobenius error of the best rank-2 approximation is|||Giá trị kỳ dị 10, 5, 1, 0.1. Sai số Frobenius của xấp xỉ hạng 2 tốt nhất là',
    ['1.1|||1,1', '√1.01 ≈ 1.005|||√1,01 ≈ 1,005', '5|||5', '0.1|||0,1'], 1,
    'Eckart–Young: √(σ₃² + σ₄²).|||Eckart–Young: √(σ₃² + σ₄²).'),
  Q('q8', 'Storing a rank-k approximation of an m×n image needs|||Lưu xấp xỉ hạng k của ảnh m×n cần',
    ['mn numbers|||mn số', 'k(m + n + 1) numbers|||k(m + n + 1) số', 'k² numbers|||k² số', 'kmn numbers|||kmn số'], 1,
    'k vectors uᵢ, k vectors vᵢ and k numbers σᵢ.|||k vectơ uᵢ, k vectơ vᵢ và k số σᵢ.'),
  Q('q9', 'The first step of PCA on a data matrix X is to|||Bước đầu tiên của PCA trên ma trận dữ liệu X là',
    ['invert X|||nghịch đảo X', 'subtract the mean of each feature (centre the data)|||trừ trung bình mỗi đặc trưng (căn giữa dữ liệu)', 'sort the rows|||sắp xếp các hàng', 'compute det X|||tính det X'], 1,
    'Then the SVD of the centred data gives the principal directions.|||Rồi SVD của dữ liệu đã căn giữa cho các hướng chính.'),
  Q('q10', 'Explained variance ratios 0.70, 0.20, 0.06, 0.04: components needed for 90%|||Tỉ lệ phương sai giải thích 0,70; 0,20; 0,06; 0,04: số thành phần cần cho 90%',
    ['1|||1', '2|||2', '3|||3', '4|||4'], 1,
    '0.70 + 0.20 = 0.90.|||0,70 + 0,20 = 0,90.'),
]);

const ch10 = {
  title: 'Chapter 10 — Symmetric matrices, the SVD and applications (PCA, compression)|||Chương 10 — Ma trận đối xứng, SVD và ứng dụng (PCA, nén ảnh)',
  description: 'Định lý phổ, xác định dương, Cholesky, phân tích giá trị kỳ dị A = UΣVᵀ, giả nghịch đảo, Eckart–Young, nén ảnh và khử nhiễu, PCA bằng SVD (Strang ch.6.5, 7 · MIT 18.06 bài 25–29 · MIT 18.065 bài 6–7).',
  lessons: [c101, c102, c103, q10],
};


// ───────────────────────────── Xuất ─────────────────────────────
export default [muc0, ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9, ch10];
