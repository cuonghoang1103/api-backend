// Khoá TỰ SOẠN cho PSI221 — trường chưa công bố syllabus trên FLM (dò 09/11/2026). Soạn theo _HOP-DONG-TU-SOAN.md.
// Nối tiếp IPY111 (xác suất nhập môn). Khung bám giáo trình chuẩn: Wasserman "All of Statistics" (Springer 2004),
// Casella & Berger "Statistical Inference" (2e), OpenIntro Statistics (4e, miễn phí) và OpenStax Introductory Statistics 2e.
// Mọi ví dụ số đã kiểm bằng python3 (scipy 1.18 / statsmodels 0.15 / sympy 1.14). Mọi đoạn code chạy thật, seed cố định,
// output dán nguyên văn. Mọi link ngoài đã mở thử (HTTP 200 + tiêu đề trang đúng chủ đề).
// ⚠️ File này KHÔNG dùng chuỗi nội suy (dấu đô-la + ngoặc nhọn) và không backtick lồng.

const bi = (en, vi) => '<div class="ml-en">' + en + '</div>\n<div class="ml-vi">' + vi + '</div>';
const L = (slug, title, description, en, vi) => ({ title, slug, type: 'DOCUMENT', description, content: bi(en, vi) });
const Q = (id, question, options, correctIndex, explanation) => ({ id, question, options, correctIndex, points: 1, explanation });
const QZ = (ch, title, description, questions) => ({
  title, slug: 'psi221-ts-quiz-' + ch, type: 'QUIZ', description,
  quiz: { timeLimitSeconds: 900, questions },
});

// ───────────────────────────── Mục 0 ─────────────────────────────
const m01 = L('psi221-ts-0-1',
  '0.1 — Welcome to PSI221: from probability to statistical inference|||0.1 — Giới thiệu PSI221: từ xác suất sang suy luận thống kê',
  'PSI221 học gì, dùng vào đâu (A/B test, đánh giá mô hình học máy, khoa học dữ liệu), 8 chuẩn đầu ra tự soạn, nối tiếp IPY111, cảnh báo: trường chưa công bố syllabus trên FLM.',
  `<span class="eyebrow">PSI221 · Section 0 · Lesson 0.1</span>
<h2>Welcome to Probability and Statistical Inference II</h2>
<p class="lead">In IPY111 you learned to compute the probability of data when the model is <strong>known</strong>. In PSI221 we turn the question around: we <strong>see the data</strong> and must say something reliable about the unknown model. That reverse step is called <strong>statistical inference</strong>.</p>
<div class="callout"><p>⚠️ <strong>Important.</strong> FPT University has <strong>not published the PSI221 syllabus on FLM</strong> (we searched the course code, its variants and the course name on 09/11/2026). This course framework is therefore <strong>self-authored</strong>, following the chapter order of standard international textbooks (Wasserman <em>All of Statistics</em>, Casella &amp; Berger <em>Statistical Inference</em>, OpenIntro <em>Statistics</em>). <strong>Grading weights, assessment format and exam dates are decided by your lecturer</strong> — always follow the course outline your lecturer gives in class.</p></div>
<h3>What is statistical inference?</h3>
<p>Probability goes from model to data: “if a coin is fair, how likely are 60 heads in 100 tosses?”. Inference goes from data to model: “I saw 60 heads in 100 tosses — is the coin fair, and what is my best estimate of its heads probability, with what uncertainty?”. Every inference answer has two parts: a <strong>number</strong> (an estimate or a decision) and a <strong>statement of uncertainty</strong> (a standard error, a confidence interval, a p-value or a posterior distribution). An estimate without its uncertainty is not inference — it is a guess.</p>
<p>The course has four big blocks:</p>
<ul>
<li><strong>Sampling distributions</strong> (Ch. 1): how a statistic such as the sample mean varies from sample to sample; the χ², t and F distributions.</li>
<li><strong>Estimation</strong> (Ch. 2–4): method of moments, maximum likelihood, bias, MSE, Fisher information, and confidence intervals.</li>
<li><strong>Testing</strong> (Ch. 5–7): hypotheses, p-values, Type I/II errors, power; z, t, χ² and F tests; multiple testing.</li>
<li><strong>Models and modern tools</strong> (Ch. 8–10): ANOVA, linear regression and correlation, rank tests, permutation tests, the bootstrap and a first look at Bayesian inference.</li>
</ul>
<h3>Why does a computer-science / data student need it?</h3>
<ul>
<li><strong>A/B testing:</strong> “the new button raised conversion from 12% to 15%” — is that real or noise? That is a two-proportion test (Lesson 6.4).</li>
<li><strong>Evaluating machine-learning models:</strong> model Y beat model X on 10 datasets — a paired test or a Wilcoxon test tells you whether the gap is reliable (Lessons 6.3, 10.1).</li>
<li><strong>Performance engineering:</strong> did the new build really cut latency? Confidence intervals and Welch's t-test (Lessons 4.2, 6.2).</li>
<li><strong>Training models is estimation:</strong> minimising cross-entropy is maximum likelihood; L2 regularisation is a Bayesian prior (Lessons 2.3, 10.4).</li>
<li><strong>Data science reports:</strong> regression coefficients with standard errors, ANOVA tables, bootstrap intervals — the daily language of analysts.</li>
</ul>
<h3>Learning outcomes (self-authored)</h3>
<p>After this course you should be able to:</p>
<ol>
<li>Derive and use the sampling distributions of the sample mean and variance, and the χ², Student t and F distributions.</li>
<li>Construct point estimators by the method of moments and maximum likelihood (analytically and numerically), and compare them by bias, variance and MSE.</li>
<li>Use Fisher information, the Cramér–Rao bound, sufficiency and the asymptotic normality of the MLE (with the delta method) to judge and quantify estimators.</li>
<li>Build and correctly interpret confidence intervals for means, proportions, variances and MLE-based parameters, and choose sample sizes.</li>
<li>Set up hypothesis tests, compute p-values, control Type I error, compute power, and explain the Neyman–Pearson lemma and the likelihood-ratio test.</li>
<li>Choose and run the right test for one or two samples, paired data, proportions, categorical tables (χ²) and several groups (ANOVA), correcting for multiple testing.</li>
<li>Fit and make inference in simple and multiple linear regression, interpret correlation, and check model assumptions.</li>
<li>Apply nonparametric rank tests, permutation tests, the bootstrap and conjugate Bayesian updating, and run every method in Python (scipy, statsmodels).</li>
</ol>
<h3>Related courses at FPTU</h3>
<p>PSI221 is a <strong>semester 2</strong> course that continues <strong>IPY111 — Introduction to Probability</strong> (counting, Bayes' rule, random variables, expectation and variance, joint distributions, covariance, LLN and CLT). We do <strong>not</strong> repeat those topics; when we need one we recall it in one line and point back to IPY111. Calculus (CAL111: derivatives, integrals) is used for likelihoods and densities. The ideas of this course are used again in the later machine-learning and data-science courses of the programme (check the exact course codes in your own curriculum).</p>
<h3>How to study this course</h3>
<ul>
<li>Every lesson has objectives, a lecture, worked examples, common mistakes, a 📌 summary, 🔗 further learning and 🧪 practice with answers. Each chapter ends with a quiz.</li>
<li>Every number in the examples was checked in Python, and every code block was actually run — the grey box under it is the real output. <strong>Run the code yourself</strong> and change the numbers.</li>
<li>Always write the uncertainty next to the estimate. In an exam, write the hypotheses, the statistic, its distribution under H<sub>0</sub>, the p-value and a one-sentence conclusion in context.</li>
</ul>`,
  `<span class="eyebrow">PSI221 · Mục 0 · Bài 0.1</span>
<h2>Chào mừng đến với Xác suất &amp; Suy luận thống kê II</h2>
<p class="lead">Ở IPY111 bạn học cách tính xác suất của dữ liệu khi mô hình đã <strong>biết trước</strong>. Ở PSI221 ta lật ngược câu hỏi: ta <strong>nhìn thấy dữ liệu</strong> và phải nói điều gì đó đáng tin về mô hình chưa biết. Bước ngược đó gọi là <strong>suy luận thống kê</strong>.</p>
<div class="callout"><p>⚠️ <strong>Lưu ý quan trọng.</strong> Trường <strong>chưa công bố syllabus của PSI221 trên FLM</strong> (đã dò mã môn, mã biến thể và tên môn ngày 09/11/2026). Vì vậy khung môn này là <strong>khung tự soạn</strong>, bám thứ tự chương của giáo trình chuẩn quốc tế (Wasserman <em>All of Statistics</em>, Casella &amp; Berger <em>Statistical Inference</em>, OpenIntro <em>Statistics</em>). <strong>Cách tính điểm, hình thức đánh giá và lịch thi theo giảng viên</strong> — luôn theo đề cương giảng viên phát trên lớp.</p></div>
<h3>Suy luận thống kê là gì?</h3>
<p>Xác suất đi từ mô hình tới dữ liệu: “nếu đồng xu cân đối, khả năng được 60 mặt ngửa trong 100 lần tung là bao nhiêu?”. Suy luận đi từ dữ liệu về mô hình: “tôi thấy 60 mặt ngửa trong 100 lần — đồng xu có cân đối không, ước lượng tốt nhất cho xác suất ra ngửa là bao nhiêu, và sai số cỡ nào?”. Mọi câu trả lời suy luận gồm hai phần: một <strong>con số</strong> (ước lượng hoặc quyết định) và một <strong>phát biểu về độ bất định</strong> (sai số chuẩn, khoảng tin cậy, p-value hoặc phân phối hậu nghiệm). Ước lượng mà không kèm độ bất định thì chưa phải suy luận — đó chỉ là đoán.</p>
<p>Môn học có bốn khối lớn:</p>
<ul>
<li><strong>Phân phối mẫu</strong> (Ch. 1): một thống kê như trung bình mẫu dao động thế nào giữa các mẫu; các phân phối χ², t và F.</li>
<li><strong>Ước lượng</strong> (Ch. 2–4): phương pháp mô-men, hợp lý cực đại, độ chệch, MSE, thông tin Fisher và khoảng tin cậy.</li>
<li><strong>Kiểm định</strong> (Ch. 5–7): giả thuyết, p-value, sai lầm loại I/II, lực kiểm định; kiểm định z, t, χ², F; kiểm định bội.</li>
<li><strong>Mô hình và công cụ hiện đại</strong> (Ch. 8–10): ANOVA, hồi quy tuyến tính và tương quan, kiểm định hạng, kiểm định hoán vị, bootstrap và nhập môn suy luận Bayes.</li>
</ul>
<h3>Sinh viên CNTT / dữ liệu cần nó để làm gì?</h3>
<ul>
<li><strong>A/B test:</strong> “nút mới tăng tỉ lệ chuyển đổi từ 12% lên 15%” — thật hay chỉ là nhiễu? Đó là kiểm định hai tỉ lệ (Bài 6.4).</li>
<li><strong>Đánh giá mô hình học máy:</strong> mô hình Y thắng mô hình X trên 10 bộ dữ liệu — kiểm định cặp hoặc Wilcoxon cho biết khoảng cách đó có đáng tin không (Bài 6.3, 10.1).</li>
<li><strong>Tối ưu hiệu năng:</strong> bản build mới có thật sự giảm độ trễ? Khoảng tin cậy và kiểm định t Welch (Bài 4.2, 6.2).</li>
<li><strong>Huấn luyện mô hình chính là ước lượng:</strong> cực tiểu cross-entropy là hợp lý cực đại; chính quy hoá L2 là một tiên nghiệm Bayes (Bài 2.3, 10.4).</li>
<li><strong>Báo cáo khoa học dữ liệu:</strong> hệ số hồi quy kèm sai số chuẩn, bảng ANOVA, khoảng bootstrap — ngôn ngữ hằng ngày của người phân tích.</li>
</ul>
<h3>Chuẩn đầu ra (tự soạn)</h3>
<p>Học xong môn, bạn cần làm được:</p>
<ol>
<li>Suy ra và dùng phân phối mẫu của trung bình và phương sai mẫu, cùng các phân phối χ², Student t và F.</li>
<li>Xây dựng ước lượng điểm bằng phương pháp mô-men và hợp lý cực đại (giải tích và tính số), so sánh chúng theo độ chệch, phương sai và MSE.</li>
<li>Dùng thông tin Fisher, cận Cramér–Rao, tính đủ và tính tiệm cận chuẩn của MLE (kèm phương pháp delta) để đánh giá và định lượng ước lượng.</li>
<li>Lập và diễn giải đúng khoảng tin cậy cho trung bình, tỉ lệ, phương sai và tham số dựa trên MLE; chọn cỡ mẫu.</li>
<li>Thiết lập kiểm định giả thuyết, tính p-value, kiểm soát sai lầm loại I, tính lực kiểm định, giải thích bổ đề Neyman–Pearson và kiểm định tỉ số hợp lý.</li>
<li>Chọn và chạy đúng kiểm định cho một/hai mẫu, dữ liệu cặp, tỉ lệ, bảng phân loại (χ²) và nhiều nhóm (ANOVA), có hiệu chỉnh kiểm định bội.</li>
<li>Khớp và suy luận trên hồi quy tuyến tính đơn và bội, diễn giải tương quan, kiểm tra giả định mô hình.</li>
<li>Áp dụng kiểm định hạng phi tham số, kiểm định hoán vị, bootstrap và cập nhật Bayes liên hợp, chạy mọi phương pháp bằng Python (scipy, statsmodels).</li>
</ol>
<h3>Môn liên quan trong khung FPTU</h3>
<p>PSI221 nằm ở <strong>kỳ 2</strong>, nối tiếp <strong>IPY111 — Introduction to Probability</strong> (phép đếm, công thức Bayes, biến ngẫu nhiên, kỳ vọng và phương sai, phân phối đồng thời, hiệp phương sai, luật số lớn và định lý giới hạn trung tâm). Khoá này <strong>không</strong> giảng lại các chủ đề đó; khi cần, ta nhắc lại một dòng và chỉ về IPY111. Giải tích (CAL111: đạo hàm, tích phân) được dùng cho hàm hợp lý và hàm mật độ. Kiến thức của môn được dùng lại trong các môn học máy và khoa học dữ liệu ở các kỳ sau (xem mã môn cụ thể trong khung chương trình ngành của bạn).</p>
<h3>Học môn này thế nào cho hiệu quả</h3>
<ul>
<li>Mỗi bài có mục tiêu, bài giảng, ví dụ giải từng bước, lỗi hay gặp, 📌 tóm tắt, 🔗 học thêm và 🧪 tự luyện có đáp án. Cuối mỗi chương có quiz.</li>
<li>Mọi con số trong ví dụ đã được kiểm bằng Python, mọi khối code đều đã chạy thật — hộp xám bên dưới là output thật. <strong>Hãy tự chạy lại</strong> và đổi số liệu.</li>
<li>Luôn viết độ bất định cạnh ước lượng. Trong bài thi, viết đủ: giả thuyết, thống kê kiểm định, phân phối của nó khi H<sub>0</sub> đúng, p-value và một câu kết luận gắn với bối cảnh.</li>
</ul>`);

const m02 = L('psi221-ts-0-2',
  '0.2 — Textbooks & learning resources (verified)|||0.2 — Giáo trình & tài liệu học (đã kiểm)',
  'Bốn giáo trình chuẩn kèm ISBN đã kiểm (Wasserman, Casella–Berger, OpenIntro 4e, DeGroot–Schervish 4e), sách mở OpenStax, khoá mở MIT 18.05/18.650, Penn State STAT 415, NIST e-Handbook, StatQuest, công cụ Python.',
  `<span class="eyebrow">PSI221 · Section 0 · Lesson 0.2</span>
<h2>Textbooks &amp; learning resources</h2>
<p class="lead">This course follows the chapter order of the standard textbooks below. You do <strong>not</strong> need to buy anything: OpenIntro and OpenStax are free and legal online, and every lesson links to free sections that match it.</p>
<h3>📘 Main textbooks</h3>
<ol>
<li><strong>Larry Wasserman — <em>All of Statistics: A Concise Course in Statistical Inference</em>.</strong> Springer (Springer Texts in Statistics), 2004. ISBN 978-0-387-40272-7. <a href="https://www.stat.cmu.edu/~larry/all-of-statistics/" target="_blank" rel="noopener">Author's book page</a> (errata, data sets). Short, modern and written for computer-science students; our order of estimation → testing → bootstrap → Bayes follows its Part II.</li>
<li><strong>George Casella, Roger L. Berger — <em>Statistical Inference</em>, 2nd edition.</strong> Chapman &amp; Hall/CRC (Texts in Statistical Science), 2024 reprint of the edition first published by Duxbury (Cengage) in 2001. ISBN 978-1-032-59303-6 (hardback). <a href="https://www.routledge.com/Statistical-Inference/Casella-Berger/p/book/9781032593036" target="_blank" rel="noopener">Publisher page</a>. The classic reference for sufficiency, Fisher information, the Cramér–Rao bound and likelihood-ratio tests (its chapters 5–10).</li>
<li><strong>David Diez, Mine Çetinkaya-Rundel, Christopher Barr — <em>OpenIntro Statistics</em>, 4th edition.</strong> OpenIntro, 2019. ISBN 978-1-943450-07-7 (paperback); free PDF. <a href="https://www.openintro.org/book/os/" target="_blank" rel="noopener">Book page (free download)</a>. Applied, very readable: confidence intervals, tests, χ², ANOVA and regression with real data.</li>
<li><strong>Morris H. DeGroot, Mark J. Schervish — <em>Probability and Statistics</em>, 4th edition.</strong> Addison-Wesley / Pearson, 2012. ISBN 978-0-321-50046-5. A careful middle path between OpenIntro and Casella–Berger, strong on Bayesian estimation.</li>
</ol>
<p>Free companion text: <strong>Barbara Illowsky, Susan Dean — <em>Introductory Statistics 2e</em></strong>, OpenStax (Rice University), 2023, print ISBN 978-1-711472-57-7, digital ISBN 978-1-961584-32-7 — <a href="https://openstax.org/details/books/introductory-statistics-2e" target="_blank" rel="noopener">read free online</a>. Many lessons link to its chapters 8–13.</p>
<h3>🎓 Open courses &amp; notes</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/pages/readings/" target="_blank" rel="noopener">MIT OCW 18.05 — Introduction to Probability and Statistics (readings)</a>: the statistics half (readings 10–26) matches this course closely.</li>
<li><a href="https://ocw.mit.edu/courses/18-650-statistics-for-applications-fall-2016/" target="_blank" rel="noopener">MIT OCW 18.650 — Statistics for Applications</a> and its <a href="https://ocw.mit.edu/courses/18-650-statistics-for-applications-fall-2016/video_galleries/lecture-videos/" target="_blank" rel="noopener">lecture videos</a>: a more mathematical treatment of MLE, Fisher information, tests and regression.</li>
<li><a href="https://online.stat.psu.edu/stat415/" target="_blank" rel="noopener">Penn State STAT 415 — Introduction to Mathematical Statistics</a>: free online lessons on estimation, MLE, confidence intervals, tests, Bayes and regression.</li>
<li><a href="https://www.itl.nist.gov/div898/handbook/" target="_blank" rel="noopener">NIST/SEMATECH e-Handbook of Statistical Methods</a>: the engineering reference for every test in this course, with worked examples.</li>
<li><a href="https://www.coursera.org/learn/inferential-statistics-intro" target="_blank" rel="noopener">Coursera — Inferential Statistics (Duke University)</a>: an applied MOOC by an OpenIntro author.</li>
<li><a href="https://www.youtube.com/@statquest" target="_blank" rel="noopener">StatQuest with Josh Starmer (YouTube)</a>: short, very clear videos on p-values, MLE, regression and the bootstrap.</li>
<li><a href="https://seeing-theory.brown.edu/frequentist-inference/index.html" target="_blank" rel="noopener">Seeing Theory (Brown University) — Frequentist inference</a>: interactive pictures of confidence intervals and tests.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://docs.scipy.org/doc/scipy/tutorial/stats.html" target="_blank" rel="noopener">scipy.stats tutorial</a> — distributions, tests, bootstrap and permutation tests.</li>
<li><a href="https://www.statsmodels.org/stable/stats.html" target="_blank" rel="noopener">statsmodels — Statistics</a> and <a href="https://www.statsmodels.org/stable/regression.html" target="_blank" rel="noopener">statsmodels — Linear regression</a> — power analysis, proportion intervals, multiple testing, OLS, ANOVA tables.</li>
</ul>
<p>Setup used in this course: Python 3 with <code>pip install numpy scipy statsmodels pandas sympy</code>. The outputs shown were produced with scipy 1.18 and statsmodels 0.15; older versions can print slightly different formats but the same numbers.</p>
<div class="meo"><p><strong>Study plan.</strong> For each lesson: read the lesson here → run its code → read one linked section (OpenIntro, OpenStax or STAT 415) → do the 🧪 practice on paper → take the chapter quiz. About 6–8 hours per chapter.</p></div>`,
  `<span class="eyebrow">PSI221 · Mục 0 · Bài 0.2</span>
<h2>Giáo trình &amp; tài liệu học</h2>
<p class="lead">Khoá này bám thứ tự chương của các giáo trình chuẩn dưới đây. Bạn <strong>không</strong> cần mua sách: OpenIntro và OpenStax miễn phí, hợp pháp trên mạng, và mỗi bài đều dẫn tới các mục miễn phí tương ứng.</p>
<h3>📘 Giáo trình chính</h3>
<ol>
<li><strong>Larry Wasserman — <em>All of Statistics: A Concise Course in Statistical Inference</em>.</strong> Springer (bộ Springer Texts in Statistics), 2004. ISBN 978-0-387-40272-7. <a href="https://www.stat.cmu.edu/~larry/all-of-statistics/" target="_blank" rel="noopener">Trang sách của tác giả</a> (đính chính, dữ liệu). Ngắn gọn, hiện đại, viết cho sinh viên khoa học máy tính; thứ tự ước lượng → kiểm định → bootstrap → Bayes của khoá theo Phần II của sách.</li>
<li><strong>George Casella, Roger L. Berger — <em>Statistical Inference</em>, tái bản lần 2.</strong> Chapman &amp; Hall/CRC (bộ Texts in Statistical Science), bản in lại năm 2024 của ấn bản Duxbury (Cengage) phát hành lần đầu năm 2001. ISBN 978-1-032-59303-6 (bìa cứng). <a href="https://www.routledge.com/Statistical-Inference/Casella-Berger/p/book/9781032593036" target="_blank" rel="noopener">Trang nhà xuất bản</a>. Sách tham chiếu kinh điển về tính đủ, thông tin Fisher, cận Cramér–Rao và kiểm định tỉ số hợp lý (các chương 5–10).</li>
<li><strong>David Diez, Mine Çetinkaya-Rundel, Christopher Barr — <em>OpenIntro Statistics</em>, tái bản lần 4.</strong> OpenIntro, 2019. ISBN 978-1-943450-07-7 (bìa mềm); PDF miễn phí. <a href="https://www.openintro.org/book/os/" target="_blank" rel="noopener">Trang sách (tải miễn phí)</a>. Thiên ứng dụng, rất dễ đọc: khoảng tin cậy, kiểm định, χ², ANOVA và hồi quy với dữ liệu thật.</li>
<li><strong>Morris H. DeGroot, Mark J. Schervish — <em>Probability and Statistics</em>, tái bản lần 4.</strong> Addison-Wesley / Pearson, 2012. ISBN 978-0-321-50046-5. Con đường ở giữa OpenIntro và Casella–Berger, mạnh về ước lượng Bayes.</li>
</ol>
<p>Sách mở đi kèm: <strong>Barbara Illowsky, Susan Dean — <em>Introductory Statistics 2e</em></strong>, OpenStax (Đại học Rice), 2023, ISBN bản in 978-1-711472-57-7, ISBN bản số 978-1-961584-32-7 — <a href="https://openstax.org/details/books/introductory-statistics-2e" target="_blank" rel="noopener">đọc miễn phí</a>. Nhiều bài dẫn tới các chương 8–13 của sách.</p>
<h3>🎓 Khoá học mở &amp; ghi chú</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/pages/readings/" target="_blank" rel="noopener">MIT OCW 18.05 — Xác suất và thống kê nhập môn (bài đọc)</a>: nửa thống kê (bài đọc 10–26) khớp sát với khoá này.</li>
<li><a href="https://ocw.mit.edu/courses/18-650-statistics-for-applications-fall-2016/" target="_blank" rel="noopener">MIT OCW 18.650 — Statistics for Applications</a> và <a href="https://ocw.mit.edu/courses/18-650-statistics-for-applications-fall-2016/video_galleries/lecture-videos/" target="_blank" rel="noopener">video bài giảng</a>: cách trình bày toán học hơn về MLE, thông tin Fisher, kiểm định và hồi quy.</li>
<li><a href="https://online.stat.psu.edu/stat415/" target="_blank" rel="noopener">Penn State STAT 415 — Thống kê toán nhập môn</a>: bài học trực tuyến miễn phí về ước lượng, MLE, khoảng tin cậy, kiểm định, Bayes và hồi quy.</li>
<li><a href="https://www.itl.nist.gov/div898/handbook/" target="_blank" rel="noopener">NIST/SEMATECH e-Handbook of Statistical Methods</a>: sổ tay kỹ thuật cho mọi kiểm định trong khoá, có ví dụ giải sẵn.</li>
<li><a href="https://www.coursera.org/learn/inferential-statistics-intro" target="_blank" rel="noopener">Coursera — Inferential Statistics (Đại học Duke)</a>: MOOC ứng dụng của một tác giả OpenIntro.</li>
<li><a href="https://www.youtube.com/@statquest" target="_blank" rel="noopener">StatQuest với Josh Starmer (YouTube)</a>: video ngắn, rất dễ hiểu về p-value, MLE, hồi quy và bootstrap.</li>
<li><a href="https://seeing-theory.brown.edu/frequentist-inference/index.html" target="_blank" rel="noopener">Seeing Theory (Đại học Brown) — Suy luận tần suất</a>: hình ảnh tương tác về khoảng tin cậy và kiểm định.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://docs.scipy.org/doc/scipy/tutorial/stats.html" target="_blank" rel="noopener">Hướng dẫn scipy.stats</a> — phân phối, kiểm định, bootstrap và kiểm định hoán vị.</li>
<li><a href="https://www.statsmodels.org/stable/stats.html" target="_blank" rel="noopener">statsmodels — Statistics</a> và <a href="https://www.statsmodels.org/stable/regression.html" target="_blank" rel="noopener">statsmodels — Hồi quy tuyến tính</a> — phân tích lực, khoảng cho tỉ lệ, kiểm định bội, OLS, bảng ANOVA.</li>
</ul>
<p>Môi trường dùng trong khoá: Python 3 với <code>pip install numpy scipy statsmodels pandas sympy</code>. Output trong bài được tạo bằng scipy 1.18 và statsmodels 0.15; bản cũ hơn có thể in khác định dạng một chút nhưng cùng con số.</p>
<div class="meo"><p><strong>Kế hoạch học.</strong> Mỗi bài: đọc bài ở đây → chạy code → đọc một mục được dẫn (OpenIntro, OpenStax hoặc STAT 415) → làm 🧪 tự luyện ra giấy → làm quiz chương. Khoảng 6–8 giờ mỗi chương.</p></div>`);

const muc0 = {
  title: 'Section 0 — Course framework (self-authored, no FLM syllabus)|||Mục 0 — Khung môn học (tự soạn, trường chưa công bố syllabus)',
  description: 'Giới thiệu môn, chuẩn đầu ra tự soạn, nối tiếp IPY111, giáo trình chuẩn kèm ISBN và tài liệu mở. Trường chưa công bố syllabus PSI221 trên FLM — điểm/lịch thi theo giảng viên.',
  lessons: [m01, m02],
};


// ───────────────────────────── Chương 1 — Phân phối mẫu ─────────────────────────────
const c11 = L('psi221-ts-1-1',
  '1.1 — From probability to inference: populations, samples and statistics|||1.1 — Từ xác suất sang suy luận: tổng thể, mẫu và thống kê',
  'Tổng thể, tham số, mẫu i.i.d., thống kê; trung bình mẫu, phương sai mẫu chia n − 1 và vì sao; mô phỏng độ chệch khi chia n.',
  `<span class="eyebrow">PSI221 · Chapter 1 · Lesson 1.1</span>
<h2>From probability to inference: populations, samples and statistics</h2>
<p class="lead">Before we estimate or test anything we need a precise vocabulary: what is fixed but unknown (a parameter), what is random and observed (a sample), and what we compute from the sample (a statistic).</p>
<h3>🎯 Objectives</h3>
<ul><li>Distinguish population, parameter, sample and statistic.</li><li>State the i.i.d. sampling model X<sub>1</sub>, …, X<sub>n</sub> ~ F.</li><li>Compute the sample mean, sample variance and sample standard deviation.</li><li>Explain why the sample variance divides by n − 1.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>population</strong> is the whole set of values we care about — all response times your API will ever produce, all users of an app. A <strong>parameter</strong> is a fixed number that describes it, such as the mean μ, the variance σ<sup>2</sup> or a proportion p. Parameters are unknown. We observe a <strong>sample</strong> of n values and model it as <strong>independent and identically distributed (i.i.d.)</strong> random variables X<sub>1</sub>, …, X<sub>n</sub> with common distribution F. Once observed, the numbers x<sub>1</sub>, …, x<sub>n</sub> are fixed; before observation they are random — and that randomness is exactly what inference measures.</p>
<p>A <strong>statistic</strong> is any function of the sample that does not involve unknown parameters, for example</p>
<div class="formula"><span class="lbl">Sample mean and sample variance</span>X̄ = (1/n) ∑ X<sub>i</sub>      S<sup>2</sup> = (1/(n − 1)) ∑ (X<sub>i</sub> − X̄)<sup>2</sup>      S = √S<sup>2</sup></div>
<p>Because a statistic is computed from random variables, it is itself a random variable with its own distribution, called the <strong>sampling distribution</strong> (next lesson). When a statistic is used to guess a parameter it is called an <strong>estimator</strong>: X̄ estimates μ, S<sup>2</sup> estimates σ<sup>2</sup>.</p>
<p><strong>Why n − 1?</strong> The deviations X<sub>i</sub> − X̄ are measured from X̄, which is itself pulled towards the data, so they are on average a little too small. One can show (using E[X<sub>i</sub><sup>2</sup>] = σ<sup>2</sup> + μ<sup>2</sup> and Var(X̄) = σ<sup>2</sup>/n from IPY111) that E[∑(X<sub>i</sub> − X̄)<sup>2</sup>] = (n − 1)σ<sup>2</sup>. Dividing by n − 1 therefore makes E[S<sup>2</sup>] = σ<sup>2</sup> exactly; dividing by n gives an average of ((n − 1)/n)σ<sup>2</sup>. The number n − 1 is called the <strong>degrees of freedom</strong>: once X̄ is fixed, only n − 1 deviations are free (they must sum to 0).</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — API response times.</b> Eight requests took 112, 98, 105, 120, 101, 97, 110, 113 ms.</p>
<p>Step 1: x̄ = 856/8 = <b>107</b> ms. Step 2: deviations 5, −9, −2, 13, −6, −10, 3, 6; their squares sum to 460. Step 3: s<sup>2</sup> = 460/7 = <b>65.71</b> ms<sup>2</sup>, s = <b>8.11</b> ms. Dividing by 8 would give 57.5 — too small on average.</p></div>
<pre><code class="language-python">import numpy as np

x = np.array([112, 98, 105, 120, 101, 97, 110, 113])   # API response times (ms)
print("mean        :", x.mean())
print("S^2 (n-1)   :", round(x.var(ddof=1), 4))
print("S           :", round(x.std(ddof=1), 4))
print("divide by n :", x.var(ddof=0))

# Why n-1? Simulate 100,000 samples of size 5 from N(0, sd=2), true variance 4
rng = np.random.default_rng(0)
samples = rng.normal(0, 2, size=(100_000, 5))
print("average of /n     estimates:", round(samples.var(axis=1, ddof=0).mean(), 3))
print("average of /(n-1) estimates:", round(samples.var(axis=1, ddof=1).mean(), 3))</code></pre>
<div class="out">mean        : 107.0
S^2 (n-1)   : 65.7143
S           : 8.1064
divide by n : 57.5
average of /n     estimates: 3.21
average of /(n-1) estimates: 4.012</div>
<p>The simulation uses samples of size 5 from a distribution with true variance 4: the “divide by n” estimates average 3.21 ≈ (4/5)·4 = 3.2, while the n − 1 version averages 4.01.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Mixing up μ (parameter, fixed) and x̄ (statistic, changes with the sample).</li><li>Using <code>np.var(x)</code> without <code>ddof=1</code> — NumPy divides by n by default; pandas <code>.var()</code> divides by n − 1. Know your library.</li><li>Calling a sample “random” when it is a convenience sample (e.g. only users who answered a survey). The i.i.d. model is an assumption you must justify.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Parameter = fixed unknown property of the population; statistic = computed from the sample.</li><li>Model: X<sub>1</sub>, …, X<sub>n</sub> i.i.d. from F.</li><li>X̄ estimates μ; S<sup>2</sup> with divisor n − 1 is unbiased for σ<sup>2</sup>.</li><li>A statistic is a random variable; its distribution is the sampling distribution.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class10-prep-a_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 10a: Introduction to Statistics</a></li><li><a href="https://www.youtube.com/watch?v=sHRBg6BhKjI" target="_blank" rel="noopener">StatQuest — Why dividing by N underestimates the variance</a></li><li><a href="https://online.stat.psu.edu/stat415/Lesson00.html" target="_blank" rel="noopener">Penn State STAT 415 — Lesson 0: Review of probability concepts</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>For the data 4, 7, 7, 10 compute x̄, s<sup>2</sup> and the divide-by-n variance.</li><li>Which are statistics: (a) X̄ − μ, (b) max X<sub>i</sub>, (c) ∑X<sub>i</sub><sup>2</sup>/n?</li><li>If n = 2, show that S<sup>2</sup> = (X<sub>1</sub> − X<sub>2</sub>)<sup>2</sup>/2.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) x̄ = 7; squared deviations 9, 0, 0, 9 sum to 18; s<sup>2</sup> = 18/3 = 6; divide-by-n gives 4.5. 2) (b) and (c) are statistics; (a) contains the unknown μ, so it is not. 3) X̄ = (X<sub>1</sub> + X<sub>2</sub>)/2, each deviation is ±(X<sub>1</sub> − X<sub>2</sub>)/2, so the sum of squares is (X<sub>1</sub> − X<sub>2</sub>)<sup>2</sup>/2 and dividing by n − 1 = 1 leaves it unchanged.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 1 · Bài 1.1</span>
<h2>Từ xác suất sang suy luận: tổng thể, mẫu và thống kê</h2>
<p class="lead">Trước khi ước lượng hay kiểm định điều gì, ta cần bộ từ vựng chính xác: cái gì cố định nhưng chưa biết (tham số), cái gì ngẫu nhiên và quan sát được (mẫu), và ta tính gì từ mẫu (thống kê).</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phân biệt tổng thể, tham số, mẫu và thống kê.</li><li>Phát biểu mô hình lấy mẫu i.i.d. X<sub>1</sub>, …, X<sub>n</sub> ~ F.</li><li>Tính trung bình mẫu, phương sai mẫu và độ lệch chuẩn mẫu.</li><li>Giải thích vì sao phương sai mẫu chia cho n − 1.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Tổng thể</strong> là toàn bộ các giá trị ta quan tâm — mọi thời gian phản hồi API sẽ tạo ra, mọi người dùng của một ứng dụng. <strong>Tham số</strong> là một con số cố định mô tả tổng thể, như trung bình μ, phương sai σ<sup>2</sup> hay một tỉ lệ p. Tham số chưa biết. Ta quan sát một <strong>mẫu</strong> gồm n giá trị và mô hình hoá nó bằng các biến ngẫu nhiên <strong>độc lập, cùng phân phối (i.i.d.)</strong> X<sub>1</sub>, …, X<sub>n</sub> có chung phân phối F. Sau khi quan sát, các số x<sub>1</sub>, …, x<sub>n</sub> là cố định; trước khi quan sát chúng ngẫu nhiên — và chính tính ngẫu nhiên đó là thứ suy luận đo lường.</p>
<p><strong>Thống kê</strong> là mọi hàm của mẫu không chứa tham số chưa biết, ví dụ</p>
<div class="formula"><span class="lbl">Trung bình mẫu và phương sai mẫu</span>X̄ = (1/n) ∑ X<sub>i</sub>      S<sup>2</sup> = (1/(n − 1)) ∑ (X<sub>i</sub> − X̄)<sup>2</sup>      S = √S<sup>2</sup></div>
<p>Vì thống kê được tính từ các biến ngẫu nhiên nên bản thân nó là một biến ngẫu nhiên với phân phối riêng, gọi là <strong>phân phối mẫu</strong> (bài sau). Khi một thống kê được dùng để đoán tham số, ta gọi nó là <strong>ước lượng</strong> (estimator): X̄ ước lượng μ, S<sup>2</sup> ước lượng σ<sup>2</sup>.</p>
<p><strong>Vì sao n − 1?</strong> Các độ lệch X<sub>i</sub> − X̄ được đo từ X̄, mà X̄ lại bị kéo về phía dữ liệu, nên trung bình chúng hơi nhỏ quá. Có thể chứng minh (dùng E[X<sub>i</sub><sup>2</sup>] = σ<sup>2</sup> + μ<sup>2</sup> và Var(X̄) = σ<sup>2</sup>/n từ IPY111) rằng E[∑(X<sub>i</sub> − X̄)<sup>2</sup>] = (n − 1)σ<sup>2</sup>. Vậy chia cho n − 1 cho đúng E[S<sup>2</sup>] = σ<sup>2</sup>; chia cho n thì trung bình chỉ được ((n − 1)/n)σ<sup>2</sup>. Số n − 1 gọi là <strong>bậc tự do</strong>: khi X̄ đã cố định, chỉ n − 1 độ lệch là tự do (tổng của chúng phải bằng 0).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — thời gian phản hồi API.</b> Tám request mất 112, 98, 105, 120, 101, 97, 110, 113 ms.</p>
<p>Bước 1: x̄ = 856/8 = <b>107</b> ms. Bước 2: độ lệch 5, −9, −2, 13, −6, −10, 3, 6; tổng bình phương là 460. Bước 3: s<sup>2</sup> = 460/7 = <b>65,71</b> ms<sup>2</sup>, s = <b>8,11</b> ms. Chia cho 8 sẽ được 57,5 — trung bình là nhỏ quá.</p></div>
<pre><code class="language-python">import numpy as np

x = np.array([112, 98, 105, 120, 101, 97, 110, 113])   # API response times (ms)
print("mean        :", x.mean())
print("S^2 (n-1)   :", round(x.var(ddof=1), 4))
print("S           :", round(x.std(ddof=1), 4))
print("divide by n :", x.var(ddof=0))

# Why n-1? Simulate 100,000 samples of size 5 from N(0, sd=2), true variance 4
rng = np.random.default_rng(0)
samples = rng.normal(0, 2, size=(100_000, 5))
print("average of /n     estimates:", round(samples.var(axis=1, ddof=0).mean(), 3))
print("average of /(n-1) estimates:", round(samples.var(axis=1, ddof=1).mean(), 3))</code></pre>
<div class="out">mean        : 107.0
S^2 (n-1)   : 65.7143
S           : 8.1064
divide by n : 57.5
average of /n     estimates: 3.21
average of /(n-1) estimates: 4.012</div>
<p>Mô phỏng dùng các mẫu cỡ 5 từ phân phối có phương sai thật bằng 4: ước lượng “chia n” trung bình 3,21 ≈ (4/5)·4 = 3,2, còn bản chia n − 1 trung bình 4,01.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nhầm μ (tham số, cố định) với x̄ (thống kê, đổi theo mẫu).</li><li>Dùng <code>np.var(x)</code> mà quên <code>ddof=1</code> — NumPy mặc định chia n; pandas <code>.var()</code> mặc định chia n − 1. Phải biết thư viện của mình.</li><li>Gọi một mẫu là “ngẫu nhiên” khi nó chỉ là mẫu tiện lợi (vd chỉ những người chịu trả lời khảo sát). Mô hình i.i.d. là một giả định bạn phải biện minh.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tham số = tính chất cố định, chưa biết của tổng thể; thống kê = tính từ mẫu.</li><li>Mô hình: X<sub>1</sub>, …, X<sub>n</sub> i.i.d. từ F.</li><li>X̄ ước lượng μ; S<sup>2</sup> chia n − 1 là ước lượng không chệch của σ<sup>2</sup>.</li><li>Thống kê là biến ngẫu nhiên; phân phối của nó là phân phối mẫu.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class10-prep-a_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 10a: Nhập môn thống kê</a></li><li><a href="https://www.youtube.com/watch?v=sHRBg6BhKjI" target="_blank" rel="noopener">StatQuest — Vì sao chia N làm phương sai bị đánh giá thấp</a></li><li><a href="https://online.stat.psu.edu/stat415/Lesson00.html" target="_blank" rel="noopener">Penn State STAT 415 — Bài 0: Ôn khái niệm xác suất</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Với dữ liệu 4, 7, 7, 10 hãy tính x̄, s<sup>2</sup> và phương sai chia n.</li><li>Cái nào là thống kê: (a) X̄ − μ, (b) max X<sub>i</sub>, (c) ∑X<sub>i</sub><sup>2</sup>/n?</li><li>Với n = 2, chứng minh S<sup>2</sup> = (X<sub>1</sub> − X<sub>2</sub>)<sup>2</sup>/2.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) x̄ = 7; bình phương độ lệch 9, 0, 0, 9 tổng 18; s<sup>2</sup> = 18/3 = 6; chia n được 4,5. 2) (b) và (c) là thống kê; (a) chứa μ chưa biết nên không phải. 3) X̄ = (X<sub>1</sub> + X<sub>2</sub>)/2, mỗi độ lệch bằng ±(X<sub>1</sub> − X<sub>2</sub>)/2, nên tổng bình phương là (X<sub>1</sub> − X<sub>2</sub>)<sup>2</sup>/2; chia cho n − 1 = 1 thì giữ nguyên.</p></div>`);

const c12 = L('psi221-ts-1-2',
  '1.2 — The sampling distribution of the mean and the standard error|||1.2 — Phân phối mẫu của trung bình và sai số chuẩn',
  'E[X̄] = μ, Var(X̄) = σ²/n, sai số chuẩn SE = s/√n, phân phối mẫu của tỉ lệ p̂, nhắc CLT (IPY111) qua mô phỏng phân phối mũ.',
  `<span class="eyebrow">PSI221 · Chapter 1 · Lesson 1.2</span>
<h2>The sampling distribution of the mean and the standard error</h2>
<p class="lead">If you repeated your experiment many times, x̄ would change every time. How much it changes — its standard deviation — is the single most important number in applied statistics: the <strong>standard error</strong>.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the mean and variance of X̄ and of a sample proportion p̂.</li><li>Distinguish the standard deviation σ of the data from the standard error σ/√n of X̄.</li><li>Use the CLT to compute approximate probabilities for X̄ and p̂.</li></ul>
<h3>📖 Lecture</h3>
<p>For an i.i.d. sample with mean μ and variance σ<sup>2</sup> (IPY111, Chapters 6 and 10):</p>
<div class="formula"><span class="lbl">Sampling distribution of X̄</span>E[X̄] = μ      Var(X̄) = σ<sup>2</sup>/n      SD(X̄) = σ/√n<br>if the data are normal: X̄ ~ N(μ, σ<sup>2</sup>/n) exactly;  otherwise, for large n: X̄ ≈ N(μ, σ<sup>2</sup>/n)  (CLT)</div>
<p>The standard deviation of an estimator is called its <strong>standard error</strong> (SE). In practice σ is unknown, so we plug in s and report the <strong>estimated</strong> standard error SE = s/√n. The √n is the price of precision: to halve the SE you need <strong>four times</strong> as much data.</p>
<p>A <strong>proportion</strong> is a mean of 0/1 variables. If Y<sub>i</sub> ~ Bernoulli(p), then p̂ = ∑Y<sub>i</sub>/n has</p>
<div class="formula"><span class="lbl">Sampling distribution of p̂</span>E[p̂] = p      SE(p̂) = √(p(1 − p)/n)      p̂ ≈ N(p, p(1 − p)/n) when np ≥ 10 and n(1 − p) ≥ 10</div>
<p><strong>How large is “large n”?</strong> It depends on the skewness of the population. For symmetric data n = 10 is already fine; for a very skewed distribution (exponential, incomes, session lengths) you may need n ≥ 30 or more. The simulation below starts from an exponential population (skewness 2) and watches the skewness of X̄ shrink like 2/√n.</p>
<pre><code class="language-python">import numpy as np
from scipy import stats

rng = np.random.default_rng(1)
# population: Exponential(mean 1), strongly right-skewed (sd = 1)
for n in [1, 5, 30]:
    means = rng.exponential(1.0, size=(100_000, n)).mean(axis=1)
    print(f"n={n:2d}: mean of xbar={means.mean():.3f}  sd of xbar={means.std():.3f}"
          f"  sigma/sqrt(n)={1/np.sqrt(n):.3f}  skewness={stats.skew(means):.2f}")</code></pre>
<div class="out">n= 1: mean of xbar=0.996  sd of xbar=0.992  sigma/sqrt(n)=1.000  skewness=1.99
n= 5: mean of xbar=0.997  sd of xbar=0.447  sigma/sqrt(n)=0.447  skewness=0.91
n=30: mean of xbar=1.001  sd of xbar=0.182  sigma/sqrt(n)=0.183  skewness=0.36</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — delivery time.</b> Delivery times have μ = 30 min and σ = 8 min. For a random sample of n = 64 orders, find P(X̄ &gt; 32).</p>
<p>SE = 8/√64 = 1. By the CLT, z = (32 − 30)/1 = 2, so P(X̄ &gt; 32) ≈ P(Z &gt; 2) = <b>0.0228</b>. A single order exceeding 32 minutes is common; an <em>average</em> of 64 orders exceeding 32 is rare.</p></div>
<div class="callout"><p><b>Example 2 — proportion.</b> 30% of users enable dark mode. In a sample of n = 200, what is P(p̂ &lt; 0.25)?</p>
<p>Check: np = 60 ≥ 10 and n(1 − p) = 140 ≥ 10. SE = √(0.3·0.7/200) = 0.0324. z = (0.25 − 0.30)/0.0324 = −1.543, so P ≈ Φ(−1.543) = <b>0.0614</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using σ instead of σ/√n when asking about an average.</li><li>Believing the CLT makes the <em>data</em> normal. It makes X̄ approximately normal; the data keep their shape.</li><li>Applying the n ≥ 30 rule blindly to extremely skewed or heavy-tailed data (e.g. revenue with a few huge purchases).</li><li>Forgetting independence: 64 orders from the same customer on the same day are not 64 independent observations.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>E[X̄] = μ and SD(X̄) = σ/√n; the estimated version s/√n is the standard error.</li><li>X̄ is exactly normal for normal data, approximately normal for large n (CLT).</li><li>p̂ has SE √(p(1 − p)/n); use the normal approximation when np and n(1 − p) are at least 10.</li><li>Precision grows like √n.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/7-1-the-central-limit-theorem-for-sample-means-averages" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 7.1 The CLT for sample means</a></li><li><a href="https://www.youtube.com/watch?v=XNgt7F6FqDU" target="_blank" rel="noopener">StatQuest — The standard error, clearly explained</a></li><li><a href="https://online.stat.psu.edu/stat500/Lesson04.html" target="_blank" rel="noopener">Penn State STAT 500 — Lesson 4: Sampling distributions</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Battery life has σ = 40 min. How large must n be so that SD(X̄) ≤ 5 min?</li><li>A server's request size has μ = 200 KB, σ = 120 KB. For n = 144 requests, approximate P(X̄ &gt; 220).</li><li>p = 0.1, n = 50. Is the normal approximation for p̂ justified?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 40/√n ≤ 5 ⇒ √n ≥ 8 ⇒ n ≥ 64. 2) SE = 120/12 = 10, z = 2, P ≈ 0.0228. 3) np = 5 &lt; 10: no — use the exact binomial distribution (Lesson 6.1).</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 1 · Bài 1.2</span>
<h2>Phân phối mẫu của trung bình và sai số chuẩn</h2>
<p class="lead">Nếu lặp lại thí nghiệm nhiều lần, x̄ sẽ đổi mỗi lần. Nó đổi nhiều cỡ nào — độ lệch chuẩn của nó — là con số quan trọng nhất của thống kê ứng dụng: <strong>sai số chuẩn</strong>.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu kỳ vọng và phương sai của X̄ và của tỉ lệ mẫu p̂.</li><li>Phân biệt độ lệch chuẩn σ của dữ liệu với sai số chuẩn σ/√n của X̄.</li><li>Dùng CLT tính xấp xỉ xác suất cho X̄ và p̂.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Với mẫu i.i.d. có trung bình μ và phương sai σ<sup>2</sup> (IPY111, Chương 6 và 10):</p>
<div class="formula"><span class="lbl">Phân phối mẫu của X̄</span>E[X̄] = μ      Var(X̄) = σ<sup>2</sup>/n      SD(X̄) = σ/√n<br>nếu dữ liệu chuẩn: X̄ ~ N(μ, σ<sup>2</sup>/n) chính xác;  ngược lại, với n lớn: X̄ ≈ N(μ, σ<sup>2</sup>/n)  (CLT)</div>
<p>Độ lệch chuẩn của một ước lượng gọi là <strong>sai số chuẩn</strong> (standard error, SE). Thực tế σ chưa biết, nên ta thay bằng s và báo cáo sai số chuẩn <strong>ước lượng</strong> SE = s/√n. Căn √n là cái giá của độ chính xác: muốn SE giảm một nửa phải có dữ liệu <strong>gấp bốn</strong>.</p>
<p><strong>Tỉ lệ</strong> là trung bình của các biến 0/1. Nếu Y<sub>i</sub> ~ Bernoulli(p) thì p̂ = ∑Y<sub>i</sub>/n có</p>
<div class="formula"><span class="lbl">Phân phối mẫu của p̂</span>E[p̂] = p      SE(p̂) = √(p(1 − p)/n)      p̂ ≈ N(p, p(1 − p)/n) khi np ≥ 10 và n(1 − p) ≥ 10</div>
<p><strong>“n lớn” là bao nhiêu?</strong> Tuỳ độ lệch (skewness) của tổng thể. Dữ liệu đối xứng thì n = 10 đã ổn; phân phối rất lệch (mũ, thu nhập, độ dài phiên) có thể cần n ≥ 30 hoặc hơn. Mô phỏng dưới đây xuất phát từ tổng thể mũ (skewness 2) và quan sát skewness của X̄ giảm như 2/√n.</p>
<pre><code class="language-python">import numpy as np
from scipy import stats

rng = np.random.default_rng(1)
# population: Exponential(mean 1), strongly right-skewed (sd = 1)
for n in [1, 5, 30]:
    means = rng.exponential(1.0, size=(100_000, n)).mean(axis=1)
    print(f"n={n:2d}: mean of xbar={means.mean():.3f}  sd of xbar={means.std():.3f}"
          f"  sigma/sqrt(n)={1/np.sqrt(n):.3f}  skewness={stats.skew(means):.2f}")</code></pre>
<div class="out">n= 1: mean of xbar=0.996  sd of xbar=0.992  sigma/sqrt(n)=1.000  skewness=1.99
n= 5: mean of xbar=0.997  sd of xbar=0.447  sigma/sqrt(n)=0.447  skewness=0.91
n=30: mean of xbar=1.001  sd of xbar=0.182  sigma/sqrt(n)=0.183  skewness=0.36</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — thời gian giao hàng.</b> Thời gian giao có μ = 30 phút, σ = 8 phút. Với mẫu ngẫu nhiên n = 64 đơn, tính P(X̄ &gt; 32).</p>
<p>SE = 8/√64 = 1. Theo CLT, z = (32 − 30)/1 = 2, nên P(X̄ &gt; 32) ≈ P(Z &gt; 2) = <b>0,0228</b>. Một đơn lẻ quá 32 phút là chuyện thường; <em>trung bình</em> 64 đơn quá 32 phút thì hiếm.</p></div>
<div class="callout"><p><b>Ví dụ 2 — tỉ lệ.</b> 30% người dùng bật chế độ tối. Với mẫu n = 200, P(p̂ &lt; 0,25) bằng bao nhiêu?</p>
<p>Kiểm tra: np = 60 ≥ 10 và n(1 − p) = 140 ≥ 10. SE = √(0,3·0,7/200) = 0,0324. z = (0,25 − 0,30)/0,0324 = −1,543, nên P ≈ Φ(−1,543) = <b>0,0614</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng σ thay vì σ/√n khi hỏi về một trung bình.</li><li>Tưởng CLT làm <em>dữ liệu</em> thành chuẩn. Nó làm X̄ xấp xỉ chuẩn; dữ liệu vẫn giữ hình dạng cũ.</li><li>Áp quy tắc n ≥ 30 một cách máy móc cho dữ liệu cực lệch hoặc đuôi nặng (vd doanh thu có vài đơn rất lớn).</li><li>Quên tính độc lập: 64 đơn của cùng một khách trong cùng một ngày không phải 64 quan sát độc lập.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>E[X̄] = μ và SD(X̄) = σ/√n; bản ước lượng s/√n là sai số chuẩn.</li><li>X̄ chuẩn chính xác với dữ liệu chuẩn, xấp xỉ chuẩn khi n lớn (CLT).</li><li>p̂ có SE √(p(1 − p)/n); dùng xấp xỉ chuẩn khi np và n(1 − p) ít nhất 10.</li><li>Độ chính xác tăng như √n.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/7-1-the-central-limit-theorem-for-sample-means-averages" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 7.1 CLT cho trung bình mẫu</a></li><li><a href="https://www.youtube.com/watch?v=XNgt7F6FqDU" target="_blank" rel="noopener">StatQuest — Sai số chuẩn, giải thích rõ ràng</a></li><li><a href="https://online.stat.psu.edu/stat500/Lesson04.html" target="_blank" rel="noopener">Penn State STAT 500 — Bài 4: Phân phối mẫu</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Thời lượng pin có σ = 40 phút. Cần n bao nhiêu để SD(X̄) ≤ 5 phút?</li><li>Kích thước request của một server có μ = 200 KB, σ = 120 KB. Với n = 144 request, xấp xỉ P(X̄ &gt; 220).</li><li>p = 0,1, n = 50. Có được dùng xấp xỉ chuẩn cho p̂ không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 40/√n ≤ 5 ⇒ √n ≥ 8 ⇒ n ≥ 64. 2) SE = 120/12 = 10, z = 2, P ≈ 0,0228. 3) np = 5 &lt; 10: không — dùng phân phối nhị thức chính xác (Bài 6.1).</p></div>`);

const c13 = L('psi221-ts-1-3',
  '1.3 — The chi-square distribution and the sample variance|||1.3 — Phân phối chi bình phương và phương sai mẫu',
  'χ²(k) là tổng bình phương k biến chuẩn tắc; kỳ vọng k, phương sai 2k; định lý (n − 1)S²/σ² ~ χ²(n − 1), X̄ độc lập S²; tính xác suất cho S².',
  `<span class="eyebrow">PSI221 · Chapter 1 · Lesson 1.3</span>
<h2>The chi-square distribution and the sample variance</h2>
<p class="lead">The sample mean has a normal sampling distribution. The sample variance does not — it is skewed and never negative. Its distribution, after scaling, is the <strong>chi-square</strong> distribution, which will return in variance intervals, goodness-of-fit tests and ANOVA.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define χ<sup>2</sup>(k) and state its mean and variance.</li><li>State the key theorem for normal samples: (n − 1)S<sup>2</sup>/σ<sup>2</sup> ~ χ<sup>2</sup>(n − 1), independent of X̄.</li><li>Compute probabilities and quantiles for S<sup>2</sup> with <code>scipy.stats.chi2</code>.</li></ul>
<h3>📖 Lecture</h3>
<p>If Z<sub>1</sub>, …, Z<sub>k</sub> are independent N(0, 1), then</p>
<div class="formula"><span class="lbl">Chi-square with k degrees of freedom</span>V = Z<sub>1</sub><sup>2</sup> + Z<sub>2</sub><sup>2</sup> + … + Z<sub>k</sub><sup>2</sup> ~ χ<sup>2</sup>(k)      E[V] = k      Var(V) = 2k<br>χ<sup>2</sup>(k) is the Gamma distribution with shape k/2 and scale 2</div>
<p>Since E[Z<sup>2</sup>] = 1 and Var(Z<sup>2</sup>) = 2, the mean and variance follow by adding. The density lives on (0, ∞), is right-skewed for small k and becomes more symmetric (approximately N(k, 2k)) as k grows. Sums of independent chi-squares add their degrees of freedom.</p>
<p>The central result of normal-sample theory (Casella–Berger, Theorem 5.3.1):</p>
<div class="formula"><span class="lbl">Sampling distribution of S² (normal data)</span>If X<sub>1</sub>, …, X<sub>n</sub> i.i.d. N(μ, σ<sup>2</sup>):   (n − 1)S<sup>2</sup>/σ<sup>2</sup> ~ χ<sup>2</sup>(n − 1)   and   X̄ and S<sup>2</sup> are independent.</div>
<p>Intuition for n − 1: ∑((X<sub>i</sub> − μ)/σ)<sup>2</sup> would be χ<sup>2</sup>(n), but replacing μ by X̄ uses up one degree of freedom. From the theorem, E[S<sup>2</sup>] = σ<sup>2</sup> (unbiased, as in 1.1) and Var(S<sup>2</sup>) = 2σ<sup>4</sup>/(n − 1). The independence of X̄ and S<sup>2</sup> is special to the normal distribution, and it is what makes the t statistic of the next lesson work.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — is the process too variable?</b> A sensor's readings are N(μ, σ<sup>2</sup>) with σ<sup>2</sup> = 4. You take n = 10 readings. What is P(S<sup>2</sup> &gt; 6)?</p>
<p>Step 1: convert to the chi-square scale: (n − 1)S<sup>2</sup>/σ<sup>2</sup> &gt; 9·6/4 = 13.5. Step 2: P(χ<sup>2</sup>(9) &gt; 13.5) = <b>0.141</b>. So a sample variance 50% above the true value is not unusual with only 10 readings. Step 3 (the reverse): 95% of the time 9S<sup>2</sup>/4 lies between the quantiles 2.700 and 19.023, i.e. S<sup>2</sup> between 1.20 and 8.45. Variances are estimated much less precisely than means.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

rng = np.random.default_rng(2)
n, sigma2 = 10, 4.0
samples = rng.normal(5, np.sqrt(sigma2), size=(100_000, n))
Q = (n - 1) * samples.var(axis=1, ddof=1) / sigma2      # should be chi-square(9)
print(f"simulated mean of Q = {Q.mean():.3f}  (theory {n - 1})")
print(f"simulated var of Q  = {Q.var():.3f}  (theory {2 * (n - 1)})")
print(f"P(S^2 &gt; 6): simulated {np.mean(Q &gt; 13.5):.4f}, exact {stats.chi2.sf(13.5, n - 1):.4f}")
print("chi2(9) 2.5% and 97.5% quantiles:", stats.chi2.ppf([0.025, 0.975], n - 1).round(3))</code></pre>
<div class="out">simulated mean of Q = 8.994  (theory 9)
simulated var of Q  = 17.875  (theory 18)
P(S^2 &gt; 6): simulated 0.1411, exact 0.1413
chi2(9) 2.5% and 97.5% quantiles: [ 2.7   19.023]</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using χ<sup>2</sup>(n) instead of χ<sup>2</sup>(n − 1).</li><li>Applying the χ<sup>2</sup> result to non-normal data. Unlike the CLT for X̄, this result is <strong>not robust</strong>: with heavy-tailed data the true spread of S<sup>2</sup> can be far larger.</li><li>Reading the chi-square table as two-sided symmetric: the 2.5% and 97.5% quantiles are not at equal distances from the mean.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>χ<sup>2</sup>(k) = sum of k squared independent standard normals; mean k, variance 2k.</li><li>For normal samples, (n − 1)S<sup>2</sup>/σ<sup>2</sup> ~ χ<sup>2</sup>(n − 1) and X̄ ⫫ S<sup>2</sup>.</li><li>Var(S<sup>2</sup>) = 2σ<sup>4</sup>/(n − 1): variances need much more data than means.</li><li>Use <code>stats.chi2.sf</code>, <code>.cdf</code>, <code>.ppf</code> for probabilities and quantiles.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/11-1-facts-about-the-chi-square-distribution" target="_blank" rel="noopener">OpenStax — 11.1 Facts about the chi-square distribution</a></li><li><a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda3666.htm" target="_blank" rel="noopener">NIST e-Handbook — Chi-square distribution</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.chi2.html" target="_blank" rel="noopener">SciPy — scipy.stats.chi2</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>If V ~ χ<sup>2</sup>(12), find E[V] and SD(V).</li><li>n = 10 normal readings with σ<sup>2</sup> = 4. Find P(S<sup>2</sup> &lt; 2).</li><li>Why can a χ<sup>2</sup> random variable never be negative?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) E[V] = 12, SD = √24 ≈ 4.90. 2) P(χ<sup>2</sup>(9) &lt; 9·2/4 = 4.5) = <code>stats.chi2.cdf(4.5, 9)</code> ≈ 0.124. 3) It is a sum of squares.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 1 · Bài 1.3</span>
<h2>Phân phối chi bình phương và phương sai mẫu</h2>
<p class="lead">Trung bình mẫu có phân phối mẫu chuẩn. Phương sai mẫu thì không — nó lệch và không bao giờ âm. Sau khi nhân hệ số, phân phối của nó là <strong>chi bình phương</strong>, sẽ còn quay lại trong khoảng tin cậy cho phương sai, kiểm định phù hợp và ANOVA.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa χ<sup>2</sup>(k), nêu kỳ vọng và phương sai.</li><li>Phát biểu định lý then chốt cho mẫu chuẩn: (n − 1)S<sup>2</sup>/σ<sup>2</sup> ~ χ<sup>2</sup>(n − 1), độc lập với X̄.</li><li>Tính xác suất và phân vị cho S<sup>2</sup> bằng <code>scipy.stats.chi2</code>.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Nếu Z<sub>1</sub>, …, Z<sub>k</sub> độc lập, cùng N(0, 1) thì</p>
<div class="formula"><span class="lbl">Chi bình phương k bậc tự do</span>V = Z<sub>1</sub><sup>2</sup> + Z<sub>2</sub><sup>2</sup> + … + Z<sub>k</sub><sup>2</sup> ~ χ<sup>2</sup>(k)      E[V] = k      Var(V) = 2k<br>χ<sup>2</sup>(k) chính là phân phối Gamma với tham số hình dạng k/2 và tỉ lệ 2</div>
<p>Vì E[Z<sup>2</sup>] = 1 và Var(Z<sup>2</sup>) = 2, cộng lại là ra kỳ vọng và phương sai. Hàm mật độ nằm trên (0, ∞), lệch phải khi k nhỏ và đối xứng dần (xấp xỉ N(k, 2k)) khi k lớn. Tổng các chi bình phương độc lập thì cộng bậc tự do.</p>
<p>Kết quả trung tâm của lý thuyết mẫu chuẩn (Casella–Berger, Định lý 5.3.1):</p>
<div class="formula"><span class="lbl">Phân phối mẫu của S² (dữ liệu chuẩn)</span>Nếu X<sub>1</sub>, …, X<sub>n</sub> i.i.d. N(μ, σ<sup>2</sup>):   (n − 1)S<sup>2</sup>/σ<sup>2</sup> ~ χ<sup>2</sup>(n − 1)   và   X̄, S<sup>2</sup> độc lập.</div>
<p>Trực giác về n − 1: ∑((X<sub>i</sub> − μ)/σ)<sup>2</sup> sẽ là χ<sup>2</sup>(n), nhưng thay μ bằng X̄ thì mất một bậc tự do. Từ định lý suy ra E[S<sup>2</sup>] = σ<sup>2</sup> (không chệch, như bài 1.1) và Var(S<sup>2</sup>) = 2σ<sup>4</sup>/(n − 1). Tính độc lập giữa X̄ và S<sup>2</sup> là đặc thù của phân phối chuẩn, và chính nó làm thống kê t ở bài sau hoạt động.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — quy trình có dao động quá mức?</b> Số đọc cảm biến ~ N(μ, σ<sup>2</sup>) với σ<sup>2</sup> = 4. Lấy n = 10 số đọc. Tính P(S<sup>2</sup> &gt; 6).</p>
<p>Bước 1: đổi sang thang chi bình phương: (n − 1)S<sup>2</sup>/σ<sup>2</sup> &gt; 9·6/4 = 13,5. Bước 2: P(χ<sup>2</sup>(9) &gt; 13,5) = <b>0,141</b>. Vậy phương sai mẫu cao hơn giá trị thật 50% không có gì lạ khi chỉ có 10 số đọc. Bước 3 (chiều ngược): 95% số lần 9S<sup>2</sup>/4 nằm giữa hai phân vị 2,700 và 19,023, tức S<sup>2</sup> nằm giữa 1,20 và 8,45. Phương sai được ước lượng kém chính xác hơn trung bình rất nhiều.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

rng = np.random.default_rng(2)
n, sigma2 = 10, 4.0
samples = rng.normal(5, np.sqrt(sigma2), size=(100_000, n))
Q = (n - 1) * samples.var(axis=1, ddof=1) / sigma2      # should be chi-square(9)
print(f"simulated mean of Q = {Q.mean():.3f}  (theory {n - 1})")
print(f"simulated var of Q  = {Q.var():.3f}  (theory {2 * (n - 1)})")
print(f"P(S^2 &gt; 6): simulated {np.mean(Q &gt; 13.5):.4f}, exact {stats.chi2.sf(13.5, n - 1):.4f}")
print("chi2(9) 2.5% and 97.5% quantiles:", stats.chi2.ppf([0.025, 0.975], n - 1).round(3))</code></pre>
<div class="out">simulated mean of Q = 8.994  (theory 9)
simulated var of Q  = 17.875  (theory 18)
P(S^2 &gt; 6): simulated 0.1411, exact 0.1413
chi2(9) 2.5% and 97.5% quantiles: [ 2.7   19.023]</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng χ<sup>2</sup>(n) thay vì χ<sup>2</sup>(n − 1).</li><li>Áp kết quả χ<sup>2</sup> cho dữ liệu không chuẩn. Khác với CLT cho X̄, kết quả này <strong>không bền vững</strong>: dữ liệu đuôi nặng làm S<sup>2</sup> dao động lớn hơn nhiều.</li><li>Đọc bảng chi bình phương như thể đối xứng: phân vị 2,5% và 97,5% không cách đều kỳ vọng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>χ<sup>2</sup>(k) = tổng bình phương k biến chuẩn tắc độc lập; kỳ vọng k, phương sai 2k.</li><li>Với mẫu chuẩn, (n − 1)S<sup>2</sup>/σ<sup>2</sup> ~ χ<sup>2</sup>(n − 1) và X̄ ⫫ S<sup>2</sup>.</li><li>Var(S<sup>2</sup>) = 2σ<sup>4</sup>/(n − 1): phương sai cần nhiều dữ liệu hơn trung bình.</li><li>Dùng <code>stats.chi2.sf</code>, <code>.cdf</code>, <code>.ppf</code> cho xác suất và phân vị.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/11-1-facts-about-the-chi-square-distribution" target="_blank" rel="noopener">OpenStax — 11.1 Các tính chất của phân phối chi bình phương</a></li><li><a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda3666.htm" target="_blank" rel="noopener">NIST e-Handbook — Phân phối chi bình phương</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.chi2.html" target="_blank" rel="noopener">SciPy — scipy.stats.chi2</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Nếu V ~ χ<sup>2</sup>(12), tìm E[V] và SD(V).</li><li>n = 10 số đọc chuẩn với σ<sup>2</sup> = 4. Tính P(S<sup>2</sup> &lt; 2).</li><li>Vì sao biến χ<sup>2</sup> không bao giờ âm?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) E[V] = 12, SD = √24 ≈ 4,90. 2) P(χ<sup>2</sup>(9) &lt; 9·2/4 = 4,5) = <code>stats.chi2.cdf(4.5, 9)</code> ≈ 0,124. 3) Vì nó là tổng các bình phương.</p></div>`);

const c14 = L('psi221-ts-1-4',
  '1.4 — Student t and F distributions|||1.4 — Phân phối Student t và phân phối F',
  'T = Z/√(V/k) và (X̄ − μ)/(S/√n) ~ t(n − 1); đuôi nặng hơn chuẩn, phân vị t*; F = (U/m)/(V/n), tỉ số phương sai, liên hệ t² = F(1, k).',
  `<span class="eyebrow">PSI221 · Chapter 1 · Lesson 1.4</span>
<h2>Student t and F distributions</h2>
<p class="lead">In real problems σ is unknown. Replacing σ by S in the z statistic adds extra randomness, and the result follows the <strong>Student t</strong> distribution. Ratios of two variance estimates follow the <strong>F</strong> distribution. Together with χ<sup>2</sup>, these three are the workhorses of classical inference.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define t(k) and F(m, n) from normal and chi-square variables.</li><li>Use the result (X̄ − μ)/(S/√n) ~ t(n − 1).</li><li>Read t and F quantiles and explain why t has heavier tails than N(0, 1).</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Student t with k degrees of freedom</span>T = Z / √(V/k),   Z ~ N(0, 1), V ~ χ<sup>2</sup>(k), Z ⫫ V   ⇒   T ~ t(k)<br>For normal samples:   T = (X̄ − μ)/(S/√n) ~ t(n − 1)</div>
<p>The second line follows from Lesson 1.3: (X̄ − μ)/(σ/√n) is N(0, 1), (n − 1)S<sup>2</sup>/σ<sup>2</sup> is χ<sup>2</sup>(n − 1), and they are independent; σ cancels in the ratio. This was discovered by W. S. Gosset (pen name “Student”) in 1908 while working with small samples at the Guinness brewery.</p>
<p>The t density is symmetric about 0 and bell-shaped, but with <strong>heavier tails</strong> than the normal, because S sometimes underestimates σ. As k → ∞, S → σ and t(k) → N(0, 1). In practice the difference matters for small n: the 97.5% quantile is 2.571 for 5 df but 1.984 for 100 df (normal: 1.960).</p>
<div class="formula"><span class="lbl">F distribution</span>F = (U/m) / (V/n),   U ~ χ<sup>2</sup>(m), V ~ χ<sup>2</sup>(n) independent   ⇒   F ~ F(m, n)<br>Two normal samples:   (S<sub>1</sub><sup>2</sup>/σ<sub>1</sub><sup>2</sup>) / (S<sub>2</sub><sup>2</sup>/σ<sub>2</sub><sup>2</sup>) ~ F(n<sub>1</sub> − 1, n<sub>2</sub> − 1)</div>
<p>Useful facts: if T ~ t(k) then T<sup>2</sup> ~ F(1, k); if F ~ F(m, n) then 1/F ~ F(n, m), so lower quantiles come from upper ones: F<sub>0.025</sub>(m, n) = 1/F<sub>0.975</sub>(n, m). The F distribution is the reference distribution of ANOVA (Chapter 8) and of the overall test in regression (Chapter 9).</p>
<pre><code class="language-python">from scipy import stats

print("97.5% quantile of t(df) versus z:")
for df in [2, 5, 10, 30, 100]:
    print(f"  df={df:3d}: t* = {stats.t.ppf(0.975, df):.3f}")
print(f"  normal : z* = {stats.norm.ppf(0.975):.3f}")
print(f"P(|T| &gt; 3), df=5 : {2 * stats.t.sf(3, 5):.4f}   P(|Z| &gt; 3): {2 * stats.norm.sf(3):.4f}")
print(f"F(4, 10) 95% quantile : {stats.f.ppf(0.95, 4, 10):.3f}")
print(f"t(10)^2 = {stats.t.ppf(0.975, 10)**2:.4f} equals F(1,10) 95% = {stats.f.ppf(0.95, 1, 10):.4f}")</code></pre>
<div class="out">97.5% quantile of t(df) versus z:
  df=  2: t* = 4.303
  df=  5: t* = 2.571
  df= 10: t* = 2.228
  df= 30: t* = 2.042
  df=100: t* = 1.984
  normal : z* = 1.960
P(|T| &gt; 3), df=5 : 0.0301   P(|Z| &gt; 3): 0.0027
F(4, 10) 95% quantile : 3.478
t(10)^2 = 4.9646 equals F(1,10) 95% = 4.9646</div>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — a t statistic.</b> For the 8 API times of Lesson 1.1 (x̄ = 107, s = 8.106), compute T for μ = 100 and say how unusual it is.</p>
<p>Step 1: SE = 8.106/√8 = 2.866. Step 2: T = (107 − 100)/2.866 = <b>2.442</b> on 7 df. Step 3: the 97.5% quantile of t(7) is 2.365 (scipy: <code>stats.t.ppf(0.975, 7)</code>), so T lies beyond it — a value this large would be rare if μ really were 100. This is exactly the one-sample t-test of Lesson 6.1.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using z = 1.96 with a small sample and an estimated σ. Use t<sub>n−1</sub>; with n = 6 that changes 1.96 into 2.571.</li><li>Swapping the two degrees of freedom of F: F(4, 10) and F(10, 4) are different distributions.</li><li>Forgetting that t needs (approximately) normal data when n is small; for large n the CLT rescues it.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>T = Z/√(V/k) ~ t(k); for normal data (X̄ − μ)/(S/√n) ~ t(n − 1).</li><li>t has heavier tails than N(0, 1) and tends to it as df grows.</li><li>F(m, n) = ratio of two chi-squares over their df; S<sub>1</sub><sup>2</sup>/S<sub>2</sub><sup>2</sup> compares variances.</li><li>t(k)<sup>2</sup> = F(1, k); F<sub>lower</sub>(m, n) = 1/F<sub>upper</sub>(n, m).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda3664.htm" target="_blank" rel="noopener">NIST e-Handbook — t distribution</a></li><li><a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda3665.htm" target="_blank" rel="noopener">NIST e-Handbook — F distribution</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/13-3-facts-about-the-f-distribution" target="_blank" rel="noopener">OpenStax — 13.3 Facts about the F distribution</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.t.html" target="_blank" rel="noopener">SciPy — scipy.stats.t</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find t* = t<sub>0.975</sub>(15) and compare with 1.96.</li><li>If T ~ t(10), what is the distribution of T<sup>2</sup>?</li><li>Given F<sub>0.975</sub>(11, 9) = 3.912, find F<sub>0.025</sub>(9, 11).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) t* = 2.131, about 9% wider than 1.96. 2) F(1, 10). 3) 1/3.912 = 0.256 (scipy: <code>stats.f.ppf(0.025, 9, 11)</code> = 0.2556).</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 1 · Bài 1.4</span>
<h2>Phân phối Student t và phân phối F</h2>
<p class="lead">Trong bài toán thật σ chưa biết. Thay σ bằng S trong thống kê z thêm vào một lượng ngẫu nhiên, và kết quả tuân theo phân phối <strong>Student t</strong>. Tỉ số của hai ước lượng phương sai tuân theo phân phối <strong>F</strong>. Cùng với χ<sup>2</sup>, đây là ba “ngựa thồ” của suy luận cổ điển.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa t(k) và F(m, n) từ biến chuẩn và chi bình phương.</li><li>Dùng kết quả (X̄ − μ)/(S/√n) ~ t(n − 1).</li><li>Đọc phân vị t, F và giải thích vì sao t có đuôi nặng hơn N(0, 1).</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Student t với k bậc tự do</span>T = Z / √(V/k),   Z ~ N(0, 1), V ~ χ<sup>2</sup>(k), Z ⫫ V   ⇒   T ~ t(k)<br>Với mẫu chuẩn:   T = (X̄ − μ)/(S/√n) ~ t(n − 1)</div>
<p>Dòng thứ hai suy ra từ Bài 1.3: (X̄ − μ)/(σ/√n) là N(0, 1), (n − 1)S<sup>2</sup>/σ<sup>2</sup> là χ<sup>2</sup>(n − 1), hai cái độc lập; σ triệt tiêu trong tỉ số. Kết quả do W. S. Gosset (bút danh “Student”) tìm ra năm 1908 khi làm việc với mẫu nhỏ ở nhà máy bia Guinness.</p>
<p>Mật độ t đối xứng quanh 0, hình chuông, nhưng <strong>đuôi nặng hơn</strong> phân phối chuẩn vì S đôi khi đánh giá thấp σ. Khi k → ∞, S → σ và t(k) → N(0, 1). Thực tế khác biệt đáng kể khi n nhỏ: phân vị 97,5% là 2,571 với 5 bậc tự do nhưng 1,984 với 100 bậc (chuẩn: 1,960).</p>
<div class="formula"><span class="lbl">Phân phối F</span>F = (U/m) / (V/n),   U ~ χ<sup>2</sup>(m), V ~ χ<sup>2</sup>(n) độc lập   ⇒   F ~ F(m, n)<br>Hai mẫu chuẩn:   (S<sub>1</sub><sup>2</sup>/σ<sub>1</sub><sup>2</sup>) / (S<sub>2</sub><sup>2</sup>/σ<sub>2</sub><sup>2</sup>) ~ F(n<sub>1</sub> − 1, n<sub>2</sub> − 1)</div>
<p>Tính chất hữu ích: nếu T ~ t(k) thì T<sup>2</sup> ~ F(1, k); nếu F ~ F(m, n) thì 1/F ~ F(n, m), nên phân vị dưới lấy từ phân vị trên: F<sub>0,025</sub>(m, n) = 1/F<sub>0,975</sub>(n, m). F là phân phối tham chiếu của ANOVA (Chương 8) và của kiểm định tổng thể trong hồi quy (Chương 9).</p>
<pre><code class="language-python">from scipy import stats

print("97.5% quantile of t(df) versus z:")
for df in [2, 5, 10, 30, 100]:
    print(f"  df={df:3d}: t* = {stats.t.ppf(0.975, df):.3f}")
print(f"  normal : z* = {stats.norm.ppf(0.975):.3f}")
print(f"P(|T| &gt; 3), df=5 : {2 * stats.t.sf(3, 5):.4f}   P(|Z| &gt; 3): {2 * stats.norm.sf(3):.4f}")
print(f"F(4, 10) 95% quantile : {stats.f.ppf(0.95, 4, 10):.3f}")
print(f"t(10)^2 = {stats.t.ppf(0.975, 10)**2:.4f} equals F(1,10) 95% = {stats.f.ppf(0.95, 1, 10):.4f}")</code></pre>
<div class="out">97.5% quantile of t(df) versus z:
  df=  2: t* = 4.303
  df=  5: t* = 2.571
  df= 10: t* = 2.228
  df= 30: t* = 2.042
  df=100: t* = 1.984
  normal : z* = 1.960
P(|T| &gt; 3), df=5 : 0.0301   P(|Z| &gt; 3): 0.0027
F(4, 10) 95% quantile : 3.478
t(10)^2 = 4.9646 equals F(1,10) 95% = 4.9646</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — một thống kê t.</b> Với 8 thời gian API ở Bài 1.1 (x̄ = 107, s = 8,106), tính T cho μ = 100 và cho biết nó bất thường cỡ nào.</p>
<p>Bước 1: SE = 8,106/√8 = 2,866. Bước 2: T = (107 − 100)/2,866 = <b>2,442</b> với 7 bậc tự do. Bước 3: phân vị 97,5% của t(7) là 2,365 (scipy: <code>stats.t.ppf(0.975, 7)</code>), nên T vượt qua nó — giá trị lớn cỡ này sẽ hiếm nếu μ thật sự bằng 100. Đây chính là kiểm định t một mẫu ở Bài 6.1.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng z = 1,96 với mẫu nhỏ và σ ước lượng. Phải dùng t<sub>n−1</sub>; với n = 6 thì 1,96 thành 2,571.</li><li>Đảo hai bậc tự do của F: F(4, 10) và F(10, 4) là hai phân phối khác nhau.</li><li>Quên rằng t cần dữ liệu (xấp xỉ) chuẩn khi n nhỏ; n lớn thì CLT cứu.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>T = Z/√(V/k) ~ t(k); với dữ liệu chuẩn (X̄ − μ)/(S/√n) ~ t(n − 1).</li><li>t đuôi nặng hơn N(0, 1) và tiến về nó khi bậc tự do tăng.</li><li>F(m, n) = tỉ số hai chi bình phương chia bậc tự do; S<sub>1</sub><sup>2</sup>/S<sub>2</sub><sup>2</sup> so sánh phương sai.</li><li>t(k)<sup>2</sup> = F(1, k); F<sub>dưới</sub>(m, n) = 1/F<sub>trên</sub>(n, m).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda3664.htm" target="_blank" rel="noopener">NIST e-Handbook — Phân phối t</a></li><li><a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda3665.htm" target="_blank" rel="noopener">NIST e-Handbook — Phân phối F</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/13-3-facts-about-the-f-distribution" target="_blank" rel="noopener">OpenStax — 13.3 Tính chất phân phối F</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.t.html" target="_blank" rel="noopener">SciPy — scipy.stats.t</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm t* = t<sub>0,975</sub>(15) và so với 1,96.</li><li>Nếu T ~ t(10), T<sup>2</sup> có phân phối gì?</li><li>Cho F<sub>0,975</sub>(11, 9) = 3,912, tìm F<sub>0,025</sub>(9, 11).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) t* = 2,131, rộng hơn 1,96 khoảng 9%. 2) F(1, 10). 3) 1/3,912 = 0,256 (scipy: <code>stats.f.ppf(0.025, 9, 11)</code> = 0,2556).</p></div>`);

const q1 = QZ(1, 'Quiz — Chapter 1: Sampling distributions|||Quiz — Chương 1: Phân phối mẫu', 'Kiểm tra chương 1: thống kê và tham số, sai số chuẩn, CLT, χ², t, F.', [
  Q('q1', 'Which of these is a statistic?|||Đại lượng nào là một thống kê?',
    ['The population mean μ|||Trung bình tổng thể μ', 'The sample median|||Trung vị mẫu', 'X̄ − μ|||X̄ − μ', 'σ/√n|||σ/√n'], 1,
    'A statistic is computed from the sample only; the others involve unknown parameters.|||Thống kê chỉ tính từ mẫu; các lựa chọn còn lại chứa tham số chưa biết.'),
  Q('q2', 'For data 4, 7, 7, 10 the sample variance s² (divisor n − 1) is|||Với dữ liệu 4, 7, 7, 10, phương sai mẫu s² (chia n − 1) bằng',
    ['4.5|||4,5', '6|||6', '18|||18', '2.45|||2,45'], 1,
    'Sum of squared deviations 18, divided by 3.|||Tổng bình phương độ lệch 18, chia 3.'),
  Q('q3', 'σ = 12 and n = 36. The standard deviation of X̄ is|||σ = 12 và n = 36. Độ lệch chuẩn của X̄ là',
    ['12|||12', '2|||2', '1/3|||1/3', '0.33|||0,33'], 1,
    'σ/√n = 12/6 = 2.|||σ/√n = 12/6 = 2.'),
  Q('q4', 'To halve the standard error of X̄ you must multiply n by|||Muốn sai số chuẩn của X̄ giảm một nửa phải nhân n với',
    ['2|||2', '√2|||√2', '4|||4', '8|||8'], 2,
    'SE ∝ 1/√n, so n must grow by 2² = 4.|||SE ∝ 1/√n nên n phải tăng 2² = 4 lần.'),
  Q('q5', 'The CLT says that, for large n, …|||CLT nói rằng, với n lớn, …',
    ['the data become normal|||dữ liệu trở thành chuẩn', 'X̄ is approximately normal|||X̄ xấp xỉ chuẩn', 'S² is approximately normal for any n|||S² xấp xỉ chuẩn với mọi n', 'σ becomes known|||σ trở thành đã biết'], 1,
    'Only the sampling distribution of the mean is approximately normal.|||Chỉ phân phối mẫu của trung bình là xấp xỉ chuẩn.'),
  Q('q6', 'For a normal sample of size n, (n − 1)S²/σ² follows|||Với mẫu chuẩn cỡ n, (n − 1)S²/σ² tuân theo',
    ['χ²(n)|||χ²(n)', 'χ²(n − 1)|||χ²(n − 1)', 't(n − 1)|||t(n − 1)', 'N(n − 1, 2(n − 1))|||N(n − 1, 2(n − 1))'], 1,
    'One degree of freedom is used up by estimating μ with X̄.|||Mất một bậc tự do vì ước lượng μ bằng X̄.'),
  Q('q7', 'If V ~ χ²(8), then E[V] and Var(V) are|||Nếu V ~ χ²(8) thì E[V] và Var(V) là',
    ['8 and 8|||8 và 8', '8 and 16|||8 và 16', '4 and 8|||4 và 8', '16 and 8|||16 và 8'], 1,
    'Mean k, variance 2k.|||Kỳ vọng k, phương sai 2k.'),
  Q('q8', 'Why does the t distribution have heavier tails than N(0, 1)?|||Vì sao phân phối t có đuôi nặng hơn N(0, 1)?',
    ['Because the data are skewed|||Vì dữ liệu lệch', 'Because S is random and sometimes underestimates σ|||Vì S ngẫu nhiên và đôi khi đánh giá thấp σ', 'Because n is large|||Vì n lớn', 'Because μ is unknown|||Vì μ chưa biết'], 1,
    'Dividing by a random S instead of the fixed σ inflates extreme values.|||Chia cho S ngẫu nhiên thay vì σ cố định làm giá trị cực đoan nhiều hơn.'),
  Q('q9', 'If T ~ t(12), then T² follows|||Nếu T ~ t(12) thì T² tuân theo',
    ['χ²(12)|||χ²(12)', 'F(12, 1)|||F(12, 1)', 'F(1, 12)|||F(1, 12)', 't(144)|||t(144)'], 2,
    'T² = Z²/(V/12) = (χ²(1)/1)/(χ²(12)/12).|||T² = Z²/(V/12) = (χ²(1)/1)/(χ²(12)/12).'),
  Q('q10', 'Two normal samples of sizes 10 and 12. S₁²/S₂² (with equal true variances) follows|||Hai mẫu chuẩn cỡ 10 và 12. S₁²/S₂² (khi phương sai thật bằng nhau) tuân theo',
    ['F(10, 12)|||F(10, 12)', 'F(9, 11)|||F(9, 11)', 'F(11, 9)|||F(11, 9)', 't(20)|||t(20)'], 1,
    'Degrees of freedom are n₁ − 1 and n₂ − 1, numerator first.|||Bậc tự do là n₁ − 1 và n₂ − 1, tử số trước.'),
]);

const ch1 = {
  title: 'Chapter 1 — Sampling distributions: χ², t and F|||Chương 1 — Phân phối mẫu: χ², t và F',
  description: 'Tổng thể, mẫu, thống kê; phân phối mẫu của X̄ và p̂, sai số chuẩn; định lý về S² với χ²; phân phối t và F (Wasserman Ch. 5–6 · Casella–Berger 5.1–5.4 · OpenStax 7, 11.1, 13.3).',
  lessons: [c11, c12, c13, c14, q1],
};


// ───────────────────────────── Chương 2 — Ước lượng điểm ─────────────────────────────
const c21 = L('psi221-ts-2-1',
  '2.1 — Estimators: bias, variance and mean squared error|||2.1 — Ước lượng: độ chệch, phương sai và sai số bình phương trung bình',
  'Ước lượng và giá trị ước lượng; độ chệch, phương sai, MSE = Var + chệch²; so sánh ba ước lượng θ của Uniform(0, θ) bằng công thức và mô phỏng.',
  `<span class="eyebrow">PSI221 · Chapter 2 · Lesson 2.1</span>
<h2>Estimators: bias, variance and mean squared error</h2>
<p class="lead">Many formulas could estimate the same parameter. To choose between them we need a scorecard. The standard one has three entries: bias, variance and their combination, the mean squared error.</p>
<h3>🎯 Objectives</h3>
<ul><li>Distinguish an estimator θ̂ (a random variable) from an estimate (a number).</li><li>Compute bias, variance and MSE, and use MSE = Var + bias<sup>2</sup>.</li><li>Explain why a slightly biased estimator can be better than an unbiased one.</li></ul>
<h3>📖 Lecture</h3>
<p>Let θ be an unknown parameter and θ̂ = g(X<sub>1</sub>, …, X<sub>n</sub>) a statistic used to estimate it. Because θ̂ depends on the random sample, it has a sampling distribution, and we judge it by how that distribution sits around θ:</p>
<div class="formula"><span class="lbl">Scorecard of an estimator</span>bias(θ̂) = E[θ̂] − θ      Var(θ̂) = E[(θ̂ − E[θ̂])<sup>2</sup>]      SE(θ̂) = √Var(θ̂)<br>MSE(θ̂) = E[(θ̂ − θ)<sup>2</sup>] = Var(θ̂) + bias(θ̂)<sup>2</sup></div>
<p>An estimator is <strong>unbiased</strong> if its bias is 0 for every value of θ. Unbiasedness is about the centre of the sampling distribution; variance is about its width. Think of a dart board: unbiased but high variance = darts scattered around the bull's-eye; biased with low variance = a tight group off-centre. MSE measures the average squared distance from the bull's-eye and rewards both.</p>
<p><strong>Proof of the decomposition.</strong> Write θ̂ − θ = (θ̂ − E[θ̂]) + (E[θ̂] − θ). Squaring and taking expectations, the cross term vanishes because E[θ̂ − E[θ̂]] = 0, leaving Var + bias<sup>2</sup>.</p>
<p>Known results: X̄ is unbiased for μ with Var σ<sup>2</sup>/n; S<sup>2</sup> is unbiased for σ<sup>2</sup>; but S is <em>biased</em> for σ (E[S] &lt; σ, because √ is concave). For normal data, MSE(S<sup>2</sup>) = 2σ<sup>4</sup>/(n − 1) while the biased σ̂<sup>2</sup> = (1/n)∑(X<sub>i</sub> − X̄)<sup>2</sup> has the <em>smaller</em> MSE (2n − 1)σ<sup>4</sup>/n<sup>2</sup>: with σ = 2 and n = 5 these are 8.0 and 5.76.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — estimating the maximum of Uniform(0, θ).</b> A server assigns session IDs uniformly from 0 to an unknown θ. With n = 10 observed IDs, compare three estimators.</p>
<p>(a) θ̂<sub>1</sub> = 2X̄: E = 2·θ/2 = θ (unbiased), Var = 4·(θ<sup>2</sup>/12)/n, so MSE = θ<sup>2</sup>/(3n) = <b>0.0333</b>θ<sup>2</sup>.<br>(b) θ̂<sub>2</sub> = max X<sub>i</sub>: E = nθ/(n + 1), bias −θ/(n + 1) ≈ −0.0909θ; MSE = 2θ<sup>2</sup>/((n + 1)(n + 2)) = <b>0.0152</b>θ<sup>2</sup>.<br>(c) θ̂<sub>3</sub> = ((n + 1)/n)·max X<sub>i</sub>: unbiased, MSE = θ<sup>2</sup>/(n(n + 2)) = <b>0.0083</b>θ<sup>2</sup>.</p>
<p>The maximum carries far more information about θ than the mean. Even the biased max beats the unbiased 2X̄; correcting its bias wins outright.</p></div>
<pre><code class="language-python">import numpy as np

rng = np.random.default_rng(3)
theta, n = 1.0, 10
U = rng.uniform(0, theta, size=(100_000, n))
estimators = {
    "2 * mean        ": 2 * U.mean(axis=1),
    "max             ": U.max(axis=1),
    "(n+1)/n * max   ": (n + 1) / n * U.max(axis=1),
}
for name, est in estimators.items():
    bias = est.mean() - theta
    mse = np.mean((est - theta)**2)
    print(f"{name}: bias={bias:+.4f}  var={est.var():.4f}  MSE={mse:.4f}")</code></pre>
<div class="out">2 * mean        : bias=+0.0006  var=0.0332  MSE=0.0332
max             : bias=-0.0909  var=0.0069  MSE=0.0152
(n+1)/n * max   : bias=+0.0001  var=0.0084  MSE=0.0084</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking “unbiased” means “close to θ”. An unbiased estimator can still be far off in every single sample if its variance is large.</li><li>Comparing estimators only by bias. Compare by MSE (or by bias and SE together).</li><li>Assuming a function of an unbiased estimator is unbiased: E[S] ≠ σ, E[1/X̄] ≠ 1/μ.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Bias = E[θ̂] − θ; SE = SD of θ̂; MSE = Var + bias<sup>2</sup>.</li><li>Unbiased is nice but not required; low MSE is the real goal.</li><li>The bias–variance trade-off you meet in machine learning is exactly this decomposition.</li><li>Simulation (many synthetic samples) is a quick way to measure bias and MSE.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://online.stat.psu.edu/stat415/Lesson02.html" target="_blank" rel="noopener">Penn State STAT 415 — Lesson 2: Point estimation and properties of estimators</a></li><li><a href="https://ocw.mit.edu/courses/18-650-statistics-for-applications-fall-2016/pages/lecture-slides/" target="_blank" rel="noopener">MIT 18.650 — Lecture slides (Parametric inference)</a></li><li><a href="https://www.youtube.com/watch?v=sHRBg6BhKjI" target="_blank" rel="noopener">StatQuest — Why dividing by N underestimates the variance</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>θ̂ has E[θ̂] = θ + 1 and Var(θ̂) = 3. Find its MSE.</li><li>X<sub>1</sub>, X<sub>2</sub> i.i.d. with mean μ, variance σ<sup>2</sup>. Is T = (X<sub>1</sub> + 2X<sub>2</sub>)/3 unbiased? Compare Var(T) with Var(X̄).</li><li>In the uniform example with n = 20, what is the MSE of ((n + 1)/n)·max for θ = 1?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 3 + 1<sup>2</sup> = 4. 2) E[T] = (μ + 2μ)/3 = μ, unbiased; Var(T) = (σ<sup>2</sup> + 4σ<sup>2</sup>)/9 = 5σ<sup>2</sup>/9 &gt; σ<sup>2</sup>/2 = Var(X̄), so X̄ is better. 3) 1/(20·22) = 1/440 ≈ 0.00227.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 2 · Bài 2.1</span>
<h2>Ước lượng: độ chệch, phương sai và sai số bình phương trung bình</h2>
<p class="lead">Nhiều công thức có thể cùng ước lượng một tham số. Muốn chọn, ta cần một bảng điểm. Bảng điểm chuẩn có ba mục: độ chệch, phương sai và tổ hợp của chúng — sai số bình phương trung bình (MSE).</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phân biệt hàm ước lượng θ̂ (biến ngẫu nhiên) với giá trị ước lượng (một con số).</li><li>Tính độ chệch, phương sai, MSE và dùng MSE = Var + chệch<sup>2</sup>.</li><li>Giải thích vì sao một ước lượng hơi chệch có thể tốt hơn ước lượng không chệch.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Cho θ là tham số chưa biết và θ̂ = g(X<sub>1</sub>, …, X<sub>n</sub>) là một thống kê dùng để ước lượng nó. Vì θ̂ phụ thuộc mẫu ngẫu nhiên nên nó có phân phối mẫu, và ta chấm nó theo cách phân phối đó nằm quanh θ:</p>
<div class="formula"><span class="lbl">Bảng điểm của một ước lượng</span>chệch(θ̂) = E[θ̂] − θ      Var(θ̂) = E[(θ̂ − E[θ̂])<sup>2</sup>]      SE(θ̂) = √Var(θ̂)<br>MSE(θ̂) = E[(θ̂ − θ)<sup>2</sup>] = Var(θ̂) + chệch(θ̂)<sup>2</sup></div>
<p>Ước lượng gọi là <strong>không chệch</strong> nếu độ chệch bằng 0 với mọi giá trị θ. Không chệch nói về tâm của phân phối mẫu; phương sai nói về độ rộng của nó. Hình dung bảng phi tiêu: không chệch nhưng phương sai lớn = phi tiêu rải quanh hồng tâm; chệch nhưng phương sai nhỏ = một chùm chặt lệch khỏi tâm. MSE đo bình phương khoảng cách trung bình tới hồng tâm và thưởng cho cả hai.</p>
<p><strong>Chứng minh phân tích.</strong> Viết θ̂ − θ = (θ̂ − E[θ̂]) + (E[θ̂] − θ). Bình phương rồi lấy kỳ vọng, số hạng chéo bằng 0 vì E[θ̂ − E[θ̂]] = 0, còn lại Var + chệch<sup>2</sup>.</p>
<p>Kết quả đã biết: X̄ không chệch cho μ với Var σ<sup>2</sup>/n; S<sup>2</sup> không chệch cho σ<sup>2</sup>; nhưng S <em>chệch</em> cho σ (E[S] &lt; σ, vì √ là hàm lõm). Với dữ liệu chuẩn, MSE(S<sup>2</sup>) = 2σ<sup>4</sup>/(n − 1), còn σ̂<sup>2</sup> = (1/n)∑(X<sub>i</sub> − X̄)<sup>2</sup> chệch lại có MSE <em>nhỏ hơn</em> (2n − 1)σ<sup>4</sup>/n<sup>2</sup>: với σ = 2, n = 5 hai số này là 8,0 và 5,76.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — ước lượng cận trên của Uniform(0, θ).</b> Một server cấp mã phiên ngẫu nhiên đều từ 0 tới θ chưa biết. Với n = 10 mã quan sát được, so sánh ba ước lượng.</p>
<p>(a) θ̂<sub>1</sub> = 2X̄: E = 2·θ/2 = θ (không chệch), Var = 4·(θ<sup>2</sup>/12)/n, nên MSE = θ<sup>2</sup>/(3n) = <b>0,0333</b>θ<sup>2</sup>.<br>(b) θ̂<sub>2</sub> = max X<sub>i</sub>: E = nθ/(n + 1), chệch −θ/(n + 1) ≈ −0,0909θ; MSE = 2θ<sup>2</sup>/((n + 1)(n + 2)) = <b>0,0152</b>θ<sup>2</sup>.<br>(c) θ̂<sub>3</sub> = ((n + 1)/n)·max X<sub>i</sub>: không chệch, MSE = θ<sup>2</sup>/(n(n + 2)) = <b>0,0083</b>θ<sup>2</sup>.</p>
<p>Giá trị lớn nhất mang nhiều thông tin về θ hơn trung bình rất nhiều. Ngay cả max chệch cũng thắng 2X̄ không chệch; sửa chệch cho max thì thắng hẳn.</p></div>
<pre><code class="language-python">import numpy as np

rng = np.random.default_rng(3)
theta, n = 1.0, 10
U = rng.uniform(0, theta, size=(100_000, n))
estimators = {
    "2 * mean        ": 2 * U.mean(axis=1),
    "max             ": U.max(axis=1),
    "(n+1)/n * max   ": (n + 1) / n * U.max(axis=1),
}
for name, est in estimators.items():
    bias = est.mean() - theta
    mse = np.mean((est - theta)**2)
    print(f"{name}: bias={bias:+.4f}  var={est.var():.4f}  MSE={mse:.4f}")</code></pre>
<div class="out">2 * mean        : bias=+0.0006  var=0.0332  MSE=0.0332
max             : bias=-0.0909  var=0.0069  MSE=0.0152
(n+1)/n * max   : bias=+0.0001  var=0.0084  MSE=0.0084</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tưởng “không chệch” nghĩa là “gần θ”. Ước lượng không chệch vẫn có thể lệch xa trong từng mẫu nếu phương sai lớn.</li><li>So sánh ước lượng chỉ bằng độ chệch. Phải so bằng MSE (hoặc cả chệch lẫn SE).</li><li>Tưởng hàm của ước lượng không chệch cũng không chệch: E[S] ≠ σ, E[1/X̄] ≠ 1/μ.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Chệch = E[θ̂] − θ; SE = độ lệch chuẩn của θ̂; MSE = Var + chệch<sup>2</sup>.</li><li>Không chệch là tốt nhưng không bắt buộc; MSE thấp mới là mục tiêu.</li><li>Đánh đổi chệch–phương sai (bias–variance trade-off) trong học máy chính là phân tích này.</li><li>Mô phỏng (nhiều mẫu giả lập) là cách nhanh để đo độ chệch và MSE.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://online.stat.psu.edu/stat415/Lesson02.html" target="_blank" rel="noopener">Penn State STAT 415 — Bài 2: Ước lượng điểm và tính chất ước lượng</a></li><li><a href="https://ocw.mit.edu/courses/18-650-statistics-for-applications-fall-2016/pages/lecture-slides/" target="_blank" rel="noopener">MIT 18.650 — Slide bài giảng (Suy luận tham số)</a></li><li><a href="https://www.youtube.com/watch?v=sHRBg6BhKjI" target="_blank" rel="noopener">StatQuest — Vì sao chia N đánh giá thấp phương sai</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>θ̂ có E[θ̂] = θ + 1 và Var(θ̂) = 3. Tính MSE.</li><li>X<sub>1</sub>, X<sub>2</sub> i.i.d. kỳ vọng μ, phương sai σ<sup>2</sup>. T = (X<sub>1</sub> + 2X<sub>2</sub>)/3 có không chệch không? So Var(T) với Var(X̄).</li><li>Trong ví dụ phân phối đều với n = 20, MSE của ((n + 1)/n)·max bằng bao nhiêu khi θ = 1?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 3 + 1<sup>2</sup> = 4. 2) E[T] = (μ + 2μ)/3 = μ, không chệch; Var(T) = (σ<sup>2</sup> + 4σ<sup>2</sup>)/9 = 5σ<sup>2</sup>/9 &gt; σ<sup>2</sup>/2 = Var(X̄), nên X̄ tốt hơn. 3) 1/(20·22) = 1/440 ≈ 0,00227.</p></div>`);

const c22 = L('psi221-ts-2-2',
  '2.2 — The method of moments|||2.2 — Phương pháp mô-men',
  'Cân bằng mô-men mẫu với mô-men lý thuyết; ví dụ Exponential, Uniform(0, θ), Gamma(α, β) với dữ liệu thời gian xử lý; ưu nhược điểm.',
  `<span class="eyebrow">PSI221 · Chapter 2 · Lesson 2.2</span>
<h2>The method of moments</h2>
<p class="lead">The oldest general recipe for building estimators (Karl Pearson, 1894): make the model's moments match the data's moments, and solve for the parameters. It is quick, needs no calculus of likelihoods, and gives good starting values for harder methods.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write population moments as functions of the parameters.</li><li>Solve the moment equations for one- and two-parameter models.</li><li>Know the strengths and weaknesses of method-of-moments (MoM) estimators.</li></ul>
<h3>📖 Lecture</h3>
<p>The k-th population moment is μ<sub>k</sub>(θ) = E[X<sup>k</sup>]; the k-th sample moment is m<sub>k</sub> = (1/n)∑X<sub>i</sub><sup>k</sup>. By the law of large numbers m<sub>k</sub> → μ<sub>k</sub>. If the model has d parameters, the MoM estimator solves</p>
<div class="formula"><span class="lbl">Moment equations</span>μ<sub>1</sub>(θ) = m<sub>1</sub>,   μ<sub>2</sub>(θ) = m<sub>2</sub>,   …,   μ<sub>d</sub>(θ) = m<sub>d</sub><br>Equivalent and often easier: match the mean to x̄ and the variance to σ̂<sup>2</sup> = (1/n)∑(x<sub>i</sub> − x̄)<sup>2</sup></div>
<p><strong>One-parameter examples.</strong> Exponential(λ): E[X] = 1/λ ⇒ λ̂ = 1/x̄. Poisson(λ): E[X] = λ ⇒ λ̂ = x̄. Uniform(0, θ): E[X] = θ/2 ⇒ θ̂ = 2x̄ (the estimator of Lesson 2.1 — unbiased, but beaten by the corrected maximum).</p>
<p><strong>Two-parameter example: Gamma(α, β)</strong> with shape α and scale β has mean αβ and variance αβ<sup>2</sup>. Dividing: β = variance/mean, then α = mean/β:</p>
<div class="formula"><span class="lbl">Gamma by moments</span>β̂ = σ̂<sup>2</sup>/x̄      α̂ = x̄<sup>2</sup>/σ̂<sup>2</sup>      (rate = 1/β̂ = x̄/σ̂<sup>2</sup>)</div>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — job processing times (seconds).</b> Ten batch jobs took 1.8, 3.2, 2.5, 4.1, 0.9, 2.2, 3.7, 1.5, 2.9, 3.0 s. Fit a Gamma model by moments.</p>
<p>Step 1: x̄ = 25.8/10 = <b>2.58</b>. Step 2: σ̂<sup>2</sup> = (1/10)∑(x<sub>i</sub> − 2.58)<sup>2</sup> = <b>0.8976</b>. Step 3: β̂ = 0.8976/2.58 = <b>0.348</b> s; α̂ = 2.58<sup>2</sup>/0.8976 = <b>7.42</b>. A large shape means the times are fairly symmetric around 2.6 s. Had we fitted an Exponential (one parameter), MoM would give λ̂ = 1/2.58 = 0.388 per second — but an exponential with mean 2.58 would have SD 2.58, far larger than the observed 0.95, so it fits these data badly.</p></div>
<p><strong>Strengths:</strong> simple, closed-form, consistent (they converge to the truth as n → ∞ when the moment map is continuous and invertible), and an excellent starting point for numerical maximum likelihood (Lesson 2.4 uses it). <strong>Weaknesses:</strong> usually less efficient than the MLE (larger variance), can give impossible values (e.g. a negative variance estimate in some models, or θ̂ = 2x̄ smaller than the largest observation), and uses only a few moments of the data.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Mixing the shape–scale and shape–rate parameterisations of the Gamma. SciPy uses <code>scale</code>; many textbooks use a rate.</li><li>Using S<sup>2</sup> (divisor n − 1) instead of the second central sample moment; for large n it hardly matters, but be consistent with the definition.</li><li>Accepting an estimate that contradicts the data, such as θ̂ = 2x̄ below max x<sub>i</sub>.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Set theoretical moments equal to sample moments and solve.</li><li>Exponential: 1/x̄; Poisson: x̄; Uniform(0, θ): 2x̄; Gamma: α̂ = x̄<sup>2</sup>/σ̂<sup>2</sup>, β̂ = σ̂<sup>2</sup>/x̄.</li><li>Consistent and easy, but usually less efficient than maximum likelihood.</li><li>Great as starting values for numerical optimisation.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://online.stat.psu.edu/stat415/Lesson03.html" target="_blank" rel="noopener">Penn State STAT 415 — Lesson 3: Sufficiency and the method of moments</a></li><li><a href="https://ocw.mit.edu/courses/18-650-statistics-for-applications-fall-2016/pages/lecture-slides/" target="_blank" rel="noopener">MIT 18.650 — Lecture slides (method of moments)</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.gamma.html" target="_blank" rel="noopener">SciPy — scipy.stats.gamma (shape a, scale)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>X ~ Geometric(p) on {1, 2, …} with E[X] = 1/p. Find the MoM estimator of p; compute it for the data 3, 1, 4, 2.</li><li>For Uniform(a, b), E[X] = (a + b)/2 and Var(X) = (b − a)<sup>2</sup>/12. Write the MoM estimators of a and b.</li><li>The data 1, 2, 9 come from Uniform(0, θ). Compute θ̂ = 2x̄. What is wrong?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) p̂ = 1/x̄ = 1/2.5 = 0.4. 2) â = x̄ − √3·σ̂, b̂ = x̄ + √3·σ̂. 3) 2x̄ = 8 &lt; 9 = max — impossible, since θ must be at least 9. The MLE (Lesson 2.3) would give 9.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 2 · Bài 2.2</span>
<h2>Phương pháp mô-men</h2>
<p class="lead">Công thức tổng quát lâu đời nhất để dựng ước lượng (Karl Pearson, 1894): cho mô-men của mô hình bằng mô-men của dữ liệu, rồi giải ra tham số. Nhanh, không cần tính hàm hợp lý, và cho điểm xuất phát tốt cho các phương pháp khó hơn.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết mô-men tổng thể như hàm của tham số.</li><li>Giải hệ phương trình mô-men cho mô hình một và hai tham số.</li><li>Biết điểm mạnh, điểm yếu của ước lượng mô-men (MoM).</li></ul>
<h3>📖 Bài giảng</h3>
<p>Mô-men tổng thể bậc k là μ<sub>k</sub>(θ) = E[X<sup>k</sup>]; mô-men mẫu bậc k là m<sub>k</sub> = (1/n)∑X<sub>i</sub><sup>k</sup>. Theo luật số lớn m<sub>k</sub> → μ<sub>k</sub>. Nếu mô hình có d tham số, ước lượng MoM giải hệ</p>
<div class="formula"><span class="lbl">Phương trình mô-men</span>μ<sub>1</sub>(θ) = m<sub>1</sub>,   μ<sub>2</sub>(θ) = m<sub>2</sub>,   …,   μ<sub>d</sub>(θ) = m<sub>d</sub><br>Tương đương và thường dễ hơn: cho kỳ vọng bằng x̄ và phương sai bằng σ̂<sup>2</sup> = (1/n)∑(x<sub>i</sub> − x̄)<sup>2</sup></div>
<p><strong>Ví dụ một tham số.</strong> Exponential(λ): E[X] = 1/λ ⇒ λ̂ = 1/x̄. Poisson(λ): E[X] = λ ⇒ λ̂ = x̄. Uniform(0, θ): E[X] = θ/2 ⇒ θ̂ = 2x̄ (chính ước lượng ở Bài 2.1 — không chệch nhưng thua max đã hiệu chỉnh).</p>
<p><strong>Ví dụ hai tham số: Gamma(α, β)</strong> với hình dạng α, tỉ lệ β có kỳ vọng αβ và phương sai αβ<sup>2</sup>. Chia hai vế: β = phương sai/kỳ vọng, rồi α = kỳ vọng/β:</p>
<div class="formula"><span class="lbl">Gamma theo mô-men</span>β̂ = σ̂<sup>2</sup>/x̄      α̂ = x̄<sup>2</sup>/σ̂<sup>2</sup>      (tốc độ = 1/β̂ = x̄/σ̂<sup>2</sup>)</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — thời gian xử lý job (giây).</b> Mười job batch mất 1,8; 3,2; 2,5; 4,1; 0,9; 2,2; 3,7; 1,5; 2,9; 3,0 s. Khớp mô hình Gamma bằng mô-men.</p>
<p>Bước 1: x̄ = 25,8/10 = <b>2,58</b>. Bước 2: σ̂<sup>2</sup> = (1/10)∑(x<sub>i</sub> − 2,58)<sup>2</sup> = <b>0,8976</b>. Bước 3: β̂ = 0,8976/2,58 = <b>0,348</b> s; α̂ = 2,58<sup>2</sup>/0,8976 = <b>7,42</b>. Hình dạng lớn nghĩa là thời gian khá đối xứng quanh 2,6 s. Nếu khớp Exponential (một tham số), MoM cho λ̂ = 1/2,58 = 0,388 mỗi giây — nhưng phân phối mũ có kỳ vọng 2,58 thì SD cũng là 2,58, lớn hơn nhiều so với 0,95 quan sát được, nên nó khớp dữ liệu này kém.</p></div>
<p><strong>Điểm mạnh:</strong> đơn giản, có công thức đóng, vững (hội tụ về giá trị thật khi n → ∞ nếu ánh xạ mô-men liên tục và khả nghịch), và là điểm xuất phát rất tốt cho hợp lý cực đại tính số (Bài 2.4 dùng nó). <strong>Điểm yếu:</strong> thường kém hiệu quả hơn MLE (phương sai lớn hơn), có thể cho giá trị vô lý (vd phương sai ước lượng âm ở vài mô hình, hay θ̂ = 2x̄ nhỏ hơn quan sát lớn nhất), và chỉ dùng vài mô-men của dữ liệu.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Lẫn hai cách tham số hoá Gamma: hình dạng–tỉ lệ (scale) và hình dạng–tốc độ (rate). SciPy dùng <code>scale</code>; nhiều sách dùng rate.</li><li>Dùng S<sup>2</sup> (chia n − 1) thay cho mô-men trung tâm bậc hai của mẫu; n lớn thì gần như không khác, nhưng phải nhất quán với định nghĩa.</li><li>Chấp nhận một ước lượng mâu thuẫn với dữ liệu, như θ̂ = 2x̄ nhỏ hơn max x<sub>i</sub>.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Cho mô-men lý thuyết bằng mô-men mẫu rồi giải.</li><li>Exponential: 1/x̄; Poisson: x̄; Uniform(0, θ): 2x̄; Gamma: α̂ = x̄<sup>2</sup>/σ̂<sup>2</sup>, β̂ = σ̂<sup>2</sup>/x̄.</li><li>Vững và dễ, nhưng thường kém hiệu quả hơn hợp lý cực đại.</li><li>Rất tốt để làm điểm xuất phát cho tối ưu số.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://online.stat.psu.edu/stat415/Lesson03.html" target="_blank" rel="noopener">Penn State STAT 415 — Bài 3: Tính đủ và phương pháp mô-men</a></li><li><a href="https://ocw.mit.edu/courses/18-650-statistics-for-applications-fall-2016/pages/lecture-slides/" target="_blank" rel="noopener">MIT 18.650 — Slide bài giảng (phương pháp mô-men)</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.gamma.html" target="_blank" rel="noopener">SciPy — scipy.stats.gamma (hình dạng a, tỉ lệ scale)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>X ~ Geometric(p) trên {1, 2, …} với E[X] = 1/p. Tìm ước lượng MoM của p; tính với dữ liệu 3, 1, 4, 2.</li><li>Với Uniform(a, b), E[X] = (a + b)/2 và Var(X) = (b − a)<sup>2</sup>/12. Viết ước lượng MoM của a và b.</li><li>Dữ liệu 1, 2, 9 đến từ Uniform(0, θ). Tính θ̂ = 2x̄. Có gì sai?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) p̂ = 1/x̄ = 1/2,5 = 0,4. 2) â = x̄ − √3·σ̂, b̂ = x̄ + √3·σ̂. 3) 2x̄ = 8 &lt; 9 = max — vô lý, vì θ phải ít nhất bằng 9. MLE (Bài 2.3) sẽ cho 9.</p></div>`);

const c23 = L('psi221-ts-2-3',
  '2.3 — Maximum likelihood estimation|||2.3 — Ước lượng hợp lý cực đại (MLE)',
  'Hàm hợp lý và log-hợp lý; giải MLE cho Bernoulli, Poisson, Exponential, Normal, Uniform(0, θ); ví dụ số lỗi mỗi ngày và bảng log-hợp lý chạy bằng scipy.',
  `<span class="eyebrow">PSI221 · Chapter 2 · Lesson 2.3</span>
<h2>Maximum likelihood estimation</h2>
<p class="lead">Maximum likelihood (R. A. Fisher, 1912–1922) asks a simple question: <em>which parameter value makes the data we actually saw most probable?</em> It is the default estimator of modern statistics and machine learning.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write the likelihood L(θ) and log-likelihood ℓ(θ) of an i.i.d. sample.</li><li>Find MLEs by solving the score equation ℓ′(θ) = 0, and recognise when the maximum is at a boundary.</li><li>Derive the MLE for the Bernoulli, Poisson, Exponential, Normal and Uniform models.</li></ul>
<h3>📖 Lecture</h3>
<p>For i.i.d. data with density or mass function f(x; θ), the <strong>likelihood</strong> is the joint density viewed as a function of θ with the data held fixed:</p>
<div class="formula"><span class="lbl">Likelihood and log-likelihood</span>L(θ) = ∏<sub>i=1..n</sub> f(x<sub>i</sub>; θ)      ℓ(θ) = log L(θ) = ∑<sub>i=1..n</sub> log f(x<sub>i</sub>; θ)      θ̂<sub>MLE</sub> = argmax<sub>θ</sub> ℓ(θ)</div>
<p>The logarithm turns a product into a sum and does not move the maximiser. Usually we solve the <strong>score equation</strong> ℓ′(θ) = 0 and check that ℓ″(θ̂) &lt; 0. A likelihood is <em>not</em> a probability distribution over θ (it need not integrate to 1); it only ranks parameter values.</p>
<p><strong>Standard results.</strong></p>
<ul>
<li><strong>Bernoulli(p)</strong> with s successes: ℓ(p) = s log p + (n − s) log(1 − p); ℓ′ = s/p − (n − s)/(1 − p) = 0 ⇒ <b>p̂ = s/n</b>. Example: 56 clicks in 120 views ⇒ p̂ = 0.4667.</li>
<li><strong>Poisson(λ)</strong>: ℓ(λ) = (∑x<sub>i</sub>) log λ − nλ − ∑ log x<sub>i</sub>!; ℓ′ = ∑x<sub>i</sub>/λ − n = 0 ⇒ <b>λ̂ = x̄</b>.</li>
<li><strong>Exponential(λ)</strong>: ℓ(λ) = n log λ − λ∑x<sub>i</sub> ⇒ <b>λ̂ = 1/x̄</b>.</li>
<li><strong>Normal(μ, σ<sup>2</sup>)</strong>: setting both partial derivatives to 0 gives <b>μ̂ = x̄</b> and <b>σ̂<sup>2</sup> = (1/n)∑(x<sub>i</sub> − x̄)<sup>2</sup></b> — the MLE of the variance divides by n, so it is slightly biased. For the API data of Lesson 1.1: μ̂ = 107, σ̂<sup>2</sup> = 57.5.</li>
<li><strong>Uniform(0, θ)</strong>: L(θ) = θ<sup>−n</sup> if θ ≥ max x<sub>i</sub>, and 0 otherwise. L is decreasing in θ, so the maximum is at the boundary: <b>θ̂ = max x<sub>i</sub></b>. Derivatives do not find it — always look at the shape of L.</li>
</ul>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — bugs reported per day.</b> Over 12 days a team logged 3, 5, 2, 4, 6, 3, 4, 5, 2, 6, 4, 4 bug reports. Assume Poisson(λ).</p>
<p>Step 1: ∑x<sub>i</sub> = 48, n = 12. Step 2: ℓ′(λ) = 48/λ − 12 = 0 ⇒ λ̂ = <b>4.0</b> bugs/day. Step 3: ℓ″(λ) = −48/λ<sup>2</sup> &lt; 0, so it is a maximum. The table below evaluates ℓ on a grid and confirms the peak at 4.0; note how flat the curve is near the top — that flatness will measure uncertainty in Chapter 3.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

bugs = np.array([3, 5, 2, 4, 6, 3, 4, 5, 2, 6, 4, 4])   # bugs reported per day, 12 days
grid = np.arange(2.0, 6.01, 0.5)
loglik = [stats.poisson.logpmf(bugs, lam).sum() for lam in grid]
for lam, ll in zip(grid, loglik):
    print(f"lambda={lam:.1f}  log-likelihood={ll:8.3f}")
print("argmax on grid:", grid[int(np.argmax(loglik))], "  closed form xbar =", bugs.mean())</code></pre>
<div class="out">lambda=2.0  log-likelihood= -31.144
lambda=2.5  log-likelihood= -26.434
lambda=3.0  log-likelihood= -23.682
lambda=3.5  log-likelihood= -22.283
lambda=4.0  log-likelihood= -21.873
lambda=4.5  log-likelihood= -22.220
lambda=5.0  log-likelihood= -23.162
lambda=5.5  log-likelihood= -24.588
lambda=6.0  log-likelihood= -26.411
argmax on grid: 4.0   closed form xbar = 4.0</div>
<p><strong>Why ML matters for computer science.</strong> Logistic regression and neural-network classifiers are trained by minimising cross-entropy, which is exactly the negative Bernoulli/categorical log-likelihood. Least squares regression is MLE under normal errors (Chapter 9).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Differentiating blindly when the support depends on θ (Uniform): the maximum is on the boundary.</li><li>Forgetting the constant terms do not matter: −∑ log x<sub>i</sub>! can be dropped from the Poisson ℓ.</li><li>Calling L(θ) “the probability that θ is true”. That interpretation belongs to Bayesian posteriors (Lesson 10.4).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>MLE maximises ℓ(θ) = ∑ log f(x<sub>i</sub>; θ).</li><li>Bernoulli: s/n; Poisson: x̄; Exponential: 1/x̄; Normal: x̄ and (1/n)∑(x<sub>i</sub> − x̄)<sup>2</sup>; Uniform(0, θ): max.</li><li>Solve ℓ′ = 0 and check ℓ″ &lt; 0, but watch for boundary maxima.</li><li>Cross-entropy training = maximum likelihood.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class10-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 10b: Maximum likelihood estimates</a></li><li><a href="https://www.youtube.com/watch?v=XepXtl9YKwc" target="_blank" rel="noopener">StatQuest — Maximum likelihood, clearly explained</a></li><li><a href="https://www.youtube.com/watch?v=Dn6b9fCIUpM" target="_blank" rel="noopener">StatQuest — MLE for the normal distribution, step by step</a></li><li><a href="https://online.stat.psu.edu/stat415/Lesson04.html" target="_blank" rel="noopener">Penn State STAT 415 — Lesson 4: Maximum likelihood estimation</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find the MLE of λ for Exponential data 0.5, 1.5, 2.0.</li><li>Geometric(p) on {1, 2, …}: f(x; p) = (1 − p)<sup>x−1</sup>p. Derive the MLE of p.</li><li>Uniform(0, θ) data: 2.1, 0.7, 3.4, 1.9. Give the MLE and the bias-corrected estimator of Lesson 2.1.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) x̄ = 4/3, λ̂ = 0.75. 2) ℓ(p) = (∑x<sub>i</sub> − n) log(1 − p) + n log p ⇒ ℓ′ = n/p − (∑x<sub>i</sub> − n)/(1 − p) = 0 ⇒ p̂ = 1/x̄ (same as MoM). 3) θ̂ = 3.4; corrected (5/4)·3.4 = 4.25.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 2 · Bài 2.3</span>
<h2>Ước lượng hợp lý cực đại (MLE)</h2>
<p class="lead">Hợp lý cực đại (R. A. Fisher, 1912–1922) đặt một câu hỏi đơn giản: <em>giá trị tham số nào làm dữ liệu ta thực sự thấy có khả năng xảy ra cao nhất?</em> Đây là ước lượng mặc định của thống kê và học máy hiện đại.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết hàm hợp lý L(θ) và log-hợp lý ℓ(θ) của một mẫu i.i.d.</li><li>Tìm MLE bằng cách giải phương trình score ℓ′(θ) = 0, và nhận ra khi cực đại nằm ở biên.</li><li>Suy ra MLE cho các mô hình Bernoulli, Poisson, Exponential, Normal và Uniform.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Với dữ liệu i.i.d. có hàm mật độ hoặc hàm xác suất f(x; θ), <strong>hàm hợp lý</strong> là mật độ đồng thời xem như hàm của θ khi dữ liệu cố định:</p>
<div class="formula"><span class="lbl">Hợp lý và log-hợp lý</span>L(θ) = ∏<sub>i=1..n</sub> f(x<sub>i</sub>; θ)      ℓ(θ) = log L(θ) = ∑<sub>i=1..n</sub> log f(x<sub>i</sub>; θ)      θ̂<sub>MLE</sub> = argmax<sub>θ</sub> ℓ(θ)</div>
<p>Logarit biến tích thành tổng và không làm dịch điểm cực đại. Thường ta giải <strong>phương trình score</strong> ℓ′(θ) = 0 rồi kiểm tra ℓ″(θ̂) &lt; 0. Hàm hợp lý <em>không</em> phải phân phối xác suất trên θ (không cần tích phân bằng 1); nó chỉ xếp hạng các giá trị tham số.</p>
<p><strong>Các kết quả chuẩn.</strong></p>
<ul>
<li><strong>Bernoulli(p)</strong> với s lần thành công: ℓ(p) = s log p + (n − s) log(1 − p); ℓ′ = s/p − (n − s)/(1 − p) = 0 ⇒ <b>p̂ = s/n</b>. Ví dụ: 56 lượt nhấp trên 120 lượt xem ⇒ p̂ = 0,4667.</li>
<li><strong>Poisson(λ)</strong>: ℓ(λ) = (∑x<sub>i</sub>) log λ − nλ − ∑ log x<sub>i</sub>!; ℓ′ = ∑x<sub>i</sub>/λ − n = 0 ⇒ <b>λ̂ = x̄</b>.</li>
<li><strong>Exponential(λ)</strong>: ℓ(λ) = n log λ − λ∑x<sub>i</sub> ⇒ <b>λ̂ = 1/x̄</b>.</li>
<li><strong>Normal(μ, σ<sup>2</sup>)</strong>: cho hai đạo hàm riêng bằng 0 được <b>μ̂ = x̄</b> và <b>σ̂<sup>2</sup> = (1/n)∑(x<sub>i</sub> − x̄)<sup>2</sup></b> — MLE của phương sai chia n nên hơi chệch. Với dữ liệu API ở Bài 1.1: μ̂ = 107, σ̂<sup>2</sup> = 57,5.</li>
<li><strong>Uniform(0, θ)</strong>: L(θ) = θ<sup>−n</sup> nếu θ ≥ max x<sub>i</sub>, ngược lại bằng 0. L giảm theo θ nên cực đại nằm ở biên: <b>θ̂ = max x<sub>i</sub></b>. Đạo hàm không tìm ra nó — luôn nhìn hình dạng của L.</li>
</ul>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — số lỗi báo cáo mỗi ngày.</b> Trong 12 ngày, nhóm ghi nhận 3, 5, 2, 4, 6, 3, 4, 5, 2, 6, 4, 4 báo lỗi. Giả sử Poisson(λ).</p>
<p>Bước 1: ∑x<sub>i</sub> = 48, n = 12. Bước 2: ℓ′(λ) = 48/λ − 12 = 0 ⇒ λ̂ = <b>4,0</b> lỗi/ngày. Bước 3: ℓ″(λ) = −48/λ<sup>2</sup> &lt; 0 nên là cực đại. Bảng dưới tính ℓ trên lưới và xác nhận đỉnh tại 4,0; để ý đường cong khá bằng gần đỉnh — độ bằng phẳng đó sẽ đo độ bất định ở Chương 3.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

bugs = np.array([3, 5, 2, 4, 6, 3, 4, 5, 2, 6, 4, 4])   # bugs reported per day, 12 days
grid = np.arange(2.0, 6.01, 0.5)
loglik = [stats.poisson.logpmf(bugs, lam).sum() for lam in grid]
for lam, ll in zip(grid, loglik):
    print(f"lambda={lam:.1f}  log-likelihood={ll:8.3f}")
print("argmax on grid:", grid[int(np.argmax(loglik))], "  closed form xbar =", bugs.mean())</code></pre>
<div class="out">lambda=2.0  log-likelihood= -31.144
lambda=2.5  log-likelihood= -26.434
lambda=3.0  log-likelihood= -23.682
lambda=3.5  log-likelihood= -22.283
lambda=4.0  log-likelihood= -21.873
lambda=4.5  log-likelihood= -22.220
lambda=5.0  log-likelihood= -23.162
lambda=5.5  log-likelihood= -24.588
lambda=6.0  log-likelihood= -26.411
argmax on grid: 4.0   closed form xbar = 4.0</div>
<p><strong>Vì sao ML quan trọng với CNTT.</strong> Hồi quy logistic và mạng nơ-ron phân loại được huấn luyện bằng cực tiểu cross-entropy, chính là âm log-hợp lý Bernoulli/đa phân loại. Hồi quy bình phương tối thiểu là MLE khi sai số chuẩn (Chương 9).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Lấy đạo hàm máy móc khi miền giá trị phụ thuộc θ (Uniform): cực đại nằm ở biên.</li><li>Quên rằng hằng số không quan trọng: có thể bỏ −∑ log x<sub>i</sub>! khỏi ℓ của Poisson.</li><li>Gọi L(θ) là “xác suất θ đúng”. Cách hiểu đó thuộc về phân phối hậu nghiệm Bayes (Bài 10.4).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>MLE cực đại hoá ℓ(θ) = ∑ log f(x<sub>i</sub>; θ).</li><li>Bernoulli: s/n; Poisson: x̄; Exponential: 1/x̄; Normal: x̄ và (1/n)∑(x<sub>i</sub> − x̄)<sup>2</sup>; Uniform(0, θ): max.</li><li>Giải ℓ′ = 0 và kiểm ℓ″ &lt; 0, nhưng cẩn thận cực đại ở biên.</li><li>Huấn luyện bằng cross-entropy = hợp lý cực đại.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class10-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 10b: Ước lượng hợp lý cực đại</a></li><li><a href="https://www.youtube.com/watch?v=XepXtl9YKwc" target="_blank" rel="noopener">StatQuest — Hợp lý cực đại, giải thích rõ ràng</a></li><li><a href="https://www.youtube.com/watch?v=Dn6b9fCIUpM" target="_blank" rel="noopener">StatQuest — MLE cho phân phối chuẩn, từng bước</a></li><li><a href="https://online.stat.psu.edu/stat415/Lesson04.html" target="_blank" rel="noopener">Penn State STAT 415 — Bài 4: Ước lượng hợp lý cực đại</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm MLE của λ cho dữ liệu mũ 0,5; 1,5; 2,0.</li><li>Geometric(p) trên {1, 2, …}: f(x; p) = (1 − p)<sup>x−1</sup>p. Suy ra MLE của p.</li><li>Dữ liệu Uniform(0, θ): 2,1; 0,7; 3,4; 1,9. Cho MLE và ước lượng đã hiệu chỉnh chệch của Bài 2.1.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) x̄ = 4/3, λ̂ = 0,75. 2) ℓ(p) = (∑x<sub>i</sub> − n) log(1 − p) + n log p ⇒ ℓ′ = n/p − (∑x<sub>i</sub> − n)/(1 − p) = 0 ⇒ p̂ = 1/x̄ (trùng MoM). 3) θ̂ = 3,4; hiệu chỉnh (5/4)·3,4 = 4,25.</p></div>`);

const c24 = L('psi221-ts-2-4',
  '2.4 — Numerical MLE and the invariance property|||2.4 — MLE tính số và tính bất biến',
  'Khi MLE không có công thức đóng: cực tiểu âm log-hợp lý bằng scipy.optimize (Gamma), so với stats.fit; tính bất biến g(θ̂); mẹo tham số hoá log.',
  `<span class="eyebrow">PSI221 · Chapter 2 · Lesson 2.4</span>
<h2>Numerical MLE and the invariance property</h2>
<p class="lead">For most real models the score equation has no closed-form solution. That is not a problem: maximum likelihood is an optimisation problem, and computers are good at optimisation.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write a negative log-likelihood function and minimise it with <code>scipy.optimize.minimize</code>.</li><li>Use MoM estimates as starting values and check results with <code>scipy.stats</code>' built-in <code>fit</code>.</li><li>Apply the invariance property: the MLE of g(θ) is g(θ̂).</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Why no closed form?</strong> For Gamma(α, β) data, ∂ℓ/∂β = 0 gives β = x̄/α, but ∂ℓ/∂α = 0 then leads to log α − ψ(α) = log x̄ − (1/n)∑ log x<sub>i</sub>, where ψ is the digamma function. That equation must be solved numerically. The same happens for the Weibull, Beta, logistic regression and every neural network.</p>
<p><strong>Recipe.</strong></p>
<ol>
<li>Write nll(θ) = −ℓ(θ) = −∑ log f(x<sub>i</sub>; θ). Optimisers <em>minimise</em>, so we negate.</li>
<li>Choose a good starting point — MoM estimates are ideal.</li>
<li>Respect constraints (e.g. α, β &gt; 0): return +∞ outside the allowed region, or optimise over log α and log β, which are unconstrained.</li>
<li>Call <code>minimize</code>; check that it reports success, and restart from another point if in doubt (likelihoods can have several local maxima).</li>
</ol>
<pre><code class="language-python">import numpy as np
from scipy import stats, optimize

rng = np.random.default_rng(42)
data = rng.gamma(shape=2.5, scale=2.0, size=200)   # true alpha=2.5, beta=2.0

def nll(params):                      # negative log-likelihood
    a, b = params
    if a &lt;= 0 or b &lt;= 0:
        return np.inf
    return -np.sum(stats.gamma.logpdf(data, a, scale=b))

mom = (data.mean()**2 / data.var(), data.var() / data.mean())   # starting point
res = optimize.minimize(nll, x0=mom, method="Nelder-Mead")
print("MoM start  :", np.round(mom, 3))
print("MLE (optim):", np.round(res.x, 3), " -loglik =", round(res.fun, 3))
a, loc, b = stats.gamma.fit(data, floc=0)            # scipy's built-in fit
print("stats.fit  :", np.round([a, b], 3))
print("mean = a*b :", round(res.x[0] * res.x[1], 3), " sample mean:", round(data.mean(), 3))</code></pre>
<div class="out">MoM start  : [2.617 1.979]
MLE (optim): [2.718 1.905]  -loglik = 485.856
stats.fit  : [2.718 1.905]
mean = a*b : 5.179  sample mean: 5.179</div>
<p>The true values were α = 2.5, β = 2.0; with n = 200 the MLE (2.718, 1.905) is close, and SciPy's own <code>fit</code> agrees to three decimals. Note the product α̂β̂ equals x̄ exactly — that is the β-equation β = x̄/α at work. MoM started us at (2.617, 1.979), already near the optimum.</p>
<h3>The invariance property</h3>
<div class="formula"><span class="lbl">Invariance of the MLE</span>If θ̂ is the MLE of θ, then for any function g, the MLE of τ = g(θ) is τ̂ = g(θ̂).</div>
<p>This is extremely convenient: no new optimisation is needed.</p>
<div class="callout"><p><b>Example 1.</b> Bugs per day ~ Poisson(λ), λ̂ = 4 (Lesson 2.3). The MLE of “probability of a bug-free day” P(X = 0) = e<sup>−λ</sup> is e<sup>−4</sup> = <b>0.0183</b>.</p>
<p><b>Example 2.</b> For the API data, σ̂<sup>2</sup> = 57.5, so the MLE of σ is √57.5 = <b>7.58</b> ms.</p>
<p><b>Example 3.</b> Gamma fit above: the MLE of the mean αβ is 2.718 × 1.905 = <b>5.18</b> s.</p></div>
<p>Unbiasedness is <em>not</em> invariant (E[S] ≠ σ), but maximum likelihood is — one reason MLE is preferred in practice.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Maximising instead of minimising: <code>minimize</code> needs −ℓ.</li><li>Multiplying densities instead of adding log-densities: the product of 10 000 small numbers underflows to 0.0. Always use <code>logpdf</code>.</li><li>Letting the optimiser wander into invalid parameters (negative scale) — guard or reparameterise.</li><li>In SciPy's <code>fit</code>, forgetting <code>floc=0</code> for a 2-parameter Gamma: otherwise a third “location” parameter is also estimated.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>No closed form? Minimise the negative log-likelihood numerically.</li><li>Start from MoM; enforce constraints; verify convergence.</li><li><code>scipy.stats.&lt;dist&gt;.fit</code> gives MLEs for built-in distributions.</li><li>Invariance: MLE of g(θ) = g(MLE of θ).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://online.stat.psu.edu/stat415/Lesson05.html" target="_blank" rel="noopener">Penn State STAT 415 — Lesson 5: Numeric maximum likelihood estimation</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.minimize.html" target="_blank" rel="noopener">SciPy — scipy.optimize.minimize</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.rv_continuous.fit.html" target="_blank" rel="noopener">SciPy — rv_continuous.fit (MLE for distributions)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Exponential data give λ̂ = 0.4 per minute. Give the MLE of the mean waiting time and of P(X &gt; 5).</li><li>Why is it safer to optimise over log β instead of β?</li><li>56 clicks out of 120: give the MLE of the odds p/(1 − p).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Mean 1/λ̂ = 2.5 min; P(X &gt; 5) = e<sup>−0.4·5</sup> = e<sup>−2</sup> ≈ 0.135. 2) log β can be any real number, so the optimiser can never step into β ≤ 0. 3) p̂ = 0.4667 ⇒ odds 0.4667/0.5333 = 0.875.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 2 · Bài 2.4</span>
<h2>MLE tính số và tính bất biến</h2>
<p class="lead">Với hầu hết mô hình thực tế, phương trình score không có nghiệm dạng đóng. Điều đó không thành vấn đề: hợp lý cực đại là một bài toán tối ưu, và máy tính rất giỏi tối ưu.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết hàm âm log-hợp lý và cực tiểu nó bằng <code>scipy.optimize.minimize</code>.</li><li>Dùng ước lượng MoM làm điểm xuất phát và kiểm tra với hàm <code>fit</code> có sẵn của <code>scipy.stats</code>.</li><li>Áp dụng tính bất biến: MLE của g(θ) là g(θ̂).</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Vì sao không có công thức đóng?</strong> Với dữ liệu Gamma(α, β), ∂ℓ/∂β = 0 cho β = x̄/α, nhưng ∂ℓ/∂α = 0 khi đó dẫn tới log α − ψ(α) = log x̄ − (1/n)∑ log x<sub>i</sub>, với ψ là hàm digamma. Phương trình này phải giải bằng phương pháp số. Điều tương tự xảy ra với Weibull, Beta, hồi quy logistic và mọi mạng nơ-ron.</p>
<p><strong>Công thức làm.</strong></p>
<ol>
<li>Viết nll(θ) = −ℓ(θ) = −∑ log f(x<sub>i</sub>; θ). Bộ tối ưu <em>cực tiểu hoá</em>, nên ta đổi dấu.</li>
<li>Chọn điểm xuất phát tốt — ước lượng MoM là lý tưởng.</li>
<li>Tôn trọng ràng buộc (vd α, β &gt; 0): trả về +∞ ngoài miền cho phép, hoặc tối ưu theo log α và log β, vốn không bị ràng buộc.</li>
<li>Gọi <code>minimize</code>; kiểm tra nó báo thành công, và khởi động lại từ điểm khác nếu nghi ngờ (hàm hợp lý có thể có nhiều cực đại địa phương).</li>
</ol>
<pre><code class="language-python">import numpy as np
from scipy import stats, optimize

rng = np.random.default_rng(42)
data = rng.gamma(shape=2.5, scale=2.0, size=200)   # true alpha=2.5, beta=2.0

def nll(params):                      # negative log-likelihood
    a, b = params
    if a &lt;= 0 or b &lt;= 0:
        return np.inf
    return -np.sum(stats.gamma.logpdf(data, a, scale=b))

mom = (data.mean()**2 / data.var(), data.var() / data.mean())   # starting point
res = optimize.minimize(nll, x0=mom, method="Nelder-Mead")
print("MoM start  :", np.round(mom, 3))
print("MLE (optim):", np.round(res.x, 3), " -loglik =", round(res.fun, 3))
a, loc, b = stats.gamma.fit(data, floc=0)            # scipy's built-in fit
print("stats.fit  :", np.round([a, b], 3))
print("mean = a*b :", round(res.x[0] * res.x[1], 3), " sample mean:", round(data.mean(), 3))</code></pre>
<div class="out">MoM start  : [2.617 1.979]
MLE (optim): [2.718 1.905]  -loglik = 485.856
stats.fit  : [2.718 1.905]
mean = a*b : 5.179  sample mean: 5.179</div>
<p>Giá trị thật là α = 2,5, β = 2,0; với n = 200, MLE (2,718; 1,905) khá gần, và hàm <code>fit</code> của SciPy khớp tới ba chữ số thập phân. Để ý tích α̂β̂ bằng đúng x̄ — đó là phương trình β = x̄/α. MoM cho điểm xuất phát (2,617; 1,979), vốn đã gần điểm tối ưu.</p>
<h3>Tính bất biến</h3>
<div class="formula"><span class="lbl">Tính bất biến của MLE</span>Nếu θ̂ là MLE của θ thì với mọi hàm g, MLE của τ = g(θ) là τ̂ = g(θ̂).</div>
<p>Rất tiện: không cần tối ưu lại.</p>
<div class="callout"><p><b>Ví dụ 1.</b> Số lỗi/ngày ~ Poisson(λ), λ̂ = 4 (Bài 2.3). MLE của “xác suất một ngày không có lỗi” P(X = 0) = e<sup>−λ</sup> là e<sup>−4</sup> = <b>0,0183</b>.</p>
<p><b>Ví dụ 2.</b> Với dữ liệu API, σ̂<sup>2</sup> = 57,5, nên MLE của σ là √57,5 = <b>7,58</b> ms.</p>
<p><b>Ví dụ 3.</b> Khớp Gamma ở trên: MLE của kỳ vọng αβ là 2,718 × 1,905 = <b>5,18</b> s.</p></div>
<p>Tính không chệch <em>không</em> bất biến (E[S] ≠ σ), còn hợp lý cực đại thì có — một lý do MLE được ưa chuộng trong thực hành.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Cực đại hoá thay vì cực tiểu hoá: <code>minimize</code> cần −ℓ.</li><li>Nhân các mật độ thay vì cộng log-mật độ: tích của 10 000 số nhỏ bị tràn dưới thành 0.0. Luôn dùng <code>logpdf</code>.</li><li>Để bộ tối ưu đi lạc vào tham số không hợp lệ (scale âm) — chặn lại hoặc đổi tham số.</li><li>Với <code>fit</code> của SciPy, quên <code>floc=0</code> cho Gamma hai tham số: nếu không nó ước lượng thêm tham số “vị trí” thứ ba.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Không có công thức đóng? Cực tiểu âm log-hợp lý bằng phương pháp số.</li><li>Xuất phát từ MoM; đảm bảo ràng buộc; kiểm tra hội tụ.</li><li><code>scipy.stats.&lt;dist&gt;.fit</code> cho MLE của các phân phối có sẵn.</li><li>Bất biến: MLE của g(θ) = g(MLE của θ).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://online.stat.psu.edu/stat415/Lesson05.html" target="_blank" rel="noopener">Penn State STAT 415 — Bài 5: MLE tính số</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.minimize.html" target="_blank" rel="noopener">SciPy — scipy.optimize.minimize</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.rv_continuous.fit.html" target="_blank" rel="noopener">SciPy — rv_continuous.fit (MLE cho phân phối)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Dữ liệu mũ cho λ̂ = 0,4 mỗi phút. Cho MLE của thời gian chờ trung bình và của P(X &gt; 5).</li><li>Vì sao tối ưu theo log β an toàn hơn theo β?</li><li>56 lượt nhấp trên 120: cho MLE của odds p/(1 − p).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Trung bình 1/λ̂ = 2,5 phút; P(X &gt; 5) = e<sup>−0,4·5</sup> = e<sup>−2</sup> ≈ 0,135. 2) log β nhận mọi giá trị thực, nên bộ tối ưu không bao giờ bước vào β ≤ 0. 3) p̂ = 0,4667 ⇒ odds 0,4667/0,5333 = 0,875.</p></div>`);

const q2 = QZ(2, 'Quiz — Chapter 2: Point estimation|||Quiz — Chương 2: Ước lượng điểm', 'Kiểm tra chương 2: độ chệch, MSE, phương pháp mô-men, MLE giải tích và tính số, tính bất biến.', [
  Q('q1', 'MSE(θ̂) equals|||MSE(θ̂) bằng',
    ['Var(θ̂) − bias²|||Var(θ̂) − chệch²', 'Var(θ̂) + bias²|||Var(θ̂) + chệch²', 'bias² only|||chỉ chệch²', 'SE(θ̂) + bias|||SE(θ̂) + chệch'], 1,
    'Expand E[(θ̂ − θ)²]; the cross term is zero.|||Khai triển E[(θ̂ − θ)²]; số hạng chéo bằng 0.'),
  Q('q2', 'E[θ̂] = θ + 2 and Var(θ̂) = 5. The MSE is|||E[θ̂] = θ + 2 và Var(θ̂) = 5. MSE bằng',
    ['7|||7', '9|||9', '5|||5', '25|||25'], 1,
    '5 + 2² = 9.|||5 + 2² = 9.'),
  Q('q3', 'For Uniform(0, θ) with n = 10, which estimator has the smallest MSE?|||Với Uniform(0, θ), n = 10, ước lượng nào có MSE nhỏ nhất?',
    ['2X̄|||2X̄', 'max Xᵢ|||max Xᵢ', '(11/10)·max Xᵢ|||(11/10)·max Xᵢ', 'X̄|||X̄'], 2,
    'MSEs: θ²/30, 2θ²/132, θ²/120 — the corrected maximum wins.|||MSE lần lượt θ²/30, 2θ²/132, θ²/120 — max đã hiệu chỉnh thắng.'),
  Q('q4', 'The method-of-moments estimator of λ for Exponential(λ) data is|||Ước lượng mô-men của λ cho dữ liệu Exponential(λ) là',
    ['X̄|||X̄', '1/X̄|||1/X̄', 'S²|||S²', 'max Xᵢ|||max Xᵢ'], 1,
    'E[X] = 1/λ, so λ = 1/E[X].|||E[X] = 1/λ, nên λ = 1/E[X].'),
  Q('q5', 'Gamma(α, β) with x̄ = 6 and σ̂² = 12. The MoM estimates (α̂, β̂) are|||Gamma(α, β) với x̄ = 6 và σ̂² = 12. Ước lượng mô-men (α̂, β̂) là',
    ['(3, 2)|||(3, 2)', '(2, 3)|||(2, 3)', '(0.5, 12)|||(0,5; 12)', '(6, 12)|||(6, 12)'], 0,
    'β̂ = 12/6 = 2, α̂ = 36/12 = 3.|||β̂ = 12/6 = 2, α̂ = 36/12 = 3.'),
  Q('q6', 'The MLE of p from 18 successes in 60 Bernoulli trials is|||MLE của p từ 18 thành công trong 60 phép thử Bernoulli là',
    ['0.18|||0,18', '0.30|||0,30', '0.42|||0,42', '18|||18'], 1,
    'p̂ = s/n = 18/60.|||p̂ = s/n = 18/60.'),
  Q('q7', 'For normal data, the MLE of σ² is|||Với dữ liệu chuẩn, MLE của σ² là',
    ['S² with divisor n − 1|||S² chia n − 1', '(1/n)∑(Xᵢ − X̄)²|||(1/n)∑(Xᵢ − X̄)²', '(1/n)∑Xᵢ²|||(1/n)∑Xᵢ²', 'X̄²|||X̄²'], 1,
    'The MLE divides by n and is therefore slightly biased.|||MLE chia n nên hơi chệch.'),
  Q('q8', 'Why can the MLE of θ for Uniform(0, θ) NOT be found by solving ℓ′(θ) = 0?|||Vì sao không tìm được MLE của θ cho Uniform(0, θ) bằng cách giải ℓ′(θ) = 0?',
    ['ℓ is constant|||ℓ là hằng số', 'The maximum is at the boundary θ = max xᵢ|||Cực đại nằm ở biên θ = max xᵢ', 'The data are discrete|||Dữ liệu rời rạc', 'There is no MLE|||Không có MLE'], 1,
    'L(θ) = θ⁻ⁿ is decreasing for θ ≥ max xᵢ and zero below it.|||L(θ) = θ⁻ⁿ giảm khi θ ≥ max xᵢ và bằng 0 phía dưới.'),
  Q('q9', 'When minimising a negative log-likelihood numerically, the best starting values are usually|||Khi cực tiểu âm log-hợp lý bằng số, điểm xuất phát tốt nhất thường là',
    ['all zeros|||toàn số 0', 'random numbers|||số ngẫu nhiên', 'method-of-moments estimates|||ước lượng mô-men', 'the true values|||giá trị thật'], 2,
    'MoM estimates are cheap and usually close to the optimum.|||Ước lượng mô-men rẻ và thường gần điểm tối ưu.'),
  Q('q10', 'Poisson data give λ̂ = 2. The MLE of P(X = 0) = e^(−λ) is|||Dữ liệu Poisson cho λ̂ = 2. MLE của P(X = 0) = e^(−λ) là',
    ['e^(−2) ≈ 0.135|||e^(−2) ≈ 0,135', '0.5|||0,5', '2e^(−2)|||2e^(−2)', 'cannot be found without a new optimisation|||không tìm được nếu không tối ưu lại'], 0,
    'Invariance: plug λ̂ into g(λ) = e^(−λ).|||Bất biến: thay λ̂ vào g(λ) = e^(−λ).'),
]);

const ch2 = {
  title: 'Chapter 2 — Point estimation: method of moments and maximum likelihood|||Chương 2 — Ước lượng điểm: phương pháp mô-men và hợp lý cực đại',
  description: 'Độ chệch, phương sai, MSE; phương pháp mô-men; MLE giải tích và tính số bằng scipy; tính bất biến (Wasserman Ch. 9 · Casella–Berger 7.1–7.3 · STAT 415 bài 2–5).',
  lessons: [c21, c22, c23, c24, q2],
};


// ───────────────────────────── Chương 3 — Tính chất của ước lượng ─────────────────────────────
const c31 = L('psi221-ts-3-1',
  '3.1 — Fisher information and the Cramér–Rao lower bound|||3.1 — Thông tin Fisher và cận dưới Cramér–Rao',
  'Hàm score, E[score] = 0, thông tin Fisher I(θ) = −E[ℓ″]; cận Cramér–Rao 1/(nI(θ)); ước lượng hiệu quả; Bernoulli, Poisson, Normal; tính I(θ) bằng sympy.',
  `<span class="eyebrow">PSI221 · Chapter 3 · Lesson 3.1</span>
<h2>Fisher information and the Cramér–Rao lower bound</h2>
<p class="lead">How precisely <em>can</em> a parameter be estimated from n observations? Fisher information answers this before you choose any estimator, and the Cramér–Rao bound turns the answer into a floor on the variance of every unbiased estimator.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define the score function and Fisher information I(θ).</li><li>Compute I(θ) for Bernoulli, Poisson and Normal models.</li><li>State the Cramér–Rao lower bound and decide whether an estimator is efficient.</li></ul>
<h3>📖 Lecture</h3>
<p>For one observation with density f(x; θ), the <strong>score</strong> is s(θ; X) = ∂/∂θ log f(X; θ). Under regularity conditions (the support of f does not depend on θ, and we can differentiate under the integral), E<sub>θ</sub>[s(θ; X)] = 0. The <strong>Fisher information</strong> is the variance of the score:</p>
<div class="formula"><span class="lbl">Fisher information</span>I(θ) = E[s(θ; X)<sup>2</sup>] = −E[∂<sup>2</sup>/∂θ<sup>2</sup> log f(X; θ)]      for n i.i.d. observations: I<sub>n</sub>(θ) = n·I(θ)</div>
<p>Interpretation: the second derivative measures the <strong>curvature</strong> of the log-likelihood. A sharply peaked log-likelihood (large curvature) pins θ down precisely; a flat one (the Poisson curve of Lesson 2.3 near its top) leaves θ uncertain. Information adds over independent observations.</p>
<div class="formula"><span class="lbl">Cramér–Rao lower bound (CRLB)</span>If T is an unbiased estimator of θ, then   Var(T) ≥ 1 / (n·I(θ)).<br>For an unbiased estimator of g(θ):   Var(T) ≥ g′(θ)<sup>2</sup> / (n·I(θ)).</div>
<p>An unbiased estimator that attains the bound is called <strong>efficient</strong>; its <strong>efficiency</strong> is CRLB/Var(T) ≤ 1.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Bernoulli(p).</b> log f = x log p + (1 − x) log(1 − p); second derivative −x/p<sup>2</sup> − (1 − x)/(1 − p)<sup>2</sup>. Taking expectations with E[X] = p: I(p) = 1/p + 1/(1 − p) = <b>1/(p(1 − p))</b>. CRLB = p(1 − p)/n = Var(p̂): the sample proportion is efficient. With 56 clicks in 120 views, p̂ = 0.4667, I(p̂) = 4.018, and the bound (estimated) is 0.002074, i.e. SE = 0.0455.</p>
<p><b>Poisson(λ).</b> log f = x log λ − λ − log x!; second derivative −x/λ<sup>2</sup>; I(λ) = E[X]/λ<sup>2</sup> = <b>1/λ</b>. CRLB = λ/n = Var(X̄): X̄ is efficient.</p>
<p><b>Normal(μ, σ<sup>2</sup>), σ known.</b> I(μ) = 1/σ<sup>2</sup>, CRLB = σ<sup>2</sup>/n = Var(X̄). The sample median has variance ≈ πσ<sup>2</sup>/(2n) for large n, so its efficiency is 2/π ≈ 0.64: with normal data the median wastes about a third of the data.</p></div>
<p>SymPy can do the algebra. The printed −1/(p(p − 1)) is the same as 1/(p(1 − p)):</p>
<pre><code class="language-python">import sympy as sp

x, p, lam = sp.symbols("x p lambda", positive=True)
# Bernoulli: log f = x log p + (1 - x) log(1 - p);  I(p) = -E[d^2/dp^2 log f]
logf_b = x * sp.log(p) + (1 - x) * sp.log(1 - p)
d2_b = sp.diff(logf_b, p, 2)
I_b = sp.simplify(-(d2_b.subs(x, 1) * p + d2_b.subs(x, 0) * (1 - p)))   # E over x in {0,1}
print("Bernoulli I(p) =", sp.factor(I_b))
# Poisson: log f = x log(lambda) - lambda - log(x!);  E[X] = lambda
logf_p = x * sp.log(lam) - lam
I_p = sp.simplify(-sp.diff(logf_p, lam, 2).subs(x, lam))
print("Poisson   I(lambda) =", I_p)
n = 120
print("CRLB for p at p=56/120, n=120 :", sp.N((1 / (n * I_b)).subs(p, sp.Rational(56, 120)), 6))</code></pre>
<div class="out">Bernoulli I(p) = -1/(p*(p - 1))
Poisson   I(lambda) = 1/lambda
CRLB for p at p=56/120, n=120 : 0.00207407</div>
<p><strong>When the bound does not apply.</strong> For Uniform(0, θ) the support depends on θ, so the regularity conditions fail. Indeed the corrected maximum of Lesson 2.1 has variance θ<sup>2</sup>/(n(n + 2)), shrinking like 1/n<sup>2</sup> — faster than any CRLB-type 1/n rate.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the factor n: the bound for a sample is 1/(n·I), not 1/I.</li><li>Applying the CRLB to biased estimators: a biased estimator can have smaller variance (even zero — the constant estimator T = 5).</li><li>Using the bound when the support depends on θ (Uniform, shifted exponential).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Score = derivative of log f; mean 0. Information = variance of score = −E[second derivative].</li><li>Bernoulli: 1/(p(1 − p)); Poisson: 1/λ; Normal mean: 1/σ<sup>2</sup>.</li><li>CRLB: unbiased ⇒ Var ≥ 1/(nI(θ)). Attaining it = efficient.</li><li>p̂ and X̄ are efficient in their models; the median is not, for normal data.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-650-statistics-for-applications-fall-2016/video_galleries/lecture-videos/" target="_blank" rel="noopener">MIT 18.650 — Lecture videos (Fisher information, MLE)</a></li><li><a href="https://online.stat.psu.edu/stat415/Lesson07.html" target="_blank" rel="noopener">Penn State STAT 415 — Lesson 7: Properties and asymptotic distribution of MLEs</a></li><li><a href="https://www.routledge.com/Statistical-Inference/Casella-Berger/p/book/9781032593036" target="_blank" rel="noopener">Casella &amp; Berger — Statistical Inference (Section 7.3.2: the Cramér–Rao inequality)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Exponential(λ): f(x) = λe<sup>−λx</sup>. Show I(λ) = 1/λ<sup>2</sup> and give the CRLB for n observations.</li><li>An unbiased estimator of μ (normal, σ = 6, n = 36) has variance 1.5. What is its efficiency?</li><li>Compute I(p) at p = 0.5 and p = 0.05. Where is a proportion easier to estimate in relative terms?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) log f = log λ − λx; second derivative −1/λ<sup>2</sup>; I = 1/λ<sup>2</sup>; CRLB = λ<sup>2</sup>/n. 2) CRLB = 36/36 = 1; efficiency 1/1.5 = 0.667. 3) I(0.5) = 4, I(0.05) ≈ 21.05. The absolute SE √(p(1 − p)/n) is smaller near 0.05, but relative to p itself (SE/p) it is much larger: rare events need big samples.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 3 · Bài 3.1</span>
<h2>Thông tin Fisher và cận dưới Cramér–Rao</h2>
<p class="lead">Từ n quan sát, một tham số <em>có thể</em> được ước lượng chính xác tới mức nào? Thông tin Fisher trả lời trước cả khi bạn chọn ước lượng, và cận Cramér–Rao biến câu trả lời đó thành một “sàn” cho phương sai của mọi ước lượng không chệch.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa hàm score và thông tin Fisher I(θ).</li><li>Tính I(θ) cho các mô hình Bernoulli, Poisson và Normal.</li><li>Phát biểu cận dưới Cramér–Rao và xét một ước lượng có hiệu quả không.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Với một quan sát có mật độ f(x; θ), <strong>score</strong> là s(θ; X) = ∂/∂θ log f(X; θ). Với các điều kiện chính quy (miền giá trị của f không phụ thuộc θ, được phép đạo hàm dưới dấu tích phân), E<sub>θ</sub>[s(θ; X)] = 0. <strong>Thông tin Fisher</strong> là phương sai của score:</p>
<div class="formula"><span class="lbl">Thông tin Fisher</span>I(θ) = E[s(θ; X)<sup>2</sup>] = −E[∂<sup>2</sup>/∂θ<sup>2</sup> log f(X; θ)]      với n quan sát i.i.d.: I<sub>n</sub>(θ) = n·I(θ)</div>
<p>Ý nghĩa: đạo hàm cấp hai đo <strong>độ cong</strong> của log-hợp lý. Log-hợp lý nhọn (độ cong lớn) ghim θ rất chính xác; log-hợp lý bằng phẳng (đường Poisson ở Bài 2.3 gần đỉnh) để θ còn bất định. Thông tin cộng dồn qua các quan sát độc lập.</p>
<div class="formula"><span class="lbl">Cận dưới Cramér–Rao (CRLB)</span>Nếu T là ước lượng không chệch của θ thì   Var(T) ≥ 1 / (n·I(θ)).<br>Với ước lượng không chệch của g(θ):   Var(T) ≥ g′(θ)<sup>2</sup> / (n·I(θ)).</div>
<p>Ước lượng không chệch đạt đúng cận gọi là <strong>hiệu quả</strong> (efficient); <strong>hiệu suất</strong> của nó là CRLB/Var(T) ≤ 1.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Bernoulli(p).</b> log f = x log p + (1 − x) log(1 − p); đạo hàm cấp hai −x/p<sup>2</sup> − (1 − x)/(1 − p)<sup>2</sup>. Lấy kỳ vọng với E[X] = p: I(p) = 1/p + 1/(1 − p) = <b>1/(p(1 − p))</b>. CRLB = p(1 − p)/n = Var(p̂): tỉ lệ mẫu là ước lượng hiệu quả. Với 56 lượt nhấp/120 lượt xem, p̂ = 0,4667, I(p̂) = 4,018, cận (ước lượng) là 0,002074, tức SE = 0,0455.</p>
<p><b>Poisson(λ).</b> log f = x log λ − λ − log x!; đạo hàm cấp hai −x/λ<sup>2</sup>; I(λ) = E[X]/λ<sup>2</sup> = <b>1/λ</b>. CRLB = λ/n = Var(X̄): X̄ hiệu quả.</p>
<p><b>Normal(μ, σ<sup>2</sup>), σ đã biết.</b> I(μ) = 1/σ<sup>2</sup>, CRLB = σ<sup>2</sup>/n = Var(X̄). Trung vị mẫu có phương sai ≈ πσ<sup>2</sup>/(2n) khi n lớn, nên hiệu suất của nó là 2/π ≈ 0,64: với dữ liệu chuẩn, trung vị phí khoảng một phần ba dữ liệu.</p></div>
<p>SymPy làm hộ phần đại số. Kết quả in ra −1/(p(p − 1)) chính là 1/(p(1 − p)):</p>
<pre><code class="language-python">import sympy as sp

x, p, lam = sp.symbols("x p lambda", positive=True)
# Bernoulli: log f = x log p + (1 - x) log(1 - p);  I(p) = -E[d^2/dp^2 log f]
logf_b = x * sp.log(p) + (1 - x) * sp.log(1 - p)
d2_b = sp.diff(logf_b, p, 2)
I_b = sp.simplify(-(d2_b.subs(x, 1) * p + d2_b.subs(x, 0) * (1 - p)))   # E over x in {0,1}
print("Bernoulli I(p) =", sp.factor(I_b))
# Poisson: log f = x log(lambda) - lambda - log(x!);  E[X] = lambda
logf_p = x * sp.log(lam) - lam
I_p = sp.simplify(-sp.diff(logf_p, lam, 2).subs(x, lam))
print("Poisson   I(lambda) =", I_p)
n = 120
print("CRLB for p at p=56/120, n=120 :", sp.N((1 / (n * I_b)).subs(p, sp.Rational(56, 120)), 6))</code></pre>
<div class="out">Bernoulli I(p) = -1/(p*(p - 1))
Poisson   I(lambda) = 1/lambda
CRLB for p at p=56/120, n=120 : 0.00207407</div>
<p><strong>Khi cận không áp dụng.</strong> Với Uniform(0, θ), miền giá trị phụ thuộc θ nên điều kiện chính quy bị vi phạm. Thật vậy, max đã hiệu chỉnh ở Bài 2.1 có phương sai θ<sup>2</sup>/(n(n + 2)), giảm như 1/n<sup>2</sup> — nhanh hơn mọi tốc độ 1/n kiểu CRLB.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên thừa số n: cận cho cả mẫu là 1/(n·I), không phải 1/I.</li><li>Áp CRLB cho ước lượng chệch: ước lượng chệch có thể có phương sai nhỏ hơn (thậm chí bằng 0 — ước lượng hằng T = 5).</li><li>Dùng cận khi miền giá trị phụ thuộc θ (Uniform, mũ dịch chuyển).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Score = đạo hàm của log f; kỳ vọng 0. Thông tin = phương sai của score = −E[đạo hàm cấp hai].</li><li>Bernoulli: 1/(p(1 − p)); Poisson: 1/λ; trung bình Normal: 1/σ<sup>2</sup>.</li><li>CRLB: không chệch ⇒ Var ≥ 1/(nI(θ)). Đạt cận = hiệu quả.</li><li>p̂ và X̄ hiệu quả trong mô hình của chúng; trung vị thì không, với dữ liệu chuẩn.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-650-statistics-for-applications-fall-2016/video_galleries/lecture-videos/" target="_blank" rel="noopener">MIT 18.650 — Video bài giảng (thông tin Fisher, MLE)</a></li><li><a href="https://online.stat.psu.edu/stat415/Lesson07.html" target="_blank" rel="noopener">Penn State STAT 415 — Bài 7: Tính chất và phân phối tiệm cận của MLE</a></li><li><a href="https://www.routledge.com/Statistical-Inference/Casella-Berger/p/book/9781032593036" target="_blank" rel="noopener">Casella &amp; Berger — Statistical Inference (mục 7.3.2: bất đẳng thức Cramér–Rao)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Exponential(λ): f(x) = λe<sup>−λx</sup>. Chứng minh I(λ) = 1/λ<sup>2</sup> và cho CRLB với n quan sát.</li><li>Một ước lượng không chệch của μ (chuẩn, σ = 6, n = 36) có phương sai 1,5. Hiệu suất của nó bằng bao nhiêu?</li><li>Tính I(p) tại p = 0,5 và p = 0,05. Ở đâu tỉ lệ dễ ước lượng hơn xét theo sai số tương đối?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) log f = log λ − λx; đạo hàm cấp hai −1/λ<sup>2</sup>; I = 1/λ<sup>2</sup>; CRLB = λ<sup>2</sup>/n. 2) CRLB = 36/36 = 1; hiệu suất 1/1,5 = 0,667. 3) I(0,5) = 4, I(0,05) ≈ 21,05. SE tuyệt đối √(p(1 − p)/n) nhỏ hơn ở 0,05, nhưng so với chính p (SE/p) thì lớn hơn nhiều: sự kiện hiếm cần mẫu lớn.</p></div>`);

const c32 = L('psi221-ts-3-2',
  '3.2 — Consistency, asymptotic normality of the MLE and the delta method|||3.2 — Tính vững, tiệm cận chuẩn của MLE và phương pháp delta',
  'MLE vững và xấp xỉ N(θ, 1/(nI(θ))); sai số chuẩn Wald; phương pháp delta cho g(θ̂); ví dụ log-odds và tốc độ mũ; mô phỏng 20 000 lần.',
  `<span class="eyebrow">PSI221 · Chapter 3 · Lesson 3.2</span>
<h2>Consistency, asymptotic normality of the MLE and the delta method</h2>
<p class="lead">The single most useful theorem of likelihood theory: for large n, the MLE is approximately normal, centred at the truth, with variance equal to the Cramér–Rao bound. That gives a standard error for <em>any</em> MLE, even one found numerically.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define consistency and state the asymptotic normality of the MLE.</li><li>Compute Wald standard errors from Fisher information (expected or observed).</li><li>Use the delta method to get the standard error of a transformed estimate g(θ̂).</li></ul>
<h3>📖 Lecture</h3>
<p>An estimator θ̂<sub>n</sub> is <strong>consistent</strong> if θ̂<sub>n</sub> → θ in probability as n → ∞: for every ε &gt; 0, P(|θ̂<sub>n</sub> − θ| &gt; ε) → 0. A sufficient condition is bias → 0 and variance → 0 (so MSE → 0). X̄ is consistent by the law of large numbers.</p>
<div class="formula"><span class="lbl">Asymptotic normality of the MLE (regular models)</span>θ̂<sub>MLE</sub> ≈ N( θ, 1/(n·I(θ)) )   for large n      SE(θ̂) ≈ 1/√(n·I(θ̂))  (Wald standard error)<br>Observed information alternative: SE ≈ 1/√(−ℓ″(θ̂))</div>
<p>So the MLE is consistent, asymptotically unbiased and asymptotically efficient — it attains the Cramér–Rao bound in the limit. In software, the observed information −ℓ″(θ̂) is often obtained as the Hessian of the negative log-likelihood at the optimum.</p>
<div class="callout"><p><b>Example 1 — Poisson.</b> λ̂ = 4 from n = 12 days. I(λ) = 1/λ, so SE = √(λ̂/n) = √(4/12) = <b>0.577</b>, and an approximate 95% interval is 4 ± 1.96·0.577 = (2.87, 5.13) (Chapter 4 makes this precise).</p>
<p><b>Example 2 — Exponential.</b> I(λ) = 1/λ<sup>2</sup> ⇒ SE(λ̂) = λ̂/√n. With λ = 2 and n = 50 the theory predicts SD 0.283; the simulation below gives 0.290 and shows the Wald statistic covers the truth 95.5% of the time. The MLE is slightly biased upward (mean 2.04; exactly E[λ̂] = nλ/(n − 1) = 2.041) — the bias vanishes as n grows.</p></div>
<pre><code class="language-python">import numpy as np

rng = np.random.default_rng(7)
lam, n, reps = 2.0, 50, 20000
x = rng.exponential(scale=1/lam, size=(reps, n))
lam_hat = 1 / x.mean(axis=1)                  # MLE of the rate in each replicate

print("mean of MLEs     :", round(lam_hat.mean(), 4))     # slightly &gt; 2: small bias
print("sd of MLEs       :", round(lam_hat.std(), 4))
print("theory 1/sqrt(nI):", round(lam / np.sqrt(n), 4))   # I(lam) = 1/lam^2
z = (lam_hat - lam) / (lam_hat / np.sqrt(n))             # Wald statistic
print("P(|z| &lt; 1.96)    :", round(np.mean(np.abs(z) &lt; 1.96), 4))</code></pre>
<div class="out">mean of MLEs     : 2.0405
sd of MLEs       : 0.2903
theory 1/sqrt(nI): 0.2828
P(|z| &lt; 1.96)    : 0.9554</div>
<h3>The delta method</h3>
<p>Often we need a function of the parameter: the odds, a log-rate, a ratio. If θ̂ ≈ N(θ, SE<sup>2</sup>) and g is differentiable with g′(θ) ≠ 0, a first-order Taylor expansion g(θ̂) ≈ g(θ) + g′(θ)(θ̂ − θ) gives</p>
<div class="formula"><span class="lbl">Delta method</span>g(θ̂) ≈ N( g(θ), g′(θ)<sup>2</sup>·SE(θ̂)<sup>2</sup> )      SE(g(θ̂)) ≈ |g′(θ̂)|·SE(θ̂)</div>
<div class="callout"><p><b>Example 3 — log-odds of a click.</b> p̂ = 56/120 = 0.4667, SE(p̂) = 0.0455. Let g(p) = log(p/(1 − p)), g′(p) = 1/(p(1 − p)) = 4.018.</p>
<p>Step 1: g(p̂) = log(0.875) = −0.1335. Step 2: SE = 4.018 × 0.0455 = 0.1830 (equivalently 1/√(np̂(1 − p̂))). Step 3: 95% interval for the log-odds: −0.1335 ± 1.96·0.1830 = (−0.492, 0.225). Step 4: transform back with p = 1/(1 + e<sup>−t</sup>): (<b>0.379, 0.556</b>) for p. Intervals built on the log-odds scale never leave [0, 1] — this is how logistic regression reports uncertainty.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using asymptotic SEs with tiny n or with parameters near a boundary (p̂ = 0 gives SE = 0, which is nonsense).</li><li>Forgetting the absolute value and the square in the delta method: Var(g(θ̂)) ≈ g′<sup>2</sup>·Var(θ̂).</li><li>Assuming consistency implies unbiasedness for finite n (λ̂ = 1/x̄ is biased but consistent).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Consistent: θ̂<sub>n</sub> → θ. MSE → 0 is enough.</li><li>MLE ≈ N(θ, 1/(nI(θ))); Wald SE = 1/√(nI(θ̂)) or 1/√(observed information).</li><li>Delta method: SE(g(θ̂)) ≈ |g′(θ̂)|·SE(θ̂).</li><li>Transform to an unbounded scale (log, logit), build the interval there, transform back.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://online.stat.psu.edu/stat415/Lesson07.html" target="_blank" rel="noopener">Penn State STAT 415 — Lesson 7: Asymptotic distribution of the MLE</a></li><li><a href="https://online.stat.psu.edu/stat415/Lesson08.html" target="_blank" rel="noopener">Penn State STAT 415 — Lesson 8: Inference on transformations of parameters</a></li><li><a href="https://ocw.mit.edu/courses/18-650-statistics-for-applications-fall-2016/pages/lecture-slides/" target="_blank" rel="noopener">MIT 18.650 — Lecture slides (asymptotic normality, delta method)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Bernoulli: 30 successes in 200 trials. Give p̂ and its Wald SE.</li><li>Exponential with n = 100 and x̄ = 0.25. Give λ̂ and SE(λ̂).</li><li>Poisson λ̂ = 4, SE = 0.577. Use the delta method to find the SE of log λ̂.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) p̂ = 0.15, SE = √(0.15·0.85/200) = 0.0252. 2) λ̂ = 4, SE = 4/10 = 0.4. 3) g′(λ) = 1/λ ⇒ SE = 0.577/4 = 0.144 (= 1/√(∑x<sub>i</sub>) = 1/√48).</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 3 · Bài 3.2</span>
<h2>Tính vững, tiệm cận chuẩn của MLE và phương pháp delta</h2>
<p class="lead">Định lý hữu ích nhất của lý thuyết hợp lý: khi n lớn, MLE xấp xỉ chuẩn, tâm ở giá trị thật, phương sai bằng cận Cramér–Rao. Nhờ đó ta có sai số chuẩn cho <em>mọi</em> MLE, kể cả MLE tìm bằng phương pháp số.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa tính vững và phát biểu tính tiệm cận chuẩn của MLE.</li><li>Tính sai số chuẩn Wald từ thông tin Fisher (kỳ vọng hoặc quan sát).</li><li>Dùng phương pháp delta để có sai số chuẩn của ước lượng đã biến đổi g(θ̂).</li></ul>
<h3>📖 Bài giảng</h3>
<p>Ước lượng θ̂<sub>n</sub> gọi là <strong>vững</strong> (consistent) nếu θ̂<sub>n</sub> → θ theo xác suất khi n → ∞: với mọi ε &gt; 0, P(|θ̂<sub>n</sub> − θ| &gt; ε) → 0. Điều kiện đủ là chệch → 0 và phương sai → 0 (tức MSE → 0). X̄ vững theo luật số lớn.</p>
<div class="formula"><span class="lbl">Tính tiệm cận chuẩn của MLE (mô hình chính quy)</span>θ̂<sub>MLE</sub> ≈ N( θ, 1/(n·I(θ)) )   khi n lớn      SE(θ̂) ≈ 1/√(n·I(θ̂))  (sai số chuẩn Wald)<br>Cách khác dùng thông tin quan sát: SE ≈ 1/√(−ℓ″(θ̂))</div>
<p>Vậy MLE vững, tiệm cận không chệch và tiệm cận hiệu quả — nó đạt cận Cramér–Rao ở giới hạn. Trong phần mềm, thông tin quan sát −ℓ″(θ̂) thường lấy từ ma trận Hessian của âm log-hợp lý tại điểm tối ưu.</p>
<div class="callout"><p><b>Ví dụ 1 — Poisson.</b> λ̂ = 4 từ n = 12 ngày. I(λ) = 1/λ, nên SE = √(λ̂/n) = √(4/12) = <b>0,577</b>, và khoảng xấp xỉ 95% là 4 ± 1,96·0,577 = (2,87; 5,13) (Chương 4 làm chặt chẽ điều này).</p>
<p><b>Ví dụ 2 — Exponential.</b> I(λ) = 1/λ<sup>2</sup> ⇒ SE(λ̂) = λ̂/√n. Với λ = 2 và n = 50, lý thuyết dự đoán SD 0,283; mô phỏng dưới cho 0,290 và cho thấy thống kê Wald phủ giá trị thật 95,5% số lần. MLE hơi chệch lên (trung bình 2,04; chính xác E[λ̂] = nλ/(n − 1) = 2,041) — độ chệch biến mất khi n tăng.</p></div>
<pre><code class="language-python">import numpy as np

rng = np.random.default_rng(7)
lam, n, reps = 2.0, 50, 20000
x = rng.exponential(scale=1/lam, size=(reps, n))
lam_hat = 1 / x.mean(axis=1)                  # MLE of the rate in each replicate

print("mean of MLEs     :", round(lam_hat.mean(), 4))     # slightly &gt; 2: small bias
print("sd of MLEs       :", round(lam_hat.std(), 4))
print("theory 1/sqrt(nI):", round(lam / np.sqrt(n), 4))   # I(lam) = 1/lam^2
z = (lam_hat - lam) / (lam_hat / np.sqrt(n))             # Wald statistic
print("P(|z| &lt; 1.96)    :", round(np.mean(np.abs(z) &lt; 1.96), 4))</code></pre>
<div class="out">mean of MLEs     : 2.0405
sd of MLEs       : 0.2903
theory 1/sqrt(nI): 0.2828
P(|z| &lt; 1.96)    : 0.9554</div>
<h3>Phương pháp delta</h3>
<p>Ta thường cần một hàm của tham số: odds, log-tốc độ, một tỉ số. Nếu θ̂ ≈ N(θ, SE<sup>2</sup>) và g khả vi với g′(θ) ≠ 0, khai triển Taylor bậc nhất g(θ̂) ≈ g(θ) + g′(θ)(θ̂ − θ) cho</p>
<div class="formula"><span class="lbl">Phương pháp delta</span>g(θ̂) ≈ N( g(θ), g′(θ)<sup>2</sup>·SE(θ̂)<sup>2</sup> )      SE(g(θ̂)) ≈ |g′(θ̂)|·SE(θ̂)</div>
<div class="callout"><p><b>Ví dụ 3 — log-odds của lượt nhấp.</b> p̂ = 56/120 = 0,4667, SE(p̂) = 0,0455. Đặt g(p) = log(p/(1 − p)), g′(p) = 1/(p(1 − p)) = 4,018.</p>
<p>Bước 1: g(p̂) = log(0,875) = −0,1335. Bước 2: SE = 4,018 × 0,0455 = 0,1830 (tương đương 1/√(np̂(1 − p̂))). Bước 3: khoảng 95% cho log-odds: −0,1335 ± 1,96·0,1830 = (−0,492; 0,225). Bước 4: đổi ngược bằng p = 1/(1 + e<sup>−t</sup>): (<b>0,379; 0,556</b>) cho p. Khoảng dựng trên thang log-odds không bao giờ ra ngoài [0, 1] — đó là cách hồi quy logistic báo cáo độ bất định.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng SE tiệm cận khi n quá nhỏ hoặc tham số sát biên (p̂ = 0 cho SE = 0, vô nghĩa).</li><li>Quên trị tuyệt đối và bình phương trong phương pháp delta: Var(g(θ̂)) ≈ g′<sup>2</sup>·Var(θ̂).</li><li>Tưởng vững nghĩa là không chệch với n hữu hạn (λ̂ = 1/x̄ chệch nhưng vững).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Vững: θ̂<sub>n</sub> → θ. MSE → 0 là đủ.</li><li>MLE ≈ N(θ, 1/(nI(θ))); SE Wald = 1/√(nI(θ̂)) hoặc 1/√(thông tin quan sát).</li><li>Phương pháp delta: SE(g(θ̂)) ≈ |g′(θ̂)|·SE(θ̂).</li><li>Đổi sang thang không bị chặn (log, logit), dựng khoảng ở đó, rồi đổi ngược.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://online.stat.psu.edu/stat415/Lesson07.html" target="_blank" rel="noopener">Penn State STAT 415 — Bài 7: Phân phối tiệm cận của MLE</a></li><li><a href="https://online.stat.psu.edu/stat415/Lesson08.html" target="_blank" rel="noopener">Penn State STAT 415 — Bài 8: Suy luận cho hàm của tham số</a></li><li><a href="https://ocw.mit.edu/courses/18-650-statistics-for-applications-fall-2016/pages/lecture-slides/" target="_blank" rel="noopener">MIT 18.650 — Slide bài giảng (tiệm cận chuẩn, phương pháp delta)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Bernoulli: 30 thành công trong 200 phép thử. Cho p̂ và SE Wald.</li><li>Exponential với n = 100 và x̄ = 0,25. Cho λ̂ và SE(λ̂).</li><li>Poisson λ̂ = 4, SE = 0,577. Dùng phương pháp delta tìm SE của log λ̂.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) p̂ = 0,15, SE = √(0,15·0,85/200) = 0,0252. 2) λ̂ = 4, SE = 4/10 = 0,4. 3) g′(λ) = 1/λ ⇒ SE = 0,577/4 = 0,144 (= 1/√(∑x<sub>i</sub>) = 1/√48).</p></div>`);

const c33 = L('psi221-ts-3-3',
  '3.3 — Sufficient statistics and the factorization theorem|||3.3 — Thống kê đủ và định lý phân tích nhân tử',
  'Thống kê đủ: nén dữ liệu không mất thông tin về θ; định lý Fisher–Neyman; ví dụ Bernoulli, Poisson, Normal, Uniform; họ mũ; Rao–Blackwell.',
  `<span class="eyebrow">PSI221 · Chapter 3 · Lesson 3.3</span>
<h2>Sufficient statistics and the factorization theorem</h2>
<p class="lead">If you could keep only one number from a million observations, which number would lose nothing about θ? A <strong>sufficient statistic</strong> is a lossless compression of the data — for the purpose of learning θ.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define a sufficient statistic.</li><li>Use the factorization theorem to find sufficient statistics.</li><li>Recognise exponential families and state the Rao–Blackwell theorem.</li></ul>
<h3>📖 Lecture</h3>
<p>A statistic T(X) is <strong>sufficient</strong> for θ if the conditional distribution of the sample given T(X) = t does not depend on θ. Once you know T, the rest of the data is pure noise as far as θ is concerned.</p>
<div class="formula"><span class="lbl">Factorization theorem (Fisher–Neyman)</span>T is sufficient for θ   ⇔   f(x<sub>1</sub>, …, x<sub>n</sub>; θ) = g( T(x), θ ) · h(x<sub>1</sub>, …, x<sub>n</sub>)<br>where h does not depend on θ.</div>
<p>Consequence: the likelihood depends on the data only through T, so the MLE (and any Bayesian posterior) is a function of T.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Bernoulli(p).</b> f = ∏p<sup>x<sub>i</sub></sup>(1 − p)<sup>1−x<sub>i</sub></sup> = p<sup>∑x<sub>i</sub></sup>(1 − p)<sup>n−∑x<sub>i</sub></sup>. Take g = that expression and h = 1: <b>T = ∑X<sub>i</sub></b> (the number of clicks) is sufficient. The order of clicks carries no information about p.</p>
<p><b>Poisson(λ).</b> f = λ<sup>∑x<sub>i</sub></sup>e<sup>−nλ</sup> · (1/∏x<sub>i</sub>!) ⇒ <b>T = ∑X<sub>i</sub></b>.</p>
<p><b>Normal(μ, σ<sup>2</sup>), both unknown.</b> f = (2πσ<sup>2</sup>)<sup>−n/2</sup> exp(−(∑x<sub>i</sub><sup>2</sup> − 2μ∑x<sub>i</sub> + nμ<sup>2</sup>)/(2σ<sup>2</sup>)) ⇒ <b>T = (∑X<sub>i</sub>, ∑X<sub>i</sub><sup>2</sup>)</b>, equivalently (X̄, S<sup>2</sup>). This is why a normal sample can be summarised by its mean and standard deviation.</p>
<p><b>Uniform(0, θ).</b> f = θ<sup>−n</sup>·1{max x<sub>i</sub> ≤ θ}·1{min x<sub>i</sub> ≥ 0} ⇒ <b>T = max X<sub>i</sub></b>. That explains Lesson 2.1: estimators based on the maximum beat 2X̄, which ignores the sufficient statistic.</p></div>
<p>The Poisson log-likelihoods of two different data sets with the same n and the same sum differ only by a constant, so they rank every λ identically and give the same MLE:</p>
<pre><code class="language-python">import numpy as np
from scipy import stats

day_a = np.array([3, 5, 2, 4, 6, 3, 4, 5, 2, 6, 4, 4])   # sum 48
day_b = np.array([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4])   # different data, same sum 48
for lam in [2.0, 3.0, 4.0, 5.0, 6.0]:
    la = stats.poisson.logpmf(day_a, lam).sum()
    lb = stats.poisson.logpmf(day_b, lam).sum()
    print(f"lambda={lam}: loglik A={la:8.3f}  loglik B={lb:8.3f}  difference={la - lb:.3f}")</code></pre>
<div class="out">lambda=2.0: loglik A= -31.144  loglik B= -28.866  difference=-2.279
lambda=3.0: loglik A= -23.682  loglik B= -21.403  difference=-2.279
lambda=4.0: loglik A= -21.873  loglik B= -19.595  difference=-2.279
lambda=5.0: loglik A= -23.162  loglik B= -20.884  difference=-2.279
lambda=6.0: loglik A= -26.411  loglik B= -24.132  difference=-2.279</div>
<p><strong>Exponential families.</strong> Many models can be written f(x; θ) = h(x) c(θ) exp(w(θ) t(x)). Then T = ∑t(X<sub>i</sub>) is sufficient. Bernoulli, binomial, Poisson, exponential, normal, gamma and beta are all exponential families; uniform with unknown endpoint is not.</p>
<p><strong>Rao–Blackwell theorem.</strong> If W is any unbiased estimator of θ and T is sufficient, then W* = E[W | T] is also unbiased and Var(W*) ≤ Var(W). Conditioning on a sufficient statistic can only help. Example: W = X<sub>1</sub> is unbiased for p; E[X<sub>1</sub> | ∑X<sub>i</sub>] = ∑X<sub>i</sub>/n = p̂, which has variance n times smaller.</p>
<p><strong>CS view.</strong> Sufficient statistics are why streaming algorithms work: to fit a Poisson rate or a normal model online you only keep running totals (n, ∑x, ∑x<sup>2</sup>), not the whole stream.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking a sufficient statistic must be one number: for two parameters it is often a pair.</li><li>Factorising incorrectly by leaving θ inside h(x). Every factor containing θ must go into g.</li><li>Believing sufficiency holds for every model: the sample mean is <em>not</em> sufficient for the centre of a Cauchy or Laplace distribution.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Sufficient = conditional distribution of the data given T does not depend on θ.</li><li>Factorization: f = g(T, θ)·h(x).</li><li>Bernoulli/Poisson: ∑X<sub>i</sub>; Normal: (∑X<sub>i</sub>, ∑X<sub>i</sub><sup>2</sup>); Uniform(0, θ): max.</li><li>Rao–Blackwell: conditioning an unbiased estimator on T reduces variance.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://online.stat.psu.edu/stat415/Lesson03.html" target="_blank" rel="noopener">Penn State STAT 415 — Lesson 3: Sufficiency</a></li><li><a href="https://ocw.mit.edu/courses/18-650-statistics-for-applications-fall-2016/" target="_blank" rel="noopener">MIT 18.650 — Statistics for Applications (course home)</a></li><li><a href="https://www.stat.cmu.edu/~larry/all-of-statistics/" target="_blank" rel="noopener">Wasserman — All of Statistics (book page; Chapter 9: Parametric Inference)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Find a sufficient statistic for λ in Exponential(λ).</li><li>X<sub>1</sub>, …, X<sub>n</sub> ~ N(μ, 1) (variance known). Find a sufficient statistic for μ.</li><li>You stream 10 million click events (0/1). What must you store to compute the MLE of p and its SE at any moment?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) f = λ<sup>n</sup>e<sup>−λ∑x<sub>i</sub></sup> ⇒ T = ∑X<sub>i</sub>. 2) f ∝ exp(μ∑x<sub>i</sub> − nμ<sup>2</sup>/2)·h(x) ⇒ T = ∑X<sub>i</sub> (or X̄). 3) Just n and ∑x<sub>i</sub>: p̂ = ∑x<sub>i</sub>/n and SE = √(p̂(1 − p̂)/n).</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 3 · Bài 3.3</span>
<h2>Thống kê đủ và định lý phân tích nhân tử</h2>
<p class="lead">Nếu chỉ được giữ một con số từ một triệu quan sát, con số nào không làm mất gì về θ? <strong>Thống kê đủ</strong> là một cách nén dữ liệu không mất mát — xét theo mục đích học về θ.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa thống kê đủ.</li><li>Dùng định lý phân tích nhân tử để tìm thống kê đủ.</li><li>Nhận ra họ mũ và phát biểu định lý Rao–Blackwell.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Thống kê T(X) gọi là <strong>đủ</strong> cho θ nếu phân phối có điều kiện của mẫu khi biết T(X) = t không phụ thuộc θ. Khi đã biết T, phần còn lại của dữ liệu chỉ là nhiễu xét về θ.</p>
<div class="formula"><span class="lbl">Định lý phân tích nhân tử (Fisher–Neyman)</span>T đủ cho θ   ⇔   f(x<sub>1</sub>, …, x<sub>n</sub>; θ) = g( T(x), θ ) · h(x<sub>1</sub>, …, x<sub>n</sub>)<br>trong đó h không phụ thuộc θ.</div>
<p>Hệ quả: hàm hợp lý chỉ phụ thuộc dữ liệu qua T, nên MLE (và mọi phân phối hậu nghiệm Bayes) là hàm của T.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Bernoulli(p).</b> f = ∏p<sup>x<sub>i</sub></sup>(1 − p)<sup>1−x<sub>i</sub></sup> = p<sup>∑x<sub>i</sub></sup>(1 − p)<sup>n−∑x<sub>i</sub></sup>. Lấy g = biểu thức đó và h = 1: <b>T = ∑X<sub>i</sub></b> (số lượt nhấp) là đủ. Thứ tự các lượt nhấp không mang thông tin gì về p.</p>
<p><b>Poisson(λ).</b> f = λ<sup>∑x<sub>i</sub></sup>e<sup>−nλ</sup> · (1/∏x<sub>i</sub>!) ⇒ <b>T = ∑X<sub>i</sub></b>.</p>
<p><b>Normal(μ, σ<sup>2</sup>), cả hai chưa biết.</b> f = (2πσ<sup>2</sup>)<sup>−n/2</sup> exp(−(∑x<sub>i</sub><sup>2</sup> − 2μ∑x<sub>i</sub> + nμ<sup>2</sup>)/(2σ<sup>2</sup>)) ⇒ <b>T = (∑X<sub>i</sub>, ∑X<sub>i</sub><sup>2</sup>)</b>, tương đương (X̄, S<sup>2</sup>). Đó là lý do một mẫu chuẩn có thể tóm tắt bằng trung bình và độ lệch chuẩn.</p>
<p><b>Uniform(0, θ).</b> f = θ<sup>−n</sup>·1{max x<sub>i</sub> ≤ θ}·1{min x<sub>i</sub> ≥ 0} ⇒ <b>T = max X<sub>i</sub></b>. Điều này giải thích Bài 2.1: ước lượng dựa trên max thắng 2X̄, vì 2X̄ bỏ qua thống kê đủ.</p></div>
<p>Log-hợp lý Poisson của hai bộ dữ liệu khác nhau nhưng cùng n và cùng tổng chỉ khác nhau một hằng số, nên chúng xếp hạng mọi λ y hệt nhau và cho cùng một MLE:</p>
<pre><code class="language-python">import numpy as np
from scipy import stats

day_a = np.array([3, 5, 2, 4, 6, 3, 4, 5, 2, 6, 4, 4])   # sum 48
day_b = np.array([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4])   # different data, same sum 48
for lam in [2.0, 3.0, 4.0, 5.0, 6.0]:
    la = stats.poisson.logpmf(day_a, lam).sum()
    lb = stats.poisson.logpmf(day_b, lam).sum()
    print(f"lambda={lam}: loglik A={la:8.3f}  loglik B={lb:8.3f}  difference={la - lb:.3f}")</code></pre>
<div class="out">lambda=2.0: loglik A= -31.144  loglik B= -28.866  difference=-2.279
lambda=3.0: loglik A= -23.682  loglik B= -21.403  difference=-2.279
lambda=4.0: loglik A= -21.873  loglik B= -19.595  difference=-2.279
lambda=5.0: loglik A= -23.162  loglik B= -20.884  difference=-2.279
lambda=6.0: loglik A= -26.411  loglik B= -24.132  difference=-2.279</div>
<p><strong>Họ mũ.</strong> Nhiều mô hình viết được dạng f(x; θ) = h(x) c(θ) exp(w(θ) t(x)). Khi đó T = ∑t(X<sub>i</sub>) là đủ. Bernoulli, nhị thức, Poisson, mũ, chuẩn, gamma và beta đều thuộc họ mũ; phân phối đều với cận chưa biết thì không.</p>
<p><strong>Định lý Rao–Blackwell.</strong> Nếu W là một ước lượng không chệch bất kỳ của θ và T đủ, thì W* = E[W | T] cũng không chệch và Var(W*) ≤ Var(W). Lấy điều kiện theo thống kê đủ chỉ có lợi. Ví dụ: W = X<sub>1</sub> không chệch cho p; E[X<sub>1</sub> | ∑X<sub>i</sub>] = ∑X<sub>i</sub>/n = p̂, có phương sai nhỏ hơn n lần.</p>
<p><strong>Góc nhìn CNTT.</strong> Thống kê đủ là lý do thuật toán luồng (streaming) hoạt động: muốn khớp tốc độ Poisson hay mô hình chuẩn trực tuyến, chỉ cần giữ các tổng chạy (n, ∑x, ∑x<sup>2</sup>), không cần cả luồng dữ liệu.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tưởng thống kê đủ phải là một con số: với hai tham số nó thường là một cặp.</li><li>Phân tích sai khi để θ nằm trong h(x). Mọi thừa số chứa θ phải vào g.</li><li>Tin rằng mô hình nào cũng có thống kê đủ đơn giản: trung bình mẫu <em>không</em> đủ cho tâm của phân phối Cauchy hay Laplace.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Đủ = phân phối có điều kiện của dữ liệu khi biết T không phụ thuộc θ.</li><li>Phân tích nhân tử: f = g(T, θ)·h(x).</li><li>Bernoulli/Poisson: ∑X<sub>i</sub>; Normal: (∑X<sub>i</sub>, ∑X<sub>i</sub><sup>2</sup>); Uniform(0, θ): max.</li><li>Rao–Blackwell: lấy điều kiện một ước lượng không chệch theo T làm giảm phương sai.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://online.stat.psu.edu/stat415/Lesson03.html" target="_blank" rel="noopener">Penn State STAT 415 — Bài 3: Tính đủ</a></li><li><a href="https://ocw.mit.edu/courses/18-650-statistics-for-applications-fall-2016/" target="_blank" rel="noopener">MIT 18.650 — Statistics for Applications (trang khoá)</a></li><li><a href="https://www.stat.cmu.edu/~larry/all-of-statistics/" target="_blank" rel="noopener">Wasserman — All of Statistics (trang sách; Chương 9: Parametric Inference)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm thống kê đủ cho λ trong Exponential(λ).</li><li>X<sub>1</sub>, …, X<sub>n</sub> ~ N(μ, 1) (phương sai đã biết). Tìm thống kê đủ cho μ.</li><li>Bạn nhận luồng 10 triệu sự kiện nhấp (0/1). Phải lưu gì để tính MLE của p và SE của nó bất cứ lúc nào?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) f = λ<sup>n</sup>e<sup>−λ∑x<sub>i</sub></sup> ⇒ T = ∑X<sub>i</sub>. 2) f ∝ exp(μ∑x<sub>i</sub> − nμ<sup>2</sup>/2)·h(x) ⇒ T = ∑X<sub>i</sub> (hoặc X̄). 3) Chỉ cần n và ∑x<sub>i</sub>: p̂ = ∑x<sub>i</sub>/n và SE = √(p̂(1 − p̂)/n).</p></div>`);

const q3 = QZ(3, 'Quiz — Chapter 3: Properties of estimators|||Quiz — Chương 3: Tính chất của ước lượng', 'Kiểm tra chương 3: thông tin Fisher, cận Cramér–Rao, tiệm cận chuẩn của MLE, phương pháp delta, thống kê đủ.', [
  Q('q1', 'The Fisher information of one Bernoulli(p) observation is|||Thông tin Fisher của một quan sát Bernoulli(p) là',
    ['p(1 − p)|||p(1 − p)', '1/(p(1 − p))|||1/(p(1 − p))', '1/p|||1/p', 'p²|||p²'], 1,
    'I(p) = 1/p + 1/(1 − p) = 1/(p(1 − p)).|||I(p) = 1/p + 1/(1 − p) = 1/(p(1 − p)).'),
  Q('q2', 'The Fisher information of one Poisson(λ) observation is|||Thông tin Fisher của một quan sát Poisson(λ) là',
    ['λ|||λ', '1/λ|||1/λ', '1/λ²|||1/λ²', 'λ²|||λ²'], 1,
    '−E[−X/λ²] = λ/λ² = 1/λ.|||−E[−X/λ²] = λ/λ² = 1/λ.'),
  Q('q3', 'The Cramér–Rao lower bound for unbiased estimators of a normal mean (σ = 4, n = 16) is|||Cận Cramér–Rao cho ước lượng không chệch của trung bình chuẩn (σ = 4, n = 16) là',
    ['0.25|||0,25', '1|||1', '4|||4', '16|||16'], 1,
    'σ²/n = 16/16 = 1.|||σ²/n = 16/16 = 1.'),
  Q('q4', 'An estimator is called efficient when|||Một ước lượng gọi là hiệu quả khi',
    ['it is consistent|||nó vững', 'it is unbiased and its variance equals the CRLB|||nó không chệch và phương sai bằng CRLB', 'its bias is small|||độ chệch nhỏ', 'it is the MLE|||nó là MLE'], 1,
    'Efficiency = CRLB / Var for unbiased estimators.|||Hiệu suất = CRLB / Var cho ước lượng không chệch.'),
  Q('q5', 'For large n, the MLE is approximately|||Khi n lớn, MLE xấp xỉ',
    ['N(θ, 1/(n I(θ)))|||N(θ, 1/(n I(θ)))', 'N(θ, I(θ)/n)|||N(θ, I(θ)/n)', 'χ²(n)|||χ²(n)', 'Uniform around θ|||đều quanh θ'], 0,
    'Asymptotic normality with variance equal to the inverse information.|||Tiệm cận chuẩn với phương sai bằng nghịch đảo thông tin.'),
  Q('q6', 'Exponential data: λ̂ = 5 with n = 100. The Wald SE of λ̂ is|||Dữ liệu mũ: λ̂ = 5 với n = 100. SE Wald của λ̂ là',
    ['0.05|||0,05', '0.5|||0,5', '5|||5', '0.25|||0,25'], 1,
    'SE = λ̂/√n = 5/10.|||SE = λ̂/√n = 5/10.'),
  Q('q7', 'By the delta method, SE(log θ̂) is approximately|||Theo phương pháp delta, SE(log θ̂) xấp xỉ',
    ['SE(θ̂)·θ̂|||SE(θ̂)·θ̂', 'SE(θ̂)/θ̂|||SE(θ̂)/θ̂', 'log SE(θ̂)|||log SE(θ̂)', 'SE(θ̂)²|||SE(θ̂)²'], 1,
    'g(θ) = log θ, g′(θ) = 1/θ.|||g(θ) = log θ, g′(θ) = 1/θ.'),
  Q('q8', 'A sufficient statistic for p in n Bernoulli trials is|||Thống kê đủ cho p trong n phép thử Bernoulli là',
    ['X₁|||X₁', 'the number of successes ∑Xᵢ|||số thành công ∑Xᵢ', 'the position of the first success|||vị trí lần thành công đầu', 'max Xᵢ|||max Xᵢ'], 1,
    'The likelihood is p^∑x (1 − p)^(n − ∑x).|||Hàm hợp lý là p^∑x (1 − p)^(n − ∑x).'),
  Q('q9', 'For Uniform(0, θ), the sufficient statistic is|||Với Uniform(0, θ), thống kê đủ là',
    ['X̄|||X̄', 'max Xᵢ|||max Xᵢ', 'min Xᵢ|||min Xᵢ', 'S²|||S²'], 1,
    'The likelihood is θ⁻ⁿ·1{max xᵢ ≤ θ}.|||Hàm hợp lý là θ⁻ⁿ·1{max xᵢ ≤ θ}.'),
  Q('q10', 'Why does the Cramér–Rao bound not apply to Uniform(0, θ)?|||Vì sao cận Cramér–Rao không áp dụng cho Uniform(0, θ)?',
    ['The model has no MLE|||Mô hình không có MLE', 'The support depends on θ, so regularity conditions fail|||Miền giá trị phụ thuộc θ nên điều kiện chính quy bị vi phạm', 'n is too small|||n quá nhỏ', 'The data are discrete|||Dữ liệu rời rạc'], 1,
    'Indeed the corrected max has variance of order 1/n², beating 1/n.|||Thật vậy, max hiệu chỉnh có phương sai cỡ 1/n², tốt hơn 1/n.'),
]);

const ch3 = {
  title: 'Chapter 3 — Properties of estimators: information, efficiency, sufficiency|||Chương 3 — Tính chất của ước lượng: thông tin, hiệu quả, tính đủ',
  description: 'Thông tin Fisher và cận Cramér–Rao; tính vững, tiệm cận chuẩn của MLE, sai số chuẩn Wald, phương pháp delta; thống kê đủ, họ mũ, Rao–Blackwell (Wasserman 9.4–9.13 · Casella–Berger 6.2, 7.3, 10.1).',
  lessons: [c31, c32, c33, q3],
};


// ───────────────────────────── Chương 4 — Khoảng tin cậy ─────────────────────────────
const c41 = L('psi221-ts-4-1',
  '4.1 — The idea of a confidence interval: pivots and the z-interval|||4.1 — Ý tưởng khoảng tin cậy: đại lượng chốt và khoảng z',
  'Đại lượng chốt (pivot), khoảng z cho μ khi biết σ, diễn giải đúng “95% tin cậy”, mô phỏng 10 000 khoảng, độ rộng và cỡ mẫu.',
  `<span class="eyebrow">PSI221 · Chapter 4 · Lesson 4.1</span>
<h2>The idea of a confidence interval: pivots and the z-interval</h2>
<p class="lead">A point estimate says “about 72.4”. A confidence interval says “between 70.4 and 74.4, and the method that produced this range captures the truth 95% of the time”. That second sentence is what decision-makers actually need.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define a confidence interval and its confidence level.</li><li>Build the z-interval for μ when σ is known, using a pivot.</li><li>Interpret “95% confidence” correctly and choose n for a target margin of error.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>(1 − α) confidence interval</strong> for θ is a pair of statistics (L, U) such that P<sub>θ</sub>(L ≤ θ ≤ U) = 1 − α for every θ. The probability is about the <em>random interval</em>, computed before the data are seen. After the data are in, the realised interval either contains θ or it does not.</p>
<p>The standard construction uses a <strong>pivot</strong>: a function of data and parameter whose distribution is completely known. For normal data with known σ,</p>
<div class="formula"><span class="lbl">Pivot and z-interval</span>Z = (X̄ − μ)/(σ/√n) ~ N(0, 1)   ⇒   P(−z<sub>α/2</sub> ≤ Z ≤ z<sub>α/2</sub>) = 1 − α<br>Solve for μ:   x̄ ± z<sub>α/2</sub>·σ/√n       z<sub>0.05</sub> = 1.645 (90%)   z<sub>0.025</sub> = 1.960 (95%)   z<sub>0.005</sub> = 2.576 (99%)</div>
<p>The quantity z<sub>α/2</sub>·σ/√n is the <strong>margin of error</strong> E. By the CLT the same formula is approximately valid for non-normal data when n is large.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — exam preparation time.</b> A survey of n = 36 students gives x̄ = 72.4 minutes of daily study; from past years σ = 6. Build 95% and 99% intervals.</p>
<p>Step 1: SE = 6/√36 = 1. Step 2 (95%): 72.4 ± 1.96·1 = <b>(70.44, 74.36)</b>. Step 3 (99%): 72.4 ± 2.576·1 = <b>(69.82, 74.98)</b>. Higher confidence ⇒ wider interval; there is no free lunch.</p></div>
<p><strong>What 95% means.</strong> Imagine repeating the whole study many times. Each repetition gives a different interval; about 95% of them contain the true μ. The simulation draws 10 000 samples from N(50, 10<sup>2</sup>) with n = 25:</p>
<pre><code class="language-python">import numpy as np
from scipy import stats

rng = np.random.default_rng(1)
mu, sigma, n, reps = 50.0, 10.0, 25, 10000
z = stats.norm.ppf(0.975)                       # 1.96
xbar = rng.normal(mu, sigma, size=(reps, n)).mean(axis=1)
lo, hi = xbar - z * sigma / np.sqrt(n), xbar + z * sigma / np.sqrt(n)
covered = (lo &lt;= mu) &amp; (mu &lt;= hi)
print("first interval  :", round(lo[0], 2), "to", round(hi[0], 2))
print("coverage rate   :", covered.mean())      # close to 0.95
print("intervals missed:", (~covered).sum(), "of", reps)</code></pre>
<div class="out">first interval  : 46.11 to 53.95
coverage rate   : 0.9494
intervals missed: 506 of 10000</div>
<p>9 494 of the 10 000 intervals caught μ = 50; 506 missed. You never know whether <em>your</em> interval is one of the lucky 95% — the confidence is in the procedure.</p>
<p><strong>Choosing n.</strong> To get margin E with confidence 1 − α, solve E = z<sub>α/2</sub>σ/√n:</p>
<div class="formula"><span class="lbl">Sample size for a mean</span>n = ( z<sub>α/2</sub>·σ / E )<sup>2</sup>, rounded up.   Example: σ = 15, E = 2, 95% ⇒ n = (1.96·15/2)<sup>2</sup> = 216.08 ⇒ n = 217.</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Saying “there is a 95% probability that μ lies in (70.44, 74.36)”. In frequentist statistics μ is fixed; the correct phrasing is about the method. (A Bayesian credible interval does allow that sentence — Lesson 10.4.)</li><li>Saying “95% of the data lie in the interval”. The interval is for the mean, not for individual values.</li><li>Rounding the sample size down: always round up.</li><li>Using z when σ is estimated from a small sample — use t (next lesson).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>CI = random interval covering θ with probability 1 − α.</li><li>Pivot (X̄ − μ)/(σ/√n) ~ N(0, 1) ⇒ x̄ ± z<sub>α/2</sub>σ/√n.</li><li>Width grows with confidence and σ, shrinks like 1/√n.</li><li>n = (z<sub>α/2</sub>σ/E)<sup>2</sup>, rounded up.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/8-1-a-single-population-mean-using-the-normal-distribution" target="_blank" rel="noopener">OpenStax — 8.1 A single population mean using the normal distribution</a></li><li><a href="https://www.itl.nist.gov/div898/handbook/prc/section1/prc14.htm" target="_blank" rel="noopener">NIST e-Handbook — What are confidence intervals?</a></li><li><a href="https://www.youtube.com/watch?v=TqOeMYtOc1w" target="_blank" rel="noopener">StatQuest — Confidence intervals, clearly explained</a></li><li><a href="https://seeing-theory.brown.edu/frequentist-inference/index.html" target="_blank" rel="noopener">Seeing Theory — Frequentist inference (interactive CIs)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>n = 49, x̄ = 120, σ = 14. Give the 90% z-interval.</li><li>What happens to the width if n is multiplied by 4?</li><li>How many observations are needed for a 99% margin of 1 unit when σ = 8?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) SE = 2; 120 ± 1.645·2 = (116.71, 123.29). 2) It is halved. 3) n = (2.576·8/1)<sup>2</sup> = 424.6 ⇒ 425.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 4 · Bài 4.1</span>
<h2>Ý tưởng khoảng tin cậy: đại lượng chốt và khoảng z</h2>
<p class="lead">Ước lượng điểm nói “khoảng 72,4”. Khoảng tin cậy nói “từ 70,4 đến 74,4, và phương pháp tạo ra khoảng này bắt trúng giá trị thật 95% số lần”. Câu thứ hai mới là thứ người ra quyết định thật sự cần.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa khoảng tin cậy và độ tin cậy.</li><li>Dựng khoảng z cho μ khi biết σ bằng đại lượng chốt.</li><li>Diễn giải đúng “tin cậy 95%” và chọn n cho sai số biên mong muốn.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Khoảng tin cậy (1 − α)</strong> cho θ là một cặp thống kê (L, U) sao cho P<sub>θ</sub>(L ≤ θ ≤ U) = 1 − α với mọi θ. Xác suất này nói về <em>khoảng ngẫu nhiên</em>, tính trước khi thấy dữ liệu. Sau khi có dữ liệu, khoảng cụ thể hoặc chứa θ hoặc không.</p>
<p>Cách dựng chuẩn dùng một <strong>đại lượng chốt</strong> (pivot): một hàm của dữ liệu và tham số mà phân phối hoàn toàn đã biết. Với dữ liệu chuẩn, σ đã biết,</p>
<div class="formula"><span class="lbl">Đại lượng chốt và khoảng z</span>Z = (X̄ − μ)/(σ/√n) ~ N(0, 1)   ⇒   P(−z<sub>α/2</sub> ≤ Z ≤ z<sub>α/2</sub>) = 1 − α<br>Giải theo μ:   x̄ ± z<sub>α/2</sub>·σ/√n       z<sub>0,05</sub> = 1,645 (90%)   z<sub>0,025</sub> = 1,960 (95%)   z<sub>0,005</sub> = 2,576 (99%)</div>
<p>Đại lượng z<sub>α/2</sub>·σ/√n là <strong>sai số biên</strong> E. Theo CLT, cùng công thức đó đúng xấp xỉ cho dữ liệu không chuẩn khi n lớn.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — thời gian ôn thi.</b> Khảo sát n = 36 sinh viên cho x̄ = 72,4 phút học mỗi ngày; từ các năm trước σ = 6. Dựng khoảng 95% và 99%.</p>
<p>Bước 1: SE = 6/√36 = 1. Bước 2 (95%): 72,4 ± 1,96·1 = <b>(70,44; 74,36)</b>. Bước 3 (99%): 72,4 ± 2,576·1 = <b>(69,82; 74,98)</b>. Tin cậy cao hơn ⇒ khoảng rộng hơn; không có bữa trưa miễn phí.</p></div>
<p><strong>95% nghĩa là gì.</strong> Tưởng tượng lặp lại cả nghiên cứu rất nhiều lần. Mỗi lần cho một khoảng khác; khoảng 95% số khoảng chứa μ thật. Mô phỏng rút 10 000 mẫu từ N(50, 10<sup>2</sup>) với n = 25:</p>
<pre><code class="language-python">import numpy as np
from scipy import stats

rng = np.random.default_rng(1)
mu, sigma, n, reps = 50.0, 10.0, 25, 10000
z = stats.norm.ppf(0.975)                       # 1.96
xbar = rng.normal(mu, sigma, size=(reps, n)).mean(axis=1)
lo, hi = xbar - z * sigma / np.sqrt(n), xbar + z * sigma / np.sqrt(n)
covered = (lo &lt;= mu) &amp; (mu &lt;= hi)
print("first interval  :", round(lo[0], 2), "to", round(hi[0], 2))
print("coverage rate   :", covered.mean())      # close to 0.95
print("intervals missed:", (~covered).sum(), "of", reps)</code></pre>
<div class="out">first interval  : 46.11 to 53.95
coverage rate   : 0.9494
intervals missed: 506 of 10000</div>
<p>9 494 trên 10 000 khoảng bắt được μ = 50; 506 khoảng trượt. Bạn không bao giờ biết khoảng <em>của mình</em> có thuộc 95% may mắn không — độ tin cậy nằm ở phương pháp.</p>
<p><strong>Chọn n.</strong> Muốn sai số biên E với độ tin cậy 1 − α, giải E = z<sub>α/2</sub>σ/√n:</p>
<div class="formula"><span class="lbl">Cỡ mẫu cho trung bình</span>n = ( z<sub>α/2</sub>·σ / E )<sup>2</sup>, làm tròn lên.   Ví dụ: σ = 15, E = 2, 95% ⇒ n = (1,96·15/2)<sup>2</sup> = 216,08 ⇒ n = 217.</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nói “xác suất 95% là μ nằm trong (70,44; 74,36)”. Trong thống kê tần suất μ cố định; cách nói đúng là về phương pháp. (Khoảng tin cậy Bayes — credible interval — mới cho phép câu đó, Bài 10.4.)</li><li>Nói “95% dữ liệu nằm trong khoảng”. Khoảng là cho trung bình, không cho từng giá trị.</li><li>Làm tròn cỡ mẫu xuống: luôn làm tròn lên.</li><li>Dùng z khi σ ước lượng từ mẫu nhỏ — phải dùng t (bài sau).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Khoảng tin cậy = khoảng ngẫu nhiên phủ θ với xác suất 1 − α.</li><li>Đại lượng chốt (X̄ − μ)/(σ/√n) ~ N(0, 1) ⇒ x̄ ± z<sub>α/2</sub>σ/√n.</li><li>Độ rộng tăng theo độ tin cậy và σ, giảm như 1/√n.</li><li>n = (z<sub>α/2</sub>σ/E)<sup>2</sup>, làm tròn lên.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/8-1-a-single-population-mean-using-the-normal-distribution" target="_blank" rel="noopener">OpenStax — 8.1 Trung bình một tổng thể dùng phân phối chuẩn</a></li><li><a href="https://www.itl.nist.gov/div898/handbook/prc/section1/prc14.htm" target="_blank" rel="noopener">NIST e-Handbook — Khoảng tin cậy là gì?</a></li><li><a href="https://www.youtube.com/watch?v=TqOeMYtOc1w" target="_blank" rel="noopener">StatQuest — Khoảng tin cậy, giải thích rõ ràng</a></li><li><a href="https://seeing-theory.brown.edu/frequentist-inference/index.html" target="_blank" rel="noopener">Seeing Theory — Suy luận tần suất (khoảng tin cậy tương tác)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>n = 49, x̄ = 120, σ = 14. Cho khoảng z 90%.</li><li>Độ rộng thay đổi thế nào nếu n nhân 4?</li><li>Cần bao nhiêu quan sát để sai số biên 99% là 1 đơn vị khi σ = 8?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) SE = 2; 120 ± 1,645·2 = (116,71; 123,29). 2) Giảm một nửa. 3) n = (2,576·8/1)<sup>2</sup> = 424,6 ⇒ 425.</p></div>`);

const c42 = L('psi221-ts-4-2',
  '4.2 — The t-interval for a mean when σ is unknown|||4.2 — Khoảng t cho trung bình khi chưa biết σ',
  'x̄ ± t*·s/√n với n − 1 bậc tự do; ví dụ 8 thời gian phản hồi API, so tính tay với scipy; độ bền vững và khi nào không dùng được.',
  `<span class="eyebrow">PSI221 · Chapter 4 · Lesson 4.2</span>
<h2>The t-interval for a mean when σ is unknown</h2>
<p class="lead">In practice σ is never known. Replacing it by s and z by a t quantile gives the most widely used interval in all of statistics.</p>
<h3>🎯 Objectives</h3>
<ul><li>Build the one-sample t-interval x̄ ± t*·s/√n.</li><li>Compute it by hand and with <code>scipy.stats</code>.</li><li>Know when the t-interval is trustworthy (normality, outliers, sample size).</li></ul>
<h3>📖 Lecture</h3>
<p>From Lesson 1.4, for normal data T = (X̄ − μ)/(S/√n) ~ t(n − 1), whatever μ and σ are — a pivot. Inverting it exactly as in 4.1:</p>
<div class="formula"><span class="lbl">One-sample t-interval</span>x̄ ± t<sub>α/2, n−1</sub> · s/√n      where t<sub>α/2, n−1</sub> = <code>stats.t.ppf(1 − α/2, n − 1)</code></div>
<p>Because t has heavier tails, t* &gt; z* and the interval is wider, honestly reflecting the extra uncertainty from estimating σ. For n = 8 at 95%: t* = 2.365 versus 1.960 — a 21% wider interval. For n ≥ 100 the two practically coincide.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — API response times.</b> The 8 times of Lesson 1.1 (112, 98, 105, 120, 101, 97, 110, 113 ms). Build a 95% interval for the mean response time.</p>
<p>Step 1: x̄ = 107, s = 8.106, n = 8, df = 7. Step 2: t* = t<sub>0.025, 7</sub> = 2.365. Step 3: margin = 2.365 × 8.106/√8 = 6.78. Step 4: <b>(100.22, 113.78)</b> ms. Conclusion: the service's mean response time is plausibly between about 100 and 114 ms; an SLA of “mean ≤ 100 ms” looks doubtful (we will test this formally in Lesson 6.1).</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

x = np.array([112, 98, 105, 120, 101, 97, 110, 113])   # API response times (ms)
n, xbar, s = len(x), x.mean(), x.std(ddof=1)
tcrit = stats.t.ppf(0.975, df=n - 1)
half = tcrit * s / np.sqrt(n)
print(f"xbar={xbar:.2f}  s={s:.3f}  t*={tcrit:.3f}")
print(f"95% CI by hand : ({xbar - half:.2f}, {xbar + half:.2f})")
ci = stats.ttest_1samp(x, popmean=0).confidence_interval(0.95)
print(f"95% CI scipy   : ({ci.low:.2f}, {ci.high:.2f})")</code></pre>
<div class="out">xbar=107.00  s=8.106  t*=2.365
95% CI by hand : (100.22, 113.78)
95% CI scipy   : (100.22, 113.78)</div>
<p>SciPy builds the interval from the result object of the one-sample t-test; the <code>popmean</code> argument does not affect the interval.</p>
<h3>When is it trustworthy?</h3>
<ul>
<li><strong>Normal data:</strong> exact for any n.</li>
<li><strong>Roughly symmetric data without outliers:</strong> fine for n ≥ 15 or so.</li>
<li><strong>Skewed data:</strong> need n ≥ 30–40, more for strong skew. For latencies, incomes and session lengths consider a log transform or the bootstrap (Lesson 10.3).</li>
<li><strong>Outliers:</strong> a single extreme value inflates both x̄ and s; always plot the data first (histogram or box plot).</li>
<li><strong>Dependence:</strong> the formula assumes independent observations. Measurements of the same server minute by minute are often autocorrelated, which makes the real uncertainty larger than the formula says.</li>
</ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using n instead of n − 1 degrees of freedom.</li><li>Using s computed with <code>ddof=0</code>.</li><li>Reading the interval as a range for individual response times. For a single future observation you need a <em>prediction interval</em> x̄ ± t*·s·√(1 + 1/n), which here is (86.67, 127.33) ms — much wider.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>σ unknown ⇒ x̄ ± t<sub>α/2, n−1</sub>·s/√n.</li><li>t* &gt; z*: wider intervals for small n, converging to z for large n.</li><li>Robust to mild non-normality, not to outliers or dependence.</li><li>Prediction interval for one new value: multiply s by √(1 + 1/n) instead of 1/√n.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/8-2-a-single-population-mean-using-the-student-t-distribution" target="_blank" rel="noopener">OpenStax — 8.2 A single population mean using the Student t distribution</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class22-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 22: Confidence intervals based on normal data</a></li><li><a href="https://online.stat.psu.edu/stat415/Lesson06.html" target="_blank" rel="noopener">Penn State STAT 415 — Lesson 6: Confidence intervals</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ttest_1samp.html" target="_blank" rel="noopener">SciPy — ttest_1samp (with confidence_interval)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>n = 16, x̄ = 20.5, s = 2. Give the 95% t-interval (t<sub>0.025, 15</sub> = 2.131).</li><li>Why is the t-interval wider than the z-interval with the same s?</li><li>A sample of n = 10 session lengths contains one value 50 times larger than the others. Is the t-interval appropriate?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 20.5 ± 2.131·0.5 = (19.43, 21.57). 2) It accounts for the randomness of s (heavier tails of t). 3) No — the outlier dominates x̄ and s. Investigate it; consider a log scale, the median with a bootstrap interval, or a rank method.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 4 · Bài 4.2</span>
<h2>Khoảng t cho trung bình khi chưa biết σ</h2>
<p class="lead">Thực tế σ không bao giờ biết trước. Thay nó bằng s và thay z bằng phân vị t cho ta khoảng tin cậy được dùng nhiều nhất trong thống kê.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dựng khoảng t một mẫu x̄ ± t*·s/√n.</li><li>Tính bằng tay và bằng <code>scipy.stats</code>.</li><li>Biết khi nào khoảng t đáng tin (tính chuẩn, ngoại lai, cỡ mẫu).</li></ul>
<h3>📖 Bài giảng</h3>
<p>Từ Bài 1.4, với dữ liệu chuẩn T = (X̄ − μ)/(S/√n) ~ t(n − 1), bất kể μ và σ — một đại lượng chốt. Đảo ngược y như bài 4.1:</p>
<div class="formula"><span class="lbl">Khoảng t một mẫu</span>x̄ ± t<sub>α/2, n−1</sub> · s/√n      với t<sub>α/2, n−1</sub> = <code>stats.t.ppf(1 − α/2, n − 1)</code></div>
<p>Vì t có đuôi nặng hơn nên t* &gt; z* và khoảng rộng hơn, phản ánh trung thực độ bất định thêm do phải ước lượng σ. Với n = 8 ở mức 95%: t* = 2,365 so với 1,960 — khoảng rộng hơn 21%. Với n ≥ 100 hai cái gần như trùng nhau.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — thời gian phản hồi API.</b> 8 thời gian ở Bài 1.1 (112, 98, 105, 120, 101, 97, 110, 113 ms). Dựng khoảng 95% cho thời gian phản hồi trung bình.</p>
<p>Bước 1: x̄ = 107, s = 8,106, n = 8, bậc tự do 7. Bước 2: t* = t<sub>0,025; 7</sub> = 2,365. Bước 3: sai số biên = 2,365 × 8,106/√8 = 6,78. Bước 4: <b>(100,22; 113,78)</b> ms. Kết luận: thời gian phản hồi trung bình của dịch vụ hợp lý nằm khoảng 100 tới 114 ms; cam kết SLA “trung bình ≤ 100 ms” có vẻ đáng ngờ (sẽ kiểm định chính thức ở Bài 6.1).</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

x = np.array([112, 98, 105, 120, 101, 97, 110, 113])   # API response times (ms)
n, xbar, s = len(x), x.mean(), x.std(ddof=1)
tcrit = stats.t.ppf(0.975, df=n - 1)
half = tcrit * s / np.sqrt(n)
print(f"xbar={xbar:.2f}  s={s:.3f}  t*={tcrit:.3f}")
print(f"95% CI by hand : ({xbar - half:.2f}, {xbar + half:.2f})")
ci = stats.ttest_1samp(x, popmean=0).confidence_interval(0.95)
print(f"95% CI scipy   : ({ci.low:.2f}, {ci.high:.2f})")</code></pre>
<div class="out">xbar=107.00  s=8.106  t*=2.365
95% CI by hand : (100.22, 113.78)
95% CI scipy   : (100.22, 113.78)</div>
<p>SciPy dựng khoảng từ đối tượng kết quả của kiểm định t một mẫu; tham số <code>popmean</code> không ảnh hưởng tới khoảng.</p>
<h3>Khi nào đáng tin?</h3>
<ul>
<li><strong>Dữ liệu chuẩn:</strong> chính xác với mọi n.</li>
<li><strong>Dữ liệu gần đối xứng, không ngoại lai:</strong> ổn với n ≥ 15 trở lên.</li>
<li><strong>Dữ liệu lệch:</strong> cần n ≥ 30–40, lệch mạnh thì hơn nữa. Với độ trễ, thu nhập, độ dài phiên hãy cân nhắc lấy log hoặc dùng bootstrap (Bài 10.3).</li>
<li><strong>Ngoại lai:</strong> một giá trị cực đoan làm phình cả x̄ lẫn s; luôn vẽ dữ liệu trước (histogram hoặc box plot).</li>
<li><strong>Phụ thuộc:</strong> công thức giả định quan sát độc lập. Số đo cùng một server theo từng phút thường tự tương quan, làm độ bất định thật lớn hơn công thức.</li>
</ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng n thay vì n − 1 bậc tự do.</li><li>Dùng s tính bằng <code>ddof=0</code>.</li><li>Đọc khoảng như phạm vi cho từng thời gian phản hồi. Với một quan sát mới cần <em>khoảng dự báo</em> x̄ ± t*·s·√(1 + 1/n), ở đây là (86,67; 127,33) ms — rộng hơn nhiều.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Chưa biết σ ⇒ x̄ ± t<sub>α/2, n−1</sub>·s/√n.</li><li>t* &gt; z*: khoảng rộng hơn khi n nhỏ, tiến về z khi n lớn.</li><li>Bền với lệch chuẩn nhẹ, không bền với ngoại lai hay phụ thuộc.</li><li>Khoảng dự báo cho một giá trị mới: nhân s với √(1 + 1/n) thay cho 1/√n.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/8-2-a-single-population-mean-using-the-student-t-distribution" target="_blank" rel="noopener">OpenStax — 8.2 Trung bình một tổng thể dùng phân phối Student t</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class22-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 22: Khoảng tin cậy cho dữ liệu chuẩn</a></li><li><a href="https://online.stat.psu.edu/stat415/Lesson06.html" target="_blank" rel="noopener">Penn State STAT 415 — Bài 6: Khoảng tin cậy</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ttest_1samp.html" target="_blank" rel="noopener">SciPy — ttest_1samp (có confidence_interval)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>n = 16, x̄ = 20,5, s = 2. Cho khoảng t 95% (t<sub>0,025; 15</sub> = 2,131).</li><li>Vì sao khoảng t rộng hơn khoảng z với cùng s?</li><li>Một mẫu n = 10 độ dài phiên có một giá trị lớn gấp 50 lần các giá trị khác. Khoảng t có phù hợp không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 20,5 ± 2,131·0,5 = (19,43; 21,57). 2) Nó tính tới tính ngẫu nhiên của s (đuôi t nặng hơn). 3) Không — ngoại lai chi phối x̄ và s. Hãy điều tra nó; cân nhắc thang log, trung vị kèm khoảng bootstrap, hoặc phương pháp hạng.</p></div>`);

const c43 = L('psi221-ts-4-3',
  '4.3 — Confidence intervals for a proportion and choosing the sample size|||4.3 — Khoảng tin cậy cho tỉ lệ và chọn cỡ mẫu',
  'Khoảng Wald p̂ ± z·√(p̂(1 − p̂)/n) và nhược điểm; khoảng Wilson, Clopper–Pearson bằng statsmodels; cỡ mẫu khảo sát ±3% (1068 người).',
  `<span class="eyebrow">PSI221 · Chapter 4 · Lesson 4.3</span>
<h2>Confidence intervals for a proportion and choosing the sample size</h2>
<p class="lead">Click-through rates, defect rates, pass rates, model accuracy — proportions are everywhere in computing. The textbook formula for their interval is simple but surprisingly unreliable; this lesson shows the better alternatives you should use in practice.</p>
<h3>🎯 Objectives</h3>
<ul><li>Build the Wald interval for p and know when it fails.</li><li>Compute the Wilson and Clopper–Pearson (exact) intervals with statsmodels.</li><li>Choose the sample size for a survey or an A/B test.</li></ul>
<h3>📖 Lecture</h3>
<p>With x successes in n trials, p̂ = x/n and SE = √(p̂(1 − p̂)/n) (Lessons 1.2, 3.1). The <strong>Wald interval</strong> applies the CLT directly:</p>
<div class="formula"><span class="lbl">Wald interval (large-sample)</span>p̂ ± z<sub>α/2</sub>·√( p̂(1 − p̂)/n )      use only when n·p̂ ≥ 10 and n·(1 − p̂) ≥ 10</div>
<p>Its actual coverage can be far below the nominal 95% for small n or p near 0 or 1, and it can produce impossible limits below 0 or above 1. Two better intervals:</p>
<ul>
<li><strong>Wilson score interval</strong>: invert the test |p̂ − p|/√(p(1 − p)/n) ≤ z, using the null p in the SE. Its centre is (x + z<sup>2</sup>/2)/(n + z<sup>2</sup>), pulled towards 1/2. Good coverage even for small n; it is the recommended default.</li>
<li><strong>Clopper–Pearson (“exact”)</strong>: based on binomial tail probabilities (computed with Beta quantiles). Coverage is at least 95% always — so it is conservative (a bit wide).</li>
</ul>
<p>A quick mental version of Wilson for 95% is the <strong>Agresti–Coull “plus four”</strong> rule: add 2 successes and 2 failures, then use the Wald formula.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — click-through rate.</b> A new banner received 56 clicks in 120 views. Give a 95% interval for the true click-through rate p.</p>
<p>Step 1: p̂ = 0.4667; checks 56 ≥ 10 and 64 ≥ 10 pass. Step 2: SE = √(0.4667·0.5333/120) = 0.0455. Step 3 (Wald): 0.4667 ± 1.96·0.0455 = <b>(0.377, 0.556)</b>. Wilson gives (0.380, 0.556) and Clopper–Pearson (0.375, 0.560) — all close here, because n is moderate and p̂ is near 0.5.</p>
<p><b>Edge case.</b> 1 failure in 20 test runs: Wald gives 0.05 ± 0.0955, i.e. a lower limit of −0.046, which statsmodels clips to 0 — and the interval is badly too narrow. Wilson gives (0.009, 0.236), honestly wide.</p></div>
<pre><code class="language-python">from statsmodels.stats.proportion import proportion_confint

clicks, n = 56, 120
for method in ["normal", "wilson", "beta"]:      # beta = Clopper-Pearson (exact)
    lo, hi = proportion_confint(clicks, n, alpha=0.05, method=method)
    print(f"{method:7s}: ({lo:.4f}, {hi:.4f})")
lo, hi = proportion_confint(1, 20, alpha=0.05, method="normal")
print(f"1/20 Wald : ({lo:.4f}, {hi:.4f})")      # lower end below 0!
lo, hi = proportion_confint(1, 20, alpha=0.05, method="wilson")
print(f"1/20 Wilson: ({lo:.4f}, {hi:.4f})")</code></pre>
<div class="out">normal : (0.3774, 0.5559)
wilson : (0.3798, 0.5556)
beta   : (0.3751, 0.5599)
1/20 Wald : (0.0000, 0.1455)
1/20 Wilson: (0.0089, 0.2361)</div>
<h3>Choosing the sample size</h3>
<div class="formula"><span class="lbl">Sample size for a proportion</span>n = z<sub>α/2</sub><sup>2</sup>·p*(1 − p*) / E<sup>2</sup>       with no prior guess use p* = 0.5 (the worst case)<br>95%, E = 0.03 ⇒ n = 1.96<sup>2</sup>·0.25/0.0009 = 1067.1 ⇒ <b>1068</b>      E = 0.05 ⇒ 384.1 ⇒ <b>385</b></div>
<p>This is why national opinion polls interview about 1 000 people: that gives roughly ±3 percentage points regardless of the country's population size (as long as the population is much larger than the sample).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using Wald for rare events (error rates, conversion of 0.5%) — use Wilson or exact.</li><li>Reporting [0, 0] when there are 0 failures in n tests. A useful rule (the “rule of three”): with 0 events in n trials, a 95% upper bound for p is about 3/n.</li><li>Forgetting that margin of error only covers random sampling error, not bias from a non-random sample.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Wald: p̂ ± z√(p̂(1 − p̂)/n) — fine for large counts only.</li><li>Wilson: recommended default; Clopper–Pearson: guaranteed coverage, conservative.</li><li>Sample size n = z<sup>2</sup>p*(1 − p*)/E<sup>2</sup>, with p* = 0.5 if unknown.</li><li>±3% at 95% needs about 1 068 respondents.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/8-3-a-population-proportion" target="_blank" rel="noopener">OpenStax — 8.3 A population proportion</a></li><li><a href="https://www.statsmodels.org/stable/generated/statsmodels.stats.proportion.proportion_confint.html" target="_blank" rel="noopener">statsmodels — proportion_confint (Wald, Wilson, Clopper–Pearson…)</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class23-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 23b: Confidence intervals for non-normal data</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A classifier is correct on 170 of 200 test images. Give the 95% Wald interval for its accuracy.</li><li>How many users must you survey for a 95% margin of ±2% with no prior guess?</li><li>0 crashes in 300 test runs. Give a quick 95% upper bound for the crash rate.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) p̂ = 0.85, SE = √(0.85·0.15/200) = 0.0252; 0.85 ± 0.0495 = (0.800, 0.899). 2) n = 1.96<sup>2</sup>·0.25/0.0004 = 2400.9 ⇒ 2401. 3) Rule of three: 3/300 = 1%.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 4 · Bài 4.3</span>
<h2>Khoảng tin cậy cho tỉ lệ và chọn cỡ mẫu</h2>
<p class="lead">Tỉ lệ nhấp, tỉ lệ lỗi, tỉ lệ đậu, độ chính xác của mô hình — tỉ lệ có ở khắp nơi trong ngành máy tính. Công thức sách giáo khoa cho khoảng của chúng đơn giản nhưng kém tin cậy bất ngờ; bài này chỉ ra các lựa chọn tốt hơn nên dùng trong thực tế.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dựng khoảng Wald cho p và biết khi nào nó hỏng.</li><li>Tính khoảng Wilson và Clopper–Pearson (chính xác) bằng statsmodels.</li><li>Chọn cỡ mẫu cho khảo sát hoặc A/B test.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Với x thành công trong n phép thử, p̂ = x/n và SE = √(p̂(1 − p̂)/n) (Bài 1.2, 3.1). <strong>Khoảng Wald</strong> áp CLT trực tiếp:</p>
<div class="formula"><span class="lbl">Khoảng Wald (mẫu lớn)</span>p̂ ± z<sub>α/2</sub>·√( p̂(1 − p̂)/n )      chỉ dùng khi n·p̂ ≥ 10 và n·(1 − p̂) ≥ 10</div>
<p>Độ phủ thật của nó có thể thấp xa dưới 95% danh nghĩa khi n nhỏ hoặc p gần 0, 1, và nó có thể cho cận vô lý dưới 0 hoặc trên 1. Hai khoảng tốt hơn:</p>
<ul>
<li><strong>Khoảng Wilson (score)</strong>: đảo ngược kiểm định |p̂ − p|/√(p(1 − p)/n) ≤ z, dùng p của giả thuyết trong SE. Tâm của nó là (x + z<sup>2</sup>/2)/(n + z<sup>2</sup>), kéo về phía 1/2. Độ phủ tốt kể cả khi n nhỏ; đây là lựa chọn mặc định nên dùng.</li>
<li><strong>Clopper–Pearson (“chính xác”)</strong>: dựa trên xác suất đuôi nhị thức (tính bằng phân vị Beta). Độ phủ luôn ít nhất 95% — nên nó bảo thủ (hơi rộng).</li>
</ul>
<p>Phiên bản tính nhẩm của Wilson ở mức 95% là quy tắc <strong>Agresti–Coull “cộng bốn”</strong>: thêm 2 thành công và 2 thất bại rồi dùng công thức Wald.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — tỉ lệ nhấp.</b> Một banner mới nhận 56 lượt nhấp trên 120 lượt xem. Cho khoảng 95% cho tỉ lệ nhấp thật p.</p>
<p>Bước 1: p̂ = 0,4667; kiểm tra 56 ≥ 10 và 64 ≥ 10 đạt. Bước 2: SE = √(0,4667·0,5333/120) = 0,0455. Bước 3 (Wald): 0,4667 ± 1,96·0,0455 = <b>(0,377; 0,556)</b>. Wilson cho (0,380; 0,556) và Clopper–Pearson (0,375; 0,560) — ở đây gần nhau, vì n vừa phải và p̂ gần 0,5.</p>
<p><b>Trường hợp biên.</b> 1 lần lỗi trong 20 lần chạy thử: Wald cho 0,05 ± 0,0955, tức cận dưới −0,046, statsmodels cắt về 0 — và khoảng hẹp quá mức nghiêm trọng. Wilson cho (0,009; 0,236), rộng một cách trung thực.</p></div>
<pre><code class="language-python">from statsmodels.stats.proportion import proportion_confint

clicks, n = 56, 120
for method in ["normal", "wilson", "beta"]:      # beta = Clopper-Pearson (exact)
    lo, hi = proportion_confint(clicks, n, alpha=0.05, method=method)
    print(f"{method:7s}: ({lo:.4f}, {hi:.4f})")
lo, hi = proportion_confint(1, 20, alpha=0.05, method="normal")
print(f"1/20 Wald : ({lo:.4f}, {hi:.4f})")      # lower end below 0!
lo, hi = proportion_confint(1, 20, alpha=0.05, method="wilson")
print(f"1/20 Wilson: ({lo:.4f}, {hi:.4f})")</code></pre>
<div class="out">normal : (0.3774, 0.5559)
wilson : (0.3798, 0.5556)
beta   : (0.3751, 0.5599)
1/20 Wald : (0.0000, 0.1455)
1/20 Wilson: (0.0089, 0.2361)</div>
<h3>Chọn cỡ mẫu</h3>
<div class="formula"><span class="lbl">Cỡ mẫu cho tỉ lệ</span>n = z<sub>α/2</sub><sup>2</sup>·p*(1 − p*) / E<sup>2</sup>       không có dự đoán trước thì dùng p* = 0,5 (trường hợp xấu nhất)<br>95%, E = 0,03 ⇒ n = 1,96<sup>2</sup>·0,25/0,0009 = 1067,1 ⇒ <b>1068</b>      E = 0,05 ⇒ 384,1 ⇒ <b>385</b></div>
<p>Đó là lý do các cuộc thăm dò dư luận quốc gia phỏng vấn khoảng 1 000 người: cho sai số khoảng ±3 điểm phần trăm bất kể dân số cả nước (miễn là tổng thể lớn hơn mẫu rất nhiều).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng Wald cho sự kiện hiếm (tỉ lệ lỗi, chuyển đổi 0,5%) — dùng Wilson hoặc chính xác.</li><li>Báo cáo [0, 0] khi có 0 lỗi trong n lần thử. Quy tắc hữu ích (“quy tắc ba”): 0 sự kiện trong n lần thử thì cận trên 95% cho p khoảng 3/n.</li><li>Quên rằng sai số biên chỉ bao sai số lấy mẫu ngẫu nhiên, không bao độ chệch do mẫu không ngẫu nhiên.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Wald: p̂ ± z√(p̂(1 − p̂)/n) — chỉ ổn khi số đếm lớn.</li><li>Wilson: mặc định nên dùng; Clopper–Pearson: chắc chắn đủ độ phủ, bảo thủ.</li><li>Cỡ mẫu n = z<sup>2</sup>p*(1 − p*)/E<sup>2</sup>, p* = 0,5 nếu chưa biết.</li><li>±3% ở mức 95% cần khoảng 1 068 người trả lời.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/8-3-a-population-proportion" target="_blank" rel="noopener">OpenStax — 8.3 Tỉ lệ của tổng thể</a></li><li><a href="https://www.statsmodels.org/stable/generated/statsmodels.stats.proportion.proportion_confint.html" target="_blank" rel="noopener">statsmodels — proportion_confint (Wald, Wilson, Clopper–Pearson…)</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class23-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 23b: Khoảng tin cậy cho dữ liệu không chuẩn</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Một bộ phân loại đúng 170 trên 200 ảnh kiểm thử. Cho khoảng Wald 95% cho độ chính xác.</li><li>Phải khảo sát bao nhiêu người dùng để sai số biên 95% là ±2% khi chưa có dự đoán?</li><li>0 lần crash trong 300 lần chạy thử. Cho nhanh một cận trên 95% cho tỉ lệ crash.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) p̂ = 0,85, SE = √(0,85·0,15/200) = 0,0252; 0,85 ± 0,0495 = (0,800; 0,899). 2) n = 1,96<sup>2</sup>·0,25/0,0004 = 2400,9 ⇒ 2401. 3) Quy tắc ba: 3/300 = 1%.</p></div>`);

const c44 = L('psi221-ts-4-4',
  '4.4 — Intervals for a variance and likelihood-based (Wald) intervals|||4.4 — Khoảng cho phương sai và khoảng dựa trên hợp lý (Wald)',
  'Khoảng χ² cho σ² và σ (không đối xứng, nhạy với lệch chuẩn); khoảng Wald θ̂ ± z·SE từ MLE (Poisson); đối ngẫu khoảng–kiểm định.',
  `<span class="eyebrow">PSI221 · Chapter 4 · Lesson 4.4</span>
<h2>Intervals for a variance and likelihood-based (Wald) intervals</h2>
<p class="lead">Means are not the only thing worth bounding. Engineers care about variability (jitter, tolerance), and many modern models only offer an MLE and its standard error. This lesson covers both.</p>
<h3>🎯 Objectives</h3>
<ul><li>Build the χ<sup>2</sup> interval for σ<sup>2</sup> and σ from normal data.</li><li>Build a Wald interval θ̂ ± z·SE from any MLE.</li><li>Understand the duality between confidence intervals and hypothesis tests.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Variance interval.</strong> For normal data the pivot (n − 1)S<sup>2</sup>/σ<sup>2</sup> ~ χ<sup>2</sup>(n − 1) (Lesson 1.3). Let a and b be its α/2 and 1 − α/2 quantiles. Then a ≤ (n − 1)S<sup>2</sup>/σ<sup>2</sup> ≤ b, and solving for σ<sup>2</sup> flips the inequalities:</p>
<div class="formula"><span class="lbl">CI for σ² and σ (normal data)</span>( (n − 1)s<sup>2</sup>/b ,  (n − 1)s<sup>2</sup>/a )   with  a = χ<sup>2</sup><sub>α/2, n−1</sub>,  b = χ<sup>2</sup><sub>1−α/2, n−1</sub>      for σ: take square roots</div>
<p>The interval is <strong>not symmetric</strong> around s<sup>2</sup>, because the chi-square distribution is skewed. And it is <strong>not robust</strong>: with non-normal data its coverage can be badly wrong, even for large n (the CLT does not rescue it). For non-normal data use the bootstrap (Lesson 10.3).</p>
<div class="callout"><p><b>Example — jitter of the API.</b> For the 8 response times, s<sup>2</sup> = 65.71. With 7 df, a = 1.690 and b = 16.013. CI for σ<sup>2</sup>: (7·65.71/16.013, 7·65.71/1.690) = <b>(28.73, 272.21)</b>; for σ: <b>(5.36, 16.50)</b> ms. A huge range from only 8 values — another reminder that variability needs much more data than means.</p></div>
<p><strong>Wald intervals from an MLE.</strong> Lesson 3.2 showed θ̂ ≈ N(θ, SE<sup>2</sup>) with SE = 1/√(n·I(θ̂)). Hence</p>
<div class="formula"><span class="lbl">Wald interval</span>θ̂ ± z<sub>α/2</sub>·SE(θ̂)       Poisson: x̄ ± z√(x̄/n)    Exponential: λ̂ ± z·λ̂/√n    any model: SE from the inverse Hessian</div>
<div class="callout"><p><b>Example — bug rate.</b> 48 bugs in 12 days: λ̂ = 4, SE = √(4/12) = 0.577, 95% Wald interval <b>(2.87, 5.13)</b> bugs per day.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

x = np.array([112, 98, 105, 120, 101, 97, 110, 113])
n, s2 = len(x), x.var(ddof=1)
lo_q, hi_q = stats.chi2.ppf([0.025, 0.975], df=n - 1)
print(f"S^2 = {s2:.3f}, chi2 quantiles = ({lo_q:.3f}, {hi_q:.3f})")
print(f"95% CI for sigma^2: ({(n - 1) * s2 / hi_q:.2f}, {(n - 1) * s2 / lo_q:.2f})")
print(f"95% CI for sigma  : ({np.sqrt((n - 1) * s2 / hi_q):.2f}, {np.sqrt((n - 1) * s2 / lo_q):.2f})")

bugs = np.array([3, 5, 2, 4, 6, 3, 4, 5, 2, 6, 4, 4])     # Poisson data
lam, se = bugs.mean(), np.sqrt(bugs.mean() / len(bugs))    # Wald SE = sqrt(lam_hat / n)
print(f"Wald 95% CI for lambda: ({lam - 1.96 * se:.3f}, {lam + 1.96 * se:.3f})")</code></pre>
<div class="out">S^2 = 65.714, chi2 quantiles = (1.690, 16.013)
95% CI for sigma^2: (28.73, 272.21)
95% CI for sigma  : (5.36, 16.50)
Wald 95% CI for lambda: (2.868, 5.132)</div>
<p>Wald intervals are symmetric and can misbehave for small samples or near boundaries (a rate cannot be negative). Better large-sample alternatives are to build the interval on the log scale and transform back (Lesson 3.2), or to use the <strong>likelihood-ratio interval</strong>: all θ with 2[ℓ(θ̂) − ℓ(θ)] ≤ 3.84 (the χ<sup>2</sup>(1) 95% quantile). The idea behind it is the duality below.</p>
<h3>Duality: intervals ⇔ tests</h3>
<p>A 95% confidence interval contains exactly those parameter values θ<sub>0</sub> that a two-sided test at level 5% would <em>not</em> reject. So the API interval (100.22, 113.78) tells you immediately that a t-test of μ = 100 rejects at 5% while μ = 105 is not rejected. Chapters 5–6 develop tests; keep this bridge in mind.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Putting the large chi-square quantile in the upper limit: the upper limit for σ<sup>2</sup> uses the <em>smaller</em> quantile a.</li><li>Using the χ<sup>2</sup> variance interval for skewed or heavy-tailed data.</li><li>Reporting a Wald interval with a negative lower limit for a rate or a variance.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>σ<sup>2</sup>: ((n − 1)s<sup>2</sup>/b, (n − 1)s<sup>2</sup>/a); asymmetric and normal-dependent.</li><li>Wald: θ̂ ± z·SE, SE from Fisher information.</li><li>Prefer log-scale or likelihood-ratio intervals near boundaries.</li><li>CI = set of null values not rejected by the corresponding test.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.itl.nist.gov/div898/handbook/prc/section2/prc23.htm" target="_blank" rel="noopener">NIST e-Handbook — Are the data consistent with a nominal standard deviation?</a></li><li><a href="https://online.stat.psu.edu/stat415/Lesson07.html" target="_blank" rel="noopener">Penn State STAT 415 — Lesson 7: Asymptotic confidence intervals</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class23-prep-a_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 23a: Confidence intervals, three views</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>n = 20 normal values with s = 3. Give a 95% CI for σ (χ<sup>2</sup><sub>0.025, 19</sub> = 8.907, χ<sup>2</sup><sub>0.975, 19</sub> = 32.852).</li><li>Exponential: n = 64, λ̂ = 0.5. Give the 95% Wald interval for λ.</li><li>A 95% CI for μ is (3.1, 7.9). Would a two-sided 5% test reject μ = 8?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) σ<sup>2</sup> ∈ (19·9/32.852, 19·9/8.907) = (5.21, 19.20) ⇒ σ ∈ (2.28, 4.38). 2) SE = 0.5/8 = 0.0625; 0.5 ± 0.1225 = (0.378, 0.623). 3) Yes, 8 is outside the interval.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 4 · Bài 4.4</span>
<h2>Khoảng cho phương sai và khoảng dựa trên hợp lý (Wald)</h2>
<p class="lead">Không chỉ trung bình mới đáng chặn khoảng. Kỹ sư quan tâm tới độ dao động (jitter, dung sai), và nhiều mô hình hiện đại chỉ cho ta một MLE kèm sai số chuẩn. Bài này xử lý cả hai.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dựng khoảng χ<sup>2</sup> cho σ<sup>2</sup> và σ từ dữ liệu chuẩn.</li><li>Dựng khoảng Wald θ̂ ± z·SE từ một MLE bất kỳ.</li><li>Hiểu tính đối ngẫu giữa khoảng tin cậy và kiểm định giả thuyết.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Khoảng cho phương sai.</strong> Với dữ liệu chuẩn, đại lượng chốt (n − 1)S<sup>2</sup>/σ<sup>2</sup> ~ χ<sup>2</sup>(n − 1) (Bài 1.3). Gọi a và b là phân vị α/2 và 1 − α/2 của nó. Khi đó a ≤ (n − 1)S<sup>2</sup>/σ<sup>2</sup> ≤ b, và giải theo σ<sup>2</sup> thì bất đẳng thức đảo chiều:</p>
<div class="formula"><span class="lbl">Khoảng tin cậy cho σ² và σ (dữ liệu chuẩn)</span>( (n − 1)s<sup>2</sup>/b ,  (n − 1)s<sup>2</sup>/a )   với  a = χ<sup>2</sup><sub>α/2, n−1</sub>,  b = χ<sup>2</sup><sub>1−α/2, n−1</sub>      cho σ: lấy căn</div>
<p>Khoảng <strong>không đối xứng</strong> quanh s<sup>2</sup> vì phân phối chi bình phương lệch. Và nó <strong>không bền vững</strong>: với dữ liệu không chuẩn, độ phủ có thể sai nghiêm trọng, kể cả n lớn (CLT không cứu được). Dữ liệu không chuẩn thì dùng bootstrap (Bài 10.3).</p>
<div class="callout"><p><b>Ví dụ — độ dao động của API.</b> Với 8 thời gian phản hồi, s<sup>2</sup> = 65,71. Với 7 bậc tự do, a = 1,690 và b = 16,013. Khoảng cho σ<sup>2</sup>: (7·65,71/16,013; 7·65,71/1,690) = <b>(28,73; 272,21)</b>; cho σ: <b>(5,36; 16,50)</b> ms. Một khoảng rất rộng chỉ từ 8 giá trị — thêm một lời nhắc rằng độ dao động cần nhiều dữ liệu hơn trung bình.</p></div>
<p><strong>Khoảng Wald từ MLE.</strong> Bài 3.2 cho thấy θ̂ ≈ N(θ, SE<sup>2</sup>) với SE = 1/√(n·I(θ̂)). Vậy</p>
<div class="formula"><span class="lbl">Khoảng Wald</span>θ̂ ± z<sub>α/2</sub>·SE(θ̂)       Poisson: x̄ ± z√(x̄/n)    Exponential: λ̂ ± z·λ̂/√n    mô hình bất kỳ: SE từ nghịch đảo Hessian</div>
<div class="callout"><p><b>Ví dụ — tốc độ phát sinh lỗi.</b> 48 lỗi trong 12 ngày: λ̂ = 4, SE = √(4/12) = 0,577, khoảng Wald 95% <b>(2,87; 5,13)</b> lỗi mỗi ngày.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

x = np.array([112, 98, 105, 120, 101, 97, 110, 113])
n, s2 = len(x), x.var(ddof=1)
lo_q, hi_q = stats.chi2.ppf([0.025, 0.975], df=n - 1)
print(f"S^2 = {s2:.3f}, chi2 quantiles = ({lo_q:.3f}, {hi_q:.3f})")
print(f"95% CI for sigma^2: ({(n - 1) * s2 / hi_q:.2f}, {(n - 1) * s2 / lo_q:.2f})")
print(f"95% CI for sigma  : ({np.sqrt((n - 1) * s2 / hi_q):.2f}, {np.sqrt((n - 1) * s2 / lo_q):.2f})")

bugs = np.array([3, 5, 2, 4, 6, 3, 4, 5, 2, 6, 4, 4])     # Poisson data
lam, se = bugs.mean(), np.sqrt(bugs.mean() / len(bugs))    # Wald SE = sqrt(lam_hat / n)
print(f"Wald 95% CI for lambda: ({lam - 1.96 * se:.3f}, {lam + 1.96 * se:.3f})")</code></pre>
<div class="out">S^2 = 65.714, chi2 quantiles = (1.690, 16.013)
95% CI for sigma^2: (28.73, 272.21)
95% CI for sigma  : (5.36, 16.50)
Wald 95% CI for lambda: (2.868, 5.132)</div>
<p>Khoảng Wald đối xứng và có thể “chạy sai” khi mẫu nhỏ hoặc gần biên (tốc độ không thể âm). Các lựa chọn mẫu lớn tốt hơn: dựng khoảng trên thang log rồi đổi ngược (Bài 3.2), hoặc dùng <strong>khoảng tỉ số hợp lý</strong>: mọi θ có 2[ℓ(θ̂) − ℓ(θ)] ≤ 3,84 (phân vị 95% của χ<sup>2</sup>(1)). Ý tưởng đằng sau là tính đối ngẫu dưới đây.</p>
<h3>Đối ngẫu: khoảng ⇔ kiểm định</h3>
<p>Khoảng tin cậy 95% chứa đúng những giá trị tham số θ<sub>0</sub> mà kiểm định hai phía mức 5% sẽ <em>không</em> bác bỏ. Vậy khoảng API (100,22; 113,78) cho biết ngay kiểm định t của μ = 100 bác bỏ ở mức 5%, còn μ = 105 không bị bác bỏ. Chương 5–6 phát triển kiểm định; hãy nhớ cây cầu này.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đặt phân vị chi bình phương lớn vào cận trên: cận trên của σ<sup>2</sup> dùng phân vị <em>nhỏ</em> a.</li><li>Dùng khoảng χ<sup>2</sup> cho phương sai với dữ liệu lệch hoặc đuôi nặng.</li><li>Báo cáo khoảng Wald có cận dưới âm cho một tốc độ hay một phương sai.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>σ<sup>2</sup>: ((n − 1)s<sup>2</sup>/b, (n − 1)s<sup>2</sup>/a); không đối xứng và phụ thuộc tính chuẩn.</li><li>Wald: θ̂ ± z·SE, SE từ thông tin Fisher.</li><li>Gần biên nên dùng khoảng trên thang log hoặc khoảng tỉ số hợp lý.</li><li>Khoảng tin cậy = tập các giá trị giả thuyết không bị kiểm định tương ứng bác bỏ.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.itl.nist.gov/div898/handbook/prc/section2/prc23.htm" target="_blank" rel="noopener">NIST e-Handbook — Dữ liệu có phù hợp với một độ lệch chuẩn danh nghĩa?</a></li><li><a href="https://online.stat.psu.edu/stat415/Lesson07.html" target="_blank" rel="noopener">Penn State STAT 415 — Bài 7: Khoảng tin cậy tiệm cận</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class23-prep-a_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 23a: Ba góc nhìn về khoảng tin cậy</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>n = 20 giá trị chuẩn với s = 3. Cho khoảng 95% cho σ (χ<sup>2</sup><sub>0,025; 19</sub> = 8,907, χ<sup>2</sup><sub>0,975; 19</sub> = 32,852).</li><li>Exponential: n = 64, λ̂ = 0,5. Cho khoảng Wald 95% cho λ.</li><li>Khoảng 95% cho μ là (3,1; 7,9). Kiểm định hai phía mức 5% có bác bỏ μ = 8 không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) σ<sup>2</sup> ∈ (19·9/32,852; 19·9/8,907) = (5,21; 19,20) ⇒ σ ∈ (2,28; 4,38). 2) SE = 0,5/8 = 0,0625; 0,5 ± 0,1225 = (0,378; 0,623). 3) Có, 8 nằm ngoài khoảng.</p></div>`);

const q4 = QZ(4, 'Quiz — Chapter 4: Confidence intervals|||Quiz — Chương 4: Khoảng tin cậy', 'Kiểm tra chương 4: diễn giải khoảng tin cậy, khoảng z và t, khoảng cho tỉ lệ, cỡ mẫu, khoảng cho phương sai, khoảng Wald.', [
  Q('q1', 'Which statement about a computed 95% CI (70.4, 74.4) for μ is correct?|||Phát biểu nào đúng về khoảng 95% đã tính (70,4; 74,4) cho μ?',
    ['P(70.4 ≤ μ ≤ 74.4) = 0.95|||P(70,4 ≤ μ ≤ 74,4) = 0,95', '95% of the data lie in it|||95% dữ liệu nằm trong đó', 'The method captures μ in 95% of repeated samples|||Phương pháp bắt trúng μ trong 95% số mẫu lặp lại', 'μ = 72.4 with probability 0.95|||μ = 72,4 với xác suất 0,95'], 2,
    'Confidence refers to the procedure; μ is fixed.|||Độ tin cậy nói về phương pháp; μ cố định.'),
  Q('q2', 'n = 25, x̄ = 40, σ = 5 known. The 95% z-interval is|||n = 25, x̄ = 40, σ = 5 đã biết. Khoảng z 95% là',
    ['(38.04, 41.96)|||(38,04; 41,96)', '(30.2, 49.8)|||(30,2; 49,8)', '(39.0, 41.0)|||(39,0; 41,0)', '(38.36, 41.64)|||(38,36; 41,64)'], 0,
    'SE = 1; 40 ± 1.96.|||SE = 1; 40 ± 1,96.'),
  Q('q3', 'Increasing the confidence level from 95% to 99% (same data)…|||Tăng độ tin cậy từ 95% lên 99% (cùng dữ liệu)…',
    ['narrows the interval|||làm khoảng hẹp lại', 'widens the interval|||làm khoảng rộng ra', 'does not change it|||không đổi', 'shifts its centre|||dịch tâm khoảng'], 1,
    'z grows from 1.96 to 2.576.|||z tăng từ 1,96 lên 2,576.'),
  Q('q4', 'When σ is unknown and n = 10 (normal data), the interval uses|||Khi chưa biết σ và n = 10 (dữ liệu chuẩn), khoảng dùng',
    ['z with σ̂|||z với σ̂', 't with 10 df|||t với 10 bậc tự do', 't with 9 df|||t với 9 bậc tự do', 'χ² with 9 df|||χ² với 9 bậc tự do'], 2,
    '(X̄ − μ)/(S/√n) ~ t(n − 1).|||(X̄ − μ)/(S/√n) ~ t(n − 1).'),
  Q('q5', 'To halve the margin of error of a mean you need|||Muốn sai số biên của trung bình giảm một nửa cần',
    ['twice the data|||gấp đôi dữ liệu', 'four times the data|||gấp bốn dữ liệu', 'half the data|||nửa dữ liệu', 'a lower confidence level only|||chỉ cần giảm độ tin cậy'], 1,
    'E ∝ 1/√n.|||E ∝ 1/√n.'),
  Q('q6', 'With no prior guess, the sample size for a 95% margin of ±5% on a proportion is about|||Không có dự đoán trước, cỡ mẫu cho sai số ±5% mức 95% của một tỉ lệ khoảng',
    ['100|||100', '385|||385', '1068|||1068', '2401|||2401'], 1,
    '1.96²·0.25/0.05² = 384.1 ⇒ 385.|||1,96²·0,25/0,05² = 384,1 ⇒ 385.'),
  Q('q7', 'For 1 failure in 20 runs, which interval is recommended?|||Với 1 lỗi trong 20 lần chạy, nên dùng khoảng nào?',
    ['Wald|||Wald', 'Wilson|||Wilson', 'z-interval for a mean|||khoảng z cho trung bình', 'χ² interval|||khoảng χ²'], 1,
    'Wald fails for small counts; Wilson keeps good coverage.|||Wald hỏng khi số đếm nhỏ; Wilson giữ độ phủ tốt.'),
  Q('q8', 'The χ² confidence interval for σ² is|||Khoảng tin cậy χ² cho σ²',
    ['symmetric around s²|||đối xứng quanh s²', 'asymmetric and sensitive to non-normality|||không đối xứng và nhạy với dữ liệu không chuẩn', 'robust by the CLT|||bền vững nhờ CLT', 'only valid for large n|||chỉ đúng khi n lớn'], 1,
    'Chi-square is skewed, and the result relies on normal data.|||Chi bình phương lệch, và kết quả dựa vào dữ liệu chuẩn.'),
  Q('q9', 'Poisson: 90 events in 10 days. The 95% Wald interval for λ is about|||Poisson: 90 sự kiện trong 10 ngày. Khoảng Wald 95% cho λ khoảng',
    ['(8.14, 9.86)|||(8,14; 9,86)', '(7.14, 10.86)|||(7,14; 10,86)', '(3, 15)|||(3; 15)', '(8.9, 9.1)|||(8,9; 9,1)'], 1,
    'λ̂ = 9, SE = √(9/10) = 0.949, 9 ± 1.86.|||λ̂ = 9, SE = √(9/10) = 0,949, 9 ± 1,86.'),
  Q('q10', 'A 95% CI for μ is (12, 18). A two-sided test at 5% would|||Khoảng 95% cho μ là (12, 18). Kiểm định hai phía mức 5% sẽ',
    ['reject μ = 15|||bác bỏ μ = 15', 'reject μ = 20|||bác bỏ μ = 20', 'reject μ = 13|||bác bỏ μ = 13', 'never reject anything|||không bao giờ bác bỏ gì'], 1,
    'Duality: values outside the interval are rejected.|||Đối ngẫu: giá trị ngoài khoảng bị bác bỏ.'),
]);

const ch4 = {
  title: 'Chapter 4 — Confidence intervals|||Chương 4 — Khoảng tin cậy',
  description: 'Đại lượng chốt, khoảng z và t cho trung bình, khoảng Wald/Wilson/Clopper–Pearson cho tỉ lệ, cỡ mẫu, khoảng χ² cho phương sai, khoảng Wald từ MLE, đối ngẫu khoảng–kiểm định (Wasserman 6.3, 9.7 · Casella–Berger Ch. 9 · OpenIntro Ch. 5–7 · OpenStax Ch. 8).',
  lessons: [c41, c42, c43, c44, q4],
};


// ───────────────────────────── Chương 5 — Kiểm định giả thuyết ─────────────────────────────
const c51 = L('psi221-ts-5-1',
  '5.1 — The logic of hypothesis testing: H₀, H₁, rejection regions and errors|||5.1 — Logic kiểm định giả thuyết: H₀, H₁, miền bác bỏ và các loại sai lầm',
  'Giả thuyết không và đối, thống kê kiểm định, miền bác bỏ, mức ý nghĩa α, sai lầm loại I/II, β và lực; ví dụ thời gian tải trang với số liệu cụ thể.',
  `<span class="eyebrow">PSI221 · Chapter 5 · Lesson 5.1</span>
<h2>The logic of hypothesis testing: H<sub>0</sub>, H<sub>1</sub>, rejection regions and errors</h2>
<p class="lead">A hypothesis test is a rule for deciding, from noisy data, whether a claim is believable. Like a court, it starts by presuming the boring explanation — “nothing changed” — and asks whether the evidence is strong enough to reject it.</p>
<h3>🎯 Objectives</h3>
<ul><li>Formulate a null hypothesis H<sub>0</sub> and an alternative H<sub>1</sub> (one- or two-sided).</li><li>Build a test statistic and a rejection region at significance level α.</li><li>Compute the probabilities of Type I and Type II errors and the power.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Hypotheses.</strong> H<sub>0</sub> (null) is the default, usually “no effect / no difference / the claim of the status quo”, e.g. μ = 2.0 s. H<sub>1</sub> (alternative) is what we would like evidence for: μ &gt; 2.0 (one-sided, right), μ &lt; 2.0 (one-sided, left) or μ ≠ 2.0 (two-sided). The direction must be chosen <em>before</em> looking at the data.</p>
<p><strong>Test statistic and rejection region.</strong> A statistic measures how far the data are from H<sub>0</sub>, e.g. Z = (X̄ − μ<sub>0</sub>)/(σ/√n). The <strong>rejection region</strong> R is the set of values for which we reject H<sub>0</sub>; it is chosen so that P(reject | H<sub>0</sub> true) = α, the <strong>significance level</strong> (commonly 0.05).</p>
<div class="formula"><span class="lbl">Two kinds of error</span>
<table><tr><th></th><th>H<sub>0</sub> true</th><th>H<sub>1</sub> true</th></tr>
<tr><td>Reject H<sub>0</sub></td><td>Type I error (prob. α)</td><td>correct (power 1 − β)</td></tr>
<tr><td>Do not reject H<sub>0</sub></td><td>correct (prob. 1 − α)</td><td>Type II error (prob. β)</td></tr></table></div>
<p>Court analogy: H<sub>0</sub> = “innocent”. A Type I error convicts an innocent person; a Type II error frees a guilty one. We fix α small because a Type I error is considered worse, and then try to make β small by collecting enough data. “Not rejecting H<sub>0</sub>” is like “not guilty” — it is <em>not</em> a proof of innocence.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — did the page get slower?</b> Historically a page loads in μ = 2.0 s with σ = 0.5 s. After a release, you measure n = 25 loads. Test H<sub>0</sub>: μ = 2.0 vs H<sub>1</sub>: μ &gt; 2.0 at α = 0.05.</p>
<p>Step 1: statistic Z = (X̄ − 2.0)/(0.5/√25) = (X̄ − 2.0)/0.1, N(0, 1) under H<sub>0</sub>. Step 2: reject when Z &gt; z<sub>0.05</sub> = 1.645, i.e. when <b>x̄ &gt; 2.0 + 1.645·0.1 = 2.1645 s</b>. Step 3: Type I error = 0.05 by construction.</p>
<p>Step 4 — Type II error if the truth is μ = 2.2: β = P(X̄ ≤ 2.1645 | μ = 2.2) = Φ((2.1645 − 2.2)/0.1) = Φ(−0.355) = <b>0.361</b>, so the power is <b>0.639</b>. If the truth is μ = 2.3, β = Φ(−1.355) = 0.088 and power = 0.912. Bigger effects are easier to detect.</p></div>
<p><strong>The general recipe</strong> (use it in every exam answer): (1) state H<sub>0</sub>, H<sub>1</sub> and α; (2) choose the statistic and its distribution under H<sub>0</sub>; (3) compute the observed statistic; (4) compare with the critical value or compute the p-value (next lesson); (5) state the decision <em>and</em> a conclusion in the language of the problem.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing hypotheses about the statistic (x̄ = 2.0) instead of the parameter (μ = 2.0).</li><li>Choosing a one-sided H<sub>1</sub> after seeing which way the data point — this doubles the real Type I error.</li><li>“Accepting H<sub>0</sub>”: a non-significant result may simply mean the test had low power.</li><li>Thinking α is the probability that H<sub>0</sub> is true. α is P(reject | H<sub>0</sub> true).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>H<sub>0</sub> = default claim; H<sub>1</sub> = what needs evidence; direction fixed in advance.</li><li>Rejection region chosen so P(Type I error) = α.</li><li>β = P(Type II error) depends on the true parameter; power = 1 − β.</li><li>Not rejecting H<sub>0</sub> ≠ proving H<sub>0</sub>.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/9-1-null-and-alternative-hypotheses" target="_blank" rel="noopener">OpenStax — 9.1 Null and alternative hypotheses</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/9-2-outcomes-and-the-type-i-and-type-ii-errors" target="_blank" rel="noopener">OpenStax — 9.2 Outcomes and the Type I and Type II errors</a></li><li><a href="https://www.youtube.com/watch?v=0oc49DyA3hU" target="_blank" rel="noopener">StatQuest — Hypothesis testing and the null hypothesis</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class17-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 17b: Null hypothesis significance testing I</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write H<sub>0</sub> and H<sub>1</sub>: “the new cache reduces mean latency below 80 ms”.</li><li>In the page example with α = 0.01 (z = 2.326), what is the new critical value of x̄?</li><li>A test is run with α = 0.05 on 100 versions that really have no effect. About how many will be (wrongly) significant?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) H<sub>0</sub>: μ = 80 (or μ ≥ 80) vs H<sub>1</sub>: μ &lt; 80. 2) 2.0 + 2.326·0.1 = 2.2326 s — stricter α ⇒ larger critical value ⇒ less power. 3) About 5 — this is the multiple-testing problem of Lesson 7.3.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 5 · Bài 5.1</span>
<h2>Logic kiểm định giả thuyết: H<sub>0</sub>, H<sub>1</sub>, miền bác bỏ và các loại sai lầm</h2>
<p class="lead">Kiểm định giả thuyết là một quy tắc để quyết định, từ dữ liệu có nhiễu, xem một khẳng định có đáng tin không. Giống phiên toà, nó bắt đầu bằng cách mặc định lời giải thích nhàm chán nhất — “không có gì thay đổi” — rồi hỏi bằng chứng có đủ mạnh để bác bỏ không.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu giả thuyết không H<sub>0</sub> và giả thuyết đối H<sub>1</sub> (một hoặc hai phía).</li><li>Dựng thống kê kiểm định và miền bác bỏ ở mức ý nghĩa α.</li><li>Tính xác suất sai lầm loại I, loại II và lực kiểm định.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Giả thuyết.</strong> H<sub>0</sub> (giả thuyết không) là mặc định, thường là “không có hiệu ứng / không khác biệt / hiện trạng”, vd μ = 2,0 s. H<sub>1</sub> (giả thuyết đối) là điều ta muốn tìm bằng chứng: μ &gt; 2,0 (một phía phải), μ &lt; 2,0 (một phía trái) hoặc μ ≠ 2,0 (hai phía). Chiều phải được chọn <em>trước</em> khi nhìn dữ liệu.</p>
<p><strong>Thống kê kiểm định và miền bác bỏ.</strong> Thống kê đo dữ liệu cách H<sub>0</sub> bao xa, vd Z = (X̄ − μ<sub>0</sub>)/(σ/√n). <strong>Miền bác bỏ</strong> R là tập các giá trị mà ở đó ta bác bỏ H<sub>0</sub>; nó được chọn sao cho P(bác bỏ | H<sub>0</sub> đúng) = α, gọi là <strong>mức ý nghĩa</strong> (thường 0,05).</p>
<div class="formula"><span class="lbl">Hai loại sai lầm</span>
<table><tr><th></th><th>H<sub>0</sub> đúng</th><th>H<sub>1</sub> đúng</th></tr>
<tr><td>Bác bỏ H<sub>0</sub></td><td>Sai lầm loại I (xác suất α)</td><td>đúng (lực 1 − β)</td></tr>
<tr><td>Không bác bỏ H<sub>0</sub></td><td>đúng (xác suất 1 − α)</td><td>Sai lầm loại II (xác suất β)</td></tr></table></div>
<p>So sánh với toà án: H<sub>0</sub> = “vô tội”. Sai lầm loại I là kết án người vô tội; sai lầm loại II là thả người có tội. Ta cố định α nhỏ vì sai lầm loại I bị coi là nặng hơn, rồi cố làm β nhỏ bằng cách thu đủ dữ liệu. “Không bác bỏ H<sub>0</sub>” giống “không đủ căn cứ kết tội” — <em>không</em> phải bằng chứng vô tội.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — trang có chậm đi không?</b> Trước đây trang tải trong μ = 2,0 s với σ = 0,5 s. Sau một bản phát hành, bạn đo n = 25 lần tải. Kiểm định H<sub>0</sub>: μ = 2,0 với H<sub>1</sub>: μ &gt; 2,0 ở α = 0,05.</p>
<p>Bước 1: thống kê Z = (X̄ − 2,0)/(0,5/√25) = (X̄ − 2,0)/0,1, có phân phối N(0, 1) khi H<sub>0</sub> đúng. Bước 2: bác bỏ khi Z &gt; z<sub>0,05</sub> = 1,645, tức khi <b>x̄ &gt; 2,0 + 1,645·0,1 = 2,1645 s</b>. Bước 3: sai lầm loại I = 0,05 theo cách dựng.</p>
<p>Bước 4 — sai lầm loại II nếu thật ra μ = 2,2: β = P(X̄ ≤ 2,1645 | μ = 2,2) = Φ((2,1645 − 2,2)/0,1) = Φ(−0,355) = <b>0,361</b>, nên lực là <b>0,639</b>. Nếu thật ra μ = 2,3 thì β = Φ(−1,355) = 0,088 và lực = 0,912. Hiệu ứng càng lớn càng dễ phát hiện.</p></div>
<p><strong>Công thức chung</strong> (dùng trong mọi câu trả lời thi): (1) nêu H<sub>0</sub>, H<sub>1</sub> và α; (2) chọn thống kê và phân phối của nó khi H<sub>0</sub> đúng; (3) tính thống kê quan sát; (4) so với giá trị tới hạn hoặc tính p-value (bài sau); (5) nêu quyết định <em>và</em> kết luận bằng ngôn ngữ của bài toán.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết giả thuyết về thống kê (x̄ = 2,0) thay vì về tham số (μ = 2,0).</li><li>Chọn H<sub>1</sub> một phía sau khi thấy dữ liệu nghiêng về phía nào — làm sai lầm loại I thật tăng gấp đôi.</li><li>“Chấp nhận H<sub>0</sub>”: kết quả không có ý nghĩa có thể chỉ do kiểm định có lực thấp.</li><li>Tưởng α là xác suất H<sub>0</sub> đúng. α là P(bác bỏ | H<sub>0</sub> đúng).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>H<sub>0</sub> = khẳng định mặc định; H<sub>1</sub> = điều cần bằng chứng; chiều cố định từ trước.</li><li>Miền bác bỏ chọn sao cho P(sai lầm loại I) = α.</li><li>β = P(sai lầm loại II) phụ thuộc tham số thật; lực = 1 − β.</li><li>Không bác bỏ H<sub>0</sub> ≠ chứng minh H<sub>0</sub>.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/9-1-null-and-alternative-hypotheses" target="_blank" rel="noopener">OpenStax — 9.1 Giả thuyết không và giả thuyết đối</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/9-2-outcomes-and-the-type-i-and-type-ii-errors" target="_blank" rel="noopener">OpenStax — 9.2 Kết cục và sai lầm loại I, loại II</a></li><li><a href="https://www.youtube.com/watch?v=0oc49DyA3hU" target="_blank" rel="noopener">StatQuest — Kiểm định giả thuyết và giả thuyết không</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class17-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 17b: Kiểm định ý nghĩa giả thuyết không I</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết H<sub>0</sub> và H<sub>1</sub>: “cache mới làm độ trễ trung bình xuống dưới 80 ms”.</li><li>Trong ví dụ tải trang với α = 0,01 (z = 2,326), giá trị tới hạn mới của x̄ là bao nhiêu?</li><li>Chạy kiểm định α = 0,05 trên 100 phiên bản thật ra không có hiệu ứng. Khoảng bao nhiêu phiên bản sẽ (sai) có ý nghĩa?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) H<sub>0</sub>: μ = 80 (hoặc μ ≥ 80) với H<sub>1</sub>: μ &lt; 80. 2) 2,0 + 2,326·0,1 = 2,2326 s — α chặt hơn ⇒ giá trị tới hạn lớn hơn ⇒ lực thấp hơn. 3) Khoảng 5 — đó là bài toán kiểm định bội ở Bài 7.3.</p></div>`);

const c52 = L('psi221-ts-5-2',
  '5.2 — p-values: what they are and what they are not|||5.2 — p-value: nó là gì và không là gì',
  'Định nghĩa p-value, một phía và hai phía, quy tắc p ≤ α; mô phỏng p-value phân phối đều khi H₀ đúng; 6 nguyên tắc ASA 2016; ý nghĩa thống kê khác ý nghĩa thực tế.',
  `<span class="eyebrow">PSI221 · Chapter 5 · Lesson 5.2</span>
<h2>p-values: what they are and what they are not</h2>
<p class="lead">The p-value is the most reported — and most misunderstood — number in science. Learn its exact definition once, and you will avoid the classic misinterpretations for the rest of your career.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define the p-value and compute it for one- and two-sided z tests.</li><li>Use the rule “reject H<sub>0</sub> if p ≤ α” and explain why it matches the rejection-region approach.</li><li>List what a p-value does <em>not</em> mean, following the 2016 ASA statement.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Definition</span>p-value = P( a test statistic at least as extreme as the one observed | H<sub>0</sub> true )<br>right-sided: P(Z ≥ z<sub>obs</sub>)    left-sided: P(Z ≤ z<sub>obs</sub>)    two-sided: 2·P(Z ≥ |z<sub>obs</sub>|)</div>
<p>A small p-value means the data would be surprising if H<sub>0</sub> were true. If p ≤ α we reject H<sub>0</sub>; this is the same decision as “the statistic falls in the rejection region”, because the critical value is exactly the point where p = α. The p-value is more informative than a yes/no decision: p = 0.049 and p = 0.0001 both reject at 5%, but they are very different levels of evidence.</p>
<div class="callout"><p><b>Example — page load, continued.</b> With n = 25 loads you observe x̄ = 2.18 s (σ = 0.5, H<sub>0</sub>: μ = 2.0).</p>
<p>Step 1: z = (2.18 − 2.0)/0.1 = 1.8. Step 2 (H<sub>1</sub>: μ &gt; 2.0): p = P(Z ≥ 1.8) = <b>0.0359</b> ≤ 0.05 ⇒ reject; the page is significantly slower. Step 3 (if H<sub>1</sub> had been μ ≠ 2.0): p = 2·0.0359 = <b>0.0719</b> &gt; 0.05 ⇒ do not reject. The same data, a different conclusion — which is why the alternative must be fixed before seeing the data.</p></div>
<p><strong>p-values under H<sub>0</sub> are uniform.</strong> If H<sub>0</sub> is true (and the statistic is continuous), the p-value is a Uniform(0, 1) random variable — so P(p ≤ 0.05) = 0.05 exactly, which is just the Type I error rate. Under H<sub>1</sub> p-values pile up near 0, and the share below α is the power:</p>
<pre><code class="language-python">import numpy as np
from scipy import stats

rng = np.random.default_rng(11)
reps, n = 10000, 20
# H0 is TRUE here: data really come from N(0, 1) and we test mu = 0
p_null = np.array([stats.ttest_1samp(rng.normal(0, 1, n), 0).pvalue for _ in range(reps)])
print("H0 true : share of p &lt; 0.05 =", np.mean(p_null &lt; 0.05))     # about alpha
print("H0 true : share of p &lt; 0.50 =", np.mean(p_null &lt; 0.50))     # p ~ Uniform(0,1)
# H1 is TRUE here: the real mean is 0.5
p_alt = np.array([stats.ttest_1samp(rng.normal(0.5, 1, n), 0).pvalue for _ in range(reps)])
print("H1 true : share of p &lt; 0.05 =", np.mean(p_alt &lt; 0.05))      # this is the power</code></pre>
<div class="out">H0 true : share of p &lt; 0.05 = 0.0477
H0 true : share of p &lt; 0.50 = 0.4953
H1 true : share of p &lt; 0.05 = 0.5681</div>
<h3>What a p-value is NOT (ASA statement, 2016)</h3>
<p>The American Statistical Association published six principles on p-values. In short:</p>
<ol>
<li>A p-value measures how incompatible the data are with a specified statistical model (H<sub>0</sub> plus its assumptions).</li>
<li>It is <strong>not</strong> the probability that H<sub>0</sub> is true, nor the probability that the data arose by chance alone.</li>
<li>Scientific or business decisions should not rest only on whether p passes a threshold such as 0.05.</li>
<li>Proper inference needs full reporting: all tests run, not only the significant ones (see p-hacking, Lesson 7.3).</li>
<li>A p-value does not measure the size or importance of an effect.</li>
<li>By itself, a p-value is not a good measure of evidence; report estimates and confidence intervals too.</li>
</ol>
<p><strong>Statistical vs practical significance.</strong> With 10 million users, a 0.01-percentage-point change in conversion can have p &lt; 0.001 and still be worthless. With 12 users, a huge improvement can have p = 0.2. Always report the <em>effect size</em> with a confidence interval next to the p-value.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>“p = 0.03 means a 3% chance that H<sub>0</sub> is true.” Wrong — see principle 2.</li><li>“p = 0.2 shows there is no effect.” Wrong — absence of evidence is not evidence of absence.</li><li>Halving a two-sided p-value after seeing the direction of the effect.</li><li>Reporting “p = 0.000”; write p &lt; 0.001.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>p = probability, under H<sub>0</sub>, of data at least as extreme as observed.</li><li>Reject if p ≤ α; two-sided p = 2 × one tail.</li><li>Under H<sub>0</sub>, p ~ Uniform(0, 1); under H<sub>1</sub>, P(p ≤ α) = power.</li><li>Report effect sizes and CIs; p is not P(H<sub>0</sub> | data).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.amstat.org/asa/files/pdfs/p-valuestatement.pdf" target="_blank" rel="noopener">ASA — Statement on statistical significance and p-values (2016, PDF)</a></li><li><a href="https://www.youtube.com/watch?v=vemZtEM63GY" target="_blank" rel="noopener">StatQuest — p-values: what they are and how to interpret them</a></li><li><a href="https://www.youtube.com/watch?v=JQc3yx0-Q9E" target="_blank" rel="noopener">StatQuest — How to calculate p-values</a></li><li><a href="https://www.itl.nist.gov/div898/handbook/prc/section1/prc131.htm" target="_blank" rel="noopener">NIST e-Handbook — Critical values and p values</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>z<sub>obs</sub> = −2.1 for H<sub>1</sub>: μ &lt; μ<sub>0</sub>. Find p. And for H<sub>1</sub>: μ ≠ μ<sub>0</sub>?</li><li>A test gives p = 0.07 at α = 0.05. Write a correct one-sentence conclusion.</li><li>If H<sub>0</sub> is true and you run the test 1 000 times, how many p-values below 0.10 do you expect?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) p = Φ(−2.1) = 0.0179; two-sided 0.0357. 2) “At the 5% level the data do not provide sufficient evidence that μ differs from μ<sub>0</sub>” — not “μ equals μ<sub>0</sub>”. 3) About 100.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 5 · Bài 5.2</span>
<h2>p-value: nó là gì và không là gì</h2>
<p class="lead">p-value là con số được báo cáo nhiều nhất — và bị hiểu sai nhiều nhất — trong khoa học. Học chính xác định nghĩa một lần, bạn sẽ tránh được các cách hiểu sai kinh điển trong suốt sự nghiệp.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa p-value và tính nó cho kiểm định z một phía và hai phía.</li><li>Dùng quy tắc “bác bỏ H<sub>0</sub> nếu p ≤ α” và giải thích vì sao nó trùng với cách dùng miền bác bỏ.</li><li>Liệt kê những gì p-value <em>không</em> có nghĩa, theo tuyên bố ASA 2016.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Định nghĩa</span>p-value = P( thống kê kiểm định ít nhất cực đoan như giá trị quan sát | H<sub>0</sub> đúng )<br>phía phải: P(Z ≥ z<sub>qs</sub>)    phía trái: P(Z ≤ z<sub>qs</sub>)    hai phía: 2·P(Z ≥ |z<sub>qs</sub>|)</div>
<p>p-value nhỏ nghĩa là dữ liệu sẽ đáng ngạc nhiên nếu H<sub>0</sub> đúng. Nếu p ≤ α ta bác bỏ H<sub>0</sub>; đây cùng quyết định với “thống kê rơi vào miền bác bỏ”, vì giá trị tới hạn chính là điểm mà p = α. p-value nhiều thông tin hơn quyết định có/không: p = 0,049 và p = 0,0001 đều bác bỏ ở mức 5%, nhưng mức độ bằng chứng rất khác nhau.</p>
<div class="callout"><p><b>Ví dụ — tải trang, tiếp theo.</b> Với n = 25 lần tải bạn quan sát x̄ = 2,18 s (σ = 0,5, H<sub>0</sub>: μ = 2,0).</p>
<p>Bước 1: z = (2,18 − 2,0)/0,1 = 1,8. Bước 2 (H<sub>1</sub>: μ &gt; 2,0): p = P(Z ≥ 1,8) = <b>0,0359</b> ≤ 0,05 ⇒ bác bỏ; trang chậm đi có ý nghĩa thống kê. Bước 3 (nếu H<sub>1</sub> là μ ≠ 2,0): p = 2·0,0359 = <b>0,0719</b> &gt; 0,05 ⇒ không bác bỏ. Cùng dữ liệu, khác kết luận — vì thế giả thuyết đối phải cố định trước khi xem dữ liệu.</p></div>
<p><strong>Khi H<sub>0</sub> đúng, p-value phân phối đều.</strong> Nếu H<sub>0</sub> đúng (và thống kê liên tục), p-value là biến ngẫu nhiên Uniform(0, 1) — nên P(p ≤ 0,05) = 0,05 đúng bằng tỉ lệ sai lầm loại I. Khi H<sub>1</sub> đúng, p-value dồn về gần 0, và tỉ lệ dưới α chính là lực:</p>
<pre><code class="language-python">import numpy as np
from scipy import stats

rng = np.random.default_rng(11)
reps, n = 10000, 20
# H0 is TRUE here: data really come from N(0, 1) and we test mu = 0
p_null = np.array([stats.ttest_1samp(rng.normal(0, 1, n), 0).pvalue for _ in range(reps)])
print("H0 true : share of p &lt; 0.05 =", np.mean(p_null &lt; 0.05))     # about alpha
print("H0 true : share of p &lt; 0.50 =", np.mean(p_null &lt; 0.50))     # p ~ Uniform(0,1)
# H1 is TRUE here: the real mean is 0.5
p_alt = np.array([stats.ttest_1samp(rng.normal(0.5, 1, n), 0).pvalue for _ in range(reps)])
print("H1 true : share of p &lt; 0.05 =", np.mean(p_alt &lt; 0.05))      # this is the power</code></pre>
<div class="out">H0 true : share of p &lt; 0.05 = 0.0477
H0 true : share of p &lt; 0.50 = 0.4953
H1 true : share of p &lt; 0.05 = 0.5681</div>
<h3>p-value KHÔNG phải là gì (tuyên bố ASA, 2016)</h3>
<p>Hiệp hội Thống kê Hoa Kỳ (ASA) công bố sáu nguyên tắc về p-value. Tóm tắt:</p>
<ol>
<li>p-value đo mức độ dữ liệu không tương thích với một mô hình thống kê cụ thể (H<sub>0</sub> cùng các giả định của nó).</li>
<li>Nó <strong>không</strong> phải xác suất H<sub>0</sub> đúng, cũng không phải xác suất dữ liệu chỉ do ngẫu nhiên tạo ra.</li>
<li>Quyết định khoa học hay kinh doanh không nên chỉ dựa vào việc p có vượt một ngưỡng như 0,05 hay không.</li>
<li>Suy luận đúng cần báo cáo đầy đủ: mọi kiểm định đã chạy, không chỉ các kiểm định có ý nghĩa (xem p-hacking, Bài 7.3).</li>
<li>p-value không đo độ lớn hay tầm quan trọng của hiệu ứng.</li>
<li>Tự thân p-value không phải thước đo bằng chứng tốt; hãy báo cáo cả ước lượng và khoảng tin cậy.</li>
</ol>
<p><strong>Ý nghĩa thống kê khác ý nghĩa thực tế.</strong> Với 10 triệu người dùng, thay đổi chuyển đổi 0,01 điểm phần trăm có thể có p &lt; 0,001 mà vẫn vô giá trị. Với 12 người dùng, một cải thiện rất lớn có thể có p = 0,2. Luôn báo cáo <em>độ lớn hiệu ứng</em> kèm khoảng tin cậy bên cạnh p-value.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>“p = 0,03 nghĩa là 3% khả năng H<sub>0</sub> đúng.” Sai — xem nguyên tắc 2.</li><li>“p = 0,2 chứng tỏ không có hiệu ứng.” Sai — thiếu bằng chứng không phải là bằng chứng của sự vắng mặt.</li><li>Chia đôi p-value hai phía sau khi thấy chiều của hiệu ứng.</li><li>Báo cáo “p = 0,000”; hãy viết p &lt; 0,001.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>p = xác suất, khi H<sub>0</sub> đúng, có dữ liệu ít nhất cực đoan như đã quan sát.</li><li>Bác bỏ nếu p ≤ α; p hai phía = 2 × một đuôi.</li><li>Khi H<sub>0</sub> đúng, p ~ Uniform(0, 1); khi H<sub>1</sub> đúng, P(p ≤ α) = lực.</li><li>Báo cáo độ lớn hiệu ứng và khoảng tin cậy; p không phải P(H<sub>0</sub> | dữ liệu).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.amstat.org/asa/files/pdfs/p-valuestatement.pdf" target="_blank" rel="noopener">ASA — Tuyên bố về ý nghĩa thống kê và p-value (2016, PDF)</a></li><li><a href="https://www.youtube.com/watch?v=vemZtEM63GY" target="_blank" rel="noopener">StatQuest — p-value là gì và diễn giải thế nào</a></li><li><a href="https://www.youtube.com/watch?v=JQc3yx0-Q9E" target="_blank" rel="noopener">StatQuest — Cách tính p-value</a></li><li><a href="https://www.itl.nist.gov/div898/handbook/prc/section1/prc131.htm" target="_blank" rel="noopener">NIST e-Handbook — Giá trị tới hạn và p-value</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>z<sub>qs</sub> = −2,1 với H<sub>1</sub>: μ &lt; μ<sub>0</sub>. Tìm p. Còn với H<sub>1</sub>: μ ≠ μ<sub>0</sub>?</li><li>Một kiểm định cho p = 0,07 ở α = 0,05. Viết một câu kết luận đúng.</li><li>Nếu H<sub>0</sub> đúng và bạn chạy kiểm định 1 000 lần, kỳ vọng bao nhiêu p-value dưới 0,10?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) p = Φ(−2,1) = 0,0179; hai phía 0,0357. 2) “Ở mức 5%, dữ liệu không cung cấp đủ bằng chứng rằng μ khác μ<sub>0</sub>” — không phải “μ bằng μ<sub>0</sub>”. 3) Khoảng 100.</p></div>`);

const c53 = L('psi221-ts-5-3',
  '5.3 — Power and sample size|||5.3 — Lực kiểm định và cỡ mẫu',
  'Hàm lực, bốn yếu tố quyết định lực (α, n, σ, hiệu ứng), công thức n = ((z_α + z_β)σ/δ)², tính bằng statsmodels TTestPower; vì sao nghiên cứu lực thấp nguy hiểm.',
  `<span class="eyebrow">PSI221 · Chapter 5 · Lesson 5.3</span>
<h2>Power and sample size</h2>
<p class="lead">Running an experiment that cannot detect the effect you care about wastes time and money — and its “no significant difference” result is meaningless. Power analysis decides the sample size <em>before</em> the experiment starts.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define the power function and compute power for a z-test.</li><li>Name the four levers of power: α, n, σ and the effect size δ.</li><li>Compute the required sample size by formula and with statsmodels.</li></ul>
<h3>📖 Lecture</h3>
<p>The <strong>power</strong> of a test at a parameter value θ is π(θ) = P<sub>θ</sub>(reject H<sub>0</sub>). At θ in H<sub>0</sub> it equals α; for θ in H<sub>1</sub> it equals 1 − β(θ). For the right-sided z-test of H<sub>0</sub>: μ = μ<sub>0</sub> with a true mean μ<sub>0</sub> + δ:</p>
<div class="formula"><span class="lbl">Power of the one-sided z-test</span>power(δ) = P( Z &gt; z<sub>α</sub> − δ/(σ/√n) ) = 1 − Φ( z<sub>α</sub> − δ√n/σ )<br>Required n for power 1 − β:   n = ( (z<sub>α</sub> + z<sub>β</sub>)·σ/δ )<sup>2</sup>   (two-sided: replace z<sub>α</sub> by z<sub>α/2</sub>)</div>
<p>Power increases when <strong>n</strong> increases, when the <strong>effect δ</strong> is larger, when the <strong>noise σ</strong> is smaller, and when <strong>α</strong> is larger (a less strict test). The ratio d = δ/σ is the standardised effect size (Cohen's d); conventional labels are 0.2 small, 0.5 medium, 0.8 large. The usual target power is 0.80 (β = 0.20).</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — how many page loads?</b> σ = 0.5 s. We want to detect a slowdown of δ = 0.2 s with a one-sided test at α = 0.05 and power 0.80.</p>
<p>Step 1: z<sub>0.05</sub> = 1.645, z<sub>0.20</sub> = 0.842. Step 2: n = ((1.645 + 0.842)·0.5/0.2)<sup>2</sup> = (6.216)<sup>2</sup> = 38.64 ⇒ <b>n = 39</b>. Step 3: with the n = 25 of Lesson 5.1 the power was only 0.639 — a one-in-three chance of missing a real 0.2 s slowdown. Step 4: if σ is unknown and a t-test will be used, statsmodels gives 40.03 ⇒ 41 (slightly more, because t has heavier tails). A two-sided test would need about 50.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats
from statsmodels.stats.power import TTestPower

sigma, delta, alpha = 0.5, 0.2, 0.05
za, zb = stats.norm.ppf(1 - alpha), stats.norm.ppf(0.80)
n_z = ((za + zb) * sigma / delta)**2
print(f"z-test, one-sided, power 0.80: n = {n_z:.2f} -&gt; {int(np.ceil(n_z))}")
for n in [10, 25, 39, 60]:
    power = stats.norm.sf(za - delta / (sigma / np.sqrt(n)))
    print(f"  n={n:2d}: power = {power:.3f}")
n_t = TTestPower().solve_power(effect_size=delta / sigma, alpha=alpha, power=0.80, alternative="larger")
print(f"t-test (sigma unknown): n = {n_t:.2f} -&gt; {int(np.ceil(n_t))}")</code></pre>
<div class="out">z-test, one-sided, power 0.80: n = 38.64 -&gt; 39
  n=10: power = 0.352
  n=25: power = 0.639
  n=39: power = 0.803
  n=60: power = 0.927
t-test (sigma unknown): n = 40.03 -&gt; 41</div>
<h3>Why low power is dangerous</h3>
<ul>
<li><strong>Missed effects.</strong> A power of 0.35 (n = 10 above) misses a real effect 65% of the time.</li>
<li><strong>Exaggerated effects.</strong> When an underpowered study <em>does</em> reach significance, the estimated effect is usually much larger than the truth (the “winner's curse”) — only lucky overestimates cross the threshold.</li>
<li><strong>Uninformative nulls.</strong> “No significant difference” from a low-power test says almost nothing. Report a confidence interval instead: it shows which effect sizes remain plausible.</li>
</ul>
<p>In A/B testing practice, the minimum detectable effect, α, power and baseline variance are fixed first, the sample size is computed, and the test runs until that size is reached — no peeking and stopping early, which inflates the Type I error.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Computing “observed power” after the test from the observed effect — it is a function of the p-value and adds no information.</li><li>Using an optimistic σ from a small pilot: underestimating σ makes n far too small.</li><li>Stopping an A/B test as soon as p &lt; 0.05 (“peeking”).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Power = P(reject H<sub>0</sub> | H<sub>1</sub> true) = 1 − β; target 0.8.</li><li>Power ↑ with n, δ, α; ↓ with σ.</li><li>n = ((z<sub>α</sub> + z<sub>β</sub>)σ/δ)<sup>2</sup>; use <code>TTestPower</code> / <code>TTestIndPower</code> for t-tests.</li><li>Plan n before collecting data; do not peek.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.youtube.com/watch?v=Rsc5znwR5FA" target="_blank" rel="noopener">StatQuest — Statistical power, clearly explained</a></li><li><a href="https://www.youtube.com/watch?v=VX_M3tIyiYk" target="_blank" rel="noopener">StatQuest — Power analysis, clearly explained</a></li><li><a href="https://www.statsmodels.org/stable/generated/statsmodels.stats.power.TTestPower.html" target="_blank" rel="noopener">statsmodels — TTestPower</a></li><li><a href="https://www.itl.nist.gov/div898/handbook/prc/section2/prc222.htm" target="_blank" rel="noopener">NIST e-Handbook — Sample sizes required</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Same setting (σ = 0.5, one-sided α = 0.05) but power 0.90 (z<sub>0.10</sub> = 1.282). Find n.</li><li>What happens to n if the effect to detect is halved from 0.2 to 0.1?</li><li>A study with n = 8 finds “no significant difference”. What should you report instead of “no effect”?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) n = ((1.645 + 1.282)·2.5)<sup>2</sup> = 53.5 ⇒ 54. 2) n is multiplied by 4 (≈ 155). 3) The estimated effect with its confidence interval, and the power the study had for a relevant effect.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 5 · Bài 5.3</span>
<h2>Lực kiểm định và cỡ mẫu</h2>
<p class="lead">Chạy một thí nghiệm không thể phát hiện hiệu ứng bạn quan tâm là phí thời gian và tiền — và kết quả “không khác biệt có ý nghĩa” của nó vô nghĩa. Phân tích lực quyết định cỡ mẫu <em>trước</em> khi thí nghiệm bắt đầu.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa hàm lực và tính lực cho kiểm định z.</li><li>Kể bốn “cần gạt” của lực: α, n, σ và độ lớn hiệu ứng δ.</li><li>Tính cỡ mẫu cần thiết bằng công thức và bằng statsmodels.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Lực</strong> của kiểm định tại giá trị tham số θ là π(θ) = P<sub>θ</sub>(bác bỏ H<sub>0</sub>). Tại θ thuộc H<sub>0</sub> nó bằng α; tại θ thuộc H<sub>1</sub> nó bằng 1 − β(θ). Với kiểm định z phía phải H<sub>0</sub>: μ = μ<sub>0</sub> khi trung bình thật là μ<sub>0</sub> + δ:</p>
<div class="formula"><span class="lbl">Lực của kiểm định z một phía</span>lực(δ) = P( Z &gt; z<sub>α</sub> − δ/(σ/√n) ) = 1 − Φ( z<sub>α</sub> − δ√n/σ )<br>n cần cho lực 1 − β:   n = ( (z<sub>α</sub> + z<sub>β</sub>)·σ/δ )<sup>2</sup>   (hai phía: thay z<sub>α</sub> bằng z<sub>α/2</sub>)</div>
<p>Lực tăng khi <strong>n</strong> tăng, khi <strong>hiệu ứng δ</strong> lớn hơn, khi <strong>nhiễu σ</strong> nhỏ hơn, và khi <strong>α</strong> lớn hơn (kiểm định bớt khắt khe). Tỉ số d = δ/σ là độ lớn hiệu ứng chuẩn hoá (Cohen's d); quy ước 0,2 nhỏ, 0,5 vừa, 0,8 lớn. Lực mục tiêu thường là 0,80 (β = 0,20).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — cần bao nhiêu lần tải trang?</b> σ = 0,5 s. Ta muốn phát hiện chậm đi δ = 0,2 s bằng kiểm định một phía ở α = 0,05 với lực 0,80.</p>
<p>Bước 1: z<sub>0,05</sub> = 1,645, z<sub>0,20</sub> = 0,842. Bước 2: n = ((1,645 + 0,842)·0,5/0,2)<sup>2</sup> = (6,216)<sup>2</sup> = 38,64 ⇒ <b>n = 39</b>. Bước 3: với n = 25 ở Bài 5.1 lực chỉ 0,639 — một phần ba khả năng bỏ lỡ một lần chậm đi 0,2 s có thật. Bước 4: nếu σ chưa biết và dùng kiểm định t, statsmodels cho 40,03 ⇒ 41 (nhỉnh hơn, vì t đuôi nặng hơn). Kiểm định hai phía cần khoảng 50.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats
from statsmodels.stats.power import TTestPower

sigma, delta, alpha = 0.5, 0.2, 0.05
za, zb = stats.norm.ppf(1 - alpha), stats.norm.ppf(0.80)
n_z = ((za + zb) * sigma / delta)**2
print(f"z-test, one-sided, power 0.80: n = {n_z:.2f} -&gt; {int(np.ceil(n_z))}")
for n in [10, 25, 39, 60]:
    power = stats.norm.sf(za - delta / (sigma / np.sqrt(n)))
    print(f"  n={n:2d}: power = {power:.3f}")
n_t = TTestPower().solve_power(effect_size=delta / sigma, alpha=alpha, power=0.80, alternative="larger")
print(f"t-test (sigma unknown): n = {n_t:.2f} -&gt; {int(np.ceil(n_t))}")</code></pre>
<div class="out">z-test, one-sided, power 0.80: n = 38.64 -&gt; 39
  n=10: power = 0.352
  n=25: power = 0.639
  n=39: power = 0.803
  n=60: power = 0.927
t-test (sigma unknown): n = 40.03 -&gt; 41</div>
<h3>Vì sao lực thấp nguy hiểm</h3>
<ul>
<li><strong>Bỏ lỡ hiệu ứng.</strong> Lực 0,35 (n = 10 ở trên) bỏ lỡ hiệu ứng thật 65% số lần.</li>
<li><strong>Phóng đại hiệu ứng.</strong> Khi một nghiên cứu lực thấp <em>có</em> đạt ý nghĩa, hiệu ứng ước lượng thường lớn hơn thật nhiều (“lời nguyền người thắng”) — chỉ những ước lượng may mắn quá cao mới vượt ngưỡng.</li>
<li><strong>Kết quả âm vô thông tin.</strong> “Không khác biệt có ý nghĩa” từ kiểm định lực thấp gần như không nói gì. Hãy báo cáo khoảng tin cậy: nó cho thấy những độ lớn hiệu ứng nào vẫn còn hợp lý.</li>
</ul>
<p>Trong thực hành A/B test, người ta cố định trước hiệu ứng tối thiểu cần phát hiện, α, lực và phương sai nền, tính cỡ mẫu, rồi chạy tới đúng cỡ đó — không nhìn trộm rồi dừng sớm, vì việc đó làm tăng sai lầm loại I.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tính “lực quan sát” sau kiểm định từ hiệu ứng quan sát — nó chỉ là hàm của p-value, không thêm thông tin.</li><li>Dùng σ lạc quan từ một nghiên cứu thử nhỏ: đánh giá thấp σ làm n quá nhỏ.</li><li>Dừng A/B test ngay khi p &lt; 0,05 (“nhìn trộm”).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Lực = P(bác bỏ H<sub>0</sub> | H<sub>1</sub> đúng) = 1 − β; mục tiêu 0,8.</li><li>Lực ↑ theo n, δ, α; ↓ theo σ.</li><li>n = ((z<sub>α</sub> + z<sub>β</sub>)σ/δ)<sup>2</sup>; dùng <code>TTestPower</code> / <code>TTestIndPower</code> cho kiểm định t.</li><li>Lập kế hoạch n trước khi thu dữ liệu; không nhìn trộm.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.youtube.com/watch?v=Rsc5znwR5FA" target="_blank" rel="noopener">StatQuest — Lực thống kê, giải thích rõ ràng</a></li><li><a href="https://www.youtube.com/watch?v=VX_M3tIyiYk" target="_blank" rel="noopener">StatQuest — Phân tích lực, giải thích rõ ràng</a></li><li><a href="https://www.statsmodels.org/stable/generated/statsmodels.stats.power.TTestPower.html" target="_blank" rel="noopener">statsmodels — TTestPower</a></li><li><a href="https://www.itl.nist.gov/div898/handbook/prc/section2/prc222.htm" target="_blank" rel="noopener">NIST e-Handbook — Cỡ mẫu cần thiết</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Cùng bối cảnh (σ = 0,5, một phía α = 0,05) nhưng lực 0,90 (z<sub>0,10</sub> = 1,282). Tìm n.</li><li>n thay đổi thế nào nếu hiệu ứng cần phát hiện giảm một nửa từ 0,2 xuống 0,1?</li><li>Một nghiên cứu với n = 8 thấy “không khác biệt có ý nghĩa”. Nên báo cáo gì thay vì “không có hiệu ứng”?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) n = ((1,645 + 1,282)·2,5)<sup>2</sup> = 53,5 ⇒ 54. 2) n nhân 4 (≈ 155). 3) Hiệu ứng ước lượng kèm khoảng tin cậy, và lực mà nghiên cứu có cho một hiệu ứng đáng quan tâm.</p></div>`);

const c54 = L('psi221-ts-5-4',
  '5.4 — The Neyman–Pearson lemma and likelihood-ratio tests|||5.4 — Bổ đề Neyman–Pearson và kiểm định tỉ số hợp lý',
  'Kiểm định mạnh nhất theo Neyman–Pearson; tỉ số hợp lý Λ; định lý Wilks −2 log Λ ≈ χ²; bộ ba Wald–score–LRT trên dữ liệu số lỗi Poisson.',
  `<span class="eyebrow">PSI221 · Chapter 5 · Lesson 5.4</span>
<h2>The Neyman–Pearson lemma and likelihood-ratio tests</h2>
<p class="lead">Where do test statistics come from? The Neyman–Pearson lemma says the best possible test compares likelihoods. Its generalisation, the likelihood-ratio test, produces almost every test you will meet — and works for models of any complexity.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the Neyman–Pearson lemma for simple hypotheses.</li><li>Compute the likelihood-ratio statistic −2 log Λ and use Wilks' theorem.</li><li>Compare the Wald, score and likelihood-ratio tests on the same data.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Simple vs simple.</strong> Suppose H<sub>0</sub>: θ = θ<sub>0</sub> and H<sub>1</sub>: θ = θ<sub>1</sub> both fully specify the distribution.</p>
<div class="formula"><span class="lbl">Neyman–Pearson lemma (1933)</span>Among all tests with P(Type I error) ≤ α, the most powerful one rejects H<sub>0</sub> when<br>L(θ<sub>1</sub>) / L(θ<sub>0</sub>) &gt; k,   with k chosen so that the level is exactly α.</div>
<p>Example: normal data with known σ, H<sub>0</sub>: μ = μ<sub>0</sub> vs H<sub>1</sub>: μ = μ<sub>1</sub> &gt; μ<sub>0</sub>. The likelihood ratio is an increasing function of x̄, so “ratio &gt; k” is the same as “x̄ &gt; c” — exactly the z-test of Lesson 5.1. Because the rejection region does not depend on which μ<sub>1</sub> &gt; μ<sub>0</sub> we picked, the z-test is <strong>uniformly most powerful</strong> for H<sub>1</sub>: μ &gt; μ<sub>0</sub>.</p>
<p><strong>Composite hypotheses: the generalised likelihood ratio.</strong> For H<sub>0</sub>: θ ∈ Θ<sub>0</sub> versus the full model, compare the best likelihood under H<sub>0</sub> with the best overall:</p>
<div class="formula"><span class="lbl">Likelihood-ratio test (LRT) and Wilks' theorem</span>Λ = sup<sub>θ∈Θ₀</sub> L(θ) / sup<sub>θ</sub> L(θ) ≤ 1      G = −2 log Λ = 2[ℓ(θ̂) − ℓ(θ̂<sub>0</sub>)] ≥ 0<br>Under H<sub>0</sub>, for large n:   G ≈ χ<sup>2</sup>(r),   r = number of parameters fixed by H<sub>0</sub>. Reject for large G.</div>
<p>The t-test, the χ<sup>2</sup> tests of Chapter 7, the ANOVA F-test and the tests that compare nested regression or machine-learning models (“does adding these features improve the log-likelihood?”) are all LRTs or close relatives.</p>
<h3>✍️ Worked example — three tests, one question</h3>
<div class="callout"><p><b>Example — has the bug rate changed?</b> Historically λ<sub>0</sub> = 3 bugs/day. The last 12 days gave ∑x<sub>i</sub> = 48 (λ̂ = 4). Test H<sub>0</sub>: λ = 3 vs H<sub>1</sub>: λ ≠ 3.</p>
<p><b>LRT:</b> G = 2[∑x<sub>i</sub> log(λ̂/λ<sub>0</sub>) − n(λ̂ − λ<sub>0</sub>)] = 2[48 log(4/3) − 12] = <b>3.617</b>; p = P(χ<sup>2</sup>(1) &gt; 3.617) = <b>0.057</b>.</p>
<p><b>Wald:</b> SE evaluated at λ̂: z = (4 − 3)/√(4/12) = 1.732, p = 0.083.</p>
<p><b>Score:</b> SE evaluated at λ<sub>0</sub>: z = (4 − 3)/√(3/12) = 2.000, p = 0.0455.</p>
<p>All three are asymptotically equivalent, yet with n = 12 they straddle 0.05. Honest conclusion: the evidence of a change is borderline; collect more days before acting. (For counts this small an exact Poisson test is also available: the one-sided exact p for ∑x ≥ 48 when the mean is 36 is 0.032.)</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

bugs = np.array([3, 5, 2, 4, 6, 3, 4, 5, 2, 6, 4, 4])   # H0: lambda = 3 vs H1: lambda != 3
n, lam0 = len(bugs), 3.0
lam_hat = bugs.mean()
loglik = lambda lam: stats.poisson.logpmf(bugs, lam).sum()
G = 2 * (loglik(lam_hat) - loglik(lam0))           # -2 log(Lambda)
print(f"lambda_hat = {lam_hat}, -2 log Lambda = {G:.4f}, p = {stats.chi2.sf(G, df=1):.4f}")
z_wald = (lam_hat - lam0) / np.sqrt(lam_hat / n)
z_score = (lam_hat - lam0) / np.sqrt(lam0 / n)
print(f"Wald  z = {z_wald:.3f}, p = {2 * stats.norm.sf(abs(z_wald)):.4f}")
print(f"Score z = {z_score:.3f}, p = {2 * stats.norm.sf(abs(z_score)):.4f}")</code></pre>
<div class="out">lambda_hat = 4.0, -2 log Lambda = 3.6175, p = 0.0572
Wald  z = 1.732, p = 0.0833
Score z = 2.000, p = 0.0455</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Wrong degrees of freedom: r is the number of <em>restrictions</em> imposed by H<sub>0</sub>, not the number of parameters in the model.</li><li>Using Wilks' theorem when H<sub>0</sub> puts a parameter on the boundary (e.g. testing a variance = 0); the χ<sup>2</sup> approximation then fails.</li><li>Forgetting the factor 2 in G = −2 log Λ.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Neyman–Pearson: for simple hypotheses, reject when L(θ<sub>1</sub>)/L(θ<sub>0</sub>) is large — the most powerful test.</li><li>One-sided z-test is uniformly most powerful for a normal mean.</li><li>LRT: G = 2[ℓ(θ̂) − ℓ(θ̂<sub>0</sub>)] ≈ χ<sup>2</sup>(r) under H<sub>0</sub>.</li><li>Wald, score and LRT agree for large n but can differ for small n.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://online.stat.psu.edu/stat415/Lesson10.html" target="_blank" rel="noopener">Penn State STAT 415 — Lesson 10: Hypothesis tests II (power, Wald test)</a></li><li><a href="https://ocw.mit.edu/courses/18-650-statistics-for-applications-fall-2016/pages/lecture-slides/" target="_blank" rel="noopener">MIT 18.650 — Lecture slides (hypothesis testing, likelihood ratio)</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class18-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 18: Null hypothesis significance testing II</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Bernoulli data, H<sub>0</sub>: p = 0.5 vs H<sub>1</sub>: p = 0.7. Show the Neyman–Pearson test rejects when the number of successes is large.</li><li>An LRT comparing a model with 5 parameters to a nested model with 3 gives G = 7.2. What is the reference distribution and is the result significant at 5% (χ<sup>2</sup><sub>0.95</sub>(2) = 5.991)?</li><li>Why can the Wald and score p-values differ?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) L(0.7)/L(0.5) = (0.7/0.5)<sup>s</sup>(0.3/0.5)<sup>n−s</sup> = 1.4<sup>s</sup>·0.6<sup>n−s</sup> increases with s. 2) χ<sup>2</sup>(2); 7.2 &gt; 5.991 ⇒ significant (p ≈ 0.027). 3) They estimate the standard error at different points (θ̂ versus θ<sub>0</sub>); with small n these differ.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 5 · Bài 5.4</span>
<h2>Bổ đề Neyman–Pearson và kiểm định tỉ số hợp lý</h2>
<p class="lead">Các thống kê kiểm định từ đâu ra? Bổ đề Neyman–Pearson nói kiểm định tốt nhất có thể là so sánh các hàm hợp lý. Dạng tổng quát của nó, kiểm định tỉ số hợp lý, sinh ra gần như mọi kiểm định bạn sẽ gặp — và chạy được với mô hình phức tạp bất kỳ.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu bổ đề Neyman–Pearson cho giả thuyết đơn.</li><li>Tính thống kê tỉ số hợp lý −2 log Λ và dùng định lý Wilks.</li><li>So sánh kiểm định Wald, score và tỉ số hợp lý trên cùng dữ liệu.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Đơn với đơn.</strong> Giả sử H<sub>0</sub>: θ = θ<sub>0</sub> và H<sub>1</sub>: θ = θ<sub>1</sub> đều xác định hoàn toàn phân phối.</p>
<div class="formula"><span class="lbl">Bổ đề Neyman–Pearson (1933)</span>Trong mọi kiểm định có P(sai lầm loại I) ≤ α, kiểm định mạnh nhất bác bỏ H<sub>0</sub> khi<br>L(θ<sub>1</sub>) / L(θ<sub>0</sub>) &gt; k,   với k chọn sao cho mức đúng bằng α.</div>
<p>Ví dụ: dữ liệu chuẩn, σ đã biết, H<sub>0</sub>: μ = μ<sub>0</sub> với H<sub>1</sub>: μ = μ<sub>1</sub> &gt; μ<sub>0</sub>. Tỉ số hợp lý là hàm tăng của x̄, nên “tỉ số &gt; k” cũng là “x̄ &gt; c” — đúng kiểm định z ở Bài 5.1. Vì miền bác bỏ không phụ thuộc μ<sub>1</sub> &gt; μ<sub>0</sub> nào được chọn, kiểm định z là <strong>mạnh nhất đều</strong> (UMP) cho H<sub>1</sub>: μ &gt; μ<sub>0</sub>.</p>
<p><strong>Giả thuyết hợp: tỉ số hợp lý tổng quát.</strong> Với H<sub>0</sub>: θ ∈ Θ<sub>0</sub> so với mô hình đầy đủ, so hợp lý tốt nhất dưới H<sub>0</sub> với hợp lý tốt nhất toàn cục:</p>
<div class="formula"><span class="lbl">Kiểm định tỉ số hợp lý (LRT) và định lý Wilks</span>Λ = sup<sub>θ∈Θ₀</sub> L(θ) / sup<sub>θ</sub> L(θ) ≤ 1      G = −2 log Λ = 2[ℓ(θ̂) − ℓ(θ̂<sub>0</sub>)] ≥ 0<br>Khi H<sub>0</sub> đúng, n lớn:   G ≈ χ<sup>2</sup>(r),   r = số tham số bị H<sub>0</sub> cố định. Bác bỏ khi G lớn.</div>
<p>Kiểm định t, các kiểm định χ<sup>2</sup> ở Chương 7, kiểm định F của ANOVA và các phép so sánh mô hình hồi quy hay học máy lồng nhau (“thêm các đặc trưng này có làm log-hợp lý tăng đáng kể không?”) đều là LRT hoặc họ hàng gần.</p>
<h3>✍️ Ví dụ giải từng bước — ba kiểm định, một câu hỏi</h3>
<div class="callout"><p><b>Ví dụ — tốc độ phát sinh lỗi có thay đổi?</b> Trước đây λ<sub>0</sub> = 3 lỗi/ngày. 12 ngày gần nhất cho ∑x<sub>i</sub> = 48 (λ̂ = 4). Kiểm định H<sub>0</sub>: λ = 3 với H<sub>1</sub>: λ ≠ 3.</p>
<p><b>LRT:</b> G = 2[∑x<sub>i</sub> log(λ̂/λ<sub>0</sub>) − n(λ̂ − λ<sub>0</sub>)] = 2[48 log(4/3) − 12] = <b>3,617</b>; p = P(χ<sup>2</sup>(1) &gt; 3,617) = <b>0,057</b>.</p>
<p><b>Wald:</b> SE tính tại λ̂: z = (4 − 3)/√(4/12) = 1,732, p = 0,083.</p>
<p><b>Score:</b> SE tính tại λ<sub>0</sub>: z = (4 − 3)/√(3/12) = 2,000, p = 0,0455.</p>
<p>Cả ba tương đương tiệm cận, vậy mà với n = 12 chúng nằm hai bên 0,05. Kết luận trung thực: bằng chứng thay đổi ở mức ranh giới; nên thu thêm số ngày trước khi hành động. (Với số đếm nhỏ cỡ này còn có kiểm định Poisson chính xác: p một phía cho ∑x ≥ 48 khi kỳ vọng 36 là 0,032.)</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

bugs = np.array([3, 5, 2, 4, 6, 3, 4, 5, 2, 6, 4, 4])   # H0: lambda = 3 vs H1: lambda != 3
n, lam0 = len(bugs), 3.0
lam_hat = bugs.mean()
loglik = lambda lam: stats.poisson.logpmf(bugs, lam).sum()
G = 2 * (loglik(lam_hat) - loglik(lam0))           # -2 log(Lambda)
print(f"lambda_hat = {lam_hat}, -2 log Lambda = {G:.4f}, p = {stats.chi2.sf(G, df=1):.4f}")
z_wald = (lam_hat - lam0) / np.sqrt(lam_hat / n)
z_score = (lam_hat - lam0) / np.sqrt(lam0 / n)
print(f"Wald  z = {z_wald:.3f}, p = {2 * stats.norm.sf(abs(z_wald)):.4f}")
print(f"Score z = {z_score:.3f}, p = {2 * stats.norm.sf(abs(z_score)):.4f}")</code></pre>
<div class="out">lambda_hat = 4.0, -2 log Lambda = 3.6175, p = 0.0572
Wald  z = 1.732, p = 0.0833
Score z = 2.000, p = 0.0455</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Sai bậc tự do: r là số <em>ràng buộc</em> mà H<sub>0</sub> áp đặt, không phải số tham số của mô hình.</li><li>Dùng định lý Wilks khi H<sub>0</sub> đặt tham số lên biên (vd kiểm định phương sai = 0); khi đó xấp xỉ χ<sup>2</sup> hỏng.</li><li>Quên hệ số 2 trong G = −2 log Λ.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Neyman–Pearson: với giả thuyết đơn, bác bỏ khi L(θ<sub>1</sub>)/L(θ<sub>0</sub>) lớn — kiểm định mạnh nhất.</li><li>Kiểm định z một phía là mạnh nhất đều cho trung bình chuẩn.</li><li>LRT: G = 2[ℓ(θ̂) − ℓ(θ̂<sub>0</sub>)] ≈ χ<sup>2</sup>(r) khi H<sub>0</sub> đúng.</li><li>Wald, score và LRT trùng nhau khi n lớn nhưng có thể khác khi n nhỏ.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://online.stat.psu.edu/stat415/Lesson10.html" target="_blank" rel="noopener">Penn State STAT 415 — Bài 10: Kiểm định giả thuyết II (lực, kiểm định Wald)</a></li><li><a href="https://ocw.mit.edu/courses/18-650-statistics-for-applications-fall-2016/pages/lecture-slides/" target="_blank" rel="noopener">MIT 18.650 — Slide bài giảng (kiểm định, tỉ số hợp lý)</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class18-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 18: Kiểm định ý nghĩa giả thuyết không II</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Dữ liệu Bernoulli, H<sub>0</sub>: p = 0,5 với H<sub>1</sub>: p = 0,7. Chứng tỏ kiểm định Neyman–Pearson bác bỏ khi số thành công lớn.</li><li>Một LRT so mô hình 5 tham số với mô hình lồng 3 tham số cho G = 7,2. Phân phối tham chiếu là gì và kết quả có ý nghĩa ở mức 5% không (χ<sup>2</sup><sub>0,95</sub>(2) = 5,991)?</li><li>Vì sao p-value Wald và score có thể khác nhau?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) L(0,7)/L(0,5) = (0,7/0,5)<sup>s</sup>(0,3/0,5)<sup>n−s</sup> = 1,4<sup>s</sup>·0,6<sup>n−s</sup> tăng theo s. 2) χ<sup>2</sup>(2); 7,2 &gt; 5,991 ⇒ có ý nghĩa (p ≈ 0,027). 3) Chúng ước lượng sai số chuẩn ở hai điểm khác nhau (θ̂ so với θ<sub>0</sub>); với n nhỏ hai giá trị này khác nhau.</p></div>`);

const q5 = QZ(5, 'Quiz — Chapter 5: Hypothesis testing|||Quiz — Chương 5: Kiểm định giả thuyết', 'Kiểm tra chương 5: giả thuyết, sai lầm loại I/II, p-value, lực và cỡ mẫu, Neyman–Pearson, LRT.', [
  Q('q1', 'A Type I error is|||Sai lầm loại I là',
    ['not rejecting a false H₀|||không bác bỏ H₀ sai', 'rejecting a true H₀|||bác bỏ H₀ đúng', 'choosing the wrong α|||chọn sai α', 'computing the wrong statistic|||tính sai thống kê'], 1,
    'Its probability is the significance level α.|||Xác suất của nó là mức ý nghĩa α.'),
  Q('q2', 'Right-sided z-test, σ/√n = 0.1, μ₀ = 2.0, α = 0.05. The critical value of x̄ is|||Kiểm định z phía phải, σ/√n = 0,1, μ₀ = 2,0, α = 0,05. Giá trị tới hạn của x̄ là',
    ['2.196|||2,196', '2.1645|||2,1645', '2.05|||2,05', '2.1|||2,1'], 1,
    '2.0 + 1.645·0.1.|||2,0 + 1,645·0,1.'),
  Q('q3', 'z_obs = 1.8 for H₁: μ ≠ μ₀. The p-value is about|||z_qs = 1,8 với H₁: μ ≠ μ₀. p-value khoảng',
    ['0.036|||0,036', '0.072|||0,072', '0.18|||0,18', '0.964|||0,964'], 1,
    'Two-sided: 2·P(Z ≥ 1.8) = 2·0.0359.|||Hai phía: 2·P(Z ≥ 1,8) = 2·0,0359.'),
  Q('q4', 'p = 0.03 means|||p = 0,03 nghĩa là',
    ['P(H₀ true) = 0.03|||P(H₀ đúng) = 0,03', 'if H₀ were true, data this extreme would occur 3% of the time|||nếu H₀ đúng, dữ liệu cực đoan thế này xảy ra 3% số lần', 'the effect is large|||hiệu ứng lớn', 'H₁ is true with probability 0.97|||H₁ đúng với xác suất 0,97'], 1,
    'The p-value is computed assuming H₀.|||p-value được tính khi giả sử H₀ đúng.'),
  Q('q5', 'If H₀ is true and the statistic is continuous, the p-value is distributed as|||Nếu H₀ đúng và thống kê liên tục, p-value có phân phối',
    ['N(0, 1)|||N(0, 1)', 'Uniform(0, 1)|||Uniform(0, 1)', 'concentrated near 0|||dồn về gần 0', 'χ²(1)|||χ²(1)'], 1,
    'So P(p ≤ α) = α.|||Do đó P(p ≤ α) = α.'),
  Q('q6', 'Which change does NOT increase power?|||Thay đổi nào KHÔNG làm tăng lực?',
    ['larger n|||n lớn hơn', 'larger effect δ|||hiệu ứng δ lớn hơn', 'larger σ|||σ lớn hơn', 'larger α|||α lớn hơn'], 2,
    'More noise makes effects harder to detect.|||Nhiễu nhiều hơn làm hiệu ứng khó phát hiện hơn.'),
  Q('q7', 'σ = 0.5, δ = 0.2, one-sided α = 0.05, power 0.8 (z = 1.645, 0.842). Required n for a z-test:|||σ = 0,5, δ = 0,2, một phía α = 0,05, lực 0,8 (z = 1,645; 0,842). n cần cho kiểm định z:',
    ['25|||25', '39|||39', '50|||50', '100|||100'], 1,
    '((1.645 + 0.842)·2.5)² = 38.6 ⇒ 39.|||((1,645 + 0,842)·2,5)² = 38,6 ⇒ 39.'),
  Q('q8', 'The Neyman–Pearson lemma says the most powerful level-α test for simple hypotheses rejects when|||Bổ đề Neyman–Pearson nói kiểm định mạnh nhất mức α cho giả thuyết đơn bác bỏ khi',
    ['the p-value is large|||p-value lớn', 'L(θ₁)/L(θ₀) is large|||L(θ₁)/L(θ₀) lớn', 'x̄ equals θ₀|||x̄ bằng θ₀', 'the variance is small|||phương sai nhỏ'], 1,
    'Reject for large likelihood ratios.|||Bác bỏ khi tỉ số hợp lý lớn.'),
  Q('q9', 'Under H₀ (large n), −2 log Λ approximately follows|||Khi H₀ đúng (n lớn), −2 log Λ xấp xỉ tuân theo',
    ['N(0, 1)|||N(0, 1)', 'χ²(r), r = number of restrictions|||χ²(r), r = số ràng buộc', 't(n − 1)|||t(n − 1)', 'F(1, n)|||F(1, n)'], 1,
    "Wilks' theorem.|||Định lý Wilks."),
  Q('q10', 'Poisson λ̂ = 4 (n = 12), H₀: λ = 3. The Wald z uses SE|||Poisson λ̂ = 4 (n = 12), H₀: λ = 3. z Wald dùng SE',
    ['√(3/12)|||√(3/12)', '√(4/12)|||√(4/12)', '4/√12|||4/√12', '√(12/4)|||√(12/4)'], 1,
    'Wald evaluates the SE at the estimate; the score test uses λ₀.|||Wald tính SE tại ước lượng; kiểm định score dùng λ₀.'),
]);

const ch5 = {
  title: 'Chapter 5 — Hypothesis testing: p-values, errors and power|||Chương 5 — Kiểm định giả thuyết: p-value, sai lầm và lực',
  description: 'H₀/H₁, miền bác bỏ, sai lầm loại I/II; p-value và tuyên bố ASA; lực và cỡ mẫu; Neyman–Pearson, kiểm định tỉ số hợp lý, Wald và score (Wasserman Ch. 10 · Casella–Berger Ch. 8 · OpenStax Ch. 9).',
  lessons: [c51, c52, c53, c54, q5],
};


// ───────────────────────────── Chương 6 — Kiểm định một và hai mẫu ─────────────────────────────
const c61 = L('psi221-ts-6-1',
  '6.1 — One-sample tests: the t-test and tests for a proportion|||6.1 — Kiểm định một mẫu: kiểm định t và kiểm định tỉ lệ',
  'Kiểm định t một mẫu (SLA thời gian phản hồi), kiểm định nhị thức chính xác và xấp xỉ chuẩn cho tỉ lệ (tỉ lệ chip lỗi), khi nào xấp xỉ sai.',
  `<span class="eyebrow">PSI221 · Chapter 6 · Lesson 6.1</span>
<h2>One-sample tests: the t-test and tests for a proportion</h2>
<p class="lead">Is the mean response time really above the promised 100 ms? Is the supplier's defect rate really 10%? These are one-sample questions: one group of data, compared with a fixed reference value.</p>
<h3>🎯 Objectives</h3>
<ul><li>Run the one-sample t-test by hand and with <code>scipy.stats.ttest_1samp</code>.</li><li>Test a proportion with the exact binomial test and the normal-approximation z-test.</li><li>Know when the normal approximation is unreliable.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">One-sample t-test</span>H<sub>0</sub>: μ = μ<sub>0</sub>      T = (X̄ − μ<sub>0</sub>)/(S/√n) ~ t(n − 1) under H<sub>0</sub><br>p-value: right P(T ≥ t), left P(T ≤ t), two-sided 2P(T ≥ |t|)</div>
<p>Assumptions: independent observations from a roughly normal population (or large n). The test is the dual of the t-interval of Lesson 4.2.</p>
<div class="formula"><span class="lbl">Tests for a proportion</span>H<sub>0</sub>: p = p<sub>0</sub>, X = number of successes ~ Binomial(n, p<sub>0</sub>) under H<sub>0</sub><br>Exact: p-value from binomial tail probabilities (<code>stats.binomtest</code>)<br>Large sample (np<sub>0</sub> ≥ 10 and n(1 − p<sub>0</sub>) ≥ 10): Z = (p̂ − p<sub>0</sub>)/√(p<sub>0</sub>(1 − p<sub>0</sub>)/n) ≈ N(0, 1)</div>
<p>Note that the z-test uses p<sub>0</sub> (not p̂) inside the standard error: the distribution is computed assuming H<sub>0</sub> is true.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — SLA check.</b> The API's contract promises a mean response time of at most 100 ms. The 8 measured times have x̄ = 107, s = 8.106. Test H<sub>0</sub>: μ = 100 vs H<sub>1</sub>: μ &gt; 100 at α = 0.05.</p>
<p>Step 1: SE = 8.106/√8 = 2.866. Step 2: t = 7/2.866 = <b>2.442</b>, df = 7. Step 3: p = P(t<sub>7</sub> ≥ 2.442) = <b>0.0223</b> &lt; 0.05. Conclusion: there is evidence at the 5% level that the mean response time exceeds the 100 ms SLA. Consistent with Lesson 4.2, where the 95% interval (100.22, 113.78) lay entirely above 100.</p></div>
<div class="callout"><p><b>Example 2 — defect rate.</b> A supplier claims at most 10% defective chips. In a batch of 50, 9 are defective (p̂ = 0.18). Test H<sub>0</sub>: p = 0.10 vs H<sub>1</sub>: p &gt; 0.10.</p>
<p>Exact: p = P(X ≥ 9 | n = 50, p = 0.1) = <b>0.0579</b> — not significant at 5%. Normal approximation: z = (0.18 − 0.10)/√(0.1·0.9/50) = 1.886, p = <b>0.0297</b> — “significant”! The approximation is wrong here because np<sub>0</sub> = 5 &lt; 10: the binomial is skewed and the normal curve underestimates the right tail's discreteness. Trust the exact test.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

x = np.array([112, 98, 105, 120, 101, 97, 110, 113])    # API response times (ms)
res = stats.ttest_1samp(x, popmean=100, alternative="greater")   # SLA: mean &lt;= 100 ms?
print(f"t = {res.statistic:.3f}, df = {res.df}, one-sided p = {res.pvalue:.4f}")

# 9 defective chips in a batch of 50; supplier claims defect rate 10%
b = stats.binomtest(9, n=50, p=0.10, alternative="greater")
print(f"exact binomial p = {b.pvalue:.4f}")
p0, phat, n = 0.10, 9 / 50, 50
z = (phat - p0) / np.sqrt(p0 * (1 - p0) / n)
print(f"normal approx  z = {z:.3f}, p = {stats.norm.sf(z):.4f}")</code></pre>
<div class="out">t = 2.442, df = 7, one-sided p = 0.0223
exact binomial p = 0.0579
normal approx  z = 1.886, p = 0.0297</div>
<h3>Reporting</h3>
<p>Good practice: “The mean response time was 107 ms (95% CI 100.2 to 113.8 ms), significantly above the 100 ms target (one-sided t-test, t(7) = 2.44, p = 0.022).” Estimate, interval, test, degrees of freedom, p-value — in one sentence.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using p̂ instead of p<sub>0</sub> in the SE of the z-test for a proportion (that is the Wald test; acceptable for large n but not the standard choice).</li><li>Trusting the normal approximation with few expected successes — use <code>binomtest</code>.</li><li>Forgetting that SciPy's default is two-sided: pass <code>alternative="greater"</code> or <code>"less"</code> for one-sided tests.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>One-sample t: T = (X̄ − μ<sub>0</sub>)/(S/√n) on n − 1 df.</li><li>Proportion: exact binomial test always valid; z-test when np<sub>0</sub>, n(1 − p<sub>0</sub>) ≥ 10.</li><li>The z-test SE uses p<sub>0</sub>.</li><li>Report estimate + CI + test statistic + df + p.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/9-5-additional-information-and-full-hypothesis-test-examples" target="_blank" rel="noopener">OpenStax — 9.5 Full hypothesis test examples</a></li><li><a href="https://www.itl.nist.gov/div898/handbook/prc/section2/prc22.htm" target="_blank" rel="noopener">NIST e-Handbook — Are the data consistent with the assumed process mean?</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.binomtest.html" target="_blank" rel="noopener">SciPy — binomtest</a></li><li><a href="https://online.stat.psu.edu/stat415/Lesson09.html" target="_blank" rel="noopener">Penn State STAT 415 — Lesson 9: Tests about proportions</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>n = 16, x̄ = 52.3, s = 4, H<sub>0</sub>: μ = 50 vs H<sub>1</sub>: μ ≠ 50. Compute t and decide at 5% (t<sub>0.025, 15</sub> = 2.131).</li><li>A coin gives 60 heads in 100 tosses. Compute the z statistic for H<sub>0</sub>: p = 0.5 (two-sided).</li><li>Why is the exact binomial p-value preferable in Example 2?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) t = 2.3/(4/4) = 2.3 &gt; 2.131 ⇒ reject at 5% (p ≈ 0.036). 2) z = (0.6 − 0.5)/√(0.25/100) = 2.0, two-sided p ≈ 0.0455. 3) The expected count np<sub>0</sub> = 5 is too small for the normal approximation.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 6 · Bài 6.1</span>
<h2>Kiểm định một mẫu: kiểm định t và kiểm định tỉ lệ</h2>
<p class="lead">Thời gian phản hồi trung bình có thật sự vượt mức cam kết 100 ms? Tỉ lệ lỗi của nhà cung cấp có thật là 10%? Đây là câu hỏi một mẫu: một nhóm dữ liệu, so với một giá trị tham chiếu cố định.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Chạy kiểm định t một mẫu bằng tay và bằng <code>scipy.stats.ttest_1samp</code>.</li><li>Kiểm định tỉ lệ bằng kiểm định nhị thức chính xác và kiểm định z xấp xỉ chuẩn.</li><li>Biết khi nào xấp xỉ chuẩn không đáng tin.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Kiểm định t một mẫu</span>H<sub>0</sub>: μ = μ<sub>0</sub>      T = (X̄ − μ<sub>0</sub>)/(S/√n) ~ t(n − 1) khi H<sub>0</sub> đúng<br>p-value: phải P(T ≥ t), trái P(T ≤ t), hai phía 2P(T ≥ |t|)</div>
<p>Giả định: quan sát độc lập từ tổng thể gần chuẩn (hoặc n lớn). Kiểm định này là đối ngẫu của khoảng t ở Bài 4.2.</p>
<div class="formula"><span class="lbl">Kiểm định cho tỉ lệ</span>H<sub>0</sub>: p = p<sub>0</sub>, X = số thành công ~ Binomial(n, p<sub>0</sub>) khi H<sub>0</sub> đúng<br>Chính xác: p-value từ xác suất đuôi nhị thức (<code>stats.binomtest</code>)<br>Mẫu lớn (np<sub>0</sub> ≥ 10 và n(1 − p<sub>0</sub>) ≥ 10): Z = (p̂ − p<sub>0</sub>)/√(p<sub>0</sub>(1 − p<sub>0</sub>)/n) ≈ N(0, 1)</div>
<p>Lưu ý kiểm định z dùng p<sub>0</sub> (không phải p̂) trong sai số chuẩn: phân phối được tính khi giả sử H<sub>0</sub> đúng.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — kiểm tra SLA.</b> Hợp đồng API cam kết thời gian phản hồi trung bình tối đa 100 ms. 8 lần đo có x̄ = 107, s = 8,106. Kiểm định H<sub>0</sub>: μ = 100 với H<sub>1</sub>: μ &gt; 100 ở α = 0,05.</p>
<p>Bước 1: SE = 8,106/√8 = 2,866. Bước 2: t = 7/2,866 = <b>2,442</b>, bậc tự do 7. Bước 3: p = P(t<sub>7</sub> ≥ 2,442) = <b>0,0223</b> &lt; 0,05. Kết luận: ở mức 5% có bằng chứng thời gian phản hồi trung bình vượt SLA 100 ms. Khớp với Bài 4.2, nơi khoảng 95% (100,22; 113,78) nằm hẳn trên 100.</p></div>
<div class="callout"><p><b>Ví dụ 2 — tỉ lệ lỗi.</b> Nhà cung cấp cam kết tối đa 10% chip lỗi. Trong lô 50 chip có 9 chip lỗi (p̂ = 0,18). Kiểm định H<sub>0</sub>: p = 0,10 với H<sub>1</sub>: p &gt; 0,10.</p>
<p>Chính xác: p = P(X ≥ 9 | n = 50, p = 0,1) = <b>0,0579</b> — không có ý nghĩa ở mức 5%. Xấp xỉ chuẩn: z = (0,18 − 0,10)/√(0,1·0,9/50) = 1,886, p = <b>0,0297</b> — “có ý nghĩa”! Xấp xỉ sai ở đây vì np<sub>0</sub> = 5 &lt; 10: phân phối nhị thức lệch và đường cong chuẩn đánh giá sai đuôi phải rời rạc. Hãy tin kiểm định chính xác.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

x = np.array([112, 98, 105, 120, 101, 97, 110, 113])    # API response times (ms)
res = stats.ttest_1samp(x, popmean=100, alternative="greater")   # SLA: mean &lt;= 100 ms?
print(f"t = {res.statistic:.3f}, df = {res.df}, one-sided p = {res.pvalue:.4f}")

# 9 defective chips in a batch of 50; supplier claims defect rate 10%
b = stats.binomtest(9, n=50, p=0.10, alternative="greater")
print(f"exact binomial p = {b.pvalue:.4f}")
p0, phat, n = 0.10, 9 / 50, 50
z = (phat - p0) / np.sqrt(p0 * (1 - p0) / n)
print(f"normal approx  z = {z:.3f}, p = {stats.norm.sf(z):.4f}")</code></pre>
<div class="out">t = 2.442, df = 7, one-sided p = 0.0223
exact binomial p = 0.0579
normal approx  z = 1.886, p = 0.0297</div>
<h3>Báo cáo</h3>
<p>Cách viết tốt: “Thời gian phản hồi trung bình là 107 ms (KTC 95%: 100,2 tới 113,8 ms), cao hơn có ý nghĩa so với mục tiêu 100 ms (kiểm định t một phía, t(7) = 2,44, p = 0,022).” Ước lượng, khoảng, kiểm định, bậc tự do, p-value — trong một câu.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng p̂ thay vì p<sub>0</sub> trong SE của kiểm định z cho tỉ lệ (đó là kiểm định Wald; chấp nhận được khi n lớn nhưng không phải lựa chọn chuẩn).</li><li>Tin xấp xỉ chuẩn khi số thành công kỳ vọng ít — dùng <code>binomtest</code>.</li><li>Quên rằng SciPy mặc định hai phía: truyền <code>alternative="greater"</code> hoặc <code>"less"</code> cho kiểm định một phía.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>t một mẫu: T = (X̄ − μ<sub>0</sub>)/(S/√n) với n − 1 bậc tự do.</li><li>Tỉ lệ: kiểm định nhị thức chính xác luôn đúng; kiểm định z khi np<sub>0</sub>, n(1 − p<sub>0</sub>) ≥ 10.</li><li>SE của kiểm định z dùng p<sub>0</sub>.</li><li>Báo cáo ước lượng + khoảng tin cậy + thống kê + bậc tự do + p.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/9-5-additional-information-and-full-hypothesis-test-examples" target="_blank" rel="noopener">OpenStax — 9.5 Ví dụ kiểm định đầy đủ</a></li><li><a href="https://www.itl.nist.gov/div898/handbook/prc/section2/prc22.htm" target="_blank" rel="noopener">NIST e-Handbook — Dữ liệu có phù hợp với trung bình quy trình giả định?</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.binomtest.html" target="_blank" rel="noopener">SciPy — binomtest</a></li><li><a href="https://online.stat.psu.edu/stat415/Lesson09.html" target="_blank" rel="noopener">Penn State STAT 415 — Bài 9: Kiểm định về tỉ lệ</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>n = 16, x̄ = 52,3, s = 4, H<sub>0</sub>: μ = 50 với H<sub>1</sub>: μ ≠ 50. Tính t và quyết định ở mức 5% (t<sub>0,025; 15</sub> = 2,131).</li><li>Một đồng xu cho 60 mặt ngửa trong 100 lần tung. Tính thống kê z cho H<sub>0</sub>: p = 0,5 (hai phía).</li><li>Vì sao p-value nhị thức chính xác đáng dùng hơn ở Ví dụ 2?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) t = 2,3/(4/4) = 2,3 &gt; 2,131 ⇒ bác bỏ ở mức 5% (p ≈ 0,036). 2) z = (0,6 − 0,5)/√(0,25/100) = 2,0, p hai phía ≈ 0,0455. 3) Số đếm kỳ vọng np<sub>0</sub> = 5 quá nhỏ cho xấp xỉ chuẩn.</p></div>`);

const c62 = L('psi221-ts-6-2',
  '6.2 — Comparing two independent means: pooled and Welch t-tests|||6.2 — So sánh hai trung bình độc lập: kiểm định t gộp và Welch',
  'Kiểm định t hai mẫu độc lập: phương sai gộp và Welch (bậc tự do Welch–Satterthwaite), khoảng tin cậy cho μ₁ − μ₂; ví dụ thời gian build cũ/mới.',
  `<span class="eyebrow">PSI221 · Chapter 6 · Lesson 6.2</span>
<h2>Comparing two independent means: pooled and Welch t-tests</h2>
<p class="lead">Did the new build pipeline really make builds faster? Two independent groups, two sample means, and one question: is the difference larger than random variation would produce?</p>
<h3>🎯 Objectives</h3>
<ul><li>Run the pooled two-sample t-test and Welch's t-test.</li><li>Build a confidence interval for μ<sub>1</sub> − μ<sub>2</sub>.</li><li>Explain why Welch's test is the safer default.</li></ul>
<h3>📖 Lecture</h3>
<p>Two independent samples: X<sub>1</sub>, …, X<sub>n₁</sub> from a population with mean μ<sub>1</sub> and SD σ<sub>1</sub>; Y<sub>1</sub>, …, Y<sub>n₂</sub> with μ<sub>2</sub>, σ<sub>2</sub>. Test H<sub>0</sub>: μ<sub>1</sub> = μ<sub>2</sub>. Since Var(X̄ − Ȳ) = σ<sub>1</sub><sup>2</sup>/n<sub>1</sub> + σ<sub>2</sub><sup>2</sup>/n<sub>2</sub> (independence), two versions exist:</p>
<div class="formula"><span class="lbl">Pooled t-test (assumes σ₁ = σ₂)</span>s<sub>p</sub><sup>2</sup> = [(n<sub>1</sub> − 1)s<sub>1</sub><sup>2</sup> + (n<sub>2</sub> − 1)s<sub>2</sub><sup>2</sup>] / (n<sub>1</sub> + n<sub>2</sub> − 2)      T = (x̄ − ȳ) / ( s<sub>p</sub>√(1/n<sub>1</sub> + 1/n<sub>2</sub>) ),  df = n<sub>1</sub> + n<sub>2</sub> − 2</div>
<div class="formula"><span class="lbl">Welch t-test (no equal-variance assumption)</span>T = (x̄ − ȳ) / √( s<sub>1</sub><sup>2</sup>/n<sub>1</sub> + s<sub>2</sub><sup>2</sup>/n<sub>2</sub> )      df ≈ (a + b)<sup>2</sup> / ( a<sup>2</sup>/(n<sub>1</sub> − 1) + b<sup>2</sup>/(n<sub>2</sub> − 1) ),  a = s<sub>1</sub><sup>2</sup>/n<sub>1</sub>, b = s<sub>2</sub><sup>2</sup>/n<sub>2</sub></div>
<p>The Welch–Satterthwaite df is usually not an integer and lies between min(n<sub>1</sub>, n<sub>2</sub>) − 1 and n<sub>1</sub> + n<sub>2</sub> − 2. The confidence interval is (x̄ − ȳ) ± t*·SE with the same SE and df.</p>
<p><strong>Which to use?</strong> If the variances really are equal, Welch loses almost nothing. If they differ — especially with unequal sample sizes — the pooled test can have a Type I error far from α. Modern advice (and R's default) is <strong>Welch</strong>. In SciPy pass <code>equal_var=False</code>; the default is still the pooled test.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — build times.</b> Old pipeline (A): 10 builds; new pipeline (B): 12 builds (seconds per test suite).</p>
<p>Step 1: x̄<sub>A</sub> = 2.319, s<sub>A</sub> = 0.1936; x̄<sub>B</sub> = 2.020, s<sub>B</sub> = 0.1524; difference 0.299 s. Step 2 (Welch): SE = √(0.1936<sup>2</sup>/10 + 0.1524<sup>2</sup>/12) = √(0.003748 + 0.001936) = 0.0754; t = 0.299/0.0754 = <b>3.966</b>, df ≈ 16.99, p = <b>0.0010</b>. Step 3 (pooled): s<sub>p</sub> = 0.1722, SE = 0.0737, t = 4.056, df = 20, p = 0.0006 — the same conclusion here. Step 4: Welch 95% CI for μ<sub>A</sub> − μ<sub>B</sub>: <b>(0.140, 0.458)</b> s. The new pipeline is faster by roughly 0.14 to 0.46 s per suite.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

A = np.array([2.31, 2.05, 2.48, 2.20, 2.65, 2.12, 2.39, 2.27, 2.54, 2.18])          # old build (s)
B = np.array([2.02, 1.88, 2.15, 1.95, 2.30, 1.79, 2.07, 1.99, 2.21, 1.85, 1.93, 2.10])  # new build (s)
print(f"means: A={A.mean():.4f}  B={B.mean():.4f}  diff={A.mean() - B.mean():.4f}")
print(f"sds  : A={A.std(ddof=1):.4f}  B={B.std(ddof=1):.4f}")
pooled = stats.ttest_ind(A, B, equal_var=True)
welch = stats.ttest_ind(A, B, equal_var=False)
print(f"pooled t = {pooled.statistic:.3f}, df = {pooled.df:.0f}, p = {pooled.pvalue:.2e}")
print(f"Welch  t = {welch.statistic:.3f}, df = {welch.df:.2f}, p = {welch.pvalue:.2e}")
ci = welch.confidence_interval(0.95)
print(f"Welch 95% CI for muA - muB: ({ci.low:.4f}, {ci.high:.4f})")</code></pre>
<div class="out">means: A=2.3190  B=2.0200  diff=0.2990
sds  : A=0.1936  B=0.1524
pooled t = 4.056, df = 20, p = 6.17e-04
Welch  t = 3.966, df = 16.99, p = 9.99e-04
Welch 95% CI for muA - muB: (0.1399, 0.4581)</div>
<h3>Checking assumptions</h3>
<ul>
<li><strong>Independence</strong> within and between groups — the most important one. The same builds measured twice are <em>not</em> independent groups (see paired tests, 6.3).</li>
<li><strong>Normality</strong> — not critical for moderate n by the CLT; for small skewed samples use Mann–Whitney (10.1) or a permutation test (10.2).</li>
<li><strong>Equal variances</strong> — not needed for Welch.</li>
</ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Running a pooled test by default in SciPy without noticing <code>equal_var=True</code>.</li><li>Pre-testing equal variances with an F-test and then choosing pooled/Welch — this two-step procedure distorts α; just use Welch.</li><li>Using a two-sample test on paired data (the same users before/after).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>SE(X̄ − Ȳ) = √(s<sub>1</sub><sup>2</sup>/n<sub>1</sub> + s<sub>2</sub><sup>2</sup>/n<sub>2</sub>) (Welch) or s<sub>p</sub>√(1/n<sub>1</sub> + 1/n<sub>2</sub>) (pooled).</li><li>Welch df from the Satterthwaite formula; pooled df = n<sub>1</sub> + n<sub>2</sub> − 2.</li><li>Prefer Welch; report the CI for the difference.</li><li>Independence is the assumption that matters most.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/10-1-two-population-means-with-unknown-standard-deviations" target="_blank" rel="noopener">OpenStax — 10.1 Two population means with unknown standard deviations</a></li><li><a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm" target="_blank" rel="noopener">NIST e-Handbook — Two-sample t-test for equal means</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ttest_ind.html" target="_blank" rel="noopener">SciPy — ttest_ind (equal_var, confidence_interval)</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class18-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 18: one- and two-sample t-tests</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>n<sub>1</sub> = n<sub>2</sub> = 25, x̄ = 50, ȳ = 46, s<sub>1</sub> = s<sub>2</sub> = 10. Compute the pooled t.</li><li>Why can the Welch df not exceed n<sub>1</sub> + n<sub>2</sub> − 2?</li><li>In the build example, does the 95% CI support a speed-up of 0.5 s?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) s<sub>p</sub> = 10, SE = 10√(2/25) = 2.828, t = 1.414 (df 48, p ≈ 0.16). 2) Welch uses less information than pooling; its df equals the pooled df only in the best case (equal variances and sizes). 3) No — 0.5 lies above the upper limit 0.458.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 6 · Bài 6.2</span>
<h2>So sánh hai trung bình độc lập: kiểm định t gộp và Welch</h2>
<p class="lead">Pipeline build mới có thật sự làm build nhanh hơn? Hai nhóm độc lập, hai trung bình mẫu, và một câu hỏi: chênh lệch có lớn hơn mức dao động ngẫu nhiên tạo ra không?</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Chạy kiểm định t hai mẫu gộp phương sai và kiểm định t Welch.</li><li>Dựng khoảng tin cậy cho μ<sub>1</sub> − μ<sub>2</sub>.</li><li>Giải thích vì sao kiểm định Welch là mặc định an toàn hơn.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Hai mẫu độc lập: X<sub>1</sub>, …, X<sub>n₁</sub> từ tổng thể có trung bình μ<sub>1</sub>, độ lệch chuẩn σ<sub>1</sub>; Y<sub>1</sub>, …, Y<sub>n₂</sub> với μ<sub>2</sub>, σ<sub>2</sub>. Kiểm định H<sub>0</sub>: μ<sub>1</sub> = μ<sub>2</sub>. Vì Var(X̄ − Ȳ) = σ<sub>1</sub><sup>2</sup>/n<sub>1</sub> + σ<sub>2</sub><sup>2</sup>/n<sub>2</sub> (độc lập), có hai phiên bản:</p>
<div class="formula"><span class="lbl">Kiểm định t gộp (giả định σ₁ = σ₂)</span>s<sub>p</sub><sup>2</sup> = [(n<sub>1</sub> − 1)s<sub>1</sub><sup>2</sup> + (n<sub>2</sub> − 1)s<sub>2</sub><sup>2</sup>] / (n<sub>1</sub> + n<sub>2</sub> − 2)      T = (x̄ − ȳ) / ( s<sub>p</sub>√(1/n<sub>1</sub> + 1/n<sub>2</sub>) ),  bậc tự do = n<sub>1</sub> + n<sub>2</sub> − 2</div>
<div class="formula"><span class="lbl">Kiểm định t Welch (không giả định phương sai bằng nhau)</span>T = (x̄ − ȳ) / √( s<sub>1</sub><sup>2</sup>/n<sub>1</sub> + s<sub>2</sub><sup>2</sup>/n<sub>2</sub> )      bậc tự do ≈ (a + b)<sup>2</sup> / ( a<sup>2</sup>/(n<sub>1</sub> − 1) + b<sup>2</sup>/(n<sub>2</sub> − 1) ),  a = s<sub>1</sub><sup>2</sup>/n<sub>1</sub>, b = s<sub>2</sub><sup>2</sup>/n<sub>2</sub></div>
<p>Bậc tự do Welch–Satterthwaite thường không nguyên và nằm giữa min(n<sub>1</sub>, n<sub>2</sub>) − 1 và n<sub>1</sub> + n<sub>2</sub> − 2. Khoảng tin cậy là (x̄ − ȳ) ± t*·SE với cùng SE và bậc tự do.</p>
<p><strong>Dùng cái nào?</strong> Nếu phương sai thật sự bằng nhau, Welch gần như không mất gì. Nếu chúng khác nhau — nhất là khi cỡ mẫu khác nhau — kiểm định gộp có thể có sai lầm loại I lệch xa α. Khuyến nghị hiện đại (và mặc định của R) là <strong>Welch</strong>. Trong SciPy truyền <code>equal_var=False</code>; mặc định vẫn là kiểm định gộp.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — thời gian build.</b> Pipeline cũ (A): 10 lần build; pipeline mới (B): 12 lần build (giây cho mỗi bộ test).</p>
<p>Bước 1: x̄<sub>A</sub> = 2,319, s<sub>A</sub> = 0,1936; x̄<sub>B</sub> = 2,020, s<sub>B</sub> = 0,1524; chênh lệch 0,299 s. Bước 2 (Welch): SE = √(0,1936<sup>2</sup>/10 + 0,1524<sup>2</sup>/12) = √(0,003748 + 0,001936) = 0,0754; t = 0,299/0,0754 = <b>3,966</b>, bậc tự do ≈ 16,99, p = <b>0,0010</b>. Bước 3 (gộp): s<sub>p</sub> = 0,1722, SE = 0,0737, t = 4,056, bậc tự do 20, p = 0,0006 — ở đây cùng kết luận. Bước 4: KTC 95% Welch cho μ<sub>A</sub> − μ<sub>B</sub>: <b>(0,140; 0,458)</b> s. Pipeline mới nhanh hơn khoảng 0,14 tới 0,46 s mỗi bộ test.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

A = np.array([2.31, 2.05, 2.48, 2.20, 2.65, 2.12, 2.39, 2.27, 2.54, 2.18])          # old build (s)
B = np.array([2.02, 1.88, 2.15, 1.95, 2.30, 1.79, 2.07, 1.99, 2.21, 1.85, 1.93, 2.10])  # new build (s)
print(f"means: A={A.mean():.4f}  B={B.mean():.4f}  diff={A.mean() - B.mean():.4f}")
print(f"sds  : A={A.std(ddof=1):.4f}  B={B.std(ddof=1):.4f}")
pooled = stats.ttest_ind(A, B, equal_var=True)
welch = stats.ttest_ind(A, B, equal_var=False)
print(f"pooled t = {pooled.statistic:.3f}, df = {pooled.df:.0f}, p = {pooled.pvalue:.2e}")
print(f"Welch  t = {welch.statistic:.3f}, df = {welch.df:.2f}, p = {welch.pvalue:.2e}")
ci = welch.confidence_interval(0.95)
print(f"Welch 95% CI for muA - muB: ({ci.low:.4f}, {ci.high:.4f})")</code></pre>
<div class="out">means: A=2.3190  B=2.0200  diff=0.2990
sds  : A=0.1936  B=0.1524
pooled t = 4.056, df = 20, p = 6.17e-04
Welch  t = 3.966, df = 16.99, p = 9.99e-04
Welch 95% CI for muA - muB: (0.1399, 0.4581)</div>
<h3>Kiểm tra giả định</h3>
<ul>
<li><strong>Độc lập</strong> trong và giữa các nhóm — giả định quan trọng nhất. Cùng các lần build đo hai lần <em>không</em> phải hai nhóm độc lập (xem kiểm định cặp, 6.3).</li>
<li><strong>Tính chuẩn</strong> — không quá quan trọng khi n vừa phải nhờ CLT; mẫu nhỏ, lệch thì dùng Mann–Whitney (10.1) hoặc kiểm định hoán vị (10.2).</li>
<li><strong>Phương sai bằng nhau</strong> — Welch không cần.</li>
</ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chạy kiểm định gộp theo mặc định của SciPy mà không để ý <code>equal_var=True</code>.</li><li>Kiểm định trước phương sai bằng F rồi mới chọn gộp/Welch — quy trình hai bước này làm lệch α; cứ dùng Welch.</li><li>Dùng kiểm định hai mẫu cho dữ liệu cặp (cùng người dùng trước/sau).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>SE(X̄ − Ȳ) = √(s<sub>1</sub><sup>2</sup>/n<sub>1</sub> + s<sub>2</sub><sup>2</sup>/n<sub>2</sub>) (Welch) hoặc s<sub>p</sub>√(1/n<sub>1</sub> + 1/n<sub>2</sub>) (gộp).</li><li>Bậc tự do Welch theo công thức Satterthwaite; gộp = n<sub>1</sub> + n<sub>2</sub> − 2.</li><li>Ưu tiên Welch; báo cáo khoảng tin cậy cho chênh lệch.</li><li>Độc lập là giả định quan trọng nhất.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/10-1-two-population-means-with-unknown-standard-deviations" target="_blank" rel="noopener">OpenStax — 10.1 Hai trung bình tổng thể khi chưa biết độ lệch chuẩn</a></li><li><a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm" target="_blank" rel="noopener">NIST e-Handbook — Kiểm định t hai mẫu cho trung bình bằng nhau</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ttest_ind.html" target="_blank" rel="noopener">SciPy — ttest_ind (equal_var, confidence_interval)</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class18-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 18: kiểm định t một và hai mẫu</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>n<sub>1</sub> = n<sub>2</sub> = 25, x̄ = 50, ȳ = 46, s<sub>1</sub> = s<sub>2</sub> = 10. Tính t gộp.</li><li>Vì sao bậc tự do Welch không thể vượt n<sub>1</sub> + n<sub>2</sub> − 2?</li><li>Trong ví dụ build, KTC 95% có ủng hộ mức tăng tốc 0,5 s không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) s<sub>p</sub> = 10, SE = 10√(2/25) = 2,828, t = 1,414 (bậc tự do 48, p ≈ 0,16). 2) Welch dùng ít thông tin hơn việc gộp; bậc tự do của nó chỉ bằng bậc tự do gộp trong trường hợp tốt nhất (phương sai và cỡ mẫu bằng nhau). 3) Không — 0,5 nằm trên cận trên 0,458.</p></div>`);

const c63 = L('psi221-ts-6-3',
  '6.3 — Paired data: the paired t-test|||6.3 — Dữ liệu cặp: kiểm định t cặp',
  'Thiết kế cặp (trước/sau, cùng bộ dữ liệu), kiểm định t trên hiệu số d; ví dụ so sánh hai mô hình học máy trên 10 bộ dữ liệu; vì sao dùng nhầm kiểm định độc lập làm mất bằng chứng.',
  `<span class="eyebrow">PSI221 · Chapter 6 · Lesson 6.3</span>
<h2>Paired data: the paired t-test</h2>
<p class="lead">When two measurements come from the same unit — the same user before and after, the same dataset under two algorithms — the comparison should be made <em>within</em> each unit. Pairing removes the huge variation between units and can turn an invisible effect into a clear one.</p>
<h3>🎯 Objectives</h3>
<ul><li>Recognise paired designs and explain why they are powerful.</li><li>Run the paired t-test as a one-sample t-test on the differences.</li><li>See the cost of wrongly analysing paired data as independent samples.</li></ul>
<h3>📖 Lecture</h3>
<p>Data come in pairs (X<sub>i</sub>, Y<sub>i</sub>), i = 1, …, n. Define the differences D<sub>i</sub> = Y<sub>i</sub> − X<sub>i</sub> with mean μ<sub>D</sub>. The question “is Y better than X on average?” becomes H<sub>0</sub>: μ<sub>D</sub> = 0, a one-sample problem:</p>
<div class="formula"><span class="lbl">Paired t-test</span>d̄ = mean of d<sub>i</sub>,  s<sub>d</sub> = SD of d<sub>i</sub>      T = d̄ / (s<sub>d</sub>/√n) ~ t(n − 1) under H<sub>0</sub>      CI: d̄ ± t*·s<sub>d</sub>/√n</div>
<p>Why pairing helps: Var(D) = σ<sub>X</sub><sup>2</sup> + σ<sub>Y</sub><sup>2</sup> − 2Cov(X, Y). When the two measurements on a unit are strongly positively correlated (an easy dataset is easy for both models), the covariance term cancels most of the variance. The independent-samples test ignores this and compares the difference with the full between-unit variation.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — two ML models on 10 benchmark datasets.</b> Accuracy (%) of model X and model Y on the same 10 datasets:</p>
<p>X: 82.1, 75.4, 90.2, 68.7, 77.9, 85.3, 72.6, 88.0, 79.5, 70.8<br>Y: 83.0, 76.9, 90.5, 70.1, 78.2, 86.8, 73.0, 89.4, 80.9, 71.2</p>
<p>Step 1: differences d = 0.9, 1.5, 0.3, 1.4, 0.3, 1.5, 0.4, 1.4, 1.4, 0.4. Step 2: d̄ = <b>0.950</b>, s<sub>d</sub> = 0.5442, SE = 0.1721. Step 3: t = 0.950/0.1721 = <b>5.521</b>, df = 9, p = <b>0.00037</b>. Step 4: 95% CI for the mean gain: <b>(0.561, 1.339)</b> points. Y beats X on <em>every</em> dataset.</p>
<p>If you wrongly ran an independent two-sample test you would get t = 0.288, p = 0.776 — “no difference”! The datasets differ by 20 accuracy points among themselves, and that between-dataset spread drowns the consistent 1-point gain.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

X = np.array([82.1, 75.4, 90.2, 68.7, 77.9, 85.3, 72.6, 88.0, 79.5, 70.8])  # model X accuracy (%)
Y = np.array([83.0, 76.9, 90.5, 70.1, 78.2, 86.8, 73.0, 89.4, 80.9, 71.2])  # model Y, same 10 datasets
d = Y - X
print("differences:", d.round(1))
print(f"mean d = {d.mean():.3f}, sd d = {d.std(ddof=1):.4f}")
paired = stats.ttest_rel(Y, X)
print(f"paired  : t = {paired.statistic:.3f}, p = {paired.pvalue:.6f}")
wrong = stats.ttest_ind(Y, X)
print(f"unpaired: t = {wrong.statistic:.3f}, p = {wrong.pvalue:.4f}   &lt;- WRONG test")
ci = paired.confidence_interval(0.95)
print(f"95% CI for mean difference: ({ci.low:.3f}, {ci.high:.3f})")</code></pre>
<div class="out">differences: [0.9 1.5 0.3 1.4 0.3 1.5 0.4 1.4 1.4 0.4]
mean d = 0.950, sd d = 0.5442
paired  : t = 5.521, p = 0.000370
unpaired: t = 0.288, p = 0.7763   &lt;- WRONG test
95% CI for mean difference: (0.561, 1.339)</div>
<h3>Where paired designs appear in computing</h3>
<ul>
<li>Comparing two models or two hyper-parameter settings on the same cross-validation folds or benchmark datasets.</li>
<li>Before/after measurements on the same servers, the same users or the same queries.</li>
<li>Crossover A/B tests where each user sees both versions (in random order).</li>
</ul>
<p>For non-normal differences with small n, use the Wilcoxon signed-rank test (Lesson 10.1). Note: cross-validation folds share training data, so their accuracy differences are not fully independent; specialised corrections exist, but the basic paired idea remains.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using <code>ttest_ind</code> on paired data — the most common and most costly error.</li><li>Pairing data that are not naturally paired (sorting both groups and matching by rank).</li><li>Dropping incomplete pairs silently without reporting how many.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Paired data ⇒ analyse differences d<sub>i</sub> = y<sub>i</sub> − x<sub>i</sub>.</li><li>T = d̄/(s<sub>d</sub>/√n) with n − 1 df; <code>stats.ttest_rel</code>.</li><li>Pairing removes between-unit variation ⇒ much more power.</li><li>Independent-samples analysis of paired data can hide a real effect.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/10-4-matched-or-paired-samples" target="_blank" rel="noopener">OpenStax — 10.4 Matched or paired samples</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ttest_rel.html" target="_blank" rel="noopener">SciPy — ttest_rel</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class19-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 19: NHST III (paired t-test, chi-square, ANOVA)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Differences after/before for 5 servers (ms): −4, −6, −1, −5, −4. Compute d̄, s<sub>d</sub> and t.</li><li>Why does Var(D) become small when X and Y are strongly correlated?</li><li>You test 20 users with app version A one week and version B the next. Paired or independent?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) d̄ = −4, s<sub>d</sub> = √(14/4) = 1.871, t = −4/(1.871/√5) = −4.78 (df 4, two-sided p ≈ 0.009). 2) Var(D) = σ<sub>X</sub><sup>2</sup> + σ<sub>Y</sub><sup>2</sup> − 2Cov(X, Y) and the covariance is large and positive. 3) Paired — the same users; randomise the order of A and B to avoid a time effect.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 6 · Bài 6.3</span>
<h2>Dữ liệu cặp: kiểm định t cặp</h2>
<p class="lead">Khi hai phép đo đến từ cùng một đơn vị — cùng người dùng trước và sau, cùng bộ dữ liệu với hai thuật toán — phép so sánh phải làm <em>bên trong</em> từng đơn vị. Ghép cặp loại bỏ dao động khổng lồ giữa các đơn vị và có thể biến một hiệu ứng vô hình thành hiệu ứng rõ ràng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận ra thiết kế cặp và giải thích vì sao nó mạnh.</li><li>Chạy kiểm định t cặp như kiểm định t một mẫu trên hiệu số.</li><li>Thấy cái giá của việc phân tích nhầm dữ liệu cặp thành hai mẫu độc lập.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Dữ liệu đi theo cặp (X<sub>i</sub>, Y<sub>i</sub>), i = 1, …, n. Đặt hiệu số D<sub>i</sub> = Y<sub>i</sub> − X<sub>i</sub> có trung bình μ<sub>D</sub>. Câu hỏi “Y có tốt hơn X trung bình không?” trở thành H<sub>0</sub>: μ<sub>D</sub> = 0, một bài toán một mẫu:</p>
<div class="formula"><span class="lbl">Kiểm định t cặp</span>d̄ = trung bình d<sub>i</sub>,  s<sub>d</sub> = độ lệch chuẩn d<sub>i</sub>      T = d̄ / (s<sub>d</sub>/√n) ~ t(n − 1) khi H<sub>0</sub> đúng      KTC: d̄ ± t*·s<sub>d</sub>/√n</div>
<p>Vì sao ghép cặp có lợi: Var(D) = σ<sub>X</sub><sup>2</sup> + σ<sub>Y</sub><sup>2</sup> − 2Cov(X, Y). Khi hai phép đo trên một đơn vị tương quan dương mạnh (bộ dữ liệu dễ thì dễ cho cả hai mô hình), số hạng hiệp phương sai triệt tiêu phần lớn phương sai. Kiểm định hai mẫu độc lập bỏ qua điều này và so chênh lệch với toàn bộ dao động giữa các đơn vị.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — hai mô hình học máy trên 10 bộ dữ liệu chuẩn.</b> Độ chính xác (%) của mô hình X và Y trên cùng 10 bộ dữ liệu:</p>
<p>X: 82,1; 75,4; 90,2; 68,7; 77,9; 85,3; 72,6; 88,0; 79,5; 70,8<br>Y: 83,0; 76,9; 90,5; 70,1; 78,2; 86,8; 73,0; 89,4; 80,9; 71,2</p>
<p>Bước 1: hiệu số d = 0,9; 1,5; 0,3; 1,4; 0,3; 1,5; 0,4; 1,4; 1,4; 0,4. Bước 2: d̄ = <b>0,950</b>, s<sub>d</sub> = 0,5442, SE = 0,1721. Bước 3: t = 0,950/0,1721 = <b>5,521</b>, bậc tự do 9, p = <b>0,00037</b>. Bước 4: KTC 95% cho mức tăng trung bình: <b>(0,561; 1,339)</b> điểm. Y thắng X trên <em>mọi</em> bộ dữ liệu.</p>
<p>Nếu chạy nhầm kiểm định hai mẫu độc lập, bạn được t = 0,288, p = 0,776 — “không khác biệt”! Các bộ dữ liệu chênh nhau tới 20 điểm chính xác, và độ phân tán giữa các bộ dữ liệu đó nhấn chìm mức tăng đều đặn 1 điểm.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

X = np.array([82.1, 75.4, 90.2, 68.7, 77.9, 85.3, 72.6, 88.0, 79.5, 70.8])  # model X accuracy (%)
Y = np.array([83.0, 76.9, 90.5, 70.1, 78.2, 86.8, 73.0, 89.4, 80.9, 71.2])  # model Y, same 10 datasets
d = Y - X
print("differences:", d.round(1))
print(f"mean d = {d.mean():.3f}, sd d = {d.std(ddof=1):.4f}")
paired = stats.ttest_rel(Y, X)
print(f"paired  : t = {paired.statistic:.3f}, p = {paired.pvalue:.6f}")
wrong = stats.ttest_ind(Y, X)
print(f"unpaired: t = {wrong.statistic:.3f}, p = {wrong.pvalue:.4f}   &lt;- WRONG test")
ci = paired.confidence_interval(0.95)
print(f"95% CI for mean difference: ({ci.low:.3f}, {ci.high:.3f})")</code></pre>
<div class="out">differences: [0.9 1.5 0.3 1.4 0.3 1.5 0.4 1.4 1.4 0.4]
mean d = 0.950, sd d = 0.5442
paired  : t = 5.521, p = 0.000370
unpaired: t = 0.288, p = 0.7763   &lt;- WRONG test
95% CI for mean difference: (0.561, 1.339)</div>
<h3>Thiết kế cặp trong ngành máy tính</h3>
<ul>
<li>So sánh hai mô hình hay hai bộ siêu tham số trên cùng các fold cross-validation hoặc cùng bộ dữ liệu chuẩn.</li>
<li>Đo trước/sau trên cùng server, cùng người dùng hoặc cùng truy vấn.</li>
<li>A/B test chéo, mỗi người dùng thấy cả hai phiên bản (thứ tự ngẫu nhiên).</li>
</ul>
<p>Với hiệu số không chuẩn và n nhỏ, dùng kiểm định hạng có dấu Wilcoxon (Bài 10.1). Lưu ý: các fold cross-validation dùng chung dữ liệu huấn luyện nên hiệu số độ chính xác không hoàn toàn độc lập; có các hiệu chỉnh chuyên biệt, nhưng ý tưởng ghép cặp cơ bản vẫn giữ nguyên.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng <code>ttest_ind</code> cho dữ liệu cặp — lỗi phổ biến nhất và đắt nhất.</li><li>Ghép cặp dữ liệu vốn không có cặp tự nhiên (sắp xếp hai nhóm rồi ghép theo thứ hạng).</li><li>Âm thầm bỏ các cặp thiếu mà không báo cáo bỏ bao nhiêu.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Dữ liệu cặp ⇒ phân tích hiệu số d<sub>i</sub> = y<sub>i</sub> − x<sub>i</sub>.</li><li>T = d̄/(s<sub>d</sub>/√n) với n − 1 bậc tự do; <code>stats.ttest_rel</code>.</li><li>Ghép cặp loại bỏ dao động giữa các đơn vị ⇒ lực lớn hơn nhiều.</li><li>Phân tích dữ liệu cặp như hai mẫu độc lập có thể che mất hiệu ứng thật.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/10-4-matched-or-paired-samples" target="_blank" rel="noopener">OpenStax — 10.4 Mẫu ghép cặp</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ttest_rel.html" target="_blank" rel="noopener">SciPy — ttest_rel</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class19-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 19: NHST III (t cặp, chi bình phương, ANOVA)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Hiệu số sau/trước của 5 server (ms): −4, −6, −1, −5, −4. Tính d̄, s<sub>d</sub> và t.</li><li>Vì sao Var(D) nhỏ khi X và Y tương quan mạnh?</li><li>Bạn cho 20 người dùng thử phiên bản A tuần này và B tuần sau. Cặp hay độc lập?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) d̄ = −4, s<sub>d</sub> = √(14/4) = 1,871, t = −4/(1,871/√5) = −4,78 (bậc tự do 4, p hai phía ≈ 0,009). 2) Var(D) = σ<sub>X</sub><sup>2</sup> + σ<sub>Y</sub><sup>2</sup> − 2Cov(X, Y) và hiệp phương sai lớn, dương. 3) Cặp — cùng người dùng; hãy ngẫu nhiên hoá thứ tự A, B để tránh hiệu ứng thời gian.</p></div>`);

const c64 = L('psi221-ts-6-4',
  '6.4 — Two proportions (A/B tests) and comparing two variances|||6.4 — Hai tỉ lệ (A/B test) và so sánh hai phương sai',
  'Kiểm định z hai tỉ lệ với tỉ lệ gộp, khoảng tin cậy cho p₁ − p₂, ví dụ A/B test 15% vs 12%; kiểm định F cho hai phương sai và kiểm định Levene.',
  `<span class="eyebrow">PSI221 · Chapter 6 · Lesson 6.4</span>
<h2>Two proportions (A/B tests) and comparing two variances</h2>
<p class="lead">A/B testing is the daily bread of product teams: two versions, random users, a conversion rate for each. Behind the dashboards sits the two-proportion z-test of this lesson. We also learn how — and how not — to compare two variances.</p>
<h3>🎯 Objectives</h3>
<ul><li>Run the two-proportion z-test with the pooled proportion.</li><li>Build a confidence interval for p<sub>1</sub> − p<sub>2</sub>.</li><li>Use the F-test and Levene's test for equal variances, and know the F-test's weakness.</li></ul>
<h3>📖 Lecture</h3>
<p>Group 1: x<sub>1</sub> successes out of n<sub>1</sub>; group 2: x<sub>2</sub> out of n<sub>2</sub>. Under H<sub>0</sub>: p<sub>1</sub> = p<sub>2</sub> = p both groups share one rate, estimated by the <strong>pooled proportion</strong>.</p>
<div class="formula"><span class="lbl">Two-proportion z-test</span>p̂ = (x<sub>1</sub> + x<sub>2</sub>)/(n<sub>1</sub> + n<sub>2</sub>)      Z = (p̂<sub>1</sub> − p̂<sub>2</sub>) / √( p̂(1 − p̂)(1/n<sub>1</sub> + 1/n<sub>2</sub>) ) ≈ N(0, 1)<br>CI for p<sub>1</sub> − p<sub>2</sub> (unpooled SE):   (p̂<sub>1</sub> − p̂<sub>2</sub>) ± z*·√( p̂<sub>1</sub>(1 − p̂<sub>1</sub>)/n<sub>1</sub> + p̂<sub>2</sub>(1 − p̂<sub>2</sub>)/n<sub>2</sub> )</div>
<p>Conditions: independent groups (random assignment), each count of successes and failures at least about 10. For small counts use Fisher's exact test (Lesson 7.2).</p>
<h3>✍️ Worked example — an A/B test</h3>
<div class="callout"><p><b>Example.</b> Variant B (new checkout button) converted 150 of 1 000 visitors; variant A (old) converted 120 of 1 000. Two-sided test at 5%.</p>
<p>Step 1: p̂<sub>B</sub> = 0.150, p̂<sub>A</sub> = 0.120, pooled p̂ = 270/2000 = 0.135. Step 2: SE<sub>0</sub> = √(0.135·0.865·(2/1000)) = 0.01528. Step 3: z = 0.030/0.01528 = <b>1.963</b>, p = <b>0.0496</b> — just significant. Step 4: 95% CI for p<sub>B</sub> − p<sub>A</sub>: 0.030 ± 1.96·0.01527 = <b>(0.0001, 0.0599)</b>. Interpretation: B probably helps, but the gain could be anywhere from almost 0 to 6 percentage points. A borderline p and an interval touching 0 argue for running the test longer before a costly rollout.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats
from statsmodels.stats.proportion import proportions_ztest

# A/B test: conversions out of visitors
count, nobs = np.array([150, 120]), np.array([1000, 1000])     # variant B, variant A
z, p = proportions_ztest(count, nobs)                          # pooled two-proportion z-test
print(f"pB={count[0]/nobs[0]:.3f} pA={count[1]/nobs[1]:.3f}  z = {z:.3f}, p = {p:.4f}")

# F-test for equal variances (build times from lesson 6.2)
A = np.array([2.31, 2.05, 2.48, 2.20, 2.65, 2.12, 2.39, 2.27, 2.54, 2.18])
B = np.array([2.02, 1.88, 2.15, 1.95, 2.30, 1.79, 2.07, 1.99, 2.21, 1.85, 1.93, 2.10])
F = A.var(ddof=1) / B.var(ddof=1)
dfa, dfb = len(A) - 1, len(B) - 1
p_two = 2 * min(stats.f.sf(F, dfa, dfb), stats.f.cdf(F, dfa, dfb))
print(f"F = {F:.3f} on ({dfa}, {dfb}) df, two-sided p = {p_two:.4f}")
print(f"Levene p = {stats.levene(A, B).pvalue:.4f}")</code></pre>
<div class="out">pB=0.150 pA=0.120  z = 1.963, p = 0.0496
F = 1.613 on (9, 11) df, two-sided p = 0.4489
Levene p = 0.4292</div>
<h3>Comparing two variances</h3>
<div class="formula"><span class="lbl">F-test for equal variances (normal data)</span>H<sub>0</sub>: σ<sub>1</sub><sup>2</sup> = σ<sub>2</sub><sup>2</sup>      F = s<sub>1</sub><sup>2</sup>/s<sub>2</sub><sup>2</sup> ~ F(n<sub>1</sub> − 1, n<sub>2</sub> − 1)      two-sided p = 2·min(P(F ≥ f), P(F ≤ f))</div>
<p>For the build-time data of Lesson 6.2, F = 0.1936<sup>2</sup>/0.1524<sup>2</sup> = 1.613 on (9, 11) df, p = 0.449: no evidence that the pipelines differ in variability. <strong>Warning:</strong> the F-test is extremely sensitive to non-normality — with heavy tails it rejects far too often, i.e. it tests normality as much as variances. <strong>Levene's test</strong> (an ANOVA on absolute deviations from the group centres) is robust and is the practical choice; here it gives p = 0.429.</p>
<p>Why care about variance? Jitter and tail latency matter as much as averages for user experience; a change that keeps the mean but doubles the spread is a regression.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using the unpooled SE in the test statistic or the pooled SE in the CI — the conventions differ for a reason (H<sub>0</sub> vs no H<sub>0</sub>).</li><li>Declaring victory in an A/B test from a single p &lt; 0.05 after peeking daily.</li><li>Trusting the F-test for variances on skewed data.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Two proportions: pooled p̂ in the z statistic; unpooled SE in the CI.</li><li>Report the difference with its CI, not just p.</li><li>F = s<sub>1</sub><sup>2</sup>/s<sub>2</sub><sup>2</sup> ~ F(n<sub>1</sub> − 1, n<sub>2</sub> − 1) for normal data only.</li><li>Prefer Levene's test for real data.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/10-3-comparing-two-independent-population-proportions" target="_blank" rel="noopener">OpenStax — 10.3 Comparing two independent population proportions</a></li><li><a href="https://www.statsmodels.org/stable/generated/statsmodels.stats.proportion.proportions_ztest.html" target="_blank" rel="noopener">statsmodels — proportions_ztest</a></li><li><a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda359.htm" target="_blank" rel="noopener">NIST e-Handbook — F-test for equality of two variances</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.levene.html" target="_blank" rel="noopener">SciPy — levene</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Email campaign: 45/500 clicked with subject line A, 30/500 with B. Compute the pooled p̂ and z.</li><li>s<sub>1</sub> = 4 (n<sub>1</sub> = 16) and s<sub>2</sub> = 2 (n<sub>2</sub> = 21). Compute F and its df.</li><li>Why is the F-test for variances a poor choice for latency data?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) p̂ = 75/1000 = 0.075; SE = √(0.075·0.925·0.004) = 0.01666; z = (0.09 − 0.06)/0.01666 = 1.80 (two-sided p ≈ 0.072). 2) F = 16/4 = 4 on (15, 20) df. 3) Latencies are skewed with heavy tails, which makes the F-test reject too often; use Levene's test or the bootstrap.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 6 · Bài 6.4</span>
<h2>Hai tỉ lệ (A/B test) và so sánh hai phương sai</h2>
<p class="lead">A/B test là “cơm ăn hằng ngày” của đội sản phẩm: hai phiên bản, người dùng ngẫu nhiên, mỗi bên một tỉ lệ chuyển đổi. Đằng sau các dashboard là kiểm định z hai tỉ lệ của bài này. Ta cũng học cách — và cách không nên — so sánh hai phương sai.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Chạy kiểm định z hai tỉ lệ với tỉ lệ gộp.</li><li>Dựng khoảng tin cậy cho p<sub>1</sub> − p<sub>2</sub>.</li><li>Dùng kiểm định F và kiểm định Levene cho phương sai bằng nhau, biết điểm yếu của kiểm định F.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Nhóm 1: x<sub>1</sub> thành công trên n<sub>1</sub>; nhóm 2: x<sub>2</sub> trên n<sub>2</sub>. Khi H<sub>0</sub>: p<sub>1</sub> = p<sub>2</sub> = p, hai nhóm có chung một tỉ lệ, ước lượng bằng <strong>tỉ lệ gộp</strong>.</p>
<div class="formula"><span class="lbl">Kiểm định z hai tỉ lệ</span>p̂ = (x<sub>1</sub> + x<sub>2</sub>)/(n<sub>1</sub> + n<sub>2</sub>)      Z = (p̂<sub>1</sub> − p̂<sub>2</sub>) / √( p̂(1 − p̂)(1/n<sub>1</sub> + 1/n<sub>2</sub>) ) ≈ N(0, 1)<br>KTC cho p<sub>1</sub> − p<sub>2</sub> (SE không gộp):   (p̂<sub>1</sub> − p̂<sub>2</sub>) ± z*·√( p̂<sub>1</sub>(1 − p̂<sub>1</sub>)/n<sub>1</sub> + p̂<sub>2</sub>(1 − p̂<sub>2</sub>)/n<sub>2</sub> )</div>
<p>Điều kiện: hai nhóm độc lập (phân nhóm ngẫu nhiên), mỗi số đếm thành công và thất bại ít nhất khoảng 10. Số đếm nhỏ thì dùng kiểm định chính xác Fisher (Bài 7.2).</p>
<h3>✍️ Ví dụ giải từng bước — một A/B test</h3>
<div class="callout"><p><b>Ví dụ.</b> Phiên bản B (nút thanh toán mới) chuyển đổi 150 trên 1 000 khách; phiên bản A (cũ) chuyển đổi 120 trên 1 000. Kiểm định hai phía mức 5%.</p>
<p>Bước 1: p̂<sub>B</sub> = 0,150, p̂<sub>A</sub> = 0,120, tỉ lệ gộp p̂ = 270/2000 = 0,135. Bước 2: SE<sub>0</sub> = √(0,135·0,865·(2/1000)) = 0,01528. Bước 3: z = 0,030/0,01528 = <b>1,963</b>, p = <b>0,0496</b> — vừa đủ có ý nghĩa. Bước 4: KTC 95% cho p<sub>B</sub> − p<sub>A</sub>: 0,030 ± 1,96·0,01527 = <b>(0,0001; 0,0599)</b>. Diễn giải: B có lẽ có ích, nhưng mức tăng có thể ở bất kỳ đâu từ gần 0 tới 6 điểm phần trăm. p ở ranh giới và khoảng chạm 0 là lý do nên chạy test lâu hơn trước khi triển khai tốn kém.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats
from statsmodels.stats.proportion import proportions_ztest

# A/B test: conversions out of visitors
count, nobs = np.array([150, 120]), np.array([1000, 1000])     # variant B, variant A
z, p = proportions_ztest(count, nobs)                          # pooled two-proportion z-test
print(f"pB={count[0]/nobs[0]:.3f} pA={count[1]/nobs[1]:.3f}  z = {z:.3f}, p = {p:.4f}")

# F-test for equal variances (build times from lesson 6.2)
A = np.array([2.31, 2.05, 2.48, 2.20, 2.65, 2.12, 2.39, 2.27, 2.54, 2.18])
B = np.array([2.02, 1.88, 2.15, 1.95, 2.30, 1.79, 2.07, 1.99, 2.21, 1.85, 1.93, 2.10])
F = A.var(ddof=1) / B.var(ddof=1)
dfa, dfb = len(A) - 1, len(B) - 1
p_two = 2 * min(stats.f.sf(F, dfa, dfb), stats.f.cdf(F, dfa, dfb))
print(f"F = {F:.3f} on ({dfa}, {dfb}) df, two-sided p = {p_two:.4f}")
print(f"Levene p = {stats.levene(A, B).pvalue:.4f}")</code></pre>
<div class="out">pB=0.150 pA=0.120  z = 1.963, p = 0.0496
F = 1.613 on (9, 11) df, two-sided p = 0.4489
Levene p = 0.4292</div>
<h3>So sánh hai phương sai</h3>
<div class="formula"><span class="lbl">Kiểm định F cho phương sai bằng nhau (dữ liệu chuẩn)</span>H<sub>0</sub>: σ<sub>1</sub><sup>2</sup> = σ<sub>2</sub><sup>2</sup>      F = s<sub>1</sub><sup>2</sup>/s<sub>2</sub><sup>2</sup> ~ F(n<sub>1</sub> − 1, n<sub>2</sub> − 1)      p hai phía = 2·min(P(F ≥ f), P(F ≤ f))</div>
<p>Với dữ liệu thời gian build ở Bài 6.2, F = 0,1936<sup>2</sup>/0,1524<sup>2</sup> = 1,613 với (9, 11) bậc tự do, p = 0,449: không có bằng chứng hai pipeline khác nhau về độ dao động. <strong>Cảnh báo:</strong> kiểm định F cực kỳ nhạy với dữ liệu không chuẩn — đuôi nặng làm nó bác bỏ quá thường xuyên, tức là nó kiểm định tính chuẩn chẳng kém kiểm định phương sai. <strong>Kiểm định Levene</strong> (ANOVA trên độ lệch tuyệt đối so với tâm nhóm) bền vững và là lựa chọn thực tế; ở đây cho p = 0,429.</p>
<p>Vì sao quan tâm phương sai? Jitter và độ trễ đuôi quan trọng với trải nghiệm người dùng không kém trung bình; một thay đổi giữ nguyên trung bình nhưng tăng gấp đôi độ phân tán là một bước thụt lùi.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng SE không gộp trong thống kê kiểm định hoặc SE gộp trong KTC — hai quy ước khác nhau có lý do (có H<sub>0</sub> và không có H<sub>0</sub>).</li><li>Tuyên bố thắng A/B test từ một lần p &lt; 0,05 sau khi nhìn trộm mỗi ngày.</li><li>Tin kiểm định F cho phương sai trên dữ liệu lệch.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Hai tỉ lệ: p̂ gộp trong thống kê z; SE không gộp trong KTC.</li><li>Báo cáo chênh lệch kèm KTC, không chỉ p.</li><li>F = s<sub>1</sub><sup>2</sup>/s<sub>2</sub><sup>2</sup> ~ F(n<sub>1</sub> − 1, n<sub>2</sub> − 1) chỉ với dữ liệu chuẩn.</li><li>Với dữ liệu thật nên dùng kiểm định Levene.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/10-3-comparing-two-independent-population-proportions" target="_blank" rel="noopener">OpenStax — 10.3 So sánh hai tỉ lệ tổng thể độc lập</a></li><li><a href="https://www.statsmodels.org/stable/generated/statsmodels.stats.proportion.proportions_ztest.html" target="_blank" rel="noopener">statsmodels — proportions_ztest</a></li><li><a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda359.htm" target="_blank" rel="noopener">NIST e-Handbook — Kiểm định F cho hai phương sai bằng nhau</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.levene.html" target="_blank" rel="noopener">SciPy — levene</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Chiến dịch email: 45/500 người nhấp với tiêu đề A, 30/500 với tiêu đề B. Tính p̂ gộp và z.</li><li>s<sub>1</sub> = 4 (n<sub>1</sub> = 16) và s<sub>2</sub> = 2 (n<sub>2</sub> = 21). Tính F và bậc tự do.</li><li>Vì sao kiểm định F cho phương sai là lựa chọn kém với dữ liệu độ trễ?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) p̂ = 75/1000 = 0,075; SE = √(0,075·0,925·0,004) = 0,01666; z = (0,09 − 0,06)/0,01666 = 1,80 (p hai phía ≈ 0,072). 2) F = 16/4 = 4 với (15, 20) bậc tự do. 3) Độ trễ lệch và đuôi nặng, làm kiểm định F bác bỏ quá thường xuyên; dùng Levene hoặc bootstrap.</p></div>`);

const q6 = QZ(6, 'Quiz — Chapter 6: One- and two-sample tests|||Quiz — Chương 6: Kiểm định một và hai mẫu', 'Kiểm định chương 6: t một mẫu, kiểm định tỉ lệ, t hai mẫu gộp/Welch, t cặp, hai tỉ lệ, F và Levene.', [
  Q('q1', 'One-sample t with n = 8 uses how many degrees of freedom?|||Kiểm định t một mẫu với n = 8 dùng bao nhiêu bậc tự do?',
    ['8|||8', '7|||7', '6|||6', '16|||16'], 1,
    'df = n − 1.|||Bậc tự do = n − 1.'),
  Q('q2', '9 defects in 50, H₀: p = 0.10. Why prefer the exact binomial test?|||9 lỗi trên 50, H₀: p = 0,10. Vì sao nên dùng kiểm định nhị thức chính xác?',
    ['n is too large|||n quá lớn', 'np₀ = 5 < 10, so the normal approximation is poor|||np₀ = 5 < 10 nên xấp xỉ chuẩn kém', 'the data are continuous|||dữ liệu liên tục', 'it always gives smaller p-values|||nó luôn cho p nhỏ hơn'], 1,
    'Here the approximation gave p = 0.030 versus the exact 0.058.|||Ở đây xấp xỉ cho p = 0,030 so với 0,058 chính xác.'),
  Q('q3', 'The z-test for one proportion uses which standard error?|||Kiểm định z cho một tỉ lệ dùng sai số chuẩn nào?',
    ['√(p̂(1 − p̂)/n)|||√(p̂(1 − p̂)/n)', '√(p₀(1 − p₀)/n)|||√(p₀(1 − p₀)/n)', 's/√n|||s/√n', '√(p₀/n)|||√(p₀/n)'], 1,
    'The null distribution is computed assuming p = p₀.|||Phân phối dưới H₀ được tính khi giả sử p = p₀.'),
  Q('q4', 'Welch’s t-test differs from the pooled test because it|||Kiểm định t Welch khác kiểm định gộp vì nó',
    ['assumes equal variances|||giả định phương sai bằng nhau', 'does not assume equal variances|||không giả định phương sai bằng nhau', 'requires paired data|||cần dữ liệu cặp', 'uses the median|||dùng trung vị'], 1,
    'It uses s₁²/n₁ + s₂²/n₂ and Satterthwaite df.|||Nó dùng s₁²/n₁ + s₂²/n₂ và bậc tự do Satterthwaite.'),
  Q('q5', 'In SciPy, ttest_ind(A, B) without arguments runs|||Trong SciPy, ttest_ind(A, B) không truyền tham số sẽ chạy',
    ['Welch’s test|||kiểm định Welch', 'the pooled (equal-variance) test|||kiểm định gộp (phương sai bằng nhau)', 'a paired test|||kiểm định cặp', 'Mann–Whitney|||Mann–Whitney'], 1,
    'Pass equal_var=False for Welch.|||Truyền equal_var=False để có Welch.'),
  Q('q6', 'Two models evaluated on the same 10 datasets should be compared with|||Hai mô hình đánh giá trên cùng 10 bộ dữ liệu nên được so bằng',
    ['a two-sample independent t-test|||kiểm định t hai mẫu độc lập', 'a paired t-test on the differences|||kiểm định t cặp trên hiệu số', 'a χ² test|||kiểm định χ²', 'an F-test|||kiểm định F'], 1,
    'Same datasets ⇒ paired design.|||Cùng bộ dữ liệu ⇒ thiết kế cặp.'),
  Q('q7', 'Differences d have mean 0.95, SD 0.544, n = 10. The paired t is about|||Hiệu số d có trung bình 0,95, SD 0,544, n = 10. t cặp khoảng',
    ['1.75|||1,75', '5.52|||5,52', '0.29|||0,29', '17.5|||17,5'], 1,
    '0.95/(0.544/√10) = 5.52.|||0,95/(0,544/√10) = 5,52.'),
  Q('q8', 'In a two-proportion z-test, the standard error under H₀ uses|||Trong kiểm định z hai tỉ lệ, sai số chuẩn khi H₀ đúng dùng',
    ['the pooled proportion|||tỉ lệ gộp', 'only group 1|||chỉ nhóm 1', 'the larger proportion|||tỉ lệ lớn hơn', '0.5|||0,5'], 0,
    'Under H₀ both groups share one p, estimated by pooling.|||Khi H₀ đúng hai nhóm chung một p, ước lượng bằng cách gộp.'),
  Q('q9', '150/1000 vs 120/1000 conversions give z ≈ 1.96. The two-sided p-value is about|||150/1000 so với 120/1000 chuyển đổi cho z ≈ 1,96. p hai phía khoảng',
    ['0.025|||0,025', '0.05|||0,05', '0.10|||0,10', '0.5|||0,5'], 1,
    '2·P(Z ≥ 1.963) = 0.0496.|||2·P(Z ≥ 1,963) = 0,0496.'),
  Q('q10', 'Why is Levene’s test usually preferred over the F-test for equal variances?|||Vì sao kiểm định Levene thường được ưu tiên hơn kiểm định F cho phương sai bằng nhau?',
    ['It is always more powerful|||Nó luôn mạnh hơn', 'The F-test is very sensitive to non-normality|||Kiểm định F rất nhạy với dữ liệu không chuẩn', 'It needs fewer observations|||Nó cần ít quan sát hơn', 'The F-test has no p-value|||Kiểm định F không có p-value'], 1,
    'Heavy tails make the F-test reject too often.|||Đuôi nặng làm kiểm định F bác bỏ quá thường xuyên.'),
]);

const ch6 = {
  title: 'Chapter 6 — Tests for one and two samples|||Chương 6 — Kiểm định một mẫu và hai mẫu',
  description: 't một mẫu, kiểm định tỉ lệ chính xác và xấp xỉ, t hai mẫu gộp và Welch, t cặp, kiểm định hai tỉ lệ cho A/B test, kiểm định F và Levene (OpenIntro Ch. 6–7 · OpenStax Ch. 9–10, 13.4 · NIST 7.2–7.3).',
  lessons: [c61, c62, c63, c64, q6],
};


// ───────────────────────────── Chương 7 — Dữ liệu phân loại & kiểm định bội ─────────────────────────────
const c71 = L('psi221-ts-7-1',
  '7.1 — Chi-square goodness-of-fit test|||7.1 — Kiểm định chi bình phương về sự phù hợp',
  'Thống kê Pearson ∑(O − E)²/E, bậc tự do k − 1 − số tham số ước lượng, điều kiện E ≥ 5; ví dụ xúc xắc 120 lần và kiểm tra bộ sinh số ngẫu nhiên.',
  `<span class="eyebrow">PSI221 · Chapter 7 · Lesson 7.1</span>
<h2>Chi-square goodness-of-fit test</h2>
<p class="lead">Are the six faces of a die equally likely? Does your random-number generator produce uniform digits? Do bug severities follow last year's mix? Whenever data are <strong>counts in categories</strong> and a model predicts the proportions, the chi-square goodness-of-fit test answers.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute expected counts and Pearson's χ<sup>2</sup> statistic.</li><li>Choose the correct degrees of freedom, including when parameters are estimated.</li><li>Check the expected-count condition and interpret the result.</li></ul>
<h3>📖 Lecture</h3>
<p>n observations fall into k categories with observed counts O<sub>1</sub>, …, O<sub>k</sub>. H<sub>0</sub> specifies the category probabilities p<sub>1</sub>, …, p<sub>k</sub>, giving expected counts E<sub>i</sub> = n·p<sub>i</sub>.</p>
<div class="formula"><span class="lbl">Pearson's chi-square statistic</span>χ<sup>2</sup> = ∑<sub>i=1..k</sub> (O<sub>i</sub> − E<sub>i</sub>)<sup>2</sup> / E<sub>i</sub>   ≈ χ<sup>2</sup>(k − 1 − m) under H<sub>0</sub>   (m = number of parameters estimated from the data)<br>Reject H<sub>0</sub> for large values (always a right-tail test).</div>
<p>Each term compares a deviation with what Poisson-like counting noise would produce (the variance of a count is about its expected value). Why k − 1? The counts must add up to n, so only k − 1 of them are free. Estimating m parameters (e.g. a Poisson mean λ from the same data before computing E<sub>i</sub>) costs another m degrees of freedom. The χ<sup>2</sup> statistic is in fact a large-sample approximation of the likelihood-ratio statistic of Lesson 5.4.</p>
<p><strong>Condition:</strong> all expected counts E<sub>i</sub> ≥ 5 (a common rule; some texts allow a few between 1 and 5). Merge sparse categories otherwise.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — is the die fair?</b> 120 rolls gave counts 15, 22, 18, 25, 17, 23 for faces 1–6.</p>
<p>Step 1: H<sub>0</sub>: every face has p = 1/6 ⇒ E<sub>i</sub> = 20 for all faces (≥ 5 ✓). Step 2: contributions (O − E)<sup>2</sup>/E = 1.25, 0.20, 0.20, 1.25, 0.45, 0.45. Step 3: χ<sup>2</sup> = <b>3.80</b>, df = 6 − 1 = 5. Step 4: p = P(χ<sup>2</sup>(5) ≥ 3.80) = <b>0.579</b>; the 5% critical value is 11.07. Conclusion: the counts are entirely consistent with a fair die. Note that the fluctuations (15 to 25) <em>look</em> large — the test calibrates that intuition.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

observed = np.array([15, 22, 18, 25, 17, 23])        # 120 rolls of a die
expected = np.full(6, observed.sum() / 6)            # 20 each if the die is fair
chi2, p = stats.chisquare(observed, expected)
print("contributions:", ((observed - expected)**2 / expected).round(3))
print(f"chi2 = {chi2:.3f}, df = 5, p = {p:.4f}")
print(f"critical value at 5%: {stats.chi2.ppf(0.95, 5):.3f}")</code></pre>
<div class="out">contributions: [1.25 0.2  0.2  1.25 0.45 0.45]
chi2 = 3.800, df = 5, p = 0.5786
critical value at 5%: 11.070</div>
<p><strong>With estimated parameters.</strong> To test whether daily bug counts follow <em>some</em> Poisson distribution, first estimate λ̂ = x̄, compute E<sub>i</sub> = n·P(X = i; λ̂) for categories 0, 1, 2, …, “≥ 6” (merged so that E<sub>i</sub> ≥ 5), and use df = k − 1 − 1. Using k − 1 would make the test too lenient.</p>
<p><strong>CS uses.</strong> Testing random-number generators (the classic χ<sup>2</sup> test on digit frequencies), checking that a hash function spreads keys evenly over buckets, comparing the class mix of a training set with production traffic (data drift).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Applying the test to percentages or means instead of raw counts — χ<sup>2</sup> needs counts.</li><li>Ignoring small expected counts.</li><li>Forgetting to subtract estimated parameters from the df.</li><li>Concluding “the die is fair” from a large p — the data are merely consistent with fairness.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>χ<sup>2</sup> = ∑(O − E)<sup>2</sup>/E with E = n·p<sub>0</sub>.</li><li>df = k − 1 − (number of estimated parameters).</li><li>Right-tail test; need E<sub>i</sub> ≥ 5.</li><li>Uses: fairness, RNG and hash testing, data drift.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/11-2-goodness-of-fit-test" target="_blank" rel="noopener">OpenStax — 11.2 Goodness-of-fit test</a></li><li><a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda35f.htm" target="_blank" rel="noopener">NIST e-Handbook — Chi-square goodness-of-fit test</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.chisquare.html" target="_blank" rel="noopener">SciPy — chisquare</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A traffic split should be 50/30/20 across three servers. Out of 200 requests the counts are 112, 52, 36. Compute χ<sup>2</sup> and df.</li><li>You fit a normal distribution (estimating μ and σ) and group the data into 8 bins. What is the df?</li><li>Why is the χ<sup>2</sup> GOF test always right-tailed?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) E = 100, 60, 40; χ<sup>2</sup> = 1.44 + 1.067 + 0.40 = 2.907, df = 2 (p ≈ 0.23). 2) 8 − 1 − 2 = 5. 3) Only large deviations from E count as evidence against H<sub>0</sub>; a tiny χ<sup>2</sup> means the data fit (suspiciously) well.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 7 · Bài 7.1</span>
<h2>Kiểm định chi bình phương về sự phù hợp</h2>
<p class="lead">Sáu mặt xúc xắc có đồng khả năng không? Bộ sinh số ngẫu nhiên của bạn có cho các chữ số phân phối đều? Mức độ nghiêm trọng của lỗi có theo cơ cấu năm ngoái? Khi dữ liệu là <strong>số đếm theo loại</strong> và mô hình dự đoán các tỉ lệ, kiểm định phù hợp chi bình phương trả lời.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính số đếm kỳ vọng và thống kê χ<sup>2</sup> của Pearson.</li><li>Chọn đúng bậc tự do, kể cả khi có tham số được ước lượng.</li><li>Kiểm tra điều kiện số đếm kỳ vọng và diễn giải kết quả.</li></ul>
<h3>📖 Bài giảng</h3>
<p>n quan sát rơi vào k loại với số đếm quan sát O<sub>1</sub>, …, O<sub>k</sub>. H<sub>0</sub> cho các xác suất p<sub>1</sub>, …, p<sub>k</sub>, suy ra số đếm kỳ vọng E<sub>i</sub> = n·p<sub>i</sub>.</p>
<div class="formula"><span class="lbl">Thống kê chi bình phương Pearson</span>χ<sup>2</sup> = ∑<sub>i=1..k</sub> (O<sub>i</sub> − E<sub>i</sub>)<sup>2</sup> / E<sub>i</sub>   ≈ χ<sup>2</sup>(k − 1 − m) khi H<sub>0</sub> đúng   (m = số tham số ước lượng từ dữ liệu)<br>Bác bỏ H<sub>0</sub> khi giá trị lớn (luôn là kiểm định đuôi phải).</div>
<p>Mỗi số hạng so một độ lệch với mức nhiễu đếm kiểu Poisson (phương sai của một số đếm xấp xỉ giá trị kỳ vọng của nó). Vì sao k − 1? Các số đếm phải cộng lại bằng n, nên chỉ k − 1 cái là tự do. Ước lượng m tham số (vd trung bình Poisson λ từ chính dữ liệu trước khi tính E<sub>i</sub>) mất thêm m bậc tự do. Thống kê χ<sup>2</sup> thực ra là xấp xỉ mẫu lớn của thống kê tỉ số hợp lý ở Bài 5.4.</p>
<p><strong>Điều kiện:</strong> mọi số đếm kỳ vọng E<sub>i</sub> ≥ 5 (quy tắc phổ biến; vài sách cho phép một ít ô từ 1 đến 5). Nếu không thì gộp các loại thưa.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — xúc xắc có cân đối?</b> 120 lần gieo cho số đếm 15, 22, 18, 25, 17, 23 cho các mặt 1–6.</p>
<p>Bước 1: H<sub>0</sub>: mọi mặt có p = 1/6 ⇒ E<sub>i</sub> = 20 cho mọi mặt (≥ 5 ✓). Bước 2: đóng góp (O − E)<sup>2</sup>/E = 1,25; 0,20; 0,20; 1,25; 0,45; 0,45. Bước 3: χ<sup>2</sup> = <b>3,80</b>, bậc tự do = 6 − 1 = 5. Bước 4: p = P(χ<sup>2</sup>(5) ≥ 3,80) = <b>0,579</b>; giá trị tới hạn 5% là 11,07. Kết luận: số đếm hoàn toàn phù hợp với xúc xắc cân đối. Để ý dao động (15 tới 25) <em>trông</em> có vẻ lớn — kiểm định hiệu chỉnh trực giác đó.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

observed = np.array([15, 22, 18, 25, 17, 23])        # 120 rolls of a die
expected = np.full(6, observed.sum() / 6)            # 20 each if the die is fair
chi2, p = stats.chisquare(observed, expected)
print("contributions:", ((observed - expected)**2 / expected).round(3))
print(f"chi2 = {chi2:.3f}, df = 5, p = {p:.4f}")
print(f"critical value at 5%: {stats.chi2.ppf(0.95, 5):.3f}")</code></pre>
<div class="out">contributions: [1.25 0.2  0.2  1.25 0.45 0.45]
chi2 = 3.800, df = 5, p = 0.5786
critical value at 5%: 11.070</div>
<p><strong>Khi có tham số ước lượng.</strong> Muốn kiểm định số lỗi mỗi ngày có theo <em>một</em> phân phối Poisson nào đó, trước hết ước lượng λ̂ = x̄, tính E<sub>i</sub> = n·P(X = i; λ̂) cho các loại 0, 1, 2, …, “≥ 6” (gộp sao cho E<sub>i</sub> ≥ 5), và dùng bậc tự do k − 1 − 1. Dùng k − 1 sẽ làm kiểm định quá dễ dãi.</p>
<p><strong>Ứng dụng CNTT.</strong> Kiểm tra bộ sinh số ngẫu nhiên (kiểm định χ<sup>2</sup> kinh điển trên tần suất chữ số), kiểm tra hàm băm có rải khoá đều vào các bucket, so cơ cấu lớp của tập huấn luyện với lưu lượng thực tế (data drift).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Áp kiểm định cho phần trăm hay trung bình thay vì số đếm thô — χ<sup>2</sup> cần số đếm.</li><li>Bỏ qua số đếm kỳ vọng nhỏ.</li><li>Quên trừ số tham số ước lượng khỏi bậc tự do.</li><li>Kết luận “xúc xắc cân đối” từ p lớn — dữ liệu chỉ phù hợp với giả thuyết cân đối.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>χ<sup>2</sup> = ∑(O − E)<sup>2</sup>/E với E = n·p<sub>0</sub>.</li><li>Bậc tự do = k − 1 − (số tham số ước lượng).</li><li>Kiểm định đuôi phải; cần E<sub>i</sub> ≥ 5.</li><li>Ứng dụng: tính cân đối, kiểm tra RNG và hàm băm, data drift.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/11-2-goodness-of-fit-test" target="_blank" rel="noopener">OpenStax — 11.2 Kiểm định sự phù hợp</a></li><li><a href="https://www.itl.nist.gov/div898/handbook/eda/section3/eda35f.htm" target="_blank" rel="noopener">NIST e-Handbook — Kiểm định phù hợp chi bình phương</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.chisquare.html" target="_blank" rel="noopener">SciPy — chisquare</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Phân luồng lưu lượng phải là 50/30/20 cho ba server. Trên 200 request số đếm là 112, 52, 36. Tính χ<sup>2</sup> và bậc tự do.</li><li>Bạn khớp phân phối chuẩn (ước lượng μ và σ) và chia dữ liệu thành 8 nhóm. Bậc tự do là bao nhiêu?</li><li>Vì sao kiểm định phù hợp χ<sup>2</sup> luôn là đuôi phải?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) E = 100, 60, 40; χ<sup>2</sup> = 1,44 + 1,067 + 0,40 = 2,907, bậc tự do 2 (p ≈ 0,23). 2) 8 − 1 − 2 = 5. 3) Chỉ độ lệch lớn khỏi E mới là bằng chứng chống H<sub>0</sub>; χ<sup>2</sup> rất nhỏ nghĩa là dữ liệu khớp (tốt tới mức đáng ngờ).</p></div>`);

const c72 = L('psi221-ts-7-2',
  '7.2 — Contingency tables: tests of independence and homogeneity|||7.2 — Bảng ngẫu nhiên: kiểm định độc lập và đồng nhất',
  'Bảng r × c, số đếm kỳ vọng hàng × cột / n, bậc tự do (r − 1)(c − 1), Cramér’s V; ví dụ thiết bị × chuyển đổi; kiểm định chính xác Fisher cho bảng 2 × 2 nhỏ.',
  `<span class="eyebrow">PSI221 · Chapter 7 · Lesson 7.2</span>
<h2>Contingency tables: tests of independence and homogeneity</h2>
<p class="lead">Does conversion depend on the device? Is the bug type related to the module? When two categorical variables are cross-tabulated, the chi-square test of independence asks whether the pattern in the table could be just noise.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute expected counts for an r × c table under independence.</li><li>Run the χ<sup>2</sup> test of independence / homogeneity with the right df.</li><li>Measure the strength of association (Cramér's V) and use Fisher's exact test for small 2 × 2 tables.</li></ul>
<h3>📖 Lecture</h3>
<p>A contingency table counts n units by row variable (r levels) and column variable (c levels). Under H<sub>0</sub>: <em>the two variables are independent</em>, P(row i and column j) = P(row i)·P(column j), so</p>
<div class="formula"><span class="lbl">Test of independence</span>E<sub>ij</sub> = (row total<sub>i</sub> × column total<sub>j</sub>) / n      χ<sup>2</sup> = ∑<sub>i,j</sub> (O<sub>ij</sub> − E<sub>ij</sub>)<sup>2</sup>/E<sub>ij</sub>   ≈ χ<sup>2</sup>((r − 1)(c − 1))<br>Strength: Cramér's V = √( χ<sup>2</sup> / (n·(min(r, c) − 1)) ),  0 ≤ V ≤ 1</div>
<p>The df (r − 1)(c − 1) follow the rule of Lesson 7.1: rc cells, minus 1 for the total, minus (r − 1) + (c − 1) estimated margin probabilities. The <strong>test of homogeneity</strong> (“do several populations have the same distribution over the categories?”) uses exactly the same computation; only the sampling design and the wording differ — e.g. we sampled fixed numbers of mobile, desktop and tablet visitors and compare their conversion distributions.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — device and conversion.</b> 2 000 visits:</p>
<table><tr><th></th><th>converted</th><th>not converted</th><th>total</th></tr>
<tr><td>mobile</td><td>120</td><td>880</td><td>1000</td></tr>
<tr><td>desktop</td><td>90</td><td>510</td><td>600</td></tr>
<tr><td>tablet</td><td>30</td><td>370</td><td>400</td></tr>
<tr><td>total</td><td>240</td><td>1760</td><td>2000</td></tr></table>
<p>Step 1: overall conversion 240/2000 = 12%. Expected converted: mobile 1000·0.12 = 120, desktop 72, tablet 48 (all ≥ 5). Step 2: χ<sup>2</sup> = <b>12.78</b>, df = (3 − 1)(2 − 1) = 2, p = <b>0.0017</b>. Step 3: rates 12% / 15% / 7.5%: desktop converts best, tablet worst. Step 4: Cramér's V = 0.080 — the association is real but weak. Statistical significance is not the same as a large effect.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

#                  converted  not converted
table = np.array([[120, 880],     # mobile
                  [ 90, 510],     # desktop
                  [ 30, 370]])    # tablet
chi2, p, dof, expected = stats.chi2_contingency(table)
print("expected counts:\\n", expected.round(1))
print(f"chi2 = {chi2:.3f}, df = {dof}, p = {p:.4f}")
n = table.sum()
V = np.sqrt(chi2 / (n * (min(table.shape) - 1)))
print(f"Cramer's V = {V:.3f}")
# small 2x2 table -&gt; Fisher's exact test
small = np.array([[7, 1], [2, 6]])
res = stats.fisher_exact(small)
print(f"Fisher exact: odds ratio = {res.statistic:.2f}, p = {res.pvalue:.4f}")</code></pre>
<div class="out">expected counts:
 [[120. 880.]
 [ 72. 528.]
 [ 48. 352.]]
chi2 = 12.784, df = 2, p = 0.0017
Cramer's V = 0.080
Fisher exact: odds ratio = 21.00, p = 0.0406</div>
<p><strong>Small tables: Fisher's exact test.</strong> For a 2 × 2 table with small expected counts (above, a pilot with 16 users: 7 of 8 with the new onboarding finished the tutorial vs 2 of 8 without), compute the exact probability of tables at least as extreme, given the margins (hypergeometric distribution, IPY111 Ch. 5). Here p = 0.041 and the sample odds ratio is 21.</p>
<p><strong>Follow-up.</strong> A significant χ<sup>2</sup> says “somewhere the table departs from independence”. To find where, look at the standardised residuals (O − E)/√E: values beyond about ±2 mark the cells that drive the result.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Counting the same user in several cells (observations must be independent and each unit counted once).</li><li>Using row percentages instead of counts in the test.</li><li>Reading “p = 0.0017” as a strong association — check V or the differences in rates.</li><li>Interpreting association as causation: desktop users may differ in intent, not because of the device.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>E<sub>ij</sub> = row total × column total / n.</li><li>χ<sup>2</sup> with (r − 1)(c − 1) df; same mechanics for independence and homogeneity.</li><li>Cramér's V measures strength; standardised residuals locate the cells.</li><li>Small 2 × 2 tables ⇒ Fisher's exact test.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/11-3-test-of-independence" target="_blank" rel="noopener">OpenStax — 11.3 Test of independence</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/11-4-test-for-homogeneity" target="_blank" rel="noopener">OpenStax — 11.4 Test for homogeneity</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.chi2_contingency.html" target="_blank" rel="noopener">SciPy — chi2_contingency</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.fisher_exact.html" target="_blank" rel="noopener">SciPy — fisher_exact</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A 4 × 3 table: what is the df?</li><li>Row total 300, column total 150, n = 1 000. Find E for that cell.</li><li>In the device example, compute the standardised residual for tablet/converted.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (4 − 1)(3 − 1) = 6. 2) 300·150/1000 = 45. 3) (30 − 48)/√48 = −2.60 — tablets convert noticeably less than independence predicts.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 7 · Bài 7.2</span>
<h2>Bảng ngẫu nhiên: kiểm định độc lập và đồng nhất</h2>
<p class="lead">Chuyển đổi có phụ thuộc thiết bị? Loại lỗi có liên quan tới module? Khi hai biến phân loại được lập bảng chéo, kiểm định chi bình phương về tính độc lập hỏi xem mẫu hình trong bảng có thể chỉ là nhiễu hay không.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính số đếm kỳ vọng cho bảng r × c khi hai biến độc lập.</li><li>Chạy kiểm định χ<sup>2</sup> độc lập / đồng nhất với đúng bậc tự do.</li><li>Đo độ mạnh liên hệ (Cramér's V) và dùng kiểm định chính xác Fisher cho bảng 2 × 2 nhỏ.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Bảng ngẫu nhiên (contingency table) đếm n đơn vị theo biến hàng (r mức) và biến cột (c mức). Khi H<sub>0</sub>: <em>hai biến độc lập</em>, P(hàng i và cột j) = P(hàng i)·P(cột j), nên</p>
<div class="formula"><span class="lbl">Kiểm định độc lập</span>E<sub>ij</sub> = (tổng hàng<sub>i</sub> × tổng cột<sub>j</sub>) / n      χ<sup>2</sup> = ∑<sub>i,j</sub> (O<sub>ij</sub> − E<sub>ij</sub>)<sup>2</sup>/E<sub>ij</sub>   ≈ χ<sup>2</sup>((r − 1)(c − 1))<br>Độ mạnh: Cramér's V = √( χ<sup>2</sup> / (n·(min(r, c) − 1)) ),  0 ≤ V ≤ 1</div>
<p>Bậc tự do (r − 1)(c − 1) theo đúng quy tắc Bài 7.1: rc ô, trừ 1 cho tổng, trừ (r − 1) + (c − 1) xác suất biên đã ước lượng. <strong>Kiểm định đồng nhất</strong> (“nhiều tổng thể có cùng phân phối trên các loại không?”) dùng y hệt phép tính; chỉ khác thiết kế lấy mẫu và cách phát biểu — vd ta lấy số lượng cố định khách mobile, desktop, tablet và so phân phối chuyển đổi của họ.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — thiết bị và chuyển đổi.</b> 2 000 lượt truy cập:</p>
<table><tr><th></th><th>chuyển đổi</th><th>không</th><th>tổng</th></tr>
<tr><td>mobile</td><td>120</td><td>880</td><td>1000</td></tr>
<tr><td>desktop</td><td>90</td><td>510</td><td>600</td></tr>
<tr><td>tablet</td><td>30</td><td>370</td><td>400</td></tr>
<tr><td>tổng</td><td>240</td><td>1760</td><td>2000</td></tr></table>
<p>Bước 1: tỉ lệ chuyển đổi chung 240/2000 = 12%. Kỳ vọng chuyển đổi: mobile 1000·0,12 = 120, desktop 72, tablet 48 (đều ≥ 5). Bước 2: χ<sup>2</sup> = <b>12,78</b>, bậc tự do = (3 − 1)(2 − 1) = 2, p = <b>0,0017</b>. Bước 3: tỉ lệ 12% / 15% / 7,5%: desktop chuyển đổi tốt nhất, tablet kém nhất. Bước 4: Cramér's V = 0,080 — liên hệ có thật nhưng yếu. Có ý nghĩa thống kê không đồng nghĩa với hiệu ứng lớn.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

#                  converted  not converted
table = np.array([[120, 880],     # mobile
                  [ 90, 510],     # desktop
                  [ 30, 370]])    # tablet
chi2, p, dof, expected = stats.chi2_contingency(table)
print("expected counts:\\n", expected.round(1))
print(f"chi2 = {chi2:.3f}, df = {dof}, p = {p:.4f}")
n = table.sum()
V = np.sqrt(chi2 / (n * (min(table.shape) - 1)))
print(f"Cramer's V = {V:.3f}")
# small 2x2 table -&gt; Fisher's exact test
small = np.array([[7, 1], [2, 6]])
res = stats.fisher_exact(small)
print(f"Fisher exact: odds ratio = {res.statistic:.2f}, p = {res.pvalue:.4f}")</code></pre>
<div class="out">expected counts:
 [[120. 880.]
 [ 72. 528.]
 [ 48. 352.]]
chi2 = 12.784, df = 2, p = 0.0017
Cramer's V = 0.080
Fisher exact: odds ratio = 21.00, p = 0.0406</div>
<p><strong>Bảng nhỏ: kiểm định chính xác Fisher.</strong> Với bảng 2 × 2 có số đếm kỳ vọng nhỏ (ở trên, một thử nghiệm 16 người dùng: 7/8 người có màn hướng dẫn mới hoàn thành tutorial so với 2/8 người không có), tính xác suất chính xác của các bảng ít nhất cực đoan như vậy khi cố định tổng biên (phân phối siêu bội, IPY111 Ch. 5). Ở đây p = 0,041 và tỉ số odds mẫu là 21.</p>
<p><strong>Phân tích tiếp.</strong> χ<sup>2</sup> có ý nghĩa chỉ nói “ở đâu đó bảng lệch khỏi độc lập”. Muốn biết ở đâu, xem phần dư chuẩn hoá (O − E)/√E: giá trị vượt khoảng ±2 đánh dấu các ô tạo ra kết quả.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đếm cùng một người dùng ở nhiều ô (quan sát phải độc lập và mỗi đơn vị chỉ đếm một lần).</li><li>Dùng phần trăm theo hàng thay vì số đếm trong kiểm định.</li><li>Đọc “p = 0,0017” thành liên hệ mạnh — hãy xem V hoặc chênh lệch tỉ lệ.</li><li>Diễn giải liên hệ thành nhân quả: người dùng desktop có thể khác về ý định mua, không phải do thiết bị.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>E<sub>ij</sub> = tổng hàng × tổng cột / n.</li><li>χ<sup>2</sup> với (r − 1)(c − 1) bậc tự do; cùng cơ chế cho độc lập và đồng nhất.</li><li>Cramér's V đo độ mạnh; phần dư chuẩn hoá chỉ ra ô nào.</li><li>Bảng 2 × 2 nhỏ ⇒ kiểm định chính xác Fisher.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/11-3-test-of-independence" target="_blank" rel="noopener">OpenStax — 11.3 Kiểm định độc lập</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/11-4-test-for-homogeneity" target="_blank" rel="noopener">OpenStax — 11.4 Kiểm định đồng nhất</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.chi2_contingency.html" target="_blank" rel="noopener">SciPy — chi2_contingency</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.fisher_exact.html" target="_blank" rel="noopener">SciPy — fisher_exact</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Bảng 4 × 3: bậc tự do là bao nhiêu?</li><li>Tổng hàng 300, tổng cột 150, n = 1 000. Tìm E của ô đó.</li><li>Trong ví dụ thiết bị, tính phần dư chuẩn hoá cho ô tablet/chuyển đổi.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (4 − 1)(3 − 1) = 6. 2) 300·150/1000 = 45. 3) (30 − 48)/√48 = −2,60 — tablet chuyển đổi thấp hơn hẳn so với dự đoán khi độc lập.</p></div>`);

const c73 = L('psi221-ts-7-3',
  '7.3 — Multiple testing, p-hacking and the false discovery rate|||7.3 — Kiểm định bội, p-hacking và tỉ lệ phát hiện sai',
  'Xác suất ít nhất một dương tính giả khi chạy nhiều kiểm định; FWER với Bonferroni và Holm; FDR với Benjamini–Hochberg; p-hacking và cách phòng tránh.',
  `<span class="eyebrow">PSI221 · Chapter 7 · Lesson 7.3</span>
<h2>Multiple testing, p-hacking and the false discovery rate</h2>
<p class="lead">Test 20 useless features at α = 0.05 and you should expect one “significant” result. Test hundreds of metrics in an A/B dashboard and false discoveries are guaranteed. This lesson shows how to keep error rates honest when many tests are run.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute the probability of at least one false positive among m tests.</li><li>Control the family-wise error rate with Bonferroni and Holm.</li><li>Control the false discovery rate with Benjamini–Hochberg, and recognise p-hacking.</li></ul>
<h3>📖 Lecture</h3>
<p>If m independent true null hypotheses are each tested at level α, P(at least one rejection) = 1 − (1 − α)<sup>m</sup>. For m = 20 and α = 0.05 this is 1 − 0.95<sup>20</sup> = <b>0.64</b>. Two ways to define “error” for a family of tests:</p>
<div class="formula"><span class="lbl">Error rates for m tests</span>FWER = P(at least one false rejection)      FDR = E[ false rejections / total rejections ]  (0 if no rejection)</div>
<p><strong>Bonferroni</strong> (controls FWER): reject H<sub>i</sub> if p<sub>i</sub> ≤ α/m, equivalently adjusted p = min(1, m·p<sub>i</sub>). Simple, valid under any dependence, but conservative.</p>
<p><strong>Holm</strong> (controls FWER, uniformly better than Bonferroni): sort p<sub>(1)</sub> ≤ … ≤ p<sub>(m)</sub>; compare p<sub>(1)</sub> with α/m, p<sub>(2)</sub> with α/(m − 1), …; stop at the first non-rejection.</p>
<p><strong>Benjamini–Hochberg</strong> (controls FDR at level q): find the largest k with p<sub>(k)</sub> ≤ (k/m)·q and reject the k smallest p-values. Much more powerful when many effects are real; standard in genomics, large-scale A/B testing and feature screening.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — 10 metrics in one A/B test.</b> Sorted p-values: 0.001, 0.008, 0.012, 0.030, 0.041, 0.049, 0.110, 0.240, 0.520, 0.810.</p>
<p>Unadjusted: 6 metrics have p &lt; 0.05. Bonferroni: threshold 0.05/10 = 0.005 ⇒ only <b>1</b> survives. Holm: 0.001 ≤ 0.005 ✓, then 0.008 vs 0.05/9 = 0.0056 ✗ ⇒ <b>1</b>. BH at q = 0.05: thresholds (k/10)·0.05 = 0.005, 0.010, 0.015, 0.020, …; p<sub>(3)</sub> = 0.012 ≤ 0.015 but p<sub>(4)</sub> = 0.030 &gt; 0.020, and no later p-value meets its threshold ⇒ <b>3</b> discoveries (expected share of false ones at most 5%).</p></div>
<pre><code class="language-python">import numpy as np
from statsmodels.stats.multitest import multipletests

p = np.array([0.001, 0.008, 0.012, 0.030, 0.041, 0.049, 0.110, 0.240, 0.520, 0.810])
for method in ["bonferroni", "holm", "fdr_bh"]:
    reject, p_adj, _, _ = multipletests(p, alpha=0.05, method=method)
    print(f"{method:10s} rejects {reject.sum()} :", p_adj.round(3))
print("raw p &lt; 0.05 :", (p &lt; 0.05).sum(), "hypotheses")</code></pre>
<div class="out">bonferroni rejects 1 : [0.01 0.08 0.12 0.3  0.41 0.49 1.   1.   1.   1.  ]
holm       rejects 1 : [0.01  0.072 0.096 0.21  0.246 0.246 0.44  0.72  1.    1.   ]
fdr_bh     rejects 3 : [0.01  0.04  0.04  0.075 0.082 0.082 0.157 0.3   0.578 0.81 ]
raw p &lt; 0.05 : 6 hypotheses</div>
<h3>p-hacking and the garden of forking paths</h3>
<p><strong>p-hacking</strong> means trying analyses until one gives p &lt; 0.05 and reporting only that one: testing many metrics or subgroups (“it works for iOS users in the evening!”), removing “outliers” selectively, stopping data collection when p dips below 0.05, trying several models or transformations. Each step looks harmless; together they make the real Type I error rate far above 5%. Even without bad intent, an analyst who makes data-dependent choices walks a “garden of forking paths”.</p>
<p>Defences used in industry and science: pre-register the primary metric, the hypothesis, α and the sample size before the experiment; treat other metrics as exploratory and correct them (Holm or BH); confirm surprising findings on new data (a hold-out set or a replication run); report all analyses performed.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Running ANOVA-style pairwise comparisons (Chapter 8) with unadjusted t-tests.</li><li>Applying Bonferroni to hundreds of tests and then concluding “nothing works” — consider FDR instead.</li><li>Correcting only the tests you chose to show: the m in the formula is every test you ran.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>m tests at α ⇒ P(≥ 1 false positive) = 1 − (1 − α)<sup>m</sup>.</li><li>FWER: Bonferroni (α/m), Holm (step-down, better).</li><li>FDR: Benjamini–Hochberg, more powerful for many tests.</li><li>Pre-register, correct, replicate, report everything.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.youtube.com/watch?v=HDCOUXE3HMM" target="_blank" rel="noopener">StatQuest — p-hacking: what it is and how to avoid it</a></li><li><a href="https://www.youtube.com/watch?v=K8LQSvtjcEo" target="_blank" rel="noopener">StatQuest — False discovery rates (FDR), clearly explained</a></li><li><a href="https://www.statsmodels.org/stable/generated/statsmodels.stats.multitest.multipletests.html" target="_blank" rel="noopener">statsmodels — multipletests</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.false_discovery_control.html" target="_blank" rel="noopener">SciPy — false_discovery_control</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>With m = 50 independent tests of true nulls at α = 0.05, what is P(at least one false positive)?</li><li>Bonferroni threshold for 25 tests at FWER 0.05?</li><li>p-values 0.004, 0.019, 0.030, 0.6 (m = 4). Which are rejected by BH at q = 0.05?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 1 − 0.95<sup>50</sup> ≈ 0.923. 2) 0.05/25 = 0.002. 3) Thresholds 0.0125, 0.025, 0.0375, 0.05: 0.004 ✓, 0.019 ✓, 0.030 ✓, 0.6 ✗ ⇒ the first three.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 7 · Bài 7.3</span>
<h2>Kiểm định bội, p-hacking và tỉ lệ phát hiện sai</h2>
<p class="lead">Kiểm định 20 đặc trưng vô dụng ở α = 0,05 thì kỳ vọng có một kết quả “có ý nghĩa”. Kiểm định hàng trăm chỉ số trên dashboard A/B thì chắc chắn có phát hiện sai. Bài này chỉ cách giữ tỉ lệ sai lầm trung thực khi chạy nhiều kiểm định.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính xác suất có ít nhất một dương tính giả trong m kiểm định.</li><li>Kiểm soát tỉ lệ sai lầm toàn họ (FWER) bằng Bonferroni và Holm.</li><li>Kiểm soát tỉ lệ phát hiện sai (FDR) bằng Benjamini–Hochberg, và nhận ra p-hacking.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Nếu m giả thuyết không đúng, độc lập, mỗi cái kiểm định ở mức α, thì P(ít nhất một lần bác bỏ) = 1 − (1 − α)<sup>m</sup>. Với m = 20 và α = 0,05 con số này là 1 − 0,95<sup>20</sup> = <b>0,64</b>. Hai cách định nghĩa “sai lầm” cho một họ kiểm định:</p>
<div class="formula"><span class="lbl">Tỉ lệ sai lầm cho m kiểm định</span>FWER = P(ít nhất một lần bác bỏ sai)      FDR = E[ số bác bỏ sai / tổng số bác bỏ ]  (bằng 0 nếu không bác bỏ gì)</div>
<p><strong>Bonferroni</strong> (kiểm soát FWER): bác bỏ H<sub>i</sub> nếu p<sub>i</sub> ≤ α/m, tương đương p hiệu chỉnh = min(1, m·p<sub>i</sub>). Đơn giản, đúng với mọi kiểu phụ thuộc, nhưng bảo thủ.</p>
<p><strong>Holm</strong> (kiểm soát FWER, luôn tốt hơn Bonferroni): sắp p<sub>(1)</sub> ≤ … ≤ p<sub>(m)</sub>; so p<sub>(1)</sub> với α/m, p<sub>(2)</sub> với α/(m − 1), …; dừng ở lần không bác bỏ đầu tiên.</p>
<p><strong>Benjamini–Hochberg</strong> (kiểm soát FDR ở mức q): tìm k lớn nhất có p<sub>(k)</sub> ≤ (k/m)·q và bác bỏ k p-value nhỏ nhất. Mạnh hơn nhiều khi có nhiều hiệu ứng thật; là chuẩn trong genomics, A/B test quy mô lớn và sàng lọc đặc trưng.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — 10 chỉ số trong một A/B test.</b> p-value đã sắp xếp: 0,001; 0,008; 0,012; 0,030; 0,041; 0,049; 0,110; 0,240; 0,520; 0,810.</p>
<p>Không hiệu chỉnh: 6 chỉ số có p &lt; 0,05. Bonferroni: ngưỡng 0,05/10 = 0,005 ⇒ chỉ <b>1</b> chỉ số trụ lại. Holm: 0,001 ≤ 0,005 ✓, rồi 0,008 so với 0,05/9 = 0,0056 ✗ ⇒ <b>1</b>. BH với q = 0,05: ngưỡng (k/10)·0,05 = 0,005; 0,010; 0,015; 0,020; …; p<sub>(3)</sub> = 0,012 ≤ 0,015 nhưng p<sub>(4)</sub> = 0,030 &gt; 0,020, và không p-value nào sau đó đạt ngưỡng của nó ⇒ <b>3</b> phát hiện (tỉ lệ phát hiện sai kỳ vọng tối đa 5%).</p></div>
<pre><code class="language-python">import numpy as np
from statsmodels.stats.multitest import multipletests

p = np.array([0.001, 0.008, 0.012, 0.030, 0.041, 0.049, 0.110, 0.240, 0.520, 0.810])
for method in ["bonferroni", "holm", "fdr_bh"]:
    reject, p_adj, _, _ = multipletests(p, alpha=0.05, method=method)
    print(f"{method:10s} rejects {reject.sum()} :", p_adj.round(3))
print("raw p &lt; 0.05 :", (p &lt; 0.05).sum(), "hypotheses")</code></pre>
<div class="out">bonferroni rejects 1 : [0.01 0.08 0.12 0.3  0.41 0.49 1.   1.   1.   1.  ]
holm       rejects 1 : [0.01  0.072 0.096 0.21  0.246 0.246 0.44  0.72  1.    1.   ]
fdr_bh     rejects 3 : [0.01  0.04  0.04  0.075 0.082 0.082 0.157 0.3   0.578 0.81 ]
raw p &lt; 0.05 : 6 hypotheses</div>
<h3>p-hacking và “khu vườn những lối rẽ”</h3>
<p><strong>p-hacking</strong> là thử nhiều cách phân tích cho tới khi có p &lt; 0,05 rồi chỉ báo cáo cách đó: thử nhiều chỉ số hay nhóm con (“nó hiệu quả với người dùng iOS buổi tối!”), loại “ngoại lai” một cách chọn lọc, dừng thu dữ liệu khi p vừa xuống dưới 0,05, thử nhiều mô hình hay phép biến đổi. Từng bước trông vô hại; cộng lại làm sai lầm loại I thật vượt xa 5%. Kể cả không cố ý, người phân tích ra quyết định dựa vào dữ liệu đang đi trong “khu vườn những lối rẽ”.</p>
<p>Cách phòng trong công nghiệp và khoa học: đăng ký trước chỉ số chính, giả thuyết, α và cỡ mẫu trước thí nghiệm; coi các chỉ số khác là thăm dò và hiệu chỉnh chúng (Holm hoặc BH); xác nhận phát hiện bất ngờ trên dữ liệu mới (tập giữ lại hoặc chạy lặp lại); báo cáo mọi phân tích đã làm.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>So sánh từng cặp kiểu ANOVA (Chương 8) bằng kiểm định t không hiệu chỉnh.</li><li>Áp Bonferroni cho hàng trăm kiểm định rồi kết luận “không có gì hiệu quả” — hãy cân nhắc FDR.</li><li>Chỉ hiệu chỉnh những kiểm định bạn chọn để trình bày: m trong công thức là mọi kiểm định bạn đã chạy.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>m kiểm định ở mức α ⇒ P(≥ 1 dương tính giả) = 1 − (1 − α)<sup>m</sup>.</li><li>FWER: Bonferroni (α/m), Holm (giảm dần, tốt hơn).</li><li>FDR: Benjamini–Hochberg, mạnh hơn khi có nhiều kiểm định.</li><li>Đăng ký trước, hiệu chỉnh, lặp lại, báo cáo đầy đủ.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.youtube.com/watch?v=HDCOUXE3HMM" target="_blank" rel="noopener">StatQuest — p-hacking là gì và cách tránh</a></li><li><a href="https://www.youtube.com/watch?v=K8LQSvtjcEo" target="_blank" rel="noopener">StatQuest — Tỉ lệ phát hiện sai (FDR), giải thích rõ ràng</a></li><li><a href="https://www.statsmodels.org/stable/generated/statsmodels.stats.multitest.multipletests.html" target="_blank" rel="noopener">statsmodels — multipletests</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.false_discovery_control.html" target="_blank" rel="noopener">SciPy — false_discovery_control</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Với m = 50 kiểm định độc lập của giả thuyết không đúng ở α = 0,05, P(ít nhất một dương tính giả) bằng bao nhiêu?</li><li>Ngưỡng Bonferroni cho 25 kiểm định ở FWER 0,05?</li><li>p-value 0,004; 0,019; 0,030; 0,6 (m = 4). BH ở q = 0,05 bác bỏ những cái nào?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 1 − 0,95<sup>50</sup> ≈ 0,923. 2) 0,05/25 = 0,002. 3) Ngưỡng 0,0125; 0,025; 0,0375; 0,05: 0,004 ✓, 0,019 ✓, 0,030 ✓, 0,6 ✗ ⇒ ba cái đầu.</p></div>`);

const q7 = QZ(7, 'Quiz — Chapter 7: Categorical data and multiple testing|||Quiz — Chương 7: Dữ liệu phân loại và kiểm định bội', 'Kiểm tra chương 7: kiểm định phù hợp χ², bảng ngẫu nhiên, Cramér’s V, Fisher, Bonferroni, Holm, BH, p-hacking.', [
  Q('q1', 'A die is rolled 60 times. Under H₀ (fair), the expected count per face is|||Gieo xúc xắc 60 lần. Khi H₀ (cân đối) đúng, số đếm kỳ vọng mỗi mặt là',
    ['6|||6', '10|||10', '60|||60', '1/6|||1/6'], 1,
    'E = n·p = 60/6.|||E = n·p = 60/6.'),
  Q('q2', 'Goodness of fit with k = 6 categories and no estimated parameters has df|||Kiểm định phù hợp với k = 6 loại, không ước lượng tham số có bậc tự do',
    ['6|||6', '5|||5', '4|||4', '36|||36'], 1,
    'k − 1 = 5.|||k − 1 = 5.'),
  Q('q3', 'You estimate λ of a Poisson from the data and use 7 categories. The df is|||Bạn ước lượng λ của Poisson từ dữ liệu và dùng 7 loại. Bậc tự do là',
    ['7|||7', '6|||6', '5|||5', '4|||4'], 2,
    '7 − 1 − 1 = 5.|||7 − 1 − 1 = 5.'),
  Q('q4', 'The usual condition for the χ² approximation is|||Điều kiện thường dùng cho xấp xỉ χ² là',
    ['observed counts ≥ 5|||số đếm quan sát ≥ 5', 'expected counts ≥ 5|||số đếm kỳ vọng ≥ 5', 'n ≥ 30|||n ≥ 30', 'normal data|||dữ liệu chuẩn'], 1,
    'The approximation depends on expected counts.|||Xấp xỉ phụ thuộc số đếm kỳ vọng.'),
  Q('q5', 'In a contingency table, E for a cell equals|||Trong bảng ngẫu nhiên, E của một ô bằng',
    ['row total + column total|||tổng hàng + tổng cột', 'row total × column total / n|||tổng hàng × tổng cột / n', 'n / (r·c)|||n / (r·c)', 'the observed count|||số đếm quan sát'], 1,
    'Independence: P(row and column) = P(row)·P(column).|||Độc lập: P(hàng và cột) = P(hàng)·P(cột).'),
  Q('q6', 'A 3 × 2 table test of independence has df|||Kiểm định độc lập cho bảng 3 × 2 có bậc tự do',
    ['6|||6', '5|||5', '2|||2', '1|||1'], 2,
    '(3 − 1)(2 − 1) = 2.|||(3 − 1)(2 − 1) = 2.'),
  Q('q7', 'χ² = 12.8 with p = 0.0017 and Cramér’s V = 0.08 means|||χ² = 12,8 với p = 0,0017 và Cramér’s V = 0,08 nghĩa là',
    ['a strong association|||liên hệ mạnh', 'a real but weak association|||liên hệ có thật nhưng yếu', 'no association|||không có liên hệ', 'causation|||quan hệ nhân quả'], 1,
    'Significance ≠ strength; V is small.|||Có ý nghĩa ≠ mạnh; V nhỏ.'),
  Q('q8', 'With 20 independent tests of true nulls at α = 0.05, P(at least one false positive) ≈|||Với 20 kiểm định độc lập của giả thuyết không đúng ở α = 0,05, P(ít nhất một dương tính giả) ≈',
    ['0.05|||0,05', '0.36|||0,36', '0.64|||0,64', '1.00|||1,00'], 2,
    '1 − 0.95²⁰ = 0.64.|||1 − 0,95²⁰ = 0,64.'),
  Q('q9', 'Which procedure controls the false discovery rate?|||Thủ tục nào kiểm soát tỉ lệ phát hiện sai?',
    ['Bonferroni|||Bonferroni', 'Holm|||Holm', 'Benjamini–Hochberg|||Benjamini–Hochberg', 'Fisher’s exact test|||kiểm định chính xác Fisher'], 2,
    'Bonferroni and Holm control the FWER.|||Bonferroni và Holm kiểm soát FWER.'),
  Q('q10', 'Which is an example of p-hacking?|||Ví dụ nào là p-hacking?',
    ['pre-registering the main metric|||đăng ký trước chỉ số chính', 'stopping the experiment as soon as p < 0.05|||dừng thí nghiệm ngay khi p < 0,05', 'applying Holm’s correction|||áp hiệu chỉnh Holm', 'replicating on new data|||lặp lại trên dữ liệu mới'], 1,
    'Optional stopping inflates the Type I error.|||Dừng tuỳ ý làm tăng sai lầm loại I.'),
]);

const ch7 = {
  title: 'Chapter 7 — Categorical data and multiple testing|||Chương 7 — Dữ liệu phân loại và kiểm định bội',
  description: 'Kiểm định phù hợp χ², bảng ngẫu nhiên (độc lập/đồng nhất), Cramér’s V, kiểm định chính xác Fisher; kiểm định bội: Bonferroni, Holm, Benjamini–Hochberg, p-hacking (OpenIntro Ch. 6 · OpenStax Ch. 11 · Wasserman 10.7).',
  lessons: [c71, c72, c73, q7],
};


// ───────────────────────────── Chương 8 — ANOVA ─────────────────────────────
const c81 = L('psi221-ts-8-1',
  '8.1 — One-way ANOVA: comparing several means with the F-test|||8.1 — ANOVA một yếu tố: so sánh nhiều trung bình bằng kiểm định F',
  'Vì sao không chạy nhiều kiểm định t; phân tích SST = SSB + SSW, MSB, MSW, F = MSB/MSW, bảng ANOVA, η²; ví dụ ba thuật toán gợi ý tính tay và bằng scipy.',
  `<span class="eyebrow">PSI221 · Chapter 8 · Lesson 8.1</span>
<h2>One-way ANOVA: comparing several means with the F-test</h2>
<p class="lead">Three recommendation algorithms, three groups of users, three average session lengths. Are the algorithms really different? Analysis of variance (ANOVA) answers with a single test, by comparing the spread <em>between</em> group means with the spread <em>within</em> groups.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain why several t-tests are not the right tool for k ≥ 3 groups.</li><li>Decompose the total variation into between- and within-group sums of squares.</li><li>Build the ANOVA table, compute F and its p-value, and measure effect size with η<sup>2</sup>.</li></ul>
<h3>📖 Lecture</h3>
<p>With k = 3 groups there are 3 pairwise t-tests; with k = 6 there are 15. Running them all at α = 0.05 inflates the chance of a false positive (Lesson 7.3). ANOVA tests the global null H<sub>0</sub>: μ<sub>1</sub> = μ<sub>2</sub> = … = μ<sub>k</sub> against H<sub>1</sub>: at least one mean differs.</p>
<p>Let group j have n<sub>j</sub> observations with mean ȳ<sub>j</sub>, N = ∑n<sub>j</sub>, and grand mean ȳ.</p>
<div class="formula"><span class="lbl">Sums of squares</span>SST = ∑<sub>j</sub>∑<sub>i</sub>(y<sub>ij</sub> − ȳ)<sup>2</sup>  =  SSB = ∑<sub>j</sub> n<sub>j</sub>(ȳ<sub>j</sub> − ȳ)<sup>2</sup>  +  SSW = ∑<sub>j</sub>∑<sub>i</sub>(y<sub>ij</sub> − ȳ<sub>j</sub>)<sup>2</sup></div>
<div class="formula"><span class="lbl">ANOVA table</span>
<table><tr><th>Source</th><th>SS</th><th>df</th><th>MS = SS/df</th><th>F</th></tr>
<tr><td>Between groups</td><td>SSB</td><td>k − 1</td><td>MSB</td><td>MSB/MSW</td></tr>
<tr><td>Within groups (error)</td><td>SSW</td><td>N − k</td><td>MSW</td><td></td></tr>
<tr><td>Total</td><td>SST</td><td>N − 1</td><td></td><td></td></tr></table>
Under H<sub>0</sub> (normal groups, equal variances): F ~ F(k − 1, N − k). Reject for large F.</div>
<p>Intuition: MSW estimates the common variance σ<sup>2</sup> whether or not H<sub>0</sub> holds. MSB also estimates σ<sup>2</sup> if the means are equal, but is inflated when they differ. So F ≈ 1 under H<sub>0</sub> and F ≫ 1 under H<sub>1</sub>. With k = 2 groups, F = t<sup>2</sup> of the pooled t-test (Lesson 1.4: t<sup>2</sup> = F(1, k)).</p>
<p><strong>Effect size:</strong> η<sup>2</sup> = SSB/SST, the share of total variation explained by the groups.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — three recommenders.</b> Minutes per session for 5 users each: A = 12, 15, 14, 10, 13; B = 18, 16, 17, 20, 19; C = 14, 13, 16, 15, 12.</p>
<p>Step 1: means 12.8, 18.0, 14.0; grand mean 14.933. Step 2: SSB = 5[(12.8 − 14.933)<sup>2</sup> + (18 − 14.933)<sup>2</sup> + (14 − 14.933)<sup>2</sup>] = <b>74.133</b>. Step 3: SSW = 14.8 + 10 + 10 = <b>34.8</b>; check SST = 108.933 = 74.133 + 34.8 ✓. Step 4: MSB = 74.133/2 = 37.067, MSW = 34.8/12 = 2.9, <b>F = 12.78</b> on (2, 12) df, <b>p = 0.0011</b>. Step 5: η<sup>2</sup> = 74.133/108.933 = 0.68: the algorithm explains 68% of the variation in session length. Conclusion: at least one recommender differs; which one is the question of Lesson 8.2.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

A = np.array([12, 15, 14, 10, 13])   # minutes per session, recommender A
B = np.array([18, 16, 17, 20, 19])   # recommender B
C = np.array([14, 13, 16, 15, 12])   # recommender C
groups = [A, B, C]
allx = np.concatenate(groups)
grand = allx.mean()
ssb = sum(len(g) * (g.mean() - grand)**2 for g in groups)
ssw = sum(((g - g.mean())**2).sum() for g in groups)
k, N = len(groups), len(allx)
msb, msw = ssb / (k - 1), ssw / (N - k)
print("group means:", [float(g.mean()) for g in groups], f" grand mean = {grand:.4f}")
print(f"SSB = {ssb:.3f}, SSW = {ssw:.3f}, SST = {((allx - grand)**2).sum():.3f}")
print(f"MSB = {msb:.3f}, MSW = {msw:.3f}, F = {msb / msw:.3f}")
print(f"p (by hand) = {stats.f.sf(msb / msw, k - 1, N - k):.6f}")
res = stats.f_oneway(A, B, C)
print(f"f_oneway   : F = {res.statistic:.3f}, p = {res.pvalue:.6f}")</code></pre>
<div class="out">group means: [12.8, 18.0, 14.0]  grand mean = 14.9333
SSB = 74.133, SSW = 34.800, SST = 108.933
MSB = 37.067, MSW = 2.900, F = 12.782
p (by hand) = 0.001063
f_oneway   : F = 12.782, p = 0.001063</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Concluding “all means differ” from a significant F. F only says <em>not all are equal</em>.</li><li>Using N − 1 instead of N − k for the error df.</li><li>Applying one-way ANOVA to repeated measurements of the same users (that needs a repeated-measures design).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>SST = SSB + SSW; MSB = SSB/(k − 1), MSW = SSW/(N − k).</li><li>F = MSB/MSW ~ F(k − 1, N − k) under H<sub>0</sub>.</li><li>η<sup>2</sup> = SSB/SST measures effect size.</li><li>A significant F calls for post-hoc comparisons.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/13-1-one-way-anova" target="_blank" rel="noopener">OpenStax — 13.1 One-way ANOVA</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/13-2-the-f-distribution-and-the-f-ratio" target="_blank" rel="noopener">OpenStax — 13.2 The F distribution and the F-ratio</a></li><li><a href="https://www.itl.nist.gov/div898/handbook/prc/section4/prc431.htm" target="_blank" rel="noopener">NIST e-Handbook — One-way ANOVA overview</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.f_oneway.html" target="_blank" rel="noopener">SciPy — f_oneway</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>k = 4 groups, N = 40, SSB = 60, SSW = 180. Compute F and its df.</li><li>Why is MSW a valid estimate of σ<sup>2</sup> even when H<sub>0</sub> is false?</li><li>For two groups, ANOVA gives F = 16. What is the pooled two-sample t?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) MSB = 20, MSW = 5, F = 4 on (3, 36) df (p ≈ 0.015). 2) It only uses deviations from each group's own mean, so shifts between group means do not affect it. 3) |t| = √16 = 4.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 8 · Bài 8.1</span>
<h2>ANOVA một yếu tố: so sánh nhiều trung bình bằng kiểm định F</h2>
<p class="lead">Ba thuật toán gợi ý, ba nhóm người dùng, ba độ dài phiên trung bình. Các thuật toán có thật sự khác nhau? Phân tích phương sai (ANOVA) trả lời bằng một kiểm định duy nhất, so độ phân tán <em>giữa</em> các trung bình nhóm với độ phân tán <em>trong</em> từng nhóm.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích vì sao nhiều kiểm định t không phải công cụ đúng khi có k ≥ 3 nhóm.</li><li>Phân tích tổng biến thiên thành tổng bình phương giữa nhóm và trong nhóm.</li><li>Lập bảng ANOVA, tính F và p-value, đo độ lớn hiệu ứng bằng η<sup>2</sup>.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Với k = 3 nhóm có 3 kiểm định t từng cặp; với k = 6 có 15. Chạy tất cả ở α = 0,05 làm tăng khả năng dương tính giả (Bài 7.3). ANOVA kiểm định giả thuyết tổng thể H<sub>0</sub>: μ<sub>1</sub> = μ<sub>2</sub> = … = μ<sub>k</sub> với H<sub>1</sub>: có ít nhất một trung bình khác.</p>
<p>Gọi nhóm j có n<sub>j</sub> quan sát với trung bình ȳ<sub>j</sub>, N = ∑n<sub>j</sub>, và trung bình chung ȳ.</p>
<div class="formula"><span class="lbl">Tổng bình phương</span>SST = ∑<sub>j</sub>∑<sub>i</sub>(y<sub>ij</sub> − ȳ)<sup>2</sup>  =  SSB = ∑<sub>j</sub> n<sub>j</sub>(ȳ<sub>j</sub> − ȳ)<sup>2</sup>  +  SSW = ∑<sub>j</sub>∑<sub>i</sub>(y<sub>ij</sub> − ȳ<sub>j</sub>)<sup>2</sup></div>
<div class="formula"><span class="lbl">Bảng ANOVA</span>
<table><tr><th>Nguồn</th><th>SS</th><th>Bậc tự do</th><th>MS = SS/df</th><th>F</th></tr>
<tr><td>Giữa các nhóm</td><td>SSB</td><td>k − 1</td><td>MSB</td><td>MSB/MSW</td></tr>
<tr><td>Trong nhóm (sai số)</td><td>SSW</td><td>N − k</td><td>MSW</td><td></td></tr>
<tr><td>Tổng</td><td>SST</td><td>N − 1</td><td></td><td></td></tr></table>
Khi H<sub>0</sub> đúng (các nhóm chuẩn, phương sai bằng nhau): F ~ F(k − 1, N − k). Bác bỏ khi F lớn.</div>
<p>Trực giác: MSW ước lượng phương sai chung σ<sup>2</sup> dù H<sub>0</sub> đúng hay sai. MSB cũng ước lượng σ<sup>2</sup> nếu các trung bình bằng nhau, nhưng bị phình ra khi chúng khác nhau. Vậy F ≈ 1 khi H<sub>0</sub> đúng và F ≫ 1 khi H<sub>1</sub> đúng. Với k = 2 nhóm, F = t<sup>2</sup> của kiểm định t gộp (Bài 1.4: t<sup>2</sup> = F(1, k)).</p>
<p><strong>Độ lớn hiệu ứng:</strong> η<sup>2</sup> = SSB/SST, phần biến thiên tổng được giải thích bởi các nhóm.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — ba hệ gợi ý.</b> Số phút mỗi phiên của 5 người dùng mỗi nhóm: A = 12, 15, 14, 10, 13; B = 18, 16, 17, 20, 19; C = 14, 13, 16, 15, 12.</p>
<p>Bước 1: trung bình 12,8; 18,0; 14,0; trung bình chung 14,933. Bước 2: SSB = 5[(12,8 − 14,933)<sup>2</sup> + (18 − 14,933)<sup>2</sup> + (14 − 14,933)<sup>2</sup>] = <b>74,133</b>. Bước 3: SSW = 14,8 + 10 + 10 = <b>34,8</b>; kiểm tra SST = 108,933 = 74,133 + 34,8 ✓. Bước 4: MSB = 74,133/2 = 37,067, MSW = 34,8/12 = 2,9, <b>F = 12,78</b> với (2, 12) bậc tự do, <b>p = 0,0011</b>. Bước 5: η<sup>2</sup> = 74,133/108,933 = 0,68: thuật toán giải thích 68% biến thiên của độ dài phiên. Kết luận: ít nhất một hệ gợi ý khác các hệ còn lại; hệ nào là câu hỏi của Bài 8.2.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

A = np.array([12, 15, 14, 10, 13])   # minutes per session, recommender A
B = np.array([18, 16, 17, 20, 19])   # recommender B
C = np.array([14, 13, 16, 15, 12])   # recommender C
groups = [A, B, C]
allx = np.concatenate(groups)
grand = allx.mean()
ssb = sum(len(g) * (g.mean() - grand)**2 for g in groups)
ssw = sum(((g - g.mean())**2).sum() for g in groups)
k, N = len(groups), len(allx)
msb, msw = ssb / (k - 1), ssw / (N - k)
print("group means:", [float(g.mean()) for g in groups], f" grand mean = {grand:.4f}")
print(f"SSB = {ssb:.3f}, SSW = {ssw:.3f}, SST = {((allx - grand)**2).sum():.3f}")
print(f"MSB = {msb:.3f}, MSW = {msw:.3f}, F = {msb / msw:.3f}")
print(f"p (by hand) = {stats.f.sf(msb / msw, k - 1, N - k):.6f}")
res = stats.f_oneway(A, B, C)
print(f"f_oneway   : F = {res.statistic:.3f}, p = {res.pvalue:.6f}")</code></pre>
<div class="out">group means: [12.8, 18.0, 14.0]  grand mean = 14.9333
SSB = 74.133, SSW = 34.800, SST = 108.933
MSB = 37.067, MSW = 2.900, F = 12.782
p (by hand) = 0.001063
f_oneway   : F = 12.782, p = 0.001063</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Kết luận “mọi trung bình đều khác nhau” từ F có ý nghĩa. F chỉ nói <em>không phải tất cả bằng nhau</em>.</li><li>Dùng N − 1 thay vì N − k cho bậc tự do sai số.</li><li>Áp ANOVA một yếu tố cho phép đo lặp lại trên cùng người dùng (cần thiết kế đo lặp).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>SST = SSB + SSW; MSB = SSB/(k − 1), MSW = SSW/(N − k).</li><li>F = MSB/MSW ~ F(k − 1, N − k) khi H<sub>0</sub> đúng.</li><li>η<sup>2</sup> = SSB/SST đo độ lớn hiệu ứng.</li><li>F có ý nghĩa thì cần so sánh hậu kiểm (post-hoc).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/13-1-one-way-anova" target="_blank" rel="noopener">OpenStax — 13.1 ANOVA một yếu tố</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/13-2-the-f-distribution-and-the-f-ratio" target="_blank" rel="noopener">OpenStax — 13.2 Phân phối F và tỉ số F</a></li><li><a href="https://www.itl.nist.gov/div898/handbook/prc/section4/prc431.htm" target="_blank" rel="noopener">NIST e-Handbook — Tổng quan ANOVA một yếu tố</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.f_oneway.html" target="_blank" rel="noopener">SciPy — f_oneway</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>k = 4 nhóm, N = 40, SSB = 60, SSW = 180. Tính F và bậc tự do.</li><li>Vì sao MSW là ước lượng hợp lệ của σ<sup>2</sup> kể cả khi H<sub>0</sub> sai?</li><li>Với hai nhóm, ANOVA cho F = 16. Thống kê t hai mẫu gộp bằng bao nhiêu?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) MSB = 20, MSW = 5, F = 4 với (3, 36) bậc tự do (p ≈ 0,015). 2) Nó chỉ dùng độ lệch so với trung bình riêng của từng nhóm, nên dịch chuyển giữa các trung bình nhóm không ảnh hưởng. 3) |t| = √16 = 4.</p></div>`);

const c82 = L('psi221-ts-8-2',
  '8.2 — ANOVA assumptions and post-hoc comparisons (Tukey HSD)|||8.2 — Giả định của ANOVA và so sánh hậu kiểm (Tukey HSD)',
  'Ba giả định (độc lập, chuẩn, phương sai bằng nhau) và cách kiểm (phần dư, Levene, Shapiro); Welch ANOVA, Kruskal–Wallis; Tukey HSD và Bonferroni cho so sánh từng cặp.',
  `<span class="eyebrow">PSI221 · Chapter 8 · Lesson 8.2</span>
<h2>ANOVA assumptions and post-hoc comparisons (Tukey HSD)</h2>
<p class="lead">A significant F tells you the groups are not all equal. Two questions remain: can we trust the F-test on these data, and <em>which</em> groups differ? This lesson answers both.</p>
<h3>🎯 Objectives</h3>
<ul><li>State and check the three assumptions of one-way ANOVA.</li><li>Know the alternatives when assumptions fail (Welch ANOVA, Kruskal–Wallis, transformations).</li><li>Run Tukey's HSD and interpret simultaneous confidence intervals.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>The model.</strong> y<sub>ij</sub> = μ<sub>j</sub> + ε<sub>ij</sub> with ε<sub>ij</sub> i.i.d. N(0, σ<sup>2</sup>). That packs three assumptions:</p>
<ol>
<li><strong>Independence</strong> of all observations — guaranteed by design (random assignment of users to algorithms), not by a test. The most important.</li>
<li><strong>Normality</strong> of the errors — check a histogram or Q–Q plot of the residuals y<sub>ij</sub> − ȳ<sub>j</sub>; a Shapiro–Wilk test can help but has little power for small n and rejects trivial deviations for huge n. ANOVA is fairly robust to mild non-normality, especially with balanced groups.</li>
<li><strong>Equal variances</strong> (homoscedasticity) — compare group SDs (rule of thumb: largest/smallest &lt; 2) and use <strong>Levene's test</strong>. Unequal variances combined with unequal group sizes are dangerous.</li>
</ol>
<p><strong>If assumptions fail:</strong> unequal variances ⇒ Welch's ANOVA (the k-group version of Welch's t); skewed data ⇒ a log transform or the rank-based Kruskal–Wallis test (Lesson 10.1); dependence ⇒ a different design (repeated measures, mixed models).</p>
<h3>Post-hoc comparisons</h3>
<p>After a significant F, compare pairs while controlling the family-wise error rate (Lesson 7.3). The standard choice for all pairwise comparisons is <strong>Tukey's Honestly Significant Difference</strong>, based on the studentised range distribution:</p>
<div class="formula"><span class="lbl">Tukey HSD (balanced groups of size n)</span>groups i and j differ if |ȳ<sub>i</sub> − ȳ<sub>j</sub>| &gt; q<sub>α; k, N−k</sub> · √(MSW/n)      simultaneous CIs: (ȳ<sub>i</sub> − ȳ<sub>j</sub>) ± q·√(MSW/n)</div>
<p>All intervals hold <em>together</em> with probability 95%. Bonferroni-adjusted t-tests are an alternative (more conservative for many pairs); if you only planned a few specific comparisons in advance, test just those.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — recommenders, continued.</b> Lesson 8.1 gave F = 12.78, p = 0.0011, MSW = 2.9.</p>
<p>Step 1 — assumptions: group SDs are 1.92, 1.58, 1.58 (ratio 1.2); Levene p = 0.93; Shapiro–Wilk on residuals p = 0.51. Nothing alarming (with 5 per group, power is low — rely on the design and plots too).</p>
<p>Step 2 — Tukey HSD: A − B = −5.2 (95% CI −8.07 to −2.33, p = 0.001); A − C = −1.2 (CI −4.07 to 1.67, p = 0.52); B − C = 4.0 (CI 1.13 to 6.87, p = 0.008).</p>
<p>Conclusion: recommender <b>B</b> gives longer sessions than both A and C (by about 4–5 minutes); A and C are not distinguishable. A compact way to report: B<sup>a</sup> &gt; C<sup>b</sup> ≈ A<sup>b</sup> (groups sharing a letter do not differ).</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

A = np.array([12, 15, 14, 10, 13])
B = np.array([18, 16, 17, 20, 19])
C = np.array([14, 13, 16, 15, 12])
print(f"Levene (equal variances) p = {stats.levene(A, B, C).pvalue:.4f}")
resid = np.concatenate([g - g.mean() for g in (A, B, C)])
print(f"Shapiro on residuals     p = {stats.shapiro(resid).pvalue:.4f}")
print(stats.tukey_hsd(A, B, C))</code></pre>
<div class="out">Levene (equal variances) p = 0.9290
Shapiro on residuals     p = 0.5053
Pairwise Group Comparisons (95.0% Confidence Interval)
Comparison  Statistic  p-value  Lower CI  Upper CI
 (0 - 1)     -5.200     0.001    -8.073    -2.327
 (0 - 2)     -1.200     0.524    -4.073     1.673
 (1 - 0)      5.200     0.001     2.327     8.073
 (1 - 2)      4.000     0.008     1.127     6.873
 (2 - 0)      1.200     0.524    -1.673     4.073
 (2 - 1)     -4.000     0.008    -6.873    -1.127</div>
<p>In SciPy's output, group 0 = A, 1 = B, 2 = C; each pair appears twice with opposite signs.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Running unadjusted pairwise t-tests after ANOVA (inflates false positives).</li><li>Running post-hoc tests when the F-test was not significant and reporting only the “wins”.</li><li>Treating a non-significant Levene or Shapiro test with n = 5 as proof that assumptions hold.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Assumptions: independence (design), normal residuals, equal variances (Levene).</li><li>Fixes: Welch ANOVA, transformation, Kruskal–Wallis.</li><li>Tukey HSD: all pairwise comparisons with family-wise 95% confidence.</li><li>Report which groups differ, by how much, with intervals.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.itl.nist.gov/div898/handbook/prc/section4/prc471.htm" target="_blank" rel="noopener">NIST e-Handbook — Tukey's method</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.tukey_hsd.html" target="_blank" rel="noopener">SciPy — tukey_hsd</a></li><li><a href="https://online.stat.psu.edu/stat500/Lesson10.html" target="_blank" rel="noopener">Penn State STAT 500 — Lesson 10: Introduction to ANOVA</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.shapiro.html" target="_blank" rel="noopener">SciPy — shapiro (normality test)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Group SDs are 2, 3 and 7 with group sizes 30, 30 and 8. Which assumption worries you, and what would you do?</li><li>How many pairwise comparisons are there among 5 groups?</li><li>A Tukey interval for μ<sub>2</sub> − μ<sub>4</sub> is (−1.3, 4.8). Do groups 2 and 4 differ significantly?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Equal variances (ratio 3.5) together with very unequal sizes — use Welch's ANOVA (and Games–Howell post-hoc) or a transformation. 2) 5·4/2 = 10. 3) No — the interval contains 0.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 8 · Bài 8.2</span>
<h2>Giả định của ANOVA và so sánh hậu kiểm (Tukey HSD)</h2>
<p class="lead">F có ý nghĩa cho biết các nhóm không bằng nhau hết. Còn hai câu hỏi: có tin được kiểm định F trên dữ liệu này không, và <em>những nhóm nào</em> khác nhau? Bài này trả lời cả hai.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu và kiểm tra ba giả định của ANOVA một yếu tố.</li><li>Biết phương án thay thế khi giả định bị vi phạm (Welch ANOVA, Kruskal–Wallis, biến đổi dữ liệu).</li><li>Chạy Tukey HSD và diễn giải các khoảng tin cậy đồng thời.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Mô hình.</strong> y<sub>ij</sub> = μ<sub>j</sub> + ε<sub>ij</sub> với ε<sub>ij</sub> i.i.d. N(0, σ<sup>2</sup>). Gói trong đó ba giả định:</p>
<ol>
<li><strong>Độc lập</strong> giữa mọi quan sát — được bảo đảm bằng thiết kế (phân ngẫu nhiên người dùng vào các thuật toán), không bằng kiểm định. Quan trọng nhất.</li>
<li><strong>Tính chuẩn</strong> của sai số — xem histogram hoặc biểu đồ Q–Q của phần dư y<sub>ij</sub> − ȳ<sub>j</sub>; kiểm định Shapiro–Wilk có thể giúp nhưng lực thấp khi n nhỏ và bác bỏ cả lệch không đáng kể khi n rất lớn. ANOVA khá bền với lệch chuẩn nhẹ, nhất là khi các nhóm cân bằng.</li>
<li><strong>Phương sai bằng nhau</strong> — so độ lệch chuẩn các nhóm (quy tắc nhanh: lớn nhất/nhỏ nhất &lt; 2) và dùng <strong>kiểm định Levene</strong>. Phương sai khác nhau cộng với cỡ nhóm khác nhau là nguy hiểm.</li>
</ol>
<p><strong>Nếu giả định bị vi phạm:</strong> phương sai khác nhau ⇒ Welch ANOVA (phiên bản k nhóm của t Welch); dữ liệu lệch ⇒ lấy log hoặc dùng kiểm định hạng Kruskal–Wallis (Bài 10.1); phụ thuộc ⇒ thiết kế khác (đo lặp, mô hình hỗn hợp).</p>
<h3>So sánh hậu kiểm</h3>
<p>Sau F có ý nghĩa, so từng cặp trong khi kiểm soát tỉ lệ sai lầm toàn họ (Bài 7.3). Lựa chọn chuẩn cho mọi cặp là <strong>Tukey HSD (Honestly Significant Difference)</strong>, dựa trên phân phối khoảng biến thiên chuẩn hoá (studentized range):</p>
<div class="formula"><span class="lbl">Tukey HSD (các nhóm cân bằng cỡ n)</span>nhóm i và j khác nhau nếu |ȳ<sub>i</sub> − ȳ<sub>j</sub>| &gt; q<sub>α; k, N−k</sub> · √(MSW/n)      KTC đồng thời: (ȳ<sub>i</sub> − ȳ<sub>j</sub>) ± q·√(MSW/n)</div>
<p>Mọi khoảng <em>cùng lúc</em> đúng với xác suất 95%. Kiểm định t hiệu chỉnh Bonferroni là một lựa chọn khác (bảo thủ hơn khi nhiều cặp); nếu từ trước bạn chỉ định so vài cặp cụ thể thì chỉ kiểm định những cặp đó.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — hệ gợi ý, tiếp theo.</b> Bài 8.1 cho F = 12,78, p = 0,0011, MSW = 2,9.</p>
<p>Bước 1 — giả định: độ lệch chuẩn các nhóm 1,92; 1,58; 1,58 (tỉ số 1,2); Levene p = 0,93; Shapiro–Wilk trên phần dư p = 0,51. Không có gì đáng lo (với 5 người mỗi nhóm lực kiểm định thấp — hãy dựa cả vào thiết kế và đồ thị).</p>
<p>Bước 2 — Tukey HSD: A − B = −5,2 (KTC 95% −8,07 tới −2,33, p = 0,001); A − C = −1,2 (KTC −4,07 tới 1,67, p = 0,52); B − C = 4,0 (KTC 1,13 tới 6,87, p = 0,008).</p>
<p>Kết luận: hệ gợi ý <b>B</b> cho phiên dài hơn cả A lẫn C (khoảng 4–5 phút); A và C không phân biệt được. Cách báo cáo gọn: B<sup>a</sup> &gt; C<sup>b</sup> ≈ A<sup>b</sup> (các nhóm chung chữ cái không khác nhau).</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

A = np.array([12, 15, 14, 10, 13])
B = np.array([18, 16, 17, 20, 19])
C = np.array([14, 13, 16, 15, 12])
print(f"Levene (equal variances) p = {stats.levene(A, B, C).pvalue:.4f}")
resid = np.concatenate([g - g.mean() for g in (A, B, C)])
print(f"Shapiro on residuals     p = {stats.shapiro(resid).pvalue:.4f}")
print(stats.tukey_hsd(A, B, C))</code></pre>
<div class="out">Levene (equal variances) p = 0.9290
Shapiro on residuals     p = 0.5053
Pairwise Group Comparisons (95.0% Confidence Interval)
Comparison  Statistic  p-value  Lower CI  Upper CI
 (0 - 1)     -5.200     0.001    -8.073    -2.327
 (0 - 2)     -1.200     0.524    -4.073     1.673
 (1 - 0)      5.200     0.001     2.327     8.073
 (1 - 2)      4.000     0.008     1.127     6.873
 (2 - 0)      1.200     0.524    -1.673     4.073
 (2 - 1)     -4.000     0.008    -6.873    -1.127</div>
<p>Trong output của SciPy, nhóm 0 = A, 1 = B, 2 = C; mỗi cặp xuất hiện hai lần với dấu ngược nhau.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chạy kiểm định t từng cặp không hiệu chỉnh sau ANOVA (tăng dương tính giả).</li><li>Chạy hậu kiểm khi F không có ý nghĩa rồi chỉ báo cáo các cặp “thắng”.</li><li>Coi Levene hay Shapiro không có ý nghĩa với n = 5 là bằng chứng giả định đúng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Giả định: độc lập (thiết kế), phần dư chuẩn, phương sai bằng nhau (Levene).</li><li>Khắc phục: Welch ANOVA, biến đổi dữ liệu, Kruskal–Wallis.</li><li>Tukey HSD: mọi so sánh từng cặp với độ tin cậy toàn họ 95%.</li><li>Báo cáo nhóm nào khác nhau, khác bao nhiêu, kèm khoảng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.itl.nist.gov/div898/handbook/prc/section4/prc471.htm" target="_blank" rel="noopener">NIST e-Handbook — Phương pháp Tukey</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.tukey_hsd.html" target="_blank" rel="noopener">SciPy — tukey_hsd</a></li><li><a href="https://online.stat.psu.edu/stat500/Lesson10.html" target="_blank" rel="noopener">Penn State STAT 500 — Bài 10: Nhập môn ANOVA</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.shapiro.html" target="_blank" rel="noopener">SciPy — shapiro (kiểm định tính chuẩn)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Độ lệch chuẩn các nhóm là 2, 3 và 7 với cỡ nhóm 30, 30 và 8. Giả định nào làm bạn lo, và bạn sẽ làm gì?</li><li>Có bao nhiêu so sánh từng cặp giữa 5 nhóm?</li><li>Khoảng Tukey cho μ<sub>2</sub> − μ<sub>4</sub> là (−1,3; 4,8). Nhóm 2 và 4 có khác nhau có ý nghĩa không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Phương sai bằng nhau (tỉ số 3,5) cùng cỡ nhóm rất chênh — dùng Welch ANOVA (và hậu kiểm Games–Howell) hoặc biến đổi dữ liệu. 2) 5·4/2 = 10. 3) Không — khoảng chứa 0.</p></div>`);

const c83 = L('psi221-ts-8-3',
  '8.3 — Two-way ANOVA and interaction|||8.3 — ANOVA hai yếu tố và tương tác',
  'Hai yếu tố, hiệu ứng chính và tương tác; bảng ANOVA hai chiều bằng statsmodels; ví dụ cache × cơ sở dữ liệu cho độ trễ; ANOVA là hồi quy với biến giả.',
  `<span class="eyebrow">PSI221 · Chapter 8 · Lesson 8.3</span>
<h2>Two-way ANOVA and interaction</h2>
<p class="lead">Real experiments often change two things at once: cache on/off <em>and</em> SQL vs NoSQL. Two-way ANOVA separates the effect of each factor and, crucially, tells you whether the effect of one depends on the other — an <strong>interaction</strong>.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write the two-way ANOVA model with main effects and interaction.</li><li>Fit it with statsmodels and read the ANOVA table.</li><li>Interpret an interaction with an interaction (cell-means) table, and see ANOVA as a regression.</li></ul>
<h3>📖 Lecture</h3>
<p>Factor A has a levels, factor B has b levels, and each of the a·b cells has n replicates. The model</p>
<div class="formula"><span class="lbl">Two-way ANOVA with interaction</span>y<sub>ijk</sub> = μ + α<sub>i</sub> + β<sub>j</sub> + (αβ)<sub>ij</sub> + ε<sub>ijk</sub>,   ε ~ N(0, σ<sup>2</sup>)<br>SST = SS<sub>A</sub> + SS<sub>B</sub> + SS<sub>AB</sub> + SS<sub>E</sub>   with df (a − 1), (b − 1), (a − 1)(b − 1), ab(n − 1)<br>Three F-tests: F<sub>A</sub> = MS<sub>A</sub>/MS<sub>E</sub>,  F<sub>B</sub> = MS<sub>B</sub>/MS<sub>E</sub>,  F<sub>AB</sub> = MS<sub>AB</sub>/MS<sub>E</sub></div>
<p><strong>Main effect</strong> of A: does the mean response change with A, averaging over B? <strong>Interaction</strong> AB: does the effect of A differ between levels of B? In an interaction plot (cell means against A, one line per level of B), parallel lines mean no interaction; crossing or diverging lines signal one. <strong>Rule:</strong> test and interpret the interaction first. If it is significant, main effects can be misleading on their own — describe the effects of A separately for each level of B.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — latency (ms) for cache × database.</b> Three runs per cell. Cell means: cache off/SQL 121.0, off/NoSQL 110.7, on/SQL 80.7, on/NoSQL 95.3.</p>
<p>ANOVA: cache F(1, 8) = 211.3, p &lt; 0.0001; database F(1, 8) = 1.28, p = 0.29; <b>interaction F(1, 8) = 42.6, p = 0.0002</b>.</p>
<p>Reading: turning the cache on cuts latency enormously. The database main effect is “not significant”, but that is an artefact of averaging: <em>without</em> cache NoSQL is about 10 ms faster, <em>with</em> cache SQL is about 15 ms faster — the effects cancel on average. The interaction is the real story: the best choice of database depends on the caching strategy (here: cache on + SQL, 80.7 ms).</p></div>
<pre><code class="language-python">import pandas as pd
import statsmodels.api as sm
from statsmodels.formula.api import ols

# latency (ms) for 2 caches x 2 databases, 3 runs per cell
df = pd.DataFrame({
    "cache": ["off"] * 6 + ["on"] * 6,
    "db":    (["sql"] * 3 + ["nosql"] * 3) * 2,
    "ms":    [120, 125, 118, 110, 108, 114,     # cache off
              80, 84, 78, 95, 99, 92],          # cache on
})
print(df.groupby(["cache", "db"])["ms"].mean().unstack())
model = ols("ms ~ C(cache) * C(db)", data=df).fit()
print(sm.stats.anova_lm(model, typ=2).round(4))</code></pre>
<div class="out">db          nosql         sql
cache                        
off    110.666667  121.000000
on      95.333333   80.666667
                   sum_sq   df         F  PR(&gt;F)
C(cache)        2324.0833  1.0  211.2803  0.0000
C(db)             14.0833  1.0    1.2803  0.2906
C(cache):C(db)   468.7500  1.0   42.6136  0.0002
Residual          88.0000  8.0       NaN     NaN</div>
<p><strong>ANOVA is regression.</strong> The formula <code>ms ~ C(cache) * C(db)</code> builds indicator (dummy) variables for each factor and their product, then fits ordinary least squares (Chapter 9). The ANOVA table compares nested regression models — which is why t-tests, ANOVA and regression share one theory (the general linear model). <code>typ=2</code> requests Type II sums of squares; for balanced designs like this one, Types I, II and III agree.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Interpreting a non-significant main effect as “factor B does not matter” when the interaction is significant.</li><li>Running two separate one-way ANOVAs instead of one two-way ANOVA — you lose the interaction and error degrees of freedom.</li><li>Fitting an interaction with n = 1 replicate per cell: there are then no degrees of freedom left for error.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Model: grand mean + main effects + interaction + error.</li><li>Three F-tests; df (a − 1), (b − 1), (a − 1)(b − 1), ab(n − 1).</li><li>Interpret the interaction first, using cell means.</li><li>ANOVA = linear regression with categorical predictors.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.statsmodels.org/stable/anova.html" target="_blank" rel="noopener">statsmodels — ANOVA (anova_lm)</a></li><li><a href="https://online.stat.psu.edu/stat502/Lesson05.html" target="_blank" rel="noopener">Penn State STAT 502 — Lesson 5: Multi-factor ANOVA</a></li><li><a href="https://www.youtube.com/watch?v=NF5_btOaCig" target="_blank" rel="noopener">StatQuest — Using linear models for t-tests and ANOVA</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Factor A has 3 levels, B has 4, with 5 replicates per cell. Give the df of A, B, AB and error.</li><li>In an interaction plot the two lines are parallel but far apart. What does that suggest?</li><li>Using the cell means above, compute the effect of the cache for SQL and for NoSQL.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) A: 2, B: 3, AB: 6, error: 3·4·(5 − 1) = 48 (total 59 = 60 − 1). 2) A main effect of the line factor, no interaction. 3) SQL: 80.7 − 121.0 = −40.3 ms; NoSQL: 95.3 − 110.7 = −15.3 ms — the cache helps SQL much more, which is the interaction.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 8 · Bài 8.3</span>
<h2>ANOVA hai yếu tố và tương tác</h2>
<p class="lead">Thí nghiệm thật thường thay đổi hai thứ cùng lúc: bật/tắt cache <em>và</em> SQL hay NoSQL. ANOVA hai yếu tố tách hiệu ứng của từng yếu tố và, quan trọng nhất, cho biết hiệu ứng của yếu tố này có phụ thuộc yếu tố kia không — gọi là <strong>tương tác</strong>.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết mô hình ANOVA hai yếu tố với hiệu ứng chính và tương tác.</li><li>Khớp mô hình bằng statsmodels và đọc bảng ANOVA.</li><li>Diễn giải tương tác bằng bảng trung bình ô, và thấy ANOVA chính là một hồi quy.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Yếu tố A có a mức, yếu tố B có b mức, mỗi ô trong a·b ô có n lần lặp. Mô hình</p>
<div class="formula"><span class="lbl">ANOVA hai yếu tố có tương tác</span>y<sub>ijk</sub> = μ + α<sub>i</sub> + β<sub>j</sub> + (αβ)<sub>ij</sub> + ε<sub>ijk</sub>,   ε ~ N(0, σ<sup>2</sup>)<br>SST = SS<sub>A</sub> + SS<sub>B</sub> + SS<sub>AB</sub> + SS<sub>E</sub>   với bậc tự do (a − 1), (b − 1), (a − 1)(b − 1), ab(n − 1)<br>Ba kiểm định F: F<sub>A</sub> = MS<sub>A</sub>/MS<sub>E</sub>,  F<sub>B</sub> = MS<sub>B</sub>/MS<sub>E</sub>,  F<sub>AB</sub> = MS<sub>AB</sub>/MS<sub>E</sub></div>
<p><strong>Hiệu ứng chính</strong> của A: trung bình đáp ứng có thay đổi theo A không, khi lấy trung bình qua B? <strong>Tương tác</strong> AB: hiệu ứng của A có khác nhau giữa các mức của B không? Trên biểu đồ tương tác (trung bình ô theo A, mỗi mức B một đường), đường song song nghĩa là không tương tác; đường cắt nhau hoặc toả ra báo hiệu có tương tác. <strong>Quy tắc:</strong> kiểm định và diễn giải tương tác trước. Nếu nó có ý nghĩa, riêng hiệu ứng chính có thể gây hiểu lầm — hãy mô tả hiệu ứng của A riêng cho từng mức của B.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — độ trễ (ms) theo cache × cơ sở dữ liệu.</b> Ba lần chạy mỗi ô. Trung bình ô: tắt cache/SQL 121,0; tắt/NoSQL 110,7; bật/SQL 80,7; bật/NoSQL 95,3.</p>
<p>ANOVA: cache F(1, 8) = 211,3, p &lt; 0,0001; cơ sở dữ liệu F(1, 8) = 1,28, p = 0,29; <b>tương tác F(1, 8) = 42,6, p = 0,0002</b>.</p>
<p>Đọc kết quả: bật cache giảm độ trễ rất mạnh. Hiệu ứng chính của cơ sở dữ liệu “không có ý nghĩa”, nhưng đó là hệ quả của việc lấy trung bình: <em>không</em> cache thì NoSQL nhanh hơn khoảng 10 ms, <em>có</em> cache thì SQL nhanh hơn khoảng 15 ms — hai hiệu ứng triệt tiêu nhau khi lấy trung bình. Tương tác mới là câu chuyện thật: chọn cơ sở dữ liệu nào tốt nhất phụ thuộc chiến lược cache (ở đây: bật cache + SQL, 80,7 ms).</p></div>
<pre><code class="language-python">import pandas as pd
import statsmodels.api as sm
from statsmodels.formula.api import ols

# latency (ms) for 2 caches x 2 databases, 3 runs per cell
df = pd.DataFrame({
    "cache": ["off"] * 6 + ["on"] * 6,
    "db":    (["sql"] * 3 + ["nosql"] * 3) * 2,
    "ms":    [120, 125, 118, 110, 108, 114,     # cache off
              80, 84, 78, 95, 99, 92],          # cache on
})
print(df.groupby(["cache", "db"])["ms"].mean().unstack())
model = ols("ms ~ C(cache) * C(db)", data=df).fit()
print(sm.stats.anova_lm(model, typ=2).round(4))</code></pre>
<div class="out">db          nosql         sql
cache                        
off    110.666667  121.000000
on      95.333333   80.666667
                   sum_sq   df         F  PR(&gt;F)
C(cache)        2324.0833  1.0  211.2803  0.0000
C(db)             14.0833  1.0    1.2803  0.2906
C(cache):C(db)   468.7500  1.0   42.6136  0.0002
Residual          88.0000  8.0       NaN     NaN</div>
<p><strong>ANOVA là hồi quy.</strong> Công thức <code>ms ~ C(cache) * C(db)</code> dựng các biến chỉ báo (biến giả) cho mỗi yếu tố và tích của chúng, rồi khớp bình phương tối thiểu (Chương 9). Bảng ANOVA so các mô hình hồi quy lồng nhau — vì vậy kiểm định t, ANOVA và hồi quy chung một lý thuyết (mô hình tuyến tính tổng quát). <code>typ=2</code> yêu cầu tổng bình phương Loại II; với thiết kế cân bằng như ở đây, Loại I, II, III trùng nhau.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Diễn giải hiệu ứng chính không có ý nghĩa thành “yếu tố B không quan trọng” khi tương tác có ý nghĩa.</li><li>Chạy hai ANOVA một yếu tố riêng thay vì một ANOVA hai yếu tố — mất tương tác và mất bậc tự do của sai số.</li><li>Khớp tương tác khi mỗi ô chỉ có n = 1 lần lặp: khi đó không còn bậc tự do cho sai số.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Mô hình: trung bình chung + hiệu ứng chính + tương tác + sai số.</li><li>Ba kiểm định F; bậc tự do (a − 1), (b − 1), (a − 1)(b − 1), ab(n − 1).</li><li>Diễn giải tương tác trước, dùng trung bình ô.</li><li>ANOVA = hồi quy tuyến tính với biến giải thích phân loại.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.statsmodels.org/stable/anova.html" target="_blank" rel="noopener">statsmodels — ANOVA (anova_lm)</a></li><li><a href="https://online.stat.psu.edu/stat502/Lesson05.html" target="_blank" rel="noopener">Penn State STAT 502 — Bài 5: ANOVA nhiều yếu tố</a></li><li><a href="https://www.youtube.com/watch?v=NF5_btOaCig" target="_blank" rel="noopener">StatQuest — Dùng mô hình tuyến tính cho kiểm định t và ANOVA</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Yếu tố A có 3 mức, B có 4 mức, 5 lần lặp mỗi ô. Cho bậc tự do của A, B, AB và sai số.</li><li>Trên biểu đồ tương tác hai đường song song nhưng cách xa nhau. Điều đó gợi ý gì?</li><li>Dùng trung bình ô ở trên, tính hiệu ứng của cache với SQL và với NoSQL.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) A: 2, B: 3, AB: 6, sai số: 3·4·(5 − 1) = 48 (tổng 59 = 60 − 1). 2) Có hiệu ứng chính của yếu tố vẽ thành các đường, không có tương tác. 3) SQL: 80,7 − 121,0 = −40,3 ms; NoSQL: 95,3 − 110,7 = −15,3 ms — cache giúp SQL nhiều hơn hẳn, đó chính là tương tác.</p></div>`);

const q8 = QZ(8, 'Quiz — Chapter 8: Analysis of variance|||Quiz — Chương 8: Phân tích phương sai', 'Kiểm tra chương 8: ANOVA một yếu tố, bảng ANOVA, giả định, Tukey HSD, ANOVA hai yếu tố và tương tác.', [
  Q('q1', 'Why use ANOVA instead of all pairwise t-tests for 5 groups?|||Vì sao dùng ANOVA thay vì mọi kiểm định t từng cặp cho 5 nhóm?',
    ['t-tests need normal data|||kiểm định t cần dữ liệu chuẩn', '10 tests inflate the family-wise Type I error|||10 kiểm định làm tăng sai lầm loại I toàn họ', 'ANOVA needs fewer observations|||ANOVA cần ít quan sát hơn', 't-tests cannot compare means|||kiểm định t không so được trung bình'], 1,
    'Multiple testing problem (Lesson 7.3).|||Bài toán kiểm định bội (Bài 7.3).'),
  Q('q2', 'In one-way ANOVA with k groups and N observations, the error df is|||Trong ANOVA một yếu tố với k nhóm và N quan sát, bậc tự do sai số là',
    ['N − 1|||N − 1', 'k − 1|||k − 1', 'N − k|||N − k', 'N·k|||N·k'], 2,
    'Within-group df = ∑(nⱼ − 1) = N − k.|||Bậc tự do trong nhóm = ∑(nⱼ − 1) = N − k.'),
  Q('q3', 'SSB = 74.1, SSW = 34.8, k = 3, N = 15. F equals about|||SSB = 74,1, SSW = 34,8, k = 3, N = 15. F khoảng',
    ['2.13|||2,13', '12.8|||12,8', '25.6|||25,6', '0.47|||0,47'], 1,
    '(74.1/2)/(34.8/12) = 37.05/2.9.|||(74,1/2)/(34,8/12) = 37,05/2,9.'),
  Q('q4', 'Under H₀ in ANOVA, F is expected to be close to|||Khi H₀ đúng trong ANOVA, F được kỳ vọng gần',
    ['0|||0', '1|||1', 'k|||k', 'N|||N'], 1,
    'MSB and MSW both estimate σ².|||MSB và MSW cùng ước lượng σ².'),
  Q('q5', 'η² = SSB/SST measures|||η² = SSB/SST đo',
    ['the p-value|||p-value', 'the share of variation explained by the groups|||phần biến thiên do các nhóm giải thích', 'the error variance|||phương sai sai số', 'the number of groups|||số nhóm'], 1,
    'It is the ANOVA analogue of R².|||Nó là bản ANOVA của R².'),
  Q('q6', 'Which ANOVA assumption is guaranteed by design rather than by a test?|||Giả định ANOVA nào được bảo đảm bằng thiết kế chứ không bằng kiểm định?',
    ['normality|||tính chuẩn', 'equal variances|||phương sai bằng nhau', 'independence|||tính độc lập', 'balanced groups|||nhóm cân bằng'], 2,
    'Random assignment ensures independence.|||Phân nhóm ngẫu nhiên bảo đảm độc lập.'),
  Q('q7', 'Unequal variances together with unequal group sizes: a good alternative is|||Phương sai khác nhau cùng cỡ nhóm khác nhau: lựa chọn tốt là',
    ['ignore it|||bỏ qua', 'Welch’s ANOVA|||Welch ANOVA', 'a χ² test|||kiểm định χ²', 'Fisher’s exact test|||kiểm định chính xác Fisher'], 1,
    'Welch’s ANOVA does not assume equal variances.|||Welch ANOVA không giả định phương sai bằng nhau.'),
  Q('q8', 'A Tukey HSD interval for μ_B − μ_C is (1.13, 6.87). Conclusion:|||Khoảng Tukey HSD cho μ_B − μ_C là (1,13; 6,87). Kết luận:',
    ['B and C do not differ|||B và C không khác nhau', 'B is significantly larger than C|||B lớn hơn C có ý nghĩa', 'C is larger than B|||C lớn hơn B', 'cannot tell|||không kết luận được'], 1,
    'The interval excludes 0 and is positive.|||Khoảng không chứa 0 và dương.'),
  Q('q9', 'A 2 × 2 design with 3 replicates per cell has error df|||Thiết kế 2 × 2 với 3 lần lặp mỗi ô có bậc tự do sai số',
    ['11|||11', '8|||8', '4|||4', '3|||3'], 1,
    'ab(n − 1) = 4·2 = 8.|||ab(n − 1) = 4·2 = 8.'),
  Q('q10', 'The interaction is significant but the main effect of B is not. You should|||Tương tác có ý nghĩa nhưng hiệu ứng chính của B thì không. Bạn nên',
    ['conclude B does not matter|||kết luận B không quan trọng', 'describe the effect of B separately at each level of A|||mô tả hiệu ứng của B riêng ở từng mức của A', 'drop the interaction|||bỏ tương tác', 'run one-way ANOVAs|||chạy các ANOVA một yếu tố'], 1,
    'Effects of B can cancel when averaged over A.|||Hiệu ứng của B có thể triệt tiêu khi lấy trung bình qua A.'),
]);

const ch8 = {
  title: 'Chapter 8 — Analysis of variance (ANOVA)|||Chương 8 — Phân tích phương sai (ANOVA)',
  description: 'ANOVA một yếu tố và bảng ANOVA, η², giả định và cách kiểm, Welch ANOVA, Tukey HSD, ANOVA hai yếu tố và tương tác, ANOVA như hồi quy (OpenIntro 7.5 · OpenStax Ch. 13 · NIST 7.4.3).',
  lessons: [c81, c82, c83, q8],
};


// ───────────────────────────── Chương 9 — Hồi quy & tương quan ─────────────────────────────
const c91 = L('psi221-ts-9-1',
  '9.1 — Correlation: Pearson r, its test and Spearman’s rank correlation|||9.1 — Tương quan: hệ số Pearson r, kiểm định và tương quan hạng Spearman',
  'Hệ số tương quan mẫu r, kiểm định H₀: ρ = 0 bằng t = r√(n − 2)/√(1 − r²), khoảng tin cậy Fisher z, Spearman; tương quan không phải nhân quả; ví dụ giờ học và điểm.',
  `<span class="eyebrow">PSI221 · Chapter 9 · Lesson 9.1</span>
<h2>Correlation: Pearson r, its test and Spearman's rank correlation</h2>
<p class="lead">IPY111 defined the correlation ρ of two random variables. Here we estimate it from data, test whether it is zero, put a confidence interval around it — and learn the many ways a correlation can mislead.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute the sample correlation r and interpret its sign and size.</li><li>Test H<sub>0</sub>: ρ = 0 and build a Fisher-z confidence interval for ρ.</li><li>Use Spearman's rank correlation and recognise the limits of correlation.</li></ul>
<h3>📖 Lecture</h3>
<p>For pairs (x<sub>i</sub>, y<sub>i</sub>), with S<sub>xx</sub> = ∑(x<sub>i</sub> − x̄)<sup>2</sup>, S<sub>yy</sub> = ∑(y<sub>i</sub> − ȳ)<sup>2</sup>, S<sub>xy</sub> = ∑(x<sub>i</sub> − x̄)(y<sub>i</sub> − ȳ):</p>
<div class="formula"><span class="lbl">Sample correlation and its test</span>r = S<sub>xy</sub> / √(S<sub>xx</sub>·S<sub>yy</sub>),   −1 ≤ r ≤ 1<br>H<sub>0</sub>: ρ = 0:   T = r√(n − 2) / √(1 − r<sup>2</sup>) ~ t(n − 2)   (bivariate normal data)<br>CI for ρ: z = artanh(r) = ½ ln((1 + r)/(1 − r)) ≈ N(artanh ρ, 1/(n − 3)); build z ± 1.96/√(n − 3), transform back with tanh</div>
<p>r measures the strength of the <strong>linear</strong> association only. |r| near 1: points close to a line; r near 0: no linear trend (but maybe a strong curved one — y = x<sup>2</sup> on symmetric x has r = 0). r has no units and is symmetric in x and y. r<sup>2</sup> is the share of the variance of y explained by a linear fit on x (Lesson 9.2).</p>
<p><strong>Spearman's ρ<sub>s</sub></strong> is the Pearson correlation of the ranks. It measures any monotone relationship and is robust to outliers — useful for skewed data such as response times or for ordinal ratings.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — study hours and exam score.</b> Ten students: hours 2, 3, …, 11; scores 52, 55, 61, 60, 68, 70, 74, 79, 80, 88.</p>
<p>Step 1: S<sub>xx</sub> = 82.5, S<sub>xy</sub> = 316.5, S<sub>yy</sub> = 1238.1, so r = 316.5/√(82.5·1238.1) = <b>0.990</b>. Step 2: t = 0.990·√8/√(1 − 0.981) = <b>20.16</b> on 8 df, p ≈ 4·10<sup>−8</sup>. Step 3: Fisher-z 95% CI for ρ: <b>(0.958, 0.998)</b>. Spearman ρ<sub>s</sub> = 0.988. A very strong positive linear association.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

hours = np.array([2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
score = np.array([52, 55, 61, 60, 68, 70, 74, 79, 80, 88])
r, p = stats.pearsonr(hours, score)
n = len(hours)
t = r * np.sqrt(n - 2) / np.sqrt(1 - r**2)
print(f"r = {r:.4f}, t = {t:.3f} on {n - 2} df, p = {p:.2e}")
ci = stats.pearsonr(hours, score).confidence_interval(0.95)    # Fisher z method
print(f"95% CI for rho: ({ci.low:.4f}, {ci.high:.4f})")
rho, ps = stats.spearmanr(hours, score)
print(f"Spearman rho = {rho:.4f}, p = {ps:.2e}")</code></pre>
<div class="out">r = 0.9903, t = 20.164 on 8 df, p = 3.82e-08
95% CI for rho: (0.9580, 0.9978)
Spearman rho = 0.9879, p = 9.31e-08</div>
<h3>How correlations mislead</h3>
<ul>
<li><strong>Correlation is not causation.</strong> Students who study more may also sleep better, attend more classes or have stronger backgrounds. Only a randomised experiment (or careful causal methods) supports “hours cause scores”.</li>
<li><strong>Confounding and lurking variables.</strong> Ice-cream sales correlate with drowning — both are driven by summer heat.</li>
<li><strong>Outliers.</strong> A single extreme point can create or destroy a correlation. Always plot first (Anscombe's quartet: four data sets with r ≈ 0.82 that look completely different).</li>
<li><strong>Restricted range.</strong> Correlation within a narrow slice (only top students) is weaker than in the full population.</li>
<li><strong>Significant ≠ strong.</strong> With n = 10 000, r = 0.03 is “significant” yet practically zero.</li>
</ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Reporting r without a scatter plot.</li><li>Using n − 1 instead of n − 2 degrees of freedom for the test.</li><li>Building a symmetric interval r ± 1.96·SE: near ±1 the distribution of r is very skewed — use Fisher's z.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>r = S<sub>xy</sub>/√(S<sub>xx</sub>S<sub>yy</sub>) measures linear association, unitless, in [−1, 1].</li><li>Test ρ = 0 with t = r√(n − 2)/√(1 − r<sup>2</sup>) on n − 2 df.</li><li>CI via Fisher's z = artanh r with SE 1/√(n − 3).</li><li>Spearman for monotone or outlier-prone data; correlation ≠ causation.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/12-4-testing-the-significance-of-the-correlation-coefficient" target="_blank" rel="noopener">OpenStax — 12.4 Testing the significance of the correlation coefficient</a></li><li><a href="https://www.youtube.com/watch?v=xZ_z8KWkhXE" target="_blank" rel="noopener">StatQuest — Pearson's correlation, clearly explained</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.pearsonr.html" target="_blank" rel="noopener">SciPy — pearsonr (with confidence_interval)</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.spearmanr.html" target="_blank" rel="noopener">SciPy — spearmanr</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>n = 27, r = 0.40. Compute t and decide at 5% (t<sub>0.025, 25</sub> = 2.060).</li><li>Give an x-pattern for which r = 0 although y is a perfect function of x.</li><li>A study finds r = 0.6 between hours on social media and anxiety scores. Write one sentence a careful analyst would add.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) t = 0.4·5/√0.84 = 2.18 &gt; 2.060 ⇒ significant (p ≈ 0.039). 2) x = −2, −1, 0, 1, 2 with y = x<sup>2</sup>. 3) “This is an association in observational data; it does not show that social media causes anxiety — the direction could be reversed or both could depend on other factors.”</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 9 · Bài 9.1</span>
<h2>Tương quan: hệ số Pearson r, kiểm định và tương quan hạng Spearman</h2>
<p class="lead">IPY111 đã định nghĩa hệ số tương quan ρ của hai biến ngẫu nhiên. Ở đây ta ước lượng nó từ dữ liệu, kiểm định xem nó có bằng 0 không, dựng khoảng tin cậy quanh nó — và học những cách mà một hệ số tương quan có thể đánh lừa.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính hệ số tương quan mẫu r và diễn giải dấu, độ lớn.</li><li>Kiểm định H<sub>0</sub>: ρ = 0 và dựng khoảng tin cậy Fisher-z cho ρ.</li><li>Dùng tương quan hạng Spearman và nhận ra giới hạn của tương quan.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Với các cặp (x<sub>i</sub>, y<sub>i</sub>), đặt S<sub>xx</sub> = ∑(x<sub>i</sub> − x̄)<sup>2</sup>, S<sub>yy</sub> = ∑(y<sub>i</sub> − ȳ)<sup>2</sup>, S<sub>xy</sub> = ∑(x<sub>i</sub> − x̄)(y<sub>i</sub> − ȳ):</p>
<div class="formula"><span class="lbl">Tương quan mẫu và kiểm định</span>r = S<sub>xy</sub> / √(S<sub>xx</sub>·S<sub>yy</sub>),   −1 ≤ r ≤ 1<br>H<sub>0</sub>: ρ = 0:   T = r√(n − 2) / √(1 − r<sup>2</sup>) ~ t(n − 2)   (dữ liệu chuẩn hai chiều)<br>KTC cho ρ: z = artanh(r) = ½ ln((1 + r)/(1 − r)) ≈ N(artanh ρ, 1/(n − 3)); dựng z ± 1,96/√(n − 3), đổi ngược bằng tanh</div>
<p>r chỉ đo độ mạnh của liên hệ <strong>tuyến tính</strong>. |r| gần 1: các điểm gần một đường thẳng; r gần 0: không có xu hướng tuyến tính (nhưng có thể có quan hệ cong rất mạnh — y = x<sup>2</sup> với x đối xứng có r = 0). r không có đơn vị và đối xứng giữa x và y. r<sup>2</sup> là phần phương sai của y được giải thích bởi đường thẳng khớp theo x (Bài 9.2).</p>
<p><strong>ρ<sub>s</sub> của Spearman</strong> là hệ số Pearson của các thứ hạng. Nó đo mọi quan hệ đơn điệu và bền với ngoại lai — hữu ích cho dữ liệu lệch như thời gian phản hồi hoặc thang đánh giá thứ bậc.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — giờ tự học và điểm thi.</b> Mười sinh viên: giờ học 2, 3, …, 11; điểm 52, 55, 61, 60, 68, 70, 74, 79, 80, 88.</p>
<p>Bước 1: S<sub>xx</sub> = 82,5, S<sub>xy</sub> = 316,5, S<sub>yy</sub> = 1238,1, nên r = 316,5/√(82,5·1238,1) = <b>0,990</b>. Bước 2: t = 0,990·√8/√(1 − 0,981) = <b>20,16</b> với 8 bậc tự do, p ≈ 4·10<sup>−8</sup>. Bước 3: KTC 95% Fisher-z cho ρ: <b>(0,958; 0,998)</b>. Spearman ρ<sub>s</sub> = 0,988. Liên hệ tuyến tính dương rất mạnh.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

hours = np.array([2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
score = np.array([52, 55, 61, 60, 68, 70, 74, 79, 80, 88])
r, p = stats.pearsonr(hours, score)
n = len(hours)
t = r * np.sqrt(n - 2) / np.sqrt(1 - r**2)
print(f"r = {r:.4f}, t = {t:.3f} on {n - 2} df, p = {p:.2e}")
ci = stats.pearsonr(hours, score).confidence_interval(0.95)    # Fisher z method
print(f"95% CI for rho: ({ci.low:.4f}, {ci.high:.4f})")
rho, ps = stats.spearmanr(hours, score)
print(f"Spearman rho = {rho:.4f}, p = {ps:.2e}")</code></pre>
<div class="out">r = 0.9903, t = 20.164 on 8 df, p = 3.82e-08
95% CI for rho: (0.9580, 0.9978)
Spearman rho = 0.9879, p = 9.31e-08</div>
<h3>Tương quan đánh lừa thế nào</h3>
<ul>
<li><strong>Tương quan không phải nhân quả.</strong> Sinh viên học nhiều có thể cũng ngủ đủ, đi học đều hơn hoặc có nền tốt hơn. Chỉ thí nghiệm ngẫu nhiên hoá (hoặc phương pháp nhân quả cẩn thận) mới ủng hộ “giờ học gây ra điểm cao”.</li>
<li><strong>Biến gây nhiễu và biến ẩn.</strong> Doanh số kem tương quan với số vụ đuối nước — cả hai đều do nắng nóng mùa hè.</li>
<li><strong>Ngoại lai.</strong> Một điểm cực đoan có thể tạo ra hoặc phá huỷ một tương quan. Luôn vẽ trước (bộ tứ Anscombe: bốn bộ dữ liệu có r ≈ 0,82 nhưng trông hoàn toàn khác nhau).</li>
<li><strong>Phạm vi bị thu hẹp.</strong> Tương quan trong một lát cắt hẹp (chỉ sinh viên giỏi) yếu hơn trong toàn tổng thể.</li>
<li><strong>Có ý nghĩa ≠ mạnh.</strong> Với n = 10 000, r = 0,03 “có ý nghĩa” nhưng thực tế gần bằng 0.</li>
</ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Báo cáo r mà không có biểu đồ phân tán.</li><li>Dùng n − 1 thay vì n − 2 bậc tự do cho kiểm định.</li><li>Dựng khoảng đối xứng r ± 1,96·SE: gần ±1 phân phối của r rất lệch — hãy dùng Fisher z.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>r = S<sub>xy</sub>/√(S<sub>xx</sub>S<sub>yy</sub>) đo liên hệ tuyến tính, không đơn vị, trong [−1, 1].</li><li>Kiểm định ρ = 0 bằng t = r√(n − 2)/√(1 − r<sup>2</sup>) với n − 2 bậc tự do.</li><li>KTC qua Fisher z = artanh r với SE 1/√(n − 3).</li><li>Spearman cho quan hệ đơn điệu hoặc dữ liệu có ngoại lai; tương quan ≠ nhân quả.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/12-4-testing-the-significance-of-the-correlation-coefficient" target="_blank" rel="noopener">OpenStax — 12.4 Kiểm định ý nghĩa của hệ số tương quan</a></li><li><a href="https://www.youtube.com/watch?v=xZ_z8KWkhXE" target="_blank" rel="noopener">StatQuest — Tương quan Pearson, giải thích rõ ràng</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.pearsonr.html" target="_blank" rel="noopener">SciPy — pearsonr (có confidence_interval)</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.spearmanr.html" target="_blank" rel="noopener">SciPy — spearmanr</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>n = 27, r = 0,40. Tính t và quyết định ở mức 5% (t<sub>0,025; 25</sub> = 2,060).</li><li>Cho một bộ x mà r = 0 dù y là hàm hoàn hảo của x.</li><li>Một nghiên cứu thấy r = 0,6 giữa giờ dùng mạng xã hội và điểm lo âu. Viết một câu mà người phân tích cẩn thận sẽ thêm vào.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) t = 0,4·5/√0,84 = 2,18 &gt; 2,060 ⇒ có ý nghĩa (p ≈ 0,039). 2) x = −2, −1, 0, 1, 2 với y = x<sup>2</sup>. 3) “Đây là liên hệ trong dữ liệu quan sát; nó không chứng tỏ mạng xã hội gây lo âu — chiều có thể ngược lại hoặc cả hai cùng phụ thuộc yếu tố khác.”</p></div>`);

const c92 = L('psi221-ts-9-2',
  '9.2 — Simple linear regression: least squares and R²|||9.2 — Hồi quy tuyến tính đơn: bình phương tối thiểu và R²',
  'Mô hình Y = β₀ + β₁x + ε, công thức b₁ = Sxy/Sxx, b₀ = ȳ − b₁x̄, phần dư, phân tích SST = SSR + SSE, R² = r², liên hệ với MLE; ví dụ giờ học – điểm.',
  `<span class="eyebrow">PSI221 · Chapter 9 · Lesson 9.2</span>
<h2>Simple linear regression: least squares and R<sup>2</sup></h2>
<p class="lead">Correlation says “these move together”. Regression goes further: it gives an equation to <em>predict</em> y from x and says how much y changes per unit of x. It is the foundation of most of machine learning.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write the simple linear regression model and its assumptions.</li><li>Derive and compute the least-squares estimates b<sub>0</sub>, b<sub>1</sub>.</li><li>Decompose variation, compute R<sup>2</sup> and interpret slope, intercept and residuals.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Model</span>Y<sub>i</sub> = β<sub>0</sub> + β<sub>1</sub>x<sub>i</sub> + ε<sub>i</sub>,   ε<sub>i</sub> i.i.d. N(0, σ<sup>2</sup>)   (x treated as fixed)</div>
<p><strong>Least squares</strong> chooses b<sub>0</sub>, b<sub>1</sub> to minimise SSE = ∑(y<sub>i</sub> − b<sub>0</sub> − b<sub>1</sub>x<sub>i</sub>)<sup>2</sup>. Setting both partial derivatives to zero gives the <em>normal equations</em> and</p>
<div class="formula"><span class="lbl">Least-squares estimates</span>b<sub>1</sub> = S<sub>xy</sub> / S<sub>xx</sub> = r·(s<sub>y</sub>/s<sub>x</sub>)      b<sub>0</sub> = ȳ − b<sub>1</sub>x̄      fitted ŷ<sub>i</sub> = b<sub>0</sub> + b<sub>1</sub>x<sub>i</sub>,  residual e<sub>i</sub> = y<sub>i</sub> − ŷ<sub>i</sub></div>
<p>Properties: the line passes through (x̄, ȳ); residuals sum to zero and are uncorrelated with x. Under normal errors, least squares <em>is</em> maximum likelihood (the normal log-likelihood is −SSE/(2σ<sup>2</sup>) plus constants) — the link to Chapter 2.</p>
<div class="formula"><span class="lbl">Decomposition and R²</span>SST = ∑(y<sub>i</sub> − ȳ)<sup>2</sup> = SSR = ∑(ŷ<sub>i</sub> − ȳ)<sup>2</sup> + SSE = ∑e<sub>i</sub><sup>2</sup>      R<sup>2</sup> = SSR/SST = 1 − SSE/SST = r<sup>2</sup></div>
<p>R<sup>2</sup> is the share of the variation of y explained by the line. Interpretation of the coefficients: b<sub>1</sub> is the predicted change in y per one-unit increase in x; b<sub>0</sub> is the predicted y at x = 0, meaningful only if x = 0 is within (or near) the data range.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — hours and score (data of Lesson 9.1).</b></p>
<p>Step 1: x̄ = 6.5, ȳ = 68.7, S<sub>xx</sub> = 82.5, S<sub>xy</sub> = 316.5. Step 2: b<sub>1</sub> = 316.5/82.5 = <b>3.836</b> points per hour. Step 3: b<sub>0</sub> = 68.7 − 3.836·6.5 = <b>43.76</b>. Step 4: R<sup>2</sup> = 0.9807 = 0.9903<sup>2</sup>: 98% of the variation in scores is explained by hours (in this small, tidy data set). Step 5: prediction for 7.5 hours: 43.76 + 3.836·7.5 = <b>72.54</b>.</p>
<p>Interpretation: each extra hour of study is associated with about 3.8 more points. The intercept (43.8 at 0 hours) is an extrapolation — no student in the data studied fewer than 2 hours.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

x = np.array([2, 3, 4, 5, 6, 7, 8, 9, 10, 11], dtype=float)
y = np.array([52, 55, 61, 60, 68, 70, 74, 79, 80, 88], dtype=float)
Sxx = ((x - x.mean())**2).sum()
Sxy = ((x - x.mean()) * (y - y.mean())).sum()
b1 = Sxy / Sxx
b0 = y.mean() - b1 * x.mean()
resid = y - (b0 + b1 * x)
sse, sst = (resid**2).sum(), ((y - y.mean())**2).sum()
print(f"Sxx = {Sxx:.1f}, Sxy = {Sxy:.1f}")
print(f"b1 = {b1:.4f}, b0 = {b0:.4f}, R^2 = {1 - sse / sst:.4f}")
fit = stats.linregress(x, y)
print(f"linregress: slope = {fit.slope:.4f}, intercept = {fit.intercept:.4f}, r^2 = {fit.rvalue**2:.4f}")
print(f"predicted score after 7.5 h: {b0 + b1 * 7.5:.2f}")</code></pre>
<div class="out">Sxx = 82.5, Sxy = 316.5
b1 = 3.8364, b0 = 43.7636, R^2 = 0.9807
linregress: slope = 3.8364, intercept = 43.7636, r^2 = 0.9807
predicted score after 7.5 h: 72.54</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Extrapolating far outside the x-range (predicting the score after 30 hours = 159 points!).</li><li>Regressing x on y and inverting: the regression of y on x and of x on y are different lines unless r = ±1.</li><li>Calling a high R<sup>2</sup> proof of a good model — check residual plots (Lesson 9.4); a curved pattern can have R<sup>2</sup> = 0.9.</li><li>Reading the slope causally from observational data.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>b<sub>1</sub> = S<sub>xy</sub>/S<sub>xx</sub>, b<sub>0</sub> = ȳ − b<sub>1</sub>x̄; the line goes through (x̄, ȳ).</li><li>Least squares = MLE under normal errors.</li><li>SST = SSR + SSE; R<sup>2</sup> = SSR/SST = r<sup>2</sup> in simple regression.</li><li>Interpret the slope per unit of x; avoid extrapolation.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/12-3-the-regression-equation" target="_blank" rel="noopener">OpenStax — 12.3 The regression equation</a></li><li><a href="https://www.youtube.com/watch?v=PaFPbb66DxQ" target="_blank" rel="noopener">StatQuest — The main ideas of fitting a line to data (least squares)</a></li><li><a href="https://www.youtube.com/watch?v=2AQKmw14mHM" target="_blank" rel="noopener">StatQuest — R-squared, clearly explained</a></li><li><a href="https://online.stat.psu.edu/stat415/Lesson12.html" target="_blank" rel="noopener">Penn State STAT 415 — Lesson 12: Simple linear regression</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>x̄ = 10, ȳ = 50, S<sub>xx</sub> = 40, S<sub>xy</sub> = 120. Find the regression line.</li><li>If r = −0.5, s<sub>x</sub> = 2 and s<sub>y</sub> = 8, what is b<sub>1</sub>?</li><li>SST = 200 and SSE = 50. Compute R<sup>2</sup> and |r|.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) b<sub>1</sub> = 3, b<sub>0</sub> = 50 − 30 = 20: ŷ = 20 + 3x. 2) b<sub>1</sub> = −0.5·8/2 = −2. 3) R<sup>2</sup> = 0.75, |r| = 0.866.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 9 · Bài 9.2</span>
<h2>Hồi quy tuyến tính đơn: bình phương tối thiểu và R<sup>2</sup></h2>
<p class="lead">Tương quan nói “chúng đi cùng nhau”. Hồi quy đi xa hơn: nó cho một phương trình để <em>dự đoán</em> y từ x và cho biết y đổi bao nhiêu trên mỗi đơn vị x. Đây là nền móng của phần lớn học máy.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết mô hình hồi quy tuyến tính đơn và các giả định.</li><li>Suy ra và tính ước lượng bình phương tối thiểu b<sub>0</sub>, b<sub>1</sub>.</li><li>Phân tích biến thiên, tính R<sup>2</sup>, diễn giải hệ số góc, hệ số chặn và phần dư.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Mô hình</span>Y<sub>i</sub> = β<sub>0</sub> + β<sub>1</sub>x<sub>i</sub> + ε<sub>i</sub>,   ε<sub>i</sub> i.i.d. N(0, σ<sup>2</sup>)   (x coi là cố định)</div>
<p><strong>Bình phương tối thiểu</strong> chọn b<sub>0</sub>, b<sub>1</sub> để cực tiểu SSE = ∑(y<sub>i</sub> − b<sub>0</sub> − b<sub>1</sub>x<sub>i</sub>)<sup>2</sup>. Cho hai đạo hàm riêng bằng 0 được <em>hệ phương trình chuẩn</em> và</p>
<div class="formula"><span class="lbl">Ước lượng bình phương tối thiểu</span>b<sub>1</sub> = S<sub>xy</sub> / S<sub>xx</sub> = r·(s<sub>y</sub>/s<sub>x</sub>)      b<sub>0</sub> = ȳ − b<sub>1</sub>x̄      giá trị khớp ŷ<sub>i</sub> = b<sub>0</sub> + b<sub>1</sub>x<sub>i</sub>,  phần dư e<sub>i</sub> = y<sub>i</sub> − ŷ<sub>i</sub></div>
<p>Tính chất: đường thẳng đi qua (x̄, ȳ); tổng phần dư bằng 0 và phần dư không tương quan với x. Khi sai số chuẩn, bình phương tối thiểu <em>chính là</em> hợp lý cực đại (log-hợp lý chuẩn là −SSE/(2σ<sup>2</sup>) cộng hằng số) — cầu nối với Chương 2.</p>
<div class="formula"><span class="lbl">Phân tích biến thiên và R²</span>SST = ∑(y<sub>i</sub> − ȳ)<sup>2</sup> = SSR = ∑(ŷ<sub>i</sub> − ȳ)<sup>2</sup> + SSE = ∑e<sub>i</sub><sup>2</sup>      R<sup>2</sup> = SSR/SST = 1 − SSE/SST = r<sup>2</sup></div>
<p>R<sup>2</sup> là phần biến thiên của y được đường thẳng giải thích. Diễn giải hệ số: b<sub>1</sub> là thay đổi dự đoán của y khi x tăng một đơn vị; b<sub>0</sub> là y dự đoán tại x = 0, chỉ có nghĩa khi x = 0 nằm trong (hoặc gần) phạm vi dữ liệu.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — giờ học và điểm (dữ liệu Bài 9.1).</b></p>
<p>Bước 1: x̄ = 6,5, ȳ = 68,7, S<sub>xx</sub> = 82,5, S<sub>xy</sub> = 316,5. Bước 2: b<sub>1</sub> = 316,5/82,5 = <b>3,836</b> điểm mỗi giờ. Bước 3: b<sub>0</sub> = 68,7 − 3,836·6,5 = <b>43,76</b>. Bước 4: R<sup>2</sup> = 0,9807 = 0,9903<sup>2</sup>: 98% biến thiên của điểm được giải thích bởi giờ học (trong bộ dữ liệu nhỏ, gọn này). Bước 5: dự đoán cho 7,5 giờ: 43,76 + 3,836·7,5 = <b>72,54</b>.</p>
<p>Diễn giải: mỗi giờ học thêm gắn với khoảng 3,8 điểm cao hơn. Hệ số chặn (43,8 điểm tại 0 giờ) là ngoại suy — không sinh viên nào trong dữ liệu học dưới 2 giờ.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

x = np.array([2, 3, 4, 5, 6, 7, 8, 9, 10, 11], dtype=float)
y = np.array([52, 55, 61, 60, 68, 70, 74, 79, 80, 88], dtype=float)
Sxx = ((x - x.mean())**2).sum()
Sxy = ((x - x.mean()) * (y - y.mean())).sum()
b1 = Sxy / Sxx
b0 = y.mean() - b1 * x.mean()
resid = y - (b0 + b1 * x)
sse, sst = (resid**2).sum(), ((y - y.mean())**2).sum()
print(f"Sxx = {Sxx:.1f}, Sxy = {Sxy:.1f}")
print(f"b1 = {b1:.4f}, b0 = {b0:.4f}, R^2 = {1 - sse / sst:.4f}")
fit = stats.linregress(x, y)
print(f"linregress: slope = {fit.slope:.4f}, intercept = {fit.intercept:.4f}, r^2 = {fit.rvalue**2:.4f}")
print(f"predicted score after 7.5 h: {b0 + b1 * 7.5:.2f}")</code></pre>
<div class="out">Sxx = 82.5, Sxy = 316.5
b1 = 3.8364, b0 = 43.7636, R^2 = 0.9807
linregress: slope = 3.8364, intercept = 43.7636, r^2 = 0.9807
predicted score after 7.5 h: 72.54</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Ngoại suy xa ngoài phạm vi x (dự đoán điểm sau 30 giờ = 159 điểm!).</li><li>Hồi quy x theo y rồi đảo ngược: hồi quy y theo x và x theo y là hai đường khác nhau trừ khi r = ±1.</li><li>Coi R<sup>2</sup> cao là bằng chứng mô hình tốt — hãy xem đồ thị phần dư (Bài 9.4); một mẫu hình cong vẫn có thể có R<sup>2</sup> = 0,9.</li><li>Đọc hệ số góc như quan hệ nhân quả từ dữ liệu quan sát.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>b<sub>1</sub> = S<sub>xy</sub>/S<sub>xx</sub>, b<sub>0</sub> = ȳ − b<sub>1</sub>x̄; đường thẳng qua (x̄, ȳ).</li><li>Bình phương tối thiểu = MLE khi sai số chuẩn.</li><li>SST = SSR + SSE; R<sup>2</sup> = SSR/SST = r<sup>2</sup> trong hồi quy đơn.</li><li>Diễn giải hệ số góc theo mỗi đơn vị x; tránh ngoại suy.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/12-3-the-regression-equation" target="_blank" rel="noopener">OpenStax — 12.3 Phương trình hồi quy</a></li><li><a href="https://www.youtube.com/watch?v=PaFPbb66DxQ" target="_blank" rel="noopener">StatQuest — Ý tưởng chính của việc khớp đường thẳng (bình phương tối thiểu)</a></li><li><a href="https://www.youtube.com/watch?v=2AQKmw14mHM" target="_blank" rel="noopener">StatQuest — R-squared, giải thích rõ ràng</a></li><li><a href="https://online.stat.psu.edu/stat415/Lesson12.html" target="_blank" rel="noopener">Penn State STAT 415 — Bài 12: Hồi quy tuyến tính đơn</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>x̄ = 10, ȳ = 50, S<sub>xx</sub> = 40, S<sub>xy</sub> = 120. Tìm đường hồi quy.</li><li>Nếu r = −0,5, s<sub>x</sub> = 2 và s<sub>y</sub> = 8 thì b<sub>1</sub> bằng bao nhiêu?</li><li>SST = 200 và SSE = 50. Tính R<sup>2</sup> và |r|.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) b<sub>1</sub> = 3, b<sub>0</sub> = 50 − 30 = 20: ŷ = 20 + 3x. 2) b<sub>1</sub> = −0,5·8/2 = −2. 3) R<sup>2</sup> = 0,75, |r| = 0,866.</p></div>`);

const c93 = L('psi221-ts-9-3',
  '9.3 — Inference for regression: slope tests, confidence and prediction intervals|||9.3 — Suy luận cho hồi quy: kiểm định hệ số góc, khoảng tin cậy và khoảng dự báo',
  'Ước lượng σ bằng s = √(SSE/(n − 2)), SE(b₁) = s/√Sxx, kiểm định t cho β₁ (trùng kiểm định ρ = 0), KTC cho β₁, KTC cho trung bình đáp ứng và khoảng dự báo; statsmodels OLS.',
  `<span class="eyebrow">PSI221 · Chapter 9 · Lesson 9.3</span>
<h2>Inference for regression: slope tests, confidence and prediction intervals</h2>
<p class="lead">A fitted line from 10 points is an estimate. A different 10 students would give a different line. Inference for regression quantifies that uncertainty — for the slope, for the average response at a given x, and for one new individual.</p>
<h3>🎯 Objectives</h3>
<ul><li>Estimate σ and compute the standard errors of b<sub>1</sub> and b<sub>0</sub>.</li><li>Test H<sub>0</sub>: β<sub>1</sub> = 0 and build a CI for the slope.</li><li>Distinguish the confidence interval for the mean response from the prediction interval for a new observation.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Residual standard error</span>s<sup>2</sup> = SSE/(n − 2)   (two parameters estimated ⇒ n − 2 df)      s = √(SSE/(n − 2))</div>
<div class="formula"><span class="lbl">Inference for the slope</span>SE(b<sub>1</sub>) = s / √S<sub>xx</sub>      T = (b<sub>1</sub> − β<sub>1,0</sub>)/SE(b<sub>1</sub>) ~ t(n − 2)      CI: b<sub>1</sub> ± t<sub>α/2, n−2</sub>·SE(b<sub>1</sub>)<br>SE(b<sub>0</sub>) = s·√(1/n + x̄<sup>2</sup>/S<sub>xx</sub>)</div>
<p>The test of H<sub>0</sub>: β<sub>1</sub> = 0 (“x has no linear relationship with y”) gives exactly the same t as the correlation test of Lesson 9.1. SE(b<sub>1</sub>) shrinks when the x values are more spread out (large S<sub>xx</sub>) — a design lesson: to estimate a slope well, measure at widely separated x.</p>
<div class="formula"><span class="lbl">At a new value x₀</span>ŷ<sub>0</sub> = b<sub>0</sub> + b<sub>1</sub>x<sub>0</sub><br>CI for the mean response E[Y | x<sub>0</sub>]:   ŷ<sub>0</sub> ± t*·s·√( 1/n + (x<sub>0</sub> − x̄)<sup>2</sup>/S<sub>xx</sub> )<br>Prediction interval for one new Y:   ŷ<sub>0</sub> ± t*·s·√( 1 + 1/n + (x<sub>0</sub> − x̄)<sup>2</sup>/S<sub>xx</sub> )</div>
<p>The extra “1” in the prediction interval is the individual scatter σ<sup>2</sup> around the line, which never shrinks with more data. Both intervals are narrowest at x<sub>0</sub> = x̄ and widen as x<sub>0</sub> moves away — another reason not to extrapolate.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — hours and score, continued.</b> n = 10, b<sub>1</sub> = 3.836, S<sub>xx</sub> = 82.5, SSE = 23.89.</p>
<p>Step 1: s = √(23.89/8) = <b>1.728</b> points. Step 2: SE(b<sub>1</sub>) = 1.728/√82.5 = <b>0.190</b>; t = 3.836/0.190 = 20.16 (same as Lesson 9.1). Step 3: t<sub>0.025, 8</sub> = 2.306 ⇒ 95% CI for β<sub>1</sub>: 3.836 ± 2.306·0.190 = <b>(3.40, 4.28)</b> points per hour. Step 4: at x<sub>0</sub> = 7.5 h, ŷ<sub>0</sub> = 72.54; CI for the <em>average</em> score of all students who study 7.5 h: <b>(71.20, 73.87)</b>; prediction interval for <em>one</em> such student: <b>(68.33, 76.74)</b>.</p></div>
<pre><code class="language-python">import numpy as np
import statsmodels.api as sm

x = np.array([2, 3, 4, 5, 6, 7, 8, 9, 10, 11], dtype=float)
y = np.array([52, 55, 61, 60, 68, 70, 74, 79, 80, 88], dtype=float)
model = sm.OLS(y, sm.add_constant(x)).fit()
print("coef  :", model.params.round(4))
print("SE    :", model.bse.round(4))
print("t     :", model.tvalues.round(3))
print("95% CI for slope:", model.conf_int(0.05)[1].round(4))
print(f"s (residual SE) = {np.sqrt(model.scale):.4f}")
pred = model.get_prediction(np.array([[1.0, 7.5]])).summary_frame(alpha=0.05)
print(pred[["mean", "mean_ci_lower", "mean_ci_upper", "obs_ci_lower", "obs_ci_upper"]].round(2))</code></pre>
<div class="out">coef  : [43.7636  3.8364]
SE    : [1.352  0.1903]
t     : [32.369 20.164]
95% CI for slope: [3.3976 4.2751]
s (residual SE) = 1.7281
    mean  mean_ci_lower  mean_ci_upper  obs_ci_lower  obs_ci_upper
0  72.54           71.2          73.87         68.33         76.74</div>
<p>In statsmodels, <code>summary_frame</code> returns both intervals: <code>mean_ci_*</code> for the mean response and <code>obs_ci_*</code> for a new observation. <code>model.summary()</code> prints the full regression table (coefficients, SEs, t, p, R<sup>2</sup>, F).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using the CI for the mean when the question is about one individual (“what score will Lan get?”) — that needs the prediction interval.</li><li>Using n − 1 df instead of n − 2.</li><li>Interpreting a non-significant slope as “no relationship” when the relationship is curved.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>s = √(SSE/(n − 2)); SE(b<sub>1</sub>) = s/√S<sub>xx</sub>; t-test on n − 2 df.</li><li>Testing β<sub>1</sub> = 0 ⇔ testing ρ = 0.</li><li>Mean-response CI vs prediction interval: the latter adds the “1 +” term and is much wider.</li><li>Both widen away from x̄.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/12-5-prediction" target="_blank" rel="noopener">OpenStax — 12.5 Prediction</a></li><li><a href="https://online.stat.psu.edu/stat501/Lesson03.html" target="_blank" rel="noopener">Penn State STAT 501 — Lesson 3: SLR estimation and prediction</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class26-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 26: Linear regression</a></li><li><a href="https://www.statsmodels.org/stable/generated/statsmodels.regression.linear_model.OLS.html" target="_blank" rel="noopener">statsmodels — OLS</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>n = 20, b<sub>1</sub> = 1.5, SE(b<sub>1</sub>) = 0.6. Test β<sub>1</sub> = 0 at 5% (t<sub>0.025, 18</sub> = 2.101).</li><li>Why is the prediction interval never narrower than about ±t*·s, however large n becomes?</li><li>Where in the x-range is the mean-response CI narrowest?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) t = 2.5 &gt; 2.101 ⇒ reject; CI 1.5 ± 1.26 = (0.24, 2.76). 2) The term “1” (individual noise σ<sup>2</sup>) does not depend on n. 3) At x<sub>0</sub> = x̄.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 9 · Bài 9.3</span>
<h2>Suy luận cho hồi quy: kiểm định hệ số góc, khoảng tin cậy và khoảng dự báo</h2>
<p class="lead">Đường khớp từ 10 điểm chỉ là một ước lượng. 10 sinh viên khác sẽ cho một đường khác. Suy luận cho hồi quy định lượng độ bất định đó — cho hệ số góc, cho đáp ứng trung bình tại một x, và cho một cá thể mới.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Ước lượng σ và tính sai số chuẩn của b<sub>1</sub>, b<sub>0</sub>.</li><li>Kiểm định H<sub>0</sub>: β<sub>1</sub> = 0 và dựng KTC cho hệ số góc.</li><li>Phân biệt khoảng tin cậy cho đáp ứng trung bình với khoảng dự báo cho một quan sát mới.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Sai số chuẩn phần dư</span>s<sup>2</sup> = SSE/(n − 2)   (ước lượng hai tham số ⇒ n − 2 bậc tự do)      s = √(SSE/(n − 2))</div>
<div class="formula"><span class="lbl">Suy luận cho hệ số góc</span>SE(b<sub>1</sub>) = s / √S<sub>xx</sub>      T = (b<sub>1</sub> − β<sub>1,0</sub>)/SE(b<sub>1</sub>) ~ t(n − 2)      KTC: b<sub>1</sub> ± t<sub>α/2, n−2</sub>·SE(b<sub>1</sub>)<br>SE(b<sub>0</sub>) = s·√(1/n + x̄<sup>2</sup>/S<sub>xx</sub>)</div>
<p>Kiểm định H<sub>0</sub>: β<sub>1</sub> = 0 (“x không có quan hệ tuyến tính với y”) cho đúng cùng giá trị t với kiểm định tương quan ở Bài 9.1. SE(b<sub>1</sub>) nhỏ đi khi các giá trị x trải rộng hơn (S<sub>xx</sub> lớn) — một bài học thiết kế: muốn ước lượng hệ số góc tốt, hãy đo ở các x cách xa nhau.</p>
<div class="formula"><span class="lbl">Tại một giá trị mới x₀</span>ŷ<sub>0</sub> = b<sub>0</sub> + b<sub>1</sub>x<sub>0</sub><br>KTC cho đáp ứng trung bình E[Y | x<sub>0</sub>]:   ŷ<sub>0</sub> ± t*·s·√( 1/n + (x<sub>0</sub> − x̄)<sup>2</sup>/S<sub>xx</sub> )<br>Khoảng dự báo cho một Y mới:   ŷ<sub>0</sub> ± t*·s·√( 1 + 1/n + (x<sub>0</sub> − x̄)<sup>2</sup>/S<sub>xx</sub> )</div>
<p>Số “1” thêm vào trong khoảng dự báo là độ phân tán cá nhân σ<sup>2</sup> quanh đường thẳng, không bao giờ giảm khi có thêm dữ liệu. Cả hai khoảng hẹp nhất tại x<sub>0</sub> = x̄ và rộng dần khi x<sub>0</sub> xa ra — thêm một lý do không nên ngoại suy.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — giờ học và điểm, tiếp theo.</b> n = 10, b<sub>1</sub> = 3,836, S<sub>xx</sub> = 82,5, SSE = 23,89.</p>
<p>Bước 1: s = √(23,89/8) = <b>1,728</b> điểm. Bước 2: SE(b<sub>1</sub>) = 1,728/√82,5 = <b>0,190</b>; t = 3,836/0,190 = 20,16 (trùng Bài 9.1). Bước 3: t<sub>0,025; 8</sub> = 2,306 ⇒ KTC 95% cho β<sub>1</sub>: 3,836 ± 2,306·0,190 = <b>(3,40; 4,28)</b> điểm mỗi giờ. Bước 4: tại x<sub>0</sub> = 7,5 giờ, ŷ<sub>0</sub> = 72,54; KTC cho điểm <em>trung bình</em> của mọi sinh viên học 7,5 giờ: <b>(71,20; 73,87)</b>; khoảng dự báo cho <em>một</em> sinh viên như vậy: <b>(68,33; 76,74)</b>.</p></div>
<pre><code class="language-python">import numpy as np
import statsmodels.api as sm

x = np.array([2, 3, 4, 5, 6, 7, 8, 9, 10, 11], dtype=float)
y = np.array([52, 55, 61, 60, 68, 70, 74, 79, 80, 88], dtype=float)
model = sm.OLS(y, sm.add_constant(x)).fit()
print("coef  :", model.params.round(4))
print("SE    :", model.bse.round(4))
print("t     :", model.tvalues.round(3))
print("95% CI for slope:", model.conf_int(0.05)[1].round(4))
print(f"s (residual SE) = {np.sqrt(model.scale):.4f}")
pred = model.get_prediction(np.array([[1.0, 7.5]])).summary_frame(alpha=0.05)
print(pred[["mean", "mean_ci_lower", "mean_ci_upper", "obs_ci_lower", "obs_ci_upper"]].round(2))</code></pre>
<div class="out">coef  : [43.7636  3.8364]
SE    : [1.352  0.1903]
t     : [32.369 20.164]
95% CI for slope: [3.3976 4.2751]
s (residual SE) = 1.7281
    mean  mean_ci_lower  mean_ci_upper  obs_ci_lower  obs_ci_upper
0  72.54           71.2          73.87         68.33         76.74</div>
<p>Trong statsmodels, <code>summary_frame</code> trả về cả hai khoảng: <code>mean_ci_*</code> cho đáp ứng trung bình và <code>obs_ci_*</code> cho quan sát mới. <code>model.summary()</code> in đầy đủ bảng hồi quy (hệ số, SE, t, p, R<sup>2</sup>, F).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng KTC cho trung bình khi câu hỏi về một cá thể (“Lan sẽ được bao nhiêu điểm?”) — cần khoảng dự báo.</li><li>Dùng n − 1 bậc tự do thay vì n − 2.</li><li>Diễn giải hệ số góc không có ý nghĩa thành “không có quan hệ” khi quan hệ là đường cong.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>s = √(SSE/(n − 2)); SE(b<sub>1</sub>) = s/√S<sub>xx</sub>; kiểm định t với n − 2 bậc tự do.</li><li>Kiểm định β<sub>1</sub> = 0 ⇔ kiểm định ρ = 0.</li><li>KTC đáp ứng trung bình và khoảng dự báo: cái sau thêm số hạng “1 +” và rộng hơn nhiều.</li><li>Cả hai rộng dần khi xa x̄.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/12-5-prediction" target="_blank" rel="noopener">OpenStax — 12.5 Dự báo</a></li><li><a href="https://online.stat.psu.edu/stat501/Lesson03.html" target="_blank" rel="noopener">Penn State STAT 501 — Bài 3: Ước lượng và dự báo trong hồi quy đơn</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class26-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 26: Hồi quy tuyến tính</a></li><li><a href="https://www.statsmodels.org/stable/generated/statsmodels.regression.linear_model.OLS.html" target="_blank" rel="noopener">statsmodels — OLS</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>n = 20, b<sub>1</sub> = 1,5, SE(b<sub>1</sub>) = 0,6. Kiểm định β<sub>1</sub> = 0 ở mức 5% (t<sub>0,025; 18</sub> = 2,101).</li><li>Vì sao khoảng dự báo không bao giờ hẹp hơn khoảng ±t*·s, dù n lớn đến đâu?</li><li>Trong phạm vi x, KTC cho đáp ứng trung bình hẹp nhất ở đâu?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) t = 2,5 &gt; 2,101 ⇒ bác bỏ; KTC 1,5 ± 1,26 = (0,24; 2,76). 2) Số hạng “1” (nhiễu cá nhân σ<sup>2</sup>) không phụ thuộc n. 3) Tại x<sub>0</sub> = x̄.</p></div>`);

const c94 = L('psi221-ts-9-4',
  '9.4 — Regression diagnostics and multiple linear regression|||9.4 — Chẩn đoán hồi quy và hồi quy tuyến tính bội',
  'Bốn giả định LINE và đồ thị phần dư, ngoại lai và điểm đòn bẩy; hồi quy bội: diễn giải “giữ các biến khác cố định”, R² hiệu chỉnh, kiểm định F tổng thể, đa cộng tuyến; ví dụ độ trễ theo kích thước request và số người dùng.',
  `<span class="eyebrow">PSI221 · Chapter 9 · Lesson 9.4</span>
<h2>Regression diagnostics and multiple linear regression</h2>
<p class="lead">Every number in a regression table relies on assumptions. This lesson shows how to check them with residuals, and then extends the model to several predictors — the form used in real data analysis and the simplest machine-learning model.</p>
<h3>🎯 Objectives</h3>
<ul><li>Check the LINE assumptions with residual plots; spot outliers and high-leverage points.</li><li>Fit and interpret a multiple regression with statsmodels.</li><li>Use adjusted R<sup>2</sup> and the overall F-test, and recognise multicollinearity.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>LINE assumptions</strong> for Y = β<sub>0</sub> + β<sub>1</sub>x + ε:</p>
<ul>
<li><strong>L</strong>inearity — the mean of Y is linear in x. Check: residuals vs fitted values show no curve.</li>
<li><strong>I</strong>ndependence of errors — by design; with time-ordered data plot residuals against time (autocorrelation).</li>
<li><strong>N</strong>ormality of errors — Q–Q plot of residuals; matters mainly for small n and for prediction intervals.</li>
<li><strong>E</strong>qual variance — residual spread constant across fitted values (no “funnel”). Unequal variance is common for latencies and money; a log transform of y often fixes both funnel and skewness.</li>
</ul>
<p><strong>Unusual points.</strong> An <em>outlier</em> has a large residual; a <em>high-leverage</em> point has an extreme x. A point that is both can pull the whole line (high <em>influence</em>, measured by Cook's distance). Investigate such points — data errors, a different regime — rather than deleting them silently.</p>
<h3>Multiple linear regression</h3>
<div class="formula"><span class="lbl">Model with p predictors</span>Y = β<sub>0</sub> + β<sub>1</sub>x<sub>1</sub> + … + β<sub>p</sub>x<sub>p</sub> + ε      matrix form: <b>b</b> = (X<sup>T</sup>X)<sup>−1</sup>X<sup>T</sup><b>y</b>      s<sup>2</sup> = SSE/(n − p − 1)<br>Overall F = (SSR/p) / (SSE/(n − p − 1)) tests H<sub>0</sub>: β<sub>1</sub> = … = β<sub>p</sub> = 0      R<sup>2</sup><sub>adj</sub> = 1 − (1 − R<sup>2</sup>)(n − 1)/(n − p − 1)</div>
<p><strong>Interpretation:</strong> β<sub>j</sub> is the expected change in y for a one-unit increase in x<sub>j</sub> <em>holding the other predictors fixed</em>. Each coefficient has its own t-test (is x<sub>j</sub> useful <em>given</em> the others?). R<sup>2</sup> never decreases when a predictor is added, even a useless one; adjusted R<sup>2</sup> penalises extra predictors.</p>
<p><strong>Multicollinearity:</strong> when predictors are strongly correlated (e.g. request size in KB and in packets), individual coefficients become unstable with huge SEs, even though predictions remain fine. Check correlations among predictors or variance inflation factors (VIF &gt; 10 is a common warning level).</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — what drives API latency?</b> 100 simulated requests with latency = 20 + 4.0·size(KB) + 0.6·users + noise (SD 3).</p>
<p>Fit: ŷ = 21.52 + 3.851·size + 0.577·users. SEs 0.12 and 0.023: both effects are estimated precisely and are close to the true 4.0 and 0.6. R<sup>2</sup> = 0.942, adjusted 0.941; overall F = 784.5. Interpretation: holding the number of users fixed, each extra KB adds about 3.85 ms; holding size fixed, each extra concurrent user adds about 0.58 ms. Residual SD 3.19 ≈ the true noise 3.</p></div>
<pre><code class="language-python">import numpy as np
import statsmodels.api as sm

rng = np.random.default_rng(5)
n = 100
size = rng.uniform(1, 10, n)            # request size (KB)
users = rng.integers(1, 50, n)          # concurrent users
noise = rng.normal(0, 3, n)
latency = 20 + 4.0 * size + 0.6 * users + noise   # true model
X = sm.add_constant(np.column_stack([size, users]))
fit = sm.OLS(latency, X).fit()
print("coef :", fit.params.round(3))
print("SE   :", fit.bse.round(3))
print(f"R^2 = {fit.rsquared:.4f}, adjusted R^2 = {fit.rsquared_adj:.4f}")
print(f"F = {fit.fvalue:.1f}, p = {fit.f_pvalue:.2e}")
print(f"largest |residual| = {np.abs(fit.resid).max():.2f}, resid sd = {fit.resid.std(ddof=3):.3f}")</code></pre>
<div class="out">coef : [21.517  3.851  0.577]
SE   : [0.962 0.12  0.023]
R^2 = 0.9418, adjusted R^2 = 0.9406
F = 784.5, p = 1.28e-60
largest |residual| = 8.63, resid sd = 3.185</div>
<p>In a real analysis you would continue with <code>fit.summary()</code>, plot <code>fit.resid</code> against <code>fit.fittedvalues</code>, and check <code>fit.get_influence().cooks_distance</code>.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Judging a model only by R<sup>2</sup> without residual plots.</li><li>Reading a multiple-regression coefficient as the simple (marginal) effect — it is the effect given the other variables.</li><li>Adding many predictors to raise R<sup>2</sup> (overfitting); validate on held-out data.</li><li>Concluding a predictor is useless because its t-test is not significant when it is collinear with another predictor.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>LINE: linearity, independence, normality, equal variance — check with residuals.</li><li>Outliers, leverage, influence (Cook's distance): investigate, do not hide.</li><li>Multiple regression: coefficients are “holding others fixed”; df n − p − 1.</li><li>Use adjusted R<sup>2</sup>, the overall F-test, and watch for multicollinearity.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://online.stat.psu.edu/stat501/Lesson04.html" target="_blank" rel="noopener">Penn State STAT 501 — Lesson 4: SLR model assumptions</a></li><li><a href="https://online.stat.psu.edu/stat501/Lesson05.html" target="_blank" rel="noopener">Penn State STAT 501 — Lesson 5: Multiple linear regression</a></li><li><a href="https://www.itl.nist.gov/div898/handbook/pmd/section4/pmd44.htm" target="_blank" rel="noopener">NIST e-Handbook — How can I tell if a model fits my data?</a></li><li><a href="https://www.statsmodels.org/stable/regression.html" target="_blank" rel="noopener">statsmodels — Linear regression</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>The residuals-vs-fitted plot shows a U shape. Which assumption fails and what could you try?</li><li>n = 50, p = 4, R<sup>2</sup> = 0.60. Compute adjusted R<sup>2</sup>.</li><li>In the latency model, predict the latency for size = 5 KB and 20 users.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Linearity; add a quadratic term x<sup>2</sup> or transform x or y. 2) 1 − 0.40·49/45 = 0.564. 3) 21.52 + 3.851·5 + 0.577·20 = 52.3 ms.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 9 · Bài 9.4</span>
<h2>Chẩn đoán hồi quy và hồi quy tuyến tính bội</h2>
<p class="lead">Mọi con số trong bảng hồi quy đều dựa vào giả định. Bài này chỉ cách kiểm chúng bằng phần dư, rồi mở rộng mô hình sang nhiều biến giải thích — dạng dùng trong phân tích dữ liệu thật và là mô hình học máy đơn giản nhất.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Kiểm tra các giả định LINE bằng đồ thị phần dư; phát hiện ngoại lai và điểm đòn bẩy cao.</li><li>Khớp và diễn giải hồi quy bội bằng statsmodels.</li><li>Dùng R<sup>2</sup> hiệu chỉnh và kiểm định F tổng thể, nhận ra đa cộng tuyến.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Giả định LINE</strong> cho Y = β<sub>0</sub> + β<sub>1</sub>x + ε:</p>
<ul>
<li><strong>L</strong>inearity — kỳ vọng của Y tuyến tính theo x. Kiểm: phần dư theo giá trị khớp không có dạng cong.</li>
<li><strong>I</strong>ndependence — sai số độc lập, do thiết kế; với dữ liệu theo thời gian, vẽ phần dư theo thời gian (tự tương quan).</li>
<li><strong>N</strong>ormality — sai số chuẩn; biểu đồ Q–Q của phần dư; quan trọng chủ yếu khi n nhỏ và cho khoảng dự báo.</li>
<li><strong>E</strong>qual variance — độ phân tán phần dư không đổi theo giá trị khớp (không có hình “phễu”). Phương sai không đều hay gặp với độ trễ và tiền; lấy log của y thường chữa được cả hình phễu lẫn độ lệch.</li>
</ul>
<p><strong>Điểm bất thường.</strong> <em>Ngoại lai</em> có phần dư lớn; điểm <em>đòn bẩy cao</em> có x cực đoan. Một điểm có cả hai có thể kéo lệch cả đường thẳng (<em>ảnh hưởng</em> lớn, đo bằng khoảng cách Cook). Hãy điều tra các điểm đó — lỗi dữ liệu, một chế độ khác — thay vì âm thầm xoá.</p>
<h3>Hồi quy tuyến tính bội</h3>
<div class="formula"><span class="lbl">Mô hình với p biến giải thích</span>Y = β<sub>0</sub> + β<sub>1</sub>x<sub>1</sub> + … + β<sub>p</sub>x<sub>p</sub> + ε      dạng ma trận: <b>b</b> = (X<sup>T</sup>X)<sup>−1</sup>X<sup>T</sup><b>y</b>      s<sup>2</sup> = SSE/(n − p − 1)<br>F tổng thể = (SSR/p) / (SSE/(n − p − 1)) kiểm định H<sub>0</sub>: β<sub>1</sub> = … = β<sub>p</sub> = 0      R<sup>2</sup><sub>hc</sub> = 1 − (1 − R<sup>2</sup>)(n − 1)/(n − p − 1)</div>
<p><strong>Diễn giải:</strong> β<sub>j</sub> là thay đổi kỳ vọng của y khi x<sub>j</sub> tăng một đơn vị <em>trong khi giữ các biến khác cố định</em>. Mỗi hệ số có kiểm định t riêng (x<sub>j</sub> có hữu ích <em>khi đã có</em> các biến khác không?). R<sup>2</sup> không bao giờ giảm khi thêm biến, kể cả biến vô dụng; R<sup>2</sup> hiệu chỉnh phạt việc thêm biến.</p>
<p><strong>Đa cộng tuyến:</strong> khi các biến giải thích tương quan mạnh (vd kích thước request tính bằng KB và bằng số gói tin), từng hệ số trở nên bất ổn với SE rất lớn, dù dự đoán vẫn ổn. Kiểm tra tương quan giữa các biến hoặc hệ số phóng đại phương sai (VIF &gt; 10 là mức cảnh báo phổ biến).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — điều gì quyết định độ trễ API?</b> 100 request mô phỏng với độ trễ = 20 + 4,0·kích thước(KB) + 0,6·số người dùng + nhiễu (SD 3).</p>
<p>Kết quả khớp: ŷ = 21,52 + 3,851·kích thước + 0,577·số người dùng. SE 0,12 và 0,023: cả hai hiệu ứng được ước lượng chính xác và gần giá trị thật 4,0 và 0,6. R<sup>2</sup> = 0,942, hiệu chỉnh 0,941; F tổng thể = 784,5. Diễn giải: giữ số người dùng cố định, mỗi KB thêm làm tăng khoảng 3,85 ms; giữ kích thước cố định, mỗi người dùng đồng thời thêm làm tăng khoảng 0,58 ms. SD phần dư 3,19 ≈ nhiễu thật 3.</p></div>
<pre><code class="language-python">import numpy as np
import statsmodels.api as sm

rng = np.random.default_rng(5)
n = 100
size = rng.uniform(1, 10, n)            # request size (KB)
users = rng.integers(1, 50, n)          # concurrent users
noise = rng.normal(0, 3, n)
latency = 20 + 4.0 * size + 0.6 * users + noise   # true model
X = sm.add_constant(np.column_stack([size, users]))
fit = sm.OLS(latency, X).fit()
print("coef :", fit.params.round(3))
print("SE   :", fit.bse.round(3))
print(f"R^2 = {fit.rsquared:.4f}, adjusted R^2 = {fit.rsquared_adj:.4f}")
print(f"F = {fit.fvalue:.1f}, p = {fit.f_pvalue:.2e}")
print(f"largest |residual| = {np.abs(fit.resid).max():.2f}, resid sd = {fit.resid.std(ddof=3):.3f}")</code></pre>
<div class="out">coef : [21.517  3.851  0.577]
SE   : [0.962 0.12  0.023]
R^2 = 0.9418, adjusted R^2 = 0.9406
F = 784.5, p = 1.28e-60
largest |residual| = 8.63, resid sd = 3.185</div>
<p>Trong phân tích thật bạn sẽ tiếp tục với <code>fit.summary()</code>, vẽ <code>fit.resid</code> theo <code>fit.fittedvalues</code>, và kiểm tra <code>fit.get_influence().cooks_distance</code>.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đánh giá mô hình chỉ bằng R<sup>2</sup> mà không xem đồ thị phần dư.</li><li>Đọc hệ số hồi quy bội như hiệu ứng đơn (biên) — nó là hiệu ứng khi đã biết các biến khác.</li><li>Thêm nhiều biến để tăng R<sup>2</sup> (quá khớp); hãy kiểm chứng trên dữ liệu giữ lại.</li><li>Kết luận một biến vô dụng vì kiểm định t không có ý nghĩa trong khi nó cộng tuyến với biến khác.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>LINE: tuyến tính, độc lập, chuẩn, phương sai đều — kiểm bằng phần dư.</li><li>Ngoại lai, đòn bẩy, ảnh hưởng (khoảng cách Cook): điều tra, không che giấu.</li><li>Hồi quy bội: hệ số mang nghĩa “giữ các biến khác cố định”; bậc tự do n − p − 1.</li><li>Dùng R<sup>2</sup> hiệu chỉnh, kiểm định F tổng thể, và cảnh giác đa cộng tuyến.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://online.stat.psu.edu/stat501/Lesson04.html" target="_blank" rel="noopener">Penn State STAT 501 — Bài 4: Giả định của hồi quy đơn</a></li><li><a href="https://online.stat.psu.edu/stat501/Lesson05.html" target="_blank" rel="noopener">Penn State STAT 501 — Bài 5: Hồi quy tuyến tính bội</a></li><li><a href="https://www.itl.nist.gov/div898/handbook/pmd/section4/pmd44.htm" target="_blank" rel="noopener">NIST e-Handbook — Làm sao biết mô hình khớp dữ liệu?</a></li><li><a href="https://www.statsmodels.org/stable/regression.html" target="_blank" rel="noopener">statsmodels — Hồi quy tuyến tính</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Đồ thị phần dư theo giá trị khớp có hình chữ U. Giả định nào bị vi phạm và có thể thử gì?</li><li>n = 50, p = 4, R<sup>2</sup> = 0,60. Tính R<sup>2</sup> hiệu chỉnh.</li><li>Trong mô hình độ trễ, dự đoán độ trễ khi kích thước = 5 KB và 20 người dùng.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Tính tuyến tính; thêm số hạng bậc hai x<sup>2</sup> hoặc biến đổi x hay y. 2) 1 − 0,40·49/45 = 0,564. 3) 21,52 + 3,851·5 + 0,577·20 = 52,3 ms.</p></div>`);

const q9 = QZ(9, 'Quiz — Chapter 9: Regression and correlation|||Quiz — Chương 9: Hồi quy và tương quan', 'Kiểm tra chương 9: hệ số tương quan và kiểm định, bình phương tối thiểu, R², suy luận cho hệ số góc, khoảng dự báo, chẩn đoán, hồi quy bội.', [
  Q('q1', 'r = −0.85 indicates|||r = −0,85 cho thấy',
    ['a weak negative linear association|||liên hệ tuyến tính âm yếu', 'a strong negative linear association|||liên hệ tuyến tính âm mạnh', 'no association|||không có liên hệ', 'that x causes y to fall|||x làm y giảm'], 1,
    '|r| close to 1 means strong; the sign gives the direction; causation is not implied.|||Trị tuyệt đối gần 1 là mạnh; dấu cho chiều; không suy ra nhân quả.'),
  Q('q2', 'The test of H₀: ρ = 0 uses t with how many df for n = 10 pairs?|||Kiểm định H₀: ρ = 0 dùng t với bao nhiêu bậc tự do khi có n = 10 cặp?',
    ['10|||10', '9|||9', '8|||8', '1|||1'], 2,
    'n − 2.|||n − 2.'),
  Q('q3', 'x̄ = 4, ȳ = 20, Sxx = 10, Sxy = 25. The least-squares line is|||x̄ = 4, ȳ = 20, Sxx = 10, Sxy = 25. Đường bình phương tối thiểu là',
    ['ŷ = 10 + 2.5x|||ŷ = 10 + 2,5x', 'ŷ = 20 + 2.5x|||ŷ = 20 + 2,5x', 'ŷ = 2.5 + 10x|||ŷ = 2,5 + 10x', 'ŷ = 4 + 20x|||ŷ = 4 + 20x'], 0,
    'b₁ = 2.5, b₀ = 20 − 2.5·4 = 10.|||b₁ = 2,5, b₀ = 20 − 2,5·4 = 10.'),
  Q('q4', 'In simple linear regression, R² equals|||Trong hồi quy tuyến tính đơn, R² bằng',
    ['r|||r', 'r²|||r²', '1 − r|||1 − r', 'b₁²|||b₁²'], 1,
    'R² = SSR/SST = r².|||R² = SSR/SST = r².'),
  Q('q5', 'Under normal errors, least squares is equivalent to|||Khi sai số chuẩn, bình phương tối thiểu tương đương',
    ['the method of moments|||phương pháp mô-men', 'maximum likelihood|||hợp lý cực đại', 'the bootstrap|||bootstrap', 'Bayesian estimation with a flat prior only|||chỉ ước lượng Bayes với tiên nghiệm phẳng'], 1,
    'The normal log-likelihood is −SSE/(2σ²) + constant.|||Log-hợp lý chuẩn là −SSE/(2σ²) + hằng số.'),
  Q('q6', 'The residual standard error in simple regression is|||Sai số chuẩn phần dư trong hồi quy đơn là',
    ['√(SSE/n)|||√(SSE/n)', '√(SSE/(n − 1))|||√(SSE/(n − 1))', '√(SSE/(n − 2))|||√(SSE/(n − 2))', 'SSE/SST|||SSE/SST'], 2,
    'Two parameters are estimated.|||Ước lượng hai tham số.'),
  Q('q7', 'To predict ONE new student’s score at x₀, use|||Để dự đoán điểm của MỘT sinh viên mới tại x₀, dùng',
    ['the CI for the mean response|||KTC cho đáp ứng trung bình', 'the prediction interval|||khoảng dự báo', 'the CI for the slope|||KTC cho hệ số góc', 'R²|||R²'], 1,
    'Individuals scatter around the line; the PI includes that scatter.|||Cá thể phân tán quanh đường thẳng; khoảng dự báo bao gồm độ phân tán đó.'),
  Q('q8', 'A funnel shape in the residuals-vs-fitted plot suggests|||Hình phễu trong đồ thị phần dư theo giá trị khớp gợi ý',
    ['non-linearity only|||chỉ phi tuyến', 'unequal variance|||phương sai không đều', 'perfect fit|||khớp hoàn hảo', 'too few predictors|||quá ít biến'], 1,
    'Spread grows with the fitted value; try log(y).|||Độ phân tán tăng theo giá trị khớp; thử log(y).'),
  Q('q9', 'In multiple regression, β₁ is interpreted as the change in y per unit of x₁|||Trong hồi quy bội, β₁ được diễn giải là thay đổi của y trên mỗi đơn vị x₁',
    ['ignoring other predictors|||bỏ qua các biến khác', 'holding the other predictors fixed|||khi giữ các biến khác cố định', 'only when x₂ = 0|||chỉ khi x₂ = 0', 'as a causal effect|||như một hiệu ứng nhân quả'], 1,
    'It is a partial effect.|||Đó là hiệu ứng riêng phần.'),
  Q('q10', 'Adding a useless predictor to a regression will|||Thêm một biến vô dụng vào hồi quy sẽ',
    ['lower R²|||làm giảm R²', 'never lower R², but may lower adjusted R²|||không bao giờ làm giảm R², nhưng có thể làm giảm R² hiệu chỉnh', 'always raise adjusted R²|||luôn làm tăng R² hiệu chỉnh', 'change nothing|||không thay đổi gì'], 1,
    'Adjusted R² penalises extra parameters.|||R² hiệu chỉnh phạt tham số thừa.'),
]);

const ch9 = {
  title: 'Chapter 9 — Linear regression and correlation|||Chương 9 — Hồi quy tuyến tính và tương quan',
  description: 'Tương quan Pearson/Spearman và kiểm định, bình phương tối thiểu, R², suy luận cho hệ số góc, khoảng tin cậy và khoảng dự báo, chẩn đoán LINE, hồi quy bội với statsmodels (Wasserman Ch. 13 · OpenIntro Ch. 8–9 · OpenStax Ch. 12 · STAT 501).',
  lessons: [c91, c92, c93, c94, q9],
};


// ───────────────────────────── Chương 10 — Phi tham số, bootstrap, Bayes ─────────────────────────────
const c101 = L('psi221-ts-10-1',
  '10.1 — Rank-based tests: sign, Wilcoxon, Mann–Whitney and Kruskal–Wallis|||10.1 — Kiểm định dựa trên hạng: dấu, Wilcoxon, Mann–Whitney và Kruskal–Wallis',
  'Khi nào cần kiểm định phi tham số; kiểm định dấu, Wilcoxon hạng có dấu (dữ liệu cặp), Mann–Whitney U (hai mẫu), Kruskal–Wallis (nhiều nhóm); chạy lại các ví dụ chương 6 và 8.',
  `<span class="eyebrow">PSI221 · Chapter 10 · Lesson 10.1</span>
<h2>Rank-based tests: sign, Wilcoxon, Mann–Whitney and Kruskal–Wallis</h2>
<p class="lead">t-tests and ANOVA assume roughly normal data. Response times, revenues and ratings often are not. Rank-based (nonparametric) tests replace the values by their ranks and need far weaker assumptions — while losing surprisingly little power when the data <em>are</em> normal.</p>
<h3>🎯 Objectives</h3>
<ul><li>Know when to prefer a rank test.</li><li>Run the sign test and the Wilcoxon signed-rank test for paired data.</li><li>Run the Mann–Whitney U test (two groups) and the Kruskal–Wallis test (k groups).</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Why ranks?</strong> Ranking turns 2.65 s and 265 s into “the largest value” — an outlier can no longer dominate. Rank tests are <em>distribution-free</em>: under H<sub>0</sub> their null distribution does not depend on the shape of the data. Under normality the Wilcoxon and Mann–Whitney tests have asymptotic efficiency 3/π ≈ 0.955 relative to the t-test (you lose about 5% of the data's worth); with heavy tails they can be far <em>more</em> powerful.</p>
<div class="formula"><span class="lbl">The four classic rank tests</span>
<table><tr><th>Situation</th><th>Parametric</th><th>Rank-based</th><th>SciPy</th></tr>
<tr><td>Paired data, signs only</td><td>paired t</td><td>sign test: #(d<sub>i</sub> &gt; 0) ~ Bin(n, ½)</td><td><code>binomtest</code></td></tr>
<tr><td>Paired data</td><td>paired t</td><td>Wilcoxon signed-rank</td><td><code>wilcoxon</code></td></tr>
<tr><td>Two independent groups</td><td>Welch t</td><td>Mann–Whitney U (Wilcoxon rank-sum)</td><td><code>mannwhitneyu</code></td></tr>
<tr><td>k independent groups</td><td>one-way ANOVA</td><td>Kruskal–Wallis H</td><td><code>kruskal</code></td></tr></table></div>
<ul>
<li><strong>Sign test</strong>: counts how many differences are positive; uses only directions, so it needs almost no assumptions but is the least powerful.</li>
<li><strong>Wilcoxon signed-rank</strong>: ranks |d<sub>i</sub>|, sums the ranks of the positive differences; assumes the differences are symmetric about their median.</li>
<li><strong>Mann–Whitney U</strong>: pool both samples, rank them; U<sub>1</sub> = R<sub>1</sub> − n<sub>1</sub>(n<sub>1</sub> + 1)/2, where R<sub>1</sub> is the rank sum of group 1. U<sub>1</sub>/(n<sub>1</sub>n<sub>2</sub>) estimates P(X &gt; Y). It tests whether one distribution tends to give larger values (a median test only if the two shapes are equal).</li>
<li><strong>Kruskal–Wallis</strong>: ANOVA on ranks; H ≈ χ<sup>2</sup>(k − 1) under H<sub>0</sub>.</li>
</ul>
<h3>✍️ Worked example — re-running earlier analyses</h3>
<div class="callout"><p><b>Paired ML models (Lesson 6.3).</b> All 10 differences are positive: sign test p = 2·(1/2)<sup>10</sup> = <b>0.0020</b>; Wilcoxon signed-rank p = <b>0.0020</b> (paired t gave 0.00037).</p>
<p><b>Build times (Lesson 6.2).</b> Pooled ranks: group A's rank sum R<sub>A</sub> = 162, so U = 162 − 55 = <b>107</b> out of a maximum 10·12 = 120; U/120 = 0.89 estimates P(old build slower than new). p = <b>0.0022</b> (Welch gave 0.0010).</p>
<p><b>Recommenders (Lesson 8.1).</b> Kruskal–Wallis H = <b>9.54</b> on 2 df, p = <b>0.0085</b> (ANOVA gave 0.0011).</p>
<p>All conclusions agree with the parametric tests; the rank tests are slightly less sharp on these well-behaved data — the expected price of fewer assumptions.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

X = np.array([82.1, 75.4, 90.2, 68.7, 77.9, 85.3, 72.6, 88.0, 79.5, 70.8])
Y = np.array([83.0, 76.9, 90.5, 70.1, 78.2, 86.8, 73.0, 89.4, 80.9, 71.2])
d = Y - X
print(f"sign test      : {np.sum(d &gt; 0)} of {len(d)} positive, p = {stats.binomtest(int(np.sum(d &gt; 0)), len(d), 0.5).pvalue:.4f}")
print(f"Wilcoxon signed: p = {stats.wilcoxon(Y, X).pvalue:.4f}")

A = np.array([2.31, 2.05, 2.48, 2.20, 2.65, 2.12, 2.39, 2.27, 2.54, 2.18])
B = np.array([2.02, 1.88, 2.15, 1.95, 2.30, 1.79, 2.07, 1.99, 2.21, 1.85, 1.93, 2.10])
mw = stats.mannwhitneyu(A, B)
print(f"Mann-Whitney   : U = {mw.statistic:.0f}, p = {mw.pvalue:.5f}")

g1, g2, g3 = [12, 15, 14, 10, 13], [18, 16, 17, 20, 19], [14, 13, 16, 15, 12]
kw = stats.kruskal(g1, g2, g3)
print(f"Kruskal-Wallis : H = {kw.statistic:.3f}, p = {kw.pvalue:.4f}")</code></pre>
<div class="out">sign test      : 10 of 10 positive, p = 0.0020
Wilcoxon signed: p = 0.0020
Mann-Whitney   : U = 107, p = 0.00217
Kruskal-Wallis : H = 9.540, p = 0.0085</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Believing rank tests have <em>no</em> assumptions: independence is still essential, and Mann–Whitney compares medians only when the two distributions have the same shape.</li><li>Using Mann–Whitney for paired data (use Wilcoxon signed-rank).</li><li>Reporting only a p-value: give medians, and for Mann–Whitney the effect U/(n<sub>1</sub>n<sub>2</sub>).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Rank tests are robust to outliers and skewness and distribution-free under H<sub>0</sub>.</li><li>Paired: sign test or Wilcoxon signed-rank. Two groups: Mann–Whitney. k groups: Kruskal–Wallis.</li><li>Efficiency ≈ 0.955 vs t under normality; often better with heavy tails.</li><li>Independence remains required.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://online.stat.psu.edu/stat500/Lesson11.html" target="_blank" rel="noopener">Penn State STAT 500 — Lesson 11: Nonparametric tests and the bootstrap</a></li><li><a href="https://www.itl.nist.gov/div898/handbook/prc/section4/prc41.htm" target="_blank" rel="noopener">NIST e-Handbook — The Kruskal–Wallis test</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.mannwhitneyu.html" target="_blank" rel="noopener">SciPy — mannwhitneyu</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.wilcoxon.html" target="_blank" rel="noopener">SciPy — wilcoxon</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>8 paired differences: 7 positive, 1 negative. Compute the two-sided sign-test p-value.</li><li>Group sizes 6 and 9. What is the largest possible value of U?</li><li>Latency samples contain a few 30-second timeouts among values of about 0.2 s. Which test do you prefer for comparing two servers, and why?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) P(X ≥ 7) = (8 + 1)/256 = 0.0352 for one side ⇒ two-sided 0.0703. 2) 6·9 = 54. 3) Mann–Whitney (or a permutation test on medians): the timeouts would dominate means and SDs in a t-test.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 10 · Bài 10.1</span>
<h2>Kiểm định dựa trên hạng: dấu, Wilcoxon, Mann–Whitney và Kruskal–Wallis</h2>
<p class="lead">Kiểm định t và ANOVA giả định dữ liệu gần chuẩn. Thời gian phản hồi, doanh thu, điểm đánh giá thường không như vậy. Kiểm định dựa trên hạng (phi tham số) thay giá trị bằng thứ hạng và cần giả định yếu hơn nhiều — mà mất lực ít đến bất ngờ khi dữ liệu <em>thật sự</em> chuẩn.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Biết khi nào nên chọn kiểm định hạng.</li><li>Chạy kiểm định dấu và kiểm định hạng có dấu Wilcoxon cho dữ liệu cặp.</li><li>Chạy kiểm định Mann–Whitney U (hai nhóm) và Kruskal–Wallis (k nhóm).</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Vì sao dùng hạng?</strong> Xếp hạng biến 2,65 s và 265 s cùng thành “giá trị lớn nhất” — ngoại lai không còn chi phối được. Kiểm định hạng <em>không phụ thuộc phân phối</em>: khi H<sub>0</sub> đúng, phân phối của thống kê không phụ thuộc hình dạng dữ liệu. Với dữ liệu chuẩn, Wilcoxon và Mann–Whitney có hiệu suất tiệm cận 3/π ≈ 0,955 so với kiểm định t (mất khoảng 5% giá trị dữ liệu); với đuôi nặng chúng có thể mạnh <em>hơn</em> nhiều.</p>
<div class="formula"><span class="lbl">Bốn kiểm định hạng kinh điển</span>
<table><tr><th>Tình huống</th><th>Tham số</th><th>Dựa trên hạng</th><th>SciPy</th></tr>
<tr><td>Dữ liệu cặp, chỉ xét dấu</td><td>t cặp</td><td>kiểm định dấu: #(d<sub>i</sub> &gt; 0) ~ Bin(n, ½)</td><td><code>binomtest</code></td></tr>
<tr><td>Dữ liệu cặp</td><td>t cặp</td><td>Wilcoxon hạng có dấu</td><td><code>wilcoxon</code></td></tr>
<tr><td>Hai nhóm độc lập</td><td>t Welch</td><td>Mann–Whitney U (tổng hạng Wilcoxon)</td><td><code>mannwhitneyu</code></td></tr>
<tr><td>k nhóm độc lập</td><td>ANOVA một yếu tố</td><td>Kruskal–Wallis H</td><td><code>kruskal</code></td></tr></table></div>
<ul>
<li><strong>Kiểm định dấu</strong>: đếm có bao nhiêu hiệu số dương; chỉ dùng chiều nên gần như không cần giả định nhưng yếu nhất.</li>
<li><strong>Wilcoxon hạng có dấu</strong>: xếp hạng |d<sub>i</sub>|, cộng hạng của các hiệu số dương; giả định hiệu số đối xứng quanh trung vị.</li>
<li><strong>Mann–Whitney U</strong>: gộp hai mẫu, xếp hạng; U<sub>1</sub> = R<sub>1</sub> − n<sub>1</sub>(n<sub>1</sub> + 1)/2, với R<sub>1</sub> là tổng hạng của nhóm 1. U<sub>1</sub>/(n<sub>1</sub>n<sub>2</sub>) ước lượng P(X &gt; Y). Nó kiểm định xem một phân phối có xu hướng cho giá trị lớn hơn không (chỉ là kiểm định trung vị khi hai hình dạng giống nhau).</li>
<li><strong>Kruskal–Wallis</strong>: ANOVA trên hạng; H ≈ χ<sup>2</sup>(k − 1) khi H<sub>0</sub> đúng.</li>
</ul>
<h3>✍️ Ví dụ giải từng bước — chạy lại các phân tích trước</h3>
<div class="callout"><p><b>Hai mô hình học máy ghép cặp (Bài 6.3).</b> Cả 10 hiệu số đều dương: kiểm định dấu p = 2·(1/2)<sup>10</sup> = <b>0,0020</b>; Wilcoxon hạng có dấu p = <b>0,0020</b> (t cặp cho 0,00037).</p>
<p><b>Thời gian build (Bài 6.2).</b> Xếp hạng gộp: tổng hạng nhóm A là R<sub>A</sub> = 162, nên U = 162 − 55 = <b>107</b> trên tối đa 10·12 = 120; U/120 = 0,89 ước lượng P(build cũ chậm hơn build mới). p = <b>0,0022</b> (Welch cho 0,0010).</p>
<p><b>Hệ gợi ý (Bài 8.1).</b> Kruskal–Wallis H = <b>9,54</b> với 2 bậc tự do, p = <b>0,0085</b> (ANOVA cho 0,0011).</p>
<p>Mọi kết luận khớp với kiểm định tham số; kiểm định hạng kém sắc hơn một chút trên dữ liệu “ngoan” này — cái giá dự kiến của việc bớt giả định.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

X = np.array([82.1, 75.4, 90.2, 68.7, 77.9, 85.3, 72.6, 88.0, 79.5, 70.8])
Y = np.array([83.0, 76.9, 90.5, 70.1, 78.2, 86.8, 73.0, 89.4, 80.9, 71.2])
d = Y - X
print(f"sign test      : {np.sum(d &gt; 0)} of {len(d)} positive, p = {stats.binomtest(int(np.sum(d &gt; 0)), len(d), 0.5).pvalue:.4f}")
print(f"Wilcoxon signed: p = {stats.wilcoxon(Y, X).pvalue:.4f}")

A = np.array([2.31, 2.05, 2.48, 2.20, 2.65, 2.12, 2.39, 2.27, 2.54, 2.18])
B = np.array([2.02, 1.88, 2.15, 1.95, 2.30, 1.79, 2.07, 1.99, 2.21, 1.85, 1.93, 2.10])
mw = stats.mannwhitneyu(A, B)
print(f"Mann-Whitney   : U = {mw.statistic:.0f}, p = {mw.pvalue:.5f}")

g1, g2, g3 = [12, 15, 14, 10, 13], [18, 16, 17, 20, 19], [14, 13, 16, 15, 12]
kw = stats.kruskal(g1, g2, g3)
print(f"Kruskal-Wallis : H = {kw.statistic:.3f}, p = {kw.pvalue:.4f}")</code></pre>
<div class="out">sign test      : 10 of 10 positive, p = 0.0020
Wilcoxon signed: p = 0.0020
Mann-Whitney   : U = 107, p = 0.00217
Kruskal-Wallis : H = 9.540, p = 0.0085</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tin rằng kiểm định hạng <em>không</em> có giả định: tính độc lập vẫn thiết yếu, và Mann–Whitney chỉ so trung vị khi hai phân phối cùng hình dạng.</li><li>Dùng Mann–Whitney cho dữ liệu cặp (phải dùng Wilcoxon hạng có dấu).</li><li>Chỉ báo cáo p-value: hãy cho trung vị, và với Mann–Whitney là hiệu ứng U/(n<sub>1</sub>n<sub>2</sub>).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Kiểm định hạng bền với ngoại lai, độ lệch và không phụ thuộc phân phối khi H<sub>0</sub> đúng.</li><li>Dữ liệu cặp: kiểm định dấu hoặc Wilcoxon hạng có dấu. Hai nhóm: Mann–Whitney. k nhóm: Kruskal–Wallis.</li><li>Hiệu suất ≈ 0,955 so với t khi dữ liệu chuẩn; thường tốt hơn khi đuôi nặng.</li><li>Vẫn bắt buộc tính độc lập.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://online.stat.psu.edu/stat500/Lesson11.html" target="_blank" rel="noopener">Penn State STAT 500 — Bài 11: Kiểm định phi tham số và bootstrap</a></li><li><a href="https://www.itl.nist.gov/div898/handbook/prc/section4/prc41.htm" target="_blank" rel="noopener">NIST e-Handbook — Kiểm định Kruskal–Wallis</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.mannwhitneyu.html" target="_blank" rel="noopener">SciPy — mannwhitneyu</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.wilcoxon.html" target="_blank" rel="noopener">SciPy — wilcoxon</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>8 hiệu số cặp: 7 dương, 1 âm. Tính p-value hai phía của kiểm định dấu.</li><li>Cỡ nhóm 6 và 9. Giá trị lớn nhất có thể của U là bao nhiêu?</li><li>Mẫu độ trễ có vài lần timeout 30 giây giữa các giá trị khoảng 0,2 s. Bạn chọn kiểm định nào để so hai server, vì sao?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) P(X ≥ 7) = (8 + 1)/256 = 0,0352 một phía ⇒ hai phía 0,0703. 2) 6·9 = 54. 3) Mann–Whitney (hoặc kiểm định hoán vị trên trung vị): các timeout sẽ chi phối trung bình và độ lệch chuẩn trong kiểm định t.</p></div>`);

const c102 = L('psi221-ts-10-2',
  '10.2 — Permutation tests|||10.2 — Kiểm định hoán vị',
  'Logic hoán vị: khi H₀ đúng nhãn nhóm có thể đổi chỗ; kiểm định chính xác và Monte Carlo; scipy.stats.permutation_test cho chênh lệch trung bình; ưu điểm với thống kê tuỳ ý.',
  `<span class="eyebrow">PSI221 · Chapter 10 · Lesson 10.2</span>
<h2>Permutation tests</h2>
<p class="lead">What if you could build the null distribution of <em>any</em> statistic directly from your data, without a formula and without assuming normality? If the group labels do not matter (H<sub>0</sub>), shuffling them should not matter either. That simple idea is the permutation test.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain the exchangeability logic behind permutation tests.</li><li>Run an exact or Monte Carlo permutation test with <code>scipy.stats.permutation_test</code>.</li><li>Choose permutation tests for statistics with no textbook distribution.</li></ul>
<h3>📖 Lecture</h3>
<p>Suppose group A has n<sub>A</sub> values and group B has n<sub>B</sub>. Under H<sub>0</sub>: <em>both groups come from the same distribution</em>, every assignment of the N = n<sub>A</sub> + n<sub>B</sub> pooled values into groups of sizes n<sub>A</sub> and n<sub>B</sub> is equally likely (the labels are <strong>exchangeable</strong>). So:</p>
<ol>
<li>Compute the statistic on the real data, T<sub>obs</sub> (e.g. x̄<sub>A</sub> − x̄<sub>B</sub>, a difference of medians, a ratio of SDs…).</li>
<li>Re-compute it for every re-labelling — or for many random ones (Monte Carlo) when there are too many.</li>
<li>The p-value is the share of re-labellings with a statistic at least as extreme as T<sub>obs</sub>.</li>
</ol>
<div class="formula"><span class="lbl">Permutation p-value</span>p = #{ permutations with |T*| ≥ |T<sub>obs</sub>| } / #{ permutations }      (Monte Carlo: (count + 1)/(B + 1))</div>
<p>The test is <strong>exact</strong> in the sense that its Type I error is α for any distribution, provided exchangeability holds under H<sub>0</sub>. Randomised experiments (A/B tests) justify it by design: the randomisation itself creates the exchangeability.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — build times again.</b> A (10 builds) vs B (12 builds), statistic = difference in means = 0.299 s.</p>
<p>Step 1: the number of distinct relabellings is C(22, 10) = 646 646 — feasible, but we use 20 000 random shuffles. Step 2: for each shuffle, assign 10 of the 22 times to “A” at random and compute the mean difference. Step 3: count how often |difference| ≥ 0.299. Result: p ≈ <b>0.0007</b>, in line with Welch's t (0.0010) and Mann–Whitney (0.0022) — but with no normality assumption at all.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

A = np.array([2.31, 2.05, 2.48, 2.20, 2.65, 2.12, 2.39, 2.27, 2.54, 2.18])
B = np.array([2.02, 1.88, 2.15, 1.95, 2.30, 1.79, 2.07, 1.99, 2.21, 1.85, 1.93, 2.10])

def diff_means(a, b):
    return np.mean(a) - np.mean(b)

res = stats.permutation_test((A, B), diff_means, permutation_type="independent",
                             n_resamples=20000, alternative="two-sided",
                             rng=np.random.default_rng(0))
print(f"observed difference = {res.statistic:.4f}")
print(f"permutation p-value = {res.pvalue:.5f}")</code></pre>
<div class="out">observed difference = 0.2990
permutation p-value = 0.00070</div>
<p>SciPy's Monte Carlo p-value counts the observed arrangement as one of the permutations (the “+1” in the formula), so it is never exactly 0 and remains valid. Fix <code>rng</code> for reproducible results; increase <code>n_resamples</code> for more precise p-values near α.</p>
<h3>Variants</h3>
<ul>
<li><strong>Paired data</strong>: under H<sub>0</sub> each difference d<sub>i</sub> is equally likely to be +d<sub>i</sub> or −d<sub>i</sub>; randomly flip signs (<code>permutation_type="samples"</code>).</li>
<li><strong>Correlation</strong>: shuffle y relative to x to test ρ = 0 (<code>permutation_type="pairings"</code>).</li>
<li><strong>Any statistic</strong>: difference of 95th percentiles of latency, difference in AUC between two classifiers, a custom business metric — no formula needed.</li>
</ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Permuting when observations are not exchangeable under H<sub>0</sub> (time series, clustered users) — the test becomes invalid.</li><li>Using too few shuffles (100) and reporting p = 0.00.</li><li>Confusing permutation (resampling <em>without</em> replacement to test) with the bootstrap (resampling <em>with</em> replacement to estimate uncertainty, next lesson).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>H<sub>0</sub> ⇒ labels exchangeable ⇒ shuffle and recompute.</li><li>p = share of shuffles at least as extreme as observed.</li><li>Works for any statistic; exact under exchangeability; justified by randomisation.</li><li><code>scipy.stats.permutation_test</code> handles independent, paired and pairing designs.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.permutation_test.html" target="_blank" rel="noopener">SciPy — permutation_test</a></li><li><a href="https://docs.scipy.org/doc/scipy/tutorial/stats/resampling.html" target="_blank" rel="noopener">SciPy tutorial — Resampling and Monte Carlo methods</a></li><li><a href="https://online.stat.psu.edu/stat500/Lesson11.html" target="_blank" rel="noopener">Penn State STAT 500 — Lesson 11: Nonparametric tests</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>How many distinct ways can 8 values be split into groups of 4 and 4?</li><li>In 10 000 shuffles, 37 gave |T*| ≥ |T<sub>obs</sub>|. Compute the Monte Carlo p-value.</li><li>Why is a permutation test natural for an A/B test with random assignment?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) C(8, 4) = 70. 2) (37 + 1)/(10 000 + 1) ≈ 0.0038. 3) Random assignment makes the labels exchangeable under H<sub>0</sub>, so the permutation distribution is exactly the distribution created by the experiment.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 10 · Bài 10.2</span>
<h2>Kiểm định hoán vị</h2>
<p class="lead">Sẽ thế nào nếu bạn dựng được phân phối dưới H<sub>0</sub> của <em>bất kỳ</em> thống kê nào trực tiếp từ dữ liệu, không cần công thức, không cần giả định chuẩn? Nếu nhãn nhóm không quan trọng (H<sub>0</sub>), thì xáo nhãn cũng không ảnh hưởng gì. Ý tưởng đơn giản đó là kiểm định hoán vị.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích logic hoán đổi được (exchangeability) đằng sau kiểm định hoán vị.</li><li>Chạy kiểm định hoán vị chính xác hoặc Monte Carlo bằng <code>scipy.stats.permutation_test</code>.</li><li>Chọn kiểm định hoán vị cho các thống kê không có phân phối trong sách.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Giả sử nhóm A có n<sub>A</sub> giá trị và nhóm B có n<sub>B</sub>. Khi H<sub>0</sub>: <em>hai nhóm đến từ cùng một phân phối</em>, mọi cách chia N = n<sub>A</sub> + n<sub>B</sub> giá trị gộp thành hai nhóm cỡ n<sub>A</sub> và n<sub>B</sub> đều đồng khả năng (nhãn <strong>hoán đổi được</strong>). Vậy:</p>
<ol>
<li>Tính thống kê trên dữ liệu thật, T<sub>qs</sub> (vd x̄<sub>A</sub> − x̄<sub>B</sub>, chênh lệch trung vị, tỉ số độ lệch chuẩn…).</li>
<li>Tính lại cho mọi cách gán nhãn — hoặc cho nhiều cách gán ngẫu nhiên (Monte Carlo) khi có quá nhiều.</li>
<li>p-value là tỉ lệ cách gán có thống kê ít nhất cực đoan như T<sub>qs</sub>.</li>
</ol>
<div class="formula"><span class="lbl">p-value hoán vị</span>p = #{ hoán vị có |T*| ≥ |T<sub>qs</sub>| } / #{ hoán vị }      (Monte Carlo: (số đếm + 1)/(B + 1))</div>
<p>Kiểm định này <strong>chính xác</strong> theo nghĩa sai lầm loại I bằng α với mọi phân phối, miễn là tính hoán đổi được đúng khi H<sub>0</sub> đúng. Thí nghiệm ngẫu nhiên hoá (A/B test) biện minh cho nó bằng thiết kế: chính việc phân nhóm ngẫu nhiên tạo ra tính hoán đổi được.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — lại thời gian build.</b> A (10 lần build) so với B (12 lần build), thống kê = chênh lệch trung bình = 0,299 s.</p>
<p>Bước 1: số cách gán nhãn khác nhau là C(22, 10) = 646 646 — làm được, nhưng ta dùng 20 000 lần xáo ngẫu nhiên. Bước 2: mỗi lần xáo, chọn ngẫu nhiên 10 trong 22 thời gian làm “A” và tính chênh lệch trung bình. Bước 3: đếm số lần |chênh lệch| ≥ 0,299. Kết quả: p ≈ <b>0,0007</b>, khớp với t Welch (0,0010) và Mann–Whitney (0,0022) — nhưng không cần giả định chuẩn nào.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

A = np.array([2.31, 2.05, 2.48, 2.20, 2.65, 2.12, 2.39, 2.27, 2.54, 2.18])
B = np.array([2.02, 1.88, 2.15, 1.95, 2.30, 1.79, 2.07, 1.99, 2.21, 1.85, 1.93, 2.10])

def diff_means(a, b):
    return np.mean(a) - np.mean(b)

res = stats.permutation_test((A, B), diff_means, permutation_type="independent",
                             n_resamples=20000, alternative="two-sided",
                             rng=np.random.default_rng(0))
print(f"observed difference = {res.statistic:.4f}")
print(f"permutation p-value = {res.pvalue:.5f}")</code></pre>
<div class="out">observed difference = 0.2990
permutation p-value = 0.00070</div>
<p>p-value Monte Carlo của SciPy tính cả cách sắp xếp quan sát được như một hoán vị (số “+1” trong công thức), nên nó không bao giờ đúng bằng 0 và vẫn hợp lệ. Cố định <code>rng</code> để kết quả tái lập được; tăng <code>n_resamples</code> để p-value chính xác hơn khi gần α.</p>
<h3>Các biến thể</h3>
<ul>
<li><strong>Dữ liệu cặp</strong>: khi H<sub>0</sub> đúng, mỗi hiệu số d<sub>i</sub> có khả năng là +d<sub>i</sub> hoặc −d<sub>i</sub> như nhau; đổi dấu ngẫu nhiên (<code>permutation_type="samples"</code>).</li>
<li><strong>Tương quan</strong>: xáo y so với x để kiểm định ρ = 0 (<code>permutation_type="pairings"</code>).</li>
<li><strong>Thống kê bất kỳ</strong>: chênh lệch phân vị 95% của độ trễ, chênh lệch AUC giữa hai bộ phân loại, một chỉ số kinh doanh tự định nghĩa — không cần công thức.</li>
</ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Hoán vị khi các quan sát không hoán đổi được dưới H<sub>0</sub> (chuỗi thời gian, người dùng theo cụm) — kiểm định mất hiệu lực.</li><li>Dùng quá ít lần xáo (100) rồi báo cáo p = 0,00.</li><li>Nhầm hoán vị (lấy mẫu lại <em>không</em> hoàn lại để kiểm định) với bootstrap (lấy mẫu lại <em>có</em> hoàn lại để ước lượng độ bất định, bài sau).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>H<sub>0</sub> ⇒ nhãn hoán đổi được ⇒ xáo rồi tính lại.</li><li>p = tỉ lệ lần xáo ít nhất cực đoan như quan sát.</li><li>Dùng được cho mọi thống kê; chính xác khi hoán đổi được; được biện minh bởi ngẫu nhiên hoá.</li><li><code>scipy.stats.permutation_test</code> xử lý thiết kế độc lập, cặp và ghép cặp (pairings).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.permutation_test.html" target="_blank" rel="noopener">SciPy — permutation_test</a></li><li><a href="https://docs.scipy.org/doc/scipy/tutorial/stats/resampling.html" target="_blank" rel="noopener">Hướng dẫn SciPy — Lấy mẫu lại và phương pháp Monte Carlo</a></li><li><a href="https://online.stat.psu.edu/stat500/Lesson11.html" target="_blank" rel="noopener">Penn State STAT 500 — Bài 11: Kiểm định phi tham số</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Có bao nhiêu cách khác nhau chia 8 giá trị thành hai nhóm 4 và 4?</li><li>Trong 10 000 lần xáo có 37 lần |T*| ≥ |T<sub>qs</sub>|. Tính p-value Monte Carlo.</li><li>Vì sao kiểm định hoán vị tự nhiên cho A/B test có phân nhóm ngẫu nhiên?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) C(8, 4) = 70. 2) (37 + 1)/(10 000 + 1) ≈ 0,0038. 3) Phân nhóm ngẫu nhiên làm nhãn hoán đổi được khi H<sub>0</sub> đúng, nên phân phối hoán vị chính là phân phối do thí nghiệm tạo ra.</p></div>`);

const c103 = L('psi221-ts-10-3',
  '10.3 — The bootstrap: standard errors and confidence intervals by resampling|||10.3 — Bootstrap: sai số chuẩn và khoảng tin cậy bằng lấy mẫu lại',
  'Nguyên lý thay thế (plug-in), lấy mẫu lại có hoàn lại, SE bootstrap, khoảng phân vị và BCa (scipy.stats.bootstrap) cho trung vị độ dài phiên lệch phải; khi bootstrap hỏng.',
  `<span class="eyebrow">PSI221 · Chapter 10 · Lesson 10.3</span>
<h2>The bootstrap: standard errors and confidence intervals by resampling</h2>
<p class="lead">What is the standard error of a median? Of the 95th percentile of latency? Of a model's AUC? There is often no formula. Bradley Efron's bootstrap (1979) answers with a computer: resample your own data many times and watch the statistic vary.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the plug-in principle behind the bootstrap.</li><li>Compute a bootstrap standard error and a percentile confidence interval by hand-written code.</li><li>Use <code>scipy.stats.bootstrap</code> (BCa) and know when the bootstrap fails.</li></ul>
<h3>📖 Lecture</h3>
<p>The sampling distribution of a statistic θ̂ = T(X<sub>1</sub>, …, X<sub>n</sub>) depends on the unknown population F. The <strong>plug-in principle</strong>: replace F by the <strong>empirical distribution</strong> F̂<sub>n</sub>, which puts probability 1/n on each observed value. Sampling n values from F̂<sub>n</sub> means sampling <strong>with replacement</strong> from the data.</p>
<div class="formula"><span class="lbl">Nonparametric bootstrap</span>for b = 1, …, B (e.g. B = 10 000):   draw x*<sub>1</sub>, …, x*<sub>n</sub> with replacement from the data;   compute θ̂*<sub>b</sub> = T(x*)<br>SE<sub>boot</sub> = SD of θ̂*<sub>1</sub>, …, θ̂*<sub>B</sub>      percentile 95% CI = ( 2.5th, 97.5th percentiles of θ̂* )</div>
<p>The variation of θ̂* around θ̂ mimics the variation of θ̂ around θ. The <strong>percentile interval</strong> is simple; the <strong>BCa interval</strong> (bias-corrected and accelerated) adjusts for bias and skewness of the bootstrap distribution and has better coverage — it is SciPy's default.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — median session length.</b> 15 sessions (minutes): 1.2, 0.8, 3.5, 2.1, 0.5, 7.9, 1.6, 2.8, 0.9, 12.4, 1.1, 4.3, 0.7, 2.2, 5.6. The data are strongly right-skewed (mean 3.17, median 2.10), so the median is the better summary — but what is its uncertainty?</p>
<p>Step 1: resample 15 values with replacement, take the median; repeat 10 000 times. Step 2: SE<sub>boot</sub> = <b>0.77</b> min. Step 3: percentile 95% CI = <b>(1.1, 3.5)</b>; BCa gives <b>(0.98, 3.50)</b>. Note the asymmetry around 2.10: the bootstrap captures the skewness that a ± formula would miss.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

sessions = np.array([1.2, 0.8, 3.5, 2.1, 0.5, 7.9, 1.6, 2.8, 0.9, 12.4, 1.1, 4.3, 0.7, 2.2, 5.6])  # minutes
print(f"sample median = {np.median(sessions):.2f}, mean = {sessions.mean():.3f}")

rng = np.random.default_rng(2026)
boot = np.array([np.median(rng.choice(sessions, size=len(sessions), replace=True)) for _ in range(10000)])
print(f"bootstrap SE of median = {boot.std(ddof=1):.3f}")
print("percentile 95% CI     =", np.percentile(boot, [2.5, 97.5]).round(2))

res = stats.bootstrap((sessions,), np.median, n_resamples=10000, method="BCa",
                      rng=np.random.default_rng(2026))
print(f"scipy BCa 95% CI      = ({res.confidence_interval.low:.2f}, {res.confidence_interval.high:.2f})")</code></pre>
<div class="out">sample median = 2.10, mean = 3.173
bootstrap SE of median = 0.771
percentile 95% CI     = [1.1 3.5]
scipy BCa 95% CI      = (0.98, 3.50)</div>
<h3>Where the bootstrap shines — and fails</h3>
<ul>
<li><strong>Shines:</strong> medians, percentiles, trimmed means, ratios, correlation coefficients, regression coefficients with odd errors, ML metrics (resample the test set to get a CI for accuracy or AUC).</li>
<li><strong>Fails or needs care:</strong> very small n (the data cannot represent F); statistics depending on extremes, like the maximum (the bootstrap never produces a value above the sample max — recall Uniform(0, θ)); dependent data (use block bootstrap for time series); heavy-tailed data with infinite variance.</li>
<li><strong>Parametric bootstrap</strong>: if you trust a model, resample from the fitted model (e.g. Poisson(λ̂)) instead of from the data.</li>
</ul>
<p>The bootstrap estimates <em>uncertainty</em>; it does not create information. The median is still 2.10 — the bootstrap tells you how much to trust it.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Resampling without replacement (that just permutes the data and gives the same median every time).</li><li>Using too few resamples (B = 100) for a 95% interval; use thousands.</li><li>Bootstrapping data that are clustered or time-ordered as if they were i.i.d.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Plug-in: replace F by the empirical distribution; resample with replacement.</li><li>SE<sub>boot</sub> = SD of the bootstrap replicates; percentile and BCa intervals.</li><li>Ideal for statistics without formulas (median, percentiles, ML metrics).</li><li>Beware small n, extremes and dependence.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.youtube.com/watch?v=Xz0x-8-cgaQ" target="_blank" rel="noopener">StatQuest — Bootstrapping main ideas</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class24-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 24: Bootstrap confidence intervals</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.bootstrap.html" target="_blank" rel="noopener">SciPy — bootstrap</a></li><li><a href="https://online.stat.psu.edu/stat415/Lesson08.html" target="_blank" rel="noopener">Penn State STAT 415 — Lesson 8: Bootstrap confidence intervals</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Why must bootstrap resampling be done with replacement?</li><li>A classifier is evaluated on 500 test images. Describe how to get a 95% CI for its accuracy with the bootstrap.</li><li>Why is the bootstrap a poor tool for estimating the maximum θ of Uniform(0, θ)?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Without replacement every resample is the original data in a different order, so the statistic never varies. 2) Resample the 500 (prediction, label) pairs with replacement, recompute accuracy, repeat 10 000 times, take the 2.5th and 97.5th percentiles (or BCa). 3) Bootstrap samples can never exceed the observed maximum, so the bootstrap distribution of the max is badly biased and concentrated on a few values.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 10 · Bài 10.3</span>
<h2>Bootstrap: sai số chuẩn và khoảng tin cậy bằng lấy mẫu lại</h2>
<p class="lead">Sai số chuẩn của trung vị là bao nhiêu? Của phân vị 95% độ trễ? Của AUC của một mô hình? Thường không có công thức. Bootstrap của Bradley Efron (1979) trả lời bằng máy tính: lấy mẫu lại chính dữ liệu của bạn nhiều lần và quan sát thống kê dao động.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu nguyên lý thay thế (plug-in) đằng sau bootstrap.</li><li>Tính sai số chuẩn bootstrap và khoảng tin cậy phân vị bằng code tự viết.</li><li>Dùng <code>scipy.stats.bootstrap</code> (BCa) và biết khi nào bootstrap hỏng.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Phân phối mẫu của thống kê θ̂ = T(X<sub>1</sub>, …, X<sub>n</sub>) phụ thuộc tổng thể F chưa biết. <strong>Nguyên lý thay thế</strong>: thay F bằng <strong>phân phối thực nghiệm</strong> F̂<sub>n</sub>, đặt xác suất 1/n lên mỗi giá trị quan sát. Lấy n giá trị từ F̂<sub>n</sub> nghĩa là lấy mẫu <strong>có hoàn lại</strong> từ dữ liệu.</p>
<div class="formula"><span class="lbl">Bootstrap phi tham số</span>với b = 1, …, B (vd B = 10 000):   rút x*<sub>1</sub>, …, x*<sub>n</sub> có hoàn lại từ dữ liệu;   tính θ̂*<sub>b</sub> = T(x*)<br>SE<sub>boot</sub> = độ lệch chuẩn của θ̂*<sub>1</sub>, …, θ̂*<sub>B</sub>      KTC phân vị 95% = ( phân vị 2,5% và 97,5% của θ̂* )</div>
<p>Dao động của θ̂* quanh θ̂ bắt chước dao động của θ̂ quanh θ. <strong>Khoảng phân vị</strong> đơn giản; <strong>khoảng BCa</strong> (hiệu chỉnh chệch và gia tốc) điều chỉnh độ chệch và độ lệch của phân phối bootstrap và có độ phủ tốt hơn — là mặc định của SciPy.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — trung vị độ dài phiên.</b> 15 phiên (phút): 1,2; 0,8; 3,5; 2,1; 0,5; 7,9; 1,6; 2,8; 0,9; 12,4; 1,1; 4,3; 0,7; 2,2; 5,6. Dữ liệu lệch phải mạnh (trung bình 3,17, trung vị 2,10), nên trung vị là thước đo tóm tắt tốt hơn — nhưng độ bất định của nó là bao nhiêu?</p>
<p>Bước 1: rút lại 15 giá trị có hoàn lại, lấy trung vị; lặp 10 000 lần. Bước 2: SE<sub>boot</sub> = <b>0,77</b> phút. Bước 3: KTC phân vị 95% = <b>(1,1; 3,5)</b>; BCa cho <b>(0,98; 3,50)</b>. Để ý tính bất đối xứng quanh 2,10: bootstrap nắm được độ lệch mà công thức ± sẽ bỏ sót.</p></div>
<pre><code class="language-python">import numpy as np
from scipy import stats

sessions = np.array([1.2, 0.8, 3.5, 2.1, 0.5, 7.9, 1.6, 2.8, 0.9, 12.4, 1.1, 4.3, 0.7, 2.2, 5.6])  # minutes
print(f"sample median = {np.median(sessions):.2f}, mean = {sessions.mean():.3f}")

rng = np.random.default_rng(2026)
boot = np.array([np.median(rng.choice(sessions, size=len(sessions), replace=True)) for _ in range(10000)])
print(f"bootstrap SE of median = {boot.std(ddof=1):.3f}")
print("percentile 95% CI     =", np.percentile(boot, [2.5, 97.5]).round(2))

res = stats.bootstrap((sessions,), np.median, n_resamples=10000, method="BCa",
                      rng=np.random.default_rng(2026))
print(f"scipy BCa 95% CI      = ({res.confidence_interval.low:.2f}, {res.confidence_interval.high:.2f})")</code></pre>
<div class="out">sample median = 2.10, mean = 3.173
bootstrap SE of median = 0.771
percentile 95% CI     = [1.1 3.5]
scipy BCa 95% CI      = (0.98, 3.50)</div>
<h3>Khi nào bootstrap toả sáng — và khi nào hỏng</h3>
<ul>
<li><strong>Toả sáng:</strong> trung vị, phân vị, trung bình cắt, tỉ số, hệ số tương quan, hệ số hồi quy với sai số lạ, chỉ số học máy (lấy mẫu lại tập kiểm thử để có KTC cho độ chính xác hay AUC).</li>
<li><strong>Hỏng hoặc cần cẩn thận:</strong> n rất nhỏ (dữ liệu không đại diện được F); thống kê phụ thuộc giá trị cực trị như max (bootstrap không bao giờ tạo giá trị lớn hơn max của mẫu — nhớ Uniform(0, θ)); dữ liệu phụ thuộc (dùng block bootstrap cho chuỗi thời gian); dữ liệu đuôi nặng có phương sai vô hạn.</li>
<li><strong>Bootstrap tham số</strong>: nếu tin một mô hình, rút mẫu lại từ mô hình đã khớp (vd Poisson(λ̂)) thay vì từ dữ liệu.</li>
</ul>
<p>Bootstrap ước lượng <em>độ bất định</em>; nó không tạo ra thông tin mới. Trung vị vẫn là 2,10 — bootstrap cho bạn biết nên tin nó tới đâu.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Lấy mẫu lại không hoàn lại (chỉ là hoán vị dữ liệu, lần nào cũng cùng trung vị).</li><li>Dùng quá ít lần lặp (B = 100) cho khoảng 95%; hãy dùng hàng nghìn.</li><li>Bootstrap dữ liệu theo cụm hoặc theo thời gian như thể i.i.d.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Thay thế: thay F bằng phân phối thực nghiệm; lấy mẫu lại có hoàn lại.</li><li>SE<sub>boot</sub> = độ lệch chuẩn của các bản lặp bootstrap; khoảng phân vị và BCa.</li><li>Lý tưởng cho thống kê không có công thức (trung vị, phân vị, chỉ số học máy).</li><li>Cẩn thận với n nhỏ, giá trị cực trị và sự phụ thuộc.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.youtube.com/watch?v=Xz0x-8-cgaQ" target="_blank" rel="noopener">StatQuest — Ý tưởng chính của bootstrap</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class24-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 24: Khoảng tin cậy bootstrap</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.bootstrap.html" target="_blank" rel="noopener">SciPy — bootstrap</a></li><li><a href="https://online.stat.psu.edu/stat415/Lesson08.html" target="_blank" rel="noopener">Penn State STAT 415 — Bài 8: Khoảng tin cậy bootstrap</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Vì sao lấy mẫu lại bootstrap phải có hoàn lại?</li><li>Một bộ phân loại được đánh giá trên 500 ảnh kiểm thử. Mô tả cách lấy KTC 95% cho độ chính xác bằng bootstrap.</li><li>Vì sao bootstrap là công cụ kém để ước lượng cận trên θ của Uniform(0, θ)?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Không hoàn lại thì mọi mẫu lặp chỉ là dữ liệu gốc theo thứ tự khác, thống kê không bao giờ dao động. 2) Rút lại 500 cặp (dự đoán, nhãn) có hoàn lại, tính lại độ chính xác, lặp 10 000 lần, lấy phân vị 2,5% và 97,5% (hoặc BCa). 3) Mẫu bootstrap không bao giờ vượt max quan sát được, nên phân phối bootstrap của max chệch nặng và dồn vào vài giá trị.</p></div>`);

const c104 = L('psi221-ts-10-4',
  '10.4 — Introduction to Bayesian inference: priors, posteriors and credible intervals|||10.4 — Nhập môn suy luận Bayes: tiên nghiệm, hậu nghiệm và khoảng tin cậy Bayes',
  'Hậu nghiệm ∝ hợp lý × tiên nghiệm; liên hợp Beta–Binomial cho tỉ lệ nhấp (Beta(2,2) → Beta(58,66)), trung bình hậu nghiệm, MAP, khoảng credible, P(p > 0,5); Normal–Normal; so sánh với tần suất.',
  `<span class="eyebrow">PSI221 · Chapter 10 · Lesson 10.4</span>
<h2>Introduction to Bayesian inference: priors, posteriors and credible intervals</h2>
<p class="lead">Frequentist inference treats the parameter as fixed and the data as random. Bayesian inference treats the parameter as uncertain and describes that uncertainty with a probability distribution, updated by the data via Bayes' rule — the same rule you used in IPY111, now applied to parameters.</p>
<h3>🎯 Objectives</h3>
<ul><li>Write posterior ∝ likelihood × prior and explain each part.</li><li>Use the Beta–Binomial and Normal–Normal conjugate updates.</li><li>Compute posterior means, credible intervals and posterior probabilities, and compare them with frequentist results.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Bayes' rule for a parameter</span>π(θ | data) = L(θ)·π(θ) / ∫ L(t)·π(t) dt      posterior ∝ likelihood × prior</div>
<p>The <strong>prior</strong> π(θ) encodes what is known before the data (past experiments, physical limits, or deliberate vagueness). The <strong>likelihood</strong> is the same function as in Chapter 2. The <strong>posterior</strong> combines them; everything is then read from it: the posterior mean or the MAP (posterior mode) as point estimates, a 95% <strong>credible interval</strong> (θ lies in it with posterior probability 0.95), and direct probabilities of hypotheses such as P(θ &gt; 0.5 | data).</p>
<p><strong>Conjugate priors</strong> keep the posterior in the same family as the prior, so updating is just arithmetic:</p>
<div class="formula"><span class="lbl">Beta–Binomial</span>prior p ~ Beta(a, b);  data: x successes in n trials   ⇒   posterior p ~ Beta(a + x, b + n − x)<br>posterior mean (a + x)/(a + b + n) — a weighted average of the prior mean a/(a + b) and p̂ = x/n</div>
<div class="formula"><span class="lbl">Normal–Normal (σ known)</span>prior μ ~ N(μ<sub>0</sub>, τ<sub>0</sub><sup>2</sup>);  data x̄ from n obs. with variance σ<sup>2</sup>   ⇒   posterior precision 1/τ<sub>n</sub><sup>2</sup> = 1/τ<sub>0</sub><sup>2</sup> + n/σ<sup>2</sup><br>posterior mean μ<sub>n</sub> = τ<sub>n</sub><sup>2</sup>·( μ<sub>0</sub>/τ<sub>0</sub><sup>2</sup> + n·x̄/σ<sup>2</sup> )   (precisions add; means are precision-weighted)</div>
<p>As n grows, the data dominate the prior and Bayesian and frequentist answers converge. Think of Beta(a, b) as “a prior successes and b prior failures”.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p><b>Example — click-through rate, the Bayesian way.</b> Prior Beta(2, 2): a mild belief that p is near 0.5 (worth 4 pseudo-observations). Data: 56 clicks in 120 views.</p>
<p>Step 1: posterior = Beta(2 + 56, 2 + 64) = <b>Beta(58, 66)</b>. Step 2: posterior mean 58/124 = <b>0.468</b> (p̂ = 0.467, prior mean 0.5 — the data dominate). Step 3: 95% credible interval <b>(0.381, 0.556)</b>: given the model and prior, there is a 95% probability that p lies here — a statement a frequentist CI does not allow. Step 4: P(p &gt; 0.5 | data) = <b>0.235</b>: about a one-in-four chance that the true rate exceeds 50%.</p>
<p>Compare Lesson 4.3: the Wilson 95% CI was (0.380, 0.556) — numerically almost identical, but interpreted differently.</p></div>
<pre><code class="language-python">from scipy import stats

a0, b0 = 2, 2                 # prior Beta(2, 2): mild belief that p is near 0.5
clicks, n = 56, 120           # data: 56 clicks out of 120 views
a1, b1 = a0 + clicks, b0 + n - clicks
post = stats.beta(a1, b1)
print(f"posterior = Beta({a1}, {b1})")
print(f"posterior mean = {post.mean():.4f}, MAP = {(a1 - 1) / (a1 + b1 - 2):.4f}")
lo, hi = post.ppf([0.025, 0.975])
print(f"95% credible interval = ({lo:.4f}, {hi:.4f})")
print(f"P(p &gt; 0.5 | data) = {post.sf(0.5):.4f}")</code></pre>
<div class="out">posterior = Beta(58, 66)
posterior mean = 0.4677, MAP = 0.4672
95% credible interval = (0.3809, 0.5556)
P(p &gt; 0.5 | data) = 0.2354</div>
<h3>Bayesian thinking in computing</h3>
<ul>
<li><strong>Bayesian A/B testing</strong> reports P(B better than A | data) and the expected loss of choosing B, which product teams find intuitive.</li>
<li><strong>Regularisation is a prior:</strong> ridge regression = MAP with a normal prior on the coefficients; lasso = MAP with a Laplace prior.</li>
<li><strong>Smoothing:</strong> Laplace (add-one) smoothing in naive Bayes text classifiers is the posterior mean under a uniform Beta/Dirichlet prior.</li>
<li><strong>Thompson sampling</strong> for multi-armed bandits draws from Beta posteriors to choose which variant to show next.</li>
</ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Choosing the prior after seeing the data to get the desired answer — priors must be justified and reported, and a sensitivity check with other priors is good practice.</li><li>Using a very strong prior with little data and calling the result “evidence”.</li><li>Confusing a credible interval with a confidence interval: same shape of answer, different meaning.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>posterior ∝ likelihood × prior; read estimates, intervals and probabilities from the posterior.</li><li>Beta(a, b) + x of n ⇒ Beta(a + x, b + n − x).</li><li>Normal–Normal: precisions add, means are precision-weighted.</li><li>With much data, Bayesian and frequentist answers agree; interpretations differ.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class15-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 15: Conjugate priors: Beta and normal</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class16-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 16b: Probability (credible) intervals</a></li><li><a href="https://online.stat.psu.edu/stat415/Lesson11.html" target="_blank" rel="noopener">Penn State STAT 415 — Lesson 11: Bayesian methods</a></li><li><a href="https://www.3blue1brown.com/lessons/binomial-distributions" target="_blank" rel="noopener">3Blue1Brown — Probabilities of probabilities (Beta distributions)</a></li><li><a href="https://seeing-theory.brown.edu/bayesian-inference/index.html" target="_blank" rel="noopener">Seeing Theory — Bayesian inference</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Prior Beta(1, 1) (uniform). Data: 7 successes in 10 trials. Give the posterior and its mean.</li><li>Normal–Normal: prior μ ~ N(100, 10<sup>2</sup>), σ = 20, n = 16, x̄ = 110. Find the posterior mean and SD.</li><li>Why does the prior matter less as n grows?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Beta(8, 4), mean 8/12 = 0.667. 2) Prior precision 1/100 = 0.01; data precision 16/400 = 0.04; posterior precision 0.05 ⇒ SD √20 = 4.47; mean = (0.01·100 + 0.04·110)/0.05 = 108. 3) The data precision n/σ<sup>2</sup> (or the counts x and n − x) grows with n while the prior's contribution stays fixed.</p></div>`,
  `<span class="eyebrow">PSI221 · Chương 10 · Bài 10.4</span>
<h2>Nhập môn suy luận Bayes: tiên nghiệm, hậu nghiệm và khoảng tin cậy Bayes</h2>
<p class="lead">Suy luận tần suất coi tham số cố định và dữ liệu ngẫu nhiên. Suy luận Bayes coi tham số là bất định và mô tả độ bất định đó bằng một phân phối xác suất, được dữ liệu cập nhật qua công thức Bayes — chính công thức bạn dùng ở IPY111, nay áp cho tham số.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết hậu nghiệm ∝ hợp lý × tiên nghiệm và giải thích từng phần.</li><li>Dùng cập nhật liên hợp Beta–Binomial và Normal–Normal.</li><li>Tính trung bình hậu nghiệm, khoảng tin cậy Bayes và xác suất hậu nghiệm, rồi so với kết quả tần suất.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Công thức Bayes cho tham số</span>π(θ | dữ liệu) = L(θ)·π(θ) / ∫ L(t)·π(t) dt      hậu nghiệm ∝ hợp lý × tiên nghiệm</div>
<p><strong>Tiên nghiệm</strong> π(θ) mã hoá điều đã biết trước dữ liệu (thí nghiệm cũ, giới hạn vật lý, hoặc cố ý mơ hồ). <strong>Hàm hợp lý</strong> chính là hàm ở Chương 2. <strong>Hậu nghiệm</strong> kết hợp hai cái; mọi thứ sau đó đọc từ nó: trung bình hậu nghiệm hoặc MAP (mốt hậu nghiệm) làm ước lượng điểm, <strong>khoảng tin cậy Bayes</strong> 95% (credible interval — θ nằm trong đó với xác suất hậu nghiệm 0,95), và xác suất trực tiếp của giả thuyết như P(θ &gt; 0,5 | dữ liệu).</p>
<p><strong>Tiên nghiệm liên hợp</strong> giữ hậu nghiệm cùng họ với tiên nghiệm, nên cập nhật chỉ là phép tính số học:</p>
<div class="formula"><span class="lbl">Beta–Binomial</span>tiên nghiệm p ~ Beta(a, b);  dữ liệu: x thành công trong n phép thử   ⇒   hậu nghiệm p ~ Beta(a + x, b + n − x)<br>trung bình hậu nghiệm (a + x)/(a + b + n) — trung bình có trọng số của trung bình tiên nghiệm a/(a + b) và p̂ = x/n</div>
<div class="formula"><span class="lbl">Normal–Normal (σ đã biết)</span>tiên nghiệm μ ~ N(μ<sub>0</sub>, τ<sub>0</sub><sup>2</sup>);  dữ liệu x̄ từ n quan sát phương sai σ<sup>2</sup>   ⇒   độ chính xác hậu nghiệm 1/τ<sub>n</sub><sup>2</sup> = 1/τ<sub>0</sub><sup>2</sup> + n/σ<sup>2</sup><br>trung bình hậu nghiệm μ<sub>n</sub> = τ<sub>n</sub><sup>2</sup>·( μ<sub>0</sub>/τ<sub>0</sub><sup>2</sup> + n·x̄/σ<sup>2</sup> )   (độ chính xác cộng lại; trung bình lấy trọng số theo độ chính xác)</div>
<p>Khi n lớn, dữ liệu lấn át tiên nghiệm và câu trả lời Bayes với tần suất hội tụ về nhau. Hãy hình dung Beta(a, b) như “a lần thành công và b lần thất bại giả định trước”.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — tỉ lệ nhấp, theo cách Bayes.</b> Tiên nghiệm Beta(2, 2): niềm tin nhẹ rằng p gần 0,5 (tương đương 4 quan sát giả). Dữ liệu: 56 lượt nhấp trên 120 lượt xem.</p>
<p>Bước 1: hậu nghiệm = Beta(2 + 56, 2 + 64) = <b>Beta(58, 66)</b>. Bước 2: trung bình hậu nghiệm 58/124 = <b>0,468</b> (p̂ = 0,467, trung bình tiên nghiệm 0,5 — dữ liệu lấn át). Bước 3: khoảng tin cậy Bayes 95% <b>(0,381; 0,556)</b>: với mô hình và tiên nghiệm đã chọn, có 95% xác suất p nằm ở đây — phát biểu mà khoảng tin cậy tần suất không cho phép. Bước 4: P(p &gt; 0,5 | dữ liệu) = <b>0,235</b>: khoảng một phần tư khả năng tỉ lệ thật vượt 50%.</p>
<p>So với Bài 4.3: KTC Wilson 95% là (0,380; 0,556) — gần như trùng về số, nhưng diễn giải khác nhau.</p></div>
<pre><code class="language-python">from scipy import stats

a0, b0 = 2, 2                 # prior Beta(2, 2): mild belief that p is near 0.5
clicks, n = 56, 120           # data: 56 clicks out of 120 views
a1, b1 = a0 + clicks, b0 + n - clicks
post = stats.beta(a1, b1)
print(f"posterior = Beta({a1}, {b1})")
print(f"posterior mean = {post.mean():.4f}, MAP = {(a1 - 1) / (a1 + b1 - 2):.4f}")
lo, hi = post.ppf([0.025, 0.975])
print(f"95% credible interval = ({lo:.4f}, {hi:.4f})")
print(f"P(p &gt; 0.5 | data) = {post.sf(0.5):.4f}")</code></pre>
<div class="out">posterior = Beta(58, 66)
posterior mean = 0.4677, MAP = 0.4672
95% credible interval = (0.3809, 0.5556)
P(p &gt; 0.5 | data) = 0.2354</div>
<h3>Tư duy Bayes trong ngành máy tính</h3>
<ul>
<li><strong>A/B test kiểu Bayes</strong> báo cáo P(B tốt hơn A | dữ liệu) và tổn thất kỳ vọng khi chọn B, điều mà đội sản phẩm thấy trực quan.</li>
<li><strong>Chính quy hoá là một tiên nghiệm:</strong> hồi quy ridge = MAP với tiên nghiệm chuẩn trên hệ số; lasso = MAP với tiên nghiệm Laplace.</li>
<li><strong>Làm trơn:</strong> làm trơn Laplace (cộng một) trong bộ phân loại văn bản naive Bayes là trung bình hậu nghiệm với tiên nghiệm Beta/Dirichlet đều.</li>
<li><strong>Thompson sampling</strong> cho bài toán multi-armed bandit rút từ hậu nghiệm Beta để chọn phiên bản hiển thị tiếp theo.</li>
</ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chọn tiên nghiệm sau khi xem dữ liệu để ra kết quả mong muốn — tiên nghiệm phải được biện minh và báo cáo, và nên kiểm tra độ nhạy với các tiên nghiệm khác.</li><li>Dùng tiên nghiệm rất mạnh với ít dữ liệu rồi gọi kết quả là “bằng chứng”.</li><li>Nhầm khoảng tin cậy Bayes với khoảng tin cậy tần suất: câu trả lời cùng dạng, ý nghĩa khác nhau.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>hậu nghiệm ∝ hợp lý × tiên nghiệm; đọc ước lượng, khoảng và xác suất từ hậu nghiệm.</li><li>Beta(a, b) + x trên n ⇒ Beta(a + x, b + n − x).</li><li>Normal–Normal: độ chính xác cộng lại, trung bình lấy trọng số theo độ chính xác.</li><li>Nhiều dữ liệu thì câu trả lời Bayes và tần suất trùng nhau; cách diễn giải khác nhau.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class15-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 15: Tiên nghiệm liên hợp Beta và chuẩn</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class16-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 16b: Khoảng xác suất (credible)</a></li><li><a href="https://online.stat.psu.edu/stat415/Lesson11.html" target="_blank" rel="noopener">Penn State STAT 415 — Bài 11: Phương pháp Bayes</a></li><li><a href="https://www.3blue1brown.com/lessons/binomial-distributions" target="_blank" rel="noopener">3Blue1Brown — Xác suất của xác suất (phân phối Beta)</a></li><li><a href="https://seeing-theory.brown.edu/bayesian-inference/index.html" target="_blank" rel="noopener">Seeing Theory — Suy luận Bayes</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tiên nghiệm Beta(1, 1) (đều). Dữ liệu: 7 thành công trong 10 phép thử. Cho hậu nghiệm và trung bình của nó.</li><li>Normal–Normal: tiên nghiệm μ ~ N(100, 10<sup>2</sup>), σ = 20, n = 16, x̄ = 110. Tìm trung bình và độ lệch chuẩn hậu nghiệm.</li><li>Vì sao tiên nghiệm bớt quan trọng khi n tăng?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Beta(8, 4), trung bình 8/12 = 0,667. 2) Độ chính xác tiên nghiệm 1/100 = 0,01; của dữ liệu 16/400 = 0,04; hậu nghiệm 0,05 ⇒ SD √20 = 4,47; trung bình = (0,01·100 + 0,04·110)/0,05 = 108. 3) Độ chính xác của dữ liệu n/σ<sup>2</sup> (hoặc các số đếm x và n − x) tăng theo n, còn đóng góp của tiên nghiệm giữ nguyên.</p></div>`);

const q10 = QZ(10, 'Quiz — Chapter 10: Nonparametric, resampling and Bayesian methods|||Quiz — Chương 10: Phi tham số, lấy mẫu lại và phương pháp Bayes', 'Kiểm tra chương 10: kiểm định hạng, kiểm định hoán vị, bootstrap, cập nhật Bayes liên hợp và khoảng credible.', [
  Q('q1', 'The rank-based alternative to Welch’s t-test for two independent groups is|||Phương án dựa trên hạng thay cho t Welch với hai nhóm độc lập là',
    ['Wilcoxon signed-rank|||Wilcoxon hạng có dấu', 'Mann–Whitney U|||Mann–Whitney U', 'Kruskal–Wallis|||Kruskal–Wallis', 'the sign test|||kiểm định dấu'], 1,
    'Signed-rank and sign tests are for paired data; Kruskal–Wallis for k groups.|||Hạng có dấu và kiểm định dấu dành cho dữ liệu cặp; Kruskal–Wallis cho k nhóm.'),
  Q('q2', 'All 10 paired differences are positive. The two-sided sign-test p-value is|||Cả 10 hiệu số cặp đều dương. p-value hai phía của kiểm định dấu là',
    ['0.001|||0,001', '0.002|||0,002', '0.01|||0,01', '0.05|||0,05'], 1,
    '2·(1/2)¹⁰ = 0.00195.|||2·(1/2)¹⁰ = 0,00195.'),
  Q('q3', 'Under normality, the asymptotic efficiency of Mann–Whitney relative to the t-test is about|||Với dữ liệu chuẩn, hiệu suất tiệm cận của Mann–Whitney so với kiểm định t khoảng',
    ['0.50|||0,50', '0.64|||0,64', '0.955|||0,955', '1.5|||1,5'], 2,
    '3/π ≈ 0.955: very little power is lost.|||3/π ≈ 0,955: mất rất ít lực.'),
  Q('q4', 'A permutation test is valid when, under H₀, the observations are|||Kiểm định hoán vị hợp lệ khi, dưới H₀, các quan sát',
    ['normally distributed|||có phân phối chuẩn', 'exchangeable between groups|||hoán đổi được giữa các nhóm', 'large in number|||có số lượng lớn', 'paired|||ghép cặp'], 1,
    'Shuffling labels must not change the joint distribution.|||Xáo nhãn không được làm đổi phân phối đồng thời.'),
  Q('q5', 'In 5 000 shuffles, 24 were at least as extreme as observed. The Monte Carlo p-value is about|||Trong 5 000 lần xáo, 24 lần ít nhất cực đoan như quan sát. p-value Monte Carlo khoảng',
    ['0.0048|||0,0048', '0.0050|||0,0050', '0.024|||0,024', '0.24|||0,24'], 1,
    '(24 + 1)/(5000 + 1) ≈ 0.0050.|||(24 + 1)/(5000 + 1) ≈ 0,0050.'),
  Q('q6', 'Bootstrap resampling draws from the data|||Bootstrap lấy mẫu lại từ dữ liệu',
    ['without replacement|||không hoàn lại', 'with replacement|||có hoàn lại', 'only the extremes|||chỉ các giá trị cực trị', 'from a normal fit|||từ phân phối chuẩn đã khớp'], 1,
    'Sampling from the empirical distribution = with replacement.|||Lấy mẫu từ phân phối thực nghiệm = có hoàn lại.'),
  Q('q7', 'For which statistic is the nonparametric bootstrap a poor choice?|||Với thống kê nào bootstrap phi tham số là lựa chọn kém?',
    ['the median|||trung vị', 'the sample maximum|||giá trị lớn nhất của mẫu', 'a correlation|||một hệ số tương quan', 'a trimmed mean|||trung bình cắt'], 1,
    'Resamples can never exceed the observed maximum.|||Mẫu lặp không bao giờ vượt max quan sát được.'),
  Q('q8', 'Prior Beta(2, 2) and 56 successes in 120 trials give the posterior|||Tiên nghiệm Beta(2, 2) và 56 thành công trong 120 phép thử cho hậu nghiệm',
    ['Beta(56, 64)|||Beta(56, 64)', 'Beta(58, 66)|||Beta(58, 66)', 'Beta(58, 122)|||Beta(58, 122)', 'Beta(2, 120)|||Beta(2, 120)'], 1,
    'Beta(a + x, b + n − x).|||Beta(a + x, b + n − x).'),
  Q('q9', 'A 95% credible interval (0.38, 0.56) for p means|||Khoảng tin cậy Bayes 95% (0,38; 0,56) cho p nghĩa là',
    ['95% of samples give intervals containing p|||95% số mẫu cho khoảng chứa p', 'given the model and prior, P(0.38 < p < 0.56 | data) = 0.95|||với mô hình và tiên nghiệm đã chọn, P(0,38 < p < 0,56 | dữ liệu) = 0,95', 'p = 0.47 for sure|||chắc chắn p = 0,47', 'the p-value is 0.05|||p-value bằng 0,05'], 1,
    'Credible intervals are posterior probability statements.|||Khoảng credible là phát biểu xác suất hậu nghiệm.'),
  Q('q10', 'Ridge regression can be viewed as MAP estimation with|||Hồi quy ridge có thể xem là ước lượng MAP với',
    ['a uniform prior|||tiên nghiệm đều', 'a normal prior on the coefficients|||tiên nghiệm chuẩn trên hệ số', 'a Laplace prior|||tiên nghiệm Laplace', 'no prior|||không có tiên nghiệm'], 1,
    'The L2 penalty is the negative log of a normal prior; Laplace gives the lasso.|||Phạt L2 là âm log của tiên nghiệm chuẩn; Laplace cho lasso.'),
]);

const ch10 = {
  title: 'Chapter 10 — Nonparametric methods, the bootstrap and Bayesian inference|||Chương 10 — Phương pháp phi tham số, bootstrap và suy luận Bayes',
  description: 'Kiểm định dấu, Wilcoxon, Mann–Whitney, Kruskal–Wallis; kiểm định hoán vị; bootstrap SE và khoảng BCa; nhập môn Bayes: Beta–Binomial, Normal–Normal, khoảng credible (Wasserman Ch. 8, 11 · MIT 18.05 bài đọc 15–24 · STAT 500 bài 11).',
  lessons: [c101, c102, c103, c104, q10],
};


// ───────────────────────────── Xuất ─────────────────────────────
export default [muc0, ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9, ch10];
