// Khoá TỰ SOẠN cho MLT201 — trường chưa công bố syllabus trên FLM (dò 09/11/2026). Soạn theo _HOP-DONG-TU-SOAN.md.
// Góc nhìn HÌNH HỌC & ỨNG DỤNG của ma trận: ma trận như phép biến đổi, toạ độ đồng nhất & đồ hoạ, định thức như hệ số
// diện tích/thể tích, đổi cơ sở, trị riêng như hướng bất biến, ma trận đối xứng & dạng toàn phương, SVD hình học,
// chuỗi Markov, ứng dụng đồ hoạ/robot/học máy. Khung bám: Lay/Lay/McDonald "Linear Algebra and Its Applications" 6e,
// Strang "Introduction to Linear Algebra" 6e, Deisenroth/Faisal/Ong "Mathematics for Machine Learning",
// Marschner/Shirley "Fundamentals of Computer Graphics" 5e; sách mở Margalit/Rabinoff "Interactive Linear Algebra".
// Mọi ví dụ số đã kiểm bằng sympy/numpy (python3); mọi đoạn code numpy đã chạy thật (numpy 2.5), output dán nguyên.
// Mọi link ngoài đã mở thử (HTTP 200 + tiêu đề đúng chủ đề) ngày 09/11/2026.
// ⚠️ File KHÔNG dùng chuỗi nội suy (dấu đô-la + ngoặc nhọn) và không backtick lồng.
// Ký hiệu ma trận trong bài: [a b; c d] = hàng 1 là (a, b), hàng 2 là (c, d) — giải thích ở bài 0.1.

const bi = (en, vi) => '<div class="ml-en">' + en + '</div>\n<div class="ml-vi">' + vi + '</div>';
const L = (slug, title, description, en, vi) => ({ title, slug, type: 'DOCUMENT', description, content: bi(en, vi) });
const Q = (id, question, options, correctIndex, explanation) => ({ id, question, options, correctIndex, points: 1, explanation });
const QZ = (ch, title, description, questions) => ({
  title, slug: 'mlt201-ts-quiz-' + ch, type: 'QUIZ', description,
  quiz: { timeLimitSeconds: 900, questions },
});

// ───────────────────────────── Mục 0 ─────────────────────────────
const m01 = L('mlt201-ts-0-1',
  '0.1 — Welcome to MLT201: matrices as geometric transformations|||0.1 — Giới thiệu MLT201: ma trận là phép biến đổi hình học',
  'MLT201 học gì, vì sao sinh viên CNTT cần (đồ hoạ, game, robot, học máy), 8 chuẩn đầu ra tự soạn, ký hiệu dùng trong khoá, cảnh báo: trường chưa công bố syllabus trên FLM.',
  `<span class="eyebrow">MLT201 · Section 0 · Lesson 0.1</span>
<h2>Welcome to Matrices and Linear Transformations</h2>
<p class="lead">A matrix is not just a table of numbers. It is a <strong>machine that moves space</strong>: it rotates, stretches, flips, shears and projects every point at once. This course teaches you to <em>see</em> what a matrix does, and to use that picture in graphics, robotics and machine learning.</p>
<div class="callout"><p>⚠️ <strong>Important.</strong> FPT University has <strong>not published the MLT201 syllabus on FLM</strong> (we searched the code, its variants and the course name on 09/11/2026). This course framework is therefore <strong>self-authored</strong>, following international standard textbooks (Lay <em>Linear Algebra and Its Applications</em>, Strang <em>Introduction to Linear Algebra</em>, Deisenroth et al. <em>Mathematics for Machine Learning</em>, Marschner &amp; Shirley <em>Fundamentals of Computer Graphics</em>). <strong>Grading weights, assessment format and exam dates are decided by your lecturer</strong> — always follow the course outline given in class.</p></div>
<h3>What is this course about?</h3>
<p>A <strong>linear transformation</strong> is a function T that sends vectors to vectors and respects addition and scaling. Every such T between ℝ<sup>n</sup> and ℝ<sup>m</sup> is “multiply by a matrix”: T(x) = Ax. So each question about matrices has a geometric twin:</p>
<ul>
<li>Matrix product AB ⇔ doing transformation B, then A (composition).</li>
<li>Inverse A<sup>−1</sup> ⇔ undoing the motion; no inverse ⇔ the motion squashes space flat.</li>
<li>Determinant det A ⇔ the factor by which areas (2D) or volumes (3D) are multiplied.</li>
<li>Eigenvector ⇔ a direction the transformation does not turn, only stretches.</li>
<li>Singular value decomposition ⇔ every matrix is “rotate, stretch along axes, rotate”.</li>
</ul>
<h3>Why does an IT / AI student need it?</h3>
<ul>
<li><strong>Computer graphics &amp; games:</strong> every sprite, 3D model and camera is moved by 3×3 or 4×4 matrices in homogeneous coordinates; your GPU multiplies millions of them per frame.</li>
<li><strong>Robotics:</strong> the position of a robot gripper is a product of joint transformation matrices; the Jacobian determinant tells you when the arm gets stuck.</li>
<li><strong>Machine learning &amp; data:</strong> a neural-network layer is a matrix followed by a nonlinearity; PCA and recommender systems are eigenvalue/SVD problems; images are matrices that SVD can compress.</li>
<li><strong>Web &amp; search:</strong> PageRank is the steady state of a Markov chain — an eigenvector with eigenvalue 1.</li>
</ul>
<h3>Learning outcomes (self-authored)</h3>
<ol>
<li>Compute with vectors and matrices, and read a matrix–vector product as a combination of columns.</li>
<li>Decide whether a map is linear, find its standard matrix, its kernel and image, and describe it geometrically.</li>
<li>Build matrices for rotation, reflection, scaling, shear and projection, and compose and invert them.</li>
<li>Compute determinants and interpret them as signed area/volume factors; use them to test invertibility.</li>
<li>Use homogeneous coordinates to represent translations, rotations about a point and perspective projection.</li>
<li>Find coordinates in a new basis and the matrix of a transformation in that basis.</li>
<li>Compute eigenvalues and eigenvectors, diagonalise, and analyse dynamical systems and Markov chains.</li>
<li>Use orthogonality, symmetric matrices, quadratic forms and the SVD in least squares, PCA, compression and robotics, checking results with NumPy.</li>
</ol>
<h3>Related courses</h3>
<p>MLT201 is a <strong>semester-2</strong> mathematics course. It needs only high-school algebra and plane geometry (coordinates, vectors, sine and cosine). On this Academy, <strong>MAA102 — Linear Algebra</strong> gives the full algebraic foundation (row reduction, vector spaces, proofs); MLT201 focuses on the <em>geometric</em> and <em>applied</em> side, so the two complement each other. What you learn here is used again in later AI / machine-learning, image-processing and computer-graphics courses.</p>
<h3>Notation used in this course</h3>
<div class="formula"><span class="lbl">How matrices are written</span>[a b; c d] means the 2×2 matrix whose first row is (a, b) and second row is (c, d).<br>Vectors are columns, written in a line as (x, y) or (x, y, z).    e<sub>1</sub> = (1, 0), e<sub>2</sub> = (0, 1) are the standard basis vectors.</div>
<h3>How to study</h3>
<ul>
<li>Each lesson has objectives, a lecture with worked examples, common mistakes, a 📌 summary, 🔗 further learning and 🧪 practice with answers; every chapter ends with a quiz.</li>
<li><strong>Draw.</strong> For every 2×2 matrix, sketch where e<sub>1</sub>, e<sub>2</sub> and the unit square go. Ten seconds of drawing beats ten minutes of algebra.</li>
<li>Check calculations with NumPy (code in many lessons) or the Desmos matrix calculator — but do the first attempt by hand.</li>
</ul>`,
  `<span class="eyebrow">MLT201 · Mục 0 · Bài 0.1</span>
<h2>Chào mừng đến với Ma trận &amp; Biến đổi tuyến tính</h2>
<p class="lead">Ma trận không chỉ là một bảng số. Nó là một <strong>cỗ máy di chuyển cả không gian</strong>: quay, kéo giãn, lật, trượt và chiếu mọi điểm cùng lúc. Môn này dạy bạn <em>nhìn thấy</em> một ma trận đang làm gì, rồi dùng hình ảnh đó trong đồ hoạ, robot và học máy.</p>
<div class="callout"><p>⚠️ <strong>Lưu ý quan trọng.</strong> Trường <strong>chưa công bố syllabus của MLT201 trên FLM</strong> (đã dò mã môn, mã biến thể và tên môn ngày 09/11/2026). Vì vậy khung môn này là <strong>khung tự soạn</strong>, bám giáo trình chuẩn quốc tế (Lay <em>Linear Algebra and Its Applications</em>, Strang <em>Introduction to Linear Algebra</em>, Deisenroth và cộng sự <em>Mathematics for Machine Learning</em>, Marschner &amp; Shirley <em>Fundamentals of Computer Graphics</em>). <strong>Cách tính điểm, hình thức đánh giá và lịch thi theo giảng viên</strong> — luôn theo đề cương giảng viên phát trên lớp.</p></div>
<h3>Môn này học gì?</h3>
<p><strong>Biến đổi tuyến tính</strong> là hàm T biến vector thành vector, giữ nguyên phép cộng và phép nhân với số. Mọi T như vậy giữa ℝ<sup>n</sup> và ℝ<sup>m</sup> đều là “nhân với một ma trận”: T(x) = Ax. Nên mỗi câu hỏi về ma trận đều có một “bản sao hình học”:</p>
<ul>
<li>Tích AB ⇔ làm biến đổi B trước, rồi A (hợp thành).</li>
<li>Nghịch đảo A<sup>−1</sup> ⇔ hoàn tác chuyển động; không có nghịch đảo ⇔ chuyển động đè bẹp không gian.</li>
<li>Định thức det A ⇔ hệ số nhân diện tích (2D) hoặc thể tích (3D).</li>
<li>Vector riêng ⇔ hướng mà phép biến đổi không làm quay, chỉ kéo giãn.</li>
<li>Phân tích giá trị kỳ dị (SVD) ⇔ mọi ma trận đều là “quay, giãn theo trục, quay”.</li>
</ul>
<h3>Sinh viên CNTT / AI cần nó để làm gì?</h3>
<ul>
<li><strong>Đồ hoạ &amp; game:</strong> mọi sprite, mô hình 3D, camera đều được di chuyển bằng ma trận 3×3 hoặc 4×4 trong toạ độ đồng nhất; GPU nhân hàng triệu ma trận như thế mỗi khung hình.</li>
<li><strong>Robot:</strong> vị trí tay gắp là tích các ma trận biến đổi của từng khớp; định thức Jacobian cho biết khi nào cánh tay bị “kẹt”.</li>
<li><strong>Học máy &amp; dữ liệu:</strong> một lớp mạng nơ-ron là một ma trận rồi đến hàm phi tuyến; PCA và hệ gợi ý là bài toán trị riêng/SVD; ảnh là ma trận mà SVD nén được.</li>
<li><strong>Web &amp; tìm kiếm:</strong> PageRank là trạng thái dừng của chuỗi Markov — một vector riêng ứng với trị riêng 1.</li>
</ul>
<h3>Chuẩn đầu ra (tự soạn)</h3>
<ol>
<li>Tính toán với vector, ma trận; đọc tích ma trận – vector như tổ hợp các cột.</li>
<li>Xét một ánh xạ có tuyến tính không, tìm ma trận chuẩn, hạt nhân, ảnh và mô tả nó bằng hình học.</li>
<li>Lập ma trận quay, phản chiếu, co giãn, trượt, chiếu; hợp thành và nghịch đảo chúng.</li>
<li>Tính định thức và hiểu nó là hệ số diện tích/thể tích có dấu; dùng nó để xét khả nghịch.</li>
<li>Dùng toạ độ đồng nhất để biểu diễn tịnh tiến, quay quanh một điểm và phép chiếu phối cảnh.</li>
<li>Tìm toạ độ trong cơ sở mới và ma trận của một biến đổi trong cơ sở đó.</li>
<li>Tính trị riêng, vector riêng, chéo hoá; phân tích hệ động lực rời rạc và chuỗi Markov.</li>
<li>Dùng tính trực giao, ma trận đối xứng, dạng toàn phương và SVD trong bình phương tối thiểu, PCA, nén ảnh và robot; kiểm kết quả bằng NumPy.</li>
</ol>
<h3>Môn liên quan</h3>
<p>MLT201 là môn toán <strong>kỳ 2</strong>. Chỉ cần đại số và hình học phẳng phổ thông (toạ độ, vector, sin, cos). Trên Academy, môn <strong>MAA102 — Linear Algebra</strong> cho nền đại số đầy đủ (khử hàng, không gian vector, chứng minh); MLT201 nhấn vào phía <em>hình học</em> và <em>ứng dụng</em>, hai môn bổ sung cho nhau. Kiến thức ở đây được dùng lại trong các môn AI / học máy, xử lý ảnh và đồ hoạ máy tính về sau.</p>
<h3>Ký hiệu dùng trong khoá</h3>
<div class="formula"><span class="lbl">Cách viết ma trận</span>[a b; c d] là ma trận 2×2 có hàng 1 là (a, b), hàng 2 là (c, d).<br>Vector là cột, viết gọn trên một dòng (x, y) hoặc (x, y, z).    e<sub>1</sub> = (1, 0), e<sub>2</sub> = (0, 1) là các vector cơ sở chuẩn.</div>
<h3>Học thế nào cho hiệu quả</h3>
<ul>
<li>Mỗi bài có mục tiêu, bài giảng kèm ví dụ giải, lỗi hay gặp, 📌 tóm tắt, 🔗 học thêm và 🧪 tự luyện có đáp án; cuối mỗi chương có quiz.</li>
<li><strong>Hãy vẽ.</strong> Với mỗi ma trận 2×2, phác xem e<sub>1</sub>, e<sub>2</sub> và hình vuông đơn vị đi đâu. Mười giây vẽ hơn mười phút biến đổi đại số.</li>
<li>Kiểm phép tính bằng NumPy (có code trong nhiều bài) hoặc máy tính ma trận Desmos — nhưng lần đầu hãy tự làm tay.</li>
</ul>`);

const m02 = L('mlt201-ts-0-2',
  '0.2 — Textbooks & learning resources (verified)|||0.2 — Giáo trình & tài liệu học (đã kiểm)',
  'Bốn giáo trình chuẩn kèm ISBN đã kiểm (Lay 6e, Strang 6e, Mathematics for Machine Learning, Fundamentals of Computer Graphics 5e), sách mở Interactive Linear Algebra, MIT 18.06SC, 3Blue1Brown, Coursera, công cụ NumPy/Desmos/GeoGebra.',
  `<span class="eyebrow">MLT201 · Section 0 · Lesson 0.2</span>
<h2>Textbooks &amp; learning resources</h2>
<p class="lead">You do <strong>not</strong> need to buy anything to pass this course: <em>Interactive Linear Algebra</em> and <em>Mathematics for Machine Learning</em> are free and legal online, and every lesson links to the matching section.</p>
<h3>📘 Main textbooks</h3>
<ol>
<li><strong>David C. Lay, Steven R. Lay, Judi J. McDonald — <em>Linear Algebra and Its Applications</em>, 6th edition (Global Edition).</strong> Pearson, 2021. Paperback ISBN 978-1-292-35121-6. <a href="https://www.pearson.com/en-gb/subject-catalog/p/Lay-Linear-Algebra-and-Its-Applications-Global-Edition-6th-Edition/P200000004712/9781292419046" target="_blank" rel="noopener">Publisher page</a>. The most applied of the classic texts: linear transformations, computer graphics, Markov chains, least squares and the SVD. Our chapter order follows it most closely.</li>
<li><strong>Gilbert Strang — <em>Introduction to Linear Algebra</em>, 6th edition.</strong> Wellesley-Cambridge Press, 2023. ISBN 978-1-7331466-7-8. <a href="https://math.mit.edu/~gs/linearalgebra/ila6/indexila6.html" target="_blank" rel="noopener">Book website</a>. The textbook of MIT 18.06; excellent for the column picture, eigenvalues and the SVD.</li>
<li><strong>Marc Peter Deisenroth, A. Aldo Faisal, Cheng Soon Ong — <em>Mathematics for Machine Learning</em>.</strong> Cambridge University Press, 2020. Paperback ISBN 978-1-108-45514-5 (hardback 978-1-108-47004-9). <a href="https://mml-book.github.io/" target="_blank" rel="noopener">Free PDF on the companion website</a>. Chapters 2–4 (linear algebra, analytic geometry, matrix decompositions) and 10 (PCA) are used in Chapters 7–10 of this course.</li>
<li><strong>Steve Marschner, Peter Shirley — <em>Fundamentals of Computer Graphics</em>, 5th edition.</strong> A K Peters / CRC Press, 2021. ISBN 978-0-367-50503-5. <a href="https://www.routledge.com/Fundamentals-of-Computer-Graphics/Marschner-Shirley/p/book/9780367505035" target="_blank" rel="noopener">Publisher page</a>. The reference for transformation matrices, homogeneous coordinates and viewing (Chapter 6 of this course).</li>
</ol>
<h3>🎓 Free online book &amp; courses</h3>
<ul>
<li><a href="https://textbooks.math.gatech.edu/ila/" target="_blank" rel="noopener">Dan Margalit, Joseph Rabinoff — Interactive Linear Algebra (Georgia Tech, free, GFDL)</a>: interactive pictures of every transformation; most lessons link to it.</li>
<li><a href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/" target="_blank" rel="noopener">MIT OpenCourseWare 18.06SC — Linear Algebra (Gilbert Strang)</a>: lecture videos, recitations, problem sets with solutions.</li>
<li><a href="https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab" target="_blank" rel="noopener">3Blue1Brown — Essence of Linear Algebra (YouTube playlist)</a>: the best visual intuition for this exact course. Text versions: <a href="https://www.3blue1brown.com/topics/linear-algebra" target="_blank" rel="noopener">3blue1brown.com</a>.</li>
<li><a href="https://www.coursera.org/learn/linear-algebra-machine-learning" target="_blank" rel="noopener">Coursera — Mathematics for Machine Learning: Linear Algebra (Imperial College London)</a> and its follow-up <a href="https://www.coursera.org/learn/pca-machine-learning" target="_blank" rel="noopener">Mathematics for Machine Learning: PCA</a>.</li>
<li><a href="https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/" target="_blank" rel="noopener">MIT OCW 18.065 — Matrix Methods in Data Analysis, Signal Processing, and Machine Learning</a>: for after this course.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://numpy.org/doc/stable/reference/routines.linalg.html" target="_blank" rel="noopener">NumPy linear algebra (numpy.linalg)</a> — solve, det, inv, eig, eigh, svd, lstsq. All code in this course was run with NumPy 2.5.</li>
<li><a href="https://www.desmos.com/matrix" target="_blank" rel="noopener">Desmos Matrix Calculator</a> and <a href="https://www.geogebra.org/calculator" target="_blank" rel="noopener">GeoGebra Calculator Suite</a> — quick checks and pictures of transformations.</li>
<li><a href="https://www.wolframalpha.com/" target="_blank" rel="noopener">WolframAlpha</a> — eigenvalues, determinants, row reduction.</li>
</ul>
<div class="meo"><p><strong>Study plan.</strong> For each lesson: watch the matching 3Blue1Brown video (10–15 min) → read the lesson here → read the linked Interactive Linear Algebra section and try its interactive figure → do the 🧪 practice on paper → check with NumPy → take the chapter quiz. About 5–7 hours per chapter.</p></div>`,
  `<span class="eyebrow">MLT201 · Mục 0 · Bài 0.2</span>
<h2>Giáo trình &amp; tài liệu học</h2>
<p class="lead">Bạn <strong>không</strong> cần mua sách để qua môn: <em>Interactive Linear Algebra</em> và <em>Mathematics for Machine Learning</em> miễn phí, hợp pháp trên mạng, và mỗi bài đều dẫn tới đúng mục tương ứng.</p>
<h3>📘 Giáo trình chính</h3>
<ol>
<li><strong>David C. Lay, Steven R. Lay, Judi J. McDonald — <em>Linear Algebra and Its Applications</em>, tái bản lần 6 (Global Edition).</strong> Pearson, 2021. ISBN bản bìa mềm 978-1-292-35121-6. <a href="https://www.pearson.com/en-gb/subject-catalog/p/Lay-Linear-Algebra-and-Its-Applications-Global-Edition-6th-Edition/P200000004712/9781292419046" target="_blank" rel="noopener">Trang nhà xuất bản</a>. Giáo trình cổ điển thiên ứng dụng nhất: biến đổi tuyến tính, đồ hoạ máy tính, chuỗi Markov, bình phương tối thiểu, SVD. Thứ tự chương của khoá bám sách này sát nhất.</li>
<li><strong>Gilbert Strang — <em>Introduction to Linear Algebra</em>, tái bản lần 6.</strong> Wellesley-Cambridge Press, 2023. ISBN 978-1-7331466-7-8. <a href="https://math.mit.edu/~gs/linearalgebra/ila6/indexila6.html" target="_blank" rel="noopener">Trang sách</a>. Giáo trình của MIT 18.06; rất hay ở “góc nhìn cột”, trị riêng và SVD.</li>
<li><strong>Marc Peter Deisenroth, A. Aldo Faisal, Cheng Soon Ong — <em>Mathematics for Machine Learning</em>.</strong> Cambridge University Press, 2020. ISBN bìa mềm 978-1-108-45514-5 (bìa cứng 978-1-108-47004-9). <a href="https://mml-book.github.io/" target="_blank" rel="noopener">PDF miễn phí trên trang đi kèm</a>. Chương 2–4 (đại số tuyến tính, hình học giải tích, phân rã ma trận) và chương 10 (PCA) dùng cho Chương 7–10 của khoá.</li>
<li><strong>Steve Marschner, Peter Shirley — <em>Fundamentals of Computer Graphics</em>, tái bản lần 5.</strong> A K Peters / CRC Press, 2021. ISBN 978-0-367-50503-5. <a href="https://www.routledge.com/Fundamentals-of-Computer-Graphics/Marschner-Shirley/p/book/9780367505035" target="_blank" rel="noopener">Trang nhà xuất bản</a>. Sách tham chiếu về ma trận biến đổi, toạ độ đồng nhất và phép nhìn (Chương 6 của khoá).</li>
</ol>
<h3>🎓 Sách mở &amp; khoá học miễn phí</h3>
<ul>
<li><a href="https://textbooks.math.gatech.edu/ila/" target="_blank" rel="noopener">Dan Margalit, Joseph Rabinoff — Interactive Linear Algebra (Georgia Tech, miễn phí, GFDL)</a>: hình tương tác cho từng phép biến đổi; hầu hết bài đều dẫn tới sách này.</li>
<li><a href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/" target="_blank" rel="noopener">MIT OpenCourseWare 18.06SC — Đại số tuyến tính (Gilbert Strang)</a>: video bài giảng, bài chữa, bài tập có lời giải.</li>
<li><a href="https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab" target="_blank" rel="noopener">3Blue1Brown — Essence of Linear Algebra (danh sách phát YouTube)</a>: trực quan đẹp nhất cho đúng nội dung môn này. Bản chữ: <a href="https://www.3blue1brown.com/topics/linear-algebra" target="_blank" rel="noopener">3blue1brown.com</a>.</li>
<li><a href="https://www.coursera.org/learn/linear-algebra-machine-learning" target="_blank" rel="noopener">Coursera — Mathematics for Machine Learning: Linear Algebra (Imperial College London)</a> và khoá tiếp theo <a href="https://www.coursera.org/learn/pca-machine-learning" target="_blank" rel="noopener">Mathematics for Machine Learning: PCA</a>.</li>
<li><a href="https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/" target="_blank" rel="noopener">MIT OCW 18.065 — Phương pháp ma trận trong phân tích dữ liệu, xử lý tín hiệu và học máy</a>: học sau khi xong môn này.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://numpy.org/doc/stable/reference/routines.linalg.html" target="_blank" rel="noopener">NumPy linear algebra (numpy.linalg)</a> — solve, det, inv, eig, eigh, svd, lstsq. Mọi đoạn code trong khoá đã chạy bằng NumPy 2.5.</li>
<li><a href="https://www.desmos.com/matrix" target="_blank" rel="noopener">Desmos Matrix Calculator</a> và <a href="https://www.geogebra.org/calculator" target="_blank" rel="noopener">GeoGebra Calculator Suite</a> — kiểm nhanh và xem hình của phép biến đổi.</li>
<li><a href="https://www.wolframalpha.com/" target="_blank" rel="noopener">WolframAlpha</a> — trị riêng, định thức, khử hàng.</li>
</ul>
<div class="meo"><p><strong>Kế hoạch học.</strong> Mỗi bài: xem video 3Blue1Brown tương ứng (10–15 phút) → đọc bài ở đây → đọc mục Interactive Linear Algebra được dẫn và thử hình tương tác → làm 🧪 tự luyện ra giấy → kiểm bằng NumPy → làm quiz chương. Khoảng 5–7 giờ mỗi chương.</p></div>`);

const muc0 = {
  title: 'Section 0 — Course framework (self-authored, no FLM syllabus)|||Mục 0 — Khung môn học (tự soạn, trường chưa công bố syllabus)',
  description: 'Giới thiệu môn theo góc nhìn hình học & ứng dụng, chuẩn đầu ra tự soạn, giáo trình chuẩn kèm ISBN và tài liệu mở. Trường chưa công bố syllabus MLT201 trên FLM — điểm/lịch thi theo giảng viên.',
  lessons: [m01, m02],
};

// ───────────────────────────── Chương 1 ─────────────────────────────
const c11 = L('mlt201-ts-1-1',
  '1.1 — Vectors as arrows: linear combinations and span|||1.1 — Vector là mũi tên: tổ hợp tuyến tính và bao tuyến tính',
  'Vector trong ℝ², ℝ³ như mũi tên và như danh sách số; cộng, nhân với số; tổ hợp tuyến tính; giải c₁u + c₂v = w; span là đường thẳng, mặt phẳng hay cả không gian.',
  `<span class="eyebrow">MLT201 · Chapter 1 · Lesson 1.1</span>
<h2>Vectors as arrows: linear combinations and span</h2>
<p class="lead">Everything in this course is built from two operations on vectors: adding them and scaling them. Combining the two gives <strong>linear combinations</strong>, and the set of all combinations — the <strong>span</strong> — is the first geometric object we meet.</p>
<h3>🎯 Objectives</h3>
<ul><li>Read a vector both as a list of numbers and as an arrow from the origin.</li><li>Add and scale vectors algebraically and geometrically (head-to-tail rule).</li><li>Write a vector as a linear combination of given vectors by solving a small system.</li><li>Decide whether the span of two vectors is a line or the whole plane.</li></ul>
<h3>📖 Lecture</h3>
<p>A vector in ℝ<sup>2</sup> is a pair v = (v<sub>1</sub>, v<sub>2</sub>). Geometrically it is the arrow from the origin to the point (v<sub>1</sub>, v<sub>2</sub>). In a game, (3, −1) can be a velocity; in data science, (170, 65) can be a person's height and weight. Same algebra, different meaning.</p>
<div class="formula"><span class="lbl">Operations</span>u + v = (u<sub>1</sub> + v<sub>1</sub>, u<sub>2</sub> + v<sub>2</sub>)  — put v's tail on u's head<br>c·v = (c v<sub>1</sub>, c v<sub>2</sub>)  — stretch by |c|, flip if c &lt; 0</div>
<p>A <strong>linear combination</strong> of u and v is any vector c<sub>1</sub>u + c<sub>2</sub>v with real weights c<sub>1</sub>, c<sub>2</sub>. The <strong>span</strong> of u and v, written Span{u, v}, is the set of all such combinations. Geometrically:</p>
<ul><li>Span of one nonzero vector = the line through the origin in its direction.</li><li>Span of two vectors that are <em>not</em> on the same line = the whole plane ℝ<sup>2</sup> (in ℝ<sup>3</sup>: a plane through the origin).</li><li>Span of two vectors on the same line = just that line — the second vector adds nothing new.</li></ul>
<p>Think of u and v as two “moves” you are allowed to repeat and reverse as much as you like. The span is everywhere you can reach.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — compute a combination.</b> u = (2, 1), v = (−1, 3). Then 3u − 2v = (6, 3) − (−2, 6) = <b>(8, −3)</b>.</p></div>
<div class="callout"><p><b>Example 2 — find the weights.</b> Write w = (4, 9) as c<sub>1</sub>u + c<sub>2</sub>v.</p><p>Component by component: 2c<sub>1</sub> − c<sub>2</sub> = 4 and c<sub>1</sub> + 3c<sub>2</sub> = 9. From the first, c<sub>2</sub> = 2c<sub>1</sub> − 4; substitute: c<sub>1</sub> + 6c<sub>1</sub> − 12 = 9 ⇒ c<sub>1</sub> = 3, c<sub>2</sub> = 2. Check: 3(2, 1) + 2(−1, 3) = (6 − 2, 3 + 6) = (4, 9) ✓. So <b>w = 3u + 2v</b>.</p></div>
<div class="callout"><p><b>Example 3 — line or plane?</b> a = (1, 2), b = (−2, −4). Since b = −2a, both lie on the line y = 2x. Span{a, b} is that line; the point (1, 0) is <b>not</b> reachable. In contrast u = (2, 1), v = (−1, 3) are not parallel (the quick test: 2·3 − (−1)·1 = 7 ≠ 0), so Span{u, v} = ℝ<sup>2</sup>.</p></div>
<p>That number 2·3 − (−1)·1 is the <em>determinant</em> of the matrix with columns u, v. In Chapter 5 you will see it is the area of the parallelogram spanned by u and v — zero area means the two vectors are collinear.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking a vector “lives” at some position. A vector is a displacement; the arrow can be drawn anywhere, but in this course we draw it from the origin.</li><li>Believing any two vectors span the plane. Parallel vectors (one a multiple of the other) span only a line.</li><li>Forgetting that negative weights are allowed: the span includes going “backwards”.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Vectors add head-to-tail and scale by stretching/flipping.</li><li>Linear combination: c<sub>1</sub>u + c<sub>2</sub>v; finding the weights means solving a linear system.</li><li>Span = all reachable combinations: a point, a line, a plane, or the whole space.</li><li>Two vectors in ℝ<sup>2</sup> span the plane exactly when u<sub>1</sub>v<sub>2</sub> − u<sub>2</sub>v<sub>1</sub> ≠ 0.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/vectors" target="_blank" rel="noopener">3Blue1Brown — Vectors, what even are they?</a></li><li><a href="https://www.3blue1brown.com/lessons/span" target="_blank" rel="noopener">3Blue1Brown — Linear combinations, span, and basis vectors</a></li><li><a href="https://textbooks.math.gatech.edu/ila/vectors.html" target="_blank" rel="noopener">Interactive Linear Algebra — 2.1 Vectors</a></li><li><a href="https://textbooks.math.gatech.edu/ila/spans.html" target="_blank" rel="noopener">Interactive Linear Algebra — 2.2 Vector Equations and Spans</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>With u = (2, 1), v = (−1, 3), write (5, −1) as a combination of u and v.</li><li>Is (3, 6, 9) in Span{(1, 2, 3)}? Is (1, 2, 4)?</li><li>For which k do (1, k) and (k, 4) span only a line?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 2c<sub>1</sub> − c<sub>2</sub> = 5, c<sub>1</sub> + 3c<sub>2</sub> = −1 ⇒ c<sub>1</sub> = 2, c<sub>2</sub> = −1: (5, −1) = 2u − v. 2) (3, 6, 9) = 3·(1, 2, 3): yes. (1, 2, 4) is not a multiple: no. 3) Collinear when 1·4 − k·k = 0, i.e. k = 2 or k = −2.</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 1 · Bài 1.1</span>
<h2>Vector là mũi tên: tổ hợp tuyến tính và bao tuyến tính</h2>
<p class="lead">Mọi thứ trong môn này dựng từ hai phép toán trên vector: cộng và nhân với số. Ghép hai phép đó lại được <strong>tổ hợp tuyến tính</strong>, và tập mọi tổ hợp — <strong>bao tuyến tính (span)</strong> — là đối tượng hình học đầu tiên ta gặp.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Đọc vector vừa như danh sách số, vừa như mũi tên xuất phát từ gốc toạ độ.</li><li>Cộng và nhân vector với số bằng đại số và bằng hình (quy tắc nối đuôi).</li><li>Viết một vector thành tổ hợp tuyến tính của các vector cho trước bằng cách giải hệ nhỏ.</li><li>Xét span của hai vector là một đường thẳng hay cả mặt phẳng.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Vector trong ℝ<sup>2</sup> là cặp v = (v<sub>1</sub>, v<sub>2</sub>). Về hình học, đó là mũi tên từ gốc toạ độ tới điểm (v<sub>1</sub>, v<sub>2</sub>). Trong game, (3, −1) có thể là vận tốc; trong khoa học dữ liệu, (170, 65) có thể là chiều cao và cân nặng một người. Cùng một đại số, khác ý nghĩa.</p>
<div class="formula"><span class="lbl">Phép toán</span>u + v = (u<sub>1</sub> + v<sub>1</sub>, u<sub>2</sub> + v<sub>2</sub>)  — đặt đuôi v vào đầu u<br>c·v = (c v<sub>1</sub>, c v<sub>2</sub>)  — giãn |c| lần, lật ngược nếu c &lt; 0</div>
<p><strong>Tổ hợp tuyến tính</strong> của u và v là mọi vector c<sub>1</sub>u + c<sub>2</sub>v với trọng số thực c<sub>1</sub>, c<sub>2</sub>. <strong>Span</strong> của u và v, ký hiệu Span{u, v}, là tập mọi tổ hợp như thế. Về hình học:</p>
<ul><li>Span của một vector khác 0 = đường thẳng qua gốc theo hướng của nó.</li><li>Span của hai vector <em>không</em> cùng phương = cả mặt phẳng ℝ<sup>2</sup> (trong ℝ<sup>3</sup>: một mặt phẳng qua gốc).</li><li>Span của hai vector cùng phương = chỉ đường thẳng đó — vector thứ hai không thêm gì mới.</li></ul>
<p>Hãy coi u và v là hai “bước đi” được lặp lại và đi lùi bao nhiêu tuỳ thích. Span là mọi nơi bạn tới được.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — tính một tổ hợp.</b> u = (2, 1), v = (−1, 3). Khi đó 3u − 2v = (6, 3) − (−2, 6) = <b>(8, −3)</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — tìm trọng số.</b> Viết w = (4, 9) dưới dạng c<sub>1</sub>u + c<sub>2</sub>v.</p><p>Theo từng thành phần: 2c<sub>1</sub> − c<sub>2</sub> = 4 và c<sub>1</sub> + 3c<sub>2</sub> = 9. Từ phương trình đầu, c<sub>2</sub> = 2c<sub>1</sub> − 4; thế vào: c<sub>1</sub> + 6c<sub>1</sub> − 12 = 9 ⇒ c<sub>1</sub> = 3, c<sub>2</sub> = 2. Thử lại: 3(2, 1) + 2(−1, 3) = (6 − 2, 3 + 6) = (4, 9) ✓. Vậy <b>w = 3u + 2v</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — đường thẳng hay mặt phẳng?</b> a = (1, 2), b = (−2, −4). Vì b = −2a nên cả hai nằm trên đường y = 2x. Span{a, b} là đường thẳng đó; điểm (1, 0) <b>không</b> tới được. Ngược lại u = (2, 1), v = (−1, 3) không cùng phương (phép thử nhanh: 2·3 − (−1)·1 = 7 ≠ 0), nên Span{u, v} = ℝ<sup>2</sup>.</p></div>
<p>Con số 2·3 − (−1)·1 chính là <em>định thức</em> của ma trận có các cột u, v. Ở Chương 5 bạn sẽ thấy nó là diện tích hình bình hành dựng trên u và v — diện tích bằng 0 nghĩa là hai vector cùng phương.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nghĩ rằng vector “nằm” ở một vị trí cố định. Vector là một độ dời; mũi tên vẽ ở đâu cũng được, nhưng trong môn này ta vẽ từ gốc.</li><li>Tin rằng hai vector bất kỳ đều span cả mặt phẳng. Hai vector cùng phương (cái này là bội của cái kia) chỉ span một đường thẳng.</li><li>Quên rằng trọng số âm được phép: span gồm cả việc đi “lùi”.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Vector cộng theo quy tắc nối đuôi, nhân với số là giãn/lật.</li><li>Tổ hợp tuyến tính: c<sub>1</sub>u + c<sub>2</sub>v; tìm trọng số là giải một hệ tuyến tính.</li><li>Span = mọi tổ hợp tới được: một điểm, một đường, một mặt phẳng hoặc cả không gian.</li><li>Hai vector trong ℝ<sup>2</sup> span cả mặt phẳng đúng khi u<sub>1</sub>v<sub>2</sub> − u<sub>2</sub>v<sub>1</sub> ≠ 0.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/vectors" target="_blank" rel="noopener">3Blue1Brown — Vector thực ra là gì?</a></li><li><a href="https://www.3blue1brown.com/lessons/span" target="_blank" rel="noopener">3Blue1Brown — Tổ hợp tuyến tính, span và vector cơ sở</a></li><li><a href="https://textbooks.math.gatech.edu/ila/vectors.html" target="_blank" rel="noopener">Interactive Linear Algebra — 2.1 Vector</a></li><li><a href="https://textbooks.math.gatech.edu/ila/spans.html" target="_blank" rel="noopener">Interactive Linear Algebra — 2.2 Phương trình vector và span</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Với u = (2, 1), v = (−1, 3), viết (5, −1) thành tổ hợp của u và v.</li><li>(3, 6, 9) có thuộc Span{(1, 2, 3)} không? Còn (1, 2, 4)?</li><li>Với k nào thì (1, k) và (k, 4) chỉ span một đường thẳng?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 2c<sub>1</sub> − c<sub>2</sub> = 5, c<sub>1</sub> + 3c<sub>2</sub> = −1 ⇒ c<sub>1</sub> = 2, c<sub>2</sub> = −1: (5, −1) = 2u − v. 2) (3, 6, 9) = 3·(1, 2, 3): có. (1, 2, 4) không phải bội: không. 3) Cùng phương khi 1·4 − k·k = 0, tức k = 2 hoặc k = −2.</p></div>`);

const c12 = L('mlt201-ts-1-2',
  '1.2 — Dot product: length, angle, projection and similarity|||1.2 — Tích vô hướng: độ dài, góc, hình chiếu và độ tương đồng',
  'Tích vô hướng, độ dài, góc giữa hai vector, vuông góc, hình chiếu vuông góc lên một đường thẳng; ứng dụng: công cơ học, độ tương đồng cosin giữa văn bản trong tìm kiếm/ML.',
  `<span class="eyebrow">MLT201 · Chapter 1 · Lesson 1.2</span>
<h2>Dot product: length, angle, projection and similarity</h2>
<p class="lead">Addition and scaling tell us how to move; the <strong>dot product</strong> tells us how to <em>measure</em>: lengths, angles, shadows (projections) and how similar two data vectors are.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute dot products, lengths and the angle between two vectors.</li><li>Test whether two vectors are perpendicular.</li><li>Project a vector onto a line and split it into “along” and “perpendicular” parts.</li><li>Use cosine similarity to compare data vectors.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Dot product, length, angle</span>u · v = u<sub>1</sub>v<sub>1</sub> + u<sub>2</sub>v<sub>2</sub> + … + u<sub>n</sub>v<sub>n</sub>    ‖v‖ = √(v · v)<br>u · v = ‖u‖ ‖v‖ cos θ    ⇒    cos θ = (u · v) / (‖u‖ ‖v‖)</div>
<p>The sign of u · v tells the angle at a glance: positive ⇒ acute, zero ⇒ <strong>perpendicular</strong> (orthogonal), negative ⇒ obtuse. A <strong>unit vector</strong> has length 1; v/‖v‖ is the unit vector in the direction of v.</p>
<p>The <strong>projection</strong> of b onto the line through a is the “shadow” of b on that line when light falls perpendicularly:</p>
<div class="formula"><span class="lbl">Projection onto a line</span>proj<sub>a</sub> b = ((b · a) / (a · a)) a        error e = b − proj<sub>a</sub> b is perpendicular to a</div>
<p>In physics, the work done by a force F moving an object by d is F · d — only the component of F along d counts. In machine learning and search engines, documents are turned into vectors of word counts, and two documents are compared by <strong>cosine similarity</strong> cos θ: 1 means the same direction (same topic mix), 0 means nothing in common.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — angle in 3D.</b> a = (2, 2, 1), b = (1, 0, 1).</p><p>a · b = 2 + 0 + 1 = 3; ‖a‖ = √9 = 3; ‖b‖ = √2. cos θ = 3/(3√2) = 1/√2, so <b>θ = 45°</b> (π/4).</p></div>
<div class="callout"><p><b>Example 2 — projection.</b> Project b = (4, 2) onto the line through a = (3, 1).</p><p>b · a = 12 + 2 = 14, a · a = 10. proj = (14/10)(3, 1) = <b>(4.2, 1.4)</b>. Error e = (4, 2) − (4.2, 1.4) = (−0.2, 0.6). Check e · a = −0.6 + 0.6 = 0 ✓ — the error is perpendicular to the line, which is exactly why this is the <em>closest</em> point of the line to b.</p></div>
<div class="callout"><p><b>Example 3 — cosine similarity.</b> Count the words (“matrix”, “vector”, “football”) in two short texts: d<sub>1</sub> = (2, 1, 0), d<sub>2</sub> = (1, 1, 1). d<sub>1</sub> · d<sub>2</sub> = 3, ‖d<sub>1</sub>‖ = √5, ‖d<sub>2</sub>‖ = √3, so cos θ = 3/√15 ≈ <b>0.775</b> — fairly similar. A text about football only, (0, 0, 3), has cosine 0 with d<sub>1</sub>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>The dot product of two vectors is a <strong>number</strong>, not a vector.</li><li>Forgetting to divide by a · a in the projection formula (only correct without it when a is a unit vector).</li><li>Mixing the order of the angle formula: cos θ uses the product of the lengths in the denominator, not the sum.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>u · v = Σ u<sub>i</sub>v<sub>i</sub> = ‖u‖‖v‖cos θ.</li><li>u · v = 0 ⇔ perpendicular.</li><li>proj<sub>a</sub> b = ((b·a)/(a·a)) a; the error is perpendicular to a.</li><li>Cosine similarity compares directions of data vectors, ignoring their lengths.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/dot-products" target="_blank" rel="noopener">3Blue1Brown — Dot products and duality</a></li><li><a href="https://textbooks.math.gatech.edu/ila/dot-product.html" target="_blank" rel="noopener">Interactive Linear Algebra — 6.1 Dot Products and Orthogonality</a></li><li><a href="https://en.wikipedia.org/wiki/Cosine_similarity" target="_blank" rel="noopener">Wikipedia — Cosine similarity</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Are u = (1, 2, 2) and v = (2, −2, 1) perpendicular? What is ‖u‖?</li><li>Project b = (5, 0) onto the line through a = (3, 4).</li><li>Find the angle between (1, 0) and (1, √3).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) u · v = 2 − 4 + 2 = 0: yes; ‖u‖ = √9 = 3. 2) b · a = 15, a · a = 25 ⇒ proj = (15/25)(3, 4) = (1.8, 2.4). 3) cos θ = 1/(1·2) = 1/2 ⇒ θ = 60°.</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 1 · Bài 1.2</span>
<h2>Tích vô hướng: độ dài, góc, hình chiếu và độ tương đồng</h2>
<p class="lead">Phép cộng và nhân với số cho ta cách di chuyển; <strong>tích vô hướng</strong> cho ta cách <em>đo</em>: độ dài, góc, cái bóng (hình chiếu) và mức độ giống nhau của hai vector dữ liệu.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính tích vô hướng, độ dài và góc giữa hai vector.</li><li>Kiểm hai vector có vuông góc không.</li><li>Chiếu một vector lên một đường thẳng, tách nó thành phần “dọc” và phần “vuông góc”.</li><li>Dùng độ tương đồng cosin để so sánh vector dữ liệu.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Tích vô hướng, độ dài, góc</span>u · v = u<sub>1</sub>v<sub>1</sub> + u<sub>2</sub>v<sub>2</sub> + … + u<sub>n</sub>v<sub>n</sub>    ‖v‖ = √(v · v)<br>u · v = ‖u‖ ‖v‖ cos θ    ⇒    cos θ = (u · v) / (‖u‖ ‖v‖)</div>
<p>Dấu của u · v cho biết góc ngay: dương ⇒ góc nhọn, bằng 0 ⇒ <strong>vuông góc</strong> (trực giao), âm ⇒ góc tù. <strong>Vector đơn vị</strong> có độ dài 1; v/‖v‖ là vector đơn vị cùng hướng v.</p>
<p><strong>Hình chiếu</strong> của b lên đường thẳng qua a là “cái bóng” của b trên đường đó khi ánh sáng chiếu vuông góc:</p>
<div class="formula"><span class="lbl">Chiếu lên một đường thẳng</span>proj<sub>a</sub> b = ((b · a) / (a · a)) a        sai số e = b − proj<sub>a</sub> b vuông góc với a</div>
<p>Trong vật lý, công của lực F khi dời vật một đoạn d là F · d — chỉ thành phần của F dọc theo d mới tính. Trong học máy và máy tìm kiếm, văn bản được biến thành vector đếm từ, và hai văn bản được so bằng <strong>độ tương đồng cosin</strong> cos θ: 1 là cùng hướng (cùng tỉ lệ chủ đề), 0 là không có gì chung.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — góc trong 3D.</b> a = (2, 2, 1), b = (1, 0, 1).</p><p>a · b = 2 + 0 + 1 = 3; ‖a‖ = √9 = 3; ‖b‖ = √2. cos θ = 3/(3√2) = 1/√2, nên <b>θ = 45°</b> (π/4).</p></div>
<div class="callout"><p><b>Ví dụ 2 — hình chiếu.</b> Chiếu b = (4, 2) lên đường thẳng qua a = (3, 1).</p><p>b · a = 12 + 2 = 14, a · a = 10. proj = (14/10)(3, 1) = <b>(4,2; 1,4)</b>. Sai số e = (4, 2) − (4,2; 1,4) = (−0,2; 0,6). Kiểm: e · a = −0,6 + 0,6 = 0 ✓ — sai số vuông góc với đường thẳng, và chính vì vậy đây là điểm <em>gần b nhất</em> trên đường thẳng.</p></div>
<div class="callout"><p><b>Ví dụ 3 — độ tương đồng cosin.</b> Đếm các từ (“ma trận”, “vector”, “bóng đá”) trong hai đoạn văn: d<sub>1</sub> = (2, 1, 0), d<sub>2</sub> = (1, 1, 1). d<sub>1</sub> · d<sub>2</sub> = 3, ‖d<sub>1</sub>‖ = √5, ‖d<sub>2</sub>‖ = √3, nên cos θ = 3/√15 ≈ <b>0,775</b> — khá giống. Một đoạn chỉ nói bóng đá, (0, 0, 3), có cosin bằng 0 với d<sub>1</sub>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tích vô hướng của hai vector là một <strong>số</strong>, không phải vector.</li><li>Quên chia cho a · a trong công thức hình chiếu (chỉ bỏ được khi a là vector đơn vị).</li><li>Nhầm công thức góc: mẫu số của cos θ là tích hai độ dài, không phải tổng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>u · v = Σ u<sub>i</sub>v<sub>i</sub> = ‖u‖‖v‖cos θ.</li><li>u · v = 0 ⇔ vuông góc.</li><li>proj<sub>a</sub> b = ((b·a)/(a·a)) a; sai số vuông góc với a.</li><li>Độ tương đồng cosin so hướng của vector dữ liệu, bỏ qua độ dài.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/dot-products" target="_blank" rel="noopener">3Blue1Brown — Tích vô hướng và tính đối ngẫu</a></li><li><a href="https://textbooks.math.gatech.edu/ila/dot-product.html" target="_blank" rel="noopener">Interactive Linear Algebra — 6.1 Tích vô hướng và trực giao</a></li><li><a href="https://en.wikipedia.org/wiki/Cosine_similarity" target="_blank" rel="noopener">Wikipedia — Độ tương đồng cosin</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>u = (1, 2, 2) và v = (2, −2, 1) có vuông góc không? ‖u‖ bằng bao nhiêu?</li><li>Chiếu b = (5, 0) lên đường thẳng qua a = (3, 4).</li><li>Tìm góc giữa (1, 0) và (1, √3).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) u · v = 2 − 4 + 2 = 0: có; ‖u‖ = √9 = 3. 2) b · a = 15, a · a = 25 ⇒ proj = (15/25)(3, 4) = (1,8; 2,4). 3) cos θ = 1/(1·2) = 1/2 ⇒ θ = 60°.</p></div>`);

const c13 = L('mlt201-ts-1-3',
  '1.3 — Matrix times vector: the column picture and “where e₁, e₂ land”|||1.3 — Ma trận nhân vector: góc nhìn cột và “e₁, e₂ đi đâu”',
  'Tích Ax theo hàng (tích vô hướng) và theo cột (tổ hợp các cột); cột của A là ảnh của e₁, e₂; hình vuông đơn vị biến thành hình bình hành; code NumPy chạy thật.',
  `<span class="eyebrow">MLT201 · Chapter 1 · Lesson 1.3</span>
<h2>Matrix times vector: the column picture</h2>
<p class="lead">The single most useful sentence in this course: <strong>Ax is a combination of the columns of A, with the entries of x as weights.</strong> From it follows the geometric reading of every matrix: its columns are where the basis vectors land.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute Ax in two ways: by rows (dot products) and by columns (combination).</li><li>Identify the columns of A as the images Ae<sub>1</sub>, Ae<sub>2</sub>.</li><li>Draw the image of the unit square under a 2×2 matrix.</li><li>Check matrix–vector products in NumPy.</li></ul>
<h3>📖 Lecture</h3>
<p>Let A = [2 −1; 1 3] and x = (3, 2). Two equivalent pictures:</p>
<div class="formula"><span class="lbl">Row picture</span>Ax = (row<sub>1</sub> · x, row<sub>2</sub> · x) = (2·3 + (−1)·2, 1·3 + 3·2) = (4, 9)</div>
<div class="formula"><span class="lbl">Column picture</span>Ax = x<sub>1</sub>·(column 1) + x<sub>2</sub>·(column 2) = 3·(2, 1) + 2·(−1, 3) = (4, 9)</div>
<p>The column picture is exactly Example 2 of Lesson 1.1 in disguise: solving Ax = b is the same as asking “which weights combine the columns into b?”, and Ax = b has a solution exactly when b is in the span of the columns (the <strong>column space</strong>).</p>
<p>Now plug in the standard basis vectors: Ae<sub>1</sub> = A(1, 0) = column 1 and Ae<sub>2</sub> = A(0, 1) = column 2. Every vector is x = x<sub>1</sub>e<sub>1</sub> + x<sub>2</sub>e<sub>2</sub>, so Ax = x<sub>1</sub>(Ae<sub>1</sub>) + x<sub>2</sub>(Ae<sub>2</sub>). Conclusion: <strong>knowing where e<sub>1</sub> and e<sub>2</sub> land tells you where every point lands.</strong> The grid of unit squares becomes a grid of parallelograms spanned by the two columns.</p>
<h3>✍️ Worked example — the unit square</h3>
<div class="callout"><p>Under A = [2 −1; 1 3] the corners (0, 0), (1, 0), (1, 1), (0, 1) go to (0, 0), (2, 1), (1, 4), (−1, 3). The square becomes a parallelogram with sides (2, 1) and (−1, 3). Its area is |2·3 − (−1)·1| = 7 — preview of Chapter 5.</p></div>
<h3>💻 Check it in NumPy</h3>
<pre><code class="language-python">import numpy as np
A = np.array([[2, -1],
              [1,  3]])
x = np.array([3, 2])
print(A @ x)                    # matrix times vector
print(3*A[:, 0] + 2*A[:, 1])    # the same: 3*(column 1) + 2*(column 2)
square = np.array([[0, 1, 1, 0],
                   [0, 0, 1, 1]])   # corners of the unit square, as columns
print(A @ square)</code></pre>
<div class="out">[4 9]
[4 9]
[[ 0  2  1 -1]
 [ 0  1  4  3]]</div>
<p>Putting many points as columns of one matrix and multiplying once is exactly how graphics code transforms a whole shape.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Sizes: an m×n matrix multiplies vectors with <strong>n</strong> entries and returns vectors with <strong>m</strong> entries.</li><li>In NumPy, <code>A * x</code> is element-wise broadcasting, not the matrix product. Use <code>A @ x</code>.</li><li>Reading rows as the images of e<sub>1</sub>, e<sub>2</sub>. It is the <strong>columns</strong>.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Ax = x<sub>1</sub>a<sub>1</sub> + … + x<sub>n</sub>a<sub>n</sub> (columns a<sub>j</sub>).</li><li>Column j of A = Ae<sub>j</sub>: where the j-th basis vector lands.</li><li>Ax = b solvable ⇔ b is in the column space.</li><li>A 2×2 matrix maps the unit square to the parallelogram spanned by its columns.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/linear-transformations" target="_blank" rel="noopener">3Blue1Brown — Linear transformations and matrices</a></li><li><a href="https://textbooks.math.gatech.edu/ila/matrix-equations.html" target="_blank" rel="noopener">Interactive Linear Algebra — 2.3 Matrix Equations</a></li><li><a href="https://numpy.org/doc/stable/reference/routines.linalg.html" target="_blank" rel="noopener">NumPy — Linear algebra routines</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Compute [1 2; 3 4](5, −1) both by rows and by columns.</li><li>A 2×2 matrix sends e<sub>1</sub> to (0, 1) and e<sub>2</sub> to (−1, 0). Write A and find A(2, 3).</li><li>Is b = (1, 1) in the column space of [1 2; 2 4]?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Rows: (5 − 2, 15 − 4) = (3, 11); columns: 5(1, 3) − 1(2, 4) = (3, 11). 2) A = [0 −1; 1 0]; A(2, 3) = 2(0, 1) + 3(−1, 0) = (−3, 2) — a 90° rotation. 3) Both columns are multiples of (1, 2), so the column space is the line y = 2x; (1, 1) is not on it: no.</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 1 · Bài 1.3</span>
<h2>Ma trận nhân vector: góc nhìn cột</h2>
<p class="lead">Câu hữu ích nhất của cả môn: <strong>Ax là tổ hợp các cột của A, với các thành phần của x làm trọng số.</strong> Từ đó suy ra cách đọc hình học của mọi ma trận: các cột của nó là nơi các vector cơ sở rơi xuống.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính Ax theo hai cách: theo hàng (tích vô hướng) và theo cột (tổ hợp).</li><li>Nhận ra các cột của A là ảnh Ae<sub>1</sub>, Ae<sub>2</sub>.</li><li>Vẽ ảnh của hình vuông đơn vị qua ma trận 2×2.</li><li>Kiểm tích ma trận – vector bằng NumPy.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Cho A = [2 −1; 1 3] và x = (3, 2). Hai cách nhìn tương đương:</p>
<div class="formula"><span class="lbl">Góc nhìn hàng</span>Ax = (hàng<sub>1</sub> · x, hàng<sub>2</sub> · x) = (2·3 + (−1)·2, 1·3 + 3·2) = (4, 9)</div>
<div class="formula"><span class="lbl">Góc nhìn cột</span>Ax = x<sub>1</sub>·(cột 1) + x<sub>2</sub>·(cột 2) = 3·(2, 1) + 2·(−1, 3) = (4, 9)</div>
<p>Góc nhìn cột chính là Ví dụ 2 của Bài 1.1 đội lốt: giải Ax = b là hỏi “trọng số nào tổ hợp các cột thành b?”, và Ax = b có nghiệm đúng khi b nằm trong span của các cột (<strong>không gian cột</strong>).</p>
<p>Giờ thay vector cơ sở chuẩn vào: Ae<sub>1</sub> = A(1, 0) = cột 1 và Ae<sub>2</sub> = A(0, 1) = cột 2. Mọi vector đều là x = x<sub>1</sub>e<sub>1</sub> + x<sub>2</sub>e<sub>2</sub>, nên Ax = x<sub>1</sub>(Ae<sub>1</sub>) + x<sub>2</sub>(Ae<sub>2</sub>). Kết luận: <strong>biết e<sub>1</sub> và e<sub>2</sub> đi đâu là biết mọi điểm đi đâu.</strong> Lưới ô vuông đơn vị biến thành lưới hình bình hành dựng trên hai cột.</p>
<h3>✍️ Ví dụ — hình vuông đơn vị</h3>
<div class="callout"><p>Qua A = [2 −1; 1 3], các đỉnh (0, 0), (1, 0), (1, 1), (0, 1) đi tới (0, 0), (2, 1), (1, 4), (−1, 3). Hình vuông thành hình bình hành có cạnh (2, 1) và (−1, 3). Diện tích là |2·3 − (−1)·1| = 7 — xem trước Chương 5.</p></div>
<h3>💻 Kiểm bằng NumPy</h3>
<pre><code class="language-python">import numpy as np
A = np.array([[2, -1],
              [1,  3]])
x = np.array([3, 2])
print(A @ x)                    # matrix times vector
print(3*A[:, 0] + 2*A[:, 1])    # the same: 3*(column 1) + 2*(column 2)
square = np.array([[0, 1, 1, 0],
                   [0, 0, 1, 1]])   # corners of the unit square, as columns
print(A @ square)</code></pre>
<div class="out">[4 9]
[4 9]
[[ 0  2  1 -1]
 [ 0  1  4  3]]</div>
<p>Xếp nhiều điểm thành các cột của một ma trận rồi nhân một lần — đó chính là cách code đồ hoạ biến đổi cả một hình.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Kích thước: ma trận m×n nhân với vector có <strong>n</strong> thành phần và cho ra vector có <strong>m</strong> thành phần.</li><li>Trong NumPy, <code>A * x</code> là nhân từng phần tử (broadcasting), không phải tích ma trận. Dùng <code>A @ x</code>.</li><li>Đọc các hàng thành ảnh của e<sub>1</sub>, e<sub>2</sub>. Đó là các <strong>cột</strong>.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Ax = x<sub>1</sub>a<sub>1</sub> + … + x<sub>n</sub>a<sub>n</sub> (a<sub>j</sub> là các cột).</li><li>Cột j của A = Ae<sub>j</sub>: nơi vector cơ sở thứ j rơi xuống.</li><li>Ax = b có nghiệm ⇔ b thuộc không gian cột.</li><li>Ma trận 2×2 biến hình vuông đơn vị thành hình bình hành dựng trên các cột.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/linear-transformations" target="_blank" rel="noopener">3Blue1Brown — Biến đổi tuyến tính và ma trận</a></li><li><a href="https://textbooks.math.gatech.edu/ila/matrix-equations.html" target="_blank" rel="noopener">Interactive Linear Algebra — 2.3 Phương trình ma trận</a></li><li><a href="https://numpy.org/doc/stable/reference/routines.linalg.html" target="_blank" rel="noopener">NumPy — Các hàm đại số tuyến tính</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tính [1 2; 3 4](5, −1) theo hàng và theo cột.</li><li>Một ma trận 2×2 đưa e<sub>1</sub> tới (0, 1) và e<sub>2</sub> tới (−1, 0). Viết A và tính A(2, 3).</li><li>b = (1, 1) có thuộc không gian cột của [1 2; 2 4] không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Theo hàng: (5 − 2, 15 − 4) = (3, 11); theo cột: 5(1, 3) − 1(2, 4) = (3, 11). 2) A = [0 −1; 1 0]; A(2, 3) = 2(0, 1) + 3(−1, 0) = (−3, 2) — phép quay 90°. 3) Hai cột đều là bội của (1, 2), nên không gian cột là đường y = 2x; (1, 1) không nằm trên đó: không.</p></div>`);

const q1 = QZ(1, 'Quiz — Chapter 1: Vectors and matrix–vector products|||Quiz — Chương 1: Vector và tích ma trận – vector', 'Kiểm tra chương 1: tổ hợp tuyến tính, span, tích vô hướng, góc, hình chiếu, góc nhìn cột của Ax.', [
  Q('q1', "With u = (2, 1) and v = (−1, 3), what is 3u − 2v?|||Với u = (2, 1) và v = (−1, 3), 3u − 2v bằng?",
    ['(8, −3)|||(8, −3)', '(4, 9)|||(4, 9)', '(8, 9)|||(8, 9)', '(4, −3)|||(4, −3)'], 0,
    "(6, 3) − (−2, 6) = (8, −3).|||(6, 3) − (−2, 6) = (8, −3)."),
  Q('q2', "The span of (1, 2) and (−2, −4) in ℝ² is|||Span của (1, 2) và (−2, −4) trong ℝ² là",
    ['the whole plane|||cả mặt phẳng', 'the line y = 2x|||đường thẳng y = 2x', 'the line y = −2x|||đường thẳng y = −2x', 'only the origin|||chỉ gốc toạ độ'], 1,
    "The vectors are parallel ((−2, −4) = −2(1, 2)), so they span one line through the origin.|||Hai vector cùng phương ((−2, −4) = −2(1, 2)) nên chỉ span một đường thẳng qua gốc."),
  Q('q3', "Two vectors (1, k) and (k, 4) are collinear when|||Hai vector (1, k) và (k, 4) cùng phương khi",
    ['k = 4|||k = 4', 'k = ±2|||k = ±2', 'k = 0|||k = 0', 'never|||không bao giờ'], 1,
    "1·4 − k² = 0 ⇒ k = ±2.|||1·4 − k² = 0 ⇒ k = ±2."),
  Q('q4', "The angle between a = (2, 2, 1) and b = (1, 0, 1) is|||Góc giữa a = (2, 2, 1) và b = (1, 0, 1) là",
    ['30°|||30°', '45°|||45°', '60°|||60°', '90°|||90°'], 1,
    "cos θ = 3/(3·√2) = 1/√2.|||cos θ = 3/(3·√2) = 1/√2."),
  Q('q5', "The projection of b = (4, 2) onto the line through a = (3, 1) is|||Hình chiếu của b = (4, 2) lên đường thẳng qua a = (3, 1) là",
    ['(4.2, 1.4)|||(4,2; 1,4)', '(14, 14/3)|||(14, 14/3)', '(3, 1)|||(3, 1)', '(1.2, 0.4)|||(1,2; 0,4)'], 0,
    "(b·a)/(a·a) = 14/10, times (3, 1).|||(b·a)/(a·a) = 14/10, nhân với (3, 1)."),
  Q('q6', "If u · v = 0 for nonzero u, v, then|||Nếu u · v = 0 với u, v khác 0 thì",
    ['u and v are parallel|||u và v cùng phương', 'u and v are perpendicular|||u và v vuông góc', 'u = −v|||u = −v', 'one of them has length 1|||một trong hai có độ dài 1'], 1,
    "u · v = ‖u‖‖v‖cos θ = 0 forces cos θ = 0, θ = 90°.|||u · v = ‖u‖‖v‖cos θ = 0 buộc cos θ = 0, θ = 90°."),
  Q('q7', "For A = [2 −1; 1 3], what is A(3, 2)?|||Với A = [2 −1; 1 3], A(3, 2) bằng?",
    ['(4, 9)|||(4, 9)', '(6, 6)|||(6, 6)', '(8, 5)|||(8, 5)', '(5, 3)|||(5, 3)'], 0,
    "3·(2, 1) + 2·(−1, 3) = (4, 9).|||3·(2, 1) + 2·(−1, 3) = (4, 9)."),
  Q('q8', "The second column of a matrix A is always|||Cột thứ hai của ma trận A luôn là",
    ['A applied to e₂|||ảnh của e₂ qua A', 'A applied to e₁|||ảnh của e₁ qua A', 'the second row transposed|||hàng hai chuyển vị', 'the sum of the rows|||tổng các hàng'], 0,
    "Ae₂ = 0·(col 1) + 1·(col 2) = col 2.|||Ae₂ = 0·(cột 1) + 1·(cột 2) = cột 2."),
  Q('q9', "An m×n matrix multiplies vectors from|||Ma trận m×n nhân với vector thuộc",
    ['ℝᵐ and returns ℝⁿ|||ℝᵐ và cho ra ℝⁿ', 'ℝⁿ and returns ℝᵐ|||ℝⁿ và cho ra ℝᵐ', 'ℝⁿ and returns ℝⁿ|||ℝⁿ và cho ra ℝⁿ', 'ℝᵐ and returns ℝᵐ|||ℝᵐ và cho ra ℝᵐ'], 1,
    "n columns need n weights; each column has m entries.|||n cột cần n trọng số; mỗi cột có m thành phần."),
]);

const ch1 = {
  title: 'Chapter 1 — Vectors and matrices as geometry|||Chương 1 — Vector và ma trận dưới góc nhìn hình học',
  description: 'Vector như mũi tên, tổ hợp tuyến tính, span, tích vô hướng, góc, hình chiếu, độ tương đồng cosin; tích Ax theo cột và “cột = nơi e₁, e₂ rơi xuống” (Lay 1.3–1.4, 6.1 · ILA 2.1–2.3, 6.1).',
  lessons: [c11, c12, c13, q1],
};

// ───────────────────────────── Chương 2 ─────────────────────────────
const c21 = L('mlt201-ts-2-1',
  '2.1 — What makes a transformation linear|||2.1 — Thế nào là một phép biến đổi tuyến tính',
  'Định nghĩa T(u + v) = T(u) + T(v), T(cu) = cT(u); hệ quả T(0) = 0, đường thẳng thành đường thẳng, lưới song song cách đều; nhận diện ánh xạ tuyến tính và không tuyến tính (tịnh tiến, bình phương, tích).',
  `<span class="eyebrow">MLT201 · Chapter 2 · Lesson 2.1</span>
<h2>What makes a transformation linear</h2>
<p class="lead">A <strong>transformation</strong> (map, function) T: ℝ<sup>n</sup> → ℝ<sup>m</sup> takes an input vector and returns an output vector. Among all possible maps, the <strong>linear</strong> ones are special: they are exactly the ones a matrix can do, and they have a clean geometric signature.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the two rules of linearity.</li><li>Recognise the geometric signature: origin fixed, lines stay lines, grid stays parallel and evenly spaced.</li><li>Prove a map is linear, or show it is not with a counterexample.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Definition</span>T is linear if, for all vectors u, v and all scalars c:<br>(1) T(u + v) = T(u) + T(v)    (2) T(c u) = c T(u)<br>Equivalently: T(c<sub>1</sub>u + c<sub>2</sub>v) = c<sub>1</sub>T(u) + c<sub>2</sub>T(v) — T preserves linear combinations.</div>
<p>Two quick consequences: putting c = 0 gives <strong>T(0) = 0</strong> — a linear map never moves the origin. And because T preserves combinations, the line {p + t d} goes to {T(p) + t T(d)}: <strong>lines go to lines</strong> (or collapse to a point), parallel lines stay parallel, and equally spaced points stay equally spaced. That is why 3Blue1Brown describes linear maps as “grid lines remain parallel and evenly spaced, and the origin stays fixed”.</p>
<p>Every map of the form T(x) = Ax is linear, because A(u + v) = Au + Av and A(cu) = c(Au). The next lesson shows the converse: every linear map from ℝ<sup>n</sup> to ℝ<sup>m</sup> is a matrix.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — linear.</b> T(x, y) = (2x − y, x + 3y). For u = (x<sub>1</sub>, y<sub>1</sub>), v = (x<sub>2</sub>, y<sub>2</sub>): T(u + v) = (2(x<sub>1</sub> + x<sub>2</sub>) − (y<sub>1</sub> + y<sub>2</sub>), …) = T(u) + T(v), and similarly for scaling. In fact T(x) = [2 −1; 1 3]x, the matrix of Lesson 1.3.</p></div>
<div class="callout"><p><b>Example 2 — translation is NOT linear.</b> T(x, y) = (x + 1, y) slides every point one unit right. But T(0, 0) = (1, 0) ≠ (0, 0), so T is not linear. This is a real problem for graphics — moving an object is the most basic operation! Chapter 6 fixes it with homogeneous coordinates.</p></div>
<div class="callout"><p><b>Example 3 — products and squares are NOT linear.</b> T(x, y) = (xy, y). T(0) = 0, so the quick test passes, but T(2·(1, 1)) = T(2, 2) = (4, 2) while 2·T(1, 1) = 2·(1, 1) = (2, 2). Rule (2) fails. Likewise T(x) = x<sup>2</sup> on ℝ is not linear: T(1 + 1) = 4 ≠ T(1) + T(1) = 2.</p></div>
<div class="callout"><p><b>Example 4 — where linear maps appear.</b> Resizing an image by 50 % (x, y) → (0.5x, 0.5y), converting RGB colour to grey, Gray = 0.299R + 0.587G + 0.114B, and the “weighted sum” inside every neuron are all linear maps. Adding a bias b (Wx + b) makes the neuron affine, not linear — the same issue as translation.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking T(0) = 0 proves linearity. It is necessary, not sufficient (Example 3).</li><li>Calling y = mx + b “linear” in this course: with b ≠ 0 it is <em>affine</em>.</li><li>Checking the rules only for one particular pair u, v. A proof must work for all vectors; a single failing pair is enough to disprove.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Linear ⇔ T(c<sub>1</sub>u + c<sub>2</sub>v) = c<sub>1</sub>T(u) + c<sub>2</sub>T(v).</li><li>Linear ⇒ T(0) = 0, lines → lines, parallel and evenly spaced grid preserved.</li><li>Matrix maps x ↦ Ax are always linear.</li><li>Translations, squares, products, and adding a constant are not linear.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/linear-transformations" target="_blank" rel="noopener">3Blue1Brown — Linear transformations and matrices</a></li><li><a href="https://textbooks.math.gatech.edu/ila/linear-transformations.html" target="_blank" rel="noopener">Interactive Linear Algebra — 3.3 Linear Transformations</a></li><li><a href="https://en.wikipedia.org/wiki/Linear_map" target="_blank" rel="noopener">Wikipedia — Linear map</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Is T(x, y) = (3y, −x) linear? If yes, give its matrix.</li><li>Is T(x, y) = (x, |y|) linear?</li><li>Is T(x, y, z) = (x + y + z, 0) linear?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Yes: T(x) = [0 3; −1 0]x. 2) No: T(−1·(0, 1)) = (0, 1) but −1·T(0, 1) = (0, −1). 3) Yes: matrix [1 1 1; 0 0 0] (2×3).</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 2 · Bài 2.1</span>
<h2>Thế nào là một phép biến đổi tuyến tính</h2>
<p class="lead">Một <strong>phép biến đổi</strong> (ánh xạ, hàm) T: ℝ<sup>n</sup> → ℝ<sup>m</sup> nhận một vector và trả về một vector. Trong mọi ánh xạ có thể có, các ánh xạ <strong>tuyến tính</strong> rất đặc biệt: chúng đúng là những gì một ma trận làm được, và có “chữ ký hình học” rất rõ.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu hai quy tắc tuyến tính.</li><li>Nhận ra chữ ký hình học: gốc đứng yên, đường thẳng vẫn là đường thẳng, lưới vẫn song song và cách đều.</li><li>Chứng minh một ánh xạ tuyến tính, hoặc bác bỏ bằng phản ví dụ.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Định nghĩa</span>T tuyến tính nếu với mọi vector u, v và mọi số c:<br>(1) T(u + v) = T(u) + T(v)    (2) T(c u) = c T(u)<br>Tương đương: T(c<sub>1</sub>u + c<sub>2</sub>v) = c<sub>1</sub>T(u) + c<sub>2</sub>T(v) — T bảo toàn tổ hợp tuyến tính.</div>
<p>Hai hệ quả nhanh: lấy c = 0 được <strong>T(0) = 0</strong> — ánh xạ tuyến tính không bao giờ dời gốc toạ độ. Và vì T bảo toàn tổ hợp, đường thẳng {p + t d} đi tới {T(p) + t T(d)}: <strong>đường thẳng thành đường thẳng</strong> (hoặc co về một điểm), đường song song vẫn song song, các điểm cách đều vẫn cách đều. Vì thế 3Blue1Brown mô tả ánh xạ tuyến tính là “các đường lưới vẫn song song, cách đều, và gốc đứng yên”.</p>
<p>Mọi ánh xạ dạng T(x) = Ax đều tuyến tính, vì A(u + v) = Au + Av và A(cu) = c(Au). Bài sau chứng minh chiều ngược lại: mọi ánh xạ tuyến tính từ ℝ<sup>n</sup> vào ℝ<sup>m</sup> đều là một ma trận.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — tuyến tính.</b> T(x, y) = (2x − y, x + 3y). Với u = (x<sub>1</sub>, y<sub>1</sub>), v = (x<sub>2</sub>, y<sub>2</sub>): T(u + v) = (2(x<sub>1</sub> + x<sub>2</sub>) − (y<sub>1</sub> + y<sub>2</sub>), …) = T(u) + T(v), tương tự với phép nhân số. Thực ra T(x) = [2 −1; 1 3]x, đúng ma trận của Bài 1.3.</p></div>
<div class="callout"><p><b>Ví dụ 2 — tịnh tiến KHÔNG tuyến tính.</b> T(x, y) = (x + 1, y) dời mọi điểm sang phải một đơn vị. Nhưng T(0, 0) = (1, 0) ≠ (0, 0), nên T không tuyến tính. Đây là vấn đề thật của đồ hoạ — di chuyển vật thể là thao tác cơ bản nhất! Chương 6 giải quyết bằng toạ độ đồng nhất.</p></div>
<div class="callout"><p><b>Ví dụ 3 — tích và bình phương KHÔNG tuyến tính.</b> T(x, y) = (xy, y). T(0) = 0 nên phép thử nhanh vẫn qua, nhưng T(2·(1, 1)) = T(2, 2) = (4, 2) trong khi 2·T(1, 1) = 2·(1, 1) = (2, 2). Quy tắc (2) sai. Tương tự T(x) = x<sup>2</sup> trên ℝ không tuyến tính: T(1 + 1) = 4 ≠ T(1) + T(1) = 2.</p></div>
<div class="callout"><p><b>Ví dụ 4 — ánh xạ tuyến tính xuất hiện ở đâu.</b> Thu nhỏ ảnh 50 % (x, y) → (0,5x; 0,5y), đổi màu RGB sang xám Gray = 0,299R + 0,587G + 0,114B, và “tổng có trọng số” trong mỗi nơ-ron đều là ánh xạ tuyến tính. Thêm độ lệch b (Wx + b) làm nơ-ron thành <em>affine</em> chứ không còn tuyến tính — cùng vấn đề với tịnh tiến.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nghĩ rằng T(0) = 0 là chứng minh được tuyến tính. Đó là điều kiện cần, không đủ (Ví dụ 3).</li><li>Gọi y = mx + b là “tuyến tính” trong môn này: với b ≠ 0 nó là <em>affine</em>.</li><li>Chỉ kiểm hai quy tắc cho một cặp u, v cụ thể. Chứng minh phải đúng với mọi vector; chỉ cần một cặp sai là bác bỏ được.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tuyến tính ⇔ T(c<sub>1</sub>u + c<sub>2</sub>v) = c<sub>1</sub>T(u) + c<sub>2</sub>T(v).</li><li>Tuyến tính ⇒ T(0) = 0, đường thẳng → đường thẳng, lưới song song cách đều được giữ.</li><li>Ánh xạ ma trận x ↦ Ax luôn tuyến tính.</li><li>Tịnh tiến, bình phương, tích, cộng hằng số đều không tuyến tính.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/linear-transformations" target="_blank" rel="noopener">3Blue1Brown — Biến đổi tuyến tính và ma trận</a></li><li><a href="https://textbooks.math.gatech.edu/ila/linear-transformations.html" target="_blank" rel="noopener">Interactive Linear Algebra — 3.3 Biến đổi tuyến tính</a></li><li><a href="https://en.wikipedia.org/wiki/Linear_map" target="_blank" rel="noopener">Wikipedia — Ánh xạ tuyến tính</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>T(x, y) = (3y, −x) có tuyến tính không? Nếu có, viết ma trận.</li><li>T(x, y) = (x, |y|) có tuyến tính không?</li><li>T(x, y, z) = (x + y + z, 0) có tuyến tính không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Có: T(x) = [0 3; −1 0]x. 2) Không: T(−1·(0, 1)) = (0, 1) nhưng −1·T(0, 1) = (0, −1). 3) Có: ma trận [1 1 1; 0 0 0] (2×3).</p></div>`);

const c22 = L('mlt201-ts-2-2',
  '2.2 — The standard matrix of a linear transformation|||2.2 — Ma trận chuẩn của một phép biến đổi tuyến tính',
  'A = [T(e₁) T(e₂) … T(eₙ)]; dựng ma trận từ mô tả bằng lời, từ công thức, từ ảnh của hai vector bất kỳ (A = YX⁻¹); ma trận không vuông 2×3, 3×2; code NumPy.',
  `<span class="eyebrow">MLT201 · Chapter 2 · Lesson 2.2</span>
<h2>The standard matrix of a linear transformation</h2>
<p class="lead">If T is linear, you only need to know what it does to the basis vectors e<sub>1</sub>, …, e<sub>n</sub>. Write those images as columns and you have the matrix. This is how programmers turn “rotate by 30°” or “squash to half width” into code.</p>
<h3>🎯 Objectives</h3>
<ul><li>Build the standard matrix A = [T(e<sub>1</sub>) … T(e<sub>n</sub>)].</li><li>Translate a formula or a verbal description into a matrix.</li><li>Recover A from the images of any two independent vectors.</li><li>Work with non-square matrices (maps between different dimensions).</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Theorem (standard matrix)</span>If T: ℝ<sup>n</sup> → ℝ<sup>m</sup> is linear, then T(x) = Ax for the m×n matrix<br>A = [ T(e<sub>1</sub>)  T(e<sub>2</sub>)  …  T(e<sub>n</sub>) ]  (the images of the basis vectors as columns)</div>
<p>Reason: x = x<sub>1</sub>e<sub>1</sub> + … + x<sub>n</sub>e<sub>n</sub>, and linearity gives T(x) = x<sub>1</sub>T(e<sub>1</sub>) + … + x<sub>n</sub>T(e<sub>n</sub>), which is the column picture of Ax.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — from images of e<sub>1</sub>, e<sub>2</sub>.</b> T sends e<sub>1</sub> to (1, 2) and e<sub>2</sub> to (3, −1). Then A = [1 3; 2 −1], and T(4, −2) = 4(1, 2) − 2(3, −1) = <b>(−2, 10)</b>.</p></div>
<div class="callout"><p><b>Example 2 — from a formula, non-square.</b> T(x, y, z) = (x + 2z, y − z) maps ℝ<sup>3</sup> to ℝ<sup>2</sup>. T(e<sub>1</sub>) = (1, 0), T(e<sub>2</sub>) = (0, 1), T(e<sub>3</sub>) = (2, −1), so A = [1 0 2; 0 1 −1], a <b>2×3</b> matrix. A 3D-to-2D map like this is how a 3D scene is flattened onto a screen (Chapter 6).</p></div>
<div class="callout"><p><b>Example 3 — from a description.</b> “Stretch horizontally by 3 and flip vertically.” e<sub>1</sub> → (3, 0), e<sub>2</sub> → (0, −1), so <b>A = [3 0; 0 −1]</b>.</p></div>
<div class="callout"><p><b>Example 4 — from images of other vectors.</b> You measure T(1, 1) = (3, 1) and T(1, −1) = (1, 3). Put the inputs as columns of X = [1 1; 1 −1] and the outputs as columns of Y = [3 1; 1 3]. Then AX = Y, so A = YX<sup>−1</sup>. By hand: e<sub>1</sub> = ½(1, 1) + ½(1, −1), so T(e<sub>1</sub>) = ½(3, 1) + ½(1, 3) = (2, 2); e<sub>2</sub> = ½(1, 1) − ½(1, −1), so T(e<sub>2</sub>) = (1, −1). <b>A = [2 1; 2 −1]</b>.</p></div>
<h3>💻 Check it in NumPy</h3>
<pre><code class="language-python">import numpy as np
X = np.array([[1, 1],
              [1, -1]])     # inputs (1,1) and (1,-1) as columns
Y = np.array([[3, 1],
              [1, 3]])      # their images T(1,1)=(3,1), T(1,-1)=(1,3)
A = Y @ np.linalg.inv(X)    # A X = Y  =>  A = Y X^(-1)
print(A)
print(A @ [1, 1], A @ [1, -1])</code></pre>
<div class="out">[[ 2.  1.]
 [ 2. -1.]]
[3. 1.] [1. 3.]</div>
<p>This “learn A from input/output pairs” idea is the seed of linear regression and of calibrating a camera from known points.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing T(e<sub>1</sub>), T(e<sub>2</sub>) as <em>rows</em>. They are columns.</li><li>Getting the size backwards: T: ℝ<sup>3</sup> → ℝ<sup>2</sup> has a 2×3 matrix (outputs × inputs).</li><li>In Example 4, writing A = X<sup>−1</sup>Y. From AX = Y you must multiply by X<sup>−1</sup> on the <strong>right</strong>.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Standard matrix: columns are T(e<sub>1</sub>), …, T(e<sub>n</sub>).</li><li>Size m×n for T: ℝ<sup>n</sup> → ℝ<sup>m</sup>.</li><li>Knowing T on any basis determines T; with inputs X and outputs Y, A = YX<sup>−1</sup>.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/matrix-transformations.html" target="_blank" rel="noopener">Interactive Linear Algebra — 3.1 Matrix Transformations</a></li><li><a href="https://www.3blue1brown.com/lessons/nonsquare-matrices" target="_blank" rel="noopener">3Blue1Brown — Nonsquare matrices as transformations between dimensions</a></li><li><a href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/resources/lecture-30-linear-transformations-and-their-matrices/" target="_blank" rel="noopener">MIT 18.06SC — Lecture 30: Linear Transformations and their Matrices</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the matrix of T(x, y) = (x − y, 2x, 3y) and say its size.</li><li>T rotates the plane 90° clockwise. Find its matrix.</li><li>T(1, 0) = (2, 5) and T(1, 1) = (3, 3). Find T(0, 1) and the matrix.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) [1 −1; 2 0; 0 3], size 3×2. 2) e<sub>1</sub> → (0, −1), e<sub>2</sub> → (1, 0): [0 1; −1 0]. 3) T(0, 1) = T(1, 1) − T(1, 0) = (1, −2); A = [2 1; 5 −2].</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 2 · Bài 2.2</span>
<h2>Ma trận chuẩn của một phép biến đổi tuyến tính</h2>
<p class="lead">Nếu T tuyến tính, bạn chỉ cần biết nó làm gì với các vector cơ sở e<sub>1</sub>, …, e<sub>n</sub>. Viết các ảnh đó thành cột là có ma trận. Đây là cách lập trình viên biến “quay 30°” hay “ép còn nửa bề ngang” thành code.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dựng ma trận chuẩn A = [T(e<sub>1</sub>) … T(e<sub>n</sub>)].</li><li>Chuyển công thức hoặc mô tả bằng lời thành ma trận.</li><li>Tìm lại A từ ảnh của hai vector độc lập bất kỳ.</li><li>Làm việc với ma trận không vuông (ánh xạ giữa hai số chiều khác nhau).</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Định lý (ma trận chuẩn)</span>Nếu T: ℝ<sup>n</sup> → ℝ<sup>m</sup> tuyến tính thì T(x) = Ax với ma trận m×n<br>A = [ T(e<sub>1</sub>)  T(e<sub>2</sub>)  …  T(e<sub>n</sub>) ]  (ảnh của các vector cơ sở xếp thành cột)</div>
<p>Lý do: x = x<sub>1</sub>e<sub>1</sub> + … + x<sub>n</sub>e<sub>n</sub>, và tính tuyến tính cho T(x) = x<sub>1</sub>T(e<sub>1</sub>) + … + x<sub>n</sub>T(e<sub>n</sub>), đúng là góc nhìn cột của Ax.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — từ ảnh của e<sub>1</sub>, e<sub>2</sub>.</b> T đưa e<sub>1</sub> tới (1, 2) và e<sub>2</sub> tới (3, −1). Khi đó A = [1 3; 2 −1], và T(4, −2) = 4(1, 2) − 2(3, −1) = <b>(−2, 10)</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — từ công thức, ma trận không vuông.</b> T(x, y, z) = (x + 2z, y − z) đi từ ℝ<sup>3</sup> vào ℝ<sup>2</sup>. T(e<sub>1</sub>) = (1, 0), T(e<sub>2</sub>) = (0, 1), T(e<sub>3</sub>) = (2, −1), nên A = [1 0 2; 0 1 −1], ma trận <b>2×3</b>. Ánh xạ 3D → 2D kiểu này là cách “ép phẳng” một cảnh 3D lên màn hình (Chương 6).</p></div>
<div class="callout"><p><b>Ví dụ 3 — từ mô tả.</b> “Giãn ngang 3 lần và lật theo chiều dọc.” e<sub>1</sub> → (3, 0), e<sub>2</sub> → (0, −1), nên <b>A = [3 0; 0 −1]</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4 — từ ảnh của vector khác.</b> Bạn đo được T(1, 1) = (3, 1) và T(1, −1) = (1, 3). Xếp đầu vào thành cột của X = [1 1; 1 −1] và đầu ra thành cột của Y = [3 1; 1 3]. Khi đó AX = Y nên A = YX<sup>−1</sup>. Làm tay: e<sub>1</sub> = ½(1, 1) + ½(1, −1) nên T(e<sub>1</sub>) = ½(3, 1) + ½(1, 3) = (2, 2); e<sub>2</sub> = ½(1, 1) − ½(1, −1) nên T(e<sub>2</sub>) = (1, −1). <b>A = [2 1; 2 −1]</b>.</p></div>
<h3>💻 Kiểm bằng NumPy</h3>
<pre><code class="language-python">import numpy as np
X = np.array([[1, 1],
              [1, -1]])     # inputs (1,1) and (1,-1) as columns
Y = np.array([[3, 1],
              [1, 3]])      # their images T(1,1)=(3,1), T(1,-1)=(1,3)
A = Y @ np.linalg.inv(X)    # A X = Y  =>  A = Y X^(-1)
print(A)
print(A @ [1, 1], A @ [1, -1])</code></pre>
<div class="out">[[ 2.  1.]
 [ 2. -1.]]
[3. 1.] [1. 3.]</div>
<p>Ý tưởng “học A từ các cặp đầu vào/đầu ra” này là mầm của hồi quy tuyến tính và của việc hiệu chỉnh camera từ các điểm đã biết.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết T(e<sub>1</sub>), T(e<sub>2</sub>) thành <em>hàng</em>. Chúng là cột.</li><li>Đảo kích thước: T: ℝ<sup>3</sup> → ℝ<sup>2</sup> có ma trận 2×3 (số đầu ra × số đầu vào).</li><li>Ở Ví dụ 4 viết A = X<sup>−1</sup>Y. Từ AX = Y phải nhân X<sup>−1</sup> bên <strong>phải</strong>.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Ma trận chuẩn: các cột là T(e<sub>1</sub>), …, T(e<sub>n</sub>).</li><li>Kích thước m×n với T: ℝ<sup>n</sup> → ℝ<sup>m</sup>.</li><li>Biết T trên một cơ sở bất kỳ là biết T; với đầu vào X và đầu ra Y, A = YX<sup>−1</sup>.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/matrix-transformations.html" target="_blank" rel="noopener">Interactive Linear Algebra — 3.1 Biến đổi ma trận</a></li><li><a href="https://www.3blue1brown.com/lessons/nonsquare-matrices" target="_blank" rel="noopener">3Blue1Brown — Ma trận không vuông: biến đổi giữa các số chiều</a></li><li><a href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/resources/lecture-30-linear-transformations-and-their-matrices/" target="_blank" rel="noopener">MIT 18.06SC — Bài 30: Biến đổi tuyến tính và ma trận của chúng</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm ma trận của T(x, y) = (x − y, 2x, 3y) và cho biết kích thước.</li><li>T quay mặt phẳng 90° theo chiều kim đồng hồ. Tìm ma trận.</li><li>T(1, 0) = (2, 5) và T(1, 1) = (3, 3). Tìm T(0, 1) và ma trận.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) [1 −1; 2 0; 0 3], cỡ 3×2. 2) e<sub>1</sub> → (0, −1), e<sub>2</sub> → (1, 0): [0 1; −1 0]. 3) T(0, 1) = T(1, 1) − T(1, 0) = (1, −2); A = [2 1; 5 −2].</p></div>`);

const c23 = L('mlt201-ts-2-3',
  '2.3 — Kernel, image and rank: what a transformation crushes and reaches|||2.3 — Hạt nhân, ảnh và hạng: phép biến đổi đè bẹp gì, với tới đâu',
  'Hạt nhân (null space) = những gì bị đè về 0; ảnh (column space) = những gì với tới được; hạng; định lý hạng – số chiều hạt nhân; đơn ánh, toàn ánh nhìn bằng hình; phép chiếu 3D → 2D.',
  `<span class="eyebrow">MLT201 · Chapter 2 · Lesson 2.3</span>
<h2>Kernel, image and rank</h2>
<p class="lead">Two questions about any transformation T(x) = Ax: <em>what does it crush to zero?</em> (the <strong>kernel</strong>) and <em>what can it reach?</em> (the <strong>image</strong>). Their sizes are tied together by the rank theorem, and they decide whether T can be undone.</p>
<h3>🎯 Objectives</h3>
<ul><li>Find the kernel and the image of a matrix transformation and describe them as lines/planes.</li><li>Compute the rank and use rank + nullity = n.</li><li>Decide whether T is one-to-one and/or onto.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Definitions</span>Kernel (null space): Ker T = Nul A = { x : Ax = 0 }  — a subspace of the input space ℝ<sup>n</sup><br>Image (range): Im T = Col A = { Ax } = span of the columns  — a subspace of the output space ℝ<sup>m</sup><br>rank A = dim Col A    nullity A = dim Nul A    <b>rank A + nullity A = n</b> (number of columns)</div>
<p>Geometric reading of the rank theorem: the n input dimensions are split into those that get <em>crushed</em> (nullity) and those that <em>survive</em> into the output (rank). Nothing is created or lost in the bookkeeping.</p>
<ul><li>T is <strong>one-to-one</strong> (injective) ⇔ Ker T = {0} ⇔ no two inputs land on the same output ⇔ rank = n.</li><li>T is <strong>onto</strong> (surjective) ⇔ Im T = ℝ<sup>m</sup> ⇔ every output is reached ⇔ rank = m.</li></ul>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — a collapse onto a line.</b> A = [1 2; 2 4]. Both columns are multiples of (1, 2), so <b>Im = the line y = 2x</b>, rank 1. Kernel: x + 2y = 0 (the second equation is twice the first) ⇒ <b>Ker = Span{(−2, 1)}</b>, nullity 1. Check: 1 + 1 = 2 ✓. Every line parallel to (−2, 1) is squashed to a single point on y = 2x. T is neither one-to-one nor onto, so it cannot be undone.</p></div>
<div class="callout"><p><b>Example 2 — a 2D sheet inside 3D.</b> A = [1 0; 0 1; 1 1] maps ℝ<sup>2</sup> → ℝ<sup>3</sup>, (x, y) ↦ (x, y, x + y). Columns are independent ⇒ rank 2, nullity 0: <b>one-to-one</b>. The image is the plane z = x + y — a flat sheet in space — so the point (0, 0, 1) is never reached: <b>not onto</b>.</p></div>
<div class="callout"><p><b>Example 3 — a shadow on the floor.</b> P(x, y, z) = (x, y) (drop the height), matrix [1 0 0; 0 1 0]. Image = all of ℝ<sup>2</sup> (onto), kernel = the z-axis (every vertical line becomes one point). rank 2 + nullity 1 = 3 ✓. This is exactly why a single photo cannot tell you how far away things are.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>The kernel lives in the <strong>input</strong> space, the image in the <strong>output</strong> space. For a 3×2 matrix, the kernel is in ℝ<sup>2</sup> and the image in ℝ<sup>3</sup>.</li><li>The kernel is never empty: it always contains 0. “Trivial kernel” means it is exactly {0}.</li><li>Rank theorem uses n = number of <em>columns</em>, not rows.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Ker = what is crushed to 0; Im = span of columns = what is reached.</li><li>rank + nullity = n.</li><li>One-to-one ⇔ kernel {0}; onto ⇔ rank = m.</li><li>A square matrix is invertible ⇔ one-to-one ⇔ onto ⇔ rank n.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/inverse-matrices" target="_blank" rel="noopener">3Blue1Brown — Inverse matrices, column space, and null space</a></li><li><a href="https://textbooks.math.gatech.edu/ila/one-to-one-onto.html" target="_blank" rel="noopener">Interactive Linear Algebra — 3.2 One-to-one and Onto Transformations</a></li><li><a href="https://textbooks.math.gatech.edu/ila/rank-thm.html" target="_blank" rel="noopener">Interactive Linear Algebra — 2.9 The Rank Theorem</a></li><li><a href="https://en.wikipedia.org/wiki/Rank%E2%80%93nullity_theorem" target="_blank" rel="noopener">Wikipedia — Rank–nullity theorem</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the kernel and rank of A = [1 −1 2; 2 −2 4].</li><li>Can a 2×3 matrix be one-to-one? Can a 3×2 matrix be onto? Why?</li><li>Describe the kernel and image of [0 0; 0 1].</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Rank 1 (row 2 = 2·row 1). Kernel: x − y + 2z = 0, a plane, basis (1, 1, 0), (−2, 0, 1); nullity 2, and 1 + 2 = 3 ✓. 2) No: rank ≤ 2 &lt; 3 inputs, so nullity ≥ 1. No: rank ≤ 2 &lt; 3 outputs. 3) It projects onto the y-axis: kernel = x-axis, image = y-axis.</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 2 · Bài 2.3</span>
<h2>Hạt nhân, ảnh và hạng</h2>
<p class="lead">Hai câu hỏi cho mọi phép biến đổi T(x) = Ax: <em>nó đè bẹp cái gì về 0?</em> (<strong>hạt nhân</strong>) và <em>nó với tới được đâu?</em> (<strong>ảnh</strong>). Kích thước của chúng bị ràng buộc bởi định lý hạng, và chúng quyết định T có hoàn tác được không.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tìm hạt nhân và ảnh của phép biến đổi ma trận, mô tả chúng là đường thẳng/mặt phẳng.</li><li>Tính hạng và dùng hạng + số chiều hạt nhân = n.</li><li>Xét T có là đơn ánh và/hoặc toàn ánh không.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Định nghĩa</span>Hạt nhân (không gian không): Ker T = Nul A = { x : Ax = 0 }  — không gian con của không gian đầu vào ℝ<sup>n</sup><br>Ảnh: Im T = Col A = { Ax } = span các cột  — không gian con của không gian đầu ra ℝ<sup>m</sup><br>rank A = dim Col A    nullity A = dim Nul A    <b>rank A + nullity A = n</b> (số cột)</div>
<p>Đọc định lý hạng bằng hình: n chiều đầu vào chia thành những chiều bị <em>đè bẹp</em> (nullity) và những chiều <em>sống sót</em> sang đầu ra (rank). Sổ sách không thêm, không mất chiều nào.</p>
<ul><li>T <strong>đơn ánh</strong> ⇔ Ker T = {0} ⇔ không có hai đầu vào nào rơi vào cùng một đầu ra ⇔ rank = n.</li><li>T <strong>toàn ánh</strong> ⇔ Im T = ℝ<sup>m</sup> ⇔ mọi đầu ra đều với tới được ⇔ rank = m.</li></ul>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — đè bẹp xuống một đường thẳng.</b> A = [1 2; 2 4]. Hai cột đều là bội của (1, 2) nên <b>Im = đường y = 2x</b>, hạng 1. Hạt nhân: x + 2y = 0 (phương trình hai gấp đôi phương trình một) ⇒ <b>Ker = Span{(−2, 1)}</b>, nullity 1. Kiểm: 1 + 1 = 2 ✓. Mỗi đường thẳng song song với (−2, 1) bị ép thành một điểm trên y = 2x. T không đơn ánh, không toàn ánh, nên không hoàn tác được.</p></div>
<div class="callout"><p><b>Ví dụ 2 — một tấm phẳng 2D trong 3D.</b> A = [1 0; 0 1; 1 1] đi từ ℝ<sup>2</sup> → ℝ<sup>3</sup>, (x, y) ↦ (x, y, x + y). Hai cột độc lập ⇒ hạng 2, nullity 0: <b>đơn ánh</b>. Ảnh là mặt phẳng z = x + y — một tấm phẳng trong không gian — nên điểm (0, 0, 1) không bao giờ tới được: <b>không toàn ánh</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — cái bóng trên sàn.</b> P(x, y, z) = (x, y) (bỏ chiều cao), ma trận [1 0 0; 0 1 0]. Ảnh = cả ℝ<sup>2</sup> (toàn ánh), hạt nhân = trục z (mỗi đường thẳng đứng thành một điểm). Hạng 2 + nullity 1 = 3 ✓. Đây chính là lý do một bức ảnh không cho bạn biết vật ở xa bao nhiêu.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Hạt nhân nằm trong không gian <strong>đầu vào</strong>, ảnh nằm trong không gian <strong>đầu ra</strong>. Với ma trận 3×2, hạt nhân ở ℝ<sup>2</sup>, ảnh ở ℝ<sup>3</sup>.</li><li>Hạt nhân không bao giờ rỗng: luôn chứa 0. “Hạt nhân tầm thường” nghĩa là đúng bằng {0}.</li><li>Định lý hạng dùng n = số <em>cột</em>, không phải số hàng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Ker = cái bị ép về 0; Im = span các cột = cái với tới được.</li><li>hạng + nullity = n.</li><li>Đơn ánh ⇔ hạt nhân {0}; toàn ánh ⇔ hạng = m.</li><li>Ma trận vuông khả nghịch ⇔ đơn ánh ⇔ toàn ánh ⇔ hạng n.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/inverse-matrices" target="_blank" rel="noopener">3Blue1Brown — Ma trận nghịch đảo, không gian cột, không gian không</a></li><li><a href="https://textbooks.math.gatech.edu/ila/one-to-one-onto.html" target="_blank" rel="noopener">Interactive Linear Algebra — 3.2 Đơn ánh và toàn ánh</a></li><li><a href="https://textbooks.math.gatech.edu/ila/rank-thm.html" target="_blank" rel="noopener">Interactive Linear Algebra — 2.9 Định lý hạng</a></li><li><a href="https://en.wikipedia.org/wiki/Rank%E2%80%93nullity_theorem" target="_blank" rel="noopener">Wikipedia — Định lý hạng – số chiều hạt nhân</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm hạt nhân và hạng của A = [1 −1 2; 2 −2 4].</li><li>Ma trận 2×3 có thể đơn ánh không? Ma trận 3×2 có thể toàn ánh không? Vì sao?</li><li>Mô tả hạt nhân và ảnh của [0 0; 0 1].</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Hạng 1 (hàng 2 = 2·hàng 1). Hạt nhân: x − y + 2z = 0, một mặt phẳng, cơ sở (1, 1, 0), (−2, 0, 1); nullity 2, và 1 + 2 = 3 ✓. 2) Không: hạng ≤ 2 &lt; 3 đầu vào nên nullity ≥ 1. Không: hạng ≤ 2 &lt; 3 đầu ra. 3) Nó chiếu lên trục y: hạt nhân = trục x, ảnh = trục y.</p></div>`);

const q2 = QZ(2, 'Quiz — Chapter 2: Linear transformations|||Quiz — Chương 2: Phép biến đổi tuyến tính', 'Kiểm tra chương 2: định nghĩa tuyến tính, ma trận chuẩn, ma trận không vuông, hạt nhân, ảnh, hạng, đơn ánh/toàn ánh.', [
  Q('q1', "Which map is linear?|||Ánh xạ nào tuyến tính?",
    ['T(x, y) = (x + 1, y)|||T(x, y) = (x + 1, y)', 'T(x, y) = (xy, y)|||T(x, y) = (xy, y)', 'T(x, y) = (3y, −x)|||T(x, y) = (3y, −x)', 'T(x, y) = (x, |y|)|||T(x, y) = (x, |y|)'], 2,
    "(3y, −x) = [0 3; −1 0](x, y); the others fail T(0) = 0 or the scaling rule.|||(3y, −x) = [0 3; −1 0](x, y); các ánh xạ khác vi phạm T(0) = 0 hoặc quy tắc nhân số."),
  Q('q2', "A linear map always sends the origin to|||Ánh xạ tuyến tính luôn đưa gốc toạ độ tới",
    ['itself|||chính nó', 'e₁|||e₁', 'any point|||điểm bất kỳ', 'infinity|||vô cùng'], 0,
    "T(0) = T(0·u) = 0·T(u) = 0.|||T(0) = T(0·u) = 0·T(u) = 0."),
  Q('q3', "T(e₁) = (1, 2), T(e₂) = (3, −1). Then T(4, −2) =|||T(e₁) = (1, 2), T(e₂) = (3, −1). Khi đó T(4, −2) =",
    ['(−2, 10)|||(−2, 10)', '(10, −2)|||(10, −2)', '(4, 6)|||(4, 6)', '(−2, 6)|||(−2, 6)'], 0,
    "4(1, 2) − 2(3, −1) = (−2, 10).|||4(1, 2) − 2(3, −1) = (−2, 10)."),
  Q('q4', "The matrix of T(x, y, z) = (x + 2z, y − z) has size|||Ma trận của T(x, y, z) = (x + 2z, y − z) có cỡ",
    ['3×2|||3×2', '2×3|||2×3', '2×2|||2×2', '3×3|||3×3'], 1,
    "Outputs × inputs = 2 × 3.|||Số đầu ra × số đầu vào = 2 × 3."),
  Q('q5', "T(1, 1) = (3, 1) and T(1, −1) = (1, 3). The standard matrix is|||T(1, 1) = (3, 1) và T(1, −1) = (1, 3). Ma trận chuẩn là",
    ['[3 1; 1 3]|||[3 1; 1 3]', '[2 1; 2 −1]|||[2 1; 2 −1]', '[2 2; 1 −1]|||[2 2; 1 −1]', '[1 2; −1 2]|||[1 2; −1 2]'], 1,
    "T(e₁) = ½(T(1,1) + T(1,−1)) = (2, 2), T(e₂) = ½(T(1,1) − T(1,−1)) = (1, −1).|||T(e₁) = ½(T(1,1) + T(1,−1)) = (2, 2), T(e₂) = ½(T(1,1) − T(1,−1)) = (1, −1)."),
  Q('q6', "The kernel of A = [1 2; 2 4] is|||Hạt nhân của A = [1 2; 2 4] là",
    ['{0}|||{0}', 'Span{(1, 2)}|||Span{(1, 2)}', 'Span{(−2, 1)}|||Span{(−2, 1)}', 'ℝ²|||ℝ²'], 2,
    "x + 2y = 0 ⇒ (x, y) = t(−2, 1).|||x + 2y = 0 ⇒ (x, y) = t(−2, 1)."),
  Q('q7', "A 3×5 matrix has rank 3. Its nullity is|||Ma trận 3×5 có hạng 3. Số chiều hạt nhân là",
    ['0|||0', '2|||2', '3|||3', '5|||5'], 1,
    "rank + nullity = number of columns = 5.|||hạng + nullity = số cột = 5."),
  Q('q8', "The map (x, y) ↦ (x, y, x + y) is|||Ánh xạ (x, y) ↦ (x, y, x + y) là",
    ['one-to-one but not onto|||đơn ánh nhưng không toàn ánh', 'onto but not one-to-one|||toàn ánh nhưng không đơn ánh', 'both|||cả hai', 'neither|||không phải cả hai'], 0,
    "Rank 2 = number of inputs (one-to-one), but 2 < 3 outputs (image is the plane z = x + y).|||Hạng 2 = số đầu vào (đơn ánh), nhưng 2 < 3 đầu ra (ảnh là mặt phẳng z = x + y)."),
  Q('q9', "Dropping the z-coordinate, (x, y, z) ↦ (x, y), has kernel|||Bỏ toạ độ z, (x, y, z) ↦ (x, y), có hạt nhân là",
    ['the z-axis|||trục z', 'the xy-plane|||mặt phẳng xy', '{0}|||{0}', 'the x-axis|||trục x'], 0,
    "Exactly the points (0, 0, z) go to (0, 0).|||Đúng các điểm (0, 0, z) đi tới (0, 0)."),
]);

const ch2 = {
  title: 'Chapter 2 — Linear transformations|||Chương 2 — Phép biến đổi tuyến tính',
  description: 'Định nghĩa và chữ ký hình học của ánh xạ tuyến tính, ma trận chuẩn từ ảnh của cơ sở, ma trận không vuông, hạt nhân, ảnh, hạng, đơn ánh/toàn ánh (Lay 1.8–1.9, 2.9 · ILA 3.1–3.3).',
  lessons: [c21, c22, c23, q2],
};

// ───────────────────────────── Chương 3 ─────────────────────────────
const c31 = L('mlt201-ts-3-1',
  '3.1 — Rotations and reflections|||3.1 — Phép quay và phép phản chiếu',
  'Ma trận quay R(θ) trong 2D, quay quanh trục z trong 3D; phản chiếu qua đường thẳng góc φ: [cos2φ sin2φ; sin2φ −cos2φ]; ví dụ phản chiếu qua y = 2x; định thức +1/−1; code NumPy.',
  `<span class="eyebrow">MLT201 · Chapter 3 · Lesson 3.1</span>
<h2>Rotations and reflections</h2>
<p class="lead">Rotations and reflections are the <strong>rigid</strong> motions that fix the origin: they keep every length and every angle. Each one is built by asking “where do e<sub>1</sub> and e<sub>2</sub> go?”.</p>
<h3>🎯 Objectives</h3>
<ul><li>Derive and use the rotation matrix R(θ).</li><li>Build the reflection across any line through the origin.</li><li>Rotate about a coordinate axis in 3D.</li><li>Tell rotations from reflections by the determinant.</li></ul>
<h3>📖 Lecture</h3>
<p>Rotating counter-clockwise by θ sends e<sub>1</sub> = (1, 0) to (cos θ, sin θ) and e<sub>2</sub> = (0, 1) to (−sin θ, cos θ) (e<sub>2</sub> is e<sub>1</sub> already turned by 90°). These are the columns:</p>
<div class="formula"><span class="lbl">Rotation by θ (counter-clockwise)</span>R(θ) = [cos θ  −sin θ; sin θ  cos θ]        R(90°) = [0 −1; 1 0]    R(180°) = [−1 0; 0 −1]</div>
<p>A <strong>reflection</strong> across the line L through the origin at angle φ to the x-axis keeps vectors on L fixed and flips vectors perpendicular to L. Its matrix is</p>
<div class="formula"><span class="lbl">Reflection across the line at angle φ</span>F(φ) = [cos 2φ  sin 2φ; sin 2φ  −cos 2φ]<br>x-axis (φ = 0): [1 0; 0 −1]    y-axis: [−1 0; 0 1]    line y = x: [0 1; 1 0]</div>
<p>In 3D, rotating about the z-axis leaves z alone and rotates the (x, y) part: R<sub>z</sub>(θ) = [cos θ −sin θ 0; sin θ cos θ 0; 0 0 1]. Rotations about x and y are built the same way; games combine three of them (yaw, pitch, roll).</p>
<p>Both families are <strong>orthogonal</strong> matrices (columns are perpendicular unit vectors, Chapter 9). Rotations have det = +1 (they keep orientation), reflections have det = −1 (they turn clockwise into counter-clockwise, like a mirror).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> Rotate (2, 0) by 30°: R(30°)(2, 0) = 2(cos 30°, sin 30°) = <b>(√3, 1)</b> ≈ (1.732, 1). Rotate (3, 1) by 90°: [0 −1; 1 0](3, 1) = <b>(−1, 3)</b>.</p></div>
<div class="callout"><p><b>Example 2 — reflect across y = 2x.</b> The line has tan φ = 2. Use the double-angle formulas cos 2φ = (1 − tan<sup>2</sup>φ)/(1 + tan<sup>2</sup>φ) = −3/5 and sin 2φ = 2 tan φ/(1 + tan<sup>2</sup>φ) = 4/5:</p><p><b>F = [−3/5  4/5; 4/5  3/5]</b>. Check: F(1, 2) = (−3/5 + 8/5, 4/5 + 6/5) = (1, 2) — on the line, fixed ✓. F(2, −1) = (−6/5 − 4/5, 8/5 − 3/5) = (−2, 1) — perpendicular, flipped ✓. And F(5, 0) = (−3, 4).</p></div>
<h3>💻 Check it in NumPy</h3>
<pre><code class="language-python">import numpy as np
np.set_printoptions(precision=4, suppress=True)

def rot(deg):
    t = np.radians(deg)
    return np.array([[np.cos(t), -np.sin(t)],
                     [np.sin(t),  np.cos(t)]])

def refl(deg):          # reflection across the line through 0 at angle deg
    t = np.radians(2 * deg)
    return np.array([[np.cos(t),  np.sin(t)],
                     [np.sin(t), -np.cos(t)]])

print(rot(30) @ [2, 0])
F = refl(np.degrees(np.arctan(2)))      # the line y = 2x
print(F)
print(F @ [1, 2], F @ [2, -1])
print(round(np.linalg.det(rot(30)), 6), round(np.linalg.det(F), 6))</code></pre>
<div class="out">[1.7321 1.    ]
[[-0.6  0.8]
 [ 0.8  0.6]]
[1. 2.] [-2.  1.]
1.0 -1.0</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Putting −sin θ in the wrong corner: that gives a clockwise rotation, R(−θ).</li><li>Using φ instead of 2φ in the reflection matrix.</li><li>Degrees vs radians: <code>np.cos(30)</code> means 30 radians. Convert with <code>np.radians</code>.</li><li>Screen coordinates in many graphics APIs have y pointing <em>down</em>, so “counter-clockwise” on paper looks clockwise on screen.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>R(θ) = [cos θ −sin θ; sin θ cos θ], det = 1.</li><li>Reflection across the line at angle φ: [cos 2φ sin 2φ; sin 2φ −cos 2φ], det = −1, F<sup>2</sup> = I.</li><li>3D rotation about an axis: rotate the other two coordinates, keep the axis coordinate.</li><li>Both preserve lengths and angles.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Rotation_matrix" target="_blank" rel="noopener">Wikipedia — Rotation matrix</a></li><li><a href="https://en.wikipedia.org/wiki/Reflection_(mathematics)" target="_blank" rel="noopener">Wikipedia — Reflection (mathematics)</a></li><li><a href="https://www.3blue1brown.com/lessons/3d-transformations" target="_blank" rel="noopener">3Blue1Brown — Three-dimensional linear transformations</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write R(45°) and compute R(45°)(1, 1).</li><li>Find the matrix of reflection across the line y = −x.</li><li>In 3D, rotate (1, 0, 5) by 90° about the z-axis.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) R(45°) = (√2/2)[1 −1; 1 1]; R(45°)(1, 1) = (0, √2). 2) φ = 135° (or −45°): cos 270° = 0, sin 270° = −1 ⇒ [0 −1; −1 0]; check (1, −1) ↦ (1, −1). 3) (0, 1, 5).</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 3 · Bài 3.1</span>
<h2>Phép quay và phép phản chiếu</h2>
<p class="lead">Quay và phản chiếu là các chuyển động <strong>cứng</strong> giữ yên gốc toạ độ: chúng giữ nguyên mọi độ dài và mọi góc. Mỗi phép đều dựng bằng câu hỏi “e<sub>1</sub> và e<sub>2</sub> đi đâu?”.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dựng và dùng ma trận quay R(θ).</li><li>Lập phép phản chiếu qua một đường thẳng bất kỳ đi qua gốc.</li><li>Quay quanh một trục toạ độ trong 3D.</li><li>Phân biệt quay với phản chiếu bằng định thức.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Quay ngược chiều kim đồng hồ một góc θ đưa e<sub>1</sub> = (1, 0) tới (cos θ, sin θ) và e<sub>2</sub> = (0, 1) tới (−sin θ, cos θ) (e<sub>2</sub> chính là e<sub>1</sub> đã quay sẵn 90°). Đó là các cột:</p>
<div class="formula"><span class="lbl">Quay góc θ (ngược chiều kim đồng hồ)</span>R(θ) = [cos θ  −sin θ; sin θ  cos θ]        R(90°) = [0 −1; 1 0]    R(180°) = [−1 0; 0 −1]</div>
<p><strong>Phản chiếu</strong> qua đường thẳng L đi qua gốc, hợp với trục x góc φ, giữ yên các vector nằm trên L và lật các vector vuông góc với L. Ma trận của nó là</p>
<div class="formula"><span class="lbl">Phản chiếu qua đường thẳng góc φ</span>F(φ) = [cos 2φ  sin 2φ; sin 2φ  −cos 2φ]<br>trục x (φ = 0): [1 0; 0 −1]    trục y: [−1 0; 0 1]    đường y = x: [0 1; 1 0]</div>
<p>Trong 3D, quay quanh trục z giữ nguyên z và quay phần (x, y): R<sub>z</sub>(θ) = [cos θ −sin θ 0; sin θ cos θ 0; 0 0 1]. Quay quanh x và y dựng tương tự; game ghép ba phép như vậy (yaw, pitch, roll).</p>
<p>Cả hai họ đều là ma trận <strong>trực giao</strong> (các cột là vector đơn vị vuông góc nhau, Chương 9). Phép quay có det = +1 (giữ hướng), phép phản chiếu có det = −1 (đổi chiều kim đồng hồ thành ngược chiều, như soi gương).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> Quay (2, 0) góc 30°: R(30°)(2, 0) = 2(cos 30°, sin 30°) = <b>(√3, 1)</b> ≈ (1,732; 1). Quay (3, 1) góc 90°: [0 −1; 1 0](3, 1) = <b>(−1, 3)</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — phản chiếu qua y = 2x.</b> Đường thẳng có tan φ = 2. Dùng công thức góc nhân đôi cos 2φ = (1 − tan<sup>2</sup>φ)/(1 + tan<sup>2</sup>φ) = −3/5 và sin 2φ = 2 tan φ/(1 + tan<sup>2</sup>φ) = 4/5:</p><p><b>F = [−3/5  4/5; 4/5  3/5]</b>. Kiểm: F(1, 2) = (−3/5 + 8/5, 4/5 + 6/5) = (1, 2) — nằm trên đường, đứng yên ✓. F(2, −1) = (−6/5 − 4/5, 8/5 − 3/5) = (−2, 1) — vuông góc, bị lật ✓. Và F(5, 0) = (−3, 4).</p></div>
<h3>💻 Kiểm bằng NumPy</h3>
<pre><code class="language-python">import numpy as np
np.set_printoptions(precision=4, suppress=True)

def rot(deg):
    t = np.radians(deg)
    return np.array([[np.cos(t), -np.sin(t)],
                     [np.sin(t),  np.cos(t)]])

def refl(deg):          # reflection across the line through 0 at angle deg
    t = np.radians(2 * deg)
    return np.array([[np.cos(t),  np.sin(t)],
                     [np.sin(t), -np.cos(t)]])

print(rot(30) @ [2, 0])
F = refl(np.degrees(np.arctan(2)))      # the line y = 2x
print(F)
print(F @ [1, 2], F @ [2, -1])
print(round(np.linalg.det(rot(30)), 6), round(np.linalg.det(F), 6))</code></pre>
<div class="out">[1.7321 1.    ]
[[-0.6  0.8]
 [ 0.8  0.6]]
[1. 2.] [-2.  1.]
1.0 -1.0</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đặt −sin θ sai góc: khi đó được phép quay cùng chiều kim đồng hồ, R(−θ).</li><li>Dùng φ thay cho 2φ trong ma trận phản chiếu.</li><li>Độ và radian: <code>np.cos(30)</code> là 30 radian. Đổi bằng <code>np.radians</code>.</li><li>Toạ độ màn hình trong nhiều API đồ hoạ có trục y hướng <em>xuống</em>, nên “ngược chiều kim đồng hồ” trên giấy lại trông cùng chiều trên màn hình.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>R(θ) = [cos θ −sin θ; sin θ cos θ], det = 1.</li><li>Phản chiếu qua đường góc φ: [cos 2φ sin 2φ; sin 2φ −cos 2φ], det = −1, F<sup>2</sup> = I.</li><li>Quay 3D quanh một trục: quay hai toạ độ còn lại, giữ toạ độ của trục.</li><li>Cả hai giữ nguyên độ dài và góc.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Rotation_matrix" target="_blank" rel="noopener">Wikipedia — Ma trận quay</a></li><li><a href="https://en.wikipedia.org/wiki/Reflection_(mathematics)" target="_blank" rel="noopener">Wikipedia — Phép phản chiếu</a></li><li><a href="https://www.3blue1brown.com/lessons/3d-transformations" target="_blank" rel="noopener">3Blue1Brown — Biến đổi tuyến tính ba chiều</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết R(45°) và tính R(45°)(1, 1).</li><li>Tìm ma trận phản chiếu qua đường y = −x.</li><li>Trong 3D, quay (1, 0, 5) góc 90° quanh trục z.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) R(45°) = (√2/2)[1 −1; 1 1]; R(45°)(1, 1) = (0, √2). 2) φ = 135° (hoặc −45°): cos 270° = 0, sin 270° = −1 ⇒ [0 −1; −1 0]; kiểm (1, −1) ↦ (1, −1). 3) (0, 1, 5).</p></div>`);

const c32 = L('mlt201-ts-3-2',
  '3.2 — Scaling, shears and squeezes|||3.2 — Co giãn, phép trượt và phép ép',
  'Co giãn đều và không đều diag(sₓ, s_y); phép trượt [1 k; 0 1] (chữ nghiêng, hiệu ứng động); phép ép giữ diện tích; ảnh của hình vuông đơn vị; diện tích thay đổi thế nào.',
  `<span class="eyebrow">MLT201 · Chapter 3 · Lesson 3.2</span>
<h2>Scaling, shears and squeezes</h2>
<p class="lead">Rotations and reflections never change shapes. The next three families do: <strong>scalings</strong> stretch along the axes, <strong>shears</strong> slide layers past each other, and <strong>squeezes</strong> stretch one way while shrinking the other.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write matrices for uniform and non-uniform scaling.</li><li>Write horizontal and vertical shears and draw their effect on a square.</li><li>Describe how each family changes areas.</li><li>Recognise these maps in graphics (zoom, italic text, squash-and-stretch animation).</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Scaling</span>S = [s<sub>x</sub> 0; 0 s<sub>y</sub>]  (x, y) ↦ (s<sub>x</sub>x, s<sub>y</sub>y)    uniform zoom: s<sub>x</sub> = s<sub>y</sub> = s    area factor: s<sub>x</sub>s<sub>y</sub></div>
<p>A negative factor adds a flip: [−1 0; 0 1] is the reflection across the y-axis. Uniform scaling by s keeps angles and multiplies lengths by |s| and areas by s<sup>2</sup>. Non-uniform scaling turns circles into ellipses: [3 0; 0 1] maps the unit circle to the ellipse x<sup>2</sup>/9 + y<sup>2</sup> = 1.</p>
<div class="formula"><span class="lbl">Shear</span>horizontal: H = [1 k; 0 1]  (x, y) ↦ (x + ky, y)    vertical: V = [1 0; k 1]  (x, y) ↦ (x, y + kx)    area factor: 1</div>
<p>A horizontal shear leaves the x-axis fixed and slides each horizontal line sideways in proportion to its height — like pushing the top of a deck of cards. Fonts use it to fake <em>italic</em> letters (k ≈ 0.2), and 2D animators use it to make objects lean as they speed up. Because each thin layer only slides, <strong>areas do not change</strong>: a parallelogram with the same base and height as the square.</p>
<div class="formula"><span class="lbl">Squeeze</span>[k 0; 0 1/k]  stretch x by k, shrink y by 1/k    area factor: 1</div>
<p>Animators call this “squash and stretch”: a bouncing ball flattens when it hits the floor but keeps its volume so it still looks solid.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — shear the unit square.</b> H = [1 0.5; 0 1]. Corners: (0, 0) → (0, 0), (1, 0) → (1, 0), (1, 1) → (1.5, 1), (0, 1) → (0.5, 1). The square becomes a parallelogram leaning right with base 1 and height 1: <b>area still 1</b>.</p></div>
<div class="callout"><p><b>Example 2 — scale a sprite.</b> A 64×32 pixel sprite scaled by S = [1.5 0; 0 2] becomes 96×64 pixels; area goes from 2048 to 6144 = 2048 × (1.5·2) ✓.</p></div>
<div class="callout"><p><b>Example 3 — identify the map.</b> What does [1 0; −2 1] do? e<sub>1</sub> → (1, −2), e<sub>2</sub> → (0, 1): the y-axis is fixed and points move down by 2x — a <b>vertical shear</b> with k = −2.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking a shear is a rotation because the picture “tilts”. A shear changes angles and keeps one axis fixed; a rotation changes no angle.</li><li>Putting k in the wrong corner: [1 k; 0 1] shifts x by ky (horizontal); [1 0; k 1] shifts y by kx (vertical).</li><li>Assuming “bigger looking” means bigger area: shears and squeezes always keep area.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Scaling diag(s<sub>x</sub>, s<sub>y</sub>): area × s<sub>x</sub>s<sub>y</sub>; circles → ellipses if s<sub>x</sub> ≠ s<sub>y</sub>.</li><li>Shear [1 k; 0 1]: slides layers, one axis fixed, area unchanged.</li><li>Squeeze [k 0; 0 1/k]: area unchanged.</li><li>Every 2×2 matrix can be built from rotations, scalings and shears (SVD, Chapter 10).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Shear_mapping" target="_blank" rel="noopener">Wikipedia — Shear mapping</a></li><li><a href="https://en.wikipedia.org/wiki/Scaling_(geometry)" target="_blank" rel="noopener">Wikipedia — Scaling (geometry)</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix" target="_blank" rel="noopener">MDN — CSS matrix() transform function</a> (try scale and skew on a web page)</li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the image of the square with corners (0, 0), (2, 0), (2, 2), (0, 2) under [1 0; 1 1]. What is its area?</li><li>Which matrix doubles widths, halves heights, and what happens to area?</li><li>Write the matrix that first reflects across the x-axis and then scales everything by 3.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (0, 0), (2, 2), (2, 4), (0, 2): a parallelogram with base 2 (vertical side) and width 2, area 4 — unchanged. 2) [2 0; 0 0.5], a squeeze: area unchanged. 3) 3·[1 0; 0 −1] = [3 0; 0 −3].</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 3 · Bài 3.2</span>
<h2>Co giãn, phép trượt và phép ép</h2>
<p class="lead">Quay và phản chiếu không bao giờ đổi hình dạng. Ba họ tiếp theo thì có: <strong>co giãn</strong> kéo theo các trục, <strong>trượt</strong> đẩy các lớp lệch nhau, và <strong>ép</strong> kéo dài chiều này trong khi thu ngắn chiều kia.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết ma trận co giãn đều và không đều.</li><li>Viết phép trượt ngang, trượt dọc và vẽ tác động lên hình vuông.</li><li>Mô tả mỗi họ thay đổi diện tích ra sao.</li><li>Nhận ra chúng trong đồ hoạ (phóng to, chữ nghiêng, hoạt hình co – giãn).</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Co giãn</span>S = [s<sub>x</sub> 0; 0 s<sub>y</sub>]  (x, y) ↦ (s<sub>x</sub>x, s<sub>y</sub>y)    phóng đều: s<sub>x</sub> = s<sub>y</sub> = s    hệ số diện tích: s<sub>x</sub>s<sub>y</sub></div>
<p>Hệ số âm thêm một phép lật: [−1 0; 0 1] là phản chiếu qua trục y. Co giãn đều hệ số s giữ nguyên góc, nhân độ dài với |s| và diện tích với s<sup>2</sup>. Co giãn không đều biến đường tròn thành elip: [3 0; 0 1] đưa đường tròn đơn vị thành elip x<sup>2</sup>/9 + y<sup>2</sup> = 1.</p>
<div class="formula"><span class="lbl">Phép trượt</span>ngang: H = [1 k; 0 1]  (x, y) ↦ (x + ky, y)    dọc: V = [1 0; k 1]  (x, y) ↦ (x, y + kx)    hệ số diện tích: 1</div>
<p>Phép trượt ngang giữ yên trục x và đẩy mỗi đường nằm ngang sang bên tỉ lệ với độ cao của nó — như đẩy mặt trên của một xấp bài. Phông chữ dùng nó để giả chữ <em>nghiêng</em> (k ≈ 0,2), và họa sĩ hoạt hình 2D dùng nó để vật thể nghiêng người khi tăng tốc. Vì mỗi lớp mỏng chỉ trượt ngang, <strong>diện tích không đổi</strong>: được hình bình hành cùng đáy, cùng chiều cao với hình vuông.</p>
<div class="formula"><span class="lbl">Phép ép</span>[k 0; 0 1/k]  giãn x k lần, thu y còn 1/k    hệ số diện tích: 1</div>
<p>Họa sĩ hoạt hình gọi là “squash and stretch”: quả bóng nảy bẹp ra khi chạm sàn nhưng giữ thể tích nên trông vẫn đặc.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — trượt hình vuông đơn vị.</b> H = [1 0,5; 0 1]. Các đỉnh: (0, 0) → (0, 0), (1, 0) → (1, 0), (1, 1) → (1,5; 1), (0, 1) → (0,5; 1). Hình vuông thành hình bình hành nghiêng phải, đáy 1, cao 1: <b>diện tích vẫn là 1</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — phóng một sprite.</b> Sprite 64×32 điểm ảnh qua S = [1,5 0; 0 2] thành 96×64 điểm ảnh; diện tích từ 2048 thành 6144 = 2048 × (1,5·2) ✓.</p></div>
<div class="callout"><p><b>Ví dụ 3 — nhận diện phép biến đổi.</b> [1 0; −2 1] làm gì? e<sub>1</sub> → (1, −2), e<sub>2</sub> → (0, 1): trục y đứng yên, mỗi điểm dời xuống 2x — <b>phép trượt dọc</b> với k = −2.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tưởng phép trượt là phép quay vì hình “nghiêng”. Phép trượt làm đổi góc và giữ yên một trục; phép quay không đổi góc nào.</li><li>Đặt k sai góc: [1 k; 0 1] dời x thêm ky (trượt ngang); [1 0; k 1] dời y thêm kx (trượt dọc).</li><li>Nghĩ “trông to hơn” là diện tích lớn hơn: phép trượt và phép ép luôn giữ diện tích.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Co giãn diag(s<sub>x</sub>, s<sub>y</sub>): diện tích × s<sub>x</sub>s<sub>y</sub>; tròn → elip nếu s<sub>x</sub> ≠ s<sub>y</sub>.</li><li>Trượt [1 k; 0 1]: đẩy lệch các lớp, một trục đứng yên, diện tích không đổi.</li><li>Ép [k 0; 0 1/k]: diện tích không đổi.</li><li>Mọi ma trận 2×2 đều dựng được từ quay, co giãn và trượt (SVD, Chương 10).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Shear_mapping" target="_blank" rel="noopener">Wikipedia — Phép trượt</a></li><li><a href="https://en.wikipedia.org/wiki/Scaling_(geometry)" target="_blank" rel="noopener">Wikipedia — Phép co giãn</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix" target="_blank" rel="noopener">MDN — Hàm biến đổi CSS matrix()</a> (thử scale và skew trên trang web)</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm ảnh của hình vuông đỉnh (0, 0), (2, 0), (2, 2), (0, 2) qua [1 0; 1 1]. Diện tích bằng bao nhiêu?</li><li>Ma trận nào nhân đôi bề ngang, chia đôi chiều cao, và diện tích thay đổi thế nào?</li><li>Viết ma trận phản chiếu qua trục x rồi phóng mọi thứ lên 3 lần.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (0, 0), (2, 2), (2, 4), (0, 2): hình bình hành có cạnh đứng dài 2 và bề ngang 2, diện tích 4 — không đổi. 2) [2 0; 0 0,5], một phép ép: diện tích không đổi. 3) 3·[1 0; 0 −1] = [3 0; 0 −3].</p></div>`);

const c33 = L('mlt201-ts-3-3',
  '3.3 — Projections: shadows onto lines and planes|||3.3 — Phép chiếu: bóng đổ lên đường thẳng và mặt phẳng',
  'Ma trận chiếu lên đường thẳng P = uuᵀ/(uᵀu); P² = P; chiếu lên mặt phẳng P = I − nnᵀ/(nᵀn); phản chiếu = 2P − I; hạt nhân và ảnh của phép chiếu; bóng đổ trong game.',
  `<span class="eyebrow">MLT201 · Chapter 3 · Lesson 3.3</span>
<h2>Projections: shadows onto lines and planes</h2>
<p class="lead">A <strong>projection</strong> drops every point perpendicularly onto a line or plane, like a shadow under a light directly overhead. It is the basic tool behind least squares, shadows in games and dimensionality reduction.</p>
<h3>🎯 Objectives</h3>
<ul><li>Build the matrix of the orthogonal projection onto a line through the origin.</li><li>Build the projection onto a plane from its normal vector.</li><li>Use the identities P<sup>2</sup> = P and “reflection = 2P − I”.</li><li>Describe the kernel and image of a projection.</li></ul>
<h3>📖 Lecture</h3>
<p>Lesson 1.2 gave proj<sub>u</sub> b = (u·b / u·u) u. Writing u·b as u<sup>T</sup>b turns this into a matrix acting on b:</p>
<div class="formula"><span class="lbl">Projection onto the line through u</span>P = u u<sup>T</sup> / (u<sup>T</sup>u)    (an n×n matrix of rank 1)    P<sup>2</sup> = P,  P<sup>T</sup> = P</div>
<p>Why P<sup>2</sup> = P? Once a point is on the line, projecting again does nothing — the shadow of a shadow is the same shadow. A projection crushes the perpendicular direction: <strong>kernel</strong> = the line (or plane) perpendicular to u, <strong>image</strong> = the line through u. It is never invertible (det = 0), because depth information is lost.</p>
<div class="formula"><span class="lbl">Projection onto the plane with normal n (in ℝ<sup>3</sup>)</span>P = I − n n<sup>T</sup> / (n<sup>T</sup>n)    (remove the component along n)</div>
<div class="formula"><span class="lbl">Reflection from projection</span>F = 2P − I    (go to the shadow, then the same distance again past it)</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — onto a line.</b> u = (1, 2): u u<sup>T</sup> = [1 2; 2 4], u<sup>T</sup>u = 5, so <b>P = (1/5)[1 2; 2 4]</b>. P(3, 1) = (1/5)(5, 10) = (1, 2). Check P<sup>2</sup>: (1/25)[5 10; 10 20] = P ✓. And 2P − I = [−3/5 4/5; 4/5 3/5] — the reflection across y = 2x from Lesson 3.1 ✓.</p></div>
<div class="callout"><p><b>Example 2 — onto a plane.</b> Plane x + y + z = 0, normal n = (1, 1, 1), n<sup>T</sup>n = 3. P = I − (1/3)[1 1 1; 1 1 1; 1 1 1] = (1/3)[2 −1 −1; −1 2 −1; −1 −1 2]. P(3, 0, 0) = (2, −1, −1): its coordinates sum to 0, so it is on the plane ✓, and (3, 0, 0) − (2, −1, −1) = (1, 1, 1) is along the normal ✓. The reflection across the plane: (2P − I)(3, 0, 0) = (1, −2, −2).</p></div>
<div class="callout"><p><b>Example 3 — shadow in a game.</b> With the sun straight overhead, the shadow of a character on flat ground y = 0 is the projection diag(1, 0, 1): (x, y, z) ↦ (x, 0, z). Real engines use a slanted (oblique) version for a low sun, but the idea is the same matrix-times-every-vertex.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing u<sup>T</sup>u (a number) where u u<sup>T</sup> (a matrix) is needed, or vice versa.</li><li>Forgetting to divide by u<sup>T</sup>u when u is not a unit vector.</li><li>Expecting a projection to be invertible. Its determinant is 0; you cannot recover height from a shadow.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Onto a line: P = uu<sup>T</sup>/(u<sup>T</sup>u); onto a plane with normal n: P = I − nn<sup>T</sup>/(n<sup>T</sup>n).</li><li>P<sup>2</sup> = P, P<sup>T</sup> = P; eigenvalues 1 (on the target) and 0 (perpendicular).</li><li>Reflection = 2P − I.</li><li>Projections lose information: det P = 0 (unless P = I).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/projections.html" target="_blank" rel="noopener">Interactive Linear Algebra — 6.3 Orthogonal Projection</a></li><li><a href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/resources/lecture-15-projections-onto-subspaces/" target="_blank" rel="noopener">MIT 18.06SC — Lecture 15: Projections onto Subspaces</a></li><li><a href="https://en.wikipedia.org/wiki/Projection_(linear_algebra)" target="_blank" rel="noopener">Wikipedia — Projection (linear algebra)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the matrix projecting onto the line through (3, 4), and project (5, 0).</li><li>Project (1, 2, 3) onto the xy-plane and onto the z-axis. Add the two results.</li><li>Is [1 1; 0 0] a projection (P<sup>2</sup> = P)? Is it an <em>orthogonal</em> projection?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) P = (1/25)[9 12; 12 16]; P(5, 0) = (9/5, 12/5) = (1.8, 2.4) — same as Lesson 1.2. 2) (1, 2, 0) and (0, 0, 3); they add back to (1, 2, 3). 3) P<sup>2</sup> = [1 1; 0 0] = P, so yes; but P<sup>T</sup> ≠ P, so it projects along a slanted direction (an oblique projection), not perpendicularly.</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 3 · Bài 3.3</span>
<h2>Phép chiếu: bóng đổ lên đường thẳng và mặt phẳng</h2>
<p class="lead"><strong>Phép chiếu</strong> thả vuông góc mọi điểm xuống một đường thẳng hoặc mặt phẳng, như cái bóng khi đèn ở ngay trên đầu. Nó là công cụ nền của bình phương tối thiểu, bóng đổ trong game và giảm chiều dữ liệu.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dựng ma trận chiếu vuông góc lên đường thẳng qua gốc.</li><li>Dựng phép chiếu lên mặt phẳng từ vector pháp tuyến.</li><li>Dùng các đẳng thức P<sup>2</sup> = P và “phản chiếu = 2P − I”.</li><li>Mô tả hạt nhân và ảnh của phép chiếu.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Bài 1.2 cho proj<sub>u</sub> b = (u·b / u·u) u. Viết u·b thành u<sup>T</sup>b, công thức trở thành một ma trận tác động lên b:</p>
<div class="formula"><span class="lbl">Chiếu lên đường thẳng qua u</span>P = u u<sup>T</sup> / (u<sup>T</sup>u)    (ma trận n×n hạng 1)    P<sup>2</sup> = P,  P<sup>T</sup> = P</div>
<p>Vì sao P<sup>2</sup> = P? Một điểm đã nằm trên đường thì chiếu lần nữa chẳng làm gì — bóng của cái bóng vẫn là cái bóng đó. Phép chiếu đè bẹp hướng vuông góc: <strong>hạt nhân</strong> = đường (hay mặt phẳng) vuông góc với u, <strong>ảnh</strong> = đường thẳng qua u. Nó không bao giờ khả nghịch (det = 0), vì thông tin chiều sâu đã mất.</p>
<div class="formula"><span class="lbl">Chiếu lên mặt phẳng có pháp tuyến n (trong ℝ<sup>3</sup>)</span>P = I − n n<sup>T</sup> / (n<sup>T</sup>n)    (bỏ đi thành phần dọc theo n)</div>
<div class="formula"><span class="lbl">Phản chiếu từ phép chiếu</span>F = 2P − I    (đi tới cái bóng, rồi đi tiếp một đoạn bằng thế nữa)</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — lên một đường thẳng.</b> u = (1, 2): u u<sup>T</sup> = [1 2; 2 4], u<sup>T</sup>u = 5, nên <b>P = (1/5)[1 2; 2 4]</b>. P(3, 1) = (1/5)(5, 10) = (1, 2). Kiểm P<sup>2</sup>: (1/25)[5 10; 10 20] = P ✓. Và 2P − I = [−3/5 4/5; 4/5 3/5] — đúng phép phản chiếu qua y = 2x của Bài 3.1 ✓.</p></div>
<div class="callout"><p><b>Ví dụ 2 — lên một mặt phẳng.</b> Mặt phẳng x + y + z = 0, pháp tuyến n = (1, 1, 1), n<sup>T</sup>n = 3. P = I − (1/3)[1 1 1; 1 1 1; 1 1 1] = (1/3)[2 −1 −1; −1 2 −1; −1 −1 2]. P(3, 0, 0) = (2, −1, −1): tổng các toạ độ bằng 0, nên nằm trên mặt phẳng ✓, và (3, 0, 0) − (2, −1, −1) = (1, 1, 1) nằm dọc pháp tuyến ✓. Phản chiếu qua mặt phẳng: (2P − I)(3, 0, 0) = (1, −2, −2).</p></div>
<div class="callout"><p><b>Ví dụ 3 — bóng đổ trong game.</b> Khi mặt trời ở ngay đỉnh đầu, bóng của nhân vật trên mặt đất phẳng y = 0 là phép chiếu diag(1, 0, 1): (x, y, z) ↦ (x, 0, z). Engine thật dùng bản xiên (chiếu xiên) cho mặt trời thấp, nhưng ý tưởng vẫn là nhân một ma trận với mọi đỉnh.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết u<sup>T</sup>u (một số) ở chỗ cần u u<sup>T</sup> (một ma trận), hoặc ngược lại.</li><li>Quên chia cho u<sup>T</sup>u khi u không phải vector đơn vị.</li><li>Mong phép chiếu khả nghịch. Định thức của nó bằng 0; không thể khôi phục chiều cao từ cái bóng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Lên đường thẳng: P = uu<sup>T</sup>/(u<sup>T</sup>u); lên mặt phẳng pháp tuyến n: P = I − nn<sup>T</sup>/(n<sup>T</sup>n).</li><li>P<sup>2</sup> = P, P<sup>T</sup> = P; trị riêng 1 (trên đích) và 0 (vuông góc).</li><li>Phản chiếu = 2P − I.</li><li>Phép chiếu làm mất thông tin: det P = 0 (trừ khi P = I).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/projections.html" target="_blank" rel="noopener">Interactive Linear Algebra — 6.3 Phép chiếu vuông góc</a></li><li><a href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/resources/lecture-15-projections-onto-subspaces/" target="_blank" rel="noopener">MIT 18.06SC — Bài 15: Chiếu lên không gian con</a></li><li><a href="https://en.wikipedia.org/wiki/Projection_(linear_algebra)" target="_blank" rel="noopener">Wikipedia — Phép chiếu (đại số tuyến tính)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm ma trận chiếu lên đường thẳng qua (3, 4), rồi chiếu (5, 0).</li><li>Chiếu (1, 2, 3) lên mặt phẳng xy và lên trục z. Cộng hai kết quả.</li><li>[1 1; 0 0] có phải phép chiếu (P<sup>2</sup> = P) không? Có phải phép chiếu <em>vuông góc</em> không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) P = (1/25)[9 12; 12 16]; P(5, 0) = (9/5, 12/5) = (1,8; 2,4) — trùng Bài 1.2. 2) (1, 2, 0) và (0, 0, 3); cộng lại đúng (1, 2, 3). 3) P<sup>2</sup> = [1 1; 0 0] = P nên có; nhưng P<sup>T</sup> ≠ P, nên nó chiếu theo một hướng xiên (chiếu xiên), không vuông góc.</p></div>`);

const q3 = QZ(3, 'Quiz — Chapter 3: A gallery of transformations|||Quiz — Chương 3: Bộ sưu tập các phép biến đổi', 'Kiểm tra chương 3: quay, phản chiếu, co giãn, trượt, phép chiếu, định thức ±1, P² = P.', [
  Q('q1', "R(90°) applied to (3, 1) gives|||R(90°) tác động lên (3, 1) cho",
    ['(−1, 3)|||(−1, 3)', '(1, −3)|||(1, −3)', '(−3, −1)|||(−3, −1)', '(3, −1)|||(3, −1)'], 0,
    "[0 −1; 1 0](3, 1) = (−1, 3).|||[0 −1; 1 0](3, 1) = (−1, 3)."),
  Q('q2', "The matrix of reflection across the line y = x is|||Ma trận phản chiếu qua đường y = x là",
    ['[0 1; 1 0]|||[0 1; 1 0]', '[0 −1; 1 0]|||[0 −1; 1 0]', '[1 0; 0 −1]|||[1 0; 0 −1]', '[−1 0; 0 −1]|||[−1 0; 0 −1]'], 0,
    "It swaps x and y: φ = 45°, cos 90° = 0, sin 90° = 1.|||Nó đổi chỗ x và y: φ = 45°, cos 90° = 0, sin 90° = 1."),
  Q('q3', "The reflection across y = 2x is [−3/5 4/5; 4/5 3/5]. It sends (2, −1) to|||Phản chiếu qua y = 2x là [−3/5 4/5; 4/5 3/5]. Nó đưa (2, −1) tới",
    ['(2, −1)|||(2, −1)', '(−2, 1)|||(−2, 1)', '(1, 2)|||(1, 2)', '(0, 0)|||(0, 0)'], 1,
    "(2, −1) is perpendicular to the line, so it is flipped.|||(2, −1) vuông góc với đường thẳng nên bị lật."),
  Q('q4', "The determinant of any reflection in the plane is|||Định thức của mọi phép phản chiếu trong mặt phẳng là",
    ['1|||1', '−1|||−1', '0|||0', 'depends on the line|||tuỳ đường thẳng'], 1,
    "A reflection reverses orientation and keeps areas.|||Phản chiếu đảo hướng và giữ diện tích."),
  Q('q5', "Under the shear [1 0.5; 0 1], the point (1, 1) goes to|||Qua phép trượt [1 0,5; 0 1], điểm (1, 1) đi tới",
    ['(1, 1.5)|||(1; 1,5)', '(1.5, 1)|||(1,5; 1)', '(0.5, 1)|||(0,5; 1)', '(1.5, 1.5)|||(1,5; 1,5)'], 1,
    "(x + 0.5y, y) = (1.5, 1).|||(x + 0,5y, y) = (1,5; 1)."),
  Q('q6', "A shear changes the area of a shape by a factor of|||Phép trượt thay đổi diện tích một hình theo hệ số",
    ['k|||k', '1 + k|||1 + k', '1 (no change)|||1 (không đổi)', 'k²|||k²'], 2,
    "det [1 k; 0 1] = 1.|||det [1 k; 0 1] = 1."),
  Q('q7', "The projection onto the line through u = (1, 2) is|||Phép chiếu lên đường thẳng qua u = (1, 2) là",
    ['[1 2; 2 4]|||[1 2; 2 4]', '(1/5)[1 2; 2 4]|||(1/5)[1 2; 2 4]', '(1/5)[4 −2; −2 1]|||(1/5)[4 −2; −2 1]', '(1/√5)[1 2; 2 4]|||(1/√5)[1 2; 2 4]'], 1,
    "P = uuᵀ/(uᵀu) with uᵀu = 5.|||P = uuᵀ/(uᵀu) với uᵀu = 5."),
  Q('q8', "Every projection matrix P satisfies|||Mọi ma trận chiếu P đều thoả",
    ['P² = I|||P² = I', 'P² = P|||P² = P', 'P² = 0|||P² = 0', 'det P = 1|||det P = 1'], 1,
    "Projecting twice is the same as projecting once.|||Chiếu hai lần cũng như chiếu một lần."),
  Q('q9', "If P is the orthogonal projection onto a line, the reflection across that line is|||Nếu P là phép chiếu vuông góc lên một đường thẳng thì phép phản chiếu qua đường đó là",
    ['I − P|||I − P', '2P − I|||2P − I', 'P − 2I|||P − 2I', 'P²|||P²'], 1,
    "x + 2(Px − x) = (2P − I)x.|||x + 2(Px − x) = (2P − I)x."),
]);

const ch3 = {
  title: 'Chapter 3 — A gallery of geometric transformations|||Chương 3 — Bộ sưu tập các phép biến đổi hình học',
  description: 'Quay 2D/3D, phản chiếu qua đường thẳng bất kỳ, co giãn, trượt, ép, phép chiếu lên đường thẳng và mặt phẳng; ứng dụng chữ nghiêng, hoạt hình, bóng đổ (Lay 1.9 · Marschner–Shirley 6.1 · ILA 3.1, 6.3).',
  lessons: [c31, c32, c33, q3],
};

// ───────────────────────────── Chương 4 ─────────────────────────────
const c41 = L('mlt201-ts-4-1',
  '4.1 — Matrix multiplication is composition|||4.1 — Nhân ma trận là hợp thành các phép biến đổi',
  'S(T(x)) = (BA)x: làm A trước, B sau, đọc từ phải sang trái; vì sao AB ≠ BA (quay rồi trượt khác trượt rồi quay); R(α)R(β) = R(α+β) suy ra công thức cộng góc; hai phép phản chiếu = một phép quay.',
  `<span class="eyebrow">MLT201 · Chapter 4 · Lesson 4.1</span>
<h2>Matrix multiplication is composition</h2>
<p class="lead">Why is matrix multiplication defined in that strange row-times-column way? Because it is exactly what you get when you <strong>do one transformation and then another</strong>. Once you see this, the rules (and the fact that AB ≠ BA) stop being mysterious.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write the matrix of “do T, then S” as a product, in the right order.</li><li>Compute products column by column: AB = [Ab<sub>1</sub> Ab<sub>2</sub> …].</li><li>Show with pictures that AB and BA are usually different.</li><li>Use R(α)R(β) = R(α + β) and “two reflections make a rotation”.</li></ul>
<h3>📖 Lecture</h3>
<p>Let T(x) = Ax and S(y) = By. Doing T first and then S gives S(T(x)) = B(Ax). Because the composition is again linear, it has a matrix, and we <em>define</em> the product so that B(Ax) = (BA)x:</p>
<div class="formula"><span class="lbl">Composition</span>(S ∘ T)(x) = B(Ax) = (BA)x    — read right to left: A acts first<br>Column rule: BA = [ B a<sub>1</sub>   B a<sub>2</sub>   …   B a<sub>n</sub> ]  (B applied to each column of A)</div>
<p>The column rule is just “where does e<sub>j</sub> go? First to a<sub>j</sub> (by A), then to Ba<sub>j</sub> (by B)”. The usual “row i dot column j” formula gives the same numbers.</p>
<p><strong>Order matters.</strong> Putting on socks then shoes is not the same as shoes then socks. In graphics, “rotate then move” puts an object in a different place from “move then rotate” (Chapter 6).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — rotate then shear vs shear then rotate.</b> A = R(90°) = [0 −1; 1 0], B = horizontal shear [1 1; 0 1].</p><p>Rotate first, then shear: BA = [1 1; 0 1][0 −1; 1 0] = <b>[1 −1; 1 0]</b>.<br>Shear first, then rotate: AB = [0 −1; 1 0][1 1; 0 1] = <b>[0 −1; 1 1]</b>.</p><p>Follow e<sub>1</sub>: BA e<sub>1</sub> = (1, 1) but AB e<sub>1</sub> = (0, 1). Different pictures, different matrices.</p></div>
<div class="callout"><p><b>Example 2 — rotations add angles.</b> Rotating by β and then by α is rotating by α + β, so R(α)R(β) = R(α + β). Multiply out the left side: the top-left entry is cos α cos β − sin α sin β, and it must equal cos(α + β). That is how the angle-addition formulas of trigonometry come for free. Rotations of the plane <em>do</em> commute with each other.</p></div>
<div class="callout"><p><b>Example 3 — two mirrors make a rotation.</b> Reflect across the x-axis, F<sub>1</sub> = [1 0; 0 −1], then across y = x, F<sub>2</sub> = [0 1; 1 0]: F<sub>2</sub>F<sub>1</sub> = [0 −1; 1 0] = R(90°). In general, reflecting across lines at angles φ<sub>1</sub> then φ<sub>2</sub> gives the rotation by 2(φ<sub>2</sub> − φ<sub>1</sub>) — here 2(45° − 0°) = 90° ✓. (det: (−1)(−1) = +1, a rotation.)</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing the matrices in the order the steps happen. “A then B” is <strong>BA</strong>.</li><li>Assuming AB = BA. It is true for special pairs (two rotations, two scalings, any matrix with I) but false in general.</li><li>Size mismatch: BA needs (columns of B) = (rows of A). A 2×3 times a 3×4 is 2×4.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Matrix of “T then S” is BA (right-to-left).</li><li>Column rule: column j of BA is B times column j of A.</li><li>AB ≠ BA in general; rotations of the plane commute among themselves.</li><li>R(α)R(β) = R(α + β); two reflections compose to a rotation.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/matrix-multiplication" target="_blank" rel="noopener">3Blue1Brown — Matrix multiplication as composition</a></li><li><a href="https://textbooks.math.gatech.edu/ila/matrix-multiplication.html" target="_blank" rel="noopener">Interactive Linear Algebra — 3.4 Matrix Multiplication</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Matrix_math_for_the_web" target="_blank" rel="noopener">MDN — Matrix math for the web</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the matrix of “scale by diag(2, 1), then rotate 90°”. Where does (1, 1) go?</li><li>Compute [1 2; 0 1][1 0; 3 1] and [1 0; 3 1][1 2; 0 1]. Are they equal?</li><li>Which single transformation is “rotate 30° then rotate 60°”?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) R(90°)·diag(2, 1) = [0 −1; 1 0][2 0; 0 1] = [0 −1; 2 0]; (1, 1) ↦ (−1, 2). 2) [7 2; 3 1] and [1 2; 3 7] — not equal. 3) R(90°) = [0 −1; 1 0].</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 4 · Bài 4.1</span>
<h2>Nhân ma trận là hợp thành các phép biến đổi</h2>
<p class="lead">Vì sao phép nhân ma trận lại định nghĩa kiểu “hàng nhân cột” kỳ lạ như vậy? Vì đó đúng là kết quả khi bạn <strong>làm một phép biến đổi rồi làm tiếp phép khác</strong>. Hiểu điều này, các quy tắc (và việc AB ≠ BA) hết bí ẩn.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết ma trận của “làm T, rồi S” thành một tích, đúng thứ tự.</li><li>Tính tích theo cột: AB = [Ab<sub>1</sub> Ab<sub>2</sub> …].</li><li>Chỉ ra bằng hình rằng AB và BA thường khác nhau.</li><li>Dùng R(α)R(β) = R(α + β) và “hai phép phản chiếu ghép thành một phép quay”.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Cho T(x) = Ax và S(y) = By. Làm T trước rồi S cho S(T(x)) = B(Ax). Vì hợp thành vẫn tuyến tính nên nó có ma trận, và ta <em>định nghĩa</em> phép nhân sao cho B(Ax) = (BA)x:</p>
<div class="formula"><span class="lbl">Hợp thành</span>(S ∘ T)(x) = B(Ax) = (BA)x    — đọc từ phải sang trái: A tác động trước<br>Quy tắc cột: BA = [ B a<sub>1</sub>   B a<sub>2</sub>   …   B a<sub>n</sub> ]  (B tác động lên từng cột của A)</div>
<p>Quy tắc cột chỉ là “e<sub>j</sub> đi đâu? Trước tới a<sub>j</sub> (bởi A), sau tới Ba<sub>j</sub> (bởi B)”. Công thức quen thuộc “hàng i nhân vô hướng cột j” cho cùng các con số.</p>
<p><strong>Thứ tự quan trọng.</strong> Đi tất rồi đi giày khác với đi giày rồi đi tất. Trong đồ hoạ, “quay rồi dời” đặt vật ở chỗ khác hẳn “dời rồi quay” (Chương 6).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — quay rồi trượt so với trượt rồi quay.</b> A = R(90°) = [0 −1; 1 0], B = phép trượt ngang [1 1; 0 1].</p><p>Quay trước, trượt sau: BA = [1 1; 0 1][0 −1; 1 0] = <b>[1 −1; 1 0]</b>.<br>Trượt trước, quay sau: AB = [0 −1; 1 0][1 1; 0 1] = <b>[0 −1; 1 1]</b>.</p><p>Theo dõi e<sub>1</sub>: BA e<sub>1</sub> = (1, 1) nhưng AB e<sub>1</sub> = (0, 1). Hình khác nhau, ma trận khác nhau.</p></div>
<div class="callout"><p><b>Ví dụ 2 — phép quay cộng góc.</b> Quay góc β rồi quay góc α là quay góc α + β, nên R(α)R(β) = R(α + β). Nhân vế trái ra: phần tử góc trên trái là cos α cos β − sin α sin β, và nó phải bằng cos(α + β). Công thức cộng góc lượng giác có được “miễn phí” như thế. Các phép quay trong mặt phẳng <em>giao hoán</em> với nhau.</p></div>
<div class="callout"><p><b>Ví dụ 3 — hai tấm gương thành một phép quay.</b> Phản chiếu qua trục x, F<sub>1</sub> = [1 0; 0 −1], rồi qua đường y = x, F<sub>2</sub> = [0 1; 1 0]: F<sub>2</sub>F<sub>1</sub> = [0 −1; 1 0] = R(90°). Tổng quát, phản chiếu qua đường góc φ<sub>1</sub> rồi góc φ<sub>2</sub> cho phép quay góc 2(φ<sub>2</sub> − φ<sub>1</sub>) — ở đây 2(45° − 0°) = 90° ✓. (Định thức: (−1)(−1) = +1, là phép quay.)</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết các ma trận theo thứ tự các bước diễn ra. “A rồi B” là <strong>BA</strong>.</li><li>Cho rằng AB = BA. Đúng với vài cặp đặc biệt (hai phép quay, hai phép co giãn, bất kỳ ma trận nào với I) nhưng sai nói chung.</li><li>Lệch kích thước: BA cần (số cột của B) = (số hàng của A). Ma trận 2×3 nhân 3×4 được 2×4.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Ma trận của “T rồi S” là BA (phải sang trái).</li><li>Quy tắc cột: cột j của BA là B nhân cột j của A.</li><li>Nói chung AB ≠ BA; các phép quay mặt phẳng giao hoán với nhau.</li><li>R(α)R(β) = R(α + β); hai phép phản chiếu ghép thành một phép quay.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/matrix-multiplication" target="_blank" rel="noopener">3Blue1Brown — Nhân ma trận là hợp thành</a></li><li><a href="https://textbooks.math.gatech.edu/ila/matrix-multiplication.html" target="_blank" rel="noopener">Interactive Linear Algebra — 3.4 Phép nhân ma trận</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Matrix_math_for_the_web" target="_blank" rel="noopener">MDN — Toán ma trận cho web</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm ma trận của “co giãn diag(2, 1), rồi quay 90°”. (1, 1) đi đâu?</li><li>Tính [1 2; 0 1][1 0; 3 1] và [1 0; 3 1][1 2; 0 1]. Chúng có bằng nhau không?</li><li>“Quay 30° rồi quay 60°” là phép biến đổi đơn nào?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) R(90°)·diag(2, 1) = [0 −1; 1 0][2 0; 0 1] = [0 −1; 2 0]; (1, 1) ↦ (−1, 2). 2) [7 2; 3 1] và [1 2; 3 7] — không bằng nhau. 3) R(90°) = [0 −1; 1 0].</p></div>`);

const c42 = L('mlt201-ts-4-2',
  '4.2 — Inverse transformations: undoing a motion|||4.2 — Phép biến đổi ngược: hoàn tác một chuyển động',
  'A⁻¹ hoàn tác A; công thức nghịch đảo 2×2; nghịch đảo của quay (= chuyển vị), phản chiếu (chính nó), co giãn, trượt; (AB)⁻¹ = B⁻¹A⁻¹ (tất và giày); khi nào không có nghịch đảo: không gian bị đè bẹp.',
  `<span class="eyebrow">MLT201 · Chapter 4 · Lesson 4.2</span>
<h2>Inverse transformations: undoing a motion</h2>
<p class="lead">Many transformations can be undone: un-rotate, un-shear, zoom back out. The matrix that undoes A is its <strong>inverse</strong> A<sup>−1</sup>. Some transformations cannot be undone — and geometry tells you exactly which ones.</p>
<h3>🎯 Objectives</h3>
<ul><li>Use the definition AA<sup>−1</sup> = A<sup>−1</sup>A = I and the 2×2 inverse formula.</li><li>Write the inverses of rotations, reflections, scalings and shears without computing.</li><li>Apply (AB)<sup>−1</sup> = B<sup>−1</sup>A<sup>−1</sup>.</li><li>Recognise non-invertible matrices as transformations that flatten space.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Inverse of a 2×2 matrix</span>A = [a b; c d],  det A = ad − bc ≠ 0  ⇒  A<sup>−1</sup> = (1/(ad − bc)) [d −b; −c a]<br>(swap the diagonal, negate the off-diagonal, divide by the determinant)</div>
<p>Geometric inverses — no computation needed:</p>
<ul><li>Rotation: R(θ)<sup>−1</sup> = R(−θ) = R(θ)<sup>T</sup> (turn back).</li><li>Reflection: F<sup>−1</sup> = F (mirror twice = do nothing).</li><li>Scaling: diag(s<sub>x</sub>, s<sub>y</sub>)<sup>−1</sup> = diag(1/s<sub>x</sub>, 1/s<sub>y</sub>), needs s<sub>x</sub>, s<sub>y</sub> ≠ 0.</li><li>Shear: [1 k; 0 1]<sup>−1</sup> = [1 −k; 0 1] (slide back).</li></ul>
<div class="formula"><span class="lbl">Inverse of a product (“socks and shoes”)</span>(AB)<sup>−1</sup> = B<sup>−1</sup>A<sup>−1</sup>    — to undo “B then A”, undo A first, then undo B</div>
<p><strong>When is there no inverse?</strong> If A squashes the plane onto a line (or a point), different inputs land on the same output (the kernel is not {0}), so nothing can tell you where a point came from. For a square matrix, all of these are equivalent: A is invertible ⇔ det A ≠ 0 ⇔ Ker A = {0} ⇔ columns span ℝ<sup>n</sup> ⇔ Ax = b has exactly one solution for every b.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> A = [2 1; 5 3]: det = 6 − 5 = 1, so <b>A<sup>−1</sup> = [3 −1; −5 2]</b>. Check: [2 1; 5 3][3 −1; −5 2] = [6 − 5, −2 + 2; 15 − 15, −5 + 6] = I ✓.</p></div>
<div class="callout"><p><b>Example 2 — a non-integer inverse.</b> A = [4 7; 2 6]: det = 24 − 14 = 10, A<sup>−1</sup> = (1/10)[6 −7; −2 4] = [0.6 −0.7; −0.2 0.4].</p></div>
<div class="callout"><p><b>Example 3 — undo a two-step motion.</b> An image editor applied “shear [1 2; 0 1], then rotate 90°”: M = R(90°)H. To undo it: M<sup>−1</sup> = H<sup>−1</sup>R(90°)<sup>−1</sup> = [1 −2; 0 1][0 1; −1 0] = <b>[2 1; −1 0]</b> — un-rotate first, then un-shear.</p></div>
<div class="callout"><p><b>Example 4 — no inverse.</b> [1 2; 2 4] has det 0: it flattens the plane onto the line y = 2x (Lesson 2.3). Both (2, 0) and (0, 1) go to (2, 4) — there is no way back.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>(AB)<sup>−1</sup> = A<sup>−1</sup>B<sup>−1</sup> is wrong (unless they commute).</li><li>Inverting entry by entry: the inverse of [2 0; 0 4] is [1/2 0; 0 1/4], but the inverse of [1 2; 3 4] is <em>not</em> [1 1/2; 1/3 1/4].</li><li>In code, avoid computing inv(A) @ b to solve Ax = b; use a solver (next lesson) — it is faster and more accurate.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>A<sup>−1</sup> undoes A; 2×2: (1/det)[d −b; −c a].</li><li>Rotation⁻¹ = rotation back = transpose; reflection⁻¹ = itself; shear⁻¹ = opposite shear.</li><li>(AB)<sup>−1</sup> = B<sup>−1</sup>A<sup>−1</sup>.</li><li>Invertible ⇔ det ≠ 0 ⇔ no flattening.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/matrix-inverses.html" target="_blank" rel="noopener">Interactive Linear Algebra — 3.5 Matrix Inverses</a></li><li><a href="https://www.3blue1brown.com/lessons/inverse-matrices" target="_blank" rel="noopener">3Blue1Brown — Inverse matrices, column space, and null space</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.solve.html" target="_blank" rel="noopener">NumPy — numpy.linalg.solve</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Invert [3 2; 4 3].</li><li>Without computing, give the inverse of [−1 0; 0 1] and of [1 0; −4 1].</li><li>For which t is [t 2; 8 t] not invertible? Describe the transformation then.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) det = 1 ⇒ [3 −2; −4 3]. 2) A reflection: itself. A vertical shear: [1 0; 4 1]. 3) det = t<sup>2</sup> − 16 = 0 ⇒ t = ±4; the columns become parallel and the plane is flattened onto a line.</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 4 · Bài 4.2</span>
<h2>Phép biến đổi ngược: hoàn tác một chuyển động</h2>
<p class="lead">Nhiều phép biến đổi hoàn tác được: quay ngược, trượt ngược, thu nhỏ lại. Ma trận hoàn tác A là <strong>nghịch đảo</strong> A<sup>−1</sup>. Có những phép không thể hoàn tác — và hình học cho biết chính xác đó là những phép nào.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dùng định nghĩa AA<sup>−1</sup> = A<sup>−1</sup>A = I và công thức nghịch đảo 2×2.</li><li>Viết nghịch đảo của phép quay, phản chiếu, co giãn, trượt mà không cần tính.</li><li>Áp dụng (AB)<sup>−1</sup> = B<sup>−1</sup>A<sup>−1</sup>.</li><li>Nhận ra ma trận không khả nghịch là phép biến đổi làm dẹt không gian.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Nghịch đảo ma trận 2×2</span>A = [a b; c d],  det A = ad − bc ≠ 0  ⇒  A<sup>−1</sup> = (1/(ad − bc)) [d −b; −c a]<br>(đổi chỗ đường chéo chính, đổi dấu đường chéo phụ, chia cho định thức)</div>
<p>Nghịch đảo bằng hình học — không cần tính:</p>
<ul><li>Quay: R(θ)<sup>−1</sup> = R(−θ) = R(θ)<sup>T</sup> (quay lại).</li><li>Phản chiếu: F<sup>−1</sup> = F (soi gương hai lần = không làm gì).</li><li>Co giãn: diag(s<sub>x</sub>, s<sub>y</sub>)<sup>−1</sup> = diag(1/s<sub>x</sub>, 1/s<sub>y</sub>), cần s<sub>x</sub>, s<sub>y</sub> ≠ 0.</li><li>Trượt: [1 k; 0 1]<sup>−1</sup> = [1 −k; 0 1] (trượt ngược lại).</li></ul>
<div class="formula"><span class="lbl">Nghịch đảo của một tích (“tất và giày”)</span>(AB)<sup>−1</sup> = B<sup>−1</sup>A<sup>−1</sup>    — muốn hoàn tác “B rồi A” thì hoàn tác A trước, rồi hoàn tác B</div>
<p><strong>Khi nào không có nghịch đảo?</strong> Nếu A ép mặt phẳng xuống một đường thẳng (hoặc một điểm), các đầu vào khác nhau rơi vào cùng một đầu ra (hạt nhân khác {0}), nên không có cách nào biết một điểm từ đâu tới. Với ma trận vuông, các điều sau tương đương: A khả nghịch ⇔ det A ≠ 0 ⇔ Ker A = {0} ⇔ các cột span ℝ<sup>n</sup> ⇔ Ax = b có đúng một nghiệm với mọi b.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> A = [2 1; 5 3]: det = 6 − 5 = 1, nên <b>A<sup>−1</sup> = [3 −1; −5 2]</b>. Kiểm: [2 1; 5 3][3 −1; −5 2] = [6 − 5, −2 + 2; 15 − 15, −5 + 6] = I ✓.</p></div>
<div class="callout"><p><b>Ví dụ 2 — nghịch đảo không nguyên.</b> A = [4 7; 2 6]: det = 24 − 14 = 10, A<sup>−1</sup> = (1/10)[6 −7; −2 4] = [0,6 −0,7; −0,2 0,4].</p></div>
<div class="callout"><p><b>Ví dụ 3 — hoàn tác chuyển động hai bước.</b> Phần mềm sửa ảnh đã làm “trượt [1 2; 0 1], rồi quay 90°”: M = R(90°)H. Hoàn tác: M<sup>−1</sup> = H<sup>−1</sup>R(90°)<sup>−1</sup> = [1 −2; 0 1][0 1; −1 0] = <b>[2 1; −1 0]</b> — quay ngược trước, rồi trượt ngược.</p></div>
<div class="callout"><p><b>Ví dụ 4 — không có nghịch đảo.</b> [1 2; 2 4] có det 0: nó ép dẹt mặt phẳng xuống đường y = 2x (Bài 2.3). Cả (2, 0) và (0, 1) đều đi tới (2, 4) — không có đường quay lại.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>(AB)<sup>−1</sup> = A<sup>−1</sup>B<sup>−1</sup> là sai (trừ khi chúng giao hoán).</li><li>Nghịch đảo từng phần tử: nghịch đảo của [2 0; 0 4] là [1/2 0; 0 1/4], nhưng nghịch đảo của [1 2; 3 4] <em>không phải</em> [1 1/2; 1/3 1/4].</li><li>Trong code, tránh tính inv(A) @ b để giải Ax = b; dùng hàm giải hệ (bài sau) — nhanh hơn và chính xác hơn.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>A<sup>−1</sup> hoàn tác A; 2×2: (1/det)[d −b; −c a].</li><li>Nghịch đảo phép quay = quay ngược = chuyển vị; phản chiếu: chính nó; trượt: trượt ngược.</li><li>(AB)<sup>−1</sup> = B<sup>−1</sup>A<sup>−1</sup>.</li><li>Khả nghịch ⇔ det ≠ 0 ⇔ không bị ép dẹt.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/matrix-inverses.html" target="_blank" rel="noopener">Interactive Linear Algebra — 3.5 Ma trận nghịch đảo</a></li><li><a href="https://www.3blue1brown.com/lessons/inverse-matrices" target="_blank" rel="noopener">3Blue1Brown — Ma trận nghịch đảo, không gian cột, không gian không</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.solve.html" target="_blank" rel="noopener">NumPy — numpy.linalg.solve</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm nghịch đảo của [3 2; 4 3].</li><li>Không cần tính, cho nghịch đảo của [−1 0; 0 1] và của [1 0; −4 1].</li><li>Với t nào thì [t 2; 8 t] không khả nghịch? Khi đó phép biến đổi làm gì?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) det = 1 ⇒ [3 −2; −4 3]. 2) Một phép phản chiếu: chính nó. Một phép trượt dọc: [1 0; 4 1]. 3) det = t<sup>2</sup> − 16 = 0 ⇒ t = ±4; hai cột thành cùng phương và mặt phẳng bị ép dẹt xuống một đường thẳng.</p></div>`);

const c43 = L('mlt201-ts-4-3',
  '4.3 — Solving Ax = b: which input lands on b?|||4.3 — Giải Ax = b: đầu vào nào rơi đúng vào b?',
  'Ba cách nhìn hệ Ax = b: giao các mặt phẳng (hàng), tổ hợp cột, tìm đầu vào có ảnh là b; khử Gauss từng bước cho hệ 3×3; ba trường hợp nghiệm theo hình; numpy.linalg.solve.',
  `<span class="eyebrow">MLT201 · Chapter 4 · Lesson 4.3</span>
<h2>Solving Ax = b: which input lands on b?</h2>
<p class="lead">A linear system Ax = b asks a transformation question: <em>which input x does A send to b?</em> If A is invertible the answer is unique, x = A<sup>−1</sup>b — but in practice we find it by <strong>elimination</strong>, the algorithm every linear solver is built on.</p>
<h3>🎯 Objectives</h3>
<ul><li>Read a system in three ways: intersecting planes, combining columns, inverting a transformation.</li><li>Solve a 3×3 system by Gaussian elimination and back substitution.</li><li>Predict “one solution / none / infinitely many” from the geometry.</li><li>Solve systems with NumPy.</li></ul>
<h3>📖 Lecture</h3>
<p>Consider x + 2y + z = 1, 2x + 5y + z = −1, x + 3y + 3z = 4, i.e. A = [1 2 1; 2 5 1; 1 3 3], b = (1, −1, 4).</p>
<ul><li><strong>Row picture:</strong> each equation is a plane in ℝ<sup>3</sup>; the solution is where the three planes meet.</li><li><strong>Column picture:</strong> find weights x, y, z with x(1, 2, 1) + y(2, 5, 3) + z(1, 1, 3) = b.</li><li><strong>Transformation picture:</strong> find the point that A moves onto b.</li></ul>
<p><strong>Gaussian elimination</strong> subtracts multiples of one equation from another to create zeros below the diagonal (an upper-triangular system), then solves from the bottom up. Each row operation is itself multiplication by a simple invertible matrix, so the solution set never changes.</p>
<h3>✍️ Worked example — step by step</h3>
<div class="callout"><p>Augmented matrix [A | b]:  [1 2 1 | 1; 2 5 1 | −1; 1 3 3 | 4].</p>
<p>Step 1: R<sub>2</sub> ← R<sub>2</sub> − 2R<sub>1</sub> gives [0 1 −1 | −3]. R<sub>3</sub> ← R<sub>3</sub> − R<sub>1</sub> gives [0 1 2 | 3].</p>
<p>Step 2: R<sub>3</sub> ← R<sub>3</sub> − R<sub>2</sub> gives [0 0 3 | 6].</p>
<p>Back substitution: 3z = 6 ⇒ z = 2; y − z = −3 ⇒ y = −1; x + 2y + z = 1 ⇒ x = 1 + 2 − 2 = 1. <b>x = (1, −1, 2).</b></p>
<p>Check in the original first equation: 1 − 2 + 2 = 1 ✓. The pivots 1, 1, 3 are all nonzero, so A is invertible and det A = 1·1·3 = 3.</p></div>
<h3>🔺 Three possible outcomes</h3>
<ul><li><b>Exactly one solution:</b> A invertible (n pivots) — three planes through one point.</li><li><b>No solution:</b> elimination produces a row 0 = c with c ≠ 0 — e.g. two parallel planes; b is outside the column space.</li><li><b>Infinitely many:</b> a row 0 = 0 and a free variable — planes meeting along a line; the solutions are one particular solution plus anything in the kernel.</li></ul>
<h3>💻 Check it in NumPy</h3>
<pre><code class="language-python">import numpy as np
A = np.array([[1, 2, 1],
              [2, 5, 1],
              [1, 3, 3]], dtype=float)
b = np.array([1, -1, 4], dtype=float)
x = np.linalg.solve(A, b)
print(x)
print(np.allclose(A @ x, b))</code></pre>
<div class="out">[ 1. -1.  2.]
True</div>
<p><code>np.linalg.solve</code> uses elimination with row swaps (LU factorisation from LAPACK). Robotics uses the same call to find joint speeds for a desired hand velocity, and graphics to find barycentric coordinates of a point in a triangle.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Applying an operation to the left side but not to the b column.</li><li>Dividing by a zero pivot: swap rows first.</li><li>Concluding “no solution” from a row 0 = 0. That row means a free variable, not a contradiction.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Ax = b: which input lands on b? Solvable ⇔ b ∈ Col A.</li><li>Elimination → upper triangular → back substitution.</li><li>n nonzero pivots ⇔ invertible ⇔ unique solution; det = product of pivots (up to sign from swaps).</li><li>General solution = particular solution + kernel.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/systems-of-eqns.html" target="_blank" rel="noopener">Interactive Linear Algebra — 1.1 Systems of Linear Equations</a></li><li><a href="https://textbooks.math.gatech.edu/ila/row-reduction.html" target="_blank" rel="noopener">Interactive Linear Algebra — 1.2 Row Reduction</a></li><li><a href="https://en.wikipedia.org/wiki/Gaussian_elimination" target="_blank" rel="noopener">Wikipedia — Gaussian elimination</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Solve x + y = 3, 2x − y = 0 and describe the two lines.</li><li>Show that x + 2y = 1, 2x + 4y = 5 has no solution. What is the picture?</li><li>Solve x + y + z = 2, y + 2z = 3, z = 1.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Add: 3x = 3 ⇒ x = 1, y = 2; two lines crossing at (1, 2). 2) R<sub>2</sub> − 2R<sub>1</sub>: 0 = 3, impossible; two parallel lines. 3) Already triangular: z = 1, y = 1, x = 0.</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 4 · Bài 4.3</span>
<h2>Giải Ax = b: đầu vào nào rơi đúng vào b?</h2>
<p class="lead">Hệ tuyến tính Ax = b là một câu hỏi về phép biến đổi: <em>đầu vào x nào được A đưa tới b?</em> Nếu A khả nghịch thì đáp án duy nhất, x = A<sup>−1</sup>b — nhưng trong thực tế ta tìm nó bằng <strong>phép khử</strong>, thuật toán nền của mọi bộ giải tuyến tính.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Đọc một hệ theo ba cách: giao các mặt phẳng, tổ hợp các cột, đảo ngược một phép biến đổi.</li><li>Giải hệ 3×3 bằng khử Gauss và thế ngược.</li><li>Đoán “một nghiệm / vô nghiệm / vô số nghiệm” từ hình học.</li><li>Giải hệ bằng NumPy.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Xét x + 2y + z = 1, 2x + 5y + z = −1, x + 3y + 3z = 4, tức A = [1 2 1; 2 5 1; 1 3 3], b = (1, −1, 4).</p>
<ul><li><strong>Góc nhìn hàng:</strong> mỗi phương trình là một mặt phẳng trong ℝ<sup>3</sup>; nghiệm là nơi ba mặt phẳng gặp nhau.</li><li><strong>Góc nhìn cột:</strong> tìm trọng số x, y, z sao cho x(1, 2, 1) + y(2, 5, 3) + z(1, 1, 3) = b.</li><li><strong>Góc nhìn biến đổi:</strong> tìm điểm mà A dời tới b.</li></ul>
<p><strong>Khử Gauss</strong> trừ bội của phương trình này khỏi phương trình kia để tạo số 0 dưới đường chéo (hệ tam giác trên), rồi giải từ dưới lên. Mỗi phép biến đổi hàng chính là nhân với một ma trận khả nghịch đơn giản, nên tập nghiệm không bao giờ đổi.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p>Ma trận bổ sung [A | b]:  [1 2 1 | 1; 2 5 1 | −1; 1 3 3 | 4].</p>
<p>Bước 1: R<sub>2</sub> ← R<sub>2</sub> − 2R<sub>1</sub> được [0 1 −1 | −3]. R<sub>3</sub> ← R<sub>3</sub> − R<sub>1</sub> được [0 1 2 | 3].</p>
<p>Bước 2: R<sub>3</sub> ← R<sub>3</sub> − R<sub>2</sub> được [0 0 3 | 6].</p>
<p>Thế ngược: 3z = 6 ⇒ z = 2; y − z = −3 ⇒ y = −1; x + 2y + z = 1 ⇒ x = 1 + 2 − 2 = 1. <b>x = (1, −1, 2).</b></p>
<p>Thử vào phương trình đầu của hệ gốc: 1 − 2 + 2 = 1 ✓. Các phần tử trụ 1, 1, 3 đều khác 0, nên A khả nghịch và det A = 1·1·3 = 3.</p></div>
<h3>🔺 Ba khả năng</h3>
<ul><li><b>Đúng một nghiệm:</b> A khả nghịch (n trụ) — ba mặt phẳng qua một điểm.</li><li><b>Vô nghiệm:</b> phép khử sinh ra hàng 0 = c với c ≠ 0 — vd hai mặt phẳng song song; b nằm ngoài không gian cột.</li><li><b>Vô số nghiệm:</b> có hàng 0 = 0 và một biến tự do — các mặt phẳng gặp nhau theo một đường thẳng; nghiệm = một nghiệm riêng cộng mọi vector trong hạt nhân.</li></ul>
<h3>💻 Kiểm bằng NumPy</h3>
<pre><code class="language-python">import numpy as np
A = np.array([[1, 2, 1],
              [2, 5, 1],
              [1, 3, 3]], dtype=float)
b = np.array([1, -1, 4], dtype=float)
x = np.linalg.solve(A, b)
print(x)
print(np.allclose(A @ x, b))</code></pre>
<div class="out">[ 1. -1.  2.]
True</div>
<p><code>np.linalg.solve</code> dùng phép khử có đổi hàng (phân rã LU của LAPACK). Robot dùng đúng lời gọi này để tìm tốc độ khớp cho một vận tốc tay mong muốn, đồ hoạ dùng nó để tìm toạ độ trọng tâm (barycentric) của một điểm trong tam giác.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Biến đổi vế trái mà quên áp dụng cho cột b.</li><li>Chia cho phần tử trụ bằng 0: phải đổi hàng trước.</li><li>Kết luận “vô nghiệm” từ hàng 0 = 0. Hàng đó nghĩa là có biến tự do, không phải mâu thuẫn.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Ax = b: đầu vào nào rơi vào b? Có nghiệm ⇔ b ∈ Col A.</li><li>Khử → tam giác trên → thế ngược.</li><li>n trụ khác 0 ⇔ khả nghịch ⇔ nghiệm duy nhất; det = tích các trụ (đổi dấu nếu có đổi hàng).</li><li>Nghiệm tổng quát = nghiệm riêng + hạt nhân.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/systems-of-eqns.html" target="_blank" rel="noopener">Interactive Linear Algebra — 1.1 Hệ phương trình tuyến tính</a></li><li><a href="https://textbooks.math.gatech.edu/ila/row-reduction.html" target="_blank" rel="noopener">Interactive Linear Algebra — 1.2 Khử hàng</a></li><li><a href="https://en.wikipedia.org/wiki/Gaussian_elimination" target="_blank" rel="noopener">Wikipedia — Phép khử Gauss</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Giải x + y = 3, 2x − y = 0 và mô tả hai đường thẳng.</li><li>Chứng tỏ x + 2y = 1, 2x + 4y = 5 vô nghiệm. Hình ảnh là gì?</li><li>Giải x + y + z = 2, y + 2z = 3, z = 1.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Cộng lại: 3x = 3 ⇒ x = 1, y = 2; hai đường cắt nhau tại (1, 2). 2) R<sub>2</sub> − 2R<sub>1</sub>: 0 = 3, vô lý; hai đường song song. 3) Đã tam giác: z = 1, y = 1, x = 0.</p></div>`);

const q4 = QZ(4, 'Quiz — Chapter 4: Composition, inverses, systems|||Quiz — Chương 4: Hợp thành, nghịch đảo, hệ phương trình', 'Kiểm tra chương 4: thứ tự nhân khi hợp thành, AB ≠ BA, nghịch đảo hình học, (AB)⁻¹, khử Gauss, ba trường hợp nghiệm.', [
  Q('q1', "The matrix of “apply A, then apply B” is|||Ma trận của “làm A, rồi làm B” là",
    ['AB|||AB', 'BA|||BA', 'A + B|||A + B', 'AᵀB|||AᵀB'], 1,
    "B(Ax) = (BA)x — the first step is on the right.|||B(Ax) = (BA)x — bước đầu tiên đứng bên phải."),
  Q('q2', "With A = [0 −1; 1 0] and B = [1 1; 0 1], BA equals|||Với A = [0 −1; 1 0] và B = [1 1; 0 1], BA bằng",
    ['[1 −1; 1 0]|||[1 −1; 1 0]', '[0 −1; 1 1]|||[0 −1; 1 1]', '[1 1; 1 0]|||[1 1; 1 0]', '[0 1; −1 1]|||[0 1; −1 1]'], 0,
    "Columns: B(0, 1) = (1, 1), B(−1, 0) = (−1, 0).|||Các cột: B(0, 1) = (1, 1), B(−1, 0) = (−1, 0)."),
  Q('q3', "R(30°)R(60°) equals|||R(30°)R(60°) bằng",
    ['R(90°)|||R(90°)', 'R(1800°)|||R(1800°)', 'R(30°)|||R(30°)', 'I|||I'], 0,
    "Rotations add their angles.|||Các phép quay cộng góc với nhau."),
  Q('q4', "Reflecting across the x-axis and then across y = x gives|||Phản chiếu qua trục x rồi qua đường y = x cho",
    ['a reflection|||một phép phản chiếu', 'rotation by 90°|||phép quay 90°', 'rotation by 45°|||phép quay 45°', 'the identity|||phép đồng nhất'], 1,
    "Rotation by 2(45° − 0°) = 90°; det = (−1)(−1) = 1.|||Phép quay góc 2(45° − 0°) = 90°; det = (−1)(−1) = 1."),
  Q('q5', "The inverse of [2 1; 5 3] is|||Nghịch đảo của [2 1; 5 3] là",
    ['[3 −1; −5 2]|||[3 −1; −5 2]', '[3 1; 5 2]|||[3 1; 5 2]', '[−3 1; 5 −2]|||[−3 1; 5 −2]', '[1/2 1; 1/5 1/3]|||[1/2 1; 1/5 1/3]'], 0,
    "det = 1; swap diagonal, negate off-diagonal.|||det = 1; đổi chỗ đường chéo chính, đổi dấu đường chéo phụ."),
  Q('q6', "(AB)⁻¹ equals|||(AB)⁻¹ bằng",
    ['A⁻¹B⁻¹|||A⁻¹B⁻¹', 'B⁻¹A⁻¹|||B⁻¹A⁻¹', 'AB|||AB', '(BA)⁻¹ always|||luôn bằng (BA)⁻¹'], 1,
    "Undo the last step first (socks and shoes).|||Hoàn tác bước cuối trước (tất và giày)."),
  Q('q7', "The inverse of the shear [1 3; 0 1] is|||Nghịch đảo của phép trượt [1 3; 0 1] là",
    ['[1 −3; 0 1]|||[1 −3; 0 1]', '[1 0; 3 1]|||[1 0; 3 1]', '[1 1/3; 0 1]|||[1 1/3; 0 1]', 'it has none|||không có'], 0,
    "Slide back by the same amount.|||Trượt ngược lại đúng bấy nhiêu."),
  Q('q8', "During elimination you obtain the row [0 0 0 | 5]. The system|||Khi khử bạn được hàng [0 0 0 | 5]. Hệ",
    ['has a unique solution|||có nghiệm duy nhất', 'has infinitely many solutions|||có vô số nghiệm', 'has no solution|||vô nghiệm', 'needs more information|||cần thêm thông tin'], 2,
    "It says 0 = 5: b is not in the column space.|||Hàng đó nói 0 = 5: b không thuộc không gian cột."),
  Q('q9', "Elimination on A = [1 2 1; 2 5 1; 1 3 3] gives pivots 1, 1, 3 without row swaps. det A is|||Khử A = [1 2 1; 2 5 1; 1 3 3] được các trụ 1, 1, 3, không đổi hàng. det A bằng",
    ['5|||5', '3|||3', '0|||0', '−3|||−3'], 1,
    "det = product of pivots = 3.|||det = tích các trụ = 3."),
]);

const ch4 = {
  title: 'Chapter 4 — Composition, inverses and solving Ax = b|||Chương 4 — Hợp thành, nghịch đảo và giải Ax = b',
  description: 'Nhân ma trận là hợp thành, thứ tự phải sang trái, AB ≠ BA; nghịch đảo hình học và (AB)⁻¹ = B⁻¹A⁻¹; khử Gauss, ba trường hợp nghiệm, numpy.linalg.solve (Lay 1.1–1.2, 2.1–2.3 · ILA 1.1–1.2, 3.4–3.5).',
  lessons: [c41, c42, c43, q4],
};

// ───────────────────────────── Chương 5 ─────────────────────────────
const c51 = L('mlt201-ts-5-1',
  '5.1 — The 2×2 determinant: signed area scale factor|||5.1 — Định thức 2×2: hệ số diện tích có dấu',
  'det [a b; c d] = ad − bc là diện tích có dấu của hình bình hành dựng trên hai cột; mọi hình có diện tích nhân với |det|; dấu âm = lật hướng; det = 0 = ép dẹt; diện tích tam giác.',
  `<span class="eyebrow">MLT201 · Chapter 5 · Lesson 5.1</span>
<h2>The 2×2 determinant: signed area scale factor</h2>
<p class="lead">The determinant answers one geometric question: <strong>by what factor does the transformation multiply areas?</strong> Its sign tells you whether the plane has been flipped over.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute det A = ad − bc and read it as the signed area of the image of the unit square.</li><li>Use |det A| to find the area of any transformed region.</li><li>Interpret negative and zero determinants.</li><li>Find the area of a triangle or parallelogram from its edge vectors.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">2×2 determinant</span>det [a b; c d] = ad − bc<br>= signed area of the parallelogram with sides (a, c) and (b, d)  (the columns)</div>
<p>Why does one number describe every area? A linear map turns the unit square into a parallelogram of area |det A|. Any region can be approximated by tiny squares of the grid, and every tiny square is scaled by the <em>same</em> factor (the grid stays parallel and evenly spaced). So:</p>
<div class="formula"><span class="lbl">Area rule</span>area(T(R)) = |det A| · area(R)    for every region R</div>
<p><strong>The sign = orientation.</strong> If going from column 1 to column 2 is a counter-clockwise turn (like e<sub>1</sub> to e<sub>2</sub>), det &gt; 0. If it is clockwise, the map has flipped the plane like a mirror and det &lt; 0. Rotations: det = 1. Reflections: det = −1. Shears: det = 1. Scaling diag(s<sub>x</sub>, s<sub>y</sub>): det = s<sub>x</sub>s<sub>y</sub>.</p>
<p><strong>Zero determinant</strong> = the parallelogram is flat: the columns are parallel and the whole plane is squashed onto a line or a point. That is exactly the non-invertible case (Lesson 4.2).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> A = [3 1; 1 2]: det = 6 − 1 = <b>5</b>. The unit square becomes a parallelogram of area 5; a circle of radius 1 (area π) becomes an ellipse of area 5π.</p></div>
<div class="callout"><p><b>Example 2 — area of a triangle.</b> Vertices P(1, 1), Q(4, 2), R(2, 5). Edge vectors from P: Q − P = (3, 1), R − P = (1, 4). Parallelogram area = |det [3 1; 1 4]| = |12 − 1| = 11, so <b>triangle area = 11/2 = 5.5</b>.</p></div>
<div class="callout"><p><b>Example 3 — orientation.</b> det [0 1; 1 0] = −1: the reflection across y = x keeps areas but swaps the order e<sub>1</sub> → e<sub>2</sub>. A triangle listed counter-clockwise comes out clockwise — which is why 3D engines must flip the “winding order” of triangles when they mirror a model, or the faces disappear (back-face culling).</p></div>
<div class="callout"><p><b>Example 4 — zero.</b> det [1 2; 2 4] = 4 − 4 = 0: both columns lie on y = 2x; the unit square is squashed to a segment of area 0.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Computing ad + bc or ab − cd. It is (main diagonal) − (other diagonal): ad − bc.</li><li>Forgetting the absolute value when you want an actual area.</li><li>Triangle area is <em>half</em> the parallelogram.</li><li>det(A + B) ≠ det A + det B in general.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>det [a b; c d] = ad − bc = signed area of the parallelogram of the columns.</li><li>Every area is multiplied by |det A|.</li><li>det &lt; 0 ⇔ orientation reversed; det = 0 ⇔ flattened, not invertible.</li><li>Triangle with edge vectors u, v: area = ½|det [u v]|.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/determinant" target="_blank" rel="noopener">3Blue1Brown — The determinant</a></li><li><a href="https://textbooks.math.gatech.edu/ila/determinants-volumes.html" target="_blank" rel="noopener">Interactive Linear Algebra — 4.3 Determinants and Volumes</a></li><li><a href="https://en.wikipedia.org/wiki/Determinant" target="_blank" rel="noopener">Wikipedia — Determinant</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find det [5 −2; 3 1] and the area of the image of a 2×3 rectangle.</li><li>Area of the triangle with vertices (0, 0), (4, 1), (1, 3).</li><li>For which k does [k 3; 2 k − 1] flip orientation? Test k = 0.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) det = 5 + 6 = 11; image area = 11 × 6 = 66. 2) ½|4·3 − 1·1| = 11/2 = 5.5. 3) det = k(k − 1) − 6 = k<sup>2</sup> − k − 6 = (k − 3)(k + 2) &lt; 0 for −2 &lt; k &lt; 3; at k = 0 det = −6, flipped.</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 5 · Bài 5.1</span>
<h2>Định thức 2×2: hệ số diện tích có dấu</h2>
<p class="lead">Định thức trả lời một câu hỏi hình học: <strong>phép biến đổi nhân diện tích lên bao nhiêu lần?</strong> Dấu của nó cho biết mặt phẳng có bị lật ngược hay không.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính det A = ad − bc và hiểu nó là diện tích có dấu của ảnh hình vuông đơn vị.</li><li>Dùng |det A| tìm diện tích của bất kỳ miền nào sau biến đổi.</li><li>Giải thích định thức âm và định thức bằng 0.</li><li>Tính diện tích tam giác, hình bình hành từ các vector cạnh.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Định thức 2×2</span>det [a b; c d] = ad − bc<br>= diện tích có dấu của hình bình hành có cạnh (a, c) và (b, d)  (hai cột)</div>
<p>Vì sao một con số mô tả được mọi diện tích? Ánh xạ tuyến tính biến hình vuông đơn vị thành hình bình hành diện tích |det A|. Mọi miền đều xấp xỉ được bằng các ô vuông nhỏ của lưới, và mọi ô nhỏ đều bị nhân với <em>cùng</em> một hệ số (lưới vẫn song song, cách đều). Nên:</p>
<div class="formula"><span class="lbl">Quy tắc diện tích</span>diện tích(T(R)) = |det A| · diện tích(R)    với mọi miền R</div>
<p><strong>Dấu = hướng.</strong> Nếu đi từ cột 1 sang cột 2 là quay ngược chiều kim đồng hồ (như từ e<sub>1</sub> sang e<sub>2</sub>) thì det &gt; 0. Nếu cùng chiều kim đồng hồ, phép biến đổi đã lật mặt phẳng như soi gương và det &lt; 0. Phép quay: det = 1. Phản chiếu: det = −1. Trượt: det = 1. Co giãn diag(s<sub>x</sub>, s<sub>y</sub>): det = s<sub>x</sub>s<sub>y</sub>.</p>
<p><strong>Định thức bằng 0</strong> = hình bình hành bị dẹt: hai cột cùng phương và cả mặt phẳng bị ép xuống một đường hoặc một điểm. Đó đúng là trường hợp không khả nghịch (Bài 4.2).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> A = [3 1; 1 2]: det = 6 − 1 = <b>5</b>. Hình vuông đơn vị thành hình bình hành diện tích 5; đường tròn bán kính 1 (diện tích π) thành elip diện tích 5π.</p></div>
<div class="callout"><p><b>Ví dụ 2 — diện tích tam giác.</b> Đỉnh P(1, 1), Q(4, 2), R(2, 5). Vector cạnh từ P: Q − P = (3, 1), R − P = (1, 4). Diện tích hình bình hành = |det [3 1; 1 4]| = |12 − 1| = 11, nên <b>diện tích tam giác = 11/2 = 5,5</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — hướng.</b> det [0 1; 1 0] = −1: phản chiếu qua y = x giữ diện tích nhưng đảo thứ tự e<sub>1</sub> → e<sub>2</sub>. Một tam giác liệt kê ngược chiều kim đồng hồ sẽ thành cùng chiều — vì thế engine 3D phải đảo “thứ tự cuộn” (winding order) của tam giác khi lật gương một mô hình, nếu không các mặt sẽ biến mất (back-face culling).</p></div>
<div class="callout"><p><b>Ví dụ 4 — bằng 0.</b> det [1 2; 2 4] = 4 − 4 = 0: hai cột cùng nằm trên y = 2x; hình vuông đơn vị bị ép thành một đoạn thẳng diện tích 0.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tính ad + bc hoặc ab − cd. Đúng là (đường chéo chính) − (đường chéo phụ): ad − bc.</li><li>Quên lấy giá trị tuyệt đối khi cần diện tích thật.</li><li>Diện tích tam giác bằng <em>một nửa</em> hình bình hành.</li><li>Nói chung det(A + B) ≠ det A + det B.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>det [a b; c d] = ad − bc = diện tích có dấu của hình bình hành dựng trên các cột.</li><li>Mọi diện tích bị nhân với |det A|.</li><li>det &lt; 0 ⇔ đảo hướng; det = 0 ⇔ bị ép dẹt, không khả nghịch.</li><li>Tam giác có vector cạnh u, v: diện tích = ½|det [u v]|.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/determinant" target="_blank" rel="noopener">3Blue1Brown — Định thức</a></li><li><a href="https://textbooks.math.gatech.edu/ila/determinants-volumes.html" target="_blank" rel="noopener">Interactive Linear Algebra — 4.3 Định thức và thể tích</a></li><li><a href="https://en.wikipedia.org/wiki/Determinant" target="_blank" rel="noopener">Wikipedia — Định thức</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tính det [5 −2; 3 1] và diện tích ảnh của một hình chữ nhật 2×3.</li><li>Diện tích tam giác đỉnh (0, 0), (4, 1), (1, 3).</li><li>Với k nào thì [k 3; 2 k − 1] đảo hướng? Thử k = 0.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) det = 5 + 6 = 11; diện tích ảnh = 11 × 6 = 66. 2) ½|4·3 − 1·1| = 11/2 = 5,5. 3) det = k(k − 1) − 6 = k<sup>2</sup> − k − 6 = (k − 3)(k + 2) &lt; 0 khi −2 &lt; k &lt; 3; tại k = 0, det = −6, bị lật.</p></div>`);

const c52 = L('mlt201-ts-5-2',
  '5.2 — 3×3 determinants, volume and the rules of det|||5.2 — Định thức 3×3, thể tích và các quy tắc của det',
  'Khai triển theo hàng (phần bù đại số); |det| = thể tích hình hộp dựng trên ba cột; tích hỗn tạp u·(v×w); det(AB) = det A·det B, det Aᵀ, đổi hàng, ma trận tam giác; code NumPy.',
  `<span class="eyebrow">MLT201 · Chapter 5 · Lesson 5.2</span>
<h2>3×3 determinants, volume and the rules of det</h2>
<p class="lead">In 3D the determinant is the factor by which <strong>volumes</strong> change: |det A| is the volume of the box (parallelepiped) spanned by the three columns. Its algebraic rules all have geometric reasons.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute a 3×3 determinant by cofactor expansion.</li><li>Interpret it as the signed volume of a parallelepiped and as the triple product.</li><li>Use the rules: product, transpose, row operations, triangular matrices.</li><li>Check determinants in NumPy.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Cofactor expansion along row 1</span>det [a b c; d e f; g h i] = a(ei − fh) − b(di − fg) + c(dh − eg)<br>(signs alternate + − +; each 2×2 block deletes the row and column of the entry)</div>
<p>Geometrically, with columns u, v, w: det A = u · (v × w), the <strong>scalar triple product</strong>. v × w is perpendicular to the base parallelogram with length equal to its area; dotting with u multiplies by the height. Positive det means u, v, w form a right-handed system (like x, y, z).</p>
<div class="formula"><span class="lbl">Rules (all n×n)</span>det(AB) = det A · det B    det(A<sup>T</sup>) = det A    det(A<sup>−1</sup>) = 1/det A<br>det(cA) = c<sup>n</sup> det A    swapping two rows flips the sign    adding a multiple of one row to another: no change<br>triangular matrix: det = product of the diagonal entries</div>
<p>The product rule is pure geometry: doing B multiplies volumes by det B, then A multiplies them by det A. And det(cA) = c<sup>n</sup> det A because scaling a 3D box by c in every direction multiplies volume by c<sup>3</sup>.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> A = [2 1 0; 0 3 1; 1 0 1]. Expand along row 1: 2(3·1 − 1·0) − 1(0·1 − 1·1) + 0 = 6 + 1 = <b>7</b>. The box spanned by (2, 0, 1), (1, 3, 0), (0, 1, 1) has volume 7.</p></div>
<div class="callout"><p><b>Example 2 — use elimination instead.</b> B = [1 2 3; 0 4 5; 1 0 6]. R<sub>3</sub> ← R<sub>3</sub> − R<sub>1</sub>: [0 −2 3]. R<sub>3</sub> ← R<sub>3</sub> + ½R<sub>2</sub>: [0 0 5.5]. Triangular: det = 1·4·5.5 = <b>22</b>. (Row additions do not change det.)</p></div>
<div class="callout"><p><b>Example 3 — product rule.</b> det(AB) = 7 · 22 = 154 without multiplying the matrices.</p></div>
<h3>💻 Check it in NumPy</h3>
<pre><code class="language-python">import numpy as np
A = np.array([[2, 1, 0], [0, 3, 1], [1, 0, 1]])
B = np.array([[1, 2, 3], [0, 4, 5], [1, 0, 6]])
print(round(np.linalg.det(A), 6), round(np.linalg.det(B), 6))
print(round(np.linalg.det(A @ B), 6))      # = det(A) * det(B)
u, v, w = A[:, 0], A[:, 1], A[:, 2]
print(np.dot(u, np.cross(v, w)))           # triple product = det(A)</code></pre>
<div class="out">7.0 22.0
154.0
7</div>
<p><code>np.linalg.det</code> works by elimination (LU), not by cofactors: cofactor expansion of an n×n matrix costs about n! operations, elimination about n<sup>3</sup>. We round because floating-point results are like 6.999999999999999.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the minus sign on the middle term of the expansion.</li><li>det(2A) = 2 det A for a 3×3 matrix — wrong, it is 8 det A.</li><li>Scaling a row by c multiplies det by c; dividing a row to make a pivot 1 must be undone in the bookkeeping.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>3×3: expand along a row/column with signs + − +, or eliminate to triangular form.</li><li>|det A| = volume of the box of the columns; det = u · (v × w).</li><li>det(AB) = det A det B; det A<sup>T</sup> = det A; det(cA) = c<sup>n</sup> det A.</li><li>Row swap: sign flips; row addition: unchanged.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/determinants-cofactors.html" target="_blank" rel="noopener">Interactive Linear Algebra — 4.2 Cofactor Expansions</a></li><li><a href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/resources/lecture-18-properties-of-determinants/" target="_blank" rel="noopener">MIT 18.06SC — Lecture 18: Properties of Determinants</a></li><li><a href="https://www.3blue1brown.com/lessons/cross-products" target="_blank" rel="noopener">3Blue1Brown — Cross products</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.det.html" target="_blank" rel="noopener">NumPy — numpy.linalg.det</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Compute det [1 0 2; 3 1 0; 0 2 1].</li><li>If det A = 4 for a 3×3 matrix, find det(3A), det(A<sup>−1</sup>) and det(A<sup>2</sup>A<sup>T</sup>).</li><li>Are (1, 1, 0), (0, 1, 1), (1, 2, 1) coplanar?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 1(1 − 0) − 0 + 2(6 − 0) = 13. 2) 27·4 = 108; 1/4; 4·4·4 = 64. 3) det of the columns = 1(1 − 2) − 0 + 1(1 − 0) = 0: yes, coplanar (third = first + second).</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 5 · Bài 5.2</span>
<h2>Định thức 3×3, thể tích và các quy tắc của det</h2>
<p class="lead">Trong 3D, định thức là hệ số thay đổi <strong>thể tích</strong>: |det A| là thể tích hình hộp (hình hộp xiên) dựng trên ba cột. Mọi quy tắc đại số của nó đều có lý do hình học.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính định thức 3×3 bằng khai triển phần bù đại số.</li><li>Hiểu nó là thể tích có dấu của hình hộp và là tích hỗn tạp.</li><li>Dùng các quy tắc: tích, chuyển vị, biến đổi hàng, ma trận tam giác.</li><li>Kiểm định thức bằng NumPy.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Khai triển theo hàng 1</span>det [a b c; d e f; g h i] = a(ei − fh) − b(di − fg) + c(dh − eg)<br>(dấu xen kẽ + − +; mỗi khối 2×2 bỏ đi hàng và cột của phần tử)</div>
<p>Về hình học, với các cột u, v, w: det A = u · (v × w), <strong>tích hỗn tạp</strong>. v × w vuông góc với hình bình hành đáy, độ dài bằng diện tích đáy; nhân vô hướng với u là nhân thêm chiều cao. det dương nghĩa là u, v, w tạo hệ thuận tay phải (như x, y, z).</p>
<div class="formula"><span class="lbl">Quy tắc (mọi ma trận n×n)</span>det(AB) = det A · det B    det(A<sup>T</sup>) = det A    det(A<sup>−1</sup>) = 1/det A<br>det(cA) = c<sup>n</sup> det A    đổi chỗ hai hàng thì đổi dấu    cộng bội của hàng này vào hàng kia: không đổi<br>ma trận tam giác: det = tích các phần tử đường chéo</div>
<p>Quy tắc tích là hình học thuần tuý: làm B nhân thể tích với det B, rồi A nhân tiếp với det A. Và det(cA) = c<sup>n</sup> det A vì phóng một hình hộp 3D c lần theo mọi hướng thì thể tích nhân c<sup>3</sup>.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> A = [2 1 0; 0 3 1; 1 0 1]. Khai triển theo hàng 1: 2(3·1 − 1·0) − 1(0·1 − 1·1) + 0 = 6 + 1 = <b>7</b>. Hình hộp dựng trên (2, 0, 1), (1, 3, 0), (0, 1, 1) có thể tích 7.</p></div>
<div class="callout"><p><b>Ví dụ 2 — dùng phép khử.</b> B = [1 2 3; 0 4 5; 1 0 6]. R<sub>3</sub> ← R<sub>3</sub> − R<sub>1</sub>: [0 −2 3]. R<sub>3</sub> ← R<sub>3</sub> + ½R<sub>2</sub>: [0 0 5,5]. Tam giác: det = 1·4·5,5 = <b>22</b>. (Cộng hàng không đổi det.)</p></div>
<div class="callout"><p><b>Ví dụ 3 — quy tắc tích.</b> det(AB) = 7 · 22 = 154 mà không cần nhân hai ma trận.</p></div>
<h3>💻 Kiểm bằng NumPy</h3>
<pre><code class="language-python">import numpy as np
A = np.array([[2, 1, 0], [0, 3, 1], [1, 0, 1]])
B = np.array([[1, 2, 3], [0, 4, 5], [1, 0, 6]])
print(round(np.linalg.det(A), 6), round(np.linalg.det(B), 6))
print(round(np.linalg.det(A @ B), 6))      # = det(A) * det(B)
u, v, w = A[:, 0], A[:, 1], A[:, 2]
print(np.dot(u, np.cross(v, w)))           # triple product = det(A)</code></pre>
<div class="out">7.0 22.0
154.0
7</div>
<p><code>np.linalg.det</code> tính bằng phép khử (LU), không bằng phần bù: khai triển phần bù cho ma trận n×n tốn cỡ n! phép tính, phép khử chỉ cỡ n<sup>3</sup>. Ta làm tròn vì kết quả dấu phẩy động thường kiểu 6.999999999999999.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên dấu trừ ở số hạng giữa của khai triển.</li><li>det(2A) = 2 det A với ma trận 3×3 — sai, đúng là 8 det A.</li><li>Nhân một hàng với c thì det nhân c; chia một hàng để trụ bằng 1 thì phải ghi lại để bù.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>3×3: khai triển theo hàng/cột với dấu + − +, hoặc khử về tam giác.</li><li>|det A| = thể tích hình hộp dựng trên các cột; det = u · (v × w).</li><li>det(AB) = det A det B; det A<sup>T</sup> = det A; det(cA) = c<sup>n</sup> det A.</li><li>Đổi hàng: đổi dấu; cộng hàng: không đổi.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/determinants-cofactors.html" target="_blank" rel="noopener">Interactive Linear Algebra — 4.2 Khai triển phần bù đại số</a></li><li><a href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/resources/lecture-18-properties-of-determinants/" target="_blank" rel="noopener">MIT 18.06SC — Bài 18: Tính chất của định thức</a></li><li><a href="https://www.3blue1brown.com/lessons/cross-products" target="_blank" rel="noopener">3Blue1Brown — Tích có hướng</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.det.html" target="_blank" rel="noopener">NumPy — numpy.linalg.det</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tính det [1 0 2; 3 1 0; 0 2 1].</li><li>Nếu det A = 4 với A là 3×3, tìm det(3A), det(A<sup>−1</sup>) và det(A<sup>2</sup>A<sup>T</sup>).</li><li>Ba vector (1, 1, 0), (0, 1, 1), (1, 2, 1) có đồng phẳng không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 1(1 − 0) − 0 + 2(6 − 0) = 13. 2) 27·4 = 108; 1/4; 4·4·4 = 64. 3) det của các cột = 1(1 − 2) − 0 + 1(1 − 0) = 0: có, đồng phẳng (vector ba = vector một + vector hai).</p></div>`);

const c53 = L('mlt201-ts-5-3',
  '5.3 — Determinants at work: polygon areas, Jacobians, Cramer|||5.3 — Định thức trong ứng dụng: diện tích đa giác, Jacobian, Cramer',
  'Công thức dây giày (shoelace) tính diện tích đa giác từ toạ độ đỉnh; diện tích elip πab; Jacobian và đổi biến toạ độ cực (dx dy = r dr dθ); quy tắc Cramer 2×2; kiểm điểm nằm trái/phải một đoạn thẳng.',
  `<span class="eyebrow">MLT201 · Chapter 5 · Lesson 5.3</span>
<h2>Determinants at work</h2>
<p class="lead">Because the determinant measures area and orientation, it appears all over computational geometry, graphics and calculus. Here are four tools you will actually use.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute the area of any simple polygon from its vertex coordinates (shoelace formula).</li><li>Use the area rule to find areas of images (ellipse = stretched circle).</li><li>Understand the Jacobian determinant as a local area factor (polar coordinates).</li><li>Use the orientation test and Cramer's rule for small systems.</li></ul>
<h3>📖 Lecture</h3>
<p><b>1. Shoelace formula.</b> Cut a polygon with vertices (x<sub>1</sub>, y<sub>1</sub>), …, (x<sub>n</sub>, y<sub>n</sub>) (in order) into triangles from the origin. Each triangle has signed area ½ det [x<sub>i</sub> x<sub>i+1</sub>; y<sub>i</sub> y<sub>i+1</sub>]. Adding them gives</p>
<div class="formula"><span class="lbl">Shoelace formula</span>Area = ½ | Σ (x<sub>i</sub>y<sub>i+1</sub> − x<sub>i+1</sub>y<sub>i</sub>) |    (indices wrap around: vertex n+1 = vertex 1)</div>
<p>The sign of the sum tells you whether the vertices are listed counter-clockwise (+) or clockwise (−) — GIS software and game engines use this to fix polygon orientation.</p>
<p><b>2. Orientation test.</b> For points A, B, P, the sign of det [B − A  P − A] says whether P is to the left (+), right (−) or on the line AB (0). Convex-hull algorithms and “is the point inside the triangle?” tests are built from it.</p>
<p><b>3. Jacobian.</b> A <em>nonlinear</em> map looks linear when you zoom in. Its local matrix of partial derivatives is the Jacobian J, and |det J| is the local area factor. For polar coordinates x = r cos θ, y = r sin θ: J = [cos θ −r sin θ; sin θ r cos θ], det J = r. That is why dx dy = r dr dθ in double integrals (you will use it in probability and Calculus II).</p>
<p><b>4. Cramer's rule (2×2).</b> For ax + by = e, cx + dy = f with D = ad − bc ≠ 0: x = (ed − bf)/D, y = (af − ec)/D — replace one column of the matrix by the right-hand side. Handy for 2×2 by hand; for larger systems use elimination.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — shoelace.</b> Quadrilateral (0, 0), (4, 0), (5, 3), (1, 4) (counter-clockwise).</p><p>Terms x<sub>i</sub>y<sub>i+1</sub> − x<sub>i+1</sub>y<sub>i</sub>: 0·0 − 4·0 = 0; 4·3 − 5·0 = 12; 5·4 − 1·3 = 17; 1·0 − 0·4 = 0. Sum 29 &gt; 0 (counter-clockwise). <b>Area = 29/2 = 14.5</b>.</p></div>
<div class="callout"><p><b>Example 2 — ellipse area.</b> The ellipse x<sup>2</sup>/a<sup>2</sup> + y<sup>2</sup>/b<sup>2</sup> = 1 is the image of the unit circle under diag(a, b). Area = |det| · π = <b>πab</b>. No integral needed.</p></div>
<div class="callout"><p><b>Example 3 — left or right?</b> A = (0, 0), B = (4, 0), P = (1, 2): det [4 1; 0 2] = 8 &gt; 0, so P is to the <b>left</b> of the direction A → B (above the x-axis) ✓.</p></div>
<div class="callout"><p><b>Example 4 — Cramer.</b> 2x + y = 5, x − 3y = −1: D = −6 − 1 = −7. x = (5·(−3) − 1·(−1))/(−7) = (−14)/(−7) = 2; y = (2·(−1) − 5·1)/(−7) = 1. <b>(2, 1)</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Shoelace: vertices must be in order around the boundary (not shuffled), and you must close the loop with the last-to-first term.</li><li>Shoelace fails for self-intersecting polygons (like a bow-tie).</li><li>Cramer when D = 0: the rule does not apply (no unique solution).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Polygon area = ½|Σ(x<sub>i</sub>y<sub>i+1</sub> − x<sub>i+1</sub>y<sub>i</sub>)|; sign gives orientation.</li><li>Sign of det [B − A  P − A]: left/right of a line.</li><li>Image area = |det| × original area (ellipse πab).</li><li>Jacobian determinant = local area factor; polar: r.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Shoelace_formula" target="_blank" rel="noopener">Wikipedia — Shoelace formula</a></li><li><a href="https://en.wikipedia.org/wiki/Jacobian_matrix_and_determinant" target="_blank" rel="noopener">Wikipedia — Jacobian matrix and determinant</a></li><li><a href="https://textbooks.math.gatech.edu/ila/determinants-definitions-properties.html" target="_blank" rel="noopener">Interactive Linear Algebra — 4.1 Determinants: Definition</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Area of the triangle (1, 1), (4, 2), (2, 5) by the shoelace formula (compare Lesson 5.1).</li><li>The map (x, y) ↦ (2x + y, x + 3y) is applied to a disc of radius 2. Area of the image?</li><li>Solve 3x + 2y = 7, x + 4y = 9 by Cramer's rule.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (1·2 − 4·1) + (4·5 − 2·2) + (2·1 − 1·5) = −2 + 16 − 3 = 11 ⇒ area 5.5 ✓. 2) det = 6 − 1 = 5; disc area 4π ⇒ 20π. 3) D = 12 − 2 = 10; x = (7·4 − 2·9)/10 = 1; y = (3·9 − 7·1)/10 = 2.</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 5 · Bài 5.3</span>
<h2>Định thức trong ứng dụng</h2>
<p class="lead">Vì định thức đo diện tích và hướng, nó xuất hiện khắp hình học tính toán, đồ hoạ và giải tích. Dưới đây là bốn công cụ bạn sẽ thật sự dùng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính diện tích một đa giác đơn bất kỳ từ toạ độ đỉnh (công thức dây giày).</li><li>Dùng quy tắc diện tích để tìm diện tích ảnh (elip = đường tròn bị kéo giãn).</li><li>Hiểu định thức Jacobian là hệ số diện tích cục bộ (toạ độ cực).</li><li>Dùng phép thử hướng và quy tắc Cramer cho hệ nhỏ.</li></ul>
<h3>📖 Bài giảng</h3>
<p><b>1. Công thức dây giày.</b> Cắt đa giác có các đỉnh (x<sub>1</sub>, y<sub>1</sub>), …, (x<sub>n</sub>, y<sub>n</sub>) (theo thứ tự) thành các tam giác chung đỉnh gốc toạ độ. Mỗi tam giác có diện tích có dấu ½ det [x<sub>i</sub> x<sub>i+1</sub>; y<sub>i</sub> y<sub>i+1</sub>]. Cộng lại được</p>
<div class="formula"><span class="lbl">Công thức dây giày</span>Diện tích = ½ | Σ (x<sub>i</sub>y<sub>i+1</sub> − x<sub>i+1</sub>y<sub>i</sub>) |    (chỉ số quay vòng: đỉnh n+1 = đỉnh 1)</div>
<p>Dấu của tổng cho biết các đỉnh liệt kê ngược chiều kim đồng hồ (+) hay cùng chiều (−) — phần mềm GIS và engine game dùng điều này để chuẩn hoá hướng đa giác.</p>
<p><b>2. Phép thử hướng.</b> Với các điểm A, B, P, dấu của det [B − A  P − A] cho biết P nằm bên trái (+), bên phải (−) hay trên đường AB (0). Thuật toán bao lồi và phép thử “điểm có trong tam giác không?” đều dựng từ đó.</p>
<p><b>3. Jacobian.</b> Một ánh xạ <em>phi tuyến</em> trông như tuyến tính khi phóng to. Ma trận các đạo hàm riêng cục bộ của nó là Jacobian J, và |det J| là hệ số diện tích cục bộ. Với toạ độ cực x = r cos θ, y = r sin θ: J = [cos θ −r sin θ; sin θ r cos θ], det J = r. Vì thế dx dy = r dr dθ trong tích phân kép (bạn sẽ dùng trong xác suất và Giải tích II).</p>
<p><b>4. Quy tắc Cramer (2×2).</b> Với ax + by = e, cx + dy = f và D = ad − bc ≠ 0: x = (ed − bf)/D, y = (af − ec)/D — thay một cột của ma trận bằng vế phải. Tiện khi làm tay hệ 2×2; hệ lớn hơn thì dùng phép khử.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — dây giày.</b> Tứ giác (0, 0), (4, 0), (5, 3), (1, 4) (ngược chiều kim đồng hồ).</p><p>Các số hạng x<sub>i</sub>y<sub>i+1</sub> − x<sub>i+1</sub>y<sub>i</sub>: 0·0 − 4·0 = 0; 4·3 − 5·0 = 12; 5·4 − 1·3 = 17; 1·0 − 0·4 = 0. Tổng 29 &gt; 0 (ngược chiều kim đồng hồ). <b>Diện tích = 29/2 = 14,5</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — diện tích elip.</b> Elip x<sup>2</sup>/a<sup>2</sup> + y<sup>2</sup>/b<sup>2</sup> = 1 là ảnh của đường tròn đơn vị qua diag(a, b). Diện tích = |det| · π = <b>πab</b>. Không cần tích phân.</p></div>
<div class="callout"><p><b>Ví dụ 3 — trái hay phải?</b> A = (0, 0), B = (4, 0), P = (1, 2): det [4 1; 0 2] = 8 &gt; 0, nên P nằm bên <b>trái</b> hướng A → B (phía trên trục x) ✓.</p></div>
<div class="callout"><p><b>Ví dụ 4 — Cramer.</b> 2x + y = 5, x − 3y = −1: D = −6 − 1 = −7. x = (5·(−3) − 1·(−1))/(−7) = (−14)/(−7) = 2; y = (2·(−1) − 5·1)/(−7) = 1. <b>(2, 1)</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dây giày: các đỉnh phải theo thứ tự quanh biên (không xáo trộn), và phải khép vòng bằng số hạng đỉnh cuối – đỉnh đầu.</li><li>Dây giày sai với đa giác tự cắt (như hình nơ).</li><li>Dùng Cramer khi D = 0: quy tắc không áp dụng được (không có nghiệm duy nhất).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Diện tích đa giác = ½|Σ(x<sub>i</sub>y<sub>i+1</sub> − x<sub>i+1</sub>y<sub>i</sub>)|; dấu cho hướng.</li><li>Dấu của det [B − A  P − A]: trái/phải một đường thẳng.</li><li>Diện tích ảnh = |det| × diện tích gốc (elip πab).</li><li>Định thức Jacobian = hệ số diện tích cục bộ; toạ độ cực: r.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Shoelace_formula" target="_blank" rel="noopener">Wikipedia — Công thức dây giày</a></li><li><a href="https://en.wikipedia.org/wiki/Jacobian_matrix_and_determinant" target="_blank" rel="noopener">Wikipedia — Ma trận và định thức Jacobian</a></li><li><a href="https://textbooks.math.gatech.edu/ila/determinants-definitions-properties.html" target="_blank" rel="noopener">Interactive Linear Algebra — 4.1 Định nghĩa định thức</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Diện tích tam giác (1, 1), (4, 2), (2, 5) bằng công thức dây giày (so với Bài 5.1).</li><li>Ánh xạ (x, y) ↦ (2x + y, x + 3y) tác động lên hình tròn bán kính 2. Diện tích ảnh?</li><li>Giải 3x + 2y = 7, x + 4y = 9 bằng quy tắc Cramer.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (1·2 − 4·1) + (4·5 − 2·2) + (2·1 − 1·5) = −2 + 16 − 3 = 11 ⇒ diện tích 5,5 ✓. 2) det = 6 − 1 = 5; hình tròn diện tích 4π ⇒ 20π. 3) D = 12 − 2 = 10; x = (7·4 − 2·9)/10 = 1; y = (3·9 − 7·1)/10 = 2.</p></div>`);

const q5 = QZ(5, 'Quiz — Chapter 5: Determinants as area and volume|||Quiz — Chương 5: Định thức là diện tích và thể tích', 'Kiểm tra chương 5: định thức 2×2/3×3, diện tích/thể tích, dấu và hướng, quy tắc tích, công thức dây giày, Jacobian.', [
  Q('q1', "det [3 1; 1 2] =|||det [3 1; 1 2] =",
    ['5|||5', '7|||7', '6|||6', '1|||1'], 0,
    "3·2 − 1·1 = 5.|||3·2 − 1·1 = 5."),
  Q('q2', "A transformation with det A = −3 maps a region of area 2 to a region of area|||Phép biến đổi có det A = −3 biến một miền diện tích 2 thành miền diện tích",
    ['−6|||−6', '6|||6', '2/3|||2/3', '3|||3'], 1,
    "Areas multiply by |det A| = 3; the sign only says the region was flipped.|||Diện tích nhân với |det A| = 3; dấu chỉ cho biết miền bị lật."),
  Q('q3', "The area of the triangle with vertices (1, 1), (4, 2), (2, 5) is|||Diện tích tam giác đỉnh (1, 1), (4, 2), (2, 5) là",
    ['11|||11', '5.5|||5,5', '22|||22', '7|||7'], 1,
    "½|det [3 1; 1 4]| = 11/2.|||½|det [3 1; 1 4]| = 11/2."),
  Q('q4', "det [2 1 0; 0 3 1; 1 0 1] =|||det [2 1 0; 0 3 1; 1 0 1] =",
    ['5|||5', '6|||6', '7|||7', '8|||8'], 2,
    "2(3 − 0) − 1(0 − 1) + 0 = 7.|||2(3 − 0) − 1(0 − 1) + 0 = 7."),
  Q('q5', "For a 3×3 matrix with det A = 2, det(2A) is|||Với ma trận 3×3 có det A = 2, det(2A) bằng",
    ['4|||4', '8|||8', '16|||16', '6|||6'], 2,
    "det(cA) = c³ det A = 8·2.|||det(cA) = c³ det A = 8·2."),
  Q('q6', "If det A = 7 and det B = 22, then det(AB) =|||Nếu det A = 7 và det B = 22 thì det(AB) =",
    ['29|||29', '154|||154', '15|||15', 'cannot be known|||không biết được'], 1,
    "det(AB) = det A · det B.|||det(AB) = det A · det B."),
  Q('q7', "A determinant equal to 0 means the transformation|||Định thức bằng 0 nghĩa là phép biến đổi",
    ['is a rotation|||là phép quay', 'flips orientation|||đảo hướng', 'flattens space and is not invertible|||ép dẹt không gian và không khả nghịch', 'keeps all areas|||giữ mọi diện tích'], 2,
    "Columns are dependent; volume collapses to 0.|||Các cột phụ thuộc; thể tích sụp về 0."),
  Q('q8', "By the shoelace formula, the quadrilateral (0, 0), (4, 0), (5, 3), (1, 4) has area|||Theo công thức dây giày, tứ giác (0, 0), (4, 0), (5, 3), (1, 4) có diện tích",
    ['29|||29', '14.5|||14,5', '12|||12', '17|||17'], 1,
    "Sum of terms 0 + 12 + 17 + 0 = 29; half is 14.5.|||Tổng 0 + 12 + 17 + 0 = 29; một nửa là 14,5."),
  Q('q9', "In polar coordinates the Jacobian determinant of (r, θ) ↦ (r cos θ, r sin θ) is|||Trong toạ độ cực, định thức Jacobian của (r, θ) ↦ (r cos θ, r sin θ) là",
    ['1|||1', 'r|||r', 'r²|||r²', 'cos θ|||cos θ'], 1,
    "det [cos θ −r sin θ; sin θ r cos θ] = r(cos²θ + sin²θ) = r.|||det [cos θ −r sin θ; sin θ r cos θ] = r(cos²θ + sin²θ) = r."),
]);

const ch5 = {
  title: 'Chapter 5 — Determinants: area, volume and orientation|||Chương 5 — Định thức: diện tích, thể tích và hướng',
  description: 'Định thức là hệ số diện tích/thể tích có dấu; khai triển 3×3, tích hỗn tạp, quy tắc det; ứng dụng: diện tích đa giác, phép thử hướng, Jacobian, Cramer (Lay ch.3 · Strang ch.5 · ILA ch.4).',
  lessons: [c51, c52, c53, q5],
};

// ───────────────────────────── Chương 6 ─────────────────────────────
const c61 = L('mlt201-ts-6-1',
  '6.1 — Homogeneous coordinates: making translation a matrix|||6.1 — Toạ độ đồng nhất: biến phép tịnh tiến thành ma trận',
  'Tịnh tiến không tuyến tính trong ℝ²; thêm toạ độ thứ ba (x, y, 1); ma trận 3×3 [1 0 tₓ; 0 1 t_y; 0 0 1]; phép biến đổi affine = tuyến tính + tịnh tiến; điểm (w = 1) khác hướng (w = 0).',
  `<span class="eyebrow">MLT201 · Chapter 6 · Lesson 6.1</span>
<h2>Homogeneous coordinates: making translation a matrix</h2>
<p class="lead">Lesson 2.1 showed that translation x ↦ x + t is not linear — yet moving objects is the most common operation in graphics. The trick used by every graphics library is to add one extra coordinate. In one dimension higher, translation <em>becomes</em> a matrix.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write 2D points in homogeneous coordinates (x, y, 1).</li><li>Build 3×3 matrices for translation, rotation, scaling and shear.</li><li>Recognise an affine transformation as “linear part + translation”.</li><li>Distinguish points (w = 1) from direction vectors (w = 0).</li></ul>
<h3>📖 Lecture</h3>
<p>Represent the point (x, y) by the column (x, y, 1). Then</p>
<div class="formula"><span class="lbl">Translation by (t<sub>x</sub>, t<sub>y</sub>)</span>T = [1 0 t<sub>x</sub>; 0 1 t<sub>y</sub>; 0 0 1]    T(x, y, 1) = (x + t<sub>x</sub>, y + t<sub>y</sub>, 1)</div>
<p>Geometrically, we placed the plane at height w = 1 inside ℝ<sup>3</sup>. The 3×3 matrix is a <em>shear</em> of ℝ<sup>3</sup> (linear!), and on the plane w = 1 it looks like a slide. Any 2×2 matrix A becomes [A 0; 0 1]:</p>
<div class="formula"><span class="lbl">Rotation, scaling in homogeneous form</span>R(θ) = [cos θ −sin θ 0; sin θ cos θ 0; 0 0 1]    S = [s<sub>x</sub> 0 0; 0 s<sub>y</sub> 0; 0 0 1]</div>
<p>An <strong>affine transformation</strong> is x ↦ Ax + t (linear, then translate). In homogeneous form it is a single matrix [A t; 0 1] — the 2×2 block A in the top left, the translation t in the right column, and the bottom row (0, 0, 1). Affine maps keep straight lines straight and parallel lines parallel, but they can move the origin.</p>
<p><strong>Points versus directions.</strong> A direction vector — a velocity, a surface normal, the edge of a shape — should <em>not</em> move when you translate. Give it w = 0: T(x, y, 0) = (x, y, 0), unchanged, while rotations and scalings still act on it. Rule of thumb: point − point = direction (1 − 1 = 0); point + direction = point.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> Translate the point (2, 3) by (5, −1): [1 0 5; 0 1 −1; 0 0 1](2, 3, 1) = <b>(7, 2, 1)</b>, i.e. (7, 2). The direction (2, 3, 0) stays (2, 3, 0).</p></div>
<div class="callout"><p><b>Example 2 — read an affine matrix.</b> M = [0 −1 4; 1 0 1; 0 0 1]. Linear part [0 −1; 1 0] = R(90°), translation (4, 1): “rotate 90° about the origin, then shift by (4, 1)”. The point (1, 0) goes to (0, 1) + (4, 1) = <b>(4, 2)</b>.</p></div>
<div class="callout"><p><b>Example 3 — in 3D the same idea.</b> 3D points become (x, y, z, 1) and every transformation is a 4×4 matrix [A t; 0 1]. That is why shaders in OpenGL/WebGL are full of <code>mat4</code> and <code>vec4</code>, and why vertex positions are sent with a 4th component 1.0.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the 1 at the end of a point: (x, y, 0) will not be translated.</li><li>Putting the translation in the bottom row. With column vectors (this course, OpenGL math, NumPy), t goes in the last <em>column</em>. Some engines (DirectX tradition) use row vectors and store the transpose — check the convention before copying matrices.</li><li>Translating a surface normal: normals are directions and need w = 0.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Point (x, y) ↦ (x, y, 1); translation becomes [1 0 t<sub>x</sub>; 0 1 t<sub>y</sub>; 0 0 1].</li><li>Affine map x ↦ Ax + t = one matrix [A t; 0 1].</li><li>w = 1 for points, w = 0 for directions.</li><li>3D graphics uses 4×4 matrices in the same way.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://learnopengl.com/Getting-started/Transformations" target="_blank" rel="noopener">LearnOpenGL — Transformations</a></li><li><a href="https://en.wikipedia.org/wiki/Homogeneous_coordinates" target="_blank" rel="noopener">Wikipedia — Homogeneous coordinates</a></li><li><a href="https://en.wikipedia.org/wiki/Affine_transformation" target="_blank" rel="noopener">Wikipedia — Affine transformation</a></li><li><a href="https://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics/geometry/transforming-points-and-vectors.html" target="_blank" rel="noopener">Scratchapixel — Transforming Points and Vectors</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write the 3×3 matrix that scales by 2 and then translates by (−3, 4). Where does (1, 1) go?</li><li>Apply the same matrix to the direction (1, 1, 0).</li><li>Is the composition of two translations a translation? Which matrix?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) [2 0 −3; 0 2 4; 0 0 1]; (1, 1) ↦ (−1, 6). 2) (2, 2, 0): scaled but not moved. 3) Yes: T(a)T(b) = T(a + b) = [1 0 a<sub>1</sub> + b<sub>1</sub>; 0 1 a<sub>2</sub> + b<sub>2</sub>; 0 0 1].</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 6 · Bài 6.1</span>
<h2>Toạ độ đồng nhất: biến phép tịnh tiến thành ma trận</h2>
<p class="lead">Bài 2.1 cho thấy tịnh tiến x ↦ x + t không tuyến tính — thế mà di chuyển vật thể lại là thao tác phổ biến nhất trong đồ hoạ. Mẹo mà mọi thư viện đồ hoạ dùng là thêm một toạ độ. Ở số chiều cao hơn một, phép tịnh tiến <em>trở thành</em> một ma trận.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết điểm 2D trong toạ độ đồng nhất (x, y, 1).</li><li>Lập ma trận 3×3 cho tịnh tiến, quay, co giãn, trượt.</li><li>Nhận ra phép biến đổi affine là “phần tuyến tính + tịnh tiến”.</li><li>Phân biệt điểm (w = 1) với vector hướng (w = 0).</li></ul>
<h3>📖 Bài giảng</h3>
<p>Biểu diễn điểm (x, y) bằng cột (x, y, 1). Khi đó</p>
<div class="formula"><span class="lbl">Tịnh tiến theo (t<sub>x</sub>, t<sub>y</sub>)</span>T = [1 0 t<sub>x</sub>; 0 1 t<sub>y</sub>; 0 0 1]    T(x, y, 1) = (x + t<sub>x</sub>, y + t<sub>y</sub>, 1)</div>
<p>Về hình học, ta đặt mặt phẳng ở độ cao w = 1 bên trong ℝ<sup>3</sup>. Ma trận 3×3 là một phép <em>trượt</em> của ℝ<sup>3</sup> (tuyến tính!), và trên mặt phẳng w = 1 nó trông như phép dời. Mọi ma trận 2×2 A trở thành [A 0; 0 1]:</p>
<div class="formula"><span class="lbl">Quay, co giãn dạng đồng nhất</span>R(θ) = [cos θ −sin θ 0; sin θ cos θ 0; 0 0 1]    S = [s<sub>x</sub> 0 0; 0 s<sub>y</sub> 0; 0 0 1]</div>
<p><strong>Phép biến đổi affine</strong> là x ↦ Ax + t (tuyến tính, rồi tịnh tiến). Ở dạng đồng nhất nó là một ma trận duy nhất [A t; 0 1] — khối 2×2 A ở góc trên trái, tịnh tiến t ở cột phải, hàng cuối (0, 0, 1). Ánh xạ affine giữ đường thẳng là đường thẳng, đường song song vẫn song song, nhưng có thể dời gốc toạ độ.</p>
<p><strong>Điểm và hướng.</strong> Một vector hướng — vận tốc, pháp tuyến bề mặt, cạnh của một hình — <em>không</em> được dời khi tịnh tiến. Cho nó w = 0: T(x, y, 0) = (x, y, 0), không đổi, trong khi phép quay và co giãn vẫn tác động lên nó. Mẹo nhớ: điểm − điểm = hướng (1 − 1 = 0); điểm + hướng = điểm.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> Tịnh tiến điểm (2, 3) theo (5, −1): [1 0 5; 0 1 −1; 0 0 1](2, 3, 1) = <b>(7, 2, 1)</b>, tức (7, 2). Hướng (2, 3, 0) vẫn là (2, 3, 0).</p></div>
<div class="callout"><p><b>Ví dụ 2 — đọc một ma trận affine.</b> M = [0 −1 4; 1 0 1; 0 0 1]. Phần tuyến tính [0 −1; 1 0] = R(90°), tịnh tiến (4, 1): “quay 90° quanh gốc, rồi dời (4, 1)”. Điểm (1, 0) đi tới (0, 1) + (4, 1) = <b>(4, 2)</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — trong 3D cùng ý tưởng.</b> Điểm 3D thành (x, y, z, 1) và mọi phép biến đổi là ma trận 4×4 [A t; 0 1]. Đó là lý do shader OpenGL/WebGL đầy <code>mat4</code> và <code>vec4</code>, và vị trí đỉnh được gửi kèm thành phần thứ tư 1.0.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên số 1 ở cuối một điểm: (x, y, 0) sẽ không được tịnh tiến.</li><li>Đặt tịnh tiến ở hàng cuối. Với vector cột (môn này, toán OpenGL, NumPy), t nằm ở <em>cột</em> cuối. Một số engine (truyền thống DirectX) dùng vector hàng và lưu ma trận chuyển vị — kiểm quy ước trước khi chép ma trận.</li><li>Tịnh tiến pháp tuyến bề mặt: pháp tuyến là hướng, cần w = 0.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Điểm (x, y) ↦ (x, y, 1); tịnh tiến thành [1 0 t<sub>x</sub>; 0 1 t<sub>y</sub>; 0 0 1].</li><li>Ánh xạ affine x ↦ Ax + t = một ma trận [A t; 0 1].</li><li>w = 1 cho điểm, w = 0 cho hướng.</li><li>Đồ hoạ 3D dùng ma trận 4×4 theo cùng cách.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://learnopengl.com/Getting-started/Transformations" target="_blank" rel="noopener">LearnOpenGL — Transformations</a></li><li><a href="https://en.wikipedia.org/wiki/Homogeneous_coordinates" target="_blank" rel="noopener">Wikipedia — Toạ độ đồng nhất</a></li><li><a href="https://en.wikipedia.org/wiki/Affine_transformation" target="_blank" rel="noopener">Wikipedia — Phép biến đổi affine</a></li><li><a href="https://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics/geometry/transforming-points-and-vectors.html" target="_blank" rel="noopener">Scratchapixel — Biến đổi điểm và vector</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết ma trận 3×3 phóng 2 lần rồi tịnh tiến (−3, 4). (1, 1) đi đâu?</li><li>Áp dụng cùng ma trận cho hướng (1, 1, 0).</li><li>Hợp hai phép tịnh tiến có phải tịnh tiến không? Ma trận nào?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) [2 0 −3; 0 2 4; 0 0 1]; (1, 1) ↦ (−1, 6). 2) (2, 2, 0): được phóng nhưng không bị dời. 3) Có: T(a)T(b) = T(a + b) = [1 0 a<sub>1</sub> + b<sub>1</sub>; 0 1 a<sub>2</sub> + b<sub>2</sub>; 0 0 1].</p></div>`);

const c62 = L('mlt201-ts-6-2',
  '6.2 — Composing graphics transforms: pivots, TRS order, scene graphs|||6.2 — Ghép phép biến đổi đồ hoạ: tâm quay, thứ tự TRS, đồ thị cảnh',
  'Quay quanh một điểm c: T(c)·R·T(−c); ma trận mô hình M = T·R·S và vì sao thứ tự quan trọng; đồ thị cảnh (cha nhân con); nghịch đảo ma trận camera; code NumPy chạy thật.',
  `<span class="eyebrow">MLT201 · Chapter 6 · Lesson 6.2</span>
<h2>Composing graphics transforms</h2>
<p class="lead">With homogeneous coordinates every motion is a matrix, so <strong>a sequence of motions is a product</strong>. This lesson shows the three patterns every game and graphics programmer uses daily.</p>
<h3>🎯 Objectives</h3>
<ul><li>Rotate or scale about an arbitrary point (a pivot).</li><li>Build a model matrix M = T R S and explain why the order is fixed.</li><li>Compose transforms along a scene hierarchy (parent × child).</li><li>Verify composite transforms in NumPy.</li></ul>
<h3>📖 Lecture</h3>
<p><b>Pattern 1 — pivot.</b> R(θ) rotates about the origin. To rotate about a point c: move c to the origin, rotate, move back.</p>
<div class="formula"><span class="lbl">Rotate (or scale) about the point c</span>M = T(c) · R(θ) · T(−c)    (read right to left: T(−c) first)</div>
<p><b>Pattern 2 — model matrix.</b> A sprite or 3D model is designed around its own origin. To place it in the world we scale it, then rotate it, then move it: M = T · R · S. Scaling must come first (rightmost) so that it happens along the model's own axes; translation must come last so that rotation does not swing the object around the world origin.</p>
<p><b>Pattern 3 — hierarchy (scene graph).</b> A wheel is attached to a car, which is in the world. world-from-wheel = (world-from-car) · (car-from-wheel). Move the car and the wheels follow automatically. Robot arms work the same way (Chapter 10).</p>
<p><b>Camera.</b> If the camera's own placement in the world is the matrix C, then to draw the scene <em>from</em> the camera you multiply every point by the <strong>view matrix</strong> V = C<sup>−1</sup>. For a rigid camera C = T(p)R, the inverse is R<sup>T</sup>T(−p) — no general inversion needed.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — rotate about (2, 1).</b> Rotate the point (3, 1) by 90° about c = (2, 1). Step by step: T(−c): (3, 1) → (1, 0); R(90°): (1, 0) → (0, 1); T(c): (0, 1) → <b>(2, 2)</b>. The single matrix is M = T(2, 1)R(90°)T(−2, −1) = [0 −1 3; 1 0 −1; 0 0 1], and M(3, 1, 1) = (2, 2, 1) ✓.</p></div>
<div class="callout"><p><b>Example 2 — TRS order matters.</b> S = scale 2, R = R(90°), T = translate (4, 1). Model point (1, 0):<br>T R S: (1, 0) → (2, 0) → (0, 2) → <b>(4, 3)</b> ✓ (sensible: the object is scaled, turned, then placed).<br>S R T (wrong order): (1, 0) → (5, 1) → (−1, 5) → <b>(−2, 10)</b> — the translation got rotated and scaled too.</p></div>
<h3>💻 Check it in NumPy</h3>
<pre><code class="language-python">import numpy as np
np.set_printoptions(suppress=True)

def T(tx, ty):
    return np.array([[1, 0, tx], [0, 1, ty], [0, 0, 1]])

def R(deg):
    t = np.radians(deg); c, s = np.cos(t), np.sin(t)
    return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])

M = T(2, 1) @ R(90) @ T(-2, -1)        # rotate 90 degrees about the point (2, 1)
print(np.round(M, 6) + 0.0)
square = np.array([[2, 3, 3, 2],
                   [1, 1, 2, 2],
                   [1, 1, 1, 1]])      # a unit square with a corner at (2, 1)
print(np.round(M @ square, 6) + 0.0)</code></pre>
<div class="out">[[ 0. -1.  3.]
 [ 1.  0. -1.]
 [ 0.  0.  1.]]
[[2. 2. 1. 1.]
 [1. 2. 2. 1.]
 [1. 1. 1. 1.]]</div>
<p>The corner (2, 1) stays fixed (it is the pivot) and the square swings to the left of it. Adding 0.0 after rounding removes the cosmetic “−0.” that floating point produces.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing T(−c)R T(c): that rotates about −c. The step applied first sits on the right.</li><li>Rotating an object that is not at the origin and being surprised that it “orbits”. Rotate first (in model space), translate last.</li><li>Inverting the camera matrix with a general inverse every frame instead of using R<sup>T</sup> for the rotation part.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>About a pivot c: T(c) · A · T(−c).</li><li>Model matrix: M = T R S (scale, rotate, translate — applied right to left).</li><li>Hierarchies multiply parent × child.</li><li>View matrix = inverse of the camera's placement.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://learnopengl.com/Getting-started/Transformations" target="_blank" rel="noopener">LearnOpenGL — Transformations (combining matrices)</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Matrix_math_for_the_web" target="_blank" rel="noopener">MDN — Matrix math for the web</a></li><li><a href="https://en.wikipedia.org/wiki/Scene_graph" target="_blank" rel="noopener">Wikipedia — Scene graph</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Rotate (4, 2) by 180° about (1, 1).</li><li>Write the 3×3 matrix that scales by 3 about the point (1, 1). Where does (2, 1) go?</li><li>A car is at world position (10, 0) facing 90°; a wheel sits at (2, −1) in car coordinates. Where is the wheel in the world?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (4, 2) − (1, 1) = (3, 1) → (−3, −1) → (−2, 0). 2) T(1, 1)·diag(3, 3, 1)·T(−1, −1) = [3 0 −2; 0 3 −2; 0 0 1]; (2, 1) ↦ (4, 1). 3) R(90°)(2, −1) = (1, 2), plus (10, 0): (11, 2).</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 6 · Bài 6.2</span>
<h2>Ghép các phép biến đổi đồ hoạ</h2>
<p class="lead">Với toạ độ đồng nhất, mọi chuyển động là một ma trận, nên <strong>một chuỗi chuyển động là một tích</strong>. Bài này giới thiệu ba mẫu mà lập trình viên game và đồ hoạ dùng hằng ngày.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Quay hoặc co giãn quanh một điểm bất kỳ (tâm, pivot).</li><li>Dựng ma trận mô hình M = T R S và giải thích vì sao thứ tự cố định.</li><li>Ghép phép biến đổi theo cây cảnh (cha × con).</li><li>Kiểm phép biến đổi ghép bằng NumPy.</li></ul>
<h3>📖 Bài giảng</h3>
<p><b>Mẫu 1 — tâm quay.</b> R(θ) quay quanh gốc toạ độ. Muốn quay quanh điểm c: dời c về gốc, quay, rồi dời trả lại.</p>
<div class="formula"><span class="lbl">Quay (hoặc co giãn) quanh điểm c</span>M = T(c) · R(θ) · T(−c)    (đọc phải sang trái: T(−c) làm trước)</div>
<p><b>Mẫu 2 — ma trận mô hình.</b> Một sprite hay mô hình 3D được thiết kế quanh gốc riêng của nó. Để đặt vào thế giới, ta co giãn, rồi quay, rồi dời: M = T · R · S. Co giãn phải làm trước (đứng bên phải nhất) để diễn ra theo trục riêng của mô hình; tịnh tiến phải làm sau cùng để phép quay không quăng vật đi vòng quanh gốc thế giới.</p>
<p><b>Mẫu 3 — phân cấp (đồ thị cảnh).</b> Bánh xe gắn vào ô tô, ô tô nằm trong thế giới. thế-giới-từ-bánh = (thế-giới-từ-ô-tô) · (ô-tô-từ-bánh). Dời ô tô thì bánh tự đi theo. Cánh tay robot cũng làm y như vậy (Chương 10).</p>
<p><b>Camera.</b> Nếu vị trí đặt camera trong thế giới là ma trận C, thì để vẽ cảnh <em>từ</em> camera ta nhân mọi điểm với <strong>ma trận nhìn</strong> V = C<sup>−1</sup>. Với camera cứng C = T(p)R, nghịch đảo là R<sup>T</sup>T(−p) — không cần nghịch đảo tổng quát.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — quay quanh (2, 1).</b> Quay điểm (3, 1) góc 90° quanh c = (2, 1). Từng bước: T(−c): (3, 1) → (1, 0); R(90°): (1, 0) → (0, 1); T(c): (0, 1) → <b>(2, 2)</b>. Ma trận gộp là M = T(2, 1)R(90°)T(−2, −1) = [0 −1 3; 1 0 −1; 0 0 1], và M(3, 1, 1) = (2, 2, 1) ✓.</p></div>
<div class="callout"><p><b>Ví dụ 2 — thứ tự TRS quan trọng.</b> S = phóng 2, R = R(90°), T = dời (4, 1). Điểm mô hình (1, 0):<br>T R S: (1, 0) → (2, 0) → (0, 2) → <b>(4, 3)</b> ✓ (hợp lý: vật được phóng, xoay, rồi đặt vào chỗ).<br>S R T (sai thứ tự): (1, 0) → (5, 1) → (−1, 5) → <b>(−2, 10)</b> — chính phép dời cũng bị xoay và phóng theo.</p></div>
<h3>💻 Kiểm bằng NumPy</h3>
<pre><code class="language-python">import numpy as np
np.set_printoptions(suppress=True)

def T(tx, ty):
    return np.array([[1, 0, tx], [0, 1, ty], [0, 0, 1]])

def R(deg):
    t = np.radians(deg); c, s = np.cos(t), np.sin(t)
    return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])

M = T(2, 1) @ R(90) @ T(-2, -1)        # rotate 90 degrees about the point (2, 1)
print(np.round(M, 6) + 0.0)
square = np.array([[2, 3, 3, 2],
                   [1, 1, 2, 2],
                   [1, 1, 1, 1]])      # a unit square with a corner at (2, 1)
print(np.round(M @ square, 6) + 0.0)</code></pre>
<div class="out">[[ 0. -1.  3.]
 [ 1.  0. -1.]
 [ 0.  0.  1.]]
[[2. 2. 1. 1.]
 [1. 2. 2. 1.]
 [1. 1. 1. 1.]]</div>
<p>Đỉnh (2, 1) đứng yên (nó là tâm quay) và hình vuông xoay sang bên trái nó. Cộng 0.0 sau khi làm tròn để bỏ dấu “−0.” mà dấu phẩy động sinh ra.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết T(−c)R T(c): đó là quay quanh −c. Bước làm trước đứng bên phải.</li><li>Quay một vật không nằm ở gốc rồi ngạc nhiên vì nó “bay vòng”. Quay trước (trong không gian mô hình), tịnh tiến sau cùng.</li><li>Nghịch đảo ma trận camera bằng hàm nghịch đảo tổng quát mỗi khung hình thay vì dùng R<sup>T</sup> cho phần quay.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Quanh tâm c: T(c) · A · T(−c).</li><li>Ma trận mô hình: M = T R S (co giãn, quay, dời — tác động phải sang trái).</li><li>Phân cấp: nhân cha × con.</li><li>Ma trận nhìn = nghịch đảo của vị trí đặt camera.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://learnopengl.com/Getting-started/Transformations" target="_blank" rel="noopener">LearnOpenGL — Transformations (ghép ma trận)</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Matrix_math_for_the_web" target="_blank" rel="noopener">MDN — Toán ma trận cho web</a></li><li><a href="https://en.wikipedia.org/wiki/Scene_graph" target="_blank" rel="noopener">Wikipedia — Đồ thị cảnh</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Quay (4, 2) góc 180° quanh (1, 1).</li><li>Viết ma trận 3×3 phóng 3 lần quanh điểm (1, 1). (2, 1) đi đâu?</li><li>Ô tô ở vị trí thế giới (10, 0), quay mặt 90°; bánh xe ở (2, −1) trong toạ độ ô tô. Bánh xe ở đâu trong thế giới?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (4, 2) − (1, 1) = (3, 1) → (−3, −1) → (−2, 0). 2) T(1, 1)·diag(3, 3, 1)·T(−1, −1) = [3 0 −2; 0 3 −2; 0 0 1]; (2, 1) ↦ (4, 1). 3) R(90°)(2, −1) = (1, 2), cộng (10, 0): (11, 2).</p></div>`);

const c63 = L('mlt201-ts-6-3',
  '6.3 — 3D transforms and the pinhole camera: 4×4 matrices and perspective|||6.3 — Biến đổi 3D và camera lỗ kim: ma trận 4×4 và phối cảnh',
  'Ma trận 4×4 cho quay quanh trục x, y, z và tịnh tiến 3D; phép chiếu phối cảnh của camera lỗ kim (x, y, z) ↦ (fx/z, fy/z) bằng ma trận rồi chia cho w; mất thông tin chiều sâu; quy ước OpenGL.',
  `<span class="eyebrow">MLT201 · Chapter 6 · Lesson 6.3</span>
<h2>3D transforms and the pinhole camera</h2>
<p class="lead">A 3D renderer does three things to each vertex: place it in the world (model matrix), look at it from the camera (view matrix), and flatten it onto the screen with <strong>perspective</strong> so that far things look small. The first two are 4×4 affine matrices; the third is a matrix followed by one division.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write 4×4 homogeneous matrices for 3D rotation about an axis and 3D translation.</li><li>Model a pinhole camera as a 3×4 matrix plus the perspective divide.</li><li>Explain why perspective is not linear in ordinary coordinates but is in homogeneous ones.</li><li>Compute the screen position of 3D points.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">3D rotations (3×3 blocks, put into [A 0; 0 1] for 4×4)</span>R<sub>z</sub>(θ) = [cos θ −sin θ 0; sin θ cos θ 0; 0 0 1]    R<sub>x</sub>(θ) = [1 0 0; 0 cos θ −sin θ; 0 sin θ cos θ]<br>R<sub>y</sub>(θ) = [cos θ 0 sin θ; 0 1 0; −sin θ 0 cos θ]    translation: [I t; 0 1] with t = (t<sub>x</sub>, t<sub>y</sub>, t<sub>z</sub>)</div>
<p>3D rotations do <em>not</em> commute: yaw-then-pitch differs from pitch-then-yaw (try it with a phone in your hand). That is why engines are careful about the order of Euler angles, and often store rotations as quaternions instead.</p>
<p><b>The pinhole camera.</b> Put the camera at the origin looking along +z, with the image plane at distance f (the focal length). By similar triangles a point (x, y, z) appears at</p>
<div class="formula"><span class="lbl">Perspective projection</span>(x, y, z) ↦ (f x / z,  f y / z)<br>as a matrix: P = [f 0 0 0; 0 f 0 0; 0 0 1 0],  P(x, y, z, 1) = (f x, f y, z)  then divide by the last entry</div>
<p>Dividing by z is not linear — doubling a point's distance halves its image size. Homogeneous coordinates absorb it: (X, Y, W) and (cX, cY, cW) represent the <em>same</em> 2D point (X/W, Y/W). The GPU applies the matrix, then performs this “perspective divide” in hardware.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> f = 1. The point (2, 1, 4) maps to (2, 1, 4) by P, then to <b>(0.5, 0.25)</b>. The point (4, 2, 8) — twice as far along the same ray — gives (4, 2, 8) → (0.5, 0.25) as well. Every point on a ray through the camera lands on the same pixel: <b>a photo loses depth</b> (the kernel idea of Lesson 2.3, now along rays).</p></div>
<div class="callout"><p><b>Example 2 — zoom.</b> With f = 2 the point (3, −1, 6) appears at (2·3/6, 2·(−1)/6) = (1, −1/3). Doubling f doubles every image coordinate: a longer lens is a uniform scaling of the image.</p></div>
<div class="callout"><p><b>Example 3 — 3D rotation.</b> R<sub>z</sub>(90°) sends (1, 0, 5) to (0, 1, 5): the height z is untouched. R<sub>x</sub>(90°) sends (0, 1, 0) to (0, 0, 1).</p></div>
<h3>💻 Check it in NumPy</h3>
<pre><code class="language-python">import numpy as np
f = 1.0
P = np.array([[f, 0, 0, 0],
              [0, f, 0, 0],
              [0, 0, 1, 0]])          # pinhole camera, looking along +z
pts = np.array([[2, 4, -1],
                [1, 2,  1],
                [4, 8,  2],
                [1, 1,  1]])           # columns: (2,1,4), (4,2,8), (-1,1,2) in homogeneous form
h = P @ pts
print(h)
print(h[:2] / h[2])                    # perspective divide</code></pre>
<div class="out">[[ 2.  4. -1.]
 [ 1.  2.  1.]
 [ 4.  8.  2.]]
[[ 0.5   0.5  -0.5 ]
 [ 0.25  0.25  0.5 ]]</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the divide: (f x, f y, z) is not yet a screen point.</li><li>Points with z ≤ 0 are behind the camera; real pipelines clip them before dividing.</li><li>Conventions: OpenGL's camera looks along <strong>−z</strong> and its projection matrix also remaps depth into [−1, 1] for the depth buffer. The idea is the same as here; the signs and an extra row differ.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>3D motions are 4×4 matrices [A t; 0 1]; 3D rotations do not commute.</li><li>Pinhole projection: (x, y, z) ↦ (fx/z, fy/z) = matrix + perspective divide.</li><li>Homogeneous vectors that are multiples of each other are the same point.</li><li>Projection loses depth along each ray.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/projection-matrix-introduction.html" target="_blank" rel="noopener">Scratchapixel — What Are Projection Matrices?</a></li><li><a href="https://en.wikipedia.org/wiki/Pinhole_camera_model" target="_blank" rel="noopener">Wikipedia — Pinhole camera model</a></li><li><a href="https://en.wikipedia.org/wiki/Euler_angles" target="_blank" rel="noopener">Wikipedia — Euler angles</a></li><li><a href="https://www.3blue1brown.com/lessons/3d-transformations" target="_blank" rel="noopener">3Blue1Brown — Three-dimensional linear transformations</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>With f = 1, where do (3, 3, 3) and (−2, 4, 2) appear?</li><li>Write the 4×4 matrix that translates by (0, 0, 5). Then project (1, 2, 0) with f = 1 after translating.</li><li>Do R<sub>x</sub>(90°) and R<sub>z</sub>(90°) commute? Test on e<sub>1</sub>.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (1, 1) and (−1, 2). 2) [1 0 0 0; 0 1 0 0; 0 0 1 5; 0 0 0 1]; (1, 2, 0) → (1, 2, 5) → (0.2, 0.4). 3) R<sub>x</sub>R<sub>z</sub>e<sub>1</sub> = R<sub>x</sub>(0, 1, 0) = (0, 0, 1) but R<sub>z</sub>R<sub>x</sub>e<sub>1</sub> = R<sub>z</sub>(1, 0, 0) = (0, 1, 0): no.</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 6 · Bài 6.3</span>
<h2>Biến đổi 3D và camera lỗ kim</h2>
<p class="lead">Bộ dựng hình 3D làm ba việc với mỗi đỉnh: đặt nó vào thế giới (ma trận mô hình), nhìn nó từ camera (ma trận nhìn), và ép phẳng lên màn hình bằng <strong>phối cảnh</strong> để vật xa trông nhỏ. Hai việc đầu là ma trận affine 4×4; việc thứ ba là một ma trận rồi một phép chia.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết ma trận đồng nhất 4×4 cho phép quay 3D quanh một trục và tịnh tiến 3D.</li><li>Mô hình camera lỗ kim bằng ma trận 3×4 cộng phép chia phối cảnh.</li><li>Giải thích vì sao phối cảnh không tuyến tính trong toạ độ thường nhưng lại tuyến tính trong toạ độ đồng nhất.</li><li>Tính vị trí trên màn hình của các điểm 3D.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Quay 3D (khối 3×3, đặt vào [A 0; 0 1] để thành 4×4)</span>R<sub>z</sub>(θ) = [cos θ −sin θ 0; sin θ cos θ 0; 0 0 1]    R<sub>x</sub>(θ) = [1 0 0; 0 cos θ −sin θ; 0 sin θ cos θ]<br>R<sub>y</sub>(θ) = [cos θ 0 sin θ; 0 1 0; −sin θ 0 cos θ]    tịnh tiến: [I t; 0 1] với t = (t<sub>x</sub>, t<sub>y</sub>, t<sub>z</sub>)</div>
<p>Phép quay 3D <em>không</em> giao hoán: yaw rồi pitch khác pitch rồi yaw (thử với điện thoại trên tay). Vì thế engine rất cẩn thận về thứ tự góc Euler, và thường lưu phép quay bằng quaternion.</p>
<p><b>Camera lỗ kim.</b> Đặt camera ở gốc, nhìn theo +z, mặt phẳng ảnh cách một khoảng f (tiêu cự). Theo tam giác đồng dạng, điểm (x, y, z) hiện ra tại</p>
<div class="formula"><span class="lbl">Phép chiếu phối cảnh</span>(x, y, z) ↦ (f x / z,  f y / z)<br>dạng ma trận: P = [f 0 0 0; 0 f 0 0; 0 0 1 0],  P(x, y, z, 1) = (f x, f y, z)  rồi chia cho thành phần cuối</div>
<p>Chia cho z không tuyến tính — xa gấp đôi thì ảnh nhỏ một nửa. Toạ độ đồng nhất “nuốt” phép chia này: (X, Y, W) và (cX, cY, cW) biểu diễn <em>cùng</em> một điểm 2D (X/W, Y/W). GPU nhân ma trận, rồi thực hiện “phép chia phối cảnh” bằng phần cứng.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> f = 1. Điểm (2, 1, 4) qua P thành (2, 1, 4), rồi thành <b>(0,5; 0,25)</b>. Điểm (4, 2, 8) — xa gấp đôi trên cùng tia — cũng cho (4, 2, 8) → (0,5; 0,25). Mọi điểm trên một tia đi qua camera đều rơi vào cùng một điểm ảnh: <b>bức ảnh mất chiều sâu</b> (ý tưởng hạt nhân của Bài 2.3, giờ theo từng tia).</p></div>
<div class="callout"><p><b>Ví dụ 2 — zoom.</b> Với f = 2, điểm (3, −1, 6) hiện ở (2·3/6, 2·(−1)/6) = (1, −1/3). Tăng gấp đôi f thì mọi toạ độ ảnh gấp đôi: ống kính dài hơn là một phép phóng đều ảnh.</p></div>
<div class="callout"><p><b>Ví dụ 3 — quay 3D.</b> R<sub>z</sub>(90°) đưa (1, 0, 5) tới (0, 1, 5): độ cao z không đổi. R<sub>x</sub>(90°) đưa (0, 1, 0) tới (0, 0, 1).</p></div>
<h3>💻 Kiểm bằng NumPy</h3>
<pre><code class="language-python">import numpy as np
f = 1.0
P = np.array([[f, 0, 0, 0],
              [0, f, 0, 0],
              [0, 0, 1, 0]])          # pinhole camera, looking along +z
pts = np.array([[2, 4, -1],
                [1, 2,  1],
                [4, 8,  2],
                [1, 1,  1]])           # columns: (2,1,4), (4,2,8), (-1,1,2) in homogeneous form
h = P @ pts
print(h)
print(h[:2] / h[2])                    # perspective divide</code></pre>
<div class="out">[[ 2.  4. -1.]
 [ 1.  2.  1.]
 [ 4.  8.  2.]]
[[ 0.5   0.5  -0.5 ]
 [ 0.25  0.25  0.5 ]]</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên phép chia: (f x, f y, z) chưa phải là điểm trên màn hình.</li><li>Điểm có z ≤ 0 nằm sau camera; pipeline thật cắt bỏ chúng trước khi chia.</li><li>Quy ước: camera của OpenGL nhìn theo <strong>−z</strong> và ma trận chiếu của nó còn ánh xạ chiều sâu vào [−1, 1] cho bộ đệm sâu. Ý tưởng giống ở đây; chỉ khác dấu và thêm một hàng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Chuyển động 3D là ma trận 4×4 [A t; 0 1]; phép quay 3D không giao hoán.</li><li>Chiếu lỗ kim: (x, y, z) ↦ (fx/z, fy/z) = ma trận + chia phối cảnh.</li><li>Các vector đồng nhất là bội của nhau biểu diễn cùng một điểm.</li><li>Phép chiếu làm mất chiều sâu dọc theo mỗi tia.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/projection-matrix-introduction.html" target="_blank" rel="noopener">Scratchapixel — Ma trận chiếu là gì?</a></li><li><a href="https://en.wikipedia.org/wiki/Pinhole_camera_model" target="_blank" rel="noopener">Wikipedia — Mô hình camera lỗ kim</a></li><li><a href="https://en.wikipedia.org/wiki/Euler_angles" target="_blank" rel="noopener">Wikipedia — Góc Euler</a></li><li><a href="https://www.3blue1brown.com/lessons/3d-transformations" target="_blank" rel="noopener">3Blue1Brown — Biến đổi tuyến tính ba chiều</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Với f = 1, (3, 3, 3) và (−2, 4, 2) hiện ở đâu?</li><li>Viết ma trận 4×4 tịnh tiến (0, 0, 5). Rồi chiếu (1, 2, 0) với f = 1 sau khi tịnh tiến.</li><li>R<sub>x</sub>(90°) và R<sub>z</sub>(90°) có giao hoán không? Thử với e<sub>1</sub>.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (1, 1) và (−1, 2). 2) [1 0 0 0; 0 1 0 0; 0 0 1 5; 0 0 0 1]; (1, 2, 0) → (1, 2, 5) → (0,2; 0,4). 3) R<sub>x</sub>R<sub>z</sub>e<sub>1</sub> = R<sub>x</sub>(0, 1, 0) = (0, 0, 1) nhưng R<sub>z</sub>R<sub>x</sub>e<sub>1</sub> = R<sub>z</sub>(1, 0, 0) = (0, 1, 0): không.</p></div>`);

const q6 = QZ(6, 'Quiz — Chapter 6: Homogeneous coordinates and graphics|||Quiz — Chương 6: Toạ độ đồng nhất và đồ hoạ', 'Kiểm tra chương 6: ma trận tịnh tiến, affine, điểm/hướng, quay quanh tâm, thứ tự TRS, ma trận 4×4, phép chiếu phối cảnh.', [
  Q('q1', "In homogeneous coordinates, [1 0 5; 0 1 −1; 0 0 1] sends the point (2, 3) to|||Trong toạ độ đồng nhất, [1 0 5; 0 1 −1; 0 0 1] đưa điểm (2, 3) tới",
    ['(7, 2)|||(7, 2)', '(2, 3)|||(2, 3)', '(10, −3)|||(10, −3)', '(5, −1)|||(5, −1)'], 0,
    "(2 + 5, 3 − 1).|||(2 + 5, 3 − 1)."),
  Q('q2', "A direction vector is written with last coordinate w = 0 so that|||Vector hướng được viết với toạ độ cuối w = 0 để",
    ['it is not affected by translation|||nó không bị tịnh tiến', 'it is not affected by rotation|||nó không bị quay', 'it becomes a unit vector|||nó thành vector đơn vị', 'it is projected|||nó bị chiếu'], 0,
    "The translation column is multiplied by w = 0.|||Cột tịnh tiến được nhân với w = 0."),
  Q('q3', "The affine matrix [0 −1 4; 1 0 1; 0 0 1] sends (1, 0) to|||Ma trận affine [0 −1 4; 1 0 1; 0 0 1] đưa (1, 0) tới",
    ['(4, 2)|||(4, 2)', '(0, 1)|||(0, 1)', '(5, 1)|||(5, 1)', '(3, 1)|||(3, 1)'], 0,
    "Rotate: (0, 1); then add (4, 1).|||Quay: (0, 1); rồi cộng (4, 1)."),
  Q('q4', "To rotate about the point c, use|||Để quay quanh điểm c, dùng",
    ['T(−c) R T(c)|||T(−c) R T(c)', 'T(c) R T(−c)|||T(c) R T(−c)', 'R T(c)|||R T(c)', 'T(c) R|||T(c) R'], 1,
    "Rightmost first: move c to the origin, rotate, move back.|||Bên phải làm trước: dời c về gốc, quay, dời trả lại."),
  Q('q5', "Rotating (3, 1) by 90° about (2, 1) gives|||Quay (3, 1) góc 90° quanh (2, 1) được",
    ['(2, 2)|||(2, 2)', '(−1, 3)|||(−1, 3)', '(3, 2)|||(3, 2)', '(1, 1)|||(1, 1)'], 0,
    "(3, 1) − (2, 1) = (1, 0) → (0, 1) → (2, 2).|||(3, 1) − (2, 1) = (1, 0) → (0, 1) → (2, 2)."),
  Q('q6', "The usual model matrix order (column vectors) is|||Thứ tự ma trận mô hình thông dụng (vector cột) là",
    ['M = S R T|||M = S R T', 'M = T R S|||M = T R S', 'M = R T S|||M = R T S', 'any order gives the same result|||thứ tự nào cũng như nhau'], 1,
    "Scale first (rightmost), translate last (leftmost).|||Co giãn trước (bên phải nhất), tịnh tiến sau cùng (bên trái nhất)."),
  Q('q7', "With f = 1, the pinhole camera images the point (2, 1, 4) at|||Với f = 1, camera lỗ kim cho ảnh của điểm (2, 1, 4) tại",
    ['(2, 1)|||(2, 1)', '(0.5, 0.25)|||(0,5; 0,25)', '(8, 4)|||(8, 4)', '(0.25, 0.5)|||(0,25; 0,5)'], 1,
    "(x/z, y/z) = (2/4, 1/4).|||(x/z, y/z) = (2/4, 1/4)."),
  Q('q8', "The points (2, 1, 4) and (4, 2, 8) have the same image because|||Hai điểm (2, 1, 4) và (4, 2, 8) có cùng ảnh vì",
    ['they lie on the same ray through the camera|||chúng nằm trên cùng một tia qua camera', 'f = 1|||f = 1', 'they have the same z|||chúng có cùng z', 'it is a coincidence|||trùng hợp'], 0,
    "Perspective keeps only the ratios x/z and y/z.|||Phối cảnh chỉ giữ tỉ số x/z và y/z."),
  Q('q9', "3D graphics engines use 4×4 matrices mainly because|||Engine đồ hoạ 3D dùng ma trận 4×4 chủ yếu vì",
    ['translations and perspective become matrix products|||tịnh tiến và phối cảnh trở thành tích ma trận', 'GPUs cannot multiply 3×3 matrices|||GPU không nhân được ma trận 3×3', 'it saves memory|||tiết kiệm bộ nhớ', 'rotations need four angles|||phép quay cần bốn góc'], 0,
    "One extra coordinate turns affine maps and the projection into one matrix pipeline.|||Thêm một toạ độ biến ánh xạ affine và phép chiếu thành một chuỗi nhân ma trận."),
]);

const ch6 = {
  title: 'Chapter 6 — Homogeneous coordinates and computer graphics|||Chương 6 — Toạ độ đồng nhất và đồ hoạ máy tính',
  description: 'Toạ độ đồng nhất, ma trận affine 3×3/4×4, điểm và hướng, quay quanh tâm, thứ tự TRS, đồ thị cảnh, ma trận nhìn, quay 3D, camera lỗ kim và phép chia phối cảnh (Marschner–Shirley ch.6–7 · Lay 2.7).',
  lessons: [c61, c62, c63, q6],
};

// ───────────────────────────── Chương 7 ─────────────────────────────
const c71 = L('mlt201-ts-7-1',
  '7.1 — Subspaces, independence, basis and dimension (geometrically)|||7.1 — Không gian con, độc lập, cơ sở và số chiều (nhìn bằng hình)',
  'Không gian con = đường/mặt phẳng qua gốc; độc lập tuyến tính = không vector nào thừa; cơ sở = bộ trục toạ độ tối thiểu; số chiều; kiểm bằng định thức/hạng; cơ sở của mặt phẳng x + y − z = 0.',
  `<span class="eyebrow">MLT201 · Chapter 7 · Lesson 7.1</span>
<h2>Subspaces, independence, basis and dimension</h2>
<p class="lead">Before we can change coordinate systems, we need to say precisely what a coordinate system <em>is</em>. The answer is a <strong>basis</strong>: a set of vectors that reaches everywhere (spans) with nothing redundant (independent).</p>
<h3>🎯 Objectives</h3>
<ul><li>Recognise subspaces of ℝ<sup>2</sup> and ℝ<sup>3</sup> as lines and planes through the origin.</li><li>Test linear independence by determinant, rank or by finding a dependency.</li><li>Find a basis and the dimension of a plane, a kernel or a column space.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>subspace</strong> is a set of vectors closed under addition and scaling — geometrically, a point (the origin), a line through the origin, a plane through the origin, or the whole space. Kernels and column spaces are always subspaces. A line <em>not</em> through the origin is not a subspace (it does not contain 0).</p>
<div class="formula"><span class="lbl">Linear independence</span>v<sub>1</sub>, …, v<sub>k</sub> are independent if c<sub>1</sub>v<sub>1</sub> + … + c<sub>k</sub>v<sub>k</sub> = 0 only for c<sub>1</sub> = … = c<sub>k</sub> = 0.<br>Geometrically: no vector lies in the span of the others — each one adds a new direction.</div>
<p>n vectors in ℝ<sup>n</sup> are independent ⇔ the matrix with them as columns has det ≠ 0 ⇔ rank n. In general, k vectors are independent ⇔ the rank of their matrix is k.</p>
<div class="formula"><span class="lbl">Basis and dimension</span>A basis of a subspace V = independent vectors that span V.  dim V = the number of vectors in any basis.<br>ℝ<sup>n</sup>: dimension n (standard basis e<sub>1</sub>, …, e<sub>n</sub>)    line: 1    plane: 2</div>
<p>Every basis of the same subspace has the same size, and every vector of V can be written in exactly one way as a combination of the basis — that uniqueness is what makes a basis a coordinate system (next lesson).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — dependent vectors.</b> (1, 0, 1), (0, 1, 1), (1, 1, 2). det [1 0 1; 0 1 1; 1 1 2] = 1(2 − 1) − 0 + 1(0 − 1) = 0, rank 2. Indeed the third is the sum of the first two. The three vectors span only a <b>plane</b>, not ℝ<sup>3</sup>.</p></div>
<div class="callout"><p><b>Example 2 — basis of a plane.</b> V = {(x, y, z) : x + y − z = 0}. Solve z = x + y with x, y free: (x, y, x + y) = x(1, 0, 1) + y(0, 1, 1). So <b>{(1, 0, 1), (0, 1, 1)} is a basis, dim V = 2</b>. (The same plane as Example 1 — no coincidence.)</p></div>
<div class="callout"><p><b>Example 3 — colour space.</b> RGB colours live in ℝ<sup>3</sup> with basis red, green, blue. Video formats switch to the basis luminance–chrominance (YCbCr) because the eye is more sensitive to brightness: same space, different basis, and the chroma coordinates can be stored with less precision.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking a set with the zero vector can be independent: 1·0 = 0 is already a nontrivial dependency.</li><li>Believing more vectors always mean more dimensions: 5 vectors in ℝ<sup>3</sup> are always dependent.</li><li>Confusing “a basis” with “the basis”. A subspace has infinitely many bases; only the dimension is fixed.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Subspaces = {0}, lines and planes through 0, the whole space.</li><li>Independent = no redundant vector; test with det (square) or rank.</li><li>Basis = independent + spanning; dimension = size of a basis.</li><li>Coordinates relative to a basis are unique.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/linear-independence.html" target="_blank" rel="noopener">Interactive Linear Algebra — 2.5 Linear Independence</a></li><li><a href="https://textbooks.math.gatech.edu/ila/subspaces.html" target="_blank" rel="noopener">Interactive Linear Algebra — 2.6 Subspaces</a></li><li><a href="https://textbooks.math.gatech.edu/ila/dimension.html" target="_blank" rel="noopener">Interactive Linear Algebra — 2.7 Basis and Dimension</a></li><li><a href="https://www.3blue1brown.com/lessons/span" target="_blank" rel="noopener">3Blue1Brown — Linear combinations, span, and basis vectors</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Are (1, 2), (3, 6) independent? Are (1, 2), (3, 5)?</li><li>Find a basis of the line of solutions of x + 2y = 0, and of the plane 2x − y + 3z = 0.</li><li>Is the set {(x, y) : y = 2x + 1} a subspace?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) det = 6 − 6 = 0: dependent. det = 5 − 6 = −1: independent (a basis of ℝ<sup>2</sup>). 2) {(−2, 1)}; y = 2x + 3z gives (x, 2x + 3z, z) = x(1, 2, 0) + z(0, 3, 1): basis {(1, 2, 0), (0, 3, 1)}. 3) No: it does not contain (0, 0).</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 7 · Bài 7.1</span>
<h2>Không gian con, độc lập, cơ sở và số chiều</h2>
<p class="lead">Trước khi đổi hệ toạ độ, ta cần nói chính xác một hệ toạ độ <em>là gì</em>. Câu trả lời là <strong>cơ sở</strong>: một bộ vector với tới được mọi nơi (span) mà không có cái nào thừa (độc lập).</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận ra không gian con của ℝ<sup>2</sup> và ℝ<sup>3</sup> là các đường thẳng, mặt phẳng qua gốc.</li><li>Kiểm độc lập tuyến tính bằng định thức, hạng hoặc bằng cách tìm một quan hệ phụ thuộc.</li><li>Tìm cơ sở và số chiều của một mặt phẳng, một hạt nhân hoặc một không gian cột.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Không gian con</strong> là tập vector đóng với phép cộng và nhân số — về hình học: một điểm (gốc), một đường thẳng qua gốc, một mặt phẳng qua gốc, hoặc cả không gian. Hạt nhân và không gian cột luôn là không gian con. Đường thẳng <em>không</em> qua gốc không phải không gian con (nó không chứa 0).</p>
<div class="formula"><span class="lbl">Độc lập tuyến tính</span>v<sub>1</sub>, …, v<sub>k</sub> độc lập nếu c<sub>1</sub>v<sub>1</sub> + … + c<sub>k</sub>v<sub>k</sub> = 0 chỉ khi c<sub>1</sub> = … = c<sub>k</sub> = 0.<br>Về hình học: không vector nào nằm trong span của các vector còn lại — mỗi cái thêm một hướng mới.</div>
<p>n vector trong ℝ<sup>n</sup> độc lập ⇔ ma trận nhận chúng làm cột có det ≠ 0 ⇔ hạng n. Tổng quát, k vector độc lập ⇔ hạng của ma trận của chúng bằng k.</p>
<div class="formula"><span class="lbl">Cơ sở và số chiều</span>Cơ sở của không gian con V = các vector độc lập span V.  dim V = số vector trong một cơ sở bất kỳ.<br>ℝ<sup>n</sup>: số chiều n (cơ sở chuẩn e<sub>1</sub>, …, e<sub>n</sub>)    đường thẳng: 1    mặt phẳng: 2</div>
<p>Mọi cơ sở của cùng một không gian con có cùng số vector, và mỗi vector của V viết được theo đúng một cách thành tổ hợp của cơ sở — chính tính duy nhất đó làm cơ sở thành một hệ toạ độ (bài sau).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — vector phụ thuộc.</b> (1, 0, 1), (0, 1, 1), (1, 1, 2). det [1 0 1; 0 1 1; 1 1 2] = 1(2 − 1) − 0 + 1(0 − 1) = 0, hạng 2. Thật vậy vector thứ ba là tổng hai vector đầu. Ba vector chỉ span một <b>mặt phẳng</b>, không phải ℝ<sup>3</sup>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — cơ sở của một mặt phẳng.</b> V = {(x, y, z) : x + y − z = 0}. Giải z = x + y với x, y tự do: (x, y, x + y) = x(1, 0, 1) + y(0, 1, 1). Vậy <b>{(1, 0, 1), (0, 1, 1)} là một cơ sở, dim V = 2</b>. (Cùng mặt phẳng với Ví dụ 1 — không phải trùng hợp.)</p></div>
<div class="callout"><p><b>Ví dụ 3 — không gian màu.</b> Màu RGB sống trong ℝ<sup>3</sup> với cơ sở đỏ, lục, lam. Các định dạng video chuyển sang cơ sở độ sáng – sắc độ (YCbCr) vì mắt nhạy với độ sáng hơn: cùng một không gian, khác cơ sở, và toạ độ sắc độ có thể lưu với độ chính xác thấp hơn.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nghĩ một tập chứa vector 0 có thể độc lập: 1·0 = 0 đã là một quan hệ phụ thuộc không tầm thường.</li><li>Tin rằng nhiều vector hơn luôn là nhiều chiều hơn: 5 vector trong ℝ<sup>3</sup> luôn phụ thuộc.</li><li>Nhầm “một cơ sở” với “cơ sở duy nhất”. Một không gian con có vô số cơ sở; chỉ số chiều là cố định.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Không gian con = {0}, đường thẳng và mặt phẳng qua 0, cả không gian.</li><li>Độc lập = không có vector thừa; kiểm bằng det (ma trận vuông) hoặc hạng.</li><li>Cơ sở = độc lập + span; số chiều = số vector của cơ sở.</li><li>Toạ độ theo một cơ sở là duy nhất.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/linear-independence.html" target="_blank" rel="noopener">Interactive Linear Algebra — 2.5 Độc lập tuyến tính</a></li><li><a href="https://textbooks.math.gatech.edu/ila/subspaces.html" target="_blank" rel="noopener">Interactive Linear Algebra — 2.6 Không gian con</a></li><li><a href="https://textbooks.math.gatech.edu/ila/dimension.html" target="_blank" rel="noopener">Interactive Linear Algebra — 2.7 Cơ sở và số chiều</a></li><li><a href="https://www.3blue1brown.com/lessons/span" target="_blank" rel="noopener">3Blue1Brown — Tổ hợp tuyến tính, span và vector cơ sở</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>(1, 2), (3, 6) có độc lập không? (1, 2), (3, 5) thì sao?</li><li>Tìm cơ sở của đường nghiệm x + 2y = 0, và của mặt phẳng 2x − y + 3z = 0.</li><li>Tập {(x, y) : y = 2x + 1} có phải không gian con không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) det = 6 − 6 = 0: phụ thuộc. det = 5 − 6 = −1: độc lập (một cơ sở của ℝ<sup>2</sup>). 2) {(−2, 1)}; y = 2x + 3z cho (x, 2x + 3z, z) = x(1, 2, 0) + z(0, 3, 1): cơ sở {(1, 2, 0), (0, 3, 1)}. 3) Không: nó không chứa (0, 0).</p></div>`);

const c72 = L('mlt201-ts-7-2',
  '7.2 — Coordinates in a new basis and change-of-basis matrices|||7.2 — Toạ độ trong cơ sở mới và ma trận đổi cơ sở',
  'Toạ độ [x]_B theo cơ sở B; ma trận P_B = [b₁ b₂] đổi từ B sang chuẩn, P_B⁻¹ đổi ngược; ví dụ lưới xoay 45°; khung toạ độ cục bộ của nhân vật game; đổi giữa hai cơ sở không chuẩn.',
  `<span class="eyebrow">MLT201 · Chapter 7 · Lesson 7.2</span>
<h2>Coordinates in a new basis</h2>
<p class="lead">The same arrow can have different coordinates depending on which grid you measure it with. A game character thinks in “forward/right”; the world thinks in “east/north”. Change of basis is the dictionary between the two languages.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute the coordinate vector [x]<sub>B</sub> of x in a basis B.</li><li>Use P<sub>B</sub> (basis vectors as columns) to convert B-coordinates to standard coordinates, and P<sub>B</sub><sup>−1</sup> to convert back.</li><li>Convert between two non-standard bases.</li></ul>
<h3>📖 Lecture</h3>
<p>Let B = {b<sub>1</sub>, b<sub>2</sub>} be a basis of ℝ<sup>2</sup>. If x = c<sub>1</sub>b<sub>1</sub> + c<sub>2</sub>b<sub>2</sub>, its <strong>B-coordinates</strong> are [x]<sub>B</sub> = (c<sub>1</sub>, c<sub>2</sub>). By the column picture this says x = P<sub>B</sub>[x]<sub>B</sub> with P<sub>B</sub> = [b<sub>1</sub> b<sub>2</sub>]:</p>
<div class="formula"><span class="lbl">Change of basis</span>x = P<sub>B</sub> [x]<sub>B</sub>    (B-language → standard)        [x]<sub>B</sub> = P<sub>B</sub><sup>−1</sup> x    (standard → B-language)<br>between two bases B and C:  [x]<sub>C</sub> = P<sub>C</sub><sup>−1</sup> P<sub>B</sub> [x]<sub>B</sub></div>
<p>A helpful picture: P<sub>B</sub> is the transformation that moves the standard grid onto the B-grid. Reading coordinates in the B-grid means undoing that motion — hence the inverse. (3Blue1Brown calls this “translating between Jennifer's language and ours”.)</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — a rotated grid.</b> b<sub>1</sub> = (1, 1), b<sub>2</sub> = (−1, 1) (the standard grid turned 45° and stretched by √2). Find [x]<sub>B</sub> for x = (3, 1).</p><p>Solve c<sub>1</sub>(1, 1) + c<sub>2</sub>(−1, 1) = (3, 1): c<sub>1</sub> − c<sub>2</sub> = 3, c<sub>1</sub> + c<sub>2</sub> = 1 ⇒ c<sub>1</sub> = 2, c<sub>2</sub> = −1. <b>[x]<sub>B</sub> = (2, −1)</b>: two steps along b<sub>1</sub>, one step back along b<sub>2</sub>. Check: 2(1, 1) − (−1, 1) = (3, 1) ✓.</p><p>Backwards: [y]<sub>B</sub> = (4, 1) means y = P<sub>B</sub>(4, 1) = 4(1, 1) + (−1, 1) = <b>(3, 5)</b>.</p></div>
<div class="callout"><p><b>Example 2 — a game character's local frame.</b> A character faces f = (0.6, 0.8) (unit “forward”) and has right-hand direction r = (0.8, −0.6). An enemy at world offset d = (5, 0) from the character is, in local coordinates, (d · r, d · f) = (4, 3): 4 units to the right, 3 units ahead. Because f and r are perpendicular unit vectors, P<sup>−1</sup> = P<sup>T</sup> and the coordinates are just dot products — no inversion needed. The AI can now decide “turn right”.</p></div>
<div class="callout"><p><b>Example 3 — another basis.</b> C = {(2, 1), (1, 1)}, x = (5, 3): P<sub>C</sub> = [2 1; 1 1] has det 1 and inverse [1 −1; −1 2], so [x]<sub>C</sub> = (5 − 3, −5 + 6) = <b>(2, 1)</b>. Check: 2(2, 1) + (1, 1) = (5, 3) ✓.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using P<sub>B</sub> when you need P<sub>B</sub><sup>−1</sup>. Ask: am I going <em>into</em> the B-language (inverse) or <em>out of</em> it (P<sub>B</sub>)?</li><li>Putting basis vectors as rows of P<sub>B</sub>.</li><li>Using dot products to get coordinates when the basis is not orthonormal — that only works for perpendicular unit vectors.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>[x]<sub>B</sub> = weights expressing x in the basis B.</li><li>x = P<sub>B</sub>[x]<sub>B</sub>, [x]<sub>B</sub> = P<sub>B</sub><sup>−1</sup>x.</li><li>Orthonormal basis: coordinates are dot products (P<sup>−1</sup> = P<sup>T</sup>).</li><li>Local frames in games, colour spaces and PCA axes are all changes of basis.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/change-of-basis" target="_blank" rel="noopener">3Blue1Brown — Change of basis</a></li><li><a href="https://textbooks.math.gatech.edu/ila/bases-as-coord-systems.html" target="_blank" rel="noopener">Interactive Linear Algebra — 2.8 Bases as Coordinate Systems</a></li><li><a href="https://en.wikipedia.org/wiki/Change_of_basis" target="_blank" rel="noopener">Wikipedia — Change of basis</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>B = {(1, 1), (−1, 1)}. Find [x]<sub>B</sub> for x = (0, 4).</li><li>B = {(1, 2), (3, 5)}. If [y]<sub>B</sub> = (1, −1), find y.</li><li>A drone faces f = (0, 1) with right r = (1, 0). An object is at offset (−2, 7). Where is it relative to the drone?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) c<sub>1</sub> − c<sub>2</sub> = 0, c<sub>1</sub> + c<sub>2</sub> = 4 ⇒ (2, 2). 2) (1, 2) − (3, 5) = (−2, −3). 3) (d·r, d·f) = (−2, 7): 2 units to the left, 7 ahead.</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 7 · Bài 7.2</span>
<h2>Toạ độ trong cơ sở mới</h2>
<p class="lead">Cùng một mũi tên có thể có toạ độ khác nhau tuỳ bạn đo bằng lưới nào. Nhân vật game nghĩ bằng “phía trước/bên phải”; thế giới nghĩ bằng “đông/bắc”. Đổi cơ sở là cuốn từ điển giữa hai ngôn ngữ đó.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính vector toạ độ [x]<sub>B</sub> của x theo cơ sở B.</li><li>Dùng P<sub>B</sub> (các vector cơ sở xếp thành cột) để đổi toạ độ B sang toạ độ chuẩn, và P<sub>B</sub><sup>−1</sup> để đổi ngược.</li><li>Đổi giữa hai cơ sở không chuẩn.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Cho B = {b<sub>1</sub>, b<sub>2</sub>} là một cơ sở của ℝ<sup>2</sup>. Nếu x = c<sub>1</sub>b<sub>1</sub> + c<sub>2</sub>b<sub>2</sub> thì <strong>toạ độ theo B</strong> của nó là [x]<sub>B</sub> = (c<sub>1</sub>, c<sub>2</sub>). Theo góc nhìn cột, điều này nói x = P<sub>B</sub>[x]<sub>B</sub> với P<sub>B</sub> = [b<sub>1</sub> b<sub>2</sub>]:</p>
<div class="formula"><span class="lbl">Đổi cơ sở</span>x = P<sub>B</sub> [x]<sub>B</sub>    (ngôn ngữ B → chuẩn)        [x]<sub>B</sub> = P<sub>B</sub><sup>−1</sup> x    (chuẩn → ngôn ngữ B)<br>giữa hai cơ sở B và C:  [x]<sub>C</sub> = P<sub>C</sub><sup>−1</sup> P<sub>B</sub> [x]<sub>B</sub></div>
<p>Hình dung giúp nhớ: P<sub>B</sub> là phép biến đổi dời lưới chuẩn thành lưới B. Đọc toạ độ trên lưới B nghĩa là hoàn tác chuyển động đó — vì thế mới cần nghịch đảo. (3Blue1Brown gọi đây là “phiên dịch giữa ngôn ngữ của Jennifer và của ta”.)</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — lưới xoay.</b> b<sub>1</sub> = (1, 1), b<sub>2</sub> = (−1, 1) (lưới chuẩn xoay 45° và giãn √2 lần). Tìm [x]<sub>B</sub> với x = (3, 1).</p><p>Giải c<sub>1</sub>(1, 1) + c<sub>2</sub>(−1, 1) = (3, 1): c<sub>1</sub> − c<sub>2</sub> = 3, c<sub>1</sub> + c<sub>2</sub> = 1 ⇒ c<sub>1</sub> = 2, c<sub>2</sub> = −1. <b>[x]<sub>B</sub> = (2, −1)</b>: hai bước theo b<sub>1</sub>, lùi một bước theo b<sub>2</sub>. Kiểm: 2(1, 1) − (−1, 1) = (3, 1) ✓.</p><p>Chiều ngược: [y]<sub>B</sub> = (4, 1) nghĩa là y = P<sub>B</sub>(4, 1) = 4(1, 1) + (−1, 1) = <b>(3, 5)</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — khung toạ độ cục bộ của nhân vật game.</b> Nhân vật nhìn theo f = (0,6; 0,8) (“phía trước”, đơn vị) và có hướng tay phải r = (0,8; −0,6). Kẻ địch ở độ lệch thế giới d = (5, 0) so với nhân vật, trong toạ độ cục bộ là (d · r, d · f) = (4, 3): bên phải 4 đơn vị, phía trước 3 đơn vị. Vì f và r là các vector đơn vị vuông góc, P<sup>−1</sup> = P<sup>T</sup> và toạ độ chỉ là các tích vô hướng — không cần nghịch đảo. AI giờ quyết định được “rẽ phải”.</p></div>
<div class="callout"><p><b>Ví dụ 3 — một cơ sở khác.</b> C = {(2, 1), (1, 1)}, x = (5, 3): P<sub>C</sub> = [2 1; 1 1] có det 1 và nghịch đảo [1 −1; −1 2], nên [x]<sub>C</sub> = (5 − 3, −5 + 6) = <b>(2, 1)</b>. Kiểm: 2(2, 1) + (1, 1) = (5, 3) ✓.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng P<sub>B</sub> khi cần P<sub>B</sub><sup>−1</sup>. Tự hỏi: mình đang đi <em>vào</em> ngôn ngữ B (nghịch đảo) hay đi <em>ra</em> khỏi nó (P<sub>B</sub>)?</li><li>Xếp vector cơ sở thành hàng của P<sub>B</sub>.</li><li>Dùng tích vô hướng để lấy toạ độ khi cơ sở không trực chuẩn — chỉ đúng với các vector đơn vị vuông góc.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>[x]<sub>B</sub> = các trọng số biểu diễn x theo cơ sở B.</li><li>x = P<sub>B</sub>[x]<sub>B</sub>, [x]<sub>B</sub> = P<sub>B</sub><sup>−1</sup>x.</li><li>Cơ sở trực chuẩn: toạ độ là các tích vô hướng (P<sup>−1</sup> = P<sup>T</sup>).</li><li>Khung cục bộ trong game, không gian màu và các trục PCA đều là đổi cơ sở.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/change-of-basis" target="_blank" rel="noopener">3Blue1Brown — Đổi cơ sở</a></li><li><a href="https://textbooks.math.gatech.edu/ila/bases-as-coord-systems.html" target="_blank" rel="noopener">Interactive Linear Algebra — 2.8 Cơ sở như hệ toạ độ</a></li><li><a href="https://en.wikipedia.org/wiki/Change_of_basis" target="_blank" rel="noopener">Wikipedia — Đổi cơ sở</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>B = {(1, 1), (−1, 1)}. Tìm [x]<sub>B</sub> với x = (0, 4).</li><li>B = {(1, 2), (3, 5)}. Nếu [y]<sub>B</sub> = (1, −1), tìm y.</li><li>Một drone nhìn theo f = (0, 1), tay phải r = (1, 0). Một vật ở độ lệch (−2, 7). Nó ở đâu so với drone?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) c<sub>1</sub> − c<sub>2</sub> = 0, c<sub>1</sub> + c<sub>2</sub> = 4 ⇒ (2, 2). 2) (1, 2) − (3, 5) = (−2, −3). 3) (d·r, d·f) = (−2, 7): bên trái 2 đơn vị, phía trước 7.</p></div>`);

const c73 = L('mlt201-ts-7-3',
  '7.3 — The matrix of a transformation in another basis: similarity|||7.3 — Ma trận của phép biến đổi trong cơ sở khác: ma trận đồng dạng',
  '[T]_B = P⁻¹AP; chọn cơ sở “hợp” với phép biến đổi để ma trận thành chéo; dựng lại phép phản chiếu qua y = 2x và phép chiếu từ cơ sở thích nghi; ma trận đồng dạng giữ det, vết, trị riêng.',
  `<span class="eyebrow">MLT201 · Chapter 7 · Lesson 7.3</span>
<h2>The matrix of a transformation in another basis</h2>
<p class="lead">A transformation is a geometric object; its matrix depends on the grid you describe it in. Choose the grid well and an ugly matrix becomes a <strong>diagonal</strong> one. This is the idea that leads straight to eigenvectors.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute the B-matrix of T: [T]<sub>B</sub> = P<sup>−1</sup>AP.</li><li>Build a standard matrix A = PDP<sup>−1</sup> from a simple description in an adapted basis.</li><li>Know which quantities similar matrices share.</li></ul>
<h3>📖 Lecture</h3>
<p>Suppose A is the matrix of T in standard coordinates and P = P<sub>B</sub>. To find what T does in B-language: translate B → standard (P), apply A, translate back (P<sup>−1</sup>).</p>
<div class="formula"><span class="lbl">Matrix of T in the basis B</span>[T]<sub>B</sub> = P<sup>−1</sup> A P        equivalently  A = P [T]<sub>B</sub> P<sup>−1</sup><br>Matrices related this way are called <b>similar</b>: they describe the same transformation in different bases.</div>
<p>Similar matrices share everything that is geometric rather than coordinate-dependent: <strong>determinant</strong> (area factor), <strong>trace</strong> (sum of diagonal entries), <strong>rank</strong> and <strong>eigenvalues</strong>.</p>
<p>The power move: describe a transformation in a basis where it is obvious, then convert. For a reflection or a projection across a line, use one basis vector <em>on</em> the line and one <em>perpendicular</em> to it.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — reflection across y = 2x, the easy way.</b> Take b<sub>1</sub> = (1, 2) (on the line) and b<sub>2</sub> = (−2, 1) (perpendicular). The reflection keeps b<sub>1</sub> and flips b<sub>2</sub>, so in this basis <b>[T]<sub>B</sub> = D = diag(1, −1)</b>. With P = [1 −2; 2 1] (det 5, P<sup>−1</sup> = (1/5)[1 2; −2 1]):</p><p>A = PDP<sup>−1</sup> = [1 2; 2 −1] · (1/5)[1 2; −2 1] = (1/5)[−3 4; 4 3] = <b>[−3/5 4/5; 4/5 3/5]</b> — exactly the matrix of Lesson 3.1, with no trigonometry.</p></div>
<div class="callout"><p><b>Example 2 — projection onto y = 2x.</b> Same basis, now b<sub>1</sub> is kept and b<sub>2</sub> is crushed: D = diag(1, 0). A = PDP<sup>−1</sup> = (1/5)[1 2; 2 4], the projection matrix of Lesson 3.3 ✓.</p></div>
<div class="callout"><p><b>Example 3 — shared invariants.</b> In Example 1, det A = −9/25 − 16/25 = −1 = det D, and trace A = 0 = 1 + (−1) = trace D ✓.</p></div>
<div class="callout"><p><b>Example 4 — stretching along a diagonal.</b> “Stretch by 3 along (1, 1), leave (1, −1) alone.” P = [1 1; 1 −1], D = diag(3, 1). A = PDP<sup>−1</sup> = <b>[2 1; 1 2]</b>. Check: A(1, 1) = (3, 3) ✓, A(1, −1) = (1, −1) ✓. We will meet this matrix again in Chapter 8.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing PAP<sup>−1</sup> instead of P<sup>−1</sup>AP for [T]<sub>B</sub>. Check by applying to [b<sub>1</sub>]<sub>B</sub> = e<sub>1</sub>.</li><li>Choosing basis vectors that are not independent: P must be invertible.</li><li>Thinking similar matrices have the same entries or the same eigenvectors. They share eigenvalues, but the eigenvectors are expressed in different coordinates.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>[T]<sub>B</sub> = P<sup>−1</sup>AP; A = P[T]<sub>B</sub>P<sup>−1</sup>.</li><li>Similar matrices = same transformation, different basis; same det, trace, rank, eigenvalues.</li><li>Adapted basis (on the line + perpendicular) makes reflections and projections diagonal.</li><li>Looking for a basis that makes A diagonal = looking for eigenvectors (Chapter 8).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/similarity.html" target="_blank" rel="noopener">Interactive Linear Algebra — 5.3 Similarity (geometry of similar matrices)</a></li><li><a href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/resources/lecture-31-change-of-basis-image-compression/" target="_blank" rel="noopener">MIT 18.06SC — Lecture 31: Change of Basis; Image Compression</a></li><li><a href="https://en.wikipedia.org/wiki/Matrix_similarity" target="_blank" rel="noopener">Wikipedia — Matrix similarity</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Using b<sub>1</sub> = (1, 1), b<sub>2</sub> = (−1, 1), find the standard matrix of the reflection across y = x.</li><li>Find the standard matrix that stretches by 2 along (1, 0) and by 3 along (1, 1).</li><li>Can [1 2; 0 3] and [2 0; 0 2] be similar? (Hint: trace and det.)</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) D = diag(1, −1), P = [1 −1; 1 1], P<sup>−1</sup> = ½[1 1; −1 1] ⇒ A = [0 1; 1 0]. 2) P = [1 1; 0 1], D = diag(2, 3), P<sup>−1</sup> = [1 −1; 0 1] ⇒ A = [2 1; 0 3]. 3) Traces 4 = 4 but det 3 ≠ 4: not similar.</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 7 · Bài 7.3</span>
<h2>Ma trận của phép biến đổi trong cơ sở khác</h2>
<p class="lead">Phép biến đổi là một đối tượng hình học; ma trận của nó phụ thuộc vào lưới bạn dùng để mô tả. Chọn lưới khéo thì một ma trận xấu xí trở thành ma trận <strong>chéo</strong>. Đây là ý tưởng dẫn thẳng tới vector riêng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính ma trận của T theo cơ sở B: [T]<sub>B</sub> = P<sup>−1</sup>AP.</li><li>Dựng ma trận chuẩn A = PDP<sup>−1</sup> từ một mô tả đơn giản trong cơ sở thích nghi.</li><li>Biết các đại lượng mà ma trận đồng dạng có chung.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Giả sử A là ma trận của T trong toạ độ chuẩn và P = P<sub>B</sub>. Để biết T làm gì trong ngôn ngữ B: dịch B → chuẩn (P), áp A, dịch ngược lại (P<sup>−1</sup>).</p>
<div class="formula"><span class="lbl">Ma trận của T theo cơ sở B</span>[T]<sub>B</sub> = P<sup>−1</sup> A P        tương đương  A = P [T]<sub>B</sub> P<sup>−1</sup><br>Các ma trận liên hệ như vậy gọi là <b>đồng dạng</b>: chúng mô tả cùng một phép biến đổi trong các cơ sở khác nhau.</div>
<p>Ma trận đồng dạng có chung mọi thứ mang tính hình học chứ không phụ thuộc toạ độ: <strong>định thức</strong> (hệ số diện tích), <strong>vết</strong> (tổng đường chéo), <strong>hạng</strong> và <strong>trị riêng</strong>.</p>
<p>Chiêu mạnh: mô tả phép biến đổi trong cơ sở mà nó hiển nhiên, rồi đổi về. Với phản chiếu hay chiếu qua một đường thẳng, dùng một vector cơ sở <em>nằm trên</em> đường thẳng và một vector <em>vuông góc</em> với nó.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — phản chiếu qua y = 2x, cách dễ.</b> Lấy b<sub>1</sub> = (1, 2) (trên đường thẳng) và b<sub>2</sub> = (−2, 1) (vuông góc). Phép phản chiếu giữ b<sub>1</sub> và lật b<sub>2</sub>, nên trong cơ sở này <b>[T]<sub>B</sub> = D = diag(1, −1)</b>. Với P = [1 −2; 2 1] (det 5, P<sup>−1</sup> = (1/5)[1 2; −2 1]):</p><p>A = PDP<sup>−1</sup> = [1 2; 2 −1] · (1/5)[1 2; −2 1] = (1/5)[−3 4; 4 3] = <b>[−3/5 4/5; 4/5 3/5]</b> — đúng ma trận của Bài 3.1, không cần lượng giác.</p></div>
<div class="callout"><p><b>Ví dụ 2 — chiếu lên y = 2x.</b> Cùng cơ sở, giờ b<sub>1</sub> được giữ và b<sub>2</sub> bị ép về 0: D = diag(1, 0). A = PDP<sup>−1</sup> = (1/5)[1 2; 2 4], đúng ma trận chiếu của Bài 3.3 ✓.</p></div>
<div class="callout"><p><b>Ví dụ 3 — bất biến chung.</b> Ở Ví dụ 1, det A = −9/25 − 16/25 = −1 = det D, và vết A = 0 = 1 + (−1) = vết D ✓.</p></div>
<div class="callout"><p><b>Ví dụ 4 — giãn dọc đường chéo.</b> “Giãn 3 lần dọc (1, 1), giữ nguyên (1, −1).” P = [1 1; 1 −1], D = diag(3, 1). A = PDP<sup>−1</sup> = <b>[2 1; 1 2]</b>. Kiểm: A(1, 1) = (3, 3) ✓, A(1, −1) = (1, −1) ✓. Ta sẽ gặp lại ma trận này ở Chương 8.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết PAP<sup>−1</sup> thay cho P<sup>−1</sup>AP khi tính [T]<sub>B</sub>. Kiểm bằng cách áp lên [b<sub>1</sub>]<sub>B</sub> = e<sub>1</sub>.</li><li>Chọn các vector cơ sở không độc lập: P phải khả nghịch.</li><li>Nghĩ ma trận đồng dạng có cùng các phần tử hay cùng vector riêng. Chúng chung trị riêng, nhưng vector riêng được viết trong các toạ độ khác nhau.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>[T]<sub>B</sub> = P<sup>−1</sup>AP; A = P[T]<sub>B</sub>P<sup>−1</sup>.</li><li>Ma trận đồng dạng = cùng phép biến đổi, khác cơ sở; cùng det, vết, hạng, trị riêng.</li><li>Cơ sở thích nghi (trên đường + vuông góc) làm phản chiếu và phép chiếu thành ma trận chéo.</li><li>Tìm cơ sở làm A thành chéo = tìm vector riêng (Chương 8).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/similarity.html" target="_blank" rel="noopener">Interactive Linear Algebra — 5.3 Ma trận đồng dạng (hình học)</a></li><li><a href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/resources/lecture-31-change-of-basis-image-compression/" target="_blank" rel="noopener">MIT 18.06SC — Bài 31: Đổi cơ sở; nén ảnh</a></li><li><a href="https://en.wikipedia.org/wiki/Matrix_similarity" target="_blank" rel="noopener">Wikipedia — Ma trận đồng dạng</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Dùng b<sub>1</sub> = (1, 1), b<sub>2</sub> = (−1, 1), tìm ma trận chuẩn của phép phản chiếu qua y = x.</li><li>Tìm ma trận chuẩn giãn 2 lần dọc (1, 0) và 3 lần dọc (1, 1).</li><li>[1 2; 0 3] và [2 0; 0 2] có thể đồng dạng không? (Gợi ý: vết và det.)</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) D = diag(1, −1), P = [1 −1; 1 1], P<sup>−1</sup> = ½[1 1; −1 1] ⇒ A = [0 1; 1 0]. 2) P = [1 1; 0 1], D = diag(2, 3), P<sup>−1</sup> = [1 −1; 0 1] ⇒ A = [2 1; 0 3]. 3) Vết 4 = 4 nhưng det 3 ≠ 4: không đồng dạng.</p></div>`);

const q7 = QZ(7, 'Quiz — Chapter 7: Bases and change of basis|||Quiz — Chương 7: Cơ sở và đổi cơ sở', 'Kiểm tra chương 7: độc lập tuyến tính, cơ sở, số chiều, toạ độ theo cơ sở, ma trận đổi cơ sở, ma trận đồng dạng.', [
  Q('q1', "The vectors (1, 0, 1), (0, 1, 1), (1, 1, 2) are|||Các vector (1, 0, 1), (0, 1, 1), (1, 1, 2)",
    ['independent and span ℝ³|||độc lập và span ℝ³', 'dependent; they span a plane|||phụ thuộc; span một mặt phẳng', 'dependent; they span a line|||phụ thuộc; span một đường thẳng', 'orthogonal|||trực giao'], 1,
    "The third is the sum of the first two; rank 2.|||Vector ba là tổng hai vector đầu; hạng 2."),
  Q('q2', "The dimension of the plane x + y − z = 0 in ℝ³ is|||Số chiều của mặt phẳng x + y − z = 0 trong ℝ³ là",
    ['1|||1', '2|||2', '3|||3', '0|||0'], 1,
    "Two free variables; basis (1, 0, 1), (0, 1, 1).|||Hai biến tự do; cơ sở (1, 0, 1), (0, 1, 1)."),
  Q('q3', "Which set is a subspace of ℝ²?|||Tập nào là không gian con của ℝ²?",
    ['the line y = 2x + 1|||đường y = 2x + 1', 'the line y = 3x|||đường y = 3x', 'the unit circle|||đường tròn đơn vị', 'the first quadrant|||góc phần tư thứ nhất'], 1,
    "Only lines through the origin are closed under addition and scaling.|||Chỉ đường thẳng qua gốc mới đóng với phép cộng và nhân số."),
  Q('q4', "With B = {(1, 1), (−1, 1)}, the B-coordinates of x = (3, 1) are|||Với B = {(1, 1), (−1, 1)}, toạ độ theo B của x = (3, 1) là",
    ['(3, 1)|||(3, 1)', '(2, −1)|||(2, −1)', '(1, 2)|||(1, 2)', '(4, −2)|||(4, −2)'], 1,
    "2(1, 1) − (−1, 1) = (3, 1).|||2(1, 1) − (−1, 1) = (3, 1)."),
  Q('q5', "If P_B has the basis vectors as columns, then [x]_B equals|||Nếu P_B có các vector cơ sở làm cột thì [x]_B bằng",
    ['P_B x|||P_B x', 'P_B⁻¹ x|||P_B⁻¹ x', 'P_Bᵀ x always|||luôn là P_Bᵀ x', 'x P_B|||x P_B'], 1,
    "x = P_B [x]_B, so [x]_B = P_B⁻¹ x (Pᵀ only for orthonormal bases).|||x = P_B [x]_B nên [x]_B = P_B⁻¹ x (Pᵀ chỉ đúng với cơ sở trực chuẩn)."),
  Q('q6', "A character faces f = (0.6, 0.8) with right r = (0.8, −0.6). An enemy at offset (5, 0) has local coordinates (right, forward)|||Nhân vật nhìn theo f = (0,6; 0,8), tay phải r = (0,8; −0,6). Kẻ địch ở độ lệch (5, 0) có toạ độ cục bộ (phải, trước)",
    ['(4, 3)|||(4, 3)', '(3, 4)|||(3, 4)', '(5, 0)|||(5, 0)', '(−4, 3)|||(−4, 3)'], 0,
    "(d·r, d·f) = (4, 3) since the basis is orthonormal.|||(d·r, d·f) = (4, 3) vì cơ sở trực chuẩn."),
  Q('q7', "The matrix of T in basis B (P = P_B, A = standard matrix) is|||Ma trận của T theo cơ sở B (P = P_B, A = ma trận chuẩn) là",
    ['PAP⁻¹|||PAP⁻¹', 'P⁻¹AP|||P⁻¹AP', 'PA|||PA', 'AP|||AP'], 1,
    "Translate in with P, apply A, translate out with P⁻¹.|||Dịch vào bằng P, áp A, dịch ra bằng P⁻¹."),
  Q('q8', "“Stretch by 3 along (1, 1), keep (1, −1)” has standard matrix|||“Giãn 3 lần dọc (1, 1), giữ (1, −1)” có ma trận chuẩn",
    ['[3 0; 0 1]|||[3 0; 0 1]', '[2 1; 1 2]|||[2 1; 1 2]', '[1 2; 2 1]|||[1 2; 2 1]', '[3 1; 1 3]|||[3 1; 1 3]'], 1,
    "PDP⁻¹ with P = [1 1; 1 −1], D = diag(3, 1).|||PDP⁻¹ với P = [1 1; 1 −1], D = diag(3, 1)."),
  Q('q9', "Similar matrices always have the same|||Ma trận đồng dạng luôn có cùng",
    ['entries|||các phần tử', 'eigenvectors|||vector riêng', 'determinant and trace|||định thức và vết', 'first column|||cột đầu tiên'], 2,
    "They represent one transformation; det, trace, rank and eigenvalues are basis-independent.|||Chúng biểu diễn cùng một phép biến đổi; det, vết, hạng, trị riêng không phụ thuộc cơ sở."),
]);

const ch7 = {
  title: 'Chapter 7 — Bases, coordinates and change of basis|||Chương 7 — Cơ sở, toạ độ và đổi cơ sở',
  description: 'Không gian con, độc lập tuyến tính, cơ sở, số chiều; toạ độ theo cơ sở mới, khung cục bộ trong game; ma trận của phép biến đổi trong cơ sở khác, ma trận đồng dạng (Lay 4.3–4.4, 5.4 · ILA 2.5–2.8, 5.3).',
  lessons: [c71, c72, c73, q7],
};

// ───────────────────────────── Chương 8 ─────────────────────────────
const c81 = L('mlt201-ts-8-1',
  '8.1 — Eigenvectors: directions a transformation does not turn|||8.1 — Vector riêng: những hướng mà phép biến đổi không làm quay',
  'Av = λv; phương trình đặc trưng det(A − λI) = 0; vết = tổng, det = tích trị riêng; trị riêng của quay, phản chiếu, chiếu, trượt nhìn bằng hình; vector riêng ứng với trị riêng âm, bằng 0.',
  `<span class="eyebrow">MLT201 · Chapter 8 · Lesson 8.1</span>
<h2>Eigenvectors: directions a transformation does not turn</h2>
<p class="lead">Most vectors get knocked off their line by a transformation. A few special ones stay on their own line and are only stretched or flipped. These are the <strong>eigenvectors</strong>, and the stretch factors are the <strong>eigenvalues</strong>. They are the “natural axes” of a matrix.</p>
<h3>🎯 Objectives</h3>
<ul><li>State Av = λv and interpret it geometrically.</li><li>Find eigenvalues of a 2×2 matrix from det(A − λI) = 0, then the eigenvectors.</li><li>Use the shortcuts trace = λ<sub>1</sub> + λ<sub>2</sub>, det = λ<sub>1</sub>λ<sub>2</sub>.</li><li>Predict eigenvalues of rotations, reflections, projections and shears without computing.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Definition</span>A v = λ v  with v ≠ 0:  v is an eigenvector, λ the eigenvalue.<br>λ &gt; 1 stretch    0 &lt; λ &lt; 1 shrink    λ &lt; 0 flip to the opposite direction    λ = 0 crushed to 0 (v is in the kernel)</div>
<p>To find λ: Av = λv ⇔ (A − λI)v = 0 has a nonzero solution ⇔ A − λI squashes some direction ⇔</p>
<div class="formula"><span class="lbl">Characteristic equation (2×2)</span>det(A − λI) = 0  ⇔  λ<sup>2</sup> − (trace A) λ + det A = 0<br>λ<sub>1</sub> + λ<sub>2</sub> = trace A = a + d    λ<sub>1</sub>λ<sub>2</sub> = det A</div>
<p>Then for each λ, solve (A − λI)v = 0 for the eigenvector direction (the kernel of A − λI).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> A = [2 1; 1 2]. trace 4, det 3: λ<sup>2</sup> − 4λ + 3 = (λ − 3)(λ − 1) = 0 ⇒ <b>λ = 3, 1</b>.<br>λ = 3: A − 3I = [−1 1; 1 −1] ⇒ −x + y = 0 ⇒ v = (1, 1).<br>λ = 1: A − I = [1 1; 1 1] ⇒ x + y = 0 ⇒ v = (1, −1).<br>Geometry: A stretches by 3 along the diagonal and leaves the anti-diagonal alone — exactly how we built it in Lesson 7.3.</p></div>
<div class="callout"><p><b>Example 2.</b> A = [4 1; 2 3]: trace 7, det 10 ⇒ λ<sup>2</sup> − 7λ + 10 = 0 ⇒ λ = 5, 2. Eigenvectors: (1, 1) for 5 and (1, −2) for 2.</p></div>
<div class="callout"><p><b>Example 3 — read them from the picture.</b></p><ul><li>Projection onto a line: vectors on the line, λ = 1; perpendicular vectors, λ = 0.</li><li>Reflection across a line: on the line λ = 1; perpendicular λ = −1.</li><li>Rotation by 90°: every direction is turned, so no real eigenvector. Algebra agrees: λ<sup>2</sup> + 1 = 0 ⇒ λ = ±i (complex — Lesson 8.2).</li><li>Shear [1 1; 0 1]: λ = 1 twice, but only one eigen-direction (the x-axis). A shear has “too few” eigenvectors.</li></ul></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Taking v = 0 as an eigenvector: A0 = λ0 for every λ, so 0 is excluded by definition. (λ = 0 <em>is</em> allowed.)</li><li>Computing det(A) − λ instead of det(A − λI): subtract λ from every diagonal entry first.</li><li>Expecting a unique eigenvector: any nonzero multiple of an eigenvector is again one — eigenvectors are directions.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Eigenvector = direction kept on its own line; eigenvalue = stretch factor.</li><li>2×2: λ<sup>2</sup> − (trace)λ + det = 0; eigenvectors = kernel of A − λI.</li><li>Projection: 1, 0. Reflection: 1, −1. Rotation (θ ≠ 0°, 180°): no real eigenvalues. Shear: λ = 1 with one direction.</li><li>λ = 0 is an eigenvalue ⇔ A is not invertible.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/eigenvalues" target="_blank" rel="noopener">3Blue1Brown — Eigenvectors and eigenvalues</a></li><li><a href="https://www.3blue1brown.com/lessons/quick-eigen" target="_blank" rel="noopener">3Blue1Brown — A quick trick for computing eigenvalues</a></li><li><a href="https://textbooks.math.gatech.edu/ila/eigenvectors.html" target="_blank" rel="noopener">Interactive Linear Algebra — 5.1 Eigenvalues and Eigenvectors</a></li><li><a href="https://textbooks.math.gatech.edu/ila/characteristic-polynomial.html" target="_blank" rel="noopener">Interactive Linear Algebra — 5.2 The Characteristic Polynomial</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the eigenvalues and eigenvectors of [3 0; 0 −2]. Describe the map.</li><li>Find the eigenvalues of [5 4; 1 2].</li><li>Without computing, give the eigenvalues and eigenvectors of the reflection across y = 2x.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) λ = 3 with e<sub>1</sub>, λ = −2 with e<sub>2</sub>: stretch x by 3, stretch y by 2 and flip. 2) trace 7, det 6 ⇒ λ<sup>2</sup> − 7λ + 6 = 0 ⇒ λ = 6, 1 (eigenvectors (4, 1) and (1, −1)). 3) λ = 1 for (1, 2), λ = −1 for (−2, 1).</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 8 · Bài 8.1</span>
<h2>Vector riêng: những hướng mà phép biến đổi không làm quay</h2>
<p class="lead">Hầu hết vector bị phép biến đổi hất ra khỏi đường thẳng của chúng. Một số vector đặc biệt vẫn nằm trên đường của mình và chỉ bị giãn hoặc lật. Đó là các <strong>vector riêng</strong>, còn các hệ số giãn là <strong>trị riêng</strong>. Chúng là “các trục tự nhiên” của một ma trận.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu Av = λv và hiểu nó bằng hình học.</li><li>Tìm trị riêng của ma trận 2×2 từ det(A − λI) = 0, rồi tìm vector riêng.</li><li>Dùng mẹo vết = λ<sub>1</sub> + λ<sub>2</sub>, det = λ<sub>1</sub>λ<sub>2</sub>.</li><li>Đoán trị riêng của quay, phản chiếu, chiếu, trượt mà không cần tính.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Định nghĩa</span>A v = λ v  với v ≠ 0:  v là vector riêng, λ là trị riêng.<br>λ &gt; 1 giãn    0 &lt; λ &lt; 1 co    λ &lt; 0 lật sang hướng ngược    λ = 0 bị ép về 0 (v thuộc hạt nhân)</div>
<p>Tìm λ: Av = λv ⇔ (A − λI)v = 0 có nghiệm khác 0 ⇔ A − λI ép dẹt một hướng nào đó ⇔</p>
<div class="formula"><span class="lbl">Phương trình đặc trưng (2×2)</span>det(A − λI) = 0  ⇔  λ<sup>2</sup> − (vết A) λ + det A = 0<br>λ<sub>1</sub> + λ<sub>2</sub> = vết A = a + d    λ<sub>1</sub>λ<sub>2</sub> = det A</div>
<p>Sau đó với mỗi λ, giải (A − λI)v = 0 để được hướng của vector riêng (hạt nhân của A − λI).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> A = [2 1; 1 2]. Vết 4, det 3: λ<sup>2</sup> − 4λ + 3 = (λ − 3)(λ − 1) = 0 ⇒ <b>λ = 3, 1</b>.<br>λ = 3: A − 3I = [−1 1; 1 −1] ⇒ −x + y = 0 ⇒ v = (1, 1).<br>λ = 1: A − I = [1 1; 1 1] ⇒ x + y = 0 ⇒ v = (1, −1).<br>Hình học: A giãn 3 lần dọc đường chéo và giữ nguyên đường chéo phụ — đúng như cách ta dựng nó ở Bài 7.3.</p></div>
<div class="callout"><p><b>Ví dụ 2.</b> A = [4 1; 2 3]: vết 7, det 10 ⇒ λ<sup>2</sup> − 7λ + 10 = 0 ⇒ λ = 5, 2. Vector riêng: (1, 1) cho 5 và (1, −2) cho 2.</p></div>
<div class="callout"><p><b>Ví dụ 3 — đọc từ hình.</b></p><ul><li>Chiếu lên một đường thẳng: vector trên đường, λ = 1; vector vuông góc, λ = 0.</li><li>Phản chiếu qua một đường thẳng: trên đường λ = 1; vuông góc λ = −1.</li><li>Quay 90°: mọi hướng đều bị xoay, nên không có vector riêng thực. Đại số khớp: λ<sup>2</sup> + 1 = 0 ⇒ λ = ±i (số phức — Bài 8.2).</li><li>Trượt [1 1; 0 1]: λ = 1 (kép), nhưng chỉ một hướng riêng (trục x). Phép trượt có “quá ít” vector riêng.</li></ul></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Lấy v = 0 làm vector riêng: A0 = λ0 với mọi λ, nên 0 bị loại theo định nghĩa. (λ = 0 thì <em>được</em> phép.)</li><li>Tính det(A) − λ thay vì det(A − λI): phải trừ λ vào mọi phần tử đường chéo trước.</li><li>Mong vector riêng duy nhất: mọi bội khác 0 của vector riêng cũng là vector riêng — vector riêng là một hướng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Vector riêng = hướng được giữ trên đường của nó; trị riêng = hệ số giãn.</li><li>2×2: λ<sup>2</sup> − (vết)λ + det = 0; vector riêng = hạt nhân của A − λI.</li><li>Chiếu: 1, 0. Phản chiếu: 1, −1. Quay (θ ≠ 0°, 180°): không có trị riêng thực. Trượt: λ = 1 với một hướng.</li><li>λ = 0 là trị riêng ⇔ A không khả nghịch.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/eigenvalues" target="_blank" rel="noopener">3Blue1Brown — Vector riêng và trị riêng</a></li><li><a href="https://www.3blue1brown.com/lessons/quick-eigen" target="_blank" rel="noopener">3Blue1Brown — Mẹo tính nhanh trị riêng</a></li><li><a href="https://textbooks.math.gatech.edu/ila/eigenvectors.html" target="_blank" rel="noopener">Interactive Linear Algebra — 5.1 Trị riêng và vector riêng</a></li><li><a href="https://textbooks.math.gatech.edu/ila/characteristic-polynomial.html" target="_blank" rel="noopener">Interactive Linear Algebra — 5.2 Đa thức đặc trưng</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm trị riêng và vector riêng của [3 0; 0 −2]. Mô tả phép biến đổi.</li><li>Tìm trị riêng của [5 4; 1 2].</li><li>Không cần tính, cho trị riêng và vector riêng của phép phản chiếu qua y = 2x.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) λ = 3 với e<sub>1</sub>, λ = −2 với e<sub>2</sub>: giãn x 3 lần, giãn y 2 lần và lật. 2) Vết 7, det 6 ⇒ λ<sup>2</sup> − 7λ + 6 = 0 ⇒ λ = 6, 1 (vector riêng (4, 1) và (1, −1)). 3) λ = 1 với (1, 2), λ = −1 với (−2, 1).</p></div>`);

const c82 = L('mlt201-ts-8-2',
  '8.2 — Diagonalization, matrix powers and complex eigenvalues|||8.2 — Chéo hoá, luỹ thừa ma trận và trị riêng phức',
  'A = PDP⁻¹ nghĩa là “giãn theo các trục riêng”; Aᵏ = PDᵏP⁻¹; tính A⁵ và số Fibonacci bằng trị riêng; ma trận không chéo hoá được (phép trượt); trị riêng phức = quay + co giãn, quỹ đạo xoắn ốc; code NumPy.',
  `<span class="eyebrow">MLT201 · Chapter 8 · Lesson 8.2</span>
<h2>Diagonalization, matrix powers and complex eigenvalues</h2>
<p class="lead">If a matrix has enough eigenvectors to form a basis, then in that basis it is just a diagonal stretch. This turns hard problems — like computing A<sup>100</sup> or predicting where a repeated process goes — into easy ones.</p>
<h3>🎯 Objectives</h3>
<ul><li>Diagonalize A = PDP<sup>−1</sup> and explain it as “change basis, stretch, change back”.</li><li>Compute powers A<sup>k</sup> = PD<sup>k</sup>P<sup>−1</sup> and long-run behaviour.</li><li>Recognise matrices that cannot be diagonalized.</li><li>Interpret complex eigenvalues as rotation plus scaling.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Diagonalization</span>If A has n independent eigenvectors v<sub>1</sub>, …, v<sub>n</sub> with eigenvalues λ<sub>1</sub>, …, λ<sub>n</sub>:<br>A = P D P<sup>−1</sup>,  P = [v<sub>1</sub> … v<sub>n</sub>],  D = diag(λ<sub>1</sub>, …, λ<sub>n</sub>)    ⇒    A<sup>k</sup> = P D<sup>k</sup> P<sup>−1</sup></div>
<p>This is Lesson 7.3 read backwards: in the eigenvector basis the matrix of A is D. Applying A k times multiplies each eigen-coordinate by λ<sub>i</sub><sup>k</sup>. So the largest |λ| dominates in the long run: components along it grow (|λ| &gt; 1) or survive (λ = 1), all others fade if their |λ| &lt; 1.</p>
<p>n distinct eigenvalues ⇒ diagonalizable. Repeated eigenvalues may or may not give enough eigenvectors; the shear [1 1; 0 1] has only one direction and is <strong>not</strong> diagonalizable.</p>
<p><b>Complex eigenvalues.</b> A = [a −b; b a] = r·R(θ) with r = √(a<sup>2</sup> + b<sup>2</sup>): a rotation by θ combined with scaling by r. Its eigenvalues are a ± bi = r(cos θ ± i sin θ). No real direction is preserved; repeated application spirals outward (r &gt; 1), inward (r &lt; 1) or circles (r = 1).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — A<sup>5</sup> without multiplying five times.</b> A = [2 1; 1 2] = PDP<sup>−1</sup> with P = [1 1; 1 −1], D = diag(3, 1). A<sup>5</sup> = P diag(243, 1) P<sup>−1</sup> = ½[244 242; 242 244] = <b>[122 121; 121 122]</b>.</p></div>
<div class="callout"><p><b>Example 2 — Fibonacci.</b> (F<sub>k+1</sub>, F<sub>k</sub>) = F (F<sub>k</sub>, F<sub>k−1</sub>) with F = [1 1; 1 0]. Eigenvalues: λ<sup>2</sup> − λ − 1 = 0 ⇒ λ = (1 ± √5)/2 ≈ 1.618 and −0.618. The second fades, so F<sub>k+1</sub>/F<sub>k</sub> → <b>1.618…</b> (the golden ratio), and F<sup>10</sup> = [89 55; 55 34] contains F<sub>11</sub> = 89, F<sub>10</sub> = 55.</p></div>
<div class="callout"><p><b>Example 3 — a spiral.</b> C = [1 −1; 1 1] = √2·R(45°), eigenvalues 1 ± i. Each step rotates by 45° and stretches by √2, so after 8 steps: one full turn and a stretch of (√2)<sup>8</sup> = 16. Indeed C<sup>8</sup> = 16I.</p></div>
<h3>💻 Check it in NumPy</h3>
<pre><code class="language-python">import numpy as np
np.set_printoptions(precision=4, suppress=True)
A = np.array([[2., 1.],
              [1., 2.]])
lam, P = np.linalg.eigh(A)       # symmetric matrix: real eigenvalues, orthonormal eigenvectors
print(lam)
print(P)
A5 = P @ np.diag(lam**5) @ P.T   # A^5 = P D^5 P^(-1), and here P^(-1) = P^T
print(np.round(A5, 6))
print(np.linalg.matrix_power(A, 5))</code></pre>
<div class="out">[1. 3.]
[[-0.7071  0.7071]
 [ 0.7071  0.7071]]
[[122. 121.]
 [121. 122.]]
[[122. 121.]
 [121. 122.]]</div>
<p><code>eigh</code> sorts eigenvalues in increasing order and returns <em>unit</em> eigenvectors (signs may differ from hand work — any multiple is fine). For non-symmetric matrices use <code>np.linalg.eig</code>, which may return complex numbers.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Putting eigenvectors in P in a different order from their eigenvalues in D.</li><li>Writing A<sup>k</sup> = P<sup>k</sup>D<sup>k</sup>P<sup>−k</sup>. Only D gets the power.</li><li>Assuming every matrix is diagonalizable (shears are not).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>A = PDP<sup>−1</sup>: in the eigenbasis A is a pure stretch.</li><li>A<sup>k</sup> = PD<sup>k</sup>P<sup>−1</sup>; the largest |λ| controls the long run.</li><li>Not enough eigenvectors ⇒ not diagonalizable (shear).</li><li>Complex λ = r(cos θ ± i sin θ): rotation by θ with scaling r — spirals.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/diagonalization.html" target="_blank" rel="noopener">Interactive Linear Algebra — 5.4 Diagonalization</a></li><li><a href="https://textbooks.math.gatech.edu/ila/complex-eigenvalues.html" target="_blank" rel="noopener">Interactive Linear Algebra — 5.5 Complex Eigenvalues</a></li><li><a href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/resources/lecture-22-diagonalization-and-powers-of-a/" target="_blank" rel="noopener">MIT 18.06SC — Lecture 22: Diagonalization and Powers of A</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.eig.html" target="_blank" rel="noopener">NumPy — numpy.linalg.eig</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Diagonalize [4 1; 2 3] (eigenvalues 5, 2) and write A<sup>k</sup> in the form P D<sup>k</sup> P<sup>−1</sup>.</li><li>Is [2 1; 0 2] diagonalizable?</li><li>For [0 −2; 2 0], find r and θ. What does repeated application do?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) P = [1 1; 1 −2], D = diag(5, 2), P<sup>−1</sup> = (1/3)[2 1; 1 −1]; A<sup>k</sup> = P diag(5<sup>k</sup>, 2<sup>k</sup>) P<sup>−1</sup>. 2) λ = 2 twice, A − 2I = [0 1; 0 0] has a 1-dimensional kernel: only one eigen-direction, not diagonalizable. 3) r = 2, θ = 90°: each step turns 90° and doubles the length — an outward square spiral.</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 8 · Bài 8.2</span>
<h2>Chéo hoá, luỹ thừa ma trận và trị riêng phức</h2>
<p class="lead">Nếu một ma trận có đủ vector riêng để làm thành một cơ sở, thì trong cơ sở đó nó chỉ là phép giãn theo đường chéo. Điều này biến các bài khó — như tính A<sup>100</sup> hay dự đoán một quá trình lặp đi về đâu — thành bài dễ.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Chéo hoá A = PDP<sup>−1</sup> và giải thích là “đổi cơ sở, giãn, đổi lại”.</li><li>Tính luỹ thừa A<sup>k</sup> = PD<sup>k</sup>P<sup>−1</sup> và hành vi dài hạn.</li><li>Nhận ra ma trận không chéo hoá được.</li><li>Hiểu trị riêng phức là quay cộng co giãn.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Chéo hoá</span>Nếu A có n vector riêng độc lập v<sub>1</sub>, …, v<sub>n</sub> ứng với trị riêng λ<sub>1</sub>, …, λ<sub>n</sub>:<br>A = P D P<sup>−1</sup>,  P = [v<sub>1</sub> … v<sub>n</sub>],  D = diag(λ<sub>1</sub>, …, λ<sub>n</sub>)    ⇒    A<sup>k</sup> = P D<sup>k</sup> P<sup>−1</sup></div>
<p>Đây là Bài 7.3 đọc ngược: trong cơ sở vector riêng, ma trận của A là D. Áp A k lần là nhân mỗi toạ độ riêng với λ<sub>i</sub><sup>k</sup>. Vì thế |λ| lớn nhất áp đảo về lâu dài: thành phần theo nó tăng (|λ| &gt; 1) hoặc tồn tại (λ = 1), mọi thành phần khác tắt dần nếu |λ| &lt; 1.</p>
<p>n trị riêng phân biệt ⇒ chéo hoá được. Trị riêng lặp có thể có hoặc không đủ vector riêng; phép trượt [1 1; 0 1] chỉ có một hướng và <strong>không</strong> chéo hoá được.</p>
<p><b>Trị riêng phức.</b> A = [a −b; b a] = r·R(θ) với r = √(a<sup>2</sup> + b<sup>2</sup>): phép quay góc θ kết hợp phóng r lần. Trị riêng là a ± bi = r(cos θ ± i sin θ). Không hướng thực nào được giữ; áp lặp lại sẽ xoắn ốc ra ngoài (r &gt; 1), vào trong (r &lt; 1) hoặc chạy vòng tròn (r = 1).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — A<sup>5</sup> mà không nhân năm lần.</b> A = [2 1; 1 2] = PDP<sup>−1</sup> với P = [1 1; 1 −1], D = diag(3, 1). A<sup>5</sup> = P diag(243, 1) P<sup>−1</sup> = ½[244 242; 242 244] = <b>[122 121; 121 122]</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — Fibonacci.</b> (F<sub>k+1</sub>, F<sub>k</sub>) = F (F<sub>k</sub>, F<sub>k−1</sub>) với F = [1 1; 1 0]. Trị riêng: λ<sup>2</sup> − λ − 1 = 0 ⇒ λ = (1 ± √5)/2 ≈ 1,618 và −0,618. Trị thứ hai tắt dần, nên F<sub>k+1</sub>/F<sub>k</sub> → <b>1,618…</b> (tỉ lệ vàng), và F<sup>10</sup> = [89 55; 55 34] chứa F<sub>11</sub> = 89, F<sub>10</sub> = 55.</p></div>
<div class="callout"><p><b>Ví dụ 3 — xoắn ốc.</b> C = [1 −1; 1 1] = √2·R(45°), trị riêng 1 ± i. Mỗi bước quay 45° và giãn √2, nên sau 8 bước: đúng một vòng và giãn (√2)<sup>8</sup> = 16. Thật vậy C<sup>8</sup> = 16I.</p></div>
<h3>💻 Kiểm bằng NumPy</h3>
<pre><code class="language-python">import numpy as np
np.set_printoptions(precision=4, suppress=True)
A = np.array([[2., 1.],
              [1., 2.]])
lam, P = np.linalg.eigh(A)       # symmetric matrix: real eigenvalues, orthonormal eigenvectors
print(lam)
print(P)
A5 = P @ np.diag(lam**5) @ P.T   # A^5 = P D^5 P^(-1), and here P^(-1) = P^T
print(np.round(A5, 6))
print(np.linalg.matrix_power(A, 5))</code></pre>
<div class="out">[1. 3.]
[[-0.7071  0.7071]
 [ 0.7071  0.7071]]
[[122. 121.]
 [121. 122.]]
[[122. 121.]
 [121. 122.]]</div>
<p><code>eigh</code> xếp trị riêng tăng dần và trả về vector riêng <em>đơn vị</em> (dấu có thể khác khi làm tay — bội nào cũng được). Với ma trận không đối xứng dùng <code>np.linalg.eig</code>, có thể trả về số phức.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Xếp vector riêng trong P khác thứ tự với trị riêng trong D.</li><li>Viết A<sup>k</sup> = P<sup>k</sup>D<sup>k</sup>P<sup>−k</sup>. Chỉ D mới mũ k.</li><li>Cho rằng mọi ma trận đều chéo hoá được (phép trượt thì không).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>A = PDP<sup>−1</sup>: trong cơ sở riêng A là phép giãn thuần tuý.</li><li>A<sup>k</sup> = PD<sup>k</sup>P<sup>−1</sup>; |λ| lớn nhất quyết định dài hạn.</li><li>Không đủ vector riêng ⇒ không chéo hoá được (phép trượt).</li><li>λ phức = r(cos θ ± i sin θ): quay θ kèm phóng r — xoắn ốc.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/diagonalization.html" target="_blank" rel="noopener">Interactive Linear Algebra — 5.4 Chéo hoá</a></li><li><a href="https://textbooks.math.gatech.edu/ila/complex-eigenvalues.html" target="_blank" rel="noopener">Interactive Linear Algebra — 5.5 Trị riêng phức</a></li><li><a href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/resources/lecture-22-diagonalization-and-powers-of-a/" target="_blank" rel="noopener">MIT 18.06SC — Bài 22: Chéo hoá và luỹ thừa của A</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.eig.html" target="_blank" rel="noopener">NumPy — numpy.linalg.eig</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Chéo hoá [4 1; 2 3] (trị riêng 5, 2) và viết A<sup>k</sup> dưới dạng P D<sup>k</sup> P<sup>−1</sup>.</li><li>[2 1; 0 2] có chéo hoá được không?</li><li>Với [0 −2; 2 0], tìm r và θ. Áp lặp lại thì sao?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) P = [1 1; 1 −2], D = diag(5, 2), P<sup>−1</sup> = (1/3)[2 1; 1 −1]; A<sup>k</sup> = P diag(5<sup>k</sup>, 2<sup>k</sup>) P<sup>−1</sup>. 2) λ = 2 (kép), A − 2I = [0 1; 0 0] có hạt nhân 1 chiều: chỉ một hướng riêng, không chéo hoá được. 3) r = 2, θ = 90°: mỗi bước quay 90° và gấp đôi độ dài — xoắn ốc vuông ra ngoài.</p></div>`);

const c83 = L('mlt201-ts-8-3',
  '8.3 — Markov chains and PageRank: the eigenvalue 1|||8.3 — Chuỗi Markov và PageRank: trị riêng bằng 1',
  'Ma trận ngẫu nhiên (cột tổng bằng 1), xₖ₊₁ = Pxₖ; trạng thái dừng là vector riêng ứng với λ = 1; tốc độ hội tụ theo trị riêng thứ hai; ví dụ hai nhà mạng; PageRank 4 trang với hệ số giảm chấn 0,85; code NumPy.',
  `<span class="eyebrow">MLT201 · Chapter 8 · Lesson 8.3</span>
<h2>Markov chains and PageRank</h2>
<p class="lead">A <strong>Markov chain</strong> describes things that move between states with fixed probabilities: customers switching networks, a robot moving between rooms, a random web surfer clicking links. Where everything settles is an <strong>eigenvector with eigenvalue 1</strong>.</p>
<h3>🎯 Objectives</h3>
<ul><li>Build a column-stochastic transition matrix and iterate x<sub>k+1</sub> = Px<sub>k</sub>.</li><li>Find the steady state by solving (P − I)x = 0 and normalising.</li><li>Explain convergence speed with the second eigenvalue.</li><li>Compute PageRank for a small web graph.</li></ul>
<h3>📖 Lecture</h3>
<p>Entry P<sub>ij</sub> = probability of moving <em>to</em> state i <em>from</em> state j. Each column sums to 1 (from any state you must go somewhere), so P is <strong>column-stochastic</strong>. If x<sub>k</sub> holds the probabilities (or market shares) at step k, then x<sub>k+1</sub> = Px<sub>k</sub>.</p>
<div class="formula"><span class="lbl">Facts about stochastic matrices</span>λ = 1 is always an eigenvalue; every other eigenvalue has |λ| ≤ 1.<br>Steady state q: Pq = q, entries ≥ 0, summing to 1.  If all entries of P (or of some power) are positive, x<sub>k</sub> → q from any start.<br>Speed: the error shrinks roughly like |λ<sub>2</sub>|<sup>k</sup> (second-largest eigenvalue).</div>
<p>Why? Diagonalize: x<sub>k</sub> = c<sub>1</sub>1<sup>k</sup>q + c<sub>2</sub>λ<sub>2</sub><sup>k</sup>v<sub>2</sub> + … — every term except the first fades (Lesson 8.2).</p>
<h3>✍️ Worked example — two mobile networks</h3>
<div class="callout"><p>Each month 10 % of network A's customers move to B and 20 % of B's move to A: P = [0.9 0.2; 0.1 0.8]. Start with equal shares x<sub>0</sub> = (0.5, 0.5): x<sub>1</sub> = (0.55, 0.45), x<sub>2</sub> = (0.585, 0.415), x<sub>3</sub> = (0.6095, 0.3905), …</p>
<p>Steady state: (P − I)q = 0 gives −0.1q<sub>1</sub> + 0.2q<sub>2</sub> = 0 ⇒ q<sub>1</sub> = 2q<sub>2</sub>; with q<sub>1</sub> + q<sub>2</sub> = 1: <b>q = (2/3, 1/3)</b>. The other eigenvalue is trace − 1 = 1.7 − 1 = 0.7, so the gap to equilibrium shrinks by 30 % each month.</p></div>
<h3>🌐 PageRank</h3>
<p>Google's original idea: a page is important if important pages link to it. Model a surfer who clicks a random outgoing link. For four pages with links 1→2, 1→3, 2→3, 3→1, 4→1, 4→3, column j of L spreads page j's vote equally over its links. To make the chain well behaved, with probability 0.15 the surfer jumps to a random page: G = 0.85L + 0.15/4·(all-ones matrix). The PageRank vector is the steady state of G.</p>
<h3>💻 Check it in NumPy</h3>
<pre><code class="language-python">import numpy as np
P = np.array([[0.9, 0.2],
              [0.1, 0.8]])        # column-stochastic: each column sums to 1
x = np.array([0.5, 0.5])
for k in range(30):
    x = P @ x
print(np.round(x, 4))

# PageRank of 4 pages: 1->2,3   2->3   3->1   4->1,3
L = np.array([[0,   0, 1, 0.5],
              [0.5, 0, 0, 0  ],
              [0.5, 1, 0, 0.5],
              [0,   0, 0, 0  ]])
d, n = 0.85, 4
G = d * L + (1 - d) / n * np.ones((n, n))   # the "Google matrix"
r = np.ones(n) / n
for k in range(100):
    r = G @ r
print(np.round(r, 4), round(r.sum(), 6))</code></pre>
<div class="out">[0.6667 0.3333]
[0.3797 0.1989 0.3839 0.0375] 1.0</div>
<p>Page 3 (linked from three pages) and page 1 (linked from page 3, which is important) rank highest; page 4, which nobody links to, keeps only the random-jump share 0.15/4 = 0.0375. Repeatedly multiplying like this is the <strong>power method</strong> — it is how eigenvectors of huge sparse matrices are computed in practice.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Mixing conventions: here columns sum to 1 and x is a column. Many probability books use rows summing to 1 and row vectors (xP); the matrix is then the transpose.</li><li>Forgetting to normalise the eigenvector so its entries sum to 1.</li><li>Assuming convergence always happens: P = [0 1; 1 0] swaps forever (its eigenvalues are 1 and −1).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Column-stochastic P, x<sub>k+1</sub> = Px<sub>k</sub>.</li><li>Steady state = eigenvector for λ = 1, normalised to sum 1.</li><li>Convergence speed ≈ |λ<sub>2</sub>|<sup>k</sup>.</li><li>PageRank = steady state of the damped “Google matrix”, found by the power method.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/stochastic-matrices.html" target="_blank" rel="noopener">Interactive Linear Algebra — 5.6 Stochastic Matrices (includes PageRank)</a></li><li><a href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/resources/lecture-24-markov-matrices-fourier-series/" target="_blank" rel="noopener">MIT 18.06SC — Lecture 24: Markov Matrices</a></li><li><a href="https://en.wikipedia.org/wiki/PageRank" target="_blank" rel="noopener">Wikipedia — PageRank</a></li><li><a href="https://en.wikipedia.org/wiki/Stochastic_matrix" target="_blank" rel="noopener">Wikipedia — Stochastic matrix</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the steady state of P = [0.7 0.4; 0.3 0.6].</li><li>What is its second eigenvalue, and how fast does it converge?</li><li>In the PageRank example, why does page 2 get 0.85·½·r<sub>1</sub> + 0.0375?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) −0.3q<sub>1</sub> + 0.4q<sub>2</sub> = 0 ⇒ q = (4/7, 3/7) ≈ (0.571, 0.429). 2) λ<sub>2</sub> = trace − 1 = 0.3: the gap shrinks by 70 % per step — fast. 3) Its only incoming link is from page 1, which splits its rank between two links; plus the random-jump share. Check: 0.85·0.5·0.3797 + 0.0375 ≈ 0.1989 ✓.</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 8 · Bài 8.3</span>
<h2>Chuỗi Markov và PageRank</h2>
<p class="lead"><strong>Chuỗi Markov</strong> mô tả những thứ di chuyển giữa các trạng thái với xác suất cố định: khách hàng chuyển nhà mạng, robot đi giữa các phòng, người lướt web ngẫu nhiên bấm vào liên kết. Nơi mọi thứ ổn định chính là <strong>vector riêng ứng với trị riêng 1</strong>.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Lập ma trận chuyển trạng thái ngẫu nhiên theo cột và lặp x<sub>k+1</sub> = Px<sub>k</sub>.</li><li>Tìm trạng thái dừng bằng cách giải (P − I)x = 0 rồi chuẩn hoá.</li><li>Giải thích tốc độ hội tụ bằng trị riêng thứ hai.</li><li>Tính PageRank cho một đồ thị web nhỏ.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Phần tử P<sub>ij</sub> = xác suất chuyển <em>tới</em> trạng thái i <em>từ</em> trạng thái j. Mỗi cột có tổng bằng 1 (từ trạng thái nào cũng phải đi đâu đó), nên P là ma trận <strong>ngẫu nhiên theo cột</strong>. Nếu x<sub>k</sub> chứa các xác suất (hay thị phần) ở bước k thì x<sub>k+1</sub> = Px<sub>k</sub>.</p>
<div class="formula"><span class="lbl">Tính chất của ma trận ngẫu nhiên</span>λ = 1 luôn là trị riêng; mọi trị riêng khác có |λ| ≤ 1.<br>Trạng thái dừng q: Pq = q, các phần tử ≥ 0, tổng bằng 1.  Nếu mọi phần tử của P (hoặc của một luỹ thừa) dương thì x<sub>k</sub> → q từ mọi điểm xuất phát.<br>Tốc độ: sai số giảm cỡ |λ<sub>2</sub>|<sup>k</sup> (trị riêng lớn thứ hai).</div>
<p>Vì sao? Chéo hoá: x<sub>k</sub> = c<sub>1</sub>1<sup>k</sup>q + c<sub>2</sub>λ<sub>2</sub><sup>k</sup>v<sub>2</sub> + … — mọi số hạng trừ số hạng đầu đều tắt dần (Bài 8.2).</p>
<h3>✍️ Ví dụ — hai nhà mạng di động</h3>
<div class="callout"><p>Mỗi tháng 10 % khách của nhà mạng A chuyển sang B và 20 % khách của B chuyển sang A: P = [0,9 0,2; 0,1 0,8]. Bắt đầu với thị phần bằng nhau x<sub>0</sub> = (0,5; 0,5): x<sub>1</sub> = (0,55; 0,45), x<sub>2</sub> = (0,585; 0,415), x<sub>3</sub> = (0,6095; 0,3905), …</p>
<p>Trạng thái dừng: (P − I)q = 0 cho −0,1q<sub>1</sub> + 0,2q<sub>2</sub> = 0 ⇒ q<sub>1</sub> = 2q<sub>2</sub>; với q<sub>1</sub> + q<sub>2</sub> = 1: <b>q = (2/3, 1/3)</b>. Trị riêng còn lại là vết − 1 = 1,7 − 1 = 0,7, nên khoảng cách tới cân bằng giảm 30 % mỗi tháng.</p></div>
<h3>🌐 PageRank</h3>
<p>Ý tưởng gốc của Google: một trang quan trọng nếu các trang quan trọng liên kết tới nó. Mô hình hoá một người lướt web bấm ngẫu nhiên vào một liên kết đi ra. Với bốn trang có liên kết 1→2, 1→3, 2→3, 3→1, 4→1, 4→3, cột j của L chia đều “phiếu bầu” của trang j cho các liên kết của nó. Để chuỗi hoạt động tốt, với xác suất 0,15 người lướt nhảy tới một trang ngẫu nhiên: G = 0,85L + 0,15/4·(ma trận toàn số 1). Vector PageRank là trạng thái dừng của G.</p>
<h3>💻 Kiểm bằng NumPy</h3>
<pre><code class="language-python">import numpy as np
P = np.array([[0.9, 0.2],
              [0.1, 0.8]])        # column-stochastic: each column sums to 1
x = np.array([0.5, 0.5])
for k in range(30):
    x = P @ x
print(np.round(x, 4))

# PageRank of 4 pages: 1->2,3   2->3   3->1   4->1,3
L = np.array([[0,   0, 1, 0.5],
              [0.5, 0, 0, 0  ],
              [0.5, 1, 0, 0.5],
              [0,   0, 0, 0  ]])
d, n = 0.85, 4
G = d * L + (1 - d) / n * np.ones((n, n))   # the "Google matrix"
r = np.ones(n) / n
for k in range(100):
    r = G @ r
print(np.round(r, 4), round(r.sum(), 6))</code></pre>
<div class="out">[0.6667 0.3333]
[0.3797 0.1989 0.3839 0.0375] 1.0</div>
<p>Trang 3 (được ba trang liên kết tới) và trang 1 (được trang 3 — một trang quan trọng — liên kết tới) xếp hạng cao nhất; trang 4, không ai liên kết tới, chỉ giữ phần nhảy ngẫu nhiên 0,15/4 = 0,0375. Nhân lặp đi lặp lại như vậy là <strong>phương pháp luỹ thừa</strong> — cách thực tế để tính vector riêng của những ma trận thưa khổng lồ.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Lẫn quy ước: ở đây cột có tổng 1 và x là cột. Nhiều sách xác suất dùng hàng có tổng 1 và vector hàng (xP); khi đó ma trận là chuyển vị.</li><li>Quên chuẩn hoá vector riêng để tổng các phần tử bằng 1.</li><li>Cho rằng lúc nào cũng hội tụ: P = [0 1; 1 0] đổi chỗ mãi mãi (trị riêng 1 và −1).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>P ngẫu nhiên theo cột, x<sub>k+1</sub> = Px<sub>k</sub>.</li><li>Trạng thái dừng = vector riêng ứng λ = 1, chuẩn hoá tổng bằng 1.</li><li>Tốc độ hội tụ ≈ |λ<sub>2</sub>|<sup>k</sup>.</li><li>PageRank = trạng thái dừng của “ma trận Google” có giảm chấn, tìm bằng phương pháp luỹ thừa.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/stochastic-matrices.html" target="_blank" rel="noopener">Interactive Linear Algebra — 5.6 Ma trận ngẫu nhiên (có PageRank)</a></li><li><a href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/resources/lecture-24-markov-matrices-fourier-series/" target="_blank" rel="noopener">MIT 18.06SC — Bài 24: Ma trận Markov</a></li><li><a href="https://en.wikipedia.org/wiki/PageRank" target="_blank" rel="noopener">Wikipedia — PageRank</a></li><li><a href="https://en.wikipedia.org/wiki/Stochastic_matrix" target="_blank" rel="noopener">Wikipedia — Ma trận ngẫu nhiên</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm trạng thái dừng của P = [0,7 0,4; 0,3 0,6].</li><li>Trị riêng thứ hai của nó bằng bao nhiêu, và hội tụ nhanh cỡ nào?</li><li>Trong ví dụ PageRank, vì sao trang 2 nhận 0,85·½·r<sub>1</sub> + 0,0375?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) −0,3q<sub>1</sub> + 0,4q<sub>2</sub> = 0 ⇒ q = (4/7, 3/7) ≈ (0,571; 0,429). 2) λ<sub>2</sub> = vết − 1 = 0,3: khoảng cách giảm 70 % mỗi bước — nhanh. 3) Liên kết tới duy nhất là từ trang 1, mà trang 1 chia hạng của nó cho hai liên kết; cộng thêm phần nhảy ngẫu nhiên. Kiểm: 0,85·0,5·0,3797 + 0,0375 ≈ 0,1989 ✓.</p></div>`);

const q8 = QZ(8, 'Quiz — Chapter 8: Eigenvalues, diagonalization, Markov chains|||Quiz — Chương 8: Trị riêng, chéo hoá, chuỗi Markov', 'Kiểm tra chương 8: Av = λv, phương trình đặc trưng, trị riêng theo hình, chéo hoá, luỹ thừa, trị riêng phức, trạng thái dừng, PageRank.', [
  Q('q1', "The eigenvalues of [2 1; 1 2] are|||Trị riêng của [2 1; 1 2] là",
    ['2 and 2|||2 và 2', '3 and 1|||3 và 1', '4 and 3|||4 và 3', '1 and −1|||1 và −1'], 1,
    "λ² − 4λ + 3 = 0.|||λ² − 4λ + 3 = 0."),
  Q('q2', "An eigenvector of [2 1; 1 2] for λ = 3 is|||Một vector riêng của [2 1; 1 2] ứng với λ = 3 là",
    ['(1, −1)|||(1, −1)', '(1, 1)|||(1, 1)', '(1, 0)|||(1, 0)', '(0, 0)|||(0, 0)'], 1,
    "A(1, 1) = (3, 3) = 3(1, 1).|||A(1, 1) = (3, 3) = 3(1, 1)."),
  Q('q3', "A reflection across a line has eigenvalues|||Phép phản chiếu qua một đường thẳng có trị riêng",
    ['1 and 0|||1 và 0', '1 and −1|||1 và −1', 'i and −i|||i và −i', '2 and 1|||2 và 1'], 1,
    "Vectors on the line stay (1); perpendicular ones flip (−1).|||Vector trên đường giữ nguyên (1); vector vuông góc bị lật (−1)."),
  Q('q4', "A rotation of the plane by 90° has|||Phép quay mặt phẳng 90° có",
    ['two real eigenvalues|||hai trị riêng thực', 'eigenvalue 1 only|||chỉ trị riêng 1', 'no real eigenvalues (λ = ±i)|||không có trị riêng thực (λ = ±i)', 'eigenvalue 0|||trị riêng 0'], 2,
    "It turns every direction; λ² + 1 = 0.|||Nó xoay mọi hướng; λ² + 1 = 0."),
  Q('q5', "A 2×2 matrix has trace 7 and determinant 10. Its eigenvalues are|||Ma trận 2×2 có vết 7 và định thức 10. Trị riêng là",
    ['5 and 2|||5 và 2', '7 and 10|||7 và 10', '3 and 4|||3 và 4', '10 and −3|||10 và −3'], 0,
    "Sum 7, product 10.|||Tổng 7, tích 10."),
  Q('q6', "If A = PDP⁻¹, then A⁵ equals|||Nếu A = PDP⁻¹ thì A⁵ bằng",
    ['P⁵D⁵P⁻⁵|||P⁵D⁵P⁻⁵', 'PD⁵P⁻¹|||PD⁵P⁻¹', '5PDP⁻¹|||5PDP⁻¹', 'D⁵|||D⁵'], 1,
    "The inner P⁻¹P pairs cancel.|||Các cặp P⁻¹P ở giữa triệt tiêu."),
  Q('q7', "The shear [1 1; 0 1] is not diagonalizable because|||Phép trượt [1 1; 0 1] không chéo hoá được vì",
    ['its determinant is 1|||định thức bằng 1', 'it has only one independent eigenvector|||nó chỉ có một vector riêng độc lập', 'its eigenvalues are complex|||trị riêng phức', 'it is not invertible|||nó không khả nghịch'], 1,
    "λ = 1 twice, but A − I = [0 1; 0 0] has a 1-dimensional kernel.|||λ = 1 kép, nhưng A − I = [0 1; 0 0] có hạt nhân 1 chiều."),
  Q('q8', "The steady state of P = [0.9 0.2; 0.1 0.8] is|||Trạng thái dừng của P = [0,9 0,2; 0,1 0,8] là",
    ['(1/2, 1/2)|||(1/2, 1/2)', '(2/3, 1/3)|||(2/3, 1/3)', '(1/3, 2/3)|||(1/3, 2/3)', '(0.9, 0.1)|||(0,9; 0,1)'], 1,
    "−0.1q₁ + 0.2q₂ = 0 and q₁ + q₂ = 1.|||−0,1q₁ + 0,2q₂ = 0 và q₁ + q₂ = 1."),
  Q('q9', "For a column-stochastic matrix, the speed of convergence to the steady state is governed by|||Với ma trận ngẫu nhiên theo cột, tốc độ hội tụ về trạng thái dừng được quyết định bởi",
    ['the largest eigenvalue 1|||trị riêng lớn nhất 1', 'the second-largest eigenvalue in absolute value|||trị riêng lớn thứ hai về trị tuyệt đối', 'the determinant|||định thức', 'the number of states only|||chỉ số trạng thái'], 1,
    "The error behaves like |λ₂|ᵏ.|||Sai số giảm cỡ |λ₂|ᵏ."),
]);

const ch8 = {
  title: 'Chapter 8 — Eigenvalues: invariant directions and dynamics|||Chương 8 — Trị riêng: hướng bất biến và hệ động lực',
  description: 'Vector riêng là hướng không bị quay, phương trình đặc trưng, trị riêng của các phép biến đổi quen thuộc, chéo hoá và luỹ thừa, Fibonacci, trị riêng phức và xoắn ốc, chuỗi Markov, PageRank (Lay ch.5, 4.9 · Strang ch.6 · ILA ch.5).',
  lessons: [c81, c82, c83, q8],
};

// ───────────────────────────── Chương 9 ─────────────────────────────
const c91 = L('mlt201-ts-9-1',
  '9.1 — Orthogonal matrices and least squares: the best approximate solution|||9.1 — Ma trận trực giao và bình phương tối thiểu: nghiệm xấp xỉ tốt nhất',
  'Ma trận trực giao QᵀQ = I giữ độ dài và góc (quay/phản chiếu); hệ Ax = b vô nghiệm ⇒ chiếu b lên không gian cột; phương trình chuẩn AᵀAx̂ = Aᵀb; khớp đường thẳng qua 4 điểm; numpy.linalg.lstsq.',
  `<span class="eyebrow">MLT201 · Chapter 9 · Lesson 9.1</span>
<h2>Orthogonal matrices and least squares</h2>
<p class="lead">Real data never fits a model exactly: four measured points rarely lie on one line. When Ax = b has no solution, the best we can do is find the x whose Ax is <strong>closest</strong> to b — and “closest” is a projection.</p>
<h3>🎯 Objectives</h3>
<ul><li>Recognise orthogonal matrices (Q<sup>T</sup>Q = I) and what they preserve.</li><li>Explain least squares as projecting b onto the column space.</li><li>Solve the normal equations A<sup>T</sup>A x̂ = A<sup>T</sup>b to fit a line.</li><li>Use <code>np.linalg.lstsq</code>.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Orthogonal matrix</span>Q<sup>T</sup>Q = I  ⇔  columns are perpendicular unit vectors  ⇔  Q<sup>−1</sup> = Q<sup>T</sup><br>‖Qx‖ = ‖x‖,  (Qx)·(Qy) = x·y,  det Q = ±1  (rotation if +1, reflection if −1)</div>
<p>Orthogonal matrices are the rigid motions of Chapter 3. Numerically they are perfect: they never amplify rounding errors, which is why graphics and robotics store orientations as orthogonal matrices (and re-orthogonalise them when errors creep in).</p>
<p><b>Least squares.</b> If b is not in Col A, no x solves Ax = b. The set of all Ax is a plane (or subspace); the closest point to b is its orthogonal projection p = Ax̂. The error e = b − Ax̂ must be <em>perpendicular</em> to every column of A, i.e. A<sup>T</sup>e = 0:</p>
<div class="formula"><span class="lbl">Normal equations</span>A<sup>T</sup>A x̂ = A<sup>T</sup>b    (x̂ minimises ‖b − Ax‖<sup>2</sup>, the sum of squared errors)</div>
<p>Fitting a line y = c<sub>0</sub> + c<sub>1</sub>t to points (t<sub>i</sub>, y<sub>i</sub>): each point gives an equation c<sub>0</sub> + c<sub>1</sub>t<sub>i</sub> = y<sub>i</sub>, so A has a column of 1s and a column of t<sub>i</sub>. This is <strong>linear regression</strong>, the first model of every machine-learning course.</p>
<h3>✍️ Worked example — fit a line</h3>
<div class="callout"><p>Points (0, 1), (1, 2), (2, 2), (3, 4). A = [1 0; 1 1; 1 2; 1 3], b = (1, 2, 2, 4).</p>
<p>A<sup>T</sup>A = [4 6; 6 14] (4 points; Σt = 6; Σt<sup>2</sup> = 14). A<sup>T</sup>b = (Σy, Σty) = (9, 18).</p>
<p>Solve 4c<sub>0</sub> + 6c<sub>1</sub> = 9, 6c<sub>0</sub> + 14c<sub>1</sub> = 18: det = 56 − 36 = 20, c<sub>0</sub> = (9·14 − 6·18)/20 = 0.9, c<sub>1</sub> = (4·18 − 6·9)/20 = 0.9. <b>Best line: y = 0.9 + 0.9t.</b></p>
<p>Errors e = b − Ax̂ = (0.1, 0.2, −0.7, 0.4); A<sup>T</sup>e = (0, 0) ✓ (perpendicular to both columns); sum of squared errors 0.7.</p></div>
<h3>💻 Check it in NumPy</h3>
<pre><code class="language-python">import numpy as np
t = np.array([0, 1, 2, 3])
y = np.array([1, 2, 2, 4])
A = np.column_stack([np.ones(4), t])     # columns: 1 and t
c, res, rank, sv = np.linalg.lstsq(A, y)
print(c)          # [c0, c1] of y = c0 + c1 t
print(res)        # squared length of the error vector
r = y - A @ c
print(np.round(A.T @ r, 10) + 0.0)       # the error is orthogonal to both columns</code></pre>
<div class="out">[0.9 0.9]
[0.7]
[0. 0.]</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking least squares minimises the perpendicular distance to the line. It minimises <em>vertical</em> errors (in y). Perpendicular fitting is PCA (Chapter 10).</li><li>Forming A<sup>T</sup>A for badly scaled data in production code: it squares the condition number. Libraries use QR or SVD instead (that is what <code>lstsq</code> does).</li><li>Calling a matrix with orthogonal but non-unit columns “orthogonal”: Q<sup>T</sup>Q must be I, not just diagonal.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Orthogonal Q: Q<sup>T</sup>Q = I, preserves lengths and angles, det ±1.</li><li>Least squares: project b onto Col A; error ⟂ columns.</li><li>Normal equations A<sup>T</sup>Ax̂ = A<sup>T</sup>b.</li><li>Line fit = linear regression.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/least-squares.html" target="_blank" rel="noopener">Interactive Linear Algebra — 6.5 The Method of Least Squares</a></li><li><a href="https://textbooks.math.gatech.edu/ila/orthogonal-sets.html" target="_blank" rel="noopener">Interactive Linear Algebra — 6.4 Orthogonal Sets</a></li><li><a href="https://en.wikipedia.org/wiki/Orthogonal_matrix" target="_blank" rel="noopener">Wikipedia — Orthogonal matrix</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.lstsq.html" target="_blank" rel="noopener">NumPy — numpy.linalg.lstsq</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Is Q = [0.6 −0.8; 0.8 0.6] orthogonal? Rotation or reflection?</li><li>Fit y = c<sub>0</sub> + c<sub>1</sub>t to (0, 0), (1, 1), (2, 3).</li><li>Why can the normal equations always be solved when the columns of A are independent?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Columns are unit and perpendicular (0.36 + 0.64 = 1; −0.48 + 0.48 = 0): orthogonal; det = 0.36 + 0.64 = 1: a rotation (≈ 53.13°). 2) A<sup>T</sup>A = [3 3; 3 5], A<sup>T</sup>b = (4, 7) ⇒ c<sub>1</sub> = 1.5, c<sub>0</sub> = −1/6: y = −1/6 + 1.5t. 3) Then A<sup>T</sup>A is invertible (A<sup>T</sup>Ax = 0 ⇒ ‖Ax‖<sup>2</sup> = 0 ⇒ x = 0).</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 9 · Bài 9.1</span>
<h2>Ma trận trực giao và bình phương tối thiểu</h2>
<p class="lead">Dữ liệu thật không bao giờ khớp mô hình hoàn toàn: bốn điểm đo hiếm khi nằm trên một đường thẳng. Khi Ax = b vô nghiệm, tốt nhất ta có thể làm là tìm x sao cho Ax <strong>gần</strong> b nhất — và “gần nhất” chính là một phép chiếu.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận ra ma trận trực giao (Q<sup>T</sup>Q = I) và những gì nó bảo toàn.</li><li>Giải thích bình phương tối thiểu là chiếu b lên không gian cột.</li><li>Giải phương trình chuẩn A<sup>T</sup>A x̂ = A<sup>T</sup>b để khớp một đường thẳng.</li><li>Dùng <code>np.linalg.lstsq</code>.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Ma trận trực giao</span>Q<sup>T</sup>Q = I  ⇔  các cột là vector đơn vị vuông góc nhau  ⇔  Q<sup>−1</sup> = Q<sup>T</sup><br>‖Qx‖ = ‖x‖,  (Qx)·(Qy) = x·y,  det Q = ±1  (quay nếu +1, phản chiếu nếu −1)</div>
<p>Ma trận trực giao chính là các chuyển động cứng của Chương 3. Về số học chúng hoàn hảo: không bao giờ khuếch đại sai số làm tròn, nên đồ hoạ và robot lưu hướng bằng ma trận trực giao (và trực giao hoá lại khi sai số tích tụ).</p>
<p><b>Bình phương tối thiểu.</b> Nếu b không thuộc Col A thì không x nào giải được Ax = b. Tập mọi Ax là một mặt phẳng (hay không gian con); điểm gần b nhất là hình chiếu vuông góc p = Ax̂. Sai số e = b − Ax̂ phải <em>vuông góc</em> với mọi cột của A, tức A<sup>T</sup>e = 0:</p>
<div class="formula"><span class="lbl">Phương trình chuẩn</span>A<sup>T</sup>A x̂ = A<sup>T</sup>b    (x̂ cực tiểu ‖b − Ax‖<sup>2</sup>, tổng bình phương sai số)</div>
<p>Khớp đường thẳng y = c<sub>0</sub> + c<sub>1</sub>t với các điểm (t<sub>i</sub>, y<sub>i</sub>): mỗi điểm cho một phương trình c<sub>0</sub> + c<sub>1</sub>t<sub>i</sub> = y<sub>i</sub>, nên A có một cột toàn số 1 và một cột t<sub>i</sub>. Đây là <strong>hồi quy tuyến tính</strong>, mô hình đầu tiên của mọi khoá học máy.</p>
<h3>✍️ Ví dụ — khớp một đường thẳng</h3>
<div class="callout"><p>Các điểm (0, 1), (1, 2), (2, 2), (3, 4). A = [1 0; 1 1; 1 2; 1 3], b = (1, 2, 2, 4).</p>
<p>A<sup>T</sup>A = [4 6; 6 14] (4 điểm; Σt = 6; Σt<sup>2</sup> = 14). A<sup>T</sup>b = (Σy, Σty) = (9, 18).</p>
<p>Giải 4c<sub>0</sub> + 6c<sub>1</sub> = 9, 6c<sub>0</sub> + 14c<sub>1</sub> = 18: det = 56 − 36 = 20, c<sub>0</sub> = (9·14 − 6·18)/20 = 0,9, c<sub>1</sub> = (4·18 − 6·9)/20 = 0,9. <b>Đường tốt nhất: y = 0,9 + 0,9t.</b></p>
<p>Sai số e = b − Ax̂ = (0,1; 0,2; −0,7; 0,4); A<sup>T</sup>e = (0, 0) ✓ (vuông góc với cả hai cột); tổng bình phương sai số 0,7.</p></div>
<h3>💻 Kiểm bằng NumPy</h3>
<pre><code class="language-python">import numpy as np
t = np.array([0, 1, 2, 3])
y = np.array([1, 2, 2, 4])
A = np.column_stack([np.ones(4), t])     # columns: 1 and t
c, res, rank, sv = np.linalg.lstsq(A, y)
print(c)          # [c0, c1] of y = c0 + c1 t
print(res)        # squared length of the error vector
r = y - A @ c
print(np.round(A.T @ r, 10) + 0.0)       # the error is orthogonal to both columns</code></pre>
<div class="out">[0.9 0.9]
[0.7]
[0. 0.]</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nghĩ bình phương tối thiểu cực tiểu khoảng cách vuông góc tới đường thẳng. Nó cực tiểu sai số <em>theo chiều dọc</em> (theo y). Khớp vuông góc là PCA (Chương 10).</li><li>Lập A<sup>T</sup>A cho dữ liệu lệch thang đo trong code thật: nó bình phương số điều kiện. Thư viện dùng QR hoặc SVD thay thế (đó là điều <code>lstsq</code> làm).</li><li>Gọi ma trận có các cột vuông góc nhưng không đơn vị là “trực giao”: Q<sup>T</sup>Q phải bằng I, không chỉ là ma trận chéo.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Q trực giao: Q<sup>T</sup>Q = I, giữ độ dài và góc, det ±1.</li><li>Bình phương tối thiểu: chiếu b lên Col A; sai số ⟂ các cột.</li><li>Phương trình chuẩn A<sup>T</sup>Ax̂ = A<sup>T</sup>b.</li><li>Khớp đường thẳng = hồi quy tuyến tính.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://textbooks.math.gatech.edu/ila/least-squares.html" target="_blank" rel="noopener">Interactive Linear Algebra — 6.5 Phương pháp bình phương tối thiểu</a></li><li><a href="https://textbooks.math.gatech.edu/ila/orthogonal-sets.html" target="_blank" rel="noopener">Interactive Linear Algebra — 6.4 Tập trực giao</a></li><li><a href="https://en.wikipedia.org/wiki/Orthogonal_matrix" target="_blank" rel="noopener">Wikipedia — Ma trận trực giao</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.lstsq.html" target="_blank" rel="noopener">NumPy — numpy.linalg.lstsq</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Q = [0,6 −0,8; 0,8 0,6] có trực giao không? Quay hay phản chiếu?</li><li>Khớp y = c<sub>0</sub> + c<sub>1</sub>t với (0, 0), (1, 1), (2, 3).</li><li>Vì sao phương trình chuẩn luôn giải được khi các cột của A độc lập?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Các cột đơn vị và vuông góc (0,36 + 0,64 = 1; −0,48 + 0,48 = 0): trực giao; det = 0,36 + 0,64 = 1: phép quay (≈ 53,13°). 2) A<sup>T</sup>A = [3 3; 3 5], A<sup>T</sup>b = (4, 7) ⇒ c<sub>1</sub> = 1,5, c<sub>0</sub> = −1/6: y = −1/6 + 1,5t. 3) Khi đó A<sup>T</sup>A khả nghịch (A<sup>T</sup>Ax = 0 ⇒ ‖Ax‖<sup>2</sup> = 0 ⇒ x = 0).</p></div>`);

const c92 = L('mlt201-ts-9-2',
  '9.2 — Symmetric matrices and the spectral theorem: stretching along perpendicular axes|||9.2 — Ma trận đối xứng và định lý phổ: giãn theo các trục vuông góc',
  'A = Aᵀ ⇒ trị riêng thực, vector riêng vuông góc, A = QΛQᵀ = Σλqqᵀ; hình học: quay – giãn theo trục – quay lại; ví dụ [6 2; 2 3]; ma trận hiệp phương sai và quán tính là đối xứng; numpy eigh.',
  `<span class="eyebrow">MLT201 · Chapter 9 · Lesson 9.2</span>
<h2>Symmetric matrices and the spectral theorem</h2>
<p class="lead">Symmetric matrices (A = A<sup>T</sup>) are the best-behaved matrices in applied mathematics, and they are everywhere: covariance matrices in data, Hessians in optimisation, inertia and stiffness matrices in physics. Geometrically, every symmetric matrix is a <strong>pure stretch along perpendicular axes</strong>.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the spectral theorem: A = QΛQ<sup>T</sup> with Q orthogonal.</li><li>Find the principal axes and stretch factors of a 2×2 symmetric matrix.</li><li>Write A as a sum of rank-one projections λ<sub>i</sub>q<sub>i</sub>q<sub>i</sub><sup>T</sup>.</li><li>Use <code>np.linalg.eigh</code>.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Spectral theorem</span>If A = A<sup>T</sup> (real), then:  all eigenvalues are real;  eigenvectors for different eigenvalues are perpendicular;<br>A = Q Λ Q<sup>T</sup> with Q orthogonal (orthonormal eigenvectors as columns), Λ = diag(λ<sub>1</sub>, …, λ<sub>n</sub>)<br>A = λ<sub>1</sub>q<sub>1</sub>q<sub>1</sub><sup>T</sup> + … + λ<sub>n</sub>q<sub>n</sub>q<sub>n</sub><sup>T</sup>   (a weighted sum of projections onto the axes)</div>
<p>Read A = QΛQ<sup>T</sup> right to left: Q<sup>T</sup> rotates the principal axes onto the coordinate axes, Λ stretches along them, Q rotates back. No shear, no twisting: a symmetric matrix maps a circle to an ellipse whose axes are the eigenvectors and whose semi-axis lengths are |λ<sub>i</sub>|.</p>
<p>Compare with Chapter 8: a general matrix may have complex eigenvalues (rotation) or too few eigenvectors (shear). Symmetric matrices never do. And because Q is orthogonal, “P<sup>−1</sup>” is just Q<sup>T</sup> — free to compute and numerically stable.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p>A = [6 2; 2 3]. trace 9, det 18 − 4 = 14 ⇒ λ<sup>2</sup> − 9λ + 14 = (λ − 7)(λ − 2) = 0, <b>λ = 7, 2</b>.</p>
<p>λ = 7: A − 7I = [−1 2; 2 −4] ⇒ v = (2, 1). λ = 2: A − 2I = [4 2; 2 1] ⇒ v = (−1, 2). Check perpendicular: (2, 1)·(−1, 2) = 0 ✓.</p>
<p>Normalise: q<sub>1</sub> = (2, 1)/√5, q<sub>2</sub> = (−1, 2)/√5. So A stretches by 7 along the direction (2, 1) and by 2 along (−1, 2). The unit circle becomes an ellipse with semi-axes 7 and 2 along those directions.</p>
<p>Spectral sum: 7·(1/5)[4 2; 2 1] + 2·(1/5)[1 −2; −2 4] = (1/5)[30 10; 10 15] = [6 2; 2 3] ✓.</p></div>
<h3>💻 Check it in NumPy</h3>
<pre><code class="language-python">import numpy as np
np.set_printoptions(precision=4, suppress=True)
A = np.array([[6., 2.],
              [2., 3.]])
lam, Q = np.linalg.eigh(A)
print(lam)
print(Q)
print(np.round(Q.T @ Q, 10) + 0.0)                  # Q is orthogonal
print(np.round(Q @ np.diag(lam) @ Q.T, 10) + 0.0)   # rebuild A = Q Lambda Q^T</code></pre>
<div class="out">[2. 7.]
[[ 0.4472 -0.8944]
 [-0.8944 -0.4472]]
[[1. 0.]
 [0. 1.]]
[[6. 2.]
 [2. 3.]]</div>
<p>The columns are ±(1, −2)/√5 ≈ (0.4472, −0.8944) for λ = 2 and ±(2, 1)/√5 for λ = 7 — the same directions as by hand, with signs chosen by the library.</p>
<h3>🌍 Where symmetric matrices come from</h3>
<ul><li><b>Data:</b> the covariance matrix of features is symmetric; its eigenvectors are the principal components (Chapter 10).</li><li><b>Optimisation:</b> the Hessian of second derivatives is symmetric; its eigenvalues decide minimum / maximum / saddle (next lesson).</li><li><b>Mechanics &amp; graphics:</b> inertia tensors, stress tensors and A<sup>T</sup>A for any A are symmetric.</li></ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using <code>eig</code> for symmetric matrices: it works, but <code>eigh</code> is faster, guarantees real output and orthonormal vectors.</li><li>Forgetting to normalise eigenvectors before building Q; then Q<sup>T</sup> is not Q<sup>−1</sup>.</li><li>Thinking the spectral theorem applies to every matrix: [1 1; 0 1] is not symmetric and not even diagonalizable.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>A = A<sup>T</sup> ⇒ real eigenvalues, orthonormal eigenvectors, A = QΛQ<sup>T</sup>.</li><li>Geometry: rotate, stretch along perpendicular axes, rotate back; circle → ellipse with axes q<sub>i</sub>.</li><li>A = Σλ<sub>i</sub>q<sub>i</sub>q<sub>i</sub><sup>T</sup>.</li><li>Covariance, Hessian, A<sup>T</sup>A are symmetric.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/resources/lecture-25-symmetric-matrices-and-positive-definiteness/" target="_blank" rel="noopener">MIT 18.06SC — Lecture 25: Symmetric Matrices and Positive Definiteness</a></li><li><a href="https://en.wikipedia.org/wiki/Spectral_theorem" target="_blank" rel="noopener">Wikipedia — Spectral theorem</a></li><li><a href="https://mml-book.github.io/" target="_blank" rel="noopener">Mathematics for Machine Learning — Ch. 4.4 Eigendecomposition and Diagonalization (free PDF)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the principal axes and stretch factors of [3 1; 1 3].</li><li>Write [3 1; 1 3] as λ<sub>1</sub>q<sub>1</sub>q<sub>1</sub><sup>T</sup> + λ<sub>2</sub>q<sub>2</sub>q<sub>2</sub><sup>T</sup>.</li><li>Show that A<sup>T</sup>A is symmetric for any matrix A.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) λ = 4 along (1, 1), λ = 2 along (1, −1). 2) 4·½[1 1; 1 1] + 2·½[1 −1; −1 1] = [2 2; 2 2] + [1 −1; −1 1] = [3 1; 1 3] ✓. 3) (A<sup>T</sup>A)<sup>T</sup> = A<sup>T</sup>(A<sup>T</sup>)<sup>T</sup> = A<sup>T</sup>A.</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 9 · Bài 9.2</span>
<h2>Ma trận đối xứng và định lý phổ</h2>
<p class="lead">Ma trận đối xứng (A = A<sup>T</sup>) là loại ma trận “ngoan” nhất trong toán ứng dụng, và chúng ở khắp nơi: ma trận hiệp phương sai trong dữ liệu, ma trận Hessian trong tối ưu, ma trận quán tính và độ cứng trong vật lý. Về hình học, mọi ma trận đối xứng là một <strong>phép giãn thuần tuý theo các trục vuông góc</strong>.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu định lý phổ: A = QΛQ<sup>T</sup> với Q trực giao.</li><li>Tìm các trục chính và hệ số giãn của một ma trận đối xứng 2×2.</li><li>Viết A thành tổng các phép chiếu hạng một λ<sub>i</sub>q<sub>i</sub>q<sub>i</sub><sup>T</sup>.</li><li>Dùng <code>np.linalg.eigh</code>.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Định lý phổ</span>Nếu A = A<sup>T</sup> (thực) thì:  mọi trị riêng đều thực;  vector riêng của các trị riêng khác nhau vuông góc nhau;<br>A = Q Λ Q<sup>T</sup> với Q trực giao (các vector riêng trực chuẩn làm cột), Λ = diag(λ<sub>1</sub>, …, λ<sub>n</sub>)<br>A = λ<sub>1</sub>q<sub>1</sub>q<sub>1</sub><sup>T</sup> + … + λ<sub>n</sub>q<sub>n</sub>q<sub>n</sub><sup>T</sup>   (tổng có trọng số của các phép chiếu lên các trục)</div>
<p>Đọc A = QΛQ<sup>T</sup> từ phải sang trái: Q<sup>T</sup> xoay các trục chính về trùng các trục toạ độ, Λ giãn theo chúng, Q xoay trả lại. Không trượt, không vặn xoắn: ma trận đối xứng biến đường tròn thành elip có các trục là vector riêng và độ dài bán trục là |λ<sub>i</sub>|.</p>
<p>So với Chương 8: ma trận tổng quát có thể có trị riêng phức (phép quay) hoặc quá ít vector riêng (phép trượt). Ma trận đối xứng thì không bao giờ. Và vì Q trực giao, “P<sup>−1</sup>” chỉ là Q<sup>T</sup> — tính miễn phí và ổn định số học.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p>A = [6 2; 2 3]. Vết 9, det 18 − 4 = 14 ⇒ λ<sup>2</sup> − 9λ + 14 = (λ − 7)(λ − 2) = 0, <b>λ = 7, 2</b>.</p>
<p>λ = 7: A − 7I = [−1 2; 2 −4] ⇒ v = (2, 1). λ = 2: A − 2I = [4 2; 2 1] ⇒ v = (−1, 2). Kiểm vuông góc: (2, 1)·(−1, 2) = 0 ✓.</p>
<p>Chuẩn hoá: q<sub>1</sub> = (2, 1)/√5, q<sub>2</sub> = (−1, 2)/√5. Vậy A giãn 7 lần theo hướng (2, 1) và 2 lần theo (−1, 2). Đường tròn đơn vị thành elip có bán trục 7 và 2 theo các hướng đó.</p>
<p>Tổng phổ: 7·(1/5)[4 2; 2 1] + 2·(1/5)[1 −2; −2 4] = (1/5)[30 10; 10 15] = [6 2; 2 3] ✓.</p></div>
<h3>💻 Kiểm bằng NumPy</h3>
<pre><code class="language-python">import numpy as np
np.set_printoptions(precision=4, suppress=True)
A = np.array([[6., 2.],
              [2., 3.]])
lam, Q = np.linalg.eigh(A)
print(lam)
print(Q)
print(np.round(Q.T @ Q, 10) + 0.0)                  # Q is orthogonal
print(np.round(Q @ np.diag(lam) @ Q.T, 10) + 0.0)   # rebuild A = Q Lambda Q^T</code></pre>
<div class="out">[2. 7.]
[[ 0.4472 -0.8944]
 [-0.8944 -0.4472]]
[[1. 0.]
 [0. 1.]]
[[6. 2.]
 [2. 3.]]</div>
<p>Các cột là ±(1, −2)/√5 ≈ (0,4472; −0,8944) cho λ = 2 và ±(2, 1)/√5 cho λ = 7 — cùng hướng như khi làm tay, chỉ là dấu do thư viện chọn.</p>
<h3>🌍 Ma trận đối xứng đến từ đâu</h3>
<ul><li><b>Dữ liệu:</b> ma trận hiệp phương sai của các đặc trưng là đối xứng; vector riêng của nó là các thành phần chính (Chương 10).</li><li><b>Tối ưu:</b> ma trận Hessian các đạo hàm cấp hai là đối xứng; trị riêng của nó quyết định cực tiểu / cực đại / điểm yên ngựa (bài sau).</li><li><b>Cơ học &amp; đồ hoạ:</b> tensor quán tính, tensor ứng suất và A<sup>T</sup>A với mọi A đều đối xứng.</li></ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng <code>eig</code> cho ma trận đối xứng: vẫn chạy, nhưng <code>eigh</code> nhanh hơn, bảo đảm kết quả thực và vector trực chuẩn.</li><li>Quên chuẩn hoá vector riêng trước khi lập Q; khi đó Q<sup>T</sup> không phải Q<sup>−1</sup>.</li><li>Nghĩ định lý phổ áp dụng cho mọi ma trận: [1 1; 0 1] không đối xứng và thậm chí không chéo hoá được.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>A = A<sup>T</sup> ⇒ trị riêng thực, vector riêng trực chuẩn, A = QΛQ<sup>T</sup>.</li><li>Hình học: xoay, giãn theo các trục vuông góc, xoay lại; tròn → elip với trục q<sub>i</sub>.</li><li>A = Σλ<sub>i</sub>q<sub>i</sub>q<sub>i</sub><sup>T</sup>.</li><li>Hiệp phương sai, Hessian, A<sup>T</sup>A đều đối xứng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/resources/lecture-25-symmetric-matrices-and-positive-definiteness/" target="_blank" rel="noopener">MIT 18.06SC — Bài 25: Ma trận đối xứng và xác định dương</a></li><li><a href="https://en.wikipedia.org/wiki/Spectral_theorem" target="_blank" rel="noopener">Wikipedia — Định lý phổ</a></li><li><a href="https://mml-book.github.io/" target="_blank" rel="noopener">Mathematics for Machine Learning — Mục 4.4 Phân rã riêng và chéo hoá (PDF miễn phí)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm các trục chính và hệ số giãn của [3 1; 1 3].</li><li>Viết [3 1; 1 3] thành λ<sub>1</sub>q<sub>1</sub>q<sub>1</sub><sup>T</sup> + λ<sub>2</sub>q<sub>2</sub>q<sub>2</sub><sup>T</sup>.</li><li>Chứng tỏ A<sup>T</sup>A đối xứng với mọi ma trận A.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) λ = 4 theo (1, 1), λ = 2 theo (1, −1). 2) 4·½[1 1; 1 1] + 2·½[1 −1; −1 1] = [2 2; 2 2] + [1 −1; −1 1] = [3 1; 1 3] ✓. 3) (A<sup>T</sup>A)<sup>T</sup> = A<sup>T</sup>(A<sup>T</sup>)<sup>T</sup> = A<sup>T</sup>A.</p></div>`);

const c93 = L('mlt201-ts-9-3',
  '9.3 — Quadratic forms: ellipses, saddles and positive definite matrices|||9.3 — Dạng toàn phương: elip, yên ngựa và ma trận xác định dương',
  'Q(x) = xᵀAx; đổi sang trục chính khử số hạng chéo xy; đường mức là elip/hyperbol; xác định dương ⇔ mọi λ > 0; phân loại điểm tới hạn bằng Hessian; hàm mất mát trong học máy và khoảng cách Mahalanobis.',
  `<span class="eyebrow">MLT201 · Chapter 9 · Lesson 9.3</span>
<h2>Quadratic forms: ellipses, saddles and positive definite matrices</h2>
<p class="lead">Expressions like 6x<sup>2</sup> + 4xy + 3y<sup>2</sup> appear as energies, variances and loss functions. The cross term 4xy hides the shape. Rotating to the <strong>principal axes</strong> of the symmetric matrix removes it and reveals an ellipse, a hyperbola or a saddle.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write a quadratic form as x<sup>T</sup>Ax with A symmetric.</li><li>Remove the cross term by changing to the eigenvector basis (principal axes theorem).</li><li>Classify a form as positive definite, negative definite or indefinite using eigenvalues.</li><li>Use the classification to recognise minima, maxima and saddle points.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Quadratic form</span>Q(x, y) = ax<sup>2</sup> + 2bxy + cy<sup>2</sup> = x<sup>T</sup>Ax  with  A = [a b; b c]  (half the cross coefficient goes off the diagonal)</div>
<p>Write A = QΛQ<sup>T</sup> and use new coordinates u = Q<sup>T</sup>x (coordinates along the eigenvectors). Then x<sup>T</sup>Ax = u<sup>T</sup>Λu:</p>
<div class="formula"><span class="lbl">Principal axes theorem</span>Q = λ<sub>1</sub>u<sub>1</sub><sup>2</sup> + λ<sub>2</sub>u<sub>2</sub><sup>2</sup>    — no cross term in the eigenvector coordinates</div>
<div class="formula"><span class="lbl">Classification</span>all λ &gt; 0: <b>positive definite</b> (bowl, level sets are ellipses, unique minimum at 0)<br>all λ &lt; 0: negative definite (upside-down bowl, maximum)    mixed signs: <b>indefinite</b> (saddle, hyperbolas)<br>some λ = 0: semidefinite (a flat valley)    2×2 test: positive definite ⇔ a &gt; 0 and det A &gt; 0</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — an ellipse.</b> 6x<sup>2</sup> + 4xy + 3y<sup>2</sup> = 14 has A = [6 2; 2 3] with λ = 7, 2 and axes (2, 1)/√5, (−1, 2)/√5 (Lesson 9.2). In principal coordinates: 7u<sub>1</sub><sup>2</sup> + 2u<sub>2</sub><sup>2</sup> = 14, i.e. u<sub>1</sub><sup>2</sup>/2 + u<sub>2</sub><sup>2</sup>/7 = 1. An ellipse with semi-axis <b>√2 ≈ 1.41</b> along (2, 1) and <b>√7 ≈ 2.65</b> along (−1, 2). Note: a <em>larger</em> eigenvalue gives a <em>shorter</em> axis (the form grows faster in that direction).</p></div>
<div class="callout"><p><b>Example 2 — a saddle.</b> f(x, y) = x<sup>2</sup> + 4xy + y<sup>2</sup>: A = [1 2; 2 1], λ = 3, −1 (mixed signs) ⇒ <b>indefinite</b>. Along (1, 1) f grows (3u<sup>2</sup>), along (1, −1) it falls (−u<sup>2</sup>): the origin is a saddle point, not a minimum, even though both x<sup>2</sup> and y<sup>2</sup> have positive coefficients.</p></div>
<div class="callout"><p><b>Example 3 — semidefinite.</b> 4x<sup>2</sup> + 4xy + y<sup>2</sup> = (2x + y)<sup>2</sup>: A = [4 2; 2 1], λ = 5, 0. Zero along the whole line y = −2x: a flat valley, positive <em>semi</em>definite.</p></div>
<h3>🤖 Why ML cares</h3>
<ul><li>Near a critical point, a loss function looks like a quadratic form with the <b>Hessian</b> as matrix. Positive definite ⇒ local minimum; indefinite ⇒ saddle (very common in deep networks).</li><li>The ratio λ<sub>max</sub>/λ<sub>min</sub> measures how stretched the bowl is: long thin valleys make gradient descent zig-zag slowly.</li><li>A covariance matrix Σ is positive (semi)definite; the <b>Mahalanobis distance</b> √(x<sup>T</sup>Σ<sup>−1</sup>x) measures distance in units of the data's spread along each principal axis.</li></ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Putting the full cross coefficient in A: 4xy gives b = 2, not 4.</li><li>Judging definiteness from the diagonal only (Example 2).</li><li>Thinking the larger eigenvalue gives the longer ellipse axis: semi-axis = √(c/λ), so larger λ ⇒ shorter axis.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Q(x) = x<sup>T</sup>Ax with A symmetric.</li><li>Eigenvector coordinates remove cross terms: Q = Σλ<sub>i</sub>u<sub>i</sub><sup>2</sup>.</li><li>Signs of eigenvalues classify: all + definite (ellipse, min), mixed indefinite (saddle).</li><li>2×2 positive definite ⇔ a &gt; 0, det &gt; 0.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/resources/lecture-27-positive-definite-matrices-and-minima/" target="_blank" rel="noopener">MIT 18.06SC — Lecture 27: Positive Definite Matrices and Minima</a></li><li><a href="https://en.wikipedia.org/wiki/Quadratic_form" target="_blank" rel="noopener">Wikipedia — Quadratic form</a></li><li><a href="https://en.wikipedia.org/wiki/Definite_matrix" target="_blank" rel="noopener">Wikipedia — Definite matrix</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write 2x<sup>2</sup> − 6xy + 5y<sup>2</sup> as x<sup>T</sup>Ax. Is it positive definite?</li><li>Classify 2x<sup>2</sup> + 2xy + 2y<sup>2</sup> and find its principal axes.</li><li>Is [2 −1 0; −1 2 −1; 0 −1 2] positive definite? (Its eigenvalues are 2 − √2, 2, 2 + √2.)</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) A = [2 −3; −3 5]; a = 2 &gt; 0 but det = 10 − 9 = 1 &gt; 0 ⇒ positive definite. 2) A = [2 1; 1 2], λ = 3, 1, both positive: positive definite; axes (1, 1) and (1, −1); the level set Q = 3 is u<sub>1</sub><sup>2</sup> + u<sub>2</sub><sup>2</sup>/3 = 1. 3) All three eigenvalues are positive: yes (this matrix appears in physics simulations of springs).</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 9 · Bài 9.3</span>
<h2>Dạng toàn phương: elip, yên ngựa và ma trận xác định dương</h2>
<p class="lead">Các biểu thức như 6x<sup>2</sup> + 4xy + 3y<sup>2</sup> xuất hiện dưới dạng năng lượng, phương sai và hàm mất mát. Số hạng chéo 4xy che mất hình dạng. Xoay về <strong>các trục chính</strong> của ma trận đối xứng sẽ khử nó và lộ ra một elip, một hyperbol hay một yên ngựa.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết dạng toàn phương thành x<sup>T</sup>Ax với A đối xứng.</li><li>Khử số hạng chéo bằng cách chuyển sang cơ sở vector riêng (định lý trục chính).</li><li>Phân loại dạng xác định dương, xác định âm hay không xác định bằng trị riêng.</li><li>Dùng phân loại để nhận ra cực tiểu, cực đại và điểm yên ngựa.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Dạng toàn phương</span>Q(x, y) = ax<sup>2</sup> + 2bxy + cy<sup>2</sup> = x<sup>T</sup>Ax  với  A = [a b; b c]  (một nửa hệ số chéo đặt ngoài đường chéo)</div>
<p>Viết A = QΛQ<sup>T</sup> và dùng toạ độ mới u = Q<sup>T</sup>x (toạ độ dọc theo các vector riêng). Khi đó x<sup>T</sup>Ax = u<sup>T</sup>Λu:</p>
<div class="formula"><span class="lbl">Định lý trục chính</span>Q = λ<sub>1</sub>u<sub>1</sub><sup>2</sup> + λ<sub>2</sub>u<sub>2</sub><sup>2</sup>    — không còn số hạng chéo trong toạ độ vector riêng</div>
<div class="formula"><span class="lbl">Phân loại</span>mọi λ &gt; 0: <b>xác định dương</b> (cái bát, đường mức là elip, cực tiểu duy nhất tại 0)<br>mọi λ &lt; 0: xác định âm (bát úp, cực đại)    dấu lẫn lộn: <b>không xác định</b> (yên ngựa, hyperbol)<br>có λ = 0: nửa xác định (thung lũng phẳng)    phép thử 2×2: xác định dương ⇔ a &gt; 0 và det A &gt; 0</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — một elip.</b> 6x<sup>2</sup> + 4xy + 3y<sup>2</sup> = 14 có A = [6 2; 2 3] với λ = 7, 2 và trục (2, 1)/√5, (−1, 2)/√5 (Bài 9.2). Trong toạ độ chính: 7u<sub>1</sub><sup>2</sup> + 2u<sub>2</sub><sup>2</sup> = 14, tức u<sub>1</sub><sup>2</sup>/2 + u<sub>2</sub><sup>2</sup>/7 = 1. Một elip có bán trục <b>√2 ≈ 1,41</b> theo (2, 1) và <b>√7 ≈ 2,65</b> theo (−1, 2). Chú ý: trị riêng <em>lớn hơn</em> cho trục <em>ngắn hơn</em> (dạng tăng nhanh hơn theo hướng đó).</p></div>
<div class="callout"><p><b>Ví dụ 2 — yên ngựa.</b> f(x, y) = x<sup>2</sup> + 4xy + y<sup>2</sup>: A = [1 2; 2 1], λ = 3, −1 (dấu lẫn lộn) ⇒ <b>không xác định</b>. Theo (1, 1) f tăng (3u<sup>2</sup>), theo (1, −1) f giảm (−u<sup>2</sup>): gốc là điểm yên ngựa, không phải cực tiểu, dù cả x<sup>2</sup> và y<sup>2</sup> đều có hệ số dương.</p></div>
<div class="callout"><p><b>Ví dụ 3 — nửa xác định.</b> 4x<sup>2</sup> + 4xy + y<sup>2</sup> = (2x + y)<sup>2</sup>: A = [4 2; 2 1], λ = 5, 0. Bằng 0 trên cả đường y = −2x: thung lũng phẳng, nửa xác định dương.</p></div>
<h3>🤖 Vì sao học máy quan tâm</h3>
<ul><li>Gần một điểm tới hạn, hàm mất mát trông như một dạng toàn phương với ma trận là <b>Hessian</b>. Xác định dương ⇒ cực tiểu địa phương; không xác định ⇒ yên ngựa (rất phổ biến trong mạng sâu).</li><li>Tỉ số λ<sub>max</sub>/λ<sub>min</sub> đo cái bát bị kéo dài cỡ nào: thung lũng dài và hẹp làm gradient descent đi zig-zag rất chậm.</li><li>Ma trận hiệp phương sai Σ là (nửa) xác định dương; <b>khoảng cách Mahalanobis</b> √(x<sup>T</sup>Σ<sup>−1</sup>x) đo khoảng cách theo đơn vị độ phân tán của dữ liệu dọc mỗi trục chính.</li></ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đặt nguyên hệ số chéo vào A: 4xy cho b = 2, không phải 4.</li><li>Đánh giá tính xác định chỉ bằng đường chéo (Ví dụ 2).</li><li>Nghĩ trị riêng lớn cho trục elip dài: bán trục = √(c/λ), nên λ lớn ⇒ trục ngắn.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Q(x) = x<sup>T</sup>Ax với A đối xứng.</li><li>Toạ độ vector riêng khử số hạng chéo: Q = Σλ<sub>i</sub>u<sub>i</sub><sup>2</sup>.</li><li>Dấu trị riêng phân loại: toàn + xác định (elip, cực tiểu), lẫn lộn không xác định (yên ngựa).</li><li>2×2 xác định dương ⇔ a &gt; 0, det &gt; 0.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/resources/lecture-27-positive-definite-matrices-and-minima/" target="_blank" rel="noopener">MIT 18.06SC — Bài 27: Ma trận xác định dương và cực tiểu</a></li><li><a href="https://en.wikipedia.org/wiki/Quadratic_form" target="_blank" rel="noopener">Wikipedia — Dạng toàn phương</a></li><li><a href="https://en.wikipedia.org/wiki/Definite_matrix" target="_blank" rel="noopener">Wikipedia — Ma trận xác định</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết 2x<sup>2</sup> − 6xy + 5y<sup>2</sup> thành x<sup>T</sup>Ax. Nó có xác định dương không?</li><li>Phân loại 2x<sup>2</sup> + 2xy + 2y<sup>2</sup> và tìm các trục chính.</li><li>[2 −1 0; −1 2 −1; 0 −1 2] có xác định dương không? (Trị riêng là 2 − √2, 2, 2 + √2.)</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) A = [2 −3; −3 5]; a = 2 &gt; 0 và det = 10 − 9 = 1 &gt; 0 ⇒ xác định dương. 2) A = [2 1; 1 2], λ = 3, 1, đều dương: xác định dương; trục (1, 1) và (1, −1); đường mức Q = 3 là u<sub>1</sub><sup>2</sup> + u<sub>2</sub><sup>2</sup>/3 = 1. 3) Cả ba trị riêng đều dương: có (ma trận này xuất hiện trong mô phỏng vật lý hệ lò xo).</p></div>`);

const q9 = QZ(9, 'Quiz — Chapter 9: Orthogonality, symmetric matrices, quadratic forms|||Quiz — Chương 9: Trực giao, ma trận đối xứng, dạng toàn phương', 'Kiểm tra chương 9: ma trận trực giao, bình phương tối thiểu, phương trình chuẩn, định lý phổ, dạng toàn phương, xác định dương, yên ngựa.', [
  Q('q1', "A matrix Q with QᵀQ = I always|||Ma trận Q có QᵀQ = I luôn",
    ['preserves lengths and angles|||giữ nguyên độ dài và góc', 'has determinant 0|||có định thức 0', 'is symmetric|||đối xứng', 'is a projection|||là phép chiếu'], 0,
    "‖Qx‖² = xᵀQᵀQx = ‖x‖².|||‖Qx‖² = xᵀQᵀQx = ‖x‖²."),
  Q('q2', "In least squares, the error e = b − Ax̂ is|||Trong bình phương tối thiểu, sai số e = b − Ax̂",
    ['zero|||bằng 0', 'perpendicular to every column of A|||vuông góc với mọi cột của A', 'parallel to b|||song song với b', 'in the column space of A|||nằm trong không gian cột của A'], 1,
    "That is the projection condition Aᵀe = 0.|||Đó là điều kiện chiếu Aᵀe = 0."),
  Q('q3', "The best line y = c₀ + c₁t through (0,1), (1,2), (2,2), (3,4) is|||Đường tốt nhất y = c₀ + c₁t qua (0,1), (1,2), (2,2), (3,4) là",
    ['y = 1 + t|||y = 1 + t', 'y = 0.9 + 0.9t|||y = 0,9 + 0,9t', 'y = 0.5 + t|||y = 0,5 + t', 'y = 1.2 + 0.8t|||y = 1,2 + 0,8t'], 1,
    "Normal equations [4 6; 6 14]c = (9, 18).|||Phương trình chuẩn [4 6; 6 14]c = (9, 18)."),
  Q('q4', "For a real symmetric matrix, eigenvectors of different eigenvalues are|||Với ma trận đối xứng thực, vector riêng của các trị riêng khác nhau",
    ['parallel|||song song', 'perpendicular|||vuông góc', 'complex|||phức', 'equal|||bằng nhau'], 1,
    "Spectral theorem.|||Định lý phổ."),
  Q('q5', "The eigenvalues of [6 2; 2 3] are|||Trị riêng của [6 2; 2 3] là",
    ['7 and 2|||7 và 2', '6 and 3|||6 và 3', '9 and 14|||9 và 14', '8 and 1|||8 và 1'], 0,
    "trace 9, det 14.|||vết 9, det 14."),
  Q('q6', "The quadratic form 6x² + 4xy + 3y² has matrix|||Dạng toàn phương 6x² + 4xy + 3y² có ma trận",
    ['[6 4; 4 3]|||[6 4; 4 3]', '[6 2; 2 3]|||[6 2; 2 3]', '[6 4; 0 3]|||[6 4; 0 3]', '[3 2; 2 6]|||[3 2; 2 6]'], 1,
    "Half of the cross coefficient goes in each off-diagonal entry.|||Một nửa hệ số chéo vào mỗi vị trí ngoài đường chéo."),
  Q('q7', "f(x, y) = x² + 4xy + y² at the origin has|||f(x, y) = x² + 4xy + y² tại gốc có",
    ['a minimum|||cực tiểu', 'a maximum|||cực đại', 'a saddle point|||điểm yên ngựa', 'a flat valley|||thung lũng phẳng'], 2,
    "Eigenvalues 3 and −1 have mixed signs.|||Trị riêng 3 và −1 trái dấu."),
  Q('q8', "A 2×2 symmetric matrix [a b; b c] is positive definite exactly when|||Ma trận đối xứng 2×2 [a b; b c] xác định dương khi và chỉ khi",
    ['a > 0 and c > 0|||a > 0 và c > 0', 'a > 0 and ac − b² > 0|||a > 0 và ac − b² > 0', 'b = 0|||b = 0', 'trace > 0|||vết > 0'], 1,
    "Leading minors positive ⇔ both eigenvalues positive.|||Các định thức con chính dương ⇔ cả hai trị riêng dương."),
  Q('q9', "On the ellipse xᵀAx = c (A positive definite), the longest axis points along the eigenvector of|||Trên elip xᵀAx = c (A xác định dương), trục dài nhất nằm theo vector riêng của",
    ['the largest eigenvalue|||trị riêng lớn nhất', 'the smallest eigenvalue|||trị riêng nhỏ nhất', 'any eigenvalue|||trị riêng bất kỳ', 'the determinant|||định thức'], 1,
    "Semi-axis = √(c/λ): smaller λ, longer axis.|||Bán trục = √(c/λ): λ nhỏ hơn, trục dài hơn."),
]);

const ch9 = {
  title: 'Chapter 9 — Orthogonality, symmetric matrices and quadratic forms|||Chương 9 — Trực giao, ma trận đối xứng và dạng toàn phương',
  description: 'Ma trận trực giao, bình phương tối thiểu và hồi quy tuyến tính, định lý phổ A = QΛQᵀ, dạng toàn phương, trục chính, xác định dương, yên ngựa, Hessian và hiệp phương sai (Lay ch.6–7 · Strang ch.4, 7 · MML ch.3–4).',
  lessons: [c91, c92, c93, q9],
};

// ───────────────────────────── Chương 10 ─────────────────────────────
const c101 = L('mlt201-ts-10-1',
  '10.1 — The SVD geometrically: every matrix is rotate–stretch–rotate|||10.1 — SVD nhìn bằng hình: mọi ma trận đều là quay – giãn – quay',
  'A = UΣVᵀ: Vᵀ quay, Σ giãn theo trục, U quay; đường tròn đơn vị thành elip có bán trục σ₁, σ₂; tính tay SVD của [3 0; 4 5] qua AᵀA; |det| = tích σ; số điều kiện; hạng = số σ khác 0; code NumPy.',
  `<span class="eyebrow">MLT201 · Chapter 10 · Lesson 10.1</span>
<h2>The SVD geometrically: rotate, stretch, rotate</h2>
<p class="lead">Eigenvectors need a square matrix and may not exist. The <strong>singular value decomposition</strong> works for <em>every</em> matrix, square or not: any linear map is a rotation (or reflection), followed by stretching along perpendicular axes, followed by another rotation.</p>
<h3>🎯 Objectives</h3>
<ul><li>State A = UΣV<sup>T</sup> and interpret each factor geometrically.</li><li>Compute the SVD of a 2×2 matrix by hand from A<sup>T</sup>A.</li><li>Read rank, |det|, the image of the unit circle and the condition number from the singular values.</li><li>Compute an SVD with NumPy.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Singular value decomposition</span>A (m×n) = U Σ V<sup>T</sup>    U (m×m) and V (n×n) orthogonal, Σ diagonal with σ<sub>1</sub> ≥ σ<sub>2</sub> ≥ … ≥ 0<br>A v<sub>i</sub> = σ<sub>i</sub> u<sub>i</sub>    v<sub>i</sub> = eigenvectors of A<sup>T</sup>A,  σ<sub>i</sub> = √(eigenvalues of A<sup>T</sup>A)</div>
<p>Geometry: V<sup>T</sup> turns the special input directions v<sub>1</sub>, v<sub>2</sub> onto the axes; Σ stretches the axes by σ<sub>1</sub>, σ<sub>2</sub>; U turns the result to the output directions u<sub>1</sub>, u<sub>2</sub>. So <strong>the unit circle is mapped to an ellipse</strong> with semi-axes σ<sub>1</sub>u<sub>1</sub> and σ<sub>2</sub>u<sub>2</sub>. The v's are the perpendicular inputs that stay perpendicular after the map.</p>
<ul><li>rank A = number of nonzero σ's.</li><li>For square A: |det A| = σ<sub>1</sub>σ<sub>2</sub>⋯σ<sub>n</sub> (area factor = product of stretches).</li><li>σ<sub>1</sub> = the largest stretch = max ‖Ax‖ over unit x. The <strong>condition number</strong> σ<sub>1</sub>/σ<sub>n</sub> tells how much relative errors can be amplified when solving Ax = b.</li></ul>
<h3>✍️ Worked example — SVD by hand</h3>
<div class="callout"><p>A = [3 0; 4 5]. Step 1: A<sup>T</sup>A = [25 20; 20 25], eigenvalues 45 and 5 with eigenvectors (1, 1) and (1, −1). So <b>σ<sub>1</sub> = √45 = 3√5 ≈ 6.708, σ<sub>2</sub> = √5 ≈ 2.236</b>, v<sub>1</sub> = (1, 1)/√2, v<sub>2</sub> = (1, −1)/√2.</p>
<p>Step 2: u<sub>i</sub> = Av<sub>i</sub>/σ<sub>i</sub>. Av<sub>1</sub> = (3, 9)/√2 ⇒ u<sub>1</sub> = (1, 3)/√10. Av<sub>2</sub> = (3, −1)/√2 ⇒ u<sub>2</sub> = (3, −1)/√10. They are perpendicular ✓.</p>
<p>Checks: σ<sub>1</sub>σ<sub>2</sub> = 3√5·√5 = 15 = det A ✓. Condition number = 3. The unit circle becomes an ellipse with semi-axes 6.708 along (1, 3) and 2.236 along (3, −1).</p></div>
<h3>💻 Check it in NumPy</h3>
<pre><code class="language-python">import numpy as np
np.set_printoptions(precision=4, suppress=True)
A = np.array([[3., 0.],
              [4., 5.]])
U, s, Vt = np.linalg.svd(A)
print(U); print(s); print(Vt)
print(np.allclose(U @ np.diag(s) @ Vt, A))
t = np.linspace(0, 2 * np.pi, 3601)
circle = np.vstack([np.cos(t), np.sin(t)])
lengths = np.linalg.norm(A @ circle, axis=0)
print(round(lengths.max(), 4), round(lengths.min(), 4))   # semi-axes of the ellipse</code></pre>
<div class="out">[[-0.3162 -0.9487]
 [-0.9487  0.3162]]
[6.7082 2.2361]
[[-0.7071 -0.7071]
 [-0.7071  0.7071]]
True
6.7082 2.2361</div>
<p>NumPy's columns of U are ±(1, 3)/√10 ≈ ±(0.3162, 0.9487) and ±(3, −1)/√10 — the same directions as by hand, with signs flipped in pairs (u<sub>i</sub> and v<sub>i</sub> may both change sign). The longest and shortest images of 3601 unit vectors confirm σ<sub>1</sub> and σ<sub>2</sub>.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Confusing singular values with eigenvalues. For A = [3 0; 4 5] the eigenvalues are 3 and 5, the singular values 6.708 and 2.236. They agree only for symmetric positive semidefinite matrices.</li><li>Taking σ = eigenvalues of A<sup>T</sup>A (they are the <em>squares</em>).</li><li>Choosing u<sub>i</sub> independently of v<sub>i</sub>: compute u<sub>i</sub> = Av<sub>i</sub>/σ<sub>i</sub> so the signs match.</li><li>NumPy returns V<sup>T</sup> (named <code>Vt</code>), not V.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>A = UΣV<sup>T</sup> exists for every matrix: rotate, stretch, rotate.</li><li>σ<sub>i</sub> = √λ<sub>i</sub>(A<sup>T</sup>A); Av<sub>i</sub> = σ<sub>i</sub>u<sub>i</sub>.</li><li>Unit circle → ellipse with semi-axes σ<sub>i</sub>; rank = number of σ &gt; 0; |det| = Πσ.</li><li>Condition number σ<sub>1</sub>/σ<sub>n</sub> measures sensitivity.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/resources/lecture-29-singular-value-decomposition/" target="_blank" rel="noopener">MIT 18.06SC — Lecture 29: Singular Value Decomposition</a></li><li><a href="https://en.wikipedia.org/wiki/Singular_value_decomposition" target="_blank" rel="noopener">Wikipedia — Singular value decomposition (with the rotate–stretch–rotate picture)</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.svd.html" target="_blank" rel="noopener">NumPy — numpy.linalg.svd</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the singular values of diag(3, −2). What are U, Σ, V?</li><li>Find the singular values of [1 1; 1 1]. What is its rank?</li><li>A 2×2 matrix has σ<sub>1</sub> = 10, σ<sub>2</sub> = 0.01. What is |det A| and its condition number? Is solving Ax = b reliable?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) σ = 3, 2; one choice: V = I, Σ = diag(3, 2), U = diag(1, −1) (the minus sign goes into U). 2) A<sup>T</sup>A = [2 2; 2 2] has eigenvalues 4, 0 ⇒ σ = 2, 0; rank 1. 3) |det| = 0.1; condition number 1000 — relative errors in b can be amplified up to 1000×, so be careful.</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 10 · Bài 10.1</span>
<h2>SVD nhìn bằng hình: quay, giãn, quay</h2>
<p class="lead">Vector riêng cần ma trận vuông và có thể không tồn tại. <strong>Phân tích giá trị kỳ dị (SVD)</strong> đúng với <em>mọi</em> ma trận, vuông hay không: mọi ánh xạ tuyến tính đều là một phép quay (hoặc phản chiếu), rồi giãn theo các trục vuông góc, rồi một phép quay nữa.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu A = UΣV<sup>T</sup> và hiểu từng nhân tử bằng hình học.</li><li>Tính tay SVD của ma trận 2×2 từ A<sup>T</sup>A.</li><li>Đọc hạng, |det|, ảnh của đường tròn đơn vị và số điều kiện từ các giá trị kỳ dị.</li><li>Tính SVD bằng NumPy.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Phân tích giá trị kỳ dị</span>A (m×n) = U Σ V<sup>T</sup>    U (m×m) và V (n×n) trực giao, Σ chéo với σ<sub>1</sub> ≥ σ<sub>2</sub> ≥ … ≥ 0<br>A v<sub>i</sub> = σ<sub>i</sub> u<sub>i</sub>    v<sub>i</sub> = vector riêng của A<sup>T</sup>A,  σ<sub>i</sub> = √(trị riêng của A<sup>T</sup>A)</div>
<p>Hình học: V<sup>T</sup> xoay các hướng đầu vào đặc biệt v<sub>1</sub>, v<sub>2</sub> về trùng các trục; Σ giãn các trục với hệ số σ<sub>1</sub>, σ<sub>2</sub>; U xoay kết quả về các hướng đầu ra u<sub>1</sub>, u<sub>2</sub>. Vậy <strong>đường tròn đơn vị được biến thành một elip</strong> có bán trục σ<sub>1</sub>u<sub>1</sub> và σ<sub>2</sub>u<sub>2</sub>. Các v là những đầu vào vuông góc vẫn còn vuông góc sau phép biến đổi.</p>
<ul><li>Hạng A = số σ khác 0.</li><li>Với A vuông: |det A| = σ<sub>1</sub>σ<sub>2</sub>⋯σ<sub>n</sub> (hệ số diện tích = tích các hệ số giãn).</li><li>σ<sub>1</sub> = độ giãn lớn nhất = max ‖Ax‖ trên các x đơn vị. <strong>Số điều kiện</strong> σ<sub>1</sub>/σ<sub>n</sub> cho biết sai số tương đối có thể bị khuếch đại bao nhiêu khi giải Ax = b.</li></ul>
<h3>✍️ Ví dụ — tính SVD bằng tay</h3>
<div class="callout"><p>A = [3 0; 4 5]. Bước 1: A<sup>T</sup>A = [25 20; 20 25], trị riêng 45 và 5 với vector riêng (1, 1) và (1, −1). Vậy <b>σ<sub>1</sub> = √45 = 3√5 ≈ 6,708, σ<sub>2</sub> = √5 ≈ 2,236</b>, v<sub>1</sub> = (1, 1)/√2, v<sub>2</sub> = (1, −1)/√2.</p>
<p>Bước 2: u<sub>i</sub> = Av<sub>i</sub>/σ<sub>i</sub>. Av<sub>1</sub> = (3, 9)/√2 ⇒ u<sub>1</sub> = (1, 3)/√10. Av<sub>2</sub> = (3, −1)/√2 ⇒ u<sub>2</sub> = (3, −1)/√10. Chúng vuông góc ✓.</p>
<p>Kiểm: σ<sub>1</sub>σ<sub>2</sub> = 3√5·√5 = 15 = det A ✓. Số điều kiện = 3. Đường tròn đơn vị thành elip có bán trục 6,708 theo (1, 3) và 2,236 theo (3, −1).</p></div>
<h3>💻 Kiểm bằng NumPy</h3>
<pre><code class="language-python">import numpy as np
np.set_printoptions(precision=4, suppress=True)
A = np.array([[3., 0.],
              [4., 5.]])
U, s, Vt = np.linalg.svd(A)
print(U); print(s); print(Vt)
print(np.allclose(U @ np.diag(s) @ Vt, A))
t = np.linspace(0, 2 * np.pi, 3601)
circle = np.vstack([np.cos(t), np.sin(t)])
lengths = np.linalg.norm(A @ circle, axis=0)
print(round(lengths.max(), 4), round(lengths.min(), 4))   # semi-axes of the ellipse</code></pre>
<div class="out">[[-0.3162 -0.9487]
 [-0.9487  0.3162]]
[6.7082 2.2361]
[[-0.7071 -0.7071]
 [-0.7071  0.7071]]
True
6.7082 2.2361</div>
<p>Các cột U của NumPy là ±(1, 3)/√10 ≈ ±(0,3162; 0,9487) và ±(3, −1)/√10 — cùng hướng như khi làm tay, dấu đổi theo cặp (u<sub>i</sub> và v<sub>i</sub> có thể cùng đổi dấu). Ảnh dài nhất và ngắn nhất của 3601 vector đơn vị xác nhận σ<sub>1</sub> và σ<sub>2</sub>.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nhầm giá trị kỳ dị với trị riêng. Với A = [3 0; 4 5], trị riêng là 3 và 5, giá trị kỳ dị là 6,708 và 2,236. Chúng chỉ trùng nhau với ma trận đối xứng nửa xác định dương.</li><li>Lấy σ = trị riêng của A<sup>T</sup>A (đó là <em>bình phương</em>).</li><li>Chọn u<sub>i</sub> độc lập với v<sub>i</sub>: phải tính u<sub>i</sub> = Av<sub>i</sub>/σ<sub>i</sub> để dấu khớp nhau.</li><li>NumPy trả về V<sup>T</sup> (tên <code>Vt</code>), không phải V.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>A = UΣV<sup>T</sup> tồn tại với mọi ma trận: quay, giãn, quay.</li><li>σ<sub>i</sub> = √λ<sub>i</sub>(A<sup>T</sup>A); Av<sub>i</sub> = σ<sub>i</sub>u<sub>i</sub>.</li><li>Đường tròn đơn vị → elip với bán trục σ<sub>i</sub>; hạng = số σ &gt; 0; |det| = Πσ.</li><li>Số điều kiện σ<sub>1</sub>/σ<sub>n</sub> đo độ nhạy.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/resources/lecture-29-singular-value-decomposition/" target="_blank" rel="noopener">MIT 18.06SC — Bài 29: Phân tích giá trị kỳ dị</a></li><li><a href="https://en.wikipedia.org/wiki/Singular_value_decomposition" target="_blank" rel="noopener">Wikipedia — Phân tích giá trị kỳ dị (có hình quay – giãn – quay)</a></li><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.linalg.svd.html" target="_blank" rel="noopener">NumPy — numpy.linalg.svd</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm giá trị kỳ dị của diag(3, −2). U, Σ, V là gì?</li><li>Tìm giá trị kỳ dị của [1 1; 1 1]. Hạng bằng bao nhiêu?</li><li>Một ma trận 2×2 có σ<sub>1</sub> = 10, σ<sub>2</sub> = 0,01. |det A| và số điều kiện bằng bao nhiêu? Giải Ax = b có đáng tin không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) σ = 3, 2; một cách chọn: V = I, Σ = diag(3, 2), U = diag(1, −1) (dấu trừ đặt vào U). 2) A<sup>T</sup>A = [2 2; 2 2] có trị riêng 4, 0 ⇒ σ = 2, 0; hạng 1. 3) |det| = 0,1; số điều kiện 1000 — sai số tương đối trong b có thể bị khuếch đại tới 1000 lần, phải cẩn thận.</p></div>`);

const c102 = L('mlt201-ts-10-2',
  '10.2 — Low-rank approximation and PCA: compressing images and data|||10.2 — Xấp xỉ hạng thấp và PCA: nén ảnh và dữ liệu',
  'A = Σσᵢuᵢvᵢᵀ; giữ k số hạng đầu là xấp xỉ hạng k tốt nhất (Eckart–Young), sai số = căn tổng σ bỏ đi; nén ảnh 6×8; PCA = SVD của dữ liệu đã trừ trung bình, phương sai giải thích; code NumPy chạy thật.',
  `<span class="eyebrow">MLT201 · Chapter 10 · Lesson 10.2</span>
<h2>Low-rank approximation and PCA</h2>
<p class="lead">The SVD splits a matrix into layers ordered by importance. Keeping only the first few layers gives the <strong>best possible</strong> simpler matrix — the idea behind image compression, recommender systems, noise removal and <strong>principal component analysis (PCA)</strong>.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write A as a sum of rank-one layers σ<sub>i</sub>u<sub>i</sub>v<sub>i</sub><sup>T</sup> and truncate it.</li><li>State the Eckart–Young theorem and compute the approximation error from the singular values.</li><li>Perform PCA on a small data set via the SVD and interpret explained variance.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Layers of a matrix</span>A = σ<sub>1</sub>u<sub>1</sub>v<sub>1</sub><sup>T</sup> + σ<sub>2</sub>u<sub>2</sub>v<sub>2</sub><sup>T</sup> + … + σ<sub>r</sub>u<sub>r</sub>v<sub>r</sub><sup>T</sup>    A<sub>k</sub> = first k layers<br><b>Eckart–Young:</b> A<sub>k</sub> is the closest rank-k matrix to A;  ‖A − A<sub>k</sub>‖ = √(σ<sub>k+1</sub><sup>2</sup> + … + σ<sub>r</sub><sup>2</sup>)  (Frobenius norm)</div>
<p>Storage: an m×n image needs mn numbers; A<sub>k</sub> needs only k(m + n + 1). If the singular values fall quickly, a small k keeps almost everything.</p>
<p><b>PCA.</b> Put n data points as rows of X, subtract the mean of each column (centering), and take the SVD X<sub>c</sub> = UΣV<sup>T</sup>. The rows of V<sup>T</sup> are the <strong>principal directions</strong> — orthogonal axes along which the data spreads most — and the variance along direction i is σ<sub>i</sub><sup>2</sup>/(n − 1). These are exactly the eigenvectors and eigenvalues of the covariance matrix X<sub>c</sub><sup>T</sup>X<sub>c</sub>/(n − 1), a symmetric matrix (Lesson 9.2). Projecting onto the first k directions reduces the dimension while keeping the most variance; unlike least squares, PCA minimises <em>perpendicular</em> distances.</p>
<h3>💻 Worked example in NumPy</h3>
<pre><code class="language-python">import numpy as np
np.set_printoptions(precision=3, suppress=True)
i = np.arange(6)[:, None]
j = np.arange(8)[None, :]
img = (i + j) / 12                     # 6x8 "image": a smooth gradient ...
img[1:4, 5] += 0.8                     # ... plus a short bright stroke
U, s, Vt = np.linalg.svd(img)
print(s)
for k in (1, 2, 3):
    Ak = U[:, :k] @ np.diag(s[:k]) @ Vt[:k]
    print(k, k * (6 + 8 + 1), round(np.linalg.norm(img - Ak), 4))

# PCA of 6 students: (hours studied, test score out of 10)
X = np.array([[1, 2], [2, 3], [3, 5], [4, 4], [5, 6], [6, 7]], dtype=float)
Xc = X - X.mean(axis=0)
U, s, Vt = np.linalg.svd(Xc, full_matrices=False)
print(Vt[0])                           # first principal direction
var = s**2 / (len(X) - 1)
print(var, var / var.sum())            # variance along each direction and its share</code></pre>
<div class="out">[4.307 0.902 0.285 0.    0.    0.   ]
1 15 0.9461
2 30 0.2851
3 45 0.0
[0.707 0.707]
[6.8 0.2] [0.971 0.029]</div>
<p><b>Reading the image part:</b> only 3 singular values are nonzero, so the 48-pixel image has rank 3. One layer (15 numbers) leaves an error of 0.946 = √(0.902<sup>2</sup> + 0.285<sup>2</sup>); two layers (30 numbers) leave 0.285 = σ<sub>3</sub>; three layers reproduce it exactly with 45 numbers. Real photos have hundreds of singular values but they decay fast, so k ≈ 50 of 1000 often looks almost perfect.</p>
<p><b>Reading the PCA part:</b> the mean is (3.5, 4.5) and the covariance matrix is [3.5 3.3; 3.3 3.5], whose eigenvalues are 6.8 and 0.2. The first principal direction (1, 1)/√2 explains <b>97.1 %</b> of the variance: “hours” and “score” move together, and one number per student (their position along (1, 1)) summarises the data well.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Running PCA without centering the data: the first “component” then just points at the mean.</li><li>Features in different units (cm vs kg) dominate by scale; standardise them first when units differ.</li><li>Expecting PCA directions to have a sign: (0.707, 0.707) and (−0.707, −0.707) are the same axis.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>A = Σσ<sub>i</sub>u<sub>i</sub>v<sub>i</sub><sup>T</sup>; keep the first k layers for the best rank-k approximation.</li><li>Error = √(sum of discarded σ<sup>2</sup>); storage k(m + n + 1).</li><li>PCA = SVD of centered data; principal directions = rows of V<sup>T</sup>; variance σ<sub>i</sub><sup>2</sup>/(n − 1).</li><li>Explained variance ratio tells how many components to keep.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Low-rank_approximation" target="_blank" rel="noopener">Wikipedia — Low-rank approximation (Eckart–Young)</a></li><li><a href="https://en.wikipedia.org/wiki/Principal_component_analysis" target="_blank" rel="noopener">Wikipedia — Principal component analysis</a></li><li><a href="https://scikit-learn.org/stable/modules/decomposition.html" target="_blank" rel="noopener">scikit-learn — Decomposing signals in components (PCA, TruncatedSVD)</a></li><li><a href="https://www.coursera.org/learn/pca-machine-learning" target="_blank" rel="noopener">Coursera — Mathematics for Machine Learning: PCA</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A 1000×800 grey image has singular values that make σ<sub>51</sub> onwards negligible. How many numbers does the rank-50 version need, compared with the original?</li><li>A matrix has singular values 10, 3, 0.4. What is the error of the best rank-1 and rank-2 approximations?</li><li>In the PCA example, what fraction of variance would the second component add?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 50·(1000 + 800 + 1) = 90 050 vs 800 000 — about 11 %. 2) Rank 1: √(9 + 0.16) ≈ 3.03; rank 2: 0.4. 3) 2.9 % (0.2 of 7.0), bringing the total to 100 % since the data are 2D.</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 10 · Bài 10.2</span>
<h2>Xấp xỉ hạng thấp và PCA</h2>
<p class="lead">SVD tách một ma trận thành các lớp xếp theo mức quan trọng. Chỉ giữ vài lớp đầu cho ta ma trận đơn giản hơn <strong>tốt nhất có thể</strong> — ý tưởng đằng sau nén ảnh, hệ gợi ý, khử nhiễu và <strong>phân tích thành phần chính (PCA)</strong>.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết A thành tổng các lớp hạng một σ<sub>i</sub>u<sub>i</sub>v<sub>i</sub><sup>T</sup> và cắt bớt.</li><li>Phát biểu định lý Eckart–Young và tính sai số xấp xỉ từ các giá trị kỳ dị.</li><li>Làm PCA cho một tập dữ liệu nhỏ bằng SVD và giải thích phương sai được giải thích.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Các lớp của một ma trận</span>A = σ<sub>1</sub>u<sub>1</sub>v<sub>1</sub><sup>T</sup> + σ<sub>2</sub>u<sub>2</sub>v<sub>2</sub><sup>T</sup> + … + σ<sub>r</sub>u<sub>r</sub>v<sub>r</sub><sup>T</sup>    A<sub>k</sub> = k lớp đầu<br><b>Eckart–Young:</b> A<sub>k</sub> là ma trận hạng k gần A nhất;  ‖A − A<sub>k</sub>‖ = √(σ<sub>k+1</sub><sup>2</sup> + … + σ<sub>r</sub><sup>2</sup>)  (chuẩn Frobenius)</div>
<p>Lưu trữ: ảnh m×n cần mn số; A<sub>k</sub> chỉ cần k(m + n + 1). Nếu các giá trị kỳ dị giảm nhanh, một k nhỏ đã giữ gần như mọi thứ.</p>
<p><b>PCA.</b> Xếp n điểm dữ liệu thành các hàng của X, trừ trung bình mỗi cột (quy tâm), và lấy SVD X<sub>c</sub> = UΣV<sup>T</sup>. Các hàng của V<sup>T</sup> là <strong>các hướng chính</strong> — những trục trực giao mà dữ liệu trải rộng nhất — và phương sai theo hướng i là σ<sub>i</sub><sup>2</sup>/(n − 1). Đó đúng là vector riêng và trị riêng của ma trận hiệp phương sai X<sub>c</sub><sup>T</sup>X<sub>c</sub>/(n − 1), một ma trận đối xứng (Bài 9.2). Chiếu lên k hướng đầu giúp giảm chiều mà giữ được nhiều phương sai nhất; khác với bình phương tối thiểu, PCA cực tiểu khoảng cách <em>vuông góc</em>.</p>
<h3>💻 Ví dụ bằng NumPy</h3>
<pre><code class="language-python">import numpy as np
np.set_printoptions(precision=3, suppress=True)
i = np.arange(6)[:, None]
j = np.arange(8)[None, :]
img = (i + j) / 12                     # 6x8 "image": a smooth gradient ...
img[1:4, 5] += 0.8                     # ... plus a short bright stroke
U, s, Vt = np.linalg.svd(img)
print(s)
for k in (1, 2, 3):
    Ak = U[:, :k] @ np.diag(s[:k]) @ Vt[:k]
    print(k, k * (6 + 8 + 1), round(np.linalg.norm(img - Ak), 4))

# PCA of 6 students: (hours studied, test score out of 10)
X = np.array([[1, 2], [2, 3], [3, 5], [4, 4], [5, 6], [6, 7]], dtype=float)
Xc = X - X.mean(axis=0)
U, s, Vt = np.linalg.svd(Xc, full_matrices=False)
print(Vt[0])                           # first principal direction
var = s**2 / (len(X) - 1)
print(var, var / var.sum())            # variance along each direction and its share</code></pre>
<div class="out">[4.307 0.902 0.285 0.    0.    0.   ]
1 15 0.9461
2 30 0.2851
3 45 0.0
[0.707 0.707]
[6.8 0.2] [0.971 0.029]</div>
<p><b>Đọc phần ảnh:</b> chỉ 3 giá trị kỳ dị khác 0, nên ảnh 48 điểm có hạng 3. Một lớp (15 số) còn sai số 0,946 = √(0,902<sup>2</sup> + 0,285<sup>2</sup>); hai lớp (30 số) còn 0,285 = σ<sub>3</sub>; ba lớp tái tạo chính xác với 45 số. Ảnh thật có hàng trăm giá trị kỳ dị nhưng chúng giảm nhanh, nên k ≈ 50 trên 1000 thường trông gần như hoàn hảo.</p>
<p><b>Đọc phần PCA:</b> trung bình là (3,5; 4,5) và ma trận hiệp phương sai là [3,5 3,3; 3,3 3,5], có trị riêng 6,8 và 0,2. Hướng chính thứ nhất (1, 1)/√2 giải thích <b>97,1 %</b> phương sai: “số giờ học” và “điểm” đi cùng nhau, và một con số cho mỗi sinh viên (vị trí dọc theo (1, 1)) đã tóm tắt dữ liệu khá tốt.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chạy PCA mà không quy tâm dữ liệu: khi đó “thành phần” đầu tiên chỉ trỏ về phía điểm trung bình.</li><li>Các đặc trưng khác đơn vị (cm và kg) áp đảo nhau do thang đo; chuẩn hoá trước khi đơn vị khác nhau.</li><li>Mong hướng PCA có dấu cố định: (0,707; 0,707) và (−0,707; −0,707) là cùng một trục.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>A = Σσ<sub>i</sub>u<sub>i</sub>v<sub>i</sub><sup>T</sup>; giữ k lớp đầu được xấp xỉ hạng k tốt nhất.</li><li>Sai số = √(tổng σ<sup>2</sup> bị bỏ); lưu trữ k(m + n + 1).</li><li>PCA = SVD của dữ liệu đã quy tâm; hướng chính = các hàng của V<sup>T</sup>; phương sai σ<sub>i</sub><sup>2</sup>/(n − 1).</li><li>Tỉ lệ phương sai được giải thích cho biết nên giữ bao nhiêu thành phần.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/Low-rank_approximation" target="_blank" rel="noopener">Wikipedia — Xấp xỉ hạng thấp (Eckart–Young)</a></li><li><a href="https://en.wikipedia.org/wiki/Principal_component_analysis" target="_blank" rel="noopener">Wikipedia — Phân tích thành phần chính</a></li><li><a href="https://scikit-learn.org/stable/modules/decomposition.html" target="_blank" rel="noopener">scikit-learn — Phân rã tín hiệu thành các thành phần (PCA, TruncatedSVD)</a></li><li><a href="https://www.coursera.org/learn/pca-machine-learning" target="_blank" rel="noopener">Coursera — Mathematics for Machine Learning: PCA</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Ảnh xám 1000×800 có các giá trị kỳ dị từ σ<sub>51</sub> trở đi không đáng kể. Bản hạng 50 cần bao nhiêu số, so với ảnh gốc?</li><li>Một ma trận có giá trị kỳ dị 10, 3, 0,4. Sai số của xấp xỉ hạng 1 và hạng 2 tốt nhất là bao nhiêu?</li><li>Trong ví dụ PCA, thành phần thứ hai thêm bao nhiêu phần phương sai?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 50·(1000 + 800 + 1) = 90 050 so với 800 000 — khoảng 11 %. 2) Hạng 1: √(9 + 0,16) ≈ 3,03; hạng 2: 0,4. 3) 2,9 % (0,2 trên 7,0), đưa tổng lên 100 % vì dữ liệu chỉ 2 chiều.</p></div>`);

const c103 = L('mlt201-ts-10-3',
  '10.3 — Matrices at work: robot arms, neural-network layers and the big picture|||10.3 — Ma trận trong thực tế: cánh tay robot, lớp mạng nơ-ron và bức tranh tổng thể',
  'Động học thuận cánh tay 2 khớp bằng tích ma trận đồng nhất; Jacobian và điểm kỳ dị (det J = L₁L₂ sin θ₂); lớp nơ-ron y = σ(Wx + b), vì sao cần hàm phi tuyến (W₂W₁ là một ma trận); ôn tập cả môn; code NumPy.',
  `<span class="eyebrow">MLT201 · Chapter 10 · Lesson 10.3</span>
<h2>Matrices at work: robots, neural networks and the big picture</h2>
<p class="lead">This final lesson puts the course together in two real systems — a robot arm and a neural network — and then reviews the dictionary between matrix algebra and geometry that you have built.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute the forward kinematics of a planar 2-link arm as a product of homogeneous matrices.</li><li>Use the Jacobian determinant to find singular (stuck) configurations.</li><li>Explain a neural-network layer as an affine map plus a nonlinearity, and why stacking linear layers alone is pointless.</li><li>Connect every chapter to its geometric meaning.</li></ul>
<h3>📖 Part 1 — a robot arm</h3>
<p>A planar arm has link lengths L<sub>1</sub>, L<sub>2</sub> and joint angles θ<sub>1</sub>, θ<sub>2</sub>. Each joint “rotates by θ, then moves L along the new x-axis”:</p>
<div class="formula"><span class="lbl">One link (homogeneous 2D)</span>M(θ, L) = R(θ) T(L, 0) = [cos θ −sin θ L cos θ; sin θ cos θ L sin θ; 0 0 1]<br>gripper position = M(θ<sub>1</sub>, L<sub>1</sub>) M(θ<sub>2</sub>, L<sub>2</sub>) (0, 0, 1)  ⇒  (L<sub>1</sub>cos θ<sub>1</sub> + L<sub>2</sub>cos(θ<sub>1</sub> + θ<sub>2</sub>),  L<sub>1</sub>sin θ<sub>1</sub> + L<sub>2</sub>sin(θ<sub>1</sub> + θ<sub>2</sub>))</div>
<p>This is the scene-graph rule of Lesson 6.2: each link is a child of the previous one. Industrial 6-joint arms do exactly the same with six 4×4 matrices (the Denavit–Hartenberg convention).</p>
<p><b>Velocities and the Jacobian.</b> Small joint movements (dθ<sub>1</sub>, dθ<sub>2</sub>) produce a small gripper movement J(dθ<sub>1</sub>, dθ<sub>2</sub>), where J is the 2×2 Jacobian. For this arm det J = L<sub>1</sub>L<sub>2</sub> sin θ<sub>2</sub>. When θ<sub>2</sub> = 0° or 180° (arm fully stretched or folded) det J = 0: J flattens the plane of velocities onto a line, and the gripper <em>cannot</em> move in some direction no matter how the motors turn — a <strong>singularity</strong>, exactly the “det = 0 ⇒ collapse” of Chapter 5. Robot controllers solve J dθ = (desired velocity) with Lesson 4.3's solver and must avoid these poses.</p>
<h3>📖 Part 2 — a neural-network layer</h3>
<p>A dense layer computes y = σ(Wx + b): an affine map (matrix W, bias b — Lesson 6.1) followed by a nonlinear function σ (such as ReLU, max(0, ·)) applied entry by entry. Without σ, two layers give W<sub>2</sub>(W<sub>1</sub>x) = (W<sub>2</sub>W<sub>1</sub>)x — <strong>still one matrix</strong> (composition, Lesson 4.1). However many linear layers you stack, the network can only rotate, stretch and project; the nonlinearity is what lets it bend space.</p>
<h3>💻 Check it in NumPy</h3>
<pre><code class="language-python">import numpy as np

def link(theta_deg, L):     # rotate by theta, then move L along the new x-axis
    t = np.radians(theta_deg); c, s = np.cos(t), np.sin(t)
    return np.array([[c, -s, L * c],
                     [s,  c, L * s],
                     [0,  0, 1]])

M = link(30, 2) @ link(45, 1)
print(np.round(M @ [0, 0, 1], 4))      # position of the gripper

def jac_det(t2_deg, L1=2, L2=1):
    return L1 * L2 * np.sin(np.radians(t2_deg))
print(round(jac_det(45), 4), round(jac_det(0), 4))

# two linear layers without an activation collapse into one
W1 = np.array([[1, 2], [0, 1], [1, -1]])
W2 = np.array([[1, 0, 2], [3, 1, 0]])
x = np.array([1, 1])
print(W2 @ (W1 @ x), (W2 @ W1) @ x, W2 @ W1)</code></pre>
<div class="out">[1.9909 1.9659 1.    ]
1.4142 0.0
[ 3 10] [ 3 10] [[3 0]
 [3 7]]</div>
<p>With L<sub>1</sub> = 2, L<sub>2</sub> = 1, θ<sub>1</sub> = 30°, θ<sub>2</sub> = 45° the gripper is at (2cos 30° + cos 75°, 2sin 30° + sin 75°) ≈ (1.991, 1.966) ✓. det J = 2 sin 45° ≈ 1.414, but 0 when the arm is straight. The two-layer linear “network” equals the single 2×2 matrix [3 0; 3 7].</p>
<h3>🗺️ The course in one table</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Ax (Ch. 1)</span><span class="v">combination of columns; columns = images of e<sub>1</sub>, e<sub>2</sub></span></div>
<div class="kv"><span class="k">Kernel / image (Ch. 2)</span><span class="v">what is crushed / what is reached</span></div>
<div class="kv"><span class="k">Gallery (Ch. 3)</span><span class="v">rotation, reflection, scaling, shear, projection</span></div>
<div class="kv"><span class="k">AB, A<sup>−1</sup> (Ch. 4)</span><span class="v">do B then A; undo</span></div>
<div class="kv"><span class="k">det (Ch. 5)</span><span class="v">signed area/volume factor</span></div>
<div class="kv"><span class="k">Homogeneous (Ch. 6)</span><span class="v">translation and perspective as matrices</span></div>
<div class="kv"><span class="k">P<sup>−1</sup>AP (Ch. 7)</span><span class="v">same map, different grid</span></div>
<div class="kv"><span class="k">Av = λv (Ch. 8)</span><span class="v">directions not turned; long-run behaviour</span></div>
<div class="kv"><span class="k">QΛQ<sup>T</sup> (Ch. 9)</span><span class="v">stretch along perpendicular axes</span></div>
<div class="kv"><span class="k">UΣV<sup>T</sup> (Ch. 10)</span><span class="v">rotate, stretch, rotate — for every matrix</span></div>
</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Multiplying the link matrices in the wrong order (child before parent).</li><li>Forgetting that joint angles add up along the chain: link 2's absolute angle is θ<sub>1</sub> + θ<sub>2</sub>.</li><li>Thinking a deeper purely linear network is more powerful. It is not; it is one matrix.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Forward kinematics = product of homogeneous link matrices.</li><li>det J = 0 marks robot singularities (lost directions of motion).</li><li>Neural layer = affine map + nonlinearity; linear layers compose to one matrix.</li><li>Every matrix fact has a geometric meaning — keep drawing.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://modernrobotics.northwestern.edu/nu-gm-book-resource/3-3-1-homogeneous-transformation-matrices/" target="_blank" rel="noopener">Modern Robotics (Lynch &amp; Park) — 3.3.1 Homogeneous Transformation Matrices</a></li><li><a href="https://hades.mech.northwestern.edu/index.php/Modern_Robotics" target="_blank" rel="noopener">Modern Robotics — free book and videos (Northwestern)</a></li><li><a href="https://en.wikipedia.org/wiki/Forward_kinematics" target="_blank" rel="noopener">Wikipedia — Forward kinematics</a></li><li><a href="https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/" target="_blank" rel="noopener">MIT OCW 18.065 — Matrix Methods in Data Analysis and Machine Learning</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>For L<sub>1</sub> = L<sub>2</sub> = 1, θ<sub>1</sub> = 90°, θ<sub>2</sub> = −90°, where is the gripper?</li><li>For which θ<sub>2</sub> is the 2-link arm singular? Describe the two poses.</li><li>A network has layers W<sub>1</sub> (3×2) and W<sub>2</sub> (2×3) with no activation. What single matrix size describes it, and can it ever map (1, 0) and (2, 0) to non-parallel outputs?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (cos 90° + cos 0°, sin 90° + sin 0°) = (1, 1). 2) sin θ<sub>2</sub> = 0: θ<sub>2</sub> = 0° (fully stretched, at the edge of the workspace) or 180° (folded back on itself). 3) W<sub>2</sub>W<sub>1</sub> is 2×2; it is linear, so the image of (2, 0) is twice the image of (1, 0) — always parallel.</p></div>`,
  `<span class="eyebrow">MLT201 · Chương 10 · Bài 10.3</span>
<h2>Ma trận trong thực tế: robot, mạng nơ-ron và bức tranh tổng thể</h2>
<p class="lead">Bài cuối ráp cả môn vào hai hệ thống thật — một cánh tay robot và một mạng nơ-ron — rồi ôn lại cuốn từ điển giữa đại số ma trận và hình học mà bạn đã dựng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính động học thuận của cánh tay phẳng 2 khớp bằng tích các ma trận đồng nhất.</li><li>Dùng định thức Jacobian tìm các tư thế kỳ dị (bị kẹt).</li><li>Giải thích một lớp mạng nơ-ron là ánh xạ affine cộng hàm phi tuyến, và vì sao chồng toàn lớp tuyến tính là vô ích.</li><li>Nối mỗi chương với ý nghĩa hình học của nó.</li></ul>
<h3>📖 Phần 1 — cánh tay robot</h3>
<p>Một cánh tay phẳng có độ dài khâu L<sub>1</sub>, L<sub>2</sub> và góc khớp θ<sub>1</sub>, θ<sub>2</sub>. Mỗi khớp “quay góc θ, rồi đi L dọc trục x mới”:</p>
<div class="formula"><span class="lbl">Một khâu (đồng nhất 2D)</span>M(θ, L) = R(θ) T(L, 0) = [cos θ −sin θ L cos θ; sin θ cos θ L sin θ; 0 0 1]<br>vị trí tay gắp = M(θ<sub>1</sub>, L<sub>1</sub>) M(θ<sub>2</sub>, L<sub>2</sub>) (0, 0, 1)  ⇒  (L<sub>1</sub>cos θ<sub>1</sub> + L<sub>2</sub>cos(θ<sub>1</sub> + θ<sub>2</sub>),  L<sub>1</sub>sin θ<sub>1</sub> + L<sub>2</sub>sin(θ<sub>1</sub> + θ<sub>2</sub>))</div>
<p>Đây chính là quy tắc đồ thị cảnh của Bài 6.2: mỗi khâu là con của khâu trước. Cánh tay công nghiệp 6 khớp làm y hệt với sáu ma trận 4×4 (quy ước Denavit–Hartenberg).</p>
<p><b>Vận tốc và Jacobian.</b> Các dịch chuyển khớp nhỏ (dθ<sub>1</sub>, dθ<sub>2</sub>) tạo ra dịch chuyển tay gắp nhỏ J(dθ<sub>1</sub>, dθ<sub>2</sub>), với J là Jacobian 2×2. Với cánh tay này det J = L<sub>1</sub>L<sub>2</sub> sin θ<sub>2</sub>. Khi θ<sub>2</sub> = 0° hoặc 180° (tay duỗi thẳng hoặc gập lại) det J = 0: J ép mặt phẳng vận tốc xuống một đường thẳng, và tay gắp <em>không thể</em> di chuyển theo một hướng nào đó dù động cơ quay thế nào — một <strong>điểm kỳ dị</strong>, đúng là “det = 0 ⇒ sụp” của Chương 5. Bộ điều khiển robot giải J dθ = (vận tốc mong muốn) bằng bộ giải của Bài 4.3 và phải tránh các tư thế này.</p>
<h3>📖 Phần 2 — một lớp mạng nơ-ron</h3>
<p>Một lớp dày đặc tính y = σ(Wx + b): một ánh xạ affine (ma trận W, độ lệch b — Bài 6.1) rồi một hàm phi tuyến σ (như ReLU, max(0, ·)) áp lên từng phần tử. Không có σ, hai lớp cho W<sub>2</sub>(W<sub>1</sub>x) = (W<sub>2</sub>W<sub>1</sub>)x — <strong>vẫn chỉ là một ma trận</strong> (hợp thành, Bài 4.1). Chồng bao nhiêu lớp tuyến tính đi nữa, mạng chỉ biết quay, giãn và chiếu; chính hàm phi tuyến mới cho nó uốn cong không gian.</p>
<h3>💻 Kiểm bằng NumPy</h3>
<pre><code class="language-python">import numpy as np

def link(theta_deg, L):     # rotate by theta, then move L along the new x-axis
    t = np.radians(theta_deg); c, s = np.cos(t), np.sin(t)
    return np.array([[c, -s, L * c],
                     [s,  c, L * s],
                     [0,  0, 1]])

M = link(30, 2) @ link(45, 1)
print(np.round(M @ [0, 0, 1], 4))      # position of the gripper

def jac_det(t2_deg, L1=2, L2=1):
    return L1 * L2 * np.sin(np.radians(t2_deg))
print(round(jac_det(45), 4), round(jac_det(0), 4))

# two linear layers without an activation collapse into one
W1 = np.array([[1, 2], [0, 1], [1, -1]])
W2 = np.array([[1, 0, 2], [3, 1, 0]])
x = np.array([1, 1])
print(W2 @ (W1 @ x), (W2 @ W1) @ x, W2 @ W1)</code></pre>
<div class="out">[1.9909 1.9659 1.    ]
1.4142 0.0
[ 3 10] [ 3 10] [[3 0]
 [3 7]]</div>
<p>Với L<sub>1</sub> = 2, L<sub>2</sub> = 1, θ<sub>1</sub> = 30°, θ<sub>2</sub> = 45°, tay gắp ở (2cos 30° + cos 75°, 2sin 30° + sin 75°) ≈ (1,991; 1,966) ✓. det J = 2 sin 45° ≈ 1,414, nhưng bằng 0 khi tay duỗi thẳng. “Mạng” tuyến tính hai lớp bằng đúng một ma trận 2×2 [3 0; 3 7].</p>
<h3>🗺️ Cả môn trong một bảng</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Ax (Ch. 1)</span><span class="v">tổ hợp các cột; cột = ảnh của e<sub>1</sub>, e<sub>2</sub></span></div>
<div class="kv"><span class="k">Hạt nhân / ảnh (Ch. 2)</span><span class="v">cái bị ép bẹp / cái với tới được</span></div>
<div class="kv"><span class="k">Bộ sưu tập (Ch. 3)</span><span class="v">quay, phản chiếu, co giãn, trượt, chiếu</span></div>
<div class="kv"><span class="k">AB, A<sup>−1</sup> (Ch. 4)</span><span class="v">làm B rồi A; hoàn tác</span></div>
<div class="kv"><span class="k">det (Ch. 5)</span><span class="v">hệ số diện tích/thể tích có dấu</span></div>
<div class="kv"><span class="k">Đồng nhất (Ch. 6)</span><span class="v">tịnh tiến và phối cảnh thành ma trận</span></div>
<div class="kv"><span class="k">P<sup>−1</sup>AP (Ch. 7)</span><span class="v">cùng phép biến đổi, khác lưới</span></div>
<div class="kv"><span class="k">Av = λv (Ch. 8)</span><span class="v">hướng không bị quay; hành vi dài hạn</span></div>
<div class="kv"><span class="k">QΛQ<sup>T</sup> (Ch. 9)</span><span class="v">giãn theo các trục vuông góc</span></div>
<div class="kv"><span class="k">UΣV<sup>T</sup> (Ch. 10)</span><span class="v">quay, giãn, quay — với mọi ma trận</span></div>
</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nhân các ma trận khâu sai thứ tự (con trước cha).</li><li>Quên rằng góc khớp cộng dồn dọc chuỗi: góc tuyệt đối của khâu 2 là θ<sub>1</sub> + θ<sub>2</sub>.</li><li>Nghĩ mạng thuần tuyến tính sâu hơn thì mạnh hơn. Không; nó chỉ là một ma trận.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Động học thuận = tích các ma trận đồng nhất của các khâu.</li><li>det J = 0 đánh dấu điểm kỳ dị của robot (mất hướng chuyển động).</li><li>Lớp nơ-ron = ánh xạ affine + phi tuyến; các lớp tuyến tính hợp lại thành một ma trận.</li><li>Mọi sự thật về ma trận đều có ý nghĩa hình học — hãy tiếp tục vẽ.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://modernrobotics.northwestern.edu/nu-gm-book-resource/3-3-1-homogeneous-transformation-matrices/" target="_blank" rel="noopener">Modern Robotics (Lynch &amp; Park) — 3.3.1 Ma trận biến đổi đồng nhất</a></li><li><a href="https://hades.mech.northwestern.edu/index.php/Modern_Robotics" target="_blank" rel="noopener">Modern Robotics — sách và video miễn phí (Northwestern)</a></li><li><a href="https://en.wikipedia.org/wiki/Forward_kinematics" target="_blank" rel="noopener">Wikipedia — Động học thuận</a></li><li><a href="https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/" target="_blank" rel="noopener">MIT OCW 18.065 — Phương pháp ma trận trong phân tích dữ liệu và học máy</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Với L<sub>1</sub> = L<sub>2</sub> = 1, θ<sub>1</sub> = 90°, θ<sub>2</sub> = −90°, tay gắp ở đâu?</li><li>Với θ<sub>2</sub> nào thì cánh tay 2 khớp bị kỳ dị? Mô tả hai tư thế đó.</li><li>Một mạng có các lớp W<sub>1</sub> (3×2) và W<sub>2</sub> (2×3), không có hàm kích hoạt. Ma trận đơn nào mô tả nó, cỡ bao nhiêu, và nó có bao giờ đưa (1, 0) và (2, 0) tới hai đầu ra không cùng phương không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (cos 90° + cos 0°, sin 90° + sin 0°) = (1, 1). 2) sin θ<sub>2</sub> = 0: θ<sub>2</sub> = 0° (duỗi thẳng, ở rìa vùng làm việc) hoặc 180° (gập ngược vào chính nó). 3) W<sub>2</sub>W<sub>1</sub> cỡ 2×2; nó tuyến tính nên ảnh của (2, 0) gấp đôi ảnh của (1, 0) — luôn cùng phương.</p></div>`);

const q10 = QZ(10, 'Quiz — Chapter 10: SVD and applications|||Quiz — Chương 10: SVD và ứng dụng', 'Kiểm tra chương 10: SVD hình học, giá trị kỳ dị, xấp xỉ hạng thấp, PCA, động học robot, Jacobian, lớp mạng nơ-ron.', [
  Q('q1', "Geometrically, A = UΣVᵀ says every matrix is|||Về hình học, A = UΣVᵀ nói mọi ma trận là",
    ['rotate, stretch along axes, rotate|||quay, giãn theo trục, quay', 'shear, then translate|||trượt rồi tịnh tiến', 'a projection|||một phép chiếu', 'a rotation only|||chỉ một phép quay'], 0,
    "Vᵀ and U are orthogonal, Σ is diagonal.|||Vᵀ và U trực giao, Σ là ma trận chéo."),
  Q('q2', "The singular values of A are|||Giá trị kỳ dị của A là",
    ['the eigenvalues of A|||trị riêng của A', 'the square roots of the eigenvalues of AᵀA|||căn bậc hai của trị riêng của AᵀA', 'the diagonal entries of A|||các phần tử đường chéo của A', 'the eigenvalues of AᵀA|||trị riêng của AᵀA'], 1,
    "σᵢ = √λᵢ(AᵀA).|||σᵢ = √λᵢ(AᵀA)."),
  Q('q3', "For A = [3 0; 4 5], the singular values are|||Với A = [3 0; 4 5], các giá trị kỳ dị là",
    ['3 and 5|||3 và 5', '3√5 and √5|||3√5 và √5', '45 and 5|||45 và 5', '25 and 20|||25 và 20'], 1,
    "AᵀA = [25 20; 20 25] has eigenvalues 45 and 5.|||AᵀA = [25 20; 20 25] có trị riêng 45 và 5."),
  Q('q4', "A matrix maps the unit circle to an ellipse whose semi-axes have lengths|||Một ma trận biến đường tròn đơn vị thành elip có độ dài bán trục",
    ['its eigenvalues|||bằng các trị riêng', 'its singular values|||bằng các giá trị kỳ dị', 'its diagonal entries|||bằng các phần tử đường chéo', '1 and det A|||1 và det A'], 1,
    "Av_i = σ_i u_i with u_i perpendicular unit vectors.|||Av_i = σ_i u_i với u_i là các vector đơn vị vuông góc."),
  Q('q5', "Singular values 10, 3, 0.4. The error of the best rank-2 approximation is|||Giá trị kỳ dị 10, 3, 0,4. Sai số của xấp xỉ hạng 2 tốt nhất là",
    ['0.4|||0,4', '3.4|||3,4', '3.03|||3,03', '0|||0'], 0,
    "Eckart–Young: √(σ₃²) = 0.4.|||Eckart–Young: √(σ₃²) = 0,4."),
  Q('q6', "Before computing PCA by SVD you must|||Trước khi tính PCA bằng SVD bạn phải",
    ['sort the data|||sắp xếp dữ liệu', 'subtract the mean of each feature|||trừ trung bình của mỗi đặc trưng', 'invert the data matrix|||nghịch đảo ma trận dữ liệu', 'make the matrix square|||làm ma trận vuông'], 1,
    "PCA uses the centered data so that directions describe spread, not location.|||PCA dùng dữ liệu đã quy tâm để các hướng mô tả độ phân tán, không phải vị trí."),
  Q('q7', "For the 2-link arm with L₁ = 2, L₂ = 1, θ₁ = 30°, θ₂ = 45°, the gripper is near|||Với cánh tay 2 khâu L₁ = 2, L₂ = 1, θ₁ = 30°, θ₂ = 45°, tay gắp ở gần",
    ['(1.99, 1.97)|||(1,99; 1,97)', '(3, 0)|||(3, 0)', '(2.71, 0.71)|||(2,71; 0,71)', '(1, 1)|||(1, 1)'], 0,
    "(2cos30° + cos75°, 2sin30° + sin75°).|||(2cos30° + cos75°, 2sin30° + sin75°)."),
  Q('q8', "The 2-link arm is singular (det J = L₁L₂ sin θ₂ = 0) when|||Cánh tay 2 khâu kỳ dị (det J = L₁L₂ sin θ₂ = 0) khi",
    ['θ₁ = 0°|||θ₁ = 0°', 'θ₂ = 0° or 180°|||θ₂ = 0° hoặc 180°', 'θ₂ = 90°|||θ₂ = 90°', 'never|||không bao giờ'], 1,
    "Stretched straight or folded back: one direction of motion is lost.|||Duỗi thẳng hoặc gập lại: mất một hướng chuyển động."),
  Q('q9', "Two neural-network layers without activation functions are equivalent to|||Hai lớp mạng nơ-ron không có hàm kích hoạt tương đương với",
    ['a single matrix (W₂W₁)|||một ma trận duy nhất (W₂W₁)', 'a nonlinear function|||một hàm phi tuyến', 'a projection always|||luôn là phép chiếu', 'nothing|||không gì cả'], 0,
    "Composition of linear maps is linear.|||Hợp thành của ánh xạ tuyến tính là tuyến tính."),
]);

const ch10 = {
  title: 'Chapter 10 — SVD and applications: compression, PCA, robots, neural networks|||Chương 10 — SVD và ứng dụng: nén, PCA, robot, mạng nơ-ron',
  description: 'SVD hình học quay – giãn – quay, tính tay từ AᵀA, số điều kiện; xấp xỉ hạng thấp (Eckart–Young), nén ảnh, PCA; động học robot, Jacobian và điểm kỳ dị; lớp mạng nơ-ron; ôn tập cả môn (Lay 7.4–7.5 · Strang ch.7 · MML ch.4, 10).',
  lessons: [c101, c102, c103, q10],
};

// ───────────────────────────── Xuất ─────────────────────────────
export default [muc0, ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9, ch10];
