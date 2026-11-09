// Khoá TỰ SOẠN cho CAL111 — trường chưa công bố syllabus trên FLM (dò 09/11/2026). Soạn theo _HOP-DONG-TU-SOAN.md.
// Khung bám thứ tự giáo trình chuẩn: Stewart/Clegg/Watson "Calculus: Early Transcendentals" (9e) và
// OpenStax "Calculus Volume 1" (Strang & Herman) — Vol 2 cho kỹ thuật tích phân / tích phân suy rộng.
// Mọi ví dụ số đã kiểm bằng sympy (python3). Mọi link ngoài đã mở thử (HTTP 200 + tiêu đề trang đúng chủ đề).
// ⚠️ File này KHÔNG dùng chuỗi nội suy (dấu đô-la + ngoặc nhọn) và không backtick lồng; nội dung ghép bằng toán tử +.

const bi = (en, vi) => '<div class="ml-en">' + en + '</div>\n<div class="ml-vi">' + vi + '</div>';
const L = (slug, title, description, en, vi) => ({ title, slug, type: 'DOCUMENT', description, content: bi(en, vi) });
const Q = (id, question, options, correctIndex, explanation) => ({ id, question, options, correctIndex, points: 1, explanation });
const QZ = (ch, title, description, questions) => ({
  title, slug: 'cal111-ts-quiz-' + ch, type: 'QUIZ', description,
  quiz: { timeLimitSeconds: 900, questions },
});

// ───────────────────────────── Mục 0 ─────────────────────────────
const m01 = L('cal111-ts-0-1',
  '0.1 — Welcome to CAL111: what Calculus I is and why you study it|||0.1 — Giới thiệu CAL111: Giải tích I học gì, để làm gì',
  'Giải tích I học gì, dùng vào đâu (học máy, đồ hoạ, thuật toán, kinh tế), 8 chuẩn đầu ra tự soạn, môn liên quan, cảnh báo: trường chưa công bố syllabus trên FLM.',
  `<span class="eyebrow">CAL111 · Section 0 · Lesson 0.1</span>
<h2>Welcome to Calculus I</h2>
<p class="lead">Calculus is the mathematics of <strong>change</strong> (derivatives) and <strong>accumulation</strong> (integrals). Both rest on one idea — the <strong>limit</strong> — and the Fundamental Theorem of Calculus shows that they are inverse operations.</p>
<div class="callout"><p>⚠️ <strong>Important.</strong> FPT University has <strong>not published the CAL111 syllabus on FLM</strong> (we searched the code, its variants and the course name on 09/11/2026). This course framework is therefore <strong>self-authored</strong>, following the chapter order of the international standard textbooks (Stewart <em>Calculus: Early Transcendentals</em> and OpenStax <em>Calculus Volume 1</em>). <strong>Grading weights, assessment format and exam dates are decided by your lecturer</strong> — always follow the course outline your lecturer gives in class.</p></div>
<h3>What is Calculus I about?</h3>
<p>Single-variable calculus studies functions y = f(x) and asks two questions. <em>How fast is y changing at this instant?</em> — answered by the derivative f′(x), the slope of the tangent line. <em>How much has accumulated in total?</em> — answered by the definite integral ∫<sub>a</sub><sup>b</sup> f(x) dx, the signed area under the curve.</p>
<h3>Why does a software / AI student need it?</h3>
<ul>
<li><strong>Machine learning:</strong> training a neural network is gradient descent — repeatedly moving parameters against the derivative of a loss function. The chain rule is exactly “backpropagation”.</li>
<li><strong>Algorithms:</strong> limits describe growth rates (why n log n beats n<sup>2</sup>), and Newton's method is how computers compute √2 or solve equations.</li>
<li><strong>Graphics, games, physics engines:</strong> velocity and acceleration are derivatives of position; numerical integration moves every object frame by frame.</li>
<li><strong>Probability &amp; data:</strong> a continuous probability is an integral of a density; expected values are integrals.</li>
<li><strong>Economics &amp; business:</strong> marginal cost and marginal revenue are derivatives; total cost from marginal cost is an integral.</li>
</ul>
<h3>Learning outcomes (self-authored)</h3>
<p>After this course you should be able to:</p>
<ol>
<li>Describe and transform elementary functions (polynomial, rational, trigonometric, exponential, logarithmic, inverse) and use them as models.</li>
<li>Compute limits using limit laws, algebraic techniques and the squeeze theorem; decide continuity and apply the Intermediate Value Theorem.</li>
<li>Define the derivative as a limit and differentiate any elementary function with the power, product, quotient and chain rules, including implicit differentiation.</li>
<li>Solve related-rates and linear-approximation problems.</li>
<li>Analyse a function with its first and second derivatives (extrema, monotonicity, concavity), sketch graphs, and solve optimisation problems; evaluate indeterminate forms with L'Hôpital's rule.</li>
<li>Explain the definite integral as a limit of Riemann sums and evaluate integrals with the Fundamental Theorem of Calculus.</li>
<li>Integrate by substitution, by parts, with basic trigonometric integrals and partial fractions; handle improper integrals and approximate integrals numerically.</li>
<li>Apply integrals to areas, volumes, arc length, work, average value and net change.</li>
</ol>
<h3>Related courses at FPTU</h3>
<p>CAL111 sits in <strong>semester 1</strong>. It continues in <strong>CAL121 — Calculus II</strong> (semester 2), and its integrals are used in <strong>MAS291 — Statistics &amp; Probability</strong> and in the AI / machine-learning courses later in the programme. Required background: high-school algebra and trigonometry (functions, graphs, equations).</p>
<h3>How to study this course</h3>
<ul>
<li>Every lesson has objectives, a lecture, step-by-step worked examples, common mistakes, a 📌 summary, 🔗 further learning and 🧪 practice with answers. Each chapter ends with a quiz.</li>
<li>Do the practice problems <strong>on paper first</strong>, then open the answer. Calculus is learned by the pencil, not by reading.</li>
<li>Check your work with Desmos (graphs) or WolframAlpha (symbolic answers) — but never let the tool do the thinking for you in an exam.</li>
</ul>`,
  `<span class="eyebrow">CAL111 · Mục 0 · Bài 0.1</span>
<h2>Chào mừng đến với Giải tích I</h2>
<p class="lead">Giải tích là toán học của <strong>sự thay đổi</strong> (đạo hàm) và <strong>sự tích luỹ</strong> (tích phân). Cả hai dựa trên một ý tưởng — <strong>giới hạn</strong> — và Định lý cơ bản của giải tích cho thấy chúng là hai phép toán ngược nhau.</p>
<div class="callout"><p>⚠️ <strong>Lưu ý quan trọng.</strong> Trường <strong>chưa công bố syllabus của CAL111 trên FLM</strong> (đã dò mã môn, mã biến thể và tên môn ngày 09/11/2026). Vì vậy khung môn này là <strong>khung tự soạn</strong>, bám thứ tự chương của giáo trình chuẩn quốc tế (Stewart <em>Calculus: Early Transcendentals</em> và OpenStax <em>Calculus Volume 1</em>). <strong>Cách tính điểm, hình thức đánh giá và lịch thi theo giảng viên</strong> — luôn theo đề cương giảng viên phát trên lớp.</p></div>
<h3>Giải tích I học gì?</h3>
<p>Giải tích một biến nghiên cứu hàm số y = f(x) và đặt hai câu hỏi. <em>Tại thời điểm này y đang thay đổi nhanh cỡ nào?</em> — trả lời bằng đạo hàm f′(x), độ dốc của tiếp tuyến. <em>Tổng cộng đã tích luỹ được bao nhiêu?</em> — trả lời bằng tích phân xác định ∫<sub>a</sub><sup>b</sup> f(x) dx, diện tích có dấu dưới đường cong.</p>
<h3>Sinh viên phần mềm / AI cần nó để làm gì?</h3>
<ul>
<li><strong>Học máy:</strong> huấn luyện mạng nơ-ron là gradient descent — liên tục dịch tham số ngược chiều đạo hàm của hàm mất mát. Quy tắc dây chuyền chính là “lan truyền ngược” (backpropagation).</li>
<li><strong>Thuật toán:</strong> giới hạn mô tả tốc độ tăng (vì sao n log n nhanh hơn n<sup>2</sup>), và phương pháp Newton là cách máy tính tính √2 hay giải phương trình.</li>
<li><strong>Đồ hoạ, game, mô phỏng vật lý:</strong> vận tốc, gia tốc là đạo hàm của vị trí; tích phân số di chuyển từng vật thể qua từng khung hình.</li>
<li><strong>Xác suất &amp; dữ liệu:</strong> xác suất liên tục là tích phân của hàm mật độ; kỳ vọng là một tích phân.</li>
<li><strong>Kinh tế &amp; kinh doanh:</strong> chi phí biên, doanh thu biên là đạo hàm; tính tổng chi phí từ chi phí biên là tích phân.</li>
</ul>
<h3>Chuẩn đầu ra (tự soạn)</h3>
<p>Học xong môn, bạn cần làm được:</p>
<ol>
<li>Mô tả và biến đổi các hàm sơ cấp (đa thức, hữu tỉ, lượng giác, mũ, logarit, hàm ngược) và dùng chúng làm mô hình.</li>
<li>Tính giới hạn bằng luật giới hạn, biến đổi đại số và định lý kẹp; xét tính liên tục và áp dụng định lý giá trị trung gian.</li>
<li>Định nghĩa đạo hàm bằng giới hạn và tính đạo hàm mọi hàm sơ cấp bằng quy tắc luỹ thừa, tích, thương, dây chuyền, kể cả đạo hàm hàm ẩn.</li>
<li>Giải bài toán tốc độ liên quan và xấp xỉ tuyến tính.</li>
<li>Khảo sát hàm bằng đạo hàm cấp 1, cấp 2 (cực trị, đơn điệu, lồi lõm), vẽ đồ thị, giải bài toán tối ưu; khử dạng vô định bằng quy tắc L'Hôpital.</li>
<li>Giải thích tích phân xác định là giới hạn của tổng Riemann và tính tích phân bằng Định lý cơ bản.</li>
<li>Tính tích phân bằng đổi biến, từng phần, tích phân lượng giác cơ bản và phân thức hữu tỉ; xử lý tích phân suy rộng và xấp xỉ tích phân bằng phương pháp số.</li>
<li>Ứng dụng tích phân tính diện tích, thể tích, độ dài cung, công, giá trị trung bình và lượng thay đổi ròng.</li>
</ol>
<h3>Môn liên quan trong khung FPTU</h3>
<p>CAL111 nằm ở <strong>kỳ 1</strong>. Môn học tiếp là <strong>CAL121 — Calculus II</strong> (kỳ 2); tích phân của môn này được dùng lại trong <strong>MAS291 — Xác suất thống kê</strong> và các môn AI / học máy về sau. Kiến thức cần có: đại số và lượng giác phổ thông (hàm số, đồ thị, phương trình).</p>
<h3>Học môn này thế nào cho hiệu quả</h3>
<ul>
<li>Mỗi bài có mục tiêu, bài giảng, ví dụ giải từng bước, lỗi hay gặp, 📌 tóm tắt, 🔗 học thêm và 🧪 tự luyện có đáp án. Cuối mỗi chương có quiz.</li>
<li>Làm bài tự luyện <strong>ra giấy trước</strong>, rồi mới mở đáp án. Giải tích học bằng cây bút, không học bằng mắt.</li>
<li>Tự kiểm bằng Desmos (đồ thị) hoặc WolframAlpha (kết quả ký hiệu) — nhưng đừng để công cụ nghĩ thay bạn trong phòng thi.</li>
</ul>`);

const m02 = L('cal111-ts-0-2',
  '0.2 — Textbooks & learning resources (verified)|||0.2 — Giáo trình & tài liệu học (đã kiểm)',
  'Ba giáo trình chuẩn kèm ISBN đã kiểm (Stewart 9e, OpenStax Calculus Vol 1–2, Thomas 15e), khoá mở MIT OCW 18.01SC, Paul’s Online Notes, 3Blue1Brown, công cụ Desmos/GeoGebra/WolframAlpha.',
  `<span class="eyebrow">CAL111 · Section 0 · Lesson 0.2</span>
<h2>Textbooks &amp; learning resources</h2>
<p class="lead">This course follows the chapter order of the standard textbooks below. You do <strong>not</strong> need to buy anything: the OpenStax books are free and legal online, and every lesson links to the matching section.</p>
<h3>📘 Main textbooks</h3>
<ol>
<li><strong>James Stewart, Daniel K. Clegg, Saleem Watson — <em>Calculus: Early Transcendentals</em>, 9th edition.</strong> Cengage Learning, 2020 (© 2021; hardcover, 1376 pp.). ISBN 978-1-337-61392-7. Metric edition (Brooks/Cole, 2020): ISBN 978-0-357-11351-6. <a href="https://www.cengage.com/c/calculus-early-transcendentals-9e-stewart-clegg-watson/9781337613927/" target="_blank" rel="noopener">Publisher page</a>. The world's most widely used Calculus I–III text; our chapter order follows its chapters 1–7.</li>
<li><strong>Gilbert Strang, Edwin “Jed” Herman — <em>Calculus Volume 1</em>.</strong> OpenStax (Rice University), Houston, 2016. Print ISBN 978-1-938168-02-4; digital ISBN 978-1-947172-13-5. License CC BY-NC-SA. <a href="https://openstax.org/books/calculus-volume-1/pages/1-introduction" target="_blank" rel="noopener">Read free online</a>. Covers functions, limits, derivatives, applications, integration and applications of integration.</li>
<li><strong>Gilbert Strang, Edwin “Jed” Herman — <em>Calculus Volume 2</em>.</strong> OpenStax, 2016. Print ISBN 978-1-938168-06-2. <a href="https://openstax.org/books/calculus-volume-2/pages/1-introduction" target="_blank" rel="noopener">Read free online</a>. We use its Chapter 3 (integration techniques, numerical and improper integrals).</li>
<li><strong>Joel Hass, Christopher Heil, Maurice Weir, Przemyslaw Bogacki — <em>Thomas' Calculus: Early Transcendentals</em>, 15th edition.</strong> Pearson, 2022 (© 2023). ISBN 978-0-13-755982-4 (eTextbook). <a href="https://www.pearson.com/en-us/pearsonplus/p/9780137559824" target="_blank" rel="noopener">Publisher page</a>. A good second explanation with many engineering applications.</li>
</ol>
<h3>🎓 Open courses &amp; notes</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/" target="_blank" rel="noopener">MIT OpenCourseWare 18.01SC — Single Variable Calculus</a>: full lecture videos, recitations, problem sets and exams with solutions.</li>
<li><a href="https://ocw.mit.edu/courses/res-18-001-calculus-fall-2023/" target="_blank" rel="noopener">MIT OCW — Calculus open textbook (Gilbert Strang)</a>.</li>
<li><a href="https://ocw.mit.edu/courses/res-18-005-highlights-of-calculus-spring-2010/" target="_blank" rel="noopener">MIT OCW — Highlights of Calculus (Strang)</a>: short videos on the big ideas.</li>
<li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/CalcI.aspx" target="_blank" rel="noopener">Paul's Online Math Notes — Calculus I (Lamar University)</a>: clear notes and hundreds of solved practice problems.</li>
<li><a href="https://www.3blue1brown.com/lessons/essence-of-calculus" target="_blank" rel="noopener">3Blue1Brown — Essence of Calculus</a>: the best visual intuition for derivatives and integrals.</li>
<li><a href="https://www.coursera.org/learn/introduction-to-calculus" target="_blank" rel="noopener">Coursera — Introduction to Calculus (University of Sydney)</a>.</li>
</ul>
<h3>🛠️ Tools for checking your work</h3>
<ul>
<li><a href="https://www.desmos.com/calculator" target="_blank" rel="noopener">Desmos graphing calculator</a> — see limits, tangent lines and areas live.</li>
<li><a href="https://www.geogebra.org/calculator" target="_blank" rel="noopener">GeoGebra Calculator Suite</a> — graphs, CAS and 3D solids of revolution.</li>
<li><a href="https://www.wolframalpha.com/" target="_blank" rel="noopener">WolframAlpha</a> — check derivatives, integrals and limits.</li>
</ul>
<div class="meo"><p><strong>Study plan.</strong> For each lesson: read the lesson here → read the linked OpenStax section → do 5–10 problems from Paul's Notes or the OpenStax exercises → do the 🧪 practice → take the chapter quiz. About 6–8 hours per chapter.</p></div>`,
  `<span class="eyebrow">CAL111 · Mục 0 · Bài 0.2</span>
<h2>Giáo trình &amp; tài liệu học</h2>
<p class="lead">Khoá này bám thứ tự chương của các giáo trình chuẩn dưới đây. Bạn <strong>không</strong> cần mua sách: sách OpenStax miễn phí, hợp pháp trên mạng, và mỗi bài đều dẫn tới đúng mục tương ứng.</p>
<h3>📘 Giáo trình chính</h3>
<ol>
<li><strong>James Stewart, Daniel K. Clegg, Saleem Watson — <em>Calculus: Early Transcendentals</em>, tái bản lần 9.</strong> Cengage Learning, 2020 (© 2021; bìa cứng, 1376 trang). ISBN 978-1-337-61392-7. Bản Metric (Brooks/Cole, 2020): ISBN 978-0-357-11351-6. <a href="https://www.cengage.com/c/calculus-early-transcendentals-9e-stewart-clegg-watson/9781337613927/" target="_blank" rel="noopener">Trang nhà xuất bản</a>. Giáo trình Calculus I–III phổ biến nhất thế giới; thứ tự chương của khoá theo các chương 1–7 của sách.</li>
<li><strong>Gilbert Strang, Edwin “Jed” Herman — <em>Calculus Volume 1</em>.</strong> OpenStax (Đại học Rice), Houston, 2016. ISBN bản in 978-1-938168-02-4; ISBN bản số 978-1-947172-13-5. Giấy phép CC BY-NC-SA. <a href="https://openstax.org/books/calculus-volume-1/pages/1-introduction" target="_blank" rel="noopener">Đọc miễn phí</a>. Gồm hàm số, giới hạn, đạo hàm, ứng dụng, tích phân và ứng dụng tích phân.</li>
<li><strong>Gilbert Strang, Edwin “Jed” Herman — <em>Calculus Volume 2</em>.</strong> OpenStax, 2016. ISBN bản in 978-1-938168-06-2. <a href="https://openstax.org/books/calculus-volume-2/pages/1-introduction" target="_blank" rel="noopener">Đọc miễn phí</a>. Khoá dùng Chương 3 (kỹ thuật tích phân, tích phân số, tích phân suy rộng).</li>
<li><strong>Joel Hass, Christopher Heil, Maurice Weir, Przemyslaw Bogacki — <em>Thomas' Calculus: Early Transcendentals</em>, tái bản lần 15.</strong> Pearson, 2022 (© 2023). ISBN 978-0-13-755982-4 (bản eTextbook). <a href="https://www.pearson.com/en-us/pearsonplus/p/9780137559824" target="_blank" rel="noopener">Trang nhà xuất bản</a>. Cách giải thích thứ hai rất tốt, nhiều ứng dụng kỹ thuật.</li>
</ol>
<h3>🎓 Khoá học mở &amp; ghi chú</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/" target="_blank" rel="noopener">MIT OpenCourseWare 18.01SC — Giải tích một biến</a>: video bài giảng, bài tập, đề thi có lời giải.</li>
<li><a href="https://ocw.mit.edu/courses/res-18-001-calculus-fall-2023/" target="_blank" rel="noopener">MIT OCW — Sách mở Calculus (Gilbert Strang)</a>.</li>
<li><a href="https://ocw.mit.edu/courses/res-18-005-highlights-of-calculus-spring-2010/" target="_blank" rel="noopener">MIT OCW — Highlights of Calculus (Strang)</a>: video ngắn về các ý lớn.</li>
<li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/CalcI.aspx" target="_blank" rel="noopener">Paul's Online Math Notes — Calculus I (Đại học Lamar)</a>: ghi chú rõ ràng, hàng trăm bài luyện có lời giải.</li>
<li><a href="https://www.3blue1brown.com/lessons/essence-of-calculus" target="_blank" rel="noopener">3Blue1Brown — Essence of Calculus</a>: trực quan đẹp nhất về đạo hàm và tích phân.</li>
<li><a href="https://www.coursera.org/learn/introduction-to-calculus" target="_blank" rel="noopener">Coursera — Introduction to Calculus (Đại học Sydney)</a>.</li>
</ul>
<h3>🛠️ Công cụ tự kiểm bài</h3>
<ul>
<li><a href="https://www.desmos.com/calculator" target="_blank" rel="noopener">Desmos</a> — xem giới hạn, tiếp tuyến, diện tích trực tiếp.</li>
<li><a href="https://www.geogebra.org/calculator" target="_blank" rel="noopener">GeoGebra Calculator Suite</a> — đồ thị, CAS, vật thể tròn xoay 3D.</li>
<li><a href="https://www.wolframalpha.com/" target="_blank" rel="noopener">WolframAlpha</a> — kiểm đạo hàm, tích phân, giới hạn.</li>
</ul>
<div class="meo"><p><strong>Kế hoạch học.</strong> Mỗi bài: đọc bài ở đây → đọc mục OpenStax được dẫn → làm 5–10 bài trong Paul's Notes hoặc bài tập OpenStax → làm 🧪 tự luyện → làm quiz chương. Khoảng 6–8 giờ mỗi chương.</p></div>`);

const muc0 = {
  title: 'Section 0 — Course framework (self-authored, no FLM syllabus)|||Mục 0 — Khung môn học (tự soạn, trường chưa công bố syllabus)',
  description: 'Giới thiệu môn, chuẩn đầu ra tự soạn, giáo trình chuẩn kèm ISBN và tài liệu mở. Trường chưa công bố syllabus CAL111 trên FLM — điểm/lịch thi theo giảng viên.',
  lessons: [m01, m02],
};

// ───────────────────────────── Chương 1 — Hàm số & mô hình ─────────────────────────────
const c11 = L('cal111-ts-1-1',
  '1.1 — Functions: domain, range, graphs and composition|||1.1 — Hàm số: tập xác định, tập giá trị, đồ thị, hàm hợp',
  'Định nghĩa hàm số, tìm tập xác định, đọc đồ thị, kiểm tra đường thẳng đứng, hàm chẵn/lẻ, hàm hợp và mô hình tuyến tính.',
  `<span class="eyebrow">CAL111 · Chapter 1 · Lesson 1.1</span>
<h2>Functions: domain, range, graphs and composition</h2>
<p class="lead">Every object in calculus is a function. Before we can take limits or derivatives, we must be fluent at reading a formula, finding where it is defined and combining functions.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the definition of a function and use the vertical line test.</li><li>Find the domain and range of functions given by formulas.</li><li>Recognise even and odd functions.</li><li>Build and evaluate composite functions f∘g.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>function</strong> f is a rule that assigns to each input x in a set D (the <strong>domain</strong>) <em>exactly one</em> output f(x). The set of all outputs is the <strong>range</strong>. A curve in the plane is the graph of a function exactly when every vertical line meets it at most once (the <strong>vertical line test</strong>). A circle x<sup>2</sup> + y<sup>2</sup> = 1 fails the test, so it is not the graph of one function of x.</p>
<p>When a function is given only by a formula, its domain is every real x for which the formula makes sense. Three things break a formula in Calculus I:</p>
<div class="formula"><span class="lbl">Domain rules</span>denominator ≠ 0    expression under an even root ≥ 0    argument of a logarithm &gt; 0</div>
<p>A function is <strong>even</strong> if f(−x) = f(x) for all x (graph symmetric about the y-axis, e.g. x<sup>2</sup>, cos x) and <strong>odd</strong> if f(−x) = −f(x) (symmetric about the origin, e.g. x<sup>3</sup>, sin x). Most functions are neither.</p>
<p>The <strong>composition</strong> (f∘g)(x) = f(g(x)) feeds the output of g into f. Its domain is the set of x in the domain of g for which g(x) lies in the domain of f. In general f∘g ≠ g∘f.</p>
<p>Functions are used as <strong>mathematical models</strong>: a linear model y = mx + b has a constant rate of change m. Example: a mobile plan costs a fixed 50 000 VND per month plus 800 VND per minute, so C(m) = 50 000 + 800m; the slope 800 is “VND per extra minute”.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — domain.</b> Find the domain of f(x) = √(x − 2) / (x − 5).</p>
<p>Step 1: the root needs x − 2 ≥ 0, so x ≥ 2. Step 2: the denominator needs x ≠ 5. Step 3: combine: <b>D = [2, 5) ∪ (5, ∞)</b>.</p></div>
<div class="callout"><p><b>Example 2 — composition.</b> Let f(x) = x<sup>2</sup> + 1 and g(x) = √x.</p>
<p>(f∘g)(x) = (√x)<sup>2</sup> + 1 = x + 1, but only for x ≥ 0 (g must be defined first). (g∘f)(x) = √(x<sup>2</sup> + 1), defined for every real x. Numerically f(g(4)) = f(2) = 5 while g(f(2)) = g(5) = √5 ≈ 2.236. The order matters.</p></div>
<div class="callout"><p><b>Example 3 — even/odd.</b> f(x) = x<sup>3</sup> − x: f(−x) = −x<sup>3</sup> + x = −f(x), so f is <b>odd</b>. g(x) = x<sup>4</sup> + cos x: g(−x) = x<sup>4</sup> + cos x = g(x), so g is <b>even</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Simplifying first and then reading the domain: (x + 1) “looks” defined everywhere, but f∘g above still needs x ≥ 0.</li><li>Writing f(x + h) = f(x) + h. For f(x) = x<sup>2</sup>, f(x + h) = x<sup>2</sup> + 2xh + h<sup>2</sup>.</li><li>Confusing f(x)<sup>2</sup>, f(x<sup>2</sup>) and f(f(x)).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>A function gives exactly one output per input; vertical line test.</li><li>Domain: no zero denominators, no negative numbers under even roots, logs need positive arguments.</li><li>Even: f(−x) = f(x); odd: f(−x) = −f(x).</li><li>(f∘g)(x) = f(g(x)); usually f∘g ≠ g∘f.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/1-1-review-of-functions" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 1.1 Review of Functions</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/Functions.aspx" target="_blank" rel="noopener">Paul's Online Notes — Functions</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the domain of h(x) = ln(4 − x<sup>2</sup>).</li><li>Let f(x) = 2x + 3 and g(x) = x<sup>2</sup>. Find f(g(x)), g(f(x)) and evaluate both at x = 1.</li><li>Is k(x) = x<sup>2</sup> sin x even, odd or neither?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Need 4 − x<sup>2</sup> &gt; 0 ⇒ −2 &lt; x &lt; 2, so D = (−2, 2). 2) f(g(x)) = 2x<sup>2</sup> + 3 → 5 at x = 1; g(f(x)) = (2x + 3)<sup>2</sup> = 4x<sup>2</sup> + 12x + 9 → 25 at x = 1. 3) k(−x) = x<sup>2</sup>(−sin x) = −k(x): odd.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 1 · Bài 1.1</span>
<h2>Hàm số: tập xác định, tập giá trị, đồ thị, hàm hợp</h2>
<p class="lead">Mọi đối tượng trong giải tích đều là hàm số. Trước khi lấy giới hạn hay đạo hàm, ta phải đọc công thức thành thạo, biết nó xác định ở đâu và biết ghép các hàm lại với nhau.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu định nghĩa hàm số và dùng phép thử đường thẳng đứng.</li><li>Tìm tập xác định, tập giá trị của hàm cho bằng công thức.</li><li>Nhận biết hàm chẵn, hàm lẻ.</li><li>Lập và tính hàm hợp f∘g.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Hàm số</strong> f là quy tắc gán cho mỗi đầu vào x thuộc tập D (<strong>tập xác định</strong>) <em>đúng một</em> đầu ra f(x). Tập mọi đầu ra là <strong>tập giá trị</strong>. Một đường cong là đồ thị của một hàm khi và chỉ khi mọi đường thẳng đứng cắt nó nhiều nhất một lần (<strong>phép thử đường thẳng đứng</strong>). Đường tròn x<sup>2</sup> + y<sup>2</sup> = 1 không qua phép thử, nên không phải đồ thị của một hàm theo x.</p>
<p>Khi hàm chỉ cho bằng công thức, tập xác định là mọi số thực x làm công thức có nghĩa. Trong Giải tích I có ba thứ làm công thức “gãy”:</p>
<div class="formula"><span class="lbl">Quy tắc tìm tập xác định</span>mẫu số ≠ 0    biểu thức dưới căn bậc chẵn ≥ 0    đối số của logarit &gt; 0</div>
<p>Hàm <strong>chẵn</strong> nếu f(−x) = f(x) với mọi x (đồ thị đối xứng qua trục tung, vd x<sup>2</sup>, cos x); hàm <strong>lẻ</strong> nếu f(−x) = −f(x) (đối xứng qua gốc toạ độ, vd x<sup>3</sup>, sin x). Đa số hàm không chẵn cũng không lẻ.</p>
<p><strong>Hàm hợp</strong> (f∘g)(x) = f(g(x)) đưa đầu ra của g vào f. Tập xác định gồm các x thuộc tập xác định của g mà g(x) thuộc tập xác định của f. Nói chung f∘g ≠ g∘f.</p>
<p>Hàm số dùng làm <strong>mô hình toán học</strong>: mô hình tuyến tính y = mx + b có tốc độ thay đổi không đổi m. Ví dụ: gói cước điện thoại cố định 50 000 đ/tháng cộng 800 đ/phút, nên C(m) = 50 000 + 800m; hệ số góc 800 nghĩa là “số đồng cho mỗi phút gọi thêm”.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — tập xác định.</b> Tìm tập xác định của f(x) = √(x − 2) / (x − 5).</p>
<p>Bước 1: căn cần x − 2 ≥ 0, tức x ≥ 2. Bước 2: mẫu cần x ≠ 5. Bước 3: gộp lại: <b>D = [2, 5) ∪ (5, ∞)</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — hàm hợp.</b> Cho f(x) = x<sup>2</sup> + 1 và g(x) = √x.</p>
<p>(f∘g)(x) = (√x)<sup>2</sup> + 1 = x + 1, nhưng chỉ với x ≥ 0 (g phải xác định trước). (g∘f)(x) = √(x<sup>2</sup> + 1), xác định với mọi x. Tính số: f(g(4)) = f(2) = 5, còn g(f(2)) = g(5) = √5 ≈ 2,236. Thứ tự rất quan trọng.</p></div>
<div class="callout"><p><b>Ví dụ 3 — chẵn/lẻ.</b> f(x) = x<sup>3</sup> − x: f(−x) = −x<sup>3</sup> + x = −f(x) nên f <b>lẻ</b>. g(x) = x<sup>4</sup> + cos x: g(−x) = x<sup>4</sup> + cos x = g(x) nên g <b>chẵn</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Rút gọn trước rồi mới đọc tập xác định: (x + 1) “trông như” xác định khắp nơi, nhưng f∘g ở trên vẫn cần x ≥ 0.</li><li>Viết f(x + h) = f(x) + h. Với f(x) = x<sup>2</sup> thì f(x + h) = x<sup>2</sup> + 2xh + h<sup>2</sup>.</li><li>Nhầm lẫn f(x)<sup>2</sup>, f(x<sup>2</sup>) và f(f(x)).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Hàm cho đúng một đầu ra với mỗi đầu vào; phép thử đường thẳng đứng.</li><li>Tập xác định: mẫu khác 0, dưới căn chẵn không âm, đối số logarit dương.</li><li>Chẵn: f(−x) = f(x); lẻ: f(−x) = −f(x).</li><li>(f∘g)(x) = f(g(x)); thường f∘g ≠ g∘f.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/1-1-review-of-functions" target="_blank" rel="noopener">OpenStax Calculus Vol. 1 — 1.1 Ôn tập hàm số</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/Functions.aspx" target="_blank" rel="noopener">Paul's Online Notes — Hàm số</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm tập xác định của h(x) = ln(4 − x<sup>2</sup>).</li><li>Cho f(x) = 2x + 3 và g(x) = x<sup>2</sup>. Tìm f(g(x)), g(f(x)) và tính cả hai tại x = 1.</li><li>k(x) = x<sup>2</sup> sin x chẵn, lẻ hay không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Cần 4 − x<sup>2</sup> &gt; 0 ⇒ −2 &lt; x &lt; 2, vậy D = (−2, 2). 2) f(g(x)) = 2x<sup>2</sup> + 3 → bằng 5 tại x = 1; g(f(x)) = (2x + 3)<sup>2</sup> = 4x<sup>2</sup> + 12x + 9 → bằng 25 tại x = 1. 3) k(−x) = x<sup>2</sup>(−sin x) = −k(x): hàm lẻ.</p></div>`);

const c12 = L('cal111-ts-1-2',
  '1.2 — Elementary functions, transformations and trigonometry review|||1.2 — Các hàm sơ cấp, phép biến đổi đồ thị và ôn lượng giác',
  'Đa thức, hàm hữu tỉ, luỹ thừa; tịnh tiến/co giãn/đối xứng đồ thị; radian, đường tròn lượng giác, chu kỳ, biên độ, phương trình lượng giác cơ bản.',
  `<span class="eyebrow">CAL111 · Chapter 1 · Lesson 1.2</span>
<h2>Elementary functions, transformations and trigonometry</h2>
<p class="lead">Calculus I works with a small “zoo” of functions. If you know their basic graphs and how to shift and stretch them, you can picture almost any formula in seconds.</p>
<h3>🎯 Objectives</h3>
<ul><li>Recognise polynomial, rational, power and trigonometric functions.</li><li>Apply shifts, stretches and reflections to a basic graph.</li><li>Use radians, the unit circle, period and amplitude.</li><li>Solve basic trigonometric equations on an interval.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Polynomials</strong> p(x) = a<sub>n</sub>x<sup>n</sup> + … + a<sub>1</sub>x + a<sub>0</sub> are defined everywhere; the degree n controls the end behaviour. A <strong>rational function</strong> is a ratio p(x)/q(x) of polynomials, defined where q(x) ≠ 0. <strong>Power functions</strong> x<sup>a</sup> include √x = x<sup>1/2</sup> and 1/x = x<sup>−1</sup>.</p>
<div class="formula"><span class="lbl">Transformations of y = f(x)  (c &gt; 0)</span>y = f(x) + c : up c    y = f(x − c) : right c    y = f(x + c) : left c<br>y = a·f(x) : vertical stretch by a    y = f(bx) : horizontal compression by b<br>y = −f(x) : reflect in the x-axis    y = f(−x) : reflect in the y-axis</div>
<p>Note the “opposite” behaviour inside the bracket: f(x − 3) moves the graph <em>right</em> by 3.</p>
<p><strong>Radians.</strong> In calculus, angles are always in radians: 180° = π rad. On the unit circle the point at angle θ is (cos θ, sin θ), so sin<sup>2</sup>θ + cos<sup>2</sup>θ = 1, and tan θ = sin θ / cos θ.</p>
<div class="formula"><span class="lbl">Values to know by heart</span>sin(π/6) = 1/2   cos(π/6) = √3/2   sin(π/4) = cos(π/4) = √2/2   sin(π/3) = √3/2   cos(π/3) = 1/2   tan(π/4) = 1</div>
<div class="formula"><span class="lbl">Amplitude and period</span>y = A sin(Bx) or A cos(Bx): amplitude |A|, period 2π/|B|    y = tan(Bx): period π/|B|</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — transformations.</b> Describe y = 2(x − 3)<sup>2</sup> + 1 starting from y = x<sup>2</sup>.</p><p>Shift right 3 → stretch vertically by 2 → shift up 1. The vertex moves from (0, 0) to <b>(3, 1)</b>; the parabola opens upward and is narrower.</p></div>
<div class="callout"><p><b>Example 2 — period.</b> y = 3cos(x/2): amplitude 3, period 2π/(1/2) = <b>4π</b>. y = sin(2x): period 2π/2 = <b>π</b>.</p></div>
<div class="callout"><p><b>Example 3 — trig equation.</b> Solve 2 sin x = 1 on [0, 2π].</p><p>sin x = 1/2. On the unit circle sine is positive in quadrants I and II, so x = π/6 and x = π − π/6 = 5π/6. <b>Solutions: π/6, 5π/6.</b></p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Calculator in degree mode: sin(30) in radians is −0.988, not 0.5.</li><li>Moving f(x − 3) to the left. “Minus inside” means right.</li><li>Forgetting the second solution of sin x = 1/2 in [0, 2π].</li><li>Writing sin<sup>2</sup>x as sin(x<sup>2</sup>). sin<sup>2</sup>x means (sin x)<sup>2</sup>.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Know the basic graphs: x<sup>n</sup>, √x, 1/x, |x|, sin, cos, tan.</li><li>Outside changes act vertically; inside changes act horizontally and “backwards”.</li><li>Radians only; sin<sup>2</sup>θ + cos<sup>2</sup>θ = 1.</li><li>Period of sin(Bx), cos(Bx) is 2π/|B|; of tan(Bx) is π/|B|.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/1-2-basic-classes-of-functions" target="_blank" rel="noopener">OpenStax — 1.2 Basic Classes of Functions</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/1-3-trigonometric-functions" target="_blank" rel="noopener">OpenStax — 1.3 Trigonometric Functions</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/Alg/Transformations.aspx" target="_blank" rel="noopener">Paul's Online Notes — Transformations</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/TrigFcns.aspx" target="_blank" rel="noopener">Paul's Online Notes — Trig Functions review</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the period of y = tan(3x).</li><li>Describe y = −|x + 2| + 4 from y = |x|. Where is its vertex?</li><li>Solve cos x = −1/2 on [0, 2π].</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) π/3. 2) Shift left 2, reflect in the x-axis, shift up 4; vertex (−2, 4), opening downward. 3) Cosine is negative in quadrants II and III with reference angle π/3: x = 2π/3 and x = 4π/3.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 1 · Bài 1.2</span>
<h2>Các hàm sơ cấp, biến đổi đồ thị và lượng giác</h2>
<p class="lead">Giải tích I làm việc với một “vườn thú” nhỏ các hàm. Nếu bạn thuộc đồ thị cơ bản của chúng và biết tịnh tiến, co giãn, bạn hình dung được gần như mọi công thức chỉ trong vài giây.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận biết hàm đa thức, hữu tỉ, luỹ thừa, lượng giác.</li><li>Áp dụng tịnh tiến, co giãn, đối xứng lên đồ thị cơ bản.</li><li>Dùng radian, đường tròn lượng giác, chu kỳ, biên độ.</li><li>Giải phương trình lượng giác cơ bản trên một khoảng.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Đa thức</strong> p(x) = a<sub>n</sub>x<sup>n</sup> + … + a<sub>1</sub>x + a<sub>0</sub> xác định trên toàn ℝ; bậc n quyết định dáng đồ thị ở hai đầu. <strong>Hàm hữu tỉ</strong> là thương p(x)/q(x) của hai đa thức, xác định khi q(x) ≠ 0. <strong>Hàm luỹ thừa</strong> x<sup>a</sup> gồm cả √x = x<sup>1/2</sup> và 1/x = x<sup>−1</sup>.</p>
<div class="formula"><span class="lbl">Biến đổi đồ thị y = f(x)  (c &gt; 0)</span>y = f(x) + c : lên c    y = f(x − c) : sang phải c    y = f(x + c) : sang trái c<br>y = a·f(x) : giãn dọc hệ số a    y = f(bx) : co ngang hệ số b<br>y = −f(x) : đối xứng qua trục hoành    y = f(−x) : đối xứng qua trục tung</div>
<p>Chú ý tác động “ngược” bên trong ngoặc: f(x − 3) dời đồ thị sang <em>phải</em> 3 đơn vị.</p>
<p><strong>Radian.</strong> Trong giải tích, góc luôn đo bằng radian: 180° = π rad. Trên đường tròn đơn vị, điểm ứng với góc θ là (cos θ, sin θ), nên sin<sup>2</sup>θ + cos<sup>2</sup>θ = 1, và tan θ = sin θ / cos θ.</p>
<div class="formula"><span class="lbl">Giá trị cần thuộc</span>sin(π/6) = 1/2   cos(π/6) = √3/2   sin(π/4) = cos(π/4) = √2/2   sin(π/3) = √3/2   cos(π/3) = 1/2   tan(π/4) = 1</div>
<div class="formula"><span class="lbl">Biên độ và chu kỳ</span>y = A sin(Bx) hoặc A cos(Bx): biên độ |A|, chu kỳ 2π/|B|    y = tan(Bx): chu kỳ π/|B|</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — biến đổi.</b> Mô tả y = 2(x − 3)<sup>2</sup> + 1 từ y = x<sup>2</sup>.</p><p>Dời phải 3 → giãn dọc hệ số 2 → dời lên 1. Đỉnh chuyển từ (0, 0) tới <b>(3, 1)</b>; parabol quay lên và hẹp hơn.</p></div>
<div class="callout"><p><b>Ví dụ 2 — chu kỳ.</b> y = 3cos(x/2): biên độ 3, chu kỳ 2π/(1/2) = <b>4π</b>. y = sin(2x): chu kỳ 2π/2 = <b>π</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — phương trình lượng giác.</b> Giải 2 sin x = 1 trên [0, 2π].</p><p>sin x = 1/2. Sin dương ở góc phần tư I và II, nên x = π/6 và x = π − π/6 = 5π/6. <b>Nghiệm: π/6, 5π/6.</b></p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Máy tính để chế độ độ: sin(30) theo radian là −0,988 chứ không phải 0,5.</li><li>Dời f(x − 3) sang trái. “Trừ bên trong” là sang phải.</li><li>Quên nghiệm thứ hai của sin x = 1/2 trên [0, 2π].</li><li>Viết sin<sup>2</sup>x thành sin(x<sup>2</sup>). sin<sup>2</sup>x nghĩa là (sin x)<sup>2</sup>.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Thuộc đồ thị cơ bản: x<sup>n</sup>, √x, 1/x, |x|, sin, cos, tan.</li><li>Biến đổi bên ngoài tác động theo chiều dọc; bên trong tác động theo chiều ngang và “ngược”.</li><li>Chỉ dùng radian; sin<sup>2</sup>θ + cos<sup>2</sup>θ = 1.</li><li>Chu kỳ sin(Bx), cos(Bx) là 2π/|B|; của tan(Bx) là π/|B|.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/1-2-basic-classes-of-functions" target="_blank" rel="noopener">OpenStax — 1.2 Các lớp hàm cơ bản</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/1-3-trigonometric-functions" target="_blank" rel="noopener">OpenStax — 1.3 Hàm lượng giác</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/Alg/Transformations.aspx" target="_blank" rel="noopener">Paul's Online Notes — Biến đổi đồ thị</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/TrigFcns.aspx" target="_blank" rel="noopener">Paul's Online Notes — Ôn hàm lượng giác</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm chu kỳ của y = tan(3x).</li><li>Mô tả y = −|x + 2| + 4 từ y = |x|. Đỉnh ở đâu?</li><li>Giải cos x = −1/2 trên [0, 2π].</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) π/3. 2) Dời trái 2, lấy đối xứng qua trục hoành, dời lên 4; đỉnh (−2, 4), quay xuống. 3) Cos âm ở góc phần tư II và III, góc tham chiếu π/3: x = 2π/3 và x = 4π/3.</p></div>`);

const c13 = L('cal111-ts-1-3',
  '1.3 — Inverse functions, exponentials and logarithms|||1.3 — Hàm ngược, hàm mũ và logarit',
  'Hàm một-một, cách tìm hàm ngược; hàm mũ, số e; logarit và các luật logarit; mô hình tăng trưởng/phân rã; hàm lượng giác ngược.',
  `<span class="eyebrow">CAL111 · Chapter 1 · Lesson 1.3</span>
<h2>Inverse functions, exponentials and logarithms</h2>
<p class="lead">Exponential functions model growth and decay — populations, interest, radioactive decay, viral spread. Logarithms are their inverses and let us solve for the time or the rate.</p>
<h3>🎯 Objectives</h3>
<ul><li>Decide whether a function is one-to-one and find its inverse.</li><li>Use the laws of exponents and logarithms, and the natural base e.</li><li>Solve exponential and logarithmic equations, checking the domain.</li><li>Evaluate inverse trigonometric functions on their restricted ranges.</li></ul>
<h3>📖 Lecture</h3>
<p>A function is <strong>one-to-one</strong> if different inputs give different outputs (horizontal line test). Then it has an <strong>inverse</strong> f<sup>−1</sup> with f<sup>−1</sup>(f(x)) = x and f(f<sup>−1</sup>(y)) = y. To find it: write y = f(x), solve for x, then swap the names. The graph of f<sup>−1</sup> is the mirror image of f in the line y = x.</p>
<p>An <strong>exponential function</strong> is f(x) = b<sup>x</sup> (b &gt; 0, b ≠ 1). The most important base is <strong>e ≈ 2.71828</strong>, the unique base whose graph has slope exactly 1 at x = 0. Its inverse is the natural logarithm ln x = log<sub>e</sub> x.</p>
<div class="formula"><span class="lbl">Laws of logarithms (x, y &gt; 0)</span>ln(xy) = ln x + ln y    ln(x/y) = ln x − ln y    ln(x<sup>r</sup>) = r ln x<br>e<sup>ln x</sup> = x (x &gt; 0)    ln(e<sup>x</sup>) = x    log<sub>b</sub> x = ln x / ln b</div>
<p><strong>Growth model:</strong> N(t) = N<sub>0</sub>·2<sup>t/d</sup> doubles every d time units; decay with half-life T: m(t) = m<sub>0</sub>·(1/2)<sup>t/T</sup>.</p>
<p><strong>Inverse trig functions</strong> exist only after restricting the domain: arcsin x ∈ [−π/2, π/2], arccos x ∈ [0, π], arctan x ∈ (−π/2, π/2). For example arcsin(1/2) = π/6, arccos(−1/2) = 2π/3, arctan 1 = π/4.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — inverse.</b> f(x) = (2x + 1)/(x − 3).</p><p>Write y = (2x + 1)/(x − 3), then swap the names: x = (2y + 1)/(y − 3). Multiply: xy − 3x = 2y + 1. Collect y: y(x − 2) = 3x + 1. So <b>f<sup>−1</sup>(x) = (3x + 1)/(x − 2)</b>. Check: f<sup>−1</sup>(f(x)) simplifies to x.</p></div>
<div class="callout"><p><b>Example 2 — exponential equation.</b> Solve e<sup>2x</sup> = 7.</p><p>Take ln: 2x = ln 7, so x = (ln 7)/2 ≈ <b>0.973</b>.</p></div>
<div class="callout"><p><b>Example 3 — growth.</b> A culture starts with 500 bacteria and doubles every 3 hours: N(t) = 500·2<sup>t/3</sup>. After 12 h: N = 500·2<sup>4</sup> = <b>8000</b>. When does it reach 10 000? 2<sup>t/3</sup> = 20 ⇒ t = 3 log<sub>2</sub> 20 = 3 ln 20 / ln 2 ≈ <b>12.97 h</b>.</p></div>
<div class="callout"><p><b>Example 4 — log equation.</b> Solve ln x + ln(x − 2) = ln 3.</p><p>Combine: ln[x(x − 2)] = ln 3 ⇒ x<sup>2</sup> − 2x − 3 = 0 ⇒ (x − 3)(x + 1) = 0. The domain needs x &gt; 2, so x = −1 is rejected: <b>x = 3</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>ln(x + y) ≠ ln x + ln y. The product law is for ln(xy).</li><li>f<sup>−1</sup>(x) is not 1/f(x).</li><li>arcsin(sin x) = x only for x in [−π/2, π/2]: arcsin(sin(5π/6)) = π/6, not 5π/6.</li><li>Not checking that solutions of a log equation lie in the domain.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>One-to-one ⇔ horizontal line test ⇔ inverse exists; graph reflects in y = x.</li><li>e<sup>x</sup> and ln x are inverses; use ln to bring exponents down.</li><li>Doubling: N<sub>0</sub>2<sup>t/d</sup>; half-life: m<sub>0</sub>(1/2)<sup>t/T</sup>.</li><li>Inverse trig functions return angles in restricted ranges.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/1-4-inverse-functions" target="_blank" rel="noopener">OpenStax — 1.4 Inverse Functions</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/1-5-exponential-and-logarithmic-functions" target="_blank" rel="noopener">OpenStax — 1.5 Exponential and Logarithmic Functions</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/LogFcns.aspx" target="_blank" rel="noopener">Paul's Online Notes — Logarithm Functions</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ExpLogEqns.aspx" target="_blank" rel="noopener">Paul's Online Notes — Exponential and Logarithm Equations</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the inverse of f(x) = e<sup>x</sup> + 1 and its domain.</li><li>A 100 g sample has a half-life of 5 years. How much remains after 20 years?</li><li>Evaluate log<sub>3</sub> 81 − log<sub>3</sub> 9.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) y = e<sup>x</sup> + 1 ⇒ x = ln(y − 1); f<sup>−1</sup>(x) = ln(x − 1), domain x &gt; 1. 2) 20/5 = 4 half-lives: 100·(1/2)<sup>4</sup> = 6.25 g. 3) log<sub>3</sub>(81/9) = log<sub>3</sub> 9 = 2.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 1 · Bài 1.3</span>
<h2>Hàm ngược, hàm mũ và logarit</h2>
<p class="lead">Hàm mũ mô hình tăng trưởng và phân rã — dân số, lãi kép, phóng xạ, lan truyền. Logarit là hàm ngược của chúng, giúp ta giải ra thời gian hay tốc độ.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Xét hàm có là song ánh (một-một) không và tìm hàm ngược.</li><li>Dùng luật luỹ thừa, luật logarit và cơ số tự nhiên e.</li><li>Giải phương trình mũ, logarit, có kiểm điều kiện.</li><li>Tính hàm lượng giác ngược trên miền giá trị đã giới hạn.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Hàm là <strong>một-một</strong> nếu các đầu vào khác nhau cho đầu ra khác nhau (phép thử đường nằm ngang). Khi đó nó có <strong>hàm ngược</strong> f<sup>−1</sup> với f<sup>−1</sup>(f(x)) = x và f(f<sup>−1</sup>(y)) = y. Cách tìm: viết y = f(x), giải ra x, rồi đổi tên biến. Đồ thị f<sup>−1</sup> đối xứng với đồ thị f qua đường y = x.</p>
<p><strong>Hàm mũ</strong> là f(x) = b<sup>x</sup> (b &gt; 0, b ≠ 1). Cơ số quan trọng nhất là <strong>e ≈ 2,71828</strong>, cơ số duy nhất mà đồ thị có độ dốc đúng bằng 1 tại x = 0. Hàm ngược của nó là logarit tự nhiên ln x = log<sub>e</sub> x.</p>
<div class="formula"><span class="lbl">Luật logarit (x, y &gt; 0)</span>ln(xy) = ln x + ln y    ln(x/y) = ln x − ln y    ln(x<sup>r</sup>) = r ln x<br>e<sup>ln x</sup> = x (x &gt; 0)    ln(e<sup>x</sup>) = x    log<sub>b</sub> x = ln x / ln b</div>
<p><strong>Mô hình tăng trưởng:</strong> N(t) = N<sub>0</sub>·2<sup>t/d</sup> gấp đôi sau mỗi d đơn vị thời gian; phân rã với chu kỳ bán rã T: m(t) = m<sub>0</sub>·(1/2)<sup>t/T</sup>.</p>
<p><strong>Hàm lượng giác ngược</strong> chỉ tồn tại sau khi giới hạn miền: arcsin x ∈ [−π/2, π/2], arccos x ∈ [0, π], arctan x ∈ (−π/2, π/2). Ví dụ arcsin(1/2) = π/6, arccos(−1/2) = 2π/3, arctan 1 = π/4.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — hàm ngược.</b> f(x) = (2x + 1)/(x − 3).</p><p>Đổi vai trước: x = (2y + 1)/(y − 3). Nhân chéo: xy − 3x = 2y + 1. Gom y: y(x − 2) = 3x + 1. Vậy <b>f<sup>−1</sup>(x) = (3x + 1)/(x − 2)</b>. Kiểm: f<sup>−1</sup>(f(x)) rút gọn được x.</p></div>
<div class="callout"><p><b>Ví dụ 2 — phương trình mũ.</b> Giải e<sup>2x</sup> = 7.</p><p>Lấy ln: 2x = ln 7, nên x = (ln 7)/2 ≈ <b>0,973</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — tăng trưởng.</b> Đĩa cấy có 500 vi khuẩn, gấp đôi sau mỗi 3 giờ: N(t) = 500·2<sup>t/3</sup>. Sau 12 giờ: N = 500·2<sup>4</sup> = <b>8000</b>. Khi nào đạt 10 000? 2<sup>t/3</sup> = 20 ⇒ t = 3 log<sub>2</sub> 20 = 3 ln 20 / ln 2 ≈ <b>12,97 giờ</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4 — phương trình logarit.</b> Giải ln x + ln(x − 2) = ln 3.</p><p>Gộp: ln[x(x − 2)] = ln 3 ⇒ x<sup>2</sup> − 2x − 3 = 0 ⇒ (x − 3)(x + 1) = 0. Điều kiện x &gt; 2 nên loại x = −1: <b>x = 3</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>ln(x + y) ≠ ln x + ln y. Luật tích dành cho ln(xy).</li><li>f<sup>−1</sup>(x) không phải 1/f(x).</li><li>arcsin(sin x) = x chỉ đúng với x ∈ [−π/2, π/2]: arcsin(sin(5π/6)) = π/6, không phải 5π/6.</li><li>Không kiểm nghiệm của phương trình logarit có thuộc tập xác định hay không.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Một-một ⇔ phép thử đường ngang ⇔ có hàm ngược; đồ thị đối xứng qua y = x.</li><li>e<sup>x</sup> và ln x là hàm ngược của nhau; dùng ln để “hạ” số mũ.</li><li>Gấp đôi: N<sub>0</sub>2<sup>t/d</sup>; bán rã: m<sub>0</sub>(1/2)<sup>t/T</sup>.</li><li>Hàm lượng giác ngược trả về góc trong miền giới hạn.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/1-4-inverse-functions" target="_blank" rel="noopener">OpenStax — 1.4 Hàm ngược</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/1-5-exponential-and-logarithmic-functions" target="_blank" rel="noopener">OpenStax — 1.5 Hàm mũ và logarit</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/LogFcns.aspx" target="_blank" rel="noopener">Paul's Online Notes — Hàm logarit</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ExpLogEqns.aspx" target="_blank" rel="noopener">Paul's Online Notes — Phương trình mũ và logarit</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm hàm ngược của f(x) = e<sup>x</sup> + 1 và tập xác định của nó.</li><li>Mẫu 100 g có chu kỳ bán rã 5 năm. Sau 20 năm còn bao nhiêu?</li><li>Tính log<sub>3</sub> 81 − log<sub>3</sub> 9.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) y = e<sup>x</sup> + 1 ⇒ x = ln(y − 1); f<sup>−1</sup>(x) = ln(x − 1), tập xác định x &gt; 1. 2) 20/5 = 4 chu kỳ: 100·(1/2)<sup>4</sup> = 6,25 g. 3) log<sub>3</sub>(81/9) = log<sub>3</sub> 9 = 2.</p></div>`);

const q1 = QZ(1, 'Quiz — Chapter 1: Functions & models|||Quiz — Chương 1: Hàm số & mô hình', 'Kiểm tra chương 1: tập xác định, hàm hợp, chẵn/lẻ, biến đổi, lượng giác, hàm ngược, mũ – logarit.', [
  Q('q1', 'What is the domain of f(x) = √(x − 2)/(x − 5)?|||Tập xác định của f(x) = √(x − 2)/(x − 5) là gì?',
    ['[2, ∞)|||[2, ∞)', '[2, 5) ∪ (5, ∞)|||[2, 5) ∪ (5, ∞)', '(2, 5)|||(2, 5)', 'all reals except 5|||mọi số thực trừ 5'], 1,
    'Need x − 2 ≥ 0 and x ≠ 5.|||Cần x − 2 ≥ 0 và x ≠ 5.'),
  Q('q2', 'If f(x) = 2x + 3 and g(x) = x², what is g(f(1))?|||Nếu f(x) = 2x + 3 và g(x) = x² thì g(f(1)) bằng?',
    ['5|||5', '25|||25', '11|||11', '9|||9'], 1,
    'f(1) = 5, then g(5) = 25.|||f(1) = 5, rồi g(5) = 25.'),
  Q('q3', 'Which function is odd?|||Hàm nào là hàm lẻ?',
    ['x⁴ + cos x|||x⁴ + cos x', 'x³ − x|||x³ − x', 'x² + 1|||x² + 1', 'eˣ|||eˣ'], 1,
    '(−x)³ − (−x) = −(x³ − x).|||(−x)³ − (−x) = −(x³ − x).'),
  Q('q4', 'The vertex of y = 2(x − 3)² + 1 is|||Đỉnh của y = 2(x − 3)² + 1 là',
    ['(−3, 1)|||(−3, 1)', '(3, −1)|||(3, −1)', '(3, 1)|||(3, 1)', '(2, 3)|||(2, 3)'], 2,
    'f(x − 3) shifts right 3, +1 shifts up 1.|||f(x − 3) dời phải 3, +1 dời lên 1.'),
  Q('q5', 'The period of y = 3cos(x/2) is|||Chu kỳ của y = 3cos(x/2) là',
    ['π|||π', '2π|||2π', '4π|||4π', '3|||3'], 2,
    'Period = 2π/(1/2) = 4π; 3 is the amplitude.|||Chu kỳ = 2π/(1/2) = 4π; 3 là biên độ.'),
  Q('q6', 'The inverse of f(x) = (2x + 1)/(x − 3) is|||Hàm ngược của f(x) = (2x + 1)/(x − 3) là',
    ['(x − 3)/(2x + 1)|||(x − 3)/(2x + 1)', '(3x + 1)/(x − 2)|||(3x + 1)/(x − 2)', '(3x − 1)/(x + 2)|||(3x − 1)/(x + 2)', '(2x − 1)/(x + 3)|||(2x − 1)/(x + 3)'], 1,
    'Swap x and y, solve: y(x − 2) = 3x + 1.|||Đổi x và y, giải: y(x − 2) = 3x + 1.'),
  Q('q7', 'Solve ln x + ln(x − 2) = ln 3.|||Giải ln x + ln(x − 2) = ln 3.',
    ['x = 3 or x = −1|||x = 3 hoặc x = −1', 'x = 3|||x = 3', 'x = −1|||x = −1', 'No solution|||Vô nghiệm'], 1,
    'x² − 2x − 3 = 0 gives 3 and −1, but the domain requires x > 2.|||x² − 2x − 3 = 0 cho 3 và −1, nhưng điều kiện x > 2.'),
  Q('q8', 'arcsin(sin(5π/6)) equals|||arcsin(sin(5π/6)) bằng',
    ['5π/6|||5π/6', 'π/6|||π/6', '−π/6|||−π/6', '1/2|||1/2'], 1,
    'sin(5π/6) = 1/2 and arcsin returns an angle in [−π/2, π/2], namely π/6.|||sin(5π/6) = 1/2 và arcsin trả góc trong [−π/2, π/2], tức π/6.'),
  Q('q9', 'Bacteria: N(t) = 500·2^(t/3) (t in hours). N(12) =|||Vi khuẩn: N(t) = 500·2^(t/3) (t tính bằng giờ). N(12) =',
    ['2000|||2000', '4000|||4000', '8000|||8000', '6000|||6000'], 2,
    '2^(12/3) = 2⁴ = 16; 500·16 = 8000.|||2^(12/3) = 2⁴ = 16; 500·16 = 8000.'),
]);

const ch1 = {
  title: 'Chapter 1 — Functions and models|||Chương 1 — Hàm số và mô hình',
  description: 'Hàm số, tập xác định, hàm hợp, các hàm sơ cấp, biến đổi đồ thị, lượng giác, hàm ngược, mũ và logarit (Stewart ch.1 · OpenStax Vol.1 ch.1).',
  lessons: [c11, c12, c13, q1],
};

// ───────────────────────────── Chương 2 — Giới hạn & liên tục ─────────────────────────────
const c21 = L('cal111-ts-2-1',
  '2.1 — The idea of a limit: tangents, velocity, one-sided and infinite limits|||2.1 — Ý tưởng giới hạn: tiếp tuyến, vận tốc, giới hạn một phía và vô cực',
  'Bài toán tiếp tuyến và vận tốc tức thời dẫn tới giới hạn; đoán giới hạn bằng bảng số; giới hạn một phía; giới hạn vô cực và tiệm cận đứng.',
  `<span class="eyebrow">CAL111 · Chapter 2 · Lesson 2.1</span>
<h2>The idea of a limit</h2>
<p class="lead">How fast is a falling stone moving <em>exactly</em> at t = 2 s? An average over an interval is easy; an instantaneous rate needs a new idea — let the interval shrink to zero. That idea is the <strong>limit</strong>.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain how the tangent and velocity problems lead to limits.</li><li>Estimate a limit from a table of values and from a graph.</li><li>Compute one-sided limits and decide when a two-sided limit exists.</li><li>Recognise infinite limits and vertical asymptotes.</li></ul>
<h3>📖 Lecture</h3>
<p>We write <strong>lim<sub>x→a</sub> f(x) = L</strong> if f(x) can be made as close to L as we like by taking x close enough to a, <em>but not equal to a</em>. The value f(a) itself does not matter — f need not even be defined at a.</p>
<p><strong>One-sided limits.</strong> lim<sub>x→a⁻</sub> f(x) uses only x &lt; a; lim<sub>x→a⁺</sub> f(x) uses only x &gt; a.</p>
<div class="formula"><span class="lbl">Existence of a two-sided limit</span>lim<sub>x→a</sub> f(x) = L  ⇔  lim<sub>x→a⁻</sub> f(x) = L  and  lim<sub>x→a⁺</sub> f(x) = L</div>
<p><strong>Infinite limits.</strong> If f(x) grows without bound as x → a we write lim f(x) = ∞ (the limit does not exist as a number, but we describe how it fails). Then the line x = a is a <strong>vertical asymptote</strong>. Example: lim<sub>x→3⁺</sub> 1/(x − 3) = +∞ and lim<sub>x→3⁻</sub> 1/(x − 3) = −∞.</p>
<p><strong>Tangent line problem.</strong> The slope of the secant through (a, f(a)) and (a + h, f(a + h)) is [f(a + h) − f(a)]/h. Letting h → 0 gives the slope of the tangent — this will be the derivative in Chapter 3.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — instantaneous velocity.</b> A stone falls s(t) = 4.9t<sup>2</sup> metres. Average velocity on [2, 2 + h]:</p>
<p>[4.9(2 + h)<sup>2</sup> − 4.9·4]/h = (19.6h + 4.9h<sup>2</sup>)/h = 19.6 + 4.9h.</p>
<p>h = 0.1 gives 20.09 m/s; h = 0.01 gives 19.649 m/s. As h → 0 the average tends to <b>19.6 m/s</b>, the instantaneous velocity at t = 2.</p></div>
<div class="callout"><p><b>Example 2 — numerical estimate.</b> Guess lim<sub>x→0</sub> (sin x)/x (x in radians).</p>
<p>x = 0.1: 0.998334;  x = 0.01: 0.999983. The values approach <b>1</b> (proved in Lesson 2.2 with the squeeze theorem).</p></div>
<div class="callout"><p><b>Example 3 — one-sided limits.</b> f(x) = |x|/x.</p>
<p>For x &gt; 0, f(x) = 1; for x &lt; 0, f(x) = −1. So lim<sub>x→0⁺</sub> f = 1, lim<sub>x→0⁻</sub> f = −1. They differ, hence <b>lim<sub>x→0</sub> f(x) does not exist</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking the limit is f(a). The limit describes values <em>near</em> a; f(a) may be different or undefined.</li><li>Trusting a table blindly: sin(π/x) gives 0 at x = 1, 0.1, 0.01, … but its limit at 0 does not exist. Tables suggest, they do not prove.</li><li>Writing “lim = ∞” and treating ∞ as a number in later arithmetic.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>lim<sub>x→a</sub> f(x) = L: f(x) near L when x near (not equal to) a.</li><li>Two-sided limit exists ⇔ both one-sided limits exist and are equal.</li><li>Infinite limit at a ⇒ vertical asymptote x = a.</li><li>Instantaneous velocity and tangent slope are limits of average rates.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/2-1-a-preview-of-calculus" target="_blank" rel="noopener">OpenStax — 2.1 A Preview of Calculus</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/2-2-the-limit-of-a-function" target="_blank" rel="noopener">OpenStax — 2.2 The Limit of a Function</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/OneSidedLimits.aspx" target="_blank" rel="noopener">Paul's Online Notes — One-Sided Limits</a></li><li><a href="https://www.3blue1brown.com/lessons/limits" target="_blank" rel="noopener">3Blue1Brown — Limits and the definition of derivatives</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Estimate lim<sub>x→2</sub> (x<sup>2</sup> − 4)/(x − 2) using x = 1.9, 1.99, 2.01, 2.1.</li><li>f(x) = x + 1 for x &lt; 1 and f(x) = 3x for x ≥ 1. Find both one-sided limits at 1. Does lim<sub>x→1</sub> f exist?</li><li>Find lim<sub>x→0</sub> 1/x<sup>2</sup> and name the asymptote.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Values 3.9, 3.99, 4.01, 4.1 → limit 4 (indeed (x − 2)(x + 2)/(x − 2) = x + 2). 2) Left limit 2, right limit 3; they differ, so the limit does not exist. 3) +∞ from both sides; vertical asymptote x = 0.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 2 · Bài 2.1</span>
<h2>Ý tưởng giới hạn</h2>
<p class="lead">Hòn đá rơi đang chuyển động nhanh cỡ nào <em>đúng</em> tại t = 2 s? Tính trung bình trên một khoảng thì dễ; tốc độ tức thời cần một ý tưởng mới — cho khoảng đó co về 0. Ý tưởng đó là <strong>giới hạn</strong>.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích vì sao bài toán tiếp tuyến và vận tốc dẫn tới giới hạn.</li><li>Ước lượng giới hạn từ bảng giá trị và từ đồ thị.</li><li>Tính giới hạn một phía và biết khi nào giới hạn hai phía tồn tại.</li><li>Nhận biết giới hạn vô cực và tiệm cận đứng.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Ta viết <strong>lim<sub>x→a</sub> f(x) = L</strong> nếu f(x) gần L tuỳ ý khi x đủ gần a, <em>nhưng x ≠ a</em>. Bản thân giá trị f(a) không quan trọng — f thậm chí không cần xác định tại a.</p>
<p><strong>Giới hạn một phía.</strong> lim<sub>x→a⁻</sub> f(x) chỉ dùng x &lt; a (bên trái); lim<sub>x→a⁺</sub> f(x) chỉ dùng x &gt; a (bên phải).</p>
<div class="formula"><span class="lbl">Điều kiện tồn tại giới hạn hai phía</span>lim<sub>x→a</sub> f(x) = L  ⇔  lim<sub>x→a⁻</sub> f(x) = L  và  lim<sub>x→a⁺</sub> f(x) = L</div>
<p><strong>Giới hạn vô cực.</strong> Nếu f(x) tăng không bị chặn khi x → a ta viết lim f(x) = ∞ (giới hạn không tồn tại như một số, nhưng ta mô tả cách nó “không tồn tại”). Khi đó đường x = a là <strong>tiệm cận đứng</strong>. Ví dụ: lim<sub>x→3⁺</sub> 1/(x − 3) = +∞ và lim<sub>x→3⁻</sub> 1/(x − 3) = −∞.</p>
<p><strong>Bài toán tiếp tuyến.</strong> Hệ số góc cát tuyến qua (a, f(a)) và (a + h, f(a + h)) là [f(a + h) − f(a)]/h. Cho h → 0 ta được hệ số góc tiếp tuyến — đó sẽ là đạo hàm ở Chương 3.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — vận tốc tức thời.</b> Hòn đá rơi được s(t) = 4,9t<sup>2</sup> mét. Vận tốc trung bình trên [2, 2 + h]:</p>
<p>[4,9(2 + h)<sup>2</sup> − 4,9·4]/h = (19,6h + 4,9h<sup>2</sup>)/h = 19,6 + 4,9h.</p>
<p>h = 0,1 cho 20,09 m/s; h = 0,01 cho 19,649 m/s. Khi h → 0 trung bình dần tới <b>19,6 m/s</b> — vận tốc tức thời tại t = 2.</p></div>
<div class="callout"><p><b>Ví dụ 2 — ước lượng bằng số.</b> Đoán lim<sub>x→0</sub> (sin x)/x (x tính bằng radian).</p>
<p>x = 0,1: 0,998334;  x = 0,01: 0,999983. Giá trị tiến tới <b>1</b> (sẽ chứng minh ở Bài 2.2 bằng định lý kẹp).</p></div>
<div class="callout"><p><b>Ví dụ 3 — giới hạn một phía.</b> f(x) = |x|/x.</p>
<p>Với x &gt; 0, f(x) = 1; với x &lt; 0, f(x) = −1. Vậy lim<sub>x→0⁺</sub> f = 1, lim<sub>x→0⁻</sub> f = −1. Hai giá trị khác nhau nên <b>lim<sub>x→0</sub> f(x) không tồn tại</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nghĩ giới hạn chính là f(a). Giới hạn mô tả giá trị <em>gần</em> a; f(a) có thể khác hoặc không xác định.</li><li>Tin bảng số một cách mù quáng: sin(π/x) bằng 0 tại x = 1; 0,1; 0,01; … nhưng giới hạn tại 0 không tồn tại. Bảng số gợi ý, không chứng minh.</li><li>Viết “lim = ∞” rồi coi ∞ như một số để tính tiếp.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>lim<sub>x→a</sub> f(x) = L: f(x) gần L khi x gần (khác) a.</li><li>Giới hạn hai phía tồn tại ⇔ hai giới hạn một phía tồn tại và bằng nhau.</li><li>Giới hạn vô cực tại a ⇒ tiệm cận đứng x = a.</li><li>Vận tốc tức thời và hệ số góc tiếp tuyến là giới hạn của tốc độ trung bình.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/2-1-a-preview-of-calculus" target="_blank" rel="noopener">OpenStax — 2.1 Nhìn trước giải tích</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/2-2-the-limit-of-a-function" target="_blank" rel="noopener">OpenStax — 2.2 Giới hạn của hàm số</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/OneSidedLimits.aspx" target="_blank" rel="noopener">Paul's Online Notes — Giới hạn một phía</a></li><li><a href="https://www.3blue1brown.com/lessons/limits" target="_blank" rel="noopener">3Blue1Brown — Giới hạn và định nghĩa đạo hàm</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Ước lượng lim<sub>x→2</sub> (x<sup>2</sup> − 4)/(x − 2) với x = 1,9; 1,99; 2,01; 2,1.</li><li>f(x) = x + 1 khi x &lt; 1 và f(x) = 3x khi x ≥ 1. Tìm hai giới hạn một phía tại 1. lim<sub>x→1</sub> f có tồn tại không?</li><li>Tìm lim<sub>x→0</sub> 1/x<sup>2</sup> và chỉ ra tiệm cận.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Giá trị 3,9; 3,99; 4,01; 4,1 → giới hạn 4 (thật vậy (x − 2)(x + 2)/(x − 2) = x + 2). 2) Trái bằng 2, phải bằng 3; khác nhau nên giới hạn không tồn tại. 3) +∞ từ cả hai phía; tiệm cận đứng x = 0.</p></div>`);

const c22 = L('cal111-ts-2-2',
  '2.2 — Computing limits: limit laws, algebra tricks and the squeeze theorem|||2.2 — Tính giới hạn: luật giới hạn, biến đổi đại số và định lý kẹp',
  'Luật giới hạn, thế trực tiếp, khử dạng 0/0 bằng phân tích nhân tử và nhân liên hợp, định lý kẹp, giới hạn lượng giác đặc biệt sin x / x.',
  `<span class="eyebrow">CAL111 · Chapter 2 · Lesson 2.2</span>
<h2>Computing limits</h2>
<p class="lead">Tables only guess. In practice we compute limits exactly with a short list of laws plus three algebra tricks. This toolkit is used in every later chapter.</p>
<h3>🎯 Objectives</h3>
<ul><li>Apply the limit laws and direct substitution.</li><li>Remove 0/0 forms by factoring or by multiplying by the conjugate.</li><li>Use the squeeze theorem.</li><li>Use lim<sub>x→0</sub> (sin x)/x = 1 and its variants.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Limit laws (when lim f and lim g exist)</span>lim (f ± g) = lim f ± lim g    lim (c·f) = c·lim f    lim (f·g) = lim f · lim g<br>lim (f/g) = lim f / lim g  (if lim g ≠ 0)    lim f<sup>n</sup> = (lim f)<sup>n</sup>    lim ⁿ√f = ⁿ√(lim f)</div>
<p><strong>Direct substitution.</strong> For polynomials, rational functions (where the denominator ≠ 0), roots, trig, exponentials and logs, lim<sub>x→a</sub> f(x) = f(a) whenever a is in the domain. Example: lim<sub>x→2</sub> (x<sup>3</sup> − 2x + 5) = 8 − 4 + 5 = 9.</p>
<p><strong>The 0/0 form</strong> is a signal to do algebra, not an answer. Two standard tricks: <em>factor and cancel</em> the common factor (x − a); or <em>multiply by the conjugate</em> when square roots appear.</p>
<div class="formula"><span class="lbl">Squeeze theorem</span>If g(x) ≤ f(x) ≤ h(x) near a and lim g = lim h = L, then lim f = L.</div>
<div class="formula"><span class="lbl">Special trigonometric limits</span>lim<sub>x→0</sub> (sin x)/x = 1    lim<sub>x→0</sub> (1 − cos x)/x = 0    lim<sub>x→0</sub> sin(kx)/x = k</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — factor.</b> lim<sub>x→3</sub> (x<sup>2</sup> − 9)/(x<sup>2</sup> − x − 6).</p><p>Substitution gives 0/0. Factor: (x − 3)(x + 3) / [(x − 3)(x + 2)] = (x + 3)/(x + 2) for x ≠ 3. Now substitute: 6/5. <b>Answer 6/5.</b></p></div>
<div class="callout"><p><b>Example 2 — conjugate.</b> lim<sub>x→0</sub> (√(x + 9) − 3)/x.</p><p>Multiply top and bottom by √(x + 9) + 3: [(x + 9) − 9] / [x(√(x + 9) + 3)] = 1/(√(x + 9) + 3) → 1/(3 + 3) = <b>1/6</b>.</p></div>
<div class="callout"><p><b>Example 3 — squeeze.</b> lim<sub>x→0</sub> x<sup>2</sup> sin(1/x).</p><p>Since −1 ≤ sin(1/x) ≤ 1, we have −x<sup>2</sup> ≤ x<sup>2</sup> sin(1/x) ≤ x<sup>2</sup>. Both bounds → 0, so the limit is <b>0</b> (even though sin(1/x) itself has no limit).</p></div>
<div class="callout"><p><b>Example 4 — trig.</b> lim<sub>x→0</sub> sin(5x)/x = lim 5·sin(5x)/(5x) = 5·1 = <b>5</b> (put u = 5x → 0).</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing “0/0 = 1” or “0/0 = 0”. 0/0 is indeterminate — simplify first.</li><li>Cancelling terms instead of factors: (x<sup>2</sup> − 9)/(x − 3) is not x − 3 + … ; factor x<sup>2</sup> − 9 = (x − 3)(x + 3).</li><li>Using lim (sin x)/x = 1 with x in degrees — it is false in degrees.</li><li>Claiming lim (f/g) = lim f / lim g when lim g = 0.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Try direct substitution first.</li><li>0/0 ⇒ factor &amp; cancel, or multiply by the conjugate.</li><li>Bounded × (something → 0) ⇒ squeeze theorem.</li><li>sin(kx)/x → k as x → 0.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/2-3-the-limit-laws" target="_blank" rel="noopener">OpenStax — 2.3 The Limit Laws</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/LimitsProperties.aspx" target="_blank" rel="noopener">Paul's Online Notes — Limit Properties</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ComputingLimits.aspx" target="_blank" rel="noopener">Paul's Online Notes — Computing Limits</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>lim<sub>x→4</sub> (√x − 2)/(x − 4).</li><li>lim<sub>x→0</sub> sin(3x)/sin(7x).</li><li>lim<sub>x→−1</sub> (x<sup>2</sup> + 3x + 2)/(x + 1).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) x − 4 = (√x − 2)(√x + 2), so the expression is 1/(√x + 2) → 1/4. 2) [3·sin(3x)/(3x)] / [7·sin(7x)/(7x)] → 3/7. 3) (x + 1)(x + 2)/(x + 1) = x + 2 → 1.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 2 · Bài 2.2</span>
<h2>Tính giới hạn</h2>
<p class="lead">Bảng số chỉ để đoán. Thực tế ta tính giới hạn chính xác bằng vài luật và ba mẹo đại số. Bộ công cụ này dùng ở mọi chương sau.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp dụng luật giới hạn và phép thế trực tiếp.</li><li>Khử dạng 0/0 bằng phân tích nhân tử hoặc nhân liên hợp.</li><li>Dùng định lý kẹp.</li><li>Dùng lim<sub>x→0</sub> (sin x)/x = 1 và các biến thể.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Luật giới hạn (khi lim f và lim g tồn tại)</span>lim (f ± g) = lim f ± lim g    lim (c·f) = c·lim f    lim (f·g) = lim f · lim g<br>lim (f/g) = lim f / lim g  (nếu lim g ≠ 0)    lim f<sup>n</sup> = (lim f)<sup>n</sup>    lim ⁿ√f = ⁿ√(lim f)</div>
<p><strong>Thế trực tiếp.</strong> Với đa thức, hàm hữu tỉ (mẫu ≠ 0), căn, lượng giác, mũ, logarit: lim<sub>x→a</sub> f(x) = f(a) khi a thuộc tập xác định. Ví dụ: lim<sub>x→2</sub> (x<sup>3</sup> − 2x + 5) = 8 − 4 + 5 = 9.</p>
<p><strong>Dạng 0/0</strong> là tín hiệu phải biến đổi, không phải đáp số. Hai mẹo chuẩn: <em>phân tích nhân tử rồi giản ước</em> nhân tử chung (x − a); hoặc <em>nhân liên hợp</em> khi có căn bậc hai.</p>
<div class="formula"><span class="lbl">Định lý kẹp</span>Nếu g(x) ≤ f(x) ≤ h(x) gần a và lim g = lim h = L thì lim f = L.</div>
<div class="formula"><span class="lbl">Giới hạn lượng giác đặc biệt</span>lim<sub>x→0</sub> (sin x)/x = 1    lim<sub>x→0</sub> (1 − cos x)/x = 0    lim<sub>x→0</sub> sin(kx)/x = k</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — phân tích nhân tử.</b> lim<sub>x→3</sub> (x<sup>2</sup> − 9)/(x<sup>2</sup> − x − 6).</p><p>Thế vào được 0/0. Phân tích: (x − 3)(x + 3) / [(x − 3)(x + 2)] = (x + 3)/(x + 2) với x ≠ 3. Giờ thế: 6/5. <b>Đáp số 6/5.</b></p></div>
<div class="callout"><p><b>Ví dụ 2 — nhân liên hợp.</b> lim<sub>x→0</sub> (√(x + 9) − 3)/x.</p><p>Nhân tử và mẫu với √(x + 9) + 3: [(x + 9) − 9] / [x(√(x + 9) + 3)] = 1/(√(x + 9) + 3) → 1/(3 + 3) = <b>1/6</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — định lý kẹp.</b> lim<sub>x→0</sub> x<sup>2</sup> sin(1/x).</p><p>Vì −1 ≤ sin(1/x) ≤ 1 nên −x<sup>2</sup> ≤ x<sup>2</sup> sin(1/x) ≤ x<sup>2</sup>. Hai cận → 0, nên giới hạn bằng <b>0</b> (dù bản thân sin(1/x) không có giới hạn).</p></div>
<div class="callout"><p><b>Ví dụ 4 — lượng giác.</b> lim<sub>x→0</sub> sin(5x)/x = lim 5·sin(5x)/(5x) = 5·1 = <b>5</b> (đặt u = 5x → 0).</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết “0/0 = 1” hay “0/0 = 0”. 0/0 là vô định — phải rút gọn trước.</li><li>Giản ước số hạng thay vì nhân tử: phải phân tích x<sup>2</sup> − 9 = (x − 3)(x + 3) rồi mới giản ước.</li><li>Dùng lim (sin x)/x = 1 với x tính bằng độ — sai khi dùng độ.</li><li>Viết lim (f/g) = lim f / lim g khi lim g = 0.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Luôn thử thế trực tiếp trước.</li><li>0/0 ⇒ phân tích &amp; giản ước, hoặc nhân liên hợp.</li><li>Bị chặn × (thứ → 0) ⇒ định lý kẹp.</li><li>sin(kx)/x → k khi x → 0.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/2-3-the-limit-laws" target="_blank" rel="noopener">OpenStax — 2.3 Luật giới hạn</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/LimitsProperties.aspx" target="_blank" rel="noopener">Paul's Online Notes — Tính chất giới hạn</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ComputingLimits.aspx" target="_blank" rel="noopener">Paul's Online Notes — Tính giới hạn</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>lim<sub>x→4</sub> (√x − 2)/(x − 4).</li><li>lim<sub>x→0</sub> sin(3x)/sin(7x).</li><li>lim<sub>x→−1</sub> (x<sup>2</sup> + 3x + 2)/(x + 1).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) x − 4 = (√x − 2)(√x + 2), nên biểu thức bằng 1/(√x + 2) → 1/4. 2) [3·sin(3x)/(3x)] / [7·sin(7x)/(7x)] → 3/7. 3) (x + 1)(x + 2)/(x + 1) = x + 2 → 1.</p></div>`);

const c23 = L('cal111-ts-2-3',
  '2.3 — Continuity and the Intermediate Value Theorem|||2.3 — Tính liên tục và định lý giá trị trung gian',
  'Ba điều kiện liên tục, các loại gián đoạn (khử được, nhảy, vô cực), tìm tham số để hàm liên tục, định lý giá trị trung gian và phương pháp chia đôi tìm nghiệm.',
  `<span class="eyebrow">CAL111 · Chapter 2 · Lesson 2.3</span>
<h2>Continuity and the Intermediate Value Theorem</h2>
<p class="lead">A continuous function is one you can draw without lifting the pen. That simple picture has a powerful consequence: if a continuous function changes sign, it must cross zero — the basis of every root-finding algorithm.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the definition of continuity at a point and on an interval.</li><li>Classify discontinuities as removable, jump or infinite.</li><li>Choose a parameter that makes a piecewise function continuous.</li><li>Apply the Intermediate Value Theorem (IVT) to prove a root exists, and locate it by bisection.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">f is continuous at a  ⇔  all three hold</span>1) f(a) is defined    2) lim<sub>x→a</sub> f(x) exists    3) lim<sub>x→a</sub> f(x) = f(a)</div>
<p>Types of discontinuity: <strong>removable</strong> (the limit exists but ≠ f(a) or f(a) undefined — a “hole”), <strong>jump</strong> (one-sided limits exist but differ), <strong>infinite</strong> (vertical asymptote).</p>
<p>Polynomials, rational functions, roots, trig, exponential and log functions are continuous <em>on their domains</em>. Sums, products, quotients (denominator ≠ 0) and compositions of continuous functions are continuous.</p>
<div class="formula"><span class="lbl">Intermediate Value Theorem</span>If f is continuous on [a, b] and N is between f(a) and f(b), then f(c) = N for some c in (a, b).<br>In particular: f(a) and f(b) of opposite signs ⇒ f has a root in (a, b).</div>
<p><strong>Bisection method:</strong> halve the interval, keep the half where the sign changes, repeat. Each step halves the error.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — choose k.</b> f(x) = kx + 1 for x ≤ 2 and f(x) = x<sup>2</sup> − k for x &gt; 2. Find k so f is continuous.</p><p>Left limit at 2: 2k + 1 (= f(2)). Right limit: 4 − k. Set equal: 2k + 1 = 4 − k ⇒ 3k = 3 ⇒ <b>k = 1</b>.</p></div>
<div class="callout"><p><b>Example 2 — removable discontinuity.</b> g(x) = (x<sup>2</sup> − 1)/(x − 1) is undefined at 1, but lim<sub>x→1</sub> g = lim (x + 1) = 2. Defining g(1) = 2 removes the hole.</p></div>
<div class="callout"><p><b>Example 3 — IVT + bisection.</b> Show x<sup>3</sup> + x − 1 = 0 has a root in (0, 1) and narrow it down.</p><p>f(0) = −1 &lt; 0, f(1) = 1 &gt; 0, f is a polynomial (continuous) ⇒ a root exists in (0, 1). f(0.5) = −0.375 &lt; 0 ⇒ root in (0.5, 1). f(0.75) = 0.171875 &gt; 0 ⇒ root in <b>(0.5, 0.75)</b>. (The actual root is ≈ 0.6823.)</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Checking only that f(a) exists. All three conditions are needed.</li><li>Applying the IVT to a function that is not continuous on [a, b]: 1/x changes sign on [−1, 1] but has no root.</li><li>Thinking the IVT tells you <em>where</em> the root is, or that there is only one. It guarantees existence only.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Continuous at a: f(a) defined, limit exists, limit = f(a).</li><li>Removable / jump / infinite discontinuities.</li><li>Elementary functions are continuous on their domains.</li><li>IVT: a sign change of a continuous function guarantees a root; bisection finds it.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/2-4-continuity" target="_blank" rel="noopener">OpenStax — 2.4 Continuity</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/Continuity.aspx" target="_blank" rel="noopener">Paul's Online Notes — Continuity</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>f(x) = (x<sup>2</sup> − 4)/(x − 2) for x ≠ 2 and f(2) = c. Which c makes f continuous?</li><li>Show cos x = x has a solution in (0, π/2).</li><li>Where is h(x) = ln(x − 1)/(x − 3) continuous?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) lim<sub>x→2</sub> (x + 2) = 4, so c = 4. 2) g(x) = cos x − x is continuous; g(0) = 1 &gt; 0, g(π/2) = −π/2 &lt; 0 ⇒ root by the IVT. 3) Need x &gt; 1 and x ≠ 3: (1, 3) ∪ (3, ∞).</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 2 · Bài 2.3</span>
<h2>Tính liên tục và định lý giá trị trung gian</h2>
<p class="lead">Hàm liên tục là hàm vẽ được mà không nhấc bút. Hình ảnh đơn giản ấy có hệ quả mạnh: nếu hàm liên tục đổi dấu thì nó phải cắt 0 — nền tảng của mọi thuật toán tìm nghiệm.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu định nghĩa liên tục tại một điểm và trên một khoảng.</li><li>Phân loại gián đoạn: khử được, nhảy, vô cực.</li><li>Chọn tham số để hàm cho bởi nhiều công thức liên tục.</li><li>Áp dụng định lý giá trị trung gian (IVT) để chứng minh có nghiệm, và khoanh vùng nghiệm bằng chia đôi.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">f liên tục tại a  ⇔  đủ cả ba</span>1) f(a) xác định    2) lim<sub>x→a</sub> f(x) tồn tại    3) lim<sub>x→a</sub> f(x) = f(a)</div>
<p>Các loại gián đoạn: <strong>khử được</strong> (giới hạn tồn tại nhưng ≠ f(a) hoặc f(a) không xác định — một “lỗ thủng”), <strong>nhảy</strong> (hai giới hạn một phía tồn tại nhưng khác nhau), <strong>vô cực</strong> (tiệm cận đứng).</p>
<p>Đa thức, hàm hữu tỉ, căn, lượng giác, mũ, logarit liên tục <em>trên tập xác định của chúng</em>. Tổng, tích, thương (mẫu ≠ 0) và hợp của các hàm liên tục là liên tục.</p>
<div class="formula"><span class="lbl">Định lý giá trị trung gian</span>Nếu f liên tục trên [a, b] và N nằm giữa f(a), f(b) thì f(c) = N với c nào đó trong (a, b).<br>Đặc biệt: f(a), f(b) trái dấu ⇒ f có nghiệm trong (a, b).</div>
<p><strong>Phương pháp chia đôi:</strong> chia đôi khoảng, giữ nửa có đổi dấu, lặp lại. Mỗi bước sai số giảm một nửa.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — chọn k.</b> f(x) = kx + 1 khi x ≤ 2 và f(x) = x<sup>2</sup> − k khi x &gt; 2. Tìm k để f liên tục.</p><p>Giới hạn trái tại 2: 2k + 1 (= f(2)). Giới hạn phải: 4 − k. Cho bằng nhau: 2k + 1 = 4 − k ⇒ 3k = 3 ⇒ <b>k = 1</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — gián đoạn khử được.</b> g(x) = (x<sup>2</sup> − 1)/(x − 1) không xác định tại 1, nhưng lim<sub>x→1</sub> g = lim (x + 1) = 2. Định nghĩa thêm g(1) = 2 là lấp được lỗ thủng.</p></div>
<div class="callout"><p><b>Ví dụ 3 — IVT + chia đôi.</b> Chứng minh x<sup>3</sup> + x − 1 = 0 có nghiệm trong (0, 1) và thu hẹp khoảng.</p><p>f(0) = −1 &lt; 0, f(1) = 1 &gt; 0, f là đa thức (liên tục) ⇒ có nghiệm trong (0, 1). f(0,5) = −0,375 &lt; 0 ⇒ nghiệm trong (0,5; 1). f(0,75) = 0,171875 &gt; 0 ⇒ nghiệm trong <b>(0,5; 0,75)</b>. (Nghiệm thật ≈ 0,6823.)</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chỉ kiểm f(a) tồn tại. Cần đủ cả ba điều kiện.</li><li>Áp IVT cho hàm không liên tục trên [a, b]: 1/x đổi dấu trên [−1, 1] nhưng không có nghiệm.</li><li>Nghĩ IVT cho biết nghiệm <em>ở đâu</em>, hoặc chỉ có một nghiệm. Nó chỉ bảo đảm tồn tại.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Liên tục tại a: f(a) xác định, giới hạn tồn tại, giới hạn = f(a).</li><li>Gián đoạn khử được / nhảy / vô cực.</li><li>Hàm sơ cấp liên tục trên tập xác định.</li><li>IVT: hàm liên tục đổi dấu ⇒ có nghiệm; chia đôi để tìm.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/2-4-continuity" target="_blank" rel="noopener">OpenStax — 2.4 Tính liên tục</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/Continuity.aspx" target="_blank" rel="noopener">Paul's Online Notes — Tính liên tục</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>f(x) = (x<sup>2</sup> − 4)/(x − 2) khi x ≠ 2 và f(2) = c. c bằng bao nhiêu thì f liên tục?</li><li>Chứng minh cos x = x có nghiệm trong (0, π/2).</li><li>h(x) = ln(x − 1)/(x − 3) liên tục ở đâu?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) lim<sub>x→2</sub> (x + 2) = 4, nên c = 4. 2) g(x) = cos x − x liên tục; g(0) = 1 &gt; 0, g(π/2) = −π/2 &lt; 0 ⇒ có nghiệm theo IVT. 3) Cần x &gt; 1 và x ≠ 3: (1, 3) ∪ (3, ∞).</p></div>`);

const c24 = L('cal111-ts-2-4',
  '2.4 — Limits at infinity, horizontal asymptotes and the precise definition|||2.4 — Giới hạn tại vô cực, tiệm cận ngang và định nghĩa chính xác (ε–δ)',
  'Giới hạn khi x → ±∞ của hàm hữu tỉ và hàm có căn, tiệm cận ngang/đứng, dạng ∞ − ∞, giới thiệu định nghĩa ε–δ của giới hạn.',
  `<span class="eyebrow">CAL111 · Chapter 2 · Lesson 2.4</span>
<h2>Limits at infinity and the precise definition</h2>
<p class="lead">What happens to f(x) in the long run, as x → ∞? The answer gives horizontal asymptotes — the steady state of a model. We finish the chapter with the rigorous ε–δ definition that makes “close to” exact.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute limits at ±∞ of rational and root expressions.</li><li>Find horizontal and vertical asymptotes.</li><li>Handle ∞ − ∞ by rationalising.</li><li>Read and use the ε–δ definition for a linear function.</li></ul>
<h3>📖 Lecture</h3>
<p>lim<sub>x→∞</sub> f(x) = L means f(x) gets arbitrarily close to L for large x; then y = L is a <strong>horizontal asymptote</strong>. Key facts: 1/x<sup>r</sup> → 0 for r &gt; 0; e<sup>−x</sup> → 0; arctan x → π/2 as x → ∞.</p>
<p><strong>Rational functions:</strong> divide numerator and denominator by the highest power of x in the denominator.</p>
<div class="formula"><span class="lbl">Rational p(x)/q(x) as x → ±∞</span>deg p &lt; deg q ⇒ limit 0    deg p = deg q ⇒ ratio of leading coefficients    deg p &gt; deg q ⇒ ±∞ (no horizontal asymptote)</div>
<p>With square roots, remember √(x<sup>2</sup>) = |x|, which equals −x when x → −∞.</p>
<div class="formula"><span class="lbl">Precise (ε–δ) definition</span>lim<sub>x→a</sub> f(x) = L  ⇔  for every ε &gt; 0 there is δ &gt; 0 such that 0 &lt; |x − a| &lt; δ ⇒ |f(x) − L| &lt; ε</div>
<p>Read it as a game: you challenge me with a tolerance ε for the output; I must answer with a tolerance δ for the input that always works.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> lim<sub>x→∞</sub> (3x<sup>2</sup> − x + 2)/(5x<sup>2</sup> + 4). Divide by x<sup>2</sup>: (3 − 1/x + 2/x<sup>2</sup>)/(5 + 4/x<sup>2</sup>) → <b>3/5</b>. Horizontal asymptote y = 3/5.</p></div>
<div class="callout"><p><b>Example 2 — ∞ − ∞.</b> lim<sub>x→∞</sub> (√(x<sup>2</sup> + x) − x). Multiply by the conjugate: x / (√(x<sup>2</sup> + x) + x) = 1/(√(1 + 1/x) + 1) → <b>1/2</b>.</p></div>
<div class="callout"><p><b>Example 3 — negative infinity.</b> lim<sub>x→−∞</sub> √(4x<sup>2</sup> + 1)/(x + 3). For x &lt; 0, √(4x<sup>2</sup> + 1) = |x|√(4 + 1/x<sup>2</sup>) = −x√(4 + 1/x<sup>2</sup>). So the ratio = −√(4 + 1/x<sup>2</sup>)/(1 + 3/x) → <b>−2</b>.</p></div>
<div class="callout"><p><b>Example 4 — ε–δ.</b> Prove lim<sub>x→3</sub> (2x − 1) = 5. |f(x) − 5| = |2x − 6| = 2|x − 3|. To make this &lt; ε, choose <b>δ = ε/2</b>: then |x − 3| &lt; δ ⇒ 2|x − 3| &lt; ε. ∎</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing ∞ − ∞ = 0 or ∞/∞ = 1. Both are indeterminate.</li><li>Forgetting √(x<sup>2</sup>) = |x| when x → −∞ (sign error, e.g. answer +2 instead of −2).</li><li>Believing a graph can never cross its horizontal asymptote — it can (e.g. (sin x)/x crosses y = 0 infinitely often).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Divide by the highest power in the denominator.</li><li>Compare degrees for rational functions.</li><li>∞ − ∞ with roots ⇒ multiply by the conjugate.</li><li>ε–δ: for every output tolerance ε there is an input tolerance δ.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-6-limits-at-infinity-and-asymptotes" target="_blank" rel="noopener">OpenStax — 4.6 Limits at Infinity and Asymptotes</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/2-5-the-precise-definition-of-a-limit" target="_blank" rel="noopener">OpenStax — 2.5 The Precise Definition of a Limit</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/LimitsAtInfinityI.aspx" target="_blank" rel="noopener">Paul's Online Notes — Limits at Infinity, Part I</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/DefnOfLimit.aspx" target="_blank" rel="noopener">Paul's Online Notes — The Definition of the Limit</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find all asymptotes of f(x) = (4x − 7)/(2x + 5).</li><li>lim<sub>x→∞</sub> (√(x<sup>2</sup> + 6x) − x).</li><li>For lim<sub>x→2</sub> (5x + 2) = 12, which δ works for a given ε?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Horizontal y = 4/2 = 2; vertical x = −5/2. 2) Conjugate: 6x/(√(x<sup>2</sup> + 6x) + x) → 6/2 = 3. 3) |5x + 2 − 12| = 5|x − 2| &lt; ε when δ = ε/5.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 2 · Bài 2.4</span>
<h2>Giới hạn tại vô cực và định nghĩa chính xác</h2>
<p class="lead">Về lâu dài f(x) ra sao khi x → ∞? Câu trả lời cho ta tiệm cận ngang — trạng thái ổn định của một mô hình. Cuối chương là định nghĩa ε–δ chặt chẽ, biến chữ “gần” thành chính xác.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính giới hạn tại ±∞ của biểu thức hữu tỉ và có căn.</li><li>Tìm tiệm cận ngang và tiệm cận đứng.</li><li>Khử dạng ∞ − ∞ bằng nhân liên hợp.</li><li>Đọc và dùng định nghĩa ε–δ cho hàm bậc nhất.</li></ul>
<h3>📖 Bài giảng</h3>
<p>lim<sub>x→∞</sub> f(x) = L nghĩa là f(x) gần L tuỳ ý khi x đủ lớn; khi đó y = L là <strong>tiệm cận ngang</strong>. Kết quả cần nhớ: 1/x<sup>r</sup> → 0 với r &gt; 0; e<sup>−x</sup> → 0; arctan x → π/2 khi x → ∞.</p>
<p><strong>Hàm hữu tỉ:</strong> chia cả tử và mẫu cho luỹ thừa cao nhất của x ở mẫu.</p>
<div class="formula"><span class="lbl">Hữu tỉ p(x)/q(x) khi x → ±∞</span>bậc p &lt; bậc q ⇒ giới hạn 0    bậc p = bậc q ⇒ tỉ số hệ số cao nhất    bậc p &gt; bậc q ⇒ ±∞ (không có tiệm cận ngang)</div>
<p>Khi có căn bậc hai, nhớ √(x<sup>2</sup>) = |x|, và bằng −x khi x → −∞.</p>
<div class="formula"><span class="lbl">Định nghĩa chính xác (ε–δ)</span>lim<sub>x→a</sub> f(x) = L  ⇔  với mọi ε &gt; 0 tồn tại δ &gt; 0 sao cho 0 &lt; |x − a| &lt; δ ⇒ |f(x) − L| &lt; ε</div>
<p>Hiểu như một trò chơi: bạn thách tôi bằng sai số ε cho đầu ra; tôi phải đáp lại bằng sai số δ cho đầu vào sao cho luôn thoả.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> lim<sub>x→∞</sub> (3x<sup>2</sup> − x + 2)/(5x<sup>2</sup> + 4). Chia cho x<sup>2</sup>: (3 − 1/x + 2/x<sup>2</sup>)/(5 + 4/x<sup>2</sup>) → <b>3/5</b>. Tiệm cận ngang y = 3/5.</p></div>
<div class="callout"><p><b>Ví dụ 2 — ∞ − ∞.</b> lim<sub>x→∞</sub> (√(x<sup>2</sup> + x) − x). Nhân liên hợp: x / (√(x<sup>2</sup> + x) + x) = 1/(√(1 + 1/x) + 1) → <b>1/2</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — âm vô cực.</b> lim<sub>x→−∞</sub> √(4x<sup>2</sup> + 1)/(x + 3). Với x &lt; 0, √(4x<sup>2</sup> + 1) = |x|√(4 + 1/x<sup>2</sup>) = −x√(4 + 1/x<sup>2</sup>). Vậy tỉ số = −√(4 + 1/x<sup>2</sup>)/(1 + 3/x) → <b>−2</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4 — ε–δ.</b> Chứng minh lim<sub>x→3</sub> (2x − 1) = 5. |f(x) − 5| = |2x − 6| = 2|x − 3|. Muốn nó &lt; ε, chọn <b>δ = ε/2</b>: khi đó |x − 3| &lt; δ ⇒ 2|x − 3| &lt; ε. ∎</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết ∞ − ∞ = 0 hay ∞/∞ = 1. Cả hai đều vô định.</li><li>Quên √(x<sup>2</sup>) = |x| khi x → −∞ (sai dấu, ra +2 thay vì −2).</li><li>Tin rằng đồ thị không bao giờ cắt tiệm cận ngang — có thể cắt (vd (sin x)/x cắt y = 0 vô số lần).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Chia cho luỹ thừa cao nhất ở mẫu.</li><li>So bậc với hàm hữu tỉ.</li><li>∞ − ∞ có căn ⇒ nhân liên hợp.</li><li>ε–δ: với mọi sai số đầu ra ε có sai số đầu vào δ.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-6-limits-at-infinity-and-asymptotes" target="_blank" rel="noopener">OpenStax — 4.6 Giới hạn tại vô cực và tiệm cận</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/2-5-the-precise-definition-of-a-limit" target="_blank" rel="noopener">OpenStax — 2.5 Định nghĩa chính xác của giới hạn</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/LimitsAtInfinityI.aspx" target="_blank" rel="noopener">Paul's Online Notes — Giới hạn tại vô cực, phần I</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/DefnOfLimit.aspx" target="_blank" rel="noopener">Paul's Online Notes — Định nghĩa giới hạn</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm mọi tiệm cận của f(x) = (4x − 7)/(2x + 5).</li><li>lim<sub>x→∞</sub> (√(x<sup>2</sup> + 6x) − x).</li><li>Với lim<sub>x→2</sub> (5x + 2) = 12, chọn δ nào theo ε?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Ngang y = 4/2 = 2; đứng x = −5/2. 2) Liên hợp: 6x/(√(x<sup>2</sup> + 6x) + x) → 6/2 = 3. 3) |5x + 2 − 12| = 5|x − 2| &lt; ε khi δ = ε/5.</p></div>`);

const q2 = QZ(2, 'Quiz — Chapter 2: Limits & continuity|||Quiz — Chương 2: Giới hạn & liên tục', 'Kiểm tra chương 2: giới hạn một phía, khử 0/0, định lý kẹp, liên tục, IVT, giới hạn tại vô cực.', [
  Q('q1', 'lim (x→3) (x² − 9)/(x² − x − 6) =|||lim (x→3) (x² − 9)/(x² − x − 6) =',
    ['0|||0', '1|||1', '6/5|||6/5', 'does not exist|||không tồn tại'], 2,
    'Factor: (x + 3)/(x + 2) → 6/5.|||Phân tích: (x + 3)/(x + 2) → 6/5.'),
  Q('q2', 'lim (x→0) (√(x + 9) − 3)/x =|||lim (x→0) (√(x + 9) − 3)/x =',
    ['1/3|||1/3', '1/6|||1/6', '0|||0', '3|||3'], 1,
    'Multiply by the conjugate: 1/(√(x + 9) + 3) → 1/6.|||Nhân liên hợp: 1/(√(x + 9) + 3) → 1/6.'),
  Q('q3', 'lim (x→0) sin(5x)/x =|||lim (x→0) sin(5x)/x =',
    ['1|||1', '0|||0', '5|||5', '1/5|||1/5'], 2,
    'sin(5x)/x = 5·sin(5x)/(5x) → 5.|||sin(5x)/x = 5·sin(5x)/(5x) → 5.'),
  Q('q4', 'For f(x) = |x|/x, lim (x→0) f(x)|||Với f(x) = |x|/x, lim (x→0) f(x)',
    ['= 1|||= 1', '= −1|||= −1', '= 0|||= 0', 'does not exist|||không tồn tại'], 3,
    'Right limit 1, left limit −1: they differ.|||Giới hạn phải 1, trái −1: khác nhau.'),
  Q('q5', 'lim (x→0) x² sin(1/x) =|||lim (x→0) x² sin(1/x) =',
    ['0 (squeeze theorem)|||0 (định lý kẹp)', '1|||1', 'does not exist|||không tồn tại', '∞|||∞'], 0,
    '−x² ≤ x² sin(1/x) ≤ x², both bounds → 0.|||−x² ≤ x² sin(1/x) ≤ x², hai cận → 0.'),
  Q('q6', 'f(x) = kx + 1 (x ≤ 2), x² − k (x > 2) is continuous when k =|||f(x) = kx + 1 (x ≤ 2), x² − k (x > 2) liên tục khi k =',
    ['0|||0', '1|||1', '2|||2', '3|||3'], 1,
    '2k + 1 = 4 − k ⇒ k = 1.|||2k + 1 = 4 − k ⇒ k = 1.'),
  Q('q7', 'By the IVT, x³ + x − 1 = 0 has a root in which interval?|||Theo IVT, x³ + x − 1 = 0 có nghiệm trong khoảng nào?',
    ['(−1, 0)|||(−1, 0)', '(0.5, 0.75)|||(0,5; 0,75)', '(1, 2)|||(1, 2)', '(0.75, 1) only|||chỉ (0,75; 1)'], 1,
    'f(0.5) = −0.375 < 0 and f(0.75) = 0.171875 > 0.|||f(0,5) = −0,375 < 0 và f(0,75) = 0,171875 > 0.'),
  Q('q8', 'The horizontal asymptote of (3x² − x + 2)/(5x² + 4) is|||Tiệm cận ngang của (3x² − x + 2)/(5x² + 4) là',
    ['y = 0|||y = 0', 'y = 3/5|||y = 3/5', 'y = 1/2|||y = 1/2', 'none|||không có'], 1,
    'Equal degrees: ratio of leading coefficients 3/5.|||Cùng bậc: tỉ số hệ số cao nhất 3/5.'),
  Q('q9', 'lim (x→−∞) √(4x² + 1)/(x + 3) =|||lim (x→−∞) √(4x² + 1)/(x + 3) =',
    ['2|||2', '−2|||−2', '4|||4', '0|||0'], 1,
    'For x < 0, √(x²) = −x, so the limit is −2.|||Với x < 0, √(x²) = −x, nên giới hạn là −2.'),
  Q('q10', 'lim (x→∞) (√(x² + x) − x) =|||lim (x→∞) (√(x² + x) − x) =',
    ['0|||0', '1|||1', '1/2|||1/2', '∞|||∞'], 2,
    'Conjugate: x/(√(x² + x) + x) → 1/2.|||Liên hợp: x/(√(x² + x) + x) → 1/2.'),
]);

const ch2 = {
  title: 'Chapter 2 — Limits and continuity|||Chương 2 — Giới hạn và tính liên tục',
  description: 'Ý tưởng giới hạn, luật giới hạn và kỹ thuật khử dạng vô định, định lý kẹp, liên tục và IVT, giới hạn tại vô cực, định nghĩa ε–δ (Stewart ch.2 · OpenStax ch.2).',
  lessons: [c21, c22, c23, c24, q2],
};

// ───────────────────────────── Chương 3 — Đạo hàm ─────────────────────────────
const c31 = L('cal111-ts-3-1',
  '3.1 — The derivative: definition, tangent lines and rates of change|||3.1 — Đạo hàm: định nghĩa, tiếp tuyến và tốc độ thay đổi',
  'Đạo hàm là giới hạn của tỉ số sai phân; tính đạo hàm từ định nghĩa; phương trình tiếp tuyến; đạo hàm như hàm số; khả vi kéo theo liên tục; |x| không khả vi tại 0.',
  `<span class="eyebrow">CAL111 · Chapter 3 · Lesson 3.1</span>
<h2>The derivative: definition, tangents and rates</h2>
<p class="lead">The derivative is the single most important idea of the course: the instantaneous rate of change of a function, equal to the slope of its tangent line. In machine learning, every training step uses it.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write the derivative as a limit of difference quotients.</li><li>Compute derivatives directly from the definition.</li><li>Find the equation of a tangent line.</li><li>Relate differentiability and continuity; spot corners where f′ does not exist.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Derivative of f at a</span>f′(a) = lim<sub>h→0</sub> [f(a + h) − f(a)] / h    (equivalently  lim<sub>x→a</sub> [f(x) − f(a)] / (x − a))</div>
<p>Interpretations: f′(a) is the <strong>slope of the tangent</strong> to y = f(x) at (a, f(a)); if s(t) is position, s′(t) is <strong>velocity</strong>; in general it is the <strong>instantaneous rate of change</strong> of y with respect to x, in units of “y-units per x-unit”.</p>
<div class="formula"><span class="lbl">Tangent line at x = a</span>y − f(a) = f′(a)(x − a)</div>
<p>Letting a vary gives the <strong>derivative function</strong> f′(x). Other notations: dy/dx, df/dx, Df. If f′(a) exists, f is <strong>differentiable</strong> at a.</p>
<div class="formula"><span class="lbl">Key theorem</span>differentiable at a ⇒ continuous at a    (the converse is false)</div>
<p>A function fails to be differentiable at a <strong>corner</strong> (|x| at 0), a <strong>cusp</strong>, a <strong>vertical tangent</strong> (∛x at 0) or a <strong>discontinuity</strong>.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> f(x) = x<sup>2</sup>. Find f′(3) and the tangent at (3, 9).</p><p>[(3 + h)<sup>2</sup> − 9]/h = (6h + h<sup>2</sup>)/h = 6 + h → 6. So f′(3) = 6 and the tangent is y − 9 = 6(x − 3), i.e. <b>y = 6x − 9</b>.</p></div>
<div class="callout"><p><b>Example 2.</b> f(x) = 1/x. [1/(x + h) − 1/x]/h = [x − (x + h)] / [h·x(x + h)] = −1/[x(x + h)] → <b>−1/x<sup>2</sup></b>.</p></div>
<div class="callout"><p><b>Example 3.</b> f(x) = √x. Multiply by the conjugate: [√(x + h) − √x]/h = h / [h(√(x + h) + √x)] → <b>1/(2√x)</b> (x &gt; 0).</p></div>
<div class="callout"><p><b>Example 4 — a corner.</b> f(x) = |x| at 0: [|h| − 0]/h equals 1 for h &gt; 0 and −1 for h &lt; 0. The one-sided limits differ, so f′(0) <b>does not exist</b>, although |x| is continuous at 0.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Expanding f(x + h) wrongly — always write it in full before subtracting f(x).</li><li>Setting h = 0 before cancelling h: that gives 0/0.</li><li>Using f′(a) as the y-intercept of the tangent. Use point–slope form.</li><li>Believing “continuous ⇒ differentiable”.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>f′(a) = lim [f(a + h) − f(a)]/h.</li><li>Slope of tangent = instantaneous rate = velocity.</li><li>Tangent: y − f(a) = f′(a)(x − a).</li><li>Differentiable ⇒ continuous; corners, cusps, vertical tangents break differentiability.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-1-defining-the-derivative" target="_blank" rel="noopener">OpenStax — 3.1 Defining the Derivative</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-2-the-derivative-as-a-function" target="_blank" rel="noopener">OpenStax — 3.2 The Derivative as a Function</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/DefnOfDerivative.aspx" target="_blank" rel="noopener">Paul's Online Notes — The Definition of the Derivative</a></li><li><a href="https://www.3blue1brown.com/lessons/derivatives" target="_blank" rel="noopener">3Blue1Brown — The paradox of the derivative</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Use the definition to find f′(x) for f(x) = 3x<sup>2</sup> − 5x.</li><li>Find the tangent line to that f at x = 1.</li><li>A particle has position s(t) = t<sup>3</sup> m. Find its velocity at t = 2 s using the definition.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) [3(x + h)<sup>2</sup> − 5(x + h) − 3x<sup>2</sup> + 5x]/h = 6x + 3h − 5 → f′(x) = 6x − 5. 2) f(1) = −2, f′(1) = 1 ⇒ y = x − 3. 3) [(2 + h)<sup>3</sup> − 8]/h = 12 + 6h + h<sup>2</sup> → 12 m/s.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 3 · Bài 3.1</span>
<h2>Đạo hàm: định nghĩa, tiếp tuyến và tốc độ</h2>
<p class="lead">Đạo hàm là ý tưởng quan trọng nhất của môn: tốc độ thay đổi tức thời của hàm, bằng hệ số góc tiếp tuyến. Trong học máy, mỗi bước huấn luyện đều dùng nó.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết đạo hàm dưới dạng giới hạn của tỉ số sai phân.</li><li>Tính đạo hàm trực tiếp từ định nghĩa.</li><li>Viết phương trình tiếp tuyến.</li><li>Liên hệ khả vi và liên tục; nhận ra điểm góc nơi f′ không tồn tại.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Đạo hàm của f tại a</span>f′(a) = lim<sub>h→0</sub> [f(a + h) − f(a)] / h    (tương đương  lim<sub>x→a</sub> [f(x) − f(a)] / (x − a))</div>
<p>Ý nghĩa: f′(a) là <strong>hệ số góc tiếp tuyến</strong> của y = f(x) tại (a, f(a)); nếu s(t) là vị trí thì s′(t) là <strong>vận tốc</strong>; tổng quát là <strong>tốc độ thay đổi tức thời</strong> của y theo x, đơn vị “đơn vị y trên một đơn vị x”.</p>
<div class="formula"><span class="lbl">Tiếp tuyến tại x = a</span>y − f(a) = f′(a)(x − a)</div>
<p>Cho a thay đổi ta được <strong>hàm đạo hàm</strong> f′(x). Ký hiệu khác: dy/dx, df/dx, Df. Nếu f′(a) tồn tại thì f <strong>khả vi</strong> tại a.</p>
<div class="formula"><span class="lbl">Định lý then chốt</span>khả vi tại a ⇒ liên tục tại a    (chiều ngược lại sai)</div>
<p>Hàm không khả vi tại <strong>điểm góc</strong> (|x| tại 0), <strong>điểm nhọn</strong>, <strong>tiếp tuyến đứng</strong> (∛x tại 0) hoặc <strong>điểm gián đoạn</strong>.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> f(x) = x<sup>2</sup>. Tìm f′(3) và tiếp tuyến tại (3, 9).</p><p>[(3 + h)<sup>2</sup> − 9]/h = (6h + h<sup>2</sup>)/h = 6 + h → 6. Vậy f′(3) = 6 và tiếp tuyến y − 9 = 6(x − 3), tức <b>y = 6x − 9</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2.</b> f(x) = 1/x. [1/(x + h) − 1/x]/h = [x − (x + h)] / [h·x(x + h)] = −1/[x(x + h)] → <b>−1/x<sup>2</sup></b>.</p></div>
<div class="callout"><p><b>Ví dụ 3.</b> f(x) = √x. Nhân liên hợp: [√(x + h) − √x]/h = h / [h(√(x + h) + √x)] → <b>1/(2√x)</b> (x &gt; 0).</p></div>
<div class="callout"><p><b>Ví dụ 4 — điểm góc.</b> f(x) = |x| tại 0: [|h| − 0]/h bằng 1 khi h &gt; 0 và −1 khi h &lt; 0. Hai giới hạn một phía khác nhau nên f′(0) <b>không tồn tại</b>, dù |x| liên tục tại 0.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Khai triển f(x + h) sai — luôn viết đầy đủ trước khi trừ f(x).</li><li>Cho h = 0 trước khi giản ước h: ra 0/0.</li><li>Lấy f′(a) làm tung độ gốc của tiếp tuyến. Hãy dùng dạng điểm – hệ số góc.</li><li>Tin rằng “liên tục ⇒ khả vi”.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>f′(a) = lim [f(a + h) − f(a)]/h.</li><li>Hệ số góc tiếp tuyến = tốc độ tức thời = vận tốc.</li><li>Tiếp tuyến: y − f(a) = f′(a)(x − a).</li><li>Khả vi ⇒ liên tục; điểm góc, điểm nhọn, tiếp tuyến đứng làm mất khả vi.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-1-defining-the-derivative" target="_blank" rel="noopener">OpenStax — 3.1 Định nghĩa đạo hàm</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-2-the-derivative-as-a-function" target="_blank" rel="noopener">OpenStax — 3.2 Đạo hàm như một hàm số</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/DefnOfDerivative.aspx" target="_blank" rel="noopener">Paul's Online Notes — Định nghĩa đạo hàm</a></li><li><a href="https://www.3blue1brown.com/lessons/derivatives" target="_blank" rel="noopener">3Blue1Brown — Nghịch lý của đạo hàm</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Dùng định nghĩa tìm f′(x) với f(x) = 3x<sup>2</sup> − 5x.</li><li>Viết tiếp tuyến của f đó tại x = 1.</li><li>Chất điểm có vị trí s(t) = t<sup>3</sup> m. Tìm vận tốc tại t = 2 s bằng định nghĩa.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) [3(x + h)<sup>2</sup> − 5(x + h) − 3x<sup>2</sup> + 5x]/h = 6x + 3h − 5 → f′(x) = 6x − 5. 2) f(1) = −2, f′(1) = 1 ⇒ y = x − 3. 3) [(2 + h)<sup>3</sup> − 8]/h = 12 + 6h + h<sup>2</sup> → 12 m/s.</p></div>`);

const c32 = L('cal111-ts-3-2',
  '3.2 — Differentiation rules: power, sum, product and quotient; higher derivatives|||3.2 — Quy tắc đạo hàm: luỹ thừa, tổng, tích, thương; đạo hàm cấp cao',
  'Quy tắc hằng số, luỹ thừa, tổng/hiệu, tích, thương; đạo hàm cấp hai; vận tốc – gia tốc; viết tiếp tuyến nhanh.',
  `<span class="eyebrow">CAL111 · Chapter 3 · Lesson 3.2</span>
<h2>Differentiation rules</h2>
<p class="lead">Computing every derivative from the limit definition would be painful. A handful of rules, each proved once from the definition, lets us differentiate any polynomial or rational function in seconds.</p>
<h3>🎯 Objectives</h3>
<ul><li>Apply the constant, power, constant-multiple and sum rules.</li><li>Use the product and quotient rules correctly.</li><li>Rewrite roots and reciprocals as powers before differentiating.</li><li>Compute second derivatives and interpret acceleration.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Basic rules</span>(c)′ = 0    (x<sup>n</sup>)′ = n x<sup>n−1</sup> (any real n)    (c·f)′ = c·f′    (f ± g)′ = f′ ± g′</div>
<div class="formula"><span class="lbl">Product and quotient rules</span>(f·g)′ = f′g + fg′        (f/g)′ = (f′g − fg′) / g<sup>2</sup></div>
<p>Memory aid for the quotient rule: “low d-high minus high d-low, over low squared”. The order in the numerator matters because of the minus sign.</p>
<p><strong>Higher derivatives.</strong> f″ = (f′)′, f‴, f<sup>(4)</sup>, … If s(t) is position, v = s′ is velocity and a = v′ = s″ is acceleration. The particle is speeding up when v and a have the same sign.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> d/dx (4x<sup>5</sup> − 3x<sup>2</sup> + 7x − 2) = <b>20x<sup>4</sup> − 6x + 7</b>.</p></div>
<div class="callout"><p><b>Example 2 — rewrite as powers.</b> y = √(x<sup>3</sup>) + 1/x<sup>2</sup> = x<sup>3/2</sup> + x<sup>−2</sup> ⇒ y′ = <b>(3/2)x<sup>1/2</sup> − 2x<sup>−3</sup></b>.</p></div>
<div class="callout"><p><b>Example 3 — product rule.</b> y = (x<sup>2</sup> + 1)(x<sup>3</sup> − 2x).</p><p>y′ = 2x(x<sup>3</sup> − 2x) + (x<sup>2</sup> + 1)(3x<sup>2</sup> − 2) = 2x<sup>4</sup> − 4x<sup>2</sup> + 3x<sup>4</sup> + x<sup>2</sup> − 2 = <b>5x<sup>4</sup> − 3x<sup>2</sup> − 2</b>. Check by expanding first: y = x<sup>5</sup> − x<sup>3</sup> − 2x ⇒ same answer.</p></div>
<div class="callout"><p><b>Example 4 — quotient rule.</b> y = x<sup>2</sup>/(x + 1). y′ = [2x(x + 1) − x<sup>2</sup>·1]/(x + 1)<sup>2</sup> = <b>(x<sup>2</sup> + 2x)/(x + 1)<sup>2</sup></b>.</p></div>
<div class="callout"><p><b>Example 5 — motion.</b> s(t) = t<sup>3</sup> − 6t<sup>2</sup> + 9t. v = 3t<sup>2</sup> − 12t + 9 = 3(t − 1)(t − 3), a = 6t − 12. The particle stops at t = 1 and t = 3; for 1 &lt; t &lt; 3 it moves backwards (v &lt; 0).</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>(fg)′ = f′g′ — wrong! Use f′g + fg′.</li><li>Reversing the numerator of the quotient rule (sign error).</li><li>d/dx (1/x<sup>2</sup>) = 1/(2x) — wrong. Write x<sup>−2</sup>, then −2x<sup>−3</sup>.</li><li>Applying the power rule to e<sup>x</sup> or 2<sup>x</sup> (variable exponent) — those have their own rules (Lesson 3.3).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>(x<sup>n</sup>)′ = nx<sup>n−1</sup> for every real n.</li><li>Product: f′g + fg′. Quotient: (f′g − fg′)/g<sup>2</sup>.</li><li>Rewrite roots/reciprocals as powers first.</li><li>s′ = v, s″ = a.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-3-differentiation-rules" target="_blank" rel="noopener">OpenStax — 3.3 Differentiation Rules</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-4-derivatives-as-rates-of-change" target="_blank" rel="noopener">OpenStax — 3.4 Derivatives as Rates of Change</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ProductQuotientRule.aspx" target="_blank" rel="noopener">Paul's Online Notes — Product and Quotient Rule</a></li><li><a href="https://www.3blue1brown.com/lessons/chain-rule-and-product-rule" target="_blank" rel="noopener">3Blue1Brown — Visualizing the chain rule and product rule</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Differentiate y = (3x − 1)/(2x + 5).</li><li>Find the tangent to y = x<sup>3</sup> − 3x at x = 2.</li><li>Find f″(x) for f(x) = x<sup>4</sup> − x.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) [3(2x + 5) − 2(3x − 1)]/(2x + 5)<sup>2</sup> = 17/(2x + 5)<sup>2</sup>. 2) y(2) = 2, y′ = 3x<sup>2</sup> − 3 = 9 ⇒ y = 9x − 16. 3) f′ = 4x<sup>3</sup> − 1, f″ = 12x<sup>2</sup>.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 3 · Bài 3.2</span>
<h2>Quy tắc tính đạo hàm</h2>
<p class="lead">Tính mọi đạo hàm bằng định nghĩa giới hạn thì rất mệt. Vài quy tắc, mỗi quy tắc chứng minh một lần từ định nghĩa, giúp ta đạo hàm mọi đa thức hay hàm hữu tỉ trong vài giây.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp dụng quy tắc hằng số, luỹ thừa, nhân hằng số và tổng.</li><li>Dùng đúng quy tắc tích và thương.</li><li>Viết căn và nghịch đảo thành luỹ thừa trước khi đạo hàm.</li><li>Tính đạo hàm cấp hai và hiểu gia tốc.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Quy tắc cơ bản</span>(c)′ = 0    (x<sup>n</sup>)′ = n x<sup>n−1</sup> (n thực bất kỳ)    (c·f)′ = c·f′    (f ± g)′ = f′ ± g′</div>
<div class="formula"><span class="lbl">Quy tắc tích và thương</span>(f·g)′ = f′g + fg′        (f/g)′ = (f′g − fg′) / g<sup>2</sup></div>
<p>Mẹo nhớ quy tắc thương: “đạo tử nhân mẫu trừ tử nhân đạo mẫu, chia mẫu bình phương”. Thứ tự ở tử rất quan trọng vì có dấu trừ.</p>
<p><strong>Đạo hàm cấp cao.</strong> f″ = (f′)′, f‴, f<sup>(4)</sup>, … Nếu s(t) là vị trí thì v = s′ là vận tốc và a = v′ = s″ là gia tốc. Chất điểm đang nhanh dần khi v và a cùng dấu.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> d/dx (4x<sup>5</sup> − 3x<sup>2</sup> + 7x − 2) = <b>20x<sup>4</sup> − 6x + 7</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — viết thành luỹ thừa.</b> y = √(x<sup>3</sup>) + 1/x<sup>2</sup> = x<sup>3/2</sup> + x<sup>−2</sup> ⇒ y′ = <b>(3/2)x<sup>1/2</sup> − 2x<sup>−3</sup></b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — quy tắc tích.</b> y = (x<sup>2</sup> + 1)(x<sup>3</sup> − 2x).</p><p>y′ = 2x(x<sup>3</sup> − 2x) + (x<sup>2</sup> + 1)(3x<sup>2</sup> − 2) = 2x<sup>4</sup> − 4x<sup>2</sup> + 3x<sup>4</sup> + x<sup>2</sup> − 2 = <b>5x<sup>4</sup> − 3x<sup>2</sup> − 2</b>. Kiểm bằng cách khai triển trước: y = x<sup>5</sup> − x<sup>3</sup> − 2x ⇒ cùng kết quả.</p></div>
<div class="callout"><p><b>Ví dụ 4 — quy tắc thương.</b> y = x<sup>2</sup>/(x + 1). y′ = [2x(x + 1) − x<sup>2</sup>·1]/(x + 1)<sup>2</sup> = <b>(x<sup>2</sup> + 2x)/(x + 1)<sup>2</sup></b>.</p></div>
<div class="callout"><p><b>Ví dụ 5 — chuyển động.</b> s(t) = t<sup>3</sup> − 6t<sup>2</sup> + 9t. v = 3t<sup>2</sup> − 12t + 9 = 3(t − 1)(t − 3), a = 6t − 12. Chất điểm dừng tại t = 1 và t = 3; khi 1 &lt; t &lt; 3 nó đi lùi (v &lt; 0).</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>(fg)′ = f′g′ — sai! Phải là f′g + fg′.</li><li>Đảo thứ tự tử số của quy tắc thương (sai dấu).</li><li>d/dx (1/x<sup>2</sup>) = 1/(2x) — sai. Viết x<sup>−2</sup>, ra −2x<sup>−3</sup>.</li><li>Dùng quy tắc luỹ thừa cho e<sup>x</sup> hay 2<sup>x</sup> (số mũ là biến) — chúng có quy tắc riêng (Bài 3.3).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>(x<sup>n</sup>)′ = nx<sup>n−1</sup> với mọi n thực.</li><li>Tích: f′g + fg′. Thương: (f′g − fg′)/g<sup>2</sup>.</li><li>Viết căn/nghịch đảo thành luỹ thừa trước.</li><li>s′ = v, s″ = a.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-3-differentiation-rules" target="_blank" rel="noopener">OpenStax — 3.3 Quy tắc đạo hàm</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-4-derivatives-as-rates-of-change" target="_blank" rel="noopener">OpenStax — 3.4 Đạo hàm là tốc độ thay đổi</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ProductQuotientRule.aspx" target="_blank" rel="noopener">Paul's Online Notes — Quy tắc tích và thương</a></li><li><a href="https://www.3blue1brown.com/lessons/chain-rule-and-product-rule" target="_blank" rel="noopener">3Blue1Brown — Trực quan quy tắc dây chuyền và quy tắc tích</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Đạo hàm y = (3x − 1)/(2x + 5).</li><li>Viết tiếp tuyến của y = x<sup>3</sup> − 3x tại x = 2.</li><li>Tìm f″(x) với f(x) = x<sup>4</sup> − x.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) [3(2x + 5) − 2(3x − 1)]/(2x + 5)<sup>2</sup> = 17/(2x + 5)<sup>2</sup>. 2) y(2) = 2, y′ = 3x<sup>2</sup> − 3 = 9 ⇒ y = 9x − 16. 3) f′ = 4x<sup>3</sup> − 1, f″ = 12x<sup>2</sup>.</p></div>`);

const c33 = L('cal111-ts-3-3',
  '3.3 — Derivatives of trigonometric, exponential and logarithmic functions|||3.3 — Đạo hàm hàm lượng giác, hàm mũ và hàm logarit',
  'Đạo hàm sin, cos, tan, sec; đạo hàm eˣ, aˣ, ln x, logₐx; kết hợp với quy tắc tích/thương; tiếp tuyến nằm ngang.',
  `<span class="eyebrow">CAL111 · Chapter 3 · Lesson 3.3</span>
<h2>Derivatives of trig, exponential and log functions</h2>
<p class="lead">Waves, oscillations, growth and decay are described by sin, cos, e<sup>x</sup> and ln x. Their derivatives are short and beautiful — e<sup>x</sup> is its own derivative — and must be memorised.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the derivatives of the six trigonometric functions.</li><li>Differentiate e<sup>x</sup>, a<sup>x</sup>, ln x and log<sub>a</sub> x.</li><li>Combine them with the product and quotient rules.</li><li>Find points with horizontal tangent lines.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Trigonometric derivatives (x in radians)</span>(sin x)′ = cos x    (cos x)′ = −sin x    (tan x)′ = sec<sup>2</sup>x<br>(sec x)′ = sec x tan x    (csc x)′ = −csc x cot x    (cot x)′ = −csc<sup>2</sup>x</div>
<p>(sin x)′ = cos x comes from the definition plus the two special limits sin h/h → 1 and (cos h − 1)/h → 0. The others follow by the quotient rule; e.g. tan x = sin x/cos x gives (cos<sup>2</sup>x + sin<sup>2</sup>x)/cos<sup>2</sup>x = sec<sup>2</sup>x. Tip: the “co-” functions get a minus sign.</p>
<div class="formula"><span class="lbl">Exponential and logarithmic derivatives</span>(e<sup>x</sup>)′ = e<sup>x</sup>    (a<sup>x</sup>)′ = a<sup>x</sup> ln a    (ln x)′ = 1/x    (ln|x|)′ = 1/x    (log<sub>a</sub> x)′ = 1/(x ln a)</div>
<p>e is defined exactly so that the slope of e<sup>x</sup> at 0 equals 1; then the slope at every point equals the height. This is why e appears in every growth model.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> d/dx (x<sup>2</sup> sin x) = <b>2x sin x + x<sup>2</sup> cos x</b> (product rule).</p></div>
<div class="callout"><p><b>Example 2.</b> d/dx (e<sup>x</sup> cos x) = e<sup>x</sup> cos x − e<sup>x</sup> sin x = <b>e<sup>x</sup>(cos x − sin x)</b>.</p></div>
<div class="callout"><p><b>Example 3.</b> d/dx (ln x / x) = [(1/x)·x − ln x·1]/x<sup>2</sup> = <b>(1 − ln x)/x<sup>2</sup></b>. It is 0 at x = e: the function ln x / x has its peak there.</p></div>
<div class="callout"><p><b>Example 4.</b> d/dx (2<sup>x</sup>) = 2<sup>x</sup> ln 2 ≈ 0.693·2<sup>x</sup>; d/dx (log<sub>2</sub> x) = 1/(x ln 2).</p></div>
<div class="callout"><p><b>Example 5 — tangent.</b> The tangent to y = e<sup>x</sup> at x = 0: y(0) = 1, slope e<sup>0</sup> = 1, so <b>y = x + 1</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>(cos x)′ = sin x — the sign is minus.</li><li>(e<sup>x</sup>)′ = x e<sup>x−1</sup> — the power rule does not apply to a variable exponent.</li><li>(ln 5)′ = 1/5 — ln 5 is a constant, its derivative is 0.</li><li>Using degrees: the formulas hold only in radians.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>sin → cos → −sin → −cos → sin (cycle of period 4).</li><li>(tan x)′ = sec<sup>2</sup>x; “co-” functions carry a minus.</li><li>(e<sup>x</sup>)′ = e<sup>x</sup>, (a<sup>x</sup>)′ = a<sup>x</sup> ln a.</li><li>(ln x)′ = 1/x, (log<sub>a</sub>x)′ = 1/(x ln a).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-5-derivatives-of-trigonometric-functions" target="_blank" rel="noopener">OpenStax — 3.5 Derivatives of Trigonometric Functions</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-9-derivatives-of-exponential-and-logarithmic-functions" target="_blank" rel="noopener">OpenStax — 3.9 Derivatives of Exponential and Logarithmic Functions</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/DiffTrigFcns.aspx" target="_blank" rel="noopener">Paul's Online Notes — Derivatives of Trig Functions</a></li><li><a href="https://www.3blue1brown.com/lessons/eulers-number" target="_blank" rel="noopener">3Blue1Brown — What's so special about Euler's number e?</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Differentiate y = x e<sup>x</sup>.</li><li>Differentiate y = sin x / (1 + cos x) and simplify.</li><li>On [0, 2π], where does y = x − 2 sin x have a horizontal tangent?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) e<sup>x</sup> + x e<sup>x</sup> = e<sup>x</sup>(1 + x). 2) [cos x(1 + cos x) + sin<sup>2</sup>x]/(1 + cos x)<sup>2</sup> = (1 + cos x)/(1 + cos x)<sup>2</sup> = 1/(1 + cos x). 3) y′ = 1 − 2 cos x = 0 ⇒ cos x = 1/2 ⇒ x = π/3, 5π/3.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 3 · Bài 3.3</span>
<h2>Đạo hàm hàm lượng giác, mũ và logarit</h2>
<p class="lead">Sóng, dao động, tăng trưởng và phân rã được mô tả bằng sin, cos, e<sup>x</sup> và ln x. Đạo hàm của chúng ngắn gọn và đẹp — e<sup>x</sup> là đạo hàm của chính nó — và phải thuộc lòng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nêu đạo hàm của sáu hàm lượng giác.</li><li>Đạo hàm e<sup>x</sup>, a<sup>x</sup>, ln x và log<sub>a</sub> x.</li><li>Kết hợp với quy tắc tích và thương.</li><li>Tìm điểm có tiếp tuyến nằm ngang.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Đạo hàm lượng giác (x theo radian)</span>(sin x)′ = cos x    (cos x)′ = −sin x    (tan x)′ = sec<sup>2</sup>x<br>(sec x)′ = sec x tan x    (csc x)′ = −csc x cot x    (cot x)′ = −csc<sup>2</sup>x</div>
<p>(sin x)′ = cos x suy từ định nghĩa cùng hai giới hạn đặc biệt sin h/h → 1 và (cos h − 1)/h → 0. Các công thức còn lại suy bằng quy tắc thương; ví dụ tan x = sin x/cos x cho (cos<sup>2</sup>x + sin<sup>2</sup>x)/cos<sup>2</sup>x = sec<sup>2</sup>x. Mẹo: các hàm có “co-” (cos, cot, csc) mang dấu trừ.</p>
<div class="formula"><span class="lbl">Đạo hàm hàm mũ và logarit</span>(e<sup>x</sup>)′ = e<sup>x</sup>    (a<sup>x</sup>)′ = a<sup>x</sup> ln a    (ln x)′ = 1/x    (ln|x|)′ = 1/x    (log<sub>a</sub> x)′ = 1/(x ln a)</div>
<p>Số e được định nghĩa đúng để độ dốc của e<sup>x</sup> tại 0 bằng 1; khi đó độ dốc tại mọi điểm bằng chính chiều cao. Đó là lý do e xuất hiện trong mọi mô hình tăng trưởng.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> d/dx (x<sup>2</sup> sin x) = <b>2x sin x + x<sup>2</sup> cos x</b> (quy tắc tích).</p></div>
<div class="callout"><p><b>Ví dụ 2.</b> d/dx (e<sup>x</sup> cos x) = e<sup>x</sup> cos x − e<sup>x</sup> sin x = <b>e<sup>x</sup>(cos x − sin x)</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3.</b> d/dx (ln x / x) = [(1/x)·x − ln x·1]/x<sup>2</sup> = <b>(1 − ln x)/x<sup>2</sup></b>. Nó bằng 0 tại x = e: hàm ln x / x đạt đỉnh ở đó.</p></div>
<div class="callout"><p><b>Ví dụ 4.</b> d/dx (2<sup>x</sup>) = 2<sup>x</sup> ln 2 ≈ 0,693·2<sup>x</sup>; d/dx (log<sub>2</sub> x) = 1/(x ln 2).</p></div>
<div class="callout"><p><b>Ví dụ 5 — tiếp tuyến.</b> Tiếp tuyến của y = e<sup>x</sup> tại x = 0: y(0) = 1, hệ số góc e<sup>0</sup> = 1, nên <b>y = x + 1</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>(cos x)′ = sin x — dấu phải là trừ.</li><li>(e<sup>x</sup>)′ = x e<sup>x−1</sup> — quy tắc luỹ thừa không áp dụng cho số mũ là biến.</li><li>(ln 5)′ = 1/5 — ln 5 là hằng số, đạo hàm bằng 0.</li><li>Dùng độ: công thức chỉ đúng với radian.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>sin → cos → −sin → −cos → sin (chu kỳ 4).</li><li>(tan x)′ = sec<sup>2</sup>x; hàm “co-” mang dấu trừ.</li><li>(e<sup>x</sup>)′ = e<sup>x</sup>, (a<sup>x</sup>)′ = a<sup>x</sup> ln a.</li><li>(ln x)′ = 1/x, (log<sub>a</sub>x)′ = 1/(x ln a).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-5-derivatives-of-trigonometric-functions" target="_blank" rel="noopener">OpenStax — 3.5 Đạo hàm hàm lượng giác</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-9-derivatives-of-exponential-and-logarithmic-functions" target="_blank" rel="noopener">OpenStax — 3.9 Đạo hàm hàm mũ và logarit</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/DiffTrigFcns.aspx" target="_blank" rel="noopener">Paul's Online Notes — Đạo hàm hàm lượng giác</a></li><li><a href="https://www.3blue1brown.com/lessons/eulers-number" target="_blank" rel="noopener">3Blue1Brown — Số e có gì đặc biệt?</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Đạo hàm y = x e<sup>x</sup>.</li><li>Đạo hàm y = sin x / (1 + cos x) và rút gọn.</li><li>Trên [0, 2π], y = x − 2 sin x có tiếp tuyến nằm ngang ở đâu?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) e<sup>x</sup> + x e<sup>x</sup> = e<sup>x</sup>(1 + x). 2) [cos x(1 + cos x) + sin<sup>2</sup>x]/(1 + cos x)<sup>2</sup> = (1 + cos x)/(1 + cos x)<sup>2</sup> = 1/(1 + cos x). 3) y′ = 1 − 2 cos x = 0 ⇒ cos x = 1/2 ⇒ x = π/3, 5π/3.</p></div>`);

const c34 = L('cal111-ts-3-4',
  '3.4 — The chain rule|||3.4 — Quy tắc dây chuyền (đạo hàm hàm hợp)',
  'Đạo hàm hàm hợp: (f(g(x)))′ = f′(g(x))·g′(x); dạng Leibniz dy/dx = dy/du·du/dx; các dạng tổng quát (uⁿ, eᵘ, ln u, sin u); hàm lồng nhiều lớp; liên hệ lan truyền ngược trong học máy.',
  `<span class="eyebrow">CAL111 · Chapter 3 · Lesson 3.4</span>
<h2>The chain rule</h2>
<p class="lead">Most real functions are compositions: (3x<sup>2</sup> + 1)<sup>5</sup>, sin(x<sup>3</sup>), e<sup>−2x²</sup>. The chain rule differentiates them, layer by layer, from the outside in. It is also the mathematics behind backpropagation in neural networks.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the chain rule in function and Leibniz notation.</li><li>Identify inner and outer functions.</li><li>Use the general forms for u<sup>n</sup>, e<sup>u</sup>, ln u, sin u, cos u.</li><li>Differentiate functions with several nested layers.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Chain rule</span>[f(g(x))]′ = f′(g(x)) · g′(x)        If y = f(u), u = g(x):  dy/dx = (dy/du)·(du/dx)</div>
<p>In words: <em>derivative of the outside, evaluated at the inside, times the derivative of the inside</em>. Rates multiply: if u changes 3 times as fast as x and y changes 2 times as fast as u, then y changes 6 times as fast as x.</p>
<div class="formula"><span class="lbl">General forms (u = u(x))</span>(u<sup>n</sup>)′ = n u<sup>n−1</sup> u′    (e<sup>u</sup>)′ = e<sup>u</sup> u′    (ln u)′ = u′/u    (sin u)′ = cos u · u′    (cos u)′ = −sin u · u′    (√u)′ = u′/(2√u)</div>
<p><strong>Link to machine learning.</strong> A network computes loss = L(f<sub>3</sub>(f<sub>2</sub>(f<sub>1</sub>(w)))). Its gradient is a product of local derivatives, computed from the output backwards — that is exactly the chain rule applied repeatedly.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> y = (3x<sup>2</sup> + 1)<sup>5</sup>. Outer u<sup>5</sup>, inner u = 3x<sup>2</sup> + 1. y′ = 5(3x<sup>2</sup> + 1)<sup>4</sup>·6x = <b>30x(3x<sup>2</sup> + 1)<sup>4</sup></b>.</p></div>
<div class="callout"><p><b>Example 2.</b> y = sin(x<sup>3</sup>) ⇒ y′ = cos(x<sup>3</sup>)·3x<sup>2</sup> = <b>3x<sup>2</sup> cos(x<sup>3</sup>)</b>.</p></div>
<div class="callout"><p><b>Example 3.</b> y = e<sup>−2x²</sup> ⇒ y′ = e<sup>−2x²</sup>·(−4x) = <b>−4x e<sup>−2x²</sup></b>.  y = ln(x<sup>2</sup> + 1) ⇒ y′ = <b>2x/(x<sup>2</sup> + 1)</b>.</p></div>
<div class="callout"><p><b>Example 4 — three layers.</b> y = cos<sup>2</sup>(5x) = [cos(5x)]<sup>2</sup>.</p><p>Outer square: 2cos(5x). Middle cos: −sin(5x). Inner 5x: 5. Multiply: y′ = 2cos(5x)·(−sin(5x))·5 = −10 sin(5x)cos(5x) = <b>−5 sin(10x)</b> (using sin 2θ = 2 sin θ cos θ).</p></div>
<div class="callout"><p><b>Example 5.</b> y = √(1 + sin x) ⇒ y′ = <b>cos x / (2√(1 + sin x))</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the inner derivative: (sin 3x)′ = cos 3x — wrong, it is 3cos 3x.</li><li>Differentiating the inside in the wrong place: f′(g′(x)) is not the rule.</li><li>Stopping after two layers when there are three.</li><li>Confusing sin(x<sup>2</sup>) (chain rule, inner x<sup>2</sup>) with sin<sup>2</sup>x (chain rule, outer square).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Outside′(inside) × inside′.</li><li>dy/dx = dy/du · du/dx.</li><li>General forms: n u<sup>n−1</sup>u′, e<sup>u</sup>u′, u′/u, cos u · u′.</li><li>Many layers ⇒ multiply one derivative per layer.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-6-the-chain-rule" target="_blank" rel="noopener">OpenStax — 3.6 The Chain Rule</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ChainRule.aspx" target="_blank" rel="noopener">Paul's Online Notes — Chain Rule</a></li><li><a href="https://www.3blue1brown.com/lessons/chain-rule-and-product-rule" target="_blank" rel="noopener">3Blue1Brown — Visualizing the chain rule</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/1.-differentiation/part-a-definition-and-basic-rules/" target="_blank" rel="noopener">MIT 18.01SC — Differentiation, Part A: Definition and Basic Rules</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Differentiate y = (2x + 1)<sup>−3</sup>.</li><li>Differentiate y = ln(cos x).</li><li>Differentiate y = tan(e<sup>x</sup>).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) −3(2x + 1)<sup>−4</sup>·2 = −6(2x + 1)<sup>−4</sup>. 2) (−sin x)/cos x = −tan x. 3) sec<sup>2</sup>(e<sup>x</sup>)·e<sup>x</sup> = e<sup>x</sup> sec<sup>2</sup>(e<sup>x</sup>).</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 3 · Bài 3.4</span>
<h2>Quy tắc dây chuyền</h2>
<p class="lead">Phần lớn hàm thực tế là hàm hợp: (3x<sup>2</sup> + 1)<sup>5</sup>, sin(x<sup>3</sup>), e<sup>−2x²</sup>. Quy tắc dây chuyền đạo hàm chúng từng lớp, từ ngoài vào trong. Nó cũng chính là toán học đứng sau lan truyền ngược trong mạng nơ-ron.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu quy tắc dây chuyền ở dạng hàm và dạng Leibniz.</li><li>Nhận ra hàm trong và hàm ngoài.</li><li>Dùng dạng tổng quát cho u<sup>n</sup>, e<sup>u</sup>, ln u, sin u, cos u.</li><li>Đạo hàm hàm lồng nhiều lớp.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Quy tắc dây chuyền</span>[f(g(x))]′ = f′(g(x)) · g′(x)        Nếu y = f(u), u = g(x):  dy/dx = (dy/du)·(du/dx)</div>
<p>Bằng lời: <em>đạo hàm hàm ngoài, tính tại hàm trong, nhân đạo hàm hàm trong</em>. Tốc độ nhân với nhau: u thay đổi nhanh gấp 3 lần x, y thay đổi nhanh gấp 2 lần u, thì y thay đổi nhanh gấp 6 lần x.</p>
<div class="formula"><span class="lbl">Dạng tổng quát (u = u(x))</span>(u<sup>n</sup>)′ = n u<sup>n−1</sup> u′    (e<sup>u</sup>)′ = e<sup>u</sup> u′    (ln u)′ = u′/u    (sin u)′ = cos u · u′    (cos u)′ = −sin u · u′    (√u)′ = u′/(2√u)</div>
<p><strong>Liên hệ học máy.</strong> Mạng nơ-ron tính loss = L(f<sub>3</sub>(f<sub>2</sub>(f<sub>1</sub>(w)))). Gradient của nó là tích các đạo hàm cục bộ, tính từ đầu ra ngược về — chính là quy tắc dây chuyền áp dụng nhiều lần.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> y = (3x<sup>2</sup> + 1)<sup>5</sup>. Ngoài u<sup>5</sup>, trong u = 3x<sup>2</sup> + 1. y′ = 5(3x<sup>2</sup> + 1)<sup>4</sup>·6x = <b>30x(3x<sup>2</sup> + 1)<sup>4</sup></b>.</p></div>
<div class="callout"><p><b>Ví dụ 2.</b> y = sin(x<sup>3</sup>) ⇒ y′ = cos(x<sup>3</sup>)·3x<sup>2</sup> = <b>3x<sup>2</sup> cos(x<sup>3</sup>)</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3.</b> y = e<sup>−2x²</sup> ⇒ y′ = e<sup>−2x²</sup>·(−4x) = <b>−4x e<sup>−2x²</sup></b>.  y = ln(x<sup>2</sup> + 1) ⇒ y′ = <b>2x/(x<sup>2</sup> + 1)</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4 — ba lớp.</b> y = cos<sup>2</sup>(5x) = [cos(5x)]<sup>2</sup>.</p><p>Lớp ngoài bình phương: 2cos(5x). Lớp giữa cos: −sin(5x). Lớp trong 5x: 5. Nhân lại: y′ = 2cos(5x)·(−sin(5x))·5 = −10 sin(5x)cos(5x) = <b>−5 sin(10x)</b> (dùng sin 2θ = 2 sin θ cos θ).</p></div>
<div class="callout"><p><b>Ví dụ 5.</b> y = √(1 + sin x) ⇒ y′ = <b>cos x / (2√(1 + sin x))</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên đạo hàm hàm trong: (sin 3x)′ = cos 3x — sai, phải là 3cos 3x.</li><li>Đạo hàm hàm trong sai chỗ: f′(g′(x)) không phải quy tắc.</li><li>Dừng sau hai lớp khi có ba lớp.</li><li>Nhầm sin(x<sup>2</sup>) (hàm trong x<sup>2</sup>) với sin<sup>2</sup>x (hàm ngoài bình phương).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Đạo hàm ngoài (tại trong) × đạo hàm trong.</li><li>dy/dx = dy/du · du/dx.</li><li>Dạng tổng quát: n u<sup>n−1</sup>u′, e<sup>u</sup>u′, u′/u, cos u · u′.</li><li>Nhiều lớp ⇒ nhân một đạo hàm cho mỗi lớp.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-6-the-chain-rule" target="_blank" rel="noopener">OpenStax — 3.6 Quy tắc dây chuyền</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ChainRule.aspx" target="_blank" rel="noopener">Paul's Online Notes — Quy tắc dây chuyền</a></li><li><a href="https://www.3blue1brown.com/lessons/chain-rule-and-product-rule" target="_blank" rel="noopener">3Blue1Brown — Trực quan quy tắc dây chuyền</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/1.-differentiation/part-a-definition-and-basic-rules/" target="_blank" rel="noopener">MIT 18.01SC — Đạo hàm, phần A: định nghĩa và quy tắc cơ bản</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Đạo hàm y = (2x + 1)<sup>−3</sup>.</li><li>Đạo hàm y = ln(cos x).</li><li>Đạo hàm y = tan(e<sup>x</sup>).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) −3(2x + 1)<sup>−4</sup>·2 = −6(2x + 1)<sup>−4</sup>. 2) (−sin x)/cos x = −tan x. 3) sec<sup>2</sup>(e<sup>x</sup>)·e<sup>x</sup> = e<sup>x</sup> sec<sup>2</sup>(e<sup>x</sup>).</p></div>`);

const q3 = QZ(3, 'Quiz — Chapter 3: Derivatives|||Quiz — Chương 3: Đạo hàm', 'Kiểm tra chương 3: định nghĩa đạo hàm, tiếp tuyến, quy tắc tích/thương, đạo hàm lượng giác – mũ – logarit, quy tắc dây chuyền.', [
  Q('q1', 'Using the definition, f(x) = x² has f′(3) =|||Theo định nghĩa, f(x) = x² có f′(3) =',
    ['3|||3', '6|||6', '9|||9', '6 + h|||6 + h'], 1,
    '[(3 + h)² − 9]/h = 6 + h → 6.|||[(3 + h)² − 9]/h = 6 + h → 6.'),
  Q('q2', 'Which function is continuous but NOT differentiable at x = 0?|||Hàm nào liên tục nhưng KHÔNG khả vi tại x = 0?',
    ['x²|||x²', 'the absolute value function abs(x)|||hàm giá trị tuyệt đối abs(x)', 'sin x|||sin x', 'eˣ|||eˣ'], 1,
    'abs(x) has a corner at 0: the one-sided difference quotients are −1 and 1.|||abs(x) có điểm góc tại 0: tỉ sai phân hai phía là −1 và 1.'),
  Q('q3', 'd/dx [(x² + 1)(x³ − 2x)] =|||d/dx [(x² + 1)(x³ − 2x)] =',
    ['2x(3x² − 2)|||2x(3x² − 2)', '5x⁴ − 3x² − 2|||5x⁴ − 3x² − 2', '5x⁴ − 2|||5x⁴ − 2', 'x⁵ − x³ − 2x|||x⁵ − x³ − 2x'], 1,
    'Product rule, or expand to x⁵ − x³ − 2x and differentiate.|||Quy tắc tích, hoặc khai triển x⁵ − x³ − 2x rồi đạo hàm.'),
  Q('q4', 'd/dx [(3x − 1)/(2x + 5)] =|||d/dx [(3x − 1)/(2x + 5)] =',
    ['3/2|||3/2', '17/(2x + 5)²|||17/(2x + 5)²', '−17/(2x + 5)²|||−17/(2x + 5)²', '13/(2x + 5)²|||13/(2x + 5)²'], 1,
    '[3(2x + 5) − 2(3x − 1)]/(2x + 5)² = 17/(2x + 5)².|||[3(2x + 5) − 2(3x − 1)]/(2x + 5)² = 17/(2x + 5)².'),
  Q('q5', 'The tangent line to y = x³ − 3x at x = 2 is|||Tiếp tuyến của y = x³ − 3x tại x = 2 là',
    ['y = 9x − 16|||y = 9x − 16', 'y = 9x + 2|||y = 9x + 2', 'y = 2x − 2|||y = 2x − 2', 'y = 3x − 4|||y = 3x − 4'], 0,
    'y(2) = 2, y′(2) = 9: y − 2 = 9(x − 2).|||y(2) = 2, y′(2) = 9: y − 2 = 9(x − 2).'),
  Q('q6', 'd/dx (ln x / x) =|||d/dx (ln x / x) =',
    ['1/x²|||1/x²', '(1 − ln x)/x²|||(1 − ln x)/x²', '(ln x − 1)/x²|||(ln x − 1)/x²', '1/x − ln x|||1/x − ln x'], 1,
    'Quotient rule: [(1/x)·x − ln x]/x².|||Quy tắc thương: [(1/x)·x − ln x]/x².'),
  Q('q7', 'd/dx (3x² + 1)⁵ =|||d/dx (3x² + 1)⁵ =',
    ['5(3x² + 1)⁴|||5(3x² + 1)⁴', '30x(3x² + 1)⁴|||30x(3x² + 1)⁴', '6x(3x² + 1)⁴|||6x(3x² + 1)⁴', '30x(3x² + 1)⁵|||30x(3x² + 1)⁵'], 1,
    'Chain rule: 5u⁴·u′ with u′ = 6x.|||Quy tắc dây chuyền: 5u⁴·u′ với u′ = 6x.'),
  Q('q8', 'd/dx cos²(5x) =|||d/dx cos²(5x) =',
    ['−5 sin(10x)|||−5 sin(10x)', '2cos(5x)|||2cos(5x)', '−10 sin(5x)|||−10 sin(5x)', '10 cos(5x) sin(5x)|||10 cos(5x) sin(5x)'], 0,
    '2cos(5x)·(−sin(5x))·5 = −10 sin 5x cos 5x = −5 sin 10x.|||2cos(5x)·(−sin(5x))·5 = −10 sin 5x cos 5x = −5 sin 10x.'),
  Q('q9', 'd/dx (2ˣ) =|||d/dx (2ˣ) =',
    ['x·2^(x−1)|||x·2^(x−1)', '2ˣ|||2ˣ', '2ˣ ln 2|||2ˣ ln 2', '2ˣ/ln 2|||2ˣ/ln 2'], 2,
    '(aˣ)′ = aˣ ln a; the power rule does not apply to a variable exponent.|||(aˣ)′ = aˣ ln a; quy tắc luỹ thừa không áp cho số mũ là biến.'),
  Q('q10', 'For s(t) = t³ − 6t² + 9t, the particle is at rest when t =|||Với s(t) = t³ − 6t² + 9t, chất điểm đứng yên khi t =',
    ['0 and 3|||0 và 3', '1 and 3|||1 và 3', '2 only|||chỉ 2', '1 and 2|||1 và 2'], 1,
    'v = 3t² − 12t + 9 = 3(t − 1)(t − 3) = 0.|||v = 3t² − 12t + 9 = 3(t − 1)(t − 3) = 0.'),
]);

const ch3 = {
  title: 'Chapter 3 — Derivatives and differentiation rules|||Chương 3 — Đạo hàm và quy tắc tính đạo hàm',
  description: 'Định nghĩa đạo hàm, tiếp tuyến, quy tắc luỹ thừa/tích/thương, đạo hàm hàm lượng giác – mũ – logarit, quy tắc dây chuyền (Stewart ch.3 · OpenStax ch.3).',
  lessons: [c31, c32, c33, c34, q3],
};

// ───────────────────────────── Chương 4 — Đạo hàm hàm ẩn, tốc độ liên quan, xấp xỉ ─────────────────────────────
const c41 = L('cal111-ts-4-1',
  '4.1 — Implicit differentiation, inverse functions and logarithmic differentiation|||4.1 — Đạo hàm hàm ẩn, đạo hàm hàm ngược và đạo hàm logarit',
  'Đạo hàm hàm ẩn (đường tròn, lá Descartes), đạo hàm arcsin/arctan, đạo hàm hàm ngược, kỹ thuật lấy ln hai vế cho xˣ.',
  `<span class="eyebrow">CAL111 · Chapter 4 · Lesson 4.1</span>
<h2>Implicit differentiation, inverses and logarithmic differentiation</h2>
<p class="lead">Many curves — circles, ellipses, the folium of Descartes — are given by an equation in x and y, not by y = f(x). Implicit differentiation finds their slopes without solving for y.</p>
<h3>🎯 Objectives</h3>
<ul><li>Differentiate an equation implicitly and solve for dy/dx.</li><li>Find tangent lines to implicitly defined curves.</li><li>Derive and use the derivatives of arcsin and arctan.</li><li>Use logarithmic differentiation for functions like x<sup>x</sup>.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Method.</strong> (1) Differentiate both sides with respect to x, treating y as a function of x — every time you differentiate an expression in y, multiply by y′ (chain rule). (2) Collect the y′ terms on one side. (3) Solve for y′.</p>
<div class="formula"><span class="lbl">Typical pieces</span>d/dx (y<sup>2</sup>) = 2y·y′    d/dx (xy) = y + x·y′    d/dx (sin y) = cos y·y′    d/dx (e<sup>y</sup>) = e<sup>y</sup>·y′</div>
<p><strong>Inverse functions.</strong> If y = f<sup>−1</sup>(x) then f(y) = x; differentiating gives f′(y)·y′ = 1, so (f<sup>−1</sup>)′(x) = 1/f′(f<sup>−1</sup>(x)). For y = arcsin x: sin y = x ⇒ cos y·y′ = 1 ⇒ y′ = 1/cos y = 1/√(1 − x<sup>2</sup>).</p>
<div class="formula"><span class="lbl">Inverse trig derivatives</span>(arcsin x)′ = 1/√(1 − x<sup>2</sup>)    (arccos x)′ = −1/√(1 − x<sup>2</sup>)    (arctan x)′ = 1/(1 + x<sup>2</sup>)</div>
<p><strong>Logarithmic differentiation.</strong> When the variable is in both base and exponent (x<sup>x</sup>) or for big products/quotients: take ln of both sides, use log laws, differentiate implicitly.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — circle.</b> x<sup>2</sup> + y<sup>2</sup> = 25 at (3, 4).</p><p>2x + 2y y′ = 0 ⇒ y′ = −x/y = −3/4. Tangent: <b>y − 4 = −(3/4)(x − 3)</b>.</p></div>
<div class="callout"><p><b>Example 2 — folium of Descartes.</b> x<sup>3</sup> + y<sup>3</sup> = 6xy at (3, 3).</p><p>3x<sup>2</sup> + 3y<sup>2</sup>y′ = 6y + 6x y′ ⇒ y′(3y<sup>2</sup> − 6x) = 6y − 3x<sup>2</sup> ⇒ y′ = (2y − x<sup>2</sup>)/(y<sup>2</sup> − 2x). At (3, 3): (6 − 9)/(9 − 6) = <b>−1</b>.</p></div>
<div class="callout"><p><b>Example 3 — log differentiation.</b> y = x<sup>x</sup> (x &gt; 0).</p><p>ln y = x ln x ⇒ y′/y = ln x + 1 ⇒ <b>y′ = x<sup>x</sup>(ln x + 1)</b>.</p></div>
<div class="callout"><p><b>Example 4.</b> d/dx arctan(2x) = 2/(1 + 4x<sup>2</sup>) (chain rule with u = 2x).</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting y′ when differentiating y<sup>2</sup> (writing 2y instead of 2y·y′).</li><li>Treating xy as x·1: it needs the product rule, y + xy′.</li><li>Using the power rule on x<sup>x</sup> (x·x<sup>x−1</sup>) or the exponential rule (x<sup>x</sup> ln x) — both wrong.</li><li>Plugging the point in before differentiating.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Differentiate both sides; each y-term gets a factor y′.</li><li>Collect y′ and solve.</li><li>(arcsin x)′ = 1/√(1 − x<sup>2</sup>), (arctan x)′ = 1/(1 + x<sup>2</sup>).</li><li>Variable base and exponent ⇒ take ln first.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-8-implicit-differentiation" target="_blank" rel="noopener">OpenStax — 3.8 Implicit Differentiation</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-7-derivatives-of-inverse-functions" target="_blank" rel="noopener">OpenStax — 3.7 Derivatives of Inverse Functions</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/LogDiff.aspx" target="_blank" rel="noopener">Paul's Online Notes — Logarithmic Differentiation</a></li><li><a href="https://www.3blue1brown.com/lessons/implicit-differentiation" target="_blank" rel="noopener">3Blue1Brown — Implicit differentiation, what's going on here?</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find dy/dx for x<sup>2</sup> + xy + y<sup>2</sup> = 7 at (1, 2).</li><li>Differentiate y = x<sup>2x</sup>.</li><li>Differentiate y = arcsin(x<sup>2</sup>).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 2x + y + xy′ + 2yy′ = 0 ⇒ y′ = −(2x + y)/(x + 2y) = −4/5. 2) ln y = 2x ln x ⇒ y′ = x<sup>2x</sup>(2 ln x + 2). 3) 2x/√(1 − x<sup>4</sup>).</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 4 · Bài 4.1</span>
<h2>Đạo hàm hàm ẩn, hàm ngược và đạo hàm logarit</h2>
<p class="lead">Nhiều đường cong — đường tròn, elip, lá Descartes — được cho bằng một phương trình theo x và y, chứ không phải y = f(x). Đạo hàm hàm ẩn tìm được hệ số góc mà không cần giải ra y.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Đạo hàm ẩn một phương trình và giải ra dy/dx.</li><li>Viết tiếp tuyến của đường cong cho dạng ẩn.</li><li>Chứng minh và dùng đạo hàm arcsin, arctan.</li><li>Dùng đạo hàm logarit cho hàm như x<sup>x</sup>.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Cách làm.</strong> (1) Đạo hàm hai vế theo x, coi y là hàm của x — mỗi lần đạo hàm biểu thức chứa y thì nhân thêm y′ (quy tắc dây chuyền). (2) Gom các số hạng có y′ về một vế. (3) Giải ra y′.</p>
<div class="formula"><span class="lbl">Các mảnh hay gặp</span>d/dx (y<sup>2</sup>) = 2y·y′    d/dx (xy) = y + x·y′    d/dx (sin y) = cos y·y′    d/dx (e<sup>y</sup>) = e<sup>y</sup>·y′</div>
<p><strong>Hàm ngược.</strong> Nếu y = f<sup>−1</sup>(x) thì f(y) = x; đạo hàm được f′(y)·y′ = 1, nên (f<sup>−1</sup>)′(x) = 1/f′(f<sup>−1</sup>(x)). Với y = arcsin x: sin y = x ⇒ cos y·y′ = 1 ⇒ y′ = 1/cos y = 1/√(1 − x<sup>2</sup>).</p>
<div class="formula"><span class="lbl">Đạo hàm hàm lượng giác ngược</span>(arcsin x)′ = 1/√(1 − x<sup>2</sup>)    (arccos x)′ = −1/√(1 − x<sup>2</sup>)    (arctan x)′ = 1/(1 + x<sup>2</sup>)</div>
<p><strong>Đạo hàm logarit.</strong> Khi biến nằm ở cả cơ số lẫn số mũ (x<sup>x</sup>) hoặc tích/thương cồng kềnh: lấy ln hai vế, dùng luật logarit, rồi đạo hàm ẩn.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — đường tròn.</b> x<sup>2</sup> + y<sup>2</sup> = 25 tại (3, 4).</p><p>2x + 2y y′ = 0 ⇒ y′ = −x/y = −3/4. Tiếp tuyến: <b>y − 4 = −(3/4)(x − 3)</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — lá Descartes.</b> x<sup>3</sup> + y<sup>3</sup> = 6xy tại (3, 3).</p><p>3x<sup>2</sup> + 3y<sup>2</sup>y′ = 6y + 6x y′ ⇒ y′(3y<sup>2</sup> − 6x) = 6y − 3x<sup>2</sup> ⇒ y′ = (2y − x<sup>2</sup>)/(y<sup>2</sup> − 2x). Tại (3, 3): (6 − 9)/(9 − 6) = <b>−1</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — đạo hàm logarit.</b> y = x<sup>x</sup> (x &gt; 0).</p><p>ln y = x ln x ⇒ y′/y = ln x + 1 ⇒ <b>y′ = x<sup>x</sup>(ln x + 1)</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4.</b> d/dx arctan(2x) = 2/(1 + 4x<sup>2</sup>) (dây chuyền với u = 2x).</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên y′ khi đạo hàm y<sup>2</sup> (viết 2y thay vì 2y·y′).</li><li>Coi xy như x·1: phải dùng quy tắc tích, y + xy′.</li><li>Dùng quy tắc luỹ thừa cho x<sup>x</sup> (x·x<sup>x−1</sup>) hay quy tắc mũ (x<sup>x</sup> ln x) — đều sai.</li><li>Thế điểm vào trước khi đạo hàm.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Đạo hàm hai vế; mỗi số hạng chứa y được nhân y′.</li><li>Gom y′ rồi giải.</li><li>(arcsin x)′ = 1/√(1 − x<sup>2</sup>), (arctan x)′ = 1/(1 + x<sup>2</sup>).</li><li>Cơ số và số mũ đều chứa biến ⇒ lấy ln trước.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-8-implicit-differentiation" target="_blank" rel="noopener">OpenStax — 3.8 Đạo hàm hàm ẩn</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/3-7-derivatives-of-inverse-functions" target="_blank" rel="noopener">OpenStax — 3.7 Đạo hàm hàm ngược</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/LogDiff.aspx" target="_blank" rel="noopener">Paul's Online Notes — Đạo hàm logarit</a></li><li><a href="https://www.3blue1brown.com/lessons/implicit-differentiation" target="_blank" rel="noopener">3Blue1Brown — Đạo hàm hàm ẩn thực chất là gì?</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm dy/dx của x<sup>2</sup> + xy + y<sup>2</sup> = 7 tại (1, 2).</li><li>Đạo hàm y = x<sup>2x</sup>.</li><li>Đạo hàm y = arcsin(x<sup>2</sup>).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 2x + y + xy′ + 2yy′ = 0 ⇒ y′ = −(2x + y)/(x + 2y) = −4/5. 2) ln y = 2x ln x ⇒ y′ = x<sup>2x</sup>(2 ln x + 2). 3) 2x/√(1 − x<sup>4</sup>).</p></div>`);

const c42 = L('cal111-ts-4-2',
  '4.2 — Related rates|||4.2 — Tốc độ liên quan (related rates)',
  'Quy trình 5 bước giải bài toán tốc độ liên quan: thang trượt, bóng bay hình cầu, bể nước hình nón, hai xe chuyển động vuông góc.',
  `<span class="eyebrow">CAL111 · Chapter 4 · Lesson 4.2</span>
<h2>Related rates</h2>
<p class="lead">When two quantities are linked by an equation and both change in time, their rates of change are linked too. Differentiate the equation with respect to t and you can compute an unknown rate from a known one.</p>
<h3>🎯 Objectives</h3>
<ul><li>Translate a word problem into variables, an equation and given rates.</li><li>Differentiate the equation implicitly with respect to time.</li><li>Substitute values only <em>after</em> differentiating.</li><li>Interpret the sign and units of the answer.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Five-step method</span>1) Draw a picture, name the variables that change with t.<br>2) Write the given rates and the wanted rate as derivatives (dx/dt = …, find dy/dt).<br>3) Write an equation linking the variables (Pythagoras, area, volume, similar triangles).<br>4) Differentiate with respect to t (chain rule).<br>5) Substitute the values at the instant in question and solve.</div>
<p>The most common error is substituting numbers too early: if you replace x by 6 before differentiating, x stops changing and dx/dt disappears.</p>
<div class="formula"><span class="lbl">Formulas you will need</span>sphere V = (4/3)πr<sup>3</sup>    cone V = (1/3)πr<sup>2</sup>h    circle A = πr<sup>2</sup>    Pythagoras x<sup>2</sup> + y<sup>2</sup> = z<sup>2</sup></div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — sliding ladder.</b> A 10 m ladder leans on a wall. The bottom slides away at 1 m/s. How fast does the top slide down when the bottom is 6 m from the wall?</p><p>x<sup>2</sup> + y<sup>2</sup> = 100. Differentiate: 2x x′ + 2y y′ = 0. At x = 6, y = 8, x′ = 1: 12 + 16y′ = 0 ⇒ y′ = <b>−0.75 m/s</b> (the top moves down at 0.75 m/s).</p></div>
<div class="callout"><p><b>Example 2 — balloon.</b> Air is pumped in at 100 cm<sup>3</sup>/s. How fast is the radius growing when r = 25 cm?</p><p>V = (4/3)πr<sup>3</sup> ⇒ V′ = 4πr<sup>2</sup> r′. So 100 = 4π·625·r′ ⇒ r′ = 1/(25π) ≈ <b>0.0127 cm/s</b>.</p></div>
<div class="callout"><p><b>Example 3 — conical tank.</b> An inverted cone has height 4 m and top radius 2 m. Water flows in at 2 m<sup>3</sup>/min. Find dh/dt when h = 3 m.</p><p>Similar triangles: r/h = 2/4 ⇒ r = h/2. Then V = (1/3)π(h/2)<sup>2</sup>h = (π/12)h<sup>3</sup>. V′ = (π/4)h<sup>2</sup> h′ ⇒ 2 = (π/4)·9·h′ ⇒ h′ = 8/(9π) ≈ <b>0.283 m/min</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Substituting the instant's values before differentiating.</li><li>Losing the sign: a decreasing quantity has a negative rate.</li><li>Keeping two variables in the cone volume — eliminate r with similar triangles first.</li><li>Mixing units (cm and m, minutes and seconds).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Picture → variables → equation → d/dt → substitute.</li><li>Every changing quantity gets a d/dt via the chain rule.</li><li>Use geometry (similar triangles) to remove extra variables.</li><li>Check the sign and units of the result.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-1-related-rates" target="_blank" rel="noopener">OpenStax — 4.1 Related Rates</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/RelatedRates.aspx" target="_blank" rel="noopener">Paul's Online Notes — Related Rates</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-2-applications-of-differentiation/part-b-optimization-related-rates-and-newtons-method/" target="_blank" rel="noopener">MIT 18.01SC — Optimization, Related Rates and Newton's Method</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>The side of a square grows at 3 cm/s. How fast is the area growing when the side is 10 cm?</li><li>Two cars leave the same point, one north at 60 km/h, one east at 80 km/h. How fast is the distance between them increasing?</li><li>A circle's radius grows at 2 cm/s. Find dA/dt when r = 5 cm.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) A = s<sup>2</sup> ⇒ A′ = 2s s′ = 2·10·3 = 60 cm<sup>2</sup>/s. 2) z<sup>2</sup> = x<sup>2</sup> + y<sup>2</sup> with x = 60t, y = 80t ⇒ z = 100t, so z′ = 100 km/h at every moment. 3) A′ = 2πr r′ = 20π ≈ 62.83 cm<sup>2</sup>/s.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 4 · Bài 4.2</span>
<h2>Tốc độ liên quan</h2>
<p class="lead">Khi hai đại lượng liên hệ bằng một phương trình và cùng thay đổi theo thời gian, tốc độ thay đổi của chúng cũng liên hệ với nhau. Đạo hàm phương trình theo t là tính được tốc độ chưa biết từ tốc độ đã biết.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Chuyển bài toán lời thành biến, phương trình và các tốc độ đã cho.</li><li>Đạo hàm ẩn phương trình theo thời gian.</li><li>Chỉ thế số <em>sau</em> khi đã đạo hàm.</li><li>Giải thích dấu và đơn vị của đáp số.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Quy trình 5 bước</span>1) Vẽ hình, đặt tên các biến thay đổi theo t.<br>2) Viết tốc độ đã cho và tốc độ cần tìm dưới dạng đạo hàm (dx/dt = …, tìm dy/dt).<br>3) Viết phương trình liên hệ các biến (Pythagore, diện tích, thể tích, tam giác đồng dạng).<br>4) Đạo hàm theo t (quy tắc dây chuyền).<br>5) Thế giá trị tại thời điểm đang xét rồi giải.</div>
<p>Lỗi phổ biến nhất là thế số quá sớm: nếu thay x = 6 trước khi đạo hàm, x không còn thay đổi và dx/dt biến mất.</p>
<div class="formula"><span class="lbl">Công thức cần dùng</span>hình cầu V = (4/3)πr<sup>3</sup>    hình nón V = (1/3)πr<sup>2</sup>h    hình tròn A = πr<sup>2</sup>    Pythagore x<sup>2</sup> + y<sup>2</sup> = z<sup>2</sup></div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — thang trượt.</b> Chiếc thang 10 m dựa tường. Chân thang trượt ra xa với tốc độ 1 m/s. Đỉnh thang trượt xuống nhanh cỡ nào khi chân thang cách tường 6 m?</p><p>x<sup>2</sup> + y<sup>2</sup> = 100. Đạo hàm: 2x x′ + 2y y′ = 0. Tại x = 6, y = 8, x′ = 1: 12 + 16y′ = 0 ⇒ y′ = <b>−0,75 m/s</b> (đỉnh đi xuống 0,75 m/s).</p></div>
<div class="callout"><p><b>Ví dụ 2 — bóng bay.</b> Bơm khí vào với tốc độ 100 cm<sup>3</sup>/s. Bán kính tăng nhanh cỡ nào khi r = 25 cm?</p><p>V = (4/3)πr<sup>3</sup> ⇒ V′ = 4πr<sup>2</sup> r′. Vậy 100 = 4π·625·r′ ⇒ r′ = 1/(25π) ≈ <b>0,0127 cm/s</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — bể hình nón.</b> Bể hình nón úp ngược cao 4 m, bán kính miệng 2 m. Nước chảy vào 2 m<sup>3</sup>/phút. Tìm dh/dt khi h = 3 m.</p><p>Tam giác đồng dạng: r/h = 2/4 ⇒ r = h/2. Khi đó V = (1/3)π(h/2)<sup>2</sup>h = (π/12)h<sup>3</sup>. V′ = (π/4)h<sup>2</sup> h′ ⇒ 2 = (π/4)·9·h′ ⇒ h′ = 8/(9π) ≈ <b>0,283 m/phút</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Thế giá trị tại thời điểm xét trước khi đạo hàm.</li><li>Mất dấu: đại lượng đang giảm có tốc độ âm.</li><li>Giữ cả hai biến trong thể tích hình nón — phải khử r bằng tam giác đồng dạng trước.</li><li>Trộn đơn vị (cm và m, phút và giây).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Hình → biến → phương trình → d/dt → thế số.</li><li>Mọi đại lượng thay đổi đều có d/dt nhờ quy tắc dây chuyền.</li><li>Dùng hình học (tam giác đồng dạng) để khử biến thừa.</li><li>Kiểm dấu và đơn vị của kết quả.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-1-related-rates" target="_blank" rel="noopener">OpenStax — 4.1 Tốc độ liên quan</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/RelatedRates.aspx" target="_blank" rel="noopener">Paul's Online Notes — Tốc độ liên quan</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-2-applications-of-differentiation/part-b-optimization-related-rates-and-newtons-method/" target="_blank" rel="noopener">MIT 18.01SC — Tối ưu, tốc độ liên quan và phương pháp Newton</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Cạnh hình vuông tăng 3 cm/s. Diện tích tăng nhanh cỡ nào khi cạnh dài 10 cm?</li><li>Hai xe xuất phát cùng một điểm, một xe đi về bắc 60 km/h, xe kia đi về đông 80 km/h. Khoảng cách giữa hai xe tăng nhanh cỡ nào?</li><li>Bán kính hình tròn tăng 2 cm/s. Tìm dA/dt khi r = 5 cm.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) A = s<sup>2</sup> ⇒ A′ = 2s s′ = 2·10·3 = 60 cm<sup>2</sup>/s. 2) z<sup>2</sup> = x<sup>2</sup> + y<sup>2</sup> với x = 60t, y = 80t ⇒ z = 100t, nên z′ = 100 km/h ở mọi thời điểm. 3) A′ = 2πr r′ = 20π ≈ 62,83 cm<sup>2</sup>/s.</p></div>`);

const c43 = L('cal111-ts-4-3',
  '4.3 — Linear approximation and differentials|||4.3 — Xấp xỉ tuyến tính và vi phân',
  'Tuyến tính hoá L(x) = f(a) + f′(a)(x − a), xấp xỉ √4,1, sin 0,1, ∛27,5; vi phân dy = f′(x)dx; ước lượng sai số đo và sai số tương đối.',
  `<span class="eyebrow">CAL111 · Chapter 4 · Lesson 4.3</span>
<h2>Linear approximation and differentials</h2>
<p class="lead">Zoom in far enough on a smooth curve and it looks like its tangent line. Replacing a function by its tangent line near a point is the simplest — and one of the most used — approximations in science and engineering.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write the linearisation L(x) of f at a.</li><li>Use L(x) to approximate values such as √4.1 or sin 0.1.</li><li>Use differentials dy = f′(x) dx to estimate changes and errors.</li><li>Compute relative (percentage) error.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Linearisation of f at a</span>L(x) = f(a) + f′(a)(x − a)        f(x) ≈ L(x) for x near a</div>
<p>Choose a so that f(a) and f′(a) are easy to compute (a = 4 for √x, a = 0 for sin x or e<sup>x</sup>). The approximation is good when x − a is small; its error behaves like (x − a)<sup>2</sup>.</p>
<div class="formula"><span class="lbl">Differentials</span>dy = f′(x) dx        Δy ≈ dy when dx = Δx is small        relative error ≈ dy / y</div>
<p>Useful small-x approximations near 0: sin x ≈ x, tan x ≈ x, e<sup>x</sup> ≈ 1 + x, ln(1 + x) ≈ x, (1 + x)<sup>k</sup> ≈ 1 + kx. Physicists use sin θ ≈ θ to solve the pendulum; engineers use them every day.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> Approximate √4.1. f(x) = √x, a = 4: f(4) = 2, f′(4) = 1/(2·2) = 1/4. L(x) = 2 + (x − 4)/4 ⇒ √4.1 ≈ 2 + 0.1/4 = <b>2.025</b> (true value 2.024846…).</p></div>
<div class="callout"><p><b>Example 2.</b> sin(0.1) ≈ 0.1 (true 0.0998334); e<sup>0.05</sup> ≈ 1.05 (true 1.051271).</p></div>
<div class="callout"><p><b>Example 3.</b> ∛27.5 with a = 27: f′(x) = (1/3)x<sup>−2/3</sup>, f′(27) = 1/27. ∛27.5 ≈ 3 + 0.5/27 ≈ <b>3.01852</b> (true 3.01841).</p></div>
<div class="callout"><p><b>Example 4 — measurement error.</b> A cube's side is measured as 10 cm with possible error ±0.1 cm. V = x<sup>3</sup> ⇒ dV = 3x<sup>2</sup> dx = 3·100·0.1 = <b>±30 cm<sup>3</sup></b>. Relative error dV/V = 30/1000 = 3% — three times the 1% error in the side.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using an a far from x: √4.1 from a = 1 is poor.</li><li>Forgetting that x must be in radians for sin x ≈ x.</li><li>Confusing Δy (exact change) with dy (tangent-line change).</li><li>Reporting relative error without converting to a percentage when asked.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>L(x) = f(a) + f′(a)(x − a) is the tangent line.</li><li>Pick a with easy values close to x.</li><li>dy = f′(x)dx estimates change and error.</li><li>Relative error dy/y; for x<sup>n</sup> it is about n times the relative error in x.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-2-linear-approximations-and-differentials" target="_blank" rel="noopener">OpenStax — 4.2 Linear Approximations and Differentials</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/LinearApproximations.aspx" target="_blank" rel="noopener">Paul's Online Notes — Linear Approximations</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/Differentials.aspx" target="_blank" rel="noopener">Paul's Online Notes — Differentials</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-2-applications-of-differentiation/part-a-approximation-and-curve-sketching/" target="_blank" rel="noopener">MIT 18.01SC — Approximation and Curve Sketching</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Approximate (1.02)<sup>10</sup> with (1 + x)<sup>k</sup> ≈ 1 + kx.</li><li>Approximate ln(1.05).</li><li>A sphere's radius is 5 cm ± 0.05 cm. Estimate the error in its volume.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 1 + 10·0.02 = 1.2 (true 1.21899 — the approximation degrades as kx grows). 2) ≈ 0.05 (true 0.04879). 3) dV = 4πr<sup>2</sup>dr = 4π·25·0.05 = 5π ≈ 15.71 cm<sup>3</sup>.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 4 · Bài 4.3</span>
<h2>Xấp xỉ tuyến tính và vi phân</h2>
<p class="lead">Phóng to đủ gần một đường cong trơn thì nó trông như tiếp tuyến. Thay hàm bằng tiếp tuyến gần một điểm là phép xấp xỉ đơn giản nhất — và được dùng nhiều nhất — trong khoa học và kỹ thuật.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết hàm tuyến tính hoá L(x) của f tại a.</li><li>Dùng L(x) xấp xỉ các giá trị như √4,1 hay sin 0,1.</li><li>Dùng vi phân dy = f′(x) dx ước lượng thay đổi và sai số.</li><li>Tính sai số tương đối (phần trăm).</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Tuyến tính hoá f tại a</span>L(x) = f(a) + f′(a)(x − a)        f(x) ≈ L(x) khi x gần a</div>
<p>Chọn a sao cho f(a), f′(a) dễ tính (a = 4 cho √x, a = 0 cho sin x hay e<sup>x</sup>). Xấp xỉ tốt khi x − a nhỏ; sai số cỡ (x − a)<sup>2</sup>.</p>
<div class="formula"><span class="lbl">Vi phân</span>dy = f′(x) dx        Δy ≈ dy khi dx = Δx nhỏ        sai số tương đối ≈ dy / y</div>
<p>Các xấp xỉ hữu ích khi x gần 0: sin x ≈ x, tan x ≈ x, e<sup>x</sup> ≈ 1 + x, ln(1 + x) ≈ x, (1 + x)<sup>k</sup> ≈ 1 + kx. Nhà vật lý dùng sin θ ≈ θ để giải con lắc; kỹ sư dùng chúng hằng ngày.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> Xấp xỉ √4,1. f(x) = √x, a = 4: f(4) = 2, f′(4) = 1/(2·2) = 1/4. L(x) = 2 + (x − 4)/4 ⇒ √4,1 ≈ 2 + 0,1/4 = <b>2,025</b> (giá trị thật 2,024846…).</p></div>
<div class="callout"><p><b>Ví dụ 2.</b> sin(0,1) ≈ 0,1 (thật 0,0998334); e<sup>0,05</sup> ≈ 1,05 (thật 1,051271).</p></div>
<div class="callout"><p><b>Ví dụ 3.</b> ∛27,5 với a = 27: f′(x) = (1/3)x<sup>−2/3</sup>, f′(27) = 1/27. ∛27,5 ≈ 3 + 0,5/27 ≈ <b>3,01852</b> (thật 3,01841).</p></div>
<div class="callout"><p><b>Ví dụ 4 — sai số đo.</b> Cạnh khối lập phương đo được 10 cm, sai số ±0,1 cm. V = x<sup>3</sup> ⇒ dV = 3x<sup>2</sup> dx = 3·100·0,1 = <b>±30 cm<sup>3</sup></b>. Sai số tương đối dV/V = 30/1000 = 3% — gấp ba sai số 1% của cạnh.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chọn a xa x: xấp xỉ √4,1 từ a = 1 rất kém.</li><li>Quên x phải theo radian khi dùng sin x ≈ x.</li><li>Nhầm Δy (thay đổi thật) với dy (thay đổi theo tiếp tuyến).</li><li>Báo sai số tương đối mà không đổi ra phần trăm khi đề yêu cầu.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>L(x) = f(a) + f′(a)(x − a) chính là tiếp tuyến.</li><li>Chọn a gần x và có giá trị dễ tính.</li><li>dy = f′(x)dx ước lượng thay đổi và sai số.</li><li>Sai số tương đối dy/y; với x<sup>n</sup> nó gấp khoảng n lần sai số tương đối của x.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-2-linear-approximations-and-differentials" target="_blank" rel="noopener">OpenStax — 4.2 Xấp xỉ tuyến tính và vi phân</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/LinearApproximations.aspx" target="_blank" rel="noopener">Paul's Online Notes — Xấp xỉ tuyến tính</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/Differentials.aspx" target="_blank" rel="noopener">Paul's Online Notes — Vi phân</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-2-applications-of-differentiation/part-a-approximation-and-curve-sketching/" target="_blank" rel="noopener">MIT 18.01SC — Xấp xỉ và vẽ đồ thị</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Xấp xỉ (1,02)<sup>10</sup> bằng (1 + x)<sup>k</sup> ≈ 1 + kx.</li><li>Xấp xỉ ln(1,05).</li><li>Bán kính quả cầu 5 cm ± 0,05 cm. Ước lượng sai số thể tích.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 1 + 10·0,02 = 1,2 (thật 1,21899 — xấp xỉ kém dần khi kx lớn). 2) ≈ 0,05 (thật 0,04879). 3) dV = 4πr<sup>2</sup>dr = 4π·25·0,05 = 5π ≈ 15,71 cm<sup>3</sup>.</p></div>`);

const q4 = QZ(4, 'Quiz — Chapter 4: Implicit differentiation, related rates, approximation|||Quiz — Chương 4: Hàm ẩn, tốc độ liên quan, xấp xỉ', 'Kiểm tra chương 4: đạo hàm hàm ẩn, hàm ngược, đạo hàm logarit, tốc độ liên quan, xấp xỉ tuyến tính, vi phân.', [
  Q('q1', 'For x² + y² = 25, dy/dx at (3, 4) is|||Với x² + y² = 25, dy/dx tại (3, 4) bằng',
    ['3/4|||3/4', '−3/4|||−3/4', '4/3|||4/3', '−4/3|||−4/3'], 1,
    '2x + 2yy′ = 0 ⇒ y′ = −x/y = −3/4.|||2x + 2yy′ = 0 ⇒ y′ = −x/y = −3/4.'),
  Q('q2', 'For x³ + y³ = 6xy, the slope at (3, 3) is|||Với x³ + y³ = 6xy, hệ số góc tại (3, 3) là',
    ['1|||1', '−1|||−1', '0|||0', 'undefined|||không xác định'], 1,
    'y′ = (2y − x²)/(y² − 2x) = (6 − 9)/(9 − 6) = −1.|||y′ = (2y − x²)/(y² − 2x) = (6 − 9)/(9 − 6) = −1.'),
  Q('q3', 'd/dx (xˣ) =|||d/dx (xˣ) =',
    ['x·x^(x−1)|||x·x^(x−1)', 'xˣ ln x|||xˣ ln x', 'xˣ(ln x + 1)|||xˣ(ln x + 1)', 'ln x + 1|||ln x + 1'], 2,
    'ln y = x ln x ⇒ y′/y = ln x + 1.|||ln y = x ln x ⇒ y′/y = ln x + 1.'),
  Q('q4', 'd/dx arctan x =|||d/dx arctan x =',
    ['1/√(1 − x²)|||1/√(1 − x²)', '1/(1 + x²)|||1/(1 + x²)', 'sec² x|||sec² x', '−1/(1 + x²)|||−1/(1 + x²)'], 1,
    'tan y = x ⇒ sec²y·y′ = 1 ⇒ y′ = 1/(1 + tan²y) = 1/(1 + x²).|||tan y = x ⇒ sec²y·y′ = 1 ⇒ y′ = 1/(1 + tan²y) = 1/(1 + x²).'),
  Q('q5', 'A 10 m ladder: bottom slides out at 1 m/s. When the bottom is 6 m from the wall, the top moves at|||Thang 10 m: chân trượt ra 1 m/s. Khi chân cách tường 6 m, đỉnh di chuyển với tốc độ',
    ['−0.75 m/s|||−0,75 m/s', '−1 m/s|||−1 m/s', '−1.33 m/s|||−1,33 m/s', '−0.6 m/s|||−0,6 m/s'], 0,
    '2xx′ + 2yy′ = 0 with x = 6, y = 8, x′ = 1 ⇒ y′ = −6/8.|||2xx′ + 2yy′ = 0 với x = 6, y = 8, x′ = 1 ⇒ y′ = −6/8.'),
  Q('q6', 'A balloon gains 100 cm³/s. At r = 25 cm, dr/dt =|||Bóng bay tăng 100 cm³/s. Tại r = 25 cm, dr/dt =',
    ['1/(25π) cm/s|||1/(25π) cm/s', '4/π cm/s|||4/π cm/s', '1/(100π) cm/s|||1/(100π) cm/s', '25π cm/s|||25π cm/s'], 0,
    'V′ = 4πr²r′ ⇒ r′ = 100/(4π·625) = 1/(25π).|||V′ = 4πr²r′ ⇒ r′ = 100/(4π·625) = 1/(25π).'),
  Q('q7', 'The linear approximation of √x at a = 4 gives √4.1 ≈|||Xấp xỉ tuyến tính của √x tại a = 4 cho √4,1 ≈',
    ['2.01|||2,01', '2.025|||2,025', '2.05|||2,05', '2.1|||2,1'], 1,
    'L(x) = 2 + (x − 4)/4 ⇒ 2 + 0.025.|||L(x) = 2 + (x − 4)/4 ⇒ 2 + 0,025.'),
  Q('q8', 'A cube side 10 cm ± 0.1 cm. The estimated volume error dV is|||Cạnh khối lập phương 10 cm ± 0,1 cm. Sai số thể tích ước lượng dV là',
    ['±3 cm³|||±3 cm³', '±10 cm³|||±10 cm³', '±30 cm³|||±30 cm³', '±300 cm³|||±300 cm³'], 2,
    'dV = 3x²dx = 300·0.1 = 30.|||dV = 3x²dx = 300·0,1 = 30.'),
  Q('q9', 'Water fills an inverted cone (height 4 m, radius 2 m) at 2 m³/min. At h = 3 m, dh/dt =|||Nước vào bể nón úp ngược (cao 4 m, bán kính 2 m) 2 m³/phút. Tại h = 3 m, dh/dt =',
    ['8/(9π) m/min|||8/(9π) m/phút', '2/(9π) m/min|||2/(9π) m/phút', '9π/8 m/min|||9π/8 m/phút', '1/(3π) m/min|||1/(3π) m/phút'], 0,
    'V = (π/12)h³ ⇒ 2 = (π/4)·9·h′.|||V = (π/12)h³ ⇒ 2 = (π/4)·9·h′.'),
]);

const ch4 = {
  title: 'Chapter 4 — Implicit differentiation, related rates and approximation|||Chương 4 — Đạo hàm hàm ẩn, tốc độ liên quan và xấp xỉ',
  description: 'Đạo hàm hàm ẩn, đạo hàm hàm ngược và lượng giác ngược, đạo hàm logarit, bài toán tốc độ liên quan, xấp xỉ tuyến tính và vi phân (Stewart 3.5–3.10 · OpenStax 3.7–4.2).',
  lessons: [c41, c42, c43, q4],
};

// ───────────────────────────── Chương 5 — Khảo sát hàm số bằng đạo hàm ─────────────────────────────
const c51 = L('cal111-ts-5-1',
  '5.1 — Maximum and minimum values: critical numbers and the closed interval method|||5.1 — Giá trị lớn nhất, nhỏ nhất: điểm tới hạn và phương pháp khoảng đóng',
  'Cực trị tuyệt đối và địa phương, định lý giá trị cực trị, định lý Fermat, điểm tới hạn (f′ = 0 hoặc không tồn tại), phương pháp khoảng đóng.',
  `<span class="eyebrow">CAL111 · Chapter 5 · Lesson 5.1</span>
<h2>Maximum and minimum values</h2>
<p class="lead">Lowest cost, highest profit, shortest path, smallest error: optimisation problems are everywhere. The first step is knowing <em>where</em> a function can possibly reach its extreme values.</p>
<h3>🎯 Objectives</h3>
<ul><li>Distinguish absolute (global) and local extrema.</li><li>State the Extreme Value Theorem and Fermat's theorem.</li><li>Find critical numbers, including points where f′ does not exist.</li><li>Apply the closed interval method.</li></ul>
<h3>📖 Lecture</h3>
<p>f has an <strong>absolute maximum</strong> at c if f(c) ≥ f(x) for all x in the domain, and a <strong>local maximum</strong> at c if f(c) ≥ f(x) for x near c (similarly for minima).</p>
<div class="formula"><span class="lbl">Extreme Value Theorem</span>f continuous on a closed interval [a, b] ⇒ f attains an absolute max and an absolute min on [a, b].</div>
<div class="formula"><span class="lbl">Fermat's theorem and critical numbers</span>If f has a local extremum at c and f′(c) exists, then f′(c) = 0.<br>c is a critical number of f if c is in the domain and f′(c) = 0 or f′(c) does not exist.</div>
<p>Warning: the converse of Fermat is false — f(x) = x<sup>3</sup> has f′(0) = 0 but no extremum at 0. Critical numbers are only <em>candidates</em>.</p>
<div class="formula"><span class="lbl">Closed interval method (f continuous on [a, b])</span>1) Find the critical numbers of f in (a, b).    2) Evaluate f at them and at the endpoints a, b.<br>3) The largest value is the absolute max; the smallest is the absolute min.</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> f(x) = x<sup>3</sup> − 3x<sup>2</sup> + 1 on [−1, 4].</p><p>f′(x) = 3x<sup>2</sup> − 6x = 3x(x − 2) = 0 ⇒ x = 0, 2. Table: f(−1) = −3, f(0) = 1, f(2) = −3, f(4) = 17. <b>Absolute max 17 at x = 4; absolute min −3 at x = −1 and x = 2.</b></p></div>
<div class="callout"><p><b>Example 2.</b> f(x) = x e<sup>−x</sup> on [0, 3].</p><p>f′(x) = e<sup>−x</sup>(1 − x) = 0 ⇒ x = 1. f(0) = 0, f(1) = 1/e ≈ 0.368, f(3) = 3e<sup>−3</sup> ≈ 0.149. <b>Max 1/e at x = 1, min 0 at x = 0.</b></p></div>
<div class="callout"><p><b>Example 3 — f′ undefined.</b> g(x) = x<sup>1/3</sup>(4 − x). g′(x) = (4 − 4x)/(3x<sup>2/3</sup>). Critical numbers: <b>x = 1</b> (g′ = 0) and <b>x = 0</b> (g′ undefined, g defined).</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting to test the endpoints.</li><li>Missing critical numbers where f′ is undefined (denominators, roots).</li><li>Calling every critical number an extremum (x<sup>3</sup> at 0).</li><li>Reporting the x-value when the question asks for the maximum <em>value</em> f(c), or vice versa.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Continuous on [a, b] ⇒ absolute max and min exist.</li><li>Local extremum + differentiable ⇒ f′(c) = 0.</li><li>Critical numbers: f′ = 0 or f′ undefined.</li><li>Closed interval method: compare f at critical numbers and endpoints.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-3-maxima-and-minima" target="_blank" rel="noopener">OpenStax — 4.3 Maxima and Minima</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/CriticalPoints.aspx" target="_blank" rel="noopener">Paul's Online Notes — Critical Points</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/AbsExtrema.aspx" target="_blank" rel="noopener">Paul's Online Notes — Finding Absolute Extrema</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the absolute extrema of f(x) = 2x<sup>3</sup> − 3x<sup>2</sup> − 12x on [−2, 3].</li><li>Find the critical numbers of h(x) = |x − 2|.</li><li>Does f(x) = 1/x have an absolute maximum on (0, 1]? Why does this not contradict the Extreme Value Theorem?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) f′ = 6(x − 2)(x + 1) ⇒ x = −1, 2. f(−2) = −4, f(−1) = 7, f(2) = −20, f(3) = −9: max 7 at x = −1, min −20 at x = 2. 2) x = 2 (corner, h′ undefined). 3) No — f → ∞ as x → 0⁺. The interval (0, 1] is not closed, so the theorem does not apply.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 5 · Bài 5.1</span>
<h2>Giá trị lớn nhất và nhỏ nhất</h2>
<p class="lead">Chi phí thấp nhất, lợi nhuận cao nhất, đường đi ngắn nhất, sai số nhỏ nhất: bài toán tối ưu ở khắp nơi. Bước đầu tiên là biết hàm có thể đạt cực trị <em>ở đâu</em>.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phân biệt cực trị tuyệt đối (toàn cục) và cực trị địa phương.</li><li>Phát biểu định lý giá trị cực trị và định lý Fermat.</li><li>Tìm điểm tới hạn, kể cả nơi f′ không tồn tại.</li><li>Áp dụng phương pháp khoảng đóng.</li></ul>
<h3>📖 Bài giảng</h3>
<p>f đạt <strong>giá trị lớn nhất tuyệt đối</strong> tại c nếu f(c) ≥ f(x) với mọi x thuộc tập xác định, và <strong>cực đại địa phương</strong> tại c nếu f(c) ≥ f(x) với x gần c (tương tự cho cực tiểu).</p>
<div class="formula"><span class="lbl">Định lý giá trị cực trị</span>f liên tục trên khoảng đóng [a, b] ⇒ f đạt giá trị lớn nhất và nhỏ nhất tuyệt đối trên [a, b].</div>
<div class="formula"><span class="lbl">Định lý Fermat và điểm tới hạn</span>Nếu f có cực trị địa phương tại c và f′(c) tồn tại thì f′(c) = 0.<br>c là điểm tới hạn của f nếu c thuộc tập xác định và f′(c) = 0 hoặc f′(c) không tồn tại.</div>
<p>Cảnh báo: chiều ngược của Fermat sai — f(x) = x<sup>3</sup> có f′(0) = 0 nhưng không có cực trị tại 0. Điểm tới hạn chỉ là <em>ứng viên</em>.</p>
<div class="formula"><span class="lbl">Phương pháp khoảng đóng (f liên tục trên [a, b])</span>1) Tìm điểm tới hạn của f trong (a, b).    2) Tính f tại chúng và tại hai đầu mút a, b.<br>3) Giá trị lớn nhất là max tuyệt đối; nhỏ nhất là min tuyệt đối.</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> f(x) = x<sup>3</sup> − 3x<sup>2</sup> + 1 trên [−1, 4].</p><p>f′(x) = 3x<sup>2</sup> − 6x = 3x(x − 2) = 0 ⇒ x = 0, 2. Bảng: f(−1) = −3, f(0) = 1, f(2) = −3, f(4) = 17. <b>Max tuyệt đối 17 tại x = 4; min tuyệt đối −3 tại x = −1 và x = 2.</b></p></div>
<div class="callout"><p><b>Ví dụ 2.</b> f(x) = x e<sup>−x</sup> trên [0, 3].</p><p>f′(x) = e<sup>−x</sup>(1 − x) = 0 ⇒ x = 1. f(0) = 0, f(1) = 1/e ≈ 0,368, f(3) = 3e<sup>−3</sup> ≈ 0,149. <b>Max 1/e tại x = 1, min 0 tại x = 0.</b></p></div>
<div class="callout"><p><b>Ví dụ 3 — f′ không tồn tại.</b> g(x) = x<sup>1/3</sup>(4 − x). g′(x) = (4 − 4x)/(3x<sup>2/3</sup>). Điểm tới hạn: <b>x = 1</b> (g′ = 0) và <b>x = 0</b> (g′ không tồn tại, g xác định).</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên xét hai đầu mút.</li><li>Bỏ sót điểm tới hạn nơi f′ không xác định (mẫu số, căn).</li><li>Gọi mọi điểm tới hạn là cực trị (x<sup>3</sup> tại 0).</li><li>Trả lời giá trị x khi đề hỏi <em>giá trị</em> lớn nhất f(c), hoặc ngược lại.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Liên tục trên [a, b] ⇒ có max và min tuyệt đối.</li><li>Cực trị địa phương + khả vi ⇒ f′(c) = 0.</li><li>Điểm tới hạn: f′ = 0 hoặc f′ không tồn tại.</li><li>Phương pháp khoảng đóng: so sánh f tại điểm tới hạn và đầu mút.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-3-maxima-and-minima" target="_blank" rel="noopener">OpenStax — 4.3 Cực đại và cực tiểu</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/CriticalPoints.aspx" target="_blank" rel="noopener">Paul's Online Notes — Điểm tới hạn</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/AbsExtrema.aspx" target="_blank" rel="noopener">Paul's Online Notes — Tìm cực trị tuyệt đối</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm cực trị tuyệt đối của f(x) = 2x<sup>3</sup> − 3x<sup>2</sup> − 12x trên [−2, 3].</li><li>Tìm điểm tới hạn của h(x) = |x − 2|.</li><li>f(x) = 1/x có giá trị lớn nhất trên (0, 1] không? Vì sao điều này không mâu thuẫn định lý giá trị cực trị?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) f′ = 6(x − 2)(x + 1) ⇒ x = −1, 2. f(−2) = −4, f(−1) = 7, f(2) = −20, f(3) = −9: max 7 tại x = −1, min −20 tại x = 2. 2) x = 2 (điểm góc, h′ không tồn tại). 3) Không — f → ∞ khi x → 0⁺. Khoảng (0, 1] không đóng nên định lý không áp dụng.</p></div>`);

const c52 = L('cal111-ts-5-2',
  '5.2 — The Mean Value Theorem and increasing/decreasing functions|||5.2 — Định lý giá trị trung bình và tính đơn điệu',
  'Định lý Rolle, định lý giá trị trung bình (Lagrange) và ý nghĩa vận tốc; hệ quả f′ = 0 ⇒ hằng; xét đồng biến/nghịch biến; tiêu chuẩn đạo hàm cấp một cho cực trị địa phương.',
  `<span class="eyebrow">CAL111 · Chapter 5 · Lesson 5.2</span>
<h2>The Mean Value Theorem and monotonicity</h2>
<p class="lead">If you drove 150 km in 1.5 hours, at some instant your speedometer read exactly 100 km/h. That everyday fact is the Mean Value Theorem — the bridge from the sign of f′ to the shape of f.</p>
<h3>🎯 Objectives</h3>
<ul><li>State Rolle's theorem and the Mean Value Theorem (MVT) and check their hypotheses.</li><li>Find the number c promised by the MVT.</li><li>Use the sign of f′ to find where f increases or decreases.</li><li>Classify critical numbers with the first derivative test.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Rolle's theorem</span>f continuous on [a, b], differentiable on (a, b), f(a) = f(b) ⇒ f′(c) = 0 for some c in (a, b).</div>
<div class="formula"><span class="lbl">Mean Value Theorem</span>f continuous on [a, b], differentiable on (a, b) ⇒ f′(c) = [f(b) − f(a)] / (b − a) for some c in (a, b).</div>
<p>Geometrically: some tangent line is parallel to the secant joining the endpoints. Physically: the instantaneous velocity equals the average velocity at least once.</p>
<p><strong>Consequences.</strong> If f′(x) = 0 on an interval, f is constant there. If f′ = g′ on an interval, then f − g is a constant (this is why antiderivatives differ by + C).</p>
<div class="formula"><span class="lbl">Increasing / decreasing test</span>f′ &gt; 0 on an interval ⇒ f increasing there    f′ &lt; 0 ⇒ f decreasing</div>
<div class="formula"><span class="lbl">First derivative test at a critical number c</span>f′ changes + → − ⇒ local max    f′ changes − → + ⇒ local min    no sign change ⇒ no extremum</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — MVT.</b> f(x) = x<sup>3</sup> − x on [0, 2].</p><p>Average slope: [f(2) − f(0)]/2 = (6 − 0)/2 = 3. Solve f′(c) = 3c<sup>2</sup> − 1 = 3 ⇒ c<sup>2</sup> = 4/3 ⇒ c = 2/√3 ≈ <b>1.155</b>, which lies in (0, 2).</p></div>
<div class="callout"><p><b>Example 2 — Rolle.</b> f(x) = x<sup>2</sup> − 4x + 1 on [0, 4]: f(0) = f(4) = 1, f′(c) = 2c − 4 = 0 ⇒ <b>c = 2</b>.</p></div>
<div class="callout"><p><b>Example 3 — monotonicity.</b> f(x) = x<sup>3</sup> − 12x + 1.</p><p>f′(x) = 3(x − 2)(x + 2). Sign chart: + on (−∞, −2), − on (−2, 2), + on (2, ∞). So f increases on (−∞, −2) and (2, ∞), decreases on (−2, 2). Local max f(−2) = <b>17</b>; local min f(2) = <b>−15</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Applying the MVT without checking continuity and differentiability (|x| on [−1, 1] has no c).</li><li>Giving a c outside the open interval.</li><li>Concluding a max/min from f′(c) = 0 alone, without a sign change.</li><li>Writing “increasing on (−∞, −2) ∪ (2, ∞)” as one interval — state two intervals.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>MVT: f′(c) = average rate of change over [a, b].</li><li>f′ = 0 everywhere ⇒ f constant.</li><li>Sign of f′ ⇒ increasing/decreasing.</li><li>First derivative test classifies critical numbers.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-4-the-mean-value-theorem" target="_blank" rel="noopener">OpenStax — 4.4 The Mean Value Theorem</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/MeanValueTheorem.aspx" target="_blank" rel="noopener">Paul's Online Notes — The Mean Value Theorem</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ShapeofGraphPtI.aspx" target="_blank" rel="noopener">Paul's Online Notes — The Shape of a Graph, Part I</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-2-applications-of-differentiation/part-c-mean-value-theorem-antiderivatives-and-differential-equations/" target="_blank" rel="noopener">MIT 18.01SC — Mean Value Theorem, Antiderivatives and Differential Equations</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find c from the MVT for f(x) = √x on [1, 9].</li><li>Find the intervals of increase/decrease and the local extrema of f(x) = x<sup>4</sup> − 2x<sup>2</sup>.</li><li>A car travels 150 km in 1.5 h. Explain with the MVT why its speed was exactly 100 km/h at some moment.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (3 − 1)/8 = 1/4 = 1/(2√c) ⇒ √c = 2 ⇒ c = 4. 2) f′ = 4x(x − 1)(x + 1): decreasing on (−∞, −1) and (0, 1), increasing on (−1, 0) and (1, ∞); local min f(±1) = −1, local max f(0) = 0. 3) Position s(t) is differentiable; average velocity = 150/1.5 = 100 km/h, so s′(c) = 100 for some c.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 5 · Bài 5.2</span>
<h2>Định lý giá trị trung bình và tính đơn điệu</h2>
<p class="lead">Nếu bạn lái 150 km trong 1,5 giờ thì có một lúc đồng hồ tốc độ chỉ đúng 100 km/h. Sự thật đời thường đó là Định lý giá trị trung bình — cây cầu nối dấu của f′ với hình dạng của f.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu định lý Rolle và định lý giá trị trung bình (MVT), kiểm tra giả thiết.</li><li>Tìm số c mà MVT bảo đảm.</li><li>Dùng dấu f′ tìm khoảng đồng biến, nghịch biến.</li><li>Phân loại điểm tới hạn bằng tiêu chuẩn đạo hàm cấp một.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Định lý Rolle</span>f liên tục trên [a, b], khả vi trên (a, b), f(a) = f(b) ⇒ f′(c) = 0 với c nào đó trong (a, b).</div>
<div class="formula"><span class="lbl">Định lý giá trị trung bình (Lagrange)</span>f liên tục trên [a, b], khả vi trên (a, b) ⇒ f′(c) = [f(b) − f(a)] / (b − a) với c nào đó trong (a, b).</div>
<p>Hình học: có một tiếp tuyến song song với cát tuyến nối hai đầu mút. Vật lý: vận tốc tức thời bằng vận tốc trung bình ít nhất một lần.</p>
<p><strong>Hệ quả.</strong> Nếu f′(x) = 0 trên một khoảng thì f là hằng trên đó. Nếu f′ = g′ trên một khoảng thì f − g là hằng số (vì vậy các nguyên hàm khác nhau một hằng + C).</p>
<div class="formula"><span class="lbl">Tiêu chuẩn đồng biến / nghịch biến</span>f′ &gt; 0 trên một khoảng ⇒ f đồng biến    f′ &lt; 0 ⇒ f nghịch biến</div>
<div class="formula"><span class="lbl">Tiêu chuẩn đạo hàm cấp một tại điểm tới hạn c</span>f′ đổi dấu + → − ⇒ cực đại địa phương    − → + ⇒ cực tiểu địa phương    không đổi dấu ⇒ không có cực trị</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — MVT.</b> f(x) = x<sup>3</sup> − x trên [0, 2].</p><p>Hệ số góc trung bình: [f(2) − f(0)]/2 = (6 − 0)/2 = 3. Giải f′(c) = 3c<sup>2</sup> − 1 = 3 ⇒ c<sup>2</sup> = 4/3 ⇒ c = 2/√3 ≈ <b>1,155</b>, thuộc (0, 2).</p></div>
<div class="callout"><p><b>Ví dụ 2 — Rolle.</b> f(x) = x<sup>2</sup> − 4x + 1 trên [0, 4]: f(0) = f(4) = 1, f′(c) = 2c − 4 = 0 ⇒ <b>c = 2</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — đơn điệu.</b> f(x) = x<sup>3</sup> − 12x + 1.</p><p>f′(x) = 3(x − 2)(x + 2). Bảng dấu: + trên (−∞, −2), − trên (−2, 2), + trên (2, ∞). Vậy f đồng biến trên (−∞, −2) và (2, ∞), nghịch biến trên (−2, 2). Cực đại f(−2) = <b>17</b>; cực tiểu f(2) = <b>−15</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Áp MVT mà không kiểm liên tục và khả vi (|x| trên [−1, 1] không có c).</li><li>Đưa ra c nằm ngoài khoảng mở.</li><li>Kết luận cực trị chỉ từ f′(c) = 0, không xét đổi dấu.</li><li>Viết “đồng biến trên (−∞, −2) ∪ (2, ∞)” như một khoảng — hãy nêu hai khoảng riêng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>MVT: f′(c) = tốc độ thay đổi trung bình trên [a, b].</li><li>f′ = 0 khắp nơi ⇒ f là hằng.</li><li>Dấu f′ ⇒ đồng biến/nghịch biến.</li><li>Tiêu chuẩn đạo hàm cấp một phân loại điểm tới hạn.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-4-the-mean-value-theorem" target="_blank" rel="noopener">OpenStax — 4.4 Định lý giá trị trung bình</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/MeanValueTheorem.aspx" target="_blank" rel="noopener">Paul's Online Notes — Định lý giá trị trung bình</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ShapeofGraphPtI.aspx" target="_blank" rel="noopener">Paul's Online Notes — Hình dạng đồ thị, phần I</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-2-applications-of-differentiation/part-c-mean-value-theorem-antiderivatives-and-differential-equations/" target="_blank" rel="noopener">MIT 18.01SC — Định lý giá trị trung bình, nguyên hàm và phương trình vi phân</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm c theo MVT cho f(x) = √x trên [1, 9].</li><li>Tìm khoảng đồng biến/nghịch biến và cực trị địa phương của f(x) = x<sup>4</sup> − 2x<sup>2</sup>.</li><li>Ô tô đi 150 km trong 1,5 giờ. Dùng MVT giải thích vì sao có lúc tốc độ đúng 100 km/h.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (3 − 1)/8 = 1/4 = 1/(2√c) ⇒ √c = 2 ⇒ c = 4. 2) f′ = 4x(x − 1)(x + 1): nghịch biến trên (−∞, −1) và (0, 1), đồng biến trên (−1, 0) và (1, ∞); cực tiểu f(±1) = −1, cực đại f(0) = 0. 3) Vị trí s(t) khả vi; vận tốc trung bình = 150/1,5 = 100 km/h, nên s′(c) = 100 tại c nào đó.</p></div>`);

const c53 = L('cal111-ts-5-3',
  '5.3 — Concavity, inflection points and curve sketching|||5.3 — Tính lồi lõm, điểm uốn và khảo sát vẽ đồ thị',
  'Dấu f″ và lồi/lõm, điểm uốn, tiêu chuẩn đạo hàm cấp hai cho cực trị, quy trình khảo sát vẽ đồ thị đầy đủ (ví dụ x²/(x² − 1)).',
  `<span class="eyebrow">CAL111 · Chapter 5 · Lesson 5.3</span>
<h2>Concavity, inflection points and curve sketching</h2>
<p class="lead">f′ tells you whether the graph goes up or down; f″ tells you how it bends. Together with limits and asymptotes, they let you sketch a graph accurately without a computer — and check what a computer shows you.</p>
<h3>🎯 Objectives</h3>
<ul><li>Use the sign of f″ to find intervals of concavity.</li><li>Locate inflection points.</li><li>Apply the second derivative test.</li><li>Follow a complete curve-sketching checklist.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Concavity test</span>f″ &gt; 0 on an interval ⇒ concave up (holds water, slopes increasing)    f″ &lt; 0 ⇒ concave down</div>
<p>An <strong>inflection point</strong> is a point on the graph where the concavity changes. Candidates are where f″ = 0 or f″ is undefined — but you must check that the sign actually changes (x<sup>4</sup> has f″(0) = 0 and no inflection).</p>
<div class="formula"><span class="lbl">Second derivative test (f′(c) = 0)</span>f″(c) &gt; 0 ⇒ local min    f″(c) &lt; 0 ⇒ local max    f″(c) = 0 ⇒ test fails, use the first derivative test</div>
<div class="formula"><span class="lbl">Curve-sketching checklist</span>A) domain   B) intercepts   C) symmetry (even/odd/periodic)   D) asymptotes (vertical, horizontal)<br>E) f′: intervals of increase/decrease   F) local extrema   G) f″: concavity, inflection points   H) sketch</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> f(x) = x<sup>3</sup> − 3x<sup>2</sup>.</p><p>f′ = 3x<sup>2</sup> − 6x ⇒ critical 0, 2. f″ = 6x − 6. f″(0) = −6 &lt; 0 ⇒ <b>local max f(0) = 0</b>; f″(2) = 6 &gt; 0 ⇒ <b>local min f(2) = −4</b>. f″ &lt; 0 for x &lt; 1, &gt; 0 for x &gt; 1 ⇒ <b>inflection point (1, −2)</b>.</p></div>
<div class="callout"><p><b>Example 2 — full sketch.</b> f(x) = x<sup>2</sup>/(x<sup>2</sup> − 1).</p>
<p>A) x ≠ ±1. B) Only intercept (0, 0). C) Even. D) Vertical asymptotes x = ±1; lim<sub>x→±∞</sub> f = 1 ⇒ horizontal asymptote y = 1.</p>
<p>E) f′(x) = −2x/(x<sup>2</sup> − 1)<sup>2</sup>: positive for x &lt; 0, negative for x &gt; 0 (x ≠ ±1). F) Local max f(0) = 0.</p>
<p>G) f″(x) = (6x<sup>2</sup> + 2)/(x<sup>2</sup> − 1)<sup>3</sup>: numerator always &gt; 0, so concave up for |x| &gt; 1 and concave down for |x| &lt; 1. No inflection point (x = ±1 are not in the domain).</p>
<p>H) The graph: a downward “cap” between the asymptotes touching the origin, and two branches above y = 1 outside.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Declaring an inflection point wherever f″ = 0 without a sign change.</li><li>Counting a vertical asymptote as an inflection point — the point must be on the graph.</li><li>Using the second derivative test when f″(c) = 0 and concluding “no extremum”.</li><li>Confusing “concave up” with “increasing”.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>f″ &gt; 0: concave up; f″ &lt; 0: concave down.</li><li>Inflection = concavity change at a point of the graph.</li><li>Second derivative test: sign of f″(c) at a critical number.</li><li>Sketch with the A–H checklist.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-5-derivatives-and-the-shape-of-a-graph" target="_blank" rel="noopener">OpenStax — 4.5 Derivatives and the Shape of a Graph</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ShapeofGraphPtII.aspx" target="_blank" rel="noopener">Paul's Online Notes — The Shape of a Graph, Part II</a></li><li><a href="https://www.3blue1brown.com/lessons/higher-order-derivatives" target="_blank" rel="noopener">3Blue1Brown — Higher order derivatives</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the inflection points of f(x) = x<sup>4</sup> − 6x<sup>2</sup>.</li><li>Use the second derivative test on f(x) = x + 4/x.</li><li>Is (0, 0) an inflection point of y = x<sup>4</sup>?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) f″ = 12x<sup>2</sup> − 12 = 0 at x = ±1 and the sign changes there: inflection points (±1, −5). 2) f′ = 1 − 4/x<sup>2</sup> ⇒ x = ±2; f″ = 8/x<sup>3</sup>: f″(2) &gt; 0 ⇒ local min f(2) = 4; f″(−2) &lt; 0 ⇒ local max f(−2) = −4. 3) No — f″ = 12x<sup>2</sup> ≥ 0 does not change sign; the graph is concave up on both sides.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 5 · Bài 5.3</span>
<h2>Lồi lõm, điểm uốn và khảo sát vẽ đồ thị</h2>
<p class="lead">f′ cho biết đồ thị đi lên hay đi xuống; f″ cho biết nó uốn cong thế nào. Cùng với giới hạn và tiệm cận, chúng giúp bạn vẽ đồ thị chính xác mà không cần máy — và kiểm lại những gì máy hiện ra.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dùng dấu f″ tìm khoảng lồi/lõm.</li><li>Tìm điểm uốn.</li><li>Áp dụng tiêu chuẩn đạo hàm cấp hai.</li><li>Thực hiện trọn quy trình khảo sát vẽ đồ thị.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Tiêu chuẩn lồi lõm</span>f″ &gt; 0 trên một khoảng ⇒ lõm lên (concave up — “hứng nước”, hệ số góc tăng)    f″ &lt; 0 ⇒ lồi xuống (concave down)</div>
<p><strong>Điểm uốn</strong> là điểm trên đồ thị nơi tính lồi lõm đổi chiều. Ứng viên là nơi f″ = 0 hoặc f″ không tồn tại — nhưng phải kiểm dấu thật sự đổi (x<sup>4</sup> có f″(0) = 0 mà không có điểm uốn).</p>
<div class="formula"><span class="lbl">Tiêu chuẩn đạo hàm cấp hai (f′(c) = 0)</span>f″(c) &gt; 0 ⇒ cực tiểu    f″(c) &lt; 0 ⇒ cực đại    f″(c) = 0 ⇒ không kết luận được, dùng tiêu chuẩn cấp một</div>
<div class="formula"><span class="lbl">Quy trình khảo sát</span>A) tập xác định   B) giao điểm với trục   C) đối xứng (chẵn/lẻ/tuần hoàn)   D) tiệm cận (đứng, ngang)<br>E) f′: khoảng đồng/nghịch biến   F) cực trị   G) f″: lồi lõm, điểm uốn   H) vẽ</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> f(x) = x<sup>3</sup> − 3x<sup>2</sup>.</p><p>f′ = 3x<sup>2</sup> − 6x ⇒ điểm tới hạn 0, 2. f″ = 6x − 6. f″(0) = −6 &lt; 0 ⇒ <b>cực đại f(0) = 0</b>; f″(2) = 6 &gt; 0 ⇒ <b>cực tiểu f(2) = −4</b>. f″ &lt; 0 khi x &lt; 1, &gt; 0 khi x &gt; 1 ⇒ <b>điểm uốn (1, −2)</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — khảo sát đầy đủ.</b> f(x) = x<sup>2</sup>/(x<sup>2</sup> − 1).</p>
<p>A) x ≠ ±1. B) Giao điểm duy nhất (0, 0). C) Hàm chẵn. D) Tiệm cận đứng x = ±1; lim<sub>x→±∞</sub> f = 1 ⇒ tiệm cận ngang y = 1.</p>
<p>E) f′(x) = −2x/(x<sup>2</sup> − 1)<sup>2</sup>: dương khi x &lt; 0, âm khi x &gt; 0 (x ≠ ±1). F) Cực đại f(0) = 0.</p>
<p>G) f″(x) = (6x<sup>2</sup> + 2)/(x<sup>2</sup> − 1)<sup>3</sup>: tử luôn &gt; 0, nên lõm lên khi |x| &gt; 1 và lồi xuống khi |x| &lt; 1. Không có điểm uốn (x = ±1 không thuộc tập xác định).</p>
<p>H) Đồ thị: một “mũ” úp xuống giữa hai tiệm cận chạm gốc toạ độ, và hai nhánh nằm trên y = 1 ở bên ngoài.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Kết luận điểm uốn ở mọi chỗ f″ = 0 mà không kiểm đổi dấu.</li><li>Tính tiệm cận đứng là điểm uốn — điểm uốn phải nằm trên đồ thị.</li><li>Dùng tiêu chuẩn cấp hai khi f″(c) = 0 rồi kết luận “không có cực trị”.</li><li>Nhầm “lõm lên” với “đồng biến”.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>f″ &gt; 0: lõm lên; f″ &lt; 0: lồi xuống.</li><li>Điểm uốn = đổi chiều lồi lõm tại một điểm của đồ thị.</li><li>Tiêu chuẩn cấp hai: dấu f″(c) tại điểm tới hạn.</li><li>Vẽ theo quy trình A–H.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-5-derivatives-and-the-shape-of-a-graph" target="_blank" rel="noopener">OpenStax — 4.5 Đạo hàm và hình dạng đồ thị</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ShapeofGraphPtII.aspx" target="_blank" rel="noopener">Paul's Online Notes — Hình dạng đồ thị, phần II</a></li><li><a href="https://www.3blue1brown.com/lessons/higher-order-derivatives" target="_blank" rel="noopener">3Blue1Brown — Đạo hàm cấp cao</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm điểm uốn của f(x) = x<sup>4</sup> − 6x<sup>2</sup>.</li><li>Dùng tiêu chuẩn cấp hai cho f(x) = x + 4/x.</li><li>(0, 0) có phải điểm uốn của y = x<sup>4</sup> không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) f″ = 12x<sup>2</sup> − 12 = 0 tại x = ±1 và đổi dấu ở đó: điểm uốn (±1, −5). 2) f′ = 1 − 4/x<sup>2</sup> ⇒ x = ±2; f″ = 8/x<sup>3</sup>: f″(2) &gt; 0 ⇒ cực tiểu f(2) = 4; f″(−2) &lt; 0 ⇒ cực đại f(−2) = −4. 3) Không — f″ = 12x<sup>2</sup> ≥ 0 không đổi dấu; đồ thị lõm lên ở cả hai phía.</p></div>`);

const c54 = L('cal111-ts-5-4',
  "5.4 — Indeterminate forms and L'Hôpital's rule|||5.4 — Dạng vô định và quy tắc L'Hôpital",
  "Quy tắc L'Hôpital cho 0/0 và ∞/∞; đưa 0·∞, ∞ − ∞ về dạng thương; dạng mũ 1^∞, 0⁰, ∞⁰ bằng cách lấy ln; so sánh tốc độ tăng ln x ≪ xᵖ ≪ eˣ.",
  `<span class="eyebrow">CAL111 · Chapter 5 · Lesson 5.4</span>
<h2>Indeterminate forms and L'Hôpital's rule</h2>
<p class="lead">Limits like (e<sup>x</sup> − 1)/x or ln x/√x cannot be handled by algebra alone. L'Hôpital's rule turns them into limits of derivatives — and also tells us which functions grow faster, a key idea in algorithm analysis.</p>
<h3>🎯 Objectives</h3>
<ul><li>Recognise the seven indeterminate forms.</li><li>Apply L'Hôpital's rule to 0/0 and ∞/∞ (only after checking the form).</li><li>Rewrite 0·∞ and ∞ − ∞ as quotients.</li><li>Handle 1<sup>∞</sup>, 0<sup>0</sup>, ∞<sup>0</sup> by taking logarithms.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">L'Hôpital's rule</span>If lim f(x)/g(x) has the form 0/0 or ∞/∞ (f, g differentiable, g′ ≠ 0 near a), then<br>lim f(x)/g(x) = lim f′(x)/g′(x), provided the right-hand limit exists (or is ±∞).</div>
<p>Differentiate numerator and denominator <strong>separately</strong> — not the quotient rule. The rule works for x → a, a<sup>±</sup>, ±∞.</p>
<div class="formula"><span class="lbl">Other indeterminate forms</span>0·∞: write f·g = f/(1/g)    ∞ − ∞: combine into one fraction (common denominator / conjugate)<br>1<sup>∞</sup>, 0<sup>0</sup>, ∞<sup>0</sup>: let y = f<sup>g</sup>, compute lim ln y = lim g·ln f, then lim y = e<sup>lim ln y</sup></div>
<div class="formula"><span class="lbl">Growth hierarchy as x → ∞</span>ln x ≪ x<sup>p</sup> (p &gt; 0) ≪ e<sup>x</sup>    e.g. lim (ln x)/x<sup>p</sup> = 0, lim x<sup>n</sup>/e<sup>x</sup> = 0</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> lim<sub>x→0</sub> (e<sup>x</sup> − 1)/x: form 0/0 ⇒ lim e<sup>x</sup>/1 = <b>1</b>.</p></div>
<div class="callout"><p><b>Example 2.</b> lim<sub>x→∞</sub> ln x/√x: form ∞/∞ ⇒ lim (1/x)/(1/(2√x)) = lim 2/√x = <b>0</b>. Logs grow slower than any power.</p></div>
<div class="callout"><p><b>Example 3 — three times.</b> lim<sub>x→0</sub> (x − sin x)/x<sup>3</sup> → (1 − cos x)/(3x<sup>2</sup>) → sin x/(6x) → cos x/6 = <b>1/6</b>. Check the form (0/0) before each step.</p></div>
<div class="callout"><p><b>Example 4 — 0·∞.</b> lim<sub>x→0⁺</sub> x ln x = lim ln x/(1/x) (∞/∞) = lim (1/x)/(−1/x<sup>2</sup>) = lim (−x) = <b>0</b>.</p></div>
<div class="callout"><p><b>Example 5 — 1<sup>∞</sup>.</b> lim<sub>x→∞</sub> (1 + 3/x)<sup>x</sup>. ln y = x ln(1 + 3/x) = ln(1 + 3/x)/(1/x) (0/0) → [(−3/x<sup>2</sup>)/(1 + 3/x)]/(−1/x<sup>2</sup>) = 3/(1 + 3/x) → 3. So lim y = <b>e<sup>3</sup></b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using the rule when the limit is not indeterminate: lim<sub>x→0</sub> (x + 1)/(x + 2) = 1/2, but “L'Hôpital” would give 1.</li><li>Applying the quotient rule to f/g instead of differentiating f and g separately.</li><li>Concluding “no limit” when lim f′/g′ fails to exist: lim (x + sin x)/x = 1, although lim (1 + cos x) does not exist — the rule simply does not apply.</li><li>Forgetting to exponentiate at the end of a 1<sup>∞</sup> problem.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Only 0/0 or ∞/∞: then lim f/g = lim f′/g′.</li><li>0·∞ and ∞ − ∞ ⇒ rewrite as a quotient.</li><li>Exponential forms ⇒ take ln, then e<sup>(…)</sup>.</li><li>ln x ≪ x<sup>p</sup> ≪ e<sup>x</sup>.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-8-lhopitals-rule" target="_blank" rel="noopener">OpenStax — 4.8 L'Hôpital's Rule</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/LHospitalsRule.aspx" target="_blank" rel="noopener">Paul's Online Notes — L'Hospital's Rule and Indeterminate Forms</a></li><li><a href="https://www.3blue1brown.com/lessons/l-hopitals-rule" target="_blank" rel="noopener">3Blue1Brown — L'Hôpital's rule</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-5-exploring-the-infinite/part-a-lhospitals-rule-and-improper-integrals/" target="_blank" rel="noopener">MIT 18.01SC — L'Hospital's Rule and Improper Integrals</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>lim<sub>x→0</sub> (1 − cos x)/x<sup>2</sup>.</li><li>lim<sub>x→0⁺</sub> x<sup>x</sup>.</li><li>lim<sub>x→∞</sub> x<sup>2</sup>e<sup>−x</sup>.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) → sin x/(2x) → cos x/2 = 1/2. 2) ln y = x ln x → 0 (Example 4), so the limit is e<sup>0</sup> = 1. 3) x<sup>2</sup>/e<sup>x</sup> → 2x/e<sup>x</sup> → 2/e<sup>x</sup> → 0.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 5 · Bài 5.4</span>
<h2>Dạng vô định và quy tắc L'Hôpital</h2>
<p class="lead">Những giới hạn như (e<sup>x</sup> − 1)/x hay ln x/√x không giải được chỉ bằng đại số. Quy tắc L'Hôpital biến chúng thành giới hạn của đạo hàm — và còn cho biết hàm nào tăng nhanh hơn, ý tưởng then chốt khi phân tích thuật toán.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận ra bảy dạng vô định.</li><li>Áp dụng L'Hôpital cho 0/0 và ∞/∞ (chỉ sau khi kiểm dạng).</li><li>Viết lại 0·∞ và ∞ − ∞ thành thương.</li><li>Xử lý 1<sup>∞</sup>, 0<sup>0</sup>, ∞<sup>0</sup> bằng cách lấy logarit.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Quy tắc L'Hôpital</span>Nếu lim f(x)/g(x) có dạng 0/0 hoặc ∞/∞ (f, g khả vi, g′ ≠ 0 gần a) thì<br>lim f(x)/g(x) = lim f′(x)/g′(x), miễn là giới hạn vế phải tồn tại (hoặc bằng ±∞).</div>
<p>Đạo hàm tử và mẫu <strong>riêng rẽ</strong> — không dùng quy tắc thương. Quy tắc đúng cho x → a, a<sup>±</sup>, ±∞.</p>
<div class="formula"><span class="lbl">Các dạng vô định khác</span>0·∞: viết f·g = f/(1/g)    ∞ − ∞: gộp thành một phân thức (quy đồng / liên hợp)<br>1<sup>∞</sup>, 0<sup>0</sup>, ∞<sup>0</sup>: đặt y = f<sup>g</sup>, tính lim ln y = lim g·ln f, rồi lim y = e<sup>lim ln y</sup></div>
<div class="formula"><span class="lbl">Thứ bậc tốc độ tăng khi x → ∞</span>ln x ≪ x<sup>p</sup> (p &gt; 0) ≪ e<sup>x</sup>    ví dụ lim (ln x)/x<sup>p</sup> = 0, lim x<sup>n</sup>/e<sup>x</sup> = 0</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> lim<sub>x→0</sub> (e<sup>x</sup> − 1)/x: dạng 0/0 ⇒ lim e<sup>x</sup>/1 = <b>1</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2.</b> lim<sub>x→∞</sub> ln x/√x: dạng ∞/∞ ⇒ lim (1/x)/(1/(2√x)) = lim 2/√x = <b>0</b>. Logarit tăng chậm hơn mọi luỹ thừa.</p></div>
<div class="callout"><p><b>Ví dụ 3 — ba lần.</b> lim<sub>x→0</sub> (x − sin x)/x<sup>3</sup> → (1 − cos x)/(3x<sup>2</sup>) → sin x/(6x) → cos x/6 = <b>1/6</b>. Kiểm dạng (0/0) trước mỗi bước.</p></div>
<div class="callout"><p><b>Ví dụ 4 — 0·∞.</b> lim<sub>x→0⁺</sub> x ln x = lim ln x/(1/x) (∞/∞) = lim (1/x)/(−1/x<sup>2</sup>) = lim (−x) = <b>0</b>.</p></div>
<div class="callout"><p><b>Ví dụ 5 — 1<sup>∞</sup>.</b> lim<sub>x→∞</sub> (1 + 3/x)<sup>x</sup>. ln y = x ln(1 + 3/x) = ln(1 + 3/x)/(1/x) (0/0) → [(−3/x<sup>2</sup>)/(1 + 3/x)]/(−1/x<sup>2</sup>) = 3/(1 + 3/x) → 3. Vậy lim y = <b>e<sup>3</sup></b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng quy tắc khi giới hạn không vô định: lim<sub>x→0</sub> (x + 1)/(x + 2) = 1/2, nhưng “L'Hôpital” lại ra 1.</li><li>Dùng quy tắc thương cho f/g thay vì đạo hàm f và g riêng.</li><li>Kết luận “không có giới hạn” khi lim f′/g′ không tồn tại: lim (x + sin x)/x = 1, dù lim (1 + cos x) không tồn tại — đơn giản là quy tắc không áp dụng được.</li><li>Quên lấy e mũ ở cuối bài dạng 1<sup>∞</sup>.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Chỉ với 0/0 hoặc ∞/∞: lim f/g = lim f′/g′.</li><li>0·∞ và ∞ − ∞ ⇒ viết lại thành thương.</li><li>Dạng mũ ⇒ lấy ln, rồi e<sup>(…)</sup>.</li><li>ln x ≪ x<sup>p</sup> ≪ e<sup>x</sup>.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-8-lhopitals-rule" target="_blank" rel="noopener">OpenStax — 4.8 Quy tắc L'Hôpital</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/LHospitalsRule.aspx" target="_blank" rel="noopener">Paul's Online Notes — L'Hospital và dạng vô định</a></li><li><a href="https://www.3blue1brown.com/lessons/l-hopitals-rule" target="_blank" rel="noopener">3Blue1Brown — Quy tắc L'Hôpital</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-5-exploring-the-infinite/part-a-lhospitals-rule-and-improper-integrals/" target="_blank" rel="noopener">MIT 18.01SC — L'Hospital và tích phân suy rộng</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>lim<sub>x→0</sub> (1 − cos x)/x<sup>2</sup>.</li><li>lim<sub>x→0⁺</sub> x<sup>x</sup>.</li><li>lim<sub>x→∞</sub> x<sup>2</sup>e<sup>−x</sup>.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) → sin x/(2x) → cos x/2 = 1/2. 2) ln y = x ln x → 0 (Ví dụ 4), nên giới hạn là e<sup>0</sup> = 1. 3) x<sup>2</sup>/e<sup>x</sup> → 2x/e<sup>x</sup> → 2/e<sup>x</sup> → 0.</p></div>`);

const q5 = QZ(5, 'Quiz — Chapter 5: Analysing functions with derivatives|||Quiz — Chương 5: Khảo sát hàm số bằng đạo hàm', "Kiểm tra chương 5: cực trị, điểm tới hạn, MVT, đơn điệu, lồi lõm, điểm uốn, L'Hôpital.", [
  Q('q1', 'Absolute maximum of f(x) = x³ − 3x² + 1 on [−1, 4] is|||Giá trị lớn nhất của f(x) = x³ − 3x² + 1 trên [−1, 4] là',
    ['1|||1', '17|||17', '−3|||−3', '5|||5'], 1,
    'Compare f(−1) = −3, f(0) = 1, f(2) = −3, f(4) = 17.|||So sánh f(−1) = −3, f(0) = 1, f(2) = −3, f(4) = 17.'),
  Q('q2', 'Critical numbers of g(x) = x^(1/3)(4 − x) are|||Điểm tới hạn của g(x) = x^(1/3)(4 − x) là',
    ['x = 1 only|||chỉ x = 1', 'x = 0 and x = 1|||x = 0 và x = 1', 'x = 4|||x = 4', 'x = 0 and x = 4|||x = 0 và x = 4'], 1,
    'g′ = (4 − 4x)/(3x^(2/3)): zero at 1, undefined at 0.|||g′ = (4 − 4x)/(3x^(2/3)): bằng 0 tại 1, không tồn tại tại 0.'),
  Q('q3', 'MVT for f(x) = x³ − x on [0, 2] gives c =|||MVT cho f(x) = x³ − x trên [0, 2] cho c =',
    ['1|||1', '2/√3|||2/√3', '√3|||√3', '1/√3|||1/√3'], 1,
    'Average slope 3 = 3c² − 1 ⇒ c² = 4/3.|||Hệ số góc trung bình 3 = 3c² − 1 ⇒ c² = 4/3.'),
  Q('q4', 'f(x) = x³ − 12x + 1 is decreasing on|||f(x) = x³ − 12x + 1 nghịch biến trên',
    ['(−∞, −2)|||(−∞, −2)', '(−2, 2)|||(−2, 2)', '(2, ∞)|||(2, ∞)', '(0, 4)|||(0, 4)'], 1,
    'f′ = 3(x − 2)(x + 2) < 0 between −2 and 2.|||f′ = 3(x − 2)(x + 2) < 0 giữa −2 và 2.'),
  Q('q5', 'The inflection point of f(x) = x³ − 3x² is|||Điểm uốn của f(x) = x³ − 3x² là',
    ['(0, 0)|||(0, 0)', '(2, −4)|||(2, −4)', '(1, −2)|||(1, −2)', 'none|||không có'], 2,
    'f″ = 6x − 6 changes sign at x = 1; f(1) = −2.|||f″ = 6x − 6 đổi dấu tại x = 1; f(1) = −2.'),
  Q('q6', 'For f(x) = x + 4/x, the second derivative test at x = 2 gives|||Với f(x) = x + 4/x, tiêu chuẩn cấp hai tại x = 2 cho',
    ['local max 4|||cực đại 4', 'local min 4|||cực tiểu 4', 'inflection point|||điểm uốn', 'test fails|||không kết luận'], 1,
    'f″ = 8/x³ > 0 at 2, f(2) = 4.|||f″ = 8/x³ > 0 tại 2, f(2) = 4.'),
  Q('q7', "lim (x→0) (x − sin x)/x³ =|||lim (x→0) (x − sin x)/x³ =",
    ['0|||0', '1/6|||1/6', '1/3|||1/3', '1|||1'], 1,
    "L'Hôpital three times: cos x/6 → 1/6.|||L'Hôpital ba lần: cos x/6 → 1/6."),
  Q('q8', 'lim (x→∞) (1 + 3/x)ˣ =|||lim (x→∞) (1 + 3/x)ˣ =',
    ['1|||1', '3|||3', 'e³|||e³', '∞|||∞'], 2,
    'Form 1^∞: lim x ln(1 + 3/x) = 3, so the limit is e³.|||Dạng 1^∞: lim x ln(1 + 3/x) = 3, nên giới hạn là e³.'),
  Q('q9', "Why can't L'Hôpital be used on lim (x→0) (x + 1)/(x + 2)?|||Vì sao không dùng L'Hôpital cho lim (x→0) (x + 1)/(x + 2)?",
    ['The functions are not differentiable|||Hàm không khả vi', 'It is not an indeterminate form (it equals 1/2)|||Không phải dạng vô định (bằng 1/2)', 'The limit is infinite|||Giới hạn vô cực', 'It can be used and gives 1|||Dùng được và ra 1'], 1,
    'Direct substitution gives 1/2; the rule needs 0/0 or ∞/∞.|||Thế trực tiếp ra 1/2; quy tắc cần dạng 0/0 hoặc ∞/∞.'),
  Q('q10', 'lim (x→0⁺) x ln x =|||lim (x→0⁺) x ln x =',
    ['0|||0', '−∞|||−∞', '1|||1', '−1|||−1'], 0,
    'ln x/(1/x) → (1/x)/(−1/x²) = −x → 0.|||ln x/(1/x) → (1/x)/(−1/x²) = −x → 0.'),
]);

const ch5 = {
  title: 'Chapter 5 — Analysing functions with derivatives|||Chương 5 — Khảo sát hàm số bằng đạo hàm',
  description: "Cực trị và phương pháp khoảng đóng, định lý giá trị trung bình, đơn điệu, lồi lõm và điểm uốn, khảo sát vẽ đồ thị, dạng vô định và quy tắc L'Hôpital (Stewart 4.1–4.5 · OpenStax 4.3–4.8).",
  lessons: [c51, c52, c53, c54, q5],
};

// ───────────────────────────── Chương 6 — Tối ưu, phương pháp Newton, nguyên hàm ─────────────────────────────
const c61 = L('cal111-ts-6-1',
  '6.1 — Optimisation problems|||6.1 — Bài toán tối ưu',
  'Quy trình 6 bước giải bài toán tối ưu: rào đất cạnh sông, hộp không nắp, lon hình trụ tốn ít vật liệu nhất, điểm gần nhất trên parabol, lợi nhuận lớn nhất.',
  `<span class="eyebrow">CAL111 · Chapter 6 · Lesson 6.1</span>
<h2>Optimisation problems</h2>
<p class="lead">Engineers minimise material, businesses maximise profit, ML algorithms minimise loss. Calculus turns “find the best” into a precise recipe: build a function, find its critical numbers, and prove which one is optimal.</p>
<h3>🎯 Objectives</h3>
<ul><li>Turn a word problem into a function of one variable with a domain.</li><li>Use a constraint to eliminate extra variables.</li><li>Find and justify the absolute maximum or minimum.</li><li>Interpret the answer in context with units.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Six-step method</span>1) Understand the problem; draw a picture.   2) Name the quantity Q to optimise and the other variables.<br>3) Write Q in terms of the variables.   4) Use the constraint to write Q as a function of ONE variable; state its domain.<br>5) Find critical numbers; compare with the endpoints (closed interval method) or use the first/second derivative test.<br>6) Answer the question that was asked, with units.</div>
<p>When the domain is an open interval (e.g. r &gt; 0), justify the global optimum: if f′ &lt; 0 to the left of c and f′ &gt; 0 to the right, then c gives the absolute minimum (first derivative test for absolute extrema).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — fencing.</b> A farmer has 1200 m of fence to enclose a rectangle along a straight river (no fence on the river side). Maximise the area.</p><p>Sides x (perpendicular, two of them) and y (parallel): 2x + y = 1200 ⇒ y = 1200 − 2x. A(x) = x(1200 − 2x), 0 ≤ x ≤ 600. A′ = 1200 − 4x = 0 ⇒ x = 300. A(0) = A(600) = 0, A(300) = 300·600 = <b>180 000 m<sup>2</sup></b> (300 m by 600 m).</p></div>
<div class="callout"><p><b>Example 2 — open box.</b> Cut equal squares of side x from the corners of a 12 cm × 12 cm sheet and fold up. Maximise the volume.</p><p>V(x) = x(12 − 2x)<sup>2</sup>, 0 ≤ x ≤ 6. V′ = (12 − 2x)(12 − 6x) = 0 ⇒ x = 2 or 6. V(0) = V(6) = 0, V(2) = 2·64 = <b>128 cm<sup>3</sup></b>.</p></div>
<div class="callout"><p><b>Example 3 — cheapest can.</b> A cylinder must hold 1000 cm<sup>3</sup>. Minimise the surface area.</p><p>πr<sup>2</sup>h = 1000 ⇒ h = 1000/(πr<sup>2</sup>). A(r) = 2πr<sup>2</sup> + 2πrh = 2πr<sup>2</sup> + 2000/r, r &gt; 0. A′ = 4πr − 2000/r<sup>2</sup> = 0 ⇒ r<sup>3</sup> = 500/π ⇒ r ≈ <b>5.42 cm</b>, h = 2r ≈ <b>10.84 cm</b>. A′ &lt; 0 before and &gt; 0 after, so this is the absolute minimum. The best can is as tall as it is wide.</p></div>
<div class="callout"><p><b>Example 4 — profit.</b> P(q) = −0.5q<sup>2</sup> + 40q − 300 (million VND, q in thousand units). P′ = −q + 40 = 0 ⇒ q = 40, P″ = −1 &lt; 0 ⇒ max profit P(40) = <b>500</b> million VND.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Keeping two variables — always use the constraint first.</li><li>Ignoring the domain (negative lengths, x larger than half the sheet).</li><li>Finding x but not answering the question (the area, the dimensions…).</li><li>Not justifying that the critical number is a maximum/minimum.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Objective function + constraint ⇒ one-variable function on a domain.</li><li>Critical numbers + endpoints, or a derivative test.</li><li>Justify the global optimum.</li><li>Answer in context with units.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-7-applied-optimization-problems" target="_blank" rel="noopener">OpenStax — 4.7 Applied Optimization Problems</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/Optimization.aspx" target="_blank" rel="noopener">Paul's Online Notes — Optimization</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/MoreOptimization.aspx" target="_blank" rel="noopener">Paul's Online Notes — More Optimization Problems</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/BusinessApps.aspx" target="_blank" rel="noopener">Paul's Online Notes — Business Applications</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Two positive numbers have sum 20. Maximise their product.</li><li>Find the point(s) on y = x<sup>2</sup> closest to (0, 2).</li><li>A rectangle has perimeter 40 m. What dimensions maximise its area?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) P = x(20 − x), P′ = 20 − 2x = 0 ⇒ 10 and 10, product 100. 2) Minimise d<sup>2</sup> = x<sup>2</sup> + (x<sup>2</sup> − 2)<sup>2</sup> = x<sup>4</sup> − 3x<sup>2</sup> + 4: derivative 4x<sup>3</sup> − 6x = 0 ⇒ x = 0 or x<sup>2</sup> = 3/2. d<sup>2</sup>(0) = 4, d<sup>2</sup> = 7/4 at x = ±√(3/2): points (±√(3/2), 3/2), distance √7/2 ≈ 1.323. 3) A square, 10 m × 10 m (area 100 m<sup>2</sup>).</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 6 · Bài 6.1</span>
<h2>Bài toán tối ưu</h2>
<p class="lead">Kỹ sư cực tiểu vật liệu, doanh nghiệp cực đại lợi nhuận, thuật toán học máy cực tiểu hàm mất mát. Giải tích biến câu “tìm cái tốt nhất” thành công thức rõ ràng: lập hàm, tìm điểm tới hạn, chứng minh điểm nào tối ưu.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Chuyển bài toán lời thành hàm một biến kèm miền xác định.</li><li>Dùng ràng buộc để khử biến thừa.</li><li>Tìm và lập luận giá trị lớn nhất/nhỏ nhất tuyệt đối.</li><li>Giải thích đáp số theo ngữ cảnh, có đơn vị.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Quy trình 6 bước</span>1) Hiểu đề; vẽ hình.   2) Đặt tên đại lượng Q cần tối ưu và các biến khác.<br>3) Viết Q theo các biến.   4) Dùng ràng buộc đưa Q về hàm MỘT biến; nêu miền xác định.<br>5) Tìm điểm tới hạn; so với đầu mút (phương pháp khoảng đóng) hoặc dùng tiêu chuẩn đạo hàm cấp một/hai.<br>6) Trả lời đúng câu đề hỏi, có đơn vị.</div>
<p>Khi miền là khoảng mở (vd r &gt; 0), cần lập luận cực trị toàn cục: nếu f′ &lt; 0 bên trái c và f′ &gt; 0 bên phải thì c cho giá trị nhỏ nhất tuyệt đối (tiêu chuẩn cấp một cho cực trị tuyệt đối).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — rào đất.</b> Bác nông dân có 1200 m hàng rào để rào mảnh đất chữ nhật sát bờ sông thẳng (không rào phía sông). Tìm diện tích lớn nhất.</p><p>Cạnh x (vuông góc bờ, có hai cạnh) và y (song song bờ): 2x + y = 1200 ⇒ y = 1200 − 2x. A(x) = x(1200 − 2x), 0 ≤ x ≤ 600. A′ = 1200 − 4x = 0 ⇒ x = 300. A(0) = A(600) = 0, A(300) = 300·600 = <b>180 000 m<sup>2</sup></b> (300 m × 600 m).</p></div>
<div class="callout"><p><b>Ví dụ 2 — hộp không nắp.</b> Cắt bốn hình vuông cạnh x ở góc tấm bìa 12 cm × 12 cm rồi gấp lên. Tìm thể tích lớn nhất.</p><p>V(x) = x(12 − 2x)<sup>2</sup>, 0 ≤ x ≤ 6. V′ = (12 − 2x)(12 − 6x) = 0 ⇒ x = 2 hoặc 6. V(0) = V(6) = 0, V(2) = 2·64 = <b>128 cm<sup>3</sup></b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — lon rẻ nhất.</b> Lon hình trụ chứa 1000 cm<sup>3</sup>. Tìm diện tích toàn phần nhỏ nhất.</p><p>πr<sup>2</sup>h = 1000 ⇒ h = 1000/(πr<sup>2</sup>). A(r) = 2πr<sup>2</sup> + 2πrh = 2πr<sup>2</sup> + 2000/r, r &gt; 0. A′ = 4πr − 2000/r<sup>2</sup> = 0 ⇒ r<sup>3</sup> = 500/π ⇒ r ≈ <b>5,42 cm</b>, h = 2r ≈ <b>10,84 cm</b>. A′ &lt; 0 trước và &gt; 0 sau, nên đây là giá trị nhỏ nhất tuyệt đối. Lon tối ưu có chiều cao bằng đường kính.</p></div>
<div class="callout"><p><b>Ví dụ 4 — lợi nhuận.</b> P(q) = −0,5q<sup>2</sup> + 40q − 300 (triệu đồng, q nghìn sản phẩm). P′ = −q + 40 = 0 ⇒ q = 40, P″ = −1 &lt; 0 ⇒ lợi nhuận lớn nhất P(40) = <b>500</b> triệu đồng.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Giữ hai biến — luôn dùng ràng buộc trước.</li><li>Bỏ qua miền xác định (độ dài âm, x lớn hơn nửa tấm bìa).</li><li>Tìm được x nhưng không trả lời câu hỏi (diện tích, kích thước…).</li><li>Không lập luận vì sao điểm tới hạn là max/min.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Hàm mục tiêu + ràng buộc ⇒ hàm một biến trên một miền.</li><li>Điểm tới hạn + đầu mút, hoặc tiêu chuẩn đạo hàm.</li><li>Lập luận cực trị toàn cục.</li><li>Trả lời theo ngữ cảnh, có đơn vị.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-7-applied-optimization-problems" target="_blank" rel="noopener">OpenStax — 4.7 Bài toán tối ưu ứng dụng</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/Optimization.aspx" target="_blank" rel="noopener">Paul's Online Notes — Tối ưu</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/MoreOptimization.aspx" target="_blank" rel="noopener">Paul's Online Notes — Thêm bài toán tối ưu</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/BusinessApps.aspx" target="_blank" rel="noopener">Paul's Online Notes — Ứng dụng trong kinh doanh</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Hai số dương có tổng 20. Tìm tích lớn nhất.</li><li>Tìm điểm trên y = x<sup>2</sup> gần (0, 2) nhất.</li><li>Hình chữ nhật chu vi 40 m. Kích thước nào cho diện tích lớn nhất?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) P = x(20 − x), P′ = 20 − 2x = 0 ⇒ 10 và 10, tích 100. 2) Cực tiểu d<sup>2</sup> = x<sup>2</sup> + (x<sup>2</sup> − 2)<sup>2</sup> = x<sup>4</sup> − 3x<sup>2</sup> + 4: đạo hàm 4x<sup>3</sup> − 6x = 0 ⇒ x = 0 hoặc x<sup>2</sup> = 3/2. d<sup>2</sup>(0) = 4, d<sup>2</sup> = 7/4 tại x = ±√(3/2): điểm (±√(3/2), 3/2), khoảng cách √7/2 ≈ 1,323. 3) Hình vuông 10 m × 10 m (diện tích 100 m<sup>2</sup>).</p></div>`);

const c62 = L('cal111-ts-6-2',
  "6.2 — Newton's method: solving equations numerically|||6.2 — Phương pháp Newton: giải phương trình bằng số",
  'Công thức lặp Newton xₙ₊₁ = xₙ − f(xₙ)/f′(xₙ), tính √2, giải x³ − 2x − 5 = 0, cài đặt bằng Python (đã chạy thật), khi nào phương pháp thất bại.',
  `<span class="eyebrow">CAL111 · Chapter 6 · Lesson 6.2</span>
<h2>Newton's method</h2>
<p class="lead">Most equations — x<sup>3</sup> − 2x − 5 = 0, cos x = x — have no formula for their roots. Newton's method follows tangent lines to the root and roughly doubles the number of correct digits at every step. Your calculator's √ key and many ML optimisers use this idea.</p>
<h3>🎯 Objectives</h3>
<ul><li>Derive the Newton iteration from the tangent line.</li><li>Carry out several iterations by hand.</li><li>Implement the method in Python.</li><li>Recognise when the method fails.</li></ul>
<h3>📖 Lecture</h3>
<p>Start with a guess x<sub>n</sub>. The tangent at (x<sub>n</sub>, f(x<sub>n</sub>)) is y = f(x<sub>n</sub>) + f′(x<sub>n</sub>)(x − x<sub>n</sub>). Set y = 0 and solve for x: that intercept is the next guess.</p>
<div class="formula"><span class="lbl">Newton iteration</span>x<sub>n+1</sub> = x<sub>n</sub> − f(x<sub>n</sub>) / f′(x<sub>n</sub>)</div>
<p>Stop when two successive approximations agree to the required number of decimals. Near a simple root the convergence is <strong>quadratic</strong>: the error roughly squares each step.</p>
<p><strong>Failure modes:</strong> f′(x<sub>n</sub>) = 0 (horizontal tangent, division by zero); a poor x<sub>0</sub> that jumps to another root or cycles; functions like f(x) = x<sup>1/3</sup> for which the iterates move <em>away</em> from 0 (x<sub>n+1</sub> = −2x<sub>n</sub>).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — √2.</b> f(x) = x<sup>2</sup> − 2, f′ = 2x, so x<sub>n+1</sub> = x<sub>n</sub> − (x<sub>n</sub><sup>2</sup> − 2)/(2x<sub>n</sub>). From x<sub>0</sub> = 1: x<sub>1</sub> = 1.5, x<sub>2</sub> ≈ 1.416667, x<sub>3</sub> ≈ 1.414216, x<sub>4</sub> ≈ <b>1.414214</b> — six correct decimals after four steps.</p></div>
<div class="callout"><p><b>Example 2 — Newton's own equation.</b> x<sup>3</sup> − 2x − 5 = 0, x<sub>0</sub> = 2. f(2) = −1, f′(2) = 10 ⇒ x<sub>1</sub> = 2.1. Then x<sub>2</sub> ≈ 2.0945681, x<sub>3</sub> ≈ <b>2.0945515</b>.</p></div>
<p>The same computation in Python:</p>
<pre><code class="language-python">def newton(f, df, x0, tol=1e-10, max_iter=20):
    x = x0
    for n in range(1, max_iter + 1):
        x_new = x - f(x) / df(x)
        print(n, round(x_new, 10))
        if abs(x_new - x) &lt; tol:
            return x_new
        x = x_new
    return x

# root of x^3 - 2x - 5 = 0 (Newton's own example), x0 = 2
root = newton(lambda x: x**3 - 2*x - 5, lambda x: 3*x**2 - 2, 2.0)
print("root =", root)
</code></pre>
<div class="out">1 2.1
2 2.0945681211
3 2.0945514817
4 2.0945514815
5 2.0945514815
root = 2.0945514815423265</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing x<sub>n+1</sub> = x<sub>n</sub> − f′/f (upside down).</li><li>Starting at a point where f′ = 0, or far from the root.</li><li>Rounding too early in hand calculations — keep at least 2 extra digits.</li><li>Forgetting to put trig functions in radian mode.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>x<sub>n+1</sub> = x<sub>n</sub> − f(x<sub>n</sub>)/f′(x<sub>n</sub>): follow the tangent to the x-axis.</li><li>Very fast (quadratic) near a simple root.</li><li>Needs a good starting value and f′ ≠ 0.</li><li>Easy to implement in a few lines of code.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-9-newtons-method" target="_blank" rel="noopener">OpenStax — 4.9 Newton's Method</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/NewtonsMethod.aspx" target="_blank" rel="noopener">Paul's Online Notes — Newton's Method</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-2-applications-of-differentiation/part-b-optimization-related-rates-and-newtons-method/" target="_blank" rel="noopener">MIT 18.01SC — Optimization, Related Rates and Newton's Method</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Do two Newton steps for cos x = x starting at x<sub>0</sub> = 1.</li><li>Approximate ∛10 with f(x) = x<sup>3</sup> − 10, x<sub>0</sub> = 2 (two steps).</li><li>Why does Newton's method fail for f(x) = x<sup>2</sup> + 1 with any real start?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) f = cos x − x, f′ = −sin x − 1: x<sub>1</sub> ≈ 0.750364, x<sub>2</sub> ≈ 0.739113 (root 0.739085). 2) x<sub>1</sub> = 2 − (8 − 10)/12 ≈ 2.166667, x<sub>2</sub> ≈ 2.154504 (true 2.154435). 3) It has no real root, so the iterates never settle (they wander chaotically).</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 6 · Bài 6.2</span>
<h2>Phương pháp Newton</h2>
<p class="lead">Đa số phương trình — x<sup>3</sup> − 2x − 5 = 0, cos x = x — không có công thức nghiệm. Phương pháp Newton đi theo tiếp tuyến tới nghiệm và gần như nhân đôi số chữ số đúng sau mỗi bước. Phím √ của máy tính và nhiều thuật toán tối ưu trong học máy dùng ý tưởng này.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Suy ra công thức lặp Newton từ tiếp tuyến.</li><li>Thực hiện vài bước lặp bằng tay.</li><li>Cài đặt phương pháp bằng Python.</li><li>Nhận ra khi nào phương pháp thất bại.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Bắt đầu với dự đoán x<sub>n</sub>. Tiếp tuyến tại (x<sub>n</sub>, f(x<sub>n</sub>)) là y = f(x<sub>n</sub>) + f′(x<sub>n</sub>)(x − x<sub>n</sub>). Cho y = 0 rồi giải x: giao điểm đó là dự đoán tiếp theo.</p>
<div class="formula"><span class="lbl">Công thức lặp Newton</span>x<sub>n+1</sub> = x<sub>n</sub> − f(x<sub>n</sub>) / f′(x<sub>n</sub>)</div>
<p>Dừng khi hai xấp xỉ liên tiếp trùng nhau tới số chữ số thập phân cần. Gần nghiệm đơn, hội tụ là <strong>bậc hai</strong>: sai số gần như bình phương sau mỗi bước.</p>
<p><strong>Khi nào thất bại:</strong> f′(x<sub>n</sub>) = 0 (tiếp tuyến nằm ngang, chia cho 0); x<sub>0</sub> chọn kém nên nhảy sang nghiệm khác hoặc lặp vòng; hàm như f(x) = x<sup>1/3</sup> khiến dãy lặp đi <em>ra xa</em> 0 (x<sub>n+1</sub> = −2x<sub>n</sub>).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — √2.</b> f(x) = x<sup>2</sup> − 2, f′ = 2x, nên x<sub>n+1</sub> = x<sub>n</sub> − (x<sub>n</sub><sup>2</sup> − 2)/(2x<sub>n</sub>). Từ x<sub>0</sub> = 1: x<sub>1</sub> = 1,5, x<sub>2</sub> ≈ 1,416667, x<sub>3</sub> ≈ 1,414216, x<sub>4</sub> ≈ <b>1,414214</b> — sáu chữ số thập phân đúng sau bốn bước.</p></div>
<div class="callout"><p><b>Ví dụ 2 — phương trình của chính Newton.</b> x<sup>3</sup> − 2x − 5 = 0, x<sub>0</sub> = 2. f(2) = −1, f′(2) = 10 ⇒ x<sub>1</sub> = 2,1. Tiếp theo x<sub>2</sub> ≈ 2,0945681, x<sub>3</sub> ≈ <b>2,0945515</b>.</p></div>
<p>Cùng phép tính đó bằng Python:</p>
<pre><code class="language-python">def newton(f, df, x0, tol=1e-10, max_iter=20):
    x = x0
    for n in range(1, max_iter + 1):
        x_new = x - f(x) / df(x)
        print(n, round(x_new, 10))
        if abs(x_new - x) &lt; tol:
            return x_new
        x = x_new
    return x

# root of x^3 - 2x - 5 = 0 (Newton's own example), x0 = 2
root = newton(lambda x: x**3 - 2*x - 5, lambda x: 3*x**2 - 2, 2.0)
print("root =", root)
</code></pre>
<div class="out">1 2.1
2 2.0945681211
3 2.0945514817
4 2.0945514815
5 2.0945514815
root = 2.0945514815423265</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết x<sub>n+1</sub> = x<sub>n</sub> − f′/f (lộn ngược).</li><li>Bắt đầu tại điểm có f′ = 0, hoặc quá xa nghiệm.</li><li>Làm tròn quá sớm khi tính tay — giữ thêm ít nhất 2 chữ số.</li><li>Quên để máy tính ở chế độ radian với hàm lượng giác.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>x<sub>n+1</sub> = x<sub>n</sub> − f(x<sub>n</sub>)/f′(x<sub>n</sub>): đi theo tiếp tuyến xuống trục hoành.</li><li>Rất nhanh (bậc hai) gần nghiệm đơn.</li><li>Cần điểm xuất phát tốt và f′ ≠ 0.</li><li>Cài đặt chỉ vài dòng code.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-9-newtons-method" target="_blank" rel="noopener">OpenStax — 4.9 Phương pháp Newton</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/NewtonsMethod.aspx" target="_blank" rel="noopener">Paul's Online Notes — Phương pháp Newton</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-2-applications-of-differentiation/part-b-optimization-related-rates-and-newtons-method/" target="_blank" rel="noopener">MIT 18.01SC — Tối ưu, tốc độ liên quan và phương pháp Newton</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Làm hai bước Newton cho cos x = x từ x<sub>0</sub> = 1.</li><li>Xấp xỉ ∛10 với f(x) = x<sup>3</sup> − 10, x<sub>0</sub> = 2 (hai bước).</li><li>Vì sao phương pháp Newton thất bại với f(x) = x<sup>2</sup> + 1 dù xuất phát ở đâu trên ℝ?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) f = cos x − x, f′ = −sin x − 1: x<sub>1</sub> ≈ 0,750364, x<sub>2</sub> ≈ 0,739113 (nghiệm 0,739085). 2) x<sub>1</sub> = 2 − (8 − 10)/12 ≈ 2,166667, x<sub>2</sub> ≈ 2,154504 (thật 2,154435). 3) Nó không có nghiệm thực, nên dãy lặp không bao giờ ổn định (nhảy lung tung).</p></div>`);

const c63 = L('cal111-ts-6-3',
  '6.3 — Antiderivatives and initial value problems|||6.3 — Nguyên hàm và bài toán giá trị ban đầu',
  'Định nghĩa nguyên hàm, hằng số C, bảng nguyên hàm cơ bản, tìm hàm từ đạo hàm và điều kiện ban đầu, chuyển động thẳng: từ gia tốc ra vận tốc và vị trí.',
  `<span class="eyebrow">CAL111 · Chapter 6 · Lesson 6.3</span>
<h2>Antiderivatives and initial value problems</h2>
<p class="lead">Differentiation goes from position to velocity. Physics, finance and engineering often need the reverse: from velocity back to position, from a marginal cost back to total cost. That reverse operation is antidifferentiation — the bridge to integrals.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define an antiderivative and explain the constant C.</li><li>Use the table of basic antiderivatives.</li><li>Solve initial value problems f′ = g, f(a) = b.</li><li>Recover velocity and position from acceleration.</li></ul>
<h3>📖 Lecture</h3>
<p>F is an <strong>antiderivative</strong> of f on an interval if F′(x) = f(x) there. By the Mean Value Theorem (Lesson 5.2), any two antiderivatives differ by a constant, so the most general one is F(x) + C. We write the <strong>indefinite integral</strong> ∫ f(x) dx = F(x) + C.</p>
<div class="formula"><span class="lbl">Table of basic antiderivatives</span>∫ x<sup>n</sup> dx = x<sup>n+1</sup>/(n + 1) + C (n ≠ −1)    ∫ 1/x dx = ln|x| + C    ∫ e<sup>x</sup> dx = e<sup>x</sup> + C    ∫ a<sup>x</sup> dx = a<sup>x</sup>/ln a + C<br>∫ cos x dx = sin x + C    ∫ sin x dx = −cos x + C    ∫ sec<sup>2</sup>x dx = tan x + C<br>∫ 1/(1 + x<sup>2</sup>) dx = arctan x + C    ∫ 1/√(1 − x<sup>2</sup>) dx = arcsin x + C</div>
<p>Linearity: ∫ [a f(x) + b g(x)] dx = a∫f dx + b∫g dx. There is <em>no</em> product rule for antiderivatives — products need substitution or integration by parts (Chapter 8).</p>
<p><strong>Initial value problem (IVP).</strong> Find the general antiderivative, then use the given value to determine C.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> ∫ (3x<sup>2</sup> − 4x + 5) dx = <b>x<sup>3</sup> − 2x<sup>2</sup> + 5x + C</b>.</p></div>
<div class="callout"><p><b>Example 2.</b> ∫ (√x + 2/x) dx = ∫ (x<sup>1/2</sup> + 2x<sup>−1</sup>) dx = <b>(2/3)x<sup>3/2</sup> + 2 ln|x| + C</b>.</p></div>
<div class="callout"><p><b>Example 3 — IVP.</b> f′(x) = 6x<sup>2</sup> − 2, f(1) = 3.</p><p>f(x) = 2x<sup>3</sup> − 2x + C. f(1) = 2 − 2 + C = 3 ⇒ C = 3. <b>f(x) = 2x<sup>3</sup> − 2x + 3</b>.</p></div>
<div class="callout"><p><b>Example 4 — vertical throw.</b> A ball is thrown up at 19.6 m/s from the ground: a(t) = −9.8.</p><p>v(t) = −9.8t + C<sub>1</sub>, v(0) = 19.6 ⇒ v = −9.8t + 19.6. s(t) = −4.9t<sup>2</sup> + 19.6t + C<sub>2</sub>, s(0) = 0 ⇒ C<sub>2</sub> = 0. Highest point when v = 0: t = 2 s, s(2) = −19.6 + 39.2 = <b>19.6 m</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting + C (and then being unable to solve the IVP).</li><li>∫ 1/x dx = x<sup>0</sup>/0 — the power rule excludes n = −1; the answer is ln|x|.</li><li>∫ sin x dx = cos x — the sign is minus.</li><li>∫ f·g = (∫f)(∫g) — false.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>F′ = f ⇒ ∫ f dx = F + C.</li><li>Reverse every derivative formula to get the table.</li><li>IVP: integrate, then use the condition to find C.</li><li>a → v → s by antidifferentiating twice.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-10-antiderivatives" target="_blank" rel="noopener">OpenStax — 4.10 Antiderivatives</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/IndefiniteIntegrals.aspx" target="_blank" rel="noopener">Paul's Online Notes — Indefinite Integrals</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ComputingIndefiniteIntegrals.aspx" target="_blank" rel="noopener">Paul's Online Notes — Computing Indefinite Integrals</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>∫ (sec<sup>2</sup>x − 3 sin x) dx.</li><li>f″(x) = 12x, f′(0) = 1, f(0) = 2. Find f.</li><li>A car moving at 20 m/s brakes with constant deceleration 5 m/s<sup>2</sup>. How far does it travel before stopping?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) tan x + 3cos x + C. 2) f′ = 6x<sup>2</sup> + 1, f = 2x<sup>3</sup> + x + 2. 3) v = 20 − 5t = 0 at t = 4 s; s = 20t − 2.5t<sup>2</sup> ⇒ s(4) = 80 − 40 = 40 m.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 6 · Bài 6.3</span>
<h2>Nguyên hàm và bài toán giá trị ban đầu</h2>
<p class="lead">Đạo hàm đi từ vị trí sang vận tốc. Vật lý, tài chính, kỹ thuật thường cần chiều ngược: từ vận tốc về vị trí, từ chi phí biên về tổng chi phí. Phép ngược đó là lấy nguyên hàm — cây cầu dẫn tới tích phân.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa nguyên hàm và giải thích hằng số C.</li><li>Dùng bảng nguyên hàm cơ bản.</li><li>Giải bài toán giá trị ban đầu f′ = g, f(a) = b.</li><li>Tìm vận tốc và vị trí từ gia tốc.</li></ul>
<h3>📖 Bài giảng</h3>
<p>F là <strong>nguyên hàm</strong> của f trên một khoảng nếu F′(x) = f(x) trên đó. Theo định lý giá trị trung bình (Bài 5.2), hai nguyên hàm bất kỳ khác nhau một hằng số, nên nguyên hàm tổng quát là F(x) + C. Ta viết <strong>tích phân bất định</strong> ∫ f(x) dx = F(x) + C.</p>
<div class="formula"><span class="lbl">Bảng nguyên hàm cơ bản</span>∫ x<sup>n</sup> dx = x<sup>n+1</sup>/(n + 1) + C (n ≠ −1)    ∫ 1/x dx = ln|x| + C    ∫ e<sup>x</sup> dx = e<sup>x</sup> + C    ∫ a<sup>x</sup> dx = a<sup>x</sup>/ln a + C<br>∫ cos x dx = sin x + C    ∫ sin x dx = −cos x + C    ∫ sec<sup>2</sup>x dx = tan x + C<br>∫ 1/(1 + x<sup>2</sup>) dx = arctan x + C    ∫ 1/√(1 − x<sup>2</sup>) dx = arcsin x + C</div>
<p>Tính tuyến tính: ∫ [a f(x) + b g(x)] dx = a∫f dx + b∫g dx. <em>Không</em> có quy tắc tích cho nguyên hàm — tích cần đổi biến hoặc từng phần (Chương 8).</p>
<p><strong>Bài toán giá trị ban đầu.</strong> Tìm nguyên hàm tổng quát, rồi dùng giá trị đã cho để xác định C.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> ∫ (3x<sup>2</sup> − 4x + 5) dx = <b>x<sup>3</sup> − 2x<sup>2</sup> + 5x + C</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2.</b> ∫ (√x + 2/x) dx = ∫ (x<sup>1/2</sup> + 2x<sup>−1</sup>) dx = <b>(2/3)x<sup>3/2</sup> + 2 ln|x| + C</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — giá trị ban đầu.</b> f′(x) = 6x<sup>2</sup> − 2, f(1) = 3.</p><p>f(x) = 2x<sup>3</sup> − 2x + C. f(1) = 2 − 2 + C = 3 ⇒ C = 3. <b>f(x) = 2x<sup>3</sup> − 2x + 3</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4 — ném thẳng đứng.</b> Ném quả bóng lên từ mặt đất với 19,6 m/s: a(t) = −9,8.</p><p>v(t) = −9,8t + C<sub>1</sub>, v(0) = 19,6 ⇒ v = −9,8t + 19,6. s(t) = −4,9t<sup>2</sup> + 19,6t + C<sub>2</sub>, s(0) = 0 ⇒ C<sub>2</sub> = 0. Lên cao nhất khi v = 0: t = 2 s, s(2) = −19,6 + 39,2 = <b>19,6 m</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên + C (rồi không giải được bài toán giá trị ban đầu).</li><li>∫ 1/x dx = x<sup>0</sup>/0 — quy tắc luỹ thừa loại trừ n = −1; đáp số là ln|x|.</li><li>∫ sin x dx = cos x — dấu phải là trừ.</li><li>∫ f·g = (∫f)(∫g) — sai.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>F′ = f ⇒ ∫ f dx = F + C.</li><li>Đảo ngược mọi công thức đạo hàm là có bảng nguyên hàm.</li><li>Bài toán ban đầu: lấy nguyên hàm, dùng điều kiện tìm C.</li><li>a → v → s bằng hai lần lấy nguyên hàm.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/4-10-antiderivatives" target="_blank" rel="noopener">OpenStax — 4.10 Nguyên hàm</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/IndefiniteIntegrals.aspx" target="_blank" rel="noopener">Paul's Online Notes — Tích phân bất định</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ComputingIndefiniteIntegrals.aspx" target="_blank" rel="noopener">Paul's Online Notes — Tính tích phân bất định</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>∫ (sec<sup>2</sup>x − 3 sin x) dx.</li><li>f″(x) = 12x, f′(0) = 1, f(0) = 2. Tìm f.</li><li>Ô tô đang chạy 20 m/s thì phanh với gia tốc hãm không đổi 5 m/s<sup>2</sup>. Xe đi thêm bao xa thì dừng?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) tan x + 3cos x + C. 2) f′ = 6x<sup>2</sup> + 1, f = 2x<sup>3</sup> + x + 2. 3) v = 20 − 5t = 0 tại t = 4 s; s = 20t − 2,5t<sup>2</sup> ⇒ s(4) = 80 − 40 = 40 m.</p></div>`);

const q6 = QZ(6, "Quiz — Chapter 6: Optimisation, Newton's method, antiderivatives|||Quiz — Chương 6: Tối ưu, phương pháp Newton, nguyên hàm", 'Kiểm tra chương 6: bài toán tối ưu, lặp Newton, nguyên hàm, bài toán giá trị ban đầu.', [
  Q('q1', '1200 m of fence, rectangle along a river (3 sides). Maximum area =|||1200 m rào, hình chữ nhật sát sông (rào 3 cạnh). Diện tích lớn nhất =',
    ['90 000 m²|||90 000 m²', '180 000 m²|||180 000 m²', '360 000 m²|||360 000 m²', '120 000 m²|||120 000 m²'], 1,
    'A = x(1200 − 2x), max at x = 300: 300·600.|||A = x(1200 − 2x), lớn nhất tại x = 300: 300·600.'),
  Q('q2', 'Open box from a 12×12 cm sheet: the optimal cut x is|||Hộp không nắp từ tấm 12×12 cm: cạnh cắt tối ưu x là',
    ['1 cm|||1 cm', '2 cm|||2 cm', '3 cm|||3 cm', '4 cm|||4 cm'], 1,
    'V′ = (12 − 2x)(12 − 6x) = 0 ⇒ x = 2 (x = 6 gives V = 0). V = 128 cm³.|||V′ = (12 − 2x)(12 − 6x) = 0 ⇒ x = 2 (x = 6 cho V = 0). V = 128 cm³.'),
  Q('q3', 'A 1000 cm³ can with minimum surface area has|||Lon 1000 cm³ có diện tích toàn phần nhỏ nhất có',
    ['h = r|||h = r', 'h = 2r|||h = 2r', 'h = 3r|||h = 3r', 'h = r/2|||h = r/2'], 1,
    'A′ = 0 ⇒ r³ = 500/π, and then h = 1000/(πr²) = 2r.|||A′ = 0 ⇒ r³ = 500/π, khi đó h = 1000/(πr²) = 2r.'),
  Q('q4', 'Newton iteration formula:|||Công thức lặp Newton:',
    ['xₙ₊₁ = xₙ − f′(xₙ)/f(xₙ)|||xₙ₊₁ = xₙ − f′(xₙ)/f(xₙ)', 'xₙ₊₁ = xₙ − f(xₙ)/f′(xₙ)|||xₙ₊₁ = xₙ − f(xₙ)/f′(xₙ)', 'xₙ₊₁ = xₙ + f(xₙ)·f′(xₙ)|||xₙ₊₁ = xₙ + f(xₙ)·f′(xₙ)', 'xₙ₊₁ = f(xₙ)/f′(xₙ)|||xₙ₊₁ = f(xₙ)/f′(xₙ)'], 1,
    'Set the tangent line equal to zero and solve for x.|||Cho tiếp tuyến bằng 0 rồi giải x.'),
  Q('q5', 'One Newton step for x² − 2 = 0 from x₀ = 1 gives x₁ =|||Một bước Newton cho x² − 2 = 0 từ x₀ = 1 cho x₁ =',
    ['1.4|||1,4', '1.5|||1,5', '2|||2', '1.414|||1,414'], 1,
    'x₁ = 1 − (1 − 2)/2 = 1.5.|||x₁ = 1 − (1 − 2)/2 = 1,5.'),
  Q('q6', '∫ (√x + 2/x) dx =|||∫ (√x + 2/x) dx =',
    ['(2/3)x^(3/2) + 2 ln|x| + C|||(2/3)x^(3/2) + 2 ln|x| + C', '(1/2)x^(−1/2) − 2/x² + C|||(1/2)x^(−1/2) − 2/x² + C', '(3/2)x^(3/2) + 2 ln x + C|||(3/2)x^(3/2) + 2 ln x + C', '(2/3)x^(3/2) − 2/x² + C|||(2/3)x^(3/2) − 2/x² + C'], 0,
    'Power rule for x^(1/2) and ∫1/x = ln|x|.|||Quy tắc luỹ thừa cho x^(1/2) và ∫1/x = ln|x|.'),
  Q('q7', 'f′(x) = 6x² − 2 and f(1) = 3. Then f(x) =|||f′(x) = 6x² − 2 và f(1) = 3. Khi đó f(x) =',
    ['2x³ − 2x + 3|||2x³ − 2x + 3', '2x³ − 2x + 1|||2x³ − 2x + 1', '12x + 3|||12x + 3', '2x³ − 2x|||2x³ − 2x'], 0,
    'f = 2x³ − 2x + C, f(1) = C = 3.|||f = 2x³ − 2x + C, f(1) = C = 3.'),
  Q('q8', 'A ball thrown up at 19.6 m/s (a = −9.8 m/s²) reaches a maximum height of|||Bóng ném lên 19,6 m/s (a = −9,8 m/s²) đạt độ cao lớn nhất',
    ['9.8 m|||9,8 m', '19.6 m|||19,6 m', '39.2 m|||39,2 m', '4.9 m|||4,9 m'], 1,
    'v = 0 at t = 2; s(2) = −4.9·4 + 19.6·2 = 19.6.|||v = 0 tại t = 2; s(2) = −4,9·4 + 19,6·2 = 19,6.'),
  Q('q9', 'Which is NOT a correct antiderivative formula?|||Công thức nguyên hàm nào SAI?',
    ['∫ sin x dx = −cos x + C|||∫ sin x dx = −cos x + C', '∫ sec²x dx = tan x + C|||∫ sec²x dx = tan x + C', '∫ 1/x dx = x⁰/0 + C|||∫ 1/x dx = x⁰/0 + C', '∫ eˣ dx = eˣ + C|||∫ eˣ dx = eˣ + C'], 2,
    'The power rule excludes n = −1; ∫ 1/x dx = ln|x| + C.|||Quy tắc luỹ thừa loại trừ n = −1; ∫ 1/x dx = ln|x| + C.'),
]);

const ch6 = {
  title: "Chapter 6 — Optimisation, Newton's method and antiderivatives|||Chương 6 — Tối ưu, phương pháp Newton và nguyên hàm",
  description: 'Bài toán tối ưu ứng dụng, phương pháp Newton giải phương trình (có code Python chạy thật), nguyên hàm và bài toán giá trị ban đầu (Stewart 4.7–4.9 · OpenStax 4.7, 4.9, 4.10).',
  lessons: [c61, c62, c63, q6],
};

// ───────────────────────────── Chương 7 — Tích phân xác định & Định lý cơ bản ─────────────────────────────
const c71 = L('cal111-ts-7-1',
  '7.1 — Areas, sigma notation and Riemann sums|||7.1 — Diện tích, ký hiệu tổng Σ và tổng Riemann',
  'Bài toán diện tích, ký hiệu Σ và các công thức tổng, tổng Riemann trái/phải/điểm giữa, giới hạn của tổng Riemann, quãng đường từ bảng vận tốc.',
  `<span class="eyebrow">CAL111 · Chapter 7 · Lesson 7.1</span>
<h2>Areas, sigma notation and Riemann sums</h2>
<p class="lead">How do you find the area under a curve that is not made of straight lines? Cut it into thin rectangles, add them up, and let the rectangles get infinitely thin. This is the second great idea of calculus — accumulation.</p>
<h3>🎯 Objectives</h3>
<ul><li>Use sigma notation and the basic summation formulas.</li><li>Compute left, right and midpoint Riemann sums.</li><li>Express area as a limit of Riemann sums.</li><li>Estimate distance travelled from a velocity table.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Sigma notation and formulas</span>∑<sub>i=1</sub><sup>n</sup> a<sub>i</sub> = a<sub>1</sub> + a<sub>2</sub> + … + a<sub>n</sub><br>∑ c = cn    ∑ i = n(n + 1)/2    ∑ i<sup>2</sup> = n(n + 1)(2n + 1)/6    ∑ i<sup>3</sup> = [n(n + 1)/2]<sup>2</sup></div>
<p>Divide [a, b] into n equal subintervals of width Δx = (b − a)/n, with endpoints x<sub>i</sub> = a + iΔx. On each subinterval pick a sample point x<sub>i</sub>* and build a rectangle of height f(x<sub>i</sub>*).</p>
<div class="formula"><span class="lbl">Riemann sums</span>R<sub>n</sub> (right) = ∑ f(x<sub>i</sub>)Δx    L<sub>n</sub> (left) = ∑ f(x<sub>i−1</sub>)Δx    M<sub>n</sub> (midpoint) = ∑ f((x<sub>i−1</sub> + x<sub>i</sub>)/2)Δx<br>Area = lim<sub>n→∞</sub> ∑ f(x<sub>i</sub>*)Δx</div>
<p>For an increasing function, left sums underestimate and right sums overestimate; the midpoint sum is usually much more accurate.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> f(x) = x<sup>2</sup> on [0, 2], n = 4, so Δx = 0.5.</p>
<p>Right endpoints 0.5, 1, 1.5, 2: R<sub>4</sub> = 0.5(0.25 + 1 + 2.25 + 4) = <b>3.75</b>.<br>Left endpoints 0, 0.5, 1, 1.5: L<sub>4</sub> = 0.5(0 + 0.25 + 1 + 2.25) = <b>1.75</b>.<br>Midpoints 0.25, 0.75, 1.25, 1.75: M<sub>4</sub> = 0.5(0.0625 + 0.5625 + 1.5625 + 3.0625) = <b>2.625</b>.<br>The exact area is 8/3 ≈ 2.667 — the midpoint sum is closest.</p></div>
<div class="callout"><p><b>Example 2 — the exact area as a limit.</b> Same f, n rectangles: Δx = 2/n, x<sub>i</sub> = 2i/n.</p>
<p>R<sub>n</sub> = ∑ (2i/n)<sup>2</sup>(2/n) = (8/n<sup>3</sup>)∑ i<sup>2</sup> = (8/n<sup>3</sup>)·n(n + 1)(2n + 1)/6 = 8/3 + 4/n + 4/(3n<sup>2</sup>) → <b>8/3</b>.</p></div>
<div class="callout"><p><b>Example 3 — distance.</b> A car's speed (m/s) at t = 0, 1, 2, 3 s is 0, 4, 10, 18. With Δt = 1: left estimate 0 + 4 + 10 = 14 m, right estimate 4 + 10 + 18 = 32 m. The true distance lies between them.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting to multiply by Δx.</li><li>Using n + 1 sample points instead of n.</li><li>Mixing up left and right endpoints (left uses x<sub>0</sub> … x<sub>n−1</sub>).</li><li>Thinking a Riemann sum is always an under-estimate.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Δx = (b − a)/n, x<sub>i</sub> = a + iΔx.</li><li>Riemann sum = ∑ (height × width).</li><li>Area = limit as n → ∞.</li><li>Midpoint sums are usually the most accurate.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/5-1-approximating-areas" target="_blank" rel="noopener">OpenStax — 5.1 Approximating Areas</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/AreaProblem.aspx" target="_blank" rel="noopener">Paul's Online Notes — Area Problem</a></li><li><a href="https://www.3blue1brown.com/lessons/integration" target="_blank" rel="noopener">3Blue1Brown — Integration and the fundamental theorem of calculus</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Evaluate ∑<sub>i=1</sub><sup>10</sup> (2i + 1).</li><li>Compute R<sub>4</sub> for f(x) = x + 1 on [0, 4] and compare with the exact area.</li><li>For an increasing f, which is larger: L<sub>n</sub> or R<sub>n</sub>?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 2·55 + 10 = 120. 2) Δx = 1, heights f(1..4) = 2, 3, 4, 5 ⇒ R<sub>4</sub> = 14; exact area (trapezoid) = (1 + 5)/2·4 = 12, so R<sub>4</sub> overestimates. 3) R<sub>n</sub> (right heights are larger).</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 7 · Bài 7.1</span>
<h2>Diện tích, ký hiệu Σ và tổng Riemann</h2>
<p class="lead">Làm sao tính diện tích dưới một đường cong không gồm các đoạn thẳng? Cắt nó thành các hình chữ nhật mỏng, cộng lại, và cho chúng mỏng vô hạn. Đây là ý tưởng lớn thứ hai của giải tích — sự tích luỹ.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dùng ký hiệu Σ và các công thức tổng cơ bản.</li><li>Tính tổng Riemann trái, phải, điểm giữa.</li><li>Biểu diễn diện tích là giới hạn của tổng Riemann.</li><li>Ước lượng quãng đường từ bảng vận tốc.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Ký hiệu tổng và công thức</span>∑<sub>i=1</sub><sup>n</sup> a<sub>i</sub> = a<sub>1</sub> + a<sub>2</sub> + … + a<sub>n</sub><br>∑ c = cn    ∑ i = n(n + 1)/2    ∑ i<sup>2</sup> = n(n + 1)(2n + 1)/6    ∑ i<sup>3</sup> = [n(n + 1)/2]<sup>2</sup></div>
<p>Chia [a, b] thành n khoảng con bằng nhau rộng Δx = (b − a)/n, các điểm chia x<sub>i</sub> = a + iΔx. Trên mỗi khoảng con chọn điểm mẫu x<sub>i</sub>* và dựng hình chữ nhật cao f(x<sub>i</sub>*).</p>
<div class="formula"><span class="lbl">Tổng Riemann</span>R<sub>n</sub> (phải) = ∑ f(x<sub>i</sub>)Δx    L<sub>n</sub> (trái) = ∑ f(x<sub>i−1</sub>)Δx    M<sub>n</sub> (điểm giữa) = ∑ f((x<sub>i−1</sub> + x<sub>i</sub>)/2)Δx<br>Diện tích = lim<sub>n→∞</sub> ∑ f(x<sub>i</sub>*)Δx</div>
<p>Với hàm đồng biến, tổng trái ước lượng thiếu, tổng phải ước lượng thừa; tổng điểm giữa thường chính xác hơn nhiều.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> f(x) = x<sup>2</sup> trên [0, 2], n = 4, nên Δx = 0,5.</p>
<p>Đầu mút phải 0,5; 1; 1,5; 2: R<sub>4</sub> = 0,5(0,25 + 1 + 2,25 + 4) = <b>3,75</b>.<br>Đầu mút trái 0; 0,5; 1; 1,5: L<sub>4</sub> = 0,5(0 + 0,25 + 1 + 2,25) = <b>1,75</b>.<br>Điểm giữa 0,25; 0,75; 1,25; 1,75: M<sub>4</sub> = 0,5(0,0625 + 0,5625 + 1,5625 + 3,0625) = <b>2,625</b>.<br>Diện tích chính xác 8/3 ≈ 2,667 — tổng điểm giữa gần nhất.</p></div>
<div class="callout"><p><b>Ví dụ 2 — diện tích chính xác bằng giới hạn.</b> Cùng f, n hình chữ nhật: Δx = 2/n, x<sub>i</sub> = 2i/n.</p>
<p>R<sub>n</sub> = ∑ (2i/n)<sup>2</sup>(2/n) = (8/n<sup>3</sup>)∑ i<sup>2</sup> = (8/n<sup>3</sup>)·n(n + 1)(2n + 1)/6 = 8/3 + 4/n + 4/(3n<sup>2</sup>) → <b>8/3</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — quãng đường.</b> Tốc độ ô tô (m/s) tại t = 0, 1, 2, 3 s là 0, 4, 10, 18. Với Δt = 1: ước lượng trái 0 + 4 + 10 = 14 m, ước lượng phải 4 + 10 + 18 = 32 m. Quãng đường thật nằm giữa hai số đó.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên nhân với Δx.</li><li>Dùng n + 1 điểm mẫu thay vì n.</li><li>Nhầm đầu mút trái và phải (trái dùng x<sub>0</sub> … x<sub>n−1</sub>).</li><li>Nghĩ tổng Riemann luôn ước lượng thiếu.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Δx = (b − a)/n, x<sub>i</sub> = a + iΔx.</li><li>Tổng Riemann = ∑ (chiều cao × bề rộng).</li><li>Diện tích = giới hạn khi n → ∞.</li><li>Tổng điểm giữa thường chính xác nhất.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/5-1-approximating-areas" target="_blank" rel="noopener">OpenStax — 5.1 Xấp xỉ diện tích</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/AreaProblem.aspx" target="_blank" rel="noopener">Paul's Online Notes — Bài toán diện tích</a></li><li><a href="https://www.3blue1brown.com/lessons/integration" target="_blank" rel="noopener">3Blue1Brown — Tích phân và định lý cơ bản</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tính ∑<sub>i=1</sub><sup>10</sup> (2i + 1).</li><li>Tính R<sub>4</sub> cho f(x) = x + 1 trên [0, 4] và so với diện tích chính xác.</li><li>Với f đồng biến, L<sub>n</sub> hay R<sub>n</sub> lớn hơn?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 2·55 + 10 = 120. 2) Δx = 1, chiều cao f(1..4) = 2, 3, 4, 5 ⇒ R<sub>4</sub> = 14; diện tích chính xác (hình thang) = (1 + 5)/2·4 = 12, nên R<sub>4</sub> ước lượng thừa. 3) R<sub>n</sub> (chiều cao bên phải lớn hơn).</p></div>`);

const c72 = L('cal111-ts-7-2',
  '7.2 — The definite integral and its properties|||7.2 — Tích phân xác định và các tính chất',
  'Định nghĩa tích phân xác định qua giới hạn tổng Riemann, diện tích có dấu, tính bằng hình học, các tính chất (tuyến tính, cộng khoảng, đảo cận, so sánh), hàm chẵn/lẻ.',
  `<span class="eyebrow">CAL111 · Chapter 7 · Lesson 7.2</span>
<h2>The definite integral and its properties</h2>
<p class="lead">The limit of Riemann sums deserves its own name and symbol: the definite integral. It measures <em>signed</em> area — area above the axis counts positive, area below counts negative — and it obeys simple algebraic rules.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define the definite integral as a limit of Riemann sums.</li><li>Interpret it as net signed area.</li><li>Evaluate simple integrals with geometry.</li><li>Use the properties of integrals and the comparison bounds.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Definite integral</span>∫<sub>a</sub><sup>b</sup> f(x) dx = lim<sub>n→∞</sub> ∑<sub>i=1</sub><sup>n</sup> f(x<sub>i</sub>*) Δx    (exists for every continuous f on [a, b])</div>
<p>∫<sub>a</sub><sup>b</sup> f(x) dx = (area above the x-axis) − (area below the x-axis). The variable x is a dummy: ∫ f(x) dx = ∫ f(t) dt.</p>
<div class="formula"><span class="lbl">Properties</span>∫<sub>a</sub><sup>b</sup> [f ± g] = ∫f ± ∫g    ∫<sub>a</sub><sup>b</sup> c f = c∫<sub>a</sub><sup>b</sup> f    ∫<sub>a</sub><sup>b</sup> c dx = c(b − a)<br>∫<sub>a</sub><sup>a</sup> f = 0    ∫<sub>b</sub><sup>a</sup> f = −∫<sub>a</sub><sup>b</sup> f    ∫<sub>a</sub><sup>c</sup> f + ∫<sub>c</sub><sup>b</sup> f = ∫<sub>a</sub><sup>b</sup> f</div>
<div class="formula"><span class="lbl">Comparison and symmetry</span>m ≤ f(x) ≤ M on [a, b] ⇒ m(b − a) ≤ ∫<sub>a</sub><sup>b</sup> f ≤ M(b − a)<br>f odd ⇒ ∫<sub>−a</sub><sup>a</sup> f = 0    f even ⇒ ∫<sub>−a</sub><sup>a</sup> f = 2∫<sub>0</sub><sup>a</sup> f</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — signed area.</b> ∫<sub>0</sub><sup>3</sup> (x − 1) dx.</p><p>Below the axis on [0, 1]: a triangle of area 1/2. Above on [1, 3]: a triangle of area (1/2)·2·2 = 2. Net: 2 − 1/2 = <b>3/2</b>.</p></div>
<div class="callout"><p><b>Example 2 — geometry.</b> ∫<sub>−2</sub><sup>2</sup> √(4 − x<sup>2</sup>) dx is the area of the upper half of a circle of radius 2: (1/2)π·4 = <b>2π</b>.</p></div>
<div class="callout"><p><b>Example 3 — properties.</b> Given ∫<sub>0</sub><sup>5</sup> f = 8 and ∫<sub>0</sub><sup>2</sup> f = 3.</p><p>∫<sub>2</sub><sup>5</sup> f = 8 − 3 = <b>5</b>; ∫<sub>5</sub><sup>2</sup> f = <b>−5</b>; ∫<sub>0</sub><sup>5</sup> (2f(x) + 1) dx = 2·8 + 5 = <b>21</b>.</p></div>
<div class="callout"><p><b>Example 4 — bounds.</b> On [0, 1], 1 ≤ e<sup>x²</sup> ≤ e, so 1 ≤ ∫<sub>0</sub><sup>1</sup> e<sup>x²</sup> dx ≤ e — useful because this integral has no elementary antiderivative.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Treating ∫ as total (unsigned) area when the graph dips below the axis.</li><li>Forgetting the sign change when swapping the limits.</li><li>∫<sub>0</sub><sup>5</sup> (2f + 1) = 2·8 + 1 — the constant 1 integrates to 1·(5 − 0) = 5.</li><li>Using the odd-function shortcut on a non-symmetric interval.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Definite integral = limit of Riemann sums = net signed area.</li><li>Linear in f; additive over intervals; reversing limits flips the sign.</li><li>Bounds: m(b − a) ≤ ∫ ≤ M(b − a).</li><li>Odd on [−a, a] ⇒ 0; even ⇒ twice the half.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/5-2-the-definite-integral" target="_blank" rel="noopener">OpenStax — 5.2 The Definite Integral</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/DefnofDefiniteIntegral.aspx" target="_blank" rel="noopener">Paul's Online Notes — Definition of the Definite Integral</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-3-the-definite-integral-and-its-applications/part-a-definition-of-the-definite-integral-and-first-fundamental-theorem/" target="_blank" rel="noopener">MIT 18.01SC — Definition of the Definite Integral and First Fundamental Theorem</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>∫<sub>−1</sub><sup>1</sup> |x| dx (use geometry).</li><li>∫<sub>−3</sub><sup>3</sup> x<sup>3</sup> dx.</li><li>∫<sub>0</sub><sup>3</sup> 2 dx.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Two triangles of area 1/2: total 1. 2) x<sup>3</sup> is odd ⇒ 0. 3) A rectangle 3 × 2 = 6.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 7 · Bài 7.2</span>
<h2>Tích phân xác định và các tính chất</h2>
<p class="lead">Giới hạn của tổng Riemann xứng đáng có tên và ký hiệu riêng: tích phân xác định. Nó đo diện tích <em>có dấu</em> — phần trên trục tính dương, phần dưới trục tính âm — và tuân theo các quy tắc đại số đơn giản.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa tích phân xác định bằng giới hạn tổng Riemann.</li><li>Hiểu nó là diện tích có dấu ròng.</li><li>Tính tích phân đơn giản bằng hình học.</li><li>Dùng tính chất tích phân và các cận so sánh.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Tích phân xác định</span>∫<sub>a</sub><sup>b</sup> f(x) dx = lim<sub>n→∞</sub> ∑<sub>i=1</sub><sup>n</sup> f(x<sub>i</sub>*) Δx    (tồn tại với mọi f liên tục trên [a, b])</div>
<p>∫<sub>a</sub><sup>b</sup> f(x) dx = (diện tích phía trên trục hoành) − (diện tích phía dưới trục hoành). Biến x là biến câm: ∫ f(x) dx = ∫ f(t) dt.</p>
<div class="formula"><span class="lbl">Tính chất</span>∫<sub>a</sub><sup>b</sup> [f ± g] = ∫f ± ∫g    ∫<sub>a</sub><sup>b</sup> c f = c∫<sub>a</sub><sup>b</sup> f    ∫<sub>a</sub><sup>b</sup> c dx = c(b − a)<br>∫<sub>a</sub><sup>a</sup> f = 0    ∫<sub>b</sub><sup>a</sup> f = −∫<sub>a</sub><sup>b</sup> f    ∫<sub>a</sub><sup>c</sup> f + ∫<sub>c</sub><sup>b</sup> f = ∫<sub>a</sub><sup>b</sup> f</div>
<div class="formula"><span class="lbl">So sánh và đối xứng</span>m ≤ f(x) ≤ M trên [a, b] ⇒ m(b − a) ≤ ∫<sub>a</sub><sup>b</sup> f ≤ M(b − a)<br>f lẻ ⇒ ∫<sub>−a</sub><sup>a</sup> f = 0    f chẵn ⇒ ∫<sub>−a</sub><sup>a</sup> f = 2∫<sub>0</sub><sup>a</sup> f</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — diện tích có dấu.</b> ∫<sub>0</sub><sup>3</sup> (x − 1) dx.</p><p>Dưới trục trên [0, 1]: tam giác diện tích 1/2. Trên trục trên [1, 3]: tam giác diện tích (1/2)·2·2 = 2. Ròng: 2 − 1/2 = <b>3/2</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — hình học.</b> ∫<sub>−2</sub><sup>2</sup> √(4 − x<sup>2</sup>) dx là diện tích nửa trên hình tròn bán kính 2: (1/2)π·4 = <b>2π</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — tính chất.</b> Cho ∫<sub>0</sub><sup>5</sup> f = 8 và ∫<sub>0</sub><sup>2</sup> f = 3.</p><p>∫<sub>2</sub><sup>5</sup> f = 8 − 3 = <b>5</b>; ∫<sub>5</sub><sup>2</sup> f = <b>−5</b>; ∫<sub>0</sub><sup>5</sup> (2f(x) + 1) dx = 2·8 + 5 = <b>21</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4 — chặn.</b> Trên [0, 1], 1 ≤ e<sup>x²</sup> ≤ e, nên 1 ≤ ∫<sub>0</sub><sup>1</sup> e<sup>x²</sup> dx ≤ e — hữu ích vì tích phân này không có nguyên hàm sơ cấp.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Coi ∫ là tổng diện tích (không dấu) khi đồ thị có phần nằm dưới trục.</li><li>Quên đổi dấu khi đảo cận.</li><li>∫<sub>0</sub><sup>5</sup> (2f + 1) = 2·8 + 1 — hằng số 1 cho tích phân 1·(5 − 0) = 5.</li><li>Dùng mẹo hàm lẻ trên khoảng không đối xứng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tích phân xác định = giới hạn tổng Riemann = diện tích có dấu ròng.</li><li>Tuyến tính theo f; cộng được theo khoảng; đảo cận đổi dấu.</li><li>Chặn: m(b − a) ≤ ∫ ≤ M(b − a).</li><li>Hàm lẻ trên [−a, a] ⇒ 0; hàm chẵn ⇒ gấp đôi nửa khoảng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/5-2-the-definite-integral" target="_blank" rel="noopener">OpenStax — 5.2 Tích phân xác định</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/DefnofDefiniteIntegral.aspx" target="_blank" rel="noopener">Paul's Online Notes — Định nghĩa tích phân xác định</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-3-the-definite-integral-and-its-applications/part-a-definition-of-the-definite-integral-and-first-fundamental-theorem/" target="_blank" rel="noopener">MIT 18.01SC — Định nghĩa tích phân xác định và định lý cơ bản thứ nhất</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>∫<sub>−1</sub><sup>1</sup> |x| dx (dùng hình học).</li><li>∫<sub>−3</sub><sup>3</sup> x<sup>3</sup> dx.</li><li>∫<sub>0</sub><sup>3</sup> 2 dx.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Hai tam giác diện tích 1/2: tổng 1. 2) x<sup>3</sup> là hàm lẻ ⇒ 0. 3) Hình chữ nhật 3 × 2 = 6.</p></div>`);

const c73 = L('cal111-ts-7-3',
  '7.3 — The Fundamental Theorem of Calculus|||7.3 — Định lý cơ bản của giải tích',
  'Định lý cơ bản phần 1 (đạo hàm của hàm tích phân cận trên biến thiên, kèm quy tắc dây chuyền) và phần 2 (∫ₐᵇ f = F(b) − F(a)); ví dụ tính và bẫy hàm gián đoạn.',
  `<span class="eyebrow">CAL111 · Chapter 7 · Lesson 7.3</span>
<h2>The Fundamental Theorem of Calculus</h2>
<p class="lead">Areas (limits of sums) and slopes (limits of difference quotients) look unrelated. The Fundamental Theorem says they are inverse operations — and turns the hard limit of Riemann sums into a two-line computation with an antiderivative.</p>
<h3>🎯 Objectives</h3>
<ul><li>State both parts of the Fundamental Theorem of Calculus (FTC).</li><li>Differentiate functions defined by integrals, with the chain rule.</li><li>Evaluate definite integrals with F(b) − F(a).</li><li>Check the continuity hypothesis before using the theorem.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">FTC, Part 1</span>If f is continuous on [a, b] and g(x) = ∫<sub>a</sub><sup>x</sup> f(t) dt, then g′(x) = f(x).<br>With a variable upper limit u(x):  d/dx ∫<sub>a</sub><sup>u(x)</sup> f(t) dt = f(u(x))·u′(x)</div>
<p>Meaning: the rate at which accumulated area grows equals the height of the curve at the moving edge. Every continuous function has an antiderivative.</p>
<div class="formula"><span class="lbl">FTC, Part 2 (Evaluation theorem)</span>If f is continuous on [a, b] and F′ = f, then ∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) − F(a) = [F(x)]<sub>a</sub><sup>b</sup></div>
<p>Any antiderivative works — the constant C cancels in F(b) − F(a).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — Part 1.</b> d/dx ∫<sub>0</sub><sup>x</sup> cos(t<sup>2</sup>) dt = <b>cos(x<sup>2</sup>)</b> (no antiderivative needed — there is no elementary one!).</p></div>
<div class="callout"><p><b>Example 2 — Part 1 with the chain rule.</b> d/dx ∫<sub>1</sub><sup>x³</sup> ln t dt = ln(x<sup>3</sup>)·3x<sup>2</sup> = <b>9x<sup>2</sup> ln x</b> (x &gt; 0).</p></div>
<div class="callout"><p><b>Example 3 — Part 2.</b></p><p>∫<sub>1</sub><sup>3</sup> x<sup>2</sup> dx = [x<sup>3</sup>/3]<sub>1</sub><sup>3</sup> = 9 − 1/3 = <b>26/3</b>.<br>∫<sub>0</sub><sup>π</sup> sin x dx = [−cos x]<sub>0</sub><sup>π</sup> = 1 − (−1) = <b>2</b>.<br>∫<sub>1</sub><sup>e</sup> (1/x) dx = ln e − ln 1 = <b>1</b>.<br>∫<sub>0</sub><sup>1</sup> (e<sup>x</sup> + 2x) dx = [e<sup>x</sup> + x<sup>2</sup>]<sub>0</sub><sup>1</sup> = (e + 1) − 1 = <b>e</b>.</p></div>
<div class="callout"><p><b>Example 4 — the trap.</b> “∫<sub>−1</sub><sup>1</sup> 1/x<sup>2</sup> dx = [−1/x]<sub>−1</sub><sup>1</sup> = −2” is <b>wrong</b>: a positive function cannot have a negative integral. 1/x<sup>2</sup> is not continuous at 0, so FTC does not apply (this improper integral diverges — Chapter 10).</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Computing F(a) − F(b) instead of F(b) − F(a).</li><li>Forgetting u′(x) in Part 1 with a variable limit.</li><li>Ignoring a discontinuity inside [a, b].</li><li>Writing + C in a definite integral answer.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>FTC1: d/dx ∫<sub>a</sub><sup>x</sup> f(t) dt = f(x); chain rule for u(x).</li><li>FTC2: ∫<sub>a</sub><sup>b</sup> f = F(b) − F(a).</li><li>Differentiation and integration undo each other.</li><li>Check continuity on [a, b] first.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/5-3-the-fundamental-theorem-of-calculus" target="_blank" rel="noopener">OpenStax — 5.3 The Fundamental Theorem of Calculus</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ComputingDefiniteIntegrals.aspx" target="_blank" rel="noopener">Paul's Online Notes — Computing Definite Integrals</a></li><li><a href="https://www.3blue1brown.com/lessons/area-and-slope" target="_blank" rel="noopener">3Blue1Brown — What does area have to do with slope?</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-3-the-definite-integral-and-its-applications/part-b-second-fundamental-theorem-areas-volumes/" target="_blank" rel="noopener">MIT 18.01SC — Second Fundamental Theorem, Areas, Volumes</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>∫<sub>0</sub><sup>4</sup> √x dx.</li><li>d/dx ∫<sub>x</sub><sup>2</sup> t<sup>3</sup> dt.</li><li>∫<sub>0</sub><sup>π/4</sup> sec<sup>2</sup>x dx.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) [(2/3)x<sup>3/2</sup>]<sub>0</sub><sup>4</sup> = (2/3)·8 = 16/3. 2) ∫<sub>x</sub><sup>2</sup> = −∫<sub>2</sub><sup>x</sup> ⇒ derivative −x<sup>3</sup>. 3) tan(π/4) − tan 0 = 1.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 7 · Bài 7.3</span>
<h2>Định lý cơ bản của giải tích</h2>
<p class="lead">Diện tích (giới hạn của tổng) và hệ số góc (giới hạn của tỉ sai phân) trông chẳng liên quan. Định lý cơ bản nói chúng là hai phép toán ngược nhau — và biến giới hạn tổng Riemann khó nhằn thành phép tính hai dòng với một nguyên hàm.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu cả hai phần của Định lý cơ bản (FTC).</li><li>Đạo hàm hàm cho bằng tích phân, kèm quy tắc dây chuyền.</li><li>Tính tích phân xác định bằng F(b) − F(a).</li><li>Kiểm giả thiết liên tục trước khi dùng định lý.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">FTC, phần 1</span>Nếu f liên tục trên [a, b] và g(x) = ∫<sub>a</sub><sup>x</sup> f(t) dt thì g′(x) = f(x).<br>Với cận trên biến thiên u(x):  d/dx ∫<sub>a</sub><sup>u(x)</sup> f(t) dt = f(u(x))·u′(x)</div>
<p>Ý nghĩa: tốc độ tăng của diện tích tích luỹ bằng chiều cao đường cong tại mép đang di chuyển. Mọi hàm liên tục đều có nguyên hàm.</p>
<div class="formula"><span class="lbl">FTC, phần 2 (định lý tính giá trị — Newton–Leibniz)</span>Nếu f liên tục trên [a, b] và F′ = f thì ∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) − F(a) = [F(x)]<sub>a</sub><sup>b</sup></div>
<p>Nguyên hàm nào cũng được — hằng số C triệt tiêu trong F(b) − F(a).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — phần 1.</b> d/dx ∫<sub>0</sub><sup>x</sup> cos(t<sup>2</sup>) dt = <b>cos(x<sup>2</sup>)</b> (không cần nguyên hàm — mà nó cũng không có nguyên hàm sơ cấp!).</p></div>
<div class="callout"><p><b>Ví dụ 2 — phần 1 với dây chuyền.</b> d/dx ∫<sub>1</sub><sup>x³</sup> ln t dt = ln(x<sup>3</sup>)·3x<sup>2</sup> = <b>9x<sup>2</sup> ln x</b> (x &gt; 0).</p></div>
<div class="callout"><p><b>Ví dụ 3 — phần 2.</b></p><p>∫<sub>1</sub><sup>3</sup> x<sup>2</sup> dx = [x<sup>3</sup>/3]<sub>1</sub><sup>3</sup> = 9 − 1/3 = <b>26/3</b>.<br>∫<sub>0</sub><sup>π</sup> sin x dx = [−cos x]<sub>0</sub><sup>π</sup> = 1 − (−1) = <b>2</b>.<br>∫<sub>1</sub><sup>e</sup> (1/x) dx = ln e − ln 1 = <b>1</b>.<br>∫<sub>0</sub><sup>1</sup> (e<sup>x</sup> + 2x) dx = [e<sup>x</sup> + x<sup>2</sup>]<sub>0</sub><sup>1</sup> = (e + 1) − 1 = <b>e</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4 — cái bẫy.</b> “∫<sub>−1</sub><sup>1</sup> 1/x<sup>2</sup> dx = [−1/x]<sub>−1</sub><sup>1</sup> = −2” là <b>sai</b>: hàm dương không thể có tích phân âm. 1/x<sup>2</sup> không liên tục tại 0 nên FTC không áp dụng được (tích phân suy rộng này phân kỳ — Chương 10).</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tính F(a) − F(b) thay vì F(b) − F(a).</li><li>Quên u′(x) ở phần 1 khi cận là hàm.</li><li>Bỏ qua điểm gián đoạn bên trong [a, b].</li><li>Ghi + C trong đáp số tích phân xác định.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>FTC1: d/dx ∫<sub>a</sub><sup>x</sup> f(t) dt = f(x); dây chuyền với u(x).</li><li>FTC2: ∫<sub>a</sub><sup>b</sup> f = F(b) − F(a).</li><li>Đạo hàm và tích phân triệt tiêu nhau.</li><li>Kiểm tính liên tục trên [a, b] trước.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/5-3-the-fundamental-theorem-of-calculus" target="_blank" rel="noopener">OpenStax — 5.3 Định lý cơ bản của giải tích</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/ComputingDefiniteIntegrals.aspx" target="_blank" rel="noopener">Paul's Online Notes — Tính tích phân xác định</a></li><li><a href="https://www.3blue1brown.com/lessons/area-and-slope" target="_blank" rel="noopener">3Blue1Brown — Diện tích liên quan gì tới hệ số góc?</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-3-the-definite-integral-and-its-applications/part-b-second-fundamental-theorem-areas-volumes/" target="_blank" rel="noopener">MIT 18.01SC — Định lý cơ bản thứ hai, diện tích, thể tích</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>∫<sub>0</sub><sup>4</sup> √x dx.</li><li>d/dx ∫<sub>x</sub><sup>2</sup> t<sup>3</sup> dt.</li><li>∫<sub>0</sub><sup>π/4</sup> sec<sup>2</sup>x dx.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) [(2/3)x<sup>3/2</sup>]<sub>0</sub><sup>4</sup> = (2/3)·8 = 16/3. 2) ∫<sub>x</sub><sup>2</sup> = −∫<sub>2</sub><sup>x</sup> ⇒ đạo hàm −x<sup>3</sup>. 3) tan(π/4) − tan 0 = 1.</p></div>`);

const c74 = L('cal111-ts-7-4',
  '7.4 — Net change, displacement vs distance, and average value|||7.4 — Lượng thay đổi ròng, độ dời và quãng đường, giá trị trung bình',
  'Định lý thay đổi ròng ∫ₐᵇ F′ = F(b) − F(a): lưu lượng nước, chi phí biên, tăng dân số; độ dời ∫v và quãng đường ∫|v|; giá trị trung bình của hàm và định lý giá trị trung bình cho tích phân.',
  `<span class="eyebrow">CAL111 · Chapter 7 · Lesson 7.4</span>
<h2>Net change, displacement and average value</h2>
<p class="lead">If you know a <em>rate</em> — litres per minute, cost per unit, metres per second — the integral of that rate gives the total <em>change</em>. This one idea covers physics, economics and data science.</p>
<h3>🎯 Objectives</h3>
<ul><li>Apply the Net Change Theorem in context.</li><li>Distinguish displacement ∫v dt from distance ∫|v| dt.</li><li>Compute the average value of a function.</li><li>Find the point c promised by the Mean Value Theorem for integrals.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Net Change Theorem</span>∫<sub>a</sub><sup>b</sup> F′(x) dx = F(b) − F(a)    (the integral of a rate of change is the net change)</div>
<p>Examples: water flow rate r(t) L/min ⇒ ∫r dt = litres added; marginal cost C′(q) ⇒ ∫C′ dq = extra cost; velocity v(t) ⇒ ∫v dt = displacement.</p>
<div class="formula"><span class="lbl">Displacement vs. distance</span>displacement = ∫<sub>a</sub><sup>b</sup> v(t) dt        total distance = ∫<sub>a</sub><sup>b</sup> |v(t)| dt (split where v changes sign)</div>
<div class="formula"><span class="lbl">Average value and MVT for integrals</span>f<sub>avg</sub> = (1/(b − a)) ∫<sub>a</sub><sup>b</sup> f(x) dx        f continuous ⇒ f(c) = f<sub>avg</sub> for some c in [a, b]</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — water.</b> Water enters a tank at r(t) = 200 − 4t L/min for 0 ≤ t ≤ 10. Volume added: ∫<sub>0</sub><sup>10</sup> (200 − 4t) dt = [200t − 2t<sup>2</sup>]<sub>0</sub><sup>10</sup> = 2000 − 200 = <b>1800 L</b>.</p></div>
<div class="callout"><p><b>Example 2 — displacement and distance.</b> v(t) = t<sup>2</sup> − 2t − 3 = (t − 3)(t + 1) m/s on [0, 4].</p>
<p>Displacement: [t<sup>3</sup>/3 − t<sup>2</sup> − 3t]<sub>0</sub><sup>4</sup> = 64/3 − 16 − 12 = <b>−20/3 m</b>.<br>v &lt; 0 on [0, 3), v &gt; 0 on (3, 4]: ∫<sub>0</sub><sup>3</sup> v dt = −9 and ∫<sub>3</sub><sup>4</sup> v dt = 7/3. Distance = 9 + 7/3 = <b>34/3 ≈ 11.33 m</b>.</p></div>
<div class="callout"><p><b>Example 3 — marginal cost.</b> C′(q) = 50 − 0.2q (thousand VND per unit). Raising production from 100 to 200 units costs ∫<sub>100</sub><sup>200</sup> (50 − 0.2q) dq = 5000 − 0.1(40 000 − 10 000) = <b>2000</b> thousand VND.</p></div>
<div class="callout"><p><b>Example 4 — average value.</b> f(x) = x<sup>2</sup> on [0, 3]: f<sub>avg</sub> = (1/3)·[x<sup>3</sup>/3]<sub>0</sub><sup>3</sup> = (1/3)·9 = <b>3</b>; f(c) = 3 at c = √3 ≈ 1.732.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Reporting displacement when distance is asked (or the reverse).</li><li>Integrating |v| without splitting at the zeros of v.</li><li>Forgetting the factor 1/(b − a) in the average value.</li><li>Confusing the average of f with the average rate of change [f(b) − f(a)]/(b − a).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>∫ rate = net change.</li><li>∫v = displacement; ∫|v| = distance.</li><li>f<sub>avg</sub> = ∫f/(b − a).</li><li>A continuous f attains its average value somewhere.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/5-4-integration-formulas-and-the-net-change-theorem" target="_blank" rel="noopener">OpenStax — 5.4 Integration Formulas and the Net Change Theorem</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/AvgFcnValue.aspx" target="_blank" rel="noopener">Paul's Online Notes — Average Function Value</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-3-the-definite-integral-and-its-applications/part-c-average-value-probability-and-numerical-integration/" target="_blank" rel="noopener">MIT 18.01SC — Average Value, Probability and Numerical Integration</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>v(t) = 3t − 6 on [0, 4]: find displacement and distance.</li><li>Average value of sin x on [0, π].</li><li>A population grows at 100e<sup>0.05t</sup> people per year. How many people are added in the first 10 years?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Displacement [1.5t<sup>2</sup> − 6t]<sub>0</sub><sup>4</sup> = 0; distance |∫<sub>0</sub><sup>2</sup>| + ∫<sub>2</sub><sup>4</sup> = 6 + 6 = 12 m. 2) (1/π)·2 = 2/π ≈ 0.637. 3) ∫<sub>0</sub><sup>10</sup> 100e<sup>0.05t</sup> dt = 2000(e<sup>0.5</sup> − 1) ≈ 1297 people.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 7 · Bài 7.4</span>
<h2>Lượng thay đổi ròng, độ dời và giá trị trung bình</h2>
<p class="lead">Nếu bạn biết một <em>tốc độ</em> — lít mỗi phút, chi phí mỗi sản phẩm, mét mỗi giây — thì tích phân của tốc độ đó cho tổng <em>lượng thay đổi</em>. Một ý tưởng này phủ cả vật lý, kinh tế và khoa học dữ liệu.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp dụng định lý thay đổi ròng trong ngữ cảnh.</li><li>Phân biệt độ dời ∫v dt và quãng đường ∫|v| dt.</li><li>Tính giá trị trung bình của hàm số.</li><li>Tìm điểm c theo định lý giá trị trung bình cho tích phân.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Định lý thay đổi ròng</span>∫<sub>a</sub><sup>b</sup> F′(x) dx = F(b) − F(a)    (tích phân của tốc độ thay đổi là lượng thay đổi ròng)</div>
<p>Ví dụ: lưu lượng nước r(t) L/phút ⇒ ∫r dt = số lít thêm vào; chi phí biên C′(q) ⇒ ∫C′ dq = chi phí tăng thêm; vận tốc v(t) ⇒ ∫v dt = độ dời.</p>
<div class="formula"><span class="lbl">Độ dời và quãng đường</span>độ dời = ∫<sub>a</sub><sup>b</sup> v(t) dt        tổng quãng đường = ∫<sub>a</sub><sup>b</sup> |v(t)| dt (tách tại nơi v đổi dấu)</div>
<div class="formula"><span class="lbl">Giá trị trung bình và MVT cho tích phân</span>f<sub>tb</sub> = (1/(b − a)) ∫<sub>a</sub><sup>b</sup> f(x) dx        f liên tục ⇒ f(c) = f<sub>tb</sub> với c nào đó trong [a, b]</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — nước.</b> Nước chảy vào bể với r(t) = 200 − 4t L/phút, 0 ≤ t ≤ 10. Lượng nước thêm: ∫<sub>0</sub><sup>10</sup> (200 − 4t) dt = [200t − 2t<sup>2</sup>]<sub>0</sub><sup>10</sup> = 2000 − 200 = <b>1800 L</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — độ dời và quãng đường.</b> v(t) = t<sup>2</sup> − 2t − 3 = (t − 3)(t + 1) m/s trên [0, 4].</p>
<p>Độ dời: [t<sup>3</sup>/3 − t<sup>2</sup> − 3t]<sub>0</sub><sup>4</sup> = 64/3 − 16 − 12 = <b>−20/3 m</b>.<br>v &lt; 0 trên [0, 3), v &gt; 0 trên (3, 4]: ∫<sub>0</sub><sup>3</sup> v dt = −9 và ∫<sub>3</sub><sup>4</sup> v dt = 7/3. Quãng đường = 9 + 7/3 = <b>34/3 ≈ 11,33 m</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — chi phí biên.</b> C′(q) = 50 − 0,2q (nghìn đồng mỗi sản phẩm). Tăng sản lượng từ 100 lên 200 tốn ∫<sub>100</sub><sup>200</sup> (50 − 0,2q) dq = 5000 − 0,1(40 000 − 10 000) = <b>2000</b> nghìn đồng.</p></div>
<div class="callout"><p><b>Ví dụ 4 — giá trị trung bình.</b> f(x) = x<sup>2</sup> trên [0, 3]: f<sub>tb</sub> = (1/3)·[x<sup>3</sup>/3]<sub>0</sub><sup>3</sup> = (1/3)·9 = <b>3</b>; f(c) = 3 tại c = √3 ≈ 1,732.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Trả lời độ dời khi đề hỏi quãng đường (hoặc ngược lại).</li><li>Tích phân |v| mà không tách tại nghiệm của v.</li><li>Quên hệ số 1/(b − a) trong giá trị trung bình.</li><li>Nhầm giá trị trung bình của f với tốc độ thay đổi trung bình [f(b) − f(a)]/(b − a).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>∫ tốc độ = lượng thay đổi ròng.</li><li>∫v = độ dời; ∫|v| = quãng đường.</li><li>f<sub>tb</sub> = ∫f/(b − a).</li><li>f liên tục đạt giá trị trung bình tại một điểm nào đó.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/5-4-integration-formulas-and-the-net-change-theorem" target="_blank" rel="noopener">OpenStax — 5.4 Công thức tích phân và định lý thay đổi ròng</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/AvgFcnValue.aspx" target="_blank" rel="noopener">Paul's Online Notes — Giá trị trung bình của hàm</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-3-the-definite-integral-and-its-applications/part-c-average-value-probability-and-numerical-integration/" target="_blank" rel="noopener">MIT 18.01SC — Giá trị trung bình, xác suất và tích phân số</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>v(t) = 3t − 6 trên [0, 4]: tìm độ dời và quãng đường.</li><li>Giá trị trung bình của sin x trên [0, π].</li><li>Dân số tăng với tốc độ 100e<sup>0,05t</sup> người/năm. 10 năm đầu tăng thêm bao nhiêu người?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Độ dời [1,5t<sup>2</sup> − 6t]<sub>0</sub><sup>4</sup> = 0; quãng đường |∫<sub>0</sub><sup>2</sup>| + ∫<sub>2</sub><sup>4</sup> = 6 + 6 = 12 m. 2) (1/π)·2 = 2/π ≈ 0,637. 3) ∫<sub>0</sub><sup>10</sup> 100e<sup>0,05t</sup> dt = 2000(e<sup>0,5</sup> − 1) ≈ 1297 người.</p></div>`);

const q7 = QZ(7, 'Quiz — Chapter 7: The definite integral & FTC|||Quiz — Chương 7: Tích phân xác định & định lý cơ bản', 'Kiểm tra chương 7: tổng Riemann, tính chất tích phân, định lý cơ bản, độ dời/quãng đường, giá trị trung bình.', [
  Q('q1', 'For f(x) = x² on [0, 2] with n = 4, the right Riemann sum R₄ =|||Với f(x) = x² trên [0, 2], n = 4, tổng Riemann phải R₄ =',
    ['1.75|||1,75', '2.625|||2,625', '3.75|||3,75', '8/3|||8/3'], 2,
    '0.5(0.25 + 1 + 2.25 + 4) = 3.75.|||0,5(0,25 + 1 + 2,25 + 4) = 3,75.'),
  Q('q2', '∑ (i = 1 to 10) (2i + 1) =|||∑ (i = 1 đến 10) (2i + 1) =',
    ['110|||110', '120|||120', '121|||121', '100|||100'], 1,
    '2·(10·11/2) + 10 = 120.|||2·(10·11/2) + 10 = 120.'),
  Q('q3', '∫ from −2 to 2 of √(4 − x²) dx =|||∫ từ −2 đến 2 của √(4 − x²) dx =',
    ['4π|||4π', '2π|||2π', 'π|||π', '8|||8'], 1,
    'Upper half of a circle of radius 2: (1/2)π·2².|||Nửa trên hình tròn bán kính 2: (1/2)π·2².'),
  Q('q4', 'If ∫₀⁵ f = 8, then ∫₀⁵ (2f(x) + 1) dx =|||Nếu ∫₀⁵ f = 8 thì ∫₀⁵ (2f(x) + 1) dx =',
    ['17|||17', '21|||21', '16|||16', '26|||26'], 1,
    '2·8 + 1·(5 − 0) = 21.|||2·8 + 1·(5 − 0) = 21.'),
  Q('q5', 'd/dx ∫ from 1 to x³ of ln t dt =|||d/dx ∫ từ 1 đến x³ của ln t dt =',
    ['ln(x³)|||ln(x³)', '9x² ln x|||9x² ln x', '3 ln x|||3 ln x', '1/x³|||1/x³'], 1,
    'FTC1 + chain rule: ln(x³)·3x² = 9x² ln x.|||FTC1 + dây chuyền: ln(x³)·3x² = 9x² ln x.'),
  Q('q6', '∫₀^π sin x dx =|||∫₀^π sin x dx =',
    ['0|||0', '1|||1', '2|||2', '−2|||−2'], 2,
    '[−cos x] from 0 to π = 1 + 1 = 2.|||[−cos x] từ 0 đến π = 1 + 1 = 2.'),
  Q('q7', 'Why is ∫ from −1 to 1 of 1/x² dx ≠ −2?|||Vì sao ∫ từ −1 đến 1 của 1/x² dx ≠ −2?',
    ['Arithmetic error|||Tính nhầm', '1/x² is discontinuous at 0, so FTC does not apply|||1/x² gián đoạn tại 0 nên FTC không áp dụng', 'The answer is +2|||Đáp số là +2', 'Limits must be positive|||Cận phải dương'], 1,
    'FTC needs continuity on [a, b]; this improper integral diverges.|||FTC cần liên tục trên [a, b]; tích phân suy rộng này phân kỳ.'),
  Q('q8', 'v(t) = t² − 2t − 3 on [0, 4]. Total distance travelled =|||v(t) = t² − 2t − 3 trên [0, 4]. Tổng quãng đường =',
    ['−20/3 m|||−20/3 m', '20/3 m|||20/3 m', '34/3 m|||34/3 m', '9 m|||9 m'], 2,
    'Split at t = 3: |−9| + 7/3 = 34/3.|||Tách tại t = 3: |−9| + 7/3 = 34/3.'),
  Q('q9', 'The average value of f(x) = x² on [0, 3] is|||Giá trị trung bình của f(x) = x² trên [0, 3] là',
    ['9|||9', '3|||3', '4.5|||4,5', '√3|||√3'], 1,
    '(1/3)∫₀³ x² dx = (1/3)·9 = 3.|||(1/3)∫₀³ x² dx = (1/3)·9 = 3.'),
  Q('q10', 'Water flows in at r(t) = 200 − 4t L/min. Litres added during 0 ≤ t ≤ 10:|||Nước chảy vào r(t) = 200 − 4t L/phút. Lượng nước thêm trong 0 ≤ t ≤ 10:',
    ['2000|||2000', '1800|||1800', '1600|||1600', '160|||160'], 1,
    '[200t − 2t²] from 0 to 10 = 2000 − 200.|||[200t − 2t²] từ 0 đến 10 = 2000 − 200.'),
]);

const ch7 = {
  title: 'Chapter 7 — The definite integral and the Fundamental Theorem|||Chương 7 — Tích phân xác định và Định lý cơ bản của giải tích',
  description: 'Tổng Riemann, tích phân xác định và tính chất, Định lý cơ bản của giải tích (hai phần), định lý thay đổi ròng, độ dời – quãng đường, giá trị trung bình (Stewart ch.5 · OpenStax 5.1–5.4).',
  lessons: [c71, c72, c73, c74, q7],
};

// ───────────────────────────── Chương 8 — Kỹ thuật tính tích phân ─────────────────────────────
const c81 = L('cal111-ts-8-1',
  '8.1 — The substitution rule|||8.1 — Phương pháp đổi biến (quy tắc thế)',
  'Đổi biến u = g(x) cho tích phân bất định và xác định (đổi cận), các mẫu nhận diện: g′(x)·f(g(x)), u′/u, eᵘu′; tích phân tan x; tích phân dẫn tới arctan.',
  `<span class="eyebrow">CAL111 · Chapter 8 · Lesson 8.1</span>
<h2>The substitution rule</h2>
<p class="lead">Substitution is the chain rule run backwards. Whenever an integrand contains a function and (a multiple of) its derivative, a change of variable u = g(x) turns it into a basic integral.</p>
<h3>🎯 Objectives</h3>
<ul><li>Recognise the pattern f(g(x))·g′(x).</li><li>Carry out u-substitution in indefinite integrals.</li><li>Change the limits in definite integrals.</li><li>Use substitution for ∫ tan x dx, ∫ u′/u dx and arctan-type integrals.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Substitution rule</span>∫ f(g(x)) g′(x) dx = ∫ f(u) du,  with u = g(x), du = g′(x) dx<br>Definite:  ∫<sub>a</sub><sup>b</sup> f(g(x)) g′(x) dx = ∫<sub>g(a)</sub><sup>g(b)</sup> f(u) du</div>
<p><strong>Recipe.</strong> (1) Choose u = the “inside” function whose derivative also appears. (2) Compute du = u′ dx and solve for dx or for the leftover factor. (3) Rewrite everything in u — no x may remain. (4) Integrate. (5) Substitute back (indefinite), or use the new limits (definite).</p>
<div class="formula"><span class="lbl">Useful results</span>∫ u′/u dx = ln|u| + C    ∫ tan x dx = −ln|cos x| + C = ln|sec x| + C    ∫ dx/(a<sup>2</sup> + x<sup>2</sup>) = (1/a) arctan(x/a) + C</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> ∫ 2x(x<sup>2</sup> + 1)<sup>5</sup> dx. u = x<sup>2</sup> + 1, du = 2x dx ⇒ ∫ u<sup>5</sup> du = u<sup>6</sup>/6 + C = <b>(x<sup>2</sup> + 1)<sup>6</sup>/6 + C</b>.</p></div>
<div class="callout"><p><b>Example 2 — a missing constant.</b> ∫ x/(x<sup>2</sup> + 4) dx. u = x<sup>2</sup> + 4, du = 2x dx ⇒ x dx = du/2 ⇒ (1/2)∫ du/u = <b>(1/2) ln(x<sup>2</sup> + 4) + C</b>.</p></div>
<div class="callout"><p><b>Example 3.</b> ∫ cos x · e<sup>sin x</sup> dx. u = sin x ⇒ <b>e<sup>sin x</sup> + C</b>.  ∫ tan x dx = ∫ sin x/cos x dx, u = cos x, du = −sin x dx ⇒ −∫du/u = <b>−ln|cos x| + C</b>.</p></div>
<div class="callout"><p><b>Example 4 — definite, change the limits.</b> ∫<sub>0</sub><sup>1</sup> x(1 + x<sup>2</sup>)<sup>3</sup> dx. u = 1 + x<sup>2</sup>: x = 0 → u = 1, x = 1 → u = 2; x dx = du/2.</p><p>(1/2)∫<sub>1</sub><sup>2</sup> u<sup>3</sup> du = (1/2)[u<sup>4</sup>/4]<sub>1</sub><sup>2</sup> = (1/2)(16 − 1)/4 = <b>15/8</b>.</p></div>
<div class="callout"><p><b>Example 5.</b> ∫<sub>0</sub><sup>π/2</sup> sin<sup>2</sup>x cos x dx: u = sin x, limits 0 → 1: ∫<sub>0</sub><sup>1</sup> u<sup>2</sup> du = <b>1/3</b>. And ∫ dx/(1 + 4x<sup>2</sup>): u = 2x ⇒ <b>(1/2) arctan(2x) + C</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Leaving some x in the integral after substituting.</li><li>Forgetting the constant factor (du = 2x dx, but only x dx is present).</li><li>In a definite integral, changing to u but keeping the old x-limits.</li><li>Choosing u so that du does not appear — e.g. u = x<sup>2</sup> + 1 for ∫ (x<sup>2</sup> + 1)<sup>5</sup> dx (no x factor) does not help.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Look for an inside function whose derivative is present.</li><li>du = g′(x)dx; adjust constants.</li><li>Definite integrals: change the limits too.</li><li>∫u′/u = ln|u| is the most frequent pattern.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/5-5-substitution" target="_blank" rel="noopener">OpenStax — 5.5 Substitution</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/5-6-integrals-involving-exponential-and-logarithmic-functions" target="_blank" rel="noopener">OpenStax — 5.6 Integrals Involving Exponential and Logarithmic Functions</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/SubstitutionRuleIndefinite.aspx" target="_blank" rel="noopener">Paul's Online Notes — Substitution Rule for Indefinite Integrals</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/SubstitutionRuleDefinite.aspx" target="_blank" rel="noopener">Paul's Online Notes — Substitution Rule for Definite Integrals</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>∫ e<sup>3x</sup> dx.</li><li>∫<sub>1</sub><sup>e</sup> (ln x)/x dx.</li><li>∫ x<sup>2</sup> cos(x<sup>3</sup>) dx.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) u = 3x ⇒ e<sup>3x</sup>/3 + C. 2) u = ln x, limits 0 → 1: ∫<sub>0</sub><sup>1</sup> u du = 1/2. 3) u = x<sup>3</sup>, x<sup>2</sup>dx = du/3 ⇒ sin(x<sup>3</sup>)/3 + C.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 8 · Bài 8.1</span>
<h2>Phương pháp đổi biến</h2>
<p class="lead">Đổi biến là quy tắc dây chuyền chạy ngược. Hễ biểu thức dưới dấu tích phân chứa một hàm và (bội của) đạo hàm của nó, đổi biến u = g(x) sẽ đưa về tích phân cơ bản.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận ra mẫu f(g(x))·g′(x).</li><li>Thực hiện đổi biến cho tích phân bất định.</li><li>Đổi cận trong tích phân xác định.</li><li>Dùng đổi biến cho ∫ tan x dx, ∫ u′/u dx và tích phân dạng arctan.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Quy tắc đổi biến</span>∫ f(g(x)) g′(x) dx = ∫ f(u) du,  với u = g(x), du = g′(x) dx<br>Xác định:  ∫<sub>a</sub><sup>b</sup> f(g(x)) g′(x) dx = ∫<sub>g(a)</sub><sup>g(b)</sup> f(u) du</div>
<p><strong>Công thức làm.</strong> (1) Chọn u = hàm “bên trong” mà đạo hàm của nó cũng xuất hiện. (2) Tính du = u′ dx rồi giải ra dx hoặc thừa số còn lại. (3) Viết tất cả theo u — không được còn x. (4) Lấy tích phân. (5) Thế ngược (bất định), hoặc dùng cận mới (xác định).</p>
<div class="formula"><span class="lbl">Kết quả hữu ích</span>∫ u′/u dx = ln|u| + C    ∫ tan x dx = −ln|cos x| + C = ln|sec x| + C    ∫ dx/(a<sup>2</sup> + x<sup>2</sup>) = (1/a) arctan(x/a) + C</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> ∫ 2x(x<sup>2</sup> + 1)<sup>5</sup> dx. u = x<sup>2</sup> + 1, du = 2x dx ⇒ ∫ u<sup>5</sup> du = u<sup>6</sup>/6 + C = <b>(x<sup>2</sup> + 1)<sup>6</sup>/6 + C</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — thiếu hằng số.</b> ∫ x/(x<sup>2</sup> + 4) dx. u = x<sup>2</sup> + 4, du = 2x dx ⇒ x dx = du/2 ⇒ (1/2)∫ du/u = <b>(1/2) ln(x<sup>2</sup> + 4) + C</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3.</b> ∫ cos x · e<sup>sin x</sup> dx. u = sin x ⇒ <b>e<sup>sin x</sup> + C</b>.  ∫ tan x dx = ∫ sin x/cos x dx, u = cos x, du = −sin x dx ⇒ −∫du/u = <b>−ln|cos x| + C</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4 — xác định, đổi cận.</b> ∫<sub>0</sub><sup>1</sup> x(1 + x<sup>2</sup>)<sup>3</sup> dx. u = 1 + x<sup>2</sup>: x = 0 → u = 1, x = 1 → u = 2; x dx = du/2.</p><p>(1/2)∫<sub>1</sub><sup>2</sup> u<sup>3</sup> du = (1/2)[u<sup>4</sup>/4]<sub>1</sub><sup>2</sup> = (1/2)(16 − 1)/4 = <b>15/8</b>.</p></div>
<div class="callout"><p><b>Ví dụ 5.</b> ∫<sub>0</sub><sup>π/2</sup> sin<sup>2</sup>x cos x dx: u = sin x, cận 0 → 1: ∫<sub>0</sub><sup>1</sup> u<sup>2</sup> du = <b>1/3</b>. Và ∫ dx/(1 + 4x<sup>2</sup>): u = 2x ⇒ <b>(1/2) arctan(2x) + C</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Còn sót x trong tích phân sau khi đổi biến.</li><li>Quên hệ số hằng (du = 2x dx, nhưng chỉ có x dx).</li><li>Tích phân xác định: đổi sang u mà vẫn giữ cận cũ theo x.</li><li>Chọn u mà du không xuất hiện — vd u = x<sup>2</sup> + 1 cho ∫ (x<sup>2</sup> + 1)<sup>5</sup> dx (không có thừa số x) thì vô ích.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tìm hàm bên trong có đạo hàm xuất hiện.</li><li>du = g′(x)dx; điều chỉnh hằng số.</li><li>Tích phân xác định: đổi luôn cận.</li><li>∫u′/u = ln|u| là mẫu gặp nhiều nhất.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/5-5-substitution" target="_blank" rel="noopener">OpenStax — 5.5 Đổi biến</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/5-6-integrals-involving-exponential-and-logarithmic-functions" target="_blank" rel="noopener">OpenStax — 5.6 Tích phân chứa hàm mũ và logarit</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/SubstitutionRuleIndefinite.aspx" target="_blank" rel="noopener">Paul's Online Notes — Đổi biến cho tích phân bất định</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/SubstitutionRuleDefinite.aspx" target="_blank" rel="noopener">Paul's Online Notes — Đổi biến cho tích phân xác định</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>∫ e<sup>3x</sup> dx.</li><li>∫<sub>1</sub><sup>e</sup> (ln x)/x dx.</li><li>∫ x<sup>2</sup> cos(x<sup>3</sup>) dx.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) u = 3x ⇒ e<sup>3x</sup>/3 + C. 2) u = ln x, cận 0 → 1: ∫<sub>0</sub><sup>1</sup> u du = 1/2. 3) u = x<sup>3</sup>, x<sup>2</sup>dx = du/3 ⇒ sin(x<sup>3</sup>)/3 + C.</p></div>`);

const c82 = L('cal111-ts-8-2',
  '8.2 — Integration by parts|||8.2 — Tích phân từng phần',
  'Công thức ∫u dv = uv − ∫v du (quy tắc tích chạy ngược), chọn u theo LIATE, ví dụ x eˣ, ln x, x² sin x (hai lần), eˣ sin x (vòng lặp), tích phân xác định.',
  `<span class="eyebrow">CAL111 · Chapter 8 · Lesson 8.2</span>
<h2>Integration by parts</h2>
<p class="lead">Substitution reverses the chain rule; integration by parts reverses the product rule. It handles products like x e<sup>x</sup>, x sin x and lone functions like ln x or arctan x that have no obvious antiderivative.</p>
<h3>🎯 Objectives</h3>
<ul><li>Derive and state the integration by parts formula.</li><li>Choose u and dv using the LIATE heuristic.</li><li>Apply the formula repeatedly and in “loop” cases.</li><li>Use the definite-integral version.</li></ul>
<h3>📖 Lecture</h3>
<p>From (uv)′ = u′v + uv′, integrate both sides and rearrange:</p>
<div class="formula"><span class="lbl">Integration by parts</span>∫ u dv = uv − ∫ v du        ∫<sub>a</sub><sup>b</sup> u dv = [uv]<sub>a</sub><sup>b</sup> − ∫<sub>a</sub><sup>b</sup> v du</div>
<p><strong>Choosing u (LIATE):</strong> pick u as the first type in the list <em>Logarithmic, Inverse trig, Algebraic (polynomials), Trigonometric, Exponential</em>; dv is the rest. The goal: u should get simpler when differentiated and dv should be easy to integrate.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> ∫ x e<sup>x</sup> dx. u = x, dv = e<sup>x</sup>dx ⇒ du = dx, v = e<sup>x</sup>. = x e<sup>x</sup> − ∫ e<sup>x</sup> dx = <b>(x − 1)e<sup>x</sup> + C</b>.</p></div>
<div class="callout"><p><b>Example 2 — a lone log.</b> ∫ ln x dx. u = ln x, dv = dx ⇒ du = dx/x, v = x. = x ln x − ∫ 1 dx = <b>x ln x − x + C</b>.</p></div>
<div class="callout"><p><b>Example 3 — twice.</b> ∫ x<sup>2</sup> sin x dx. u = x<sup>2</sup>, dv = sin x dx ⇒ = −x<sup>2</sup>cos x + ∫ 2x cos x dx. Again u = 2x, dv = cos x dx ⇒ ∫ 2x cos x dx = 2x sin x − ∫ 2 sin x dx = 2x sin x + 2cos x. Result: <b>−x<sup>2</sup>cos x + 2x sin x + 2cos x + C</b>.</p></div>
<div class="callout"><p><b>Example 4 — the loop.</b> I = ∫ e<sup>x</sup> sin x dx. Parts twice (u = sin x, then u = cos x): I = e<sup>x</sup>sin x − e<sup>x</sup>cos x − I. Solve the equation: 2I = e<sup>x</sup>(sin x − cos x) ⇒ <b>I = e<sup>x</sup>(sin x − cos x)/2 + C</b>.</p></div>
<div class="callout"><p><b>Example 5 — definite.</b> ∫<sub>0</sub><sup>1</sup> x e<sup>x</sup> dx = [(x − 1)e<sup>x</sup>]<sub>0</sub><sup>1</sup> = 0 − (−1) = <b>1</b>. Also ∫<sub>1</sub><sup>e</sup> ln x dx = [x ln x − x]<sub>1</sub><sup>e</sup> = 0 − (−1) = <b>1</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Choosing u = e<sup>x</sup>, dv = x dx in ∫ x e<sup>x</sup> — the new integral ∫ (x<sup>2</sup>/2)e<sup>x</sup> dx is harder.</li><li>Sign errors in the second round (−∫v du with v negative).</li><li>In the loop case, undoing the first step by switching the roles of u and dv.</li><li>Forgetting to evaluate [uv] at the limits in a definite integral.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>∫u dv = uv − ∫v du (product rule reversed).</li><li>LIATE to choose u.</li><li>Polynomial × trig/exp ⇒ repeat until the polynomial disappears.</li><li>e<sup>x</sup> × sin/cos ⇒ loop and solve for I.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-2/pages/3-1-integration-by-parts" target="_blank" rel="noopener">OpenStax Calculus Vol. 2 — 3.1 Integration by Parts</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcII/IntegrationByParts.aspx" target="_blank" rel="noopener">Paul's Online Notes — Integration by Parts</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-4-techniques-of-integration/part-b-partial-fractions-integration-by-parts-arc-length-and-surface-area/" target="_blank" rel="noopener">MIT 18.01SC — Partial Fractions, Integration by Parts, Arc Length</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>∫ x cos x dx.</li><li>∫<sub>0</sub><sup>π</sup> x sin x dx.</li><li>∫ arctan x dx.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) u = x: x sin x + cos x + C. 2) [−x cos x + sin x]<sub>0</sub><sup>π</sup> = π. 3) u = arctan x, dv = dx: x arctan x − ∫ x/(1 + x<sup>2</sup>) dx = x arctan x − (1/2)ln(1 + x<sup>2</sup>) + C.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 8 · Bài 8.2</span>
<h2>Tích phân từng phần</h2>
<p class="lead">Đổi biến đảo ngược quy tắc dây chuyền; tích phân từng phần đảo ngược quy tắc tích. Nó xử lý các tích như x e<sup>x</sup>, x sin x và các hàm đứng một mình như ln x hay arctan x vốn không có nguyên hàm hiển nhiên.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Suy ra và phát biểu công thức tích phân từng phần.</li><li>Chọn u và dv theo quy tắc LIATE.</li><li>Áp dụng nhiều lần và trong trường hợp “vòng lặp”.</li><li>Dùng phiên bản cho tích phân xác định.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Từ (uv)′ = u′v + uv′, lấy tích phân hai vế rồi chuyển vế:</p>
<div class="formula"><span class="lbl">Tích phân từng phần</span>∫ u dv = uv − ∫ v du        ∫<sub>a</sub><sup>b</sup> u dv = [uv]<sub>a</sub><sup>b</sup> − ∫<sub>a</sub><sup>b</sup> v du</div>
<p><strong>Chọn u (LIATE):</strong> u là loại đứng trước trong danh sách <em>Logarit, lượng giác ngược (Inverse trig), đại số (đa thức — Algebraic), lượng giác (Trig), mũ (Exponential)</em>; dv là phần còn lại. Mục tiêu: u đơn giản đi khi đạo hàm, dv dễ lấy nguyên hàm.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> ∫ x e<sup>x</sup> dx. u = x, dv = e<sup>x</sup>dx ⇒ du = dx, v = e<sup>x</sup>. = x e<sup>x</sup> − ∫ e<sup>x</sup> dx = <b>(x − 1)e<sup>x</sup> + C</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — logarit đứng một mình.</b> ∫ ln x dx. u = ln x, dv = dx ⇒ du = dx/x, v = x. = x ln x − ∫ 1 dx = <b>x ln x − x + C</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — hai lần.</b> ∫ x<sup>2</sup> sin x dx. u = x<sup>2</sup>, dv = sin x dx ⇒ = −x<sup>2</sup>cos x + ∫ 2x cos x dx. Lần nữa u = 2x, dv = cos x dx ⇒ ∫ 2x cos x dx = 2x sin x − ∫ 2 sin x dx = 2x sin x + 2cos x. Kết quả: <b>−x<sup>2</sup>cos x + 2x sin x + 2cos x + C</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4 — vòng lặp.</b> I = ∫ e<sup>x</sup> sin x dx. Từng phần hai lần (u = sin x, rồi u = cos x): I = e<sup>x</sup>sin x − e<sup>x</sup>cos x − I. Giải phương trình: 2I = e<sup>x</sup>(sin x − cos x) ⇒ <b>I = e<sup>x</sup>(sin x − cos x)/2 + C</b>.</p></div>
<div class="callout"><p><b>Ví dụ 5 — xác định.</b> ∫<sub>0</sub><sup>1</sup> x e<sup>x</sup> dx = [(x − 1)e<sup>x</sup>]<sub>0</sub><sup>1</sup> = 0 − (−1) = <b>1</b>. Và ∫<sub>1</sub><sup>e</sup> ln x dx = [x ln x − x]<sub>1</sub><sup>e</sup> = 0 − (−1) = <b>1</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chọn u = e<sup>x</sup>, dv = x dx cho ∫ x e<sup>x</sup> — tích phân mới ∫ (x<sup>2</sup>/2)e<sup>x</sup> dx còn khó hơn.</li><li>Sai dấu ở lượt thứ hai (−∫v du với v âm).</li><li>Ở trường hợp vòng lặp, đổi vai u và dv khiến quay về bước đầu.</li><li>Quên tính [uv] tại hai cận trong tích phân xác định.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>∫u dv = uv − ∫v du (quy tắc tích chạy ngược).</li><li>LIATE để chọn u.</li><li>Đa thức × lượng giác/mũ ⇒ lặp tới khi đa thức biến mất.</li><li>e<sup>x</sup> × sin/cos ⇒ vòng lặp rồi giải ra I.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-2/pages/3-1-integration-by-parts" target="_blank" rel="noopener">OpenStax Calculus Vol. 2 — 3.1 Tích phân từng phần</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcII/IntegrationByParts.aspx" target="_blank" rel="noopener">Paul's Online Notes — Tích phân từng phần</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-4-techniques-of-integration/part-b-partial-fractions-integration-by-parts-arc-length-and-surface-area/" target="_blank" rel="noopener">MIT 18.01SC — Phân thức, từng phần, độ dài cung</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>∫ x cos x dx.</li><li>∫<sub>0</sub><sup>π</sup> x sin x dx.</li><li>∫ arctan x dx.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) u = x: x sin x + cos x + C. 2) [−x cos x + sin x]<sub>0</sub><sup>π</sup> = π. 3) u = arctan x, dv = dx: x arctan x − ∫ x/(1 + x<sup>2</sup>) dx = x arctan x − (1/2)ln(1 + x<sup>2</sup>) + C.</p></div>`);

const c83 = L('cal111-ts-8-3',
  '8.3 — Trigonometric integrals and partial fractions|||8.3 — Tích phân lượng giác và phân thức hữu tỉ',
  'Luỹ thừa sin/cos (tách một thừa số khi bậc lẻ, hạ bậc khi bậc chẵn), phân tích phân thức hữu tỉ thành phân thức đơn giản với nhân tử bậc nhất phân biệt.',
  `<span class="eyebrow">CAL111 · Chapter 8 · Lesson 8.3</span>
<h2>Trigonometric integrals and partial fractions</h2>
<p class="lead">Two more standard tools. Trigonometric identities turn powers of sine and cosine into something substitution can handle; partial fractions split a rational function into simple pieces that integrate to logarithms.</p>
<h3>🎯 Objectives</h3>
<ul><li>Integrate sin<sup>m</sup>x cos<sup>n</sup>x when a power is odd.</li><li>Use half-angle (power-reduction) identities when both powers are even.</li><li>Decompose a proper rational function with distinct linear factors.</li><li>Integrate the resulting pieces.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Powers of sine and cosine</span>Odd power of sin: keep one sin x, convert the rest with sin<sup>2</sup>x = 1 − cos<sup>2</sup>x, put u = cos x.<br>Odd power of cos: keep one cos x, convert with cos<sup>2</sup>x = 1 − sin<sup>2</sup>x, put u = sin x.<br>Both even: cos<sup>2</sup>x = (1 + cos 2x)/2,  sin<sup>2</sup>x = (1 − cos 2x)/2.</div>
<p><strong>Partial fractions.</strong> If P(x)/Q(x) is <em>proper</em> (deg P &lt; deg Q) and Q factors into distinct linear factors, then</p>
<div class="formula"><span class="lbl">Distinct linear factors</span>P(x)/[(x − a)(x − b)] = A/(x − a) + B/(x − b)    and    ∫ A/(x − a) dx = A ln|x − a| + C</div>
<p>Find A and B by multiplying through by the denominator and substituting the roots (the “cover-up” method). If the fraction is improper, first do polynomial long division.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — odd power.</b> ∫ sin<sup>3</sup>x dx = ∫ (1 − cos<sup>2</sup>x) sin x dx. u = cos x, du = −sin x dx ⇒ −∫ (1 − u<sup>2</sup>) du = −u + u<sup>3</sup>/3 = <b>−cos x + cos<sup>3</sup>x/3 + C</b>.</p></div>
<div class="callout"><p><b>Example 2 — even power.</b> ∫ cos<sup>2</sup>x dx = ∫ (1 + cos 2x)/2 dx = <b>x/2 + sin(2x)/4 + C</b>. Hence ∫<sub>0</sub><sup>π</sup> cos<sup>2</sup>x dx = <b>π/2</b>.</p></div>
<div class="callout"><p><b>Example 3 — partial fractions.</b> ∫ (5x + 1)/[(x − 1)(x + 2)] dx.</p><p>5x + 1 = A(x + 2) + B(x − 1). x = 1: 6 = 3A ⇒ A = 2. x = −2: −9 = −3B ⇒ B = 3. So the integral is ∫ [2/(x − 1) + 3/(x + 2)] dx = <b>2 ln|x − 1| + 3 ln|x + 2| + C</b>.</p></div>
<div class="callout"><p><b>Example 4 — definite.</b> 1/(x<sup>2</sup> − 1) = (1/2)[1/(x − 1) − 1/(x + 1)], so ∫<sub>2</sub><sup>3</sup> dx/(x<sup>2</sup> − 1) = (1/2)[ln|(x − 1)/(x + 1)|]<sub>2</sub><sup>3</sup> = (1/2)(ln(1/2) − ln(1/3)) = <b>(1/2) ln(3/2) ≈ 0.2027</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing ∫ sin<sup>2</sup>x dx = sin<sup>3</sup>x/3 — the power rule needs the derivative cos x as a factor.</li><li>Applying partial fractions to an improper fraction without dividing first.</li><li>Sign errors with ∫ 1/(x + 2) = ln|x + 2| (not −ln).</li><li>Forgetting absolute values inside ln.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Odd power: save one factor, convert the rest, substitute.</li><li>Even powers: power-reduction identities.</li><li>Proper rational function with distinct linear factors ⇒ A/(x − a) + B/(x − b).</li><li>Each piece integrates to a logarithm.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-2/pages/3-2-trigonometric-integrals" target="_blank" rel="noopener">OpenStax Vol. 2 — 3.2 Trigonometric Integrals</a></li><li><a href="https://openstax.org/books/calculus-volume-2/pages/3-4-partial-fractions" target="_blank" rel="noopener">OpenStax Vol. 2 — 3.4 Partial Fractions</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcII/IntegralsWithTrig.aspx" target="_blank" rel="noopener">Paul's Online Notes — Integrals Involving Trig Functions</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcII/PartialFractions.aspx" target="_blank" rel="noopener">Paul's Online Notes — Partial Fractions</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>∫ sin<sup>2</sup>x dx.</li><li>∫ dx/[x(x + 1)].</li><li>∫ sin x cos x dx.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) x/2 − sin(2x)/4 + C. 2) 1/x − 1/(x + 1) ⇒ ln|x| − ln|x + 1| + C. 3) u = sin x ⇒ sin<sup>2</sup>x/2 + C (equivalently −cos(2x)/4 + C — answers can differ by a constant).</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 8 · Bài 8.3</span>
<h2>Tích phân lượng giác và phân thức hữu tỉ</h2>
<p class="lead">Thêm hai công cụ chuẩn. Đẳng thức lượng giác biến luỹ thừa của sin, cos thành thứ đổi biến được; phân tích phân thức tách một hàm hữu tỉ thành các mảnh đơn giản cho ra logarit.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính ∫ sin<sup>m</sup>x cos<sup>n</sup>x khi có một số mũ lẻ.</li><li>Dùng công thức hạ bậc khi cả hai số mũ chẵn.</li><li>Phân tích phân thức thực sự có nhân tử bậc nhất phân biệt.</li><li>Lấy tích phân các mảnh nhận được.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Luỹ thừa sin và cos</span>sin bậc lẻ: giữ một sin x, đổi phần còn lại bằng sin<sup>2</sup>x = 1 − cos<sup>2</sup>x, đặt u = cos x.<br>cos bậc lẻ: giữ một cos x, đổi bằng cos<sup>2</sup>x = 1 − sin<sup>2</sup>x, đặt u = sin x.<br>Cả hai bậc chẵn: cos<sup>2</sup>x = (1 + cos 2x)/2,  sin<sup>2</sup>x = (1 − cos 2x)/2.</div>
<p><strong>Phân thức đơn giản.</strong> Nếu P(x)/Q(x) là phân thức <em>thực sự</em> (bậc P &lt; bậc Q) và Q phân tích thành các nhân tử bậc nhất phân biệt thì</p>
<div class="formula"><span class="lbl">Nhân tử bậc nhất phân biệt</span>P(x)/[(x − a)(x − b)] = A/(x − a) + B/(x − b)    và    ∫ A/(x − a) dx = A ln|x − a| + C</div>
<p>Tìm A, B bằng cách nhân hai vế với mẫu rồi thế các nghiệm (phương pháp “che”). Nếu phân thức không thực sự, chia đa thức trước.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — bậc lẻ.</b> ∫ sin<sup>3</sup>x dx = ∫ (1 − cos<sup>2</sup>x) sin x dx. u = cos x, du = −sin x dx ⇒ −∫ (1 − u<sup>2</sup>) du = −u + u<sup>3</sup>/3 = <b>−cos x + cos<sup>3</sup>x/3 + C</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — bậc chẵn.</b> ∫ cos<sup>2</sup>x dx = ∫ (1 + cos 2x)/2 dx = <b>x/2 + sin(2x)/4 + C</b>. Do đó ∫<sub>0</sub><sup>π</sup> cos<sup>2</sup>x dx = <b>π/2</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — phân thức.</b> ∫ (5x + 1)/[(x − 1)(x + 2)] dx.</p><p>5x + 1 = A(x + 2) + B(x − 1). x = 1: 6 = 3A ⇒ A = 2. x = −2: −9 = −3B ⇒ B = 3. Vậy tích phân là ∫ [2/(x − 1) + 3/(x + 2)] dx = <b>2 ln|x − 1| + 3 ln|x + 2| + C</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4 — xác định.</b> 1/(x<sup>2</sup> − 1) = (1/2)[1/(x − 1) − 1/(x + 1)], nên ∫<sub>2</sub><sup>3</sup> dx/(x<sup>2</sup> − 1) = (1/2)[ln|(x − 1)/(x + 1)|]<sub>2</sub><sup>3</sup> = (1/2)(ln(1/2) − ln(1/3)) = <b>(1/2) ln(3/2) ≈ 0,2027</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết ∫ sin<sup>2</sup>x dx = sin<sup>3</sup>x/3 — quy tắc luỹ thừa cần thừa số đạo hàm cos x.</li><li>Phân tích phân thức không thực sự mà không chia trước.</li><li>Sai dấu: ∫ 1/(x + 2) = ln|x + 2| (không phải −ln).</li><li>Quên trị tuyệt đối trong ln.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Bậc lẻ: giữ một thừa số, đổi phần còn lại, đổi biến.</li><li>Bậc chẵn: công thức hạ bậc.</li><li>Phân thức thực sự, nhân tử bậc nhất phân biệt ⇒ A/(x − a) + B/(x − b).</li><li>Mỗi mảnh cho một logarit.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-2/pages/3-2-trigonometric-integrals" target="_blank" rel="noopener">OpenStax Vol. 2 — 3.2 Tích phân lượng giác</a></li><li><a href="https://openstax.org/books/calculus-volume-2/pages/3-4-partial-fractions" target="_blank" rel="noopener">OpenStax Vol. 2 — 3.4 Phân thức đơn giản</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcII/IntegralsWithTrig.aspx" target="_blank" rel="noopener">Paul's Online Notes — Tích phân chứa hàm lượng giác</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcII/PartialFractions.aspx" target="_blank" rel="noopener">Paul's Online Notes — Phân thức đơn giản</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>∫ sin<sup>2</sup>x dx.</li><li>∫ dx/[x(x + 1)].</li><li>∫ sin x cos x dx.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) x/2 − sin(2x)/4 + C. 2) 1/x − 1/(x + 1) ⇒ ln|x| − ln|x + 1| + C. 3) u = sin x ⇒ sin<sup>2</sup>x/2 + C (tương đương −cos(2x)/4 + C — hai đáp số có thể khác nhau một hằng số).</p></div>`);

const q8 = QZ(8, 'Quiz — Chapter 8: Techniques of integration|||Quiz — Chương 8: Kỹ thuật tính tích phân', 'Kiểm tra chương 8: đổi biến, từng phần, tích phân lượng giác, phân thức hữu tỉ.', [
  Q('q1', '∫ 2x(x² + 1)⁵ dx =|||∫ 2x(x² + 1)⁵ dx =',
    ['(x² + 1)⁶/6 + C|||(x² + 1)⁶/6 + C', '(x² + 1)⁶/3 + C|||(x² + 1)⁶/3 + C', 'x²(x² + 1)⁶/6 + C|||x²(x² + 1)⁶/6 + C', '10x(x² + 1)⁴ + C|||10x(x² + 1)⁴ + C'], 0,
    'u = x² + 1, du = 2x dx ⇒ ∫u⁵du.|||u = x² + 1, du = 2x dx ⇒ ∫u⁵du.'),
  Q('q2', '∫ x/(x² + 4) dx =|||∫ x/(x² + 4) dx =',
    ['ln(x² + 4) + C|||ln(x² + 4) + C', '(1/2) ln(x² + 4) + C|||(1/2) ln(x² + 4) + C', '2 ln(x² + 4) + C|||2 ln(x² + 4) + C', '(1/2) arctan(x/2) + C|||(1/2) arctan(x/2) + C'], 1,
    'u = x² + 4, x dx = du/2.|||u = x² + 4, x dx = du/2.'),
  Q('q3', '∫₀¹ x(1 + x²)³ dx =|||∫₀¹ x(1 + x²)³ dx =',
    ['15/8|||15/8', '15/4|||15/4', '1/8|||1/8', '2|||2'], 0,
    'u = 1 + x² from 1 to 2: (1/2)(16 − 1)/4.|||u = 1 + x² từ 1 đến 2: (1/2)(16 − 1)/4.'),
  Q('q4', '∫ tan x dx =|||∫ tan x dx =',
    ['sec² x + C|||sec² x + C', '−ln|cos x| + C|||−ln|cos x| + C', 'ln|cos x| + C|||ln|cos x| + C', 'tan² x/2 + C|||tan² x/2 + C'], 1,
    'tan x = sin x/cos x, u = cos x, du = −sin x dx.|||tan x = sin x/cos x, u = cos x, du = −sin x dx.'),
  Q('q5', 'In ∫ x eˣ dx by parts, the best choice is|||Với ∫ x eˣ dx từng phần, chọn tốt nhất là',
    ['u = eˣ, dv = x dx|||u = eˣ, dv = x dx', 'u = x, dv = eˣ dx|||u = x, dv = eˣ dx', 'u = x eˣ, dv = dx|||u = x eˣ, dv = dx', 'by parts does not apply|||không dùng từng phần được'], 1,
    'LIATE: algebraic before exponential; result (x − 1)eˣ + C.|||LIATE: đại số trước mũ; kết quả (x − 1)eˣ + C.'),
  Q('q6', '∫ ln x dx =|||∫ ln x dx =',
    ['1/x + C|||1/x + C', 'x ln x − x + C|||x ln x − x + C', 'x ln x + C|||x ln x + C', '(ln x)²/2 + C|||(ln x)²/2 + C'], 1,
    'u = ln x, dv = dx: x ln x − ∫1 dx.|||u = ln x, dv = dx: x ln x − ∫1 dx.'),
  Q('q7', '∫₀^π x sin x dx =|||∫₀^π x sin x dx =',
    ['0|||0', '1|||1', 'π|||π', '2π|||2π'], 2,
    '[−x cos x + sin x] from 0 to π = π.|||[−x cos x + sin x] từ 0 đến π = π.'),
  Q('q8', '∫₀^π cos² x dx =|||∫₀^π cos² x dx =',
    ['0|||0', 'π/2|||π/2', 'π|||π', '1|||1'], 1,
    'cos²x = (1 + cos 2x)/2 ⇒ [x/2 + sin 2x/4] from 0 to π = π/2.|||cos²x = (1 + cos 2x)/2 ⇒ [x/2 + sin 2x/4] từ 0 đến π = π/2.'),
  Q('q9', '(5x + 1)/[(x − 1)(x + 2)] = A/(x − 1) + B/(x + 2) with|||(5x + 1)/[(x − 1)(x + 2)] = A/(x − 1) + B/(x + 2) với',
    ['A = 2, B = 3|||A = 2, B = 3', 'A = 3, B = 2|||A = 3, B = 2', 'A = 1, B = 4|||A = 1, B = 4', 'A = −2, B = 7|||A = −2, B = 7'], 0,
    'x = 1: 6 = 3A; x = −2: −9 = −3B.|||x = 1: 6 = 3A; x = −2: −9 = −3B.'),
  Q('q10', '∫ sin³ x dx =|||∫ sin³ x dx =',
    ['sin⁴x/4 + C|||sin⁴x/4 + C', '−cos x + cos³x/3 + C|||−cos x + cos³x/3 + C', 'cos x − cos³x/3 + C|||cos x − cos³x/3 + C', '3sin² x cos x + C|||3sin² x cos x + C'], 1,
    'sin³x = (1 − cos²x) sin x, u = cos x.|||sin³x = (1 − cos²x) sin x, u = cos x.'),
]);

const ch8 = {
  title: 'Chapter 8 — Techniques of integration|||Chương 8 — Kỹ thuật tính tích phân',
  description: 'Đổi biến (bất định và xác định), tích phân từng phần, tích phân lượng giác, phân thức hữu tỉ (Stewart 5.5, 7.1–7.4 · OpenStax Vol.1 5.5–5.6, Vol.2 3.1–3.4).',
  lessons: [c81, c82, c83, q8],
};

// ───────────────────────────── Chương 9 — Ứng dụng của tích phân ─────────────────────────────
const c91 = L('cal111-ts-9-1',
  '9.1 — Areas between curves|||9.1 — Diện tích giữa các đường cong',
  'Diện tích giữa hai đồ thị ∫(trên − dưới)dx, tìm giao điểm làm cận, đường cong cắt nhau (tách khoảng), lấy tích phân theo y (phải − trái).',
  `<span class="eyebrow">CAL111 · Chapter 9 · Lesson 9.1</span>
<h2>Areas between curves</h2>
<p class="lead">The first application of the integral: the area of a region bounded by two curves. Slice the region into thin vertical strips, each of height “top − bottom”, and add them up.</p>
<h3>🎯 Objectives</h3>
<ul><li>Set up ∫(top − bottom) dx for the area between two graphs.</li><li>Find the limits from intersection points.</li><li>Split the integral where the curves cross.</li><li>Integrate with respect to y when that is simpler.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Area between curves</span>A = ∫<sub>a</sub><sup>b</sup> [f(x) − g(x)] dx  when f(x) ≥ g(x) on [a, b]        In general A = ∫<sub>a</sub><sup>b</sup> |f(x) − g(x)| dx</div>
<p><strong>Method.</strong> (1) Sketch both curves. (2) Solve f(x) = g(x) for the intersection points. (3) On each interval decide which curve is on top. (4) Integrate top minus bottom on each interval and add.</p>
<div class="formula"><span class="lbl">Horizontal strips</span>A = ∫<sub>c</sub><sup>d</sup> [x<sub>right</sub>(y) − x<sub>left</sub>(y)] dy    (useful when the region is bounded by x = h(y))</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> Region between y = x + 2 and y = x<sup>2</sup>.</p><p>Intersections: x<sup>2</sup> = x + 2 ⇒ (x − 2)(x + 1) = 0 ⇒ x = −1, 2. On [−1, 2] the line is on top (test x = 0: 2 &gt; 0). A = ∫<sub>−1</sub><sup>2</sup> (x + 2 − x<sup>2</sup>) dx = [x<sup>2</sup>/2 + 2x − x<sup>3</sup>/3]<sub>−1</sub><sup>2</sup> = (2 + 4 − 8/3) − (1/2 − 2 + 1/3) = <b>9/2</b>.</p></div>
<div class="callout"><p><b>Example 2.</b> Between y = √x and y = x<sup>2</sup>: they meet at x = 0, 1; √x is on top. A = ∫<sub>0</sub><sup>1</sup> (√x − x<sup>2</sup>) dx = 2/3 − 1/3 = <b>1/3</b>.</p></div>
<div class="callout"><p><b>Example 3 — curves that cross.</b> Area between y = sin x and y = cos x on [0, π/2]. They cross at π/4: cos x is on top on [0, π/4], sin x on [π/4, π/2]. By symmetry A = 2∫<sub>0</sub><sup>π/4</sup> (cos x − sin x) dx = 2(√2 − 1) ≈ <b>0.828</b>.</p></div>
<div class="callout"><p><b>Example 4 — with respect to y.</b> Region between x = y<sup>2</sup> and x = y + 2: they meet at y = −1, 2; the line is to the right. A = ∫<sub>−1</sub><sup>2</sup> (y + 2 − y<sup>2</sup>) dy = <b>9/2</b> (the same region as Example 1 reflected in y = x).</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Integrating “bottom − top” and getting a negative area.</li><li>Not splitting at crossing points: ∫<sub>−1</sub><sup>1</sup> (x − x<sup>3</sup>) dx = 0, but the area is 1/2.</li><li>Guessing the limits instead of solving f = g.</li><li>Mixing dx and dy in one setup.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Area = ∫ (top − bottom) dx.</li><li>Limits = intersection points.</li><li>Split where the curves cross.</li><li>Horizontal strips: ∫ (right − left) dy.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/6-1-areas-between-curves" target="_blank" rel="noopener">OpenStax — 6.1 Areas between Curves</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/AreaBetweenCurves.aspx" target="_blank" rel="noopener">Paul's Online Notes — Area Between Curves</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-3-the-definite-integral-and-its-applications/part-b-second-fundamental-theorem-areas-volumes/" target="_blank" rel="noopener">MIT 18.01SC — Second Fundamental Theorem, Areas, Volumes</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Area between y = x<sup>3</sup> and y = x on [0, 1].</li><li>Total area between y = x<sup>3</sup> and y = x on [−1, 1].</li><li>Area between y = 4 − x<sup>2</sup> and the x-axis.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) ∫<sub>0</sub><sup>1</sup> (x − x<sup>3</sup>) dx = 1/2 − 1/4 = 1/4. 2) By symmetry 2·(1/4) = 1/2. 3) ∫<sub>−2</sub><sup>2</sup> (4 − x<sup>2</sup>) dx = 16 − 16/3 = 32/3.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 9 · Bài 9.1</span>
<h2>Diện tích giữa các đường cong</h2>
<p class="lead">Ứng dụng đầu tiên của tích phân: diện tích miền giới hạn bởi hai đường cong. Cắt miền thành các dải đứng mỏng, mỗi dải cao “trên − dưới”, rồi cộng lại.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Lập ∫(trên − dưới) dx cho diện tích giữa hai đồ thị.</li><li>Tìm cận từ giao điểm.</li><li>Tách tích phân tại nơi hai đường cắt nhau.</li><li>Lấy tích phân theo y khi đơn giản hơn.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Diện tích giữa hai đường cong</span>A = ∫<sub>a</sub><sup>b</sup> [f(x) − g(x)] dx  khi f(x) ≥ g(x) trên [a, b]        Tổng quát A = ∫<sub>a</sub><sup>b</sup> |f(x) − g(x)| dx</div>
<p><strong>Cách làm.</strong> (1) Phác hai đường. (2) Giải f(x) = g(x) tìm giao điểm. (3) Trên mỗi khoảng xác định đường nào ở trên. (4) Tích phân trên trừ dưới trên từng khoảng rồi cộng.</p>
<div class="formula"><span class="lbl">Dải nằm ngang</span>A = ∫<sub>c</sub><sup>d</sup> [x<sub>phải</sub>(y) − x<sub>trái</sub>(y)] dy    (hữu ích khi miền giới hạn bởi x = h(y))</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> Miền giữa y = x + 2 và y = x<sup>2</sup>.</p><p>Giao điểm: x<sup>2</sup> = x + 2 ⇒ (x − 2)(x + 1) = 0 ⇒ x = −1, 2. Trên [−1, 2] đường thẳng ở trên (thử x = 0: 2 &gt; 0). A = ∫<sub>−1</sub><sup>2</sup> (x + 2 − x<sup>2</sup>) dx = [x<sup>2</sup>/2 + 2x − x<sup>3</sup>/3]<sub>−1</sub><sup>2</sup> = (2 + 4 − 8/3) − (1/2 − 2 + 1/3) = <b>9/2</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2.</b> Giữa y = √x và y = x<sup>2</sup>: cắt nhau tại x = 0, 1; √x ở trên. A = ∫<sub>0</sub><sup>1</sup> (√x − x<sup>2</sup>) dx = 2/3 − 1/3 = <b>1/3</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — hai đường cắt nhau.</b> Diện tích giữa y = sin x và y = cos x trên [0, π/2]. Chúng cắt tại π/4: cos x ở trên trên [0, π/4], sin x ở trên trên [π/4, π/2]. Do đối xứng A = 2∫<sub>0</sub><sup>π/4</sup> (cos x − sin x) dx = 2(√2 − 1) ≈ <b>0,828</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4 — theo y.</b> Miền giữa x = y<sup>2</sup> và x = y + 2: cắt tại y = −1, 2; đường thẳng ở bên phải. A = ∫<sub>−1</sub><sup>2</sup> (y + 2 − y<sup>2</sup>) dy = <b>9/2</b> (chính miền ở Ví dụ 1 lấy đối xứng qua y = x).</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tích phân “dưới − trên” nên ra diện tích âm.</li><li>Không tách tại giao điểm: ∫<sub>−1</sub><sup>1</sup> (x − x<sup>3</sup>) dx = 0, nhưng diện tích là 1/2.</li><li>Đoán cận thay vì giải f = g.</li><li>Trộn dx và dy trong cùng một biểu thức.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Diện tích = ∫ (trên − dưới) dx.</li><li>Cận = giao điểm.</li><li>Tách tại nơi hai đường cắt nhau.</li><li>Dải ngang: ∫ (phải − trái) dy.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/6-1-areas-between-curves" target="_blank" rel="noopener">OpenStax — 6.1 Diện tích giữa các đường cong</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/AreaBetweenCurves.aspx" target="_blank" rel="noopener">Paul's Online Notes — Diện tích giữa các đường cong</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-3-the-definite-integral-and-its-applications/part-b-second-fundamental-theorem-areas-volumes/" target="_blank" rel="noopener">MIT 18.01SC — Định lý cơ bản thứ hai, diện tích, thể tích</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Diện tích giữa y = x<sup>3</sup> và y = x trên [0, 1].</li><li>Tổng diện tích giữa y = x<sup>3</sup> và y = x trên [−1, 1].</li><li>Diện tích giữa y = 4 − x<sup>2</sup> và trục hoành.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) ∫<sub>0</sub><sup>1</sup> (x − x<sup>3</sup>) dx = 1/2 − 1/4 = 1/4. 2) Đối xứng: 2·(1/4) = 1/2. 3) ∫<sub>−2</sub><sup>2</sup> (4 − x<sup>2</sup>) dx = 16 − 16/3 = 32/3.</p></div>`);

const c92 = L('cal111-ts-9-2',
  '9.2 — Volumes by slicing: disks and washers|||9.2 — Thể tích bằng lát cắt: phương pháp đĩa và vành khăn',
  'Thể tích V = ∫A(x)dx, vật thể tròn xoay quanh trục hoành: đĩa π∫R², vành khăn π∫(R² − r²); chứng minh công thức hình cầu, hình nón.',
  `<span class="eyebrow">CAL111 · Chapter 9 · Lesson 9.2</span>
<h2>Volumes by slicing: disks and washers</h2>
<p class="lead">If you know the area of every cross-section of a solid, integrating those areas gives its volume. For solids of revolution — vases, bottles, engine parts turned on a lathe — the cross-sections are disks or washers.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write volume as ∫ A(x) dx.</li><li>Use the disk method for a region rotated about an axis.</li><li>Use the washer method when there is a hole.</li><li>Derive the sphere and cone volume formulas.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Volume by slicing</span>V = ∫<sub>a</sub><sup>b</sup> A(x) dx,  A(x) = area of the cross-section at x</div>
<div class="formula"><span class="lbl">Rotation about the x-axis</span>Disk:  V = π∫<sub>a</sub><sup>b</sup> [R(x)]<sup>2</sup> dx        Washer:  V = π∫<sub>a</sub><sup>b</sup> ([R(x)]<sup>2</sup> − [r(x)]<sup>2</sup>) dx<br>R = outer radius (distance from the axis to the far curve), r = inner radius (to the near curve)</div>
<p>For rotation about the y-axis, use the same formulas with y as the variable: radii are functions of y and you integrate dy.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — disk.</b> Rotate the region under y = √x, 0 ≤ x ≤ 4, about the x-axis. R = √x ⇒ V = π∫<sub>0</sub><sup>4</sup> x dx = π·8 = <b>8π</b>.</p></div>
<div class="callout"><p><b>Example 2 — sphere.</b> Rotate the upper half of x<sup>2</sup> + y<sup>2</sup> = r<sup>2</sup> about the x-axis: R = √(r<sup>2</sup> − x<sup>2</sup>). V = π∫<sub>−r</sub><sup>r</sup> (r<sup>2</sup> − x<sup>2</sup>) dx = π[r<sup>2</sup>x − x<sup>3</sup>/3]<sub>−r</sub><sup>r</sup> = π(4r<sup>3</sup>/3) = <b>(4/3)πr<sup>3</sup></b>.</p></div>
<div class="callout"><p><b>Example 3 — cone.</b> Rotate y = (r/h)x, 0 ≤ x ≤ h: V = π∫<sub>0</sub><sup>h</sup> (r<sup>2</sup>/h<sup>2</sup>)x<sup>2</sup> dx = π(r<sup>2</sup>/h<sup>2</sup>)(h<sup>3</sup>/3) = <b>(1/3)πr<sup>2</sup>h</b>.</p></div>
<div class="callout"><p><b>Example 4 — washer.</b> Rotate the region between y = x and y = x<sup>2</sup> (0 ≤ x ≤ 1) about the x-axis. Outer R = x, inner r = x<sup>2</sup>. V = π∫<sub>0</sub><sup>1</sup> (x<sup>2</sup> − x<sup>4</sup>) dx = π(1/3 − 1/5) = <b>2π/15</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing π∫(R − r)<sup>2</sup> instead of π∫(R<sup>2</sup> − r<sup>2</sup>).</li><li>Swapping outer and inner radii (negative volume).</li><li>Forgetting π.</li><li>Rotating about a line other than an axis (e.g. y = −1) without shifting the radii: R becomes f(x) + 1.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>V = ∫ A(x) dx.</li><li>Disk: π∫R<sup>2</sup>; washer: π∫(R<sup>2</sup> − r<sup>2</sup>).</li><li>Radii are distances to the axis of rotation.</li><li>Sphere (4/3)πr<sup>3</sup> and cone (1/3)πr<sup>2</sup>h follow directly.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/6-2-determining-volumes-by-slicing" target="_blank" rel="noopener">OpenStax — 6.2 Determining Volumes by Slicing</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/VolumeWithRings.aspx" target="_blank" rel="noopener">Paul's Online Notes — Volumes of Solids of Revolution / Method of Rings</a></li><li><a href="https://www.geogebra.org/calculator" target="_blank" rel="noopener">GeoGebra Calculator Suite — visualise solids of revolution in 3D</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Rotate the region under y = x<sup>2</sup>, 0 ≤ x ≤ 2, about the x-axis.</li><li>Rotate the region under y = 1/x, 1 ≤ x ≤ 3, about the x-axis.</li><li>Set up (do not evaluate) the volume when the region of Example 4 is rotated about y = −1.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) π∫<sub>0</sub><sup>2</sup> x<sup>4</sup> dx = 32π/5. 2) π∫<sub>1</sub><sup>3</sup> x<sup>−2</sup> dx = π(1 − 1/3) = 2π/3. 3) R = x + 1, r = x<sup>2</sup> + 1: V = π∫<sub>0</sub><sup>1</sup> [(x + 1)<sup>2</sup> − (x<sup>2</sup> + 1)<sup>2</sup>] dx.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 9 · Bài 9.2</span>
<h2>Thể tích bằng lát cắt: đĩa và vành khăn</h2>
<p class="lead">Nếu biết diện tích mọi thiết diện của một vật thể, lấy tích phân các diện tích đó là ra thể tích. Với vật thể tròn xoay — bình hoa, chai lọ, chi tiết máy tiện — thiết diện là hình đĩa hoặc vành khăn.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết thể tích dạng ∫ A(x) dx.</li><li>Dùng phương pháp đĩa khi quay một miền quanh trục.</li><li>Dùng phương pháp vành khăn khi có lỗ rỗng.</li><li>Chứng minh công thức thể tích hình cầu, hình nón.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Thể tích bằng lát cắt</span>V = ∫<sub>a</sub><sup>b</sup> A(x) dx,  A(x) = diện tích thiết diện tại x</div>
<div class="formula"><span class="lbl">Quay quanh trục hoành</span>Đĩa:  V = π∫<sub>a</sub><sup>b</sup> [R(x)]<sup>2</sup> dx        Vành khăn:  V = π∫<sub>a</sub><sup>b</sup> ([R(x)]<sup>2</sup> − [r(x)]<sup>2</sup>) dx<br>R = bán kính ngoài (khoảng cách từ trục tới đường xa), r = bán kính trong (tới đường gần)</div>
<p>Quay quanh trục tung thì dùng cùng công thức với biến y: bán kính là hàm của y và tích phân theo dy.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — đĩa.</b> Quay miền dưới y = √x, 0 ≤ x ≤ 4, quanh trục hoành. R = √x ⇒ V = π∫<sub>0</sub><sup>4</sup> x dx = π·8 = <b>8π</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — hình cầu.</b> Quay nửa trên của x<sup>2</sup> + y<sup>2</sup> = r<sup>2</sup> quanh trục hoành: R = √(r<sup>2</sup> − x<sup>2</sup>). V = π∫<sub>−r</sub><sup>r</sup> (r<sup>2</sup> − x<sup>2</sup>) dx = π[r<sup>2</sup>x − x<sup>3</sup>/3]<sub>−r</sub><sup>r</sup> = π(4r<sup>3</sup>/3) = <b>(4/3)πr<sup>3</sup></b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — hình nón.</b> Quay y = (r/h)x, 0 ≤ x ≤ h: V = π∫<sub>0</sub><sup>h</sup> (r<sup>2</sup>/h<sup>2</sup>)x<sup>2</sup> dx = π(r<sup>2</sup>/h<sup>2</sup>)(h<sup>3</sup>/3) = <b>(1/3)πr<sup>2</sup>h</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4 — vành khăn.</b> Quay miền giữa y = x và y = x<sup>2</sup> (0 ≤ x ≤ 1) quanh trục hoành. Ngoài R = x, trong r = x<sup>2</sup>. V = π∫<sub>0</sub><sup>1</sup> (x<sup>2</sup> − x<sup>4</sup>) dx = π(1/3 − 1/5) = <b>2π/15</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết π∫(R − r)<sup>2</sup> thay vì π∫(R<sup>2</sup> − r<sup>2</sup>).</li><li>Đảo bán kính ngoài và trong (thể tích âm).</li><li>Quên π.</li><li>Quay quanh đường khác trục (vd y = −1) mà không dời bán kính: R trở thành f(x) + 1.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>V = ∫ A(x) dx.</li><li>Đĩa: π∫R<sup>2</sup>; vành khăn: π∫(R<sup>2</sup> − r<sup>2</sup>).</li><li>Bán kính là khoảng cách tới trục quay.</li><li>Hình cầu (4/3)πr<sup>3</sup> và hình nón (1/3)πr<sup>2</sup>h suy ra trực tiếp.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/6-2-determining-volumes-by-slicing" target="_blank" rel="noopener">OpenStax — 6.2 Thể tích bằng lát cắt</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/VolumeWithRings.aspx" target="_blank" rel="noopener">Paul's Online Notes — Thể tích tròn xoay, phương pháp vành</a></li><li><a href="https://www.geogebra.org/calculator" target="_blank" rel="noopener">GeoGebra Calculator Suite — xem vật thể tròn xoay 3D</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Quay miền dưới y = x<sup>2</sup>, 0 ≤ x ≤ 2, quanh trục hoành.</li><li>Quay miền dưới y = 1/x, 1 ≤ x ≤ 3, quanh trục hoành.</li><li>Lập (không tính) thể tích khi quay miền ở Ví dụ 4 quanh đường y = −1.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) π∫<sub>0</sub><sup>2</sup> x<sup>4</sup> dx = 32π/5. 2) π∫<sub>1</sub><sup>3</sup> x<sup>−2</sup> dx = π(1 − 1/3) = 2π/3. 3) R = x + 1, r = x<sup>2</sup> + 1: V = π∫<sub>0</sub><sup>1</sup> [(x + 1)<sup>2</sup> − (x<sup>2</sup> + 1)<sup>2</sup>] dx.</p></div>`);

const c93 = L('cal111-ts-9-3',
  '9.3 — Volumes by cylindrical shells|||9.3 — Thể tích bằng phương pháp vỏ trụ',
  'Công thức vỏ trụ V = 2π∫(bán kính)(chiều cao)dx khi quay quanh trục tung, khi nào dùng vỏ trụ thay đĩa, so sánh hai phương pháp trên cùng một vật thể.',
  `<span class="eyebrow">CAL111 · Chapter 9 · Lesson 9.3</span>
<h2>Volumes by cylindrical shells</h2>
<p class="lead">Rotating y = x<sup>2</sup> about the <em>y</em>-axis with disks forces you to solve for x in terms of y. Cylindrical shells avoid that: slice parallel to the axis of rotation, and each strip sweeps out a thin tube.</p>
<h3>🎯 Objectives</h3>
<ul><li>Derive the shell formula from the volume of a thin tube.</li><li>Identify the radius and height of a typical shell.</li><li>Choose between shells and washers.</li><li>Check an answer by computing a volume two ways.</li></ul>
<h3>📖 Lecture</h3>
<p>A thin vertical strip at position x, of height h(x) and width dx, rotated about the y-axis sweeps a shell with circumference 2πx. Unrolled it is almost a flat slab: volume ≈ 2πx·h(x)·dx.</p>
<div class="formula"><span class="lbl">Shell method (rotation about the y-axis)</span>V = 2π∫<sub>a</sub><sup>b</sup> x · h(x) dx        (radius x, height h(x) = top − bottom, 0 ≤ a &lt; b)</div>
<p>About a vertical line x = k, the radius becomes |x − k|. About the x-axis, shells use horizontal strips: V = 2π∫ y·w(y) dy.</p>
<div class="formula"><span class="lbl">Choosing a method</span>Strips perpendicular to the axis ⇒ disks/washers    Strips parallel to the axis ⇒ shells<br>Pick the one whose integrand is easier (no need to invert functions).</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> Rotate the region under y = x<sup>2</sup>, 0 ≤ x ≤ 2, about the y-axis. Radius x, height x<sup>2</sup>: V = 2π∫<sub>0</sub><sup>2</sup> x·x<sup>2</sup> dx = 2π·[x<sup>4</sup>/4]<sub>0</sub><sup>2</sup> = <b>8π</b>.</p><p>Check with washers in y (0 ≤ y ≤ 4): outer radius 2, inner radius √y: π∫<sub>0</sub><sup>4</sup> (4 − y) dy = π(16 − 8) = 8π ✓.</p></div>
<div class="callout"><p><b>Example 2.</b> Region between y = x and y = x<sup>2</sup> about the y-axis: height x − x<sup>2</sup>. V = 2π∫<sub>0</sub><sup>1</sup> x(x − x<sup>2</sup>) dx = 2π(1/3 − 1/4) = <b>π/6</b>.</p></div>
<div class="callout"><p><b>Example 3 — shells are the only easy way.</b> Region under y = sin x, 0 ≤ x ≤ π, about the y-axis. V = 2π∫<sub>0</sub><sup>π</sup> x sin x dx = 2π·π = <b>2π<sup>2</sup></b> (integration by parts, Lesson 8.2). With washers you would need arcsin — much harder.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using the height as the radius (or the reverse).</li><li>Forgetting the factor 2π.</li><li>Rotating about x = k but keeping radius x instead of |x − k|.</li><li>Using shells with strips perpendicular to the axis.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Shell: V = 2π∫ (radius)(height) dx.</li><li>Strips parallel to the axis of rotation.</li><li>Avoids inverting functions.</li><li>Computing a volume two ways is a strong self-check.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/6-3-volumes-of-revolution-cylindrical-shells" target="_blank" rel="noopener">OpenStax — 6.3 Volumes of Revolution: Cylindrical Shells</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/VolumeWithCylinder.aspx" target="_blank" rel="noopener">Paul's Online Notes — Volumes of Solids of Revolution / Method of Cylinders</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Rotate the region under y = √x, 0 ≤ x ≤ 4, about the y-axis.</li><li>Rotate the region under y = 4 − x<sup>2</sup>, 0 ≤ x ≤ 2, about the y-axis.</li><li>Which method is easier for rotating the region under y = e<sup>−x²</sup>, 0 ≤ x ≤ 1, about the y-axis? Compute it.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 2π∫<sub>0</sub><sup>4</sup> x<sup>3/2</sup> dx = 2π·(2/5)·32 = 128π/5. 2) 2π∫<sub>0</sub><sup>2</sup> x(4 − x<sup>2</sup>) dx = 2π(8 − 4) = 8π. 3) Shells: 2π∫<sub>0</sub><sup>1</sup> x e<sup>−x²</sup> dx; u = −x<sup>2</sup> gives π(1 − e<sup>−1</sup>) ≈ 1.986.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 9 · Bài 9.3</span>
<h2>Thể tích bằng vỏ trụ</h2>
<p class="lead">Quay y = x<sup>2</sup> quanh trục <em>tung</em> bằng phương pháp đĩa buộc bạn giải x theo y. Phương pháp vỏ trụ tránh được điều đó: cắt dải song song với trục quay, mỗi dải quét thành một ống mỏng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Suy ra công thức vỏ trụ từ thể tích một ống mỏng.</li><li>Xác định bán kính và chiều cao của vỏ điển hình.</li><li>Chọn giữa vỏ trụ và vành khăn.</li><li>Kiểm đáp số bằng cách tính thể tích theo hai cách.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Một dải đứng mỏng tại vị trí x, cao h(x), rộng dx, quay quanh trục tung quét thành một vỏ có chu vi 2πx. Trải phẳng ra gần như một tấm mỏng: thể tích ≈ 2πx·h(x)·dx.</p>
<div class="formula"><span class="lbl">Phương pháp vỏ trụ (quay quanh trục tung)</span>V = 2π∫<sub>a</sub><sup>b</sup> x · h(x) dx        (bán kính x, chiều cao h(x) = trên − dưới, 0 ≤ a &lt; b)</div>
<p>Quay quanh đường thẳng đứng x = k thì bán kính thành |x − k|. Quay quanh trục hoành, vỏ trụ dùng dải ngang: V = 2π∫ y·w(y) dy.</p>
<div class="formula"><span class="lbl">Chọn phương pháp</span>Dải vuông góc với trục ⇒ đĩa/vành khăn    Dải song song với trục ⇒ vỏ trụ<br>Chọn cách có biểu thức dưới dấu tích phân dễ hơn (không phải tìm hàm ngược).</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> Quay miền dưới y = x<sup>2</sup>, 0 ≤ x ≤ 2, quanh trục tung. Bán kính x, chiều cao x<sup>2</sup>: V = 2π∫<sub>0</sub><sup>2</sup> x·x<sup>2</sup> dx = 2π·[x<sup>4</sup>/4]<sub>0</sub><sup>2</sup> = <b>8π</b>.</p><p>Kiểm bằng vành khăn theo y (0 ≤ y ≤ 4): bán kính ngoài 2, trong √y: π∫<sub>0</sub><sup>4</sup> (4 − y) dy = π(16 − 8) = 8π ✓.</p></div>
<div class="callout"><p><b>Ví dụ 2.</b> Miền giữa y = x và y = x<sup>2</sup> quanh trục tung: chiều cao x − x<sup>2</sup>. V = 2π∫<sub>0</sub><sup>1</sup> x(x − x<sup>2</sup>) dx = 2π(1/3 − 1/4) = <b>π/6</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — chỉ vỏ trụ mới dễ.</b> Miền dưới y = sin x, 0 ≤ x ≤ π, quanh trục tung. V = 2π∫<sub>0</sub><sup>π</sup> x sin x dx = 2π·π = <b>2π<sup>2</sup></b> (tích phân từng phần, Bài 8.2). Dùng vành khăn sẽ cần arcsin — khó hơn nhiều.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Lấy chiều cao làm bán kính (hoặc ngược lại).</li><li>Quên hệ số 2π.</li><li>Quay quanh x = k mà vẫn để bán kính x thay vì |x − k|.</li><li>Dùng vỏ trụ với dải vuông góc với trục.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Vỏ trụ: V = 2π∫ (bán kính)(chiều cao) dx.</li><li>Dải song song với trục quay.</li><li>Tránh phải tìm hàm ngược.</li><li>Tính thể tích theo hai cách là cách tự kiểm mạnh.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/6-3-volumes-of-revolution-cylindrical-shells" target="_blank" rel="noopener">OpenStax — 6.3 Thể tích tròn xoay: vỏ trụ</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/VolumeWithCylinder.aspx" target="_blank" rel="noopener">Paul's Online Notes — Thể tích tròn xoay, phương pháp trụ</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Quay miền dưới y = √x, 0 ≤ x ≤ 4, quanh trục tung.</li><li>Quay miền dưới y = 4 − x<sup>2</sup>, 0 ≤ x ≤ 2, quanh trục tung.</li><li>Cách nào dễ hơn khi quay miền dưới y = e<sup>−x²</sup>, 0 ≤ x ≤ 1, quanh trục tung? Tính.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 2π∫<sub>0</sub><sup>4</sup> x<sup>3/2</sup> dx = 2π·(2/5)·32 = 128π/5. 2) 2π∫<sub>0</sub><sup>2</sup> x(4 − x<sup>2</sup>) dx = 2π(8 − 4) = 8π. 3) Vỏ trụ: 2π∫<sub>0</sub><sup>1</sup> x e<sup>−x²</sup> dx; đặt u = −x<sup>2</sup> được π(1 − e<sup>−1</sup>) ≈ 1,986.</p></div>`);

const c94 = L('cal111-ts-9-4',
  '9.4 — Arc length and work|||9.4 — Độ dài cung và công cơ học',
  'Độ dài cung L = ∫√(1 + (f′)²)dx, ví dụ tính được chính xác; công W = ∫F(x)dx, định luật Hooke cho lò xo, kéo dây xích/dây cáp.',
  `<span class="eyebrow">CAL111 · Chapter 9 · Lesson 9.4</span>
<h2>Arc length and work</h2>
<p class="lead">The same “slice, approximate, add, take the limit” idea measures the length of a curved cable and the energy needed to stretch a spring or lift a rope. Each problem is a Riemann sum in disguise.</p>
<h3>🎯 Objectives</h3>
<ul><li>Derive and apply the arc length formula.</li><li>Recognise integrands that simplify to a perfect square.</li><li>Compute work done by a variable force.</li><li>Use Hooke's law for springs and the slicing idea for ropes.</li></ul>
<h3>📖 Lecture</h3>
<p>A small piece of curve is almost a straight segment with horizontal run dx and rise dy, so its length is √(dx<sup>2</sup> + dy<sup>2</sup>) = √(1 + (dy/dx)<sup>2</sup>) dx.</p>
<div class="formula"><span class="lbl">Arc length</span>L = ∫<sub>a</sub><sup>b</sup> √(1 + [f′(x)]<sup>2</sup>) dx</div>
<p>Most arc length integrals cannot be done by hand (use numerical integration, Chapter 10); exam problems are designed so that 1 + (f′)<sup>2</sup> becomes a perfect square.</p>
<div class="formula"><span class="lbl">Work by a variable force</span>W = ∫<sub>a</sub><sup>b</sup> F(x) dx  (joules = newton·metres)        Hooke's law: F(x) = kx  (x = stretch beyond natural length)</div>
<p>For lifting a rope or pumping a liquid, slice the object: each thin slice is lifted its own distance, and you integrate (weight of slice) × (distance lifted).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — arc length.</b> y = (2/3)x<sup>3/2</sup>, 0 ≤ x ≤ 3. y′ = x<sup>1/2</sup>, 1 + (y′)<sup>2</sup> = 1 + x. L = ∫<sub>0</sub><sup>3</sup> √(1 + x) dx = [(2/3)(1 + x)<sup>3/2</sup>]<sub>0</sub><sup>3</sup> = (2/3)(8 − 1) = <b>14/3</b>.</p></div>
<div class="callout"><p><b>Example 2 — spring.</b> A force of 40 N stretches a spring 0.1 m. So k = 40/0.1 = 400 N/m. Work to stretch it from natural length to 0.3 m: W = ∫<sub>0</sub><sup>0.3</sup> 400x dx = 200·0.09 = <b>18 J</b>.</p></div>
<div class="callout"><p><b>Example 3 — winding a rope.</b> A 20 m rope weighing 2 N/m hangs from the top of a building. A slice at depth y (thickness dy) weighs 2 dy and is lifted y metres. W = ∫<sub>0</sub><sup>20</sup> 2y dy = [y<sup>2</sup>]<sub>0</sub><sup>20</sup> = <b>400 J</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing √(1 + f′) instead of √(1 + (f′)<sup>2</sup>).</li><li>Measuring x for Hooke's law from the wrong origin (it is the stretch, not the total length).</li><li>Using W = F·d with a variable force.</li><li>Unit errors: cm must become m to get joules.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>L = ∫√(1 + (f′)<sup>2</sup>) dx.</li><li>Exam-friendly curves make 1 + (f′)<sup>2</sup> a perfect square.</li><li>W = ∫F dx; spring F = kx.</li><li>Ropes/liquids: integrate weight of slice × distance lifted.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/6-4-arc-length-of-a-curve-and-surface-area" target="_blank" rel="noopener">OpenStax — 6.4 Arc Length of a Curve and Surface Area</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/6-5-physical-applications" target="_blank" rel="noopener">OpenStax — 6.5 Physical Applications</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcII/ArcLength.aspx" target="_blank" rel="noopener">Paul's Online Notes — Arc Length</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/Work.aspx" target="_blank" rel="noopener">Paul's Online Notes — Work</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Arc length of y = (1/3)(x<sup>2</sup> + 2)<sup>3/2</sup> on [0, 1].</li><li>A 10 N force stretches a spring 0.05 m. Work to stretch it 0.2 m from natural length?</li><li>Set up the arc length of y = x<sup>2</sup> on [0, 1] (it needs a numerical method).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) y′ = x√(x<sup>2</sup> + 2), 1 + (y′)<sup>2</sup> = x<sup>4</sup> + 2x<sup>2</sup> + 1 = (x<sup>2</sup> + 1)<sup>2</sup> ⇒ L = ∫<sub>0</sub><sup>1</sup> (x<sup>2</sup> + 1) dx = 4/3. 2) k = 200 N/m, W = 100·0.04 = 4 J. 3) L = ∫<sub>0</sub><sup>1</sup> √(1 + 4x<sup>2</sup>) dx ≈ 1.4789.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 9 · Bài 9.4</span>
<h2>Độ dài cung và công cơ học</h2>
<p class="lead">Cùng một ý tưởng “cắt lát, xấp xỉ, cộng lại, lấy giới hạn” đo được độ dài một sợi cáp cong và năng lượng để kéo giãn lò xo hay kéo một sợi dây lên. Mỗi bài là một tổng Riemann trá hình.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Suy ra và áp dụng công thức độ dài cung.</li><li>Nhận ra biểu thức rút gọn thành bình phương hoàn hảo.</li><li>Tính công của lực biến thiên.</li><li>Dùng định luật Hooke cho lò xo và ý tưởng cắt lát cho dây.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Một mẩu cung nhỏ gần như đoạn thẳng có độ chạy ngang dx và độ cao dy, nên độ dài là √(dx<sup>2</sup> + dy<sup>2</sup>) = √(1 + (dy/dx)<sup>2</sup>) dx.</p>
<div class="formula"><span class="lbl">Độ dài cung</span>L = ∫<sub>a</sub><sup>b</sup> √(1 + [f′(x)]<sup>2</sup>) dx</div>
<p>Đa số tích phân độ dài cung không tính tay được (dùng tích phân số, Chương 10); bài thi được thiết kế để 1 + (f′)<sup>2</sup> thành bình phương hoàn hảo.</p>
<div class="formula"><span class="lbl">Công của lực biến thiên</span>W = ∫<sub>a</sub><sup>b</sup> F(x) dx  (jun = niutơn·mét)        Định luật Hooke: F(x) = kx  (x = độ giãn so với chiều dài tự nhiên)</div>
<p>Khi kéo dây lên hay bơm chất lỏng, cắt vật thành lát: mỗi lát mỏng được nâng một quãng riêng, rồi tích phân (trọng lượng lát) × (quãng nâng).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — độ dài cung.</b> y = (2/3)x<sup>3/2</sup>, 0 ≤ x ≤ 3. y′ = x<sup>1/2</sup>, 1 + (y′)<sup>2</sup> = 1 + x. L = ∫<sub>0</sub><sup>3</sup> √(1 + x) dx = [(2/3)(1 + x)<sup>3/2</sup>]<sub>0</sub><sup>3</sup> = (2/3)(8 − 1) = <b>14/3</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — lò xo.</b> Lực 40 N kéo giãn lò xo 0,1 m. Vậy k = 40/0,1 = 400 N/m. Công kéo từ chiều dài tự nhiên tới giãn 0,3 m: W = ∫<sub>0</sub><sup>0,3</sup> 400x dx = 200·0,09 = <b>18 J</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — cuộn dây.</b> Sợi dây 20 m nặng 2 N/m treo từ nóc nhà. Lát ở độ sâu y (dày dy) nặng 2 dy và được nâng y mét. W = ∫<sub>0</sub><sup>20</sup> 2y dy = [y<sup>2</sup>]<sub>0</sub><sup>20</sup> = <b>400 J</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết √(1 + f′) thay vì √(1 + (f′)<sup>2</sup>).</li><li>Đo x trong định luật Hooke từ gốc sai (x là độ giãn, không phải tổng chiều dài).</li><li>Dùng W = F·d với lực biến thiên.</li><li>Sai đơn vị: phải đổi cm sang m mới ra jun.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>L = ∫√(1 + (f′)<sup>2</sup>) dx.</li><li>Đường cong “dễ thi” làm 1 + (f′)<sup>2</sup> thành bình phương hoàn hảo.</li><li>W = ∫F dx; lò xo F = kx.</li><li>Dây/chất lỏng: tích phân trọng lượng lát × quãng nâng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-1/pages/6-4-arc-length-of-a-curve-and-surface-area" target="_blank" rel="noopener">OpenStax — 6.4 Độ dài cung và diện tích mặt</a></li><li><a href="https://openstax.org/books/calculus-volume-1/pages/6-5-physical-applications" target="_blank" rel="noopener">OpenStax — 6.5 Ứng dụng vật lý</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcII/ArcLength.aspx" target="_blank" rel="noopener">Paul's Online Notes — Độ dài cung</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcI/Work.aspx" target="_blank" rel="noopener">Paul's Online Notes — Công</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Độ dài cung y = (1/3)(x<sup>2</sup> + 2)<sup>3/2</sup> trên [0, 1].</li><li>Lực 10 N kéo giãn lò xo 0,05 m. Công kéo giãn 0,2 m từ chiều dài tự nhiên?</li><li>Lập tích phân độ dài cung y = x<sup>2</sup> trên [0, 1] (cần phương pháp số).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) y′ = x√(x<sup>2</sup> + 2), 1 + (y′)<sup>2</sup> = x<sup>4</sup> + 2x<sup>2</sup> + 1 = (x<sup>2</sup> + 1)<sup>2</sup> ⇒ L = ∫<sub>0</sub><sup>1</sup> (x<sup>2</sup> + 1) dx = 4/3. 2) k = 200 N/m, W = 100·0,04 = 4 J. 3) L = ∫<sub>0</sub><sup>1</sup> √(1 + 4x<sup>2</sup>) dx ≈ 1,4789.</p></div>`);

const q9 = QZ(9, 'Quiz — Chapter 9: Applications of integration|||Quiz — Chương 9: Ứng dụng của tích phân', 'Kiểm tra chương 9: diện tích giữa hai đường, thể tích đĩa/vành khăn/vỏ trụ, độ dài cung, công.', [
  Q('q1', 'Area between y = x + 2 and y = x² is|||Diện tích giữa y = x + 2 và y = x² là',
    ['9/2|||9/2', '7/2|||7/2', '3|||3', '11/2|||11/2'], 0,
    '∫ from −1 to 2 of (x + 2 − x²) dx = 9/2.|||∫ từ −1 đến 2 của (x + 2 − x²) dx = 9/2.'),
  Q('q2', 'Area between y = √x and y = x² is|||Diện tích giữa y = √x và y = x² là',
    ['1/2|||1/2', '1/3|||1/3', '2/3|||2/3', '1/6|||1/6'], 1,
    '∫₀¹ (√x − x²) dx = 2/3 − 1/3.|||∫₀¹ (√x − x²) dx = 2/3 − 1/3.'),
  Q('q3', '∫ from −1 to 1 of (x − x³) dx = 0. The actual area between the curves is|||∫ từ −1 đến 1 của (x − x³) dx = 0. Diện tích thật giữa hai đường là',
    ['0|||0', '1/4|||1/4', '1/2|||1/2', '1|||1'], 2,
    'The curves cross at 0; split: 1/4 + 1/4.|||Hai đường cắt tại 0; tách: 1/4 + 1/4.'),
  Q('q4', 'Rotating the region under y = √x (0 ≤ x ≤ 4) about the x-axis gives volume|||Quay miền dưới y = √x (0 ≤ x ≤ 4) quanh trục hoành được thể tích',
    ['4π|||4π', '8π|||8π', '16π|||16π', '16π/3|||16π/3'], 1,
    'Disk: π∫₀⁴ x dx = 8π.|||Đĩa: π∫₀⁴ x dx = 8π.'),
  Q('q5', 'Region between y = x and y = x² rotated about the x-axis (washers):|||Miền giữa y = x và y = x² quay quanh trục hoành (vành khăn):',
    ['π/6|||π/6', '2π/15|||2π/15', 'π/30|||π/30', 'π/3|||π/3'], 1,
    'π∫₀¹ (x² − x⁴) dx = π(1/3 − 1/5).|||π∫₀¹ (x² − x⁴) dx = π(1/3 − 1/5).'),
  Q('q6', 'Shell method: region under y = x² (0 ≤ x ≤ 2) about the y-axis:|||Vỏ trụ: miền dưới y = x² (0 ≤ x ≤ 2) quanh trục tung:',
    ['4π|||4π', '8π|||8π', '32π/5|||32π/5', '16π|||16π'], 1,
    '2π∫₀² x·x² dx = 2π·4.|||2π∫₀² x·x² dx = 2π·4.'),
  Q('q7', 'Arc length of y = (2/3)x^(3/2) on [0, 3] is|||Độ dài cung y = (2/3)x^(3/2) trên [0, 3] là',
    ['14/3|||14/3', '3|||3', '7|||7', '16/3|||16/3'], 0,
    '∫₀³ √(1 + x) dx = (2/3)(8 − 1).|||∫₀³ √(1 + x) dx = (2/3)(8 − 1).'),
  Q('q8', 'A 40 N force stretches a spring 0.1 m. Work to stretch it 0.3 m:|||Lực 40 N kéo giãn lò xo 0,1 m. Công kéo giãn 0,3 m:',
    ['12 J|||12 J', '18 J|||18 J', '36 J|||36 J', '120 J|||120 J'], 1,
    'k = 400; W = ∫₀^0.3 400x dx = 200·0.09.|||k = 400; W = ∫₀^0,3 400x dx = 200·0,09.'),
  Q('q9', 'Which method avoids inverting y = sin x when rotating 0 ≤ x ≤ π about the y-axis?|||Phương pháp nào tránh phải đảo y = sin x khi quay 0 ≤ x ≤ π quanh trục tung?',
    ['Disks|||Đĩa', 'Washers|||Vành khăn', 'Cylindrical shells|||Vỏ trụ', 'Arc length|||Độ dài cung'], 2,
    'Shells: 2π∫₀^π x sin x dx = 2π².|||Vỏ trụ: 2π∫₀^π x sin x dx = 2π².'),
]);

const ch9 = {
  title: 'Chapter 9 — Applications of integration|||Chương 9 — Ứng dụng của tích phân',
  description: 'Diện tích giữa các đường cong, thể tích bằng lát cắt (đĩa, vành khăn), vỏ trụ, độ dài cung và công cơ học (Stewart ch.6, 8.1 · OpenStax ch.6).',
  lessons: [c91, c92, c93, c94, q9],
};

// ───────────────────────────── Chương 10 — Tích phân suy rộng, tích phân số, chiến lược ─────────────────────────────
const c101 = L('cal111-ts-10-1',
  '10.1 — Improper integrals|||10.1 — Tích phân suy rộng',
  'Tích phân trên khoảng vô hạn và tích phân của hàm không bị chặn, hội tụ/phân kỳ, tiêu chuẩn p cho ∫1/xᵖ, tiêu chuẩn so sánh, ∫ từ −∞ đến ∞ của 1/(1 + x²) = π.',
  `<span class="eyebrow">CAL111 · Chapter 10 · Lesson 10.1</span>
<h2>Improper integrals</h2>
<p class="lead">Can an infinitely long region have a finite area? Sometimes yes. Improper integrals — over infinite intervals or of functions that blow up — appear in probability (the normal distribution), physics (escape velocity) and the analysis of algorithms.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define improper integrals of type 1 (infinite interval) and type 2 (unbounded integrand) as limits.</li><li>Decide convergence or divergence.</li><li>Use the p-test for ∫ 1/x<sup>p</sup>.</li><li>Apply the comparison test.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Type 1 — infinite interval</span>∫<sub>a</sub><sup>∞</sup> f(x) dx = lim<sub>t→∞</sub> ∫<sub>a</sub><sup>t</sup> f(x) dx    ∫<sub>−∞</sub><sup>∞</sup> f = ∫<sub>−∞</sub><sup>c</sup> f + ∫<sub>c</sub><sup>∞</sup> f (both must converge)</div>
<div class="formula"><span class="lbl">Type 2 — discontinuous integrand</span>f blows up at b:  ∫<sub>a</sub><sup>b</sup> f = lim<sub>t→b⁻</sub> ∫<sub>a</sub><sup>t</sup> f    blows up at an interior point c: split at c</div>
<p>The integral <strong>converges</strong> if the limit exists as a finite number, otherwise it <strong>diverges</strong>.</p>
<div class="formula"><span class="lbl">p-test</span>∫<sub>1</sub><sup>∞</sup> 1/x<sup>p</sup> dx converges ⇔ p &gt; 1 (value 1/(p − 1))    ∫<sub>0</sub><sup>1</sup> 1/x<sup>p</sup> dx converges ⇔ p &lt; 1 (value 1/(1 − p))</div>
<div class="formula"><span class="lbl">Comparison test (f, g continuous, 0 ≤ f ≤ g on [a, ∞))</span>∫ g converges ⇒ ∫ f converges        ∫ f diverges ⇒ ∫ g diverges</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> ∫<sub>1</sub><sup>∞</sup> 1/x<sup>2</sup> dx = lim [−1/x]<sub>1</sub><sup>t</sup> = lim (1 − 1/t) = <b>1</b> (converges). But ∫<sub>1</sub><sup>∞</sup> 1/x dx = lim ln t = ∞ (<b>diverges</b>) — the harmonic borderline p = 1.</p></div>
<div class="callout"><p><b>Example 2.</b> ∫<sub>0</sub><sup>∞</sup> e<sup>−x</sup> dx = lim (1 − e<sup>−t</sup>) = <b>1</b>. ∫<sub>−∞</sub><sup>∞</sup> dx/(1 + x<sup>2</sup>) = lim [arctan x] = π/2 − (−π/2) = <b>π</b>.</p></div>
<div class="callout"><p><b>Example 3 — type 2.</b> ∫<sub>0</sub><sup>1</sup> 1/√x dx = lim<sub>t→0⁺</sub> [2√x]<sub>t</sub><sup>1</sup> = <b>2</b>. ∫<sub>0</sub><sup>1</sup> 1/x dx = lim (−ln t) = ∞ (diverges).</p></div>
<div class="callout"><p><b>Example 4 — comparison.</b> e<sup>−x²</sup> ≤ e<sup>−x</sup> for x ≥ 1, and ∫<sub>1</sub><sup>∞</sup> e<sup>−x</sup> dx = 1/e ≈ 0.368 converges, so ∫<sub>1</sub><sup>∞</sup> e<sup>−x²</sup> dx <b>converges</b> (we cannot compute it exactly, yet we know it is finite and less than 0.368).</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Missing a hidden discontinuity: ∫<sub>−1</sub><sup>1</sup> 1/x<sup>2</sup> dx is improper at 0 (and diverges).</li><li>Computing ∫<sub>−∞</sub><sup>∞</sup> x dx as lim ∫<sub>−t</sub><sup>t</sup> x dx = 0 — the two halves must converge separately; this integral diverges.</li><li>Reversing the p-test conditions for (0, 1] and [1, ∞).</li><li>Using comparison in the wrong direction (smaller than a divergent integral proves nothing).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Improper integral = limit of proper integrals.</li><li>Finite limit ⇒ converges; otherwise diverges.</li><li>1/x<sup>p</sup>: on [1, ∞) need p &gt; 1; on (0, 1] need p &lt; 1.</li><li>Compare with a known integral when there is no antiderivative.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-2/pages/3-7-improper-integrals" target="_blank" rel="noopener">OpenStax Vol. 2 — 3.7 Improper Integrals</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcII/ImproperIntegrals.aspx" target="_blank" rel="noopener">Paul's Online Notes — Improper Integrals</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-5-exploring-the-infinite/part-a-lhospitals-rule-and-improper-integrals/" target="_blank" rel="noopener">MIT 18.01SC — L'Hospital's Rule and Improper Integrals</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>∫<sub>0</sub><sup>∞</sup> x e<sup>−x</sup> dx.</li><li>∫<sub>1</sub><sup>∞</sup> x<sup>−3/2</sup> dx.</li><li>Does ∫<sub>−1</sub><sup>1</sup> 1/x<sup>2</sup> dx converge?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) By parts, [−(x + 1)e<sup>−x</sup>]<sub>0</sub><sup>t</sup> → 0 − (−1) = 1. 2) p = 3/2 &gt; 1: value 1/(p − 1) = 2. 3) No — ∫<sub>0</sub><sup>1</sup> 1/x<sup>2</sup> dx already diverges (p = 2 ≥ 1 on (0, 1]).</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 10 · Bài 10.1</span>
<h2>Tích phân suy rộng</h2>
<p class="lead">Một miền dài vô hạn có thể có diện tích hữu hạn không? Đôi khi có. Tích phân suy rộng — trên khoảng vô hạn hoặc của hàm “nổ” ra vô cực — xuất hiện trong xác suất (phân phối chuẩn), vật lý (vận tốc thoát) và phân tích thuật toán.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa tích phân suy rộng loại 1 (khoảng vô hạn) và loại 2 (hàm không bị chặn) bằng giới hạn.</li><li>Xét hội tụ hay phân kỳ.</li><li>Dùng tiêu chuẩn p cho ∫ 1/x<sup>p</sup>.</li><li>Áp dụng tiêu chuẩn so sánh.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Loại 1 — khoảng vô hạn</span>∫<sub>a</sub><sup>∞</sup> f(x) dx = lim<sub>t→∞</sub> ∫<sub>a</sub><sup>t</sup> f(x) dx    ∫<sub>−∞</sub><sup>∞</sup> f = ∫<sub>−∞</sub><sup>c</sup> f + ∫<sub>c</sub><sup>∞</sup> f (cả hai phải hội tụ)</div>
<div class="formula"><span class="lbl">Loại 2 — hàm gián đoạn</span>f nổ tại b:  ∫<sub>a</sub><sup>b</sup> f = lim<sub>t→b⁻</sub> ∫<sub>a</sub><sup>t</sup> f    nổ tại điểm c bên trong: tách tại c</div>
<p>Tích phân <strong>hội tụ</strong> nếu giới hạn tồn tại và hữu hạn, ngược lại thì <strong>phân kỳ</strong>.</p>
<div class="formula"><span class="lbl">Tiêu chuẩn p</span>∫<sub>1</sub><sup>∞</sup> 1/x<sup>p</sup> dx hội tụ ⇔ p &gt; 1 (giá trị 1/(p − 1))    ∫<sub>0</sub><sup>1</sup> 1/x<sup>p</sup> dx hội tụ ⇔ p &lt; 1 (giá trị 1/(1 − p))</div>
<div class="formula"><span class="lbl">Tiêu chuẩn so sánh (f, g liên tục, 0 ≤ f ≤ g trên [a, ∞))</span>∫ g hội tụ ⇒ ∫ f hội tụ        ∫ f phân kỳ ⇒ ∫ g phân kỳ</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1.</b> ∫<sub>1</sub><sup>∞</sup> 1/x<sup>2</sup> dx = lim [−1/x]<sub>1</sub><sup>t</sup> = lim (1 − 1/t) = <b>1</b> (hội tụ). Nhưng ∫<sub>1</sub><sup>∞</sup> 1/x dx = lim ln t = ∞ (<b>phân kỳ</b>) — ranh giới p = 1.</p></div>
<div class="callout"><p><b>Ví dụ 2.</b> ∫<sub>0</sub><sup>∞</sup> e<sup>−x</sup> dx = lim (1 − e<sup>−t</sup>) = <b>1</b>. ∫<sub>−∞</sub><sup>∞</sup> dx/(1 + x<sup>2</sup>) = lim [arctan x] = π/2 − (−π/2) = <b>π</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — loại 2.</b> ∫<sub>0</sub><sup>1</sup> 1/√x dx = lim<sub>t→0⁺</sub> [2√x]<sub>t</sub><sup>1</sup> = <b>2</b>. ∫<sub>0</sub><sup>1</sup> 1/x dx = lim (−ln t) = ∞ (phân kỳ).</p></div>
<div class="callout"><p><b>Ví dụ 4 — so sánh.</b> e<sup>−x²</sup> ≤ e<sup>−x</sup> khi x ≥ 1, và ∫<sub>1</sub><sup>∞</sup> e<sup>−x</sup> dx = 1/e ≈ 0,368 hội tụ, nên ∫<sub>1</sub><sup>∞</sup> e<sup>−x²</sup> dx <b>hội tụ</b> (không tính chính xác được, nhưng biết nó hữu hạn và nhỏ hơn 0,368).</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Bỏ sót điểm gián đoạn ẩn: ∫<sub>−1</sub><sup>1</sup> 1/x<sup>2</sup> dx là suy rộng tại 0 (và phân kỳ).</li><li>Tính ∫<sub>−∞</sub><sup>∞</sup> x dx bằng lim ∫<sub>−t</sub><sup>t</sup> x dx = 0 — hai nửa phải hội tụ riêng; tích phân này phân kỳ.</li><li>Đảo điều kiện tiêu chuẩn p giữa (0, 1] và [1, ∞).</li><li>So sánh sai chiều (nhỏ hơn một tích phân phân kỳ thì không chứng minh được gì).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tích phân suy rộng = giới hạn của tích phân thường.</li><li>Giới hạn hữu hạn ⇒ hội tụ; ngược lại phân kỳ.</li><li>1/x<sup>p</sup>: trên [1, ∞) cần p &gt; 1; trên (0, 1] cần p &lt; 1.</li><li>So sánh với tích phân đã biết khi không có nguyên hàm.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-2/pages/3-7-improper-integrals" target="_blank" rel="noopener">OpenStax Vol. 2 — 3.7 Tích phân suy rộng</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcII/ImproperIntegrals.aspx" target="_blank" rel="noopener">Paul's Online Notes — Tích phân suy rộng</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-5-exploring-the-infinite/part-a-lhospitals-rule-and-improper-integrals/" target="_blank" rel="noopener">MIT 18.01SC — L'Hospital và tích phân suy rộng</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>∫<sub>0</sub><sup>∞</sup> x e<sup>−x</sup> dx.</li><li>∫<sub>1</sub><sup>∞</sup> x<sup>−3/2</sup> dx.</li><li>∫<sub>−1</sub><sup>1</sup> 1/x<sup>2</sup> dx có hội tụ không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Từng phần, [−(x + 1)e<sup>−x</sup>]<sub>0</sub><sup>t</sup> → 0 − (−1) = 1. 2) p = 3/2 &gt; 1: giá trị 1/(p − 1) = 2. 3) Không — riêng ∫<sub>0</sub><sup>1</sup> 1/x<sup>2</sup> dx đã phân kỳ (p = 2 ≥ 1 trên (0, 1]).</p></div>`);

const c102 = L('cal111-ts-10-2',
  '10.2 — Numerical integration: trapezoidal, midpoint and Simpson’s rules|||10.2 — Tích phân số: quy tắc hình thang, điểm giữa và Simpson',
  'Khi không có nguyên hàm sơ cấp: quy tắc hình thang, điểm giữa, Simpson, cận sai số, cài đặt Python (đã chạy thật) cho ∫₀¹ 1/(1 + x²) dx = π/4.',
  `<span class="eyebrow">CAL111 · Chapter 10 · Lesson 10.2</span>
<h2>Numerical integration</h2>
<p class="lead">∫ e<sup>−x²</sup> dx, ∫ √(1 + 4x<sup>2</sup>) dx, an integral of measured data — many integrals have no usable antiderivative. Computers evaluate them with simple weighted sums. Simpson's rule, in particular, is astonishingly accurate for very little work.</p>
<h3>🎯 Objectives</h3>
<ul><li>Apply the trapezoidal, midpoint and Simpson's rules.</li><li>Compare their accuracy.</li><li>Use the error bounds to choose n.</li><li>Implement the rules in Python.</li></ul>
<h3>📖 Lecture</h3>
<p>Split [a, b] into n subintervals of width h = (b − a)/n, with x<sub>i</sub> = a + ih.</p>
<div class="formula"><span class="lbl">Rules</span>Trapezoidal  T<sub>n</sub> = (h/2)[f(x<sub>0</sub>) + 2f(x<sub>1</sub>) + … + 2f(x<sub>n−1</sub>) + f(x<sub>n</sub>)]<br>Midpoint  M<sub>n</sub> = h[f(m<sub>1</sub>) + … + f(m<sub>n</sub>)],  m<sub>i</sub> = midpoints<br>Simpson (n even)  S<sub>n</sub> = (h/3)[f(x<sub>0</sub>) + 4f(x<sub>1</sub>) + 2f(x<sub>2</sub>) + 4f(x<sub>3</sub>) + … + 4f(x<sub>n−1</sub>) + f(x<sub>n</sub>)]</div>
<div class="formula"><span class="lbl">Error bounds</span>|E<sub>T</sub>| ≤ K(b − a)<sup>3</sup>/(12n<sup>2</sup>), |E<sub>M</sub>| ≤ K(b − a)<sup>3</sup>/(24n<sup>2</sup>) with |f″| ≤ K    |E<sub>S</sub>| ≤ K(b − a)<sup>5</sup>/(180n<sup>4</sup>) with |f<sup>(4)</sup>| ≤ K</div>
<p>Doubling n cuts the trapezoid error by about 4 and the Simpson error by about 16. Simpson's rule is exact for polynomials of degree ≤ 3.</p>
<h3>✍️ Worked example in Python</h3>
<p>We approximate ∫<sub>0</sub><sup>1</sup> 1/(1 + x<sup>2</sup>) dx, whose exact value is arctan 1 = π/4.</p>
<pre><code class="language-python">import math

def trapezoid(f, a, b, n):
    h = (b - a) / n
    return h * (f(a) / 2 + sum(f(a + k*h) for k in range(1, n)) + f(b) / 2)

def midpoint(f, a, b, n):
    h = (b - a) / n
    return h * sum(f(a + (k + 0.5)*h) for k in range(n))

def simpson(f, a, b, n):          # n must be even
    h = (b - a) / n
    s = f(a) + f(b)
    s += sum((4 if k % 2 else 2) * f(a + k*h) for k in range(1, n))
    return h / 3 * s

f = lambda x: 1 / (1 + x*x)       # exact integral on [0, 1] is pi/4
exact = math.pi / 4
for n in (4, 8):
    T, M, S = trapezoid(f, 0, 1, n), midpoint(f, 0, 1, n), simpson(f, 0, 1, n)
    print(f"n={n}  T={T:.6f}  M={M:.6f}  S={S:.8f}  |S-exact|={abs(S-exact):.1e}")
print(f"exact pi/4 = {exact:.8f}")
</code></pre>
<div class="out">n=4  T=0.782794  M=0.786700  S=0.78539216  |S-exact|=6.0e-06
n=8  T=0.784747  M=0.785724  S=0.78539813  |S-exact|=3.8e-08
exact pi/4 = 0.78539816</div>
<p>Observe: the midpoint error (≈ 0.0013 at n = 4) is about half the trapezoid error (≈ 0.0026) and of opposite sign; Simpson with n = 8 is correct to 7 decimals.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using Simpson's rule with an odd n.</li><li>Forgetting the factor h/2 (trapezoid) or h/3 (Simpson).</li><li>Wrong coefficient pattern — Simpson is 1, 4, 2, 4, …, 2, 4, 1.</li><li>Using degree mode for trig integrands.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>T and M have error ∼ 1/n<sup>2</sup>; Simpson ∼ 1/n<sup>4</sup>.</li><li>M is usually better than T (about half the error).</li><li>Simpson needs even n and is exact for cubics.</li><li>Error bounds tell you how large n must be.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-2/pages/3-6-numerical-integration" target="_blank" rel="noopener">OpenStax Vol. 2 — 3.6 Numerical Integration</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcII/ApproximatingDefIntegrals.aspx" target="_blank" rel="noopener">Paul's Online Notes — Approximating Definite Integrals</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-3-the-definite-integral-and-its-applications/part-c-average-value-probability-and-numerical-integration/" target="_blank" rel="noopener">MIT 18.01SC — Average Value, Probability and Numerical Integration</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Compute T<sub>2</sub> for ∫<sub>0</sub><sup>2</sup> x<sup>2</sup> dx.</li><li>Compute S<sub>2</sub> for the same integral and compare with the exact value.</li><li>How large must n be so that the trapezoid error for ∫<sub>0</sub><sup>1</sup> e<sup>x</sup> dx is at most 10<sup>−4</sup>?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) h = 1: (1/2)(0 + 2·1 + 4) = 3 (exact 8/3). 2) (1/3)(0 + 4·1 + 4) = 8/3 — exact, since Simpson is exact for polynomials of degree ≤ 3. 3) K = e: e/(12n<sup>2</sup>) ≤ 10<sup>−4</sup> ⇒ n<sup>2</sup> ≥ 2265.2 ⇒ n ≥ 48.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 10 · Bài 10.2</span>
<h2>Tích phân số</h2>
<p class="lead">∫ e<sup>−x²</sup> dx, ∫ √(1 + 4x<sup>2</sup>) dx, tích phân của dữ liệu đo được — nhiều tích phân không có nguyên hàm dùng được. Máy tính tính chúng bằng các tổng có trọng số đơn giản. Đặc biệt quy tắc Simpson chính xác đến kinh ngạc mà rất ít công sức.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp dụng quy tắc hình thang, điểm giữa và Simpson.</li><li>So sánh độ chính xác của chúng.</li><li>Dùng cận sai số để chọn n.</li><li>Cài đặt các quy tắc bằng Python.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Chia [a, b] thành n khoảng con rộng h = (b − a)/n, với x<sub>i</sub> = a + ih.</p>
<div class="formula"><span class="lbl">Các quy tắc</span>Hình thang  T<sub>n</sub> = (h/2)[f(x<sub>0</sub>) + 2f(x<sub>1</sub>) + … + 2f(x<sub>n−1</sub>) + f(x<sub>n</sub>)]<br>Điểm giữa  M<sub>n</sub> = h[f(m<sub>1</sub>) + … + f(m<sub>n</sub>)],  m<sub>i</sub> = trung điểm<br>Simpson (n chẵn)  S<sub>n</sub> = (h/3)[f(x<sub>0</sub>) + 4f(x<sub>1</sub>) + 2f(x<sub>2</sub>) + 4f(x<sub>3</sub>) + … + 4f(x<sub>n−1</sub>) + f(x<sub>n</sub>)]</div>
<div class="formula"><span class="lbl">Cận sai số</span>|E<sub>T</sub>| ≤ K(b − a)<sup>3</sup>/(12n<sup>2</sup>), |E<sub>M</sub>| ≤ K(b − a)<sup>3</sup>/(24n<sup>2</sup>) với |f″| ≤ K    |E<sub>S</sub>| ≤ K(b − a)<sup>5</sup>/(180n<sup>4</sup>) với |f<sup>(4)</sup>| ≤ K</div>
<p>Gấp đôi n thì sai số hình thang giảm khoảng 4 lần, sai số Simpson giảm khoảng 16 lần. Simpson chính xác tuyệt đối với đa thức bậc ≤ 3.</p>
<h3>✍️ Ví dụ bằng Python</h3>
<p>Ta xấp xỉ ∫<sub>0</sub><sup>1</sup> 1/(1 + x<sup>2</sup>) dx, giá trị chính xác là arctan 1 = π/4.</p>
<pre><code class="language-python">import math

def trapezoid(f, a, b, n):
    h = (b - a) / n
    return h * (f(a) / 2 + sum(f(a + k*h) for k in range(1, n)) + f(b) / 2)

def midpoint(f, a, b, n):
    h = (b - a) / n
    return h * sum(f(a + (k + 0.5)*h) for k in range(n))

def simpson(f, a, b, n):          # n must be even
    h = (b - a) / n
    s = f(a) + f(b)
    s += sum((4 if k % 2 else 2) * f(a + k*h) for k in range(1, n))
    return h / 3 * s

f = lambda x: 1 / (1 + x*x)       # exact integral on [0, 1] is pi/4
exact = math.pi / 4
for n in (4, 8):
    T, M, S = trapezoid(f, 0, 1, n), midpoint(f, 0, 1, n), simpson(f, 0, 1, n)
    print(f"n={n}  T={T:.6f}  M={M:.6f}  S={S:.8f}  |S-exact|={abs(S-exact):.1e}")
print(f"exact pi/4 = {exact:.8f}")
</code></pre>
<div class="out">n=4  T=0.782794  M=0.786700  S=0.78539216  |S-exact|=6.0e-06
n=8  T=0.784747  M=0.785724  S=0.78539813  |S-exact|=3.8e-08
exact pi/4 = 0.78539816</div>
<p>Nhận xét: sai số điểm giữa (≈ 0,0013 khi n = 4) bằng khoảng một nửa sai số hình thang (≈ 0,0026) và ngược dấu; Simpson với n = 8 đúng tới 7 chữ số thập phân.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng Simpson với n lẻ.</li><li>Quên hệ số h/2 (hình thang) hoặc h/3 (Simpson).</li><li>Sai mẫu hệ số — Simpson là 1, 4, 2, 4, …, 2, 4, 1.</li><li>Để máy ở chế độ độ khi hàm có lượng giác.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>T và M có sai số ∼ 1/n<sup>2</sup>; Simpson ∼ 1/n<sup>4</sup>.</li><li>M thường tốt hơn T (sai số khoảng một nửa).</li><li>Simpson cần n chẵn và chính xác với đa thức bậc ba.</li><li>Cận sai số cho biết n cần lớn cỡ nào.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/calculus-volume-2/pages/3-6-numerical-integration" target="_blank" rel="noopener">OpenStax Vol. 2 — 3.6 Tích phân số</a></li><li><a href="https://tutorial.math.lamar.edu/Classes/CalcII/ApproximatingDefIntegrals.aspx" target="_blank" rel="noopener">Paul's Online Notes — Xấp xỉ tích phân xác định</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/unit-3-the-definite-integral-and-its-applications/part-c-average-value-probability-and-numerical-integration/" target="_blank" rel="noopener">MIT 18.01SC — Giá trị trung bình, xác suất và tích phân số</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tính T<sub>2</sub> cho ∫<sub>0</sub><sup>2</sup> x<sup>2</sup> dx.</li><li>Tính S<sub>2</sub> cho cùng tích phân và so với giá trị chính xác.</li><li>n phải lớn cỡ nào để sai số hình thang của ∫<sub>0</sub><sup>1</sup> e<sup>x</sup> dx không quá 10<sup>−4</sup>?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) h = 1: (1/2)(0 + 2·1 + 4) = 3 (chính xác 8/3). 2) (1/3)(0 + 4·1 + 4) = 8/3 — đúng tuyệt đối, vì Simpson chính xác với đa thức bậc ≤ 3. 3) K = e: e/(12n<sup>2</sup>) ≤ 10<sup>−4</sup> ⇒ n<sup>2</sup> ≥ 2265,2 ⇒ n ≥ 48.</p></div>`);

const c103 = L('cal111-ts-10-3',
  '10.3 — Strategy for integration and course review|||10.3 — Chiến lược tính tích phân và ôn tập toàn môn',
  'Quy trình 4 bước chọn kỹ thuật tích phân, bảng nhận diện nhanh, 6 ví dụ hỗn hợp, sơ đồ ôn tập cả môn từ giới hạn tới ứng dụng tích phân.',
  `<span class="eyebrow">CAL111 · Chapter 10 · Lesson 10.3</span>
<h2>Strategy for integration and course review</h2>
<p class="lead">In an exam, integrals do not come labelled “use parts”. The hard part is choosing the technique. This lesson gives a decision procedure, practises it on mixed problems, and closes with a map of the whole course.</p>
<h3>🎯 Objectives</h3>
<ul><li>Follow a systematic strategy to choose an integration technique.</li><li>Recognise the standard patterns quickly.</li><li>Solve mixed integrals.</li><li>Connect the main ideas of the course.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Four-step strategy</span>1) Simplify: algebra, split fractions, trig identities (e.g. sin x/cos<sup>2</sup>x = sec x tan x).<br>2) Look for an obvious substitution u whose derivative is present.<br>3) Classify: rational ⇒ partial fractions/complete the square; product of polynomial and exp/trig/log ⇒ parts; powers of sin/cos ⇒ trig identities.<br>4) Try again: another substitution, parts with dv = dx, rewrite the integrand, or go numerical.</div>
<div class="formula"><span class="lbl">Quick-recognition table</span>f′(x)/f(x) → ln|f|    f′(x)e<sup>f(x)</sup> → e<sup>f</sup>    1/(x<sup>2</sup> + a<sup>2</sup>) → arctan    x·e<sup>x</sup>, x·sin x, ln x → parts    quadratic denominator → complete the square</div>
<h3>✍️ Worked examples (mixed)</h3>
<div class="callout"><p><b>1.</b> ∫ x/√(1 − x<sup>2</sup>) dx: u = 1 − x<sup>2</sup> ⇒ <b>−√(1 − x<sup>2</sup>) + C</b>.</p>
<p><b>2.</b> ∫ x ln x dx: parts with u = ln x, dv = x dx ⇒ <b>(x<sup>2</sup>/2) ln x − x<sup>2</sup>/4 + C</b>.</p>
<p><b>3.</b> ∫ (x + 1)/(x<sup>2</sup> + 2x + 5) dx: the numerator is half the derivative of the denominator ⇒ <b>(1/2) ln(x<sup>2</sup> + 2x + 5) + C</b>.</p>
<p><b>4.</b> ∫ sin x/cos<sup>2</sup>x dx = ∫ sec x tan x dx = <b>sec x + C</b>.</p>
<p><b>5.</b> ∫<sub>0</sub><sup>1</sup> x/(x + 1) dx = ∫<sub>0</sub><sup>1</sup> [1 − 1/(x + 1)] dx = <b>1 − ln 2 ≈ 0.307</b> (divide first!).</p>
<p><b>6.</b> ∫ dx/(x<sup>2</sup> + 4x + 5): complete the square, (x + 2)<sup>2</sup> + 1 ⇒ <b>arctan(x + 2) + C</b>.</p></div>
<h3>🗺️ Course map</h3>
<ul><li><strong>Limits</strong> (Ch. 2) are the foundation: continuity, derivatives and integrals are all limits.</li><li><strong>Derivatives</strong> (Ch. 3–4) measure instantaneous change; rules + chain rule compute them.</li><li><strong>Applications of derivatives</strong> (Ch. 5–6): extrema, shape, optimisation, L'Hôpital, Newton.</li><li><strong>Integrals</strong> (Ch. 7) measure accumulation; the Fundamental Theorem links them to antiderivatives.</li><li><strong>Techniques and applications</strong> (Ch. 8–10): substitution, parts, partial fractions; areas, volumes, length, work; improper and numerical integrals.</li></ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Jumping to a complicated method before simplifying.</li><li>Missing that the numerator is (a multiple of) the derivative of the denominator.</li><li>Applying partial fractions to an improper fraction (Example 5 needs division first).</li><li>Not checking the answer by differentiating it.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Simplify → substitute → classify → try again.</li><li>Check every antiderivative by differentiation.</li><li>Many integrals have no elementary antiderivative — use numerical methods.</li><li>Limits → derivatives → integrals: one connected theory.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://tutorial.math.lamar.edu/Classes/CalcII/IntegrationStrategy.aspx" target="_blank" rel="noopener">Paul's Online Notes — Integration Strategy</a></li><li><a href="https://openstax.org/books/calculus-volume-2/pages/3-5-other-strategies-for-integration" target="_blank" rel="noopener">OpenStax Vol. 2 — 3.5 Other Strategies for Integration</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/final-exam/" target="_blank" rel="noopener">MIT 18.01SC — Final Exam (with solutions) for self-testing</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>∫ e<sup>√x</sup> dx.</li><li>∫ x<sup>3</sup> e<sup>x²</sup> dx.</li><li>∫ dx/(x<sup>2</sup> + 4x + 5) on [−2, −1].</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) u = √x (x = u<sup>2</sup>, dx = 2u du) then parts: 2(√x − 1)e<sup>√x</sup> + C. 2) u = x<sup>2</sup>: (1/2)∫ u e<sup>u</sup> du = (1/2)(x<sup>2</sup> − 1)e<sup>x²</sup> + C. 3) [arctan(x + 2)]<sub>−2</sub><sup>−1</sup> = arctan 1 − arctan 0 = π/4.</p></div>`,
  `<span class="eyebrow">CAL111 · Chương 10 · Bài 10.3</span>
<h2>Chiến lược tính tích phân và ôn tập toàn môn</h2>
<p class="lead">Trong phòng thi, tích phân không dán nhãn “dùng từng phần”. Khó nhất là chọn kỹ thuật. Bài này đưa ra quy trình quyết định, luyện trên bài hỗn hợp, và khép lại bằng bản đồ toàn môn.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Theo một chiến lược có hệ thống để chọn kỹ thuật tích phân.</li><li>Nhận diện nhanh các mẫu chuẩn.</li><li>Giải tích phân hỗn hợp.</li><li>Nối các ý chính của cả môn.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Chiến lược 4 bước</span>1) Rút gọn: biến đổi đại số, tách phân thức, đẳng thức lượng giác (vd sin x/cos<sup>2</sup>x = sec x tan x).<br>2) Tìm phép đổi biến hiển nhiên u có đạo hàm xuất hiện.<br>3) Phân loại: hữu tỉ ⇒ phân thức/thêm bớt bình phương; đa thức nhân mũ/lượng giác/log ⇒ từng phần; luỹ thừa sin/cos ⇒ đẳng thức lượng giác.<br>4) Thử lại: đổi biến khác, từng phần với dv = dx, viết lại biểu thức, hoặc tính số.</div>
<div class="formula"><span class="lbl">Bảng nhận diện nhanh</span>f′(x)/f(x) → ln|f|    f′(x)e<sup>f(x)</sup> → e<sup>f</sup>    1/(x<sup>2</sup> + a<sup>2</sup>) → arctan    x·e<sup>x</sup>, x·sin x, ln x → từng phần    mẫu bậc hai → thêm bớt bình phương</div>
<h3>✍️ Ví dụ hỗn hợp</h3>
<div class="callout"><p><b>1.</b> ∫ x/√(1 − x<sup>2</sup>) dx: u = 1 − x<sup>2</sup> ⇒ <b>−√(1 − x<sup>2</sup>) + C</b>.</p>
<p><b>2.</b> ∫ x ln x dx: từng phần với u = ln x, dv = x dx ⇒ <b>(x<sup>2</sup>/2) ln x − x<sup>2</sup>/4 + C</b>.</p>
<p><b>3.</b> ∫ (x + 1)/(x<sup>2</sup> + 2x + 5) dx: tử bằng nửa đạo hàm của mẫu ⇒ <b>(1/2) ln(x<sup>2</sup> + 2x + 5) + C</b>.</p>
<p><b>4.</b> ∫ sin x/cos<sup>2</sup>x dx = ∫ sec x tan x dx = <b>sec x + C</b>.</p>
<p><b>5.</b> ∫<sub>0</sub><sup>1</sup> x/(x + 1) dx = ∫<sub>0</sub><sup>1</sup> [1 − 1/(x + 1)] dx = <b>1 − ln 2 ≈ 0,307</b> (chia trước!).</p>
<p><b>6.</b> ∫ dx/(x<sup>2</sup> + 4x + 5): thêm bớt bình phương, (x + 2)<sup>2</sup> + 1 ⇒ <b>arctan(x + 2) + C</b>.</p></div>
<h3>🗺️ Bản đồ môn học</h3>
<ul><li><strong>Giới hạn</strong> (Ch. 2) là nền móng: liên tục, đạo hàm, tích phân đều là giới hạn.</li><li><strong>Đạo hàm</strong> (Ch. 3–4) đo thay đổi tức thời; quy tắc + dây chuyền để tính.</li><li><strong>Ứng dụng đạo hàm</strong> (Ch. 5–6): cực trị, hình dạng, tối ưu, L'Hôpital, Newton.</li><li><strong>Tích phân</strong> (Ch. 7) đo sự tích luỹ; Định lý cơ bản nối nó với nguyên hàm.</li><li><strong>Kỹ thuật và ứng dụng</strong> (Ch. 8–10): đổi biến, từng phần, phân thức; diện tích, thể tích, độ dài, công; tích phân suy rộng và tích phân số.</li></ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Lao vào phương pháp phức tạp trước khi rút gọn.</li><li>Không nhận ra tử số là (bội của) đạo hàm của mẫu.</li><li>Phân tích phân thức cho phân thức không thực sự (Ví dụ 5 cần chia trước).</li><li>Không kiểm đáp số bằng cách đạo hàm lại.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Rút gọn → đổi biến → phân loại → thử lại.</li><li>Kiểm mọi nguyên hàm bằng đạo hàm.</li><li>Nhiều tích phân không có nguyên hàm sơ cấp — dùng phương pháp số.</li><li>Giới hạn → đạo hàm → tích phân: một lý thuyết liền mạch.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://tutorial.math.lamar.edu/Classes/CalcII/IntegrationStrategy.aspx" target="_blank" rel="noopener">Paul's Online Notes — Chiến lược tính tích phân</a></li><li><a href="https://openstax.org/books/calculus-volume-2/pages/3-5-other-strategies-for-integration" target="_blank" rel="noopener">OpenStax Vol. 2 — 3.5 Các chiến lược tích phân khác</a></li><li><a href="https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages/final-exam/" target="_blank" rel="noopener">MIT 18.01SC — Đề thi cuối kỳ (có lời giải) để tự kiểm tra</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>∫ e<sup>√x</sup> dx.</li><li>∫ x<sup>3</sup> e<sup>x²</sup> dx.</li><li>∫ dx/(x<sup>2</sup> + 4x + 5) trên [−2, −1].</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) u = √x (x = u<sup>2</sup>, dx = 2u du) rồi từng phần: 2(√x − 1)e<sup>√x</sup> + C. 2) u = x<sup>2</sup>: (1/2)∫ u e<sup>u</sup> du = (1/2)(x<sup>2</sup> − 1)e<sup>x²</sup> + C. 3) [arctan(x + 2)]<sub>−2</sub><sup>−1</sup> = arctan 1 − arctan 0 = π/4.</p></div>`);

const q10 = QZ(10, 'Quiz — Chapter 10: Improper & numerical integration, strategy|||Quiz — Chương 10: Tích phân suy rộng, tích phân số, chiến lược', 'Kiểm tra chương 10: hội tụ/phân kỳ, tiêu chuẩn p và so sánh, hình thang/Simpson, chọn kỹ thuật tích phân.', [
  Q('q1', '∫ from 1 to ∞ of 1/x² dx =|||∫ từ 1 đến ∞ của 1/x² dx =',
    ['diverges|||phân kỳ', '1|||1', '2|||2', '1/2|||1/2'], 1,
    'lim (1 − 1/t) = 1.|||lim (1 − 1/t) = 1.'),
  Q('q2', '∫ from 1 to ∞ of 1/xᵖ dx converges exactly when|||∫ từ 1 đến ∞ của 1/xᵖ dx hội tụ khi và chỉ khi',
    ['p < 1|||p < 1', 'p ≥ 1|||p ≥ 1', 'p > 1|||p > 1', 'p > 0|||p > 0'], 2,
    'p-test; p = 1 gives ln t → ∞.|||Tiêu chuẩn p; p = 1 cho ln t → ∞.'),
  Q('q3', '∫ from −∞ to ∞ of 1/(1 + x²) dx =|||∫ từ −∞ đến ∞ của 1/(1 + x²) dx =',
    ['π/2|||π/2', 'π|||π', '2π|||2π', 'diverges|||phân kỳ'], 1,
    'arctan goes from −π/2 to π/2.|||arctan đi từ −π/2 đến π/2.'),
  Q('q4', '∫₀¹ 1/√x dx =|||∫₀¹ 1/√x dx =',
    ['1|||1', '2|||2', '∞|||∞', '1/2|||1/2'], 1,
    'lim [2√x] from t to 1 = 2 (p = 1/2 < 1 on (0, 1]).|||lim [2√x] từ t đến 1 = 2 (p = 1/2 < 1 trên (0, 1]).'),
  Q('q5', 'Since 0 ≤ e^(−x²) ≤ e^(−x) on [1, ∞), ∫₁^∞ e^(−x²) dx|||Vì 0 ≤ e^(−x²) ≤ e^(−x) trên [1, ∞), ∫₁^∞ e^(−x²) dx',
    ['diverges|||phân kỳ', 'converges (comparison test)|||hội tụ (tiêu chuẩn so sánh)', 'equals 1/e|||bằng 1/e', 'cannot be decided|||không kết luận được'], 1,
    'Bounded above by the convergent ∫₁^∞ e^(−x) dx = 1/e.|||Bị chặn trên bởi ∫₁^∞ e^(−x) dx = 1/e hội tụ.'),
  Q('q6', 'Trapezoidal T₂ for ∫₀² x² dx =|||Hình thang T₂ cho ∫₀² x² dx =',
    ['8/3|||8/3', '3|||3', '2|||2', '4|||4'], 1,
    'h = 1: (1/2)(0 + 2·1 + 4) = 3.|||h = 1: (1/2)(0 + 2·1 + 4) = 3.'),
  Q('q7', "Simpson's rule S₂ for ∫₀² x² dx equals the exact value because|||Simpson S₂ cho ∫₀² x² dx bằng đúng giá trị chính xác vì",
    ['n is even|||n chẵn', 'Simpson is exact for polynomials of degree ≤ 3|||Simpson chính xác với đa thức bậc ≤ 3', 'h = 1|||h = 1', 'coincidence|||trùng hợp'], 1,
    'Its error bound involves f⁽⁴⁾, which is 0 for cubics.|||Cận sai số chứa f⁽⁴⁾, bằng 0 với đa thức bậc ba.'),
  Q('q8', 'Doubling n reduces the Simpson error by a factor of about|||Gấp đôi n thì sai số Simpson giảm khoảng',
    ['2|||2', '4|||4', '8|||8', '16|||16'], 3,
    'Error ∼ 1/n⁴, and 2⁴ = 16.|||Sai số ∼ 1/n⁴, và 2⁴ = 16.'),
  Q('q9', 'Best first step for ∫ (x + 1)/(x² + 2x + 5) dx:|||Bước đầu tốt nhất cho ∫ (x + 1)/(x² + 2x + 5) dx:',
    ['integration by parts|||từng phần', 'substitution u = x² + 2x + 5|||đổi biến u = x² + 2x + 5', 'partial fractions with real roots|||phân thức với nghiệm thực', 'numerical integration|||tích phân số'], 1,
    'du = 2(x + 1)dx: the result is (1/2) ln(x² + 2x + 5) + C.|||du = 2(x + 1)dx: kết quả (1/2) ln(x² + 2x + 5) + C.'),
  Q('q10', '∫₀¹ x/(x + 1) dx =|||∫₀¹ x/(x + 1) dx =',
    ['ln 2|||ln 2', '1 − ln 2|||1 − ln 2', '1/2|||1/2', '1 + ln 2|||1 + ln 2'], 1,
    'x/(x + 1) = 1 − 1/(x + 1).|||x/(x + 1) = 1 − 1/(x + 1).'),
]);

const ch10 = {
  title: 'Chapter 10 — Improper integrals, numerical integration and strategy|||Chương 10 — Tích phân suy rộng, tích phân số và chiến lược tích phân',
  description: 'Tích phân suy rộng (hội tụ/phân kỳ, tiêu chuẩn p, so sánh), quy tắc hình thang/điểm giữa/Simpson có code Python chạy thật, chiến lược chọn kỹ thuật và ôn tập toàn môn (Stewart 7.5–7.8 · OpenStax Vol.2 3.5–3.7).',
  lessons: [c101, c102, c103, q10],
};

// ───────────────────────────── Xuất ─────────────────────────────
export default [muc0, ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9, ch10];
