// Khoá TỰ SOẠN cho MAC103 — trường chưa công bố syllabus trên FLM (dò 09/11/2026). Soạn theo _HOP-DONG-TU-SOAN.md.
// Khung bám giáo trình chuẩn: Stewart/Clegg/Watson "Calculus: Early Transcendentals" (9e), OpenStax "Calculus" Vol 1–3
// (Strang & Herman), và hai giáo trình giải tích ứng dụng cho khối kinh doanh/công nghệ: Larson "Calculus: An Applied
// Approach" (10e) và Hoffmann et al. "Calculus for Business, Economics, and the Social and Life Sciences" (Brief 11e).
// MAC103 = Giải tích MỘT học kỳ trọn gói (hàm số → giới hạn → đạo hàm & ứng dụng → tích phân & ứng dụng → chuỗi → nhiều biến).
// Ví dụ KHÁC khoá CAL111 (bài mới, ví dụ mới); muốn học sâu từng mảng một biến thì sang CAL111.
// Mọi ví dụ số và đáp án đã kiểm bằng sympy (python3). Mọi link ngoài đã mở thử (HTTP 200 + tiêu đề trang đúng chủ đề).
// ⚠️ File này KHÔNG dùng chuỗi nội suy (dấu đô-la + ngoặc nhọn) và không backtick lồng; nội dung ghép bằng toán tử +.

const bi = (en, vi) => '<div class="ml-en">' + en + '</div>\n<div class="ml-vi">' + vi + '</div>';
const L = (slug, title, description, en, vi) => ({ title, slug, type: 'DOCUMENT', description, content: bi(en, vi) });
const Q = (id, question, options, correctIndex, explanation) => ({ id, question, options, correctIndex, points: 1, explanation });
const QZ = (ch, title, description, questions) => ({
  title, slug: 'mac103-ts-quiz-' + ch, type: 'QUIZ', description,
  quiz: { timeLimitSeconds: 900, questions },
});

// ───────────────────────────── Mục 0 — Khung môn học ─────────────────────────────
const m01 = L('mac103-ts-0-1',
  '0.1 — Welcome to MAC103: a one-semester Calculus course for technology and business|||0.1 — Giới thiệu MAC103: Giải tích một học kỳ cho khối công nghệ và kinh doanh',
  'MAC103 học gì (giải tích một học kỳ trọn gói), dùng vào đâu (AI, dữ liệu, kinh doanh), 8 chuẩn đầu ra tự soạn, cách học; cảnh báo: trường chưa công bố syllabus MAC103 trên FLM.',
  `<span class="eyebrow">MAC103 · Section 0 · Lesson 0.1</span>
<h2>Welcome to MAC103 — Calculus</h2>
<p class="lead">Calculus is the mathematics of <strong>change</strong> and <strong>accumulation</strong>. MAC103 packs the essential calculus of a full year into <strong>one semester</strong>: functions, limits, derivatives and their applications, integrals and their applications, a first look at infinite series and at functions of several variables — always with an eye on how engineers, data scientists and business analysts actually use it.</p>
<div class="callout"><p>⚠️ <strong>Important.</strong> FPT University has <strong>not published the MAC103 syllabus on FLM</strong> (we searched the course code, its variants and the course name on 09/11/2026; MAC101/MAC102 are different courses and were not used as a substitute). This course framework is therefore <strong>self-authored</strong>, following the standard international textbooks listed in lesson 0.2. <strong>Grading weights, assessment format and exam dates are decided by your lecturer</strong> — always follow the course outline your lecturer gives in class.</p></div>
<h3>What is MAC103 about?</h3>
<p>Most real quantities change: the number of users of an app, the price of a product, the temperature of a server, the balance of a loan. Calculus gives two tools to reason about them:</p>
<ul>
<li>The <strong>derivative</strong> answers “how fast is it changing right now?” — the slope of a graph, a velocity, a marginal cost.</li>
<li>The <strong>integral</strong> answers “how much has accumulated in total?” — an area, a distance travelled, total revenue from a revenue rate.</li>
</ul>
<p>Both rest on the idea of a <strong>limit</strong>, and the Fundamental Theorem of Calculus shows that they undo each other. With these two tools in hand, the last part of the course extends them to infinite sums (series) and to functions of two variables (partial derivatives and gradients).</p>
<h3>Who uses it?</h3>
<ul>
<li><strong>AI &amp; data science:</strong> training a model means minimising a loss function with gradient descent — derivatives, the chain rule and gradients are its engine.</li>
<li><strong>Software &amp; algorithms:</strong> growth rates (log n, n<sup>2</sup>, 2<sup>n</sup>), numerical methods (bisection, Newton), simulation and computer graphics.</li>
<li><strong>Business &amp; economics:</strong> marginal cost and revenue, profit maximisation, price elasticity, compound interest, present value of income streams, consumer surplus.</li>
<li><strong>Engineering &amp; robotics:</strong> velocity and acceleration, optimisation of designs, control and signal processing.</li>
</ul>
<h3>Learning outcomes (self-authored)</h3>
<p>After MAC103 you should be able to:</p>
<ol>
<li>Build and read function models (linear, polynomial, exponential, logarithmic, trigonometric) for cost, revenue, growth and interest problems.</li>
<li>Compute limits (algebraically and at infinity), decide continuity, and use the Intermediate Value Theorem and bisection to locate roots.</li>
<li>Differentiate elementary functions with the standard rules and the chain rule, and interpret derivatives as rates and marginal quantities.</li>
<li>Use derivatives to analyse graphs and to solve optimisation problems (maximum profit, minimum average cost, elasticity), and apply L'Hôpital's rule and Newton's method.</li>
<li>Evaluate definite and indefinite integrals by the Fundamental Theorem, substitution, integration by parts and partial fractions; handle improper integrals and numerical integration.</li>
<li>Apply integrals to areas, volumes, average value, consumer/producer surplus, income streams, probability and exponential growth models.</li>
<li>Decide convergence of basic sequences and series and approximate functions by Taylor polynomials.</li>
<li>Compute partial derivatives and gradients, and solve simple two-variable optimisation problems, with and without constraints (Lagrange multipliers).</li>
</ol>
<h3>Related courses</h3>
<p>MAC103 is a semester-1 course. It only assumes high-school algebra and trigonometry. Its ideas are reused later in probability &amp; statistics, linear algebra, numerical methods and machine-learning courses — check your own programme's curriculum for the exact course codes. If you want a deeper, slower treatment of single-variable calculus, the self-authored <a href="https://cuongthai.com/academy/courses/cal111-calculus-i" target="_blank" rel="noopener">CAL111 — Calculus I</a> course on this site covers chapters 1–7 of MAC103 in more detail with different examples.</p>
<h3>How to study this course</h3>
<ul>
<li>9 chapters, each with 3–4 lessons and a quiz. Every lesson has objectives, a lecture, step-by-step worked examples, common mistakes, a 📌 summary, 🔗 further reading and 🧪 practice with answers.</li>
<li>Work the practice problems <strong>on paper first</strong>; only then open the answers.</li>
<li>Plan about 6–8 hours per chapter: read the lesson, read the linked OpenStax section, do extra exercises, then take the quiz.</li>
<li>Use Desmos, GeoGebra or SymPy to <em>check</em> your work — never to replace it.</li>
</ul>`,
  `<span class="eyebrow">MAC103 · Mục 0 · Bài 0.1</span>
<h2>Chào mừng đến với MAC103 — Giải tích</h2>
<p class="lead">Giải tích là toán học của <strong>sự thay đổi</strong> và <strong>sự tích luỹ</strong>. MAC103 gói phần giải tích cốt lõi của cả năm học vào <strong>một học kỳ</strong>: hàm số, giới hạn, đạo hàm và ứng dụng, tích phân và ứng dụng, làm quen với chuỗi vô hạn và hàm nhiều biến — luôn gắn với cách kỹ sư, nhà khoa học dữ liệu và chuyên viên phân tích kinh doanh dùng nó thật.</p>
<div class="callout"><p>⚠️ <strong>Lưu ý quan trọng.</strong> Trường <strong>chưa công bố syllabus của MAC103 trên FLM</strong> (đã dò mã môn, mã biến thể và tên môn ngày 09/11/2026; MAC101/MAC102 là môn KHÁC, không lấy thay). Vì vậy khung môn này là <strong>khung tự soạn</strong>, bám các giáo trình chuẩn quốc tế liệt kê ở bài 0.2. <strong>Cách tính điểm, hình thức đánh giá và lịch thi theo giảng viên</strong> — luôn theo đề cương giảng viên phát trên lớp.</p></div>
<h3>MAC103 học gì?</h3>
<p>Hầu hết đại lượng thực tế đều thay đổi: số người dùng một ứng dụng, giá một sản phẩm, nhiệt độ máy chủ, dư nợ một khoản vay. Giải tích cho hai công cụ để lập luận về chúng:</p>
<ul>
<li><strong>Đạo hàm</strong> trả lời “ngay lúc này nó thay đổi nhanh cỡ nào?” — độ dốc đồ thị, vận tốc, chi phí biên.</li>
<li><strong>Tích phân</strong> trả lời “tổng cộng đã tích luỹ bao nhiêu?” — diện tích, quãng đường đã đi, tổng doanh thu từ tốc độ doanh thu.</li>
</ul>
<p>Cả hai dựa trên ý tưởng <strong>giới hạn</strong>, và Định lý cơ bản của giải tích cho thấy chúng là hai phép ngược nhau. Có hai công cụ này rồi, phần cuối môn mở rộng chúng sang tổng vô hạn (chuỗi) và hàm hai biến (đạo hàm riêng, gradient).</p>
<h3>Ai dùng giải tích?</h3>
<ul>
<li><strong>AI &amp; khoa học dữ liệu:</strong> huấn luyện mô hình là cực tiểu hoá hàm mất mát bằng gradient descent — đạo hàm, quy tắc dây chuyền và gradient là động cơ của nó.</li>
<li><strong>Phần mềm &amp; thuật toán:</strong> tốc độ tăng (log n, n<sup>2</sup>, 2<sup>n</sup>), phương pháp số (chia đôi, Newton), mô phỏng và đồ hoạ máy tính.</li>
<li><strong>Kinh doanh &amp; kinh tế:</strong> chi phí biên, doanh thu biên, tối đa hoá lợi nhuận, độ co giãn của cầu, lãi kép, giá trị hiện tại của dòng thu nhập, thặng dư tiêu dùng.</li>
<li><strong>Kỹ thuật &amp; robotics:</strong> vận tốc, gia tốc, tối ưu thiết kế, điều khiển và xử lý tín hiệu.</li>
</ul>
<h3>Chuẩn đầu ra (tự soạn)</h3>
<p>Học xong MAC103, bạn cần làm được:</p>
<ol>
<li>Dựng và đọc mô hình hàm số (tuyến tính, đa thức, mũ, logarit, lượng giác) cho bài toán chi phí, doanh thu, tăng trưởng và lãi suất.</li>
<li>Tính giới hạn (biến đổi đại số và tại vô cực), xét tính liên tục, dùng định lý giá trị trung gian và phương pháp chia đôi để định vị nghiệm.</li>
<li>Tính đạo hàm các hàm sơ cấp bằng các quy tắc chuẩn và quy tắc dây chuyền; hiểu đạo hàm là tốc độ thay đổi và đại lượng cận biên.</li>
<li>Dùng đạo hàm khảo sát đồ thị và giải bài toán tối ưu (lợi nhuận lớn nhất, chi phí trung bình nhỏ nhất, độ co giãn); áp dụng quy tắc L'Hôpital và phương pháp Newton.</li>
<li>Tính tích phân xác định và bất định bằng Định lý cơ bản, đổi biến, từng phần và phân thức hữu tỉ; xử lý tích phân suy rộng và tích phân số.</li>
<li>Ứng dụng tích phân tính diện tích, thể tích, giá trị trung bình, thặng dư tiêu dùng/sản xuất, dòng thu nhập, xác suất và mô hình tăng trưởng mũ.</li>
<li>Xét hội tụ của dãy và chuỗi cơ bản, xấp xỉ hàm bằng đa thức Taylor.</li>
<li>Tính đạo hàm riêng và gradient, giải bài toán tối ưu hai biến đơn giản, có và không có ràng buộc (nhân tử Lagrange).</li>
</ol>
<h3>Môn liên quan</h3>
<p>MAC103 là môn kỳ 1, chỉ cần đại số và lượng giác phổ thông. Ý tưởng của môn được dùng lại ở các môn xác suất thống kê, đại số tuyến tính, phương pháp số và học máy về sau — xem khung chương trình ngành của bạn để biết mã môn chính xác. Muốn học chậm và sâu hơn phần giải tích một biến, khoá tự soạn <a href="https://cuongthai.com/academy/courses/cal111-calculus-i" target="_blank" rel="noopener">CAL111 — Calculus I</a> trên trang này phủ chương 1–7 của MAC103 chi tiết hơn, với ví dụ khác.</p>
<h3>Học môn này thế nào cho hiệu quả</h3>
<ul>
<li>9 chương, mỗi chương 3–4 bài và một quiz. Mỗi bài có mục tiêu, bài giảng, ví dụ giải từng bước, lỗi hay gặp, 📌 tóm tắt, 🔗 học thêm và 🧪 tự luyện có đáp án.</li>
<li>Làm bài tự luyện <strong>ra giấy trước</strong>, rồi mới mở đáp án.</li>
<li>Dành khoảng 6–8 giờ mỗi chương: đọc bài, đọc mục OpenStax tương ứng, làm thêm bài tập, rồi làm quiz.</li>
<li>Dùng Desmos, GeoGebra hoặc SymPy để <em>kiểm tra</em> bài — đừng để công cụ làm thay.</li>
</ul>`);

const m02 = L('mac103-ts-0-2',
  '0.2 — Textbooks & learning resources (verified)|||0.2 — Giáo trình & tài liệu học (đã kiểm)',
  'Giáo trình chuẩn kèm ISBN đã kiểm (Stewart 9e, OpenStax Calculus Vol 1–3, Larson Applied Approach 10e, Hoffmann et al. Brief 11e), khoá mở MIT OCW 18.01SC/18.02SC, Paul’s Online Notes, 3Blue1Brown, Coursera, công cụ Desmos/GeoGebra/SymPy.',
  `<span class="eyebrow">MAC103 · Section 0 · Lesson 0.2</span>
<h2>Textbooks &amp; learning resources</h2>
<p class="lead">MAC103 follows the chapter order of the standard texts below. You do <strong>not</strong> need to buy anything: the OpenStax books are free and legal online, and every lesson links to the matching section. ISBNs below were checked against the publisher page or a library catalogue (Open Library).</p>
<h3>📘 Main textbooks</h3>
<ol>
<li><strong>James Stewart, Daniel K. Clegg, Saleem Watson — <em>Calculus: Early Transcendentals</em>, 9th edition.</strong> Cengage Learning, 2020. ISBN 978-1-337-61392-7. <a href="https://www.cengage.com/c/calculus-early-transcendentals-9e-stewart-clegg-watson/9781337613927/" target="_blank" rel="noopener">Publisher page</a>. The reference text for the whole course: chapters 1–7 (single-variable), 11 (series) and 14 (partial derivatives).</li>
<li><strong>Gilbert Strang, Edwin “Jed” Herman — <em>Calculus</em>, Volumes 1, 2 and 3.</strong> OpenStax (Rice University), 2016, licence CC BY-NC-SA. Print ISBNs: Vol 1 978-1-938168-02-4, Vol 2 978-1-938168-06-2, Vol 3 978-1-938168-07-9. Free online: <a href="https://openstax.org/books/calculus-volume-1/pages/1-introduction" target="_blank" rel="noopener">Volume 1</a> (functions → applications of integration), <a href="https://openstax.org/books/calculus-volume-2/pages/1-introduction" target="_blank" rel="noopener">Volume 2</a> (techniques of integration, sequences and series), <a href="https://openstax.org/books/calculus-volume-3/pages/1-introduction" target="_blank" rel="noopener">Volume 3</a> (functions of several variables).</li>
<li><strong>Ron Larson — <em>Calculus: An Applied Approach</em>, 10th edition.</strong> Cengage Learning, 2017. ISBN 978-1-305-86091-9. <a href="https://www.cengage.com/c/calculus-an-applied-approach-10e-larson/9781305860919/" target="_blank" rel="noopener">Publisher page</a>. An applied calculus text for business, economics, life and social sciences — the source of the “business flavour” of MAC103 (marginal analysis, elasticity, surplus, income streams).</li>
<li><strong>Laurence D. Hoffmann et al. — <em>Calculus for Business, Economics, and the Social and Life Sciences</em>, Brief 11th edition.</strong> McGraw-Hill, 2013. ISBN 978-0-07-353238-7 (checked in the Open Library catalogue). A second applied text with many business exercises.</li>
</ol>
<h3>🎓 Open courses &amp; notes</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/" target="_blank" rel="noopener">MIT OpenCourseWare 18.01SC — Single Variable Calculus</a>: lecture videos, problem sets and exams with solutions (chapters 1–8 of MAC103).</li>
<li><a href="https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/" target="_blank" rel="noopener">MIT OpenCourseWare 18.02SC — Multivariable Calculus</a>: for chapter 9 (partial derivatives, gradient, Lagrange multipliers).</li>
<li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/CalcI.aspx" target="_blank" rel="noopener">Paul's Online Math Notes — Calculus I</a>, <a href="https://tutorial.math.lamar.edu/Classes/CalcII/CalcII.aspx" target="_blank" rel="noopener">Calculus II</a> and <a href="https://tutorial.math.lamar.edu/Classes/CalcIII/CalcIII.aspx" target="_blank" rel="noopener">Calculus III</a> (Lamar University): clear notes with hundreds of solved problems.</li>
<li><a href="https://www.3blue1brown.com/lessons/essence-of-calculus" target="_blank" rel="noopener">3Blue1Brown — Essence of Calculus</a>: the best visual intuition for derivatives, integrals and Taylor series.</li>
<li><a href="https://www.coursera.org/learn/introduction-to-calculus" target="_blank" rel="noopener">Coursera — Introduction to Calculus (University of Sydney)</a> and <a href="https://www.coursera.org/learn/multivariate-calculus-machine-learning" target="_blank" rel="noopener">Mathematics for Machine Learning: Multivariate Calculus (Imperial College London)</a>.</li>
</ul>
<h3>🛠️ Tools for checking your work</h3>
<ul>
<li><a href="https://www.desmos.com/calculator" target="_blank" rel="noopener">Desmos graphing calculator</a> and <a href="https://www.geogebra.org/calculator" target="_blank" rel="noopener">GeoGebra Calculator Suite</a> — graphs, tangent lines, areas, 3D surfaces.</li>
<li><a href="https://docs.sympy.org/latest/tutorials/intro-tutorial/calculus.html" target="_blank" rel="noopener">SymPy — Calculus tutorial</a>: limits, derivatives, integrals and series in Python (the examples in this course were checked with SymPy).</li>
<li><a href="https://www.wolframalpha.com/" target="_blank" rel="noopener">WolframAlpha</a> — quick symbolic answers.</li>
</ul>
<h3>🗺️ Course map</h3>
<p>1. Functions and models · 2. Limits and continuity · 3. Derivatives · 4. Applications of derivatives · 5. Integrals · 6. Techniques of integration · 7. Applications of integrals · 8. Sequences and series · 9. Functions of several variables.</p>
<div class="meo"><p><strong>Study plan.</strong> For each lesson: read the lesson here → read the linked OpenStax section → do 5–10 extra problems from Paul's Notes or OpenStax → do the 🧪 practice → take the chapter quiz.</p></div>`,
  `<span class="eyebrow">MAC103 · Mục 0 · Bài 0.2</span>
<h2>Giáo trình &amp; tài liệu học</h2>
<p class="lead">MAC103 bám thứ tự chương của các giáo trình chuẩn dưới đây. Bạn <strong>không</strong> cần mua sách: sách OpenStax miễn phí, hợp pháp trên mạng, và mỗi bài đều dẫn tới đúng mục tương ứng. Các ISBN dưới đây đã được đối chiếu với trang nhà xuất bản hoặc danh mục thư viện (Open Library).</p>
<h3>📘 Giáo trình chính</h3>
<ol>
<li><strong>James Stewart, Daniel K. Clegg, Saleem Watson — <em>Calculus: Early Transcendentals</em>, tái bản lần 9.</strong> Cengage Learning, 2020. ISBN 978-1-337-61392-7. <a href="https://www.cengage.com/c/calculus-early-transcendentals-9e-stewart-clegg-watson/9781337613927/" target="_blank" rel="noopener">Trang nhà xuất bản</a>. Giáo trình tham chiếu cho cả môn: chương 1–7 (một biến), 11 (chuỗi) và 14 (đạo hàm riêng).</li>
<li><strong>Gilbert Strang, Edwin “Jed” Herman — <em>Calculus</em>, tập 1, 2 và 3.</strong> OpenStax (Đại học Rice), 2016, giấy phép CC BY-NC-SA. ISBN bản in: tập 1 978-1-938168-02-4, tập 2 978-1-938168-06-2, tập 3 978-1-938168-07-9. Đọc miễn phí: <a href="https://openstax.org/books/calculus-volume-1/pages/1-introduction" target="_blank" rel="noopener">Tập 1</a> (hàm số → ứng dụng tích phân), <a href="https://openstax.org/books/calculus-volume-2/pages/1-introduction" target="_blank" rel="noopener">Tập 2</a> (kỹ thuật tích phân, dãy và chuỗi), <a href="https://openstax.org/books/calculus-volume-3/pages/1-introduction" target="_blank" rel="noopener">Tập 3</a> (hàm nhiều biến).</li>
<li><strong>Ron Larson — <em>Calculus: An Applied Approach</em>, tái bản lần 10.</strong> Cengage Learning, 2017. ISBN 978-1-305-86091-9. <a href="https://www.cengage.com/c/calculus-an-applied-approach-10e-larson/9781305860919/" target="_blank" rel="noopener">Trang nhà xuất bản</a>. Giáo trình giải tích ứng dụng cho kinh doanh, kinh tế, khoa học sự sống và xã hội — nguồn của “chất kinh doanh” trong MAC103 (phân tích cận biên, độ co giãn, thặng dư, dòng thu nhập).</li>
<li><strong>Laurence D. Hoffmann và cộng sự — <em>Calculus for Business, Economics, and the Social and Life Sciences</em>, Brief, tái bản lần 11.</strong> McGraw-Hill, 2013. ISBN 978-0-07-353238-7 (đã đối chiếu trong danh mục Open Library). Giáo trình ứng dụng thứ hai, rất nhiều bài tập kinh doanh.</li>
</ol>
<h3>🎓 Khoá học mở &amp; ghi chú</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/" target="_blank" rel="noopener">MIT OpenCourseWare 18.01SC — Giải tích một biến</a>: video bài giảng, bài tập, đề thi có lời giải (chương 1–8 của MAC103).</li>
<li><a href="https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/" target="_blank" rel="noopener">MIT OpenCourseWare 18.02SC — Giải tích nhiều biến</a>: cho chương 9 (đạo hàm riêng, gradient, nhân tử Lagrange).</li>
<li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/CalcI.aspx" target="_blank" rel="noopener">Paul's Online Math Notes — Calculus I</a>, <a href="https://tutorial.math.lamar.edu/Classes/CalcII/CalcII.aspx" target="_blank" rel="noopener">Calculus II</a> và <a href="https://tutorial.math.lamar.edu/Classes/CalcIII/CalcIII.aspx" target="_blank" rel="noopener">Calculus III</a> (Đại học Lamar): ghi chú rõ ràng, hàng trăm bài có lời giải.</li>
<li><a href="https://www.3blue1brown.com/lessons/essence-of-calculus" target="_blank" rel="noopener">3Blue1Brown — Essence of Calculus</a>: trực quan đẹp nhất về đạo hàm, tích phân và chuỗi Taylor.</li>
<li><a href="https://www.coursera.org/learn/introduction-to-calculus" target="_blank" rel="noopener">Coursera — Introduction to Calculus (Đại học Sydney)</a> và <a href="https://www.coursera.org/learn/multivariate-calculus-machine-learning" target="_blank" rel="noopener">Mathematics for Machine Learning: Multivariate Calculus (Imperial College London)</a>.</li>
</ul>
<h3>🛠️ Công cụ tự kiểm bài</h3>
<ul>
<li><a href="https://www.desmos.com/calculator" target="_blank" rel="noopener">Desmos</a> và <a href="https://www.geogebra.org/calculator" target="_blank" rel="noopener">GeoGebra Calculator Suite</a> — đồ thị, tiếp tuyến, diện tích, mặt cong 3D.</li>
<li><a href="https://docs.sympy.org/latest/tutorials/intro-tutorial/calculus.html" target="_blank" rel="noopener">SymPy — hướng dẫn Calculus</a>: giới hạn, đạo hàm, tích phân, chuỗi bằng Python (các ví dụ của khoá đã được kiểm bằng SymPy).</li>
<li><a href="https://www.wolframalpha.com/" target="_blank" rel="noopener">WolframAlpha</a> — kiểm nhanh kết quả ký hiệu.</li>
</ul>
<h3>🗺️ Bản đồ môn</h3>
<p>1. Hàm số và mô hình · 2. Giới hạn và liên tục · 3. Đạo hàm · 4. Ứng dụng đạo hàm · 5. Tích phân · 6. Kỹ thuật tích phân · 7. Ứng dụng tích phân · 8. Dãy và chuỗi · 9. Hàm nhiều biến.</p>
<div class="meo"><p><strong>Kế hoạch học.</strong> Với mỗi bài: đọc bài ở đây → đọc mục OpenStax được dẫn → làm thêm 5–10 bài từ Paul's Notes hoặc OpenStax → làm 🧪 tự luyện → làm quiz chương.</p></div>`);

const muc0 = {
  title: 'Section 0 — Course framework (self-authored, no FLM syllabus)|||Mục 0 — Khung môn học (tự soạn, trường chưa công bố syllabus)',
  description: 'Giới thiệu môn, chuẩn đầu ra tự soạn, giáo trình chuẩn kèm ISBN và tài liệu mở. Trường chưa công bố syllabus MAC103 trên FLM — điểm/lịch thi theo giảng viên.',
  lessons: [m01, m02],
};

// ───────────────────────────── Chương 1 — Hàm số & mô hình ─────────────────────────────
const c11 = L('mac103-ts-1-1',
  '1.1 — Functions, domains and linear models: cost, revenue, profit and break-even|||1.1 — Hàm số, tập xác định và mô hình tuyến tính: chi phí, doanh thu, lợi nhuận, hoà vốn',
  'Hàm số là quy tắc một đầu vào – một đầu ra; tìm tập xác định; hàm tuyến tính và ý nghĩa hệ số góc; mô hình chi phí – doanh thu – lợi nhuận, điểm hoà vốn; hàm từng khúc (gói cước dữ liệu).',
  `<span class="eyebrow">MAC103 · Chapter 1 · Lesson 1.1</span>
<h2>Functions, domains and linear models</h2>
<p class="lead">Every calculus problem starts with a function. In this lesson you learn to read a function as a <strong>model</strong>: how much does it cost to produce x units, how much do we earn, when do we break even?</p>
<h3>🎯 Objectives</h3>
<ul><li>State what a function is and use function notation correctly.</li><li>Find the natural domain of a formula.</li><li>Interpret the slope and intercept of a linear model.</li><li>Build cost, revenue and profit functions and find the break-even point.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>function</strong> f assigns to each input x in its <strong>domain</strong> exactly <em>one</em> output f(x). The set of all outputs is the <strong>range</strong>. A graph is a function exactly when every vertical line meets it at most once.</p>
<p>When a function is given only by a formula, its <strong>natural domain</strong> is every x for which the formula makes sense. Three rules cover almost all cases:</p>
<ul><li>a denominator must not be 0;</li><li>the expression under an even root (√) must be ≥ 0;</li><li>the argument of a logarithm must be &gt; 0.</li></ul>
<div class="formula"><span class="lbl">Linear function</span>f(x) = mx + b    m = slope = Δy/Δx (change in output per one unit of input), b = f(0) = intercept</div>
<p>Linear models are the first tool of business analysis. If a company has <strong>fixed costs</strong> F (rent, salaries, software licences) and a <strong>variable cost</strong> v per unit, and sells each unit at price p:</p>
<div class="formula"><span class="lbl">Cost – revenue – profit</span>C(x) = F + v·x    R(x) = p·x    P(x) = R(x) − C(x) = (p − v)·x − F</div>
<p>The <strong>break-even point</strong> is where P(x) = 0, i.e. R(x) = C(x): x = F / (p − v). The number p − v is the <strong>contribution margin</strong> — what each unit contributes towards covering fixed costs.</p>
<p>Some prices change rule at a threshold. Such a function is <strong>piecewise-defined</strong>: you must first decide which piece applies to the input, then evaluate.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — domain.</b> f(x) = √(6 − 2x) / (x + 1).</p><p>Root: 6 − 2x ≥ 0 ⇒ x ≤ 3. Denominator: x ≠ −1. Domain: <b>(−∞, −1) ∪ (−1, 3]</b>. Note that 3 is included (√0 = 0 is fine) but −1 is not.</p></div>
<div class="callout"><p><b>Example 2 — break-even.</b> A small studio prints custom phone cases. Fixed cost $1,500 per month, material and printing $12 per case, selling price $20.</p><p>C(x) = 1500 + 12x, R(x) = 20x, P(x) = 8x − 1500. Break-even: 8x = 1500 ⇒ x = 187.5, so the studio needs <b>188 cases</b> per month to stop losing money. At 300 cases the profit is P(300) = 2400 − 1500 = <b>$900</b>. The slope 8 means: every extra case adds $8 of profit.</p></div>
<div class="callout"><p><b>Example 3 — piecewise.</b> A mobile data plan costs 100 (thousand VND) and includes 5 GB; each extra GB costs 15. With g in GB:</p><p>C(g) = 100 if 0 ≤ g ≤ 5;  C(g) = 100 + 15(g − 5) if g &gt; 5. Then C(3) = 100 and C(8) = 100 + 15·3 = <b>145</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting one of the domain conditions when a formula has both a root and a fraction.</li><li>Reporting a fractional break-even quantity (187.5 cases) without rounding <em>up</em> to a whole unit.</li><li>Confusing the slope (rate per unit) with the intercept (value at x = 0, here the fixed cost).</li><li>Using the wrong piece of a piecewise function — check the condition first.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>A function gives exactly one output per input; the domain is where the formula is defined.</li><li>Domain rules: denominator ≠ 0, even root ≥ 0, logarithm argument &gt; 0.</li><li>In y = mx + b, m is the rate of change and b the starting value.</li><li>P = R − C; break-even at x = F/(p − v).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/1-1-review-of-functions" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 1.1 Review of Functions</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/1-2-basic-classes-of-functions" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 1.2 Basic Classes of Functions</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/Functions.aspx" target="_blank" rel="noopener">Paul's Online Notes — Functions (review)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the domain of g(x) = ln(x − 3) / (x − 7).</li><li>A coffee kiosk has fixed costs of 2,000 (thousand VND) per month; each drink costs 35 (thousand VND) to make and sells for 60 (thousand VND). Find the break-even number of drinks.</li><li>A server worth $24,000 is depreciated linearly by $3,000 per year. Write V(t) and find when it reaches 0.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) x − 3 &gt; 0 and x ≠ 7 ⇒ D = (3, 7) ∪ (7, ∞). 2) 60x = 2000 + 35x ⇒ 25x = 2000 ⇒ x = 80 drinks. 3) V(t) = 24000 − 3000t; V = 0 when t = 8 years.</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 1 · Bài 1.1</span>
<h2>Hàm số, tập xác định và mô hình tuyến tính</h2>
<p class="lead">Mọi bài toán giải tích đều bắt đầu từ một hàm số. Bài này dạy bạn đọc hàm số như một <strong>mô hình</strong>: sản xuất x sản phẩm tốn bao nhiêu, thu được bao nhiêu, khi nào hoà vốn?</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu hàm số là gì và dùng ký hiệu hàm đúng.</li><li>Tìm tập xác định tự nhiên của một công thức.</li><li>Giải thích hệ số góc và tung độ gốc của mô hình tuyến tính.</li><li>Dựng hàm chi phí, doanh thu, lợi nhuận và tìm điểm hoà vốn.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Hàm số</strong> f gán cho mỗi đầu vào x thuộc <strong>tập xác định</strong> đúng <em>một</em> đầu ra f(x). Tập mọi đầu ra là <strong>tập giá trị</strong>. Một đồ thị là đồ thị hàm số khi và chỉ khi mọi đường thẳng đứng cắt nó nhiều nhất một lần.</p>
<p>Khi hàm chỉ cho bằng công thức, <strong>tập xác định tự nhiên</strong> là mọi x làm công thức có nghĩa. Ba quy tắc phủ gần hết các trường hợp:</p>
<ul><li>mẫu số phải khác 0;</li><li>biểu thức dưới căn bậc chẵn phải ≥ 0;</li><li>đối số của logarit phải &gt; 0.</li></ul>
<div class="formula"><span class="lbl">Hàm tuyến tính</span>f(x) = mx + b    m = hệ số góc = Δy/Δx (đầu ra thay đổi bao nhiêu khi đầu vào tăng 1 đơn vị), b = f(0) = tung độ gốc</div>
<p>Mô hình tuyến tính là công cụ đầu tiên của phân tích kinh doanh. Nếu doanh nghiệp có <strong>chi phí cố định</strong> F (mặt bằng, lương, bản quyền phần mềm), <strong>chi phí biến đổi</strong> v mỗi sản phẩm, và bán mỗi sản phẩm giá p:</p>
<div class="formula"><span class="lbl">Chi phí – doanh thu – lợi nhuận</span>C(x) = F + v·x    R(x) = p·x    P(x) = R(x) − C(x) = (p − v)·x − F</div>
<p><strong>Điểm hoà vốn</strong> là nơi P(x) = 0, tức R(x) = C(x): x = F / (p − v). Số p − v gọi là <strong>số dư đảm phí</strong> — phần mỗi sản phẩm góp vào bù chi phí cố định.</p>
<p>Có những mức giá đổi quy tắc tại một ngưỡng. Hàm như vậy là <strong>hàm từng khúc</strong>: phải xác định đầu vào rơi vào khúc nào trước, rồi mới tính.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — tập xác định.</b> f(x) = √(6 − 2x) / (x + 1).</p><p>Căn: 6 − 2x ≥ 0 ⇒ x ≤ 3. Mẫu: x ≠ −1. Tập xác định: <b>(−∞, −1) ∪ (−1, 3]</b>. Lưu ý 3 được lấy (√0 = 0 vẫn được) còn −1 thì không.</p></div>
<div class="callout"><p><b>Ví dụ 2 — hoà vốn.</b> Một xưởng nhỏ in ốp lưng điện thoại theo yêu cầu. Chi phí cố định 1.500 $/tháng, vật liệu và in 12 $/chiếc, giá bán 20 $.</p><p>C(x) = 1500 + 12x, R(x) = 20x, P(x) = 8x − 1500. Hoà vốn: 8x = 1500 ⇒ x = 187,5, nên xưởng cần <b>188 chiếc</b>/tháng để hết lỗ. Bán 300 chiếc thì lãi P(300) = 2400 − 1500 = <b>900 $</b>. Hệ số góc 8 nghĩa là: mỗi chiếc bán thêm mang về thêm 8 $ lợi nhuận.</p></div>
<div class="callout"><p><b>Ví dụ 3 — hàm từng khúc.</b> Gói cước dữ liệu giá 100 (nghìn đồng), gồm 5 GB; mỗi GB vượt tính 15. Với g tính bằng GB:</p><p>C(g) = 100 nếu 0 ≤ g ≤ 5;  C(g) = 100 + 15(g − 5) nếu g &gt; 5. Khi đó C(3) = 100 và C(8) = 100 + 15·3 = <b>145</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên một trong các điều kiện khi công thức vừa có căn vừa có phân số.</li><li>Báo số hoà vốn lẻ (187,5 chiếc) mà không làm tròn <em>lên</em> thành số nguyên.</li><li>Nhầm hệ số góc (tốc độ mỗi đơn vị) với tung độ gốc (giá trị tại x = 0, ở đây là chi phí cố định).</li><li>Dùng sai khúc của hàm từng khúc — xét điều kiện trước.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Hàm số cho đúng một đầu ra với mỗi đầu vào; tập xác định là nơi công thức có nghĩa.</li><li>Quy tắc tập xác định: mẫu ≠ 0, căn chẵn ≥ 0, đối số logarit &gt; 0.</li><li>Trong y = mx + b, m là tốc độ thay đổi, b là giá trị ban đầu.</li><li>P = R − C; hoà vốn tại x = F/(p − v).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/1-1-review-of-functions" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 1.1 Ôn tập hàm số</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/1-2-basic-classes-of-functions" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 1.2 Các lớp hàm cơ bản</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/Functions.aspx" target="_blank" rel="noopener">Paul's Online Notes — Ôn tập hàm số</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm tập xác định của g(x) = ln(x − 3) / (x − 7).</li><li>Một ki-ốt cà phê có chi phí cố định 2.000 (nghìn đồng)/tháng, mỗi ly tốn 35 (nghìn đồng) để pha và bán giá 60 (nghìn đồng). Tìm số ly hoà vốn.</li><li>Một máy chủ trị giá 24.000 $ khấu hao tuyến tính 3.000 $/năm. Viết V(t) và tìm khi nào giá trị về 0.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) x − 3 &gt; 0 và x ≠ 7 ⇒ D = (3, 7) ∪ (7, ∞). 2) 60x = 2000 + 35x ⇒ 25x = 2000 ⇒ x = 80 ly. 3) V(t) = 24000 − 3000t; V = 0 khi t = 8 năm.</p></div>`);

const c12 = L('mac103-ts-1-2',
  '1.2 — Polynomial, rational, exponential and logarithmic models; compound interest|||1.2 — Mô hình đa thức, hữu tỉ, mũ và logarit; lãi kép',
  'Hàm bậc hai (doanh thu từ đường cầu, đỉnh parabol), hàm hữu tỉ (chi phí trung bình), hàm mũ (khấu hao, lãi kép, lãi liên tục, số e), logarit (thời gian nhân đôi, log₂ n trong thuật toán).',
  `<span class="eyebrow">MAC103 · Chapter 1 · Lesson 1.2</span>
<h2>Polynomial, rational, exponential and logarithmic models</h2>
<p class="lead">Straight lines are not enough: revenue curves bend, average cost falls, money and users grow exponentially. This lesson collects the families of functions you will differentiate and integrate for the rest of the semester.</p>
<h3>🎯 Objectives</h3>
<ul><li>Build a quadratic revenue model from a linear demand curve and find its vertex.</li><li>Use a rational function for average cost.</li><li>Apply exponential models: depreciation, compound and continuous interest.</li><li>Solve exponential equations with logarithms (doubling time, log<sub>2</sub> n).</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Polynomials</strong> a<sub>n</sub>x<sup>n</sup> + … + a<sub>1</sub>x + a<sub>0</sub> are defined everywhere. A quadratic ax<sup>2</sup> + bx + c has its vertex at x = −b/(2a): a maximum if a &lt; 0, a minimum if a &gt; 0. If the demand curve is linear, p = a − bx, then revenue R = p·x = ax − bx<sup>2</sup> is a downward parabola.</p>
<p><strong>Rational functions</strong> are quotients of polynomials. The typical business example is <strong>average cost</strong> AC(x) = C(x)/x: with C(x) = 1500 + 12x, AC(x) = 12 + 1500/x — the fixed cost is spread over more and more units.</p>
<p><strong>Exponential functions</strong> f(x) = a·b<sup>x</sup> (b &gt; 0, b ≠ 1) change by a constant <em>factor</em> per unit step, while linear functions change by a constant <em>amount</em>. Growth if b &gt; 1, decay if 0 &lt; b &lt; 1.</p>
<div class="formula"><span class="lbl">Compound interest</span>A = P(1 + r/n)<sup>nt</sup>    (n compounding periods per year)    Continuous: A = P·e<sup>rt</sup></div>
<p>As n → ∞, (1 + r/n)<sup>n</sup> approaches e<sup>r</sup>, where <strong>e ≈ 2.71828</strong>. This limit is why e is the natural base of calculus.</p>
<p>The <strong>logarithm</strong> log<sub>b</sub> y is the exponent x with b<sup>x</sup> = y; ln = log<sub>e</sub>. Key rules: ln(ab) = ln a + ln b, ln(a/b) = ln a − ln b, ln(a<sup>k</sup>) = k ln a. To solve b<sup>x</sup> = y, take logarithms: x = ln y / ln b.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — revenue.</b> Demand for a course subscription is p = 50 − 0.5x dollars (x subscribers, in hundreds). Then R(x) = 50x − 0.5x<sup>2</sup>. The vertex is at x = −50/(2·(−0.5)) = <b>50</b>, giving maximum revenue R(50) = 2500 − 1250 = <b>1250</b> (hundred dollars) at price p = $25.</p></div>
<div class="callout"><p><b>Example 2 — compounding.</b> Invest $1,000 at 6% per year for 5 years.</p><p>Annually: 1000·1.06<sup>5</sup> ≈ <b>$1,338.23</b>. Monthly: 1000·(1 + 0.06/12)<sup>60</sup> ≈ <b>$1,348.85</b>. Continuously: 1000·e<sup>0.3</sup> ≈ <b>$1,349.86</b>. More frequent compounding helps, but with diminishing returns.</p></div>
<div class="callout"><p><b>Example 3 — doubling time.</b> At 7% compounded continuously, solve e<sup>0.07t</sup> = 2: t = ln 2 / 0.07 ≈ <b>9.90 years</b>.</p></div>
<div class="callout"><p><b>Example 4 — depreciation and algorithms.</b> A $1,200 laptop loses 20% of its value each year: V(t) = 1200·0.8<sup>t</sup>, so V(3) = <b>$614.40</b>. In computing, binary search halves the list each step; for n = 1,000,000 items it needs about log<sub>2</sub> n ≈ <b>19.93</b>, i.e. 20 comparisons.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing r = 6 instead of r = 0.06 in interest formulas.</li><li>Believing ln(a + b) = ln a + ln b — false.</li><li>Treating a 20% yearly loss as subtracting 20% of the <em>original</em> value each year (that is linear, not exponential).</li><li>Forgetting that AC(x) is not defined at x = 0.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Quadratic vertex at x = −b/(2a); linear demand gives a parabolic revenue.</li><li>Average cost AC = C/x is rational and decreases toward the variable cost.</li><li>A = P(1 + r/n)<sup>nt</sup>; continuous compounding A = Pe<sup>rt</sup>.</li><li>Logarithms undo exponentials: b<sup>x</sup> = y ⇔ x = ln y / ln b.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/1-5-exponential-and-logarithmic-functions" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 1.5 Exponential and Logarithmic Functions</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/Alg/ExpFunctions.aspx" target="_blank" rel="noopener">Paul's Online Notes — Exponential Functions</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/Alg/LogFunctions.aspx" target="_blank" rel="noopener">Paul's Online Notes — Logarithm Functions</a></li><li><a href="https://en.wikipedia.org/wiki/Compound_interest" target="_blank" rel="noopener">Wikipedia — Compound interest</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>$5,000 is invested at 8% per year compounded quarterly. Find the value after 3 years.</li><li>How long does it take money to triple at 5% compounded continuously?</li><li>Solve 2<sup>x</sup> = 50.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 5000·(1 + 0.08/4)<sup>12</sup> = 5000·1.02<sup>12</sup> ≈ $6,341.21. 2) e<sup>0.05t</sup> = 3 ⇒ t = ln 3/0.05 ≈ 21.97 years. 3) x = ln 50/ln 2 ≈ 5.64.</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 1 · Bài 1.2</span>
<h2>Mô hình đa thức, hữu tỉ, mũ và logarit</h2>
<p class="lead">Đường thẳng là chưa đủ: đường doanh thu bị cong, chi phí trung bình giảm dần, tiền và người dùng tăng theo cấp số nhân. Bài này gom các họ hàm bạn sẽ lấy đạo hàm và tích phân suốt học kỳ.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dựng mô hình doanh thu bậc hai từ đường cầu tuyến tính và tìm đỉnh.</li><li>Dùng hàm hữu tỉ cho chi phí trung bình.</li><li>Áp dụng mô hình mũ: khấu hao, lãi kép, lãi liên tục.</li><li>Giải phương trình mũ bằng logarit (thời gian nhân đôi, log<sub>2</sub> n).</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Đa thức</strong> a<sub>n</sub>x<sup>n</sup> + … + a<sub>1</sub>x + a<sub>0</sub> xác định khắp nơi. Tam thức ax<sup>2</sup> + bx + c có đỉnh tại x = −b/(2a): cực đại nếu a &lt; 0, cực tiểu nếu a &gt; 0. Nếu đường cầu tuyến tính p = a − bx thì doanh thu R = p·x = ax − bx<sup>2</sup> là parabol úp xuống.</p>
<p><strong>Hàm hữu tỉ</strong> là thương hai đa thức. Ví dụ kinh doanh điển hình là <strong>chi phí trung bình</strong> AC(x) = C(x)/x: với C(x) = 1500 + 12x thì AC(x) = 12 + 1500/x — chi phí cố định được chia cho ngày càng nhiều sản phẩm.</p>
<p><strong>Hàm mũ</strong> f(x) = a·b<sup>x</sup> (b &gt; 0, b ≠ 1) thay đổi theo một <em>hệ số nhân</em> cố định mỗi bước, còn hàm tuyến tính thay đổi một <em>lượng</em> cố định. Tăng nếu b &gt; 1, giảm nếu 0 &lt; b &lt; 1.</p>
<div class="formula"><span class="lbl">Lãi kép</span>A = P(1 + r/n)<sup>nt</sup>    (n kỳ ghép lãi mỗi năm)    Liên tục: A = P·e<sup>rt</sup></div>
<p>Khi n → ∞, (1 + r/n)<sup>n</sup> tiến tới e<sup>r</sup>, với <strong>e ≈ 2,71828</strong>. Chính giới hạn này làm e thành cơ số tự nhiên của giải tích.</p>
<p><strong>Logarit</strong> log<sub>b</sub> y là số mũ x sao cho b<sup>x</sup> = y; ln = log<sub>e</sub>. Quy tắc chính: ln(ab) = ln a + ln b, ln(a/b) = ln a − ln b, ln(a<sup>k</sup>) = k ln a. Để giải b<sup>x</sup> = y, lấy logarit hai vế: x = ln y / ln b.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — doanh thu.</b> Cầu của một gói học trực tuyến là p = 50 − 0,5x đô la (x người đăng ký, đơn vị trăm). Khi đó R(x) = 50x − 0,5x<sup>2</sup>. Đỉnh tại x = −50/(2·(−0,5)) = <b>50</b>, doanh thu lớn nhất R(50) = 2500 − 1250 = <b>1250</b> (trăm đô) ở mức giá p = 25 $.</p></div>
<div class="callout"><p><b>Ví dụ 2 — ghép lãi.</b> Gửi 1.000 $ lãi 6%/năm trong 5 năm.</p><p>Ghép theo năm: 1000·1,06<sup>5</sup> ≈ <b>1.338,23 $</b>. Theo tháng: 1000·(1 + 0,06/12)<sup>60</sup> ≈ <b>1.348,85 $</b>. Liên tục: 1000·e<sup>0,3</sup> ≈ <b>1.349,86 $</b>. Ghép càng dày càng lợi, nhưng phần lợi thêm nhỏ dần.</p></div>
<div class="callout"><p><b>Ví dụ 3 — thời gian nhân đôi.</b> Lãi 7% ghép liên tục, giải e<sup>0,07t</sup> = 2: t = ln 2 / 0,07 ≈ <b>9,90 năm</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4 — khấu hao và thuật toán.</b> Laptop 1.200 $ mất 20% giá trị mỗi năm: V(t) = 1200·0,8<sup>t</sup>, nên V(3) = <b>614,40 $</b>. Trong tin học, tìm kiếm nhị phân chia đôi danh sách mỗi bước; với n = 1.000.000 phần tử cần khoảng log<sub>2</sub> n ≈ <b>19,93</b>, tức 20 lần so sánh.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết r = 6 thay vì r = 0,06 trong công thức lãi.</li><li>Tin rằng ln(a + b) = ln a + ln b — sai.</li><li>Coi “mất 20% mỗi năm” là trừ 20% giá trị <em>ban đầu</em> mỗi năm (đó là tuyến tính, không phải mũ).</li><li>Quên rằng AC(x) không xác định tại x = 0.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Đỉnh parabol tại x = −b/(2a); cầu tuyến tính cho doanh thu dạng parabol.</li><li>Chi phí trung bình AC = C/x là hàm hữu tỉ, giảm dần về chi phí biến đổi.</li><li>A = P(1 + r/n)<sup>nt</sup>; lãi liên tục A = Pe<sup>rt</sup>.</li><li>Logarit đảo ngược hàm mũ: b<sup>x</sup> = y ⇔ x = ln y / ln b.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/1-5-exponential-and-logarithmic-functions" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 1.5 Hàm mũ và hàm logarit</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/Alg/ExpFunctions.aspx" target="_blank" rel="noopener">Paul's Online Notes — Hàm mũ</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/Alg/LogFunctions.aspx" target="_blank" rel="noopener">Paul's Online Notes — Hàm logarit</a></li><li><a href="https://en.wikipedia.org/wiki/Compound_interest" target="_blank" rel="noopener">Wikipedia — Lãi kép (tiếng Anh)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Gửi 5.000 $ lãi 8%/năm ghép theo quý. Tính số tiền sau 3 năm.</li><li>Lãi 5% ghép liên tục thì bao lâu tiền tăng gấp ba?</li><li>Giải 2<sup>x</sup> = 50.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 5000·(1 + 0,08/4)<sup>12</sup> = 5000·1,02<sup>12</sup> ≈ 6.341,21 $. 2) e<sup>0,05t</sup> = 3 ⇒ t = ln 3/0,05 ≈ 21,97 năm. 3) x = ln 50/ln 2 ≈ 5,64.</p></div>`);

const c13 = L('mac103-ts-1-3',
  '1.3 — Composite and inverse functions; periodic models with sine and cosine|||1.3 — Hàm hợp và hàm ngược; mô hình tuần hoàn với sin và cos',
  'Hàm hợp (giảm giá rồi tính thuế, f∘g ≠ g∘f), hàm ngược (đổi vai x, y; điều kiện một–một), ln là hàm ngược của eˣ, radian, mô hình mùa vụ S(t) = 50 + 20 sin(πt/6): biên độ, chu kỳ.',
  `<span class="eyebrow">MAC103 · Chapter 1 · Lesson 1.3</span>
<h2>Composite and inverse functions; periodic models</h2>
<p class="lead">Real processes are chains: a price is discounted, then taxed; a signal is scaled, then shifted. Composition describes chains, inverses undo them, and sine/cosine describe anything that repeats — seasonal sales, daily server load, sound.</p>
<h3>🎯 Objectives</h3>
<ul><li>Form and evaluate composite functions, and see that f∘g ≠ g∘f in general.</li><li>Find the inverse of a one-to-one function and check it.</li><li>Use ln as the inverse of e<sup>x</sup> to solve growth equations.</li><li>Read amplitude, period and midline of a sinusoidal model.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Composition</span>(f∘g)(x) = f(g(x))    — apply g first, then f</div>
<p>The domain of f∘g is the set of x in the domain of g for which g(x) lies in the domain of f. The chain rule in Chapter 3 is the derivative of a composition, so learning to <em>see</em> compositions now pays off later.</p>
<p>A function is <strong>one-to-one</strong> if different inputs always give different outputs (horizontal line test). Then it has an <strong>inverse</strong> f<sup>−1</sup> with f<sup>−1</sup>(f(x)) = x and f(f<sup>−1</sup>(y)) = y. To find it: write y = f(x), solve for x in terms of y, then rename the variables. The graph of f<sup>−1</sup> is the mirror image of f in the line y = x.</p>
<div class="formula"><span class="lbl">Exp and ln are inverses</span>ln(e<sup>x</sup>) = x for all x    e<sup>ln x</sup> = x for x &gt; 0</div>
<p><strong>Periodic models.</strong> Angles in calculus are measured in <strong>radians</strong> (π rad = 180°). The function y = A sin(Bt) + D oscillates around the midline y = D with amplitude |A| and <strong>period</strong> 2π/|B|. Cosine is the same wave shifted: cos t = sin(t + π/2).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — order matters.</b> A shop gives 20% off, d(p) = 0.8p, and then adds 10% VAT, t(p) = 1.1p. A $100 item costs t(d(100)) = 1.1·80 = <b>$88</b>. (Here the order does not change the price, because both steps are multiplications.)</p><p>Now take f(x) = x<sup>2</sup> + 1 and g(x) = 3x − 2: f(g(x)) = (3x − 2)<sup>2</sup> + 1 = <b>9x<sup>2</sup> − 12x + 5</b>, but g(f(x)) = 3(x<sup>2</sup> + 1) − 2 = <b>3x<sup>2</sup> + 1</b>. Different!</p></div>
<div class="callout"><p><b>Example 2 — inverse.</b> f(x) = (4x − 1)/(x + 2). Write y(x + 2) = 4x − 1 ⇒ xy + 2y = 4x − 1 ⇒ x(y − 4) = −(2y + 1) ⇒ x = (2y + 1)/(4 − y). So <b>f<sup>−1</sup>(x) = (2x + 1)/(4 − x)</b>. Check: f(0) = −1/2 and f<sup>−1</sup>(−1/2) = 0/4.5 = 0 ✓.</p></div>
<div class="callout"><p><b>Example 3 — using ln.</b> An app has 100 thousand users growing as N(t) = 100e<sup>0.04t</sup> (t in months). When does it reach 300 thousand? e<sup>0.04t</sup> = 3 ⇒ 0.04t = ln 3 ⇒ t ≈ <b>27.47 months</b>.</p></div>
<div class="callout"><p><b>Example 4 — seasonal sales.</b> Monthly ice-cream sales (tonnes) are modelled by S(t) = 50 + 20 sin(πt/6), t in months. Midline 50, amplitude 20, period 2π/(π/6) = <b>12 months</b>. Maximum S(3) = <b>70</b>, minimum S(9) = <b>30</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Reading f(g(x)) as “f times g”. It means “g first, then f”.</li><li>Writing f<sup>−1</sup>(x) = 1/f(x). The inverse function is not the reciprocal.</li><li>Using degrees in sin/cos inside calculus formulas — always radians.</li><li>Confusing the period 2π/B with B itself.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>(f∘g)(x) = f(g(x)); in general f∘g ≠ g∘f.</li><li>Inverse: solve y = f(x) for x; graph reflected in y = x.</li><li>ln and e<sup>x</sup> undo each other — the key to solving growth equations.</li><li>A sin(Bt) + D: amplitude |A|, period 2π/|B|, midline D.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/1-4-inverse-functions" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 1.4 Inverse Functions</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/1-3-trigonometric-functions" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 1.3 Trigonometric Functions</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/Alg/InverseFunctions.aspx" target="_blank" rel="noopener">Paul's Online Notes — Inverse Functions</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>f(x) = √(x − 1), g(x) = x<sup>2</sup> + 1. Simplify f(g(x)).</li><li>Find the inverse of h(x) = 5 + 3e<sup>2x</sup>.</li><li>Find the period and amplitude of y = 4cos(πt/3).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) f(g(x)) = √(x<sup>2</sup>) = |x| (not simply x). 2) y − 5 = 3e<sup>2x</sup> ⇒ x = ½ ln((y − 5)/3), so h<sup>−1</sup>(x) = ½ ln((x − 5)/3), defined for x &gt; 5. 3) Period 2π/(π/3) = 6, amplitude 4.</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 1 · Bài 1.3</span>
<h2>Hàm hợp và hàm ngược; mô hình tuần hoàn</h2>
<p class="lead">Quá trình thực tế là chuỗi bước: giá được giảm, rồi bị tính thuế; tín hiệu được phóng to, rồi dịch chuyển. Hàm hợp mô tả chuỗi, hàm ngược hoàn tác chuỗi, còn sin/cos mô tả mọi thứ lặp lại — doanh số mùa vụ, tải máy chủ theo ngày, âm thanh.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Lập và tính hàm hợp, thấy rằng thường f∘g ≠ g∘f.</li><li>Tìm hàm ngược của hàm một–một và kiểm tra lại.</li><li>Dùng ln như hàm ngược của e<sup>x</sup> để giải phương trình tăng trưởng.</li><li>Đọc biên độ, chu kỳ, đường trung bình của mô hình hình sin.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Hàm hợp</span>(f∘g)(x) = f(g(x))    — làm g trước, rồi đến f</div>
<p>Tập xác định của f∘g gồm các x thuộc tập xác định của g sao cho g(x) thuộc tập xác định của f. Quy tắc dây chuyền ở Chương 3 chính là đạo hàm của hàm hợp, nên tập <em>nhìn ra</em> hàm hợp từ bây giờ sẽ có lợi về sau.</p>
<p>Hàm là <strong>một–một</strong> nếu hai đầu vào khác nhau luôn cho hai đầu ra khác nhau (phép thử đường nằm ngang). Khi đó nó có <strong>hàm ngược</strong> f<sup>−1</sup> với f<sup>−1</sup>(f(x)) = x và f(f<sup>−1</sup>(y)) = y. Cách tìm: viết y = f(x), giải x theo y, rồi đổi tên biến. Đồ thị f<sup>−1</sup> đối xứng với đồ thị f qua đường y = x.</p>
<div class="formula"><span class="lbl">Mũ và ln là hai hàm ngược nhau</span>ln(e<sup>x</sup>) = x với mọi x    e<sup>ln x</sup> = x với x &gt; 0</div>
<p><strong>Mô hình tuần hoàn.</strong> Trong giải tích góc đo bằng <strong>radian</strong> (π rad = 180°). Hàm y = A sin(Bt) + D dao động quanh đường trung bình y = D với biên độ |A| và <strong>chu kỳ</strong> 2π/|B|. Cos là cùng sóng đó dịch đi: cos t = sin(t + π/2).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — thứ tự quan trọng.</b> Cửa hàng giảm 20%, d(p) = 0,8p, rồi cộng 10% VAT, t(p) = 1,1p. Món 100 $ có giá t(d(100)) = 1,1·80 = <b>88 $</b>. (Ở đây đổi thứ tự không đổi giá, vì cả hai bước đều là phép nhân.)</p><p>Giờ lấy f(x) = x<sup>2</sup> + 1 và g(x) = 3x − 2: f(g(x)) = (3x − 2)<sup>2</sup> + 1 = <b>9x<sup>2</sup> − 12x + 5</b>, nhưng g(f(x)) = 3(x<sup>2</sup> + 1) − 2 = <b>3x<sup>2</sup> + 1</b>. Khác nhau!</p></div>
<div class="callout"><p><b>Ví dụ 2 — hàm ngược.</b> f(x) = (4x − 1)/(x + 2). Viết y(x + 2) = 4x − 1 ⇒ xy + 2y = 4x − 1 ⇒ x(y − 4) = −(2y + 1) ⇒ x = (2y + 1)/(4 − y). Vậy <b>f<sup>−1</sup>(x) = (2x + 1)/(4 − x)</b>. Kiểm: f(0) = −1/2 và f<sup>−1</sup>(−1/2) = 0/4,5 = 0 ✓.</p></div>
<div class="callout"><p><b>Ví dụ 3 — dùng ln.</b> Một ứng dụng có 100 nghìn người dùng, tăng theo N(t) = 100e<sup>0,04t</sup> (t tính bằng tháng). Khi nào đạt 300 nghìn? e<sup>0,04t</sup> = 3 ⇒ 0,04t = ln 3 ⇒ t ≈ <b>27,47 tháng</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4 — doanh số mùa vụ.</b> Doanh số kem hằng tháng (tấn) mô hình hoá bởi S(t) = 50 + 20 sin(πt/6), t tính bằng tháng. Đường trung bình 50, biên độ 20, chu kỳ 2π/(π/6) = <b>12 tháng</b>. Lớn nhất S(3) = <b>70</b>, nhỏ nhất S(9) = <b>30</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đọc f(g(x)) thành “f nhân g”. Nó nghĩa là “g trước, rồi f”.</li><li>Viết f<sup>−1</sup>(x) = 1/f(x). Hàm ngược không phải nghịch đảo số học.</li><li>Dùng độ trong sin/cos ở công thức giải tích — luôn dùng radian.</li><li>Nhầm chu kỳ 2π/B với chính B.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>(f∘g)(x) = f(g(x)); thường f∘g ≠ g∘f.</li><li>Hàm ngược: giải y = f(x) theo x; đồ thị đối xứng qua y = x.</li><li>ln và e<sup>x</sup> hoàn tác lẫn nhau — chìa khoá giải phương trình tăng trưởng.</li><li>A sin(Bt) + D: biên độ |A|, chu kỳ 2π/|B|, đường trung bình D.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/1-4-inverse-functions" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 1.4 Hàm ngược</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/1-3-trigonometric-functions" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 1.3 Hàm lượng giác</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/Alg/InverseFunctions.aspx" target="_blank" rel="noopener">Paul's Online Notes — Hàm ngược</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>f(x) = √(x − 1), g(x) = x<sup>2</sup> + 1. Rút gọn f(g(x)).</li><li>Tìm hàm ngược của h(x) = 5 + 3e<sup>2x</sup>.</li><li>Tìm chu kỳ và biên độ của y = 4cos(πt/3).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) f(g(x)) = √(x<sup>2</sup>) = |x| (không chỉ đơn giản là x). 2) y − 5 = 3e<sup>2x</sup> ⇒ x = ½ ln((y − 5)/3), nên h<sup>−1</sup>(x) = ½ ln((x − 5)/3), xác định với x &gt; 5. 3) Chu kỳ 2π/(π/3) = 6, biên độ 4.</p></div>`);

const q1 = QZ(1, 'Quiz — Chapter 1: Functions and models|||Quiz — Chương 1: Hàm số và mô hình', 'Kiểm tra chương 1: tập xác định, hoà vốn, hàm từng khúc, đỉnh parabol doanh thu, lãi kép, logarit, hàm hợp, hàm ngược, chu kỳ.', [
  Q('q1', 'The domain of f(x) = √(6 − 2x)/(x + 1) is|||Tập xác định của f(x) = √(6 − 2x)/(x + 1) là',
    ['(−∞, 3]|||(−∞, 3]', '(−1, 3)|||(−1, 3)', '[3, ∞)|||[3, ∞)', '(−∞, −1) ∪ (−1, 3]|||(−∞, −1) ∪ (−1, 3]'], 3,
    'Need 6 − 2x ≥ 0 (x ≤ 3) and x ≠ −1.|||Cần 6 − 2x ≥ 0 (x ≤ 3) và x ≠ −1.'),
  Q('q2', 'Fixed cost $4,000, variable cost $15/unit, price $35/unit. Break-even quantity?|||Chi phí cố định 4.000 $, chi phí biến đổi 15 $/sp, giá 35 $/sp. Sản lượng hoà vốn?',
    ['100|||100', '160|||160', '200|||200', '267|||267'], 2,
    'x = 4000/(35 − 15) = 200.|||x = 4000/(35 − 15) = 200.'),
  Q('q3', 'A plan costs 100 for up to 5 GB, plus 15 per extra GB. Cost of 7 GB?|||Gói cước 100 cho tới 5 GB, cộng 15 mỗi GB vượt. Giá khi dùng 7 GB?',
    ['105|||105', '115|||115', '130|||130', '205|||205'], 2,
    '100 + 15·(7 − 5) = 130.|||100 + 15·(7 − 5) = 130.'),
  Q('q4', 'Demand p = 80 − 2x. Which x maximises revenue R = p·x?|||Cầu p = 80 − 2x. x nào làm doanh thu R = p·x lớn nhất?',
    ['10|||10', '20|||20', '40|||40', '80|||80'], 1,
    'R = 80x − 2x², vertex at x = −80/(2·(−2)) = 20.|||R = 80x − 2x², đỉnh tại x = −80/(2·(−2)) = 20.'),
  Q('q5', '$2,000 at 5% compounded continuously for 4 years grows to about|||2.000 $ lãi 5% ghép liên tục trong 4 năm thành khoảng',
    ['$2,400.00|||2.400,00 $', '$2,431.01|||2.431,01 $', '$2,442.81|||2.442,81 $', '$2,500.00|||2.500,00 $'], 2,
    '2000·e^0.2 ≈ 2442.81 (2431.01 is annual compounding).|||2000·e^0,2 ≈ 2442,81 (2431,01 là ghép theo năm).'),
  Q('q6', 'At 10% compounded continuously, the doubling time is about|||Lãi 10% ghép liên tục, thời gian nhân đôi khoảng',
    ['6.93 years|||6,93 năm', '5 years|||5 năm', '7.2 years|||7,2 năm', '10 years|||10 năm'], 0,
    't = ln 2/0.10 ≈ 6.93.|||t = ln 2/0,10 ≈ 6,93.'),
  Q('q7', 'Which statement is TRUE?|||Khẳng định nào ĐÚNG?',
    ['ln(a + b) = ln a + ln b|||ln(a + b) = ln a + ln b', 'ln(a/b) = ln a / ln b|||ln(a/b) = ln a / ln b', 'ln(a³) = 3 ln a (a > 0)|||ln(a³) = 3 ln a (a > 0)', 'ln(e + 1) = 2|||ln(e + 1) = 2'], 2,
    'Power rule of logarithms; the others are common mistakes.|||Quy tắc luỹ thừa của logarit; các câu kia là lỗi hay gặp.'),
  Q('q8', 'If f(x) = x² + 1 and g(x) = 3x − 2, then g(f(x)) =|||Nếu f(x) = x² + 1 và g(x) = 3x − 2 thì g(f(x)) =',
    ['9x² − 12x + 5|||9x² − 12x + 5', '3x² + 1|||3x² + 1', '3x² − 1|||3x² − 1', '3x³ − 2x² + 3x − 2|||3x³ − 2x² + 3x − 2'], 1,
    'g(f(x)) = 3(x² + 1) − 2 = 3x² + 1; the first option is f(g(x)).|||g(f(x)) = 3(x² + 1) − 2 = 3x² + 1; lựa chọn đầu là f(g(x)).'),
  Q('q9', 'The inverse of f(x) = (4x − 1)/(x + 2) is|||Hàm ngược của f(x) = (4x − 1)/(x + 2) là',
    ['(2x + 1)/(4 − x)|||(2x + 1)/(4 − x)', '(x + 2)/(4x − 1)|||(x + 2)/(4x − 1)', '(4x + 1)/(x − 2)|||(4x + 1)/(x − 2)', '(2x − 1)/(x + 4)|||(2x − 1)/(x + 4)'], 0,
    'Solve y(x + 2) = 4x − 1 for x: x = (2y + 1)/(4 − y).|||Giải y(x + 2) = 4x − 1 theo x: x = (2y + 1)/(4 − y).'),
  Q('q10', 'The period of S(t) = 50 + 20 sin(πt/6) is|||Chu kỳ của S(t) = 50 + 20 sin(πt/6) là',
    ['6|||6', '20|||20', 'π/6|||π/6', '12|||12'], 3,
    'Period = 2π/(π/6) = 12.|||Chu kỳ = 2π/(π/6) = 12.'),
]);

const ch1 = {
  title: 'Chapter 1 — Functions and models|||Chương 1 — Hàm số và mô hình',
  description: 'Hàm số, tập xác định, mô hình tuyến tính (chi phí – doanh thu – lợi nhuận, hoà vốn), đa thức, hữu tỉ, mũ – logarit, lãi kép, hàm hợp, hàm ngược, mô hình tuần hoàn (Stewart ch.1 · OpenStax Vol.1 ch.1).',
  lessons: [c11, c12, c13, q1],
};

// ───────────────────────────── Chương 2 — Giới hạn & liên tục ─────────────────────────────
const c21 = L('mac103-ts-2-1',
  '2.1 — The idea of a limit: tables, one-sided limits, limit laws and infinite limits|||2.1 — Ý tưởng giới hạn: bảng số, giới hạn một phía, luật giới hạn, giới hạn vô cực',
  'Giới hạn là giá trị hàm tiến tới khi x tiến tới a (không phải f(a)); ước lượng bằng bảng số; giới hạn trái/phải; luật giới hạn và thế trực tiếp; giới hạn vô cực và tiệm cận đứng.',
  `<span class="eyebrow">MAC103 · Chapter 2 · Lesson 2.1</span>
<h2>The idea of a limit</h2>
<p class="lead">Calculus begins with one question: what value does f(x) <em>approach</em> as x gets closer and closer to a? The answer — the limit — is what makes it possible to talk about instantaneous speed, marginal cost and area under a curve.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain in words what lim<sub>x→a</sub> f(x) = L means.</li><li>Estimate a limit from a table of values.</li><li>Compute one-sided limits and decide whether a two-sided limit exists.</li><li>Use the limit laws (direct substitution) and recognise infinite limits.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Limit</span>lim<sub>x→a</sub> f(x) = L    means: f(x) can be made as close to L as we like by taking x close enough to a (but x ≠ a)</div>
<p>The value f(a) plays <strong>no role</strong>: f(a) may be different from L, or f may not even be defined at a. This is exactly the situation of the derivative later, where the formula becomes 0/0 at the point of interest.</p>
<p><strong>One-sided limits.</strong> lim<sub>x→a<sup>−</sup></sub> f(x) uses only x &lt; a (from the left), lim<sub>x→a<sup>+</sup></sub> f(x) only x &gt; a. The two-sided limit exists <strong>if and only if</strong> both one-sided limits exist and are equal.</p>
<div class="formula"><span class="lbl">Limit laws</span>lim (f ± g) = lim f ± lim g    lim (c·f) = c·lim f    lim (f·g) = lim f · lim g    lim (f/g) = lim f / lim g  (if lim g ≠ 0)</div>
<p>Consequence: for polynomials and for rational functions whose denominator is not 0 at a, the limit is found by <strong>direct substitution</strong>: lim<sub>x→a</sub> f(x) = f(a).</p>
<p><strong>Infinite limits.</strong> If f(x) grows without bound as x → a, we write lim f(x) = ∞ (or −∞). The limit does not exist as a number, but the notation tells us the line x = a is a <strong>vertical asymptote</strong>.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — a table.</b> f(x) = (x<sup>3</sup> − 1)/(x − 1) is undefined at x = 1. With x = 1 + h:</p><p>h = 0.1 → 3.31;  h = 0.01 → 3.0301;  h = 0.001 → 3.003001. The values approach 3. Algebra confirms it: x<sup>3</sup> − 1 = (x − 1)(x<sup>2</sup> + x + 1), so the quotient equals x<sup>2</sup> + x + 1 → <b>3</b>.</p></div>
<div class="callout"><p><b>Example 2 — one-sided limits that agree.</b> f(x) = x + 1 for x &lt; 2 and f(x) = 5 − x for x ≥ 2. Left: 2 + 1 = 3. Right: 5 − 2 = 3. Both are 3, so lim<sub>x→2</sub> f(x) = <b>3</b>.</p></div>
<div class="callout"><p><b>Example 3 — one-sided limits that disagree.</b> g(x) = |x + 1|/(x + 1). For x &gt; −1 it equals 1, for x &lt; −1 it equals −1. Left limit −1, right limit 1 ⇒ lim<sub>x→−1</sub> g(x) <b>does not exist</b> (a jump).</p></div>
<div class="callout"><p><b>Example 4 — limit laws.</b> lim<sub>x→2</sub> (3x<sup>2</sup> − x + 4) = 12 − 2 + 4 = <b>14</b>. lim<sub>x→−1</sub> (x<sup>2</sup> + 2x + 5)/(x + 3) = 4/2 = <b>2</b> (denominator ≠ 0, so substitution is allowed).</p></div>
<div class="callout"><p><b>Example 5 — infinite limit.</b> As x → 3<sup>+</sup>, x − 3 is a tiny positive number, so 1/(x − 3) → +∞; as x → 3<sup>−</sup> it → −∞. The line x = 3 is a vertical asymptote.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Saying “the limit is f(a)” for every function — only true when f is continuous at a.</li><li>Concluding “0/0 means the limit is 0” or “does not exist”. 0/0 is an <em>indeterminate form</em>: simplify first (next lesson).</li><li>Checking only one side for piecewise functions.</li><li>Trusting a table blindly — rounding can hide what really happens; confirm algebraically.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>lim<sub>x→a</sub> f(x) describes the approach, not the value at a.</li><li>Two-sided limit exists ⇔ left and right limits exist and are equal.</li><li>Polynomials and “safe” rational functions: substitute directly.</li><li>Infinite limits signal vertical asymptotes.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/2-2-the-limit-of-a-function" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 2.2 The Limit of a Function</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/2-3-the-limit-laws" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 2.3 The Limit Laws</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/OneSidedLimits.aspx" target="_blank" rel="noopener">Paul's Online Notes — One-Sided Limits</a></li><li><a href="https://www.3blue1brown.com/lessons/limits" target="_blank" rel="noopener">3Blue1Brown — Limits</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Compute lim<sub>x→4</sub> (x<sup>2</sup> − 4x)/(x − 4).</li><li>Find lim<sub>x→2</sub> (x − 3)/(x − 2)<sup>2</sup>.</li><li>h(x) = 2x for x &lt; 1, h(x) = x<sup>2</sup> + 3 for x ≥ 1. Does lim<sub>x→1</sub> h(x) exist?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) x(x − 4)/(x − 4) = x → 4. 2) The numerator → −1 and the denominator → 0 through positive values from both sides, so the quotient → <b>−∞</b> (vertical asymptote x = 2). 3) Left 2·1 = 2, right 1 + 3 = 4 ⇒ the limit does not exist.</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 2 · Bài 2.1</span>
<h2>Ý tưởng giới hạn</h2>
<p class="lead">Giải tích bắt đầu từ một câu hỏi: f(x) <em>tiến tới</em> giá trị nào khi x càng lúc càng gần a? Câu trả lời — giới hạn — là thứ cho phép nói về tốc độ tức thời, chi phí biên và diện tích dưới đường cong.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích bằng lời lim<sub>x→a</sub> f(x) = L nghĩa là gì.</li><li>Ước lượng giới hạn từ bảng giá trị.</li><li>Tính giới hạn một phía và quyết định giới hạn hai phía có tồn tại không.</li><li>Dùng luật giới hạn (thế trực tiếp) và nhận ra giới hạn vô cực.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Giới hạn</span>lim<sub>x→a</sub> f(x) = L    nghĩa là: f(x) gần L tuỳ ý khi lấy x đủ gần a (nhưng x ≠ a)</div>
<p>Giá trị f(a) <strong>không đóng vai trò gì</strong>: f(a) có thể khác L, thậm chí f không xác định tại a. Đây chính là tình huống của đạo hàm về sau, khi công thức thành 0/0 tại đúng điểm cần xét.</p>
<p><strong>Giới hạn một phía.</strong> lim<sub>x→a<sup>−</sup></sub> f(x) chỉ dùng x &lt; a (từ bên trái), lim<sub>x→a<sup>+</sup></sub> f(x) chỉ dùng x &gt; a. Giới hạn hai phía tồn tại <strong>khi và chỉ khi</strong> cả hai giới hạn một phía tồn tại và bằng nhau.</p>
<div class="formula"><span class="lbl">Luật giới hạn</span>lim (f ± g) = lim f ± lim g    lim (c·f) = c·lim f    lim (f·g) = lim f · lim g    lim (f/g) = lim f / lim g  (nếu lim g ≠ 0)</div>
<p>Hệ quả: với đa thức, và hàm hữu tỉ có mẫu khác 0 tại a, giới hạn tính bằng <strong>thế trực tiếp</strong>: lim<sub>x→a</sub> f(x) = f(a).</p>
<p><strong>Giới hạn vô cực.</strong> Nếu f(x) tăng không bị chặn khi x → a, ta viết lim f(x) = ∞ (hoặc −∞). Giới hạn không tồn tại như một số, nhưng ký hiệu cho biết đường x = a là <strong>tiệm cận đứng</strong>.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — bảng số.</b> f(x) = (x<sup>3</sup> − 1)/(x − 1) không xác định tại x = 1. Với x = 1 + h:</p><p>h = 0,1 → 3,31;  h = 0,01 → 3,0301;  h = 0,001 → 3,003001. Các giá trị tiến về 3. Đại số khẳng định: x<sup>3</sup> − 1 = (x − 1)(x<sup>2</sup> + x + 1), nên thương bằng x<sup>2</sup> + x + 1 → <b>3</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — hai giới hạn một phía bằng nhau.</b> f(x) = x + 1 khi x &lt; 2 và f(x) = 5 − x khi x ≥ 2. Trái: 2 + 1 = 3. Phải: 5 − 2 = 3. Cả hai bằng 3 nên lim<sub>x→2</sub> f(x) = <b>3</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — hai giới hạn một phía khác nhau.</b> g(x) = |x + 1|/(x + 1). Khi x &gt; −1 nó bằng 1, khi x &lt; −1 nó bằng −1. Giới hạn trái −1, phải 1 ⇒ lim<sub>x→−1</sub> g(x) <b>không tồn tại</b> (bước nhảy).</p></div>
<div class="callout"><p><b>Ví dụ 4 — luật giới hạn.</b> lim<sub>x→2</sub> (3x<sup>2</sup> − x + 4) = 12 − 2 + 4 = <b>14</b>. lim<sub>x→−1</sub> (x<sup>2</sup> + 2x + 5)/(x + 3) = 4/2 = <b>2</b> (mẫu ≠ 0 nên được thế).</p></div>
<div class="callout"><p><b>Ví dụ 5 — giới hạn vô cực.</b> Khi x → 3<sup>+</sup>, x − 3 là số dương rất nhỏ nên 1/(x − 3) → +∞; khi x → 3<sup>−</sup> thì → −∞. Đường x = 3 là tiệm cận đứng.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nói “giới hạn là f(a)” với mọi hàm — chỉ đúng khi f liên tục tại a.</li><li>Kết luận “0/0 nghĩa là giới hạn bằng 0” hoặc “không tồn tại”. 0/0 là <em>dạng vô định</em>: phải rút gọn trước (bài sau).</li><li>Chỉ xét một phía với hàm từng khúc.</li><li>Tin bảng số tuyệt đối — làm tròn có thể che mất điều thật sự xảy ra; hãy khẳng định bằng đại số.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>lim<sub>x→a</sub> f(x) mô tả sự tiến tới, không phải giá trị tại a.</li><li>Giới hạn hai phía tồn tại ⇔ giới hạn trái và phải tồn tại và bằng nhau.</li><li>Đa thức và hàm hữu tỉ “an toàn”: thế trực tiếp.</li><li>Giới hạn vô cực báo hiệu tiệm cận đứng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/2-2-the-limit-of-a-function" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 2.2 Giới hạn của hàm số</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/2-3-the-limit-laws" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 2.3 Các luật giới hạn</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/OneSidedLimits.aspx" target="_blank" rel="noopener">Paul's Online Notes — Giới hạn một phía</a></li><li><a href="https://www.3blue1brown.com/lessons/limits" target="_blank" rel="noopener">3Blue1Brown — Giới hạn</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tính lim<sub>x→4</sub> (x<sup>2</sup> − 4x)/(x − 4).</li><li>Tìm lim<sub>x→2</sub> (x − 3)/(x − 2)<sup>2</sup>.</li><li>h(x) = 2x khi x &lt; 1, h(x) = x<sup>2</sup> + 3 khi x ≥ 1. lim<sub>x→1</sub> h(x) có tồn tại không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) x(x − 4)/(x − 4) = x → 4. 2) Tử → −1, mẫu → 0 qua các giá trị dương từ cả hai phía, nên thương → <b>−∞</b> (tiệm cận đứng x = 2). 3) Trái 2·1 = 2, phải 1 + 3 = 4 ⇒ giới hạn không tồn tại.</p></div>`);

const c22 = L('mac103-ts-2-2',
  '2.2 — Computing limits: indeterminate forms, limits at infinity and asymptotes|||2.2 — Tính giới hạn: dạng vô định, giới hạn tại vô cực và tiệm cận',
  'Khử dạng 0/0 bằng phân tích nhân tử và nhân liên hợp; giới hạn tại vô cực của hàm hữu tỉ (so bậc), tiệm cận ngang; ý nghĩa kinh doanh: chi phí trung bình dài hạn, mức bão hoà người dùng; định lý kẹp với (sin x)/x khi x → ∞.',
  `<span class="eyebrow">MAC103 · Chapter 2 · Lesson 2.2</span>
<h2>Computing limits: indeterminate forms and limits at infinity</h2>
<p class="lead">Direct substitution fails exactly in the interesting cases: 0/0 at a point, or ∞/∞ far away. This lesson gives the algebraic tools to resolve them — and shows what “the long run” means for costs and user growth.</p>
<h3>🎯 Objectives</h3>
<ul><li>Resolve 0/0 limits by factoring and by multiplying by a conjugate.</li><li>Compute limits of rational functions as x → ±∞ by comparing degrees.</li><li>Find horizontal and vertical asymptotes.</li><li>Interpret long-run limits in business and technology models.</li></ul>
<h3>📖 Lecture</h3>
<p>If substitution gives a non-zero number over 0, the limit is infinite (or one-sided infinities). If it gives <strong>0/0</strong>, the expression hides a common factor. Two standard moves:</p>
<ul><li><strong>Factor and cancel</strong> (polynomials): the factor (x − a) appears in both numerator and denominator.</li><li><strong>Multiply by the conjugate</strong> (square roots): (√A − B)(√A + B) = A − B<sup>2</sup>.</li></ul>
<p>Cancelling is legal because the limit never uses x = a itself.</p>
<p><strong>Limits at infinity.</strong> lim<sub>x→∞</sub> f(x) = L means f(x) gets close to L when x is large; then y = L is a <strong>horizontal asymptote</strong>. Basic facts: 1/x<sup>k</sup> → 0 for k &gt; 0, and e<sup>−x</sup> → 0. For a rational function, divide numerator and denominator by the highest power of x in the denominator:</p>
<div class="formula"><span class="lbl">Rational function P(x)/Q(x) as x → ±∞</span>deg P &lt; deg Q ⇒ limit 0    deg P = deg Q ⇒ ratio of leading coefficients    deg P &gt; deg Q ⇒ ±∞ (no horizontal asymptote)</div>
<div class="formula"><span class="lbl">Squeeze theorem</span>if g(x) ≤ f(x) ≤ h(x) near a and lim g = lim h = L, then lim f = L</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — factoring.</b> lim<sub>x→3</sub> (x<sup>2</sup> − 9)/(x<sup>2</sup> − x − 6). Substitution gives 0/0. Factor: (x − 3)(x + 3) / [(x − 3)(x + 2)] = (x + 3)/(x + 2) → 6/5. Answer <b>6/5</b>.</p></div>
<div class="callout"><p><b>Example 2 — conjugate.</b> lim<sub>x→4</sub> (√(2x + 1) − 3)/(x − 4). Multiply top and bottom by √(2x + 1) + 3: numerator becomes (2x + 1) − 9 = 2(x − 4). So the expression is 2/(√(2x + 1) + 3) → 2/6 = <b>1/3</b>.</p></div>
<div class="callout"><p><b>Example 3 — degrees.</b> lim<sub>x→∞</sub> (4x<sup>2</sup> − 5x)/(2x<sup>2</sup> + 7) = 4/2 = <b>2</b> (same degree). lim<sub>x→∞</sub> (3x + 1)/(x<sup>2</sup> + 2) = <b>0</b> (lower degree on top).</p></div>
<div class="callout"><p><b>Example 4 — long-run average cost.</b> With C(x) = 1500 + 12x, the average cost AC(x) = 12 + 1500/x → <b>12</b> as x → ∞. Business meaning: in mass production the fixed cost per unit vanishes, and each unit costs about its variable cost.</p></div>
<div class="callout"><p><b>Example 5 — saturation.</b> A new app's users (thousands) after t months: N(t) = 5000t/(t + 4). Divide by t: 5000/(1 + 4/t) → <b>5000</b>. The market saturates at 5 million users: y = 5000 is a horizontal asymptote.</p></div>
<div class="callout"><p><b>Example 6 — squeeze.</b> For x &gt; 0, −1/x ≤ (sin x)/x ≤ 1/x and both bounds → 0, so lim<sub>x→∞</sub> (sin x)/x = <b>0</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing “∞/∞ = 1” or “∞ − ∞ = 0”. These are indeterminate; transform first.</li><li>Cancelling terms instead of factors: (x<sup>2</sup> − 9)/(x − 3) is <em>not</em> x − 3 + …; factor first.</li><li>Forgetting that a rational function with higher degree on top has no horizontal asymptote.</li><li>Mixing up the limit at x → 0 of (sin x)/x (= 1) with the limit at x → ∞ (= 0).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>0/0: factor and cancel, or multiply by the conjugate.</li><li>At ±∞ compare degrees of numerator and denominator.</li><li>Horizontal asymptote y = L ⇔ f(x) → L as x → ±∞.</li><li>Long-run limits describe saturation and average cost in models.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ComputingLimits.aspx" target="_blank" rel="noopener">Paul's Online Notes — Computing Limits</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-6-limits-at-infinity-and-asymptotes" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 4.6 Limits at Infinity and Asymptotes</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/LimitsAtInfinityI.aspx" target="_blank" rel="noopener">Paul's Online Notes — Limits at Infinity, Part I</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>lim<sub>x→−2</sub> (x<sup>3</sup> + 8)/(x + 2).</li><li>lim<sub>x→∞</sub> (√(x<sup>2</sup> + 3x) − x).</li><li>lim<sub>x→∞</sub> (5 − 2x<sup>3</sup>)/(x<sup>3</sup> + x).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) x<sup>3</sup> + 8 = (x + 2)(x<sup>2</sup> − 2x + 4) ⇒ limit 4 + 4 + 4 = 12. 2) Multiply by the conjugate: 3x/(√(x<sup>2</sup> + 3x) + x) = 3/(√(1 + 3/x) + 1) → 3/2. 3) Same degree: −2/1 = −2.</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 2 · Bài 2.2</span>
<h2>Tính giới hạn: dạng vô định và giới hạn tại vô cực</h2>
<p class="lead">Phép thế trực tiếp thất bại đúng ở những chỗ thú vị: 0/0 tại một điểm, hoặc ∞/∞ ở rất xa. Bài này đưa công cụ đại số để khử chúng — và cho thấy “về lâu dài” nghĩa là gì với chi phí và tăng trưởng người dùng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Khử giới hạn dạng 0/0 bằng phân tích nhân tử và nhân liên hợp.</li><li>Tính giới hạn hàm hữu tỉ khi x → ±∞ bằng cách so bậc.</li><li>Tìm tiệm cận ngang và tiệm cận đứng.</li><li>Giải thích giới hạn dài hạn trong mô hình kinh doanh và công nghệ.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Nếu thế vào được một số khác 0 chia cho 0, giới hạn là vô cực (hoặc vô cực một phía). Nếu được <strong>0/0</strong>, biểu thức đang giấu một nhân tử chung. Hai bước chuẩn:</p>
<ul><li><strong>Phân tích rồi giản ước</strong> (đa thức): nhân tử (x − a) có ở cả tử và mẫu.</li><li><strong>Nhân liên hợp</strong> (căn bậc hai): (√A − B)(√A + B) = A − B<sup>2</sup>.</li></ul>
<p>Giản ước hợp lệ vì giới hạn không bao giờ dùng chính x = a.</p>
<p><strong>Giới hạn tại vô cực.</strong> lim<sub>x→∞</sub> f(x) = L nghĩa là f(x) gần L khi x lớn; khi đó y = L là <strong>tiệm cận ngang</strong>. Sự kiện cơ bản: 1/x<sup>k</sup> → 0 với k &gt; 0, và e<sup>−x</sup> → 0. Với hàm hữu tỉ, chia tử và mẫu cho luỹ thừa cao nhất của x ở mẫu:</p>
<div class="formula"><span class="lbl">Hàm hữu tỉ P(x)/Q(x) khi x → ±∞</span>bậc P &lt; bậc Q ⇒ giới hạn 0    bậc P = bậc Q ⇒ tỉ số hệ số cao nhất    bậc P &gt; bậc Q ⇒ ±∞ (không có tiệm cận ngang)</div>
<div class="formula"><span class="lbl">Định lý kẹp</span>nếu g(x) ≤ f(x) ≤ h(x) gần a và lim g = lim h = L thì lim f = L</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — phân tích nhân tử.</b> lim<sub>x→3</sub> (x<sup>2</sup> − 9)/(x<sup>2</sup> − x − 6). Thế vào được 0/0. Phân tích: (x − 3)(x + 3) / [(x − 3)(x + 2)] = (x + 3)/(x + 2) → 6/5. Đáp số <b>6/5</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — liên hợp.</b> lim<sub>x→4</sub> (√(2x + 1) − 3)/(x − 4). Nhân tử và mẫu với √(2x + 1) + 3: tử thành (2x + 1) − 9 = 2(x − 4). Biểu thức còn 2/(√(2x + 1) + 3) → 2/6 = <b>1/3</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — so bậc.</b> lim<sub>x→∞</sub> (4x<sup>2</sup> − 5x)/(2x<sup>2</sup> + 7) = 4/2 = <b>2</b> (cùng bậc). lim<sub>x→∞</sub> (3x + 1)/(x<sup>2</sup> + 2) = <b>0</b> (tử bậc thấp hơn).</p></div>
<div class="callout"><p><b>Ví dụ 4 — chi phí trung bình dài hạn.</b> Với C(x) = 1500 + 12x, chi phí trung bình AC(x) = 12 + 1500/x → <b>12</b> khi x → ∞. Ý nghĩa kinh doanh: sản xuất hàng loạt thì chi phí cố định trên mỗi sản phẩm biến mất, mỗi sản phẩm tốn xấp xỉ chi phí biến đổi.</p></div>
<div class="callout"><p><b>Ví dụ 5 — bão hoà.</b> Người dùng (nghìn) của một ứng dụng mới sau t tháng: N(t) = 5000t/(t + 4). Chia cho t: 5000/(1 + 4/t) → <b>5000</b>. Thị trường bão hoà ở 5 triệu người dùng: y = 5000 là tiệm cận ngang.</p></div>
<div class="callout"><p><b>Ví dụ 6 — định lý kẹp.</b> Với x &gt; 0, −1/x ≤ (sin x)/x ≤ 1/x và hai cận → 0, nên lim<sub>x→∞</sub> (sin x)/x = <b>0</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết “∞/∞ = 1” hay “∞ − ∞ = 0”. Đó là dạng vô định; phải biến đổi trước.</li><li>Giản ước số hạng thay vì nhân tử: (x<sup>2</sup> − 9)/(x − 3) <em>không</em> phải x − 3 + …; phân tích trước.</li><li>Quên rằng hàm hữu tỉ có tử bậc cao hơn thì không có tiệm cận ngang.</li><li>Lẫn giới hạn tại x → 0 của (sin x)/x (= 1) với giới hạn tại x → ∞ (= 0).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>0/0: phân tích rồi giản ước, hoặc nhân liên hợp.</li><li>Tại ±∞ so bậc của tử và mẫu.</li><li>Tiệm cận ngang y = L ⇔ f(x) → L khi x → ±∞.</li><li>Giới hạn dài hạn mô tả mức bão hoà và chi phí trung bình trong mô hình.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ComputingLimits.aspx" target="_blank" rel="noopener">Paul's Online Notes — Tính giới hạn</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-6-limits-at-infinity-and-asymptotes" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 4.6 Giới hạn tại vô cực và tiệm cận</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/LimitsAtInfinityI.aspx" target="_blank" rel="noopener">Paul's Online Notes — Giới hạn tại vô cực, phần I</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>lim<sub>x→−2</sub> (x<sup>3</sup> + 8)/(x + 2).</li><li>lim<sub>x→∞</sub> (√(x<sup>2</sup> + 3x) − x).</li><li>lim<sub>x→∞</sub> (5 − 2x<sup>3</sup>)/(x<sup>3</sup> + x).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) x<sup>3</sup> + 8 = (x + 2)(x<sup>2</sup> − 2x + 4) ⇒ giới hạn 4 + 4 + 4 = 12. 2) Nhân liên hợp: 3x/(√(x<sup>2</sup> + 3x) + x) = 3/(√(1 + 3/x) + 1) → 3/2. 3) Cùng bậc: −2/1 = −2.</p></div>`);

const c23 = L('mac103-ts-2-3',
  '2.3 — Continuity, the Intermediate Value Theorem and the bisection method|||2.3 — Tính liên tục, định lý giá trị trung gian và phương pháp chia đôi',
  'Ba điều kiện liên tục; ba loại gián đoạn (khử được, bước nhảy, vô cực) và ví dụ phí gửi xe; chọn tham số để hàm từng khúc liên tục; định lý giá trị trung gian; phương pháp chia đôi bằng Python (chạy thật).',
  `<span class="eyebrow">MAC103 · Chapter 2 · Lesson 2.3</span>
<h2>Continuity, the Intermediate Value Theorem and bisection</h2>
<p class="lead">A continuous function has no jumps, holes or breaks. That simple property guarantees something powerful: if a continuous function changes sign, it must cross zero — and a computer can hunt that zero down by repeatedly halving an interval.</p>
<h3>🎯 Objectives</h3>
<ul><li>Check continuity at a point with the three-condition test.</li><li>Classify discontinuities as removable, jump or infinite.</li><li>Choose a parameter that makes a piecewise function continuous.</li><li>Apply the Intermediate Value Theorem and run the bisection method.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Continuity at a</span>(1) f(a) is defined   (2) lim<sub>x→a</sub> f(x) exists   (3) lim<sub>x→a</sub> f(x) = f(a)</div>
<p>If any condition fails, f is <strong>discontinuous</strong> at a:</p>
<ul><li><strong>Removable</strong> — the limit exists but f(a) is missing or wrong (a “hole”); redefining one value fixes it.</li><li><strong>Jump</strong> — left and right limits exist but differ. Step prices (parking fees, tax brackets, shipping by weight class) jump.</li><li><strong>Infinite</strong> — f blows up near a (vertical asymptote).</li></ul>
<p>Polynomials, exponentials, sin and cos are continuous everywhere; rational functions, logarithms and roots are continuous on their domains; sums, products, quotients (where defined) and compositions of continuous functions are continuous.</p>
<div class="formula"><span class="lbl">Intermediate Value Theorem (IVT)</span>f continuous on [a, b] and N between f(a) and f(b) ⇒ there is c in (a, b) with f(c) = N</div>
<p>In particular, if f(a) and f(b) have <strong>opposite signs</strong>, f has a root in (a, b). The <strong>bisection method</strong> turns this into an algorithm: take the midpoint m, keep the half where the sign change is, repeat. Each step halves the error, so 20 steps shrink an interval of length 1 to about 10<sup>−6</sup>.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — removable.</b> f(x) = (x<sup>2</sup> − 25)/(x − 5) is undefined at 5, but equals x + 5 elsewhere, so the limit is 10. Defining f(5) = <b>10</b> removes the discontinuity.</p></div>
<div class="callout"><p><b>Example 2 — jump.</b> A parking lot charges 10 (thousand VND) for up to 2 hours and 25 for longer stays. The fee function jumps from 10 to 25 at t = 2: left limit 10, right limit 25. No redefinition can fix a jump.</p></div>
<div class="callout"><p><b>Example 3 — choosing a parameter.</b> f(x) = kx + 3 for x &lt; 2 and f(x) = x<sup>2</sup> − k for x ≥ 2. Continuity at 2 needs 2k + 3 = 4 − k ⇒ 3k = 1 ⇒ <b>k = 1/3</b>.</p></div>
<div class="callout"><p><b>Example 4 — IVT + bisection.</b> f(x) = x<sup>3</sup> + x − 5 is a polynomial, f(1) = −3 &lt; 0 and f(2) = 5 &gt; 0, so a root lies in (1, 2). Python:</p>
<pre><code class="language-python">def f(x):
    return x**3 + x - 5

a, b = 1.0, 2.0          # f(1) = -3 &lt; 0, f(2) = 5 &gt; 0
for step in range(1, 21):
    m = (a + b) / 2
    if f(a) * f(m) &lt;= 0:  # sign change in [a, m]
        b = m
    else:                 # sign change in [m, b]
        a = m
    if step in (1, 2, 3, 10, 20):
        print(f"step {step:2d}: root in [{a:.6f}, {b:.6f}]")
print("root ≈", round((a + b) / 2, 4))</code></pre>
<div class="out">step  1: root in [1.500000, 2.000000]
step  2: root in [1.500000, 1.750000]
step  3: root in [1.500000, 1.625000]
step 10: root in [1.515625, 1.516602]
step 20: root in [1.515980, 1.515981]
root ≈ 1.516</div>
<p>The root is x ≈ <b>1.5160</b> (SymPy's nsolve gives 1.515980…).</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Checking only that f(a) exists — all three conditions are needed.</li><li>Using the IVT on a function that is not continuous on the whole interval (e.g. 1/x on [−1, 1] changes sign but has no root).</li><li>Thinking the IVT tells you <em>where</em> the root is or how many roots there are — it only guarantees at least one.</li><li>Setting the wrong pieces equal when choosing a parameter: use the value of each piece <em>at</em> the junction point.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Continuous at a ⇔ lim<sub>x→a</sub> f(x) = f(a).</li><li>Discontinuities: removable (hole), jump (step prices), infinite (asymptote).</li><li>IVT: continuous + sign change ⇒ a root exists.</li><li>Bisection halves the interval each step — slow but always works.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/2-4-continuity" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 2.4 Continuity</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/Continuity.aspx" target="_blank" rel="noopener">Paul's Online Notes — Continuity</a></li><li><a href="https://docs.sympy.org/latest/tutorials/intro-tutorial/calculus.html" target="_blank" rel="noopener">SymPy tutorial — Calculus (limits in Python)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Where is f(x) = (x + 1)/(x<sup>2</sup> − 5x + 6) continuous?</li><li>Find a so that f(x) = ax<sup>2</sup> for x ≤ 1 and f(x) = 4x − a for x &gt; 1 is continuous.</li><li>Show that e<sup>−x</sup> = x has a solution in [0, 1].</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) x<sup>2</sup> − 5x + 6 = (x − 2)(x − 3), so f is continuous for all x except 2 and 3. 2) a·1 = 4 − a ⇒ a = 2. 3) g(x) = e<sup>−x</sup> − x is continuous, g(0) = 1 &gt; 0, g(1) = e<sup>−1</sup> − 1 ≈ −0.63 &lt; 0 ⇒ a root exists (it is ≈ 0.5671).</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 2 · Bài 2.3</span>
<h2>Tính liên tục, định lý giá trị trung gian và phương pháp chia đôi</h2>
<p class="lead">Hàm liên tục không có bước nhảy, lỗ hổng hay chỗ đứt. Tính chất đơn giản đó bảo đảm một điều mạnh mẽ: nếu hàm liên tục đổi dấu thì nó phải cắt trục hoành — và máy tính có thể săn nghiệm đó bằng cách chia đôi khoảng liên tục.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Kiểm tra tính liên tục tại một điểm bằng phép thử ba điều kiện.</li><li>Phân loại điểm gián đoạn: khử được, bước nhảy, vô cực.</li><li>Chọn tham số để hàm từng khúc liên tục.</li><li>Áp dụng định lý giá trị trung gian và chạy phương pháp chia đôi.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Liên tục tại a</span>(1) f(a) xác định   (2) lim<sub>x→a</sub> f(x) tồn tại   (3) lim<sub>x→a</sub> f(x) = f(a)</div>
<p>Nếu một điều kiện hỏng, f <strong>gián đoạn</strong> tại a:</p>
<ul><li><strong>Khử được</strong> — giới hạn tồn tại nhưng f(a) thiếu hoặc sai (một “lỗ”); định nghĩa lại một giá trị là xong.</li><li><strong>Bước nhảy</strong> — giới hạn trái và phải tồn tại nhưng khác nhau. Giá theo bậc (phí gửi xe, bậc thuế, phí ship theo nấc cân nặng) nhảy bậc.</li><li><strong>Vô cực</strong> — f tăng vọt gần a (tiệm cận đứng).</li></ul>
<p>Đa thức, hàm mũ, sin và cos liên tục khắp nơi; hàm hữu tỉ, logarit và căn liên tục trên tập xác định; tổng, tích, thương (nơi xác định) và hợp của các hàm liên tục là hàm liên tục.</p>
<div class="formula"><span class="lbl">Định lý giá trị trung gian (IVT)</span>f liên tục trên [a, b] và N nằm giữa f(a), f(b) ⇒ có c thuộc (a, b) với f(c) = N</div>
<p>Đặc biệt, nếu f(a) và f(b) <strong>trái dấu</strong> thì f có nghiệm trong (a, b). <strong>Phương pháp chia đôi</strong> biến điều này thành thuật toán: lấy trung điểm m, giữ nửa có đổi dấu, lặp lại. Mỗi bước sai số giảm một nửa, nên 20 bước thu khoảng dài 1 xuống cỡ 10<sup>−6</sup>.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — khử được.</b> f(x) = (x<sup>2</sup> − 25)/(x − 5) không xác định tại 5, nhưng bằng x + 5 ở mọi chỗ khác, nên giới hạn là 10. Định nghĩa f(5) = <b>10</b> là khử được điểm gián đoạn.</p></div>
<div class="callout"><p><b>Ví dụ 2 — bước nhảy.</b> Bãi xe thu 10 (nghìn đồng) cho tới 2 giờ và 25 nếu gửi lâu hơn. Hàm phí nhảy từ 10 lên 25 tại t = 2: giới hạn trái 10, phải 25. Không định nghĩa lại nào sửa được bước nhảy.</p></div>
<div class="callout"><p><b>Ví dụ 3 — chọn tham số.</b> f(x) = kx + 3 khi x &lt; 2 và f(x) = x<sup>2</sup> − k khi x ≥ 2. Liên tục tại 2 cần 2k + 3 = 4 − k ⇒ 3k = 1 ⇒ <b>k = 1/3</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4 — IVT + chia đôi.</b> f(x) = x<sup>3</sup> + x − 5 là đa thức, f(1) = −3 &lt; 0 và f(2) = 5 &gt; 0, nên có nghiệm trong (1, 2). Python:</p>
<pre><code class="language-python">def f(x):
    return x**3 + x - 5

a, b = 1.0, 2.0          # f(1) = -3 &lt; 0, f(2) = 5 &gt; 0
for step in range(1, 21):
    m = (a + b) / 2
    if f(a) * f(m) &lt;= 0:  # sign change in [a, m]
        b = m
    else:                 # sign change in [m, b]
        a = m
    if step in (1, 2, 3, 10, 20):
        print(f"step {step:2d}: root in [{a:.6f}, {b:.6f}]")
print("root ≈", round((a + b) / 2, 4))</code></pre>
<div class="out">step  1: root in [1.500000, 2.000000]
step  2: root in [1.500000, 1.750000]
step  3: root in [1.500000, 1.625000]
step 10: root in [1.515625, 1.516602]
step 20: root in [1.515980, 1.515981]
root ≈ 1.516</div>
<p>Nghiệm là x ≈ <b>1,5160</b> (nsolve của SymPy cho 1,515980…).</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chỉ kiểm f(a) tồn tại — cần đủ cả ba điều kiện.</li><li>Dùng IVT cho hàm không liên tục trên cả đoạn (vd 1/x trên [−1, 1] đổi dấu nhưng không có nghiệm).</li><li>Tưởng IVT cho biết nghiệm <em>ở đâu</em> hay có bao nhiêu nghiệm — nó chỉ bảo đảm có ít nhất một.</li><li>Cho bằng nhau sai khúc khi chọn tham số: dùng giá trị của mỗi khúc <em>tại</em> điểm nối.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Liên tục tại a ⇔ lim<sub>x→a</sub> f(x) = f(a).</li><li>Gián đoạn: khử được (lỗ), bước nhảy (giá theo bậc), vô cực (tiệm cận).</li><li>IVT: liên tục + đổi dấu ⇒ có nghiệm.</li><li>Chia đôi giảm khoảng một nửa mỗi bước — chậm nhưng luôn chạy được.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/2-4-continuity" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 2.4 Tính liên tục</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/Continuity.aspx" target="_blank" rel="noopener">Paul's Online Notes — Tính liên tục</a></li><li><a href="https://docs.sympy.org/latest/tutorials/intro-tutorial/calculus.html" target="_blank" rel="noopener">Hướng dẫn SymPy — Calculus (giới hạn bằng Python)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>f(x) = (x + 1)/(x<sup>2</sup> − 5x + 6) liên tục ở đâu?</li><li>Tìm a để f(x) = ax<sup>2</sup> khi x ≤ 1 và f(x) = 4x − a khi x &gt; 1 liên tục.</li><li>Chứng tỏ e<sup>−x</sup> = x có nghiệm trong [0, 1].</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) x<sup>2</sup> − 5x + 6 = (x − 2)(x − 3), nên f liên tục với mọi x trừ 2 và 3. 2) a·1 = 4 − a ⇒ a = 2. 3) g(x) = e<sup>−x</sup> − x liên tục, g(0) = 1 &gt; 0, g(1) = e<sup>−1</sup> − 1 ≈ −0,63 &lt; 0 ⇒ có nghiệm (xấp xỉ 0,5671).</p></div>`);

const q2 = QZ(2, 'Quiz — Chapter 2: Limits and continuity|||Quiz — Chương 2: Giới hạn và tính liên tục', 'Kiểm tra chương 2: giới hạn một phía, khử 0/0 (nhân tử, liên hợp), giới hạn tại vô cực, tiệm cận, liên tục, chọn tham số, định lý giá trị trung gian.', [
  Q('q1', 'lim (x → 1) of (x³ − 1)/(x − 1) =|||lim (x → 1) của (x³ − 1)/(x − 1) =',
    ['0|||0', '1|||1', '3|||3', 'does not exist|||không tồn tại'], 2,
    'x³ − 1 = (x − 1)(x² + x + 1) → 1 + 1 + 1 = 3.|||x³ − 1 = (x − 1)(x² + x + 1) → 1 + 1 + 1 = 3.'),
  Q('q2', 'For g(x) = |x + 1|/(x + 1), lim (x → −1) g(x)|||Với g(x) = |x + 1|/(x + 1), lim (x → −1) g(x)',
    ['does not exist (left −1, right 1)|||không tồn tại (trái −1, phải 1)', 'equals 1|||bằng 1', 'equals −1|||bằng −1', 'equals 0|||bằng 0'], 0,
    'The one-sided limits differ, so there is no two-sided limit.|||Hai giới hạn một phía khác nhau nên không có giới hạn hai phía.'),
  Q('q3', 'lim (x → 3) of (x² − 9)/(x² − x − 6) =|||lim (x → 3) của (x² − 9)/(x² − x − 6) =',
    ['0|||0', '1|||1', '3/2|||3/2', '6/5|||6/5'], 3,
    'Cancel (x − 3): (x + 3)/(x + 2) → 6/5.|||Giản ước (x − 3): (x + 3)/(x + 2) → 6/5.'),
  Q('q4', 'lim (x → 4) of (√(2x + 1) − 3)/(x − 4) =|||lim (x → 4) của (√(2x + 1) − 3)/(x − 4) =',
    ['1/3|||1/3', '1/6|||1/6', '2/3|||2/3', '0|||0'], 0,
    'Conjugate: 2/(√(2x + 1) + 3) → 2/6 = 1/3.|||Liên hợp: 2/(√(2x + 1) + 3) → 2/6 = 1/3.'),
  Q('q5', 'The horizontal asymptote of y = (6x² + 1)/(3x² − 2x) is|||Tiệm cận ngang của y = (6x² + 1)/(3x² − 2x) là',
    ['y = 0|||y = 0', 'y = 3|||y = 3', 'y = 2|||y = 2', 'none|||không có'], 2,
    'Same degree: 6/3 = 2.|||Cùng bậc: 6/3 = 2.'),
  Q('q6', 'Average cost AC(x) = 9 + 2000/x. As production x → ∞, AC(x) →|||Chi phí trung bình AC(x) = 9 + 2000/x. Khi sản lượng x → ∞, AC(x) →',
    ['0|||0', '9|||9', '2000|||2000', '∞|||∞'], 1,
    '2000/x → 0, leaving the variable cost 9.|||2000/x → 0, còn lại chi phí biến đổi 9.'),
  Q('q7', 'lim (x → ∞) of (sin x)/x =|||lim (x → ∞) của (sin x)/x =',
    ['1|||1', 'does not exist|||không tồn tại', '∞|||∞', '0|||0'], 3,
    'Squeeze: −1/x ≤ (sin x)/x ≤ 1/x, both bounds → 0.|||Kẹp: −1/x ≤ (sin x)/x ≤ 1/x, hai cận → 0.'),
  Q('q8', 'Which value of k makes f(x) = kx + 3 (x < 2), x² − k (x ≥ 2) continuous?|||Giá trị k nào làm f(x) = kx + 3 (x < 2), x² − k (x ≥ 2) liên tục?',
    ['k = 1|||k = 1', 'k = 1/3|||k = 1/3', 'k = −1/3|||k = −1/3', 'no such k|||không có k nào'], 1,
    '2k + 3 = 4 − k ⇒ k = 1/3.|||2k + 3 = 4 − k ⇒ k = 1/3.'),
  Q('q9', 'A parking fee is 10 up to 2 hours and 25 after that. At t = 2 the fee function has|||Phí gửi xe 10 cho tới 2 giờ và 25 sau đó. Tại t = 2 hàm phí có',
    ['a removable discontinuity|||gián đoạn khử được', 'an infinite discontinuity|||gián đoạn vô cực', 'a jump discontinuity|||gián đoạn bước nhảy', 'no discontinuity|||không gián đoạn'], 2,
    'Left limit 10 ≠ right limit 25: a jump.|||Giới hạn trái 10 ≠ phải 25: bước nhảy.'),
  Q('q10', 'f(x) = x³ + x − 5. The IVT guarantees a root in which interval?|||f(x) = x³ + x − 5. Định lý giá trị trung gian bảo đảm có nghiệm trong khoảng nào?',
    ['(0, 1)|||(0, 1)', '(1, 2)|||(1, 2)', '(2, 3)|||(2, 3)', '(−1, 0)|||(−1, 0)'], 1,
    'f(1) = −3 < 0 and f(2) = 5 > 0.|||f(1) = −3 < 0 và f(2) = 5 > 0.'),
]);

const ch2 = {
  title: 'Chapter 2 — Limits and continuity|||Chương 2 — Giới hạn và tính liên tục',
  description: 'Ý tưởng giới hạn, giới hạn một phía, luật giới hạn, khử 0/0, giới hạn tại vô cực và tiệm cận (chi phí trung bình dài hạn, bão hoà), tính liên tục, định lý giá trị trung gian, phương pháp chia đôi bằng Python (Stewart ch.2 · OpenStax Vol.1 ch.2 + 4.6).',
  lessons: [c21, c22, c23, q2],
};


// ───────────────────────────── Chương 3 — Đạo hàm ─────────────────────────────
const c31 = L('mac103-ts-3-1',
  '3.1 — The derivative: rate of change, tangent line and marginal analysis|||3.1 — Đạo hàm: tốc độ thay đổi, tiếp tuyến và phân tích cận biên',
  'Đạo hàm là giới hạn của tốc độ thay đổi trung bình; tính từ định nghĩa; tiếp tuyến; ý nghĩa đơn vị; chi phí biên và doanh thu biên trong kinh doanh.',
  `<span class="eyebrow">MAC103 · Chapter 3 · Lesson 3.1</span>
<h2>The derivative: rate of change, tangent line and marginal analysis</h2>
<p class="lead">How fast is the number of app users growing <em>today</em>? How much will the next unit cost to produce? Both questions ask for an <strong>instantaneous rate of change</strong> — the derivative. This lesson builds it from the limit you met in Chapter 2.</p>
<h3>🎯 Objectives</h3>
<ul><li>Distinguish average rate of change from instantaneous rate of change.</li><li>Compute a derivative directly from the limit definition.</li><li>Write the tangent line at a point.</li><li>Read a derivative as marginal cost or marginal revenue, with correct units.</li></ul>
<h3>📖 Lecture</h3>
<p>Over an interval [a, a + h] the <strong>average rate of change</strong> of f is the slope of the secant line: [f(a + h) − f(a)] / h. Shrinking the interval (h → 0) turns the secant into the tangent and the average rate into the instantaneous rate.</p>
<div class="formula"><span class="lbl">Definition of the derivative</span>f′(a) = lim<sub>h→0</sub> [f(a + h) − f(a)] / h    (if the limit exists)</div>
<div class="formula"><span class="lbl">Tangent line at (a, f(a))</span>y = f(a) + f′(a)(x − a)</div>
<p><strong>Units.</strong> f′ has units “output units per input unit”. If N(t) is users and t is in days, N′(t) is users per day. If C(x) is cost in dollars for x units, C′(x) is dollars per unit.</p>
<p><strong>Marginal analysis.</strong> Economists call C′(x) the <strong>marginal cost</strong> and R′(x) the <strong>marginal revenue</strong>. Because C(x + 1) − C(x) ≈ C′(x)·1, the marginal cost is (approximately) the cost of producing <em>one more</em> unit after x units.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — from the definition.</b> f(x) = x<sup>2</sup> + 3x. Find f′(2) and the tangent at x = 2.</p><p>f(2) = 10. [f(2 + h) − 10]/h = [(4 + 4h + h<sup>2</sup>) + (6 + 3h) − 10]/h = (7h + h<sup>2</sup>)/h = 7 + h → <b>7</b>. Tangent: y = 10 + 7(x − 2), i.e. <b>y = 7x − 4</b>.</p></div>
<div class="callout"><p><b>Example 2.</b> f(x) = 4/x. [4/(x + h) − 4/x]/h = [4x − 4(x + h)] / [h·x(x + h)] = −4/[x(x + h)] → <b>f′(x) = −4/x<sup>2</sup></b>.</p></div>
<div class="callout"><p><b>Example 3 — average vs instantaneous.</b> A start-up has N(t) = 500t + 20t<sup>2</sup> users after t days. Average growth over the first 5 days: [N(5) − N(0)]/5 = 3000/5 = <b>600 users/day</b>. From the definition, N′(t) = 500 + 40t, so on day 5 the instantaneous growth is <b>700 users/day</b> — faster than the average, because growth is accelerating.</p></div>
<div class="callout"><p><b>Example 4 — marginal cost.</b> C(x) = 2000 + 15x + 0.02x<sup>2</sup> dollars. Then C′(x) = 15 + 0.04x and C′(100) = <b>$19 per unit</b>. Check: the exact cost of the 101st unit is C(101) − C(100) = $19.02 — the marginal cost is an excellent estimate.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing f(a + h) as f(a) + h. Substitute a + h into every x.</li><li>Plugging in h = 0 before cancelling: you only get 0/0.</li><li>Confusing C′(100) (cost of the next unit) with C(100)/100 (average cost per unit so far).</li><li>Forgetting units: “19” means nothing; “$19 per unit” is the answer.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Average rate = slope of secant; derivative = limit of that slope = slope of tangent.</li><li>f′(a) = lim<sub>h→0</sub> [f(a + h) − f(a)]/h.</li><li>Tangent: y = f(a) + f′(a)(x − a).</li><li>Marginal cost C′(x) ≈ cost of one more unit; units are “per input unit”.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-1-defining-the-derivative" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 3.1 Defining the Derivative</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-4-derivatives-as-rates-of-change" target="_blank" rel="noopener">OpenStax — 3.4 Derivatives as Rates of Change (incl. marginal cost)</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/DerivativeInterp.aspx" target="_blank" rel="noopener">Paul's Online Notes — Interpretation of the Derivative</a></li><li><a href="https://www.3blue1brown.com/lessons/derivatives" target="_blank" rel="noopener">3Blue1Brown — The paradox of the derivative</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Use the definition to find f′(x) for f(x) = x<sup>2</sup> − 4x.</li><li>Write the tangent line to that f at x = 3.</li><li>Revenue R(x) = 40x − 0.01x<sup>2</sup> dollars for x items. Find R′(500) and interpret it.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) [(x + h)<sup>2</sup> − 4(x + h) − x<sup>2</sup> + 4x]/h = 2x + h − 4 → f′(x) = 2x − 4. 2) f(3) = −3, f′(3) = 2 ⇒ y = 2x − 9. 3) R′(x) = 40 − 0.02x, R′(500) = $30 per item: selling the 501st item brings in about $30 more revenue.</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 3 · Bài 3.1</span>
<h2>Đạo hàm: tốc độ thay đổi, tiếp tuyến và phân tích cận biên</h2>
<p class="lead">Số người dùng ứng dụng đang tăng nhanh cỡ nào <em>hôm nay</em>? Sản xuất thêm một sản phẩm tốn bao nhiêu? Cả hai câu đều hỏi <strong>tốc độ thay đổi tức thời</strong> — tức đạo hàm. Bài này dựng đạo hàm từ giới hạn đã học ở Chương 2.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phân biệt tốc độ thay đổi trung bình và tốc độ thay đổi tức thời.</li><li>Tính đạo hàm trực tiếp từ định nghĩa bằng giới hạn.</li><li>Viết phương trình tiếp tuyến tại một điểm.</li><li>Đọc đạo hàm như chi phí biên hay doanh thu biên, kèm đúng đơn vị.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Trên khoảng [a, a + h], <strong>tốc độ thay đổi trung bình</strong> của f là hệ số góc cát tuyến: [f(a + h) − f(a)] / h. Thu hẹp khoảng (h → 0) thì cát tuyến thành tiếp tuyến và tốc độ trung bình thành tốc độ tức thời.</p>
<div class="formula"><span class="lbl">Định nghĩa đạo hàm</span>f′(a) = lim<sub>h→0</sub> [f(a + h) − f(a)] / h    (nếu giới hạn tồn tại)</div>
<div class="formula"><span class="lbl">Tiếp tuyến tại (a, f(a))</span>y = f(a) + f′(a)(x − a)</div>
<p><strong>Đơn vị.</strong> f′ có đơn vị “đơn vị đầu ra trên một đơn vị đầu vào”. Nếu N(t) là số người dùng, t tính bằng ngày thì N′(t) là người dùng/ngày. Nếu C(x) là chi phí (đô la) cho x sản phẩm thì C′(x) là đô la/sản phẩm.</p>
<p><strong>Phân tích cận biên.</strong> Kinh tế học gọi C′(x) là <strong>chi phí biên</strong> và R′(x) là <strong>doanh thu biên</strong>. Vì C(x + 1) − C(x) ≈ C′(x)·1 nên chi phí biên xấp xỉ chi phí sản xuất <em>thêm một</em> sản phẩm sau x sản phẩm.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — từ định nghĩa.</b> f(x) = x<sup>2</sup> + 3x. Tìm f′(2) và tiếp tuyến tại x = 2.</p><p>f(2) = 10. [f(2 + h) − 10]/h = [(4 + 4h + h<sup>2</sup>) + (6 + 3h) − 10]/h = (7h + h<sup>2</sup>)/h = 7 + h → <b>7</b>. Tiếp tuyến: y = 10 + 7(x − 2), tức <b>y = 7x − 4</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2.</b> f(x) = 4/x. [4/(x + h) − 4/x]/h = [4x − 4(x + h)] / [h·x(x + h)] = −4/[x(x + h)] → <b>f′(x) = −4/x<sup>2</sup></b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — trung bình và tức thời.</b> Một start-up có N(t) = 500t + 20t<sup>2</sup> người dùng sau t ngày. Tăng trưởng trung bình 5 ngày đầu: [N(5) − N(0)]/5 = 3000/5 = <b>600 người/ngày</b>. Từ định nghĩa, N′(t) = 500 + 40t nên đúng ngày thứ 5 tốc độ tức thời là <b>700 người/ngày</b> — nhanh hơn mức trung bình vì tăng trưởng đang tăng tốc.</p></div>
<div class="callout"><p><b>Ví dụ 4 — chi phí biên.</b> C(x) = 2000 + 15x + 0,02x<sup>2</sup> đô la. Khi đó C′(x) = 15 + 0,04x và C′(100) = <b>19 đô la/sản phẩm</b>. Kiểm lại: chi phí đúng của sản phẩm thứ 101 là C(101) − C(100) = 19,02 đô la — chi phí biên ước lượng rất sát.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết f(a + h) thành f(a) + h. Phải thay a + h vào MỌI chỗ có x.</li><li>Thay h = 0 trước khi giản ước: chỉ được 0/0.</li><li>Nhầm C′(100) (chi phí sản phẩm kế tiếp) với C(100)/100 (chi phí trung bình mỗi sản phẩm đến lúc đó).</li><li>Quên đơn vị: “19” không nói gì; “19 đô la/sản phẩm” mới là đáp án.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tốc độ trung bình = hệ số góc cát tuyến; đạo hàm = giới hạn của hệ số góc đó = hệ số góc tiếp tuyến.</li><li>f′(a) = lim<sub>h→0</sub> [f(a + h) − f(a)]/h.</li><li>Tiếp tuyến: y = f(a) + f′(a)(x − a).</li><li>Chi phí biên C′(x) ≈ chi phí thêm một sản phẩm; đơn vị là “trên một đơn vị đầu vào”.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-1-defining-the-derivative" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 3.1 Định nghĩa đạo hàm</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-4-derivatives-as-rates-of-change" target="_blank" rel="noopener">OpenStax — 3.4 Đạo hàm là tốc độ thay đổi (có chi phí biên)</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/DerivativeInterp.aspx" target="_blank" rel="noopener">Paul's Online Notes — Ý nghĩa của đạo hàm</a></li><li><a href="https://www.3blue1brown.com/lessons/derivatives" target="_blank" rel="noopener">3Blue1Brown — Nghịch lý của đạo hàm</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Dùng định nghĩa tìm f′(x) với f(x) = x<sup>2</sup> − 4x.</li><li>Viết tiếp tuyến của f đó tại x = 3.</li><li>Doanh thu R(x) = 40x − 0,01x<sup>2</sup> đô la khi bán x món. Tính R′(500) và giải thích.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) [(x + h)<sup>2</sup> − 4(x + h) − x<sup>2</sup> + 4x]/h = 2x + h − 4 → f′(x) = 2x − 4. 2) f(3) = −3, f′(3) = 2 ⇒ y = 2x − 9. 3) R′(x) = 40 − 0,02x, R′(500) = 30 đô la/món: bán thêm món thứ 501 mang về thêm khoảng 30 đô la doanh thu.</p></div>`);

const c32 = L('mac103-ts-3-2',
  '3.2 — Differentiation rules: power, sum, product, quotient, exponential, log, trig|||3.2 — Quy tắc tính đạo hàm: luỹ thừa, tổng, tích, thương, mũ, logarit, lượng giác',
  'Bảng đạo hàm cơ bản và các quy tắc tổng, hằng số, tích, thương; đạo hàm eˣ, ln x, sin x, cos x; ứng dụng doanh thu biên và chi phí trung bình.',
  `<span class="eyebrow">MAC103 · Chapter 3 · Lesson 3.2</span>
<h2>Differentiation rules</h2>
<p class="lead">Computing every derivative from the limit definition would be slow. A handful of rules — proved once from the definition — let you differentiate any combination of elementary functions in a few lines.</p>
<h3>🎯 Objectives</h3>
<ul><li>Use the power, constant-multiple and sum rules.</li><li>Apply the product and quotient rules correctly.</li><li>Differentiate eˣ, ln x, sin x and cos x.</li><li>Use the rules on business functions (revenue, average cost).</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Basic derivatives</span>(c)′ = 0    (x<sup>n</sup>)′ = n·x<sup>n−1</sup> (any real n)    (eˣ)′ = eˣ    (ln x)′ = 1/x    (sin x)′ = cos x    (cos x)′ = −sin x</div>
<div class="formula"><span class="lbl">Linearity</span>(c·f)′ = c·f′    (f ± g)′ = f′ ± g′</div>
<div class="formula"><span class="lbl">Product rule</span>(f·g)′ = f′·g + f·g′</div>
<div class="formula"><span class="lbl">Quotient rule</span>(f/g)′ = (f′·g − f·g′) / g<sup>2</sup>    (g ≠ 0)</div>
<p>The power rule works for negative and fractional exponents too: rewrite √x = x<sup>1/2</sup> and 2/x<sup>3</sup> = 2x<sup>−3</sup> before differentiating. The function eˣ is special: it is its own derivative, which is why it models growth whose rate is proportional to its size.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — polynomial.</b> (4x<sup>5</sup> − 3x<sup>2</sup> + 7)′ = <b>20x<sup>4</sup> − 6x</b>.</p></div>
<div class="callout"><p><b>Example 2 — rewrite first.</b> y = √x + 2/x<sup>3</sup> = x<sup>1/2</sup> + 2x<sup>−3</sup>, so y′ = (1/2)x<sup>−1/2</sup> − 6x<sup>−4</sup> = <b>1/(2√x) − 6/x<sup>4</sup></b>.</p></div>
<div class="callout"><p><b>Example 3 — product.</b> y = (x<sup>2</sup> + 1)eˣ. y′ = 2x·eˣ + (x<sup>2</sup> + 1)eˣ = eˣ(x<sup>2</sup> + 2x + 1) = <b>eˣ(x + 1)<sup>2</sup></b>. Also: (x<sup>3</sup> cos x)′ = 3x<sup>2</sup> cos x − x<sup>3</sup> sin x and (x<sup>2</sup> ln x)′ = 2x ln x + x.</p></div>
<div class="callout"><p><b>Example 4 — quotient.</b> y = (4x − 1)/(x + 3). y′ = [4(x + 3) − (4x − 1)·1]/(x + 3)<sup>2</sup> = <b>13/(x + 3)<sup>2</sup></b>.</p></div>
<div class="callout"><p><b>Example 5 — revenue.</b> A shop sells x phone cases at price p = 80 − 0.02x dollars. Revenue R(x) = x(80 − 0.02x) = 80x − 0.02x<sup>2</sup>, so marginal revenue R′(x) = 80 − 0.04x and R′(1000) = <b>$40 per case</b>.</p></div>
<div class="callout"><p><b>Example 6 — average cost.</b> C(x) = 500 + 4x gives average cost AC(x) = C(x)/x = (500 + 4x)/x. Quotient rule: AC′(x) = [4x − (500 + 4x)]/x<sup>2</sup> = <b>−500/x<sup>2</sup></b>. At x = 50, AC′ = −0.2: each extra unit lowers the average cost by about 20 cents — fixed costs are spread thinner.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>(f·g)′ ≠ f′·g′. Check: (x·x)′ = 2x, but 1·1 = 1.</li><li>In the quotient rule the order matters: f′g − fg′, not fg′ − f′g.</li><li>Applying the power rule to eˣ: (eˣ)′ is eˣ, not x·e<sup>x−1</sup>.</li><li>(cos x)′ = −sin x — the minus sign is often lost.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>(x<sup>n</sup>)′ = n x<sup>n−1</sup> for any real n; rewrite roots and fractions as powers.</li><li>Product: f′g + fg′. Quotient: (f′g − fg′)/g<sup>2</sup>.</li><li>(eˣ)′ = eˣ, (ln x)′ = 1/x, (sin x)′ = cos x, (cos x)′ = −sin x.</li><li>Revenue = price × quantity; average cost = C(x)/x — both are differentiated with these rules.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-3-differentiation-rules" target="_blank" rel="noopener">OpenStax — 3.3 Differentiation Rules</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-9-derivatives-of-exponential-and-logarithmic-functions" target="_blank" rel="noopener">OpenStax — 3.9 Derivatives of Exponential and Logarithmic Functions</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ProductQuotientRule.aspx" target="_blank" rel="noopener">Paul's Online Notes — Product and Quotient Rule</a></li><li><a href="https://www.3blue1brown.com/lessons/chain-rule-and-product-rule" target="_blank" rel="noopener">3Blue1Brown — Visualizing the chain rule and product rule</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Differentiate y = x<sup>3</sup> − 6√x + 5.</li><li>Differentiate y = (2x + 1)/(x<sup>2</sup> + 1).</li><li>Differentiate y = eˣ sin x.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) y′ = 3x<sup>2</sup> − 3/√x. 2) y′ = [2(x<sup>2</sup> + 1) − (2x + 1)·2x]/(x<sup>2</sup> + 1)<sup>2</sup> = (−2x<sup>2</sup> − 2x + 2)/(x<sup>2</sup> + 1)<sup>2</sup>. 3) y′ = eˣ sin x + eˣ cos x = eˣ(sin x + cos x).</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 3 · Bài 3.2</span>
<h2>Quy tắc tính đạo hàm</h2>
<p class="lead">Tính mọi đạo hàm bằng định nghĩa giới hạn thì rất chậm. Vài quy tắc — chứng minh một lần từ định nghĩa — đủ để lấy đạo hàm mọi tổ hợp hàm sơ cấp trong vài dòng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dùng quy tắc luỹ thừa, nhân hằng số và tổng.</li><li>Áp dụng đúng quy tắc tích và quy tắc thương.</li><li>Lấy đạo hàm eˣ, ln x, sin x, cos x.</li><li>Dùng các quy tắc cho hàm kinh doanh (doanh thu, chi phí trung bình).</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Đạo hàm cơ bản</span>(c)′ = 0    (x<sup>n</sup>)′ = n·x<sup>n−1</sup> (n thực bất kỳ)    (eˣ)′ = eˣ    (ln x)′ = 1/x    (sin x)′ = cos x    (cos x)′ = −sin x</div>
<div class="formula"><span class="lbl">Tuyến tính</span>(c·f)′ = c·f′    (f ± g)′ = f′ ± g′</div>
<div class="formula"><span class="lbl">Quy tắc tích</span>(f·g)′ = f′·g + f·g′</div>
<div class="formula"><span class="lbl">Quy tắc thương</span>(f/g)′ = (f′·g − f·g′) / g<sup>2</sup>    (g ≠ 0)</div>
<p>Quy tắc luỹ thừa đúng cả với số mũ âm và phân số: viết lại √x = x<sup>1/2</sup> và 2/x<sup>3</sup> = 2x<sup>−3</sup> trước khi lấy đạo hàm. Hàm eˣ đặc biệt: đạo hàm của nó là chính nó — vì thế nó mô tả sự tăng trưởng có tốc độ tỉ lệ với quy mô.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — đa thức.</b> (4x<sup>5</sup> − 3x<sup>2</sup> + 7)′ = <b>20x<sup>4</sup> − 6x</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — viết lại trước.</b> y = √x + 2/x<sup>3</sup> = x<sup>1/2</sup> + 2x<sup>−3</sup>, nên y′ = (1/2)x<sup>−1/2</sup> − 6x<sup>−4</sup> = <b>1/(2√x) − 6/x<sup>4</sup></b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — tích.</b> y = (x<sup>2</sup> + 1)eˣ. y′ = 2x·eˣ + (x<sup>2</sup> + 1)eˣ = eˣ(x<sup>2</sup> + 2x + 1) = <b>eˣ(x + 1)<sup>2</sup></b>. Thêm: (x<sup>3</sup> cos x)′ = 3x<sup>2</sup> cos x − x<sup>3</sup> sin x và (x<sup>2</sup> ln x)′ = 2x ln x + x.</p></div>
<div class="callout"><p><b>Ví dụ 4 — thương.</b> y = (4x − 1)/(x + 3). y′ = [4(x + 3) − (4x − 1)·1]/(x + 3)<sup>2</sup> = <b>13/(x + 3)<sup>2</sup></b>.</p></div>
<div class="callout"><p><b>Ví dụ 5 — doanh thu.</b> Cửa hàng bán x ốp điện thoại với giá p = 80 − 0,02x đô la. Doanh thu R(x) = x(80 − 0,02x) = 80x − 0,02x<sup>2</sup>, nên doanh thu biên R′(x) = 80 − 0,04x và R′(1000) = <b>40 đô la/chiếc</b>.</p></div>
<div class="callout"><p><b>Ví dụ 6 — chi phí trung bình.</b> C(x) = 500 + 4x cho chi phí trung bình AC(x) = C(x)/x = (500 + 4x)/x. Quy tắc thương: AC′(x) = [4x − (500 + 4x)]/x<sup>2</sup> = <b>−500/x<sup>2</sup></b>. Tại x = 50, AC′ = −0,2: mỗi sản phẩm thêm làm chi phí trung bình giảm khoảng 20 xu — chi phí cố định được chia mỏng hơn.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>(f·g)′ ≠ f′·g′. Thử: (x·x)′ = 2x, nhưng 1·1 = 1.</li><li>Quy tắc thương có thứ tự: f′g − fg′, không phải fg′ − f′g.</li><li>Áp quy tắc luỹ thừa cho eˣ: (eˣ)′ là eˣ, không phải x·e<sup>x−1</sup>.</li><li>(cos x)′ = −sin x — hay rơi mất dấu trừ.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>(x<sup>n</sup>)′ = n x<sup>n−1</sup> với mọi n thực; viết căn và phân thức thành luỹ thừa.</li><li>Tích: f′g + fg′. Thương: (f′g − fg′)/g<sup>2</sup>.</li><li>(eˣ)′ = eˣ, (ln x)′ = 1/x, (sin x)′ = cos x, (cos x)′ = −sin x.</li><li>Doanh thu = giá × lượng; chi phí trung bình = C(x)/x — đều lấy đạo hàm bằng các quy tắc này.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-3-differentiation-rules" target="_blank" rel="noopener">OpenStax — 3.3 Quy tắc tính đạo hàm</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-9-derivatives-of-exponential-and-logarithmic-functions" target="_blank" rel="noopener">OpenStax — 3.9 Đạo hàm hàm mũ và logarit</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ProductQuotientRule.aspx" target="_blank" rel="noopener">Paul's Online Notes — Quy tắc tích và thương</a></li><li><a href="https://www.3blue1brown.com/lessons/chain-rule-and-product-rule" target="_blank" rel="noopener">3Blue1Brown — Trực quan quy tắc dây chuyền và quy tắc tích</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Lấy đạo hàm y = x<sup>3</sup> − 6√x + 5.</li><li>Lấy đạo hàm y = (2x + 1)/(x<sup>2</sup> + 1).</li><li>Lấy đạo hàm y = eˣ sin x.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) y′ = 3x<sup>2</sup> − 3/√x. 2) y′ = [2(x<sup>2</sup> + 1) − (2x + 1)·2x]/(x<sup>2</sup> + 1)<sup>2</sup> = (−2x<sup>2</sup> − 2x + 2)/(x<sup>2</sup> + 1)<sup>2</sup>. 3) y′ = eˣ sin x + eˣ cos x = eˣ(sin x + cos x).</p></div>`);

const c33 = L('mac103-ts-3-3',
  '3.3 — The chain rule, implicit differentiation and logarithmic differentiation|||3.3 — Quy tắc dây chuyền, đạo hàm hàm ẩn và đạo hàm logarit',
  'Quy tắc dây chuyền cho hàm hợp (ngoài × trong); tốc độ biến thiên chi phí theo thời gian; đạo hàm hàm ẩn; lấy logarit hai vế cho hàm dạng f(x)^g(x).',
  `<span class="eyebrow">MAC103 · Chapter 3 · Lesson 3.3</span>
<h2>The chain rule, implicit and logarithmic differentiation</h2>
<p class="lead">Most real models are chains: cost depends on output, output depends on time. The chain rule says rates of change <em>multiply</em> along the chain — the same idea that powers backpropagation in neural networks.</p>
<h3>🎯 Objectives</h3>
<ul><li>Identify the outer and inner functions of a composition and apply the chain rule.</li><li>Combine the chain rule with the product and quotient rules.</li><li>Differentiate an equation implicitly to find dy/dx.</li><li>Use logarithmic differentiation for functions like x<sup>2x</sup>.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Chain rule</span>[f(g(x))]′ = f′(g(x)) · g′(x)        in Leibniz form: dy/dx = (dy/du)·(du/dx)</div>
<p>Recipe: differentiate the <strong>outer</strong> function, keep the inside untouched, then multiply by the derivative of the <strong>inside</strong>. Useful special cases:</p>
<div class="formula"><span class="lbl">Common chains</span>[u<sup>n</sup>]′ = n u<sup>n−1</sup> u′    [e<sup>u</sup>]′ = e<sup>u</sup> u′    [ln u]′ = u′/u    [sin u]′ = cos u · u′    [√u]′ = u′/(2√u)</div>
<p><strong>Implicit differentiation.</strong> When y is defined by an equation such as x<sup>2</sup>y + y<sup>3</sup> = 10, differentiate both sides with respect to x, treating y as a function of x (so every y-term gets a factor y′ by the chain rule), then solve for y′.</p>
<p><strong>Logarithmic differentiation.</strong> For y = f(x)<sup>g(x)</sup>, neither the power rule nor the exponential rule applies. Take ln of both sides, differentiate implicitly, multiply by y.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> y = (2x<sup>3</sup> − 5)<sup>4</sup>. Outer u<sup>4</sup>, inner u = 2x<sup>3</sup> − 5. y′ = 4(2x<sup>3</sup> − 5)<sup>3</sup>·6x = <b>24x<sup>2</sup>(2x<sup>3</sup> − 5)<sup>3</sup></b>.</p></div>
<div class="callout"><p><b>Example 2 — depreciation.</b> A server worth V(t) = 1000e<sup>−0.2t</sup> dollars after t years loses value at V′(t) = 1000e<sup>−0.2t</sup>·(−0.2) = <b>−200e<sup>−0.2t</sup> dollars per year</b>. More chains: [ln(x<sup>2</sup> + 4)]′ = 2x/(x<sup>2</sup> + 4); [sin(5x<sup>2</sup>)]′ = 10x cos(5x<sup>2</sup>); [√(1 + eˣ)]′ = eˣ/(2√(1 + eˣ)).</p></div>
<div class="callout"><p><b>Example 3 — rates along a chain.</b> Cost C(q) = 100 + 3q + 0.01q<sup>2</sup> dollars for q units, and production grows as q(t) = 50 + 10t units (t in weeks). At t = 5, q = 100, C′(100) = 3 + 0.02·100 = 5 $/unit and q′ = 10 units/week, so dC/dt = 5·10 = <b>$50 per week</b>.</p></div>
<div class="callout"><p><b>Example 4 — implicit.</b> Find the slope of x<sup>2</sup>y + y<sup>3</sup> = 10 at (1, 2) (check: 2 + 8 = 10). Differentiate: 2xy + x<sup>2</sup>y′ + 3y<sup>2</sup>y′ = 0 ⇒ y′ = −2xy/(x<sup>2</sup> + 3y<sup>2</sup>). At (1, 2): y′ = −4/13.</p></div>
<div class="callout"><p><b>Example 5 — logarithmic.</b> y = x<sup>2x</sup> (x &gt; 0). ln y = 2x ln x ⇒ y′/y = 2 ln x + 2 ⇒ <b>y′ = 2x<sup>2x</sup>(ln x + 1)</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the inner derivative: [e<sup>−0.2t</sup>]′ is not e<sup>−0.2t</sup>.</li><li>Changing the inside: [(2x<sup>3</sup> − 5)<sup>4</sup>]′ keeps (2x<sup>3</sup> − 5) inside the cube.</li><li>In implicit differentiation, writing (y<sup>3</sup>)′ = 3y<sup>2</sup> without the factor y′.</li><li>Using the power rule on x<sup>2x</sup>: the exponent is not constant.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>[f(g(x))]′ = f′(g(x))·g′(x): outer derivative × inner derivative.</li><li>Leibniz: dy/dx = dy/du · du/dx — rates multiply along a chain.</li><li>Implicit: differentiate both sides, attach y′ to every y-term, solve for y′.</li><li>For f(x)<sup>g(x)</sup>: take ln first.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-6-the-chain-rule" target="_blank" rel="noopener">OpenStax — 3.6 The Chain Rule</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-8-implicit-differentiation" target="_blank" rel="noopener">OpenStax — 3.8 Implicit Differentiation</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ChainRule.aspx" target="_blank" rel="noopener">Paul's Online Notes — Chain Rule</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/LogDiff.aspx" target="_blank" rel="noopener">Paul's Online Notes — Logarithmic Differentiation</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Differentiate y = (1 − 4x)<sup>6</sup>.</li><li>Differentiate y = ln(3x + eˣ).</li><li>Find dy/dx for xy + y<sup>2</sup> = 6 at the point (1, 2).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) y′ = 6(1 − 4x)<sup>5</sup>·(−4) = −24(1 − 4x)<sup>5</sup>. 2) y′ = (3 + eˣ)/(3x + eˣ). 3) y + xy′ + 2yy′ = 0 ⇒ y′ = −y/(x + 2y) = −2/5.</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 3 · Bài 3.3</span>
<h2>Quy tắc dây chuyền, đạo hàm hàm ẩn và đạo hàm logarit</h2>
<p class="lead">Phần lớn mô hình thực tế là một chuỗi: chi phí phụ thuộc sản lượng, sản lượng phụ thuộc thời gian. Quy tắc dây chuyền nói các tốc độ thay đổi <em>nhân với nhau</em> dọc theo chuỗi — cũng chính là ý tưởng của lan truyền ngược (backpropagation) trong mạng nơ-ron.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận ra hàm ngoài và hàm trong của một hàm hợp, áp dụng quy tắc dây chuyền.</li><li>Kết hợp quy tắc dây chuyền với quy tắc tích và thương.</li><li>Lấy đạo hàm ẩn một phương trình để tìm dy/dx.</li><li>Dùng đạo hàm logarit cho hàm như x<sup>2x</sup>.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Quy tắc dây chuyền</span>[f(g(x))]′ = f′(g(x)) · g′(x)        dạng Leibniz: dy/dx = (dy/du)·(du/dx)</div>
<p>Công thức làm: lấy đạo hàm hàm <strong>ngoài</strong>, giữ nguyên phần bên trong, rồi nhân với đạo hàm của phần <strong>trong</strong>. Các trường hợp hay dùng:</p>
<div class="formula"><span class="lbl">Dây chuyền thường gặp</span>[u<sup>n</sup>]′ = n u<sup>n−1</sup> u′    [e<sup>u</sup>]′ = e<sup>u</sup> u′    [ln u]′ = u′/u    [sin u]′ = cos u · u′    [√u]′ = u′/(2√u)</div>
<p><strong>Đạo hàm hàm ẩn.</strong> Khi y được cho bởi một phương trình như x<sup>2</sup>y + y<sup>3</sup> = 10, lấy đạo hàm hai vế theo x, coi y là hàm của x (nên mỗi số hạng chứa y được nhân thêm y′ theo quy tắc dây chuyền), rồi giải ra y′.</p>
<p><strong>Đạo hàm logarit.</strong> Với y = f(x)<sup>g(x)</sup>, cả quy tắc luỹ thừa lẫn quy tắc hàm mũ đều không dùng được. Lấy ln hai vế, đạo hàm ẩn, rồi nhân với y.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> y = (2x<sup>3</sup> − 5)<sup>4</sup>. Ngoài u<sup>4</sup>, trong u = 2x<sup>3</sup> − 5. y′ = 4(2x<sup>3</sup> − 5)<sup>3</sup>·6x = <b>24x<sup>2</sup>(2x<sup>3</sup> − 5)<sup>3</sup></b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — khấu hao.</b> Một máy chủ có giá trị V(t) = 1000e<sup>−0,2t</sup> đô la sau t năm, mất giá với tốc độ V′(t) = 1000e<sup>−0,2t</sup>·(−0,2) = <b>−200e<sup>−0,2t</sup> đô la/năm</b>. Thêm: [ln(x<sup>2</sup> + 4)]′ = 2x/(x<sup>2</sup> + 4); [sin(5x<sup>2</sup>)]′ = 10x cos(5x<sup>2</sup>); [√(1 + eˣ)]′ = eˣ/(2√(1 + eˣ)).</p></div>
<div class="callout"><p><b>Ví dụ 3 — tốc độ dọc theo chuỗi.</b> Chi phí C(q) = 100 + 3q + 0,01q<sup>2</sup> đô la cho q sản phẩm, sản lượng tăng theo q(t) = 50 + 10t (t tính bằng tuần). Tại t = 5: q = 100, C′(100) = 3 + 0,02·100 = 5 đô la/sản phẩm và q′ = 10 sản phẩm/tuần, nên dC/dt = 5·10 = <b>50 đô la/tuần</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4 — hàm ẩn.</b> Tìm hệ số góc của x<sup>2</sup>y + y<sup>3</sup> = 10 tại (1, 2) (kiểm: 2 + 8 = 10). Lấy đạo hàm: 2xy + x<sup>2</sup>y′ + 3y<sup>2</sup>y′ = 0 ⇒ y′ = −2xy/(x<sup>2</sup> + 3y<sup>2</sup>). Tại (1, 2): y′ = −4/13.</p></div>
<div class="callout"><p><b>Ví dụ 5 — logarit.</b> y = x<sup>2x</sup> (x &gt; 0). ln y = 2x ln x ⇒ y′/y = 2 ln x + 2 ⇒ <b>y′ = 2x<sup>2x</sup>(ln x + 1)</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên nhân đạo hàm phần trong: [e<sup>−0,2t</sup>]′ không phải e<sup>−0,2t</sup>.</li><li>Đổi phần trong: [(2x<sup>3</sup> − 5)<sup>4</sup>]′ vẫn giữ (2x<sup>3</sup> − 5) bên trong luỹ thừa 3.</li><li>Khi đạo hàm ẩn, viết (y<sup>3</sup>)′ = 3y<sup>2</sup> mà thiếu thừa số y′.</li><li>Dùng quy tắc luỹ thừa cho x<sup>2x</sup>: số mũ không phải hằng số.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>[f(g(x))]′ = f′(g(x))·g′(x): đạo hàm ngoài × đạo hàm trong.</li><li>Leibniz: dy/dx = dy/du · du/dx — tốc độ nhân với nhau dọc chuỗi.</li><li>Hàm ẩn: đạo hàm hai vế, gắn y′ vào mọi số hạng chứa y, giải y′.</li><li>Với f(x)<sup>g(x)</sup>: lấy ln trước.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-6-the-chain-rule" target="_blank" rel="noopener">OpenStax — 3.6 Quy tắc dây chuyền</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-8-implicit-differentiation" target="_blank" rel="noopener">OpenStax — 3.8 Đạo hàm hàm ẩn</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ChainRule.aspx" target="_blank" rel="noopener">Paul's Online Notes — Quy tắc dây chuyền</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/LogDiff.aspx" target="_blank" rel="noopener">Paul's Online Notes — Đạo hàm logarit</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Lấy đạo hàm y = (1 − 4x)<sup>6</sup>.</li><li>Lấy đạo hàm y = ln(3x + eˣ).</li><li>Tìm dy/dx của xy + y<sup>2</sup> = 6 tại điểm (1, 2).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) y′ = 6(1 − 4x)<sup>5</sup>·(−4) = −24(1 − 4x)<sup>5</sup>. 2) y′ = (3 + eˣ)/(3x + eˣ). 3) y + xy′ + 2yy′ = 0 ⇒ y′ = −y/(x + 2y) = −2/5.</p></div>`);

const c34 = L('mac103-ts-3-4',
  '3.4 — Higher derivatives, linear approximation and differentials|||3.4 — Đạo hàm cấp cao, xấp xỉ tuyến tính và vi phân',
  'Đạo hàm cấp 2, cấp 3 (vận tốc, gia tốc); xấp xỉ tuyến tính L(x) = f(a) + f′(a)(x − a); vi phân dy = f′(x)dx để ước lượng thay đổi chi phí và sai số đo.',
  `<span class="eyebrow">MAC103 · Chapter 3 · Lesson 3.4</span>
<h2>Higher derivatives, linear approximation and differentials</h2>
<p class="lead">The derivative of a derivative tells you whether a rate is speeding up or slowing down. And the tangent line is a cheap “local model” of a function: it lets you estimate values and errors without a calculator.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute second and higher derivatives and interpret f″ as acceleration.</li><li>Build the linearization L(x) of a function at a point and use it to estimate values.</li><li>Use differentials dy = f′(x)dx to estimate changes and measurement errors.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Higher derivatives</span>f″ = (f′)′,  f‴ = (f″)′,  f<sup>(n)</sup>;  Leibniz: d<sup>2</sup>y/dx<sup>2</sup></div>
<p>If s(t) is position, then v(t) = s′(t) is velocity and a(t) = s″(t) is acceleration. In business, if a sales curve has S″ &gt; 0 the growth is accelerating; S″ &lt; 0 means growth is slowing (“diminishing returns”).</p>
<div class="formula"><span class="lbl">Linear approximation at x = a</span>f(x) ≈ L(x) = f(a) + f′(a)(x − a)    (good when x is close to a)</div>
<div class="formula"><span class="lbl">Differentials</span>dy = f′(x)·dx,    Δy ≈ dy    (Δy = actual change, dy = tangent-line change)</div>
<p>Classic approximations near 0: eˣ ≈ 1 + x, ln(1 + x) ≈ x, √(1 + x) ≈ 1 + x/2. For example e<sup>0.05</sup> ≈ 1.05 (true 1.05127) and ln 1.02 ≈ 0.02 (true 0.01980).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — motion.</b> A delivery robot moves along a track with s(t) = t<sup>3</sup> − 9t<sup>2</sup> + 24t metres. v(t) = 3t<sup>2</sup> − 18t + 24 = 3(t − 2)(t − 4), so it stops at t = 2 s and t = 4 s. a(t) = 6t − 18; a(1) = <b>−12 m/s<sup>2</sup></b> (braking).</p></div>
<div class="callout"><p><b>Example 2 — derivatives of every order.</b> f(x) = x<sup>4</sup> − 2x<sup>3</sup>: f″ = 12x<sup>2</sup> − 12x, f‴ = 24x − 12. For e<sup>3x</sup> each derivative brings a factor 3: the 5th derivative is 3<sup>5</sup>e<sup>3x</sup> = <b>243e<sup>3x</sup></b>.</p></div>
<div class="callout"><p><b>Example 3 — linearization.</b> Estimate ∛27.6. Take f(x) = x<sup>1/3</sup>, a = 27: f(27) = 3, f′(x) = 1/(3x<sup>2/3</sup>) ⇒ f′(27) = 1/27. L(27.6) = 3 + 0.6/27 ≈ <b>3.0222</b> (true value 3.02206).</p></div>
<div class="callout"><p><b>Example 4 — cost change.</b> C(x) = 1500 + 12x + 0.05x<sup>2</sup>. Raising output from 200 to 205: dC = C′(200)·5 = (12 + 0.1·200)·5 = 32·5 = <b>$160</b>. Exact ΔC = C(205) − C(200) = $161.25.</p></div>
<div class="callout"><p><b>Example 5 — measurement error.</b> A square server room has side x = 10 m measured with error ±0.05 m. A = x<sup>2</sup>, dA = 2x·dx = 2·10·0.05 = <b>±1 m<sup>2</sup></b> (relative error 1%).</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using the linearization far from a: the error grows quickly.</li><li>Confusing dy (tangent estimate) with Δy (actual change).</li><li>Reading v(t) = 0 as “acceleration is zero” — they are different derivatives.</li><li>Forgetting that f″ needs the full simplified f′ first.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>f″ measures how fast f′ changes: acceleration, speeding-up or slowing growth.</li><li>L(x) = f(a) + f′(a)(x − a) approximates f near a.</li><li>dy = f′(x)dx estimates Δy; useful for cost changes and error propagation.</li><li>Near 0: eˣ ≈ 1 + x, ln(1 + x) ≈ x.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-2-linear-approximations-and-differentials" target="_blank" rel="noopener">OpenStax — 4.2 Linear Approximations and Differentials</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/HigherOrderDerivatives.aspx" target="_blank" rel="noopener">Paul's Online Notes — Higher Order Derivatives</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/LinearApproximations.aspx" target="_blank" rel="noopener">Paul's Online Notes — Linear Approximations</a></li><li><a href="https://www.3blue1brown.com/lessons/higher-order-derivatives" target="_blank" rel="noopener">3Blue1Brown — Higher order derivatives</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>s(t) = 2t<sup>3</sup> − 15t<sup>2</sup> + 36t. Find v(t), when the object stops, and a(3).</li><li>Use the linearization of √x at x = 49 to estimate √50.</li><li>Find f″(x) for f(x) = ln x.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) v = 6t<sup>2</sup> − 30t + 36 = 6(t − 2)(t − 3): stops at t = 2 and t = 3; a(t) = 12t − 30, a(3) = 6. 2) f′(49) = 1/14 ⇒ √50 ≈ 7 + 1/14 ≈ 7.0714 (true 7.0711). 3) f′ = 1/x, f″ = −1/x<sup>2</sup>.</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 3 · Bài 3.4</span>
<h2>Đạo hàm cấp cao, xấp xỉ tuyến tính và vi phân</h2>
<p class="lead">Đạo hàm của đạo hàm cho biết một tốc độ đang nhanh lên hay chậm lại. Còn tiếp tuyến là một “mô hình cục bộ” rẻ tiền của hàm: giúp ước lượng giá trị và sai số mà không cần máy tính.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính đạo hàm cấp hai, cấp cao và hiểu f″ là gia tốc.</li><li>Dựng xấp xỉ tuyến tính L(x) của hàm tại một điểm và dùng để ước lượng giá trị.</li><li>Dùng vi phân dy = f′(x)dx để ước lượng thay đổi và sai số đo.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Đạo hàm cấp cao</span>f″ = (f′)′,  f‴ = (f″)′,  f<sup>(n)</sup>;  Leibniz: d<sup>2</sup>y/dx<sup>2</sup></div>
<p>Nếu s(t) là vị trí thì v(t) = s′(t) là vận tốc và a(t) = s″(t) là gia tốc. Trong kinh doanh, đường doanh số có S″ &gt; 0 nghĩa là tăng trưởng đang tăng tốc; S″ &lt; 0 nghĩa là tăng trưởng đang chậm lại (“lợi suất giảm dần”).</p>
<div class="formula"><span class="lbl">Xấp xỉ tuyến tính tại x = a</span>f(x) ≈ L(x) = f(a) + f′(a)(x − a)    (tốt khi x gần a)</div>
<div class="formula"><span class="lbl">Vi phân</span>dy = f′(x)·dx,    Δy ≈ dy    (Δy = thay đổi thật, dy = thay đổi theo tiếp tuyến)</div>
<p>Các xấp xỉ kinh điển gần 0: eˣ ≈ 1 + x, ln(1 + x) ≈ x, √(1 + x) ≈ 1 + x/2. Ví dụ e<sup>0,05</sup> ≈ 1,05 (đúng 1,05127) và ln 1,02 ≈ 0,02 (đúng 0,01980).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — chuyển động.</b> Robot giao hàng chạy trên ray với s(t) = t<sup>3</sup> − 9t<sup>2</sup> + 24t mét. v(t) = 3t<sup>2</sup> − 18t + 24 = 3(t − 2)(t − 4), nên nó dừng tại t = 2 s và t = 4 s. a(t) = 6t − 18; a(1) = <b>−12 m/s<sup>2</sup></b> (đang hãm).</p></div>
<div class="callout"><p><b>Ví dụ 2 — đạo hàm mọi cấp.</b> f(x) = x<sup>4</sup> − 2x<sup>3</sup>: f″ = 12x<sup>2</sup> − 12x, f‴ = 24x − 12. Với e<sup>3x</sup> mỗi lần đạo hàm thêm thừa số 3: đạo hàm cấp 5 là 3<sup>5</sup>e<sup>3x</sup> = <b>243e<sup>3x</sup></b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — tuyến tính hoá.</b> Ước lượng ∛27,6. Lấy f(x) = x<sup>1/3</sup>, a = 27: f(27) = 3, f′(x) = 1/(3x<sup>2/3</sup>) ⇒ f′(27) = 1/27. L(27,6) = 3 + 0,6/27 ≈ <b>3,0222</b> (giá trị đúng 3,02206).</p></div>
<div class="callout"><p><b>Ví dụ 4 — thay đổi chi phí.</b> C(x) = 1500 + 12x + 0,05x<sup>2</sup>. Tăng sản lượng từ 200 lên 205: dC = C′(200)·5 = (12 + 0,1·200)·5 = 32·5 = <b>160 đô la</b>. Đúng: ΔC = C(205) − C(200) = 161,25 đô la.</p></div>
<div class="callout"><p><b>Ví dụ 5 — sai số đo.</b> Phòng máy chủ hình vuông cạnh x = 10 m, đo sai ±0,05 m. A = x<sup>2</sup>, dA = 2x·dx = 2·10·0,05 = <b>±1 m<sup>2</sup></b> (sai số tương đối 1%).</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng xấp xỉ tuyến tính ở xa điểm a: sai số tăng rất nhanh.</li><li>Nhầm dy (ước lượng theo tiếp tuyến) với Δy (thay đổi thật).</li><li>Đọc v(t) = 0 thành “gia tốc bằng 0” — đó là hai đạo hàm khác nhau.</li><li>Tính f″ khi f′ chưa rút gọn xong.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>f″ đo f′ thay đổi nhanh cỡ nào: gia tốc, tăng trưởng nhanh lên hay chậm lại.</li><li>L(x) = f(a) + f′(a)(x − a) xấp xỉ f gần a.</li><li>dy = f′(x)dx ước lượng Δy; dùng cho thay đổi chi phí và lan truyền sai số.</li><li>Gần 0: eˣ ≈ 1 + x, ln(1 + x) ≈ x.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-2-linear-approximations-and-differentials" target="_blank" rel="noopener">OpenStax — 4.2 Xấp xỉ tuyến tính và vi phân</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/HigherOrderDerivatives.aspx" target="_blank" rel="noopener">Paul's Online Notes — Đạo hàm cấp cao</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/LinearApproximations.aspx" target="_blank" rel="noopener">Paul's Online Notes — Xấp xỉ tuyến tính</a></li><li><a href="https://www.3blue1brown.com/lessons/higher-order-derivatives" target="_blank" rel="noopener">3Blue1Brown — Đạo hàm cấp cao</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>s(t) = 2t<sup>3</sup> − 15t<sup>2</sup> + 36t. Tìm v(t), thời điểm vật dừng và a(3).</li><li>Dùng tuyến tính hoá của √x tại x = 49 để ước lượng √50.</li><li>Tìm f″(x) với f(x) = ln x.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) v = 6t<sup>2</sup> − 30t + 36 = 6(t − 2)(t − 3): dừng tại t = 2 và t = 3; a(t) = 12t − 30, a(3) = 6. 2) f′(49) = 1/14 ⇒ √50 ≈ 7 + 1/14 ≈ 7,0714 (đúng 7,0711). 3) f′ = 1/x, f″ = −1/x<sup>2</sup>.</p></div>`);

const q3 = QZ(3, 'Quiz — Chapter 3: Derivatives|||Quiz — Chương 3: Đạo hàm', 'Kiểm tra chương 3: định nghĩa đạo hàm, chi phí biên, quy tắc tích/thương/dây chuyền, đạo hàm hàm ẩn, đạo hàm cấp cao, xấp xỉ tuyến tính.', [
  Q('q1', 'For f(x) = x² + 5x, f′(1) equals|||Với f(x) = x² + 5x, f′(1) bằng',
    ['5|||5', '6|||6', '7|||7', '2|||2'], 2,
    'f′(x) = 2x + 5, so f′(1) = 7.|||f′(x) = 2x + 5 nên f′(1) = 7.'),
  Q('q2', 'C(x) = 1000 + 8x + 0.01x² dollars. The marginal cost at x = 200 is|||C(x) = 1000 + 8x + 0,01x² đô la. Chi phí biên tại x = 200 là',
    ['$12 per unit|||12 đô la/sản phẩm', '$10 per unit|||10 đô la/sản phẩm', '$4 per unit|||4 đô la/sản phẩm', '$16 per unit|||16 đô la/sản phẩm'], 0,
    'C′(x) = 8 + 0.02x; C′(200) = 8 + 4 = 12.|||C′(x) = 8 + 0,02x; C′(200) = 8 + 4 = 12.'),
  Q('q3', 'd/dx (x² eˣ) =|||d/dx (x² eˣ) =',
    ['2x eˣ|||2x eˣ', 'x² eˣ|||x² eˣ', '2x e^(x−1)|||2x e^(x−1)', 'eˣ(x² + 2x)|||eˣ(x² + 2x)'], 3,
    'Product rule: 2x·eˣ + x²·eˣ.|||Quy tắc tích: 2x·eˣ + x²·eˣ.'),
  Q('q4', 'd/dx [(x + 1)/(x − 1)] =|||d/dx [(x + 1)/(x − 1)] =',
    ['2/(x − 1)²|||2/(x − 1)²', '−2/(x − 1)²|||−2/(x − 1)²', '1|||1', '2x/(x − 1)²|||2x/(x − 1)²'], 1,
    '[(x − 1) − (x + 1)]/(x − 1)² = −2/(x − 1)².|||[(x − 1) − (x + 1)]/(x − 1)² = −2/(x − 1)².'),
  Q('q5', 'd/dx ln(x³ + 1) =|||d/dx ln(x³ + 1) =',
    ['1/(x³ + 1)|||1/(x³ + 1)', '3x²|||3x²', '3x²/(x³ + 1)|||3x²/(x³ + 1)', 'ln(3x²)|||ln(3x²)'], 2,
    'Chain rule: (ln u)′ = u′/u with u = x³ + 1.|||Quy tắc dây chuyền: (ln u)′ = u′/u với u = x³ + 1.'),
  Q('q6', 'd/dx e^(−3x²) =|||d/dx e^(−3x²) =',
    ['−6x e^(−3x²)|||−6x e^(−3x²)', 'e^(−3x²)|||e^(−3x²)', '−3x² e^(−3x² − 1)|||−3x² e^(−3x² − 1)', '−6x|||−6x'], 0,
    'Outer eᵘ, inner u = −3x², u′ = −6x.|||Ngoài eᵘ, trong u = −3x², u′ = −6x.'),
  Q('q7', 'On the circle x² + y² = 25, dy/dx at (3, 4) is|||Trên đường tròn x² + y² = 25, dy/dx tại (3, 4) là',
    ['3/4|||3/4', '4/3|||4/3', '−4/3|||−4/3', '−3/4|||−3/4'], 3,
    '2x + 2y y′ = 0 ⇒ y′ = −x/y = −3/4.|||2x + 2y y′ = 0 ⇒ y′ = −x/y = −3/4.'),
  Q('q8', 's(t) = t³ − 6t² (metres). The acceleration at t = 3 s is|||s(t) = t³ − 6t² (mét). Gia tốc tại t = 3 s là',
    ['−9 m/s²|||−9 m/s²', '6 m/s²|||6 m/s²', '0 m/s²|||0 m/s²', '−12 m/s²|||−12 m/s²'], 1,
    'v = 3t² − 12t, a = 6t − 12, a(3) = 6.|||v = 3t² − 12t, a = 6t − 12, a(3) = 6.'),
  Q('q9', 'Using the linearization of √x at 100, √102 ≈|||Dùng tuyến tính hoá của √x tại 100, √102 ≈',
    ['10.2|||10,2', '10.01|||10,01', '10.1|||10,1', '10.05|||10,05'], 2,
    'f′(100) = 1/20, so √102 ≈ 10 + 2/20 = 10.1.|||f′(100) = 1/20 nên √102 ≈ 10 + 2/20 = 10,1.'),
  Q('q10', 'The second derivative of sin(2x) is|||Đạo hàm cấp hai của sin(2x) là',
    ['−4 sin(2x)|||−4 sin(2x)', '4 sin(2x)|||4 sin(2x)', '−2 cos(2x)|||−2 cos(2x)', '2 cos(2x)|||2 cos(2x)'], 0,
    'First 2cos(2x), then −4 sin(2x).|||Lần đầu 2cos(2x), lần hai −4 sin(2x).'),
]);

const ch3 = {
  title: 'Chapter 3 — Derivatives and differentiation rules|||Chương 3 — Đạo hàm và quy tắc tính đạo hàm',
  description: 'Đạo hàm từ định nghĩa, tiếp tuyến, chi phí/doanh thu biên; quy tắc luỹ thừa, tích, thương, mũ, logarit, lượng giác; quy tắc dây chuyền, hàm ẩn; đạo hàm cấp cao, xấp xỉ tuyến tính và vi phân (Stewart ch.2–3 · OpenStax Vol.1 ch.3, 4.2).',
  lessons: [c31, c32, c33, c34, q3],
};


// ───────────────────────────── Chương 4 — Ứng dụng đạo hàm ─────────────────────────────
const c41 = L('mac103-ts-4-1',
  '4.1 — Increasing/decreasing functions, critical points and extreme values|||4.1 — Tính đơn điệu, điểm tới hạn và giá trị cực trị',
  'Dấu của f′ quyết định đồng biến/nghịch biến; điểm tới hạn; phép thử đạo hàm cấp một; giá trị lớn nhất/nhỏ nhất trên đoạn kín; định lý giá trị trung bình (MVT).',
  `<span class="eyebrow">MAC103 · Chapter 4 · Lesson 4.1</span>
<h2>Increasing/decreasing functions, critical points and extreme values</h2>
<p class="lead">Managers want the highest profit, engineers the lowest energy use. Before optimising anything, you need to know where a function goes up, where it goes down, and where it turns. The sign of f′ tells you all of that.</p>
<h3>🎯 Objectives</h3>
<ul><li>Find intervals of increase and decrease from the sign of f′.</li><li>Locate critical points and classify them with the first-derivative test.</li><li>Find absolute extrema on a closed interval with the closed-interval method.</li><li>State and use the Mean Value Theorem.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Monotonicity test</span>f′ &gt; 0 on an interval ⇒ f increasing there;    f′ &lt; 0 ⇒ f decreasing</div>
<p>A <strong>critical point</strong> of f is a number c in the domain where f′(c) = 0 or f′(c) does not exist. Local extrema can only occur at critical points (Fermat's theorem) — but not every critical point is an extremum.</p>
<div class="formula"><span class="lbl">First-derivative test</span>f′ changes + → − at c ⇒ local max;   − → + ⇒ local min;   no sign change ⇒ neither</div>
<div class="formula"><span class="lbl">Closed-interval method (f continuous on [a, b])</span>1) find critical points in (a, b)  2) evaluate f at them and at a, b  3) largest = absolute max, smallest = absolute min</div>
<div class="formula"><span class="lbl">Mean Value Theorem</span>f continuous on [a, b], differentiable on (a, b) ⇒ ∃ c ∈ (a, b): f′(c) = [f(b) − f(a)]/(b − a)</div>
<p>Meaning: somewhere the instantaneous rate equals the average rate. A truck that covers 180 km in 2 hours must, at some instant, be driving at exactly 90 km/h — the logic behind average-speed cameras.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — sign chart.</b> f(x) = x<sup>3</sup> − 3x<sup>2</sup> − 9x + 5. f′(x) = 3x<sup>2</sup> − 6x − 9 = 3(x − 3)(x + 1). Critical points: x = −1, x = 3.</p><p>f′ &gt; 0 on (−∞, −1), f′ &lt; 0 on (−1, 3), f′ &gt; 0 on (3, ∞). So f increases, decreases, increases: <b>local max f(−1) = 10</b>, <b>local min f(3) = −22</b>.</p></div>
<div class="callout"><p><b>Example 2 — closed interval.</b> Same f on [−2, 4]. Candidates: f(−2) = 3, f(−1) = 10, f(3) = −22, f(4) = −15. Absolute max <b>10 at x = −1</b>, absolute min <b>−22 at x = 3</b>.</p></div>
<div class="callout"><p><b>Example 3 — a transcendental function.</b> h(x) = x<sup>2</sup>e<sup>−x</sup> on [0, 4] (e.g. the response of a drug or an ad campaign over time). h′(x) = e<sup>−x</sup>(2x − x<sup>2</sup>) = x(2 − x)e<sup>−x</sup> ⇒ critical points 0 and 2. h(0) = 0, h(2) = 4/e<sup>2</sup> ≈ 0.541, h(4) = 16/e<sup>4</sup> ≈ 0.293. Absolute max <b>4/e<sup>2</sup> at x = 2</b>, absolute min 0 at x = 0.</p></div>
<div class="callout"><p><b>Example 4 — MVT.</b> f(x) = x<sup>2</sup> on [1, 3]: average slope (9 − 1)/2 = 4. f′(c) = 2c = 4 ⇒ <b>c = 2</b>, which lies in (1, 3).</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the endpoints in the closed-interval method — the maximum is often at an endpoint.</li><li>Declaring every critical point an extremum: x<sup>3</sup> has f′(0) = 0 but no extremum.</li><li>Forgetting points where f′ does not exist (e.g. |x| at 0).</li><li>Including critical points that lie outside the interval.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Sign of f′ ⇒ increasing/decreasing.</li><li>Critical points: f′ = 0 or undefined; test them with the sign change of f′.</li><li>Absolute extrema on [a, b]: compare f at critical points and endpoints.</li><li>MVT: some instantaneous rate equals the average rate.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-3-maxima-and-minima" target="_blank" rel="noopener">OpenStax — 4.3 Maxima and Minima</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-4-the-mean-value-theorem" target="_blank" rel="noopener">OpenStax — 4.4 The Mean Value Theorem</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/CriticalPoints.aspx" target="_blank" rel="noopener">Paul's Online Notes — Critical Points</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/AbsExtrema.aspx" target="_blank" rel="noopener">Paul's Online Notes — Finding Absolute Extrema</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the intervals of monotonicity and local extrema of f(x) = 2x<sup>3</sup> − 3x<sup>2</sup> − 12x.</li><li>Find the absolute max and min of f(x) = x<sup>4</sup> − 8x<sup>2</sup> on [−1, 3].</li><li>Find the number c given by the MVT for f(x) = √x on [0, 4].</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) f′ = 6(x − 2)(x + 1): increasing on (−∞, −1) and (2, ∞), decreasing on (−1, 2); local max f(−1) = 7, local min f(2) = −20. 2) f′ = 4x(x<sup>2</sup> − 4) ⇒ critical points 0, 2 in the interval (−2 is outside). f(−1) = −7, f(0) = 0, f(2) = −16, f(3) = 9 ⇒ max 9 at x = 3, min −16 at x = 2. 3) Average slope (2 − 0)/4 = 1/2 = 1/(2√c) ⇒ c = 1.</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 4 · Bài 4.1</span>
<h2>Tính đơn điệu, điểm tới hạn và giá trị cực trị</h2>
<p class="lead">Nhà quản lý muốn lợi nhuận cao nhất, kỹ sư muốn năng lượng thấp nhất. Trước khi tối ưu bất cứ thứ gì, cần biết hàm đi lên ở đâu, đi xuống ở đâu và đổi chiều ở đâu. Dấu của f′ cho biết tất cả.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tìm khoảng đồng biến, nghịch biến từ dấu của f′.</li><li>Tìm điểm tới hạn và phân loại bằng phép thử đạo hàm cấp một.</li><li>Tìm giá trị lớn nhất, nhỏ nhất trên đoạn kín.</li><li>Phát biểu và dùng định lý giá trị trung bình.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Tiêu chuẩn đơn điệu</span>f′ &gt; 0 trên một khoảng ⇒ f đồng biến ở đó;    f′ &lt; 0 ⇒ f nghịch biến</div>
<p><strong>Điểm tới hạn</strong> của f là số c thuộc tập xác định mà f′(c) = 0 hoặc f′(c) không tồn tại. Cực trị địa phương chỉ có thể xảy ra tại điểm tới hạn (định lý Fermat) — nhưng không phải điểm tới hạn nào cũng là cực trị.</p>
<div class="formula"><span class="lbl">Phép thử đạo hàm cấp một</span>f′ đổi dấu + → − tại c ⇒ cực đại;   − → + ⇒ cực tiểu;   không đổi dấu ⇒ không phải cực trị</div>
<div class="formula"><span class="lbl">Phương pháp đoạn kín (f liên tục trên [a, b])</span>1) tìm điểm tới hạn trong (a, b)  2) tính f tại đó và tại a, b  3) lớn nhất = GTLN, nhỏ nhất = GTNN</div>
<div class="formula"><span class="lbl">Định lý giá trị trung bình</span>f liên tục trên [a, b], khả vi trên (a, b) ⇒ ∃ c ∈ (a, b): f′(c) = [f(b) − f(a)]/(b − a)</div>
<p>Ý nghĩa: ở đâu đó tốc độ tức thời bằng tốc độ trung bình. Xe tải đi 180 km trong 2 giờ thì chắc chắn có lúc chạy đúng 90 km/h — đây là logic của camera đo tốc độ trung bình.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — bảng xét dấu.</b> f(x) = x<sup>3</sup> − 3x<sup>2</sup> − 9x + 5. f′(x) = 3x<sup>2</sup> − 6x − 9 = 3(x − 3)(x + 1). Điểm tới hạn: x = −1, x = 3.</p><p>f′ &gt; 0 trên (−∞, −1), f′ &lt; 0 trên (−1, 3), f′ &gt; 0 trên (3, ∞). Vậy f tăng, giảm, tăng: <b>cực đại f(−1) = 10</b>, <b>cực tiểu f(3) = −22</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — đoạn kín.</b> Cùng f trên [−2, 4]. Ứng viên: f(−2) = 3, f(−1) = 10, f(3) = −22, f(4) = −15. GTLN <b>10 tại x = −1</b>, GTNN <b>−22 tại x = 3</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — hàm siêu việt.</b> h(x) = x<sup>2</sup>e<sup>−x</sup> trên [0, 4] (ví dụ phản ứng của thuốc hay hiệu quả một chiến dịch quảng cáo theo thời gian). h′(x) = e<sup>−x</sup>(2x − x<sup>2</sup>) = x(2 − x)e<sup>−x</sup> ⇒ điểm tới hạn 0 và 2. h(0) = 0, h(2) = 4/e<sup>2</sup> ≈ 0,541, h(4) = 16/e<sup>4</sup> ≈ 0,293. GTLN <b>4/e<sup>2</sup> tại x = 2</b>, GTNN 0 tại x = 0.</p></div>
<div class="callout"><p><b>Ví dụ 4 — MVT.</b> f(x) = x<sup>2</sup> trên [1, 3]: hệ số góc trung bình (9 − 1)/2 = 4. f′(c) = 2c = 4 ⇒ <b>c = 2</b>, nằm trong (1, 3).</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên hai đầu mút khi dùng phương pháp đoạn kín — GTLN thường nằm ở đầu mút.</li><li>Coi mọi điểm tới hạn là cực trị: x<sup>3</sup> có f′(0) = 0 nhưng không có cực trị.</li><li>Bỏ sót điểm f′ không tồn tại (ví dụ |x| tại 0).</li><li>Tính cả điểm tới hạn nằm ngoài đoạn.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Dấu f′ ⇒ đồng biến/nghịch biến.</li><li>Điểm tới hạn: f′ = 0 hoặc không xác định; kiểm bằng sự đổi dấu của f′.</li><li>GTLN/GTNN trên [a, b]: so f tại điểm tới hạn và hai đầu mút.</li><li>MVT: có một tốc độ tức thời bằng tốc độ trung bình.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-3-maxima-and-minima" target="_blank" rel="noopener">OpenStax — 4.3 Cực đại và cực tiểu</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-4-the-mean-value-theorem" target="_blank" rel="noopener">OpenStax — 4.4 Định lý giá trị trung bình</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/CriticalPoints.aspx" target="_blank" rel="noopener">Paul's Online Notes — Điểm tới hạn</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/AbsExtrema.aspx" target="_blank" rel="noopener">Paul's Online Notes — Tìm cực trị tuyệt đối</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm khoảng đơn điệu và cực trị của f(x) = 2x<sup>3</sup> − 3x<sup>2</sup> − 12x.</li><li>Tìm GTLN, GTNN của f(x) = x<sup>4</sup> − 8x<sup>2</sup> trên [−1, 3].</li><li>Tìm số c theo MVT cho f(x) = √x trên [0, 4].</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) f′ = 6(x − 2)(x + 1): đồng biến trên (−∞, −1) và (2, ∞), nghịch biến trên (−1, 2); cực đại f(−1) = 7, cực tiểu f(2) = −20. 2) f′ = 4x(x<sup>2</sup> − 4) ⇒ điểm tới hạn trong đoạn là 0 và 2 (−2 nằm ngoài). f(−1) = −7, f(0) = 0, f(2) = −16, f(3) = 9 ⇒ GTLN 9 tại x = 3, GTNN −16 tại x = 2. 3) Hệ số góc trung bình (2 − 0)/4 = 1/2 = 1/(2√c) ⇒ c = 1.</p></div>`);

const c42 = L('mac103-ts-4-2',
  '4.2 — Concavity, inflection points, second-derivative test and curve sketching|||4.2 — Tính lồi lõm, điểm uốn, phép thử đạo hàm cấp hai và khảo sát đồ thị',
  'Dấu của f″ quyết định lồi (lõm lên)/lõm (lõm xuống); điểm uốn và “điểm lợi suất giảm dần”; phép thử đạo hàm cấp hai; quy trình 7 bước khảo sát đồ thị.',
  `<span class="eyebrow">MAC103 · Chapter 4 · Lesson 4.2</span>
<h2>Concavity, inflection points and curve sketching</h2>
<p class="lead">Two products can both be growing, yet one is taking off while the other is levelling off. The first derivative cannot tell them apart — the second derivative can. It describes how a graph <em>bends</em>.</p>
<h3>🎯 Objectives</h3>
<ul><li>Determine where a graph is concave up or concave down using f″.</li><li>Find inflection points and interpret them (point of diminishing returns).</li><li>Classify critical points with the second-derivative test.</li><li>Follow a checklist to sketch a curve.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Concavity test</span>f″ &gt; 0 on I ⇒ concave up (∪, slopes increasing);    f″ &lt; 0 on I ⇒ concave down (∩, slopes decreasing)</div>
<p>An <strong>inflection point</strong> is a point on the graph where the concavity changes. Candidates are where f″ = 0 or f″ does not exist — but you must check that the sign of f″ really changes.</p>
<div class="formula"><span class="lbl">Second-derivative test</span>f′(c) = 0 and f″(c) &gt; 0 ⇒ local min;    f′(c) = 0 and f″(c) &lt; 0 ⇒ local max;    f″(c) = 0 ⇒ inconclusive</div>
<p><strong>Curve-sketching checklist:</strong> (1) domain; (2) intercepts; (3) symmetry; (4) asymptotes (limits at ±∞ and at excluded points); (5) f′: intervals of increase/decrease, local extrema; (6) f″: concavity, inflection points; (7) plot key points and join them with the right shape.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — a full analysis.</b> f(x) = x<sup>4</sup> − 4x<sup>3</sup>. f′ = 4x<sup>3</sup> − 12x<sup>2</sup> = 4x<sup>2</sup>(x − 3); f″ = 12x<sup>2</sup> − 24x = 12x(x − 2).</p><p>f′ ≤ 0 on (−∞, 3) and f′ &gt; 0 on (3, ∞): x = 0 is critical but <b>not</b> an extremum (no sign change); <b>local min f(3) = −27</b>. f″ &gt; 0 on (−∞, 0), &lt; 0 on (0, 2), &gt; 0 on (2, ∞): <b>inflection points (0, 0) and (2, −16)</b>.</p></div>
<div class="callout"><p><b>Example 2 — second-derivative test.</b> f(x) = 2x<sup>3</sup> − 9x<sup>2</sup> + 12x. f′ = 6(x − 1)(x − 2), f″ = 12x − 18. f″(1) = −6 &lt; 0 ⇒ <b>local max f(1) = 5</b>; f″(2) = 6 &gt; 0 ⇒ <b>local min f(2) = 4</b>.</p></div>
<div class="callout"><p><b>Example 3 — point of diminishing returns.</b> Users of a new app follow the logistic model N(t) = 10000/(1 + 9e<sup>−0.5t</sup>) (t in weeks). Solving N″(t) = 0 gives t = 2 ln 9 ≈ <b>4.39 weeks</b>, where N = 5000 (half the market) and growth peaks at N′ = <b>1250 users/week</b>. After that, growth continues but slows: extra marketing money buys fewer new users.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Calling every zero of f″ an inflection point: f(x) = x<sup>4</sup> has f″(0) = 0 but is concave up on both sides.</li><li>Concluding “no extremum” when f″(c) = 0 — the test is simply inconclusive; go back to the first-derivative test.</li><li>Mixing up the shapes: concave up ∪ “holds water”, concave down ∩ “spills water”.</li><li>Reporting an inflection point as an x-value only; it is a point (x, f(x)).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>f″ &gt; 0: concave up; f″ &lt; 0: concave down.</li><li>Inflection point: concavity really changes sign.</li><li>Second-derivative test: f′(c) = 0 with f″(c) &gt; 0 ⇒ min, &lt; 0 ⇒ max, = 0 ⇒ no conclusion.</li><li>For S-shaped growth, the inflection point is where growth is fastest.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-5-derivatives-and-the-shape-of-a-graph" target="_blank" rel="noopener">OpenStax — 4.5 Derivatives and the Shape of a Graph</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ShapeofGraphPtII.aspx" target="_blank" rel="noopener">Paul's Online Notes — The Shape of a Graph, Part II</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-2-applications-of-differentiation/part-a-approximation-and-curve-sketching/" target="_blank" rel="noopener">MIT OCW 18.01SC — Approximation and Curve Sketching</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the intervals of concavity and the inflection point of f(x) = x<sup>3</sup> − 6x<sup>2</sup> + 5.</li><li>Use the second-derivative test on f(x) = 3x<sup>4</sup> − 4x<sup>3</sup>. What happens at x = 0?</li><li>Give an example of a function with f″(0) = 0 but no inflection point at 0.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) f″ = 6x − 12: concave down on (−∞, 2), up on (2, ∞); inflection point (2, −11). 2) f′ = 12x<sup>2</sup>(x − 1) ⇒ critical points 0, 1. f″ = 12x(3x − 2): f″(1) = 12 &gt; 0 ⇒ local min f(1) = −1. f″(0) = 0 ⇒ inconclusive; f′ ≤ 0 on both sides of 0, so x = 0 is not an extremum. 3) f(x) = x<sup>4</sup>.</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 4 · Bài 4.2</span>
<h2>Tính lồi lõm, điểm uốn và khảo sát đồ thị</h2>
<p class="lead">Hai sản phẩm đều đang tăng trưởng, nhưng một cái đang cất cánh, cái kia đang chững lại. Đạo hàm cấp một không phân biệt được — đạo hàm cấp hai thì được. Nó mô tả đồ thị <em>cong</em> như thế nào.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Xác định đồ thị lõm lên hay lõm xuống bằng f″.</li><li>Tìm điểm uốn và giải thích ý nghĩa (điểm lợi suất giảm dần).</li><li>Phân loại điểm tới hạn bằng phép thử đạo hàm cấp hai.</li><li>Theo một quy trình để khảo sát và vẽ đồ thị.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Tiêu chuẩn lồi lõm</span>f″ &gt; 0 trên I ⇒ lõm lên (∪, hệ số góc tăng);    f″ &lt; 0 trên I ⇒ lõm xuống (∩, hệ số góc giảm)</div>
<p><strong>Điểm uốn</strong> là điểm trên đồ thị nơi tính lồi lõm đổi chiều. Ứng viên là chỗ f″ = 0 hoặc f″ không tồn tại — nhưng phải kiểm dấu của f″ có thật sự đổi.</p>
<div class="formula"><span class="lbl">Phép thử đạo hàm cấp hai</span>f′(c) = 0 và f″(c) &gt; 0 ⇒ cực tiểu;    f′(c) = 0 và f″(c) &lt; 0 ⇒ cực đại;    f″(c) = 0 ⇒ chưa kết luận</div>
<p><strong>Quy trình khảo sát:</strong> (1) tập xác định; (2) giao điểm với trục; (3) tính đối xứng; (4) tiệm cận (giới hạn tại ±∞ và tại điểm bị loại); (5) f′: khoảng đơn điệu, cực trị; (6) f″: lồi lõm, điểm uốn; (7) chấm các điểm then chốt và nối theo đúng hình dạng.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — khảo sát đầy đủ.</b> f(x) = x<sup>4</sup> − 4x<sup>3</sup>. f′ = 4x<sup>3</sup> − 12x<sup>2</sup> = 4x<sup>2</sup>(x − 3); f″ = 12x<sup>2</sup> − 24x = 12x(x − 2).</p><p>f′ ≤ 0 trên (−∞, 3) và f′ &gt; 0 trên (3, ∞): x = 0 là điểm tới hạn nhưng <b>không</b> là cực trị (không đổi dấu); <b>cực tiểu f(3) = −27</b>. f″ &gt; 0 trên (−∞, 0), &lt; 0 trên (0, 2), &gt; 0 trên (2, ∞): <b>điểm uốn (0, 0) và (2, −16)</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — phép thử cấp hai.</b> f(x) = 2x<sup>3</sup> − 9x<sup>2</sup> + 12x. f′ = 6(x − 1)(x − 2), f″ = 12x − 18. f″(1) = −6 &lt; 0 ⇒ <b>cực đại f(1) = 5</b>; f″(2) = 6 &gt; 0 ⇒ <b>cực tiểu f(2) = 4</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — điểm lợi suất giảm dần.</b> Số người dùng một ứng dụng mới theo mô hình logistic N(t) = 10000/(1 + 9e<sup>−0,5t</sup>) (t tính bằng tuần). Giải N″(t) = 0 được t = 2 ln 9 ≈ <b>4,39 tuần</b>, lúc đó N = 5000 (nửa thị trường) và tốc độ tăng đạt đỉnh N′ = <b>1250 người/tuần</b>. Sau đó vẫn tăng nhưng chậm dần: thêm tiền marketing mua được ít người dùng mới hơn.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Coi mọi nghiệm của f″ là điểm uốn: f(x) = x<sup>4</sup> có f″(0) = 0 nhưng lõm lên ở cả hai phía.</li><li>Kết luận “không có cực trị” khi f″(c) = 0 — phép thử chỉ là chưa kết luận; quay lại phép thử cấp một.</li><li>Nhầm hình dạng: lõm lên ∪ “đựng được nước”, lõm xuống ∩ “làm đổ nước”.</li><li>Ghi điểm uốn chỉ bằng hoành độ; điểm uốn là một điểm (x, f(x)).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>f″ &gt; 0: lõm lên; f″ &lt; 0: lõm xuống.</li><li>Điểm uốn: tính lồi lõm thật sự đổi dấu.</li><li>Phép thử cấp hai: f′(c) = 0 và f″(c) &gt; 0 ⇒ cực tiểu, &lt; 0 ⇒ cực đại, = 0 ⇒ chưa kết luận.</li><li>Với tăng trưởng hình chữ S, điểm uốn là lúc tăng nhanh nhất.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-5-derivatives-and-the-shape-of-a-graph" target="_blank" rel="noopener">OpenStax — 4.5 Đạo hàm và hình dạng đồ thị</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ShapeofGraphPtII.aspx" target="_blank" rel="noopener">Paul's Online Notes — Hình dạng đồ thị, phần II</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-2-applications-of-differentiation/part-a-approximation-and-curve-sketching/" target="_blank" rel="noopener">MIT OCW 18.01SC — Xấp xỉ và khảo sát đồ thị</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm khoảng lồi lõm và điểm uốn của f(x) = x<sup>3</sup> − 6x<sup>2</sup> + 5.</li><li>Dùng phép thử cấp hai cho f(x) = 3x<sup>4</sup> − 4x<sup>3</sup>. Tại x = 0 thì sao?</li><li>Cho ví dụ hàm có f″(0) = 0 nhưng không có điểm uốn tại 0.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) f″ = 6x − 12: lõm xuống trên (−∞, 2), lõm lên trên (2, ∞); điểm uốn (2, −11). 2) f′ = 12x<sup>2</sup>(x − 1) ⇒ điểm tới hạn 0, 1. f″ = 12x(3x − 2): f″(1) = 12 &gt; 0 ⇒ cực tiểu f(1) = −1. f″(0) = 0 ⇒ chưa kết luận; f′ ≤ 0 ở cả hai phía của 0 nên x = 0 không là cực trị. 3) f(x) = x<sup>4</sup>.</p></div>`);

const c43 = L('mac103-ts-4-3',
  '4.3 — Optimization in business and design: profit, average cost, elasticity, EOQ|||4.3 — Tối ưu trong kinh doanh và thiết kế: lợi nhuận, chi phí trung bình, độ co giãn, EOQ',
  'Quy trình giải bài toán tối ưu; lợi nhuận cực đại khi MR = MC; chi phí trung bình nhỏ nhất khi MC = AC; độ co giãn của cầu và doanh thu; lượng đặt hàng tối ưu (EOQ); hộp có thể tích lớn nhất.',
  `<span class="eyebrow">MAC103 · Chapter 4 · Lesson 4.3</span>
<h2>Optimization in business and design</h2>
<p class="lead">This is where calculus pays its way: choosing the price, the production level or the order size that makes profit largest or cost smallest. Every problem follows the same recipe — model, differentiate, solve f′ = 0, check.</p>
<h3>🎯 Objectives</h3>
<ul><li>Turn a word problem into a function of one variable on a feasible interval.</li><li>Maximise profit using MR = MC, and minimise average cost using MC = AC.</li><li>Compute price elasticity of demand and use it to predict how revenue reacts to a price change.</li><li>Solve an inventory (EOQ) problem and a geometric design problem.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Recipe.</strong> (1) Name the variable and its units; (2) write the quantity to optimise as a function of one variable; (3) state the feasible interval; (4) find critical points; (5) confirm max/min (closed-interval method, sign of f′, or f″); (6) answer the question in words with units.</p>
<div class="formula"><span class="lbl">Profit</span>P(q) = R(q) − C(q),    P′(q) = 0 ⇔ MR = MC,    max if P″(q) &lt; 0</div>
<div class="formula"><span class="lbl">Average cost</span>AC(q) = C(q)/q is smallest where AC′(q) = 0 ⇔ MC = AC</div>
<div class="formula"><span class="lbl">Price elasticity of demand</span>E(p) = −(p/q)·(dq/dp).    E &lt; 1 inelastic (raise price ⇒ revenue ↑);  E &gt; 1 elastic (raise price ⇒ revenue ↓);  E = 1 ⇒ revenue maximal</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — maximum profit.</b> Demand p = 120 − 0.5q (dollars), cost C(q) = 2000 + 20q. R(q) = 120q − 0.5q<sup>2</sup>, MR = 120 − q, MC = 20. MR = MC ⇒ <b>q = 100</b>, price p = <b>$70</b>. P″ = −1 &lt; 0 confirms a max. Profit P(100) = 7000 − 4000 = <b>$3000</b>.</p></div>
<div class="callout"><p><b>Example 2 — minimum average cost.</b> C(q) = 0.02q<sup>2</sup> + 8q + 3200. AC(q) = 0.02q + 8 + 3200/q, AC′ = 0.02 − 3200/q<sup>2</sup> = 0 ⇒ q<sup>2</sup> = 160 000 ⇒ <b>q = 400</b>, AC(400) = <b>$24 per unit</b>. Check: MC(400) = 0.04·400 + 8 = 24 = AC. ✔</p></div>
<div class="callout"><p><b>Example 3 — elasticity.</b> Demand for a software licence: q = 600 − 4p. E(p) = −(p/q)(−4) = 4p/(600 − 4p). At p = 50: E = 200/400 = <b>0.5</b> (inelastic) ⇒ a small price increase raises revenue. E = 1 when p = 75, and indeed R(p) = p(600 − 4p) has R′ = 600 − 8p = 0 at <b>p = 75</b>, R = <b>$22 500</b>.</p></div>
<div class="callout"><p><b>Example 4 — economic order quantity (EOQ).</b> A shop sells D = 4500 units a year; each order costs K = $50, holding a unit for a year costs h = $5. With order size Q, yearly cost TC(Q) = K·D/Q + h·Q/2. TC′ = −225 000/Q<sup>2</sup> + 2.5 = 0 ⇒ <b>Q = 300 units</b> (formula Q* = √(2KD/h)), TC = 750 + 750 = <b>$1500</b>.</p></div>
<div class="callout"><p><b>Example 5 — design.</b> An open box is made from a 24 cm × 15 cm sheet by cutting squares of side x from the corners. V(x) = x(24 − 2x)(15 − 2x) on [0, 7.5]. V′ = 12x<sup>2</sup> − 156x + 360 = 12(x − 3)(x − 10); only x = 3 is feasible. V(0) = V(7.5) = 0, V(3) = 3·18·9 = <b>486 cm<sup>3</sup></b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Maximising revenue instead of profit — they give different answers.</li><li>Forgetting the feasible interval (x = 10 in Example 5 is impossible).</li><li>Answering with q but forgetting the price or profit the question asked for.</li><li>Dropping the minus sign in E(p): with it, elasticity of a normal good is positive.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Model → one variable → feasible interval → f′ = 0 → check → answer in words.</li><li>Max profit: MR = MC (with P″ &lt; 0).</li><li>Min average cost: MC = AC.</li><li>Elasticity E &lt; 1: raise price; E &gt; 1: lower price; E = 1: revenue is maximal.</li><li>EOQ: Q* = √(2KD/h).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-7-applied-optimization-problems" target="_blank" rel="noopener">OpenStax — 4.7 Applied Optimization Problems</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/BusinessApps.aspx" target="_blank" rel="noopener">Paul's Online Notes — Business Applications</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/Optimization.aspx" target="_blank" rel="noopener">Paul's Online Notes — Optimization</a></li><li><a href="https://www.cengage.com/c/calculus-an-applied-approach-10e-larson/9781305860919/" target="_blank" rel="noopener">Larson — Calculus: An Applied Approach (10e), publisher page</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Demand p = 90 − 0.02q, cost C(q) = 10 000 + 30q. Find the profit-maximising quantity, price and profit.</li><li>C(q) = 0.5q<sup>2</sup> + 10q + 800. Find the output with the lowest average cost and that cost.</li><li>Demand q = 200 − 2p. Find E at p = 60. Should the firm raise or lower the price to increase revenue? Which price maximises revenue?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) MR = 90 − 0.04q = 30 ⇒ q = 1500, p = $60, profit = 90 000 − 55 000 = $35 000. 2) AC = 0.5q + 10 + 800/q, AC′ = 0 ⇒ q = 40, AC = $50. 3) E = 2p/(200 − 2p) = 120/80 = 1.5 &gt; 1 (elastic) ⇒ lower the price; revenue p(200 − 2p) is maximal at p = 50.</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 4 · Bài 4.3</span>
<h2>Tối ưu trong kinh doanh và thiết kế</h2>
<p class="lead">Đây là nơi giải tích “trả lương”: chọn giá bán, mức sản xuất hay cỡ đơn hàng để lợi nhuận lớn nhất hoặc chi phí nhỏ nhất. Mọi bài đều theo cùng công thức — lập mô hình, lấy đạo hàm, giải f′ = 0, kiểm tra.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Chuyển bài toán lời văn thành hàm một biến trên một miền khả thi.</li><li>Tối đa lợi nhuận bằng MR = MC, tối thiểu chi phí trung bình bằng MC = AC.</li><li>Tính độ co giãn của cầu theo giá và dự đoán doanh thu phản ứng thế nào khi đổi giá.</li><li>Giải bài toán tồn kho (EOQ) và một bài thiết kế hình học.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Công thức làm.</strong> (1) Đặt biến và đơn vị; (2) viết đại lượng cần tối ưu thành hàm một biến; (3) nêu miền khả thi; (4) tìm điểm tới hạn; (5) khẳng định max/min (đoạn kín, dấu f′ hoặc f″); (6) trả lời bằng lời, có đơn vị.</p>
<div class="formula"><span class="lbl">Lợi nhuận</span>P(q) = R(q) − C(q),    P′(q) = 0 ⇔ MR = MC,    là max nếu P″(q) &lt; 0</div>
<div class="formula"><span class="lbl">Chi phí trung bình</span>AC(q) = C(q)/q nhỏ nhất khi AC′(q) = 0 ⇔ MC = AC</div>
<div class="formula"><span class="lbl">Độ co giãn của cầu theo giá</span>E(p) = −(p/q)·(dq/dp).    E &lt; 1 ít co giãn (tăng giá ⇒ doanh thu ↑);  E &gt; 1 co giãn (tăng giá ⇒ doanh thu ↓);  E = 1 ⇒ doanh thu lớn nhất</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — lợi nhuận lớn nhất.</b> Cầu p = 120 − 0,5q (đô la), chi phí C(q) = 2000 + 20q. R(q) = 120q − 0,5q<sup>2</sup>, MR = 120 − q, MC = 20. MR = MC ⇒ <b>q = 100</b>, giá p = <b>70 đô la</b>. P″ = −1 &lt; 0 xác nhận cực đại. Lợi nhuận P(100) = 7000 − 4000 = <b>3000 đô la</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — chi phí trung bình nhỏ nhất.</b> C(q) = 0,02q<sup>2</sup> + 8q + 3200. AC(q) = 0,02q + 8 + 3200/q, AC′ = 0,02 − 3200/q<sup>2</sup> = 0 ⇒ q<sup>2</sup> = 160 000 ⇒ <b>q = 400</b>, AC(400) = <b>24 đô la/sản phẩm</b>. Kiểm: MC(400) = 0,04·400 + 8 = 24 = AC. ✔</p></div>
<div class="callout"><p><b>Ví dụ 3 — độ co giãn.</b> Cầu giấy phép phần mềm: q = 600 − 4p. E(p) = −(p/q)(−4) = 4p/(600 − 4p). Tại p = 50: E = 200/400 = <b>0,5</b> (ít co giãn) ⇒ tăng giá nhẹ làm doanh thu tăng. E = 1 khi p = 75, và đúng vậy R(p) = p(600 − 4p) có R′ = 600 − 8p = 0 tại <b>p = 75</b>, R = <b>22 500 đô la</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4 — lượng đặt hàng kinh tế (EOQ).</b> Cửa hàng bán D = 4500 sản phẩm/năm; mỗi lần đặt hàng tốn K = 50 đô la, giữ một sản phẩm trong kho một năm tốn h = 5 đô la. Với cỡ đơn Q, chi phí năm TC(Q) = K·D/Q + h·Q/2. TC′ = −225 000/Q<sup>2</sup> + 2,5 = 0 ⇒ <b>Q = 300 sản phẩm</b> (công thức Q* = √(2KD/h)), TC = 750 + 750 = <b>1500 đô la</b>.</p></div>
<div class="callout"><p><b>Ví dụ 5 — thiết kế.</b> Làm hộp không nắp từ tấm bìa 24 cm × 15 cm bằng cách cắt bốn hình vuông cạnh x ở góc. V(x) = x(24 − 2x)(15 − 2x) trên [0; 7,5]. V′ = 12x<sup>2</sup> − 156x + 360 = 12(x − 3)(x − 10); chỉ x = 3 khả thi. V(0) = V(7,5) = 0, V(3) = 3·18·9 = <b>486 cm<sup>3</sup></b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tối đa doanh thu thay vì lợi nhuận — hai đáp án khác nhau.</li><li>Quên miền khả thi (x = 10 ở Ví dụ 5 là không thể).</li><li>Trả lời q mà quên giá hay lợi nhuận đề hỏi.</li><li>Bỏ dấu trừ trong E(p): có dấu trừ thì độ co giãn của hàng hoá thông thường là số dương.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Mô hình → một biến → miền khả thi → f′ = 0 → kiểm → trả lời bằng lời.</li><li>Lợi nhuận max: MR = MC (với P″ &lt; 0).</li><li>Chi phí trung bình min: MC = AC.</li><li>Co giãn E &lt; 1: tăng giá; E &gt; 1: giảm giá; E = 1: doanh thu lớn nhất.</li><li>EOQ: Q* = √(2KD/h).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-7-applied-optimization-problems" target="_blank" rel="noopener">OpenStax — 4.7 Bài toán tối ưu ứng dụng</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/BusinessApps.aspx" target="_blank" rel="noopener">Paul's Online Notes — Ứng dụng trong kinh doanh</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/Optimization.aspx" target="_blank" rel="noopener">Paul's Online Notes — Tối ưu</a></li><li><a href="https://www.cengage.com/c/calculus-an-applied-approach-10e-larson/9781305860919/" target="_blank" rel="noopener">Larson — Calculus: An Applied Approach (10e), trang nhà xuất bản</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Cầu p = 90 − 0,02q, chi phí C(q) = 10 000 + 30q. Tìm sản lượng, giá và lợi nhuận tối ưu.</li><li>C(q) = 0,5q<sup>2</sup> + 10q + 800. Tìm sản lượng có chi phí trung bình thấp nhất và chi phí đó.</li><li>Cầu q = 200 − 2p. Tính E tại p = 60. Nên tăng hay giảm giá để tăng doanh thu? Giá nào cho doanh thu lớn nhất?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) MR = 90 − 0,04q = 30 ⇒ q = 1500, p = 60 đô la, lợi nhuận = 90 000 − 55 000 = 35 000 đô la. 2) AC = 0,5q + 10 + 800/q, AC′ = 0 ⇒ q = 40, AC = 50 đô la. 3) E = 2p/(200 − 2p) = 120/80 = 1,5 &gt; 1 (co giãn) ⇒ nên giảm giá; doanh thu p(200 − 2p) lớn nhất tại p = 50.</p></div>`);

const c44 = L('mac103-ts-4-4',
  "4.4 — L'Hôpital's rule and Newton's method (with an IRR calculator in Python)|||4.4 — Quy tắc L'Hôpital và phương pháp Newton (tính IRR bằng Python)",
  "Khử dạng vô định 0/0, ∞/∞, 0·∞, 1^∞ bằng quy tắc L'Hôpital; so sánh tốc độ tăng (ln n, n, eⁿ); lãi kép liên tục; phương pháp Newton giải phương trình và tính suất sinh lời nội bộ (IRR) bằng Python.",
  `<span class="eyebrow">MAC103 · Chapter 4 · Lesson 4.4</span>
<h2>L'Hôpital's rule and Newton's method</h2>
<p class="lead">Two more power tools built from the derivative. L'Hôpital's rule settles limits that algebra cannot — including where the number e comes from in continuous compounding. Newton's method lets a computer solve equations that have no formula, such as the internal rate of return of an investment.</p>
<h3>🎯 Objectives</h3>
<ul><li>Recognise indeterminate forms and apply L'Hôpital's rule correctly.</li><li>Rewrite 0·∞ and 1<sup>∞</sup> forms into 0/0 or ∞/∞.</li><li>Compare growth rates of ln n, powers of n and eⁿ (useful in algorithm analysis).</li><li>Apply Newton's method by hand and in Python.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">L'Hôpital's rule</span>If lim f(x)/g(x) has the form 0/0 or ∞/∞, then lim f(x)/g(x) = lim f′(x)/g′(x)  (if the right side exists)</div>
<p>Differentiate numerator and denominator <strong>separately</strong> — this is not the quotient rule. Forms 0·∞ are rewritten as a fraction; forms 1<sup>∞</sup> are handled by taking ln first.</p>
<div class="formula"><span class="lbl">Growth hierarchy (n → ∞)</span>ln n  ≪  n<sup>a</sup> (a &gt; 0)  ≪  eⁿ      e.g. lim (ln n)/n = 0,  lim n<sup>3</sup>/eⁿ = 0</div>
<p>This is why an O(n log n) sorting algorithm beats an O(n<sup>2</sup>) one for large inputs: (n ln n)/n<sup>2</sup> = (ln n)/n → 0.</p>
<div class="formula"><span class="lbl">Newton's method for f(x) = 0</span>x<sub>n+1</sub> = x<sub>n</sub> − f(x<sub>n</sub>)/f′(x<sub>n</sub>)</div>
<p>Each step replaces the curve by its tangent line and jumps to where the tangent hits zero. Near a simple root the number of correct digits roughly doubles per step. It can fail if f′(x<sub>n</sub>) ≈ 0 or the starting guess is far away.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 (0/0).</b> lim<sub>x→0</sub> (e<sup>2x</sup> − 1)/x = lim 2e<sup>2x</sup>/1 = <b>2</b>. And lim<sub>x→0</sub> (eˣ − 1 − x)/x<sup>2</sup> = lim (eˣ − 1)/(2x) = lim eˣ/2 = <b>1/2</b> (rule applied twice).</p></div>
<div class="callout"><p><b>Example 2 (∞/∞ and 0·∞).</b> lim<sub>x→∞</sub> x<sup>2</sup>/eˣ = lim 2x/eˣ = lim 2/eˣ = <b>0</b>. lim<sub>x→0⁺</sub> √x ln x = lim (ln x)/(x<sup>−1/2</sup>) = lim (1/x)/(−(1/2)x<sup>−3/2</sup>) = lim (−2√x) = <b>0</b>.</p></div>
<div class="callout"><p><b>Example 3 (1<sup>∞</sup>) — continuous compounding.</b> $1 at 6% a year compounded n times: (1 + 0.06/n)<sup>n</sup>. ln of it is n ln(1 + 0.06/n) = ln(1 + 0.06/n)/(1/n) → 0.06 by L'Hôpital, so the limit is <b>e<sup>0.06</sup> ≈ 1.06184</b>. Compounding continuously turns 6% into an effective 6.184%.</p></div>
<div class="callout"><p><b>Example 4 — Newton by hand.</b> Solve x<sup>2</sup> − 10 = 0 from x<sub>0</sub> = 3: x<sub>1</sub> = 3 − (9 − 10)/6 = <b>3.1667</b> (√10 = 3.1623…). One more step gives 3.16228.</p></div>
<div class="callout"><p><b>Example 5 — the IRR of a project.</b> You invest $1000 and receive $400 at the end of each of the next 3 years. The internal rate of return r solves NPV(r) = −1000 + 400/(1 + r) + 400/(1 + r)<sup>2</sup> + 400/(1 + r)<sup>3</sup> = 0 — a cubic with no friendly formula. Newton's method:</p>
<pre><code class="language-python"># Newton's method for the IRR: -1000 + 400/(1+r) + 400/(1+r)^2 + 400/(1+r)^3 = 0
def npv(r):
    return -1000 + sum(400 / (1 + r) ** k for k in (1, 2, 3))

def dnpv(r):
    return sum(-k * 400 / (1 + r) ** (k + 1) for k in (1, 2, 3))

r = 0.05                      # initial guess: 5%
for i in range(1, 6):
    r = r - npv(r) / dnpv(r)  # Newton step
    print(f"step {i}: r = {r:.8f}   NPV = {npv(r):.2e}")
print(f"IRR = {r * 100:.3f}%")</code></pre>
<div class="out">step 1: r = 0.09375000   NPV = 5.79e+00
step 2: r = 0.09699438   NPV = 2.81e-02
step 3: r = 0.09701026   NPV = 6.66e-07
step 4: r = 0.09701026   NPV = 0.00e+00
step 5: r = 0.09701026   NPV = 0.00e+00
IRR = 9.701%</div>
<p>Three steps already give the IRR ≈ <b>9.70%</b>: if the bank pays less than 9.7%, the project is the better use of the money.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using the quotient rule instead of f′/g′.</li><li>Applying L'Hôpital when the limit is not indeterminate: lim<sub>x→0</sub> (x + 3)/(x + 4) = 3/4, not 1.</li><li>Forgetting to exponentiate back after taking ln in a 1<sup>∞</sup> problem.</li><li>Starting Newton's method where f′ ≈ 0 — the next guess shoots off.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>0/0 or ∞/∞: lim f/g = lim f′/g′; other forms must be rewritten first.</li><li>ln n grows slower than any power of n; eⁿ faster than any power.</li><li>lim (1 + r/n)<sup>n</sup> = e<sup>r</sup>: continuous compounding.</li><li>Newton: x<sub>n+1</sub> = x<sub>n</sub> − f(x<sub>n</sub>)/f′(x<sub>n</sub>); very fast near a root.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-8-lhopitals-rule" target="_blank" rel="noopener">OpenStax — 4.8 L'Hôpital's Rule</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-9-newtons-method" target="_blank" rel="noopener">OpenStax — 4.9 Newton's Method</a></li><li><a href="https://www.3blue1brown.com/lessons/l-hopitals-rule" target="_blank" rel="noopener">3Blue1Brown — Limits, L'Hôpital's rule, and epsilon delta definitions</a></li><li><a href="https://cuongthai.com/academy/courses/cal111-calculus-i" target="_blank" rel="noopener">CAL111 — Calculus I on CuongThai Academy (go deeper)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>lim<sub>x→0</sub> (e<sup>3x</sup> − 1)/sin(2x).</li><li>lim<sub>x→∞</sub> (ln x)/x<sup>1/3</sup>.</li><li>Do one Newton step for x<sup>3</sup> + x − 3 = 0 starting at x<sub>0</sub> = 1.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 0/0 ⇒ lim 3e<sup>3x</sup>/(2cos 2x) = 3/2. 2) ∞/∞ ⇒ lim (1/x)/((1/3)x<sup>−2/3</sup>) = lim 3/x<sup>1/3</sup> = 0. 3) f(1) = −1, f′(x) = 3x<sup>2</sup> + 1, f′(1) = 4 ⇒ x<sub>1</sub> = 1 + 1/4 = 1.25.</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 4 · Bài 4.4</span>
<h2>Quy tắc L'Hôpital và phương pháp Newton</h2>
<p class="lead">Thêm hai công cụ mạnh dựng từ đạo hàm. Quy tắc L'Hôpital giải quyết những giới hạn mà đại số bó tay — kể cả việc số e xuất hiện trong lãi kép liên tục. Phương pháp Newton giúp máy tính giải những phương trình không có công thức nghiệm, như suất sinh lời nội bộ của một khoản đầu tư.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận ra dạng vô định và áp dụng đúng quy tắc L'Hôpital.</li><li>Đưa dạng 0·∞ và 1<sup>∞</sup> về 0/0 hoặc ∞/∞.</li><li>So sánh tốc độ tăng của ln n, luỹ thừa của n và eⁿ (dùng trong phân tích thuật toán).</li><li>Áp dụng phương pháp Newton bằng tay và bằng Python.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Quy tắc L'Hôpital</span>Nếu lim f(x)/g(x) có dạng 0/0 hoặc ∞/∞ thì lim f(x)/g(x) = lim f′(x)/g′(x)  (nếu vế phải tồn tại)</div>
<p>Lấy đạo hàm tử và mẫu <strong>riêng rẽ</strong> — đây không phải quy tắc thương. Dạng 0·∞ phải viết lại thành phân thức; dạng 1<sup>∞</sup> thì lấy ln trước.</p>
<div class="formula"><span class="lbl">Thứ bậc tốc độ tăng (n → ∞)</span>ln n  ≪  n<sup>a</sup> (a &gt; 0)  ≪  eⁿ      ví dụ lim (ln n)/n = 0,  lim n<sup>3</sup>/eⁿ = 0</div>
<p>Đó là lý do thuật toán sắp xếp O(n log n) thắng thuật toán O(n<sup>2</sup>) khi dữ liệu lớn: (n ln n)/n<sup>2</sup> = (ln n)/n → 0.</p>
<div class="formula"><span class="lbl">Phương pháp Newton cho f(x) = 0</span>x<sub>n+1</sub> = x<sub>n</sub> − f(x<sub>n</sub>)/f′(x<sub>n</sub>)</div>
<p>Mỗi bước thay đường cong bằng tiếp tuyến và nhảy tới chỗ tiếp tuyến cắt trục hoành. Gần một nghiệm đơn, số chữ số đúng gần như gấp đôi sau mỗi bước. Phương pháp có thể hỏng nếu f′(x<sub>n</sub>) ≈ 0 hoặc điểm xuất phát ở quá xa.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 (0/0).</b> lim<sub>x→0</sub> (e<sup>2x</sup> − 1)/x = lim 2e<sup>2x</sup>/1 = <b>2</b>. Và lim<sub>x→0</sub> (eˣ − 1 − x)/x<sup>2</sup> = lim (eˣ − 1)/(2x) = lim eˣ/2 = <b>1/2</b> (dùng quy tắc hai lần).</p></div>
<div class="callout"><p><b>Ví dụ 2 (∞/∞ và 0·∞).</b> lim<sub>x→∞</sub> x<sup>2</sup>/eˣ = lim 2x/eˣ = lim 2/eˣ = <b>0</b>. lim<sub>x→0⁺</sub> √x ln x = lim (ln x)/(x<sup>−1/2</sup>) = lim (1/x)/(−(1/2)x<sup>−3/2</sup>) = lim (−2√x) = <b>0</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 (1<sup>∞</sup>) — lãi kép liên tục.</b> 1 đô la, lãi 6%/năm, ghép lãi n lần: (1 + 0,06/n)<sup>n</sup>. Lấy ln: n ln(1 + 0,06/n) = ln(1 + 0,06/n)/(1/n) → 0,06 theo L'Hôpital, nên giới hạn là <b>e<sup>0,06</sup> ≈ 1,06184</b>. Ghép lãi liên tục biến 6% thành lãi suất thực 6,184%.</p></div>
<div class="callout"><p><b>Ví dụ 4 — Newton bằng tay.</b> Giải x<sup>2</sup> − 10 = 0 từ x<sub>0</sub> = 3: x<sub>1</sub> = 3 − (9 − 10)/6 = <b>3,1667</b> (√10 = 3,1623…). Thêm một bước được 3,16228.</p></div>
<div class="callout"><p><b>Ví dụ 5 — IRR của một dự án.</b> Bạn đầu tư 1000 đô la và nhận 400 đô la vào cuối mỗi năm trong 3 năm. Suất sinh lời nội bộ r là nghiệm của NPV(r) = −1000 + 400/(1 + r) + 400/(1 + r)<sup>2</sup> + 400/(1 + r)<sup>3</sup> = 0 — một phương trình bậc ba không có công thức dễ dùng. Phương pháp Newton:</p>
<pre><code class="language-python"># Newton's method for the IRR: -1000 + 400/(1+r) + 400/(1+r)^2 + 400/(1+r)^3 = 0
def npv(r):
    return -1000 + sum(400 / (1 + r) ** k for k in (1, 2, 3))

def dnpv(r):
    return sum(-k * 400 / (1 + r) ** (k + 1) for k in (1, 2, 3))

r = 0.05                      # initial guess: 5%
for i in range(1, 6):
    r = r - npv(r) / dnpv(r)  # Newton step
    print(f"step {i}: r = {r:.8f}   NPV = {npv(r):.2e}")
print(f"IRR = {r * 100:.3f}%")</code></pre>
<div class="out">step 1: r = 0.09375000   NPV = 5.79e+00
step 2: r = 0.09699438   NPV = 2.81e-02
step 3: r = 0.09701026   NPV = 6.66e-07
step 4: r = 0.09701026   NPV = 0.00e+00
step 5: r = 0.09701026   NPV = 0.00e+00
IRR = 9.701%</div>
<p>Ba bước đã cho IRR ≈ <b>9,70%</b>: nếu ngân hàng trả lãi thấp hơn 9,7% thì dự án là cách dùng tiền tốt hơn.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng quy tắc thương thay cho f′/g′.</li><li>Áp L'Hôpital khi giới hạn không vô định: lim<sub>x→0</sub> (x + 3)/(x + 4) = 3/4, không phải 1.</li><li>Quên lấy mũ trở lại sau khi lấy ln ở bài dạng 1<sup>∞</sup>.</li><li>Bắt đầu Newton ở chỗ f′ ≈ 0 — điểm kế tiếp văng ra xa.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>0/0 hoặc ∞/∞: lim f/g = lim f′/g′; dạng khác phải viết lại trước.</li><li>ln n tăng chậm hơn mọi luỹ thừa của n; eⁿ nhanh hơn mọi luỹ thừa.</li><li>lim (1 + r/n)<sup>n</sup> = e<sup>r</sup>: lãi kép liên tục.</li><li>Newton: x<sub>n+1</sub> = x<sub>n</sub> − f(x<sub>n</sub>)/f′(x<sub>n</sub>); hội tụ rất nhanh gần nghiệm.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-8-lhopitals-rule" target="_blank" rel="noopener">OpenStax — 4.8 Quy tắc L'Hôpital</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-9-newtons-method" target="_blank" rel="noopener">OpenStax — 4.9 Phương pháp Newton</a></li><li><a href="https://www.3blue1brown.com/lessons/l-hopitals-rule" target="_blank" rel="noopener">3Blue1Brown — Giới hạn, quy tắc L'Hôpital và định nghĩa epsilon–delta</a></li><li><a href="https://cuongthai.com/academy/courses/cal111-calculus-i" target="_blank" rel="noopener">CAL111 — Giải tích I trên CuongThai Academy (học sâu hơn)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>lim<sub>x→0</sub> (e<sup>3x</sup> − 1)/sin(2x).</li><li>lim<sub>x→∞</sub> (ln x)/x<sup>1/3</sup>.</li><li>Làm một bước Newton cho x<sup>3</sup> + x − 3 = 0 bắt đầu từ x<sub>0</sub> = 1.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 0/0 ⇒ lim 3e<sup>3x</sup>/(2cos 2x) = 3/2. 2) ∞/∞ ⇒ lim (1/x)/((1/3)x<sup>−2/3</sup>) = lim 3/x<sup>1/3</sup> = 0. 3) f(1) = −1, f′(x) = 3x<sup>2</sup> + 1, f′(1) = 4 ⇒ x<sub>1</sub> = 1 + 1/4 = 1,25.</p></div>`);

const q4 = QZ(4, 'Quiz — Chapter 4: Applications of derivatives|||Quiz — Chương 4: Ứng dụng của đạo hàm', "Kiểm tra chương 4: điểm tới hạn, cực trị trên đoạn, lồi lõm, tối ưu lợi nhuận, chi phí trung bình, độ co giãn, quy tắc L'Hôpital, phương pháp Newton.", [
  Q('q1', 'The critical points of f(x) = x³ − 27x are|||Các điểm tới hạn của f(x) = x³ − 27x là',
    ['x = 0 and x = 3|||x = 0 và x = 3', 'x = −3 and x = 3|||x = −3 và x = 3', 'x = 3 only|||chỉ x = 3', 'x = −9 and x = 9|||x = −9 và x = 9'], 1,
    'f′(x) = 3x² − 27 = 3(x − 3)(x + 3) = 0.|||f′(x) = 3x² − 27 = 3(x − 3)(x + 3) = 0.'),
  Q('q2', 'If f′(c) = 0 and f″(c) > 0, then at x = c the function has|||Nếu f′(c) = 0 và f″(c) > 0 thì tại x = c hàm có',
    ['a local minimum|||cực tiểu địa phương', 'a local maximum|||cực đại địa phương', 'an inflection point|||điểm uốn', 'no conclusion possible|||không kết luận được'], 0,
    'Concave up with a horizontal tangent: the bottom of a ∪.|||Lõm lên và tiếp tuyến nằm ngang: đáy của chữ ∪.'),
  Q('q3', 'The absolute maximum of f(x) = x² − 4x + 1 on [0, 5] is|||Giá trị lớn nhất của f(x) = x² − 4x + 1 trên [0, 5] là',
    ['1|||1', '−3|||−3', '5|||5', '6|||6'], 3,
    'Compare f(0) = 1, f(2) = −3 (critical point), f(5) = 6.|||So f(0) = 1, f(2) = −3 (điểm tới hạn), f(5) = 6.'),
  Q('q4', 'The inflection point of f(x) = x³ − 3x² + 2 is at|||Điểm uốn của f(x) = x³ − 3x² + 2 nằm tại',
    ['x = 0|||x = 0', 'x = 2|||x = 2', 'x = 1|||x = 1', 'x = 3|||x = 3'], 2,
    'f″(x) = 6x − 6 changes sign at x = 1.|||f″(x) = 6x − 6 đổi dấu tại x = 1.'),
  Q('q5', 'R(q) = 50q − 0.25q², C(q) = 200 + 10q. Profit is maximal at|||R(q) = 50q − 0,25q², C(q) = 200 + 10q. Lợi nhuận lớn nhất tại',
    ['q = 100|||q = 100', 'q = 80|||q = 80', 'q = 40|||q = 40', 'q = 200|||q = 200'], 1,
    'MR = 50 − 0.5q = MC = 10 ⇒ q = 80 (profit $1400).|||MR = 50 − 0,5q = MC = 10 ⇒ q = 80 (lợi nhuận 1400 đô la).'),
  Q('q6', 'At the output where average cost is smallest,|||Tại sản lượng có chi phí trung bình nhỏ nhất,',
    ['marginal cost equals average cost|||chi phí biên bằng chi phí trung bình', 'marginal cost is zero|||chi phí biên bằng 0', 'total cost is smallest|||tổng chi phí nhỏ nhất', 'revenue equals cost|||doanh thu bằng chi phí'], 0,
    'AC′ = (q·C′ − C)/q² = 0 ⇔ C′ = C/q, i.e. MC = AC.|||AC′ = (q·C′ − C)/q² = 0 ⇔ C′ = C/q, tức MC = AC.'),
  Q('q7', 'Demand q = 300 − 3p. At p = 20 the elasticity and the right pricing move are|||Cầu q = 300 − 3p. Tại p = 20, độ co giãn và hướng điều chỉnh giá đúng là',
    ['E = 4, lower the price|||E = 4, giảm giá', 'E = 1, keep the price|||E = 1, giữ giá', 'E = 0.25, raise the price|||E = 0,25, tăng giá', 'E = 0.25, lower the price|||E = 0,25, giảm giá'], 2,
    'E = 3p/(300 − 3p) = 60/240 = 0.25 < 1: inelastic, so revenue rises with price.|||E = 3p/(300 − 3p) = 60/240 = 0,25 < 1: ít co giãn nên tăng giá làm doanh thu tăng.'),
  Q('q8', 'lim(x→0) (e^(5x) − 1)/(2x) =|||lim(x→0) (e^(5x) − 1)/(2x) =',
    ['0|||0', '5|||5', '1/2|||1/2', '5/2|||5/2'], 3,
    "0/0 ⇒ L'Hôpital: 5e^(5x)/2 → 5/2.|||0/0 ⇒ L'Hôpital: 5e^(5x)/2 → 5/2."),
  Q('q9', 'lim(x→∞) x³/eˣ =|||lim(x→∞) x³/eˣ =',
    ['∞|||∞', '0|||0', '1|||1', '6|||6'], 1,
    "Apply L'Hôpital three times: 6/eˣ → 0. Exponentials beat powers.|||Áp L'Hôpital ba lần: 6/eˣ → 0. Hàm mũ thắng luỹ thừa."),
  Q('q10', "One Newton step for x² − 20 = 0 from x₀ = 4 gives|||Một bước Newton cho x² − 20 = 0 từ x₀ = 4 cho",
    ['4.5|||4,5', '4.25|||4,25', '5|||5', '4.47|||4,47'], 0,
    'x₁ = 4 − (16 − 20)/(2·4) = 4 + 0.5 = 4.5.|||x₁ = 4 − (16 − 20)/(2·4) = 4 + 0,5 = 4,5.'),
]);

const ch4 = {
  title: 'Chapter 4 — Applications of derivatives|||Chương 4 — Ứng dụng của đạo hàm',
  description: "Đơn điệu, điểm tới hạn, cực trị trên đoạn kín, MVT; lồi lõm, điểm uốn, phép thử cấp hai, khảo sát đồ thị; tối ưu kinh doanh (MR = MC, MC = AC, độ co giãn, EOQ) và thiết kế; quy tắc L'Hôpital, phương pháp Newton tính IRR bằng Python (Stewart ch.4 · OpenStax Vol.1 4.3–4.9).",
  lessons: [c41, c42, c43, c44, q4],
};


// ───────────────────────────── Chương 5 — Tích phân ─────────────────────────────
const c51 = L('mac103-ts-5-1',
  '5.1 — Antiderivatives and indefinite integrals: undoing the derivative|||5.1 — Nguyên hàm và tích phân bất định: làm ngược phép đạo hàm',
  'Nguyên hàm, hằng số C, bảng nguyên hàm cơ bản, quy tắc tổng/hằng số; bài toán giá trị ban đầu: tổng chi phí từ chi phí biên, doanh thu từ doanh thu biên, vị trí từ vận tốc.',
  `<span class="eyebrow">MAC103 · Chapter 5 · Lesson 5.1</span>
<h2>Antiderivatives: going backwards from a rate</h2>
<p class="lead">So far you started from a quantity and computed its rate of change. In real work the opposite is just as common: an accountant knows the <strong>marginal cost</strong> of each extra unit and wants the <strong>total cost</strong>; a tracking app logs <strong>velocity</strong> and wants the <strong>position</strong>. Going from a rate back to the quantity is called <strong>antidifferentiation</strong>.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain what an antiderivative is and why every answer carries “+ C”.</li><li>Use the table of basic antiderivatives together with the sum and constant-multiple rules.</li><li>Solve initial-value problems: find the unique function that has a given derivative and passes through a given point.</li><li>Model total cost, total revenue and position from their rates.</li></ul>
<h3>📖 Lecture</h3>
<p>F is an <strong>antiderivative</strong> of f on an interval if F′(x) = f(x) for every x there. If F is one antiderivative, then so is F + 5, F − 100, F + any constant, because the derivative of a constant is 0. Conversely (by the Mean Value Theorem) <em>all</em> antiderivatives differ only by a constant. So we write the whole family as an <strong>indefinite integral</strong>:</p>
<div class="formula"><span class="lbl">Indefinite integral</span>∫ f(x) dx = F(x) + C    ⇔    F′(x) = f(x)</div>
<p>Read each rule of differentiation backwards and you get the table:</p>
<div class="formula"><span class="lbl">Basic table</span>∫ x<sup>n</sup> dx = x<sup>n+1</sup>/(n + 1) + C  (n ≠ −1)    ∫ 1/x dx = ln|x| + C    ∫ e<sup>x</sup> dx = e<sup>x</sup> + C    ∫ cos x dx = sin x + C    ∫ sin x dx = −cos x + C</div>
<div class="formula"><span class="lbl">Linearity</span>∫ [a·f(x) + b·g(x)] dx = a∫ f(x) dx + b∫ g(x) dx</div>
<p>An <strong>initial-value problem</strong> gives the rate f and one known value, e.g. F(0) = fixed cost. Integrate to get F(x) + C, then plug the known point in to find C. The answer is then a single function, not a family.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — power rule backwards.</b> ∫ (6x<sup>2</sup> − 4x + 3) dx = 6·x<sup>3</sup>/3 − 4·x<sup>2</sup>/2 + 3x + C = <b>2x<sup>3</sup> − 2x<sup>2</sup> + 3x + C</b>. Check: the derivative is 6x<sup>2</sup> − 4x + 3 ✓.</p></div>
<div class="callout"><p><b>Example 2 — mixed table.</b> ∫ (5e<sup>x</sup> − 4/x + 2√x) dx. Write √x = x<sup>1/2</sup>, so ∫ 2x<sup>1/2</sup> dx = 2·x<sup>3/2</sup>/(3/2) = (4/3)x<sup>3/2</sup>. Answer: <b>5e<sup>x</sup> − 4 ln|x| + (4/3)x<sup>3/2</sup> + C</b>.</p></div>
<div class="callout"><p><b>Example 3 — total cost from marginal cost.</b> A workshop's marginal cost is C′(q) = 0.06q<sup>2</sup> − 1.2q + 20 (thousand VND per unit) and the fixed cost is 500 thousand VND. Integrate: C(q) = 0.02q<sup>3</sup> − 0.6q<sup>2</sup> + 20q + K. The fixed cost is the cost of producing nothing, so C(0) = K = 500. Hence <b>C(q) = 0.02q<sup>3</sup> − 0.6q<sup>2</sup> + 20q + 500</b> and producing 30 units costs C(30) = 540 − 540 + 600 + 500 = <b>1 100</b> thousand VND.</p></div>
<div class="callout"><p><b>Example 4 — position from velocity.</b> A warehouse robot moves along a rail with velocity v(t) = 6 − 2t (m/s) and starts at s(0) = 10 m. Then s(t) = 6t − t<sup>2</sup> + C with C = 10, so <b>s(t) = 10 + 6t − t<sup>2</sup></b> and s(4) = 10 + 24 − 16 = <b>18 m</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting “+ C” in an indefinite integral — or forgetting to <em>determine</em> C when an initial value is given.</li><li>Applying the power rule to 1/x: x<sup>0</sup>/0 is meaningless; ∫ 1/x dx = ln|x| + C.</li><li>Integrating a product factor by factor: ∫ f·g dx ≠ (∫ f dx)(∫ g dx). Expand first, or use the techniques of Chapter 6.</li><li>Writing ∫ x<sup>−2</sup> dx = x<sup>−1</sup>/1: the exponent becomes −1, so divide by −1: the answer is −1/x + C.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>F is an antiderivative of f when F′ = f; all antiderivatives differ by a constant.</li><li>∫ f(x) dx = F(x) + C is the whole family.</li><li>Every derivative rule read backwards gives an integral rule; integration is linear.</li><li>An initial condition fixes C: fixed cost C(0), initial position s(0), zero revenue at q = 0.</li><li>Always check by differentiating your answer.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-10-antiderivatives" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 4.10 Antiderivatives</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/IndefiniteIntegrals.aspx" target="_blank" rel="noopener">Paul's Online Notes — Indefinite Integrals</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ComputingIndefiniteIntegrals.aspx" target="_blank" rel="noopener">Paul's Online Notes — Computing Indefinite Integrals</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find ∫ (x<sup>3</sup> − 2/x<sup>2</sup> + 7) dx.</li><li>Find f if f′(x) = 4x − 3 and f(2) = 5.</li><li>Marginal revenue is R′(q) = 120 − 0.4q (thousand VND per unit) and R(0) = 0. Find R(q), the revenue from 100 units, and the price function p = R/q.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) x<sup>4</sup>/4 + 2/x + 7x + C (since ∫ −2x<sup>−2</sup> dx = 2x<sup>−1</sup>). 2) f(x) = 2x<sup>2</sup> − 3x + C; 8 − 6 + C = 5 ⇒ C = 3, so f(x) = 2x<sup>2</sup> − 3x + 3. 3) R(q) = 120q − 0.2q<sup>2</sup>; R(100) = 12 000 − 2 000 = 10 000 thousand VND; p = 120 − 0.2q.</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 5 · Bài 5.1</span>
<h2>Nguyên hàm: đi ngược từ tốc độ về đại lượng</h2>
<p class="lead">Đến giờ ta luôn đi từ một đại lượng để tính tốc độ thay đổi của nó. Ngoài đời chiều ngược lại cũng phổ biến không kém: kế toán biết <strong>chi phí biên</strong> của mỗi sản phẩm thêm và muốn ra <strong>tổng chi phí</strong>; ứng dụng theo dõi ghi lại <strong>vận tốc</strong> và muốn biết <strong>vị trí</strong>. Đi từ tốc độ trở về đại lượng gọi là <strong>tìm nguyên hàm</strong>.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích nguyên hàm là gì và vì sao mọi đáp án đều kèm “+ C”.</li><li>Dùng bảng nguyên hàm cơ bản cùng quy tắc tổng và nhân hằng số.</li><li>Giải bài toán giá trị ban đầu: tìm hàm duy nhất có đạo hàm cho trước và đi qua một điểm cho trước.</li><li>Lập mô hình tổng chi phí, tổng doanh thu và vị trí từ tốc độ của chúng.</li></ul>
<h3>📖 Bài giảng</h3>
<p>F là một <strong>nguyên hàm</strong> của f trên một khoảng nếu F′(x) = f(x) với mọi x trong đó. Nếu F là một nguyên hàm thì F + 5, F − 100, F + hằng số bất kỳ cũng vậy, vì đạo hàm của hằng số bằng 0. Ngược lại (theo định lý giá trị trung bình) <em>mọi</em> nguyên hàm chỉ khác nhau một hằng số. Vì thế ta viết cả họ dưới dạng <strong>tích phân bất định</strong>:</p>
<div class="formula"><span class="lbl">Tích phân bất định</span>∫ f(x) dx = F(x) + C    ⇔    F′(x) = f(x)</div>
<p>Đọc ngược từng quy tắc đạo hàm ta được bảng:</p>
<div class="formula"><span class="lbl">Bảng cơ bản</span>∫ x<sup>n</sup> dx = x<sup>n+1</sup>/(n + 1) + C  (n ≠ −1)    ∫ 1/x dx = ln|x| + C    ∫ e<sup>x</sup> dx = e<sup>x</sup> + C    ∫ cos x dx = sin x + C    ∫ sin x dx = −cos x + C</div>
<div class="formula"><span class="lbl">Tính tuyến tính</span>∫ [a·f(x) + b·g(x)] dx = a∫ f(x) dx + b∫ g(x) dx</div>
<p><strong>Bài toán giá trị ban đầu</strong> cho tốc độ f và một giá trị đã biết, ví dụ F(0) = chi phí cố định. Lấy nguyên hàm được F(x) + C, rồi thay điểm đã biết vào để tìm C. Khi đó đáp án là một hàm duy nhất, không còn là cả họ.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — quy tắc luỹ thừa đi ngược.</b> ∫ (6x<sup>2</sup> − 4x + 3) dx = 6·x<sup>3</sup>/3 − 4·x<sup>2</sup>/2 + 3x + C = <b>2x<sup>3</sup> − 2x<sup>2</sup> + 3x + C</b>. Kiểm: đạo hàm bằng 6x<sup>2</sup> − 4x + 3 ✓.</p></div>
<div class="callout"><p><b>Ví dụ 2 — dùng cả bảng.</b> ∫ (5e<sup>x</sup> − 4/x + 2√x) dx. Viết √x = x<sup>1/2</sup>, nên ∫ 2x<sup>1/2</sup> dx = 2·x<sup>3/2</sup>/(3/2) = (4/3)x<sup>3/2</sup>. Đáp án: <b>5e<sup>x</sup> − 4 ln|x| + (4/3)x<sup>3/2</sup> + C</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — tổng chi phí từ chi phí biên.</b> Chi phí biên của một xưởng là C′(q) = 0,06q<sup>2</sup> − 1,2q + 20 (nghìn đồng/sản phẩm), chi phí cố định 500 nghìn đồng. Lấy nguyên hàm: C(q) = 0,02q<sup>3</sup> − 0,6q<sup>2</sup> + 20q + K. Chi phí cố định là chi phí khi không sản xuất gì, nên C(0) = K = 500. Vậy <b>C(q) = 0,02q<sup>3</sup> − 0,6q<sup>2</sup> + 20q + 500</b> và sản xuất 30 sản phẩm tốn C(30) = 540 − 540 + 600 + 500 = <b>1 100</b> nghìn đồng.</p></div>
<div class="callout"><p><b>Ví dụ 4 — vị trí từ vận tốc.</b> Robot kho chạy trên ray với vận tốc v(t) = 6 − 2t (m/s), xuất phát tại s(0) = 10 m. Khi đó s(t) = 6t − t<sup>2</sup> + C với C = 10, tức <b>s(t) = 10 + 6t − t<sup>2</sup></b> và s(4) = 10 + 24 − 16 = <b>18 m</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên “+ C” ở tích phân bất định — hoặc quên <em>tìm</em> C khi đề cho giá trị ban đầu.</li><li>Áp quy tắc luỹ thừa cho 1/x: x<sup>0</sup>/0 vô nghĩa; ∫ 1/x dx = ln|x| + C.</li><li>Lấy nguyên hàm một tích bằng cách lấy từng thừa số: ∫ f·g dx ≠ (∫ f dx)(∫ g dx). Hãy khai triển trước, hoặc dùng kỹ thuật ở Chương 6.</li><li>Viết ∫ x<sup>−2</sup> dx = x<sup>−1</sup>/1: số mũ mới là −1 nên phải chia cho −1, đáp án là −1/x + C.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>F là nguyên hàm của f khi F′ = f; mọi nguyên hàm khác nhau một hằng số.</li><li>∫ f(x) dx = F(x) + C là cả họ nguyên hàm.</li><li>Đọc ngược mỗi quy tắc đạo hàm được một quy tắc tích phân; tích phân có tính tuyến tính.</li><li>Điều kiện ban đầu xác định C: chi phí cố định C(0), vị trí đầu s(0), doanh thu bằng 0 khi q = 0.</li><li>Luôn kiểm lại bằng cách đạo hàm đáp án.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-10-antiderivatives" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 4.10 Nguyên hàm</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/IndefiniteIntegrals.aspx" target="_blank" rel="noopener">Paul's Online Notes — Tích phân bất định</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ComputingIndefiniteIntegrals.aspx" target="_blank" rel="noopener">Paul's Online Notes — Tính tích phân bất định</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm ∫ (x<sup>3</sup> − 2/x<sup>2</sup> + 7) dx.</li><li>Tìm f biết f′(x) = 4x − 3 và f(2) = 5.</li><li>Doanh thu biên R′(q) = 120 − 0,4q (nghìn đồng/sản phẩm) và R(0) = 0. Tìm R(q), doanh thu khi bán 100 sản phẩm, và hàm giá p = R/q.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) x<sup>4</sup>/4 + 2/x + 7x + C (vì ∫ −2x<sup>−2</sup> dx = 2x<sup>−1</sup>). 2) f(x) = 2x<sup>2</sup> − 3x + C; 8 − 6 + C = 5 ⇒ C = 3, vậy f(x) = 2x<sup>2</sup> − 3x + 3. 3) R(q) = 120q − 0,2q<sup>2</sup>; R(100) = 12 000 − 2 000 = 10 000 nghìn đồng; p = 120 − 0,2q.</p></div>`);

const c52 = L('mac103-ts-5-2',
  '5.2 — Riemann sums and the definite integral|||5.2 — Tổng Riemann và tích phân xác định',
  'Xấp xỉ diện tích bằng hình chữ nhật (trái/phải/trung điểm), tích phân xác định là giới hạn tổng Riemann, diện tích có dấu, tính chất tích phân; code Python tính tổng Riemann chạy thật.',
  `<span class="eyebrow">MAC103 · Chapter 5 · Lesson 5.2</span>
<h2>Riemann sums and the definite integral</h2>
<p class="lead">How many requests did a server handle in a day if you only know the request <em>rate</em> every two hours? Multiply rate × time on each short interval and add up. That idea — chop, multiply, add — is a <strong>Riemann sum</strong>, and its limit is the <strong>definite integral</strong>.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute left, right and midpoint Riemann sums by hand and in Python.</li><li>Define the definite integral as the limit of Riemann sums and read it as signed area / accumulated total.</li><li>Use the properties of definite integrals to combine known values.</li></ul>
<h3>📖 Lecture</h3>
<p>Split [a, b] into n equal pieces of width Δx = (b − a)/n with points x<sub>i</sub> = a + iΔx. On each piece pick a sample point x<sub>i</sub>* (left end, right end or midpoint) and build a rectangle of height f(x<sub>i</sub>*).</p>
<div class="formula"><span class="lbl">Riemann sum</span>S<sub>n</sub> = Σ<sub>i=1..n</sub> f(x<sub>i</sub>*) Δx</div>
<div class="formula"><span class="lbl">Definite integral</span>∫<sub>a</sub><sup>b</sup> f(x) dx = lim<sub>n→∞</sub> Σ<sub>i=1..n</sub> f(x<sub>i</sub>*) Δx</div>
<p>For a continuous f the limit exists and does not depend on the choice of sample points. Where f ≥ 0 the integral is the area under the curve; where f &lt; 0 the rectangles count <strong>negatively</strong>, so the integral is a <strong>signed area</strong>. If f is a rate (requests/hour, VND/month), the integral is the <strong>total accumulated</strong> amount.</p>
<div class="formula"><span class="lbl">Properties</span>∫<sub>a</sub><sup>a</sup> f = 0   ∫<sub>b</sub><sup>a</sup> f = −∫<sub>a</sub><sup>b</sup> f   ∫<sub>a</sub><sup>b</sup> (αf + βg) = α∫f + β∫g   ∫<sub>a</sub><sup>c</sup> f = ∫<sub>a</sub><sup>b</sup> f + ∫<sub>b</sub><sup>c</sup> f   ∫<sub>a</sub><sup>b</sup> k dx = k(b − a)</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — three sums.</b> f(x) = x<sup>2</sup> + 1 on [1, 3], n = 4 ⇒ Δx = 0.5.</p><ul><li>Left points 1, 1.5, 2, 2.5: values 2, 3.25, 5, 7.25 ⇒ L<sub>4</sub> = 17.5 × 0.5 = <b>8.75</b>.</li><li>Right points 1.5, 2, 2.5, 3: values 3.25, 5, 7.25, 10 ⇒ R<sub>4</sub> = 25.5 × 0.5 = <b>12.75</b>.</li><li>Midpoints 1.25, 1.75, 2.25, 2.75: values 2.5625, 4.0625, 6.0625, 8.5625 ⇒ M<sub>4</sub> = 21.25 × 0.5 = <b>10.625</b>.</li></ul><p>The exact value (next lesson) is 32/3 ≈ 10.667. Since f is increasing, the left sum underestimates and the right sum overestimates; the midpoint sum is already very close.</p></div>
<div class="callout"><p><b>Example 2 — data instead of a formula.</b> A server's request rate (thousand requests/hour) at t = 0, 2, 4, 6, 8 h is 5, 9, 14, 12, 6. With Δt = 2: left sum 2(5 + 9 + 14 + 12) = <b>80</b>, right sum 2(9 + 14 + 12 + 6) = <b>82</b> thousand requests over 8 hours.</p></div>
<div class="callout"><p><b>Example 3 — let the computer take n → ∞.</b></p>
<pre><code class="language-python">def f(x):
    return x**2 + 1

def riemann(f, a, b, n, rule="left"):
    dx = (b - a) / n
    shift = {"left": 0.0, "right": 1.0, "mid": 0.5}[rule]
    return sum(f(a + (i + shift) * dx) for i in range(n)) * dx

for n in [4, 100, 1000]:
    L = riemann(f, 1, 3, n, "left")
    R = riemann(f, 1, 3, n, "right")
    M = riemann(f, 1, 3, n, "mid")
    print(f"n={n:5d}  left={L:.6f}  right={R:.6f}  mid={M:.6f}")
print("exact =", 32 / 3)</code></pre>
<div class="out">n=    4  left=8.750000  right=12.750000  mid=10.625000
n=  100  left=10.586800  right=10.746800  mid=10.666600
n= 1000  left=10.658668  right=10.674668  mid=10.666666
exact = 10.666666666666666</div>
<p>All three sums squeeze towards 32/3 — that limit <em>is</em> the integral.</p></div>
<div class="callout"><p><b>Example 4 — properties and signed area.</b> If ∫<sub>0</sub><sup>5</sup> f = 12 and ∫<sub>0</sub><sup>2</sup> f = 4, then ∫<sub>2</sub><sup>5</sup> f = 12 − 4 = <b>8</b> and ∫<sub>0</sub><sup>5</sup> (3f(x) − 2) dx = 36 − 2·5 = <b>26</b>. Also ∫<sub>0</sub><sup>3</sup> (x − 2) dx: a triangle of area 2 below the axis on [0, 2] and of area 0.5 above on [2, 3], so the integral is −2 + 0.5 = <b>−1.5</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using n + 1 rectangles: n subintervals have n + 1 endpoints, but a left sum uses only the first n, a right sum only the last n.</li><li>Treating a negative integral as an error — it means more area below the axis than above.</li><li>Forgetting the k(b − a) term when integrating a constant (the “− 2” in Example 4 contributes −10, not −2).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Riemann sum = Σ f(x<sub>i</sub>*)Δx: chop, multiply, add.</li><li>Increasing f: left sum ≤ integral ≤ right sum; the midpoint rule is usually much better.</li><li>The definite integral is the limit of Riemann sums: signed area, or total accumulated from a rate.</li><li>Integrals are linear and additive over adjacent intervals.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/5-1-approximating-areas" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 5.1 Approximating Areas</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/5-2-the-definite-integral" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 5.2 The Definite Integral</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/AreaProblem.aspx" target="_blank" rel="noopener">Paul's Online Notes — Area Problem</a></li><li><a href="https://www.3blue1brown.com/lessons/integration" target="_blank" rel="noopener">3Blue1Brown — Integration and the fundamental theorem</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Compute the right Riemann sum with n = 3 for f(x) = 2x on [0, 3] and compare with the exact area of the triangle.</li><li>Compute the midpoint sum with n = 2 for f(x) = 1/x on [1, 3]. (Its exact value is ln 3 ≈ 1.0986.)</li><li>Given ∫<sub>1</sub><sup>4</sup> g = 7, find ∫<sub>4</sub><sup>1</sup> g and ∫<sub>1</sub><sup>4</sup> (g(x) + 1) dx.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Δx = 1: 2 + 4 + 6 = 12; exact area ½·3·6 = 9 (the right sum overestimates an increasing f). 2) Midpoints 1.5 and 2.5, Δx = 1: 1/1.5 + 1/2.5 ≈ 0.6667 + 0.4 = 1.0667. 3) −7 and 7 + 3 = 10.</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 5 · Bài 5.2</span>
<h2>Tổng Riemann và tích phân xác định</h2>
<p class="lead">Một máy chủ xử lý bao nhiêu yêu cầu trong ngày nếu bạn chỉ biết <em>tốc độ</em> yêu cầu mỗi hai giờ? Nhân tốc độ × thời gian trên từng khoảng ngắn rồi cộng lại. Ý tưởng đó — chia nhỏ, nhân, cộng — là <strong>tổng Riemann</strong>, và giới hạn của nó là <strong>tích phân xác định</strong>.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính tổng Riemann trái, phải, trung điểm bằng tay và bằng Python.</li><li>Định nghĩa tích phân xác định là giới hạn của tổng Riemann và hiểu nó là diện tích có dấu / tổng tích luỹ.</li><li>Dùng tính chất của tích phân xác định để kết hợp các giá trị đã biết.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Chia [a, b] thành n đoạn bằng nhau, độ rộng Δx = (b − a)/n, các điểm chia x<sub>i</sub> = a + iΔx. Trên mỗi đoạn chọn điểm mẫu x<sub>i</sub>* (đầu trái, đầu phải hoặc trung điểm) và dựng hình chữ nhật cao f(x<sub>i</sub>*).</p>
<div class="formula"><span class="lbl">Tổng Riemann</span>S<sub>n</sub> = Σ<sub>i=1..n</sub> f(x<sub>i</sub>*) Δx</div>
<div class="formula"><span class="lbl">Tích phân xác định</span>∫<sub>a</sub><sup>b</sup> f(x) dx = lim<sub>n→∞</sub> Σ<sub>i=1..n</sub> f(x<sub>i</sub>*) Δx</div>
<p>Với f liên tục, giới hạn tồn tại và không phụ thuộc cách chọn điểm mẫu. Nơi f ≥ 0, tích phân là diện tích dưới đường cong; nơi f &lt; 0, các hình chữ nhật được tính <strong>âm</strong>, nên tích phân là <strong>diện tích có dấu</strong>. Nếu f là một tốc độ (yêu cầu/giờ, đồng/tháng) thì tích phân là <strong>tổng lượng tích luỹ</strong>.</p>
<div class="formula"><span class="lbl">Tính chất</span>∫<sub>a</sub><sup>a</sup> f = 0   ∫<sub>b</sub><sup>a</sup> f = −∫<sub>a</sub><sup>b</sup> f   ∫<sub>a</sub><sup>b</sup> (αf + βg) = α∫f + β∫g   ∫<sub>a</sub><sup>c</sup> f = ∫<sub>a</sub><sup>b</sup> f + ∫<sub>b</sub><sup>c</sup> f   ∫<sub>a</sub><sup>b</sup> k dx = k(b − a)</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — ba loại tổng.</b> f(x) = x<sup>2</sup> + 1 trên [1, 3], n = 4 ⇒ Δx = 0,5.</p><ul><li>Điểm trái 1; 1,5; 2; 2,5: giá trị 2; 3,25; 5; 7,25 ⇒ L<sub>4</sub> = 17,5 × 0,5 = <b>8,75</b>.</li><li>Điểm phải 1,5; 2; 2,5; 3: giá trị 3,25; 5; 7,25; 10 ⇒ R<sub>4</sub> = 25,5 × 0,5 = <b>12,75</b>.</li><li>Trung điểm 1,25; 1,75; 2,25; 2,75: giá trị 2,5625; 4,0625; 6,0625; 8,5625 ⇒ M<sub>4</sub> = 21,25 × 0,5 = <b>10,625</b>.</li></ul><p>Giá trị đúng (bài sau) là 32/3 ≈ 10,667. Vì f tăng nên tổng trái ước lượng thiếu, tổng phải ước lượng thừa; tổng trung điểm đã rất sát.</p></div>
<div class="callout"><p><b>Ví dụ 2 — dữ liệu thay cho công thức.</b> Tốc độ yêu cầu tới máy chủ (nghìn yêu cầu/giờ) tại t = 0, 2, 4, 6, 8 giờ là 5, 9, 14, 12, 6. Với Δt = 2: tổng trái 2(5 + 9 + 14 + 12) = <b>80</b>, tổng phải 2(9 + 14 + 12 + 6) = <b>82</b> nghìn yêu cầu trong 8 giờ.</p></div>
<div class="callout"><p><b>Ví dụ 3 — để máy tính cho n → ∞.</b></p>
<pre><code class="language-python">def f(x):
    return x**2 + 1

def riemann(f, a, b, n, rule="left"):
    dx = (b - a) / n
    shift = {"left": 0.0, "right": 1.0, "mid": 0.5}[rule]
    return sum(f(a + (i + shift) * dx) for i in range(n)) * dx

for n in [4, 100, 1000]:
    L = riemann(f, 1, 3, n, "left")
    R = riemann(f, 1, 3, n, "right")
    M = riemann(f, 1, 3, n, "mid")
    print(f"n={n:5d}  left={L:.6f}  right={R:.6f}  mid={M:.6f}")
print("exact =", 32 / 3)</code></pre>
<div class="out">n=    4  left=8.750000  right=12.750000  mid=10.625000
n=  100  left=10.586800  right=10.746800  mid=10.666600
n= 1000  left=10.658668  right=10.674668  mid=10.666666
exact = 10.666666666666666</div>
<p>Cả ba tổng đều bị “kẹp” dần về 32/3 — chính giới hạn đó <em>là</em> tích phân.</p></div>
<div class="callout"><p><b>Ví dụ 4 — tính chất và diện tích có dấu.</b> Nếu ∫<sub>0</sub><sup>5</sup> f = 12 và ∫<sub>0</sub><sup>2</sup> f = 4 thì ∫<sub>2</sub><sup>5</sup> f = 12 − 4 = <b>8</b> và ∫<sub>0</sub><sup>5</sup> (3f(x) − 2) dx = 36 − 2·5 = <b>26</b>. Còn ∫<sub>0</sub><sup>3</sup> (x − 2) dx: tam giác diện tích 2 nằm dưới trục trên [0, 2] và tam giác diện tích 0,5 nằm trên trục trên [2, 3], nên tích phân bằng −2 + 0,5 = <b>−1,5</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng n + 1 hình chữ nhật: n đoạn con có n + 1 điểm chia, nhưng tổng trái chỉ dùng n điểm đầu, tổng phải chỉ dùng n điểm cuối.</li><li>Tưởng tích phân âm là sai — nó chỉ có nghĩa phần diện tích dưới trục lớn hơn phần trên trục.</li><li>Quên số hạng k(b − a) khi tích phân hằng số (“− 2” ở Ví dụ 4 đóng góp −10 chứ không phải −2).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tổng Riemann = Σ f(x<sub>i</sub>*)Δx: chia nhỏ, nhân, cộng.</li><li>f tăng: tổng trái ≤ tích phân ≤ tổng phải; quy tắc trung điểm thường tốt hơn hẳn.</li><li>Tích phân xác định là giới hạn của tổng Riemann: diện tích có dấu, hoặc tổng tích luỹ từ một tốc độ.</li><li>Tích phân tuyến tính và cộng được trên các đoạn kề nhau.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/5-1-approximating-areas" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 5.1 Xấp xỉ diện tích</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/5-2-the-definite-integral" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 5.2 Tích phân xác định</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/AreaProblem.aspx" target="_blank" rel="noopener">Paul's Online Notes — Bài toán diện tích</a></li><li><a href="https://www.3blue1brown.com/lessons/integration" target="_blank" rel="noopener">3Blue1Brown — Tích phân và định lý cơ bản</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tính tổng Riemann phải với n = 3 cho f(x) = 2x trên [0, 3] và so với diện tích đúng của tam giác.</li><li>Tính tổng trung điểm với n = 2 cho f(x) = 1/x trên [1, 3]. (Giá trị đúng là ln 3 ≈ 1,0986.)</li><li>Cho ∫<sub>1</sub><sup>4</sup> g = 7, tìm ∫<sub>4</sub><sup>1</sup> g và ∫<sub>1</sub><sup>4</sup> (g(x) + 1) dx.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Δx = 1: 2 + 4 + 6 = 12; diện tích đúng ½·3·6 = 9 (tổng phải ước lượng thừa với f tăng). 2) Trung điểm 1,5 và 2,5, Δx = 1: 1/1,5 + 1/2,5 ≈ 0,6667 + 0,4 = 1,0667. 3) −7 và 7 + 3 = 10.</p></div>`);

const c53 = L('mac103-ts-5-3',
  '5.3 — The Fundamental Theorem of Calculus and net change|||5.3 — Định lý cơ bản của giải tích và lượng thay đổi ròng',
  'Định lý cơ bản phần 1 (đạo hàm của hàm tích phân cận trên, kèm quy tắc dây chuyền) và phần 2 (tính tích phân bằng nguyên hàm); định lý lượng thay đổi ròng: doanh thu tích luỹ, độ dời và quãng đường.',
  `<span class="eyebrow">MAC103 · Chapter 5 · Lesson 5.3</span>
<h2>The Fundamental Theorem of Calculus</h2>
<p class="lead">Computing a limit of Riemann sums for every integral would be painful. The <strong>Fundamental Theorem of Calculus (FTC)</strong> is the shortcut: to integrate f from a to b, find any antiderivative F and compute F(b) − F(a). It is the bridge between Lesson 5.1 (antiderivatives) and Lesson 5.2 (areas).</p>
<h3>🎯 Objectives</h3>
<ul><li>State both parts of the FTC and use Part 1 to differentiate an integral with a variable upper limit.</li><li>Evaluate definite integrals with Part 2.</li><li>Apply the Net Change Theorem to revenue, users and motion; distinguish displacement from distance.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">FTC Part 1</span>If f is continuous and G(x) = ∫<sub>a</sub><sup>x</sup> f(t) dt, then G′(x) = f(x).    With a function as the limit: d/dx ∫<sub>a</sub><sup>u(x)</sup> f(t) dt = f(u(x))·u′(x).</div>
<p>Part 1 says “the rate at which accumulated area grows is the height of the curve right there”. In particular every continuous function <em>has</em> an antiderivative.</p>
<div class="formula"><span class="lbl">FTC Part 2</span>If F′ = f on [a, b], then ∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) − F(a) = [F(x)]<sub>a</sub><sup>b</sup></div>
<div class="formula"><span class="lbl">Net Change Theorem</span>∫<sub>a</sub><sup>b</sup> F′(t) dt = F(b) − F(a)    (integral of a rate = total change)</div>
<p>No “+ C” is needed in Part 2: it cancels in F(b) − F(a).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — Part 1.</b> d/dx ∫<sub>2</sub><sup>x</sup> √(1 + t<sup>3</sup>) dt = <b>√(1 + x<sup>3</sup>)</b>. With the chain rule: d/dx ∫<sub>1</sub><sup>3x</sup> ln t dt = ln(3x)·3 = <b>3 ln(3x)</b>; at x = 2 it equals 3 ln 6.</p></div>
<div class="callout"><p><b>Example 2 — Part 2.</b> ∫<sub>1</sub><sup>4</sup> (3√x − 1/x<sup>2</sup>) dx. Antiderivative: 3·(2/3)x<sup>3/2</sup> + 1/x = 2x<sup>3/2</sup> + 1/x. So [2x<sup>3/2</sup> + 1/x]<sub>1</sub><sup>4</sup> = (16 + 0.25) − (2 + 1) = <b>13.25 = 53/4</b>.</p><p>Also ∫<sub>0</sub><sup>π/2</sup> (sin x + 2) dx = [−cos x + 2x]<sub>0</sub><sup>π/2</sup> = (0 + π) − (−1) = <b>1 + π</b>.</p></div>
<div class="callout"><p><b>Example 3 — revenue from a growth rate.</b> A subscription app earns revenue at the rate R′(t) = 200 + 30t million VND per month. Revenue over the first 6 months: ∫<sub>0</sub><sup>6</sup> (200 + 30t) dt = [200t + 15t<sup>2</sup>]<sub>0</sub><sup>6</sup> = 1200 + 540 = <b>1 740 million VND</b>.</p></div>
<div class="callout"><p><b>Example 4 — displacement vs distance.</b> A delivery drone flies along a line with v(t) = 2t − 4 (m/s), 0 ≤ t ≤ 5. Displacement = ∫<sub>0</sub><sup>5</sup> (2t − 4) dt = [t<sup>2</sup> − 4t]<sub>0</sub><sup>5</sup> = <b>5 m</b>. But v &lt; 0 on [0, 2): it first flies backwards. Distance = ∫<sub>0</sub><sup>5</sup> |2t − 4| dt = 4 + 9 = <b>13 m</b> (4 m back, then 9 m forward).</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Computing F(a) − F(b) instead of F(b) − F(a).</li><li>In Part 1 with a limit u(x), forgetting to multiply by u′(x).</li><li>Using “integral of velocity” for distance travelled when the velocity changes sign — split at the zeros and add absolute values.</li><li>Applying Part 2 across a point where f is undefined (e.g. 1/x<sup>2</sup> on [−1, 1]): the theorem needs f continuous on [a, b].</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Part 1: d/dx ∫<sub>a</sub><sup>x</sup> f(t) dt = f(x); add the factor u′(x) for a variable limit u(x).</li><li>Part 2: ∫<sub>a</sub><sup>b</sup> f = F(b) − F(a) for any antiderivative F.</li><li>Integral of a rate = net change of the quantity (revenue, users, position).</li><li>Distance = ∫ |v|; displacement = ∫ v.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/5-3-the-fundamental-theorem-of-calculus" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 5.3 The Fundamental Theorem of Calculus</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/5-4-integration-formulas-and-the-net-change-theorem" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 5.4 Integration Formulas and the Net Change Theorem</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ComputingDefiniteIntegrals.aspx" target="_blank" rel="noopener">Paul's Online Notes — Computing Definite Integrals</a></li><li><a href="https://cuongthai.com/academy/courses/cal111-calculus-i" target="_blank" rel="noopener">CAL111 — Calculus I on CuongThai Academy (go deeper: Chapter 7)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Evaluate ∫<sub>0</sub><sup>2</sup> (3x<sup>2</sup> − 2x + 1) dx.</li><li>Find d/dx ∫<sub>x</sub><sup>5</sup> e<sup>t²</sup> dt.</li><li>New users join an app at the rate N′(t) = 50e<sup>0.1t</sup> users/day. How many join in the first 10 days?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) [x<sup>3</sup> − x<sup>2</sup> + x]<sub>0</sub><sup>2</sup> = 8 − 4 + 2 = 6. 2) Swap the limits: −∫<sub>5</sub><sup>x</sup> e<sup>t²</sup> dt, so the derivative is −e<sup>x²</sup>. 3) ∫<sub>0</sub><sup>10</sup> 50e<sup>0.1t</sup> dt = [500e<sup>0.1t</sup>]<sub>0</sub><sup>10</sup> = 500(e − 1) ≈ 859 users.</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 5 · Bài 5.3</span>
<h2>Định lý cơ bản của giải tích</h2>
<p class="lead">Nếu tích phân nào cũng phải tính giới hạn tổng Riemann thì rất cực. <strong>Định lý cơ bản của giải tích (FTC)</strong> là lối tắt: muốn tích phân f từ a đến b, tìm một nguyên hàm F bất kỳ rồi tính F(b) − F(a). Nó là cây cầu nối Bài 5.1 (nguyên hàm) với Bài 5.2 (diện tích).</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu hai phần của định lý cơ bản và dùng Phần 1 để lấy đạo hàm tích phân có cận trên biến thiên.</li><li>Tính tích phân xác định bằng Phần 2.</li><li>Áp dụng định lý lượng thay đổi ròng cho doanh thu, người dùng và chuyển động; phân biệt độ dời với quãng đường.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Định lý cơ bản — Phần 1</span>Nếu f liên tục và G(x) = ∫<sub>a</sub><sup>x</sup> f(t) dt thì G′(x) = f(x).    Khi cận là một hàm: d/dx ∫<sub>a</sub><sup>u(x)</sup> f(t) dt = f(u(x))·u′(x).</div>
<p>Phần 1 nói: “tốc độ tăng của diện tích tích luỹ bằng chiều cao của đường cong ngay tại đó”. Đặc biệt, mọi hàm liên tục đều <em>có</em> nguyên hàm.</p>
<div class="formula"><span class="lbl">Định lý cơ bản — Phần 2</span>Nếu F′ = f trên [a, b] thì ∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) − F(a) = [F(x)]<sub>a</sub><sup>b</sup></div>
<div class="formula"><span class="lbl">Định lý lượng thay đổi ròng</span>∫<sub>a</sub><sup>b</sup> F′(t) dt = F(b) − F(a)    (tích phân của tốc độ = tổng thay đổi)</div>
<p>Ở Phần 2 không cần “+ C”: nó tự triệt tiêu trong F(b) − F(a).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — Phần 1.</b> d/dx ∫<sub>2</sub><sup>x</sup> √(1 + t<sup>3</sup>) dt = <b>√(1 + x<sup>3</sup>)</b>. Kèm quy tắc dây chuyền: d/dx ∫<sub>1</sub><sup>3x</sup> ln t dt = ln(3x)·3 = <b>3 ln(3x)</b>; tại x = 2 bằng 3 ln 6.</p></div>
<div class="callout"><p><b>Ví dụ 2 — Phần 2.</b> ∫<sub>1</sub><sup>4</sup> (3√x − 1/x<sup>2</sup>) dx. Nguyên hàm: 3·(2/3)x<sup>3/2</sup> + 1/x = 2x<sup>3/2</sup> + 1/x. Vậy [2x<sup>3/2</sup> + 1/x]<sub>1</sub><sup>4</sup> = (16 + 0,25) − (2 + 1) = <b>13,25 = 53/4</b>.</p><p>Tương tự ∫<sub>0</sub><sup>π/2</sup> (sin x + 2) dx = [−cos x + 2x]<sub>0</sub><sup>π/2</sup> = (0 + π) − (−1) = <b>1 + π</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — doanh thu từ tốc độ tăng.</b> Một ứng dụng thuê bao có doanh thu chảy về với tốc độ R′(t) = 200 + 30t triệu đồng/tháng. Doanh thu 6 tháng đầu: ∫<sub>0</sub><sup>6</sup> (200 + 30t) dt = [200t + 15t<sup>2</sup>]<sub>0</sub><sup>6</sup> = 1200 + 540 = <b>1 740 triệu đồng</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4 — độ dời và quãng đường.</b> Drone giao hàng bay trên một đường thẳng với v(t) = 2t − 4 (m/s), 0 ≤ t ≤ 5. Độ dời = ∫<sub>0</sub><sup>5</sup> (2t − 4) dt = [t<sup>2</sup> − 4t]<sub>0</sub><sup>5</sup> = <b>5 m</b>. Nhưng v &lt; 0 trên [0, 2): lúc đầu nó bay lùi. Quãng đường = ∫<sub>0</sub><sup>5</sup> |2t − 4| dt = 4 + 9 = <b>13 m</b> (lùi 4 m, rồi tiến 9 m).</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tính F(a) − F(b) thay vì F(b) − F(a).</li><li>Ở Phần 1 với cận u(x), quên nhân thêm u′(x).</li><li>Lấy “tích phân vận tốc” làm quãng đường khi vận tốc đổi dấu — phải tách tại nghiệm và cộng các giá trị tuyệt đối.</li><li>Dùng Phần 2 qua điểm f không xác định (vd 1/x<sup>2</sup> trên [−1, 1]): định lý cần f liên tục trên [a, b].</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Phần 1: d/dx ∫<sub>a</sub><sup>x</sup> f(t) dt = f(x); thêm thừa số u′(x) khi cận là u(x).</li><li>Phần 2: ∫<sub>a</sub><sup>b</sup> f = F(b) − F(a) với F là nguyên hàm bất kỳ.</li><li>Tích phân của tốc độ = lượng thay đổi ròng (doanh thu, người dùng, vị trí).</li><li>Quãng đường = ∫ |v|; độ dời = ∫ v.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/5-3-the-fundamental-theorem-of-calculus" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 5.3 Định lý cơ bản của giải tích</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/5-4-integration-formulas-and-the-net-change-theorem" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 5.4 Công thức tích phân và định lý lượng thay đổi ròng</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ComputingDefiniteIntegrals.aspx" target="_blank" rel="noopener">Paul's Online Notes — Tính tích phân xác định</a></li><li><a href="https://cuongthai.com/academy/courses/cal111-calculus-i" target="_blank" rel="noopener">CAL111 — Giải tích I trên CuongThai Academy (học sâu: Chương 7)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tính ∫<sub>0</sub><sup>2</sup> (3x<sup>2</sup> − 2x + 1) dx.</li><li>Tìm d/dx ∫<sub>x</sub><sup>5</sup> e<sup>t²</sup> dt.</li><li>Người dùng mới gia nhập ứng dụng với tốc độ N′(t) = 50e<sup>0,1t</sup> người/ngày. Trong 10 ngày đầu có bao nhiêu người gia nhập?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) [x<sup>3</sup> − x<sup>2</sup> + x]<sub>0</sub><sup>2</sup> = 8 − 4 + 2 = 6. 2) Đổi cận: −∫<sub>5</sub><sup>x</sup> e<sup>t²</sup> dt, nên đạo hàm là −e<sup>x²</sup>. 3) ∫<sub>0</sub><sup>10</sup> 50e<sup>0,1t</sup> dt = [500e<sup>0,1t</sup>]<sub>0</sub><sup>10</sup> = 500(e − 1) ≈ 859 người.</p></div>`);

const q5 = QZ(5, 'Quiz — Chapter 5: Integrals|||Quiz — Chương 5: Tích phân', 'Kiểm tra chương 5: nguyên hàm, bài toán giá trị ban đầu, tổng Riemann, tính chất tích phân, định lý cơ bản, lượng thay đổi ròng.', [
  Q('q1', '∫ (4x³ + 6x) dx =|||∫ (4x³ + 6x) dx =',
    ['12x² + 6 + C|||12x² + 6 + C', 'x⁴ + 3x² + C|||x⁴ + 3x² + C', 'x⁴ + 6x² + C|||x⁴ + 6x² + C', '4x⁴ + 6x² + C|||4x⁴ + 6x² + C'], 1,
    'Power rule backwards: 4·x⁴/4 + 6·x²/2.|||Quy tắc luỹ thừa đi ngược: 4·x⁴/4 + 6·x²/2.'),
  Q('q2', '∫ (3/x + eˣ) dx =|||∫ (3/x + eˣ) dx =',
    ['3 ln|x| + eˣ + C|||3 ln|x| + eˣ + C', '−3/x² + eˣ + C|||−3/x² + eˣ + C', '3x⁰/0 + eˣ + C|||3x⁰/0 + eˣ + C', '3 ln|x| + xeˣ + C|||3 ln|x| + xeˣ + C'], 0,
    '∫ 1/x dx = ln|x| and eˣ is its own antiderivative.|||∫ 1/x dx = ln|x| và eˣ là nguyên hàm của chính nó.'),
  Q('q3', 'Marginal cost C′(q) = 10 + 0.4q, fixed cost 200. What is C(10)?|||Chi phí biên C′(q) = 10 + 0,4q, chi phí cố định 200. C(10) bằng?',
    ['120|||120', '214|||214', '320|||320', '300|||300'], 2,
    'C(q) = 10q + 0.2q² + 200, so C(10) = 100 + 20 + 200 = 320.|||C(q) = 10q + 0,2q² + 200, nên C(10) = 100 + 20 + 200 = 320.'),
  Q('q4', 'Left Riemann sum of f(x) = x² on [0, 2] with n = 2:|||Tổng Riemann trái của f(x) = x² trên [0, 2] với n = 2:',
    ['1|||1', '5|||5', '8/3|||8/3', '4|||4'], 0,
    'Δx = 1, left points 0 and 1: (0 + 1)·1 = 1 (an underestimate of 8/3).|||Δx = 1, điểm trái 0 và 1: (0 + 1)·1 = 1 (ước lượng thiếu so với 8/3).'),
  Q('q5', 'If ∫₀⁶ f = 10 and ∫₀² f = 3, then ∫₂⁶ (2f(x) + 1) dx =|||Nếu ∫₀⁶ f = 10 và ∫₀² f = 3 thì ∫₂⁶ (2f(x) + 1) dx =',
    ['15|||15', '14|||14', '7|||7', '18|||18'], 3,
    '∫₂⁶ f = 7, so 2·7 + 1·(6 − 2) = 18.|||∫₂⁶ f = 7, nên 2·7 + 1·(6 − 2) = 18.'),
  Q('q6', '∫₀^(ln 2) eˣ dx =|||∫₀^(ln 2) eˣ dx =',
    ['ln 2|||ln 2', '2|||2', '1|||1', 'e²|||e²'], 2,
    'e^(ln 2) − e⁰ = 2 − 1 = 1.|||e^(ln 2) − e⁰ = 2 − 1 = 1.'),
  Q('q7', 'd/dx ∫₁^(x²) √(1 + t) dt =|||d/dx ∫₁^(x²) √(1 + t) dt =',
    ['√(1 + x²)|||√(1 + x²)', '2x√(1 + x²)|||2x√(1 + x²)', '2x√(1 + x)|||2x√(1 + x)', '√(1 + x²) − √2|||√(1 + x²) − √2'], 1,
    'FTC Part 1 with the chain rule: f(x²)·(x²)′.|||Định lý cơ bản Phần 1 kèm dây chuyền: f(x²)·(x²)′.'),
  Q('q8', 'Revenue flows at R′(t) = 200 + 30t (million VND/month). Revenue from month 2 to month 4?|||Doanh thu chảy về với R′(t) = 200 + 30t (triệu/tháng). Doanh thu từ tháng 2 đến tháng 4?',
    ['580|||580', '520|||520', '400|||400', '640|||640'], 0,
    '[200t + 15t²]₂⁴ = (800 + 240) − (400 + 60) = 580.|||[200t + 15t²]₂⁴ = (800 + 240) − (400 + 60) = 580.'),
  Q('q9', 'v(t) = 2t − 4 m/s on [0, 5]. The distance travelled is|||v(t) = 2t − 4 m/s trên [0, 5]. Quãng đường đi được là',
    ['5 m|||5 m', '9 m|||9 m', '4 m|||4 m', '13 m|||13 m'], 3,
    'v changes sign at t = 2: 4 m backwards + 9 m forwards = 13 m (displacement is only 5 m).|||v đổi dấu tại t = 2: lùi 4 m + tiến 9 m = 13 m (độ dời chỉ 5 m).'),
  Q('q10', '∫₁^(e²) (1/x) dx =|||∫₁^(e²) (1/x) dx =',
    ['e² − 1|||e² − 1', '2|||2', '1|||1', '1/e²|||1/e²'], 1,
    'ln(e²) − ln 1 = 2.|||ln(e²) − ln 1 = 2.'),
]);

const ch5 = {
  title: 'Chapter 5 — Integrals|||Chương 5 — Tích phân',
  description: 'Nguyên hàm và bài toán giá trị ban đầu (tổng chi phí, doanh thu, vị trí), tổng Riemann có code Python, tích phân xác định, định lý cơ bản và lượng thay đổi ròng (Stewart ch.4–5 · OpenStax Vol.1 4.10, ch.5).',
  lessons: [c51, c52, c53, q5],
};


// ───────────────────────────── Chương 6 — Kỹ thuật tính tích phân ─────────────────────────────
const c61 = L('mac103-ts-6-1',
  '6.1 — Integration by substitution|||6.1 — Phương pháp đổi biến',
  'Đổi biến u = g(x) là quy tắc dây chuyền đi ngược: nhận diện “hàm trong + đạo hàm của nó”, bù hằng số, đổi cận ở tích phân xác định; ví dụ lượt tải ứng dụng.',
  `<span class="eyebrow">MAC103 · Chapter 6 · Lesson 6.1</span>
<h2>Substitution: the chain rule in reverse</h2>
<p class="lead">The table of Lesson 5.1 cannot handle ∫ 3x<sup>2</sup>(x<sup>3</sup> + 5)<sup>4</sup> dx directly. But notice that 3x<sup>2</sup> is exactly the derivative of the inside x<sup>3</sup> + 5. Whenever an integrand looks like “a function of g(x) times g′(x)”, rename g(x) = u and the integral becomes simple. This is the most used technique in the whole course.</p>
<h3>🎯 Objectives</h3>
<ul><li>Recognise the pattern f(g(x))·g′(x) in an integrand.</li><li>Carry out a substitution, including fixing a missing constant factor.</li><li>Evaluate definite integrals by substitution, changing the limits of integration.</li></ul>
<h3>📖 Lecture</h3>
<p>If F′ = f then, by the chain rule, d/dx F(g(x)) = f(g(x))·g′(x). Reading this backwards:</p>
<div class="formula"><span class="lbl">Substitution rule</span>∫ f(g(x))·g′(x) dx = ∫ f(u) du    with u = g(x), du = g′(x) dx</div>
<p><strong>Recipe.</strong> (1) Choose u = the “inside” expression (inside a power, root, exponential, log or trig function, or a denominator). (2) Compute du = u′ dx. (3) Rewrite <em>everything</em> in u — no x may remain. (4) Integrate in u. (5) Substitute back u = g(x).</p>
<div class="formula"><span class="lbl">Definite version</span>∫<sub>a</sub><sup>b</sup> f(g(x))·g′(x) dx = ∫<sub>g(a)</sub><sup>g(b)</sup> f(u) du    (change the limits, never substitute back)</div>
<p>Two shortcuts follow from substitution with a linear inside u = ax + b: ∫ e<sup>ax+b</sup> dx = e<sup>ax+b</sup>/a + C and ∫ cos(ax) dx = sin(ax)/a + C. And when the numerator is the derivative of the denominator: ∫ g′(x)/g(x) dx = ln|g(x)| + C.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> ∫ 3x<sup>2</sup>(x<sup>3</sup> + 5)<sup>4</sup> dx. Let u = x<sup>3</sup> + 5, du = 3x<sup>2</sup> dx. Then ∫ u<sup>4</sup> du = u<sup>5</sup>/5 + C = <b>(x<sup>3</sup> + 5)<sup>5</sup>/5 + C</b>.</p></div>
<div class="callout"><p><b>Example 2 — numerator = derivative of denominator.</b> ∫ (2x + 3)/(x<sup>2</sup> + 3x + 7) dx. With u = x<sup>2</sup> + 3x + 7, du = (2x + 3) dx, so the integral is ∫ du/u = <b>ln(x<sup>2</sup> + 3x + 7) + C</b> (the quadratic is always positive, so no absolute value is needed).</p></div>
<div class="callout"><p><b>Example 3 — linear inside.</b> ∫ e<sup>5x−1</sup> dx = <b>e<sup>5x−1</sup>/5 + C</b>; ∫ cos 4x dx = <b>(sin 4x)/4 + C</b>. Differentiate to check: the chain rule brings the 5 (or 4) back.</p></div>
<div class="callout"><p><b>Example 4 — definite, change the limits.</b> ∫<sub>0</sub><sup>2</sup> x√(x<sup>2</sup> + 5) dx. Let u = x<sup>2</sup> + 5, du = 2x dx ⇒ x dx = du/2. Limits: x = 0 → u = 5; x = 2 → u = 9. So ½∫<sub>5</sub><sup>9</sup> u<sup>1/2</sup> du = ½·(2/3)[u<sup>3/2</sup>]<sub>5</sub><sup>9</sup> = (1/3)(27 − 5√5) = <b>9 − 5√5/3 ≈ 5.273</b>.</p></div>
<div class="callout"><p><b>Example 5 — app downloads.</b> After a launch, downloads arrive at the rate D′(t) = 1200t/(t<sup>2</sup> + 9) thousand per week. Total in the first 4 weeks: u = t<sup>2</sup> + 9, du = 2t dt, limits 9 → 25: ∫<sub>9</sub><sup>25</sup> 600/u du = 600 ln(25/9) ≈ <b>613 thousand downloads</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Leaving a mix of x and u in the integral — every x and the dx must be replaced.</li><li>Forgetting the constant factor: with du = 2x dx you need x dx = du/2.</li><li>Changing to u but keeping the old x-limits (or changing the limits and then substituting back as well).</li><li>Trying u-substitution when g′ is missing up to more than a constant: ∫ e<sup>x²</sup> dx has no elementary antiderivative.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Look for an inside function whose derivative also appears (up to a constant).</li><li>u = g(x), du = g′(x) dx; rewrite everything in u.</li><li>∫ g′/g dx = ln|g| + C; linear inside ⇒ divide by the coefficient.</li><li>For definite integrals change the limits to u-values.</li><li>Check by differentiating.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/5-5-substitution" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 5.5 Substitution</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/SubstitutionRuleIndefinite.aspx" target="_blank" rel="noopener">Paul's Online Notes — Substitution Rule for Indefinite Integrals</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/SubstitutionRuleDefinite.aspx" target="_blank" rel="noopener">Paul's Online Notes — Substitution Rule for Definite Integrals</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>∫ x<sup>2</sup>/(x<sup>3</sup> + 1)<sup>2</sup> dx.</li><li>∫<sub>1</sub><sup>e</sup> (ln x)<sup>2</sup>/x dx.</li><li>∫ sin x · cos<sup>4</sup> x dx.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) u = x<sup>3</sup> + 1, x<sup>2</sup> dx = du/3: (1/3)∫ u<sup>−2</sup> du = −1/(3(x<sup>3</sup> + 1)) + C. 2) u = ln x, du = dx/x, limits 0 → 1: ∫<sub>0</sub><sup>1</sup> u<sup>2</sup> du = 1/3. 3) u = cos x, du = −sin x dx: −∫ u<sup>4</sup> du = −cos<sup>5</sup> x/5 + C.</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 6 · Bài 6.1</span>
<h2>Đổi biến: quy tắc dây chuyền đi ngược</h2>
<p class="lead">Bảng nguyên hàm ở Bài 5.1 không xử lý trực tiếp được ∫ 3x<sup>2</sup>(x<sup>3</sup> + 5)<sup>4</sup> dx. Nhưng để ý 3x<sup>2</sup> đúng bằng đạo hàm của phần bên trong x<sup>3</sup> + 5. Hễ hàm dưới dấu tích phân có dạng “hàm của g(x) nhân g′(x)” thì đặt g(x) = u và tích phân trở nên đơn giản. Đây là kỹ thuật dùng nhiều nhất của cả môn.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận ra dạng f(g(x))·g′(x) trong hàm dưới dấu tích phân.</li><li>Thực hiện đổi biến, kể cả bù hằng số còn thiếu.</li><li>Tính tích phân xác định bằng đổi biến, đổi cận tích phân.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Nếu F′ = f thì theo quy tắc dây chuyền d/dx F(g(x)) = f(g(x))·g′(x). Đọc ngược lại:</p>
<div class="formula"><span class="lbl">Quy tắc đổi biến</span>∫ f(g(x))·g′(x) dx = ∫ f(u) du    với u = g(x), du = g′(x) dx</div>
<p><strong>Công thức làm.</strong> (1) Chọn u = biểu thức “bên trong” (trong luỹ thừa, căn, mũ, logarit, lượng giác, hoặc mẫu số). (2) Tính du = u′ dx. (3) Viết lại <em>toàn bộ</em> theo u — không được còn x. (4) Lấy nguyên hàm theo u. (5) Thay ngược u = g(x).</p>
<div class="formula"><span class="lbl">Dạng xác định</span>∫<sub>a</sub><sup>b</sup> f(g(x))·g′(x) dx = ∫<sub>g(a)</sub><sup>g(b)</sup> f(u) du    (đổi cận, không thay ngược)</div>
<p>Hai lối tắt suy ra từ đổi biến với phần trong tuyến tính u = ax + b: ∫ e<sup>ax+b</sup> dx = e<sup>ax+b</sup>/a + C và ∫ cos(ax) dx = sin(ax)/a + C. Còn khi tử là đạo hàm của mẫu: ∫ g′(x)/g(x) dx = ln|g(x)| + C.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> ∫ 3x<sup>2</sup>(x<sup>3</sup> + 5)<sup>4</sup> dx. Đặt u = x<sup>3</sup> + 5, du = 3x<sup>2</sup> dx. Khi đó ∫ u<sup>4</sup> du = u<sup>5</sup>/5 + C = <b>(x<sup>3</sup> + 5)<sup>5</sup>/5 + C</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — tử là đạo hàm của mẫu.</b> ∫ (2x + 3)/(x<sup>2</sup> + 3x + 7) dx. Với u = x<sup>2</sup> + 3x + 7, du = (2x + 3) dx, tích phân thành ∫ du/u = <b>ln(x<sup>2</sup> + 3x + 7) + C</b> (tam thức luôn dương nên không cần trị tuyệt đối).</p></div>
<div class="callout"><p><b>Ví dụ 3 — phần trong tuyến tính.</b> ∫ e<sup>5x−1</sup> dx = <b>e<sup>5x−1</sup>/5 + C</b>; ∫ cos 4x dx = <b>(sin 4x)/4 + C</b>. Đạo hàm lại để kiểm: quy tắc dây chuyền trả số 5 (hoặc 4) về.</p></div>
<div class="callout"><p><b>Ví dụ 4 — tích phân xác định, đổi cận.</b> ∫<sub>0</sub><sup>2</sup> x√(x<sup>2</sup> + 5) dx. Đặt u = x<sup>2</sup> + 5, du = 2x dx ⇒ x dx = du/2. Cận: x = 0 → u = 5; x = 2 → u = 9. Vậy ½∫<sub>5</sub><sup>9</sup> u<sup>1/2</sup> du = ½·(2/3)[u<sup>3/2</sup>]<sub>5</sub><sup>9</sup> = (1/3)(27 − 5√5) = <b>9 − 5√5/3 ≈ 5,273</b>.</p></div>
<div class="callout"><p><b>Ví dụ 5 — lượt tải ứng dụng.</b> Sau khi ra mắt, lượt tải về với tốc độ D′(t) = 1200t/(t<sup>2</sup> + 9) nghìn lượt/tuần. Tổng trong 4 tuần đầu: u = t<sup>2</sup> + 9, du = 2t dt, cận 9 → 25: ∫<sub>9</sub><sup>25</sup> 600/u du = 600 ln(25/9) ≈ <b>613 nghìn lượt</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Để lẫn x và u trong tích phân — mọi x và cả dx đều phải thay.</li><li>Quên hệ số: với du = 2x dx thì x dx = du/2.</li><li>Đổi sang u mà vẫn giữ cận cũ theo x (hoặc đã đổi cận rồi còn thay ngược).</li><li>Cố đổi biến khi g′ thiếu nhiều hơn một hằng số: ∫ e<sup>x²</sup> dx không có nguyên hàm sơ cấp.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tìm hàm bên trong mà đạo hàm của nó cũng xuất hiện (sai khác hằng số).</li><li>u = g(x), du = g′(x) dx; viết lại mọi thứ theo u.</li><li>∫ g′/g dx = ln|g| + C; phần trong tuyến tính ⇒ chia cho hệ số.</li><li>Tích phân xác định: đổi cận sang giá trị của u.</li><li>Kiểm bằng cách đạo hàm.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/5-5-substitution" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 5.5 Đổi biến</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/SubstitutionRuleIndefinite.aspx" target="_blank" rel="noopener">Paul's Online Notes — Đổi biến cho tích phân bất định</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/SubstitutionRuleDefinite.aspx" target="_blank" rel="noopener">Paul's Online Notes — Đổi biến cho tích phân xác định</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>∫ x<sup>2</sup>/(x<sup>3</sup> + 1)<sup>2</sup> dx.</li><li>∫<sub>1</sub><sup>e</sup> (ln x)<sup>2</sup>/x dx.</li><li>∫ sin x · cos<sup>4</sup> x dx.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) u = x<sup>3</sup> + 1, x<sup>2</sup> dx = du/3: (1/3)∫ u<sup>−2</sup> du = −1/(3(x<sup>3</sup> + 1)) + C. 2) u = ln x, du = dx/x, cận 0 → 1: ∫<sub>0</sub><sup>1</sup> u<sup>2</sup> du = 1/3. 3) u = cos x, du = −sin x dx: −∫ u<sup>4</sup> du = −cos<sup>5</sup> x/5 + C.</p></div>`);

const c62 = L('mac103-ts-6-2',
  '6.2 — Integration by parts|||6.2 — Tích phân từng phần',
  'Tích phân từng phần là quy tắc tích đi ngược: ∫u dv = uv − ∫v du, chọn u theo LIATE, bảng (tabular) cho đa thức × mũ, tích phân xác định từng phần; ví dụ dòng doanh thu khuyến mãi.',
  `<span class="eyebrow">MAC103 · Chapter 6 · Lesson 6.2</span>
<h2>Integration by parts: the product rule in reverse</h2>
<p class="lead">Substitution undoes the chain rule; <strong>integration by parts</strong> undoes the product rule. It handles products of two different kinds of functions — x·cos 2x, x<sup>3</sup>·ln x, t·e<sup>−0.5t</sup> — which appear constantly in present-value and probability calculations.</p>
<h3>🎯 Objectives</h3>
<ul><li>Derive and apply ∫ u dv = uv − ∫ v du.</li><li>Choose u with the LIATE heuristic.</li><li>Use the tabular method for polynomial × exponential (or trig) products.</li><li>Evaluate definite integrals by parts.</li></ul>
<h3>📖 Lecture</h3>
<p>From (uv)′ = u′v + uv′, integrate both sides and rearrange:</p>
<div class="formula"><span class="lbl">Integration by parts</span>∫ u dv = uv − ∫ v du        ∫<sub>a</sub><sup>b</sup> u dv = [uv]<sub>a</sub><sup>b</sup> − ∫<sub>a</sub><sup>b</sup> v du</div>
<p>The goal is that the new integral ∫ v du is <em>easier</em> than the original. So choose as u the factor that becomes simpler when differentiated, and as dv the factor you can integrate. A reliable order for choosing u is <strong>LIATE</strong>:</p>
<div class="formula"><span class="lbl">LIATE (pick u from the left)</span>Logarithmic → Inverse trig → Algebraic (polynomials) → Trigonometric → Exponential</div>
<p><strong>Tabular method.</strong> For p(x)·e<sup>ax</sup> or p(x)·sin/cos with a polynomial p, write the derivatives of p in one column (until 0) and repeated antiderivatives of the other factor in a second column, multiply diagonally with alternating signs + − + − … This is just parts applied several times in a row.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> ∫ x cos 2x dx. u = x (algebraic), dv = cos 2x dx ⇒ du = dx, v = (sin 2x)/2. Then ∫ = (x sin 2x)/2 − ∫ (sin 2x)/2 dx = <b>(x sin 2x)/2 + (cos 2x)/4 + C</b>.</p></div>
<div class="callout"><p><b>Example 2 — the log goes in u.</b> ∫ x<sup>3</sup> ln x dx. u = ln x, dv = x<sup>3</sup> dx ⇒ du = dx/x, v = x<sup>4</sup>/4. So ∫ = (x<sup>4</sup> ln x)/4 − ∫ (x<sup>4</sup>/4)(1/x) dx = <b>(x<sup>4</sup> ln x)/4 − x<sup>4</sup>/16 + C</b>.</p></div>
<div class="callout"><p><b>Example 3 — tabular.</b> ∫ x<sup>2</sup> e<sup>3x</sup> dx. Derivatives of x<sup>2</sup>: x<sup>2</sup>, 2x, 2, 0. Antiderivatives of e<sup>3x</sup>: e<sup>3x</sup>/3, e<sup>3x</sup>/9, e<sup>3x</sup>/27. Diagonals with signs + − +: x<sup>2</sup>e<sup>3x</sup>/3 − 2x e<sup>3x</sup>/9 + 2e<sup>3x</sup>/27. Answer: <b>e<sup>3x</sup>(x<sup>2</sup>/3 − 2x/9 + 2/27) + C</b>.</p></div>
<div class="callout"><p><b>Example 4 — a promotion's revenue.</b> A promotion brings extra revenue at the rate r(t) = t e<sup>−0.5t</sup> billion VND per month: it rises, peaks and fades. Total in the first 4 months: u = t, dv = e<sup>−t/2</sup> dt ⇒ v = −2e<sup>−t/2</sup>. ∫<sub>0</sub><sup>4</sup> = [−2t e<sup>−t/2</sup>]<sub>0</sub><sup>4</sup> + 2∫<sub>0</sub><sup>4</sup> e<sup>−t/2</sup> dt = [−2t e<sup>−t/2</sup> − 4e<sup>−t/2</sup>]<sub>0</sub><sup>4</sup> = −12e<sup>−2</sup> + 4 ≈ <b>2.376 billion VND</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Choosing u = e<sup>x</sup> and dv = x dx: the new integral ∫ (x<sup>2</sup>/2)e<sup>x</sup> dx is <em>harder</em>. Follow LIATE.</li><li>Sign errors in uv − ∫ v du, especially when v is negative (like −2e<sup>−t/2</sup>).</li><li>In definite integrals, evaluating only the remaining integral and forgetting [uv]<sub>a</sub><sup>b</sup>.</li><li>Losing the alternating signs in the tabular method.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>∫ u dv = uv − ∫ v du comes from the product rule.</li><li>Pick u by LIATE; dv must be integrable.</li><li>Polynomial × e<sup>ax</sup> or × sin/cos: tabular method, signs + − + − …</li><li>Log alone or inverse trig alone: take dv = dx.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-2/pages/3-1-integration-by-parts" target="_blank" rel="noopener">OpenStax Calculus Vol. 2 — 3.1 Integration by Parts</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcII/IntegrationByParts.aspx" target="_blank" rel="noopener">Paul's Online Notes — Integration by Parts</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-4-techniques-of-integration/part-b-partial-fractions-integration-by-parts-arc-length-and-surface-area/" target="_blank" rel="noopener">MIT OCW 18.01SC — Partial Fractions, Integration by Parts</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>∫ x e<sup>−x</sup> dx.</li><li>∫<sub>1</sub><sup>2</sup> x ln x dx.</li><li>∫ arctan x dx (hint: u = arctan x, dv = dx).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) u = x, v = −e<sup>−x</sup>: −x e<sup>−x</sup> − e<sup>−x</sup> + C = −(x + 1)e<sup>−x</sup> + C. 2) u = ln x, v = x<sup>2</sup>/2: [x<sup>2</sup> ln x/2 − x<sup>2</sup>/4]<sub>1</sub><sup>2</sup> = 2 ln 2 − 3/4 ≈ 0.636. 3) x arctan x − ∫ x/(1 + x<sup>2</sup>) dx = x arctan x − ½ ln(1 + x<sup>2</sup>) + C.</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 6 · Bài 6.2</span>
<h2>Tích phân từng phần: quy tắc tích đi ngược</h2>
<p class="lead">Đổi biến làm ngược quy tắc dây chuyền; <strong>tích phân từng phần</strong> làm ngược quy tắc tích. Nó xử lý tích của hai loại hàm khác nhau — x·cos 2x, x<sup>3</sup>·ln x, t·e<sup>−0,5t</sup> — vốn xuất hiện liên tục trong tính giá trị hiện tại và xác suất.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Suy ra và áp dụng ∫ u dv = uv − ∫ v du.</li><li>Chọn u theo quy tắc LIATE.</li><li>Dùng phương pháp bảng cho tích đa thức × mũ (hoặc lượng giác).</li><li>Tính tích phân xác định bằng từng phần.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Từ (uv)′ = u′v + uv′, lấy tích phân hai vế rồi chuyển vế:</p>
<div class="formula"><span class="lbl">Tích phân từng phần</span>∫ u dv = uv − ∫ v du        ∫<sub>a</sub><sup>b</sup> u dv = [uv]<sub>a</sub><sup>b</sup> − ∫<sub>a</sub><sup>b</sup> v du</div>
<p>Mục tiêu là tích phân mới ∫ v du phải <em>dễ hơn</em> tích phân ban đầu. Vì vậy chọn u là thừa số trở nên đơn giản khi lấy đạo hàm, và dv là thừa số lấy được nguyên hàm. Thứ tự chọn u đáng tin là <strong>LIATE</strong>:</p>
<div class="formula"><span class="lbl">LIATE (ưu tiên chọn u từ trái)</span>Logarit → hàm lượng giác ngược (Inverse) → đại số/đa thức (Algebraic) → lượng giác (Trig) → mũ (Exponential)</div>
<p><strong>Phương pháp bảng.</strong> Với p(x)·e<sup>ax</sup> hoặc p(x)·sin/cos, p là đa thức: viết các đạo hàm của p ở một cột (đến khi bằng 0), các nguyên hàm liên tiếp của thừa số kia ở cột thứ hai, nhân chéo với dấu luân phiên + − + − … Thực chất là áp dụng từng phần nhiều lần liên tiếp.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> ∫ x cos 2x dx. u = x (đại số), dv = cos 2x dx ⇒ du = dx, v = (sin 2x)/2. Khi đó ∫ = (x sin 2x)/2 − ∫ (sin 2x)/2 dx = <b>(x sin 2x)/2 + (cos 2x)/4 + C</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — logarit làm u.</b> ∫ x<sup>3</sup> ln x dx. u = ln x, dv = x<sup>3</sup> dx ⇒ du = dx/x, v = x<sup>4</sup>/4. Vậy ∫ = (x<sup>4</sup> ln x)/4 − ∫ (x<sup>4</sup>/4)(1/x) dx = <b>(x<sup>4</sup> ln x)/4 − x<sup>4</sup>/16 + C</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — phương pháp bảng.</b> ∫ x<sup>2</sup> e<sup>3x</sup> dx. Đạo hàm của x<sup>2</sup>: x<sup>2</sup>, 2x, 2, 0. Nguyên hàm của e<sup>3x</sup>: e<sup>3x</sup>/3, e<sup>3x</sup>/9, e<sup>3x</sup>/27. Nhân chéo với dấu + − +: x<sup>2</sup>e<sup>3x</sup>/3 − 2x e<sup>3x</sup>/9 + 2e<sup>3x</sup>/27. Đáp án: <b>e<sup>3x</sup>(x<sup>2</sup>/3 − 2x/9 + 2/27) + C</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4 — doanh thu từ đợt khuyến mãi.</b> Một đợt khuyến mãi mang lại doanh thu tăng thêm với tốc độ r(t) = t e<sup>−0,5t</sup> tỉ đồng/tháng: tăng, đạt đỉnh rồi nhạt dần. Tổng trong 4 tháng đầu: u = t, dv = e<sup>−t/2</sup> dt ⇒ v = −2e<sup>−t/2</sup>. ∫<sub>0</sub><sup>4</sup> = [−2t e<sup>−t/2</sup>]<sub>0</sub><sup>4</sup> + 2∫<sub>0</sub><sup>4</sup> e<sup>−t/2</sup> dt = [−2t e<sup>−t/2</sup> − 4e<sup>−t/2</sup>]<sub>0</sub><sup>4</sup> = −12e<sup>−2</sup> + 4 ≈ <b>2,376 tỉ đồng</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chọn u = e<sup>x</sup>, dv = x dx: tích phân mới ∫ (x<sup>2</sup>/2)e<sup>x</sup> dx còn <em>khó hơn</em>. Hãy theo LIATE.</li><li>Sai dấu trong uv − ∫ v du, nhất là khi v âm (như −2e<sup>−t/2</sup>).</li><li>Ở tích phân xác định chỉ tính phần tích phân còn lại mà quên [uv]<sub>a</sub><sup>b</sup>.</li><li>Mất dấu luân phiên trong phương pháp bảng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>∫ u dv = uv − ∫ v du xuất phát từ quy tắc tích.</li><li>Chọn u theo LIATE; dv phải lấy được nguyên hàm.</li><li>Đa thức × e<sup>ax</sup> hoặc × sin/cos: phương pháp bảng, dấu + − + − …</li><li>Logarit đứng một mình hoặc lượng giác ngược đứng một mình: lấy dv = dx.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-2/pages/3-1-integration-by-parts" target="_blank" rel="noopener">OpenStax Calculus Vol. 2 — 3.1 Tích phân từng phần</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcII/IntegrationByParts.aspx" target="_blank" rel="noopener">Paul's Online Notes — Tích phân từng phần</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-4-techniques-of-integration/part-b-partial-fractions-integration-by-parts-arc-length-and-surface-area/" target="_blank" rel="noopener">MIT OCW 18.01SC — Phân thức, tích phân từng phần</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>∫ x e<sup>−x</sup> dx.</li><li>∫<sub>1</sub><sup>2</sup> x ln x dx.</li><li>∫ arctan x dx (gợi ý: u = arctan x, dv = dx).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) u = x, v = −e<sup>−x</sup>: −x e<sup>−x</sup> − e<sup>−x</sup> + C = −(x + 1)e<sup>−x</sup> + C. 2) u = ln x, v = x<sup>2</sup>/2: [x<sup>2</sup> ln x/2 − x<sup>2</sup>/4]<sub>1</sub><sup>2</sup> = 2 ln 2 − 3/4 ≈ 0,636. 3) x arctan x − ∫ x/(1 + x<sup>2</sup>) dx = x arctan x − ½ ln(1 + x<sup>2</sup>) + C.</p></div>`);

const c63 = L('mac103-ts-6-3',
  '6.3 — Partial fractions, improper integrals and numerical integration|||6.3 — Phân thức đơn giản, tích phân suy rộng và tích phân số',
  'Tách phân thức với nhân tử tuyến tính phân biệt; tích phân suy rộng tới vô cùng (dòng thu nhập vĩnh viễn, tiêu chuẩn p); quy tắc hình thang và Simpson bằng Python chạy thật.',
  `<span class="eyebrow">MAC103 · Chapter 6 · Lesson 6.3</span>
<h2>Partial fractions, improper integrals, numerical integration</h2>
<p class="lead">Three tools finish the toolbox. <strong>Partial fractions</strong> break a rational function into pieces you already know how to integrate. <strong>Improper integrals</strong> let the interval run to infinity — the value of an income stream that never ends. And when no formula exists, <strong>numerical integration</strong> lets a computer get the number anyway.</p>
<h3>🎯 Objectives</h3>
<ul><li>Decompose P(x)/Q(x) when Q factors into distinct linear factors, and integrate it.</li><li>Evaluate ∫<sub>a</sub><sup>∞</sup> f(x) dx as a limit; decide convergence with the p-test.</li><li>Apply the trapezoid rule and Simpson's rule by hand and in Python.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Partial fractions.</strong> If deg P &lt; deg Q and Q(x) = (x − r<sub>1</sub>)(x − r<sub>2</sub>) with r<sub>1</sub> ≠ r<sub>2</sub>, then</p>
<div class="formula"><span class="lbl">Distinct linear factors</span>P(x)/[(x − r<sub>1</sub>)(x − r<sub>2</sub>)] = A/(x − r<sub>1</sub>) + B/(x − r<sub>2</sub>)    and    ∫ A/(x − r) dx = A ln|x − r| + C</div>
<p>Find A by covering up (x − r<sub>1</sub>) and plugging x = r<sub>1</sub> into the rest; same for B. (If deg P ≥ deg Q, do polynomial long division first.)</p>
<p><strong>Improper integrals.</strong> An integral over an infinite interval is defined as a limit:</p>
<div class="formula"><span class="lbl">Improper integral</span>∫<sub>a</sub><sup>∞</sup> f(x) dx = lim<sub>b→∞</sub> ∫<sub>a</sub><sup>b</sup> f(x) dx    (converges if the limit is finite)</div>
<div class="formula"><span class="lbl">p-test</span>∫<sub>1</sub><sup>∞</sup> 1/x<sup>p</sup> dx converges ⇔ p &gt; 1 (value 1/(p − 1));    ∫<sub>0</sub><sup>∞</sup> e<sup>−kx</sup> dx = 1/k for k &gt; 0</div>
<p><strong>Numerical integration.</strong> With n subintervals of width h = (b − a)/n and points x<sub>i</sub>:</p>
<div class="formula"><span class="lbl">Trapezoid</span>T<sub>n</sub> = (h/2)[f(x<sub>0</sub>) + 2f(x<sub>1</sub>) + … + 2f(x<sub>n−1</sub>) + f(x<sub>n</sub>)]</div>
<div class="formula"><span class="lbl">Simpson (n even)</span>S<sub>n</sub> = (h/3)[f(x<sub>0</sub>) + 4f(x<sub>1</sub>) + 2f(x<sub>2</sub>) + 4f(x<sub>3</sub>) + … + 4f(x<sub>n−1</sub>) + f(x<sub>n</sub>)]</div>
<p>Trapezoid error shrinks like 1/n<sup>2</sup>, Simpson like 1/n<sup>4</sup> — Simpson is exact for cubics.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — partial fractions.</b> ∫ (x + 7)/(x<sup>2</sup> − x − 6) dx. Factor: x<sup>2</sup> − x − 6 = (x − 3)(x + 2). Cover-up: A = (3 + 7)/(3 + 2) = 2, B = (−2 + 7)/(−2 − 3) = −1. So the integral is <b>2 ln|x − 3| − ln|x + 2| + C</b>.</p></div>
<div class="callout"><p><b>Example 2 — a perpetual income stream.</b> A rental property is expected to bring 120 million VND per year forever; money is discounted continuously at 8%. Present value = ∫<sub>0</sub><sup>∞</sup> 120e<sup>−0.08t</sup> dt = lim<sub>b→∞</sub> 1500(1 − e<sup>−0.08b</sup>) = <b>1 500 million VND</b>. An infinite stream has a finite price because distant money is worth almost nothing today.</p></div>
<div class="callout"><p><b>Example 3 — p-test.</b> ∫<sub>1</sub><sup>∞</sup> 1/x<sup>3</sup> dx = lim [−1/(2x<sup>2</sup>)]<sub>1</sub><sup>b</sup> = <b>1/2</b> (converges, p = 3). ∫<sub>1</sub><sup>∞</sup> 1/√x dx = lim (2√b − 2) = ∞: <b>diverges</b> (p = 1/2 ≤ 1).</p></div>
<div class="callout"><p><b>Example 4 — when there is no formula.</b> ∫<sub>0</sub><sup>2</sup> √(1 + x<sup>3</sup>) dx has no elementary antiderivative. Let Python do it:</p>
<pre><code class="language-python">import math

def f(x):
    return math.sqrt(1 + x**3)

def trapezoid(f, a, b, n):
    h = (b - a) / n
    s = f(a) + f(b) + 2 * sum(f(a + i * h) for i in range(1, n))
    return h / 2 * s

def simpson(f, a, b, n):          # n must be even
    h = (b - a) / n
    s = f(a) + f(b)
    s += 4 * sum(f(a + i * h) for i in range(1, n, 2))
    s += 2 * sum(f(a + i * h) for i in range(2, n, 2))
    return h / 3 * s

for n in [4, 8, 16]:
    print(f"n={n:2d}  trapezoid={trapezoid(f, 0, 2, n):.6f}  simpson={simpson(f, 0, 2, n):.6f}")</code></pre>
<div class="out">n= 4  trapezoid=3.283262  simpson=3.239611
n= 8  trapezoid=3.251744  simpson=3.241238
n=16  trapezoid=3.243915  simpson=3.241305</div>
<p>The true value is 3.241309… Simpson with n = 8 already has 4 correct digits; the trapezoid rule needs far more points.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using partial fractions when deg P ≥ deg Q without dividing first.</li><li>Writing ∞ into the antiderivative as if it were a number — always take lim<sub>b→∞</sub>.</li><li>Thinking ∫<sub>1</sub><sup>∞</sup> 1/x dx converges because 1/x → 0: it diverges (p = 1).</li><li>Using Simpson's rule with an odd n, or with the wrong 1-4-2-4-…-4-1 pattern.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Distinct linear factors: A/(x − r<sub>1</sub>) + B/(x − r<sub>2</sub>), cover-up to find A and B, integrate to logs.</li><li>∫<sub>a</sub><sup>∞</sup> = limit; ∫<sub>1</sub><sup>∞</sup> x<sup>−p</sup> converges iff p &gt; 1.</li><li>Perpetual stream at rate R discounted at r: PV = R/r.</li><li>Trapezoid ~ 1/n<sup>2</sup> error, Simpson ~ 1/n<sup>4</sup>; Simpson needs even n.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-2/pages/3-4-partial-fractions" target="_blank" rel="noopener">OpenStax Calculus Vol. 2 — 3.4 Partial Fractions</a></li><li><a href="https://openstax.org/books/calculus-volume-2/pages/3-6-numerical-integration" target="_blank" rel="noopener">OpenStax Calculus Vol. 2 — 3.6 Numerical Integration</a></li><li><a href="https://openstax.org/books/calculus-volume-2/pages/3-7-improper-integrals" target="_blank" rel="noopener">OpenStax Calculus Vol. 2 — 3.7 Improper Integrals</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcII/ImproperIntegrals.aspx" target="_blank" rel="noopener">Paul's Online Notes — Improper Integrals</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>∫ 1/(x<sup>2</sup> − 4) dx.</li><li>∫<sub>2</sub><sup>∞</sup> 3/x<sup>2</sup> dx.</li><li>Approximate ∫<sub>0</sub><sup>2</sup> x<sup>3</sup> dx with the trapezoid rule and with Simpson's rule, both with n = 2. Compare with the exact value.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 1/[(x − 2)(x + 2)] = (1/4)/(x − 2) − (1/4)/(x + 2) ⇒ (1/4) ln|(x − 2)/(x + 2)| + C. 2) lim [−3/x]<sub>2</sub><sup>b</sup> = 3/2. 3) h = 1, values 0, 1, 8: T<sub>2</sub> = ½(0 + 2 + 8) = 5; S<sub>2</sub> = (1/3)(0 + 4 + 8) = 4; exact 4 (Simpson is exact for cubics).</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 6 · Bài 6.3</span>
<h2>Phân thức đơn giản, tích phân suy rộng, tích phân số</h2>
<p class="lead">Ba công cụ hoàn thiện bộ đồ nghề. <strong>Tách phân thức</strong> bẻ một hàm hữu tỉ thành các mảnh ta đã biết tích phân. <strong>Tích phân suy rộng</strong> cho khoảng chạy tới vô cùng — giá trị của một dòng thu nhập không bao giờ dừng. Và khi không có công thức, <strong>tích phân số</strong> giúp máy tính vẫn ra được con số.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tách P(x)/Q(x) khi Q phân tích được thành các nhân tử tuyến tính phân biệt, rồi lấy tích phân.</li><li>Tính ∫<sub>a</sub><sup>∞</sup> f(x) dx như một giới hạn; xét hội tụ bằng tiêu chuẩn p.</li><li>Áp dụng quy tắc hình thang và quy tắc Simpson bằng tay và bằng Python.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Tách phân thức.</strong> Nếu bậc P &lt; bậc Q và Q(x) = (x − r<sub>1</sub>)(x − r<sub>2</sub>) với r<sub>1</sub> ≠ r<sub>2</sub> thì</p>
<div class="formula"><span class="lbl">Nhân tử tuyến tính phân biệt</span>P(x)/[(x − r<sub>1</sub>)(x − r<sub>2</sub>)] = A/(x − r<sub>1</sub>) + B/(x − r<sub>2</sub>)    và    ∫ A/(x − r) dx = A ln|x − r| + C</div>
<p>Tìm A bằng cách “che” (x − r<sub>1</sub>) rồi thay x = r<sub>1</sub> vào phần còn lại; tương tự với B. (Nếu bậc P ≥ bậc Q, chia đa thức trước.)</p>
<p><strong>Tích phân suy rộng.</strong> Tích phân trên khoảng vô hạn được định nghĩa bằng giới hạn:</p>
<div class="formula"><span class="lbl">Tích phân suy rộng</span>∫<sub>a</sub><sup>∞</sup> f(x) dx = lim<sub>b→∞</sub> ∫<sub>a</sub><sup>b</sup> f(x) dx    (hội tụ nếu giới hạn hữu hạn)</div>
<div class="formula"><span class="lbl">Tiêu chuẩn p</span>∫<sub>1</sub><sup>∞</sup> 1/x<sup>p</sup> dx hội tụ ⇔ p &gt; 1 (giá trị 1/(p − 1));    ∫<sub>0</sub><sup>∞</sup> e<sup>−kx</sup> dx = 1/k với k &gt; 0</div>
<p><strong>Tích phân số.</strong> Với n đoạn con độ rộng h = (b − a)/n và các điểm x<sub>i</sub>:</p>
<div class="formula"><span class="lbl">Hình thang</span>T<sub>n</sub> = (h/2)[f(x<sub>0</sub>) + 2f(x<sub>1</sub>) + … + 2f(x<sub>n−1</sub>) + f(x<sub>n</sub>)]</div>
<div class="formula"><span class="lbl">Simpson (n chẵn)</span>S<sub>n</sub> = (h/3)[f(x<sub>0</sub>) + 4f(x<sub>1</sub>) + 2f(x<sub>2</sub>) + 4f(x<sub>3</sub>) + … + 4f(x<sub>n−1</sub>) + f(x<sub>n</sub>)]</div>
<p>Sai số hình thang giảm như 1/n<sup>2</sup>, Simpson như 1/n<sup>4</sup> — Simpson đúng tuyệt đối với đa thức bậc ba.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — tách phân thức.</b> ∫ (x + 7)/(x<sup>2</sup> − x − 6) dx. Phân tích: x<sup>2</sup> − x − 6 = (x − 3)(x + 2). Che: A = (3 + 7)/(3 + 2) = 2, B = (−2 + 7)/(−2 − 3) = −1. Vậy tích phân bằng <b>2 ln|x − 3| − ln|x + 2| + C</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — dòng thu nhập vĩnh viễn.</b> Một bất động sản cho thuê dự kiến mang lại 120 triệu đồng/năm mãi mãi; tiền được chiết khấu liên tục 8%. Giá trị hiện tại = ∫<sub>0</sub><sup>∞</sup> 120e<sup>−0,08t</sup> dt = lim<sub>b→∞</sub> 1500(1 − e<sup>−0,08b</sup>) = <b>1 500 triệu đồng</b>. Dòng tiền vô hạn vẫn có giá hữu hạn vì tiền ở rất xa gần như không đáng gì hôm nay.</p></div>
<div class="callout"><p><b>Ví dụ 3 — tiêu chuẩn p.</b> ∫<sub>1</sub><sup>∞</sup> 1/x<sup>3</sup> dx = lim [−1/(2x<sup>2</sup>)]<sub>1</sub><sup>b</sup> = <b>1/2</b> (hội tụ, p = 3). ∫<sub>1</sub><sup>∞</sup> 1/√x dx = lim (2√b − 2) = ∞: <b>phân kỳ</b> (p = 1/2 ≤ 1).</p></div>
<div class="callout"><p><b>Ví dụ 4 — khi không có công thức.</b> ∫<sub>0</sub><sup>2</sup> √(1 + x<sup>3</sup>) dx không có nguyên hàm sơ cấp. Để Python làm:</p>
<pre><code class="language-python">import math

def f(x):
    return math.sqrt(1 + x**3)

def trapezoid(f, a, b, n):
    h = (b - a) / n
    s = f(a) + f(b) + 2 * sum(f(a + i * h) for i in range(1, n))
    return h / 2 * s

def simpson(f, a, b, n):          # n must be even
    h = (b - a) / n
    s = f(a) + f(b)
    s += 4 * sum(f(a + i * h) for i in range(1, n, 2))
    s += 2 * sum(f(a + i * h) for i in range(2, n, 2))
    return h / 3 * s

for n in [4, 8, 16]:
    print(f"n={n:2d}  trapezoid={trapezoid(f, 0, 2, n):.6f}  simpson={simpson(f, 0, 2, n):.6f}")</code></pre>
<div class="out">n= 4  trapezoid=3.283262  simpson=3.239611
n= 8  trapezoid=3.251744  simpson=3.241238
n=16  trapezoid=3.243915  simpson=3.241305</div>
<p>Giá trị đúng là 3,241309… Simpson với n = 8 đã đúng 4 chữ số; quy tắc hình thang cần nhiều điểm hơn hẳn.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tách phân thức khi bậc P ≥ bậc Q mà chưa chia đa thức.</li><li>Thay ∞ vào nguyên hàm như một con số — luôn lấy lim<sub>b→∞</sub>.</li><li>Tưởng ∫<sub>1</sub><sup>∞</sup> 1/x dx hội tụ vì 1/x → 0: nó phân kỳ (p = 1).</li><li>Dùng Simpson với n lẻ, hoặc sai mẫu hệ số 1-4-2-4-…-4-1.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Nhân tử tuyến tính phân biệt: A/(x − r<sub>1</sub>) + B/(x − r<sub>2</sub>), che để tìm A, B, tích phân ra logarit.</li><li>∫<sub>a</sub><sup>∞</sup> = giới hạn; ∫<sub>1</sub><sup>∞</sup> x<sup>−p</sup> hội tụ khi và chỉ khi p &gt; 1.</li><li>Dòng tiền vĩnh viễn tốc độ R, chiết khấu r: PV = R/r.</li><li>Hình thang sai số ~ 1/n<sup>2</sup>, Simpson ~ 1/n<sup>4</sup>; Simpson cần n chẵn.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-2/pages/3-4-partial-fractions" target="_blank" rel="noopener">OpenStax Calculus Vol. 2 — 3.4 Phân thức đơn giản</a></li><li><a href="https://openstax.org/books/calculus-volume-2/pages/3-6-numerical-integration" target="_blank" rel="noopener">OpenStax Calculus Vol. 2 — 3.6 Tích phân số</a></li><li><a href="https://openstax.org/books/calculus-volume-2/pages/3-7-improper-integrals" target="_blank" rel="noopener">OpenStax Calculus Vol. 2 — 3.7 Tích phân suy rộng</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcII/ImproperIntegrals.aspx" target="_blank" rel="noopener">Paul's Online Notes — Tích phân suy rộng</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>∫ 1/(x<sup>2</sup> − 4) dx.</li><li>∫<sub>2</sub><sup>∞</sup> 3/x<sup>2</sup> dx.</li><li>Xấp xỉ ∫<sub>0</sub><sup>2</sup> x<sup>3</sup> dx bằng quy tắc hình thang và quy tắc Simpson, cả hai với n = 2. So với giá trị đúng.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 1/[(x − 2)(x + 2)] = (1/4)/(x − 2) − (1/4)/(x + 2) ⇒ (1/4) ln|(x − 2)/(x + 2)| + C. 2) lim [−3/x]<sub>2</sub><sup>b</sup> = 3/2. 3) h = 1, giá trị 0, 1, 8: T<sub>2</sub> = ½(0 + 2 + 8) = 5; S<sub>2</sub> = (1/3)(0 + 4 + 8) = 4; đúng bằng 4 (Simpson chính xác với đa thức bậc ba).</p></div>`);

const q6 = QZ(6, 'Quiz — Chapter 6: Techniques of integration|||Quiz — Chương 6: Kỹ thuật tính tích phân', 'Kiểm tra chương 6: đổi biến, từng phần, LIATE, tách phân thức, tích phân suy rộng, hình thang và Simpson.', [
  Q('q1', '∫ x(x² + 1)³ dx =|||∫ x(x² + 1)³ dx =',
    ['(x² + 1)⁴/4 + C|||(x² + 1)⁴/4 + C', '(x² + 1)⁴/8 + C|||(x² + 1)⁴/8 + C', 'x²(x² + 1)⁴/8 + C|||x²(x² + 1)⁴/8 + C', '3x(x² + 1)² + C|||3x(x² + 1)² + C'], 1,
    'u = x² + 1, x dx = du/2: ½·u⁴/4.|||u = x² + 1, x dx = du/2: ½·u⁴/4.'),
  Q('q2', '∫₀¹ 2x e^(x²) dx =|||∫₀¹ 2x e^(x²) dx =',
    ['e|||e', '2e|||2e', 'e − 1|||e − 1', '1|||1'], 2,
    'u = x², limits 0 → 1: ∫₀¹ eᵘ du = e − 1.|||u = x², cận 0 → 1: ∫₀¹ eᵘ du = e − 1.'),
  Q('q3', 'For ∫ x² ln x dx, LIATE says choose u =|||Với ∫ x² ln x dx, theo LIATE nên chọn u =',
    ['ln x|||ln x', 'x²|||x²', 'x² ln x|||x² ln x', 'dx|||dx'], 0,
    'Logarithms come first in LIATE; their derivative 1/x is simpler.|||Logarit đứng đầu LIATE; đạo hàm 1/x đơn giản hơn.'),
  Q('q4', '∫ x sin x dx =|||∫ x sin x dx =',
    ['−x cos x + C|||−x cos x + C', 'x cos x − sin x + C|||x cos x − sin x + C', 'sin x − x cos x + C|||sin x − x cos x + C', '(x²/2) sin x + C|||(x²/2) sin x + C'], 2,
    'u = x, v = −cos x: −x cos x + ∫ cos x dx.|||u = x, v = −cos x: −x cos x + ∫ cos x dx.'),
  Q('q5', '1/[x(x + 1)] decomposes as|||1/[x(x + 1)] tách thành',
    ['1/x + 1/(x + 1)|||1/x + 1/(x + 1)', '1/x − 1/(x + 1)|||1/x − 1/(x + 1)', '1/(x + 1) − 1/x|||1/(x + 1) − 1/x', '2/x − 1/(x + 1)|||2/x − 1/(x + 1)'], 1,
    'Cover-up: A = 1/(0 + 1) = 1, B = 1/(−1) = −1.|||Che: A = 1/(0 + 1) = 1, B = 1/(−1) = −1.'),
  Q('q6', '∫₁^∞ 1/[x(x + 1)] dx =|||∫₁^∞ 1/[x(x + 1)] dx =',
    ['1|||1', 'diverges|||phân kỳ', '1/2|||1/2', 'ln 2|||ln 2'], 3,
    'lim [ln(x/(x + 1))]₁ᵇ = 0 − ln(1/2) = ln 2.|||lim [ln(x/(x + 1))]₁ᵇ = 0 − ln(1/2) = ln 2.'),
  Q('q7', '∫₀^∞ e^(−2x) dx =|||∫₀^∞ e^(−2x) dx =',
    ['1/2|||1/2', '2|||2', 'diverges|||phân kỳ', '−1/2|||−1/2'], 0,
    'lim [−e^(−2x)/2]₀ᵇ = 0 + 1/2.|||lim [−e^(−2x)/2]₀ᵇ = 0 + 1/2.'),
  Q('q8', 'Which improper integral converges?|||Tích phân suy rộng nào hội tụ?',
    ['∫₁^∞ 1/x dx|||∫₁^∞ 1/x dx', '∫₁^∞ 1/√x dx|||∫₁^∞ 1/√x dx', '∫₁^∞ 1/x^1.5 dx|||∫₁^∞ 1/x^1.5 dx', '∫₁^∞ 1 dx|||∫₁^∞ 1 dx'], 2,
    'p-test: converges only for p > 1.|||Tiêu chuẩn p: chỉ hội tụ khi p > 1.'),
  Q('q9', 'Present value of 100 (million/year) forever at 5% continuous discounting:|||Giá trị hiện tại của 100 (triệu/năm) mãi mãi, chiết khấu liên tục 5%:',
    ['500|||500', '5000|||5000', '105|||105', '2000|||2000'], 3,
    '∫₀^∞ 100e^(−0.05t) dt = 100/0.05 = 2000.|||∫₀^∞ 100e^(−0.05t) dt = 100/0.05 = 2000.'),
  Q('q10', 'Simpson’s rule requires|||Quy tắc Simpson đòi hỏi',
    ['an even number of subintervals|||số đoạn con chẵn', 'an odd number of subintervals|||số đoạn con lẻ', 'f to be a polynomial|||f là đa thức', 'exactly 2 subintervals|||đúng 2 đoạn con'], 0,
    'It fits parabolas over pairs of subintervals, so n must be even.|||Nó khớp parabol trên từng cặp đoạn con nên n phải chẵn.'),
]);

const ch6 = {
  title: 'Chapter 6 — Techniques of integration|||Chương 6 — Kỹ thuật tính tích phân',
  description: 'Đổi biến, tích phân từng phần (LIATE, phương pháp bảng), tách phân thức, tích phân suy rộng (dòng tiền vĩnh viễn), quy tắc hình thang và Simpson có code Python (Stewart ch.5.5, 7 · OpenStax Vol.1 5.5, Vol.2 ch.3).',
  lessons: [c61, c62, c63, q6],
};


// ───────────────────────────── Chương 7 — Ứng dụng của tích phân ─────────────────────────────
const c71 = L('mac103-ts-7-1',
  '7.1 — Area between curves; consumer and producer surplus|||7.1 — Diện tích giữa hai đường cong; thặng dư tiêu dùng và thặng dư sản xuất',
  'Diện tích giữa hai đường = ∫(trên − dưới), tìm giao điểm, đường cắt nhau giữa khoảng; ứng dụng kinh tế: điểm cân bằng cung–cầu, thặng dư tiêu dùng và thặng dư sản xuất.',
  `<span class="eyebrow">MAC103 · Chapter 7 · Lesson 7.1</span>
<h2>Area between curves and economic surplus</h2>
<p class="lead">The area between two curves measures a <em>gap</em> accumulated over an interval: the gap between two cost plans, between revenue and cost, or — the classic economics application — between what buyers were <strong>willing</strong> to pay and what they <strong>actually</strong> paid. That last area is the <strong>consumer surplus</strong>.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute the area between two curves, finding the intersection points first.</li><li>Handle curves that cross inside the interval by splitting it.</li><li>Find the market equilibrium and compute consumer and producer surplus.</li></ul>
<h3>📖 Lecture</h3>
<p>Take thin vertical strips of width dx. A strip at x has height (top − bottom), so its area is [f(x) − g(x)] dx. Adding the strips gives an integral.</p>
<div class="formula"><span class="lbl">Area between curves</span>A = ∫<sub>a</sub><sup>b</sup> [f(x) − g(x)] dx    where f(x) ≥ g(x) on [a, b];    in general A = ∫<sub>a</sub><sup>b</sup> |f(x) − g(x)| dx</div>
<p><strong>Steps.</strong> (1) Sketch or tabulate to see which curve is on top. (2) Solve f(x) = g(x) for the intersection points — they are often the limits. (3) If the curves cross inside [a, b], split there and integrate (top − bottom) on each piece.</p>
<p><strong>Supply and demand.</strong> Let p = D(q) be the demand curve (the price at which buyers want q units, decreasing) and p = S(q) the supply curve (increasing). The <strong>equilibrium</strong> (q<sub>e</sub>, p<sub>e</sub>) solves D(q) = S(q).</p>
<div class="formula"><span class="lbl">Consumer surplus</span>CS = ∫<sub>0</sub><sup>q<sub>e</sub></sup> [D(q) − p<sub>e</sub>] dq    (area below demand, above the price)</div>
<div class="formula"><span class="lbl">Producer surplus</span>PS = ∫<sub>0</sub><sup>q<sub>e</sub></sup> [p<sub>e</sub> − S(q)] dq    (area above supply, below the price)</div>
<p>CS is the total amount buyers saved compared with their maximum willingness to pay; PS is the total extra that sellers received above their minimum acceptable price. CS + PS is the total welfare of the market.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> Area between y = 6 − x<sup>2</sup> and y = x. Intersections: 6 − x<sup>2</sup> = x ⇔ x<sup>2</sup> + x − 6 = 0 ⇔ x = −3 or x = 2. The parabola is on top (at x = 0: 6 &gt; 0). A = ∫<sub>−3</sub><sup>2</sup> (6 − x − x<sup>2</sup>) dx = [6x − x<sup>2</sup>/2 − x<sup>3</sup>/3]<sub>−3</sub><sup>2</sup> = 22/3 − (−27/2) = <b>125/6 ≈ 20.83</b>.</p></div>
<div class="callout"><p><b>Example 2 — curves that cross.</b> Area between y = x<sup>3</sup> and y = x on [−1, 1]. They meet at −1, 0, 1. On [0, 1], x ≥ x<sup>3</sup>; on [−1, 0], x<sup>3</sup> ≥ x. A = ∫<sub>−1</sub><sup>0</sup> (x<sup>3</sup> − x) dx + ∫<sub>0</sub><sup>1</sup> (x − x<sup>3</sup>) dx = 1/4 + 1/4 = <b>1/2</b>. (Integrating x<sup>3</sup> − x straight across gives 0 — wrong!)</p></div>
<div class="callout"><p><b>Example 3 — a market.</b> Demand p = 100 − 0.5q, supply p = 10 + q (p in thousand VND, q in units). Equilibrium: 100 − 0.5q = 10 + q ⇒ q<sub>e</sub> = 60, p<sub>e</sub> = 70.</p><p>CS = ∫<sub>0</sub><sup>60</sup> (100 − 0.5q − 70) dq = [30q − 0.25q<sup>2</sup>]<sub>0</sub><sup>60</sup> = 1800 − 900 = <b>900</b> thousand VND.</p><p>PS = ∫<sub>0</sub><sup>60</sup> (70 − 10 − q) dq = [60q − q<sup>2</sup>/2]<sub>0</sub><sup>60</sup> = 3600 − 1800 = <b>1 800</b> thousand VND. (Both are triangles here — check with ½·base·height.)</p></div>
<div class="callout"><p><b>Example 4 — nonlinear demand.</b> D(q) = 200 − 0.02q<sup>2</sup> and the market price is set at q = 50, so p = 200 − 50 = 150. CS = ∫<sub>0</sub><sup>50</sup> (50 − 0.02q<sup>2</sup>) dq = 2500 − 0.02·125 000/3 = <b>5000/3 ≈ 1 666.7</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Subtracting in the wrong order (bottom − top) and reporting a negative area.</li><li>Integrating across a crossing point without splitting, so the pieces cancel.</li><li>In surplus problems, using D(q) − S(q) instead of D(q) − p<sub>e</sub> (CS) and p<sub>e</sub> − S(q) (PS).</li><li>Forgetting units: CS has units of price × quantity, i.e. money.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>A = ∫ (top − bottom) dx between the intersection points.</li><li>Split the interval wherever the curves cross.</li><li>Equilibrium: D(q) = S(q).</li><li>CS = ∫<sub>0</sub><sup>q<sub>e</sub></sup> (D − p<sub>e</sub>), PS = ∫<sub>0</sub><sup>q<sub>e</sub></sup> (p<sub>e</sub> − S).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/6-1-areas-between-curves" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 6.1 Areas between Curves</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/AreaBetweenCurves.aspx" target="_blank" rel="noopener">Paul's Online Notes — Area Between Curves</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-3-the-definite-integral-and-its-applications/part-b-second-fundamental-theorem-areas-volumes/" target="_blank" rel="noopener">MIT OCW 18.01SC — Second Fundamental Theorem, Areas, Volumes</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the area between y = √x and y = x/2.</li><li>Find the area between y = 2x and y = x<sup>2</sup>.</li><li>Demand p = 80 − 2q, supply p = 20 + q. Find the equilibrium, CS and PS.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) √x = x/2 ⇒ x = 0 or 4; A = ∫<sub>0</sub><sup>4</sup> (√x − x/2) dx = 16/3 − 4 = 4/3. 2) Meet at 0 and 2; A = ∫<sub>0</sub><sup>2</sup> (2x − x<sup>2</sup>) dx = 4 − 8/3 = 4/3. 3) 80 − 2q = 20 + q ⇒ q<sub>e</sub> = 20, p<sub>e</sub> = 40. CS = ∫<sub>0</sub><sup>20</sup> (40 − 2q) dq = 400; PS = ∫<sub>0</sub><sup>20</sup> (20 − q) dq = 200.</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 7 · Bài 7.1</span>
<h2>Diện tích giữa hai đường cong và thặng dư kinh tế</h2>
<p class="lead">Diện tích giữa hai đường cong đo một <em>khoảng chênh</em> tích luỹ trên một khoảng: chênh lệch giữa hai phương án chi phí, giữa doanh thu và chi phí, hoặc — ứng dụng kinh điển của kinh tế học — giữa số tiền người mua <strong>sẵn lòng</strong> trả và số tiền họ <strong>thực sự</strong> trả. Diện tích sau cùng đó là <strong>thặng dư tiêu dùng</strong>.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính diện tích giữa hai đường cong, tìm giao điểm trước.</li><li>Xử lý trường hợp hai đường cắt nhau giữa khoảng bằng cách tách khoảng.</li><li>Tìm điểm cân bằng thị trường và tính thặng dư tiêu dùng, thặng dư sản xuất.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Cắt miền thành các dải đứng mỏng, rộng dx. Dải tại x có chiều cao (trên − dưới), nên diện tích là [f(x) − g(x)] dx. Cộng các dải ta được một tích phân.</p>
<div class="formula"><span class="lbl">Diện tích giữa hai đường</span>A = ∫<sub>a</sub><sup>b</sup> [f(x) − g(x)] dx    với f(x) ≥ g(x) trên [a, b];    tổng quát A = ∫<sub>a</sub><sup>b</sup> |f(x) − g(x)| dx</div>
<p><strong>Các bước.</strong> (1) Phác hình hoặc lập bảng để biết đường nào ở trên. (2) Giải f(x) = g(x) tìm giao điểm — thường chính là cận. (3) Nếu hai đường cắt nhau trong [a, b], tách tại đó và tích phân (trên − dưới) trên từng mảnh.</p>
<p><strong>Cung và cầu.</strong> Gọi p = D(q) là đường cầu (giá mà người mua chịu mua q đơn vị, giảm dần) và p = S(q) là đường cung (tăng dần). <strong>Điểm cân bằng</strong> (q<sub>e</sub>, p<sub>e</sub>) là nghiệm của D(q) = S(q).</p>
<div class="formula"><span class="lbl">Thặng dư tiêu dùng</span>CS = ∫<sub>0</sub><sup>q<sub>e</sub></sup> [D(q) − p<sub>e</sub>] dq    (dưới đường cầu, trên mức giá)</div>
<div class="formula"><span class="lbl">Thặng dư sản xuất</span>PS = ∫<sub>0</sub><sup>q<sub>e</sub></sup> [p<sub>e</sub> − S(q)] dq    (trên đường cung, dưới mức giá)</div>
<p>CS là tổng số tiền người mua tiết kiệm được so với mức sẵn lòng trả cao nhất; PS là tổng phần người bán nhận thêm so với giá tối thiểu họ chấp nhận. CS + PS là tổng phúc lợi của thị trường.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> Diện tích giữa y = 6 − x<sup>2</sup> và y = x. Giao điểm: 6 − x<sup>2</sup> = x ⇔ x<sup>2</sup> + x − 6 = 0 ⇔ x = −3 hoặc x = 2. Parabol ở trên (tại x = 0: 6 &gt; 0). A = ∫<sub>−3</sub><sup>2</sup> (6 − x − x<sup>2</sup>) dx = [6x − x<sup>2</sup>/2 − x<sup>3</sup>/3]<sub>−3</sub><sup>2</sup> = 22/3 − (−27/2) = <b>125/6 ≈ 20,83</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — hai đường cắt nhau.</b> Diện tích giữa y = x<sup>3</sup> và y = x trên [−1, 1]. Chúng gặp nhau tại −1, 0, 1. Trên [0, 1], x ≥ x<sup>3</sup>; trên [−1, 0], x<sup>3</sup> ≥ x. A = ∫<sub>−1</sub><sup>0</sup> (x<sup>3</sup> − x) dx + ∫<sub>0</sub><sup>1</sup> (x − x<sup>3</sup>) dx = 1/4 + 1/4 = <b>1/2</b>. (Tích phân thẳng x<sup>3</sup> − x trên cả khoảng ra 0 — sai!)</p></div>
<div class="callout"><p><b>Ví dụ 3 — một thị trường.</b> Cầu p = 100 − 0,5q, cung p = 10 + q (p tính bằng nghìn đồng, q là số sản phẩm). Cân bằng: 100 − 0,5q = 10 + q ⇒ q<sub>e</sub> = 60, p<sub>e</sub> = 70.</p><p>CS = ∫<sub>0</sub><sup>60</sup> (100 − 0,5q − 70) dq = [30q − 0,25q<sup>2</sup>]<sub>0</sub><sup>60</sup> = 1800 − 900 = <b>900</b> nghìn đồng.</p><p>PS = ∫<sub>0</sub><sup>60</sup> (70 − 10 − q) dq = [60q − q<sup>2</sup>/2]<sub>0</sub><sup>60</sup> = 3600 − 1800 = <b>1 800</b> nghìn đồng. (Ở đây cả hai là tam giác — kiểm bằng ½·đáy·cao.)</p></div>
<div class="callout"><p><b>Ví dụ 4 — cầu phi tuyến.</b> D(q) = 200 − 0,02q<sup>2</sup> và giá thị trường chốt tại q = 50, nên p = 200 − 50 = 150. CS = ∫<sub>0</sub><sup>50</sup> (50 − 0,02q<sup>2</sup>) dq = 2500 − 0,02·125 000/3 = <b>5000/3 ≈ 1 666,7</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Trừ ngược thứ tự (dưới − trên) rồi báo diện tích âm.</li><li>Tích phân qua điểm cắt mà không tách khoảng, khiến các mảnh triệt tiêu nhau.</li><li>Trong bài thặng dư, dùng D(q) − S(q) thay vì D(q) − p<sub>e</sub> (CS) và p<sub>e</sub> − S(q) (PS).</li><li>Quên đơn vị: CS có đơn vị giá × lượng, tức là tiền.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>A = ∫ (trên − dưới) dx giữa các giao điểm.</li><li>Tách khoảng ở mọi chỗ hai đường cắt nhau.</li><li>Cân bằng: D(q) = S(q).</li><li>CS = ∫<sub>0</sub><sup>q<sub>e</sub></sup> (D − p<sub>e</sub>), PS = ∫<sub>0</sub><sup>q<sub>e</sub></sup> (p<sub>e</sub> − S).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/6-1-areas-between-curves" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 6.1 Diện tích giữa hai đường cong</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/AreaBetweenCurves.aspx" target="_blank" rel="noopener">Paul's Online Notes — Diện tích giữa hai đường cong</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-3-the-definite-integral-and-its-applications/part-b-second-fundamental-theorem-areas-volumes/" target="_blank" rel="noopener">MIT OCW 18.01SC — Định lý cơ bản thứ hai, diện tích, thể tích</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm diện tích giữa y = √x và y = x/2.</li><li>Tìm diện tích giữa y = 2x và y = x<sup>2</sup>.</li><li>Cầu p = 80 − 2q, cung p = 20 + q. Tìm điểm cân bằng, CS và PS.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) √x = x/2 ⇒ x = 0 hoặc 4; A = ∫<sub>0</sub><sup>4</sup> (√x − x/2) dx = 16/3 − 4 = 4/3. 2) Gặp nhau tại 0 và 2; A = ∫<sub>0</sub><sup>2</sup> (2x − x<sup>2</sup>) dx = 4 − 8/3 = 4/3. 3) 80 − 2q = 20 + q ⇒ q<sub>e</sub> = 20, p<sub>e</sub> = 40. CS = ∫<sub>0</sub><sup>20</sup> (40 − 2q) dq = 400; PS = ∫<sub>0</sub><sup>20</sup> (20 − q) dq = 200.</p></div>`);

const c72 = L('mac103-ts-7-2',
  '7.2 — Volumes of revolution and the average value of a function|||7.2 — Thể tích vật thể tròn xoay và giá trị trung bình của hàm số',
  'Thể tích bằng lát cắt: phương pháp đĩa và vành khuyên khi quay quanh trục Ox; giá trị trung bình của hàm trên một đoạn và định lý giá trị trung bình cho tích phân; ví dụ người dùng hoạt động trung bình.',
  `<span class="eyebrow">MAC103 · Chapter 7 · Lesson 7.2</span>
<h2>Volumes of revolution and average value</h2>
<p class="lead">The same “slice and add” idea that gives areas also gives <strong>volumes</strong>: a 3-D printer builds a part layer by layer, and a CAD program computes its volume the same way. And dividing an integral by the length of the interval gives the <strong>average value</strong> of a quantity — average daily users, average price over a quarter.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute volumes of solids of revolution about the x-axis with the disk and washer methods.</li><li>Compute the average value of a function on an interval.</li><li>Use the Mean Value Theorem for integrals to find where the average is attained.</li></ul>
<h3>📖 Lecture</h3>
<p>Rotate the region under y = R(x) ≥ 0, a ≤ x ≤ b, about the x-axis. A slice at x is a thin disk of radius R(x) and thickness dx, with volume π[R(x)]<sup>2</sup> dx.</p>
<div class="formula"><span class="lbl">Disk method</span>V = π ∫<sub>a</sub><sup>b</sup> [R(x)]<sup>2</sup> dx</div>
<p>If the region lies between an outer curve R(x) and an inner curve r(x), each slice is a washer (a disk with a hole):</p>
<div class="formula"><span class="lbl">Washer method</span>V = π ∫<sub>a</sub><sup>b</sup> ([R(x)]<sup>2</sup> − [r(x)]<sup>2</sup>) dx</div>
<p><strong>Average value.</strong> The average of finitely many numbers is (sum)/(count). For a continuous function the “sum” becomes an integral and the “count” becomes the length of the interval:</p>
<div class="formula"><span class="lbl">Average value</span>f<sub>avg</sub> = (1/(b − a)) ∫<sub>a</sub><sup>b</sup> f(x) dx</div>
<div class="formula"><span class="lbl">Mean Value Theorem for integrals</span>If f is continuous on [a, b], there is c in [a, b] with f(c) = f<sub>avg</sub></div>
<p>Geometrically: the rectangle of height f<sub>avg</sub> over [a, b] has the same area as the region under f.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — disk.</b> Rotate the region under y = e<sup>x/2</sup>, 0 ≤ x ≤ 2, about the x-axis. R(x)<sup>2</sup> = e<sup>x</sup>, so V = π∫<sub>0</sub><sup>2</sup> e<sup>x</sup> dx = <b>π(e<sup>2</sup> − 1) ≈ 20.07</b> cubic units.</p></div>
<div class="callout"><p><b>Example 2 — washer.</b> Rotate the region between y = 2x and y = x<sup>2</sup> (they meet at x = 0 and x = 2) about the x-axis. On [0, 2], 2x ≥ x<sup>2</sup>, so R = 2x, r = x<sup>2</sup>. V = π∫<sub>0</sub><sup>2</sup> (4x<sup>2</sup> − x<sup>4</sup>) dx = π(32/3 − 32/5) = <b>64π/15 ≈ 13.40</b>.</p></div>
<div class="callout"><p><b>Example 3 — average daily active users.</b> In the first 10 days after a launch, daily active users follow N(t) = 1000 + 200t − 15t<sup>2</sup>. Average: (1/10)∫<sub>0</sub><sup>10</sup> N(t) dt = (1/10)[1000t + 100t<sup>2</sup> − 5t<sup>3</sup>]<sub>0</sub><sup>10</sup> = (1/10)(10 000 + 10 000 − 5 000) = <b>1 500 users</b>.</p><p>When is N exactly equal to its average? 1000 + 200c − 15c<sup>2</sup> = 1500 ⇔ 3c<sup>2</sup> − 40c + 100 = 0 ⇔ c = 10/3 or c = 10. So on day ≈ 3.33 (and again at day 10) the app had exactly its average audience.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Washer: writing π∫ (R − r)<sup>2</sup> dx instead of π∫ (R<sup>2</sup> − r<sup>2</sup>) dx.</li><li>Forgetting π, or squaring the function before identifying which curve is outer.</li><li>Average value: forgetting to divide by (b − a), or dividing by b only.</li><li>Confusing the average value of f with the average rate of change [f(b) − f(a)]/(b − a).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Disk: V = π∫ R<sup>2</sup> dx; washer: V = π∫ (R<sup>2</sup> − r<sup>2</sup>) dx.</li><li>Find the intersections first; they give the limits and tell you which curve is outer.</li><li>f<sub>avg</sub> = (1/(b − a))∫<sub>a</sub><sup>b</sup> f.</li><li>A continuous f actually attains its average at some c in [a, b].</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/6-2-determining-volumes-by-slicing" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 6.2 Determining Volumes by Slicing</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/VolumeWithRings.aspx" target="_blank" rel="noopener">Paul's Online Notes — Volumes of Solids of Revolution / Method of Rings</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/AvgFcnValue.aspx" target="_blank" rel="noopener">Paul's Online Notes — Average Function Value</a></li><li><a href="https://cuongthai.com/academy/courses/cal111-calculus-i" target="_blank" rel="noopener">CAL111 — Calculus I on CuongThai Academy (shells, arc length, work)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Rotate the region under y = 1/x, 1 ≤ x ≤ 3, about the x-axis. Find the volume.</li><li>Find the average value of f(x) = 3x<sup>2</sup> on [0, 2] and the point c where f(c) equals it.</li><li>Find the average value of e<sup>x</sup> on [0, ln 3].</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) V = π∫<sub>1</sub><sup>3</sup> x<sup>−2</sup> dx = π(1 − 1/3) = 2π/3 ≈ 2.09. 2) (1/2)∫<sub>0</sub><sup>2</sup> 3x<sup>2</sup> dx = (1/2)·8 = 4; 3c<sup>2</sup> = 4 ⇒ c = 2/√3 ≈ 1.155. 3) (1/ln 3)(e<sup>ln 3</sup> − 1) = 2/ln 3 ≈ 1.820.</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 7 · Bài 7.2</span>
<h2>Thể tích tròn xoay và giá trị trung bình</h2>
<p class="lead">Cùng ý tưởng “cắt lát rồi cộng” cho diện tích cũng cho ta <strong>thể tích</strong>: máy in 3D dựng chi tiết từng lớp một, và phần mềm CAD tính thể tích của nó cũng đúng cách đó. Còn chia một tích phân cho độ dài khoảng sẽ ra <strong>giá trị trung bình</strong> của một đại lượng — số người dùng trung bình mỗi ngày, giá trung bình trong một quý.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính thể tích vật thể tròn xoay quanh trục Ox bằng phương pháp đĩa và vành khuyên.</li><li>Tính giá trị trung bình của hàm trên một đoạn.</li><li>Dùng định lý giá trị trung bình cho tích phân để tìm nơi hàm đạt giá trị trung bình.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Quay miền dưới y = R(x) ≥ 0, a ≤ x ≤ b, quanh trục Ox. Lát cắt tại x là một đĩa mỏng bán kính R(x), dày dx, thể tích π[R(x)]<sup>2</sup> dx.</p>
<div class="formula"><span class="lbl">Phương pháp đĩa</span>V = π ∫<sub>a</sub><sup>b</sup> [R(x)]<sup>2</sup> dx</div>
<p>Nếu miền nằm giữa đường ngoài R(x) và đường trong r(x) thì mỗi lát là một vành khuyên (đĩa có lỗ):</p>
<div class="formula"><span class="lbl">Phương pháp vành khuyên</span>V = π ∫<sub>a</sub><sup>b</sup> ([R(x)]<sup>2</sup> − [r(x)]<sup>2</sup>) dx</div>
<p><strong>Giá trị trung bình.</strong> Trung bình của hữu hạn số là (tổng)/(số lượng). Với hàm liên tục, “tổng” trở thành tích phân và “số lượng” trở thành độ dài khoảng:</p>
<div class="formula"><span class="lbl">Giá trị trung bình</span>f<sub>tb</sub> = (1/(b − a)) ∫<sub>a</sub><sup>b</sup> f(x) dx</div>
<div class="formula"><span class="lbl">Định lý giá trị trung bình cho tích phân</span>Nếu f liên tục trên [a, b] thì tồn tại c thuộc [a, b] với f(c) = f<sub>tb</sub></div>
<p>Về hình học: hình chữ nhật cao f<sub>tb</sub> trên [a, b] có diện tích bằng diện tích miền dưới f.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — đĩa.</b> Quay miền dưới y = e<sup>x/2</sup>, 0 ≤ x ≤ 2, quanh trục Ox. R(x)<sup>2</sup> = e<sup>x</sup>, nên V = π∫<sub>0</sub><sup>2</sup> e<sup>x</sup> dx = <b>π(e<sup>2</sup> − 1) ≈ 20,07</b> đơn vị thể tích.</p></div>
<div class="callout"><p><b>Ví dụ 2 — vành khuyên.</b> Quay miền giữa y = 2x và y = x<sup>2</sup> (gặp nhau tại x = 0 và x = 2) quanh trục Ox. Trên [0, 2], 2x ≥ x<sup>2</sup>, nên R = 2x, r = x<sup>2</sup>. V = π∫<sub>0</sub><sup>2</sup> (4x<sup>2</sup> − x<sup>4</sup>) dx = π(32/3 − 32/5) = <b>64π/15 ≈ 13,40</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — người dùng hoạt động trung bình mỗi ngày.</b> Trong 10 ngày đầu sau ra mắt, số người dùng hoạt động theo N(t) = 1000 + 200t − 15t<sup>2</sup>. Trung bình: (1/10)∫<sub>0</sub><sup>10</sup> N(t) dt = (1/10)[1000t + 100t<sup>2</sup> − 5t<sup>3</sup>]<sub>0</sub><sup>10</sup> = (1/10)(10 000 + 10 000 − 5 000) = <b>1 500 người</b>.</p><p>Khi nào N đúng bằng mức trung bình? 1000 + 200c − 15c<sup>2</sup> = 1500 ⇔ 3c<sup>2</sup> − 40c + 100 = 0 ⇔ c = 10/3 hoặc c = 10. Vậy vào khoảng ngày thứ 3,33 (và lần nữa ở ngày 10) ứng dụng có đúng lượng người dùng trung bình.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Vành khuyên: viết π∫ (R − r)<sup>2</sup> dx thay vì π∫ (R<sup>2</sup> − r<sup>2</sup>) dx.</li><li>Quên π, hoặc bình phương trước khi xác định đường nào là đường ngoài.</li><li>Giá trị trung bình: quên chia (b − a), hoặc chỉ chia cho b.</li><li>Nhầm giá trị trung bình của f với tốc độ thay đổi trung bình [f(b) − f(a)]/(b − a).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Đĩa: V = π∫ R<sup>2</sup> dx; vành khuyên: V = π∫ (R<sup>2</sup> − r<sup>2</sup>) dx.</li><li>Tìm giao điểm trước; chúng cho cận và cho biết đường nào ở ngoài.</li><li>f<sub>tb</sub> = (1/(b − a))∫<sub>a</sub><sup>b</sup> f.</li><li>Hàm liên tục thực sự đạt giá trị trung bình tại một c nào đó trong [a, b].</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/6-2-determining-volumes-by-slicing" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 6.2 Tính thể tích bằng lát cắt</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/VolumeWithRings.aspx" target="_blank" rel="noopener">Paul's Online Notes — Thể tích tròn xoay / phương pháp vành khuyên</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/AvgFcnValue.aspx" target="_blank" rel="noopener">Paul's Online Notes — Giá trị trung bình của hàm</a></li><li><a href="https://cuongthai.com/academy/courses/cal111-calculus-i" target="_blank" rel="noopener">CAL111 — Giải tích I trên CuongThai Academy (vỏ trụ, độ dài cung, công)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Quay miền dưới y = 1/x, 1 ≤ x ≤ 3, quanh trục Ox. Tính thể tích.</li><li>Tìm giá trị trung bình của f(x) = 3x<sup>2</sup> trên [0, 2] và điểm c mà f(c) bằng giá trị đó.</li><li>Tìm giá trị trung bình của e<sup>x</sup> trên [0, ln 3].</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) V = π∫<sub>1</sub><sup>3</sup> x<sup>−2</sup> dx = π(1 − 1/3) = 2π/3 ≈ 2,09. 2) (1/2)∫<sub>0</sub><sup>2</sup> 3x<sup>2</sup> dx = (1/2)·8 = 4; 3c<sup>2</sup> = 4 ⇒ c = 2/√3 ≈ 1,155. 3) (1/ln 3)(e<sup>ln 3</sup> − 1) = 2/ln 3 ≈ 1,820.</p></div>`);

const c73 = L('mac103-ts-7-3',
  '7.3 — Money streams, probability densities and exponential growth|||7.3 — Dòng tiền liên tục, hàm mật độ xác suất và tăng trưởng mũ',
  'Giá trị hiện tại và tương lai của dòng thu nhập liên tục; hàm mật độ xác suất (đều, mũ), xác suất là diện tích, kỳ vọng là tích phân; phương trình vi phân y′ = ky, tách biến, thời gian nhân đôi.',
  `<span class="eyebrow">MAC103 · Chapter 7 · Lesson 7.3</span>
<h2>Money streams, probability and growth</h2>
<p class="lead">Three of the most practical uses of integrals for business and IT students: valuing a <strong>stream of income</strong> that arrives continuously, computing <strong>probabilities</strong> of continuous quantities (waiting times, delivery times), and modelling <strong>growth</strong> of users or money with the simplest differential equation y′ = ky.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute the present and future value of a continuous income stream.</li><li>Use a probability density function: check it, compute probabilities and the mean.</li><li>Solve y′ = ky by separating variables; compute growth rates and doubling times from data.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Income streams.</strong> If money arrives at rate R(t) per year for T years and is discounted continuously at rate r, the money received in [t, t + dt] is R(t)dt and is worth R(t)e<sup>−rt</sup>dt today.</p>
<div class="formula"><span class="lbl">Present / future value</span>PV = ∫<sub>0</sub><sup>T</sup> R(t) e<sup>−rt</sup> dt        FV = e<sup>rT</sup> · PV</div>
<p><strong>Probability densities.</strong> A continuous random variable X has a density f(x) ≥ 0 with ∫<sub>−∞</sub><sup>∞</sup> f(x) dx = 1. Probabilities are areas:</p>
<div class="formula"><span class="lbl">Probability and mean</span>P(a ≤ X ≤ b) = ∫<sub>a</sub><sup>b</sup> f(x) dx        μ = E[X] = ∫ x f(x) dx</div>
<p>Two models you will meet again in statistics: the <strong>uniform</strong> density f(x) = 1/(b − a) on [a, b] (mean (a + b)/2), and the <strong>exponential</strong> density f(t) = (1/μ)e<sup>−t/μ</sup>, t ≥ 0, for waiting times with mean μ; for it P(T ≤ s) = 1 − e<sup>−s/μ</sup>.</p>
<p><strong>Exponential growth.</strong> “The rate of change is proportional to the amount” is the equation dy/dt = ky. Separate the variables: dy/y = k dt ⇒ ln|y| = kt + C ⇒</p>
<div class="formula"><span class="lbl">Solution of y′ = ky</span>y(t) = y<sub>0</sub> e<sup>kt</sup>    (k &gt; 0 growth, k &lt; 0 decay);    doubling time = ln 2 / k</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — valuing a contract.</b> A software maintenance contract pays 600 million VND per year continuously for 5 years; the discount rate is 6%. PV = ∫<sub>0</sub><sup>5</sup> 600e<sup>−0.06t</sup> dt = 10 000(1 − e<sup>−0.3</sup>) ≈ <b>2 591.8 million VND</b>. Its future value after 5 years is e<sup>0.3</sup>·PV = 10 000(e<sup>0.3</sup> − 1) ≈ <b>3 498.6 million VND</b>. The nominal total 3 000 lies between them.</p></div>
<div class="callout"><p><b>Example 2 — waiting for customers.</b> The time between customer arrivals at a counter is exponential with mean 4 minutes: f(t) = (1/4)e<sup>−t/4</sup>. P(next customer within 2 min) = 1 − e<sup>−0.5</sup> ≈ <b>0.393</b>. P(wait longer than 8 min) = e<sup>−2</sup> ≈ <b>0.135</b>. And ∫<sub>0</sub><sup>∞</sup> t f(t) dt = 4 (by parts) confirms the mean.</p></div>
<div class="callout"><p><b>Example 3 — find the constant.</b> For which k is f(x) = kx(4 − x) on [0, 4] a density? ∫<sub>0</sub><sup>4</sup> (4x − x<sup>2</sup>) dx = 32 − 64/3 = 32/3, so <b>k = 3/32</b>. By symmetry the mean is 2. A uniform delivery time between 10 and 30 minutes has P(15 ≤ X ≤ 20) = 5/20 = <b>0.25</b>.</p></div>
<div class="callout"><p><b>Example 4 — user growth.</b> An app has 2 000 users and 3 000 four months later; assume y′ = ky. Then 3000 = 2000e<sup>4k</sup> ⇒ k = ln(1.5)/4 ≈ 0.1014 per month. After 10 months: 2000e<sup>10k</sup> = 2000·1.5<sup>2.5</sup> ≈ <b>5 511 users</b>. Doubling time: ln 2/k ≈ <b>6.84 months</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Adding income without discounting: 5 × 600 = 3 000 is neither the present nor the future value.</li><li>Treating f(x) as a probability: for continuous X, P(X = a) = 0; only areas are probabilities, and f can exceed 1.</li><li>Using the rate parameter instead of the mean: for mean μ the exponent is −t/μ.</li><li>Solving y′ = ky as y = kt + C (that solves y′ = k).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>PV = ∫<sub>0</sub><sup>T</sup> R(t)e<sup>−rt</sup> dt, FV = e<sup>rT</sup>PV; forever with constant R: PV = R/r.</li><li>Density: f ≥ 0, total area 1; probability = area; mean = ∫ x f(x) dx.</li><li>Exponential waiting time with mean μ: P(T ≤ s) = 1 − e<sup>−s/μ</sup>.</li><li>y′ = ky ⇒ y = y<sub>0</sub>e<sup>kt</sup>; doubling time ln 2/k.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-2/pages/2-8-exponential-growth-and-decay" target="_blank" rel="noopener">OpenStax Calculus Vol. 2 — 2.8 Exponential Growth and Decay</a></li><li><a href="https://openstax.org/books/calculus-volume-2/pages/4-1-basics-of-differential-equations" target="_blank" rel="noopener">OpenStax Calculus Vol. 2 — 4.1 Basics of Differential Equations</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-3-the-definite-integral-and-its-applications/part-c-average-value-probability-and-numerical-integration/" target="_blank" rel="noopener">MIT OCW 18.01SC — Average Value, Probability and Numerical Integration</a></li><li><a href="https://en.wikipedia.org/wiki/Compound_interest" target="_blank" rel="noopener">Wikipedia — Compound interest (continuous compounding)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Waiting time is exponential with mean 3 minutes. Find P(T ≤ 3).</li><li>A server's resale value decays by y′ = −0.2y (per year) from 50 million VND. Find its value after 3 years.</li><li>Find the present value of an income stream of 200 million VND/year for 4 years at 5% continuous discounting.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 1 − e<sup>−1</sup> ≈ 0.632. 2) 50e<sup>−0.6</sup> ≈ 27.44 million VND. 3) ∫<sub>0</sub><sup>4</sup> 200e<sup>−0.05t</sup> dt = 4000(1 − e<sup>−0.2</sup>) ≈ 725.08 million VND.</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 7 · Bài 7.3</span>
<h2>Dòng tiền, xác suất và tăng trưởng</h2>
<p class="lead">Ba ứng dụng thực tế nhất của tích phân với sinh viên kinh doanh và CNTT: định giá một <strong>dòng thu nhập</strong> chảy về liên tục, tính <strong>xác suất</strong> của đại lượng liên tục (thời gian chờ, thời gian giao hàng), và mô hình hoá <strong>tăng trưởng</strong> người dùng hay tiền bằng phương trình vi phân đơn giản nhất y′ = ky.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính giá trị hiện tại và giá trị tương lai của dòng thu nhập liên tục.</li><li>Dùng hàm mật độ xác suất: kiểm tra, tính xác suất và kỳ vọng.</li><li>Giải y′ = ky bằng tách biến; tính tốc độ tăng và thời gian nhân đôi từ dữ liệu.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Dòng thu nhập.</strong> Nếu tiền chảy về với tốc độ R(t) mỗi năm trong T năm và được chiết khấu liên tục với lãi suất r, thì phần tiền nhận trong [t, t + dt] là R(t)dt và có giá trị hôm nay R(t)e<sup>−rt</sup>dt.</p>
<div class="formula"><span class="lbl">Giá trị hiện tại / tương lai</span>PV = ∫<sub>0</sub><sup>T</sup> R(t) e<sup>−rt</sup> dt        FV = e<sup>rT</sup> · PV</div>
<p><strong>Hàm mật độ xác suất.</strong> Biến ngẫu nhiên liên tục X có mật độ f(x) ≥ 0 với ∫<sub>−∞</sub><sup>∞</sup> f(x) dx = 1. Xác suất là diện tích:</p>
<div class="formula"><span class="lbl">Xác suất và kỳ vọng</span>P(a ≤ X ≤ b) = ∫<sub>a</sub><sup>b</sup> f(x) dx        μ = E[X] = ∫ x f(x) dx</div>
<p>Hai mô hình bạn sẽ gặp lại ở môn xác suất thống kê: mật độ <strong>đều</strong> f(x) = 1/(b − a) trên [a, b] (kỳ vọng (a + b)/2), và mật độ <strong>mũ</strong> f(t) = (1/μ)e<sup>−t/μ</sup>, t ≥ 0, cho thời gian chờ có trung bình μ; với nó P(T ≤ s) = 1 − e<sup>−s/μ</sup>.</p>
<p><strong>Tăng trưởng mũ.</strong> “Tốc độ thay đổi tỉ lệ với lượng hiện có” chính là phương trình dy/dt = ky. Tách biến: dy/y = k dt ⇒ ln|y| = kt + C ⇒</p>
<div class="formula"><span class="lbl">Nghiệm của y′ = ky</span>y(t) = y<sub>0</sub> e<sup>kt</sup>    (k &gt; 0 tăng, k &lt; 0 giảm);    thời gian nhân đôi = ln 2 / k</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — định giá hợp đồng.</b> Một hợp đồng bảo trì phần mềm trả liên tục 600 triệu đồng/năm trong 5 năm; lãi suất chiết khấu 6%. PV = ∫<sub>0</sub><sup>5</sup> 600e<sup>−0,06t</sup> dt = 10 000(1 − e<sup>−0,3</sup>) ≈ <b>2 591,8 triệu đồng</b>. Giá trị tương lai sau 5 năm là e<sup>0,3</sup>·PV = 10 000(e<sup>0,3</sup> − 1) ≈ <b>3 498,6 triệu đồng</b>. Tổng danh nghĩa 3 000 nằm giữa hai số này.</p></div>
<div class="callout"><p><b>Ví dụ 2 — chờ khách.</b> Thời gian giữa hai lượt khách đến quầy có phân phối mũ với trung bình 4 phút: f(t) = (1/4)e<sup>−t/4</sup>. P(khách tiếp theo đến trong 2 phút) = 1 − e<sup>−0,5</sup> ≈ <b>0,393</b>. P(chờ quá 8 phút) = e<sup>−2</sup> ≈ <b>0,135</b>. Và ∫<sub>0</sub><sup>∞</sup> t f(t) dt = 4 (tích phân từng phần) xác nhận kỳ vọng.</p></div>
<div class="callout"><p><b>Ví dụ 3 — tìm hằng số.</b> Với k nào thì f(x) = kx(4 − x) trên [0, 4] là hàm mật độ? ∫<sub>0</sub><sup>4</sup> (4x − x<sup>2</sup>) dx = 32 − 64/3 = 32/3, nên <b>k = 3/32</b>. Do đối xứng, kỳ vọng bằng 2. Thời gian giao hàng phân phối đều từ 10 đến 30 phút có P(15 ≤ X ≤ 20) = 5/20 = <b>0,25</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4 — tăng trưởng người dùng.</b> Ứng dụng có 2 000 người dùng, bốn tháng sau có 3 000; giả sử y′ = ky. Khi đó 3000 = 2000e<sup>4k</sup> ⇒ k = ln(1,5)/4 ≈ 0,1014 mỗi tháng. Sau 10 tháng: 2000e<sup>10k</sup> = 2000·1,5<sup>2,5</sup> ≈ <b>5 511 người</b>. Thời gian nhân đôi: ln 2/k ≈ <b>6,84 tháng</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Cộng tiền mà không chiết khấu: 5 × 600 = 3 000 không phải giá trị hiện tại, cũng không phải giá trị tương lai.</li><li>Coi f(x) là xác suất: với X liên tục, P(X = a) = 0; chỉ diện tích mới là xác suất, và f có thể lớn hơn 1.</li><li>Dùng nhầm tham số: với trung bình μ thì số mũ là −t/μ.</li><li>Giải y′ = ky thành y = kt + C (đó là nghiệm của y′ = k).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>PV = ∫<sub>0</sub><sup>T</sup> R(t)e<sup>−rt</sup> dt, FV = e<sup>rT</sup>PV; vĩnh viễn với R không đổi: PV = R/r.</li><li>Mật độ: f ≥ 0, tổng diện tích bằng 1; xác suất = diện tích; kỳ vọng = ∫ x f(x) dx.</li><li>Thời gian chờ mũ với trung bình μ: P(T ≤ s) = 1 − e<sup>−s/μ</sup>.</li><li>y′ = ky ⇒ y = y<sub>0</sub>e<sup>kt</sup>; thời gian nhân đôi ln 2/k.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-2/pages/2-8-exponential-growth-and-decay" target="_blank" rel="noopener">OpenStax Calculus Vol. 2 — 2.8 Tăng trưởng và suy giảm mũ</a></li><li><a href="https://openstax.org/books/calculus-volume-2/pages/4-1-basics-of-differential-equations" target="_blank" rel="noopener">OpenStax Calculus Vol. 2 — 4.1 Cơ bản về phương trình vi phân</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-3-the-definite-integral-and-its-applications/part-c-average-value-probability-and-numerical-integration/" target="_blank" rel="noopener">MIT OCW 18.01SC — Giá trị trung bình, xác suất và tích phân số</a></li><li><a href="https://en.wikipedia.org/wiki/Compound_interest" target="_blank" rel="noopener">Wikipedia — Lãi kép (ghép lãi liên tục)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Thời gian chờ có phân phối mũ với trung bình 3 phút. Tìm P(T ≤ 3).</li><li>Giá trị bán lại của một máy chủ giảm theo y′ = −0,2y (theo năm), ban đầu 50 triệu đồng. Tìm giá trị sau 3 năm.</li><li>Tìm giá trị hiện tại của dòng thu nhập 200 triệu đồng/năm trong 4 năm, chiết khấu liên tục 5%.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 1 − e<sup>−1</sup> ≈ 0,632. 2) 50e<sup>−0,6</sup> ≈ 27,44 triệu đồng. 3) ∫<sub>0</sub><sup>4</sup> 200e<sup>−0,05t</sup> dt = 4000(1 − e<sup>−0,2</sup>) ≈ 725,08 triệu đồng.</p></div>`);

const q7 = QZ(7, 'Quiz — Chapter 7: Applications of integrals|||Quiz — Chương 7: Ứng dụng của tích phân', 'Kiểm tra chương 7: diện tích giữa hai đường, thặng dư tiêu dùng/sản xuất, thể tích đĩa/vành khuyên, giá trị trung bình, dòng tiền, mật độ xác suất, y′ = ky.', [
  Q('q1', 'Area between y = 2x and y = x² is|||Diện tích giữa y = 2x và y = x² bằng',
    ['4/3|||4/3', '8/3|||8/3', '4|||4', '2/3|||2/3'], 0,
    'They meet at 0 and 2; ∫₀² (2x − x²) dx = 4 − 8/3 = 4/3.|||Gặp nhau tại 0 và 2; ∫₀² (2x − x²) dx = 4 − 8/3 = 4/3.'),
  Q('q2', '∫₋₁¹ (x³ − x) dx = 0. The area between y = x³ and y = x on [−1, 1] is|||∫₋₁¹ (x³ − x) dx = 0. Diện tích giữa y = x³ và y = x trên [−1, 1] là',
    ['0|||0', '1/4|||1/4', '1/2|||1/2', '1|||1'], 2,
    'Split at 0: 1/4 + 1/4. Signed pieces cancel; areas do not.|||Tách tại 0: 1/4 + 1/4. Phần có dấu triệt tiêu; diện tích thì không.'),
  Q('q3', 'Demand p = 100 − 0.5q, supply p = 10 + q. The equilibrium is|||Cầu p = 100 − 0,5q, cung p = 10 + q. Điểm cân bằng là',
    ['q = 90, p = 55|||q = 90, p = 55', 'q = 60, p = 70|||q = 60, p = 70', 'q = 40, p = 80|||q = 40, p = 80', 'q = 60, p = 50|||q = 60, p = 50'], 1,
    '100 − 0.5q = 10 + q ⇒ 1.5q = 90.|||100 − 0,5q = 10 + q ⇒ 1,5q = 90.'),
  Q('q4', 'In that market the consumer surplus is|||Trong thị trường đó thặng dư tiêu dùng bằng',
    ['900|||900', '1800|||1800', '2700|||2700', '4200|||4200'], 0,
    '∫₀⁶⁰ (100 − 0.5q − 70) dq = 1800 − 900 = 900.|||∫₀⁶⁰ (100 − 0,5q − 70) dq = 1800 − 900 = 900.'),
  Q('q5', 'Rotating y = x, 0 ≤ x ≤ 3, about the x-axis gives volume|||Quay y = x, 0 ≤ x ≤ 3, quanh trục Ox được thể tích',
    ['3π|||3π', '27π|||27π', '9π|||9π', '9π/2|||9π/2'], 2,
    'π∫₀³ x² dx = 9π (a cone with r = h = 3: πr²h/3 = 9π).|||π∫₀³ x² dx = 9π (hình nón r = h = 3: πr²h/3 = 9π).'),
  Q('q6', 'Washer method for outer R and inner r:|||Phương pháp vành khuyên với bán kính ngoài R, trong r:',
    ['π∫ (R − r)² dx|||π∫ (R − r)² dx', 'π∫ (R − r) dx|||π∫ (R − r) dx', '2π∫ Rr dx|||2π∫ Rr dx', 'π∫ (R² − r²) dx|||π∫ (R² − r²) dx'], 3,
    'Area of a washer = πR² − πr².|||Diện tích vành khuyên = πR² − πr².'),
  Q('q7', 'Average value of f(x) = x² on [0, 3]:|||Giá trị trung bình của f(x) = x² trên [0, 3]:',
    ['9|||9', '3|||3', '4.5|||4,5', '1|||1'], 1,
    '(1/3)∫₀³ x² dx = (1/3)·9 = 3.|||(1/3)∫₀³ x² dx = (1/3)·9 = 3.'),
  Q('q8', 'Waiting time is exponential with mean 4 min. P(T > 8) =|||Thời gian chờ phân phối mũ, trung bình 4 phút. P(T > 8) =',
    ['e⁻²|||e⁻²', '1 − e⁻²|||1 − e⁻²', '1/2|||1/2', 'e⁻⁸|||e⁻⁸'], 0,
    '∫₈^∞ (1/4)e^(−t/4) dt = e^(−8/4).|||∫₈^∞ (1/4)e^(−t/4) dt = e^(−8/4).'),
  Q('q9', 'Money grows by y′ = 0.07y. The doubling time is about|||Tiền tăng theo y′ = 0,07y. Thời gian nhân đôi xấp xỉ',
    ['7 years|||7 năm', '14.3 years|||14,3 năm', '9.9 years|||9,9 năm', '0.7 years|||0,7 năm'], 2,
    'ln 2/0.07 ≈ 9.90 (the “rule of 70”).|||ln 2/0,07 ≈ 9,90 (“quy tắc 70”).'),
  Q('q10', 'The present value of a continuous income stream R(t) over [0, T] at rate r is|||Giá trị hiện tại của dòng thu nhập liên tục R(t) trên [0, T] với lãi suất r là',
    ['∫₀ᵀ R(t) dt|||∫₀ᵀ R(t) dt', 'e^(rT)∫₀ᵀ R(t) dt|||e^(rT)∫₀ᵀ R(t) dt', '∫₀ᵀ R(t)e^(rt) dt|||∫₀ᵀ R(t)e^(rt) dt', '∫₀ᵀ R(t)e^(−rt) dt|||∫₀ᵀ R(t)e^(−rt) dt'], 3,
    'Each R(t)dt received at time t is discounted by e^(−rt).|||Mỗi phần R(t)dt nhận ở thời điểm t được chiết khấu bởi e^(−rt).'),
]);

const ch7 = {
  title: 'Chapter 7 — Applications of integrals|||Chương 7 — Ứng dụng của tích phân',
  description: 'Diện tích giữa hai đường cong, thặng dư tiêu dùng và sản xuất, thể tích đĩa/vành khuyên, giá trị trung bình, dòng tiền liên tục (PV/FV), hàm mật độ xác suất, tăng trưởng mũ y′ = ky (Stewart ch.6, 8.4–8.5, 9.4 · OpenStax Vol.1 ch.6, Vol.2 2.8, 4.1).',
  lessons: [c71, c72, c73, q7],
};

// ───────────────────────────── Chương 8 — Dãy số & chuỗi số ─────────────────────────────
const c81 = L('mac103-ts-8-1',
  '8.1 — Sequences: explicit and recursive formulas, limits, loan balances|||8.1 — Dãy số: công thức tường minh, truy hồi, giới hạn, dư nợ khoản vay',
  'Dãy số tường minh và truy hồi; giới hạn của dãy (bậc cao nhất, rⁿ, (1 + 1/n)ⁿ → e); dãy đơn điệu bị chặn thì hội tụ; mô hình dư nợ vay trả góp hằng tháng.',
  `<span class="eyebrow">MAC103 · Chapter 8 · Lesson 8.1</span>
<h2>Sequences: explicit and recursive formulas, limits</h2>
<p class="lead">A sequence is a function whose inputs are the whole numbers 1, 2, 3, … . Monthly loan balances, yearly sales, the steps of an algorithm and the iterations of a machine-learning optimiser are all sequences. The key question is always the same: <em>where does the sequence go in the long run?</em></p>
<h3>🎯 Objectives</h3>
<ul><li>Read and write a sequence explicitly (a<sub>n</sub> = formula in n) and recursively (a<sub>n</sub> from a<sub>n−1</sub>).</li><li>Compute limits of sequences with the “highest power” rule and the standard limits rⁿ and (1 + 1/n)ⁿ.</li><li>Use “monotone and bounded ⇒ convergent” to find the limit of a recursive sequence.</li><li>Model a monthly loan balance as a recursive sequence and solve it.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>sequence</strong> {a<sub>n</sub>} lists numbers a<sub>1</sub>, a<sub>2</sub>, a<sub>3</sub>, … . It can be given <strong>explicitly</strong>, e.g. a<sub>n</sub> = (4n<sup>2</sup> − n)/(2n<sup>2</sup> + 7), or <strong>recursively</strong>, e.g. a<sub>1</sub> = 0, a<sub>n+1</sub> = √(6 + a<sub>n</sub>), where each term is computed from the previous one — exactly how a loop in a program works.</p>
<div class="formula"><span class="lbl">Limit of a sequence</span>lim<sub>n→∞</sub> a<sub>n</sub> = L  means a<sub>n</sub> gets as close to L as we like for all large n. If L exists the sequence <b>converges</b>; otherwise it <b>diverges</b>.</div>
<p>Because n → ∞, all the techniques for limits at infinity (Chapter 2) apply: divide by the highest power of n. Three standard results are worth memorising:</p>
<div class="formula"><span class="lbl">Standard limits</span>rⁿ → 0 if |r| &lt; 1;  rⁿ → ∞ if r &gt; 1;  (1 + 1/n)ⁿ → e ≈ 2.71828;  n/2ⁿ → 0 (exponentials beat powers)</div>
<div class="formula"><span class="lbl">Monotone convergence theorem</span>If {a<sub>n</sub>} is increasing and bounded above (or decreasing and bounded below), then it converges.</div>
<p>For a convergent recursive sequence a<sub>n+1</sub> = g(a<sub>n</sub>), take limits on both sides: the limit L must satisfy <b>L = g(L)</b>.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — highest power.</b> a<sub>n</sub> = (4n<sup>2</sup> − n)/(2n<sup>2</sup> + 7). Divide top and bottom by n<sup>2</sup>: (4 − 1/n)/(2 + 7/n<sup>2</sup>) → 4/2 = <b>2</b>.</p></div>
<div class="callout"><p><b>Example 2 — recursive sequence.</b> a<sub>1</sub> = 0, a<sub>n+1</sub> = √(6 + a<sub>n</sub>). Terms: 0, 2.449, 2.907, 2.984, 2.997, … The sequence is increasing and stays below 3, so it converges. Its limit solves L = √(6 + L) ⇒ L<sup>2</sup> − L − 6 = 0 ⇒ (L − 3)(L + 2) = 0. Since every term is ≥ 0, <b>L = 3</b>.</p></div>
<div class="callout"><p><b>Example 3 — a loan as a sequence.</b> You borrow 100 million VND at 1% interest per month and repay 5 million at the end of each month. With B<sub>0</sub> = 100 the balance obeys B<sub>n</sub> = 1.01·B<sub>n−1</sub> − 5. The fixed point of x = 1.01x − 5 is x = 500, so B<sub>n</sub> − 500 = 1.01ⁿ(B<sub>0</sub> − 500), i.e. <b>B<sub>n</sub> = 500 − 400·1.01ⁿ</b>. The loan is cleared when 1.01ⁿ ≥ 1.25 ⇒ n ≥ ln 1.25 / ln 1.01 ≈ 22.4, i.e. in <b>23 months</b> (B<sub>22</sub> ≈ 2.11 million is still owed; month 23 needs only a partial payment).</p></div>
<div class="callout"><p><b>Example 4 — divergence.</b> a<sub>n</sub> = (−1)ⁿ jumps between −1 and 1 and never settles: it diverges, although it is bounded. Bounded alone is not enough — you also need monotone.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Solving L = g(L) without first checking that the sequence converges — the equation may have a solution even when the sequence diverges.</li><li>Keeping a negative root such as L = −2 when all terms are positive.</li><li>Confusing the sequence {a<sub>n</sub>} (a list) with the series ∑a<sub>n</sub> (a sum) — that is the next lesson.</li><li>Thinking that “bounded” implies “convergent”.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Sequences can be explicit (formula in n) or recursive (from the previous term).</li><li>Limits at infinity: divide by the highest power; rⁿ → 0 when |r| &lt; 1.</li><li>(1 + 1/n)ⁿ → e links sequences to continuous compounding.</li><li>Monotone + bounded ⇒ convergent; the limit satisfies L = g(L).</li><li>Loans and savings are linear recursions a<sub>n</sub> = r·a<sub>n−1</sub> + c with closed form via the fixed point.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-2/pages/5-1-sequences" target="_blank" rel="noopener">OpenStax Calculus Vol. 2 — 5.1 Sequences</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcII/Sequences.aspx" target="_blank" rel="noopener">Paul's Online Notes — Sequences</a></li><li><a href="https://en.wikipedia.org/wiki/Compound_interest" target="_blank" rel="noopener">Wikipedia — Compound interest (and the limit that gives e)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find lim<sub>n→∞</sub> (5n<sup>3</sup> + 2)/(n<sup>3</sup> − 4n).</li><li>Does a<sub>n</sub> = 9·(2/3)ⁿ converge? To what?</li><li>a<sub>1</sub> = 0, a<sub>n+1</sub> = 0.5·a<sub>n</sub> + 4. Assuming it converges, find its limit.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Divide by n<sup>3</sup>: (5 + 2/n<sup>3</sup>)/(1 − 4/n<sup>2</sup>) → <b>5</b>. 2) |2/3| &lt; 1 so (2/3)ⁿ → 0 and a<sub>n</sub> → <b>0</b>. 3) L = 0.5L + 4 ⇒ <b>L = 8</b> (terms 0, 4, 6, 7, 7.5, … increase towards 8).</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 8 · Bài 8.1</span>
<h2>Dãy số: công thức tường minh, truy hồi và giới hạn</h2>
<p class="lead">Dãy số là một hàm có đầu vào là các số tự nhiên 1, 2, 3, … . Dư nợ hằng tháng, doanh số từng năm, các bước của một thuật toán hay các vòng lặp của bộ tối ưu trong học máy đều là dãy số. Câu hỏi then chốt luôn giống nhau: <em>về lâu dài dãy đi về đâu?</em></p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Đọc và viết dãy ở dạng tường minh (a<sub>n</sub> = công thức theo n) và dạng truy hồi (a<sub>n</sub> tính từ a<sub>n−1</sub>).</li><li>Tính giới hạn dãy bằng quy tắc “bậc cao nhất” và các giới hạn chuẩn rⁿ, (1 + 1/n)ⁿ.</li><li>Dùng “đơn điệu và bị chặn ⇒ hội tụ” để tìm giới hạn của dãy truy hồi.</li><li>Mô hình hoá dư nợ vay trả góp hằng tháng bằng dãy truy hồi và giải nó.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Dãy số</strong> {a<sub>n</sub>} liệt kê các số a<sub>1</sub>, a<sub>2</sub>, a<sub>3</sub>, … . Dãy có thể cho <strong>tường minh</strong>, ví dụ a<sub>n</sub> = (4n<sup>2</sup> − n)/(2n<sup>2</sup> + 7), hoặc <strong>truy hồi</strong>, ví dụ a<sub>1</sub> = 0, a<sub>n+1</sub> = √(6 + a<sub>n</sub>): mỗi số hạng tính từ số hạng trước — đúng như một vòng lặp trong chương trình.</p>
<div class="formula"><span class="lbl">Giới hạn của dãy</span>lim<sub>n→∞</sub> a<sub>n</sub> = L  nghĩa là a<sub>n</sub> gần L tuỳ ý với mọi n đủ lớn. Nếu L tồn tại thì dãy <b>hội tụ</b>; ngược lại dãy <b>phân kỳ</b>.</div>
<p>Vì n → ∞ nên mọi kỹ thuật giới hạn tại vô cực (Chương 2) đều dùng được: chia cho luỹ thừa cao nhất của n. Ba kết quả chuẩn nên thuộc:</p>
<div class="formula"><span class="lbl">Giới hạn chuẩn</span>rⁿ → 0 nếu |r| &lt; 1;  rⁿ → ∞ nếu r &gt; 1;  (1 + 1/n)ⁿ → e ≈ 2,71828;  n/2ⁿ → 0 (hàm mũ thắng hàm luỹ thừa)</div>
<div class="formula"><span class="lbl">Định lý dãy đơn điệu</span>Nếu {a<sub>n</sub>} tăng và bị chặn trên (hoặc giảm và bị chặn dưới) thì dãy hội tụ.</div>
<p>Với dãy truy hồi hội tụ a<sub>n+1</sub> = g(a<sub>n</sub>), lấy giới hạn hai vế: giới hạn L phải thoả <b>L = g(L)</b>.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — bậc cao nhất.</b> a<sub>n</sub> = (4n<sup>2</sup> − n)/(2n<sup>2</sup> + 7). Chia tử và mẫu cho n<sup>2</sup>: (4 − 1/n)/(2 + 7/n<sup>2</sup>) → 4/2 = <b>2</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — dãy truy hồi.</b> a<sub>1</sub> = 0, a<sub>n+1</sub> = √(6 + a<sub>n</sub>). Các số hạng: 0; 2,449; 2,907; 2,984; 2,997; … Dãy tăng và luôn nhỏ hơn 3 nên hội tụ. Giới hạn thoả L = √(6 + L) ⇒ L<sup>2</sup> − L − 6 = 0 ⇒ (L − 3)(L + 2) = 0. Vì mọi số hạng ≥ 0 nên <b>L = 3</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — khoản vay là một dãy.</b> Bạn vay 100 triệu đồng, lãi 1%/tháng, cuối mỗi tháng trả 5 triệu. Với B<sub>0</sub> = 100, dư nợ thoả B<sub>n</sub> = 1,01·B<sub>n−1</sub> − 5. Điểm bất động của x = 1,01x − 5 là x = 500, nên B<sub>n</sub> − 500 = 1,01ⁿ(B<sub>0</sub> − 500), tức <b>B<sub>n</sub> = 500 − 400·1,01ⁿ</b>. Trả hết nợ khi 1,01ⁿ ≥ 1,25 ⇒ n ≥ ln 1,25 / ln 1,01 ≈ 22,4, tức sau <b>23 tháng</b> (sau tháng 22 vẫn còn nợ B<sub>22</sub> ≈ 2,11 triệu; tháng 23 chỉ cần trả một phần).</p></div>
<div class="callout"><p><b>Ví dụ 4 — phân kỳ.</b> a<sub>n</sub> = (−1)ⁿ nhảy qua lại giữa −1 và 1, không bao giờ ổn định: dãy phân kỳ dù bị chặn. Chỉ bị chặn thôi là chưa đủ — còn phải đơn điệu.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Giải L = g(L) mà chưa kiểm dãy có hội tụ không — phương trình vẫn có nghiệm ngay cả khi dãy phân kỳ.</li><li>Giữ nghiệm âm như L = −2 trong khi mọi số hạng đều dương.</li><li>Nhầm dãy {a<sub>n</sub>} (một danh sách) với chuỗi ∑a<sub>n</sub> (một tổng) — đó là bài sau.</li><li>Nghĩ rằng “bị chặn” thì “hội tụ”.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Dãy cho dạng tường minh (công thức theo n) hoặc truy hồi (từ số hạng trước).</li><li>Giới hạn tại vô cực: chia cho bậc cao nhất; rⁿ → 0 khi |r| &lt; 1.</li><li>(1 + 1/n)ⁿ → e nối dãy số với lãi kép liên tục.</li><li>Đơn điệu + bị chặn ⇒ hội tụ; giới hạn thoả L = g(L).</li><li>Khoản vay, tiết kiệm là truy hồi tuyến tính a<sub>n</sub> = r·a<sub>n−1</sub> + c, giải bằng điểm bất động.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-2/pages/5-1-sequences" target="_blank" rel="noopener">OpenStax Calculus Vol. 2 — 5.1 Dãy số</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcII/Sequences.aspx" target="_blank" rel="noopener">Paul's Online Notes — Dãy số</a></li><li><a href="https://en.wikipedia.org/wiki/Compound_interest" target="_blank" rel="noopener">Wikipedia — Lãi kép (và giới hạn sinh ra số e)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm lim<sub>n→∞</sub> (5n<sup>3</sup> + 2)/(n<sup>3</sup> − 4n).</li><li>Dãy a<sub>n</sub> = 9·(2/3)ⁿ có hội tụ không? Về đâu?</li><li>a<sub>1</sub> = 0, a<sub>n+1</sub> = 0,5·a<sub>n</sub> + 4. Giả sử dãy hội tụ, tìm giới hạn.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Chia cho n<sup>3</sup>: (5 + 2/n<sup>3</sup>)/(1 − 4/n<sup>2</sup>) → <b>5</b>. 2) |2/3| &lt; 1 nên (2/3)ⁿ → 0 và a<sub>n</sub> → <b>0</b>. 3) L = 0,5L + 4 ⇒ <b>L = 8</b> (các số hạng 0, 4, 6, 7, 7,5, … tăng dần về 8).</p></div>`);

const c82 = L('mac103-ts-8-2',
  '8.2 — Infinite series: geometric series, multiplier effect, convergence tests|||8.2 — Chuỗi số: chuỗi hình học, hiệu ứng số nhân, các tiêu chuẩn hội tụ',
  'Tổng riêng phần; chuỗi lồng nhau (telescoping); chuỗi hình học và ứng dụng (số nhân chi tiêu, niên kim vĩnh viễn, số thập phân tuần hoàn); tiêu chuẩn phân kỳ; chuỗi điều hoà, p-chuỗi; tiêu chuẩn tích phân và so sánh.',
  `<span class="eyebrow">MAC103 · Chapter 8 · Lesson 8.2</span>
<h2>Infinite series and the geometric series</h2>
<p class="lead">Can you add infinitely many numbers and get a finite answer? Yes — if the partial sums settle down. Economists use this to price a bond that pays forever, and to compute how one government payment ripples through the whole economy.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define a series through its partial sums S<sub>N</sub>.</li><li>Sum geometric and telescoping series exactly.</li><li>Apply the divergence test, the p-series rule and the comparison and integral tests.</li><li>Solve finance problems: multiplier effect, perpetuities, repeating decimals.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>series</strong> ∑<sub>n=1</sub><sup>∞</sup> a<sub>n</sub> is the limit of its <strong>partial sums</strong> S<sub>N</sub> = a<sub>1</sub> + a<sub>2</sub> + … + a<sub>N</sub>. If S<sub>N</sub> → S, the series <b>converges</b> with sum S; otherwise it <b>diverges</b>.</p>
<div class="formula"><span class="lbl">Geometric series</span>∑<sub>n=0</sub><sup>∞</sup> a·rⁿ = a + ar + ar<sup>2</sup> + … = a/(1 − r)  if |r| &lt; 1;  diverges if |r| ≥ 1</div>
<p>Reason: S<sub>N</sub> = a(1 − r<sup>N+1</sup>)/(1 − r) and r<sup>N+1</sup> → 0 when |r| &lt; 1. In words: <b>sum = first term / (1 − ratio)</b>.</p>
<div class="formula"><span class="lbl">Divergence test</span>If a<sub>n</sub> does not tend to 0, then ∑a<sub>n</sub> diverges.  (If a<sub>n</sub> → 0 the test says nothing.)</div>
<div class="formula"><span class="lbl">p-series</span>∑ 1/n<sup>p</sup> converges if p &gt; 1 and diverges if p ≤ 1.  The harmonic series ∑ 1/n (p = 1) diverges.</div>
<p><strong>Integral test</strong> (brief): if f is positive and decreasing with f(n) = a<sub>n</sub>, then ∑a<sub>n</sub> and ∫<sub>1</sub><sup>∞</sup> f(x) dx converge or diverge together — this is how the p-series rule is proved. <strong>Comparison test</strong>: if 0 ≤ a<sub>n</sub> ≤ b<sub>n</sub> and ∑b<sub>n</sub> converges, so does ∑a<sub>n</sub>; if a<sub>n</sub> ≥ b<sub>n</sub> ≥ 0 and ∑b<sub>n</sub> diverges, so does ∑a<sub>n</sub>.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — multiplier effect.</b> The government spends 10 billion VND. People spend 80% of every extra income (marginal propensity to consume 0.8), so spending rounds are 10, 8, 6.4, … Total = 10/(1 − 0.8) = <b>50 billion</b> — a multiplier of 5.</p></div>
<div class="callout"><p><b>Example 2 — a perpetuity.</b> A share pays 12 million VND every year forever; the discount rate is 8%. Present value = ∑<sub>n=1</sub><sup>∞</sup> 12/1.08ⁿ, geometric with first term 12/1.08 and ratio 1/1.08: PV = (12/1.08)/(1 − 1/1.08) = 12/0.08 = <b>150 million</b>.</p></div>
<div class="callout"><p><b>Example 3 — telescoping.</b> 1/(n(n + 1)) = 1/n − 1/(n + 1), so S<sub>N</sub> = 1 − 1/(N + 1) → <b>1</b>. Repeating decimal: 0.272727… = 0.27 + 0.0027 + … = 0.27/(1 − 0.01) = 27/99 = <b>3/11</b>.</p></div>
<div class="callout"><p><b>Example 4 — tests.</b> ∑ n/(3n + 1): terms → 1/3 ≠ 0, so it <b>diverges</b>. ∑ 1/n<sup>1.5</sup>: p = 1.5 &gt; 1, converges (indeed ∫<sub>1</sub><sup>∞</sup> x<sup>−1.5</sup> dx = 2 is finite). ∑ 1/(n<sup>2</sup> + 5) ≤ ∑ 1/n<sup>2</sup> = π<sup>2</sup>/6, so it <b>converges</b> by comparison.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>“a<sub>n</sub> → 0, so the series converges” — false: the harmonic series ∑1/n has a<sub>n</sub> → 0 but diverges.</li><li>Using a/(1 − r) when |r| ≥ 1, or forgetting that the formula needs the <em>first</em> term (watch whether n starts at 0 or 1).</li><li>Comparing in the wrong direction: “smaller than a divergent series” proves nothing.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>A series converges when its partial sums converge.</li><li>Geometric: sum = first term/(1 − r), only for |r| &lt; 1.</li><li>Terms not → 0 ⇒ divergence; terms → 0 ⇒ test further.</li><li>p-series converge exactly when p &gt; 1; harmonic diverges.</li><li>Finance: multiplier = 1/(1 − MPC); perpetuity PV = payment/rate.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-2/pages/5-2-infinite-series" target="_blank" rel="noopener">OpenStax Calculus Vol. 2 — 5.2 Infinite Series</a></li><li><a href="https://openstax.org/books/calculus-volume-2/pages/5-3-the-divergence-and-integral-tests" target="_blank" rel="noopener">OpenStax — 5.3 The Divergence and Integral Tests</a></li><li><a href="https://openstax.org/books/calculus-volume-2/pages/5-4-comparison-tests" target="_blank" rel="noopener">OpenStax — 5.4 Comparison Tests</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcII/Series_Special.aspx" target="_blank" rel="noopener">Paul's Online Notes — Special Series (geometric, telescoping, harmonic)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Sum ∑<sub>n=1</sub><sup>∞</sup> 5·(−2/3)<sup>n−1</sup>.</li><li>Does ∑ (n<sup>2</sup> + 1)/(2n<sup>2</sup>) converge?</li><li>Does ∑ 3/(n<sup>3</sup> + 1) converge? Justify.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) First term 5, r = −2/3 (|r| &lt; 1): 5/(1 + 2/3) = <b>3</b>. 2) Terms → 1/2 ≠ 0 ⇒ <b>diverges</b>. 3) 0 &lt; 3/(n<sup>3</sup> + 1) &lt; 3/n<sup>3</sup> and ∑3/n<sup>3</sup> converges (p = 3) ⇒ <b>converges</b>.</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 8 · Bài 8.2</span>
<h2>Chuỗi số và chuỗi hình học</h2>
<p class="lead">Cộng vô hạn số có ra một kết quả hữu hạn không? Có — nếu các tổng riêng phần ổn định dần. Nhà kinh tế dùng điều này để định giá một khoản trả tiền mãi mãi, và để tính một khoản chi của chính phủ lan toả ra cả nền kinh tế lớn tới đâu.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa chuỗi qua tổng riêng phần S<sub>N</sub>.</li><li>Tính đúng tổng chuỗi hình học và chuỗi lồng nhau.</li><li>Áp dụng tiêu chuẩn phân kỳ, quy tắc p-chuỗi, tiêu chuẩn so sánh và tích phân.</li><li>Giải bài toán tài chính: hiệu ứng số nhân, niên kim vĩnh viễn, số thập phân tuần hoàn.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Chuỗi</strong> ∑<sub>n=1</sub><sup>∞</sup> a<sub>n</sub> là giới hạn của các <strong>tổng riêng phần</strong> S<sub>N</sub> = a<sub>1</sub> + a<sub>2</sub> + … + a<sub>N</sub>. Nếu S<sub>N</sub> → S thì chuỗi <b>hội tụ</b> với tổng S; ngược lại chuỗi <b>phân kỳ</b>.</p>
<div class="formula"><span class="lbl">Chuỗi hình học</span>∑<sub>n=0</sub><sup>∞</sup> a·rⁿ = a + ar + ar<sup>2</sup> + … = a/(1 − r)  nếu |r| &lt; 1;  phân kỳ nếu |r| ≥ 1</div>
<p>Lý do: S<sub>N</sub> = a(1 − r<sup>N+1</sup>)/(1 − r) và r<sup>N+1</sup> → 0 khi |r| &lt; 1. Nói gọn: <b>tổng = số hạng đầu / (1 − công bội)</b>.</p>
<div class="formula"><span class="lbl">Tiêu chuẩn phân kỳ</span>Nếu a<sub>n</sub> không tiến về 0 thì ∑a<sub>n</sub> phân kỳ.  (Nếu a<sub>n</sub> → 0 thì tiêu chuẩn không kết luận được gì.)</div>
<div class="formula"><span class="lbl">p-chuỗi</span>∑ 1/n<sup>p</sup> hội tụ nếu p &gt; 1 và phân kỳ nếu p ≤ 1.  Chuỗi điều hoà ∑ 1/n (p = 1) phân kỳ.</div>
<p><strong>Tiêu chuẩn tích phân</strong> (sơ lược): nếu f dương, giảm và f(n) = a<sub>n</sub> thì ∑a<sub>n</sub> và ∫<sub>1</sub><sup>∞</sup> f(x) dx cùng hội tụ hoặc cùng phân kỳ — đó là cách chứng minh quy tắc p-chuỗi. <strong>Tiêu chuẩn so sánh</strong>: nếu 0 ≤ a<sub>n</sub> ≤ b<sub>n</sub> và ∑b<sub>n</sub> hội tụ thì ∑a<sub>n</sub> hội tụ; nếu a<sub>n</sub> ≥ b<sub>n</sub> ≥ 0 và ∑b<sub>n</sub> phân kỳ thì ∑a<sub>n</sub> phân kỳ.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — hiệu ứng số nhân.</b> Chính phủ chi 10 tỉ đồng. Người dân tiêu 80% mỗi khoản thu nhập thêm (khuynh hướng tiêu dùng biên 0,8), nên các vòng chi tiêu là 10; 8; 6,4; … Tổng = 10/(1 − 0,8) = <b>50 tỉ</b> — số nhân bằng 5.</p></div>
<div class="callout"><p><b>Ví dụ 2 — niên kim vĩnh viễn.</b> Một cổ phiếu trả 12 triệu đồng mỗi năm, mãi mãi; lãi suất chiết khấu 8%. Giá trị hiện tại = ∑<sub>n=1</sub><sup>∞</sup> 12/1,08ⁿ, chuỗi hình học có số hạng đầu 12/1,08 và công bội 1/1,08: PV = (12/1,08)/(1 − 1/1,08) = 12/0,08 = <b>150 triệu</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — chuỗi lồng nhau.</b> 1/(n(n + 1)) = 1/n − 1/(n + 1), nên S<sub>N</sub> = 1 − 1/(N + 1) → <b>1</b>. Số thập phân tuần hoàn: 0,272727… = 0,27 + 0,0027 + … = 0,27/(1 − 0,01) = 27/99 = <b>3/11</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4 — các tiêu chuẩn.</b> ∑ n/(3n + 1): số hạng → 1/3 ≠ 0 nên <b>phân kỳ</b>. ∑ 1/n<sup>1,5</sup>: p = 1,5 &gt; 1, hội tụ (thật vậy ∫<sub>1</sub><sup>∞</sup> x<sup>−1,5</sup> dx = 2 hữu hạn). ∑ 1/(n<sup>2</sup> + 5) ≤ ∑ 1/n<sup>2</sup> = π<sup>2</sup>/6 nên <b>hội tụ</b> theo so sánh.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>“a<sub>n</sub> → 0 nên chuỗi hội tụ” — sai: chuỗi điều hoà ∑1/n có a<sub>n</sub> → 0 mà vẫn phân kỳ.</li><li>Dùng a/(1 − r) khi |r| ≥ 1, hoặc quên rằng công thức cần số hạng <em>đầu tiên</em> (để ý n bắt đầu từ 0 hay 1).</li><li>So sánh sai chiều: “nhỏ hơn một chuỗi phân kỳ” không chứng minh được gì.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Chuỗi hội tụ khi dãy tổng riêng phần hội tụ.</li><li>Chuỗi hình học: tổng = số hạng đầu/(1 − r), chỉ khi |r| &lt; 1.</li><li>Số hạng không → 0 ⇒ phân kỳ; số hạng → 0 ⇒ phải xét tiếp.</li><li>p-chuỗi hội tụ đúng khi p &gt; 1; chuỗi điều hoà phân kỳ.</li><li>Tài chính: số nhân = 1/(1 − MPC); niên kim vĩnh viễn PV = khoản trả/lãi suất.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-2/pages/5-2-infinite-series" target="_blank" rel="noopener">OpenStax Calculus Vol. 2 — 5.2 Chuỗi vô hạn</a></li><li><a href="https://openstax.org/books/calculus-volume-2/pages/5-3-the-divergence-and-integral-tests" target="_blank" rel="noopener">OpenStax — 5.3 Tiêu chuẩn phân kỳ và tích phân</a></li><li><a href="https://openstax.org/books/calculus-volume-2/pages/5-4-comparison-tests" target="_blank" rel="noopener">OpenStax — 5.4 Tiêu chuẩn so sánh</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcII/Series_Special.aspx" target="_blank" rel="noopener">Paul's Online Notes — Các chuỗi đặc biệt (hình học, lồng nhau, điều hoà)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tính ∑<sub>n=1</sub><sup>∞</sup> 5·(−2/3)<sup>n−1</sup>.</li><li>∑ (n<sup>2</sup> + 1)/(2n<sup>2</sup>) có hội tụ không?</li><li>∑ 3/(n<sup>3</sup> + 1) có hội tụ không? Giải thích.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Số hạng đầu 5, r = −2/3 (|r| &lt; 1): 5/(1 + 2/3) = <b>3</b>. 2) Số hạng → 1/2 ≠ 0 ⇒ <b>phân kỳ</b>. 3) 0 &lt; 3/(n<sup>3</sup> + 1) &lt; 3/n<sup>3</sup> và ∑3/n<sup>3</sup> hội tụ (p = 3) ⇒ <b>hội tụ</b>.</p></div>`);

const c83 = L('mac103-ts-8-3',
  '8.3 — Ratio test, power series and Taylor polynomials|||8.3 — Tiêu chuẩn tỉ số, chuỗi luỹ thừa và đa thức Taylor',
  'Tiêu chuẩn tỉ số; chuỗi luỹ thừa, bán kính và khoảng hội tụ; đa thức Taylor/Maclaurin của eˣ, ln(1 + x), sin x, √x quanh 4; ước lượng sai số; code Python so sánh đa thức Taylor của sin với giá trị thật.',
  `<span class="eyebrow">MAC103 · Chapter 8 · Lesson 8.3</span>
<h2>Ratio test, power series and Taylor polynomials</h2>
<p class="lead">How does a calculator compute e<sup>0.2</sup> or sin 1.2 using only +, −, × and ÷? It replaces the function by a polynomial that matches it near a point — a Taylor polynomial. This lesson shows how, and how big the error is.</p>
<h3>🎯 Objectives</h3>
<ul><li>Apply the ratio test.</li><li>Find the radius and interval of convergence of a power series.</li><li>Build Taylor/Maclaurin polynomials and use them to approximate values.</li><li>Estimate the error of a Taylor approximation and check it in Python.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Ratio test</span>L = lim<sub>n→∞</sub> |a<sub>n+1</sub>/a<sub>n</sub>|.  L &lt; 1 ⇒ converges;  L &gt; 1 ⇒ diverges;  L = 1 ⇒ no conclusion.</div>
<p>It is ideal for terms with factorials and powers like 3ⁿ. A <strong>power series</strong> ∑ c<sub>n</sub>(x − a)ⁿ is a “polynomial of infinite degree”. Using the ratio test on it gives a <strong>radius of convergence R</strong>: the series converges for |x − a| &lt; R and diverges for |x − a| &gt; R; the two endpoints must be checked separately.</p>
<div class="formula"><span class="lbl">Taylor polynomial of degree n about a</span>P<sub>n</sub>(x) = f(a) + f′(a)(x − a) + f″(a)(x − a)<sup>2</sup>/2! + … + f<sup>(n)</sup>(a)(x − a)ⁿ/n!</div>
<p>With a = 0 it is called a <strong>Maclaurin</strong> polynomial. Three you should know:</p>
<div class="formula"><span class="lbl">Maclaurin series</span>eˣ = 1 + x + x<sup>2</sup>/2! + x<sup>3</sup>/3! + …  (all x)<br>ln(1 + x) = x − x<sup>2</sup>/2 + x<sup>3</sup>/3 − …  (−1 &lt; x ≤ 1)<br>sin x = x − x<sup>3</sup>/3! + x<sup>5</sup>/5! − …  (all x)</div>
<div class="formula"><span class="lbl">Error bound (Lagrange)</span>|f(x) − P<sub>n</sub>(x)| ≤ M·|x − a|<sup>n+1</sup>/(n + 1)!,  where M ≥ |f<sup>(n+1)</sup>| between a and x</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — ratio test.</b> ∑ n/3ⁿ: |a<sub>n+1</sub>/a<sub>n</sub>| = (n + 1)/(3n) → 1/3 &lt; 1, converges (its sum is 3/4). ∑ n!/10ⁿ: ratio = (n + 1)/10 → ∞, <b>diverges</b> — factorials eventually beat any exponential.</p></div>
<div class="callout"><p><b>Example 2 — interval of convergence.</b> ∑ xⁿ/(n·4ⁿ). Ratio: |x|·n/(4(n + 1)) → |x|/4 &lt; 1 ⇒ R = 4. At x = 4: ∑1/n (harmonic) diverges. At x = −4: ∑(−1)ⁿ/n converges (alternating series). Interval: <b>[−4, 4)</b>.</p></div>
<div class="callout"><p><b>Example 3 — approximations.</b> e<sup>0.2</sup> ≈ P<sub>3</sub>(0.2) = 1 + 0.2 + 0.02 + 0.001333 = 1.221333 (true 1.221403, error ≈ 7·10<sup>−5</sup>). ln 1.1 ≈ 0.1 − 0.005 + 0.000333 = 0.095333 (true 0.095310). About a = 4: √x ≈ 2 + (x − 4)/4 − (x − 4)<sup>2</sup>/64, so √4.1 ≈ <b>2.024844</b> (true 2.024846).</p></div>
<p><b>Example 4 — Python check.</b> Taylor polynomials of sin at x = 1.2:</p>
<pre><code class="language-python">import math

def sin_taylor(x, n_terms):
    # x - x^3/3! + x^5/5! - ...  (n_terms terms)
    return sum((-1)**k * x**(2*k+1) / math.factorial(2*k+1) for k in range(n_terms))

x = 1.2
print("degree   P(x)          error")
for n in range(1, 5):
    p = sin_taylor(x, n)
    print(f"{2*n-1:&gt;6}   {p:.10f}  {abs(p - math.sin(x)):.2e}")
print("exact   ", f"{math.sin(x):.10f}")</code></pre>
<div class="out">degree   P(x)          error
     1   1.2000000000  2.68e-01
     3   0.9120000000  2.00e-02
     5   0.9327360000  6.97e-04
     7   0.9320250514  1.40e-05
exact    0.9320390860</div>
<p>Each extra term cuts the error by a factor of 30–50. The Lagrange bound for degree 5 is 1.2<sup>7</sup>/7! ≈ 7.1·10<sup>−4</sup>, and the real error 6.97·10<sup>−4</sup> is indeed below it.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Concluding anything when the ratio limit is exactly 1.</li><li>Forgetting the endpoints of the interval of convergence.</li><li>Dropping the factorials n! in the Taylor formula.</li><li>Using a Maclaurin polynomial far from 0 (e.g. ln(1 + x) at x = 3 lies outside its interval).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Ratio test: L &lt; 1 converges, L &gt; 1 diverges, L = 1 unknown.</li><li>A power series converges on an interval of radius R about its centre.</li><li>P<sub>n</sub> matches f and its first n derivatives at a.</li><li>Error ≤ M|x − a|<sup>n+1</sup>/(n + 1)!: small near a, shrinks fast as n grows.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-2/pages/5-6-ratio-and-root-tests" target="_blank" rel="noopener">OpenStax Calculus Vol. 2 — 5.6 Ratio and Root Tests</a></li><li><a href="https://openstax.org/books/calculus-volume-2/pages/6-3-taylor-and-maclaurin-series" target="_blank" rel="noopener">OpenStax — 6.3 Taylor and Maclaurin Series</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcII/PowerSeries.aspx" target="_blank" rel="noopener">Paul's Online Notes — Power Series</a></li><li><a href="https://www.3blue1brown.com/lessons/taylor-series" target="_blank" rel="noopener">3Blue1Brown — Taylor series (visual intuition)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the interval of convergence of ∑ (x − 1)ⁿ/2ⁿ.</li><li>Write the Maclaurin polynomial P<sub>3</sub> of e<sup>−x</sup> and estimate e<sup>−0.1</sup>.</li><li>Does ∑ 5ⁿ/n! converge?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Geometric with ratio (x − 1)/2: converges iff |x − 1| &lt; 2 (endpoints give ∑1ⁿ and ∑(−1)ⁿ, both divergent) ⇒ <b>(−1, 3)</b>. 2) P<sub>3</sub> = 1 − x + x<sup>2</sup>/2 − x<sup>3</sup>/6; e<sup>−0.1</sup> ≈ <b>0.904833</b> (true 0.904837). 3) Ratio = 5/(n + 1) → 0 &lt; 1 ⇒ <b>converges</b> (to e<sup>5</sup> − 1 when started at n = 1).</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 8 · Bài 8.3</span>
<h2>Tiêu chuẩn tỉ số, chuỗi luỹ thừa và đa thức Taylor</h2>
<p class="lead">Máy tính bỏ túi tính e<sup>0,2</sup> hay sin 1,2 thế nào khi chỉ biết +, −, × và ÷? Nó thay hàm bằng một đa thức khớp với hàm ở gần một điểm — đa thức Taylor. Bài này chỉ cách làm và sai số lớn cỡ nào.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp dụng tiêu chuẩn tỉ số.</li><li>Tìm bán kính và khoảng hội tụ của chuỗi luỹ thừa.</li><li>Lập đa thức Taylor/Maclaurin và dùng nó để tính gần đúng.</li><li>Ước lượng sai số của xấp xỉ Taylor và kiểm bằng Python.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Tiêu chuẩn tỉ số</span>L = lim<sub>n→∞</sub> |a<sub>n+1</sub>/a<sub>n</sub>|.  L &lt; 1 ⇒ hội tụ;  L &gt; 1 ⇒ phân kỳ;  L = 1 ⇒ chưa kết luận.</div>
<p>Tiêu chuẩn này hợp nhất với số hạng chứa giai thừa và luỹ thừa kiểu 3ⁿ. <strong>Chuỗi luỹ thừa</strong> ∑ c<sub>n</sub>(x − a)ⁿ là một “đa thức bậc vô hạn”. Áp tiêu chuẩn tỉ số cho nó ta được <strong>bán kính hội tụ R</strong>: chuỗi hội tụ khi |x − a| &lt; R và phân kỳ khi |x − a| &gt; R; hai đầu mút phải xét riêng.</p>
<div class="formula"><span class="lbl">Đa thức Taylor bậc n quanh a</span>P<sub>n</sub>(x) = f(a) + f′(a)(x − a) + f″(a)(x − a)<sup>2</sup>/2! + … + f<sup>(n)</sup>(a)(x − a)ⁿ/n!</div>
<p>Khi a = 0 ta gọi là đa thức <strong>Maclaurin</strong>. Ba chuỗi nên thuộc:</p>
<div class="formula"><span class="lbl">Chuỗi Maclaurin</span>eˣ = 1 + x + x<sup>2</sup>/2! + x<sup>3</sup>/3! + …  (mọi x)<br>ln(1 + x) = x − x<sup>2</sup>/2 + x<sup>3</sup>/3 − …  (−1 &lt; x ≤ 1)<br>sin x = x − x<sup>3</sup>/3! + x<sup>5</sup>/5! − …  (mọi x)</div>
<div class="formula"><span class="lbl">Chặn sai số (Lagrange)</span>|f(x) − P<sub>n</sub>(x)| ≤ M·|x − a|<sup>n+1</sup>/(n + 1)!,  với M ≥ |f<sup>(n+1)</sup>| giữa a và x</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — tiêu chuẩn tỉ số.</b> ∑ n/3ⁿ: |a<sub>n+1</sub>/a<sub>n</sub>| = (n + 1)/(3n) → 1/3 &lt; 1, hội tụ (tổng bằng 3/4). ∑ n!/10ⁿ: tỉ số = (n + 1)/10 → ∞, <b>phân kỳ</b> — giai thừa rốt cuộc thắng mọi hàm mũ.</p></div>
<div class="callout"><p><b>Ví dụ 2 — khoảng hội tụ.</b> ∑ xⁿ/(n·4ⁿ). Tỉ số: |x|·n/(4(n + 1)) → |x|/4 &lt; 1 ⇒ R = 4. Tại x = 4: ∑1/n (điều hoà) phân kỳ. Tại x = −4: ∑(−1)ⁿ/n hội tụ (chuỗi đan dấu). Khoảng hội tụ: <b>[−4, 4)</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — tính gần đúng.</b> e<sup>0,2</sup> ≈ P<sub>3</sub>(0,2) = 1 + 0,2 + 0,02 + 0,001333 = 1,221333 (đúng 1,221403, sai số ≈ 7·10<sup>−5</sup>). ln 1,1 ≈ 0,1 − 0,005 + 0,000333 = 0,095333 (đúng 0,095310). Quanh a = 4: √x ≈ 2 + (x − 4)/4 − (x − 4)<sup>2</sup>/64, nên √4,1 ≈ <b>2,024844</b> (đúng 2,024846).</p></div>
<p><b>Ví dụ 4 — kiểm bằng Python.</b> Đa thức Taylor của sin tại x = 1,2:</p>
<pre><code class="language-python">import math

def sin_taylor(x, n_terms):
    # x - x^3/3! + x^5/5! - ...  (n_terms số hạng)
    return sum((-1)**k * x**(2*k+1) / math.factorial(2*k+1) for k in range(n_terms))

x = 1.2
print("degree   P(x)          error")
for n in range(1, 5):
    p = sin_taylor(x, n)
    print(f"{2*n-1:&gt;6}   {p:.10f}  {abs(p - math.sin(x)):.2e}")
print("exact   ", f"{math.sin(x):.10f}")</code></pre>
<div class="out">degree   P(x)          error
     1   1.2000000000  2.68e-01
     3   0.9120000000  2.00e-02
     5   0.9327360000  6.97e-04
     7   0.9320250514  1.40e-05
exact    0.9320390860</div>
<p>Mỗi số hạng thêm vào làm sai số giảm 30–50 lần. Chặn Lagrange cho bậc 5 là 1,2<sup>7</sup>/7! ≈ 7,1·10<sup>−4</sup>, và sai số thật 6,97·10<sup>−4</sup> đúng là nằm dưới chặn đó.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Kết luận khi giới hạn tỉ số đúng bằng 1.</li><li>Quên xét hai đầu mút của khoảng hội tụ.</li><li>Bỏ mất giai thừa n! trong công thức Taylor.</li><li>Dùng đa thức Maclaurin ở xa 0 (ví dụ ln(1 + x) tại x = 3 nằm ngoài khoảng hội tụ).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tiêu chuẩn tỉ số: L &lt; 1 hội tụ, L &gt; 1 phân kỳ, L = 1 chưa biết.</li><li>Chuỗi luỹ thừa hội tụ trên một khoảng bán kính R quanh tâm.</li><li>P<sub>n</sub> khớp f và n đạo hàm đầu của f tại a.</li><li>Sai số ≤ M|x − a|<sup>n+1</sup>/(n + 1)!: nhỏ gần a, giảm rất nhanh khi n tăng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-2/pages/5-6-ratio-and-root-tests" target="_blank" rel="noopener">OpenStax Calculus Vol. 2 — 5.6 Tiêu chuẩn tỉ số và căn</a></li><li><a href="https://openstax.org/books/calculus-volume-2/pages/6-3-taylor-and-maclaurin-series" target="_blank" rel="noopener">OpenStax — 6.3 Chuỗi Taylor và Maclaurin</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcII/PowerSeries.aspx" target="_blank" rel="noopener">Paul's Online Notes — Chuỗi luỹ thừa</a></li><li><a href="https://www.3blue1brown.com/lessons/taylor-series" target="_blank" rel="noopener">3Blue1Brown — Chuỗi Taylor (trực quan)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm khoảng hội tụ của ∑ (x − 1)ⁿ/2ⁿ.</li><li>Viết đa thức Maclaurin P<sub>3</sub> của e<sup>−x</sup> và ước lượng e<sup>−0,1</sup>.</li><li>∑ 5ⁿ/n! có hội tụ không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Chuỗi hình học công bội (x − 1)/2: hội tụ khi và chỉ khi |x − 1| &lt; 2 (hai đầu mút cho ∑1ⁿ và ∑(−1)ⁿ, đều phân kỳ) ⇒ <b>(−1, 3)</b>. 2) P<sub>3</sub> = 1 − x + x<sup>2</sup>/2 − x<sup>3</sup>/6; e<sup>−0,1</sup> ≈ <b>0,904833</b> (đúng 0,904837). 3) Tỉ số = 5/(n + 1) → 0 &lt; 1 ⇒ <b>hội tụ</b> (về e<sup>5</sup> − 1 nếu bắt đầu từ n = 1).</p></div>`);

const q8 = QZ(8, 'Quiz — Chapter 8: Sequences & series|||Quiz — Chương 8: Dãy số & chuỗi số', 'Kiểm tra chương 8: giới hạn dãy, chuỗi hình học (số nhân, niên kim), tiêu chuẩn phân kỳ, p-chuỗi, tiêu chuẩn tỉ số, bán kính hội tụ, đa thức Taylor.', [
  Q('q1', 'lim (n→∞) (6n² + n)/(3n² − 2) =|||lim (n→∞) (6n² + n)/(3n² − 2) =',
    ['0|||0', '2|||2', '3|||3', '∞|||∞'], 1,
    'Divide by n²: (6 + 1/n)/(3 − 2/n²) → 6/3 = 2.|||Chia cho n²: (6 + 1/n)/(3 − 2/n²) → 6/3 = 2.'),
  Q('q2', '∑ (n = 0 → ∞) 4·(1/3)ⁿ equals|||∑ (n = 0 → ∞) 4·(1/3)ⁿ bằng',
    ['6|||6', '4|||4', '12|||12', 'diverges|||phân kỳ'], 0,
    'First term 4, ratio 1/3: 4/(1 − 1/3) = 6.|||Số hạng đầu 4, công bội 1/3: 4/(1 − 1/3) = 6.'),
  Q('q3', 'A city spends 20 billion; residents re-spend 75% of each extra income. Total spending =|||Thành phố chi 20 tỉ; người dân tiêu lại 75% mỗi khoản thu nhập thêm. Tổng chi tiêu =',
    ['15 billion|||15 tỉ', '26.7 billion|||26,7 tỉ', '60 billion|||60 tỉ', '80 billion|||80 tỉ'], 3,
    'Geometric: 20/(1 − 0.75) = 80 (multiplier 4).|||Chuỗi hình học: 20/(1 − 0,75) = 80 (số nhân 4).'),
  Q('q4', 'Which series diverges?|||Chuỗi nào phân kỳ?',
    ['∑ 1/n²|||∑ 1/n²', '∑ 1/n^1.1|||∑ 1/n^1,1', '∑ 1/√n|||∑ 1/√n', '∑ (1/2)ⁿ|||∑ (1/2)ⁿ'], 2,
    '1/√n is a p-series with p = 1/2 ≤ 1, so it diverges; the others converge.|||1/√n là p-chuỗi với p = 1/2 ≤ 1 nên phân kỳ; các chuỗi còn lại hội tụ.'),
  Q('q5', 'What does the divergence test say about ∑ 2n/(n + 5)?|||Tiêu chuẩn phân kỳ nói gì về ∑ 2n/(n + 5)?',
    ['It converges to 2|||Hội tụ về 2', 'It diverges because the terms tend to 2|||Phân kỳ vì số hạng tiến về 2', 'The test is inconclusive|||Không kết luận được', 'It converges as a p-series|||Hội tụ như một p-chuỗi'], 1,
    'Terms → 2 ≠ 0, so the series must diverge.|||Số hạng → 2 ≠ 0 nên chuỗi chắc chắn phân kỳ.'),
  Q('q6', 'Apply the ratio test to ∑ n²/5ⁿ.|||Áp dụng tiêu chuẩn tỉ số cho ∑ n²/5ⁿ.',
    ['L = 1/5, converges|||L = 1/5, hội tụ', 'L = 1, inconclusive|||L = 1, chưa kết luận', 'L = 5, diverges|||L = 5, phân kỳ', 'L = 0, diverges|||L = 0, phân kỳ'], 0,
    '((n + 1)/n)²·(1/5) → 1/5, which is below 1.|||((n + 1)/n)²·(1/5) → 1/5, nhỏ hơn 1.'),
  Q('q7', 'The radius of convergence of ∑ xⁿ/3ⁿ is|||Bán kính hội tụ của ∑ xⁿ/3ⁿ là',
    ['1/3|||1/3', '1|||1', '3|||3', '∞|||∞'], 2,
    'Geometric with ratio x/3: converges exactly when |x/3| is below 1, i.e. −3 to 3.|||Chuỗi hình học công bội x/3: hội tụ đúng khi |x/3| nhỏ hơn 1, tức −3 đến 3.'),
  Q('q8', 'The Maclaurin polynomial P₂ of e^(3x) is|||Đa thức Maclaurin P₂ của e^(3x) là',
    ['1 + x + x²/2|||1 + x + x²/2', '1 + 3x + 3x²|||1 + 3x + 3x²', '3 + 3x + 9x²/2|||3 + 3x + 9x²/2', '1 + 3x + 9x²/2|||1 + 3x + 9x²/2'], 3,
    'Substitute 3x into 1 + u + u²/2: 1 + 3x + 9x²/2.|||Thay u = 3x vào 1 + u + u²/2: 1 + 3x + 9x²/2.'),
  Q('q9', 'Using P₂(x) = x − x²/2 for ln(1 + x), the estimate of ln 1.2 is|||Dùng P₂(x) = x − x²/2 cho ln(1 + x), giá trị ước lượng của ln 1,2 là',
    ['0.18|||0,18', '0.20|||0,20', '0.22|||0,22', '0.1823|||0,1823'], 0,
    '0.2 − 0.04/2 = 0.18 (the true value 0.1823 is not what P₂ gives).|||0,2 − 0,04/2 = 0,18 (giá trị đúng 0,1823 không phải kết quả của P₂).'),
  Q('q10', 'A perpetuity pays 5 million VND per year forever at a 4% discount rate. Its present value is|||Niên kim vĩnh viễn trả 5 triệu đồng mỗi năm, lãi chiết khấu 4%. Giá trị hiện tại là',
    ['20 million|||20 triệu', '105 million|||105 triệu', '125 million|||125 triệu', '200 million|||200 triệu'], 2,
    'PV = payment/rate = 5/0.04 = 125.|||PV = khoản trả/lãi suất = 5/0,04 = 125.'),
]);

const ch8 = {
  title: 'Chapter 8 — Sequences and series|||Chương 8 — Dãy số và chuỗi số',
  description: 'Dãy số tường minh/truy hồi và giới hạn (mô hình khoản vay), chuỗi hình học (số nhân, niên kim vĩnh viễn), tiêu chuẩn phân kỳ/p-chuỗi/so sánh/tích phân, tiêu chuẩn tỉ số, chuỗi luỹ thừa và đa thức Taylor có code Python chạy thật (Stewart ch.11 · OpenStax Vol.2 ch.5–6).',
  lessons: [c81, c82, c83, q8],
};

// ───────────────────────────── Chương 9 — Hàm nhiều biến ─────────────────────────────
const c91 = L('mac103-ts-9-1',
  '9.1 — Functions of two variables, level curves and partial derivatives|||9.1 — Hàm hai biến, đường mức và đạo hàm riêng',
  'Hàm hai biến, tập xác định, đồ thị mặt và đường mức; hàm sản xuất Cobb–Douglas; đạo hàm riêng và năng suất biên; đạo hàm riêng cấp hai và định lý Clairaut.',
  `<span class="eyebrow">MAC103 · Chapter 9 · Lesson 9.1</span>
<h2>Functions of two variables and partial derivatives</h2>
<p class="lead">Real quantities depend on several inputs at once: output depends on capital and labour, a delivery cost on distance and weight, a model's loss on thousands of weights. The partial derivative answers the manager's question: <em>what happens if I change just one input and hold the others fixed?</em></p>
<h3>🎯 Objectives</h3>
<ul><li>Find the domain of a function of two variables and read its level curves.</li><li>Compute first-order partial derivatives f<sub>x</sub> and f<sub>y</sub>.</li><li>Interpret partial derivatives as marginal quantities (marginal productivity).</li><li>Compute second-order partials and use Clairaut's theorem f<sub>xy</sub> = f<sub>yx</sub>.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>function of two variables</strong> z = f(x, y) assigns one number to each point (x, y) of its <strong>domain</strong> D ⊆ ℝ<sup>2</sup>. Its graph is a surface in 3D. A <strong>level curve</strong> f(x, y) = k joins all points with the same output — like contour lines on a map or the “isoquants” of economics (all capital/labour mixes that give the same output).</p>
<div class="formula"><span class="lbl">Cobb–Douglas production</span>Q(K, L) = A·K<sup>a</sup>·L<sup>b</sup>  (K = capital, L = labour, A, a, b &gt; 0)</div>
<div class="formula"><span class="lbl">Partial derivatives</span>f<sub>x</sub> = ∂f/∂x = lim<sub>h→0</sub> [f(x + h, y) − f(x, y)]/h  (y held constant)<br>f<sub>y</sub> = ∂f/∂y = lim<sub>h→0</sub> [f(x, y + h) − f(x, y)]/h  (x held constant)</div>
<p>Practical rule: to find f<sub>x</sub>, treat y as a constant number and differentiate with all the one-variable rules. Geometrically f<sub>x</sub>(a, b) is the slope of the surface in the x-direction at (a, b). In economics ∂Q/∂K is the <strong>marginal product of capital</strong>: the extra output from one more unit of capital.</p>
<div class="formula"><span class="lbl">Second partials &amp; Clairaut</span>f<sub>xx</sub>, f<sub>yy</sub>, f<sub>xy</sub> = (f<sub>x</sub>)<sub>y</sub>, f<sub>yx</sub>;  if they are continuous then f<sub>xy</sub> = f<sub>yx</sub></div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — domains.</b> f(x, y) = √(9 − x<sup>2</sup> − y<sup>2</sup>) needs x<sup>2</sup> + y<sup>2</sup> ≤ 9: the closed disk of radius 3. g(x, y) = ln(x − y) needs x − y &gt; 0: the half-plane below the line y = x (line excluded).</p></div>
<div class="callout"><p><b>Example 2 — marginal productivity.</b> A factory has Q = 20K<sup>0.4</sup>L<sup>0.6</sup>, with K = 32 machine-units and L = 243 workers. Since 32<sup>0.4</sup> = 4 and 243<sup>0.6</sup> = 27, Q = 20·4·27 = <b>2160</b>. Q<sub>K</sub> = 8K<sup>−0.6</sup>L<sup>0.6</sup> = 0.4·Q/K = 0.4·2160/32 = <b>27</b>; Q<sub>L</sub> = 0.6·Q/L = 0.6·2160/243 = <b>16/3 ≈ 5.33</b>. One more machine adds about 27 units; one more worker about 5.3 units. The level curve Q = 2160 is the isoquant through (32, 243).</p></div>
<div class="callout"><p><b>Example 3 — Clairaut.</b> f = x<sup>3</sup>y<sup>2</sup> − 4xy + e<sup>2y</sup>. f<sub>x</sub> = 3x<sup>2</sup>y<sup>2</sup> − 4y; f<sub>y</sub> = 2x<sup>3</sup>y − 4x + 2e<sup>2y</sup>. Then f<sub>xy</sub> = 6x<sup>2</sup>y − 4 and f<sub>yx</sub> = 6x<sup>2</sup>y − 4: <b>equal</b>, as Clairaut predicts.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Differentiating y when computing f<sub>x</sub>: in ∂/∂x of 4xy the answer is 4y, not 4y + 4x.</li><li>Forgetting the chain rule inside: ∂/∂y of e<sup>2y</sup> is 2e<sup>2y</sup>.</li><li>Reading Q<sub>L</sub> as “total output per worker” — it is the <em>extra</em> output of one more worker.</li><li>Including boundary points that are not allowed (strict &gt; for logarithms).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>z = f(x, y): one output per input pair; graph is a surface; level curves are contour lines.</li><li>f<sub>x</sub>: differentiate in x with y frozen; f<sub>y</sub>: the reverse.</li><li>Partials are marginal rates (marginal product of capital/labour).</li><li>For Cobb–Douglas, Q<sub>K</sub> = a·Q/K and Q<sub>L</sub> = b·Q/L.</li><li>Clairaut: mixed partials agree for smooth functions.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-3/pages/4-1-functions-of-several-variables" target="_blank" rel="noopener">OpenStax Calculus Vol. 3 — 4.1 Functions of Several Variables</a></li><li><a href="https://openstax.org/books/calculus-volume-3/pages/4-3-partial-derivatives" target="_blank" rel="noopener">OpenStax — 4.3 Partial Derivatives</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcIII/PartialDerivatives.aspx" target="_blank" rel="noopener">Paul's Online Notes — Partial Derivatives</a></li><li><a href="https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/2.-partial-derivatives/" target="_blank" rel="noopener">MIT OCW 18.02SC — Partial Derivatives</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>For f(x, y) = x<sup>2</sup>y + 5y<sup>3</sup> − 7x, find f<sub>x</sub> and f<sub>y</sub> at (1, 2).</li><li>Find the domain of h(x, y) = 1/(x<sup>2</sup> + y<sup>2</sup> − 4).</li><li>Q = 50K<sup>0.5</sup>L<sup>0.5</sup>. Find Q, Q<sub>K</sub>, Q<sub>L</sub> at K = 16, L = 25.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) f<sub>x</sub> = 2xy − 7 = <b>−3</b>; f<sub>y</sub> = x<sup>2</sup> + 15y<sup>2</sup> = <b>61</b>. 2) All (x, y) with x<sup>2</sup> + y<sup>2</sup> ≠ 4: the plane minus the circle of radius 2. 3) Q = 50·4·5 = <b>1000</b>; Q<sub>K</sub> = 0.5·1000/16 = <b>31.25</b>; Q<sub>L</sub> = 0.5·1000/25 = <b>20</b>.</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 9 · Bài 9.1</span>
<h2>Hàm hai biến và đạo hàm riêng</h2>
<p class="lead">Đại lượng thật phụ thuộc nhiều đầu vào cùng lúc: sản lượng phụ thuộc vốn và lao động, phí giao hàng phụ thuộc quãng đường và khối lượng, hàm mất mát của mô hình phụ thuộc hàng nghìn trọng số. Đạo hàm riêng trả lời câu hỏi của nhà quản lý: <em>nếu chỉ đổi một đầu vào và giữ nguyên các đầu vào khác thì điều gì xảy ra?</em></p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tìm tập xác định của hàm hai biến và đọc các đường mức.</li><li>Tính đạo hàm riêng cấp một f<sub>x</sub> và f<sub>y</sub>.</li><li>Hiểu đạo hàm riêng như đại lượng biên (năng suất biên).</li><li>Tính đạo hàm riêng cấp hai và dùng định lý Clairaut f<sub>xy</sub> = f<sub>yx</sub>.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Hàm hai biến</strong> z = f(x, y) gán một số cho mỗi điểm (x, y) thuộc <strong>tập xác định</strong> D ⊆ ℝ<sup>2</sup>. Đồ thị của nó là một mặt trong không gian 3 chiều. <strong>Đường mức</strong> f(x, y) = k nối mọi điểm có cùng đầu ra — như đường đồng mức trên bản đồ hay “đường đồng lượng” trong kinh tế (mọi tổ hợp vốn/lao động cho cùng sản lượng).</p>
<div class="formula"><span class="lbl">Hàm sản xuất Cobb–Douglas</span>Q(K, L) = A·K<sup>a</sup>·L<sup>b</sup>  (K = vốn, L = lao động, A, a, b &gt; 0)</div>
<div class="formula"><span class="lbl">Đạo hàm riêng</span>f<sub>x</sub> = ∂f/∂x = lim<sub>h→0</sub> [f(x + h, y) − f(x, y)]/h  (giữ y không đổi)<br>f<sub>y</sub> = ∂f/∂y = lim<sub>h→0</sub> [f(x, y + h) − f(x, y)]/h  (giữ x không đổi)</div>
<p>Quy tắc thực hành: muốn tìm f<sub>x</sub>, coi y là một hằng số rồi lấy đạo hàm bằng mọi quy tắc một biến. Về hình học, f<sub>x</sub>(a, b) là độ dốc của mặt theo hướng x tại (a, b). Trong kinh tế, ∂Q/∂K là <strong>năng suất biên của vốn</strong>: sản lượng tăng thêm khi thêm một đơn vị vốn.</p>
<div class="formula"><span class="lbl">Đạo hàm riêng cấp hai &amp; Clairaut</span>f<sub>xx</sub>, f<sub>yy</sub>, f<sub>xy</sub> = (f<sub>x</sub>)<sub>y</sub>, f<sub>yx</sub>;  nếu chúng liên tục thì f<sub>xy</sub> = f<sub>yx</sub></div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — tập xác định.</b> f(x, y) = √(9 − x<sup>2</sup> − y<sup>2</sup>) cần x<sup>2</sup> + y<sup>2</sup> ≤ 9: hình tròn đóng bán kính 3. g(x, y) = ln(x − y) cần x − y &gt; 0: nửa mặt phẳng phía dưới đường y = x (không lấy đường thẳng).</p></div>
<div class="callout"><p><b>Ví dụ 2 — năng suất biên.</b> Một nhà máy có Q = 20K<sup>0,4</sup>L<sup>0,6</sup>, với K = 32 đơn vị máy và L = 243 công nhân. Vì 32<sup>0,4</sup> = 4 và 243<sup>0,6</sup> = 27 nên Q = 20·4·27 = <b>2160</b>. Q<sub>K</sub> = 8K<sup>−0,6</sup>L<sup>0,6</sup> = 0,4·Q/K = 0,4·2160/32 = <b>27</b>; Q<sub>L</sub> = 0,6·Q/L = 0,6·2160/243 = <b>16/3 ≈ 5,33</b>. Thêm một máy được khoảng 27 sản phẩm; thêm một công nhân được khoảng 5,3 sản phẩm. Đường mức Q = 2160 là đường đồng lượng đi qua (32, 243).</p></div>
<div class="callout"><p><b>Ví dụ 3 — Clairaut.</b> f = x<sup>3</sup>y<sup>2</sup> − 4xy + e<sup>2y</sup>. f<sub>x</sub> = 3x<sup>2</sup>y<sup>2</sup> − 4y; f<sub>y</sub> = 2x<sup>3</sup>y − 4x + 2e<sup>2y</sup>. Khi đó f<sub>xy</sub> = 6x<sup>2</sup>y − 4 và f<sub>yx</sub> = 6x<sup>2</sup>y − 4: <b>bằng nhau</b>, đúng như Clairaut.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Lấy đạo hàm cả y khi tính f<sub>x</sub>: ∂/∂x của 4xy là 4y, không phải 4y + 4x.</li><li>Quên quy tắc dây chuyền bên trong: ∂/∂y của e<sup>2y</sup> là 2e<sup>2y</sup>.</li><li>Đọc Q<sub>L</sub> thành “sản lượng bình quân mỗi công nhân” — thật ra là sản lượng <em>thêm</em> của một công nhân nữa.</li><li>Lấy cả điểm biên không được phép (bất đẳng thức chặt &gt; với logarit).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>z = f(x, y): mỗi cặp đầu vào một đầu ra; đồ thị là mặt; đường mức là đường đồng mức.</li><li>f<sub>x</sub>: đạo hàm theo x, “đóng băng” y; f<sub>y</sub>: ngược lại.</li><li>Đạo hàm riêng là tốc độ biên (năng suất biên của vốn/lao động).</li><li>Với Cobb–Douglas, Q<sub>K</sub> = a·Q/K và Q<sub>L</sub> = b·Q/L.</li><li>Clairaut: đạo hàm hỗn hợp bằng nhau với hàm trơn.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-3/pages/4-1-functions-of-several-variables" target="_blank" rel="noopener">OpenStax Calculus Vol. 3 — 4.1 Hàm nhiều biến</a></li><li><a href="https://openstax.org/books/calculus-volume-3/pages/4-3-partial-derivatives" target="_blank" rel="noopener">OpenStax — 4.3 Đạo hàm riêng</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcIII/PartialDerivatives.aspx" target="_blank" rel="noopener">Paul's Online Notes — Đạo hàm riêng</a></li><li><a href="https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/2.-partial-derivatives/" target="_blank" rel="noopener">MIT OCW 18.02SC — Đạo hàm riêng</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Với f(x, y) = x<sup>2</sup>y + 5y<sup>3</sup> − 7x, tính f<sub>x</sub> và f<sub>y</sub> tại (1, 2).</li><li>Tìm tập xác định của h(x, y) = 1/(x<sup>2</sup> + y<sup>2</sup> − 4).</li><li>Q = 50K<sup>0,5</sup>L<sup>0,5</sup>. Tính Q, Q<sub>K</sub>, Q<sub>L</sub> tại K = 16, L = 25.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) f<sub>x</sub> = 2xy − 7 = <b>−3</b>; f<sub>y</sub> = x<sup>2</sup> + 15y<sup>2</sup> = <b>61</b>. 2) Mọi (x, y) với x<sup>2</sup> + y<sup>2</sup> ≠ 4: cả mặt phẳng bỏ đi đường tròn bán kính 2. 3) Q = 50·4·5 = <b>1000</b>; Q<sub>K</sub> = 0,5·1000/16 = <b>31,25</b>; Q<sub>L</sub> = 0,5·1000/25 = <b>20</b>.</p></div>`);

const c92 = L('mac103-ts-9-2',
  '9.2 — Tangent planes, the multivariable chain rule and the gradient|||9.2 — Mặt phẳng tiếp xúc, quy tắc dây chuyền nhiều biến và gradient',
  'Mặt phẳng tiếp xúc và xấp xỉ tuyến tính hàm hai biến; quy tắc dây chuyền khi x, y phụ thuộc t; vectơ gradient, đạo hàm theo hướng, hướng tăng nhanh nhất.',
  `<span class="eyebrow">MAC103 · Chapter 9 · Lesson 9.2</span>
<h2>Tangent planes, the chain rule and the gradient</h2>
<p class="lead">Zoom in far enough on a smooth surface and it looks flat — like a tangent plane. That plane gives quick estimates, and its tilt is captured by one vector, the gradient, which points uphill. Every “gradient-based” algorithm in AI is built on this lesson.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write the tangent plane and use it for linear approximation.</li><li>Apply the chain rule when x and y depend on another variable t.</li><li>Compute the gradient ∇f and the directional derivative D<sub>u</sub>f.</li><li>Explain why ∇f points in the direction of steepest ascent.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Tangent plane / linear approximation at (a, b)</span>z = f(a, b) + f<sub>x</sub>(a, b)(x − a) + f<sub>y</sub>(a, b)(y − b)  ⇒  f(x, y) ≈ this value near (a, b)</div>
<p>This is the two-variable version of the tangent line y = f(a) + f′(a)(x − a): each input contributes “its partial × its change”.</p>
<div class="formula"><span class="lbl">Chain rule</span>If z = f(x, y) with x = x(t), y = y(t), then dz/dt = (∂f/∂x)(dx/dt) + (∂f/∂y)(dy/dt)</div>
<p>Read it as “sum over every path from t to z”. Backpropagation in neural networks is exactly this rule applied through many layers.</p>
<div class="formula"><span class="lbl">Gradient and directional derivative</span>∇f(x, y) = ⟨f<sub>x</sub>, f<sub>y</sub>⟩;  for a unit vector u, D<sub>u</sub>f = ∇f · u = |∇f| cos θ</div>
<p>Since cos θ is largest at θ = 0, f increases fastest in the direction of ∇f, with maximum rate |∇f|; it decreases fastest in the direction −∇f; and ∇f is perpendicular to the level curve through the point.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — linear approximation.</b> f(x, y) = x<sup>2</sup>y + y<sup>3</sup> at (2, 1): f = 5, f<sub>x</sub> = 2xy = 4, f<sub>y</sub> = x<sup>2</sup> + 3y<sup>2</sup> = 7. Tangent plane: z = 5 + 4(x − 2) + 7(y − 1). Estimate f(2.1, 0.95) ≈ 5 + 4(0.1) + 7(−0.05) = <b>5.05</b>; exact value 5.046875 — error under 0.004.</p></div>
<div class="callout"><p><b>Example 2 — chain rule.</b> z = x<sup>2</sup> + xy with x = 2t, y = t<sup>2</sup>. dz/dt = (2x + y)·2 + x·2t. At t = 1: x = 2, y = 1, so dz/dt = 5·2 + 2·2 = <b>14</b>. Check: z = 4t<sup>2</sup> + 2t<sup>3</sup>, z′ = 8t + 6t<sup>2</sup> = 14 at t = 1. ✓</p></div>
<div class="callout"><p><b>Example 3 — gradient.</b> f(x, y) = 3x<sup>2</sup> − xy + 2y<sup>2</sup> at P(1, 2): f<sub>x</sub> = 6x − y = 4, f<sub>y</sub> = −x + 4y = 7, so ∇f = ⟨4, 7⟩. In the direction u = ⟨3/5, 4/5⟩: D<sub>u</sub>f = 4·3/5 + 7·4/5 = <b>8</b>. The steepest rate at P is |∇f| = √65 ≈ 8.06, in the direction ⟨4, 7⟩.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using a direction vector that is not a unit vector in D<sub>u</sub>f — always divide by its length first.</li><li>Evaluating the partials at the new point instead of the base point (a, b) in the tangent plane.</li><li>Dropping one branch of the chain rule (each variable that depends on t contributes a term).</li><li>Thinking ∇f is a number: it is a vector.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Tangent plane: z = f(a, b) + f<sub>x</sub>Δx + f<sub>y</sub>Δy — the basis of linear approximation.</li><li>Chain rule: dz/dt = f<sub>x</sub>x′ + f<sub>y</sub>y′.</li><li>∇f = ⟨f<sub>x</sub>, f<sub>y</sub>⟩; D<sub>u</sub>f = ∇f · u with |u| = 1.</li><li>∇f points uphill fastest; −∇f downhill fastest (the idea of gradient descent).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-3/pages/4-4-tangent-planes-and-linear-approximations" target="_blank" rel="noopener">OpenStax Calculus Vol. 3 — 4.4 Tangent Planes and Linear Approximations</a></li><li><a href="https://openstax.org/books/calculus-volume-3/pages/4-5-the-chain-rule" target="_blank" rel="noopener">OpenStax — 4.5 The Chain Rule</a></li><li><a href="https://openstax.org/books/calculus-volume-3/pages/4-6-directional-derivatives-and-the-gradient" target="_blank" rel="noopener">OpenStax — 4.6 Directional Derivatives and the Gradient</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcIII/DirectionalDeriv.aspx" target="_blank" rel="noopener">Paul's Online Notes — Directional Derivatives</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the tangent plane of f(x, y) = x·e<sup>y</sup> at (1, 0).</li><li>For f = x<sup>2</sup>y<sup>3</sup>, find ∇f at (−1, 1) and the directional derivative in the direction of ⟨1, 1⟩.</li><li>w = xy with x = cos t, y = sin t. Find dw/dt at t = 0.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) f = 1, f<sub>x</sub> = e<sup>y</sup> = 1, f<sub>y</sub> = xe<sup>y</sup> = 1 ⇒ z = 1 + (x − 1) + y, i.e. <b>z = x + y</b>. 2) ∇f = ⟨2xy<sup>3</sup>, 3x<sup>2</sup>y<sup>2</sup>⟩ = <b>⟨−2, 3⟩</b>; u = ⟨1, 1⟩/√2, D<sub>u</sub>f = (−2 + 3)/√2 = <b>1/√2 ≈ 0.707</b>. 3) dw/dt = y·(−sin t) + x·cos t = cos<sup>2</sup>t − sin<sup>2</sup>t = cos 2t ⇒ <b>1</b> at t = 0.</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 9 · Bài 9.2</span>
<h2>Mặt phẳng tiếp xúc, quy tắc dây chuyền và gradient</h2>
<p class="lead">Phóng to đủ gần một mặt trơn thì nó trông phẳng — như một mặt phẳng tiếp xúc. Mặt phẳng ấy cho ước lượng nhanh, và độ nghiêng của nó gói trong một vectơ duy nhất, gradient, chỉ hướng lên dốc. Mọi thuật toán “dựa trên gradient” trong AI đều xây trên bài này.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết mặt phẳng tiếp xúc và dùng nó để xấp xỉ tuyến tính.</li><li>Áp dụng quy tắc dây chuyền khi x và y phụ thuộc một biến t.</li><li>Tính gradient ∇f và đạo hàm theo hướng D<sub>u</sub>f.</li><li>Giải thích vì sao ∇f chỉ hướng tăng nhanh nhất.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Mặt phẳng tiếp xúc / xấp xỉ tuyến tính tại (a, b)</span>z = f(a, b) + f<sub>x</sub>(a, b)(x − a) + f<sub>y</sub>(a, b)(y − b)  ⇒  f(x, y) ≈ giá trị này gần (a, b)</div>
<p>Đây là phiên bản hai biến của tiếp tuyến y = f(a) + f′(a)(x − a): mỗi đầu vào đóng góp “đạo hàm riêng của nó × lượng thay đổi của nó”.</p>
<div class="formula"><span class="lbl">Quy tắc dây chuyền</span>Nếu z = f(x, y) với x = x(t), y = y(t) thì dz/dt = (∂f/∂x)(dx/dt) + (∂f/∂y)(dy/dt)</div>
<p>Hãy đọc là “cộng theo mọi đường đi từ t tới z”. Lan truyền ngược (backpropagation) trong mạng nơ-ron chính là quy tắc này áp qua nhiều tầng.</p>
<div class="formula"><span class="lbl">Gradient và đạo hàm theo hướng</span>∇f(x, y) = ⟨f<sub>x</sub>, f<sub>y</sub>⟩;  với vectơ đơn vị u, D<sub>u</sub>f = ∇f · u = |∇f| cos θ</div>
<p>Vì cos θ lớn nhất khi θ = 0, f tăng nhanh nhất theo hướng ∇f với tốc độ cực đại |∇f|; giảm nhanh nhất theo hướng −∇f; và ∇f vuông góc với đường mức đi qua điểm đó.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — xấp xỉ tuyến tính.</b> f(x, y) = x<sup>2</sup>y + y<sup>3</sup> tại (2, 1): f = 5, f<sub>x</sub> = 2xy = 4, f<sub>y</sub> = x<sup>2</sup> + 3y<sup>2</sup> = 7. Mặt phẳng tiếp xúc: z = 5 + 4(x − 2) + 7(y − 1). Ước lượng f(2,1; 0,95) ≈ 5 + 4(0,1) + 7(−0,05) = <b>5,05</b>; giá trị đúng 5,046875 — sai số dưới 0,004.</p></div>
<div class="callout"><p><b>Ví dụ 2 — quy tắc dây chuyền.</b> z = x<sup>2</sup> + xy với x = 2t, y = t<sup>2</sup>. dz/dt = (2x + y)·2 + x·2t. Tại t = 1: x = 2, y = 1, nên dz/dt = 5·2 + 2·2 = <b>14</b>. Kiểm: z = 4t<sup>2</sup> + 2t<sup>3</sup>, z′ = 8t + 6t<sup>2</sup> = 14 tại t = 1. ✓</p></div>
<div class="callout"><p><b>Ví dụ 3 — gradient.</b> f(x, y) = 3x<sup>2</sup> − xy + 2y<sup>2</sup> tại P(1, 2): f<sub>x</sub> = 6x − y = 4, f<sub>y</sub> = −x + 4y = 7, nên ∇f = ⟨4, 7⟩. Theo hướng u = ⟨3/5, 4/5⟩: D<sub>u</sub>f = 4·3/5 + 7·4/5 = <b>8</b>. Tốc độ tăng lớn nhất tại P là |∇f| = √65 ≈ 8,06, theo hướng ⟨4, 7⟩.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng vectơ hướng chưa chuẩn hoá trong D<sub>u</sub>f — luôn chia cho độ dài trước.</li><li>Tính đạo hàm riêng tại điểm mới thay vì tại điểm gốc (a, b) trong mặt phẳng tiếp xúc.</li><li>Bỏ sót một nhánh của quy tắc dây chuyền (mỗi biến phụ thuộc t đóng góp một số hạng).</li><li>Nghĩ ∇f là một số: nó là một vectơ.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Mặt phẳng tiếp xúc: z = f(a, b) + f<sub>x</sub>Δx + f<sub>y</sub>Δy — nền tảng của xấp xỉ tuyến tính.</li><li>Quy tắc dây chuyền: dz/dt = f<sub>x</sub>x′ + f<sub>y</sub>y′.</li><li>∇f = ⟨f<sub>x</sub>, f<sub>y</sub>⟩; D<sub>u</sub>f = ∇f · u với |u| = 1.</li><li>∇f chỉ hướng lên dốc nhanh nhất; −∇f xuống dốc nhanh nhất (ý tưởng của gradient descent).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-3/pages/4-4-tangent-planes-and-linear-approximations" target="_blank" rel="noopener">OpenStax Calculus Vol. 3 — 4.4 Mặt phẳng tiếp xúc và xấp xỉ tuyến tính</a></li><li><a href="https://openstax.org/books/calculus-volume-3/pages/4-5-the-chain-rule" target="_blank" rel="noopener">OpenStax — 4.5 Quy tắc dây chuyền</a></li><li><a href="https://openstax.org/books/calculus-volume-3/pages/4-6-directional-derivatives-and-the-gradient" target="_blank" rel="noopener">OpenStax — 4.6 Đạo hàm theo hướng và gradient</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcIII/DirectionalDeriv.aspx" target="_blank" rel="noopener">Paul's Online Notes — Đạo hàm theo hướng</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết mặt phẳng tiếp xúc của f(x, y) = x·e<sup>y</sup> tại (1, 0).</li><li>Với f = x<sup>2</sup>y<sup>3</sup>, tìm ∇f tại (−1, 1) và đạo hàm theo hướng của ⟨1, 1⟩.</li><li>w = xy với x = cos t, y = sin t. Tính dw/dt tại t = 0.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) f = 1, f<sub>x</sub> = e<sup>y</sup> = 1, f<sub>y</sub> = xe<sup>y</sup> = 1 ⇒ z = 1 + (x − 1) + y, tức <b>z = x + y</b>. 2) ∇f = ⟨2xy<sup>3</sup>, 3x<sup>2</sup>y<sup>2</sup>⟩ = <b>⟨−2, 3⟩</b>; u = ⟨1, 1⟩/√2, D<sub>u</sub>f = (−2 + 3)/√2 = <b>1/√2 ≈ 0,707</b>. 3) dw/dt = y·(−sin t) + x·cos t = cos<sup>2</sup>t − sin<sup>2</sup>t = cos 2t ⇒ <b>1</b> tại t = 0.</p></div>`);

const c93 = L('mac103-ts-9-3',
  '9.3 — Optimisation in two variables: critical points, second-derivative test, least squares|||9.3 — Tối ưu hai biến: điểm tới hạn, kiểm định đạo hàm cấp hai, bình phương tối thiểu',
  'Điểm tới hạn của hàm hai biến; kiểm định D = f_xx·f_yy − (f_xy)² (cực tiểu, cực đại, điểm yên ngựa); bài toán lợi nhuận hai sản phẩm; suy ra đường hồi quy bình phương tối thiểu.',
  `<span class="eyebrow">MAC103 · Chapter 9 · Lesson 9.3</span>
<h2>Optimisation in two variables</h2>
<p class="lead">A shop sells two products whose prices interact; a data analyst wants the straight line that best fits the data. Both are “find the lowest or highest point of a surface” — solved by setting both partial derivatives to zero and checking the shape with second partials.</p>
<h3>🎯 Objectives</h3>
<ul><li>Find critical points by solving f<sub>x</sub> = 0 and f<sub>y</sub> = 0.</li><li>Classify them with the second-derivative test D = f<sub>xx</sub>f<sub>yy</sub> − (f<sub>xy</sub>)<sup>2</sup>.</li><li>Maximise a two-product profit function.</li><li>Derive and use the least-squares regression line.</li></ul>
<h3>📖 Lecture</h3>
<p>At a local maximum or minimum of a smooth f, the tangent plane is horizontal, so <b>∇f = 0</b>: f<sub>x</sub>(a, b) = 0 and f<sub>y</sub>(a, b) = 0. Such points are <strong>critical points</strong>. Not every critical point is an extremum: z = x<sup>2</sup> − y<sup>2</sup> has a <strong>saddle point</strong> at the origin (up in one direction, down in another).</p>
<div class="formula"><span class="lbl">Second-derivative test at a critical point</span>D = f<sub>xx</sub>·f<sub>yy</sub> − (f<sub>xy</sub>)<sup>2</sup><br>D &gt; 0 and f<sub>xx</sub> &gt; 0 ⇒ local minimum;  D &gt; 0 and f<sub>xx</sub> &lt; 0 ⇒ local maximum;<br>D &lt; 0 ⇒ saddle point;  D = 0 ⇒ test inconclusive</div>
<div class="formula"><span class="lbl">Least squares</span>Best line y = mx + b minimises S(m, b) = ∑ (y<sub>i</sub> − m x<sub>i</sub> − b)<sup>2</sup>. Setting S<sub>m</sub> = S<sub>b</sub> = 0 gives the normal equations:<br>m∑x<sub>i</sub><sup>2</sup> + b∑x<sub>i</sub> = ∑x<sub>i</sub>y<sub>i</sub>;   m∑x<sub>i</sub> + n·b = ∑y<sub>i</sub></div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — classify.</b> f = x<sup>3</sup> − 3x + y<sup>2</sup> − 4y. f<sub>x</sub> = 3x<sup>2</sup> − 3 = 0 ⇒ x = ±1; f<sub>y</sub> = 2y − 4 = 0 ⇒ y = 2. f<sub>xx</sub> = 6x, f<sub>yy</sub> = 2, f<sub>xy</sub> = 0. At (1, 2): D = 12 &gt; 0, f<sub>xx</sub> = 6 &gt; 0 ⇒ <b>local min</b>, f = −6. At (−1, 2): D = −12 &lt; 0 ⇒ <b>saddle</b>.</p></div>
<div class="callout"><p><b>Example 2 — two-product profit.</b> A company sells x hundred units of laptop bags and y hundred units of backpacks; profit (million VND) is P = 160x + 130y − 3x<sup>2</sup> − 2xy − 2y<sup>2</sup> − 500. P<sub>x</sub> = 160 − 6x − 2y = 0 and P<sub>y</sub> = 130 − 2x − 4y = 0. From the second, x = 65 − 2y; substituting: 160 − 390 + 12y − 2y = 0 ⇒ y = 23, x = 19. D = (−6)(−4) − (−2)<sup>2</sup> = 20 &gt; 0 and P<sub>xx</sub> &lt; 0 ⇒ maximum. Sell <b>1900 bags and 2300 backpacks</b> for a profit of <b>2515 million</b>.</p></div>
<div class="callout"><p><b>Example 3 — regression line.</b> Ad spend x (million) vs. sales y: (1, 2), (2, 3), (3, 5), (4, 6). ∑x = 10, ∑x<sup>2</sup> = 30, ∑y = 16, ∑xy = 47, n = 4. Normal equations: 30m + 10b = 47, 10m + 4b = 16 ⇒ m = 1.4, b = 0.5. Best line <b>y = 1.4x + 0.5</b>, with minimum S = 0.2.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Solving only f<sub>x</sub> = 0 and forgetting f<sub>y</sub> = 0 — both must hold.</li><li>Missing critical points (x<sup>2</sup> = 1 has two roots).</li><li>Using D without squaring f<sub>xy</sub>, or classifying when D = 0.</li><li>Calling a critical point a maximum just because the function value is large.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Critical points: ∇f = 0.</li><li>D &gt; 0: extremum (sign of f<sub>xx</sub> decides min/max); D &lt; 0: saddle.</li><li>Business optimisation with two products uses the same steps.</li><li>Least squares = minimising a two-variable function; the normal equations come from S<sub>m</sub> = S<sub>b</sub> = 0.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-3/pages/4-7-maxima-minima-problems" target="_blank" rel="noopener">OpenStax Calculus Vol. 3 — 4.7 Maxima/Minima Problems</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcIII/RelativeExtrema.aspx" target="_blank" rel="noopener">Paul's Online Notes — Relative Minimums and Maximums</a></li><li><a href="https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/2.-partial-derivatives/" target="_blank" rel="noopener">MIT OCW 18.02SC — Partial Derivatives unit (includes max/min and least squares)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find and classify the critical points of f = x<sup>2</sup> + xy + y<sup>2</sup> − 6x.</li><li>Classify the critical point of f = xy.</li><li>Find the least-squares line through (0, 1), (1, 3), (2, 4).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 2x + y − 6 = 0, x + 2y = 0 ⇒ (4, −2); D = 2·2 − 1 = 3 &gt; 0, f<sub>xx</sub> = 2 &gt; 0 ⇒ <b>local min, f = −12</b>. 2) (0, 0) with D = 0·0 − 1 = −1 &lt; 0 ⇒ <b>saddle</b>. 3) ∑x = 3, ∑x<sup>2</sup> = 5, ∑y = 8, ∑xy = 11: 5m + 3b = 11, 3m + 3b = 8 ⇒ m = 1.5, b = 7/6 ⇒ <b>y = 1.5x + 7/6</b>.</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 9 · Bài 9.3</span>
<h2>Tối ưu hàm hai biến</h2>
<p class="lead">Một cửa hàng bán hai sản phẩm mà giá ảnh hưởng lẫn nhau; một nhà phân tích dữ liệu cần đường thẳng khớp dữ liệu nhất. Cả hai đều là “tìm điểm thấp nhất hay cao nhất của một mặt” — giải bằng cách cho cả hai đạo hàm riêng bằng 0 rồi kiểm hình dạng bằng đạo hàm riêng cấp hai.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tìm điểm tới hạn bằng cách giải f<sub>x</sub> = 0 và f<sub>y</sub> = 0.</li><li>Phân loại chúng bằng kiểm định đạo hàm cấp hai D = f<sub>xx</sub>f<sub>yy</sub> − (f<sub>xy</sub>)<sup>2</sup>.</li><li>Cực đại hoá hàm lợi nhuận hai sản phẩm.</li><li>Suy ra và dùng đường hồi quy bình phương tối thiểu.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Tại cực đại hay cực tiểu địa phương của hàm trơn f, mặt phẳng tiếp xúc nằm ngang, nên <b>∇f = 0</b>: f<sub>x</sub>(a, b) = 0 và f<sub>y</sub>(a, b) = 0. Các điểm như vậy là <strong>điểm tới hạn</strong>. Không phải điểm tới hạn nào cũng là cực trị: z = x<sup>2</sup> − y<sup>2</sup> có <strong>điểm yên ngựa</strong> tại gốc toạ độ (đi lên theo một hướng, đi xuống theo hướng khác).</p>
<div class="formula"><span class="lbl">Kiểm định đạo hàm cấp hai tại điểm tới hạn</span>D = f<sub>xx</sub>·f<sub>yy</sub> − (f<sub>xy</sub>)<sup>2</sup><br>D &gt; 0 và f<sub>xx</sub> &gt; 0 ⇒ cực tiểu địa phương;  D &gt; 0 và f<sub>xx</sub> &lt; 0 ⇒ cực đại địa phương;<br>D &lt; 0 ⇒ điểm yên ngựa;  D = 0 ⇒ chưa kết luận</div>
<div class="formula"><span class="lbl">Bình phương tối thiểu</span>Đường tốt nhất y = mx + b làm cực tiểu S(m, b) = ∑ (y<sub>i</sub> − m x<sub>i</sub> − b)<sup>2</sup>. Cho S<sub>m</sub> = S<sub>b</sub> = 0 được hệ phương trình chuẩn:<br>m∑x<sub>i</sub><sup>2</sup> + b∑x<sub>i</sub> = ∑x<sub>i</sub>y<sub>i</sub>;   m∑x<sub>i</sub> + n·b = ∑y<sub>i</sub></div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — phân loại.</b> f = x<sup>3</sup> − 3x + y<sup>2</sup> − 4y. f<sub>x</sub> = 3x<sup>2</sup> − 3 = 0 ⇒ x = ±1; f<sub>y</sub> = 2y − 4 = 0 ⇒ y = 2. f<sub>xx</sub> = 6x, f<sub>yy</sub> = 2, f<sub>xy</sub> = 0. Tại (1, 2): D = 12 &gt; 0, f<sub>xx</sub> = 6 &gt; 0 ⇒ <b>cực tiểu địa phương</b>, f = −6. Tại (−1, 2): D = −12 &lt; 0 ⇒ <b>điểm yên ngựa</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — lợi nhuận hai sản phẩm.</b> Công ty bán x trăm túi laptop và y trăm ba lô; lợi nhuận (triệu đồng) là P = 160x + 130y − 3x<sup>2</sup> − 2xy − 2y<sup>2</sup> − 500. P<sub>x</sub> = 160 − 6x − 2y = 0 và P<sub>y</sub> = 130 − 2x − 4y = 0. Từ phương trình sau, x = 65 − 2y; thế vào: 160 − 390 + 12y − 2y = 0 ⇒ y = 23, x = 19. D = (−6)(−4) − (−2)<sup>2</sup> = 20 &gt; 0 và P<sub>xx</sub> &lt; 0 ⇒ cực đại. Bán <b>1900 túi và 2300 ba lô</b>, lợi nhuận <b>2515 triệu</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — đường hồi quy.</b> Chi quảng cáo x (triệu) và doanh số y: (1, 2), (2, 3), (3, 5), (4, 6). ∑x = 10, ∑x<sup>2</sup> = 30, ∑y = 16, ∑xy = 47, n = 4. Hệ chuẩn: 30m + 10b = 47, 10m + 4b = 16 ⇒ m = 1,4; b = 0,5. Đường tốt nhất <b>y = 1,4x + 0,5</b>, với S nhỏ nhất bằng 0,2.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chỉ giải f<sub>x</sub> = 0 mà quên f<sub>y</sub> = 0 — cả hai phải cùng đúng.</li><li>Bỏ sót điểm tới hạn (x<sup>2</sup> = 1 có hai nghiệm).</li><li>Dùng D mà không bình phương f<sub>xy</sub>, hoặc vẫn phân loại khi D = 0.</li><li>Gọi một điểm tới hạn là cực đại chỉ vì giá trị hàm ở đó lớn.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Điểm tới hạn: ∇f = 0.</li><li>D &gt; 0: cực trị (dấu f<sub>xx</sub> quyết định cực tiểu/cực đại); D &lt; 0: yên ngựa.</li><li>Tối ưu kinh doanh hai sản phẩm dùng đúng các bước này.</li><li>Bình phương tối thiểu = cực tiểu một hàm hai biến; hệ chuẩn sinh ra từ S<sub>m</sub> = S<sub>b</sub> = 0.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-3/pages/4-7-maxima-minima-problems" target="_blank" rel="noopener">OpenStax Calculus Vol. 3 — 4.7 Bài toán cực đại/cực tiểu</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcIII/RelativeExtrema.aspx" target="_blank" rel="noopener">Paul's Online Notes — Cực tiểu và cực đại địa phương</a></li><li><a href="https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/2.-partial-derivatives/" target="_blank" rel="noopener">MIT OCW 18.02SC — Chương đạo hàm riêng (có cực trị và bình phương tối thiểu)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm và phân loại điểm tới hạn của f = x<sup>2</sup> + xy + y<sup>2</sup> − 6x.</li><li>Phân loại điểm tới hạn của f = xy.</li><li>Tìm đường bình phương tối thiểu qua (0, 1), (1, 3), (2, 4).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 2x + y − 6 = 0, x + 2y = 0 ⇒ (4, −2); D = 2·2 − 1 = 3 &gt; 0, f<sub>xx</sub> = 2 &gt; 0 ⇒ <b>cực tiểu địa phương, f = −12</b>. 2) (0, 0) với D = 0·0 − 1 = −1 &lt; 0 ⇒ <b>điểm yên ngựa</b>. 3) ∑x = 3, ∑x<sup>2</sup> = 5, ∑y = 8, ∑xy = 11: 5m + 3b = 11, 3m + 3b = 8 ⇒ m = 1,5; b = 7/6 ⇒ <b>y = 1,5x + 7/6</b>.</p></div>`);

const c94 = L('mac103-ts-9-4',
  '9.4 — Lagrange multipliers and gradient descent: the bridge to AI|||9.4 — Nhân tử Lagrange và gradient descent: cầu nối sang AI',
  'Tối ưu có ràng buộc bằng nhân tử Lagrange (ngân sách sản xuất Cobb–Douglas, rào đất), ý nghĩa λ là giá trị biên của ràng buộc; gradient descent bằng Python chạy thật để khớp đường hồi quy — nền tảng huấn luyện mô hình học máy.',
  `<span class="eyebrow">MAC103 · Chapter 9 · Lesson 9.4</span>
<h2>Lagrange multipliers and gradient descent</h2>
<p class="lead">Real decisions have limits: a fixed budget, a fixed amount of fencing. Lagrange multipliers solve “best value under a constraint” exactly. When there are thousands of variables and no formula, computers instead walk downhill step by step — gradient descent, the engine of machine learning.</p>
<h3>🎯 Objectives</h3>
<ul><li>Solve constrained optimisation problems with ∇f = λ∇g.</li><li>Interpret λ as the marginal value of relaxing the constraint.</li><li>Carry out gradient-descent steps by hand and in Python.</li><li>See that fitting a regression line is the same problem solved two ways.</li></ul>
<h3>📖 Lecture</h3>
<p>To maximise or minimise f(x, y) subject to g(x, y) = c: at the optimum the level curve of f just touches the constraint curve, so their gradients are parallel.</p>
<div class="formula"><span class="lbl">Lagrange conditions</span>∇f = λ∇g  and  g(x, y) = c   ⇔   f<sub>x</sub> = λg<sub>x</sub>,  f<sub>y</sub> = λg<sub>y</sub>,  g = c</div>
<p>Three equations, three unknowns (x, y, λ). The multiplier λ measures how much the optimal value changes when c increases by one unit — in economics, the <strong>marginal value of one more unit of budget</strong>.</p>
<div class="formula"><span class="lbl">Gradient descent</span>Start at a guess p<sub>0</sub>; repeat  p<sub>k+1</sub> = p<sub>k</sub> − η·∇f(p<sub>k</sub>)   (η = learning rate)</div>
<p>Each step moves in the steepest-downhill direction (Lesson 9.2). If η is small enough, f decreases and p<sub>k</sub> approaches a minimum; if η is too large, the steps overshoot and diverge.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — production on a budget.</b> Output Q = 10√K·√L; capital costs 40 and labour 10 (thousand per unit); budget 40K + 10L = 1600. Conditions: 5√L/√K = 40λ and 5√K/√L = 10λ. Dividing: L/K = 4 ⇒ L = 4K. Budget: 40K + 40K = 1600 ⇒ <b>K = 20, L = 80</b>, Q = 10·√1600 = <b>400</b>. λ = Q<sub>K</sub>/40 = 10/40 = 0.25: each extra thousand of budget adds about 0.25 units of output.</p></div>
<div class="callout"><p><b>Example 2 — fencing.</b> Enclose a rectangle against a wall with 40 m of fence: x + 2y = 40, maximise A = xy. y = λ, x = 2λ ⇒ x = 2y ⇒ 4y = 40 ⇒ <b>y = 10, x = 20, A = 200 m<sup>2</sup></b> (λ = 10: one more metre of fence adds about 10 m<sup>2</sup>).</p></div>
<p><b>Example 3 — gradient descent in Python.</b> Fit y = mx + b to the data of Lesson 9.3 by minimising S(m, b) step by step:</p>
<pre><code class="language-python"># Fit y = m*x + b to 4 points by gradient descent on S(m, b) = sum (y - m*x - b)^2
xs = [1, 2, 3, 4]
ys = [2, 3, 5, 6]
m, b, lr = 0.0, 0.0, 0.01
for step in range(1, 3001):
    gm = sum(-2 * x * (y - m*x - b) for x, y in zip(xs, ys))
    gb = sum(-2 * (y - m*x - b) for x, y in zip(xs, ys))
    m, b = m - lr * gm, b - lr * gb
    if step in (1, 10, 100, 1000, 3000):
        S = sum((y - m*x - b)**2 for x, y in zip(xs, ys))
        print(f"step {step:&gt;4}: m = {m:.4f}, b = {b:.4f}, S = {S:.4f}")</code></pre>
<div class="out">step    1: m = 0.9400, b = 0.3200, S = 8.3336
step   10: m = 1.4064, b = 0.4811, S = 0.2002
step  100: m = 1.4022, b = 0.4936, S = 0.2000
step 1000: m = 1.4000, b = 0.5000, S = 0.2000
step 3000: m = 1.4000, b = 0.5000, S = 0.2000</div>
<p>The algorithm reaches exactly the answer of the normal equations, m = 1.4 and b = 0.5. A neural network does the same thing with millions of parameters instead of two, with the gradient computed by the chain rule (backpropagation).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the constraint equation g = c when solving — it is the third equation.</li><li>Dividing by a variable that could be 0 without checking that case separately.</li><li>Adding the gradient instead of subtracting it (that climbs uphill).</li><li>Choosing a learning rate so large that S grows instead of shrinking.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Constrained optimum: ∇f = λ∇g together with g = c.</li><li>λ = marginal value of the constraint (shadow price).</li><li>Gradient descent: p ← p − η∇f, repeated.</li><li>Calculus formula (exact) and gradient descent (iterative) give the same regression line.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-3/pages/4-8-lagrange-multipliers" target="_blank" rel="noopener">OpenStax Calculus Vol. 3 — 4.8 Lagrange Multipliers</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcIII/LagrangeMultipliers.aspx" target="_blank" rel="noopener">Paul's Online Notes — Lagrange Multipliers</a></li><li><a href="https://www.3blue1brown.com/lessons/gradient-descent" target="_blank" rel="noopener">3Blue1Brown — Gradient descent, how neural networks learn</a></li><li><a href="https://www.coursera.org/learn/multivariate-calculus-machine-learning" target="_blank" rel="noopener">Coursera — Mathematics for Machine Learning: Multivariate Calculus</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Maximise f = xy subject to x + y = 10.</li><li>Minimise x<sup>2</sup> + y<sup>2</sup> subject to x + 2y = 10.</li><li>One gradient-descent step on f = x<sup>2</sup> + 4y<sup>2</sup> from (2, 1) with η = 0.1: where do you land?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) y = λ, x = λ ⇒ x = y = 5 ⇒ <b>max 25</b>. 2) 2x = λ, 2y = 2λ ⇒ y = 2x; 5x = 10 ⇒ (2, 4), <b>min 20</b>. 3) ∇f = ⟨2x, 8y⟩ = ⟨4, 8⟩; (2, 1) − 0.1·⟨4, 8⟩ = <b>(1.6, 0.2)</b>.</p></div>`,
  `<span class="eyebrow">MAC103 · Chương 9 · Bài 9.4</span>
<h2>Nhân tử Lagrange và gradient descent</h2>
<p class="lead">Quyết định thật luôn có giới hạn: ngân sách cố định, số mét hàng rào cố định. Nhân tử Lagrange giải đúng bài “giá trị tốt nhất dưới một ràng buộc”. Khi có hàng nghìn biến và không có công thức, máy tính đi xuống dốc từng bước — gradient descent, động cơ của học máy.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải bài toán tối ưu có ràng buộc bằng ∇f = λ∇g.</li><li>Hiểu λ là giá trị biên khi nới lỏng ràng buộc.</li><li>Thực hiện các bước gradient descent bằng tay và bằng Python.</li><li>Thấy rằng khớp đường hồi quy là cùng một bài toán giải theo hai cách.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Để cực đại hay cực tiểu f(x, y) với ràng buộc g(x, y) = c: tại điểm tối ưu, đường mức của f vừa chạm đường ràng buộc, nên hai gradient song song.</p>
<div class="formula"><span class="lbl">Điều kiện Lagrange</span>∇f = λ∇g  và  g(x, y) = c   ⇔   f<sub>x</sub> = λg<sub>x</sub>,  f<sub>y</sub> = λg<sub>y</sub>,  g = c</div>
<p>Ba phương trình, ba ẩn (x, y, λ). Nhân tử λ đo giá trị tối ưu thay đổi bao nhiêu khi c tăng một đơn vị — trong kinh tế là <strong>giá trị biên của thêm một đơn vị ngân sách</strong>.</p>
<div class="formula"><span class="lbl">Gradient descent</span>Bắt đầu từ điểm đoán p<sub>0</sub>; lặp  p<sub>k+1</sub> = p<sub>k</sub> − η·∇f(p<sub>k</sub>)   (η = learning rate, tốc độ học)</div>
<p>Mỗi bước đi theo hướng xuống dốc nhanh nhất (Bài 9.2). Nếu η đủ nhỏ, f giảm dần và p<sub>k</sub> tiến về cực tiểu; nếu η quá lớn, các bước vượt quá và phân kỳ.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — sản xuất với ngân sách.</b> Sản lượng Q = 10√K·√L; vốn giá 40, lao động giá 10 (nghìn mỗi đơn vị); ngân sách 40K + 10L = 1600. Điều kiện: 5√L/√K = 40λ và 5√K/√L = 10λ. Chia vế: L/K = 4 ⇒ L = 4K. Ngân sách: 40K + 40K = 1600 ⇒ <b>K = 20, L = 80</b>, Q = 10·√1600 = <b>400</b>. λ = Q<sub>K</sub>/40 = 10/40 = 0,25: thêm mỗi nghìn ngân sách được thêm khoảng 0,25 đơn vị sản lượng.</p></div>
<div class="callout"><p><b>Ví dụ 2 — rào đất.</b> Rào một hình chữ nhật sát tường bằng 40 m rào: x + 2y = 40, cực đại A = xy. y = λ, x = 2λ ⇒ x = 2y ⇒ 4y = 40 ⇒ <b>y = 10, x = 20, A = 200 m<sup>2</sup></b> (λ = 10: thêm một mét rào được thêm khoảng 10 m<sup>2</sup>).</p></div>
<p><b>Ví dụ 3 — gradient descent bằng Python.</b> Khớp y = mx + b với dữ liệu của Bài 9.3 bằng cách cực tiểu S(m, b) từng bước:</p>
<pre><code class="language-python"># Fit y = m*x + b to 4 points by gradient descent on S(m, b) = sum (y - m*x - b)^2
xs = [1, 2, 3, 4]
ys = [2, 3, 5, 6]
m, b, lr = 0.0, 0.0, 0.01
for step in range(1, 3001):
    gm = sum(-2 * x * (y - m*x - b) for x, y in zip(xs, ys))
    gb = sum(-2 * (y - m*x - b) for x, y in zip(xs, ys))
    m, b = m - lr * gm, b - lr * gb
    if step in (1, 10, 100, 1000, 3000):
        S = sum((y - m*x - b)**2 for x, y in zip(xs, ys))
        print(f"step {step:&gt;4}: m = {m:.4f}, b = {b:.4f}, S = {S:.4f}")</code></pre>
<div class="out">step    1: m = 0.9400, b = 0.3200, S = 8.3336
step   10: m = 1.4064, b = 0.4811, S = 0.2002
step  100: m = 1.4022, b = 0.4936, S = 0.2000
step 1000: m = 1.4000, b = 0.5000, S = 0.2000
step 3000: m = 1.4000, b = 0.5000, S = 0.2000</div>
<p>Thuật toán về đúng nghiệm của hệ phương trình chuẩn, m = 1,4 và b = 0,5. Một mạng nơ-ron làm y hệt việc này với hàng triệu tham số thay vì hai, còn gradient được tính bằng quy tắc dây chuyền (lan truyền ngược).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên phương trình ràng buộc g = c khi giải — đó là phương trình thứ ba.</li><li>Chia cho một biến có thể bằng 0 mà không xét riêng trường hợp đó.</li><li>Cộng gradient thay vì trừ (như vậy là leo dốc).</li><li>Chọn learning rate lớn đến mức S tăng thay vì giảm.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tối ưu có ràng buộc: ∇f = λ∇g cùng với g = c.</li><li>λ = giá trị biên của ràng buộc (giá bóng).</li><li>Gradient descent: p ← p − η∇f, lặp lại.</li><li>Công thức giải tích (chính xác) và gradient descent (lặp) cho cùng một đường hồi quy.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-3/pages/4-8-lagrange-multipliers" target="_blank" rel="noopener">OpenStax Calculus Vol. 3 — 4.8 Nhân tử Lagrange</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcIII/LagrangeMultipliers.aspx" target="_blank" rel="noopener">Paul's Online Notes — Nhân tử Lagrange</a></li><li><a href="https://www.3blue1brown.com/lessons/gradient-descent" target="_blank" rel="noopener">3Blue1Brown — Gradient descent, cách mạng nơ-ron học</a></li><li><a href="https://www.coursera.org/learn/multivariate-calculus-machine-learning" target="_blank" rel="noopener">Coursera — Toán cho học máy: Giải tích nhiều biến</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Cực đại f = xy với ràng buộc x + y = 10.</li><li>Cực tiểu x<sup>2</sup> + y<sup>2</sup> với ràng buộc x + 2y = 10.</li><li>Một bước gradient descent cho f = x<sup>2</sup> + 4y<sup>2</sup> từ (2, 1) với η = 0,1: bạn tới điểm nào?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) y = λ, x = λ ⇒ x = y = 5 ⇒ <b>giá trị lớn nhất 25</b>. 2) 2x = λ, 2y = 2λ ⇒ y = 2x; 5x = 10 ⇒ (2, 4), <b>giá trị nhỏ nhất 20</b>. 3) ∇f = ⟨2x, 8y⟩ = ⟨4, 8⟩; (2, 1) − 0,1·⟨4, 8⟩ = <b>(1,6; 0,2)</b>.</p></div>`);

const q9 = QZ(9, 'Quiz — Chapter 9: Functions of several variables|||Quiz — Chương 9: Hàm nhiều biến', 'Kiểm tra chương 9: đạo hàm riêng, năng suất biên Cobb–Douglas, Clairaut, gradient, đạo hàm theo hướng, mặt phẳng tiếp xúc, kiểm định D, nhân tử Lagrange.', [
  Q('q1', 'For f(x, y) = x³y + 2y², ∂f/∂x =|||Với f(x, y) = x³y + 2y², ∂f/∂x =',
    ['3x²y|||3x²y', '3x²y + 4y|||3x²y + 4y', 'x³ + 4y|||x³ + 4y', '3x²|||3x²'], 0,
    'Treat y as a constant: the 2y² term has derivative 0.|||Coi y là hằng số: số hạng 2y² có đạo hàm 0.'),
  Q('q2', 'For the same f(x, y) = x³y + 2y², ∂f/∂y =|||Với cùng f(x, y) = x³y + 2y², ∂f/∂y =',
    ['3x²y|||3x²y', 'x³ + 2y|||x³ + 2y', 'x³ + 4y|||x³ + 4y', '4y|||4y'], 2,
    'Treat x as a constant: x³·1 + 4y.|||Coi x là hằng số: x³·1 + 4y.'),
  Q('q3', 'Q = 10K^0.3·L^0.7. The marginal product of labour ∂Q/∂L is|||Q = 10K^0,3·L^0,7. Năng suất biên của lao động ∂Q/∂L là',
    ['3K^(−0.7)·L^0.7|||3K^(−0,7)·L^0,7', '7K^0.3·L^(−0.3)|||7K^0,3·L^(−0,3)', '7K^0.3·L^0.7|||7K^0,3·L^0,7', '10·0.7·L^(−0.3)|||10·0,7·L^(−0,3)'], 1,
    '10·0.7 = 7 and L^0.7 becomes L^(−0.3); K^0.3 stays.|||10·0,7 = 7 và L^0,7 thành L^(−0,3); K^0,3 giữ nguyên.'),
  Q('q4', 'For f = x²y³, the mixed partial f_xy is|||Với f = x²y³, đạo hàm hỗn hợp f_xy là',
    ['2xy³|||2xy³', '3x²y²|||3x²y²', '6xy|||6xy', '6xy²|||6xy²'], 3,
    'f_x = 2xy³, then ∂/∂y gives 6xy² (equal to f_yx by Clairaut).|||f_x = 2xy³, rồi ∂/∂y cho 6xy² (bằng f_yx theo Clairaut).'),
  Q('q5', 'The gradient of f(x, y) = x² + 3y at (1, 2) is|||Gradient của f(x, y) = x² + 3y tại (1, 2) là',
    ['⟨2, 3⟩|||⟨2, 3⟩', '⟨1, 2⟩|||⟨1, 2⟩', '⟨2, 6⟩|||⟨2, 6⟩', '⟨5, 3⟩|||⟨5, 3⟩'], 0,
    'f_x = 2x = 2, f_y = 3.|||f_x = 2x = 2, f_y = 3.'),
  Q('q6', 'For the same f at (1, 2), the directional derivative in the direction ⟨0, 1⟩ is|||Với cùng f tại (1, 2), đạo hàm theo hướng ⟨0, 1⟩ là',
    ['2|||2', '0|||0', '3|||3', '√13|||√13'], 2,
    '∇f · u = ⟨2, 3⟩ · ⟨0, 1⟩ = 3.|||∇f · u = ⟨2, 3⟩ · ⟨0, 1⟩ = 3.'),
  Q('q7', 'The tangent plane to z = x² + y² at (1, 1) is|||Mặt phẳng tiếp xúc của z = x² + y² tại (1, 1) là',
    ['z = 2x + 2y|||z = 2x + 2y', 'z = 2 + 2(x − 1) + 2(y − 1)|||z = 2 + 2(x − 1) + 2(y − 1)', 'z = 2 + (x − 1) + (y − 1)|||z = 2 + (x − 1) + (y − 1)', 'z = x + y|||z = x + y'], 1,
    'f(1, 1) = 2, f_x = f_y = 2 at (1, 1).|||f(1, 1) = 2, f_x = f_y = 2 tại (1, 1).'),
  Q('q8', 'At the critical point (0, 0) of f = x² − y², the function has|||Tại điểm tới hạn (0, 0) của f = x² − y², hàm có',
    ['a local minimum|||cực tiểu địa phương', 'a local maximum|||cực đại địa phương', 'a saddle point|||điểm yên ngựa', 'no conclusion possible|||không kết luận được'], 2,
    'D = 2·(−2) − 0² = −4, which is negative ⇒ saddle.|||D = 2·(−2) − 0² = −4, âm ⇒ điểm yên ngựa.'),
  Q('q9', 'At a critical point f_xx = 2, f_yy = 8, f_xy = 3. The point is|||Tại một điểm tới hạn f_xx = 2, f_yy = 8, f_xy = 3. Điểm đó là',
    ['a local maximum|||cực đại địa phương', 'a saddle point|||điểm yên ngựa', 'inconclusive|||chưa kết luận', 'a local minimum|||cực tiểu địa phương'], 3,
    'D = 16 − 9 = 7, positive, and f_xx = 2 is positive ⇒ local minimum.|||D = 16 − 9 = 7, dương, và f_xx = 2 dương ⇒ cực tiểu địa phương.'),
  Q('q10', 'Using Lagrange multipliers, maximise xy subject to 2x + y = 20. The optimum is|||Dùng nhân tử Lagrange, cực đại xy với ràng buộc 2x + y = 20. Điểm tối ưu là',
    ['(10, 0)|||(10, 0)', '(5, 10)|||(5, 10)', '(4, 12)|||(4, 12)', '(10, 10)|||(10, 10)'], 1,
    'y = 2λ, x = λ ⇒ y = 2x; 4x = 20 ⇒ x = 5, y = 10, xy = 50.|||y = 2λ, x = λ ⇒ y = 2x; 4x = 20 ⇒ x = 5, y = 10, xy = 50.'),
]);

const ch9 = {
  title: 'Chapter 9 — Functions of several variables|||Chương 9 — Hàm nhiều biến',
  description: 'Hàm hai biến và đường mức (Cobb–Douglas), đạo hàm riêng và năng suất biên, mặt phẳng tiếp xúc, quy tắc dây chuyền, gradient và đạo hàm theo hướng, cực trị hai biến (lợi nhuận hai sản phẩm, bình phương tối thiểu), nhân tử Lagrange và gradient descent bằng Python (Stewart ch.14 · OpenStax Vol.3 ch.4).',
  lessons: [c91, c92, c93, c94, q9],
};

// ───────────────────────────── Xuất ─────────────────────────────
export default [muc0, ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9];
