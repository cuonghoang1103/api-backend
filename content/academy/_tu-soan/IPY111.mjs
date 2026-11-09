// Khoá TỰ SOẠN cho IPY111 — trường chưa công bố syllabus trên FLM (dò 09/11/2026). Soạn theo _HOP-DONG-TU-SOAN.md.
// Khung bám thứ tự giáo trình chuẩn: Blitzstein & Hwang "Introduction to Probability" (2e, Harvard Stat 110) và
// Ross "A First Course in Probability" (10e); đối chiếu OpenStax "Introductory Statistics 2e" (ch. 3–7) và MIT 18.05.
// Mọi ví dụ số đã kiểm bằng python3 (fractions/sympy/scipy). Mọi đoạn code Python đã chạy thật, output dán nguyên văn.
// Mọi link ngoài đã mở thử (HTTP 200 + tiêu đề trang đúng chủ đề) ngày 09/11/2026.
// ⚠️ File này KHÔNG dùng chuỗi nội suy (dấu đô-la + ngoặc nhọn) và không backtick lồng; nội dung ghép bằng toán tử +.

const bi = (en, vi) => '<div class="ml-en">' + en + '</div>\n<div class="ml-vi">' + vi + '</div>';
const L = (slug, title, description, en, vi) => ({ title, slug, type: 'DOCUMENT', description, content: bi(en, vi) });
const Q = (id, question, options, correctIndex, explanation) => ({ id, question, options, correctIndex, points: 1, explanation });
const QZ = (ch, title, description, questions) => ({
  title, slug: 'ipy111-ts-quiz-' + ch, type: 'QUIZ', description,
  quiz: { timeLimitSeconds: 900, questions },
});

// ───────────────────────────── Mục 0 ─────────────────────────────
const m01 = L('ipy111-ts-0-1',
  '0.1 — Welcome to IPY111: what probability is and why you study it|||0.1 — Giới thiệu IPY111: xác suất học gì, để làm gì',
  'Xác suất học gì, dùng vào đâu (học máy, thuật toán ngẫu nhiên, kiểm thử A/B, mạng, bảo mật), 8 chuẩn đầu ra tự soạn, môn liên quan, cảnh báo: trường chưa công bố syllabus trên FLM.',
  `<span class="eyebrow">IPY111 · Section 0 · Lesson 0.1</span>
<h2>Welcome to Introduction to Probability</h2>
<p class="lead">Probability is the mathematics of <strong>uncertainty</strong>. It gives a precise number between 0 and 1 to statements such as “this e-mail is spam”, “the server will be down tonight” or “the new button raises sign-ups”, and it gives rules for updating those numbers when new evidence arrives.</p>
<div class="callout"><p>⚠️ <strong>Important.</strong> FPT University has <strong>not published the IPY111 syllabus on FLM</strong> (we searched the code, its variants and the course name on 09/11/2026). This course framework is therefore <strong>self-authored</strong>, following the chapter order of the international standard textbooks (Blitzstein &amp; Hwang <em>Introduction to Probability</em>, Ross <em>A First Course in Probability</em>). <strong>Grading weights, assessment format and exam dates are decided by your lecturer</strong> — always follow the course outline your lecturer gives in class.</p></div>
<h3>What is this course about?</h3>
<p>We start from <em>counting</em> (how many outcomes are there?), build the <em>axioms</em> of probability, learn to <em>condition</em> on information (Bayes' rule), then model uncertain quantities with <em>random variables</em> — discrete ones such as the number of bugs in a release, and continuous ones such as the time until the next request arrives. We finish with the two great limit theorems — the <strong>Law of Large Numbers</strong> and the <strong>Central Limit Theorem</strong> — which explain why averages are predictable and why the bell curve appears everywhere.</p>
<h3>Why does a software / AI student need it?</h3>
<ul>
<li><strong>Machine learning:</strong> classifiers output probabilities; Naive Bayes, logistic regression and neural networks are trained by maximising a probability (likelihood).</li>
<li><strong>Algorithms &amp; systems:</strong> hashing, load balancing, randomized quicksort and Monte Carlo simulation all rely on random choices; the birthday problem tells you how often hash collisions happen.</li>
<li><strong>Product &amp; data:</strong> A/B testing decides whether a change “really” helped or was just luck — that is the Central Limit Theorem at work.</li>
<li><strong>Reliability &amp; security:</strong> uptime of replicated servers, the strength of a password, false alarms of an intrusion detector — all are probability calculations.</li>
</ul>
<h3>Learning outcomes (self-authored)</h3>
<p>After this course you should be able to:</p>
<ol>
<li>Count outcomes with the multiplication rule, permutations and combinations, and turn counts into probabilities.</li>
<li>State the axioms of probability and derive the complement rule, inclusion–exclusion and their consequences.</li>
<li>Compute conditional probabilities, apply the law of total probability and Bayes' rule, and avoid the classic fallacies.</li>
<li>Decide whether events are independent and use independence in reliability and repeated-trial problems.</li>
<li>Work with discrete random variables (PMF, CDF) and the Bernoulli, binomial, geometric, hypergeometric and Poisson distributions.</li>
<li>Compute expectation and variance, using linearity of expectation and indicator variables.</li>
<li>Work with continuous random variables (PDF, CDF) and the uniform, exponential and normal distributions; standardise to Z.</li>
<li>Describe joint distributions, covariance and correlation, and apply Markov/Chebyshev inequalities, the Law of Large Numbers and the Central Limit Theorem — checking results with short Python simulations.</li>
</ol>
<h3>Related courses at FPTU</h3>
<p>IPY111 sits in <strong>semester 1</strong>, alongside <strong>CAL111 — Calculus I</strong>: the continuous part of this course (Chapters 7–10) uses integrals, so learn the two together. Probability is the foundation for later statistics, data-science and AI / machine-learning courses in the programme — check the exact prerequisite chain in your major's curriculum. Required background: high-school algebra, sets, sums; basic integrals for the continuous chapters.</p>
<h3>How to study this course</h3>
<ul>
<li>Every lesson has objectives, a lecture, step-by-step worked examples, common mistakes, a 📌 summary, 🔗 further learning and 🧪 practice with answers. Each chapter ends with a 10-question quiz.</li>
<li>Do the practice <strong>on paper first</strong>; then check it with a few lines of Python. Many lessons include code that we actually ran — the printed output is shown exactly.</li>
<li>Whenever an answer surprises you (birthday problem, Monty Hall, medical tests) — <strong>simulate it</strong>. Probability intuition is trained by checking, not by memorising.</li>
</ul>`,
  `<span class="eyebrow">IPY111 · Mục 0 · Bài 0.1</span>
<h2>Chào mừng đến với Nhập môn Xác suất</h2>
<p class="lead">Xác suất là toán học của <strong>sự bất định</strong>. Nó gán một con số chính xác từ 0 đến 1 cho những câu như “email này là spam”, “tối nay server sẽ sập” hay “nút bấm mới làm tăng lượt đăng ký”, và cho ta quy tắc cập nhật các con số đó khi có bằng chứng mới.</p>
<div class="callout"><p>⚠️ <strong>Lưu ý quan trọng.</strong> Trường <strong>chưa công bố syllabus của IPY111 trên FLM</strong> (đã dò mã môn, mã biến thể và tên môn ngày 09/11/2026). Vì vậy khung môn này là <strong>khung tự soạn</strong>, bám thứ tự chương của giáo trình chuẩn quốc tế (Blitzstein &amp; Hwang <em>Introduction to Probability</em>, Ross <em>A First Course in Probability</em>). <strong>Cách tính điểm, hình thức đánh giá và lịch thi theo giảng viên</strong> — luôn theo đề cương giảng viên phát trên lớp.</p></div>
<h3>Môn này học gì?</h3>
<p>Ta bắt đầu từ <em>phép đếm</em> (có bao nhiêu kết quả?), dựng <em>hệ tiên đề</em> xác suất, học cách <em>lấy điều kiện</em> theo thông tin (quy tắc Bayes), rồi mô hình hoá các đại lượng bất định bằng <em>biến ngẫu nhiên</em> — rời rạc như số bug trong một bản phát hành, liên tục như thời gian đến request kế tiếp. Cuối môn là hai định lý giới hạn lớn — <strong>Luật số lớn</strong> và <strong>Định lý giới hạn trung tâm</strong> — giải thích vì sao trung bình lại dự đoán được và vì sao đường cong hình chuông xuất hiện khắp nơi.</p>
<h3>Sinh viên phần mềm / AI cần nó để làm gì?</h3>
<ul>
<li><strong>Học máy:</strong> bộ phân loại trả về xác suất; Naive Bayes, hồi quy logistic, mạng nơ-ron đều được huấn luyện bằng cách cực đại hoá một xác suất (hàm hợp lý).</li>
<li><strong>Thuật toán &amp; hệ thống:</strong> băm, cân bằng tải, quicksort ngẫu nhiên, mô phỏng Monte Carlo đều dựa vào lựa chọn ngẫu nhiên; bài toán ngày sinh cho biết va chạm băm xảy ra thường cỡ nào.</li>
<li><strong>Sản phẩm &amp; dữ liệu:</strong> kiểm thử A/B quyết định một thay đổi “thật sự” có ích hay chỉ là may mắn — đó chính là Định lý giới hạn trung tâm.</li>
<li><strong>Độ tin cậy &amp; bảo mật:</strong> thời gian hoạt động của cụm server nhân bản, độ mạnh của mật khẩu, báo động giả của hệ phát hiện xâm nhập — đều là bài toán xác suất.</li>
</ul>
<h3>Chuẩn đầu ra (tự soạn)</h3>
<p>Học xong môn, bạn cần làm được:</p>
<ol>
<li>Đếm số kết quả bằng quy tắc nhân, hoán vị, tổ hợp và chuyển số đếm thành xác suất.</li>
<li>Phát biểu hệ tiên đề xác suất và suy ra quy tắc phần bù, công thức bao hàm – loại trừ cùng các hệ quả.</li>
<li>Tính xác suất có điều kiện, áp dụng công thức xác suất toàn phần và quy tắc Bayes, tránh các ngộ nhận kinh điển.</li>
<li>Xét tính độc lập của các biến cố và dùng nó trong bài toán độ tin cậy, phép thử lặp.</li>
<li>Làm việc với biến ngẫu nhiên rời rạc (PMF, CDF) và các phân phối Bernoulli, nhị thức, hình học, siêu bội, Poisson.</li>
<li>Tính kỳ vọng và phương sai, dùng tính tuyến tính của kỳ vọng và biến chỉ báo.</li>
<li>Làm việc với biến ngẫu nhiên liên tục (PDF, CDF) và các phân phối đều, mũ, chuẩn; chuẩn hoá về Z.</li>
<li>Mô tả phân phối đồng thời, hiệp phương sai, tương quan; áp dụng bất đẳng thức Markov/Chebyshev, Luật số lớn và Định lý giới hạn trung tâm — tự kiểm kết quả bằng mô phỏng Python ngắn.</li>
</ol>
<h3>Môn liên quan trong khung FPTU</h3>
<p>IPY111 nằm ở <strong>kỳ 1</strong>, học song song với <strong>CAL111 — Giải tích I</strong>: phần liên tục của môn này (Chương 7–10) dùng tích phân, nên học hai môn cùng nhau. Xác suất là nền cho các môn thống kê, khoa học dữ liệu và AI / học máy về sau — chuỗi tiên quyết chính xác xem trong chương trình khung ngành của bạn. Kiến thức cần có: đại số phổ thông, tập hợp, phép tính tổng; tích phân cơ bản cho các chương liên tục.</p>
<h3>Học môn này thế nào cho hiệu quả</h3>
<ul>
<li>Mỗi bài có mục tiêu, bài giảng, ví dụ giải từng bước, lỗi hay gặp, 📌 tóm tắt, 🔗 học thêm và 🧪 tự luyện có đáp án. Cuối mỗi chương có quiz 10 câu.</li>
<li>Làm tự luyện <strong>ra giấy trước</strong>, rồi kiểm bằng vài dòng Python. Nhiều bài có code đã chạy thật — output in ra được dán nguyên văn.</li>
<li>Khi một đáp án làm bạn bất ngờ (bài toán ngày sinh, Monty Hall, xét nghiệm y khoa) — <strong>hãy mô phỏng nó</strong>. Trực giác xác suất được rèn bằng kiểm chứng, không phải bằng học thuộc.</li>
</ul>`);

const m02 = L('ipy111-ts-0-2',
  '0.2 — Textbooks & learning resources (verified)|||0.2 — Giáo trình & tài liệu học (đã kiểm)',
  'Giáo trình chuẩn kèm ISBN đã kiểm (Blitzstein & Hwang 2e, Ross 10e, Grinstead & Snell), sách mở OpenStax Introductory Statistics 2e, khoá mở MIT 18.05 / RES.6-012, Harvard Stat 110, Seeing Theory, công cụ Python.',
  `<span class="eyebrow">IPY111 · Section 0 · Lesson 0.2</span>
<h2>Textbooks &amp; learning resources</h2>
<p class="lead">This course follows the chapter order of the standard textbooks below. You do <strong>not</strong> need to buy anything: the authors of the main textbook host a free PDF, and the open books and MIT readings are free and legal online.</p>
<h3>📘 Main textbooks</h3>
<ol>
<li><strong>Joseph K. Blitzstein, Jessica Hwang — <em>Introduction to Probability</em>, 2nd edition.</strong> Chapman &amp; Hall/CRC (Taylor &amp; Francis), series “Texts in Statistical Science”, 2019. Hardback ISBN 978-1-138-36991-7. <a href="https://www.routledge.com/Introduction-to-Probability-Second-Edition/Blitzstein-Hwang/p/book/9781138369917" target="_blank" rel="noopener">Publisher page</a> · <a href="http://probabilitybook.net/" target="_blank" rel="noopener">free PDF hosted by the authors</a>. The textbook of Harvard's Stat 110; our chapters follow its chapters 1–7 and 10 (counting, conditional probability, random variables, expectation, continuous distributions, joint distributions, limit theorems).</li>
<li><strong>Sheldon Ross — <em>A First Course in Probability</em>, 10th edition.</strong> Pearson, 2018 (© 2019). ISBN 978-0-13-475311-9; Global Edition ISBN 978-1-292-26920-7. <a href="https://www.pearson.com/en-us/subject-catalog/p/first-course-in-probability-a/P200000006334/9780134753119" target="_blank" rel="noopener">Publisher page</a>. The classic first course, with a very large bank of exercises; chapters 1–8 cover this course.</li>
<li><strong>Charles M. Grinstead, J. Laurie Snell — <em>Introduction to Probability</em>, 2nd revised edition.</strong> American Mathematical Society, 1997. ISBN 978-0-8218-0749-1. Free under the GNU FDL: <a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)" target="_blank" rel="noopener">read online (LibreTexts)</a> · <a href="https://math.dartmouth.edu/~prob/prob/prob.pdf" target="_blank" rel="noopener">PDF (Dartmouth)</a>. Strong on simulation and computing.</li>
<li><strong>Barbara Illowsky, Susan Dean — <em>Introductory Statistics 2e</em>.</strong> OpenStax (Rice University), 2023. Free and legal online: <a href="https://openstax.org/books/introductory-statistics-2e/pages/1-introduction" target="_blank" rel="noopener">read online</a>. Chapters 3–7 (probability topics, discrete and continuous random variables, the normal distribution, the Central Limit Theorem) are the gentlest second explanation of our material.</li>
</ol>
<h3>🎓 Open courses &amp; lectures</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/" target="_blank" rel="noopener">MIT OpenCourseWare 18.05 — Introduction to Probability and Statistics (Spring 2022)</a>: short readings per class, problem sets and exams with solutions. Many lessons below link the matching reading.</li>
<li><a href="https://ocw.mit.edu/courses/res-6-012-introduction-to-probability-spring-2018/" target="_blank" rel="noopener">MIT OCW RES.6-012 — Introduction to Probability (John Tsitsiklis)</a>: full video lectures and solved problems.</li>
<li><a href="https://www.youtube.com/playlist?list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo" target="_blank" rel="noopener">Harvard Statistics 110: Probability (Joe Blitzstein) — full lecture playlist on YouTube</a>.</li>
<li><a href="https://www.edx.org/learn/probability/harvard-university-introduction-to-probability" target="_blank" rel="noopener">HarvardX on edX — Introduction to Probability</a>: the online version of Stat 110.</li>
<li><a href="https://seeing-theory.brown.edu/" target="_blank" rel="noopener">Seeing Theory (Brown University)</a>: interactive visual introduction to probability.</li>
<li><a href="https://www.3blue1brown.com/lessons/bayes-theorem" target="_blank" rel="noopener">3Blue1Brown — Bayes' theorem</a> and <a href="https://www.3blue1brown.com/lessons/clt" target="_blank" rel="noopener">the Central Limit Theorem</a>: the best visual intuition.</li>
</ul>
<h3>🛠️ Tools for checking your work</h3>
<ul>
<li><a href="https://docs.python.org/3/library/math.html" target="_blank" rel="noopener">Python <code>math</code></a> (<code>comb</code>, <code>perm</code>, <code>factorial</code>) and <a href="https://docs.python.org/3/library/random.html" target="_blank" rel="noopener"><code>random</code></a> — counting and simulation with no extra install.</li>
<li><a href="https://docs.scipy.org/doc/scipy/reference/stats.html" target="_blank" rel="noopener">SciPy <code>scipy.stats</code></a> — PMF/PDF/CDF, means and variances of every distribution in this course.</li>
<li><a href="https://numpy.org/doc/stable/reference/random/generator.html" target="_blank" rel="noopener">NumPy random Generator</a> — fast simulation of millions of trials.</li>
</ul>
<div class="meo"><p><strong>Study plan.</strong> For each lesson: read the lesson here → read the linked textbook section → do 5–10 exercises from Blitzstein &amp; Hwang or OpenStax → do the 🧪 practice → simulate one surprising answer in Python → take the chapter quiz. About 5–7 hours per chapter.</p></div>`,
  `<span class="eyebrow">IPY111 · Mục 0 · Bài 0.2</span>
<h2>Giáo trình &amp; tài liệu học</h2>
<p class="lead">Khoá này bám thứ tự chương của các giáo trình chuẩn dưới đây. Bạn <strong>không</strong> cần mua sách: tác giả giáo trình chính để sẵn bản PDF miễn phí, còn sách mở và bài đọc MIT đều miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình chính</h3>
<ol>
<li><strong>Joseph K. Blitzstein, Jessica Hwang — <em>Introduction to Probability</em>, tái bản lần 2.</strong> Chapman &amp; Hall/CRC (Taylor &amp; Francis), bộ “Texts in Statistical Science”, 2019. ISBN bìa cứng 978-1-138-36991-7. <a href="https://www.routledge.com/Introduction-to-Probability-Second-Edition/Blitzstein-Hwang/p/book/9781138369917" target="_blank" rel="noopener">Trang nhà xuất bản</a> · <a href="http://probabilitybook.net/" target="_blank" rel="noopener">PDF miễn phí do tác giả lưu trữ</a>. Giáo trình của môn Stat 110 (Harvard); các chương của khoá bám chương 1–7 và 10 của sách (đếm, xác suất có điều kiện, biến ngẫu nhiên, kỳ vọng, phân phối liên tục, phân phối đồng thời, định lý giới hạn).</li>
<li><strong>Sheldon Ross — <em>A First Course in Probability</em>, tái bản lần 10.</strong> Pearson, 2018 (© 2019). ISBN 978-0-13-475311-9; bản Global Edition ISBN 978-1-292-26920-7. <a href="https://www.pearson.com/en-us/subject-catalog/p/first-course-in-probability-a/P200000006334/9780134753119" target="_blank" rel="noopener">Trang nhà xuất bản</a>. Giáo trình nhập môn kinh điển, kho bài tập rất lớn; chương 1–8 phủ môn này.</li>
<li><strong>Charles M. Grinstead, J. Laurie Snell — <em>Introduction to Probability</em>, bản 2 có sửa.</strong> American Mathematical Society, 1997. ISBN 978-0-8218-0749-1. Miễn phí theo giấy phép GNU FDL: <a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)" target="_blank" rel="noopener">đọc online (LibreTexts)</a> · <a href="https://math.dartmouth.edu/~prob/prob/prob.pdf" target="_blank" rel="noopener">PDF (Dartmouth)</a>. Mạnh về mô phỏng và tính toán.</li>
<li><strong>Barbara Illowsky, Susan Dean — <em>Introductory Statistics 2e</em>.</strong> OpenStax (Đại học Rice), 2023. Miễn phí, hợp pháp: <a href="https://openstax.org/books/introductory-statistics-2e/pages/1-introduction" target="_blank" rel="noopener">đọc online</a>. Chương 3–7 (xác suất, biến ngẫu nhiên rời rạc và liên tục, phân phối chuẩn, định lý giới hạn trung tâm) là cách giải thích thứ hai nhẹ nhàng nhất cho nội dung của khoá.</li>
</ol>
<h3>🎓 Khoá học mở &amp; bài giảng</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/" target="_blank" rel="noopener">MIT OpenCourseWare 18.05 — Xác suất và Thống kê nhập môn (xuân 2022)</a>: bài đọc ngắn cho từng buổi, bài tập và đề thi có lời giải. Nhiều bài bên dưới dẫn đúng bài đọc tương ứng.</li>
<li><a href="https://ocw.mit.edu/courses/res-6-012-introduction-to-probability-spring-2018/" target="_blank" rel="noopener">MIT OCW RES.6-012 — Introduction to Probability (John Tsitsiklis)</a>: video bài giảng đầy đủ và bài tập giải sẵn.</li>
<li><a href="https://www.youtube.com/playlist?list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo" target="_blank" rel="noopener">Harvard Statistics 110: Probability (Joe Blitzstein) — trọn bộ bài giảng trên YouTube</a>.</li>
<li><a href="https://www.edx.org/learn/probability/harvard-university-introduction-to-probability" target="_blank" rel="noopener">HarvardX trên edX — Introduction to Probability</a>: phiên bản trực tuyến của Stat 110.</li>
<li><a href="https://seeing-theory.brown.edu/" target="_blank" rel="noopener">Seeing Theory (Đại học Brown)</a>: nhập môn xác suất trực quan, tương tác.</li>
<li><a href="https://www.3blue1brown.com/lessons/bayes-theorem" target="_blank" rel="noopener">3Blue1Brown — Định lý Bayes</a> và <a href="https://www.3blue1brown.com/lessons/clt" target="_blank" rel="noopener">Định lý giới hạn trung tâm</a>: trực quan đẹp nhất.</li>
</ul>
<h3>🛠️ Công cụ tự kiểm bài</h3>
<ul>
<li><a href="https://docs.python.org/3/library/math.html" target="_blank" rel="noopener">Python <code>math</code></a> (<code>comb</code>, <code>perm</code>, <code>factorial</code>) và <a href="https://docs.python.org/3/library/random.html" target="_blank" rel="noopener"><code>random</code></a> — đếm và mô phỏng, không cần cài thêm gì.</li>
<li><a href="https://docs.scipy.org/doc/scipy/reference/stats.html" target="_blank" rel="noopener">SciPy <code>scipy.stats</code></a> — PMF/PDF/CDF, kỳ vọng, phương sai của mọi phân phối trong môn.</li>
<li><a href="https://numpy.org/doc/stable/reference/random/generator.html" target="_blank" rel="noopener">NumPy random Generator</a> — mô phỏng hàng triệu phép thử thật nhanh.</li>
</ul>
<div class="meo"><p><strong>Kế hoạch học.</strong> Mỗi bài: đọc bài ở đây → đọc mục sách được dẫn → làm 5–10 bài tập trong Blitzstein &amp; Hwang hoặc OpenStax → làm 🧪 tự luyện → mô phỏng bằng Python một đáp án gây bất ngờ → làm quiz chương. Khoảng 5–7 giờ mỗi chương.</p></div>`);

const muc0 = {
  title: 'Section 0 — Course framework (self-authored, no FLM syllabus)|||Mục 0 — Khung môn học (tự soạn, trường chưa công bố syllabus)',
  description: 'Giới thiệu môn, chuẩn đầu ra tự soạn, giáo trình chuẩn kèm ISBN và tài liệu mở. Trường chưa công bố syllabus IPY111 trên FLM — điểm/lịch thi theo giảng viên.',
  lessons: [m01, m02],
};

// ───────────────────────────── Chương 1 — Phép đếm ─────────────────────────────
const c11 = L('ipy111-ts-1-1',
  '1.1 — Experiments, sample spaces, events and the naive definition|||1.1 — Phép thử, không gian mẫu, biến cố và định nghĩa cổ điển',
  'Phép thử, không gian mẫu S, biến cố là tập con của S, định nghĩa cổ điển P(A) = |A|/|S| và điều kiện “đồng khả năng”; ví dụ hai con xúc xắc.',
  `<span class="eyebrow">IPY111 · Chapter 1 · Lesson 1.1</span>
<h2>Experiments, sample spaces, events and the naive definition</h2>
<p class="lead">Before computing any probability we must say precisely <em>what could happen</em>. That list of possibilities — the sample space — is the stage on which all of probability is played.</p>
<h3>🎯 Objectives</h3>
<ul><li>Describe an experiment by its sample space S.</li><li>Write events as subsets of S.</li><li>Apply the naive definition P(A) = |A| / |S| and know when it is valid.</li></ul>
<h3>📖 Lecture</h3>
<p>An <strong>experiment</strong> is any process with an uncertain outcome: tossing a coin, rolling two dice, sending a packet over a lossy network, choosing a random user for a survey. The <strong>sample space</strong> S is the set of <em>all possible outcomes</em>. An <strong>event</strong> A is a subset of S — a statement about the outcome that is either true or false once the experiment is done. We say “A occurred” if the actual outcome lies in A.</p>
<ul>
<li>Toss one coin: S = {H, T}.</li>
<li>Toss a coin 3 times: S = {HHH, HHT, HTH, HTT, THH, THT, TTH, TTT}, |S| = 8. “Exactly two heads” = {HHT, HTH, THH}.</li>
<li>Roll two dice (red, blue): S = {(i, j) : i, j ∈ {1,…,6}}, |S| = 36. “Sum is 7” = {(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)}.</li>
</ul>
<p>When every outcome is <strong>equally likely</strong> and S is finite, probability is just counting:</p>
<div class="formula"><span class="lbl">Naive (classical) definition</span>P(A) = |A| / |S| = (number of outcomes favourable to A) / (total number of outcomes)</div>
<p>This is the definition used by Cardano, Pascal and Fermat for games of chance. It is only valid under two conditions: S is finite, and all outcomes have the same chance. A loaded die, or “will it rain tomorrow?” (S = {rain, no rain}), does <strong>not</strong> give 1/2 automatically. In Chapter 2 we replace this definition with general axioms; until then, the art is to choose a sample space whose outcomes really are equally likely.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — sum of two dice.</b> Treat the dice as distinguishable (red, blue) so all 36 ordered pairs are equally likely. Sum = 7 has 6 outcomes, so P = 6/36 = <b>1/6</b>. Sum = 2 has only (1,1), so P = 1/36.</p></div>
<div class="callout"><p><b>Example 2 — at least one six.</b> Among the 36 pairs, those with no six are 5 × 5 = 25. Hence “at least one six” has 36 − 25 = 11 outcomes and P = <b>11/36 ≈ 0.306</b> — not 2/6, because (6,6) would be counted twice.</p></div>
<div class="callout"><p><b>Example 3 — choosing a good sample space.</b> If we described two dice by their <em>sum</em>, S = {2, …, 12} has 11 outcomes, but they are not equally likely (7 is six times as likely as 2). Using |A|/|S| there would give the wrong answer 1/11 for “sum = 7”.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using the naive definition on outcomes that are not equally likely (sums of dice, “win/lose”).</li><li>Treating identical-looking dice or coins as indistinguishable — label them; the physics does not care about colour.</li><li>Double counting overlaps (“at least one six” is not 1/6 + 1/6).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Sample space S = all outcomes; an event is a subset of S.</li><li>Equally likely finite outcomes: P(A) = |A| / |S|.</li><li>Pick S so that its outcomes really are equally likely — usually ordered and labelled.</li><li>Complement trick: count what you do not want, then subtract.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 3.1 Terminology</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class02-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 2: Probability: Terminology and Examples</a></li><li><a href="https://seeing-theory.brown.edu/basic-probability/index.html" target="_blank" rel="noopener">Seeing Theory — Basic Probability (interactive)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A coin is tossed 3 times. Find P(exactly two heads) and P(at least one head).</li><li>Two dice are rolled. Find P(sum ≥ 10).</li><li>Why is P(sum = 12) not 1/11?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 3/8; 1 − 1/8 = 7/8. 2) Sum 10: 3 outcomes, 11: 2, 12: 1 ⇒ 6/36 = 1/6. 3) The 11 sums are not equally likely; P(sum = 12) = 1/36.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 1 · Bài 1.1</span>
<h2>Phép thử, không gian mẫu, biến cố và định nghĩa cổ điển</h2>
<p class="lead">Trước khi tính bất kỳ xác suất nào, ta phải nói chính xác <em>điều gì có thể xảy ra</em>. Danh sách các khả năng đó — không gian mẫu — là sân khấu của toàn bộ môn xác suất.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mô tả một phép thử bằng không gian mẫu S.</li><li>Viết biến cố dưới dạng tập con của S.</li><li>Áp dụng định nghĩa cổ điển P(A) = |A| / |S| và biết khi nào nó đúng.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Phép thử</strong> là bất kỳ quá trình nào có kết quả không chắc chắn: tung đồng xu, gieo hai con xúc xắc, gửi gói tin qua mạng hay mất gói, chọn ngẫu nhiên một người dùng để khảo sát. <strong>Không gian mẫu</strong> S là tập <em>mọi kết quả có thể</em>. <strong>Biến cố</strong> A là một tập con của S — một mệnh đề về kết quả, đúng hoặc sai sau khi làm phép thử. Ta nói “A xảy ra” nếu kết quả thực tế thuộc A.</p>
<ul>
<li>Tung một đồng xu: S = {S, N} (sấp, ngửa) — trong bài ta ghi H/T.</li>
<li>Tung đồng xu 3 lần: S = {HHH, HHT, HTH, HTT, THH, THT, TTH, TTT}, |S| = 8. “Đúng hai mặt H” = {HHT, HTH, THH}.</li>
<li>Gieo hai xúc xắc (đỏ, xanh): S = {(i, j) : i, j ∈ {1,…,6}}, |S| = 36. “Tổng bằng 7” = {(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)}.</li>
</ul>
<p>Khi mọi kết quả <strong>đồng khả năng</strong> và S hữu hạn, xác suất chỉ là phép đếm:</p>
<div class="formula"><span class="lbl">Định nghĩa cổ điển</span>P(A) = |A| / |S| = (số kết quả thuận lợi cho A) / (tổng số kết quả)</div>
<p>Đây là định nghĩa Cardano, Pascal và Fermat dùng cho trò may rủi. Nó chỉ đúng khi có đủ hai điều kiện: S hữu hạn, và mọi kết quả có cùng khả năng. Xúc xắc bị đổ chì, hay “mai có mưa không?” (S = {mưa, không mưa}) <strong>không</strong> tự động cho 1/2. Ở Chương 2 ta thay định nghĩa này bằng hệ tiên đề tổng quát; trước đó, nghệ thuật là chọn không gian mẫu mà các kết quả thật sự đồng khả năng.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — tổng hai xúc xắc.</b> Coi hai xúc xắc phân biệt được (đỏ, xanh) để 36 cặp có thứ tự đồng khả năng. Tổng = 7 có 6 kết quả, nên P = 6/36 = <b>1/6</b>. Tổng = 2 chỉ có (1,1), nên P = 1/36.</p></div>
<div class="callout"><p><b>Ví dụ 2 — có ít nhất một mặt 6.</b> Trong 36 cặp, số cặp không có mặt 6 là 5 × 5 = 25. Vậy “ít nhất một mặt 6” có 36 − 25 = 11 kết quả, P = <b>11/36 ≈ 0,306</b> — không phải 2/6, vì (6,6) sẽ bị đếm hai lần.</p></div>
<div class="callout"><p><b>Ví dụ 3 — chọn không gian mẫu cho đúng.</b> Nếu mô tả hai xúc xắc bằng <em>tổng</em>, S = {2, …, 12} có 11 kết quả nhưng không đồng khả năng (7 khả năng gấp sáu lần 2). Dùng |A|/|S| ở đó sẽ ra đáp án sai 1/11 cho “tổng = 7”.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng định nghĩa cổ điển cho các kết quả không đồng khả năng (tổng xúc xắc, “thắng/thua”).</li><li>Coi hai xúc xắc hay đồng xu giống nhau là không phân biệt — hãy đánh dấu chúng; vật lý không quan tâm màu sắc.</li><li>Đếm trùng phần giao (“ít nhất một mặt 6” không phải 1/6 + 1/6).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Không gian mẫu S = mọi kết quả; biến cố là tập con của S.</li><li>Kết quả hữu hạn, đồng khả năng: P(A) = |A| / |S|.</li><li>Chọn S sao cho kết quả thật sự đồng khả năng — thường là có thứ tự và có nhãn.</li><li>Mẹo phần bù: đếm cái không muốn rồi trừ đi.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 3.1 Thuật ngữ</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class02-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 2: Thuật ngữ và ví dụ xác suất</a></li><li><a href="https://seeing-theory.brown.edu/basic-probability/index.html" target="_blank" rel="noopener">Seeing Theory — Xác suất cơ bản (tương tác)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tung đồng xu 3 lần. Tìm P(đúng hai mặt H) và P(ít nhất một mặt H).</li><li>Gieo hai xúc xắc. Tìm P(tổng ≥ 10).</li><li>Vì sao P(tổng = 12) không bằng 1/11?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 3/8; 1 − 1/8 = 7/8. 2) Tổng 10: 3 kết quả, 11: 2, 12: 1 ⇒ 6/36 = 1/6. 3) 11 giá trị tổng không đồng khả năng; P(tổng = 12) = 1/36.</p></div>`);

const c12 = L('ipy111-ts-1-2',
  '1.2 — The multiplication rule and permutations|||1.2 — Quy tắc nhân và hoán vị',
  'Quy tắc nhân, đếm mật khẩu/biển số, hoán vị n!, chỉnh hợp P(n,k) = n!/(n−k)!, hoán vị lặp (chữ cái trùng) và lỗi đếm thứ tự.',
  `<span class="eyebrow">IPY111 · Chapter 1 · Lesson 1.2</span>
<h2>The multiplication rule and permutations</h2>
<p class="lead">Most counting problems are solved by imagining the outcome being built <em>step by step</em> and multiplying the number of choices at each step.</p>
<h3>🎯 Objectives</h3>
<ul><li>Apply the multiplication rule to multi-step choices.</li><li>Count arrangements with n! and P(n, k).</li><li>Count arrangements of words with repeated letters.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Multiplication rule</span>If an experiment has k steps, with n<sub>1</sub> choices at step 1, n<sub>2</sub> at step 2 (for each choice at step 1), …, then the total number of outcomes is n<sub>1</sub> · n<sub>2</sub> · … · n<sub>k</sub>.</div>
<p>The number of choices at a step may depend on earlier steps only in <em>which</em> choices remain, not in <em>how many</em>. A <strong>permutation</strong> is an ordered arrangement. Arranging all n distinct objects in a row: n choices for the first position, n − 1 for the second, and so on:</p>
<div class="formula"><span class="lbl">Permutations</span>n! = n · (n − 1) · … · 2 · 1  (0! = 1)<br>Ordered selections of k from n, no repetition: P(n, k) = n! / (n − k)! = n(n − 1)…(n − k + 1)<br>Ordered selections of k from n, with repetition: n<sup>k</sup></div>
<p>When some objects are identical, arrangements that only swap identical objects look the same, so we divide: a word of length n with letter multiplicities n<sub>1</sub>, n<sub>2</sub>, …, n<sub>r</sub> has n! / (n<sub>1</sub>! n<sub>2</sub>! … n<sub>r</sub>!) distinct arrangements (a <em>multinomial coefficient</em>).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — passwords.</b> An 8-character password uses letters a–z, A–Z and digits 0–9: 62 symbols, repetition allowed. Count = 62<sup>8</sup> = <b>218 340 105 584 896</b> ≈ 2.2 × 10<sup>14</sup>. A 4-digit PIN has only 10<sup>4</sup> = 10 000 possibilities — that is why phones lock after a few wrong attempts.</p></div>
<div class="callout"><p><b>Example 2 — officers.</b> From a club of 10 students choose a president, a vice-president and a secretary (different people). Order matters (roles differ): P(10, 3) = 10 · 9 · 8 = <b>720</b>.</p></div>
<div class="callout"><p><b>Example 3 — repeated letters.</b> STATISTICS has 10 letters: S×3, T×3, I×2, A×1, C×1. Distinct arrangements = 10! / (3! 3! 2!) = 3 628 800 / 72 = <b>50 400</b>.</p></div>
<div class="callout"><p><b>Example 4 — a probability.</b> 5 different books are shelved in random order. P(the two probability books end up next to each other)? Glue them into one block: 4! arrangements of blocks × 2! orders inside the block = 48 out of 5! = 120 ⇒ P = 48/120 = <b>0.4</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using P(n, k) when order does not matter (a committee of 3 is not 720 — see Lesson 1.3).</li><li>Forgetting that repetition is allowed (passwords) or not allowed (officers).</li><li>Adding instead of multiplying for successive steps; adding is for <em>alternatives</em> (“either … or …”), multiplying for <em>stages</em> (“first … then …”).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Multi-step choice ⇒ multiply the numbers of choices.</li><li>n! arrangements of n distinct objects; P(n, k) = n!/(n − k)! ordered selections.</li><li>With repetition: n<sup>k</sup>.</li><li>Identical objects: divide by the factorials of their multiplicities.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class01-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 1b: Counting and Sets</a></li><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/03%3A_Combinatorics" target="_blank" rel="noopener">Grinstead &amp; Snell — Chapter 3: Combinatorics</a></li><li><a href="https://docs.python.org/3/library/itertools.html" target="_blank" rel="noopener">Python itertools (permutations, product) — enumerate small cases to check your count</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>How many license plates have 3 letters (A–Z) followed by 4 digits?</li><li>In how many ways can 6 people sit in a row if two particular people refuse to sit together?</li><li>How many distinct arrangements does the word MISSISSIPPI have?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 26<sup>3</sup> · 10<sup>4</sup> = 175 760 000. 2) Total 6! = 720; together = 5! · 2! = 240; answer 720 − 240 = 480. 3) 11! / (4! 4! 2!) = 34 650.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 1 · Bài 1.2</span>
<h2>Quy tắc nhân và hoán vị</h2>
<p class="lead">Phần lớn bài đếm được giải bằng cách hình dung kết quả được dựng lên <em>từng bước</em> rồi nhân số lựa chọn ở mỗi bước.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp dụng quy tắc nhân cho lựa chọn nhiều bước.</li><li>Đếm cách sắp xếp bằng n! và P(n, k).</li><li>Đếm hoán vị của từ có chữ cái lặp.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Quy tắc nhân</span>Nếu phép thử có k bước, bước 1 có n<sub>1</sub> lựa chọn, bước 2 có n<sub>2</sub> lựa chọn (với mỗi lựa chọn ở bước 1), …, thì tổng số kết quả là n<sub>1</sub> · n<sub>2</sub> · … · n<sub>k</sub>.</div>
<p>Số lựa chọn ở một bước được phép phụ thuộc bước trước ở chỗ <em>còn lại những lựa chọn nào</em>, nhưng không được phụ thuộc ở <em>số lượng</em>. <strong>Hoán vị</strong> là một cách sắp xếp có thứ tự. Xếp n vật phân biệt thành hàng: vị trí đầu có n cách, vị trí hai còn n − 1 cách, v.v.:</p>
<div class="formula"><span class="lbl">Hoán vị, chỉnh hợp</span>n! = n · (n − 1) · … · 2 · 1  (0! = 1)<br>Chọn có thứ tự k từ n, không lặp (chỉnh hợp): P(n, k) = n! / (n − k)! = n(n − 1)…(n − k + 1)<br>Chọn có thứ tự k từ n, có lặp: n<sup>k</sup></div>
<p>Khi có những vật giống nhau, các cách xếp chỉ đổi chỗ hai vật giống nhau trông như nhau, nên phải chia: một từ dài n với số lần lặp của các chữ là n<sub>1</sub>, n<sub>2</sub>, …, n<sub>r</sub> có n! / (n<sub>1</sub>! n<sub>2</sub>! … n<sub>r</sub>!) cách xếp khác nhau (<em>hệ số đa thức</em>).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — mật khẩu.</b> Mật khẩu 8 ký tự dùng a–z, A–Z và 0–9: 62 ký hiệu, được lặp. Số mật khẩu = 62<sup>8</sup> = <b>218 340 105 584 896</b> ≈ 2,2 × 10<sup>14</sup>. Mã PIN 4 chữ số chỉ có 10<sup>4</sup> = 10 000 khả năng — vì thế điện thoại khoá sau vài lần nhập sai.</p></div>
<div class="callout"><p><b>Ví dụ 2 — bầu ban cán sự.</b> CLB 10 sinh viên chọn chủ nhiệm, phó chủ nhiệm và thư ký (ba người khác nhau). Thứ tự có ý nghĩa (vai trò khác nhau): P(10, 3) = 10 · 9 · 8 = <b>720</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — chữ cái lặp.</b> STATISTICS có 10 chữ: S×3, T×3, I×2, A×1, C×1. Số cách xếp khác nhau = 10! / (3! 3! 2!) = 3 628 800 / 72 = <b>50 400</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4 — một xác suất.</b> 5 cuốn sách khác nhau xếp ngẫu nhiên lên kệ. P(hai cuốn xác suất đứng cạnh nhau)? Dán chúng thành một khối: 4! cách xếp các khối × 2! thứ tự trong khối = 48 trên 5! = 120 ⇒ P = 48/120 = <b>0,4</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng P(n, k) khi thứ tự không quan trọng (ban 3 người không phải 720 — xem Bài 1.3).</li><li>Quên rằng được lặp (mật khẩu) hay không được lặp (ban cán sự).</li><li>Cộng thay vì nhân cho các bước nối tiếp; cộng dành cho <em>phương án loại trừ nhau</em> (“hoặc … hoặc …”), nhân dành cho <em>công đoạn</em> (“trước … rồi …”).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Lựa chọn nhiều bước ⇒ nhân số lựa chọn.</li><li>n! cách xếp n vật phân biệt; P(n, k) = n!/(n − k)! cách chọn có thứ tự.</li><li>Có lặp: n<sup>k</sup>.</li><li>Vật giống nhau: chia cho giai thừa của số lần lặp.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class01-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 1b: Phép đếm và tập hợp</a></li><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/03%3A_Combinatorics" target="_blank" rel="noopener">Grinstead &amp; Snell — Chương 3: Tổ hợp</a></li><li><a href="https://docs.python.org/3/library/itertools.html" target="_blank" rel="noopener">Python itertools (permutations, product) — liệt kê trường hợp nhỏ để kiểm số đếm</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Có bao nhiêu biển số gồm 3 chữ cái (A–Z) rồi 4 chữ số?</li><li>Có bao nhiêu cách xếp 6 người ngồi thành hàng nếu hai người cụ thể không chịu ngồi cạnh nhau?</li><li>Từ MISSISSIPPI có bao nhiêu cách sắp xếp khác nhau?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 26<sup>3</sup> · 10<sup>4</sup> = 175 760 000. 2) Tổng 6! = 720; ngồi cạnh = 5! · 2! = 240; đáp số 720 − 240 = 480. 3) 11! / (4! 4! 2!) = 34 650.</p></div>`);

const c13 = L('ipy111-ts-1-3',
  '1.3 — Combinations, binomial coefficients and the sampling table|||1.3 — Tổ hợp, hệ số nhị thức và bảng chọn mẫu',
  'Tổ hợp C(n,k), công thức nhị thức Newton, tam giác Pascal, bảng 4 ô chọn mẫu (có/không thứ tự, có/không lặp) và “chia kẹo Euler” C(n+k−1,k).',
  `<span class="eyebrow">IPY111 · Chapter 1 · Lesson 1.3</span>
<h2>Combinations, binomial coefficients and the sampling table</h2>
<p class="lead">When we only care <em>which</em> objects are chosen — not the order — we count combinations. The binomial coefficient is the single most used number in probability.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute C(n, k) and explain why it equals P(n, k) / k!.</li><li>Use the binomial theorem and Pascal's identity.</li><li>Pick the right formula from the 4-cell sampling table.</li></ul>
<h3>📖 Lecture</h3>
<p>Choosing k of n distinct objects <em>without order</em>: each unordered set of k objects appears k! times among the P(n, k) ordered selections, so</p>
<div class="formula"><span class="lbl">Binomial coefficient (“n choose k”)</span>C(n, k) = n! / (k! (n − k)!) = n(n − 1)…(n − k + 1) / k!,  C(n, k) = C(n, n − k),  C(n, 0) = C(n, n) = 1</div>
<p>The name comes from the <strong>binomial theorem</strong>: (x + y)<sup>n</sup> = ∑<sub>k=0</sub><sup>n</sup> C(n, k) x<sup>k</sup> y<sup>n−k</sup>. Setting x = y = 1 gives ∑ C(n, k) = 2<sup>n</sup>: the number of subsets of an n-element set. <strong>Pascal's identity</strong> C(n, k) = C(n − 1, k − 1) + C(n − 1, k) has a story proof: fix one person; either they are in the committee (choose the other k − 1 from n − 1) or not (choose all k from n − 1).</p>
<p>Every “choose k from n” problem falls into one cell of the <strong>sampling table</strong>:</p>
<div class="kv-grid">
<div class="kv"><span class="k">Order matters, with replacement</span><span class="v">n<sup>k</sup></span></div>
<div class="kv"><span class="k">Order matters, without replacement</span><span class="v">n! / (n − k)!</span></div>
<div class="kv"><span class="k">Order does not matter, without replacement</span><span class="v">C(n, k)</span></div>
<div class="kv"><span class="k">Order does not matter, with replacement</span><span class="v">C(n + k − 1, k)</span></div>
</div>
<p>The last cell (“stars and bars”, Bose–Einstein counting) counts ways to put k identical balls into n distinct boxes: arrange k stars and n − 1 bars in a row. ⚠️ Those C(n + k − 1, k) outcomes are <strong>not</strong> equally likely when the choice is made by actual random sampling, so do not use the naive definition on them.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — committee.</b> A committee of 3 from 10 students: C(10, 3) = 720 / 3! = <b>120</b> (compare with 720 officer assignments in Lesson 1.2).</p></div>
<div class="callout"><p><b>Example 2 — full house.</b> A 5-card poker hand from a 52-card deck: C(52, 5) = 2 598 960 equally likely hands. Full house (three of one rank, two of another): choose the rank of the triple (13), its 3 suits (C(4, 3) = 4), the rank of the pair (12), its 2 suits (C(4, 2) = 6): 13 · 4 · 12 · 6 = 3 744. P = 3 744 / 2 598 960 ≈ <b>0.00144</b>. Note 13 · 12, not C(13, 2): the triple and the pair play different roles.</p></div>
<div class="callout"><p><b>Example 3 — ice cream.</b> Choose 3 scoops from 5 flavours, repeats allowed, order irrelevant: C(5 + 3 − 1, 3) = C(7, 3) = <b>35</b>. Similarly, 10 identical candies to 4 children: C(13, 3) = <b>286</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Mixing ordered and unordered counts in the same fraction — numerator and denominator must use the same sample space.</li><li>Using C(13, 2) for “two different ranks with different roles” (full house) — that loses a factor of 2.</li><li>Applying |A|/|S| to stars-and-bars outcomes; they are not equally likely.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>C(n, k) = n! / (k!(n − k)!) counts unordered selections without replacement.</li><li>∑<sub>k</sub> C(n, k) = 2<sup>n</sup>; C(n, k) = C(n − 1, k − 1) + C(n − 1, k).</li><li>Sampling table: n<sup>k</sup>, n!/(n − k)!, C(n, k), C(n + k − 1, k).</li><li>Decide “does order matter?” and “is repetition allowed?” before writing any formula.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/03%3A_Combinatorics" target="_blank" rel="noopener">Grinstead &amp; Snell — Chapter 3: Combinatorics (binomial coefficients)</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class01-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 1b: Counting and Sets</a></li><li><a href="https://docs.python.org/3/library/math.html" target="_blank" rel="noopener">Python math.comb / math.perm documentation</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>How many 5-card hands are all hearts?</li><li>A 10-question true/false quiz: in how many ways can exactly 7 answers be “true”?</li><li>How many solutions does x<sub>1</sub> + x<sub>2</sub> + x<sub>3</sub> = 6 have in non-negative integers?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) C(13, 5) = 1 287. 2) C(10, 7) = 120. 3) Stars and bars with n = 3 boxes, k = 6 stars: C(8, 6) = C(8, 2) = 28.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 1 · Bài 1.3</span>
<h2>Tổ hợp, hệ số nhị thức và bảng chọn mẫu</h2>
<p class="lead">Khi chỉ quan tâm <em>những</em> vật nào được chọn — không quan tâm thứ tự — ta đếm tổ hợp. Hệ số nhị thức là con số được dùng nhiều nhất trong xác suất.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính C(n, k) và giải thích vì sao nó bằng P(n, k) / k!.</li><li>Dùng công thức nhị thức Newton và đẳng thức Pascal.</li><li>Chọn đúng công thức trong bảng chọn mẫu 4 ô.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Chọn k trong n vật phân biệt <em>không kể thứ tự</em>: mỗi tập k vật xuất hiện k! lần trong P(n, k) cách chọn có thứ tự, nên</p>
<div class="formula"><span class="lbl">Hệ số nhị thức (“tổ hợp chập k của n”)</span>C(n, k) = n! / (k! (n − k)!) = n(n − 1)…(n − k + 1) / k!,  C(n, k) = C(n, n − k),  C(n, 0) = C(n, n) = 1</div>
<p>Tên gọi đến từ <strong>công thức nhị thức Newton</strong>: (x + y)<sup>n</sup> = ∑<sub>k=0</sub><sup>n</sup> C(n, k) x<sup>k</sup> y<sup>n−k</sup>. Cho x = y = 1 được ∑ C(n, k) = 2<sup>n</sup>: số tập con của tập n phần tử. <strong>Đẳng thức Pascal</strong> C(n, k) = C(n − 1, k − 1) + C(n − 1, k) có “chứng minh bằng câu chuyện”: cố định một người; hoặc người đó vào ban (chọn k − 1 người còn lại từ n − 1), hoặc không (chọn đủ k từ n − 1).</p>
<p>Mọi bài “chọn k từ n” rơi vào một ô của <strong>bảng chọn mẫu</strong>:</p>
<div class="kv-grid">
<div class="kv"><span class="k">Có thứ tự, có lặp (hoàn lại)</span><span class="v">n<sup>k</sup></span></div>
<div class="kv"><span class="k">Có thứ tự, không lặp</span><span class="v">n! / (n − k)!</span></div>
<div class="kv"><span class="k">Không thứ tự, không lặp</span><span class="v">C(n, k)</span></div>
<div class="kv"><span class="k">Không thứ tự, có lặp</span><span class="v">C(n + k − 1, k)</span></div>
</div>
<p>Ô cuối (“chia kẹo Euler”, “sao và vạch”, đếm Bose–Einstein) đếm số cách bỏ k quả bóng giống nhau vào n hộp phân biệt: xếp k ngôi sao và n − 1 vạch thành hàng. ⚠️ C(n + k − 1, k) kết quả đó <strong>không</strong> đồng khả năng khi lựa chọn được làm bằng lấy mẫu ngẫu nhiên thật, nên đừng dùng định nghĩa cổ điển trên chúng.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — ban 3 người.</b> Chọn ban 3 người từ 10 sinh viên: C(10, 3) = 720 / 3! = <b>120</b> (so với 720 cách phân vai ở Bài 1.2).</p></div>
<div class="callout"><p><b>Ví dụ 2 — cù lũ (full house).</b> Một tay bài 5 lá từ bộ 52 lá: C(52, 5) = 2 598 960 tay bài đồng khả năng. Cù lũ (bộ ba cùng hạng + đôi hạng khác): chọn hạng của bộ ba (13), 3 chất của nó (C(4, 3) = 4), hạng của đôi (12), 2 chất (C(4, 2) = 6): 13 · 4 · 12 · 6 = 3 744. P = 3 744 / 2 598 960 ≈ <b>0,00144</b>. Chú ý là 13 · 12 chứ không phải C(13, 2): bộ ba và đôi đóng vai trò khác nhau.</p></div>
<div class="callout"><p><b>Ví dụ 3 — kem.</b> Chọn 3 viên kem từ 5 vị, được trùng vị, không quan tâm thứ tự: C(5 + 3 − 1, 3) = C(7, 3) = <b>35</b>. Tương tự, chia 10 viên kẹo giống nhau cho 4 em bé: C(13, 3) = <b>286</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Trộn số đếm có thứ tự và không thứ tự trong cùng một phân số — tử và mẫu phải dùng chung một không gian mẫu.</li><li>Dùng C(13, 2) cho “hai hạng khác nhau đóng vai trò khác nhau” (cù lũ) — mất một thừa số 2.</li><li>Áp dụng |A|/|S| cho kết quả “chia kẹo Euler”; chúng không đồng khả năng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>C(n, k) = n! / (k!(n − k)!) đếm cách chọn không thứ tự, không lặp.</li><li>∑<sub>k</sub> C(n, k) = 2<sup>n</sup>; C(n, k) = C(n − 1, k − 1) + C(n − 1, k).</li><li>Bảng chọn mẫu: n<sup>k</sup>, n!/(n − k)!, C(n, k), C(n + k − 1, k).</li><li>Hỏi “thứ tự có quan trọng?” và “có được lặp?” trước khi viết công thức.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/03%3A_Combinatorics" target="_blank" rel="noopener">Grinstead &amp; Snell — Chương 3: Tổ hợp (hệ số nhị thức)</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class01-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 1b: Phép đếm và tập hợp</a></li><li><a href="https://docs.python.org/3/library/math.html" target="_blank" rel="noopener">Tài liệu Python math.comb / math.perm</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Có bao nhiêu tay bài 5 lá toàn chất cơ?</li><li>Bài quiz 10 câu đúng/sai: có bao nhiêu cách để đúng 7 câu trả lời là “đúng”?</li><li>Phương trình x<sub>1</sub> + x<sub>2</sub> + x<sub>3</sub> = 6 có bao nhiêu nghiệm nguyên không âm?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) C(13, 5) = 1 287. 2) C(10, 7) = 120. 3) Chia kẹo với n = 3 hộp, k = 6 ngôi sao: C(8, 6) = C(8, 2) = 28.</p></div>`);

const c14 = L('ipy111-ts-1-4',
  '1.4 — From counting to probability: birthdays, cards, lotteries (with Python)|||1.4 — Từ đếm đến xác suất: ngày sinh, bộ bài, xổ số (có Python)',
  'Bài toán ngày sinh (23 người > 50%), va chạm băm, xác suất bài tây, xổ số Vietlott 6/45; dùng phần bù và kiểm bằng Python chạy thật.',
  `<span class="eyebrow">IPY111 · Chapter 1 · Lesson 1.4</span>
<h2>From counting to probability: birthdays, cards, lotteries</h2>
<p class="lead">Now we combine counting with the naive definition to answer real questions — including one whose answer surprises almost everyone.</p>
<h3>🎯 Objectives</h3>
<ul><li>Solve the birthday problem with the complement rule.</li><li>Compute card-hand and lottery probabilities with C(n, k).</li><li>Check a counting answer with a short Python program.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>The birthday problem.</strong> In a room of n people (365 equally likely birthdays, ignore 29 February), what is the chance that at least two share a birthday? Counting “at least two share” directly is messy (one pair, two pairs, a triple…). The complement “all birthdays different” is easy: ordered birthdays for n people, no repetition, P(365, n) out of 365<sup>n</sup>.</p>
<div class="formula"><span class="lbl">Birthday problem</span>P(at least one shared birthday) = 1 − (365 · 364 · … · (365 − n + 1)) / 365<sup>n</sup></div>
<p>The answer passes 50% at only <strong>n = 23</strong>. Intuition: what matters is the number of <em>pairs</em>, C(23, 2) = 253, and each pair matches with probability 1/365. In computing this is the <strong>hash collision</strong> rule: with a hash of m possible values you expect collisions after about √m items, which is why 32-bit checksums are not safe as unique IDs.</p>
<p><strong>Card hands and lotteries</strong> are the same pattern: the sample space is C(N, k) equally likely unordered selections; the event is counted by choosing separately from each “type” of object and multiplying.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — birthdays.</b> n = 23: 1 − 0.4927 = <b>0.5073</b>. A different question — “someone shares <em>my</em> birthday” — is 1 − (364/365)<sup>22</sup> ≈ 0.0586 for 22 other people; you would need 253 other people to pass 50%.</p></div>
<div class="callout"><p><b>Example 2 — exactly two aces.</b> 5-card hand: choose 2 of the 4 aces and 3 of the 48 non-aces: C(4, 2) · C(48, 3) / C(52, 5) = 6 · 17 296 / 2 598 960 ≈ <b>0.0399</b>.</p></div>
<div class="callout"><p><b>Example 3 — Vietlott Mega 6/45.</b> Choose 6 numbers from 45; the jackpot needs all 6: P = 1 / C(45, 6) = <b>1 / 8 145 060</b> ≈ 1.2 × 10<sup>−7</sup>. Buying one ticket a day, you would wait on average about 22 000 years.</p></div>
<p>Checking the birthday table and Example 2 in Python (standard library only):</p>
<pre><code class="language-python">from math import comb, prod

def p_shared(n, days=365):
    # P(at least two of n people share a birthday)
    p_all_different = prod((days - i) / days for i in range(n))
    return 1 - p_all_different

for n in [10, 20, 23, 30, 50, 70]:
    print(n, round(p_shared(n), 4))

# exactly 2 aces in a 5-card hand
print(round(comb(4, 2) * comb(48, 3) / comb(52, 5), 4))
</code></pre>
<div class="out">10 0.1169
20 0.4114
23 0.5073
30 0.7063
50 0.9704
70 0.9992
0.0399</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Confusing “some pair shares a birthday” with “someone shares my birthday”.</li><li>Counting “at least one” directly instead of via the complement.</li><li>Writing C(4, 2) · C(50, 3) for “at least/exactly two aces” — the other 3 cards must come from the 48 non-aces.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>“At least one …” ⇒ 1 − P(none …).</li><li>Birthday: P &gt; 0.5 from n = 23; collisions appear after about √m items.</li><li>Hands/lotteries: |S| = C(N, k); count the event type by type and multiply.</li><li>Always sanity-check with code or a small case.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/03%3A_Combinatorics" target="_blank" rel="noopener">Grinstead &amp; Snell — Chapter 3 (includes the birthday problem with simulations)</a></li><li><a href="https://www.youtube.com/playlist?list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo" target="_blank" rel="noopener">Harvard Stat 110 — Lectures 1–3 on counting and the birthday problem</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 3.3 Two Basic Rules of Probability</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Probability that a 5-card hand is a flush (all one suit, straight flushes included)?</li><li>Vietlott Power 6/55: probability that one ticket hits all 6 numbers?</li><li>Use the table above: in a class of 30, what is the chance that at least two students share a birthday?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 4 · C(13, 5) / C(52, 5) = 5 148 / 2 598 960 ≈ 0.00198. 2) 1 / C(55, 6) = 1 / 28 989 675. 3) ≈ 0.7063.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 1 · Bài 1.4</span>
<h2>Từ đếm đến xác suất: ngày sinh, bộ bài, xổ số</h2>
<p class="lead">Giờ ta ghép phép đếm với định nghĩa cổ điển để trả lời câu hỏi thật — trong đó có một câu mà đáp án làm gần như ai cũng bất ngờ.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải bài toán ngày sinh bằng quy tắc phần bù.</li><li>Tính xác suất tay bài và xổ số bằng C(n, k).</li><li>Kiểm đáp án đếm bằng một chương trình Python ngắn.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Bài toán ngày sinh.</strong> Trong phòng có n người (365 ngày sinh đồng khả năng, bỏ qua 29/2), xác suất có ít nhất hai người trùng ngày sinh là bao nhiêu? Đếm trực tiếp “ít nhất hai người trùng” rất rối (một cặp, hai cặp, bộ ba…). Phần bù “mọi ngày sinh khác nhau” thì dễ: ngày sinh có thứ tự của n người, không lặp, P(365, n) trên 365<sup>n</sup>.</p>
<div class="formula"><span class="lbl">Bài toán ngày sinh</span>P(có ít nhất một cặp trùng) = 1 − (365 · 364 · … · (365 − n + 1)) / 365<sup>n</sup></div>
<p>Đáp án vượt 50% chỉ với <strong>n = 23</strong>. Trực giác: điều quan trọng là số <em>cặp</em>, C(23, 2) = 253, và mỗi cặp trùng với xác suất 1/365. Trong tin học đây là quy luật <strong>va chạm băm</strong>: hàm băm có m giá trị thì va chạm xuất hiện sau khoảng √m phần tử — vì thế checksum 32-bit không an toàn để làm ID duy nhất.</p>
<p><strong>Tay bài và xổ số</strong> cùng một khuôn: không gian mẫu là C(N, k) cách chọn không thứ tự đồng khả năng; biến cố được đếm bằng cách chọn riêng từ từng “loại” vật rồi nhân lại.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — ngày sinh.</b> n = 23: 1 − 0,4927 = <b>0,5073</b>. Câu hỏi khác — “có người trùng ngày sinh <em>với tôi</em>” — là 1 − (364/365)<sup>22</sup> ≈ 0,0586 với 22 người khác; phải có 253 người khác mới vượt 50%.</p></div>
<div class="callout"><p><b>Ví dụ 2 — đúng hai lá át.</b> Tay bài 5 lá: chọn 2 trong 4 lá át và 3 trong 48 lá không phải át: C(4, 2) · C(48, 3) / C(52, 5) = 6 · 17 296 / 2 598 960 ≈ <b>0,0399</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — Vietlott Mega 6/45.</b> Chọn 6 số trong 45; giải độc đắc cần trúng cả 6: P = 1 / C(45, 6) = <b>1 / 8 145 060</b> ≈ 1,2 × 10<sup>−7</sup>. Mỗi ngày mua một vé, trung bình phải chờ khoảng 22 000 năm.</p></div>
<p>Kiểm bảng ngày sinh và Ví dụ 2 bằng Python (chỉ thư viện chuẩn):</p>
<pre><code class="language-python">from math import comb, prod

def p_shared(n, days=365):
    # P(at least two of n people share a birthday)
    p_all_different = prod((days - i) / days for i in range(n))
    return 1 - p_all_different

for n in [10, 20, 23, 30, 50, 70]:
    print(n, round(p_shared(n), 4))

# exactly 2 aces in a 5-card hand
print(round(comb(4, 2) * comb(48, 3) / comb(52, 5), 4))
</code></pre>
<div class="out">10 0.1169
20 0.4114
23 0.5073
30 0.7063
50 0.9704
70 0.9992
0.0399</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nhầm “có một cặp trùng ngày sinh” với “có người trùng ngày sinh với tôi”.</li><li>Đếm trực tiếp “ít nhất một” thay vì qua phần bù.</li><li>Viết C(4, 2) · C(50, 3) cho “đúng hai lá át” — 3 lá còn lại phải lấy từ 48 lá không phải át.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>“Ít nhất một …” ⇒ 1 − P(không có …).</li><li>Ngày sinh: P &gt; 0,5 từ n = 23; va chạm xuất hiện sau khoảng √m phần tử.</li><li>Tay bài/xổ số: |S| = C(N, k); đếm biến cố theo từng loại rồi nhân.</li><li>Luôn kiểm lại bằng code hoặc trường hợp nhỏ.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/03%3A_Combinatorics" target="_blank" rel="noopener">Grinstead &amp; Snell — Chương 3 (có bài toán ngày sinh kèm mô phỏng)</a></li><li><a href="https://www.youtube.com/playlist?list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo" target="_blank" rel="noopener">Harvard Stat 110 — Bài giảng 1–3 về phép đếm và bài toán ngày sinh</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 3.3 Hai quy tắc cơ bản của xác suất</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Xác suất tay bài 5 lá là thùng (cùng một chất, tính cả thùng phá sảnh)?</li><li>Vietlott Power 6/55: xác suất một vé trúng cả 6 số?</li><li>Dùng bảng trên: lớp 30 người, xác suất có ít nhất hai bạn trùng ngày sinh?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 4 · C(13, 5) / C(52, 5) = 5 148 / 2 598 960 ≈ 0,00198. 2) 1 / C(55, 6) = 1 / 28 989 675. 3) ≈ 0,7063.</p></div>`);

const q1 = QZ(1, 'Quiz — Chapter 1: Counting and the naive definition|||Quiz — Chương 1: Phép đếm và định nghĩa cổ điển', 'Kiểm tra chương 1: không gian mẫu, quy tắc nhân, hoán vị, tổ hợp, bảng chọn mẫu, bài toán ngày sinh.', [
  Q('q1', "Two fair dice are rolled. P(sum = 7) =|||Gieo hai xúc xắc cân đối. P(tổng = 7) =",
    ['1/11|||1/11', '1/6|||1/6', '7/36|||7/36', '1/12|||1/12'], 1,
    "6 of the 36 equally likely ordered pairs give 7.|||6 trong 36 cặp có thứ tự đồng khả năng cho tổng 7."),
  Q('q2', "Two fair dice are rolled. P(at least one six) =|||Gieo hai xúc xắc. P(ít nhất một mặt 6) =",
    ['1/3|||1/3', '11/36|||11/36', '1/6|||1/6', '25/36|||25/36'], 1,
    "1 − (5/6)·(5/6) = 1 − 25/36 = 11/36.|||1 − (5/6)·(5/6) = 1 − 25/36 = 11/36."),
  Q('q3', "Number of 8-character passwords from 62 symbols, repetition allowed:|||Số mật khẩu 8 ký tự từ 62 ký hiệu, được lặp:",
    ['62 · 8|||62 · 8', '8^62|||8^62', '62^8|||62^8', 'C(62, 8)|||C(62, 8)'], 2,
    "8 positions, 62 choices each: 62^8.|||8 vị trí, mỗi vị trí 62 lựa chọn: 62^8."),
  Q('q4', "Choose a president, vice-president and secretary from 10 people:|||Chọn chủ nhiệm, phó chủ nhiệm, thư ký từ 10 người:",
    ['120|||120', '1000|||1000', '720|||720', '30|||30'], 2,
    "Ordered, no repetition: 10 · 9 · 8 = 720.|||Có thứ tự, không lặp: 10 · 9 · 8 = 720."),
  Q('q5', "A committee of 3 from 10 people can be chosen in|||Chọn ban 3 người từ 10 người có",
    ['120 ways|||120 cách', '720 ways|||720 cách', '30 ways|||30 cách', '1000 ways|||1000 cách'], 0,
    "C(10, 3) = 720 / 3! = 120.|||C(10, 3) = 720 / 3! = 120."),
  Q('q6', "Distinct arrangements of the letters of STATISTICS:|||Số cách xếp các chữ cái của STATISTICS:",
    ['10!|||10!', '10!/(3!3!2!)|||10!/(3!3!2!)', '10!/3!|||10!/3!', 'C(10, 3)|||C(10, 3)'], 1,
    "S and T appear 3 times, I twice: 10!/(3!3!2!) = 50 400.|||S và T lặp 3 lần, I lặp 2 lần: 10!/(3!3!2!) = 50 400."),
  Q('q7', "Choose 3 scoops from 5 flavours, repeats allowed, order irrelevant:|||Chọn 3 viên kem từ 5 vị, được trùng, không kể thứ tự:",
    ['C(5, 3) = 10|||C(5, 3) = 10', '5^3 = 125|||5^3 = 125', 'C(7, 3) = 35|||C(7, 3) = 35', '5!/2! = 60|||5!/2! = 60'], 2,
    "Unordered with replacement: C(n + k − 1, k) = C(7, 3) = 35.|||Không thứ tự, có lặp: C(n + k − 1, k) = C(7, 3) = 35."),
  Q('q8', "The smallest group size for which P(some shared birthday) > 1/2 is|||Số người nhỏ nhất để P(có cặp trùng ngày sinh) > 1/2 là",
    ['183|||183', '23|||23', '50|||50', '366|||366'], 1,
    "At n = 23 the probability is about 0.507.|||Với n = 23 xác suất khoảng 0,507."),
  Q('q9', "P(exactly 2 aces in a 5-card hand) equals|||P(đúng 2 lá át trong tay bài 5 lá) bằng",
    ['C(4,2)·C(48,3)/C(52,5)|||C(4,2)·C(48,3)/C(52,5)', 'C(4,2)/C(52,5)|||C(4,2)/C(52,5)', 'C(4,2)·C(50,3)/C(52,5)|||C(4,2)·C(50,3)/C(52,5)', '(4/52)·(3/51)|||(4/52)·(3/51)'], 0,
    "Choose 2 of 4 aces and 3 of the 48 non-aces; ≈ 0.0399.|||Chọn 2 trong 4 át và 3 trong 48 lá không phải át; ≈ 0,0399."),
  Q('q10', "The naive definition P(A) = |A|/|S| requires|||Định nghĩa cổ điển P(A) = |A|/|S| đòi hỏi",
    ['S is infinite|||S vô hạn', 'A and its complement have the same size|||A và phần bù có cùng kích thước', 'S is finite and all outcomes are equally likely|||S hữu hạn và mọi kết quả đồng khả năng', 'the experiment is repeated many times|||phép thử lặp lại nhiều lần'], 2,
    "Both conditions are needed; otherwise use the general axioms.|||Cần cả hai điều kiện; nếu không, dùng hệ tiên đề tổng quát."),
]);

const ch1 = {
  title: 'Chapter 1 — Counting and the naive definition of probability|||Chương 1 — Phép đếm và định nghĩa cổ điển của xác suất',
  description: 'Không gian mẫu, biến cố, định nghĩa cổ điển; quy tắc nhân, hoán vị, tổ hợp, bảng chọn mẫu; bài toán ngày sinh có Python (Blitzstein & Hwang ch.1 · Ross ch.1).',
  lessons: [c11, c12, c13, c14, q1],
};

// ───────────────────────────── Chương 2 — Tiên đề xác suất ─────────────────────────────
const c21 = L('ipy111-ts-2-1',
  '2.1 — Events as sets: union, intersection, complement, De Morgan|||2.1 — Biến cố là tập hợp: hợp, giao, phần bù, De Morgan',
  'Dịch câu chữ sang phép toán tập hợp: hợp (hoặc), giao (và), phần bù (không), xung khắc, phân hoạch, luật De Morgan; ví dụ hai xúc xắc.',
  `<span class="eyebrow">IPY111 · Chapter 2 · Lesson 2.1</span>
<h2>Events as sets: union, intersection, complement, De Morgan</h2>
<p class="lead">Probability statements are made of words like “or”, “and”, “not”, “at least”. Translating those words into set operations is the first skill of every probability problem.</p>
<h3>🎯 Objectives</h3>
<ul><li>Translate verbal events into unions, intersections and complements.</li><li>Recognise disjoint (mutually exclusive) events and partitions.</li><li>Use De Morgan's laws to simplify “none / not all” statements.</li></ul>
<h3>📖 Lecture</h3>
<div class="kv-grid">
<div class="kv"><span class="k">A ∪ B (“A or B”)</span><span class="v">outcomes in A, in B, or in both</span></div>
<div class="kv"><span class="k">A ∩ B (“A and B”)</span><span class="v">outcomes in both A and B</span></div>
<div class="kv"><span class="k">A<sup>c</sup> (“not A”)</span><span class="v">outcomes of S not in A</span></div>
<div class="kv"><span class="k">A ⊆ B (“A implies B”)</span><span class="v">every outcome of A is in B</span></div>
</div>
<p>A and B are <strong>disjoint</strong> (mutually exclusive) if A ∩ B = ∅: they cannot happen together. Events A<sub>1</sub>, …, A<sub>n</sub> form a <strong>partition</strong> of S if they are pairwise disjoint and their union is S — exactly one of them happens. Partitions are the backbone of the law of total probability (Chapter 3).</p>
<div class="formula"><span class="lbl">De Morgan's laws</span>(A ∪ B)<sup>c</sup> = A<sup>c</sup> ∩ B<sup>c</sup>  (“not (A or B)” = “neither A nor B”)<br>(A ∩ B)<sup>c</sup> = A<sup>c</sup> ∪ B<sup>c</sup>  (“not both” = “at least one fails”)</div>
<p>They extend to any number of events: “none of A<sub>1</sub>, …, A<sub>n</sub> happens” = A<sub>1</sub><sup>c</sup> ∩ … ∩ A<sub>n</sub><sup>c</sup>, which is why “at least one” problems are solved via the complement “none”.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example — two dice.</b> Let A = “first die is even” (18 outcomes) and B = “sum ≥ 10” = {(4,6),(5,5),(6,4),(5,6),(6,5),(6,6)} (6 outcomes).</p>
<p>Step 1: A ∩ B = {(4,6),(6,4),(6,5),(6,6)}, 4 outcomes ⇒ P(A ∩ B) = 4/36 = 1/9.</p>
<p>Step 2: |A ∪ B| = 18 + 6 − 4 = 20 ⇒ P(A ∪ B) = 20/36 = <b>5/9</b>.</p>
<p>Step 3 (De Morgan check): (A ∪ B)<sup>c</sup> = “first die odd <em>and</em> sum ≤ 9”. Odd first die: 18 outcomes, minus (5,5) and (5,6) which have sum ≥ 10 ⇒ 16 = 36 − 20 ✓.</p></div>
<div class="callout"><p><b>Example — a server log.</b> Let E = “request returns an error”, S = “request is slow (over 1 s)”. “Request is fine” = E<sup>c</sup> ∩ S<sup>c</sup> = (E ∪ S)<sup>c</sup>. “Request is bad in exactly one way” = (E ∩ S<sup>c</sup>) ∪ (E<sup>c</sup> ∩ S) — two disjoint pieces.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Reading “or” as “exactly one” — in probability “or” is inclusive unless stated otherwise.</li><li>Confusing disjoint with independent (Chapter 4): disjoint events with positive probabilities are never independent.</li><li>Writing (A ∩ B)<sup>c</sup> = A<sup>c</sup> ∩ B<sup>c</sup> (wrong) — the operation flips.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>or ↔ ∪, and ↔ ∩, not ↔ complement.</li><li>Disjoint: A ∩ B = ∅; partition: disjoint pieces covering S.</li><li>De Morgan: complement flips ∪ and ∩.</li><li>Draw a Venn diagram or a 6×6 grid for small problems.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/3-5-tree-and-venn-diagrams" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 3.5 Tree and Venn Diagrams</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class01-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 1b: Counting and Sets (set operations)</a></li><li><a href="https://seeing-theory.brown.edu/compound-probability/index.html" target="_blank" rel="noopener">Seeing Theory — Compound Probability (set theory, interactive)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write “at most one of A, B occurs” in set notation.</li><li>With the dice events above, find P(A ∩ B<sup>c</sup>).</li><li>Is {sum is even, sum is odd} a partition of the two-dice sample space?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (A ∩ B)<sup>c</sup> = A<sup>c</sup> ∪ B<sup>c</sup>. 2) 18 − 4 = 14 outcomes ⇒ 14/36 = 7/18. 3) Yes: disjoint and their union is S.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 2 · Bài 2.1</span>
<h2>Biến cố là tập hợp: hợp, giao, phần bù, De Morgan</h2>
<p class="lead">Mệnh đề xác suất được ghép từ những chữ như “hoặc”, “và”, “không”, “ít nhất”. Dịch các chữ đó sang phép toán tập hợp là kỹ năng đầu tiên của mọi bài xác suất.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dịch biến cố bằng lời sang hợp, giao, phần bù.</li><li>Nhận biết biến cố xung khắc và phân hoạch.</li><li>Dùng luật De Morgan để rút gọn mệnh đề “không có / không phải tất cả”.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="kv-grid">
<div class="kv"><span class="k">A ∪ B (“A hoặc B”)</span><span class="v">kết quả thuộc A, thuộc B, hoặc cả hai</span></div>
<div class="kv"><span class="k">A ∩ B (“A và B”)</span><span class="v">kết quả thuộc cả A lẫn B</span></div>
<div class="kv"><span class="k">A<sup>c</sup> (“không A”)</span><span class="v">kết quả của S không thuộc A</span></div>
<div class="kv"><span class="k">A ⊆ B (“A kéo theo B”)</span><span class="v">mọi kết quả của A đều thuộc B</span></div>
</div>
<p>A và B <strong>xung khắc</strong> nếu A ∩ B = ∅: không thể cùng xảy ra. Các biến cố A<sub>1</sub>, …, A<sub>n</sub> lập thành một <strong>phân hoạch</strong> (hệ đầy đủ) của S nếu đôi một xung khắc và hợp của chúng bằng S — đúng một trong số đó xảy ra. Phân hoạch là xương sống của công thức xác suất toàn phần (Chương 3).</p>
<div class="formula"><span class="lbl">Luật De Morgan</span>(A ∪ B)<sup>c</sup> = A<sup>c</sup> ∩ B<sup>c</sup>  (“không (A hoặc B)” = “không A và không B”)<br>(A ∩ B)<sup>c</sup> = A<sup>c</sup> ∪ B<sup>c</sup>  (“không cả hai” = “ít nhất một cái không xảy ra”)</div>
<p>Luật mở rộng cho bao nhiêu biến cố cũng được: “không biến cố nào trong A<sub>1</sub>, …, A<sub>n</sub> xảy ra” = A<sub>1</sub><sup>c</sup> ∩ … ∩ A<sub>n</sub><sup>c</sup> — đó là lý do bài “ít nhất một” được giải qua phần bù “không có cái nào”.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — hai xúc xắc.</b> Cho A = “xúc xắc thứ nhất chẵn” (18 kết quả) và B = “tổng ≥ 10” = {(4,6),(5,5),(6,4),(5,6),(6,5),(6,6)} (6 kết quả).</p>
<p>Bước 1: A ∩ B = {(4,6),(6,4),(6,5),(6,6)}, 4 kết quả ⇒ P(A ∩ B) = 4/36 = 1/9.</p>
<p>Bước 2: |A ∪ B| = 18 + 6 − 4 = 20 ⇒ P(A ∪ B) = 20/36 = <b>5/9</b>.</p>
<p>Bước 3 (kiểm bằng De Morgan): (A ∪ B)<sup>c</sup> = “xúc xắc thứ nhất lẻ <em>và</em> tổng ≤ 9”. Thứ nhất lẻ: 18 kết quả, trừ (5,5) và (5,6) có tổng ≥ 10 ⇒ 16 = 36 − 20 ✓.</p></div>
<div class="callout"><p><b>Ví dụ — log server.</b> Đặt E = “request trả lỗi”, S = “request chậm (trên 1 s)”. “Request ổn” = E<sup>c</sup> ∩ S<sup>c</sup> = (E ∪ S)<sup>c</sup>. “Request hỏng đúng một kiểu” = (E ∩ S<sup>c</sup>) ∪ (E<sup>c</sup> ∩ S) — hai mảnh xung khắc.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Hiểu “hoặc” là “đúng một” — trong xác suất “hoặc” bao gồm cả hai, trừ khi nói rõ.</li><li>Nhầm xung khắc với độc lập (Chương 4): hai biến cố xung khắc có xác suất dương không bao giờ độc lập.</li><li>Viết (A ∩ B)<sup>c</sup> = A<sup>c</sup> ∩ B<sup>c</sup> (sai) — phép toán phải đảo.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>hoặc ↔ ∪, và ↔ ∩, không ↔ phần bù.</li><li>Xung khắc: A ∩ B = ∅; phân hoạch: các mảnh xung khắc phủ kín S.</li><li>De Morgan: lấy phần bù thì ∪ và ∩ đổi chỗ.</li><li>Bài nhỏ: vẽ biểu đồ Venn hoặc lưới 6×6.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/3-5-tree-and-venn-diagrams" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 3.5 Sơ đồ cây và biểu đồ Venn</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class01-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 1b: Phép đếm và tập hợp (phép toán tập hợp)</a></li><li><a href="https://seeing-theory.brown.edu/compound-probability/index.html" target="_blank" rel="noopener">Seeing Theory — Xác suất phức hợp (lý thuyết tập hợp, tương tác)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết “nhiều nhất một trong A, B xảy ra” bằng ký hiệu tập hợp.</li><li>Với hai biến cố xúc xắc ở trên, tìm P(A ∩ B<sup>c</sup>).</li><li>{tổng chẵn, tổng lẻ} có phải phân hoạch của không gian mẫu hai xúc xắc không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (A ∩ B)<sup>c</sup> = A<sup>c</sup> ∪ B<sup>c</sup>. 2) 18 − 4 = 14 kết quả ⇒ 14/36 = 7/18. 3) Có: xung khắc và hợp bằng S.</p></div>`);

const c22 = L('ipy111-ts-2-2',
  "2.2 — Kolmogorov's axioms and their first consequences|||2.2 — Hệ tiên đề Kolmogorov và các hệ quả đầu tiên",
  'Ba tiên đề của xác suất, suy ra P(∅)=0, quy tắc phần bù, tính đơn điệu, công thức cộng P(A∪B)=P(A)+P(B)−P(A∩B); ví dụ sinh viên học Python/Java.',
  `<span class="eyebrow">IPY111 · Chapter 2 · Lesson 2.2</span>
<h2>Kolmogorov's axioms and their first consequences</h2>
<p class="lead">The naive definition only works for equally likely outcomes. In 1933 Andrey Kolmogorov showed that three short rules are enough to build all of probability — for dice, for loaded dice, and for continuous quantities.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the three axioms of probability.</li><li>Derive the complement rule, monotonicity and the addition rule.</li><li>Use them to fill in a two-event Venn diagram.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Axioms of probability</span>A probability P assigns to each event A a number P(A) such that<br>1) P(A) ≥ 0 for every event A;<br>2) P(S) = 1;<br>3) if A<sub>1</sub>, A<sub>2</sub>, … are pairwise disjoint, then P(A<sub>1</sub> ∪ A<sub>2</sub> ∪ …) = P(A<sub>1</sub>) + P(A<sub>2</sub>) + …</div>
<p>Everything else is a theorem. The naive definition is just one model satisfying the axioms; a loaded die with P(6) = 0.3 and P(k) = 0.14 for k = 1…5 is another (the numbers are ≥ 0 and add to 1).</p>
<div class="formula"><span class="lbl">Consequences</span>P(A<sup>c</sup>) = 1 − P(A)    P(∅) = 0    if A ⊆ B then P(A) ≤ P(B)    0 ≤ P(A) ≤ 1<br>P(A ∪ B) = P(A) + P(B) − P(A ∩ B)</div>
<p><em>Proof of the addition rule:</em> split A ∪ B into the disjoint pieces A and B ∩ A<sup>c</sup>; also B is the disjoint union of A ∩ B and B ∩ A<sup>c</sup>. By axiom 3, P(A ∪ B) = P(A) + P(B ∩ A<sup>c</sup>) = P(A) + P(B) − P(A ∩ B). The subtraction removes the overlap that was counted twice.</p>
<p>A useful corollary is a <strong>lower bound for intersections</strong>: P(A ∩ B) ≥ P(A) + P(B) − 1, because P(A ∪ B) ≤ 1.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example — programming languages.</b> In a cohort, 60% of students know Python, 45% know Java and 25% know both. Pick a student at random.</p>
<p>Step 1: P(Python or Java) = 0.60 + 0.45 − 0.25 = <b>0.80</b>.</p>
<p>Step 2: P(neither) = 1 − 0.80 = <b>0.20</b> (complement).</p>
<p>Step 3: P(only Python) = 0.60 − 0.25 = 0.35; P(only Java) = 0.45 − 0.25 = 0.20; P(exactly one) = <b>0.55</b>.</p></div>
<div class="callout"><p><b>Example — a lower bound.</b> 70% of users open the app daily and 50% enable notifications. Without any other data, at least 0.70 + 0.50 − 1 = <b>20%</b> do both.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Adding P(A) + P(B) for overlapping events — the answer can even exceed 1 (0.60 + 0.45 = 1.05).</li><li>Assigning probabilities that do not add up to 1 over a partition.</li><li>Thinking P(A) = 0 means “impossible” — for continuous quantities (Chapter 7) every single value has probability 0.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Three axioms: non-negativity, P(S) = 1, additivity for disjoint events.</li><li>P(A<sup>c</sup>) = 1 − P(A); A ⊆ B ⇒ P(A) ≤ P(B).</li><li>P(A ∪ B) = P(A) + P(B) − P(A ∩ B).</li><li>P(A ∩ B) ≥ P(A) + P(B) − 1.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 3.3 Two Basic Rules of Probability</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class02-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 2: probability functions and the rules of probability</a></li><li><a href="https://ocw.mit.edu/courses/res-6-012-introduction-to-probability-spring-2018/pages/part-i-the-fundamentals/" target="_blank" rel="noopener">MIT RES.6-012 (Tsitsiklis) — Part I: The Fundamentals (probability models and axioms)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>P(A) = 0.5, P(B) = 0.4, P(A ∪ B) = 0.7. Find P(A ∩ B) and P(A<sup>c</sup> ∩ B<sup>c</sup>).</li><li>Can P(A) = 0.6, P(B) = 0.7 and A, B be disjoint?</li><li>A loaded die has P(6) = 0.3 and the other faces equally likely. Find P(even).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 0.5 + 0.4 − 0.7 = 0.2; 1 − 0.7 = 0.3. 2) No: disjoint would give P(A ∪ B) = 1.3 &gt; 1. 3) Other faces 0.7/5 = 0.14 each ⇒ P(2) + P(4) + P(6) = 0.14 + 0.14 + 0.3 = 0.58.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 2 · Bài 2.2</span>
<h2>Hệ tiên đề Kolmogorov và các hệ quả đầu tiên</h2>
<p class="lead">Định nghĩa cổ điển chỉ dùng được khi các kết quả đồng khả năng. Năm 1933 Andrey Kolmogorov chỉ ra rằng ba quy tắc ngắn là đủ để dựng toàn bộ lý thuyết xác suất — cho xúc xắc thường, xúc xắc đổ chì và cả đại lượng liên tục.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu ba tiên đề xác suất.</li><li>Suy ra quy tắc phần bù, tính đơn điệu và công thức cộng.</li><li>Dùng chúng điền đầy biểu đồ Venn hai biến cố.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Hệ tiên đề xác suất</span>Xác suất P gán cho mỗi biến cố A một số P(A) sao cho<br>1) P(A) ≥ 0 với mọi biến cố A;<br>2) P(S) = 1;<br>3) nếu A<sub>1</sub>, A<sub>2</sub>, … đôi một xung khắc thì P(A<sub>1</sub> ∪ A<sub>2</sub> ∪ …) = P(A<sub>1</sub>) + P(A<sub>2</sub>) + …</div>
<p>Mọi thứ khác là định lý. Định nghĩa cổ điển chỉ là một mô hình thoả các tiên đề; xúc xắc đổ chì với P(6) = 0,3 và P(k) = 0,14 cho k = 1…5 là một mô hình khác (các số ≥ 0 và cộng lại bằng 1).</p>
<div class="formula"><span class="lbl">Hệ quả</span>P(A<sup>c</sup>) = 1 − P(A)    P(∅) = 0    nếu A ⊆ B thì P(A) ≤ P(B)    0 ≤ P(A) ≤ 1<br>P(A ∪ B) = P(A) + P(B) − P(A ∩ B)</div>
<p><em>Chứng minh công thức cộng:</em> tách A ∪ B thành hai mảnh xung khắc A và B ∩ A<sup>c</sup>; đồng thời B là hợp xung khắc của A ∩ B và B ∩ A<sup>c</sup>. Theo tiên đề 3, P(A ∪ B) = P(A) + P(B ∩ A<sup>c</sup>) = P(A) + P(B) − P(A ∩ B). Phép trừ bỏ đi phần giao bị đếm hai lần.</p>
<p>Một hệ quả hữu ích là <strong>chặn dưới cho phần giao</strong>: P(A ∩ B) ≥ P(A) + P(B) − 1, vì P(A ∪ B) ≤ 1.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ — ngôn ngữ lập trình.</b> Trong một khoá, 60% sinh viên biết Python, 45% biết Java, 25% biết cả hai. Chọn ngẫu nhiên một sinh viên.</p>
<p>Bước 1: P(Python hoặc Java) = 0,60 + 0,45 − 0,25 = <b>0,80</b>.</p>
<p>Bước 2: P(không biết cả hai) = 1 − 0,80 = <b>0,20</b> (phần bù).</p>
<p>Bước 3: P(chỉ Python) = 0,60 − 0,25 = 0,35; P(chỉ Java) = 0,45 − 0,25 = 0,20; P(đúng một ngôn ngữ) = <b>0,55</b>.</p></div>
<div class="callout"><p><b>Ví dụ — chặn dưới.</b> 70% người dùng mở app hằng ngày và 50% bật thông báo. Không cần thêm dữ liệu, ít nhất 0,70 + 0,50 − 1 = <b>20%</b> làm cả hai.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Cộng P(A) + P(B) cho hai biến cố giao nhau — kết quả thậm chí vượt 1 (0,60 + 0,45 = 1,05).</li><li>Gán xác suất cho một phân hoạch mà tổng không bằng 1.</li><li>Nghĩ rằng P(A) = 0 nghĩa là “không thể” — với đại lượng liên tục (Chương 7) mỗi giá trị đơn lẻ đều có xác suất 0.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Ba tiên đề: không âm, P(S) = 1, cộng tính với biến cố xung khắc.</li><li>P(A<sup>c</sup>) = 1 − P(A); A ⊆ B ⇒ P(A) ≤ P(B).</li><li>P(A ∪ B) = P(A) + P(B) − P(A ∩ B).</li><li>P(A ∩ B) ≥ P(A) + P(B) − 1.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 3.3 Hai quy tắc cơ bản của xác suất</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class02-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 2: hàm xác suất và các quy tắc</a></li><li><a href="https://ocw.mit.edu/courses/res-6-012-introduction-to-probability-spring-2018/pages/part-i-the-fundamentals/" target="_blank" rel="noopener">MIT RES.6-012 (Tsitsiklis) — Phần I: Nền tảng (mô hình xác suất và tiên đề)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>P(A) = 0,5, P(B) = 0,4, P(A ∪ B) = 0,7. Tìm P(A ∩ B) và P(A<sup>c</sup> ∩ B<sup>c</sup>).</li><li>Có thể có P(A) = 0,6, P(B) = 0,7 với A, B xung khắc không?</li><li>Xúc xắc đổ chì có P(6) = 0,3, các mặt còn lại đồng khả năng. Tìm P(chẵn).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 0,5 + 0,4 − 0,7 = 0,2; 1 − 0,7 = 0,3. 2) Không: nếu xung khắc thì P(A ∪ B) = 1,3 &gt; 1. 3) Mỗi mặt khác 0,7/5 = 0,14 ⇒ P(2) + P(4) + P(6) = 0,14 + 0,14 + 0,3 = 0,58.</p></div>`);

const c23 = L('ipy111-ts-2-3',
  '2.3 — Inclusion–exclusion and the matching problem|||2.3 — Bao hàm – loại trừ và bài toán ghép cặp',
  'Công thức bao hàm – loại trừ cho 3 và n biến cố, đếm số chia hết cho 2, 3 hoặc 5; bài toán ghép cặp de Montmort với giới hạn 1 − 1/e ≈ 0,632.',
  `<span class="eyebrow">IPY111 · Chapter 2 · Lesson 2.3</span>
<h2>Inclusion–exclusion and the matching problem</h2>
<p class="lead">The addition rule for two events generalises to any number of events: add the singles, subtract the pairs, add back the triples… This is inclusion–exclusion, and it solves one of the most elegant problems in probability.</p>
<h3>🎯 Objectives</h3>
<ul><li>Apply inclusion–exclusion to three events.</li><li>State the general n-event formula.</li><li>Solve de Montmort's matching problem and interpret 1 − 1/e.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Three events</span>P(A ∪ B ∪ C) = P(A) + P(B) + P(C) − P(A ∩ B) − P(A ∩ C) − P(B ∩ C) + P(A ∩ B ∩ C)</div>
<p>Why the last term? An outcome in all three sets is added 3 times, subtracted 3 times, so it must be added back once. In general:</p>
<div class="formula"><span class="lbl">Inclusion–exclusion (n events)</span>P(A<sub>1</sub> ∪ … ∪ A<sub>n</sub>) = ∑ P(A<sub>i</sub>) − ∑<sub>i&lt;j</sub> P(A<sub>i</sub> ∩ A<sub>j</sub>) + ∑<sub>i&lt;j&lt;k</sub> P(A<sub>i</sub> ∩ A<sub>j</sub> ∩ A<sub>k</sub>) − … + (−1)<sup>n+1</sup> P(A<sub>1</sub> ∩ … ∩ A<sub>n</sub>)</div>
<p>It is most useful when the intersections are easy to compute — typically by symmetry, when every k-fold intersection has the same probability, so the k-th sum is C(n, k) times one term.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — divisibility.</b> How many integers in 1…100 are divisible by 2, 3 or 5? Let A<sub>2</sub>, A<sub>3</sub>, A<sub>5</sub> be the multiples. |A<sub>2</sub>| = 50, |A<sub>3</sub>| = 33, |A<sub>5</sub>| = 20; pairs: multiples of 6 → 16, of 10 → 10, of 15 → 6; triple: multiples of 30 → 3.</p>
<p>Count = 50 + 33 + 20 − 16 − 10 − 6 + 3 = <b>74</b>, so a random integer in 1…100 has probability 0.74.</p></div>
<div class="callout"><p><b>Example 2 — the matching problem (de Montmort, 1708).</b> n students drop their student cards in a box; the cards are handed back at random. What is the probability that at least one student gets their own card?</p>
<p>Step 1: let A<sub>i</sub> = “student i gets their own card”. P(A<sub>i</sub>) = (n − 1)!/n! = 1/n.</p>
<p>Step 2: for any k specific students, P(all k get their own) = (n − k)!/n!, and there are C(n, k) such groups, so the k-th sum is C(n, k)(n − k)!/n! = 1/k!.</p>
<p>Step 3: P(at least one match) = 1 − 1/2! + 1/3! − … + (−1)<sup>n+1</sup>/n!.</p>
<p>For n = 3: 1 − 1/2 + 1/6 = 2/3; n = 4: 5/8 = 0.625; n = 10: ≈ 0.632121. As n → ∞ this is the series of 1 − e<sup>−1</sup> ≈ <b>0.6321</b>: the answer barely depends on whether there are 10 students or 10 000.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Stopping after subtracting the pairs — for three or more events you must add back the triples.</li><li>Counting multiples of 6 as “2 and 3” but forgetting that “3 and 5” means multiples of 15, not 8.</li><li>Expecting the matching probability to go to 0 or 1 as n grows; it converges to 1 − 1/e.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Add singles, subtract pairs, add triples, … alternate signs.</li><li>Symmetric problems: the k-th term is C(n, k) × (probability of one k-fold intersection).</li><li>Matching problem: P(at least one match) → 1 − 1/e ≈ 0.632.</li><li>Divisibility counts are a classic application.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/03%3A_Combinatorics" target="_blank" rel="noopener">Grinstead &amp; Snell — Chapter 3 (inclusion–exclusion and the hat-check problem)</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class01-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 1b: inclusion–exclusion principle</a></li><li><a href="https://www.youtube.com/playlist?list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo" target="_blank" rel="noopener">Harvard Stat 110 — Lecture 3: Birthday Problem, Properties of Probability (inclusion–exclusion)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>How many integers in 1…60 are divisible by 2 or 3?</li><li>P(A) = P(B) = P(C) = 0.3, each pairwise intersection 0.1, triple intersection 0.05. Find P(A ∪ B ∪ C).</li><li>Matching problem with n = 4: what is P(no student gets their own card)?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 30 + 20 − 10 = 40. 2) 0.9 − 0.3 + 0.05 = 0.65. 3) 1 − 5/8 = 3/8 (these are the 9 “derangements” of 24 permutations).</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 2 · Bài 2.3</span>
<h2>Bao hàm – loại trừ và bài toán ghép cặp</h2>
<p class="lead">Công thức cộng cho hai biến cố mở rộng cho bao nhiêu biến cố cũng được: cộng từng cái, trừ từng cặp, cộng lại từng bộ ba… Đó là nguyên lý bao hàm – loại trừ, và nó giải được một trong những bài toán đẹp nhất của xác suất.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp dụng bao hàm – loại trừ cho ba biến cố.</li><li>Phát biểu công thức tổng quát cho n biến cố.</li><li>Giải bài toán ghép cặp de Montmort và hiểu ý nghĩa 1 − 1/e.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Ba biến cố</span>P(A ∪ B ∪ C) = P(A) + P(B) + P(C) − P(A ∩ B) − P(A ∩ C) − P(B ∩ C) + P(A ∩ B ∩ C)</div>
<p>Vì sao có số hạng cuối? Một kết quả thuộc cả ba tập bị cộng 3 lần, trừ 3 lần, nên phải cộng lại một lần. Tổng quát:</p>
<div class="formula"><span class="lbl">Bao hàm – loại trừ (n biến cố)</span>P(A<sub>1</sub> ∪ … ∪ A<sub>n</sub>) = ∑ P(A<sub>i</sub>) − ∑<sub>i&lt;j</sub> P(A<sub>i</sub> ∩ A<sub>j</sub>) + ∑<sub>i&lt;j&lt;k</sub> P(A<sub>i</sub> ∩ A<sub>j</sub> ∩ A<sub>k</sub>) − … + (−1)<sup>n+1</sup> P(A<sub>1</sub> ∩ … ∩ A<sub>n</sub>)</div>
<p>Công thức hữu ích nhất khi các phần giao dễ tính — thường nhờ tính đối xứng, khi mọi phần giao k tập có cùng xác suất, nên tổng thứ k bằng C(n, k) nhân một số hạng.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — chia hết.</b> Trong 1…100 có bao nhiêu số chia hết cho 2, 3 hoặc 5? Gọi A<sub>2</sub>, A<sub>3</sub>, A<sub>5</sub> là tập bội số. |A<sub>2</sub>| = 50, |A<sub>3</sub>| = 33, |A<sub>5</sub>| = 20; từng cặp: bội của 6 → 16, của 10 → 10, của 15 → 6; bộ ba: bội của 30 → 3.</p>
<p>Số lượng = 50 + 33 + 20 − 16 − 10 − 6 + 3 = <b>74</b>, nên một số nguyên ngẫu nhiên trong 1…100 có xác suất 0,74.</p></div>
<div class="callout"><p><b>Ví dụ 2 — bài toán ghép cặp (de Montmort, 1708).</b> n sinh viên bỏ thẻ sinh viên vào một hộp; thẻ được trả lại ngẫu nhiên. Xác suất có ít nhất một bạn nhận đúng thẻ của mình là bao nhiêu?</p>
<p>Bước 1: đặt A<sub>i</sub> = “bạn thứ i nhận đúng thẻ”. P(A<sub>i</sub>) = (n − 1)!/n! = 1/n.</p>
<p>Bước 2: với k bạn cụ thể, P(cả k bạn nhận đúng) = (n − k)!/n!, và có C(n, k) nhóm như vậy, nên tổng thứ k bằng C(n, k)(n − k)!/n! = 1/k!.</p>
<p>Bước 3: P(ít nhất một bạn nhận đúng) = 1 − 1/2! + 1/3! − … + (−1)<sup>n+1</sup>/n!.</p>
<p>Với n = 3: 1 − 1/2 + 1/6 = 2/3; n = 4: 5/8 = 0,625; n = 10: ≈ 0,632121. Khi n → ∞ đây là chuỗi của 1 − e<sup>−1</sup> ≈ <b>0,6321</b>: đáp án gần như không phụ thuộc lớp có 10 hay 10 000 sinh viên.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dừng sau khi trừ các cặp — với ba biến cố trở lên phải cộng lại bộ ba.</li><li>Tính bội của 6 cho “2 và 3” nhưng quên rằng “3 và 5” là bội của 15, không phải 8.</li><li>Tưởng xác suất ghép cặp tiến về 0 hoặc 1 khi n lớn; nó hội tụ về 1 − 1/e.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Cộng từng cái, trừ từng cặp, cộng bộ ba, … đổi dấu luân phiên.</li><li>Bài đối xứng: số hạng thứ k = C(n, k) × (xác suất của một phần giao k tập).</li><li>Bài toán ghép cặp: P(ít nhất một cặp đúng) → 1 − 1/e ≈ 0,632.</li><li>Đếm số chia hết là ứng dụng kinh điển.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/03%3A_Combinatorics" target="_blank" rel="noopener">Grinstead &amp; Snell — Chương 3 (bao hàm – loại trừ và bài toán trả mũ)</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class01-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 1b: nguyên lý bao hàm – loại trừ</a></li><li><a href="https://www.youtube.com/playlist?list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo" target="_blank" rel="noopener">Harvard Stat 110 — Bài giảng 3: bài toán ngày sinh, tính chất xác suất (bao hàm – loại trừ)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Trong 1…60 có bao nhiêu số chia hết cho 2 hoặc 3?</li><li>P(A) = P(B) = P(C) = 0,3, mỗi giao hai tập 0,1, giao ba tập 0,05. Tìm P(A ∪ B ∪ C).</li><li>Bài toán ghép cặp với n = 4: P(không bạn nào nhận đúng thẻ)?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 30 + 20 − 10 = 40. 2) 0,9 − 0,3 + 0,05 = 0,65. 3) 1 − 5/8 = 3/8 (đó là 9 “hoán vị không điểm bất động” trong 24 hoán vị).</p></div>`);

const c24 = L('ipy111-ts-2-4',
  '2.4 — What probability means, and checking it by Monte Carlo simulation|||2.4 — Xác suất nghĩa là gì, và kiểm bằng mô phỏng Monte Carlo',
  'Ba cách hiểu xác suất (cổ điển, tần suất, chủ quan/Bayes); mô phỏng Monte Carlo bằng Python chạy thật cho bài ghép cặp và tổng hai xúc xắc; sai số cỡ 1/√N.',
  `<span class="eyebrow">IPY111 · Chapter 2 · Lesson 2.4</span>
<h2>What probability means, and checking it by Monte Carlo simulation</h2>
<p class="lead">The axioms say how probabilities behave, not what they are. In practice we interpret them as long-run frequencies or as degrees of belief — and we can test any answer by simulating the experiment many times on a computer.</p>
<h3>🎯 Objectives</h3>
<ul><li>Distinguish the classical, frequentist and Bayesian interpretations.</li><li>Write a Monte Carlo simulation that estimates a probability.</li><li>Know that simulation error shrinks like 1/√N.</li></ul>
<h3>📖 Lecture</h3>
<ul>
<li><strong>Classical:</strong> symmetry — equally likely outcomes (Chapter 1).</li>
<li><strong>Frequentist:</strong> P(A) is the limit of the fraction of times A happens when the experiment is repeated independently many times. “The probability that a request fails is 0.2%” means about 2 failures per 1 000 requests in the long run.</li>
<li><strong>Bayesian (subjective):</strong> P(A) measures a degree of belief, updated by evidence through Bayes' rule (Chapter 3). It makes sense even for one-off events (“this exam will be hard”).</li>
</ul>
<p>All three obey the same axioms, so all the theorems of this course apply to each. The frequentist view suggests a practical tool: <strong>Monte Carlo simulation</strong> — repeat a random experiment N times with a pseudo-random number generator and use the observed fraction as an estimate. The typical error is about √(p(1 − p)/N): 100 times more trials give only 10 times more accuracy (we prove this with the Law of Large Numbers in Chapter 10).</p>
<div class="formula"><span class="lbl">Monte Carlo estimate</span>P(A) ≈ (number of trials in which A occurred) / N,   typical error ≈ √(p(1 − p) / N)</div>
<h3>✍️ Worked example — simulating Lesson 2.3</h3>
<p>We shuffle n cards and check for at least one fixed point, 100 000 times for each n, and also simulate the sum of two dice. A fixed <code>seed</code> makes the run reproducible.</p>
<pre><code class="language-python">import random
random.seed(111)

def has_match(n):
    perm = list(range(n))
    random.shuffle(perm)            # random assignment of n hats
    return any(perm[i] == i for i in range(n))

trials = 100_000
for n in [3, 10, 52]:
    hits = sum(has_match(n) for _ in range(trials))
    print(n, hits / trials)

# two dice: P(sum = 7)
sevens = sum(random.randint(1, 6) + random.randint(1, 6) == 7 for _ in range(trials))
print("sum=7:", sevens / trials, "exact:", round(1 / 6, 4))
</code></pre>
<div class="out">3 0.66349
10 0.63367
52 0.63275
sum=7: 0.16604 exact: 0.1667</div>
<p>Step-by-step reading: for n = 3 the exact value is 2/3 ≈ 0.6667 and the estimate 0.6635 differs by 0.003, about two standard errors (one standard error is √(0.667 · 0.333 / 100 000) ≈ 0.0015) — perfectly normal. For n = 10 and n = 52 the estimates sit near 1 − 1/e ≈ 0.6321, confirming the theory.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Trusting a simulation with too few trials: with N = 100 the error is about ±0.05.</li><li>Expecting the estimate to equal the exact value; it fluctuates — that is the point of the 1/√N rule.</li><li>Treating a simulation as a proof. Simulation <em>checks</em> a derivation and finds bugs; mathematics explains why.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Classical, frequentist and Bayesian views all satisfy the same axioms.</li><li>Monte Carlo: estimate P(A) by the fraction of simulated trials where A occurs.</li><li>Error ≈ √(p(1 − p)/N); fix the seed to reproduce results.</li><li>Use simulation to check every surprising answer.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/01%3A_Discrete_Probability_Distributions" target="_blank" rel="noopener">Grinstead &amp; Snell — Chapter 1: simulation of discrete probabilities</a></li><li><a href="https://docs.python.org/3/library/random.html" target="_blank" rel="noopener">Python random module (seed, shuffle, randint)</a></li><li><a href="https://seeing-theory.brown.edu/basic-probability/index.html" target="_blank" rel="noopener">Seeing Theory — Basic Probability: watch frequencies converge</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Roughly how many trials are needed for a Monte Carlo error of about 0.001 when p ≈ 0.5?</li><li>Modify the code to estimate P(at least one six in 4 rolls of a die). What exact value should it approach?</li><li>Give one event that only the Bayesian interpretation handles naturally.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) √(0.25/N) = 0.001 ⇒ N = 250 000. 2) 1 − (5/6)<sup>4</sup> ≈ 0.5177. 3) E.g. “our startup succeeds”, “this specific patient has the disease” — a one-off event that cannot be repeated.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 2 · Bài 2.4</span>
<h2>Xác suất nghĩa là gì, và kiểm bằng mô phỏng Monte Carlo</h2>
<p class="lead">Hệ tiên đề nói xác suất vận hành thế nào, chứ không nói nó là gì. Thực tế ta hiểu nó là tần suất dài hạn hoặc mức độ tin tưởng — và có thể kiểm bất kỳ đáp án nào bằng cách cho máy tính lặp lại phép thử thật nhiều lần.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phân biệt cách hiểu cổ điển, tần suất và Bayes.</li><li>Viết mô phỏng Monte Carlo ước lượng một xác suất.</li><li>Biết sai số mô phỏng giảm như 1/√N.</li></ul>
<h3>📖 Bài giảng</h3>
<ul>
<li><strong>Cổ điển:</strong> đối xứng — các kết quả đồng khả năng (Chương 1).</li>
<li><strong>Tần suất:</strong> P(A) là giới hạn của tỉ lệ số lần A xảy ra khi lặp phép thử độc lập thật nhiều lần. “Xác suất request lỗi là 0,2%” nghĩa là về lâu dài khoảng 2 lỗi trên 1 000 request.</li>
<li><strong>Bayes (chủ quan):</strong> P(A) đo mức độ tin tưởng, được cập nhật theo bằng chứng qua quy tắc Bayes (Chương 3). Nó có nghĩa cả với sự kiện chỉ xảy ra một lần (“đề thi này sẽ khó”).</li>
</ul>
<p>Cả ba đều tuân theo cùng hệ tiên đề, nên mọi định lý của môn đúng cho cả ba. Cách nhìn tần suất gợi ra một công cụ thực dụng: <strong>mô phỏng Monte Carlo</strong> — lặp phép thử ngẫu nhiên N lần bằng bộ sinh số giả ngẫu nhiên và lấy tỉ lệ quan sát được làm ước lượng. Sai số điển hình cỡ √(p(1 − p)/N): tăng số phép thử 100 lần chỉ chính xác hơn 10 lần (ta chứng minh bằng Luật số lớn ở Chương 10).</p>
<div class="formula"><span class="lbl">Ước lượng Monte Carlo</span>P(A) ≈ (số lần thử mà A xảy ra) / N,   sai số điển hình ≈ √(p(1 − p) / N)</div>
<h3>✍️ Ví dụ — mô phỏng Bài 2.3</h3>
<p>Ta xáo n thẻ và kiểm có ít nhất một điểm bất động, 100 000 lần cho mỗi n, đồng thời mô phỏng tổng hai xúc xắc. <code>seed</code> cố định giúp chạy lại ra đúng kết quả.</p>
<pre><code class="language-python">import random
random.seed(111)

def has_match(n):
    perm = list(range(n))
    random.shuffle(perm)            # random assignment of n hats
    return any(perm[i] == i for i in range(n))

trials = 100_000
for n in [3, 10, 52]:
    hits = sum(has_match(n) for _ in range(trials))
    print(n, hits / trials)

# two dice: P(sum = 7)
sevens = sum(random.randint(1, 6) + random.randint(1, 6) == 7 for _ in range(trials))
print("sum=7:", sevens / trials, "exact:", round(1 / 6, 4))
</code></pre>
<div class="out">3 0.66349
10 0.63367
52 0.63275
sum=7: 0.16604 exact: 0.1667</div>
<p>Đọc từng bước: với n = 3 giá trị đúng là 2/3 ≈ 0,6667 và ước lượng 0,6635 lệch 0,003, cỡ hai lần sai số chuẩn √(0,667 · 0,333 / 100 000) ≈ 0,0015 — hoàn toàn bình thường. Với n = 10 và n = 52 ước lượng nằm sát 1 − 1/e ≈ 0,6321, khẳng định lý thuyết.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tin mô phỏng với quá ít phép thử: N = 100 thì sai số cỡ ±0,05.</li><li>Mong ước lượng bằng đúng giá trị chính xác; nó dao động — đó chính là ý nghĩa của quy luật 1/√N.</li><li>Coi mô phỏng là chứng minh. Mô phỏng <em>kiểm</em> lời giải và bắt lỗi; toán học giải thích vì sao.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Cách hiểu cổ điển, tần suất, Bayes đều thoả cùng hệ tiên đề.</li><li>Monte Carlo: ước lượng P(A) bằng tỉ lệ số lần mô phỏng mà A xảy ra.</li><li>Sai số ≈ √(p(1 − p)/N); cố định seed để tái lập kết quả.</li><li>Dùng mô phỏng kiểm mọi đáp án gây bất ngờ.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/01%3A_Discrete_Probability_Distributions" target="_blank" rel="noopener">Grinstead &amp; Snell — Chương 1: mô phỏng xác suất rời rạc</a></li><li><a href="https://docs.python.org/3/library/random.html" target="_blank" rel="noopener">Module random của Python (seed, shuffle, randint)</a></li><li><a href="https://seeing-theory.brown.edu/basic-probability/index.html" target="_blank" rel="noopener">Seeing Theory — Xác suất cơ bản: xem tần suất hội tụ</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Cần khoảng bao nhiêu phép thử để sai số Monte Carlo cỡ 0,001 khi p ≈ 0,5?</li><li>Sửa code để ước lượng P(ít nhất một mặt 6 trong 4 lần gieo). Ước lượng phải tiến về giá trị đúng nào?</li><li>Cho một biến cố mà chỉ cách hiểu Bayes xử lý tự nhiên.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) √(0,25/N) = 0,001 ⇒ N = 250 000. 2) 1 − (5/6)<sup>4</sup> ≈ 0,5177. 3) Ví dụ “startup của chúng ta thành công”, “bệnh nhân cụ thể này mắc bệnh” — sự kiện một lần, không lặp lại được.</p></div>`);

const q2 = QZ(2, 'Quiz — Chapter 2: Axioms of probability|||Quiz — Chương 2: Hệ tiên đề xác suất', 'Kiểm tra chương 2: phép toán biến cố, De Morgan, tiên đề, công thức cộng, bao hàm – loại trừ, ghép cặp, Monte Carlo.', [
  Q('q1', "By De Morgan, (A ∪ B)^c equals|||Theo De Morgan, (A ∪ B)^c bằng",
    ['A^c ∪ B^c|||A^c ∪ B^c', 'A^c ∩ B^c|||A^c ∩ B^c', 'A ∩ B|||A ∩ B', '(A ∩ B)^c|||(A ∩ B)^c'], 1,
    "“Not (A or B)” = “neither A nor B”.|||“Không (A hoặc B)” = “không A và không B”."),
  Q('q2', "P(A) = 0.6, P(B) = 0.45, P(A ∩ B) = 0.25. P(A ∪ B) =|||P(A) = 0,6, P(B) = 0,45, P(A ∩ B) = 0,25. P(A ∪ B) =",
    ['1.05|||1,05', '0.80|||0,80', '0.55|||0,55', '0.35|||0,35'], 1,
    "0.6 + 0.45 − 0.25 = 0.80.|||0,6 + 0,45 − 0,25 = 0,80."),
  Q('q3', "Same data: P(exactly one of A, B) =|||Cùng dữ liệu: P(đúng một trong A, B) =",
    ['0.55|||0,55', '0.80|||0,80', '0.20|||0,20', '0.30|||0,30'], 0,
    "P(A ∪ B) − P(A ∩ B) = 0.80 − 0.25 = 0.55.|||P(A ∪ B) − P(A ∩ B) = 0,80 − 0,25 = 0,55."),
  Q('q4', "Which is NOT one of Kolmogorov's axioms?|||Điều nào KHÔNG phải tiên đề Kolmogorov?",
    ['P(A) ≥ 0|||P(A) ≥ 0', 'P(S) = 1|||P(S) = 1', 'P(A ∪ B) = P(A) + P(B) for disjoint A, B|||P(A ∪ B) = P(A) + P(B) với A, B xung khắc', 'P(A ∩ B) = P(A)P(B)|||P(A ∩ B) = P(A)P(B)'], 3,
    "The product rule defines independence; it is not an axiom.|||Công thức nhân là định nghĩa độc lập, không phải tiên đề."),
  Q('q5', "If P(A) = 0.7 and P(B) = 0.5, the smallest possible P(A ∩ B) is|||Nếu P(A) = 0,7 và P(B) = 0,5, P(A ∩ B) nhỏ nhất có thể là",
    ['0|||0', '0.2|||0,2', '0.35|||0,35', '0.5|||0,5'], 1,
    "P(A ∩ B) ≥ P(A) + P(B) − 1 = 0.2.|||P(A ∩ B) ≥ P(A) + P(B) − 1 = 0,2."),
  Q('q6', "How many integers in 1…100 are divisible by 2, 3 or 5?|||Trong 1…100 có bao nhiêu số chia hết cho 2, 3 hoặc 5?",
    ['103|||103', '74|||74', '68|||68', '77|||77'], 1,
    "50 + 33 + 20 − 16 − 10 − 6 + 3 = 74.|||50 + 33 + 20 − 16 − 10 − 6 + 3 = 74."),
  Q('q7', "In the matching problem with large n, P(at least one match) is about|||Bài toán ghép cặp với n lớn, P(ít nhất một cặp đúng) xấp xỉ",
    ['0|||0', '1/2|||1/2', '1 − 1/e ≈ 0.632|||1 − 1/e ≈ 0,632', '1|||1'], 2,
    "The alternating series 1 − 1/2! + 1/3! − … converges to 1 − 1/e.|||Chuỗi đan dấu 1 − 1/2! + 1/3! − … hội tụ về 1 − 1/e."),
  Q('q8', "For three events, inclusion–exclusion ends with the term|||Với ba biến cố, công thức bao hàm – loại trừ kết thúc bằng số hạng",
    ['− P(A ∩ B ∩ C)|||− P(A ∩ B ∩ C)', '+ P(A ∩ B ∩ C)|||+ P(A ∩ B ∩ C)', '+ 3P(A ∩ B ∩ C)|||+ 3P(A ∩ B ∩ C)', 'no triple term|||không có số hạng bộ ba'], 1,
    "Triples are added 3 times and subtracted 3 times, so add them back once.|||Bộ ba bị cộng 3 lần, trừ 3 lần, nên cộng lại một lần."),
  Q('q9', "A Monte Carlo estimate with N trials has typical error proportional to|||Ước lượng Monte Carlo với N phép thử có sai số điển hình tỉ lệ với",
    ['1/N|||1/N', '1/√N|||1/√N', '√N|||√N', '1/N²|||1/N²'], 1,
    "Error ≈ √(p(1 − p)/N).|||Sai số ≈ √(p(1 − p)/N)."),
  Q('q10', "Two events with P(A) = 0.3 and P(B) = 0.4 are disjoint. P(A ∪ B) =|||Hai biến cố xung khắc với P(A) = 0,3 và P(B) = 0,4. P(A ∪ B) =",
    ['0.12|||0,12', '0.58|||0,58', '0.7|||0,7', '1|||1'], 2,
    "Disjoint ⇒ P(A ∩ B) = 0, so 0.3 + 0.4.|||Xung khắc ⇒ P(A ∩ B) = 0, nên 0,3 + 0,4."),
]);

const ch2 = {
  title: 'Chapter 2 — Events, axioms and the rules of probability|||Chương 2 — Biến cố, hệ tiên đề và các quy tắc xác suất',
  description: 'Biến cố là tập hợp, De Morgan; hệ tiên đề Kolmogorov, quy tắc phần bù và công thức cộng; bao hàm – loại trừ, bài toán ghép cặp; ba cách hiểu xác suất và mô phỏng Monte Carlo có Python (Blitzstein & Hwang 1.6–1.8 · Ross ch.2).',
  lessons: [c21, c22, c23, c24, q2],
};

// ───────────────────────────── Chương 3 — Xác suất có điều kiện & Bayes ─────────────────────────────
const c31 = L('ipy111-ts-3-1',
  '3.1 — Conditional probability and the multiplication rule|||3.1 — Xác suất có điều kiện và quy tắc nhân',
  'Định nghĩa P(A|B) = P(A∩B)/P(B) như “thu nhỏ không gian mẫu”, bảng hai chiều, quy tắc nhân, rút bài liên tiếp, bài toán hai đứa trẻ.',
  `<span class="eyebrow">IPY111 · Chapter 3 · Lesson 3.1</span>
<h2>Conditional probability and the multiplication rule</h2>
<p class="lead">“Conditioning is the soul of statistics” (Blitzstein). Every time we learn something — a test result, a log line, a user's click — we should update our probabilities. Conditional probability is the rule for doing that.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define P(A | B) and compute it from counts or a two-way table.</li><li>Use the multiplication rule for sequential experiments.</li><li>Distinguish P(A | B) from P(B | A).</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Conditional probability</span>P(A | B) = P(A ∩ B) / P(B),  defined when P(B) &gt; 0</div>
<p>Read it as: <em>given that B happened, restrict the sample space to B, and ask what fraction of it is also in A</em>. With equally likely outcomes this is simply |A ∩ B| / |B|. For a fixed B, P( · | B) satisfies all the axioms, so every rule from Chapter 2 holds conditionally (e.g. P(A<sup>c</sup> | B) = 1 − P(A | B)).</p>
<div class="formula"><span class="lbl">Multiplication rule</span>P(A ∩ B) = P(B) · P(A | B) = P(A) · P(B | A)<br>P(A<sub>1</sub> ∩ A<sub>2</sub> ∩ … ∩ A<sub>n</sub>) = P(A<sub>1</sub>) · P(A<sub>2</sub> | A<sub>1</sub>) · P(A<sub>3</sub> | A<sub>1</sub> ∩ A<sub>2</sub>) · …</div>
<p>The multiplication rule is how we compute probabilities of things that happen in stages, such as drawing cards without replacement.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — two-way table.</b> 200 students in a course:</p>
<div class="kv-grid"><div class="kv"><span class="k">Attended review sessions</span><span class="v">80 passed · 20 failed (100)</span></div><div class="kv"><span class="k">Did not attend</span><span class="v">60 passed · 40 failed (100)</span></div></div>
<p>P(pass) = 140/200 = 0.70. P(pass | attended) = 80/100 = <b>0.80</b>. P(attended | pass) = 80/140 ≈ <b>0.571</b>. The two conditional probabilities answer different questions and are not equal.</p></div>
<div class="callout"><p><b>Example 2 — two aces.</b> Draw 2 cards without replacement. P(both aces) = P(1st ace) · P(2nd ace | 1st ace) = (4/52)(3/51) = <b>1/221</b> ≈ 0.0045. Check with counting: C(4, 2)/C(52, 2) = 6/1 326 = 1/221 ✓.</p></div>
<div class="callout"><p><b>Example 3 — two children.</b> A family has two children (boy/girl equally likely, independent). Sample space {BB, BG, GB, GG}.</p>
<p>P(both girls | the elder is a girl) = P(GG)/P({GB, GG}) = (1/4)/(1/2) = <b>1/2</b>.</p>
<p>P(both girls | at least one girl) = P(GG)/P({BG, GB, GG}) = (1/4)/(3/4) = <b>1/3</b>. The wording of the condition changes the answer.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Confusing P(A | B) with P(B | A) — the “prosecutor's fallacy” (Lesson 3.4).</li><li>Dividing by the wrong total: in P(A | B) the denominator is P(B), not 1.</li><li>Writing P(A ∩ B) = P(A)P(B) without checking independence; the general rule needs a conditional factor.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>P(A | B) = P(A ∩ B)/P(B): shrink the world to B.</li><li>P(A ∩ B) = P(B)P(A | B); chain it for many stages.</li><li>P(A | B) ≠ P(B | A) in general.</li><li>Conditional probabilities obey all the usual rules.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/3-4-contingency-tables" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 3.4 Contingency Tables</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class03-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 3: Conditional Probability, Independence and Bayes' Theorem</a></li><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/04%3A_Conditional_Probability" target="_blank" rel="noopener">Grinstead &amp; Snell — Chapter 4: Conditional Probability</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>From the table, find P(fail | did not attend) and P(did not attend | fail).</li><li>Draw 3 cards without replacement. P(all three are hearts)?</li><li>Two dice: P(sum = 8 | first die shows 3)?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 40/100 = 0.40; 40/60 ≈ 0.667. 2) (13/52)(12/51)(11/50) = 11/850 ≈ 0.0129. 3) Only (3,5) works among the 6 equally likely outcomes with first die 3 ⇒ 1/6.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 3 · Bài 3.1</span>
<h2>Xác suất có điều kiện và quy tắc nhân</h2>
<p class="lead">“Lấy điều kiện là linh hồn của thống kê” (Blitzstein). Mỗi khi biết thêm điều gì — kết quả xét nghiệm, một dòng log, một cú click của người dùng — ta nên cập nhật xác suất. Xác suất có điều kiện là quy tắc để làm việc đó.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa P(A | B) và tính từ số đếm hoặc bảng hai chiều.</li><li>Dùng quy tắc nhân cho phép thử nhiều giai đoạn.</li><li>Phân biệt P(A | B) với P(B | A).</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Xác suất có điều kiện</span>P(A | B) = P(A ∩ B) / P(B),  xác định khi P(B) &gt; 0</div>
<p>Đọc là: <em>biết B đã xảy ra, thu nhỏ không gian mẫu về B, rồi hỏi phần nào của nó cũng thuộc A</em>. Với kết quả đồng khả năng thì đơn giản là |A ∩ B| / |B|. Với B cố định, P( · | B) thoả mọi tiên đề, nên mọi quy tắc ở Chương 2 vẫn đúng khi có điều kiện (ví dụ P(A<sup>c</sup> | B) = 1 − P(A | B)).</p>
<div class="formula"><span class="lbl">Quy tắc nhân</span>P(A ∩ B) = P(B) · P(A | B) = P(A) · P(B | A)<br>P(A<sub>1</sub> ∩ A<sub>2</sub> ∩ … ∩ A<sub>n</sub>) = P(A<sub>1</sub>) · P(A<sub>2</sub> | A<sub>1</sub>) · P(A<sub>3</sub> | A<sub>1</sub> ∩ A<sub>2</sub>) · …</div>
<p>Quy tắc nhân là cách tính xác suất của những việc xảy ra theo từng giai đoạn, như rút bài không hoàn lại.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — bảng hai chiều.</b> 200 sinh viên của một môn:</p>
<div class="kv-grid"><div class="kv"><span class="k">Có đi buổi ôn tập</span><span class="v">80 qua · 20 trượt (100)</span></div><div class="kv"><span class="k">Không đi</span><span class="v">60 qua · 40 trượt (100)</span></div></div>
<p>P(qua) = 140/200 = 0,70. P(qua | có đi ôn) = 80/100 = <b>0,80</b>. P(có đi ôn | qua) = 80/140 ≈ <b>0,571</b>. Hai xác suất có điều kiện trả lời hai câu hỏi khác nhau và không bằng nhau.</p></div>
<div class="callout"><p><b>Ví dụ 2 — hai lá át.</b> Rút 2 lá không hoàn lại. P(cả hai là át) = P(lá 1 là át) · P(lá 2 là át | lá 1 là át) = (4/52)(3/51) = <b>1/221</b> ≈ 0,0045. Kiểm bằng đếm: C(4, 2)/C(52, 2) = 6/1 326 = 1/221 ✓.</p></div>
<div class="callout"><p><b>Ví dụ 3 — hai đứa trẻ.</b> Một gia đình có hai con (trai/gái đồng khả năng, độc lập). Không gian mẫu {TT, TG, GT, GG} (anh/chị viết trước).</p>
<p>P(cả hai là gái | con lớn là gái) = P(GG)/P({GT, GG}) = (1/4)/(1/2) = <b>1/2</b>.</p>
<p>P(cả hai là gái | có ít nhất một gái) = P(GG)/P({TG, GT, GG}) = (1/4)/(3/4) = <b>1/3</b>. Cách phát biểu điều kiện làm đổi đáp án.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nhầm P(A | B) với P(B | A) — “ngộ nhận của công tố viên” (Bài 3.4).</li><li>Chia sai mẫu: trong P(A | B) mẫu số là P(B), không phải 1.</li><li>Viết P(A ∩ B) = P(A)P(B) mà không kiểm độc lập; quy tắc tổng quát cần thừa số có điều kiện.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>P(A | B) = P(A ∩ B)/P(B): thu nhỏ thế giới về B.</li><li>P(A ∩ B) = P(B)P(A | B); nối chuỗi cho nhiều giai đoạn.</li><li>Nói chung P(A | B) ≠ P(B | A).</li><li>Xác suất có điều kiện tuân theo mọi quy tắc thông thường.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/3-4-contingency-tables" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 3.4 Bảng liên hợp</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class03-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 3: Xác suất có điều kiện, độc lập và định lý Bayes</a></li><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/04%3A_Conditional_Probability" target="_blank" rel="noopener">Grinstead &amp; Snell — Chương 4: Xác suất có điều kiện</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Từ bảng, tìm P(trượt | không đi ôn) và P(không đi ôn | trượt).</li><li>Rút 3 lá không hoàn lại. P(cả ba là cơ)?</li><li>Hai xúc xắc: P(tổng = 8 | xúc xắc thứ nhất ra 3)?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 40/100 = 0,40; 40/60 ≈ 0,667. 2) (13/52)(12/51)(11/50) = 11/850 ≈ 0,0129. 3) Trong 6 kết quả đồng khả năng có xúc xắc 1 ra 3, chỉ (3,5) thoả ⇒ 1/6.</p></div>`);

const c32 = L('ipy111-ts-3-2',
  '3.2 — The law of total probability and tree diagrams|||3.2 — Công thức xác suất toàn phần và sơ đồ cây',
  'Chia trường hợp theo một phân hoạch: P(A) = ∑ P(A|B_i)P(B_i); sơ đồ cây; ví dụ ba máy sản xuất lỗi, bộ lọc spam với từ “free”.',
  `<span class="eyebrow">IPY111 · Chapter 3 · Lesson 3.2</span>
<h2>The law of total probability and tree diagrams</h2>
<p class="lead">Many probabilities are hard to compute directly but easy once we know “which case we are in”. The law of total probability turns that idea into a formula: split into cases, solve each case, and average.</p>
<h3>🎯 Objectives</h3>
<ul><li>State and apply the law of total probability (LOTP).</li><li>Draw and read a probability tree.</li><li>Choose a good partition to condition on.</li></ul>
<h3>📖 Lecture</h3>
<p>Let B<sub>1</sub>, …, B<sub>n</sub> be a partition of S (disjoint, covering S) with P(B<sub>i</sub>) &gt; 0. Then A is the disjoint union of the pieces A ∩ B<sub>i</sub>, and by the multiplication rule:</p>
<div class="formula"><span class="lbl">Law of total probability</span>P(A) = ∑<sub>i=1</sub><sup>n</sup> P(A | B<sub>i</sub>) P(B<sub>i</sub>) = P(A | B<sub>1</sub>)P(B<sub>1</sub>) + … + P(A | B<sub>n</sub>)P(B<sub>n</sub>)<br>Special case: P(A) = P(A | B)P(B) + P(A | B<sup>c</sup>)P(B<sup>c</sup>)</div>
<p>P(A) is a <strong>weighted average</strong> of the conditional probabilities, with weights P(B<sub>i</sub>). So it always lies between the smallest and the largest P(A | B<sub>i</sub>).</p>
<p>A <strong>tree diagram</strong> draws the same calculation: the first level branches into the cases B<sub>i</sub> with their probabilities; the second level branches into A / A<sup>c</sup> with conditional probabilities. Multiply along a path to get P(B<sub>i</sub> ∩ A); add the paths that end in A to get P(A).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — three machines.</b> A factory makes chips on machines M1, M2, M3, which produce 50%, 30%, 20% of the output, with defect rates 1%, 2%, 3%. A chip is picked at random. P(defective)?</p>
<p>Step 1 (partition): B<sub>1</sub>, B<sub>2</sub>, B<sub>3</sub> = “made by M1, M2, M3”.</p>
<p>Step 2 (paths): 0.50 × 0.01 = 0.005; 0.30 × 0.02 = 0.006; 0.20 × 0.03 = 0.006.</p>
<p>Step 3 (add): P(D) = 0.005 + 0.006 + 0.006 = <b>0.017</b>, i.e. 1.7% — between 1% and 3%, as a weighted average must be.</p></div>
<div class="callout"><p><b>Example 2 — spam filter.</b> 40% of incoming mail is spam. The word “free” appears in 30% of spam and in 2% of normal mail (ham). P(an e-mail contains “free”) = 0.30 × 0.40 + 0.02 × 0.60 = 0.12 + 0.012 = <b>0.132</b>.</p></div>
<div class="callout"><p><b>Example 3 — conditioning on the first step.</b> Draw 2 cards without replacement. P(2nd card is an ace) = P(A2 | A1)P(A1) + P(A2 | A1<sup>c</sup>)P(A1<sup>c</sup>) = (3/51)(4/52) + (4/51)(48/52) = 204/2 652 = <b>1/13</b>. By symmetry every position is equally likely to hold any given card.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Conditioning on events that overlap or do not cover S — the pieces must form a partition.</li><li>Averaging the conditional probabilities without the weights: (1% + 2% + 3%)/3 = 2% is wrong here.</li><li>Forgetting the branch B<sup>c</sup> (e.g. the ham branch in the spam example).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Pick a partition B<sub>1</sub>, …, B<sub>n</sub> that makes each case easy.</li><li>P(A) = ∑ P(A | B<sub>i</sub>)P(B<sub>i</sub>): a weighted average.</li><li>Tree: multiply along paths, add across paths.</li><li>The same tree is reused for Bayes' rule in the next lesson.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/3-5-tree-and-venn-diagrams" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 3.5 Tree and Venn Diagrams</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class03-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 3 (law of total probability, trees)</a></li><li><a href="https://seeing-theory.brown.edu/compound-probability/index.html" target="_blank" rel="noopener">Seeing Theory — Compound Probability: conditional probability</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Urn 1 has 3 red, 2 blue; urn 2 has 1 red, 4 blue. Flip a fair coin to choose an urn, then draw one ball. P(red)?</li><li>In the factory, M3's defect rate is cut to 1%. New P(defective)?</li><li>Explain why P(A) from LOTP can never exceed the largest P(A | B<sub>i</sub>).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 0.5 × 3/5 + 0.5 × 1/5 = 0.4. 2) 0.005 + 0.006 + 0.002 = 0.013. 3) It is a weighted average with non-negative weights summing to 1.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 3 · Bài 3.2</span>
<h2>Công thức xác suất toàn phần và sơ đồ cây</h2>
<p class="lead">Nhiều xác suất khó tính trực tiếp nhưng dễ khi biết “mình đang ở trường hợp nào”. Công thức xác suất toàn phần biến ý đó thành công thức: chia trường hợp, giải từng trường hợp, rồi lấy trung bình.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu và áp dụng công thức xác suất toàn phần.</li><li>Vẽ và đọc sơ đồ cây xác suất.</li><li>Chọn phân hoạch tốt để lấy điều kiện.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Cho B<sub>1</sub>, …, B<sub>n</sub> là một phân hoạch của S (xung khắc, phủ kín S) với P(B<sub>i</sub>) &gt; 0. Khi đó A là hợp xung khắc của các mảnh A ∩ B<sub>i</sub>, và theo quy tắc nhân:</p>
<div class="formula"><span class="lbl">Công thức xác suất toàn phần</span>P(A) = ∑<sub>i=1</sub><sup>n</sup> P(A | B<sub>i</sub>) P(B<sub>i</sub>) = P(A | B<sub>1</sub>)P(B<sub>1</sub>) + … + P(A | B<sub>n</sub>)P(B<sub>n</sub>)<br>Trường hợp riêng: P(A) = P(A | B)P(B) + P(A | B<sup>c</sup>)P(B<sup>c</sup>)</div>
<p>P(A) là <strong>trung bình có trọng số</strong> của các xác suất có điều kiện, trọng số là P(B<sub>i</sub>). Vì vậy nó luôn nằm giữa P(A | B<sub>i</sub>) nhỏ nhất và lớn nhất.</p>
<p><strong>Sơ đồ cây</strong> vẽ cùng phép tính đó: tầng một rẽ nhánh theo các trường hợp B<sub>i</sub> với xác suất của chúng; tầng hai rẽ thành A / A<sup>c</sup> với xác suất có điều kiện. Nhân dọc một nhánh được P(B<sub>i</sub> ∩ A); cộng các nhánh kết thúc ở A được P(A).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — ba máy.</b> Nhà máy làm chip trên các máy M1, M2, M3, chiếm 50%, 30%, 20% sản lượng, tỉ lệ lỗi 1%, 2%, 3%. Lấy ngẫu nhiên một chip. P(lỗi)?</p>
<p>Bước 1 (phân hoạch): B<sub>1</sub>, B<sub>2</sub>, B<sub>3</sub> = “do M1, M2, M3 làm”.</p>
<p>Bước 2 (các nhánh): 0,50 × 0,01 = 0,005; 0,30 × 0,02 = 0,006; 0,20 × 0,03 = 0,006.</p>
<p>Bước 3 (cộng): P(L) = 0,005 + 0,006 + 0,006 = <b>0,017</b>, tức 1,7% — nằm giữa 1% và 3%, đúng như một trung bình có trọng số.</p></div>
<div class="callout"><p><b>Ví dụ 2 — lọc spam.</b> 40% thư đến là spam. Từ “free” xuất hiện trong 30% thư spam và 2% thư thường (ham). P(thư có chữ “free”) = 0,30 × 0,40 + 0,02 × 0,60 = 0,12 + 0,012 = <b>0,132</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — lấy điều kiện theo bước đầu.</b> Rút 2 lá không hoàn lại. P(lá 2 là át) = P(A2 | A1)P(A1) + P(A2 | A1<sup>c</sup>)P(A1<sup>c</sup>) = (3/51)(4/52) + (4/51)(48/52) = 204/2 652 = <b>1/13</b>. Theo tính đối xứng, mọi vị trí đều có khả năng như nhau chứa một lá bài cho trước.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Lấy điều kiện theo các biến cố giao nhau hoặc không phủ kín S — các mảnh phải là phân hoạch.</li><li>Lấy trung bình cộng các xác suất có điều kiện mà bỏ trọng số: (1% + 2% + 3%)/3 = 2% là sai ở đây.</li><li>Quên nhánh B<sup>c</sup> (ví dụ nhánh thư thường trong bài spam).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Chọn phân hoạch B<sub>1</sub>, …, B<sub>n</sub> sao cho mỗi trường hợp dễ tính.</li><li>P(A) = ∑ P(A | B<sub>i</sub>)P(B<sub>i</sub>): trung bình có trọng số.</li><li>Sơ đồ cây: nhân dọc nhánh, cộng giữa các nhánh.</li><li>Cùng cây này được dùng lại cho quy tắc Bayes ở bài sau.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/3-5-tree-and-venn-diagrams" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 3.5 Sơ đồ cây và biểu đồ Venn</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class03-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 3 (xác suất toàn phần, sơ đồ cây)</a></li><li><a href="https://seeing-theory.brown.edu/compound-probability/index.html" target="_blank" rel="noopener">Seeing Theory — Xác suất phức hợp: xác suất có điều kiện</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Bình 1 có 3 đỏ, 2 xanh; bình 2 có 1 đỏ, 4 xanh. Tung đồng xu cân đối chọn bình, rồi rút một bi. P(đỏ)?</li><li>Ở nhà máy, tỉ lệ lỗi của M3 giảm còn 1%. P(lỗi) mới?</li><li>Giải thích vì sao P(A) theo công thức toàn phần không bao giờ vượt P(A | B<sub>i</sub>) lớn nhất.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 0,5 × 3/5 + 0,5 × 1/5 = 0,4. 2) 0,005 + 0,006 + 0,002 = 0,013. 3) Nó là trung bình có trọng số không âm, tổng trọng số bằng 1.</p></div>`);

const c33 = L('ipy111-ts-3-3',
  "3.3 — Bayes' rule: updating beliefs with evidence|||3.3 — Quy tắc Bayes: cập nhật niềm tin theo bằng chứng",
  'Quy tắc Bayes P(B|A) = P(A|B)P(B)/P(A); tiên nghiệm – hợp lý – hậu nghiệm; xét nghiệm y khoa dương tính giả (8,8%), xét nghiệm lần hai, lọc spam, dạng tỉ số odds.',
  `<span class="eyebrow">IPY111 · Chapter 3 · Lesson 3.3</span>
<h2>Bayes' rule: updating beliefs with evidence</h2>
<p class="lead">We usually know how likely the evidence is <em>given</em> the cause (a test's accuracy), but we want the reverse: how likely the cause is given the evidence. Bayes' rule flips the conditioning.</p>
<h3>🎯 Objectives</h3>
<ul><li>Derive and apply Bayes' rule with the law of total probability in the denominator.</li><li>Use the vocabulary prior, likelihood, posterior.</li><li>Understand why rare conditions produce many false positives.</li></ul>
<h3>📖 Lecture</h3>
<p>From the multiplication rule, P(B ∩ A) = P(B)P(A | B) = P(A)P(B | A). Divide by P(A):</p>
<div class="formula"><span class="lbl">Bayes' rule</span>P(B | A) = P(A | B) · P(B) / P(A),  with P(A) = ∑<sub>j</sub> P(A | B<sub>j</sub>) P(B<sub>j</sub>)<br>posterior = likelihood × prior / evidence</div>
<ul>
<li><strong>Prior</strong> P(B): belief before seeing the evidence (e.g. disease prevalence).</li>
<li><strong>Likelihood</strong> P(A | B): how probable the evidence is if B is true (e.g. test sensitivity).</li>
<li><strong>Posterior</strong> P(B | A): updated belief after seeing A.</li>
</ul>
<div class="formula"><span class="lbl">Odds form</span>P(B | A) / P(B<sup>c</sup> | A) = [P(B) / P(B<sup>c</sup>)] × [P(A | B) / P(A | B<sup>c</sup>)]   (posterior odds = prior odds × likelihood ratio)</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — medical test.</b> A disease affects 1% of a population. A test has sensitivity P(+ | D) = 0.95 and specificity P(− | D<sup>c</sup>) = 0.90, so false-positive rate P(+ | D<sup>c</sup>) = 0.10. You test positive. P(D | +)?</p>
<p>Step 1 (numerator): P(+ | D)P(D) = 0.95 × 0.01 = 0.0095.</p>
<p>Step 2 (evidence, LOTP): P(+) = 0.0095 + 0.10 × 0.99 = 0.0095 + 0.099 = 0.1085.</p>
<p>Step 3: P(D | +) = 0.0095 / 0.1085 ≈ <b>0.0876</b>. Fewer than 9% of positives are sick! Among 1 000 people: 10 sick (≈ 9.5 test positive) and 990 healthy (99 false positives).</p>
<p>Step 4 (a second, independent test is also positive): use 0.0876 as the new prior: 0.95 × 0.0876 / (0.95 × 0.0876 + 0.10 × 0.9124) ≈ <b>0.477</b>.</p></div>
<div class="callout"><p><b>Example 2 — machine of origin.</b> In Lesson 3.2, a chip is defective. Which machine made it? P(M3 | D) = 0.006 / 0.017 ≈ <b>0.353</b>, P(M2 | D) ≈ 0.353, P(M1 | D) ≈ 0.294. M1 makes half the chips but only 29% of the defects.</p></div>
<div class="callout"><p><b>Example 3 — spam filter.</b> With the numbers of Lesson 3.2, P(spam | “free”) = 0.12 / 0.132 ≈ <b>0.909</b>. Odds form: prior odds 0.4/0.6 = 2/3, likelihood ratio 0.30/0.02 = 15, posterior odds 10, i.e. probability 10/11 ≈ 0.909 ✓. A Naive Bayes spam filter multiplies such likelihood ratios over many words.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li><strong>Base-rate neglect:</strong> answering 95% for P(D | +) by ignoring the 1% prior.</li><li>Forgetting the false-positive branch in the denominator.</li><li>Re-using the original prior after a second test instead of the updated posterior.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>P(B | A) = P(A | B)P(B) / P(A); compute P(A) with LOTP.</li><li>Posterior ∝ likelihood × prior.</li><li>Rare condition + imperfect test ⇒ most positives are false.</li><li>Sequential evidence: yesterday's posterior is today's prior.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/bayes-theorem" target="_blank" rel="noopener">3Blue1Brown — Bayes' theorem, the geometry of changing beliefs</a></li><li><a href="https://www.3blue1brown.com/lessons/bayes-theorem-quick" target="_blank" rel="noopener">3Blue1Brown — The quick proof of Bayes' theorem</a></li><li><a href="https://seeing-theory.brown.edu/bayesian-inference/index.html" target="_blank" rel="noopener">Seeing Theory — Bayesian Inference (interactive)</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class03-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 3: Bayes' theorem and the base rate fallacy</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Recompute P(D | +) if the prevalence is 10% instead of 1%.</li><li>In Example 1, what is P(D | −)?</li><li>A fraud detector flags 2% of honest and 90% of fraudulent transactions; 0.5% of transactions are fraud. P(fraud | flagged)?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 0.095 / (0.095 + 0.09) ≈ 0.514. 2) 0.05 × 0.01 / (0.05 × 0.01 + 0.90 × 0.99) ≈ 0.00056. 3) 0.9 × 0.005 / (0.0045 + 0.02 × 0.995) = 0.0045 / 0.0244 ≈ 0.184.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 3 · Bài 3.3</span>
<h2>Quy tắc Bayes: cập nhật niềm tin theo bằng chứng</h2>
<p class="lead">Ta thường biết bằng chứng có khả năng thế nào <em>khi biết</em> nguyên nhân (độ chính xác của xét nghiệm), nhưng lại muốn chiều ngược: nguyên nhân có khả năng thế nào khi đã thấy bằng chứng. Quy tắc Bayes lật chiều điều kiện.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Suy ra và áp dụng quy tắc Bayes với mẫu số là xác suất toàn phần.</li><li>Dùng đúng thuật ngữ tiên nghiệm, hợp lý, hậu nghiệm.</li><li>Hiểu vì sao bệnh hiếm sinh ra nhiều dương tính giả.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Từ quy tắc nhân, P(B ∩ A) = P(B)P(A | B) = P(A)P(B | A). Chia cho P(A):</p>
<div class="formula"><span class="lbl">Quy tắc Bayes</span>P(B | A) = P(A | B) · P(B) / P(A),  với P(A) = ∑<sub>j</sub> P(A | B<sub>j</sub>) P(B<sub>j</sub>)<br>hậu nghiệm = hợp lý × tiên nghiệm / bằng chứng</div>
<ul>
<li><strong>Tiên nghiệm</strong> P(B): niềm tin trước khi thấy bằng chứng (ví dụ tỉ lệ mắc bệnh).</li>
<li><strong>Hợp lý</strong> (likelihood) P(A | B): bằng chứng có khả năng thế nào nếu B đúng (ví dụ độ nhạy xét nghiệm).</li>
<li><strong>Hậu nghiệm</strong> P(B | A): niềm tin đã cập nhật sau khi thấy A.</li>
</ul>
<div class="formula"><span class="lbl">Dạng tỉ số (odds)</span>P(B | A) / P(B<sup>c</sup> | A) = [P(B) / P(B<sup>c</sup>)] × [P(A | B) / P(A | B<sup>c</sup>)]   (odds hậu nghiệm = odds tiên nghiệm × tỉ số hợp lý)</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — xét nghiệm y khoa.</b> Một bệnh có tỉ lệ mắc 1% dân số. Xét nghiệm có độ nhạy P(+ | B) = 0,95 và độ đặc hiệu P(− | B<sup>c</sup>) = 0,90, nên tỉ lệ dương tính giả P(+ | B<sup>c</sup>) = 0,10. Bạn dương tính. P(B | +)?</p>
<p>Bước 1 (tử số): P(+ | B)P(B) = 0,95 × 0,01 = 0,0095.</p>
<p>Bước 2 (bằng chứng, xác suất toàn phần): P(+) = 0,0095 + 0,10 × 0,99 = 0,0095 + 0,099 = 0,1085.</p>
<p>Bước 3: P(B | +) = 0,0095 / 0,1085 ≈ <b>0,0876</b>. Chưa đến 9% người dương tính thật sự mắc bệnh! Trong 1 000 người: 10 người bệnh (≈ 9,5 dương tính) và 990 người khoẻ (99 dương tính giả).</p>
<p>Bước 4 (xét nghiệm lần hai độc lập cũng dương tính): dùng 0,0876 làm tiên nghiệm mới: 0,95 × 0,0876 / (0,95 × 0,0876 + 0,10 × 0,9124) ≈ <b>0,477</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — chip do máy nào làm.</b> Ở Bài 3.2, một chip bị lỗi. Máy nào làm ra nó? P(M3 | L) = 0,006 / 0,017 ≈ <b>0,353</b>, P(M2 | L) ≈ 0,353, P(M1 | L) ≈ 0,294. M1 làm một nửa số chip nhưng chỉ gây 29% số lỗi.</p></div>
<div class="callout"><p><b>Ví dụ 3 — lọc spam.</b> Với số liệu Bài 3.2, P(spam | “free”) = 0,12 / 0,132 ≈ <b>0,909</b>. Dạng odds: odds tiên nghiệm 0,4/0,6 = 2/3, tỉ số hợp lý 0,30/0,02 = 15, odds hậu nghiệm 10, tức xác suất 10/11 ≈ 0,909 ✓. Bộ lọc spam Naive Bayes nhân các tỉ số hợp lý như vậy trên rất nhiều từ.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li><strong>Bỏ qua tỉ lệ nền:</strong> trả lời 95% cho P(B | +) vì quên tiên nghiệm 1%.</li><li>Quên nhánh dương tính giả ở mẫu số.</li><li>Dùng lại tiên nghiệm ban đầu cho xét nghiệm thứ hai thay vì hậu nghiệm đã cập nhật.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>P(B | A) = P(A | B)P(B) / P(A); tính P(A) bằng xác suất toàn phần.</li><li>Hậu nghiệm ∝ hợp lý × tiên nghiệm.</li><li>Bệnh hiếm + xét nghiệm không hoàn hảo ⇒ phần lớn dương tính là giả.</li><li>Bằng chứng nối tiếp: hậu nghiệm hôm qua là tiên nghiệm hôm nay.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/bayes-theorem" target="_blank" rel="noopener">3Blue1Brown — Định lý Bayes, hình học của việc thay đổi niềm tin</a></li><li><a href="https://www.3blue1brown.com/lessons/bayes-theorem-quick" target="_blank" rel="noopener">3Blue1Brown — Chứng minh nhanh định lý Bayes</a></li><li><a href="https://seeing-theory.brown.edu/bayesian-inference/index.html" target="_blank" rel="noopener">Seeing Theory — Suy luận Bayes (tương tác)</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class03-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 3: định lý Bayes và ngộ nhận tỉ lệ nền</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tính lại P(B | +) nếu tỉ lệ mắc là 10% thay vì 1%.</li><li>Ở Ví dụ 1, P(B | −) bằng bao nhiêu?</li><li>Bộ phát hiện gian lận gắn cờ 2% giao dịch trung thực và 90% giao dịch gian lận; 0,5% giao dịch là gian lận. P(gian lận | bị gắn cờ)?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 0,095 / (0,095 + 0,09) ≈ 0,514. 2) 0,05 × 0,01 / (0,05 × 0,01 + 0,90 × 0,99) ≈ 0,00056. 3) 0,9 × 0,005 / (0,0045 + 0,02 × 0,995) = 0,0045 / 0,0244 ≈ 0,184.</p></div>`);

const c34 = L('ipy111-ts-3-4',
  '3.4 — Classic traps: Monty Hall, the prosecutor’s fallacy, Simpson’s paradox|||3.4 — Bẫy kinh điển: Monty Hall, ngộ nhận công tố viên, nghịch lý Simpson',
  'Bài toán Monty Hall (đổi cửa thắng 2/3) giải bằng xác suất toàn phần và mô phỏng Python chạy thật; ngộ nhận P(A|B) = P(B|A); nghịch lý Simpson.',
  `<span class="eyebrow">IPY111 · Chapter 3 · Lesson 3.4</span>
<h2>Classic traps: Monty Hall, the prosecutor's fallacy, Simpson's paradox</h2>
<p class="lead">Conditional probability is where intuition fails most often. Three famous traps — and the habits that protect you from them.</p>
<h3>🎯 Objectives</h3>
<ul><li>Solve the Monty Hall problem by conditioning and by simulation.</li><li>Recognise the prosecutor's fallacy (confusing P(A | B) and P(B | A)).</li><li>Explain Simpson's paradox with a two-group table.</li></ul>
<h3>📖 Lecture &amp; worked examples</h3>
<div class="callout"><p><b>1 — Monty Hall.</b> A car is behind one of 3 doors, goats behind the others. You pick door 1. The host, <em>who knows</em> where the car is, always opens another door showing a goat, and offers a switch. Should you switch?</p>
<p>Condition on where the car is (LOTP). If the car is behind door 1 (probability 1/3), switching loses. If it is behind door 2 or 3 (probability 2/3), the host must open the other goat door, and switching wins. So P(win by switching) = <b>2/3</b>, P(win by staying) = 1/3. The host's action carries information because he is not allowed to reveal the car.</p></div>
<pre><code class="language-python">import random
random.seed(2026)

def play(switch):
    doors = [0, 1, 2]
    car = random.choice(doors)
    pick = random.choice(doors)
    # host opens a goat door that is not the player's pick
    opened = random.choice([d for d in doors if d != pick and d != car])
    if switch:
        pick = next(d for d in doors if d != pick and d != opened)
    return pick == car

n = 100_000
print("stay  :", sum(play(False) for _ in range(n)) / n)
print("switch:", sum(play(True) for _ in range(n)) / n)
</code></pre>
<div class="out">stay  : 0.33195
switch: 0.6668</div>
<div class="callout"><p><b>2 — The prosecutor's fallacy.</b> A DNA profile matches 1 person in 1 000 000 at random. A suspect from a city of 3 000 000 matches. “The chance of a random match is 1 in a million, so the suspect is guilty with probability 99.9999%” is wrong: that confuses P(match | innocent) with P(innocent | match). In a city of 3 million we expect about 3 innocent people to match, so without other evidence P(guilty | match) is only about 1/4.</p></div>
<div class="callout"><p><b>3 — Simpson's paradox.</b> Two support teams resolve tickets:</p>
<div class="kv-grid"><div class="kv"><span class="k">Team A</span><span class="v">easy 81/87 (93%) · hard 192/263 (73%) · total 273/350 (78%)</span></div><div class="kv"><span class="k">Team B</span><span class="v">easy 234/270 (87%) · hard 55/80 (69%) · total 289/350 (83%)</span></div></div>
<p>Team A is better on easy tickets <em>and</em> on hard tickets, yet worse overall — because A received mostly hard tickets. The overall rate is a weighted average (LOTP) and the weights differ. Always ask which variable you should condition on.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Monty Hall: assuming that two closed doors must be 50/50 — they would be only if the host opened a door at random.</li><li>Reporting P(evidence | innocent) as if it were P(innocent | evidence).</li><li>Comparing aggregated rates across groups with very different mixes.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Write down exactly what is known and how it was obtained (the host's rule matters).</li><li>P(A | B) and P(B | A) can be wildly different; use Bayes' rule.</li><li>Aggregated data can reverse a trend present in every subgroup.</li><li>When in doubt, simulate.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/04%3A_Conditional_Probability" target="_blank" rel="noopener">Grinstead &amp; Snell — Chapter 4 (Monty Hall and paradoxes)</a></li><li><a href="https://www.youtube.com/playlist?list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo" target="_blank" rel="noopener">Harvard Stat 110 — Lectures 5–6: conditioning, Monty Hall, Simpson's paradox</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class03-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 3 (Monty Hall and base rates)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Monty Hall with 10 doors: you pick one, the host opens 8 goat doors. P(win by switching)?</li><li>In the DNA example, how many innocent matches would you expect in a city of 500 000?</li><li>In the Simpson table, what fraction of Team A's tickets were hard? Of Team B's?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 9/10. 2) 0.5 — then P(guilty | match) ≈ 1/1.5 ≈ 2/3 if the guilty person is in the city. 3) A: 263/350 ≈ 75%; B: 80/350 ≈ 23%.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 3 · Bài 3.4</span>
<h2>Bẫy kinh điển: Monty Hall, ngộ nhận công tố viên, nghịch lý Simpson</h2>
<p class="lead">Xác suất có điều kiện là chỗ trực giác sai nhiều nhất. Ba cái bẫy nổi tiếng — và những thói quen bảo vệ bạn khỏi chúng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải bài toán Monty Hall bằng lấy điều kiện và bằng mô phỏng.</li><li>Nhận ra ngộ nhận công tố viên (nhầm P(A | B) với P(B | A)).</li><li>Giải thích nghịch lý Simpson bằng bảng hai nhóm.</li></ul>
<h3>📖 Bài giảng &amp; ví dụ</h3>
<div class="callout"><p><b>1 — Monty Hall.</b> Một chiếc xe ở sau một trong 3 cửa, sau hai cửa kia là dê. Bạn chọn cửa 1. Người dẫn chương trình, <em>người biết</em> xe ở đâu, luôn mở một cửa khác có dê, rồi mời bạn đổi. Có nên đổi không?</p>
<p>Lấy điều kiện theo vị trí xe (xác suất toàn phần). Nếu xe ở cửa 1 (xác suất 1/3), đổi thì thua. Nếu xe ở cửa 2 hoặc 3 (xác suất 2/3), người dẫn buộc phải mở cửa dê còn lại, và đổi thì thắng. Vậy P(thắng khi đổi) = <b>2/3</b>, P(thắng khi giữ) = 1/3. Hành động của người dẫn mang thông tin vì anh ta không được phép mở trúng xe.</p></div>
<pre><code class="language-python">import random
random.seed(2026)

def play(switch):
    doors = [0, 1, 2]
    car = random.choice(doors)
    pick = random.choice(doors)
    # host opens a goat door that is not the player's pick
    opened = random.choice([d for d in doors if d != pick and d != car])
    if switch:
        pick = next(d for d in doors if d != pick and d != opened)
    return pick == car

n = 100_000
print("stay  :", sum(play(False) for _ in range(n)) / n)
print("switch:", sum(play(True) for _ in range(n)) / n)
</code></pre>
<div class="out">stay  : 0.33195
switch: 0.6668</div>
<div class="callout"><p><b>2 — Ngộ nhận công tố viên.</b> Một hồ sơ ADN khớp ngẫu nhiên với 1 trên 1 000 000 người. Một nghi phạm ở thành phố 3 000 000 dân khớp. Câu “khả năng khớp ngẫu nhiên là 1 phần triệu, nên nghi phạm có tội với xác suất 99,9999%” là sai: nó nhầm P(khớp | vô tội) với P(vô tội | khớp). Ở thành phố 3 triệu dân ta kỳ vọng khoảng 3 người vô tội cũng khớp, nên nếu không có bằng chứng khác thì P(có tội | khớp) chỉ khoảng 1/4.</p></div>
<div class="callout"><p><b>3 — Nghịch lý Simpson.</b> Hai đội hỗ trợ xử lý ticket:</p>
<div class="kv-grid"><div class="kv"><span class="k">Đội A</span><span class="v">dễ 81/87 (93%) · khó 192/263 (73%) · tổng 273/350 (78%)</span></div><div class="kv"><span class="k">Đội B</span><span class="v">dễ 234/270 (87%) · khó 55/80 (69%) · tổng 289/350 (83%)</span></div></div>
<p>Đội A giỏi hơn ở ticket dễ <em>và</em> ở ticket khó, nhưng tổng thể lại kém hơn — vì A nhận phần lớn ticket khó. Tỉ lệ tổng là trung bình có trọng số (xác suất toàn phần) và trọng số khác nhau. Luôn hỏi: nên lấy điều kiện theo biến nào?</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Monty Hall: cho rằng hai cửa còn đóng phải là 50/50 — chỉ đúng nếu người dẫn mở cửa ngẫu nhiên.</li><li>Báo cáo P(bằng chứng | vô tội) như thể nó là P(vô tội | bằng chứng).</li><li>So sánh tỉ lệ gộp giữa các nhóm có thành phần rất khác nhau.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Ghi chính xác điều đã biết và nó được biết bằng cách nào (luật của người dẫn rất quan trọng).</li><li>P(A | B) và P(B | A) có thể khác xa nhau; dùng quy tắc Bayes.</li><li>Dữ liệu gộp có thể đảo ngược xu hướng có ở mọi nhóm con.</li><li>Khi nghi ngờ, hãy mô phỏng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/04%3A_Conditional_Probability" target="_blank" rel="noopener">Grinstead &amp; Snell — Chương 4 (Monty Hall và các nghịch lý)</a></li><li><a href="https://www.youtube.com/playlist?list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo" target="_blank" rel="noopener">Harvard Stat 110 — Bài giảng 5–6: lấy điều kiện, Monty Hall, nghịch lý Simpson</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class03-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 3 (Monty Hall và tỉ lệ nền)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Monty Hall với 10 cửa: bạn chọn một, người dẫn mở 8 cửa dê. P(thắng khi đổi)?</li><li>Ở ví dụ ADN, thành phố 500 000 dân thì kỳ vọng có bao nhiêu người vô tội khớp?</li><li>Trong bảng Simpson, bao nhiêu phần ticket của đội A là khó? Của đội B?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 9/10. 2) 0,5 — khi đó P(có tội | khớp) ≈ 1/1,5 ≈ 2/3 nếu thủ phạm ở trong thành phố. 3) A: 263/350 ≈ 75%; B: 80/350 ≈ 23%.</p></div>`);

const q3 = QZ(3, "Quiz — Chapter 3: Conditional probability and Bayes' rule|||Quiz — Chương 3: Xác suất có điều kiện và quy tắc Bayes", 'Kiểm tra chương 3: định nghĩa P(A|B), quy tắc nhân, xác suất toàn phần, Bayes, tỉ lệ nền, Monty Hall, Simpson.', [
  Q('q1', "P(A ∩ B) = 0.12 and P(B) = 0.4. P(A | B) =|||P(A ∩ B) = 0,12 và P(B) = 0,4. P(A | B) =",
    ['0.048|||0,048', '0.3|||0,3', '0.52|||0,52', '0.28|||0,28'], 1,
    "0.12 / 0.4 = 0.3.|||0,12 / 0,4 = 0,3."),
  Q('q2', "Two cards drawn without replacement. P(both aces) =|||Rút 2 lá không hoàn lại. P(cả hai là át) =",
    ['1/169|||1/169', '1/221|||1/221', '1/26|||1/26', '2/13|||2/13'], 1,
    "(4/52)(3/51) = 1/221.|||(4/52)(3/51) = 1/221."),
  Q('q3', "Two children; at least one is a girl. P(both girls) =|||Hai con; có ít nhất một gái. P(cả hai là gái) =",
    ['1/2|||1/2', '1/3|||1/3', '1/4|||1/4', '2/3|||2/3'], 1,
    "Condition on {BG, GB, GG}: 1 of 3 equally likely outcomes.|||Điều kiện {TG, GT, GG}: 1 trong 3 kết quả đồng khả năng."),
  Q('q4', "Machines produce 50%, 30%, 20% with defect rates 1%, 2%, 3%. P(defective) =|||Ba máy sản xuất 50%, 30%, 20% với tỉ lệ lỗi 1%, 2%, 3%. P(lỗi) =",
    ['0.02|||0,02', '0.017|||0,017', '0.06|||0,06', '0.006|||0,006'], 1,
    "0.005 + 0.006 + 0.006 = 0.017.|||0,005 + 0,006 + 0,006 = 0,017."),
  Q('q5', "Same factory: P(made by M3 | defective) ≈|||Cùng nhà máy: P(do M3 làm | lỗi) ≈",
    ['0.20|||0,20', '0.03|||0,03', '0.353|||0,353', '0.5|||0,5'], 2,
    "0.006 / 0.017 ≈ 0.353.|||0,006 / 0,017 ≈ 0,353."),
  Q('q6', "Prevalence 1%, sensitivity 95%, false-positive rate 10%. P(disease | positive) ≈|||Tỉ lệ mắc 1%, độ nhạy 95%, dương tính giả 10%. P(bệnh | dương tính) ≈",
    ['0.95|||0,95', '0.0876|||0,0876', '0.5|||0,5', '0.01|||0,01'], 1,
    "0.0095 / (0.0095 + 0.099) ≈ 0.0876 — base rate matters.|||0,0095 / (0,0095 + 0,099) ≈ 0,0876 — tỉ lệ nền rất quan trọng."),
  Q('q7', "In odds form, posterior odds equal|||Ở dạng odds, odds hậu nghiệm bằng",
    ['prior odds + likelihood ratio|||odds tiên nghiệm + tỉ số hợp lý', 'prior odds × likelihood ratio|||odds tiên nghiệm × tỉ số hợp lý', 'likelihood ratio only|||chỉ tỉ số hợp lý', 'prior odds / likelihood ratio|||odds tiên nghiệm / tỉ số hợp lý'], 1,
    "P(B|A)/P(B^c|A) = [P(B)/P(B^c)] · [P(A|B)/P(A|B^c)].|||P(B|A)/P(B^c|A) = [P(B)/P(B^c)] · [P(A|B)/P(A|B^c)]."),
  Q('q8', "Monty Hall (3 doors, host knows and always shows a goat): P(win if you switch) =|||Monty Hall (3 cửa, người dẫn biết và luôn mở cửa dê): P(thắng khi đổi) =",
    ['1/3|||1/3', '1/2|||1/2', '2/3|||2/3', '1|||1'], 2,
    "You win by switching exactly when your first pick was a goat: 2/3.|||Đổi thì thắng đúng khi lựa chọn đầu là dê: 2/3."),
  Q('q9', "The prosecutor's fallacy confuses|||Ngộ nhận công tố viên nhầm lẫn",
    ['P(A) with P(A^c)|||P(A) với P(A^c)', 'P(evidence | innocent) with P(innocent | evidence)|||P(bằng chứng | vô tội) với P(vô tội | bằng chứng)', 'independence with disjointness|||độc lập với xung khắc', 'mean with median|||kỳ vọng với trung vị'], 1,
    "Reversing the conditioning ignores the prior.|||Đảo chiều điều kiện là bỏ qua tiên nghiệm."),
  Q('q10', "Simpson's paradox happens because the overall rate is|||Nghịch lý Simpson xảy ra vì tỉ lệ tổng là",
    ['a weighted average with different group weights|||trung bình có trọng số với trọng số nhóm khác nhau', 'always the larger subgroup rate|||luôn bằng tỉ lệ nhóm lớn hơn', 'a product of subgroup rates|||tích các tỉ lệ nhóm', 'independent of group sizes|||không phụ thuộc cỡ nhóm'], 0,
    "By the law of total probability the total rate weights the subgroup rates by group mix.|||Theo xác suất toàn phần, tỉ lệ tổng lấy trọng số theo thành phần nhóm."),
]);

const ch3 = {
  title: "Chapter 3 — Conditional probability and Bayes' rule|||Chương 3 — Xác suất có điều kiện và quy tắc Bayes",
  description: 'P(A|B), quy tắc nhân, xác suất toàn phần và sơ đồ cây, quy tắc Bayes (xét nghiệm, spam), bẫy Monty Hall – công tố viên – Simpson có mô phỏng Python (Blitzstein & Hwang ch.2 · Ross ch.3).',
  lessons: [c31, c32, c33, c34, q3],
};

// ───────────────────────────── Chương 4 — Độc lập ─────────────────────────────
const c41 = L('ipy111-ts-4-1',
  '4.1 — Independent events: definition, examples and pairwise vs mutual|||4.1 — Biến cố độc lập: định nghĩa, ví dụ, độc lập từng đôi và độc lập toàn phần',
  'Định nghĩa độc lập P(A∩B) = P(A)P(B), độc lập ≠ xung khắc, phần bù của biến cố độc lập, ví dụ xúc xắc; độc lập từng đôi nhưng không độc lập toàn phần.',
  `<span class="eyebrow">IPY111 · Chapter 4 · Lesson 4.1</span>
<h2>Independent events</h2>
<p class="lead">Two events are independent when learning that one happened does not change the probability of the other. Independence is what makes most real calculations possible — and wrongly assuming it is one of the most expensive mistakes in practice.</p>
<h3>🎯 Objectives</h3>
<ul><li>Test events for independence with the product rule.</li><li>Distinguish independent from disjoint.</li><li>Know the difference between pairwise and mutual independence.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Independence of two events</span>A and B are independent ⇔ P(A ∩ B) = P(A) · P(B)<br>(if P(B) &gt; 0, equivalently P(A | B) = P(A))</div>
<p>If A and B are independent, so are A and B<sup>c</sup>, A<sup>c</sup> and B, A<sup>c</sup> and B<sup>c</sup>: e.g. P(A ∩ B<sup>c</sup>) = P(A) − P(A)P(B) = P(A)P(B<sup>c</sup>).</p>
<p><strong>Independent ≠ disjoint.</strong> If A and B are disjoint and both have positive probability, then P(A ∩ B) = 0 ≠ P(A)P(B): knowing A happened tells you B did <em>not</em> — the strongest possible dependence.</p>
<div class="formula"><span class="lbl">Mutual independence of A, B, C</span>P(A ∩ B) = P(A)P(B), P(A ∩ C) = P(A)P(C), P(B ∩ C) = P(B)P(C) <em>and</em> P(A ∩ B ∩ C) = P(A)P(B)P(C)</div>
<p>For n events, the product rule must hold for <em>every</em> sub-collection. Pairwise independence alone is not enough.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — dice.</b> Let A = “first die is 6”, B = “sum is 7”. P(A) = 1/6, P(B) = 1/6, P(A ∩ B) = P({(6,1)}) = 1/36 = P(A)P(B) ⇒ <b>independent</b>. Surprising but true: whatever the first die shows, exactly one value of the second die makes 7.</p>
<p>Now C = “sum is 12”: P(A ∩ C) = 1/36 but P(A)P(C) = (1/6)(1/36) = 1/216 ⇒ <b>dependent</b> (a sum of 12 forces a 6).</p></div>
<div class="callout"><p><b>Example 2 — pairwise but not mutually independent.</b> Toss two fair coins. A = “1st is H”, B = “2nd is H”, C = “both tosses agree”. Each has probability 1/2. A ∩ B = A ∩ C = B ∩ C = {HH}, probability 1/4 = (1/2)(1/2): pairwise independent. But P(A ∩ B ∩ C) = 1/4 ≠ 1/8: any two of the events determine the third, so they are not mutually independent.</p></div>
<div class="callout"><p><b>Example 3 — from data.</b> In the two-way table of Lesson 3.1, P(pass) = 0.70 but P(pass | attended) = 0.80, so passing and attending are <b>not</b> independent.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Calling disjoint events “independent”.</li><li>Assuming independence because events “seem unrelated” — failures of servers in the same data centre, or of loans in the same economy, are positively dependent (2008 financial crisis).</li><li>Checking only pairs when three or more events must be mutually independent.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Independent: P(A ∩ B) = P(A)P(B), i.e. P(A | B) = P(A).</li><li>Complements of independent events are independent.</li><li>Disjoint events with positive probability are dependent.</li><li>Mutual independence requires the product rule for every sub-collection.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 3.2 Independent and Mutually Exclusive Events</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class03-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 3 (independence)</a></li><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/04%3A_Conditional_Probability" target="_blank" rel="noopener">Grinstead &amp; Snell — Chapter 4 (independent events)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>P(A) = 0.3, P(B) = 0.5, A and B independent. Find P(A ∪ B).</li><li>Two dice: are “first die is even” and “sum is even” independent?</li><li>Can an event be independent of itself? When?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 0.3 + 0.5 − 0.15 = 0.65. 2) P(both) = 9/36 = 1/4 = (1/2)(1/2): yes. 3) P(A) = P(A)<sup>2</sup> ⇔ P(A) = 0 or 1.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 4 · Bài 4.1</span>
<h2>Biến cố độc lập</h2>
<p class="lead">Hai biến cố độc lập khi biết một cái đã xảy ra không làm thay đổi xác suất của cái kia. Độc lập giúp phần lớn phép tính thực tế làm được — và giả định độc lập sai là một trong những lỗi tốn kém nhất trong thực tế.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Kiểm tính độc lập bằng quy tắc tích.</li><li>Phân biệt độc lập với xung khắc.</li><li>Biết khác biệt giữa độc lập từng đôi và độc lập toàn phần.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Hai biến cố độc lập</span>A và B độc lập ⇔ P(A ∩ B) = P(A) · P(B)<br>(nếu P(B) &gt; 0, tương đương P(A | B) = P(A))</div>
<p>Nếu A và B độc lập thì A và B<sup>c</sup>, A<sup>c</sup> và B, A<sup>c</sup> và B<sup>c</sup> cũng độc lập: ví dụ P(A ∩ B<sup>c</sup>) = P(A) − P(A)P(B) = P(A)P(B<sup>c</sup>).</p>
<p><strong>Độc lập ≠ xung khắc.</strong> Nếu A và B xung khắc và cùng có xác suất dương thì P(A ∩ B) = 0 ≠ P(A)P(B): biết A xảy ra cho biết B <em>không</em> xảy ra — phụ thuộc mạnh nhất có thể.</p>
<div class="formula"><span class="lbl">A, B, C độc lập toàn phần</span>P(A ∩ B) = P(A)P(B), P(A ∩ C) = P(A)P(C), P(B ∩ C) = P(B)P(C) <em>và</em> P(A ∩ B ∩ C) = P(A)P(B)P(C)</div>
<p>Với n biến cố, quy tắc tích phải đúng cho <em>mọi</em> nhóm con. Chỉ độc lập từng đôi là chưa đủ.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — xúc xắc.</b> Đặt A = “xúc xắc 1 ra 6”, B = “tổng bằng 7”. P(A) = 1/6, P(B) = 1/6, P(A ∩ B) = P({(6,1)}) = 1/36 = P(A)P(B) ⇒ <b>độc lập</b>. Bất ngờ nhưng đúng: xúc xắc 1 ra gì thì cũng có đúng một giá trị của xúc xắc 2 cho tổng 7.</p>
<p>Còn C = “tổng bằng 12”: P(A ∩ C) = 1/36 nhưng P(A)P(C) = (1/6)(1/36) = 1/216 ⇒ <b>phụ thuộc</b> (tổng 12 buộc phải có mặt 6).</p></div>
<div class="callout"><p><b>Ví dụ 2 — độc lập từng đôi nhưng không toàn phần.</b> Tung hai đồng xu cân đối. A = “lần 1 ra H”, B = “lần 2 ra H”, C = “hai lần giống nhau”. Mỗi biến cố có xác suất 1/2. A ∩ B = A ∩ C = B ∩ C = {HH}, xác suất 1/4 = (1/2)(1/2): độc lập từng đôi. Nhưng P(A ∩ B ∩ C) = 1/4 ≠ 1/8: biết hai biến cố là suy ra biến cố thứ ba, nên không độc lập toàn phần.</p></div>
<div class="callout"><p><b>Ví dụ 3 — từ dữ liệu.</b> Ở bảng hai chiều Bài 3.1, P(qua) = 0,70 nhưng P(qua | có đi ôn) = 0,80, nên qua môn và đi ôn <b>không</b> độc lập.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Gọi biến cố xung khắc là “độc lập”.</li><li>Giả định độc lập vì các biến cố “có vẻ không liên quan” — server hỏng trong cùng một trung tâm dữ liệu, hay khoản vay vỡ nợ trong cùng một nền kinh tế, phụ thuộc dương với nhau (khủng hoảng tài chính 2008).</li><li>Chỉ kiểm từng cặp khi ba biến cố trở lên cần độc lập toàn phần.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Độc lập: P(A ∩ B) = P(A)P(B), tức P(A | B) = P(A).</li><li>Phần bù của các biến cố độc lập cũng độc lập.</li><li>Biến cố xung khắc có xác suất dương thì phụ thuộc.</li><li>Độc lập toàn phần cần quy tắc tích cho mọi nhóm con.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 3.2 Biến cố độc lập và xung khắc</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class03-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 3 (tính độc lập)</a></li><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/04%3A_Conditional_Probability" target="_blank" rel="noopener">Grinstead &amp; Snell — Chương 4 (biến cố độc lập)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>P(A) = 0,3, P(B) = 0,5, A và B độc lập. Tìm P(A ∪ B).</li><li>Hai xúc xắc: “xúc xắc 1 chẵn” và “tổng chẵn” có độc lập không?</li><li>Một biến cố có thể độc lập với chính nó không? Khi nào?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 0,3 + 0,5 − 0,15 = 0,65. 2) P(cả hai) = 9/36 = 1/4 = (1/2)(1/2): có. 3) P(A) = P(A)<sup>2</sup> ⇔ P(A) = 0 hoặc 1.</p></div>`);

const c42 = L('ipy111-ts-4-2',
  '4.2 — Repeated independent trials and system reliability|||4.2 — Phép thử độc lập lặp lại và độ tin cậy hệ thống',
  'Xác suất “ít nhất một lần” 1 − (1−p)^n, bài toán de Méré, cần bao nhiêu lần thử; độ tin cậy hệ nối tiếp, song song và hỗn hợp (server nhân bản).',
  `<span class="eyebrow">IPY111 · Chapter 4 · Lesson 4.2</span>
<h2>Repeated independent trials and system reliability</h2>
<p class="lead">With independence, probabilities of complicated events built from many simple ones become products. This is the mathematics behind uptime guarantees, redundancy and “how many attempts until …”.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute P(at least one success) in n independent trials.</li><li>Find how many trials are needed to reach a target probability.</li><li>Compute the reliability of series, parallel and mixed systems.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">At least one success in n independent trials</span>P(at least one) = 1 − P(none) = 1 − (1 − p)<sup>n</sup><br>Smallest n with P ≥ target: n ≥ ln(1 − target) / ln(1 − p)</div>
<p>A system of independent components, component i working with probability p<sub>i</sub>:</p>
<div class="formula"><span class="lbl">Reliability</span>Series (all must work): R = p<sub>1</sub> p<sub>2</sub> … p<sub>n</sub><br>Parallel (at least one must work): R = 1 − (1 − p<sub>1</sub>)(1 − p<sub>2</sub>)…(1 − p<sub>n</sub>)</div>
<p>Series systems are weaker than their weakest component; parallel (redundant) systems are stronger than their strongest. Mixed systems are reduced block by block.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — the Chevalier de Méré (1654).</b> He bet on “at least one six in 4 rolls” and on “at least one double six in 24 rolls of two dice”, believing both had the same chance. Exact: 1 − (5/6)<sup>4</sup> ≈ <b>0.5177</b> (a winning bet), but 1 − (35/36)<sup>24</sup> ≈ <b>0.4914</b> (a losing bet). His question started the Pascal–Fermat correspondence that founded probability theory.</p></div>
<div class="callout"><p><b>Example 2 — phishing.</b> Each phishing e-mail fools an employee with probability 0.05, independently. With 20 e-mails, P(at least one success for the attacker) = 1 − 0.95<sup>20</sup> ≈ <b>0.642</b>. For 90%: n ≥ ln 0.1 / ln 0.95 ≈ 44.9 ⇒ <b>45</b> e-mails. Small probabilities add up quickly.</p></div>
<div class="callout"><p><b>Example 3 — servers.</b> A request passes through 5 independent services in series, each up with probability 0.98: R = 0.98<sup>5</sup> ≈ <b>0.904</b> — far worse than any single service. Replicating a database on 3 independent machines, each up 0.99, in parallel: R = 1 − 0.01<sup>3</sup> = <b>0.999999</b> (“six nines”).</p>
<p>Mixed: two load balancers in parallel (0.9 each) followed by an app server (0.95) in series: R = [1 − 0.1<sup>2</sup>] × 0.95 = 0.99 × 0.95 = <b>0.9405</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Adding instead of using the complement: 20 × 0.05 = 1 is not a probability of 100%.</li><li>Assuming replicas fail independently when they share power, network or a buggy release — real redundancy needs independence.</li><li>Mixing up series (multiply reliabilities) and parallel (multiply failure probabilities).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>P(at least one in n) = 1 − (1 − p)<sup>n</sup>.</li><li>n ≥ ln(1 − target)/ln(1 − p) trials needed.</li><li>Series: product of reliabilities; parallel: 1 − product of failure probabilities.</li><li>All of this rests on independence — check it.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 3.2 Independent events</a></li><li><a href="https://ocw.mit.edu/courses/res-6-012-introduction-to-probability-spring-2018/pages/part-i-the-fundamentals/" target="_blank" rel="noopener">MIT RES.6-012 — Part I: independence and reliability examples</a></li><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/01%3A_Discrete_Probability_Distributions" target="_blank" rel="noopener">Grinstead &amp; Snell — Chapter 1 (de Méré's problem, simulated)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A password guesser succeeds with probability 0.001 per try. P(success within 1 000 tries)?</li><li>Three independent components in parallel with reliabilities 0.8, 0.7, 0.6. System reliability?</li><li>How many independent 0.99 replicas are needed in parallel for reliability ≥ 0.99999?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 1 − 0.999<sup>1000</sup> ≈ 0.632. 2) 1 − 0.2 × 0.3 × 0.4 = 0.976. 3) 0.01<sup>n</sup> ≤ 10<sup>−5</sup> ⇒ n = 3 (two replicas give only 0.9999).</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 4 · Bài 4.2</span>
<h2>Phép thử độc lập lặp lại và độ tin cậy hệ thống</h2>
<p class="lead">Nhờ tính độc lập, xác suất của biến cố phức tạp ghép từ nhiều biến cố đơn giản trở thành tích. Đây là toán học đằng sau cam kết uptime, hệ dự phòng và câu hỏi “cần thử bao nhiêu lần cho đến khi …”.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính P(ít nhất một lần thành công) trong n phép thử độc lập.</li><li>Tìm số lần thử cần để đạt một xác suất mục tiêu.</li><li>Tính độ tin cậy của hệ nối tiếp, song song và hỗn hợp.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Ít nhất một thành công trong n phép thử độc lập</span>P(ít nhất một) = 1 − P(không lần nào) = 1 − (1 − p)<sup>n</sup><br>n nhỏ nhất để P ≥ mục tiêu: n ≥ ln(1 − mục tiêu) / ln(1 − p)</div>
<p>Hệ gồm các linh kiện độc lập, linh kiện i hoạt động với xác suất p<sub>i</sub>:</p>
<div class="formula"><span class="lbl">Độ tin cậy</span>Nối tiếp (tất cả phải chạy): R = p<sub>1</sub> p<sub>2</sub> … p<sub>n</sub><br>Song song (ít nhất một chạy): R = 1 − (1 − p<sub>1</sub>)(1 − p<sub>2</sub>)…(1 − p<sub>n</sub>)</div>
<p>Hệ nối tiếp yếu hơn linh kiện yếu nhất; hệ song song (dự phòng) mạnh hơn linh kiện mạnh nhất. Hệ hỗn hợp được rút gọn từng khối.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — hiệp sĩ de Méré (1654).</b> Ông cược “ít nhất một mặt 6 trong 4 lần gieo” và “ít nhất một đôi 6 trong 24 lần gieo hai xúc xắc”, tin rằng hai cược có cùng cơ hội. Chính xác: 1 − (5/6)<sup>4</sup> ≈ <b>0,5177</b> (cược có lợi), nhưng 1 − (35/36)<sup>24</sup> ≈ <b>0,4914</b> (cược thua). Câu hỏi của ông mở đầu thư từ Pascal – Fermat, khai sinh lý thuyết xác suất.</p></div>
<div class="callout"><p><b>Ví dụ 2 — lừa đảo phishing.</b> Mỗi email phishing lừa được nhân viên với xác suất 0,05, độc lập. Với 20 email, P(kẻ tấn công thành công ít nhất một lần) = 1 − 0,95<sup>20</sup> ≈ <b>0,642</b>. Để đạt 90%: n ≥ ln 0,1 / ln 0,95 ≈ 44,9 ⇒ <b>45</b> email. Xác suất nhỏ cộng dồn rất nhanh.</p></div>
<div class="callout"><p><b>Ví dụ 3 — server.</b> Một request đi qua 5 dịch vụ độc lập nối tiếp, mỗi dịch vụ sống với xác suất 0,98: R = 0,98<sup>5</sup> ≈ <b>0,904</b> — tệ hơn nhiều so với từng dịch vụ. Nhân bản cơ sở dữ liệu trên 3 máy độc lập, mỗi máy sống 0,99, song song: R = 1 − 0,01<sup>3</sup> = <b>0,999999</b> (“sáu số 9”).</p>
<p>Hỗn hợp: hai bộ cân bằng tải song song (0,9 mỗi cái) rồi nối tiếp một app server (0,95): R = [1 − 0,1<sup>2</sup>] × 0,95 = 0,99 × 0,95 = <b>0,9405</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Cộng thay vì dùng phần bù: 20 × 0,05 = 1 không có nghĩa là xác suất 100%.</li><li>Giả định các bản sao hỏng độc lập khi chúng dùng chung nguồn điện, mạng hay cùng một bản phát hành lỗi — dự phòng thật cần độc lập thật.</li><li>Nhầm nối tiếp (nhân độ tin cậy) với song song (nhân xác suất hỏng).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>P(ít nhất một trong n lần) = 1 − (1 − p)<sup>n</sup>.</li><li>Cần n ≥ ln(1 − mục tiêu)/ln(1 − p) lần thử.</li><li>Nối tiếp: tích độ tin cậy; song song: 1 − tích xác suất hỏng.</li><li>Tất cả dựa trên giả thiết độc lập — hãy kiểm nó.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 3.2 Biến cố độc lập</a></li><li><a href="https://ocw.mit.edu/courses/res-6-012-introduction-to-probability-spring-2018/pages/part-i-the-fundamentals/" target="_blank" rel="noopener">MIT RES.6-012 — Phần I: ví dụ về độc lập và độ tin cậy</a></li><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/01%3A_Discrete_Probability_Distributions" target="_blank" rel="noopener">Grinstead &amp; Snell — Chương 1 (bài toán de Méré, có mô phỏng)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Kẻ dò mật khẩu đoán đúng với xác suất 0,001 mỗi lần. P(đoán trúng trong 1 000 lần)?</li><li>Ba linh kiện độc lập song song với độ tin cậy 0,8; 0,7; 0,6. Độ tin cậy của hệ?</li><li>Cần bao nhiêu bản sao độc lập 0,99 song song để độ tin cậy ≥ 0,99999?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 1 − 0,999<sup>1000</sup> ≈ 0,632. 2) 1 − 0,2 × 0,3 × 0,4 = 0,976. 3) 0,01<sup>n</sup> ≤ 10<sup>−5</sup> ⇒ n = 3 (hai bản sao chỉ được 0,9999).</p></div>`);

const c43 = L('ipy111-ts-4-3',
  '4.3 — Conditional independence and sequential updating (the idea behind Naive Bayes)|||4.3 — Độc lập có điều kiện và cập nhật nối tiếp (ý tưởng của Naive Bayes)',
  'Độc lập có điều kiện P(A∩B|C) = P(A|C)P(B|C); đồng xu chưa biết là cân đối hay lệch: các lần tung độc lập khi biết đồng xu nhưng phụ thuộc khi chưa biết; cập nhật Bayes nhiều bước, Naive Bayes.',
  `<span class="eyebrow">IPY111 · Chapter 4 · Lesson 4.3</span>
<h2>Conditional independence and sequential updating</h2>
<p class="lead">Two events can be independent once we know some background fact, yet dependent when we do not — and the reverse can happen too. This idea is the engine of Bayesian learning and of the Naive Bayes classifier.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define conditional independence given an event C.</li><li>Show that conditional independence and independence do not imply each other.</li><li>Update a posterior after several conditionally independent observations.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Conditional independence</span>A and B are conditionally independent given C ⇔ P(A ∩ B | C) = P(A | C) · P(B | C)</div>
<p>Typical situation: an unknown “state of the world” C (which coin, which disease, spam or not), and observations that are independent <em>once the state is known</em>. Unconditionally the observations are dependent, because each one carries information about the state, which in turn predicts the others.</p>
<p>With conditionally independent evidence E<sub>1</sub>, …, E<sub>n</sub> given each hypothesis H:</p>
<div class="formula"><span class="lbl">Sequential Bayes / Naive Bayes</span>P(H | E<sub>1</sub>, …, E<sub>n</sub>) ∝ P(H) · P(E<sub>1</sub> | H) · P(E<sub>2</sub> | H) · … · P(E<sub>n</sub> | H)</div>
<p>“Naive” because real words in an e-mail are not exactly conditionally independent given the class; the classifier still works surprisingly well.</p>
<h3>✍️ Worked example — a mystery coin</h3>
<div class="callout"><p>A bag holds a fair coin (P(H) = 0.5) and a biased coin (P(H) = 0.9). You pick one at random (prior 1/2 each) and toss it repeatedly. Given the coin, tosses are independent.</p>
<p>Step 1 (one toss, LOTP): P(H<sub>1</sub>) = 0.5 × 0.5 + 0.5 × 0.9 = <b>0.7</b>.</p>
<p>Step 2 (two tosses): P(H<sub>1</sub> ∩ H<sub>2</sub>) = 0.5 × 0.5<sup>2</sup> + 0.5 × 0.9<sup>2</sup> = 0.125 + 0.405 = 0.53.</p>
<p>Step 3: P(H<sub>2</sub> | H<sub>1</sub>) = 0.53 / 0.7 ≈ <b>0.757 ≠ 0.7</b>. The tosses are <em>not</em> independent unconditionally: a head makes the biased coin more likely, which makes another head more likely.</p>
<p>Step 4 (three heads in a row): P(biased | HHH) = 0.5 × 0.729 / (0.5 × 0.125 + 0.5 × 0.729) = 0.729 / 0.854 ≈ <b>0.854</b>.</p>
<p>Step 5 (predict the next toss): P(H<sub>4</sub> | HHH) = 0.146 × 0.5 + 0.854 × 0.9 ≈ <b>0.841</b>.</p></div>
<div class="callout"><p><b>The reverse direction.</b> Two independent fair dice: A = “first is 6”, B = “second is 6” are independent. But given C = “sum is 7”, P(A ∩ B | C) = 0 while P(A | C)P(B | C) = (1/6)(1/6): conditioning on a common effect <em>creates</em> dependence (“explaining away”).</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Multiplying P(H<sub>1</sub>)P(H<sub>2</sub>) = 0.49 for the mystery coin — the tosses are only independent <em>given</em> the coin.</li><li>Believing that conditioning can only remove dependence; it can also create it.</li><li>Forgetting to renormalise: Naive Bayes products must be divided by their sum over the hypotheses.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Conditional independence: P(A ∩ B | C) = P(A | C)P(B | C).</li><li>It neither implies nor is implied by plain independence.</li><li>Posterior ∝ prior × product of likelihoods for conditionally independent evidence.</li><li>Learning from data = repeated Bayesian updating.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class11-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 11: Bayesian Updating with Discrete Priors</a></li><li><a href="https://seeing-theory.brown.edu/bayesian-inference/index.html" target="_blank" rel="noopener">Seeing Theory — Bayesian Inference (updating a coin's bias)</a></li><li><a href="https://www.youtube.com/playlist?list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo" target="_blank" rel="noopener">Harvard Stat 110 — Lectures 4–5: Conditional Probability, Conditioning Continued</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Mystery coin: you see T on the first toss. P(biased | T)?</li><li>Mystery coin: P(two tosses give HT in that order)?</li><li>Is P(A ∩ B | C) = P(A | C)P(B | C) for all C whenever A, B are independent? Give the dice counterexample in one line.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 0.5 × 0.1 / (0.5 × 0.5 + 0.5 × 0.1) = 0.05/0.30 = 1/6. 2) 0.5 × 0.25 + 0.5 × 0.09 = 0.17. 3) No: with C = “sum is 7”, P(both sixes | C) = 0 ≠ 1/36.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 4 · Bài 4.3</span>
<h2>Độc lập có điều kiện và cập nhật nối tiếp</h2>
<p class="lead">Hai biến cố có thể độc lập khi đã biết một sự thật nền nào đó, nhưng lại phụ thuộc khi chưa biết — và chiều ngược lại cũng xảy ra. Ý tưởng này là động cơ của học Bayes và của bộ phân loại Naive Bayes.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa độc lập có điều kiện theo biến cố C.</li><li>Chỉ ra rằng độc lập có điều kiện và độc lập không suy ra nhau.</li><li>Cập nhật hậu nghiệm sau nhiều quan sát độc lập có điều kiện.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Độc lập có điều kiện</span>A và B độc lập có điều kiện khi biết C ⇔ P(A ∩ B | C) = P(A | C) · P(B | C)</div>
<p>Tình huống điển hình: có một “trạng thái thế giới” C chưa biết (đồng xu nào, bệnh gì, spam hay không), và các quan sát độc lập <em>khi đã biết trạng thái</em>. Khi chưa biết thì các quan sát phụ thuộc nhau, vì mỗi quan sát mang thông tin về trạng thái, mà trạng thái lại dự báo các quan sát khác.</p>
<p>Với bằng chứng E<sub>1</sub>, …, E<sub>n</sub> độc lập có điều kiện theo mỗi giả thuyết H:</p>
<div class="formula"><span class="lbl">Bayes nối tiếp / Naive Bayes</span>P(H | E<sub>1</sub>, …, E<sub>n</sub>) ∝ P(H) · P(E<sub>1</sub> | H) · P(E<sub>2</sub> | H) · … · P(E<sub>n</sub> | H)</div>
<p>Gọi là “naive” (ngây thơ) vì các từ trong email thật không hoàn toàn độc lập có điều kiện theo lớp; dù vậy bộ phân loại vẫn hoạt động tốt đáng ngạc nhiên.</p>
<h3>✍️ Ví dụ — đồng xu bí ẩn</h3>
<div class="callout"><p>Một túi có đồng xu cân đối (P(H) = 0,5) và đồng xu lệch (P(H) = 0,9). Bạn lấy ngẫu nhiên một đồng (tiên nghiệm 1/2 mỗi đồng) và tung nhiều lần. Khi đã biết đồng xu, các lần tung độc lập.</p>
<p>Bước 1 (một lần tung, xác suất toàn phần): P(H<sub>1</sub>) = 0,5 × 0,5 + 0,5 × 0,9 = <b>0,7</b>.</p>
<p>Bước 2 (hai lần tung): P(H<sub>1</sub> ∩ H<sub>2</sub>) = 0,5 × 0,5<sup>2</sup> + 0,5 × 0,9<sup>2</sup> = 0,125 + 0,405 = 0,53.</p>
<p>Bước 3: P(H<sub>2</sub> | H<sub>1</sub>) = 0,53 / 0,7 ≈ <b>0,757 ≠ 0,7</b>. Khi chưa biết đồng xu, các lần tung <em>không</em> độc lập: một mặt H làm đồng xu lệch có khả năng hơn, do đó mặt H tiếp theo cũng có khả năng hơn.</p>
<p>Bước 4 (ba mặt H liên tiếp): P(lệch | HHH) = 0,5 × 0,729 / (0,5 × 0,125 + 0,5 × 0,729) = 0,729 / 0,854 ≈ <b>0,854</b>.</p>
<p>Bước 5 (dự đoán lần tung tiếp): P(H<sub>4</sub> | HHH) = 0,146 × 0,5 + 0,854 × 0,9 ≈ <b>0,841</b>.</p></div>
<div class="callout"><p><b>Chiều ngược lại.</b> Hai xúc xắc độc lập: A = “xúc xắc 1 ra 6”, B = “xúc xắc 2 ra 6” độc lập. Nhưng khi biết C = “tổng bằng 7”, P(A ∩ B | C) = 0 trong khi P(A | C)P(B | C) = (1/6)(1/6): lấy điều kiện theo một hệ quả chung <em>tạo ra</em> phụ thuộc (“giải thích loại trừ”).</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nhân P(H<sub>1</sub>)P(H<sub>2</sub>) = 0,49 cho đồng xu bí ẩn — các lần tung chỉ độc lập <em>khi đã biết</em> đồng xu.</li><li>Tin rằng lấy điều kiện chỉ có thể xoá phụ thuộc; nó cũng có thể tạo ra phụ thuộc.</li><li>Quên chuẩn hoá: tích Naive Bayes phải chia cho tổng của chúng trên mọi giả thuyết.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Độc lập có điều kiện: P(A ∩ B | C) = P(A | C)P(B | C).</li><li>Nó không suy ra, cũng không được suy ra từ độc lập thông thường.</li><li>Hậu nghiệm ∝ tiên nghiệm × tích các hợp lý khi bằng chứng độc lập có điều kiện.</li><li>Học từ dữ liệu = cập nhật Bayes lặp đi lặp lại.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class11-prep_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 11: Cập nhật Bayes với tiên nghiệm rời rạc</a></li><li><a href="https://seeing-theory.brown.edu/bayesian-inference/index.html" target="_blank" rel="noopener">Seeing Theory — Suy luận Bayes (cập nhật độ lệch của đồng xu)</a></li><li><a href="https://www.youtube.com/playlist?list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo" target="_blank" rel="noopener">Harvard Stat 110 — Bài giảng 4–5: xác suất có điều kiện, lấy điều kiện (tiếp)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Đồng xu bí ẩn: lần tung đầu ra T. P(lệch | T)?</li><li>Đồng xu bí ẩn: P(hai lần tung ra HT theo đúng thứ tự)?</li><li>Nếu A, B độc lập thì P(A ∩ B | C) = P(A | C)P(B | C) với mọi C không? Nêu phản ví dụ xúc xắc trong một dòng.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 0,5 × 0,1 / (0,5 × 0,5 + 0,5 × 0,1) = 0,05/0,30 = 1/6. 2) 0,5 × 0,25 + 0,5 × 0,09 = 0,17. 3) Không: với C = “tổng bằng 7”, P(cả hai ra 6 | C) = 0 ≠ 1/36.</p></div>`);

const q4 = QZ(4, 'Quiz — Chapter 4: Independence|||Quiz — Chương 4: Tính độc lập', 'Kiểm tra chương 4: định nghĩa độc lập, độc lập vs xung khắc, độc lập từng đôi/toàn phần, ít nhất một lần, độ tin cậy, độc lập có điều kiện.', [
  Q('q1', "A and B are independent with P(A) = 0.3, P(B) = 0.5. P(A ∩ B) =|||A, B độc lập với P(A) = 0,3, P(B) = 0,5. P(A ∩ B) =",
    ['0.8|||0,8', '0.15|||0,15', '0.65|||0,65', '0.2|||0,2'], 1,
    "Product rule: 0.3 × 0.5.|||Quy tắc tích: 0,3 × 0,5."),
  Q('q2', "Two disjoint events with positive probabilities are|||Hai biến cố xung khắc có xác suất dương thì",
    ['always independent|||luôn độc lập', 'never independent|||không bao giờ độc lập', 'independent iff equal|||độc lập khi và chỉ khi bằng nhau', 'conditionally independent|||độc lập có điều kiện'], 1,
    "P(A ∩ B) = 0 but P(A)P(B) > 0.|||P(A ∩ B) = 0 nhưng P(A)P(B) > 0."),
  Q('q3', "Two dice: “first die is 6” and “sum is 7” are|||Hai xúc xắc: “xúc xắc 1 ra 6” và “tổng bằng 7” là",
    ['independent|||độc lập', 'disjoint|||xung khắc', 'dependent|||phụ thuộc', 'impossible together|||không thể cùng xảy ra'], 0,
    "1/36 = (1/6)(1/6).|||1/36 = (1/6)(1/6)."),
  Q('q4', "Three events pairwise independent, each with probability 1/2, and P(A ∩ B ∩ C) = 1/4. They are|||Ba biến cố độc lập từng đôi, mỗi cái xác suất 1/2, và P(A ∩ B ∩ C) = 1/4. Chúng",
    ['mutually independent|||độc lập toàn phần', 'not mutually independent|||không độc lập toàn phần', 'disjoint|||xung khắc', 'impossible|||không thể tồn tại'], 1,
    "Mutual independence needs 1/8.|||Độc lập toàn phần cần 1/8."),
  Q('q5', "P(at least one six in 4 rolls of a die) ≈|||P(ít nhất một mặt 6 trong 4 lần gieo) ≈",
    ['0.667|||0,667', '0.518|||0,518', '0.482|||0,482', '0.491|||0,491'], 1,
    "1 − (5/6)^4 ≈ 0.5177.|||1 − (5/6)^4 ≈ 0,5177."),
  Q('q6', "5 independent services in series, each up with probability 0.98. P(system up) ≈|||5 dịch vụ độc lập nối tiếp, mỗi cái sống 0,98. P(hệ sống) ≈",
    ['0.98|||0,98', '0.904|||0,904', '0.9|||0,9', '0.99|||0,99'], 1,
    "0.98^5 ≈ 0.904.|||0,98^5 ≈ 0,904."),
  Q('q7', "3 independent replicas in parallel, each up with probability 0.99. P(system up) =|||3 bản sao độc lập song song, mỗi cái sống 0,99. P(hệ sống) =",
    ['0.970299|||0,970299', '0.999999|||0,999999', '0.99|||0,99', '0.9999|||0,9999'], 1,
    "1 − 0.01^3.|||1 − 0,01^3."),
  Q('q8', "Each trial succeeds with p = 0.05. The smallest n with P(at least one success) ≥ 0.9 is|||Mỗi lần thử thành công với p = 0,05. n nhỏ nhất để P(ít nhất một lần) ≥ 0,9 là",
    ['18|||18', '20|||20', '45|||45', '90|||90'], 2,
    "n ≥ ln 0.1 / ln 0.95 ≈ 44.9.|||n ≥ ln 0,1 / ln 0,95 ≈ 44,9."),
  Q('q9', "Mystery coin (fair or P(H) = 0.9, prior 1/2 each). P(H₂ | H₁) =|||Đồng xu bí ẩn (cân đối hoặc P(H) = 0,9, tiên nghiệm 1/2). P(H₂ | H₁) =",
    ['0.7|||0,7', '0.49|||0,49', '≈ 0.757|||≈ 0,757', '0.9|||0,9'], 2,
    "0.53 / 0.7 ≈ 0.757: tosses are dependent until the coin is known.|||0,53 / 0,7 ≈ 0,757: các lần tung phụ thuộc khi chưa biết đồng xu."),
  Q('q10', "Naive Bayes assumes the features are|||Naive Bayes giả định các đặc trưng",
    ['independent of the class|||độc lập với lớp', 'conditionally independent given the class|||độc lập có điều kiện khi biết lớp', 'disjoint|||xung khắc', 'equally likely|||đồng khả năng'], 1,
    "Posterior ∝ prior × ∏ P(feature | class).|||Hậu nghiệm ∝ tiên nghiệm × ∏ P(đặc trưng | lớp)."),
]);

const ch4 = {
  title: 'Chapter 4 — Independence|||Chương 4 — Tính độc lập',
  description: 'Biến cố độc lập, độc lập vs xung khắc, độc lập từng đôi/toàn phần; phép thử lặp, de Méré, độ tin cậy hệ nối tiếp/song song; độc lập có điều kiện và Naive Bayes (Blitzstein & Hwang 2.5 · Ross 3.4–3.5).',
  lessons: [c41, c42, c43, q4],
};

// ───────────────────────────── Chương 5 — Biến ngẫu nhiên rời rạc ─────────────────────────────
const c51 = L('ipy111-ts-5-1',
  '5.1 — Random variables, PMF and CDF|||5.1 — Biến ngẫu nhiên, hàm khối xác suất (PMF) và hàm phân phối (CDF)',
  'Biến ngẫu nhiên là hàm từ không gian mẫu vào số thực; PMF p(x) = P(X = x), điều kiện hợp lệ; CDF F(x) = P(X ≤ x) dạng bậc thang; ví dụ số mặt H, tổng hai xúc xắc, biến chỉ báo.',
  `<span class="eyebrow">IPY111 · Chapter 5 · Lesson 5.1</span>
<h2>Random variables, PMF and CDF</h2>
<p class="lead">So far we worked with events. Most questions, however, are about <em>numbers</em>: how many bugs, how many heads, how long until a failure. A random variable turns an outcome into a number, and its distribution tells us how probability is spread over those numbers.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define a random variable as a function on the sample space.</li><li>Write the PMF of a discrete random variable and check that it is valid.</li><li>Compute and graph the CDF; use it to find interval probabilities.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>random variable</strong> X is a function X : S → ℝ that assigns a number to each outcome. Toss a coin 3 times; X = number of heads maps HTH ↦ 2, TTT ↦ 0. X is <strong>discrete</strong> if it takes a finite or countable list of values x<sub>1</sub>, x<sub>2</sub>, …. The event “X = x” means the set of outcomes {s : X(s) = x}.</p>
<div class="formula"><span class="lbl">Probability mass function (PMF)</span>p<sub>X</sub>(x) = P(X = x),  with p<sub>X</sub>(x) ≥ 0 and ∑<sub>x</sub> p<sub>X</sub>(x) = 1</div>
<div class="formula"><span class="lbl">Cumulative distribution function (CDF)</span>F<sub>X</sub>(x) = P(X ≤ x) = ∑<sub>t ≤ x</sub> p<sub>X</sub>(t)<br>P(a &lt; X ≤ b) = F(b) − F(a);   F is non-decreasing, right-continuous, F(−∞) = 0, F(+∞) = 1</div>
<p>For a discrete X the CDF is a <strong>step function</strong> that jumps by p<sub>X</sub>(x) at each possible value x. The simplest random variable is an <strong>indicator</strong> I<sub>A</sub> = 1 if A happens and 0 otherwise; P(I<sub>A</sub> = 1) = P(A). Indicators will make expectations easy in Chapter 6.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — heads in 3 tosses.</b> Counting outcomes: P(X = 0) = 1/8, P(X = 1) = 3/8, P(X = 2) = 3/8, P(X = 3) = 1/8 (sum = 1 ✓). CDF: F(x) = 0 for x &lt; 0; 1/8 on [0, 1); 1/2 on [1, 2); 7/8 on [2, 3); 1 for x ≥ 3. So P(X ≤ 1) = F(1) = <b>1/2</b> and P(1 &lt; X ≤ 3) = F(3) − F(1) = 1/2.</p></div>
<div class="callout"><p><b>Example 2 — sum of two dice.</b> S = X<sub>1</sub> + X<sub>2</sub> has PMF p(s) = (6 − |s − 7|)/36 for s = 2, …, 12: 1/36, 2/36, 3/36, 4/36, 5/36, 6/36, 5/36, …, 1/36. P(4 ≤ S ≤ 6) = (3 + 4 + 5)/36 = <b>1/3</b>.</p></div>
<div class="callout"><p><b>Example 3 — is this a valid PMF?</b> p(k) = c · k for k = 1, 2, 3, 4. Need ∑ = c(1 + 2 + 3 + 4) = 10c = 1 ⇒ c = <b>1/10</b>. Then P(X ≥ 3) = 0.3 + 0.4 = 0.7.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Confusing the random variable X (a function) with a value x it takes.</li><li>Forgetting that F(x) = P(X ≤ x) includes the endpoint: P(X &lt; 2) = F(1) for integer X, not F(2).</li><li>Writing a “PMF” whose values do not sum to 1.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>A random variable assigns a number to each outcome.</li><li>PMF: p(x) = P(X = x), non-negative, sums to 1.</li><li>CDF: F(x) = P(X ≤ x), a step function for discrete X.</li><li>P(a &lt; X ≤ b) = F(b) − F(a); indicators turn events into 0/1 variables.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/4-1-probability-distribution-function-pdf-for-a-discrete-random-variable" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 4.1 Probability Distribution Function for a Discrete Random Variable</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class04-prep-a_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 4a: Discrete Random Variables</a></li><li><a href="https://seeing-theory.brown.edu/probability-distributions/index.html" target="_blank" rel="noopener">Seeing Theory — Probability Distributions (random variables, interactive)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Roll one die; let X = 1 if the result is prime (2, 3, 5) and 0 otherwise. Write the PMF.</li><li>For the sum of two dice, find P(S ≥ 10) and P(S = 7 or 11).</li><li>A CDF has F(1) = 0.2, F(2) = 0.5, F(3) = 1 for a variable with values 1, 2, 3. Find the PMF.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) P(X = 1) = P(X = 0) = 1/2. 2) 6/36 = 1/6; (6 + 2)/36 = 2/9. 3) p(1) = 0.2, p(2) = 0.3, p(3) = 0.5.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 5 · Bài 5.1</span>
<h2>Biến ngẫu nhiên, PMF và CDF</h2>
<p class="lead">Đến giờ ta làm việc với biến cố. Nhưng phần lớn câu hỏi là về <em>con số</em>: bao nhiêu bug, bao nhiêu mặt ngửa, bao lâu nữa thì hỏng. Biến ngẫu nhiên biến một kết quả thành một con số, và phân phối của nó cho biết xác suất được rải lên các con số đó thế nào.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa biến ngẫu nhiên là hàm trên không gian mẫu.</li><li>Viết PMF của biến ngẫu nhiên rời rạc và kiểm nó hợp lệ.</li><li>Tính và vẽ CDF; dùng nó tìm xác suất trên một khoảng.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Biến ngẫu nhiên</strong> X là một hàm X : S → ℝ gán một số cho mỗi kết quả. Tung đồng xu 3 lần; X = số mặt H biến HTH ↦ 2, TTT ↦ 0. X là <strong>rời rạc</strong> nếu nhận một danh sách hữu hạn hoặc đếm được các giá trị x<sub>1</sub>, x<sub>2</sub>, …. Biến cố “X = x” là tập kết quả {s : X(s) = x}.</p>
<div class="formula"><span class="lbl">Hàm khối xác suất (PMF)</span>p<sub>X</sub>(x) = P(X = x),  với p<sub>X</sub>(x) ≥ 0 và ∑<sub>x</sub> p<sub>X</sub>(x) = 1</div>
<div class="formula"><span class="lbl">Hàm phân phối tích luỹ (CDF)</span>F<sub>X</sub>(x) = P(X ≤ x) = ∑<sub>t ≤ x</sub> p<sub>X</sub>(t)<br>P(a &lt; X ≤ b) = F(b) − F(a);   F không giảm, liên tục phải, F(−∞) = 0, F(+∞) = 1</div>
<p>Với X rời rạc, CDF là <strong>hàm bậc thang</strong> nhảy lên p<sub>X</sub>(x) tại mỗi giá trị x. Biến ngẫu nhiên đơn giản nhất là <strong>biến chỉ báo</strong> I<sub>A</sub> = 1 nếu A xảy ra và 0 nếu không; P(I<sub>A</sub> = 1) = P(A). Biến chỉ báo sẽ làm việc tính kỳ vọng ở Chương 6 trở nên dễ dàng.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — số mặt H trong 3 lần tung.</b> Đếm kết quả: P(X = 0) = 1/8, P(X = 1) = 3/8, P(X = 2) = 3/8, P(X = 3) = 1/8 (tổng = 1 ✓). CDF: F(x) = 0 với x &lt; 0; 1/8 trên [0, 1); 1/2 trên [1, 2); 7/8 trên [2, 3); 1 với x ≥ 3. Vậy P(X ≤ 1) = F(1) = <b>1/2</b> và P(1 &lt; X ≤ 3) = F(3) − F(1) = 1/2.</p></div>
<div class="callout"><p><b>Ví dụ 2 — tổng hai xúc xắc.</b> S = X<sub>1</sub> + X<sub>2</sub> có PMF p(s) = (6 − |s − 7|)/36 với s = 2, …, 12: 1/36, 2/36, 3/36, 4/36, 5/36, 6/36, 5/36, …, 1/36. P(4 ≤ S ≤ 6) = (3 + 4 + 5)/36 = <b>1/3</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — PMF này có hợp lệ không?</b> p(k) = c · k với k = 1, 2, 3, 4. Cần ∑ = c(1 + 2 + 3 + 4) = 10c = 1 ⇒ c = <b>1/10</b>. Khi đó P(X ≥ 3) = 0,3 + 0,4 = 0,7.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nhầm biến ngẫu nhiên X (một hàm) với giá trị x mà nó nhận.</li><li>Quên rằng F(x) = P(X ≤ x) tính cả đầu mút: với X nguyên, P(X &lt; 2) = F(1), không phải F(2).</li><li>Viết một “PMF” mà tổng các giá trị không bằng 1.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Biến ngẫu nhiên gán một số cho mỗi kết quả.</li><li>PMF: p(x) = P(X = x), không âm, tổng bằng 1.</li><li>CDF: F(x) = P(X ≤ x), hàm bậc thang với X rời rạc.</li><li>P(a &lt; X ≤ b) = F(b) − F(a); biến chỉ báo biến biến cố thành biến 0/1.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/4-1-probability-distribution-function-pdf-for-a-discrete-random-variable" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 4.1 Hàm phân phối xác suất của biến ngẫu nhiên rời rạc</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class04-prep-a_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 4a: Biến ngẫu nhiên rời rạc</a></li><li><a href="https://seeing-theory.brown.edu/probability-distributions/index.html" target="_blank" rel="noopener">Seeing Theory — Phân phối xác suất (biến ngẫu nhiên, tương tác)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Gieo một xúc xắc; X = 1 nếu kết quả là số nguyên tố (2, 3, 5), ngược lại X = 0. Viết PMF.</li><li>Với tổng hai xúc xắc, tìm P(S ≥ 10) và P(S = 7 hoặc 11).</li><li>Một CDF có F(1) = 0,2, F(2) = 0,5, F(3) = 1 cho biến nhận giá trị 1, 2, 3. Tìm PMF.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) P(X = 1) = P(X = 0) = 1/2. 2) 6/36 = 1/6; (6 + 2)/36 = 2/9. 3) p(1) = 0,2, p(2) = 0,3, p(3) = 0,5.</p></div>`);

const c52 = L('ipy111-ts-5-2',
  '5.2 — Bernoulli and binomial distributions (with Python)|||5.2 — Phân phối Bernoulli và nhị thức (có Python)',
  'Phép thử Bernoulli, phân phối nhị thức Bin(n,p) với PMF C(n,k)p^k(1−p)^(n−k), điều kiện áp dụng; đoán mò trắc nghiệm, mất gói tin; kiểm bằng math.comb và scipy.stats.binom chạy thật.',
  `<span class="eyebrow">IPY111 · Chapter 5 · Lesson 5.2</span>
<h2>Bernoulli and binomial distributions</h2>
<p class="lead">Count the successes in a fixed number of independent yes/no trials and you get the binomial distribution — the workhorse of discrete probability, from guessing on a quiz to packet loss and A/B tests.</p>
<h3>🎯 Objectives</h3>
<ul><li>Recognise Bernoulli trials and the four binomial conditions.</li><li>Derive and use the binomial PMF.</li><li>Compute binomial probabilities in Python.</li></ul>
<h3>📖 Lecture</h3>
<p>A <strong>Bernoulli(p)</strong> random variable takes value 1 (“success”) with probability p and 0 with probability 1 − p. A <strong>binomial</strong> random variable X ∼ Bin(n, p) counts the successes in n trials when:</p>
<ul><li>the number of trials n is fixed;</li><li>each trial is success/failure;</li><li>trials are independent;</li><li>the success probability p is the same for every trial.</li></ul>
<p>Any particular sequence with k successes and n − k failures has probability p<sup>k</sup>(1 − p)<sup>n−k</sup> by independence, and there are C(n, k) such sequences (choose which trials succeed):</p>
<div class="formula"><span class="lbl">Binomial PMF</span>P(X = k) = C(n, k) p<sup>k</sup> (1 − p)<sup>n−k</sup>,  k = 0, 1, …, n</div>
<p>By the binomial theorem these add up to (p + 1 − p)<sup>n</sup> = 1 ✓. A Bin(n, p) variable is a sum of n independent Bernoulli(p) indicators — a fact we will use for its mean np and variance np(1 − p).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — guessing a quiz.</b> 10 multiple-choice questions, 4 options each, pure guessing: X ∼ Bin(10, 0.25).</p>
<p>P(X = 0) = 0.75<sup>10</sup> ≈ 0.0563. P(X = 3) = C(10, 3)(0.25)<sup>3</sup>(0.75)<sup>7</sup> = 120 × 0.015625 × 0.13348 ≈ <b>0.2503</b>. P(X ≥ 5) = P(5) + … + P(10) ≈ <b>0.0781</b> — guessing passes a “5/10” quiz less than 8% of the time.</p></div>
<div class="callout"><p><b>Example 2 — packet loss.</b> Each of 20 packets is lost independently with probability 0.05. P(no loss) = 0.95<sup>20</sup> ≈ 0.358; P(at most one loss) = 0.358 + 20(0.05)(0.95)<sup>19</sup> ≈ 0.358 + 0.377 = <b>0.736</b>.</p></div>
<pre><code class="language-python">from math import comb
from scipy.stats import binom

n, p = 10, 0.25
pmf = [comb(n, k) * p**k * (1 - p)**(n - k) for k in range(n + 1)]
print("P(X=0) =", round(pmf[0], 4))
print("P(X=3) =", round(pmf[3], 4))
print("P(X&gt;=5) =", round(sum(pmf[5:]), 4))
# the same with scipy: sf(4) = P(X &gt; 4) = P(X &gt;= 5)
print("scipy  :", round(binom.sf(4, n, p), 4), round(binom.mean(n, p), 2), round(binom.var(n, p), 3))
</code></pre>
<div class="out">P(X=0) = 0.0563
P(X=3) = 0.2503
P(X&gt;=5) = 0.0781
scipy  : 0.0781 2.5 1.875</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using the binomial when trials are not independent or p changes (drawing without replacement from a small batch ⇒ hypergeometric, Lesson 5.3).</li><li>Forgetting the C(n, k) factor: p<sup>k</sup>(1 − p)<sup>n−k</sup> is the probability of <em>one</em> sequence.</li><li>Off-by-one with CDFs: P(X ≥ 5) = 1 − P(X ≤ 4), which is <code>binom.sf(4, n, p)</code>, not <code>sf(5)</code>.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Bernoulli(p): one trial, values 0/1.</li><li>Bin(n, p): number of successes in n independent identical trials.</li><li>P(X = k) = C(n, k)p<sup>k</sup>(1 − p)<sup>n−k</sup>.</li><li>Python: <code>math.comb</code> or <code>scipy.stats.binom.pmf / cdf / sf</code>.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/4-3-binomial-distribution" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 4.3 Binomial Distribution</a></li><li><a href="https://www.3blue1brown.com/lessons/binomial-distributions" target="_blank" rel="noopener">3Blue1Brown — Binomial distributions</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.binom.html" target="_blank" rel="noopener">SciPy — scipy.stats.binom</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A fair coin is tossed 10 times. P(exactly 8 heads)? P(at least 8 heads)?</li><li>10% of devices in a batch are faulty (large batch). Among 10 tested, P(at least 3 faulty)?</li><li>X ∼ Bin(5, 0.3). Find P(X = 2) and P(X ≥ 1).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 45/1024 ≈ 0.0439; (45 + 10 + 1)/1024 = 56/1024 ≈ 0.0547. 2) 1 − P(X ≤ 2) ≈ 0.0702. 3) 10 × 0.09 × 0.343 = 0.3087; 1 − 0.7<sup>5</sup> ≈ 0.8319.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 5 · Bài 5.2</span>
<h2>Phân phối Bernoulli và nhị thức</h2>
<p class="lead">Đếm số lần thành công trong một số cố định các phép thử có/không độc lập là ra phân phối nhị thức — “con ngựa thồ” của xác suất rời rạc, từ đoán mò trắc nghiệm đến mất gói tin và kiểm thử A/B.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận ra phép thử Bernoulli và bốn điều kiện của phân phối nhị thức.</li><li>Suy ra và dùng PMF nhị thức.</li><li>Tính xác suất nhị thức bằng Python.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Biến ngẫu nhiên <strong>Bernoulli(p)</strong> nhận giá trị 1 (“thành công”) với xác suất p và 0 với xác suất 1 − p. Biến <strong>nhị thức</strong> X ∼ Bin(n, p) đếm số lần thành công trong n phép thử khi:</p>
<ul><li>số phép thử n cố định;</li><li>mỗi phép thử chỉ có thành công/thất bại;</li><li>các phép thử độc lập;</li><li>xác suất thành công p như nhau ở mọi phép thử.</li></ul>
<p>Một dãy cụ thể có k thành công và n − k thất bại có xác suất p<sup>k</sup>(1 − p)<sup>n−k</sup> (do độc lập), và có C(n, k) dãy như vậy (chọn phép thử nào thành công):</p>
<div class="formula"><span class="lbl">PMF nhị thức</span>P(X = k) = C(n, k) p<sup>k</sup> (1 − p)<sup>n−k</sup>,  k = 0, 1, …, n</div>
<p>Theo nhị thức Newton, tổng các xác suất là (p + 1 − p)<sup>n</sup> = 1 ✓. Biến Bin(n, p) là tổng của n biến chỉ báo Bernoulli(p) độc lập — điều ta sẽ dùng để tính kỳ vọng np và phương sai np(1 − p).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — đoán mò trắc nghiệm.</b> 10 câu trắc nghiệm, mỗi câu 4 lựa chọn, đoán hoàn toàn: X ∼ Bin(10; 0,25).</p>
<p>P(X = 0) = 0,75<sup>10</sup> ≈ 0,0563. P(X = 3) = C(10, 3)(0,25)<sup>3</sup>(0,75)<sup>7</sup> = 120 × 0,015625 × 0,13348 ≈ <b>0,2503</b>. P(X ≥ 5) = P(5) + … + P(10) ≈ <b>0,0781</b> — đoán mò qua được bài “5/10” chưa tới 8% số lần.</p></div>
<div class="callout"><p><b>Ví dụ 2 — mất gói tin.</b> Mỗi gói trong 20 gói bị mất độc lập với xác suất 0,05. P(không mất gói nào) = 0,95<sup>20</sup> ≈ 0,358; P(mất nhiều nhất một gói) = 0,358 + 20(0,05)(0,95)<sup>19</sup> ≈ 0,358 + 0,377 = <b>0,736</b>.</p></div>
<pre><code class="language-python">from math import comb
from scipy.stats import binom

n, p = 10, 0.25
pmf = [comb(n, k) * p**k * (1 - p)**(n - k) for k in range(n + 1)]
print("P(X=0) =", round(pmf[0], 4))
print("P(X=3) =", round(pmf[3], 4))
print("P(X&gt;=5) =", round(sum(pmf[5:]), 4))
# the same with scipy: sf(4) = P(X &gt; 4) = P(X &gt;= 5)
print("scipy  :", round(binom.sf(4, n, p), 4), round(binom.mean(n, p), 2), round(binom.var(n, p), 3))
</code></pre>
<div class="out">P(X=0) = 0.0563
P(X=3) = 0.2503
P(X&gt;=5) = 0.0781
scipy  : 0.0781 2.5 1.875</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng nhị thức khi các phép thử không độc lập hoặc p thay đổi (rút không hoàn lại từ lô nhỏ ⇒ siêu bội, Bài 5.3).</li><li>Quên thừa số C(n, k): p<sup>k</sup>(1 − p)<sup>n−k</sup> là xác suất của <em>một</em> dãy.</li><li>Lệch một đơn vị với CDF: P(X ≥ 5) = 1 − P(X ≤ 4), tức <code>binom.sf(4, n, p)</code>, không phải <code>sf(5)</code>.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Bernoulli(p): một phép thử, giá trị 0/1.</li><li>Bin(n, p): số thành công trong n phép thử độc lập, giống nhau.</li><li>P(X = k) = C(n, k)p<sup>k</sup>(1 − p)<sup>n−k</sup>.</li><li>Python: <code>math.comb</code> hoặc <code>scipy.stats.binom.pmf / cdf / sf</code>.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/4-3-binomial-distribution" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 4.3 Phân phối nhị thức</a></li><li><a href="https://www.3blue1brown.com/lessons/binomial-distributions" target="_blank" rel="noopener">3Blue1Brown — Phân phối nhị thức</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.binom.html" target="_blank" rel="noopener">SciPy — scipy.stats.binom</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tung đồng xu cân đối 10 lần. P(đúng 8 mặt H)? P(ít nhất 8 mặt H)?</li><li>10% thiết bị trong một lô bị lỗi (lô lớn). Kiểm 10 cái, P(ít nhất 3 cái lỗi)?</li><li>X ∼ Bin(5; 0,3). Tìm P(X = 2) và P(X ≥ 1).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 45/1024 ≈ 0,0439; (45 + 10 + 1)/1024 = 56/1024 ≈ 0,0547. 2) 1 − P(X ≤ 2) ≈ 0,0702. 3) 10 × 0,09 × 0,343 = 0,3087; 1 − 0,7<sup>5</sup> ≈ 0,8319.</p></div>`);

const c53 = L('ipy111-ts-5-3',
  '5.3 — Geometric, negative binomial and hypergeometric distributions|||5.3 — Phân phối hình học, nhị thức âm và siêu bội',
  'Hình học: số lần thử đến thành công đầu tiên, tính không nhớ; nhị thức âm: đến thành công thứ r; siêu bội: rút không hoàn lại (kiểm tra chất lượng), so với nhị thức.',
  `<span class="eyebrow">IPY111 · Chapter 5 · Lesson 5.3</span>
<h2>Geometric, negative binomial and hypergeometric distributions</h2>
<p class="lead">The binomial fixes the number of trials and counts successes. Two natural variations: fix the number of successes and count the trials (geometric, negative binomial), or sample <em>without</em> replacement from a finite population (hypergeometric).</p>
<h3>🎯 Objectives</h3>
<ul><li>Use the geometric distribution and its memoryless property.</li><li>Recognise negative binomial situations.</li><li>Use the hypergeometric distribution for sampling without replacement.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Geometric(p) — trials until the first success</span>P(X = k) = (1 − p)<sup>k−1</sup> p,  k = 1, 2, 3, …     P(X &gt; k) = (1 − p)<sup>k</sup></div>
<p>⚠️ Conventions differ: Blitzstein &amp; Hwang count the <em>failures before</em> the first success (support 0, 1, 2, …); Ross, OpenStax and <code>scipy.stats.geom</code> count <em>trials</em> (support 1, 2, …). We use trials. The geometric distribution is <strong>memoryless</strong>: P(X &gt; m + k | X &gt; m) = P(X &gt; k) — after m failures the process “starts over”.</p>
<div class="formula"><span class="lbl">Negative binomial — trials until the r-th success</span>P(X = k) = C(k − 1, r − 1) p<sup>r</sup> (1 − p)<sup>k−r</sup>,  k = r, r + 1, …</div>
<p>(The last trial must be the r-th success; the other r − 1 successes are anywhere among the first k − 1 trials.)</p>
<div class="formula"><span class="lbl">Hypergeometric — successes in a sample without replacement</span>Population of N items, K “successes”; draw n without replacement; X = number of successes drawn:<br>P(X = k) = C(K, k) · C(N − K, n − k) / C(N, n)</div>
<p>If N is large compared with n, drawing without replacement is almost the same as with replacement, and the hypergeometric is close to Bin(n, K/N).</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — first six.</b> Roll a die until the first 6; X ∼ Geom(1/6). P(X = 3) = (5/6)<sup>2</sup>(1/6) = 25/216 ≈ <b>0.1157</b>. P(more than 3 rolls needed) = (5/6)<sup>3</sup> ≈ <b>0.579</b>. Memoryless: if the first 10 rolls had no 6, the chance of needing more than 3 further rolls is still 0.579 — the die does not “owe” you a six.</p></div>
<div class="callout"><p><b>Example 2 — best of seven.</b> Team A wins each game with probability 0.5. P(A wins its 3rd game on game 7)? Negative binomial with r = 3, k = 7: C(6, 2)(0.5)<sup>3</sup>(0.5)<sup>4</sup> = 15/128 ≈ <b>0.117</b>.</p></div>
<div class="callout"><p><b>Example 3 — quality control.</b> A lot of 20 chips contains 5 defective. An inspector tests 4 at random without replacement. P(exactly one defective) = C(5, 1)C(15, 3)/C(20, 4) = 5 × 455 / 4 845 ≈ <b>0.4696</b>. P(none defective) = C(15, 4)/C(20, 4) = 1 365/4 845 ≈ 0.282 — the lot passes a “zero defects in the sample” rule 28% of the time despite being 25% defective. (Binomial approximation Bin(4, 0.25) would give P(X = 1) ≈ 0.422 — poor here because n/N = 1/5 is not small.)</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Mixing up the two geometric conventions (trials vs failures) — check the support, especially with software.</li><li>Using the binomial for a small population sampled without replacement.</li><li>Believing in “streaks are due”: for independent trials the memoryless property says no.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Geometric: P(X = k) = (1 − p)<sup>k−1</sup>p, memoryless.</li><li>Negative binomial: trials until the r-th success.</li><li>Hypergeometric: C(K, k)C(N − K, n − k)/C(N, n), no replacement.</li><li>Hypergeometric ≈ binomial when n ≪ N.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/4-4-geometric-distribution" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 4.4 Geometric Distribution</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/4-5-hypergeometric-distribution" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 4.5 Hypergeometric Distribution</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.hypergeom.html" target="_blank" rel="noopener">SciPy — scipy.stats.hypergeom</a> · <a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.geom.html" target="_blank" rel="noopener">scipy.stats.geom</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A login succeeds with probability 0.8 per attempt, independently. P(first success on the 2nd attempt)? P(more than 2 attempts)?</li><li>From 10 students (4 women, 6 men) choose 3 at random. P(exactly 2 women)?</li><li>Roll a die until the second six. P(this happens on roll 4)?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 0.2 × 0.8 = 0.16; 0.2<sup>2</sup> = 0.04. 2) C(4, 2)C(6, 1)/C(10, 3) = 36/120 = 0.3. 3) C(3, 1)(1/6)<sup>2</sup>(5/6)<sup>2</sup> = 75/1296 ≈ 0.0579.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 5 · Bài 5.3</span>
<h2>Phân phối hình học, nhị thức âm và siêu bội</h2>
<p class="lead">Nhị thức cố định số phép thử rồi đếm số thành công. Hai biến thể tự nhiên: cố định số thành công rồi đếm số phép thử (hình học, nhị thức âm), hoặc lấy mẫu <em>không hoàn lại</em> từ tổng thể hữu hạn (siêu bội).</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dùng phân phối hình học và tính không nhớ của nó.</li><li>Nhận ra tình huống nhị thức âm.</li><li>Dùng phân phối siêu bội cho lấy mẫu không hoàn lại.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Hình học Geom(p) — số lần thử đến thành công đầu tiên</span>P(X = k) = (1 − p)<sup>k−1</sup> p,  k = 1, 2, 3, …     P(X &gt; k) = (1 − p)<sup>k</sup></div>
<p>⚠️ Quy ước khác nhau: Blitzstein &amp; Hwang đếm số <em>thất bại trước</em> thành công đầu tiên (giá trị 0, 1, 2, …); Ross, OpenStax và <code>scipy.stats.geom</code> đếm số <em>lần thử</em> (giá trị 1, 2, …). Bài này đếm lần thử. Phân phối hình học <strong>không nhớ</strong>: P(X &gt; m + k | X &gt; m) = P(X &gt; k) — sau m lần thất bại, quá trình “bắt đầu lại”.</p>
<div class="formula"><span class="lbl">Nhị thức âm — số lần thử đến thành công thứ r</span>P(X = k) = C(k − 1, r − 1) p<sup>r</sup> (1 − p)<sup>k−r</sup>,  k = r, r + 1, …</div>
<p>(Lần thử cuối phải là thành công thứ r; r − 1 thành công còn lại nằm đâu đó trong k − 1 lần đầu.)</p>
<div class="formula"><span class="lbl">Siêu bội — số thành công trong mẫu không hoàn lại</span>Tổng thể N phần tử, có K “thành công”; rút n phần tử không hoàn lại; X = số thành công rút được:<br>P(X = k) = C(K, k) · C(N − K, n − k) / C(N, n)</div>
<p>Nếu N rất lớn so với n, rút không hoàn lại gần như rút có hoàn lại, và siêu bội xấp xỉ Bin(n, K/N).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — mặt 6 đầu tiên.</b> Gieo xúc xắc đến khi ra mặt 6; X ∼ Geom(1/6). P(X = 3) = (5/6)<sup>2</sup>(1/6) = 25/216 ≈ <b>0,1157</b>. P(cần hơn 3 lần) = (5/6)<sup>3</sup> ≈ <b>0,579</b>. Không nhớ: nếu 10 lần đầu chưa ra 6, xác suất cần thêm hơn 3 lần nữa vẫn là 0,579 — xúc xắc không “nợ” bạn mặt 6.</p></div>
<div class="callout"><p><b>Ví dụ 2 — loạt bảy trận.</b> Đội A thắng mỗi trận với xác suất 0,5. P(A thắng trận thứ 3 của mình đúng ở trận 7)? Nhị thức âm với r = 3, k = 7: C(6, 2)(0,5)<sup>3</sup>(0,5)<sup>4</sup> = 15/128 ≈ <b>0,117</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — kiểm tra chất lượng.</b> Lô 20 chip có 5 chip lỗi. Người kiểm lấy ngẫu nhiên 4 chip không hoàn lại. P(đúng một chip lỗi) = C(5, 1)C(15, 3)/C(20, 4) = 5 × 455 / 4 845 ≈ <b>0,4696</b>. P(không chip nào lỗi) = C(15, 4)/C(20, 4) = 1 365/4 845 ≈ 0,282 — lô vẫn qua quy tắc “mẫu không có lỗi” 28% số lần dù lỗi tới 25%. (Xấp xỉ nhị thức Bin(4; 0,25) cho P(X = 1) ≈ 0,422 — kém ở đây vì n/N = 1/5 không nhỏ.)</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nhầm hai quy ước hình học (lần thử vs thất bại) — kiểm miền giá trị, nhất là khi dùng phần mềm.</li><li>Dùng nhị thức cho tổng thể nhỏ lấy mẫu không hoàn lại.</li><li>Tin vào “sắp đến lượt”: với phép thử độc lập, tính không nhớ nói là không.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Hình học: P(X = k) = (1 − p)<sup>k−1</sup>p, không nhớ.</li><li>Nhị thức âm: số lần thử đến thành công thứ r.</li><li>Siêu bội: C(K, k)C(N − K, n − k)/C(N, n), không hoàn lại.</li><li>Siêu bội ≈ nhị thức khi n ≪ N.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/4-4-geometric-distribution" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 4.4 Phân phối hình học</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/4-5-hypergeometric-distribution" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 4.5 Phân phối siêu bội</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.hypergeom.html" target="_blank" rel="noopener">SciPy — scipy.stats.hypergeom</a> · <a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.geom.html" target="_blank" rel="noopener">scipy.stats.geom</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Đăng nhập thành công với xác suất 0,8 mỗi lần, độc lập. P(thành công đầu tiên ở lần 2)? P(cần hơn 2 lần)?</li><li>Từ 10 sinh viên (4 nữ, 6 nam) chọn ngẫu nhiên 3. P(đúng 2 nữ)?</li><li>Gieo xúc xắc đến khi ra mặt 6 lần thứ hai. P(điều đó xảy ra ở lần gieo 4)?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 0,2 × 0,8 = 0,16; 0,2<sup>2</sup> = 0,04. 2) C(4, 2)C(6, 1)/C(10, 3) = 36/120 = 0,3. 3) C(3, 1)(1/6)<sup>2</sup>(5/6)<sup>2</sup> = 75/1296 ≈ 0,0579.</p></div>`);

const c54 = L('ipy111-ts-5-4',
  '5.4 — The Poisson distribution and the Poisson approximation (with Python)|||5.4 — Phân phối Poisson và xấp xỉ Poisson (có Python)',
  'Poisson(λ) đếm biến cố hiếm theo thời gian/không gian: PMF e^(−λ)λ^k/k!, đổi λ theo độ dài khoảng; ticket hỗ trợ mỗi giờ; xấp xỉ nhị thức n lớn p nhỏ, kiểm bằng scipy chạy thật.',
  `<span class="eyebrow">IPY111 · Chapter 5 · Lesson 5.4</span>
<h2>The Poisson distribution and the Poisson approximation</h2>
<p class="lead">How many requests arrive in the next second? How many typos on a page? How many server crashes this month? Counts of rare, independent events in a fixed window follow the Poisson distribution.</p>
<h3>🎯 Objectives</h3>
<ul><li>Use the Poisson PMF and scale the rate λ to the window length.</li><li>Approximate Bin(n, p) by Poisson(np) when n is large and p small.</li><li>Compute Poisson probabilities in Python.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Poisson(λ)</span>P(X = k) = e<sup>−λ</sup> λ<sup>k</sup> / k!,  k = 0, 1, 2, …   (λ &gt; 0 is the average count in the window)</div>
<p>The probabilities add to 1 because ∑ λ<sup>k</sup>/k! = e<sup>λ</sup>. If events occur at rate r per unit time, the count in a window of length t is Poisson(λ = rt): the parameter scales with the window.</p>
<p><strong>Where it comes from.</strong> Split the window into n tiny slots, each containing an event with probability p = λ/n, independently. The count is Bin(n, λ/n), and as n → ∞:</p>
<div class="formula"><span class="lbl">Poisson approximation to the binomial</span>Bin(n, p) ≈ Poisson(λ = np)  when n is large and p is small (rule of thumb: n ≥ 20, p ≤ 0.05)</div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — support tickets.</b> A help desk receives on average 3 tickets per hour; X ∼ Poisson(3).</p>
<p>P(X = 0) = e<sup>−3</sup> ≈ <b>0.0498</b>. P(X ≤ 2) = e<sup>−3</sup>(1 + 3 + 9/2) ≈ <b>0.4232</b>. P(X ≥ 5) = 1 − P(X ≤ 4) ≈ <b>0.1847</b>.</p>
<p>Scaling: in 20 minutes, λ = 3 × (1/3) = 1, so P(no ticket in 20 min) = e<sup>−1</sup> ≈ 0.368. In 2 hours, λ = 6, and P(at least 10 tickets) ≈ 0.084.</p></div>
<div class="callout"><p><b>Example 2 — rare defects.</b> 1 000 chips, each defective with probability 0.002. Exact Bin(1000, 0.002): P(X = 0) = 0.998<sup>1000</sup> ≈ 0.13506. Poisson(2): e<sup>−2</sup> ≈ 0.13534 — agreement to three decimals.</p></div>
<pre><code class="language-python">from scipy.stats import binom, poisson

n, p = 1000, 0.002
lam = n * p
for k in range(5):
    print(k, round(binom.pmf(k, n, p), 5), round(poisson.pmf(k, lam), 5))

# support tickets: lambda = 3 per hour
print("P(X=0) =", round(poisson.pmf(0, 3), 4))
print("P(X&lt;=2) =", round(poisson.cdf(2, 3), 4))
print("P(X&gt;=5) =", round(poisson.sf(4, 3), 4))
</code></pre>
<div class="out">0 0.13506 0.13534
1 0.27067 0.27067
2 0.27094 0.27067
3 0.18063 0.18045
4 0.09022 0.09022
P(X=0) = 0.0498
P(X&lt;=2) = 0.4232
P(X&gt;=5) = 0.1847</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting to rescale λ when the window changes (per hour → per 20 minutes).</li><li>Using Poisson when events cluster (a crash that triggers more crashes) — the independence assumption fails.</li><li>Using the Poisson approximation when p is not small (e.g. Bin(20, 0.4)).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Poisson(λ): P(X = k) = e<sup>−λ</sup>λ<sup>k</sup>/k! for counts of rare independent events.</li><li>λ = rate × window length.</li><li>Bin(n, p) ≈ Poisson(np) for large n, small p.</li><li>Python: <code>scipy.stats.poisson.pmf / cdf / sf</code>.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/4-6-poisson-distribution" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 4.6 Poisson Distribution</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.poisson.html" target="_blank" rel="noopener">SciPy — scipy.stats.poisson</a></li><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/05%3A_Distributions_and_Densities" target="_blank" rel="noopener">Grinstead &amp; Snell — Chapter 5: Important distributions (Poisson)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A website gets 2 sign-ups per minute on average. P(exactly 2 sign-ups in a given minute)?</li><li>Same site: P(no sign-up in 30 seconds)?</li><li>A text has 500 words; each is a typo with probability 0.004. Approximate P(at least one typo).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) e<sup>−2</sup> 2<sup>2</sup>/2! ≈ 0.2707. 2) λ = 1 ⇒ e<sup>−1</sup> ≈ 0.368. 3) λ = 2 ⇒ 1 − e<sup>−2</sup> ≈ 0.865.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 5 · Bài 5.4</span>
<h2>Phân phối Poisson và xấp xỉ Poisson</h2>
<p class="lead">Giây tới có bao nhiêu request? Một trang có bao nhiêu lỗi chính tả? Tháng này server sập mấy lần? Số lần xảy ra của các biến cố hiếm, độc lập trong một khoảng cố định tuân theo phân phối Poisson.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dùng PMF Poisson và đổi tham số λ theo độ dài khoảng.</li><li>Xấp xỉ Bin(n, p) bằng Poisson(np) khi n lớn, p nhỏ.</li><li>Tính xác suất Poisson bằng Python.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Poisson(λ)</span>P(X = k) = e<sup>−λ</sup> λ<sup>k</sup> / k!,  k = 0, 1, 2, …   (λ &gt; 0 là số lần trung bình trong khoảng)</div>
<p>Tổng các xác suất bằng 1 vì ∑ λ<sup>k</sup>/k! = e<sup>λ</sup>. Nếu biến cố xảy ra với tốc độ r mỗi đơn vị thời gian, số lần trong khoảng dài t là Poisson(λ = rt): tham số tỉ lệ với độ dài khoảng.</p>
<p><strong>Nguồn gốc.</strong> Chia khoảng thành n ô rất nhỏ, mỗi ô có biến cố với xác suất p = λ/n, độc lập. Số lần là Bin(n, λ/n), và khi n → ∞:</p>
<div class="formula"><span class="lbl">Xấp xỉ Poisson cho nhị thức</span>Bin(n, p) ≈ Poisson(λ = np)  khi n lớn và p nhỏ (kinh nghiệm: n ≥ 20, p ≤ 0,05)</div>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — ticket hỗ trợ.</b> Bộ phận hỗ trợ nhận trung bình 3 ticket mỗi giờ; X ∼ Poisson(3).</p>
<p>P(X = 0) = e<sup>−3</sup> ≈ <b>0,0498</b>. P(X ≤ 2) = e<sup>−3</sup>(1 + 3 + 9/2) ≈ <b>0,4232</b>. P(X ≥ 5) = 1 − P(X ≤ 4) ≈ <b>0,1847</b>.</p>
<p>Đổi khoảng: trong 20 phút, λ = 3 × (1/3) = 1, nên P(không có ticket trong 20 phút) = e<sup>−1</sup> ≈ 0,368. Trong 2 giờ, λ = 6, và P(ít nhất 10 ticket) ≈ 0,084.</p></div>
<div class="callout"><p><b>Ví dụ 2 — lỗi hiếm.</b> 1 000 chip, mỗi chip lỗi với xác suất 0,002. Chính xác Bin(1000; 0,002): P(X = 0) = 0,998<sup>1000</sup> ≈ 0,13506. Poisson(2): e<sup>−2</sup> ≈ 0,13534 — khớp đến ba chữ số thập phân.</p></div>
<pre><code class="language-python">from scipy.stats import binom, poisson

n, p = 1000, 0.002
lam = n * p
for k in range(5):
    print(k, round(binom.pmf(k, n, p), 5), round(poisson.pmf(k, lam), 5))

# support tickets: lambda = 3 per hour
print("P(X=0) =", round(poisson.pmf(0, 3), 4))
print("P(X&lt;=2) =", round(poisson.cdf(2, 3), 4))
print("P(X&gt;=5) =", round(poisson.sf(4, 3), 4))
</code></pre>
<div class="out">0 0.13506 0.13534
1 0.27067 0.27067
2 0.27094 0.27067
3 0.18063 0.18045
4 0.09022 0.09022
P(X=0) = 0.0498
P(X&lt;=2) = 0.4232
P(X&gt;=5) = 0.1847</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên đổi λ khi độ dài khoảng thay đổi (mỗi giờ → mỗi 20 phút).</li><li>Dùng Poisson khi biến cố dồn cục (một lần sập kéo theo nhiều lần sập) — giả thiết độc lập bị vi phạm.</li><li>Dùng xấp xỉ Poisson khi p không nhỏ (ví dụ Bin(20; 0,4)).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Poisson(λ): P(X = k) = e<sup>−λ</sup>λ<sup>k</sup>/k! cho số lần của biến cố hiếm, độc lập.</li><li>λ = tốc độ × độ dài khoảng.</li><li>Bin(n, p) ≈ Poisson(np) khi n lớn, p nhỏ.</li><li>Python: <code>scipy.stats.poisson.pmf / cdf / sf</code>.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/4-6-poisson-distribution" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 4.6 Phân phối Poisson</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.poisson.html" target="_blank" rel="noopener">SciPy — scipy.stats.poisson</a></li><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/05%3A_Distributions_and_Densities" target="_blank" rel="noopener">Grinstead &amp; Snell — Chương 5: Các phân phối quan trọng (Poisson)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Một website có trung bình 2 lượt đăng ký mỗi phút. P(đúng 2 lượt trong một phút)?</li><li>Cùng website: P(không có lượt nào trong 30 giây)?</li><li>Một văn bản 500 từ; mỗi từ sai chính tả với xác suất 0,004. Xấp xỉ P(có ít nhất một lỗi).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) e<sup>−2</sup> 2<sup>2</sup>/2! ≈ 0,2707. 2) λ = 1 ⇒ e<sup>−1</sup> ≈ 0,368. 3) λ = 2 ⇒ 1 − e<sup>−2</sup> ≈ 0,865.</p></div>`);

const q5 = QZ(5, 'Quiz — Chapter 5: Discrete random variables and distributions|||Quiz — Chương 5: Biến ngẫu nhiên rời rạc và các phân phối', 'Kiểm tra chương 5: PMF/CDF, nhị thức, hình học, siêu bội, Poisson và xấp xỉ Poisson.', [
  Q('q1', "p(k) = c·k for k = 1, 2, 3, 4 is a valid PMF when c =|||p(k) = c·k với k = 1, 2, 3, 4 là PMF hợp lệ khi c =",
    ['1/4|||1/4', '1/10|||1/10', '1/24|||1/24', '1|||1'], 1,
    "c(1 + 2 + 3 + 4) = 1.|||c(1 + 2 + 3 + 4) = 1."),
  Q('q2', "For an integer-valued X, P(X < 2) equals|||Với X nhận giá trị nguyên, P(X < 2) bằng",
    ['F(2)|||F(2)', 'F(1)|||F(1)', '1 − F(2)|||1 − F(2)', 'F(2) − F(1)|||F(2) − F(1)'], 1,
    "X < 2 ⇔ X ≤ 1.|||X < 2 ⇔ X ≤ 1."),
  Q('q3', "X ∼ Bin(10, 0.25). P(X = 0) ≈|||X ∼ Bin(10; 0,25). P(X = 0) ≈",
    ['0.25|||0,25', '0.0563|||0,0563', '0.75|||0,75', '0.0010|||0,0010'], 1,
    "0.75^10 ≈ 0.0563.|||0,75^10 ≈ 0,0563."),
  Q('q4', "Which is NOT a binomial condition?|||Điều nào KHÔNG phải điều kiện của nhị thức?",
    ['fixed number of trials|||số phép thử cố định', 'independent trials|||các phép thử độc lập', 'same success probability|||xác suất thành công như nhau', 'sampling without replacement from a small population|||lấy mẫu không hoàn lại từ tổng thể nhỏ'], 3,
    "That situation is hypergeometric.|||Tình huống đó là siêu bội."),
  Q('q5', "Roll a die until the first six. P(first six on roll 3) =|||Gieo xúc xắc đến khi ra 6. P(lần đầu ra 6 ở lần gieo 3) =",
    ['1/6|||1/6', '25/216|||25/216', '1/216|||1/216', '5/36|||5/36'], 1,
    "(5/6)²(1/6).|||(5/6)²(1/6)."),
  Q('q6', "The memoryless property P(X > m + k | X > m) = P(X > k) holds for the|||Tính không nhớ P(X > m + k | X > m) = P(X > k) đúng với phân phối",
    ['binomial|||nhị thức', 'geometric|||hình học', 'hypergeometric|||siêu bội', 'uniform on {1,…,6}|||đều trên {1,…,6}'], 1,
    "P(X > k) = (1 − p)^k gives the identity.|||P(X > k) = (1 − p)^k cho đẳng thức đó."),
  Q('q7', "Lot of 20 with 5 defective; sample 4 without replacement. P(exactly 1 defective) =|||Lô 20 chip có 5 lỗi; lấy 4 không hoàn lại. P(đúng 1 lỗi) =",
    ['C(5,1)C(15,3)/C(20,4)|||C(5,1)C(15,3)/C(20,4)', 'C(4,1)(0.25)(0.75)³|||C(4,1)(0,25)(0,75)³', 'C(5,1)/C(20,4)|||C(5,1)/C(20,4)', '5/20|||5/20'], 0,
    "Hypergeometric: ≈ 0.4696.|||Siêu bội: ≈ 0,4696."),
  Q('q8', "X ∼ Poisson(3). P(X = 0) ≈|||X ∼ Poisson(3). P(X = 0) ≈",
    ['0.0498|||0,0498', '0.3333|||0,3333', '0|||0', '0.2240|||0,2240'], 0,
    "e^(−3) ≈ 0.0498.|||e^(−3) ≈ 0,0498."),
  Q('q9', "Calls arrive at 3 per hour (Poisson). The count in 20 minutes is Poisson with λ =|||Cuộc gọi đến 3 cuộc/giờ (Poisson). Số cuộc trong 20 phút là Poisson với λ =",
    ['3|||3', '1|||1', '20|||20', '60|||60'], 1,
    "λ scales with the window: 3 × 1/3.|||λ tỉ lệ với khoảng: 3 × 1/3."),
  Q('q10', "Bin(1000, 0.002) is best approximated by|||Bin(1000; 0,002) được xấp xỉ tốt nhất bởi",
    ['Poisson(2)|||Poisson(2)', 'Poisson(0.002)|||Poisson(0,002)', 'Geom(0.002)|||Geom(0,002)', 'Poisson(1000)|||Poisson(1000)'], 0,
    "λ = np = 2; P(X = 0): 0.13506 vs 0.13534.|||λ = np = 2; P(X = 0): 0,13506 so với 0,13534."),
]);

const ch5 = {
  title: 'Chapter 5 — Discrete random variables and named distributions|||Chương 5 — Biến ngẫu nhiên rời rạc và các phân phối quan trọng',
  description: 'Biến ngẫu nhiên, PMF, CDF; Bernoulli, nhị thức, hình học, nhị thức âm, siêu bội, Poisson và xấp xỉ Poisson, có code scipy chạy thật (Blitzstein & Hwang ch.3 · Ross ch.4 · OpenStax ch.4).',
  lessons: [c51, c52, c53, c54, q5],
};

// ───────────────────────────── Chương 6 — Kỳ vọng & phương sai ─────────────────────────────
const c61 = L('ipy111-ts-6-1',
  '6.1 — Expected value: the long-run average|||6.1 — Kỳ vọng: giá trị trung bình dài hạn',
  'Định nghĩa E[X] = ∑ x·p(x), ý nghĩa trọng tâm và trung bình dài hạn; xúc xắc 3,5; trò chơi có kỳ vọng âm; bảo hành laptop; kỳ vọng của Bernoulli.',
  `<span class="eyebrow">IPY111 · Chapter 6 · Lesson 6.1</span>
<h2>Expected value: the long-run average</h2>
<p class="lead">A distribution is a whole list of numbers. Often we want one number that summarises its centre — the value we would get “on average” if we repeated the experiment many times. That number is the expectation.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute E[X] for a discrete random variable.</li><li>Interpret E[X] as a long-run average and a centre of mass.</li><li>Use expectation to evaluate bets, prices and warranties.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Expectation (discrete)</span>E[X] = ∑<sub>x</sub> x · P(X = x)   (a probability-weighted average of the values)</div>
<p>Think of the PMF as weights placed at the points x on a number line: E[X] is the balance point (centre of mass). By the Law of Large Numbers (Chapter 10), the average of many independent copies of X approaches E[X]. Note that E[X] need not be a possible value: a die has E[X] = 3.5.</p>
<p>Simple but important cases: a constant c has E[c] = c; an indicator has E[I<sub>A</sub>] = 1 · P(A) + 0 · P(A<sup>c</sup>) = <strong>P(A)</strong>. So a Bernoulli(p) variable has mean p.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — a die.</b> E[X] = (1 + 2 + 3 + 4 + 5 + 6)/6 = 21/6 = <b>3.5</b>.</p></div>
<div class="callout"><p><b>Example 2 — a dice game.</b> You pay 10 000 VND to roll a die; if it shows 6 you receive 30 000 VND. Your net gain G is +20 000 with probability 1/6 and −10 000 with probability 5/6.</p>
<p>E[G] = 20 000 · (1/6) − 10 000 · (5/6) = (20 000 − 50 000)/6 = <b>−5 000 VND</b> per game. Over 100 games you should expect to lose about 500 000 VND. Every casino game is designed so that E[gain] &lt; 0 for the player.</p></div>
<div class="callout"><p><b>Example 3 — extended warranty.</b> A shop sells a 1-year warranty for 500 000 VND. The probability that the laptop needs a repair in that year is 0.08 and a repair costs 4 000 000 VND. Expected repair cost = 0.08 × 4 000 000 = <b>320 000 VND</b>. On average the shop earns 180 000 VND per warranty; for you it is worth buying only if a sudden 4-million bill would really hurt (risk, not expectation, is the reason to insure).</p></div>
<div class="callout"><p><b>Example 4 — from a PMF.</b> X = number of heads in 3 tosses: E[X] = 0 · 1/8 + 1 · 3/8 + 2 · 3/8 + 3 · 1/8 = 12/8 = <b>1.5</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Averaging the possible values without weights: (−10 000 + 20 000)/2 = 5 000 is wrong.</li><li>Expecting to observe E[X] in a single trial — it is a long-run average.</li><li>Forgetting the cost already paid when computing a net gain.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>E[X] = ∑ x P(X = x): a weighted average.</li><li>It is the balance point of the PMF and the long-run average of repeated trials.</li><li>E[I<sub>A</sub>] = P(A); E[c] = c.</li><li>Fair game: E[net gain] = 0.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 4.2 Mean or Expected Value and Standard Deviation</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class04-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 4b: Discrete Random Variables: Expected Value</a></li><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/06%3A_Expected_Value_and_Variance" target="_blank" rel="noopener">Grinstead &amp; Snell — Chapter 6: Expected Value and Variance</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>X takes values 0, 1, 2 with probabilities 0.5, 0.3, 0.2. Find E[X].</li><li>A lottery ticket costs 10 000 VND; it wins 1 000 000 VND with probability 0.005, otherwise nothing. Expected net gain?</li><li>What price makes the dice game in Example 2 fair?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 0.3 + 0.4 = 0.7. 2) 0.005 × 1 000 000 − 10 000 = −5 000 VND. 3) Pay c, receive 30 000 with probability 1/6: fair when c = 30 000/6 = 5 000 VND.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 6 · Bài 6.1</span>
<h2>Kỳ vọng: giá trị trung bình dài hạn</h2>
<p class="lead">Một phân phối là cả một danh sách số. Thường ta muốn một con số tóm tắt tâm của nó — giá trị ta nhận được “trung bình” nếu lặp phép thử thật nhiều lần. Con số đó là kỳ vọng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính E[X] của biến ngẫu nhiên rời rạc.</li><li>Hiểu E[X] là trung bình dài hạn và trọng tâm.</li><li>Dùng kỳ vọng đánh giá trò cược, giá bán, gói bảo hành.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Kỳ vọng (rời rạc)</span>E[X] = ∑<sub>x</sub> x · P(X = x)   (trung bình có trọng số là xác suất của các giá trị)</div>
<p>Hình dung PMF là các quả nặng đặt tại các điểm x trên trục số: E[X] là điểm cân bằng (trọng tâm). Theo Luật số lớn (Chương 10), trung bình của nhiều bản sao độc lập của X tiến về E[X]. Lưu ý E[X] không nhất thiết là một giá trị có thể xảy ra: xúc xắc có E[X] = 3,5.</p>
<p>Các trường hợp đơn giản mà quan trọng: hằng số c có E[c] = c; biến chỉ báo có E[I<sub>A</sub>] = 1 · P(A) + 0 · P(A<sup>c</sup>) = <strong>P(A)</strong>. Vậy biến Bernoulli(p) có kỳ vọng p.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — xúc xắc.</b> E[X] = (1 + 2 + 3 + 4 + 5 + 6)/6 = 21/6 = <b>3,5</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — trò gieo xúc xắc.</b> Bạn trả 10 000 đ để gieo một xúc xắc; ra mặt 6 thì nhận 30 000 đ. Lãi ròng G là +20 000 với xác suất 1/6 và −10 000 với xác suất 5/6.</p>
<p>E[G] = 20 000 · (1/6) − 10 000 · (5/6) = (20 000 − 50 000)/6 = <b>−5 000 đ</b> mỗi ván. Chơi 100 ván, bạn nên dự kiến mất khoảng 500 000 đ. Mọi trò chơi ở sòng bạc đều được thiết kế để E[lãi] &lt; 0 với người chơi.</p></div>
<div class="callout"><p><b>Ví dụ 3 — bảo hành mở rộng.</b> Cửa hàng bán gói bảo hành 1 năm giá 500 000 đ. Xác suất laptop phải sửa trong năm là 0,08 và mỗi lần sửa tốn 4 000 000 đ. Chi phí sửa kỳ vọng = 0,08 × 4 000 000 = <b>320 000 đ</b>. Trung bình cửa hàng lãi 180 000 đ mỗi gói; với bạn, chỉ nên mua nếu một hoá đơn 4 triệu bất ngờ thật sự gây khó khăn (lý do mua bảo hiểm là rủi ro, không phải kỳ vọng).</p></div>
<div class="callout"><p><b>Ví dụ 4 — từ PMF.</b> X = số mặt H trong 3 lần tung: E[X] = 0 · 1/8 + 1 · 3/8 + 2 · 3/8 + 3 · 1/8 = 12/8 = <b>1,5</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Lấy trung bình các giá trị mà bỏ trọng số: (−10 000 + 20 000)/2 = 5 000 là sai.</li><li>Mong thấy E[X] trong một lần thử — nó là trung bình dài hạn.</li><li>Quên chi phí đã trả khi tính lãi ròng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>E[X] = ∑ x P(X = x): trung bình có trọng số.</li><li>Nó là điểm cân bằng của PMF và là trung bình dài hạn khi lặp phép thử.</li><li>E[I<sub>A</sub>] = P(A); E[c] = c.</li><li>Trò chơi công bằng: E[lãi ròng] = 0.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 4.2 Kỳ vọng và độ lệch chuẩn</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class04-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 4b: Kỳ vọng của biến ngẫu nhiên rời rạc</a></li><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/06%3A_Expected_Value_and_Variance" target="_blank" rel="noopener">Grinstead &amp; Snell — Chương 6: Kỳ vọng và phương sai</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>X nhận các giá trị 0, 1, 2 với xác suất 0,5; 0,3; 0,2. Tìm E[X].</li><li>Vé số giá 10 000 đ; trúng 1 000 000 đ với xác suất 0,005, ngược lại không trúng gì. Lãi ròng kỳ vọng?</li><li>Giá vé bao nhiêu thì trò gieo xúc xắc ở Ví dụ 2 công bằng?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 0,3 + 0,4 = 0,7. 2) 0,005 × 1 000 000 − 10 000 = −5 000 đ. 3) Trả c, nhận 30 000 với xác suất 1/6: công bằng khi c = 30 000/6 = 5 000 đ.</p></div>`);

const c62 = L('ipy111-ts-6-2',
  '6.2 — Linearity of expectation, indicators and LOTUS|||6.2 — Tính tuyến tính của kỳ vọng, biến chỉ báo và LOTUS',
  'E[aX + bY + c] = aE[X] + bE[Y] + c luôn đúng (không cần độc lập); phương pháp biến chỉ báo: kỳ vọng nhị thức np, số cặp trùng ngày sinh, số người nhận đúng thẻ; LOTUS E[g(X)] và E[g(X)] ≠ g(E[X]).',
  `<span class="eyebrow">IPY111 · Chapter 6 · Lesson 6.2</span>
<h2>Linearity of expectation, indicators and LOTUS</h2>
<p class="lead">Linearity of expectation is the most useful tool in this course. It lets us compute averages of complicated counts by breaking them into simple yes/no pieces — even when the pieces are dependent.</p>
<h3>🎯 Objectives</h3>
<ul><li>Apply linearity of expectation without assuming independence.</li><li>Use the indicator method to find expected counts.</li><li>Compute E[g(X)] with LOTUS and avoid E[g(X)] = g(E[X]).</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Linearity of expectation</span>E[aX + bY + c] = a E[X] + b E[Y] + c,   E[X<sub>1</sub> + … + X<sub>n</sub>] = E[X<sub>1</sub>] + … + E[X<sub>n</sub>]<br>— true for ANY random variables, dependent or not.</div>
<p><strong>Indicator method.</strong> To find E[number of things that happen], write the count as X = I<sub>1</sub> + I<sub>2</sub> + … + I<sub>n</sub>, where I<sub>j</sub> indicates that “thing j happens”. Then E[X] = P(thing 1) + … + P(thing n). We never need the distribution of X.</p>
<div class="formula"><span class="lbl">LOTUS (law of the unconscious statistician)</span>E[g(X)] = ∑<sub>x</sub> g(x) P(X = x)   — use the PMF of X, no need to find the PMF of g(X)</div>
<p>In general E[g(X)] ≠ g(E[X]) unless g is linear.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — binomial mean.</b> X ∼ Bin(n, p) is a sum of n Bernoulli(p) indicators, so E[X] = <b>np</b>. Guessing 10 four-option questions: E[correct] = 10 × 0.25 = 2.5.</p></div>
<div class="callout"><p><b>Example 2 — matching problem.</b> n students get random student cards back. Let I<sub>j</sub> = 1 if student j gets their own card; P(I<sub>j</sub> = 1) = 1/n. E[number of matches] = n · (1/n) = <b>1</b>, for every n. The indicators are dependent, but linearity does not care.</p></div>
<div class="callout"><p><b>Example 3 — birthday pairs.</b> Among 23 people, there are C(23, 2) = 253 pairs, each sharing a birthday with probability 1/365. E[number of matching pairs] = 253/365 ≈ <b>0.693</b>.</p></div>
<div class="callout"><p><b>Example 4 — LOTUS.</b> For a die, E[X<sup>2</sup>] = (1 + 4 + 9 + 16 + 25 + 36)/6 = 91/6 ≈ <b>15.17</b>, while (E[X])<sup>2</sup> = 3.5<sup>2</sup> = 12.25. They differ — the difference 35/12 is the variance (next lesson).</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Thinking linearity requires independence — it does not (but the product rule E[XY] = E[X]E[Y] does).</li><li>Writing E[X<sup>2</sup>] = (E[X])<sup>2</sup> or E[1/X] = 1/E[X].</li><li>Trying to find the full distribution of a count when only its mean is asked.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>E is linear, always.</li><li>Count = sum of indicators ⇒ E[count] = sum of probabilities.</li><li>Bin(n, p) has mean np; the matching problem has mean 1.</li><li>LOTUS: E[g(X)] = ∑ g(x)p(x); g(E[X]) is usually different.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class04-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 4b: properties of expected value</a></li><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/06%3A_Expected_Value_and_Variance" target="_blank" rel="noopener">Grinstead &amp; Snell — Chapter 6 (sums and indicator variables)</a></li><li><a href="https://www.youtube.com/playlist?list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo" target="_blank" rel="noopener">Harvard Stat 110 — Lectures 9–10: Expectation, Indicator Random Variables, Linearity</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Roll 10 dice. Expected number of sixes? Expected sum?</li><li>A hash table has 100 buckets; 50 keys are hashed independently and uniformly. Expected number of empty buckets?</li><li>X takes values −1, 0, 1 with probability 1/3 each. Compare E[X<sup>2</sup>] and (E[X])<sup>2</sup>.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 10/6 ≈ 1.67; 10 × 3.5 = 35. 2) 100 × (0.99)<sup>50</sup> ≈ 60.5. 3) E[X<sup>2</sup>] = 2/3, (E[X])<sup>2</sup> = 0.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 6 · Bài 6.2</span>
<h2>Tính tuyến tính của kỳ vọng, biến chỉ báo và LOTUS</h2>
<p class="lead">Tính tuyến tính của kỳ vọng là công cụ hữu ích nhất của môn. Nó cho phép tính trung bình của những số đếm phức tạp bằng cách chẻ chúng thành các mảnh có/không đơn giản — kể cả khi các mảnh phụ thuộc nhau.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp dụng tính tuyến tính của kỳ vọng mà không cần giả định độc lập.</li><li>Dùng phương pháp biến chỉ báo tính số đếm kỳ vọng.</li><li>Tính E[g(X)] bằng LOTUS và tránh nhầm E[g(X)] = g(E[X]).</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Tính tuyến tính của kỳ vọng</span>E[aX + bY + c] = a E[X] + b E[Y] + c,   E[X<sub>1</sub> + … + X<sub>n</sub>] = E[X<sub>1</sub>] + … + E[X<sub>n</sub>]<br>— đúng với MỌI biến ngẫu nhiên, phụ thuộc hay không.</div>
<p><strong>Phương pháp biến chỉ báo.</strong> Muốn tìm E[số việc xảy ra], viết số đếm thành X = I<sub>1</sub> + I<sub>2</sub> + … + I<sub>n</sub>, trong đó I<sub>j</sub> chỉ báo “việc j xảy ra”. Khi đó E[X] = P(việc 1) + … + P(việc n). Không bao giờ cần phân phối của X.</p>
<div class="formula"><span class="lbl">LOTUS (định lý “nhà thống kê vô thức”)</span>E[g(X)] = ∑<sub>x</sub> g(x) P(X = x)   — dùng PMF của X, không cần tìm PMF của g(X)</div>
<p>Nói chung E[g(X)] ≠ g(E[X]) trừ khi g tuyến tính.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — kỳ vọng nhị thức.</b> X ∼ Bin(n, p) là tổng của n biến chỉ báo Bernoulli(p), nên E[X] = <b>np</b>. Đoán mò 10 câu 4 lựa chọn: E[số câu đúng] = 10 × 0,25 = 2,5.</p></div>
<div class="callout"><p><b>Ví dụ 2 — bài toán ghép cặp.</b> n sinh viên nhận lại thẻ ngẫu nhiên. Đặt I<sub>j</sub> = 1 nếu bạn j nhận đúng thẻ mình; P(I<sub>j</sub> = 1) = 1/n. E[số bạn nhận đúng] = n · (1/n) = <b>1</b>, với mọi n. Các biến chỉ báo phụ thuộc nhau, nhưng tính tuyến tính không quan tâm.</p></div>
<div class="callout"><p><b>Ví dụ 3 — cặp trùng ngày sinh.</b> 23 người có C(23, 2) = 253 cặp, mỗi cặp trùng ngày sinh với xác suất 1/365. E[số cặp trùng] = 253/365 ≈ <b>0,693</b>.</p></div>
<div class="callout"><p><b>Ví dụ 4 — LOTUS.</b> Với xúc xắc, E[X<sup>2</sup>] = (1 + 4 + 9 + 16 + 25 + 36)/6 = 91/6 ≈ <b>15,17</b>, còn (E[X])<sup>2</sup> = 3,5<sup>2</sup> = 12,25. Chúng khác nhau — hiệu 35/12 chính là phương sai (bài sau).</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nghĩ rằng tính tuyến tính cần độc lập — không cần (nhưng quy tắc tích E[XY] = E[X]E[Y] thì cần).</li><li>Viết E[X<sup>2</sup>] = (E[X])<sup>2</sup> hoặc E[1/X] = 1/E[X].</li><li>Cố tìm toàn bộ phân phối của một số đếm khi đề chỉ hỏi kỳ vọng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>E luôn tuyến tính.</li><li>Số đếm = tổng biến chỉ báo ⇒ E[số đếm] = tổng các xác suất.</li><li>Bin(n, p) có kỳ vọng np; bài ghép cặp có kỳ vọng 1.</li><li>LOTUS: E[g(X)] = ∑ g(x)p(x); g(E[X]) thường khác.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class04-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 4b: tính chất của kỳ vọng</a></li><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/06%3A_Expected_Value_and_Variance" target="_blank" rel="noopener">Grinstead &amp; Snell — Chương 6 (tổng và biến chỉ báo)</a></li><li><a href="https://www.youtube.com/playlist?list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo" target="_blank" rel="noopener">Harvard Stat 110 — Bài giảng 9–10: kỳ vọng, biến chỉ báo, tính tuyến tính</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Gieo 10 xúc xắc. Số mặt 6 kỳ vọng? Tổng kỳ vọng?</li><li>Bảng băm có 100 ô; 50 khoá được băm độc lập, đều. Số ô trống kỳ vọng?</li><li>X nhận −1, 0, 1 mỗi giá trị với xác suất 1/3. So sánh E[X<sup>2</sup>] và (E[X])<sup>2</sup>.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 10/6 ≈ 1,67; 10 × 3,5 = 35. 2) 100 × (0,99)<sup>50</sup> ≈ 60,5. 3) E[X<sup>2</sup>] = 2/3, (E[X])<sup>2</sup> = 0.</p></div>`);

const c63 = L('ipy111-ts-6-3',
  '6.3 — Variance and standard deviation|||6.3 — Phương sai và độ lệch chuẩn',
  'Var(X) = E[(X−μ)²] = E[X²] − (E[X])², độ lệch chuẩn; Var(aX + b) = a²Var(X); phương sai tổng các biến độc lập; xúc xắc 35/12; so sánh hai phương án cùng kỳ vọng khác rủi ro.',
  `<span class="eyebrow">IPY111 · Chapter 6 · Lesson 6.3</span>
<h2>Variance and standard deviation</h2>
<p class="lead">Two investments can have the same expected return and very different risk. The variance measures how far a random variable typically strays from its mean.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute Var(X) with the definition and with the shortcut formula.</li><li>Use Var(aX + b) = a<sup>2</sup>Var(X) and the sum rule for independent variables.</li><li>Interpret the standard deviation in the units of X.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Variance and standard deviation</span>μ = E[X],  Var(X) = E[(X − μ)<sup>2</sup>] = E[X<sup>2</sup>] − (E[X])<sup>2</sup>,  SD(X) = σ = √Var(X)</div>
<p>The shortcut follows from linearity: E[(X − μ)<sup>2</sup>] = E[X<sup>2</sup>] − 2μE[X] + μ<sup>2</sup> = E[X<sup>2</sup>] − μ<sup>2</sup>. Variance is in squared units (VND<sup>2</sup>); the SD is back in the units of X, so it is the number to report.</p>
<div class="formula"><span class="lbl">Properties</span>Var(c) = 0    Var(aX + b) = a<sup>2</sup> Var(X)    SD(aX + b) = |a| SD(X)<br>If X, Y are independent: Var(X + Y) = Var(X) + Var(Y)  and  Var(X − Y) = Var(X) + Var(Y)</div>
<p>Shifting by b does not change spread; scaling by a multiplies the SD by |a|. Note the <strong>plus</strong> sign for X − Y: subtracting independent noise still adds uncertainty. For dependent variables a covariance term appears (Chapter 9).</p>
<p>Bernoulli(p): E[X<sup>2</sup>] = p, so Var = p − p<sup>2</sup> = <strong>p(1 − p)</strong> (largest at p = 1/2). Binomial = sum of n independent Bernoullis ⇒ Var = <strong>np(1 − p)</strong>.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — a die.</b> E[X] = 7/2, E[X<sup>2</sup>] = 91/6 (Lesson 6.2). Var = 91/6 − 49/4 = (182 − 147)/12 = <b>35/12 ≈ 2.917</b>, SD ≈ <b>1.708</b>.</p></div>
<div class="callout"><p><b>Example 2 — the dice game.</b> Net gain G = 30 000 · I − 10 000, where I indicates a six (p = 1/6). Var(G) = 30 000<sup>2</sup> · (1/6)(5/6) = 125 000 000 VND<sup>2</sup>, SD(G) ≈ <b>11 180 VND</b> — much bigger than the −5 000 mean: a single game is very uncertain, though on average you lose.</p></div>
<div class="callout"><p><b>Example 3 — same mean, different risk.</b> Plan A pays 1 million for sure. Plan B pays 0 or 2 million with probability 1/2 each. Both have mean 1 million; Var(A) = 0 while SD(B) = 1 million. Expectation alone cannot tell them apart.</p></div>
<div class="callout"><p><b>Example 4 — sums.</b> Two independent dice: Var(X<sub>1</sub> + X<sub>2</sub>) = 2 × 35/12 = 35/6 ≈ 5.83. But Var(2X<sub>1</sub>) = 4 × 35/12 = 35/3 ≈ 11.67: doubling one die is riskier than adding two independent dice.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing Var(aX) = a Var(X) — the factor is a<sup>2</sup>.</li><li>Var(X − Y) = Var(X) − Var(Y) (wrong, can even be negative).</li><li>Adding variances of dependent variables without the covariance term.</li><li>Adding standard deviations instead of variances.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Var(X) = E[X<sup>2</sup>] − (E[X])<sup>2</sup> ≥ 0; SD = √Var.</li><li>Var(aX + b) = a<sup>2</sup>Var(X).</li><li>Independent: variances add (for sums and differences).</li><li>Bernoulli: p(1 − p); binomial: np(1 − p).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class05-prep-a_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 5a: Variance of Discrete Random Variables</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 4.2 Mean and Standard Deviation</a></li><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/06%3A_Expected_Value_and_Variance" target="_blank" rel="noopener">Grinstead &amp; Snell — Chapter 6: variance of discrete random variables</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>X takes 0, 1, 2 with probabilities 0.5, 0.3, 0.2. Find Var(X).</li><li>If Var(X) = 4, find Var(3X − 7) and SD(3X − 7).</li><li>X ∼ Bin(100, 0.5). Find the SD of X.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) E[X] = 0.7, E[X<sup>2</sup>] = 0.3 + 0.8 = 1.1 ⇒ Var = 1.1 − 0.49 = 0.61. 2) 9 × 4 = 36; SD = 6. 3) √(100 × 0.25) = 5.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 6 · Bài 6.3</span>
<h2>Phương sai và độ lệch chuẩn</h2>
<p class="lead">Hai khoản đầu tư có thể cùng lợi nhuận kỳ vọng nhưng rủi ro rất khác. Phương sai đo một biến ngẫu nhiên thường lệch khỏi kỳ vọng của nó bao xa.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính Var(X) theo định nghĩa và theo công thức rút gọn.</li><li>Dùng Var(aX + b) = a<sup>2</sup>Var(X) và quy tắc tổng cho biến độc lập.</li><li>Hiểu độ lệch chuẩn theo đơn vị của X.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Phương sai và độ lệch chuẩn</span>μ = E[X],  Var(X) = E[(X − μ)<sup>2</sup>] = E[X<sup>2</sup>] − (E[X])<sup>2</sup>,  SD(X) = σ = √Var(X)</div>
<p>Công thức rút gọn suy từ tính tuyến tính: E[(X − μ)<sup>2</sup>] = E[X<sup>2</sup>] − 2μE[X] + μ<sup>2</sup> = E[X<sup>2</sup>] − μ<sup>2</sup>. Phương sai có đơn vị bình phương (đ<sup>2</sup>); độ lệch chuẩn trở lại đơn vị của X, nên đó là con số nên báo cáo.</p>
<div class="formula"><span class="lbl">Tính chất</span>Var(c) = 0    Var(aX + b) = a<sup>2</sup> Var(X)    SD(aX + b) = |a| SD(X)<br>Nếu X, Y độc lập: Var(X + Y) = Var(X) + Var(Y)  và  Var(X − Y) = Var(X) + Var(Y)</div>
<p>Tịnh tiến b không đổi độ phân tán; nhân a thì độ lệch chuẩn nhân |a|. Chú ý dấu <strong>cộng</strong> với X − Y: trừ đi một nhiễu độc lập vẫn làm tăng bất định. Với biến phụ thuộc sẽ có thêm số hạng hiệp phương sai (Chương 9).</p>
<p>Bernoulli(p): E[X<sup>2</sup>] = p, nên Var = p − p<sup>2</sup> = <strong>p(1 − p)</strong> (lớn nhất khi p = 1/2). Nhị thức = tổng n Bernoulli độc lập ⇒ Var = <strong>np(1 − p)</strong>.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — xúc xắc.</b> E[X] = 7/2, E[X<sup>2</sup>] = 91/6 (Bài 6.2). Var = 91/6 − 49/4 = (182 − 147)/12 = <b>35/12 ≈ 2,917</b>, SD ≈ <b>1,708</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — trò gieo xúc xắc.</b> Lãi ròng G = 30 000 · I − 10 000, với I chỉ báo ra mặt 6 (p = 1/6). Var(G) = 30 000<sup>2</sup> · (1/6)(5/6) = 125 000 000 đ<sup>2</sup>, SD(G) ≈ <b>11 180 đ</b> — lớn hơn nhiều so với kỳ vọng −5 000: một ván riêng lẻ rất bất định, dù trung bình bạn thua.</p></div>
<div class="callout"><p><b>Ví dụ 3 — cùng kỳ vọng, khác rủi ro.</b> Phương án A trả chắc chắn 1 triệu. Phương án B trả 0 hoặc 2 triệu, mỗi khả năng 1/2. Cả hai có kỳ vọng 1 triệu; Var(A) = 0 còn SD(B) = 1 triệu. Chỉ kỳ vọng thì không phân biệt được chúng.</p></div>
<div class="callout"><p><b>Ví dụ 4 — tổng.</b> Hai xúc xắc độc lập: Var(X<sub>1</sub> + X<sub>2</sub>) = 2 × 35/12 = 35/6 ≈ 5,83. Nhưng Var(2X<sub>1</sub>) = 4 × 35/12 = 35/3 ≈ 11,67: nhân đôi một xúc xắc rủi ro hơn cộng hai xúc xắc độc lập.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết Var(aX) = a Var(X) — hệ số là a<sup>2</sup>.</li><li>Var(X − Y) = Var(X) − Var(Y) (sai, thậm chí có thể ra âm).</li><li>Cộng phương sai của các biến phụ thuộc mà bỏ số hạng hiệp phương sai.</li><li>Cộng độ lệch chuẩn thay vì cộng phương sai.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Var(X) = E[X<sup>2</sup>] − (E[X])<sup>2</sup> ≥ 0; SD = √Var.</li><li>Var(aX + b) = a<sup>2</sup>Var(X).</li><li>Độc lập: phương sai cộng lại (cho cả tổng và hiệu).</li><li>Bernoulli: p(1 − p); nhị thức: np(1 − p).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class05-prep-a_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 5a: Phương sai của biến ngẫu nhiên rời rạc</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 4.2 Kỳ vọng và độ lệch chuẩn</a></li><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/06%3A_Expected_Value_and_Variance" target="_blank" rel="noopener">Grinstead &amp; Snell — Chương 6: phương sai của biến rời rạc</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>X nhận 0, 1, 2 với xác suất 0,5; 0,3; 0,2. Tìm Var(X).</li><li>Nếu Var(X) = 4, tìm Var(3X − 7) và SD(3X − 7).</li><li>X ∼ Bin(100; 0,5). Tìm độ lệch chuẩn của X.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) E[X] = 0,7, E[X<sup>2</sup>] = 0,3 + 0,8 = 1,1 ⇒ Var = 1,1 − 0,49 = 0,61. 2) 9 × 4 = 36; SD = 6. 3) √(100 × 0,25) = 5.</p></div>`);

const c64 = L('ipy111-ts-6-4',
  '6.4 — Means and variances of the named distributions (with Python)|||6.4 — Kỳ vọng và phương sai của các phân phối quan trọng (có Python)',
  'Bảng kỳ vọng/phương sai: Bernoulli, nhị thức, hình học, siêu bội, Poisson; kiểm bằng scipy.stats chạy thật; bài toán sưu tập phiếu (cần trung bình 14,7 lần gieo để thấy đủ 6 mặt).',
  `<span class="eyebrow">IPY111 · Chapter 6 · Lesson 6.4</span>
<h2>Means and variances of the named distributions</h2>
<p class="lead">Knowing the mean and variance of each standard distribution by heart saves time in every exam and every data problem. Here is the table, where each entry comes from, and a Python check.</p>
<h3>🎯 Objectives</h3>
<ul><li>Recall E and Var for Bernoulli, binomial, geometric, hypergeometric and Poisson.</li><li>Derive them with indicators and the sum rule.</li><li>Solve the coupon-collector problem with linearity.</li></ul>
<h3>📖 Lecture</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Bernoulli(p)</span><span class="v">E = p,  Var = p(1 − p)</span></div>
<div class="kv"><span class="k">Bin(n, p)</span><span class="v">E = np,  Var = np(1 − p)</span></div>
<div class="kv"><span class="k">Geom(p), trials until 1st success</span><span class="v">E = 1/p,  Var = (1 − p)/p<sup>2</sup></span></div>
<div class="kv"><span class="k">Hypergeometric(N, K, n)</span><span class="v">E = nK/N,  Var = n(K/N)(1 − K/N)(N − n)/(N − 1)</span></div>
<div class="kv"><span class="k">Poisson(λ)</span><span class="v">E = λ,  Var = λ</span></div>
</div>
<ul>
<li><strong>Binomial:</strong> sum of n independent Bernoullis ⇒ add means and variances.</li>
<li><strong>Hypergeometric:</strong> also a sum of n indicators (“draw j is a success”), each with mean K/N; they are dependent, so the variance gets the <em>finite population correction</em> (N − n)/(N − 1) &lt; 1.</li>
<li><strong>Geometric:</strong> E[X] = ∑ k(1 − p)<sup>k−1</sup>p = 1/p (or: condition on the first trial, E = 1 + (1 − p)E).</li>
<li><strong>Poisson:</strong> limit of Bin(n, λ/n): mean nλ/n = λ, variance n(λ/n)(1 − λ/n) → λ.</li>
</ul>
<pre><code class="language-python">from scipy import stats

dists = {
    "Bernoulli(0.3)": stats.bernoulli(0.3),
    "Bin(10, 0.25)": stats.binom(10, 0.25),
    "Geom(1/6)": stats.geom(1 / 6),          # trials until first success
    "HGeom(N=20,K=5,n=4)": stats.hypergeom(20, 5, 4),
    "Poisson(3)": stats.poisson(3),
}
for name, d in dists.items():
    print(f"{name:22s} mean={d.mean():.4f}  var={d.var():.4f}")
</code></pre>
<div class="out">Bernoulli(0.3)         mean=0.3000  var=0.2100
Bin(10, 0.25)          mean=2.5000  var=1.8750
Geom(1/6)              mean=6.0000  var=30.0000
HGeom(N=20,K=5,n=4)    mean=1.0000  var=0.6316
Poisson(3)             mean=3.0000  var=3.0000</div>
<p>(⚠️ <code>scipy.stats.hypergeom(M, n, N)</code> uses the order: population size, number of successes, sample size.)</p>
<h3>✍️ Worked example — the coupon collector</h3>
<div class="callout"><p>How many rolls of a die, on average, until every face has appeared at least once?</p>
<p>Step 1: split the waiting time into stages. After seeing j distinct faces, each roll shows a new face with probability (6 − j)/6, so the stage length is Geom((6 − j)/6) with mean 6/(6 − j).</p>
<p>Step 2: by linearity, E[total] = 6/6 + 6/5 + 6/4 + 6/3 + 6/2 + 6/1 = 6(1 + 1/2 + … + 1/6) = <b>14.7</b> rolls.</p>
<p>In general, collecting n coupons takes on average n(1 + 1/2 + … + 1/n) ≈ n ln n draws — e.g. about 225 draws for 50 stickers. This also estimates how many random requests are needed until every server in a pool of n has been hit.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using the geometric mean 1/p with the “failures” convention (whose mean is (1 − p)/p).</li><li>Forgetting the finite population correction for the hypergeometric variance.</li><li>Thinking Poisson mean = variance holds for any count data — overdispersed data (variance &gt; mean) are common in practice.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Memorise the five (E, Var) pairs above.</li><li>Sums of indicators give binomial and hypergeometric means.</li><li>Geometric mean 1/p; coupon collector n(1 + 1/2 + … + 1/n).</li><li>Check any formula numerically with <code>scipy.stats</code>.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://docs.scipy.org/doc/scipy/reference/stats.html" target="_blank" rel="noopener">SciPy — scipy.stats (all distributions, mean/var/pmf/cdf)</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class05-prep-a_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 5a: variance of the binomial and geometric</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/4-4-geometric-distribution" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 4.4 Geometric Distribution (mean and SD)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A server answers requests with failure probability 0.02. Expected number of requests until the first failure? Its SD?</li><li>Poisson(4): mean, variance, SD?</li><li>Expected number of rolls to see all 6 faces, if you have already seen 4 distinct faces?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 1/0.02 = 50; √(0.98/0.0004) ≈ 49.5. 2) 4, 4, 2. 3) 6/2 + 6/1 = 9.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 6 · Bài 6.4</span>
<h2>Kỳ vọng và phương sai của các phân phối quan trọng</h2>
<p class="lead">Thuộc kỳ vọng và phương sai của từng phân phối chuẩn giúp tiết kiệm thời gian trong mọi bài thi và mọi bài toán dữ liệu. Dưới đây là bảng, nguồn gốc từng dòng, và phần kiểm bằng Python.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhớ E và Var của Bernoulli, nhị thức, hình học, siêu bội, Poisson.</li><li>Suy ra chúng bằng biến chỉ báo và quy tắc tổng.</li><li>Giải bài toán sưu tập phiếu bằng tính tuyến tính.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Bernoulli(p)</span><span class="v">E = p,  Var = p(1 − p)</span></div>
<div class="kv"><span class="k">Bin(n, p)</span><span class="v">E = np,  Var = np(1 − p)</span></div>
<div class="kv"><span class="k">Geom(p), số lần thử đến thành công đầu</span><span class="v">E = 1/p,  Var = (1 − p)/p<sup>2</sup></span></div>
<div class="kv"><span class="k">Siêu bội (N, K, n)</span><span class="v">E = nK/N,  Var = n(K/N)(1 − K/N)(N − n)/(N − 1)</span></div>
<div class="kv"><span class="k">Poisson(λ)</span><span class="v">E = λ,  Var = λ</span></div>
</div>
<ul>
<li><strong>Nhị thức:</strong> tổng n Bernoulli độc lập ⇒ cộng kỳ vọng và phương sai.</li>
<li><strong>Siêu bội:</strong> cũng là tổng n biến chỉ báo (“lần rút j là thành công”), mỗi cái kỳ vọng K/N; chúng phụ thuộc nhau, nên phương sai có thêm <em>hệ số hiệu chỉnh tổng thể hữu hạn</em> (N − n)/(N − 1) &lt; 1.</li>
<li><strong>Hình học:</strong> E[X] = ∑ k(1 − p)<sup>k−1</sup>p = 1/p (hoặc: lấy điều kiện theo lần thử đầu, E = 1 + (1 − p)E).</li>
<li><strong>Poisson:</strong> giới hạn của Bin(n, λ/n): kỳ vọng nλ/n = λ, phương sai n(λ/n)(1 − λ/n) → λ.</li>
</ul>
<pre><code class="language-python">from scipy import stats

dists = {
    "Bernoulli(0.3)": stats.bernoulli(0.3),
    "Bin(10, 0.25)": stats.binom(10, 0.25),
    "Geom(1/6)": stats.geom(1 / 6),          # trials until first success
    "HGeom(N=20,K=5,n=4)": stats.hypergeom(20, 5, 4),
    "Poisson(3)": stats.poisson(3),
}
for name, d in dists.items():
    print(f"{name:22s} mean={d.mean():.4f}  var={d.var():.4f}")
</code></pre>
<div class="out">Bernoulli(0.3)         mean=0.3000  var=0.2100
Bin(10, 0.25)          mean=2.5000  var=1.8750
Geom(1/6)              mean=6.0000  var=30.0000
HGeom(N=20,K=5,n=4)    mean=1.0000  var=0.6316
Poisson(3)             mean=3.0000  var=3.0000</div>
<p>(⚠️ <code>scipy.stats.hypergeom(M, n, N)</code> dùng thứ tự: cỡ tổng thể, số thành công, cỡ mẫu.)</p>
<h3>✍️ Ví dụ — bài toán sưu tập phiếu</h3>
<div class="callout"><p>Trung bình phải gieo xúc xắc bao nhiêu lần cho đến khi mọi mặt đều xuất hiện ít nhất một lần?</p>
<p>Bước 1: chia thời gian chờ thành các chặng. Sau khi đã thấy j mặt khác nhau, mỗi lần gieo ra mặt mới với xác suất (6 − j)/6, nên độ dài chặng là Geom((6 − j)/6) với kỳ vọng 6/(6 − j).</p>
<p>Bước 2: theo tính tuyến tính, E[tổng] = 6/6 + 6/5 + 6/4 + 6/3 + 6/2 + 6/1 = 6(1 + 1/2 + … + 1/6) = <b>14,7</b> lần gieo.</p>
<p>Tổng quát, sưu tập đủ n loại phiếu cần trung bình n(1 + 1/2 + … + 1/n) ≈ n ln n lần rút — ví dụ khoảng 225 lần cho bộ 50 hình dán. Con số này cũng ước lượng cần bao nhiêu request ngẫu nhiên để mọi server trong cụm n máy đều được gọi tới.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng kỳ vọng hình học 1/p với quy ước “số thất bại” (kỳ vọng của nó là (1 − p)/p).</li><li>Quên hệ số hiệu chỉnh tổng thể hữu hạn trong phương sai siêu bội.</li><li>Nghĩ rằng “kỳ vọng = phương sai” của Poisson đúng với mọi dữ liệu đếm — dữ liệu phân tán quá mức (phương sai &gt; kỳ vọng) rất phổ biến trong thực tế.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Thuộc năm cặp (E, Var) ở trên.</li><li>Tổng biến chỉ báo cho kỳ vọng nhị thức và siêu bội.</li><li>Hình học có kỳ vọng 1/p; sưu tập phiếu n(1 + 1/2 + … + 1/n).</li><li>Kiểm mọi công thức bằng số với <code>scipy.stats</code>.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://docs.scipy.org/doc/scipy/reference/stats.html" target="_blank" rel="noopener">SciPy — scipy.stats (mọi phân phối, mean/var/pmf/cdf)</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class05-prep-a_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 5a: phương sai của nhị thức và hình học</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/4-4-geometric-distribution" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 4.4 Phân phối hình học (kỳ vọng và độ lệch chuẩn)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Server trả lời request với xác suất lỗi 0,02. Số request kỳ vọng đến lần lỗi đầu tiên? Độ lệch chuẩn?</li><li>Poisson(4): kỳ vọng, phương sai, độ lệch chuẩn?</li><li>Số lần gieo kỳ vọng để thấy đủ 6 mặt, nếu đã thấy 4 mặt khác nhau?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 1/0,02 = 50; √(0,98/0,0004) ≈ 49,5. 2) 4, 4, 2. 3) 6/2 + 6/1 = 9.</p></div>`);

const q6 = QZ(6, 'Quiz — Chapter 6: Expectation and variance|||Quiz — Chương 6: Kỳ vọng và phương sai', 'Kiểm tra chương 6: kỳ vọng, tuyến tính, biến chỉ báo, LOTUS, phương sai, tính chất, bảng kỳ vọng/phương sai, sưu tập phiếu.', [
  Q('q1', "E[X] for a fair die is|||E[X] của xúc xắc cân đối là",
    ['3|||3', '3.5|||3,5', '4|||4', '21|||21'], 1,
    "21/6 = 3.5.|||21/6 = 3,5."),
  Q('q2', "Pay 10 000, win 30 000 if a die shows 6. Expected net gain =|||Trả 10 000, thắng 30 000 nếu ra mặt 6. Lãi ròng kỳ vọng =",
    ['+5 000|||+5 000', '−5 000|||−5 000', '0|||0', '−10 000|||−10 000'], 1,
    "20 000/6 − 50 000/6 = −5 000.|||20 000/6 − 50 000/6 = −5 000."),
  Q('q3', "Linearity E[X + Y] = E[X] + E[Y] requires|||Tính tuyến tính E[X + Y] = E[X] + E[Y] đòi hỏi",
    ['X, Y independent|||X, Y độc lập', 'X, Y identically distributed|||X, Y cùng phân phối', 'nothing (always true)|||không gì cả (luôn đúng)', 'X, Y disjoint|||X, Y xung khắc'], 2,
    "Linearity holds for any random variables with finite means.|||Tính tuyến tính đúng với mọi biến ngẫu nhiên có kỳ vọng hữu hạn."),
  Q('q4', "In the matching problem with n people, E[number of matches] =|||Bài ghép cặp với n người, E[số người nhận đúng] =",
    ['1/n|||1/n', '1|||1', '1 − 1/e|||1 − 1/e', 'n/2|||n/2'], 1,
    "n indicators each with probability 1/n.|||n biến chỉ báo, mỗi cái xác suất 1/n."),
  Q('q5', "For a fair die, E[X²] =|||Với xúc xắc cân đối, E[X²] =",
    ['12.25|||12,25', '91/6 ≈ 15.17|||91/6 ≈ 15,17', '35/12|||35/12', '21|||21'], 1,
    "LOTUS: (1 + 4 + … + 36)/6.|||LOTUS: (1 + 4 + … + 36)/6."),
  Q('q6', "Var of a fair die =|||Phương sai của xúc xắc cân đối =",
    ['35/12|||35/12', '3.5|||3,5', '91/6|||91/6', '1.708|||1,708'], 0,
    "91/6 − 49/4 = 35/12 (SD ≈ 1.708).|||91/6 − 49/4 = 35/12 (SD ≈ 1,708)."),
  Q('q7', "If Var(X) = 4 then Var(3X − 7) =|||Nếu Var(X) = 4 thì Var(3X − 7) =",
    ['5|||5', '12|||12', '36|||36', '29|||29'], 2,
    "a² Var(X) = 9 × 4.|||a² Var(X) = 9 × 4."),
  Q('q8', "X, Y independent with Var 2 and 3. Var(X − Y) =|||X, Y độc lập với phương sai 2 và 3. Var(X − Y) =",
    ['−1|||−1', '1|||1', '5|||5', '6|||6'], 2,
    "Variances add for differences of independent variables.|||Phương sai cộng lại kể cả với hiệu các biến độc lập."),
  Q('q9', "Mean and variance of Poisson(λ):|||Kỳ vọng và phương sai của Poisson(λ):",
    ['λ and λ²|||λ và λ²', 'λ and λ|||λ và λ', '1/λ and 1/λ²|||1/λ và 1/λ²', 'λ and √λ|||λ và √λ'], 1,
    "Both equal λ.|||Cả hai bằng λ."),
  Q('q10', "Expected number of die rolls to see all six faces:|||Số lần gieo kỳ vọng để thấy đủ sáu mặt:",
    ['6|||6', '12|||12', '14.7|||14,7', '36|||36'], 2,
    "6(1 + 1/2 + … + 1/6) = 14.7.|||6(1 + 1/2 + … + 1/6) = 14,7."),
]);

const ch6 = {
  title: 'Chapter 6 — Expectation and variance|||Chương 6 — Kỳ vọng và phương sai',
  description: 'Kỳ vọng, tính tuyến tính và biến chỉ báo, LOTUS; phương sai, độ lệch chuẩn và tính chất; bảng kỳ vọng/phương sai các phân phối kiểm bằng scipy; bài toán sưu tập phiếu (Blitzstein & Hwang ch.4 · Ross 4.3–4.6).',
  lessons: [c61, c62, c63, c64, q6],
};

// ───────────────────────────── Chương 7 — Biến ngẫu nhiên liên tục ─────────────────────────────
const c71 = L('ipy111-ts-7-1',
  '7.1 — Continuous random variables: PDF, CDF, expectation and variance|||7.1 — Biến ngẫu nhiên liên tục: hàm mật độ, hàm phân phối, kỳ vọng, phương sai',
  'Hàm mật độ f(x) ≥ 0, ∫f = 1, xác suất là diện tích; P(X = a) = 0; CDF F(x) = ∫f và F′ = f; E[X] = ∫x f(x)dx, phương sai; ví dụ f(x) = 2x và f(x) = cx² (dùng tích phân CAL111).',
  `<span class="eyebrow">IPY111 · Chapter 7 · Lesson 7.1</span>
<h2>Continuous random variables: PDF, CDF, expectation and variance</h2>
<p class="lead">Waiting times, response latencies, heights and measurement errors can take any real value in an interval. For them, probability is no longer a sum over points but an <em>area under a curve</em>.</p>
<h3>🎯 Objectives</h3>
<ul><li>Use a probability density function (PDF) to compute probabilities as integrals.</li><li>Move between PDF and CDF (F′ = f).</li><li>Compute E[X], Var(X) and the median of a continuous random variable.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Probability density function</span>f(x) ≥ 0,  ∫<sub>−∞</sub><sup>∞</sup> f(x) dx = 1,   P(a ≤ X ≤ b) = ∫<sub>a</sub><sup>b</sup> f(x) dx</div>
<p>Consequences: P(X = a) = ∫<sub>a</sub><sup>a</sup> f = 0 for every single point, so ≤ and &lt; give the same probability. f(x) itself is <em>not</em> a probability (it can exceed 1); f(x)·Δx ≈ P(x ≤ X ≤ x + Δx) for small Δx.</p>
<div class="formula"><span class="lbl">CDF, expectation, variance</span>F(x) = P(X ≤ x) = ∫<sub>−∞</sub><sup>x</sup> f(t) dt,   f(x) = F′(x)<br>E[X] = ∫ x f(x) dx,   E[g(X)] = ∫ g(x) f(x) dx (LOTUS),   Var(X) = E[X<sup>2</sup>] − (E[X])<sup>2</sup><br>Median m: F(m) = 1/2</div>
<p>All the rules of Chapter 6 — linearity, Var(aX + b) = a<sup>2</sup>Var(X) — carry over unchanged; only sums become integrals. This is where Calculus I (CAL111) is used.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — f(x) = 2x on [0, 1].</b> Valid: ∫<sub>0</sub><sup>1</sup> 2x dx = 1.</p>
<p>P(X ≤ 0.5) = ∫<sub>0</sub><sup>0.5</sup> 2x dx = 0.5<sup>2</sup> = <b>1/4</b>. CDF: F(x) = x<sup>2</sup> on [0, 1].</p>
<p>E[X] = ∫<sub>0</sub><sup>1</sup> 2x<sup>2</sup> dx = <b>2/3</b>; E[X<sup>2</sup>] = ∫<sub>0</sub><sup>1</sup> 2x<sup>3</sup> dx = 1/2; Var(X) = 1/2 − 4/9 = <b>1/18</b>. Median: m<sup>2</sup> = 1/2 ⇒ m = 1/√2 ≈ 0.707.</p></div>
<div class="callout"><p><b>Example 2 — find the constant.</b> f(x) = c x<sup>2</sup> on [0, 3], 0 elsewhere.</p>
<p>Step 1: ∫<sub>0</sub><sup>3</sup> c x<sup>2</sup> dx = 9c = 1 ⇒ c = <b>1/9</b>.</p>
<p>Step 2: P(X ≤ 1) = ∫<sub>0</sub><sup>1</sup> x<sup>2</sup>/9 dx = <b>1/27</b>.</p>
<p>Step 3: E[X] = ∫<sub>0</sub><sup>3</sup> x<sup>3</sup>/9 dx = 81/36 = <b>9/4 = 2.25</b>. Median: F(m) = m<sup>3</sup>/27 = 1/2 ⇒ m = 3/∛2 ≈ <b>2.381</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Reading f(x) as a probability; only areas are probabilities.</li><li>Forgetting that f is 0 outside its support when integrating.</li><li>Confusing the median (F(m) = 1/2) with the mean (balance point) — they differ for skewed densities.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Probability = area under the PDF; single points have probability 0.</li><li>F(x) = ∫<sub>−∞</sub><sup>x</sup> f and f = F′.</li><li>E[X] = ∫ x f(x) dx, Var = E[X<sup>2</sup>] − (E[X])<sup>2</sup>.</li><li>Every discrete rule holds with ∑ replaced by ∫.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/5-1-continuous-probability-functions" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 5.1 Continuous Probability Functions</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class05-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 5b: Continuous Random Variables</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class06-prep-a_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 6a: Expectation, Variance and SD for Continuous Random Variables</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>f(x) = 3x<sup>2</sup> on [0, 1]. Find P(X &gt; 0.5), E[X] and Var(X).</li><li>F(x) = 1 − 1/x<sup>2</sup> for x ≥ 1 (0 otherwise). Find the PDF and P(X ≤ 2).</li><li>Can a PDF take the value 5 somewhere? Give an example.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 1 − 0.125 = 0.875; E = 3/4; E[X<sup>2</sup>] = 3/5 ⇒ Var = 3/5 − 9/16 = 3/80. 2) f(x) = 2/x<sup>3</sup> for x ≥ 1; F(2) = 3/4. 3) Yes: uniform on [0, 0.2] has f = 5 there.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 7 · Bài 7.1</span>
<h2>Biến ngẫu nhiên liên tục: hàm mật độ, hàm phân phối, kỳ vọng, phương sai</h2>
<p class="lead">Thời gian chờ, độ trễ phản hồi, chiều cao và sai số đo có thể nhận bất kỳ giá trị thực nào trong một khoảng. Với chúng, xác suất không còn là tổng trên các điểm mà là <em>diện tích dưới một đường cong</em>.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dùng hàm mật độ xác suất (PDF) để tính xác suất bằng tích phân.</li><li>Chuyển qua lại giữa PDF và CDF (F′ = f).</li><li>Tính E[X], Var(X) và trung vị của biến ngẫu nhiên liên tục.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Hàm mật độ xác suất</span>f(x) ≥ 0,  ∫<sub>−∞</sub><sup>∞</sup> f(x) dx = 1,   P(a ≤ X ≤ b) = ∫<sub>a</sub><sup>b</sup> f(x) dx</div>
<p>Hệ quả: P(X = a) = ∫<sub>a</sub><sup>a</sup> f = 0 với mọi điểm, nên ≤ và &lt; cho cùng xác suất. Bản thân f(x) <em>không</em> phải xác suất (nó có thể lớn hơn 1); f(x)·Δx ≈ P(x ≤ X ≤ x + Δx) khi Δx nhỏ.</p>
<div class="formula"><span class="lbl">CDF, kỳ vọng, phương sai</span>F(x) = P(X ≤ x) = ∫<sub>−∞</sub><sup>x</sup> f(t) dt,   f(x) = F′(x)<br>E[X] = ∫ x f(x) dx,   E[g(X)] = ∫ g(x) f(x) dx (LOTUS),   Var(X) = E[X<sup>2</sup>] − (E[X])<sup>2</sup><br>Trung vị m: F(m) = 1/2</div>
<p>Mọi quy tắc ở Chương 6 — tính tuyến tính, Var(aX + b) = a<sup>2</sup>Var(X) — giữ nguyên; chỉ có tổng thành tích phân. Đây là chỗ dùng Giải tích I (CAL111).</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — f(x) = 2x trên [0, 1].</b> Hợp lệ: ∫<sub>0</sub><sup>1</sup> 2x dx = 1.</p>
<p>P(X ≤ 0,5) = ∫<sub>0</sub><sup>0,5</sup> 2x dx = 0,5<sup>2</sup> = <b>1/4</b>. CDF: F(x) = x<sup>2</sup> trên [0, 1].</p>
<p>E[X] = ∫<sub>0</sub><sup>1</sup> 2x<sup>2</sup> dx = <b>2/3</b>; E[X<sup>2</sup>] = ∫<sub>0</sub><sup>1</sup> 2x<sup>3</sup> dx = 1/2; Var(X) = 1/2 − 4/9 = <b>1/18</b>. Trung vị: m<sup>2</sup> = 1/2 ⇒ m = 1/√2 ≈ 0,707.</p></div>
<div class="callout"><p><b>Ví dụ 2 — tìm hằng số.</b> f(x) = c x<sup>2</sup> trên [0, 3], bằng 0 ở ngoài.</p>
<p>Bước 1: ∫<sub>0</sub><sup>3</sup> c x<sup>2</sup> dx = 9c = 1 ⇒ c = <b>1/9</b>.</p>
<p>Bước 2: P(X ≤ 1) = ∫<sub>0</sub><sup>1</sup> x<sup>2</sup>/9 dx = <b>1/27</b>.</p>
<p>Bước 3: E[X] = ∫<sub>0</sub><sup>3</sup> x<sup>3</sup>/9 dx = 81/36 = <b>9/4 = 2,25</b>. Trung vị: F(m) = m<sup>3</sup>/27 = 1/2 ⇒ m = 3/∛2 ≈ <b>2,381</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đọc f(x) như một xác suất; chỉ diện tích mới là xác suất.</li><li>Quên rằng f bằng 0 ngoài miền xác định khi tích phân.</li><li>Nhầm trung vị (F(m) = 1/2) với kỳ vọng (điểm cân bằng) — chúng khác nhau với mật độ lệch.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Xác suất = diện tích dưới PDF; mỗi điểm đơn lẻ có xác suất 0.</li><li>F(x) = ∫<sub>−∞</sub><sup>x</sup> f và f = F′.</li><li>E[X] = ∫ x f(x) dx, Var = E[X<sup>2</sup>] − (E[X])<sup>2</sup>.</li><li>Mọi quy tắc rời rạc vẫn đúng khi thay ∑ bằng ∫.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/5-1-continuous-probability-functions" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 5.1 Hàm xác suất liên tục</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class05-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 5b: Biến ngẫu nhiên liên tục</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class06-prep-a_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 6a: Kỳ vọng, phương sai, độ lệch chuẩn của biến liên tục</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>f(x) = 3x<sup>2</sup> trên [0, 1]. Tìm P(X &gt; 0,5), E[X] và Var(X).</li><li>F(x) = 1 − 1/x<sup>2</sup> với x ≥ 1 (bằng 0 nếu không). Tìm PDF và P(X ≤ 2).</li><li>PDF có thể nhận giá trị 5 ở đâu đó không? Cho ví dụ.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 1 − 0,125 = 0,875; E = 3/4; E[X<sup>2</sup>] = 3/5 ⇒ Var = 3/5 − 9/16 = 3/80. 2) f(x) = 2/x<sup>3</sup> với x ≥ 1; F(2) = 3/4. 3) Có: phân phối đều trên [0; 0,2] có f = 5 ở đó.</p></div>`);

const c72 = L('ipy111-ts-7-2',
  '7.2 — Uniform and exponential distributions; the memoryless property|||7.2 — Phân phối đều và phân phối mũ; tính không nhớ',
  'Phân phối đều U(a,b): kỳ vọng (a+b)/2, phương sai (b−a)²/12, chờ xe buýt; phân phối mũ Exp(λ): CDF 1 − e^(−λx), kỳ vọng 1/λ, trung vị ln2/λ, tuổi thọ linh kiện, tính không nhớ, liên hệ với quá trình Poisson.',
  `<span class="eyebrow">IPY111 · Chapter 7 · Lesson 7.2</span>
<h2>Uniform and exponential distributions</h2>
<p class="lead">The uniform distribution models “no value in the interval is preferred” — random number generators, arrival within a schedule window. The exponential distribution models waiting times for events that happen at a constant rate — the continuous cousin of the geometric.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute probabilities, mean and variance for U(a, b).</li><li>Use Exp(λ): CDF, mean, median and survival probabilities.</li><li>Explain the memoryless property and the link with Poisson counts.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Uniform U(a, b)</span>f(x) = 1/(b − a) on [a, b];  P(c ≤ X ≤ d) = (d − c)/(b − a);  E[X] = (a + b)/2;  Var(X) = (b − a)<sup>2</sup>/12</div>
<div class="formula"><span class="lbl">Exponential Exp(λ), rate λ &gt; 0</span>f(x) = λ e<sup>−λx</sup>, x ≥ 0;   F(x) = 1 − e<sup>−λx</sup>;   P(X &gt; x) = e<sup>−λx</sup><br>E[X] = 1/λ;   Var(X) = 1/λ<sup>2</sup>;   median = ln 2 / λ</div>
<p><strong>Memoryless:</strong> P(X &gt; s + t | X &gt; s) = e<sup>−λ(s+t)</sup>/e<sup>−λs</sup> = e<sup>−λt</sup> = P(X &gt; t). A component that has already survived s hours is “as good as new”. The exponential is the <em>only</em> continuous distribution with this property — so it fits electronic parts that fail by random shocks, but not parts that wear out (tyres, batteries).</p>
<p><strong>Link with Poisson:</strong> if events arrive as a Poisson process with rate λ per unit time (Poisson(λt) events in a window of length t), the waiting time until the next event is Exp(λ): P(wait &gt; t) = P(no event in [0, t]) = e<sup>−λt</sup>.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — the bus.</b> A bus comes every 15 minutes; you arrive at a random time, so your wait W ∼ U(0, 15). P(W &gt; 10) = 5/15 = <b>1/3</b>. E[W] = <b>7.5</b> min, Var(W) = 225/12 = 18.75, SD ≈ 4.33 min.</p></div>
<div class="callout"><p><b>Example 2 — SSD lifetime.</b> T ∼ Exp with mean 1 000 hours (λ = 0.001 per hour).</p>
<p>P(T &gt; 1 500) = e<sup>−1.5</sup> ≈ <b>0.2231</b>. P(T &lt; 500) = 1 − e<sup>−0.5</sup> ≈ <b>0.3935</b>. Median = 1 000 ln 2 ≈ <b>693 hours</b> — below the mean, because the density is right-skewed.</p>
<p>Memoryless: P(T &gt; 2 500 | T &gt; 1 000) = e<sup>−1.5</sup> ≈ 0.2231, the same as for a new drive.</p></div>
<div class="callout"><p><b>Example 3 — tickets again.</b> Tickets arrive as a Poisson process with 3 per hour. Time to the next ticket ∼ Exp(3 per hour): mean 1/3 hour = 20 minutes; P(no ticket in the next 30 minutes) = e<sup>−3 × 0.5</sup> = e<sup>−1.5</sup> ≈ 0.223.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Confusing the rate λ with the mean 1/λ — software also differs: <code>scipy.stats.expon</code> uses <code>scale = 1/λ</code>.</li><li>Using the exponential for things that age (memorylessness is a strong assumption).</li><li>Forgetting the /12 in the uniform variance.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>U(a, b): probability = length ratio; mean (a + b)/2; variance (b − a)<sup>2</sup>/12.</li><li>Exp(λ): P(X &gt; x) = e<sup>−λx</sup>; mean 1/λ; median ln 2/λ.</li><li>Exponential = memoryless waiting time.</li><li>Poisson counts ⇔ exponential gaps between events.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/5-2-the-uniform-distribution" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 5.2 The Uniform Distribution</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/5-3-the-exponential-distribution" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 5.3 The Exponential Distribution</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class05-prep-c_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 5c: Gallery of Continuous Random Variables</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.expon.html" target="_blank" rel="noopener">SciPy — scipy.stats.expon</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>X ∼ U(2, 8). Find P(3 &lt; X &lt; 5), E[X] and SD(X).</li><li>Requests arrive at 2 per second (Poisson). P(the gap to the next request exceeds 1 second)?</li><li>A part's lifetime is Exp with mean 5 years. It has worked for 3 years. P(it works at least 5 more years)?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 2/6 = 1/3; 5; √(36/12) = √3 ≈ 1.732. 2) e<sup>−2</sup> ≈ 0.135. 3) Memoryless: e<sup>−5/5</sup> = e<sup>−1</sup> ≈ 0.368.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 7 · Bài 7.2</span>
<h2>Phân phối đều và phân phối mũ</h2>
<p class="lead">Phân phối đều mô hình hoá “không giá trị nào trong khoảng được ưu tiên” — bộ sinh số ngẫu nhiên, thời điểm đến trong một khung giờ. Phân phối mũ mô hình hoá thời gian chờ các biến cố xảy ra với tốc độ không đổi — người anh em liên tục của phân phối hình học.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính xác suất, kỳ vọng, phương sai của U(a, b).</li><li>Dùng Exp(λ): CDF, kỳ vọng, trung vị, xác suất “sống sót”.</li><li>Giải thích tính không nhớ và liên hệ với số đếm Poisson.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Phân phối đều U(a, b)</span>f(x) = 1/(b − a) trên [a, b];  P(c ≤ X ≤ d) = (d − c)/(b − a);  E[X] = (a + b)/2;  Var(X) = (b − a)<sup>2</sup>/12</div>
<div class="formula"><span class="lbl">Phân phối mũ Exp(λ), tốc độ λ &gt; 0</span>f(x) = λ e<sup>−λx</sup>, x ≥ 0;   F(x) = 1 − e<sup>−λx</sup>;   P(X &gt; x) = e<sup>−λx</sup><br>E[X] = 1/λ;   Var(X) = 1/λ<sup>2</sup>;   trung vị = ln 2 / λ</div>
<p><strong>Không nhớ:</strong> P(X &gt; s + t | X &gt; s) = e<sup>−λ(s+t)</sup>/e<sup>−λs</sup> = e<sup>−λt</sup> = P(X &gt; t). Một linh kiện đã sống được s giờ thì “như mới”. Phân phối mũ là phân phối liên tục <em>duy nhất</em> có tính chất này — nên nó hợp với linh kiện điện tử hỏng do sốc ngẫu nhiên, nhưng không hợp với thứ bị mài mòn (lốp xe, pin).</p>
<p><strong>Liên hệ với Poisson:</strong> nếu biến cố đến theo quá trình Poisson với tốc độ λ mỗi đơn vị thời gian (Poisson(λt) biến cố trong khoảng dài t), thì thời gian chờ đến biến cố tiếp theo là Exp(λ): P(chờ &gt; t) = P(không có biến cố trong [0, t]) = e<sup>−λt</sup>.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — xe buýt.</b> Cứ 15 phút có một chuyến; bạn đến vào thời điểm ngẫu nhiên, nên thời gian chờ W ∼ U(0, 15). P(W &gt; 10) = 5/15 = <b>1/3</b>. E[W] = <b>7,5</b> phút, Var(W) = 225/12 = 18,75, SD ≈ 4,33 phút.</p></div>
<div class="callout"><p><b>Ví dụ 2 — tuổi thọ SSD.</b> T ∼ Exp với kỳ vọng 1 000 giờ (λ = 0,001 mỗi giờ).</p>
<p>P(T &gt; 1 500) = e<sup>−1,5</sup> ≈ <b>0,2231</b>. P(T &lt; 500) = 1 − e<sup>−0,5</sup> ≈ <b>0,3935</b>. Trung vị = 1 000 ln 2 ≈ <b>693 giờ</b> — nhỏ hơn kỳ vọng vì mật độ lệch phải.</p>
<p>Không nhớ: P(T &gt; 2 500 | T &gt; 1 000) = e<sup>−1,5</sup> ≈ 0,2231, giống hệt ổ mới.</p></div>
<div class="callout"><p><b>Ví dụ 3 — lại là ticket.</b> Ticket đến theo quá trình Poisson 3 cái mỗi giờ. Thời gian đến ticket tiếp theo ∼ Exp(3 mỗi giờ): kỳ vọng 1/3 giờ = 20 phút; P(không có ticket nào trong 30 phút tới) = e<sup>−3 × 0,5</sup> = e<sup>−1,5</sup> ≈ 0,223.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nhầm tốc độ λ với kỳ vọng 1/λ — phần mềm cũng khác nhau: <code>scipy.stats.expon</code> dùng <code>scale = 1/λ</code>.</li><li>Dùng phân phối mũ cho thứ bị lão hoá (không nhớ là giả thiết mạnh).</li><li>Quên chia 12 trong phương sai của phân phối đều.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>U(a, b): xác suất = tỉ lệ độ dài; kỳ vọng (a + b)/2; phương sai (b − a)<sup>2</sup>/12.</li><li>Exp(λ): P(X &gt; x) = e<sup>−λx</sup>; kỳ vọng 1/λ; trung vị ln 2/λ.</li><li>Phân phối mũ = thời gian chờ không nhớ.</li><li>Số đếm Poisson ⇔ khoảng cách mũ giữa các biến cố.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/5-2-the-uniform-distribution" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 5.2 Phân phối đều</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/5-3-the-exponential-distribution" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 5.3 Phân phối mũ</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class05-prep-c_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 5c: Bộ sưu tập biến ngẫu nhiên liên tục</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.expon.html" target="_blank" rel="noopener">SciPy — scipy.stats.expon</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>X ∼ U(2, 8). Tìm P(3 &lt; X &lt; 5), E[X] và SD(X).</li><li>Request đến 2 cái mỗi giây (Poisson). P(khoảng cách đến request tiếp theo vượt 1 giây)?</li><li>Tuổi thọ một linh kiện là Exp với kỳ vọng 5 năm. Nó đã chạy 3 năm. P(nó chạy thêm ít nhất 5 năm)?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 2/6 = 1/3; 5; √(36/12) = √3 ≈ 1,732. 2) e<sup>−2</sup> ≈ 0,135. 3) Không nhớ: e<sup>−5/5</sup> = e<sup>−1</sup> ≈ 0,368.</p></div>`);

const c73 = L('ipy111-ts-7-3',
  '7.3 — The normal distribution and standardisation (with Python)|||7.3 — Phân phối chuẩn và chuẩn hoá Z (có Python)',
  'Phân phối chuẩn N(μ, σ²), quy tắc 68–95–99,7, chuẩn hoá Z = (X − μ)/σ, tra Φ, phân vị; điểm thi μ = 70, σ = 10; kiểm bằng scipy.stats.norm chạy thật.',
  `<span class="eyebrow">IPY111 · Chapter 7 · Lesson 7.3</span>
<h2>The normal distribution and standardisation</h2>
<p class="lead">The bell curve describes measurement errors, exam scores, heights — and, thanks to the Central Limit Theorem (Chapter 10), the averages of almost anything. Every normal distribution is a stretched and shifted copy of one standard curve.</p>
<h3>🎯 Objectives</h3>
<ul><li>Describe N(μ, σ<sup>2</sup>) and the 68–95–99.7 rule.</li><li>Standardise to Z and compute probabilities with Φ.</li><li>Find percentiles (inverse problems) with z-values and Python.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Normal N(μ, σ<sup>2</sup>)</span>f(x) = (1 / (σ√(2π))) · e<sup>−(x − μ)<sup>2</sup> / (2σ<sup>2</sup>)</sup>,  E[X] = μ,  Var(X) = σ<sup>2</sup></div>
<p>Symmetric about μ, bell-shaped, with inflection points at μ ± σ. The CDF has no elementary formula; we use the standard normal CDF Φ(z) = P(Z ≤ z) for Z ∼ N(0, 1), from a table or software.</p>
<div class="formula"><span class="lbl">Standardisation</span>If X ∼ N(μ, σ<sup>2</sup>) then Z = (X − μ)/σ ∼ N(0, 1), and P(X ≤ x) = Φ((x − μ)/σ)<br>Symmetry: Φ(−z) = 1 − Φ(z).   Percentile: x<sub>p</sub> = μ + σ · z<sub>p</sub>, where Φ(z<sub>p</sub>) = p</div>
<div class="formula"><span class="lbl">68–95–99.7 rule</span>P(|X − μ| ≤ σ) ≈ 0.6827,  P(|X − μ| ≤ 2σ) ≈ 0.9545,  P(|X − μ| ≤ 3σ) ≈ 0.9973</div>
<p>Useful z-values: z<sub>0.90</sub> ≈ 1.2816, z<sub>0.95</sub> ≈ 1.6449, z<sub>0.975</sub> ≈ 1.96. A linear function aX + b of a normal variable is normal, and a sum of independent normals is normal (Chapter 8).</p>
<h3>✍️ Worked examples — exam scores X ∼ N(70, 10<sup>2</sup>)</h3>
<div class="callout"><p><b>1.</b> P(X &gt; 85): z = (85 − 70)/10 = 1.5 ⇒ 1 − Φ(1.5) ≈ 1 − 0.9332 = <b>0.0668</b>.</p>
<p><b>2.</b> P(60 &lt; X &lt; 80) = Φ(1) − Φ(−1) ≈ <b>0.6827</b> (the 68% rule).</p>
<p><b>3.</b> P(65 &lt; X &lt; 90) = Φ(2) − Φ(−0.5) ≈ 0.9772 − 0.3085 = <b>0.6687</b>.</p>
<p><b>4.</b> 90th percentile: 70 + 10 × 1.2816 ≈ <b>82.8</b>. The cut-off for the top 5%: 70 + 10 × 1.6449 ≈ <b>86.4</b>.</p></div>
<pre><code class="language-python">from scipy.stats import norm

mu, sigma = 70, 10
print("P(X &gt; 85)      =", round(norm.sf(85, mu, sigma), 4))
print("P(60 &lt; X &lt; 80) =", round(norm.cdf(80, mu, sigma) - norm.cdf(60, mu, sigma), 4))
print("90th percentile=", round(norm.ppf(0.90, mu, sigma), 2))
for k in (1, 2, 3):
    print(k, "sigma:", round(norm.cdf(k) - norm.cdf(-k), 4))
</code></pre>
<div class="out">P(X &gt; 85)      = 0.0668
P(60 &lt; X &lt; 80) = 0.6827
90th percentile= 82.82
1 sigma: 0.6827
2 sigma: 0.9545
3 sigma: 0.9973</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Dividing by σ<sup>2</sup> instead of σ when standardising. <code>scipy.stats.norm</code> also takes the SD (scale), not the variance.</li><li>Using Φ(z) for an upper tail — P(X &gt; x) = 1 − Φ(z).</li><li>Assuming any data is normal — check a histogram; incomes, latencies and waiting times are skewed.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>N(μ, σ<sup>2</sup>): symmetric bell, mean μ, SD σ.</li><li>Z = (X − μ)/σ; P(X ≤ x) = Φ((x − μ)/σ).</li><li>68–95–99.7 within 1, 2, 3 SDs.</li><li>Percentile: μ + σ z<sub>p</sub>; Python <code>norm.cdf / sf / ppf</code>.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/6-1-the-standard-normal-distribution" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 6.1 The Standard Normal Distribution</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/6-2-using-the-normal-distribution" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 6.2 Using the Normal Distribution</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.norm.html" target="_blank" rel="noopener">SciPy — scipy.stats.norm</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Response time ∼ N(200 ms, 30<sup>2</sup>). P(response &gt; 260 ms)?</li><li>Same: what time is exceeded by only 1% of responses? (z<sub>0.99</sub> ≈ 2.326)</li><li>Exam scores N(70, 10<sup>2</sup>): what fraction scores below 55?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) z = 2 ⇒ 1 − Φ(2) ≈ 0.0228. 2) 200 + 30 × 2.326 ≈ 269.8 ms. 3) z = −1.5 ⇒ Φ(−1.5) ≈ 0.0668.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 7 · Bài 7.3</span>
<h2>Phân phối chuẩn và chuẩn hoá Z</h2>
<p class="lead">Đường cong hình chuông mô tả sai số đo, điểm thi, chiều cao — và, nhờ Định lý giới hạn trung tâm (Chương 10), trung bình của gần như mọi thứ. Mọi phân phối chuẩn đều là bản kéo giãn và tịnh tiến của cùng một đường cong chuẩn tắc.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mô tả N(μ, σ<sup>2</sup>) và quy tắc 68–95–99,7.</li><li>Chuẩn hoá về Z và tính xác suất bằng Φ.</li><li>Tìm phân vị (bài toán ngược) bằng giá trị z và Python.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Phân phối chuẩn N(μ, σ<sup>2</sup>)</span>f(x) = (1 / (σ√(2π))) · e<sup>−(x − μ)<sup>2</sup> / (2σ<sup>2</sup>)</sup>,  E[X] = μ,  Var(X) = σ<sup>2</sup></div>
<p>Đối xứng quanh μ, hình chuông, điểm uốn tại μ ± σ. CDF không có công thức sơ cấp; ta dùng CDF chuẩn tắc Φ(z) = P(Z ≤ z) với Z ∼ N(0, 1), tra bảng hoặc dùng phần mềm.</p>
<div class="formula"><span class="lbl">Chuẩn hoá</span>Nếu X ∼ N(μ, σ<sup>2</sup>) thì Z = (X − μ)/σ ∼ N(0, 1), và P(X ≤ x) = Φ((x − μ)/σ)<br>Đối xứng: Φ(−z) = 1 − Φ(z).   Phân vị: x<sub>p</sub> = μ + σ · z<sub>p</sub>, với Φ(z<sub>p</sub>) = p</div>
<div class="formula"><span class="lbl">Quy tắc 68–95–99,7</span>P(|X − μ| ≤ σ) ≈ 0,6827,  P(|X − μ| ≤ 2σ) ≈ 0,9545,  P(|X − μ| ≤ 3σ) ≈ 0,9973</div>
<p>Các giá trị z hay dùng: z<sub>0,90</sub> ≈ 1,2816, z<sub>0,95</sub> ≈ 1,6449, z<sub>0,975</sub> ≈ 1,96. Hàm tuyến tính aX + b của biến chuẩn là biến chuẩn, và tổng các biến chuẩn độc lập là biến chuẩn (Chương 8).</p>
<h3>✍️ Ví dụ — điểm thi X ∼ N(70, 10<sup>2</sup>)</h3>
<div class="callout"><p><b>1.</b> P(X &gt; 85): z = (85 − 70)/10 = 1,5 ⇒ 1 − Φ(1,5) ≈ 1 − 0,9332 = <b>0,0668</b>.</p>
<p><b>2.</b> P(60 &lt; X &lt; 80) = Φ(1) − Φ(−1) ≈ <b>0,6827</b> (quy tắc 68%).</p>
<p><b>3.</b> P(65 &lt; X &lt; 90) = Φ(2) − Φ(−0,5) ≈ 0,9772 − 0,3085 = <b>0,6687</b>.</p>
<p><b>4.</b> Phân vị 90: 70 + 10 × 1,2816 ≈ <b>82,8</b>. Điểm sàn của top 5%: 70 + 10 × 1,6449 ≈ <b>86,4</b>.</p></div>
<pre><code class="language-python">from scipy.stats import norm

mu, sigma = 70, 10
print("P(X &gt; 85)      =", round(norm.sf(85, mu, sigma), 4))
print("P(60 &lt; X &lt; 80) =", round(norm.cdf(80, mu, sigma) - norm.cdf(60, mu, sigma), 4))
print("90th percentile=", round(norm.ppf(0.90, mu, sigma), 2))
for k in (1, 2, 3):
    print(k, "sigma:", round(norm.cdf(k) - norm.cdf(-k), 4))
</code></pre>
<div class="out">P(X &gt; 85)      = 0.0668
P(60 &lt; X &lt; 80) = 0.6827
90th percentile= 82.82
1 sigma: 0.6827
2 sigma: 0.9545
3 sigma: 0.9973</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chia cho σ<sup>2</sup> thay vì σ khi chuẩn hoá. <code>scipy.stats.norm</code> cũng nhận độ lệch chuẩn (scale), không nhận phương sai.</li><li>Dùng Φ(z) cho đuôi phải — P(X &gt; x) = 1 − Φ(z).</li><li>Cho rằng dữ liệu nào cũng chuẩn — hãy xem histogram; thu nhập, độ trễ, thời gian chờ đều lệch.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>N(μ, σ<sup>2</sup>): chuông đối xứng, kỳ vọng μ, độ lệch chuẩn σ.</li><li>Z = (X − μ)/σ; P(X ≤ x) = Φ((x − μ)/σ).</li><li>68–95–99,7 trong phạm vi 1, 2, 3 độ lệch chuẩn.</li><li>Phân vị: μ + σ z<sub>p</sub>; Python <code>norm.cdf / sf / ppf</code>.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/6-1-the-standard-normal-distribution" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 6.1 Phân phối chuẩn tắc</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/6-2-using-the-normal-distribution" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 6.2 Sử dụng phân phối chuẩn</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.norm.html" target="_blank" rel="noopener">SciPy — scipy.stats.norm</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Thời gian phản hồi ∼ N(200 ms, 30<sup>2</sup>). P(phản hồi &gt; 260 ms)?</li><li>Cùng dữ liệu: mốc thời gian nào chỉ 1% phản hồi vượt quá? (z<sub>0,99</sub> ≈ 2,326)</li><li>Điểm thi N(70, 10<sup>2</sup>): tỉ lệ bao nhiêu dưới 55?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) z = 2 ⇒ 1 − Φ(2) ≈ 0,0228. 2) 200 + 30 × 2,326 ≈ 269,8 ms. 3) z = −1,5 ⇒ Φ(−1,5) ≈ 0,0668.</p></div>`);

const q7 = QZ(7, 'Quiz — Chapter 7: Continuous random variables|||Quiz — Chương 7: Biến ngẫu nhiên liên tục', 'Kiểm tra chương 7: PDF/CDF, kỳ vọng liên tục, phân phối đều, mũ, tính không nhớ, phân phối chuẩn, chuẩn hoá Z.', [
  Q('q1', "For a continuous X, P(X = 2) equals|||Với X liên tục, P(X = 2) bằng",
    ['f(2)|||f(2)', 'F(2)|||F(2)', '0|||0', '1/2|||1/2'], 2,
    "A single point has zero area under the density.|||Một điểm đơn lẻ có diện tích bằng 0 dưới mật độ."),
  Q('q2', "f(x) = c·x² on [0, 3] is a PDF when c =|||f(x) = c·x² trên [0, 3] là PDF khi c =",
    ['1/3|||1/3', '1/9|||1/9', '1/27|||1/27', '3|||3'], 1,
    "∫₀³ c x² dx = 9c = 1.|||∫₀³ c x² dx = 9c = 1."),
  Q('q3', "f(x) = 2x on [0, 1]. E[X] =|||f(x) = 2x trên [0, 1]. E[X] =",
    ['1/2|||1/2', '2/3|||2/3', '1|||1', '1/3|||1/3'], 1,
    "∫₀¹ 2x² dx = 2/3.|||∫₀¹ 2x² dx = 2/3."),
  Q('q4', "W ∼ U(0, 15). P(W > 10) =|||W ∼ U(0, 15). P(W > 10) =",
    ['1/3|||1/3', '2/3|||2/3', '10/15|||10/15', '1/15|||1/15'], 0,
    "(15 − 10)/15.|||(15 − 10)/15."),
  Q('q5', "Variance of U(a, b) is|||Phương sai của U(a, b) là",
    ['(b − a)/2|||(b − a)/2', '(b − a)²/12|||(b − a)²/12', '(a + b)/2|||(a + b)/2', '(b − a)²/4|||(b − a)²/4'], 1,
    "Standard result; for U(0, 15) it is 18.75.|||Kết quả chuẩn; với U(0, 15) là 18,75."),
  Q('q6', "T ∼ Exp with mean 1 000 h. P(T > 1 500) =|||T ∼ Exp với kỳ vọng 1 000 giờ. P(T > 1 500) =",
    ['e^(−1.5) ≈ 0.223|||e^(−1,5) ≈ 0,223', '0.5|||0,5', '1 − e^(−1.5)|||1 − e^(−1,5)', '1.5|||1,5'], 0,
    "P(T > t) = e^(−t/1000).|||P(T > t) = e^(−t/1000)."),
  Q('q7', "The only continuous memoryless distribution is the|||Phân phối liên tục duy nhất không nhớ là",
    ['uniform|||đều', 'normal|||chuẩn', 'exponential|||mũ', 'Poisson|||Poisson'], 2,
    "P(X > s + t | X > s) = P(X > t) characterises the exponential.|||P(X > s + t | X > s) = P(X > t) đặc trưng cho phân phối mũ."),
  Q('q8', "X ∼ N(70, 10²). P(X > 85) ≈|||X ∼ N(70, 10²). P(X > 85) ≈",
    ['0.0668|||0,0668', '0.1587|||0,1587', '0.9332|||0,9332', '0.15|||0,15'], 0,
    "z = 1.5, 1 − Φ(1.5).|||z = 1,5, 1 − Φ(1,5)."),
  Q('q9', "About what fraction of a normal distribution lies within 2 SDs of the mean?|||Khoảng bao nhiêu phần phân phối chuẩn nằm trong 2 độ lệch chuẩn quanh kỳ vọng?",
    ['68%|||68%', '90%|||90%', '95%|||95%', '99.7%|||99,7%'], 2,
    "0.9545 by the 68–95–99.7 rule.|||0,9545 theo quy tắc 68–95–99,7."),
  Q('q10', "X ∼ N(70, 10²). Its 90th percentile is about|||X ∼ N(70, 10²). Phân vị 90 xấp xỉ",
    ['80|||80', '82.8|||82,8', '86.4|||86,4', '90|||90'], 1,
    "70 + 10 × 1.2816.|||70 + 10 × 1,2816."),
]);

const ch7 = {
  title: 'Chapter 7 — Continuous random variables: uniform, exponential, normal|||Chương 7 — Biến ngẫu nhiên liên tục: đều, mũ, chuẩn',
  description: 'Hàm mật độ, CDF, kỳ vọng và phương sai bằng tích phân; phân phối đều, mũ (không nhớ, liên hệ Poisson); phân phối chuẩn, chuẩn hoá Z, phân vị, code scipy chạy thật (Blitzstein & Hwang ch.5 · Ross ch.5 · OpenStax ch.5–6).',
  lessons: [c71, c72, c73, q7],
};

// ───────────────────────────── Chương 8 — Phân phối đồng thời ─────────────────────────────
const c81 = L('ipy111-ts-8-1',
  '8.1 — Joint, marginal and conditional distributions (discrete)|||8.1 — Phân phối đồng thời, biên và có điều kiện (rời rạc)',
  'Bảng PMF đồng thời p(x,y), phân phối biên bằng cộng hàng/cột, phân phối có điều kiện p(x|y), kỳ vọng có điều kiện E[X|Y=y]; ví dụ số bug ở hai module.',
  `<span class="eyebrow">IPY111 · Chapter 8 · Lesson 8.1</span>
<h2>Joint, marginal and conditional distributions</h2>
<p class="lead">Real systems involve several random quantities at once: bugs in two modules, CPU and memory load, price and demand. Their joint distribution tells us not only how each behaves, but how they move together.</p>
<h3>🎯 Objectives</h3>
<ul><li>Read and validate a joint PMF table.</li><li>Compute marginal distributions by summing rows and columns.</li><li>Compute conditional distributions and conditional expectations.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Joint PMF</span>p(x, y) = P(X = x, Y = y),  p(x, y) ≥ 0,  ∑<sub>x</sub> ∑<sub>y</sub> p(x, y) = 1</div>
<div class="formula"><span class="lbl">Marginals</span>p<sub>X</sub>(x) = ∑<sub>y</sub> p(x, y)  (row sums),   p<sub>Y</sub>(y) = ∑<sub>x</sub> p(x, y)  (column sums)</div>
<div class="formula"><span class="lbl">Conditional PMF and expectation</span>p<sub>X|Y</sub>(x | y) = p(x, y) / p<sub>Y</sub>(y),   E[X | Y = y] = ∑<sub>x</sub> x · p<sub>X|Y</sub>(x | y)</div>
<p>The marginals do <strong>not</strong> determine the joint distribution: many different tables have the same row and column sums. The conditional distribution is just Chapter 3's P(A | B) applied to the events {X = x} and {Y = y}.</p>
<h3>✍️ Worked example — bugs in two modules</h3>
<div class="callout"><p>X = number of bugs found in module A (0, 1, 2), Y = number found in module B (0, 1) during a sprint:</p>
<div class="kv-grid">
<div class="kv"><span class="k">X = 0</span><span class="v">Y = 0: 0.30 · Y = 1: 0.10 · row sum 0.40</span></div>
<div class="kv"><span class="k">X = 1</span><span class="v">Y = 0: 0.20 · Y = 1: 0.15 · row sum 0.35</span></div>
<div class="kv"><span class="k">X = 2</span><span class="v">Y = 0: 0.10 · Y = 1: 0.15 · row sum 0.25</span></div>
<div class="kv"><span class="k">column sums</span><span class="v">Y = 0: 0.60 · Y = 1: 0.40 · total 1.00 ✓</span></div>
</div>
<p>Step 1 (marginals): p<sub>X</sub> = (0.40, 0.35, 0.25), p<sub>Y</sub> = (0.60, 0.40). E[X] = 0.35 + 0.50 = <b>0.85</b>, E[Y] = <b>0.40</b>.</p>
<p>Step 2 (conditional on Y = 1): divide the Y = 1 column by 0.40: P(X = 0 | Y = 1) = 0.25, P(X = 1 | Y = 1) = 0.375, P(X = 2 | Y = 1) = 0.375. E[X | Y = 1] = 0.375 + 0.75 = <b>1.125</b>.</p>
<p>Step 3 (conditional on Y = 0): (0.30, 0.20, 0.10)/0.60 = (1/2, 1/3, 1/6); E[X | Y = 0] = 1/3 + 1/3 = <b>2/3</b>.</p>
<p>Interpretation: when module B has a bug, module A tends to have more bugs (1.125 vs 0.667) — perhaps both depend on the same rushed deadline. Check: E[X] = E[X | Y = 0]P(Y = 0) + E[X | Y = 1]P(Y = 1) = (2/3)(0.6) + 1.125(0.4) = 0.4 + 0.45 = 0.85 ✓ (law of total expectation).</p>
<p>Step 4 (an event): P(X + Y ≥ 2) = p(1, 1) + p(2, 0) + p(2, 1) = 0.15 + 0.10 + 0.15 = <b>0.40</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Dividing by the grand total instead of the row/column total when conditioning.</li><li>Believing the marginals determine the joint distribution.</li><li>Forgetting to check that the whole table sums to 1.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Joint PMF: a table of P(X = x, Y = y) summing to 1.</li><li>Marginals = row and column sums.</li><li>Conditional = a column (or row) divided by its sum.</li><li>Law of total expectation: E[X] = ∑<sub>y</sub> E[X | Y = y] P(Y = y).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class07-prep-a_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 7a: Joint Distributions, Independence</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/3-4-contingency-tables" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 3.4 Contingency Tables (joint and marginal frequencies)</a></li><li><a href="https://ocw.mit.edu/courses/res-6-012-introduction-to-probability-spring-2018/" target="_blank" rel="noopener">MIT RES.6-012 — Introduction to Probability (lectures on multiple random variables)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>From the table, find P(X = 2 | Y = 0) and P(Y = 1 | X = 2).</li><li>Find P(X = Y).</li><li>Build a joint table with the same marginals (0.40, 0.35, 0.25) and (0.60, 0.40) in which X and Y are independent.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 0.10/0.60 = 1/6; 0.15/0.25 = 0.6. 2) p(0, 0) + p(1, 1) = 0.45. 3) Multiply: row X = 0: 0.24, 0.16; X = 1: 0.21, 0.14; X = 2: 0.15, 0.10.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 8 · Bài 8.1</span>
<h2>Phân phối đồng thời, biên và có điều kiện</h2>
<p class="lead">Hệ thống thực có nhiều đại lượng ngẫu nhiên cùng lúc: số bug ở hai module, tải CPU và bộ nhớ, giá và nhu cầu. Phân phối đồng thời cho biết không chỉ từng đại lượng hành xử ra sao mà còn chúng biến động cùng nhau thế nào.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Đọc và kiểm tính hợp lệ của bảng PMF đồng thời.</li><li>Tính phân phối biên bằng cộng hàng và cột.</li><li>Tính phân phối có điều kiện và kỳ vọng có điều kiện.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">PMF đồng thời</span>p(x, y) = P(X = x, Y = y),  p(x, y) ≥ 0,  ∑<sub>x</sub> ∑<sub>y</sub> p(x, y) = 1</div>
<div class="formula"><span class="lbl">Phân phối biên</span>p<sub>X</sub>(x) = ∑<sub>y</sub> p(x, y)  (tổng hàng),   p<sub>Y</sub>(y) = ∑<sub>x</sub> p(x, y)  (tổng cột)</div>
<div class="formula"><span class="lbl">PMF có điều kiện và kỳ vọng có điều kiện</span>p<sub>X|Y</sub>(x | y) = p(x, y) / p<sub>Y</sub>(y),   E[X | Y = y] = ∑<sub>x</sub> x · p<sub>X|Y</sub>(x | y)</div>
<p>Các phân phối biên <strong>không</strong> xác định được phân phối đồng thời: rất nhiều bảng khác nhau có cùng tổng hàng, tổng cột. Phân phối có điều kiện chính là P(A | B) của Chương 3 áp cho các biến cố {X = x} và {Y = y}.</p>
<h3>✍️ Ví dụ — bug ở hai module</h3>
<div class="callout"><p>X = số bug tìm thấy ở module A (0, 1, 2), Y = số bug ở module B (0, 1) trong một sprint:</p>
<div class="kv-grid">
<div class="kv"><span class="k">X = 0</span><span class="v">Y = 0: 0,30 · Y = 1: 0,10 · tổng hàng 0,40</span></div>
<div class="kv"><span class="k">X = 1</span><span class="v">Y = 0: 0,20 · Y = 1: 0,15 · tổng hàng 0,35</span></div>
<div class="kv"><span class="k">X = 2</span><span class="v">Y = 0: 0,10 · Y = 1: 0,15 · tổng hàng 0,25</span></div>
<div class="kv"><span class="k">tổng cột</span><span class="v">Y = 0: 0,60 · Y = 1: 0,40 · tổng 1,00 ✓</span></div>
</div>
<p>Bước 1 (biên): p<sub>X</sub> = (0,40; 0,35; 0,25), p<sub>Y</sub> = (0,60; 0,40). E[X] = 0,35 + 0,50 = <b>0,85</b>, E[Y] = <b>0,40</b>.</p>
<p>Bước 2 (điều kiện Y = 1): chia cột Y = 1 cho 0,40: P(X = 0 | Y = 1) = 0,25, P(X = 1 | Y = 1) = 0,375, P(X = 2 | Y = 1) = 0,375. E[X | Y = 1] = 0,375 + 0,75 = <b>1,125</b>.</p>
<p>Bước 3 (điều kiện Y = 0): (0,30; 0,20; 0,10)/0,60 = (1/2; 1/3; 1/6); E[X | Y = 0] = 1/3 + 1/3 = <b>2/3</b>.</p>
<p>Ý nghĩa: khi module B có bug, module A cũng có xu hướng nhiều bug hơn (1,125 so với 0,667) — có thể cả hai cùng chịu một deadline gấp. Kiểm: E[X] = E[X | Y = 0]P(Y = 0) + E[X | Y = 1]P(Y = 1) = (2/3)(0,6) + 1,125(0,4) = 0,4 + 0,45 = 0,85 ✓ (công thức kỳ vọng toàn phần).</p>
<p>Bước 4 (một biến cố): P(X + Y ≥ 2) = p(1, 1) + p(2, 0) + p(2, 1) = 0,15 + 0,10 + 0,15 = <b>0,40</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chia cho tổng toàn bảng thay vì tổng hàng/cột khi lấy điều kiện.</li><li>Tin rằng phân phối biên xác định phân phối đồng thời.</li><li>Quên kiểm cả bảng có tổng bằng 1.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>PMF đồng thời: bảng P(X = x, Y = y) có tổng bằng 1.</li><li>Biên = tổng hàng và tổng cột.</li><li>Có điều kiện = một cột (hoặc hàng) chia cho tổng của nó.</li><li>Kỳ vọng toàn phần: E[X] = ∑<sub>y</sub> E[X | Y = y] P(Y = y).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class07-prep-a_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 7a: Phân phối đồng thời, độc lập</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/3-4-contingency-tables" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 3.4 Bảng liên hợp (tần suất đồng thời và biên)</a></li><li><a href="https://ocw.mit.edu/courses/res-6-012-introduction-to-probability-spring-2018/" target="_blank" rel="noopener">MIT RES.6-012 — Introduction to Probability (bài giảng về nhiều biến ngẫu nhiên)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Từ bảng, tìm P(X = 2 | Y = 0) và P(Y = 1 | X = 2).</li><li>Tìm P(X = Y).</li><li>Dựng một bảng đồng thời có cùng phân phối biên (0,40; 0,35; 0,25) và (0,60; 0,40) mà X, Y độc lập.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 0,10/0,60 = 1/6; 0,15/0,25 = 0,6. 2) p(0, 0) + p(1, 1) = 0,45. 3) Nhân biên: hàng X = 0: 0,24; 0,16; X = 1: 0,21; 0,14; X = 2: 0,15; 0,10.</p></div>`);

const c82 = L('ipy111-ts-8-2',
  '8.2 — Independent random variables and joint densities|||8.2 — Biến ngẫu nhiên độc lập và mật độ đồng thời',
  'Độc lập của biến ngẫu nhiên p(x,y) = p_X(x)p_Y(y); mật độ đồng thời f(x,y), xác suất là tích phân kép trên miền; ví dụ f = x + y trên hình vuông đơn vị; hai biến mũ độc lập P(X < Y) = λ1/(λ1+λ2).',
  `<span class="eyebrow">IPY111 · Chapter 8 · Lesson 8.2</span>
<h2>Independent random variables and joint densities</h2>
<p class="lead">Independence of events extends naturally to random variables: X and Y are independent if knowing the value of one tells you nothing about the other. For continuous pairs, probabilities become volumes under a joint density surface.</p>
<h3>🎯 Objectives</h3>
<ul><li>Test independence of discrete random variables from a table.</li><li>Use a joint density f(x, y): normalise, find marginals, integrate over regions.</li><li>Compute P(X &lt; Y) for independent exponential lifetimes.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Independence of random variables</span>Discrete: p(x, y) = p<sub>X</sub>(x) p<sub>Y</sub>(y) for ALL x, y<br>Continuous: f(x, y) = f<sub>X</sub>(x) f<sub>Y</sub>(y) for all x, y</div>
<p>One cell that fails the product rule is enough to prove dependence. In the bug table of Lesson 8.1: p(0, 0) = 0.30 but p<sub>X</sub>(0)p<sub>Y</sub>(0) = 0.40 × 0.60 = 0.24 ⇒ <b>dependent</b>.</p>
<div class="formula"><span class="lbl">Joint density</span>f(x, y) ≥ 0,  ∬ f(x, y) dx dy = 1,   P((X, Y) ∈ R) = ∬<sub>R</sub> f(x, y) dx dy,   f<sub>X</sub>(x) = ∫ f(x, y) dy</div>
<p>Shortcut: if the support is a rectangle and f(x, y) factors as g(x)h(y), then X and Y are independent.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — f(x, y) = x + y on the unit square [0, 1]<sup>2</sup>.</b></p>
<p>Step 1 (valid): ∫<sub>0</sub><sup>1</sup>∫<sub>0</sub><sup>1</sup> (x + y) dy dx = ∫<sub>0</sub><sup>1</sup> (x + 1/2) dx = 1 ✓.</p>
<p>Step 2 (marginal): f<sub>X</sub>(x) = ∫<sub>0</sub><sup>1</sup> (x + y) dy = <b>x + 1/2</b> on [0, 1]; similarly f<sub>Y</sub>(y) = y + 1/2.</p>
<p>Step 3 (independence?): (x + 1/2)(y + 1/2) ≠ x + y (try x = y = 0: 1/4 ≠ 0) ⇒ <b>dependent</b>.</p>
<p>Step 4 (a region): P(X + Y ≤ 1) = ∫<sub>0</sub><sup>1</sup> ∫<sub>0</sub><sup>1−x</sup> (x + y) dy dx = ∫<sub>0</sub><sup>1</sup> (1 − x<sup>2</sup>)/2 dx = <b>1/3</b>.</p></div>
<div class="callout"><p><b>Example 2 — which server answers first?</b> Two independent replicas answer after X ∼ Exp(λ<sub>1</sub> = 2) and Y ∼ Exp(λ<sub>2</sub> = 3) seconds. Joint density 6e<sup>−2x−3y</sup>.</p>
<p>P(X &lt; Y) = ∫<sub>0</sub><sup>∞</sup> 2e<sup>−2x</sup> · P(Y &gt; x) dx = ∫<sub>0</sub><sup>∞</sup> 2e<sup>−2x</sup>e<sup>−3x</sup> dx = 2/5 = <b>0.4</b>. In general P(X &lt; Y) = λ<sub>1</sub>/(λ<sub>1</sub> + λ<sub>2</sub>), and min(X, Y) ∼ Exp(λ<sub>1</sub> + λ<sub>2</sub>): the first answer arrives after 1/5 s on average.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Checking independence in only one cell — it must hold in every cell.</li><li>Concluding independence from a factorised formula when the support is not a rectangle (e.g. f = 2 on the triangle 0 ≤ y ≤ x ≤ 1 is dependent).</li><li>Getting the integration limits wrong for regions such as x + y ≤ 1 — sketch the region first.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Independent ⇔ joint = product of marginals everywhere.</li><li>Joint density: probabilities are double integrals.</li><li>Marginal density = integrate out the other variable.</li><li>Independent exponentials: P(X &lt; Y) = λ<sub>1</sub>/(λ<sub>1</sub> + λ<sub>2</sub>), min ∼ Exp(λ<sub>1</sub> + λ<sub>2</sub>).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class07-prep-a_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 7a: joint densities and independence</a></li><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/02%3A_Continuous_Probability_Densities" target="_blank" rel="noopener">Grinstead &amp; Snell — Chapter 2: Continuous Probability Densities</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.multivariate_normal.html" target="_blank" rel="noopener">SciPy — scipy.stats.multivariate_normal (a joint density in practice)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>f(x, y) = 4xy on [0, 1]<sup>2</sup>. Are X and Y independent? Find P(X ≤ 1/2, Y ≤ 1/2).</li><li>For f(x, y) = x + y on [0, 1]<sup>2</sup>, find E[X].</li><li>Three independent servers with Exp rates 1, 2, 3 per second. P(the rate-3 server answers first)?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Yes: 4xy = (2x)(2y) on a rectangle; (1/4)(1/4) = 1/16. 2) ∫<sub>0</sub><sup>1</sup> x(x + 1/2) dx = 1/3 + 1/4 = 7/12. 3) 3/(1 + 2 + 3) = 1/2.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 8 · Bài 8.2</span>
<h2>Biến ngẫu nhiên độc lập và mật độ đồng thời</h2>
<p class="lead">Tính độc lập của biến cố mở rộng tự nhiên sang biến ngẫu nhiên: X và Y độc lập nếu biết giá trị của biến này không cho biết gì về biến kia. Với cặp liên tục, xác suất trở thành thể tích dưới mặt mật độ đồng thời.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Kiểm tính độc lập của biến rời rạc từ bảng.</li><li>Dùng mật độ đồng thời f(x, y): chuẩn hoá, tìm biên, tích phân trên miền.</li><li>Tính P(X &lt; Y) cho hai tuổi thọ mũ độc lập.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Biến ngẫu nhiên độc lập</span>Rời rạc: p(x, y) = p<sub>X</sub>(x) p<sub>Y</sub>(y) với MỌI x, y<br>Liên tục: f(x, y) = f<sub>X</sub>(x) f<sub>Y</sub>(y) với mọi x, y</div>
<p>Chỉ cần một ô vi phạm quy tắc tích là đủ chứng minh phụ thuộc. Ở bảng bug Bài 8.1: p(0, 0) = 0,30 nhưng p<sub>X</sub>(0)p<sub>Y</sub>(0) = 0,40 × 0,60 = 0,24 ⇒ <b>phụ thuộc</b>.</p>
<div class="formula"><span class="lbl">Mật độ đồng thời</span>f(x, y) ≥ 0,  ∬ f(x, y) dx dy = 1,   P((X, Y) ∈ R) = ∬<sub>R</sub> f(x, y) dx dy,   f<sub>X</sub>(x) = ∫ f(x, y) dy</div>
<p>Mẹo: nếu miền xác định là hình chữ nhật và f(x, y) tách được thành g(x)h(y) thì X và Y độc lập.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — f(x, y) = x + y trên hình vuông đơn vị [0, 1]<sup>2</sup>.</b></p>
<p>Bước 1 (hợp lệ): ∫<sub>0</sub><sup>1</sup>∫<sub>0</sub><sup>1</sup> (x + y) dy dx = ∫<sub>0</sub><sup>1</sup> (x + 1/2) dx = 1 ✓.</p>
<p>Bước 2 (biên): f<sub>X</sub>(x) = ∫<sub>0</sub><sup>1</sup> (x + y) dy = <b>x + 1/2</b> trên [0, 1]; tương tự f<sub>Y</sub>(y) = y + 1/2.</p>
<p>Bước 3 (độc lập?): (x + 1/2)(y + 1/2) ≠ x + y (thử x = y = 0: 1/4 ≠ 0) ⇒ <b>phụ thuộc</b>.</p>
<p>Bước 4 (một miền): P(X + Y ≤ 1) = ∫<sub>0</sub><sup>1</sup> ∫<sub>0</sub><sup>1−x</sup> (x + y) dy dx = ∫<sub>0</sub><sup>1</sup> (1 − x<sup>2</sup>)/2 dx = <b>1/3</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — server nào trả lời trước?</b> Hai bản sao độc lập trả lời sau X ∼ Exp(λ<sub>1</sub> = 2) và Y ∼ Exp(λ<sub>2</sub> = 3) giây. Mật độ đồng thời 6e<sup>−2x−3y</sup>.</p>
<p>P(X &lt; Y) = ∫<sub>0</sub><sup>∞</sup> 2e<sup>−2x</sup> · P(Y &gt; x) dx = ∫<sub>0</sub><sup>∞</sup> 2e<sup>−2x</sup>e<sup>−3x</sup> dx = 2/5 = <b>0,4</b>. Tổng quát P(X &lt; Y) = λ<sub>1</sub>/(λ<sub>1</sub> + λ<sub>2</sub>), và min(X, Y) ∼ Exp(λ<sub>1</sub> + λ<sub>2</sub>): câu trả lời đầu tiên đến sau trung bình 1/5 giây.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chỉ kiểm độc lập ở một ô — phải đúng ở mọi ô.</li><li>Kết luận độc lập từ công thức tách được khi miền không phải hình chữ nhật (ví dụ f = 2 trên tam giác 0 ≤ y ≤ x ≤ 1 là phụ thuộc).</li><li>Đặt sai cận tích phân cho miền như x + y ≤ 1 — vẽ miền trước.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Độc lập ⇔ đồng thời = tích các biên ở mọi điểm.</li><li>Mật độ đồng thời: xác suất là tích phân kép.</li><li>Mật độ biên = tích phân bỏ biến còn lại.</li><li>Hai biến mũ độc lập: P(X &lt; Y) = λ<sub>1</sub>/(λ<sub>1</sub> + λ<sub>2</sub>), min ∼ Exp(λ<sub>1</sub> + λ<sub>2</sub>).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class07-prep-a_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 7a: mật độ đồng thời và tính độc lập</a></li><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/02%3A_Continuous_Probability_Densities" target="_blank" rel="noopener">Grinstead &amp; Snell — Chương 2: Mật độ xác suất liên tục</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.multivariate_normal.html" target="_blank" rel="noopener">SciPy — scipy.stats.multivariate_normal (một mật độ đồng thời trong thực tế)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>f(x, y) = 4xy trên [0, 1]<sup>2</sup>. X và Y có độc lập không? Tìm P(X ≤ 1/2, Y ≤ 1/2).</li><li>Với f(x, y) = x + y trên [0, 1]<sup>2</sup>, tìm E[X].</li><li>Ba server độc lập với tốc độ Exp 1, 2, 3 mỗi giây. P(server tốc độ 3 trả lời trước)?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Có: 4xy = (2x)(2y) trên hình chữ nhật; (1/4)(1/4) = 1/16. 2) ∫<sub>0</sub><sup>1</sup> x(x + 1/2) dx = 1/3 + 1/4 = 7/12. 3) 3/(1 + 2 + 3) = 1/2.</p></div>`);

const c83 = L('ipy111-ts-8-3',
  '8.3 — Sums of independent random variables (with Python)|||8.3 — Tổng các biến ngẫu nhiên độc lập (có Python)',
  'Tích chập: PMF của X + Y; tổng hai/ba xúc xắc tính chính xác bằng Python; nhị thức + nhị thức, Poisson + Poisson, chuẩn + chuẩn; ví dụ P(X > Y) với hai điểm thi chuẩn độc lập.',
  `<span class="eyebrow">IPY111 · Chapter 8 · Lesson 8.3</span>
<h2>Sums of independent random variables</h2>
<p class="lead">Total load = sum of user requests; total score = sum of question scores; total error = sum of small errors. The distribution of a sum of independent pieces is found by convolution — and for the named families it has a beautiful closed form.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute the PMF of X + Y by convolution.</li><li>Know which families are closed under independent sums.</li><li>Use the normal sum rule to compare two independent normal quantities.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Convolution</span>If X, Y are independent integer-valued: P(X + Y = s) = ∑<sub>x</sub> P(X = x) P(Y = s − x)<br>Continuous: f<sub>X+Y</sub>(s) = ∫ f<sub>X</sub>(x) f<sub>Y</sub>(s − x) dx</div>
<div class="formula"><span class="lbl">Closed families (independent summands)</span>Bin(n, p) + Bin(m, p) = Bin(n + m, p)   (same p!)<br>Poisson(λ) + Poisson(μ) = Poisson(λ + μ)<br>N(μ<sub>1</sub>, σ<sub>1</sub><sup>2</sup>) + N(μ<sub>2</sub>, σ<sub>2</sub><sup>2</sup>) = N(μ<sub>1</sub> + μ<sub>2</sub>, σ<sub>1</sub><sup>2</sup> + σ<sub>2</sub><sup>2</sup>)<br>and aX + bY for independent normals is N(aμ<sub>1</sub> + bμ<sub>2</sub>, a<sup>2</sup>σ<sub>1</sub><sup>2</sup> + b<sup>2</sup>σ<sub>2</sub><sup>2</sup>)</div>
<p>Means always add (linearity); variances add because of independence. What is special about these families is that the <em>shape</em> is preserved.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — dice by convolution in Python.</b> We build the exact PMF of the sum of two and three dice using fractions.</p></div>
<pre><code class="language-python">from fractions import Fraction
from collections import defaultdict

die = {k: Fraction(1, 6) for k in range(1, 7)}

def convolve(p, q):
    # PMF of X + Y for independent X ~ p, Y ~ q
    r = defaultdict(Fraction)
    for x, px in p.items():
        for y, qy in q.items():
            r[x + y] += px * qy
    return dict(sorted(r.items()))

two = convolve(die, die)
print({s: str(pr) for s, pr in two.items()})
three = convolve(two, die)
print("P(sum of 3 dice = 10) =", three[10], "=", round(float(three[10]), 4))
</code></pre>
<div class="out">{2: '1/36', 3: '1/18', 4: '1/12', 5: '1/9', 6: '5/36', 7: '1/6', 8: '5/36', 9: '1/9', 10: '1/12', 11: '1/18', 12: '1/36'}
P(sum of 3 dice = 10) = 1/8 = 0.125</div>
<div class="callout"><p><b>Example 2 — Poisson merge.</b> Two web servers receive errors at Poisson rates 2 and 3 per hour, independently. Total errors per hour ∼ Poisson(5): P(no error in an hour) = e<sup>−5</sup> ≈ 0.0067; P(at most 3) ≈ <b>0.265</b>.</p></div>
<div class="callout"><p><b>Example 3 — who scores higher?</b> Student A's score X ∼ N(70, 10<sup>2</sup>), student B's Y ∼ N(65, 8<sup>2</sup>), independent. D = X − Y ∼ N(70 − 65, 10<sup>2</sup> + 8<sup>2</sup>) = N(5, 164), SD = √164 ≈ 12.81.</p>
<p>P(X &gt; Y) = P(D &gt; 0) = Φ(5/12.81) = Φ(0.39) ≈ <b>0.652</b>. Note the variances <em>add</em> even though we subtract.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Adding standard deviations: SD(X − Y) = √(100 + 64) ≈ 12.8, not 10 + 8 or 10 − 8.</li><li>Summing binomials with different p and calling the result binomial.</li><li>Applying these rules to dependent variables (a covariance term is needed — Chapter 9).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>PMF of a sum = convolution of the PMFs.</li><li>Binomial (same p), Poisson and normal families are closed under independent sums.</li><li>Means add; for independent variables, variances add (also for differences).</li><li>P(X &gt; Y) for normals: work with D = X − Y.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/07%3A_Sums_of_Random_Variables" target="_blank" rel="noopener">Grinstead &amp; Snell — Chapter 7: Sums of Random Variables</a></li><li><a href="https://www.3blue1brown.com/lessons/gaussian-convolution" target="_blank" rel="noopener">3Blue1Brown — A pretty reason why Gaussian + Gaussian = Gaussian</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class05-prep-d_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 5d: Manipulating Continuous Random Variables</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>X ∼ Bin(10, 0.3), Y ∼ Bin(5, 0.3), independent. Distribution of X + Y? Its mean and variance?</li><li>Use the dice PMF: P(sum of two dice is a multiple of 3)?</li><li>Battery A lasts N(10 h, 1<sup>2</sup>), battery B N(9 h, 1.5<sup>2</sup>), independent. P(B outlasts A)?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Bin(15, 0.3): mean 4.5, variance 3.15. 2) Sums 3, 6, 9, 12: (2 + 5 + 4 + 1)/36 = 1/3. 3) B − A ∼ N(−1, 3.25): P(&gt; 0) = 1 − Φ(1/1.803) = 1 − Φ(0.555) ≈ 0.29.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 8 · Bài 8.3</span>
<h2>Tổng các biến ngẫu nhiên độc lập</h2>
<p class="lead">Tổng tải = tổng các request của người dùng; tổng điểm = tổng điểm từng câu; tổng sai số = tổng nhiều sai số nhỏ. Phân phối của tổng các mảnh độc lập được tìm bằng tích chập — và với các họ phân phối quen thuộc nó có dạng đóng rất đẹp.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính PMF của X + Y bằng tích chập.</li><li>Biết họ phân phối nào đóng với phép cộng độc lập.</li><li>Dùng quy tắc tổng chuẩn để so sánh hai đại lượng chuẩn độc lập.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Tích chập</span>Nếu X, Y độc lập, nhận giá trị nguyên: P(X + Y = s) = ∑<sub>x</sub> P(X = x) P(Y = s − x)<br>Liên tục: f<sub>X+Y</sub>(s) = ∫ f<sub>X</sub>(x) f<sub>Y</sub>(s − x) dx</div>
<div class="formula"><span class="lbl">Họ đóng (các số hạng độc lập)</span>Bin(n, p) + Bin(m, p) = Bin(n + m, p)   (cùng p!)<br>Poisson(λ) + Poisson(μ) = Poisson(λ + μ)<br>N(μ<sub>1</sub>, σ<sub>1</sub><sup>2</sup>) + N(μ<sub>2</sub>, σ<sub>2</sub><sup>2</sup>) = N(μ<sub>1</sub> + μ<sub>2</sub>, σ<sub>1</sub><sup>2</sup> + σ<sub>2</sub><sup>2</sup>)<br>và aX + bY với các biến chuẩn độc lập là N(aμ<sub>1</sub> + bμ<sub>2</sub>, a<sup>2</sup>σ<sub>1</sub><sup>2</sup> + b<sup>2</sup>σ<sub>2</sub><sup>2</sup>)</div>
<p>Kỳ vọng luôn cộng được (tuyến tính); phương sai cộng được nhờ độc lập. Điều đặc biệt ở các họ này là <em>hình dạng</em> được giữ nguyên.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — tích chập xúc xắc bằng Python.</b> Ta dựng PMF chính xác của tổng hai và ba xúc xắc bằng phân số.</p></div>
<pre><code class="language-python">from fractions import Fraction
from collections import defaultdict

die = {k: Fraction(1, 6) for k in range(1, 7)}

def convolve(p, q):
    # PMF of X + Y for independent X ~ p, Y ~ q
    r = defaultdict(Fraction)
    for x, px in p.items():
        for y, qy in q.items():
            r[x + y] += px * qy
    return dict(sorted(r.items()))

two = convolve(die, die)
print({s: str(pr) for s, pr in two.items()})
three = convolve(two, die)
print("P(sum of 3 dice = 10) =", three[10], "=", round(float(three[10]), 4))
</code></pre>
<div class="out">{2: '1/36', 3: '1/18', 4: '1/12', 5: '1/9', 6: '5/36', 7: '1/6', 8: '5/36', 9: '1/9', 10: '1/12', 11: '1/18', 12: '1/36'}
P(sum of 3 dice = 10) = 1/8 = 0.125</div>
<div class="callout"><p><b>Ví dụ 2 — gộp Poisson.</b> Hai web server gặp lỗi theo Poisson với tốc độ 2 và 3 mỗi giờ, độc lập. Tổng số lỗi mỗi giờ ∼ Poisson(5): P(không lỗi trong một giờ) = e<sup>−5</sup> ≈ 0,0067; P(nhiều nhất 3 lỗi) ≈ <b>0,265</b>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — ai điểm cao hơn?</b> Điểm của sinh viên A là X ∼ N(70, 10<sup>2</sup>), của B là Y ∼ N(65, 8<sup>2</sup>), độc lập. D = X − Y ∼ N(70 − 65, 10<sup>2</sup> + 8<sup>2</sup>) = N(5, 164), SD = √164 ≈ 12,81.</p>
<p>P(X &gt; Y) = P(D &gt; 0) = Φ(5/12,81) = Φ(0,39) ≈ <b>0,652</b>. Chú ý phương sai <em>cộng</em> lại dù ta lấy hiệu.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Cộng độ lệch chuẩn: SD(X − Y) = √(100 + 64) ≈ 12,8, không phải 10 + 8 hay 10 − 8.</li><li>Cộng các nhị thức khác p rồi gọi kết quả là nhị thức.</li><li>Áp các quy tắc này cho biến phụ thuộc (cần thêm số hạng hiệp phương sai — Chương 9).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>PMF của tổng = tích chập các PMF.</li><li>Nhị thức (cùng p), Poisson và chuẩn đóng với phép cộng độc lập.</li><li>Kỳ vọng cộng lại; với biến độc lập, phương sai cộng lại (kể cả với hiệu).</li><li>P(X &gt; Y) với biến chuẩn: làm việc với D = X − Y.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/07%3A_Sums_of_Random_Variables" target="_blank" rel="noopener">Grinstead &amp; Snell — Chương 7: Tổng các biến ngẫu nhiên</a></li><li><a href="https://www.3blue1brown.com/lessons/gaussian-convolution" target="_blank" rel="noopener">3Blue1Brown — Lý do đẹp đẽ vì sao chuẩn + chuẩn = chuẩn</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class05-prep-d_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 5d: Biến đổi biến ngẫu nhiên liên tục</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>X ∼ Bin(10; 0,3), Y ∼ Bin(5; 0,3), độc lập. Phân phối của X + Y? Kỳ vọng và phương sai?</li><li>Dùng PMF xúc xắc: P(tổng hai xúc xắc chia hết cho 3)?</li><li>Pin A dùng được N(10 giờ, 1<sup>2</sup>), pin B N(9 giờ, 1,5<sup>2</sup>), độc lập. P(B dùng lâu hơn A)?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Bin(15; 0,3): kỳ vọng 4,5, phương sai 3,15. 2) Tổng 3, 6, 9, 12: (2 + 5 + 4 + 1)/36 = 1/3. 3) B − A ∼ N(−1; 3,25): P(&gt; 0) = 1 − Φ(1/1,803) = 1 − Φ(0,555) ≈ 0,29.</p></div>`);

const q8 = QZ(8, 'Quiz — Chapter 8: Joint distributions|||Quiz — Chương 8: Phân phối đồng thời', 'Kiểm tra chương 8: bảng đồng thời, biên, có điều kiện, kỳ vọng có điều kiện, độc lập của biến, mật độ đồng thời, tổng biến độc lập.', [
  Q('q1', "In a joint PMF table, the marginal of X is obtained by|||Trong bảng PMF đồng thời, phân phối biên của X có được bằng cách",
    ['summing over y (row sums)|||cộng theo y (tổng hàng)', 'multiplying rows|||nhân các hàng', 'taking the diagonal|||lấy đường chéo', 'dividing by P(Y)|||chia cho P(Y)'], 0,
    "p_X(x) = ∑_y p(x, y).|||p_X(x) = ∑_y p(x, y)."),
  Q('q2', "Bug table: p(0,1) = 0.10, p(1,1) = 0.15, p(2,1) = 0.15. P(X = 0 | Y = 1) =|||Bảng bug: p(0,1) = 0,10, p(1,1) = 0,15, p(2,1) = 0,15. P(X = 0 | Y = 1) =",
    ['0.10|||0,10', '0.25|||0,25', '0.40|||0,40', '0.375|||0,375'], 1,
    "0.10 / 0.40.|||0,10 / 0,40."),
  Q('q3', "Same table: E[X | Y = 1] =|||Cùng bảng: E[X | Y = 1] =",
    ['0.85|||0,85', '1.125|||1,125', '0.667|||0,667', '1|||1'], 1,
    "0·0.25 + 1·0.375 + 2·0.375.|||0·0,25 + 1·0,375 + 2·0,375."),
  Q('q4', "Discrete X, Y are independent iff|||X, Y rời rạc độc lập khi và chỉ khi",
    ['p(x, y) = p_X(x)p_Y(y) for all x, y|||p(x, y) = p_X(x)p_Y(y) với mọi x, y', 'p(x, y) = p_X(x) + p_Y(y)|||p(x, y) = p_X(x) + p_Y(y)', 'E[X] = E[Y]|||E[X] = E[Y]', 'the product rule holds in one cell|||quy tắc tích đúng ở một ô'], 0,
    "The product rule must hold in every cell.|||Quy tắc tích phải đúng ở mọi ô."),
  Q('q5', "f(x, y) = x + y on [0,1]². The marginal f_X(x) =|||f(x, y) = x + y trên [0,1]². Biên f_X(x) =",
    ['x|||x', 'x + 1/2|||x + 1/2', '2x|||2x', '1|||1'], 1,
    "∫₀¹ (x + y) dy = x + 1/2.|||∫₀¹ (x + y) dy = x + 1/2."),
  Q('q6', "Same density: P(X + Y ≤ 1) =|||Cùng mật độ: P(X + Y ≤ 1) =",
    ['1/2|||1/2', '1/3|||1/3', '1/6|||1/6', '2/3|||2/3'], 1,
    "∫₀¹ (1 − x²)/2 dx = 1/3.|||∫₀¹ (1 − x²)/2 dx = 1/3."),
  Q('q7', "X ∼ Exp(2), Y ∼ Exp(3) independent. P(X < Y) =|||X ∼ Exp(2), Y ∼ Exp(3) độc lập. P(X < Y) =",
    ['2/3|||2/3', '0.4|||0,4', '0.6|||0,6', '1/2|||1/2'], 1,
    "λ₁/(λ₁ + λ₂) = 2/5.|||λ₁/(λ₁ + λ₂) = 2/5."),
  Q('q8', "Poisson(2) + Poisson(3), independent, is|||Poisson(2) + Poisson(3), độc lập, là",
    ['Poisson(6)|||Poisson(6)', 'Poisson(5)|||Poisson(5)', 'Bin(5, 0.5)|||Bin(5; 0,5)', 'not Poisson|||không phải Poisson'], 1,
    "Rates add.|||Các tốc độ cộng lại."),
  Q('q9', "X ∼ N(70, 10²), Y ∼ N(65, 8²) independent. X − Y ∼|||X ∼ N(70, 10²), Y ∼ N(65, 8²) độc lập. X − Y ∼",
    ['N(5, 36)|||N(5, 36)', 'N(5, 164)|||N(5, 164)', 'N(5, 2²)|||N(5, 2²)', 'N(135, 164)|||N(135, 164)'], 1,
    "Means subtract, variances add.|||Kỳ vọng trừ, phương sai cộng."),
  Q('q10', "P(sum of 3 dice = 10) =|||P(tổng 3 xúc xắc = 10) =",
    ['1/6|||1/6', '1/8|||1/8', '1/12|||1/12', '27/216 ≈ 0.111|||27/216 ≈ 0,111'], 1,
    "27 of 216 outcomes: 27/216 = 1/8.|||27 trong 216 kết quả: 27/216 = 1/8."),
]);

const ch8 = {
  title: 'Chapter 8 — Joint distributions and sums of random variables|||Chương 8 — Phân phối đồng thời và tổng các biến ngẫu nhiên',
  description: 'Bảng PMF đồng thời, biên, có điều kiện, kỳ vọng toàn phần; biến độc lập, mật độ đồng thời, P(X<Y) của biến mũ; tích chập, tổng nhị thức/Poisson/chuẩn, code Python chạy thật (Blitzstein & Hwang ch.7 · Ross ch.6).',
  lessons: [c81, c82, c83, q8],
};

// ───────────────────────────── Chương 9 — Hiệp phương sai & tương quan ─────────────────────────────
const c91 = L('ipy111-ts-9-1',
  '9.1 — Covariance: measuring how two variables move together|||9.1 — Hiệp phương sai: đo hai biến cùng biến động',
  'Cov(X,Y) = E[(X−μX)(Y−μY)] = E[XY] − E[X]E[Y]; tính từ bảng bug (0,11); tính chất song tuyến tính; độc lập ⇒ Cov = 0 nhưng chiều ngược sai (Y = X²); ví dụ liên tục f = x + y.',
  `<span class="eyebrow">IPY111 · Chapter 9 · Lesson 9.1</span>
<h2>Covariance: measuring how two variables move together</h2>
<p class="lead">The joint table tells everything, but we often want one number saying “when X is above its mean, is Y usually above or below its mean?”. That number is the covariance.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute Cov(X, Y) with the shortcut E[XY] − E[X]E[Y].</li><li>Use the properties of covariance (symmetry, bilinearity).</li><li>Understand that zero covariance does not imply independence.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Covariance</span>Cov(X, Y) = E[(X − μ<sub>X</sub>)(Y − μ<sub>Y</sub>)] = E[XY] − E[X] E[Y]<br>E[XY] = ∑<sub>x</sub>∑<sub>y</sub> x y p(x, y)   (or ∬ x y f(x, y) dx dy)</div>
<p>Positive covariance: X and Y tend to be large together (and small together). Negative: when one is large the other tends to be small. Its units are “units of X × units of Y”, so its size is hard to interpret — that is fixed by the correlation (Lesson 9.2).</p>
<div class="formula"><span class="lbl">Properties</span>Cov(X, X) = Var(X)    Cov(X, Y) = Cov(Y, X)    Cov(X, c) = 0<br>Cov(aX + b, cY + d) = ac · Cov(X, Y)    Cov(X + Y, Z) = Cov(X, Z) + Cov(Y, Z)<br>X, Y independent ⇒ E[XY] = E[X]E[Y] ⇒ Cov(X, Y) = 0</div>
<p>⚠️ The converse is false. Let X be uniform on {−1, 0, 1} and Y = X<sup>2</sup>. Y is completely determined by X (strongly dependent), yet E[XY] = E[X<sup>3</sup>] = 0 and E[X] = 0, so Cov(X, Y) = 0. Covariance only detects <strong>linear</strong> association.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — the bug table (Lesson 8.1).</b> Values with X·Y ≠ 0: (1, 1) with p = 0.15 and (2, 1) with p = 0.15.</p>
<p>Step 1: E[XY] = 1 · 1 · 0.15 + 2 · 1 · 0.15 = 0.45.</p>
<p>Step 2: E[X] = 0.85, E[Y] = 0.40 ⇒ E[X]E[Y] = 0.34.</p>
<p>Step 3: Cov(X, Y) = 0.45 − 0.34 = <b>0.11 &gt; 0</b>: bug counts in the two modules move together, matching E[X | Y = 1] &gt; E[X | Y = 0].</p></div>
<div class="callout"><p><b>Example 2 — rescaling.</b> If X is doubled and shifted to 2X + 1 and Y is turned into a penalty 3Y − 4, then Cov(2X + 1, 3Y − 4) = 2 · 3 · 0.11 = <b>0.66</b>: shifts disappear, scale factors multiply.</p></div>
<div class="callout"><p><b>Example 3 — continuous.</b> f(x, y) = x + y on [0, 1]<sup>2</sup> (Lesson 8.2). E[X] = E[Y] = 7/12; E[XY] = ∬ xy(x + y) dx dy = 1/3. Cov = 1/3 − 49/144 = <b>−1/144</b>: a weak negative association.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Concluding independence from Cov = 0.</li><li>Forgetting the shift terms disappear: Cov(X + 5, Y) = Cov(X, Y).</li><li>Comparing covariances measured in different units — use the correlation.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Cov(X, Y) = E[XY] − E[X]E[Y].</li><li>Sign tells the direction of linear association.</li><li>Bilinear: Cov(aX + b, cY + d) = ac Cov(X, Y); Cov(X, X) = Var(X).</li><li>Independent ⇒ Cov = 0, but not conversely.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class07-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 7b: Covariance and Correlation</a></li><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/06%3A_Expected_Value_and_Variance" target="_blank" rel="noopener">Grinstead &amp; Snell — Chapter 6 (covariance and variance of sums)</a></li><li><a href="https://www.youtube.com/playlist?list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo" target="_blank" rel="noopener">Harvard Stat 110 — Lecture 19 (joint distributions) and the lecture on covariance that follows</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>X takes values 1, 2 with probability 1/2 each and Y = 3 − X. Find Cov(X, Y).</li><li>Show that Cov(X, Y) = 0 for X uniform on {−1, 0, 1} and Y = X<sup>2</sup> by listing the three outcomes.</li><li>If Cov(X, Y) = 2, find Cov(−X, 4Y + 1).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Y = 3 − X ⇒ Cov(X, Y) = −Var(X) = −1/4. 2) XY takes −1, 0, 1 each with probability 1/3 ⇒ E[XY] = 0 = E[X]E[Y]. 3) (−1)(4)(2) = −8.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 9 · Bài 9.1</span>
<h2>Hiệp phương sai: đo hai biến cùng biến động</h2>
<p class="lead">Bảng đồng thời cho biết mọi thứ, nhưng ta thường muốn một con số nói rằng “khi X lớn hơn kỳ vọng của nó, Y thường lớn hơn hay nhỏ hơn kỳ vọng của nó?”. Con số đó là hiệp phương sai.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính Cov(X, Y) bằng công thức rút gọn E[XY] − E[X]E[Y].</li><li>Dùng các tính chất của hiệp phương sai (đối xứng, song tuyến tính).</li><li>Hiểu rằng hiệp phương sai bằng 0 không suy ra độc lập.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Hiệp phương sai</span>Cov(X, Y) = E[(X − μ<sub>X</sub>)(Y − μ<sub>Y</sub>)] = E[XY] − E[X] E[Y]<br>E[XY] = ∑<sub>x</sub>∑<sub>y</sub> x y p(x, y)   (hoặc ∬ x y f(x, y) dx dy)</div>
<p>Hiệp phương sai dương: X và Y có xu hướng cùng lớn (và cùng nhỏ). Âm: khi một biến lớn thì biến kia có xu hướng nhỏ. Đơn vị của nó là “đơn vị X × đơn vị Y”, nên độ lớn khó diễn giải — hệ số tương quan khắc phục điều đó (Bài 9.2).</p>
<div class="formula"><span class="lbl">Tính chất</span>Cov(X, X) = Var(X)    Cov(X, Y) = Cov(Y, X)    Cov(X, c) = 0<br>Cov(aX + b, cY + d) = ac · Cov(X, Y)    Cov(X + Y, Z) = Cov(X, Z) + Cov(Y, Z)<br>X, Y độc lập ⇒ E[XY] = E[X]E[Y] ⇒ Cov(X, Y) = 0</div>
<p>⚠️ Chiều ngược lại sai. Cho X đều trên {−1, 0, 1} và Y = X<sup>2</sup>. Y hoàn toàn xác định bởi X (phụ thuộc mạnh), nhưng E[XY] = E[X<sup>3</sup>] = 0 và E[X] = 0, nên Cov(X, Y) = 0. Hiệp phương sai chỉ phát hiện quan hệ <strong>tuyến tính</strong>.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — bảng bug (Bài 8.1).</b> Các giá trị có X·Y ≠ 0: (1, 1) với p = 0,15 và (2, 1) với p = 0,15.</p>
<p>Bước 1: E[XY] = 1 · 1 · 0,15 + 2 · 1 · 0,15 = 0,45.</p>
<p>Bước 2: E[X] = 0,85, E[Y] = 0,40 ⇒ E[X]E[Y] = 0,34.</p>
<p>Bước 3: Cov(X, Y) = 0,45 − 0,34 = <b>0,11 &gt; 0</b>: số bug ở hai module cùng chiều, khớp với E[X | Y = 1] &gt; E[X | Y = 0].</p></div>
<div class="callout"><p><b>Ví dụ 2 — đổi thang đo.</b> Nếu X được nhân đôi rồi cộng 1 và Y đổi thành mức phạt 3Y − 4, thì Cov(2X + 1, 3Y − 4) = 2 · 3 · 0,11 = <b>0,66</b>: phép tịnh tiến biến mất, hệ số nhân thì nhân lại.</p></div>
<div class="callout"><p><b>Ví dụ 3 — liên tục.</b> f(x, y) = x + y trên [0, 1]<sup>2</sup> (Bài 8.2). E[X] = E[Y] = 7/12; E[XY] = ∬ xy(x + y) dx dy = 1/3. Cov = 1/3 − 49/144 = <b>−1/144</b>: quan hệ âm yếu.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Kết luận độc lập từ Cov = 0.</li><li>Quên rằng số hạng tịnh tiến biến mất: Cov(X + 5, Y) = Cov(X, Y).</li><li>So sánh hiệp phương sai đo bằng các đơn vị khác nhau — hãy dùng hệ số tương quan.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Cov(X, Y) = E[XY] − E[X]E[Y].</li><li>Dấu cho biết chiều của quan hệ tuyến tính.</li><li>Song tuyến tính: Cov(aX + b, cY + d) = ac Cov(X, Y); Cov(X, X) = Var(X).</li><li>Độc lập ⇒ Cov = 0, nhưng không có chiều ngược lại.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class07-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 7b: Hiệp phương sai và tương quan</a></li><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/06%3A_Expected_Value_and_Variance" target="_blank" rel="noopener">Grinstead &amp; Snell — Chương 6 (hiệp phương sai và phương sai của tổng)</a></li><li><a href="https://www.youtube.com/playlist?list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo" target="_blank" rel="noopener">Harvard Stat 110 — Bài giảng 19 (phân phối đồng thời) và bài giảng hiệp phương sai ngay sau đó</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>X nhận 1, 2 mỗi giá trị xác suất 1/2 và Y = 3 − X. Tìm Cov(X, Y).</li><li>Chứng tỏ Cov(X, Y) = 0 với X đều trên {−1, 0, 1} và Y = X<sup>2</sup> bằng cách liệt kê ba kết quả.</li><li>Nếu Cov(X, Y) = 2, tìm Cov(−X, 4Y + 1).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Y = 3 − X ⇒ Cov(X, Y) = −Var(X) = −1/4. 2) XY nhận −1, 0, 1 mỗi giá trị xác suất 1/3 ⇒ E[XY] = 0 = E[X]E[Y]. 3) (−1)(4)(2) = −8.</p></div>`);

const c92 = L('ipy111-ts-9-2',
  '9.2 — Correlation and the variance of a sum|||9.2 — Hệ số tương quan và phương sai của tổng',
  'Hệ số tương quan ρ = Cov/(σXσY) ∈ [−1, 1], không đơn vị; Var(X + Y) = Var X + Var Y + 2Cov; ví dụ bảng bug ρ ≈ 0,283; danh mục đầu tư hai tài sản: tương quan âm giảm rủi ro.',
  `<span class="eyebrow">IPY111 · Chapter 9 · Lesson 9.2</span>
<h2>Correlation and the variance of a sum</h2>
<p class="lead">Correlation is covariance made unit-free: a number between −1 and 1. And covariance is exactly the missing term when we add dependent random variables — the mathematical reason diversification reduces risk.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute and interpret the correlation coefficient ρ.</li><li>Apply Var(aX + bY) with the covariance term.</li><li>Analyse a two-asset portfolio.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Correlation</span>ρ(X, Y) = Corr(X, Y) = Cov(X, Y) / (σ<sub>X</sub> σ<sub>Y</sub>),   −1 ≤ ρ ≤ 1</div>
<p>ρ = ±1 exactly when Y = aX + b with a ≠ 0 (perfect linear relation, sign of a). ρ = 0: uncorrelated. Correlation does not change under positive rescaling: Corr(2X + 1, 3Y − 4) = Corr(X, Y).</p>
<div class="formula"><span class="lbl">Variance of a sum</span>Var(X + Y) = Var(X) + Var(Y) + 2 Cov(X, Y)<br>Var(aX + bY) = a<sup>2</sup> Var(X) + b<sup>2</sup> Var(Y) + 2ab Cov(X, Y)<br>Var(X<sub>1</sub> + … + X<sub>n</sub>) = ∑ Var(X<sub>i</sub>) + 2 ∑<sub>i&lt;j</sub> Cov(X<sub>i</sub>, X<sub>j</sub>)</div>
<p>When the variables are independent (or just uncorrelated) all covariance terms vanish and we recover Chapter 6's rule.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — the bug table.</b> E[X<sup>2</sup>] = 1 · 0.35 + 4 · 0.25 = 1.35 ⇒ Var(X) = 1.35 − 0.85<sup>2</sup> = 0.6275. Var(Y) = 0.40 − 0.16 = 0.24. With Cov = 0.11:</p>
<p>ρ = 0.11 / √(0.6275 × 0.24) = 0.11 / 0.3881 ≈ <b>0.283</b> — a moderate positive correlation.</p>
<p>Total bugs: Var(X + Y) = 0.6275 + 0.24 + 2(0.11) = <b>1.0875</b> (it would be only 0.8675 if X and Y were independent). Var(2X − 3Y) = 4(0.6275) + 9(0.24) − 12(0.11) = <b>3.35</b>.</p></div>
<div class="callout"><p><b>Example 2 — a two-asset portfolio.</b> Asset A has return SD σ<sub>A</sub> = 0.20, asset B σ<sub>B</sub> = 0.30. Put half your money in each: R = 0.5A + 0.5B.</p>
<p>Var(R) = 0.25(0.04) + 0.25(0.09) + 2(0.25)ρ(0.20)(0.30) = 0.0325 + 0.03ρ.</p>
<p>ρ = +1: SD = √0.0625 = <b>0.25</b> (no diversification). ρ = 0: SD ≈ <b>0.180</b>. ρ = −0.5: Var = 0.0175, SD ≈ <b>0.132</b> — less risky than either asset alone. This is the core idea of modern portfolio theory: combine assets that are not perfectly correlated.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Dropping the 2Cov term for dependent variables (or writing Cov instead of 2Cov).</li><li>For differences: Var(X − Y) = Var X + Var Y − 2Cov(X, Y) — the sign of the covariance term flips, not of the variances.</li><li>Reading ρ = 0 as “no relationship” — it means no <em>linear</em> relationship.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>ρ = Cov/(σ<sub>X</sub>σ<sub>Y</sub>) ∈ [−1, 1], unit-free.</li><li>|ρ| = 1 ⇔ exact linear relation.</li><li>Var(X + Y) = Var X + Var Y + 2Cov(X, Y).</li><li>Negative correlation reduces the variance of a sum (diversification).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class07-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 7b: Covariance and Correlation</a></li><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/06%3A_Expected_Value_and_Variance" target="_blank" rel="noopener">Grinstead &amp; Snell — Chapter 6: variance of sums</a></li><li><a href="https://ocw.mit.edu/courses/res-6-012-introduction-to-probability-spring-2018/" target="_blank" rel="noopener">MIT RES.6-012 — lectures on covariance and correlation</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Var(X) = 4, Var(Y) = 9, ρ = 0.5. Find Cov(X, Y), Var(X + Y) and Var(X − Y).</li><li>What is Corr(X, −2X + 7)?</li><li>In the portfolio example, which ρ makes the 50/50 portfolio's SD equal to 0.15?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Cov = 0.5 × 2 × 3 = 3; Var(X + Y) = 4 + 9 + 6 = 19; Var(X − Y) = 4 + 9 − 6 = 7. 2) −1. 3) 0.0325 + 0.03ρ = 0.0225 ⇒ ρ = −1/3.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 9 · Bài 9.2</span>
<h2>Hệ số tương quan và phương sai của tổng</h2>
<p class="lead">Hệ số tương quan là hiệp phương sai đã bỏ đơn vị: một số nằm giữa −1 và 1. Và hiệp phương sai chính là số hạng còn thiếu khi cộng các biến ngẫu nhiên phụ thuộc — lý do toán học vì sao đa dạng hoá làm giảm rủi ro.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính và diễn giải hệ số tương quan ρ.</li><li>Áp dụng Var(aX + bY) có số hạng hiệp phương sai.</li><li>Phân tích danh mục đầu tư hai tài sản.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Hệ số tương quan</span>ρ(X, Y) = Corr(X, Y) = Cov(X, Y) / (σ<sub>X</sub> σ<sub>Y</sub>),   −1 ≤ ρ ≤ 1</div>
<p>ρ = ±1 đúng khi Y = aX + b với a ≠ 0 (quan hệ tuyến tính hoàn hảo, dấu theo a). ρ = 0: không tương quan. Hệ số tương quan không đổi khi đổi thang đo dương: Corr(2X + 1, 3Y − 4) = Corr(X, Y).</p>
<div class="formula"><span class="lbl">Phương sai của tổng</span>Var(X + Y) = Var(X) + Var(Y) + 2 Cov(X, Y)<br>Var(aX + bY) = a<sup>2</sup> Var(X) + b<sup>2</sup> Var(Y) + 2ab Cov(X, Y)<br>Var(X<sub>1</sub> + … + X<sub>n</sub>) = ∑ Var(X<sub>i</sub>) + 2 ∑<sub>i&lt;j</sub> Cov(X<sub>i</sub>, X<sub>j</sub>)</div>
<p>Khi các biến độc lập (hoặc chỉ cần không tương quan) mọi số hạng hiệp phương sai biến mất và ta có lại quy tắc của Chương 6.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — bảng bug.</b> E[X<sup>2</sup>] = 1 · 0,35 + 4 · 0,25 = 1,35 ⇒ Var(X) = 1,35 − 0,85<sup>2</sup> = 0,6275. Var(Y) = 0,40 − 0,16 = 0,24. Với Cov = 0,11:</p>
<p>ρ = 0,11 / √(0,6275 × 0,24) = 0,11 / 0,3881 ≈ <b>0,283</b> — tương quan dương vừa phải.</p>
<p>Tổng số bug: Var(X + Y) = 0,6275 + 0,24 + 2(0,11) = <b>1,0875</b> (chỉ là 0,8675 nếu X và Y độc lập). Var(2X − 3Y) = 4(0,6275) + 9(0,24) − 12(0,11) = <b>3,35</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — danh mục hai tài sản.</b> Tài sản A có độ lệch chuẩn lợi suất σ<sub>A</sub> = 0,20, tài sản B σ<sub>B</sub> = 0,30. Chia đôi tiền vào mỗi cái: R = 0,5A + 0,5B.</p>
<p>Var(R) = 0,25(0,04) + 0,25(0,09) + 2(0,25)ρ(0,20)(0,30) = 0,0325 + 0,03ρ.</p>
<p>ρ = +1: SD = √0,0625 = <b>0,25</b> (không đa dạng hoá được gì). ρ = 0: SD ≈ <b>0,180</b>. ρ = −0,5: Var = 0,0175, SD ≈ <b>0,132</b> — ít rủi ro hơn cả từng tài sản riêng lẻ. Đây là ý tưởng cốt lõi của lý thuyết danh mục hiện đại: kết hợp các tài sản không tương quan hoàn hảo.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Bỏ số hạng 2Cov với biến phụ thuộc (hoặc viết Cov thay vì 2Cov).</li><li>Với hiệu: Var(X − Y) = Var X + Var Y − 2Cov(X, Y) — đổi dấu số hạng hiệp phương sai, không đổi dấu phương sai.</li><li>Đọc ρ = 0 là “không có quan hệ” — nó chỉ nghĩa là không có quan hệ <em>tuyến tính</em>.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>ρ = Cov/(σ<sub>X</sub>σ<sub>Y</sub>) ∈ [−1, 1], không đơn vị.</li><li>|ρ| = 1 ⇔ quan hệ tuyến tính chính xác.</li><li>Var(X + Y) = Var X + Var Y + 2Cov(X, Y).</li><li>Tương quan âm làm giảm phương sai của tổng (đa dạng hoá).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class07-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 7b: Hiệp phương sai và tương quan</a></li><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/06%3A_Expected_Value_and_Variance" target="_blank" rel="noopener">Grinstead &amp; Snell — Chương 6: phương sai của tổng</a></li><li><a href="https://ocw.mit.edu/courses/res-6-012-introduction-to-probability-spring-2018/" target="_blank" rel="noopener">MIT RES.6-012 — bài giảng về hiệp phương sai và tương quan</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Var(X) = 4, Var(Y) = 9, ρ = 0,5. Tìm Cov(X, Y), Var(X + Y) và Var(X − Y).</li><li>Corr(X, −2X + 7) bằng bao nhiêu?</li><li>Trong ví dụ danh mục, ρ bằng bao nhiêu thì độ lệch chuẩn của danh mục 50/50 bằng 0,15?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Cov = 0,5 × 2 × 3 = 3; Var(X + Y) = 4 + 9 + 6 = 19; Var(X − Y) = 4 + 9 − 6 = 7. 2) −1. 3) 0,0325 + 0,03ρ = 0,0225 ⇒ ρ = −1/3.</p></div>`);

const c93 = L('ipy111-ts-9-3',
  '9.3 — Covariance and correlation in data: Python, pitfalls and causation|||9.3 — Hiệp phương sai và tương quan trong dữ liệu: Python, cạm bẫy và nhân quả',
  'Ước lượng hiệp phương sai và tương quan từ mẫu bằng numpy (chạy thật); quan hệ phi tuyến có tương quan ≈ 0; ngoại lai; tương quan không phải nhân quả; biến gây nhiễu.',
  `<span class="eyebrow">IPY111 · Chapter 9 · Lesson 9.3</span>
<h2>Covariance and correlation in data</h2>
<p class="lead">In practice we do not know the joint distribution; we have data. The sample covariance and sample correlation estimate Cov and ρ — and come with traps that every data scientist must know.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute sample covariance and correlation with NumPy.</li><li>Recognise when correlation misleads (non-linear patterns, outliers).</li><li>Distinguish correlation from causation; identify confounders.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Sample versions (n data pairs)</span>s<sub>XY</sub> = (1/(n − 1)) ∑ (x<sub>i</sub> − x̄)(y<sub>i</sub> − ȳ),   r = s<sub>XY</sub> / (s<sub>X</sub> s<sub>Y</sub>)</div>
<p>By the Law of Large Numbers (Chapter 10) these converge to Cov(X, Y) and ρ as n grows. The divisor n − 1 makes s<sub>XY</sub> unbiased (statistics courses explain why).</p>
<h3>✍️ Worked example — simulation with NumPy</h3>
<p>We simulate x ∼ N(0, 1), y = 2x + noise with independent noise N(0, 1), and z = x<sup>2</sup>. Theory: Cov(x, y) = 2Var(x) = 2; Var(y) = 4 + 1 = 5; ρ(x, y) = 2/√5 ≈ 0.894; Cov(x, x<sup>2</sup>) = E[x<sup>3</sup>] = 0.</p>
<pre><code class="language-python">import numpy as np
rng = np.random.default_rng(9)

x = rng.normal(0, 1, 10_000)
y = 2 * x + rng.normal(0, 1, 10_000)   # linear relation + noise
z = x**2                                # dependent but not linearly

print("cov(x, y) =", np.round(np.cov(x, y)[0, 1], 3))
print("corr(x, y) =", np.round(np.corrcoef(x, y)[0, 1], 3))
print("corr(x, z) =", np.round(np.corrcoef(x, z)[0, 1], 3))
</code></pre>
<div class="out">cov(x, y) = 2.007
corr(x, y) = 0.894
corr(x, z) = 0.034</div>
<p>The estimates match the theory. And z = x<sup>2</sup> is a perfect function of x, yet its correlation with x is about 0: <strong>correlation only sees straight-line patterns</strong>.</p>
<h3>⚠️ Pitfalls when reading correlations</h3>
<div class="pitfall"><ul>
<li><strong>Non-linear dependence:</strong> U-shaped or cyclic relations can give r ≈ 0. Always plot a scatter diagram.</li>
<li><strong>Outliers:</strong> a single extreme point can create or destroy a strong correlation.</li>
<li><strong>Correlation ≠ causation:</strong> ice-cream sales and drownings are positively correlated because both rise in hot weather (a <em>confounder</em>). Students who attend review sessions pass more often (Lesson 3.1), but motivated students may both attend and pass.</li>
<li><strong>Restricted range:</strong> correlating entrance score and GPA only among admitted students underestimates the true correlation.</li>
<li><strong>Many comparisons:</strong> test 100 unrelated variables and some will show r far from 0 by chance.</li>
</ul></div>
<div class="callout"><p><b>How to establish causation.</b> The gold standard is a randomised experiment (A/B test): randomly assign users to the new or old design, so confounders are balanced between groups by design. Then a difference in outcomes can be attributed to the design — with an uncertainty that the Central Limit Theorem (Chapter 10) quantifies.</p></div>
<h3>📌 Summary</h3>
<ul><li>Sample covariance/correlation estimate Cov and ρ (<code>np.cov</code>, <code>np.corrcoef</code>).</li><li>r measures linear association only; plot your data.</li><li>Outliers and restricted ranges distort r.</li><li>Correlation is not causation; randomisation is the cure.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.corrcoef.html" target="_blank" rel="noopener">NumPy — numpy.corrcoef</a> · <a href="https://numpy.org/doc/stable/reference/generated/numpy.cov.html" target="_blank" rel="noopener">numpy.cov</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class07-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 7b (sample correlation, correlation is not causation)</a></li><li><a href="https://docs.python.org/3/library/statistics.html" target="_blank" rel="noopener">Python statistics module (covariance, correlation without NumPy)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>If y = −3x + noise (noise independent with variance 1, Var(x) = 1), what is ρ(x, y)?</li><li>Give a real example (from software or student life) of two correlated quantities driven by a common cause.</li><li>Why does <code>corr(x, z)</code> print 0.034 rather than exactly 0?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Cov = −3, Var(y) = 9 + 1 = 10 ⇒ ρ = −3/√10 ≈ −0.949. 2) E.g. number of commits and number of bugs per module are both driven by module size. 3) It is a sample estimate from 10 000 points; it fluctuates around the true value 0 with error of order 1/√n ≈ 0.01–0.03.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 9 · Bài 9.3</span>
<h2>Hiệp phương sai và tương quan trong dữ liệu</h2>
<p class="lead">Thực tế ta không biết phân phối đồng thời; ta có dữ liệu. Hiệp phương sai mẫu và hệ số tương quan mẫu ước lượng Cov và ρ — kèm theo những cái bẫy mà người làm dữ liệu nào cũng phải biết.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính hiệp phương sai và tương quan mẫu bằng NumPy.</li><li>Nhận ra khi nào tương quan gây hiểu lầm (quan hệ phi tuyến, ngoại lai).</li><li>Phân biệt tương quan với nhân quả; nhận diện biến gây nhiễu.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Phiên bản mẫu (n cặp dữ liệu)</span>s<sub>XY</sub> = (1/(n − 1)) ∑ (x<sub>i</sub> − x̄)(y<sub>i</sub> − ȳ),   r = s<sub>XY</sub> / (s<sub>X</sub> s<sub>Y</sub>)</div>
<p>Theo Luật số lớn (Chương 10), chúng hội tụ về Cov(X, Y) và ρ khi n tăng. Mẫu số n − 1 làm s<sub>XY</sub> không chệch (các môn thống kê sẽ giải thích vì sao).</p>
<h3>✍️ Ví dụ — mô phỏng bằng NumPy</h3>
<p>Ta mô phỏng x ∼ N(0, 1), y = 2x + nhiễu với nhiễu độc lập N(0, 1), và z = x<sup>2</sup>. Lý thuyết: Cov(x, y) = 2Var(x) = 2; Var(y) = 4 + 1 = 5; ρ(x, y) = 2/√5 ≈ 0,894; Cov(x, x<sup>2</sup>) = E[x<sup>3</sup>] = 0.</p>
<pre><code class="language-python">import numpy as np
rng = np.random.default_rng(9)

x = rng.normal(0, 1, 10_000)
y = 2 * x + rng.normal(0, 1, 10_000)   # linear relation + noise
z = x**2                                # dependent but not linearly

print("cov(x, y) =", np.round(np.cov(x, y)[0, 1], 3))
print("corr(x, y) =", np.round(np.corrcoef(x, y)[0, 1], 3))
print("corr(x, z) =", np.round(np.corrcoef(x, z)[0, 1], 3))
</code></pre>
<div class="out">cov(x, y) = 2.007
corr(x, y) = 0.894
corr(x, z) = 0.034</div>
<p>Ước lượng khớp lý thuyết. Còn z = x<sup>2</sup> là hàm hoàn hảo của x, vậy mà tương quan với x gần 0: <strong>hệ số tương quan chỉ thấy quan hệ dạng đường thẳng</strong>.</p>
<h3>⚠️ Cạm bẫy khi đọc hệ số tương quan</h3>
<div class="pitfall"><ul>
<li><strong>Phụ thuộc phi tuyến:</strong> quan hệ hình chữ U hay tuần hoàn có thể cho r ≈ 0. Luôn vẽ biểu đồ tán xạ.</li>
<li><strong>Ngoại lai:</strong> một điểm cực đoan có thể tạo ra hoặc xoá đi một tương quan mạnh.</li>
<li><strong>Tương quan ≠ nhân quả:</strong> doanh số kem và số vụ đuối nước tương quan dương vì cả hai tăng khi trời nóng (một <em>biến gây nhiễu</em>). Sinh viên đi ôn tập qua môn nhiều hơn (Bài 3.1), nhưng sinh viên chăm chỉ có thể vừa đi ôn vừa qua môn.</li>
<li><strong>Thu hẹp phạm vi:</strong> tính tương quan giữa điểm đầu vào và GPA chỉ trong nhóm đã trúng tuyển sẽ đánh giá thấp tương quan thật.</li>
<li><strong>So sánh quá nhiều:</strong> thử 100 biến không liên quan, sẽ có vài biến cho r khác xa 0 do tình cờ.</li>
</ul></div>
<div class="callout"><p><b>Làm sao xác lập nhân quả.</b> Tiêu chuẩn vàng là thí nghiệm ngẫu nhiên hoá (kiểm thử A/B): phân người dùng ngẫu nhiên vào thiết kế mới hoặc cũ, để các biến gây nhiễu được cân bằng giữa hai nhóm ngay từ thiết kế. Khi đó khác biệt về kết quả mới quy được cho thiết kế — với độ bất định mà Định lý giới hạn trung tâm (Chương 10) lượng hoá.</p></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Hiệp phương sai/tương quan mẫu ước lượng Cov và ρ (<code>np.cov</code>, <code>np.corrcoef</code>).</li><li>r chỉ đo quan hệ tuyến tính; hãy vẽ dữ liệu.</li><li>Ngoại lai và phạm vi bị thu hẹp làm méo r.</li><li>Tương quan không phải nhân quả; ngẫu nhiên hoá là cách chữa.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://numpy.org/doc/stable/reference/generated/numpy.corrcoef.html" target="_blank" rel="noopener">NumPy — numpy.corrcoef</a> · <a href="https://numpy.org/doc/stable/reference/generated/numpy.cov.html" target="_blank" rel="noopener">numpy.cov</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class07-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 7b (tương quan mẫu, tương quan không phải nhân quả)</a></li><li><a href="https://docs.python.org/3/library/statistics.html" target="_blank" rel="noopener">Module statistics của Python (covariance, correlation không cần NumPy)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Nếu y = −3x + nhiễu (nhiễu độc lập, phương sai 1, Var(x) = 1) thì ρ(x, y) bằng bao nhiêu?</li><li>Cho một ví dụ thật (phần mềm hoặc đời sinh viên) về hai đại lượng tương quan do cùng một nguyên nhân chung.</li><li>Vì sao <code>corr(x, z)</code> in ra 0.034 chứ không đúng bằng 0?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Cov = −3, Var(y) = 9 + 1 = 10 ⇒ ρ = −3/√10 ≈ −0,949. 2) Ví dụ số commit và số bug của mỗi module cùng do kích thước module quyết định. 3) Đó là ước lượng mẫu từ 10 000 điểm; nó dao động quanh giá trị thật 0 với sai số cỡ 1/√n ≈ 0,01–0,03.</p></div>`);

const q9 = QZ(9, 'Quiz — Chapter 9: Covariance and correlation|||Quiz — Chương 9: Hiệp phương sai và tương quan', 'Kiểm tra chương 9: công thức hiệp phương sai, tính chất, độc lập vs không tương quan, hệ số tương quan, phương sai của tổng, danh mục, nhân quả.', [
  Q('q1', "Cov(X, Y) equals|||Cov(X, Y) bằng",
    ['E[XY] − E[X]E[Y]|||E[XY] − E[X]E[Y]', 'E[X]E[Y] − E[XY]|||E[X]E[Y] − E[XY]', 'Var(X)Var(Y)|||Var(X)Var(Y)', 'E[X − Y]|||E[X − Y]'], 0,
    "Shortcut formula.|||Công thức rút gọn."),
  Q('q2', "Bug table: E[XY] = 0.45, E[X] = 0.85, E[Y] = 0.40. Cov =|||Bảng bug: E[XY] = 0,45, E[X] = 0,85, E[Y] = 0,40. Cov =",
    ['0.45|||0,45', '0.11|||0,11', '0.34|||0,34', '−0.11|||−0,11'], 1,
    "0.45 − 0.34.|||0,45 − 0,34."),
  Q('q3', "Cov(2X + 1, 3Y − 4) =|||Cov(2X + 1, 3Y − 4) =",
    ['Cov(X, Y)|||Cov(X, Y)', '6 Cov(X, Y)|||6 Cov(X, Y)', '6 Cov(X, Y) − 4|||6 Cov(X, Y) − 4', '5 Cov(X, Y)|||5 Cov(X, Y)'], 1,
    "Shifts vanish, scale factors multiply.|||Tịnh tiến biến mất, hệ số nhân nhân lại."),
  Q('q4', "X uniform on {−1, 0, 1}, Y = X². Then|||X đều trên {−1, 0, 1}, Y = X². Khi đó",
    ['Cov = 0 and X, Y independent|||Cov = 0 và X, Y độc lập', 'Cov = 0 but X, Y dependent|||Cov = 0 nhưng X, Y phụ thuộc', 'Cov > 0|||Cov > 0', 'Cov < 0|||Cov < 0'], 1,
    "Uncorrelated does not imply independent.|||Không tương quan không suy ra độc lập."),
  Q('q5', "The correlation coefficient always lies in|||Hệ số tương quan luôn nằm trong",
    ['[0, 1]|||[0, 1]', '[−1, 1]|||[−1, 1]', '(−∞, ∞)|||(−∞, ∞)', '[−Var, Var]|||[−Var, Var]'], 1,
    "By the Cauchy–Schwarz inequality.|||Theo bất đẳng thức Cauchy–Schwarz."),
  Q('q6', "Corr(X, −2X + 7) =|||Corr(X, −2X + 7) =",
    ['−2|||−2', '−1|||−1', '0|||0', '1|||1'], 1,
    "Exact linear relation with negative slope.|||Quan hệ tuyến tính chính xác với hệ số góc âm."),
  Q('q7', "Var(X + Y) for dependent X, Y equals|||Var(X + Y) với X, Y phụ thuộc bằng",
    ['Var X + Var Y|||Var X + Var Y', 'Var X + Var Y + Cov(X, Y)|||Var X + Var Y + Cov(X, Y)', 'Var X + Var Y + 2Cov(X, Y)|||Var X + Var Y + 2Cov(X, Y)', '(σ_X + σ_Y)²|||(σ_X + σ_Y)²'], 2,
    "Expand E[(X + Y − μ_X − μ_Y)²].|||Khai triển E[(X + Y − μ_X − μ_Y)²]."),
  Q('q8', "Var X = 4, Var Y = 9, ρ = 0.5. Var(X − Y) =|||Var X = 4, Var Y = 9, ρ = 0,5. Var(X − Y) =",
    ['19|||19', '7|||7', '13|||13', '−5|||−5'], 1,
    "4 + 9 − 2 × 3.|||4 + 9 − 2 × 3."),
  Q('q9', "A 50/50 portfolio of assets with SD 0.2 and 0.3 is least risky when ρ is|||Danh mục 50/50 hai tài sản có SD 0,2 và 0,3 ít rủi ro nhất khi ρ",
    ['+1|||+1', '0|||0', 'negative|||âm', 'irrelevant|||không liên quan'], 2,
    "Var = 0.0325 + 0.03ρ decreases as ρ decreases.|||Var = 0,0325 + 0,03ρ giảm khi ρ giảm."),
  Q('q10', "Ice-cream sales and drownings are correlated because of|||Doanh số kem và số vụ đuối nước tương quan vì",
    ['causation|||quan hệ nhân quả', 'a confounder (hot weather)|||một biến gây nhiễu (trời nóng)', 'independence|||tính độc lập', 'measurement error|||sai số đo'], 1,
    "A common cause drives both.|||Một nguyên nhân chung chi phối cả hai."),
]);

const ch9 = {
  title: 'Chapter 9 — Covariance and correlation|||Chương 9 — Hiệp phương sai và tương quan',
  description: 'Hiệp phương sai, tính chất, không tương quan vs độc lập; hệ số tương quan, phương sai của tổng, danh mục hai tài sản; ước lượng từ dữ liệu bằng numpy, cạm bẫy và nhân quả (Blitzstein & Hwang 7.3 · Ross 7.4).',
  lessons: [c91, c92, c93, q9],
};

// ───────────────────────────── Chương 10 — Định lý giới hạn ─────────────────────────────
const c101 = L('ipy111-ts-10-1',
  '10.1 — Markov and Chebyshev inequalities|||10.1 — Bất đẳng thức Markov và Chebyshev',
  'Chặn xác suất đuôi chỉ từ kỳ vọng (Markov) hoặc kỳ vọng + phương sai (Chebyshev); ví dụ thời gian phản hồi server; so sánh với giá trị đúng của phân phối chuẩn.',
  `<span class="eyebrow">IPY111 · Chapter 10 · Lesson 10.1</span>
<h2>Markov and Chebyshev inequalities</h2>
<p class="lead">Often we know only the mean (and maybe the variance) of a quantity, not its full distribution. Two simple inequalities still give guaranteed bounds on how often it can be extreme — and they are the key to proving the Law of Large Numbers.</p>
<h3>🎯 Objectives</h3>
<ul><li>Apply Markov's inequality to non-negative variables.</li><li>Apply Chebyshev's inequality using mean and variance.</li><li>Judge how loose these bounds are compared with exact values.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Markov's inequality</span>If X ≥ 0 and a &gt; 0:  P(X ≥ a) ≤ E[X] / a</div>
<p><em>Why:</em> a · I(X ≥ a) ≤ X always; take expectations: a · P(X ≥ a) ≤ E[X].</p>
<div class="formula"><span class="lbl">Chebyshev's inequality</span>For any X with mean μ and SD σ, and k &gt; 0:  P(|X − μ| ≥ kσ) ≤ 1/k<sup>2</sup><br>Equivalently P(|X − μ| ≥ c) ≤ Var(X)/c<sup>2</sup></div>
<p><em>Why:</em> apply Markov to the non-negative variable (X − μ)<sup>2</sup> with a = c<sup>2</sup>.</p>
<p>Chebyshev holds for <em>every</em> distribution, so it is conservative: at least 75% of any distribution lies within 2 SDs and at least 88.9% within 3 SDs. For a normal distribution the true values are 95.4% and 99.7%.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — latency with only a mean.</b> A server's response time X has mean 200 ms. Markov: P(X ≥ 1 000 ms) ≤ 200/1 000 = <b>0.2</b>. At most 20% of requests can take a second or more — whatever the distribution.</p></div>
<div class="callout"><p><b>Example 2 — adding the SD.</b> Suppose also σ = 50 ms. Chebyshev: P(|X − 200| ≥ 100) ≤ 50<sup>2</sup>/100<sup>2</sup> = <b>0.25</b>. If X were in fact normal, the exact value would be P(|Z| ≥ 2) ≈ <b>0.0455</b> — Chebyshev is about 5 times too pessimistic, but it is <em>guaranteed</em>.</p></div>
<div class="callout"><p><b>Example 3 — k = 3.</b> Chebyshev gives at most 1/9 ≈ 0.111 outside μ ± 3σ; the normal gives 0.0027. Use Chebyshev for guarantees and proofs, the normal (when justified) for realistic estimates.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Applying Markov to a variable that can be negative.</li><li>Using Chebyshev with k ≤ 1 — the bound 1/k<sup>2</sup> ≥ 1 says nothing.</li><li>Confusing the bound with the actual probability.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Markov: P(X ≥ a) ≤ E[X]/a for X ≥ 0.</li><li>Chebyshev: P(|X − μ| ≥ kσ) ≤ 1/k<sup>2</sup> for any X.</li><li>Distribution-free, therefore loose.</li><li>Chebyshev is the engine of the weak Law of Large Numbers (next lesson).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/08%3A_Law_of_Large_Numbers" target="_blank" rel="noopener">Grinstead &amp; Snell — Chapter 8: Law of Large Numbers (Chebyshev inequality)</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class06-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 6b: Central Limit Theorem and the Law of Large Numbers</a></li><li><a href="https://ocw.mit.edu/courses/res-6-012-introduction-to-probability-spring-2018/" target="_blank" rel="noopener">MIT RES.6-012 — lectures on inequalities and limit theorems</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>The average file size on a server is 2 MB. Bound the fraction of files of at least 10 MB.</li><li>Scores have mean 70 and SD 10. At least what fraction lies between 50 and 90?</li><li>For which k does Chebyshev guarantee that at least 99% lies within μ ± kσ?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) ≤ 2/10 = 0.2. 2) k = 2 ⇒ at least 1 − 1/4 = 75%. 3) 1/k<sup>2</sup> ≤ 0.01 ⇒ k ≥ 10.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 10 · Bài 10.1</span>
<h2>Bất đẳng thức Markov và Chebyshev</h2>
<p class="lead">Nhiều khi ta chỉ biết kỳ vọng (và có thể phương sai) của một đại lượng, không biết toàn bộ phân phối. Hai bất đẳng thức đơn giản vẫn cho chặn bảo đảm về tần suất nó có thể cực đoan — và chúng là chìa khoá để chứng minh Luật số lớn.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp dụng bất đẳng thức Markov cho biến không âm.</li><li>Áp dụng bất đẳng thức Chebyshev từ kỳ vọng và phương sai.</li><li>Đánh giá các chặn này lỏng cỡ nào so với giá trị đúng.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Bất đẳng thức Markov</span>Nếu X ≥ 0 và a &gt; 0:  P(X ≥ a) ≤ E[X] / a</div>
<p><em>Vì sao:</em> luôn có a · I(X ≥ a) ≤ X; lấy kỳ vọng: a · P(X ≥ a) ≤ E[X].</p>
<div class="formula"><span class="lbl">Bất đẳng thức Chebyshev</span>Với mọi X có kỳ vọng μ và độ lệch chuẩn σ, và k &gt; 0:  P(|X − μ| ≥ kσ) ≤ 1/k<sup>2</sup><br>Tương đương P(|X − μ| ≥ c) ≤ Var(X)/c<sup>2</sup></div>
<p><em>Vì sao:</em> áp Markov cho biến không âm (X − μ)<sup>2</sup> với a = c<sup>2</sup>.</p>
<p>Chebyshev đúng với <em>mọi</em> phân phối, nên nó thận trọng: ít nhất 75% của bất kỳ phân phối nào nằm trong 2 độ lệch chuẩn và ít nhất 88,9% trong 3 độ lệch chuẩn. Với phân phối chuẩn, giá trị thật là 95,4% và 99,7%.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — độ trễ, chỉ biết kỳ vọng.</b> Thời gian phản hồi X của server có kỳ vọng 200 ms. Markov: P(X ≥ 1 000 ms) ≤ 200/1 000 = <b>0,2</b>. Nhiều nhất 20% request mất từ một giây trở lên — dù phân phối là gì.</p></div>
<div class="callout"><p><b>Ví dụ 2 — thêm độ lệch chuẩn.</b> Giả sử biết thêm σ = 50 ms. Chebyshev: P(|X − 200| ≥ 100) ≤ 50<sup>2</sup>/100<sup>2</sup> = <b>0,25</b>. Nếu X thật sự là chuẩn, giá trị đúng là P(|Z| ≥ 2) ≈ <b>0,0455</b> — Chebyshev bi quan khoảng 5 lần, nhưng nó được <em>bảo đảm</em>.</p></div>
<div class="callout"><p><b>Ví dụ 3 — k = 3.</b> Chebyshev cho nhiều nhất 1/9 ≈ 0,111 nằm ngoài μ ± 3σ; phân phối chuẩn cho 0,0027. Dùng Chebyshev để bảo đảm và chứng minh, dùng phân phối chuẩn (khi có cơ sở) để ước lượng sát thực tế.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Áp Markov cho biến có thể âm.</li><li>Dùng Chebyshev với k ≤ 1 — chặn 1/k<sup>2</sup> ≥ 1 không nói được gì.</li><li>Nhầm chặn trên với xác suất thật.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Markov: P(X ≥ a) ≤ E[X]/a với X ≥ 0.</li><li>Chebyshev: P(|X − μ| ≥ kσ) ≤ 1/k<sup>2</sup> với mọi X.</li><li>Không phụ thuộc phân phối, nên lỏng.</li><li>Chebyshev là động cơ của Luật số lớn dạng yếu (bài sau).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/08%3A_Law_of_Large_Numbers" target="_blank" rel="noopener">Grinstead &amp; Snell — Chương 8: Luật số lớn (bất đẳng thức Chebyshev)</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class06-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 6b: Định lý giới hạn trung tâm và Luật số lớn</a></li><li><a href="https://ocw.mit.edu/courses/res-6-012-introduction-to-probability-spring-2018/" target="_blank" rel="noopener">MIT RES.6-012 — bài giảng về bất đẳng thức và định lý giới hạn</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Kích thước file trung bình trên server là 2 MB. Chặn tỉ lệ file từ 10 MB trở lên.</li><li>Điểm thi có kỳ vọng 70, độ lệch chuẩn 10. Ít nhất bao nhiêu phần nằm giữa 50 và 90?</li><li>Với k nào Chebyshev bảo đảm ít nhất 99% nằm trong μ ± kσ?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) ≤ 2/10 = 0,2. 2) k = 2 ⇒ ít nhất 1 − 1/4 = 75%. 3) 1/k<sup>2</sup> ≤ 0,01 ⇒ k ≥ 10.</p></div>`);

const c102 = L('ipy111-ts-10-2',
  '10.2 — The Law of Large Numbers (with Python)|||10.2 — Luật số lớn (có Python)',
  'Trung bình mẫu X̄ có kỳ vọng μ và phương sai σ²/n; chứng minh Luật số lớn dạng yếu bằng Chebyshev; mô phỏng tung đồng xu 100 000 lần chạy thật; cỡ mẫu cần thiết; ngộ nhận của con bạc.',
  `<span class="eyebrow">IPY111 · Chapter 10 · Lesson 10.2</span>
<h2>The Law of Large Numbers</h2>
<p class="lead">Why can a casino be sure to make money, an insurer price policies, and Monte Carlo simulation give reliable answers? Because averages of many independent trials settle down to the expected value. That is the Law of Large Numbers (LLN).</p>
<h3>🎯 Objectives</h3>
<ul><li>Compute the mean and variance of a sample mean.</li><li>State and prove the weak LLN with Chebyshev.</li><li>Choose a sample size for a desired accuracy; avoid the gambler's fallacy.</li></ul>
<h3>📖 Lecture</h3>
<p>Let X<sub>1</sub>, …, X<sub>n</sub> be independent and identically distributed (i.i.d.) with mean μ and variance σ<sup>2</sup>. The <strong>sample mean</strong> is X̄<sub>n</sub> = (X<sub>1</sub> + … + X<sub>n</sub>)/n.</p>
<div class="formula"><span class="lbl">Mean and variance of the sample mean</span>E[X̄<sub>n</sub>] = μ,   Var(X̄<sub>n</sub>) = σ<sup>2</sup>/n,   SD(X̄<sub>n</sub>) = σ/√n</div>
<div class="formula"><span class="lbl">Weak Law of Large Numbers</span>For every ε &gt; 0:  P(|X̄<sub>n</sub> − μ| ≥ ε) ≤ σ<sup>2</sup>/(n ε<sup>2</sup>) → 0  as n → ∞</div>
<p>The proof is one line: Chebyshev applied to X̄<sub>n</sub>, whose variance is σ<sup>2</sup>/n. For indicators (X<sub>i</sub> = 1 if trial i succeeds) X̄<sub>n</sub> is the observed frequency p̂ and μ = p: the frequentist interpretation of probability (Lesson 2.4) is now a theorem. The SD σ/√n explains the Monte Carlo error rule 1/√N.</p>
<h3>✍️ Worked examples</h3>
<pre><code class="language-python">import random
random.seed(42)

heads = 0
for n in range(1, 100_001):
    heads += random.random() &lt; 0.5
    if n in (10, 100, 1_000, 10_000, 100_000):
        print(n, heads / n, round(abs(heads / n - 0.5), 4))
</code></pre>
<div class="out">10 0.6 0.1
100 0.5 0.0
1000 0.48 0.02
10000 0.499 0.001
100000 0.49934 0.0007</div>
<p>The proportion of heads wanders early (0.6 after 10 tosses, 0.48 after 1 000) and then hugs 0.5. The <em>number</em> of heads minus n/2 does not shrink — only the <em>proportion</em> converges.</p>
<div class="callout"><p><b>Sample size by Chebyshev.</b> How many users must we survey so that the observed proportion p̂ is within 0.05 of the true p with probability at least 95%? Var(p̂) = p(1 − p)/n ≤ 1/(4n). Chebyshev: P(|p̂ − p| ≥ 0.05) ≤ 1/(4n · 0.0025) ≤ 0.05 ⇒ n ≥ <b>2 000</b>. (The Central Limit Theorem will show that about 385 are enough — Chebyshev is conservative.)</p></div>
<div class="callout"><p><b>The gambler's fallacy.</b> After 10 reds in a row at roulette, black is <em>not</em> “due”. The LLN does not work by compensation; it works by <em>dilution</em>: the 10 reds become irrelevant among millions of later spins.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Believing that future outcomes “balance out” past ones (gambler's fallacy).</li><li>Applying the LLN to dependent data or to distributions without a finite mean.</li><li>Thinking SD(X̄) = σ/n — it is σ/√n: four times the data halves the error.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>E[X̄<sub>n</sub>] = μ, SD(X̄<sub>n</sub>) = σ/√n.</li><li>Weak LLN: X̄<sub>n</sub> → μ in probability (proof by Chebyshev).</li><li>Frequencies converge to probabilities; Monte Carlo works.</li><li>Convergence by dilution, not compensation.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/08%3A_Law_of_Large_Numbers" target="_blank" rel="noopener">Grinstead &amp; Snell — Chapter 8: Law of Large Numbers</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class06-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 6b: the Law of Large Numbers</a></li><li><a href="https://seeing-theory.brown.edu/basic-probability/index.html" target="_blank" rel="noopener">Seeing Theory — Basic Probability: watch the running frequency converge</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>X<sub>i</sub> are die rolls (σ<sup>2</sup> = 35/12). Find SD(X̄<sub>100</sub>).</li><li>Use Chebyshev to bound P(|X̄<sub>100</sub> − 3.5| ≥ 0.5) for die rolls.</li><li>By how much must n grow to cut SD(X̄<sub>n</sub>) by a factor of 10?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) √(35/12)/10 ≈ 0.171. 2) (35/12)/(100 × 0.25) ≈ 0.117. 3) By a factor of 100.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 10 · Bài 10.2</span>
<h2>Luật số lớn</h2>
<p class="lead">Vì sao sòng bạc chắc chắn có lãi, công ty bảo hiểm định giá được hợp đồng, và mô phỏng Monte Carlo cho kết quả tin cậy? Vì trung bình của nhiều phép thử độc lập sẽ ổn định về kỳ vọng. Đó là Luật số lớn (LLN).</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính kỳ vọng và phương sai của trung bình mẫu.</li><li>Phát biểu và chứng minh Luật số lớn dạng yếu bằng Chebyshev.</li><li>Chọn cỡ mẫu cho độ chính xác mong muốn; tránh ngộ nhận của con bạc.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Cho X<sub>1</sub>, …, X<sub>n</sub> độc lập, cùng phân phối (i.i.d.) với kỳ vọng μ và phương sai σ<sup>2</sup>. <strong>Trung bình mẫu</strong> là X̄<sub>n</sub> = (X<sub>1</sub> + … + X<sub>n</sub>)/n.</p>
<div class="formula"><span class="lbl">Kỳ vọng và phương sai của trung bình mẫu</span>E[X̄<sub>n</sub>] = μ,   Var(X̄<sub>n</sub>) = σ<sup>2</sup>/n,   SD(X̄<sub>n</sub>) = σ/√n</div>
<div class="formula"><span class="lbl">Luật số lớn dạng yếu</span>Với mọi ε &gt; 0:  P(|X̄<sub>n</sub> − μ| ≥ ε) ≤ σ<sup>2</sup>/(n ε<sup>2</sup>) → 0  khi n → ∞</div>
<p>Chứng minh chỉ một dòng: áp Chebyshev cho X̄<sub>n</sub>, có phương sai σ<sup>2</sup>/n. Với biến chỉ báo (X<sub>i</sub> = 1 nếu lần thử i thành công), X̄<sub>n</sub> là tần suất quan sát p̂ và μ = p: cách hiểu tần suất của xác suất (Bài 2.4) giờ đã thành định lý. Độ lệch chuẩn σ/√n giải thích quy luật sai số Monte Carlo 1/√N.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<pre><code class="language-python">import random
random.seed(42)

heads = 0
for n in range(1, 100_001):
    heads += random.random() &lt; 0.5
    if n in (10, 100, 1_000, 10_000, 100_000):
        print(n, heads / n, round(abs(heads / n - 0.5), 4))
</code></pre>
<div class="out">10 0.6 0.1
100 0.5 0.0
1000 0.48 0.02
10000 0.499 0.001
100000 0.49934 0.0007</div>
<p>Tỉ lệ mặt ngửa dao động lúc đầu (0,6 sau 10 lần, 0,48 sau 1 000 lần) rồi bám sát 0,5. <em>Số</em> mặt ngửa trừ n/2 không co lại — chỉ <em>tỉ lệ</em> mới hội tụ.</p>
<div class="callout"><p><b>Cỡ mẫu theo Chebyshev.</b> Cần khảo sát bao nhiêu người dùng để tỉ lệ quan sát p̂ cách tỉ lệ thật p không quá 0,05 với xác suất ít nhất 95%? Var(p̂) = p(1 − p)/n ≤ 1/(4n). Chebyshev: P(|p̂ − p| ≥ 0,05) ≤ 1/(4n · 0,0025) ≤ 0,05 ⇒ n ≥ <b>2 000</b>. (Định lý giới hạn trung tâm sẽ cho thấy khoảng 385 người là đủ — Chebyshev thận trọng.)</p></div>
<div class="callout"><p><b>Ngộ nhận của con bạc.</b> Sau 10 lần ra đỏ liên tiếp ở roulette, màu đen <em>không</em> “sắp đến lượt”. Luật số lớn không hoạt động bằng bù trừ mà bằng <em>pha loãng</em>: 10 lần đỏ trở nên không đáng kể giữa hàng triệu lần quay sau đó.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Tin rằng kết quả tương lai sẽ “bù” cho quá khứ (ngộ nhận của con bạc).</li><li>Áp Luật số lớn cho dữ liệu phụ thuộc hoặc phân phối không có kỳ vọng hữu hạn.</li><li>Nghĩ SD(X̄) = σ/n — thực ra là σ/√n: gấp bốn dữ liệu chỉ giảm một nửa sai số.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>E[X̄<sub>n</sub>] = μ, SD(X̄<sub>n</sub>) = σ/√n.</li><li>Luật số lớn yếu: X̄<sub>n</sub> → μ theo xác suất (chứng minh bằng Chebyshev).</li><li>Tần suất hội tụ về xác suất; Monte Carlo hoạt động được.</li><li>Hội tụ nhờ pha loãng, không nhờ bù trừ.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/08%3A_Law_of_Large_Numbers" target="_blank" rel="noopener">Grinstead &amp; Snell — Chương 8: Luật số lớn</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class06-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 6b: Luật số lớn</a></li><li><a href="https://seeing-theory.brown.edu/basic-probability/index.html" target="_blank" rel="noopener">Seeing Theory — Xác suất cơ bản: xem tần suất tích luỹ hội tụ</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>X<sub>i</sub> là các lần gieo xúc xắc (σ<sup>2</sup> = 35/12). Tìm SD(X̄<sub>100</sub>).</li><li>Dùng Chebyshev chặn P(|X̄<sub>100</sub> − 3,5| ≥ 0,5) với các lần gieo xúc xắc.</li><li>n phải tăng bao nhiêu lần để SD(X̄<sub>n</sub>) giảm 10 lần?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) √(35/12)/10 ≈ 0,171. 2) (35/12)/(100 × 0,25) ≈ 0,117. 3) Tăng 100 lần.</p></div>`);

const c103 = L('ipy111-ts-10-3',
  '10.3 — The Central Limit Theorem (with Python)|||10.3 — Định lý giới hạn trung tâm (có Python)',
  'Phát biểu CLT: tổng/trung bình của nhiều biến i.i.d. xấp xỉ chuẩn; chuẩn hoá (X̄ − μ)/(σ/√n); tổng 100 xúc xắc; trung bình 36 thời gian chờ mũ, so sánh mô phỏng – CLT – giá trị đúng (Gamma) bằng code chạy thật.',
  `<span class="eyebrow">IPY111 · Chapter 10 · Lesson 10.3</span>
<h2>The Central Limit Theorem</h2>
<p class="lead">The LLN says the average converges to μ. The Central Limit Theorem (CLT) says <em>how</em> it fluctuates around μ: approximately normally, whatever the shape of the original distribution. This is why the bell curve is everywhere — and why A/B tests, confidence intervals and quality control work.</p>
<h3>🎯 Objectives</h3>
<ul><li>State the CLT for sums and for sample means.</li><li>Approximate probabilities for sums and averages with the normal distribution.</li><li>Check the quality of the approximation by simulation.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Central Limit Theorem</span>X<sub>1</sub>, …, X<sub>n</sub> i.i.d. with mean μ and finite variance σ<sup>2</sup>. For large n:<br>S<sub>n</sub> = X<sub>1</sub> + … + X<sub>n</sub> ≈ N(nμ, nσ<sup>2</sup>),   X̄<sub>n</sub> ≈ N(μ, σ<sup>2</sup>/n)<br>i.e.  P((X̄<sub>n</sub> − μ)/(σ/√n) ≤ z) → Φ(z)</div>
<p>The mean and variance of S<sub>n</sub> we already knew (linearity and independence); the CLT adds the <strong>shape</strong>. How large must n be? For symmetric distributions n ≈ 10–30 is often fine; for skewed ones (exponential, rare events) more is needed. Rule of thumb in textbooks: n ≥ 30.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — 100 dice.</b> S = sum of 100 dice: mean 100 × 3.5 = 350, variance 100 × 35/12 ≈ 291.7, SD ≈ 17.08. About 95% of the time S lies within 350 ± 1.96 × 17.08, i.e. between <b>317 and 383</b>. P(S ≥ 370) ≈ 1 − Φ(20/17.08) = 1 − Φ(1.17) ≈ 0.121 (Lesson 10.4 refines this to 0.127 with a continuity correction).</p></div>
<div class="callout"><p><b>Example 2 — average waiting time.</b> Waiting times are exponential with mean 2 minutes (so σ = 2, a very skewed distribution). We observe n = 36 customers. CLT: X̄ ≈ N(2, (2/6)<sup>2</sup>), so P(X̄ &gt; 2.5) ≈ 1 − Φ(1.5) ≈ <b>0.067</b>. Let us check against simulation and the exact answer (a sum of exponentials has a Gamma distribution):</p></div>
<pre><code class="language-python">import numpy as np
from scipy.stats import norm, gamma
rng = np.random.default_rng(110)

n, mean = 36, 2.0                        # exponential waiting times, mean 2 minutes
samples = rng.exponential(mean, size=(200_000, n)).mean(axis=1)
print("simulated P(mean &gt; 2.5):", round((samples &gt; 2.5).mean(), 4))
print("CLT approximation      :", round(norm.sf(2.5, mean, mean / np.sqrt(n)), 4))
print("exact (Gamma)          :", round(gamma.sf(2.5, n, scale=mean / n), 4))
</code></pre>
<div class="out">simulated P(mean &gt; 2.5): 0.0738
CLT approximation      : 0.0668
exact (Gamma)          : 0.0742</div>
<p>Reading the output: simulation (0.0738) agrees with the exact value (0.0742); the CLT gives 0.0668 — close, slightly low, because the exponential is skewed and n = 36 is moderate. For decisions this is usually good enough; when it matters, compute exactly or simulate.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Saying “the data become normal” — the CLT is about the distribution of the <em>sum or average</em>, not of individual observations.</li><li>Using σ instead of σ/√n for the SD of an average.</li><li>Applying the CLT to tiny samples from very skewed distributions, or to heavy-tailed data with infinite variance.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Sum ≈ N(nμ, nσ<sup>2</sup>); average ≈ N(μ, σ<sup>2</sup>/n).</li><li>Works for (almost) any distribution with finite variance.</li><li>Standardise: Z = (X̄ − μ)/(σ/√n).</li><li>Check the approximation by simulation when n is small or the data skewed.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/clt" target="_blank" rel="noopener">3Blue1Brown — But what is the Central Limit Theorem?</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/7-1-the-central-limit-theorem-for-sample-means-averages" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 7.1 The CLT for Sample Means</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/7-2-the-central-limit-theorem-for-sums" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 7.2 The CLT for Sums</a></li><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/09%3A_Central_Limit_Theorem" target="_blank" rel="noopener">Grinstead &amp; Snell — Chapter 9: Central Limit Theorem</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A server handles requests whose sizes have mean 50 KB and SD 20 KB, independently. Approximate P(total of 400 requests exceeds 20 400 KB).</li><li>Exam scores have mean 70 and SD 10 (not necessarily normal). For a class of 25, approximate P(class average &gt; 74).</li><li>Why can we apply the CLT in question 2 even if individual scores are not normal?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Mean 20 000, SD 20√400 = 400 ⇒ P(Z &gt; 1) ≈ 0.159. 2) SD of average 10/5 = 2 ⇒ P(Z &gt; 2) ≈ 0.023. 3) The CLT concerns the average of 25 independent scores, whose distribution is close to normal regardless of the shape of a single score.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 10 · Bài 10.3</span>
<h2>Định lý giới hạn trung tâm</h2>
<p class="lead">Luật số lớn nói trung bình hội tụ về μ. Định lý giới hạn trung tâm (CLT) nói nó dao động quanh μ <em>như thế nào</em>: xấp xỉ chuẩn, bất kể phân phối gốc có hình dạng gì. Đó là lý do đường cong hình chuông ở khắp nơi — và vì sao kiểm thử A/B, khoảng tin cậy, kiểm soát chất lượng hoạt động được.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phát biểu CLT cho tổng và cho trung bình mẫu.</li><li>Xấp xỉ xác suất của tổng và trung bình bằng phân phối chuẩn.</li><li>Kiểm chất lượng xấp xỉ bằng mô phỏng.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Định lý giới hạn trung tâm</span>X<sub>1</sub>, …, X<sub>n</sub> i.i.d. có kỳ vọng μ và phương sai hữu hạn σ<sup>2</sup>. Với n lớn:<br>S<sub>n</sub> = X<sub>1</sub> + … + X<sub>n</sub> ≈ N(nμ, nσ<sup>2</sup>),   X̄<sub>n</sub> ≈ N(μ, σ<sup>2</sup>/n)<br>tức là  P((X̄<sub>n</sub> − μ)/(σ/√n) ≤ z) → Φ(z)</div>
<p>Kỳ vọng và phương sai của S<sub>n</sub> ta đã biết (tuyến tính và độc lập); CLT bổ sung <strong>hình dạng</strong>. n phải lớn cỡ nào? Với phân phối đối xứng, n ≈ 10–30 thường đã ổn; với phân phối lệch (mũ, biến cố hiếm) cần nhiều hơn. Quy tắc kinh nghiệm trong sách: n ≥ 30.</p>
<h3>✍️ Ví dụ giải từng bước</h3>
<div class="callout"><p><b>Ví dụ 1 — 100 xúc xắc.</b> S = tổng 100 xúc xắc: kỳ vọng 100 × 3,5 = 350, phương sai 100 × 35/12 ≈ 291,7, SD ≈ 17,08. Khoảng 95% số lần S nằm trong 350 ± 1,96 × 17,08, tức từ <b>317 đến 383</b>. P(S ≥ 370) ≈ 1 − Φ(20/17,08) = 1 − Φ(1,17) ≈ 0,121 (Bài 10.4 tinh chỉnh thành 0,127 nhờ hiệu chỉnh liên tục).</p></div>
<div class="callout"><p><b>Ví dụ 2 — thời gian chờ trung bình.</b> Thời gian chờ có phân phối mũ với kỳ vọng 2 phút (nên σ = 2, phân phối rất lệch). Quan sát n = 36 khách. CLT: X̄ ≈ N(2, (2/6)<sup>2</sup>), nên P(X̄ &gt; 2,5) ≈ 1 − Φ(1,5) ≈ <b>0,067</b>. Hãy kiểm với mô phỏng và đáp án chính xác (tổng các biến mũ có phân phối Gamma):</p></div>
<pre><code class="language-python">import numpy as np
from scipy.stats import norm, gamma
rng = np.random.default_rng(110)

n, mean = 36, 2.0                        # exponential waiting times, mean 2 minutes
samples = rng.exponential(mean, size=(200_000, n)).mean(axis=1)
print("simulated P(mean &gt; 2.5):", round((samples &gt; 2.5).mean(), 4))
print("CLT approximation      :", round(norm.sf(2.5, mean, mean / np.sqrt(n)), 4))
print("exact (Gamma)          :", round(gamma.sf(2.5, n, scale=mean / n), 4))
</code></pre>
<div class="out">simulated P(mean &gt; 2.5): 0.0738
CLT approximation      : 0.0668
exact (Gamma)          : 0.0742</div>
<p>Đọc kết quả: mô phỏng (0,0738) khớp giá trị đúng (0,0742); CLT cho 0,0668 — gần, hơi thấp, vì phân phối mũ lệch và n = 36 chỉ vừa phải. Để ra quyết định thì thường là đủ tốt; khi cần chính xác, hãy tính đúng hoặc mô phỏng.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nói “dữ liệu trở thành chuẩn” — CLT nói về phân phối của <em>tổng hoặc trung bình</em>, không phải từng quan sát.</li><li>Dùng σ thay vì σ/√n làm độ lệch chuẩn của trung bình.</li><li>Áp CLT cho mẫu rất nhỏ từ phân phối rất lệch, hoặc cho dữ liệu đuôi nặng có phương sai vô hạn.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tổng ≈ N(nμ, nσ<sup>2</sup>); trung bình ≈ N(μ, σ<sup>2</sup>/n).</li><li>Đúng với (hầu như) mọi phân phối có phương sai hữu hạn.</li><li>Chuẩn hoá: Z = (X̄ − μ)/(σ/√n).</li><li>Kiểm xấp xỉ bằng mô phỏng khi n nhỏ hoặc dữ liệu lệch.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.3blue1brown.com/lessons/clt" target="_blank" rel="noopener">3Blue1Brown — Định lý giới hạn trung tâm thật ra là gì?</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/7-1-the-central-limit-theorem-for-sample-means-averages" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 7.1 CLT cho trung bình mẫu</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/7-2-the-central-limit-theorem-for-sums" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 7.2 CLT cho tổng</a></li><li><a href="https://stats.libretexts.org/Bookshelves/Probability_Theory/Introductory_Probability_(Grinstead_and_Snell)/09%3A_Central_Limit_Theorem" target="_blank" rel="noopener">Grinstead &amp; Snell — Chương 9: Định lý giới hạn trung tâm</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Server xử lý các request có kích thước kỳ vọng 50 KB, độ lệch chuẩn 20 KB, độc lập. Xấp xỉ P(tổng 400 request vượt 20 400 KB).</li><li>Điểm thi có kỳ vọng 70, độ lệch chuẩn 10 (không nhất thiết chuẩn). Lớp 25 người, xấp xỉ P(điểm trung bình lớp &gt; 74).</li><li>Vì sao áp được CLT ở câu 2 dù điểm từng người không chuẩn?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Kỳ vọng 20 000, SD 20√400 = 400 ⇒ P(Z &gt; 1) ≈ 0,159. 2) SD của trung bình 10/5 = 2 ⇒ P(Z &gt; 2) ≈ 0,023. 3) CLT nói về trung bình của 25 điểm độc lập, có phân phối gần chuẩn bất kể hình dạng phân phối điểm từng người.</p></div>`);

const c104 = L('ipy111-ts-10-4',
  '10.4 — Normal approximation to the binomial, A/B tests and course review|||10.4 — Xấp xỉ chuẩn cho nhị thức, kiểm thử A/B và ôn tập toàn môn',
  'Bin(n,p) ≈ N(np, np(1−p)) khi np, n(1−p) ≥ 10; hiệu chỉnh liên tục ±0,5 so với giá trị đúng (code chạy thật); ví dụ A/B: 50/400 lượt đăng ký có phải cải thiện thật?; bản đồ toàn môn.',
  `<span class="eyebrow">IPY111 · Chapter 10 · Lesson 10.4</span>
<h2>Normal approximation to the binomial, A/B tests and course review</h2>
<p class="lead">A binomial count is a sum of independent Bernoulli indicators, so the CLT applies. This lets us answer “is this result just luck?” for coin flips, conversion rates and A/B tests — and it ties the whole course together.</p>
<h3>🎯 Objectives</h3>
<ul><li>Approximate binomial probabilities with the normal distribution.</li><li>Apply the continuity correction.</li><li>Judge an A/B-test result with a probability calculation.</li></ul>
<h3>📖 Lecture</h3>
<div class="formula"><span class="lbl">Normal approximation to the binomial</span>X ∼ Bin(n, p) ≈ N(np, np(1 − p))  when np ≥ 10 and n(1 − p) ≥ 10<br>Continuity correction (X integer): P(X ≥ k) ≈ P(Y ≥ k − 0.5),  P(X ≤ k) ≈ P(Y ≤ k + 0.5),  Y normal</div>
<p>The correction accounts for approximating bars of width 1 centred on integers by a smooth curve: the bar for k covers [k − 0.5, k + 0.5].</p>
<pre><code class="language-python">from scipy.stats import binom, norm

n, p = 100, 0.5
mu, sd = n * p, (n * p * (1 - p)) ** 0.5
print("exact  P(X&gt;=60):", round(binom.sf(59, n, p), 5))
print("normal, no cc  :", round(norm.sf(60, mu, sd), 5))
print("normal, cc 59.5:", round(norm.sf(59.5, mu, sd), 5))
</code></pre>
<div class="out">exact  P(X&gt;=60): 0.02844
normal, no cc  : 0.02275
normal, cc 59.5: 0.02872</div>
<p>With the correction the error drops from 0.0057 to 0.0003. Similarly P(45 ≤ X ≤ 55) is 0.7287 exactly and Φ(1.1) − Φ(−1.1) ≈ 0.7287 with the correction.</p>
<h3>✍️ Worked example — an A/B test</h3>
<div class="callout"><p>Historically 10% of visitors sign up. A new landing page is shown to 400 visitors and 50 sign up (12.5%). Is that convincing evidence of improvement, or could the old rate produce it by chance?</p>
<p>Step 1 (model under “no change”): X ∼ Bin(400, 0.10): mean 40, SD √(400 × 0.1 × 0.9) = 6.</p>
<p>Step 2 (normal approximation, cc): P(X ≥ 50) ≈ P(Z ≥ (49.5 − 40)/6) = P(Z ≥ 1.58) ≈ <b>0.057</b>. The exact binomial value is 0.060.</p>
<p>Step 3 (interpret): even with no real improvement, about 6% of experiments would show 50 or more sign-ups. Many teams require this probability (the p-value) to be below 0.05 before declaring a win, so this result is suggestive but not conclusive: collect more data. Statistics courses formalise this as hypothesis testing.</p></div>
<h3>🗺️ Course map</h3>
<ul>
<li><strong>Counting (Ch. 1)</strong> → probabilities for equally likely outcomes.</li>
<li><strong>Axioms (Ch. 2)</strong> → complement, addition rule, inclusion–exclusion; Monte Carlo checks.</li>
<li><strong>Conditioning (Ch. 3–4)</strong> → total probability, Bayes, independence, reliability.</li>
<li><strong>Random variables (Ch. 5–7)</strong> → binomial, geometric, Poisson; uniform, exponential, normal.</li>
<li><strong>Expectation &amp; variance (Ch. 6, 9)</strong> → linearity, indicators, covariance, correlation.</li>
<li><strong>Several variables (Ch. 8)</strong> → joint, marginal, conditional, sums.</li>
<li><strong>Limit theorems (Ch. 10)</strong> → averages converge (LLN) and are approximately normal (CLT).</li>
</ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using the normal approximation when np or n(1 − p) is small (use the exact binomial or Poisson).</li><li>Applying the correction in the wrong direction (P(X ≥ 60) uses 59.5, not 60.5).</li><li>Treating p = 0.057 as “6% chance the new page is no better” — it is the chance of such data <em>if</em> it were no better.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Bin(n, p) ≈ N(np, np(1 − p)) when np, n(1 − p) ≥ 10.</li><li>Continuity correction: ±0.5.</li><li>“Could this be luck?” = compute the probability of data at least this extreme under the old model.</li><li>LLN + CLT turn probability into practical statistics.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/7-3-using-the-central-limit-theorem" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 7.3 Using the Central Limit Theorem</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class06-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Reading 6b: CLT and normal approximation</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_probability_pdf/" target="_blank" rel="noopener">MIT 18.05 — All probability readings in one PDF (for review)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A fair coin is tossed 100 times. Use the normal approximation with continuity correction to estimate P(at most 40 heads).</li><li>A multiple-choice exam has 100 questions with 4 options. Approximate P(a pure guesser scores at least 35).</li><li>In the A/B example, how many sign-ups out of 400 would make P(X ≥ k) under the old rate below 0.01? (z<sub>0.99</sub> ≈ 2.326)</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) P(Z ≤ (40.5 − 50)/5) = Φ(−1.9) ≈ 0.0287. 2) Mean 25, SD √18.75 ≈ 4.33 ⇒ P(Z ≥ (34.5 − 25)/4.33) = P(Z ≥ 2.19) ≈ 0.014. 3) Need (k − 0.5 − 40)/6 ≥ 2.326 ⇒ k ≥ 54.5 ⇒ k = 55.</p></div>`,
  `<span class="eyebrow">IPY111 · Chương 10 · Bài 10.4</span>
<h2>Xấp xỉ chuẩn cho nhị thức, kiểm thử A/B và ôn tập toàn môn</h2>
<p class="lead">Số đếm nhị thức là tổng các biến chỉ báo Bernoulli độc lập, nên CLT áp dụng được. Nhờ đó ta trả lời được câu “kết quả này có phải chỉ do may mắn?” cho tung đồng xu, tỉ lệ chuyển đổi, kiểm thử A/B — và nó nối toàn bộ môn học lại với nhau.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Xấp xỉ xác suất nhị thức bằng phân phối chuẩn.</li><li>Áp dụng hiệu chỉnh liên tục.</li><li>Đánh giá kết quả kiểm thử A/B bằng một phép tính xác suất.</li></ul>
<h3>📖 Bài giảng</h3>
<div class="formula"><span class="lbl">Xấp xỉ chuẩn cho nhị thức</span>X ∼ Bin(n, p) ≈ N(np, np(1 − p))  khi np ≥ 10 và n(1 − p) ≥ 10<br>Hiệu chỉnh liên tục (X nguyên): P(X ≥ k) ≈ P(Y ≥ k − 0,5),  P(X ≤ k) ≈ P(Y ≤ k + 0,5),  Y chuẩn</div>
<p>Hiệu chỉnh bù cho việc xấp xỉ các cột rộng 1 đặt tại số nguyên bằng một đường cong trơn: cột của k phủ đoạn [k − 0,5; k + 0,5].</p>
<pre><code class="language-python">from scipy.stats import binom, norm

n, p = 100, 0.5
mu, sd = n * p, (n * p * (1 - p)) ** 0.5
print("exact  P(X&gt;=60):", round(binom.sf(59, n, p), 5))
print("normal, no cc  :", round(norm.sf(60, mu, sd), 5))
print("normal, cc 59.5:", round(norm.sf(59.5, mu, sd), 5))
</code></pre>
<div class="out">exact  P(X&gt;=60): 0.02844
normal, no cc  : 0.02275
normal, cc 59.5: 0.02872</div>
<p>Có hiệu chỉnh, sai số giảm từ 0,0057 xuống 0,0003. Tương tự P(45 ≤ X ≤ 55) đúng là 0,7287 và Φ(1,1) − Φ(−1,1) ≈ 0,7287 khi có hiệu chỉnh.</p>
<h3>✍️ Ví dụ — một kiểm thử A/B</h3>
<div class="callout"><p>Trước nay 10% khách truy cập đăng ký. Trang đích mới được hiển thị cho 400 khách và 50 người đăng ký (12,5%). Đó có phải bằng chứng thuyết phục về cải thiện, hay tỉ lệ cũ cũng có thể tình cờ tạo ra kết quả này?</p>
<p>Bước 1 (mô hình khi “không đổi”): X ∼ Bin(400; 0,10): kỳ vọng 40, SD √(400 × 0,1 × 0,9) = 6.</p>
<p>Bước 2 (xấp xỉ chuẩn, có hiệu chỉnh): P(X ≥ 50) ≈ P(Z ≥ (49,5 − 40)/6) = P(Z ≥ 1,58) ≈ <b>0,057</b>. Giá trị nhị thức chính xác là 0,060.</p>
<p>Bước 3 (diễn giải): kể cả khi không cải thiện gì, khoảng 6% thí nghiệm vẫn cho 50 lượt đăng ký trở lên. Nhiều nhóm đòi xác suất này (p-value) dưới 0,05 mới tuyên bố thắng, nên kết quả này mới gợi ý chứ chưa kết luận được: cần thêm dữ liệu. Các môn thống kê sẽ hình thức hoá điều này thành kiểm định giả thuyết.</p></div>
<h3>🗺️ Bản đồ môn học</h3>
<ul>
<li><strong>Phép đếm (Ch. 1)</strong> → xác suất cho kết quả đồng khả năng.</li>
<li><strong>Tiên đề (Ch. 2)</strong> → phần bù, công thức cộng, bao hàm – loại trừ; kiểm bằng Monte Carlo.</li>
<li><strong>Lấy điều kiện (Ch. 3–4)</strong> → xác suất toàn phần, Bayes, độc lập, độ tin cậy.</li>
<li><strong>Biến ngẫu nhiên (Ch. 5–7)</strong> → nhị thức, hình học, Poisson; đều, mũ, chuẩn.</li>
<li><strong>Kỳ vọng &amp; phương sai (Ch. 6, 9)</strong> → tuyến tính, biến chỉ báo, hiệp phương sai, tương quan.</li>
<li><strong>Nhiều biến (Ch. 8)</strong> → đồng thời, biên, có điều kiện, tổng.</li>
<li><strong>Định lý giới hạn (Ch. 10)</strong> → trung bình hội tụ (LLN) và xấp xỉ chuẩn (CLT).</li>
</ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng xấp xỉ chuẩn khi np hoặc n(1 − p) nhỏ (hãy dùng nhị thức chính xác hoặc Poisson).</li><li>Hiệu chỉnh sai chiều (P(X ≥ 60) dùng 59,5, không phải 60,5).</li><li>Hiểu p = 0,057 là “6% khả năng trang mới không tốt hơn” — thực ra đó là khả năng có dữ liệu như vậy <em>nếu</em> nó không tốt hơn.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Bin(n, p) ≈ N(np, np(1 − p)) khi np, n(1 − p) ≥ 10.</li><li>Hiệu chỉnh liên tục: ±0,5.</li><li>“Có phải may mắn?” = tính xác suất có dữ liệu cực đoan ít nhất như vậy theo mô hình cũ.</li><li>LLN + CLT biến xác suất thành thống kê ứng dụng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/7-3-using-the-central-limit-theorem" target="_blank" rel="noopener">OpenStax Introductory Statistics 2e — 7.3 Sử dụng định lý giới hạn trung tâm</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class06-prep-b_pdf/" target="_blank" rel="noopener">MIT 18.05 — Bài đọc 6b: CLT và xấp xỉ chuẩn</a></li><li><a href="https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_probability_pdf/" target="_blank" rel="noopener">MIT 18.05 — Toàn bộ bài đọc phần xác suất trong một PDF (để ôn tập)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Tung đồng xu cân đối 100 lần. Dùng xấp xỉ chuẩn có hiệu chỉnh liên tục ước lượng P(nhiều nhất 40 mặt ngửa).</li><li>Đề trắc nghiệm 100 câu, mỗi câu 4 lựa chọn. Xấp xỉ P(người đoán mò được ít nhất 35 câu).</li><li>Ở ví dụ A/B, cần bao nhiêu lượt đăng ký trên 400 để P(X ≥ k) theo tỉ lệ cũ nhỏ hơn 0,01? (z<sub>0,99</sub> ≈ 2,326)</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) P(Z ≤ (40,5 − 50)/5) = Φ(−1,9) ≈ 0,0287. 2) Kỳ vọng 25, SD √18,75 ≈ 4,33 ⇒ P(Z ≥ (34,5 − 25)/4,33) = P(Z ≥ 2,19) ≈ 0,014. 3) Cần (k − 0,5 − 40)/6 ≥ 2,326 ⇒ k ≥ 54,5 ⇒ k = 55.</p></div>`);

const q10 = QZ(10, 'Quiz — Chapter 10: Inequalities and limit theorems|||Quiz — Chương 10: Bất đẳng thức và định lý giới hạn', 'Kiểm tra chương 10: Markov, Chebyshev, Luật số lớn, phương sai trung bình mẫu, CLT, xấp xỉ chuẩn cho nhị thức, hiệu chỉnh liên tục.', [
  Q('q1', "X ≥ 0 with E[X] = 200. Markov gives P(X ≥ 1000) ≤|||X ≥ 0 với E[X] = 200. Markov cho P(X ≥ 1000) ≤",
    ['0.02|||0,02', '0.2|||0,2', '0.5|||0,5', '5|||5'], 1,
    "200/1000.|||200/1000."),
  Q('q2', "Chebyshev: at least what fraction of any distribution lies within 2 SDs of the mean?|||Chebyshev: ít nhất bao nhiêu phần của mọi phân phối nằm trong 2 độ lệch chuẩn?",
    ['50%|||50%', '75%|||75%', '95%|||95%', '99.7%|||99,7%'], 1,
    "1 − 1/2² = 3/4.|||1 − 1/2² = 3/4."),
  Q('q3', "For i.i.d. X_i with variance σ², Var(X̄_n) =|||Với X_i i.i.d. có phương sai σ², Var(X̄_n) =",
    ['σ²|||σ²', 'σ²/n|||σ²/n', 'σ/√n|||σ/√n', 'nσ²|||nσ²'], 1,
    "Var of a sum is nσ², divided by n².|||Phương sai của tổng là nσ², chia cho n²."),
  Q('q4', "The weak Law of Large Numbers is proved most simply with|||Luật số lớn dạng yếu được chứng minh đơn giản nhất bằng",
    ['Bayes rule|||quy tắc Bayes', "Chebyshev's inequality|||bất đẳng thức Chebyshev", 'inclusion–exclusion|||bao hàm – loại trừ', 'the binomial theorem|||nhị thức Newton'], 1,
    "P(|X̄ − μ| ≥ ε) ≤ σ²/(nε²).|||P(|X̄ − μ| ≥ ε) ≤ σ²/(nε²)."),
  Q('q5', "After 10 reds in a row at roulette, the LLN implies that black|||Sau 10 lần đỏ liên tiếp ở roulette, Luật số lớn suy ra màu đen",
    ['is now more likely|||giờ có khả năng hơn', 'has the same probability as always|||vẫn có xác suất như mọi khi', 'is impossible|||không thể xảy ra', 'must appear within 10 spins|||phải xuất hiện trong 10 lần quay'], 1,
    "Independent spins; the LLN works by dilution.|||Các lần quay độc lập; Luật số lớn hoạt động bằng pha loãng."),
  Q('q6', "The sum of 100 fair dice has mean and SD about|||Tổng 100 xúc xắc cân đối có kỳ vọng và độ lệch chuẩn khoảng",
    ['350 and 17.1|||350 và 17,1', '350 and 291.7|||350 và 291,7', '3.5 and 1.7|||3,5 và 1,7', '350 and 1.7|||350 và 1,7'], 0,
    "Variance 100 × 35/12 ≈ 291.7, SD ≈ 17.08.|||Phương sai 100 × 35/12 ≈ 291,7, SD ≈ 17,08."),
  Q('q7', "The CLT says that for large n the distribution of X̄_n is approximately|||CLT nói rằng với n lớn, phân phối của X̄_n xấp xỉ",
    ['the same as one X_i|||giống một X_i', 'N(μ, σ²/n)|||N(μ, σ²/n)', 'N(μ, σ²)|||N(μ, σ²)', 'Poisson(μ)|||Poisson(μ)'], 1,
    "Regardless of the shape of X_i (finite variance).|||Bất kể hình dạng của X_i (phương sai hữu hạn)."),
  Q('q8', "Exponential waits with mean 2, n = 36. CLT estimate of P(X̄ > 2.5) ≈|||Thời gian chờ mũ kỳ vọng 2, n = 36. Ước lượng CLT của P(X̄ > 2,5) ≈",
    ['0.067|||0,067', '0.25|||0,25', '0.0013|||0,0013', '0.5|||0,5'], 0,
    "SD of mean = 2/6, z = 1.5.|||SD của trung bình = 2/6, z = 1,5."),
  Q('q9', "Normal approximation to Bin(100, 0.5) for P(X ≥ 60) with continuity correction uses|||Xấp xỉ chuẩn cho Bin(100; 0,5) để tính P(X ≥ 60) có hiệu chỉnh liên tục dùng",
    ['P(Y ≥ 60.5)|||P(Y ≥ 60,5)', 'P(Y ≥ 59.5)|||P(Y ≥ 59,5)', 'P(Y ≥ 60)|||P(Y ≥ 60)', 'P(Y ≤ 59.5)|||P(Y ≤ 59,5)'], 1,
    "The bar for 60 starts at 59.5; result 0.0287 vs exact 0.0284.|||Cột của 60 bắt đầu từ 59,5; kết quả 0,0287 so với đúng 0,0284."),
  Q('q10', "A/B test: old rate 10%, 400 visitors, 50 sign-ups. P(X ≥ 50 | old rate) ≈ 0.06 means|||Kiểm thử A/B: tỉ lệ cũ 10%, 400 khách, 50 đăng ký. P(X ≥ 50 | tỉ lệ cũ) ≈ 0,06 nghĩa là",
    ['the new page is 94% likely better|||trang mới 94% khả năng tốt hơn', 'such a result would occur about 6% of the time with no improvement|||kết quả như vậy xảy ra khoảng 6% số lần dù không cải thiện', 'the new page is worse|||trang mới tệ hơn', 'the test is invalid|||thí nghiệm không hợp lệ'], 1,
    "It is the probability of data this extreme under the old model, not of the hypothesis.|||Đó là xác suất có dữ liệu cực đoan như vậy theo mô hình cũ, không phải xác suất của giả thuyết."),
]);

const ch10 = {
  title: 'Chapter 10 — Inequalities and limit theorems (LLN, CLT)|||Chương 10 — Bất đẳng thức và định lý giới hạn (LLN, CLT)',
  description: 'Markov, Chebyshev; Luật số lớn và cỡ mẫu; Định lý giới hạn trung tâm kiểm bằng mô phỏng; xấp xỉ chuẩn cho nhị thức, hiệu chỉnh liên tục, kiểm thử A/B; bản đồ ôn tập toàn môn (Blitzstein & Hwang ch.10 · Ross ch.8 · OpenStax ch.7).',
  lessons: [c101, c102, c103, c104, q10],
};

// ───────────────────────────── Xuất ─────────────────────────────
export default [muc0, ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9, ch10];
