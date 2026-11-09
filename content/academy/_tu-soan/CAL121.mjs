// Khoá TỰ SOẠN cho CAL121 — trường chưa công bố syllabus trên FLM (dò 09/11/2026). Soạn theo _HOP-DONG-TU-SOAN.md.
// NỐI TIẾP content/academy/_tu-soan/CAL111.mjs (Giải tích I: hàm số → giới hạn → đạo hàm → tích phân, đổi biến,
// từng phần, tích phân lượng giác, phân thức, ứng dụng, tích phân suy rộng & tích phân số). CAL121 KHÔNG dạy lại những
// phần đó: Chương 1 chỉ ôn nhanh rồi thêm phần CAL111 chưa có (thế lượng giác, diện tích mặt tròn xoay, trọng tâm).
// Khung bám giáo trình chuẩn: Stewart/Clegg/Watson "Calculus: Early Transcendentals" 9e (ch. 7–16) và
// OpenStax "Calculus Volume 2" (ch. 2–7) + "Calculus Volume 3" (ch. 2, 4, 5, 6) — Strang & Herman.
// Mọi ví dụ số / đáp án đã kiểm bằng sympy (python3). Code Python đã chạy thật, output dán nguyên văn.
// Mọi link ngoài đã mở thử (HTTP 200 + tiêu đề trang đúng chủ đề) ngày 09/11/2026.
// ⚠️ File này KHÔNG dùng chuỗi nội suy (dấu đô-la + ngoặc nhọn) và không backtick lồng; nội dung ghép bằng toán tử +.

const bi = (en, vi) => '<div class="ml-en">' + en + '</div>\n<div class="ml-vi">' + vi + '</div>';
const L = (slug, title, description, en, vi) => ({ title, slug, type: 'DOCUMENT', description, content: bi(en, vi) });
const Q = (id, question, options, correctIndex, explanation) => ({ id, question, options, correctIndex, points: 1, explanation });
const QZ = (ch, title, description, questions) => ({
  title, slug: 'cal121-ts-quiz-' + ch, type: 'QUIZ', description,
  quiz: { timeLimitSeconds: 900, questions },
});
const A = (href, text) => '<a href="' + href + '" target="_blank" rel="noopener">' + text + '</a>';
const OS2 = 'https://openstax.org/books/calculus-volume-2/pages/';
const OS3 = 'https://openstax.org/books/calculus-volume-3/pages/';
const PN2 = 'https://tutorial.math.lamar.edu/Classes/CalcII/';
const PN3 = 'https://tutorial.math.lamar.edu/Classes/CalcIII/';
const PDE = 'https://tutorial.math.lamar.edu/Classes/DE/';

// ───────────────────────────── Mục 0 ─────────────────────────────
const m01 = L('cal121-ts-0-1',
  '0.1 — Welcome to CAL121: what Calculus II is and why you study it|||0.1 — Giới thiệu CAL121: Giải tích II học gì, để làm gì',
  'Giải tích II học gì (phương trình vi phân, tham số – cực, chuỗi, Taylor, vectơ, hàm nhiều biến, tích phân bội, giải tích vectơ), dùng vào đâu, 8 chuẩn đầu ra tự soạn, môn liên quan, cảnh báo: trường chưa công bố syllabus trên FLM.',
  `<span class="eyebrow">CAL121 · Section 0 · Lesson 0.1</span>
<h2>Welcome to Calculus II</h2>
<p class="lead">Calculus I gave you two tools — the derivative and the integral — for functions of <strong>one</strong> variable. Calculus II pushes those tools in three directions: towards <strong>infinity</strong> (sequences, series, Taylor polynomials), towards <strong>change laws</strong> (differential equations) and towards <strong>several dimensions</strong> (vectors, functions of several variables, multiple integrals, vector fields).</p>
<div class="callout"><p>⚠️ <strong>Important.</strong> FPT University has <strong>not published the CAL121 syllabus on FLM</strong> (we searched the course code, its variants and the course name on 09/11/2026). This course framework is therefore <strong>self-authored</strong>, following the chapter order of the international standard textbooks (Stewart <em>Calculus: Early Transcendentals</em> 9e, chapters 7–16, and OpenStax <em>Calculus Volume 2</em> and <em>Volume 3</em>). <strong>Grading weights, assessment format and exam dates are decided by your lecturer</strong> — always follow the course outline your lecturer gives in class. If your class covers a topic in a different order, use the chapter list below as a map.</p></div>
<h3>How CAL121 continues CAL111</h3>
<p>CAL111 ended with integration techniques (substitution, parts, trigonometric integrals, partial fractions), applications (area, volume, arc length, work) and improper and numerical integrals. We do <strong>not</strong> repeat that material. Chapter 1 is a one-lesson rapid review, then adds what CAL111 did not cover: trigonometric substitution, surface area and centres of mass. From Chapter 2 on, everything is new.</p>
<h3>Why does a software / AI student need it?</h3>
<ul>
<li><strong>Machine learning:</strong> a loss function depends on thousands of parameters — it is a function of several variables. Training moves along the negative <strong>gradient</strong> (Chapter 8); constrained problems such as SVMs use <strong>Lagrange multipliers</strong> (Chapter 9).</li>
<li><strong>Numerical computing:</strong> your computer evaluates sin x, e<sup>x</sup> and ln x with <strong>Taylor polynomials</strong> and error bounds (Chapter 6); simulations step through <strong>differential equations</strong> with Euler-type methods (Chapter 2).</li>
<li><strong>Graphics &amp; games:</strong> curves and camera paths are <strong>parametric</strong> (Chapter 3); lighting, normals and collisions use the <strong>dot and cross products</strong> and planes (Chapter 7).</li>
<li><strong>Probability &amp; data:</strong> joint densities of two random variables are integrated with <strong>double integrals</strong>; the normal distribution's constant √π comes from a polar double integral (Chapter 10).</li>
<li><strong>Algorithms:</strong> series tell you whether an infinite process converges and how fast — the harmonic series is why some algorithms cost about ln n.</li>
</ul>
<h3>Learning outcomes (self-authored)</h3>
<p>After this course you should be able to:</p>
<ol>
<li>Integrate with trigonometric substitution and compute surface areas of revolution and centres of mass.</li>
<li>Model with first-order differential equations; solve separable and linear equations; approximate solutions with Euler's method.</li>
<li>Work with parametric curves and polar coordinates: tangents, areas and arc lengths.</li>
<li>Decide convergence of sequences and series with the divergence, integral, comparison, alternating, ratio and root tests, and estimate remainders.</li>
<li>Find radius and interval of convergence of power series; build Taylor and Maclaurin series and bound the error of Taylor polynomials.</li>
<li>Compute with vectors in space (dot and cross products, projections) and write equations of lines and planes.</li>
<li>Compute partial derivatives, tangent planes, the multivariable chain rule, gradients and directional derivatives; find and classify extrema, including with Lagrange multipliers.</li>
<li>Evaluate double and triple integrals in rectangular, polar, cylindrical and spherical coordinates, use a Jacobian, and evaluate line integrals with the Fundamental Theorem for line integrals and Green's theorem.</li>
</ol>
<h3>Related courses at FPTU</h3>
<p>CAL121 sits in <strong>semester 2</strong> and requires <strong>CAL111 — Calculus I</strong> (limits, derivatives, integrals). Its multiple integrals and series are used later in <strong>MAS291 — Statistics &amp; Probability</strong>, and its gradients, Taylor approximations and optimisation are the mathematical core of the AI / machine-learning courses later in the programme.</p>
<h3>Course map</h3>
<ul>
<li>Ch. 1 Bridge from Calculus I · Ch. 2 Differential equations · Ch. 3 Parametric &amp; polar</li>
<li>Ch. 4–5 Sequences and series, convergence tests · Ch. 6 Power series and Taylor series</li>
<li>Ch. 7 Vectors and the geometry of space · Ch. 8 Partial derivatives · Ch. 9 Optimisation</li>
<li>Ch. 10 Double integrals · Ch. 11 Triple integrals and change of variables · Ch. 12 Introduction to vector calculus</li>
</ul>
<h3>How to study this course</h3>
<ul>
<li>Each lesson: objectives, lecture, step-by-step examples, common mistakes, 📌 summary, 🔗 further learning, 🧪 practice with answers. Each chapter ends with a quiz.</li>
<li>Work every practice problem <strong>on paper first</strong>; only then open the answer.</li>
<li>Use GeoGebra 3D to <em>see</em> surfaces and regions before you integrate — half of multivariable calculus is drawing the region correctly.</li>
</ul>`,
  `<span class="eyebrow">CAL121 · Mục 0 · Bài 0.1</span>
<h2>Chào mừng đến với Giải tích II</h2>
<p class="lead">Giải tích I cho bạn hai công cụ — đạo hàm và tích phân — cho hàm <strong>một</strong> biến. Giải tích II đẩy hai công cụ đó theo ba hướng: ra <strong>vô hạn</strong> (dãy, chuỗi, đa thức Taylor), tới <strong>quy luật thay đổi</strong> (phương trình vi phân) và lên <strong>nhiều chiều</strong> (vectơ, hàm nhiều biến, tích phân bội, trường vectơ).</p>
<div class="callout"><p>⚠️ <strong>Lưu ý quan trọng.</strong> Trường <strong>chưa công bố syllabus của CAL121 trên FLM</strong> (đã dò mã môn, mã biến thể và tên môn ngày 09/11/2026). Vì vậy khung môn này là <strong>khung tự soạn</strong>, bám thứ tự chương của giáo trình chuẩn quốc tế (Stewart <em>Calculus: Early Transcendentals</em> lần 9, chương 7–16, và OpenStax <em>Calculus Volume 2</em>, <em>Volume 3</em>). <strong>Cách tính điểm, hình thức đánh giá và lịch thi theo giảng viên</strong> — luôn theo đề cương giảng viên phát trên lớp. Nếu lớp bạn học theo thứ tự khác, dùng danh sách chương bên dưới như bản đồ.</p></div>
<h3>CAL121 nối tiếp CAL111 thế nào</h3>
<p>CAL111 kết thúc ở kỹ thuật tích phân (đổi biến, từng phần, tích phân lượng giác, phân thức hữu tỉ), ứng dụng (diện tích, thể tích, độ dài cung, công) và tích phân suy rộng, tích phân số. Khoá này <strong>không</strong> dạy lại các phần đó. Chương 1 chỉ có một bài ôn nhanh, rồi thêm phần CAL111 chưa có: phép thế lượng giác, diện tích mặt tròn xoay và trọng tâm. Từ Chương 2 trở đi là kiến thức mới hoàn toàn.</p>
<h3>Sinh viên phần mềm / AI cần nó để làm gì?</h3>
<ul>
<li><strong>Học máy:</strong> hàm mất mát phụ thuộc hàng nghìn tham số — tức là hàm nhiều biến. Huấn luyện là đi ngược chiều <strong>gradient</strong> (Chương 8); bài toán có ràng buộc như SVM dùng <strong>nhân tử Lagrange</strong> (Chương 9).</li>
<li><strong>Tính toán số:</strong> máy tính tính sin x, e<sup>x</sup>, ln x bằng <strong>đa thức Taylor</strong> kèm cận sai số (Chương 6); mô phỏng bước qua <strong>phương trình vi phân</strong> bằng các phương pháp kiểu Euler (Chương 2).</li>
<li><strong>Đồ hoạ &amp; game:</strong> đường cong và quỹ đạo camera là <strong>đường tham số</strong> (Chương 3); ánh sáng, pháp tuyến, va chạm dùng <strong>tích vô hướng, tích có hướng</strong> và mặt phẳng (Chương 7).</li>
<li><strong>Xác suất &amp; dữ liệu:</strong> mật độ đồng thời của hai biến ngẫu nhiên được lấy <strong>tích phân kép</strong>; hằng số √π của phân phối chuẩn đến từ một tích phân kép trong toạ độ cực (Chương 10).</li>
<li><strong>Thuật toán:</strong> chuỗi cho biết một quá trình vô hạn có hội tụ không và nhanh cỡ nào — chuỗi điều hoà là lý do có thuật toán tốn khoảng ln n.</li>
</ul>
<h3>Chuẩn đầu ra (tự soạn)</h3>
<p>Học xong môn, bạn cần làm được:</p>
<ol>
<li>Tính tích phân bằng phép thế lượng giác; tính diện tích mặt tròn xoay và trọng tâm.</li>
<li>Lập mô hình bằng phương trình vi phân cấp một; giải phương trình tách biến và tuyến tính; xấp xỉ nghiệm bằng phương pháp Euler.</li>
<li>Làm việc với đường cong tham số và toạ độ cực: tiếp tuyến, diện tích, độ dài cung.</li>
<li>Xét hội tụ của dãy và chuỗi bằng tiêu chuẩn phân kỳ, tích phân, so sánh, chuỗi đan dấu, tỉ số, căn; ước lượng phần dư.</li>
<li>Tìm bán kính và miền hội tụ của chuỗi luỹ thừa; lập chuỗi Taylor, Maclaurin và chặn sai số của đa thức Taylor.</li>
<li>Tính toán với vectơ trong không gian (tích vô hướng, tích có hướng, hình chiếu) và viết phương trình đường thẳng, mặt phẳng.</li>
<li>Tính đạo hàm riêng, mặt phẳng tiếp xúc, quy tắc dây chuyền nhiều biến, gradient, đạo hàm theo hướng; tìm và phân loại cực trị, kể cả bằng nhân tử Lagrange.</li>
<li>Tính tích phân kép, bội ba trong toạ độ Descartes, cực, trụ, cầu; dùng Jacobian; tính tích phân đường bằng định lý cơ bản cho tích phân đường và định lý Green.</li>
</ol>
<h3>Môn liên quan trong khung FPTU</h3>
<p>CAL121 nằm ở <strong>kỳ 2</strong>, cần học trước <strong>CAL111 — Giải tích I</strong> (giới hạn, đạo hàm, tích phân). Tích phân bội và chuỗi của môn này được dùng lại trong <strong>MAS291 — Xác suất thống kê</strong>; gradient, xấp xỉ Taylor và tối ưu là lõi toán của các môn AI / học máy về sau.</p>
<h3>Bản đồ môn học</h3>
<ul>
<li>Ch. 1 Cầu nối từ Giải tích I · Ch. 2 Phương trình vi phân · Ch. 3 Tham số &amp; toạ độ cực</li>
<li>Ch. 4–5 Dãy và chuỗi, các tiêu chuẩn hội tụ · Ch. 6 Chuỗi luỹ thừa và chuỗi Taylor</li>
<li>Ch. 7 Vectơ và hình học không gian · Ch. 8 Đạo hàm riêng · Ch. 9 Tối ưu</li>
<li>Ch. 10 Tích phân kép · Ch. 11 Tích phân bội ba và đổi biến · Ch. 12 Mở đầu giải tích vectơ</li>
</ul>
<h3>Học môn này thế nào cho hiệu quả</h3>
<ul>
<li>Mỗi bài: mục tiêu, bài giảng, ví dụ từng bước, lỗi hay gặp, 📌 tóm tắt, 🔗 học thêm, 🧪 tự luyện có đáp án. Cuối mỗi chương có quiz.</li>
<li>Làm mọi bài tự luyện <strong>ra giấy trước</strong>, rồi mới mở đáp án.</li>
<li>Dùng GeoGebra 3D để <em>nhìn thấy</em> mặt cong và miền trước khi tính tích phân — một nửa giải tích nhiều biến là vẽ đúng miền.</li>
</ul>`);

const m02 = L('cal121-ts-0-2',
  '0.2 — Textbooks & learning resources (verified)|||0.2 — Giáo trình & tài liệu học (đã kiểm)',
  'Giáo trình chuẩn kèm ISBN đã kiểm (Stewart 9e, OpenStax Calculus Vol 2 & Vol 3, Thomas 15e), khoá mở MIT OCW 18.01SC/18.02SC/18.03SC, Paul’s Online Notes, 3Blue1Brown, Coursera, công cụ GeoGebra 3D/Desmos/WolframAlpha/SymPy.',
  `<span class="eyebrow">CAL121 · Section 0 · Lesson 0.2</span>
<h2>Textbooks &amp; learning resources</h2>
<p class="lead">This course follows the chapter order of the standard textbooks below. You do <strong>not</strong> need to buy anything: the OpenStax books are free and legal online, and every lesson links to the matching section.</p>
<h3>📘 Main textbooks</h3>
<ol>
<li><strong>James Stewart, Daniel K. Clegg, Saleem Watson — <em>Calculus: Early Transcendentals</em>, 9th edition.</strong> Cengage Learning, 2020 (© 2021). ISBN 978-1-337-61392-7. ` + A('https://www.cengage.com/c/calculus-early-transcendentals-9e-stewart-clegg-watson/9781337613927/', 'Publisher page') + `. Calculus II in this course = Stewart chapters 7 (trig substitution), 8 (surface area, centres of mass), 9 (differential equations), 10 (parametric &amp; polar), 11 (sequences &amp; series), 12 (vectors), 14 (partial derivatives), 15 (multiple integrals) and 16.1–16.4 (vector calculus).</li>
<li><strong>Gilbert Strang, Edwin “Jed” Herman — <em>Calculus Volume 2</em>.</strong> OpenStax (Rice University), Houston, 2016. Print ISBN 978-1-938168-06-2; digital ISBN 978-1-947172-14-2. License CC BY-NC-SA. ` + A(OS2 + '1-introduction', 'Read free online') + `. We use chapters 2–7: applications, integration techniques, differential equations, sequences &amp; series, power series, parametric equations &amp; polar coordinates.</li>
<li><strong>Gilbert Strang, Edwin “Jed” Herman — <em>Calculus Volume 3</em>.</strong> OpenStax, 2016. Print ISBN 978-1-938168-07-9; digital ISBN 978-1-947172-16-6. ` + A(OS3 + '1-introduction', 'Read free online') + `. We use chapters 2 (vectors in space), 4 (differentiation of functions of several variables), 5 (multiple integration) and 6.1–6.4 (vector fields, line integrals, Green's theorem).</li>
<li><strong>Joel Hass, Christopher Heil, Maurice Weir, Przemyslaw Bogacki — <em>Thomas' Calculus: Early Transcendentals</em>, 15th edition.</strong> Pearson, 2022 (© 2023). ISBN 978-0-13-755982-4 (eTextbook). ` + A('https://www.pearson.com/en-us/pearsonplus/p/9780137559824', 'Publisher page') + `. A second explanation with many engineering applications.</li>
</ol>
<h3>🎓 Open courses &amp; notes</h3>
<ul>
<li>` + A('https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/', 'MIT OpenCourseWare 18.02SC — Multivariable Calculus') + `: lecture videos, recitations, problem sets and exams with solutions (Chapters 7–12 of this course).</li>
<li>` + A('https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-5-exploring-the-infinite/', 'MIT OCW 18.01SC — Unit 5: Exploring the Infinite') + ` (series, Taylor; Chapters 4–6).</li>
<li>` + A('https://ocw.mit.edu/courses/18-03sc-differential-equations-fall-2011/pages/unit-i-first-order-differential-equations/', 'MIT OCW 18.03SC — Unit I: First-Order Differential Equations') + ` (Chapter 2).</li>
<li>` + A(PN2 + 'CalcII.aspx', "Paul's Online Math Notes — Calculus II") + ` and ` + A(PN3 + 'CalcIII.aspx', 'Calculus III') + ` (Lamar University): clear notes and many solved problems.</li>
<li>` + A('https://www.3blue1brown.com/topics/calculus', '3Blue1Brown — Calculus') + ` (visual intuition for Taylor series, differential equations, gradients).</li>
<li>` + A('https://www.coursera.org/learn/multivariate-calculus-machine-learning', 'Coursera — Mathematics for Machine Learning: Multivariate Calculus (Imperial College London)') + ` and ` + A('https://www.coursera.org/learn/vector-calculus-engineers', 'Vector Calculus for Engineers (HKUST)') + `.</li>
</ul>
<h3>🛠️ Tools for checking your work</h3>
<ul>
<li>` + A('https://www.geogebra.org/3d', 'GeoGebra 3D Calculator') + ` — surfaces, planes, regions of integration.</li>
<li>` + A('https://www.desmos.com/calculator', 'Desmos') + ` — parametric and polar curves, partial sums of series.</li>
<li>` + A('https://www.wolframalpha.com/', 'WolframAlpha') + ` and ` + A('https://docs.sympy.org/latest/tutorials/intro-tutorial/calculus.html', 'SymPy (Python) — calculus tutorial') + ` — check limits, series, partial derivatives and integrals. Every numerical answer in this course was checked with SymPy.</li>
</ul>
<div class="meo"><p><strong>Study plan.</strong> For each lesson: read the lesson here → read the linked OpenStax section → do 5–10 problems from Paul's Notes or the OpenStax exercises → do the 🧪 practice → take the chapter quiz. About 6–8 hours per chapter; the multivariable chapters (8–12) need the most drawing.</p></div>`,
  `<span class="eyebrow">CAL121 · Mục 0 · Bài 0.2</span>
<h2>Giáo trình &amp; tài liệu học</h2>
<p class="lead">Khoá này bám thứ tự chương của các giáo trình chuẩn dưới đây. Bạn <strong>không</strong> cần mua sách: sách OpenStax miễn phí, hợp pháp trên mạng, và mỗi bài đều dẫn tới đúng mục tương ứng.</p>
<h3>📘 Giáo trình chính</h3>
<ol>
<li><strong>James Stewart, Daniel K. Clegg, Saleem Watson — <em>Calculus: Early Transcendentals</em>, tái bản lần 9.</strong> Cengage Learning, 2020 (© 2021). ISBN 978-1-337-61392-7. ` + A('https://www.cengage.com/c/calculus-early-transcendentals-9e-stewart-clegg-watson/9781337613927/', 'Trang nhà xuất bản') + `. Giải tích II trong khoá này = Stewart chương 7 (thế lượng giác), 8 (diện tích mặt, trọng tâm), 9 (phương trình vi phân), 10 (tham số &amp; cực), 11 (dãy &amp; chuỗi), 12 (vectơ), 14 (đạo hàm riêng), 15 (tích phân bội) và 16.1–16.4 (giải tích vectơ).</li>
<li><strong>Gilbert Strang, Edwin “Jed” Herman — <em>Calculus Volume 2</em>.</strong> OpenStax (Đại học Rice), Houston, 2016. ISBN bản in 978-1-938168-06-2; ISBN bản số 978-1-947172-14-2. Giấy phép CC BY-NC-SA. ` + A(OS2 + '1-introduction', 'Đọc miễn phí') + `. Khoá dùng chương 2–7: ứng dụng, kỹ thuật tích phân, phương trình vi phân, dãy &amp; chuỗi, chuỗi luỹ thừa, phương trình tham số &amp; toạ độ cực.</li>
<li><strong>Gilbert Strang, Edwin “Jed” Herman — <em>Calculus Volume 3</em>.</strong> OpenStax, 2016. ISBN bản in 978-1-938168-07-9; ISBN bản số 978-1-947172-16-6. ` + A(OS3 + '1-introduction', 'Đọc miễn phí') + `. Khoá dùng chương 2 (vectơ trong không gian), 4 (đạo hàm hàm nhiều biến), 5 (tích phân bội) và 6.1–6.4 (trường vectơ, tích phân đường, định lý Green).</li>
<li><strong>Joel Hass, Christopher Heil, Maurice Weir, Przemyslaw Bogacki — <em>Thomas' Calculus: Early Transcendentals</em>, tái bản lần 15.</strong> Pearson, 2022 (© 2023). ISBN 978-0-13-755982-4 (bản eTextbook). ` + A('https://www.pearson.com/en-us/pearsonplus/p/9780137559824', 'Trang nhà xuất bản') + `. Cách giải thích thứ hai, nhiều ứng dụng kỹ thuật.</li>
</ol>
<h3>🎓 Khoá học mở &amp; ghi chú</h3>
<ul>
<li>` + A('https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/', 'MIT OpenCourseWare 18.02SC — Giải tích nhiều biến') + `: video bài giảng, bài tập, đề thi có lời giải (Chương 7–12 của khoá).</li>
<li>` + A('https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-5-exploring-the-infinite/', 'MIT OCW 18.01SC — Unit 5: Exploring the Infinite') + ` (chuỗi, Taylor; Chương 4–6).</li>
<li>` + A('https://ocw.mit.edu/courses/18-03sc-differential-equations-fall-2011/pages/unit-i-first-order-differential-equations/', 'MIT OCW 18.03SC — Unit I: Phương trình vi phân cấp một') + ` (Chương 2).</li>
<li>` + A(PN2 + 'CalcII.aspx', "Paul's Online Math Notes — Calculus II") + ` và ` + A(PN3 + 'CalcIII.aspx', 'Calculus III') + ` (Đại học Lamar): ghi chú rõ ràng, rất nhiều bài có lời giải.</li>
<li>` + A('https://www.3blue1brown.com/topics/calculus', '3Blue1Brown — Calculus') + ` (trực quan về chuỗi Taylor, phương trình vi phân, gradient).</li>
<li>` + A('https://www.coursera.org/learn/multivariate-calculus-machine-learning', 'Coursera — Mathematics for Machine Learning: Multivariate Calculus (Imperial College London)') + ` và ` + A('https://www.coursera.org/learn/vector-calculus-engineers', 'Vector Calculus for Engineers (HKUST)') + `.</li>
</ul>
<h3>🛠️ Công cụ tự kiểm bài</h3>
<ul>
<li>` + A('https://www.geogebra.org/3d', 'GeoGebra 3D') + ` — mặt cong, mặt phẳng, miền lấy tích phân.</li>
<li>` + A('https://www.desmos.com/calculator', 'Desmos') + ` — đường tham số, đường cực, tổng riêng của chuỗi.</li>
<li>` + A('https://www.wolframalpha.com/', 'WolframAlpha') + ` và ` + A('https://docs.sympy.org/latest/tutorials/intro-tutorial/calculus.html', 'SymPy (Python) — hướng dẫn giải tích') + ` — kiểm giới hạn, chuỗi, đạo hàm riêng, tích phân. Mọi đáp số trong khoá đã được kiểm bằng SymPy.</li>
</ul>
<div class="meo"><p><strong>Kế hoạch học.</strong> Mỗi bài: đọc bài ở đây → đọc mục OpenStax được dẫn → làm 5–10 bài trong Paul's Notes hoặc bài tập OpenStax → làm 🧪 tự luyện → làm quiz chương. Khoảng 6–8 giờ mỗi chương; các chương nhiều biến (8–12) cần vẽ hình nhiều nhất.</p></div>`);

const muc0 = {
  title: 'Section 0 — Course framework (self-authored, no FLM syllabus)|||Mục 0 — Khung môn học (tự soạn, trường chưa công bố syllabus)',
  description: 'Giới thiệu môn, chuẩn đầu ra tự soạn, giáo trình chuẩn kèm ISBN và tài liệu mở. Trường chưa công bố syllabus CAL121 trên FLM — điểm/lịch thi theo giảng viên.',
  lessons: [m01, m02],
};

// ───────────────────────────── Chương 1 — Cầu nối từ Giải tích I ─────────────────────────────
const c11 = L('cal121-ts-1-1',
  '1.1 — Rapid review: the CAL111 integration toolkit|||1.1 — Ôn nhanh: bộ công cụ tích phân của CAL111',
  'Ôn nhanh 4 kỹ thuật tích phân đã học ở CAL111 (đổi biến, từng phần, lượng giác, phân thức) bằng bảng nhận dạng và 4 ví dụ; không dạy lại từ đầu.',
  `<span class="eyebrow">CAL121 · Chapter 1 · Lesson 1.1</span>
<h2>Rapid review: the CAL111 integration toolkit</h2>
<p class="lead">You already learned these techniques in CAL111 (Chapter 8 there). This lesson is a <strong>30-minute checklist</strong>, not a re-teaching: if any example below feels unfamiliar, go back to the CAL111 lesson before continuing, because every later chapter integrates something.</p>
<h3>🎯 Objectives</h3>
<ul><li>Recognise which technique an integral needs within a few seconds.</li><li>Execute substitution, integration by parts, trigonometric integrals and partial fractions without notes.</li><li>Check any antiderivative by differentiating it.</li></ul>
<h3>📖 The recognition table</h3>
<div class="formula"><span class="lbl">Substitution</span>∫ f(g(x)) g′(x) dx = ∫ f(u) du, with u = g(x) — look for “a function and its derivative”.</div>
<div class="formula"><span class="lbl">Integration by parts</span>∫ u dv = uv − ∫ v du — products such as x e<sup>x</sup>, x sin x, x<sup>n</sup> ln x; choose u by LIATE (Log, Inverse trig, Algebraic, Trig, Exponential).</div>
<div class="formula"><span class="lbl">Trigonometric integrals</span>odd power of sin or cos: save one factor, convert the rest with sin<sup>2</sup> + cos<sup>2</sup> = 1; even powers: use sin<sup>2</sup>x = (1 − cos 2x)/2, cos<sup>2</sup>x = (1 + cos 2x)/2.</div>
<div class="formula"><span class="lbl">Partial fractions</span>proper rational function P/Q: factor Q, write A/(x − a) + B/(x − b) + …; improper: divide first.</div>
<h3>✍️ Four-minute drill (all checked with SymPy)</h3>
<div class="callout"><p><b>1.</b> ∫ 2x/(x<sup>2</sup> + 1) dx: numerator is the derivative of the denominator, u = x<sup>2</sup> + 1 ⇒ <b>ln(x<sup>2</sup> + 1) + C</b>.</p>
<p><b>2.</b> ∫ x e<sup>2x</sup> dx: parts with u = x, dv = e<sup>2x</sup> dx, v = e<sup>2x</sup>/2 ⇒ x e<sup>2x</sup>/2 − ∫ e<sup>2x</sup>/2 dx = <b>e<sup>2x</sup>(2x − 1)/4 + C</b>.</p>
<p><b>3.</b> ∫ sin<sup>3</sup>x dx: odd power, save sin x: ∫ (1 − cos<sup>2</sup>x) sin x dx, u = cos x ⇒ <b>−cos x + cos<sup>3</sup>x/3 + C</b>.</p>
<p><b>4.</b> ∫ dx/(x<sup>2</sup> − 1): 1/((x − 1)(x + 1)) = (1/2)/(x − 1) − (1/2)/(x + 1) ⇒ <b>(1/2) ln|(x − 1)/(x + 1)| + C</b>.</p></div>
<h3>What CAL111 did <em>not</em> cover — and this chapter adds</h3>
<ul><li><strong>Trigonometric substitution</strong> (Lesson 1.2) for √(a<sup>2</sup> − x<sup>2</sup>), √(a<sup>2</sup> + x<sup>2</sup>), √(x<sup>2</sup> − a<sup>2</sup>).</li><li><strong>Surface area of revolution</strong> and <strong>centres of mass</strong> (Lesson 1.3), which reuse the arc-length idea from CAL111.</li></ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting to change the limits when substituting in a definite integral (or forgetting to substitute back).</li><li>Applying partial fractions to an improper fraction such as x<sup>3</sup>/(x<sup>2</sup> − 1) without dividing first.</li><li>Dropping the absolute value in ln|x − 1|.</li><li>Never checking: differentiating your answer takes 20 seconds and catches most sign errors.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Simplify → substitution → classify (parts / trig / partial fractions) → check by differentiating.</li><li>LIATE chooses u in integration by parts.</li><li>Odd trig power: save one factor; even power: half-angle formulas.</li><li>New in CAL121: trig substitution, surface area, centre of mass.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(PN2 + 'IntegrationStrategy.aspx', "Paul's Online Notes — Integration Strategy") + `</li><li>` + A(OS2 + '3-1-integration-by-parts', 'OpenStax Calculus Vol. 2 — 3.1 Integration by Parts') + `</li><li>` + A(OS2 + '3-4-partial-fractions', 'OpenStax Calculus Vol. 2 — 3.4 Partial Fractions') + `</li><li>` + A('https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-4-techniques-of-integration/', 'MIT OCW 18.01SC — Unit 4: Techniques of Integration') + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>∫ x cos x dx.</li><li>∫ (3x + 1)/((x − 1)(x + 2)) dx.</li><li>∫<sub>0</sub><sup>π/2</sup> sin<sup>2</sup>x dx.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Parts, u = x: <b>x sin x + cos x + C</b>. 2) 3x + 1 = A(x + 2) + B(x − 1); x = 1 gives A = 4/3, x = −2 gives B = 5/3 ⇒ <b>(4/3) ln|x − 1| + (5/3) ln|x + 2| + C</b>. 3) ∫ (1 − cos 2x)/2 dx = [x/2 − sin 2x/4] from 0 to π/2 = <b>π/4</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 1 · Bài 1.1</span>
<h2>Ôn nhanh: bộ công cụ tích phân của CAL111</h2>
<p class="lead">Các kỹ thuật này bạn đã học ở CAL111 (Chương 8 bên đó). Bài này là <strong>bảng kiểm 30 phút</strong>, không phải dạy lại: nếu ví dụ nào dưới đây thấy lạ, hãy quay về bài CAL111 tương ứng trước khi học tiếp, vì chương nào sau này cũng phải tính tích phân.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận ra tích phân cần kỹ thuật nào trong vài giây.</li><li>Thực hiện đổi biến, từng phần, tích phân lượng giác, phân thức hữu tỉ không cần xem lại.</li><li>Kiểm mọi nguyên hàm bằng cách đạo hàm lại.</li></ul>
<h3>📖 Bảng nhận dạng</h3>
<div class="formula"><span class="lbl">Đổi biến</span>∫ f(g(x)) g′(x) dx = ∫ f(u) du, với u = g(x) — tìm “một hàm và đạo hàm của nó”.</div>
<div class="formula"><span class="lbl">Từng phần</span>∫ u dv = uv − ∫ v du — tích kiểu x e<sup>x</sup>, x sin x, x<sup>n</sup> ln x; chọn u theo LIATE (Log, lượng giác ngược, đại số, lượng giác, mũ).</div>
<div class="formula"><span class="lbl">Tích phân lượng giác</span>luỹ thừa lẻ của sin hoặc cos: giữ lại một thừa số, đổi phần còn lại bằng sin<sup>2</sup> + cos<sup>2</sup> = 1; luỹ thừa chẵn: dùng sin<sup>2</sup>x = (1 − cos 2x)/2, cos<sup>2</sup>x = (1 + cos 2x)/2.</div>
<div class="formula"><span class="lbl">Phân thức hữu tỉ</span>P/Q thực sự: phân tích Q, viết A/(x − a) + B/(x − b) + …; không thực sự: chia đa thức trước.</div>
<h3>✍️ Luyện nhanh bốn phút (đã kiểm bằng SymPy)</h3>
<div class="callout"><p><b>1.</b> ∫ 2x/(x<sup>2</sup> + 1) dx: tử là đạo hàm của mẫu, u = x<sup>2</sup> + 1 ⇒ <b>ln(x<sup>2</sup> + 1) + C</b>.</p>
<p><b>2.</b> ∫ x e<sup>2x</sup> dx: từng phần với u = x, dv = e<sup>2x</sup> dx, v = e<sup>2x</sup>/2 ⇒ x e<sup>2x</sup>/2 − ∫ e<sup>2x</sup>/2 dx = <b>e<sup>2x</sup>(2x − 1)/4 + C</b>.</p>
<p><b>3.</b> ∫ sin<sup>3</sup>x dx: luỹ thừa lẻ, giữ sin x: ∫ (1 − cos<sup>2</sup>x) sin x dx, u = cos x ⇒ <b>−cos x + cos<sup>3</sup>x/3 + C</b>.</p>
<p><b>4.</b> ∫ dx/(x<sup>2</sup> − 1): 1/((x − 1)(x + 1)) = (1/2)/(x − 1) − (1/2)/(x + 1) ⇒ <b>(1/2) ln|(x − 1)/(x + 1)| + C</b>.</p></div>
<h3>Phần CAL111 <em>chưa</em> học — chương này bổ sung</h3>
<ul><li><strong>Phép thế lượng giác</strong> (Bài 1.2) cho √(a<sup>2</sup> − x<sup>2</sup>), √(a<sup>2</sup> + x<sup>2</sup>), √(x<sup>2</sup> − a<sup>2</sup>).</li><li><strong>Diện tích mặt tròn xoay</strong> và <strong>trọng tâm</strong> (Bài 1.3), dùng lại ý tưởng độ dài cung ở CAL111.</li></ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên đổi cận khi đổi biến trong tích phân xác định (hoặc quên thế ngược lại).</li><li>Phân tích phân thức cho phân thức không thực sự như x<sup>3</sup>/(x<sup>2</sup> − 1) mà không chia trước.</li><li>Bỏ dấu giá trị tuyệt đối trong ln|x − 1|.</li><li>Không bao giờ thử lại: đạo hàm đáp số mất 20 giây và bắt được hầu hết lỗi dấu.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Rút gọn → đổi biến → phân loại (từng phần / lượng giác / phân thức) → thử lại bằng đạo hàm.</li><li>LIATE để chọn u khi tích phân từng phần.</li><li>Luỹ thừa lượng giác lẻ: giữ một thừa số; chẵn: công thức hạ bậc.</li><li>Mới ở CAL121: thế lượng giác, diện tích mặt, trọng tâm.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(PN2 + 'IntegrationStrategy.aspx', "Paul's Online Notes — Chiến lược tích phân") + `</li><li>` + A(OS2 + '3-1-integration-by-parts', 'OpenStax Calculus Vol. 2 — 3.1 Tích phân từng phần') + `</li><li>` + A(OS2 + '3-4-partial-fractions', 'OpenStax Calculus Vol. 2 — 3.4 Phân thức hữu tỉ') + `</li><li>` + A('https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-4-techniques-of-integration/', 'MIT OCW 18.01SC — Unit 4: Kỹ thuật tích phân') + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>∫ x cos x dx.</li><li>∫ (3x + 1)/((x − 1)(x + 2)) dx.</li><li>∫<sub>0</sub><sup>π/2</sup> sin<sup>2</sup>x dx.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Từng phần, u = x: <b>x sin x + cos x + C</b>. 2) 3x + 1 = A(x + 2) + B(x − 1); x = 1 cho A = 4/3, x = −2 cho B = 5/3 ⇒ <b>(4/3) ln|x − 1| + (5/3) ln|x + 2| + C</b>. 3) ∫ (1 − cos 2x)/2 dx = [x/2 − sin 2x/4] từ 0 đến π/2 = <b>π/4</b>.</p></div>`);

const c12 = L('cal121-ts-1-2',
  '1.2 — Trigonometric substitution|||1.2 — Phép thế lượng giác',
  'Ba dạng căn √(a²−x²), √(a²+x²), √(x²−a²) và phép thế x = a sinθ, a tanθ, a secθ; vẽ tam giác vuông để thế ngược; 4 ví dụ giải từng bước.',
  `<span class="eyebrow">CAL121 · Chapter 1 · Lesson 1.2</span>
<h2>Trigonometric substitution</h2>
<p class="lead">How do you integrate √(9 − x<sup>2</sup>)? No ordinary substitution works, because there is no “x dx” to pair with. The trick is to <strong>let x be a trigonometric function</strong>, so that a Pythagorean identity removes the square root.</p>
<h3>🎯 Objectives</h3>
<ul><li>Choose the right substitution for each of the three radical forms.</li><li>Convert the integral to θ, integrate, and convert back with a reference triangle.</li><li>Handle definite integrals by changing the limits.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">The three cases (a &gt; 0)</span>√(a<sup>2</sup> − x<sup>2</sup>): x = a sin θ, −π/2 ≤ θ ≤ π/2, since a<sup>2</sup> − a<sup>2</sup>sin<sup>2</sup>θ = a<sup>2</sup>cos<sup>2</sup>θ<br>√(a<sup>2</sup> + x<sup>2</sup>): x = a tan θ, −π/2 &lt; θ &lt; π/2, since a<sup>2</sup> + a<sup>2</sup>tan<sup>2</sup>θ = a<sup>2</sup>sec<sup>2</sup>θ<br>√(x<sup>2</sup> − a<sup>2</sup>): x = a sec θ, 0 ≤ θ &lt; π/2 (x ≥ a), since a<sup>2</sup>sec<sup>2</sup>θ − a<sup>2</sup> = a<sup>2</sup>tan<sup>2</sup>θ</div>
<p>The restricted θ-intervals make the substitution invertible and the cosine, secant or tangent positive, so √(a<sup>2</sup>cos<sup>2</sup>θ) = a cos θ without absolute values. After integrating in θ, draw a <strong>right triangle</strong> whose sides encode the substitution (for x = a sin θ: opposite x, hypotenuse a, adjacent √(a<sup>2</sup> − x<sup>2</sup>)) and read off every trig function of θ in terms of x.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> ∫ √(9 − x<sup>2</sup>)/x<sup>2</sup> dx.</p>
<p>x = 3 sin θ, dx = 3 cos θ dθ, √(9 − x<sup>2</sup>) = 3 cos θ. The integral becomes ∫ (3 cos θ)(3 cos θ)/(9 sin<sup>2</sup>θ) dθ = ∫ cot<sup>2</sup>θ dθ = ∫ (csc<sup>2</sup>θ − 1) dθ = −cot θ − θ + C. Triangle: cot θ = √(9 − x<sup>2</sup>)/x, θ = arcsin(x/3). Answer: <b>−√(9 − x<sup>2</sup>)/x − arcsin(x/3) + C</b>.</p></div>
<div class="callout"><p><b>Example 2 — a definite integral.</b> ∫<sub>0</sub><sup>3</sup> √(9 − x<sup>2</sup>) dx.</p>
<p>x = 3 sin θ; x = 0 ⇒ θ = 0, x = 3 ⇒ θ = π/2. ∫<sub>0</sub><sup>π/2</sup> 9 cos<sup>2</sup>θ dθ = 9 · π/4 = <b>9π/4</b> — exactly a quarter of the area of a circle of radius 3, as the picture predicts.</p></div>
<div class="callout"><p><b>Example 3.</b> ∫ dx/(x<sup>2</sup>√(x<sup>2</sup> + 4)).</p>
<p>x = 2 tan θ, dx = 2 sec<sup>2</sup>θ dθ, √(x<sup>2</sup> + 4) = 2 sec θ. Integral = ∫ 2 sec<sup>2</sup>θ/(4 tan<sup>2</sup>θ · 2 sec θ) dθ = (1/4)∫ cos θ/sin<sup>2</sup>θ dθ = −1/(4 sin θ) + C. Triangle: opposite x, adjacent 2, hypotenuse √(x<sup>2</sup> + 4), so sin θ = x/√(x<sup>2</sup> + 4). Answer: <b>−√(x<sup>2</sup> + 4)/(4x) + C</b>.</p></div>
<div class="callout"><p><b>Example 4.</b> ∫ dx/√(x<sup>2</sup> + 9) = ∫ sec θ dθ = ln|sec θ + tan θ| + C<sub>1</sub> = ln|√(x<sup>2</sup> + 9)/3 + x/3| + C<sub>1</sub> = <b>ln(x + √(x<sup>2</sup> + 9)) + C</b> (the constant −ln 3 is absorbed into C).</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting to replace dx: with x = a sin θ, dx = a cos θ dθ.</li><li>Leaving the answer in θ for an indefinite integral.</li><li>Using trig substitution when a simple u-substitution works: ∫ x√(9 − x<sup>2</sup>) dx needs only u = 9 − x<sup>2</sup>.</li><li>Completing the square is often the first step: x<sup>2</sup> + 4x + 13 = (x + 2)<sup>2</sup> + 9, then x + 2 = 3 tan θ.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>a<sup>2</sup> − x<sup>2</sup> → sin; a<sup>2</sup> + x<sup>2</sup> → tan; x<sup>2</sup> − a<sup>2</sup> → sec.</li><li>The Pythagorean identity removes the root.</li><li>Return to x with a reference triangle; for definite integrals change the limits instead.</li><li>Check first whether an ordinary substitution is enough.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A('https://openstax.org/books/calculus-volume-2/pages/3-3-trigonometric-substitution', 'OpenStax Calculus Vol. 2 — 3.3 Trigonometric Substitution') + `</li><li>` + A(PN2 + 'TrigSubstitutions.aspx', "Paul's Online Notes — Trig Substitutions") + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>∫<sub>0</sub><sup>1</sup> dx/(1 + x<sup>2</sup>)<sup>3/2</sup>.</li><li>∫<sub>0</sub><sup>2</sup> x<sup>3</sup>√(4 − x<sup>2</sup>) dx.</li><li>Which substitution would you use for ∫ dx/√(x<sup>2</sup> − 16)? Write the resulting θ-integral.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) x = tan θ: ∫ cos θ dθ = sin θ = x/√(1 + x<sup>2</sup>) from 0 to 1 = <b>1/√2 = √2/2 ≈ 0.7071</b>. 2) x = 2 sin θ (or u = 4 − x<sup>2</sup>): <b>64/15</b>. 3) x = 4 sec θ, dx = 4 sec θ tan θ dθ, √(x<sup>2</sup> − 16) = 4 tan θ ⇒ ∫ sec θ dθ = ln|x + √(x<sup>2</sup> − 16)| + C.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 1 · Bài 1.2</span>
<h2>Phép thế lượng giác</h2>
<p class="lead">Tính ∫ √(9 − x<sup>2</sup>) dx thế nào? Không phép đổi biến thông thường nào dùng được, vì không có “x dx” để ghép cặp. Mẹo là <strong>đặt x bằng một hàm lượng giác</strong>, để một hằng đẳng thức Pythagore khử căn.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Chọn đúng phép thế cho từng dạng căn trong ba dạng.</li><li>Chuyển tích phân sang θ, tính, rồi đổi về x bằng tam giác vuông.</li><li>Xử lý tích phân xác định bằng cách đổi cận.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Ba trường hợp (a &gt; 0)</span>√(a<sup>2</sup> − x<sup>2</sup>): x = a sin θ, −π/2 ≤ θ ≤ π/2, vì a<sup>2</sup> − a<sup>2</sup>sin<sup>2</sup>θ = a<sup>2</sup>cos<sup>2</sup>θ<br>√(a<sup>2</sup> + x<sup>2</sup>): x = a tan θ, −π/2 &lt; θ &lt; π/2, vì a<sup>2</sup> + a<sup>2</sup>tan<sup>2</sup>θ = a<sup>2</sup>sec<sup>2</sup>θ<br>√(x<sup>2</sup> − a<sup>2</sup>): x = a sec θ, 0 ≤ θ &lt; π/2 (x ≥ a), vì a<sup>2</sup>sec<sup>2</sup>θ − a<sup>2</sup> = a<sup>2</sup>tan<sup>2</sup>θ</div>
<p>Giới hạn khoảng của θ làm phép thế khả nghịch và làm cos, sec, tan dương, nên √(a<sup>2</sup>cos<sup>2</sup>θ) = a cos θ không cần trị tuyệt đối. Tính xong theo θ, vẽ <strong>tam giác vuông</strong> mã hoá phép thế (với x = a sin θ: cạnh đối x, cạnh huyền a, cạnh kề √(a<sup>2</sup> − x<sup>2</sup>)) rồi đọc mọi hàm lượng giác của θ theo x.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> ∫ √(9 − x<sup>2</sup>)/x<sup>2</sup> dx.</p>
<p>x = 3 sin θ, dx = 3 cos θ dθ, √(9 − x<sup>2</sup>) = 3 cos θ. Tích phân thành ∫ (3 cos θ)(3 cos θ)/(9 sin<sup>2</sup>θ) dθ = ∫ cot<sup>2</sup>θ dθ = ∫ (csc<sup>2</sup>θ − 1) dθ = −cot θ − θ + C. Tam giác: cot θ = √(9 − x<sup>2</sup>)/x, θ = arcsin(x/3). Đáp số: <b>−√(9 − x<sup>2</sup>)/x − arcsin(x/3) + C</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — tích phân xác định.</b> ∫<sub>0</sub><sup>3</sup> √(9 − x<sup>2</sup>) dx.</p>
<p>x = 3 sin θ; x = 0 ⇒ θ = 0, x = 3 ⇒ θ = π/2. ∫<sub>0</sub><sup>π/2</sup> 9 cos<sup>2</sup>θ dθ = 9 · π/4 = <b>9π/4</b> — đúng một phần tư diện tích hình tròn bán kính 3, khớp với hình vẽ.</p></div>
<div class="callout"><p><b>Ví dụ 3.</b> ∫ dx/(x<sup>2</sup>√(x<sup>2</sup> + 4)).</p>
<p>x = 2 tan θ, dx = 2 sec<sup>2</sup>θ dθ, √(x<sup>2</sup> + 4) = 2 sec θ. Tích phân = ∫ 2 sec<sup>2</sup>θ/(4 tan<sup>2</sup>θ · 2 sec θ) dθ = (1/4)∫ cos θ/sin<sup>2</sup>θ dθ = −1/(4 sin θ) + C. Tam giác: đối x, kề 2, huyền √(x<sup>2</sup> + 4), nên sin θ = x/√(x<sup>2</sup> + 4). Đáp số: <b>−√(x<sup>2</sup> + 4)/(4x) + C</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4.</b> ∫ dx/√(x<sup>2</sup> + 9) = ∫ sec θ dθ = ln|sec θ + tan θ| + C<sub>1</sub> = ln|√(x<sup>2</sup> + 9)/3 + x/3| + C<sub>1</sub> = <b>ln(x + √(x<sup>2</sup> + 9)) + C</b> (hằng số −ln 3 gộp vào C).</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên thay dx: với x = a sin θ thì dx = a cos θ dθ.</li><li>Để đáp số theo θ cho tích phân bất định.</li><li>Dùng thế lượng giác khi đổi biến thường là đủ: ∫ x√(9 − x<sup>2</sup>) dx chỉ cần u = 9 − x<sup>2</sup>.</li><li>Thường phải thêm bớt bình phương trước: x<sup>2</sup> + 4x + 13 = (x + 2)<sup>2</sup> + 9, rồi x + 2 = 3 tan θ.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>a<sup>2</sup> − x<sup>2</sup> → sin; a<sup>2</sup> + x<sup>2</sup> → tan; x<sup>2</sup> − a<sup>2</sup> → sec.</li><li>Hằng đẳng thức Pythagore khử căn.</li><li>Về x bằng tam giác vuông; tích phân xác định thì đổi cận.</li><li>Kiểm trước xem đổi biến thường có đủ không.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A('https://openstax.org/books/calculus-volume-2/pages/3-3-trigonometric-substitution', 'OpenStax Calculus Vol. 2 — 3.3 Phép thế lượng giác') + `</li><li>` + A(PN2 + 'TrigSubstitutions.aspx', "Paul's Online Notes — Trig Substitutions") + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>∫<sub>0</sub><sup>1</sup> dx/(1 + x<sup>2</sup>)<sup>3/2</sup>.</li><li>∫<sub>0</sub><sup>2</sup> x<sup>3</sup>√(4 − x<sup>2</sup>) dx.</li><li>Dùng phép thế nào cho ∫ dx/√(x<sup>2</sup> − 16)? Viết tích phân theo θ.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) x = tan θ: ∫ cos θ dθ = sin θ = x/√(1 + x<sup>2</sup>) từ 0 đến 1 = <b>1/√2 = √2/2 ≈ 0,7071</b>. 2) x = 2 sin θ (hoặc u = 4 − x<sup>2</sup>): <b>64/15</b>. 3) x = 4 sec θ, dx = 4 sec θ tan θ dθ, √(x<sup>2</sup> − 16) = 4 tan θ ⇒ ∫ sec θ dθ = ln|x + √(x<sup>2</sup> − 16)| + C.</p></div>`);

const c13 = L('cal121-ts-1-3',
  '1.3 — Surface area of revolution and centres of mass|||1.3 — Diện tích mặt tròn xoay và trọng tâm',
  'Công thức diện tích mặt tròn xoay S = ∫2πf(x)√(1+f′²)dx, mômen và trọng tâm của miền phẳng, định lý Pappus; ví dụ mặt cầu, y = x³, miền giữa y = x và y = x².',
  `<span class="eyebrow">CAL121 · Chapter 1 · Lesson 1.3</span>
<h2>Surface area of revolution and centres of mass</h2>
<p class="lead">In CAL111 you computed the <em>volume</em> of a solid of revolution and the <em>length</em> of a curve. Two natural questions remain: how much <strong>paint</strong> covers that solid (surface area), and where is the <strong>balance point</strong> of a flat plate (centre of mass)?</p>
<h3>🎯 Objectives</h3>
<ul><li>Derive and use the surface-area formula for a curve rotated about the x-axis.</li><li>Compute moments and the centroid (x̄, ȳ) of a plane region.</li><li>Use Pappus's theorem to connect centroids and volumes.</li></ul>
<h3>📖 Surface area</h3>
<p>Rotate a small piece of the curve y = f(x) ≥ 0 of length ds about the x-axis. It sweeps a thin band (a frustum of a cone) of area ≈ 2π · radius · slant length = 2π f(x) ds, and from CAL111 ds = √(1 + [f′(x)]<sup>2</sup>) dx.</p>
<div class="formula"><span class="lbl">Surface area (about the x-axis)</span>S = ∫<sub>a</sub><sup>b</sup> 2π f(x) √(1 + [f′(x)]<sup>2</sup>) dx<br>about the y-axis: S = ∫<sub>a</sub><sup>b</sup> 2π x √(1 + [f′(x)]<sup>2</sup>) dx</div>
<div class="callout"><p><b>Example 1 — the sphere.</b> f(x) = √(r<sup>2</sup> − x<sup>2</sup>) on [−r, r]. Then f′ = −x/√(r<sup>2</sup> − x<sup>2</sup>) and f√(1 + f′<sup>2</sup>) = √(r<sup>2</sup> − x<sup>2</sup>) · r/√(r<sup>2</sup> − x<sup>2</sup>) = r. So S = ∫<sub>−r</sub><sup>r</sup> 2πr dx = <b>4πr<sup>2</sup></b>.</p></div>
<div class="callout"><p><b>Example 2.</b> y = x<sup>3</sup>, 0 ≤ x ≤ 1, about the x-axis: S = ∫<sub>0</sub><sup>1</sup> 2π x<sup>3</sup>√(1 + 9x<sup>4</sup>) dx. With u = 1 + 9x<sup>4</sup>, du = 36x<sup>3</sup> dx: S = (2π/36)∫<sub>1</sub><sup>10</sup> √u du = (π/27)(10√10 − 1) ≈ <b>3.5631</b>.</p></div>
<h3>📖 Moments and centre of mass</h3>
<p>A thin plate of constant density occupying the region between y = f(x) (top) and y = g(x) (bottom), a ≤ x ≤ b, has area A = ∫ (f − g) dx. Its centroid is</p>
<div class="formula"><span class="lbl">Centroid of a plane region</span>x̄ = (1/A) ∫<sub>a</sub><sup>b</sup> x [f(x) − g(x)] dx      ȳ = (1/A) ∫<sub>a</sub><sup>b</sup> ½ ([f(x)]<sup>2</sup> − [g(x)]<sup>2</sup>) dx</div>
<p>Each vertical strip has its own centre at height (f + g)/2; ȳ averages those heights weighted by strip area, which simplifies to the ½(f<sup>2</sup> − g<sup>2</sup>) form.</p>
<div class="callout"><p><b>Example 3.</b> Region between y = x and y = x<sup>2</sup> on [0, 1]. A = ∫ (x − x<sup>2</sup>) dx = 1/6. x̄ = 6∫ x(x − x<sup>2</sup>) dx = 6 · 1/12 = 1/2. ȳ = 6∫ ½(x<sup>2</sup> − x<sup>4</sup>) dx = 6 · ½ · (1/3 − 1/5) = 2/5. Centroid <b>(1/2, 2/5)</b>.</p></div>
<div class="formula"><span class="lbl">Pappus's theorem</span>Rotating a region of area A about an axis that does not cut it gives volume V = 2π d A, where d is the distance from the centroid to the axis.</div>
<p>Check: rotating Example 3 about the x-axis gives V = 2π · (2/5) · (1/6) = 2π/15, the same as the washer method π∫(x<sup>2</sup> − x<sup>4</sup>) dx = 2π/15.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using dx instead of ds: 2π f(x) dx gives the wrong (cylinder) approximation.</li><li>Writing ȳ = (1/A)∫ y dA with y = f(x) — you need the strip's midpoint, hence ½(f<sup>2</sup> − g<sup>2</sup>).</li><li>Forgetting to divide the moment by the area (or mass).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>S = ∫ 2π (radius) ds, ds = √(1 + f′<sup>2</sup>) dx.</li><li>Sphere: 4πr<sup>2</sup>; a quick sanity check for any formula.</li><li>x̄ = M<sub>y</sub>/A, ȳ = M<sub>x</sub>/A.</li><li>Pappus: V = 2π d A.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS2 + '2-4-arc-length-of-a-curve-and-surface-area', 'OpenStax Vol. 2 — 2.4 Arc Length of a Curve and Surface Area') + `</li><li>` + A(OS2 + '2-6-moments-and-centers-of-mass', 'OpenStax Vol. 2 — 2.6 Moments and Centers of Mass') + `</li><li>` + A(PN2 + 'SurfaceArea.aspx', "Paul's Online Notes — Surface Area") + `</li><li>` + A(PN2 + 'CenterOfMass.aspx', "Paul's Online Notes — Center of Mass") + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>Rotate y = 2x, 0 ≤ x ≤ 1, about the x-axis. Find the surface area and check it with the cone formula πrℓ.</li><li>Find the centroid of the region under y = x<sup>2</sup> on [0, 1].</li><li>Use Pappus with your answer to 2 to find the volume when that region is rotated about the x-axis.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) S = ∫<sub>0</sub><sup>1</sup> 2π(2x)√5 dx = <b>2√5 π ≈ 14.05</b>; cone r = 2, ℓ = √5: π · 2 · √5 ✓. 2) A = 1/3, x̄ = 3∫ x<sup>3</sup> dx = 3/4, ȳ = 3∫ x<sup>4</sup>/2 dx = 3/10 ⇒ <b>(3/4, 3/10)</b>. 3) V = 2π · (3/10) · (1/3) = <b>π/5</b>, equal to the disk method π∫ x<sup>4</sup> dx.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 1 · Bài 1.3</span>
<h2>Diện tích mặt tròn xoay và trọng tâm</h2>
<p class="lead">Ở CAL111 bạn đã tính <em>thể tích</em> vật thể tròn xoay và <em>độ dài</em> đường cong. Còn hai câu hỏi tự nhiên: cần bao nhiêu <strong>sơn</strong> để phủ vật thể đó (diện tích mặt), và <strong>điểm cân bằng</strong> của một tấm phẳng nằm ở đâu (trọng tâm)?</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dựng và dùng công thức diện tích mặt khi quay đường cong quanh trục Ox.</li><li>Tính mômen và trọng tâm (x̄, ȳ) của miền phẳng.</li><li>Dùng định lý Pappus nối trọng tâm với thể tích.</li></ul>
<h3>📖 Diện tích mặt</h3>
<p>Quay một mẩu nhỏ của đường y = f(x) ≥ 0, dài ds, quanh trục Ox. Nó quét một dải mỏng (mặt nón cụt) diện tích ≈ 2π · bán kính · độ dài đường sinh = 2π f(x) ds, và từ CAL111 ds = √(1 + [f′(x)]<sup>2</sup>) dx.</p>
<div class="formula"><span class="lbl">Diện tích mặt (quay quanh Ox)</span>S = ∫<sub>a</sub><sup>b</sup> 2π f(x) √(1 + [f′(x)]<sup>2</sup>) dx<br>quay quanh Oy: S = ∫<sub>a</sub><sup>b</sup> 2π x √(1 + [f′(x)]<sup>2</sup>) dx</div>
<div class="callout"><p><b>Ví dụ 1 — mặt cầu.</b> f(x) = √(r<sup>2</sup> − x<sup>2</sup>) trên [−r, r]. Khi đó f′ = −x/√(r<sup>2</sup> − x<sup>2</sup>) và f√(1 + f′<sup>2</sup>) = √(r<sup>2</sup> − x<sup>2</sup>) · r/√(r<sup>2</sup> − x<sup>2</sup>) = r. Vậy S = ∫<sub>−r</sub><sup>r</sup> 2πr dx = <b>4πr<sup>2</sup></b>.</p></div>
<div class="callout"><p><b>Ví dụ 2.</b> y = x<sup>3</sup>, 0 ≤ x ≤ 1, quay quanh Ox: S = ∫<sub>0</sub><sup>1</sup> 2π x<sup>3</sup>√(1 + 9x<sup>4</sup>) dx. Đặt u = 1 + 9x<sup>4</sup>, du = 36x<sup>3</sup> dx: S = (2π/36)∫<sub>1</sub><sup>10</sup> √u du = (π/27)(10√10 − 1) ≈ <b>3,5631</b>.</p></div>
<h3>📖 Mômen và trọng tâm</h3>
<p>Tấm mỏng mật độ đều chiếm miền giữa y = f(x) (trên) và y = g(x) (dưới), a ≤ x ≤ b, có diện tích A = ∫ (f − g) dx. Trọng tâm là</p>
<div class="formula"><span class="lbl">Trọng tâm miền phẳng</span>x̄ = (1/A) ∫<sub>a</sub><sup>b</sup> x [f(x) − g(x)] dx      ȳ = (1/A) ∫<sub>a</sub><sup>b</sup> ½ ([f(x)]<sup>2</sup> − [g(x)]<sup>2</sup>) dx</div>
<p>Mỗi dải đứng có tâm riêng ở độ cao (f + g)/2; ȳ là trung bình các độ cao đó có trọng số theo diện tích dải, rút gọn thành dạng ½(f<sup>2</sup> − g<sup>2</sup>).</p>
<div class="callout"><p><b>Ví dụ 3.</b> Miền giữa y = x và y = x<sup>2</sup> trên [0, 1]. A = ∫ (x − x<sup>2</sup>) dx = 1/6. x̄ = 6∫ x(x − x<sup>2</sup>) dx = 6 · 1/12 = 1/2. ȳ = 6∫ ½(x<sup>2</sup> − x<sup>4</sup>) dx = 6 · ½ · (1/3 − 1/5) = 2/5. Trọng tâm <b>(1/2, 2/5)</b>.</p></div>
<div class="formula"><span class="lbl">Định lý Pappus</span>Quay miền diện tích A quanh một trục không cắt miền thì thể tích V = 2π d A, với d là khoảng cách từ trọng tâm tới trục.</div>
<p>Thử lại: quay miền ở Ví dụ 3 quanh Ox cho V = 2π · (2/5) · (1/6) = 2π/15, đúng bằng phương pháp vành khăn π∫(x<sup>2</sup> − x<sup>4</sup>) dx = 2π/15.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng dx thay cho ds: 2π f(x) dx là xấp xỉ hình trụ, sai.</li><li>Viết ȳ = (1/A)∫ y dA với y = f(x) — cần trung điểm của dải, nên mới có ½(f<sup>2</sup> − g<sup>2</sup>).</li><li>Quên chia mômen cho diện tích (hoặc khối lượng).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>S = ∫ 2π (bán kính) ds, ds = √(1 + f′<sup>2</sup>) dx.</li><li>Mặt cầu: 4πr<sup>2</sup>; phép thử nhanh cho mọi công thức.</li><li>x̄ = M<sub>y</sub>/A, ȳ = M<sub>x</sub>/A.</li><li>Pappus: V = 2π d A.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS2 + '2-4-arc-length-of-a-curve-and-surface-area', 'OpenStax Vol. 2 — 2.4 Độ dài cung và diện tích mặt') + `</li><li>` + A(OS2 + '2-6-moments-and-centers-of-mass', 'OpenStax Vol. 2 — 2.6 Mômen và trọng tâm') + `</li><li>` + A(PN2 + 'SurfaceArea.aspx', "Paul's Online Notes — Surface Area") + `</li><li>` + A(PN2 + 'CenterOfMass.aspx', "Paul's Online Notes — Center of Mass") + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Quay y = 2x, 0 ≤ x ≤ 1, quanh Ox. Tính diện tích mặt và kiểm bằng công thức mặt nón πrℓ.</li><li>Tìm trọng tâm miền dưới y = x<sup>2</sup> trên [0, 1].</li><li>Dùng Pappus với kết quả câu 2 để tính thể tích khi quay miền đó quanh Ox.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) S = ∫<sub>0</sub><sup>1</sup> 2π(2x)√5 dx = <b>2√5 π ≈ 14,05</b>; nón r = 2, ℓ = √5: π · 2 · √5 ✓. 2) A = 1/3, x̄ = 3∫ x<sup>3</sup> dx = 3/4, ȳ = 3∫ x<sup>4</sup>/2 dx = 3/10 ⇒ <b>(3/4, 3/10)</b>. 3) V = 2π · (3/10) · (1/3) = <b>π/5</b>, bằng phương pháp đĩa π∫ x<sup>4</sup> dx.</p></div>`);

const q1 = QZ(1, 'Quiz — Chapter 1: Bridge from Calculus I|||Quiz — Chương 1: Cầu nối từ Giải tích I', 'Kiểm tra chương 1: nhận dạng kỹ thuật tích phân, phép thế lượng giác, diện tích mặt tròn xoay, trọng tâm, Pappus.', [
  Q('q1', 'Best method for ∫ x e^(2x) dx:|||Cách tốt nhất cho ∫ x e^(2x) dx:',
    ['substitution u = 2x only|||chỉ đổi biến u = 2x', 'integration by parts with u = x|||từng phần với u = x', 'partial fractions|||phân thức hữu tỉ', 'trig substitution|||thế lượng giác'], 1,
    'Product of an algebraic and an exponential factor: LIATE picks u = x.|||Tích của đa thức và hàm mũ: LIATE chọn u = x.'),
  Q('q2', 'For √(16 − x²) the right substitution is|||Với √(16 − x²) phép thế đúng là',
    ['x = 4 tan θ|||x = 4 tan θ', 'x = 4 sec θ|||x = 4 sec θ', 'x = 4 sin θ|||x = 4 sin θ', 'x = 16 sin θ|||x = 16 sin θ'], 2,
    'a² − x² with a = 4: 16 − 16 sin²θ = 16 cos²θ.|||a² − x² với a = 4: 16 − 16 sin²θ = 16 cos²θ.'),
  Q('q3', 'For √(x² + 25) the right substitution is|||Với √(x² + 25) phép thế đúng là',
    ['x = 5 sin θ|||x = 5 sin θ', 'x = 5 tan θ|||x = 5 tan θ', 'x = 5 sec θ|||x = 5 sec θ', 'u = x² + 25|||u = x² + 25'], 1,
    '25 + 25 tan²θ = 25 sec²θ.|||25 + 25 tan²θ = 25 sec²θ.'),
  Q('q4', '∫₀³ √(9 − x²) dx =|||∫₀³ √(9 − x²) dx =',
    ['9π|||9π', '9π/4|||9π/4', '3π/2|||3π/2', '9/2|||9/2'], 1,
    'A quarter of a disc of radius 3: π·9/4.|||Một phần tư hình tròn bán kính 3: π·9/4.'),
  Q('q5', 'With x = 3 sin θ, the expression √(9 − x²) dx becomes|||Với x = 3 sin θ, biểu thức √(9 − x²) dx trở thành',
    ['3 cos θ dθ|||3 cos θ dθ', '9 cos²θ dθ|||9 cos²θ dθ', '9 sin θ cos θ dθ|||9 sin θ cos θ dθ', '3 sin θ dθ|||3 sin θ dθ'], 1,
    '√(9 − x²) = 3 cos θ and dx = 3 cos θ dθ.|||√(9 − x²) = 3 cos θ và dx = 3 cos θ dθ.'),
  Q('q6', 'The surface area of a sphere of radius r obtained from S = ∫2πf√(1+f′²)dx is|||Diện tích mặt cầu bán kính r tính từ S = ∫2πf√(1+f′²)dx là',
    ['πr²|||πr²', '2πr²|||2πr²', '4πr²|||4πr²', '(4/3)πr³|||(4/3)πr³'], 2,
    'f√(1+f′²) = r, so S = ∫₋ᵣʳ 2πr dx = 4πr².|||f√(1+f′²) = r, nên S = ∫₋ᵣʳ 2πr dx = 4πr².'),
  Q('q7', 'Surface area of y = 2x, 0 ≤ x ≤ 1, rotated about the x-axis:|||Diện tích mặt khi quay y = 2x, 0 ≤ x ≤ 1, quanh Ox:',
    ['2π|||2π', '2√5 π|||2√5 π', '4π|||4π', '√5 π|||√5 π'], 1,
    '∫₀¹ 2π(2x)√5 dx = 2√5 π (cone with r = 2, slant √5).|||∫₀¹ 2π(2x)√5 dx = 2√5 π (nón r = 2, đường sinh √5).'),
  Q('q8', 'Centroid of the region between y = x and y = x² on [0, 1]:|||Trọng tâm miền giữa y = x và y = x² trên [0, 1]:',
    ['(1/2, 1/2)|||(1/2, 1/2)', '(1/2, 2/5)|||(1/2, 2/5)', '(2/3, 1/3)|||(2/3, 1/3)', '(1/3, 1/6)|||(1/3, 1/6)'], 1,
    'A = 1/6, x̄ = 6·(1/12) = 1/2, ȳ = 6·½(1/3 − 1/5) = 2/5.|||A = 1/6, x̄ = 6·(1/12) = 1/2, ȳ = 6·½(1/3 − 1/5) = 2/5.'),
  Q('q9', "Pappus's theorem gives the volume of a solid of revolution as|||Định lý Pappus cho thể tích vật thể tròn xoay bằng",
    ['πd²A|||πd²A', '2πdA|||2πdA', 'dA|||dA', '2πA/d|||2πA/d'], 1,
    'Area times the distance travelled by the centroid, 2πd.|||Diện tích nhân quãng đường trọng tâm đi được, 2πd.'),
  Q('q10', '∫ dx/√(x² + 9) =|||∫ dx/√(x² + 9) =',
    ['arcsin(x/3) + C|||arcsin(x/3) + C', 'ln(x + √(x² + 9)) + C|||ln(x + √(x² + 9)) + C', '(1/3) arctan(x/3) + C|||(1/3) arctan(x/3) + C', '√(x² + 9) + C|||√(x² + 9) + C'], 1,
    'x = 3 tan θ gives ∫ sec θ dθ = ln|sec θ + tan θ|.|||x = 3 tan θ cho ∫ sec θ dθ = ln|sec θ + tan θ|.'),
]);

const ch1 = {
  title: 'Chapter 1 — Bridge from Calculus I: trig substitution, surface area, centres of mass|||Chương 1 — Cầu nối từ Giải tích I: thế lượng giác, diện tích mặt, trọng tâm',
  description: 'Ôn nhanh bộ công cụ tích phân CAL111 rồi bổ sung phần chưa học: phép thế lượng giác, diện tích mặt tròn xoay, trọng tâm và định lý Pappus (Stewart 7.3, 8.2–8.3 · OpenStax Vol.2 2.4, 2.6, 3.3).',
  lessons: [c11, c12, c13, q1],
};

// ───────────────────────────── Chương 2 — Phương trình vi phân ─────────────────────────────
const EULER_PY = `<pre><code class="language-python">import math

def euler(f, x0, y0, h, steps):
    x, y = x0, y0
    for _ in range(steps):
        y = y + h * f(x, y)
        x = x + h
    return y

f = lambda x, y: x + y              # y' = x + y, y(0) = 1
exact = 2 * math.exp(0.5) - 0.5 - 1 # y = 2e^x - x - 1
for h in (0.1, 0.05, 0.01):
    approx = euler(f, 0.0, 1.0, h, round(0.5 / h))
    print(f"h = {h:5}  y(0.5) = {approx:.6f}  error = {exact - approx:.6f}")
print(f"exact      y(0.5) = {exact:.6f}")</code></pre>
<div class="out">h =   0.1  y(0.5) = 1.721020  error = 0.076423
h =  0.05  y(0.5) = 1.757789  error = 0.039653
h =  0.01  y(0.5) = 1.789264  error = 0.008179
exact      y(0.5) = 1.797443</div>`;

const c21 = L('cal121-ts-2-1',
  '2.1 — Differential equations: models, direction fields and Euler’s method|||2.1 — Phương trình vi phân: mô hình, trường hướng và phương pháp Euler',
  'Phương trình vi phân là gì, cấp, nghiệm và bài toán giá trị đầu; đọc trường hướng; phương pháp Euler có code Python chạy thật (sai số giảm theo h).',
  `<span class="eyebrow">CAL121 · Chapter 2 · Lesson 2.1</span>
<h2>Differential equations: models, direction fields and Euler's method</h2>
<p class="lead">Physics, biology, economics and computer simulation rarely give you a formula for a quantity. They give you a <strong>rule for how it changes</strong>: “the population grows in proportion to its size”, “a cup of coffee cools in proportion to how much hotter it is than the room”. Such a rule is a <strong>differential equation</strong> (DE).</p>
<h3>🎯 Objectives</h3>
<ul><li>Define a differential equation, its order and a solution; verify a solution by substitution.</li><li>Solve an initial-value problem (IVP) by choosing the constant.</li><li>Read a direction field and sketch solution curves.</li><li>Approximate a solution with Euler's method and understand its error.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>differential equation</strong> is an equation that contains an unknown function and its derivatives, e.g. y′ = 3y, y′′ + y = 0, dP/dt = 0.5P(1 − P/1000). The <strong>order</strong> is the highest derivative that appears. A <strong>solution</strong> is a function that makes the equation true on an interval. Most first-order DEs have a one-parameter <strong>family</strong> of solutions (the general solution); an <strong>initial condition</strong> y(x<sub>0</sub>) = y<sub>0</sub> picks one of them.</p>
<div class="callout"><p><b>Example 1 — verify.</b> Show that y = Ce<sup>3x</sup> solves y′ = 3y, then solve the IVP y(0) = 5.</p>
<p>y′ = 3Ce<sup>3x</sup> = 3y ✓ for every C. y(0) = C = 5, so <b>y = 5e<sup>3x</sup></b>.</p></div>
<p><strong>Direction field.</strong> A first-order DE y′ = F(x, y) tells you the <em>slope</em> of the solution through every point. Draw a short segment with slope F(x, y) at many grid points: the picture is a direction (slope) field, and solution curves follow the segments like iron filings follow a magnetic field. For y′ = x + y the slopes are 0 along the line y = −x, positive above it and negative below.</p>
<p><strong>Euler's method.</strong> Walk along the field in small steps of size h: from (x<sub>n</sub>, y<sub>n</sub>) follow the tangent line.</p>
<div class="formula"><span class="lbl">Euler's method</span>x<sub>n+1</sub> = x<sub>n</sub> + h      y<sub>n+1</sub> = y<sub>n</sub> + h · F(x<sub>n</sub>, y<sub>n</sub>)</div>
<div class="callout"><p><b>Example 2 — by hand.</b> y′ = y, y(0) = 1, h = 0.5, two steps to x = 1: y<sub>1</sub> = 1 + 0.5 · 1 = 1.5; y<sub>2</sub> = 1.5 + 0.5 · 1.5 = <b>2.25</b>. The exact value is e ≈ 2.718: Euler under-estimates because the solution curves upward.</p></div>
<h3>💻 Euler's method in Python</h3>
<p>IVP: y′ = x + y, y(0) = 1, whose exact solution (Lesson 2.3 will show how) is y = 2e<sup>x</sup> − x − 1. We estimate y(0.5) with three step sizes.</p>
` + EULER_PY + `
<p>Halving h roughly halves the error: Euler's method is <strong>first-order accurate</strong> (error ∝ h). Real simulators use higher-order methods such as Runge–Kutta, but they are built on this same idea.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the initial condition and leaving the answer with C.</li><li>In Euler's method, updating x before computing F(x<sub>n</sub>, y<sub>n</sub>) (mixing old and new values).</li><li>Believing a small number of Euler steps is accurate — always compare with a smaller h.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>DE = equation linking a function and its derivatives; order = highest derivative.</li><li>Verify a solution by substitution; an initial condition fixes the constant.</li><li>Direction field: slope F(x, y) drawn at each point.</li><li>Euler: y<sub>n+1</sub> = y<sub>n</sub> + hF(x<sub>n</sub>, y<sub>n</sub>); error shrinks roughly in proportion to h.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS2 + '4-1-basics-of-differential-equations', 'OpenStax Vol. 2 — 4.1 Basics of Differential Equations') + `</li><li>` + A(OS2 + '4-2-direction-fields-and-numerical-methods', 'OpenStax Vol. 2 — 4.2 Direction Fields and Numerical Methods') + `</li><li>` + A(PDE + 'EulersMethod.aspx', "Paul's Online Notes — Euler's Method") + `</li><li>` + A('https://www.3blue1brown.com/lessons/differential-equations', '3Blue1Brown — Differential equations, studying the unsolvable') + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>Is y = e<sup>−x</sup> + x − 1 a solution of y′ + y = x? </li><li>Solve the IVP y′ = −2y, y(0) = 4 (guess the form Ce<sup>kx</sup>).</li><li>Use Euler's method with h = 0.1 for one step on y′ = x + y, y(0) = 1. What is y(0.1)?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) y′ = −e<sup>−x</sup> + 1, y′ + y = −e<sup>−x</sup> + 1 + e<sup>−x</sup> + x − 1 = x ✓ <b>yes</b>. 2) <b>y = 4e<sup>−2x</sup></b>. 3) y<sub>1</sub> = 1 + 0.1(0 + 1) = <b>1.1</b> (exact 2e<sup>0.1</sup> − 1.1 ≈ 1.1103).</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 2 · Bài 2.1</span>
<h2>Phương trình vi phân: mô hình, trường hướng và phương pháp Euler</h2>
<p class="lead">Vật lý, sinh học, kinh tế và mô phỏng máy tính hiếm khi cho bạn công thức của một đại lượng. Chúng cho <strong>quy luật thay đổi</strong> của nó: “dân số tăng tỉ lệ với chính nó”, “cốc cà phê nguội tỉ lệ với độ chênh nhiệt so với phòng”. Quy luật như vậy là một <strong>phương trình vi phân</strong> (PTVP).</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa phương trình vi phân, cấp và nghiệm; kiểm nghiệm bằng cách thế vào.</li><li>Giải bài toán giá trị đầu (IVP) bằng cách chọn hằng số.</li><li>Đọc trường hướng và phác hoạ đường nghiệm.</li><li>Xấp xỉ nghiệm bằng phương pháp Euler và hiểu sai số của nó.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Phương trình vi phân</strong> là phương trình chứa hàm chưa biết và đạo hàm của nó, vd y′ = 3y, y′′ + y = 0, dP/dt = 0,5P(1 − P/1000). <strong>Cấp</strong> là cấp đạo hàm cao nhất có mặt. <strong>Nghiệm</strong> là hàm làm phương trình đúng trên một khoảng. Đa số PTVP cấp một có một <strong>họ</strong> nghiệm một tham số (nghiệm tổng quát); <strong>điều kiện đầu</strong> y(x<sub>0</sub>) = y<sub>0</sub> chọn ra một nghiệm.</p>
<div class="callout"><p><b>Ví dụ 1 — kiểm nghiệm.</b> Chứng tỏ y = Ce<sup>3x</sup> là nghiệm của y′ = 3y, rồi giải IVP y(0) = 5.</p>
<p>y′ = 3Ce<sup>3x</sup> = 3y ✓ với mọi C. y(0) = C = 5, nên <b>y = 5e<sup>3x</sup></b>.</p></div>
<p><strong>Trường hướng.</strong> PTVP cấp một y′ = F(x, y) cho biết <em>độ dốc</em> của nghiệm đi qua mỗi điểm. Vẽ một đoạn ngắn có hệ số góc F(x, y) tại nhiều điểm lưới: đó là trường hướng, và đường nghiệm men theo các đoạn như mạt sắt theo từ trường. Với y′ = x + y, độ dốc bằng 0 dọc đường y = −x, dương phía trên và âm phía dưới.</p>
<p><strong>Phương pháp Euler.</strong> Đi theo trường hướng từng bước nhỏ h: từ (x<sub>n</sub>, y<sub>n</sub>) đi theo tiếp tuyến.</p>
<div class="formula"><span class="lbl">Phương pháp Euler</span>x<sub>n+1</sub> = x<sub>n</sub> + h      y<sub>n+1</sub> = y<sub>n</sub> + h · F(x<sub>n</sub>, y<sub>n</sub>)</div>
<div class="callout"><p><b>Ví dụ 2 — tính tay.</b> y′ = y, y(0) = 1, h = 0,5, hai bước tới x = 1: y<sub>1</sub> = 1 + 0,5 · 1 = 1,5; y<sub>2</sub> = 1,5 + 0,5 · 1,5 = <b>2,25</b>. Giá trị đúng là e ≈ 2,718: Euler ước lượng thiếu vì đường nghiệm cong lên.</p></div>
<h3>💻 Phương pháp Euler bằng Python</h3>
<p>IVP: y′ = x + y, y(0) = 1, nghiệm đúng (Bài 2.3 sẽ chỉ cách tìm) là y = 2e<sup>x</sup> − x − 1. Ta ước lượng y(0,5) với ba bước h.</p>
` + EULER_PY + `
<p>Giảm h một nửa thì sai số giảm khoảng một nửa: phương pháp Euler có <strong>độ chính xác bậc một</strong> (sai số ∝ h). Trình mô phỏng thật dùng phương pháp bậc cao như Runge–Kutta, nhưng xây trên đúng ý tưởng này.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên điều kiện đầu, để đáp số còn C.</li><li>Trong phương pháp Euler, cập nhật x trước khi tính F(x<sub>n</sub>, y<sub>n</sub>) (trộn giá trị cũ và mới).</li><li>Tin rằng vài bước Euler là đủ chính xác — luôn so sánh với h nhỏ hơn.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>PTVP = phương trình liên hệ hàm và đạo hàm của nó; cấp = đạo hàm cao nhất.</li><li>Kiểm nghiệm bằng cách thế vào; điều kiện đầu cố định hằng số.</li><li>Trường hướng: vẽ độ dốc F(x, y) tại từng điểm.</li><li>Euler: y<sub>n+1</sub> = y<sub>n</sub> + hF(x<sub>n</sub>, y<sub>n</sub>); sai số giảm gần tỉ lệ với h.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS2 + '4-1-basics-of-differential-equations', 'OpenStax Vol. 2 — 4.1 Cơ bản về phương trình vi phân') + `</li><li>` + A(OS2 + '4-2-direction-fields-and-numerical-methods', 'OpenStax Vol. 2 — 4.2 Trường hướng và phương pháp số') + `</li><li>` + A(PDE + 'EulersMethod.aspx', "Paul's Online Notes — Euler's Method") + `</li><li>` + A('https://www.3blue1brown.com/lessons/differential-equations', '3Blue1Brown — Phương trình vi phân') + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>y = e<sup>−x</sup> + x − 1 có là nghiệm của y′ + y = x không?</li><li>Giải IVP y′ = −2y, y(0) = 4 (đoán dạng Ce<sup>kx</sup>).</li><li>Dùng Euler với h = 0,1 một bước cho y′ = x + y, y(0) = 1. y(0,1) bằng bao nhiêu?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) y′ = −e<sup>−x</sup> + 1, y′ + y = −e<sup>−x</sup> + 1 + e<sup>−x</sup> + x − 1 = x ✓ <b>có</b>. 2) <b>y = 4e<sup>−2x</sup></b>. 3) y<sub>1</sub> = 1 + 0,1(0 + 1) = <b>1,1</b> (giá trị đúng 2e<sup>0,1</sup> − 1,1 ≈ 1,1103).</p></div>`);

const c22 = L('cal121-ts-2-2',
  '2.2 — Separable equations: exponential growth, decay, cooling and the logistic model|||2.2 — Phương trình tách biến: tăng trưởng mũ, phân rã, định luật làm nguội, mô hình logistic',
  'Tách biến dy/g(y) = f(x)dx; tăng trưởng/phân rã mũ (chu kỳ bán rã C-14), định luật làm nguội Newton, mô hình logistic P = K/(1+Ae^(−rt)); ví dụ đã kiểm bằng sympy.',
  `<span class="eyebrow">CAL121 · Chapter 2 · Lesson 2.2</span>
<h2>Separable equations and the classic growth models</h2>
<p class="lead">If the right-hand side of y′ splits into “a function of x times a function of y”, you can put all the y's on one side and all the x's on the other, then integrate both sides. This single idea solves the most important models in science.</p>
<h3>🎯 Objectives</h3>
<ul><li>Recognise and solve separable equations.</li><li>Model exponential growth/decay and Newton's law of cooling.</li><li>Solve and interpret the logistic equation (carrying capacity, inflection point).</li></ul>
<h3>📖 Separation of variables</h3>
<div class="formula"><span class="lbl">Separable equation</span>dy/dx = f(x) g(y)  ⇒  ∫ dy/g(y) = ∫ f(x) dx + C   (where g(y) ≠ 0)</div>
<div class="callout"><p><b>Example 1.</b> dy/dx = x/y, y(0) = 2. Separate: y dy = x dx ⇒ y<sup>2</sup>/2 = x<sup>2</sup>/2 + C. y(0) = 2 gives C = 2, so y<sup>2</sup> = x<sup>2</sup> + 4 and, since y(0) &gt; 0, <b>y = √(x<sup>2</sup> + 4)</b>.</p></div>
<div class="callout"><p><b>Example 2.</b> dy/dx = 2x(1 + y<sup>2</sup>), y(0) = 0. ∫ dy/(1 + y<sup>2</sup>) = ∫ 2x dx ⇒ arctan y = x<sup>2</sup> + C, C = 0 ⇒ <b>y = tan(x<sup>2</sup>)</b>, valid while x<sup>2</sup> &lt; π/2.</p></div>
<h3>📖 Exponential growth and decay</h3>
<p>“Rate proportional to amount”: dy/dt = ky. Separating, ln|y| = kt + C, so <b>y = y<sub>0</sub>e<sup>kt</sup></b>. k &gt; 0 is growth, k &lt; 0 is decay. A half-life T means e<sup>kT</sup> = 1/2, so k = −ln 2/T.</p>
<div class="callout"><p><b>Example 3 — carbon dating.</b> C-14 has half-life 5730 years. A bone keeps 30% of its C-14. Then e<sup>kt</sup> = 0.3 with k = −ln 2/5730, so t = 5730 · ln 0.3/ln 0.5 ≈ <b>9953 years</b>.</p></div>
<div class="callout"><p><b>Example 4 — Newton's law of cooling.</b> dT/dt = −k(T − T<sub>room</sub>). Coffee at 90 °C in a 25 °C room is 60 °C after 10 minutes. Solution: T = 25 + 65e<sup>−kt</sup>; 60 = 25 + 65e<sup>−10k</sup> ⇒ k = ln(65/35)/10 ≈ 0.0619 per minute. It reaches 40 °C when 65e<sup>−kt</sup> = 15 ⇒ t = ln(65/15)/k ≈ <b>23.7 minutes</b>.</p></div>
<h3>📖 The logistic model</h3>
<p>Real populations cannot grow forever. The logistic equation adds a brake near the <strong>carrying capacity</strong> K:</p>
<div class="formula"><span class="lbl">Logistic equation and solution</span>dP/dt = rP(1 − P/K)    ⇒    P(t) = K/(1 + Ae<sup>−rt</sup>),  A = (K − P<sub>0</sub>)/P<sub>0</sub></div>
<p>Separate with partial fractions: K/(P(K − P)) = 1/P + 1/(K − P). For small P growth is almost exponential; P → K as t → ∞; growth is fastest at P = K/2 (the inflection point).</p>
<div class="callout"><p><b>Example 5.</b> K = 1000, P<sub>0</sub> = 100, r = 0.5 per year. A = 9, P(t) = 1000/(1 + 9e<sup>−0.5t</sup>). P(4) = 1000/(1 + 9e<sup>−2</sup>) ≈ <b>450.9</b>. Fastest growth when 9e<sup>−0.5t</sup> = 1, t = ln 9/0.5 ≈ <b>4.39 years</b>. The same S-curve describes the spread of a new app or a rumour.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing ∫ dy/g(y) without “+ C” on one side, or adding the constant only after exponentiating incorrectly (e<sup>x + C</sup> = Ae<sup>x</sup>, not e<sup>x</sup> + C).</li><li>Losing equilibrium solutions: dividing by g(y) hides solutions with g(y) = 0, e.g. y = 0 for y′ = ky.</li><li>Using the half-life T itself as k.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Separate, integrate both sides, then use the initial condition.</li><li>dy/dt = ky ⇒ y = y<sub>0</sub>e<sup>kt</sup>; half-life k = −ln 2/T.</li><li>Cooling: T = T<sub>room</sub> + (T<sub>0</sub> − T<sub>room</sub>)e<sup>−kt</sup>.</li><li>Logistic: P = K/(1 + Ae<sup>−rt</sup>), inflection at P = K/2.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS2 + '4-3-separable-equations', 'OpenStax Vol. 2 — 4.3 Separable Equations') + `</li><li>` + A(OS2 + '4-4-the-logistic-equation', 'OpenStax Vol. 2 — 4.4 The Logistic Equation') + `</li><li>` + A(PDE + 'Separable.aspx', "Paul's Online Notes — Separable Equations") + `</li><li>` + A(PDE + 'Modeling.aspx', "Paul's Online Notes — Modeling with First Order DEs") + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>Bacteria double every 3 hours. How long until the colony is 10 times its initial size?</li><li>Solve dy/dx = y<sup>2</sup> cos x, y(0) = 1.</li><li>Logistic model with K = 500, P<sub>0</sub> = 50, r = 0.4: find P(5) and the time of fastest growth.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 2<sup>t/3</sup> = 10 ⇒ t = 3 log<sub>2</sub>10 ≈ <b>9.97 hours</b>. 2) −1/y = sin x + C, C = −1 ⇒ <b>y = 1/(1 − sin x)</b>. 3) A = 9: P(5) = 500/(1 + 9e<sup>−2</sup>) ≈ <b>225.4</b>; t = ln 9/0.4 ≈ <b>5.49</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 2 · Bài 2.2</span>
<h2>Phương trình tách biến và các mô hình tăng trưởng kinh điển</h2>
<p class="lead">Nếu vế phải của y′ tách được thành “một hàm của x nhân một hàm của y”, ta dồn mọi y về một vế, mọi x về vế kia rồi lấy tích phân hai vế. Chỉ một ý này giải được những mô hình quan trọng nhất của khoa học.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận ra và giải phương trình tách biến.</li><li>Mô hình hoá tăng trưởng/phân rã mũ và định luật làm nguội Newton.</li><li>Giải và diễn giải phương trình logistic (sức chứa, điểm uốn).</li></ul>
<h3>📖 Tách biến</h3>
<div class="formula"><span class="lbl">Phương trình tách biến</span>dy/dx = f(x) g(y)  ⇒  ∫ dy/g(y) = ∫ f(x) dx + C   (khi g(y) ≠ 0)</div>
<div class="callout"><p><b>Ví dụ 1.</b> dy/dx = x/y, y(0) = 2. Tách: y dy = x dx ⇒ y<sup>2</sup>/2 = x<sup>2</sup>/2 + C. y(0) = 2 cho C = 2, nên y<sup>2</sup> = x<sup>2</sup> + 4 và vì y(0) &gt; 0, <b>y = √(x<sup>2</sup> + 4)</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2.</b> dy/dx = 2x(1 + y<sup>2</sup>), y(0) = 0. ∫ dy/(1 + y<sup>2</sup>) = ∫ 2x dx ⇒ arctan y = x<sup>2</sup> + C, C = 0 ⇒ <b>y = tan(x<sup>2</sup>)</b>, đúng khi x<sup>2</sup> &lt; π/2.</p></div>
<h3>📖 Tăng trưởng và phân rã mũ</h3>
<p>“Tốc độ tỉ lệ với lượng hiện có”: dy/dt = ky. Tách biến, ln|y| = kt + C, nên <b>y = y<sub>0</sub>e<sup>kt</sup></b>. k &gt; 0 là tăng, k &lt; 0 là phân rã. Chu kỳ bán rã T nghĩa là e<sup>kT</sup> = 1/2, nên k = −ln 2/T.</p>
<div class="callout"><p><b>Ví dụ 3 — định tuổi bằng C-14.</b> C-14 có chu kỳ bán rã 5730 năm. Một mẩu xương còn 30% C-14. Khi đó e<sup>kt</sup> = 0,3 với k = −ln 2/5730, nên t = 5730 · ln 0,3/ln 0,5 ≈ <b>9953 năm</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4 — định luật làm nguội Newton.</b> dT/dt = −k(T − T<sub>phòng</sub>). Cà phê 90 °C trong phòng 25 °C, sau 10 phút còn 60 °C. Nghiệm: T = 25 + 65e<sup>−kt</sup>; 60 = 25 + 65e<sup>−10k</sup> ⇒ k = ln(65/35)/10 ≈ 0,0619 mỗi phút. Còn 40 °C khi 65e<sup>−kt</sup> = 15 ⇒ t = ln(65/15)/k ≈ <b>23,7 phút</b>.</p></div>
<h3>📖 Mô hình logistic</h3>
<p>Quần thể thật không thể tăng mãi. Phương trình logistic thêm “phanh” gần <strong>sức chứa</strong> K:</p>
<div class="formula"><span class="lbl">Phương trình logistic và nghiệm</span>dP/dt = rP(1 − P/K)    ⇒    P(t) = K/(1 + Ae<sup>−rt</sup>),  A = (K − P<sub>0</sub>)/P<sub>0</sub></div>
<p>Tách biến bằng phân thức: K/(P(K − P)) = 1/P + 1/(K − P). Khi P nhỏ, tăng gần như mũ; P → K khi t → ∞; tăng nhanh nhất tại P = K/2 (điểm uốn).</p>
<div class="callout"><p><b>Ví dụ 5.</b> K = 1000, P<sub>0</sub> = 100, r = 0,5 mỗi năm. A = 9, P(t) = 1000/(1 + 9e<sup>−0,5t</sup>). P(4) = 1000/(1 + 9e<sup>−2</sup>) ≈ <b>450,9</b>. Tăng nhanh nhất khi 9e<sup>−0,5t</sup> = 1, t = ln 9/0,5 ≈ <b>4,39 năm</b>. Cùng đường cong chữ S này mô tả sự lan truyền của một ứng dụng mới hay một tin đồn.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên “+ C” ở một vế, hoặc lấy mũ sai (e<sup>x + C</sup> = Ae<sup>x</sup>, không phải e<sup>x</sup> + C).</li><li>Mất nghiệm cân bằng: chia cho g(y) làm mất nghiệm có g(y) = 0, vd y = 0 của y′ = ky.</li><li>Dùng chính chu kỳ bán rã T làm k.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tách biến, tích phân hai vế, rồi dùng điều kiện đầu.</li><li>dy/dt = ky ⇒ y = y<sub>0</sub>e<sup>kt</sup>; bán rã k = −ln 2/T.</li><li>Làm nguội: T = T<sub>phòng</sub> + (T<sub>0</sub> − T<sub>phòng</sub>)e<sup>−kt</sup>.</li><li>Logistic: P = K/(1 + Ae<sup>−rt</sup>), điểm uốn tại P = K/2.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS2 + '4-3-separable-equations', 'OpenStax Vol. 2 — 4.3 Phương trình tách biến') + `</li><li>` + A(OS2 + '4-4-the-logistic-equation', 'OpenStax Vol. 2 — 4.4 Phương trình logistic') + `</li><li>` + A(PDE + 'Separable.aspx', "Paul's Online Notes — Separable Equations") + `</li><li>` + A(PDE + 'Modeling.aspx', "Paul's Online Notes — Mô hình hoá bằng PTVP cấp một") + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Vi khuẩn gấp đôi sau mỗi 3 giờ. Sau bao lâu khuẩn lạc gấp 10 lần ban đầu?</li><li>Giải dy/dx = y<sup>2</sup> cos x, y(0) = 1.</li><li>Mô hình logistic K = 500, P<sub>0</sub> = 50, r = 0,4: tính P(5) và thời điểm tăng nhanh nhất.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 2<sup>t/3</sup> = 10 ⇒ t = 3 log<sub>2</sub>10 ≈ <b>9,97 giờ</b>. 2) −1/y = sin x + C, C = −1 ⇒ <b>y = 1/(1 − sin x)</b>. 3) A = 9: P(5) = 500/(1 + 9e<sup>−2</sup>) ≈ <b>225,4</b>; t = ln 9/0,4 ≈ <b>5,49</b>.</p></div>`);

const c23 = L('cal121-ts-2-3',
  '2.3 — First-order linear equations and mixing problems|||2.3 — Phương trình tuyến tính cấp một và bài toán pha trộn',
  'Dạng chuẩn y′ + P(x)y = Q(x), thừa số tích phân e^(∫P dx); ví dụ y′+2y=e^(−x), xy′+y=x², bể muối pha trộn; giải lại bài toán Euler của Bài 2.1.',
  `<span class="eyebrow">CAL121 · Chapter 2 · Lesson 2.3</span>
<h2>First-order linear equations and mixing problems</h2>
<p class="lead">Many DEs are not separable — y′ = x + y from Lesson 2.1 is one. If y and y′ appear only to the first power, the equation is <strong>linear</strong>, and one clever multiplication turns the left side into the derivative of a product.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write a linear equation in standard form y′ + P(x)y = Q(x).</li><li>Find the integrating factor and solve.</li><li>Model tank-mixing problems as linear DEs.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Integrating factor method</span>y′ + P(x) y = Q(x)<br>μ(x) = e<sup>∫P(x) dx</sup>   ⇒   (μ y)′ = μ Q   ⇒   y = (1/μ) [ ∫ μ(x) Q(x) dx + C ]</div>
<p>Why it works: by the product rule (μy)′ = μy′ + μ′y, and μ′ = Pμ by construction, so (μy)′ = μ(y′ + Py) = μQ. Integrate both sides.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> y′ + 2y = e<sup>−x</sup>. P = 2, μ = e<sup>2x</sup>. (e<sup>2x</sup>y)′ = e<sup>x</sup> ⇒ e<sup>2x</sup>y = e<sup>x</sup> + C ⇒ <b>y = e<sup>−x</sup> + Ce<sup>−2x</sup></b>.</p></div>
<div class="callout"><p><b>Example 2.</b> xy′ + y = x<sup>2</sup>, x &gt; 0, y(1) = 1. Here the left side is already (xy)′! So xy = x<sup>3</sup>/3 + C; y(1) = 1 ⇒ C = 2/3 ⇒ <b>y = x<sup>2</sup>/3 + 2/(3x)</b>. (Standard form y′ + y/x = x gives μ = x — the same thing.)</p></div>
<div class="callout"><p><b>Example 3 — back to Lesson 2.1.</b> y′ = x + y, y(0) = 1 ⇒ y′ − y = x, μ = e<sup>−x</sup>. (e<sup>−x</sup>y)′ = xe<sup>−x</sup> ⇒ e<sup>−x</sup>y = −xe<sup>−x</sup> − e<sup>−x</sup> + C (by parts) ⇒ y = −x − 1 + Ce<sup>x</sup>; y(0) = 1 ⇒ C = 2 ⇒ <b>y = 2e<sup>x</sup> − x − 1</b>, the exact solution we used to measure Euler's error.</p></div>
<h3>📖 Mixing problems</h3>
<p>A tank holds a solution; brine flows in and the well-stirred mixture flows out. If S(t) is the amount of salt, then <strong>dS/dt = (rate in) − (rate out)</strong>, where rate = concentration × flow.</p>
<div class="callout"><p><b>Example 4.</b> A 100 L tank contains 10 kg of salt. Brine with 0.2 kg/L enters at 5 L/min and the mixture leaves at 5 L/min. Rate in = 0.2 · 5 = 1 kg/min; rate out = (S/100) · 5 = S/20 kg/min. So S′ + S/20 = 1, μ = e<sup>t/20</sup>, S = 20 + Ce<sup>−t/20</sup>; S(0) = 10 ⇒ C = −10: <b>S(t) = 20 − 10e<sup>−t/20</sup></b>. After 20 minutes S ≈ 16.32 kg; in the long run S → 20 kg (= 0.2 kg/L × 100 L, as common sense says).</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Not dividing by the coefficient of y′ first: 2y′ + 4y = … must become y′ + 2y = … before reading P.</li><li>Sign errors in P: y′ − y = x has P = −1, μ = e<sup>−x</sup>.</li><li>Forgetting C, or adding it after dividing by μ (C must be divided by μ too).</li><li>In mixing problems, using the inflow concentration for the outflow.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Linear: y′ + P(x)y = Q(x).</li><li>μ = e<sup>∫P dx</sup>, then (μy)′ = μQ.</li><li>Mixing: dS/dt = in − out, out = (S/V) × outflow.</li><li>Separable and linear are the two methods every Calculus II exam expects.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS2 + '4-5-first-order-linear-equations', 'OpenStax Vol. 2 — 4.5 First-order Linear Equations') + `</li><li>` + A(PDE + 'Linear.aspx', "Paul's Online Notes — Linear Differential Equations") + `</li><li>` + A('https://ocw.mit.edu/courses/18-03sc-differential-equations-fall-2011/pages/unit-i-first-order-differential-equations/', 'MIT OCW 18.03SC — Unit I: First Order Differential Equations') + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>Solve y′ − y = 2, y(0) = 0.</li><li>Solve y′ + y/x = 1, x &gt; 0, y(1) = 0.</li><li>In Example 4, how long until the tank holds 15 kg of salt?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) μ = e<sup>−x</sup>: e<sup>−x</sup>y = −2e<sup>−x</sup> + C ⇒ <b>y = 2e<sup>x</sup> − 2</b>. 2) μ = x: (xy)′ = x ⇒ xy = x<sup>2</sup>/2 − 1/2 ⇒ <b>y = x/2 − 1/(2x)</b>. 3) 20 − 10e<sup>−t/20</sup> = 15 ⇒ e<sup>−t/20</sup> = 1/2 ⇒ t = 20 ln 2 ≈ <b>13.9 minutes</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 2 · Bài 2.3</span>
<h2>Phương trình tuyến tính cấp một và bài toán pha trộn</h2>
<p class="lead">Nhiều PTVP không tách biến được — y′ = x + y ở Bài 2.1 là một ví dụ. Nếu y và y′ chỉ xuất hiện ở bậc một, phương trình là <strong>tuyến tính</strong>, và một phép nhân khéo léo biến vế trái thành đạo hàm của một tích.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết phương trình tuyến tính ở dạng chuẩn y′ + P(x)y = Q(x).</li><li>Tìm thừa số tích phân và giải.</li><li>Mô hình hoá bài toán pha trộn trong bể bằng PTVP tuyến tính.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Phương pháp thừa số tích phân</span>y′ + P(x) y = Q(x)<br>μ(x) = e<sup>∫P(x) dx</sup>   ⇒   (μ y)′ = μ Q   ⇒   y = (1/μ) [ ∫ μ(x) Q(x) dx + C ]</div>
<p>Vì sao đúng: theo quy tắc tích (μy)′ = μy′ + μ′y, mà μ′ = Pμ theo cách dựng, nên (μy)′ = μ(y′ + Py) = μQ. Lấy tích phân hai vế.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> y′ + 2y = e<sup>−x</sup>. P = 2, μ = e<sup>2x</sup>. (e<sup>2x</sup>y)′ = e<sup>x</sup> ⇒ e<sup>2x</sup>y = e<sup>x</sup> + C ⇒ <b>y = e<sup>−x</sup> + Ce<sup>−2x</sup></b>.</p></div>
<div class="callout"><p><b>Ví dụ 2.</b> xy′ + y = x<sup>2</sup>, x &gt; 0, y(1) = 1. Vế trái đã sẵn là (xy)′! Nên xy = x<sup>3</sup>/3 + C; y(1) = 1 ⇒ C = 2/3 ⇒ <b>y = x<sup>2</sup>/3 + 2/(3x)</b>. (Dạng chuẩn y′ + y/x = x cho μ = x — cùng một việc.)</p></div>
<div class="callout"><p><b>Ví dụ 3 — quay lại Bài 2.1.</b> y′ = x + y, y(0) = 1 ⇒ y′ − y = x, μ = e<sup>−x</sup>. (e<sup>−x</sup>y)′ = xe<sup>−x</sup> ⇒ e<sup>−x</sup>y = −xe<sup>−x</sup> − e<sup>−x</sup> + C (từng phần) ⇒ y = −x − 1 + Ce<sup>x</sup>; y(0) = 1 ⇒ C = 2 ⇒ <b>y = 2e<sup>x</sup> − x − 1</b>, chính nghiệm đúng ta đã dùng để đo sai số Euler.</p></div>
<h3>📖 Bài toán pha trộn</h3>
<p>Một bể chứa dung dịch; nước muối chảy vào, hỗn hợp khuấy đều chảy ra. Gọi S(t) là lượng muối, thì <strong>dS/dt = (tốc độ vào) − (tốc độ ra)</strong>, với tốc độ = nồng độ × lưu lượng.</p>
<div class="callout"><p><b>Ví dụ 4.</b> Bể 100 L chứa 10 kg muối. Nước muối 0,2 kg/L chảy vào 5 L/phút, hỗn hợp chảy ra 5 L/phút. Vào = 0,2 · 5 = 1 kg/phút; ra = (S/100) · 5 = S/20 kg/phút. Nên S′ + S/20 = 1, μ = e<sup>t/20</sup>, S = 20 + Ce<sup>−t/20</sup>; S(0) = 10 ⇒ C = −10: <b>S(t) = 20 − 10e<sup>−t/20</sup></b>. Sau 20 phút S ≈ 16,32 kg; về lâu dài S → 20 kg (= 0,2 kg/L × 100 L, đúng như trực giác).</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Không chia cho hệ số của y′ trước: 2y′ + 4y = … phải thành y′ + 2y = … rồi mới đọc P.</li><li>Sai dấu P: y′ − y = x có P = −1, μ = e<sup>−x</sup>.</li><li>Quên C, hoặc thêm C sau khi chia cho μ (C cũng phải chia cho μ).</li><li>Trong bài pha trộn, dùng nồng độ dòng vào cho dòng ra.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tuyến tính: y′ + P(x)y = Q(x).</li><li>μ = e<sup>∫P dx</sup>, rồi (μy)′ = μQ.</li><li>Pha trộn: dS/dt = vào − ra, ra = (S/V) × lưu lượng ra.</li><li>Tách biến và tuyến tính là hai phương pháp đề thi Giải tích II nào cũng có.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS2 + '4-5-first-order-linear-equations', 'OpenStax Vol. 2 — 4.5 Phương trình tuyến tính cấp một') + `</li><li>` + A(PDE + 'Linear.aspx', "Paul's Online Notes — Linear Differential Equations") + `</li><li>` + A('https://ocw.mit.edu/courses/18-03sc-differential-equations-fall-2011/pages/unit-i-first-order-differential-equations/', 'MIT OCW 18.03SC — Unit I: PTVP cấp một') + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Giải y′ − y = 2, y(0) = 0.</li><li>Giải y′ + y/x = 1, x &gt; 0, y(1) = 0.</li><li>Ở Ví dụ 4, sau bao lâu bể chứa 15 kg muối?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) μ = e<sup>−x</sup>: e<sup>−x</sup>y = −2e<sup>−x</sup> + C ⇒ <b>y = 2e<sup>x</sup> − 2</b>. 2) μ = x: (xy)′ = x ⇒ xy = x<sup>2</sup>/2 − 1/2 ⇒ <b>y = x/2 − 1/(2x)</b>. 3) 20 − 10e<sup>−t/20</sup> = 15 ⇒ e<sup>−t/20</sup> = 1/2 ⇒ t = 20 ln 2 ≈ <b>13,9 phút</b>.</p></div>`);

const q2 = QZ(2, 'Quiz — Chapter 2: First-order differential equations|||Quiz — Chương 2: Phương trình vi phân cấp một', 'Kiểm tra chương 2: kiểm nghiệm, Euler, tách biến, tăng trưởng mũ, làm nguội, logistic, thừa số tích phân, pha trộn.', [
  Q('q1', 'The order of y″ + 3(y′)⁴ − y = sin x is|||Cấp của y″ + 3(y′)⁴ − y = sin x là',
    ['1|||1', '2|||2', '3|||3', '4|||4'], 1,
    'Order = highest derivative (y″), not the highest power.|||Cấp = đạo hàm cao nhất (y″), không phải số mũ cao nhất.'),
  Q('q2', 'One Euler step with h = 0.5 for y′ = y, y(0) = 1 gives y(0.5) ≈|||Một bước Euler h = 0,5 cho y′ = y, y(0) = 1 cho y(0,5) ≈',
    ['1.5|||1,5', '1.65|||1,65', '2|||2', '2.25|||2,25'], 0,
    'y₁ = 1 + 0.5·1 = 1.5.|||y₁ = 1 + 0,5·1 = 1,5.'),
  Q('q3', 'Halving the step size h in Euler’s method makes the error roughly|||Giảm một nửa bước h trong phương pháp Euler làm sai số khoảng',
    ['unchanged|||không đổi', 'half as large|||giảm một nửa', 'a quarter as large|||còn một phần tư', 'twice as large|||gấp đôi'], 1,
    'Euler is first-order: error ∝ h (0.0764 → 0.0397 in the lesson).|||Euler bậc một: sai số ∝ h (0,0764 → 0,0397 trong bài).'),
  Q('q4', 'The solution of dy/dx = x/y, y(0) = 2 is|||Nghiệm của dy/dx = x/y, y(0) = 2 là',
    ['y = x + 2|||y = x + 2', 'y = √(x² + 4)|||y = √(x² + 4)', 'y = 2eˣ|||y = 2eˣ', 'y = x²/2 + 2|||y = x²/2 + 2'], 1,
    'y dy = x dx ⇒ y² = x² + 4, positive branch.|||y dy = x dx ⇒ y² = x² + 4, lấy nhánh dương.'),
  Q('q5', 'A substance has half-life 10 years. In y = y₀e^(kt), k =|||Một chất có chu kỳ bán rã 10 năm. Trong y = y₀e^(kt), k =',
    ['−10|||−10', '−ln 2/10|||−ln 2/10', '−1/20|||−1/20', 'ln 10/2|||ln 10/2'], 1,
    'e^(10k) = 1/2 ⇒ k = −ln 2/10 ≈ −0.0693.|||e^(10k) = 1/2 ⇒ k = −ln 2/10 ≈ −0,0693.'),
  Q('q6', 'For dP/dt = 0.5P(1 − P/1000), the population grows fastest when P =|||Với dP/dt = 0,5P(1 − P/1000), quần thể tăng nhanh nhất khi P =',
    ['0|||0', '500|||500', '1000|||1000', '250|||250'], 1,
    'rP(1 − P/K) is a parabola in P with maximum at K/2.|||rP(1 − P/K) là parabol theo P, cực đại tại K/2.'),
  Q('q7', 'The integrating factor of y′ − 3y = eˣ is|||Thừa số tích phân của y′ − 3y = eˣ là',
    ['e^(3x)|||e^(3x)', 'e^(−3x)|||e^(−3x)', 'eˣ|||eˣ', '−3x|||−3x'], 1,
    'P = −3, μ = e^(∫−3 dx) = e^(−3x).|||P = −3, μ = e^(∫−3 dx) = e^(−3x).'),
  Q('q8', 'The general solution of y′ + 2y = e^(−x) is|||Nghiệm tổng quát của y′ + 2y = e^(−x) là',
    ['y = e^(−x) + Ce^(−2x)|||y = e^(−x) + Ce^(−2x)', 'y = Ce^(−2x)|||y = Ce^(−2x)', 'y = e^(−2x) + Ce^(−x)|||y = e^(−2x) + Ce^(−x)', 'y = −e^(−x) + C|||y = −e^(−x) + C'], 0,
    '(e^(2x)y)′ = eˣ ⇒ e^(2x)y = eˣ + C.|||(e^(2x)y)′ = eˣ ⇒ e^(2x)y = eˣ + C.'),
  Q('q9', 'Tank 100 L, inflow 5 L/min of 0.2 kg/L brine, outflow 5 L/min. The DE for the salt S is|||Bể 100 L, vào 5 L/phút nước muối 0,2 kg/L, ra 5 L/phút. PTVP cho lượng muối S là',
    ['S′ = 1 − S/20|||S′ = 1 − S/20', 'S′ = 0.2 − S/100|||S′ = 0,2 − S/100', 'S′ = 1 + S/20|||S′ = 1 + S/20', 'S′ = 5 − 5S|||S′ = 5 − 5S'], 0,
    'In: 0.2·5 = 1 kg/min; out: (S/100)·5 = S/20.|||Vào: 0,2·5 = 1 kg/phút; ra: (S/100)·5 = S/20.'),
  Q('q10', 'Coffee follows T = 25 + 65e^(−kt). As t → ∞, T approaches|||Cà phê theo T = 25 + 65e^(−kt). Khi t → ∞, T tiến tới',
    ['0 °C|||0 °C', '25 °C|||25 °C', '65 °C|||65 °C', '90 °C|||90 °C'], 1,
    'e^(−kt) → 0, the room temperature remains.|||e^(−kt) → 0, còn lại nhiệt độ phòng.'),
]);

const ch2 = {
  title: 'Chapter 2 — First-order differential equations|||Chương 2 — Phương trình vi phân cấp một',
  description: 'Mô hình bằng PTVP, trường hướng, phương pháp Euler (code Python), phương trình tách biến, tăng trưởng/phân rã, làm nguội Newton, logistic, phương trình tuyến tính và bài toán pha trộn (Stewart 9.1–9.5 · OpenStax Vol.2 ch.4).',
  lessons: [c21, c22, c23, q2],
};

// ───────────────────────────── Chương 3 — Tham số & toạ độ cực ─────────────────────────────
const c31 = L('cal121-ts-3-1',
  '3.1 — Parametric curves and their calculus|||3.1 — Đường cong tham số và giải tích trên đường tham số',
  'Đường cong tham số x = f(t), y = g(t); khử tham số; hệ số góc dy/dx = (dy/dt)/(dx/dt), đạo hàm cấp hai, tiếp tuyến ngang/đứng; diện tích và độ dài cung (cycloid: diện tích 3πr², độ dài 8r).',
  `<span class="eyebrow">CAL121 · Chapter 3 · Lesson 3.1</span>
<h2>Parametric curves and their calculus</h2>
<p class="lead">A moving point — a planet, a game character, a pen plotter — has an x-coordinate and a y-coordinate that both depend on <strong>time t</strong>. Describing a curve by x = f(t), y = g(t) handles loops, self-intersections and vertical tangents that y = f(x) cannot.</p>
<h3>🎯 Objectives</h3>
<ul><li>Sketch parametric curves and eliminate the parameter.</li><li>Compute dy/dx and d<sup>2</sup>y/dx<sup>2</sup>; find horizontal and vertical tangents.</li><li>Compute area under and arc length of a parametric curve.</li></ul>
<h3>📖 Parametric curves</h3>
<p>The circle x = r cos t, y = r sin t, 0 ≤ t ≤ 2π satisfies x<sup>2</sup> + y<sup>2</sup> = r<sup>2</sup> (eliminating t), traced counter-clockwise. The <strong>cycloid</strong> x = r(t − sin t), y = r(1 − cos t) is the path of a point on the rim of a rolling wheel. The same curve can have many parametrisations; the parametrisation also tells you <em>direction</em> and <em>speed</em>.</p>
<h3>📖 Tangents</h3>
<div class="formula"><span class="lbl">Slope and concavity</span>dy/dx = (dy/dt)/(dx/dt)  (when dx/dt ≠ 0)      d<sup>2</sup>y/dx<sup>2</sup> = [d/dt (dy/dx)] / (dx/dt)</div>
<p>Horizontal tangent: dy/dt = 0 and dx/dt ≠ 0. Vertical tangent: dx/dt = 0 and dy/dt ≠ 0.</p>
<div class="callout"><p><b>Example 1.</b> x = t<sup>2</sup>, y = t<sup>3</sup> − 3t. dy/dx = (3t<sup>2</sup> − 3)/(2t).</p>
<p>Horizontal tangents: t = ±1, points (1, −2) and (1, 2). Vertical tangent: t = 0, point (0, 0). At t = 2: point (4, 2), slope 9/4, tangent line <b>y − 2 = (9/4)(x − 4)</b>. Concavity: d<sup>2</sup>y/dx<sup>2</sup> = [d/dt((3t<sup>2</sup> − 3)/(2t))]/(2t) = 3(t<sup>2</sup> + 1)/(4t<sup>3</sup>): concave up for t &gt; 0, down for t &lt; 0. Note the curve passes (3, 0) twice (t = ±√3): a self-intersection with two different tangents.</p></div>
<h3>📖 Area and arc length</h3>
<div class="formula"><span class="lbl">Area under a parametric curve (traced left to right)</span>A = ∫ y dx = ∫<sub>α</sub><sup>β</sup> g(t) f′(t) dt</div>
<div class="formula"><span class="lbl">Arc length</span>L = ∫<sub>α</sub><sup>β</sup> √( (dx/dt)<sup>2</sup> + (dy/dt)<sup>2</sup> ) dt   — the integrand is the speed</div>
<div class="callout"><p><b>Example 2 — one arch of the cycloid</b> (0 ≤ t ≤ 2π). Area: ∫ r(1 − cos t) · r(1 − cos t) dt = r<sup>2</sup>∫<sub>0</sub><sup>2π</sup> (1 − 2cos t + cos<sup>2</sup>t) dt = r<sup>2</sup>(2π + π) = <b>3πr<sup>2</sup></b> — three times the area of the rolling wheel. Length: (dx/dt)<sup>2</sup> + (dy/dt)<sup>2</sup> = r<sup>2</sup>(2 − 2cos t) = 4r<sup>2</sup>sin<sup>2</sup>(t/2), so L = ∫<sub>0</sub><sup>2π</sup> 2r sin(t/2) dt = <b>8r</b>.</p></div>
<div class="callout"><p><b>Example 3.</b> x = t<sup>2</sup>, y = t<sup>3</sup>, 0 ≤ t ≤ 1: L = ∫ √(4t<sup>2</sup> + 9t<sup>4</sup>) dt = ∫ t√(4 + 9t<sup>2</sup>) dt = (1/27)[(4 + 9t<sup>2</sup>)<sup>3/2</sup>]<sub>0</sub><sup>1</sup> = (13√13 − 8)/27 ≈ <b>1.4397</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Computing dy/dx as (dx/dt)/(dy/dt) — upside down.</li><li>For d<sup>2</sup>y/dx<sup>2</sup>, differentiating dy/dx with respect to t and forgetting to divide by dx/dt.</li><li>Arc length over a parameter interval that traces part of the curve twice (e.g. 0 ≤ t ≤ 4π for a circle gives 4πr).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>x = f(t), y = g(t): position as a function of time.</li><li>dy/dx = (dy/dt)/(dx/dt); horizontal: dy/dt = 0; vertical: dx/dt = 0.</li><li>A = ∫ g(t) f′(t) dt; L = ∫ √(x′<sup>2</sup> + y′<sup>2</sup>) dt.</li><li>Cycloid arch: area 3πr<sup>2</sup>, length 8r.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS2 + '7-1-parametric-equations', 'OpenStax Vol. 2 — 7.1 Parametric Equations') + `</li><li>` + A(OS2 + '7-2-calculus-of-parametric-curves', 'OpenStax Vol. 2 — 7.2 Calculus of Parametric Curves') + `</li><li>` + A(PN2 + 'ParaTangent.aspx', "Paul's Online Notes — Tangents with Parametric Equations") + `</li><li>` + A(PN2 + 'ParaArcLength.aspx', "Paul's Online Notes — Arc Length with Parametric Equations") + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>Eliminate the parameter: x = 2 + 3cos t, y = −1 + 3sin t.</li><li>For x = t − t<sup>2</sup>, y = t<sup>2</sup>, find dy/dx and the point with a vertical tangent.</li><li>Find the length of x = cos<sup>3</sup>t, y = sin<sup>3</sup>t, 0 ≤ t ≤ π/2.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (x − 2)<sup>2</sup> + (y + 1)<sup>2</sup> = 9: circle centre (2, −1), radius 3. 2) dy/dx = 2t/(1 − 2t); vertical when t = 1/2: point <b>(1/4, 1/4)</b>. 3) speed = 3|sin t cos t|, L = ∫<sub>0</sub><sup>π/2</sup> 3 sin t cos t dt = <b>3/2</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 3 · Bài 3.1</span>
<h2>Đường cong tham số và giải tích trên đường tham số</h2>
<p class="lead">Một điểm chuyển động — hành tinh, nhân vật game, đầu bút vẽ — có hoành độ và tung độ cùng phụ thuộc <strong>thời gian t</strong>. Mô tả đường cong bằng x = f(t), y = g(t) xử lý được vòng lặp, điểm tự cắt và tiếp tuyến đứng mà y = f(x) không làm được.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phác hoạ đường tham số và khử tham số.</li><li>Tính dy/dx và d<sup>2</sup>y/dx<sup>2</sup>; tìm tiếp tuyến ngang, đứng.</li><li>Tính diện tích dưới và độ dài cung của đường tham số.</li></ul>
<h3>📖 Đường cong tham số</h3>
<p>Đường tròn x = r cos t, y = r sin t, 0 ≤ t ≤ 2π thoả x<sup>2</sup> + y<sup>2</sup> = r<sup>2</sup> (khử t), đi ngược chiều kim đồng hồ. <strong>Cycloid</strong> x = r(t − sin t), y = r(1 − cos t) là quỹ đạo một điểm trên vành bánh xe lăn. Một đường cong có thể có nhiều cách tham số hoá; cách tham số hoá còn cho biết <em>chiều</em> và <em>tốc độ</em>.</p>
<h3>📖 Tiếp tuyến</h3>
<div class="formula"><span class="lbl">Hệ số góc và độ lồi</span>dy/dx = (dy/dt)/(dx/dt)  (khi dx/dt ≠ 0)      d<sup>2</sup>y/dx<sup>2</sup> = [d/dt (dy/dx)] / (dx/dt)</div>
<p>Tiếp tuyến ngang: dy/dt = 0 và dx/dt ≠ 0. Tiếp tuyến đứng: dx/dt = 0 và dy/dt ≠ 0.</p>
<div class="callout"><p><b>Ví dụ 1.</b> x = t<sup>2</sup>, y = t<sup>3</sup> − 3t. dy/dx = (3t<sup>2</sup> − 3)/(2t).</p>
<p>Tiếp tuyến ngang: t = ±1, điểm (1, −2) và (1, 2). Tiếp tuyến đứng: t = 0, điểm (0, 0). Tại t = 2: điểm (4, 2), hệ số góc 9/4, tiếp tuyến <b>y − 2 = (9/4)(x − 4)</b>. Độ lồi: d<sup>2</sup>y/dx<sup>2</sup> = [d/dt((3t<sup>2</sup> − 3)/(2t))]/(2t) = 3(t<sup>2</sup> + 1)/(4t<sup>3</sup>): lõm lên khi t &gt; 0, lồi xuống khi t &lt; 0. Đường cong đi qua (3, 0) hai lần (t = ±√3): một điểm tự cắt với hai tiếp tuyến khác nhau.</p></div>
<h3>📖 Diện tích và độ dài cung</h3>
<div class="formula"><span class="lbl">Diện tích dưới đường tham số (đi từ trái sang phải)</span>A = ∫ y dx = ∫<sub>α</sub><sup>β</sup> g(t) f′(t) dt</div>
<div class="formula"><span class="lbl">Độ dài cung</span>L = ∫<sub>α</sub><sup>β</sup> √( (dx/dt)<sup>2</sup> + (dy/dt)<sup>2</sup> ) dt   — biểu thức dưới dấu tích phân là tốc độ</div>
<div class="callout"><p><b>Ví dụ 2 — một vòm cycloid</b> (0 ≤ t ≤ 2π). Diện tích: ∫ r(1 − cos t) · r(1 − cos t) dt = r<sup>2</sup>∫<sub>0</sub><sup>2π</sup> (1 − 2cos t + cos<sup>2</sup>t) dt = r<sup>2</sup>(2π + π) = <b>3πr<sup>2</sup></b> — gấp ba diện tích bánh xe. Độ dài: (dx/dt)<sup>2</sup> + (dy/dt)<sup>2</sup> = r<sup>2</sup>(2 − 2cos t) = 4r<sup>2</sup>sin<sup>2</sup>(t/2), nên L = ∫<sub>0</sub><sup>2π</sup> 2r sin(t/2) dt = <b>8r</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3.</b> x = t<sup>2</sup>, y = t<sup>3</sup>, 0 ≤ t ≤ 1: L = ∫ √(4t<sup>2</sup> + 9t<sup>4</sup>) dt = ∫ t√(4 + 9t<sup>2</sup>) dt = (1/27)[(4 + 9t<sup>2</sup>)<sup>3/2</sup>]<sub>0</sub><sup>1</sup> = (13√13 − 8)/27 ≈ <b>1,4397</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tính dy/dx thành (dx/dt)/(dy/dt) — ngược.</li><li>Với d<sup>2</sup>y/dx<sup>2</sup>, đạo hàm dy/dx theo t rồi quên chia cho dx/dt.</li><li>Tính độ dài trên khoảng tham số đi qua một phần đường cong hai lần (vd 0 ≤ t ≤ 4π với đường tròn cho 4πr).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>x = f(t), y = g(t): vị trí theo thời gian.</li><li>dy/dx = (dy/dt)/(dx/dt); ngang: dy/dt = 0; đứng: dx/dt = 0.</li><li>A = ∫ g(t) f′(t) dt; L = ∫ √(x′<sup>2</sup> + y′<sup>2</sup>) dt.</li><li>Vòm cycloid: diện tích 3πr<sup>2</sup>, độ dài 8r.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS2 + '7-1-parametric-equations', 'OpenStax Vol. 2 — 7.1 Phương trình tham số') + `</li><li>` + A(OS2 + '7-2-calculus-of-parametric-curves', 'OpenStax Vol. 2 — 7.2 Giải tích trên đường tham số') + `</li><li>` + A(PN2 + 'ParaTangent.aspx', "Paul's Online Notes — Tiếp tuyến với phương trình tham số") + `</li><li>` + A(PN2 + 'ParaArcLength.aspx', "Paul's Online Notes — Độ dài cung với phương trình tham số") + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Khử tham số: x = 2 + 3cos t, y = −1 + 3sin t.</li><li>Với x = t − t<sup>2</sup>, y = t<sup>2</sup>, tìm dy/dx và điểm có tiếp tuyến đứng.</li><li>Tính độ dài x = cos<sup>3</sup>t, y = sin<sup>3</sup>t, 0 ≤ t ≤ π/2.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (x − 2)<sup>2</sup> + (y + 1)<sup>2</sup> = 9: đường tròn tâm (2, −1), bán kính 3. 2) dy/dx = 2t/(1 − 2t); đứng khi t = 1/2: điểm <b>(1/4, 1/4)</b>. 3) tốc độ = 3|sin t cos t|, L = ∫<sub>0</sub><sup>π/2</sup> 3 sin t cos t dt = <b>3/2</b>.</p></div>`);

const c32 = L('cal121-ts-3-2',
  '3.2 — Polar coordinates and polar curves|||3.2 — Toạ độ cực và đường cong trong toạ độ cực',
  'Đổi (r, θ) ↔ (x, y); đường cực kinh điển (đường tròn, cardioid, hoa hồng, xoắn ốc), đổi phương trình cực sang Descartes, hệ số góc tiếp tuyến của đường cực.',
  `<span class="eyebrow">CAL121 · Chapter 3 · Lesson 3.2</span>
<h2>Polar coordinates and polar curves</h2>
<p class="lead">Radar screens, robot arms, antenna patterns and anything that rotates are easier to describe by <strong>distance and angle</strong> than by x and y. Polar coordinates (r, θ) locate a point by its distance r from the origin and the angle θ from the positive x-axis.</p>
<h3>🎯 Objectives</h3>
<ul><li>Convert points and equations between polar and Cartesian form.</li><li>Sketch circles, cardioids, roses and spirals.</li><li>Compute the slope of the tangent to a polar curve.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Conversion</span>x = r cos θ    y = r sin θ        r<sup>2</sup> = x<sup>2</sup> + y<sup>2</sup>    tan θ = y/x</div>
<p>A point has <strong>many</strong> polar representations: (r, θ) = (r, θ + 2π) = (−r, θ + π). A negative r means “go in the opposite direction”. When finding θ from tan θ = y/x, check the quadrant.</p>
<div class="callout"><p><b>Example 1.</b> (2, π/3) → x = 2cos(π/3) = 1, y = 2sin(π/3) = √3: <b>(1, √3)</b>. (−1, 1) → r = √2, the point is in quadrant II so θ = 3π/4: <b>(√2, 3π/4)</b> (not −π/4, which points into quadrant IV).</p></div>
<h3>📖 Classic polar curves</h3>
<ul><li><strong>r = a</strong>: circle of radius a; <strong>θ = c</strong>: line through the origin.</li><li><strong>r = 2a cos θ</strong>: multiply by r: x<sup>2</sup> + y<sup>2</sup> = 2ax ⇔ (x − a)<sup>2</sup> + y<sup>2</sup> = a<sup>2</sup>, a circle through the origin.</li><li><strong>Cardioid r = a(1 + cos θ)</strong>: heart shape, r runs from 2a (θ = 0) to 0 (θ = π).</li><li><strong>Rose r = cos nθ</strong>: n petals if n is odd, 2n petals if n is even (r = cos 2θ has 4).</li><li><strong>Spiral r = θ</strong> (Archimedes): distance grows steadily with angle.</li></ul>
<div class="callout"><p><b>Example 2 — convert.</b> r = 2 cos θ: r<sup>2</sup> = 2r cos θ ⇒ x<sup>2</sup> + y<sup>2</sup> = 2x ⇒ <b>(x − 1)<sup>2</sup> + y<sup>2</sup> = 1</b>. Conversely, the line y = 3 is r sin θ = 3, i.e. r = 3 csc θ.</p></div>
<h3>📖 Tangents to polar curves</h3>
<p>Treat θ as the parameter: x = r(θ) cos θ, y = r(θ) sin θ. Then</p>
<div class="formula"><span class="lbl">Slope of a polar curve</span>dy/dx = (r′ sin θ + r cos θ) / (r′ cos θ − r sin θ),   r′ = dr/dθ</div>
<div class="callout"><p><b>Example 3.</b> Cardioid r = 1 + cos θ at θ = π/2: r = 1, r′ = −sin θ = −1. Numerator (−1)(1) + 1 · 0 = −1; denominator (−1)(0) − 1 · 1 = −1. Slope <b>1</b>. The point is (x, y) = (0, 1), so the tangent is y = x + 1.</p></div>
<p><b>Tangents at the pole.</b> If r(θ<sub>0</sub>) = 0 and r′(θ<sub>0</sub>) ≠ 0, the curve leaves the origin along the line θ = θ<sub>0</sub>. For r = cos 2θ this happens at θ = π/4, 3π/4, …: the petals touch the lines y = ±x.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>θ = arctan(y/x) without checking the quadrant.</li><li>Thinking r = cos 3θ has 6 petals (odd n gives n petals; the curve retraces itself).</li><li>Computing dr/dθ and calling it the slope dy/dx.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>x = r cos θ, y = r sin θ, r<sup>2</sup> = x<sup>2</sup> + y<sup>2</sup>.</li><li>Polar representations are not unique; negative r reflects through the origin.</li><li>Multiply by r to convert r = 2a cos θ into a circle.</li><li>dy/dx = (r′ sin θ + r cos θ)/(r′ cos θ − r sin θ).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS2 + '7-3-polar-coordinates', 'OpenStax Vol. 2 — 7.3 Polar Coordinates') + `</li><li>` + A(PN2 + 'PolarCoordinates.aspx', "Paul's Online Notes — Polar Coordinates") + `</li><li>` + A(PN2 + 'PolarTangents.aspx', "Paul's Online Notes — Tangents with Polar Coordinates") + `</li><li>` + A('https://www.desmos.com/calculator', 'Desmos — type r = 1 + cos(θ) to graph polar curves') + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>Convert (−2, −2) to polar coordinates with r &gt; 0, 0 ≤ θ &lt; 2π.</li><li>Convert r = 4 sin θ to Cartesian form and describe it.</li><li>Find the slope of r = θ at θ = π/2.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) r = 2√2, quadrant III: θ = 5π/4 ⇒ <b>(2√2, 5π/4)</b>. 2) x<sup>2</sup> + y<sup>2</sup> = 4y ⇒ <b>x<sup>2</sup> + (y − 2)<sup>2</sup> = 4</b>, circle centre (0, 2), radius 2. 3) r = π/2, r′ = 1: numerator 1 · 1 + (π/2) · 0 = 1, denominator 1 · 0 − (π/2) · 1 = −π/2 ⇒ slope <b>−2/π</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 3 · Bài 3.2</span>
<h2>Toạ độ cực và đường cong trong toạ độ cực</h2>
<p class="lead">Màn hình radar, cánh tay robot, giản đồ ăng-ten và mọi thứ quay tròn mô tả bằng <strong>khoảng cách và góc</strong> dễ hơn bằng x và y. Toạ độ cực (r, θ) xác định điểm bằng khoảng cách r tới gốc và góc θ tính từ chiều dương trục Ox.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Đổi điểm và phương trình giữa dạng cực và Descartes.</li><li>Phác hoạ đường tròn, cardioid, hoa hồng, xoắn ốc.</li><li>Tính hệ số góc tiếp tuyến của đường cực.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Công thức đổi</span>x = r cos θ    y = r sin θ        r<sup>2</sup> = x<sup>2</sup> + y<sup>2</sup>    tan θ = y/x</div>
<p>Một điểm có <strong>nhiều</strong> cách biểu diễn cực: (r, θ) = (r, θ + 2π) = (−r, θ + π). r âm nghĩa là “đi theo hướng ngược lại”. Khi tìm θ từ tan θ = y/x, phải kiểm góc phần tư.</p>
<div class="callout"><p><b>Ví dụ 1.</b> (2, π/3) → x = 2cos(π/3) = 1, y = 2sin(π/3) = √3: <b>(1, √3)</b>. (−1, 1) → r = √2, điểm ở góc phần tư II nên θ = 3π/4: <b>(√2, 3π/4)</b> (không phải −π/4, hướng đó chỉ vào góc phần tư IV).</p></div>
<h3>📖 Các đường cực kinh điển</h3>
<ul><li><strong>r = a</strong>: đường tròn bán kính a; <strong>θ = c</strong>: đường thẳng qua gốc.</li><li><strong>r = 2a cos θ</strong>: nhân với r: x<sup>2</sup> + y<sup>2</sup> = 2ax ⇔ (x − a)<sup>2</sup> + y<sup>2</sup> = a<sup>2</sup>, đường tròn đi qua gốc.</li><li><strong>Cardioid r = a(1 + cos θ)</strong>: hình trái tim, r chạy từ 2a (θ = 0) về 0 (θ = π).</li><li><strong>Hoa hồng r = cos nθ</strong>: n cánh nếu n lẻ, 2n cánh nếu n chẵn (r = cos 2θ có 4 cánh).</li><li><strong>Xoắn ốc r = θ</strong> (Archimedes): khoảng cách tăng đều theo góc.</li></ul>
<div class="callout"><p><b>Ví dụ 2 — đổi phương trình.</b> r = 2 cos θ: r<sup>2</sup> = 2r cos θ ⇒ x<sup>2</sup> + y<sup>2</sup> = 2x ⇒ <b>(x − 1)<sup>2</sup> + y<sup>2</sup> = 1</b>. Ngược lại, đường thẳng y = 3 là r sin θ = 3, tức r = 3 csc θ.</p></div>
<h3>📖 Tiếp tuyến của đường cực</h3>
<p>Xem θ là tham số: x = r(θ) cos θ, y = r(θ) sin θ. Khi đó</p>
<div class="formula"><span class="lbl">Hệ số góc của đường cực</span>dy/dx = (r′ sin θ + r cos θ) / (r′ cos θ − r sin θ),   r′ = dr/dθ</div>
<div class="callout"><p><b>Ví dụ 3.</b> Cardioid r = 1 + cos θ tại θ = π/2: r = 1, r′ = −sin θ = −1. Tử (−1)(1) + 1 · 0 = −1; mẫu (−1)(0) − 1 · 1 = −1. Hệ số góc <b>1</b>. Điểm là (x, y) = (0, 1), nên tiếp tuyến y = x + 1.</p></div>
<p><b>Tiếp tuyến tại gốc.</b> Nếu r(θ<sub>0</sub>) = 0 và r′(θ<sub>0</sub>) ≠ 0, đường cong rời gốc theo đường θ = θ<sub>0</sub>. Với r = cos 2θ điều này xảy ra tại θ = π/4, 3π/4, …: các cánh tiếp xúc với đường y = ±x.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>θ = arctan(y/x) mà không kiểm góc phần tư.</li><li>Nghĩ r = cos 3θ có 6 cánh (n lẻ cho n cánh; đường cong đi lại chính nó).</li><li>Tính dr/dθ rồi gọi đó là hệ số góc dy/dx.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>x = r cos θ, y = r sin θ, r<sup>2</sup> = x<sup>2</sup> + y<sup>2</sup>.</li><li>Biểu diễn cực không duy nhất; r âm là đối xứng qua gốc.</li><li>Nhân với r để đổi r = 2a cos θ thành đường tròn.</li><li>dy/dx = (r′ sin θ + r cos θ)/(r′ cos θ − r sin θ).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS2 + '7-3-polar-coordinates', 'OpenStax Vol. 2 — 7.3 Toạ độ cực') + `</li><li>` + A(PN2 + 'PolarCoordinates.aspx', "Paul's Online Notes — Polar Coordinates") + `</li><li>` + A(PN2 + 'PolarTangents.aspx', "Paul's Online Notes — Tiếp tuyến trong toạ độ cực") + `</li><li>` + A('https://www.desmos.com/calculator', 'Desmos — gõ r = 1 + cos(θ) để vẽ đường cực') + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Đổi (−2, −2) sang toạ độ cực với r &gt; 0, 0 ≤ θ &lt; 2π.</li><li>Đổi r = 4 sin θ sang dạng Descartes và mô tả đường cong.</li><li>Tìm hệ số góc của r = θ tại θ = π/2.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) r = 2√2, góc phần tư III: θ = 5π/4 ⇒ <b>(2√2, 5π/4)</b>. 2) x<sup>2</sup> + y<sup>2</sup> = 4y ⇒ <b>x<sup>2</sup> + (y − 2)<sup>2</sup> = 4</b>, đường tròn tâm (0, 2), bán kính 2. 3) r = π/2, r′ = 1: tử 1 · 1 + (π/2) · 0 = 1, mẫu 1 · 0 − (π/2) · 1 = −π/2 ⇒ hệ số góc <b>−2/π</b>.</p></div>`);

const c33 = L('cal121-ts-3-3',
  '3.3 — Areas and arc lengths in polar coordinates|||3.3 — Diện tích và độ dài cung trong toạ độ cực',
  'A = ½∫r²dθ (diện tích hình quạt), diện tích cardioid 3π/2, một cánh hoa hồng π/8, miền giữa hai đường cực (tìm giao điểm), độ dài cung L = ∫√(r²+r′²)dθ (cardioid dài 8).',
  `<span class="eyebrow">CAL121 · Chapter 3 · Lesson 3.3</span>
<h2>Areas and arc lengths in polar coordinates</h2>
<p class="lead">In Cartesian coordinates we slice areas into thin <em>rectangles</em>. In polar coordinates the natural slice is a thin <strong>sector</strong> (a slice of pizza), because the curve is given as distance from the origin.</p>
<h3>🎯 Objectives</h3>
<ul><li>Derive and use A = ½∫ r<sup>2</sup> dθ.</li><li>Find the area between two polar curves, including their intersection angles.</li><li>Compute the arc length of a polar curve.</li></ul>
<h3>📖 Area</h3>
<p>A circular sector of radius r and angle Δθ has area ½r<sup>2</sup>Δθ. Adding thin sectors under r = f(θ) from θ = α to θ = β and taking the limit:</p>
<div class="formula"><span class="lbl">Polar area</span>A = ∫<sub>α</sub><sup>β</sup> ½ [f(θ)]<sup>2</sup> dθ        between curves: A = ∫<sub>α</sub><sup>β</sup> ½ ( r<sub>out</sub><sup>2</sup> − r<sub>in</sub><sup>2</sup> ) dθ</div>
<div class="callout"><p><b>Example 1 — cardioid.</b> r = 1 + cos θ, 0 ≤ θ ≤ 2π: A = ½∫<sub>0</sub><sup>2π</sup> (1 + 2cos θ + cos<sup>2</sup>θ) dθ = ½(2π + 0 + π) = <b>3π/2</b>.</p></div>
<div class="callout"><p><b>Example 2 — one rose petal.</b> r = cos 2θ: one petal is traced for −π/4 ≤ θ ≤ π/4 (where r ≥ 0 starts and ends at 0). A = ½∫<sub>−π/4</sub><sup>π/4</sup> cos<sup>2</sup>2θ dθ = <b>π/8</b>; all four petals: π/2.</p></div>
<div class="callout"><p><b>Example 3 — between two curves.</b> Inside r = 3 sin θ and outside r = 1 + sin θ.</p>
<p>Step 1, intersections: 3 sin θ = 1 + sin θ ⇒ sin θ = 1/2 ⇒ θ = π/6, 5π/6. Step 2, on that interval 3 sin θ is the outer curve. Step 3: A = ½∫<sub>π/6</sub><sup>5π/6</sup> [9sin<sup>2</sup>θ − (1 + sin θ)<sup>2</sup>] dθ = <b>π</b> (checked with SymPy).</p></div>
<div class="note-ct"><p><b>Caution about intersections.</b> Solving r<sub>1</sub>(θ) = r<sub>2</sub>(θ) can miss points — in particular the origin, which may be reached at different θ on the two curves. Always sketch both curves.</p></div>
<h3>📖 Arc length</h3>
<p>Using x = r cos θ, y = r sin θ as a parametrisation, (dx/dθ)<sup>2</sup> + (dy/dθ)<sup>2</sup> simplifies to r<sup>2</sup> + (r′)<sup>2</sup>:</p>
<div class="formula"><span class="lbl">Polar arc length</span>L = ∫<sub>α</sub><sup>β</sup> √( r<sup>2</sup> + (dr/dθ)<sup>2</sup> ) dθ</div>
<div class="callout"><p><b>Example 4.</b> The cardioid r = 1 + cos θ: r<sup>2</sup> + r′<sup>2</sup> = (1 + cos θ)<sup>2</sup> + sin<sup>2</sup>θ = 2 + 2cos θ = 4cos<sup>2</sup>(θ/2). Using symmetry, L = 2∫<sub>0</sub><sup>π</sup> 2cos(θ/2) dθ = <b>8</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the ½, or writing ½∫ r dθ instead of ½∫ r<sup>2</sup> dθ.</li><li>Integrating over 0 to 2π when the curve is traced twice (r = 2cos θ is traced once on [0, π]; over [0, 2π] you get double the area).</li><li>Using ½∫(r<sub>out</sub> − r<sub>in</sub>)<sup>2</sup> instead of ½∫(r<sub>out</sub><sup>2</sup> − r<sub>in</sub><sup>2</sup>).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>A = ½∫ r<sup>2</sup> dθ — sectors, not rectangles.</li><li>Between curves: ½∫ (r<sub>out</sub><sup>2</sup> − r<sub>in</sub><sup>2</sup>) dθ, limits from the intersections.</li><li>L = ∫ √(r<sup>2</sup> + r′<sup>2</sup>) dθ.</li><li>Cardioid r = 1 + cos θ: area 3π/2, length 8.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS2 + '7-4-area-and-arc-length-in-polar-coordinates', 'OpenStax Vol. 2 — 7.4 Area and Arc Length in Polar Coordinates') + `</li><li>` + A(PN2 + 'PolarArea.aspx', "Paul's Online Notes — Area with Polar Coordinates") + `</li><li>` + A(PN2 + 'PolarArcLength.aspx', "Paul's Online Notes — Arc Length with Polar Coordinates") + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the area enclosed by r = 2 cos θ (use the right θ-interval!).</li><li>Find the area of one loop of r = sin 3θ.</li><li>Set up (do not evaluate) the length of the spiral r = θ for 0 ≤ θ ≤ 2π; its value is about 21.26.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Traced once on −π/2 ≤ θ ≤ π/2: ½∫ 4cos<sup>2</sup>θ dθ = <b>π</b> (a circle of radius 1 ✓). 2) One loop on 0 ≤ θ ≤ π/3: ½∫ sin<sup>2</sup>3θ dθ = <b>π/12</b>. 3) <b>L = ∫<sub>0</sub><sup>2π</sup> √(θ<sup>2</sup> + 1) dθ ≈ 21.26</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 3 · Bài 3.3</span>
<h2>Diện tích và độ dài cung trong toạ độ cực</h2>
<p class="lead">Trong toạ độ Descartes ta chia diện tích thành <em>hình chữ nhật</em> mỏng. Trong toạ độ cực, lát cắt tự nhiên là <strong>hình quạt</strong> mỏng (miếng pizza), vì đường cong cho dưới dạng khoảng cách tới gốc.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dựng và dùng A = ½∫ r<sup>2</sup> dθ.</li><li>Tính diện tích giữa hai đường cực, kể cả tìm góc giao nhau.</li><li>Tính độ dài cung của đường cực.</li></ul>
<h3>📖 Diện tích</h3>
<p>Hình quạt bán kính r, góc Δθ có diện tích ½r<sup>2</sup>Δθ. Cộng các hình quạt mỏng dưới r = f(θ) từ θ = α đến θ = β rồi lấy giới hạn:</p>
<div class="formula"><span class="lbl">Diện tích trong toạ độ cực</span>A = ∫<sub>α</sub><sup>β</sup> ½ [f(θ)]<sup>2</sup> dθ        giữa hai đường: A = ∫<sub>α</sub><sup>β</sup> ½ ( r<sub>ngoài</sub><sup>2</sup> − r<sub>trong</sub><sup>2</sup> ) dθ</div>
<div class="callout"><p><b>Ví dụ 1 — cardioid.</b> r = 1 + cos θ, 0 ≤ θ ≤ 2π: A = ½∫<sub>0</sub><sup>2π</sup> (1 + 2cos θ + cos<sup>2</sup>θ) dθ = ½(2π + 0 + π) = <b>3π/2</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — một cánh hoa hồng.</b> r = cos 2θ: một cánh được vẽ khi −π/4 ≤ θ ≤ π/4 (r ≥ 0, bắt đầu và kết thúc tại 0). A = ½∫<sub>−π/4</sub><sup>π/4</sup> cos<sup>2</sup>2θ dθ = <b>π/8</b>; cả bốn cánh: π/2.</p></div>
<div class="callout"><p><b>Ví dụ 3 — giữa hai đường.</b> Bên trong r = 3 sin θ và bên ngoài r = 1 + sin θ.</p>
<p>Bước 1, giao điểm: 3 sin θ = 1 + sin θ ⇒ sin θ = 1/2 ⇒ θ = π/6, 5π/6. Bước 2, trên khoảng đó 3 sin θ là đường ngoài. Bước 3: A = ½∫<sub>π/6</sub><sup>5π/6</sup> [9sin<sup>2</sup>θ − (1 + sin θ)<sup>2</sup>] dθ = <b>π</b> (đã kiểm bằng SymPy).</p></div>
<div class="note-ct"><p><b>Cẩn thận với giao điểm.</b> Giải r<sub>1</sub>(θ) = r<sub>2</sub>(θ) có thể bỏ sót điểm — đặc biệt là gốc toạ độ, mà hai đường có thể đi qua tại hai θ khác nhau. Luôn vẽ cả hai đường.</p></div>
<h3>📖 Độ dài cung</h3>
<p>Dùng x = r cos θ, y = r sin θ làm tham số hoá, (dx/dθ)<sup>2</sup> + (dy/dθ)<sup>2</sup> rút gọn thành r<sup>2</sup> + (r′)<sup>2</sup>:</p>
<div class="formula"><span class="lbl">Độ dài cung trong toạ độ cực</span>L = ∫<sub>α</sub><sup>β</sup> √( r<sup>2</sup> + (dr/dθ)<sup>2</sup> ) dθ</div>
<div class="callout"><p><b>Ví dụ 4.</b> Cardioid r = 1 + cos θ: r<sup>2</sup> + r′<sup>2</sup> = (1 + cos θ)<sup>2</sup> + sin<sup>2</sup>θ = 2 + 2cos θ = 4cos<sup>2</sup>(θ/2). Dùng đối xứng, L = 2∫<sub>0</sub><sup>π</sup> 2cos(θ/2) dθ = <b>8</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên ½, hoặc viết ½∫ r dθ thay vì ½∫ r<sup>2</sup> dθ.</li><li>Lấy tích phân từ 0 đến 2π khi đường cong bị vẽ hai lần (r = 2cos θ vẽ một lần trên [0, π]; trên [0, 2π] ra gấp đôi diện tích).</li><li>Dùng ½∫(r<sub>ngoài</sub> − r<sub>trong</sub>)<sup>2</sup> thay vì ½∫(r<sub>ngoài</sub><sup>2</sup> − r<sub>trong</sub><sup>2</sup>).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>A = ½∫ r<sup>2</sup> dθ — hình quạt, không phải hình chữ nhật.</li><li>Giữa hai đường: ½∫ (r<sub>ngoài</sub><sup>2</sup> − r<sub>trong</sub><sup>2</sup>) dθ, cận lấy từ giao điểm.</li><li>L = ∫ √(r<sup>2</sup> + r′<sup>2</sup>) dθ.</li><li>Cardioid r = 1 + cos θ: diện tích 3π/2, độ dài 8.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS2 + '7-4-area-and-arc-length-in-polar-coordinates', 'OpenStax Vol. 2 — 7.4 Diện tích và độ dài cung trong toạ độ cực') + `</li><li>` + A(PN2 + 'PolarArea.aspx', "Paul's Online Notes — Diện tích với toạ độ cực") + `</li><li>` + A(PN2 + 'PolarArcLength.aspx', "Paul's Online Notes — Độ dài cung với toạ độ cực") + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tính diện tích giới hạn bởi r = 2 cos θ (chọn đúng khoảng θ!).</li><li>Tính diện tích một cánh của r = sin 3θ.</li><li>Lập (không cần tính) độ dài xoắn ốc r = θ với 0 ≤ θ ≤ 2π; giá trị khoảng 21,26.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Vẽ một lần trên −π/2 ≤ θ ≤ π/2: ½∫ 4cos<sup>2</sup>θ dθ = <b>π</b> (đường tròn bán kính 1 ✓). 2) Một cánh trên 0 ≤ θ ≤ π/3: ½∫ sin<sup>2</sup>3θ dθ = <b>π/12</b>. 3) <b>L = ∫<sub>0</sub><sup>2π</sup> √(θ<sup>2</sup> + 1) dθ ≈ 21,26</b>.</p></div>`);

const q3 = QZ(3, 'Quiz — Chapter 3: Parametric equations & polar coordinates|||Quiz — Chương 3: Phương trình tham số & toạ độ cực', 'Kiểm tra chương 3: hệ số góc tham số, tiếp tuyến ngang/đứng, độ dài cung, đổi toạ độ cực, đường cực, diện tích ½∫r²dθ.', [
  Q('q1', 'For x = t², y = t³ − 3t, dy/dx =|||Với x = t², y = t³ − 3t, dy/dx =',
    ['(3t² − 3)/(2t)|||(3t² − 3)/(2t)', '2t/(3t² − 3)|||2t/(3t² − 3)', '3t² − 3|||3t² − 3', '(3t² − 3)·2t|||(3t² − 3)·2t'], 0,
    'dy/dx = (dy/dt)/(dx/dt).|||dy/dx = (dy/dt)/(dx/dt).'),
  Q('q2', 'The same curve has a vertical tangent at|||Cũng đường cong đó có tiếp tuyến đứng tại',
    ['t = 1|||t = 1', 't = 0|||t = 0', 't = −1|||t = −1', 't = √3|||t = √3'], 1,
    'dx/dt = 2t = 0 while dy/dt = −3 ≠ 0.|||dx/dt = 2t = 0 trong khi dy/dt = −3 ≠ 0.'),
  Q('q3', 'Length of one arch of the cycloid x = r(t − sin t), y = r(1 − cos t):|||Độ dài một vòm cycloid x = r(t − sin t), y = r(1 − cos t):',
    ['2πr|||2πr', '4r|||4r', '8r|||8r', '3πr|||3πr'], 2,
    'Speed = 2r|sin(t/2)|, ∫₀^(2π) 2r sin(t/2) dt = 8r.|||Tốc độ = 2r|sin(t/2)|, ∫₀^(2π) 2r sin(t/2) dt = 8r.'),
  Q('q4', 'The polar point (2, π/3) in Cartesian coordinates is|||Điểm cực (2, π/3) trong toạ độ Descartes là',
    ['(√3, 1)|||(√3, 1)', '(1, √3)|||(1, √3)', '(2, √3)|||(2, √3)', '(1, 2)|||(1, 2)'], 1,
    'x = 2cos(π/3) = 1, y = 2sin(π/3) = √3.|||x = 2cos(π/3) = 1, y = 2sin(π/3) = √3.'),
  Q('q5', 'The point (−1, 1) has polar angle (with r > 0)|||Điểm (−1, 1) có góc cực (với r > 0)',
    ['−π/4|||−π/4', 'π/4|||π/4', '3π/4|||3π/4', '5π/4|||5π/4'], 2,
    'Quadrant II, so θ = 3π/4, not arctan(−1) = −π/4.|||Góc phần tư II nên θ = 3π/4, không phải arctan(−1) = −π/4.'),
  Q('q6', 'r = 2 cos θ in Cartesian form is|||r = 2 cos θ ở dạng Descartes là',
    ['x² + y² = 2|||x² + y² = 2', '(x − 1)² + y² = 1|||(x − 1)² + y² = 1', 'x = 2|||x = 2', 'x² + (y − 1)² = 1|||x² + (y − 1)² = 1'], 1,
    'Multiply by r: x² + y² = 2x.|||Nhân với r: x² + y² = 2x.'),
  Q('q7', 'How many petals does r = cos 3θ have?|||r = cos 3θ có bao nhiêu cánh?',
    ['3|||3', '6|||6', '9|||9', '1.5|||1,5'], 0,
    'n odd gives n petals.|||n lẻ cho n cánh.'),
  Q('q8', 'Area enclosed by the cardioid r = 1 + cos θ:|||Diện tích giới hạn bởi cardioid r = 1 + cos θ:',
    ['π|||π', '3π/2|||3π/2', '2π|||2π', '3π|||3π'], 1,
    '½∫₀^(2π)(1 + cos θ)² dθ = ½(2π + π).|||½∫₀^(2π)(1 + cos θ)² dθ = ½(2π + π).'),
  Q('q9', 'Area of one petal of r = cos 2θ:|||Diện tích một cánh của r = cos 2θ:',
    ['π/4|||π/4', 'π/8|||π/8', 'π/2|||π/2', 'π/16|||π/16'], 1,
    '½∫ from −π/4 to π/4 of cos²2θ dθ = π/8.|||½∫ từ −π/4 đến π/4 của cos²2θ dθ = π/8.'),
  Q('q10', 'Polar arc length uses the integrand|||Độ dài cung cực dùng biểu thức dưới dấu tích phân',
    ['r|||r', '½r²|||½r²', '√(r² + (dr/dθ)²)|||√(r² + (dr/dθ)²)', '√(1 + (dr/dθ)²)|||√(1 + (dr/dθ)²)'], 2,
    'From x = r cos θ, y = r sin θ: x′² + y′² = r² + r′².|||Từ x = r cos θ, y = r sin θ: x′² + y′² = r² + r′².'),
]);

const ch3 = {
  title: 'Chapter 3 — Parametric equations and polar coordinates|||Chương 3 — Phương trình tham số và toạ độ cực',
  description: 'Đường tham số (tiếp tuyến, diện tích, độ dài; cycloid), toạ độ cực và các đường cực kinh điển, diện tích ½∫r²dθ và độ dài cung trong toạ độ cực (Stewart 10.1–10.4 · OpenStax Vol.2 7.1–7.4).',
  lessons: [c31, c32, c33, q3],
};

// ───────────────────────────── Chương 4 — Dãy & chuỗi (I) ─────────────────────────────
const PSERIES_PY = `<pre><code class="language-python">import math

s10 = sum(1 / n**2 for n in range(1, 11))   # partial sum s_10
low  = s10 + 1 / 11    # s_10 + integral from 11 to infinity of 1/x^2
high = s10 + 1 / 10    # s_10 + integral from 10 to infinity of 1/x^2
print(f"s_10            = {s10:.6f}")
print(f"sum lies in     [{low:.6f}, {high:.6f}]")
print(f"midpoint guess  = {(low + high) / 2:.6f}")
print(f"exact pi^2/6    = {math.pi**2 / 6:.6f}")</code></pre>
<div class="out">s_10            = 1.549768
sum lies in     [1.640677, 1.649768]
midpoint guess  = 1.645222
exact pi^2/6    = 1.644934</div>`;

const c41 = L('cal121-ts-4-1',
  '4.1 — Sequences: limits, monotone and bounded sequences|||4.1 — Dãy số: giới hạn, dãy đơn điệu và bị chặn',
  'Dãy số và giới hạn của dãy, dùng giới hạn hàm số và L’Hôpital, định lý kẹp, dãy hình học rⁿ, định lý dãy đơn điệu bị chặn (dãy truy hồi √(2+aₙ) → 2).',
  `<span class="eyebrow">CAL121 · Chapter 4 · Lesson 4.1</span>
<h2>Sequences: limits, monotone and bounded sequences</h2>
<p class="lead">A <strong>sequence</strong> is an infinite ordered list a<sub>1</sub>, a<sub>2</sub>, a<sub>3</sub>, … — the successive outputs of an algorithm, the balance of a bank account month by month, the approximations of Newton's method. The central question: does the list <strong>settle down</strong> to a number?</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute limits of sequences using function limits, L'Hôpital and the squeeze theorem.</li><li>Know when r<sup>n</sup> converges.</li><li>Use the Monotone Convergence Theorem for recursive sequences.</li></ul>
<h3>📖 Lecture</h3>
<p>We write lim<sub>n→∞</sub> a<sub>n</sub> = L if a<sub>n</sub> gets as close to L as we like for all sufficiently large n. If the limit exists the sequence <strong>converges</strong>; otherwise it <strong>diverges</strong>.</p>
<div class="formula"><span class="lbl">Key tools</span>• If a<sub>n</sub> = f(n) and lim<sub>x→∞</sub> f(x) = L, then a<sub>n</sub> → L (so L'Hôpital is allowed on f).<br>• Squeeze: b<sub>n</sub> ≤ a<sub>n</sub> ≤ c<sub>n</sub> and b<sub>n</sub>, c<sub>n</sub> → L ⇒ a<sub>n</sub> → L.<br>• r<sup>n</sup> converges ⇔ −1 &lt; r ≤ 1 (limit 0 if |r| &lt; 1, limit 1 if r = 1).<br>• If |a<sub>n</sub>| → 0 then a<sub>n</sub> → 0.</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>1.</b> a<sub>n</sub> = (2n<sup>2</sup> + 1)/(3n<sup>2</sup> − n): divide by n<sup>2</sup> ⇒ (2 + 1/n<sup>2</sup>)/(3 − 1/n) → <b>2/3</b>.</p>
<p><b>2.</b> a<sub>n</sub> = ln n / n: f(x) = ln x/x, L'Hôpital: (1/x)/1 → 0, so a<sub>n</sub> → <b>0</b>.</p>
<p><b>3.</b> a<sub>n</sub> = sin n / n: −1/n ≤ a<sub>n</sub> ≤ 1/n, squeeze ⇒ <b>0</b>.</p>
<p><b>4.</b> a<sub>n</sub> = (1 + 3/n)<sup>n</sup> → <b>e<sup>3</sup></b> (the standard limit (1 + x/n)<sup>n</sup> → e<sup>x</sup>).</p>
<p><b>5.</b> a<sub>n</sub> = (−1)<sup>n</sup>: alternates between −1 and 1, <b>diverges</b>. But (−1)<sup>n</sup>/n → 0 because its absolute value → 0.</p>
<p><b>6.</b> a<sub>n</sub> = n!/n<sup>n</sup> = (1/n)(2/n)⋯(n/n) ≤ 1/n ⇒ squeeze gives <b>0</b>: n<sup>n</sup> grows much faster than n!.</p></div>
<h3>📖 Monotone and bounded</h3>
<p>A sequence is <strong>increasing</strong> if a<sub>n</sub> ≤ a<sub>n+1</sub> for all n, <strong>bounded above</strong> if a<sub>n</sub> ≤ M for all n.</p>
<div class="formula"><span class="lbl">Monotone Convergence Theorem</span>Every bounded, monotone sequence converges.</div>
<div class="callout"><p><b>Example 7 — a recursive sequence.</b> a<sub>1</sub> = √2, a<sub>n+1</sub> = √(2 + a<sub>n</sub>). By induction a<sub>n</sub> &lt; 2 (if a<sub>n</sub> &lt; 2 then a<sub>n+1</sub> &lt; √4 = 2) and the sequence increases (a<sub>n+1</sub><sup>2</sup> − a<sub>n</sub><sup>2</sup> = 2 + a<sub>n</sub> − a<sub>n</sub><sup>2</sup> = (2 − a<sub>n</sub>)(1 + a<sub>n</sub>) &gt; 0). So it converges to some L, and L = √(2 + L) ⇒ L<sup>2</sup> − L − 2 = 0 ⇒ <b>L = 2</b> (L = −1 is impossible). Numerically a<sub>9</sub> ≈ 1.99999.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Solving L = √(2 + L) <em>before</em> proving convergence — the equation is only valid if the limit exists.</li><li>Applying L'Hôpital directly to a<sub>n</sub> (n is an integer); apply it to f(x).</li><li>Thinking “terms get closer together” means convergence: ln n has a<sub>n+1</sub> − a<sub>n</sub> → 0 but diverges to ∞.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Converges = has a finite limit.</li><li>Use function limits, L'Hôpital on f(x), squeeze.</li><li>r<sup>n</sup>: converges for −1 &lt; r ≤ 1.</li><li>Bounded + monotone ⇒ convergent; then solve L = g(L).</li><li>Growth ranking: ln n ≪ n<sup>p</sup> ≪ b<sup>n</sup> ≪ n! ≪ n<sup>n</sup>.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS2 + '5-1-sequences', 'OpenStax Vol. 2 — 5.1 Sequences') + `</li><li>` + A(PN2 + 'Sequences.aspx', "Paul's Online Notes — Sequences") + `</li><li>` + A(PN2 + 'MoreSequences.aspx', "Paul's Online Notes — More on Sequences") + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>lim (n<sup>2</sup>)/(e<sup>n</sup>).</li><li>Does a<sub>n</sub> = cos(nπ)·n/(n + 1) converge?</li><li>lim n<sup>1/n</sup>. (Hint: take ln.)</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) L'Hôpital twice on x<sup>2</sup>/e<sup>x</sup>: <b>0</b>. 2) cos(nπ) = (−1)<sup>n</sup> and n/(n + 1) → 1, so terms approach ±1 alternately: <b>diverges</b>. 3) ln a<sub>n</sub> = ln n/n → 0, so a<sub>n</sub> → e<sup>0</sup> = <b>1</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 4 · Bài 4.1</span>
<h2>Dãy số: giới hạn, dãy đơn điệu và bị chặn</h2>
<p class="lead"><strong>Dãy số</strong> là một danh sách vô hạn có thứ tự a<sub>1</sub>, a<sub>2</sub>, a<sub>3</sub>, … — các đầu ra liên tiếp của một thuật toán, số dư tài khoản từng tháng, các xấp xỉ của phương pháp Newton. Câu hỏi trung tâm: danh sách đó có <strong>ổn định</strong> về một số không?</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính giới hạn của dãy bằng giới hạn hàm số, L'Hôpital và định lý kẹp.</li><li>Biết khi nào r<sup>n</sup> hội tụ.</li><li>Dùng định lý dãy đơn điệu bị chặn cho dãy truy hồi.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Ta viết lim<sub>n→∞</sub> a<sub>n</sub> = L nếu a<sub>n</sub> gần L tuỳ ý với mọi n đủ lớn. Nếu giới hạn tồn tại, dãy <strong>hội tụ</strong>; ngược lại dãy <strong>phân kỳ</strong>.</p>
<div class="formula"><span class="lbl">Công cụ chính</span>• Nếu a<sub>n</sub> = f(n) và lim<sub>x→∞</sub> f(x) = L thì a<sub>n</sub> → L (nên được dùng L'Hôpital cho f).<br>• Kẹp: b<sub>n</sub> ≤ a<sub>n</sub> ≤ c<sub>n</sub> và b<sub>n</sub>, c<sub>n</sub> → L ⇒ a<sub>n</sub> → L.<br>• r<sup>n</sup> hội tụ ⇔ −1 &lt; r ≤ 1 (giới hạn 0 nếu |r| &lt; 1, bằng 1 nếu r = 1).<br>• Nếu |a<sub>n</sub>| → 0 thì a<sub>n</sub> → 0.</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>1.</b> a<sub>n</sub> = (2n<sup>2</sup> + 1)/(3n<sup>2</sup> − n): chia cho n<sup>2</sup> ⇒ (2 + 1/n<sup>2</sup>)/(3 − 1/n) → <b>2/3</b>.</p>
<p><b>2.</b> a<sub>n</sub> = ln n / n: f(x) = ln x/x, L'Hôpital: (1/x)/1 → 0, nên a<sub>n</sub> → <b>0</b>.</p>
<p><b>3.</b> a<sub>n</sub> = sin n / n: −1/n ≤ a<sub>n</sub> ≤ 1/n, kẹp ⇒ <b>0</b>.</p>
<p><b>4.</b> a<sub>n</sub> = (1 + 3/n)<sup>n</sup> → <b>e<sup>3</sup></b> (giới hạn chuẩn (1 + x/n)<sup>n</sup> → e<sup>x</sup>).</p>
<p><b>5.</b> a<sub>n</sub> = (−1)<sup>n</sup>: nhảy qua lại giữa −1 và 1, <b>phân kỳ</b>. Nhưng (−1)<sup>n</sup>/n → 0 vì giá trị tuyệt đối → 0.</p>
<p><b>6.</b> a<sub>n</sub> = n!/n<sup>n</sup> = (1/n)(2/n)⋯(n/n) ≤ 1/n ⇒ kẹp cho <b>0</b>: n<sup>n</sup> tăng nhanh hơn n! rất nhiều.</p></div>
<h3>📖 Đơn điệu và bị chặn</h3>
<p>Dãy <strong>tăng</strong> nếu a<sub>n</sub> ≤ a<sub>n+1</sub> với mọi n, <strong>bị chặn trên</strong> nếu a<sub>n</sub> ≤ M với mọi n.</p>
<div class="formula"><span class="lbl">Định lý dãy đơn điệu</span>Mọi dãy đơn điệu và bị chặn đều hội tụ.</div>
<div class="callout"><p><b>Ví dụ 7 — dãy truy hồi.</b> a<sub>1</sub> = √2, a<sub>n+1</sub> = √(2 + a<sub>n</sub>). Quy nạp: a<sub>n</sub> &lt; 2 (nếu a<sub>n</sub> &lt; 2 thì a<sub>n+1</sub> &lt; √4 = 2) và dãy tăng (a<sub>n+1</sub><sup>2</sup> − a<sub>n</sub><sup>2</sup> = 2 + a<sub>n</sub> − a<sub>n</sub><sup>2</sup> = (2 − a<sub>n</sub>)(1 + a<sub>n</sub>) &gt; 0). Vậy dãy hội tụ về L nào đó, và L = √(2 + L) ⇒ L<sup>2</sup> − L − 2 = 0 ⇒ <b>L = 2</b> (L = −1 không thể). Tính số: a<sub>9</sub> ≈ 1,99999.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Giải L = √(2 + L) <em>trước khi</em> chứng minh hội tụ — phương trình chỉ đúng nếu giới hạn tồn tại.</li><li>Dùng L'Hôpital trực tiếp cho a<sub>n</sub> (n là số nguyên); phải dùng cho f(x).</li><li>Nghĩ “các số hạng xích lại gần nhau” là hội tụ: ln n có a<sub>n+1</sub> − a<sub>n</sub> → 0 nhưng vẫn tiến ra ∞.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Hội tụ = có giới hạn hữu hạn.</li><li>Dùng giới hạn hàm, L'Hôpital trên f(x), định lý kẹp.</li><li>r<sup>n</sup>: hội tụ khi −1 &lt; r ≤ 1.</li><li>Bị chặn + đơn điệu ⇒ hội tụ; rồi giải L = g(L).</li><li>Thứ tự tăng: ln n ≪ n<sup>p</sup> ≪ b<sup>n</sup> ≪ n! ≪ n<sup>n</sup>.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS2 + '5-1-sequences', 'OpenStax Vol. 2 — 5.1 Dãy số') + `</li><li>` + A(PN2 + 'Sequences.aspx', "Paul's Online Notes — Sequences") + `</li><li>` + A(PN2 + 'MoreSequences.aspx', "Paul's Online Notes — More on Sequences") + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>lim (n<sup>2</sup>)/(e<sup>n</sup>).</li><li>a<sub>n</sub> = cos(nπ)·n/(n + 1) có hội tụ không?</li><li>lim n<sup>1/n</sup>. (Gợi ý: lấy ln.)</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) L'Hôpital hai lần cho x<sup>2</sup>/e<sup>x</sup>: <b>0</b>. 2) cos(nπ) = (−1)<sup>n</sup> và n/(n + 1) → 1, nên số hạng tiến về ±1 xen kẽ: <b>phân kỳ</b>. 3) ln a<sub>n</sub> = ln n/n → 0, nên a<sub>n</sub> → e<sup>0</sup> = <b>1</b>.</p></div>`);

const c42 = L('cal121-ts-4-2',
  '4.2 — Infinite series: partial sums, geometric and telescoping series, divergence test|||4.2 — Chuỗi số: tổng riêng, chuỗi hình học, chuỗi lồng nhau, tiêu chuẩn phân kỳ',
  'Chuỗi = giới hạn dãy tổng riêng; chuỗi hình học Σarⁿ hội tụ khi |r| < 1 (0,999… = 1, số thập phân tuần hoàn), chuỗi lồng nhau Σ1/(n(n+1)) = 1, chuỗi điều hoà phân kỳ, tiêu chuẩn phân kỳ.',
  `<span class="eyebrow">CAL121 · Chapter 4 · Lesson 4.2</span>
<h2>Infinite series</h2>
<p class="lead">Can you add infinitely many numbers and get a finite answer? Zeno's paradox says 1/2 + 1/4 + 1/8 + … should never finish; calculus says it equals exactly 1. The key is to define the sum as a <strong>limit of partial sums</strong>.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define convergence of a series through its partial sums.</li><li>Sum geometric and telescoping series.</li><li>Use the divergence (n-th term) test correctly — and know what it cannot do.</li></ul>
<h3>📖 Lecture</h3>
<p>For a series ∑ a<sub>n</sub>, the <strong>n-th partial sum</strong> is s<sub>n</sub> = a<sub>1</sub> + ⋯ + a<sub>n</sub>. If s<sub>n</sub> → S (finite), the series <strong>converges</strong> with sum S; otherwise it <strong>diverges</strong>.</p>
<div class="formula"><span class="lbl">Geometric series</span>∑<sub>n=0</sub><sup>∞</sup> a r<sup>n</sup> = a + ar + ar<sup>2</sup> + ⋯ = a/(1 − r)  if |r| &lt; 1;  diverges if |r| ≥ 1 (a ≠ 0)</div>
<p>Proof idea: s<sub>n</sub> = a(1 − r<sup>n+1</sup>)/(1 − r), and r<sup>n+1</sup> → 0 exactly when |r| &lt; 1. Remember: <em>sum = first term / (1 − ratio)</em>.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>1.</b> ∑<sub>n=0</sub><sup>∞</sup> 5(−2/3)<sup>n</sup>: a = 5, r = −2/3 ⇒ 5/(1 + 2/3) = <b>3</b>.</p>
<p><b>2 — repeating decimals.</b> 0.272727… = 27/100 + 27/100<sup>2</sup> + ⋯ = (27/100)/(1 − 1/100) = 27/99 = <b>3/11</b>. Likewise 0.999… = (9/10)/(1 − 1/10) = 1 exactly.</p>
<p><b>3 — telescoping.</b> ∑<sub>n=1</sub><sup>∞</sup> 1/(n(n + 1)): partial fractions 1/n − 1/(n + 1). s<sub>n</sub> = (1 − 1/2) + (1/2 − 1/3) + ⋯ + (1/n − 1/(n + 1)) = 1 − 1/(n + 1) → <b>1</b>.</p>
<p><b>4 — the harmonic series</b> ∑ 1/n diverges, even though 1/n → 0. Group terms: 1 + 1/2 + (1/3 + 1/4) + (1/5 + ⋯ + 1/8) + ⋯ ≥ 1 + 1/2 + 1/2 + 1/2 + ⋯ → ∞. It grows like ln n: after a million terms it is only about 14.39.</p></div>
<div class="formula"><span class="lbl">Divergence test</span>If lim a<sub>n</sub> ≠ 0 (or does not exist), then ∑ a<sub>n</sub> diverges.<br>If lim a<sub>n</sub> = 0, the test says <strong>nothing</strong>.</div>
<div class="callout"><p><b>5.</b> ∑ n/(2n + 1): terms → 1/2 ≠ 0 ⇒ <b>diverges</b>. <b>6.</b> ∑ 1/n: terms → 0, test inconclusive — and the series actually diverges (Example 4).</p></div>
<p><b>Algebra of series.</b> If ∑a<sub>n</sub> and ∑b<sub>n</sub> converge, so do ∑(a<sub>n</sub> ± b<sub>n</sub>) and ∑ca<sub>n</sub>, with the obvious sums. Removing finitely many terms never changes convergence (it may change the sum).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>“a<sub>n</sub> → 0, so the series converges.” False (harmonic series).</li><li>Using a/(1 − r) with the wrong first term: ∑<sub>n=1</sub><sup>∞</sup> (1/2)<sup>n</sup> starts at 1/2, so the sum is 1, not 2.</li><li>Confusing the sequence of terms a<sub>n</sub> with the sequence of partial sums s<sub>n</sub>.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>∑a<sub>n</sub> = lim s<sub>n</sub>.</li><li>Geometric: a/(1 − r) when |r| &lt; 1.</li><li>Telescoping: write the partial sum, watch the cancellations.</li><li>Divergence test only proves divergence.</li><li>Harmonic series diverges (slowly, like ln n).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS2 + '5-2-infinite-series', 'OpenStax Vol. 2 — 5.2 Infinite Series') + `</li><li>` + A(PN2 + 'Series_Basics.aspx', "Paul's Online Notes — Series: The Basics") + `</li><li>` + A(PN2 + 'Series_Special.aspx', "Paul's Online Notes — Special Series (geometric, telescoping, harmonic)") + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>∑<sub>n=0</sub><sup>∞</sup> 2<sup>n</sup>/3<sup>n+1</sup>.</li><li>∑<sub>n=1</sub><sup>∞</sup> 1/(n<sup>2</sup> + 3n + 2).</li><li>∑<sub>n=1</sub><sup>∞</sup> (1 + 1/n)<sup>n</sup>: converge or diverge?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) First term 1/3, ratio 2/3 ⇒ (1/3)/(1/3) = <b>1</b>. 2) 1/((n + 1)(n + 2)) = 1/(n + 1) − 1/(n + 2), telescopes to <b>1/2</b>. 3) Terms → e ≠ 0 ⇒ <b>diverges</b> by the divergence test.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 4 · Bài 4.2</span>
<h2>Chuỗi số</h2>
<p class="lead">Cộng vô hạn số có ra một kết quả hữu hạn không? Nghịch lý Zeno nói 1/2 + 1/4 + 1/8 + … không bao giờ xong; giải tích nói nó bằng đúng 1. Mấu chốt là định nghĩa tổng như <strong>giới hạn của dãy tổng riêng</strong>.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa sự hội tụ của chuỗi qua tổng riêng.</li><li>Tính tổng chuỗi hình học và chuỗi lồng nhau (telescoping).</li><li>Dùng đúng tiêu chuẩn phân kỳ (số hạng thứ n) — và biết nó không làm được gì.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Với chuỗi ∑ a<sub>n</sub>, <strong>tổng riêng thứ n</strong> là s<sub>n</sub> = a<sub>1</sub> + ⋯ + a<sub>n</sub>. Nếu s<sub>n</sub> → S (hữu hạn), chuỗi <strong>hội tụ</strong> với tổng S; ngược lại chuỗi <strong>phân kỳ</strong>.</p>
<div class="formula"><span class="lbl">Chuỗi hình học</span>∑<sub>n=0</sub><sup>∞</sup> a r<sup>n</sup> = a + ar + ar<sup>2</sup> + ⋯ = a/(1 − r)  nếu |r| &lt; 1;  phân kỳ nếu |r| ≥ 1 (a ≠ 0)</div>
<p>Ý chứng minh: s<sub>n</sub> = a(1 − r<sup>n+1</sup>)/(1 − r), và r<sup>n+1</sup> → 0 đúng khi |r| &lt; 1. Nhớ: <em>tổng = số hạng đầu / (1 − công bội)</em>.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>1.</b> ∑<sub>n=0</sub><sup>∞</sup> 5(−2/3)<sup>n</sup>: a = 5, r = −2/3 ⇒ 5/(1 + 2/3) = <b>3</b>.</p>
<p><b>2 — số thập phân tuần hoàn.</b> 0,272727… = 27/100 + 27/100<sup>2</sup> + ⋯ = (27/100)/(1 − 1/100) = 27/99 = <b>3/11</b>. Tương tự 0,999… = (9/10)/(1 − 1/10) = 1 chính xác.</p>
<p><b>3 — chuỗi lồng nhau.</b> ∑<sub>n=1</sub><sup>∞</sup> 1/(n(n + 1)): phân thức 1/n − 1/(n + 1). s<sub>n</sub> = (1 − 1/2) + (1/2 − 1/3) + ⋯ + (1/n − 1/(n + 1)) = 1 − 1/(n + 1) → <b>1</b>.</p>
<p><b>4 — chuỗi điều hoà</b> ∑ 1/n phân kỳ, dù 1/n → 0. Nhóm số hạng: 1 + 1/2 + (1/3 + 1/4) + (1/5 + ⋯ + 1/8) + ⋯ ≥ 1 + 1/2 + 1/2 + 1/2 + ⋯ → ∞. Nó tăng như ln n: sau một triệu số hạng chỉ mới khoảng 14,39.</p></div>
<div class="formula"><span class="lbl">Tiêu chuẩn phân kỳ</span>Nếu lim a<sub>n</sub> ≠ 0 (hoặc không tồn tại) thì ∑ a<sub>n</sub> phân kỳ.<br>Nếu lim a<sub>n</sub> = 0, tiêu chuẩn <strong>không kết luận gì</strong>.</div>
<div class="callout"><p><b>5.</b> ∑ n/(2n + 1): số hạng → 1/2 ≠ 0 ⇒ <b>phân kỳ</b>. <b>6.</b> ∑ 1/n: số hạng → 0, tiêu chuẩn không kết luận — và chuỗi thực ra phân kỳ (Ví dụ 4).</p></div>
<p><b>Đại số chuỗi.</b> Nếu ∑a<sub>n</sub> và ∑b<sub>n</sub> hội tụ thì ∑(a<sub>n</sub> ± b<sub>n</sub>) và ∑ca<sub>n</sub> cũng hội tụ, với tổng tương ứng. Bỏ đi hữu hạn số hạng không bao giờ đổi tính hội tụ (có thể đổi tổng).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>“a<sub>n</sub> → 0 nên chuỗi hội tụ.” Sai (chuỗi điều hoà).</li><li>Dùng a/(1 − r) với sai số hạng đầu: ∑<sub>n=1</sub><sup>∞</sup> (1/2)<sup>n</sup> bắt đầu từ 1/2, nên tổng bằng 1, không phải 2.</li><li>Nhầm dãy số hạng a<sub>n</sub> với dãy tổng riêng s<sub>n</sub>.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>∑a<sub>n</sub> = lim s<sub>n</sub>.</li><li>Hình học: a/(1 − r) khi |r| &lt; 1.</li><li>Lồng nhau: viết tổng riêng, xem các số hạng triệt tiêu.</li><li>Tiêu chuẩn phân kỳ chỉ chứng minh được phân kỳ.</li><li>Chuỗi điều hoà phân kỳ (chậm, như ln n).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS2 + '5-2-infinite-series', 'OpenStax Vol. 2 — 5.2 Chuỗi vô hạn') + `</li><li>` + A(PN2 + 'Series_Basics.aspx', "Paul's Online Notes — Series: The Basics") + `</li><li>` + A(PN2 + 'Series_Special.aspx', "Paul's Online Notes — Chuỗi đặc biệt (hình học, lồng nhau, điều hoà)") + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>∑<sub>n=0</sub><sup>∞</sup> 2<sup>n</sup>/3<sup>n+1</sup>.</li><li>∑<sub>n=1</sub><sup>∞</sup> 1/(n<sup>2</sup> + 3n + 2).</li><li>∑<sub>n=1</sub><sup>∞</sup> (1 + 1/n)<sup>n</sup>: hội tụ hay phân kỳ?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Số hạng đầu 1/3, công bội 2/3 ⇒ (1/3)/(1/3) = <b>1</b>. 2) 1/((n + 1)(n + 2)) = 1/(n + 1) − 1/(n + 2), lồng nhau ra <b>1/2</b>. 3) Số hạng → e ≠ 0 ⇒ <b>phân kỳ</b> theo tiêu chuẩn phân kỳ.</p></div>`);

const c43 = L('cal121-ts-4-3',
  '4.3 — The integral test, p-series and estimating sums|||4.3 — Tiêu chuẩn tích phân, chuỗi p và ước lượng tổng',
  'Tiêu chuẩn tích phân, chuỗi p hội tụ ⇔ p > 1, Σ1/(n ln n) phân kỳ, ước lượng phần dư bằng tích phân; code Python kẹp Σ1/n² giữa 1,6407 và 1,6498 (đúng π²/6).',
  `<span class="eyebrow">CAL121 · Chapter 4 · Lesson 4.3</span>
<h2>The integral test, p-series and estimating sums</h2>
<p class="lead">Most series cannot be summed exactly. The integral test connects a series to an improper integral (CAL111, Chapter 10) — telling us whether it converges <em>and</em> how far a partial sum is from the true sum.</p>
<h3>🎯 Objectives</h3>
<ul><li>Apply the integral test and check its hypotheses.</li><li>Know the p-series rule by heart.</li><li>Bound the remainder R<sub>n</sub> with integrals and use it to estimate a sum.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Integral test</span>If f is continuous, positive and decreasing on [1, ∞) and a<sub>n</sub> = f(n), then<br>∑<sub>n=1</sub><sup>∞</sup> a<sub>n</sub> converges ⇔ ∫<sub>1</sub><sup>∞</sup> f(x) dx converges.</div>
<p>Picture: the rectangles of height a<sub>2</sub>, a<sub>3</sub>, … fit <em>under</em> the curve, and the rectangles of height a<sub>1</sub>, a<sub>2</sub>, … stick out <em>above</em> it, so the series and the integral are finite or infinite together. The test does <strong>not</strong> say the sum equals the integral.</p>
<div class="formula"><span class="lbl">p-series</span>∑<sub>n=1</sub><sup>∞</sup> 1/n<sup>p</sup> converges ⇔ p &gt; 1.</div>
<p>Because ∫<sub>1</sub><sup>∞</sup> x<sup>−p</sup> dx is finite exactly when p &gt; 1 (the p-test from CAL111). So ∑1/n<sup>2</sup> and ∑1/n<sup>1.01</sup> converge, while ∑1/n and ∑1/√n diverge.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>1.</b> ∑ n e<sup>−n<sup>2</sup></sup>: f(x) = xe<sup>−x<sup>2</sup></sup> is positive and decreasing for x ≥ 1; ∫<sub>1</sub><sup>∞</sup> xe<sup>−x<sup>2</sup></sup> dx = 1/(2e) is finite ⇒ <b>converges</b>.</p>
<p><b>2.</b> ∑<sub>n=2</sub><sup>∞</sup> 1/(n ln n): ∫<sub>2</sub><sup>∞</sup> dx/(x ln x) = lim [ln(ln x)] = ∞ ⇒ <b>diverges</b> (even more slowly than the harmonic series). But ∑ 1/(n (ln n)<sup>2</sup>) converges: ∫<sub>2</sub><sup>∞</sup> dx/(x ln<sup>2</sup>x) = 1/ln 2.</p></div>
<h3>📖 Remainder estimate</h3>
<p>If ∑a<sub>n</sub> converges by the integral test with sum S, the error after n terms, R<sub>n</sub> = S − s<sub>n</sub>, satisfies</p>
<div class="formula"><span class="lbl">Integral bounds for the remainder</span>∫<sub>n+1</sub><sup>∞</sup> f(x) dx ≤ R<sub>n</sub> ≤ ∫<sub>n</sub><sup>∞</sup> f(x) dx    ⇒    s<sub>n</sub> + ∫<sub>n+1</sub><sup>∞</sup> f ≤ S ≤ s<sub>n</sub> + ∫<sub>n</sub><sup>∞</sup> f</div>
<div class="callout"><p><b>Example 3 — ∑1/n<sup>2</sup> with 10 terms.</b> ∫<sub>N</sub><sup>∞</sup> dx/x<sup>2</sup> = 1/N, so s<sub>10</sub> + 1/11 ≤ S ≤ s<sub>10</sub> + 1/10.</p></div>
` + PSERIES_PY + `
<p>Ten terms alone are off by 0.095, but ten terms plus the integral correction trap the sum in an interval of width 0.009, and the midpoint is within 0.0003 of Euler's famous value π<sup>2</sup>/6.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting to check that f is decreasing (at least eventually).</li><li>Claiming ∑a<sub>n</sub> = ∫f(x)dx: the test only compares convergence.</li><li>Mixing up p-series ∑1/n<sup>p</sup> (needs p &gt; 1) with geometric ∑r<sup>n</sup> (needs |r| &lt; 1).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Positive, continuous, decreasing f: series and integral behave alike.</li><li>∑1/n<sup>p</sup> converges ⇔ p &gt; 1.</li><li>∫<sub>n+1</sub><sup>∞</sup>f ≤ R<sub>n</sub> ≤ ∫<sub>n</sub><sup>∞</sup>f.</li><li>∑1/n<sup>2</sup> = π<sup>2</sup>/6 ≈ 1.6449.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS2 + '5-3-the-divergence-and-integral-tests', 'OpenStax Vol. 2 — 5.3 The Divergence and Integral Tests') + `</li><li>` + A(PN2 + 'IntegralTest.aspx', "Paul's Online Notes — Integral Test") + `</li><li>` + A(PN2 + 'EstimatingSeries.aspx', "Paul's Online Notes — Estimating the Value of a Series") + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>Converge or diverge: ∑ 1/n<sup>0.9</sup>, ∑ 1/(n√n), ∑ 3/n<sup>4</sup>.</li><li>Use the integral test on ∑ 1/(n<sup>2</sup> + 1).</li><li>How many terms of ∑1/n<sup>2</sup> guarantee R<sub>n</sub> ≤ 0.001 (using R<sub>n</sub> ≤ 1/n)?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) p = 0.9: <b>diverges</b>; p = 1.5: <b>converges</b>; p = 4: <b>converges</b>. 2) ∫<sub>1</sub><sup>∞</sup> dx/(1 + x<sup>2</sup>) = π/2 − π/4 = π/4 finite ⇒ <b>converges</b>. 3) 1/n ≤ 0.001 ⇒ <b>n ≥ 1000</b> (that is why the integral correction is so valuable).</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 4 · Bài 4.3</span>
<h2>Tiêu chuẩn tích phân, chuỗi p và ước lượng tổng</h2>
<p class="lead">Đa số chuỗi không tính được tổng chính xác. Tiêu chuẩn tích phân nối chuỗi với tích phân suy rộng (CAL111, Chương 10) — cho biết chuỗi có hội tụ không <em>và</em> tổng riêng còn cách tổng thật bao xa.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp dụng tiêu chuẩn tích phân và kiểm các giả thiết.</li><li>Thuộc lòng quy tắc chuỗi p.</li><li>Chặn phần dư R<sub>n</sub> bằng tích phân và dùng nó để ước lượng tổng.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Tiêu chuẩn tích phân</span>Nếu f liên tục, dương, giảm trên [1, ∞) và a<sub>n</sub> = f(n) thì<br>∑<sub>n=1</sub><sup>∞</sup> a<sub>n</sub> hội tụ ⇔ ∫<sub>1</sub><sup>∞</sup> f(x) dx hội tụ.</div>
<p>Hình dung: các hình chữ nhật cao a<sub>2</sub>, a<sub>3</sub>, … nằm <em>dưới</em> đường cong, còn các hình chữ nhật cao a<sub>1</sub>, a<sub>2</sub>, … nhô <em>lên trên</em>, nên chuỗi và tích phân cùng hữu hạn hoặc cùng vô hạn. Tiêu chuẩn <strong>không</strong> nói tổng bằng tích phân.</p>
<div class="formula"><span class="lbl">Chuỗi p</span>∑<sub>n=1</sub><sup>∞</sup> 1/n<sup>p</sup> hội tụ ⇔ p &gt; 1.</div>
<p>Vì ∫<sub>1</sub><sup>∞</sup> x<sup>−p</sup> dx hữu hạn đúng khi p &gt; 1 (tiêu chuẩn p ở CAL111). Vậy ∑1/n<sup>2</sup> và ∑1/n<sup>1,01</sup> hội tụ, còn ∑1/n và ∑1/√n phân kỳ.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>1.</b> ∑ n e<sup>−n<sup>2</sup></sup>: f(x) = xe<sup>−x<sup>2</sup></sup> dương và giảm khi x ≥ 1; ∫<sub>1</sub><sup>∞</sup> xe<sup>−x<sup>2</sup></sup> dx = 1/(2e) hữu hạn ⇒ <b>hội tụ</b>.</p>
<p><b>2.</b> ∑<sub>n=2</sub><sup>∞</sup> 1/(n ln n): ∫<sub>2</sub><sup>∞</sup> dx/(x ln x) = lim [ln(ln x)] = ∞ ⇒ <b>phân kỳ</b> (còn chậm hơn chuỗi điều hoà). Nhưng ∑ 1/(n (ln n)<sup>2</sup>) hội tụ: ∫<sub>2</sub><sup>∞</sup> dx/(x ln<sup>2</sup>x) = 1/ln 2.</p></div>
<h3>📖 Ước lượng phần dư</h3>
<p>Nếu ∑a<sub>n</sub> hội tụ theo tiêu chuẩn tích phân với tổng S, sai số sau n số hạng R<sub>n</sub> = S − s<sub>n</sub> thoả</p>
<div class="formula"><span class="lbl">Chặn phần dư bằng tích phân</span>∫<sub>n+1</sub><sup>∞</sup> f(x) dx ≤ R<sub>n</sub> ≤ ∫<sub>n</sub><sup>∞</sup> f(x) dx    ⇒    s<sub>n</sub> + ∫<sub>n+1</sub><sup>∞</sup> f ≤ S ≤ s<sub>n</sub> + ∫<sub>n</sub><sup>∞</sup> f</div>
<div class="callout"><p><b>Ví dụ 3 — ∑1/n<sup>2</sup> với 10 số hạng.</b> ∫<sub>N</sub><sup>∞</sup> dx/x<sup>2</sup> = 1/N, nên s<sub>10</sub> + 1/11 ≤ S ≤ s<sub>10</sub> + 1/10.</p></div>
` + PSERIES_PY + `
<p>Riêng mười số hạng lệch 0,095, nhưng mười số hạng cộng phần hiệu chỉnh tích phân kẹp tổng trong khoảng rộng 0,009, và trung điểm cách giá trị nổi tiếng π<sup>2</sup>/6 của Euler chưa tới 0,0003.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên kiểm f giảm (ít nhất là từ một lúc nào đó).</li><li>Khẳng định ∑a<sub>n</sub> = ∫f(x)dx: tiêu chuẩn chỉ so sánh tính hội tụ.</li><li>Nhầm chuỗi p ∑1/n<sup>p</sup> (cần p &gt; 1) với chuỗi hình học ∑r<sup>n</sup> (cần |r| &lt; 1).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>f dương, liên tục, giảm: chuỗi và tích phân cùng tính chất.</li><li>∑1/n<sup>p</sup> hội tụ ⇔ p &gt; 1.</li><li>∫<sub>n+1</sub><sup>∞</sup>f ≤ R<sub>n</sub> ≤ ∫<sub>n</sub><sup>∞</sup>f.</li><li>∑1/n<sup>2</sup> = π<sup>2</sup>/6 ≈ 1,6449.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS2 + '5-3-the-divergence-and-integral-tests', 'OpenStax Vol. 2 — 5.3 Tiêu chuẩn phân kỳ và tiêu chuẩn tích phân') + `</li><li>` + A(PN2 + 'IntegralTest.aspx', "Paul's Online Notes — Integral Test") + `</li><li>` + A(PN2 + 'EstimatingSeries.aspx', "Paul's Online Notes — Ước lượng tổng của chuỗi") + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Hội tụ hay phân kỳ: ∑ 1/n<sup>0,9</sup>, ∑ 1/(n√n), ∑ 3/n<sup>4</sup>.</li><li>Dùng tiêu chuẩn tích phân cho ∑ 1/(n<sup>2</sup> + 1).</li><li>Cần bao nhiêu số hạng của ∑1/n<sup>2</sup> để chắc R<sub>n</sub> ≤ 0,001 (dùng R<sub>n</sub> ≤ 1/n)?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) p = 0,9: <b>phân kỳ</b>; p = 1,5: <b>hội tụ</b>; p = 4: <b>hội tụ</b>. 2) ∫<sub>1</sub><sup>∞</sup> dx/(1 + x<sup>2</sup>) = π/2 − π/4 = π/4 hữu hạn ⇒ <b>hội tụ</b>. 3) 1/n ≤ 0,001 ⇒ <b>n ≥ 1000</b> (vì thế phần hiệu chỉnh tích phân rất đáng giá).</p></div>`);

const c44 = L('cal121-ts-4-4',
  '4.4 — The comparison and limit comparison tests|||4.4 — Tiêu chuẩn so sánh và so sánh giới hạn',
  'So sánh trực tiếp với chuỗi p/chuỗi hình học đã biết; so sánh giới hạn lim aₙ/bₙ = c > 0; cách chọn chuỗi so sánh bằng “số hạng trội”; ví dụ Σ1/(n²+1), Σln n/n, Σsin(1/n).',
  `<span class="eyebrow">CAL121 · Chapter 4 · Lesson 4.4</span>
<h2>The comparison and limit comparison tests</h2>
<p class="lead">Most series look “almost like” a series we already know. 1/(n<sup>2</sup> + 1) is almost 1/n<sup>2</sup>; (2n<sup>2</sup> + 3n)/√(n<sup>5</sup> + 5) is almost 2/√n. Comparison tests turn “almost like” into a proof.</p>
<h3>🎯 Objectives</h3>
<ul><li>Apply the direct comparison test with the inequality in the correct direction.</li><li>Apply the limit comparison test using dominant terms.</li><li>Choose a good comparison series (p-series or geometric).</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Direct comparison (positive terms)</span>If 0 ≤ a<sub>n</sub> ≤ b<sub>n</sub> for all large n:<br>∑b<sub>n</sub> converges ⇒ ∑a<sub>n</sub> converges (smaller than finite is finite)<br>∑a<sub>n</sub> diverges ⇒ ∑b<sub>n</sub> diverges (bigger than infinite is infinite)</div>
<div class="formula"><span class="lbl">Limit comparison (positive terms)</span>If lim a<sub>n</sub>/b<sub>n</sub> = c with 0 &lt; c &lt; ∞, then ∑a<sub>n</sub> and ∑b<sub>n</sub> both converge or both diverge.</div>
<p><b>Choosing b<sub>n</sub>:</b> keep only the <em>dominant</em> power in numerator and denominator. That usually gives a p-series or a geometric series.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>1.</b> ∑ 1/(n<sup>2</sup> + 1): 1/(n<sup>2</sup> + 1) ≤ 1/n<sup>2</sup>, and ∑1/n<sup>2</sup> converges ⇒ <b>converges</b>.</p>
<p><b>2.</b> ∑ 1/(2<sup>n</sup> + 1): ≤ (1/2)<sup>n</sup>, geometric with r = 1/2 ⇒ <b>converges</b> (sum less than 1).</p>
<p><b>3.</b> ∑ ln n / n: for n ≥ 3, ln n &gt; 1 so ln n / n &gt; 1/n, and the harmonic series diverges ⇒ <b>diverges</b>.</p>
<p><b>4 — limit comparison.</b> ∑ (2n<sup>2</sup> + 3n)/√(n<sup>5</sup> + 5). Dominant terms: 2n<sup>2</sup>/n<sup>5/2</sup> = 2/n<sup>1/2</sup>, so take b<sub>n</sub> = 1/√n. lim a<sub>n</sub>/b<sub>n</sub> = lim (2n<sup>5/2</sup> + 3n<sup>3/2</sup>)/√(n<sup>5</sup> + 5) = 2, with 0 &lt; 2 &lt; ∞. ∑1/√n diverges (p = 1/2) ⇒ <b>diverges</b>.</p>
<p><b>5.</b> ∑ sin(1/n): compare with 1/n: lim sin(1/n)/(1/n) = 1 ⇒ <b>diverges</b>. Direct comparison would be awkward here; limit comparison is effortless.</p>
<p><b>6.</b> ∑ 1/(n<sup>2</sup> − n + 1): the inequality 1/(n<sup>2</sup> − n + 1) ≤ 1/n<sup>2</sup> is <em>false</em> — but limit comparison with 1/n<sup>2</sup> gives limit 1 ⇒ <b>converges</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Inequality in the useless direction: a<sub>n</sub> ≥ (something convergent) proves nothing; a<sub>n</sub> ≤ (something divergent) proves nothing.</li><li>Using comparison tests on series with negative terms (use absolute convergence, Lesson 5.2).</li><li>A limit of 0 or ∞ in limit comparison is inconclusive in general.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Direct: smaller than convergent ⇒ convergent; larger than divergent ⇒ divergent.</li><li>Limit: ratio → positive finite c ⇒ same behaviour.</li><li>Pick b<sub>n</sub> from dominant terms; compare with p-series or geometric series.</li><li>Comparison tests require positive terms.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS2 + '5-4-comparison-tests', 'OpenStax Vol. 2 — 5.4 Comparison Tests') + `</li><li>` + A(PN2 + 'SeriesCompTest.aspx', "Paul's Online Notes — Comparison Test / Limit Comparison Test") + `</li><li>` + A(PN2 + 'ConvergenceOfSeries.aspx', "Paul's Online Notes — Convergence/Divergence of Series") + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>∑ 5/(3<sup>n</sup> + n).</li><li>∑ (n + 1)/(n<sup>3</sup> + 2).</li><li>∑ 1/√(n<sup>2</sup> + 1).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) ≤ 5/3<sup>n</sup>, geometric r = 1/3 ⇒ <b>converges</b>. 2) Limit comparison with 1/n<sup>2</sup>: ratio → 1 ⇒ <b>converges</b>. 3) Limit comparison with 1/n: ratio → 1 ⇒ <b>diverges</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 4 · Bài 4.4</span>
<h2>Tiêu chuẩn so sánh và so sánh giới hạn</h2>
<p class="lead">Hầu hết chuỗi trông “gần giống” một chuỗi ta đã biết. 1/(n<sup>2</sup> + 1) gần như 1/n<sup>2</sup>; (2n<sup>2</sup> + 3n)/√(n<sup>5</sup> + 5) gần như 2/√n. Các tiêu chuẩn so sánh biến “gần giống” thành một chứng minh.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp dụng tiêu chuẩn so sánh trực tiếp với bất đẳng thức đúng chiều.</li><li>Áp dụng tiêu chuẩn so sánh giới hạn bằng số hạng trội.</li><li>Chọn chuỗi so sánh tốt (chuỗi p hoặc chuỗi hình học).</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">So sánh trực tiếp (số hạng dương)</span>Nếu 0 ≤ a<sub>n</sub> ≤ b<sub>n</sub> với mọi n đủ lớn:<br>∑b<sub>n</sub> hội tụ ⇒ ∑a<sub>n</sub> hội tụ (nhỏ hơn hữu hạn thì hữu hạn)<br>∑a<sub>n</sub> phân kỳ ⇒ ∑b<sub>n</sub> phân kỳ (lớn hơn vô hạn thì vô hạn)</div>
<div class="formula"><span class="lbl">So sánh giới hạn (số hạng dương)</span>Nếu lim a<sub>n</sub>/b<sub>n</sub> = c với 0 &lt; c &lt; ∞ thì ∑a<sub>n</sub> và ∑b<sub>n</sub> cùng hội tụ hoặc cùng phân kỳ.</div>
<p><b>Chọn b<sub>n</sub>:</b> chỉ giữ luỹ thừa <em>trội</em> ở tử và mẫu. Thường ra một chuỗi p hoặc chuỗi hình học.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>1.</b> ∑ 1/(n<sup>2</sup> + 1): 1/(n<sup>2</sup> + 1) ≤ 1/n<sup>2</sup>, mà ∑1/n<sup>2</sup> hội tụ ⇒ <b>hội tụ</b>.</p>
<p><b>2.</b> ∑ 1/(2<sup>n</sup> + 1): ≤ (1/2)<sup>n</sup>, hình học với r = 1/2 ⇒ <b>hội tụ</b> (tổng nhỏ hơn 1).</p>
<p><b>3.</b> ∑ ln n / n: với n ≥ 3, ln n &gt; 1 nên ln n / n &gt; 1/n, mà chuỗi điều hoà phân kỳ ⇒ <b>phân kỳ</b>.</p>
<p><b>4 — so sánh giới hạn.</b> ∑ (2n<sup>2</sup> + 3n)/√(n<sup>5</sup> + 5). Số hạng trội: 2n<sup>2</sup>/n<sup>5/2</sup> = 2/n<sup>1/2</sup>, nên lấy b<sub>n</sub> = 1/√n. lim a<sub>n</sub>/b<sub>n</sub> = lim (2n<sup>5/2</sup> + 3n<sup>3/2</sup>)/√(n<sup>5</sup> + 5) = 2, với 0 &lt; 2 &lt; ∞. ∑1/√n phân kỳ (p = 1/2) ⇒ <b>phân kỳ</b>.</p>
<p><b>5.</b> ∑ sin(1/n): so với 1/n: lim sin(1/n)/(1/n) = 1 ⇒ <b>phân kỳ</b>. So sánh trực tiếp ở đây khá vướng; so sánh giới hạn thì nhẹ nhàng.</p>
<p><b>6.</b> ∑ 1/(n<sup>2</sup> − n + 1): bất đẳng thức 1/(n<sup>2</sup> − n + 1) ≤ 1/n<sup>2</sup> là <em>sai</em> — nhưng so sánh giới hạn với 1/n<sup>2</sup> cho giới hạn 1 ⇒ <b>hội tụ</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Bất đẳng thức sai chiều vô dụng: a<sub>n</sub> ≥ (chuỗi hội tụ) không chứng minh gì; a<sub>n</sub> ≤ (chuỗi phân kỳ) cũng không.</li><li>Dùng tiêu chuẩn so sánh cho chuỗi có số hạng âm (dùng hội tụ tuyệt đối, Bài 5.2).</li><li>Giới hạn bằng 0 hoặc ∞ trong so sánh giới hạn nói chung không kết luận.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Trực tiếp: nhỏ hơn chuỗi hội tụ ⇒ hội tụ; lớn hơn chuỗi phân kỳ ⇒ phân kỳ.</li><li>Giới hạn: tỉ số → c dương hữu hạn ⇒ cùng tính chất.</li><li>Chọn b<sub>n</sub> từ số hạng trội; so với chuỗi p hoặc hình học.</li><li>Tiêu chuẩn so sánh cần số hạng dương.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS2 + '5-4-comparison-tests', 'OpenStax Vol. 2 — 5.4 Tiêu chuẩn so sánh') + `</li><li>` + A(PN2 + 'SeriesCompTest.aspx', "Paul's Online Notes — So sánh / so sánh giới hạn") + `</li><li>` + A(PN2 + 'ConvergenceOfSeries.aspx', "Paul's Online Notes — Hội tụ/phân kỳ của chuỗi") + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>∑ 5/(3<sup>n</sup> + n).</li><li>∑ (n + 1)/(n<sup>3</sup> + 2).</li><li>∑ 1/√(n<sup>2</sup> + 1).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) ≤ 5/3<sup>n</sup>, hình học r = 1/3 ⇒ <b>hội tụ</b>. 2) So sánh giới hạn với 1/n<sup>2</sup>: tỉ số → 1 ⇒ <b>hội tụ</b>. 3) So sánh giới hạn với 1/n: tỉ số → 1 ⇒ <b>phân kỳ</b>.</p></div>`);

const q4 = QZ(4, 'Quiz — Chapter 4: Sequences and series|||Quiz — Chương 4: Dãy và chuỗi', 'Kiểm tra chương 4: giới hạn dãy, dãy đơn điệu bị chặn, chuỗi hình học, chuỗi lồng nhau, tiêu chuẩn phân kỳ, tích phân, chuỗi p, so sánh.', [
  Q('q1', 'lim (1 + 3/n)ⁿ =|||lim (1 + 3/n)ⁿ =',
    ['1|||1', '3|||3', 'e³|||e³', '∞|||∞'], 2,
    '(1 + x/n)ⁿ → eˣ.|||(1 + x/n)ⁿ → eˣ.'),
  Q('q2', 'The sequence rⁿ converges exactly when|||Dãy rⁿ hội tụ khi và chỉ khi',
    ['−1 < r < 1|||−1 < r < 1', '−1 < r ≤ 1|||−1 < r ≤ 1', 'r ≥ 0|||r ≥ 0', '−1 ≤ r ≤ 1|||−1 ≤ r ≤ 1'], 1,
    'r = 1 gives the constant 1; r = −1 oscillates.|||r = 1 cho dãy hằng 1; r = −1 dao động.'),
  Q('q3', 'a₁ = √2, aₙ₊₁ = √(2 + aₙ) converges to|||a₁ = √2, aₙ₊₁ = √(2 + aₙ) hội tụ về',
    ['√2|||√2', '2|||2', '−1|||−1', '4|||4'], 1,
    'Increasing, bounded by 2; L = √(2 + L) gives L = 2.|||Tăng, bị chặn bởi 2; L = √(2 + L) cho L = 2.'),
  Q('q4', 'Σₙ₌₀^∞ 5(−2/3)ⁿ =|||Σₙ₌₀^∞ 5(−2/3)ⁿ =',
    ['15|||15', '3|||3', '5/3|||5/3', 'diverges|||phân kỳ'], 1,
    '5/(1 − (−2/3)) = 5/(5/3) = 3.|||5/(1 − (−2/3)) = 5/(5/3) = 3.'),
  Q('q5', 'Σₙ₌₁^∞ 1/(n(n + 1)) =|||Σₙ₌₁^∞ 1/(n(n + 1)) =',
    ['1/2|||1/2', '1|||1', 'ln 2|||ln 2', 'diverges|||phân kỳ'], 1,
    'Telescoping: sₙ = 1 − 1/(n + 1) → 1.|||Lồng nhau: sₙ = 1 − 1/(n + 1) → 1.'),
  Q('q6', 'If lim aₙ = 0, then Σaₙ|||Nếu lim aₙ = 0 thì Σaₙ',
    ['converges|||hội tụ', 'diverges|||phân kỳ', 'may converge or diverge|||có thể hội tụ hoặc phân kỳ', 'equals 0|||bằng 0'], 2,
    'Harmonic series: terms → 0 but it diverges; Σ1/n² converges.|||Chuỗi điều hoà: số hạng → 0 nhưng phân kỳ; Σ1/n² hội tụ.'),
  Q('q7', 'Which series converges?|||Chuỗi nào hội tụ?',
    ['Σ1/√n|||Σ1/√n', 'Σ1/n|||Σ1/n', 'Σ1/n^1.1|||Σ1/n^1,1', 'Σ1/n^0.99|||Σ1/n^0,99'], 2,
    'p-series converge exactly when p > 1.|||Chuỗi p hội tụ đúng khi p > 1.'),
  Q('q8', 'Σₙ₌₂^∞ 1/(n ln n)|||Σₙ₌₂^∞ 1/(n ln n)',
    ['converges to 1|||hội tụ về 1', 'converges|||hội tụ', 'diverges|||phân kỳ', 'test does not apply|||không dùng được tiêu chuẩn nào'], 2,
    '∫ dx/(x ln x) = ln(ln x) → ∞ (integral test).|||∫ dx/(x ln x) = ln(ln x) → ∞ (tiêu chuẩn tích phân).'),
  Q('q9', 'For Σ1/n², the integral test bound on the remainder after 10 terms is|||Với Σ1/n², chặn phần dư sau 10 số hạng theo tích phân là',
    ['1/11 ≤ R₁₀ ≤ 1/10|||1/11 ≤ R₁₀ ≤ 1/10', '1/100 ≤ R₁₀ ≤ 1/10|||1/100 ≤ R₁₀ ≤ 1/10', 'R₁₀ = 1/11|||R₁₀ = 1/11', 'R₁₀ ≤ 1/121|||R₁₀ ≤ 1/121'], 0,
    '∫ₙ^∞ dx/x² = 1/N; use N = 11 and N = 10.|||∫ₙ^∞ dx/x² = 1/N; dùng N = 11 và N = 10.'),
  Q('q10', 'By limit comparison with 1/√n, Σ(2n² + 3n)/√(n⁵ + 5)|||So sánh giới hạn với 1/√n, Σ(2n² + 3n)/√(n⁵ + 5)',
    ['converges|||hội tụ', 'diverges|||phân kỳ', 'is inconclusive|||không kết luận được', 'equals 2|||bằng 2'], 1,
    'Ratio → 2 ∈ (0, ∞) and Σ1/√n diverges.|||Tỉ số → 2 ∈ (0, ∞) và Σ1/√n phân kỳ.'),
]);

const ch4 = {
  title: 'Chapter 4 — Sequences and series: the first convergence tests|||Chương 4 — Dãy và chuỗi: các tiêu chuẩn hội tụ đầu tiên',
  description: 'Giới hạn dãy, dãy đơn điệu bị chặn, chuỗi hình học/lồng nhau/điều hoà, tiêu chuẩn phân kỳ, tiêu chuẩn tích phân và chuỗi p (code Python ước lượng π²/6), so sánh và so sánh giới hạn (Stewart 11.1–11.4 · OpenStax Vol.2 5.1–5.4).',
  lessons: [c41, c42, c43, c44, q4],
};

// ───────────────────────────── Chương 5 — Chuỗi (II): đan dấu, tỉ số, căn ─────────────────────────────
const c51 = L('cal121-ts-5-1',
  '5.1 — Alternating series and the alternating series estimate|||5.1 — Chuỗi đan dấu và ước lượng sai số chuỗi đan dấu',
  'Tiêu chuẩn chuỗi đan dấu (Leibniz): bₙ giảm và → 0; chuỗi điều hoà đan dấu = ln 2; ước lượng |Rₙ| ≤ bₙ₊₁; cần bao nhiêu số hạng để tính 1/e sai số < 0,001.',
  `<span class="eyebrow">CAL121 · Chapter 5 · Lesson 5.1</span>
<h2>Alternating series and the alternating series estimate</h2>
<p class="lead">The harmonic series 1 + 1/2 + 1/3 + ⋯ diverges. Flip every other sign — 1 − 1/2 + 1/3 − 1/4 + ⋯ — and it converges (to ln 2). Alternating signs create cancellation, and there is a simple test and a simple error bound for it.</p>
<h3>🎯 Objectives</h3>
<ul><li>Apply the Alternating Series Test (AST) and check both conditions.</li><li>Bound the error of a partial sum with the next term.</li><li>Decide how many terms are needed for a given accuracy.</li></ul>
<h3>📖 Lecture</h3>
<p>An <strong>alternating series</strong> has the form ∑(−1)<sup>n−1</sup>b<sub>n</sub> = b<sub>1</sub> − b<sub>2</sub> + b<sub>3</sub> − ⋯ with b<sub>n</sub> &gt; 0.</p>
<div class="formula"><span class="lbl">Alternating Series Test</span>If (i) b<sub>n+1</sub> ≤ b<sub>n</sub> for all large n (decreasing) and (ii) lim b<sub>n</sub> = 0, then ∑(−1)<sup>n−1</sup>b<sub>n</sub> converges.</div>
<p>Why: the partial sums zig-zag — s<sub>2</sub> &lt; s<sub>4</sub> &lt; s<sub>6</sub> &lt; ⋯ &lt; s<sub>5</sub> &lt; s<sub>3</sub> &lt; s<sub>1</sub> — and the gaps b<sub>n</sub> shrink to zero, so the even and odd partial sums squeeze onto one limit S. The same picture gives the error bound:</p>
<div class="formula"><span class="lbl">Alternating series estimate</span>|R<sub>n</sub>| = |S − s<sub>n</sub>| ≤ b<sub>n+1</sub>   (the first omitted term); and S lies between s<sub>n</sub> and s<sub>n+1</sub>.</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>1.</b> ∑(−1)<sup>n−1</sup>/n: b<sub>n</sub> = 1/n decreases to 0 ⇒ <b>converges</b>. Its sum is ln 2 ≈ 0.6931 (we will prove it with power series in Chapter 6). With 10 terms s<sub>10</sub> ≈ 0.6456, and indeed |ln 2 − s<sub>10</sub>| ≈ 0.0475 ≤ b<sub>11</sub> = 1/11 ≈ 0.0909.</p>
<p><b>2.</b> ∑(−1)<sup>n</sup> n/(n + 1): b<sub>n</sub> → 1 ≠ 0, so the AST fails — and the divergence test shows the series <b>diverges</b>.</p>
<p><b>3.</b> ∑(−1)<sup>n</sup> ln n / n: is b<sub>n</sub> decreasing? f(x) = ln x/x has f′(x) = (1 − ln x)/x<sup>2</sup> &lt; 0 for x &gt; e, so b<sub>n</sub> decreases from n = 3 on, and b<sub>n</sub> → 0 ⇒ <b>converges</b>.</p></div>
<div class="callout"><p><b>Example 4 — how many terms?</b> Compute 1/e = ∑<sub>n=0</sub><sup>∞</sup> (−1)<sup>n</sup>/n! with error &lt; 0.001.</p>
<p>We need the first omitted term 1/(n + 1)! &lt; 0.001, i.e. (n + 1)! &gt; 1000. 6! = 720 is too small, 7! = 5040 works, so stop at n = 6: s = 1 − 1 + 1/2 − 1/6 + 1/24 − 1/120 + 1/720 ≈ <b>0.368056</b>. True value 1/e ≈ 0.367879; actual error 0.000176 &lt; 1/5040 ≈ 0.000198 ✓.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Checking only b<sub>n</sub> → 0 and forgetting “decreasing” (or vice versa).</li><li>Using the AST error bound for a series that is not alternating, or whose terms are not decreasing.</li><li>Concluding that a series diverges because the AST fails — the AST can only prove convergence.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>AST: b<sub>n</sub> decreasing and → 0 ⇒ alternating series converges.</li><li>Error ≤ first omitted term, b<sub>n+1</sub>.</li><li>1 − 1/2 + 1/3 − ⋯ = ln 2 converges though ∑1/n diverges.</li><li>To reach accuracy ε, find the first n with b<sub>n+1</sub> &lt; ε.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS2 + '5-5-alternating-series', 'OpenStax Vol. 2 — 5.5 Alternating Series') + `</li><li>` + A(PN2 + 'AlternatingSeries.aspx', "Paul's Online Notes — Alternating Series Test") + `</li><li>` + A(PN2 + 'EstimatingSeries.aspx', "Paul's Online Notes — Estimating the Value of a Series") + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>Does ∑(−1)<sup>n</sup>/√n converge?</li><li>How many terms of ∑(−1)<sup>n−1</sup>/n<sup>3</sup> guarantee error &lt; 0.0005?</li><li>Does ∑(−1)<sup>n</sup> (n<sup>2</sup>)/(n<sup>2</sup> + 1) converge?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 1/√n decreases to 0 ⇒ <b>converges</b>. 2) Need 1/(n + 1)<sup>3</sup> &lt; 0.0005 ⇔ (n + 1)<sup>3</sup> &gt; 2000 ⇔ n + 1 ≥ 13 ⇒ <b>12 terms</b> (12<sup>3</sup> = 1728 is not enough, 13<sup>3</sup> = 2197 is). 3) b<sub>n</sub> → 1 ≠ 0 ⇒ <b>diverges</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 5 · Bài 5.1</span>
<h2>Chuỗi đan dấu và ước lượng sai số chuỗi đan dấu</h2>
<p class="lead">Chuỗi điều hoà 1 + 1/2 + 1/3 + ⋯ phân kỳ. Đổi dấu xen kẽ — 1 − 1/2 + 1/3 − 1/4 + ⋯ — thì nó hội tụ (về ln 2). Dấu xen kẽ tạo ra sự triệt tiêu, và có một tiêu chuẩn đơn giản cùng một cận sai số đơn giản cho nó.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp dụng tiêu chuẩn chuỗi đan dấu (AST, Leibniz) và kiểm cả hai điều kiện.</li><li>Chặn sai số của tổng riêng bằng số hạng kế tiếp.</li><li>Xác định cần bao nhiêu số hạng cho một độ chính xác cho trước.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Chuỗi đan dấu</strong> có dạng ∑(−1)<sup>n−1</sup>b<sub>n</sub> = b<sub>1</sub> − b<sub>2</sub> + b<sub>3</sub> − ⋯ với b<sub>n</sub> &gt; 0.</p>
<div class="formula"><span class="lbl">Tiêu chuẩn chuỗi đan dấu</span>Nếu (i) b<sub>n+1</sub> ≤ b<sub>n</sub> với mọi n đủ lớn (giảm) và (ii) lim b<sub>n</sub> = 0 thì ∑(−1)<sup>n−1</sup>b<sub>n</sub> hội tụ.</div>
<p>Vì sao: tổng riêng đi zig-zag — s<sub>2</sub> &lt; s<sub>4</sub> &lt; s<sub>6</sub> &lt; ⋯ &lt; s<sub>5</sub> &lt; s<sub>3</sub> &lt; s<sub>1</sub> — và các bước nhảy b<sub>n</sub> co về 0, nên tổng riêng chẵn và lẻ bị kẹp về cùng một giới hạn S. Cùng hình ảnh đó cho cận sai số:</p>
<div class="formula"><span class="lbl">Ước lượng sai số chuỗi đan dấu</span>|R<sub>n</sub>| = |S − s<sub>n</sub>| ≤ b<sub>n+1</sub>   (số hạng đầu tiên bị bỏ); và S nằm giữa s<sub>n</sub> và s<sub>n+1</sub>.</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>1.</b> ∑(−1)<sup>n−1</sup>/n: b<sub>n</sub> = 1/n giảm về 0 ⇒ <b>hội tụ</b>. Tổng là ln 2 ≈ 0,6931 (sẽ chứng minh bằng chuỗi luỹ thừa ở Chương 6). Với 10 số hạng s<sub>10</sub> ≈ 0,6456, và đúng là |ln 2 − s<sub>10</sub>| ≈ 0,0475 ≤ b<sub>11</sub> = 1/11 ≈ 0,0909.</p>
<p><b>2.</b> ∑(−1)<sup>n</sup> n/(n + 1): b<sub>n</sub> → 1 ≠ 0, AST không dùng được — và tiêu chuẩn phân kỳ cho thấy chuỗi <b>phân kỳ</b>.</p>
<p><b>3.</b> ∑(−1)<sup>n</sup> ln n / n: b<sub>n</sub> có giảm không? f(x) = ln x/x có f′(x) = (1 − ln x)/x<sup>2</sup> &lt; 0 khi x &gt; e, nên b<sub>n</sub> giảm từ n = 3, và b<sub>n</sub> → 0 ⇒ <b>hội tụ</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4 — cần bao nhiêu số hạng?</b> Tính 1/e = ∑<sub>n=0</sub><sup>∞</sup> (−1)<sup>n</sup>/n! với sai số &lt; 0,001.</p>
<p>Cần số hạng bị bỏ đầu tiên 1/(n + 1)! &lt; 0,001, tức (n + 1)! &gt; 1000. 6! = 720 chưa đủ, 7! = 5040 đủ, nên dừng ở n = 6: s = 1 − 1 + 1/2 − 1/6 + 1/24 − 1/120 + 1/720 ≈ <b>0,368056</b>. Giá trị đúng 1/e ≈ 0,367879; sai số thật 0,000176 &lt; 1/5040 ≈ 0,000198 ✓.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chỉ kiểm b<sub>n</sub> → 0 mà quên “giảm” (hoặc ngược lại).</li><li>Dùng cận sai số AST cho chuỗi không đan dấu, hoặc số hạng không giảm.</li><li>Kết luận phân kỳ vì AST không thoả — AST chỉ chứng minh được hội tụ.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>AST: b<sub>n</sub> giảm và → 0 ⇒ chuỗi đan dấu hội tụ.</li><li>Sai số ≤ số hạng bị bỏ đầu tiên, b<sub>n+1</sub>.</li><li>1 − 1/2 + 1/3 − ⋯ = ln 2 hội tụ dù ∑1/n phân kỳ.</li><li>Để đạt độ chính xác ε, tìm n đầu tiên có b<sub>n+1</sub> &lt; ε.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS2 + '5-5-alternating-series', 'OpenStax Vol. 2 — 5.5 Chuỗi đan dấu') + `</li><li>` + A(PN2 + 'AlternatingSeries.aspx', "Paul's Online Notes — Alternating Series Test") + `</li><li>` + A(PN2 + 'EstimatingSeries.aspx', "Paul's Online Notes — Ước lượng tổng của chuỗi") + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>∑(−1)<sup>n</sup>/√n có hội tụ không?</li><li>Cần bao nhiêu số hạng của ∑(−1)<sup>n−1</sup>/n<sup>3</sup> để chắc sai số &lt; 0,0005?</li><li>∑(−1)<sup>n</sup> (n<sup>2</sup>)/(n<sup>2</sup> + 1) có hội tụ không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 1/√n giảm về 0 ⇒ <b>hội tụ</b>. 2) Cần 1/(n + 1)<sup>3</sup> &lt; 0,0005 ⇔ (n + 1)<sup>3</sup> &gt; 2000 ⇔ n + 1 ≥ 13 ⇒ <b>12 số hạng</b> (12<sup>3</sup> = 1728 chưa đủ, 13<sup>3</sup> = 2197 đủ). 3) b<sub>n</sub> → 1 ≠ 0 ⇒ <b>phân kỳ</b>.</p></div>`);

const c52 = L('cal121-ts-5-2',
  '5.2 — Absolute convergence, the ratio test and the root test|||5.2 — Hội tụ tuyệt đối, tiêu chuẩn tỉ số và tiêu chuẩn căn',
  'Hội tụ tuyệt đối ⇒ hội tụ; hội tụ có điều kiện; tiêu chuẩn tỉ số (D’Alembert) và căn (Cauchy) với L < 1, L > 1, L = 1; ví dụ n³/3ⁿ, n!/nⁿ, nⁿ/n!, ((2n+3)/(3n+2))ⁿ.',
  `<span class="eyebrow">CAL121 · Chapter 5 · Lesson 5.2</span>
<h2>Absolute convergence, the ratio test and the root test</h2>
<p class="lead">Comparison tests need positive terms; the alternating series test needs strictly alternating signs. For anything else — and for series with factorials and powers — we use <strong>absolute convergence</strong> plus the ratio and root tests, the workhorses of Chapter 6.</p>
<h3>🎯 Objectives</h3>
<ul><li>Distinguish absolute and conditional convergence.</li><li>Apply the ratio test and the root test, and recognise when they are inconclusive.</li><li>Know which test suits factorials, exponentials and n-th powers.</li></ul>
<h3>📖 Absolute convergence</h3>
<p>∑a<sub>n</sub> is <strong>absolutely convergent</strong> if ∑|a<sub>n</sub>| converges, and <strong>conditionally convergent</strong> if ∑a<sub>n</sub> converges but ∑|a<sub>n</sub>| diverges.</p>
<div class="formula"><span class="lbl">Theorem</span>Absolutely convergent ⇒ convergent.</div>
<div class="callout"><p><b>1.</b> ∑ cos n / n<sup>2</sup>: |cos n/n<sup>2</sup>| ≤ 1/n<sup>2</sup>, so it converges <b>absolutely</b> — even though the signs follow no pattern.</p>
<p><b>2.</b> ∑ (−1)<sup>n</sup>/√n converges by the AST, but ∑1/√n diverges: <b>conditionally</b> convergent. Same for 1 − 1/2 + 1/3 − ⋯.</p></div>
<p>Why care? Absolutely convergent series can be rearranged and multiplied freely. A conditionally convergent series can be rearranged to add up to <em>any</em> number (Riemann's rearrangement theorem) — a warning that “infinite sums” are delicate.</p>
<h3>📖 The ratio and root tests</h3>
<div class="formula"><span class="lbl">Ratio test</span>L = lim |a<sub>n+1</sub>/a<sub>n</sub>|.   L &lt; 1 ⇒ converges absolutely;  L &gt; 1 (or ∞) ⇒ diverges;  L = 1 ⇒ no conclusion.</div>
<div class="formula"><span class="lbl">Root test</span>L = lim |a<sub>n</sub>|<sup>1/n</sup>.   Same three conclusions.</div>
<p>Both compare the series with a geometric series of ratio L. Use the <strong>ratio test</strong> for factorials and products, the <strong>root test</strong> when the whole term is an n-th power.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>3.</b> ∑ n<sup>3</sup>/3<sup>n</sup>: |a<sub>n+1</sub>/a<sub>n</sub>| = ((n + 1)/n)<sup>3</sup> · (1/3) → <b>1/3 &lt; 1</b> ⇒ converges.</p>
<p><b>4.</b> ∑ n!/n<sup>n</sup>: a<sub>n+1</sub>/a<sub>n</sub> = (n + 1)! n<sup>n</sup>/((n + 1)<sup>n+1</sup> n!) = (n/(n + 1))<sup>n</sup> = 1/(1 + 1/n)<sup>n</sup> → <b>1/e &lt; 1</b> ⇒ converges.</p>
<p><b>5.</b> ∑ n<sup>n</sup>/n!: the reciprocal ratio → <b>e &gt; 1</b> ⇒ diverges.</p>
<p><b>6.</b> ∑ ((2n + 3)/(3n + 2))<sup>n</sup>: root test, |a<sub>n</sub>|<sup>1/n</sup> = (2n + 3)/(3n + 2) → <b>2/3 &lt; 1</b> ⇒ converges.</p>
<p><b>7.</b> ∑ 2<sup>n</sup>/n!: ratio = 2/(n + 1) → 0 ⇒ converges (its sum is e<sup>2</sup> − 1, Chapter 6).</p>
<p><b>8 — inconclusive.</b> For ∑1/n and ∑1/n<sup>2</sup> the ratio → 1 in both cases, yet one diverges and the other converges. L = 1 means “use another test”.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Concluding divergence when L = 1.</li><li>Using the ratio test on p-series or rational functions of n (always L = 1 — use comparison instead).</li><li>Algebra slips with factorials: (n + 1)!/n! = n + 1, and (2n + 2)!/(2n)! = (2n + 2)(2n + 1).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>∑|a<sub>n</sub>| converges ⇒ ∑a<sub>n</sub> converges (absolutely).</li><li>Converges but not absolutely = conditional.</li><li>Ratio / root: L &lt; 1 converge, L &gt; 1 diverge, L = 1 unknown.</li><li>Factorials → ratio test; n-th powers → root test.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS2 + '5-6-ratio-and-root-tests', 'OpenStax Vol. 2 — 5.6 Ratio and Root Tests') + `</li><li>` + A(PN2 + 'AbsoluteConvergence.aspx', "Paul's Online Notes — Absolute Convergence") + `</li><li>` + A(PN2 + 'RatioTest.aspx', "Paul's Online Notes — Ratio Test") + `</li><li>` + A(PN2 + 'RootTest.aspx', "Paul's Online Notes — Root Test") + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>∑ n<sup>2</sup>/2<sup>n</sup>.</li><li>∑ (−1)<sup>n</sup> 10<sup>n</sup>/n!.</li><li>Classify ∑ (−1)<sup>n</sup>/(n ln n), n ≥ 2: absolutely convergent, conditionally convergent or divergent?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Ratio → 1/2 ⇒ <b>converges</b> (sum = 6). 2) |ratio| = 10/(n + 1) → 0 ⇒ <b>converges absolutely</b>. 3) ∑1/(n ln n) diverges (Lesson 4.3) but the AST applies ⇒ <b>conditionally convergent</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 5 · Bài 5.2</span>
<h2>Hội tụ tuyệt đối, tiêu chuẩn tỉ số và tiêu chuẩn căn</h2>
<p class="lead">Tiêu chuẩn so sánh cần số hạng dương; tiêu chuẩn chuỗi đan dấu cần dấu xen kẽ đều đặn. Với mọi trường hợp khác — và với chuỗi có giai thừa, luỹ thừa — ta dùng <strong>hội tụ tuyệt đối</strong> cùng tiêu chuẩn tỉ số và căn, hai “ngựa thồ” của Chương 6.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phân biệt hội tụ tuyệt đối và hội tụ có điều kiện.</li><li>Áp dụng tiêu chuẩn tỉ số và tiêu chuẩn căn, nhận ra khi nào chúng không kết luận được.</li><li>Biết tiêu chuẩn nào hợp với giai thừa, hàm mũ và luỹ thừa bậc n.</li></ul>
<h3>📖 Hội tụ tuyệt đối</h3>
<p>∑a<sub>n</sub> <strong>hội tụ tuyệt đối</strong> nếu ∑|a<sub>n</sub>| hội tụ, và <strong>hội tụ có điều kiện</strong> nếu ∑a<sub>n</sub> hội tụ nhưng ∑|a<sub>n</sub>| phân kỳ.</p>
<div class="formula"><span class="lbl">Định lý</span>Hội tụ tuyệt đối ⇒ hội tụ.</div>
<div class="callout"><p><b>1.</b> ∑ cos n / n<sup>2</sup>: |cos n/n<sup>2</sup>| ≤ 1/n<sup>2</sup>, nên hội tụ <b>tuyệt đối</b> — dù dấu không theo quy luật nào.</p>
<p><b>2.</b> ∑ (−1)<sup>n</sup>/√n hội tụ theo AST, nhưng ∑1/√n phân kỳ: hội tụ <b>có điều kiện</b>. Tương tự với 1 − 1/2 + 1/3 − ⋯.</p></div>
<p>Vì sao quan trọng? Chuỗi hội tụ tuyệt đối được phép sắp xếp lại và nhân với nhau thoải mái. Chuỗi hội tụ có điều kiện có thể sắp xếp lại để cộng ra <em>bất kỳ</em> số nào (định lý sắp xếp lại của Riemann) — lời cảnh báo rằng “tổng vô hạn” rất tinh tế.</p>
<h3>📖 Tiêu chuẩn tỉ số và tiêu chuẩn căn</h3>
<div class="formula"><span class="lbl">Tiêu chuẩn tỉ số</span>L = lim |a<sub>n+1</sub>/a<sub>n</sub>|.   L &lt; 1 ⇒ hội tụ tuyệt đối;  L &gt; 1 (hoặc ∞) ⇒ phân kỳ;  L = 1 ⇒ không kết luận.</div>
<div class="formula"><span class="lbl">Tiêu chuẩn căn</span>L = lim |a<sub>n</sub>|<sup>1/n</sup>.   Ba kết luận như trên.</div>
<p>Cả hai so sánh chuỗi với chuỗi hình học công bội L. Dùng <strong>tỉ số</strong> cho giai thừa và tích, dùng <strong>căn</strong> khi cả số hạng là một luỹ thừa bậc n.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>3.</b> ∑ n<sup>3</sup>/3<sup>n</sup>: |a<sub>n+1</sub>/a<sub>n</sub>| = ((n + 1)/n)<sup>3</sup> · (1/3) → <b>1/3 &lt; 1</b> ⇒ hội tụ.</p>
<p><b>4.</b> ∑ n!/n<sup>n</sup>: a<sub>n+1</sub>/a<sub>n</sub> = (n + 1)! n<sup>n</sup>/((n + 1)<sup>n+1</sup> n!) = (n/(n + 1))<sup>n</sup> = 1/(1 + 1/n)<sup>n</sup> → <b>1/e &lt; 1</b> ⇒ hội tụ.</p>
<p><b>5.</b> ∑ n<sup>n</sup>/n!: tỉ số nghịch đảo → <b>e &gt; 1</b> ⇒ phân kỳ.</p>
<p><b>6.</b> ∑ ((2n + 3)/(3n + 2))<sup>n</sup>: tiêu chuẩn căn, |a<sub>n</sub>|<sup>1/n</sup> = (2n + 3)/(3n + 2) → <b>2/3 &lt; 1</b> ⇒ hội tụ.</p>
<p><b>7.</b> ∑ 2<sup>n</sup>/n!: tỉ số = 2/(n + 1) → 0 ⇒ hội tụ (tổng bằng e<sup>2</sup> − 1, Chương 6).</p>
<p><b>8 — không kết luận.</b> Với ∑1/n và ∑1/n<sup>2</sup>, tỉ số đều → 1, nhưng một chuỗi phân kỳ, một chuỗi hội tụ. L = 1 nghĩa là “dùng tiêu chuẩn khác”.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Kết luận phân kỳ khi L = 1.</li><li>Dùng tiêu chuẩn tỉ số cho chuỗi p hay hàm hữu tỉ theo n (luôn L = 1 — dùng so sánh).</li><li>Sai đại số với giai thừa: (n + 1)!/n! = n + 1, và (2n + 2)!/(2n)! = (2n + 2)(2n + 1).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>∑|a<sub>n</sub>| hội tụ ⇒ ∑a<sub>n</sub> hội tụ (tuyệt đối).</li><li>Hội tụ nhưng không tuyệt đối = có điều kiện.</li><li>Tỉ số / căn: L &lt; 1 hội tụ, L &gt; 1 phân kỳ, L = 1 chưa biết.</li><li>Giai thừa → tỉ số; luỹ thừa bậc n → căn.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS2 + '5-6-ratio-and-root-tests', 'OpenStax Vol. 2 — 5.6 Tiêu chuẩn tỉ số và căn') + `</li><li>` + A(PN2 + 'AbsoluteConvergence.aspx', "Paul's Online Notes — Hội tụ tuyệt đối") + `</li><li>` + A(PN2 + 'RatioTest.aspx', "Paul's Online Notes — Ratio Test") + `</li><li>` + A(PN2 + 'RootTest.aspx', "Paul's Online Notes — Root Test") + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>∑ n<sup>2</sup>/2<sup>n</sup>.</li><li>∑ (−1)<sup>n</sup> 10<sup>n</sup>/n!.</li><li>Phân loại ∑ (−1)<sup>n</sup>/(n ln n), n ≥ 2: hội tụ tuyệt đối, có điều kiện hay phân kỳ?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Tỉ số → 1/2 ⇒ <b>hội tụ</b> (tổng = 6). 2) |tỉ số| = 10/(n + 1) → 0 ⇒ <b>hội tụ tuyệt đối</b>. 3) ∑1/(n ln n) phân kỳ (Bài 4.3) nhưng AST dùng được ⇒ <b>hội tụ có điều kiện</b>.</p></div>`);

const c53 = L('cal121-ts-5-3',
  '5.3 — Strategy for testing series|||5.3 — Chiến lược xét hội tụ của chuỗi',
  'Quy trình 7 bước chọn tiêu chuẩn (phân kỳ → p/hình học → so sánh → đan dấu → tỉ số/căn → tích phân), 8 ví dụ phân loại, bảng “dạng số hạng ↔ tiêu chuẩn”, chuỗi điều hoà H_n ≈ ln n + γ.',
  `<span class="eyebrow">CAL121 · Chapter 5 · Lesson 5.3</span>
<h2>Strategy for testing series</h2>
<p class="lead">On an exam the question is never “use the ratio test”; it is “converge or diverge?”. Choosing the right test quickly is a skill, and it follows a checklist.</p>
<h3>🎯 Objectives</h3>
<ul><li>Classify a series by the form of its terms.</li><li>Pick the most efficient test and justify the hypotheses.</li><li>Recognise the series whose behaviour you should simply know.</li></ul>
<h3>📖 The checklist</h3>
<ol><li><strong>Divergence test first:</strong> if a<sub>n</sub> ↛ 0, stop — diverges.</li><li><strong>Known families:</strong> p-series ∑1/n<sup>p</sup>, geometric ∑ar<sup>n</sup>, telescoping.</li><li><strong>Looks like a known family</strong> (rational or algebraic in n): comparison or limit comparison.</li><li><strong>Signs alternate:</strong> alternating series test (then check absolute convergence if asked).</li><li><strong>Factorials or products:</strong> ratio test.</li><li><strong>Whole term is (⋯)<sup>n</sup>:</strong> root test.</li><li><strong>a<sub>n</sub> = f(n) with an easy ∫f:</strong> integral test.</li></ol>
<div class="kv-grid"><div class="kv"><div class="k">1/n<sup>p</sup>, rational in n</div><div class="v">p-series / limit comparison</div></div><div class="kv"><div class="k">r<sup>n</sup>, 2<sup>n</sup>/3<sup>n</sup></div><div class="v">geometric / comparison</div></div><div class="kv"><div class="k">n!, (2n)!, products</div><div class="v">ratio test</div></div><div class="kv"><div class="k">(expression)<sup>n</sup></div><div class="v">root test</div></div><div class="kv"><div class="k">(−1)<sup>n</sup>b<sub>n</sub></div><div class="v">AST + absolute check</div></div><div class="kv"><div class="k">ln n, n e<sup>−n<sup>2</sup></sup></div><div class="v">integral test / comparison</div></div></div>
<h3>✍️ Eight classifications</h3>
<div class="callout"><p><b>1.</b> ∑ (n − 1)/(2n + 1): terms → 1/2 ⇒ <b>diverges</b> (step 1).</p>
<p><b>2.</b> ∑ (√n + 1)/(n<sup>2</sup> + 1): dominant √n/n<sup>2</sup> = 1/n<sup>3/2</sup>; limit comparison ⇒ <b>converges</b>.</p>
<p><b>3.</b> ∑ n e<sup>−n<sup>2</sup></sup>: integral test (Lesson 4.3) ⇒ <b>converges</b>.</p>
<p><b>4.</b> ∑ (−1)<sup>n</sup> n<sup>3</sup>/(n<sup>4</sup> + 1): AST (b<sub>n</sub> decreases to 0 eventually) ⇒ converges; ∑ n<sup>3</sup>/(n<sup>4</sup> + 1) ~ ∑1/n diverges ⇒ <b>conditionally convergent</b>.</p>
<p><b>5.</b> ∑ 2<sup>k</sup>/k!: ratio → 0 ⇒ <b>converges</b>.</p>
<p><b>6.</b> ∑ (1 + 1/n)<sup>n<sup>2</sup></sup>: root test: (1 + 1/n)<sup>n</sup> → e &gt; 1 ⇒ <b>diverges</b>.</p>
<p><b>7.</b> ∑ 1/(3 + 5<sup>n</sup>): ≤ (1/5)<sup>n</sup> ⇒ <b>converges</b>.</p>
<p><b>8.</b> ∑ sin<sup>2</sup>n / n<sup>2</sup>: 0 ≤ term ≤ 1/n<sup>2</sup> ⇒ <b>converges</b>.</p></div>
<h3>📖 Two series to know by heart</h3>
<p>The <strong>harmonic numbers</strong> H<sub>n</sub> = 1 + 1/2 + ⋯ + 1/n grow like ln n: H<sub>n</sub> ≈ ln n + γ with Euler's constant γ ≈ 0.5772. For n = 10<sup>6</sup>, a direct Python sum gives 14.392727 while ln(10<sup>6</sup>) + γ ≈ 14.392726. This is why “average-case” analysis of quicksort and of the coupon-collector problem involves ln n. The <strong>Basel sum</strong> ∑1/n<sup>2</sup> = π<sup>2</sup>/6 (Lesson 4.3) is the standard example of a convergent p-series.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Running the ratio test on everything (it fails on every rational function of n).</li><li>Writing “converges by comparison” without stating the comparison series and the inequality.</li><li>Answering “converges” for an alternating series when the question asks absolute vs conditional.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Divergence test → known families → comparison → AST → ratio/root → integral.</li><li>Read the shape of a<sub>n</sub>: it tells you the test.</li><li>Always name the test and verify its hypotheses.</li><li>H<sub>n</sub> ≈ ln n + γ; ∑1/n<sup>2</sup> = π<sup>2</sup>/6.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(PN2 + 'SeriesStrategy.aspx', "Paul's Online Notes — Strategy for Series") + `</li><li>` + A(OS2 + '5-6-ratio-and-root-tests', 'OpenStax Vol. 2 — 5.6 (includes a summary table of all tests)') + `</li><li>` + A('https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-5-exploring-the-infinite/', 'MIT OCW 18.01SC — Unit 5: Exploring the Infinite') + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>∑ (2n)!/(n!)<sup>2</sup>.</li><li>∑ (−1)<sup>n</sup>/(2n + 1).</li><li>∑ 1/(n<sup>1/n</sup>·n).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Ratio = (2n + 2)(2n + 1)/(n + 1)<sup>2</sup> → 4 ⇒ <b>diverges</b>. 2) AST ⇒ converges; absolute values ~ 1/(2n) diverge ⇒ <b>conditionally convergent</b> (its sum is π/4, Chapter 6). 3) n<sup>1/n</sup> → 1, limit comparison with 1/n ⇒ <b>diverges</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 5 · Bài 5.3</span>
<h2>Chiến lược xét hội tụ của chuỗi</h2>
<p class="lead">Trong đề thi, câu hỏi không bao giờ là “hãy dùng tiêu chuẩn tỉ số”; mà là “hội tụ hay phân kỳ?”. Chọn đúng tiêu chuẩn thật nhanh là một kỹ năng, và nó đi theo một bảng kiểm.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phân loại chuỗi theo dạng số hạng.</li><li>Chọn tiêu chuẩn hiệu quả nhất và kiểm giả thiết.</li><li>Nhận ra các chuỗi mà bạn nên thuộc kết quả.</li></ul>
<h3>📖 Bảng kiểm</h3>
<ol><li><strong>Tiêu chuẩn phân kỳ trước:</strong> nếu a<sub>n</sub> ↛ 0, dừng — phân kỳ.</li><li><strong>Họ đã biết:</strong> chuỗi p ∑1/n<sup>p</sup>, hình học ∑ar<sup>n</sup>, lồng nhau.</li><li><strong>Giống một họ đã biết</strong> (hữu tỉ hoặc đại số theo n): so sánh hoặc so sánh giới hạn.</li><li><strong>Dấu xen kẽ:</strong> tiêu chuẩn chuỗi đan dấu (rồi kiểm hội tụ tuyệt đối nếu đề hỏi).</li><li><strong>Giai thừa hoặc tích:</strong> tiêu chuẩn tỉ số.</li><li><strong>Cả số hạng là (⋯)<sup>n</sup>:</strong> tiêu chuẩn căn.</li><li><strong>a<sub>n</sub> = f(n) với ∫f dễ tính:</strong> tiêu chuẩn tích phân.</li></ol>
<div class="kv-grid"><div class="kv"><div class="k">1/n<sup>p</sup>, hữu tỉ theo n</div><div class="v">chuỗi p / so sánh giới hạn</div></div><div class="kv"><div class="k">r<sup>n</sup>, 2<sup>n</sup>/3<sup>n</sup></div><div class="v">hình học / so sánh</div></div><div class="kv"><div class="k">n!, (2n)!, tích</div><div class="v">tiêu chuẩn tỉ số</div></div><div class="kv"><div class="k">(biểu thức)<sup>n</sup></div><div class="v">tiêu chuẩn căn</div></div><div class="kv"><div class="k">(−1)<sup>n</sup>b<sub>n</sub></div><div class="v">AST + kiểm tuyệt đối</div></div><div class="kv"><div class="k">ln n, n e<sup>−n<sup>2</sup></sup></div><div class="v">tích phân / so sánh</div></div></div>
<h3>✍️ Tám ví dụ phân loại</h3>
<div class="callout"><p><b>1.</b> ∑ (n − 1)/(2n + 1): số hạng → 1/2 ⇒ <b>phân kỳ</b> (bước 1).</p>
<p><b>2.</b> ∑ (√n + 1)/(n<sup>2</sup> + 1): trội √n/n<sup>2</sup> = 1/n<sup>3/2</sup>; so sánh giới hạn ⇒ <b>hội tụ</b>.</p>
<p><b>3.</b> ∑ n e<sup>−n<sup>2</sup></sup>: tiêu chuẩn tích phân (Bài 4.3) ⇒ <b>hội tụ</b>.</p>
<p><b>4.</b> ∑ (−1)<sup>n</sup> n<sup>3</sup>/(n<sup>4</sup> + 1): AST (b<sub>n</sub> giảm về 0 từ một lúc nào đó) ⇒ hội tụ; ∑ n<sup>3</sup>/(n<sup>4</sup> + 1) ~ ∑1/n phân kỳ ⇒ <b>hội tụ có điều kiện</b>.</p>
<p><b>5.</b> ∑ 2<sup>k</sup>/k!: tỉ số → 0 ⇒ <b>hội tụ</b>.</p>
<p><b>6.</b> ∑ (1 + 1/n)<sup>n<sup>2</sup></sup>: tiêu chuẩn căn: (1 + 1/n)<sup>n</sup> → e &gt; 1 ⇒ <b>phân kỳ</b>.</p>
<p><b>7.</b> ∑ 1/(3 + 5<sup>n</sup>): ≤ (1/5)<sup>n</sup> ⇒ <b>hội tụ</b>.</p>
<p><b>8.</b> ∑ sin<sup>2</sup>n / n<sup>2</sup>: 0 ≤ số hạng ≤ 1/n<sup>2</sup> ⇒ <b>hội tụ</b>.</p></div>
<h3>📖 Hai chuỗi nên thuộc</h3>
<p><strong>Số điều hoà</strong> H<sub>n</sub> = 1 + 1/2 + ⋯ + 1/n tăng như ln n: H<sub>n</sub> ≈ ln n + γ với hằng số Euler γ ≈ 0,5772. Với n = 10<sup>6</sup>, cộng trực tiếp bằng Python được 14,392727 còn ln(10<sup>6</sup>) + γ ≈ 14,392726. Đây là lý do phân tích “trường hợp trung bình” của quicksort hay bài toán sưu tập phiếu có ln n. <strong>Tổng Basel</strong> ∑1/n<sup>2</sup> = π<sup>2</sup>/6 (Bài 4.3) là ví dụ chuẩn của chuỗi p hội tụ.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng tiêu chuẩn tỉ số cho mọi thứ (nó thất bại với mọi hàm hữu tỉ theo n).</li><li>Viết “hội tụ theo so sánh” mà không nêu chuỗi so sánh và bất đẳng thức.</li><li>Trả lời “hội tụ” cho chuỗi đan dấu khi đề hỏi tuyệt đối hay có điều kiện.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Phân kỳ → họ đã biết → so sánh → AST → tỉ số/căn → tích phân.</li><li>Đọc hình dạng a<sub>n</sub>: nó cho biết tiêu chuẩn.</li><li>Luôn nêu tên tiêu chuẩn và kiểm giả thiết.</li><li>H<sub>n</sub> ≈ ln n + γ; ∑1/n<sup>2</sup> = π<sup>2</sup>/6.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(PN2 + 'SeriesStrategy.aspx', "Paul's Online Notes — Chiến lược xét chuỗi") + `</li><li>` + A(OS2 + '5-6-ratio-and-root-tests', 'OpenStax Vol. 2 — 5.6 (có bảng tổng hợp mọi tiêu chuẩn)') + `</li><li>` + A('https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-5-exploring-the-infinite/', 'MIT OCW 18.01SC — Unit 5: Exploring the Infinite') + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>∑ (2n)!/(n!)<sup>2</sup>.</li><li>∑ (−1)<sup>n</sup>/(2n + 1).</li><li>∑ 1/(n<sup>1/n</sup>·n).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Tỉ số = (2n + 2)(2n + 1)/(n + 1)<sup>2</sup> → 4 ⇒ <b>phân kỳ</b>. 2) AST ⇒ hội tụ; trị tuyệt đối ~ 1/(2n) phân kỳ ⇒ <b>hội tụ có điều kiện</b> (tổng là π/4, Chương 6). 3) n<sup>1/n</sup> → 1, so sánh giới hạn với 1/n ⇒ <b>phân kỳ</b>.</p></div>`);

const q5 = QZ(5, 'Quiz — Chapter 5: Alternating series, ratio & root tests|||Quiz — Chương 5: Chuỗi đan dấu, tiêu chuẩn tỉ số & căn', 'Kiểm tra chương 5: tiêu chuẩn chuỗi đan dấu, ước lượng sai số, hội tụ tuyệt đối/có điều kiện, tỉ số, căn, chiến lược.', [
  Q('q1', 'The alternating harmonic series 1 − 1/2 + 1/3 − ⋯|||Chuỗi điều hoà đan dấu 1 − 1/2 + 1/3 − ⋯',
    ['diverges|||phân kỳ', 'converges absolutely|||hội tụ tuyệt đối', 'converges conditionally|||hội tụ có điều kiện', 'equals 1|||bằng 1'], 2,
    'AST gives convergence (to ln 2) but Σ1/n diverges.|||AST cho hội tụ (về ln 2) nhưng Σ1/n phân kỳ.'),
  Q('q2', 'For an alternating series satisfying the AST, |S − sₙ| ≤|||Với chuỗi đan dấu thoả AST, |S − sₙ| ≤',
    ['bₙ|||bₙ', 'bₙ₊₁|||bₙ₊₁', 'bₙ/2|||bₙ/2', 'sₙ₊₁|||sₙ₊₁'], 1,
    'The error is at most the first omitted term.|||Sai số không vượt quá số hạng bị bỏ đầu tiên.'),
  Q('q3', 'To compute Σₙ₌₀^∞ (−1)ⁿ/n! with error < 0.001, the last term needed is n =|||Để tính Σₙ₌₀^∞ (−1)ⁿ/n! với sai số < 0,001, số hạng cuối cần là n =',
    ['4|||4', '5|||5', '6|||6', '7|||7'], 2,
    'Need 1/(n + 1)! < 0.001: 7! = 5040 > 1000, so n = 6.|||Cần 1/(n + 1)! < 0,001: 7! = 5040 > 1000, nên n = 6.'),
  Q('q4', 'Σ cos n / n²|||Σ cos n / n²',
    ['diverges|||phân kỳ', 'converges absolutely|||hội tụ tuyệt đối', 'converges conditionally|||hội tụ có điều kiện', 'cannot be decided|||không xác định được'], 1,
    'Because |cos n/n²| ≤ 1/n², a convergent p-series.|||Vì |cos n/n²| ≤ 1/n², chuỗi p hội tụ.'),
  Q('q5', 'Ratio test limit for Σ n³/3ⁿ:|||Giới hạn tỉ số của Σ n³/3ⁿ:',
    ['0|||0', '1/3|||1/3', '1|||1', '3|||3'], 1,
    '((n + 1)/n)³ · 1/3 → 1/3.|||((n + 1)/n)³ · 1/3 → 1/3.'),
  Q('q6', 'Ratio test limit for Σ n!/nⁿ:|||Giới hạn tỉ số của Σ n!/nⁿ:',
    ['1/e|||1/e', 'e|||e', '1|||1', '0|||0'], 0,
    '(n/(n + 1))ⁿ = 1/(1 + 1/n)ⁿ → 1/e < 1: converges.|||(n/(n + 1))ⁿ = 1/(1 + 1/n)ⁿ → 1/e < 1: hội tụ.'),
  Q('q7', 'If the ratio test gives L = 1, then the series|||Nếu tiêu chuẩn tỉ số cho L = 1 thì chuỗi',
    ['diverges|||phân kỳ', 'converges|||hội tụ', 'may do either|||có thể hội tụ hoặc phân kỳ', 'converges conditionally|||hội tụ có điều kiện'], 2,
    'Σ1/n and Σ1/n² both give L = 1.|||Σ1/n và Σ1/n² đều cho L = 1.'),
  Q('q8', 'Best test for Σ((2n + 3)/(3n + 2))ⁿ:|||Tiêu chuẩn tốt nhất cho Σ((2n + 3)/(3n + 2))ⁿ:',
    ['integral test|||tích phân', 'root test|||căn', 'alternating series test|||chuỗi đan dấu', 'p-series|||chuỗi p'], 1,
    'The whole term is an n-th power; root → 2/3 < 1.|||Cả số hạng là luỹ thừa bậc n; căn → 2/3 < 1.'),
  Q('q9', 'Σ (2n)!/(n!)²|||Σ (2n)!/(n!)²',
    ['converges, ratio → 1/4|||hội tụ, tỉ số → 1/4', 'diverges, ratio → 4|||phân kỳ, tỉ số → 4', 'ratio → 1, inconclusive|||tỉ số → 1, không kết luận', 'converges, ratio → 0|||hội tụ, tỉ số → 0'], 1,
    '(2n + 2)(2n + 1)/(n + 1)² → 4.|||(2n + 2)(2n + 1)/(n + 1)² → 4.'),
  Q('q10', 'The harmonic number H₁₀₀₀₀₀₀ = 1 + 1/2 + ⋯ + 1/10⁶ is about|||Số điều hoà H₁₀₀₀₀₀₀ = 1 + 1/2 + ⋯ + 1/10⁶ xấp xỉ',
    ['1.64|||1,64', '6.9|||6,9', '14.4|||14,4', '1 000 000|||1 000 000'], 2,
    'Hₙ ≈ ln n + γ = 13.816 + 0.577 ≈ 14.39.|||Hₙ ≈ ln n + γ = 13,816 + 0,577 ≈ 14,39.'),
]);

const ch5 = {
  title: 'Chapter 5 — Alternating series, absolute convergence, ratio and root tests|||Chương 5 — Chuỗi đan dấu, hội tụ tuyệt đối, tiêu chuẩn tỉ số và căn',
  description: 'Tiêu chuẩn chuỗi đan dấu và ước lượng sai số, hội tụ tuyệt đối/có điều kiện, tiêu chuẩn tỉ số và căn, chiến lược chọn tiêu chuẩn (Stewart 11.5–11.7 · OpenStax Vol.2 5.5–5.6).',
  lessons: [c51, c52, c53, q5],
};

// ───────────────────────────── Chương 6 — Chuỗi luỹ thừa & Taylor ─────────────────────────────
const TAYLOR_PY = `<pre><code class="language-python">import math

def taylor_exp(x, n):
    # T_n(x) = sum of x^k / k! for k = 0..n
    return sum(x**k / math.factorial(k) for k in range(n + 1))

for n in (1, 2, 4, 6, 8):
    approx = taylor_exp(1.0, n)
    bound = 3 / math.factorial(n + 1)   # Taylor's inequality with M = 3
    print(f"n = {n}  T_n(1) = {approx:.8f}  error = {math.e - approx:.2e}  bound = {bound:.2e}")</code></pre>
<div class="out">n = 1  T_n(1) = 2.00000000  error = 7.18e-01  bound = 1.50e+00
n = 2  T_n(1) = 2.50000000  error = 2.18e-01  bound = 5.00e-01
n = 4  T_n(1) = 2.70833333  error = 9.95e-03  bound = 2.50e-02
n = 6  T_n(1) = 2.71805556  error = 2.26e-04  bound = 5.95e-04
n = 8  T_n(1) = 2.71827877  error = 3.06e-06  bound = 8.27e-06</div>`;

const c61 = L('cal121-ts-6-1',
  '6.1 — Power series: radius and interval of convergence|||6.1 — Chuỗi luỹ thừa: bán kính và miền hội tụ',
  'Chuỗi luỹ thừa Σcₙ(x − a)ⁿ, ba khả năng hội tụ (chỉ tại a, |x − a| < R, mọi x), tìm R bằng tiêu chuẩn tỉ số, kiểm hai đầu mút; ví dụ Σxⁿ/n, Σn!xⁿ, Σxⁿ/n!, Σ(x − 3)ⁿ/(n2ⁿ).',
  `<span class="eyebrow">CAL121 · Chapter 6 · Lesson 6.1</span>
<h2>Power series: radius and interval of convergence</h2>
<p class="lead">A <strong>power series</strong> is an “infinite polynomial” c<sub>0</sub> + c<sub>1</sub>(x − a) + c<sub>2</sub>(x − a)<sup>2</sup> + ⋯. For each x it is a series of numbers, which may converge or diverge. The set of x where it converges is always an interval centred at a.</p>
<h3>🎯 Objectives</h3>
<ul><li>Recognise a power series and its centre.</li><li>Find the radius of convergence with the ratio test.</li><li>Test the endpoints to get the exact interval of convergence.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Power series centred at a</span>∑<sub>n=0</sub><sup>∞</sup> c<sub>n</sub>(x − a)<sup>n</sup></div>
<div class="formula"><span class="lbl">Theorem: exactly one of three cases</span>(i) converges only at x = a (R = 0); (ii) converges for all x (R = ∞); (iii) there is R &gt; 0 with absolute convergence for |x − a| &lt; R and divergence for |x − a| &gt; R. At |x − a| = R anything can happen.</div>
<p><b>Recipe.</b> Apply the ratio test to |c<sub>n</sub>(x − a)<sup>n</sup>|: get L(x) = |x − a| · lim|c<sub>n+1</sub>/c<sub>n</sub>|. Solve L(x) &lt; 1 for the open interval, then plug each endpoint into the series and test it separately (usually p-series or AST).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>1.</b> ∑ x<sup>n</sup>/n (n ≥ 1). Ratio: |x| · n/(n + 1) → |x|, so R = 1. Endpoint x = 1: ∑1/n diverges. Endpoint x = −1: ∑(−1)<sup>n</sup>/n converges (AST). Interval <b>[−1, 1)</b>.</p>
<p><b>2.</b> ∑ n! x<sup>n</sup>: ratio = (n + 1)|x| → ∞ unless x = 0. <b>R = 0</b>, converges only at x = 0.</p>
<p><b>3.</b> ∑ x<sup>n</sup>/n!: ratio = |x|/(n + 1) → 0 &lt; 1 for every x. <b>R = ∞</b>, interval (−∞, ∞). (This is e<sup>x</sup>, Lesson 6.3.)</p>
<p><b>4.</b> ∑ (x − 3)<sup>n</sup>/(n 2<sup>n</sup>): ratio → |x − 3|/2 &lt; 1 ⇔ 1 &lt; x &lt; 5, R = 2. x = 5: ∑1/n diverges; x = 1: ∑(−1)<sup>n</sup>/n converges. Interval <b>[1, 5)</b>.</p></div>
<div class="callout"><p><b>Example 5 — geometric series as a power series.</b> ∑ x<sup>n</sup> = 1/(1 − x) for |x| &lt; 1, diverges at x = ±1: interval (−1, 1). This single fact powers the whole next lesson.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the endpoints — the ratio test says nothing there (L = 1).</li><li>Writing R = 1/2 when the ratio limit is |x − 3|/2: solve the inequality, R = 2.</li><li>Centre errors: ∑(x + 1)<sup>n</sup> is centred at a = −1.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Power series converge on an interval centred at a, of radius R ∈ [0, ∞].</li><li>Ratio test on |c<sub>n</sub>(x − a)<sup>n</sup>| gives R.</li><li>Always test the two endpoints separately.</li><li>Inside the interval the convergence is absolute.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS2 + '6-1-power-series-and-functions', 'OpenStax Vol. 2 — 6.1 Power Series and Functions') + `</li><li>` + A(PN2 + 'PowerSeries.aspx', "Paul's Online Notes — Power Series") + `</li><li>` + A('https://www.desmos.com/calculator', 'Desmos — graph partial sums Σ x^n/n to watch the interval appear') + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>Interval of convergence of ∑ n x<sup>n</sup>/4<sup>n</sup>.</li><li>Interval of convergence of ∑ (x + 1)<sup>n</sup>/n<sup>2</sup>.</li><li>Radius of ∑ (2x)<sup>n</sup>.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Ratio → |x|/4, R = 4; at x = ±4 terms n(±1)<sup>n</sup> ↛ 0 ⇒ <b>(−4, 4)</b>. 2) Ratio → |x + 1|, R = 1; at both endpoints ∑±1/n<sup>2</sup> converges absolutely ⇒ <b>[−2, 0]</b>. 3) |2x| &lt; 1 ⇒ <b>R = 1/2</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 6 · Bài 6.1</span>
<h2>Chuỗi luỹ thừa: bán kính và miền hội tụ</h2>
<p class="lead"><strong>Chuỗi luỹ thừa</strong> là một “đa thức vô hạn” c<sub>0</sub> + c<sub>1</sub>(x − a) + c<sub>2</sub>(x − a)<sup>2</sup> + ⋯. Với mỗi x, nó là một chuỗi số, có thể hội tụ hoặc phân kỳ. Tập các x làm chuỗi hội tụ luôn là một khoảng có tâm a.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận ra chuỗi luỹ thừa và tâm của nó.</li><li>Tìm bán kính hội tụ bằng tiêu chuẩn tỉ số.</li><li>Kiểm hai đầu mút để có đúng miền hội tụ.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Chuỗi luỹ thừa tâm a</span>∑<sub>n=0</sub><sup>∞</sup> c<sub>n</sub>(x − a)<sup>n</sup></div>
<div class="formula"><span class="lbl">Định lý: đúng một trong ba trường hợp</span>(i) chỉ hội tụ tại x = a (R = 0); (ii) hội tụ với mọi x (R = ∞); (iii) có R &gt; 0 sao cho hội tụ tuyệt đối khi |x − a| &lt; R và phân kỳ khi |x − a| &gt; R. Tại |x − a| = R thì chuyện gì cũng có thể xảy ra.</div>
<p><b>Công thức làm bài.</b> Áp tiêu chuẩn tỉ số cho |c<sub>n</sub>(x − a)<sup>n</sup>|: được L(x) = |x − a| · lim|c<sub>n+1</sub>/c<sub>n</sub>|. Giải L(x) &lt; 1 để có khoảng mở, rồi thế từng đầu mút vào chuỗi và xét riêng (thường là chuỗi p hoặc AST).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>1.</b> ∑ x<sup>n</sup>/n (n ≥ 1). Tỉ số: |x| · n/(n + 1) → |x|, nên R = 1. Đầu mút x = 1: ∑1/n phân kỳ. Đầu mút x = −1: ∑(−1)<sup>n</sup>/n hội tụ (AST). Miền <b>[−1, 1)</b>.</p>
<p><b>2.</b> ∑ n! x<sup>n</sup>: tỉ số = (n + 1)|x| → ∞ trừ khi x = 0. <b>R = 0</b>, chỉ hội tụ tại x = 0.</p>
<p><b>3.</b> ∑ x<sup>n</sup>/n!: tỉ số = |x|/(n + 1) → 0 &lt; 1 với mọi x. <b>R = ∞</b>, miền (−∞, ∞). (Đây là e<sup>x</sup>, Bài 6.3.)</p>
<p><b>4.</b> ∑ (x − 3)<sup>n</sup>/(n 2<sup>n</sup>): tỉ số → |x − 3|/2 &lt; 1 ⇔ 1 &lt; x &lt; 5, R = 2. x = 5: ∑1/n phân kỳ; x = 1: ∑(−1)<sup>n</sup>/n hội tụ. Miền <b>[1, 5)</b>.</p></div>
<div class="callout"><p><b>Ví dụ 5 — chuỗi hình học như chuỗi luỹ thừa.</b> ∑ x<sup>n</sup> = 1/(1 − x) khi |x| &lt; 1, phân kỳ tại x = ±1: miền (−1, 1). Riêng sự kiện này là động cơ cho toàn bộ bài sau.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên đầu mút — tiêu chuẩn tỉ số không nói gì ở đó (L = 1).</li><li>Viết R = 1/2 khi giới hạn tỉ số là |x − 3|/2: giải bất phương trình, R = 2.</li><li>Sai tâm: ∑(x + 1)<sup>n</sup> có tâm a = −1.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Chuỗi luỹ thừa hội tụ trên một khoảng tâm a, bán kính R ∈ [0, ∞].</li><li>Tiêu chuẩn tỉ số cho |c<sub>n</sub>(x − a)<sup>n</sup>| cho R.</li><li>Luôn xét riêng hai đầu mút.</li><li>Bên trong khoảng, hội tụ là tuyệt đối.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS2 + '6-1-power-series-and-functions', 'OpenStax Vol. 2 — 6.1 Chuỗi luỹ thừa và hàm số') + `</li><li>` + A(PN2 + 'PowerSeries.aspx', "Paul's Online Notes — Power Series") + `</li><li>` + A('https://www.desmos.com/calculator', 'Desmos — vẽ tổng riêng Σ x^n/n để thấy miền hội tụ hiện ra') + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Miền hội tụ của ∑ n x<sup>n</sup>/4<sup>n</sup>.</li><li>Miền hội tụ của ∑ (x + 1)<sup>n</sup>/n<sup>2</sup>.</li><li>Bán kính của ∑ (2x)<sup>n</sup>.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Tỉ số → |x|/4, R = 4; tại x = ±4 số hạng n(±1)<sup>n</sup> ↛ 0 ⇒ <b>(−4, 4)</b>. 2) Tỉ số → |x + 1|, R = 1; ở cả hai đầu mút ∑±1/n<sup>2</sup> hội tụ tuyệt đối ⇒ <b>[−2, 0]</b>. 3) |2x| &lt; 1 ⇒ <b>R = 1/2</b>.</p></div>`);

const c62 = L('cal121-ts-6-2',
  '6.2 — Representing functions as power series: substitute, differentiate, integrate|||6.2 — Biểu diễn hàm bằng chuỗi luỹ thừa: thay biến, đạo hàm, tích phân',
  'Từ 1/(1 − x) = Σxⁿ suy ra chuỗi của 1/(2 − x), 1/(1 + x²), x²/(1 + x³); đạo hàm/tích phân từng số hạng (giữ nguyên R): 1/(1 − x)², ln(1 + x), arctan x; tính Σn/2ⁿ = 2.',
  `<span class="eyebrow">CAL121 · Chapter 6 · Lesson 6.2</span>
<h2>Representing functions as power series</h2>
<p class="lead">The geometric series 1/(1 − x) = 1 + x + x<sup>2</sup> + ⋯ is a template. By <strong>substituting</strong>, <strong>multiplying</strong>, <strong>differentiating</strong> and <strong>integrating</strong> it, we get power series for many functions — including ln and arctan — without computing a single derivative by hand.</p>
<h3>🎯 Objectives</h3>
<ul><li>Build power series from the geometric series by algebraic manipulation.</li><li>Differentiate and integrate power series term by term.</li><li>Use power series to sum numerical series.</li></ul>
<h3>📖 Substitution</h3>
<div class="callout"><p><b>1.</b> 1/(1 + x<sup>2</sup>) = 1/(1 − (−x<sup>2</sup>)) = ∑ (−1)<sup>n</sup>x<sup>2n</sup> = 1 − x<sup>2</sup> + x<sup>4</sup> − ⋯, valid for |x<sup>2</sup>| &lt; 1, i.e. <b>|x| &lt; 1</b>.</p>
<p><b>2.</b> 1/(2 − x) = (1/2) · 1/(1 − x/2) = ∑ x<sup>n</sup>/2<sup>n+1</sup> = 1/2 + x/4 + x<sup>2</sup>/8 + ⋯, valid for |x/2| &lt; 1: <b>R = 2</b>.</p>
<p><b>3.</b> x<sup>2</sup>/(1 + x<sup>3</sup>) = x<sup>2</sup> ∑(−1)<sup>n</sup>x<sup>3n</sup> = ∑ (−1)<sup>n</sup>x<sup>3n+2</sup> = x<sup>2</sup> − x<sup>5</sup> + x<sup>8</sup> − ⋯, <b>R = 1</b>.</p></div>
<h3>📖 Term-by-term calculus</h3>
<div class="formula"><span class="lbl">Theorem</span>If f(x) = ∑ c<sub>n</sub>(x − a)<sup>n</sup> has radius R &gt; 0, then on |x − a| &lt; R<br>f′(x) = ∑ n c<sub>n</sub>(x − a)<sup>n−1</sup>      ∫ f(x) dx = C + ∑ c<sub>n</sub>(x − a)<sup>n+1</sup>/(n + 1)<br>and both series have the same radius R (endpoints may change).</div>
<div class="callout"><p><b>4 — differentiate.</b> d/dx [1/(1 − x)] = 1/(1 − x)<sup>2</sup> = ∑<sub>n=1</sub><sup>∞</sup> n x<sup>n−1</sup> = 1 + 2x + 3x<sup>2</sup> + ⋯, |x| &lt; 1.</p>
<p><b>5 — integrate to get ln.</b> 1/(1 + x) = ∑(−1)<sup>n</sup>x<sup>n</sup>; integrate from 0: <b>ln(1 + x) = x − x<sup>2</sup>/2 + x<sup>3</sup>/3 − ⋯ = ∑<sub>n=1</sub><sup>∞</sup> (−1)<sup>n−1</sup>x<sup>n</sup>/n</b>, interval (−1, 1]. At x = 1 this proves 1 − 1/2 + 1/3 − ⋯ = ln 2 (Lesson 5.1).</p>
<p><b>6 — integrate to get arctan.</b> Integrate Example 1: <b>arctan x = x − x<sup>3</sup>/3 + x<sup>5</sup>/5 − ⋯ = ∑ (−1)<sup>n</sup>x<sup>2n+1</sup>/(2n + 1)</b>, interval [−1, 1]. At x = 1: π/4 = 1 − 1/3 + 1/5 − ⋯ (the Leibniz formula).</p></div>
<div class="callout"><p><b>Example 7 — summing a numerical series.</b> ∑<sub>n=1</sub><sup>∞</sup> n/2<sup>n</sup>. Multiply Example 4 by x: x/(1 − x)<sup>2</sup> = ∑ n x<sup>n</sup>. At x = 1/2: (1/2)/(1/4) = <b>2</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the constant C when integrating (find it by evaluating at the centre: ln(1 + 0) = 0 ⇒ C = 0).</li><li>Changing the radius when differentiating — R stays; only endpoint behaviour can change.</li><li>Starting the differentiated series at n = 0 (the constant term disappears).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>1/(1 − u) = ∑u<sup>n</sup> for |u| &lt; 1: substitute u = −x<sup>2</sup>, x/2, …</li><li>Term-by-term derivative and integral keep R.</li><li>ln(1 + x) = ∑(−1)<sup>n−1</sup>x<sup>n</sup>/n; arctan x = ∑(−1)<sup>n</sup>x<sup>2n+1</sup>/(2n + 1).</li><li>∑ n x<sup>n</sup> = x/(1 − x)<sup>2</sup> sums ∑ n/2<sup>n</sup> = 2.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS2 + '6-2-properties-of-power-series', 'OpenStax Vol. 2 — 6.2 Properties of Power Series') + `</li><li>` + A(PN2 + 'PowerSeriesandFunctions.aspx', "Paul's Online Notes — Power Series and Functions") + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>Power series and radius for 1/(1 + 4x<sup>2</sup>).</li><li>Find ∑<sub>n=1</sub><sup>∞</sup> n/3<sup>n</sup>.</li><li>Power series for ln(1 − x) and its radius.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) ∑(−1)<sup>n</sup>4<sup>n</sup>x<sup>2n</sup>, |4x<sup>2</sup>| &lt; 1 ⇒ <b>R = 1/2</b>. 2) x/(1 − x)<sup>2</sup> at x = 1/3: (1/3)/(4/9) = <b>3/4</b>. 3) Integrate −1/(1 − x) = −∑x<sup>n</sup>: <b>ln(1 − x) = −∑<sub>n=1</sub><sup>∞</sup> x<sup>n</sup>/n</b>, R = 1.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 6 · Bài 6.2</span>
<h2>Biểu diễn hàm bằng chuỗi luỹ thừa</h2>
<p class="lead">Chuỗi hình học 1/(1 − x) = 1 + x + x<sup>2</sup> + ⋯ là một khuôn mẫu. Bằng cách <strong>thay biến</strong>, <strong>nhân</strong>, <strong>đạo hàm</strong> và <strong>tích phân</strong> nó, ta có chuỗi luỹ thừa cho rất nhiều hàm — kể cả ln và arctan — mà không phải tính tay một đạo hàm nào.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dựng chuỗi luỹ thừa từ chuỗi hình học bằng biến đổi đại số.</li><li>Đạo hàm và tích phân chuỗi luỹ thừa từng số hạng.</li><li>Dùng chuỗi luỹ thừa để tính tổng chuỗi số.</li></ul>
<h3>📖 Thay biến</h3>
<div class="callout"><p><b>1.</b> 1/(1 + x<sup>2</sup>) = 1/(1 − (−x<sup>2</sup>)) = ∑ (−1)<sup>n</sup>x<sup>2n</sup> = 1 − x<sup>2</sup> + x<sup>4</sup> − ⋯, đúng khi |x<sup>2</sup>| &lt; 1, tức <b>|x| &lt; 1</b>.</p>
<p><b>2.</b> 1/(2 − x) = (1/2) · 1/(1 − x/2) = ∑ x<sup>n</sup>/2<sup>n+1</sup> = 1/2 + x/4 + x<sup>2</sup>/8 + ⋯, đúng khi |x/2| &lt; 1: <b>R = 2</b>.</p>
<p><b>3.</b> x<sup>2</sup>/(1 + x<sup>3</sup>) = x<sup>2</sup> ∑(−1)<sup>n</sup>x<sup>3n</sup> = ∑ (−1)<sup>n</sup>x<sup>3n+2</sup> = x<sup>2</sup> − x<sup>5</sup> + x<sup>8</sup> − ⋯, <b>R = 1</b>.</p></div>
<h3>📖 Giải tích từng số hạng</h3>
<div class="formula"><span class="lbl">Định lý</span>Nếu f(x) = ∑ c<sub>n</sub>(x − a)<sup>n</sup> có bán kính R &gt; 0 thì trên |x − a| &lt; R<br>f′(x) = ∑ n c<sub>n</sub>(x − a)<sup>n−1</sup>      ∫ f(x) dx = C + ∑ c<sub>n</sub>(x − a)<sup>n+1</sup>/(n + 1)<br>và cả hai chuỗi có cùng bán kính R (đầu mút có thể đổi).</div>
<div class="callout"><p><b>4 — đạo hàm.</b> d/dx [1/(1 − x)] = 1/(1 − x)<sup>2</sup> = ∑<sub>n=1</sub><sup>∞</sup> n x<sup>n−1</sup> = 1 + 2x + 3x<sup>2</sup> + ⋯, |x| &lt; 1.</p>
<p><b>5 — tích phân ra ln.</b> 1/(1 + x) = ∑(−1)<sup>n</sup>x<sup>n</sup>; tích phân từ 0: <b>ln(1 + x) = x − x<sup>2</sup>/2 + x<sup>3</sup>/3 − ⋯ = ∑<sub>n=1</sub><sup>∞</sup> (−1)<sup>n−1</sup>x<sup>n</sup>/n</b>, miền (−1, 1]. Tại x = 1 điều này chứng minh 1 − 1/2 + 1/3 − ⋯ = ln 2 (Bài 5.1).</p>
<p><b>6 — tích phân ra arctan.</b> Tích phân Ví dụ 1: <b>arctan x = x − x<sup>3</sup>/3 + x<sup>5</sup>/5 − ⋯ = ∑ (−1)<sup>n</sup>x<sup>2n+1</sup>/(2n + 1)</b>, miền [−1, 1]. Tại x = 1: π/4 = 1 − 1/3 + 1/5 − ⋯ (công thức Leibniz).</p></div>
<div class="callout"><p><b>Ví dụ 7 — tính tổng chuỗi số.</b> ∑<sub>n=1</sub><sup>∞</sup> n/2<sup>n</sup>. Nhân Ví dụ 4 với x: x/(1 − x)<sup>2</sup> = ∑ n x<sup>n</sup>. Tại x = 1/2: (1/2)/(1/4) = <b>2</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên hằng số C khi tích phân (tìm bằng cách thế tâm: ln(1 + 0) = 0 ⇒ C = 0).</li><li>Đổi bán kính khi đạo hàm — R giữ nguyên; chỉ hành vi ở đầu mút có thể đổi.</li><li>Cho chuỗi đạo hàm bắt đầu từ n = 0 (số hạng hằng biến mất).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>1/(1 − u) = ∑u<sup>n</sup> khi |u| &lt; 1: thay u = −x<sup>2</sup>, x/2, …</li><li>Đạo hàm, tích phân từng số hạng giữ nguyên R.</li><li>ln(1 + x) = ∑(−1)<sup>n−1</sup>x<sup>n</sup>/n; arctan x = ∑(−1)<sup>n</sup>x<sup>2n+1</sup>/(2n + 1).</li><li>∑ n x<sup>n</sup> = x/(1 − x)<sup>2</sup> cho ∑ n/2<sup>n</sup> = 2.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS2 + '6-2-properties-of-power-series', 'OpenStax Vol. 2 — 6.2 Tính chất của chuỗi luỹ thừa') + `</li><li>` + A(PN2 + 'PowerSeriesandFunctions.aspx', "Paul's Online Notes — Chuỗi luỹ thừa và hàm số") + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Chuỗi luỹ thừa và bán kính của 1/(1 + 4x<sup>2</sup>).</li><li>Tính ∑<sub>n=1</sub><sup>∞</sup> n/3<sup>n</sup>.</li><li>Chuỗi luỹ thừa của ln(1 − x) và bán kính.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) ∑(−1)<sup>n</sup>4<sup>n</sup>x<sup>2n</sup>, |4x<sup>2</sup>| &lt; 1 ⇒ <b>R = 1/2</b>. 2) x/(1 − x)<sup>2</sup> tại x = 1/3: (1/3)/(4/9) = <b>3/4</b>. 3) Tích phân −1/(1 − x) = −∑x<sup>n</sup>: <b>ln(1 − x) = −∑<sub>n=1</sub><sup>∞</sup> x<sup>n</sup>/n</b>, R = 1.</p></div>`);

const c63 = L('cal121-ts-6-3',
  '6.3 — Taylor and Maclaurin series|||6.3 — Chuỗi Taylor và Maclaurin',
  'Công thức hệ số cₙ = f⁽ⁿ⁾(a)/n!; bảng chuỗi Maclaurin chuẩn (eˣ, sin, cos, ln(1+x), arctan, nhị thức (1+x)ᵏ); Taylor của √x tại 4, ln x tại 1; tính ∫₀¹e^(−x²)dx ≈ 0,7475 và lim (sin x − x)/x³ = −1/6.',
  `<span class="eyebrow">CAL121 · Chapter 6 · Lesson 6.3</span>
<h2>Taylor and Maclaurin series</h2>
<p class="lead">If a function equals a power series, the coefficients are forced: they are its derivatives at the centre divided by factorials. This gives a universal recipe — the <strong>Taylor series</strong> — and a short table of series every engineer and data scientist uses.</p>
<h3>🎯 Objectives</h3>
<ul><li>Derive the Taylor coefficients c<sub>n</sub> = f<sup>(n)</sup>(a)/n!.</li><li>Know the standard Maclaurin series and their intervals.</li><li>Use series to integrate, take limits and build new series.</li></ul>
<h3>📖 Lecture</h3>
<p>Suppose f(x) = c<sub>0</sub> + c<sub>1</sub>(x − a) + c<sub>2</sub>(x − a)<sup>2</sup> + ⋯. Put x = a: c<sub>0</sub> = f(a). Differentiate and put x = a: c<sub>1</sub> = f′(a). Again: 2c<sub>2</sub> = f″(a). In general n! c<sub>n</sub> = f<sup>(n)</sup>(a).</p>
<div class="formula"><span class="lbl">Taylor series of f at a</span>f(x) = ∑<sub>n=0</sub><sup>∞</sup> f<sup>(n)</sup>(a)/n! · (x − a)<sup>n</sup> = f(a) + f′(a)(x − a) + f″(a)/2! (x − a)<sup>2</sup> + ⋯     (Maclaurin series: a = 0)</div>
<div class="formula"><span class="lbl">Standard Maclaurin series</span>e<sup>x</sup> = 1 + x + x<sup>2</sup>/2! + x<sup>3</sup>/3! + ⋯   (all x)<br>sin x = x − x<sup>3</sup>/3! + x<sup>5</sup>/5! − ⋯   (all x)<br>cos x = 1 − x<sup>2</sup>/2! + x<sup>4</sup>/4! − ⋯   (all x)<br>ln(1 + x) = x − x<sup>2</sup>/2 + x<sup>3</sup>/3 − ⋯   (−1 &lt; x ≤ 1)<br>arctan x = x − x<sup>3</sup>/3 + x<sup>5</sup>/5 − ⋯   (−1 ≤ x ≤ 1)<br>(1 + x)<sup>k</sup> = 1 + kx + k(k − 1)/2! x<sup>2</sup> + k(k − 1)(k − 2)/3! x<sup>3</sup> + ⋯   (|x| &lt; 1, binomial series)</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>1 — e<sup>x</sup>.</b> Every derivative of e<sup>x</sup> is e<sup>x</sup>, equal to 1 at 0, so c<sub>n</sub> = 1/n!. Ratio test: R = ∞. The Taylor series at a = 1 is e + e(x − 1) + e(x − 1)<sup>2</sup>/2 + ⋯.</p>
<p><b>2 — √x at a = 4.</b> f(4) = 2, f′ = 1/(2√x) → 1/4, f″ = −1/(4x<sup>3/2</sup>) → −1/32. So √x ≈ <b>2 + (x − 4)/4 − (x − 4)<sup>2</sup>/64</b>.</p>
<p><b>3 — ln x at a = 1.</b> (x − 1) − (x − 1)<sup>2</sup>/2 + (x − 1)<sup>3</sup>/3 − ⋯ (same as ln(1 + u) with u = x − 1).</p>
<p><b>4 — new series by substitution.</b> e<sup>−x<sup>2</sup></sup> = ∑ (−1)<sup>n</sup>x<sup>2n</sup>/n!; cos(x<sup>2</sup>) = 1 − x<sup>4</sup>/2 + x<sup>8</sup>/24 − ⋯; x e<sup>x</sup> = x + x<sup>2</sup> + x<sup>3</sup>/2 + ⋯.</p></div>
<div class="callout"><p><b>Example 5 — an integral with no elementary antiderivative.</b> ∫<sub>0</sub><sup>1</sup> e<sup>−x<sup>2</sup></sup> dx = ∑ (−1)<sup>n</sup>/((2n + 1) n!) = 1 − 1/3 + 1/10 − 1/42 + 1/216 − ⋯. Five terms give <b>0.74749</b>; the alternating series estimate bounds the error by the next term 1/1320 ≈ 0.00076, and the true value is 0.746824. This integral is the heart of the normal distribution.</p></div>
<div class="callout"><p><b>Example 6 — limits.</b> (sin x − x)/x<sup>3</sup> = (−x<sup>3</sup>/6 + x<sup>5</sup>/120 − ⋯)/x<sup>3</sup> → <b>−1/6</b>. Similarly (1 − cos x)/x<sup>2</sup> → 1/2 and (e<sup>x</sup> − 1 − x)/x<sup>2</sup> → 1/2 — faster than three rounds of L'Hôpital.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the n! in the denominator.</li><li>Assuming every function equals its Taylor series everywhere — ln(1 + x) only for −1 &lt; x ≤ 1 (and there exist functions whose Taylor series converges to the wrong function).</li><li>Substituting into the interval incorrectly: e<sup>−x<sup>2</sup></sup> still converges for all x, but 1/(1 + x<sup>2</sup>) only for |x| &lt; 1.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>c<sub>n</sub> = f<sup>(n)</sup>(a)/n!.</li><li>Memorise e<sup>x</sup>, sin, cos, ln(1 + x), arctan, (1 + x)<sup>k</sup> with their intervals.</li><li>Build new series by substitution, multiplication, differentiation, integration.</li><li>Series turn hard integrals and limits into arithmetic.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS2 + '6-3-taylor-and-maclaurin-series', 'OpenStax Vol. 2 — 6.3 Taylor and Maclaurin Series') + `</li><li>` + A(PN2 + 'TaylorSeries.aspx', "Paul's Online Notes — Taylor Series") + `</li><li>` + A(PN2 + 'BinomialSeries.aspx', "Paul's Online Notes — Binomial Series") + `</li><li>` + A('https://www.3blue1brown.com/lessons/taylor-series', '3Blue1Brown — Taylor series (visual)') + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>Maclaurin series of x<sup>2</sup> sin x (first three non-zero terms).</li><li>Use the binomial series to write the first four terms of √(1 + x).</li><li>lim<sub>x→0</sub> (x − arctan x)/x<sup>3</sup>.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) <b>x<sup>3</sup> − x<sup>5</sup>/6 + x<sup>7</sup>/120</b>. 2) k = 1/2: <b>1 + x/2 − x<sup>2</sup>/8 + x<sup>3</sup>/16</b>. 3) x − (x − x<sup>3</sup>/3 + ⋯) = x<sup>3</sup>/3 − ⋯ ⇒ <b>1/3</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 6 · Bài 6.3</span>
<h2>Chuỗi Taylor và Maclaurin</h2>
<p class="lead">Nếu một hàm bằng một chuỗi luỹ thừa, các hệ số bị ép buộc: chúng là các đạo hàm tại tâm chia cho giai thừa. Điều này cho một công thức vạn năng — <strong>chuỗi Taylor</strong> — và một bảng ngắn các chuỗi mà kỹ sư, nhà khoa học dữ liệu nào cũng dùng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dựng hệ số Taylor c<sub>n</sub> = f<sup>(n)</sup>(a)/n!.</li><li>Thuộc các chuỗi Maclaurin chuẩn và miền hội tụ của chúng.</li><li>Dùng chuỗi để tính tích phân, giới hạn và dựng chuỗi mới.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Giả sử f(x) = c<sub>0</sub> + c<sub>1</sub>(x − a) + c<sub>2</sub>(x − a)<sup>2</sup> + ⋯. Thế x = a: c<sub>0</sub> = f(a). Đạo hàm rồi thế x = a: c<sub>1</sub> = f′(a). Lần nữa: 2c<sub>2</sub> = f″(a). Tổng quát n! c<sub>n</sub> = f<sup>(n)</sup>(a).</p>
<div class="formula"><span class="lbl">Chuỗi Taylor của f tại a</span>f(x) = ∑<sub>n=0</sub><sup>∞</sup> f<sup>(n)</sup>(a)/n! · (x − a)<sup>n</sup> = f(a) + f′(a)(x − a) + f″(a)/2! (x − a)<sup>2</sup> + ⋯     (chuỗi Maclaurin: a = 0)</div>
<div class="formula"><span class="lbl">Các chuỗi Maclaurin chuẩn</span>e<sup>x</sup> = 1 + x + x<sup>2</sup>/2! + x<sup>3</sup>/3! + ⋯   (mọi x)<br>sin x = x − x<sup>3</sup>/3! + x<sup>5</sup>/5! − ⋯   (mọi x)<br>cos x = 1 − x<sup>2</sup>/2! + x<sup>4</sup>/4! − ⋯   (mọi x)<br>ln(1 + x) = x − x<sup>2</sup>/2 + x<sup>3</sup>/3 − ⋯   (−1 &lt; x ≤ 1)<br>arctan x = x − x<sup>3</sup>/3 + x<sup>5</sup>/5 − ⋯   (−1 ≤ x ≤ 1)<br>(1 + x)<sup>k</sup> = 1 + kx + k(k − 1)/2! x<sup>2</sup> + k(k − 1)(k − 2)/3! x<sup>3</sup> + ⋯   (|x| &lt; 1, chuỗi nhị thức)</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>1 — e<sup>x</sup>.</b> Mọi đạo hàm của e<sup>x</sup> là e<sup>x</sup>, bằng 1 tại 0, nên c<sub>n</sub> = 1/n!. Tiêu chuẩn tỉ số: R = ∞. Chuỗi Taylor tại a = 1 là e + e(x − 1) + e(x − 1)<sup>2</sup>/2 + ⋯.</p>
<p><b>2 — √x tại a = 4.</b> f(4) = 2, f′ = 1/(2√x) → 1/4, f″ = −1/(4x<sup>3/2</sup>) → −1/32. Vậy √x ≈ <b>2 + (x − 4)/4 − (x − 4)<sup>2</sup>/64</b>.</p>
<p><b>3 — ln x tại a = 1.</b> (x − 1) − (x − 1)<sup>2</sup>/2 + (x − 1)<sup>3</sup>/3 − ⋯ (giống ln(1 + u) với u = x − 1).</p>
<p><b>4 — chuỗi mới bằng thay biến.</b> e<sup>−x<sup>2</sup></sup> = ∑ (−1)<sup>n</sup>x<sup>2n</sup>/n!; cos(x<sup>2</sup>) = 1 − x<sup>4</sup>/2 + x<sup>8</sup>/24 − ⋯; x e<sup>x</sup> = x + x<sup>2</sup> + x<sup>3</sup>/2 + ⋯.</p></div>
<div class="callout"><p><b>Ví dụ 5 — tích phân không có nguyên hàm sơ cấp.</b> ∫<sub>0</sub><sup>1</sup> e<sup>−x<sup>2</sup></sup> dx = ∑ (−1)<sup>n</sup>/((2n + 1) n!) = 1 − 1/3 + 1/10 − 1/42 + 1/216 − ⋯. Năm số hạng cho <b>0,74749</b>; ước lượng chuỗi đan dấu chặn sai số bởi số hạng kế 1/1320 ≈ 0,00076, và giá trị đúng là 0,746824. Tích phân này là trái tim của phân phối chuẩn.</p></div>
<div class="callout"><p><b>Ví dụ 6 — giới hạn.</b> (sin x − x)/x<sup>3</sup> = (−x<sup>3</sup>/6 + x<sup>5</sup>/120 − ⋯)/x<sup>3</sup> → <b>−1/6</b>. Tương tự (1 − cos x)/x<sup>2</sup> → 1/2 và (e<sup>x</sup> − 1 − x)/x<sup>2</sup> → 1/2 — nhanh hơn ba lần L'Hôpital.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên n! ở mẫu.</li><li>Tưởng mọi hàm đều bằng chuỗi Taylor của nó ở mọi nơi — ln(1 + x) chỉ đúng khi −1 &lt; x ≤ 1 (và có những hàm mà chuỗi Taylor hội tụ về một hàm khác).</li><li>Thay biến vào miền hội tụ sai: e<sup>−x<sup>2</sup></sup> vẫn hội tụ với mọi x, nhưng 1/(1 + x<sup>2</sup>) chỉ khi |x| &lt; 1.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>c<sub>n</sub> = f<sup>(n)</sup>(a)/n!.</li><li>Thuộc e<sup>x</sup>, sin, cos, ln(1 + x), arctan, (1 + x)<sup>k</sup> cùng miền hội tụ.</li><li>Dựng chuỗi mới bằng thay biến, nhân, đạo hàm, tích phân.</li><li>Chuỗi biến tích phân và giới hạn khó thành phép tính số học.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS2 + '6-3-taylor-and-maclaurin-series', 'OpenStax Vol. 2 — 6.3 Chuỗi Taylor và Maclaurin') + `</li><li>` + A(PN2 + 'TaylorSeries.aspx', "Paul's Online Notes — Taylor Series") + `</li><li>` + A(PN2 + 'BinomialSeries.aspx', "Paul's Online Notes — Chuỗi nhị thức") + `</li><li>` + A('https://www.3blue1brown.com/lessons/taylor-series', '3Blue1Brown — Chuỗi Taylor (trực quan)') + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Chuỗi Maclaurin của x<sup>2</sup> sin x (ba số hạng khác 0 đầu tiên).</li><li>Dùng chuỗi nhị thức viết bốn số hạng đầu của √(1 + x).</li><li>lim<sub>x→0</sub> (x − arctan x)/x<sup>3</sup>.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) <b>x<sup>3</sup> − x<sup>5</sup>/6 + x<sup>7</sup>/120</b>. 2) k = 1/2: <b>1 + x/2 − x<sup>2</sup>/8 + x<sup>3</sup>/16</b>. 3) x − (x − x<sup>3</sup>/3 + ⋯) = x<sup>3</sup>/3 − ⋯ ⇒ <b>1/3</b>.</p></div>`);

const c64 = L('cal121-ts-6-4',
  '6.4 — Taylor polynomials, Taylor’s inequality and applications|||6.4 — Đa thức Taylor, bất đẳng thức Taylor và ứng dụng',
  'Đa thức Taylor Tₙ, phần dư và bất đẳng thức Taylor |Rₙ| ≤ M|x−a|ⁿ⁺¹/(n+1)!; ước lượng sin 0,5, √1,1, cos 0,2; code Python T_n(1) của eˣ so với e kèm cận sai số; ứng dụng trong máy tính và vật lý.',
  `<span class="eyebrow">CAL121 · Chapter 6 · Lesson 6.4</span>
<h2>Taylor polynomials, Taylor's inequality and applications</h2>
<p class="lead">In practice we never add infinitely many terms. We stop at degree n — the <strong>Taylor polynomial</strong> T<sub>n</sub> — and we need a <strong>guarantee</strong> on how far T<sub>n</sub>(x) can be from f(x). That guarantee is Taylor's inequality.</p>
<h3>🎯 Objectives</h3>
<ul><li>Build T<sub>n</sub> and use it to approximate values.</li><li>Bound the remainder with Taylor's inequality (or the alternating series estimate).</li><li>Choose n to reach a required accuracy.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Taylor polynomial and remainder</span>T<sub>n</sub>(x) = ∑<sub>k=0</sub><sup>n</sup> f<sup>(k)</sup>(a)/k! · (x − a)<sup>k</sup>        R<sub>n</sub>(x) = f(x) − T<sub>n</sub>(x)</div>
<div class="formula"><span class="lbl">Taylor's inequality</span>If |f<sup>(n+1)</sup>(t)| ≤ M for all t between a and x, then |R<sub>n</sub>(x)| ≤ M |x − a|<sup>n+1</sup>/(n + 1)!</div>
<p>T<sub>1</sub> is the tangent line (the linear approximation of CAL111); T<sub>2</sub> adds curvature. The factorial in the bound is why Taylor polynomials become accurate so quickly near a.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>1 — sin 0.5.</b> T<sub>3</sub>(x) = x − x<sup>3</sup>/6 gives 0.5 − 0.125/6 = <b>0.4791667</b>. True value 0.4794255; error 0.000259. Since the x<sup>4</sup> coefficient is 0, T<sub>3</sub> = T<sub>4</sub>, so Taylor with n = 4, M = 1: |R| ≤ 0.5<sup>5</sup>/5! = 0.00026 ✓ (the alternating series estimate gives the same).</p>
<p><b>2 — √1.1</b> with the binomial series, x = 0.1: 1 + 0.05 − 0.00125 = <b>1.04875</b>; true 1.0488088. The next term x<sup>3</sup>/16 = 0.0000625 bounds the error (alternating, decreasing terms).</p>
<p><b>3 — physics' small-angle rule.</b> cos θ ≈ 1 − θ<sup>2</sup>/2: for θ = 0.2 rad this gives 0.98 versus 0.980067, error below θ<sup>4</sup>/24 ≈ 0.000067. This is why a pendulum with small swings behaves like a simple harmonic oscillator.</p></div>
<h3>💻 How fast does T<sub>n</sub>(1) approach e?</h3>
<p>For f = e<sup>x</sup> on [0, 1], every derivative is at most e &lt; 3, so take M = 3: |R<sub>n</sub>(1)| ≤ 3/(n + 1)!.</p>
` + TAYLOR_PY + `
<p>The real error is always below the guaranteed bound, and eight terms already give six correct decimals. Libraries that compute exp, sin and log do the same thing — reduce the argument to a small interval, then evaluate a carefully chosen polynomial.</p>
<h3>📖 Choosing n for a target accuracy</h3>
<div class="callout"><p><b>Example 4.</b> How many terms of the Maclaurin series of e<sup>x</sup> give e<sup>0.1</sup> within 10<sup>−6</sup>? Bound: M = e<sup>0.1</sup> &lt; 2, so need 2(0.1)<sup>n+1</sup>/(n + 1)! &lt; 10<sup>−6</sup>. n = 3: 2 · 10<sup>−4</sup>/24 ≈ 8.3 · 10<sup>−6</sup> (no); n = 4: 2 · 10<sup>−5</sup>/120 ≈ 1.7 · 10<sup>−7</sup> (yes). So <b>T<sub>4</sub></b>. (Even T<sub>2</sub> = 1.105 is within 0.00017 of 1.1051709.)</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using M for f<sup>(n)</sup> instead of f<sup>(n+1)</sup>.</li><li>Taking M at a single point instead of the maximum over the whole interval between a and x.</li><li>Using a Taylor polynomial far from its centre — the error bound grows like |x − a|<sup>n+1</sup>.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>T<sub>n</sub> = first n + 1 terms of the Taylor series.</li><li>|R<sub>n</sub>| ≤ M|x − a|<sup>n+1</sup>/(n + 1)!.</li><li>For alternating series the next term bounds the error.</li><li>Small-angle and binomial approximations are Taylor polynomials.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS2 + '6-4-working-with-taylor-series', 'OpenStax Vol. 2 — 6.4 Working with Taylor Series') + `</li><li>` + A(PN2 + 'TaylorSeries.aspx', "Paul's Online Notes — Taylor Series (remainder)") + `</li><li>` + A('https://www.youtube.com/watch?v=3d6DsjIBzJ4', '3Blue1Brown — Taylor series, Essence of calculus ch. 11 (YouTube)') + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write T<sub>2</sub> of ln x at a = 1 and use it to estimate ln 1.1.</li><li>Use Taylor's inequality to bound the error of T<sub>3</sub>(x) for cos x at x = 0.5 (note T<sub>3</sub> = T<sub>2</sub>).</li><li>How many terms of the series for e<sup>x</sup> guarantee e within 0.001?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) T<sub>2</sub> = (x − 1) − (x − 1)<sup>2</sup>/2 ⇒ 0.1 − 0.005 = <b>0.095</b> (true 0.09531). 2) M = 1, n = 3: |R| ≤ 0.5<sup>4</sup>/24 ≈ <b>0.0026</b> (actual |cos 0.5 − 0.875| ≈ 0.0026). 3) 3/(n + 1)! &lt; 0.001 ⇒ (n + 1)! &gt; 3000 ⇒ n + 1 = 7 ⇒ <b>n = 6</b> (the table shows error 2.26 · 10<sup>−4</sup>).</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 6 · Bài 6.4</span>
<h2>Đa thức Taylor, bất đẳng thức Taylor và ứng dụng</h2>
<p class="lead">Thực tế ta không bao giờ cộng vô hạn số hạng. Ta dừng ở bậc n — <strong>đa thức Taylor</strong> T<sub>n</sub> — và cần một <strong>bảo đảm</strong> rằng T<sub>n</sub>(x) cách f(x) không quá bao nhiêu. Bảo đảm đó là bất đẳng thức Taylor.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dựng T<sub>n</sub> và dùng nó để xấp xỉ giá trị.</li><li>Chặn phần dư bằng bất đẳng thức Taylor (hoặc ước lượng chuỗi đan dấu).</li><li>Chọn n để đạt độ chính xác yêu cầu.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Đa thức Taylor và phần dư</span>T<sub>n</sub>(x) = ∑<sub>k=0</sub><sup>n</sup> f<sup>(k)</sup>(a)/k! · (x − a)<sup>k</sup>        R<sub>n</sub>(x) = f(x) − T<sub>n</sub>(x)</div>
<div class="formula"><span class="lbl">Bất đẳng thức Taylor</span>Nếu |f<sup>(n+1)</sup>(t)| ≤ M với mọi t giữa a và x thì |R<sub>n</sub>(x)| ≤ M |x − a|<sup>n+1</sup>/(n + 1)!</div>
<p>T<sub>1</sub> là tiếp tuyến (xấp xỉ tuyến tính của CAL111); T<sub>2</sub> thêm độ cong. Giai thừa trong cận là lý do đa thức Taylor chính xác rất nhanh gần a.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>1 — sin 0,5.</b> T<sub>3</sub>(x) = x − x<sup>3</sup>/6 cho 0,5 − 0,125/6 = <b>0,4791667</b>. Giá trị đúng 0,4794255; sai số 0,000259. Vì hệ số của x<sup>4</sup> bằng 0, T<sub>3</sub> = T<sub>4</sub>, nên Taylor với n = 4, M = 1: |R| ≤ 0,5<sup>5</sup>/5! = 0,00026 ✓ (ước lượng chuỗi đan dấu cho cùng kết quả).</p>
<p><b>2 — √1,1</b> bằng chuỗi nhị thức, x = 0,1: 1 + 0,05 − 0,00125 = <b>1,04875</b>; đúng 1,0488088. Số hạng kế x<sup>3</sup>/16 = 0,0000625 chặn sai số (đan dấu, giảm dần).</p>
<p><b>3 — quy tắc góc nhỏ trong vật lý.</b> cos θ ≈ 1 − θ<sup>2</sup>/2: với θ = 0,2 rad được 0,98 so với 0,980067, sai số dưới θ<sup>4</sup>/24 ≈ 0,000067. Đây là lý do con lắc dao động nhỏ hành xử như dao động điều hoà.</p></div>
<h3>💻 T<sub>n</sub>(1) tiến về e nhanh cỡ nào?</h3>
<p>Với f = e<sup>x</sup> trên [0, 1], mọi đạo hàm không quá e &lt; 3, nên lấy M = 3: |R<sub>n</sub>(1)| ≤ 3/(n + 1)!.</p>
` + TAYLOR_PY + `
<p>Sai số thật luôn dưới cận bảo đảm, và tám số hạng đã cho sáu chữ số thập phân đúng. Các thư viện tính exp, sin, log làm đúng như vậy — đưa đối số về một khoảng nhỏ, rồi tính một đa thức được chọn kỹ.</p>
<h3>📖 Chọn n cho độ chính xác mục tiêu</h3>
<div class="callout"><p><b>Ví dụ 4.</b> Cần bao nhiêu số hạng chuỗi Maclaurin của e<sup>x</sup> để tính e<sup>0,1</sup> sai số dưới 10<sup>−6</sup>? Cận: M = e<sup>0,1</sup> &lt; 2, cần 2(0,1)<sup>n+1</sup>/(n + 1)! &lt; 10<sup>−6</sup>. n = 3: 2 · 10<sup>−4</sup>/24 ≈ 8,3 · 10<sup>−6</sup> (chưa); n = 4: 2 · 10<sup>−5</sup>/120 ≈ 1,7 · 10<sup>−7</sup> (được). Vậy <b>T<sub>4</sub></b>. (Ngay T<sub>2</sub> = 1,105 đã cách 1,1051709 chưa tới 0,00017.)</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Lấy M cho f<sup>(n)</sup> thay vì f<sup>(n+1)</sup>.</li><li>Lấy M tại một điểm thay vì giá trị lớn nhất trên cả khoảng giữa a và x.</li><li>Dùng đa thức Taylor ở xa tâm — cận sai số tăng như |x − a|<sup>n+1</sup>.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>T<sub>n</sub> = n + 1 số hạng đầu của chuỗi Taylor.</li><li>|R<sub>n</sub>| ≤ M|x − a|<sup>n+1</sup>/(n + 1)!.</li><li>Với chuỗi đan dấu, số hạng kế chặn sai số.</li><li>Xấp xỉ góc nhỏ và xấp xỉ nhị thức chính là đa thức Taylor.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS2 + '6-4-working-with-taylor-series', 'OpenStax Vol. 2 — 6.4 Làm việc với chuỗi Taylor') + `</li><li>` + A(PN2 + 'TaylorSeries.aspx', "Paul's Online Notes — Taylor Series (phần dư)") + `</li><li>` + A('https://www.youtube.com/watch?v=3d6DsjIBzJ4', '3Blue1Brown — Chuỗi Taylor, Essence of calculus chương 11 (YouTube)') + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết T<sub>2</sub> của ln x tại a = 1 rồi ước lượng ln 1,1.</li><li>Dùng bất đẳng thức Taylor chặn sai số của T<sub>3</sub>(x) cho cos x tại x = 0,5 (chú ý T<sub>3</sub> = T<sub>2</sub>).</li><li>Cần bao nhiêu số hạng chuỗi e<sup>x</sup> để chắc tính e sai số dưới 0,001?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) T<sub>2</sub> = (x − 1) − (x − 1)<sup>2</sup>/2 ⇒ 0,1 − 0,005 = <b>0,095</b> (đúng 0,09531). 2) M = 1, n = 3: |R| ≤ 0,5<sup>4</sup>/24 ≈ <b>0,0026</b> (thực tế |cos 0,5 − 0,875| ≈ 0,0026). 3) 3/(n + 1)! &lt; 0,001 ⇒ (n + 1)! &gt; 3000 ⇒ n + 1 = 7 ⇒ <b>n = 6</b> (bảng cho sai số 2,26 · 10<sup>−4</sup>).</p></div>`);

const q6 = QZ(6, 'Quiz — Chapter 6: Power series and Taylor series|||Quiz — Chương 6: Chuỗi luỹ thừa và chuỗi Taylor', 'Kiểm tra chương 6: bán kính/miền hội tụ, biểu diễn hàm bằng chuỗi, chuỗi Maclaurin chuẩn, đa thức Taylor và cận sai số.', [
  Q('q1', 'The interval of convergence of Σ xⁿ/n is|||Miền hội tụ của Σ xⁿ/n là',
    ['(−1, 1)|||(−1, 1)', '[−1, 1)|||[−1, 1)', '(−1, 1]|||(−1, 1]', '[−1, 1]|||[−1, 1]'], 1,
    'R = 1; x = 1 gives the harmonic series, x = −1 the alternating harmonic series.|||R = 1; x = 1 cho chuỗi điều hoà, x = −1 cho chuỗi điều hoà đan dấu.'),
  Q('q2', 'The radius of convergence of Σ n! xⁿ is|||Bán kính hội tụ của Σ n! xⁿ là',
    ['0|||0', '1|||1', 'e|||e', '∞|||∞'], 0,
    'Ratio (n + 1)|x| → ∞ for every x ≠ 0.|||Tỉ số (n + 1)|x| → ∞ với mọi x ≠ 0.'),
  Q('q3', 'Radius of Σ (x − 3)ⁿ/(n·2ⁿ):|||Bán kính của Σ (x − 3)ⁿ/(n·2ⁿ):',
    ['1/2|||1/2', '1|||1', '2|||2', '3|||3'], 2,
    'Ratio → |x − 3|/2 < 1 ⇔ |x − 3| < 2.|||Tỉ số → |x − 3|/2 < 1 ⇔ |x − 3| < 2.'),
  Q('q4', '1/(1 + x²) as a power series is|||1/(1 + x²) dưới dạng chuỗi luỹ thừa là',
    ['Σ x²ⁿ|||Σ x²ⁿ', 'Σ (−1)ⁿ x²ⁿ|||Σ (−1)ⁿ x²ⁿ', 'Σ (−1)ⁿ xⁿ|||Σ (−1)ⁿ xⁿ', 'Σ x²ⁿ/n!|||Σ x²ⁿ/n!'], 1,
    'Substitute u = −x² into 1/(1 − u).|||Thay u = −x² vào 1/(1 − u).'),
  Q('q5', 'Σₙ₌₁^∞ n/2ⁿ =|||Σₙ₌₁^∞ n/2ⁿ =',
    ['1|||1', '2|||2', '4|||4', 'diverges|||phân kỳ'], 1,
    'Σ n xⁿ = x/(1 − x)² at x = 1/2.|||Σ n xⁿ = x/(1 − x)² tại x = 1/2.'),
  Q('q6', 'The coefficient of x³ in the Maclaurin series of sin x is|||Hệ số của x³ trong chuỗi Maclaurin của sin x là',
    ['1/3|||1/3', '−1/6|||−1/6', '1/6|||1/6', '−1/3|||−1/3'], 1,
    'sin x = x − x³/3! + ⋯, and 3! = 6.|||sin x = x − x³/3! + ⋯, và 3! = 6.'),
  Q('q7', 'lim (sin x − x)/x³ as x → 0 equals|||lim (sin x − x)/x³ khi x → 0 bằng',
    ['0|||0', '−1/6|||−1/6', '1/6|||1/6', '−1|||−1'], 1,
    '(−x³/6 + ⋯)/x³ → −1/6.|||(−x³/6 + ⋯)/x³ → −1/6.'),
  Q('q8', 'The Taylor polynomial T₂ of √x at a = 4 is|||Đa thức Taylor T₂ của √x tại a = 4 là',
    ['2 + (x − 4)/4 − (x − 4)²/64|||2 + (x − 4)/4 − (x − 4)²/64', '2 + (x − 4)/2 − (x − 4)²/8|||2 + (x − 4)/2 − (x − 4)²/8', '2 + (x − 4)/4 + (x − 4)²/32|||2 + (x − 4)/4 + (x − 4)²/32', '1 + x/2 − x²/8|||1 + x/2 − x²/8'], 0,
    'f′(4) = 1/4, f″(4) = −1/32, divide by 2!.|||f′(4) = 1/4, f″(4) = −1/32, chia cho 2!.'),
  Q('q9', "Taylor's inequality bounds |Rₙ(x)| by|||Bất đẳng thức Taylor chặn |Rₙ(x)| bởi",
    ['M|x − a|ⁿ/n!|||M|x − a|ⁿ/n!', 'M|x − a|ⁿ⁺¹/(n + 1)!|||M|x − a|ⁿ⁺¹/(n + 1)!', 'M/(n + 1)|||M/(n + 1)', '(x − a)ⁿ⁺¹ with no factorial|||(x − a)ⁿ⁺¹ không có giai thừa'], 1,
    'M bounds the (n + 1)-th derivative between a and x.|||M chặn đạo hàm cấp n + 1 giữa a và x.'),
  Q('q10', 'Using 1 − 1/3 + 1/10 − 1/42 + 1/216, ∫₀¹ e^(−x²) dx ≈|||Dùng 1 − 1/3 + 1/10 − 1/42 + 1/216, ∫₀¹ e^(−x²) dx ≈',
    ['0.6321|||0,6321', '0.7475|||0,7475', '0.8862|||0,8862', '1.4627|||1,4627'], 1,
    'Term-by-term integration of Σ(−1)ⁿx²ⁿ/n!; true value 0.7468.|||Tích phân từng số hạng của Σ(−1)ⁿx²ⁿ/n!; giá trị đúng 0,7468.'),
]);

const ch6 = {
  title: 'Chapter 6 — Power series and Taylor series|||Chương 6 — Chuỗi luỹ thừa và chuỗi Taylor',
  description: 'Bán kính và miền hội tụ, biểu diễn hàm bằng chuỗi (thay biến, đạo hàm, tích phân), chuỗi Taylor/Maclaurin chuẩn, đa thức Taylor và bất đẳng thức Taylor có code Python (Stewart 11.8–11.11 · OpenStax Vol.2 ch.6).',
  lessons: [c61, c62, c63, c64, q6],
};

// ───────────────────────────── Chương 7 — Vectơ & hình học không gian ─────────────────────────────
const c71 = L('cal121-ts-7-1',
  '7.1 — Three-dimensional coordinates and vectors|||7.1 — Toạ độ ba chiều và vectơ',
  'Hệ toạ độ Oxyz, khoảng cách, phương trình mặt cầu (thêm bớt bình phương), vectơ: cộng, nhân vô hướng, độ dài, vectơ đơn vị, vectơ AB, i j k; hợp lực.',
  `<span class="eyebrow">CAL121 · Chapter 7 · Lesson 7.1</span>
<h2>Three-dimensional coordinates and vectors</h2>
<p class="lead">Multivariable calculus lives in space. Before differentiating functions of several variables we need a language for points, directions and distances in three dimensions: <strong>coordinates and vectors</strong>. The same language describes positions in a 3D game, forces on a bridge and feature vectors in machine learning.</p>
<h3>🎯 Objectives</h3>
<ul><li>Plot points in ℝ<sup>3</sup>, compute distances and recognise the equation of a sphere.</li><li>Add vectors, multiply by scalars, compute lengths and unit vectors.</li><li>Write a vector from one point to another and use the standard basis i, j, k.</li></ul>
<h3>📖 Coordinates in space</h3>
<p>A point is an ordered triple P(x, y, z) in a right-handed system (curl the fingers of your right hand from the x-axis to the y-axis: your thumb points along the z-axis). z = 0 is the xy-plane.</p>
<div class="formula"><span class="lbl">Distance and sphere</span>|P<sub>1</sub>P<sub>2</sub>| = √((x<sub>2</sub> − x<sub>1</sub>)<sup>2</sup> + (y<sub>2</sub> − y<sub>1</sub>)<sup>2</sup> + (z<sub>2</sub> − z<sub>1</sub>)<sup>2</sup>)<br>sphere with centre (h, k, l) and radius r: (x − h)<sup>2</sup> + (y − k)<sup>2</sup> + (z − l)<sup>2</sup> = r<sup>2</sup></div>
<div class="callout"><p><b>Example 1.</b> Show that x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup> − 4x + 6y − 2z − 2 = 0 is a sphere. Complete the squares: (x − 2)<sup>2</sup> − 4 + (y + 3)<sup>2</sup> − 9 + (z − 1)<sup>2</sup> − 1 − 2 = 0 ⇒ (x − 2)<sup>2</sup> + (y + 3)<sup>2</sup> + (z − 1)<sup>2</sup> = 16: <b>centre (2, −3, 1), radius 4</b>.</p></div>
<h3>📖 Vectors</h3>
<p>A <strong>vector</strong> has magnitude and direction but no fixed position: a = ⟨a<sub>1</sub>, a<sub>2</sub>, a<sub>3</sub>⟩. The vector from A(x<sub>1</sub>, y<sub>1</sub>, z<sub>1</sub>) to B(x<sub>2</sub>, y<sub>2</sub>, z<sub>2</sub>) is AB = ⟨x<sub>2</sub> − x<sub>1</sub>, y<sub>2</sub> − y<sub>1</sub>, z<sub>2</sub> − z<sub>1</sub>⟩ (“head minus tail”).</p>
<div class="formula"><span class="lbl">Operations</span>a + b = ⟨a<sub>1</sub> + b<sub>1</sub>, a<sub>2</sub> + b<sub>2</sub>, a<sub>3</sub> + b<sub>3</sub>⟩    c a = ⟨ca<sub>1</sub>, ca<sub>2</sub>, ca<sub>3</sub>⟩<br>|a| = √(a<sub>1</sub><sup>2</sup> + a<sub>2</sub><sup>2</sup> + a<sub>3</sub><sup>2</sup>)    unit vector u = a/|a|<br>i = ⟨1, 0, 0⟩, j = ⟨0, 1, 0⟩, k = ⟨0, 0, 1⟩, so ⟨a<sub>1</sub>, a<sub>2</sub>, a<sub>3</sub>⟩ = a<sub>1</sub>i + a<sub>2</sub>j + a<sub>3</sub>k</div>
<div class="callout"><p><b>Example 2.</b> a = ⟨2, −1, 3⟩, b = ⟨1, 4, −2⟩. a + b = <b>⟨3, 3, 1⟩</b>; 2a − b = <b>⟨3, −6, 8⟩</b>; |a| = √(4 + 1 + 9) = <b>√14</b>; unit vector in the direction of a: ⟨2, −1, 3⟩/√14.</p>
<p><b>Example 3.</b> A(1, 2, 3), B(4, 0, 5): AB = ⟨3, −2, 2⟩, |AB| = <b>√17</b> — the distance from A to B.</p>
<p><b>Example 4 — resultant force.</b> Two ropes pull a box with F<sub>1</sub> = ⟨30, 40, 0⟩ N and F<sub>2</sub> = ⟨−10, 20, 15⟩ N. The resultant is ⟨20, 60, 15⟩ N with magnitude √(400 + 3600 + 225) = √4225 = <b>65 N</b>.</p></div>
<p>Vector algebra obeys the familiar rules (commutative, associative, distributive). Geometrically, a + b is the diagonal of the parallelogram spanned by a and b, and ca stretches a by |c| (reversing it if c &lt; 0).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Computing AB as A − B (“tail minus head”) — the direction flips.</li><li>Forgetting the square root in |a|, or adding components instead of squaring them.</li><li>Losing the constants when completing the square for a sphere (a negative right side means no points at all).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Distance: square root of summed squared differences.</li><li>Sphere: (x − h)<sup>2</sup> + (y − k)<sup>2</sup> + (z − l)<sup>2</sup> = r<sup>2</sup>; complete the square to recognise it.</li><li>AB = B − A; |a| = √(a·a); unit vector a/|a|.</li><li>i, j, k form the standard basis.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS3 + '2-2-vectors-in-three-dimensions', 'OpenStax Calculus Vol. 3 — 2.2 Vectors in Three Dimensions') + `</li><li>` + A(PN3 + '3DCoords.aspx', "Paul's Online Notes — The 3-D Coordinate System") + `</li><li>` + A(PN2 + 'Vectors_Basics.aspx', "Paul's Online Notes — Vectors: The Basics") + `</li><li>` + A('https://www.geogebra.org/3d', 'GeoGebra 3D — plot points, vectors and spheres') + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the centre and radius of x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup> + 2x − 8z = 8.</li><li>Find a vector of length 5 in the direction of ⟨1, 2, 2⟩.</li><li>Is the triangle with vertices A(1, 0, 0), B(0, 1, 0), C(0, 0, 1) equilateral?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (x + 1)<sup>2</sup> + y<sup>2</sup> + (z − 4)<sup>2</sup> = 25: <b>centre (−1, 0, 4), radius 5</b>. 2) |⟨1, 2, 2⟩| = 3 ⇒ <b>(5/3)⟨1, 2, 2⟩ = ⟨5/3, 10/3, 10/3⟩</b>. 3) |AB| = |BC| = |CA| = √2 ⇒ <b>yes</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 7 · Bài 7.1</span>
<h2>Toạ độ ba chiều và vectơ</h2>
<p class="lead">Giải tích nhiều biến sống trong không gian. Trước khi đạo hàm hàm nhiều biến, ta cần một ngôn ngữ cho điểm, hướng và khoảng cách trong ba chiều: <strong>toạ độ và vectơ</strong>. Cùng ngôn ngữ đó mô tả vị trí trong game 3D, lực tác dụng lên cây cầu và vectơ đặc trưng trong học máy.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Biểu diễn điểm trong ℝ<sup>3</sup>, tính khoảng cách, nhận ra phương trình mặt cầu.</li><li>Cộng vectơ, nhân với số, tính độ dài và vectơ đơn vị.</li><li>Viết vectơ từ điểm này tới điểm kia và dùng cơ sở chuẩn i, j, k.</li></ul>
<h3>📖 Toạ độ trong không gian</h3>
<p>Một điểm là bộ ba có thứ tự P(x, y, z) trong hệ thuận tay phải (cong các ngón tay phải từ trục x sang trục y: ngón cái chỉ chiều trục z). z = 0 là mặt phẳng Oxy.</p>
<div class="formula"><span class="lbl">Khoảng cách và mặt cầu</span>|P<sub>1</sub>P<sub>2</sub>| = √((x<sub>2</sub> − x<sub>1</sub>)<sup>2</sup> + (y<sub>2</sub> − y<sub>1</sub>)<sup>2</sup> + (z<sub>2</sub> − z<sub>1</sub>)<sup>2</sup>)<br>mặt cầu tâm (h, k, l) bán kính r: (x − h)<sup>2</sup> + (y − k)<sup>2</sup> + (z − l)<sup>2</sup> = r<sup>2</sup></div>
<div class="callout"><p><b>Ví dụ 1.</b> Chứng tỏ x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup> − 4x + 6y − 2z − 2 = 0 là mặt cầu. Thêm bớt bình phương: (x − 2)<sup>2</sup> − 4 + (y + 3)<sup>2</sup> − 9 + (z − 1)<sup>2</sup> − 1 − 2 = 0 ⇒ (x − 2)<sup>2</sup> + (y + 3)<sup>2</sup> + (z − 1)<sup>2</sup> = 16: <b>tâm (2, −3, 1), bán kính 4</b>.</p></div>
<h3>📖 Vectơ</h3>
<p><strong>Vectơ</strong> có độ lớn và hướng nhưng không có vị trí cố định: a = ⟨a<sub>1</sub>, a<sub>2</sub>, a<sub>3</sub>⟩. Vectơ từ A(x<sub>1</sub>, y<sub>1</sub>, z<sub>1</sub>) tới B(x<sub>2</sub>, y<sub>2</sub>, z<sub>2</sub>) là AB = ⟨x<sub>2</sub> − x<sub>1</sub>, y<sub>2</sub> − y<sub>1</sub>, z<sub>2</sub> − z<sub>1</sub>⟩ (“ngọn trừ gốc”).</p>
<div class="formula"><span class="lbl">Các phép toán</span>a + b = ⟨a<sub>1</sub> + b<sub>1</sub>, a<sub>2</sub> + b<sub>2</sub>, a<sub>3</sub> + b<sub>3</sub>⟩    c a = ⟨ca<sub>1</sub>, ca<sub>2</sub>, ca<sub>3</sub>⟩<br>|a| = √(a<sub>1</sub><sup>2</sup> + a<sub>2</sub><sup>2</sup> + a<sub>3</sub><sup>2</sup>)    vectơ đơn vị u = a/|a|<br>i = ⟨1, 0, 0⟩, j = ⟨0, 1, 0⟩, k = ⟨0, 0, 1⟩, nên ⟨a<sub>1</sub>, a<sub>2</sub>, a<sub>3</sub>⟩ = a<sub>1</sub>i + a<sub>2</sub>j + a<sub>3</sub>k</div>
<div class="callout"><p><b>Ví dụ 2.</b> a = ⟨2, −1, 3⟩, b = ⟨1, 4, −2⟩. a + b = <b>⟨3, 3, 1⟩</b>; 2a − b = <b>⟨3, −6, 8⟩</b>; |a| = √(4 + 1 + 9) = <b>√14</b>; vectơ đơn vị cùng hướng a: ⟨2, −1, 3⟩/√14.</p>
<p><b>Ví dụ 3.</b> A(1, 2, 3), B(4, 0, 5): AB = ⟨3, −2, 2⟩, |AB| = <b>√17</b> — khoảng cách từ A tới B.</p>
<p><b>Ví dụ 4 — hợp lực.</b> Hai sợi dây kéo một thùng với F<sub>1</sub> = ⟨30, 40, 0⟩ N và F<sub>2</sub> = ⟨−10, 20, 15⟩ N. Hợp lực là ⟨20, 60, 15⟩ N, độ lớn √(400 + 3600 + 225) = √4225 = <b>65 N</b>.</p></div>
<p>Đại số vectơ tuân theo các luật quen thuộc (giao hoán, kết hợp, phân phối). Về hình học, a + b là đường chéo hình bình hành dựng trên a và b, còn ca kéo giãn a theo |c| (đổi chiều nếu c &lt; 0).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tính AB thành A − B (“gốc trừ ngọn”) — hướng bị đảo.</li><li>Quên căn trong |a|, hoặc cộng các thành phần thay vì bình phương.</li><li>Mất hằng số khi thêm bớt bình phương cho mặt cầu (vế phải âm nghĩa là không có điểm nào).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Khoảng cách: căn của tổng bình phương hiệu.</li><li>Mặt cầu: (x − h)<sup>2</sup> + (y − k)<sup>2</sup> + (z − l)<sup>2</sup> = r<sup>2</sup>; thêm bớt bình phương để nhận ra.</li><li>AB = B − A; |a| = √(a·a); vectơ đơn vị a/|a|.</li><li>i, j, k là cơ sở chuẩn.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS3 + '2-2-vectors-in-three-dimensions', 'OpenStax Calculus Vol. 3 — 2.2 Vectơ trong ba chiều') + `</li><li>` + A(PN3 + '3DCoords.aspx', "Paul's Online Notes — Hệ toạ độ 3 chiều") + `</li><li>` + A(PN2 + 'Vectors_Basics.aspx', "Paul's Online Notes — Vectơ cơ bản") + `</li><li>` + A('https://www.geogebra.org/3d', 'GeoGebra 3D — vẽ điểm, vectơ, mặt cầu') + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm tâm và bán kính của x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup> + 2x − 8z = 8.</li><li>Tìm vectơ độ dài 5 cùng hướng ⟨1, 2, 2⟩.</li><li>Tam giác đỉnh A(1, 0, 0), B(0, 1, 0), C(0, 0, 1) có đều không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (x + 1)<sup>2</sup> + y<sup>2</sup> + (z − 4)<sup>2</sup> = 25: <b>tâm (−1, 0, 4), bán kính 5</b>. 2) |⟨1, 2, 2⟩| = 3 ⇒ <b>(5/3)⟨1, 2, 2⟩ = ⟨5/3, 10/3, 10/3⟩</b>. 3) |AB| = |BC| = |CA| = √2 ⇒ <b>có</b>.</p></div>`);

const c72 = L('cal121-ts-7-2',
  '7.2 — The dot product: angles, orthogonality and projections|||7.2 — Tích vô hướng: góc, vuông góc và hình chiếu',
  'a·b = a₁b₁+a₂b₂+a₃b₃ = |a||b|cosθ; góc giữa hai vectơ, điều kiện vuông góc, hình chiếu vô hướng và vectơ, công W = F·D, độ tương đồng cosin trong học máy.',
  `<span class="eyebrow">CAL121 · Chapter 7 · Lesson 7.2</span>
<h2>The dot product: angles, orthogonality and projections</h2>
<p class="lead">How aligned are two directions? The <strong>dot product</strong> answers with a single number. It measures work in physics, lighting in computer graphics (light intensity ∝ cos of the angle to the surface normal) and similarity between documents or embeddings in machine learning.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute a·b algebraically and interpret it geometrically.</li><li>Find the angle between vectors and test orthogonality.</li><li>Compute scalar and vector projections; compute work.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Dot product</span>a · b = a<sub>1</sub>b<sub>1</sub> + a<sub>2</sub>b<sub>2</sub> + a<sub>3</sub>b<sub>3</sub> = |a| |b| cos θ   (0 ≤ θ ≤ π)</div>
<p>Consequences: a · a = |a|<sup>2</sup>; a ⊥ b ⇔ a · b = 0; a · b &gt; 0 means an acute angle, &lt; 0 an obtuse one. The geometric formula follows from the Law of Cosines applied to the triangle with sides a, b, a − b.</p>
<div class="formula"><span class="lbl">Projections of b onto a</span>scalar projection comp<sub>a</sub>b = (a · b)/|a|        vector projection proj<sub>a</sub>b = ((a · b)/|a|<sup>2</sup>) a</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>1 — angle.</b> a = ⟨2, −1, 3⟩, b = ⟨1, 4, −2⟩: a · b = 2 − 4 − 6 = −8; |a| = √14, |b| = √21. cos θ = −8/√294 ⇒ θ ≈ <b>117.8°</b> (obtuse, as the negative sign predicts).</p>
<p><b>2 — orthogonality.</b> ⟨3, 1, −2⟩ · ⟨1, 1, 2⟩ = 3 + 1 − 4 = 0: <b>perpendicular</b>.</p>
<p><b>3 — projection.</b> Project b = ⟨1, 2, 2⟩ onto a = ⟨3, 0, 4⟩: a · b = 11, |a| = 5. Scalar projection 11/5; vector projection (11/25)⟨3, 0, 4⟩ = <b>⟨33/25, 0, 44/25⟩</b>. The remainder b − proj<sub>a</sub>b is perpendicular to a — this decomposition is used in least squares and Gram–Schmidt.</p>
<p><b>4 — work.</b> A 50 N force pulls a sled 20 m along level ground with the rope at 30° above the horizontal: W = F · D = |F||D|cos 30° = 50 · 20 · (√3/2) ≈ <b>866 J</b>.</p></div>
<div class="note-ct"><p><b>Cosine similarity.</b> In search engines and language models, two documents (or word embeddings) are vectors, and their similarity is cos θ = (a · b)/(|a||b|) — 1 for the same direction, 0 for unrelated, −1 for opposite.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>The dot product is a <strong>number</strong>, not a vector.</li><li>Dividing by |a| instead of |a|<sup>2</sup> in the vector projection.</li><li>Using degrees in a calculator set to radians when computing arccos.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>a · b = ∑ a<sub>i</sub>b<sub>i</sub> = |a||b|cos θ.</li><li>a · b = 0 ⇔ perpendicular.</li><li>proj<sub>a</sub>b = (a·b/|a|<sup>2</sup>) a.</li><li>Work W = F · D; cosine similarity in data science.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS3 + '2-3-the-dot-product', 'OpenStax Vol. 3 — 2.3 The Dot Product') + `</li><li>` + A(PN2 + 'DotProduct.aspx', "Paul's Online Notes — Dot Product") + `</li><li>` + A('https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/1.-vectors-and-matrices/', 'MIT OCW 18.02SC — Unit 1: Vectors and Matrices') + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the angle between ⟨1, 1, 0⟩ and ⟨0, 1, 1⟩.</li><li>For which c are ⟨c, 2, 1⟩ and ⟨c, −c, 3⟩ perpendicular?</li><li>Find the scalar projection of ⟨4, 1, 2⟩ onto ⟨0, 3, 4⟩.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) dot = 1, |·| = √2 each ⇒ cos θ = 1/2 ⇒ <b>60°</b>. 2) c<sup>2</sup> − 2c + 3 = 0 has no real roots ⇒ <b>no such c</b>. 3) (0 + 3 + 8)/5 = <b>11/5</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 7 · Bài 7.2</span>
<h2>Tích vô hướng: góc, vuông góc và hình chiếu</h2>
<p class="lead">Hai hướng “cùng chiều” với nhau cỡ nào? <strong>Tích vô hướng</strong> trả lời bằng một con số. Nó đo công trong vật lý, ánh sáng trong đồ hoạ máy tính (cường độ ∝ cos góc với pháp tuyến bề mặt) và độ tương đồng giữa văn bản hay embedding trong học máy.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính a·b theo toạ độ và hiểu ý nghĩa hình học.</li><li>Tìm góc giữa hai vectơ và kiểm tính vuông góc.</li><li>Tính hình chiếu vô hướng, hình chiếu vectơ; tính công.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Tích vô hướng</span>a · b = a<sub>1</sub>b<sub>1</sub> + a<sub>2</sub>b<sub>2</sub> + a<sub>3</sub>b<sub>3</sub> = |a| |b| cos θ   (0 ≤ θ ≤ π)</div>
<p>Hệ quả: a · a = |a|<sup>2</sup>; a ⊥ b ⇔ a · b = 0; a · b &gt; 0 là góc nhọn, &lt; 0 là góc tù. Công thức hình học suy ra từ định lý cosin cho tam giác có cạnh a, b, a − b.</p>
<div class="formula"><span class="lbl">Hình chiếu của b lên a</span>hình chiếu vô hướng comp<sub>a</sub>b = (a · b)/|a|        hình chiếu vectơ proj<sub>a</sub>b = ((a · b)/|a|<sup>2</sup>) a</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>1 — góc.</b> a = ⟨2, −1, 3⟩, b = ⟨1, 4, −2⟩: a · b = 2 − 4 − 6 = −8; |a| = √14, |b| = √21. cos θ = −8/√294 ⇒ θ ≈ <b>117,8°</b> (góc tù, đúng như dấu âm báo trước).</p>
<p><b>2 — vuông góc.</b> ⟨3, 1, −2⟩ · ⟨1, 1, 2⟩ = 3 + 1 − 4 = 0: <b>vuông góc</b>.</p>
<p><b>3 — hình chiếu.</b> Chiếu b = ⟨1, 2, 2⟩ lên a = ⟨3, 0, 4⟩: a · b = 11, |a| = 5. Hình chiếu vô hướng 11/5; hình chiếu vectơ (11/25)⟨3, 0, 4⟩ = <b>⟨33/25, 0, 44/25⟩</b>. Phần còn lại b − proj<sub>a</sub>b vuông góc với a — phân tích này dùng trong bình phương tối thiểu và Gram–Schmidt.</p>
<p><b>4 — công.</b> Lực 50 N kéo xe trượt 20 m trên mặt phẳng, dây hợp 30° với phương ngang: W = F · D = |F||D|cos 30° = 50 · 20 · (√3/2) ≈ <b>866 J</b>.</p></div>
<div class="note-ct"><p><b>Độ tương đồng cosin.</b> Trong máy tìm kiếm và mô hình ngôn ngữ, hai văn bản (hoặc embedding của từ) là hai vectơ, và độ tương đồng là cos θ = (a · b)/(|a||b|) — bằng 1 nếu cùng hướng, 0 nếu không liên quan, −1 nếu ngược hướng.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tích vô hướng là một <strong>số</strong>, không phải vectơ.</li><li>Chia cho |a| thay vì |a|<sup>2</sup> trong hình chiếu vectơ.</li><li>Máy tính đặt chế độ radian mà đọc arccos ra độ.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>a · b = ∑ a<sub>i</sub>b<sub>i</sub> = |a||b|cos θ.</li><li>a · b = 0 ⇔ vuông góc.</li><li>proj<sub>a</sub>b = (a·b/|a|<sup>2</sup>) a.</li><li>Công W = F · D; độ tương đồng cosin trong khoa học dữ liệu.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS3 + '2-3-the-dot-product', 'OpenStax Vol. 3 — 2.3 Tích vô hướng') + `</li><li>` + A(PN2 + 'DotProduct.aspx', "Paul's Online Notes — Dot Product") + `</li><li>` + A('https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/1.-vectors-and-matrices/', 'MIT OCW 18.02SC — Unit 1: Vectơ và ma trận') + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm góc giữa ⟨1, 1, 0⟩ và ⟨0, 1, 1⟩.</li><li>Với c nào thì ⟨c, 2, 1⟩ và ⟨c, −c, 3⟩ vuông góc?</li><li>Tìm hình chiếu vô hướng của ⟨4, 1, 2⟩ lên ⟨0, 3, 4⟩.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) tích = 1, độ dài mỗi vectơ √2 ⇒ cos θ = 1/2 ⇒ <b>60°</b>. 2) c<sup>2</sup> − 2c + 3 = 0 vô nghiệm thực ⇒ <b>không có c nào</b>. 3) (0 + 3 + 8)/5 = <b>11/5</b>.</p></div>`);

const c73 = L('cal121-ts-7-3',
  '7.3 — The cross product: area, volume and torque|||7.3 — Tích có hướng: diện tích, thể tích và mômen lực',
  'a × b bằng định thức 3×3, vuông góc với a và b, |a × b| = |a||b|sinθ = diện tích hình bình hành; diện tích tam giác, tích hỗn tạp a·(b × c) = thể tích hộp, quy tắc bàn tay phải, mômen lực.',
  `<span class="eyebrow">CAL121 · Chapter 7 · Lesson 7.3</span>
<h2>The cross product: area, volume and torque</h2>
<p class="lead">Given two directions in space, which direction is perpendicular to both? The <strong>cross product</strong> builds that vector, and its length is an area. It gives surface normals in 3D graphics, torque in mechanics and the normal vector of a plane (Lesson 7.4).</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute a × b with a 3 × 3 determinant.</li><li>Use |a × b| for areas of parallelograms and triangles.</li><li>Use the scalar triple product for volumes and coplanarity.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Cross product (only in ℝ<sup>3</sup>)</span>a × b = ⟨a<sub>2</sub>b<sub>3</sub> − a<sub>3</sub>b<sub>2</sub>,  a<sub>3</sub>b<sub>1</sub> − a<sub>1</sub>b<sub>3</sub>,  a<sub>1</sub>b<sub>2</sub> − a<sub>2</sub>b<sub>1</sub>⟩ = det[ i j k ; a<sub>1</sub> a<sub>2</sub> a<sub>3</sub> ; b<sub>1</sub> b<sub>2</sub> b<sub>3</sub> ]</div>
<ul><li>a × b is perpendicular to both a and b; its direction follows the <strong>right-hand rule</strong>.</li><li>|a × b| = |a||b| sin θ = area of the parallelogram spanned by a and b.</li><li>b × a = −(a × b) (not commutative); a × a = 0; i × j = k, j × k = i, k × i = j.</li></ul>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>1.</b> a = ⟨2, −1, 3⟩, b = ⟨1, 4, −2⟩: a × b = ⟨(−1)(−2) − 3·4, 3·1 − 2(−2), 2·4 − (−1)·1⟩ = <b>⟨−10, 7, 9⟩</b>. Check: (a × b) · a = −20 − 7 + 27 = 0 ✓ and (a × b) · b = −10 + 28 − 18 = 0 ✓.</p>
<p><b>2 — triangle area.</b> P(1, 0, 0), Q(0, 2, 0), R(0, 0, 3). PQ = ⟨−1, 2, 0⟩, PR = ⟨−1, 0, 3⟩, PQ × PR = ⟨6, 3, 2⟩ with length √(36 + 9 + 4) = 7. Area = ½ · 7 = <b>7/2</b>.</p></div>
<div class="formula"><span class="lbl">Scalar triple product</span>a · (b × c) = det[ a<sub>1</sub> a<sub>2</sub> a<sub>3</sub> ; b<sub>1</sub> b<sub>2</sub> b<sub>3</sub> ; c<sub>1</sub> c<sub>2</sub> c<sub>3</sub> ];  |a · (b × c)| = volume of the parallelepiped; = 0 ⇔ a, b, c coplanar</div>
<div class="callout"><p><b>3 — volume.</b> a = ⟨1, 0, 0⟩, b = ⟨0, 2, 0⟩, c = ⟨1, 1, 3⟩: a · (b × c) = det = 1 · (2·3 − 0·1) = <b>6</b>, the volume of the box they span.</p>
<p><b>4 — torque.</b> τ = r × F. A 40 N force applied perpendicular to a 0.25 m wrench gives |τ| = 0.25 · 40 · sin 90° = <b>10 N·m</b>; at 30° it would be only 5 N·m.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Sign error in the middle (j) component: it is −(a<sub>1</sub>b<sub>3</sub> − a<sub>3</sub>b<sub>1</sub>).</li><li>Swapping the order and losing the sign: a × b ≠ b × a.</li><li>Forgetting the ½ for a triangle.</li><li>Trying to take a cross product of 2D vectors — embed them as ⟨a<sub>1</sub>, a<sub>2</sub>, 0⟩.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>a × b ⊥ a and b, right-hand rule.</li><li>|a × b| = parallelogram area; triangle = half.</li><li>|a · (b × c)| = parallelepiped volume.</li><li>Always check the result with dot products = 0.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS3 + '2-4-the-cross-product', 'OpenStax Vol. 3 — 2.4 The Cross Product') + `</li><li>` + A(PN2 + 'CrossProduct.aspx', "Paul's Online Notes — Cross Product") + `</li><li>` + A('https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/1.-vectors-and-matrices/', 'MIT OCW 18.02SC — Unit 1 (determinants, cross product)') + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>⟨1, 2, 3⟩ × ⟨4, 5, 6⟩.</li><li>Find a unit vector perpendicular to both i + j and j + k.</li><li>Are ⟨1, 2, 3⟩, ⟨4, 5, 6⟩, ⟨7, 8, 9⟩ coplanar?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) <b>⟨−3, 6, −3⟩</b>. 2) ⟨1, 1, 0⟩ × ⟨0, 1, 1⟩ = ⟨1, −1, 1⟩ ⇒ <b>⟨1, −1, 1⟩/√3</b>. 3) ⟨7, 8, 9⟩ · ⟨−3, 6, −3⟩ = −21 + 48 − 27 = 0 ⇒ <b>yes</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 7 · Bài 7.3</span>
<h2>Tích có hướng: diện tích, thể tích và mômen lực</h2>
<p class="lead">Cho hai hướng trong không gian, hướng nào vuông góc với cả hai? <strong>Tích có hướng</strong> dựng ra vectơ đó, và độ dài của nó là một diện tích. Nó cho pháp tuyến bề mặt trong đồ hoạ 3D, mômen lực trong cơ học và vectơ pháp tuyến của mặt phẳng (Bài 7.4).</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính a × b bằng định thức 3 × 3.</li><li>Dùng |a × b| tính diện tích hình bình hành, tam giác.</li><li>Dùng tích hỗn tạp tính thể tích và xét đồng phẳng.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Tích có hướng (chỉ trong ℝ<sup>3</sup>)</span>a × b = ⟨a<sub>2</sub>b<sub>3</sub> − a<sub>3</sub>b<sub>2</sub>,  a<sub>3</sub>b<sub>1</sub> − a<sub>1</sub>b<sub>3</sub>,  a<sub>1</sub>b<sub>2</sub> − a<sub>2</sub>b<sub>1</sub>⟩ = det[ i j k ; a<sub>1</sub> a<sub>2</sub> a<sub>3</sub> ; b<sub>1</sub> b<sub>2</sub> b<sub>3</sub> ]</div>
<ul><li>a × b vuông góc với cả a và b; hướng theo <strong>quy tắc bàn tay phải</strong>.</li><li>|a × b| = |a||b| sin θ = diện tích hình bình hành dựng trên a và b.</li><li>b × a = −(a × b) (không giao hoán); a × a = 0; i × j = k, j × k = i, k × i = j.</li></ul>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>1.</b> a = ⟨2, −1, 3⟩, b = ⟨1, 4, −2⟩: a × b = ⟨(−1)(−2) − 3·4, 3·1 − 2(−2), 2·4 − (−1)·1⟩ = <b>⟨−10, 7, 9⟩</b>. Thử: (a × b) · a = −20 − 7 + 27 = 0 ✓ và (a × b) · b = −10 + 28 − 18 = 0 ✓.</p>
<p><b>2 — diện tích tam giác.</b> P(1, 0, 0), Q(0, 2, 0), R(0, 0, 3). PQ = ⟨−1, 2, 0⟩, PR = ⟨−1, 0, 3⟩, PQ × PR = ⟨6, 3, 2⟩ dài √(36 + 9 + 4) = 7. Diện tích = ½ · 7 = <b>7/2</b>.</p></div>
<div class="formula"><span class="lbl">Tích hỗn tạp</span>a · (b × c) = det[ a<sub>1</sub> a<sub>2</sub> a<sub>3</sub> ; b<sub>1</sub> b<sub>2</sub> b<sub>3</sub> ; c<sub>1</sub> c<sub>2</sub> c<sub>3</sub> ];  |a · (b × c)| = thể tích hình hộp; = 0 ⇔ a, b, c đồng phẳng</div>
<div class="callout"><p><b>3 — thể tích.</b> a = ⟨1, 0, 0⟩, b = ⟨0, 2, 0⟩, c = ⟨1, 1, 3⟩: a · (b × c) = det = 1 · (2·3 − 0·1) = <b>6</b>, thể tích hình hộp dựng trên chúng.</p>
<p><b>4 — mômen lực.</b> τ = r × F. Lực 40 N đặt vuông góc với cờ lê dài 0,25 m cho |τ| = 0,25 · 40 · sin 90° = <b>10 N·m</b>; ở góc 30° chỉ còn 5 N·m.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Sai dấu thành phần giữa (j): nó là −(a<sub>1</sub>b<sub>3</sub> − a<sub>3</sub>b<sub>1</sub>).</li><li>Đổi thứ tự rồi mất dấu: a × b ≠ b × a.</li><li>Quên ½ cho tam giác.</li><li>Lấy tích có hướng của vectơ 2D — phải viết thành ⟨a<sub>1</sub>, a<sub>2</sub>, 0⟩.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>a × b ⊥ a và b, quy tắc bàn tay phải.</li><li>|a × b| = diện tích hình bình hành; tam giác = một nửa.</li><li>|a · (b × c)| = thể tích hình hộp.</li><li>Luôn thử lại bằng tích vô hướng = 0.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS3 + '2-4-the-cross-product', 'OpenStax Vol. 3 — 2.4 Tích có hướng') + `</li><li>` + A(PN2 + 'CrossProduct.aspx', "Paul's Online Notes — Cross Product") + `</li><li>` + A('https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/1.-vectors-and-matrices/', 'MIT OCW 18.02SC — Unit 1 (định thức, tích có hướng)') + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>⟨1, 2, 3⟩ × ⟨4, 5, 6⟩.</li><li>Tìm vectơ đơn vị vuông góc với cả i + j và j + k.</li><li>⟨1, 2, 3⟩, ⟨4, 5, 6⟩, ⟨7, 8, 9⟩ có đồng phẳng không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) <b>⟨−3, 6, −3⟩</b>. 2) ⟨1, 1, 0⟩ × ⟨0, 1, 1⟩ = ⟨1, −1, 1⟩ ⇒ <b>⟨1, −1, 1⟩/√3</b>. 3) ⟨7, 8, 9⟩ · ⟨−3, 6, −3⟩ = −21 + 48 − 27 = 0 ⇒ <b>có</b>.</p></div>`);

const c74 = L('cal121-ts-7-4',
  '7.4 — Equations of lines and planes|||7.4 — Phương trình đường thẳng và mặt phẳng',
  'Đường thẳng dạng vectơ/tham số/chính tắc, mặt phẳng n·(r − r₀) = 0, mặt phẳng qua ba điểm, giao điểm đường thẳng – mặt phẳng, góc giữa hai mặt phẳng, khoảng cách từ điểm tới mặt phẳng.',
  `<span class="eyebrow">CAL121 · Chapter 7 · Lesson 7.4</span>
<h2>Equations of lines and planes</h2>
<p class="lead">A line in space is fixed by a point and a <strong>direction vector</strong>; a plane by a point and a <strong>normal vector</strong>. With dot and cross products we can now find intersections, angles and distances — the geometry behind ray tracing, collision detection and tangent planes (Chapter 8).</p>
<h3>🎯 Objectives</h3>
<ul><li>Write vector, parametric and symmetric equations of a line.</li><li>Write the equation of a plane from a point and a normal, or from three points.</li><li>Compute line–plane intersections, angles between planes and point–plane distances.</li></ul>
<h3>📖 Lines</h3>
<div class="formula"><span class="lbl">Line through P<sub>0</sub>(x<sub>0</sub>, y<sub>0</sub>, z<sub>0</sub>) with direction v = ⟨a, b, c⟩</span>vector: r = r<sub>0</sub> + t v    parametric: x = x<sub>0</sub> + at, y = y<sub>0</sub> + bt, z = z<sub>0</sub> + ct<br>symmetric: (x − x<sub>0</sub>)/a = (y − y<sub>0</sub>)/b = (z − z<sub>0</sub>)/c</div>
<div class="callout"><p><b>Example 1.</b> The line through P(1, 2, −1) with direction ⟨2, −1, 3⟩: x = 1 + 2t, y = 2 − t, z = −1 + 3t; symmetric (x − 1)/2 = (y − 2)/(−1) = (z + 1)/3.</p></div>
<h3>📖 Planes</h3>
<div class="formula"><span class="lbl">Plane through P<sub>0</sub> with normal n = ⟨a, b, c⟩</span>a(x − x<sub>0</sub>) + b(y − y<sub>0</sub>) + c(z − z<sub>0</sub>) = 0  ⇔  ax + by + cz = d</div>
<div class="callout"><p><b>Example 2 — plane through three points.</b> P(1, 0, 0), Q(0, 2, 0), R(0, 0, 3). Normal n = PQ × PR = ⟨6, 3, 2⟩ (Lesson 7.3). Plane: 6(x − 1) + 3y + 2z = 0 ⇒ <b>6x + 3y + 2z = 6</b>. Check: dividing by 6 gives x/1 + y/2 + z/3 = 1, intercepts 1, 2, 3 ✓.</p>
<p><b>Example 3 — line meets plane.</b> Where does the line of Example 1 hit 6x + 3y + 2z = 6? Substitute: 6(1 + 2t) + 3(2 − t) + 2(−1 + 3t) = 10 + 15t = 6 ⇒ t = −4/15. Point <b>(7/15, 34/15, −9/5)</b>.</p>
<p><b>Example 4 — angle between planes</b> x + y + z = 1 and x − 2y + 3z = 1: the angle between normals: cos θ = (1 − 2 + 3)/(√3 √14) = 2/√42 ⇒ θ ≈ <b>72.0°</b>. Their line of intersection has direction n<sub>1</sub> × n<sub>2</sub> = ⟨5, −2, −3⟩.</p></div>
<div class="formula"><span class="lbl">Distance from P<sub>1</sub>(x<sub>1</sub>, y<sub>1</sub>, z<sub>1</sub>) to ax + by + cz = d</span>D = |ax<sub>1</sub> + by<sub>1</sub> + cz<sub>1</sub> − d| / √(a<sup>2</sup> + b<sup>2</sup> + c<sup>2</sup>)</div>
<div class="callout"><p><b>Example 5.</b> From (1, 1, 1) to 6x + 3y + 2z = 6: |6 + 3 + 2 − 6|/7 = <b>5/7</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using the normal vector of a plane as the direction of a line <em>in</em> that plane (it is perpendicular to the plane).</li><li>Assuming two non-parallel lines in space must meet — they can be <strong>skew</strong>.</li><li>Forgetting the absolute value or the square root in the distance formula.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Line: point + direction, r = r<sub>0</sub> + tv.</li><li>Plane: point + normal, n · (r − r<sub>0</sub>) = 0.</li><li>Three points: normal = cross product of two edge vectors.</li><li>Parallel planes ⇔ parallel normals; distance formula |ax<sub>1</sub> + by<sub>1</sub> + cz<sub>1</sub> − d|/|n|.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS3 + '2-5-equations-of-lines-and-planes-in-space', 'OpenStax Vol. 3 — 2.5 Equations of Lines and Planes in Space') + `</li><li>` + A(PN3 + 'EqnsOfLines.aspx', "Paul's Online Notes — Equations of Lines") + `</li><li>` + A(PN3 + 'EqnsOfPlanes.aspx', "Paul's Online Notes — Equations of Planes") + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the plane through (2, −1, 3) parallel to 3x − y + 2z = 7.</li><li>Do the lines x = 1 + t, y = t, z = 2 − t and x = 2s, y = 1 + s, z = s intersect?</li><li>Distance between the parallel planes x + 2y + 2z = 3 and x + 2y + 2z = 12.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Same normal: 3(x − 2) − (y + 1) + 2(z − 3) = 0 ⇒ <b>3x − y + 2z = 13</b>. 2) 1 + t = 2s, t = 1 + s ⇒ s = 2, t = 3; then z: 2 − 3 = −1 but s = 2 ⇒ <b>no, they are skew</b> (directions not parallel). 3) Take (3, 0, 0) on the first: |3 − 12|/3 = <b>3</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 7 · Bài 7.4</span>
<h2>Phương trình đường thẳng và mặt phẳng</h2>
<p class="lead">Đường thẳng trong không gian được xác định bởi một điểm và một <strong>vectơ chỉ phương</strong>; mặt phẳng bởi một điểm và một <strong>vectơ pháp tuyến</strong>. Với tích vô hướng và tích có hướng, giờ ta tìm được giao điểm, góc và khoảng cách — hình học đằng sau ray tracing, phát hiện va chạm và mặt phẳng tiếp xúc (Chương 8).</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết phương trình vectơ, tham số, chính tắc của đường thẳng.</li><li>Viết phương trình mặt phẳng từ một điểm và pháp tuyến, hoặc từ ba điểm.</li><li>Tìm giao điểm đường thẳng – mặt phẳng, góc giữa hai mặt phẳng, khoảng cách điểm – mặt phẳng.</li></ul>
<h3>📖 Đường thẳng</h3>
<div class="formula"><span class="lbl">Đường thẳng qua P<sub>0</sub>(x<sub>0</sub>, y<sub>0</sub>, z<sub>0</sub>), chỉ phương v = ⟨a, b, c⟩</span>vectơ: r = r<sub>0</sub> + t v    tham số: x = x<sub>0</sub> + at, y = y<sub>0</sub> + bt, z = z<sub>0</sub> + ct<br>chính tắc: (x − x<sub>0</sub>)/a = (y − y<sub>0</sub>)/b = (z − z<sub>0</sub>)/c</div>
<div class="callout"><p><b>Ví dụ 1.</b> Đường thẳng qua P(1, 2, −1) chỉ phương ⟨2, −1, 3⟩: x = 1 + 2t, y = 2 − t, z = −1 + 3t; chính tắc (x − 1)/2 = (y − 2)/(−1) = (z + 1)/3.</p></div>
<h3>📖 Mặt phẳng</h3>
<div class="formula"><span class="lbl">Mặt phẳng qua P<sub>0</sub> có pháp tuyến n = ⟨a, b, c⟩</span>a(x − x<sub>0</sub>) + b(y − y<sub>0</sub>) + c(z − z<sub>0</sub>) = 0  ⇔  ax + by + cz = d</div>
<div class="callout"><p><b>Ví dụ 2 — mặt phẳng qua ba điểm.</b> P(1, 0, 0), Q(0, 2, 0), R(0, 0, 3). Pháp tuyến n = PQ × PR = ⟨6, 3, 2⟩ (Bài 7.3). Mặt phẳng: 6(x − 1) + 3y + 2z = 0 ⇒ <b>6x + 3y + 2z = 6</b>. Thử: chia cho 6 được x/1 + y/2 + z/3 = 1, đoạn chắn 1, 2, 3 ✓.</p>
<p><b>Ví dụ 3 — đường thẳng cắt mặt phẳng.</b> Đường thẳng ở Ví dụ 1 cắt 6x + 3y + 2z = 6 ở đâu? Thế vào: 6(1 + 2t) + 3(2 − t) + 2(−1 + 3t) = 10 + 15t = 6 ⇒ t = −4/15. Điểm <b>(7/15, 34/15, −9/5)</b>.</p>
<p><b>Ví dụ 4 — góc giữa hai mặt phẳng</b> x + y + z = 1 và x − 2y + 3z = 1: góc giữa hai pháp tuyến: cos θ = (1 − 2 + 3)/(√3 √14) = 2/√42 ⇒ θ ≈ <b>72,0°</b>. Giao tuyến có chỉ phương n<sub>1</sub> × n<sub>2</sub> = ⟨5, −2, −3⟩.</p></div>
<div class="formula"><span class="lbl">Khoảng cách từ P<sub>1</sub>(x<sub>1</sub>, y<sub>1</sub>, z<sub>1</sub>) tới ax + by + cz = d</span>D = |ax<sub>1</sub> + by<sub>1</sub> + cz<sub>1</sub> − d| / √(a<sup>2</sup> + b<sup>2</sup> + c<sup>2</sup>)</div>
<div class="callout"><p><b>Ví dụ 5.</b> Từ (1, 1, 1) tới 6x + 3y + 2z = 6: |6 + 3 + 2 − 6|/7 = <b>5/7</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng pháp tuyến của mặt phẳng làm chỉ phương cho đường thẳng <em>nằm trong</em> mặt phẳng đó (pháp tuyến vuông góc với mặt phẳng).</li><li>Tưởng hai đường thẳng không song song trong không gian phải cắt nhau — chúng có thể <strong>chéo nhau</strong>.</li><li>Quên trị tuyệt đối hoặc căn trong công thức khoảng cách.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Đường thẳng: điểm + chỉ phương, r = r<sub>0</sub> + tv.</li><li>Mặt phẳng: điểm + pháp tuyến, n · (r − r<sub>0</sub>) = 0.</li><li>Ba điểm: pháp tuyến = tích có hướng của hai vectơ cạnh.</li><li>Hai mặt phẳng song song ⇔ pháp tuyến song song; khoảng cách |ax<sub>1</sub> + by<sub>1</sub> + cz<sub>1</sub> − d|/|n|.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS3 + '2-5-equations-of-lines-and-planes-in-space', 'OpenStax Vol. 3 — 2.5 Phương trình đường thẳng và mặt phẳng') + `</li><li>` + A(PN3 + 'EqnsOfLines.aspx', "Paul's Online Notes — Phương trình đường thẳng") + `</li><li>` + A(PN3 + 'EqnsOfPlanes.aspx', "Paul's Online Notes — Phương trình mặt phẳng") + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm mặt phẳng qua (2, −1, 3) song song với 3x − y + 2z = 7.</li><li>Hai đường x = 1 + t, y = t, z = 2 − t và x = 2s, y = 1 + s, z = s có cắt nhau không?</li><li>Khoảng cách giữa hai mặt phẳng song song x + 2y + 2z = 3 và x + 2y + 2z = 12.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Cùng pháp tuyến: 3(x − 2) − (y + 1) + 2(z − 3) = 0 ⇒ <b>3x − y + 2z = 13</b>. 2) 1 + t = 2s, t = 1 + s ⇒ s = 2, t = 3; khi đó z: 2 − 3 = −1 nhưng s = 2 ⇒ <b>không, chúng chéo nhau</b> (chỉ phương không song song). 3) Lấy (3, 0, 0) trên mặt thứ nhất: |3 − 12|/3 = <b>3</b>.</p></div>`);

const q7 = QZ(7, 'Quiz — Chapter 7: Vectors and the geometry of space|||Quiz — Chương 7: Vectơ và hình học không gian', 'Kiểm tra chương 7: mặt cầu, độ dài vectơ, tích vô hướng, góc, hình chiếu, tích có hướng, diện tích, thể tích, đường thẳng, mặt phẳng, khoảng cách.', [
  Q('q1', 'The centre of x² + y² + z² − 4x + 6y − 2z − 2 = 0 is|||Tâm của x² + y² + z² − 4x + 6y − 2z − 2 = 0 là',
    ['(−2, 3, −1)|||(−2, 3, −1)', '(2, −3, 1)|||(2, −3, 1)', '(4, −6, 2)|||(4, −6, 2)', '(2, 3, 1)|||(2, 3, 1)'], 1,
    'Complete the squares: (x − 2)² + (y + 3)² + (z − 1)² = 16.|||Thêm bớt bình phương: (x − 2)² + (y + 3)² + (z − 1)² = 16.'),
  Q('q2', 'The length of ⟨2, −1, 3⟩ is|||Độ dài của ⟨2, −1, 3⟩ là',
    ['4|||4', '√14|||√14', '14|||14', '√6|||√6'], 1,
    '√(4 + 1 + 9).|||√(4 + 1 + 9).'),
  Q('q3', '⟨2, −1, 3⟩ · ⟨1, 4, −2⟩ =|||⟨2, −1, 3⟩ · ⟨1, 4, −2⟩ =',
    ['−8|||−8', '8|||8', '⟨2, −4, −6⟩|||⟨2, −4, −6⟩', '0|||0'], 0,
    '2 − 4 − 6 = −8 (a number, and negative ⇒ obtuse angle).|||2 − 4 − 6 = −8 (một số, âm ⇒ góc tù).'),
  Q('q4', 'Two non-zero vectors are perpendicular exactly when|||Hai vectơ khác 0 vuông góc khi và chỉ khi',
    ['a × b = 0|||a × b = 0', 'a · b = 0|||a · b = 0', 'a and b have equal length|||a và b dài bằng nhau', 'a · b = 1|||a · b = 1'], 1,
    'cos θ = 0 ⇔ a · b = 0; a × b = 0 means parallel.|||cos θ = 0 ⇔ a · b = 0; a × b = 0 nghĩa là song song.'),
  Q('q5', 'The vector projection of b onto a is|||Hình chiếu vectơ của b lên a là',
    ['(a·b/|a|) a|||(a·b/|a|) a', '(a·b/|a|²) a|||(a·b/|a|²) a', '(a·b/|b|²) b|||(a·b/|b|²) b', 'a × b|||a × b'], 1,
    'Scalar projection a·b/|a| times the unit vector a/|a|.|||Hình chiếu vô hướng a·b/|a| nhân vectơ đơn vị a/|a|.'),
  Q('q6', '⟨2, −1, 3⟩ × ⟨1, 4, −2⟩ =|||⟨2, −1, 3⟩ × ⟨1, 4, −2⟩ =',
    ['⟨−10, 7, 9⟩|||⟨−10, 7, 9⟩', '⟨10, −7, −9⟩|||⟨10, −7, −9⟩', '⟨−10, −7, 9⟩|||⟨−10, −7, 9⟩', '−8|||−8'], 0,
    'Determinant; check: dot with both vectors is 0.|||Định thức; thử: tích vô hướng với cả hai vectơ bằng 0.'),
  Q('q7', 'Area of the triangle P(1,0,0), Q(0,2,0), R(0,0,3):|||Diện tích tam giác P(1,0,0), Q(0,2,0), R(0,0,3):',
    ['7|||7', '7/2|||7/2', '3|||3', '6|||6'], 1,
    'The length of PQ × PR = ⟨6, 3, 2⟩ is 7; halve it.|||Độ dài PQ × PR = ⟨6, 3, 2⟩ là 7; chia đôi.'),
  Q('q8', 'The plane through P(1,0,0), Q(0,2,0), R(0,0,3) is|||Mặt phẳng qua P(1,0,0), Q(0,2,0), R(0,0,3) là',
    ['x + 2y + 3z = 6|||x + 2y + 3z = 6', '6x + 3y + 2z = 6|||6x + 3y + 2z = 6', '6x + 3y + 2z = 0|||6x + 3y + 2z = 0', '3x + 2y + z = 3|||3x + 2y + z = 3'], 1,
    'Normal ⟨6, 3, 2⟩ through (1, 0, 0); intercepts 1, 2, 3.|||Pháp tuyến ⟨6, 3, 2⟩ qua (1, 0, 0); đoạn chắn 1, 2, 3.'),
  Q('q9', 'Distance from (1, 1, 1) to 6x + 3y + 2z = 6:|||Khoảng cách từ (1, 1, 1) tới 6x + 3y + 2z = 6:',
    ['5|||5', '5/7|||5/7', '11/7|||11/7', '1|||1'], 1,
    'Numerator |6 + 3 + 2 − 6| = 5, denominator √49 = 7.|||Tử |6 + 3 + 2 − 6| = 5, mẫu √49 = 7.'),
  Q('q10', 'The absolute value of a · (b × c) represents|||Giá trị tuyệt đối của a · (b × c) biểu diễn',
    ['the area of a triangle|||diện tích tam giác', 'the volume of the parallelepiped spanned by a, b, c|||thể tích hình hộp dựng trên a, b, c', 'the angle between a and b|||góc giữa a và b', 'the length of a|||độ dài của a'], 1,
    'Scalar triple product = ± volume; zero means coplanar.|||Tích hỗn tạp = ± thể tích; bằng 0 nghĩa là đồng phẳng.'),
]);

const ch7 = {
  title: 'Chapter 7 — Vectors and the geometry of space|||Chương 7 — Vectơ và hình học không gian',
  description: 'Toạ độ 3 chiều và mặt cầu, phép toán vectơ, tích vô hướng (góc, hình chiếu, công), tích có hướng (diện tích, thể tích, mômen), phương trình đường thẳng và mặt phẳng (Stewart 12.1–12.5 · OpenStax Vol.3 2.2–2.5).',
  lessons: [c71, c72, c73, c74, q7],
};

// ───────────────────────────── Chương 8 — Hàm nhiều biến & đạo hàm riêng ─────────────────────────────
const GD_PY = `<pre><code class="language-python">def grad(x, y):
    # f(x, y) = (x - 3)^2 + 2(y + 1)^2
    return 2 * (x - 3), 4 * (y + 1)

x, y, lr = 0.0, 0.0, 0.1
for step in range(1, 31):
    gx, gy = grad(x, y)
    x, y = x - lr * gx, y - lr * gy
    if step in (1, 2, 5, 10, 20, 30):
        f = (x - 3)**2 + 2 * (y + 1)**2
        print(f"step {step:2}: (x, y) = ({x:.4f}, {y:.4f})  f = {f:.6f}")</code></pre>
<div class="out">step  1: (x, y) = (0.6000, -0.4000)  f = 6.480000
step  2: (x, y) = (1.0800, -0.6400)  f = 3.945600
step  5: (x, y) = (2.0170, -0.9222)  f = 0.978461
step 10: (x, y) = (2.6779, -0.9940)  f = 0.103836
step 20: (x, y) = (2.9654, -1.0000)  f = 0.001196
step 30: (x, y) = (2.9963, -1.0000)  f = 0.000014</div>`;

const c81 = L('cal121-ts-8-1',
  '8.1 — Functions of several variables: graphs, level curves, limits and continuity|||8.1 — Hàm nhiều biến: đồ thị, đường mức, giới hạn và tính liên tục',
  'Hàm hai/ba biến, tập xác định, đồ thị mặt, đường mức (bản đồ địa hình, contour plot), giới hạn theo mọi đường đi, chứng minh không tồn tại giới hạn (xy/(x²+y²)), định lý kẹp, liên tục.',
  `<span class="eyebrow">CAL121 · Chapter 8 · Lesson 8.1</span>
<h2>Functions of several variables</h2>
<p class="lead">Temperature depends on latitude and longitude; the price of a house on area, location and age; a neural network's loss on millions of weights. These are functions of <strong>several variables</strong>, z = f(x, y) or w = f(x, y, z, …).</p>
<h3>🎯 Objectives</h3>
<ul><li>Find domains and sketch graphs and level curves of f(x, y).</li><li>Decide whether a two-variable limit exists, using paths and the squeeze theorem.</li><li>Recognise continuous functions.</li></ul>
<h3>📖 Domain, graph, level curves</h3>
<p>The <strong>graph</strong> of f(x, y) is the surface z = f(x, y) in ℝ<sup>3</sup>. A <strong>level curve</strong> is the set f(x, y) = k in the xy-plane — exactly the contour lines of a topographic map. A <strong>contour plot</strong> draws level curves for equally spaced k: lines close together mean the surface is steep.</p>
<div class="callout"><p><b>Example 1.</b> f(x, y) = √(9 − x<sup>2</sup> − y<sup>2</sup>): domain x<sup>2</sup> + y<sup>2</sup> ≤ 9 (a disk), range [0, 3], graph = upper hemisphere of radius 3. Level curves f = k: circles x<sup>2</sup> + y<sup>2</sup> = 9 − k<sup>2</sup>.</p>
<p><b>Example 2.</b> f(x, y) = 4x<sup>2</sup> + y<sup>2</sup>: level curves 4x<sup>2</sup> + y<sup>2</sup> = k are ellipses; the graph is an elliptic paraboloid (a “bowl”). This shape — a bowl with elliptical contours — is the typical loss surface near a minimum in machine learning.</p></div>
<h3>📖 Limits</h3>
<p>lim<sub>(x,y)→(a,b)</sub> f(x, y) = L means f(x, y) is close to L whenever (x, y) is close to (a, b) — approaching from <strong>every</strong> direction and along <strong>every</strong> path. That is much stronger than in one variable, where there are only two sides.</p>
<div class="formula"><span class="lbl">Two-path test</span>If f → L<sub>1</sub> along one path and f → L<sub>2</sub> ≠ L<sub>1</sub> along another, the limit does not exist.</div>
<div class="callout"><p><b>Example 3 — no limit.</b> f(x, y) = xy/(x<sup>2</sup> + y<sup>2</sup>) at (0, 0). Along y = mx: f = m x<sup>2</sup>/((1 + m<sup>2</sup>)x<sup>2</sup>) = m/(1 + m<sup>2</sup>). Along y = 0 the value is 0, along y = x it is 1/2 ⇒ <b>the limit does not exist</b>.</p>
<p><b>Example 4 — limit exists.</b> f(x, y) = x<sup>2</sup>y/(x<sup>2</sup> + y<sup>2</sup>) at (0, 0). Since x<sup>2</sup> ≤ x<sup>2</sup> + y<sup>2</sup>, |f| ≤ |y| → 0. By the squeeze theorem the <b>limit is 0</b>. Checking paths can never prove a limit exists; a squeeze (or polar coordinates) can.</p></div>
<p><b>Continuity.</b> f is continuous at (a, b) if lim f(x, y) = f(a, b). Polynomials, and sums, products, quotients (where the denominator ≠ 0) and compositions of continuous functions, are continuous — so most limits are found by direct substitution: lim<sub>(x,y)→(1,2)</sub> (x<sup>2</sup>y + 3y) = 2 + 6 = 8.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Checking two or three lines, getting the same value, and concluding the limit exists.</li><li>Confusing the graph (a surface in 3D) with level curves (curves in the plane).</li><li>Forgetting domain restrictions: ln(x − y) needs x &gt; y.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Graph z = f(x, y); level curves f = k (contour map).</li><li>Different limits along two paths ⇒ no limit.</li><li>Squeeze / polar coordinates prove a limit exists.</li><li>Continuous functions: substitute.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS3 + '4-1-functions-of-several-variables', 'OpenStax Vol. 3 — 4.1 Functions of Several Variables') + `</li><li>` + A(OS3 + '4-2-limits-and-continuity', 'OpenStax Vol. 3 — 4.2 Limits and Continuity') + `</li><li>` + A(PN3 + 'MultiVrbleFcns.aspx', "Paul's Online Notes — Functions of Several Variables") + `</li><li>` + A(PN3 + 'Limits.aspx', "Paul's Online Notes — Limits (Calculus III)") + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>Domain of f(x, y) = ln(x − y) + √(4 − x).</li><li>Does lim<sub>(x,y)→(0,0)</sub> (x<sup>2</sup> − y<sup>2</sup>)/(x<sup>2</sup> + y<sup>2</sup>) exist?</li><li>lim<sub>(x,y)→(0,0)</sub> (x<sup>2</sup> + y<sup>2</sup>)/(√(x<sup>2</sup> + y<sup>2</sup> + 1) − 1). (Hint: polar, r<sup>2</sup> = x<sup>2</sup> + y<sup>2</sup>.)</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) <b>x &gt; y and x ≤ 4</b>. 2) Along y = 0: 1; along x = 0: −1 ⇒ <b>does not exist</b>. 3) r<sup>2</sup>/(√(r<sup>2</sup> + 1) − 1) = √(r<sup>2</sup> + 1) + 1 → <b>2</b> (multiply by the conjugate).</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 8 · Bài 8.1</span>
<h2>Hàm nhiều biến</h2>
<p class="lead">Nhiệt độ phụ thuộc vĩ độ và kinh độ; giá nhà phụ thuộc diện tích, vị trí, tuổi; hàm mất mát của mạng nơ-ron phụ thuộc hàng triệu trọng số. Đó là hàm <strong>nhiều biến</strong>, z = f(x, y) hay w = f(x, y, z, …).</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tìm tập xác định, phác hoạ đồ thị và đường mức của f(x, y).</li><li>Xét giới hạn hai biến có tồn tại không, bằng đường đi và định lý kẹp.</li><li>Nhận ra hàm liên tục.</li></ul>
<h3>📖 Tập xác định, đồ thị, đường mức</h3>
<p><strong>Đồ thị</strong> của f(x, y) là mặt z = f(x, y) trong ℝ<sup>3</sup>. <strong>Đường mức</strong> là tập f(x, y) = k trong mặt phẳng Oxy — chính là đường đồng mức trên bản đồ địa hình. <strong>Bản đồ đường mức</strong> (contour plot) vẽ đường mức với các k cách đều: các đường sít nhau nghĩa là mặt dốc.</p>
<div class="callout"><p><b>Ví dụ 1.</b> f(x, y) = √(9 − x<sup>2</sup> − y<sup>2</sup>): tập xác định x<sup>2</sup> + y<sup>2</sup> ≤ 9 (hình tròn), tập giá trị [0, 3], đồ thị = nửa trên mặt cầu bán kính 3. Đường mức f = k: đường tròn x<sup>2</sup> + y<sup>2</sup> = 9 − k<sup>2</sup>.</p>
<p><b>Ví dụ 2.</b> f(x, y) = 4x<sup>2</sup> + y<sup>2</sup>: đường mức 4x<sup>2</sup> + y<sup>2</sup> = k là elip; đồ thị là paraboloid elliptic (một “cái bát”). Hình dạng này — cái bát có đường mức elip — là mặt mất mát điển hình gần điểm cực tiểu trong học máy.</p></div>
<h3>📖 Giới hạn</h3>
<p>lim<sub>(x,y)→(a,b)</sub> f(x, y) = L nghĩa là f(x, y) gần L mỗi khi (x, y) gần (a, b) — tiến tới từ <strong>mọi</strong> hướng và theo <strong>mọi</strong> đường. Điều này mạnh hơn nhiều so với một biến, nơi chỉ có hai phía.</p>
<div class="formula"><span class="lbl">Phép thử hai đường</span>Nếu f → L<sub>1</sub> theo một đường và f → L<sub>2</sub> ≠ L<sub>1</sub> theo đường khác thì giới hạn không tồn tại.</div>
<div class="callout"><p><b>Ví dụ 3 — không có giới hạn.</b> f(x, y) = xy/(x<sup>2</sup> + y<sup>2</sup>) tại (0, 0). Theo y = mx: f = m x<sup>2</sup>/((1 + m<sup>2</sup>)x<sup>2</sup>) = m/(1 + m<sup>2</sup>). Theo y = 0 giá trị là 0, theo y = x là 1/2 ⇒ <b>giới hạn không tồn tại</b>.</p>
<p><b>Ví dụ 4 — giới hạn tồn tại.</b> f(x, y) = x<sup>2</sup>y/(x<sup>2</sup> + y<sup>2</sup>) tại (0, 0). Vì x<sup>2</sup> ≤ x<sup>2</sup> + y<sup>2</sup> nên |f| ≤ |y| → 0. Theo định lý kẹp <b>giới hạn bằng 0</b>. Thử các đường đi không bao giờ chứng minh được giới hạn tồn tại; định lý kẹp (hoặc toạ độ cực) thì được.</p></div>
<p><b>Tính liên tục.</b> f liên tục tại (a, b) nếu lim f(x, y) = f(a, b). Đa thức, cùng tổng, tích, thương (khi mẫu ≠ 0) và hợp của các hàm liên tục đều liên tục — nên đa số giới hạn tính bằng cách thế trực tiếp: lim<sub>(x,y)→(1,2)</sub> (x<sup>2</sup>y + 3y) = 2 + 6 = 8.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Thử hai, ba đường thẳng, thấy cùng giá trị, rồi kết luận giới hạn tồn tại.</li><li>Nhầm đồ thị (mặt trong 3D) với đường mức (đường cong trong mặt phẳng).</li><li>Quên điều kiện xác định: ln(x − y) cần x &gt; y.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Đồ thị z = f(x, y); đường mức f = k (bản đồ đồng mức).</li><li>Hai đường cho giới hạn khác nhau ⇒ không có giới hạn.</li><li>Kẹp / toạ độ cực chứng minh giới hạn tồn tại.</li><li>Hàm liên tục: thế trực tiếp.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS3 + '4-1-functions-of-several-variables', 'OpenStax Vol. 3 — 4.1 Hàm nhiều biến') + `</li><li>` + A(OS3 + '4-2-limits-and-continuity', 'OpenStax Vol. 3 — 4.2 Giới hạn và liên tục') + `</li><li>` + A(PN3 + 'MultiVrbleFcns.aspx', "Paul's Online Notes — Hàm nhiều biến") + `</li><li>` + A(PN3 + 'Limits.aspx', "Paul's Online Notes — Giới hạn (Calculus III)") + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tập xác định của f(x, y) = ln(x − y) + √(4 − x).</li><li>lim<sub>(x,y)→(0,0)</sub> (x<sup>2</sup> − y<sup>2</sup>)/(x<sup>2</sup> + y<sup>2</sup>) có tồn tại không?</li><li>lim<sub>(x,y)→(0,0)</sub> (x<sup>2</sup> + y<sup>2</sup>)/(√(x<sup>2</sup> + y<sup>2</sup> + 1) − 1). (Gợi ý: toạ độ cực, r<sup>2</sup> = x<sup>2</sup> + y<sup>2</sup>.)</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) <b>x &gt; y và x ≤ 4</b>. 2) Theo y = 0: 1; theo x = 0: −1 ⇒ <b>không tồn tại</b>. 3) r<sup>2</sup>/(√(r<sup>2</sup> + 1) − 1) = √(r<sup>2</sup> + 1) + 1 → <b>2</b> (nhân liên hợp).</p></div>`);

const c82 = L('cal121-ts-8-2',
  '8.2 — Partial derivatives and higher-order partial derivatives|||8.2 — Đạo hàm riêng và đạo hàm riêng cấp cao',
  'Định nghĩa f_x, f_y (giữ biến kia cố định), ý nghĩa hình học (độ dốc theo hướng trục), quy tắc tính, đạo hàm cấp hai và định lý Clairaut f_xy = f_yx; ví dụ x³+x²y³−2y², xe^(xy).',
  `<span class="eyebrow">CAL121 · Chapter 8 · Lesson 8.2</span>
<h2>Partial derivatives</h2>
<p class="lead">How fast does f(x, y) change if we move only in the x-direction? Freeze y, differentiate in x: that is the <strong>partial derivative</strong> ∂f/∂x. Every rule from CAL111 still works — you simply treat the other variables as constants.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute f<sub>x</sub>, f<sub>y</sub> (and f<sub>z</sub>) with the usual rules.</li><li>Interpret partial derivatives as slopes and rates of change.</li><li>Compute second-order partials and use Clairaut's theorem.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Definition</span>f<sub>x</sub>(a, b) = lim<sub>h→0</sub> [f(a + h, b) − f(a, b)]/h      f<sub>y</sub>(a, b) = lim<sub>h→0</sub> [f(a, b + h) − f(a, b)]/h<br>notations: f<sub>x</sub> = ∂f/∂x = ∂z/∂x = D<sub>x</sub>f</div>
<p><b>Geometry.</b> Slice the surface z = f(x, y) with the plane y = b: you get a curve, and f<sub>x</sub>(a, b) is the slope of its tangent at x = a. Likewise f<sub>y</sub> is the slope along the y-direction.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>1.</b> f(x, y) = x<sup>3</sup> + x<sup>2</sup>y<sup>3</sup> − 2y<sup>2</sup>. Treat y as a constant: <b>f<sub>x</sub> = 3x<sup>2</sup> + 2xy<sup>3</sup></b>. Treat x as a constant: <b>f<sub>y</sub> = 3x<sup>2</sup>y<sup>2</sup> − 4y</b>. At (2, 1): f<sub>x</sub> = 12 + 4 = 16, f<sub>y</sub> = 12 − 4 = 8. Interpretation: near (2, 1), f grows about 16 units per unit step in x and 8 per unit step in y.</p>
<p><b>2.</b> g(x, y) = x e<sup>xy</sup>. g<sub>x</sub> uses the product rule: <b>e<sup>xy</sup> + xy e<sup>xy</sup></b>; g<sub>y</sub> = x · x e<sup>xy</sup> = <b>x<sup>2</sup>e<sup>xy</sup></b>.</p>
<p><b>3 — three variables.</b> w = ln(x + 2y + 3z): w<sub>x</sub> = 1/(x + 2y + 3z), w<sub>y</sub> = 2/(x + 2y + 3z), w<sub>z</sub> = 3/(x + 2y + 3z).</p></div>
<h3>📖 Higher-order partial derivatives</h3>
<p>f<sub>xx</sub> = ∂<sup>2</sup>f/∂x<sup>2</sup>, f<sub>yy</sub>, and the mixed partials f<sub>xy</sub> = (f<sub>x</sub>)<sub>y</sub> and f<sub>yx</sub> = (f<sub>y</sub>)<sub>x</sub>.</p>
<div class="formula"><span class="lbl">Clairaut's theorem</span>If f<sub>xy</sub> and f<sub>yx</sub> are continuous near (a, b), then f<sub>xy</sub>(a, b) = f<sub>yx</sub>(a, b).</div>
<div class="callout"><p><b>Example 4.</b> For f = x<sup>3</sup> + x<sup>2</sup>y<sup>3</sup> − 2y<sup>2</sup>: f<sub>xx</sub> = 6x + 2y<sup>3</sup>, f<sub>yy</sub> = 6x<sup>2</sup>y − 4, f<sub>xy</sub> = 6xy<sup>2</sup> = f<sub>yx</sub> ✓. For g = x e<sup>xy</sup>: g<sub>xy</sub> = x(xy + 2)e<sup>xy</sup>, and differentiating g<sub>y</sub> = x<sup>2</sup>e<sup>xy</sup> in x gives the same.</p></div>
<p><b>Why it matters.</b> Partial derivatives appear in every partial differential equation of physics (heat, waves) and in the Hessian matrix of second partials that decides minima in Chapter 9 and in optimisation algorithms such as Newton's method.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Differentiating the “constant” variable: ∂/∂x (x<sup>2</sup>y<sup>3</sup>) = 2xy<sup>3</sup>, not 2x · 3y<sup>2</sup>.</li><li>Forgetting the chain rule: ∂/∂x sin(xy) = y cos(xy).</li><li>Mixing up the order notation: f<sub>xy</sub> means first x then y (by Clairaut it rarely matters, but say what you compute).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>f<sub>x</sub>: differentiate in x with all other variables frozen.</li><li>f<sub>x</sub>(a, b) = slope of the surface in the x-direction.</li><li>Second partials f<sub>xx</sub>, f<sub>xy</sub>, f<sub>yx</sub>, f<sub>yy</sub>.</li><li>Clairaut: mixed partials are equal for nice functions.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS3 + '4-3-partial-derivatives', 'OpenStax Vol. 3 — 4.3 Partial Derivatives') + `</li><li>` + A(PN3 + 'PartialDerivatives.aspx', "Paul's Online Notes — Partial Derivatives") + `</li><li>` + A(PN3 + 'HighOrderPartialDerivs.aspx', "Paul's Online Notes — Higher Order Partial Derivatives") + `</li><li>` + A('https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/2.-partial-derivatives/', 'MIT OCW 18.02SC — Unit 2: Partial Derivatives') + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>f(x, y) = x<sup>2</sup> sin y + y e<sup>x</sup>: find f<sub>x</sub> and f<sub>y</sub>.</li><li>For f(x, y) = x y<sup>2</sup>, compute f<sub>x</sub>(1, 2) and f<sub>y</sub>(1, 2).</li><li>Verify Clairaut for f(x, y) = x<sup>4</sup>y<sup>2</sup> − x<sup>3</sup>y.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) <b>f<sub>x</sub> = 2x sin y + y e<sup>x</sup></b>, <b>f<sub>y</sub> = x<sup>2</sup> cos y + e<sup>x</sup></b>. 2) f<sub>x</sub> = y<sup>2</sup> = <b>4</b>, f<sub>y</sub> = 2xy = <b>4</b>. 3) f<sub>x</sub> = 4x<sup>3</sup>y<sup>2</sup> − 3x<sup>2</sup>y ⇒ f<sub>xy</sub> = 8x<sup>3</sup>y − 3x<sup>2</sup>; f<sub>y</sub> = 2x<sup>4</sup>y − x<sup>3</sup> ⇒ f<sub>yx</sub> = 8x<sup>3</sup>y − 3x<sup>2</sup> ✓.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 8 · Bài 8.2</span>
<h2>Đạo hàm riêng</h2>
<p class="lead">f(x, y) thay đổi nhanh cỡ nào nếu ta chỉ đi theo hướng x? Giữ y cố định, đạo hàm theo x: đó là <strong>đạo hàm riêng</strong> ∂f/∂x. Mọi quy tắc của CAL111 vẫn dùng được — chỉ cần coi các biến khác là hằng số.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính f<sub>x</sub>, f<sub>y</sub> (và f<sub>z</sub>) bằng các quy tắc quen thuộc.</li><li>Hiểu đạo hàm riêng là độ dốc và tốc độ thay đổi.</li><li>Tính đạo hàm riêng cấp hai và dùng định lý Clairaut.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Định nghĩa</span>f<sub>x</sub>(a, b) = lim<sub>h→0</sub> [f(a + h, b) − f(a, b)]/h      f<sub>y</sub>(a, b) = lim<sub>h→0</sub> [f(a, b + h) − f(a, b)]/h<br>ký hiệu: f<sub>x</sub> = ∂f/∂x = ∂z/∂x = D<sub>x</sub>f</div>
<p><b>Hình học.</b> Cắt mặt z = f(x, y) bằng mặt phẳng y = b: được một đường cong, và f<sub>x</sub>(a, b) là hệ số góc tiếp tuyến của nó tại x = a. Tương tự f<sub>y</sub> là độ dốc theo hướng y.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>1.</b> f(x, y) = x<sup>3</sup> + x<sup>2</sup>y<sup>3</sup> − 2y<sup>2</sup>. Coi y là hằng: <b>f<sub>x</sub> = 3x<sup>2</sup> + 2xy<sup>3</sup></b>. Coi x là hằng: <b>f<sub>y</sub> = 3x<sup>2</sup>y<sup>2</sup> − 4y</b>. Tại (2, 1): f<sub>x</sub> = 12 + 4 = 16, f<sub>y</sub> = 12 − 4 = 8. Ý nghĩa: gần (2, 1), f tăng khoảng 16 đơn vị mỗi bước đơn vị theo x và 8 theo y.</p>
<p><b>2.</b> g(x, y) = x e<sup>xy</sup>. g<sub>x</sub> dùng quy tắc tích: <b>e<sup>xy</sup> + xy e<sup>xy</sup></b>; g<sub>y</sub> = x · x e<sup>xy</sup> = <b>x<sup>2</sup>e<sup>xy</sup></b>.</p>
<p><b>3 — ba biến.</b> w = ln(x + 2y + 3z): w<sub>x</sub> = 1/(x + 2y + 3z), w<sub>y</sub> = 2/(x + 2y + 3z), w<sub>z</sub> = 3/(x + 2y + 3z).</p></div>
<h3>📖 Đạo hàm riêng cấp cao</h3>
<p>f<sub>xx</sub> = ∂<sup>2</sup>f/∂x<sup>2</sup>, f<sub>yy</sub>, và đạo hàm hỗn hợp f<sub>xy</sub> = (f<sub>x</sub>)<sub>y</sub>, f<sub>yx</sub> = (f<sub>y</sub>)<sub>x</sub>.</p>
<div class="formula"><span class="lbl">Định lý Clairaut</span>Nếu f<sub>xy</sub> và f<sub>yx</sub> liên tục gần (a, b) thì f<sub>xy</sub>(a, b) = f<sub>yx</sub>(a, b).</div>
<div class="callout"><p><b>Ví dụ 4.</b> Với f = x<sup>3</sup> + x<sup>2</sup>y<sup>3</sup> − 2y<sup>2</sup>: f<sub>xx</sub> = 6x + 2y<sup>3</sup>, f<sub>yy</sub> = 6x<sup>2</sup>y − 4, f<sub>xy</sub> = 6xy<sup>2</sup> = f<sub>yx</sub> ✓. Với g = x e<sup>xy</sup>: g<sub>xy</sub> = x(xy + 2)e<sup>xy</sup>, và đạo hàm g<sub>y</sub> = x<sup>2</sup>e<sup>xy</sup> theo x cũng ra như vậy.</p></div>
<p><b>Vì sao quan trọng.</b> Đạo hàm riêng có mặt trong mọi phương trình đạo hàm riêng của vật lý (truyền nhiệt, sóng) và trong ma trận Hessian các đạo hàm cấp hai — thứ quyết định cực tiểu ở Chương 9 và trong các thuật toán tối ưu như phương pháp Newton.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đạo hàm cả biến “hằng”: ∂/∂x (x<sup>2</sup>y<sup>3</sup>) = 2xy<sup>3</sup>, không phải 2x · 3y<sup>2</sup>.</li><li>Quên quy tắc dây chuyền: ∂/∂x sin(xy) = y cos(xy).</li><li>Nhầm thứ tự ký hiệu: f<sub>xy</sub> là theo x trước rồi y (theo Clairaut thường không khác, nhưng hãy nói rõ mình tính gì).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>f<sub>x</sub>: đạo hàm theo x, mọi biến khác giữ nguyên.</li><li>f<sub>x</sub>(a, b) = độ dốc của mặt theo hướng x.</li><li>Đạo hàm cấp hai f<sub>xx</sub>, f<sub>xy</sub>, f<sub>yx</sub>, f<sub>yy</sub>.</li><li>Clairaut: đạo hàm hỗn hợp bằng nhau với hàm “đẹp”.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS3 + '4-3-partial-derivatives', 'OpenStax Vol. 3 — 4.3 Đạo hàm riêng') + `</li><li>` + A(PN3 + 'PartialDerivatives.aspx', "Paul's Online Notes — Partial Derivatives") + `</li><li>` + A(PN3 + 'HighOrderPartialDerivs.aspx', "Paul's Online Notes — Đạo hàm riêng cấp cao") + `</li><li>` + A('https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/2.-partial-derivatives/', 'MIT OCW 18.02SC — Unit 2: Đạo hàm riêng') + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>f(x, y) = x<sup>2</sup> sin y + y e<sup>x</sup>: tìm f<sub>x</sub> và f<sub>y</sub>.</li><li>Với f(x, y) = x y<sup>2</sup>, tính f<sub>x</sub>(1, 2) và f<sub>y</sub>(1, 2).</li><li>Kiểm Clairaut cho f(x, y) = x<sup>4</sup>y<sup>2</sup> − x<sup>3</sup>y.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) <b>f<sub>x</sub> = 2x sin y + y e<sup>x</sup></b>, <b>f<sub>y</sub> = x<sup>2</sup> cos y + e<sup>x</sup></b>. 2) f<sub>x</sub> = y<sup>2</sup> = <b>4</b>, f<sub>y</sub> = 2xy = <b>4</b>. 3) f<sub>x</sub> = 4x<sup>3</sup>y<sup>2</sup> − 3x<sup>2</sup>y ⇒ f<sub>xy</sub> = 8x<sup>3</sup>y − 3x<sup>2</sup>; f<sub>y</sub> = 2x<sup>4</sup>y − x<sup>3</sup> ⇒ f<sub>yx</sub> = 8x<sup>3</sup>y − 3x<sup>2</sup> ✓.</p></div>`);

const c83 = L('cal121-ts-8-3',
  '8.3 — Tangent planes, linear approximation and the chain rule|||8.3 — Mặt phẳng tiếp xúc, xấp xỉ tuyến tính và quy tắc dây chuyền',
  'Mặt phẳng tiếp xúc z = f(a,b) + f_x(x−a) + f_y(y−b), xấp xỉ tuyến tính và vi phân toàn phần, quy tắc dây chuyền nhiều biến (sơ đồ cây), đạo hàm hàm ẩn dy/dx = −F_x/F_y, ∂z/∂x = −F_x/F_z.',
  `<span class="eyebrow">CAL121 · Chapter 8 · Lesson 8.3</span>
<h2>Tangent planes, linear approximation and the chain rule</h2>
<p class="lead">Zoom in on a smooth surface and it looks flat — like its <strong>tangent plane</strong>. That plane gives the best linear approximation of f near a point, and composing such approximations gives the <strong>multivariable chain rule</strong>, which is exactly what backpropagation computes in a neural network.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write the tangent plane to z = f(x, y) and use it to approximate.</li><li>Use the total differential to estimate changes and errors.</li><li>Apply the chain rule with tree diagrams; differentiate implicitly.</li></ul>
<h3>📖 Tangent plane and linear approximation</h3>
<div class="formula"><span class="lbl">Tangent plane at (a, b, f(a, b))</span>z = f(a, b) + f<sub>x</sub>(a, b)(x − a) + f<sub>y</sub>(a, b)(y − b)<br>linearisation: f(x, y) ≈ L(x, y) = the right-hand side, for (x, y) near (a, b)<br>total differential: dz = f<sub>x</sub> dx + f<sub>y</sub> dy</div>
<div class="callout"><p><b>Example 1.</b> z = 2x<sup>2</sup> + y<sup>2</sup> at (1, 1, 3): f<sub>x</sub> = 4x = 4, f<sub>y</sub> = 2y = 2 ⇒ <b>z = 3 + 4(x − 1) + 2(y − 1)</b>, i.e. z = 4x + 2y − 3.</p>
<p><b>Example 2 — approximation.</b> f = x<sup>3</sup> + x<sup>2</sup>y<sup>3</sup> − 2y<sup>2</sup> (Lesson 8.2): f(2, 1) = 10, f<sub>x</sub> = 16, f<sub>y</sub> = 8. So f(2.1, 0.9) ≈ 10 + 16(0.1) + 8(−0.1) = <b>10.8</b>. The exact value is 10.85589 — off by 0.056 for a 0.1 step.</p>
<p><b>Example 3 — error estimate.</b> A cylinder has r = 10 cm, h = 25 cm, each measured within ±0.1 cm. V = πr<sup>2</sup>h, dV = 2πrh dr + πr<sup>2</sup> dh = 2π(10)(25)(0.1) + π(100)(0.1) = 60π ≈ <b>188 cm<sup>3</sup></b> maximum error (about 2.4% of V = 2500π).</p></div>
<h3>📖 The chain rule</h3>
<div class="formula"><span class="lbl">Chain rule</span>z = f(x, y), x = x(t), y = y(t):   dz/dt = (∂z/∂x)(dx/dt) + (∂z/∂y)(dy/dt)<br>x = x(s, t), y = y(s, t):   ∂z/∂s = z<sub>x</sub> x<sub>s</sub> + z<sub>y</sub> y<sub>s</sub>,  ∂z/∂t = z<sub>x</sub> x<sub>t</sub> + z<sub>y</sub> y<sub>t</sub></div>
<p><b>Tree diagram:</b> draw z at the top, branches to x and y, then branches to the independent variables. For each path from z down to t multiply the derivatives along it, then add over all paths.</p>
<div class="callout"><p><b>Example 4.</b> z = x<sup>2</sup>y + 3xy<sup>4</sup>, x = sin 2t, y = cos t. At t = 0: x = 0, y = 1; z<sub>x</sub> = 2xy + 3y<sup>4</sup> = 3, z<sub>y</sub> = x<sup>2</sup> + 12xy<sup>3</sup> = 0, dx/dt = 2cos 2t = 2, dy/dt = −sin t = 0. dz/dt = 3 · 2 + 0 · 0 = <b>6</b>.</p></div>
<div class="formula"><span class="lbl">Implicit differentiation</span>F(x, y) = 0 ⇒ dy/dx = −F<sub>x</sub>/F<sub>y</sub>      F(x, y, z) = 0 ⇒ ∂z/∂x = −F<sub>x</sub>/F<sub>z</sub>,  ∂z/∂y = −F<sub>y</sub>/F<sub>z</sub></div>
<div class="callout"><p><b>Example 5.</b> x<sup>2</sup> + y<sup>2</sup> = 25: dy/dx = −2x/(2y) = −x/y (as in CAL111, but in one line). <b>Example 6.</b> x<sup>3</sup> + y<sup>3</sup> + z<sup>3</sup> + 6xyz = 1: ∂z/∂x = −(3x<sup>2</sup> + 6yz)/(3z<sup>2</sup> + 6xy) = <b>−(x<sup>2</sup> + 2yz)/(z<sup>2</sup> + 2xy)</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Evaluating partial derivatives at the wrong point (they must be at (a, b), not at (x, y)).</li><li>Missing a path in the tree diagram.</li><li>Dropping the minus sign in −F<sub>x</sub>/F<sub>y</sub>.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Tangent plane: z = f(a,b) + f<sub>x</sub>(x − a) + f<sub>y</sub>(y − b).</li><li>dz = f<sub>x</sub>dx + f<sub>y</sub>dy estimates small changes and errors.</li><li>Chain rule: sum over paths of products of derivatives.</li><li>Implicit: dy/dx = −F<sub>x</sub>/F<sub>y</sub>.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS3 + '4-4-tangent-planes-and-linear-approximations', 'OpenStax Vol. 3 — 4.4 Tangent Planes and Linear Approximations') + `</li><li>` + A(OS3 + '4-5-the-chain-rule', 'OpenStax Vol. 3 — 4.5 The Chain Rule') + `</li><li>` + A(PN3 + 'TangentPlanes.aspx', "Paul's Online Notes — Tangent Planes and Linear Approximations") + `</li><li>` + A(PN3 + 'ChainRule.aspx', "Paul's Online Notes — Chain Rule") + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>Tangent plane to z = xy at (2, 3, 6).</li><li>z = e<sup>x</sup> sin y, x = st<sup>2</sup>, y = s<sup>2</sup>t. Find ∂z/∂s.</li><li>Find dy/dx for x<sup>3</sup> + y<sup>3</sup> = 6xy.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) f<sub>x</sub> = y = 3, f<sub>y</sub> = x = 2 ⇒ <b>z = 6 + 3(x − 2) + 2(y − 3)</b>. 2) ∂z/∂s = e<sup>x</sup> sin y · t<sup>2</sup> + e<sup>x</sup> cos y · 2st = <b>e<sup>st<sup>2</sup></sup>(t<sup>2</sup> sin(s<sup>2</sup>t) + 2st cos(s<sup>2</sup>t))</b>. 3) F = x<sup>3</sup> + y<sup>3</sup> − 6xy: <b>dy/dx = −(3x<sup>2</sup> − 6y)/(3y<sup>2</sup> − 6x) = (2y − x<sup>2</sup>)/(y<sup>2</sup> − 2x)</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 8 · Bài 8.3</span>
<h2>Mặt phẳng tiếp xúc, xấp xỉ tuyến tính và quy tắc dây chuyền</h2>
<p class="lead">Phóng to một mặt trơn thì nó trông phẳng — giống <strong>mặt phẳng tiếp xúc</strong> của nó. Mặt phẳng đó cho xấp xỉ tuyến tính tốt nhất của f gần một điểm, và ghép các xấp xỉ như vậy cho <strong>quy tắc dây chuyền nhiều biến</strong> — chính là thứ lan truyền ngược (backpropagation) tính trong mạng nơ-ron.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết mặt phẳng tiếp xúc của z = f(x, y) và dùng nó để xấp xỉ.</li><li>Dùng vi phân toàn phần ước lượng thay đổi và sai số.</li><li>Áp dụng quy tắc dây chuyền bằng sơ đồ cây; đạo hàm hàm ẩn.</li></ul>
<h3>📖 Mặt phẳng tiếp xúc và xấp xỉ tuyến tính</h3>
<div class="formula"><span class="lbl">Mặt phẳng tiếp xúc tại (a, b, f(a, b))</span>z = f(a, b) + f<sub>x</sub>(a, b)(x − a) + f<sub>y</sub>(a, b)(y − b)<br>tuyến tính hoá: f(x, y) ≈ L(x, y) = vế phải, với (x, y) gần (a, b)<br>vi phân toàn phần: dz = f<sub>x</sub> dx + f<sub>y</sub> dy</div>
<div class="callout"><p><b>Ví dụ 1.</b> z = 2x<sup>2</sup> + y<sup>2</sup> tại (1, 1, 3): f<sub>x</sub> = 4x = 4, f<sub>y</sub> = 2y = 2 ⇒ <b>z = 3 + 4(x − 1) + 2(y − 1)</b>, tức z = 4x + 2y − 3.</p>
<p><b>Ví dụ 2 — xấp xỉ.</b> f = x<sup>3</sup> + x<sup>2</sup>y<sup>3</sup> − 2y<sup>2</sup> (Bài 8.2): f(2, 1) = 10, f<sub>x</sub> = 16, f<sub>y</sub> = 8. Vậy f(2,1; 0,9) ≈ 10 + 16(0,1) + 8(−0,1) = <b>10,8</b>. Giá trị đúng là 10,85589 — lệch 0,056 với bước 0,1.</p>
<p><b>Ví dụ 3 — ước lượng sai số.</b> Hình trụ r = 10 cm, h = 25 cm, mỗi số đo sai tối đa ±0,1 cm. V = πr<sup>2</sup>h, dV = 2πrh dr + πr<sup>2</sup> dh = 2π(10)(25)(0,1) + π(100)(0,1) = 60π ≈ <b>188 cm<sup>3</sup></b> sai số tối đa (khoảng 2,4% của V = 2500π).</p></div>
<h3>📖 Quy tắc dây chuyền</h3>
<div class="formula"><span class="lbl">Quy tắc dây chuyền</span>z = f(x, y), x = x(t), y = y(t):   dz/dt = (∂z/∂x)(dx/dt) + (∂z/∂y)(dy/dt)<br>x = x(s, t), y = y(s, t):   ∂z/∂s = z<sub>x</sub> x<sub>s</sub> + z<sub>y</sub> y<sub>s</sub>,  ∂z/∂t = z<sub>x</sub> x<sub>t</sub> + z<sub>y</sub> y<sub>t</sub></div>
<p><b>Sơ đồ cây:</b> vẽ z ở đỉnh, nhánh xuống x và y, rồi nhánh xuống các biến độc lập. Với mỗi đường từ z xuống t, nhân các đạo hàm dọc đường, rồi cộng mọi đường.</p>
<div class="callout"><p><b>Ví dụ 4.</b> z = x<sup>2</sup>y + 3xy<sup>4</sup>, x = sin 2t, y = cos t. Tại t = 0: x = 0, y = 1; z<sub>x</sub> = 2xy + 3y<sup>4</sup> = 3, z<sub>y</sub> = x<sup>2</sup> + 12xy<sup>3</sup> = 0, dx/dt = 2cos 2t = 2, dy/dt = −sin t = 0. dz/dt = 3 · 2 + 0 · 0 = <b>6</b>.</p></div>
<div class="formula"><span class="lbl">Đạo hàm hàm ẩn</span>F(x, y) = 0 ⇒ dy/dx = −F<sub>x</sub>/F<sub>y</sub>      F(x, y, z) = 0 ⇒ ∂z/∂x = −F<sub>x</sub>/F<sub>z</sub>,  ∂z/∂y = −F<sub>y</sub>/F<sub>z</sub></div>
<div class="callout"><p><b>Ví dụ 5.</b> x<sup>2</sup> + y<sup>2</sup> = 25: dy/dx = −2x/(2y) = −x/y (như CAL111, nhưng chỉ một dòng). <b>Ví dụ 6.</b> x<sup>3</sup> + y<sup>3</sup> + z<sup>3</sup> + 6xyz = 1: ∂z/∂x = −(3x<sup>2</sup> + 6yz)/(3z<sup>2</sup> + 6xy) = <b>−(x<sup>2</sup> + 2yz)/(z<sup>2</sup> + 2xy)</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tính đạo hàm riêng ở sai điểm (phải tại (a, b), không phải tại (x, y)).</li><li>Bỏ sót một đường trong sơ đồ cây.</li><li>Mất dấu trừ trong −F<sub>x</sub>/F<sub>y</sub>.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Mặt phẳng tiếp xúc: z = f(a,b) + f<sub>x</sub>(x − a) + f<sub>y</sub>(y − b).</li><li>dz = f<sub>x</sub>dx + f<sub>y</sub>dy ước lượng thay đổi nhỏ và sai số.</li><li>Dây chuyền: cộng theo mọi đường tích các đạo hàm.</li><li>Hàm ẩn: dy/dx = −F<sub>x</sub>/F<sub>y</sub>.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS3 + '4-4-tangent-planes-and-linear-approximations', 'OpenStax Vol. 3 — 4.4 Mặt phẳng tiếp xúc và xấp xỉ tuyến tính') + `</li><li>` + A(OS3 + '4-5-the-chain-rule', 'OpenStax Vol. 3 — 4.5 Quy tắc dây chuyền') + `</li><li>` + A(PN3 + 'TangentPlanes.aspx', "Paul's Online Notes — Mặt phẳng tiếp xúc") + `</li><li>` + A(PN3 + 'ChainRule.aspx', "Paul's Online Notes — Chain Rule") + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Mặt phẳng tiếp xúc của z = xy tại (2, 3, 6).</li><li>z = e<sup>x</sup> sin y, x = st<sup>2</sup>, y = s<sup>2</sup>t. Tìm ∂z/∂s.</li><li>Tìm dy/dx cho x<sup>3</sup> + y<sup>3</sup> = 6xy.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) f<sub>x</sub> = y = 3, f<sub>y</sub> = x = 2 ⇒ <b>z = 6 + 3(x − 2) + 2(y − 3)</b>. 2) ∂z/∂s = e<sup>x</sup> sin y · t<sup>2</sup> + e<sup>x</sup> cos y · 2st = <b>e<sup>st<sup>2</sup></sup>(t<sup>2</sup> sin(s<sup>2</sup>t) + 2st cos(s<sup>2</sup>t))</b>. 3) F = x<sup>3</sup> + y<sup>3</sup> − 6xy: <b>dy/dx = −(3x<sup>2</sup> − 6y)/(3y<sup>2</sup> − 6x) = (2y − x<sup>2</sup>)/(y<sup>2</sup> − 2x)</b>.</p></div>`);

const c84 = L('cal121-ts-8-4',
  '8.4 — Directional derivatives and the gradient (with gradient descent in Python)|||8.4 — Đạo hàm theo hướng và gradient (kèm gradient descent bằng Python)',
  'Đạo hàm theo hướng D_u f = ∇f·u, vectơ gradient, hướng tăng nhanh nhất và tốc độ |∇f|, gradient vuông góc đường mức, mặt phẳng tiếp xúc của mặt mức; code Python gradient descent chạy thật hội tụ về (3, −1).',
  `<span class="eyebrow">CAL121 · Chapter 8 · Lesson 8.4</span>
<h2>Directional derivatives and the gradient</h2>
<p class="lead">Standing on a hillside z = f(x, y), which way is steepest uphill, and how steep is it? The answer is a single vector, the <strong>gradient</strong> ∇f. Walking against it — downhill — is <strong>gradient descent</strong>, the algorithm that trains almost every machine-learning model.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute the gradient and directional derivatives.</li><li>Find the direction and rate of maximum increase.</li><li>Use ∇f as a normal vector to level curves and level surfaces.</li><li>Run gradient descent and see it converge.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Gradient and directional derivative</span>∇f(x, y) = ⟨f<sub>x</sub>, f<sub>y</sub>⟩   (in 3D: ⟨f<sub>x</sub>, f<sub>y</sub>, f<sub>z</sub>⟩)<br>D<sub>u</sub>f = ∇f · u   for a <strong>unit</strong> vector u</div>
<p>Since ∇f · u = |∇f| cos θ, the directional derivative is largest when u points along ∇f (θ = 0):</p>
<div class="formula"><span class="lbl">Steepest ascent</span>max D<sub>u</sub>f = |∇f|, attained in the direction of ∇f; steepest descent is −∇f; D<sub>u</sub>f = 0 along level curves, so ∇f ⊥ level curves.</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>1.</b> f(x, y) = x<sup>2</sup>y<sup>3</sup> − 4y at (2, −1) in the direction of v = ⟨2, 5⟩.</p>
<p>∇f = ⟨2xy<sup>3</sup>, 3x<sup>2</sup>y<sup>2</sup> − 4⟩ = ⟨−4, 8⟩ at (2, −1). Unit vector u = ⟨2, 5⟩/√29. D<sub>u</sub>f = (−8 + 40)/√29 = 32/√29 ≈ <b>5.94</b>. Maximum rate at that point: |∇f| = √80 = <b>4√5 ≈ 8.94</b>, in the direction ⟨−4, 8⟩.</p></div>
<div class="callout"><p><b>2 — normal to a level surface.</b> The tangent plane to F(x, y, z) = k at P has normal ∇F(P). For the sphere x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup> = 14 at (1, 2, 3): ∇F = ⟨2, 4, 6⟩ ⇒ plane 2(x − 1) + 4(y − 2) + 6(z − 3) = 0, i.e. <b>x + 2y + 3z = 14</b>.</p></div>
<h3>💻 Gradient descent</h3>
<p>To minimise f, repeat: <b>(x, y) ← (x, y) − η ∇f(x, y)</b> with a small learning rate η. For f(x, y) = (x − 3)<sup>2</sup> + 2(y + 1)<sup>2</sup> (minimum 0 at (3, −1)), ∇f = ⟨2(x − 3), 4(y + 1)⟩:</p>
` + GD_PY + `
<p>The y-coordinate converges faster because the bowl is steeper in y (curvature 4 vs 2). With η too large (here η &gt; 0.5) the iteration overshoots and diverges — the same trade-off you will tune when training neural networks.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using a non-unit vector in D<sub>u</sub>f = ∇f · u (always divide by |v|).</li><li>Thinking ∇f is a number — it is a vector in the domain (the xy-plane), not on the surface.</li><li>Gradient descent moves along <strong>−</strong>∇f; using +∇f maximises.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>∇f = ⟨f<sub>x</sub>, f<sub>y</sub>⟩; D<sub>u</sub>f = ∇f · u.</li><li>Fastest increase: direction ∇f, rate |∇f|.</li><li>∇f ⊥ level curves; ∇F is the normal of a level surface.</li><li>Gradient descent: x ← x − η∇f.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS3 + '4-6-directional-derivatives-and-the-gradient', 'OpenStax Vol. 3 — 4.6 Directional Derivatives and the Gradient') + `</li><li>` + A(PN3 + 'DirectionalDeriv.aspx', "Paul's Online Notes — Directional Derivatives") + `</li><li>` + A('https://www.3blue1brown.com/lessons/gradient-descent', '3Blue1Brown — Gradient descent, how neural networks learn') + `</li><li>` + A('https://www.coursera.org/learn/multivariate-calculus-machine-learning', 'Coursera — Multivariate Calculus for Machine Learning (Imperial College)') + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>∇f for f(x, y) = x y<sup>2</sup> at (1, 2), and D<sub>u</sub>f in the direction of ⟨3, 4⟩.</li><li>In which direction does f(x, y) = x<sup>2</sup> + y<sup>2</sup> decrease fastest at (1, 1)?</li><li>Tangent plane to x<sup>2</sup> + 2y<sup>2</sup> + 3z<sup>2</sup> = 6 at (1, 1, 1).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) ∇f = ⟨y<sup>2</sup>, 2xy⟩ = <b>⟨4, 4⟩</b>; u = ⟨3, 4⟩/5 ⇒ D<sub>u</sub>f = (12 + 16)/5 = <b>28/5</b>. 2) −∇f = <b>⟨−2, −2⟩</b> (towards the origin). 3) ∇F = ⟨2, 4, 6⟩ ⇒ <b>x + 2y + 3z = 6</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 8 · Bài 8.4</span>
<h2>Đạo hàm theo hướng và gradient</h2>
<p class="lead">Đứng trên sườn đồi z = f(x, y), hướng nào dốc lên nhất, và dốc cỡ nào? Câu trả lời là một vectơ duy nhất, <strong>gradient</strong> ∇f. Đi ngược nó — xuống dốc — là <strong>gradient descent</strong>, thuật toán huấn luyện gần như mọi mô hình học máy.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính gradient và đạo hàm theo hướng.</li><li>Tìm hướng và tốc độ tăng nhanh nhất.</li><li>Dùng ∇f làm pháp tuyến của đường mức và mặt mức.</li><li>Chạy gradient descent và thấy nó hội tụ.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Gradient và đạo hàm theo hướng</span>∇f(x, y) = ⟨f<sub>x</sub>, f<sub>y</sub>⟩   (trong 3D: ⟨f<sub>x</sub>, f<sub>y</sub>, f<sub>z</sub>⟩)<br>D<sub>u</sub>f = ∇f · u   với u là vectơ <strong>đơn vị</strong></div>
<p>Vì ∇f · u = |∇f| cos θ, đạo hàm theo hướng lớn nhất khi u cùng hướng ∇f (θ = 0):</p>
<div class="formula"><span class="lbl">Hướng dốc nhất</span>max D<sub>u</sub>f = |∇f|, đạt theo hướng ∇f; xuống dốc nhất là −∇f; D<sub>u</sub>f = 0 dọc đường mức, nên ∇f ⊥ đường mức.</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>1.</b> f(x, y) = x<sup>2</sup>y<sup>3</sup> − 4y tại (2, −1) theo hướng v = ⟨2, 5⟩.</p>
<p>∇f = ⟨2xy<sup>3</sup>, 3x<sup>2</sup>y<sup>2</sup> − 4⟩ = ⟨−4, 8⟩ tại (2, −1). Vectơ đơn vị u = ⟨2, 5⟩/√29. D<sub>u</sub>f = (−8 + 40)/√29 = 32/√29 ≈ <b>5,94</b>. Tốc độ lớn nhất tại điểm đó: |∇f| = √80 = <b>4√5 ≈ 8,94</b>, theo hướng ⟨−4, 8⟩.</p></div>
<div class="callout"><p><b>2 — pháp tuyến của mặt mức.</b> Mặt phẳng tiếp xúc với F(x, y, z) = k tại P có pháp tuyến ∇F(P). Với mặt cầu x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup> = 14 tại (1, 2, 3): ∇F = ⟨2, 4, 6⟩ ⇒ mặt phẳng 2(x − 1) + 4(y − 2) + 6(z − 3) = 0, tức <b>x + 2y + 3z = 14</b>.</p></div>
<h3>💻 Gradient descent</h3>
<p>Để cực tiểu hoá f, lặp: <b>(x, y) ← (x, y) − η ∇f(x, y)</b> với tốc độ học η nhỏ. Với f(x, y) = (x − 3)<sup>2</sup> + 2(y + 1)<sup>2</sup> (cực tiểu 0 tại (3, −1)), ∇f = ⟨2(x − 3), 4(y + 1)⟩:</p>
` + GD_PY + `
<p>Toạ độ y hội tụ nhanh hơn vì cái bát dốc hơn theo y (độ cong 4 so với 2). Nếu η quá lớn (ở đây η &gt; 0,5) phép lặp vọt quá và phân kỳ — đúng sự đánh đổi bạn sẽ phải tinh chỉnh khi huấn luyện mạng nơ-ron.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng vectơ không đơn vị trong D<sub>u</sub>f = ∇f · u (luôn chia cho |v|).</li><li>Nghĩ ∇f là một số — nó là vectơ trong miền xác định (mặt phẳng Oxy), không nằm trên mặt cong.</li><li>Gradient descent đi theo <strong>−</strong>∇f; đi theo +∇f là cực đại hoá.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>∇f = ⟨f<sub>x</sub>, f<sub>y</sub>⟩; D<sub>u</sub>f = ∇f · u.</li><li>Tăng nhanh nhất: hướng ∇f, tốc độ |∇f|.</li><li>∇f ⊥ đường mức; ∇F là pháp tuyến của mặt mức.</li><li>Gradient descent: x ← x − η∇f.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS3 + '4-6-directional-derivatives-and-the-gradient', 'OpenStax Vol. 3 — 4.6 Đạo hàm theo hướng và gradient') + `</li><li>` + A(PN3 + 'DirectionalDeriv.aspx', "Paul's Online Notes — Đạo hàm theo hướng") + `</li><li>` + A('https://www.3blue1brown.com/lessons/gradient-descent', '3Blue1Brown — Gradient descent, mạng nơ-ron học thế nào') + `</li><li>` + A('https://www.coursera.org/learn/multivariate-calculus-machine-learning', 'Coursera — Giải tích nhiều biến cho học máy (Imperial College)') + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>∇f của f(x, y) = x y<sup>2</sup> tại (1, 2), và D<sub>u</sub>f theo hướng ⟨3, 4⟩.</li><li>Theo hướng nào f(x, y) = x<sup>2</sup> + y<sup>2</sup> giảm nhanh nhất tại (1, 1)?</li><li>Mặt phẳng tiếp xúc của x<sup>2</sup> + 2y<sup>2</sup> + 3z<sup>2</sup> = 6 tại (1, 1, 1).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) ∇f = ⟨y<sup>2</sup>, 2xy⟩ = <b>⟨4, 4⟩</b>; u = ⟨3, 4⟩/5 ⇒ D<sub>u</sub>f = (12 + 16)/5 = <b>28/5</b>. 2) −∇f = <b>⟨−2, −2⟩</b> (hướng về gốc toạ độ). 3) ∇F = ⟨2, 4, 6⟩ ⇒ <b>x + 2y + 3z = 6</b>.</p></div>`);

const q8 = QZ(8, 'Quiz — Chapter 8: Partial derivatives|||Quiz — Chương 8: Đạo hàm riêng', 'Kiểm tra chương 8: giới hạn hai biến, đạo hàm riêng, Clairaut, mặt phẳng tiếp xúc, xấp xỉ tuyến tính, dây chuyền, gradient, đạo hàm theo hướng, gradient descent.', [
  Q('q1', 'lim xy/(x² + y²) as (x, y) → (0, 0):|||lim xy/(x² + y²) khi (x, y) → (0, 0):',
    ['0|||0', '1/2|||1/2', 'does not exist|||không tồn tại', '1|||1'], 2,
    'Along y = mx the value is m/(1 + m²), which depends on m.|||Theo y = mx giá trị là m/(1 + m²), phụ thuộc m.'),
  Q('q2', 'For f = x³ + x²y³ − 2y², f_x =|||Với f = x³ + x²y³ − 2y², f_x =',
    ['3x² + 2xy³|||3x² + 2xy³', '3x² + 6xy²|||3x² + 6xy²', '3x²y² − 4y|||3x²y² − 4y', '3x² + 2xy³ − 4y|||3x² + 2xy³ − 4y'], 0,
    'Treat y as a constant.|||Coi y là hằng số.'),
  Q('q3', "Clairaut's theorem says that (for nice f)|||Định lý Clairaut nói rằng (với f đẹp)",
    ['f_xx = f_yy|||f_xx = f_yy', 'f_xy = f_yx|||f_xy = f_yx', 'f_x = f_y|||f_x = f_y', 'f_xy = 0|||f_xy = 0'], 1,
    'Mixed partials are equal when continuous.|||Đạo hàm hỗn hợp bằng nhau khi liên tục.'),
  Q('q4', 'Tangent plane to z = 2x² + y² at (1, 1, 3):|||Mặt phẳng tiếp xúc của z = 2x² + y² tại (1, 1, 3):',
    ['z = 4x + 2y − 3|||z = 4x + 2y − 3', 'z = 2x + y|||z = 2x + y', 'z = 4x + 2y + 3|||z = 4x + 2y + 3', 'z = 3 + 2(x − 1) + (y − 1)|||z = 3 + 2(x − 1) + (y − 1)'], 0,
    'f_x = 4, f_y = 2: z = 3 + 4(x − 1) + 2(y − 1).|||f_x = 4, f_y = 2: z = 3 + 4(x − 1) + 2(y − 1).'),
  Q('q5', 'With f(2,1) = 10, f_x = 16, f_y = 8, the linear approximation of f(2.1, 0.9) is|||Với f(2,1) = 10, f_x = 16, f_y = 8, xấp xỉ tuyến tính của f(2,1; 0,9) là',
    ['10.8|||10,8', '12.4|||12,4', '10.0|||10,0', '9.2|||9,2'], 0,
    '10 + 16(0.1) + 8(−0.1).|||10 + 16(0,1) + 8(−0,1).'),
  Q('q6', 'z = x²y + 3xy⁴, x = sin 2t, y = cos t. dz/dt at t = 0 is|||z = x²y + 3xy⁴, x = sin 2t, y = cos t. dz/dt tại t = 0 là',
    ['0|||0', '3|||3', '6|||6', '12|||12'], 2,
    'z_x = 3, dx/dt = 2, z_y·dy/dt = 0.|||z_x = 3, dx/dt = 2, z_y·dy/dt = 0.'),
  Q('q7', 'For F(x, y) = 0, dy/dx =|||Với F(x, y) = 0, dy/dx =',
    ['F_x/F_y|||F_x/F_y', '−F_x/F_y|||−F_x/F_y', '−F_y/F_x|||−F_y/F_x', 'F_x·F_y|||F_x·F_y'], 1,
    'From the chain rule: F_x + F_y·dy/dx = 0.|||Từ quy tắc dây chuyền: F_x + F_y·dy/dx = 0.'),
  Q('q8', 'The maximum rate of increase of f at a point equals|||Tốc độ tăng lớn nhất của f tại một điểm bằng',
    ['f_x + f_y|||f_x + f_y', 'the length of ∇f|||độ dài của ∇f', '0|||0', 'the largest of f_x and f_y|||số lớn hơn trong f_x và f_y'], 1,
    'D_u f = ∇f·u = |∇f|cos θ, maximal at θ = 0.|||D_u f = ∇f·u = |∇f|cos θ, lớn nhất khi θ = 0.'),
  Q('q9', 'f = x²y³ − 4y at (2, −1): ∇f =|||f = x²y³ − 4y tại (2, −1): ∇f =',
    ['⟨−4, 8⟩|||⟨−4, 8⟩', '⟨4, −8⟩|||⟨4, −8⟩', '⟨−4, 12⟩|||⟨−4, 12⟩', '⟨8, −4⟩|||⟨8, −4⟩'], 0,
    '⟨2xy³, 3x²y² − 4⟩ = ⟨−4, 12 − 4⟩.|||⟨2xy³, 3x²y² − 4⟩ = ⟨−4, 12 − 4⟩.'),
  Q('q10', 'One gradient descent step from (0, 0) for f = (x − 3)² + 2(y + 1)² with η = 0.1 gives|||Một bước gradient descent từ (0, 0) cho f = (x − 3)² + 2(y + 1)² với η = 0,1 cho',
    ['(0.6, −0.4)|||(0,6; −0,4)', '(−0.6, 0.4)|||(−0,6; 0,4)', '(3, −1)|||(3, −1)', '(0.3, −0.1)|||(0,3; −0,1)'], 0,
    '∇f(0,0) = ⟨−6, 4⟩; subtract 0.1·∇f.|||∇f(0,0) = ⟨−6, 4⟩; trừ 0,1·∇f.'),
]);

const ch8 = {
  title: 'Chapter 8 — Functions of several variables and partial derivatives|||Chương 8 — Hàm nhiều biến và đạo hàm riêng',
  description: 'Đồ thị, đường mức, giới hạn hai biến, đạo hàm riêng và Clairaut, mặt phẳng tiếp xúc, xấp xỉ tuyến tính, quy tắc dây chuyền, gradient và đạo hàm theo hướng, gradient descent bằng Python (Stewart 14.1–14.6 · OpenStax Vol.3 4.1–4.6).',
  lessons: [c81, c82, c83, c84, q8],
};

// ───────────────────────────── Chương 9 — Cực trị hàm nhiều biến ─────────────────────────────
const c91 = L('cal121-ts-9-1',
  '9.1 — Local extrema and the second derivative test|||9.1 — Cực trị địa phương và tiêu chuẩn đạo hàm cấp hai',
  'Điểm tới hạn ∇f = 0, điểm yên ngựa, tiêu chuẩn D = f_xx f_yy − f_xy² (Hessian); ví dụ x⁴+y⁴−4xy+1, x³+y³−3xy; hồi quy tuyến tính bình phương tối thiểu như bài toán cực tiểu.',
  `<span class="eyebrow">CAL121 · Chapter 9 · Lesson 9.1</span>
<h2>Local extrema and the second derivative test</h2>
<p class="lead">At the top of a hill or the bottom of a valley, the tangent plane is horizontal: both partial derivatives vanish. But a horizontal tangent plane can also sit on a <strong>saddle</strong> — up in one direction, down in another. The second derivative test tells them apart.</p>
<h3>🎯 Objectives</h3>
<ul><li>Find critical points by solving ∇f = 0.</li><li>Classify them with the discriminant D = f<sub>xx</sub>f<sub>yy</sub> − f<sub>xy</sub><sup>2</sup>.</li><li>Recognise least-squares fitting as a two-variable minimisation.</li></ul>
<h3>📖 Lecture</h3>
<p>f has a <strong>local maximum</strong> at (a, b) if f(x, y) ≤ f(a, b) near (a, b) (local minimum: ≥). If f has a local extremum at (a, b) and the partial derivatives exist there, then f<sub>x</sub>(a, b) = f<sub>y</sub>(a, b) = 0. Points where ∇f = 0 (or does not exist) are <strong>critical points</strong>.</p>
<div class="formula"><span class="lbl">Second derivative test</span>At a critical point, let D = f<sub>xx</sub>f<sub>yy</sub> − (f<sub>xy</sub>)<sup>2</sup> (the determinant of the Hessian matrix).<br>D &gt; 0 and f<sub>xx</sub> &gt; 0 ⇒ local minimum     D &gt; 0 and f<sub>xx</sub> &lt; 0 ⇒ local maximum<br>D &lt; 0 ⇒ saddle point     D = 0 ⇒ test inconclusive</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> f(x, y) = x<sup>4</sup> + y<sup>4</sup> − 4xy + 1.</p>
<p>Step 1: f<sub>x</sub> = 4x<sup>3</sup> − 4y = 0 ⇒ y = x<sup>3</sup>; f<sub>y</sub> = 4y<sup>3</sup> − 4x = 0 ⇒ x = y<sup>3</sup> = x<sup>9</sup> ⇒ x(x<sup>8</sup> − 1) = 0 ⇒ x = 0, ±1. Critical points (0, 0), (1, 1), (−1, −1).</p>
<p>Step 2: f<sub>xx</sub> = 12x<sup>2</sup>, f<sub>yy</sub> = 12y<sup>2</sup>, f<sub>xy</sub> = −4 ⇒ D = 144x<sup>2</sup>y<sup>2</sup> − 16.</p>
<p>Step 3: (0, 0): D = −16 &lt; 0 ⇒ <b>saddle</b>. (±1, ±1): D = 128 &gt; 0, f<sub>xx</sub> = 12 &gt; 0 ⇒ <b>local minima</b> with value f = −1.</p></div>
<div class="callout"><p><b>Example 2.</b> f(x, y) = x<sup>3</sup> + y<sup>3</sup> − 3xy. f<sub>x</sub> = 3x<sup>2</sup> − 3y, f<sub>y</sub> = 3y<sup>2</sup> − 3x ⇒ critical points (0, 0) and (1, 1). D = 36xy − 9: at (0, 0) D = −9 ⇒ saddle; at (1, 1) D = 27 &gt; 0, f<sub>xx</sub> = 6 &gt; 0 ⇒ <b>local minimum f(1, 1) = −1</b>.</p></div>
<h3>📖 Application: least squares</h3>
<p>Fit a line y = mx + b to data points (1, 1), (2, 2), (3, 2). Minimise the sum of squared errors E(m, b) = (m + b − 1)<sup>2</sup> + (2m + b − 2)<sup>2</sup> + (3m + b − 2)<sup>2</sup>. Setting E<sub>m</sub> = 0 and E<sub>b</sub> = 0 gives the <strong>normal equations</strong> 14m + 6b = 11, 6m + 3b = 5, so <b>m = 1/2, b = 2/3</b>. E is a bowl (D &gt; 0, E<sub>mm</sub> &gt; 0), so this is the minimum. Linear regression in every statistics and ML library solves exactly this problem.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Losing critical points when solving the system (e.g. dividing by x and missing x = 0).</li><li>Concluding “maximum” or “minimum” when D &lt; 0 — that is a saddle.</li><li>Forgetting that D = 0 says nothing (e.g. x<sup>4</sup> + y<sup>4</sup> and x<sup>4</sup> − y<sup>4</sup> both have D = 0 at the origin).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Critical points: f<sub>x</sub> = f<sub>y</sub> = 0.</li><li>D = f<sub>xx</sub>f<sub>yy</sub> − f<sub>xy</sub><sup>2</sup> decides min / max / saddle.</li><li>D = 0: use another argument.</li><li>Least squares = minimising a quadratic bowl.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS3 + '4-7-maxima-minima-problems', 'OpenStax Vol. 3 — 4.7 Maxima/Minima Problems') + `</li><li>` + A(PN3 + 'RelativeExtrema.aspx', "Paul's Online Notes — Relative Minimums and Maximums") + `</li><li>` + A('https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/2.-partial-derivatives/', 'MIT OCW 18.02SC — Unit 2 (includes least squares and max-min problems)') + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>Classify the critical points of f(x, y) = x<sup>2</sup> + xy + y<sup>2</sup> − 3x.</li><li>Classify the critical point of f(x, y) = x<sup>2</sup> − y<sup>2</sup>.</li><li>Find and classify the critical points of f(x, y) = x<sup>3</sup> − 12x + y<sup>2</sup>.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 2x + y − 3 = 0, x + 2y = 0 ⇒ (2, −1); D = 4 − 1 = 3 &gt; 0, f<sub>xx</sub> = 2 &gt; 0 ⇒ <b>local minimum f = −3</b>. 2) (0, 0): D = (2)(−2) − 0 = −4 ⇒ <b>saddle</b>. 3) 3x<sup>2</sup> − 12 = 0, 2y = 0 ⇒ (±2, 0); D = 6x · 2: at (2, 0) D = 24 &gt; 0, f<sub>xx</sub> &gt; 0 ⇒ <b>min f = −16</b>; at (−2, 0) D = −24 ⇒ <b>saddle</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 9 · Bài 9.1</span>
<h2>Cực trị địa phương và tiêu chuẩn đạo hàm cấp hai</h2>
<p class="lead">Ở đỉnh đồi hay đáy thung lũng, mặt phẳng tiếp xúc nằm ngang: cả hai đạo hàm riêng bằng 0. Nhưng mặt phẳng tiếp xúc nằm ngang cũng có thể ở một <strong>điểm yên ngựa</strong> — lên theo hướng này, xuống theo hướng kia. Tiêu chuẩn đạo hàm cấp hai phân biệt chúng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tìm điểm tới hạn bằng cách giải ∇f = 0.</li><li>Phân loại bằng biệt thức D = f<sub>xx</sub>f<sub>yy</sub> − f<sub>xy</sub><sup>2</sup>.</li><li>Nhận ra khớp dữ liệu bình phương tối thiểu là bài toán cực tiểu hai biến.</li></ul>
<h3>📖 Bài giảng</h3>
<p>f có <strong>cực đại địa phương</strong> tại (a, b) nếu f(x, y) ≤ f(a, b) gần (a, b) (cực tiểu: ≥). Nếu f có cực trị địa phương tại (a, b) và các đạo hàm riêng tồn tại ở đó thì f<sub>x</sub>(a, b) = f<sub>y</sub>(a, b) = 0. Các điểm có ∇f = 0 (hoặc không tồn tại) là <strong>điểm tới hạn</strong>.</p>
<div class="formula"><span class="lbl">Tiêu chuẩn đạo hàm cấp hai</span>Tại điểm tới hạn, đặt D = f<sub>xx</sub>f<sub>yy</sub> − (f<sub>xy</sub>)<sup>2</sup> (định thức ma trận Hessian).<br>D &gt; 0 và f<sub>xx</sub> &gt; 0 ⇒ cực tiểu địa phương     D &gt; 0 và f<sub>xx</sub> &lt; 0 ⇒ cực đại địa phương<br>D &lt; 0 ⇒ điểm yên ngựa     D = 0 ⇒ không kết luận</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> f(x, y) = x<sup>4</sup> + y<sup>4</sup> − 4xy + 1.</p>
<p>Bước 1: f<sub>x</sub> = 4x<sup>3</sup> − 4y = 0 ⇒ y = x<sup>3</sup>; f<sub>y</sub> = 4y<sup>3</sup> − 4x = 0 ⇒ x = y<sup>3</sup> = x<sup>9</sup> ⇒ x(x<sup>8</sup> − 1) = 0 ⇒ x = 0, ±1. Điểm tới hạn (0, 0), (1, 1), (−1, −1).</p>
<p>Bước 2: f<sub>xx</sub> = 12x<sup>2</sup>, f<sub>yy</sub> = 12y<sup>2</sup>, f<sub>xy</sub> = −4 ⇒ D = 144x<sup>2</sup>y<sup>2</sup> − 16.</p>
<p>Bước 3: (0, 0): D = −16 &lt; 0 ⇒ <b>yên ngựa</b>. (±1, ±1): D = 128 &gt; 0, f<sub>xx</sub> = 12 &gt; 0 ⇒ <b>cực tiểu địa phương</b> với giá trị f = −1.</p></div>
<div class="callout"><p><b>Ví dụ 2.</b> f(x, y) = x<sup>3</sup> + y<sup>3</sup> − 3xy. f<sub>x</sub> = 3x<sup>2</sup> − 3y, f<sub>y</sub> = 3y<sup>2</sup> − 3x ⇒ điểm tới hạn (0, 0) và (1, 1). D = 36xy − 9: tại (0, 0) D = −9 ⇒ yên ngựa; tại (1, 1) D = 27 &gt; 0, f<sub>xx</sub> = 6 &gt; 0 ⇒ <b>cực tiểu địa phương f(1, 1) = −1</b>.</p></div>
<h3>📖 Ứng dụng: bình phương tối thiểu</h3>
<p>Khớp đường thẳng y = mx + b với dữ liệu (1, 1), (2, 2), (3, 2). Cực tiểu hoá tổng bình phương sai số E(m, b) = (m + b − 1)<sup>2</sup> + (2m + b − 2)<sup>2</sup> + (3m + b − 2)<sup>2</sup>. Cho E<sub>m</sub> = 0 và E<sub>b</sub> = 0 được <strong>hệ phương trình chuẩn</strong> 14m + 6b = 11, 6m + 3b = 5, nên <b>m = 1/2, b = 2/3</b>. E là một cái bát (D &gt; 0, E<sub>mm</sub> &gt; 0) nên đây là cực tiểu. Hồi quy tuyến tính trong mọi thư viện thống kê và học máy giải đúng bài toán này.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Mất điểm tới hạn khi giải hệ (vd chia cho x mà bỏ sót x = 0).</li><li>Kết luận “cực đại” hay “cực tiểu” khi D &lt; 0 — đó là yên ngựa.</li><li>Quên rằng D = 0 không nói gì (vd x<sup>4</sup> + y<sup>4</sup> và x<sup>4</sup> − y<sup>4</sup> đều có D = 0 tại gốc).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Điểm tới hạn: f<sub>x</sub> = f<sub>y</sub> = 0.</li><li>D = f<sub>xx</sub>f<sub>yy</sub> − f<sub>xy</sub><sup>2</sup> quyết định cực tiểu / cực đại / yên ngựa.</li><li>D = 0: cần lập luận khác.</li><li>Bình phương tối thiểu = cực tiểu hoá một cái bát bậc hai.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS3 + '4-7-maxima-minima-problems', 'OpenStax Vol. 3 — 4.7 Bài toán cực đại/cực tiểu') + `</li><li>` + A(PN3 + 'RelativeExtrema.aspx', "Paul's Online Notes — Cực trị địa phương") + `</li><li>` + A('https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/2.-partial-derivatives/', 'MIT OCW 18.02SC — Unit 2 (có bình phương tối thiểu và bài toán cực trị)') + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Phân loại điểm tới hạn của f(x, y) = x<sup>2</sup> + xy + y<sup>2</sup> − 3x.</li><li>Phân loại điểm tới hạn của f(x, y) = x<sup>2</sup> − y<sup>2</sup>.</li><li>Tìm và phân loại điểm tới hạn của f(x, y) = x<sup>3</sup> − 12x + y<sup>2</sup>.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 2x + y − 3 = 0, x + 2y = 0 ⇒ (2, −1); D = 4 − 1 = 3 &gt; 0, f<sub>xx</sub> = 2 &gt; 0 ⇒ <b>cực tiểu địa phương f = −3</b>. 2) (0, 0): D = (2)(−2) − 0 = −4 ⇒ <b>yên ngựa</b>. 3) 3x<sup>2</sup> − 12 = 0, 2y = 0 ⇒ (±2, 0); D = 6x · 2: tại (2, 0) D = 24 &gt; 0, f<sub>xx</sub> &gt; 0 ⇒ <b>cực tiểu f = −16</b>; tại (−2, 0) D = −24 ⇒ <b>yên ngựa</b>.</p></div>`);

const c92 = L('cal121-ts-9-2',
  '9.2 — Absolute extrema on closed and bounded regions|||9.2 — Giá trị lớn nhất, nhỏ nhất trên miền đóng và bị chặn',
  'Định lý giá trị cực biên cho hàm hai biến; quy trình 3 bước: điểm tới hạn bên trong, xét biên (tham số hoá từng cạnh), so sánh; ví dụ x² − 2xy + 2y trên hình chữ nhật, x² + y² − 2x trên hình tròn.',
  `<span class="eyebrow">CAL121 · Chapter 9 · Lesson 9.2</span>
<h2>Absolute extrema on closed and bounded regions</h2>
<p class="lead">A factory can only produce between 0 and 3 thousand units of A and 0 and 2 thousand units of B. Where is profit largest? When the variables are limited to a region, the best point may lie on the <strong>boundary</strong>, where ∇f need not be zero.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the Extreme Value Theorem for two variables.</li><li>Apply the closed-region method: interior critical points + boundary analysis.</li><li>Parametrise boundary pieces (segments, circles).</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Extreme Value Theorem</span>If f is continuous on a <strong>closed</strong> (contains its boundary) and <strong>bounded</strong> set D in ℝ<sup>2</sup>, then f attains an absolute maximum and an absolute minimum on D.</div>
<div class="formula"><span class="lbl">Closed-region method</span>1. Find f at the critical points of f inside D.<br>2. Find the extreme values of f on the boundary of D (each piece becomes a one-variable problem).<br>3. The largest of all these values is the absolute maximum; the smallest is the absolute minimum.</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> f(x, y) = x<sup>2</sup> − 2xy + 2y on the rectangle D = [0, 3] × [0, 2].</p>
<p><b>Interior:</b> f<sub>x</sub> = 2x − 2y = 0, f<sub>y</sub> = −2x + 2 = 0 ⇒ (1, 1), f(1, 1) = 1.</p>
<p><b>Boundary</b> (four edges): y = 0: f = x<sup>2</sup> on [0, 3], values 0 to 9. x = 3: f = 9 − 4y on [0, 2], values 1 to 9. y = 2: f = x<sup>2</sup> − 4x + 4 = (x − 2)<sup>2</sup> on [0, 3], values 0 to 4. x = 0: f = 2y on [0, 2], values 0 to 4.</p>
<p><b>Compare:</b> absolute maximum <b>9 at (3, 0)</b>; absolute minimum <b>0 at (0, 0) and (2, 2)</b>.</p></div>
<div class="callout"><p><b>Example 2 — a circular region.</b> f(x, y) = x<sup>2</sup> + y<sup>2</sup> − 2x on the disk x<sup>2</sup> + y<sup>2</sup> ≤ 4.</p>
<p>Interior: ∇f = ⟨2x − 2, 2y⟩ = 0 ⇒ (1, 0), f = −1. Boundary x<sup>2</sup> + y<sup>2</sup> = 4: f = 4 − 2x with −2 ≤ x ≤ 2, from 0 (at (2, 0)) to 8 (at (−2, 0)). Absolute max <b>8 at (−2, 0)</b>, absolute min <b>−1 at (1, 0)</b>. (Lesson 9.3 gives a second way to handle curved boundaries.)</p></div>
<div class="note-ct"><p><b>Why the theorem needs both conditions.</b> On the open disk x<sup>2</sup> + y<sup>2</sup> &lt; 1, f = x has no maximum (it approaches 1 but never reaches it). On the unbounded plane, f = x + y has neither maximum nor minimum.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the corners — they are endpoints of the edge problems.</li><li>Using the second derivative test here: it classifies local extrema only, it does not compare values.</li><li>Including critical points that lie <em>outside</em> D.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Continuous f on closed, bounded D ⇒ absolute max and min exist.</li><li>Candidates: interior critical points, boundary extrema, corners.</li><li>Each boundary piece is a Calculus I closed-interval problem.</li><li>Compare values; no D-test needed.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS3 + '4-7-maxima-minima-problems', 'OpenStax Vol. 3 — 4.7 (absolute extrema on a closed region)') + `</li><li>` + A(PN3 + 'AbsoluteExtrema.aspx', "Paul's Online Notes — Absolute Minimums and Maximums") + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>Absolute extrema of f(x, y) = x + y − xy on the triangle with vertices (0, 0), (2, 0), (0, 2).</li><li>Absolute extrema of f(x, y) = xy on the square [−1, 1] × [−1, 1].</li><li>Why might f(x, y) = 1/(x<sup>2</sup> + y<sup>2</sup>) have no maximum on the disk x<sup>2</sup> + y<sup>2</sup> ≤ 1?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) The only critical point (1, 1) lies on the edge x + y = 2 (f = 1), so the interior gives nothing new. Edges: y = 0 ⇒ f = x ∈ [0, 2]; x = 0 ⇒ f = y ∈ [0, 2]; x + y = 2 ⇒ f = 2 − x(2 − x) = (x − 1)<sup>2</sup> + 1 ∈ [1, 2]. <b>Max 2 at (2, 0), (0, 2); min 0 at (0, 0)</b>. 2) Interior (0, 0), f = 0; on the edges f ranges over [−1, 1] ⇒ <b>max 1 at (1, 1), (−1, −1); min −1 at (1, −1), (−1, 1)</b>. 3) f is <b>not continuous</b> at the origin (it blows up), so the theorem does not apply.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 9 · Bài 9.2</span>
<h2>Giá trị lớn nhất, nhỏ nhất trên miền đóng và bị chặn</h2>
<p class="lead">Một nhà máy chỉ sản xuất được từ 0 đến 3 nghìn sản phẩm A và từ 0 đến 2 nghìn sản phẩm B. Lợi nhuận lớn nhất ở đâu? Khi biến bị giới hạn trong một miền, điểm tốt nhất có thể nằm trên <strong>biên</strong>, nơi ∇f không nhất thiết bằng 0.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu định lý giá trị cực biên cho hàm hai biến.</li><li>Áp dụng phương pháp miền đóng: điểm tới hạn bên trong + xét biên.</li><li>Tham số hoá các mảnh biên (đoạn thẳng, đường tròn).</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Định lý giá trị cực biên</span>Nếu f liên tục trên tập D <strong>đóng</strong> (chứa biên của nó) và <strong>bị chặn</strong> trong ℝ<sup>2</sup> thì f đạt giá trị lớn nhất và nhỏ nhất trên D.</div>
<div class="formula"><span class="lbl">Phương pháp miền đóng</span>1. Tính f tại các điểm tới hạn của f bên trong D.<br>2. Tìm cực trị của f trên biên D (mỗi mảnh thành bài toán một biến).<br>3. Số lớn nhất trong tất cả là GTLN; số nhỏ nhất là GTNN.</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> f(x, y) = x<sup>2</sup> − 2xy + 2y trên hình chữ nhật D = [0, 3] × [0, 2].</p>
<p><b>Bên trong:</b> f<sub>x</sub> = 2x − 2y = 0, f<sub>y</sub> = −2x + 2 = 0 ⇒ (1, 1), f(1, 1) = 1.</p>
<p><b>Biên</b> (bốn cạnh): y = 0: f = x<sup>2</sup> trên [0, 3], giá trị 0 tới 9. x = 3: f = 9 − 4y trên [0, 2], giá trị 1 tới 9. y = 2: f = x<sup>2</sup> − 4x + 4 = (x − 2)<sup>2</sup> trên [0, 3], giá trị 0 tới 4. x = 0: f = 2y trên [0, 2], giá trị 0 tới 4.</p>
<p><b>So sánh:</b> GTLN <b>9 tại (3, 0)</b>; GTNN <b>0 tại (0, 0) và (2, 2)</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — miền tròn.</b> f(x, y) = x<sup>2</sup> + y<sup>2</sup> − 2x trên hình tròn x<sup>2</sup> + y<sup>2</sup> ≤ 4.</p>
<p>Bên trong: ∇f = ⟨2x − 2, 2y⟩ = 0 ⇒ (1, 0), f = −1. Biên x<sup>2</sup> + y<sup>2</sup> = 4: f = 4 − 2x với −2 ≤ x ≤ 2, từ 0 (tại (2, 0)) đến 8 (tại (−2, 0)). GTLN <b>8 tại (−2, 0)</b>, GTNN <b>−1 tại (1, 0)</b>. (Bài 9.3 cho cách thứ hai xử lý biên cong.)</p></div>
<div class="note-ct"><p><b>Vì sao định lý cần cả hai điều kiện.</b> Trên hình tròn mở x<sup>2</sup> + y<sup>2</sup> &lt; 1, f = x không có GTLN (tiến tới 1 nhưng không bao giờ đạt). Trên cả mặt phẳng không bị chặn, f = x + y không có GTLN lẫn GTNN.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên các góc — chúng là đầu mút của bài toán trên từng cạnh.</li><li>Dùng tiêu chuẩn đạo hàm cấp hai ở đây: nó chỉ phân loại cực trị địa phương, không so sánh giá trị.</li><li>Tính cả điểm tới hạn nằm <em>ngoài</em> D.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>f liên tục trên D đóng, bị chặn ⇒ có GTLN, GTNN.</li><li>Ứng viên: điểm tới hạn bên trong, cực trị trên biên, các góc.</li><li>Mỗi mảnh biên là bài toán khoảng đóng của Giải tích I.</li><li>So sánh giá trị; không cần tiêu chuẩn D.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS3 + '4-7-maxima-minima-problems', 'OpenStax Vol. 3 — 4.7 (cực trị tuyệt đối trên miền đóng)') + `</li><li>` + A(PN3 + 'AbsoluteExtrema.aspx', "Paul's Online Notes — GTLN, GTNN") + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>GTLN, GTNN của f(x, y) = x + y − xy trên tam giác đỉnh (0, 0), (2, 0), (0, 2).</li><li>GTLN, GTNN của f(x, y) = xy trên hình vuông [−1, 1] × [−1, 1].</li><li>Vì sao f(x, y) = 1/(x<sup>2</sup> + y<sup>2</sup>) có thể không có GTLN trên hình tròn x<sup>2</sup> + y<sup>2</sup> ≤ 1?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Điểm tới hạn duy nhất (1, 1) nằm trên cạnh x + y = 2 (f = 1), nên bên trong không có ứng viên mới. Các cạnh: y = 0 ⇒ f = x ∈ [0, 2]; x = 0 ⇒ f = y ∈ [0, 2]; x + y = 2 ⇒ f = 2 − x(2 − x) = (x − 1)<sup>2</sup> + 1 ∈ [1, 2]. <b>GTLN 2 tại (2, 0), (0, 2); GTNN 0 tại (0, 0)</b>. 2) Bên trong (0, 0), f = 0; trên các cạnh f chạy khắp [−1, 1] ⇒ <b>GTLN 1 tại (1, 1), (−1, −1); GTNN −1 tại (1, −1), (−1, 1)</b>. 3) f <b>không liên tục</b> tại gốc (tiến ra vô cực), nên định lý không áp dụng.</p></div>`);

const c93 = L('cal121-ts-9-3',
  '9.3 — Lagrange multipliers|||9.3 — Phương pháp nhân tử Lagrange',
  'Cực trị có ràng buộc g = k: ∇f = λ∇g (gradient song song), ý nghĩa hình học (đường mức tiếp xúc ràng buộc); ví dụ hộp không nắp diện tích 12 có V = 4, x² + 2y² trên đường tròn, điểm gần gốc nhất trên mặt phẳng, ý nghĩa của λ.',
  `<span class="eyebrow">CAL121 · Chapter 9 · Lesson 9.3</span>
<h2>Lagrange multipliers</h2>
<p class="lead">Maximise volume with a fixed amount of material; minimise cost with a fixed output; find the point on a surface closest to the origin. These are <strong>constrained</strong> optimisation problems: optimise f subject to g = k. Lagrange's idea turns them into a system of equations.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain geometrically why ∇f = λ∇g at a constrained extremum.</li><li>Solve the Lagrange system for two and three variables.</li><li>Interpret λ as the rate of change of the optimum with respect to the constraint.</li></ul>
<h3>📖 Lecture</h3>
<p>Walk along the constraint curve g(x, y) = k and watch the level curves of f. At a constrained maximum or minimum, the level curve of f just <strong>touches</strong> the constraint curve — they are tangent, so their normal vectors ∇f and ∇g are parallel.</p>
<div class="formula"><span class="lbl">Method of Lagrange multipliers</span>To find extrema of f(x, y, z) subject to g(x, y, z) = k (with ∇g ≠ 0):<br>solve ∇f = λ ∇g and g = k, i.e. f<sub>x</sub> = λg<sub>x</sub>, f<sub>y</sub> = λg<sub>y</sub>, f<sub>z</sub> = λg<sub>z</sub>, g = k;<br>evaluate f at every solution: the largest is the maximum, the smallest the minimum (on a closed bounded constraint set).</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — extrema on a circle.</b> f = x<sup>2</sup> + 2y<sup>2</sup> on x<sup>2</sup> + y<sup>2</sup> = 1.</p>
<p>2x = λ · 2x, 4y = λ · 2y. From the first, x = 0 or λ = 1; from the second, y = 0 or λ = 2. x = 0 ⇒ y = ±1, f = 2; y = 0 ⇒ x = ±1, f = 1. <b>Max 2 at (0, ±1), min 1 at (±1, 0)</b>. (This also finishes the boundary step of Lesson 9.2 without parametrising.)</p></div>
<div class="callout"><p><b>Example 2 — box without a lid.</b> A rectangular box with no top is made from 12 m<sup>2</sup> of cardboard. Maximise V = xyz subject to 2xz + 2yz + xy = 12.</p>
<p>yz = λ(2z + y), xz = λ(2z + x), xy = λ(2x + 2y). Multiply the equations by x, y, z respectively: xyz = λ(2xz + xy) = λ(2yz + xy) = λ(2xz + 2yz). The first two give xz = yz ⇒ x = y; the second and third give xy = 2xz ⇒ y = 2z. Substitute: 4z<sup>2</sup> + 4z<sup>2</sup> + 4z<sup>2</sup> = 12 ⇒ z = 1, x = y = 2. <b>V = 4 m<sup>3</sup></b>.</p></div>
<div class="callout"><p><b>Example 3 — closest point.</b> Point on the plane x + 2y + 2z = 9 closest to the origin: minimise x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup>. 2x = λ, 2y = 2λ, 2z = 2λ ⇒ (x, y, z) = (λ/2, λ, λ); substituting gives λ = 2 ⇒ <b>(1, 2, 2)</b>, distance 3 — matching the distance formula |0 − 9|/√9 = 3 from Lesson 7.4.</p></div>
<p><b>Meaning of λ.</b> λ is the rate at which the optimal value changes when the constraint level k changes: dM/dk = λ. In economics it is the “shadow price” of a resource; in machine learning the same idea gives the dual problem of support vector machines.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Dividing by a variable that might be 0 and losing solutions (Example 1).</li><li>Forgetting to use the constraint equation g = k itself.</li><li>Applying the method when the constraint set is unbounded and assuming the solution is a maximum without checking.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>At a constrained extremum ∇f ∥ ∇g: ∇f = λ∇g.</li><li>Solve together with g = k; compare f at all solutions.</li><li>Geometric picture: level curve of f tangent to the constraint.</li><li>λ = sensitivity of the optimum to the constraint.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS3 + '4-8-lagrange-multipliers', 'OpenStax Vol. 3 — 4.8 Lagrange Multipliers') + `</li><li>` + A(PN3 + 'LagrangeMultipliers.aspx', "Paul's Online Notes — Lagrange Multipliers") + `</li><li>` + A('https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/2.-partial-derivatives/', 'MIT OCW 18.02SC — Unit 2, Part C: Lagrange multipliers and constrained differentials') + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>Maximise f = x + y on x<sup>2</sup> + y<sup>2</sup> = 8.</li><li>Maximise f = x<sup>2</sup>y subject to x + y = 3 with x, y ≥ 0.</li><li>Find the extreme values of f = xy on the ellipse x<sup>2</sup> + 4y<sup>2</sup> = 8.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 1 = 2λx, 1 = 2λy ⇒ x = y = ±2 ⇒ <b>max 4 at (2, 2)</b> (min −4 at (−2, −2)). 2) 2xy = λ, x<sup>2</sup> = λ ⇒ x = 2y (x ≠ 0) ⇒ (2, 1): <b>max 4</b> (the endpoints give 0). 3) y = 2λx, x = 8λy ⇒ x<sup>2</sup> = 4y<sup>2</sup> ⇒ 8y<sup>2</sup> = 8 ⇒ y = ±1, x = ±2: <b>max 2 at (2, 1), (−2, −1); min −2 at (2, −1), (−2, 1)</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 9 · Bài 9.3</span>
<h2>Phương pháp nhân tử Lagrange</h2>
<p class="lead">Cực đại thể tích với lượng vật liệu cố định; cực tiểu chi phí với sản lượng cố định; tìm điểm trên mặt gần gốc nhất. Đó là bài toán tối ưu <strong>có ràng buộc</strong>: tối ưu f với điều kiện g = k. Ý tưởng của Lagrange biến chúng thành một hệ phương trình.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích bằng hình học vì sao ∇f = λ∇g tại cực trị có ràng buộc.</li><li>Giải hệ Lagrange cho hai và ba biến.</li><li>Hiểu λ là tốc độ thay đổi của giá trị tối ưu theo ràng buộc.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Đi dọc đường ràng buộc g(x, y) = k và quan sát các đường mức của f. Tại cực đại hay cực tiểu có ràng buộc, đường mức của f vừa <strong>chạm</strong> đường ràng buộc — chúng tiếp xúc, nên hai vectơ pháp tuyến ∇f và ∇g song song.</p>
<div class="formula"><span class="lbl">Phương pháp nhân tử Lagrange</span>Để tìm cực trị của f(x, y, z) với điều kiện g(x, y, z) = k (khi ∇g ≠ 0):<br>giải ∇f = λ ∇g và g = k, tức f<sub>x</sub> = λg<sub>x</sub>, f<sub>y</sub> = λg<sub>y</sub>, f<sub>z</sub> = λg<sub>z</sub>, g = k;<br>tính f tại mọi nghiệm: lớn nhất là cực đại, nhỏ nhất là cực tiểu (trên tập ràng buộc đóng, bị chặn).</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — cực trị trên đường tròn.</b> f = x<sup>2</sup> + 2y<sup>2</sup> trên x<sup>2</sup> + y<sup>2</sup> = 1.</p>
<p>2x = λ · 2x, 4y = λ · 2y. Từ phương trình đầu, x = 0 hoặc λ = 1; từ phương trình sau, y = 0 hoặc λ = 2. x = 0 ⇒ y = ±1, f = 2; y = 0 ⇒ x = ±1, f = 1. <b>Max 2 tại (0, ±1), min 1 tại (±1, 0)</b>. (Cách này cũng xử lý xong bước biên của Bài 9.2 mà không cần tham số hoá.)</p></div>
<div class="callout"><p><b>Ví dụ 2 — hộp không nắp.</b> Một hộp chữ nhật không nắp làm từ 12 m<sup>2</sup> bìa. Cực đại V = xyz với 2xz + 2yz + xy = 12.</p>
<p>yz = λ(2z + y), xz = λ(2z + x), xy = λ(2x + 2y). Nhân lần lượt với x, y, z: xyz = λ(2xz + xy) = λ(2yz + xy) = λ(2xz + 2yz). Hai vế đầu cho xz = yz ⇒ x = y; vế hai và ba cho xy = 2xz ⇒ y = 2z. Thế vào: 4z<sup>2</sup> + 4z<sup>2</sup> + 4z<sup>2</sup> = 12 ⇒ z = 1, x = y = 2. <b>V = 4 m<sup>3</sup></b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — điểm gần nhất.</b> Điểm trên mặt phẳng x + 2y + 2z = 9 gần gốc nhất: cực tiểu x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup>. 2x = λ, 2y = 2λ, 2z = 2λ ⇒ (x, y, z) = (λ/2, λ, λ); thế vào được λ = 2 ⇒ <b>(1, 2, 2)</b>, khoảng cách 3 — khớp công thức khoảng cách |0 − 9|/√9 = 3 ở Bài 7.4.</p></div>
<p><b>Ý nghĩa của λ.</b> λ là tốc độ thay đổi của giá trị tối ưu khi mức ràng buộc k thay đổi: dM/dk = λ. Trong kinh tế nó là “giá bóng” của một nguồn lực; trong học máy cùng ý tưởng đó cho bài toán đối ngẫu của máy vectơ hỗ trợ (SVM).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chia cho một biến có thể bằng 0 rồi mất nghiệm (Ví dụ 1).</li><li>Quên dùng chính phương trình ràng buộc g = k.</li><li>Áp dụng khi tập ràng buộc không bị chặn rồi mặc định nghiệm là cực đại mà không kiểm.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tại cực trị có ràng buộc ∇f ∥ ∇g: ∇f = λ∇g.</li><li>Giải cùng g = k; so sánh f tại mọi nghiệm.</li><li>Hình học: đường mức của f tiếp xúc đường ràng buộc.</li><li>λ = độ nhạy của giá trị tối ưu theo ràng buộc.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS3 + '4-8-lagrange-multipliers', 'OpenStax Vol. 3 — 4.8 Nhân tử Lagrange') + `</li><li>` + A(PN3 + 'LagrangeMultipliers.aspx', "Paul's Online Notes — Lagrange Multipliers") + `</li><li>` + A('https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/2.-partial-derivatives/', 'MIT OCW 18.02SC — Unit 2, Part C: Nhân tử Lagrange') + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Cực đại f = x + y trên x<sup>2</sup> + y<sup>2</sup> = 8.</li><li>Cực đại f = x<sup>2</sup>y với x + y = 3, x, y ≥ 0.</li><li>Tìm cực trị của f = xy trên elip x<sup>2</sup> + 4y<sup>2</sup> = 8.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 1 = 2λx, 1 = 2λy ⇒ x = y = ±2 ⇒ <b>max 4 tại (2, 2)</b> (min −4 tại (−2, −2)). 2) 2xy = λ, x<sup>2</sup> = λ ⇒ x = 2y (x ≠ 0) ⇒ (2, 1): <b>max 4</b> (hai đầu mút cho 0). 3) y = 2λx, x = 8λy ⇒ x<sup>2</sup> = 4y<sup>2</sup> ⇒ 8y<sup>2</sup> = 8 ⇒ y = ±1, x = ±2: <b>max 2 tại (2, 1), (−2, −1); min −2 tại (2, −1), (−2, 1)</b>.</p></div>`);

const q9 = QZ(9, 'Quiz — Chapter 9: Optimisation|||Quiz — Chương 9: Tối ưu hàm nhiều biến', 'Kiểm tra chương 9: điểm tới hạn, tiêu chuẩn D, yên ngựa, bình phương tối thiểu, GTLN/GTNN trên miền đóng, nhân tử Lagrange.', [
  Q('q1', 'A critical point of f(x, y) is where|||Điểm tới hạn của f(x, y) là nơi',
    ['f = 0|||f = 0', 'f_x = f_y = 0 (or a partial does not exist)|||f_x = f_y = 0 (hoặc đạo hàm riêng không tồn tại)', 'f_xx = 0|||f_xx = 0', 'D = 0|||D = 0'], 1,
    '∇f = 0: horizontal tangent plane.|||∇f = 0: mặt phẳng tiếp xúc nằm ngang.'),
  Q('q2', 'At a critical point D = f_xx f_yy − f_xy² < 0 means|||Tại điểm tới hạn D = f_xx f_yy − f_xy² < 0 nghĩa là',
    ['local maximum|||cực đại địa phương', 'local minimum|||cực tiểu địa phương', 'saddle point|||điểm yên ngựa', 'no conclusion|||không kết luận'], 2,
    'Negative discriminant: up in one direction, down in another.|||Biệt thức âm: lên theo hướng này, xuống theo hướng kia.'),
  Q('q3', 'For f = x⁴ + y⁴ − 4xy + 1, the point (0, 0) is|||Với f = x⁴ + y⁴ − 4xy + 1, điểm (0, 0) là',
    ['a local minimum|||cực tiểu địa phương', 'a local maximum|||cực đại địa phương', 'a saddle point|||điểm yên ngựa', 'not critical|||không phải điểm tới hạn'], 2,
    'D = 144x²y² − 16 = −16 < 0.|||D = 144x²y² − 16 = −16 < 0.'),
  Q('q4', 'For the same f, the minimum value at (1, 1) is|||Cũng f đó, giá trị cực tiểu tại (1, 1) là',
    ['−1|||−1', '0|||0', '1|||1', '−3|||−3'], 0,
    '1 + 1 − 4 + 1 = −1.|||1 + 1 − 4 + 1 = −1.'),
  Q('q5', 'f = x³ + y³ − 3xy has a local minimum at|||f = x³ + y³ − 3xy có cực tiểu địa phương tại',
    ['(0, 0)|||(0, 0)', '(1, 1)|||(1, 1)', '(−1, −1)|||(−1, −1)', '(1, 0)|||(1, 0)'], 1,
    'D(1,1) = 27 > 0 and f_xx = 6 > 0; (0, 0) is a saddle.|||D(1,1) = 27 > 0 và f_xx = 6 > 0; (0, 0) là yên ngựa.'),
  Q('q6', 'The least-squares line through (1,1), (2,2), (3,2) is|||Đường bình phương tối thiểu qua (1,1), (2,2), (3,2) là',
    ['y = x|||y = x', 'y = x/2 + 2/3|||y = x/2 + 2/3', 'y = x/2 + 1|||y = x/2 + 1', 'y = 2x/3 + 1/2|||y = 2x/3 + 1/2'], 1,
    'Normal equations 14m + 6b = 11, 6m + 3b = 5.|||Hệ chuẩn 14m + 6b = 11, 6m + 3b = 5.'),
  Q('q7', 'The absolute maximum of x² − 2xy + 2y on [0, 3] × [0, 2] is|||GTLN của x² − 2xy + 2y trên [0, 3] × [0, 2] là',
    ['1|||1', '4|||4', '9|||9', '13|||13'], 2,
    'Attained at the corner (3, 0) on the edge y = 0.|||Đạt tại góc (3, 0) trên cạnh y = 0.'),
  Q('q8', 'The Extreme Value Theorem in two variables requires the region to be|||Định lý giá trị cực biên hai biến cần miền',
    ['open|||mở', 'closed and bounded|||đóng và bị chặn', 'a rectangle|||là hình chữ nhật', 'convex|||lồi'], 1,
    'Plus f continuous on it.|||Kèm f liên tục trên đó.'),
  Q('q9', 'The Lagrange condition for extrema of f subject to g = k is|||Điều kiện Lagrange cho cực trị của f với ràng buộc g = k là',
    ['∇f = 0|||∇f = 0', '∇f = λ∇g|||∇f = λ∇g', '∇f · ∇g = 0|||∇f · ∇g = 0', 'f = λg|||f = λg'], 1,
    'Level curve of f tangent to the constraint ⇒ parallel gradients.|||Đường mức của f tiếp xúc ràng buộc ⇒ gradient song song.'),
  Q('q10', 'The maximum of x² + 2y² on x² + y² = 1 is|||Giá trị lớn nhất của x² + 2y² trên x² + y² = 1 là',
    ['1|||1', '2|||2', '3|||3', '√2|||√2'], 1,
    'At (0, ±1); the minimum 1 is at (±1, 0).|||Tại (0, ±1); giá trị nhỏ nhất 1 tại (±1, 0).'),
]);

const ch9 = {
  title: 'Chapter 9 — Optimisation of functions of several variables|||Chương 9 — Tối ưu hàm nhiều biến',
  description: 'Cực trị địa phương và tiêu chuẩn D (Hessian), bình phương tối thiểu, GTLN/GTNN trên miền đóng bị chặn, nhân tử Lagrange và ý nghĩa của λ (Stewart 14.7–14.8 · OpenStax Vol.3 4.7–4.8).',
  lessons: [c91, c92, c93, q9],
};

// ───────────────────────────── Chương 10 — Tích phân kép ─────────────────────────────
const MID2_PY = `<pre><code class="language-python">def midpoint_double(f, a, b, c, d, m, n):
    dx, dy = (b - a) / m, (d - c) / n
    total = 0.0
    for i in range(m):
        for j in range(n):
            xm = a + (i + 0.5) * dx
            ym = c + (j + 0.5) * dy
            total += f(xm, ym) * dx * dy
    return total

f = lambda x, y: 16 - x**2 - 2 * y**2
for m in (2, 4, 8, 16):
    print(f"m = n = {m:2}:  {midpoint_double(f, 0, 2, 0, 2, m, m):.6f}")
print("exact      :  48")</code></pre>
<div class="out">m = n =  2:  49.000000
m = n =  4:  48.250000
m = n =  8:  48.062500
m = n = 16:  48.015625
exact      :  48</div>`;

const c101 = L('cal121-ts-10-1',
  '10.1 — Double integrals over rectangles and iterated integrals (Fubini)|||10.1 — Tích phân kép trên hình chữ nhật và tích phân lặp (Fubini)',
  'Tổng Riemann kép, thể tích dưới mặt, định lý Fubini (đổi thứ tự lặp), giá trị trung bình; ví dụ ∬(x − 3y²) = −12, thể tích dưới 16 − x² − 2y² = 48; code Python quy tắc điểm giữa hội tụ về 48.',
  `<span class="eyebrow">CAL121 · Chapter 10 · Lesson 10.1</span>
<h2>Double integrals over rectangles</h2>
<p class="lead">In CAL111 the integral of f(x) added up thin rectangles to get an area. Now f(x, y) is a surface over a region in the plane, and the <strong>double integral</strong> adds up thin columns to get a <strong>volume</strong>. Fubini's theorem lets us compute it as two ordinary integrals.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define ∬<sub>R</sub> f dA as a limit of double Riemann sums.</li><li>Evaluate iterated integrals in either order (Fubini).</li><li>Approximate double integrals numerically and compute average values.</li></ul>
<h3>📖 Lecture</h3>
<p>Split the rectangle R = [a, b] × [c, d] into small sub-rectangles of area ΔA, pick a sample point in each, and form ∑ f(x<sub>ij</sub>, y<sub>ij</sub>) ΔA. As the grid becomes finer the sum tends to ∬<sub>R</sub> f(x, y) dA. If f ≥ 0 this is the volume of the solid under z = f(x, y) and above R.</p>
<div class="formula"><span class="lbl">Fubini's theorem</span>If f is continuous on R = [a, b] × [c, d]:  ∬<sub>R</sub> f dA = ∫<sub>a</sub><sup>b</sup> ∫<sub>c</sub><sup>d</sup> f(x, y) dy dx = ∫<sub>c</sub><sup>d</sup> ∫<sub>a</sub><sup>b</sup> f(x, y) dx dy</div>
<p>Work from the inside out: in ∫∫ f dy dx integrate in y first, treating x as a constant (a “partial integration”), then integrate the result in x.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> ∬<sub>R</sub> (x − 3y<sup>2</sup>) dA, R = [0, 2] × [1, 2].</p>
<p>x first: ∫<sub>1</sub><sup>2</sup> [x<sup>2</sup>/2 − 3xy<sup>2</sup>]<sub>x=0</sub><sup>x=2</sup> dy = ∫<sub>1</sub><sup>2</sup> (2 − 6y<sup>2</sup>) dy = [2y − 2y<sup>3</sup>]<sub>1</sub><sup>2</sup> = (4 − 16) − (2 − 2) = <b>−12</b>. The other order gives the same: ∫<sub>0</sub><sup>2</sup> (x − 7) dx = 2 − 14 = −12.</p></div>
<div class="callout"><p><b>Example 2 — choose the easy order.</b> ∬ y sin(xy) dA over [1, 2] × [0, π]. Integrating in y first needs parts; integrating in x first is immediate: ∫ y sin(xy) dx = −cos(xy). So ∫<sub>0</sub><sup>π</sup> [−cos 2y + cos y] dy = <b>0</b>.</p></div>
<div class="callout"><p><b>Example 3 — volume.</b> Volume under z = 16 − x<sup>2</sup> − 2y<sup>2</sup> over [0, 2] × [0, 2]: ∫<sub>0</sub><sup>2</sup>∫<sub>0</sub><sup>2</sup> (16 − x<sup>2</sup> − 2y<sup>2</sup>) dx dy = ∫<sub>0</sub><sup>2</sup> (32 − 8/3 − 4y<sup>2</sup>) dy = 64 − 16/3 − 32/3 = <b>48</b>.</p></div>
<p><b>Product shortcut.</b> If f(x, y) = g(x)h(y) on a rectangle, ∬ f dA = (∫<sub>a</sub><sup>b</sup> g dx)(∫<sub>c</sub><sup>d</sup> h dy). E.g. ∬<sub>[0,1]<sup>2</sup></sub> e<sup>x+y</sup> dA = (e − 1)<sup>2</sup>.</p>
<h3>💻 Midpoint rule for Example 3</h3>
` + MID2_PY + `
<p>Each doubling of m cuts the error by 4 (error ∝ 1/m<sup>2</sup>), exactly like the one-variable midpoint rule of CAL111.</p>
<div class="formula"><span class="lbl">Average value</span>f<sub>avg</sub> = (1/Area(R)) ∬<sub>R</sub> f dA</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Putting the limits in the wrong order: the inner limits belong to the inner differential.</li><li>Treating the outer variable as a variable during the inner integration.</li><li>Expecting a negative double integral to be a volume — it is a signed volume.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>∬ f dA = limit of ∑ f ΔA; volume when f ≥ 0.</li><li>Fubini: iterate in either order on a rectangle.</li><li>Choose the order that makes the inner integral easy.</li><li>Separable integrands factor into two single integrals.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS3 + '5-1-double-integrals-over-rectangular-regions', 'OpenStax Vol. 3 — 5.1 Double Integrals over Rectangular Regions') + `</li><li>` + A(PN3 + 'DoubleIntegrals.aspx', "Paul's Online Notes — Double Integrals") + `</li><li>` + A(PN3 + 'IteratedIntegrals.aspx', "Paul's Online Notes — Iterated Integrals") + `</li><li>` + A('https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/3.-double-integrals-and-line-integrals-in-the-plane/', 'MIT OCW 18.02SC — Unit 3: Double Integrals and Line Integrals in the Plane') + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>∫<sub>0</sub><sup>3</sup>∫<sub>0</sub><sup>2</sup> x y<sup>2</sup> dx dy.</li><li>Average value of f = xy<sup>2</sup> on [0, 2] × [0, 3].</li><li>∫<sub>0</sub><sup>2</sup>∫<sub>0</sub><sup>1</sup> 6x<sup>2</sup>y dx dy.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (∫<sub>0</sub><sup>2</sup> x dx)(∫<sub>0</sub><sup>3</sup> y<sup>2</sup> dy) = 2 · 9 = <b>18</b>. 2) 18/6 = <b>3</b>. 3) (∫<sub>0</sub><sup>1</sup> 6x<sup>2</sup> dx)(∫<sub>0</sub><sup>2</sup> y dy) = 2 · 2 = <b>4</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 10 · Bài 10.1</span>
<h2>Tích phân kép trên hình chữ nhật</h2>
<p class="lead">Ở CAL111, tích phân của f(x) cộng các hình chữ nhật mỏng để ra diện tích. Giờ f(x, y) là một mặt trên một miền phẳng, và <strong>tích phân kép</strong> cộng các cột mỏng để ra <strong>thể tích</strong>. Định lý Fubini cho phép tính nó bằng hai tích phân thông thường.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa ∬<sub>R</sub> f dA là giới hạn của tổng Riemann kép.</li><li>Tính tích phân lặp theo cả hai thứ tự (Fubini).</li><li>Xấp xỉ tích phân kép bằng phương pháp số và tính giá trị trung bình.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Chia hình chữ nhật R = [a, b] × [c, d] thành các hình chữ nhật con diện tích ΔA, chọn một điểm mẫu trong mỗi ô, lập ∑ f(x<sub>ij</sub>, y<sub>ij</sub>) ΔA. Khi lưới mịn dần, tổng tiến về ∬<sub>R</sub> f(x, y) dA. Nếu f ≥ 0 thì đó là thể tích khối nằm dưới z = f(x, y) và trên R.</p>
<div class="formula"><span class="lbl">Định lý Fubini</span>Nếu f liên tục trên R = [a, b] × [c, d]:  ∬<sub>R</sub> f dA = ∫<sub>a</sub><sup>b</sup> ∫<sub>c</sub><sup>d</sup> f(x, y) dy dx = ∫<sub>c</sub><sup>d</sup> ∫<sub>a</sub><sup>b</sup> f(x, y) dx dy</div>
<p>Tính từ trong ra ngoài: với ∫∫ f dy dx, lấy tích phân theo y trước, coi x là hằng (“tích phân riêng”), rồi lấy tích phân kết quả theo x.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> ∬<sub>R</sub> (x − 3y<sup>2</sup>) dA, R = [0, 2] × [1, 2].</p>
<p>Theo x trước: ∫<sub>1</sub><sup>2</sup> [x<sup>2</sup>/2 − 3xy<sup>2</sup>]<sub>x=0</sub><sup>x=2</sup> dy = ∫<sub>1</sub><sup>2</sup> (2 − 6y<sup>2</sup>) dy = [2y − 2y<sup>3</sup>]<sub>1</sub><sup>2</sup> = (4 − 16) − (2 − 2) = <b>−12</b>. Thứ tự kia cho cùng kết quả: ∫<sub>0</sub><sup>2</sup> (x − 7) dx = 2 − 14 = −12.</p></div>
<div class="callout"><p><b>Ví dụ 2 — chọn thứ tự dễ.</b> ∬ y sin(xy) dA trên [1, 2] × [0, π]. Lấy theo y trước phải dùng từng phần; theo x trước thì ngay lập tức: ∫ y sin(xy) dx = −cos(xy). Nên ∫<sub>0</sub><sup>π</sup> [−cos 2y + cos y] dy = <b>0</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — thể tích.</b> Thể tích dưới z = 16 − x<sup>2</sup> − 2y<sup>2</sup> trên [0, 2] × [0, 2]: ∫<sub>0</sub><sup>2</sup>∫<sub>0</sub><sup>2</sup> (16 − x<sup>2</sup> − 2y<sup>2</sup>) dx dy = ∫<sub>0</sub><sup>2</sup> (32 − 8/3 − 4y<sup>2</sup>) dy = 64 − 16/3 − 32/3 = <b>48</b>.</p></div>
<p><b>Mẹo tích tách biến.</b> Nếu f(x, y) = g(x)h(y) trên hình chữ nhật thì ∬ f dA = (∫<sub>a</sub><sup>b</sup> g dx)(∫<sub>c</sub><sup>d</sup> h dy). Vd ∬<sub>[0,1]<sup>2</sup></sub> e<sup>x+y</sup> dA = (e − 1)<sup>2</sup>.</p>
<h3>💻 Quy tắc điểm giữa cho Ví dụ 3</h3>
` + MID2_PY + `
<p>Mỗi lần gấp đôi m, sai số giảm 4 lần (sai số ∝ 1/m<sup>2</sup>), giống hệt quy tắc điểm giữa một biến ở CAL111.</p>
<div class="formula"><span class="lbl">Giá trị trung bình</span>f<sub>tb</sub> = (1/Diện tích(R)) ∬<sub>R</sub> f dA</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đặt cận sai thứ tự: cận trong thuộc về vi phân trong.</li><li>Coi biến ngoài là biến khi đang tích phân lớp trong.</li><li>Mong tích phân kép âm là thể tích — nó là thể tích có dấu.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>∬ f dA = giới hạn của ∑ f ΔA; là thể tích khi f ≥ 0.</li><li>Fubini: trên hình chữ nhật lặp theo thứ tự nào cũng được.</li><li>Chọn thứ tự làm tích phân trong dễ nhất.</li><li>Hàm tách biến thì tách thành tích hai tích phân đơn.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS3 + '5-1-double-integrals-over-rectangular-regions', 'OpenStax Vol. 3 — 5.1 Tích phân kép trên miền chữ nhật') + `</li><li>` + A(PN3 + 'DoubleIntegrals.aspx', "Paul's Online Notes — Tích phân kép") + `</li><li>` + A(PN3 + 'IteratedIntegrals.aspx', "Paul's Online Notes — Tích phân lặp") + `</li><li>` + A('https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/3.-double-integrals-and-line-integrals-in-the-plane/', 'MIT OCW 18.02SC — Unit 3: Tích phân kép và tích phân đường trong mặt phẳng') + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>∫<sub>0</sub><sup>3</sup>∫<sub>0</sub><sup>2</sup> x y<sup>2</sup> dx dy.</li><li>Giá trị trung bình của f = xy<sup>2</sup> trên [0, 2] × [0, 3].</li><li>∫<sub>0</sub><sup>2</sup>∫<sub>0</sub><sup>1</sup> 6x<sup>2</sup>y dx dy.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (∫<sub>0</sub><sup>2</sup> x dx)(∫<sub>0</sub><sup>3</sup> y<sup>2</sup> dy) = 2 · 9 = <b>18</b>. 2) 18/6 = <b>3</b>. 3) (∫<sub>0</sub><sup>1</sup> 6x<sup>2</sup> dx)(∫<sub>0</sub><sup>2</sup> y dy) = 2 · 2 = <b>4</b>.</p></div>`);

const c102 = L('cal121-ts-10-2',
  '10.2 — Double integrals over general regions and reversing the order|||10.2 — Tích phân kép trên miền tổng quát và đổi thứ tự lấy tích phân',
  'Miền loại I (giữa hai đồ thị y = g₁(x), g₂(x)) và loại II, vẽ miền để đặt cận, ví dụ ∬(x + 2y) = 32/15, đổi thứ tự ∫₀¹∫ₓ¹ sin(y²) dy dx = (1 − cos 1)/2, thể tích tứ diện.',
  `<span class="eyebrow">CAL121 · Chapter 10 · Lesson 10.2</span>
<h2>Double integrals over general regions</h2>
<p class="lead">Real regions are rarely rectangles: a triangle, the area between two parabolas, a quarter disk. The method is the same — iterate — but now the <strong>inner limits are functions</strong>, read off a sketch of the region. Drawing the region is the whole game.</p>
<h3>🎯 Objectives</h3>
<ul><li>Describe a region as type I (vertical strips) or type II (horizontal strips).</li><li>Set up and evaluate the iterated integral.</li><li>Reverse the order of integration to make an impossible integral easy.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Type I and type II regions</span>Type I: D = {a ≤ x ≤ b, g<sub>1</sub>(x) ≤ y ≤ g<sub>2</sub>(x)} ⇒ ∬<sub>D</sub> f dA = ∫<sub>a</sub><sup>b</sup> ∫<sub>g<sub>1</sub>(x)</sub><sup>g<sub>2</sub>(x)</sup> f dy dx<br>Type II: D = {c ≤ y ≤ d, h<sub>1</sub>(y) ≤ x ≤ h<sub>2</sub>(y)} ⇒ ∬<sub>D</sub> f dA = ∫<sub>c</sub><sup>d</sup> ∫<sub>h<sub>1</sub>(y)</sub><sup>h<sub>2</sub>(y)</sup> f dx dy</div>
<p><b>Recipe.</b> (1) Sketch D and find intersection points. (2) Draw a typical vertical strip: where does it enter (bottom curve) and leave (top curve)? Those are the inner limits. (3) The outer limits are the constant extremes of x. The outer limits must be <strong>numbers</strong>.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> ∬<sub>D</sub> (x + 2y) dA, D between y = 2x<sup>2</sup> and y = 1 + x<sup>2</sup>.</p>
<p>Intersections: 2x<sup>2</sup> = 1 + x<sup>2</sup> ⇒ x = ±1; on (−1, 1) the top curve is 1 + x<sup>2</sup>. ∫<sub>−1</sub><sup>1</sup> ∫<sub>2x<sup>2</sup></sub><sup>1+x<sup>2</sup></sup> (x + 2y) dy dx = ∫<sub>−1</sub><sup>1</sup> [xy + y<sup>2</sup>]<sub>2x<sup>2</sup></sub><sup>1+x<sup>2</sup></sup> dx = ∫<sub>−1</sub><sup>1</sup> (−3x<sup>4</sup> − x<sup>3</sup> + 2x<sup>2</sup> + x + 1) dx = <b>32/15</b>.</p></div>
<div class="callout"><p><b>Example 2 — reversing the order.</b> ∫<sub>0</sub><sup>1</sup> ∫<sub>x</sub><sup>1</sup> sin(y<sup>2</sup>) dy dx. sin(y<sup>2</sup>) has no elementary antiderivative, so the inner integral is stuck.</p>
<p>Sketch: 0 ≤ x ≤ 1, x ≤ y ≤ 1 is the triangle with vertices (0, 0), (0, 1), (1, 1). As type II: 0 ≤ y ≤ 1, 0 ≤ x ≤ y. So the integral = ∫<sub>0</sub><sup>1</sup> ∫<sub>0</sub><sup>y</sup> sin(y<sup>2</sup>) dx dy = ∫<sub>0</sub><sup>1</sup> y sin(y<sup>2</sup>) dy = [−cos(y<sup>2</sup>)/2]<sub>0</sub><sup>1</sup> = <b>(1 − cos 1)/2 ≈ 0.2298</b>.</p></div>
<div class="callout"><p><b>Example 3 — volume of a tetrahedron</b> bounded by x + 2y + z = 2, x = 2y, x = 0, z = 0. The base in the xy-plane: 0 ≤ x ≤ 1, x/2 ≤ y ≤ 1 − x/2. V = ∫<sub>0</sub><sup>1</sup> ∫<sub>x/2</sub><sup>1−x/2</sup> (2 − x − 2y) dy dx = <b>1/3</b>.</p></div>
<p><b>Area as a double integral.</b> Area(D) = ∬<sub>D</sub> 1 dA — the CAL111 “area between curves” formula is the special case f = 1.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Variables in the outer limits (they must be constants).</li><li>Reversing the order by simply swapping the limits — you must redraw the region.</li><li>Choosing type I when the region needs several pieces as type I but only one as type II (or vice versa).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Sketch first; inner limits from the strip, outer limits constant.</li><li>Type I: dy dx with y between curves; type II: dx dy.</li><li>Reversing the order can rescue integrals like sin(y<sup>2</sup>), e<sup>x<sup>2</sup></sup>.</li><li>∬ 1 dA = area.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS3 + '5-2-double-integrals-over-general-regions', 'OpenStax Vol. 3 — 5.2 Double Integrals over General Regions') + `</li><li>` + A(PN3 + 'DIGeneralRegion.aspx', "Paul's Online Notes — Double Integrals over General Regions") + `</li><li>` + A('https://www.geogebra.org/3d', 'GeoGebra 3D — draw the region and the surface before integrating') + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>∬<sub>D</sub> xy dA, D between y = x<sup>2</sup> and y = x.</li><li>Reverse the order and evaluate ∫<sub>0</sub><sup>1</sup> ∫<sub>y</sub><sup>1</sup> e<sup>x<sup>2</sup></sup> dx dy.</li><li>Write ∫<sub>0</sub><sup>2</sup>∫<sub>x<sup>2</sup></sub><sup>4</sup> f dy dx in the order dx dy.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) ∫<sub>0</sub><sup>1</sup> ∫<sub>x<sup>2</sup></sub><sup>x</sup> xy dy dx = <b>1/24</b>. 2) Region 0 ≤ y ≤ x ≤ 1 ⇒ ∫<sub>0</sub><sup>1</sup> ∫<sub>0</sub><sup>x</sup> e<sup>x<sup>2</sup></sup> dy dx = ∫<sub>0</sub><sup>1</sup> x e<sup>x<sup>2</sup></sup> dx = <b>(e − 1)/2</b>. 3) <b>∫<sub>0</sub><sup>4</sup> ∫<sub>0</sub><sup>√y</sup> f dx dy</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 10 · Bài 10.2</span>
<h2>Tích phân kép trên miền tổng quát</h2>
<p class="lead">Miền thực tế hiếm khi là hình chữ nhật: tam giác, phần giữa hai parabol, một phần tư hình tròn. Cách làm vẫn vậy — tích phân lặp — nhưng giờ <strong>cận trong là hàm số</strong>, đọc từ hình vẽ của miền. Vẽ đúng miền là toàn bộ bài toán.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mô tả miền dạng loại I (dải đứng) hoặc loại II (dải ngang).</li><li>Đặt cận và tính tích phân lặp.</li><li>Đổi thứ tự lấy tích phân để biến tích phân “không tính được” thành dễ.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Miền loại I và loại II</span>Loại I: D = {a ≤ x ≤ b, g<sub>1</sub>(x) ≤ y ≤ g<sub>2</sub>(x)} ⇒ ∬<sub>D</sub> f dA = ∫<sub>a</sub><sup>b</sup> ∫<sub>g<sub>1</sub>(x)</sub><sup>g<sub>2</sub>(x)</sup> f dy dx<br>Loại II: D = {c ≤ y ≤ d, h<sub>1</sub>(y) ≤ x ≤ h<sub>2</sub>(y)} ⇒ ∬<sub>D</sub> f dA = ∫<sub>c</sub><sup>d</sup> ∫<sub>h<sub>1</sub>(y)</sub><sup>h<sub>2</sub>(y)</sup> f dx dy</div>
<p><b>Công thức làm bài.</b> (1) Vẽ D và tìm giao điểm. (2) Vẽ một dải đứng điển hình: nó vào miền ở đâu (đường dưới) và ra ở đâu (đường trên)? Đó là cận trong. (3) Cận ngoài là giá trị cực biên hằng của x. Cận ngoài phải là <strong>số</strong>.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> ∬<sub>D</sub> (x + 2y) dA, D giữa y = 2x<sup>2</sup> và y = 1 + x<sup>2</sup>.</p>
<p>Giao điểm: 2x<sup>2</sup> = 1 + x<sup>2</sup> ⇒ x = ±1; trên (−1, 1) đường trên là 1 + x<sup>2</sup>. ∫<sub>−1</sub><sup>1</sup> ∫<sub>2x<sup>2</sup></sub><sup>1+x<sup>2</sup></sup> (x + 2y) dy dx = ∫<sub>−1</sub><sup>1</sup> [xy + y<sup>2</sup>]<sub>2x<sup>2</sup></sub><sup>1+x<sup>2</sup></sup> dx = ∫<sub>−1</sub><sup>1</sup> (−3x<sup>4</sup> − x<sup>3</sup> + 2x<sup>2</sup> + x + 1) dx = <b>32/15</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — đổi thứ tự.</b> ∫<sub>0</sub><sup>1</sup> ∫<sub>x</sub><sup>1</sup> sin(y<sup>2</sup>) dy dx. sin(y<sup>2</sup>) không có nguyên hàm sơ cấp, nên tích phân trong bế tắc.</p>
<p>Vẽ: 0 ≤ x ≤ 1, x ≤ y ≤ 1 là tam giác đỉnh (0, 0), (0, 1), (1, 1). Dạng loại II: 0 ≤ y ≤ 1, 0 ≤ x ≤ y. Vậy tích phân = ∫<sub>0</sub><sup>1</sup> ∫<sub>0</sub><sup>y</sup> sin(y<sup>2</sup>) dx dy = ∫<sub>0</sub><sup>1</sup> y sin(y<sup>2</sup>) dy = [−cos(y<sup>2</sup>)/2]<sub>0</sub><sup>1</sup> = <b>(1 − cos 1)/2 ≈ 0,2298</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — thể tích tứ diện</b> giới hạn bởi x + 2y + z = 2, x = 2y, x = 0, z = 0. Đáy trong mặt Oxy: 0 ≤ x ≤ 1, x/2 ≤ y ≤ 1 − x/2. V = ∫<sub>0</sub><sup>1</sup> ∫<sub>x/2</sub><sup>1−x/2</sup> (2 − x − 2y) dy dx = <b>1/3</b>.</p></div>
<p><b>Diện tích bằng tích phân kép.</b> Diện tích(D) = ∬<sub>D</sub> 1 dA — công thức “diện tích giữa hai đường” của CAL111 là trường hợp riêng f = 1.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Cận ngoài chứa biến (chúng phải là hằng số).</li><li>Đổi thứ tự bằng cách chỉ hoán đổi cận — phải vẽ lại miền.</li><li>Chọn loại I khi miền phải chia nhiều mảnh, trong khi loại II chỉ cần một (hoặc ngược lại).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Vẽ trước; cận trong từ dải, cận ngoài là hằng.</li><li>Loại I: dy dx với y giữa hai đường; loại II: dx dy.</li><li>Đổi thứ tự cứu được tích phân kiểu sin(y<sup>2</sup>), e<sup>x<sup>2</sup></sup>.</li><li>∬ 1 dA = diện tích.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS3 + '5-2-double-integrals-over-general-regions', 'OpenStax Vol. 3 — 5.2 Tích phân kép trên miền tổng quát') + `</li><li>` + A(PN3 + 'DIGeneralRegion.aspx', "Paul's Online Notes — Tích phân kép trên miền tổng quát") + `</li><li>` + A('https://www.geogebra.org/3d', 'GeoGebra 3D — vẽ miền và mặt trước khi tính tích phân') + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>∬<sub>D</sub> xy dA, D giữa y = x<sup>2</sup> và y = x.</li><li>Đổi thứ tự rồi tính ∫<sub>0</sub><sup>1</sup> ∫<sub>y</sub><sup>1</sup> e<sup>x<sup>2</sup></sup> dx dy.</li><li>Viết ∫<sub>0</sub><sup>2</sup>∫<sub>x<sup>2</sup></sub><sup>4</sup> f dy dx theo thứ tự dx dy.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) ∫<sub>0</sub><sup>1</sup> ∫<sub>x<sup>2</sup></sub><sup>x</sup> xy dy dx = <b>1/24</b>. 2) Miền 0 ≤ y ≤ x ≤ 1 ⇒ ∫<sub>0</sub><sup>1</sup> ∫<sub>0</sub><sup>x</sup> e<sup>x<sup>2</sup></sup> dy dx = ∫<sub>0</sub><sup>1</sup> x e<sup>x<sup>2</sup></sup> dx = <b>(e − 1)/2</b>. 3) <b>∫<sub>0</sub><sup>4</sup> ∫<sub>0</sub><sup>√y</sup> f dx dy</b>.</p></div>`);

const c103 = L('cal121-ts-10-3',
  '10.3 — Double integrals in polar coordinates and the Gaussian integral|||10.3 — Tích phân kép trong toạ độ cực và tích phân Gauss',
  'dA = r dr dθ, miền cực (hình tròn, vành khăn, hình quạt, đường cực); ví dụ ∬(3x + 4y²) trên nửa vành khăn = 15π/2, thể tích dưới paraboloid = π/2; chứng minh ∫e^(−x²)dx = √π.',
  `<span class="eyebrow">CAL121 · Chapter 10 · Lesson 10.3</span>
<h2>Double integrals in polar coordinates</h2>
<p class="lead">Disks, rings and sectors are awkward in x and y (square roots in the limits) but trivial in r and θ (constant limits). The only price is one extra factor: <strong>dA = r dr dθ</strong>. The same trick computes the most important integral in probability.</p>
<h3>🎯 Objectives</h3>
<ul><li>Convert a double integral to polar coordinates, including the factor r.</li><li>Describe circular regions with polar limits.</li><li>Evaluate ∫<sub>−∞</sub><sup>∞</sup> e<sup>−x<sup>2</sup></sup> dx = √π.</li></ul>
<h3>📖 Lecture</h3>
<p>A small polar rectangle (radial width Δr, angle Δθ, at radius r) is almost a rectangle with sides Δr and rΔθ, so its area is ≈ r Δr Δθ. Hence:</p>
<div class="formula"><span class="lbl">Change to polar coordinates</span>∬<sub>D</sub> f(x, y) dA = ∫<sub>α</sub><sup>β</sup> ∫<sub>r<sub>1</sub>(θ)</sub><sup>r<sub>2</sub>(θ)</sup> f(r cos θ, r sin θ) <b>r</b> dr dθ,   with x<sup>2</sup> + y<sup>2</sup> = r<sup>2</sup></div>
<p>Use polar coordinates when the region is described by circles/rays, or the integrand contains x<sup>2</sup> + y<sup>2</sup>.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> ∬<sub>R</sub> (3x + 4y<sup>2</sup>) dA, R = upper half of the ring 1 ≤ x<sup>2</sup> + y<sup>2</sup> ≤ 4.</p>
<p>R: 1 ≤ r ≤ 2, 0 ≤ θ ≤ π. ∫<sub>0</sub><sup>π</sup>∫<sub>1</sub><sup>2</sup> (3r cos θ + 4r<sup>2</sup>sin<sup>2</sup>θ) r dr dθ = ∫<sub>0</sub><sup>π</sup> (7 cos θ + 15 sin<sup>2</sup>θ) dθ = 0 + 15π/2 = <b>15π/2</b>.</p></div>
<div class="callout"><p><b>Example 2 — volume.</b> The solid under the paraboloid z = 1 − x<sup>2</sup> − y<sup>2</sup> and above the xy-plane: the base is r ≤ 1. V = ∫<sub>0</sub><sup>2π</sup>∫<sub>0</sub><sup>1</sup> (1 − r<sup>2</sup>) r dr dθ = 2π · (1/2 − 1/4) = <b>π/2</b>. (In Cartesian form the limits would be −√(1 − x<sup>2</sup>) ≤ y ≤ √(1 − x<sup>2</sup>) — much harder.)</p></div>
<div class="callout"><p><b>Example 3 — a region bounded by a polar curve.</b> Area inside r = 2cos θ: ∫<sub>−π/2</sub><sup>π/2</sup> ∫<sub>0</sub><sup>2cos θ</sup> r dr dθ = <b>π</b> (the same answer as Lesson 3.3, now as a double integral).</p></div>
<h3>📖 The Gaussian integral</h3>
<p>Let I = ∫<sub>−∞</sub><sup>∞</sup> e<sup>−x<sup>2</sup></sup> dx. No antiderivative exists, but</p>
<div class="formula"><span class="lbl">Squaring trick</span>I<sup>2</sup> = ∫∫<sub>ℝ<sup>2</sup></sub> e<sup>−(x<sup>2</sup>+y<sup>2</sup>)</sup> dA = ∫<sub>0</sub><sup>2π</sup> ∫<sub>0</sub><sup>∞</sup> e<sup>−r<sup>2</sup></sup> r dr dθ = 2π · [−e<sup>−r<sup>2</sup></sup>/2]<sub>0</sub><sup>∞</sup> = π   ⇒   I = √π</div>
<p>This is why the normal density is (1/√(2π)) e<sup>−x<sup>2</sup>/2</sup>: the constant makes the total probability exactly 1. The factor r is what makes the inner integral elementary.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li><strong>Forgetting the r</strong> — by far the most common error.</li><li>Using 0 ≤ θ ≤ 2π for a half disk or a quarter disk.</li><li>Writing r ≤ 4 for x<sup>2</sup> + y<sup>2</sup> ≤ 4 (it is r ≤ 2).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>x = r cos θ, y = r sin θ, dA = r dr dθ.</li><li>Disks, rings, sectors ⇒ constant polar limits.</li><li>x<sup>2</sup> + y<sup>2</sup> in the integrand ⇒ think polar.</li><li>∫<sub>−∞</sub><sup>∞</sup> e<sup>−x<sup>2</sup></sup> dx = √π.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS3 + '5-3-double-integrals-in-polar-coordinates', 'OpenStax Vol. 3 — 5.3 Double Integrals in Polar Coordinates') + `</li><li>` + A(PN3 + 'DIPolarCoords.aspx', "Paul's Online Notes — Double Integrals in Polar Coordinates") + `</li><li>` + A('https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/3.-double-integrals-and-line-integrals-in-the-plane/', 'MIT OCW 18.02SC — Unit 3, Part A: Double Integrals (polar)') + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>∬<sub>D</sub> (x<sup>2</sup> + y<sup>2</sup>) dA, D: x<sup>2</sup> + y<sup>2</sup> ≤ 4.</li><li>∬<sub>ℝ<sup>2</sup></sub> e<sup>−(x<sup>2</sup>+y<sup>2</sup>)</sup> dA.</li><li>Convert to polar and evaluate ∫<sub>0</sub><sup>1</sup>∫<sub>0</sub><sup>√(1−x<sup>2</sup>)</sup> dy dx.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) ∫<sub>0</sub><sup>2π</sup>∫<sub>0</sub><sup>2</sup> r<sup>2</sup> · r dr dθ = 2π · 4 = <b>8π</b>. 2) <b>π</b> (from the Gaussian computation). 3) Quarter disk: ∫<sub>0</sub><sup>π/2</sup>∫<sub>0</sub><sup>1</sup> r dr dθ = <b>π/4</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 10 · Bài 10.3</span>
<h2>Tích phân kép trong toạ độ cực</h2>
<p class="lead">Hình tròn, vành khăn, hình quạt rất vướng khi dùng x và y (căn thức trong cận) nhưng rất đơn giản với r và θ (cận là hằng). Cái giá duy nhất là một thừa số thêm: <strong>dA = r dr dθ</strong>. Cùng mẹo đó tính được tích phân quan trọng nhất của xác suất.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Đổi tích phân kép sang toạ độ cực, kể cả thừa số r.</li><li>Mô tả miền tròn bằng cận cực.</li><li>Tính ∫<sub>−∞</sub><sup>∞</sup> e<sup>−x<sup>2</sup></sup> dx = √π.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Một “hình chữ nhật cực” nhỏ (bề rộng Δr, góc Δθ, ở bán kính r) gần như hình chữ nhật cạnh Δr và rΔθ, nên diện tích ≈ r Δr Δθ. Do đó:</p>
<div class="formula"><span class="lbl">Đổi sang toạ độ cực</span>∬<sub>D</sub> f(x, y) dA = ∫<sub>α</sub><sup>β</sup> ∫<sub>r<sub>1</sub>(θ)</sub><sup>r<sub>2</sub>(θ)</sup> f(r cos θ, r sin θ) <b>r</b> dr dθ,   với x<sup>2</sup> + y<sup>2</sup> = r<sup>2</sup></div>
<p>Dùng toạ độ cực khi miền mô tả bằng đường tròn/tia, hoặc hàm dưới dấu tích phân chứa x<sup>2</sup> + y<sup>2</sup>.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> ∬<sub>R</sub> (3x + 4y<sup>2</sup>) dA, R = nửa trên của vành khăn 1 ≤ x<sup>2</sup> + y<sup>2</sup> ≤ 4.</p>
<p>R: 1 ≤ r ≤ 2, 0 ≤ θ ≤ π. ∫<sub>0</sub><sup>π</sup>∫<sub>1</sub><sup>2</sup> (3r cos θ + 4r<sup>2</sup>sin<sup>2</sup>θ) r dr dθ = ∫<sub>0</sub><sup>π</sup> (7 cos θ + 15 sin<sup>2</sup>θ) dθ = 0 + 15π/2 = <b>15π/2</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — thể tích.</b> Khối dưới paraboloid z = 1 − x<sup>2</sup> − y<sup>2</sup> và trên mặt Oxy: đáy là r ≤ 1. V = ∫<sub>0</sub><sup>2π</sup>∫<sub>0</sub><sup>1</sup> (1 − r<sup>2</sup>) r dr dθ = 2π · (1/2 − 1/4) = <b>π/2</b>. (Dạng Descartes cần cận −√(1 − x<sup>2</sup>) ≤ y ≤ √(1 − x<sup>2</sup>) — khó hơn nhiều.)</p></div>
<div class="callout"><p><b>Ví dụ 3 — miền giới hạn bởi đường cực.</b> Diện tích bên trong r = 2cos θ: ∫<sub>−π/2</sub><sup>π/2</sup> ∫<sub>0</sub><sup>2cos θ</sup> r dr dθ = <b>π</b> (cùng đáp số với Bài 3.3, giờ dưới dạng tích phân kép).</p></div>
<h3>📖 Tích phân Gauss</h3>
<p>Đặt I = ∫<sub>−∞</sub><sup>∞</sup> e<sup>−x<sup>2</sup></sup> dx. Không có nguyên hàm sơ cấp, nhưng</p>
<div class="formula"><span class="lbl">Mẹo bình phương</span>I<sup>2</sup> = ∫∫<sub>ℝ<sup>2</sup></sub> e<sup>−(x<sup>2</sup>+y<sup>2</sup>)</sup> dA = ∫<sub>0</sub><sup>2π</sup> ∫<sub>0</sub><sup>∞</sup> e<sup>−r<sup>2</sup></sup> r dr dθ = 2π · [−e<sup>−r<sup>2</sup></sup>/2]<sub>0</sub><sup>∞</sup> = π   ⇒   I = √π</div>
<p>Đây là lý do mật độ chuẩn là (1/√(2π)) e<sup>−x<sup>2</sup>/2</sup>: hằng số làm tổng xác suất đúng bằng 1. Chính thừa số r làm tích phân trong trở nên sơ cấp.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li><strong>Quên r</strong> — lỗi phổ biến nhất, bỏ xa mọi lỗi khác.</li><li>Dùng 0 ≤ θ ≤ 2π cho nửa hoặc một phần tư hình tròn.</li><li>Viết r ≤ 4 cho x<sup>2</sup> + y<sup>2</sup> ≤ 4 (đúng là r ≤ 2).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>x = r cos θ, y = r sin θ, dA = r dr dθ.</li><li>Hình tròn, vành khăn, hình quạt ⇒ cận cực là hằng.</li><li>Có x<sup>2</sup> + y<sup>2</sup> trong hàm ⇒ nghĩ tới toạ độ cực.</li><li>∫<sub>−∞</sub><sup>∞</sup> e<sup>−x<sup>2</sup></sup> dx = √π.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS3 + '5-3-double-integrals-in-polar-coordinates', 'OpenStax Vol. 3 — 5.3 Tích phân kép trong toạ độ cực') + `</li><li>` + A(PN3 + 'DIPolarCoords.aspx', "Paul's Online Notes — Tích phân kép trong toạ độ cực") + `</li><li>` + A('https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/3.-double-integrals-and-line-integrals-in-the-plane/', 'MIT OCW 18.02SC — Unit 3, Part A: Tích phân kép (toạ độ cực)') + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>∬<sub>D</sub> (x<sup>2</sup> + y<sup>2</sup>) dA, D: x<sup>2</sup> + y<sup>2</sup> ≤ 4.</li><li>∬<sub>ℝ<sup>2</sup></sub> e<sup>−(x<sup>2</sup>+y<sup>2</sup>)</sup> dA.</li><li>Đổi sang toạ độ cực rồi tính ∫<sub>0</sub><sup>1</sup>∫<sub>0</sub><sup>√(1−x<sup>2</sup>)</sup> dy dx.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) ∫<sub>0</sub><sup>2π</sup>∫<sub>0</sub><sup>2</sup> r<sup>2</sup> · r dr dθ = 2π · 4 = <b>8π</b>. 2) <b>π</b> (từ phép tính tích phân Gauss). 3) Một phần tư hình tròn: ∫<sub>0</sub><sup>π/2</sup>∫<sub>0</sub><sup>1</sup> r dr dθ = <b>π/4</b>.</p></div>`);

const c104 = L('cal121-ts-10-4',
  '10.4 — Applications of double integrals: mass, centre of mass, probability|||10.4 — Ứng dụng tích phân kép: khối lượng, trọng tâm, xác suất',
  'Khối lượng m = ∬ρ dA, mômen và trọng tâm tấm phẳng mật độ thay đổi (tam giác ρ = 1 + 3x + y: m = 8/3, tâm (3/8, 11/16)), mật độ xác suất đồng thời, P((X,Y) ∈ D), kỳ vọng.',
  `<span class="eyebrow">CAL121 · Chapter 10 · Lesson 10.4</span>
<h2>Applications of double integrals</h2>
<p class="lead">Whenever a quantity is spread over a flat region with a varying density — mass over a metal plate, charge over a sensor, probability over the (x, y) plane — the total is a double integral of that density. Lesson 1.3 did centres of mass for constant density; now the density can vary.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute mass, moments and centre of mass of a lamina with variable density.</li><li>Use joint probability densities to compute probabilities.</li><li>Compute expected values as double integrals.</li></ul>
<h3>📖 Mass and centre of mass</h3>
<div class="formula"><span class="lbl">Lamina with density ρ(x, y)</span>m = ∬<sub>D</sub> ρ dA      M<sub>y</sub> = ∬<sub>D</sub> x ρ dA      M<sub>x</sub> = ∬<sub>D</sub> y ρ dA      (x̄, ȳ) = (M<sub>y</sub>/m, M<sub>x</sub>/m)</div>
<div class="callout"><p><b>Example 1.</b> Triangle with vertices (0, 0), (1, 0), (0, 2), density ρ = 1 + 3x + y.</p>
<p>Region: 0 ≤ x ≤ 1, 0 ≤ y ≤ 2 − 2x. m = ∫<sub>0</sub><sup>1</sup>∫<sub>0</sub><sup>2−2x</sup> (1 + 3x + y) dy dx = <b>8/3</b>. M<sub>y</sub> = ∫∫ x(1 + 3x + y) dA = 1, M<sub>x</sub> = ∫∫ y(1 + 3x + y) dA = 11/6. Centre of mass <b>(3/8, 11/16)</b>.</p>
<p>Sanity check: with constant density the centroid would be the average of the vertices, (1/3, 2/3). The density grows with x and y, so the centre moves right (3/8 &gt; 1/3) and up (11/16 &gt; 2/3) ✓.</p></div>
<h3>📖 Probability</h3>
<p>A <strong>joint density</strong> f(x, y) ≥ 0 with ∬<sub>ℝ<sup>2</sup></sub> f dA = 1 describes two continuous random variables X, Y:</p>
<div class="formula"><span class="lbl">Probability and expectation</span>P((X, Y) ∈ D) = ∬<sub>D</sub> f(x, y) dA        E[X] = ∬ x f(x, y) dA,  E[Y] = ∬ y f(x, y) dA</div>
<div class="callout"><p><b>Example 2.</b> The lifetimes X, Y (in years) of two independent components have joint density f(x, y) = 6e<sup>−2x−3y</sup> for x, y ≥ 0. Check: ∫<sub>0</sub><sup>∞</sup>∫<sub>0</sub><sup>∞</sup> 6e<sup>−2x−3y</sup> dx dy = 6 · (1/2)(1/3) = 1 ✓. Probability both fail within a year: P(X ≤ 1, Y ≤ 1) = (1 − e<sup>−2</sup>)(1 − e<sup>−3</sup>) ≈ <b>0.8216</b>.</p></div>
<div class="callout"><p><b>Example 3 — geometry of probability.</b> X, Y uniform on the unit square (f = 1). P(X + Y ≤ 1) = area of the triangle below x + y = 1 = <b>1/2</b>. Simulation (Monte Carlo) methods estimate such probabilities by throwing random points — and estimate double integrals the same way.</p></div>
<p>These ideas return in <strong>MAS291</strong> (joint distributions, covariance) and in machine learning (expected loss over a data distribution).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Dividing M<sub>y</sub> by the <em>area</em> instead of the mass when ρ is not constant.</li><li>Swapping moments: x̄ uses M<sub>y</sub> = ∬ xρ dA (moment about the y-axis).</li><li>Integrating a density outside its support (e.g. over x &lt; 0 where f = 0).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>m = ∬ ρ dA; x̄ = ∬ xρ dA / m, ȳ = ∬ yρ dA / m.</li><li>Joint density integrates to 1; probability = ∬ over the event.</li><li>Independent exponentials: probabilities factor.</li><li>Always sanity-check centres of mass against the picture.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS3 + '5-6-calculating-centers-of-mass-and-moments-of-inertia', 'OpenStax Vol. 3 — 5.6 Calculating Centers of Mass and Moments of Inertia') + `</li><li>` + A(PN3 + 'DoubleIntegrals.aspx', "Paul's Online Notes — Double Integrals (overview of applications)") + `</li><li>` + A('https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/3.-double-integrals-and-line-integrals-in-the-plane/', 'MIT OCW 18.02SC — Unit 3 (mass, moments, applications)') + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>Mass of the unit square [0, 1]<sup>2</sup> with density ρ = x + y, and its x̄.</li><li>Centroid of the triangle 0 ≤ y ≤ x ≤ 1 (constant density).</li><li>With f(x, y) = 6e<sup>−2x−3y</sup>, what is the probability that X ≤ 1 (any Y)?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) m = 1; M<sub>y</sub> = ∬ x(x + y) dA = 7/12 ⇒ <b>x̄ = 7/12</b> (and ȳ = 7/12 by symmetry). 2) Area 1/2, x̄ = 2∬ x dA = 2/3, ȳ = 2∬ y dA = 1/3 ⇒ <b>(2/3, 1/3)</b>. 3) ∫<sub>0</sub><sup>1</sup> 2e<sup>−2x</sup> dx = <b>1 − e<sup>−2</sup> ≈ 0.8647</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 10 · Bài 10.4</span>
<h2>Ứng dụng của tích phân kép</h2>
<p class="lead">Mỗi khi một đại lượng phân bố trên một miền phẳng với mật độ thay đổi — khối lượng trên tấm kim loại, điện tích trên cảm biến, xác suất trên mặt phẳng (x, y) — tổng là tích phân kép của mật độ đó. Bài 1.3 đã tính trọng tâm với mật độ đều; giờ mật độ có thể thay đổi.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính khối lượng, mômen, tâm khối của tấm phẳng mật độ thay đổi.</li><li>Dùng mật độ xác suất đồng thời để tính xác suất.</li><li>Tính kỳ vọng bằng tích phân kép.</li></ul>
<h3>📖 Khối lượng và tâm khối</h3>
<div class="formula"><span class="lbl">Tấm phẳng mật độ ρ(x, y)</span>m = ∬<sub>D</sub> ρ dA      M<sub>y</sub> = ∬<sub>D</sub> x ρ dA      M<sub>x</sub> = ∬<sub>D</sub> y ρ dA      (x̄, ȳ) = (M<sub>y</sub>/m, M<sub>x</sub>/m)</div>
<div class="callout"><p><b>Ví dụ 1.</b> Tam giác đỉnh (0, 0), (1, 0), (0, 2), mật độ ρ = 1 + 3x + y.</p>
<p>Miền: 0 ≤ x ≤ 1, 0 ≤ y ≤ 2 − 2x. m = ∫<sub>0</sub><sup>1</sup>∫<sub>0</sub><sup>2−2x</sup> (1 + 3x + y) dy dx = <b>8/3</b>. M<sub>y</sub> = ∫∫ x(1 + 3x + y) dA = 1, M<sub>x</sub> = ∫∫ y(1 + 3x + y) dA = 11/6. Tâm khối <b>(3/8, 11/16)</b>.</p>
<p>Kiểm hợp lý: với mật độ đều, trọng tâm là trung bình ba đỉnh (1/3, 2/3). Mật độ tăng theo x và y, nên tâm dịch sang phải (3/8 &gt; 1/3) và lên trên (11/16 &gt; 2/3) ✓.</p></div>
<h3>📖 Xác suất</h3>
<p><strong>Mật độ đồng thời</strong> f(x, y) ≥ 0 với ∬<sub>ℝ<sup>2</sup></sub> f dA = 1 mô tả hai biến ngẫu nhiên liên tục X, Y:</p>
<div class="formula"><span class="lbl">Xác suất và kỳ vọng</span>P((X, Y) ∈ D) = ∬<sub>D</sub> f(x, y) dA        E[X] = ∬ x f(x, y) dA,  E[Y] = ∬ y f(x, y) dA</div>
<div class="callout"><p><b>Ví dụ 2.</b> Tuổi thọ X, Y (năm) của hai linh kiện độc lập có mật độ đồng thời f(x, y) = 6e<sup>−2x−3y</sup> với x, y ≥ 0. Kiểm: ∫<sub>0</sub><sup>∞</sup>∫<sub>0</sub><sup>∞</sup> 6e<sup>−2x−3y</sup> dx dy = 6 · (1/2)(1/3) = 1 ✓. Xác suất cả hai hỏng trong một năm: P(X ≤ 1, Y ≤ 1) = (1 − e<sup>−2</sup>)(1 − e<sup>−3</sup>) ≈ <b>0,8216</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — hình học của xác suất.</b> X, Y phân phối đều trên hình vuông đơn vị (f = 1). P(X + Y ≤ 1) = diện tích tam giác dưới x + y = 1 = <b>1/2</b>. Phương pháp mô phỏng Monte Carlo ước lượng những xác suất như vậy bằng cách gieo điểm ngẫu nhiên — và ước lượng tích phân kép cũng theo cách đó.</p></div>
<p>Các ý này quay lại ở <strong>MAS291</strong> (phân phối đồng thời, hiệp phương sai) và trong học máy (kỳ vọng mất mát trên phân phối dữ liệu).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chia M<sub>y</sub> cho <em>diện tích</em> thay vì khối lượng khi ρ không đều.</li><li>Nhầm mômen: x̄ dùng M<sub>y</sub> = ∬ xρ dA (mômen đối với trục Oy).</li><li>Lấy tích phân mật độ ngoài miền xác định của nó (vd trên x &lt; 0 nơi f = 0).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>m = ∬ ρ dA; x̄ = ∬ xρ dA / m, ȳ = ∬ yρ dA / m.</li><li>Mật độ đồng thời có tích phân bằng 1; xác suất = ∬ trên biến cố.</li><li>Hai mũ độc lập: xác suất tách thành tích.</li><li>Luôn kiểm tâm khối với hình vẽ.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS3 + '5-6-calculating-centers-of-mass-and-moments-of-inertia', 'OpenStax Vol. 3 — 5.6 Tâm khối và mômen quán tính') + `</li><li>` + A(PN3 + 'DoubleIntegrals.aspx', "Paul's Online Notes — Tích phân kép (tổng quan ứng dụng)") + `</li><li>` + A('https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/3.-double-integrals-and-line-integrals-in-the-plane/', 'MIT OCW 18.02SC — Unit 3 (khối lượng, mômen, ứng dụng)') + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Khối lượng hình vuông [0, 1]<sup>2</sup> với mật độ ρ = x + y, và x̄.</li><li>Trọng tâm tam giác 0 ≤ y ≤ x ≤ 1 (mật độ đều).</li><li>Với f(x, y) = 6e<sup>−2x−3y</sup>, xác suất X ≤ 1 (Y tuỳ ý) bằng bao nhiêu?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) m = 1; M<sub>y</sub> = ∬ x(x + y) dA = 7/12 ⇒ <b>x̄ = 7/12</b> (và ȳ = 7/12 do đối xứng). 2) Diện tích 1/2, x̄ = 2∬ x dA = 2/3, ȳ = 2∬ y dA = 1/3 ⇒ <b>(2/3, 1/3)</b>. 3) ∫<sub>0</sub><sup>1</sup> 2e<sup>−2x</sup> dx = <b>1 − e<sup>−2</sup> ≈ 0,8647</b>.</p></div>`);

const q10 = QZ(10, 'Quiz — Chapter 10: Double integrals|||Quiz — Chương 10: Tích phân kép', 'Kiểm tra chương 10: Fubini, thứ tự lấy tích phân, miền tổng quát, toạ độ cực (thừa số r), tích phân Gauss, khối lượng, tâm khối, xác suất.', [
  Q('q1', '∬ (x − 3y²) dA over [0, 2] × [1, 2] =|||∬ (x − 3y²) dA trên [0, 2] × [1, 2] =',
    ['−12|||−12', '12|||12', '−10|||−10', '0|||0'], 0,
    '∫₁² (2 − 6y²) dy = −12.|||∫₁² (2 − 6y²) dy = −12.'),
  Q('q2', "Fubini's theorem on a rectangle says|||Định lý Fubini trên hình chữ nhật nói",
    ['the order of integration does not matter for continuous f|||thứ tự lấy tích phân không quan trọng với f liên tục', 'the double integral is always positive|||tích phân kép luôn dương', 'only dy dx is allowed|||chỉ được dùng dy dx', 'the integral equals the area|||tích phân bằng diện tích'], 0,
    'Both iterated integrals equal the double integral.|||Cả hai tích phân lặp đều bằng tích phân kép.'),
  Q('q3', 'Volume under z = 16 − x² − 2y² over [0, 2] × [0, 2]:|||Thể tích dưới z = 16 − x² − 2y² trên [0, 2] × [0, 2]:',
    ['44|||44', '48|||48', '52|||52', '64|||64'], 1,
    '64 − 16/3 − 32/3 = 48; the midpoint rule approaches it.|||64 − 16/3 − 32/3 = 48; quy tắc điểm giữa tiến về đó.'),
  Q('q4', 'Reversing ∫₀¹ ∫ₓ¹ sin(y²) dy dx gives|||Đổi thứ tự ∫₀¹ ∫ₓ¹ sin(y²) dy dx được',
    ['∫₀¹ ∫₀ʸ sin(y²) dx dy|||∫₀¹ ∫₀ʸ sin(y²) dx dy', '∫₀¹ ∫ᵧ¹ sin(y²) dx dy|||∫₀¹ ∫ᵧ¹ sin(y²) dx dy', '∫₀¹ ∫₀¹ sin(y²) dx dy|||∫₀¹ ∫₀¹ sin(y²) dx dy', 'cannot be reversed|||không đổi được'], 0,
    'The triangle 0 ≤ x ≤ y ≤ 1.|||Tam giác 0 ≤ x ≤ y ≤ 1.'),
  Q('q5', 'The value of that integral is|||Giá trị của tích phân đó là',
    ['sin 1|||sin 1', '(1 − cos 1)/2|||(1 − cos 1)/2', '1 − cos 1|||1 − cos 1', 'cos 1/2|||cos 1/2'], 1,
    '∫₀¹ y sin(y²) dy = (1 − cos 1)/2 ≈ 0.2298.|||∫₀¹ y sin(y²) dy = (1 − cos 1)/2 ≈ 0,2298.'),
  Q('q6', 'In polar coordinates dA equals|||Trong toạ độ cực dA bằng',
    ['dr dθ|||dr dθ', 'r dr dθ|||r dr dθ', 'r² dr dθ|||r² dr dθ', 'r sin θ dr dθ|||r sin θ dr dθ'], 1,
    'A polar rectangle has sides Δr and rΔθ.|||Hình chữ nhật cực có cạnh Δr và rΔθ.'),
  Q('q7', 'Volume under z = 1 − x² − y² above the xy-plane:|||Thể tích dưới z = 1 − x² − y² và trên mặt Oxy:',
    ['π|||π', 'π/2|||π/2', 'π/4|||π/4', '2π/3|||2π/3'], 1,
    '2π∫₀¹ (1 − r²) r dr = 2π(1/4).|||2π∫₀¹ (1 − r²) r dr = 2π(1/4).'),
  Q('q8', '∫ from −∞ to ∞ of e^(−x²) dx =|||∫ từ −∞ đến ∞ của e^(−x²) dx =',
    ['1|||1', 'π|||π', '√π|||√π', '√(2π)|||√(2π)'], 2,
    'I² = ∬ e^(−r²) r dr dθ = π.|||I² = ∬ e^(−r²) r dr dθ = π.'),
  Q('q9', 'Triangle (0,0), (1,0), (0,2) with density ρ = 1 + 3x + y has mass|||Tam giác (0,0), (1,0), (0,2) mật độ ρ = 1 + 3x + y có khối lượng',
    ['1|||1', '2|||2', '8/3|||8/3', '11/6|||11/6'], 2,
    '∫₀¹∫₀^(2−2x) (1 + 3x + y) dy dx = 8/3.|||∫₀¹∫₀^(2−2x) (1 + 3x + y) dy dx = 8/3.'),
  Q('q10', 'X, Y uniform on the unit square. P(X + Y ≤ 1) =|||X, Y đều trên hình vuông đơn vị. P(X + Y ≤ 1) =',
    ['1/4|||1/4', '1/2|||1/2', '1/3|||1/3', '1|||1'], 1,
    'Area of the triangle under x + y = 1.|||Diện tích tam giác dưới x + y = 1.'),
]);

const ch10 = {
  title: 'Chapter 10 — Double integrals|||Chương 10 — Tích phân kép',
  description: 'Tích phân kép trên hình chữ nhật (Fubini, quy tắc điểm giữa bằng Python), miền tổng quát và đổi thứ tự, toạ độ cực và tích phân Gauss, ứng dụng: khối lượng, tâm khối, xác suất (Stewart 15.1–15.5 · OpenStax Vol.3 5.1–5.3, 5.6).',
  lessons: [c101, c102, c103, c104, q10],
};

// ───────────────────────────── Chương 11 — Tích phân bội ba & đổi biến ─────────────────────────────
const c111 = L('cal121-ts-11-1',
  '11.1 — Triple integrals|||11.1 — Tích phân bội ba',
  'Tích phân bội ba trên hộp (Fubini) và trên miền tổng quát (miền loại 1: z giữa hai mặt), thể tích = ∭1 dV, ví dụ ∭xyz² = 27/4, tứ diện x+y+z ≤ 1 có thể tích 1/6 và ∭z dV = 1/24; khối lượng và tâm khối 3D.',
  `<span class="eyebrow">CAL121 · Chapter 11 · Lesson 11.1</span>
<h2>Triple integrals</h2>
<p class="lead">A double integral adds values over a flat region; a <strong>triple integral</strong> adds values over a solid. With density ρ(x, y, z) it gives mass; with ρ = 1 it gives volume. The technique is the same: iterate, innermost first, reading limits from a sketch.</p>
<h3>🎯 Objectives</h3>
<ul><li>Evaluate triple integrals over boxes.</li><li>Set up triple integrals over solids bounded by surfaces (z between two surfaces over a plane region).</li><li>Compute volumes, masses and centres of mass of solids.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Fubini on a box B = [a, b] × [c, d] × [r, s]</span>∭<sub>B</sub> f dV = ∫<sub>r</sub><sup>s</sup> ∫<sub>c</sub><sup>d</sup> ∫<sub>a</sub><sup>b</sup> f(x, y, z) dx dy dz   (any of the 6 orders)</div>
<div class="formula"><span class="lbl">Type 1 solid (z between two surfaces)</span>E = {(x, y) ∈ D, u<sub>1</sub>(x, y) ≤ z ≤ u<sub>2</sub>(x, y)} ⇒ ∭<sub>E</sub> f dV = ∬<sub>D</sub> [ ∫<sub>u<sub>1</sub>(x,y)</sub><sup>u<sub>2</sub>(x,y)</sup> f dz ] dA</div>
<p>Strategy: (1) find the bottom and top surfaces — they are the z-limits; (2) project the solid onto the xy-plane to get D; (3) describe D as in Lesson 10.2.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — a box.</b> ∭<sub>B</sub> xyz<sup>2</sup> dV, B = [0, 1] × [−1, 2] × [0, 3]. The integrand factors: (∫<sub>0</sub><sup>1</sup> x dx)(∫<sub>−1</sub><sup>2</sup> y dy)(∫<sub>0</sub><sup>3</sup> z<sup>2</sup> dz) = (1/2)(3/2)(9) = <b>27/4</b>.</p></div>
<div class="callout"><p><b>Example 2 — the standard tetrahedron</b> E bounded by x = 0, y = 0, z = 0 and x + y + z = 1.</p>
<p>Bottom z = 0, top z = 1 − x − y. Projection D: the triangle 0 ≤ x ≤ 1, 0 ≤ y ≤ 1 − x. Volume = ∫<sub>0</sub><sup>1</sup>∫<sub>0</sub><sup>1−x</sup>∫<sub>0</sub><sup>1−x−y</sup> dz dy dx = <b>1/6</b> (one sixth of the unit cube ✓). And ∭<sub>E</sub> z dV = ∫∫ (1 − x − y)<sup>2</sup>/2 dA = <b>1/24</b>.</p></div>
<div class="callout"><p><b>Example 3 — centre of mass.</b> For the tetrahedron with constant density, z̄ = (∭ z dV)/V = (1/24)/(1/6) = <b>1/4</b>; by symmetry x̄ = ȳ = 1/4. The centroid of any tetrahedron is the average of its four vertices — here (0 + 1 + 0 + 0)/4 = 1/4 ✓.</p></div>
<div class="formula"><span class="lbl">Physical meaning</span>V = ∭<sub>E</sub> 1 dV    m = ∭<sub>E</sub> ρ dV    x̄ = (1/m)∭ xρ dV, ȳ = (1/m)∭ yρ dV, z̄ = (1/m)∭ zρ dV</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Outer limits that depend on inner variables (the outermost limits must be numbers).</li><li>Projecting onto the wrong plane — sometimes the solid is simpler as “x between two surfaces”.</li><li>Not sketching: most triple-integral errors are wrong limits, not wrong antiderivatives.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Iterate three single integrals, innermost first.</li><li>z-limits from bottom/top surfaces; (x, y)-limits from the shadow D.</li><li>∭ 1 dV = volume; ∭ ρ dV = mass.</li><li>The unit tetrahedron has volume 1/6 and centroid (1/4, 1/4, 1/4).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS3 + '5-4-triple-integrals', 'OpenStax Vol. 3 — 5.4 Triple Integrals') + `</li><li>` + A(PN3 + 'TripleIntegrals.aspx', "Paul's Online Notes — Triple Integrals") + `</li><li>` + A('https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/4.-triple-integrals-and-surface-integrals-in-3-space/', 'MIT OCW 18.02SC — Unit 4: Triple Integrals and Surface Integrals in 3-Space') + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>∭<sub>[0,1]<sup>3</sup></sub> (x + y + z) dV.</li><li>∫<sub>0</sub><sup>1</sup>∫<sub>0</sub><sup>x</sup>∫<sub>0</sub><sup>y</sup> 2x dz dy dx.</li><li>Set up the volume of the solid under z = 4 − x<sup>2</sup> − y<sup>2</sup> and above z = 0 as a triple integral (Lesson 11.2 will evaluate it).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Each of the three terms contributes 1/2 ⇒ <b>3/2</b>. 2) ∫∫ 2xy dy dx = ∫<sub>0</sub><sup>1</sup> x<sup>3</sup> dx = <b>1/4</b>. 3) <b>∫<sub>−2</sub><sup>2</sup>∫<sub>−√(4−x<sup>2</sup>)</sub><sup>√(4−x<sup>2</sup>)</sup>∫<sub>0</sub><sup>4−x<sup>2</sup>−y<sup>2</sup></sup> dz dy dx</b> (value 8π).</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 11 · Bài 11.1</span>
<h2>Tích phân bội ba</h2>
<p class="lead">Tích phân kép cộng giá trị trên một miền phẳng; <strong>tích phân bội ba</strong> cộng giá trị trên một khối. Với mật độ ρ(x, y, z) nó cho khối lượng; với ρ = 1 nó cho thể tích. Kỹ thuật vẫn vậy: lặp, từ trong cùng ra, đọc cận từ hình vẽ.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính tích phân bội ba trên hình hộp.</li><li>Đặt tích phân bội ba trên khối giới hạn bởi các mặt (z nằm giữa hai mặt trên một miền phẳng).</li><li>Tính thể tích, khối lượng, tâm khối của vật thể.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Fubini trên hộp B = [a, b] × [c, d] × [r, s]</span>∭<sub>B</sub> f dV = ∫<sub>r</sub><sup>s</sup> ∫<sub>c</sub><sup>d</sup> ∫<sub>a</sub><sup>b</sup> f(x, y, z) dx dy dz   (6 thứ tự bất kỳ)</div>
<div class="formula"><span class="lbl">Khối loại 1 (z giữa hai mặt)</span>E = {(x, y) ∈ D, u<sub>1</sub>(x, y) ≤ z ≤ u<sub>2</sub>(x, y)} ⇒ ∭<sub>E</sub> f dV = ∬<sub>D</sub> [ ∫<sub>u<sub>1</sub>(x,y)</sub><sup>u<sub>2</sub>(x,y)</sup> f dz ] dA</div>
<p>Chiến lược: (1) tìm mặt dưới và mặt trên — đó là cận z; (2) chiếu khối xuống mặt Oxy được D; (3) mô tả D như Bài 10.2.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — hình hộp.</b> ∭<sub>B</sub> xyz<sup>2</sup> dV, B = [0, 1] × [−1, 2] × [0, 3]. Hàm tách biến: (∫<sub>0</sub><sup>1</sup> x dx)(∫<sub>−1</sub><sup>2</sup> y dy)(∫<sub>0</sub><sup>3</sup> z<sup>2</sup> dz) = (1/2)(3/2)(9) = <b>27/4</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — tứ diện chuẩn</b> E giới hạn bởi x = 0, y = 0, z = 0 và x + y + z = 1.</p>
<p>Đáy z = 0, nắp z = 1 − x − y. Hình chiếu D: tam giác 0 ≤ x ≤ 1, 0 ≤ y ≤ 1 − x. Thể tích = ∫<sub>0</sub><sup>1</sup>∫<sub>0</sub><sup>1−x</sup>∫<sub>0</sub><sup>1−x−y</sup> dz dy dx = <b>1/6</b> (một phần sáu khối lập phương đơn vị ✓). Và ∭<sub>E</sub> z dV = ∫∫ (1 − x − y)<sup>2</sup>/2 dA = <b>1/24</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — tâm khối.</b> Với tứ diện mật độ đều, z̄ = (∭ z dV)/V = (1/24)/(1/6) = <b>1/4</b>; do đối xứng x̄ = ȳ = 1/4. Trọng tâm của mọi tứ diện là trung bình bốn đỉnh — ở đây (0 + 1 + 0 + 0)/4 = 1/4 ✓.</p></div>
<div class="formula"><span class="lbl">Ý nghĩa vật lý</span>V = ∭<sub>E</sub> 1 dV    m = ∭<sub>E</sub> ρ dV    x̄ = (1/m)∭ xρ dV, ȳ = (1/m)∭ yρ dV, z̄ = (1/m)∭ zρ dV</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Cận ngoài phụ thuộc biến trong (cận ngoài cùng phải là số).</li><li>Chiếu xuống sai mặt phẳng — đôi khi khối đơn giản hơn ở dạng “x giữa hai mặt”.</li><li>Không vẽ hình: phần lớn lỗi tích phân bội ba là sai cận, không phải sai nguyên hàm.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Lặp ba tích phân đơn, từ trong cùng ra.</li><li>Cận z từ mặt dưới/mặt trên; cận (x, y) từ “bóng” D.</li><li>∭ 1 dV = thể tích; ∭ ρ dV = khối lượng.</li><li>Tứ diện đơn vị có thể tích 1/6 và trọng tâm (1/4, 1/4, 1/4).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS3 + '5-4-triple-integrals', 'OpenStax Vol. 3 — 5.4 Tích phân bội ba') + `</li><li>` + A(PN3 + 'TripleIntegrals.aspx', "Paul's Online Notes — Triple Integrals") + `</li><li>` + A('https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/4.-triple-integrals-and-surface-integrals-in-3-space/', 'MIT OCW 18.02SC — Unit 4: Tích phân bội ba và tích phân mặt') + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>∭<sub>[0,1]<sup>3</sup></sub> (x + y + z) dV.</li><li>∫<sub>0</sub><sup>1</sup>∫<sub>0</sub><sup>x</sup>∫<sub>0</sub><sup>y</sup> 2x dz dy dx.</li><li>Lập tích phân bội ba cho thể tích khối dưới z = 4 − x<sup>2</sup> − y<sup>2</sup> và trên z = 0 (Bài 11.2 sẽ tính).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Mỗi số hạng góp 1/2 ⇒ <b>3/2</b>. 2) ∫∫ 2xy dy dx = ∫<sub>0</sub><sup>1</sup> x<sup>3</sup> dx = <b>1/4</b>. 3) <b>∫<sub>−2</sub><sup>2</sup>∫<sub>−√(4−x<sup>2</sup>)</sub><sup>√(4−x<sup>2</sup>)</sup>∫<sub>0</sub><sup>4−x<sup>2</sup>−y<sup>2</sup></sup> dz dy dx</b> (giá trị 8π).</p></div>`);

const c112 = L('cal121-ts-11-2',
  '11.2 — Triple integrals in cylindrical and spherical coordinates|||11.2 — Tích phân bội ba trong toạ độ trụ và toạ độ cầu',
  'Toạ độ trụ (r, θ, z), dV = r dz dr dθ; toạ độ cầu (ρ, θ, φ), dV = ρ² sinφ dρ dθ dφ; thể tích hình cầu 4πa³/3, khối dưới paraboloid 8π, “kem ốc quế” π/8, ∭e^((x²+y²+z²)^(3/2)) = 4π(e−1)/3.',
  `<span class="eyebrow">CAL121 · Chapter 11 · Lesson 11.2</span>
<h2>Triple integrals in cylindrical and spherical coordinates</h2>
<p class="lead">Polar coordinates made disks easy in the plane. In space, <strong>cylindrical coordinates</strong> (polar + height) make cylinders and paraboloids easy, and <strong>spherical coordinates</strong> (distance + two angles) make balls and cones easy. Each comes with its own volume factor.</p>
<h3>🎯 Objectives</h3>
<ul><li>Convert between Cartesian, cylindrical and spherical coordinates.</li><li>Use dV = r dz dr dθ and dV = ρ<sup>2</sup> sin φ dρ dθ dφ.</li><li>Choose the coordinate system that fits the solid.</li></ul>
<h3>📖 Cylindrical coordinates</h3>
<div class="formula"><span class="lbl">Cylindrical (r, θ, z)</span>x = r cos θ, y = r sin θ, z = z;   x<sup>2</sup> + y<sup>2</sup> = r<sup>2</sup>;   <b>dV = r dz dr dθ</b></div>
<div class="callout"><p><b>Example 1.</b> Volume under z = 4 − x<sup>2</sup> − y<sup>2</sup> above z = 0 (Lesson 11.1, practice 3). In cylindrical form 0 ≤ z ≤ 4 − r<sup>2</sup>, 0 ≤ r ≤ 2: V = ∫<sub>0</sub><sup>2π</sup>∫<sub>0</sub><sup>2</sup>∫<sub>0</sub><sup>4−r<sup>2</sup></sup> r dz dr dθ = 2π∫<sub>0</sub><sup>2</sup> (4r − r<sup>3</sup>) dr = 2π(8 − 4) = <b>8π</b>.</p>
<p><b>Example 2.</b> ∭ (x<sup>2</sup> + y<sup>2</sup>) dV over the cylinder r ≤ 1, 0 ≤ z ≤ 2: ∫<sub>0</sub><sup>2π</sup>∫<sub>0</sub><sup>1</sup>∫<sub>0</sub><sup>2</sup> r<sup>2</sup> · r dz dr dθ = 2π · 2 · 1/4 = <b>π</b> (this is the moment of inertia about the z-axis).</p></div>
<h3>📖 Spherical coordinates</h3>
<p>ρ = distance from the origin, θ = the same angle as in polar coordinates, φ = angle down from the positive z-axis (0 ≤ φ ≤ π).</p>
<div class="formula"><span class="lbl">Spherical (ρ, θ, φ)</span>x = ρ sin φ cos θ, y = ρ sin φ sin θ, z = ρ cos φ;   x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup> = ρ<sup>2</sup>;   <b>dV = ρ<sup>2</sup> sin φ dρ dθ dφ</b></div>
<p>The small spherical box has sides dρ, ρ dφ and ρ sin φ dθ — hence the factor ρ<sup>2</sup> sin φ.</p>
<div class="callout"><p><b>Example 3 — volume of a ball.</b> ∫<sub>0</sub><sup>π</sup>∫<sub>0</sub><sup>2π</sup>∫<sub>0</sub><sup>a</sup> ρ<sup>2</sup> sin φ dρ dθ dφ = (a<sup>3</sup>/3)(2π)(2) = <b>4πa<sup>3</sup>/3</b>.</p>
<p><b>Example 4.</b> ∭<sub>B</sub> e<sup>(x<sup>2</sup>+y<sup>2</sup>+z<sup>2</sup>)<sup>3/2</sup></sup> dV over the unit ball: ∫∫∫ e<sup>ρ<sup>3</sup></sup> ρ<sup>2</sup> sin φ dρ dθ dφ = (e − 1)/3 · 2π · 2 = <b>4π(e − 1)/3</b> — impossible in Cartesian coordinates.</p>
<p><b>Example 5 — “ice-cream cone”.</b> The solid above the cone z = √(x<sup>2</sup> + y<sup>2</sup>) (φ = π/4) and inside the sphere x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup> = z (ρ = cos φ): V = ∫<sub>0</sub><sup>π/4</sup>∫<sub>0</sub><sup>2π</sup>∫<sub>0</sub><sup>cos φ</sup> ρ<sup>2</sup> sin φ dρ dθ dφ = <b>π/8</b>.</p></div>
<div class="kv-grid"><div class="kv"><div class="k">Cylinders, paraboloids z = f(x<sup>2</sup> + y<sup>2</sup>)</div><div class="v">cylindrical</div></div><div class="kv"><div class="k">Balls, cones, x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup></div><div class="v">spherical</div></div><div class="kv"><div class="k">Boxes, planes, tetrahedra</div><div class="v">Cartesian</div></div></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting r or ρ<sup>2</sup> sin φ.</li><li>Letting φ run to 2π (it only goes from 0 to π).</li><li>Mixing the roles of θ and φ (conventions differ between books; physics often swaps them).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Cylindrical: dV = r dz dr dθ.</li><li>Spherical: dV = ρ<sup>2</sup> sin φ dρ dθ dφ, 0 ≤ φ ≤ π.</li><li>Pick the system in which the boundary surfaces become “coordinate = constant”.</li><li>Ball: 4πa<sup>3</sup>/3; cone φ = π/4 and sphere ρ = cos φ: π/8.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS3 + '2-7-cylindrical-and-spherical-coordinates', 'OpenStax Vol. 3 — 2.7 Cylindrical and Spherical Coordinates') + `</li><li>` + A(OS3 + '5-5-triple-integrals-in-cylindrical-and-spherical-coordinates', 'OpenStax Vol. 3 — 5.5 Triple Integrals in Cylindrical and Spherical Coordinates') + `</li><li>` + A(PN3 + 'TICylindricalCoords.aspx', "Paul's Online Notes — Triple Integrals in Cylindrical Coordinates") + `</li><li>` + A(PN3 + 'TISphericalCoords.aspx', "Paul's Online Notes — Triple Integrals in Spherical Coordinates") + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>∭ z dV over the cylinder r ≤ 1, 0 ≤ z ≤ 1.</li><li>∭<sub>B</sub> (x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup>) dV over the unit ball.</li><li>Convert the point with Cartesian coordinates (0, 2√3, −2) to spherical coordinates.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) ∫<sub>0</sub><sup>2π</sup>∫<sub>0</sub><sup>1</sup>∫<sub>0</sub><sup>1</sup> z r dz dr dθ = 2π · 1/2 · 1/2 = <b>π/2</b>. 2) ∫∫∫ ρ<sup>4</sup> sin φ = (1/5)(2π)(2) = <b>4π/5</b>. 3) ρ = √(0 + 12 + 4) = 4, cos φ = −2/4 ⇒ φ = 2π/3, θ = π/2 ⇒ <b>(4, π/2, 2π/3)</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 11 · Bài 11.2</span>
<h2>Tích phân bội ba trong toạ độ trụ và toạ độ cầu</h2>
<p class="lead">Toạ độ cực làm hình tròn trở nên dễ trong mặt phẳng. Trong không gian, <strong>toạ độ trụ</strong> (cực + chiều cao) làm hình trụ và paraboloid dễ, còn <strong>toạ độ cầu</strong> (khoảng cách + hai góc) làm hình cầu và hình nón dễ. Mỗi hệ có thừa số thể tích riêng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Đổi giữa toạ độ Descartes, trụ và cầu.</li><li>Dùng dV = r dz dr dθ và dV = ρ<sup>2</sup> sin φ dρ dθ dφ.</li><li>Chọn hệ toạ độ hợp với khối.</li></ul>
<h3>📖 Toạ độ trụ</h3>
<div class="formula"><span class="lbl">Toạ độ trụ (r, θ, z)</span>x = r cos θ, y = r sin θ, z = z;   x<sup>2</sup> + y<sup>2</sup> = r<sup>2</sup>;   <b>dV = r dz dr dθ</b></div>
<div class="callout"><p><b>Ví dụ 1.</b> Thể tích dưới z = 4 − x<sup>2</sup> − y<sup>2</sup> trên z = 0 (Bài 11.1, tự luyện 3). Dạng trụ 0 ≤ z ≤ 4 − r<sup>2</sup>, 0 ≤ r ≤ 2: V = ∫<sub>0</sub><sup>2π</sup>∫<sub>0</sub><sup>2</sup>∫<sub>0</sub><sup>4−r<sup>2</sup></sup> r dz dr dθ = 2π∫<sub>0</sub><sup>2</sup> (4r − r<sup>3</sup>) dr = 2π(8 − 4) = <b>8π</b>.</p>
<p><b>Ví dụ 2.</b> ∭ (x<sup>2</sup> + y<sup>2</sup>) dV trên hình trụ r ≤ 1, 0 ≤ z ≤ 2: ∫<sub>0</sub><sup>2π</sup>∫<sub>0</sub><sup>1</sup>∫<sub>0</sub><sup>2</sup> r<sup>2</sup> · r dz dr dθ = 2π · 2 · 1/4 = <b>π</b> (đây là mômen quán tính quanh trục Oz).</p></div>
<h3>📖 Toạ độ cầu</h3>
<p>ρ = khoảng cách tới gốc, θ = cùng góc như toạ độ cực, φ = góc tính từ chiều dương trục Oz xuống (0 ≤ φ ≤ π).</p>
<div class="formula"><span class="lbl">Toạ độ cầu (ρ, θ, φ)</span>x = ρ sin φ cos θ, y = ρ sin φ sin θ, z = ρ cos φ;   x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup> = ρ<sup>2</sup>;   <b>dV = ρ<sup>2</sup> sin φ dρ dθ dφ</b></div>
<p>“Hộp cầu” nhỏ có các cạnh dρ, ρ dφ và ρ sin φ dθ — vì thế có thừa số ρ<sup>2</sup> sin φ.</p>
<div class="callout"><p><b>Ví dụ 3 — thể tích hình cầu.</b> ∫<sub>0</sub><sup>π</sup>∫<sub>0</sub><sup>2π</sup>∫<sub>0</sub><sup>a</sup> ρ<sup>2</sup> sin φ dρ dθ dφ = (a<sup>3</sup>/3)(2π)(2) = <b>4πa<sup>3</sup>/3</b>.</p>
<p><b>Ví dụ 4.</b> ∭<sub>B</sub> e<sup>(x<sup>2</sup>+y<sup>2</sup>+z<sup>2</sup>)<sup>3/2</sup></sup> dV trên hình cầu đơn vị: ∫∫∫ e<sup>ρ<sup>3</sup></sup> ρ<sup>2</sup> sin φ dρ dθ dφ = (e − 1)/3 · 2π · 2 = <b>4π(e − 1)/3</b> — không thể làm trong toạ độ Descartes.</p>
<p><b>Ví dụ 5 — “kem ốc quế”.</b> Khối phía trên mặt nón z = √(x<sup>2</sup> + y<sup>2</sup>) (φ = π/4) và bên trong mặt cầu x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup> = z (ρ = cos φ): V = ∫<sub>0</sub><sup>π/4</sup>∫<sub>0</sub><sup>2π</sup>∫<sub>0</sub><sup>cos φ</sup> ρ<sup>2</sup> sin φ dρ dθ dφ = <b>π/8</b>.</p></div>
<div class="kv-grid"><div class="kv"><div class="k">Hình trụ, paraboloid z = f(x<sup>2</sup> + y<sup>2</sup>)</div><div class="v">toạ độ trụ</div></div><div class="kv"><div class="k">Hình cầu, hình nón, x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup></div><div class="v">toạ độ cầu</div></div><div class="kv"><div class="k">Hộp, mặt phẳng, tứ diện</div><div class="v">Descartes</div></div></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên r hoặc ρ<sup>2</sup> sin φ.</li><li>Cho φ chạy tới 2π (nó chỉ từ 0 đến π).</li><li>Lẫn vai trò θ và φ (quy ước khác nhau giữa các sách; vật lý thường đổi chỗ hai góc).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Trụ: dV = r dz dr dθ.</li><li>Cầu: dV = ρ<sup>2</sup> sin φ dρ dθ dφ, 0 ≤ φ ≤ π.</li><li>Chọn hệ trong đó các mặt biên thành “toạ độ = hằng số”.</li><li>Hình cầu: 4πa<sup>3</sup>/3; nón φ = π/4 với mặt cầu ρ = cos φ: π/8.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS3 + '2-7-cylindrical-and-spherical-coordinates', 'OpenStax Vol. 3 — 2.7 Toạ độ trụ và toạ độ cầu') + `</li><li>` + A(OS3 + '5-5-triple-integrals-in-cylindrical-and-spherical-coordinates', 'OpenStax Vol. 3 — 5.5 Tích phân bội ba trong toạ độ trụ và cầu') + `</li><li>` + A(PN3 + 'TICylindricalCoords.aspx', "Paul's Online Notes — Tích phân bội ba, toạ độ trụ") + `</li><li>` + A(PN3 + 'TISphericalCoords.aspx', "Paul's Online Notes — Tích phân bội ba, toạ độ cầu") + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>∭ z dV trên hình trụ r ≤ 1, 0 ≤ z ≤ 1.</li><li>∭<sub>B</sub> (x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup>) dV trên hình cầu đơn vị.</li><li>Đổi điểm có toạ độ Descartes (0, 2√3, −2) sang toạ độ cầu.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) ∫<sub>0</sub><sup>2π</sup>∫<sub>0</sub><sup>1</sup>∫<sub>0</sub><sup>1</sup> z r dz dr dθ = 2π · 1/2 · 1/2 = <b>π/2</b>. 2) ∫∫∫ ρ<sup>4</sup> sin φ = (1/5)(2π)(2) = <b>4π/5</b>. 3) ρ = √(0 + 12 + 4) = 4, cos φ = −2/4 ⇒ φ = 2π/3, θ = π/2 ⇒ <b>(4, π/2, 2π/3)</b>.</p></div>`);

const c113 = L('cal121-ts-11-3',
  '11.3 — Change of variables in multiple integrals: the Jacobian|||11.3 — Đổi biến trong tích phân bội: định thức Jacobian',
  'Phép biến đổi (u, v) → (x, y), Jacobian ∂(x,y)/∂(u,v), công thức dA = |J| du dv; kiểm lại hệ số r của toạ độ cực; diện tích elip πab; ví dụ ∬e^((x+y)/(x−y)) trên hình thang = (3/4)(e − 1/e).',
  `<span class="eyebrow">CAL121 · Chapter 11 · Lesson 11.3</span>
<h2>Change of variables: the Jacobian</h2>
<p class="lead">Where did the r in dA = r dr dθ and the ρ<sup>2</sup> sin φ in dV come from? Both are special cases of one rule: when you change variables, area (or volume) is stretched by the absolute value of a determinant — the <strong>Jacobian</strong>. This is the multivariable version of the substitution rule from CAL111.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute the Jacobian of a transformation.</li><li>Apply the change-of-variables formula for double integrals.</li><li>Choose a substitution that simplifies the region or the integrand.</li></ul>
<h3>📖 Lecture</h3>
<p>A transformation T(u, v) = (x(u, v), y(u, v)) maps a region S in the uv-plane onto a region R in the xy-plane. A tiny rectangle du × dv is mapped to an approximate parallelogram spanned by (x<sub>u</sub>, y<sub>u</sub>)du and (x<sub>v</sub>, y<sub>v</sub>)dv, whose area is the absolute value of a 2 × 2 determinant.</p>
<div class="formula"><span class="lbl">Jacobian and change of variables</span>∂(x, y)/∂(u, v) = det[ x<sub>u</sub> x<sub>v</sub> ; y<sub>u</sub> y<sub>v</sub> ] = x<sub>u</sub>y<sub>v</sub> − x<sub>v</sub>y<sub>u</sub><br>∬<sub>R</sub> f(x, y) dA = ∬<sub>S</sub> f(x(u, v), y(u, v)) |∂(x, y)/∂(u, v)| du dv</div>
<div class="callout"><p><b>Check — polar coordinates.</b> x = r cos θ, y = r sin θ: J = cos θ · r cos θ − (−r sin θ) · sin θ = r. That is the r of Lesson 10.3. In 3D the same computation with a 3 × 3 determinant gives ρ<sup>2</sup> sin φ for spherical coordinates.</p></div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — area of an ellipse.</b> x<sup>2</sup>/a<sup>2</sup> + y<sup>2</sup>/b<sup>2</sup> ≤ 1. Let x = au, y = bv: the ellipse becomes the unit disk u<sup>2</sup> + v<sup>2</sup> ≤ 1 and J = ab. Area = ∬ ab du dv = ab · π = <b>πab</b>.</p></div>
<div class="callout"><p><b>Example 2.</b> ∬<sub>R</sub> e<sup>(x+y)/(x−y)</sup> dA, R = trapezoid with vertices (1, 0), (2, 0), (0, −2), (0, −1).</p>
<p>Step 1 — choose u = x + y, v = x − y (the exponent becomes u/v). Then x = (u + v)/2, y = (u − v)/2 and J = (1/2)(−1/2) − (1/2)(1/2) = −1/2, |J| = 1/2.</p>
<p>Step 2 — the region: the sides x − y = 1 and x − y = 2 become v = 1, v = 2; the sides x = 0 and y = 0 become u = −v and u = v. So S: 1 ≤ v ≤ 2, −v ≤ u ≤ v.</p>
<p>Step 3: ∫<sub>1</sub><sup>2</sup>∫<sub>−v</sub><sup>v</sup> e<sup>u/v</sup> (1/2) du dv = (1/2)∫<sub>1</sub><sup>2</sup> v(e − e<sup>−1</sup>) dv = <b>(3/4)(e − e<sup>−1</sup>) ≈ 1.7628</b>.</p></div>
<p><b>How to choose u, v.</b> Look at the boundary lines (x + y = const, x − y = const, xy = const…) or at the awkward part of the integrand, and make those expressions the new variables. If you know u, v in terms of x, y, it is often easier to compute ∂(u, v)/∂(x, y) and take its reciprocal.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the <strong>absolute value</strong> of the Jacobian.</li><li>Using ∂(u, v)/∂(x, y) where ∂(x, y)/∂(u, v) is needed (they are reciprocals).</li><li>Transforming the integrand but not the region (or vice versa).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>J = ∂(x, y)/∂(u, v) = x<sub>u</sub>y<sub>v</sub> − x<sub>v</sub>y<sub>u</sub>; dA = |J| du dv.</li><li>Polar: J = r; spherical: ρ<sup>2</sup> sin φ.</li><li>Ellipse area πab by x = au, y = bv.</li><li>Pick u, v to straighten the boundary or simplify the integrand.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS3 + '5-7-change-of-variables-in-multiple-integrals', 'OpenStax Vol. 3 — 5.7 Change of Variables in Multiple Integrals') + `</li><li>` + A(PN3 + 'ChangeOfVariables.aspx', "Paul's Online Notes — Change of Variables") + `</li><li>` + A('https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/3.-double-integrals-and-line-integrals-in-the-plane/', 'MIT OCW 18.02SC — Unit 3, Part A (change of variables)') + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>Jacobian of x = 2u + v, y = u − 3v.</li><li>Use u = x + y, v = x − y to evaluate ∬<sub>R</sub> (x + y)<sup>2</sup> dA over the square 0 ≤ x + y ≤ 1, 0 ≤ x − y ≤ 1.</li><li>Area of the ellipse x<sup>2</sup>/9 + y<sup>2</sup>/4 ≤ 1.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) J = 2(−3) − 1 · 1 = <b>−7</b>, so dA = 7 du dv. 2) |J| = 1/2: ∫<sub>0</sub><sup>1</sup>∫<sub>0</sub><sup>1</sup> u<sup>2</sup>/2 du dv = <b>1/6</b>. 3) a = 3, b = 2 ⇒ <b>6π</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 11 · Bài 11.3</span>
<h2>Đổi biến: định thức Jacobian</h2>
<p class="lead">Chữ r trong dA = r dr dθ và ρ<sup>2</sup> sin φ trong dV từ đâu ra? Cả hai là trường hợp riêng của một quy tắc: khi đổi biến, diện tích (hay thể tích) bị kéo giãn theo giá trị tuyệt đối của một định thức — <strong>Jacobian</strong>. Đây là phiên bản nhiều biến của phép đổi biến ở CAL111.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính Jacobian của một phép biến đổi.</li><li>Áp dụng công thức đổi biến cho tích phân kép.</li><li>Chọn phép thế làm đơn giản miền hoặc hàm dưới dấu tích phân.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Phép biến đổi T(u, v) = (x(u, v), y(u, v)) biến miền S trong mặt phẳng uv thành miền R trong mặt phẳng xy. Một hình chữ nhật nhỏ du × dv bị biến thành gần như hình bình hành dựng trên (x<sub>u</sub>, y<sub>u</sub>)du và (x<sub>v</sub>, y<sub>v</sub>)dv, có diện tích bằng giá trị tuyệt đối của một định thức 2 × 2.</p>
<div class="formula"><span class="lbl">Jacobian và đổi biến</span>∂(x, y)/∂(u, v) = det[ x<sub>u</sub> x<sub>v</sub> ; y<sub>u</sub> y<sub>v</sub> ] = x<sub>u</sub>y<sub>v</sub> − x<sub>v</sub>y<sub>u</sub><br>∬<sub>R</sub> f(x, y) dA = ∬<sub>S</sub> f(x(u, v), y(u, v)) |∂(x, y)/∂(u, v)| du dv</div>
<div class="callout"><p><b>Kiểm — toạ độ cực.</b> x = r cos θ, y = r sin θ: J = cos θ · r cos θ − (−r sin θ) · sin θ = r. Chính là r ở Bài 10.3. Trong 3D cùng phép tính với định thức 3 × 3 cho ρ<sup>2</sup> sin φ của toạ độ cầu.</p></div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — diện tích elip.</b> x<sup>2</sup>/a<sup>2</sup> + y<sup>2</sup>/b<sup>2</sup> ≤ 1. Đặt x = au, y = bv: elip thành hình tròn đơn vị u<sup>2</sup> + v<sup>2</sup> ≤ 1 và J = ab. Diện tích = ∬ ab du dv = ab · π = <b>πab</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2.</b> ∬<sub>R</sub> e<sup>(x+y)/(x−y)</sup> dA, R = hình thang đỉnh (1, 0), (2, 0), (0, −2), (0, −1).</p>
<p>Bước 1 — chọn u = x + y, v = x − y (số mũ thành u/v). Khi đó x = (u + v)/2, y = (u − v)/2 và J = (1/2)(−1/2) − (1/2)(1/2) = −1/2, |J| = 1/2.</p>
<p>Bước 2 — miền: các cạnh x − y = 1 và x − y = 2 thành v = 1, v = 2; các cạnh x = 0 và y = 0 thành u = −v và u = v. Vậy S: 1 ≤ v ≤ 2, −v ≤ u ≤ v.</p>
<p>Bước 3: ∫<sub>1</sub><sup>2</sup>∫<sub>−v</sub><sup>v</sup> e<sup>u/v</sup> (1/2) du dv = (1/2)∫<sub>1</sub><sup>2</sup> v(e − e<sup>−1</sup>) dv = <b>(3/4)(e − e<sup>−1</sup>) ≈ 1,7628</b>.</p></div>
<p><b>Chọn u, v thế nào.</b> Nhìn các đường biên (x + y = hằng, x − y = hằng, xy = hằng…) hoặc phần “khó” của hàm, rồi lấy chính các biểu thức đó làm biến mới. Nếu biết u, v theo x, y, thường dễ hơn khi tính ∂(u, v)/∂(x, y) rồi lấy nghịch đảo.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên <strong>giá trị tuyệt đối</strong> của Jacobian.</li><li>Dùng ∂(u, v)/∂(x, y) chỗ cần ∂(x, y)/∂(u, v) (chúng nghịch đảo nhau).</li><li>Đổi hàm mà không đổi miền (hoặc ngược lại).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>J = ∂(x, y)/∂(u, v) = x<sub>u</sub>y<sub>v</sub> − x<sub>v</sub>y<sub>u</sub>; dA = |J| du dv.</li><li>Cực: J = r; cầu: ρ<sup>2</sup> sin φ.</li><li>Diện tích elip πab bằng x = au, y = bv.</li><li>Chọn u, v để làm thẳng biên hoặc đơn giản hàm.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS3 + '5-7-change-of-variables-in-multiple-integrals', 'OpenStax Vol. 3 — 5.7 Đổi biến trong tích phân bội') + `</li><li>` + A(PN3 + 'ChangeOfVariables.aspx', "Paul's Online Notes — Change of Variables") + `</li><li>` + A('https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/3.-double-integrals-and-line-integrals-in-the-plane/', 'MIT OCW 18.02SC — Unit 3, Part A (đổi biến)') + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Jacobian của x = 2u + v, y = u − 3v.</li><li>Dùng u = x + y, v = x − y để tính ∬<sub>R</sub> (x + y)<sup>2</sup> dA trên hình vuông 0 ≤ x + y ≤ 1, 0 ≤ x − y ≤ 1.</li><li>Diện tích elip x<sup>2</sup>/9 + y<sup>2</sup>/4 ≤ 1.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) J = 2(−3) − 1 · 1 = <b>−7</b>, nên dA = 7 du dv. 2) |J| = 1/2: ∫<sub>0</sub><sup>1</sup>∫<sub>0</sub><sup>1</sup> u<sup>2</sup>/2 du dv = <b>1/6</b>. 3) a = 3, b = 2 ⇒ <b>6π</b>.</p></div>`);

const q11 = QZ(11, 'Quiz — Chapter 11: Triple integrals and change of variables|||Quiz — Chương 11: Tích phân bội ba và đổi biến', 'Kiểm tra chương 11: tích phân bội ba trên hộp và miền tổng quát, toạ độ trụ, toạ độ cầu, Jacobian.', [
  Q('q1', '∭ xyz² dV over [0,1] × [−1,2] × [0,3] =|||∭ xyz² dV trên [0,1] × [−1,2] × [0,3] =',
    ['9/4|||9/4', '27/4|||27/4', '27/2|||27/2', '9|||9'], 1,
    '(1/2)(3/2)(9).|||(1/2)(3/2)(9).'),
  Q('q2', 'Volume of the tetrahedron x, y, z ≥ 0, x + y + z ≤ 1:|||Thể tích tứ diện x, y, z ≥ 0, x + y + z ≤ 1:',
    ['1/2|||1/2', '1/3|||1/3', '1/6|||1/6', '1/24|||1/24'], 2,
    '∫∫∫ dz dy dx with z ≤ 1 − x − y.|||∫∫∫ dz dy dx với z ≤ 1 − x − y.'),
  Q('q3', 'In cylindrical coordinates dV =|||Trong toạ độ trụ dV =',
    ['dz dr dθ|||dz dr dθ', 'r dz dr dθ|||r dz dr dθ', 'r² dz dr dθ|||r² dz dr dθ', 'ρ² sin φ dρ dθ dφ|||ρ² sin φ dρ dθ dφ'], 1,
    'Polar area r dr dθ times dz.|||Diện tích cực r dr dθ nhân dz.'),
  Q('q4', 'Volume under z = 4 − x² − y² above z = 0:|||Thể tích dưới z = 4 − x² − y² trên z = 0:',
    ['4π|||4π', '8π|||8π', '16π|||16π', '32π/3|||32π/3'], 1,
    '2π∫₀² (4 − r²) r dr = 2π · 4.|||2π∫₀² (4 − r²) r dr = 2π · 4.'),
  Q('q5', 'In spherical coordinates dV =|||Trong toạ độ cầu dV =',
    ['ρ dρ dθ dφ|||ρ dρ dθ dφ', 'ρ² dρ dθ dφ|||ρ² dρ dθ dφ', 'ρ² sin φ dρ dθ dφ|||ρ² sin φ dρ dθ dφ', 'ρ sin φ dρ dθ dφ|||ρ sin φ dρ dθ dφ'], 2,
    'Box with sides dρ, ρ dφ, ρ sin φ dθ.|||Hộp cạnh dρ, ρ dφ, ρ sin φ dθ.'),
  Q('q6', 'In spherical coordinates the angle φ ranges over|||Trong toạ độ cầu góc φ chạy trong',
    ['[0, 2π]|||[0, 2π]', '[0, π]|||[0, π]', '[−π/2, π/2]|||[−π/2, π/2]', '[0, π/2]|||[0, π/2]'], 1,
    'φ is measured down from the positive z-axis.|||φ đo từ chiều dương trục Oz xuống.'),
  Q('q7', 'Volume above z = √(x² + y²) and inside x² + y² + z² = z:|||Thể tích trên z = √(x² + y²) và trong x² + y² + z² = z:',
    ['π/4|||π/4', 'π/8|||π/8', 'π/6|||π/6', 'π/3|||π/3'], 1,
    'φ ≤ π/4, ρ ≤ cos φ.|||φ ≤ π/4, ρ ≤ cos φ.'),
  Q('q8', 'The Jacobian ∂(x, y)/∂(r, θ) for polar coordinates is|||Jacobian ∂(x, y)/∂(r, θ) của toạ độ cực là',
    ['1|||1', 'r|||r', 'r²|||r²', 'cos θ|||cos θ'], 1,
    'cos θ · r cos θ + r sin θ · sin θ = r.|||cos θ · r cos θ + r sin θ · sin θ = r.'),
  Q('q9', 'Area of the ellipse x²/a² + y²/b² ≤ 1:|||Diện tích elip x²/a² + y²/b² ≤ 1:',
    ['πab|||πab', 'π(a + b)|||π(a + b)', '2πab|||2πab', 'πa²b²|||πa²b²'], 0,
    'x = au, y = bv, Jacobian ab, unit disk area π.|||x = au, y = bv, Jacobian ab, hình tròn đơn vị diện tích π.'),
  Q('q10', 'With u = x + y, v = x − y, the area factor |∂(x, y)/∂(u, v)| is|||Với u = x + y, v = x − y, hệ số diện tích |∂(x, y)/∂(u, v)| là',
    ['2|||2', '1/2|||1/2', '1|||1', '−2|||−2'], 1,
    '∂(u, v)/∂(x, y) = −2, and the reciprocal has absolute value 1/2.|||∂(u, v)/∂(x, y) = −2, nghịch đảo có trị tuyệt đối 1/2.'),
]);

const ch11 = {
  title: 'Chapter 11 — Triple integrals, cylindrical and spherical coordinates, change of variables|||Chương 11 — Tích phân bội ba, toạ độ trụ – cầu và đổi biến',
  description: 'Tích phân bội ba trên hộp và miền tổng quát, toạ độ trụ (r dz dr dθ) và cầu (ρ² sinφ), định thức Jacobian và công thức đổi biến (Stewart 15.6–15.9 · OpenStax Vol.3 2.7, 5.4–5.7).',
  lessons: [c111, c112, c113, q11],
};

// ───────────────────────────── Chương 12 — Mở đầu giải tích vectơ ─────────────────────────────
const c121 = L('cal121-ts-12-1',
  '12.1 — Vector fields and line integrals|||12.1 — Trường vectơ và tích phân đường',
  'Trường vectơ (gió, dòng chảy, trường gradient), tích phân đường của hàm vô hướng ∫f ds (khối lượng dây), của trường vectơ ∫F·dr (công), tham số hoá đường cong, phụ thuộc chiều; ví dụ ∫(2 + x²y)ds = 2π + 2/3, ∫F·dr = −2/3.',
  `<span class="eyebrow">CAL121 · Chapter 12 · Lesson 12.1</span>
<h2>Vector fields and line integrals</h2>
<p class="lead">A weather map with an arrow at every point, the flow of water in a pipe, a force field around a magnet — each assigns a <strong>vector</strong> to every point: a vector field. Integrating along a curve through such a field gives the <strong>work</strong> done moving along it. This is the starting point of vector calculus (Stewart ch. 16).</p>
<h3>🎯 Objectives</h3>
<ul><li>Describe and sketch vector fields; recognise gradient fields.</li><li>Evaluate line integrals of scalar functions with respect to arc length.</li><li>Evaluate line integrals of vector fields (work) and understand orientation.</li></ul>
<h3>📖 Vector fields</h3>
<p>A vector field on ℝ<sup>2</sup> is a function F(x, y) = ⟨P(x, y), Q(x, y)⟩. Examples: F = ⟨−y, x⟩ rotates counter-clockwise around the origin (like a whirlpool); F = ⟨x, y⟩ points straight outward. The <strong>gradient field</strong> ∇f of a function f (Lesson 8.4) is the most important kind: it points uphill and is perpendicular to the level curves of f.</p>
<h3>📖 Line integrals</h3>
<p>Parametrise the curve C by r(t) = ⟨x(t), y(t)⟩, a ≤ t ≤ b. Then ds = |r′(t)| dt (arc length, Lesson 3.1) and dr = r′(t) dt.</p>
<div class="formula"><span class="lbl">Line integrals</span>scalar: ∫<sub>C</sub> f ds = ∫<sub>a</sub><sup>b</sup> f(r(t)) |r′(t)| dt   (mass of a wire with density f)<br>vector: ∫<sub>C</sub> F · dr = ∫<sub>a</sub><sup>b</sup> F(r(t)) · r′(t) dt = ∫<sub>C</sub> P dx + Q dy   (work done by F along C)</div>
<p>The scalar integral does not depend on direction. The vector integral changes sign if C is traversed the other way: ∫<sub>−C</sub> F · dr = −∫<sub>C</sub> F · dr.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — scalar.</b> ∫<sub>C</sub> (2 + x<sup>2</sup>y) ds, C = upper half of the unit circle. r(t) = ⟨cos t, sin t⟩, 0 ≤ t ≤ π, |r′| = 1. ∫<sub>0</sub><sup>π</sup> (2 + cos<sup>2</sup>t sin t) dt = 2π + [−cos<sup>3</sup>t/3]<sub>0</sub><sup>π</sup> = <b>2π + 2/3</b>.</p></div>
<div class="callout"><p><b>Example 2 — work.</b> F = ⟨x<sup>2</sup>, −xy⟩ along the quarter circle r(t) = ⟨cos t, sin t⟩, 0 ≤ t ≤ π/2. F(r(t)) · r′(t) = cos<sup>2</sup>t(−sin t) + (−cos t sin t)(cos t) = −2cos<sup>2</sup>t sin t. W = ∫<sub>0</sub><sup>π/2</sup> −2cos<sup>2</sup>t sin t dt = <b>−2/3</b> (the field works against the motion).</p></div>
<div class="callout"><p><b>Example 3 — a rotating field.</b> F = ⟨−y, x⟩ around the unit circle counter-clockwise: F · r′ = sin<sup>2</sup>t + cos<sup>2</sup>t = 1, so ∮ F · dr = <b>2π</b>. The field pushes you all the way round — a closed loop with non-zero work. Keep this in mind for Lesson 12.2.</p></div>
<div class="callout"><p><b>Example 4.</b> F = ⟨y, x⟩ along y = x<sup>2</sup> from (0, 0) to (1, 1): r = ⟨t, t<sup>2</sup>⟩, ∫ (t<sup>2</sup> · 1 + t · 2t) dt = ∫<sub>0</sub><sup>1</sup> 3t<sup>2</sup> dt = <b>1</b>. (Along the straight line y = x you also get 1 — Lesson 12.2 explains why.)</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting |r′(t)| in a scalar line integral (or adding it to a vector one).</li><li>Parametrising the curve in the wrong direction for a work integral.</li><li>Not substituting x(t), y(t) into F before taking the dot product.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>F = ⟨P, Q⟩ assigns a vector to each point; gradient fields ∇f are special.</li><li>∫ f ds = ∫ f(r(t))|r′(t)| dt (direction-free).</li><li>∫ F · dr = ∫ F(r(t)) · r′(t) dt = work (direction matters).</li><li>⟨−y, x⟩ does work 2π around the unit circle.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS3 + '6-1-vector-fields', 'OpenStax Vol. 3 — 6.1 Vector Fields') + `</li><li>` + A(OS3 + '6-2-line-integrals', 'OpenStax Vol. 3 — 6.2 Line Integrals') + `</li><li>` + A(PN3 + 'VectorFields.aspx', "Paul's Online Notes — Vector Fields") + `</li><li>` + A(PN3 + 'LineIntegralsVectorFields.aspx', "Paul's Online Notes — Line Integrals of Vector Fields") + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>∫<sub>C</sub> y ds, C the segment from (0, 0) to (3, 4).</li><li>Work done by F = ⟨y, −x⟩ once around the unit circle counter-clockwise.</li><li>∫<sub>C</sub> x dy − y dx along r(t) = ⟨2cos t, 2sin t⟩, 0 ≤ t ≤ 2π.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) r = ⟨3t, 4t⟩, |r′| = 5: ∫<sub>0</sub><sup>1</sup> 4t · 5 dt = <b>10</b>. 2) F · r′ = sin t(−sin t) − cos t cos t = −1 ⇒ <b>−2π</b>. 3) x dy − y dx = (4cos<sup>2</sup>t + 4sin<sup>2</sup>t) dt ⇒ <b>8π</b> (twice the area of the disk — see Green's theorem, Lesson 12.3).</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 12 · Bài 12.1</span>
<h2>Trường vectơ và tích phân đường</h2>
<p class="lead">Bản đồ thời tiết có mũi tên ở mỗi điểm, dòng nước trong ống, trường lực quanh nam châm — mỗi thứ gán một <strong>vectơ</strong> cho mỗi điểm: một trường vectơ. Lấy tích phân dọc một đường cong đi qua trường như vậy cho <strong>công</strong> thực hiện khi di chuyển dọc đường đó. Đây là điểm khởi đầu của giải tích vectơ (Stewart ch. 16).</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mô tả và phác hoạ trường vectơ; nhận ra trường gradient.</li><li>Tính tích phân đường của hàm vô hướng theo độ dài cung.</li><li>Tính tích phân đường của trường vectơ (công) và hiểu chiều của đường.</li></ul>
<h3>📖 Trường vectơ</h3>
<p>Trường vectơ trên ℝ<sup>2</sup> là hàm F(x, y) = ⟨P(x, y), Q(x, y)⟩. Ví dụ: F = ⟨−y, x⟩ xoay ngược chiều kim đồng hồ quanh gốc (như xoáy nước); F = ⟨x, y⟩ chỉ thẳng ra ngoài. <strong>Trường gradient</strong> ∇f của một hàm f (Bài 8.4) là loại quan trọng nhất: nó chỉ lên dốc và vuông góc với đường mức của f.</p>
<h3>📖 Tích phân đường</h3>
<p>Tham số hoá đường C bởi r(t) = ⟨x(t), y(t)⟩, a ≤ t ≤ b. Khi đó ds = |r′(t)| dt (độ dài cung, Bài 3.1) và dr = r′(t) dt.</p>
<div class="formula"><span class="lbl">Tích phân đường</span>vô hướng: ∫<sub>C</sub> f ds = ∫<sub>a</sub><sup>b</sup> f(r(t)) |r′(t)| dt   (khối lượng sợi dây mật độ f)<br>vectơ: ∫<sub>C</sub> F · dr = ∫<sub>a</sub><sup>b</sup> F(r(t)) · r′(t) dt = ∫<sub>C</sub> P dx + Q dy   (công của F dọc C)</div>
<p>Tích phân vô hướng không phụ thuộc chiều. Tích phân vectơ đổi dấu nếu đi C theo chiều ngược lại: ∫<sub>−C</sub> F · dr = −∫<sub>C</sub> F · dr.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — vô hướng.</b> ∫<sub>C</sub> (2 + x<sup>2</sup>y) ds, C = nửa trên đường tròn đơn vị. r(t) = ⟨cos t, sin t⟩, 0 ≤ t ≤ π, |r′| = 1. ∫<sub>0</sub><sup>π</sup> (2 + cos<sup>2</sup>t sin t) dt = 2π + [−cos<sup>3</sup>t/3]<sub>0</sub><sup>π</sup> = <b>2π + 2/3</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — công.</b> F = ⟨x<sup>2</sup>, −xy⟩ dọc một phần tư đường tròn r(t) = ⟨cos t, sin t⟩, 0 ≤ t ≤ π/2. F(r(t)) · r′(t) = cos<sup>2</sup>t(−sin t) + (−cos t sin t)(cos t) = −2cos<sup>2</sup>t sin t. W = ∫<sub>0</sub><sup>π/2</sup> −2cos<sup>2</sup>t sin t dt = <b>−2/3</b> (trường cản chuyển động).</p></div>
<div class="callout"><p><b>Ví dụ 3 — trường xoay.</b> F = ⟨−y, x⟩ quanh đường tròn đơn vị ngược chiều kim đồng hồ: F · r′ = sin<sup>2</sup>t + cos<sup>2</sup>t = 1, nên ∮ F · dr = <b>2π</b>. Trường đẩy bạn suốt vòng — một đường kín có công khác 0. Nhớ điều này cho Bài 12.2.</p></div>
<div class="callout"><p><b>Ví dụ 4.</b> F = ⟨y, x⟩ dọc y = x<sup>2</sup> từ (0, 0) đến (1, 1): r = ⟨t, t<sup>2</sup>⟩, ∫ (t<sup>2</sup> · 1 + t · 2t) dt = ∫<sub>0</sub><sup>1</sup> 3t<sup>2</sup> dt = <b>1</b>. (Đi theo đường thẳng y = x cũng được 1 — Bài 12.2 giải thích vì sao.)</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên |r′(t)| trong tích phân đường vô hướng (hoặc thêm nó vào tích phân vectơ).</li><li>Tham số hoá sai chiều cho tích phân công.</li><li>Không thế x(t), y(t) vào F trước khi lấy tích vô hướng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>F = ⟨P, Q⟩ gán vectơ cho mỗi điểm; trường gradient ∇f là loại đặc biệt.</li><li>∫ f ds = ∫ f(r(t))|r′(t)| dt (không phụ thuộc chiều).</li><li>∫ F · dr = ∫ F(r(t)) · r′(t) dt = công (chiều quan trọng).</li><li>⟨−y, x⟩ sinh công 2π quanh đường tròn đơn vị.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS3 + '6-1-vector-fields', 'OpenStax Vol. 3 — 6.1 Trường vectơ') + `</li><li>` + A(OS3 + '6-2-line-integrals', 'OpenStax Vol. 3 — 6.2 Tích phân đường') + `</li><li>` + A(PN3 + 'VectorFields.aspx', "Paul's Online Notes — Trường vectơ") + `</li><li>` + A(PN3 + 'LineIntegralsVectorFields.aspx', "Paul's Online Notes — Tích phân đường của trường vectơ") + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>∫<sub>C</sub> y ds, C là đoạn từ (0, 0) đến (3, 4).</li><li>Công của F = ⟨y, −x⟩ khi đi một vòng đường tròn đơn vị ngược chiều kim đồng hồ.</li><li>∫<sub>C</sub> x dy − y dx dọc r(t) = ⟨2cos t, 2sin t⟩, 0 ≤ t ≤ 2π.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) r = ⟨3t, 4t⟩, |r′| = 5: ∫<sub>0</sub><sup>1</sup> 4t · 5 dt = <b>10</b>. 2) F · r′ = sin t(−sin t) − cos t cos t = −1 ⇒ <b>−2π</b>. 3) x dy − y dx = (4cos<sup>2</sup>t + 4sin<sup>2</sup>t) dt ⇒ <b>8π</b> (gấp đôi diện tích hình tròn — xem định lý Green, Bài 12.3).</p></div>`);

const c122 = L('cal121-ts-12-2',
  '12.2 — Conservative fields and the Fundamental Theorem for line integrals|||12.2 — Trường bảo toàn và định lý cơ bản cho tích phân đường',
  '∫∇f·dr = f(B) − f(A), độc lập đường đi, vòng kín cho 0; kiểm tra P_y = Q_x trên miền đơn liên, tìm hàm thế f; ví dụ F = ⟨3+2xy, x²−3y²⟩ cho e^(3π)+1; phản ví dụ ⟨−y, x⟩/(x²+y²).',
  `<span class="eyebrow">CAL121 · Chapter 12 · Lesson 12.2</span>
<h2>Conservative fields and the Fundamental Theorem for line integrals</h2>
<p class="lead">In CAL111, ∫<sub>a</sub><sup>b</sup> F′(x) dx = F(b) − F(a): only the endpoints matter. The same is true for line integrals of <strong>gradient fields</strong>. Gravity and electrostatic forces are such fields, which is why “potential energy” makes sense in physics.</p>
<h3>🎯 Objectives</h3>
<ul><li>State and use the Fundamental Theorem for line integrals.</li><li>Test whether a planar field is conservative.</li><li>Find a potential function and use it to evaluate line integrals.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Fundamental Theorem for line integrals</span>If C goes from A to B and f has continuous gradient, then ∫<sub>C</sub> ∇f · dr = f(B) − f(A).</div>
<p>F is <strong>conservative</strong> if F = ∇f for some <strong>potential</strong> f. Then: the integral is <strong>independent of path</strong>, and ∮ F · dr = 0 around every closed curve.</p>
<div class="formula"><span class="lbl">Test (in the plane)</span>F = ⟨P, Q⟩ with continuous first partials on an open <strong>simply connected</strong> region (no holes): F is conservative ⇔ ∂P/∂y = ∂Q/∂x.</div>
<p>Necessity comes from Clairaut's theorem: if P = f<sub>x</sub>, Q = f<sub>y</sub> then P<sub>y</sub> = f<sub>xy</sub> = f<sub>yx</sub> = Q<sub>x</sub>.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — find a potential.</b> F = ⟨3 + 2xy, x<sup>2</sup> − 3y<sup>2</sup>⟩. Test: P<sub>y</sub> = 2x = Q<sub>x</sub> ✓ on all of ℝ<sup>2</sup>.</p>
<p>Step 1: f<sub>x</sub> = 3 + 2xy ⇒ f = 3x + x<sup>2</sup>y + g(y). Step 2: f<sub>y</sub> = x<sup>2</sup> + g′(y) must equal x<sup>2</sup> − 3y<sup>2</sup> ⇒ g′ = −3y<sup>2</sup>, g = −y<sup>3</sup>. So <b>f = 3x + x<sup>2</sup>y − y<sup>3</sup></b> (+ any constant).</p>
<p>Step 3: along r(t) = ⟨e<sup>t</sup> sin t, e<sup>t</sup> cos t⟩, 0 ≤ t ≤ π, from r(0) = (0, 1) to r(π) = (0, −e<sup>π</sup>): ∫ F · dr = f(0, −e<sup>π</sup>) − f(0, 1) = e<sup>3π</sup> − (−1) = <b>e<sup>3π</sup> + 1</b> — no parametrised integral needed.</p></div>
<div class="callout"><p><b>Example 2.</b> F = ⟨y, x⟩ = ∇(xy). From (0, 0) to (1, 1) the integral is 1 · 1 − 0 = <b>1</b> along any path — explaining Lesson 12.1, Example 4.</p></div>
<div class="callout"><p><b>Example 3 — not conservative.</b> F = ⟨−y, x⟩: P<sub>y</sub> = −1 ≠ 1 = Q<sub>x</sub>, and indeed ∮ = 2π ≠ 0 around the unit circle.</p>
<p><b>Example 4 — why “no holes” matters.</b> F = ⟨−y/(x<sup>2</sup> + y<sup>2</sup>), x/(x<sup>2</sup> + y<sup>2</sup>)⟩ satisfies P<sub>y</sub> = Q<sub>x</sub> everywhere except the origin, yet its integral around the unit circle is 2π. The region ℝ<sup>2</sup> minus the origin has a hole, so the test does not apply.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the “function of y” g(y) when integrating f<sub>x</sub> with respect to x.</li><li>Applying the test on a region with a hole.</li><li>Using f(A) − f(B) instead of f(B) − f(A).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>∫<sub>C</sub> ∇f · dr = f(end) − f(start).</li><li>Conservative ⇔ path-independent ⇔ closed loops give 0.</li><li>Test P<sub>y</sub> = Q<sub>x</sub> on a simply connected region.</li><li>Find f by integrating P in x, then fixing g(y) with Q.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS3 + '6-3-conservative-vector-fields', 'OpenStax Vol. 3 — 6.3 Conservative Vector Fields') + `</li><li>` + A(PN3 + 'FundThmLineIntegrals.aspx', "Paul's Online Notes — Fundamental Theorem for Line Integrals") + `</li><li>` + A(PN3 + 'ConservativeVectorField.aspx', "Paul's Online Notes — Conservative Vector Fields") + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>Is F = ⟨2xy, x<sup>2</sup> + e<sup>y</sup>⟩ conservative? If so find f.</li><li>Use your f to compute ∫ F · dr from (0, 0) to (1, 1) along any path.</li><li>Is F = ⟨x<sup>2</sup>y, xy<sup>2</sup>⟩ conservative?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) P<sub>y</sub> = 2x = Q<sub>x</sub> ✓; <b>f = x<sup>2</sup>y + e<sup>y</sup></b>. 2) f(1, 1) − f(0, 0) = (1 + e) − 1 = <b>e</b>. 3) P<sub>y</sub> = x<sup>2</sup>, Q<sub>x</sub> = y<sup>2</sup> — not equal ⇒ <b>no</b>.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 12 · Bài 12.2</span>
<h2>Trường bảo toàn và định lý cơ bản cho tích phân đường</h2>
<p class="lead">Ở CAL111, ∫<sub>a</sub><sup>b</sup> F′(x) dx = F(b) − F(a): chỉ hai đầu mút là quan trọng. Điều đó cũng đúng cho tích phân đường của <strong>trường gradient</strong>. Trọng lực và lực tĩnh điện là những trường như vậy — vì thế “thế năng” có nghĩa trong vật lý.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu và dùng định lý cơ bản cho tích phân đường.</li><li>Kiểm một trường phẳng có bảo toàn không.</li><li>Tìm hàm thế và dùng nó tính tích phân đường.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Định lý cơ bản cho tích phân đường</span>Nếu C đi từ A tới B và f có gradient liên tục thì ∫<sub>C</sub> ∇f · dr = f(B) − f(A).</div>
<p>F là trường <strong>bảo toàn</strong> nếu F = ∇f với một <strong>hàm thế</strong> f nào đó. Khi đó: tích phân <strong>không phụ thuộc đường đi</strong>, và ∮ F · dr = 0 trên mọi đường cong kín.</p>
<div class="formula"><span class="lbl">Phép thử (trong mặt phẳng)</span>F = ⟨P, Q⟩ có đạo hàm riêng cấp một liên tục trên một miền mở <strong>đơn liên</strong> (không có lỗ): F bảo toàn ⇔ ∂P/∂y = ∂Q/∂x.</div>
<p>Chiều cần suy ra từ định lý Clairaut: nếu P = f<sub>x</sub>, Q = f<sub>y</sub> thì P<sub>y</sub> = f<sub>xy</sub> = f<sub>yx</sub> = Q<sub>x</sub>.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — tìm hàm thế.</b> F = ⟨3 + 2xy, x<sup>2</sup> − 3y<sup>2</sup>⟩. Thử: P<sub>y</sub> = 2x = Q<sub>x</sub> ✓ trên toàn ℝ<sup>2</sup>.</p>
<p>Bước 1: f<sub>x</sub> = 3 + 2xy ⇒ f = 3x + x<sup>2</sup>y + g(y). Bước 2: f<sub>y</sub> = x<sup>2</sup> + g′(y) phải bằng x<sup>2</sup> − 3y<sup>2</sup> ⇒ g′ = −3y<sup>2</sup>, g = −y<sup>3</sup>. Vậy <b>f = 3x + x<sup>2</sup>y − y<sup>3</sup></b> (+ hằng số bất kỳ).</p>
<p>Bước 3: dọc r(t) = ⟨e<sup>t</sup> sin t, e<sup>t</sup> cos t⟩, 0 ≤ t ≤ π, từ r(0) = (0, 1) tới r(π) = (0, −e<sup>π</sup>): ∫ F · dr = f(0, −e<sup>π</sup>) − f(0, 1) = e<sup>3π</sup> − (−1) = <b>e<sup>3π</sup> + 1</b> — không cần tính tích phân theo tham số.</p></div>
<div class="callout"><p><b>Ví dụ 2.</b> F = ⟨y, x⟩ = ∇(xy). Từ (0, 0) tới (1, 1) tích phân bằng 1 · 1 − 0 = <b>1</b> theo mọi đường — giải thích Bài 12.1, Ví dụ 4.</p></div>
<div class="callout"><p><b>Ví dụ 3 — không bảo toàn.</b> F = ⟨−y, x⟩: P<sub>y</sub> = −1 ≠ 1 = Q<sub>x</sub>, và đúng là ∮ = 2π ≠ 0 quanh đường tròn đơn vị.</p>
<p><b>Ví dụ 4 — vì sao “không có lỗ” quan trọng.</b> F = ⟨−y/(x<sup>2</sup> + y<sup>2</sup>), x/(x<sup>2</sup> + y<sup>2</sup>)⟩ thoả P<sub>y</sub> = Q<sub>x</sub> ở mọi nơi trừ gốc, nhưng tích phân quanh đường tròn đơn vị bằng 2π. Miền ℝ<sup>2</sup> bỏ gốc có một lỗ, nên phép thử không áp dụng.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên “hàm theo y” g(y) khi lấy tích phân f<sub>x</sub> theo x.</li><li>Dùng phép thử trên miền có lỗ.</li><li>Dùng f(A) − f(B) thay vì f(B) − f(A).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>∫<sub>C</sub> ∇f · dr = f(cuối) − f(đầu).</li><li>Bảo toàn ⇔ không phụ thuộc đường ⇔ vòng kín cho 0.</li><li>Phép thử P<sub>y</sub> = Q<sub>x</sub> trên miền đơn liên.</li><li>Tìm f: tích phân P theo x, rồi xác định g(y) bằng Q.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS3 + '6-3-conservative-vector-fields', 'OpenStax Vol. 3 — 6.3 Trường vectơ bảo toàn') + `</li><li>` + A(PN3 + 'FundThmLineIntegrals.aspx', "Paul's Online Notes — Định lý cơ bản cho tích phân đường") + `</li><li>` + A(PN3 + 'ConservativeVectorField.aspx', "Paul's Online Notes — Trường vectơ bảo toàn") + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>F = ⟨2xy, x<sup>2</sup> + e<sup>y</sup>⟩ có bảo toàn không? Nếu có, tìm f.</li><li>Dùng f để tính ∫ F · dr từ (0, 0) tới (1, 1) theo đường bất kỳ.</li><li>F = ⟨x<sup>2</sup>y, xy<sup>2</sup>⟩ có bảo toàn không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) P<sub>y</sub> = 2x = Q<sub>x</sub> ✓; <b>f = x<sup>2</sup>y + e<sup>y</sup></b>. 2) f(1, 1) − f(0, 0) = (1 + e) − 1 = <b>e</b>. 3) P<sub>y</sub> = x<sup>2</sup>, Q<sub>x</sub> = y<sup>2</sup> — không bằng ⇒ <b>không</b>.</p></div>`);

const c123 = L('cal121-ts-12-3',
  '12.3 — Green’s theorem and a look ahead (curl, divergence, Stokes)|||12.3 — Định lý Green và nhìn về phía trước (rot, div, Stokes)',
  '∮P dx + Q dy = ∬(Q_x − P_y) dA cho đường kín dương; ví dụ tam giác = 1/6, hình tròn bán kính 3 = 36π, diện tích A = ½∮x dy − y dx (elip πab); giới thiệu rot, div, định lý Stokes và định lý Divergence ở Calculus III.',
  `<span class="eyebrow">CAL121 · Chapter 12 · Lesson 12.3</span>
<h2>Green's theorem</h2>
<p class="lead">Green's theorem is the two-dimensional Fundamental Theorem of Calculus: the circulation of a field <strong>around</strong> the boundary of a region equals the total “swirl” <strong>inside</strong> it. It converts hard line integrals into easy double integrals — and vice versa — and it is the model for the big theorems of Calculus III.</p>
<h3>🎯 Objectives</h3>
<ul><li>State Green's theorem with the correct orientation.</li><li>Use it to evaluate line integrals around closed curves.</li><li>Compute areas with line integrals; preview curl, divergence, Stokes and the divergence theorem.</li></ul>
<h3>📖 Lecture</h3>
<p>Let C be a positively oriented (counter-clockwise: the region stays on your <strong>left</strong>), piecewise-smooth, simple closed curve bounding a region D, and let P, Q have continuous partial derivatives on an open set containing D.</p>
<div class="formula"><span class="lbl">Green's theorem</span>∮<sub>C</sub> P dx + Q dy = ∬<sub>D</sub> ( ∂Q/∂x − ∂P/∂y ) dA</div>
<p>Check with Lesson 12.2: if F is conservative, Q<sub>x</sub> − P<sub>y</sub> = 0, so the circulation is 0 — consistent. For F = ⟨−y, x⟩, Q<sub>x</sub> − P<sub>y</sub> = 2, so the circulation around the unit circle is 2 · π = 2π — matching Lesson 12.1.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> ∮<sub>C</sub> x<sup>4</sup> dx + xy dy, C = triangle (0, 0) → (1, 0) → (0, 1) → (0, 0).</p>
<p>Q<sub>x</sub> − P<sub>y</sub> = y − 0 = y. ∬<sub>D</sub> y dA = ∫<sub>0</sub><sup>1</sup>∫<sub>0</sub><sup>1−x</sup> y dy dx = ∫<sub>0</sub><sup>1</sup> (1 − x)<sup>2</sup>/2 dx = <b>1/6</b>. (Direct computation over the three edges gives 1/5 − 1/5 + 1/6 = 1/6 ✓, with far more work.)</p></div>
<div class="callout"><p><b>Example 2 — a “scary” integrand.</b> ∮<sub>C</sub> (3y − e<sup>sin x</sup>) dx + (7x + √(y<sup>4</sup> + 1)) dy, C the circle x<sup>2</sup> + y<sup>2</sup> = 9. Q<sub>x</sub> − P<sub>y</sub> = 7 − 3 = 4, so the integral is 4 · Area = 4 · 9π = <b>36π</b>. The ugly terms disappear because they depend only on x in P and only on y in Q.</p></div>
<div class="formula"><span class="lbl">Area by a line integral</span>A = ∮<sub>C</sub> x dy = −∮<sub>C</sub> y dx = ½ ∮<sub>C</sub> (x dy − y dx)</div>
<div class="callout"><p><b>Example 3 — ellipse.</b> x = a cos t, y = b sin t: ½∫<sub>0</sub><sup>2π</sup> (ab cos<sup>2</sup>t + ab sin<sup>2</sup>t) dt = <b>πab</b> (the same as the Jacobian method, Lesson 11.3). This formula is how a <strong>planimeter</strong> measures area by tracing the boundary, and how software computes the area of a polygon from its vertices (the “shoelace formula”).</p></div>
<h3>📖 Looking ahead to Calculus III</h3>
<ul><li>The integrand Q<sub>x</sub> − P<sub>y</sub> is the <strong>curl</strong> (rotation) of F. In 3D, curl F = ∇ × F, and <strong>Stokes' theorem</strong> says the circulation around a curve equals the flux of curl F through any surface it bounds.</li><li>The <strong>divergence</strong> div F = ∇ · F = P<sub>x</sub> + Q<sub>y</sub> (+ R<sub>z</sub>) measures outflow; the <strong>divergence theorem</strong> says the flux out of a closed surface equals the integral of div F over the solid.</li><li>All of them — FTC, the Fundamental Theorem for line integrals, Green, Stokes, divergence — say the same thing: <em>integrating a derivative over a region = integrating the function over its boundary</em>.</li></ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Wrong orientation (clockwise gives the negative).</li><li>Swapping to P<sub>y</sub> − Q<sub>x</sub>.</li><li>Using Green when F is not differentiable somewhere inside D (e.g. the field of Lesson 12.2, Example 4, with the origin inside).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>∮ P dx + Q dy = ∬ (Q<sub>x</sub> − P<sub>y</sub>) dA, counter-clockwise.</li><li>Use it to replace a hard closed line integral by a double integral.</li><li>Area = ½∮ (x dy − y dx).</li><li>Curl and divergence lead to Stokes and the divergence theorem.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li>` + A(OS3 + '6-4-greens-theorem', "OpenStax Vol. 3 — 6.4 Green's Theorem") + `</li><li>` + A(PN3 + 'GreensTheorem.aspx', "Paul's Online Notes — Green's Theorem") + `</li><li>` + A('https://www.3blue1brown.com/lessons/divergence-and-curl', '3Blue1Brown — Divergence and curl (visual introduction)') + `</li><li>` + A('https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/3.-double-integrals-and-line-integrals-in-the-plane/', "MIT OCW 18.02SC — Unit 3, Part C: Green's Theorem") + `</li></ul>
<h3>🧪 Practice</h3>
<ol><li>∮<sub>C</sub> y<sup>2</sup> dx + 3xy dy around the boundary of the unit square [0, 1]<sup>2</sup>, counter-clockwise.</li><li>Use Green to find the work done by F = ⟨−y, x⟩ around the circle of radius 2.</li><li>Find the area of the triangle with vertices (0, 0), (4, 0), (0, 3) using A = ∮ x dy.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Q<sub>x</sub> − P<sub>y</sub> = 3y − 2y = y ⇒ ∬ y dA = <b>1/2</b>. 2) Q<sub>x</sub> − P<sub>y</sub> = 2 ⇒ 2 · 4π = <b>8π</b> (compare Lesson 12.1 practice 3). 3) Only the hypotenuse from (4, 0) to (0, 3) contributes: x = 4 − 4t, dy = 3 dt ⇒ ∫<sub>0</sub><sup>1</sup> 3(4 − 4t) dt = <b>6</b> = ½ · 4 · 3 ✓.</p></div>`,
  `<span class="eyebrow">CAL121 · Chương 12 · Bài 12.3</span>
<h2>Định lý Green</h2>
<p class="lead">Định lý Green là Định lý cơ bản của giải tích phiên bản hai chiều: lưu số của một trường <strong>quanh</strong> biên của một miền bằng tổng “độ xoáy” <strong>bên trong</strong> nó. Nó biến tích phân đường khó thành tích phân kép dễ — và ngược lại — và là khuôn mẫu cho các định lý lớn của Calculus III.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu định lý Green với đúng chiều.</li><li>Dùng nó tính tích phân đường trên đường cong kín.</li><li>Tính diện tích bằng tích phân đường; giới thiệu rot, div, Stokes và định lý Divergence.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Cho C là đường cong kín, đơn, trơn từng khúc, định hướng dương (ngược chiều kim đồng hồ: miền luôn nằm bên <strong>trái</strong> bạn), bao miền D; P, Q có đạo hàm riêng liên tục trên một tập mở chứa D.</p>
<div class="formula"><span class="lbl">Định lý Green</span>∮<sub>C</sub> P dx + Q dy = ∬<sub>D</sub> ( ∂Q/∂x − ∂P/∂y ) dA</div>
<p>Kiểm với Bài 12.2: nếu F bảo toàn thì Q<sub>x</sub> − P<sub>y</sub> = 0, nên lưu số bằng 0 — khớp. Với F = ⟨−y, x⟩, Q<sub>x</sub> − P<sub>y</sub> = 2, nên lưu số quanh đường tròn đơn vị là 2 · π = 2π — khớp Bài 12.1.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> ∮<sub>C</sub> x<sup>4</sup> dx + xy dy, C = tam giác (0, 0) → (1, 0) → (0, 1) → (0, 0).</p>
<p>Q<sub>x</sub> − P<sub>y</sub> = y − 0 = y. ∬<sub>D</sub> y dA = ∫<sub>0</sub><sup>1</sup>∫<sub>0</sub><sup>1−x</sup> y dy dx = ∫<sub>0</sub><sup>1</sup> (1 − x)<sup>2</sup>/2 dx = <b>1/6</b>. (Tính trực tiếp trên ba cạnh được 1/5 − 1/5 + 1/6 = 1/6 ✓, tốn công hơn nhiều.)</p></div>
<div class="callout"><p><b>Ví dụ 2 — hàm “đáng sợ”.</b> ∮<sub>C</sub> (3y − e<sup>sin x</sup>) dx + (7x + √(y<sup>4</sup> + 1)) dy, C là đường tròn x<sup>2</sup> + y<sup>2</sup> = 9. Q<sub>x</sub> − P<sub>y</sub> = 7 − 3 = 4, nên tích phân bằng 4 · Diện tích = 4 · 9π = <b>36π</b>. Các số hạng xấu biến mất vì trong P chúng chỉ phụ thuộc x, trong Q chỉ phụ thuộc y.</p></div>
<div class="formula"><span class="lbl">Diện tích bằng tích phân đường</span>A = ∮<sub>C</sub> x dy = −∮<sub>C</sub> y dx = ½ ∮<sub>C</sub> (x dy − y dx)</div>
<div class="callout"><p><b>Ví dụ 3 — elip.</b> x = a cos t, y = b sin t: ½∫<sub>0</sub><sup>2π</sup> (ab cos<sup>2</sup>t + ab sin<sup>2</sup>t) dt = <b>πab</b> (giống phương pháp Jacobian, Bài 11.3). Công thức này là cách <strong>máy đo diện tích (planimeter)</strong> đo bằng cách đi theo biên, và cách phần mềm tính diện tích đa giác từ toạ độ đỉnh (“công thức dây giày”).</p></div>
<h3>📖 Nhìn về Calculus III</h3>
<ul><li>Biểu thức Q<sub>x</sub> − P<sub>y</sub> là <strong>rot</strong> (độ xoáy) của F. Trong 3D, rot F = ∇ × F, và <strong>định lý Stokes</strong> nói lưu số quanh một đường bằng thông lượng của rot F qua mọi mặt nhận đường đó làm biên.</li><li><strong>Divergence</strong> div F = ∇ · F = P<sub>x</sub> + Q<sub>y</sub> (+ R<sub>z</sub>) đo lượng “chảy ra”; <strong>định lý Divergence</strong> nói thông lượng ra khỏi mặt kín bằng tích phân của div F trên khối bên trong.</li><li>Tất cả — Định lý cơ bản, định lý cơ bản cho tích phân đường, Green, Stokes, Divergence — nói cùng một điều: <em>tích phân của đạo hàm trên một miền = tích phân của hàm trên biên của miền</em>.</li></ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Sai chiều (cùng chiều kim đồng hồ cho kết quả âm).</li><li>Đổi thành P<sub>y</sub> − Q<sub>x</sub>.</li><li>Dùng Green khi F không khả vi ở đâu đó bên trong D (vd trường ở Bài 12.2, Ví dụ 4, khi gốc nằm trong miền).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>∮ P dx + Q dy = ∬ (Q<sub>x</sub> − P<sub>y</sub>) dA, ngược chiều kim đồng hồ.</li><li>Dùng để thay tích phân đường kín khó bằng tích phân kép.</li><li>Diện tích = ½∮ (x dy − y dx).</li><li>Rot và div dẫn tới Stokes và định lý Divergence.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li>` + A(OS3 + '6-4-greens-theorem', 'OpenStax Vol. 3 — 6.4 Định lý Green') + `</li><li>` + A(PN3 + 'GreensTheorem.aspx', "Paul's Online Notes — Green's Theorem") + `</li><li>` + A('https://www.3blue1brown.com/lessons/divergence-and-curl', '3Blue1Brown — Divergence và curl (trực quan)') + `</li><li>` + A('https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/3.-double-integrals-and-line-integrals-in-the-plane/', 'MIT OCW 18.02SC — Unit 3, Part C: Định lý Green') + `</li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>∮<sub>C</sub> y<sup>2</sup> dx + 3xy dy quanh biên hình vuông đơn vị [0, 1]<sup>2</sup>, ngược chiều kim đồng hồ.</li><li>Dùng Green tính công của F = ⟨−y, x⟩ quanh đường tròn bán kính 2.</li><li>Tính diện tích tam giác đỉnh (0, 0), (4, 0), (0, 3) bằng A = ∮ x dy.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Q<sub>x</sub> − P<sub>y</sub> = 3y − 2y = y ⇒ ∬ y dA = <b>1/2</b>. 2) Q<sub>x</sub> − P<sub>y</sub> = 2 ⇒ 2 · 4π = <b>8π</b> (so với Bài 12.1 tự luyện 3). 3) Chỉ cạnh huyền từ (4, 0) tới (0, 3) đóng góp: x = 4 − 4t, dy = 3 dt ⇒ ∫<sub>0</sub><sup>1</sup> 3(4 − 4t) dt = <b>6</b> = ½ · 4 · 3 ✓.</p></div>`);

const q12 = QZ(12, 'Quiz — Chapter 12: Introduction to vector calculus|||Quiz — Chương 12: Mở đầu giải tích vectơ', 'Kiểm tra chương 12: trường vectơ, tích phân đường vô hướng và vectơ, trường bảo toàn, hàm thế, định lý cơ bản cho tích phân đường, định lý Green, công thức diện tích.', [
  Q('q1', '∫_C (2 + x²y) ds over the upper unit semicircle =|||∫_C (2 + x²y) ds trên nửa trên đường tròn đơn vị =',
    ['2π|||2π', '2π + 2/3|||2π + 2/3', 'π + 1/3|||π + 1/3', '2/3|||2/3'], 1,
    'Speed |r′| = 1 and ∫₀^π cos²t sin t dt = 2/3.|||Tốc độ |r′| = 1 và ∫₀^π cos²t sin t dt = 2/3.'),
  Q('q2', 'Reversing the direction of C changes ∫_C F·dr by|||Đổi chiều C làm ∫_C F·dr',
    ['nothing|||không đổi', 'a factor −1|||đổi dấu', 'a factor 2|||gấp đôi', 'it becomes 0|||thành 0'], 1,
    'r′ reverses; scalar integrals ∫f ds do not change.|||r′ đổi hướng; tích phân vô hướng ∫f ds thì không đổi.'),
  Q('q3', 'Work done by F = ⟨−y, x⟩ once around the unit circle counter-clockwise:|||Công của F = ⟨−y, x⟩ một vòng đường tròn đơn vị ngược chiều kim đồng hồ:',
    ['0|||0', 'π|||π', '2π|||2π', '−2π|||−2π'], 2,
    'F·r′ = sin²t + cos²t = 1 over an interval of length 2π.|||F·r′ = sin²t + cos²t = 1 trên khoảng dài 2π.'),
  Q('q4', 'If F = ∇f and C runs from A to B, then ∫_C F·dr =|||Nếu F = ∇f và C đi từ A tới B thì ∫_C F·dr =',
    ['f(A) − f(B)|||f(A) − f(B)', 'f(B) − f(A)|||f(B) − f(A)', '0|||0', 'depends on the path|||phụ thuộc đường đi'], 1,
    'Fundamental Theorem for line integrals.|||Định lý cơ bản cho tích phân đường.'),
  Q('q5', 'On a simply connected region, ⟨P, Q⟩ is conservative exactly when|||Trên miền đơn liên, ⟨P, Q⟩ bảo toàn khi và chỉ khi',
    ['P_x = Q_y|||P_x = Q_y', 'P_y = Q_x|||P_y = Q_x', 'P = Q|||P = Q', 'P_x + Q_y = 0|||P_x + Q_y = 0'], 1,
    'Clairaut: f_xy = f_yx.|||Clairaut: f_xy = f_yx.'),
  Q('q6', 'A potential for F = ⟨3 + 2xy, x² − 3y²⟩ is|||Một hàm thế của F = ⟨3 + 2xy, x² − 3y²⟩ là',
    ['3x + x²y − y³|||3x + x²y − y³', '3x + 2xy − 3y²|||3x + 2xy − 3y²', 'x²y − y³|||x²y − y³', '3 + x²y − y³|||3 + x²y − y³'], 0,
    'f_x = 3 + 2xy and f_y = x² − 3y².|||f_x = 3 + 2xy và f_y = x² − 3y².'),
  Q('q7', 'Why is ⟨−y, x⟩/(x² + y²) not a counterexample to the test P_y = Q_x?|||Vì sao ⟨−y, x⟩/(x² + y²) không phải phản ví dụ cho phép thử P_y = Q_x?',
    ['P_y ≠ Q_x|||P_y ≠ Q_x', 'its domain has a hole at the origin|||miền xác định có lỗ tại gốc', 'it is conservative|||nó bảo toàn', 'its loop integral is 0|||tích phân vòng bằng 0'], 1,
    'The test needs a simply connected region; the loop integral is 2π.|||Phép thử cần miền đơn liên; tích phân vòng bằng 2π.'),
  Q('q8', "Green's theorem: ∮ P dx + Q dy (counter-clockwise) =|||Định lý Green: ∮ P dx + Q dy (ngược chiều kim đồng hồ) =",
    ['∬ (P_y − Q_x) dA|||∬ (P_y − Q_x) dA', '∬ (Q_x − P_y) dA|||∬ (Q_x − P_y) dA', '∬ (P_x + Q_y) dA|||∬ (P_x + Q_y) dA', '0|||0'], 1,
    'Q_x − P_y is the 2D curl.|||Q_x − P_y là rot hai chiều.'),
  Q('q9', '∮ (3y − e^(sin x)) dx + (7x + √(y⁴ + 1)) dy around x² + y² = 9:|||∮ (3y − e^(sin x)) dx + (7x + √(y⁴ + 1)) dy quanh x² + y² = 9:',
    ['9π|||9π', '36π|||36π', '4π|||4π', '0|||0'], 1,
    'Q_x − P_y = 4, area 9π.|||Q_x − P_y = 4, diện tích 9π.'),
  Q('q10', 'The area enclosed by C can be written as|||Diện tích bao bởi C có thể viết là',
    ['∮ x dx|||∮ x dx', '½∮ (x dy − y dx)|||½∮ (x dy − y dx)', '∮ (x dx + y dy)|||∮ (x dx + y dy)', '∮ y dy|||∮ y dy'], 1,
    "Green with P = −y/2, Q = x/2 gives Q_x − P_y = 1.|||Green với P = −y/2, Q = x/2 cho Q_x − P_y = 1."),
]);

const ch12 = {
  title: 'Chapter 12 — Introduction to vector calculus: line integrals and Green’s theorem|||Chương 12 — Mở đầu giải tích vectơ: tích phân đường và định lý Green',
  description: 'Trường vectơ, tích phân đường vô hướng và vectơ (công), trường bảo toàn và hàm thế, định lý cơ bản cho tích phân đường, định lý Green và công thức diện tích; nhìn trước rot, div, Stokes (Stewart 16.1–16.4 · OpenStax Vol.3 6.1–6.4).',
  lessons: [c121, c122, c123, q12],
};

// ───────────────────────────── Xuất ─────────────────────────────
export default [muc0, ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9, ch10, ch11, ch12];
