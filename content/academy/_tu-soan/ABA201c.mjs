// Khoá TỰ SOẠN cho ABA201c — trường chưa công bố syllabus trên FLM (dò 09/11/2026). Soạn theo _HOP-DONG-TU-SOAN.md.
// ABA201c — AI and Big Data Analytics for Communications. Khung bám giáo trình chuẩn: Provost & Fawcett "Data Science for
// Business" (O'Reilly 2013), Kohavi/Tang/Xu "Trustworthy Online Controlled Experiments" (CUP 2020), Knaflic "Storytelling
// with Data" (Wiley 2015), James et al. "An Introduction to Statistical Learning with Python" (Springer 2023, bản PDF mở).
// Người học: sinh viên truyền thông/marketing (không phải CNTT). Mọi khối code Python đã CHẠY THẬT (Python 3.14,
// pandas 3.1.1, scikit-learn 1.9.1, scipy 1.18.1) trên dữ liệu giả lập nhỏ; output dán nguyên văn trong <div class="out">.
// Mọi link ngoài đã mở thử (HTTP 200 + tiêu đề đúng chủ đề). File KHÔNG dùng chuỗi nội suy (dấu đô-la + ngoặc nhọn).

const bi = (en, vi) => '<div class="ml-en">' + en + '</div>\n<div class="ml-vi">' + vi + '</div>';
const L = (slug, title, description, en, vi) => ({ title, slug, type: 'DOCUMENT', description, content: bi(en, vi) });
const Q = (id, question, options, correctIndex, explanation) => ({ id, question, options, correctIndex, points: 1, explanation });
const QZ = (ch, title, description, questions) => ({
  title, slug: 'aba201c-ts-quiz-' + ch, type: 'QUIZ', description,
  quiz: { timeLimitSeconds: 900, questions },
});

const l0_1 = L('aba201c-ts-0-1',
  '0.1 — Welcome to ABA201c: what AI & big-data analytics means for communicators|||0.1 — Giới thiệu ABA201c: AI & phân tích dữ liệu lớn dành cho người làm truyền thông',
  'ABA201c học gì, để làm gì trong nghề truyền thông/marketing, 8 chuẩn đầu ra tự soạn, môn liên quan, cách học; cảnh báo: trường chưa công bố syllabus trên FLM.',
  `<span class="eyebrow">ABA201c · Section 0 · Lesson 0.1</span>
<h2>Welcome to AI and Big Data Analytics for Communications</h2>
<p class="lead">Every post, ad, email and website visit leaves a trace. This course teaches communications and marketing students how to turn those traces into decisions: which message works, for whom, and why — and how AI tools can help without fooling you.</p>
<div class="callout"><p>⚠️ <strong>Important.</strong> FPT University has <strong>not published the ABA201c syllabus on FLM</strong> (we searched the code, its variants and the course name on 09/11/2026). This course framework is therefore <strong>self-authored</strong>, following international standard textbooks on business data science, online experiments and data storytelling (see lesson 0.2). <strong>Grading weights, assessment format and exam dates are decided by your lecturer</strong> — always follow the course outline your lecturer gives in class.</p></div>
<h3>What is this course about?</h3>
<p>You are not training to become a data engineer. You are training to become the communicator who <em>asks the right question of the data</em>, reads the answer correctly and explains it to a client or a manager. Concretely, the course moves along a simple path:</p>
<ol>
<li><strong>Data</strong> — where communication data comes from (social platforms, website analytics, CRM, ad platforms) and why "big data" needs different tools.</li>
<li><strong>Describe</strong> — campaign KPIs, funnels and honest summary statistics.</li>
<li><strong>Listen &amp; read</strong> — social listening, sentiment analysis, text analytics and topic modelling.</li>
<li><strong>Group &amp; predict</strong> — audience segmentation with clustering, regression and classification for response or churn.</li>
<li><strong>Test</strong> — A/B testing, the most reliable way to know whether a change caused a result.</li>
<li><strong>Create &amp; personalise</strong> — generative AI for content, recommendation and personalisation.</li>
<li><strong>Communicate &amp; protect</strong> — dashboards, data storytelling, privacy, ethics and bias.</li>
</ol>
<h3>Why does a communications student need it?</h3>
<ul>
<li><strong>Agency and in-house jobs</strong> now expect you to read a Meta Ads or Google Analytics report, defend a budget with ROAS or CPA, and spot a crisis in social mentions before it explodes.</li>
<li><strong>Briefs and pitches</strong> are stronger when an insight is backed by numbers: "students reply 3× more to video than to links" beats "we feel video is better".</li>
<li><strong>AI tools</strong> are everywhere in content production. Knowing how they work — and where they invent facts — protects your brand and your career.</li>
<li><strong>Your capstone project</strong> (đồ án) will almost certainly need a measurement plan, a survey or social data analysis, and a results dashboard.</li>
</ul>
<h3>Learning outcomes (self-authored)</h3>
<p>After this course you should be able to:</p>
<ol>
<li>Describe the communications data ecosystem (owned, paid, earned; first-, second-, third- and zero-party data) and the main properties of big data.</li>
<li>Clean, join and summarise small campaign datasets with pandas, and compute standard KPIs (CTR, CVR, CPC, CPM, CPA, ROAS, engagement rate).</li>
<li>Plan a social-listening query, measure share of voice, detect spikes and explain how lexicon-based and machine-learning sentiment analysis work and fail.</li>
<li>Explain text representation (bag of words, TF-IDF), topic modelling and embeddings at the intuition level, and interpret their output.</li>
<li>Segment an audience with RFM and k-means and turn clusters into usable personas.</li>
<li>Build and evaluate simple regression and classification models (response, churn), using precision, recall and lift instead of accuracy alone.</li>
<li>Design and analyse an A/B test (sample size, z-test, confidence interval) and recognise peeking, sample-ratio mismatch and multiple-testing traps.</li>
<li>Use generative AI responsibly for content, explain recommendation systems, design a dashboard that tells a story, and apply privacy law, ethics and bias checks to data and AI projects.</li>
</ol>
<h3>Related courses</h3>
<p>ABA201c builds on the marketing and communications courses of the same track that you can also study on this Academy — for example <strong>MKT101 (Marketing Principles)</strong>, <strong>IMC201 (Introduction to Integrated Marketing Communication)</strong>, <strong>MKT208c (Social media marketing)</strong> and <strong>IMC301c (IMC in the Digital World)</strong>. Check the official prerequisite rules of your programme with the Academic Office; we do not state them here because the syllabus is not published.</p>
<h3>How to study this course</h3>
<ul>
<li>Every lesson has objectives, a lecture with a real situation, common mistakes, a 📌 summary, 🔗 further learning and 🧪 practice with answers. Each chapter ends with a quiz.</li>
<li>Code is <strong>short Python</strong> on tiny made-up datasets. You do not need to be a programmer: read the code like a recipe, then run it in <strong>Google Colab</strong> (free, nothing to install) and change one number to see what happens.</li>
<li>Always ask "<em>so what?</em>" after every number. A KPI without a decision attached is decoration.</li>
</ul>`,
  `<span class="eyebrow">ABA201c · Mục 0 · Bài 0.1</span>
<h2>Chào mừng đến với AI &amp; Phân tích dữ liệu lớn cho Truyền thông</h2>
<p class="lead">Mỗi bài đăng, quảng cáo, email hay lượt vào website đều để lại dấu vết. Môn này dạy sinh viên truyền thông – marketing biến những dấu vết đó thành quyết định: thông điệp nào hiệu quả, với ai, vì sao — và dùng công cụ AI thế nào để được giúp mà không bị đánh lừa.</p>
<div class="callout"><p>⚠️ <strong>Lưu ý quan trọng.</strong> Trường <strong>chưa công bố syllabus của ABA201c trên FLM</strong> (đã dò mã môn, mã biến thể và tên môn ngày 09/11/2026). Vì vậy khung môn này là <strong>khung tự soạn</strong>, bám các giáo trình chuẩn quốc tế về khoa học dữ liệu trong kinh doanh, thử nghiệm trực tuyến và kể chuyện bằng dữ liệu (xem bài 0.2). <strong>Cách tính điểm, hình thức đánh giá và lịch thi theo giảng viên</strong> — luôn theo đề cương giảng viên phát trên lớp.</p></div>
<h3>Môn này học gì?</h3>
<p>Bạn không học để trở thành kỹ sư dữ liệu. Bạn học để trở thành người làm truyền thông biết <em>đặt đúng câu hỏi cho dữ liệu</em>, đọc đúng câu trả lời và giải thích nó cho khách hàng hay sếp. Cụ thể, môn học đi theo một lộ trình đơn giản:</p>
<ol>
<li><strong>Dữ liệu</strong> — dữ liệu truyền thông đến từ đâu (mạng xã hội, phân tích website, CRM, nền tảng quảng cáo) và vì sao "dữ liệu lớn" cần công cụ khác.</li>
<li><strong>Mô tả</strong> — KPI chiến dịch, phễu và thống kê mô tả trung thực.</li>
<li><strong>Lắng nghe &amp; đọc</strong> — social listening, phân tích cảm xúc, phân tích văn bản và mô hình chủ đề.</li>
<li><strong>Phân nhóm &amp; dự đoán</strong> — phân khúc khán giả bằng phân cụm, hồi quy và phân loại để dự đoán phản hồi hoặc rời bỏ.</li>
<li><strong>Kiểm chứng</strong> — A/B testing, cách đáng tin nhất để biết một thay đổi có thật sự gây ra kết quả hay không.</li>
<li><strong>Sáng tạo &amp; cá nhân hoá</strong> — AI tạo sinh cho nội dung, hệ gợi ý và cá nhân hoá.</li>
<li><strong>Truyền đạt &amp; bảo vệ</strong> — dashboard, kể chuyện bằng dữ liệu, quyền riêng tư, đạo đức và thiên lệch.</li>
</ol>
<h3>Sinh viên truyền thông cần nó để làm gì?</h3>
<ul>
<li><strong>Công việc ở agency và in-house</strong> giờ đòi hỏi bạn đọc được báo cáo Meta Ads hay Google Analytics, bảo vệ ngân sách bằng ROAS hoặc CPA, và phát hiện khủng hoảng trong lượt nhắc trên mạng xã hội trước khi nó bùng nổ.</li>
<li><strong>Brief và pitch</strong> mạnh hơn khi insight có số liệu đỡ lưng: "sinh viên phản hồi video gấp 3 lần link" thuyết phục hơn "tụi mình cảm thấy video tốt hơn".</li>
<li><strong>Công cụ AI</strong> có mặt khắp nơi trong sản xuất nội dung. Hiểu chúng hoạt động thế nào — và chỗ nào chúng bịa — là bảo vệ thương hiệu và sự nghiệp của bạn.</li>
<li><strong>Đồ án tốt nghiệp</strong> gần như chắc chắn cần kế hoạch đo lường, khảo sát hoặc phân tích dữ liệu mạng xã hội, và một dashboard kết quả.</li>
</ul>
<h3>Chuẩn đầu ra (tự soạn)</h3>
<p>Học xong môn, bạn cần làm được:</p>
<ol>
<li>Mô tả hệ sinh thái dữ liệu truyền thông (owned, paid, earned; dữ liệu bên thứ nhất, thứ hai, thứ ba và zero-party) và các đặc trưng chính của dữ liệu lớn.</li>
<li>Làm sạch, ghép và tóm tắt các bộ dữ liệu chiến dịch nhỏ bằng pandas, tính các KPI chuẩn (CTR, CVR, CPC, CPM, CPA, ROAS, tỷ lệ tương tác).</li>
<li>Lập truy vấn social listening, đo share of voice, phát hiện đột biến và giải thích phân tích cảm xúc dựa trên từ điển và dựa trên học máy hoạt động — và thất bại — ra sao.</li>
<li>Giải thích biểu diễn văn bản (túi từ, TF-IDF), mô hình chủ đề và embedding ở mức trực giác, và đọc được kết quả của chúng.</li>
<li>Phân khúc khán giả bằng RFM và k-means, biến các cụm thành persona dùng được.</li>
<li>Xây và đánh giá mô hình hồi quy, phân loại đơn giản (phản hồi, rời bỏ), dùng precision, recall và lift chứ không chỉ accuracy.</li>
<li>Thiết kế và phân tích A/B test (cỡ mẫu, kiểm định z, khoảng tin cậy) và nhận ra bẫy "nhìn trộm", lệch tỷ lệ mẫu và kiểm định nhiều lần.</li>
<li>Dùng AI tạo sinh có trách nhiệm cho nội dung, giải thích hệ gợi ý, thiết kế dashboard biết kể chuyện, và áp dụng luật bảo vệ dữ liệu, đạo đức, kiểm tra thiên lệch cho dự án dữ liệu và AI.</li>
</ol>
<h3>Môn liên quan</h3>
<p>ABA201c dựa trên các môn marketing – truyền thông cùng khối mà bạn cũng học được trên Academy này — ví dụ <strong>MKT101 (Nguyên lý Marketing)</strong>, <strong>IMC201 (Nhập môn Truyền thông marketing tích hợp)</strong>, <strong>MKT208c (Marketing mạng xã hội)</strong> và <strong>IMC301c (IMC trong thế giới số)</strong>. Điều kiện tiên quyết chính thức hãy kiểm với Phòng Khảo thí/Đào tạo; ở đây không ghi vì syllabus chưa được công bố.</p>
<h3>Cách học môn này</h3>
<ul>
<li>Mỗi bài có mục tiêu, bài giảng kèm tình huống thật, lỗi hay gặp, 📌 tóm tắt, 🔗 học thêm và 🧪 tự luyện có đáp án. Cuối mỗi chương có quiz.</li>
<li>Code là <strong>Python ngắn</strong> trên bộ dữ liệu giả lập rất nhỏ. Bạn không cần là lập trình viên: đọc code như đọc công thức nấu ăn, rồi chạy trên <strong>Google Colab</strong> (miễn phí, không cài gì) và thử đổi một con số xem chuyện gì xảy ra.</li>
<li>Sau mỗi con số, luôn hỏi "<em>vậy thì sao?</em>". Một KPI không gắn với quyết định nào chỉ là đồ trang trí.</li>
</ul>`);

const l0_2 = L('aba201c-ts-0-2',
  '0.2 — Textbooks, open courses and tools|||0.2 — Giáo trình, khoá học mở và công cụ',
  'Bốn giáo trình chuẩn (kèm NXB, năm, ISBN đã kiểm), khoá học mở (Google ML Crash Course, Kaggle, MIT OCW, Coursera), công cụ Colab/pandas/scikit-learn và cách chạy code của môn.',
  `<span class="eyebrow">ABA201c · Section 0 · Lesson 0.2</span>
<h2>Textbooks, open courses and tools</h2>
<p class="lead">Because there is no published syllabus, the course follows the order and vocabulary of widely used international textbooks. You do not need to buy all of them — one main book plus the free resources below is enough.</p>
<h3>📗 Main textbooks</h3>
<ol>
<li><strong>Foster Provost &amp; Tom Fawcett — <em>Data Science for Business: What You Need to Know about Data Mining and Data-Analytic Thinking</em></strong>. O'Reilly Media, 2013, 1st edition. ISBN 978-1-4493-6132-7. <em>Our backbone for "data-analytic thinking": framing a business problem, segmentation, predictive modelling, evaluation and lift.</em> Book site: <a href="https://data-science-for-biz.com/" target="_blank" rel="noopener">data-science-for-biz.com</a>.</li>
<li><strong>Ron Kohavi, Diane Tang &amp; Ya Xu — <em>Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing</em></strong>. Cambridge University Press, 2020, 1st edition (paperback ISBN 978-1-108-72426-5). <em>The reference for Chapter 8 (A/B testing).</em> Book site: <a href="https://experimentguide.com/" target="_blank" rel="noopener">experimentguide.com</a>.</li>
<li><strong>Cole Nussbaumer Knaflic — <em>Storytelling with Data: A Data Visualization Guide for Business Professionals</em></strong>. Wiley, 2015, 1st edition. ISBN 978-1-119-00225-3. <em>The reference for Chapter 11 (dashboards and storytelling).</em> Author's site: <a href="https://www.storytellingwithdata.com/books" target="_blank" rel="noopener">storytellingwithdata.com/books</a>.</li>
<li><strong>Gareth James, Daniela Witten, Trevor Hastie, Robert Tibshirani &amp; Jonathan Taylor — <em>An Introduction to Statistical Learning with Applications in Python</em></strong>. Springer, 2023. <em>Free PDF from the authors at <a href="https://www.statlearning.com/" target="_blank" rel="noopener">statlearning.com</a>. Use its first chapters on regression, classification and clustering if you want more depth than this course.</em></li>
</ol>
<h3>📚 How the chapters map to the books</h3>
<ul><li>Chapters 1–3 (data, big data, descriptive KPIs) and 6–7 (segmentation, prediction, lift): Provost &amp; Fawcett, plus ISLP for the statistics behind regression, classification and clustering.</li><li>Chapters 4–5 (listening, sentiment, text) and 10 (recommendation): the scikit-learn documentation and Google's free courses linked in each lesson.</li><li>Chapter 8 (A/B testing): Kohavi, Tang &amp; Xu.</li><li>Chapter 11 (dashboards, storytelling): Knaflic.</li><li>Chapters 9 and 12 (generative AI, privacy, ethics): official documents — Vietnam's 2025 Personal Data Protection Law, the EU AI Act, NIST and OECD frameworks — linked in the lessons, because this field changes faster than books.</li></ul>
<p>For pandas itself, Wes McKinney's <em>Python for Data Analysis</em> (3rd edition) has an open-access online version at <a href="https://wesmckinney.com/book/" target="_blank" rel="noopener">wesmckinney.com/book</a>.</p>
<h3>🌐 Free courses and documentation</h3>
<ul>
<li><a href="https://developers.google.com/machine-learning/crash-course/linear-regression" target="_blank" rel="noopener">Google Machine Learning Crash Course</a> — short, visual modules on regression, classification, embeddings, LLMs and fairness.</li>
<li><a href="https://www.kaggle.com/learn/pandas" target="_blank" rel="noopener">Kaggle Learn — Pandas</a> and <a href="https://www.kaggle.com/learn/intro-to-machine-learning" target="_blank" rel="noopener">Kaggle Learn — Intro to Machine Learning</a> — hands-on notebooks in the browser.</li>
<li><a href="https://ocw.mit.edu/courses/15-071-the-analytics-edge-spring-2017/" target="_blank" rel="noopener">MIT OpenCourseWare 15.071 — The Analytics Edge</a> — a business-analytics course from MIT Sloan with real cases.</li>
<li><a href="https://www.coursera.org/professional-certificates/google-data-analytics" target="_blank" rel="noopener">Google Data Analytics Professional Certificate (Coursera)</a> — a structured path for analyst skills (audit for free on Coursera where available).</li>
<li><a href="https://skillshop.withgoogle.com/" target="_blank" rel="noopener">Google Skillshop</a> — official free training for Google Analytics and Google Ads.</li>
<li><a href="https://www.coursera.org/learn/generative-ai-for-everyone" target="_blank" rel="noopener">Generative AI for Everyone (Coursera)</a> — a non-technical introduction for Chapter 9.</li>
</ul>
<h3>🛠️ Tools and how to run the code</h3>
<ul>
<li><strong><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a></strong>: open a new notebook, paste a code block, press Shift+Enter. pandas, scikit-learn and scipy are already installed there.</li>
<li><strong>pandas</strong> = tables in Python (<a href="https://pandas.pydata.org/docs/getting_started/intro_tutorials/index.html" target="_blank" rel="noopener">getting-started tutorials</a>); <strong>scikit-learn</strong> = classic machine learning; <strong>scipy</strong> = statistics.</li>
<li>For dashboards: <a href="https://lookerstudio.google.com/" target="_blank" rel="noopener">Looker Studio</a> (free, connects to Google Sheets and GA4) or Microsoft Power BI.</li>
</ul>
<p>All code in this course was run with the versions below. Small differences in later versions are normal (for example a column type printed as <code>object</code> instead of <code>str</code>).</p>
<pre><code class="language-python">import sys, pandas as pd, sklearn, scipy
print("Python", sys.version.split()[0])
print("pandas", pd.__version__, "| scikit-learn", sklearn.__version__, "| scipy", scipy.__version__)
</code></pre>
<div class="out">Python 3.14.6
pandas 3.1.1 | scikit-learn 1.9.1 | scipy 1.18.1</div>
<h3>⚠️ A note on numbers</h3>
<div class="pitfall"><p>All datasets in the lessons are <strong>synthetic</strong> (made up for teaching) unless a source is linked. Do not quote them as market statistics in your assignments. When you need a real benchmark, find the source, open it, and cite it with its date.</p></div>
<h3>📌 Summary</h3>
<ul><li>Main books: Provost &amp; Fawcett (thinking), Kohavi et al. (experiments), Knaflic (storytelling), ISLP (free, for depth).</li><li>Free practice: Google ML Crash Course, Kaggle Learn, MIT OCW, Skillshop.</li><li>Run every example in Colab and change the numbers.</li></ul>`,
  `<span class="eyebrow">ABA201c · Mục 0 · Bài 0.2</span>
<h2>Giáo trình, khoá học mở và công cụ</h2>
<p class="lead">Vì chưa có syllabus công bố, môn học bám thứ tự và thuật ngữ của các giáo trình quốc tế được dùng rộng rãi. Bạn không cần mua hết — một sách chính cộng các tài nguyên miễn phí bên dưới là đủ.</p>
<h3>📗 Giáo trình chính</h3>
<ol>
<li><strong>Foster Provost &amp; Tom Fawcett — <em>Data Science for Business: What You Need to Know about Data Mining and Data-Analytic Thinking</em></strong>. O'Reilly Media, 2013, xuất bản lần 1. ISBN 978-1-4493-6132-7. <em>Xương sống cho "tư duy phân tích dữ liệu": đặt bài toán kinh doanh, phân khúc, mô hình dự đoán, đánh giá và lift.</em> Trang sách: <a href="https://data-science-for-biz.com/" target="_blank" rel="noopener">data-science-for-biz.com</a>.</li>
<li><strong>Ron Kohavi, Diane Tang &amp; Ya Xu — <em>Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing</em></strong>. Cambridge University Press, 2020, xuất bản lần 1 (bìa mềm ISBN 978-1-108-72426-5). <em>Tài liệu chuẩn cho Chương 8 (A/B testing).</em> Trang sách: <a href="https://experimentguide.com/" target="_blank" rel="noopener">experimentguide.com</a>.</li>
<li><strong>Cole Nussbaumer Knaflic — <em>Storytelling with Data: A Data Visualization Guide for Business Professionals</em></strong>. Wiley, 2015, xuất bản lần 1. ISBN 978-1-119-00225-3. <em>Tài liệu chuẩn cho Chương 11 (dashboard và kể chuyện bằng dữ liệu).</em> Trang tác giả: <a href="https://www.storytellingwithdata.com/books" target="_blank" rel="noopener">storytellingwithdata.com/books</a>.</li>
<li><strong>Gareth James, Daniela Witten, Trevor Hastie, Robert Tibshirani &amp; Jonathan Taylor — <em>An Introduction to Statistical Learning with Applications in Python</em></strong>. Springer, 2023. <em>Tác giả cho tải PDF miễn phí tại <a href="https://www.statlearning.com/" target="_blank" rel="noopener">statlearning.com</a>. Đọc các chương đầu về hồi quy, phân loại, phân cụm nếu muốn sâu hơn môn này.</em></li>
</ol>
<h3>📚 Chương nào dựa vào sách nào</h3>
<ul><li>Chương 1–3 (dữ liệu, dữ liệu lớn, KPI mô tả) và 6–7 (phân khúc, dự đoán, lift): Provost &amp; Fawcett, cùng ISLP cho phần thống kê đằng sau hồi quy, phân loại và phân cụm.</li><li>Chương 4–5 (listening, cảm xúc, văn bản) và 10 (hệ gợi ý): tài liệu scikit-learn và các khoá miễn phí của Google có link trong từng bài.</li><li>Chương 8 (A/B testing): Kohavi, Tang &amp; Xu.</li><li>Chương 11 (dashboard, kể chuyện): Knaflic.</li><li>Chương 9 và 12 (AI tạo sinh, quyền riêng tư, đạo đức): văn bản chính thức — Luật Bảo vệ dữ liệu cá nhân 2025 của Việt Nam, Đạo luật AI của EU, các khung của NIST và OECD — có link trong bài, vì lĩnh vực này thay đổi nhanh hơn sách.</li></ul>
<p>Riêng pandas, cuốn <em>Python for Data Analysis</em> (bản 3) của Wes McKinney có bản đọc trực tuyến mở tại <a href="https://wesmckinney.com/book/" target="_blank" rel="noopener">wesmckinney.com/book</a>.</p>
<h3>🌐 Khoá học và tài liệu miễn phí</h3>
<ul>
<li><a href="https://developers.google.com/machine-learning/crash-course/linear-regression" target="_blank" rel="noopener">Google Machine Learning Crash Course</a> — các mô-đun ngắn, trực quan về hồi quy, phân loại, embedding, LLM và công bằng.</li>
<li><a href="https://www.kaggle.com/learn/pandas" target="_blank" rel="noopener">Kaggle Learn — Pandas</a> và <a href="https://www.kaggle.com/learn/intro-to-machine-learning" target="_blank" rel="noopener">Kaggle Learn — Intro to Machine Learning</a> — notebook thực hành ngay trên trình duyệt.</li>
<li><a href="https://ocw.mit.edu/courses/15-071-the-analytics-edge-spring-2017/" target="_blank" rel="noopener">MIT OpenCourseWare 15.071 — The Analytics Edge</a> — môn phân tích kinh doanh của MIT Sloan với tình huống thật.</li>
<li><a href="https://www.coursera.org/professional-certificates/google-data-analytics" target="_blank" rel="noopener">Google Data Analytics Professional Certificate (Coursera)</a> — lộ trình có cấu trúc cho kỹ năng phân tích (học dự thính miễn phí nếu Coursera cho phép).</li>
<li><a href="https://skillshop.withgoogle.com/" target="_blank" rel="noopener">Google Skillshop</a> — đào tạo chính thức, miễn phí về Google Analytics và Google Ads.</li>
<li><a href="https://www.coursera.org/learn/generative-ai-for-everyone" target="_blank" rel="noopener">Generative AI for Everyone (Coursera)</a> — nhập môn không cần kỹ thuật, dùng cho Chương 9.</li>
</ul>
<h3>🛠️ Công cụ và cách chạy code</h3>
<ul>
<li><strong><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a></strong>: mở notebook mới, dán khối code, bấm Shift+Enter. pandas, scikit-learn và scipy đã cài sẵn.</li>
<li><strong>pandas</strong> = bảng dữ liệu trong Python (<a href="https://pandas.pydata.org/docs/getting_started/intro_tutorials/index.html" target="_blank" rel="noopener">hướng dẫn nhập môn</a>); <strong>scikit-learn</strong> = học máy cổ điển; <strong>scipy</strong> = thống kê.</li>
<li>Làm dashboard: <a href="https://lookerstudio.google.com/" target="_blank" rel="noopener">Looker Studio</a> (miễn phí, nối Google Sheets và GA4) hoặc Microsoft Power BI.</li>
</ul>
<p>Toàn bộ code của môn đã chạy với các phiên bản dưới đây. Phiên bản sau có thể in hơi khác (ví dụ kiểu cột hiện <code>object</code> thay vì <code>str</code>) — đó là bình thường.</p>
<pre><code class="language-python">import sys, pandas as pd, sklearn, scipy
print("Python", sys.version.split()[0])
print("pandas", pd.__version__, "| scikit-learn", sklearn.__version__, "| scipy", scipy.__version__)
</code></pre>
<div class="out">Python 3.14.6
pandas 3.1.1 | scikit-learn 1.9.1 | scipy 1.18.1</div>
<h3>⚠️ Lưu ý về số liệu</h3>
<div class="pitfall"><p>Mọi bộ dữ liệu trong bài đều là <strong>giả lập</strong> (tạo ra để dạy) trừ khi có link nguồn. Đừng trích chúng như số liệu thị trường trong bài tập. Khi cần benchmark thật, hãy tìm nguồn, mở ra đọc, và ghi nguồn kèm ngày.</p></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Sách chính: Provost &amp; Fawcett (tư duy), Kohavi và cộng sự (thử nghiệm), Knaflic (kể chuyện), ISLP (miễn phí, để học sâu).</li><li>Thực hành miễn phí: Google ML Crash Course, Kaggle Learn, MIT OCW, Skillshop.</li><li>Chạy mọi ví dụ trên Colab và thử đổi con số.</li></ul>`);

const ch0 = {
  title: 'Section 0 — Course framework (self-authored, no FLM syllabus)|||Mục 0 — Khung môn học (tự soạn, trường chưa công bố syllabus)',
  description: 'Giới thiệu ABA201c, chuẩn đầu ra tự soạn, cảnh báo trường chưa công bố syllabus trên FLM, giáo trình chuẩn kèm ISBN và tài nguyên học mở.',
  lessons: [l0_1, l0_2],
};

const l1_1 = L('aba201c-ts-1-1',
  '1.1 — What data is: variables, types and tidy tables|||1.1 — Dữ liệu là gì: biến, kiểu dữ liệu và bảng "tidy"',
  'Dữ liệu có cấu trúc / phi cấu trúc, biến định lượng / định tính, bảng tidy (mỗi dòng một quan sát), đọc một bảng bài đăng mạng xã hội bằng pandas và tính tỷ lệ tương tác.',
  `<span class="eyebrow">ABA201c · Chapter 1 · Lesson 1.1</span>
<h2>What data is: variables, types and tidy tables</h2>
<p class="lead">Before any AI, there is a table. Most mistakes in marketing analytics come not from complicated models but from misunderstanding what a row means or what type a column has.</p>
<h3>🎯 Objectives</h3>
<ul><li>Distinguish structured, semi-structured and unstructured data with communication examples.</li><li>Classify variables as numerical (continuous, count) or categorical (nominal, ordinal), plus dates and text.</li><li>Recognise a "tidy" table and the unit of analysis.</li><li>Load a small post-performance table in pandas and compute a derived metric.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Data</strong> is recorded observations about something. For a communicator the "something" is usually a <em>post</em>, a <em>person</em>, an <em>ad</em>, a <em>session</em> on a website, or a <em>day</em>. Data comes in three shapes:</p>
<ul>
<li><strong>Structured</strong>: rows and columns with fixed meaning — an export of Facebook post insights, a CRM customer table.</li>
<li><strong>Semi-structured</strong>: records with labels but flexible shape — JSON returned by a platform API, where one post has three images and another has none.</li>
<li><strong>Unstructured</strong>: text of comments, images, video, audio of a podcast. Rich in meaning, but must be converted into numbers before analysis (Chapters 4–5).</li>
</ul>
<p>Inside a table, each column is a <strong>variable</strong>. Its type decides what you may do with it:</p>
<div class="kv-grid">
<div class="kv"><span class="k">Numerical – continuous</span><span class="v">spend, watch time, revenue: you can average them</span></div>
<div class="kv"><span class="k">Numerical – count</span><span class="v">likes, comments, clicks: whole numbers, often skewed</span></div>
<div class="kv"><span class="k">Categorical – nominal</span><span class="v">platform, format, city: no order; count and compare groups</span></div>
<div class="kv"><span class="k">Categorical – ordinal</span><span class="v">survey answer 1–5, tier Bronze/Silver/Gold: order matters, distances may not</span></div>
<div class="kv"><span class="k">Date/time</span><span class="v">posted time: lets you group by day, hour, week</span></div>
<div class="kv"><span class="k">Text</span><span class="v">caption, comment: needs text analytics</span></div>
</div>
<p>A table is <strong>tidy</strong> when each row is one observation, each column is one variable and each cell holds one value (Hadley Wickham's definition). The first question to ask about any export is: <em>what is one row?</em> One post? One post per day? One user per campaign? If you average "engagement rate" across rows that mean different things, the result is meaningless.</p>
<h3>✍️ Worked example — a post-performance table</h3>
<p>A café brand exported six posts. We let pandas tell us the column types, then create a new column: engagement rate = (likes + comments) ÷ reach × 100.</p>
<pre><code class="language-python">import pandas as pd

posts = pd.DataFrame({
    "post_id":  [101, 102, 103, 104, 105, 106],
    "platform": ["Facebook", "TikTok", "Instagram", "TikTok", "Facebook", "Instagram"],
    "format":   ["image", "video", "carousel", "video", "link", "image"],
    "posted":   pd.to_datetime(["2026-03-02", "2026-03-03", "2026-03-04",
                                "2026-03-06", "2026-03-07", "2026-03-09"]),
    "reach":    [12000, 45000, 8000, 30000, 5000, 9500],
    "likes":    [340, 2100, 410, 1500, 60, 380],
    "comments": [25, 180, 32, 95, 4, 21],
    "caption":  ["Ra mắt menu mới", "Hậu trường quay clip", "5 mẹo pha cà phê",
                 "Thử thách #CafeSang", "Đọc bài blog", "Khách hàng nói gì"],
})
print(posts.dtypes)
print()
posts["eng_rate_%"] = ((posts["likes"] + posts["comments"]) / posts["reach"] * 100).round(2)
print(posts[["post_id", "platform", "format", "reach", "eng_rate_%"]])
print()
print(posts["platform"].value_counts())
</code></pre>
<div class="out">post_id              int64
platform               str
format                 str
posted      datetime64[us]
reach                int64
likes                int64
comments             int64
caption                str
dtype: object

   post_id   platform    format  reach  eng_rate_%
0      101   Facebook     image  12000        3.04
1      102     TikTok     video  45000        5.07
2      103  Instagram  carousel   8000        5.52
3      104     TikTok     video  30000        5.32
4      105   Facebook      link   5000        1.28
5      106  Instagram     image   9500        4.22

platform
Facebook     2
TikTok       2
Instagram    2
Name: count, dtype: int64</div>
<p><strong>Reading the output.</strong> <code>int64</code> = whole numbers, <code>str</code> = text, <code>datetime64</code> = dates. The TikTok video reached the most people, but the Instagram carousel had the highest engagement <em>rate</em> (5.52%). Reach and rate answer different questions: "how many saw it?" versus "how strongly did those who saw it react?". Note also that the dataset is tiny: six posts cannot prove that carousels are better — they only suggest a hypothesis to test.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Treating an ordinal survey score (1–5) as if "4 is twice as good as 2".</li><li>Storing numbers as text ("12,000" with a comma) so they cannot be summed.</li><li>Mixing units of analysis — e.g. one row per post for Facebook but one row per day for TikTok — in the same table.</li><li>Comparing totals instead of rates when groups have different sizes.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Data shapes: structured, semi-structured (JSON), unstructured (text, images, video).</li><li>Variable type decides the valid operation: average numbers, count categories, group by dates.</li><li>Tidy = one observation per row; always ask "what is one row?".</li><li>Derived metrics (rates) make groups of different size comparable.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.jstatsoft.org/article/view/v059i10" target="_blank" rel="noopener">Hadley Wickham — Tidy Data (Journal of Statistical Software)</a></li><li><a href="https://www.ibm.com/think/topics/structured-vs-unstructured-data" target="_blank" rel="noopener">IBM — Structured vs. unstructured data</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/1-2-data-sampling-and-variation-in-data-and-sampling" target="_blank" rel="noopener">OpenStax Introductory Statistics — 1.2 Data, sampling and variation</a></li><li><a href="https://www.kaggle.com/learn/pandas" target="_blank" rel="noopener">Kaggle Learn — Pandas</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Classify each variable: (a) number of shares, (b) customer satisfaction "Very unhappy … Very happy", (c) campaign name, (d) ad spend in VND, (e) a customer's review text.</li><li>A sheet has one row per day and columns <code>fb_reach</code>, <code>tt_reach</code>, <code>ig_reach</code>. Is it tidy? How would you reshape it?</li><li>Post A: reach 50,000, 1,000 interactions. Post B: reach 4,000, 200 interactions. Which has the higher engagement rate?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (a) numerical count, (b) categorical ordinal, (c) categorical nominal, (d) numerical continuous, (e) text (unstructured). 2) Not tidy: the platform is hidden in column names. Reshape to columns <code>date, platform, reach</code> — one row per day per platform (pandas <code>melt</code>). 3) A = 2%, B = 5% — B, although A reached more people.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 1 · Bài 1.1</span>
<h2>Dữ liệu là gì: biến, kiểu dữ liệu và bảng "tidy"</h2>
<p class="lead">Trước mọi AI là một cái bảng. Phần lớn sai lầm trong phân tích marketing không đến từ mô hình phức tạp mà từ việc hiểu sai một dòng nghĩa là gì, hay một cột thuộc kiểu gì.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phân biệt dữ liệu có cấu trúc, bán cấu trúc và phi cấu trúc qua ví dụ truyền thông.</li><li>Phân loại biến định lượng (liên tục, đếm) và định tính (danh nghĩa, thứ bậc), cùng ngày giờ và văn bản.</li><li>Nhận ra bảng "tidy" và đơn vị phân tích.</li><li>Nạp một bảng hiệu quả bài đăng bằng pandas và tính một chỉ số mới.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Dữ liệu</strong> là các quan sát được ghi lại về một đối tượng. Với người làm truyền thông, đối tượng thường là một <em>bài đăng</em>, một <em>người</em>, một <em>quảng cáo</em>, một <em>phiên truy cập</em> website, hoặc một <em>ngày</em>. Dữ liệu có ba dạng:</p>
<ul>
<li><strong>Có cấu trúc</strong>: hàng và cột với ý nghĩa cố định — file xuất insight bài đăng Facebook, bảng khách hàng trong CRM.</li>
<li><strong>Bán cấu trúc</strong>: bản ghi có nhãn nhưng hình dạng linh hoạt — JSON mà API của nền tảng trả về, bài này có ba ảnh, bài kia không có ảnh nào.</li>
<li><strong>Phi cấu trúc</strong>: nội dung bình luận, hình ảnh, video, âm thanh podcast. Giàu ý nghĩa nhưng phải đổi thành số trước khi phân tích (Chương 4–5).</li>
</ul>
<p>Trong một bảng, mỗi cột là một <strong>biến</strong>. Kiểu của biến quyết định bạn được làm gì với nó:</p>
<div class="kv-grid">
<div class="kv"><span class="k">Định lượng – liên tục</span><span class="v">chi phí, thời gian xem, doanh thu: lấy trung bình được</span></div>
<div class="kv"><span class="k">Định lượng – đếm</span><span class="v">lượt thích, bình luận, click: số nguyên, thường lệch</span></div>
<div class="kv"><span class="k">Định tính – danh nghĩa</span><span class="v">nền tảng, định dạng, thành phố: không có thứ tự; đếm và so sánh nhóm</span></div>
<div class="kv"><span class="k">Định tính – thứ bậc</span><span class="v">điểm khảo sát 1–5, hạng Đồng/Bạc/Vàng: có thứ tự, khoảng cách chưa chắc đều</span></div>
<div class="kv"><span class="k">Ngày/giờ</span><span class="v">giờ đăng: cho phép gom theo ngày, giờ, tuần</span></div>
<div class="kv"><span class="k">Văn bản</span><span class="v">caption, bình luận: cần phân tích văn bản</span></div>
</div>
<p>Một bảng là <strong>tidy</strong> khi mỗi dòng là một quan sát, mỗi cột là một biến và mỗi ô chứa một giá trị (định nghĩa của Hadley Wickham). Câu hỏi đầu tiên với mọi file xuất là: <em>một dòng là gì?</em> Một bài đăng? Một bài đăng mỗi ngày? Một người dùng mỗi chiến dịch? Nếu bạn lấy trung bình "tỷ lệ tương tác" trên các dòng mang nghĩa khác nhau, kết quả vô nghĩa.</p>
<h3>✍️ Ví dụ — bảng hiệu quả bài đăng</h3>
<p>Một thương hiệu cà phê xuất sáu bài đăng. Ta để pandas cho biết kiểu từng cột, rồi tạo cột mới: tỷ lệ tương tác = (thích + bình luận) ÷ reach × 100.</p>
<pre><code class="language-python">import pandas as pd

posts = pd.DataFrame({
    "post_id":  [101, 102, 103, 104, 105, 106],
    "platform": ["Facebook", "TikTok", "Instagram", "TikTok", "Facebook", "Instagram"],
    "format":   ["image", "video", "carousel", "video", "link", "image"],
    "posted":   pd.to_datetime(["2026-03-02", "2026-03-03", "2026-03-04",
                                "2026-03-06", "2026-03-07", "2026-03-09"]),
    "reach":    [12000, 45000, 8000, 30000, 5000, 9500],
    "likes":    [340, 2100, 410, 1500, 60, 380],
    "comments": [25, 180, 32, 95, 4, 21],
    "caption":  ["Ra mắt menu mới", "Hậu trường quay clip", "5 mẹo pha cà phê",
                 "Thử thách #CafeSang", "Đọc bài blog", "Khách hàng nói gì"],
})
print(posts.dtypes)
print()
posts["eng_rate_%"] = ((posts["likes"] + posts["comments"]) / posts["reach"] * 100).round(2)
print(posts[["post_id", "platform", "format", "reach", "eng_rate_%"]])
print()
print(posts["platform"].value_counts())
</code></pre>
<div class="out">post_id              int64
platform               str
format                 str
posted      datetime64[us]
reach                int64
likes                int64
comments             int64
caption                str
dtype: object

   post_id   platform    format  reach  eng_rate_%
0      101   Facebook     image  12000        3.04
1      102     TikTok     video  45000        5.07
2      103  Instagram  carousel   8000        5.52
3      104     TikTok     video  30000        5.32
4      105   Facebook      link   5000        1.28
5      106  Instagram     image   9500        4.22

platform
Facebook     2
TikTok       2
Instagram    2
Name: count, dtype: int64</div>
<p><strong>Đọc kết quả.</strong> <code>int64</code> = số nguyên, <code>str</code> = chữ, <code>datetime64</code> = ngày. Video TikTok tiếp cận nhiều người nhất, nhưng carousel Instagram có <em>tỷ lệ</em> tương tác cao nhất (5,52%). Reach và tỷ lệ trả lời hai câu hỏi khác nhau: "bao nhiêu người thấy?" và "người thấy phản ứng mạnh cỡ nào?". Cũng lưu ý bộ dữ liệu rất nhỏ: sáu bài không chứng minh được carousel tốt hơn — chỉ gợi ra một giả thuyết cần kiểm chứng.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Coi điểm khảo sát thứ bậc (1–5) như thể "4 tốt gấp đôi 2".</li><li>Lưu số dưới dạng chữ ("12,000" có dấu phẩy) nên không cộng được.</li><li>Trộn đơn vị phân tích — Facebook mỗi dòng một bài, TikTok mỗi dòng một ngày — trong cùng một bảng.</li><li>So sánh tổng thay vì tỷ lệ khi các nhóm có kích thước khác nhau.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Dạng dữ liệu: có cấu trúc, bán cấu trúc (JSON), phi cấu trúc (văn bản, ảnh, video).</li><li>Kiểu biến quyết định phép tính hợp lệ: lấy trung bình số, đếm nhóm, gom theo ngày.</li><li>Tidy = mỗi dòng một quan sát; luôn hỏi "một dòng là gì?".</li><li>Chỉ số phái sinh (tỷ lệ) giúp so sánh các nhóm khác kích thước.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.jstatsoft.org/article/view/v059i10" target="_blank" rel="noopener">Hadley Wickham — Tidy Data (Journal of Statistical Software)</a></li><li><a href="https://www.ibm.com/think/topics/structured-vs-unstructured-data" target="_blank" rel="noopener">IBM — Dữ liệu có cấu trúc và phi cấu trúc</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/1-2-data-sampling-and-variation-in-data-and-sampling" target="_blank" rel="noopener">OpenStax Introductory Statistics — 1.2 Dữ liệu, chọn mẫu và biến thiên</a></li><li><a href="https://www.kaggle.com/learn/pandas" target="_blank" rel="noopener">Kaggle Learn — Pandas</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Phân loại từng biến: (a) số lượt chia sẻ, (b) mức hài lòng "Rất không hài lòng … Rất hài lòng", (c) tên chiến dịch, (d) chi phí quảng cáo (VND), (e) nội dung đánh giá của khách.</li><li>Một sheet có mỗi dòng là một ngày, các cột <code>fb_reach</code>, <code>tt_reach</code>, <code>ig_reach</code>. Có tidy không? Sắp lại thế nào?</li><li>Bài A: reach 50.000, 1.000 tương tác. Bài B: reach 4.000, 200 tương tác. Bài nào có tỷ lệ tương tác cao hơn?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (a) định lượng đếm, (b) định tính thứ bậc, (c) định tính danh nghĩa, (d) định lượng liên tục, (e) văn bản (phi cấu trúc). 2) Không tidy: nền tảng bị giấu trong tên cột. Sắp lại thành các cột <code>date, platform, reach</code> — mỗi dòng một ngày một nền tảng (dùng <code>melt</code> của pandas). 3) A = 2%, B = 5% — B cao hơn, dù A tiếp cận nhiều người hơn.</p></div>`);

const l1_2 = L('aba201c-ts-1-2',
  '1.2 — The communications data ecosystem: social, web, CRM and campaign data|||1.2 — Hệ sinh thái dữ liệu truyền thông: mạng xã hội, web, CRM và chiến dịch',
  'Bốn nguồn dữ liệu chính (social, web analytics GA4, CRM, nền tảng quảng cáo), owned–paid–earned, dữ liệu bên thứ nhất/thứ hai/thứ ba/zero-party, tham số UTM và cách đọc chúng bằng Python.',
  `<span class="eyebrow">ABA201c · Chapter 1 · Lesson 1.2</span>
<h2>The communications data ecosystem</h2>
<p class="lead">A single campaign spreads data across many systems: the ad platform knows who saw the ad, the website knows who arrived, the CRM knows who bought. Analytics starts by knowing which system holds which piece — and how to link them.</p>
<h3>🎯 Objectives</h3>
<ul><li>Name the four main data sources of a communications team and what each can and cannot tell you.</li><li>Use the owned / paid / earned media lens and the first-, second-, third- and zero-party data lens.</li><li>Explain UTM parameters and why consistent naming matters.</li></ul>
<h3>📖 Lecture</h3>
<h3>Four sources</h3>
<ol>
<li><strong>Social platform data</strong> (Facebook, Instagram, TikTok, YouTube, Zalo OA): reach, impressions, interactions, video views, follower growth. You see aggregated numbers for your own pages; individual identities are mostly hidden. Comments and public posts about your brand are the raw material of <em>social listening</em> (Chapter 4).</li>
<li><strong>Web and app analytics</strong> (e.g. Google Analytics 4): what visitors do on your site. GA4 is <strong>event-based</strong>: every interaction — page view, scroll, click, purchase — is recorded as an event with parameters.</li>
<li><strong>CRM and sales data</strong>: customers, orders, loyalty points, support tickets. This is where revenue and repeat purchase live, and where personal data sits — so privacy rules apply strongly (Chapter 12).</li>
<li><strong>Campaign / ad-platform data</strong> (Meta Ads, Google Ads, TikTok Ads, email tools): spend, impressions, clicks, conversions per campaign, ad set and creative.</li>
</ol>
<h3>Two classic lenses</h3>
<p><strong>Owned, paid, earned.</strong> <em>Owned</em> media are channels you control (website, fanpage, email list). <em>Paid</em> media are bought exposure (ads, sponsored KOL posts). <em>Earned</em> media are what others say about you (press, reviews, shares). Each produces different data: owned gives detailed behaviour, paid gives cost and delivery metrics, earned is mostly text you must listen to.</p>
<p><strong>Who collected the data?</strong></p>
<ul>
<li><strong>Zero-party</strong>: what customers intentionally tell you (quiz answers, preference centre: "I prefer iced drinks").</li>
<li><strong>First-party</strong>: what you observe in your own channels (purchases, site behaviour, email opens).</li>
<li><strong>Second-party</strong>: another organisation's first-party data shared with you under an agreement (for example a co-branded campaign with a partner).</li>
<li><strong>Third-party</strong>: data bought from aggregators who did not collect it from your customers. Increasingly restricted by law and browsers; in Vietnam the 2025 Personal Data Protection Law prohibits buying and selling personal data except where a law allows it (Chapter 12).</li>
</ul>
<h3>The glue: UTM parameters</h3>
<p>How does GA4 know a visitor came from your Tết email rather than a Facebook ad? You add <strong>UTM parameters</strong> to the link. Google's documentation says to always use <code>utm_source</code>, <code>utm_medium</code> and <code>utm_campaign</code>, and recommends <code>utm_id</code> and <code>utm_source_platform</code>; <code>utm_content</code> distinguishes creatives and <code>utm_term</code> paid keywords.</p>
<h3>✍️ Worked example — reading UTMs</h3>
<p>Five links from one campaign. Python splits each URL into its parameters:</p>
<pre><code class="language-python">from urllib.parse import urlparse, parse_qs
import pandas as pd

urls = [
    "https://shop.example.com/sale?utm_source=facebook&amp;utm_medium=paid_social&amp;utm_campaign=tet2026&amp;utm_content=video_a",
    "https://shop.example.com/sale?utm_source=facebook&amp;utm_medium=paid_social&amp;utm_campaign=tet2026&amp;utm_content=video_b",
    "https://shop.example.com/sale?utm_source=newsletter&amp;utm_medium=email&amp;utm_campaign=tet2026",
    "https://shop.example.com/sale?utm_source=Facebook&amp;utm_medium=Paid-Social&amp;utm_campaign=Tet2026",
    "https://shop.example.com/sale",
]
rows = []
for u in urls:
    q = parse_qs(urlparse(u).query)
    rows.append({k: q.get(k, ["(none)"])[0]
                 for k in ["utm_source", "utm_medium", "utm_campaign", "utm_content"]})
print(pd.DataFrame(rows))
</code></pre>
<div class="out">   utm_source   utm_medium utm_campaign utm_content
0    facebook  paid_social      tet2026     video_a
1    facebook  paid_social      tet2026     video_b
2  newsletter        email      tet2026      (none)
3    Facebook  Paid-Social      Tet2026      (none)
4      (none)       (none)       (none)      (none)</div>
<p>Rows 0–2 are clean. Row 3 is the same campaign typed differently (<code>Facebook</code>, <code>Paid-Social</code>, <code>Tet2026</code>): your report will split it into a separate line and under-count Facebook. Row 4 has no UTM at all and will be attributed to "direct" or "referral". The fix is organisational, not technical: a shared <strong>naming convention</strong> (all lowercase, underscores, fixed list of mediums) and a link builder everyone uses.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Adding UTMs to internal links on your own site — this overwrites the real source of the visit.</li><li>Inventing new <code>utm_medium</code> values each campaign, so channels cannot be compared over time.</li><li>Believing platform-reported conversions and GA4 conversions should match exactly — they use different attribution rules and windows.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Four sources: social, web/app analytics, CRM/sales, ad platforms — each sees a different slice.</li><li>Owned / paid / earned describes the media; zero/first/second/third-party describes who collected the data.</li><li>UTMs link a click to a campaign; consistent naming is what makes them useful.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://support.google.com/analytics/answer/10917952" target="_blank" rel="noopener">Google Analytics Help — URL builders: collect campaign data with custom URLs</a></li><li><a href="https://support.google.com/analytics/answer/9322688" target="_blank" rel="noopener">Google Analytics Help — About events</a></li><li><a href="https://support.google.com/analytics/answer/12159447" target="_blank" rel="noopener">Google Analytics Help — How Google Analytics works</a></li><li><a href="https://ga-dev-tools.google/campaign-url-builder/" target="_blank" rel="noopener">Google — Campaign URL Builder</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Classify as zero-, first-, second- or third-party: (a) a customer ticks "I like oat milk" in your app, (b) purchase history in your POS, (c) a list of "students interested in coffee" bought from a vendor.</li><li>Write a UTM-tagged link for a Zalo OA message promoting a back-to-school campaign, creative "banner_b".</li><li>Which source would you use to answer: "How many people who clicked the TikTok ad bought again within 30 days?"</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (a) zero-party, (b) first-party, (c) third-party (and legally risky). 2) e.g. <code>https://shop.example.com/?utm_source=zalo&amp;utm_medium=oa_message&amp;utm_campaign=back_to_school&amp;utm_content=banner_b</code>. 3) You need to join ad/web data (the click with its UTM) to CRM orders (repeat purchase) — no single source answers it.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 1 · Bài 1.2</span>
<h2>Hệ sinh thái dữ liệu truyền thông</h2>
<p class="lead">Một chiến dịch rải dữ liệu ra nhiều hệ thống: nền tảng quảng cáo biết ai đã thấy quảng cáo, website biết ai đã đến, CRM biết ai đã mua. Phân tích bắt đầu bằng việc biết hệ thống nào giữ mảnh nào — và cách nối chúng lại.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Kể tên bốn nguồn dữ liệu chính của đội truyền thông và mỗi nguồn cho biết / không cho biết điều gì.</li><li>Dùng lăng kính owned / paid / earned và lăng kính dữ liệu bên thứ nhất, thứ hai, thứ ba, zero-party.</li><li>Giải thích tham số UTM và vì sao đặt tên nhất quán lại quan trọng.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Bốn nguồn</h3>
<ol>
<li><strong>Dữ liệu nền tảng mạng xã hội</strong> (Facebook, Instagram, TikTok, YouTube, Zalo OA): reach, lượt hiển thị, tương tác, lượt xem video, tăng trưởng người theo dõi. Bạn thấy số tổng hợp của trang mình; danh tính từng người phần lớn bị ẩn. Bình luận và bài đăng công khai nhắc tới thương hiệu là nguyên liệu của <em>social listening</em> (Chương 4).</li>
<li><strong>Phân tích web và app</strong> (ví dụ Google Analytics 4): khách làm gì trên website. GA4 <strong>dựa trên sự kiện (event)</strong>: mọi tương tác — xem trang, cuộn, click, mua hàng — được ghi thành một event kèm tham số.</li>
<li><strong>CRM và dữ liệu bán hàng</strong>: khách hàng, đơn hàng, điểm thành viên, phiếu hỗ trợ. Đây là nơi có doanh thu và mua lặp lại, cũng là nơi chứa dữ liệu cá nhân — nên luật bảo vệ dữ liệu áp dụng chặt (Chương 12).</li>
<li><strong>Dữ liệu chiến dịch / nền tảng quảng cáo</strong> (Meta Ads, Google Ads, TikTok Ads, công cụ email): chi phí, hiển thị, click, chuyển đổi theo chiến dịch, nhóm quảng cáo và mẫu quảng cáo.</li>
</ol>
<h3>Hai lăng kính kinh điển</h3>
<p><strong>Owned, paid, earned.</strong> <em>Owned</em> là kênh bạn sở hữu (website, fanpage, danh sách email). <em>Paid</em> là hiển thị phải trả tiền (quảng cáo, bài KOL được tài trợ). <em>Earned</em> là điều người khác nói về bạn (báo chí, đánh giá, chia sẻ). Mỗi loại sinh dữ liệu khác nhau: owned cho hành vi chi tiết, paid cho số liệu chi phí và phân phối, earned chủ yếu là văn bản bạn phải lắng nghe.</p>
<p><strong>Ai thu thập dữ liệu?</strong></p>
<ul>
<li><strong>Zero-party</strong>: điều khách hàng chủ động nói với bạn (câu trả lời quiz, trung tâm sở thích: "mình thích đồ uống đá").</li>
<li><strong>Bên thứ nhất</strong>: điều bạn quan sát trên kênh của mình (lịch sử mua, hành vi trên web, mở email).</li>
<li><strong>Bên thứ hai</strong>: dữ liệu bên thứ nhất của tổ chức khác chia sẻ cho bạn theo thoả thuận (ví dụ chiến dịch đồng thương hiệu với đối tác).</li>
<li><strong>Bên thứ ba</strong>: dữ liệu mua từ bên tổng hợp, không do họ thu từ khách của bạn. Ngày càng bị luật và trình duyệt hạn chế; ở Việt Nam, Luật Bảo vệ dữ liệu cá nhân 2025 cấm mua, bán dữ liệu cá nhân trừ trường hợp luật có quy định khác (Chương 12).</li>
</ul>
<h3>Chất keo: tham số UTM</h3>
<p>Làm sao GA4 biết khách đến từ email Tết chứ không phải quảng cáo Facebook? Bạn gắn <strong>tham số UTM</strong> vào link. Tài liệu của Google nói luôn dùng <code>utm_source</code>, <code>utm_medium</code> và <code>utm_campaign</code>, khuyến nghị thêm <code>utm_id</code> và <code>utm_source_platform</code>; <code>utm_content</code> phân biệt mẫu quảng cáo, <code>utm_term</code> cho từ khoá trả tiền.</p>
<h3>✍️ Ví dụ — đọc UTM</h3>
<p>Năm link của một chiến dịch. Python tách mỗi URL thành các tham số:</p>
<pre><code class="language-python">from urllib.parse import urlparse, parse_qs
import pandas as pd

urls = [
    "https://shop.example.com/sale?utm_source=facebook&amp;utm_medium=paid_social&amp;utm_campaign=tet2026&amp;utm_content=video_a",
    "https://shop.example.com/sale?utm_source=facebook&amp;utm_medium=paid_social&amp;utm_campaign=tet2026&amp;utm_content=video_b",
    "https://shop.example.com/sale?utm_source=newsletter&amp;utm_medium=email&amp;utm_campaign=tet2026",
    "https://shop.example.com/sale?utm_source=Facebook&amp;utm_medium=Paid-Social&amp;utm_campaign=Tet2026",
    "https://shop.example.com/sale",
]
rows = []
for u in urls:
    q = parse_qs(urlparse(u).query)
    rows.append({k: q.get(k, ["(none)"])[0]
                 for k in ["utm_source", "utm_medium", "utm_campaign", "utm_content"]})
print(pd.DataFrame(rows))
</code></pre>
<div class="out">   utm_source   utm_medium utm_campaign utm_content
0    facebook  paid_social      tet2026     video_a
1    facebook  paid_social      tet2026     video_b
2  newsletter        email      tet2026      (none)
3    Facebook  Paid-Social      Tet2026      (none)
4      (none)       (none)       (none)      (none)</div>
<p>Dòng 0–2 sạch. Dòng 3 là cùng chiến dịch nhưng gõ khác (<code>Facebook</code>, <code>Paid-Social</code>, <code>Tet2026</code>): báo cáo sẽ tách thành một dòng riêng và đếm thiếu Facebook. Dòng 4 không có UTM, sẽ bị tính vào "direct" hoặc "referral". Cách sửa thuộc về tổ chức chứ không phải kỹ thuật: một <strong>quy ước đặt tên</strong> chung (chữ thường, gạch dưới, danh sách medium cố định) và một công cụ tạo link mà ai cũng dùng.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Gắn UTM vào link nội bộ trên chính website — việc này ghi đè nguồn thật của lượt truy cập.</li><li>Mỗi chiến dịch lại bịa một giá trị <code>utm_medium</code> mới, nên không so được các kênh theo thời gian.</li><li>Tin rằng số chuyển đổi nền tảng báo và số GA4 phải khớp tuyệt đối — chúng dùng quy tắc và cửa sổ phân bổ khác nhau.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Bốn nguồn: mạng xã hội, phân tích web/app, CRM/bán hàng, nền tảng quảng cáo — mỗi nguồn thấy một lát khác nhau.</li><li>Owned / paid / earned mô tả loại kênh; zero/thứ nhất/thứ hai/thứ ba mô tả ai thu dữ liệu.</li><li>UTM nối một click với chiến dịch; đặt tên nhất quán mới làm UTM hữu ích.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://support.google.com/analytics/answer/10917952" target="_blank" rel="noopener">Google Analytics Help — Trình tạo URL: thu dữ liệu chiến dịch bằng URL tuỳ chỉnh</a></li><li><a href="https://support.google.com/analytics/answer/9322688" target="_blank" rel="noopener">Google Analytics Help — Về sự kiện (events)</a></li><li><a href="https://support.google.com/analytics/answer/12159447" target="_blank" rel="noopener">Google Analytics Help — Google Analytics hoạt động thế nào</a></li><li><a href="https://ga-dev-tools.google/campaign-url-builder/" target="_blank" rel="noopener">Google — Campaign URL Builder</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Xếp loại zero-party, bên thứ nhất, thứ hai hay thứ ba: (a) khách tick "Tôi thích sữa yến mạch" trong app, (b) lịch sử mua trong máy POS, (c) danh sách "sinh viên quan tâm cà phê" mua từ một nhà cung cấp.</li><li>Viết link có UTM cho tin nhắn Zalo OA quảng bá chiến dịch tựu trường, mẫu "banner_b".</li><li>Dùng nguồn nào để trả lời: "Bao nhiêu người click quảng cáo TikTok đã mua lại trong 30 ngày?"</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (a) zero-party, (b) bên thứ nhất, (c) bên thứ ba (và rủi ro pháp lý). 2) Ví dụ <code>https://shop.example.com/?utm_source=zalo&amp;utm_medium=oa_message&amp;utm_campaign=back_to_school&amp;utm_content=banner_b</code>. 3) Phải ghép dữ liệu quảng cáo/web (click kèm UTM) với đơn hàng CRM (mua lại) — không nguồn đơn lẻ nào trả lời được.</p></div>`);

const l1_3 = L('aba201c-ts-1-3',
  '1.3 — Data quality and joining sources with pandas|||1.3 — Chất lượng dữ liệu và ghép nguồn bằng pandas',
  'Sáu chiều chất lượng dữ liệu, các lỗi thường gặp (trùng, thiếu, sai định dạng, nhãn không thống nhất), chuẩn hoá khoá ghép và ghép CRM với đơn hàng bằng merge.',
  `<span class="eyebrow">ABA201c · Chapter 1 · Lesson 1.3</span>
<h2>Data quality and joining sources</h2>
<p class="lead">"Garbage in, garbage out." A beautiful dashboard built on duplicated customers and misspelled channel names will confidently tell you the wrong story. Cleaning usually takes more time than analysis — and that is normal.</p>
<h3>🎯 Objectives</h3>
<ul><li>Name the main dimensions of data quality.</li><li>Detect duplicates, missing values and inconsistent labels.</li><li>Join two tables on a key and check which rows did not match.</li></ul>
<h3>📖 Lecture</h3>
<p>Data quality is usually described along a few dimensions:</p>
<ul>
<li><strong>Accuracy</strong> — does the value match reality? (a phone number typed wrong)</li>
<li><strong>Completeness</strong> — are values missing? (city left blank)</li>
<li><strong>Consistency</strong> — is the same thing written the same way everywhere? ("TikTok", "tiktok", "Tik Tok")</li>
<li><strong>Uniqueness</strong> — is each customer recorded once?</li>
<li><strong>Timeliness</strong> — is the data fresh enough for the decision?</li>
<li><strong>Validity</strong> — does it follow the expected format (dates, emails, VND amounts)?</li>
</ul>
<p>To combine sources you need a <strong>key</strong>: a column that identifies the same entity in both tables (customer email, order ID, campaign ID). A <strong>join</strong> (<code>merge</code> in pandas) lines up rows with the same key. The type of join matters:</p>
<div class="kv-grid">
<div class="kv"><span class="k">inner</span><span class="v">keep only keys found in both tables</span></div>
<div class="kv"><span class="k">left</span><span class="v">keep every row of the left table; fill blanks where the right has no match</span></div>
<div class="kv"><span class="k">outer</span><span class="v">keep everything from both sides</span></div>
</div>
<p>A key only works if it is written identically: <code>BINH@mail.com </code> (capital letters, trailing space) and <code>binh@mail.com</code> are different strings to a computer.</p>
<h3>✍️ Worked example — CRM meets orders</h3>
<p>The CRM has a duplicated customer, a missing city and an email with capitals and a space. The order table writes channels three different ways.</p>
<pre><code class="language-python">import pandas as pd

crm = pd.DataFrame({
    "email": ["an@mail.com", "BINH@mail.com ", "chi@mail.com", "an@mail.com", "dung@mail.com"],
    "city":  ["Hà Nội", "HCM", None, "Hà Nội", "Đà Nẵng"],
})
orders = pd.DataFrame({
    "email":   ["binh@mail.com", "an@mail.com", "an@mail.com", "em@mail.com"],
    "channel": ["Email", "facebook", "Facebook ", "TikTok"],
    "revenue": [350000, 120000, 200000, 90000],
})

# 1) standardise the join key and the category labels
crm["email"] = crm["email"].str.strip().str.lower()
orders["email"] = orders["email"].str.strip().str.lower()
orders["channel"] = orders["channel"].str.strip().str.title()

# 2) remove duplicate customers, mark missing values explicitly
print("duplicates in CRM:", crm.duplicated("email").sum())
crm = crm.drop_duplicates("email")
crm["city"] = crm["city"].fillna("Unknown")

# 3) join and check what did not match
merged = orders.merge(crm, on="email", how="left", indicator=True)
print(merged)
print()
print(merged.groupby("channel")["revenue"].sum())
</code></pre>
<div class="out">duplicates in CRM: 1
           email   channel  revenue    city     _merge
0  binh@mail.com     Email   350000     HCM       both
1    an@mail.com  Facebook   120000  Hà Nội       both
2    an@mail.com  Facebook   200000  Hà Nội       both
3    em@mail.com    Tiktok    90000     NaN  left_only

channel
Email       350000
Facebook    320000
Tiktok       90000
Name: revenue, dtype: int64</div>
<p><strong>Reading the output.</strong> After standardising, Bình's email matches and his order gets a city. The duplicate "an@mail.com" was removed — without that step, An's two orders would each have been matched twice, doubling his revenue. The <code>_merge</code> column (from <code>indicator=True</code>) shows that em@mail.com bought but is not in the CRM — a real business finding (a lead was not captured). Notice also a small trap: <code>.str.title()</code> turned "TikTok" into "Tiktok". Automatic fixes can create new inconsistencies; a mapping table (<code>{"tiktok": "TikTok", ...}</code>) is safer for brand names.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Joining before removing duplicates — rows multiply and totals inflate silently.</li><li>Filling missing values with 0 when "unknown" is the truth (0 revenue ≠ unknown revenue).</li><li>Never checking unmatched rows after a join; always count them.</li><li>Cleaning by hand in Excel without writing down the steps, so next month nobody can repeat them.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Quality dimensions: accuracy, completeness, consistency, uniqueness, timeliness, validity.</li><li>Standardise keys (lowercase, strip spaces) before joining.</li><li>Choose inner / left / outer joins deliberately and inspect what did not match.</li><li>Write cleaning as code so it is repeatable and auditable.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://pandas.pydata.org/docs/user_guide/merging.html" target="_blank" rel="noopener">pandas — Merge, join, concatenate and compare</a></li><li><a href="https://pandas.pydata.org/docs/user_guide/missing_data.html" target="_blank" rel="noopener">pandas — Working with missing data</a></li><li><a href="https://www.ibm.com/think/topics/data-quality" target="_blank" rel="noopener">IBM — What is data quality?</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A CRM has 1,000 rows but 950 unique emails. After a left join with 2,000 orders, the revenue total is higher than the order table's own total. Why?</li><li>Which join keeps all orders even if the customer is not in the CRM?</li><li>Propose a cleaning rule for channel names <code>"FB"</code>, <code>"facebook"</code>, <code>"Facebook Ads"</code>.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) The 50 duplicated customers match their orders more than once, so those orders are counted twice — deduplicate the CRM first. 2) A left join with orders as the left table (<code>orders.merge(crm, how="left")</code>). 3) Map all of them to one standard label, e.g. <code>{"fb": "Facebook", "facebook": "Facebook", "facebook ads": "Facebook"}</code> after lower-casing and stripping; keep "paid vs organic" in a separate column.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 1 · Bài 1.3</span>
<h2>Chất lượng dữ liệu và ghép nguồn</h2>
<p class="lead">"Rác vào, rác ra." Một dashboard đẹp xây trên khách hàng bị trùng và tên kênh viết sai sẽ tự tin kể cho bạn một câu chuyện sai. Làm sạch thường tốn thời gian hơn phân tích — và điều đó là bình thường.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Kể tên các chiều chính của chất lượng dữ liệu.</li><li>Phát hiện bản ghi trùng, giá trị thiếu và nhãn không thống nhất.</li><li>Ghép hai bảng theo khoá và kiểm tra dòng nào không khớp.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Chất lượng dữ liệu thường được mô tả theo vài chiều:</p>
<ul>
<li><strong>Chính xác</strong> — giá trị có đúng thực tế? (số điện thoại gõ nhầm)</li>
<li><strong>Đầy đủ</strong> — có giá trị bị thiếu? (bỏ trống thành phố)</li>
<li><strong>Nhất quán</strong> — một thứ có được viết giống nhau ở mọi nơi? ("TikTok", "tiktok", "Tik Tok")</li>
<li><strong>Duy nhất</strong> — mỗi khách có được ghi một lần?</li>
<li><strong>Kịp thời</strong> — dữ liệu có đủ mới cho quyết định?</li>
<li><strong>Hợp lệ</strong> — có đúng định dạng mong đợi (ngày, email, số tiền VND)?</li>
</ul>
<p>Muốn kết hợp nguồn, bạn cần một <strong>khoá</strong>: cột nhận diện cùng một đối tượng ở cả hai bảng (email khách, mã đơn, mã chiến dịch). Phép <strong>ghép (join)</strong> — <code>merge</code> trong pandas — xếp các dòng cùng khoá cạnh nhau. Loại ghép rất quan trọng:</p>
<div class="kv-grid">
<div class="kv"><span class="k">inner</span><span class="v">chỉ giữ khoá có ở cả hai bảng</span></div>
<div class="kv"><span class="k">left</span><span class="v">giữ mọi dòng của bảng trái; để trống chỗ bảng phải không khớp</span></div>
<div class="kv"><span class="k">outer</span><span class="v">giữ tất cả từ hai phía</span></div>
</div>
<p>Khoá chỉ hoạt động khi được viết y hệt nhau: <code>BINH@mail.com </code> (chữ hoa, dấu cách ở cuối) và <code>binh@mail.com</code> là hai chuỗi khác nhau đối với máy tính.</p>
<h3>✍️ Ví dụ — CRM gặp đơn hàng</h3>
<p>CRM có một khách bị trùng, một thành phố bị thiếu và một email có chữ hoa kèm dấu cách. Bảng đơn hàng viết tên kênh theo ba kiểu.</p>
<pre><code class="language-python">import pandas as pd

crm = pd.DataFrame({
    "email": ["an@mail.com", "BINH@mail.com ", "chi@mail.com", "an@mail.com", "dung@mail.com"],
    "city":  ["Hà Nội", "HCM", None, "Hà Nội", "Đà Nẵng"],
})
orders = pd.DataFrame({
    "email":   ["binh@mail.com", "an@mail.com", "an@mail.com", "em@mail.com"],
    "channel": ["Email", "facebook", "Facebook ", "TikTok"],
    "revenue": [350000, 120000, 200000, 90000],
})

# 1) standardise the join key and the category labels
crm["email"] = crm["email"].str.strip().str.lower()
orders["email"] = orders["email"].str.strip().str.lower()
orders["channel"] = orders["channel"].str.strip().str.title()

# 2) remove duplicate customers, mark missing values explicitly
print("duplicates in CRM:", crm.duplicated("email").sum())
crm = crm.drop_duplicates("email")
crm["city"] = crm["city"].fillna("Unknown")

# 3) join and check what did not match
merged = orders.merge(crm, on="email", how="left", indicator=True)
print(merged)
print()
print(merged.groupby("channel")["revenue"].sum())
</code></pre>
<div class="out">duplicates in CRM: 1
           email   channel  revenue    city     _merge
0  binh@mail.com     Email   350000     HCM       both
1    an@mail.com  Facebook   120000  Hà Nội       both
2    an@mail.com  Facebook   200000  Hà Nội       both
3    em@mail.com    Tiktok    90000     NaN  left_only

channel
Email       350000
Facebook    320000
Tiktok       90000
Name: revenue, dtype: int64</div>
<p><strong>Đọc kết quả.</strong> Sau khi chuẩn hoá, email của Bình khớp và đơn của anh có thành phố. Bản trùng "an@mail.com" đã bị xoá — nếu không, mỗi đơn của An sẽ khớp hai lần, doanh thu của An bị nhân đôi. Cột <code>_merge</code> (nhờ <code>indicator=True</code>) cho thấy em@mail.com có mua nhưng không có trong CRM — một phát hiện kinh doanh thật (khách tiềm năng chưa được ghi nhận). Để ý thêm một cái bẫy nhỏ: <code>.str.title()</code> biến "TikTok" thành "Tiktok". Sửa tự động có thể tạo ra sự không nhất quán mới; với tên thương hiệu, dùng bảng ánh xạ (<code>{"tiktok": "TikTok", ...}</code>) an toàn hơn.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Ghép trước khi bỏ trùng — số dòng nhân lên và tổng bị thổi phồng mà không ai hay.</li><li>Điền 0 vào ô thiếu khi sự thật là "không biết" (doanh thu 0 ≠ doanh thu chưa rõ).</li><li>Không bao giờ kiểm các dòng không khớp sau khi ghép; hãy luôn đếm chúng.</li><li>Làm sạch tay trong Excel mà không ghi lại các bước, nên tháng sau không ai lặp lại được.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Các chiều chất lượng: chính xác, đầy đủ, nhất quán, duy nhất, kịp thời, hợp lệ.</li><li>Chuẩn hoá khoá (chữ thường, bỏ dấu cách) trước khi ghép.</li><li>Chọn inner / left / outer có chủ đích và soi những gì không khớp.</li><li>Viết bước làm sạch thành code để lặp lại và kiểm tra được.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://pandas.pydata.org/docs/user_guide/merging.html" target="_blank" rel="noopener">pandas — Merge, join, concatenate và compare</a></li><li><a href="https://pandas.pydata.org/docs/user_guide/missing_data.html" target="_blank" rel="noopener">pandas — Làm việc với dữ liệu thiếu</a></li><li><a href="https://www.ibm.com/think/topics/data-quality" target="_blank" rel="noopener">IBM — Chất lượng dữ liệu là gì?</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>CRM có 1.000 dòng nhưng chỉ 950 email khác nhau. Sau khi left join với 2.000 đơn, tổng doanh thu lại cao hơn tổng của chính bảng đơn. Vì sao?</li><li>Loại ghép nào giữ mọi đơn hàng kể cả khi khách không có trong CRM?</li><li>Đề xuất quy tắc làm sạch cho tên kênh <code>"FB"</code>, <code>"facebook"</code>, <code>"Facebook Ads"</code>.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 50 khách bị trùng khớp với đơn của họ nhiều lần, nên các đơn đó bị đếm hai lần — phải bỏ trùng CRM trước. 2) Left join với bảng đơn hàng ở bên trái (<code>orders.merge(crm, how="left")</code>). 3) Ánh xạ tất cả về một nhãn chuẩn, ví dụ <code>{"fb": "Facebook", "facebook": "Facebook", "facebook ads": "Facebook"}</code> sau khi đổi chữ thường và bỏ dấu cách; tách "trả phí hay tự nhiên" ra một cột riêng.</p></div>`);

const q1 = QZ(1, 'Chapter 1 quiz — Data basics and the data ecosystem|||Quiz Chương 1 — Nền tảng dữ liệu và hệ sinh thái dữ liệu', '10 câu ôn kiểu dữ liệu, bảng tidy, nguồn dữ liệu truyền thông, UTM, chất lượng dữ liệu và phép ghép.', [
  Q('q1', 'A survey item "How likely are you to recommend us? 1 = not at all … 5 = very likely" is which variable type?|||Câu khảo sát "Bạn có muốn giới thiệu chúng tôi? 1 = không hề … 5 = rất muốn" thuộc kiểu biến nào?',
    ['Numerical continuous|||Định lượng liên tục', 'Categorical ordinal|||Định tính thứ bậc', 'Categorical nominal|||Định tính danh nghĩa', 'Text|||Văn bản'], 1,
    'The answers have an order but the distance between 1 and 2 is not guaranteed to equal the distance between 4 and 5.|||Các mức có thứ tự nhưng khoảng cách 1–2 không chắc bằng khoảng cách 4–5.'),
  Q('q2', 'Comments on a brand\'s TikTok videos are an example of|||Bình luận dưới video TikTok của thương hiệu là ví dụ về',
    ['structured data|||dữ liệu có cấu trúc', 'unstructured data|||dữ liệu phi cấu trúc', 'zero-party data|||dữ liệu zero-party', 'third-party data|||dữ liệu bên thứ ba'], 1,
    'Free text must be converted into numbers (Chapters 4–5) before analysis.|||Văn bản tự do phải đổi thành số (Chương 4–5) trước khi phân tích.'),
  Q('q3', 'A table is "tidy" when|||Một bảng là "tidy" khi',
    ['it has no missing values|||không có giá trị thiếu', 'it is sorted by date|||được sắp theo ngày', 'each row is one observation and each column one variable|||mỗi dòng là một quan sát và mỗi cột là một biến', 'it fits on one screen|||vừa một màn hình'], 2,
    'Tidiness is about structure, not about completeness or order.|||Tidy nói về cấu trúc, không phải độ đầy đủ hay thứ tự.'),
  Q('q4', 'Post A: reach 20,000 and 400 interactions; post B: reach 5,000 and 250 interactions. Which statement is correct?|||Bài A: reach 20.000, 400 tương tác; bài B: reach 5.000, 250 tương tác. Phát biểu nào đúng?',
    ['A has the higher engagement rate|||A có tỷ lệ tương tác cao hơn', 'B has the higher engagement rate (5% vs 2%)|||B có tỷ lệ tương tác cao hơn (5% so với 2%)', 'They have the same rate|||Hai bài bằng nhau', 'Rates cannot be compared|||Không so được tỷ lệ'], 1,
    '400/20,000 = 2%; 250/5,000 = 5%.|||400/20.000 = 2%; 250/5.000 = 5%.'),
  Q('q5', 'Customers answering a quiz "I prefer drinks with less sugar" in your app produce|||Khách trả lời quiz "Tôi thích đồ uống ít đường" trong app tạo ra',
    ['zero-party data|||dữ liệu zero-party', 'second-party data|||dữ liệu bên thứ hai', 'third-party data|||dữ liệu bên thứ ba', 'earned media|||earned media'], 0,
    'Zero-party data is information the customer intentionally shares.|||Zero-party là thông tin khách hàng chủ động chia sẻ.'),
  Q('q6', 'According to Google Analytics documentation, which three UTM parameters should always be used?|||Theo tài liệu Google Analytics, ba tham số UTM nào luôn nên dùng?',
    ['utm_term, utm_content, utm_id|||utm_term, utm_content, utm_id', 'utm_source, utm_medium, utm_campaign|||utm_source, utm_medium, utm_campaign', 'utm_source, utm_content, utm_term|||utm_source, utm_content, utm_term', 'utm_medium, utm_platform, utm_id|||utm_medium, utm_platform, utm_id'], 1,
    'Source, medium and campaign are the core three; utm_id and utm_source_platform are strongly recommended.|||Source, medium, campaign là ba tham số cốt lõi; utm_id và utm_source_platform được khuyến nghị thêm.'),
  Q('q7', 'A press article praising your brand, written by an independent journalist, is|||Một bài báo khen thương hiệu do nhà báo độc lập viết là',
    ['owned media|||owned media', 'paid media|||paid media', 'earned media|||earned media', 'first-party data|||dữ liệu bên thứ nhất'], 2,
    'You did not pay for it and do not control it — it was earned.|||Bạn không trả tiền và không kiểm soát — đó là earned.'),
  Q('q8', 'You left-join orders to a CRM table that still contains duplicated customers. The likely effect is|||Bạn left join đơn hàng với bảng CRM còn khách bị trùng. Hậu quả có thể là',
    ['fewer orders than before|||số đơn ít hơn trước', 'some orders appear more than once, inflating revenue|||một số đơn xuất hiện nhiều lần, thổi phồng doanh thu', 'pandas refuses to join|||pandas từ chối ghép', 'nothing changes|||không có gì thay đổi'], 1,
    'Each duplicate key matches the same order again.|||Mỗi khoá bị trùng lại khớp thêm một lần với cùng đơn.'),
  Q('q9', '"BINH@mail.com " and "binh@mail.com" fail to match because|||"BINH@mail.com " và "binh@mail.com" không khớp vì',
    ['emails cannot be keys|||email không thể làm khoá', 'capital letters and the trailing space make them different strings|||chữ hoa và dấu cách cuối làm chúng thành hai chuỗi khác nhau', 'the domain is different|||tên miền khác nhau', 'merge only works on numbers|||merge chỉ chạy với số'], 1,
    'Standardise keys with lower() and strip() before joining.|||Chuẩn hoá khoá bằng lower() và strip() trước khi ghép.'),
  Q('q10', 'Filling a missing "revenue" value with 0 is risky because|||Điền 0 vào ô "doanh thu" bị thiếu là rủi ro vì',
    ['pandas cannot store 0|||pandas không lưu được 0', 'it makes the table untidy|||làm bảng không còn tidy', '"unknown" is not the same as "zero", so averages and totals become biased|||"không biết" không giống "bằng 0", nên trung bình và tổng bị lệch', 'it deletes the row|||nó xoá dòng đó'], 2,
    'Missing should be marked as missing (or handled with a clear rule), not silently turned into 0.|||Thiếu nên được đánh dấu là thiếu (hoặc xử lý theo quy tắc rõ ràng), không âm thầm đổi thành 0.'),
]);

const ch1 = {
  title: 'Chapter 1 — Data basics and the communications data ecosystem|||Chương 1 — Nền tảng dữ liệu và hệ sinh thái dữ liệu truyền thông',
  description: 'Dữ liệu là gì, kiểu dữ liệu, bảng "tidy"; hệ sinh thái dữ liệu truyền thông (social, web analytics, CRM, quảng cáo; owned–paid–earned; dữ liệu bên thứ 1/2/3/zero-party; UTM); chất lượng dữ liệu và ghép nguồn bằng pandas.',
  lessons: [l1_1, l1_2, l1_3, q1],
};

const l2_1 = L('aba201c-ts-2-1',
  '2.1 — What makes data "big": the five Vs|||2.1 — Khi nào dữ liệu là "lớn": năm chữ V',
  'Volume, velocity, variety, veracity, value với ví dụ truyền thông; vì sao một triệu dòng đã làm Excel chật vật; thử nghiệm bộ nhớ với pandas (kiểu category).',
  `<span class="eyebrow">ABA201c · Chapter 2 · Lesson 2.1</span>
<h2>What makes data "big": the five Vs</h2>
<p class="lead">"Big data" is not a fixed number of rows. It is data that is too large, too fast or too messy for the usual tools — a spreadsheet on a laptop — to handle in time for the decision.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain the five Vs with communications examples.</li><li>Understand why scale changes the tools, not the questions.</li><li>See how data types affect memory with a one-million-row example.</li></ul>
<h3>📖 Lecture</h3>
<p>IBM's introduction to big data lists five characteristics, often called the <strong>five Vs</strong>:</p>
<div class="kv-grid">
<div class="kv"><span class="k">Volume</span><span class="v">The amount. A national FMCG brand's ad impressions, website events and app logs reach millions of rows a day.</span></div>
<div class="kv"><span class="k">Velocity</span><span class="v">The speed of arrival. Comments during a livestream or a product launch arrive every second; a crisis can grow within an hour.</span></div>
<div class="kv"><span class="k">Variety</span><span class="v">The formats: structured tables (orders), semi-structured JSON (API data), unstructured text, images and video (UGC, reviews).</span></div>
<div class="kv"><span class="k">Veracity</span><span class="v">Trustworthiness. Bot traffic, fake reviews, duplicated accounts and tracking gaps add noise.</span></div>
<div class="kv"><span class="k">Value</span><span class="v">The business benefit. Storing everything is pointless unless it improves a decision.</span></div>
</div>
<p>For communicators the most important V is often <strong>variety</strong>: most brand-relevant data — what people say, show and share — is unstructured. The most dangerous is <strong>veracity</strong>: a large dataset full of bots is not "more truthful" than a small clean survey. Size reduces random error, but it does <em>not</em> remove bias. If your social listening tool only collects public Facebook posts, a million posts still tell you nothing about people who discuss your brand in private Zalo groups.</p>
<h3>Why scale changes the tools</h3>
<p>Spreadsheets have hard row limits and slow down well before that. A laptop has limited memory (RAM). When data no longer fits, teams move to (1) more efficient formats on one machine, (2) databases and cloud data warehouses that query data where it lives, and (3) distributed processing across many machines (lesson 2.2). The <em>analytical questions</em> — which channel converts, which message resonates — stay the same.</p>
<h3>✍️ Worked example — one million impressions</h3>
<p>We simulate one million ad impressions with platform, device and whether the person clicked. Then we compare memory use when text columns are stored as plain strings versus as <strong>categories</strong> (pandas stores each distinct label once and uses small integer codes).</p>
<pre><code class="language-python">import numpy as np, pandas as pd

rng = np.random.default_rng(7)
n = 1_000_000  # one million synthetic ad impressions
df = pd.DataFrame({
    "platform": rng.choice(["Facebook", "TikTok", "YouTube", "Zalo"], size=n),
    "device":   rng.choice(["mobile", "desktop", "tablet"], size=n, p=[0.8, 0.15, 0.05]),
    "clicked":  rng.random(n) &lt; 0.012,
})
mb = lambda d: round(d.memory_usage(deep=True).sum() / 1024**2, 1)
print("rows:", len(df), "| memory as text:", mb(df), "MB")
df_cat = df.astype({"platform": "category", "device": "category"})
print("memory as category:", mb(df_cat), "MB")
print(df_cat.groupby("platform", observed=True)["clicked"].mean().round(4))
</code></pre>
<div class="out">rows: 1000000 | memory as text: 106.2 MB
memory as category: 2.9 MB
platform
Facebook    0.0120
TikTok      0.0123
YouTube     0.0120
Zalo        0.0122
Name: clicked, dtype: float64</div>
<p>The same information shrinks from about 106 MB to about 3 MB just by choosing the right type — an example of how engineering choices let ordinary machines handle larger data. The click rate per platform is around 1.2% everywhere because we generated it that way: with a million rows even tiny differences (0.0120 vs 0.0123) look precise, but they are just noise. <strong>Big data makes estimates precise; it does not make them meaningful.</strong></p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Assuming "more data = more truth" while the collection is biased.</li><li>Collecting everything "just in case" — it raises cost and privacy risk without value.</li><li>Calling any spreadsheet "big data". If Excel handles it comfortably, it is simply data.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Five Vs: volume, velocity, variety, veracity, value.</li><li>Variety (unstructured content) and veracity (bots, fakes) matter most in communications.</li><li>Scale changes the tools; it does not change the questions or remove bias.</li><li>Efficient data types and the right platform let you handle more with less.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.ibm.com/think/topics/big-data" target="_blank" rel="noopener">IBM — What is big data?</a></li><li><a href="https://cloud.google.com/learn/what-is-big-data" target="_blank" rel="noopener">Google Cloud — Big data defined: examples and benefits</a></li><li><a href="https://www.edx.org/learn/big-data" target="_blank" rel="noopener">edX — Big data courses</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Which V is the main challenge in each case? (a) a TV talent show's live comment stream, (b) 30% of a campaign's clicks come from bots, (c) reviews include text, photos and short videos.</li><li>A social tool collected 2 million posts about a bank, all from public pages. Can you conclude what "Vietnamese customers" think? Why?</li><li>Why did memory fall so much when <code>platform</code> became a category?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (a) velocity, (b) veracity, (c) variety. 2) No: the sample is large but not representative — private conversations and people who do not post publicly are missing; size does not fix selection bias. 3) There are only four distinct platform names; a category stores them once and keeps a 1-byte code per row instead of a full text string per row.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 2 · Bài 2.1</span>
<h2>Khi nào dữ liệu là "lớn": năm chữ V</h2>
<p class="lead">"Dữ liệu lớn" không phải là một số dòng cố định. Đó là dữ liệu quá nhiều, quá nhanh hoặc quá lộn xộn để công cụ thông thường — một bảng tính trên laptop — xử lý kịp cho quyết định.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích năm chữ V bằng ví dụ truyền thông.</li><li>Hiểu vì sao quy mô làm đổi công cụ, chứ không đổi câu hỏi.</li><li>Thấy kiểu dữ liệu ảnh hưởng đến bộ nhớ qua ví dụ một triệu dòng.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Bài giới thiệu dữ liệu lớn của IBM nêu năm đặc trưng, thường gọi là <strong>năm chữ V</strong>:</p>
<div class="kv-grid">
<div class="kv"><span class="k">Volume (khối lượng)</span><span class="v">Lượng dữ liệu. Lượt hiển thị quảng cáo, sự kiện website và log app của một nhãn hàng tiêu dùng toàn quốc lên tới hàng triệu dòng mỗi ngày.</span></div>
<div class="kv"><span class="k">Velocity (tốc độ)</span><span class="v">Tốc độ đổ về. Bình luận trong livestream hay buổi ra mắt sản phẩm đến từng giây; khủng hoảng có thể lớn lên trong một giờ.</span></div>
<div class="kv"><span class="k">Variety (đa dạng)</span><span class="v">Định dạng: bảng có cấu trúc (đơn hàng), JSON bán cấu trúc (dữ liệu API), văn bản, ảnh, video phi cấu trúc (UGC, đánh giá).</span></div>
<div class="kv"><span class="k">Veracity (độ tin cậy)</span><span class="v">Mức đáng tin. Lưu lượng bot, đánh giá giả, tài khoản trùng và lỗ hổng tracking tạo nhiễu.</span></div>
<div class="kv"><span class="k">Value (giá trị)</span><span class="v">Lợi ích kinh doanh. Lưu mọi thứ là vô ích nếu nó không giúp quyết định tốt hơn.</span></div>
</div>
<p>Với người làm truyền thông, chữ V quan trọng nhất thường là <strong>variety</strong>: phần lớn dữ liệu liên quan đến thương hiệu — điều người ta nói, cho xem và chia sẻ — là phi cấu trúc. Chữ V nguy hiểm nhất là <strong>veracity</strong>: một bộ dữ liệu khổng lồ đầy bot không "đúng hơn" một khảo sát nhỏ sạch sẽ. Cỡ lớn giảm sai số ngẫu nhiên nhưng <em>không</em> xoá được thiên lệch. Nếu công cụ social listening chỉ thu bài công khai trên Facebook, thì một triệu bài vẫn không nói gì về những người bàn về thương hiệu trong nhóm Zalo kín.</p>
<h3>Vì sao quy mô làm đổi công cụ</h3>
<p>Bảng tính có giới hạn số dòng cứng và chậm đi từ lâu trước giới hạn đó. Laptop có bộ nhớ (RAM) hữu hạn. Khi dữ liệu không còn vừa, các đội chuyển sang (1) định dạng hiệu quả hơn trên một máy, (2) cơ sở dữ liệu và kho dữ liệu đám mây truy vấn ngay tại chỗ dữ liệu nằm, và (3) xử lý phân tán trên nhiều máy (bài 2.2). Còn <em>câu hỏi phân tích</em> — kênh nào chuyển đổi, thông điệp nào chạm — vẫn y nguyên.</p>
<h3>✍️ Ví dụ — một triệu lượt hiển thị</h3>
<p>Ta giả lập một triệu lượt hiển thị quảng cáo gồm nền tảng, thiết bị và có click hay không. Rồi so bộ nhớ khi cột chữ lưu dạng chuỗi thường và dạng <strong>category</strong> (pandas lưu mỗi nhãn khác nhau một lần và dùng mã số nguyên nhỏ cho từng dòng).</p>
<pre><code class="language-python">import numpy as np, pandas as pd

rng = np.random.default_rng(7)
n = 1_000_000  # one million synthetic ad impressions
df = pd.DataFrame({
    "platform": rng.choice(["Facebook", "TikTok", "YouTube", "Zalo"], size=n),
    "device":   rng.choice(["mobile", "desktop", "tablet"], size=n, p=[0.8, 0.15, 0.05]),
    "clicked":  rng.random(n) &lt; 0.012,
})
mb = lambda d: round(d.memory_usage(deep=True).sum() / 1024**2, 1)
print("rows:", len(df), "| memory as text:", mb(df), "MB")
df_cat = df.astype({"platform": "category", "device": "category"})
print("memory as category:", mb(df_cat), "MB")
print(df_cat.groupby("platform", observed=True)["clicked"].mean().round(4))
</code></pre>
<div class="out">rows: 1000000 | memory as text: 106.2 MB
memory as category: 2.9 MB
platform
Facebook    0.0120
TikTok      0.0123
YouTube     0.0120
Zalo        0.0122
Name: clicked, dtype: float64</div>
<p>Cùng một thông tin mà co từ khoảng 106 MB xuống khoảng 3 MB chỉ nhờ chọn đúng kiểu — ví dụ cho thấy lựa chọn kỹ thuật giúp máy bình thường xử lý được dữ liệu lớn hơn. Tỷ lệ click mỗi nền tảng đều quanh 1,2% vì ta sinh dữ liệu như vậy: với một triệu dòng, chênh lệch nhỏ xíu (0,0120 so với 0,0123) trông rất "chính xác" nhưng chỉ là nhiễu. <strong>Dữ liệu lớn làm ước lượng chính xác hơn; không làm nó có ý nghĩa hơn.</strong></p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Cho rằng "nhiều dữ liệu = nhiều sự thật" trong khi cách thu thập bị lệch.</li><li>Thu mọi thứ "phòng khi cần" — tăng chi phí và rủi ro quyền riêng tư mà không thêm giá trị.</li><li>Gọi bảng tính nào cũng là "big data". Nếu Excel xử lý thoải mái, đó chỉ là dữ liệu.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Năm V: volume, velocity, variety, veracity, value.</li><li>Variety (nội dung phi cấu trúc) và veracity (bot, giả mạo) quan trọng nhất trong truyền thông.</li><li>Quy mô đổi công cụ; không đổi câu hỏi, không xoá thiên lệch.</li><li>Kiểu dữ liệu hiệu quả và nền tảng phù hợp giúp làm được nhiều hơn với ít tài nguyên hơn.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.ibm.com/think/topics/big-data" target="_blank" rel="noopener">IBM — Dữ liệu lớn là gì?</a></li><li><a href="https://cloud.google.com/learn/what-is-big-data" target="_blank" rel="noopener">Google Cloud — Định nghĩa dữ liệu lớn: ví dụ và lợi ích</a></li><li><a href="https://www.edx.org/learn/big-data" target="_blank" rel="noopener">edX — Các khoá học về dữ liệu lớn</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Chữ V nào là thách thức chính? (a) dòng bình luận trực tiếp của một gameshow truyền hình, (b) 30% click của chiến dịch đến từ bot, (c) đánh giá gồm chữ, ảnh và video ngắn.</li><li>Một công cụ thu 2 triệu bài về một ngân hàng, toàn từ trang công khai. Bạn có kết luận được "khách hàng Việt Nam" nghĩ gì không? Vì sao?</li><li>Vì sao bộ nhớ giảm mạnh khi <code>platform</code> chuyển thành category?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (a) velocity, (b) veracity, (c) variety. 2) Không: mẫu lớn nhưng không đại diện — thiếu các cuộc trò chuyện kín và những người không đăng công khai; cỡ mẫu không sửa được thiên lệch chọn mẫu. 3) Chỉ có bốn tên nền tảng khác nhau; category lưu chúng một lần và mỗi dòng chỉ giữ một mã 1 byte thay vì cả chuỗi chữ.</p></div>`);

const l2_2 = L('aba201c-ts-2-2',
  '2.2 — Storing and processing big data: warehouses, lakes, batch, streaming, distributed|||2.2 — Lưu và xử lý dữ liệu lớn: kho, hồ, theo lô, theo luồng, phân tán',
  'Data warehouse vs data lake, xử lý theo lô và theo luồng, ý tưởng MapReduce/Spark (chia việc cho nhiều máy rồi gộp kết quả) minh hoạ bằng đếm hashtag theo từng phần dữ liệu.',
  `<span class="eyebrow">ABA201c · Chapter 2 · Lesson 2.2</span>
<h2>Storing and processing big data</h2>
<p class="lead">You will rarely build these systems yourself, but you will work with the data teams who do. Knowing the vocabulary — warehouse, lake, batch, streaming, distributed — lets you ask for the right thing and understand why a report is "updated daily" rather than live.</p>
<h3>🎯 Objectives</h3>
<ul><li>Compare a data warehouse and a data lake.</li><li>Distinguish batch processing from stream processing with marketing use cases.</li><li>Explain the split–apply–combine idea behind MapReduce and Spark.</li></ul>
<h3>📖 Lecture</h3>
<h3>Where data lives</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Data warehouse</span><span class="v">Cleaned, structured tables organised for reporting (e.g. a "campaign_daily" table). Fast, reliable SQL queries; schema decided in advance.</span></div>
<div class="kv"><span class="k">Data lake</span><span class="v">Raw files of any format stored cheaply (JSON from APIs, images, logs). Flexible, but without governance it becomes a "data swamp".</span></div>
</div>
<p>Many companies combine both: raw data lands in the lake, and the parts needed for dashboards are cleaned into the warehouse. The steps that move and clean data are called <strong>ETL</strong> (extract, transform, load) or <strong>ELT</strong> (load first, transform inside the warehouse).</p>
<h3>When data is processed</h3>
<ul>
<li><strong>Batch</strong>: process a chunk on a schedule — last night's ad spend, the weekly brand-health report. Simple and cheap; the answer is hours old.</li>
<li><strong>Streaming</strong>: process events as they arrive — alert when negative mentions spike, update a "trending products" list, stop an ad that is over budget. Faster, but more complex and expensive.</li>
</ul>
<p>Ask: <em>how fast must the decision be?</em> A monthly brand report does not need streaming; crisis detection does.</p>
<h3>How very large data is processed: divide and combine</h3>
<p>When one machine is too small, the work is split across many. Google's MapReduce paper described the pattern: a <strong>map</strong> step runs on each piece of data where it is stored and produces small partial results; a <strong>reduce</strong> step combines them. Apache Spark, a widely used engine for large-scale analytics, generalises this idea. pandas' <code>groupby</code> is the same idea on one machine ("split–apply–combine").</p>
<h3>✍️ Worked example — counting hashtags in pieces</h3>
<p>Imagine three servers, each storing some posts. Instead of copying all posts to one machine, each server counts its own hashtags (map), and only the small counts travel to be added up (reduce).</p>
<pre><code class="language-python">from collections import Counter

# Imagine each chunk lives on a different machine
chunks = [
    ["#tet #sale", "#sale #freeship", "#tet"],
    ["#review #tet", "#sale", "#review #review"],
    ["#freeship #tet", "#tet #sale #review"],
]

def map_chunk(posts):              # runs where the data is
    c = Counter()
    for p in posts:
        c.update(p.split())
    return c

partials = [map_chunk(ch) for ch in chunks]
for i, p in enumerate(partials, 1):
    print("chunk", i, dict(p))

total = sum(partials, Counter())   # reduce: combine small results
print("TOTAL", total.most_common())
</code></pre>
<div class="out">chunk 1 {'#tet': 2, '#sale': 2, '#freeship': 1}
chunk 2 {'#review': 3, '#tet': 1, '#sale': 1}
chunk 3 {'#freeship': 1, '#tet': 2, '#sale': 1, '#review': 1}
TOTAL [('#tet', 5), ('#sale', 4), ('#review', 4), ('#freeship', 2)]</div>
<p>The total is exactly what we would get by counting all posts at once — but no machine ever had to hold all the data. This works because counting can be <em>added up</em>. Some statistics cannot be combined so simply: you cannot average three averages to get the overall average unless the chunks have equal size; you must carry sums and counts instead. That is a useful habit even in spreadsheets.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Asking for "real-time" dashboards when the decision is made weekly — it adds cost and complexity.</li><li>Dumping everything into a lake without documentation, so nobody knows what a file means.</li><li>Averaging averages from different-sized groups (e.g. CTR of each campaign) instead of dividing total clicks by total impressions.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Warehouse = clean, structured, for reporting; lake = raw, any format, flexible.</li><li>ETL/ELT moves and cleans data between them.</li><li>Batch for scheduled reports; streaming for alerts and live personalisation.</li><li>Distributed processing = map on each piece, reduce the partial results (MapReduce, Spark).</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://aws.amazon.com/what-is/data-warehouse/" target="_blank" rel="noopener">AWS — What is a data warehouse?</a></li><li><a href="https://aws.amazon.com/what-is/data-lake/" target="_blank" rel="noopener">AWS — What is a data lake?</a></li><li><a href="https://research.google/pubs/mapreduce-simplified-data-processing-on-large-clusters/" target="_blank" rel="noopener">Dean &amp; Ghemawat — MapReduce: Simplified Data Processing on Large Clusters (Google Research)</a></li><li><a href="https://spark.apache.org/docs/latest/quick-start.html" target="_blank" rel="noopener">Apache Spark — Quick start</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Batch or streaming? (a) weekly report of KOL campaign reach, (b) pausing ads automatically when a product is out of stock, (c) monthly NPS survey summary.</li><li>Three campaigns have CTR 1% (100,000 impressions), 2% (10,000) and 3% (10,000). Is the overall CTR 2%?</li><li>In the hashtag example, what travels over the network in the reduce step?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (a) batch, (b) streaming, (c) batch. 2) No. Clicks = 1,000 + 200 + 300 = 1,500 over 120,000 impressions = 1.25%. The simple mean of rates (2%) ignores size. 3) Only the small per-chunk counts (dictionaries of hashtag → number), not the posts themselves.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 2 · Bài 2.2</span>
<h2>Lưu và xử lý dữ liệu lớn</h2>
<p class="lead">Bạn hiếm khi tự xây những hệ thống này, nhưng bạn sẽ làm việc với đội dữ liệu xây chúng. Biết từ vựng — kho, hồ, theo lô, theo luồng, phân tán — giúp bạn yêu cầu đúng thứ và hiểu vì sao báo cáo "cập nhật hằng ngày" chứ không trực tiếp.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>So sánh kho dữ liệu (data warehouse) và hồ dữ liệu (data lake).</li><li>Phân biệt xử lý theo lô và theo luồng qua tình huống marketing.</li><li>Giải thích ý tưởng chia–xử lý–gộp đằng sau MapReduce và Spark.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Dữ liệu nằm ở đâu</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Data warehouse (kho)</span><span class="v">Bảng đã làm sạch, có cấu trúc, tổ chức để báo cáo (ví dụ bảng "campaign_daily"). Truy vấn SQL nhanh, ổn định; cấu trúc định sẵn.</span></div>
<div class="kv"><span class="k">Data lake (hồ)</span><span class="v">File thô mọi định dạng lưu giá rẻ (JSON từ API, ảnh, log). Linh hoạt, nhưng thiếu quản trị thì thành "đầm lầy dữ liệu".</span></div>
</div>
<p>Nhiều công ty dùng cả hai: dữ liệu thô đổ vào hồ, phần cần cho dashboard được làm sạch đưa vào kho. Các bước di chuyển và làm sạch gọi là <strong>ETL</strong> (trích xuất, biến đổi, nạp) hoặc <strong>ELT</strong> (nạp trước, biến đổi ngay trong kho).</p>
<h3>Dữ liệu được xử lý khi nào</h3>
<ul>
<li><strong>Theo lô (batch)</strong>: xử lý từng mẻ theo lịch — chi phí quảng cáo đêm qua, báo cáo sức khoẻ thương hiệu hằng tuần. Đơn giản, rẻ; câu trả lời đã cũ vài giờ.</li>
<li><strong>Theo luồng (streaming)</strong>: xử lý sự kiện ngay khi đến — cảnh báo khi lượt nhắc tiêu cực tăng vọt, cập nhật danh sách "sản phẩm đang hot", dừng quảng cáo vượt ngân sách. Nhanh hơn nhưng phức tạp và tốn hơn.</li>
</ul>
<p>Hãy hỏi: <em>quyết định cần nhanh cỡ nào?</em> Báo cáo thương hiệu hằng tháng không cần streaming; phát hiện khủng hoảng thì cần.</p>
<h3>Xử lý dữ liệu rất lớn: chia ra rồi gộp lại</h3>
<p>Khi một máy không đủ, việc được chia cho nhiều máy. Bài báo MapReduce của Google mô tả khuôn mẫu: bước <strong>map</strong> chạy trên từng phần dữ liệu ngay tại nơi lưu và tạo kết quả từng phần nhỏ; bước <strong>reduce</strong> gộp chúng lại. Apache Spark, một engine phân tích quy mô lớn được dùng rộng rãi, tổng quát hoá ý tưởng này. <code>groupby</code> của pandas chính là ý tưởng đó trên một máy ("split–apply–combine").</p>
<h3>✍️ Ví dụ — đếm hashtag theo từng phần</h3>
<p>Tưởng tượng ba máy chủ, mỗi máy giữ một số bài đăng. Thay vì chép hết bài về một máy, mỗi máy tự đếm hashtag của mình (map), chỉ có các con số nhỏ được gửi đi để cộng lại (reduce).</p>
<pre><code class="language-python">from collections import Counter

# Imagine each chunk lives on a different machine
chunks = [
    ["#tet #sale", "#sale #freeship", "#tet"],
    ["#review #tet", "#sale", "#review #review"],
    ["#freeship #tet", "#tet #sale #review"],
]

def map_chunk(posts):              # runs where the data is
    c = Counter()
    for p in posts:
        c.update(p.split())
    return c

partials = [map_chunk(ch) for ch in chunks]
for i, p in enumerate(partials, 1):
    print("chunk", i, dict(p))

total = sum(partials, Counter())   # reduce: combine small results
print("TOTAL", total.most_common())
</code></pre>
<div class="out">chunk 1 {'#tet': 2, '#sale': 2, '#freeship': 1}
chunk 2 {'#review': 3, '#tet': 1, '#sale': 1}
chunk 3 {'#freeship': 1, '#tet': 2, '#sale': 1, '#review': 1}
TOTAL [('#tet', 5), ('#sale', 4), ('#review', 4), ('#freeship', 2)]</div>
<p>Tổng đúng bằng kết quả đếm tất cả bài một lần — nhưng không máy nào phải giữ toàn bộ dữ liệu. Cách này chạy được vì phép đếm <em>cộng dồn được</em>. Có thống kê không gộp đơn giản như vậy: bạn không thể lấy trung bình của ba trung bình để ra trung bình chung, trừ khi các phần có cỡ bằng nhau; phải mang theo tổng và số lượng. Đó là thói quen hữu ích ngay cả trong bảng tính.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đòi dashboard "thời gian thực" khi quyết định chỉ đưa ra hằng tuần — thêm chi phí và độ phức tạp.</li><li>Đổ mọi thứ vào hồ mà không có tài liệu, nên không ai biết file nào nghĩa là gì.</li><li>Lấy trung bình các trung bình của nhóm khác cỡ (ví dụ CTR từng chiến dịch) thay vì lấy tổng click chia tổng hiển thị.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Kho = sạch, có cấu trúc, để báo cáo; hồ = thô, mọi định dạng, linh hoạt.</li><li>ETL/ELT di chuyển và làm sạch dữ liệu giữa chúng.</li><li>Theo lô cho báo cáo định kỳ; theo luồng cho cảnh báo và cá nhân hoá trực tiếp.</li><li>Xử lý phân tán = map trên từng phần, reduce các kết quả từng phần (MapReduce, Spark).</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://aws.amazon.com/what-is/data-warehouse/" target="_blank" rel="noopener">AWS — Data warehouse là gì?</a></li><li><a href="https://aws.amazon.com/what-is/data-lake/" target="_blank" rel="noopener">AWS — Data lake là gì?</a></li><li><a href="https://research.google/pubs/mapreduce-simplified-data-processing-on-large-clusters/" target="_blank" rel="noopener">Dean &amp; Ghemawat — MapReduce: Simplified Data Processing on Large Clusters (Google Research)</a></li><li><a href="https://spark.apache.org/docs/latest/quick-start.html" target="_blank" rel="noopener">Apache Spark — Bắt đầu nhanh</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Theo lô hay theo luồng? (a) báo cáo tuần về reach chiến dịch KOL, (b) tự động dừng quảng cáo khi sản phẩm hết hàng, (c) tổng kết khảo sát NPS hằng tháng.</li><li>Ba chiến dịch có CTR 1% (100.000 hiển thị), 2% (10.000) và 3% (10.000). CTR chung có phải 2%?</li><li>Trong ví dụ hashtag, thứ gì được gửi qua mạng ở bước reduce?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (a) theo lô, (b) theo luồng, (c) theo lô. 2) Không. Click = 1.000 + 200 + 300 = 1.500 trên 120.000 hiển thị = 1,25%. Trung bình cộng các tỷ lệ (2%) bỏ qua quy mô. 3) Chỉ các bảng đếm nhỏ của từng phần (hashtag → số lần), không phải bản thân các bài đăng.</p></div>`);

const l2_3 = L('aba201c-ts-2-3',
  '2.3 — From data to decisions: pipelines, analytics levels and team roles|||2.3 — Từ dữ liệu đến quyết định: đường ống dữ liệu, cấp độ phân tích và vai trò trong đội',
  'Bốn cấp độ phân tích (mô tả, chẩn đoán, dự đoán, đề xuất), đường ống ETL/ELT từ nguồn tới dashboard, vai trò data engineer / analyst / scientist / marketer và cách viết một yêu cầu phân tích tốt.',
  `<span class="eyebrow">ABA201c · Chapter 2 · Lesson 2.3</span>
<h2>From data to decisions</h2>
<p class="lead">Data has value only when it changes a decision. This lesson connects the technical pieces into one chain — from raw source to action — and shows where a communications professional adds the most value.</p>
<h3>🎯 Objectives</h3>
<ul><li>Describe the four levels of analytics with campaign examples.</li><li>Draw a simple data pipeline from sources to dashboard.</li><li>Know who does what in a data team and how to write a good analysis request.</li></ul>
<h3>📖 Lecture</h3>
<h3>Four levels of analytics</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Descriptive — what happened?</span><span class="v">"Campaign A reached 1.2 million people, CTR 0.9%." (Chapter 3)</span></div>
<div class="kv"><span class="k">Diagnostic — why did it happen?</span><span class="v">"CTR dropped because the video creative fatigued after day 10 in the 25–34 group."</span></div>
<div class="kv"><span class="k">Predictive — what will happen?</span><span class="v">"These 5,000 members have a high probability of not renewing." (Chapter 7)</span></div>
<div class="kv"><span class="k">Prescriptive — what should we do?</span><span class="v">"Send the win-back offer to the top 20% risk group; skip the rest." Often validated with an experiment (Chapter 8).</span></div>
</div>
<p>Each level needs the previous one: you cannot predict well if you cannot describe correctly. Many organisations get most of their value from simply doing descriptive and diagnostic analytics <em>reliably</em>.</p>
<h3>A simple pipeline</h3>
<ol>
<li><strong>Sources</strong>: Meta Ads, Google Ads, TikTok Ads, GA4, CRM, social listening tool.</li>
<li><strong>Extract</strong>: connectors or exports pull the data daily.</li>
<li><strong>Transform</strong>: clean names, convert currencies, join on campaign ID and date, compute KPIs.</li>
<li><strong>Load / store</strong>: a warehouse table such as <code>campaign_daily(date, channel, campaign, spend, impressions, clicks, orders, revenue)</code>.</li>
<li><strong>Use</strong>: dashboards (Chapter 11), models (Chapters 6–7), experiments (Chapter 8).</li>
<li><strong>Decide and act</strong>: move budget, change creative, pause a message — then measure again.</li>
</ol>
<p>The loop matters: insight → action → new data → new insight. A dashboard nobody acts on is a cost centre.</p>
<h3>Who does what</h3>
<ul>
<li><strong>Data engineer</strong>: builds and maintains the pipeline and the warehouse.</li>
<li><strong>Data analyst</strong>: answers business questions with queries, statistics and dashboards.</li>
<li><strong>Data scientist / ML engineer</strong>: builds predictive models, recommendation, NLP.</li>
<li><strong>Marketer / communicator (you)</strong>: owns the business question, the context, the creative interpretation and the decision.</li>
</ul>
<h3>✍️ Worked example — writing a good analysis request</h3>
<div class="callout"><p><strong>Weak:</strong> "Can you pull all the TikTok data?"</p><p><strong>Strong:</strong> "<em>Decision:</em> whether to move 20% of next month's budget from Facebook to TikTok. <em>Question:</em> for the last 8 weeks, what was cost per order and repeat-purchase rate by channel for first-time buyers aged 18–24? <em>Definition:</em> order = paid order in CRM, attributed by UTM last click. <em>Deadline:</em> Friday, a one-page table is enough."</p></div>
<p>The strong version names the decision, the metric, the population, the time window, the definition and the format. It saves days of back-and-forth and prevents the analyst from answering a different question.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Jumping to predictive "AI" before basic tracking and descriptive reporting are trustworthy.</li><li>Requests without a decision attached ("just curious").</li><li>Different teams using different definitions of the same KPI (what counts as a "lead"?).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Descriptive → diagnostic → predictive → prescriptive.</li><li>Pipeline: sources → extract → transform → store → use → decide → measure again.</li><li>Engineers build, analysts explain, scientists model, communicators decide.</li><li>A good request states decision, question, definition, population, window, format.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://aws.amazon.com/what-is/data-analytics/" target="_blank" rel="noopener">AWS — What is data analytics? (types of analytics)</a></li><li><a href="https://www.ibm.com/think/topics/etl" target="_blank" rel="noopener">IBM — What is ETL?</a></li><li><a href="https://www.ibm.com/think/topics/predictive-analytics" target="_blank" rel="noopener">IBM — What is predictive analytics?</a></li><li><a href="https://www.coursera.org/learn/foundations-data" target="_blank" rel="noopener">Google — Foundations: Data, Data, Everywhere (Coursera)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Classify: (a) "Which hours had the most comments last month?" (b) "Which customers will open next week's email?" (c) "Why did returns rise in October?"</li><li>Rewrite this request to be useful: "Send me the KOL numbers."</li><li>Name one decision that a weekly batch dashboard supports and one that needs streaming.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (a) descriptive, (b) predictive, (c) diagnostic. 2) e.g. "Decision: renew contracts with 3 of 8 KOLs. For each KOL in Q3, give reach, engagement rate, clicks with the KOL's UTM and orders, cost per order; include the definition of 'order'. One table by Monday." 3) Weekly: reallocating budget between channels. Streaming: alerting the team when negative mentions spike during a launch.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 2 · Bài 2.3</span>
<h2>Từ dữ liệu đến quyết định</h2>
<p class="lead">Dữ liệu chỉ có giá trị khi nó thay đổi một quyết định. Bài này nối các mảnh kỹ thuật thành một chuỗi — từ nguồn thô đến hành động — và chỉ ra người làm truyền thông tạo nhiều giá trị nhất ở đâu.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mô tả bốn cấp độ phân tích qua ví dụ chiến dịch.</li><li>Vẽ một đường ống dữ liệu đơn giản từ nguồn tới dashboard.</li><li>Biết ai làm gì trong đội dữ liệu và cách viết một yêu cầu phân tích tốt.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Bốn cấp độ phân tích</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Mô tả — chuyện gì đã xảy ra?</span><span class="v">"Chiến dịch A tiếp cận 1,2 triệu người, CTR 0,9%." (Chương 3)</span></div>
<div class="kv"><span class="k">Chẩn đoán — vì sao?</span><span class="v">"CTR giảm vì mẫu video bị nhàm sau ngày thứ 10 ở nhóm 25–34."</span></div>
<div class="kv"><span class="k">Dự đoán — sẽ xảy ra gì?</span><span class="v">"5.000 hội viên này có xác suất cao không gia hạn." (Chương 7)</span></div>
<div class="kv"><span class="k">Đề xuất — nên làm gì?</span><span class="v">"Gửi ưu đãi kéo lại cho 20% nhóm rủi ro cao nhất; bỏ qua phần còn lại." Thường được kiểm chứng bằng thử nghiệm (Chương 8).</span></div>
</div>
<p>Mỗi cấp cần cấp trước: không mô tả đúng thì không dự đoán tốt được. Nhiều tổ chức thu phần lớn giá trị chỉ từ việc làm phân tích mô tả và chẩn đoán một cách <em>đáng tin cậy</em>.</p>
<h3>Một đường ống đơn giản</h3>
<ol>
<li><strong>Nguồn</strong>: Meta Ads, Google Ads, TikTok Ads, GA4, CRM, công cụ social listening.</li>
<li><strong>Trích xuất</strong>: connector hoặc file xuất kéo dữ liệu hằng ngày.</li>
<li><strong>Biến đổi</strong>: chuẩn hoá tên, quy đổi tiền tệ, ghép theo mã chiến dịch và ngày, tính KPI.</li>
<li><strong>Nạp / lưu</strong>: một bảng trong kho như <code>campaign_daily(date, channel, campaign, spend, impressions, clicks, orders, revenue)</code>.</li>
<li><strong>Sử dụng</strong>: dashboard (Chương 11), mô hình (Chương 6–7), thử nghiệm (Chương 8).</li>
<li><strong>Quyết định và hành động</strong>: dời ngân sách, đổi creative, dừng một thông điệp — rồi đo lại.</li>
</ol>
<p>Vòng lặp mới là điều quan trọng: insight → hành động → dữ liệu mới → insight mới. Dashboard không ai hành động theo chỉ là một khoản chi phí.</p>
<h3>Ai làm gì</h3>
<ul>
<li><strong>Data engineer</strong>: xây và duy trì đường ống, kho dữ liệu.</li>
<li><strong>Data analyst</strong>: trả lời câu hỏi kinh doanh bằng truy vấn, thống kê và dashboard.</li>
<li><strong>Data scientist / ML engineer</strong>: xây mô hình dự đoán, hệ gợi ý, NLP.</li>
<li><strong>Marketer / người làm truyền thông (bạn)</strong>: nắm câu hỏi kinh doanh, bối cảnh, cách diễn giải sáng tạo và quyết định.</li>
</ul>
<h3>✍️ Ví dụ — viết một yêu cầu phân tích tốt</h3>
<div class="callout"><p><strong>Yếu:</strong> "Kéo giúp mình toàn bộ dữ liệu TikTok nhé?"</p><p><strong>Mạnh:</strong> "<em>Quyết định:</em> có chuyển 20% ngân sách tháng sau từ Facebook sang TikTok không. <em>Câu hỏi:</em> trong 8 tuần qua, chi phí mỗi đơn và tỷ lệ mua lại theo kênh của khách mua lần đầu 18–24 tuổi là bao nhiêu? <em>Định nghĩa:</em> đơn = đơn đã thanh toán trong CRM, phân bổ theo UTM click cuối. <em>Hạn:</em> thứ Sáu, một bảng một trang là đủ."</p></div>
<p>Bản mạnh nêu rõ quyết định, chỉ số, tập đối tượng, khung thời gian, định nghĩa và hình thức. Nó tiết kiệm nhiều ngày qua lại và tránh việc analyst trả lời một câu hỏi khác.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nhảy sang "AI" dự đoán khi tracking cơ bản và báo cáo mô tả còn chưa đáng tin.</li><li>Yêu cầu không gắn với quyết định nào ("tò mò thôi").</li><li>Các đội dùng định nghĩa khác nhau cho cùng một KPI (thế nào là một "lead"?).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Mô tả → chẩn đoán → dự đoán → đề xuất.</li><li>Đường ống: nguồn → trích xuất → biến đổi → lưu → dùng → quyết định → đo lại.</li><li>Engineer xây, analyst giải thích, scientist mô hình hoá, người làm truyền thông quyết định.</li><li>Yêu cầu tốt nêu quyết định, câu hỏi, định nghĩa, đối tượng, khung thời gian, hình thức.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://aws.amazon.com/what-is/data-analytics/" target="_blank" rel="noopener">AWS — Phân tích dữ liệu là gì? (các loại phân tích)</a></li><li><a href="https://www.ibm.com/think/topics/etl" target="_blank" rel="noopener">IBM — ETL là gì?</a></li><li><a href="https://www.ibm.com/think/topics/predictive-analytics" target="_blank" rel="noopener">IBM — Phân tích dự đoán là gì?</a></li><li><a href="https://www.coursera.org/learn/foundations-data" target="_blank" rel="noopener">Google — Foundations: Data, Data, Everywhere (Coursera)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Phân loại: (a) "Khung giờ nào nhiều bình luận nhất tháng trước?" (b) "Khách nào sẽ mở email tuần sau?" (c) "Vì sao tỷ lệ trả hàng tăng trong tháng 10?"</li><li>Viết lại yêu cầu này cho hữu ích: "Gửi mình số liệu KOL."</li><li>Nêu một quyết định mà dashboard theo lô hằng tuần hỗ trợ và một quyết định cần streaming.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (a) mô tả, (b) dự đoán, (c) chẩn đoán. 2) Ví dụ: "Quyết định: gia hạn hợp đồng với 3 trong 8 KOL. Với từng KOL trong quý 3, cho reach, tỷ lệ tương tác, click qua UTM riêng của KOL, số đơn, chi phí mỗi đơn; kèm định nghĩa 'đơn'. Một bảng trước thứ Hai." 3) Hằng tuần: phân bổ lại ngân sách giữa các kênh. Streaming: báo động cho đội khi lượt nhắc tiêu cực tăng vọt trong buổi ra mắt.</p></div>`);

const q2 = QZ(2, 'Chapter 2 quiz — Big data concepts|||Quiz Chương 2 — Các khái niệm dữ liệu lớn', '10 câu ôn 5V, kho vs hồ dữ liệu, theo lô vs theo luồng, MapReduce, ETL và bốn cấp độ phân tích.', [
  Q('q1', 'Fake reviews and bot clicks mainly threaten which V?|||Đánh giá giả và click của bot đe doạ chủ yếu chữ V nào?',
    ['Volume|||Volume', 'Velocity|||Velocity', 'Veracity|||Veracity', 'Variety|||Variety'], 2,
    'Veracity is about how trustworthy the data is.|||Veracity nói về độ đáng tin của dữ liệu.'),
  Q('q2', 'A social tool collects 3 million public posts. Which statement is correct?|||Một công cụ thu 3 triệu bài đăng công khai. Phát biểu nào đúng?',
    ['It is representative of all customers because it is large|||Nó đại diện mọi khách hàng vì rất lớn', 'Its size reduces random error but not selection bias|||Cỡ lớn giảm sai số ngẫu nhiên nhưng không giảm thiên lệch chọn mẫu', 'It contains no bias because it is automatic|||Không có thiên lệch vì tự động', 'It must be analysed with streaming|||Bắt buộc phân tích theo luồng'], 1,
    'People who do not post publicly are missing, however many posts are collected.|||Người không đăng công khai vẫn vắng mặt, dù thu bao nhiêu bài.'),
  Q('q3', 'Raw API JSON files, images and logs stored cheaply in any format describe a|||File JSON thô từ API, ảnh và log lưu giá rẻ, mọi định dạng mô tả một',
    ['data warehouse|||kho dữ liệu', 'data lake|||hồ dữ liệu', 'dashboard|||dashboard', 'CRM|||CRM'], 1,
    'A lake keeps raw data; a warehouse keeps cleaned, structured tables for reporting.|||Hồ giữ dữ liệu thô; kho giữ bảng sạch, có cấu trúc để báo cáo.'),
  Q('q4', 'Automatically pausing an ad when stock runs out is best served by|||Tự động dừng quảng cáo khi hết hàng phù hợp nhất với',
    ['monthly batch processing|||xử lý theo lô hằng tháng', 'stream processing|||xử lý theo luồng', 'a printed report|||báo cáo in giấy', 'a survey|||khảo sát'], 1,
    'The decision must react within minutes, so events are processed as they arrive.|||Quyết định phải phản ứng trong vài phút, nên sự kiện được xử lý ngay khi đến.'),
  Q('q5', 'In MapReduce, the "map" step|||Trong MapReduce, bước "map"',
    ['combines all partial results|||gộp mọi kết quả từng phần', 'runs on each piece of data and produces small partial results|||chạy trên từng phần dữ liệu và tạo kết quả từng phần nhỏ', 'draws the dashboard|||vẽ dashboard', 'deletes duplicates|||xoá bản trùng'], 1,
    'Reduce then combines the partial results.|||Sau đó reduce gộp các kết quả từng phần.'),
  Q('q6', 'Campaign X: 1,000 clicks / 100,000 impressions; campaign Y: 300 clicks / 10,000 impressions. Overall CTR =|||Chiến dịch X: 1.000 click / 100.000 hiển thị; Y: 300 click / 10.000 hiển thị. CTR chung =',
    ['2.0%|||2,0%', 'about 1.18%|||khoảng 1,18%', '3.0%|||3,0%', '1.0%|||1,0%'], 1,
    '1,300 / 110,000 ≈ 1.18%; averaging the two rates (1% and 3%) would wrongly give 2%.|||1.300 / 110.000 ≈ 1,18%; lấy trung bình hai tỷ lệ (1% và 3%) sẽ sai thành 2%.'),
  Q('q7', '"Which members are likely to cancel next month?" is|||"Hội viên nào có khả năng huỷ tháng sau?" là phân tích',
    ['descriptive|||mô tả', 'diagnostic|||chẩn đoán', 'predictive|||dự đoán', 'prescriptive|||đề xuất'], 2,
    'It asks about the future for individual members.|||Nó hỏi về tương lai của từng hội viên.'),
  Q('q8', 'The "T" in ETL stands for the step that|||Chữ "T" trong ETL là bước',
    ['transfers files to the client|||chuyển file cho khách hàng', 'transforms data: cleans, converts, joins, computes|||biến đổi dữ liệu: làm sạch, quy đổi, ghép, tính toán', 'tests the dashboard|||kiểm thử dashboard', 'tracks users|||theo dõi người dùng'], 1,
    'Extract, Transform, Load.|||Extract (trích xuất), Transform (biến đổi), Load (nạp).'),
  Q('q9', 'Storing a column with only four distinct platform names as a pandas category mainly|||Lưu cột chỉ có bốn tên nền tảng dưới dạng category của pandas chủ yếu',
    ['changes the click rate|||làm đổi tỷ lệ click', 'reduces memory use|||giảm bộ nhớ dùng', 'removes bias|||xoá thiên lệch', 'deletes rows|||xoá dòng'], 1,
    'Each label is stored once; rows keep small integer codes.|||Mỗi nhãn lưu một lần; các dòng chỉ giữ mã số nhỏ.'),
  Q('q10', 'Which element is MOST important in an analysis request from a marketer?|||Yếu tố nào QUAN TRỌNG NHẤT trong yêu cầu phân tích của marketer?',
    ['The chart colours|||Màu biểu đồ', 'The decision the analysis should support|||Quyết định mà phân tích cần hỗ trợ', 'The number of rows|||Số dòng dữ liệu', 'The software version|||Phiên bản phần mềm'], 1,
    'Knowing the decision tells the analyst which metric, population and time window matter.|||Biết quyết định giúp analyst chọn đúng chỉ số, đối tượng và khung thời gian.'),
]);

const ch2 = {
  title: 'Chapter 2 — Big data concepts|||Chương 2 — Các khái niệm dữ liệu lớn',
  description: 'Dữ liệu "lớn" nghĩa là gì (5V: volume, velocity, variety, veracity, value), kho dữ liệu vs hồ dữ liệu, xử lý theo lô vs luồng, tính toán phân tán (ý tưởng MapReduce/Spark), chuỗi ETL/ELT và bốn cấp độ phân tích.',
  lessons: [l2_1, l2_2, l2_3, q2],
};

const l3_1 = L('aba201c-ts-3-1',
  '3.1 — The marketing funnel and campaign KPI formulas|||3.1 — Phễu marketing và công thức KPI chiến dịch',
  'Từ hiển thị tới doanh thu: reach, impressions, frequency, CTR, CVR, CPC, CPM, CPA, ROAS; tính bảng KPI theo kênh bằng pandas và đọc đúng ý nghĩa từng chỉ số.',
  `<span class="eyebrow">ABA201c · Chapter 3 · Lesson 3.1</span>
<h2>The funnel and campaign KPI formulas</h2>
<p class="lead">A campaign report is a stack of ratios. Each ratio answers one question about one step of the funnel. Learn the formulas once, and every platform's dashboard becomes readable.</p>
<h3>🎯 Objectives</h3>
<ul><li>Place each KPI on the funnel: exposure → attention → action → value.</li><li>Compute CTR, CVR, CPC, CPM, CPA and ROAS from raw counts.</li><li>Explain why the "cheapest" channel on one KPI may be the worst on another.</li></ul>
<h3>📖 Lecture</h3>
<p>A simple funnel: people are <strong>exposed</strong> (impressions, reach), some <strong>pay attention and click</strong>, some <strong>convert</strong> (buy, sign up), and conversions produce <strong>value</strong> (revenue).</p>
<div class="formula"><span class="lbl">Exposure</span>Impressions = number of times the ad was shown · Reach = number of distinct people · Frequency = Impressions ÷ Reach</div>
<div class="formula"><span class="lbl">Attention</span>CTR (click-through rate) = Clicks ÷ Impressions × 100% · Engagement rate = Interactions ÷ Reach (or ÷ Impressions — always state which)</div>
<div class="formula"><span class="lbl">Action</span>CVR (conversion rate) = Conversions ÷ Clicks × 100%</div>
<div class="formula"><span class="lbl">Cost</span>CPM = Spend ÷ Impressions × 1,000 · CPC = Spend ÷ Clicks · CPA (cost per acquisition) = Spend ÷ Conversions</div>
<div class="formula"><span class="lbl">Value</span>ROAS (return on ad spend) = Revenue from ads ÷ Ad spend</div>
<p>Google Ads Help defines CTR as clicks divided by impressions and CPM as cost per thousand impressions — the same formulas apply on Meta, TikTok and others, although each platform counts "a click" or "a conversion" slightly differently.</p>
<h3>✍️ Worked example — one campaign, four channels</h3>
<p>A skincare brand ran a two-week launch. We compute every KPI from raw counts (spend and revenue in VND):</p>
<pre><code class="language-python">import pandas as pd

c = pd.DataFrame({
    "channel":     ["Facebook Ads", "TikTok Ads", "Google Search", "Email"],
    "spend":       [20_000_000, 15_000_000, 12_000_000, 2_000_000],   # VND
    "impressions": [1_600_000, 2_500_000, 300_000, 40_000],
    "clicks":      [16_000, 20_000, 9_000, 2_400],
    "orders":      [320, 260, 450, 120],
    "revenue":     [96_000_000, 52_000_000, 135_000_000, 30_000_000],
})
c["CTR_%"] = (c.clicks / c.impressions * 100).round(2)
c["CVR_%"] = (c.orders / c.clicks * 100).round(2)
c["CPC"]   = (c.spend / c.clicks).round(0)
c["CPM"]   = (c.spend / c.impressions * 1000).round(0)
c["CPA"]   = (c.spend / c.orders).round(0)
c["ROAS"]  = (c.revenue / c.spend).round(2)
pd.set_option("display.width", 120)
print(c[["channel", "CTR_%", "CVR_%", "CPC", "CPM", "CPA", "ROAS"]].to_string(index=False))
</code></pre>
<div class="out">      channel  CTR_%  CVR_%    CPC     CPM     CPA  ROAS
 Facebook Ads    1.0    2.0 1250.0 12500.0 62500.0  4.80
   TikTok Ads    0.8    1.3  750.0  6000.0 57692.0  3.47
Google Search    3.0    5.0 1333.0 40000.0 26667.0 11.25
        Email    6.0    5.0  833.0 50000.0 16667.0 15.00</div>
<p><strong>Reading the table.</strong></p>
<ul>
<li><strong>TikTok has the lowest CPM and CPC</strong> — attention is cheap there — but the lowest CVR, so its CPA is not much better than Facebook's and its ROAS is the lowest (3.47).</li>
<li><strong>Google Search has an expensive CPM</strong> (people searching are high-intent), yet the best paid CPA and a ROAS of 11.25.</li>
<li><strong>Email</strong> looks best of all (ROAS 15) — but it only reaches existing subscribers; it cannot replace acquisition channels. Small spend also makes ROAS unstable.</li>
</ul>
<p>The lesson: no single KPI ranks channels. Upper-funnel channels (TikTok, YouTube) often build awareness that search later "harvests". That is the <strong>attribution</strong> problem: last-click reports give all credit to the final step. Experiments (Chapter 8) are the honest way to measure what a channel really adds.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Dividing conversions by impressions and calling it CVR (CVR is per click unless stated).</li><li>Comparing ROAS between channels with very different roles in the funnel.</li><li>Using revenue to compute ROAS but ignoring product cost and returns — ROAS 3 can still lose money.</li><li>Reporting reach summed across platforms — the same person counted on Facebook and TikTok is double-counted.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Exposure (impressions, reach, frequency) → attention (CTR, engagement) → action (CVR) → value (revenue).</li><li>Cost KPIs: CPM per 1,000 impressions, CPC per click, CPA per conversion.</li><li>ROAS = revenue ÷ spend, not profit.</li><li>Read KPIs together and in light of each channel's role.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://support.google.com/google-ads/answer/2615875" target="_blank" rel="noopener">Google Ads Help — Clickthrough rate (CTR)</a></li><li><a href="https://support.google.com/google-ads/answer/6310" target="_blank" rel="noopener">Google Ads Help — Cost-per-thousand impressions (CPM)</a></li><li><a href="https://support.google.com/google-ads/answer/2684489" target="_blank" rel="noopener">Google Ads Help — Conversion rate</a></li><li><a href="https://support.google.com/google-ads/answer/6268637" target="_blank" rel="noopener">Google Ads Help — About Target ROAS bidding</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>An ad got 250,000 impressions, 3,000 clicks and 90 orders for 9,000,000 VND spend; revenue 27,000,000 VND. Compute CTR, CVR, CPC, CPM, CPA, ROAS.</li><li>Reach 50,000 and impressions 200,000: what is the frequency, and why might it be a warning sign?</li><li>Product margin is 30% of the price. Is a ROAS of 2.5 profitable?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) CTR = 1.2%; CVR = 3%; CPC = 3,000 VND; CPM = 36,000 VND; CPA = 100,000 VND; ROAS = 3. 2) Frequency = 4: each person saw the ad four times on average; high frequency can cause creative fatigue and annoyance. 3) No: revenue 2.5 per 1 spent gives gross margin 0.75 per 1 spent — a loss of 0.25 before other costs. Break-even ROAS = 1 ÷ 0.30 ≈ 3.33.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 3 · Bài 3.1</span>
<h2>Phễu và công thức KPI chiến dịch</h2>
<p class="lead">Báo cáo chiến dịch là một chồng tỷ số. Mỗi tỷ số trả lời một câu hỏi về một bước của phễu. Học công thức một lần, dashboard của nền tảng nào cũng đọc được.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Đặt từng KPI vào phễu: tiếp xúc → chú ý → hành động → giá trị.</li><li>Tính CTR, CVR, CPC, CPM, CPA và ROAS từ số đếm thô.</li><li>Giải thích vì sao kênh "rẻ nhất" theo một KPI có thể tệ nhất theo KPI khác.</li></ul>
<h3>📖 Bài giảng</h3>
<p>Một phễu đơn giản: người ta <strong>tiếp xúc</strong> (hiển thị, reach), một số <strong>chú ý và click</strong>, một số <strong>chuyển đổi</strong> (mua, đăng ký), và chuyển đổi tạo ra <strong>giá trị</strong> (doanh thu).</p>
<div class="formula"><span class="lbl">Tiếp xúc</span>Impressions = số lần quảng cáo hiển thị · Reach = số người khác nhau · Frequency (tần suất) = Impressions ÷ Reach</div>
<div class="formula"><span class="lbl">Chú ý</span>CTR (tỷ lệ nhấp) = Click ÷ Impressions × 100% · Tỷ lệ tương tác = Tương tác ÷ Reach (hoặc ÷ Impressions — luôn ghi rõ)</div>
<div class="formula"><span class="lbl">Hành động</span>CVR (tỷ lệ chuyển đổi) = Chuyển đổi ÷ Click × 100%</div>
<div class="formula"><span class="lbl">Chi phí</span>CPM = Chi phí ÷ Impressions × 1.000 · CPC = Chi phí ÷ Click · CPA (chi phí mỗi chuyển đổi) = Chi phí ÷ Chuyển đổi</div>
<div class="formula"><span class="lbl">Giá trị</span>ROAS (doanh thu trên chi phí quảng cáo) = Doanh thu từ quảng cáo ÷ Chi phí quảng cáo</div>
<p>Google Ads Help định nghĩa CTR là số click chia số lượt hiển thị và CPM là chi phí mỗi nghìn lượt hiển thị — công thức tương tự trên Meta, TikTok…, dù mỗi nền tảng đếm "một click" hay "một chuyển đổi" hơi khác nhau.</p>
<h3>✍️ Ví dụ — một chiến dịch, bốn kênh</h3>
<p>Một thương hiệu chăm sóc da chạy chiến dịch ra mắt hai tuần. Ta tính mọi KPI từ số đếm thô (chi phí và doanh thu tính bằng VND):</p>
<pre><code class="language-python">import pandas as pd

c = pd.DataFrame({
    "channel":     ["Facebook Ads", "TikTok Ads", "Google Search", "Email"],
    "spend":       [20_000_000, 15_000_000, 12_000_000, 2_000_000],   # VND
    "impressions": [1_600_000, 2_500_000, 300_000, 40_000],
    "clicks":      [16_000, 20_000, 9_000, 2_400],
    "orders":      [320, 260, 450, 120],
    "revenue":     [96_000_000, 52_000_000, 135_000_000, 30_000_000],
})
c["CTR_%"] = (c.clicks / c.impressions * 100).round(2)
c["CVR_%"] = (c.orders / c.clicks * 100).round(2)
c["CPC"]   = (c.spend / c.clicks).round(0)
c["CPM"]   = (c.spend / c.impressions * 1000).round(0)
c["CPA"]   = (c.spend / c.orders).round(0)
c["ROAS"]  = (c.revenue / c.spend).round(2)
pd.set_option("display.width", 120)
print(c[["channel", "CTR_%", "CVR_%", "CPC", "CPM", "CPA", "ROAS"]].to_string(index=False))
</code></pre>
<div class="out">      channel  CTR_%  CVR_%    CPC     CPM     CPA  ROAS
 Facebook Ads    1.0    2.0 1250.0 12500.0 62500.0  4.80
   TikTok Ads    0.8    1.3  750.0  6000.0 57692.0  3.47
Google Search    3.0    5.0 1333.0 40000.0 26667.0 11.25
        Email    6.0    5.0  833.0 50000.0 16667.0 15.00</div>
<p><strong>Đọc bảng.</strong></p>
<ul>
<li><strong>TikTok có CPM và CPC thấp nhất</strong> — sự chú ý ở đó rẻ — nhưng CVR thấp nhất, nên CPA không tốt hơn Facebook bao nhiêu và ROAS thấp nhất (3,47).</li>
<li><strong>Google Search có CPM đắt</strong> (người đang tìm kiếm có ý định cao), nhưng CPA tốt nhất trong các kênh trả phí và ROAS 11,25.</li>
<li><strong>Email</strong> trông tốt nhất (ROAS 15) — nhưng chỉ chạm người đã đăng ký; không thay được kênh tìm khách mới. Chi phí nhỏ cũng khiến ROAS dễ dao động.</li>
</ul>
<p>Bài học: không KPI đơn lẻ nào xếp hạng được các kênh. Kênh đầu phễu (TikTok, YouTube) thường tạo nhận biết mà Search sau đó "thu hoạch". Đó là bài toán <strong>phân bổ (attribution)</strong>: báo cáo click cuối trao hết công cho bước cuối cùng. Thử nghiệm (Chương 8) là cách trung thực để đo một kênh thật sự đóng góp bao nhiêu.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Lấy chuyển đổi chia lượt hiển thị rồi gọi là CVR (CVR tính trên click nếu không nói khác).</li><li>So ROAS giữa các kênh có vai trò rất khác nhau trong phễu.</li><li>Tính ROAS bằng doanh thu mà quên giá vốn và hàng trả — ROAS 3 vẫn có thể lỗ.</li><li>Cộng reach của các nền tảng — cùng một người trên Facebook và TikTok bị đếm hai lần.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tiếp xúc (impressions, reach, frequency) → chú ý (CTR, tương tác) → hành động (CVR) → giá trị (doanh thu).</li><li>KPI chi phí: CPM mỗi 1.000 hiển thị, CPC mỗi click, CPA mỗi chuyển đổi.</li><li>ROAS = doanh thu ÷ chi phí, không phải lợi nhuận.</li><li>Đọc các KPI cùng nhau và theo vai trò của từng kênh.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://support.google.com/google-ads/answer/2615875" target="_blank" rel="noopener">Google Ads Help — Tỷ lệ nhấp (CTR)</a></li><li><a href="https://support.google.com/google-ads/answer/6310" target="_blank" rel="noopener">Google Ads Help — Chi phí mỗi nghìn lần hiển thị (CPM)</a></li><li><a href="https://support.google.com/google-ads/answer/2684489" target="_blank" rel="noopener">Google Ads Help — Tỷ lệ chuyển đổi</a></li><li><a href="https://support.google.com/google-ads/answer/6268637" target="_blank" rel="noopener">Google Ads Help — Đặt giá thầu ROAS mục tiêu</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Một quảng cáo có 250.000 hiển thị, 3.000 click và 90 đơn với chi phí 9.000.000 VND; doanh thu 27.000.000 VND. Tính CTR, CVR, CPC, CPM, CPA, ROAS.</li><li>Reach 50.000 và impressions 200.000: tần suất là bao nhiêu, vì sao đó có thể là dấu hiệu cảnh báo?</li><li>Biên lợi nhuận gộp là 30% giá bán. ROAS 2,5 có lãi không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) CTR = 1,2%; CVR = 3%; CPC = 3.000 VND; CPM = 36.000 VND; CPA = 100.000 VND; ROAS = 3. 2) Tần suất = 4: mỗi người thấy quảng cáo trung bình bốn lần; tần suất cao dễ gây nhàm creative và khó chịu. 3) Không: 1 đồng chi phí tạo 2,5 đồng doanh thu, tức 0,75 đồng lãi gộp — lỗ 0,25 đồng trước các chi phí khác. ROAS hoà vốn = 1 ÷ 0,30 ≈ 3,33.</p></div>`);

const l3_2 = L('aba201c-ts-3-2',
  '3.2 — Choosing the right KPIs: objectives, SMART targets and vanity metrics|||3.2 — Chọn đúng KPI: mục tiêu, chỉ tiêu SMART và vanity metric',
  'Đi từ mục tiêu kinh doanh tới mục tiêu truyền thông tới KPI; chỉ tiêu SMART; chỉ số dẫn dắt và chỉ số kết quả; vanity metric; bảng kế hoạch đo lường cho một chiến dịch thật.',
  `<span class="eyebrow">ABA201c · Chapter 3 · Lesson 3.2</span>
<h2>Choosing the right KPIs</h2>
<p class="lead">"What gets measured gets managed" — so measuring the wrong thing gets the wrong thing managed. A KPI is a promise about what success means, and it should be chosen before the campaign starts.</p>
<h3>🎯 Objectives</h3>
<ul><li>Translate a business objective into communication objectives and KPIs.</li><li>Write SMART targets.</li><li>Separate leading from lagging indicators, and actionable from vanity metrics.</li><li>Build a one-page measurement plan.</li></ul>
<h3>📖 Lecture</h3>
<h3>From objective to KPI</h3>
<p>Work top-down in three layers:</p>
<ol>
<li><strong>Business objective</strong> — what the organisation needs: "increase first-time student customers in Đà Nẵng".</li>
<li><strong>Communication objective</strong> — what the audience must think, feel or do: "make students aware of the new store and try one drink".</li>
<li><strong>KPIs</strong> — numbers that show progress: reach among 18–24 in Đà Nẵng, cost per voucher redeemed, share of redeemed vouchers by new customers.</li>
</ol>
<p>A <strong>KPI</strong> (key performance indicator) is a metric tied to an objective, with a target and an owner. Most metrics are not KPIs — they are diagnostics that help explain the KPI.</p>
<h3>SMART targets</h3>
<p>A target should be <strong>S</strong>pecific, <strong>M</strong>easurable, <strong>A</strong>chievable, <strong>R</strong>elevant and <strong>T</strong>ime-bound. "Increase engagement" fails all five. "Reach 150,000 people aged 18–24 in Đà Nẵng and get 1,500 vouchers redeemed by new customers between 10 and 30 November, at a cost per redemption under 40,000 VND" passes. Targets should come from history or benchmarks you can cite, not from wishes.</p>
<h3>Leading vs lagging</h3>
<ul>
<li><strong>Lagging</strong> indicators measure the final outcome but arrive late: revenue, retained customers, brand preference in a quarterly survey.</li>
<li><strong>Leading</strong> indicators move earlier and predict the outcome: add-to-cart rate, voucher saves, branded search volume, video completion rate.</li>
</ul>
<p>Use leading indicators to steer during the campaign, lagging ones to judge it afterwards.</p>
<h3>Vanity metrics</h3>
<p>A <strong>vanity metric</strong> looks impressive but does not inform a decision: total followers, total views without context, "impressions" from a bought placement. Test: <em>if this number doubled, what would we do differently?</em> If the answer is "nothing", it is vanity. Followers can become actionable when expressed as a rate tied to an objective (e.g. follower growth among the target segment per 1,000 VND spent).</p>
<h3>✍️ Worked example — a measurement plan</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Business objective</span><span class="v">+1,500 new student customers in November</span></div>
<div class="kv"><span class="k">Comms objective</span><span class="v">Awareness of the new store; trial with a voucher</span></div>
<div class="kv"><span class="k">Primary KPI</span><span class="v">Vouchers redeemed by new customers (target 1,500)</span></div>
<div class="kv"><span class="k">Efficiency KPI</span><span class="v">Cost per redemption (target ≤ 40,000 VND)</span></div>
<div class="kv"><span class="k">Leading indicators</span><span class="v">Reach in segment, CTR, voucher saves, store-direction clicks</span></div>
<div class="kv"><span class="k">Data sources</span><span class="v">Meta/TikTok Ads, voucher codes in POS, CRM "new customer" flag</span></div>
<div class="kv"><span class="k">Review rhythm</span><span class="v">Daily leading indicators; weekly KPI; final report 5 December</span></div>
</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Choosing KPIs after the campaign, from whatever looks good.</li><li>Too many KPIs — if everything is key, nothing is.</li><li>Targets without a baseline ("is 2% CTR good?" — compared with what?).</li><li>Measuring only what the platform reports, ignoring the business outcome (sales, retention).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Business objective → communication objective → KPI with target and owner.</li><li>SMART targets, based on baselines.</li><li>Leading indicators steer; lagging indicators judge.</li><li>Vanity metric test: would a change in it change a decision?</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://sproutsocial.com/insights/social-media-kpis/" target="_blank" rel="noopener">Sprout Social — Social media KPIs</a></li><li><a href="https://sproutsocial.com/insights/social-media-analytics/" target="_blank" rel="noopener">Sprout Social — Social media analytics: metrics, tools and ROI</a></li><li><a href="https://support.google.com/analytics/answer/9267735" target="_blank" rel="noopener">Google Analytics Help — Recommended events (what to track)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Rewrite as a SMART target: "Make our new podcast popular."</li><li>Leading or lagging? (a) quarterly brand-preference survey, (b) daily add-to-cart rate, (c) 90-day retention.</li><li>Is "total page likes" a good KPI for a campaign whose objective is app installs? Suggest a better one.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) e.g. "Reach 2,000 unique listeners aged 18–30 on Spotify and YouTube, with an average completion rate of at least 50%, across the first 8 episodes (by 31 January)." 2) (a) lagging, (b) leading, (c) lagging. 3) No — it is a vanity metric for this objective. Use cost per install and day-7 active users from installs.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 3 · Bài 3.2</span>
<h2>Chọn đúng KPI</h2>
<p class="lead">"Đo cái gì thì quản lý cái đó" — vì vậy đo sai thứ thì sẽ quản lý sai thứ. KPI là một lời cam kết về thế nào là thành công, và nên được chọn trước khi chiến dịch bắt đầu.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Chuyển mục tiêu kinh doanh thành mục tiêu truyền thông và KPI.</li><li>Viết chỉ tiêu SMART.</li><li>Phân biệt chỉ số dẫn dắt với chỉ số kết quả, chỉ số hành động được với vanity metric.</li><li>Lập kế hoạch đo lường một trang.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Từ mục tiêu đến KPI</h3>
<p>Đi từ trên xuống qua ba tầng:</p>
<ol>
<li><strong>Mục tiêu kinh doanh</strong> — tổ chức cần gì: "tăng số khách sinh viên mua lần đầu ở Đà Nẵng".</li>
<li><strong>Mục tiêu truyền thông</strong> — khán giả cần nghĩ, cảm, làm gì: "sinh viên biết cửa hàng mới và thử một món".</li>
<li><strong>KPI</strong> — con số cho thấy tiến độ: reach nhóm 18–24 ở Đà Nẵng, chi phí mỗi voucher được dùng, tỷ lệ voucher được khách mới dùng.</li>
</ol>
<p><strong>KPI</strong> (chỉ số hiệu suất chính) là chỉ số gắn với mục tiêu, có chỉ tiêu và người chịu trách nhiệm. Phần lớn các chỉ số không phải KPI — chúng là chỉ số chẩn đoán giúp giải thích KPI.</p>
<h3>Chỉ tiêu SMART</h3>
<p>Chỉ tiêu nên <strong>S</strong>pecific (cụ thể), <strong>M</strong>easurable (đo được), <strong>A</strong>chievable (khả thi), <strong>R</strong>elevant (liên quan) và <strong>T</strong>ime-bound (có thời hạn). "Tăng tương tác" trượt cả năm tiêu chí. "Tiếp cận 150.000 người 18–24 tuổi ở Đà Nẵng và có 1.500 voucher được khách mới sử dụng từ 10 đến 30/11, chi phí mỗi lượt dùng dưới 40.000 VND" thì đạt. Chỉ tiêu nên đến từ số liệu quá khứ hoặc benchmark có nguồn, không phải từ mong muốn.</p>
<h3>Dẫn dắt và kết quả</h3>
<ul>
<li>Chỉ số <strong>kết quả (lagging)</strong> đo kết cục cuối nhưng đến muộn: doanh thu, khách giữ chân, mức ưa thích thương hiệu trong khảo sát quý.</li>
<li>Chỉ số <strong>dẫn dắt (leading)</strong> chuyển động sớm hơn và báo trước kết cục: tỷ lệ thêm vào giỏ, lượt lưu voucher, lượng tìm kiếm tên thương hiệu, tỷ lệ xem hết video.</li>
</ul>
<p>Dùng chỉ số dẫn dắt để lái trong lúc chạy chiến dịch, chỉ số kết quả để đánh giá sau đó.</p>
<h3>Vanity metric</h3>
<p><strong>Vanity metric</strong> (chỉ số phù phiếm) trông ấn tượng nhưng không giúp quyết định: tổng số người theo dõi, tổng lượt xem không có bối cảnh, "lượt hiển thị" từ một vị trí mua sẵn. Phép thử: <em>nếu con số này tăng gấp đôi, ta sẽ làm gì khác đi?</em> Nếu câu trả lời là "không gì cả", đó là vanity. Người theo dõi có thể thành chỉ số hành động được khi viết dưới dạng tỷ lệ gắn với mục tiêu (ví dụ tăng người theo dõi trong phân khúc mục tiêu trên mỗi 1.000 VND chi ra).</p>
<h3>✍️ Ví dụ — kế hoạch đo lường</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Mục tiêu kinh doanh</span><span class="v">+1.500 khách sinh viên mới trong tháng 11</span></div>
<div class="kv"><span class="k">Mục tiêu truyền thông</span><span class="v">Biết cửa hàng mới; dùng thử bằng voucher</span></div>
<div class="kv"><span class="k">KPI chính</span><span class="v">Số voucher khách mới đã dùng (chỉ tiêu 1.500)</span></div>
<div class="kv"><span class="k">KPI hiệu quả</span><span class="v">Chi phí mỗi lượt dùng voucher (chỉ tiêu ≤ 40.000 VND)</span></div>
<div class="kv"><span class="k">Chỉ số dẫn dắt</span><span class="v">Reach trong phân khúc, CTR, lượt lưu voucher, click chỉ đường tới cửa hàng</span></div>
<div class="kv"><span class="k">Nguồn dữ liệu</span><span class="v">Meta/TikTok Ads, mã voucher trong POS, cờ "khách mới" trong CRM</span></div>
<div class="kv"><span class="k">Nhịp xem xét</span><span class="v">Chỉ số dẫn dắt hằng ngày; KPI hằng tuần; báo cáo cuối ngày 5/12</span></div>
</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chọn KPI sau khi chiến dịch xong, từ những gì trông đẹp.</li><li>Quá nhiều KPI — cái gì cũng "chính" thì không cái nào chính.</li><li>Chỉ tiêu không có mốc so sánh ("CTR 2% có tốt không?" — so với cái gì?).</li><li>Chỉ đo những gì nền tảng báo, bỏ qua kết quả kinh doanh (doanh số, giữ chân khách).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Mục tiêu kinh doanh → mục tiêu truyền thông → KPI có chỉ tiêu và người phụ trách.</li><li>Chỉ tiêu SMART, dựa trên mốc so sánh.</li><li>Chỉ số dẫn dắt để lái; chỉ số kết quả để đánh giá.</li><li>Phép thử vanity: con số đổi có làm quyết định đổi không?</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://sproutsocial.com/insights/social-media-kpis/" target="_blank" rel="noopener">Sprout Social — KPI mạng xã hội</a></li><li><a href="https://sproutsocial.com/insights/social-media-analytics/" target="_blank" rel="noopener">Sprout Social — Phân tích mạng xã hội: chỉ số, công cụ và ROI</a></li><li><a href="https://support.google.com/analytics/answer/9267735" target="_blank" rel="noopener">Google Analytics Help — Sự kiện được đề xuất (nên theo dõi gì)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết lại thành chỉ tiêu SMART: "Làm podcast mới của tụi mình nổi tiếng."</li><li>Dẫn dắt hay kết quả? (a) khảo sát mức ưa thích thương hiệu hằng quý, (b) tỷ lệ thêm vào giỏ hằng ngày, (c) tỷ lệ giữ chân 90 ngày.</li><li>"Tổng lượt thích trang" có phải KPI tốt cho chiến dịch mục tiêu là lượt cài app? Đề xuất KPI tốt hơn.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Ví dụ: "Đạt 2.000 người nghe khác nhau 18–30 tuổi trên Spotify và YouTube, tỷ lệ nghe hết trung bình tối thiểu 50%, qua 8 tập đầu (trước 31/1)." 2) (a) kết quả, (b) dẫn dắt, (c) kết quả. 3) Không — với mục tiêu này đó là vanity metric. Dùng chi phí mỗi lượt cài và số người dùng còn hoạt động ngày thứ 7 trong số người cài.</p></div>`);

const l3_3 = L('aba201c-ts-3-3',
  '3.3 — Honest descriptive statistics: averages, outliers and Simpson\'s paradox|||3.3 — Thống kê mô tả trung thực: trung bình, ngoại lai và nghịch lý Simpson',
  'Trung bình vs trung vị khi dữ liệu lệch, ngoại lai làm sai báo cáo, so sánh nhóm và nghịch lý Simpson (mẫu quảng cáo mới thắng ở từng nền tảng nhưng thua khi gộp) — có code pandas chạy thật.',
  `<span class="eyebrow">ABA201c · Chapter 3 · Lesson 3.3</span>
<h2>Honest descriptive statistics</h2>
<p class="lead">Descriptive statistics feel simple — an average here, a total there. Yet two classic traps, the skewed average and Simpson's paradox, regularly lead teams to reverse the truth.</p>
<h3>🎯 Objectives</h3>
<ul><li>Choose between mean and median for skewed marketing data.</li><li>Detect and handle outliers deliberately.</li><li>Recognise Simpson's paradox when comparing groups.</li></ul>
<h3>📖 Lecture</h3>
<h3>Mean vs median</h3>
<p>The <strong>mean</strong> (average) adds all values and divides by the count. The <strong>median</strong> is the middle value when sorted. Marketing data is often <strong>right-skewed</strong>: most order values, video views or post likes are small, and a few are huge. One viral post or one corporate order pulls the mean far above what is "typical"; the median barely moves. Report both when the distribution is skewed, and say which one your target refers to.</p>
<h3>Outliers</h3>
<p>An <strong>outlier</strong> is a value far from the rest. It can be an error (a price typed with three extra zeros), a different population (a B2B buyer in a B2C campaign) or a genuine success (a viral video). Never delete outliers silently: investigate, then decide — fix errors, analyse different populations separately, and keep genuine extremes but describe them separately.</p>
<h3>Comparing groups and Simpson's paradox</h3>
<p>When groups have different mixes, aggregate comparisons can mislead. <strong>Simpson's paradox</strong>: a trend that appears in every subgroup reverses when the subgroups are combined. It happens when a hidden variable (here: platform) affects both which group a case falls into and the outcome.</p>
<h3>✍️ Worked example</h3>
<pre><code class="language-python">import pandas as pd

# order value of 10 customers from one campaign (thousand VND)
orders = pd.Series([180, 210, 195, 220, 205, 190, 230, 200, 215, 4800])
print("mean  :", orders.mean())
print("median:", orders.median())
print("mean without the outlier:", orders[orders &lt; 1000].mean())
print()

# Simpson's paradox: new creative vs old creative, split by platform
d = pd.DataFrame({
    "creative": ["old", "old", "new", "new"],
    "platform": ["Facebook", "TikTok", "Facebook", "TikTok"],
    "clicks":   [800, 200, 200, 800],
    "orders":   [40, 2, 12, 10],
})
d["CVR_%"] = d.orders / d.clicks * 100
print(d)
tot = d.groupby("creative")[["clicks", "orders"]].sum()
tot["CVR_%"] = tot.orders / tot.clicks * 100
print(tot)
</code></pre>
<div class="out">mean  : 664.5
median: 207.5
mean without the outlier: 205.0

  creative  platform  clicks  orders  CVR_%
0      old  Facebook     800      40   5.00
1      old    TikTok     200       2   1.00
2      new  Facebook     200      12   6.00
3      new    TikTok     800      10   1.25
          clicks  orders  CVR_%
creative                       
new         1000      22    2.2
old         1000      42    4.2</div>
<p><strong>Part 1.</strong> Nine customers spent around 200 thousand VND; one spent 4.8 million. The mean (664.5) describes nobody; the median (207.5) describes the typical customer. If your KPI is "average order value", one corporate order can make a campaign look three times better than it is.</p>
<p><strong>Part 2.</strong> Look at each platform: the <em>new</em> creative converts better on Facebook (6% vs 5%) <em>and</em> on TikTok (1.25% vs 1%). Combined, the new creative looks worse (2.2% vs 4.2%). Why? The new creative was shown mostly on TikTok (800 of its 1,000 clicks), where everyone converts less. The aggregate compares platforms, not creatives. The fair comparison is within each platform — or, better, an experiment where each platform shows both creatives to random halves of the audience (Chapter 8).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Reporting only the mean of skewed metrics (views, order value, time on site).</li><li>Deleting "weird" data points without recording why.</li><li>Declaring a winner from aggregated numbers when the groups had different channel, audience or time mixes.</li><li>Comparing week 1 with week 2 when week 2 contained a public holiday.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Skewed data: report the median (and the mean), state which.</li><li>Outliers: investigate, then fix, separate or keep — never silently delete.</li><li>Simpson's paradox: subgroup trends can reverse when combined; compare like with like.</li><li>Randomised experiments remove hidden-mix problems.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/2-3-measures-of-the-location-of-the-data" target="_blank" rel="noopener">OpenStax — 2.3 Measures of the location of the data</a></li><li><a href="https://plato.stanford.edu/entries/paradox-simpson/" target="_blank" rel="noopener">Stanford Encyclopedia of Philosophy — Simpson's paradox</a></li><li><a href="https://pandas.pydata.org/docs/user_guide/groupby.html" target="_blank" rel="noopener">pandas — Group by: split-apply-combine</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Views of 7 videos: 1,200; 900; 1,500; 1,100; 1,000; 1,300; 95,000. Compute the median and say why the mean is misleading.</li><li>An order of 480,000,000 VND appears in a B2C campaign whose orders are usually under 1 million. List three possible explanations and what you would do.</li><li>In the Simpson example, if you could only report one number, what would you report?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Sorted: 900, 1,000, 1,100, 1,200, 1,300, 1,500, 95,000 → median 1,200. The mean (≈ 14,571) is dominated by one viral video. 2) Typo (extra zeros) → check POS and fix; a corporate/B2B buyer → analyse separately; fraud/test order → exclude with a note. 3) The within-platform comparison, e.g. "the new creative's CVR was higher on both platforms (+1.0 point on Facebook, +0.25 on TikTok)", plus a note that the overall rate is confounded by platform mix.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 3 · Bài 3.3</span>
<h2>Thống kê mô tả trung thực</h2>
<p class="lead">Thống kê mô tả có vẻ đơn giản — chỗ này trung bình, chỗ kia tổng. Vậy mà hai cái bẫy kinh điển, trung bình bị kéo lệch và nghịch lý Simpson, thường xuyên khiến các đội kết luận ngược sự thật.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Chọn giữa trung bình và trung vị với dữ liệu marketing bị lệch.</li><li>Phát hiện và xử lý ngoại lai có chủ đích.</li><li>Nhận ra nghịch lý Simpson khi so sánh các nhóm.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Trung bình và trung vị</h3>
<p><strong>Trung bình (mean)</strong> cộng mọi giá trị rồi chia cho số lượng. <strong>Trung vị (median)</strong> là giá trị đứng giữa khi sắp xếp. Dữ liệu marketing thường <strong>lệch phải</strong>: phần lớn giá trị đơn, lượt xem video hay lượt thích bài là nhỏ, một vài cái rất lớn. Một bài viral hay một đơn doanh nghiệp kéo trung bình lên xa so với mức "điển hình"; trung vị gần như không nhúc nhích. Khi phân phối lệch, hãy báo cả hai, và nói rõ chỉ tiêu của bạn dùng cái nào.</p>
<h3>Ngoại lai</h3>
<p><strong>Ngoại lai (outlier)</strong> là giá trị cách xa phần còn lại. Nó có thể là lỗi (giá gõ thừa ba số 0), một quần thể khác (người mua doanh nghiệp trong chiến dịch B2C) hoặc một thành công thật (video viral). Đừng bao giờ âm thầm xoá ngoại lai: hãy điều tra rồi quyết định — sửa lỗi, phân tích riêng quần thể khác, giữ các giá trị cực đoan thật nhưng mô tả riêng.</p>
<h3>So sánh nhóm và nghịch lý Simpson</h3>
<p>Khi các nhóm có cơ cấu khác nhau, so sánh gộp dễ đánh lừa. <strong>Nghịch lý Simpson</strong>: một xu hướng xuất hiện ở mọi nhóm con lại đảo chiều khi gộp các nhóm. Nó xảy ra khi một biến ẩn (ở đây: nền tảng) ảnh hưởng đồng thời tới việc trường hợp rơi vào nhóm nào và tới kết quả.</p>
<h3>✍️ Ví dụ</h3>
<pre><code class="language-python">import pandas as pd

# order value of 10 customers from one campaign (thousand VND)
orders = pd.Series([180, 210, 195, 220, 205, 190, 230, 200, 215, 4800])
print("mean  :", orders.mean())
print("median:", orders.median())
print("mean without the outlier:", orders[orders &lt; 1000].mean())
print()

# Simpson's paradox: new creative vs old creative, split by platform
d = pd.DataFrame({
    "creative": ["old", "old", "new", "new"],
    "platform": ["Facebook", "TikTok", "Facebook", "TikTok"],
    "clicks":   [800, 200, 200, 800],
    "orders":   [40, 2, 12, 10],
})
d["CVR_%"] = d.orders / d.clicks * 100
print(d)
tot = d.groupby("creative")[["clicks", "orders"]].sum()
tot["CVR_%"] = tot.orders / tot.clicks * 100
print(tot)
</code></pre>
<div class="out">mean  : 664.5
median: 207.5
mean without the outlier: 205.0

  creative  platform  clicks  orders  CVR_%
0      old  Facebook     800      40   5.00
1      old    TikTok     200       2   1.00
2      new  Facebook     200      12   6.00
3      new    TikTok     800      10   1.25
          clicks  orders  CVR_%
creative                       
new         1000      22    2.2
old         1000      42    4.2</div>
<p><strong>Phần 1.</strong> Chín khách chi khoảng 200 nghìn đồng; một khách chi 4,8 triệu. Trung bình (664,5) không mô tả ai cả; trung vị (207,5) mô tả khách điển hình. Nếu KPI là "giá trị đơn trung bình", một đơn doanh nghiệp có thể làm chiến dịch trông tốt gấp ba thực tế.</p>
<p><strong>Phần 2.</strong> Xét từng nền tảng: mẫu quảng cáo <em>mới</em> chuyển đổi tốt hơn trên Facebook (6% so với 5%) <em>và</em> trên TikTok (1,25% so với 1%). Gộp lại, mẫu mới trông tệ hơn (2,2% so với 4,2%). Vì sao? Mẫu mới được chiếu chủ yếu trên TikTok (800 trong 1.000 click của nó), nơi ai cũng chuyển đổi thấp hơn. Số gộp đang so các nền tảng chứ không phải so các mẫu quảng cáo. So sánh công bằng là trong từng nền tảng — hoặc tốt hơn, một thử nghiệm mà mỗi nền tảng chiếu cả hai mẫu cho hai nửa khán giả ngẫu nhiên (Chương 8).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chỉ báo trung bình của chỉ số lệch (lượt xem, giá trị đơn, thời gian trên trang).</li><li>Xoá các điểm "lạ" mà không ghi lại lý do.</li><li>Tuyên bố người thắng từ số gộp khi các nhóm có cơ cấu kênh, khán giả hay thời gian khác nhau.</li><li>So tuần 1 với tuần 2 khi tuần 2 có ngày lễ.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Dữ liệu lệch: báo trung vị (và trung bình), nói rõ dùng cái nào.</li><li>Ngoại lai: điều tra rồi sửa, tách riêng hoặc giữ — không âm thầm xoá.</li><li>Nghịch lý Simpson: xu hướng nhóm con có thể đảo khi gộp; hãy so cái tương đương với nhau.</li><li>Thử nghiệm ngẫu nhiên loại bỏ vấn đề cơ cấu ẩn.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/2-3-measures-of-the-location-of-the-data" target="_blank" rel="noopener">OpenStax — 2.3 Các thước đo vị trí của dữ liệu</a></li><li><a href="https://plato.stanford.edu/entries/paradox-simpson/" target="_blank" rel="noopener">Stanford Encyclopedia of Philosophy — Nghịch lý Simpson</a></li><li><a href="https://pandas.pydata.org/docs/user_guide/groupby.html" target="_blank" rel="noopener">pandas — Group by: chia–xử lý–gộp</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Lượt xem của 7 video: 1.200; 900; 1.500; 1.100; 1.000; 1.300; 95.000. Tính trung vị và giải thích vì sao trung bình gây hiểu lầm.</li><li>Một đơn 480.000.000 VND xuất hiện trong chiến dịch B2C mà đơn thường dưới 1 triệu. Nêu ba khả năng và bạn sẽ làm gì.</li><li>Trong ví dụ Simpson, nếu chỉ được báo một con số, bạn sẽ báo gì?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Sắp xếp: 900, 1.000, 1.100, 1.200, 1.300, 1.500, 95.000 → trung vị 1.200. Trung bình (≈ 14.571) bị một video viral chi phối. 2) Gõ nhầm (thừa số 0) → kiểm POS và sửa; khách doanh nghiệp/B2B → phân tích riêng; đơn gian lận/đơn thử → loại ra kèm ghi chú. 3) So sánh trong từng nền tảng, ví dụ "CVR của mẫu mới cao hơn ở cả hai nền tảng (+1,0 điểm trên Facebook, +0,25 trên TikTok)", kèm ghi chú rằng tỷ lệ gộp bị nhiễu bởi cơ cấu nền tảng.</p></div>`);

const q3 = QZ(3, 'Chapter 3 quiz — Descriptive analytics and KPIs|||Quiz Chương 3 — Phân tích mô tả và KPI', '10 câu ôn công thức KPI, ROAS hoà vốn, SMART, chỉ số dẫn dắt/kết quả, vanity metric, trung vị và nghịch lý Simpson.', [
  Q('q1', 'An ad had 400,000 impressions and 2,000 clicks. CTR =|||Một quảng cáo có 400.000 hiển thị và 2.000 click. CTR =',
    ['0.05%|||0,05%', '0.5%|||0,5%', '5%|||5%', '20%|||20%'], 1,
    '2,000 ÷ 400,000 = 0.005 = 0.5%.|||2.000 ÷ 400.000 = 0,005 = 0,5%.'),
  Q('q2', 'Spend 6,000,000 VND for 300,000 impressions. CPM =|||Chi 6.000.000 VND cho 300.000 hiển thị. CPM =',
    ['2,000 VND|||2.000 VND', '20,000 VND|||20.000 VND', '200 VND|||200 VND', '50 VND|||50 VND'], 1,
    '6,000,000 ÷ 300,000 × 1,000 = 20,000 VND per thousand impressions.|||6.000.000 ÷ 300.000 × 1.000 = 20.000 VND mỗi nghìn hiển thị.'),
  Q('q3', 'Spend 10 million VND, 125 orders. CPA =|||Chi 10 triệu VND, 125 đơn. CPA =',
    ['8,000 VND|||8.000 VND', '80,000 VND|||80.000 VND', '125,000 VND|||125.000 VND', '800,000 VND|||800.000 VND'], 1,
    '10,000,000 ÷ 125 = 80,000.|||10.000.000 ÷ 125 = 80.000.'),
  Q('q4', 'With a 25% gross margin, the break-even ROAS is|||Với biên lợi nhuận gộp 25%, ROAS hoà vốn là',
    ['1|||1', '2.5|||2,5', '4|||4', '25|||25'], 2,
    'Break-even ROAS = 1 ÷ margin = 1 ÷ 0.25 = 4.|||ROAS hoà vốn = 1 ÷ biên = 1 ÷ 0,25 = 4.'),
  Q('q5', 'Reach 40,000, impressions 160,000. Frequency =|||Reach 40.000, impressions 160.000. Tần suất =',
    ['0.25|||0,25', '4|||4', '40|||40', '120,000|||120.000'], 1,
    'Frequency = impressions ÷ reach.|||Tần suất = impressions ÷ reach.'),
  Q('q6', 'Which is a leading indicator for monthly sales?|||Chỉ số nào là chỉ số dẫn dắt cho doanh số tháng?',
    ['Quarterly revenue|||Doanh thu quý', 'Daily add-to-cart rate|||Tỷ lệ thêm vào giỏ hằng ngày', 'Annual retention|||Tỷ lệ giữ chân hằng năm', 'Last year\'s market share|||Thị phần năm ngoái'], 1,
    'Add-to-cart moves before purchases and helps steer during the campaign.|||Thêm vào giỏ chuyển động trước khi mua và giúp lái trong lúc chạy chiến dịch.'),
  Q('q7', 'The best test for a vanity metric is to ask|||Phép thử tốt nhất cho vanity metric là hỏi',
    ['"If it doubled, would we change any decision?"|||"Nếu nó tăng gấp đôi, ta có đổi quyết định nào không?"', '"Is it large?"|||"Nó có lớn không?"', '"Does the platform show it?"|||"Nền tảng có hiển thị nó không?"', '"Is it in a chart?"|||"Nó có nằm trong biểu đồ không?"'], 0,
    'A metric that changes no decision is decoration.|||Chỉ số không làm đổi quyết định nào chỉ là đồ trang trí.'),
  Q('q8', '"Increase engagement" fails the SMART test mainly because it is not|||"Tăng tương tác" trượt SMART chủ yếu vì nó không',
    ['relevant|||liên quan', 'specific, measurable or time-bound|||cụ thể, đo được hay có thời hạn', 'creative|||sáng tạo', 'expensive|||tốn kém'], 1,
    'No metric, target, audience or deadline is given.|||Không có chỉ số, chỉ tiêu, đối tượng hay hạn chót.'),
  Q('q9', 'Order values are mostly about 200k VND, with one 5-million order. The typical customer is best described by the|||Giá trị đơn phần lớn khoảng 200 nghìn, có một đơn 5 triệu. Khách điển hình được mô tả tốt nhất bằng',
    ['mean|||trung bình', 'median|||trung vị', 'maximum|||giá trị lớn nhất', 'total|||tổng'], 1,
    'The median is robust to the single extreme value.|||Trung vị không bị một giá trị cực đoan kéo lệch.'),
  Q('q10', 'A new creative wins on every platform but loses in the combined total. This is|||Mẫu mới thắng ở mọi nền tảng nhưng thua khi gộp. Đây là',
    ['a calculation error|||lỗi tính toán', 'Simpson\'s paradox caused by a different platform mix|||nghịch lý Simpson do cơ cấu nền tảng khác nhau', 'proof the new creative is worse|||bằng chứng mẫu mới tệ hơn', 'an outlier|||một ngoại lai'], 1,
    'The new creative ran mostly where conversion is low; compare within platforms or randomise.|||Mẫu mới chạy chủ yếu ở nơi chuyển đổi thấp; hãy so trong từng nền tảng hoặc phân ngẫu nhiên.'),
]);

const ch3 = {
  title: 'Chapter 3 — Descriptive analytics and campaign KPIs|||Chương 3 — Phân tích mô tả và KPI chiến dịch',
  description: 'Phễu và công thức KPI chiến dịch (reach, impressions, frequency, CTR, CVR, CPC, CPM, CPA, ROAS, tỷ lệ tương tác), chọn KPI theo mục tiêu (SMART, chỉ số dẫn dắt/kết quả, vanity metric), thống kê mô tả trung thực: trung bình vs trung vị, ngoại lai, nghịch lý Simpson.',
  lessons: [l3_1, l3_2, l3_3, q3],
};

const l4_1 = L('aba201c-ts-4-1',
  '4.1 — Social listening: queries, share of voice and spike detection|||4.1 — Social listening: truy vấn, share of voice và phát hiện đột biến',
  'Khác biệt monitoring/listening, cách viết truy vấn cho tiếng Việt, các chỉ số volume, share of voice, tỷ trọng cảm xúc; phát hiện đột biến lượt nhắc bằng đường nền 7 ngày (z-score) — code pandas chạy thật.',
  `<span class="eyebrow">ABA201c · Chapter 4 · Lesson 4.1</span>
<h2>Social listening: queries, share of voice and spikes</h2>
<p class="lead">People talk about brands far more often than they talk <em>to</em> brands. Social listening is the discipline of collecting those public conversations, measuring them and turning them into insight — from product ideas to early crisis warnings.</p>
<h3>🎯 Objectives</h3>
<ul><li>Distinguish social monitoring from social listening.</li><li>Write a listening query that handles Vietnamese variants and noise.</li><li>Compute mention volume and share of voice, and flag unusual spikes.</li></ul>
<h3>📖 Lecture</h3>
<h3>Monitoring vs listening</h3>
<p><strong>Monitoring</strong> is reactive: track mentions and tags, answer complaints, count volume. <strong>Listening</strong> is analytical: look at patterns across many conversations — what themes grow, how sentiment shifts, what competitors are praised for — and feed them into strategy. The same tools (Brandwatch, Sprout Social, YouNet Media and others) support both; the difference is the question you ask.</p>
<h3>Writing a query</h3>
<p>A listening tool only finds what your query describes. A good query has:</p>
<ul>
<li><strong>Brand terms and variants</strong>: "Mộc Coffee", "moc coffee", "mộc cà phê", common misspellings, the official hashtag. Vietnamese users often type <em>without diacritics</em>, so include both forms.</li>
<li><strong>Product and campaign terms</strong>: "cà phê muối Mộc", "#MocTet2026".</li>
<li><strong>Exclusions</strong> to remove noise: "mộc" also means "plain wood" — exclude "gỗ mộc", "nội thất".</li>
<li><strong>Scope</strong>: languages, countries, platforms, date range.</li>
</ul>
<p>Always read a random sample of 50–100 collected posts to check <strong>precision</strong> (how many are really about you) before trusting any chart.</p>
<h3>Core metrics</h3>
<div class="formula"><span class="lbl">Share of voice (SOV)</span>SOV = Your mentions ÷ (Your mentions + Competitors' mentions) × 100%</div>
<p>Other metrics: <strong>mention volume</strong> over time, <strong>sentiment share</strong> (positive / neutral / negative proportions), <strong>potential reach</strong> of authors, and the <strong>top themes</strong> or hashtags. SOV must be computed with the same query rules for every brand, or it compares query quality instead of brands.</p>
<h3>Detecting spikes</h3>
<p>Crises often start as an unusual jump in mentions. A simple, explainable rule: compare today's count with the <strong>mean and standard deviation of the previous 7 days</strong>. The <strong>z-score</strong> = (today − mean) ÷ std tells how many "typical fluctuations" today is above normal. Flag days with z &gt; 3.</p>
<h3>✍️ Worked example</h3>
<pre><code class="language-python">import pandas as pd

days = pd.date_range("2026-04-01", periods=14, freq="D")
brand = [52, 48, 55, 50, 47, 53, 49, 51, 54, 50, 210, 380, 160, 70]
rival = [80, 85, 78, 82, 79, 84, 81, 83, 80, 86, 82, 79, 85, 81]
m = pd.DataFrame({"brand": brand, "rival": rival}, index=days)

# baseline = mean and std of the previous 7 days (not including today)
base = m["brand"].shift(1).rolling(7)
m["z"] = ((m["brand"] - base.mean()) / base.std()).round(1)
m["alert"] = m["z"] &gt; 3
print(m.iloc[7:])
sov = m["brand"].sum() / (m["brand"].sum() + m["rival"].sum()) * 100
print("share of voice over 14 days: %.1f%%" % sov)
</code></pre>
<div class="out">            brand  rival     z  alert
2026-04-08     51     83   0.1  False
2026-04-09     54     80   1.3  False
2026-04-10     50     86  -0.4  False
2026-04-11    210     82  67.3   True
2026-04-12    380     79   5.1   True
2026-04-13    160     85   0.3  False
2026-04-14     70     81  -0.5  False
share of voice over 14 days: 53.7%</div>
<p>For ten days the brand had about 50 mentions a day. On 11 April mentions jumped to 210 — a z-score above 60 — and the alert fired; it fired again on 12 April (380). On 13 April the z-score drops because the baseline window now includes the spike itself: a reminder that simple rules need human judgement. The next step is not the chart — it is <strong>reading the posts</strong>: a viral complaint? A celebrity mention? A giveaway? Over the fortnight the brand's share of voice was 53.7% against one rival, but much of it came from two days — SOV without context can hide a crisis inside "good" numbers.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Queries without exclusions — "Apple" collects fruit recipes, "mộc" collects furniture.</li><li>Forgetting no-diacritic and teen-code spellings, under-counting young audiences.</li><li>Treating listening data as representative of all customers — it only covers public, collectable platforms.</li><li>Celebrating rising volume without checking sentiment.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Monitoring reacts to mentions; listening finds patterns for strategy.</li><li>Queries need variants, exclusions and a precision check.</li><li>SOV = your mentions ÷ total mentions in the category set.</li><li>Spike alert: compare with a rolling baseline (z-score), then read the posts.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.brandwatch.com/blog/social-listening/" target="_blank" rel="noopener">Brandwatch — What is social listening?</a></li><li><a href="https://sproutsocial.com/insights/social-listening/" target="_blank" rel="noopener">Sprout Social — Social listening resources and guides</a></li><li><a href="https://sproutsocial.com/insights/share-of-voice/" target="_blank" rel="noopener">Sprout Social — Share of voice: how to measure it</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write a query (include terms, variants, exclusions) for a milk-tea brand called "Lá Trà".</li><li>Brand A has 1,200 mentions, B 2,000, C 800. Compute A's share of voice.</li><li>Baseline: mean 40 mentions/day, std 5. Today 58. Is it above the z &gt; 3 threshold?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Include: "Lá Trà", "la tra", "latra", "#LaTra", "trà sữa Lá Trà", "tra sua la tra"; exclude: "lá trà xanh" (the plant), "lá trà khô", "pha lá trà"; scope: Vietnamese, Vietnam, last 30 days. 2) 1,200 ÷ 4,000 = 30%. 3) z = (58 − 40) ÷ 5 = 3.6 → yes, flag it and read the posts.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 4 · Bài 4.1</span>
<h2>Social listening: truy vấn, share of voice và đột biến</h2>
<p class="lead">Người ta nói <em>về</em> thương hiệu nhiều hơn hẳn nói <em>với</em> thương hiệu. Social listening là kỹ năng thu thập những cuộc trò chuyện công khai đó, đo lường chúng và biến chúng thành insight — từ ý tưởng sản phẩm tới cảnh báo khủng hoảng sớm.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phân biệt social monitoring và social listening.</li><li>Viết truy vấn listening xử lý được biến thể tiếng Việt và nhiễu.</li><li>Tính lượng nhắc và share of voice, đánh dấu đột biến bất thường.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Monitoring và listening</h3>
<p><strong>Monitoring</strong> mang tính phản ứng: theo dõi lượt nhắc và tag, trả lời phàn nàn, đếm lượng. <strong>Listening</strong> mang tính phân tích: nhìn mẫu hình qua rất nhiều cuộc trò chuyện — chủ đề nào đang lớn, cảm xúc dịch chuyển ra sao, đối thủ được khen vì điều gì — rồi đưa vào chiến lược. Cùng công cụ (Brandwatch, Sprout Social, YouNet Media…) hỗ trợ cả hai; khác nhau ở câu hỏi bạn đặt ra.</p>
<h3>Viết truy vấn</h3>
<p>Công cụ listening chỉ tìm được những gì truy vấn mô tả. Truy vấn tốt gồm:</p>
<ul>
<li><strong>Tên thương hiệu và biến thể</strong>: "Mộc Coffee", "moc coffee", "mộc cà phê", lỗi gõ phổ biến, hashtag chính thức. Người Việt hay gõ <em>không dấu</em>, nên phải có cả hai dạng.</li>
<li><strong>Từ về sản phẩm và chiến dịch</strong>: "cà phê muối Mộc", "#MocTet2026".</li>
<li><strong>Loại trừ</strong> để bỏ nhiễu: "mộc" còn nghĩa là "gỗ mộc" — loại "gỗ mộc", "nội thất".</li>
<li><strong>Phạm vi</strong>: ngôn ngữ, quốc gia, nền tảng, khoảng thời gian.</li>
</ul>
<p>Luôn đọc một mẫu ngẫu nhiên 50–100 bài đã thu để kiểm <strong>độ chính xác (precision)</strong> — bao nhiêu bài thật sự nói về bạn — trước khi tin bất kỳ biểu đồ nào.</p>
<h3>Chỉ số cốt lõi</h3>
<div class="formula"><span class="lbl">Share of voice (SOV)</span>SOV = Lượt nhắc của bạn ÷ (Lượt nhắc của bạn + Lượt nhắc của đối thủ) × 100%</div>
<p>Các chỉ số khác: <strong>lượng nhắc</strong> theo thời gian, <strong>tỷ trọng cảm xúc</strong> (tích cực / trung tính / tiêu cực), <strong>độ phủ tiềm năng</strong> của người đăng, và <strong>chủ đề</strong> hay hashtag hàng đầu. SOV phải tính với cùng quy tắc truy vấn cho mọi thương hiệu, nếu không nó so chất lượng truy vấn chứ không phải so thương hiệu.</p>
<h3>Phát hiện đột biến</h3>
<p>Khủng hoảng thường bắt đầu bằng một cú nhảy bất thường về lượt nhắc. Một quy tắc đơn giản, giải thích được: so số hôm nay với <strong>trung bình và độ lệch chuẩn của 7 ngày trước</strong>. <strong>Z-score</strong> = (hôm nay − trung bình) ÷ độ lệch chuẩn cho biết hôm nay cao hơn bình thường bao nhiêu "dao động điển hình". Đánh dấu ngày có z &gt; 3.</p>
<h3>✍️ Ví dụ</h3>
<pre><code class="language-python">import pandas as pd

days = pd.date_range("2026-04-01", periods=14, freq="D")
brand = [52, 48, 55, 50, 47, 53, 49, 51, 54, 50, 210, 380, 160, 70]
rival = [80, 85, 78, 82, 79, 84, 81, 83, 80, 86, 82, 79, 85, 81]
m = pd.DataFrame({"brand": brand, "rival": rival}, index=days)

# baseline = mean and std of the previous 7 days (not including today)
base = m["brand"].shift(1).rolling(7)
m["z"] = ((m["brand"] - base.mean()) / base.std()).round(1)
m["alert"] = m["z"] &gt; 3
print(m.iloc[7:])
sov = m["brand"].sum() / (m["brand"].sum() + m["rival"].sum()) * 100
print("share of voice over 14 days: %.1f%%" % sov)
</code></pre>
<div class="out">            brand  rival     z  alert
2026-04-08     51     83   0.1  False
2026-04-09     54     80   1.3  False
2026-04-10     50     86  -0.4  False
2026-04-11    210     82  67.3   True
2026-04-12    380     79   5.1   True
2026-04-13    160     85   0.3  False
2026-04-14     70     81  -0.5  False
share of voice over 14 days: 53.7%</div>
<p>Mười ngày đầu thương hiệu có khoảng 50 lượt nhắc mỗi ngày. Ngày 11/4 lượt nhắc nhảy lên 210 — z-score trên 60 — và cảnh báo bật; ngày 12/4 (380) lại bật. Ngày 13/4 z-score tụt vì cửa sổ đường nền giờ đã chứa chính đợt đột biến: lời nhắc rằng quy tắc đơn giản vẫn cần con người phán đoán. Bước tiếp theo không phải biểu đồ — mà là <strong>đọc các bài đăng</strong>: một lời phàn nàn viral? Một người nổi tiếng nhắc tới? Một minigame? Qua hai tuần, share of voice của thương hiệu là 53,7% so với một đối thủ, nhưng phần lớn đến từ hai ngày — SOV không có bối cảnh có thể giấu một cuộc khủng hoảng bên trong những con số "đẹp".</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Truy vấn không có loại trừ — "Apple" thu cả công thức món táo, "mộc" thu cả đồ nội thất.</li><li>Quên dạng không dấu và teencode, đếm thiếu khán giả trẻ.</li><li>Coi dữ liệu listening là đại diện cho mọi khách hàng — nó chỉ phủ các nền tảng công khai, thu được.</li><li>Ăn mừng lượng nhắc tăng mà không kiểm cảm xúc.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Monitoring phản ứng với lượt nhắc; listening tìm mẫu hình cho chiến lược.</li><li>Truy vấn cần biến thể, loại trừ và kiểm tra độ chính xác.</li><li>SOV = lượt nhắc của bạn ÷ tổng lượt nhắc trong nhóm so sánh.</li><li>Cảnh báo đột biến: so với đường nền trượt (z-score), rồi đọc bài đăng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.brandwatch.com/blog/social-listening/" target="_blank" rel="noopener">Brandwatch — Social listening là gì?</a></li><li><a href="https://sproutsocial.com/insights/social-listening/" target="_blank" rel="noopener">Sprout Social — Tài nguyên và hướng dẫn social listening</a></li><li><a href="https://sproutsocial.com/insights/share-of-voice/" target="_blank" rel="noopener">Sprout Social — Share of voice: cách đo</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết truy vấn (từ khoá, biến thể, loại trừ) cho thương hiệu trà sữa "Lá Trà".</li><li>Thương hiệu A có 1.200 lượt nhắc, B 2.000, C 800. Tính share of voice của A.</li><li>Đường nền: trung bình 40 lượt/ngày, độ lệch chuẩn 5. Hôm nay 58. Có vượt ngưỡng z &gt; 3?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Gồm: "Lá Trà", "la tra", "latra", "#LaTra", "trà sữa Lá Trà", "tra sua la tra"; loại trừ: "lá trà xanh" (cây trà), "lá trà khô", "pha lá trà"; phạm vi: tiếng Việt, Việt Nam, 30 ngày gần nhất. 2) 1.200 ÷ 4.000 = 30%. 3) z = (58 − 40) ÷ 5 = 3,6 → có, đánh dấu và đọc bài đăng.</p></div>`);

const l4_2 = L('aba201c-ts-4-2',
  '4.2 — Lexicon-based sentiment analysis: word lists, negation and their limits|||4.2 — Phân tích cảm xúc dựa trên từ điển: danh sách từ, phủ định và giới hạn',
  'Cảm xúc là gì trong dữ liệu truyền thông, cách chấm điểm bằng từ điển cảm xúc, xử lý phủ định ("không ngon"), ví dụ Python với bình luận tiếng Việt, và vì sao từ điển thua trước mỉa mai, ngữ cảnh, tiếng lóng.',
  `<span class="eyebrow">ABA201c · Chapter 4 · Lesson 4.2</span>
<h2>Lexicon-based sentiment analysis</h2>
<p class="lead">Thousands of comments a week cannot be read by hand. Sentiment analysis assigns each text a label — positive, neutral or negative — so you can track the mood of a conversation. The simplest method uses a dictionary of emotional words.</p>
<h3>🎯 Objectives</h3>
<ul><li>Define sentiment and polarity in the context of brand conversation.</li><li>Score text with a sentiment lexicon and handle simple negation.</li><li>Explain where lexicon methods fail.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Sentiment analysis</strong> (opinion mining) estimates the emotional tone of a text. The most common output is <strong>polarity</strong>: positive, neutral, negative, sometimes with a strength score. More advanced versions detect emotions (joy, anger, fear) or <strong>aspect-based</strong> sentiment: "coffee great, service slow" is positive about <em>product</em> and negative about <em>service</em> — far more useful for a brand than one overall label.</p>
<h3>How a lexicon works</h3>
<ol>
<li>Build or borrow a <strong>lexicon</strong>: a list of words with scores (ngon +2, tuyệt +3, tệ −3, chậm −2).</li>
<li><strong>Tokenise</strong> the text into words.</li>
<li>Add the scores of the words found.</li>
<li>Apply <strong>rules</strong>: negation ("không ngon" flips +2 to −2), intensifiers ("rất", "lắm" could multiply), contrast words ("nhưng" — what follows often matters more).</li>
<li>Map the total to a label: &gt; 0 positive, &lt; 0 negative, 0 neutral.</li>
</ol>
<p>English has well-known lexicons such as VADER, designed for social media text (it handles capital letters, punctuation and emoticons). For Vietnamese, teams usually build domain lexicons themselves, because "nóng" is negative for a laptop and positive for a soup.</p>
<h3>✍️ Worked example — a tiny Vietnamese lexicon</h3>
<pre><code class="language-python">LEX = {"ngon": 2, "thích": 2, "tuyệt": 3, "nhanh": 1, "rẻ": 1,
       "dở": -2, "chậm": -2, "tệ": -3, "đắt": -1, "nguội": -2}
NEG = {"không", "chẳng", "chưa"}

def score(text):
    words = text.lower().replace(",", " ").replace(".", " ").split()
    s, flip = 0, False
    for w in words:
        if w in NEG:
            flip = True
            continue
        if w in LEX:
            s += -LEX[w] if flip else LEX[w]
        flip = False
    return s

for c in ["Cà phê ngon, giao nhanh", "Không ngon, nguội", "Giá đắt nhưng tuyệt",
          "Chẳng chậm chút nào", "Ngon lắm, ngon thật sự", "Ồ thế à, ngon ghê cơ"]:
    s = score(c)
    label = "positive" if s &gt; 0 else "negative" if s &lt; 0 else "neutral"
    print(f"{s:+d}  {label:8s}  {c}")
</code></pre>
<div class="out">+3  positive  Cà phê ngon, giao nhanh
-4  negative  Không ngon, nguội
+2  positive  Giá đắt nhưng tuyệt
+2  positive  Chẳng chậm chút nào
+4  positive  Ngon lắm, ngon thật sự
+2  positive  Ồ thế à, ngon ghê cơ</div>
<p><strong>Reading the output.</strong> "Không ngon, nguội" correctly becomes −4 thanks to the negation rule. "Chẳng chậm chút nào" (not slow at all) becomes positive — correct. But look at the last two lines:</p>
<ul>
<li>"Giá đắt nhưng tuyệt" scores +2 because "tuyệt" outweighs "đắt" — plausible, yet a pricing team would want to know about "đắt". An aspect-based view keeps both.</li>
<li>"Ồ thế à, ngon ghê cơ" can be <strong>sarcasm</strong> in context (e.g. a reply under a photo of a burnt cake), but the lexicon sees "ngon" and says positive. Lexicons cannot read tone, context or emoji irony.</li>
</ul>
<h3>Strengths and limits</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Strengths</span><span class="v">Transparent (you can explain every score), no training data needed, fast, easy to adjust for a domain.</span></div>
<div class="kv"><span class="k">Limits</span><span class="v">Misses sarcasm, slang and new words ("xu cà na"); words change meaning by domain; negation and word order are handled only by hand-written rules; Vietnamese word segmentation ("cà phê" is one word of two syllables) complicates tokenising.</span></div>
</div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using a general-purpose lexicon on a specialised domain without adapting it.</li><li>Ignoring the neutral class — most brand mentions are neutral information or questions.</li><li>Reporting "78% positive" without saying how accuracy was checked.</li><li>Dropping emoji and punctuation, which often carry the sentiment on social media.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Sentiment = polarity (pos/neu/neg), optionally strength, emotion or aspect.</li><li>Lexicon method: sum word scores, apply negation and contrast rules.</li><li>Transparent and cheap, but blind to sarcasm, context and domain shifts.</li><li>Always validate on a hand-labelled sample.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://github.com/cjhutto/vaderSentiment" target="_blank" rel="noopener">VADER sentiment analysis (GitHub, Hutto &amp; Gilbert)</a></li><li><a href="https://www.nltk.org/howto/sentiment.html" target="_blank" rel="noopener">NLTK — Sample usage for sentiment</a></li><li><a href="https://www.ibm.com/think/topics/sentiment-analysis" target="_blank" rel="noopener">IBM — What is sentiment analysis?</a></li><li><a href="https://sproutsocial.com/insights/social-media-sentiment-analysis/" target="_blank" rel="noopener">Sprout Social — Social media sentiment analysis</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>With the lexicon above, score "Ngon nhưng giao chậm" and "Không tệ chút nào".</li><li>Give one example where the same word is positive for one product and negative for another.</li><li>Why is aspect-based sentiment more useful for a restaurant chain than overall polarity?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) "Ngon nhưng giao chậm": +2 − 2 = 0 → neutral (although the customer has a clear complaint about delivery). "Không tệ chút nào": negation flips tệ −3 to +3 → positive. 2) "Nóng": a hot bowl of phở (good) vs a hot laptop (bad); "nhẹ": a light laptop (good) vs a weak coffee (bad). 3) It shows which part of the experience to fix — food, service, price, cleanliness — instead of one mixed score.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 4 · Bài 4.2</span>
<h2>Phân tích cảm xúc dựa trên từ điển</h2>
<p class="lead">Hàng nghìn bình luận mỗi tuần thì không thể đọc tay. Phân tích cảm xúc gán cho mỗi đoạn văn một nhãn — tích cực, trung tính hay tiêu cực — để bạn theo dõi "tâm trạng" của cuộc trò chuyện. Cách đơn giản nhất dùng một cuốn từ điển các từ mang cảm xúc.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa cảm xúc và cực tính trong bối cảnh trò chuyện về thương hiệu.</li><li>Chấm điểm văn bản bằng từ điển cảm xúc và xử lý phủ định đơn giản.</li><li>Giải thích phương pháp từ điển thất bại ở đâu.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Phân tích cảm xúc</strong> (opinion mining) ước lượng sắc thái cảm xúc của văn bản. Đầu ra phổ biến nhất là <strong>cực tính</strong>: tích cực, trung tính, tiêu cực, đôi khi kèm điểm mạnh yếu. Phiên bản nâng cao nhận diện cảm xúc (vui, giận, sợ) hoặc cảm xúc <strong>theo khía cạnh (aspect-based)</strong>: "cà phê tuyệt, phục vụ chậm" là tích cực về <em>sản phẩm</em> và tiêu cực về <em>phục vụ</em> — hữu ích hơn nhiều so với một nhãn chung.</p>
<h3>Từ điển hoạt động thế nào</h3>
<ol>
<li>Xây hoặc mượn một <strong>từ điển</strong>: danh sách từ kèm điểm (ngon +2, tuyệt +3, tệ −3, chậm −2).</li>
<li><strong>Tách từ</strong> văn bản.</li>
<li>Cộng điểm các từ tìm thấy.</li>
<li>Áp <strong>quy tắc</strong>: phủ định ("không ngon" lật +2 thành −2), từ nhấn mạnh ("rất", "lắm" có thể nhân lên), từ đối lập ("nhưng" — vế sau thường quan trọng hơn).</li>
<li>Đổi tổng thành nhãn: &gt; 0 tích cực, &lt; 0 tiêu cực, 0 trung tính.</li>
</ol>
<p>Tiếng Anh có các từ điển nổi tiếng như VADER, thiết kế cho văn bản mạng xã hội (xử lý chữ in hoa, dấu câu, biểu tượng cảm xúc). Với tiếng Việt, các đội thường tự xây từ điển theo lĩnh vực, vì "nóng" là tiêu cực với laptop nhưng tích cực với bát canh.</p>
<h3>✍️ Ví dụ — một từ điển tiếng Việt tí hon</h3>
<pre><code class="language-python">LEX = {"ngon": 2, "thích": 2, "tuyệt": 3, "nhanh": 1, "rẻ": 1,
       "dở": -2, "chậm": -2, "tệ": -3, "đắt": -1, "nguội": -2}
NEG = {"không", "chẳng", "chưa"}

def score(text):
    words = text.lower().replace(",", " ").replace(".", " ").split()
    s, flip = 0, False
    for w in words:
        if w in NEG:
            flip = True
            continue
        if w in LEX:
            s += -LEX[w] if flip else LEX[w]
        flip = False
    return s

for c in ["Cà phê ngon, giao nhanh", "Không ngon, nguội", "Giá đắt nhưng tuyệt",
          "Chẳng chậm chút nào", "Ngon lắm, ngon thật sự", "Ồ thế à, ngon ghê cơ"]:
    s = score(c)
    label = "positive" if s &gt; 0 else "negative" if s &lt; 0 else "neutral"
    print(f"{s:+d}  {label:8s}  {c}")
</code></pre>
<div class="out">+3  positive  Cà phê ngon, giao nhanh
-4  negative  Không ngon, nguội
+2  positive  Giá đắt nhưng tuyệt
+2  positive  Chẳng chậm chút nào
+4  positive  Ngon lắm, ngon thật sự
+2  positive  Ồ thế à, ngon ghê cơ</div>
<p><strong>Đọc kết quả.</strong> "Không ngon, nguội" thành −4 đúng nhờ quy tắc phủ định. "Chẳng chậm chút nào" thành tích cực — đúng. Nhưng xem hai dòng cuối:</p>
<ul>
<li>"Giá đắt nhưng tuyệt" được +2 vì "tuyệt" lấn át "đắt" — hợp lý, nhưng đội định giá sẽ muốn biết về chữ "đắt". Góc nhìn theo khía cạnh giữ được cả hai.</li>
<li>"Ồ thế à, ngon ghê cơ" có thể là <strong>mỉa mai</strong> trong ngữ cảnh (ví dụ trả lời dưới ảnh một chiếc bánh bị cháy), nhưng từ điển thấy "ngon" và nói tích cực. Từ điển không đọc được giọng điệu, ngữ cảnh hay emoji châm biếm.</li>
</ul>
<h3>Điểm mạnh và giới hạn</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Điểm mạnh</span><span class="v">Minh bạch (giải thích được từng điểm), không cần dữ liệu huấn luyện, nhanh, dễ chỉnh theo lĩnh vực.</span></div>
<div class="kv"><span class="k">Giới hạn</span><span class="v">Bỏ sót mỉa mai, tiếng lóng và từ mới ("xu cà na"); từ đổi nghĩa theo lĩnh vực; phủ định và trật tự từ chỉ xử lý bằng quy tắc viết tay; tách từ tiếng Việt ("cà phê" là một từ hai âm tiết) làm việc tách từ phức tạp hơn.</span></div>
</div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng từ điển đa dụng cho một lĩnh vực chuyên biệt mà không điều chỉnh.</li><li>Bỏ qua lớp trung tính — phần lớn lượt nhắc thương hiệu là thông tin hoặc câu hỏi trung tính.</li><li>Báo "78% tích cực" mà không nói độ chính xác được kiểm thế nào.</li><li>Bỏ emoji và dấu câu, trong khi trên mạng xã hội chúng thường mang cảm xúc.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Cảm xúc = cực tính (tích cực/trung tính/tiêu cực), có thể kèm độ mạnh, loại cảm xúc hoặc khía cạnh.</li><li>Phương pháp từ điển: cộng điểm từ, áp quy tắc phủ định và đối lập.</li><li>Minh bạch, rẻ, nhưng mù trước mỉa mai, ngữ cảnh và sự đổi nghĩa theo lĩnh vực.</li><li>Luôn kiểm chứng trên một mẫu gán nhãn bằng tay.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://github.com/cjhutto/vaderSentiment" target="_blank" rel="noopener">VADER sentiment analysis (GitHub, Hutto &amp; Gilbert)</a></li><li><a href="https://www.nltk.org/howto/sentiment.html" target="_blank" rel="noopener">NLTK — Ví dụ dùng cho phân tích cảm xúc</a></li><li><a href="https://www.ibm.com/think/topics/sentiment-analysis" target="_blank" rel="noopener">IBM — Phân tích cảm xúc là gì?</a></li><li><a href="https://sproutsocial.com/insights/social-media-sentiment-analysis/" target="_blank" rel="noopener">Sprout Social — Phân tích cảm xúc trên mạng xã hội</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Với từ điển trên, chấm "Ngon nhưng giao chậm" và "Không tệ chút nào".</li><li>Cho một ví dụ cùng một từ mà tích cực với sản phẩm này, tiêu cực với sản phẩm khác.</li><li>Vì sao cảm xúc theo khía cạnh hữu ích cho chuỗi nhà hàng hơn cực tính chung?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) "Ngon nhưng giao chậm": +2 − 2 = 0 → trung tính (dù khách rõ ràng phàn nàn về giao hàng). "Không tệ chút nào": phủ định lật tệ −3 thành +3 → tích cực. 2) "Nóng": bát phở nóng (tốt) và laptop nóng (xấu); "nhẹ": laptop nhẹ (tốt) và cà phê nhạt (xấu). 3) Nó chỉ ra phần nào của trải nghiệm cần sửa — món ăn, phục vụ, giá, vệ sinh — thay vì một điểm trộn lẫn.</p></div>`);

const l4_3 = L('aba201c-ts-4-3',
  '4.3 — Machine-learning sentiment: training a classifier and judging it honestly|||4.3 — Phân tích cảm xúc bằng học máy: huấn luyện bộ phân loại và đánh giá trung thực',
  'Học có giám sát từ bình luận đã gán nhãn, TF-IDF + hồi quy logistic bằng scikit-learn, tách tập huấn luyện/kiểm tra, ma trận nhầm lẫn, quy trình gán nhãn của con người, và các mô hình ngôn ngữ lớn trong phân tích cảm xúc.',
  `<span class="eyebrow">ABA201c · Chapter 4 · Lesson 4.3</span>
<h2>Machine-learning sentiment analysis</h2>
<p class="lead">Instead of writing rules, we can show a computer many examples labelled by humans and let it learn which words and word pairs signal each sentiment. This is <strong>supervised learning</strong> — the same idea behind most commercial sentiment tools.</p>
<h3>🎯 Objectives</h3>
<ul><li>Describe the supervised-learning workflow for text classification.</li><li>Train and test a small sentiment classifier in scikit-learn.</li><li>Read a confusion matrix and explain typical errors.</li></ul>
<h3>📖 Lecture</h3>
<h3>The workflow</h3>
<ol>
<li><strong>Label</strong> a sample of comments by hand (positive / negative, maybe neutral) with written guidelines. Two people label the same subset to check agreement.</li>
<li><strong>Split</strong> into a training set (to learn from) and a test set (kept aside, used once to measure quality).</li>
<li><strong>Represent</strong> text as numbers. Here we use TF-IDF on single words and word pairs (lesson 5.1 explains TF-IDF).</li>
<li><strong>Train</strong> a classifier — logistic regression is a solid, explainable baseline (lesson 7.2 explains it). It learns a weight for each word: "hài lòng" pushes towards positive, "thất vọng" towards negative.</li>
<li><strong>Evaluate</strong> on the test set: accuracy, the confusion matrix, and a look at the actual mistakes.</li>
</ol>
<h3>✍️ Worked example</h3>
<p>We train on 20 short Vietnamese e-commerce reviews and test on 6 new ones, including two deliberately hard cases.</p>
<pre><code class="language-python">from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, accuracy_score

train = [
    ("giao hàng nhanh, đóng gói đẹp", 1), ("sản phẩm tốt, sẽ mua lại", 1),
    ("nhân viên thân thiện, tư vấn nhiệt tình", 1), ("chất lượng tốt so với giá", 1),
    ("rất hài lòng, giao nhanh", 1), ("đẹp, đúng mô tả, đáng tiền", 1),
    ("app dễ dùng, thanh toán nhanh", 1), ("tư vấn nhiệt tình, hài lòng", 1),
    ("đóng gói cẩn thận, sản phẩm đẹp", 1), ("giao nhanh, sẽ ủng hộ tiếp", 1),
    ("giao hàng chậm, hộp bị móp", 0), ("sản phẩm lỗi, không đúng mô tả", 0),
    ("nhân viên thái độ kém", 0), ("chất lượng kém, phí tiền", 0),
    ("app lỗi, không thanh toán được", 0), ("đợi mãi không thấy giao", 0),
    ("hàng giả, rất thất vọng", 0), ("tư vấn sai, thất vọng", 0),
    ("đóng gói kém, hàng bị vỡ", 0), ("giao chậm, gọi không ai nghe", 0),
]
test = [("giao nhanh, sản phẩm đẹp", 1), ("app lỗi hoài, thất vọng", 0),
        ("đóng gói kém, giao chậm", 0), ("hài lòng, sẽ mua lại", 1),
        ("không tệ", 1), ("tốt quá nhỉ, đợi 2 tuần mới giao", 0)]

X_tr, y_tr = zip(*train); X_te, y_te = zip(*test)
vec = TfidfVectorizer(ngram_range=(1, 2))
model = LogisticRegression().fit(vec.fit_transform(X_tr), y_tr)
pred = model.predict(vec.transform(X_te))
prob = model.predict_proba(vec.transform(X_te))[:, 1]
for t, y, p, pr in zip(X_te, y_te, pred, prob):
    print(f"true={y} pred={p} P(pos)={pr:.2f}  {t}")
print("accuracy:", round(accuracy_score(y_te, pred), 2))
print(confusion_matrix(y_te, pred))
</code></pre>
<div class="out">true=1 pred=1 P(pos)=0.61  giao nhanh, sản phẩm đẹp
true=0 pred=0 P(pos)=0.38  app lỗi hoài, thất vọng
true=0 pred=0 P(pos)=0.45  đóng gói kém, giao chậm
true=1 pred=1 P(pos)=0.62  hài lòng, sẽ mua lại
true=1 pred=0 P(pos)=0.40  không tệ
true=0 pred=1 P(pos)=0.51  tốt quá nhỉ, đợi 2 tuần mới giao
accuracy: 0.67
[[2 1]
 [1 2]]</div>
<p><strong>Reading the output.</strong> The confusion matrix has true classes in rows (0 = negative, 1 = positive) and predicted classes in columns. Four of six are correct (accuracy 0.67). The two mistakes are instructive:</p>
<ul>
<li>"không tệ" (not bad) is predicted negative: the model has never seen the pair "không tệ" in training, and "không" appears in negative reviews ("không đúng mô tả"), so it pushes negative.</li>
<li>"tốt quá nhỉ, đợi 2 tuần mới giao" (great, huh — two weeks to deliver) is sarcasm; "tốt" pulls it to positive with probability 0.51 — basically a coin flip.</li>
</ul>
<p>Notice also how unsure the model is: probabilities hover between 0.38 and 0.62. With 20 examples that is expected. Real projects use thousands of labelled comments from the brand's own domain; the principles are the same.</p>
<h3>What about large language models?</h3>
<p>Modern large language models (Chapter 9) can classify sentiment from a prompt without training ("zero-shot"), and often handle context and sarcasm better than a small model. But they still need the same evaluation step on a labelled sample, they cost money per call, and their output can vary between runs. The honest workflow — labelled test set, confusion matrix, error review — does not change with the model.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Testing on the training data — the model looks perfect because it has memorised the answers.</li><li>Training on one domain (fashion reviews) and applying to another (banking complaints).</li><li>Unbalanced classes: if 90% of comments are positive, "always positive" scores 90% accuracy.</li><li>No labelling guidelines, so two labellers disagree and the model learns noise.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Supervised: human labels → text features → classifier → evaluation on unseen data.</li><li>TF-IDF + logistic regression is a transparent baseline.</li><li>Read the confusion matrix and the actual errors, not just accuracy.</li><li>LLMs help with context but still require labelled evaluation.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/feature_extraction.html" target="_blank" rel="noopener">scikit-learn — Feature extraction (text)</a></li><li><a href="https://www.nltk.org/book/ch06.html" target="_blank" rel="noopener">NLTK Book — Ch. 6 Learning to classify text</a></li><li><a href="https://web.stanford.edu/~jurafsky/slp3/" target="_blank" rel="noopener">Jurafsky &amp; Martin — Speech and Language Processing (free draft; chapters on classification and sentiment)</a></li><li><a href="https://aws.amazon.com/what-is/sentiment-analysis/" target="_blank" rel="noopener">AWS — What is sentiment analysis?</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A model is tested on 1,000 comments: 900 positive, 100 negative. It predicts every comment as positive. What is its accuracy, and is it useful?</li><li>Why must the test set be kept separate until the end?</li><li>Suggest two training examples that would help the model learn "không tệ".</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 90% accuracy, but it never finds a negative comment — useless for crisis detection. Look at recall for the negative class (Chapter 7). 2) If you tune the model while looking at the test set, the score no longer measures performance on truly new data. 3) e.g. ("không tệ, giá ổn", positive) and ("dùng không tệ, sẽ mua tiếp", positive) — plus a negative with "không" that is clearly negative, so the model learns the pair rather than the single word.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 4 · Bài 4.3</span>
<h2>Phân tích cảm xúc bằng học máy</h2>
<p class="lead">Thay vì viết quy tắc, ta có thể cho máy xem thật nhiều ví dụ đã được con người gán nhãn và để nó tự học từ nào, cặp từ nào báo hiệu cảm xúc nào. Đó là <strong>học có giám sát</strong> — ý tưởng đứng sau phần lớn công cụ phân tích cảm xúc thương mại.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mô tả quy trình học có giám sát cho phân loại văn bản.</li><li>Huấn luyện và kiểm tra một bộ phân loại cảm xúc nhỏ bằng scikit-learn.</li><li>Đọc ma trận nhầm lẫn và giải thích các lỗi điển hình.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Quy trình</h3>
<ol>
<li><strong>Gán nhãn</strong> tay một mẫu bình luận (tích cực / tiêu cực, có thể thêm trung tính) theo hướng dẫn viết sẵn. Hai người cùng gán một phần để kiểm mức đồng thuận.</li>
<li><strong>Tách</strong> thành tập huấn luyện (để học) và tập kiểm tra (để riêng, chỉ dùng một lần để đo chất lượng).</li>
<li><strong>Biểu diễn</strong> văn bản thành số. Ở đây dùng TF-IDF trên từ đơn và cặp từ (bài 5.1 giải thích TF-IDF).</li>
<li><strong>Huấn luyện</strong> bộ phân loại — hồi quy logistic là mốc nền vững chắc, giải thích được (bài 7.2 giải thích). Nó học một trọng số cho mỗi từ: "hài lòng" đẩy về tích cực, "thất vọng" đẩy về tiêu cực.</li>
<li><strong>Đánh giá</strong> trên tập kiểm tra: accuracy, ma trận nhầm lẫn và xem trực tiếp các lỗi.</li>
</ol>
<h3>✍️ Ví dụ</h3>
<p>Ta huấn luyện trên 20 đánh giá thương mại điện tử ngắn bằng tiếng Việt và kiểm tra trên 6 câu mới, trong đó có hai câu cố tình khó.</p>
<pre><code class="language-python">from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, accuracy_score

train = [
    ("giao hàng nhanh, đóng gói đẹp", 1), ("sản phẩm tốt, sẽ mua lại", 1),
    ("nhân viên thân thiện, tư vấn nhiệt tình", 1), ("chất lượng tốt so với giá", 1),
    ("rất hài lòng, giao nhanh", 1), ("đẹp, đúng mô tả, đáng tiền", 1),
    ("app dễ dùng, thanh toán nhanh", 1), ("tư vấn nhiệt tình, hài lòng", 1),
    ("đóng gói cẩn thận, sản phẩm đẹp", 1), ("giao nhanh, sẽ ủng hộ tiếp", 1),
    ("giao hàng chậm, hộp bị móp", 0), ("sản phẩm lỗi, không đúng mô tả", 0),
    ("nhân viên thái độ kém", 0), ("chất lượng kém, phí tiền", 0),
    ("app lỗi, không thanh toán được", 0), ("đợi mãi không thấy giao", 0),
    ("hàng giả, rất thất vọng", 0), ("tư vấn sai, thất vọng", 0),
    ("đóng gói kém, hàng bị vỡ", 0), ("giao chậm, gọi không ai nghe", 0),
]
test = [("giao nhanh, sản phẩm đẹp", 1), ("app lỗi hoài, thất vọng", 0),
        ("đóng gói kém, giao chậm", 0), ("hài lòng, sẽ mua lại", 1),
        ("không tệ", 1), ("tốt quá nhỉ, đợi 2 tuần mới giao", 0)]

X_tr, y_tr = zip(*train); X_te, y_te = zip(*test)
vec = TfidfVectorizer(ngram_range=(1, 2))
model = LogisticRegression().fit(vec.fit_transform(X_tr), y_tr)
pred = model.predict(vec.transform(X_te))
prob = model.predict_proba(vec.transform(X_te))[:, 1]
for t, y, p, pr in zip(X_te, y_te, pred, prob):
    print(f"true={y} pred={p} P(pos)={pr:.2f}  {t}")
print("accuracy:", round(accuracy_score(y_te, pred), 2))
print(confusion_matrix(y_te, pred))
</code></pre>
<div class="out">true=1 pred=1 P(pos)=0.61  giao nhanh, sản phẩm đẹp
true=0 pred=0 P(pos)=0.38  app lỗi hoài, thất vọng
true=0 pred=0 P(pos)=0.45  đóng gói kém, giao chậm
true=1 pred=1 P(pos)=0.62  hài lòng, sẽ mua lại
true=1 pred=0 P(pos)=0.40  không tệ
true=0 pred=1 P(pos)=0.51  tốt quá nhỉ, đợi 2 tuần mới giao
accuracy: 0.67
[[2 1]
 [1 2]]</div>
<p><strong>Đọc kết quả.</strong> Ma trận nhầm lẫn có lớp thật theo hàng (0 = tiêu cực, 1 = tích cực) và lớp dự đoán theo cột. Đúng 4/6 (accuracy 0,67). Hai lỗi rất đáng học:</p>
<ul>
<li>"không tệ" bị đoán tiêu cực: mô hình chưa từng thấy cặp "không tệ" khi học, còn chữ "không" xuất hiện trong đánh giá tiêu cực ("không đúng mô tả"), nên nó đẩy về tiêu cực.</li>
<li>"tốt quá nhỉ, đợi 2 tuần mới giao" là mỉa mai; chữ "tốt" kéo nó về tích cực với xác suất 0,51 — gần như tung đồng xu.</li>
</ul>
<p>Để ý thêm mô hình rất phân vân: xác suất chỉ dao động từ 0,38 đến 0,62. Với 20 ví dụ thì đó là bình thường. Dự án thật dùng hàng nghìn bình luận gán nhãn từ chính lĩnh vực của thương hiệu; nguyên tắc vẫn y như vậy.</p>
<h3>Còn mô hình ngôn ngữ lớn thì sao?</h3>
<p>Các mô hình ngôn ngữ lớn hiện đại (Chương 9) có thể phân loại cảm xúc chỉ bằng một prompt mà không cần huấn luyện ("zero-shot"), và thường xử lý ngữ cảnh, mỉa mai tốt hơn một mô hình nhỏ. Nhưng chúng vẫn cần đúng bước đánh giá trên mẫu đã gán nhãn, tốn tiền cho mỗi lần gọi, và kết quả có thể khác nhau giữa các lần chạy. Quy trình trung thực — tập kiểm tra có nhãn, ma trận nhầm lẫn, soát lỗi — không đổi dù dùng mô hình nào.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Kiểm tra trên chính dữ liệu huấn luyện — mô hình trông hoàn hảo vì đã thuộc lòng đáp án.</li><li>Huấn luyện ở một lĩnh vực (đánh giá thời trang) rồi áp cho lĩnh vực khác (khiếu nại ngân hàng).</li><li>Lớp mất cân bằng: nếu 90% bình luận là tích cực, đoán "luôn tích cực" vẫn đạt 90% accuracy.</li><li>Không có hướng dẫn gán nhãn, hai người gán bất đồng và mô hình học phải nhiễu.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Có giám sát: nhãn của người → đặc trưng văn bản → bộ phân loại → đánh giá trên dữ liệu chưa thấy.</li><li>TF-IDF + hồi quy logistic là mốc nền minh bạch.</li><li>Đọc ma trận nhầm lẫn và các lỗi thật, không chỉ accuracy.</li><li>LLM giúp hiểu ngữ cảnh nhưng vẫn phải đánh giá trên mẫu có nhãn.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/feature_extraction.html" target="_blank" rel="noopener">scikit-learn — Trích xuất đặc trưng (văn bản)</a></li><li><a href="https://www.nltk.org/book/ch06.html" target="_blank" rel="noopener">NLTK Book — Ch. 6 Học phân loại văn bản</a></li><li><a href="https://web.stanford.edu/~jurafsky/slp3/" target="_blank" rel="noopener">Jurafsky &amp; Martin — Speech and Language Processing (bản nháp miễn phí; các chương phân loại và cảm xúc)</a></li><li><a href="https://aws.amazon.com/what-is/sentiment-analysis/" target="_blank" rel="noopener">AWS — Phân tích cảm xúc là gì?</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Một mô hình được kiểm trên 1.000 bình luận: 900 tích cực, 100 tiêu cực. Nó đoán tất cả là tích cực. Accuracy bao nhiêu, có hữu ích không?</li><li>Vì sao tập kiểm tra phải để riêng tới cuối?</li><li>Đề xuất hai ví dụ huấn luyện giúp mô hình học được "không tệ".</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Accuracy 90%, nhưng không bao giờ tìm ra bình luận tiêu cực — vô dụng cho phát hiện khủng hoảng. Hãy xem recall của lớp tiêu cực (Chương 7). 2) Nếu vừa chỉnh mô hình vừa nhìn tập kiểm tra, điểm số không còn đo hiệu quả trên dữ liệu thật sự mới. 3) Ví dụ ("không tệ, giá ổn", tích cực) và ("dùng không tệ, sẽ mua tiếp", tích cực) — kèm một câu tiêu cực rõ ràng có chữ "không", để mô hình học cả cặp chứ không học chữ đơn.</p></div>`);

const q4 = QZ(4, 'Chapter 4 quiz — Social listening and sentiment|||Quiz Chương 4 — Social listening và phân tích cảm xúc', '10 câu ôn listening vs monitoring, truy vấn, share of voice, z-score đột biến, từ điển cảm xúc, phủ định, mỉa mai và đánh giá bộ phân loại.', [
  Q('q1', 'Analysing what themes grow across thousands of posts to inform strategy is|||Phân tích chủ đề nào đang lớn qua hàng nghìn bài để phục vụ chiến lược là',
    ['social monitoring|||social monitoring', 'social listening|||social listening', 'paid media|||paid media', 'A/B testing|||A/B testing'], 1,
    'Monitoring reacts to individual mentions; listening looks for patterns.|||Monitoring phản ứng với từng lượt nhắc; listening tìm mẫu hình.'),
  Q('q2', 'Brand X: 900 mentions; competitors: 1,500 and 600. X\'s share of voice =|||Thương hiệu X: 900 lượt nhắc; đối thủ: 1.500 và 600. SOV của X =',
    ['37.5%|||37,5%', '30%|||30%', '60%|||60%', '90%|||90%'], 1,
    '900 ÷ (900 + 1,500 + 600) = 900 ÷ 3,000 = 30%.|||900 ÷ (900 + 1.500 + 600) = 900 ÷ 3.000 = 30%.'),
  Q('q3', 'Why should a Vietnamese listening query include no-diacritic forms?|||Vì sao truy vấn listening tiếng Việt cần có dạng không dấu?',
    ['Tools cannot store diacritics|||Công cụ không lưu được dấu', 'Many users type without diacritics, so mentions would be missed|||Nhiều người gõ không dấu, nên sẽ bị sót lượt nhắc', 'It improves sentiment accuracy|||Nó tăng độ chính xác cảm xúc', 'It is required by law|||Luật bắt buộc'], 1,
    'Missing variants under-counts mentions, especially from younger users.|||Thiếu biến thể làm đếm thiếu lượt nhắc, nhất là của người trẻ.'),
  Q('q4', 'Baseline mean 100 mentions/day, std 10; today 125. z-score =|||Đường nền trung bình 100 lượt/ngày, độ lệch chuẩn 10; hôm nay 125. z-score =',
    ['1.25|||1,25', '2.5|||2,5', '25|||25', '12.5|||12,5'], 1,
    '(125 − 100) ÷ 10 = 2.5 — below the alert threshold of 3.|||(125 − 100) ÷ 10 = 2,5 — dưới ngưỡng cảnh báo 3.'),
  Q('q5', 'After a spike alert, the most important next step is to|||Sau cảnh báo đột biến, bước tiếp theo quan trọng nhất là',
    ['redesign the dashboard|||thiết kế lại dashboard', 'read a sample of the posts to understand the cause|||đọc một mẫu bài đăng để hiểu nguyên nhân', 'delete negative comments|||xoá bình luận tiêu cực', 'raise the threshold|||nâng ngưỡng cảnh báo'], 1,
    'Numbers show that something happened; the posts show what.|||Con số cho biết có chuyện; bài đăng cho biết chuyện gì.'),
  Q('q6', '"Không ngon" should be scored negative. Which lexicon feature handles it?|||"Không ngon" phải được chấm tiêu cực. Tính năng nào của từ điển xử lý việc này?',
    ['Intensifier rule|||Quy tắc nhấn mạnh', 'Negation rule|||Quy tắc phủ định', 'Stop-word removal|||Bỏ từ dừng', 'Stemming|||Rút gọn gốc từ'], 1,
    'The negation word flips the polarity of the next sentiment word.|||Từ phủ định lật cực tính của từ cảm xúc tiếp theo.'),
  Q('q7', '"Coffee great, staff rude" is best captured by|||"Cà phê tuyệt, nhân viên thô lỗ" được nắm bắt tốt nhất bằng',
    ['overall polarity only|||chỉ cực tính chung', 'aspect-based sentiment|||cảm xúc theo khía cạnh', 'share of voice|||share of voice', 'mention volume|||lượng nhắc'], 1,
    'It separates product (positive) from service (negative).|||Nó tách sản phẩm (tích cực) khỏi phục vụ (tiêu cực).'),
  Q('q8', 'A main weakness of lexicon-based sentiment is|||Điểm yếu chính của cảm xúc dựa trên từ điển là',
    ['it needs huge training data|||cần rất nhiều dữ liệu huấn luyện', 'it cannot be explained|||không giải thích được', 'it misses sarcasm and context|||bỏ sót mỉa mai và ngữ cảnh', 'it is too slow|||quá chậm'], 2,
    'Lexicons see words, not tone; they are actually transparent and fast.|||Từ điển thấy từ chứ không thấy giọng điệu; thực ra nó minh bạch và nhanh.'),
  Q('q9', '95% of test comments are positive and a model predicts "positive" for all. Its accuracy is 95%. This shows|||95% bình luận kiểm tra là tích cực và mô hình đoán "tích cực" cho tất cả. Accuracy 95%. Điều này cho thấy',
    ['the model is excellent|||mô hình xuất sắc', 'accuracy can be misleading with unbalanced classes|||accuracy dễ đánh lừa khi lớp mất cân bằng', 'the test set is too large|||tập kiểm tra quá lớn', 'sentiment cannot be learned|||cảm xúc không học được'], 1,
    'It never finds a negative comment; check per-class recall.|||Nó không bao giờ tìm ra bình luận tiêu cực; hãy xem recall từng lớp.'),
  Q('q10', 'Why must a sentiment model be evaluated on a separate test set?|||Vì sao mô hình cảm xúc phải được đánh giá trên tập kiểm tra riêng?',
    ['To make training faster|||Để huấn luyện nhanh hơn', 'To measure how it performs on comments it has never seen|||Để đo hiệu quả trên bình luận nó chưa từng thấy', 'Because scikit-learn requires it|||Vì scikit-learn bắt buộc', 'To increase accuracy|||Để tăng accuracy'], 1,
    'Scores on training data only show memorisation.|||Điểm trên dữ liệu huấn luyện chỉ cho thấy khả năng học thuộc.'),
]);

const ch4 = {
  title: 'Chapter 4 — Social listening and sentiment analysis|||Chương 4 — Social listening và phân tích cảm xúc',
  description: 'Social monitoring vs social listening, xây truy vấn từ khoá (biến thể không dấu, viết sai, loại trừ), share of voice, phát hiện đột biến lượt nhắc; phân tích cảm xúc bằng từ điển (có xử lý phủ định) và bằng học máy (TF-IDF + hồi quy logistic), cách đánh giá và giới hạn (mỉa mai, tiếng lóng).',
  lessons: [l4_1, l4_2, l4_3, q4],
};

const l5_1 = L('aba201c-ts-5-1',
  '5.1 — From text to numbers: tokens, n-grams, bag of words and TF-IDF|||5.1 — Từ văn bản đến con số: token, n-gram, túi từ và TF-IDF',
  'Tách từ (và vấn đề tách từ tiếng Việt), từ dừng, n-gram, túi từ, TF-IDF làm nổi từ đặc trưng; code đếm cụm từ và tìm từ đặc trưng của từng đánh giá bằng scikit-learn.',
  `<span class="eyebrow">ABA201c · Chapter 5 · Lesson 5.1</span>
<h2>From text to numbers</h2>
<p class="lead">Computers do not read; they count. Every text-analytics method — word clouds, sentiment models, topic models, search — starts by turning sentences into rows of numbers. How you do that decides what the analysis can see.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain tokenisation, stop words and n-grams, including the Vietnamese word-segmentation issue.</li><li>Build a bag-of-words representation.</li><li>Explain the intuition of TF-IDF and use it to find distinctive terms.</li></ul>
<h3>📖 Lecture</h3>
<h3>Tokens</h3>
<p><strong>Tokenisation</strong> splits text into units (tokens). In English, spaces are a good first guess. In Vietnamese, spaces separate <em>syllables</em>, not words: "giao hàng" (deliver) and "chất lượng" (quality) are single words made of two syllables. Splitting on spaces turns "hàng" into its own token, which also appears in "cửa hàng" (store). Two practical fixes: (1) use a Vietnamese word-segmentation tool, or (2) use <strong>n-grams</strong> — sequences of n adjacent tokens — so that "giao hàng" appears as a 2-gram (bigram) feature.</p>
<h3>Stop words and normalisation</h3>
<p><strong>Stop words</strong> are very frequent words with little topical meaning ("và", "là", "của", "the", "and"). Removing them can sharpen topic analysis — but never remove negations like "không" for sentiment work. Normalisation also includes lower-casing, handling emoji, and deciding whether "ko", "k", "hong" all mean "không".</p>
<h3>Bag of words</h3>
<p>A <strong>bag of words</strong> represents each document as counts of each vocabulary term, ignoring order. A collection of documents becomes a <strong>document–term matrix</strong>: one row per document, one column per term. It is crude — "dog bites man" equals "man bites dog" — yet surprisingly useful for classification and topics.</p>
<h3>TF-IDF</h3>
<p>Raw counts reward common words. <strong>TF-IDF</strong> (term frequency × inverse document frequency) gives a high weight to a term that is frequent <em>in this document</em> but rare <em>across documents</em>.</p>
<div class="formula"><span class="lbl">TF-IDF (idea)</span>weight(term, doc) = TF(term in doc) × IDF(term), where IDF grows when the term appears in fewer documents: IDF ≈ log(N ÷ number of documents containing the term)</div>
<p>scikit-learn uses a smoothed version of IDF and then normalises each row to length 1, so weights fall between 0 and 1.</p>
<h3>✍️ Worked example — six short reviews</h3>
<pre><code class="language-python">from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
import numpy as np

docs = [
    "giá rẻ giao hàng nhanh",
    "giá rẻ nhưng chất lượng kém",
    "giao hàng nhanh đóng gói cẩn thận",
    "chất lượng tốt giá hợp lý",
    "pin trâu camera đẹp",
    "camera đẹp nhưng pin yếu",
]
cv = CountVectorizer(ngram_range=(1, 2))
X = cv.fit_transform(docs)
print("vocabulary size:", len(cv.vocabulary_))
counts = np.asarray(X.sum(axis=0)).ravel()
top = counts.argsort()[::-1][:6]
print("most frequent terms:", [(cv.get_feature_names_out()[i], int(counts[i])) for i in top])

tf = TfidfVectorizer()
T = tf.fit_transform(docs)
names = tf.get_feature_names_out()
for i in [0, 4]:
    row = T[i].toarray().ravel()
    best = row.argsort()[::-1][:3]
    print("doc", i, "top tf-idf:", [(names[j], round(float(row[j]), 2)) for j in best])
</code></pre>
<div class="out">vocabulary size: 43
most frequent terms: [('giá', 3), ('camera', 2), ('đẹp', 2), ('nhanh', 2), ('nhưng', 2), ('hàng nhanh', 2)]
doc 0 top tf-idf: [('giao', 0.46), ('rẻ', 0.46), ('hàng', 0.46)]
doc 4 top tf-idf: [('trâu', 0.58), ('đẹp', 0.47), ('pin', 0.47)]</div>
<p><strong>Reading the output.</strong> With unigrams plus bigrams the vocabulary has 43 features from just six short reviews — text data grows wide quickly. Raw counts put "giá" (price) on top because it appears in three reviews. TF-IDF tells a different story for review 4 ("pin trâu camera đẹp"): "trâu" (long-lasting battery, slang) gets the highest weight because it appears in no other review — it is what makes this review distinctive. "Đẹp" and "pin" are shared with review 5, so they weigh less.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Word clouds of raw counts, which mostly show stop words and the brand name.</li><li>Removing "không", "chưa", "chẳng" as stop words before sentiment analysis.</li><li>Splitting Vietnamese only on spaces and then interpreting single syllables as words.</li><li>Ignoring spelling variants and teencode ("ko", "k", "hok"), which split one word into many columns.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Tokenise → normalise → represent as a document–term matrix.</li><li>Vietnamese needs word segmentation or bigrams.</li><li>Bag of words counts terms; TF-IDF rewards terms that are distinctive.</li><li>Every choice (stop words, n-grams, variants) changes what the analysis can find.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/feature_extraction.html" target="_blank" rel="noopener">scikit-learn — Text feature extraction (bag of words, TF-IDF)</a></li><li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html" target="_blank" rel="noopener">scikit-learn — TfidfVectorizer reference</a></li><li><a href="https://en.wikipedia.org/wiki/Tf%E2%80%93idf" target="_blank" rel="noopener">Wikipedia — tf–idf</a></li><li><a href="https://www.nltk.org/book/ch03.html" target="_blank" rel="noopener">NLTK Book — Ch. 3 Processing raw text</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>List the unigrams and bigrams of "giao hàng rất nhanh".</li><li>The word "shop" appears in 95% of comments on your fanpage. Will its IDF be high or low? Why is that useful?</li><li>Why can a bag-of-words model not distinguish "không phải hàng giả" from "phải không, hàng giả"?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Unigrams: giao, hàng, rất, nhanh. Bigrams: "giao hàng", "hàng rất", "rất nhanh". 2) Low — it appears almost everywhere, so it does not distinguish one comment from another; TF-IDF automatically down-weights it. 3) Both contain the same words; bag of words ignores order. Bigrams ("không phải", "hàng giả") help partially; models that read word order (Chapter 9) help more.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 5 · Bài 5.1</span>
<h2>Từ văn bản đến con số</h2>
<p class="lead">Máy tính không đọc; nó đếm. Mọi phương pháp phân tích văn bản — word cloud, mô hình cảm xúc, mô hình chủ đề, tìm kiếm — đều bắt đầu bằng việc biến câu chữ thành các hàng số. Cách biến đổi quyết định phân tích nhìn thấy được gì.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích tách token, từ dừng và n-gram, gồm cả vấn đề tách từ tiếng Việt.</li><li>Xây biểu diễn túi từ (bag of words).</li><li>Giải thích trực giác TF-IDF và dùng nó tìm từ đặc trưng.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Token</h3>
<p><strong>Tách token</strong> chia văn bản thành các đơn vị (token). Với tiếng Anh, dấu cách là phỏng đoán đầu tiên khá tốt. Với tiếng Việt, dấu cách tách <em>âm tiết</em> chứ không tách từ: "giao hàng" và "chất lượng" là một từ gồm hai âm tiết. Tách theo dấu cách khiến "hàng" thành token riêng, trùng với "hàng" trong "cửa hàng". Hai cách sửa thực tế: (1) dùng công cụ tách từ tiếng Việt, hoặc (2) dùng <strong>n-gram</strong> — chuỗi n token liền nhau — để "giao hàng" xuất hiện như một đặc trưng 2-gram (bigram).</p>
<h3>Từ dừng và chuẩn hoá</h3>
<p><strong>Từ dừng (stop word)</strong> là các từ rất phổ biến, ít mang nghĩa chủ đề ("và", "là", "của", "the", "and"). Bỏ chúng giúp phân tích chủ đề sắc hơn — nhưng tuyệt đối không bỏ từ phủ định như "không" khi phân tích cảm xúc. Chuẩn hoá còn gồm đổi chữ thường, xử lý emoji, và quyết định "ko", "k", "hong" có cùng nghĩa "không" hay không.</p>
<h3>Túi từ</h3>
<p><strong>Túi từ (bag of words)</strong> biểu diễn mỗi văn bản bằng số lần xuất hiện của từng từ trong bộ từ vựng, bỏ qua thứ tự. Một tập văn bản thành <strong>ma trận văn bản–từ</strong>: mỗi dòng một văn bản, mỗi cột một từ. Cách này thô — "chó cắn người" bằng "người cắn chó" — nhưng hữu ích đáng ngạc nhiên cho phân loại và chủ đề.</p>
<h3>TF-IDF</h3>
<p>Số đếm thô ưu ái từ phổ biến. <strong>TF-IDF</strong> (tần suất từ × nghịch đảo tần suất văn bản) cho trọng số cao cho từ xuất hiện nhiều <em>trong văn bản này</em> nhưng hiếm <em>giữa các văn bản</em>.</p>
<div class="formula"><span class="lbl">TF-IDF (ý tưởng)</span>trọng số(từ, văn bản) = TF(từ trong văn bản) × IDF(từ), trong đó IDF tăng khi từ xuất hiện ở ít văn bản hơn: IDF ≈ log(N ÷ số văn bản chứa từ)</div>
<p>scikit-learn dùng một bản IDF làm trơn rồi chuẩn hoá mỗi dòng về độ dài 1, nên trọng số nằm trong khoảng 0 đến 1.</p>
<h3>✍️ Ví dụ — sáu đánh giá ngắn</h3>
<pre><code class="language-python">from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
import numpy as np

docs = [
    "giá rẻ giao hàng nhanh",
    "giá rẻ nhưng chất lượng kém",
    "giao hàng nhanh đóng gói cẩn thận",
    "chất lượng tốt giá hợp lý",
    "pin trâu camera đẹp",
    "camera đẹp nhưng pin yếu",
]
cv = CountVectorizer(ngram_range=(1, 2))
X = cv.fit_transform(docs)
print("vocabulary size:", len(cv.vocabulary_))
counts = np.asarray(X.sum(axis=0)).ravel()
top = counts.argsort()[::-1][:6]
print("most frequent terms:", [(cv.get_feature_names_out()[i], int(counts[i])) for i in top])

tf = TfidfVectorizer()
T = tf.fit_transform(docs)
names = tf.get_feature_names_out()
for i in [0, 4]:
    row = T[i].toarray().ravel()
    best = row.argsort()[::-1][:3]
    print("doc", i, "top tf-idf:", [(names[j], round(float(row[j]), 2)) for j in best])
</code></pre>
<div class="out">vocabulary size: 43
most frequent terms: [('giá', 3), ('camera', 2), ('đẹp', 2), ('nhanh', 2), ('nhưng', 2), ('hàng nhanh', 2)]
doc 0 top tf-idf: [('giao', 0.46), ('rẻ', 0.46), ('hàng', 0.46)]
doc 4 top tf-idf: [('trâu', 0.58), ('đẹp', 0.47), ('pin', 0.47)]</div>
<p><strong>Đọc kết quả.</strong> Với từ đơn cộng cặp từ, bộ từ vựng có 43 đặc trưng chỉ từ sáu đánh giá ngắn — dữ liệu văn bản phình chiều ngang rất nhanh. Số đếm thô đưa "giá" lên đầu vì nó có ở ba đánh giá. TF-IDF kể câu chuyện khác cho đánh giá số 4 ("pin trâu camera đẹp"): "trâu" (pin bền, tiếng lóng) có trọng số cao nhất vì không đánh giá nào khác có nó — đó là điều làm đánh giá này khác biệt. "Đẹp" và "pin" có chung với đánh giá số 5, nên nhẹ ký hơn.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Word cloud từ số đếm thô, chủ yếu chỉ hiện từ dừng và tên thương hiệu.</li><li>Bỏ "không", "chưa", "chẳng" như từ dừng trước khi phân tích cảm xúc.</li><li>Tách tiếng Việt chỉ theo dấu cách rồi diễn giải từng âm tiết như một từ.</li><li>Bỏ qua biến thể chính tả và teencode ("ko", "k", "hok"), khiến một từ bị chia thành nhiều cột.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tách token → chuẩn hoá → biểu diễn thành ma trận văn bản–từ.</li><li>Tiếng Việt cần tách từ hoặc dùng bigram.</li><li>Túi từ đếm từ; TF-IDF thưởng cho từ đặc trưng.</li><li>Mỗi lựa chọn (từ dừng, n-gram, biến thể) thay đổi điều phân tích có thể tìm ra.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://scikit-learn.org/stable/modules/feature_extraction.html" target="_blank" rel="noopener">scikit-learn — Trích xuất đặc trưng văn bản (túi từ, TF-IDF)</a></li><li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html" target="_blank" rel="noopener">scikit-learn — Tài liệu TfidfVectorizer</a></li><li><a href="https://en.wikipedia.org/wiki/Tf%E2%80%93idf" target="_blank" rel="noopener">Wikipedia — tf–idf</a></li><li><a href="https://www.nltk.org/book/ch03.html" target="_blank" rel="noopener">NLTK Book — Ch. 3 Xử lý văn bản thô</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Liệt kê unigram và bigram của "giao hàng rất nhanh".</li><li>Từ "shop" xuất hiện trong 95% bình luận trên fanpage. IDF của nó cao hay thấp? Vì sao điều đó hữu ích?</li><li>Vì sao mô hình túi từ không phân biệt được "không phải hàng giả" với "phải không, hàng giả"?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Unigram: giao, hàng, rất, nhanh. Bigram: "giao hàng", "hàng rất", "rất nhanh". 2) Thấp — nó có ở gần như mọi nơi nên không phân biệt được bình luận này với bình luận khác; TF-IDF tự động giảm trọng số của nó. 3) Cả hai có cùng các từ; túi từ bỏ qua thứ tự. Bigram ("không phải", "hàng giả") giúp được phần nào; mô hình đọc được trật tự từ (Chương 9) giúp nhiều hơn.</p></div>`);

const l5_2 = L('aba201c-ts-5-2',
  '5.2 — Topic modelling at the intuition level: what are people talking about?|||5.2 — Mô hình chủ đề ở mức trực giác: mọi người đang nói về điều gì?',
  'Ý tưởng mô hình chủ đề (mỗi văn bản là hỗn hợp chủ đề, mỗi chủ đề là hỗn hợp từ), LDA và NMF, chạy NMF trên 12 đánh giá điện thoại tìm ra 3 chủ đề, cách đặt tên và kiểm chủ đề, giới hạn.',
  `<span class="eyebrow">ABA201c · Chapter 5 · Lesson 5.2</span>
<h2>Topic modelling: what are people talking about?</h2>
<p class="lead">You have 20,000 reviews and one afternoon. Topic modelling is an <em>unsupervised</em> method that groups co-occurring words into themes, giving you a first map of a large conversation before you read examples from each region.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain the two ideas behind topic models: documents are mixtures of topics, topics are mixtures of words.</li><li>Run NMF on a small set of reviews and interpret the topics.</li><li>Know how to name, check and use topics responsibly.</li></ul>
<h3>📖 Lecture</h3>
<h3>The intuition</h3>
<p>Imagine every review is written by picking a few <strong>topics</strong> (say "delivery" and "battery") and then picking words typical of each topic ("shipper", "giao hàng" for delivery; "pin", "sạc" for battery). A topic model runs this story <em>backwards</em>: from the observed words it infers (1) which words belong together in each topic and (2) how much of each topic each document contains. No labels are given — the method only sees which words co-occur.</p>
<h3>Two common methods</h3>
<div class="kv-grid">
<div class="kv"><span class="k">LDA (Latent Dirichlet Allocation)</span><span class="v">A probabilistic model introduced by Blei, Ng and Jordan (2003). Each document has a probability distribution over topics; each topic a distribution over words.</span></div>
<div class="kv"><span class="k">NMF (Non-negative Matrix Factorisation)</span><span class="v">Splits the document–term matrix (often TF-IDF) into two smaller non-negative matrices: documents × topics and topics × words. Often gives clean topics on short texts.</span></div>
</div>
<p>Both need you to choose the <strong>number of topics</strong> k. Too few merges distinct themes; too many splits one theme into near-duplicates. Try several values and keep the one whose topics a human finds clear and useful.</p>
<h3>✍️ Worked example — phone reviews</h3>
<p>Twelve short reviews of a smartphone. We ask NMF for three topics and print the five strongest words of each:</p>
<pre><code class="language-python">from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import NMF

reviews = [
    "giao hàng nhanh shipper thân thiện", "shipper giao hàng trễ hai ngày",
    "phí giao hàng cao shipper gọi trước", "giao hàng nhanh đóng gói kỹ",
    "pin dùng cả ngày sạc nhanh", "pin tụt nhanh khi chơi game",
    "sạc nhanh pin trâu", "pin yếu sạc lâu",
    "màn hình đẹp camera chụp đêm tốt", "camera mờ màn hình ám vàng",
    "màn hình sáng camera selfie đẹp", "camera zoom kém màn hình đẹp",
]
vec = TfidfVectorizer()
X = vec.fit_transform(reviews)
nmf = NMF(n_components=3, random_state=0, init="nndsvd", max_iter=500)
W = nmf.fit_transform(X)
words = vec.get_feature_names_out()
for k, comp in enumerate(nmf.components_):
    print("topic", k, ":", ", ".join(words[i] for i in comp.argsort()[::-1][:5]))
print("topic of each review:", W.argmax(axis=1).tolist())
</code></pre>
<div class="out">topic 0 : camera, màn, hình, đẹp, zoom
topic 1 : pin, sạc, nhanh, trâu, yếu
topic 2 : giao, hàng, shipper, nhanh, thiện
topic of each review: [2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0]</div>
<p><strong>Reading the output.</strong> The model found, without any labels, three clear themes we can name ourselves: topic 0 = <em>screen &amp; camera</em> (camera, màn hình, đẹp, zoom), topic 1 = <em>battery &amp; charging</em> (pin, sạc, nhanh, trâu, yếu), topic 2 = <em>delivery</em> (giao hàng, shipper). The last line assigns every review to its dominant topic, and the assignments match the way the reviews were written. Note that "nhanh" appears in both battery ("sạc nhanh") and delivery ("giao hàng nhanh") contexts — topics share words. Also note that topics say nothing about sentiment: "camera mờ" and "camera đẹp" are in the same topic. Combine topics with sentiment (Chapter 4) to get "share of negative comments about battery".</p>
<h3>Using topics responsibly</h3>
<ol>
<li><strong>Name topics yourself</strong> by reading top words <em>and</em> the 10 most typical documents of each.</li>
<li><strong>Check stability</strong>: rerun with another random seed or k; real themes reappear.</li>
<li><strong>Track over time</strong>: the share of each topic per week shows emerging issues ("delivery" doubling after a logistics change).</li>
<li><strong>Treat it as exploration</strong>, not proof. For reporting a precise number, label a sample or train a classifier.</li>
</ol>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Presenting model-generated word lists as finished insights without reading documents.</li><li>Keeping stop words and brand names, which dominate every topic.</li><li>Choosing k once and never testing alternatives.</li><li>Running topic models on a few dozen texts — you could simply read them.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Topic models are unsupervised: documents = mixtures of topics, topics = mixtures of words.</li><li>LDA (probabilistic) and NMF (matrix factorisation) are the common choices.</li><li>You choose k, name the topics and validate them by reading.</li><li>Combine with sentiment and time to make topics actionable.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://scikit-learn.org/stable/auto_examples/applications/plot_topics_extraction_with_nmf_lda.html" target="_blank" rel="noopener">scikit-learn — Topic extraction with NMF and LDA (example)</a></li><li><a href="https://www.ibm.com/think/topics/topic-modeling" target="_blank" rel="noopener">IBM — What is topic modeling?</a></li><li><a href="https://www.jmlr.org/papers/v3/blei03a.html" target="_blank" rel="noopener">Blei, Ng &amp; Jordan — Latent Dirichlet Allocation (JMLR)</a></li><li><a href="https://scikit-learn.org/stable/modules/decomposition.html" target="_blank" rel="noopener">scikit-learn — Matrix factorisation (NMF, LDA)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Name this topic: "phí, ship, đắt, freeship, voucher".</li><li>A topic model on hotel reviews returns topic "khách sạn, phòng, rất, và, của". What went wrong and how do you fix it?</li><li>How would you turn topic output into a weekly KPI for the customer-service team?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Shipping cost / delivery fees and promotions. 2) Stop words and the domain's ubiquitous words dominate; remove stop words, add domain words like "khách sạn", "phòng" to the stop list (or rely on TF-IDF), and rerun. 3) e.g. "share of negative comments in the 'waiting time' topic per week", with a target and a list of example comments attached.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 5 · Bài 5.2</span>
<h2>Mô hình chủ đề: mọi người đang nói về điều gì?</h2>
<p class="lead">Bạn có 20.000 đánh giá và một buổi chiều. Mô hình chủ đề là phương pháp <em>không giám sát</em> gom các từ hay đi cùng nhau thành chủ đề, cho bạn tấm bản đồ đầu tiên của một cuộc trò chuyện lớn trước khi đọc ví dụ ở từng vùng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích hai ý đằng sau mô hình chủ đề: văn bản là hỗn hợp chủ đề, chủ đề là hỗn hợp từ.</li><li>Chạy NMF trên một tập đánh giá nhỏ và diễn giải chủ đề.</li><li>Biết cách đặt tên, kiểm tra và dùng chủ đề có trách nhiệm.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Trực giác</h3>
<p>Hãy tưởng tượng mỗi đánh giá được viết bằng cách chọn vài <strong>chủ đề</strong> (ví dụ "giao hàng" và "pin") rồi chọn những từ đặc trưng cho từng chủ đề ("shipper", "giao hàng" cho giao hàng; "pin", "sạc" cho pin). Mô hình chủ đề chạy câu chuyện này <em>ngược lại</em>: từ các từ quan sát được, nó suy ra (1) những từ nào thuộc cùng một chủ đề và (2) mỗi văn bản chứa bao nhiêu phần mỗi chủ đề. Không có nhãn nào được cho — phương pháp chỉ thấy từ nào hay đi cùng từ nào.</p>
<h3>Hai phương pháp phổ biến</h3>
<div class="kv-grid">
<div class="kv"><span class="k">LDA (Latent Dirichlet Allocation)</span><span class="v">Mô hình xác suất do Blei, Ng và Jordan giới thiệu (2003). Mỗi văn bản có phân phối xác suất trên các chủ đề; mỗi chủ đề có phân phối trên các từ.</span></div>
<div class="kv"><span class="k">NMF (phân rã ma trận không âm)</span><span class="v">Tách ma trận văn bản–từ (thường là TF-IDF) thành hai ma trận nhỏ không âm: văn bản × chủ đề và chủ đề × từ. Thường cho chủ đề gọn với văn bản ngắn.</span></div>
</div>
<p>Cả hai đều cần bạn chọn <strong>số chủ đề</strong> k. Ít quá thì gộp các chủ đề khác nhau; nhiều quá thì tách một chủ đề thành nhiều bản gần trùng. Hãy thử vài giá trị và giữ giá trị cho chủ đề rõ ràng, hữu ích với con người.</p>
<h3>✍️ Ví dụ — đánh giá điện thoại</h3>
<p>Mười hai đánh giá ngắn về một chiếc điện thoại. Ta yêu cầu NMF tìm ba chủ đề và in năm từ mạnh nhất của mỗi chủ đề:</p>
<pre><code class="language-python">from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import NMF

reviews = [
    "giao hàng nhanh shipper thân thiện", "shipper giao hàng trễ hai ngày",
    "phí giao hàng cao shipper gọi trước", "giao hàng nhanh đóng gói kỹ",
    "pin dùng cả ngày sạc nhanh", "pin tụt nhanh khi chơi game",
    "sạc nhanh pin trâu", "pin yếu sạc lâu",
    "màn hình đẹp camera chụp đêm tốt", "camera mờ màn hình ám vàng",
    "màn hình sáng camera selfie đẹp", "camera zoom kém màn hình đẹp",
]
vec = TfidfVectorizer()
X = vec.fit_transform(reviews)
nmf = NMF(n_components=3, random_state=0, init="nndsvd", max_iter=500)
W = nmf.fit_transform(X)
words = vec.get_feature_names_out()
for k, comp in enumerate(nmf.components_):
    print("topic", k, ":", ", ".join(words[i] for i in comp.argsort()[::-1][:5]))
print("topic of each review:", W.argmax(axis=1).tolist())
</code></pre>
<div class="out">topic 0 : camera, màn, hình, đẹp, zoom
topic 1 : pin, sạc, nhanh, trâu, yếu
topic 2 : giao, hàng, shipper, nhanh, thiện
topic of each review: [2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0]</div>
<p><strong>Đọc kết quả.</strong> Không cần nhãn, mô hình tìm ra ba chủ đề rõ ràng mà ta tự đặt tên: chủ đề 0 = <em>màn hình &amp; camera</em> (camera, màn hình, đẹp, zoom), chủ đề 1 = <em>pin &amp; sạc</em> (pin, sạc, nhanh, trâu, yếu), chủ đề 2 = <em>giao hàng</em> (giao hàng, shipper). Dòng cuối gán mỗi đánh giá vào chủ đề trội của nó, và cách gán khớp với cách các đánh giá được viết. Để ý "nhanh" có ở cả ngữ cảnh pin ("sạc nhanh") lẫn giao hàng ("giao hàng nhanh") — các chủ đề dùng chung từ. Cũng để ý chủ đề không nói gì về cảm xúc: "camera mờ" và "camera đẹp" cùng một chủ đề. Kết hợp chủ đề với cảm xúc (Chương 4) để có "tỷ lệ bình luận tiêu cực về pin".</p>
<h3>Dùng chủ đề có trách nhiệm</h3>
<ol>
<li><strong>Tự đặt tên chủ đề</strong> bằng cách đọc các từ hàng đầu <em>và</em> 10 văn bản tiêu biểu nhất của mỗi chủ đề.</li>
<li><strong>Kiểm độ ổn định</strong>: chạy lại với hạt giống ngẫu nhiên hoặc k khác; chủ đề thật sẽ xuất hiện lại.</li>
<li><strong>Theo dõi theo thời gian</strong>: tỷ trọng mỗi chủ đề theo tuần cho thấy vấn đề mới nổi ("giao hàng" tăng gấp đôi sau khi đổi đơn vị vận chuyển).</li>
<li><strong>Coi đó là khám phá</strong>, không phải bằng chứng. Muốn báo một con số chính xác, hãy gán nhãn một mẫu hoặc huấn luyện bộ phân loại.</li>
</ol>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Trình bày danh sách từ do mô hình sinh ra như insight hoàn chỉnh mà không đọc văn bản.</li><li>Để nguyên từ dừng và tên thương hiệu, khiến chúng chiếm mọi chủ đề.</li><li>Chọn k một lần và không bao giờ thử phương án khác.</li><li>Chạy mô hình chủ đề trên vài chục văn bản — đọc luôn cho nhanh.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Mô hình chủ đề là không giám sát: văn bản = hỗn hợp chủ đề, chủ đề = hỗn hợp từ.</li><li>LDA (xác suất) và NMF (phân rã ma trận) là lựa chọn phổ biến.</li><li>Bạn chọn k, đặt tên chủ đề và kiểm chứng bằng cách đọc.</li><li>Kết hợp với cảm xúc và thời gian để chủ đề hành động được.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://scikit-learn.org/stable/auto_examples/applications/plot_topics_extraction_with_nmf_lda.html" target="_blank" rel="noopener">scikit-learn — Trích chủ đề bằng NMF và LDA (ví dụ)</a></li><li><a href="https://www.ibm.com/think/topics/topic-modeling" target="_blank" rel="noopener">IBM — Mô hình chủ đề là gì?</a></li><li><a href="https://www.jmlr.org/papers/v3/blei03a.html" target="_blank" rel="noopener">Blei, Ng &amp; Jordan — Latent Dirichlet Allocation (JMLR)</a></li><li><a href="https://scikit-learn.org/stable/modules/decomposition.html" target="_blank" rel="noopener">scikit-learn — Phân rã ma trận (NMF, LDA)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Đặt tên chủ đề này: "phí, ship, đắt, freeship, voucher".</li><li>Mô hình chủ đề trên đánh giá khách sạn trả về chủ đề "khách sạn, phòng, rất, và, của". Sai ở đâu, sửa thế nào?</li><li>Bạn sẽ biến kết quả chủ đề thành KPI hằng tuần cho đội chăm sóc khách hàng ra sao?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Phí giao hàng và khuyến mãi. 2) Từ dừng và các từ có mặt khắp nơi trong lĩnh vực chiếm chỗ; bỏ từ dừng, thêm "khách sạn", "phòng" vào danh sách từ dừng (hoặc dựa vào TF-IDF), rồi chạy lại. 3) Ví dụ "tỷ lệ bình luận tiêu cực thuộc chủ đề 'thời gian chờ' mỗi tuần", kèm chỉ tiêu và danh sách bình luận ví dụ.</p></div>`);

const l5_3 = L('aba201c-ts-5-3',
  '5.3 — Embeddings and similarity: grouping comments that mean the same thing|||5.3 — Embedding và độ tương đồng: gom các bình luận cùng ý',
  'Vector và độ tương đồng cosine, so khớp theo mặt chữ (TF-IDF ký tự) và theo nghĩa (embedding), code tìm cặp bình luận giống nhau, ứng dụng: gom câu hỏi thường gặp, chống trùng, phân luồng hỗ trợ; giới hạn.',
  `<span class="eyebrow">ABA201c · Chapter 5 · Lesson 5.3</span>
<h2>Embeddings and similarity</h2>
<p class="lead">"When is size M back?" and "Restock size M yet?" are the same question in different words. Grouping such comments lets a brand answer once, build an FAQ and see what people really want. The tool is <em>similarity between vectors</em>.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain texts as vectors and cosine similarity.</li><li>Distinguish surface similarity (shared characters/words) from semantic similarity (embeddings).</li><li>Find near-duplicate comments with Python and name practical uses.</li></ul>
<h3>📖 Lecture</h3>
<h3>Texts as points in space</h3>
<p>Once a text is a row of numbers (lesson 5.1), it is a point — a <strong>vector</strong> — in a space with one axis per feature. Texts with similar numbers sit close together. The standard closeness measure for text is <strong>cosine similarity</strong>: the cosine of the angle between two vectors.</p>
<div class="formula"><span class="lbl">Cosine similarity</span>cos(A, B) = (A · B) ÷ (‖A‖ × ‖B‖) — 1 = same direction (very similar), 0 = nothing in common</div>
<p>Cosine ignores length, so a short tweet and a long review about the same thing can still be close.</p>
<h3>Surface vs meaning</h3>
<ul>
<li><strong>Surface (lexical) similarity</strong>: TF-IDF on words or on <em>character n-grams</em> (pieces of 2–4 letters) matches texts that share spelling. Character n-grams are robust to typos and missing diacritics ("size M" ~ "sizeM").</li>
<li><strong>Semantic similarity with embeddings</strong>: an <strong>embedding</strong> is a dense vector (hundreds of numbers) produced by a neural network trained on huge amounts of text, positioned so that texts with similar <em>meaning</em> are close even with no shared words — "hết hàng" (out of stock) near "sold out", "restock" near "có lại hàng". Google's Machine Learning Crash Course describes embeddings as lower-dimensional representations of sparse data — a compact alternative to one-column-per-word encodings.</li>
</ul>
<h3>✍️ Worked example — six fanpage comments</h3>
<p>We use character n-gram TF-IDF (runs anywhere, no model download) and, for each comment, find its most similar neighbour:</p>
<pre><code class="language-python">from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

comments = [
    "Shop ơi khi nào có hàng size M?",
    "Bao giờ có lại size M vậy shop?",
    "Mình muốn đổi size áo đã mua",
    "Áo mua rồi có đổi size được không?",
    "Giá bên Shopee rẻ hơn web",
    "Sao trên Shopee lại rẻ hơn trang web?",
]
vec = TfidfVectorizer(analyzer="char_wb", ngram_range=(2, 4))
S = cosine_similarity(vec.fit_transform(comments))
for i in range(len(comments)):
    j = max((k for k in range(len(comments)) if k != i), key=lambda k: S[i, k])
    print(f"[{i}] most similar -&gt; [{j}]  cos={S[i, j]:.2f}")
</code></pre>
<div class="out">[0] most similar -&gt; [1]  cos=0.24
[1] most similar -&gt; [0]  cos=0.24
[2] most similar -&gt; [3]  cos=0.42
[3] most similar -&gt; [2]  cos=0.42
[4] most similar -&gt; [5]  cos=0.46
[5] most similar -&gt; [4]  cos=0.46</div>
<p>Every comment is paired with the one that asks the same thing: restock size M (0↔1), exchange size (2↔3), price on Shopee lower than the website (4↔5). The similarity values (0.24–0.46) are modest because wording differs a lot — "khi nào" vs "bao giờ" share no characters. That is exactly where embeddings outperform surface methods: they know "khi nào" and "bao giờ" both mean "when". In practice teams compute embeddings with a pretrained multilingual model or an API, then apply the same cosine-similarity and clustering steps shown here.</p>
<h3>Practical uses</h3>
<ul>
<li><strong>FAQ discovery</strong>: cluster thousands of inbox questions; the biggest clusters become FAQ entries and chatbot intents.</li>
<li><strong>Deduplication</strong>: detect copy-paste spam or coordinated fake reviews (many near-identical texts).</li>
<li><strong>Routing</strong>: send a new message to the team whose past messages it is most similar to.</li>
<li><strong>Semantic search</strong> over your own content library ("posts about studying with coffee").</li>
</ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Treating a similarity score as an absolute truth — set thresholds by checking examples.</li><li>Using an embedding model trained mostly on English for Vietnamese slang without testing.</li><li>Sending private customer messages to an external embedding API without checking the data-processing terms (Chapter 12).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Texts become vectors; cosine similarity measures closeness of direction.</li><li>TF-IDF (words or characters) captures surface overlap; embeddings capture meaning.</li><li>Uses: FAQ clustering, dedup and spam detection, routing, semantic search.</li><li>Validate thresholds on real examples; respect privacy when using external APIs.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://developers.google.com/machine-learning/crash-course/embeddings" target="_blank" rel="noopener">Google ML Crash Course — Embeddings</a></li><li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.cosine_similarity.html" target="_blank" rel="noopener">scikit-learn — cosine_similarity</a></li><li><a href="https://scikit-learn.org/stable/modules/feature_extraction.html" target="_blank" rel="noopener">scikit-learn — Text feature extraction (character n-grams)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Two vectors point in exactly the same direction but one is twice as long. What is their cosine similarity?</li><li>Would character n-gram TF-IDF find "giao hàng chậm" similar to "ship lâu quá"? Would a good embedding?</li><li>Propose a workflow to build a 10-question FAQ from 5,000 inbox messages.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 1 — cosine ignores length. 2) Character TF-IDF: no, they share almost no characters. A good embedding: likely yes, both mean "slow delivery". 3) Clean and pseudonymise messages → compute embeddings → cluster (e.g. k-means, Chapter 6) → read 10 examples per cluster and name it → rank clusters by size → write one answer for each of the 10 largest → measure how many new messages match an FAQ.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 5 · Bài 5.3</span>
<h2>Embedding và độ tương đồng</h2>
<p class="lead">"Khi nào có lại size M?" và "Bao giờ restock size M vậy?" là cùng một câu hỏi bằng hai cách nói. Gom những bình luận như vậy giúp thương hiệu trả lời một lần, làm FAQ và thấy khách thật sự muốn gì. Công cụ ở đây là <em>độ tương đồng giữa các vector</em>.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích văn bản như vector và độ tương đồng cosine.</li><li>Phân biệt tương đồng bề mặt (chung ký tự/từ) với tương đồng ngữ nghĩa (embedding).</li><li>Tìm bình luận gần trùng bằng Python và nêu ứng dụng thực tế.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Văn bản là điểm trong không gian</h3>
<p>Khi văn bản đã thành một hàng số (bài 5.1), nó là một điểm — một <strong>vector</strong> — trong không gian có mỗi trục cho một đặc trưng. Văn bản có các con số giống nhau nằm gần nhau. Thước đo độ gần chuẩn cho văn bản là <strong>độ tương đồng cosine</strong>: cosin của góc giữa hai vector.</p>
<div class="formula"><span class="lbl">Độ tương đồng cosine</span>cos(A, B) = (A · B) ÷ (‖A‖ × ‖B‖) — 1 = cùng hướng (rất giống), 0 = không có gì chung</div>
<p>Cosine bỏ qua độ dài, nên một tweet ngắn và một đánh giá dài về cùng một chuyện vẫn có thể gần nhau.</p>
<h3>Bề mặt và ý nghĩa</h3>
<ul>
<li><strong>Tương đồng bề mặt (từ vựng)</strong>: TF-IDF trên từ hoặc trên <em>n-gram ký tự</em> (mẩu 2–4 chữ cái) khớp các văn bản có chung cách viết. N-gram ký tự chịu được lỗi gõ và thiếu dấu ("size M" ~ "sizeM").</li>
<li><strong>Tương đồng ngữ nghĩa bằng embedding</strong>: <strong>embedding</strong> là vector đặc (hàng trăm con số) do một mạng nơ-ron huấn luyện trên lượng văn bản khổng lồ tạo ra, được đặt sao cho văn bản có <em>nghĩa</em> giống nhau nằm gần nhau dù không chung từ nào — "hết hàng" gần "sold out", "restock" gần "có lại hàng". Google Machine Learning Crash Course mô tả embedding là biểu diễn ít chiều của dữ liệu thưa — một cách gọn hơn so với kiểu mỗi từ một cột.</li>
</ul>
<h3>✍️ Ví dụ — sáu bình luận trên fanpage</h3>
<p>Ta dùng TF-IDF trên n-gram ký tự (chạy ở đâu cũng được, không cần tải mô hình) và với mỗi bình luận, tìm bình luận giống nó nhất:</p>
<pre><code class="language-python">from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

comments = [
    "Shop ơi khi nào có hàng size M?",
    "Bao giờ có lại size M vậy shop?",
    "Mình muốn đổi size áo đã mua",
    "Áo mua rồi có đổi size được không?",
    "Giá bên Shopee rẻ hơn web",
    "Sao trên Shopee lại rẻ hơn trang web?",
]
vec = TfidfVectorizer(analyzer="char_wb", ngram_range=(2, 4))
S = cosine_similarity(vec.fit_transform(comments))
for i in range(len(comments)):
    j = max((k for k in range(len(comments)) if k != i), key=lambda k: S[i, k])
    print(f"[{i}] most similar -&gt; [{j}]  cos={S[i, j]:.2f}")
</code></pre>
<div class="out">[0] most similar -&gt; [1]  cos=0.24
[1] most similar -&gt; [0]  cos=0.24
[2] most similar -&gt; [3]  cos=0.42
[3] most similar -&gt; [2]  cos=0.42
[4] most similar -&gt; [5]  cos=0.46
[5] most similar -&gt; [4]  cos=0.46</div>
<p>Mỗi bình luận được ghép với câu hỏi cùng ý: có lại size M (0↔1), đổi size (2↔3), giá trên Shopee rẻ hơn web (4↔5). Độ tương đồng (0,24–0,46) khá khiêm tốn vì cách diễn đạt khác nhau nhiều — "khi nào" và "bao giờ" không chung ký tự nào. Đó đúng là chỗ embedding vượt trội phương pháp bề mặt: nó biết "khi nào" và "bao giờ" cùng nghĩa. Thực tế, các đội tính embedding bằng một mô hình đa ngôn ngữ huấn luyện sẵn hoặc qua API, rồi áp đúng các bước tương đồng cosine và phân cụm như ở đây.</p>
<h3>Ứng dụng thực tế</h3>
<ul>
<li><strong>Tìm FAQ</strong>: phân cụm hàng nghìn câu hỏi trong inbox; các cụm lớn nhất thành mục FAQ và ý định (intent) cho chatbot.</li>
<li><strong>Chống trùng</strong>: phát hiện spam copy-paste hay đánh giá giả có tổ chức (nhiều văn bản gần y hệt).</li>
<li><strong>Phân luồng</strong>: chuyển tin nhắn mới tới đội có các tin nhắn cũ giống nó nhất.</li>
<li><strong>Tìm kiếm ngữ nghĩa</strong> trong kho nội dung của chính bạn ("các bài về học bài cùng cà phê").</li>
</ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Coi điểm tương đồng là chân lý tuyệt đối — hãy đặt ngưỡng bằng cách xem ví dụ.</li><li>Dùng mô hình embedding chủ yếu học tiếng Anh cho tiếng lóng tiếng Việt mà không thử.</li><li>Gửi tin nhắn riêng của khách tới API embedding bên ngoài mà không kiểm điều khoản xử lý dữ liệu (Chương 12).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Văn bản thành vector; cosine đo mức cùng hướng.</li><li>TF-IDF (từ hoặc ký tự) bắt chồng lấn bề mặt; embedding bắt ý nghĩa.</li><li>Ứng dụng: phân cụm FAQ, chống trùng và spam, phân luồng, tìm kiếm ngữ nghĩa.</li><li>Kiểm ngưỡng trên ví dụ thật; tôn trọng quyền riêng tư khi dùng API bên ngoài.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://developers.google.com/machine-learning/crash-course/embeddings" target="_blank" rel="noopener">Google ML Crash Course — Embeddings</a></li><li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.cosine_similarity.html" target="_blank" rel="noopener">scikit-learn — cosine_similarity</a></li><li><a href="https://scikit-learn.org/stable/modules/feature_extraction.html" target="_blank" rel="noopener">scikit-learn — Trích xuất đặc trưng văn bản (n-gram ký tự)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Hai vector cùng hướng tuyệt đối nhưng một cái dài gấp đôi. Độ tương đồng cosine là bao nhiêu?</li><li>TF-IDF n-gram ký tự có thấy "giao hàng chậm" giống "ship lâu quá" không? Một embedding tốt thì sao?</li><li>Đề xuất quy trình làm FAQ 10 câu từ 5.000 tin nhắn inbox.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 1 — cosine bỏ qua độ dài. 2) TF-IDF ký tự: không, hai câu gần như không chung ký tự. Embedding tốt: nhiều khả năng có, cả hai đều nghĩa "giao chậm". 3) Làm sạch và ẩn danh hoá tin nhắn → tính embedding → phân cụm (ví dụ k-means, Chương 6) → đọc 10 ví dụ mỗi cụm và đặt tên → xếp cụm theo cỡ → viết một câu trả lời cho mỗi cụm trong 10 cụm lớn nhất → đo bao nhiêu tin nhắn mới khớp một mục FAQ.</p></div>`);

const q5 = QZ(5, 'Chapter 5 quiz — Text analytics and topic modelling|||Quiz Chương 5 — Phân tích văn bản và mô hình chủ đề', '10 câu ôn tách từ tiếng Việt, n-gram, từ dừng, túi từ, TF-IDF, mô hình chủ đề (LDA/NMF), cosine và embedding.', [
  Q('q1', 'Why is splitting Vietnamese text on spaces problematic?|||Vì sao tách văn bản tiếng Việt theo dấu cách lại có vấn đề?',
    ['Vietnamese has no spaces|||Tiếng Việt không có dấu cách', 'Spaces separate syllables, so multi-syllable words like "giao hàng" are broken|||Dấu cách tách âm tiết, nên từ nhiều âm tiết như "giao hàng" bị cắt', 'Diacritics are removed|||Dấu bị xoá mất', 'It makes text longer|||Làm văn bản dài hơn'], 1,
    'Use word segmentation or bigrams to keep multi-syllable words together.|||Dùng công cụ tách từ hoặc bigram để giữ từ nhiều âm tiết.'),
  Q('q2', 'The bigrams of "pin rất trâu" are|||Các bigram của "pin rất trâu" là',
    ['pin, rất, trâu|||pin, rất, trâu', '"pin rất", "rất trâu"|||"pin rất", "rất trâu"', '"pin trâu"|||"pin trâu"', '"pin rất trâu"|||"pin rất trâu"'], 1,
    'A bigram is a pair of adjacent tokens.|||Bigram là cặp token liền nhau.'),
  Q('q3', 'Which word should NOT be removed as a stop word before sentiment analysis?|||Từ nào KHÔNG được bỏ như từ dừng trước khi phân tích cảm xúc?',
    ['và|||và', 'của|||của', 'không|||không', 'là|||là'], 2,
    'Negations flip sentiment.|||Từ phủ định lật ngược cảm xúc.'),
  Q('q4', 'A term that appears in almost every document gets a TF-IDF weight that is|||Một từ có mặt ở gần như mọi văn bản nhận trọng số TF-IDF',
    ['very high|||rất cao', 'low|||thấp', 'negative|||âm', 'undefined|||không xác định'], 1,
    'Its inverse document frequency is low, so it does not distinguish documents.|||Nghịch đảo tần suất văn bản của nó thấp, nên không phân biệt được văn bản.'),
  Q('q5', 'Bag of words cannot tell "dog bites man" from "man bites dog" because it|||Túi từ không phân biệt "chó cắn người" với "người cắn chó" vì nó',
    ['removes nouns|||bỏ danh từ', 'ignores word order|||bỏ qua thứ tự từ', 'uses TF-IDF|||dùng TF-IDF', 'needs labels|||cần nhãn'], 1,
    'Only counts are kept.|||Chỉ giữ lại số đếm.'),
  Q('q6', 'Topic modelling is|||Mô hình chủ đề là phương pháp',
    ['supervised, it needs labelled topics|||có giám sát, cần chủ đề gán nhãn sẵn', 'unsupervised, it infers topics from word co-occurrence|||không giám sát, suy ra chủ đề từ việc các từ đi cùng nhau', 'a sentiment lexicon|||một từ điển cảm xúc', 'a dashboard tool|||một công cụ dashboard'], 1,
    'No labels are given; humans name the topics afterwards.|||Không có nhãn; con người đặt tên chủ đề sau đó.'),
  Q('q7', 'A topic "camera, màn hình, đẹp, mờ, zoom" tells you|||Chủ đề "camera, màn hình, đẹp, mờ, zoom" cho bạn biết',
    ['what people discuss, not whether they like it|||người ta bàn về gì, chứ không cho biết họ thích hay không', 'the share of positive reviews|||tỷ lệ đánh giá tích cực', 'the best k|||giá trị k tốt nhất', 'the sales impact|||tác động lên doanh số'], 0,
    'Combine topics with sentiment analysis to know the tone.|||Kết hợp chủ đề với phân tích cảm xúc để biết sắc thái.'),
  Q('q8', 'The best way to name a topic is to|||Cách tốt nhất để đặt tên một chủ đề là',
    ['use the first word only|||chỉ dùng từ đầu tiên', 'read its top words and its most typical documents|||đọc các từ hàng đầu và các văn bản tiêu biểu nhất của nó', 'ask the model for a name|||yêu cầu mô hình đặt tên', 'keep it as "topic 0"|||để nguyên "chủ đề 0"'], 1,
    'Human reading turns word lists into meaningful, checked themes.|||Việc con người đọc biến danh sách từ thành chủ đề có nghĩa, đã kiểm.'),
  Q('q9', 'Cosine similarity of 0 between two text vectors means|||Độ tương đồng cosine bằng 0 giữa hai vector văn bản nghĩa là',
    ['they are identical|||chúng giống hệt nhau', 'they share no features|||chúng không chung đặc trưng nào', 'one is longer|||một cái dài hơn', 'they are negative|||chúng mang nghĩa tiêu cực'], 1,
    'With non-negative TF-IDF vectors, 0 means no overlap.|||Với vector TF-IDF không âm, 0 nghĩa là không chồng lấn.'),
  Q('q10', '"Khi nào có hàng?" and "Bao giờ restock?" share almost no words. Which method most likely groups them?|||"Khi nào có hàng?" và "Bao giờ restock?" gần như không chung từ. Phương pháp nào nhiều khả năng gom chúng?',
    ['Word counts|||Đếm từ', 'Character n-gram TF-IDF|||TF-IDF n-gram ký tự', 'Semantic embeddings|||Embedding ngữ nghĩa', 'A sentiment lexicon|||Từ điển cảm xúc'], 2,
    'Embeddings place texts with similar meaning close together even without shared words.|||Embedding đặt các văn bản cùng nghĩa gần nhau dù không chung từ.'),
]);

const ch5 = {
  title: 'Chapter 5 — Text analytics and topic modelling|||Chương 5 — Phân tích văn bản và mô hình chủ đề',
  description: 'Biến văn bản thành số (tách từ, từ dừng, n-gram, túi từ, TF-IDF; đặc thù tách từ tiếng Việt), mô hình chủ đề ở mức trực giác (NMF/LDA) trên đánh giá sản phẩm, embedding và độ tương đồng cosine để gom bình luận giống nhau.',
  lessons: [l5_1, l5_2, l5_3, q5],
};

const l6_1 = L('aba201c-ts-6-1',
  '6.1 — Segmentation basics and RFM: grouping customers by behaviour|||6.1 — Cơ bản về phân khúc và RFM: nhóm khách theo hành vi',
  'Vì sao phân khúc, các cơ sở phân khúc, phân khúc dựa trên quy tắc và dựa trên dữ liệu; tính Recency–Frequency–Monetary và chấm điểm RFM bằng pandas, gợi ý thông điệp cho từng nhóm.',
  `<span class="eyebrow">ABA201c · Chapter 6 · Lesson 6.1</span>
<h2>Segmentation basics and RFM</h2>
<p class="lead">Speaking to everyone means speaking to no one. Segmentation splits an audience into groups that are similar inside and different from each other, so each group can get the message, channel and offer that fits it.</p>
<h3>🎯 Objectives</h3>
<ul><li>Name the classic bases of segmentation and judge what makes a segment useful.</li><li>Compute Recency, Frequency and Monetary value from transactions.</li><li>Turn RFM scores into segments with a communication plan.</li></ul>
<h3>📖 Lecture</h3>
<h3>Bases of segmentation</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Demographic</span><span class="v">age, gender, income, occupation (students vs office workers)</span></div>
<div class="kv"><span class="k">Geographic</span><span class="v">city, district, urban/rural, climate</span></div>
<div class="kv"><span class="k">Psychographic</span><span class="v">values, lifestyle, interests (health-conscious, gamers)</span></div>
<div class="kv"><span class="k">Behavioural</span><span class="v">purchase history, usage frequency, channel preference, loyalty, response to past campaigns</span></div>
</div>
<p>Behavioural data is usually the most predictive of what people will do next — and you already own it as first-party data. A useful segment is <strong>measurable</strong> (you can identify members), <strong>substantial</strong> (big enough to matter), <strong>accessible</strong> (you can reach it through a channel), <strong>differentiable</strong> (responds differently) and <strong>actionable</strong> (you have a plan for it).</p>
<h3>RFM</h3>
<p><strong>RFM analysis</strong> is a simple, widely used behavioural segmentation for customers with purchase history:</p>
<ul>
<li><strong>Recency</strong> — days since the last purchase (lower is better).</li>
<li><strong>Frequency</strong> — number of purchases in the period.</li>
<li><strong>Monetary</strong> — total spent in the period.</li>
</ul>
<p>Each dimension is scored, often 1–5 by quintile (here 1–3 by tertile because the dataset is tiny), and the combination names the segment: high R, F, M = "Champions"; low R after good history = "At risk"; and so on. The intuition is old and robust: someone who bought recently and often is more likely to respond to the next message.</p>
<h3>✍️ Worked example — six customers</h3>
<pre><code class="language-python">import pandas as pd

tx = pd.DataFrame({
    "customer": ["A", "A", "A", "B", "C", "C", "D", "D", "D", "D", "E", "F", "F"],
    "date": pd.to_datetime(["2026-09-02", "2026-10-10", "2026-10-28", "2026-05-14",
                            "2026-08-01", "2026-10-25", "2026-10-01", "2026-10-12",
                            "2026-10-20", "2026-10-30", "2026-03-03", "2026-07-07", "2026-07-20"]),
    "amount": [300, 250, 400, 1200, 150, 180, 500, 450, 600, 550, 90, 200, 260],  # thousand VND
})
today = pd.Timestamp("2026-11-01")
rfm = tx.groupby("customer").agg(
    recency=("date", lambda d: (today - d.max()).days),
    frequency=("date", "count"),
    monetary=("amount", "sum"),
)
# score 1-3 with rank-based tertiles (3 = best)
rfm["R"] = pd.qcut(rfm.recency.rank(method="first"), 3, labels=[3, 2, 1]).astype(int)
rfm["F"] = pd.qcut(rfm.frequency.rank(method="first"), 3, labels=[1, 2, 3]).astype(int)
rfm["M"] = pd.qcut(rfm.monetary.rank(method="first"), 3, labels=[1, 2, 3]).astype(int)
rfm["segment"] = rfm.apply(lambda r: "Champion" if r.R + r.F + r.M &gt;= 8
                           else "At risk" if r.R == 1 else "Develop", axis=1)
print(rfm)
</code></pre>
<div class="out">          recency  frequency  monetary  R  F  M   segment
customer                                                 
A               4          3       950  3  3  2  Champion
B             171          1      1200  1  1  3   At risk
C               7          2       330  2  2  1   Develop
D               2          4      2100  3  3  3  Champion
E             243          1        90  1  1  1   At risk
F             104          2       460  2  2  2   Develop</div>
<p><strong>Reading the output.</strong> D bought four times, two days ago, and spent the most — a Champion. A is also a Champion. B spent a lot (1.2 million) but only once, 171 days ago — "At risk": a big past customer who has gone quiet, worth a personalised win-back message. E is low on everything — a cheap reminder at most. C and F are in the middle — "Develop" with cross-sell or a second-purchase voucher.</p>
<h3>From segments to communication</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Champions</span><span class="v">Early access, referral programme, ask for reviews; avoid discounts they do not need.</span></div>
<div class="kv"><span class="k">At risk</span><span class="v">Personal "we miss you" message, find out why; time-limited offer.</span></div>
<div class="kv"><span class="k">Develop</span><span class="v">Recommendations based on last purchase, bundle offer.</span></div>
</div>
<p>Then <strong>test</strong> it: send the win-back offer to a random half of "At risk" and compare with the other half (Chapter 8). Otherwise you cannot know whether the offer caused returns.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Segments that differ on paper but receive the same message — segmentation without action.</li><li>Scoring quintiles on tiny data, where one customer moves a whole group.</li><li>Forgetting that RFM needs purchase history — it says nothing about prospects.</li><li>Using sensitive attributes (health, religion) for targeting without a legal basis (Chapter 12).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Bases: demographic, geographic, psychographic, behavioural.</li><li>Good segments are measurable, substantial, accessible, differentiable, actionable.</li><li>RFM: recency, frequency, monetary — scored and combined into named groups.</li><li>Each segment needs a message, a channel and a test.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/RFM_(market_research)" target="_blank" rel="noopener">Wikipedia — RFM (market research)</a></li><li><a href="https://pandas.pydata.org/docs/user_guide/groupby.html" target="_blank" rel="noopener">pandas — Group by (agg) for computing RFM</a></li><li><a href="https://data-science-for-biz.com/" target="_blank" rel="noopener">Provost &amp; Fawcett — Data Science for Business (book site)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Customer X bought 10 times but the last time was 200 days ago. Which RFM letter is weak and what message would you send?</li><li>Why is "women 18–35 in Vietnam" a weak segment for a coffee brand's CRM email?</li><li>Write the pandas aggregation that computes frequency per customer.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Recency is weak (F and probably M are strong) → a lapsed loyal customer: personal win-back, ask what changed, offer their favourite product. 2) It is too broad and not behavioural — it does not tell you what members did or will respond to; RFM or purchase-category segments are more actionable. 3) <code>tx.groupby("customer")["date"].count()</code> (or <code>.agg(frequency=("date", "count"))</code>).</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 6 · Bài 6.1</span>
<h2>Cơ bản về phân khúc và RFM</h2>
<p class="lead">Nói với tất cả mọi người nghĩa là không nói với ai. Phân khúc chia khán giả thành các nhóm giống nhau bên trong và khác nhau giữa các nhóm, để mỗi nhóm nhận được thông điệp, kênh và ưu đãi phù hợp.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Kể tên các cơ sở phân khúc kinh điển và đánh giá thế nào là phân khúc hữu ích.</li><li>Tính Recency, Frequency, Monetary từ giao dịch.</li><li>Biến điểm RFM thành các phân khúc kèm kế hoạch truyền thông.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Các cơ sở phân khúc</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Nhân khẩu học</span><span class="v">tuổi, giới tính, thu nhập, nghề nghiệp (sinh viên và dân văn phòng)</span></div>
<div class="kv"><span class="k">Địa lý</span><span class="v">thành phố, quận, thành thị/nông thôn, khí hậu</span></div>
<div class="kv"><span class="k">Tâm lý</span><span class="v">giá trị, lối sống, sở thích (quan tâm sức khoẻ, game thủ)</span></div>
<div class="kv"><span class="k">Hành vi</span><span class="v">lịch sử mua, tần suất dùng, kênh ưa thích, mức trung thành, phản hồi với chiến dịch cũ</span></div>
</div>
<p>Dữ liệu hành vi thường dự đoán tốt nhất người ta sẽ làm gì tiếp theo — và bạn đã sở hữu nó dưới dạng dữ liệu bên thứ nhất. Một phân khúc hữu ích phải <strong>đo được</strong> (nhận diện được thành viên), <strong>đủ lớn</strong> (đáng đầu tư), <strong>tiếp cận được</strong> (có kênh để chạm), <strong>khác biệt</strong> (phản ứng khác nhau) và <strong>hành động được</strong> (có kế hoạch cho nó).</p>
<h3>RFM</h3>
<p><strong>Phân tích RFM</strong> là cách phân khúc theo hành vi đơn giản, được dùng rộng rãi cho khách có lịch sử mua:</p>
<ul>
<li><strong>Recency</strong> — số ngày từ lần mua gần nhất (càng thấp càng tốt).</li>
<li><strong>Frequency</strong> — số lần mua trong kỳ.</li>
<li><strong>Monetary</strong> — tổng chi trong kỳ.</li>
</ul>
<p>Mỗi chiều được chấm điểm, thường 1–5 theo ngũ phân vị (ở đây 1–3 theo tam phân vị vì dữ liệu rất nhỏ), và tổ hợp điểm đặt tên phân khúc: R, F, M cao = "Champions"; R thấp sau một lịch sử tốt = "At risk" (có nguy cơ rời bỏ); v.v. Trực giác này cũ mà bền: người vừa mua gần đây và mua thường xuyên dễ phản hồi thông điệp tiếp theo hơn.</p>
<h3>✍️ Ví dụ — sáu khách hàng</h3>
<pre><code class="language-python">import pandas as pd

tx = pd.DataFrame({
    "customer": ["A", "A", "A", "B", "C", "C", "D", "D", "D", "D", "E", "F", "F"],
    "date": pd.to_datetime(["2026-09-02", "2026-10-10", "2026-10-28", "2026-05-14",
                            "2026-08-01", "2026-10-25", "2026-10-01", "2026-10-12",
                            "2026-10-20", "2026-10-30", "2026-03-03", "2026-07-07", "2026-07-20"]),
    "amount": [300, 250, 400, 1200, 150, 180, 500, 450, 600, 550, 90, 200, 260],  # thousand VND
})
today = pd.Timestamp("2026-11-01")
rfm = tx.groupby("customer").agg(
    recency=("date", lambda d: (today - d.max()).days),
    frequency=("date", "count"),
    monetary=("amount", "sum"),
)
# score 1-3 with rank-based tertiles (3 = best)
rfm["R"] = pd.qcut(rfm.recency.rank(method="first"), 3, labels=[3, 2, 1]).astype(int)
rfm["F"] = pd.qcut(rfm.frequency.rank(method="first"), 3, labels=[1, 2, 3]).astype(int)
rfm["M"] = pd.qcut(rfm.monetary.rank(method="first"), 3, labels=[1, 2, 3]).astype(int)
rfm["segment"] = rfm.apply(lambda r: "Champion" if r.R + r.F + r.M &gt;= 8
                           else "At risk" if r.R == 1 else "Develop", axis=1)
print(rfm)
</code></pre>
<div class="out">          recency  frequency  monetary  R  F  M   segment
customer                                                 
A               4          3       950  3  3  2  Champion
B             171          1      1200  1  1  3   At risk
C               7          2       330  2  2  1   Develop
D               2          4      2100  3  3  3  Champion
E             243          1        90  1  1  1   At risk
F             104          2       460  2  2  2   Develop</div>
<p><strong>Đọc kết quả.</strong> D mua bốn lần, lần gần nhất hai ngày trước, chi nhiều nhất — Champion. A cũng là Champion. B chi nhiều (1,2 triệu) nhưng chỉ một lần, cách đây 171 ngày — "At risk": một khách lớn trong quá khứ đã im lặng, đáng gửi thông điệp kéo lại cá nhân hoá. E thấp ở mọi chiều — cùng lắm là một lời nhắc chi phí thấp. C và F ở giữa — nhóm "Develop" (phát triển) với bán chéo hoặc voucher cho lần mua thứ hai.</p>
<h3>Từ phân khúc đến truyền thông</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Champions</span><span class="v">Ưu tiên trải nghiệm sớm, chương trình giới thiệu bạn, xin đánh giá; tránh giảm giá mà họ không cần.</span></div>
<div class="kv"><span class="k">At risk</span><span class="v">Thông điệp cá nhân "tụi mình nhớ bạn", hỏi lý do; ưu đãi có thời hạn.</span></div>
<div class="kv"><span class="k">Develop</span><span class="v">Gợi ý dựa trên lần mua trước, ưu đãi combo.</span></div>
</div>
<p>Sau đó <strong>kiểm chứng</strong>: gửi ưu đãi kéo lại cho một nửa ngẫu nhiên của nhóm "At risk" và so với nửa kia (Chương 8). Nếu không, bạn không thể biết ưu đãi có thật sự khiến khách quay lại.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Các phân khúc khác nhau trên giấy nhưng nhận cùng một thông điệp — phân khúc mà không hành động.</li><li>Chấm ngũ phân vị trên dữ liệu tí hon, nơi một khách làm dịch chuyển cả nhóm.</li><li>Quên rằng RFM cần lịch sử mua — nó không nói gì về khách tiềm năng.</li><li>Dùng thuộc tính nhạy cảm (sức khoẻ, tôn giáo) để nhắm chọn mà không có cơ sở pháp lý (Chương 12).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Cơ sở: nhân khẩu, địa lý, tâm lý, hành vi.</li><li>Phân khúc tốt: đo được, đủ lớn, tiếp cận được, khác biệt, hành động được.</li><li>RFM: recency, frequency, monetary — chấm điểm và kết hợp thành các nhóm có tên.</li><li>Mỗi phân khúc cần một thông điệp, một kênh và một phép thử.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://en.wikipedia.org/wiki/RFM_(market_research)" target="_blank" rel="noopener">Wikipedia — RFM (nghiên cứu thị trường)</a></li><li><a href="https://pandas.pydata.org/docs/user_guide/groupby.html" target="_blank" rel="noopener">pandas — Group by (agg) để tính RFM</a></li><li><a href="https://data-science-for-biz.com/" target="_blank" rel="noopener">Provost &amp; Fawcett — Data Science for Business (trang sách)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Khách X mua 10 lần nhưng lần cuối cách đây 200 ngày. Chữ nào trong RFM yếu và bạn sẽ gửi thông điệp gì?</li><li>Vì sao "nữ 18–35 tuổi ở Việt Nam" là phân khúc yếu cho email CRM của một thương hiệu cà phê?</li><li>Viết lệnh tổng hợp pandas tính frequency cho mỗi khách.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Recency yếu (F và có lẽ M mạnh) → khách trung thành đã rời: thông điệp kéo lại cá nhân, hỏi điều gì đã thay đổi, ưu đãi đúng món họ hay mua. 2) Quá rộng và không theo hành vi — không cho biết thành viên đã làm gì hay sẽ phản hồi điều gì; phân khúc RFM hoặc theo nhóm sản phẩm đã mua hành động được hơn. 3) <code>tx.groupby("customer")["date"].count()</code> (hoặc <code>.agg(frequency=("date", "count"))</code>).</p></div>`);

const l6_2 = L('aba201c-ts-6-2',
  '6.2 — K-means clustering: letting the data propose segments|||6.2 — Phân cụm k-means: để dữ liệu đề xuất phân khúc',
  'Phân cụm là gì, các bước của k-means, vì sao phải chuẩn hoá biến, code scikit-learn tạo ba cụm từ hành vi truy cập và chi tiêu, đọc hồ sơ cụm.',
  `<span class="eyebrow">ABA201c · Chapter 6 · Lesson 6.2</span>
<h2>K-means clustering</h2>
<p class="lead">RFM uses rules you choose. Clustering lets the data propose groups by itself, using many variables at once. It is unsupervised: there is no "right answer" column — only patterns of similarity.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain how k-means works, step by step.</li><li>Explain why variables must be standardised.</li><li>Run k-means in scikit-learn and profile the clusters.</li></ul>
<h3>📖 Lecture</h3>
<h3>The algorithm</h3>
<p><strong>K-means</strong> groups points into k clusters so that each point is close to the centre (mean) of its cluster:</p>
<ol>
<li>Choose k and place k starting centres (scikit-learn uses a smart random start called k-means++).</li>
<li><strong>Assign</strong> each customer to the nearest centre.</li>
<li><strong>Update</strong> each centre to the average of the customers assigned to it.</li>
<li>Repeat steps 2–3 until assignments stop changing.</li>
</ol>
<p>The result depends on the starting centres, so the algorithm is run several times (<code>n_init</code>) and the best solution — the one with the smallest total squared distance to centres (<em>inertia</em>) — is kept.</p>
<h3>Why standardise?</h3>
<p>"Nearest" is measured by distance. If spend is in thousands of VND (values around 100–1,300) and visits are counts (2–12), spend dominates every distance and visits barely matter. <strong>Standardising</strong> (subtract the mean, divide by the standard deviation) puts every variable on the same scale, so each contributes fairly. Lesson 6.3 shows what happens when you skip this.</p>
<h3>✍️ Worked example — website visitors</h3>
<p>We simulate 90 users of an online cosmetics shop with three behaviours: visits per month, minutes per visit and spend (thousand VND). We hid three groups in the data; can k-means find them?</p>
<pre><code class="language-python">import numpy as np, pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

rng = np.random.default_rng(1)
def grp(n, visits, minutes, spend):
    return np.column_stack([rng.normal(visits, 1, n), rng.normal(minutes, 3, n),
                            rng.normal(spend, 80, n)])
X = np.vstack([grp(30, 2, 5, 150),     # occasional bargain hunters
               grp(30, 12, 25, 300),   # engaged browsers
               grp(30, 6, 10, 1200)])  # high-value buyers
df = pd.DataFrame(X.clip(min=0), columns=["visits_month", "minutes_visit", "spend_k"])

Z = StandardScaler().fit_transform(df)        # put features on the same scale
km = KMeans(n_clusters=3, n_init=10, random_state=0).fit(Z)
df["cluster"] = km.labels_
print(df.groupby("cluster").mean().round(1))
print(df["cluster"].value_counts().sort_index())
</code></pre>
<div class="out">         visits_month  minutes_visit  spend_k
cluster                                      
0                12.0           24.4    297.4
1                 6.0            9.0   1181.6
2                 2.0            4.9    142.5
cluster
0    30
1    30
2    30
Name: count, dtype: int64</div>
<p><strong>Reading the cluster profile</strong> (averages of each cluster in original units):</p>
<div class="kv-grid">
<div class="kv"><span class="k">Cluster 0 — "Engaged browsers"</span><span class="v">12 visits a month, 24 minutes a visit, moderate spend (~297k). They love content: tutorials, reviews, livestreams. Goal: convert attention into purchases (bundles, "shop the look").</span></div>
<div class="kv"><span class="k">Cluster 1 — "High-value buyers"</span><span class="v">6 visits, short sessions (9 min), high spend (~1.18 million). They know what they want. Goal: retention, VIP service, fast reorder.</span></div>
<div class="kv"><span class="k">Cluster 2 — "Occasional bargain hunters"</span><span class="v">2 visits, 5 minutes, low spend (~143k). Goal: low-cost reminders around sales; do not over-invest.</span></div>
</div>
<p>The cluster numbers (0, 1, 2) are arbitrary labels; the names are your interpretation. Each cluster has 30 members, matching the groups we hid — in real data clusters are never this clean, and you must check whether they are stable and meaningful.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting to standardise, so the variable with the biggest numbers decides everything.</li><li>Including IDs or phone numbers as features — they are labels, not behaviour.</li><li>Treating cluster names as facts — they are hypotheses to validate with campaigns.</li><li>Expecting k-means to find odd-shaped or very unequal groups; it prefers round, similar-sized clusters.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>K-means: assign to nearest centre, move centres, repeat.</li><li>Standardise variables first; run several starts.</li><li>Profile clusters with averages in original units, then name them.</li><li>Clusters are hypotheses — validate with action and tests.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://developers.google.com/machine-learning/clustering/kmeans/overview" target="_blank" rel="noopener">Google — What is k-means clustering?</a></li><li><a href="https://scikit-learn.org/stable/modules/clustering.html" target="_blank" rel="noopener">scikit-learn — Clustering (k-means section)</a></li><li><a href="https://scikit-learn.org/stable/modules/preprocessing.html" target="_blank" rel="noopener">scikit-learn — Preprocessing (StandardScaler)</a></li><li><a href="https://www.ibm.com/think/topics/k-means-clustering" target="_blank" rel="noopener">IBM — What is k-means clustering?</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Put the k-means steps in order: (a) move centres to the mean, (b) choose k, (c) assign points to the nearest centre, (d) repeat until stable.</li><li>A dataset has "age" (18–60) and "annual spend" (0–50,000,000 VND). Without scaling, which variable dominates the clusters?</li><li>Suggest one communication action for "Engaged browsers".</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) b → c → a → d. 2) Annual spend — its differences are millions, while age differences are tens. 3) e.g. add "buy the products in this tutorial" links and a first-purchase bundle in their favourite content; retarget viewers of three or more tutorials.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 6 · Bài 6.2</span>
<h2>Phân cụm k-means</h2>
<p class="lead">RFM dùng quy tắc do bạn chọn. Phân cụm để dữ liệu tự đề xuất các nhóm, dùng nhiều biến cùng lúc. Đây là phương pháp không giám sát: không có cột "đáp án đúng" — chỉ có các mẫu hình tương đồng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích k-means hoạt động từng bước.</li><li>Giải thích vì sao phải chuẩn hoá biến.</li><li>Chạy k-means bằng scikit-learn và lập hồ sơ các cụm.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Thuật toán</h3>
<p><strong>K-means</strong> nhóm các điểm vào k cụm sao cho mỗi điểm gần tâm (trung bình) của cụm mình:</p>
<ol>
<li>Chọn k và đặt k tâm khởi đầu (scikit-learn dùng cách khởi đầu ngẫu nhiên thông minh gọi là k-means++).</li>
<li><strong>Gán</strong> mỗi khách vào tâm gần nhất.</li>
<li><strong>Cập nhật</strong> mỗi tâm thành trung bình của các khách được gán vào nó.</li>
<li>Lặp bước 2–3 đến khi việc gán không còn thay đổi.</li>
</ol>
<p>Kết quả phụ thuộc vào tâm khởi đầu, nên thuật toán được chạy nhiều lần (<code>n_init</code>) và giữ lời giải tốt nhất — lời giải có tổng bình phương khoảng cách tới tâm nhỏ nhất (<em>inertia</em>).</p>
<h3>Vì sao phải chuẩn hoá?</h3>
<p>"Gần nhất" được đo bằng khoảng cách. Nếu chi tiêu tính bằng nghìn đồng (giá trị khoảng 100–1.300) còn số lượt truy cập là số đếm (2–12), chi tiêu sẽ áp đảo mọi khoảng cách và lượt truy cập gần như vô nghĩa. <strong>Chuẩn hoá</strong> (trừ trung bình, chia độ lệch chuẩn) đưa mọi biến về cùng thang đo, để biến nào cũng góp phần công bằng. Bài 6.3 cho thấy chuyện gì xảy ra khi bỏ bước này.</p>
<h3>✍️ Ví dụ — khách truy cập website</h3>
<p>Ta giả lập 90 người dùng của một shop mỹ phẩm online với ba hành vi: số lượt truy cập mỗi tháng, số phút mỗi lượt và chi tiêu (nghìn đồng). Ta đã giấu ba nhóm trong dữ liệu; k-means có tìm ra không?</p>
<pre><code class="language-python">import numpy as np, pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

rng = np.random.default_rng(1)
def grp(n, visits, minutes, spend):
    return np.column_stack([rng.normal(visits, 1, n), rng.normal(minutes, 3, n),
                            rng.normal(spend, 80, n)])
X = np.vstack([grp(30, 2, 5, 150),     # occasional bargain hunters
               grp(30, 12, 25, 300),   # engaged browsers
               grp(30, 6, 10, 1200)])  # high-value buyers
df = pd.DataFrame(X.clip(min=0), columns=["visits_month", "minutes_visit", "spend_k"])

Z = StandardScaler().fit_transform(df)        # put features on the same scale
km = KMeans(n_clusters=3, n_init=10, random_state=0).fit(Z)
df["cluster"] = km.labels_
print(df.groupby("cluster").mean().round(1))
print(df["cluster"].value_counts().sort_index())
</code></pre>
<div class="out">         visits_month  minutes_visit  spend_k
cluster                                      
0                12.0           24.4    297.4
1                 6.0            9.0   1181.6
2                 2.0            4.9    142.5
cluster
0    30
1    30
2    30
Name: count, dtype: int64</div>
<p><strong>Đọc hồ sơ cụm</strong> (trung bình của mỗi cụm theo đơn vị gốc):</p>
<div class="kv-grid">
<div class="kv"><span class="k">Cụm 0 — "Người xem nhiệt tình"</span><span class="v">12 lượt/tháng, 24 phút/lượt, chi vừa (~297 nghìn). Họ mê nội dung: hướng dẫn, review, livestream. Mục tiêu: biến sự chú ý thành mua hàng (combo, "mua đúng bộ trong video").</span></div>
<div class="kv"><span class="k">Cụm 1 — "Người mua giá trị cao"</span><span class="v">6 lượt, phiên ngắn (9 phút), chi cao (~1,18 triệu). Họ biết mình muốn gì. Mục tiêu: giữ chân, dịch vụ VIP, đặt lại nhanh.</span></div>
<div class="kv"><span class="k">Cụm 2 — "Thợ săn khuyến mãi thỉnh thoảng"</span><span class="v">2 lượt, 5 phút, chi thấp (~143 nghìn). Mục tiêu: nhắc nhở chi phí thấp quanh các đợt sale; đừng đầu tư quá tay.</span></div>
</div>
<p>Số thứ tự cụm (0, 1, 2) chỉ là nhãn tuỳ ý; tên gọi là cách bạn diễn giải. Mỗi cụm có 30 thành viên, khớp đúng các nhóm ta đã giấu — với dữ liệu thật, cụm không bao giờ gọn như vậy, và bạn phải kiểm xem chúng có ổn định, có ý nghĩa không.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên chuẩn hoá, để biến có con số lớn nhất quyết định tất cả.</li><li>Đưa mã khách hay số điện thoại vào làm đặc trưng — đó là nhãn, không phải hành vi.</li><li>Coi tên cụm là sự thật — chúng là giả thuyết cần kiểm chứng bằng chiến dịch.</li><li>Mong k-means tìm được nhóm hình thù kỳ lạ hay chênh lệch kích thước lớn; nó ưa các cụm tròn, cỡ tương đương.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>K-means: gán vào tâm gần nhất, dời tâm, lặp lại.</li><li>Chuẩn hoá biến trước; chạy nhiều lần khởi đầu.</li><li>Lập hồ sơ cụm bằng trung bình theo đơn vị gốc, rồi đặt tên.</li><li>Cụm là giả thuyết — kiểm chứng bằng hành động và thử nghiệm.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://developers.google.com/machine-learning/clustering/kmeans/overview" target="_blank" rel="noopener">Google — K-means clustering là gì?</a></li><li><a href="https://scikit-learn.org/stable/modules/clustering.html" target="_blank" rel="noopener">scikit-learn — Phân cụm (mục k-means)</a></li><li><a href="https://scikit-learn.org/stable/modules/preprocessing.html" target="_blank" rel="noopener">scikit-learn — Tiền xử lý (StandardScaler)</a></li><li><a href="https://www.ibm.com/think/topics/k-means-clustering" target="_blank" rel="noopener">IBM — K-means clustering là gì?</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Sắp xếp các bước k-means: (a) dời tâm về trung bình, (b) chọn k, (c) gán điểm vào tâm gần nhất, (d) lặp tới khi ổn định.</li><li>Bộ dữ liệu có "tuổi" (18–60) và "chi tiêu năm" (0–50.000.000 VND). Không chuẩn hoá thì biến nào áp đảo cụm?</li><li>Đề xuất một hành động truyền thông cho nhóm "Người xem nhiệt tình".</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) b → c → a → d. 2) Chi tiêu năm — chênh lệch của nó tính bằng triệu, còn chênh lệch tuổi chỉ vài chục. 3) Ví dụ gắn link "mua đúng sản phẩm trong video hướng dẫn" và combo mua lần đầu ngay trong nội dung họ thích; quảng cáo bám đuổi người đã xem từ ba video hướng dẫn trở lên.</p></div>`);

const l6_3 = L('aba201c-ts-6-3',
  '6.3 — Choosing the number of clusters and turning clusters into personas|||6.3 — Chọn số cụm và biến cụm thành persona',
  'Phương pháp elbow (inertia) và silhouette để chọn k, thử nghiệm bỏ chuẩn hoá, tiêu chí kinh doanh khi chọn k, cách viết persona từ dữ liệu và tránh khuôn mẫu.',
  `<span class="eyebrow">ABA201c · Chapter 6 · Lesson 6.3</span>
<h2>Choosing k and building personas</h2>
<p class="lead">K-means always returns k clusters — even if the data has no real groups. Choosing k combines a statistical check with a business question: how many segments can the team actually serve with different messages?</p>
<h3>🎯 Objectives</h3>
<ul><li>Use the elbow method and the silhouette score to compare values of k.</li><li>See the effect of skipping standardisation.</li><li>Write data-driven personas that avoid stereotypes.</li></ul>
<h3>📖 Lecture</h3>
<h3>Two statistical checks</h3>
<ul>
<li><strong>Elbow method</strong>: plot inertia (total squared distance to centres) for k = 1, 2, 3… Inertia always falls as k grows; look for the "elbow" where adding another cluster brings little improvement.</li>
<li><strong>Silhouette score</strong>: for each point, compare how close it is to its own cluster with how close it is to the next-nearest cluster. Values range from −1 to 1; higher means well-separated clusters. Average it over all points and compare k values.</li>
</ul>
<h3>The business check</h3>
<p>Statistics suggest a range; the business decides. Ask: Can each segment get a <em>different</em> message, offer or channel? Is each large enough to justify the effort? Do the segments make sense to the people who will use them? A statistically perfect 9-cluster solution is useless if the content team can produce only three variations.</p>
<h3>✍️ Worked example — comparing k</h3>
<p>Same simulated shop as lesson 6.2. We try k = 2 to 6 on standardised data, then try k = 3 on <em>unscaled</em> data and judge it on the scaled space:</p>
<pre><code class="language-python">import numpy as np, pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

rng = np.random.default_rng(1)
def grp(n, visits, minutes, spend):
    return np.column_stack([rng.normal(visits, 1, n), rng.normal(minutes, 3, n),
                            rng.normal(spend, 80, n)])
X = np.vstack([grp(30, 2, 5, 150), grp(30, 12, 25, 300), grp(30, 6, 10, 1200)]).clip(min=0)
Z = StandardScaler().fit_transform(X)
for k in range(2, 7):
    km = KMeans(n_clusters=k, n_init=10, random_state=0).fit(Z)
    print(f"k={k}  inertia={km.inertia_:7.1f}  silhouette={silhouette_score(Z, km.labels_):.3f}")

# what happens WITHOUT scaling: spend dominates the distance
km_raw = KMeans(n_clusters=3, n_init=10, random_state=0).fit(X)
print("silhouette on raw (unscaled) data, judged on scaled space:",
      round(silhouette_score(Z, km_raw.labels_), 3))
</code></pre>
<div class="out">k=2  inertia=  107.0  silhouette=0.612
k=3  inertia=   14.4  silhouette=0.805
k=4  inertia=   12.1  silhouette=0.646
k=5  inertia=   10.2  silhouette=0.477
k=6  inertia=    8.3  silhouette=0.340
silhouette on raw (unscaled) data, judged on scaled space: 0.616</div>
<p><strong>Reading the output.</strong> Inertia drops sharply from k = 2 (107.0) to k = 3 (14.4), then only slowly — the elbow is at 3. The silhouette is highest at k = 3 (0.805) and falls afterwards. Both agree with the three groups we hid. Without scaling, k-means mostly splits customers by spend, the variable with the biggest numbers, and the silhouette falls to 0.616 — worse segments from the same data, caused only by a preprocessing step.</p>
<h3>From cluster to persona</h3>
<p>A <strong>persona</strong> is a short, human description of a segment that helps creative teams write for real people. A data-driven persona contains:</p>
<ol>
<li><strong>Name and size</strong>: "Linh, the engaged browser — 33% of active users, 21% of revenue."</li>
<li><strong>Behaviour facts</strong> from the cluster profile (visits, time, spend, preferred content and channel).</li>
<li><strong>Needs and barriers</strong>, ideally from qualitative research (interviews, survey answers, comments) — clustering tells you <em>what</em>, people tell you <em>why</em>.</li>
<li><strong>Message, offer and channel</strong> for this segment, and the KPI to watch.</li>
</ol>
<p>Avoid inventing details the data does not support (age, gender, hobbies) just to make the persona vivid — that is how stereotypes enter strategy.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Picking k only from the elbow plot when there is no clear elbow — use silhouette and business sense too.</li><li>Re-running clustering every month and getting new segments, so campaigns cannot be compared; fix the definition for a period.</li><li>Personas full of guessed demographics.</li><li>Not checking that segments respond differently — if they do not, merge them.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Elbow: where inertia stops falling fast; silhouette: higher is better separated.</li><li>Standardisation changes the result — always scale distance-based methods.</li><li>Final k = statistical evidence + what the team can act on.</li><li>Personas combine cluster facts with qualitative "why", without invented stereotypes.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://scikit-learn.org/stable/auto_examples/cluster/plot_kmeans_silhouette_analysis.html" target="_blank" rel="noopener">scikit-learn — Selecting the number of clusters with silhouette analysis</a></li><li><a href="https://developers.google.com/machine-learning/clustering" target="_blank" rel="noopener">Google — Introduction to clustering</a></li><li><a href="https://www.statlearning.com/" target="_blank" rel="noopener">James et al. — An Introduction to Statistical Learning (chapter on unsupervised learning)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Inertia for k = 1…5: 300, 180, 90, 80, 74. Where is the elbow?</li><li>Silhouette for k = 2, 3, 4: 0.41, 0.38, 0.52. The team can serve at most three segments. Which k do you choose?</li><li>Rewrite this persona to be data-driven: "Mai, 22, loves K-pop, buys cheap lipstick."</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) k = 3 — big drops until 3, small after. 2) Within the team's limit, k = 2 has the better silhouette (0.41 vs 0.38); you could also test k = 4 and merge two similar clusters if they respond alike. 3) e.g. "Bargain hunters — 28% of customers, 9% of revenue: 2 visits/month, 5 minutes, average basket 143k, 80% of purchases during sales. Offer: flash-sale reminder by Zalo; KPI: purchase rate during sale weeks." (Add interests only if survey data supports them.)</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 6 · Bài 6.3</span>
<h2>Chọn k và xây persona</h2>
<p class="lead">K-means luôn trả về k cụm — kể cả khi dữ liệu không có nhóm thật nào. Chọn k kết hợp một phép kiểm thống kê với một câu hỏi kinh doanh: đội ngũ thật sự phục vụ được bao nhiêu phân khúc bằng thông điệp khác nhau?</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dùng phương pháp elbow và điểm silhouette để so các giá trị k.</li><li>Thấy hậu quả khi bỏ chuẩn hoá.</li><li>Viết persona dựa trên dữ liệu, tránh khuôn mẫu.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Hai phép kiểm thống kê</h3>
<ul>
<li><strong>Phương pháp elbow (khuỷu tay)</strong>: vẽ inertia (tổng bình phương khoảng cách tới tâm) với k = 1, 2, 3… Inertia luôn giảm khi k tăng; hãy tìm "khuỷu tay" — chỗ thêm một cụm không cải thiện bao nhiêu nữa.</li>
<li><strong>Điểm silhouette</strong>: với mỗi điểm, so độ gần với cụm của nó và độ gần với cụm gần thứ hai. Giá trị từ −1 đến 1; càng cao các cụm càng tách bạch. Lấy trung bình trên mọi điểm và so giữa các k.</li>
</ul>
<h3>Phép kiểm kinh doanh</h3>
<p>Thống kê gợi ý một khoảng; kinh doanh mới quyết định. Hãy hỏi: Mỗi phân khúc có nhận được thông điệp, ưu đãi hay kênh <em>khác nhau</em> không? Mỗi nhóm có đủ lớn để đáng công sức? Các phân khúc có hợp lý với những người sẽ dùng chúng? Lời giải 9 cụm hoàn hảo về thống kê là vô dụng nếu đội nội dung chỉ làm nổi ba phiên bản.</p>
<h3>✍️ Ví dụ — so sánh các giá trị k</h3>
<p>Vẫn shop giả lập ở bài 6.2. Ta thử k = 2 đến 6 trên dữ liệu đã chuẩn hoá, rồi thử k = 3 trên dữ liệu <em>chưa chuẩn hoá</em> và chấm nó trên không gian đã chuẩn hoá:</p>
<pre><code class="language-python">import numpy as np, pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

rng = np.random.default_rng(1)
def grp(n, visits, minutes, spend):
    return np.column_stack([rng.normal(visits, 1, n), rng.normal(minutes, 3, n),
                            rng.normal(spend, 80, n)])
X = np.vstack([grp(30, 2, 5, 150), grp(30, 12, 25, 300), grp(30, 6, 10, 1200)]).clip(min=0)
Z = StandardScaler().fit_transform(X)
for k in range(2, 7):
    km = KMeans(n_clusters=k, n_init=10, random_state=0).fit(Z)
    print(f"k={k}  inertia={km.inertia_:7.1f}  silhouette={silhouette_score(Z, km.labels_):.3f}")

# what happens WITHOUT scaling: spend dominates the distance
km_raw = KMeans(n_clusters=3, n_init=10, random_state=0).fit(X)
print("silhouette on raw (unscaled) data, judged on scaled space:",
      round(silhouette_score(Z, km_raw.labels_), 3))
</code></pre>
<div class="out">k=2  inertia=  107.0  silhouette=0.612
k=3  inertia=   14.4  silhouette=0.805
k=4  inertia=   12.1  silhouette=0.646
k=5  inertia=   10.2  silhouette=0.477
k=6  inertia=    8.3  silhouette=0.340
silhouette on raw (unscaled) data, judged on scaled space: 0.616</div>
<p><strong>Đọc kết quả.</strong> Inertia giảm mạnh từ k = 2 (107,0) xuống k = 3 (14,4), sau đó giảm chậm — khuỷu tay ở 3. Silhouette cao nhất ở k = 3 (0,805) rồi giảm dần. Cả hai khớp với ba nhóm ta đã giấu. Không chuẩn hoá, k-means chủ yếu chia khách theo chi tiêu, biến có con số lớn nhất, và silhouette tụt xuống 0,616 — phân khúc tệ hơn từ cùng một dữ liệu, chỉ vì một bước tiền xử lý.</p>
<h3>Từ cụm đến persona</h3>
<p><strong>Persona</strong> là mô tả ngắn, mang tính con người, về một phân khúc, giúp đội sáng tạo viết cho người thật. Một persona dựa trên dữ liệu gồm:</p>
<ol>
<li><strong>Tên và quy mô</strong>: "Linh, người xem nhiệt tình — 33% người dùng hoạt động, 21% doanh thu."</li>
<li><strong>Sự thật về hành vi</strong> từ hồ sơ cụm (lượt truy cập, thời gian, chi tiêu, nội dung và kênh ưa thích).</li>
<li><strong>Nhu cầu và rào cản</strong>, lý tưởng là từ nghiên cứu định tính (phỏng vấn, câu trả lời khảo sát, bình luận) — phân cụm cho biết <em>điều gì</em>, con người cho biết <em>vì sao</em>.</li>
<li><strong>Thông điệp, ưu đãi và kênh</strong> cho phân khúc này, cùng KPI cần theo dõi.</li>
</ol>
<p>Tránh bịa chi tiết mà dữ liệu không ủng hộ (tuổi, giới tính, sở thích) chỉ để persona sinh động — đó là cách khuôn mẫu lọt vào chiến lược.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chọn k chỉ từ biểu đồ elbow khi không có khuỷu rõ — hãy dùng thêm silhouette và óc kinh doanh.</li><li>Phân cụm lại mỗi tháng và ra phân khúc mới, khiến chiến dịch không so sánh được; hãy cố định định nghĩa trong một giai đoạn.</li><li>Persona đầy nhân khẩu học đoán mò.</li><li>Không kiểm xem các phân khúc có phản ứng khác nhau — nếu không, hãy gộp lại.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Elbow: nơi inertia ngừng giảm nhanh; silhouette: càng cao càng tách bạch.</li><li>Chuẩn hoá làm đổi kết quả — luôn chuẩn hoá với phương pháp dựa trên khoảng cách.</li><li>k cuối cùng = bằng chứng thống kê + điều đội ngũ hành động được.</li><li>Persona kết hợp sự thật từ cụm với "vì sao" định tính, không bịa khuôn mẫu.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://scikit-learn.org/stable/auto_examples/cluster/plot_kmeans_silhouette_analysis.html" target="_blank" rel="noopener">scikit-learn — Chọn số cụm bằng phân tích silhouette</a></li><li><a href="https://developers.google.com/machine-learning/clustering" target="_blank" rel="noopener">Google — Nhập môn phân cụm</a></li><li><a href="https://www.statlearning.com/" target="_blank" rel="noopener">James và cộng sự — An Introduction to Statistical Learning (chương học không giám sát)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Inertia với k = 1…5: 300, 180, 90, 80, 74. Khuỷu tay ở đâu?</li><li>Silhouette với k = 2, 3, 4: 0,41; 0,38; 0,52. Đội chỉ phục vụ được tối đa ba phân khúc. Bạn chọn k nào?</li><li>Viết lại persona này cho dựa trên dữ liệu: "Mai, 22 tuổi, mê K-pop, mua son giá rẻ."</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) k = 3 — giảm mạnh tới 3, sau đó giảm ít. 2) Trong giới hạn của đội, k = 2 có silhouette tốt hơn (0,41 so với 0,38); cũng có thể thử k = 4 rồi gộp hai cụm giống nhau nếu chúng phản ứng như nhau. 3) Ví dụ "Thợ săn khuyến mãi — 28% khách, 9% doanh thu: 2 lượt/tháng, 5 phút, giỏ trung bình 143 nghìn, 80% lượt mua rơi vào đợt sale. Ưu đãi: nhắc flash sale qua Zalo; KPI: tỷ lệ mua trong tuần sale." (Chỉ thêm sở thích nếu khảo sát ủng hộ.)</p></div>`);

const q6 = QZ(6, 'Chapter 6 quiz — Segmentation and clustering|||Quiz Chương 6 — Phân khúc và phân cụm', '10 câu ôn cơ sở phân khúc, tiêu chí phân khúc tốt, RFM, k-means, chuẩn hoá, elbow, silhouette và persona.', [
  Q('q1', 'Purchase history and response to past campaigns are which segmentation base?|||Lịch sử mua và phản hồi với chiến dịch cũ thuộc cơ sở phân khúc nào?',
    ['Demographic|||Nhân khẩu học', 'Geographic|||Địa lý', 'Psychographic|||Tâm lý', 'Behavioural|||Hành vi'], 3,
    'It describes what people did.|||Nó mô tả người ta đã làm gì.'),
  Q('q2', 'In RFM, "R" (recency) is measured as|||Trong RFM, "R" (recency) được đo bằng',
    ['total revenue|||tổng doanh thu', 'number of orders|||số đơn', 'days since the last purchase|||số ngày từ lần mua gần nhất', 'rating of the product|||điểm đánh giá sản phẩm'], 2,
    'Lower recency (more recent) is better.|||Recency thấp (mua gần đây) là tốt hơn.'),
  Q('q3', 'A customer spent a lot and bought often, but not in the last 6 months. Best segment label?|||Một khách chi nhiều, mua thường xuyên, nhưng 6 tháng nay không mua. Nhãn phù hợp nhất?',
    ['Champion|||Champion', 'At risk|||At risk (có nguy cơ rời bỏ)', 'New customer|||Khách mới', 'Prospect|||Khách tiềm năng'], 1,
    'Strong F and M with weak R signal a valuable customer slipping away.|||F và M mạnh mà R yếu báo hiệu khách giá trị đang rời đi.'),
  Q('q4', 'Which is NOT a criterion of a useful segment?|||Điều nào KHÔNG phải tiêu chí của phân khúc hữu ích?',
    ['Measurable|||Đo được', 'Accessible|||Tiếp cận được', 'Actionable|||Hành động được', 'Named after a celebrity|||Đặt theo tên người nổi tiếng'], 3,
    'Segments must be measurable, substantial, accessible, differentiable and actionable.|||Phân khúc cần đo được, đủ lớn, tiếp cận được, khác biệt và hành động được.'),
  Q('q5', 'In k-means, after assigning points to the nearest centre, the algorithm|||Trong k-means, sau khi gán điểm vào tâm gần nhất, thuật toán',
    ['stops immediately|||dừng ngay', 'moves each centre to the mean of its assigned points|||dời mỗi tâm về trung bình các điểm được gán', 'deletes small clusters|||xoá cụm nhỏ', 'labels customers by name|||gắn tên khách'], 1,
    'Assign and update repeat until stable.|||Gán và cập nhật lặp lại tới khi ổn định.'),
  Q('q6', 'Why standardise variables before k-means?|||Vì sao chuẩn hoá biến trước k-means?',
    ['To remove outliers|||Để bỏ ngoại lai', 'So variables with large numbers do not dominate distances|||Để biến có số lớn không áp đảo khoảng cách', 'To make clusters equal in size|||Để các cụm bằng nhau', 'It is required by law|||Luật bắt buộc'], 1,
    'Distances are scale-sensitive.|||Khoảng cách nhạy với thang đo.'),
  Q('q7', 'Inertia always decreases as k increases. Therefore|||Inertia luôn giảm khi k tăng. Vì vậy',
    ['the largest k is best|||k lớn nhất là tốt nhất', 'look for the elbow where improvement slows|||hãy tìm khuỷu tay nơi mức cải thiện chậm lại', 'inertia is useless|||inertia vô dụng', 'choose k = 1|||chọn k = 1'], 1,
    'Adding clusters always reduces distance; the question is whether it is worth it.|||Thêm cụm luôn giảm khoảng cách; câu hỏi là có đáng không.'),
  Q('q8', 'A silhouette score close to 1 means|||Điểm silhouette gần 1 nghĩa là',
    ['points are much closer to their own cluster than to others|||các điểm gần cụm của mình hơn hẳn các cụm khác', 'clusters overlap heavily|||các cụm chồng lấn nhiều', 'there is only one cluster|||chỉ có một cụm', 'the data is unscaled|||dữ liệu chưa chuẩn hoá'], 0,
    'High silhouette = well-separated clusters.|||Silhouette cao = các cụm tách bạch.'),
  Q('q9', 'The numbers 0, 1, 2 that k-means gives to clusters are|||Các số 0, 1, 2 mà k-means gán cho cụm là',
    ['ranks from best to worst|||thứ hạng từ tốt tới tệ', 'arbitrary labels; meaning comes from the profile|||nhãn tuỳ ý; ý nghĩa đến từ hồ sơ cụm', 'cluster sizes|||kích thước cụm', 'customer IDs|||mã khách'], 1,
    'Profile each cluster in original units, then name it.|||Lập hồ sơ mỗi cụm theo đơn vị gốc rồi đặt tên.'),
  Q('q10', 'A good data-driven persona should|||Một persona dựa trên dữ liệu tốt nên',
    ['include invented age and hobbies to be vivid|||có tuổi và sở thích bịa ra cho sinh động', 'combine cluster facts with real qualitative insight and a clear message plan|||kết hợp sự thật từ cụm với insight định tính thật và kế hoạch thông điệp rõ ràng', 'list every variable|||liệt kê mọi biến', 'avoid any numbers|||tránh mọi con số'], 1,
    'Unsupported details introduce stereotypes.|||Chi tiết không có căn cứ đưa khuôn mẫu vào chiến lược.'),
]);

const ch6 = {
  title: 'Chapter 6 — Audience segmentation and clustering|||Chương 6 — Phân khúc khán giả và phân cụm',
  description: 'Các cơ sở phân khúc (nhân khẩu, địa lý, tâm lý, hành vi), RFM bằng pandas, thuật toán k-means (chuẩn hoá, các bước, hồ sơ cụm), chọn số cụm bằng elbow và silhouette, biến cụm thành persona và chiến lược truyền thông.',
  lessons: [l6_1, l6_2, l6_3, q6],
};

const l7_1 = L('aba201c-ts-7-1',
  '7.1 — Linear regression: how sales move with ad spend (and why it is not causation)|||7.1 — Hồi quy tuyến tính: doanh số đi theo chi phí quảng cáo (và vì sao đó chưa phải nhân quả)',
  'Đường hồi quy, hệ số chặn và hệ số góc, R², dự báo; ví dụ 12 tuần chi phí social và search với scikit-learn; đa cộng tuyến làm hệ số sai lệch; tương quan không phải nhân quả.',
  `<span class="eyebrow">ABA201c · Chapter 7 · Lesson 7.1</span>
<h2>Linear regression</h2>
<p class="lead">"If we spend 10 million more on social ads, how much will sales grow?" Regression is the classic tool for questions about <em>how much</em>. It is also the classic tool for fooling yourself, so we learn both sides.</p>
<h3>🎯 Objectives</h3>
<ul><li>Interpret intercept, coefficients and R² of a linear regression.</li><li>Fit a regression in scikit-learn and make a forecast.</li><li>Recognise multicollinearity and the gap between correlation and causation.</li></ul>
<h3>📖 Lecture</h3>
<p><strong>Linear regression</strong> models a numeric outcome y (weekly sales) as a straight-line combination of inputs x (ad spend by channel):</p>
<div class="formula"><span class="lbl">Linear model</span>ŷ = b<sub>0</sub> + b<sub>1</sub>·x<sub>1</sub> + b<sub>2</sub>·x<sub>2</sub> + …</div>
<ul>
<li><strong>b<sub>0</sub> (intercept)</strong>: predicted sales with zero spend — the "baseline" from brand, word of mouth and habit.</li>
<li><strong>b<sub>1</sub>, b<sub>2</sub> (coefficients)</strong>: how much ŷ changes when one input rises by one unit, <em>holding the others constant</em>.</li>
<li>The model chooses the b's that minimise the sum of squared errors (ordinary least squares).</li>
<li><strong>R²</strong> (0 to 1): the share of variation in y that the model explains. R² = 0.9 means the line follows the data closely — not that the model is causal or useful for decisions.</li>
</ul>
<h3>✍️ Worked example — 12 weeks of spend and sales</h3>
<p>We simulate a brand whose <em>true</em> rule (unknown to the analyst) is sales = 50 + 2·social + 6·search + noise, in million VND. Then we fit a regression and see what it recovers.</p>
<pre><code class="language-python">import numpy as np
from sklearn.linear_model import LinearRegression

# 12 weeks: spend on social ads and on search ads (million VND) and sales (million VND)
social = np.array([10, 12, 8, 15, 20, 18, 5, 9, 14, 22, 25, 16])
search = np.array([5, 6, 5, 7, 8, 8, 4, 6, 7, 9, 10, 8])
rng = np.random.default_rng(3)
sales = 50 + 2.0 * social + 6.0 * search + rng.normal(0, 4, 12)

X = np.column_stack([social, search])
m = LinearRegression().fit(X, sales)
print("intercept:", round(m.intercept_, 1))
print("coef social, search:", np.round(m.coef_, 2))
print("R^2:", round(m.score(X, sales), 3))
print("forecast for social=20, search=10:", round(m.predict([[20, 10]])[0], 1))
print("corr(social, search):", round(np.corrcoef(social, search)[0, 1], 2))
</code></pre>
<div class="out">intercept: 50.6
coef social, search: [3.08 3.58]
R^2: 0.949
forecast for social=20, search=10: 148.1
corr(social, search): 0.98</div>
<p><strong>Reading the output.</strong> R² is 0.949 and the forecast for social = 20, search = 10 is about 148 million — the model predicts well. But the coefficients are wrong: it says social is worth 3.08 and search 3.58 per million spent, while the truth is 2 and 6. Why? Look at the last line: social and search spend have a correlation of 0.98 — the brand always raised both together. The data contain almost no weeks where one moved without the other, so the model cannot tell which one caused the sales. This is <strong>multicollinearity</strong>, and it is extremely common in marketing data, where budgets move together during big campaigns (Tết, 11.11).</p>
<h3>Correlation is not causation</h3>
<p>Regression on observational data shows <em>association</em>. Sales and ad spend both rise before Tết because of the season, not only because of the ads. Reverse causality also happens: teams increase spend when sales are already rising. To estimate the true effect of a channel, analysts use <strong>experiments</strong> (Chapter 8: geo tests, holdouts) or carefully built <strong>marketing mix models</strong> that include seasonality, price and promotions — and they still validate with experiments.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Reading a high R² as proof that spend causes sales.</li><li>Interpreting coefficients when inputs are highly correlated.</li><li>Extrapolating far beyond the data (spend 10× more than ever ⇒ sales 10× more? Ads saturate).</li><li>Ignoring seasonality, price changes and promotions that drive both spend and sales.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>ŷ = b<sub>0</sub> + b<sub>1</sub>x<sub>1</sub> + …; coefficients are effects holding other inputs constant.</li><li>R² measures fit, not causality.</li><li>Correlated inputs make coefficients unreliable even when predictions are good.</li><li>Causal effects need experiments or carefully controlled models.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://developers.google.com/machine-learning/crash-course/linear-regression" target="_blank" rel="noopener">Google ML Crash Course — Linear regression</a></li><li><a href="https://scikit-learn.org/stable/modules/linear_model.html" target="_blank" rel="noopener">scikit-learn — Linear models</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/12-introduction" target="_blank" rel="noopener">OpenStax Introductory Statistics — Ch. 12 Linear regression and correlation</a></li><li><a href="https://www.coursera.org/learn/machine-learning" target="_blank" rel="noopener">Andrew Ng — Supervised Machine Learning: Regression and Classification (Coursera)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A model gives sales = 40 + 1.5·TV (million VND). Interpret 40 and 1.5.</li><li>R² = 0.15 for a model of daily website orders vs email sends. What does it mean?</li><li>Ice-cream sales and drowning accidents are correlated. Name the hidden variable and the marketing analogue.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 40 million baseline sales with no TV spend; each extra million on TV is associated with 1.5 million more sales (within the observed range). 2) Email sends explain only 15% of the day-to-day variation in orders — other factors matter much more; the model is a weak predictor. 3) Hot weather (season). Marketing analogue: Tết drives both ad budgets and sales, so spend and sales correlate even if part of the sales would have happened anyway.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 7 · Bài 7.1</span>
<h2>Hồi quy tuyến tính</h2>
<p class="lead">"Nếu chi thêm 10 triệu cho quảng cáo mạng xã hội, doanh số tăng bao nhiêu?" Hồi quy là công cụ kinh điển cho câu hỏi <em>bao nhiêu</em>. Nó cũng là công cụ kinh điển để tự lừa mình, nên ta học cả hai mặt.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Diễn giải hệ số chặn, các hệ số và R² của hồi quy tuyến tính.</li><li>Khớp mô hình hồi quy bằng scikit-learn và dự báo.</li><li>Nhận ra đa cộng tuyến và khoảng cách giữa tương quan với nhân quả.</li></ul>
<h3>📖 Bài giảng</h3>
<p><strong>Hồi quy tuyến tính</strong> mô hình hoá một kết quả dạng số y (doanh số tuần) như tổ hợp đường thẳng của các đầu vào x (chi phí quảng cáo theo kênh):</p>
<div class="formula"><span class="lbl">Mô hình tuyến tính</span>ŷ = b<sub>0</sub> + b<sub>1</sub>·x<sub>1</sub> + b<sub>2</sub>·x<sub>2</sub> + …</div>
<ul>
<li><strong>b<sub>0</sub> (hệ số chặn)</strong>: doanh số dự đoán khi không chi gì — "mức nền" từ thương hiệu, truyền miệng và thói quen.</li>
<li><strong>b<sub>1</sub>, b<sub>2</sub> (các hệ số)</strong>: ŷ thay đổi bao nhiêu khi một đầu vào tăng một đơn vị, <em>giữ nguyên các đầu vào khác</em>.</li>
<li>Mô hình chọn các b sao cho tổng bình phương sai số nhỏ nhất (bình phương tối thiểu thông thường).</li>
<li><strong>R²</strong> (0 đến 1): phần biến thiên của y mà mô hình giải thích được. R² = 0,9 nghĩa là đường thẳng bám sát dữ liệu — không có nghĩa mô hình mang tính nhân quả hay dùng tốt cho quyết định.</li>
</ul>
<h3>✍️ Ví dụ — 12 tuần chi phí và doanh số</h3>
<p>Ta giả lập một thương hiệu có quy luật <em>thật</em> (analyst không biết) là doanh số = 50 + 2·social + 6·search + nhiễu, đơn vị triệu đồng. Rồi khớp hồi quy và xem nó tìm lại được gì.</p>
<pre><code class="language-python">import numpy as np
from sklearn.linear_model import LinearRegression

# 12 weeks: spend on social ads and on search ads (million VND) and sales (million VND)
social = np.array([10, 12, 8, 15, 20, 18, 5, 9, 14, 22, 25, 16])
search = np.array([5, 6, 5, 7, 8, 8, 4, 6, 7, 9, 10, 8])
rng = np.random.default_rng(3)
sales = 50 + 2.0 * social + 6.0 * search + rng.normal(0, 4, 12)

X = np.column_stack([social, search])
m = LinearRegression().fit(X, sales)
print("intercept:", round(m.intercept_, 1))
print("coef social, search:", np.round(m.coef_, 2))
print("R^2:", round(m.score(X, sales), 3))
print("forecast for social=20, search=10:", round(m.predict([[20, 10]])[0], 1))
print("corr(social, search):", round(np.corrcoef(social, search)[0, 1], 2))
</code></pre>
<div class="out">intercept: 50.6
coef social, search: [3.08 3.58]
R^2: 0.949
forecast for social=20, search=10: 148.1
corr(social, search): 0.98</div>
<p><strong>Đọc kết quả.</strong> R² là 0,949 và dự báo cho social = 20, search = 10 là khoảng 148 triệu — mô hình dự đoán tốt. Nhưng các hệ số thì sai: nó nói mỗi triệu chi cho social đáng 3,08 và search 3,58, trong khi sự thật là 2 và 6. Vì sao? Nhìn dòng cuối: chi phí social và search có tương quan 0,98 — thương hiệu luôn tăng cả hai cùng lúc. Dữ liệu gần như không có tuần nào một kênh thay đổi mà kênh kia đứng yên, nên mô hình không thể biết kênh nào gây ra doanh số. Đó là <strong>đa cộng tuyến</strong>, và nó cực kỳ phổ biến trong dữ liệu marketing, nơi ngân sách các kênh cùng tăng trong các đợt lớn (Tết, 11.11).</p>
<h3>Tương quan không phải nhân quả</h3>
<p>Hồi quy trên dữ liệu quan sát cho thấy <em>sự liên hệ</em>. Doanh số và chi phí quảng cáo cùng tăng trước Tết vì mùa vụ, không chỉ vì quảng cáo. Nhân quả ngược cũng xảy ra: đội marketing tăng chi khi doanh số vốn đã đang tăng. Để ước lượng tác động thật của một kênh, analyst dùng <strong>thử nghiệm</strong> (Chương 8: thử nghiệm theo vùng, nhóm giữ lại) hoặc <strong>mô hình marketing mix</strong> xây cẩn thận có tính mùa vụ, giá và khuyến mãi — và vẫn kiểm lại bằng thử nghiệm.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Coi R² cao là bằng chứng chi phí gây ra doanh số.</li><li>Diễn giải hệ số khi các đầu vào tương quan mạnh với nhau.</li><li>Ngoại suy xa ngoài dữ liệu (chi gấp 10 lần chưa từng có ⇒ doanh số gấp 10? Quảng cáo có điểm bão hoà).</li><li>Bỏ qua mùa vụ, thay đổi giá và khuyến mãi — những thứ đẩy cả chi phí lẫn doanh số.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>ŷ = b<sub>0</sub> + b<sub>1</sub>x<sub>1</sub> + …; hệ số là tác động khi giữ nguyên các đầu vào khác.</li><li>R² đo độ khớp, không đo nhân quả.</li><li>Đầu vào tương quan làm hệ số không đáng tin, kể cả khi dự đoán tốt.</li><li>Tác động nhân quả cần thử nghiệm hoặc mô hình kiểm soát cẩn thận.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://developers.google.com/machine-learning/crash-course/linear-regression" target="_blank" rel="noopener">Google ML Crash Course — Hồi quy tuyến tính</a></li><li><a href="https://scikit-learn.org/stable/modules/linear_model.html" target="_blank" rel="noopener">scikit-learn — Các mô hình tuyến tính</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/12-introduction" target="_blank" rel="noopener">OpenStax Introductory Statistics — Ch. 12 Hồi quy tuyến tính và tương quan</a></li><li><a href="https://www.coursera.org/learn/machine-learning" target="_blank" rel="noopener">Andrew Ng — Supervised Machine Learning: Regression and Classification (Coursera)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Mô hình cho doanh số = 40 + 1,5·TV (triệu đồng). Diễn giải 40 và 1,5.</li><li>R² = 0,15 cho mô hình số đơn website hằng ngày theo số email gửi. Nghĩa là gì?</li><li>Doanh số kem và số vụ đuối nước có tương quan. Nêu biến ẩn và ví dụ tương tự trong marketing.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 40 triệu doanh số nền khi không chi cho TV; mỗi triệu chi thêm cho TV gắn với 1,5 triệu doanh số tăng thêm (trong phạm vi đã quan sát). 2) Số email gửi chỉ giải thích 15% biến động đơn hàng giữa các ngày — các yếu tố khác quan trọng hơn nhiều; mô hình dự đoán yếu. 3) Thời tiết nóng (mùa). Ví dụ marketing: Tết đẩy cả ngân sách quảng cáo lẫn doanh số, nên chi phí và doanh số tương quan dù một phần doanh số vẫn sẽ có dù không quảng cáo.</p></div>`);

const l7_2 = L('aba201c-ts-7-2',
  '7.2 — Classification with logistic regression: who will respond, who will churn?|||7.2 — Phân loại bằng hồi quy logistic: ai sẽ phản hồi, ai sẽ rời bỏ?',
  'Bài toán phân loại trong marketing (phản hồi, rời bỏ, mở email), hồi quy logistic cho ra xác suất, đọc hệ số và tỷ số odds, ví dụ rời bỏ của 400 hội viên với scikit-learn, dùng điểm xác suất để ưu tiên hành động.',
  `<span class="eyebrow">ABA201c · Chapter 7 · Lesson 7.2</span>
<h2>Classification with logistic regression</h2>
<p class="lead">Many marketing questions have a yes/no answer: will this member renew? Will this customer respond to the offer? Will this subscriber open the email? A classifier estimates the <em>probability</em> of "yes" for each person, so you can focus effort where it matters.</p>
<h3>🎯 Objectives</h3>
<ul><li>Recognise classification problems in communications and marketing.</li><li>Explain how logistic regression turns inputs into a probability.</li><li>Interpret coefficients as odds multipliers and use scores to prioritise.</li></ul>
<h3>📖 Lecture</h3>
<h3>Classification problems</h3>
<ul>
<li><strong>Churn</strong>: will a subscriber cancel in the next 30 days?</li>
<li><strong>Response / propensity</strong>: will a customer buy if we send the voucher?</li>
<li><strong>Lead scoring</strong>: which sign-ups will become paying customers?</li>
<li><strong>Content</strong>: is this comment spam? Is it a complaint that needs escalation?</li>
</ul>
<p>The target is a category (yes/no), so a straight-line regression is unsuitable — it can predict "−20% probability". <strong>Logistic regression</strong> keeps the linear combination but passes it through the S-shaped <strong>logistic (sigmoid) function</strong>, which squeezes any number into the range 0–1.</p>
<div class="formula"><span class="lbl">Logistic regression</span>z = b<sub>0</sub> + b<sub>1</sub>x<sub>1</sub> + b<sub>2</sub>x<sub>2</sub> + … · P(yes) = 1 ÷ (1 + e<sup>−z</sup>)</div>
<h3>Reading the coefficients</h3>
<p>A positive coefficient raises the probability; a negative one lowers it. The cleanest interpretation is through <strong>odds</strong> (odds = P ÷ (1 − P)): e<sup>b</sup> is the factor by which the odds are multiplied when that input rises by one unit, other inputs held constant.</p>
<h3>✍️ Worked example — churn of 400 members</h3>
<p>A beauty-box subscription simulates 400 members with three inputs: days since they last opened an email, number of orders in the last 6 months, and whether they filed a complaint.</p>
<pre><code class="language-python">import numpy as np, pandas as pd
from sklearn.linear_model import LogisticRegression

rng = np.random.default_rng(5)
n = 400
df = pd.DataFrame({
    "days_since_open": rng.integers(0, 90, n),     # days since last email opened
    "orders_6m": rng.poisson(2, n),
    "complaints": rng.binomial(1, 0.15, n),
})
logit = -1.5 + 0.04 * df.days_since_open - 0.5 * df.orders_6m + 1.2 * df.complaints
df["churned"] = rng.random(n) &lt; 1 / (1 + np.exp(-logit))
print("churn rate:", round(float(df.churned.mean()), 3))

X = df[["days_since_open", "orders_6m", "complaints"]]
m = LogisticRegression().fit(X, df.churned)
print("coefficients:", {c: round(float(v), 3) for c, v in zip(X.columns, m.coef_[0])})
print("odds multiplier per unit:", {c: round(float(v), 2) for c, v in zip(X.columns, np.exp(m.coef_[0]))})
new = pd.DataFrame({"days_since_open": [5, 60, 80], "orders_6m": [4, 1, 0], "complaints": [0, 0, 1]})
new["P(churn)"] = m.predict_proba(new)[:, 1].round(2)
print(new)
</code></pre>
<div class="out">churn rate: 0.417
coefficients: {'days_since_open': 0.059, 'orders_6m': -0.726, 'complaints': 1.182}
odds multiplier per unit: {'days_since_open': 1.06, 'orders_6m': 0.48, 'complaints': 3.26}
   days_since_open  orders_6m  complaints  P(churn)
0                5          4           0      0.01
1               60          1           0      0.71
2               80          0           1      0.98</div>
<p><strong>Reading the output.</strong></p>
<ul>
<li><strong>days_since_open</strong>: odds of churn × 1.06 for every extra day without opening an email — after 30 silent days, roughly × 1.06<sup>30</sup> ≈ × 5.7.</li>
<li><strong>orders_6m</strong>: each extra order roughly halves the odds (× 0.48) — active buyers stay.</li>
<li><strong>complaints</strong>: a complaint multiplies the odds by about 3.3 — complaint handling is a retention lever.</li>
</ul>
<p>The three new members show how scores drive action: the engaged buyer (5 days, 4 orders) has a churn probability of about 1% — leave them alone; the silent one-time buyer has 71%; the silent complainer has 98%. A retention team with budget for 500 calls a month calls the highest probabilities first.</p>
<h3>Probability, not destiny</h3>
<p>A probability of 0.71 means "among members like this, about 71 in 100 churn", not that this person certainly will. And a high churn probability does not mean the member will respond to your offer — some will leave anyway. Advanced teams model <em>uplift</em>: who changes behaviour <em>because</em> of the action. That again requires experiments (Chapter 8).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using information from the future as an input ("cancelled_subscription_page_visit" recorded after the churn date) — the model looks brilliant and fails in real use. This is <strong>data leakage</strong>.</li><li>Reading coefficients as causes: complaints may be a <em>symptom</em> of a product problem.</li><li>Converting probabilities to yes/no at 0.5 without thinking about costs (lesson 7.3).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Classification predicts categories; logistic regression outputs probabilities.</li><li>e<sup>coefficient</sup> = odds multiplier per unit of input.</li><li>Rank people by probability to prioritise limited effort.</li><li>Beware leakage; prediction is not causation; uplift needs experiments.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://developers.google.com/machine-learning/crash-course/logistic-regression" target="_blank" rel="noopener">Google ML Crash Course — Logistic regression</a></li><li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html" target="_blank" rel="noopener">scikit-learn — LogisticRegression</a></li><li><a href="https://www.kaggle.com/learn/intro-to-machine-learning" target="_blank" rel="noopener">Kaggle Learn — Intro to Machine Learning</a></li><li><a href="https://www.statlearning.com/" target="_blank" rel="noopener">James et al. — ISLP (chapter on classification)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A coefficient for "received a welcome call" is −0.69. What is the odds multiplier, and what does it suggest?</li><li>Why is "number of support tickets in the month AFTER the prediction date" a bad input?</li><li>The model gives P(respond) = 0.08 for customer A and 0.32 for B. If one voucher costs 20,000 VND and a response earns 150,000 VND margin, who is worth targeting?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) e<sup>−0.69</sup> ≈ 0.50: the odds of churn are about halved for members who received the call — worth testing as a retention action (association only until tested). 2) It is future information (leakage); at prediction time you do not know it. 3) Expected margin: A = 0.08 × 150,000 = 12,000 &lt; 20,000 (not worth it); B = 0.32 × 150,000 = 48,000 &gt; 20,000 (worth it).</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 7 · Bài 7.2</span>
<h2>Phân loại bằng hồi quy logistic</h2>
<p class="lead">Nhiều câu hỏi marketing có đáp án có/không: hội viên này có gia hạn? Khách này có phản hồi ưu đãi? Người đăng ký này có mở email? Bộ phân loại ước lượng <em>xác suất</em> "có" cho từng người, để bạn dồn công sức vào nơi đáng nhất.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận ra bài toán phân loại trong truyền thông và marketing.</li><li>Giải thích hồi quy logistic biến đầu vào thành xác suất thế nào.</li><li>Diễn giải hệ số như hệ số nhân odds và dùng điểm số để ưu tiên.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Các bài toán phân loại</h3>
<ul>
<li><strong>Rời bỏ (churn)</strong>: người đăng ký có huỷ trong 30 ngày tới?</li>
<li><strong>Phản hồi / xu hướng (propensity)</strong>: khách có mua nếu ta gửi voucher?</li>
<li><strong>Chấm điểm lead</strong>: người đăng ký nào sẽ thành khách trả tiền?</li>
<li><strong>Nội dung</strong>: bình luận này có phải spam? Có phải khiếu nại cần chuyển cấp?</li>
</ul>
<p>Mục tiêu là một nhóm (có/không), nên hồi quy đường thẳng không phù hợp — nó có thể dự đoán "xác suất −20%". <strong>Hồi quy logistic</strong> giữ tổ hợp tuyến tính nhưng đưa nó qua <strong>hàm logistic (sigmoid)</strong> hình chữ S, ép mọi con số vào khoảng 0–1.</p>
<div class="formula"><span class="lbl">Hồi quy logistic</span>z = b<sub>0</sub> + b<sub>1</sub>x<sub>1</sub> + b<sub>2</sub>x<sub>2</sub> + … · P(có) = 1 ÷ (1 + e<sup>−z</sup>)</div>
<h3>Đọc các hệ số</h3>
<p>Hệ số dương làm tăng xác suất; hệ số âm làm giảm. Cách diễn giải gọn nhất là qua <strong>odds</strong> (odds = P ÷ (1 − P)): e<sup>b</sup> là hệ số mà odds được nhân lên khi đầu vào đó tăng một đơn vị, giữ nguyên các đầu vào khác.</p>
<h3>✍️ Ví dụ — rời bỏ của 400 hội viên</h3>
<p>Một dịch vụ hộp mỹ phẩm theo tháng giả lập 400 hội viên với ba đầu vào: số ngày từ lần mở email gần nhất, số đơn trong 6 tháng qua, và có từng khiếu nại hay không.</p>
<pre><code class="language-python">import numpy as np, pandas as pd
from sklearn.linear_model import LogisticRegression

rng = np.random.default_rng(5)
n = 400
df = pd.DataFrame({
    "days_since_open": rng.integers(0, 90, n),     # days since last email opened
    "orders_6m": rng.poisson(2, n),
    "complaints": rng.binomial(1, 0.15, n),
})
logit = -1.5 + 0.04 * df.days_since_open - 0.5 * df.orders_6m + 1.2 * df.complaints
df["churned"] = rng.random(n) &lt; 1 / (1 + np.exp(-logit))
print("churn rate:", round(float(df.churned.mean()), 3))

X = df[["days_since_open", "orders_6m", "complaints"]]
m = LogisticRegression().fit(X, df.churned)
print("coefficients:", {c: round(float(v), 3) for c, v in zip(X.columns, m.coef_[0])})
print("odds multiplier per unit:", {c: round(float(v), 2) for c, v in zip(X.columns, np.exp(m.coef_[0]))})
new = pd.DataFrame({"days_since_open": [5, 60, 80], "orders_6m": [4, 1, 0], "complaints": [0, 0, 1]})
new["P(churn)"] = m.predict_proba(new)[:, 1].round(2)
print(new)
</code></pre>
<div class="out">churn rate: 0.417
coefficients: {'days_since_open': 0.059, 'orders_6m': -0.726, 'complaints': 1.182}
odds multiplier per unit: {'days_since_open': 1.06, 'orders_6m': 0.48, 'complaints': 3.26}
   days_since_open  orders_6m  complaints  P(churn)
0                5          4           0      0.01
1               60          1           0      0.71
2               80          0           1      0.98</div>
<p><strong>Đọc kết quả.</strong></p>
<ul>
<li><strong>days_since_open</strong>: odds rời bỏ × 1,06 cho mỗi ngày không mở email — sau 30 ngày im lặng, khoảng × 1,06<sup>30</sup> ≈ × 5,7.</li>
<li><strong>orders_6m</strong>: mỗi đơn thêm làm odds giảm gần một nửa (× 0,48) — người mua đều đặn ở lại.</li>
<li><strong>complaints</strong>: một lần khiếu nại nhân odds lên khoảng 3,3 — xử lý khiếu nại là đòn bẩy giữ chân.</li>
</ul>
<p>Ba hội viên mới cho thấy điểm số dẫn hành động ra sao: người mua tích cực (5 ngày, 4 đơn) có xác suất rời bỏ khoảng 1% — để họ yên; người mua một lần đã im lặng có 71%; người im lặng từng khiếu nại có 98%. Đội giữ chân có ngân sách 500 cuộc gọi mỗi tháng sẽ gọi những xác suất cao nhất trước.</p>
<h3>Xác suất, không phải định mệnh</h3>
<p>Xác suất 0,71 nghĩa là "trong những hội viên như thế này, khoảng 71/100 người rời bỏ", không phải người này chắc chắn sẽ đi. Và xác suất rời bỏ cao không có nghĩa hội viên sẽ phản hồi ưu đãi của bạn — có người vẫn đi. Các đội nâng cao mô hình hoá <em>uplift</em>: ai thay đổi hành vi <em>nhờ</em> hành động của ta. Điều đó lại cần thử nghiệm (Chương 8).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng thông tin của tương lai làm đầu vào ("đã vào trang huỷ gói" được ghi sau ngày rời bỏ) — mô hình trông xuất sắc và thất bại khi dùng thật. Đó là <strong>rò rỉ dữ liệu (data leakage)</strong>.</li><li>Đọc hệ số như nguyên nhân: khiếu nại có thể là <em>triệu chứng</em> của vấn đề sản phẩm.</li><li>Đổi xác suất thành có/không ở ngưỡng 0,5 mà không nghĩ tới chi phí (bài 7.3).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Phân loại dự đoán nhóm; hồi quy logistic cho ra xác suất.</li><li>e<sup>hệ số</sup> = hệ số nhân odds cho mỗi đơn vị đầu vào.</li><li>Xếp hạng người theo xác suất để ưu tiên nguồn lực có hạn.</li><li>Cẩn thận rò rỉ dữ liệu; dự đoán không phải nhân quả; uplift cần thử nghiệm.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://developers.google.com/machine-learning/crash-course/logistic-regression" target="_blank" rel="noopener">Google ML Crash Course — Hồi quy logistic</a></li><li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html" target="_blank" rel="noopener">scikit-learn — LogisticRegression</a></li><li><a href="https://www.kaggle.com/learn/intro-to-machine-learning" target="_blank" rel="noopener">Kaggle Learn — Intro to Machine Learning</a></li><li><a href="https://www.statlearning.com/" target="_blank" rel="noopener">James và cộng sự — ISLP (chương phân loại)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Hệ số của "đã nhận cuộc gọi chào mừng" là −0,69. Hệ số nhân odds là bao nhiêu, gợi ý điều gì?</li><li>Vì sao "số phiếu hỗ trợ trong tháng SAU ngày dự đoán" là đầu vào tồi?</li><li>Mô hình cho P(phản hồi) = 0,08 với khách A và 0,32 với khách B. Nếu một voucher tốn 20.000 VND và một lượt phản hồi mang lại 150.000 VND lãi gộp, ai đáng nhắm tới?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) e<sup>−0,69</sup> ≈ 0,50: odds rời bỏ giảm khoảng một nửa với hội viên đã nhận cuộc gọi — đáng thử như một hành động giữ chân (chỉ là liên hệ cho tới khi được kiểm chứng). 2) Đó là thông tin tương lai (rò rỉ); lúc dự đoán bạn không biết nó. 3) Lãi kỳ vọng: A = 0,08 × 150.000 = 12.000 &lt; 20.000 (không đáng); B = 0,32 × 150.000 = 48.000 &gt; 20.000 (đáng).</p></div>`);

const l7_3 = L('aba201c-ts-7-3',
  '7.3 — Evaluating predictive models: train/test, precision, recall, thresholds and lift|||7.3 — Đánh giá mô hình dự đoán: train/test, precision, recall, ngưỡng và lift',
  'Tách tập huấn luyện/kiểm tra, accuracy đánh lừa khi lớp hiếm, ma trận nhầm lẫn, precision và recall, chọn ngưỡng theo chi phí, biểu đồ lift theo thập phân vị cho nhắm chọn chiến dịch, quá khớp.',
  `<span class="eyebrow">ABA201c · Chapter 7 · Lesson 7.3</span>
<h2>Evaluating predictive models</h2>
<p class="lead">A model is only as good as its performance on people it has not seen. And "good" depends on the decision: finding most churners, wasting few vouchers, or ranking the best prospects first. This lesson gives you the vocabulary to judge a vendor's or a colleague's model.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain train/test splitting and overfitting.</li><li>Compute and interpret the confusion matrix, precision and recall.</li><li>Choose a threshold based on costs and read a lift table.</li></ul>
<h3>📖 Lecture</h3>
<h3>Train, test, overfit</h3>
<p>Split data into a <strong>training set</strong> (to fit) and a <strong>test set</strong> (to evaluate once). A model that memorises the training data — capturing noise as if it were a pattern — scores well in training and badly on new data. That is <strong>overfitting</strong>. Simpler models, more data and honest test sets are the remedies.</p>
<h3>The confusion matrix</h3>
<div class="kv-grid">
<div class="kv"><span class="k">True positive (TP)</span><span class="v">predicted "will respond", did respond</span></div>
<div class="kv"><span class="k">False positive (FP)</span><span class="v">predicted "will respond", did not — a wasted voucher</span></div>
<div class="kv"><span class="k">False negative (FN)</span><span class="v">predicted "won't respond", did — a missed customer</span></div>
<div class="kv"><span class="k">True negative (TN)</span><span class="v">predicted "won't", didn't</span></div>
</div>
<div class="formula"><span class="lbl">Metrics</span>Accuracy = (TP + TN) ÷ all · Precision = TP ÷ (TP + FP) — "of those we targeted, how many responded?" · Recall = TP ÷ (TP + FN) — "of all responders, how many did we reach?"</div>
<h3>Thresholds</h3>
<p>The model outputs probabilities; you choose the cut-off. A lower threshold targets more people: recall rises, precision falls. The right threshold depends on costs: an SMS costs little, so you can accept low precision; a sales call is expensive, so you want high precision.</p>
<h3>Lift</h3>
<p>For campaigns the most practical view is <strong>lift</strong>: rank customers by score, cut into 10 equal groups (deciles), and compare each decile's response rate with the overall rate. Lift 4 in the top decile means "targeting our top 10% finds responders four times more often than random targeting". Business data-science textbooks such as Provost &amp; Fawcett present lift and profit curves as ways to connect a model to a targeting decision.</p>
<h3>✍️ Worked example — response to an email offer</h3>
<pre><code class="language-python">import numpy as np, pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, precision_score, recall_score, accuracy_score

rng = np.random.default_rng(11)
n = 2000
df = pd.DataFrame({
    "past_purchases": rng.poisson(1.5, n),
    "opened_last_email": rng.binomial(1, 0.4, n),
    "site_visits_30d": rng.poisson(3, n),
})
logit = -4 + 0.5 * df.past_purchases + 1.3 * df.opened_last_email + 0.2 * df.site_visits_30d
df["responded"] = rng.random(n) &lt; 1 / (1 + np.exp(-logit))
print("overall response rate:", round(df.responded.mean(), 3))

X, y = df.drop(columns="responded"), df.responded
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)
m = LogisticRegression().fit(X_tr, y_tr)
p = m.predict_proba(X_te)[:, 1]
pred = p &gt;= 0.5
print("accuracy @0.5:", round(accuracy_score(y_te, pred), 3),
      "| always-'no' accuracy:", round(1 - y_te.mean(), 3))
pred2 = p &gt;= 0.15
print("threshold 0.15 -&gt; precision", round(precision_score(y_te, pred2), 3),
      "recall", round(recall_score(y_te, pred2), 3))
print(confusion_matrix(y_te, pred2))

# lift: rank customers by score, cut into 10 deciles
t = pd.DataFrame({"p": p, "y": y_te.values})
t["decile"] = pd.qcut(t.p.rank(method="first", ascending=False), 10, labels=range(1, 11))
lift = t.groupby("decile", observed=True).y.mean() / t.y.mean()
print("lift by decile (1 = top 10%):", lift.round(2).tolist())
</code></pre>
<div class="out">overall response rate: 0.129
accuracy @0.5: 0.875 | always-'no' accuracy: 0.872
threshold 0.15 -&gt; precision 0.262 recall 0.662
[[379 144]
 [ 26  51]]
lift by decile (1 = top 10%): [4.16, 1.17, 0.91, 1.43, 0.26, 0.78, 0.26, 0.26, 0.39, 0.39]</div>
<p><strong>Reading the output.</strong></p>
<ul>
<li>Only 12.9% of customers respond. At threshold 0.5 the model's accuracy (0.875) is barely above the lazy rule "predict no for everyone" (0.872). <strong>Accuracy is almost useless for rare outcomes.</strong></li>
<li>At threshold 0.15 the model targets 195 of 600 test customers. Precision 0.262: about one in four targeted customers responds — double the 12.9% base rate. Recall 0.662: it reaches two-thirds of all responders. The confusion matrix shows 51 TP, 144 FP, 26 FN, 379 TN.</li>
<li>Lift: the top decile responds 4.16 times more than average. Deciles further down are noisy (each holds only 60 customers), but the message is clear: the value is concentrated at the top of the ranking.</li>
</ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Reporting accuracy for rare events (churn, fraud, response).</li><li>Evaluating on the training data, or tuning repeatedly on the test set.</li><li>Using the default 0.5 threshold without considering the cost of each error.</li><li>Ignoring that the future may differ from the past (new competitor, new season) — monitor models after launch.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Evaluate on unseen data; overfitting = memorising noise.</li><li>Precision = targeting efficiency; recall = coverage of real positives.</li><li>Pick thresholds from costs and capacity.</li><li>Lift by decile links a model to a targeting decision.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall" target="_blank" rel="noopener">Google ML Crash Course — Accuracy, recall, precision</a></li><li><a href="https://developers.google.com/machine-learning/crash-course/classification/thresholding" target="_blank" rel="noopener">Google ML Crash Course — Thresholds and the confusion matrix</a></li><li><a href="https://developers.google.com/machine-learning/crash-course/overfitting" target="_blank" rel="noopener">Google ML Crash Course — Datasets, generalisation and overfitting</a></li><li><a href="https://scikit-learn.org/stable/modules/model_evaluation.html" target="_blank" rel="noopener">scikit-learn — Metrics and scoring</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>TP = 40, FP = 160, FN = 10, TN = 790. Compute precision, recall and accuracy.</li><li>You can afford to call only 200 of 10,000 members. Which metric matters most: precision or recall at the top 200?</li><li>The top decile has a response rate of 9% while the overall rate is 3%. What is the lift?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Precision = 40 ÷ 200 = 0.20; recall = 40 ÷ 50 = 0.80; accuracy = 830 ÷ 1,000 = 0.83. 2) Precision among the top 200 — with limited capacity you want as many of those calls as possible to hit real churners. 3) 9% ÷ 3% = 3.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 7 · Bài 7.3</span>
<h2>Đánh giá mô hình dự đoán</h2>
<p class="lead">Một mô hình chỉ tốt bằng hiệu quả của nó trên những người nó chưa từng thấy. Và "tốt" phụ thuộc vào quyết định: tìm được phần lớn người rời bỏ, ít lãng phí voucher, hay xếp những khách tiềm năng nhất lên đầu. Bài này cho bạn từ vựng để đánh giá mô hình của nhà cung cấp hay đồng nghiệp.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích tách train/test và quá khớp.</li><li>Tính và diễn giải ma trận nhầm lẫn, precision và recall.</li><li>Chọn ngưỡng theo chi phí và đọc bảng lift.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Huấn luyện, kiểm tra, quá khớp</h3>
<p>Chia dữ liệu thành <strong>tập huấn luyện</strong> (để khớp) và <strong>tập kiểm tra</strong> (để đánh giá một lần). Mô hình học thuộc dữ liệu huấn luyện — coi nhiễu như quy luật — sẽ đạt điểm cao khi huấn luyện và tệ trên dữ liệu mới. Đó là <strong>quá khớp (overfitting)</strong>. Mô hình đơn giản hơn, nhiều dữ liệu hơn và tập kiểm tra trung thực là cách chữa.</p>
<h3>Ma trận nhầm lẫn</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Dương tính thật (TP)</span><span class="v">đoán "sẽ phản hồi", đã phản hồi</span></div>
<div class="kv"><span class="k">Dương tính giả (FP)</span><span class="v">đoán "sẽ phản hồi", không phản hồi — một voucher lãng phí</span></div>
<div class="kv"><span class="k">Âm tính giả (FN)</span><span class="v">đoán "không phản hồi", lại phản hồi — một khách bị bỏ lỡ</span></div>
<div class="kv"><span class="k">Âm tính thật (TN)</span><span class="v">đoán "không", và không</span></div>
</div>
<div class="formula"><span class="lbl">Các chỉ số</span>Accuracy = (TP + TN) ÷ tổng · Precision = TP ÷ (TP + FP) — "trong số người ta nhắm, bao nhiêu người phản hồi?" · Recall = TP ÷ (TP + FN) — "trong mọi người phản hồi, ta chạm được bao nhiêu?"</div>
<h3>Ngưỡng</h3>
<p>Mô hình cho ra xác suất; bạn chọn ngưỡng cắt. Ngưỡng thấp hơn nhắm nhiều người hơn: recall tăng, precision giảm. Ngưỡng đúng phụ thuộc chi phí: SMS rẻ, nên chấp nhận precision thấp được; cuộc gọi bán hàng đắt, nên cần precision cao.</p>
<h3>Lift</h3>
<p>Với chiến dịch, góc nhìn thực dụng nhất là <strong>lift</strong>: xếp khách theo điểm, chia thành 10 nhóm bằng nhau (thập phân vị), so tỷ lệ phản hồi của mỗi nhóm với tỷ lệ chung. Lift 4 ở nhóm đầu nghĩa là "nhắm vào 10% điểm cao nhất tìm được người phản hồi thường xuyên gấp bốn lần nhắm ngẫu nhiên". Các giáo trình khoa học dữ liệu kinh doanh như Provost &amp; Fawcett trình bày đường lift và đường lợi nhuận như cách nối mô hình với quyết định nhắm chọn.</p>
<h3>✍️ Ví dụ — phản hồi ưu đãi qua email</h3>
<pre><code class="language-python">import numpy as np, pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, precision_score, recall_score, accuracy_score

rng = np.random.default_rng(11)
n = 2000
df = pd.DataFrame({
    "past_purchases": rng.poisson(1.5, n),
    "opened_last_email": rng.binomial(1, 0.4, n),
    "site_visits_30d": rng.poisson(3, n),
})
logit = -4 + 0.5 * df.past_purchases + 1.3 * df.opened_last_email + 0.2 * df.site_visits_30d
df["responded"] = rng.random(n) &lt; 1 / (1 + np.exp(-logit))
print("overall response rate:", round(df.responded.mean(), 3))

X, y = df.drop(columns="responded"), df.responded
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)
m = LogisticRegression().fit(X_tr, y_tr)
p = m.predict_proba(X_te)[:, 1]
pred = p &gt;= 0.5
print("accuracy @0.5:", round(accuracy_score(y_te, pred), 3),
      "| always-'no' accuracy:", round(1 - y_te.mean(), 3))
pred2 = p &gt;= 0.15
print("threshold 0.15 -&gt; precision", round(precision_score(y_te, pred2), 3),
      "recall", round(recall_score(y_te, pred2), 3))
print(confusion_matrix(y_te, pred2))

# lift: rank customers by score, cut into 10 deciles
t = pd.DataFrame({"p": p, "y": y_te.values})
t["decile"] = pd.qcut(t.p.rank(method="first", ascending=False), 10, labels=range(1, 11))
lift = t.groupby("decile", observed=True).y.mean() / t.y.mean()
print("lift by decile (1 = top 10%):", lift.round(2).tolist())
</code></pre>
<div class="out">overall response rate: 0.129
accuracy @0.5: 0.875 | always-'no' accuracy: 0.872
threshold 0.15 -&gt; precision 0.262 recall 0.662
[[379 144]
 [ 26  51]]
lift by decile (1 = top 10%): [4.16, 1.17, 0.91, 1.43, 0.26, 0.78, 0.26, 0.26, 0.39, 0.39]</div>
<p><strong>Đọc kết quả.</strong></p>
<ul>
<li>Chỉ 12,9% khách phản hồi. Ở ngưỡng 0,5, accuracy của mô hình (0,875) chỉ nhỉnh hơn quy tắc lười "đoán không cho tất cả" (0,872). <strong>Accuracy gần như vô dụng với kết cục hiếm.</strong></li>
<li>Ở ngưỡng 0,15, mô hình nhắm 195 trong 600 khách kiểm tra. Precision 0,262: khoảng một trong bốn khách được nhắm phản hồi — gấp đôi tỷ lệ nền 12,9%. Recall 0,662: chạm được hai phần ba số người phản hồi. Ma trận nhầm lẫn cho 51 TP, 144 FP, 26 FN, 379 TN.</li>
<li>Lift: nhóm đầu phản hồi gấp 4,16 lần trung bình. Các nhóm phía dưới nhiễu (mỗi nhóm chỉ 60 khách), nhưng thông điệp rõ ràng: giá trị tập trung ở đầu bảng xếp hạng.</li>
</ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Báo accuracy cho sự kiện hiếm (rời bỏ, gian lận, phản hồi).</li><li>Đánh giá trên dữ liệu huấn luyện, hoặc chỉnh đi chỉnh lại trên tập kiểm tra.</li><li>Dùng ngưỡng mặc định 0,5 mà không xét chi phí của từng loại lỗi.</li><li>Quên rằng tương lai có thể khác quá khứ (đối thủ mới, mùa mới) — hãy theo dõi mô hình sau khi triển khai.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Đánh giá trên dữ liệu chưa thấy; quá khớp = học thuộc nhiễu.</li><li>Precision = hiệu quả nhắm chọn; recall = độ phủ người dương tính thật.</li><li>Chọn ngưỡng theo chi phí và năng lực.</li><li>Lift theo thập phân vị nối mô hình với quyết định nhắm chọn.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall" target="_blank" rel="noopener">Google ML Crash Course — Accuracy, recall, precision</a></li><li><a href="https://developers.google.com/machine-learning/crash-course/classification/thresholding" target="_blank" rel="noopener">Google ML Crash Course — Ngưỡng và ma trận nhầm lẫn</a></li><li><a href="https://developers.google.com/machine-learning/crash-course/overfitting" target="_blank" rel="noopener">Google ML Crash Course — Tập dữ liệu, khái quát hoá và quá khớp</a></li><li><a href="https://scikit-learn.org/stable/modules/model_evaluation.html" target="_blank" rel="noopener">scikit-learn — Chỉ số và chấm điểm</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>TP = 40, FP = 160, FN = 10, TN = 790. Tính precision, recall và accuracy.</li><li>Bạn chỉ đủ tiền gọi 200 trong 10.000 hội viên. Chỉ số nào quan trọng nhất: precision hay recall trong top 200?</li><li>Nhóm thập phân vị đầu có tỷ lệ phản hồi 9% trong khi tỷ lệ chung là 3%. Lift là bao nhiêu?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Precision = 40 ÷ 200 = 0,20; recall = 40 ÷ 50 = 0,80; accuracy = 830 ÷ 1.000 = 0,83. 2) Precision trong top 200 — năng lực có hạn thì muốn càng nhiều cuộc gọi trúng người sắp rời bỏ thật càng tốt. 3) 9% ÷ 3% = 3.</p></div>`);

const q7 = QZ(7, 'Chapter 7 quiz — Regression and classification|||Quiz Chương 7 — Hồi quy và phân loại', '10 câu ôn hệ số hồi quy, R², đa cộng tuyến, nhân quả, hồi quy logistic, odds, rò rỉ dữ liệu, precision/recall, ngưỡng và lift.', [
  Q('q1', 'In sales = 30 + 2.5·social (million VND), the 2.5 means|||Trong doanh số = 30 + 2,5·social (triệu đồng), 2,5 nghĩa là',
    ['sales without ads|||doanh số khi không quảng cáo', 'each extra million on social is associated with 2.5 million more sales|||mỗi triệu chi thêm cho social gắn với 2,5 triệu doanh số tăng thêm', 'R² of the model|||R² của mô hình', 'the error|||sai số'], 1,
    'The coefficient is the slope; 30 is the intercept.|||Hệ số là độ dốc; 30 là hệ số chặn.'),
  Q('q2', 'A regression has R² = 0.95. Which conclusion is justified?|||Một hồi quy có R² = 0,95. Kết luận nào có cơ sở?',
    ['Ad spend causes 95% of sales|||Chi phí quảng cáo gây ra 95% doanh số', 'The model fits the observed data closely|||Mô hình khớp sát dữ liệu quan sát', 'The coefficients are certainly correct|||Các hệ số chắc chắn đúng', 'Doubling spend doubles sales|||Gấp đôi chi phí thì gấp đôi doanh số'], 1,
    'R² measures fit, not causation or coefficient accuracy.|||R² đo độ khớp, không đo nhân quả hay độ đúng của hệ số.'),
  Q('q3', 'Social and search budgets always moved together (correlation 0.98). The main risk is|||Ngân sách social và search luôn đi cùng nhau (tương quan 0,98). Rủi ro chính là',
    ['the model cannot separate their individual effects|||mô hình không tách được tác động riêng của từng kênh', 'R² will be zero|||R² sẽ bằng 0', 'the model cannot predict|||mô hình không dự đoán được', 'the data is too big|||dữ liệu quá lớn'], 0,
    'This is multicollinearity: predictions may be fine while coefficients are unreliable.|||Đó là đa cộng tuyến: dự đoán có thể ổn nhưng hệ số không đáng tin.'),
  Q('q4', 'Why use logistic rather than linear regression for churn (yes/no)?|||Vì sao dùng hồi quy logistic thay vì tuyến tính cho rời bỏ (có/không)?',
    ['It is always more accurate|||Nó luôn chính xác hơn', 'It outputs probabilities between 0 and 1|||Nó cho xác suất nằm trong khoảng 0 đến 1', 'It needs no data|||Nó không cần dữ liệu', 'It proves causation|||Nó chứng minh nhân quả'], 1,
    'The sigmoid squeezes the linear score into 0–1.|||Hàm sigmoid ép điểm tuyến tính vào 0–1.'),
  Q('q5', 'A coefficient of 0.69 for "complained" means the odds of churn are multiplied by about|||Hệ số 0,69 của "đã khiếu nại" nghĩa là odds rời bỏ được nhân khoảng',
    ['0.69|||0,69', '0.5|||0,5', '2|||2', '69|||69'], 2,
    'e^0.69 ≈ 2.|||e^0,69 ≈ 2.'),
  Q('q6', 'Using "visited the cancellation page after the prediction date" as an input is|||Dùng "đã vào trang huỷ sau ngày dự đoán" làm đầu vào là',
    ['good feature engineering|||kỹ thuật đặc trưng tốt', 'data leakage|||rò rỉ dữ liệu', 'multicollinearity|||đa cộng tuyến', 'standardisation|||chuẩn hoá'], 1,
    'It uses information not available at prediction time.|||Nó dùng thông tin không có vào lúc dự đoán.'),
  Q('q7', 'Precision answers the question|||Precision trả lời câu hỏi',
    ['Of the customers we targeted, what share responded?|||Trong số khách ta nhắm, bao nhiêu phần đã phản hồi?', 'Of all responders, what share did we reach?|||Trong mọi người phản hồi, ta chạm được bao nhiêu phần?', 'What share of predictions were correct?|||Bao nhiêu phần dự đoán đúng?', 'How big is the test set?|||Tập kiểm tra lớn bao nhiêu?'], 0,
    'The second option describes recall; the third describes accuracy.|||Lựa chọn thứ hai là recall; thứ ba là accuracy.'),
  Q('q8', 'Lowering the classification threshold usually|||Hạ ngưỡng phân loại thường',
    ['raises precision and lowers recall|||tăng precision và giảm recall', 'raises recall and lowers precision|||tăng recall và giảm precision', 'changes nothing|||không đổi gì', 'raises both|||tăng cả hai'], 1,
    'More people are targeted: more responders found, but more wasted contacts.|||Nhắm nhiều người hơn: tìm thêm người phản hồi nhưng lãng phí thêm lượt liên hệ.'),
  Q('q9', 'Only 5% of customers churn. A model with 95% accuracy|||Chỉ 5% khách rời bỏ. Một mô hình accuracy 95%',
    ['is certainly excellent|||chắc chắn xuất sắc', 'may be no better than predicting "no churn" for everyone|||có thể không hơn gì việc đoán "không rời bỏ" cho tất cả', 'has 95% recall|||có recall 95%', 'has 95% precision|||có precision 95%'], 1,
    'Always compare with the base rate and check recall.|||Luôn so với tỷ lệ nền và kiểm recall.'),
  Q('q10', 'Top-decile response 12%, overall 4%. Lift =|||Tỷ lệ phản hồi nhóm đầu 12%, chung 4%. Lift =',
    ['8|||8', '3|||3', '0.33|||0,33', '16|||16'], 1,
    '12 ÷ 4 = 3: targeting the top 10% finds responders three times more often than random.|||12 ÷ 4 = 3: nhắm 10% đầu tìm được người phản hồi thường xuyên gấp ba lần nhắm ngẫu nhiên.'),
]);

const ch7 = {
  title: 'Chapter 7 — Predictive basics: regression and classification|||Chương 7 — Nền tảng dự đoán: hồi quy và phân loại',
  description: 'Hồi quy tuyến tính (doanh số theo chi phí quảng cáo, R², đa cộng tuyến, tương quan ≠ nhân quả), hồi quy logistic cho rời bỏ/phản hồi (xác suất, tỷ số odds), đánh giá mô hình (train/test, ma trận nhầm lẫn, precision, recall, ngưỡng, lift theo thập phân vị, quá khớp).',
  lessons: [l7_1, l7_2, l7_3, q7],
};

const l8_1 = L('aba201c-ts-8-1',
  '8.1 — Designing an A/B test: hypothesis, metric, randomisation and sample size|||8.1 — Thiết kế A/B test: giả thuyết, chỉ số, phân ngẫu nhiên và cỡ mẫu',
  'Thử nghiệm có kiểm soát là gì, vì sao ngẫu nhiên hoá loại bỏ thiên lệch, viết giả thuyết, chọn chỉ số chính và chỉ số bảo vệ, tính cỡ mẫu cần thiết bằng Python và hiểu vì sao tỷ lệ nền thấp cần rất nhiều người.',
  `<span class="eyebrow">ABA201c · Chapter 8 · Lesson 8.1</span>
<h2>Designing an A/B test</h2>
<p class="lead">Chapters 3 and 7 kept warning: observational data shows association, not cause. An A/B test is how you get cause: show version A to one random group and version B to another, and any reliable difference in outcome is caused by the difference between A and B.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain why randomisation makes causal conclusions possible.</li><li>Write a testable hypothesis with a primary metric and guardrail metrics.</li><li>Estimate the sample size needed, and understand what drives it.</li></ul>
<h3>📖 Lecture</h3>
<h3>Why randomise?</h3>
<p>If you send a new email subject only to your most loyal customers, any success could be due to loyalty, not the subject. <strong>Random assignment</strong> makes the two groups alike on average in everything — loyalty, age, device, mood — both the things you can measure and the things you cannot. The only systematic difference left is the treatment. That is why controlled experiments are often called the gold standard for testing whether a change causes an outcome — and why Kohavi, Tang and Xu devote a whole book to running them in a <em>trustworthy</em> way.</p>
<h3>Ingredients of a good test</h3>
<ol>
<li><strong>Hypothesis</strong>: "Adding the recipient's first name to the subject line will increase the click rate, because personal subjects stand out in a crowded inbox."</li>
<li><strong>Unit of randomisation</strong>: usually the user (not the page view), so one person always sees the same version.</li>
<li><strong>Primary metric</strong> (decided in advance): click rate per recipient. Also <strong>guardrail metrics</strong> that must not get worse: unsubscribe rate, spam complaints.</li>
<li><strong>Minimum detectable effect (MDE)</strong>: the smallest improvement worth acting on, e.g. +10% relative.</li>
<li><strong>Sample size and duration</strong>, fixed before starting — and run whole weeks so weekdays and weekends are both included.</li>
</ol>
<h3>How many people do we need?</h3>
<p>Sample size grows when the baseline rate is low, when the effect you want to detect is small, and when you demand more certainty. A standard approximation for comparing two proportions uses the significance level α (commonly 0.05) and statistical power (commonly 0.80):</p>
<div class="formula"><span class="lbl">Sample size per variant (approx.)</span>n ≈ (z<sub>1−α/2</sub> + z<sub>power</sub>)<sup>2</sup> × [p<sub>1</sub>(1 − p<sub>1</sub>) + p<sub>2</sub>(1 − p<sub>2</sub>)] ÷ (p<sub>2</sub> − p<sub>1</sub>)<sup>2</sup></div>
<h3>✍️ Worked example — four scenarios</h3>
<pre><code class="language-python">from scipy.stats import norm
import math

def n_per_group(p_base, mde_rel, alpha=0.05, power=0.80):
    """Approximate users needed per variant for a two-sided two-proportion test."""
    p1 = p_base
    p2 = p_base * (1 + mde_rel)
    z_a = norm.ppf(1 - alpha / 2)
    z_b = norm.ppf(power)
    var = p1 * (1 - p1) + p2 * (1 - p2)
    return math.ceil((z_a + z_b) ** 2 * var / (p2 - p1) ** 2)

for base, mde in [(0.02, 0.10), (0.02, 0.20), (0.10, 0.10), (0.10, 0.20)]:
    print(f"baseline {base:.0%}, detect +{mde:.0%} relative -&gt; {n_per_group(base, mde):,} per variant")
</code></pre>
<div class="out">baseline 2%, detect +10% relative -&gt; 80,679 per variant
baseline 2%, detect +20% relative -&gt; 21,106 per variant
baseline 10%, detect +10% relative -&gt; 14,749 per variant
baseline 10%, detect +20% relative -&gt; 3,839 per variant</div>
<p><strong>Reading the output.</strong> With a 2% baseline (typical of purchase conversion) and a goal of detecting a 10% relative lift (2.0% → 2.2%), you need about 80,700 users <em>per variant</em>. Doubling the effect you look for (to +20%) cuts the requirement by about four times, because n depends on the square of the difference. With a 10% baseline (typical of email clicks) the test becomes much cheaper. Practical consequence: small brands should test <strong>bold</strong> changes (new offer, new creative concept) on high-rate metrics, not tiny tweaks on purchase conversion.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Choosing the metric after seeing results ("CTR didn't move, but time on page did!").</li><li>Randomising by session, so the same person sees both versions.</li><li>Running a test for three days because "it looks significant already" (lesson 8.3).</li><li>Testing ten things at once in one variant — you will not know which change worked.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Randomisation balances known and unknown factors ⇒ differences are causal.</li><li>Pre-register hypothesis, unit, primary and guardrail metrics, MDE, sample size, duration.</li><li>Low baseline and small effects require very large samples.</li><li>Test bold ideas when traffic is limited.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://experimentguide.com/" target="_blank" rel="noopener">Kohavi, Tang &amp; Xu — Trustworthy Online Controlled Experiments (book site)</a></li><li><a href="https://www.evanmiller.org/ab-testing/sample-size.html" target="_blank" rel="noopener">Evan Miller — Sample size calculator</a></li><li><a href="https://www.optimizely.com/optimization-glossary/ab-testing/" target="_blank" rel="noopener">Optimizely — A/B testing (glossary)</a></li><li><a href="https://hbr.org/2017/06/a-refresher-on-ab-testing" target="_blank" rel="noopener">Harvard Business Review — A refresher on A/B testing</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Write a hypothesis, primary metric and one guardrail metric for testing a new TikTok ad hook.</li><li>Why must a test include full weeks?</li><li>A shop has 3,000 visitors a week and a 1.5% purchase rate. Is an A/B test of button colour on purchases realistic? What would you test instead?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) e.g. "Opening with the product result in the first second (instead of the logo) will raise the 3-second view rate because it creates curiosity." Primary: 3-second view rate per impression; guardrail: cost per purchase must not rise. 2) Behaviour differs by weekday; partial weeks over-represent some days and bias the result. 3) Not realistic: detecting a small lift at 1.5% needs tens of thousands of visitors per variant — months of traffic. Test a bold change (new offer, free shipping threshold) or a higher-rate metric (add-to-cart).</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 8 · Bài 8.1</span>
<h2>Thiết kế A/B test</h2>
<p class="lead">Chương 3 và 7 liên tục cảnh báo: dữ liệu quan sát cho thấy liên hệ, không cho thấy nguyên nhân. A/B test là cách để có nguyên nhân: cho một nhóm ngẫu nhiên xem phiên bản A, một nhóm khác xem phiên bản B, và mọi khác biệt đáng tin về kết quả là do khác biệt giữa A và B gây ra.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích vì sao phân ngẫu nhiên giúp kết luận nhân quả.</li><li>Viết giả thuyết kiểm chứng được kèm chỉ số chính và chỉ số bảo vệ.</li><li>Ước lượng cỡ mẫu cần thiết và hiểu điều gì quyết định nó.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Vì sao phải ngẫu nhiên?</h3>
<p>Nếu bạn chỉ gửi tiêu đề email mới cho khách trung thành nhất, mọi thành công có thể do lòng trung thành chứ không phải do tiêu đề. <strong>Phân nhóm ngẫu nhiên</strong> làm hai nhóm giống nhau về trung bình ở mọi thứ — mức trung thành, tuổi, thiết bị, tâm trạng — cả thứ đo được lẫn thứ không đo được. Khác biệt có hệ thống duy nhất còn lại là phương án thử nghiệm. Vì thế thử nghiệm có kiểm soát thường được gọi là chuẩn vàng để kiểm tra một thay đổi có gây ra kết quả hay không — và Kohavi, Tang, Xu dành trọn một cuốn sách để hướng dẫn chạy chúng sao cho <em>đáng tin cậy</em>.</p>
<h3>Thành phần của một thử nghiệm tốt</h3>
<ol>
<li><strong>Giả thuyết</strong>: "Thêm tên người nhận vào tiêu đề sẽ tăng tỷ lệ click, vì tiêu đề cá nhân nổi bật trong hộp thư đông đúc."</li>
<li><strong>Đơn vị ngẫu nhiên hoá</strong>: thường là người dùng (không phải lượt xem trang), để một người luôn thấy cùng một phiên bản.</li>
<li><strong>Chỉ số chính</strong> (quyết định trước): tỷ lệ click trên mỗi người nhận. Thêm <strong>chỉ số bảo vệ (guardrail)</strong> không được xấu đi: tỷ lệ huỷ đăng ký, báo cáo spam.</li>
<li><strong>Hiệu ứng tối thiểu phát hiện được (MDE)</strong>: mức cải thiện nhỏ nhất đáng hành động, ví dụ +10% tương đối.</li>
<li><strong>Cỡ mẫu và thời lượng</strong>, cố định trước khi bắt đầu — và chạy trọn tuần để có cả ngày thường lẫn cuối tuần.</li>
</ol>
<h3>Cần bao nhiêu người?</h3>
<p>Cỡ mẫu tăng khi tỷ lệ nền thấp, khi hiệu ứng muốn phát hiện nhỏ, và khi bạn đòi độ chắc chắn cao hơn. Công thức xấp xỉ chuẩn để so hai tỷ lệ dùng mức ý nghĩa α (thường 0,05) và độ mạnh thống kê — power (thường 0,80):</p>
<div class="formula"><span class="lbl">Cỡ mẫu mỗi phiên bản (xấp xỉ)</span>n ≈ (z<sub>1−α/2</sub> + z<sub>power</sub>)<sup>2</sup> × [p<sub>1</sub>(1 − p<sub>1</sub>) + p<sub>2</sub>(1 − p<sub>2</sub>)] ÷ (p<sub>2</sub> − p<sub>1</sub>)<sup>2</sup></div>
<h3>✍️ Ví dụ — bốn kịch bản</h3>
<pre><code class="language-python">from scipy.stats import norm
import math

def n_per_group(p_base, mde_rel, alpha=0.05, power=0.80):
    """Approximate users needed per variant for a two-sided two-proportion test."""
    p1 = p_base
    p2 = p_base * (1 + mde_rel)
    z_a = norm.ppf(1 - alpha / 2)
    z_b = norm.ppf(power)
    var = p1 * (1 - p1) + p2 * (1 - p2)
    return math.ceil((z_a + z_b) ** 2 * var / (p2 - p1) ** 2)

for base, mde in [(0.02, 0.10), (0.02, 0.20), (0.10, 0.10), (0.10, 0.20)]:
    print(f"baseline {base:.0%}, detect +{mde:.0%} relative -&gt; {n_per_group(base, mde):,} per variant")
</code></pre>
<div class="out">baseline 2%, detect +10% relative -&gt; 80,679 per variant
baseline 2%, detect +20% relative -&gt; 21,106 per variant
baseline 10%, detect +10% relative -&gt; 14,749 per variant
baseline 10%, detect +20% relative -&gt; 3,839 per variant</div>
<p><strong>Đọc kết quả.</strong> Với tỷ lệ nền 2% (điển hình cho chuyển đổi mua hàng) và mục tiêu phát hiện mức tăng tương đối 10% (2,0% → 2,2%), bạn cần khoảng 80.700 người <em>mỗi phiên bản</em>. Gấp đôi hiệu ứng muốn tìm (lên +20%) giảm nhu cầu khoảng bốn lần, vì n phụ thuộc bình phương của chênh lệch. Với tỷ lệ nền 10% (điển hình cho click email), thử nghiệm rẻ hơn nhiều. Hệ quả thực tế: thương hiệu nhỏ nên thử các thay đổi <strong>táo bạo</strong> (ưu đãi mới, ý tưởng creative mới) trên chỉ số có tỷ lệ cao, chứ không phải chỉnh lặt vặt trên chuyển đổi mua hàng.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chọn chỉ số sau khi thấy kết quả ("CTR không đổi, nhưng thời gian trên trang tăng!").</li><li>Ngẫu nhiên theo phiên, nên cùng một người thấy cả hai phiên bản.</li><li>Chạy thử nghiệm ba ngày vì "trông đã có ý nghĩa rồi" (bài 8.3).</li><li>Thử mười thay đổi cùng lúc trong một phiên bản — không biết thay đổi nào có tác dụng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Ngẫu nhiên hoá cân bằng yếu tố biết và không biết ⇒ khác biệt mang tính nhân quả.</li><li>Đăng ký trước giả thuyết, đơn vị, chỉ số chính và bảo vệ, MDE, cỡ mẫu, thời lượng.</li><li>Tỷ lệ nền thấp và hiệu ứng nhỏ đòi cỡ mẫu rất lớn.</li><li>Lưu lượng có hạn thì thử ý tưởng táo bạo.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://experimentguide.com/" target="_blank" rel="noopener">Kohavi, Tang &amp; Xu — Trustworthy Online Controlled Experiments (trang sách)</a></li><li><a href="https://www.evanmiller.org/ab-testing/sample-size.html" target="_blank" rel="noopener">Evan Miller — Công cụ tính cỡ mẫu</a></li><li><a href="https://www.optimizely.com/optimization-glossary/ab-testing/" target="_blank" rel="noopener">Optimizely — A/B testing (thuật ngữ)</a></li><li><a href="https://hbr.org/2017/06/a-refresher-on-ab-testing" target="_blank" rel="noopener">Harvard Business Review — Ôn lại A/B testing</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết giả thuyết, chỉ số chính và một chỉ số bảo vệ để thử một câu mở đầu (hook) mới cho quảng cáo TikTok.</li><li>Vì sao thử nghiệm phải gồm trọn tuần?</li><li>Một shop có 3.000 lượt truy cập/tuần và tỷ lệ mua 1,5%. A/B test màu nút trên tỷ lệ mua có thực tế không? Bạn sẽ thử gì thay thế?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Ví dụ "Mở đầu bằng kết quả sản phẩm ngay giây đầu (thay vì logo) sẽ tăng tỷ lệ xem 3 giây vì tạo tò mò." Chỉ số chính: tỷ lệ xem 3 giây trên mỗi hiển thị; bảo vệ: chi phí mỗi đơn không được tăng. 2) Hành vi khác nhau theo ngày trong tuần; tuần lẻ làm một số ngày bị đại diện quá mức và lệch kết quả. 3) Không thực tế: phát hiện mức tăng nhỏ ở 1,5% cần hàng chục nghìn người mỗi phiên bản — nhiều tháng lưu lượng. Hãy thử thay đổi táo bạo (ưu đãi mới, ngưỡng miễn phí vận chuyển) hoặc chỉ số tỷ lệ cao hơn (thêm vào giỏ).</p></div>`);

const l8_2 = L('aba201c-ts-8-2',
  '8.2 — Analysing an A/B test: z-test, p-value and confidence interval|||8.2 — Phân tích A/B test: kiểm định z, p-value và khoảng tin cậy',
  'Kiểm định z cho hai tỷ lệ từng bước, ý nghĩa đúng của p-value, khoảng tin cậy 95% cho chênh lệch, ý nghĩa thống kê và ý nghĩa thực tế; code scipy cho thử nghiệm tiêu đề email.',
  `<span class="eyebrow">ABA201c · Chapter 8 · Lesson 8.2</span>
<h2>Analysing an A/B test</h2>
<p class="lead">The test is over: version B has a higher click rate. Is that a real improvement or just luck? Statistics gives a disciplined answer — and a range of plausible effect sizes you can put in a business case.</p>
<h3>🎯 Objectives</h3>
<ul><li>Run a two-proportion z-test step by step.</li><li>Interpret a p-value and a confidence interval correctly.</li><li>Separate statistical significance from practical importance.</li></ul>
<h3>📖 Lecture</h3>
<h3>The logic of a test</h3>
<p>Start from the <strong>null hypothesis</strong> H<sub>0</sub>: "A and B have the same true rate; any observed difference is chance." Compute how surprising the observed difference would be if H<sub>0</sub> were true. If very surprising, reject H<sub>0</sub>.</p>
<div class="formula"><span class="lbl">Two-proportion z-test</span>p̂ = (x<sub>A</sub> + x<sub>B</sub>) ÷ (n<sub>A</sub> + n<sub>B</sub>) · SE = √[p̂(1 − p̂)(1/n<sub>A</sub> + 1/n<sub>B</sub>)] · z = (p̂<sub>B</sub> − p̂<sub>A</sub>) ÷ SE</div>
<p>The <strong>p-value</strong> is the probability of seeing a difference at least this large <em>if there were really no difference</em>. A common convention is to call results "statistically significant" when p &lt; 0.05. The p-value is <strong>not</strong> the probability that B is better, and not the probability that the result is a fluke.</p>
<h3>Confidence intervals</h3>
<p>More useful for decisions: a <strong>95% confidence interval</strong> for the difference, p̂<sub>B</sub> − p̂<sub>A</sub> ± 1.96 × SE (using the unpooled standard error). It gives the range of effect sizes compatible with the data. If the whole interval is above zero, B is better; its width shows how precisely you know the effect.</p>
<h3>✍️ Worked example — subject line test</h3>
<p>10,000 subscribers received each subject line. A (old) got 520 clicks, B (with first name) got 600.</p>
<pre><code class="language-python">from scipy.stats import norm
import math

# subject-line test: A = old subject, B = new subject with recipient's first name
n_a, conv_a = 10_000, 520     # opened &amp; clicked
n_b, conv_b = 10_000, 600
p_a, p_b = conv_a / n_a, conv_b / n_b
p_pool = (conv_a + conv_b) / (n_a + n_b)
se_pool = math.sqrt(p_pool * (1 - p_pool) * (1 / n_a + 1 / n_b))
z = (p_b - p_a) / se_pool
p_value = 2 * (1 - norm.cdf(abs(z)))

se = math.sqrt(p_a * (1 - p_a) / n_a + p_b * (1 - p_b) / n_b)
lo, hi = (p_b - p_a) - 1.96 * se, (p_b - p_a) + 1.96 * se
print(f"A: {p_a:.2%}  B: {p_b:.2%}  relative lift: {(p_b / p_a - 1):+.1%}")
print(f"z = {z:.2f}, two-sided p-value = {p_value:.4f}")
print(f"95% CI for B - A: [{lo:+.2%}, {hi:+.2%}]")
</code></pre>
<div class="out">A: 5.20%  B: 6.00%  relative lift: +15.4%
z = 2.46, two-sided p-value = 0.0139
95% CI for B - A: [+0.16%, +1.44%]</div>
<p><strong>Reading the output.</strong> B's click rate is 6.00% versus 5.20%: a relative lift of +15.4%. z = 2.46 and p ≈ 0.014 &lt; 0.05, so the difference is statistically significant. The 95% interval for the absolute difference runs from +0.16 to +1.44 percentage points: the true improvement could be small (about +3% relative) or large (about +28%). For a business case, report it honestly: "Personalised subjects increased clicks by about 0.8 points (95% CI 0.2 to 1.4); we recommend rolling out to all newsletters and monitoring unsubscribes."</p>
<h3>Significant vs important</h3>
<p>With millions of users, a +0.01-point difference can be "significant" yet worthless. With a few hundred users, an important effect may be "not significant" simply because the test was too small. Always ask two questions: <em>Is it real?</em> (p-value, interval) and <em>Is it big enough to matter?</em> (compare the interval with your minimum worthwhile effect and with the cost of the change).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Saying "p = 0.014 means 98.6% chance B is better" — wrong interpretation.</li><li>Treating p = 0.06 as "no effect" — it means "not enough evidence at this sample size".</li><li>Reporting only the relative lift (+15%) without the absolute numbers and interval.</li><li>Ignoring guardrails: B could raise clicks and unsubscribes together.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>z-test compares two proportions under H<sub>0</sub>: no difference.</li><li>p-value = how surprising the data would be if there were no effect.</li><li>Confidence interval = plausible range of the true effect; report it.</li><li>Significance ≠ importance; check size, cost and guardrails.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/10-3-comparing-two-independent-population-proportions" target="_blank" rel="noopener">OpenStax — 10.3 Comparing two independent population proportions</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/9-introduction" target="_blank" rel="noopener">OpenStax — Ch. 9 Hypothesis testing with one sample (concepts)</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.norm.html" target="_blank" rel="noopener">SciPy — scipy.stats.norm</a></li><li><a href="https://www.evanmiller.org/ab-testing/chi-squared.html" target="_blank" rel="noopener">Evan Miller — Chi-squared test calculator for A/B results</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A test has p = 0.30. Which statement is correct: (a) A and B are equal; (b) we do not have enough evidence of a difference.</li><li>95% CI for B − A: [−0.4, +1.2] points. Should you declare B the winner?</li><li>B raises click rate from 4.0% to 4.1% with p = 0.001 on 5 million users. Would you roll it out if the change costs 200 million VND?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (b). Absence of evidence is not evidence of absence. 2) No: the interval includes zero (and negative values) — the data are compatible with no effect; run longer or test a bolder change. 3) It is real but tiny: +0.1 point × 5 million = about 5,000 extra clicks. Compute their value (clicks × conversion × margin); roll out only if it exceeds the 200-million cost.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 8 · Bài 8.2</span>
<h2>Phân tích A/B test</h2>
<p class="lead">Thử nghiệm đã xong: phiên bản B có tỷ lệ click cao hơn. Đó là cải thiện thật hay chỉ là may mắn? Thống kê cho một câu trả lời có kỷ luật — và một khoảng giá trị hợp lý của hiệu ứng để bạn đưa vào đề xuất kinh doanh.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Thực hiện kiểm định z cho hai tỷ lệ từng bước.</li><li>Diễn giải đúng p-value và khoảng tin cậy.</li><li>Phân biệt ý nghĩa thống kê với tầm quan trọng thực tế.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Logic của kiểm định</h3>
<p>Bắt đầu từ <strong>giả thuyết không</strong> H<sub>0</sub>: "A và B có cùng tỷ lệ thật; mọi khác biệt quan sát được là ngẫu nhiên." Tính xem khác biệt quan sát được bất ngờ cỡ nào nếu H<sub>0</sub> đúng. Nếu rất bất ngờ, bác bỏ H<sub>0</sub>.</p>
<div class="formula"><span class="lbl">Kiểm định z hai tỷ lệ</span>p̂ = (x<sub>A</sub> + x<sub>B</sub>) ÷ (n<sub>A</sub> + n<sub>B</sub>) · SE = √[p̂(1 − p̂)(1/n<sub>A</sub> + 1/n<sub>B</sub>)] · z = (p̂<sub>B</sub> − p̂<sub>A</sub>) ÷ SE</div>
<p><strong>P-value</strong> là xác suất thấy một khác biệt ít nhất lớn như vậy <em>nếu thật ra không có khác biệt nào</em>. Quy ước phổ biến gọi kết quả là "có ý nghĩa thống kê" khi p &lt; 0,05. P-value <strong>không</strong> phải xác suất B tốt hơn, cũng không phải xác suất kết quả là may rủi.</p>
<h3>Khoảng tin cậy</h3>
<p>Hữu ích hơn cho quyết định: <strong>khoảng tin cậy 95%</strong> cho chênh lệch, p̂<sub>B</sub> − p̂<sub>A</sub> ± 1,96 × SE (dùng sai số chuẩn không gộp). Nó cho dải kích thước hiệu ứng phù hợp với dữ liệu. Nếu cả khoảng nằm trên 0, B tốt hơn; độ rộng cho biết bạn biết hiệu ứng chính xác cỡ nào.</p>
<h3>✍️ Ví dụ — thử nghiệm tiêu đề email</h3>
<p>Mỗi tiêu đề được gửi cho 10.000 người. A (cũ) có 520 click, B (có tên riêng) có 600.</p>
<pre><code class="language-python">from scipy.stats import norm
import math

# subject-line test: A = old subject, B = new subject with recipient's first name
n_a, conv_a = 10_000, 520     # opened &amp; clicked
n_b, conv_b = 10_000, 600
p_a, p_b = conv_a / n_a, conv_b / n_b
p_pool = (conv_a + conv_b) / (n_a + n_b)
se_pool = math.sqrt(p_pool * (1 - p_pool) * (1 / n_a + 1 / n_b))
z = (p_b - p_a) / se_pool
p_value = 2 * (1 - norm.cdf(abs(z)))

se = math.sqrt(p_a * (1 - p_a) / n_a + p_b * (1 - p_b) / n_b)
lo, hi = (p_b - p_a) - 1.96 * se, (p_b - p_a) + 1.96 * se
print(f"A: {p_a:.2%}  B: {p_b:.2%}  relative lift: {(p_b / p_a - 1):+.1%}")
print(f"z = {z:.2f}, two-sided p-value = {p_value:.4f}")
print(f"95% CI for B - A: [{lo:+.2%}, {hi:+.2%}]")
</code></pre>
<div class="out">A: 5.20%  B: 6.00%  relative lift: +15.4%
z = 2.46, two-sided p-value = 0.0139
95% CI for B - A: [+0.16%, +1.44%]</div>
<p><strong>Đọc kết quả.</strong> Tỷ lệ click của B là 6,00% so với 5,20%: tăng tương đối +15,4%. z = 2,46 và p ≈ 0,014 &lt; 0,05, nên khác biệt có ý nghĩa thống kê. Khoảng 95% cho chênh lệch tuyệt đối chạy từ +0,16 tới +1,44 điểm phần trăm: mức cải thiện thật có thể nhỏ (khoảng +3% tương đối) hoặc lớn (khoảng +28%). Trong đề xuất kinh doanh, hãy báo trung thực: "Tiêu đề cá nhân hoá tăng click khoảng 0,8 điểm (KTC 95% từ 0,2 đến 1,4); đề xuất áp dụng cho mọi bản tin và theo dõi tỷ lệ huỷ đăng ký."</p>
<h3>Có ý nghĩa và quan trọng</h3>
<p>Với hàng triệu người dùng, chênh +0,01 điểm có thể "có ý nghĩa" mà vô giá trị. Với vài trăm người, một hiệu ứng quan trọng có thể "không có ý nghĩa" chỉ vì thử nghiệm quá nhỏ. Luôn hỏi hai câu: <em>Nó có thật không?</em> (p-value, khoảng tin cậy) và <em>Nó có đủ lớn để đáng quan tâm?</em> (so khoảng tin cậy với hiệu ứng tối thiểu đáng làm và với chi phí thay đổi).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nói "p = 0,014 nghĩa là 98,6% khả năng B tốt hơn" — diễn giải sai.</li><li>Coi p = 0,06 là "không có tác dụng" — nó nghĩa là "chưa đủ bằng chứng với cỡ mẫu này".</li><li>Chỉ báo mức tăng tương đối (+15%) mà không có số tuyệt đối và khoảng tin cậy.</li><li>Bỏ qua chỉ số bảo vệ: B có thể vừa tăng click vừa tăng huỷ đăng ký.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Kiểm định z so hai tỷ lệ dưới H<sub>0</sub>: không có khác biệt.</li><li>P-value = dữ liệu bất ngờ cỡ nào nếu không có hiệu ứng.</li><li>Khoảng tin cậy = dải hợp lý của hiệu ứng thật; hãy báo nó.</li><li>Có ý nghĩa ≠ quan trọng; kiểm kích thước, chi phí và chỉ số bảo vệ.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/10-3-comparing-two-independent-population-proportions" target="_blank" rel="noopener">OpenStax — 10.3 So sánh hai tỷ lệ tổng thể độc lập</a></li><li><a href="https://openstax.org/books/introductory-statistics-2e/pages/9-introduction" target="_blank" rel="noopener">OpenStax — Ch. 9 Kiểm định giả thuyết một mẫu (khái niệm)</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.norm.html" target="_blank" rel="noopener">SciPy — scipy.stats.norm</a></li><li><a href="https://www.evanmiller.org/ab-testing/chi-squared.html" target="_blank" rel="noopener">Evan Miller — Công cụ kiểm định chi bình phương cho kết quả A/B</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Một thử nghiệm có p = 0,30. Phát biểu nào đúng: (a) A và B bằng nhau; (b) ta chưa đủ bằng chứng về khác biệt.</li><li>KTC 95% cho B − A: [−0,4; +1,2] điểm. Có nên tuyên bố B thắng?</li><li>B tăng tỷ lệ click từ 4,0% lên 4,1% với p = 0,001 trên 5 triệu người. Bạn có triển khai nếu thay đổi tốn 200 triệu đồng?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (b). Không có bằng chứng không phải là bằng chứng của sự không có. 2) Không: khoảng chứa 0 (và cả giá trị âm) — dữ liệu phù hợp với việc không có hiệu ứng; chạy lâu hơn hoặc thử thay đổi táo bạo hơn. 3) Có thật nhưng rất nhỏ: +0,1 điểm × 5 triệu = khoảng 5.000 click thêm. Tính giá trị của chúng (click × chuyển đổi × biên lãi); chỉ triển khai nếu vượt chi phí 200 triệu.</p></div>`);

const l8_3 = L('aba201c-ts-8-3',
  '8.3 — Experiment pitfalls: peeking, sample-ratio mismatch, multiple tests and incrementality|||8.3 — Bẫy trong thử nghiệm: nhìn trộm, lệch tỷ lệ mẫu, kiểm định nhiều lần và incrementality',
  'Mô phỏng 1.000 thử nghiệm A/A cho thấy "nhìn trộm" mỗi ngày làm tăng dương tính giả; kiểm tra lệch tỷ lệ mẫu (SRM) bằng chi bình phương; kiểm định nhiều lần; hiệu ứng mới lạ; nhóm giữ lại (holdout) để đo tác động tăng thêm thật của quảng cáo.',
  `<span class="eyebrow">ABA201c · Chapter 8 · Lesson 8.3</span>
<h2>Experiment pitfalls</h2>
<p class="lead">Most wrong A/B conclusions do not come from bad formulas. They come from bad habits: checking results every morning, ignoring a broken split, testing twenty metrics and reporting the one that "won". Here is how to protect yourself.</p>
<h3>🎯 Objectives</h3>
<ul><li>See, by simulation, why repeated peeking inflates false positives.</li><li>Check for sample-ratio mismatch with a chi-square test.</li><li>Handle multiple comparisons, novelty effects and measure incrementality with holdouts.</li></ul>
<h3>📖 Lecture</h3>
<h3>1. Peeking</h3>
<p>The p &lt; 0.05 rule assumes you look <strong>once</strong>, at the planned sample size. If you check every day and stop as soon as p dips below 0.05, you give chance many opportunities to fool you. Evan Miller's classic essay "How Not To Run an A/B Test" explains this trap. Fixes: fix the sample size in advance and analyse once, or use methods designed for continuous monitoring (sequential tests) provided by many experimentation platforms.</p>
<h3>2. Sample-ratio mismatch (SRM)</h3>
<p>If you planned a 50/50 split and got 50,600 vs 49,100 users, something may be broken: a redirect that loses users in one variant, a bot filter, a tracking bug. Checking the split is therefore a basic trust test — when the split is off, the result cannot be trusted, no matter how good it looks.</p>
<h3>3. Multiple comparisons</h3>
<p>Test 20 metrics with no real effect, each at α = 0.05, and on average one will look "significant". Decide one primary metric in advance; treat the rest as exploratory. If you must test many variants, use a stricter threshold (the simple <strong>Bonferroni</strong> correction divides α by the number of comparisons).</p>
<h3>4. Novelty and learning effects</h3>
<p>A new design may win in week 1 because it is new, then fade. Or regular users may initially dislike change and later prefer it. Run long enough and look at the effect by week.</p>
<h3>5. Incrementality: holdouts</h3>
<p>Platform dashboards report conversions from people who saw an ad — but many would have bought anyway. A <strong>holdout</strong> (or conversion-lift test) randomly keeps a group from seeing ads; the difference in purchases between exposed and held-out groups is the <em>incremental</em> effect. Geo-experiments do the same with regions (ads on in some provinces, off in comparable ones).</p>
<h3>✍️ Worked example — SRM and peeking simulated</h3>
<pre><code class="language-python">import numpy as np
from scipy.stats import chisquare

# 1) Sample ratio mismatch check: we planned 50/50
observed = [50_600, 49_100]
stat, p = chisquare(observed)
print(f"SRM check: chi2={stat:.1f}, p={p:.6f}")

# 2) Peeking: A and B are IDENTICAL (true lift = 0). Check p-value every day, stop at first p&lt;0.05
rng = np.random.default_rng(0)
from scipy.stats import norm
def p_val(ca, cb, n):
    pa, pb = ca / n, cb / n; pp = (ca + cb) / (2 * n)
    se = np.sqrt(pp * (1 - pp) * 2 / n)
    return 2 * (1 - norm.cdf(abs(pb - pa) / se)) if se &gt; 0 else 1
false_wins_peek = false_wins_once = 0
for sim in range(1000):
    ca = cb = n = 0; stopped = False
    for day in range(20):
        ca += rng.binomial(500, 0.05); cb += rng.binomial(500, 0.05); n += 500
        if not stopped and p_val(ca, cb, n) &lt; 0.05:
            stopped = True
    false_wins_peek += stopped
    false_wins_once += p_val(ca, cb, n) &lt; 0.05
print("false 'winners' when peeking daily:", false_wins_peek / 1000)
print("false 'winners' when looking once at the end:", false_wins_once / 1000)
</code></pre>
<div class="out">SRM check: chi2=22.6, p=0.000002
false 'winners' when peeking daily: 0.255
false 'winners' when looking once at the end: 0.053</div>
<p><strong>Reading the output.</strong> (1) The chi-square test says a 50,600 / 49,100 split is extremely unlikely under a true 50/50 (p ≈ 0.000002): investigate before reading any metric. (2) We simulated 1,000 <strong>A/A tests</strong> — both groups identical, so every "winner" is false. Looking once at the end produced 5.3% false winners, close to the promised 5%. Checking daily for 20 days and stopping at the first p &lt; 0.05 produced 25.5% false winners — about five times more. That is why "it was significant on Tuesday" is not evidence.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Stopping a test the moment it turns green.</li><li>Not checking the split ratio before analysing.</li><li>Slicing results by 15 segments and reporting the one that won ("it works for women in Hà Nội on iOS!").</li><li>Trusting platform-attributed conversions as incremental impact.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Peeking inflates false positives; fix the sample size or use sequential methods.</li><li>Check SRM first; a broken split invalidates the test.</li><li>One primary metric; correct for many comparisons.</li><li>Watch novelty; measure incrementality with holdouts or geo tests.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.evanmiller.org/how-not-to-run-an-ab-test.html" target="_blank" rel="noopener">Evan Miller — How Not To Run an A/B Test</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.chi2_contingency.html" target="_blank" rel="noopener">SciPy — chi-square tests (chi2_contingency)</a></li><li><a href="https://www.optimizely.com/optimization-glossary/multi-armed-bandit/" target="_blank" rel="noopener">Optimizely — Multi-armed bandit (an alternative to fixed A/B splits)</a></li><li><a href="https://experimentguide.com/" target="_blank" rel="noopener">Kohavi, Tang &amp; Xu — Trustworthy Online Controlled Experiments</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Your colleague says "variant C beat control on day 2 with p = 0.03, let's stop". What do you answer?</li><li>You test 5 subject lines against control. With Bonferroni, what threshold should each comparison use?</li><li>Design a holdout to measure whether retargeting ads create extra purchases.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) The test was planned for 14 days; early peeks inflate false positives (our simulation: about 5× more). Keep running to the planned size, then analyse once. 2) 0.05 ÷ 5 = 0.01. 3) Randomly split the retargeting audience: 90% eligible for ads, 10% held out (no retargeting). After 4 weeks compare purchase rates per person; the difference (with a CI) is the incremental effect; compare it with the spend.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 8 · Bài 8.3</span>
<h2>Bẫy trong thử nghiệm</h2>
<p class="lead">Phần lớn kết luận A/B sai không đến từ công thức sai. Chúng đến từ thói quen xấu: sáng nào cũng xem kết quả, phớt lờ việc chia nhóm bị hỏng, thử hai mươi chỉ số rồi báo cái "thắng". Đây là cách tự bảo vệ.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Thấy qua mô phỏng vì sao nhìn trộm nhiều lần làm tăng dương tính giả.</li><li>Kiểm lệch tỷ lệ mẫu bằng kiểm định chi bình phương.</li><li>Xử lý so sánh nhiều lần, hiệu ứng mới lạ và đo tác động tăng thêm bằng nhóm giữ lại.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>1. Nhìn trộm (peeking)</h3>
<p>Quy tắc p &lt; 0,05 giả định bạn nhìn <strong>một lần</strong>, ở cỡ mẫu đã định. Nếu xem mỗi ngày và dừng ngay khi p tụt dưới 0,05, bạn cho sự ngẫu nhiên rất nhiều cơ hội đánh lừa mình. Bài viết kinh điển "How Not To Run an A/B Test" của Evan Miller giải thích cái bẫy này. Cách sửa: cố định cỡ mẫu trước và phân tích một lần, hoặc dùng phương pháp thiết kế cho theo dõi liên tục (kiểm định tuần tự) mà nhiều nền tảng thử nghiệm cung cấp.</p>
<h3>2. Lệch tỷ lệ mẫu (SRM)</h3>
<p>Nếu dự định chia 50/50 mà nhận 50.600 so với 49.100 người, có thể đã có gì hỏng: một lệnh chuyển hướng làm rơi người dùng ở một phiên bản, bộ lọc bot, lỗi tracking. Vì vậy kiểm tra tỷ lệ chia là phép thử độ tin cậy cơ bản — khi chia lệch, kết quả không đáng tin, dù trông đẹp tới đâu.</p>
<h3>3. So sánh nhiều lần</h3>
<p>Thử 20 chỉ số không có hiệu ứng thật, mỗi cái ở α = 0,05, trung bình sẽ có một cái trông "có ý nghĩa". Hãy chọn trước một chỉ số chính; các chỉ số còn lại chỉ để khám phá. Nếu buộc phải thử nhiều phiên bản, dùng ngưỡng chặt hơn (hiệu chỉnh <strong>Bonferroni</strong> đơn giản chia α cho số phép so sánh).</p>
<h3>4. Hiệu ứng mới lạ và học hỏi</h3>
<p>Thiết kế mới có thể thắng tuần đầu vì nó mới, rồi nhạt dần. Hoặc người dùng quen ban đầu ghét thay đổi, sau lại thích. Hãy chạy đủ lâu và xem hiệu ứng theo từng tuần.</p>
<h3>5. Incrementality: nhóm giữ lại</h3>
<p>Dashboard của nền tảng báo chuyển đổi từ những người đã thấy quảng cáo — nhưng nhiều người vẫn sẽ mua dù không thấy. <strong>Nhóm giữ lại (holdout)</strong> (hay thử nghiệm conversion lift) giữ ngẫu nhiên một nhóm không cho thấy quảng cáo; chênh lệch mua hàng giữa nhóm được thấy và nhóm giữ lại là tác động <em>tăng thêm</em> thật. Thử nghiệm theo vùng địa lý làm tương tự với các tỉnh (bật quảng cáo ở một số tỉnh, tắt ở các tỉnh tương đương).</p>
<h3>✍️ Ví dụ — mô phỏng SRM và nhìn trộm</h3>
<pre><code class="language-python">import numpy as np
from scipy.stats import chisquare

# 1) Sample ratio mismatch check: we planned 50/50
observed = [50_600, 49_100]
stat, p = chisquare(observed)
print(f"SRM check: chi2={stat:.1f}, p={p:.6f}")

# 2) Peeking: A and B are IDENTICAL (true lift = 0). Check p-value every day, stop at first p&lt;0.05
rng = np.random.default_rng(0)
from scipy.stats import norm
def p_val(ca, cb, n):
    pa, pb = ca / n, cb / n; pp = (ca + cb) / (2 * n)
    se = np.sqrt(pp * (1 - pp) * 2 / n)
    return 2 * (1 - norm.cdf(abs(pb - pa) / se)) if se &gt; 0 else 1
false_wins_peek = false_wins_once = 0
for sim in range(1000):
    ca = cb = n = 0; stopped = False
    for day in range(20):
        ca += rng.binomial(500, 0.05); cb += rng.binomial(500, 0.05); n += 500
        if not stopped and p_val(ca, cb, n) &lt; 0.05:
            stopped = True
    false_wins_peek += stopped
    false_wins_once += p_val(ca, cb, n) &lt; 0.05
print("false 'winners' when peeking daily:", false_wins_peek / 1000)
print("false 'winners' when looking once at the end:", false_wins_once / 1000)
</code></pre>
<div class="out">SRM check: chi2=22.6, p=0.000002
false 'winners' when peeking daily: 0.255
false 'winners' when looking once at the end: 0.053</div>
<p><strong>Đọc kết quả.</strong> (1) Kiểm định chi bình phương cho thấy chia 50.600 / 49.100 là cực kỳ khó xảy ra nếu thật sự 50/50 (p ≈ 0,000002): hãy điều tra trước khi đọc bất kỳ chỉ số nào. (2) Ta mô phỏng 1.000 <strong>thử nghiệm A/A</strong> — hai nhóm y hệt nhau, nên mọi "người thắng" đều là giả. Nhìn một lần ở cuối cho 5,3% người thắng giả, gần đúng mức 5% đã hứa. Xem mỗi ngày trong 20 ngày và dừng ở lần đầu p &lt; 0,05 cho 25,5% người thắng giả — gấp khoảng năm lần. Vì vậy "hôm thứ Ba nó có ý nghĩa mà" không phải bằng chứng.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dừng thử nghiệm ngay khi nó chuyển xanh.</li><li>Không kiểm tỷ lệ chia trước khi phân tích.</li><li>Chẻ kết quả theo 15 phân khúc rồi báo phân khúc thắng ("hiệu quả với nữ ở Hà Nội dùng iOS!").</li><li>Tin số chuyển đổi do nền tảng phân bổ là tác động tăng thêm.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Nhìn trộm làm tăng dương tính giả; cố định cỡ mẫu hoặc dùng phương pháp tuần tự.</li><li>Kiểm SRM trước; chia hỏng thì thử nghiệm mất giá trị.</li><li>Một chỉ số chính; hiệu chỉnh khi so sánh nhiều lần.</li><li>Để ý hiệu ứng mới lạ; đo incrementality bằng holdout hoặc thử nghiệm theo vùng.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.evanmiller.org/how-not-to-run-an-ab-test.html" target="_blank" rel="noopener">Evan Miller — How Not To Run an A/B Test</a></li><li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.chi2_contingency.html" target="_blank" rel="noopener">SciPy — Kiểm định chi bình phương (chi2_contingency)</a></li><li><a href="https://www.optimizely.com/optimization-glossary/multi-armed-bandit/" target="_blank" rel="noopener">Optimizely — Multi-armed bandit (phương án thay cho chia A/B cố định)</a></li><li><a href="https://experimentguide.com/" target="_blank" rel="noopener">Kohavi, Tang &amp; Xu — Trustworthy Online Controlled Experiments</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Đồng nghiệp nói "phiên bản C thắng nhóm đối chứng ở ngày thứ 2 với p = 0,03, dừng thôi". Bạn trả lời thế nào?</li><li>Bạn thử 5 tiêu đề so với đối chứng. Với Bonferroni, mỗi phép so sánh dùng ngưỡng nào?</li><li>Thiết kế một nhóm giữ lại để đo xem quảng cáo bám đuổi (retargeting) có tạo thêm lượt mua không.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Thử nghiệm được lên kế hoạch 14 ngày; nhìn sớm làm tăng dương tính giả (mô phỏng của ta: gấp khoảng 5 lần). Hãy chạy tới cỡ mẫu đã định rồi phân tích một lần. 2) 0,05 ÷ 5 = 0,01. 3) Chia ngẫu nhiên tệp retargeting: 90% đủ điều kiện xem quảng cáo, 10% giữ lại (không retargeting). Sau 4 tuần so tỷ lệ mua trên mỗi người; chênh lệch (kèm KTC) là tác động tăng thêm; so nó với chi phí.</p></div>`);

const q8 = QZ(8, 'Chapter 8 quiz — A/B testing|||Quiz Chương 8 — A/B testing', '10 câu ôn ngẫu nhiên hoá, chỉ số chính/bảo vệ, cỡ mẫu, p-value, khoảng tin cậy, ý nghĩa thực tế, nhìn trộm, SRM, Bonferroni và holdout.', [
  Q('q1', 'The main reason to assign users randomly to A and B is to|||Lý do chính để phân người dùng ngẫu nhiên vào A và B là',
    ['make the test faster|||làm thử nghiệm nhanh hơn', 'make groups alike on average so differences are caused by the treatment|||làm các nhóm giống nhau về trung bình để khác biệt là do phương án gây ra', 'reduce the sample size|||giảm cỡ mẫu', 'satisfy the platform|||làm vừa lòng nền tảng'], 1,
    'Randomisation balances both measured and unmeasured factors.|||Ngẫu nhiên hoá cân bằng cả yếu tố đo được và không đo được.'),
  Q('q2', 'An unsubscribe rate that must not get worse during an email test is a|||Tỷ lệ huỷ đăng ký không được xấu đi trong thử nghiệm email là',
    ['primary metric|||chỉ số chính', 'guardrail metric|||chỉ số bảo vệ', 'vanity metric|||vanity metric', 'p-value|||p-value'], 1,
    'Guardrails protect against wins that cause harm elsewhere.|||Chỉ số bảo vệ ngăn những chiến thắng gây hại ở chỗ khác.'),
  Q('q3', 'Compared with detecting a +20% relative lift, detecting a +10% lift needs roughly|||So với phát hiện mức tăng tương đối +20%, phát hiện +10% cần khoảng',
    ['half the sample|||một nửa cỡ mẫu', 'the same sample|||cùng cỡ mẫu', 'twice the sample|||gấp đôi cỡ mẫu', 'four times the sample|||gấp bốn cỡ mẫu'], 3,
    'Sample size scales with 1 ÷ (difference)²; halving the difference ≈ ×4.|||Cỡ mẫu tỷ lệ với 1 ÷ (chênh lệch)²; chênh lệch giảm một nửa ≈ ×4.'),
  Q('q4', 'p = 0.02 in an A/B test means|||p = 0,02 trong A/B test nghĩa là',
    ['there is a 98% chance B is better|||có 98% khả năng B tốt hơn', 'data this extreme would occur about 2% of the time if there were no real difference|||dữ liệu cực đoan như vậy chỉ xảy ra khoảng 2% số lần nếu không có khác biệt thật', 'B is 2% better|||B tốt hơn 2%', 'the test failed|||thử nghiệm thất bại'], 1,
    'The p-value is computed assuming the null hypothesis is true.|||P-value được tính với giả định giả thuyết không là đúng.'),
  Q('q5', '95% CI for B − A is [+0.3, +1.1] percentage points. You can conclude|||KTC 95% cho B − A là [+0,3; +1,1] điểm phần trăm. Bạn có thể kết luận',
    ['B is better; the true gain is plausibly between 0.3 and 1.1 points|||B tốt hơn; mức tăng thật hợp lý nằm trong khoảng 0,3 đến 1,1 điểm', 'the result is not significant|||kết quả không có ý nghĩa', 'B is exactly 0.7 points better|||B tốt hơn đúng 0,7 điểm', 'A is better|||A tốt hơn'], 0,
    'The whole interval is above zero.|||Cả khoảng nằm trên 0.'),
  Q('q6', 'A statistically significant +0.02-point lift on 10 million users is|||Mức tăng +0,02 điểm có ý nghĩa thống kê trên 10 triệu người là',
    ['always worth rolling out|||luôn đáng triển khai', 'real but possibly too small to justify the cost|||có thật nhưng có thể quá nhỏ so với chi phí', 'a false positive|||dương tính giả', 'proof of SRM|||bằng chứng của SRM'], 1,
    'Significance is not importance; compare value with cost.|||Có ý nghĩa không phải là quan trọng; so giá trị với chi phí.'),
  Q('q7', 'In our simulation, checking daily and stopping at the first p below 0.05 gave about|||Trong mô phỏng của ta, xem mỗi ngày và dừng ở lần đầu p dưới 0,05 cho khoảng',
    ['5% false winners|||5% người thắng giả', '25% false winners|||25% người thắng giả', '0% false winners|||0% người thắng giả', '50% true winners|||50% người thắng thật'], 1,
    'Repeated looks inflate the false-positive rate (0.255 vs 0.053 when looking once).|||Nhìn nhiều lần làm tăng tỷ lệ dương tính giả (0,255 so với 0,053 khi nhìn một lần).'),
  Q('q8', 'A planned 50/50 test ends with 52,000 vs 48,000 users. First you should|||Thử nghiệm dự định 50/50 kết thúc với 52.000 và 48.000 người. Việc đầu tiên nên làm là',
    ['declare the bigger group the winner|||tuyên bố nhóm lớn hơn thắng', 'investigate a sample-ratio mismatch before trusting any metric|||điều tra lệch tỷ lệ mẫu trước khi tin bất kỳ chỉ số nào', 'double the budget|||tăng gấp đôi ngân sách', 'ignore it|||bỏ qua'], 1,
    'A broken split can bias every result.|||Chia nhóm hỏng có thể làm lệch mọi kết quả.'),
  Q('q9', 'With 4 comparisons and Bonferroni, each test should use α =|||Với 4 phép so sánh và Bonferroni, mỗi kiểm định dùng α =',
    ['0.05|||0,05', '0.20|||0,20', '0.0125|||0,0125', '0.01|||0,01'], 2,
    '0.05 ÷ 4 = 0.0125.|||0,05 ÷ 4 = 0,0125.'),
  Q('q10', 'The incremental effect of retargeting ads is best measured by|||Tác động tăng thêm của quảng cáo retargeting được đo tốt nhất bằng',
    ['conversions reported by the ad platform|||số chuyển đổi nền tảng quảng cáo báo', 'last-click attribution in GA4|||phân bổ click cuối trong GA4', 'a randomised holdout group that sees no retargeting|||một nhóm giữ lại ngẫu nhiên không thấy retargeting', 'comparing this month with last month|||so tháng này với tháng trước'], 2,
    'Only a randomised comparison shows purchases that would not have happened anyway.|||Chỉ so sánh ngẫu nhiên mới cho thấy lượt mua lẽ ra không xảy ra.'),
]);

const ch8 = {
  title: 'Chapter 8 — A/B testing and controlled experiments|||Chương 8 — A/B testing và thử nghiệm có kiểm soát',
  description: 'Vì sao thử nghiệm ngẫu nhiên là chuẩn vàng để đo nhân quả; thiết kế A/B test (giả thuyết, chỉ số chính, phân ngẫu nhiên, cỡ mẫu); phân tích bằng kiểm định z hai tỷ lệ, p-value, khoảng tin cậy; bẫy nhìn trộm, lệch tỷ lệ mẫu (SRM), kiểm định nhiều lần, hiệu ứng mới lạ, nhóm giữ lại đo incrementality.',
  lessons: [l8_1, l8_2, l8_3, q8],
};

const l9_1 = L('aba201c-ts-9-1',
  '9.1 — How generative AI works: tokens, next-word prediction and temperature|||9.1 — AI tạo sinh hoạt động thế nào: token, dự đoán từ tiếp theo và nhiệt độ',
  'Mô hình ngôn ngữ lớn là gì ở mức trực giác, huấn luyện dự đoán token tiếp theo, mô hình bigram tí hon bằng Python để thấy "nhiệt độ" thay đổi đầu ra, các ứng dụng hợp lý trong truyền thông và vì sao văn trôi chảy chưa chắc đúng.',
  `<span class="eyebrow">ABA201c · Chapter 9 · Lesson 9.1</span>
<h2>How generative AI works</h2>
<p class="lead">Generative AI writes captions, drafts press releases, summarises comments and creates images in seconds. To use it well — and to know when not to trust it — you need a correct mental model of what it is doing.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain large language models (LLMs) as next-token predictors trained on large text collections.</li><li>Understand tokens, context windows and temperature.</li><li>Build a toy next-word model to see why fluent text is not the same as true text.</li></ul>
<h3>📖 Lecture</h3>
<h3>The core idea</h3>
<p>A <strong>large language model</strong> is a neural network trained on an enormous collection of text to predict the next <strong>token</strong> (a word or piece of a word) given the tokens before it. Google's Machine Learning Crash Course puts it as estimating the probability of a token or sequence of tokens within a longer sequence — "filling in the blank". Repeating the prediction — choose a token, append it, predict again — produces whole paragraphs. After this <em>pre-training</em>, models are further tuned with human feedback and instructions so they follow requests and answer in a helpful style.</p>
<ul>
<li><strong>Tokens</strong>: models read and write tokens, not letters. Vietnamese with diacritics often uses more tokens per word than English, which affects cost and length limits.</li>
<li><strong>Context window</strong>: the maximum amount of text (prompt + answer) the model can consider at once. Documents longer than that must be split or summarised.</li>
<li><strong>Temperature</strong>: how adventurous the choice of the next token is. Low temperature → the most likely continuation, more predictable; high temperature → more variety, more risk of nonsense.</li>
<li><strong>Image generators</strong> use different architectures (often diffusion models) but the same principle: they learn patterns from huge training sets and generate new samples that fit a prompt.</li>
</ul>
<h3>✍️ Worked example — a model with one tiny "brain"</h3>
<p>We "train" a toy model by counting which word follows which in six short phrases about drinks, then look at the probabilities after "phê" at different temperatures and generate a few phrases.</p>
<pre><code class="language-python">from collections import Counter, defaultdict
import random

corpus = ("cà phê sữa đá ngon . cà phê đen đá đậm . trà sữa trân châu ngon . "
          "cà phê sữa nóng thơm . trà đào cam sả mát . cà phê muối béo").split()
nxt = defaultdict(Counter)
for a, b in zip(corpus, corpus[1:]):
    nxt[a][b] += 1               # "training" = counting what follows what

print("after 'phê':", dict(nxt["phê"]))

def probs(word, temperature):
    words, counts = zip(*nxt[word].items())
    w = [c ** (1 / temperature) for c in counts]
    return {x: round(v / sum(w), 2) for x, v in zip(words, w)}

for t in [0.3, 1.0, 3.0]:
    print(f"temperature {t}: P(next | 'phê') =", probs("phê", t))

rnd = random.Random(42)
def generate(word, steps, t):
    out = [word]
    for _ in range(steps):
        if not nxt[out[-1]]: break
        p = probs(out[-1], t)
        out.append(rnd.choices(list(p), list(p.values()))[0])
    return " ".join(out)
print([generate("cà", 3, 1.0) for _ in range(4)])
</code></pre>
<div class="out">after 'phê': {'sữa': 2, 'đen': 1, 'muối': 1}
temperature 0.3: P(next | 'phê') = {'sữa': 0.83, 'đen': 0.08, 'muối': 0.08}
temperature 1.0: P(next | 'phê') = {'sữa': 0.5, 'đen': 0.25, 'muối': 0.25}
temperature 3.0: P(next | 'phê') = {'sữa': 0.39, 'đen': 0.31, 'muối': 0.31}
['cà phê sữa đá', 'cà phê đen đá', 'cà phê sữa trân', 'cà phê sữa trân']</div>
<p><strong>Reading the output.</strong> After "phê" the model has seen "sữa" twice and "đen", "muối" once each. At temperature 0.3 it chooses "sữa" 83% of the time (predictable); at 3.0 the three options become almost equally likely (varied). Now look at the generated phrases: "cà phê sữa trân" — <em>coffee with milk tapioca</em>? The model glued "sữa" from "cà phê sữa" to "trân" from "trà sữa trân châu". It only knows which word tends to follow which; it has no idea what a drink is. Real LLMs are vastly more capable, but the lesson scales: <strong>they produce plausible continuations, and plausibility is not truth</strong>.</p>
<h3>Where generative AI helps in communications</h3>
<ul>
<li><strong>Ideation</strong>: 30 angles for a campaign, headline variants, hooks for short videos.</li>
<li><strong>First drafts</strong> of routine texts: product descriptions, FAQ answers, email variants for A/B tests.</li>
<li><strong>Adaptation</strong>: shorten, change tone, translate and localise (always reviewed by a fluent person).</li>
<li><strong>Analysis support</strong>: summarise hundreds of comments, propose themes (then verify, Chapter 5), classify messages.</li>
<li><strong>Visual drafts</strong>: mood boards and concept images before a real shoot.</li>
</ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Treating the model as a search engine or a database of facts.</li><li>High temperature for factual tasks (product specs, prices) — use low temperature and supply the facts.</li><li>Assuming the model knows recent events; its knowledge stops at its training data unless connected to search or your documents.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>LLMs predict the next token from huge training text, then are tuned to follow instructions.</li><li>Tokens, context window and temperature control cost, length and creativity.</li><li>Fluent ≠ true: models generate plausible text, not verified facts.</li><li>Best uses: ideation, drafts, adaptation, summarising — with a human in the loop.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://developers.google.com/machine-learning/crash-course/llm" target="_blank" rel="noopener">Google ML Crash Course — Introduction to large language models</a></li><li><a href="https://www.ibm.com/think/topics/generative-ai" target="_blank" rel="noopener">IBM — What is generative AI?</a></li><li><a href="https://www.elementsofai.com/" target="_blank" rel="noopener">Elements of AI — free introduction to AI for non-experts</a></li><li><a href="https://www.coursera.org/learn/generative-ai-for-everyone" target="_blank" rel="noopener">Generative AI for Everyone (Coursera)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Explain in one sentence why an LLM can write a confident but wrong product price.</li><li>Which temperature would you use for (a) 20 creative slogan ideas, (b) a summary of a press release's facts?</li><li>Name two communication tasks where generative AI saves time and one where you would not use it without heavy checking.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) It generates the most plausible-looking continuation from patterns in its training text, not from your current price list. 2) (a) higher (more variety), (b) low (stay close to the source). 3) Saves time: headline variants for A/B tests; summarising 500 comments into themes. Heavy checking: medical/legal claims, statistics and prices, crisis statements.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 9 · Bài 9.1</span>
<h2>AI tạo sinh hoạt động thế nào</h2>
<p class="lead">AI tạo sinh viết caption, soạn nháp thông cáo báo chí, tóm tắt bình luận và tạo hình ảnh trong vài giây. Muốn dùng giỏi — và biết khi nào không nên tin — bạn cần một hình dung đúng về việc nó đang làm.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích mô hình ngôn ngữ lớn (LLM) là cỗ máy dự đoán token tiếp theo được huấn luyện trên khối văn bản lớn.</li><li>Hiểu token, cửa sổ ngữ cảnh và nhiệt độ.</li><li>Dựng một mô hình đoán từ tiếp theo tí hon để thấy vì sao văn trôi chảy không đồng nghĩa với văn đúng.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Ý tưởng cốt lõi</h3>
<p><strong>Mô hình ngôn ngữ lớn</strong> là một mạng nơ-ron được huấn luyện trên khối văn bản khổng lồ để dự đoán <strong>token</strong> tiếp theo (một từ hoặc mảnh từ) dựa trên các token trước đó. Google Machine Learning Crash Course mô tả đó là ước lượng xác suất của một token hay chuỗi token trong một chuỗi dài hơn — "điền vào chỗ trống". Lặp lại việc dự đoán — chọn một token, nối vào, dự đoán tiếp — tạo ra cả đoạn văn. Sau giai đoạn <em>tiền huấn luyện</em> này, mô hình được tinh chỉnh tiếp bằng phản hồi của con người và chỉ dẫn để làm theo yêu cầu và trả lời theo phong cách hữu ích.</p>
<ul>
<li><strong>Token</strong>: mô hình đọc và viết theo token, không theo chữ cái. Tiếng Việt có dấu thường tốn nhiều token cho mỗi từ hơn tiếng Anh, ảnh hưởng tới chi phí và giới hạn độ dài.</li>
<li><strong>Cửa sổ ngữ cảnh</strong>: lượng văn bản tối đa (prompt + câu trả lời) mô hình xét được cùng lúc. Tài liệu dài hơn phải được chia nhỏ hoặc tóm tắt.</li>
<li><strong>Nhiệt độ (temperature)</strong>: mức "phiêu" khi chọn token tiếp theo. Nhiệt độ thấp → phần tiếp theo khả dĩ nhất, dễ đoán; nhiệt độ cao → đa dạng hơn, dễ ra điều vô nghĩa hơn.</li>
<li><strong>Mô hình tạo ảnh</strong> dùng kiến trúc khác (thường là mô hình khuếch tán — diffusion) nhưng cùng nguyên lý: học mẫu hình từ tập huấn luyện khổng lồ rồi sinh mẫu mới phù hợp với prompt.</li>
</ul>
<h3>✍️ Ví dụ — một mô hình với "bộ não" tí hon</h3>
<p>Ta "huấn luyện" một mô hình đồ chơi bằng cách đếm từ nào đi sau từ nào trong sáu cụm từ về đồ uống, rồi xem xác suất sau chữ "phê" ở các nhiệt độ khác nhau và sinh vài cụm từ.</p>
<pre><code class="language-python">from collections import Counter, defaultdict
import random

corpus = ("cà phê sữa đá ngon . cà phê đen đá đậm . trà sữa trân châu ngon . "
          "cà phê sữa nóng thơm . trà đào cam sả mát . cà phê muối béo").split()
nxt = defaultdict(Counter)
for a, b in zip(corpus, corpus[1:]):
    nxt[a][b] += 1               # "training" = counting what follows what

print("after 'phê':", dict(nxt["phê"]))

def probs(word, temperature):
    words, counts = zip(*nxt[word].items())
    w = [c ** (1 / temperature) for c in counts]
    return {x: round(v / sum(w), 2) for x, v in zip(words, w)}

for t in [0.3, 1.0, 3.0]:
    print(f"temperature {t}: P(next | 'phê') =", probs("phê", t))

rnd = random.Random(42)
def generate(word, steps, t):
    out = [word]
    for _ in range(steps):
        if not nxt[out[-1]]: break
        p = probs(out[-1], t)
        out.append(rnd.choices(list(p), list(p.values()))[0])
    return " ".join(out)
print([generate("cà", 3, 1.0) for _ in range(4)])
</code></pre>
<div class="out">after 'phê': {'sữa': 2, 'đen': 1, 'muối': 1}
temperature 0.3: P(next | 'phê') = {'sữa': 0.83, 'đen': 0.08, 'muối': 0.08}
temperature 1.0: P(next | 'phê') = {'sữa': 0.5, 'đen': 0.25, 'muối': 0.25}
temperature 3.0: P(next | 'phê') = {'sữa': 0.39, 'đen': 0.31, 'muối': 0.31}
['cà phê sữa đá', 'cà phê đen đá', 'cà phê sữa trân', 'cà phê sữa trân']</div>
<p><strong>Đọc kết quả.</strong> Sau "phê", mô hình đã thấy "sữa" hai lần, "đen" và "muối" mỗi từ một lần. Ở nhiệt độ 0,3 nó chọn "sữa" 83% số lần (dễ đoán); ở 3,0 ba lựa chọn gần như ngang nhau (đa dạng). Giờ nhìn các cụm vừa sinh: "cà phê sữa trân" — <em>cà phê sữa trân châu</em>? Mô hình đã dán "sữa" trong "cà phê sữa" với "trân" trong "trà sữa trân châu". Nó chỉ biết từ nào hay đi sau từ nào; nó không hề biết đồ uống là gì. LLM thật mạnh hơn rất rất nhiều, nhưng bài học vẫn đúng ở quy mô lớn: <strong>chúng tạo ra phần tiếp theo nghe hợp lý, và hợp lý không phải là sự thật</strong>.</p>
<h3>AI tạo sinh giúp được gì trong truyền thông</h3>
<ul>
<li><strong>Lên ý tưởng</strong>: 30 góc tiếp cận cho một chiến dịch, các phương án tiêu đề, hook cho video ngắn.</li>
<li><strong>Bản nháp đầu</strong> cho văn bản thường lệ: mô tả sản phẩm, câu trả lời FAQ, các phiên bản email cho A/B test.</li>
<li><strong>Chuyển thể</strong>: rút gọn, đổi giọng, dịch và bản địa hoá (luôn có người thạo ngôn ngữ duyệt).</li>
<li><strong>Hỗ trợ phân tích</strong>: tóm tắt hàng trăm bình luận, đề xuất chủ đề (rồi kiểm lại, Chương 5), phân loại tin nhắn.</li>
<li><strong>Bản nháp hình ảnh</strong>: moodboard và ảnh ý tưởng trước buổi chụp thật.</li>
</ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Coi mô hình như công cụ tìm kiếm hay cơ sở dữ liệu sự thật.</li><li>Dùng nhiệt độ cao cho việc cần chính xác (thông số, giá) — hãy dùng nhiệt độ thấp và tự cung cấp dữ kiện.</li><li>Cho rằng mô hình biết sự kiện gần đây; kiến thức của nó dừng ở dữ liệu huấn luyện trừ khi được nối với tìm kiếm hoặc tài liệu của bạn.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>LLM dự đoán token tiếp theo từ khối văn bản huấn luyện khổng lồ, rồi được tinh chỉnh để làm theo chỉ dẫn.</li><li>Token, cửa sổ ngữ cảnh và nhiệt độ quyết định chi phí, độ dài và độ sáng tạo.</li><li>Trôi chảy ≠ đúng: mô hình sinh văn bản hợp lý, không phải sự thật đã kiểm chứng.</li><li>Dùng tốt nhất cho: ý tưởng, bản nháp, chuyển thể, tóm tắt — luôn có con người tham gia.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://developers.google.com/machine-learning/crash-course/llm" target="_blank" rel="noopener">Google ML Crash Course — Nhập môn mô hình ngôn ngữ lớn</a></li><li><a href="https://www.ibm.com/think/topics/generative-ai" target="_blank" rel="noopener">IBM — AI tạo sinh là gì?</a></li><li><a href="https://www.elementsofai.com/" target="_blank" rel="noopener">Elements of AI — nhập môn AI miễn phí cho người không chuyên</a></li><li><a href="https://www.coursera.org/learn/generative-ai-for-everyone" target="_blank" rel="noopener">Generative AI for Everyone (Coursera)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Giải thích trong một câu vì sao LLM có thể viết ra một mức giá sản phẩm sai mà vẫn rất tự tin.</li><li>Bạn dùng nhiệt độ nào cho (a) 20 ý tưởng slogan sáng tạo, (b) tóm tắt dữ kiện của một thông cáo báo chí?</li><li>Nêu hai việc truyền thông mà AI tạo sinh giúp tiết kiệm thời gian và một việc bạn không dùng nếu không kiểm tra kỹ.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Nó sinh phần tiếp theo trông hợp lý nhất từ các mẫu hình trong văn bản huấn luyện, chứ không lấy từ bảng giá hiện tại của bạn. 2) (a) cao hơn (đa dạng), (b) thấp (bám sát nguồn). 3) Tiết kiệm: các phương án tiêu đề cho A/B test; tóm tắt 500 bình luận thành chủ đề. Phải kiểm kỹ: tuyên bố y tế/pháp lý, số liệu và giá, thông cáo xử lý khủng hoảng.</p></div>`);

const l9_2 = L('aba201c-ts-9-2',
  '9.2 — Prompting for communications: from creative brief to reviewed draft|||9.2 — Viết prompt cho truyền thông: từ brief sáng tạo đến bản nháp đã duyệt',
  'Cấu trúc một prompt tốt (vai trò, bối cảnh, khán giả, mục tiêu, dữ kiện, định dạng, ràng buộc, ví dụ), hướng dẫn giọng thương hiệu, sinh prompt từ brief bằng Python, quy trình lặp và con người duyệt, gắn AI với A/B testing.',
  `<span class="eyebrow">ABA201c · Chapter 9 · Lesson 9.2</span>
<h2>Prompting for communications</h2>
<p class="lead">A vague prompt gets a generic answer. A prompt built like a creative brief — audience, goal, facts, tone, format, limits — gets a draft you can actually use. Prompting is not a magic trick; it is briefing.</p>
<h3>🎯 Objectives</h3>
<ul><li>Structure a prompt with the elements of a creative brief.</li><li>Encode brand voice and hard constraints.</li><li>Run an iterate-and-review workflow and connect drafts to testing.</li></ul>
<h3>📖 Lecture</h3>
<h3>Anatomy of a good prompt</h3>
<p>Official prompt guides from model providers give similar advice — Google's, for instance, lists clear and specific instructions, a few examples, added context and breaking complex prompts into components. For communications, that maps neatly onto a brief:</p>
<div class="kv-grid">
<div class="kv"><span class="k">Role</span><span class="v">"You are the copywriter of brand X."</span></div>
<div class="kv"><span class="k">Audience</span><span class="v">who will read it, their situation and language level</span></div>
<div class="kv"><span class="k">Goal</span><span class="v">the single action or feeling you want</span></div>
<div class="kv"><span class="k">Facts</span><span class="v">the only claims allowed: prices, dates, features — copied from the source</span></div>
<div class="kv"><span class="k">Voice</span><span class="v">brand tone in a few adjectives plus do/don't words</span></div>
<div class="kv"><span class="k">Format</span><span class="v">channel, length, number of variants, structure</span></div>
<div class="kv"><span class="k">Constraints</span><span class="v">no invented numbers, no competitor comparisons, legal lines</span></div>
<div class="kv"><span class="k">Examples</span><span class="v">one or two past posts that performed well ("few-shot")</span></div>
</div>
<p>Add an escape hatch: "If information is missing, ask instead of inventing." It reduces made-up details.</p>
<h3>✍️ Worked example — turning a brief into a prompt</h3>
<p>Teams that produce content at scale store briefs as structured data and build prompts from them, so every request carries the same facts and rules. A minimal version in Python:</p>
<pre><code class="language-python">brief = {
    "brand": "Mộc Coffee",
    "voice": "ấm áp, gần gũi, không dùng từ lóng, không hứa hẹn quá mức",
    "audience": "sinh viên 18-22 tuổi ở Đà Nẵng",
    "goal": "giới thiệu món cà phê muối mới, khuyến khích ghé quán trong tuần khai trương",
    "facts": ["Giá 29.000đ", "Giảm 20% từ 10/11 đến 16/11 khi xuất trình thẻ sinh viên"],
    "format": "3 phương án caption Facebook, mỗi phương án ≤ 60 từ, kèm 1 lời kêu gọi hành động",
    "forbidden": ["số liệu không có trong FACTS", "so sánh với thương hiệu khác"],
}

def build_prompt(b):
    facts = "\\n".join("- " + f for f in b["facts"])
    banned = "; ".join(b["forbidden"])
    return (f"Bạn là copywriter của {b['brand']}. Giọng thương hiệu: {b['voice']}.\\n"
            f"Khán giả: {b['audience']}.\\nMục tiêu: {b['goal']}.\\n"
            f"FACTS (chỉ dùng các thông tin này):\\n{facts}\\n"
            f"Yêu cầu đầu ra: {b['format']}.\\nKhông được: {banned}.\\n"
            "Nếu thiếu thông tin, hãy hỏi lại thay vì tự bịa.")

p = build_prompt(brief)
print(p)
print("--- prompt length:", len(p.split()), "words")
</code></pre>
<div class="out">Bạn là copywriter của Mộc Coffee. Giọng thương hiệu: ấm áp, gần gũi, không dùng từ lóng, không hứa hẹn quá mức.
Khán giả: sinh viên 18-22 tuổi ở Đà Nẵng.
Mục tiêu: giới thiệu món cà phê muối mới, khuyến khích ghé quán trong tuần khai trương.
FACTS (chỉ dùng các thông tin này):
- Giá 29.000đ
- Giảm 20% từ 10/11 đến 16/11 khi xuất trình thẻ sinh viên
Yêu cầu đầu ra: 3 phương án caption Facebook, mỗi phương án ≤ 60 từ, kèm 1 lời kêu gọi hành động.
Không được: số liệu không có trong FACTS; so sánh với thương hiệu khác.
Nếu thiếu thông tin, hãy hỏi lại thay vì tự bịa.
--- prompt length: 118 words</div>
<p>The template guarantees that every caption request includes the audience, the two allowed facts and the forbidden behaviours. The same brief can feed several channels (Facebook, Zalo, email) with only the <code>format</code> line changed.</p>
<h3>The workflow: iterate, review, test</h3>
<ol>
<li><strong>Generate</strong> several variants (e.g. 3–5).</li>
<li><strong>Edit</strong>: a human sharpens the best one, fixes tone, removes clichés.</li>
<li><strong>Check</strong> every fact against the source (lesson 9.3 shows an automatic first pass), plus legal and brand rules.</li>
<li><strong>Approve</strong> by the responsible person — accountability stays human.</li>
<li><strong>Test</strong>: put two strong variants in an A/B test (Chapter 8). Generative AI makes variants cheap; experiments tell you which one works.</li>
</ol>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>"Write a viral post about our coffee" — no audience, no facts, no format.</li><li>Letting the model choose prices, dates or statistics.</li><li>Publishing the first output; the first draft is rarely the best.</li><li>Pasting confidential plans or customer data into public AI tools (lesson 9.3).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>A prompt is a brief: role, audience, goal, facts, voice, format, constraints, examples.</li><li>Supply facts; forbid invention; allow the model to ask.</li><li>Structured briefs make prompts consistent across a team.</li><li>Generate → edit → check → approve → test.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://aistudio.google.com/docs/prompting-strategies" target="_blank" rel="noopener">Google AI Studio — Prompt design strategies</a></li><li><a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noopener">OpenAI — Prompt engineering guide</a></li><li><a href="https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview" target="_blank" rel="noopener">Anthropic — Prompt engineering overview</a></li><li><a href="https://www.promptingguide.ai/" target="_blank" rel="noopener">DAIR.AI — Prompt Engineering Guide</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Rewrite as a brief-style prompt: "Write an email about our sale."</li><li>Why should facts be in a separate, clearly marked block?</li><li>How would you use generative AI and A/B testing together for a newsletter subject line?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) e.g. role: email copywriter for a bookshop; audience: members who bought in the last year; goal: visit the 11.11 sale page; facts: 20–50% off, 11–13 November, free shipping over 300,000 VND; voice: friendly, concise; format: subject line ≤ 45 characters + 80-word body + one button text; constraints: no claims beyond facts. 2) The model and the reviewer can see exactly which claims are allowed; checking becomes mechanical. 3) Generate 10 subject lines with the brief, a human shortlists 2 strong and different ones, A/B test them on a random 20% of the list, send the winner to the rest.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 9 · Bài 9.2</span>
<h2>Viết prompt cho truyền thông</h2>
<p class="lead">Prompt mơ hồ cho câu trả lời chung chung. Prompt được xây như một brief sáng tạo — khán giả, mục tiêu, dữ kiện, giọng điệu, định dạng, giới hạn — cho bản nháp dùng được thật. Viết prompt không phải ảo thuật; đó là viết brief.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Cấu trúc prompt theo các thành phần của một brief sáng tạo.</li><li>Đưa giọng thương hiệu và ràng buộc cứng vào prompt.</li><li>Chạy quy trình lặp – duyệt và nối bản nháp với thử nghiệm.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Giải phẫu một prompt tốt</h3>
<p>Hướng dẫn viết prompt chính thức của các nhà cung cấp mô hình khuyên gần giống nhau — ví dụ hướng dẫn của Google nêu: chỉ dẫn rõ ràng, cụ thể, vài ví dụ mẫu, bổ sung bối cảnh và chia prompt phức tạp thành từng phần. Với truyền thông, điều đó khớp gọn với một brief:</p>
<div class="kv-grid">
<div class="kv"><span class="k">Vai trò</span><span class="v">"Bạn là copywriter của thương hiệu X."</span></div>
<div class="kv"><span class="k">Khán giả</span><span class="v">ai sẽ đọc, hoàn cảnh và trình độ ngôn ngữ của họ</span></div>
<div class="kv"><span class="k">Mục tiêu</span><span class="v">một hành động hoặc cảm xúc duy nhất bạn muốn</span></div>
<div class="kv"><span class="k">Dữ kiện</span><span class="v">những tuyên bố duy nhất được phép: giá, ngày, tính năng — chép từ nguồn</span></div>
<div class="kv"><span class="k">Giọng</span><span class="v">giọng thương hiệu bằng vài tính từ cùng từ nên/không nên dùng</span></div>
<div class="kv"><span class="k">Định dạng</span><span class="v">kênh, độ dài, số phương án, cấu trúc</span></div>
<div class="kv"><span class="k">Ràng buộc</span><span class="v">không bịa số, không so sánh đối thủ, các dòng pháp lý</span></div>
<div class="kv"><span class="k">Ví dụ</span><span class="v">một hai bài cũ hiệu quả ("few-shot")</span></div>
</div>
<p>Thêm một lối thoát: "Nếu thiếu thông tin, hãy hỏi lại thay vì tự bịa." Nó giảm chi tiết bịa đặt.</p>
<h3>✍️ Ví dụ — biến brief thành prompt</h3>
<p>Các đội sản xuất nội dung số lượng lớn lưu brief dưới dạng dữ liệu có cấu trúc và dựng prompt từ đó, để mọi yêu cầu mang cùng dữ kiện và quy tắc. Phiên bản tối giản bằng Python:</p>
<pre><code class="language-python">brief = {
    "brand": "Mộc Coffee",
    "voice": "ấm áp, gần gũi, không dùng từ lóng, không hứa hẹn quá mức",
    "audience": "sinh viên 18-22 tuổi ở Đà Nẵng",
    "goal": "giới thiệu món cà phê muối mới, khuyến khích ghé quán trong tuần khai trương",
    "facts": ["Giá 29.000đ", "Giảm 20% từ 10/11 đến 16/11 khi xuất trình thẻ sinh viên"],
    "format": "3 phương án caption Facebook, mỗi phương án ≤ 60 từ, kèm 1 lời kêu gọi hành động",
    "forbidden": ["số liệu không có trong FACTS", "so sánh với thương hiệu khác"],
}

def build_prompt(b):
    facts = "\\n".join("- " + f for f in b["facts"])
    banned = "; ".join(b["forbidden"])
    return (f"Bạn là copywriter của {b['brand']}. Giọng thương hiệu: {b['voice']}.\\n"
            f"Khán giả: {b['audience']}.\\nMục tiêu: {b['goal']}.\\n"
            f"FACTS (chỉ dùng các thông tin này):\\n{facts}\\n"
            f"Yêu cầu đầu ra: {b['format']}.\\nKhông được: {banned}.\\n"
            "Nếu thiếu thông tin, hãy hỏi lại thay vì tự bịa.")

p = build_prompt(brief)
print(p)
print("--- prompt length:", len(p.split()), "words")
</code></pre>
<div class="out">Bạn là copywriter của Mộc Coffee. Giọng thương hiệu: ấm áp, gần gũi, không dùng từ lóng, không hứa hẹn quá mức.
Khán giả: sinh viên 18-22 tuổi ở Đà Nẵng.
Mục tiêu: giới thiệu món cà phê muối mới, khuyến khích ghé quán trong tuần khai trương.
FACTS (chỉ dùng các thông tin này):
- Giá 29.000đ
- Giảm 20% từ 10/11 đến 16/11 khi xuất trình thẻ sinh viên
Yêu cầu đầu ra: 3 phương án caption Facebook, mỗi phương án ≤ 60 từ, kèm 1 lời kêu gọi hành động.
Không được: số liệu không có trong FACTS; so sánh với thương hiệu khác.
Nếu thiếu thông tin, hãy hỏi lại thay vì tự bịa.
--- prompt length: 118 words</div>
<p>Mẫu này đảm bảo mọi yêu cầu viết caption đều có khán giả, hai dữ kiện được phép và các hành vi bị cấm. Cùng một brief có thể phục vụ nhiều kênh (Facebook, Zalo, email) chỉ bằng cách đổi dòng <code>format</code>.</p>
<h3>Quy trình: lặp, duyệt, thử</h3>
<ol>
<li><strong>Sinh</strong> vài phương án (ví dụ 3–5).</li>
<li><strong>Biên tập</strong>: con người mài phương án tốt nhất, chỉnh giọng, bỏ sáo ngữ.</li>
<li><strong>Kiểm</strong> mọi dữ kiện so với nguồn (bài 9.3 có một vòng kiểm tự động đầu tiên), cùng các quy tắc pháp lý và thương hiệu.</li>
<li><strong>Duyệt</strong> bởi người chịu trách nhiệm — trách nhiệm vẫn thuộc về con người.</li>
<li><strong>Thử nghiệm</strong>: đưa hai phương án mạnh vào A/B test (Chương 8). AI tạo sinh làm phương án trở nên rẻ; thử nghiệm cho biết phương án nào hiệu quả.</li>
</ol>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>"Viết một bài viral về cà phê của tụi mình" — không khán giả, không dữ kiện, không định dạng.</li><li>Để mô hình tự chọn giá, ngày hay số liệu.</li><li>Đăng ngay kết quả đầu tiên; bản nháp đầu hiếm khi là bản tốt nhất.</li><li>Dán kế hoạch mật hay dữ liệu khách hàng vào công cụ AI công cộng (bài 9.3).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Prompt là một brief: vai trò, khán giả, mục tiêu, dữ kiện, giọng, định dạng, ràng buộc, ví dụ.</li><li>Tự cung cấp dữ kiện; cấm bịa; cho phép mô hình hỏi lại.</li><li>Brief có cấu trúc giúp prompt nhất quán trong cả đội.</li><li>Sinh → biên tập → kiểm → duyệt → thử nghiệm.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://aistudio.google.com/docs/prompting-strategies" target="_blank" rel="noopener">Google AI Studio — Chiến lược thiết kế prompt</a></li><li><a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noopener">OpenAI — Hướng dẫn prompt engineering</a></li><li><a href="https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview" target="_blank" rel="noopener">Anthropic — Tổng quan prompt engineering</a></li><li><a href="https://www.promptingguide.ai/" target="_blank" rel="noopener">DAIR.AI — Prompt Engineering Guide</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Viết lại thành prompt kiểu brief: "Viết một email về đợt sale."</li><li>Vì sao dữ kiện nên nằm trong một khối riêng, đánh dấu rõ?</li><li>Bạn sẽ kết hợp AI tạo sinh và A/B testing thế nào cho tiêu đề bản tin?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Ví dụ: vai trò: copywriter email của một nhà sách; khán giả: hội viên đã mua trong năm qua; mục tiêu: vào trang sale 11.11; dữ kiện: giảm 20–50%, 11–13/11, miễn phí vận chuyển đơn từ 300.000 VND; giọng: thân thiện, ngắn gọn; định dạng: tiêu đề ≤ 45 ký tự + thân 80 từ + một chữ trên nút; ràng buộc: không tuyên bố gì ngoài dữ kiện. 2) Mô hình và người duyệt thấy chính xác tuyên bố nào được phép; việc kiểm trở nên máy móc, dễ làm. 3) Dùng brief sinh 10 tiêu đề, con người chọn 2 phương án mạnh và khác nhau, A/B test trên 20% danh sách ngẫu nhiên, gửi phương án thắng cho phần còn lại.</p></div>`);

const l9_3 = L('aba201c-ts-9-3',
  '9.3 — The limits of generative AI: hallucination, bias, copyright, privacy and disclosure|||9.3 — Giới hạn của AI tạo sinh: bịa thông tin, thiên lệch, bản quyền, quyền riêng tư và công bố',
  'Ảo giác (hallucination) và cách kiểm dữ kiện, code dò số liệu không có trong bảng dữ kiện, thiên lệch và khuôn mẫu, bản quyền và quyền sở hữu, không dán dữ liệu cá nhân vào công cụ AI, công bố nội dung do AI tạo (Điều 50 Đạo luật AI của EU), deepfake và nguồn gốc nội dung (C2PA).',
  `<span class="eyebrow">ABA201c · Chapter 9 · Lesson 9.3</span>
<h2>The limits of generative AI</h2>
<p class="lead">A single invented statistic in a press release, a stereotyped image in an ad, or a customer list pasted into a chatbot can cost a brand more than all the time AI ever saved. Responsible use means knowing the failure modes and building checks around them.</p>
<h3>🎯 Objectives</h3>
<ul><li>Recognise hallucinations and set up a fact-checking step.</li><li>Identify bias, copyright and privacy risks in AI-assisted content.</li><li>Know when and how to disclose AI-generated or manipulated content.</li></ul>
<h3>📖 Lecture</h3>
<h3>1. Hallucination</h3>
<p>An AI <strong>hallucination</strong> is output that is fluent and confident but false or unsupported — an invented quote, a fake study, a wrong price. It follows directly from lesson 9.1: the model generates plausible text. Mitigations: supply the facts in the prompt, ask the model to cite which supplied fact supports each claim, keep temperature low for factual tasks, and <strong>always</strong> check numbers, names, dates and quotations against the source before publishing.</p>
<h3>✍️ Worked example — a first automatic check</h3>
<p>A simple script extracts every number from a draft and flags those that are not in the approved fact sheet. It does not replace a human, but it catches the most dangerous errors fast.</p>
<pre><code class="language-python">import re

fact_sheet = {"29.000đ", "20%", "10/11", "16/11"}      # numbers we are allowed to use
draft = ("Cà phê muối Mộc chỉ 25.000đ! Giảm 20% cả tháng 11 cho sinh viên. "
         "Đã có hơn 10.000 khách yêu thích. Ghé quán từ 10/11 đến 16/11 nhé!")

for claim in re.findall(r"\\d+(?:[./]\\d+)*(?:đ|%)?", draft):
    status = "OK  (in fact sheet)" if claim in fact_sheet else "CHECK - not in fact sheet"
    print(f"{claim:9s} -&gt; {status}")
</code></pre>
<div class="out">25.000đ   -&gt; CHECK - not in fact sheet
20%       -&gt; OK  (in fact sheet)
11        -&gt; CHECK - not in fact sheet
10.000    -&gt; CHECK - not in fact sheet
10/11     -&gt; OK  (in fact sheet)
16/11     -&gt; OK  (in fact sheet)</div>
<p>Three problems surface immediately: the price is wrong (25.000đ instead of 29.000đ), "cả tháng 11" (the whole of November) contradicts the real discount window of 10–16/11, and "hơn 10.000 khách" is an invented claim. The approved numbers pass.</p>
<h3>2. Bias and stereotypes</h3>
<p>Models learn from human-produced data and can reproduce its stereotypes: who is shown as a "CEO", which skin tone appears in "beauty" images, which dialect is called "standard". Review generated text and images for representation, and test prompts with different demographic descriptions to see whether outputs change unfairly (Chapter 12).</p>
<h3>3. Copyright and ownership</h3>
<p>Legal questions about training data and ownership of AI outputs are still open in many countries (the U.S. Copyright Office keeps a resource page on the topic). Practical rules: avoid "in the style of [living artist]" for commercial work, do not upload others' copyrighted material, check the tool's commercial-use terms, and keep records of how key assets were made.</p>
<h3>4. Privacy and confidentiality</h3>
<p>Text you paste into an AI service may be stored or processed outside your organisation. Never paste customer personal data, unreleased campaign plans or contracts into tools that your organisation has not approved. Vietnam's 2025 Personal Data Protection Law requires consent and lawful processing for personal data (Chapter 12).</p>
<h3>5. Disclosure, deepfakes and provenance</h3>
<p>Article 50 of the EU AI Act, for example, requires that people be told when they are interacting with an AI system, that AI-generated audio, images, video and text be marked in a machine-readable way, and that deployers disclose deepfakes. Even where such rules do not apply, a clear label ("image created with AI") protects trust. Industry standards such as <strong>C2PA</strong> attach verifiable provenance information to media files.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Publishing AI-written statistics or quotes without a source.</li><li>Using AI faces or voices that resemble real people without consent.</li><li>Uploading customer lists to "clean them up".</li><li>Hiding AI use when the audience would reasonably expect to know.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Hallucinations are built-in: supply facts, check every number and quote.</li><li>Review for bias and stereotypes in text and images.</li><li>Respect copyright and tool terms; keep records.</li><li>Keep personal and confidential data out of unapproved tools; disclose AI and deepfakes.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.ibm.com/think/topics/ai-hallucinations" target="_blank" rel="noopener">IBM — What are AI hallucinations?</a></li><li><a href="https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence" target="_blank" rel="noopener">NIST — AI Risk Management Framework: Generative AI Profile</a></li><li><a href="https://artificialintelligenceact.eu/article/50/" target="_blank" rel="noopener">EU AI Act — Article 50: transparency obligations</a></li><li><a href="https://www.copyright.gov/ai/" target="_blank" rel="noopener">U.S. Copyright Office — Copyright and artificial intelligence</a></li><li><a href="https://c2pa.org/" target="_blank" rel="noopener">C2PA — Content provenance standard</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>An AI draft says "According to a 2024 Nielsen study, 87% of students prefer iced coffee." What do you do?</li><li>List three things you must never paste into an unapproved public AI tool.</li><li>Your campaign uses an AI-generated "customer testimonial" video with a synthetic person. What is the risk and what should you do?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Treat it as unverified: search for the original study; if you cannot open it, delete the claim. Never publish a statistic you have not seen at its source. 2) e.g. customer names/phones/emails, unreleased campaign or financial plans, contracts or partner data. 3) It is deceptive: viewers believe a real customer is speaking (and it may break advertising and consumer-protection rules). Use real, consenting customers, or clearly label it as a dramatisation created with AI.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 9 · Bài 9.3</span>
<h2>Giới hạn của AI tạo sinh</h2>
<p class="lead">Chỉ một con số bịa trong thông cáo báo chí, một hình ảnh rập khuôn trong quảng cáo, hay một danh sách khách hàng bị dán vào chatbot cũng có thể khiến thương hiệu mất nhiều hơn toàn bộ thời gian AI từng tiết kiệm. Dùng có trách nhiệm nghĩa là biết các kiểu thất bại và dựng lớp kiểm tra quanh chúng.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận ra ảo giác (hallucination) và lập bước kiểm dữ kiện.</li><li>Nhận diện rủi ro thiên lệch, bản quyền và quyền riêng tư trong nội dung có AI hỗ trợ.</li><li>Biết khi nào và cách công bố nội dung do AI tạo hoặc chỉnh sửa.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>1. Ảo giác</h3>
<p><strong>Ảo giác của AI</strong> là đầu ra trôi chảy, tự tin nhưng sai hoặc không có căn cứ — một câu trích bịa, một nghiên cứu không tồn tại, một mức giá sai. Nó đến thẳng từ bài 9.1: mô hình sinh văn bản nghe hợp lý. Cách giảm: cung cấp dữ kiện trong prompt, yêu cầu mô hình chỉ ra dữ kiện nào đỡ cho mỗi tuyên bố, giữ nhiệt độ thấp cho việc cần chính xác, và <strong>luôn luôn</strong> kiểm số, tên, ngày và câu trích với nguồn trước khi đăng.</p>
<h3>✍️ Ví dụ — một vòng kiểm tự động đầu tiên</h3>
<p>Một đoạn script đơn giản rút mọi con số trong bản nháp và đánh dấu những số không có trong bảng dữ kiện đã duyệt. Nó không thay được con người, nhưng bắt nhanh các lỗi nguy hiểm nhất.</p>
<pre><code class="language-python">import re

fact_sheet = {"29.000đ", "20%", "10/11", "16/11"}      # numbers we are allowed to use
draft = ("Cà phê muối Mộc chỉ 25.000đ! Giảm 20% cả tháng 11 cho sinh viên. "
         "Đã có hơn 10.000 khách yêu thích. Ghé quán từ 10/11 đến 16/11 nhé!")

for claim in re.findall(r"\\d+(?:[./]\\d+)*(?:đ|%)?", draft):
    status = "OK  (in fact sheet)" if claim in fact_sheet else "CHECK - not in fact sheet"
    print(f"{claim:9s} -&gt; {status}")
</code></pre>
<div class="out">25.000đ   -&gt; CHECK - not in fact sheet
20%       -&gt; OK  (in fact sheet)
11        -&gt; CHECK - not in fact sheet
10.000    -&gt; CHECK - not in fact sheet
10/11     -&gt; OK  (in fact sheet)
16/11     -&gt; OK  (in fact sheet)</div>
<p>Ba vấn đề hiện ra ngay: giá sai (25.000đ thay vì 29.000đ), "cả tháng 11" mâu thuẫn với khung giảm giá thật 10–16/11, và "hơn 10.000 khách" là tuyên bố bịa. Các con số đã duyệt thì qua.</p>
<h3>2. Thiên lệch và khuôn mẫu</h3>
<p>Mô hình học từ dữ liệu do con người tạo ra và có thể tái tạo khuôn mẫu trong đó: ai được vẽ thành "CEO", màu da nào xuất hiện trong ảnh "làm đẹp", phương ngữ nào bị gọi là "chuẩn". Hãy soát văn bản và hình ảnh được sinh ra về tính đại diện, và thử prompt với các mô tả nhân khẩu khác nhau xem đầu ra có thay đổi bất công không (Chương 12).</p>
<h3>3. Bản quyền và quyền sở hữu</h3>
<p>Câu hỏi pháp lý về dữ liệu huấn luyện và quyền sở hữu đầu ra của AI vẫn còn bỏ ngỏ ở nhiều nước (Cục Bản quyền Hoa Kỳ có trang tài nguyên riêng về chủ đề này). Quy tắc thực tế: tránh "theo phong cách [họa sĩ còn sống]" cho sản phẩm thương mại, không tải lên tác phẩm có bản quyền của người khác, kiểm điều khoản dùng thương mại của công cụ, và lưu hồ sơ cách tạo các tài sản quan trọng.</p>
<h3>4. Quyền riêng tư và bảo mật</h3>
<p>Văn bản bạn dán vào dịch vụ AI có thể được lưu hoặc xử lý bên ngoài tổ chức. Không bao giờ dán dữ liệu cá nhân của khách hàng, kế hoạch chiến dịch chưa công bố hay hợp đồng vào công cụ mà tổ chức chưa phê duyệt. Luật Bảo vệ dữ liệu cá nhân 2025 của Việt Nam đòi hỏi sự đồng ý và xử lý hợp pháp đối với dữ liệu cá nhân (Chương 12).</p>
<h3>5. Công bố, deepfake và nguồn gốc nội dung</h3>
<p>Ví dụ, Điều 50 Đạo luật AI của EU yêu cầu người dùng được biết khi họ tương tác với hệ thống AI, âm thanh, hình ảnh, video và văn bản do AI tạo phải được đánh dấu theo cách máy đọc được, và bên triển khai phải công bố deepfake. Kể cả nơi quy định như vậy không áp dụng, một nhãn rõ ràng ("ảnh tạo bằng AI") vẫn bảo vệ lòng tin. Các tiêu chuẩn ngành như <strong>C2PA</strong> gắn thông tin nguồn gốc kiểm chứng được vào file media.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đăng số liệu hay câu trích do AI viết mà không có nguồn.</li><li>Dùng gương mặt hay giọng nói AI giống người thật mà không có sự đồng ý.</li><li>Tải danh sách khách hàng lên để "làm sạch giúp".</li><li>Giấu việc dùng AI khi khán giả có lý do chính đáng để được biết.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Ảo giác là bản chất: hãy cung cấp dữ kiện, kiểm mọi con số và câu trích.</li><li>Soát thiên lệch, khuôn mẫu trong văn bản và hình ảnh.</li><li>Tôn trọng bản quyền và điều khoản công cụ; lưu hồ sơ.</li><li>Giữ dữ liệu cá nhân, dữ liệu mật ngoài công cụ chưa duyệt; công bố AI và deepfake.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.ibm.com/think/topics/ai-hallucinations" target="_blank" rel="noopener">IBM — Ảo giác của AI là gì?</a></li><li><a href="https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence" target="_blank" rel="noopener">NIST — Khung quản trị rủi ro AI: hồ sơ AI tạo sinh</a></li><li><a href="https://artificialintelligenceact.eu/article/50/" target="_blank" rel="noopener">Đạo luật AI của EU — Điều 50: nghĩa vụ minh bạch</a></li><li><a href="https://www.copyright.gov/ai/" target="_blank" rel="noopener">Cục Bản quyền Hoa Kỳ — Bản quyền và trí tuệ nhân tạo</a></li><li><a href="https://c2pa.org/" target="_blank" rel="noopener">C2PA — Tiêu chuẩn nguồn gốc nội dung</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Bản nháp AI viết "Theo một nghiên cứu của Nielsen năm 2024, 87% sinh viên thích cà phê đá." Bạn làm gì?</li><li>Kể ba thứ bạn không bao giờ dán vào công cụ AI công cộng chưa được duyệt.</li><li>Chiến dịch dùng video "lời chứng thực của khách" do AI tạo với một người tổng hợp. Rủi ro là gì và nên làm gì?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Coi đó là chưa kiểm chứng: tìm nghiên cứu gốc; nếu không mở được thì xoá tuyên bố. Không bao giờ đăng một số liệu bạn chưa thấy tận nguồn. 2) Ví dụ tên/số điện thoại/email khách hàng, kế hoạch chiến dịch hay tài chính chưa công bố, hợp đồng hoặc dữ liệu đối tác. 3) Đó là lừa dối: người xem tin một khách thật đang nói (và có thể vi phạm quy định quảng cáo, bảo vệ người tiêu dùng). Hãy dùng khách thật có đồng ý, hoặc ghi rõ đây là phần dựng minh hoạ tạo bằng AI.</p></div>`);

const q9 = QZ(9, 'Chapter 9 quiz — Generative AI for content|||Quiz Chương 9 — AI tạo sinh cho nội dung', '10 câu ôn LLM, token, nhiệt độ, cấu trúc prompt, quy trình duyệt, ảo giác, kiểm dữ kiện, quyền riêng tư, bản quyền và công bố nội dung AI.', [
  Q('q1', 'At its core, a large language model is trained to|||Về cốt lõi, mô hình ngôn ngữ lớn được huấn luyện để',
    ['look up facts in a database|||tra sự thật trong cơ sở dữ liệu', 'predict the next token from the previous ones|||dự đoán token tiếp theo từ các token trước', 'copy whole articles from the web|||chép nguyên bài viết trên web', 'understand meaning like a human|||hiểu nghĩa như con người'], 1,
    'Generation repeats next-token prediction; later tuning helps it follow instructions.|||Việc sinh văn bản là lặp lại dự đoán token tiếp theo; tinh chỉnh sau giúp nó làm theo chỉ dẫn.'),
  Q('q2', 'For writing product specifications from a fact sheet, temperature should be|||Khi viết thông số sản phẩm từ bảng dữ kiện, nhiệt độ nên',
    ['low|||thấp', 'high|||cao', 'as high as possible|||cao nhất có thể', 'irrelevant|||không liên quan'], 0,
    'Low temperature keeps output close to the most likely, source-based continuation.|||Nhiệt độ thấp giữ đầu ra gần phần tiếp theo khả dĩ nhất, bám nguồn.'),
  Q('q3', 'The toy model produced "cà phê sữa trân". This illustrates that|||Mô hình đồ chơi sinh ra "cà phê sữa trân". Điều này minh hoạ rằng',
    ['the model was trained badly on purpose|||mô hình được cố tình huấn luyện kém', 'models generate plausible sequences without understanding meaning|||mô hình sinh chuỗi nghe hợp lý mà không hiểu nghĩa', 'temperature was zero|||nhiệt độ bằng 0', 'Vietnamese cannot be modelled|||tiếng Việt không mô hình hoá được'], 1,
    'It glued common word pairs from different phrases.|||Nó dán các cặp từ phổ biến từ những cụm khác nhau.'),
  Q('q4', 'Which element best reduces invented prices in AI-written captions?|||Thành phần nào giảm tốt nhất việc AI bịa giá trong caption?',
    ['A longer role description|||Mô tả vai trò dài hơn', 'A clearly marked block of approved facts plus "do not invent numbers"|||Một khối dữ kiện đã duyệt đánh dấu rõ cùng câu "không bịa số"', 'Higher temperature|||Nhiệt độ cao hơn', 'More emojis|||Thêm emoji'], 1,
    'Supplying facts and forbidding invention narrows what the model may claim.|||Cung cấp dữ kiện và cấm bịa thu hẹp điều mô hình được phép tuyên bố.'),
  Q('q5', 'In the recommended workflow, who is accountable for a published AI-assisted post?|||Trong quy trình đề xuất, ai chịu trách nhiệm cho bài đăng có AI hỗ trợ?',
    ['The AI vendor|||Nhà cung cấp AI', 'The model|||Mô hình', 'The human who approved it|||Con người đã duyệt nó', 'No one|||Không ai'], 2,
    'Accountability stays human.|||Trách nhiệm vẫn thuộc về con người.'),
  Q('q6', 'A fluent, confident but false statement produced by an AI is called|||Một tuyên bố trôi chảy, tự tin nhưng sai do AI tạo ra gọi là',
    ['a token|||một token', 'a hallucination|||một ảo giác (hallucination)', 'a prompt|||một prompt', 'overfitting|||quá khớp'], 1,
    'Hallucinations follow from generating plausible text.|||Ảo giác bắt nguồn từ việc sinh văn bản nghe hợp lý.'),
  Q('q7', 'An AI draft cites a statistic from a study you cannot find. You should|||Bản nháp AI trích số liệu từ một nghiên cứu bạn không tìm được. Bạn nên',
    ['publish it with "according to research"|||đăng kèm "theo nghiên cứu"', 'round the number|||làm tròn con số', 'remove it unless you can open and verify the original source|||xoá nó trừ khi mở và kiểm được nguồn gốc', 'ask the AI if it is sure|||hỏi AI xem nó có chắc không'], 2,
    'Never publish a statistic you have not seen at its source.|||Không bao giờ đăng số liệu bạn chưa thấy tận nguồn.'),
  Q('q8', 'Which is safe to paste into an unapproved public AI tool?|||Thứ nào an toàn để dán vào công cụ AI công cộng chưa duyệt?',
    ['The customer list with phone numbers|||Danh sách khách kèm số điện thoại', 'The unreleased Tết campaign budget|||Ngân sách chiến dịch Tết chưa công bố', 'A public product description to rewrite in a friendlier tone|||Mô tả sản phẩm đã công khai để viết lại giọng thân thiện hơn', 'A partner contract|||Hợp đồng với đối tác'], 2,
    'Only public, non-personal information is low-risk.|||Chỉ thông tin công khai, không mang tính cá nhân mới ít rủi ro.'),
  Q('q9', 'According to Article 50 of the EU AI Act, deployers of deepfakes must|||Theo Điều 50 Đạo luật AI của EU, bên triển khai deepfake phải',
    ['delete them after a day|||xoá chúng sau một ngày', 'disclose that the content is artificially generated or manipulated|||công bố rằng nội dung được tạo hoặc chỉnh sửa nhân tạo', 'pay a fee|||trả một khoản phí', 'use only black-and-white images|||chỉ dùng ảnh đen trắng'], 1,
    'Article 50 sets transparency obligations, including deepfake disclosure.|||Điều 50 đặt ra nghĩa vụ minh bạch, gồm công bố deepfake.'),
  Q('q10', 'C2PA is|||C2PA là',
    ['a sentiment lexicon|||một từ điển cảm xúc', 'a standard for attaching verifiable provenance information to media|||tiêu chuẩn gắn thông tin nguồn gốc kiểm chứng được vào media', 'a prompt template|||một mẫu prompt', 'a privacy law|||một đạo luật quyền riêng tư'], 1,
    'It helps audiences and platforms verify where content came from.|||Nó giúp khán giả và nền tảng kiểm chứng nội dung đến từ đâu.'),
]);

const ch9 = {
  title: 'Chapter 9 — Generative AI for content and its limits|||Chương 9 — AI tạo sinh cho nội dung và giới hạn của nó',
  description: 'Mô hình ngôn ngữ lớn hoạt động thế nào ở mức trực giác (token, dự đoán từ tiếp theo, nhiệt độ), dùng AI tạo sinh trong quy trình sáng tạo nội dung (brief → prompt → bản nháp → con người duyệt), và giới hạn: bịa thông tin, thiên lệch, bản quyền, dữ liệu cá nhân, công bố nội dung AI, deepfake.',
  lessons: [l9_1, l9_2, l9_3, q9],
};

const l10_1 = L('aba201c-ts-10-1',
  '10.1 — Levels of personalisation and a popularity baseline|||10.1 — Các cấp độ cá nhân hoá và mốc nền theo độ phổ biến',
  'Từ thông điệp đại trà tới cá nhân hoá 1:1 và next-best-action; ba họ hệ gợi ý (phổ biến, cộng tác, nội dung); code gợi ý bài viết phổ biến nhất trong phân khúc, bỏ bài đã đọc.',
  `<span class="eyebrow">ABA201c · Chapter 10 · Lesson 10.1</span>
<h2>Levels of personalisation</h2>
<p class="lead">"Because you watched…", "Customers also bought…", a newsletter whose products change for every reader — personalisation is now an everyday expectation. It ranges from simple rules a marketer writes to models that score every item for every person.</p>
<h3>🎯 Objectives</h3>
<ul><li>Describe four levels of personalisation and when each is enough.</li><li>Name the three families of recommender systems.</li><li>Build a segment-level popularity recommender as a baseline.</li></ul>
<h3>📖 Lecture</h3>
<h3>Four levels</h3>
<div class="kv-grid">
<div class="kv"><span class="k">1. Mass</span><span class="v">Everyone gets the same message. Cheap; fine for broad awareness.</span></div>
<div class="kv"><span class="k">2. Rule-based</span><span class="v">"If the customer bought a laptop, show laptop bags." Transparent, easy to control, hard to scale beyond dozens of rules.</span></div>
<div class="kv"><span class="k">3. Segment-based</span><span class="v">Each segment (Chapter 6) gets its own content. Good balance of relevance and effort.</span></div>
<div class="kv"><span class="k">4. One-to-one</span><span class="v">A model ranks items for each person (recommendations, next-best-action). Most relevant; needs data, engineering and careful evaluation.</span></div>
</div>
<p><strong>Next-best-action</strong> extends recommendations beyond products: for each customer, choose the most useful next step — a tutorial, a service reminder, a survey, or <em>no message at all</em> — balancing business value and customer fatigue.</p>
<h3>Three families of recommenders</h3>
<ul>
<li><strong>Popularity-based</strong>: recommend what is popular (overall or in a segment). Surprisingly strong baseline, works for new users, but identical for everyone in a group.</li>
<li><strong>Collaborative filtering</strong>: "people who liked what you liked also liked…" — learns from patterns of behaviour across users (lesson 10.2).</li>
<li><strong>Content-based filtering</strong>: recommend items similar in content (text, category, attributes) to what the person engaged with (lesson 10.3).</li>
</ul>
<p>Production systems usually combine them (<em>hybrid</em>) and add business rules: hide out-of-stock items, respect age limits, avoid recommending what was just bought.</p>
<h3>✍️ Worked example — popular in your segment</h3>
<p>A student-lifestyle blog has two audience segments. We recommend the most-read articles in the reader's own segment, skipping what they have already read.</p>
<pre><code class="language-python">import pandas as pd

views = pd.DataFrame({
    "user":    ["u1", "u1", "u2", "u2", "u3", "u3", "u4", "u4", "u5", "u6", "u6"],
    "segment": ["student", "student", "student", "student", "office", "office",
                "office", "office", "student", "office", "office"],
    "article": ["deal-tra-sua", "review-laptop", "deal-tra-sua", "meo-hoc-bai",
                "review-laptop", "cafe-lam-viec", "cafe-lam-viec", "review-laptop",
                "meo-hoc-bai", "cafe-lam-viec", "deal-tra-sua"],
})
print("global top-2:", views.article.value_counts().head(2).index.tolist())
top_by_seg = (views.groupby("segment").article.value_counts()
              .groupby(level=0).head(2))
print(top_by_seg)

def recommend(user, k=2):
    seg = views.loc[views.user == user, "segment"].iloc[0]
    seen = set(views.loc[views.user == user, "article"])
    ranked = views[views.segment == seg].article.value_counts().index
    return [a for a in ranked if a not in seen][:k]
print("for u5:", recommend("u5"), "| for u3:", recommend("u3"))
</code></pre>
<div class="out">global top-2: ['deal-tra-sua', 'review-laptop']
segment  article      
office   cafe-lam-viec    3
         review-laptop    2
student  deal-tra-sua     2
         meo-hoc-bai      2
Name: count, dtype: int64
for u5: ['deal-tra-sua', 'review-laptop'] | for u3: ['deal-tra-sua']</div>
<p><strong>Reading the output.</strong> Globally the tea-deal article and the laptop review are most read. Inside segments the picture differs: office readers favour "cafe-lam-viec" (cafés for working), students favour deals and study tips. Reader u5 (student, already read study tips) gets the tea deal and the laptop review; u3 (office) has read the two office favourites, so only one new article remains. A baseline like this is the benchmark any fancier model must beat — if it cannot, the complexity is not worth it.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Jumping to 1:1 models without a baseline to compare against.</li><li>Recommending what the customer already bought (a new phone right after buying a phone).</li><li>Personalising on sensitive attributes or inferences (health, finances) without consent.</li><li>Measuring personalisation success by clicks only, ignoring long-term satisfaction and unsubscribes.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Mass → rule-based → segment-based → one-to-one.</li><li>Recommenders: popularity, collaborative, content-based — often hybrid.</li><li>Always build a popularity baseline first.</li><li>Add business rules and respect privacy limits.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://developers.google.com/machine-learning/recommendation" target="_blank" rel="noopener">Google — Recommendation systems course (introduction)</a></li><li><a href="https://www.ibm.com/think/topics/recommendation-engine" target="_blank" rel="noopener">IBM — What is a recommendation engine?</a></li><li><a href="https://research.netflix.com/research-area/recommendations" target="_blank" rel="noopener">Netflix Research — Recommendations</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Classify the level: (a) "Happy birthday" email with the name and a voucher, (b) every subscriber gets the same Tết card, (c) app home screen ranked differently for each user.</li><li>Why is a popularity recommender good for brand-new visitors?</li><li>Write one business rule you would add to any product recommender.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (a) rule-based (triggered by a date field), (b) mass, (c) one-to-one. 2) We know nothing about them yet (cold start), and popular items are a reasonable guess. 3) e.g. "never recommend items that are out of stock or already purchased in the last 30 days".</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 10 · Bài 10.1</span>
<h2>Các cấp độ cá nhân hoá</h2>
<p class="lead">"Vì bạn đã xem…", "Khách cũng mua…", một bản tin mà sản phẩm thay đổi theo từng người đọc — cá nhân hoá giờ là kỳ vọng thường ngày. Nó trải từ những quy tắc đơn giản do marketer viết tới các mô hình chấm điểm mọi sản phẩm cho mọi người.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mô tả bốn cấp độ cá nhân hoá và khi nào mỗi cấp là đủ.</li><li>Kể tên ba họ hệ gợi ý.</li><li>Xây hệ gợi ý theo độ phổ biến trong phân khúc làm mốc nền.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Bốn cấp độ</h3>
<div class="kv-grid">
<div class="kv"><span class="k">1. Đại trà</span><span class="v">Ai cũng nhận cùng một thông điệp. Rẻ; ổn cho nhận biết rộng.</span></div>
<div class="kv"><span class="k">2. Theo quy tắc</span><span class="v">"Nếu khách mua laptop, hiện túi laptop." Minh bạch, dễ kiểm soát, khó mở rộng quá vài chục quy tắc.</span></div>
<div class="kv"><span class="k">3. Theo phân khúc</span><span class="v">Mỗi phân khúc (Chương 6) có nội dung riêng. Cân bằng tốt giữa độ phù hợp và công sức.</span></div>
<div class="kv"><span class="k">4. Từng cá nhân (1:1)</span><span class="v">Mô hình xếp hạng sản phẩm cho từng người (gợi ý, next-best-action). Phù hợp nhất; cần dữ liệu, kỹ thuật và đánh giá cẩn thận.</span></div>
</div>
<p><strong>Next-best-action</strong> (hành động tốt nhất tiếp theo) mở rộng gợi ý ra ngoài sản phẩm: với mỗi khách, chọn bước tiếp theo hữu ích nhất — một bài hướng dẫn, nhắc lịch bảo dưỡng, một khảo sát, hoặc <em>không gửi gì cả</em> — cân bằng giữa giá trị kinh doanh và sự mệt mỏi của khách.</p>
<h3>Ba họ hệ gợi ý</h3>
<ul>
<li><strong>Theo độ phổ biến</strong>: gợi ý thứ đang phổ biến (toàn bộ hoặc trong phân khúc). Mốc nền mạnh đáng ngạc nhiên, dùng được cho người mới, nhưng ai trong nhóm cũng như nhau.</li>
<li><strong>Lọc cộng tác (collaborative filtering)</strong>: "người thích những gì bạn thích cũng thích…" — học từ mẫu hành vi giữa nhiều người dùng (bài 10.2).</li>
<li><strong>Lọc theo nội dung (content-based)</strong>: gợi ý thứ có nội dung (văn bản, danh mục, thuộc tính) giống những gì người đó đã tương tác (bài 10.3).</li>
</ul>
<p>Hệ thống thật thường kết hợp chúng (<em>lai — hybrid</em>) và thêm quy tắc kinh doanh: ẩn hàng hết, tôn trọng giới hạn tuổi, tránh gợi ý thứ vừa mua.</p>
<h3>✍️ Ví dụ — phổ biến trong phân khúc của bạn</h3>
<p>Một blog phong cách sống sinh viên có hai phân khúc độc giả. Ta gợi ý các bài được đọc nhiều nhất trong phân khúc của chính người đọc, bỏ qua bài họ đã đọc.</p>
<pre><code class="language-python">import pandas as pd

views = pd.DataFrame({
    "user":    ["u1", "u1", "u2", "u2", "u3", "u3", "u4", "u4", "u5", "u6", "u6"],
    "segment": ["student", "student", "student", "student", "office", "office",
                "office", "office", "student", "office", "office"],
    "article": ["deal-tra-sua", "review-laptop", "deal-tra-sua", "meo-hoc-bai",
                "review-laptop", "cafe-lam-viec", "cafe-lam-viec", "review-laptop",
                "meo-hoc-bai", "cafe-lam-viec", "deal-tra-sua"],
})
print("global top-2:", views.article.value_counts().head(2).index.tolist())
top_by_seg = (views.groupby("segment").article.value_counts()
              .groupby(level=0).head(2))
print(top_by_seg)

def recommend(user, k=2):
    seg = views.loc[views.user == user, "segment"].iloc[0]
    seen = set(views.loc[views.user == user, "article"])
    ranked = views[views.segment == seg].article.value_counts().index
    return [a for a in ranked if a not in seen][:k]
print("for u5:", recommend("u5"), "| for u3:", recommend("u3"))
</code></pre>
<div class="out">global top-2: ['deal-tra-sua', 'review-laptop']
segment  article      
office   cafe-lam-viec    3
         review-laptop    2
student  deal-tra-sua     2
         meo-hoc-bai      2
Name: count, dtype: int64
for u5: ['deal-tra-sua', 'review-laptop'] | for u3: ['deal-tra-sua']</div>
<p><strong>Đọc kết quả.</strong> Trên toàn bộ, bài deal trà sữa và bài review laptop được đọc nhiều nhất. Trong từng phân khúc, bức tranh khác đi: dân văn phòng thích "cafe-lam-viec" (quán cà phê làm việc), sinh viên thích deal và mẹo học. Người đọc u5 (sinh viên, đã đọc mẹo học bài) nhận bài deal trà sữa và review laptop; u3 (văn phòng) đã đọc hai bài văn phòng yêu thích, nên chỉ còn một bài mới. Mốc nền như thế này là chuẩn mà mọi mô hình cầu kỳ hơn phải vượt — nếu không vượt được, sự phức tạp không đáng.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Nhảy thẳng tới mô hình 1:1 mà không có mốc nền để so sánh.</li><li>Gợi ý thứ khách vừa mua (điện thoại mới ngay sau khi mua điện thoại).</li><li>Cá nhân hoá dựa trên thuộc tính hay suy luận nhạy cảm (sức khoẻ, tài chính) khi chưa có đồng ý.</li><li>Đo thành công của cá nhân hoá chỉ bằng click, bỏ qua mức hài lòng dài hạn và lượt huỷ đăng ký.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Đại trà → theo quy tắc → theo phân khúc → 1:1.</li><li>Hệ gợi ý: phổ biến, cộng tác, theo nội dung — thường kết hợp.</li><li>Luôn xây mốc nền theo độ phổ biến trước.</li><li>Thêm quy tắc kinh doanh và tôn trọng giới hạn quyền riêng tư.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://developers.google.com/machine-learning/recommendation" target="_blank" rel="noopener">Google — Khoá học hệ gợi ý (nhập môn)</a></li><li><a href="https://www.ibm.com/think/topics/recommendation-engine" target="_blank" rel="noopener">IBM — Recommendation engine là gì?</a></li><li><a href="https://research.netflix.com/research-area/recommendations" target="_blank" rel="noopener">Netflix Research — Recommendations</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Xếp cấp độ: (a) email "Chúc mừng sinh nhật" có tên và voucher, (b) mọi người đăng ký nhận cùng một thiệp Tết, (c) màn hình chính của app được xếp khác nhau cho từng người.</li><li>Vì sao gợi ý theo độ phổ biến tốt cho khách hoàn toàn mới?</li><li>Viết một quy tắc kinh doanh bạn sẽ thêm vào bất kỳ hệ gợi ý sản phẩm nào.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (a) theo quy tắc (kích hoạt bởi trường ngày sinh), (b) đại trà, (c) 1:1. 2) Ta chưa biết gì về họ (khởi đầu lạnh), và sản phẩm phổ biến là phỏng đoán hợp lý. 3) Ví dụ "không bao giờ gợi ý sản phẩm hết hàng hoặc đã mua trong 30 ngày qua".</p></div>`);

const l10_2 = L('aba201c-ts-10-2',
  '10.2 — Collaborative filtering: "people who liked this also liked…"|||10.2 — Lọc cộng tác: "người thích món này cũng thích…"',
  'Ma trận người dùng × sản phẩm, độ tương đồng item–item bằng cosine, chấm điểm gợi ý từ những gì người dùng đã thích, ví dụ sáu khách và năm sản phẩm bằng scikit-learn, giới hạn (dữ liệu thưa, khởi đầu lạnh, thiên vị sản phẩm phổ biến).',
  `<span class="eyebrow">ABA201c · Chapter 10 · Lesson 10.2</span>
<h2>Collaborative filtering</h2>
<p class="lead">Collaborative filtering needs no knowledge about what a product <em>is</em>. It only looks at who interacted with what, and finds items that tend to attract the same people. That is how a sunscreen can lead to a cleanser even if the system has never read either label.</p>
<h3>🎯 Objectives</h3>
<ul><li>Represent behaviour as a user × item matrix.</li><li>Compute item–item similarity with cosine similarity.</li><li>Score and rank recommendations for a user, and know the method's limits.</li></ul>
<h3>📖 Lecture</h3>
<h3>The user × item matrix</h3>
<p>Rows are users, columns are items; a cell holds an interaction: a click (1/0), a purchase count, a rating, watch time. Real matrices are <strong>sparse</strong>: each user touches a tiny share of the catalogue, so most cells are empty.</p>
<h3>Item–item similarity</h3>
<p>Treat each item's column as a vector of who interacted with it. Two items are similar if largely the same users engaged with both — measured with <strong>cosine similarity</strong> (lesson 5.3). Google's recommendation course describes collaborative filtering as using similarities between users and items simultaneously to provide recommendations.</p>
<h3>Scoring for one user</h3>
<ol>
<li>Take the items the user already liked.</li>
<li>For every other item, add up its similarity to those liked items.</li>
<li>Remove items already seen; recommend the highest scores.</li>
</ol>
<p>Item–item methods are popular in retail because item similarities change slowly and can be pre-computed. Larger systems use <strong>matrix factorisation</strong> or neural models that learn a compact embedding for every user and item — the same idea of "nearby in a learned space" from Chapter 5.</p>
<h3>✍️ Worked example — six shoppers, five products</h3>
<pre><code class="language-python">import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

# 1 = user clicked the product; rows = users, columns = products
R = pd.DataFrame(
    [[1, 1, 0, 0, 1],
     [1, 1, 1, 0, 0],
     [0, 1, 1, 0, 0],
     [0, 0, 0, 1, 1],
     [0, 0, 1, 1, 1],
     [1, 0, 0, 0, 1]],
    index=["Lan", "Minh", "Hoa", "Tuấn", "Vy", "Khoa"],
    columns=["son_li", "kem_chong_nang", "sua_rua_mat", "tai_nghe", "sac_du_phong"])

item_sim = pd.DataFrame(cosine_similarity(R.T), index=R.columns, columns=R.columns).round(2)
print(item_sim)

def recommend(user, k=2):
    liked = R.loc[user]
    scores = item_sim[liked[liked == 1].index].sum(axis=1)   # similarity to what they liked
    scores = scores[liked == 0]                                # drop items already clicked
    return scores.sort_values(ascending=False).head(k).round(2).to_dict()
print("Hoa -&gt;", recommend("Hoa"))
print("Tuấn -&gt;", recommend("Tuấn"))
</code></pre>
<div class="out">                son_li  kem_chong_nang  sua_rua_mat  tai_nghe  sac_du_phong
son_li            1.00            0.67         0.33      0.00          0.58
kem_chong_nang    0.67            1.00         0.67      0.00          0.29
sua_rua_mat       0.33            0.67         1.00      0.41          0.29
tai_nghe          0.00            0.00         0.41      1.00          0.71
sac_du_phong      0.58            0.29         0.29      0.71          1.00
Hoa -&gt; {'son_li': 1.0, 'sac_du_phong': 0.58}
Tuấn -&gt; {'sua_rua_mat': 0.7, 'son_li': 0.58}</div>
<p><strong>Reading the output.</strong> The similarity table shows two "neighbourhoods": skincare (lipstick, sunscreen, cleanser are similar to each other) and electronics (headphones and power bank, 0.71). The power bank is also fairly similar to lipstick (0.58) because Lan and Khoa bought both — the system knows nothing about products, only about shared customers. Hoa (sunscreen + cleanser) is recommended lipstick first (score 1.0), then the power bank. Tuấn (headphones + power bank) gets cleanser (0.70) and lipstick — through Vy, who bought electronics <em>and</em> cleanser. With six users such links are fragile; with thousands they become reliable patterns.</p>
<h3>Limits</h3>
<ul>
<li><strong>Cold start</strong>: a new product with no interactions has no similarities; a new user has nothing to compare.</li>
<li><strong>Popularity bias</strong>: very popular items are similar to everything and crowd out niche items.</li>
<li><strong>Sparsity and noise</strong>: accidental clicks and gifts ("bought a toy for my nephew") create odd links.</li>
<li><strong>Explainability</strong>: "people like you also bought" is a weak explanation when the link is strange.</li>
</ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Treating "not clicked" as "disliked" — the user may never have seen the item.</li><li>Letting best-sellers dominate every list; add diversity or downweight popularity.</li><li>Ignoring time: last week's clicks predict better than last year's.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Behaviour → sparse user × item matrix.</li><li>Item–item cosine similarity: items liked by the same people are close.</li><li>Score = sum of similarities to the user's liked items, minus already seen.</li><li>Watch cold start, popularity bias and noisy signals.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://developers.google.com/machine-learning/recommendation/collaborative/basics" target="_blank" rel="noopener">Google — Collaborative filtering basics</a></li><li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.cosine_similarity.html" target="_blank" rel="noopener">scikit-learn — cosine_similarity</a></li><li><a href="https://cloud.google.com/use-cases/recommendations" target="_blank" rel="noopener">Google Cloud — Recommendations AI (a managed recommender)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>In the table, which two products are most similar and why?</li><li>A new lipstick shade launches today. Can item–item collaborative filtering recommend it? What can you do?</li><li>Why could "bought as a gift" purchases harm recommendations?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Headphones and power bank (0.71): both headphone buyers (Tuấn and Vy) also bought the power bank. (Lipstick–sunscreen and sunscreen–cleanser are 0.67.) 2) No — it has no interactions yet (cold start). Use content-based similarity (same category, colour family), a rule ("show new launches to lipstick buyers") or a popularity slot for new items. 3) They link items that the buyer does not personally want, so similar users get irrelevant suggestions; allow customers to mark gifts and exclude them.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 10 · Bài 10.2</span>
<h2>Lọc cộng tác</h2>
<p class="lead">Lọc cộng tác không cần biết sản phẩm <em>là gì</em>. Nó chỉ nhìn ai đã tương tác với cái gì, và tìm những món hay thu hút cùng một nhóm người. Đó là cách kem chống nắng dẫn tới sữa rửa mặt, dù hệ thống chưa từng đọc nhãn của món nào.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Biểu diễn hành vi thành ma trận người dùng × sản phẩm.</li><li>Tính độ tương đồng item–item bằng cosine.</li><li>Chấm điểm, xếp hạng gợi ý cho một người và biết giới hạn của phương pháp.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Ma trận người dùng × sản phẩm</h3>
<p>Hàng là người dùng, cột là sản phẩm; mỗi ô chứa một tương tác: click (1/0), số lần mua, điểm đánh giá, thời gian xem. Ma trận thật rất <strong>thưa</strong>: mỗi người chỉ chạm một phần nhỏ xíu của danh mục, nên phần lớn ô bị trống.</p>
<h3>Độ tương đồng item–item</h3>
<p>Coi cột của mỗi sản phẩm là một vector cho biết ai đã tương tác với nó. Hai sản phẩm giống nhau nếu phần lớn cùng những người đã tương tác với cả hai — đo bằng <strong>độ tương đồng cosine</strong> (bài 5.3). Khoá học hệ gợi ý của Google mô tả lọc cộng tác là dùng đồng thời sự tương đồng giữa người dùng và giữa sản phẩm để đưa ra gợi ý.</p>
<h3>Chấm điểm cho một người</h3>
<ol>
<li>Lấy các sản phẩm người dùng đã thích.</li>
<li>Với mỗi sản phẩm khác, cộng độ tương đồng của nó với những sản phẩm đã thích.</li>
<li>Bỏ các sản phẩm đã xem; gợi ý những điểm cao nhất.</li>
</ol>
<p>Phương pháp item–item phổ biến trong bán lẻ vì độ tương đồng giữa sản phẩm thay đổi chậm và tính trước được. Hệ thống lớn hơn dùng <strong>phân rã ma trận</strong> hoặc mô hình nơ-ron học một embedding gọn cho mỗi người dùng và sản phẩm — đúng ý tưởng "gần nhau trong không gian đã học" ở Chương 5.</p>
<h3>✍️ Ví dụ — sáu người mua, năm sản phẩm</h3>
<pre><code class="language-python">import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

# 1 = user clicked the product; rows = users, columns = products
R = pd.DataFrame(
    [[1, 1, 0, 0, 1],
     [1, 1, 1, 0, 0],
     [0, 1, 1, 0, 0],
     [0, 0, 0, 1, 1],
     [0, 0, 1, 1, 1],
     [1, 0, 0, 0, 1]],
    index=["Lan", "Minh", "Hoa", "Tuấn", "Vy", "Khoa"],
    columns=["son_li", "kem_chong_nang", "sua_rua_mat", "tai_nghe", "sac_du_phong"])

item_sim = pd.DataFrame(cosine_similarity(R.T), index=R.columns, columns=R.columns).round(2)
print(item_sim)

def recommend(user, k=2):
    liked = R.loc[user]
    scores = item_sim[liked[liked == 1].index].sum(axis=1)   # similarity to what they liked
    scores = scores[liked == 0]                                # drop items already clicked
    return scores.sort_values(ascending=False).head(k).round(2).to_dict()
print("Hoa -&gt;", recommend("Hoa"))
print("Tuấn -&gt;", recommend("Tuấn"))
</code></pre>
<div class="out">                son_li  kem_chong_nang  sua_rua_mat  tai_nghe  sac_du_phong
son_li            1.00            0.67         0.33      0.00          0.58
kem_chong_nang    0.67            1.00         0.67      0.00          0.29
sua_rua_mat       0.33            0.67         1.00      0.41          0.29
tai_nghe          0.00            0.00         0.41      1.00          0.71
sac_du_phong      0.58            0.29         0.29      0.71          1.00
Hoa -&gt; {'son_li': 1.0, 'sac_du_phong': 0.58}
Tuấn -&gt; {'sua_rua_mat': 0.7, 'son_li': 0.58}</div>
<p><strong>Đọc kết quả.</strong> Bảng tương đồng cho thấy hai "khu phố": chăm sóc da (son, kem chống nắng, sữa rửa mặt giống nhau) và đồ điện tử (tai nghe và sạc dự phòng, 0,71). Sạc dự phòng cũng khá giống son (0,58) vì Lan và Khoa mua cả hai — hệ thống không biết gì về sản phẩm, chỉ biết về khách hàng chung. Hoa (kem chống nắng + sữa rửa mặt) được gợi ý son trước (điểm 1,0), rồi sạc dự phòng. Tuấn (tai nghe + sạc dự phòng) nhận sữa rửa mặt (0,70) và son — qua Vy, người mua đồ điện tử <em>và</em> sữa rửa mặt. Với sáu người, những liên kết như vậy rất mong manh; với hàng nghìn người, chúng thành mẫu hình đáng tin.</p>
<h3>Giới hạn</h3>
<ul>
<li><strong>Khởi đầu lạnh</strong>: sản phẩm mới chưa có tương tác thì không có độ tương đồng; người dùng mới chẳng có gì để so.</li>
<li><strong>Thiên vị sản phẩm phổ biến</strong>: món rất phổ biến giống với mọi thứ và lấn át món ngách.</li>
<li><strong>Dữ liệu thưa và nhiễu</strong>: click nhầm và mua quà ("mua đồ chơi cho cháu") tạo liên kết kỳ quặc.</li>
<li><strong>Khả năng giải thích</strong>: "người giống bạn cũng mua" là lời giải thích yếu khi liên kết lạ lùng.</li>
</ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Coi "không click" là "không thích" — có thể người dùng chưa từng thấy món đó.</li><li>Để hàng bán chạy chiếm mọi danh sách; hãy thêm độ đa dạng hoặc giảm trọng số độ phổ biến.</li><li>Bỏ qua thời gian: click tuần trước dự đoán tốt hơn click năm ngoái.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Hành vi → ma trận người dùng × sản phẩm thưa.</li><li>Cosine item–item: món được cùng người thích thì gần nhau.</li><li>Điểm = tổng độ tương đồng với các món người dùng đã thích, trừ món đã xem.</li><li>Cẩn thận khởi đầu lạnh, thiên vị phổ biến và tín hiệu nhiễu.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://developers.google.com/machine-learning/recommendation/collaborative/basics" target="_blank" rel="noopener">Google — Cơ bản về lọc cộng tác</a></li><li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.cosine_similarity.html" target="_blank" rel="noopener">scikit-learn — cosine_similarity</a></li><li><a href="https://cloud.google.com/use-cases/recommendations" target="_blank" rel="noopener">Google Cloud — Recommendations AI (hệ gợi ý dạng dịch vụ)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Trong bảng, hai sản phẩm nào giống nhau nhất và vì sao?</li><li>Một màu son mới ra mắt hôm nay. Lọc cộng tác item–item có gợi ý được nó không? Bạn làm gì?</li><li>Vì sao các lượt "mua làm quà" có thể làm hỏng gợi ý?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Tai nghe và sạc dự phòng (0,71): cả hai người mua tai nghe (Tuấn và Vy) đều mua sạc dự phòng. (Son–kem chống nắng và kem chống nắng–sữa rửa mặt là 0,67.) 2) Không — nó chưa có tương tác nào (khởi đầu lạnh). Dùng tương đồng theo nội dung (cùng danh mục, cùng tông màu), một quy tắc ("hiện hàng mới cho người từng mua son") hoặc một vị trí dành cho hàng mới. 3) Chúng nối những món mà người mua không thực sự muốn cho bản thân, nên người giống họ nhận gợi ý lạc đề; hãy cho khách đánh dấu quà tặng và loại chúng ra.</p></div>`);

const l10_3 = L('aba201c-ts-10-3',
  '10.3 — Content-based recommendations, evaluation and the ethics of personalisation|||10.3 — Gợi ý theo nội dung, đánh giá và đạo đức của cá nhân hoá',
  'Gợi ý bài viết tương tự bằng TF-IDF, đánh giá offline bằng precision@k và online bằng A/B test, khởi đầu lạnh, bong bóng lọc và đa dạng, ranh giới "đáng sợ", minh bạch và quyền từ chối của người dùng.',
  `<span class="eyebrow">ABA201c · Chapter 10 · Lesson 10.3</span>
<h2>Content-based recommendations, evaluation and ethics</h2>
<p class="lead">If you just read an article about cheap laptops for students, another laptop review is a good bet — no other users needed. Content-based methods recommend by similarity of the items themselves. Then we ask the important questions: does it work, and is it fair to the user?</p>
<h3>🎯 Objectives</h3>
<ul><li>Build a content-based recommender with TF-IDF.</li><li>Evaluate recommendations offline (precision@k) and online (A/B).</li><li>Discuss filter bubbles, "creepy" personalisation and user control.</li></ul>
<h3>📖 Lecture</h3>
<h3>Content-based filtering</h3>
<p>Describe each item by its features — text (title, description), category, brand, price band, tags — and recommend items whose features are close to what the user engaged with. Google's recommendation course notes that content-based filtering uses item features to recommend items similar to what the user likes. It solves the new-item cold start (a new article has text from day one) but tends to recommend "more of the same".</p>
<h3>✍️ Worked example — similar articles and precision@2</h3>
<pre><code class="language-python">from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

articles = {
    "A1": "mẹo chọn laptop cho sinh viên giá rẻ",
    "A2": "review laptop mỏng nhẹ pin lâu cho sinh viên",
    "A3": "công thức trà sữa trân châu tại nhà",
    "A4": "quán trà sữa mới mở gần trường",
    "A5": "so sánh tai nghe chống ồn giá rẻ",
    "A6": "cách học tiếng anh hiệu quả cho sinh viên",
}
ids = list(articles)
vec = TfidfVectorizer()
S = cosine_similarity(vec.fit_transform(articles.values()))

def similar(aid, k=2):
    i = ids.index(aid)
    order = S[i].argsort()[::-1]
    return [ids[j] for j in order if j != i][:k]

print("read A1 -&gt;", similar("A1"), "| read A3 -&gt;", similar("A3"))

# offline evaluation: precision@2 against what the user actually clicked next
truth = {"A1": {"A2", "A5"}, "A3": {"A4"}, "A6": {"A1"}}
for a, clicked in truth.items():
    rec = similar(a)
    print(a, "rec", rec, "clicked", sorted(clicked), "precision@2 =", len(set(rec) &amp; clicked) / 2)
</code></pre>
<div class="out">read A1 -&gt; ['A2', 'A6'] | read A3 -&gt; ['A4', 'A6']
A1 rec ['A2', 'A6'] clicked ['A2', 'A5'] precision@2 = 0.5
A3 rec ['A4', 'A6'] clicked ['A4'] precision@2 = 0.5
A6 rec ['A1', 'A2'] clicked ['A1'] precision@2 = 0.5</div>
<p><strong>Reading the output.</strong> After A1 (cheap laptops for students), the system recommends A2 (another laptop review) — sensible — and A6 (studying English) because both mention "sinh viên". Shared words are not shared interests. After A3 (milk-tea recipe) it correctly suggests A4 (new milk-tea shop). To evaluate offline we compare the top-2 recommendations with what users actually clicked next: <strong>precision@2</strong> = share of the 2 recommendations that were clicked. All three cases score 0.5. In real projects you compute this over thousands of sessions — and then confirm with an <strong>online A/B test</strong> (Chapter 8), because offline history only contains what the old system chose to show.</p>
<h3>What to measure</h3>
<ul>
<li><strong>Relevance</strong>: click-through on recommendations, precision@k, conversion.</li>
<li><strong>Coverage and diversity</strong>: what share of the catalogue ever gets recommended; how varied each list is.</li>
<li><strong>Long-term value</strong>: retention, satisfaction, unsubscribe rate — not just today's click.</li>
</ul>
<h3>The ethics of personalisation</h3>
<ul>
<li><strong>Filter bubbles</strong>: always showing "more of the same" narrows what people see. For news and public information this can distort opinion; add diversity and editorial picks.</li>
<li><strong>The creepy line</strong>: recommendations that reveal sensitive inferences (pregnancy, health, debt) feel invasive even if technically accurate. Do not infer or use sensitive categories without explicit consent.</li>
<li><strong>Transparency and control</strong>: explain "why am I seeing this?", let users remove items from their history and turn personalisation off. Vietnam's 2025 Personal Data Protection Law, as summarised by its official introduction document, requires that behavioural or personalised advertising collect tracking data only with consent and give people a way to refuse (Chapter 12).</li>
</ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Judging a recommender only offline, on data the old system shaped.</li><li>Optimising clicks until lists are full of clickbait.</li><li>Using purchase history to infer sensitive traits.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Content-based: recommend items with similar features; good for new items, risk of sameness.</li><li>Evaluate offline (precision@k) and confirm online (A/B).</li><li>Measure relevance, diversity and long-term value.</li><li>Avoid sensitive inferences; give users explanation and control.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://developers.google.com/machine-learning/recommendation/content-based/basics" target="_blank" rel="noopener">Google — Content-based filtering basics</a></li><li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html" target="_blank" rel="noopener">scikit-learn — TfidfVectorizer</a></li><li><a href="https://pair.withgoogle.com/guidebook/" target="_blank" rel="noopener">Google PAIR — People + AI Guidebook (explainability and user control)</a></li><li><a href="https://www.tgu.edu.vn/upload/files/Tailieu-gioithieu-LuatBaovedulieucanhan.pdf" target="_blank" rel="noopener">Tài liệu giới thiệu Luật Bảo vệ dữ liệu cá nhân 2025 (PDF, Vietnamese)</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Why did A1 lead to A6, and how could you reduce such mismatches?</li><li>A recommender has precision@5 = 0.20. Explain in words.</li><li>Write a "Why am I seeing this?" explanation for a recommended sunscreen.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Both contain "sinh viên" (student); TF-IDF matched a shared audience word, not a shared topic. Use categories/tags, remove generic audience words, or use embeddings. 2) On average, 1 of the 5 recommended items was clicked. 3) e.g. "Recommended because you bought a facial cleanser from the same skincare line last month. You can change this in Settings → Recommendations."</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 10 · Bài 10.3</span>
<h2>Gợi ý theo nội dung, đánh giá và đạo đức</h2>
<p class="lead">Nếu bạn vừa đọc bài về laptop giá rẻ cho sinh viên, thêm một bài review laptop là phỏng đoán tốt — không cần người dùng nào khác. Phương pháp theo nội dung gợi ý dựa trên sự giống nhau của chính các món. Rồi ta đặt các câu hỏi quan trọng: nó có hiệu quả không, và có công bằng với người dùng không?</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Xây hệ gợi ý theo nội dung bằng TF-IDF.</li><li>Đánh giá gợi ý offline (precision@k) và online (A/B).</li><li>Bàn về bong bóng lọc, cá nhân hoá "đáng sợ" và quyền kiểm soát của người dùng.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Lọc theo nội dung</h3>
<p>Mô tả mỗi món bằng đặc trưng — văn bản (tiêu đề, mô tả), danh mục, thương hiệu, khoảng giá, thẻ — và gợi ý những món có đặc trưng gần với thứ người dùng đã tương tác. Khoá học hệ gợi ý của Google nêu rằng lọc theo nội dung dùng đặc trưng của sản phẩm để gợi ý những món giống thứ người dùng thích. Nó giải quyết khởi đầu lạnh cho món mới (bài viết mới có văn bản ngay từ ngày đầu) nhưng hay gợi ý "toàn những thứ na ná".</p>
<h3>✍️ Ví dụ — bài viết tương tự và precision@2</h3>
<pre><code class="language-python">from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

articles = {
    "A1": "mẹo chọn laptop cho sinh viên giá rẻ",
    "A2": "review laptop mỏng nhẹ pin lâu cho sinh viên",
    "A3": "công thức trà sữa trân châu tại nhà",
    "A4": "quán trà sữa mới mở gần trường",
    "A5": "so sánh tai nghe chống ồn giá rẻ",
    "A6": "cách học tiếng anh hiệu quả cho sinh viên",
}
ids = list(articles)
vec = TfidfVectorizer()
S = cosine_similarity(vec.fit_transform(articles.values()))

def similar(aid, k=2):
    i = ids.index(aid)
    order = S[i].argsort()[::-1]
    return [ids[j] for j in order if j != i][:k]

print("read A1 -&gt;", similar("A1"), "| read A3 -&gt;", similar("A3"))

# offline evaluation: precision@2 against what the user actually clicked next
truth = {"A1": {"A2", "A5"}, "A3": {"A4"}, "A6": {"A1"}}
for a, clicked in truth.items():
    rec = similar(a)
    print(a, "rec", rec, "clicked", sorted(clicked), "precision@2 =", len(set(rec) &amp; clicked) / 2)
</code></pre>
<div class="out">read A1 -&gt; ['A2', 'A6'] | read A3 -&gt; ['A4', 'A6']
A1 rec ['A2', 'A6'] clicked ['A2', 'A5'] precision@2 = 0.5
A3 rec ['A4', 'A6'] clicked ['A4'] precision@2 = 0.5
A6 rec ['A1', 'A2'] clicked ['A1'] precision@2 = 0.5</div>
<p><strong>Đọc kết quả.</strong> Sau A1 (laptop giá rẻ cho sinh viên), hệ thống gợi ý A2 (một bài review laptop khác) — hợp lý — và A6 (học tiếng Anh) vì cả hai đều có chữ "sinh viên". Chung từ không có nghĩa là chung sở thích. Sau A3 (công thức trà sữa) nó gợi ý đúng A4 (quán trà sữa mới). Để đánh giá offline, ta so 2 gợi ý đầu với thứ người dùng thật sự click tiếp theo: <strong>precision@2</strong> = tỷ lệ trong 2 gợi ý được click. Cả ba trường hợp đều đạt 0,5. Dự án thật tính chỉ số này trên hàng nghìn phiên — rồi xác nhận bằng <strong>A/B test online</strong> (Chương 8), vì lịch sử offline chỉ chứa những gì hệ thống cũ chọn để hiển thị.</p>
<h3>Đo cái gì</h3>
<ul>
<li><strong>Độ phù hợp</strong>: tỷ lệ click vào gợi ý, precision@k, chuyển đổi.</li>
<li><strong>Độ phủ và đa dạng</strong>: bao nhiêu phần danh mục từng được gợi ý; mỗi danh sách đa dạng cỡ nào.</li>
<li><strong>Giá trị dài hạn</strong>: giữ chân, mức hài lòng, tỷ lệ huỷ đăng ký — không chỉ click hôm nay.</li>
</ul>
<h3>Đạo đức của cá nhân hoá</h3>
<ul>
<li><strong>Bong bóng lọc</strong>: lúc nào cũng hiện "thêm thứ na ná" làm hẹp những gì người ta thấy. Với tin tức và thông tin công cộng, điều này có thể bóp méo nhận thức; hãy thêm đa dạng và lựa chọn của biên tập viên.</li>
<li><strong>Ranh giới "đáng sợ"</strong>: gợi ý để lộ suy luận nhạy cảm (mang thai, sức khoẻ, nợ nần) gây cảm giác xâm phạm dù đúng về kỹ thuật. Không suy luận hay dùng nhóm dữ liệu nhạy cảm khi chưa có đồng ý rõ ràng.</li>
<li><strong>Minh bạch và quyền kiểm soát</strong>: giải thích "vì sao tôi thấy điều này?", cho người dùng xoá món khỏi lịch sử và tắt cá nhân hoá. Theo tài liệu giới thiệu chính thức, Luật Bảo vệ dữ liệu cá nhân 2025 của Việt Nam yêu cầu quảng cáo theo hành vi hoặc cá nhân hoá chỉ được thu thập dữ liệu theo dõi khi có đồng ý và phải cho phép người dùng từ chối (Chương 12).</li>
</ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đánh giá hệ gợi ý chỉ offline, trên dữ liệu do hệ thống cũ định hình.</li><li>Tối ưu click tới mức danh sách đầy tin giật tít.</li><li>Dùng lịch sử mua để suy ra đặc điểm nhạy cảm.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Theo nội dung: gợi ý món có đặc trưng giống; tốt cho món mới, dễ bị na ná.</li><li>Đánh giá offline (precision@k) rồi xác nhận online (A/B).</li><li>Đo độ phù hợp, đa dạng và giá trị dài hạn.</li><li>Tránh suy luận nhạy cảm; cho người dùng lời giải thích và quyền kiểm soát.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://developers.google.com/machine-learning/recommendation/content-based/basics" target="_blank" rel="noopener">Google — Cơ bản về lọc theo nội dung</a></li><li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html" target="_blank" rel="noopener">scikit-learn — TfidfVectorizer</a></li><li><a href="https://pair.withgoogle.com/guidebook/" target="_blank" rel="noopener">Google PAIR — People + AI Guidebook (giải thích và quyền kiểm soát của người dùng)</a></li><li><a href="https://www.tgu.edu.vn/upload/files/Tailieu-gioithieu-LuatBaovedulieucanhan.pdf" target="_blank" rel="noopener">Tài liệu giới thiệu Luật Bảo vệ dữ liệu cá nhân 2025 (PDF)</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Vì sao A1 dẫn tới A6, và làm sao giảm những lần ghép lệch như vậy?</li><li>Một hệ gợi ý có precision@5 = 0,20. Giải thích bằng lời.</li><li>Viết lời giải thích "Vì sao tôi thấy điều này?" cho một kem chống nắng được gợi ý.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Cả hai có chữ "sinh viên"; TF-IDF ghép theo một từ chỉ đối tượng chung chứ không phải chủ đề chung. Dùng danh mục/thẻ, bỏ các từ chỉ đối tượng chung chung, hoặc dùng embedding. 2) Trung bình 1 trong 5 món được gợi ý được click. 3) Ví dụ "Gợi ý vì tháng trước bạn đã mua sữa rửa mặt cùng dòng chăm sóc da. Bạn có thể thay đổi trong Cài đặt → Gợi ý."</p></div>`);

const q10 = QZ(10, 'Chapter 10 quiz — Recommendation and personalisation|||Quiz Chương 10 — Hệ gợi ý và cá nhân hoá', '10 câu ôn cấp độ cá nhân hoá, next-best-action, mốc nền phổ biến, lọc cộng tác, cosine item–item, khởi đầu lạnh, lọc theo nội dung, precision@k, bong bóng lọc và quyền kiểm soát.', [
  Q('q1', 'Showing laptop bags to customers who bought a laptop is|||Hiện túi laptop cho khách đã mua laptop là',
    ['mass personalisation|||cá nhân hoá đại trà', 'rule-based personalisation|||cá nhân hoá theo quy tắc', 'collaborative filtering|||lọc cộng tác', 'a filter bubble|||bong bóng lọc'], 1,
    'A marketer-written if-then rule.|||Một quy tắc nếu–thì do marketer viết.'),
  Q('q2', 'Next-best-action may sometimes decide to|||Next-best-action đôi khi có thể quyết định',
    ['always send a discount|||luôn gửi giảm giá', 'send no message at all|||không gửi thông điệp nào', 'delete the customer|||xoá khách hàng', 'show only best-sellers|||chỉ hiện hàng bán chạy'], 1,
    'Balancing value and fatigue, silence can be the best action.|||Cân bằng giá trị và sự mệt mỏi, im lặng có thể là hành động tốt nhất.'),
  Q('q3', 'Why build a popularity recommender first?|||Vì sao nên xây hệ gợi ý theo độ phổ biến trước?',
    ['It is always the best|||Nó luôn tốt nhất', 'It is a baseline that fancier models must beat|||Nó là mốc nền mà mô hình cầu kỳ hơn phải vượt', 'It needs user embeddings|||Nó cần embedding người dùng', 'It avoids all bias|||Nó tránh mọi thiên lệch'], 1,
    'Without a baseline you cannot tell whether complexity adds value.|||Không có mốc nền thì không biết sự phức tạp có thêm giá trị không.'),
  Q('q4', 'Collaborative filtering recommends items based on|||Lọc cộng tác gợi ý dựa trên',
    ['the product description text|||văn bản mô tả sản phẩm', 'patterns of which users interacted with which items|||mẫu hình người dùng nào tương tác với món nào', 'the price only|||chỉ giá', 'the brand logo|||logo thương hiệu'], 1,
    'It needs no knowledge of item content.|||Nó không cần biết nội dung sản phẩm.'),
  Q('q5', 'Two items have item–item cosine similarity 0. This means|||Hai món có cosine item–item bằng 0. Nghĩa là',
    ['they are identical|||chúng giống hệt', 'no user interacted with both|||không người dùng nào tương tác với cả hai', 'they are both popular|||cả hai đều phổ biến', 'one is new|||một món là hàng mới'], 1,
    'With 0/1 interactions, cosine 0 means no shared users.|||Với tương tác 0/1, cosine 0 nghĩa là không có người dùng chung.'),
  Q('q6', 'A product launched today cannot be recommended by collaborative filtering because of|||Sản phẩm ra mắt hôm nay không được lọc cộng tác gợi ý vì',
    ['overfitting|||quá khớp', 'the cold-start problem|||vấn đề khởi đầu lạnh', 'SRM|||SRM', 'the filter bubble|||bong bóng lọc'], 1,
    'It has no interactions yet; use content-based features or rules.|||Nó chưa có tương tác; hãy dùng đặc trưng nội dung hoặc quy tắc.'),
  Q('q7', 'Treating "not clicked" as "disliked" is risky because|||Coi "không click" là "không thích" là rủi ro vì',
    ['clicks are always accurate|||click luôn chính xác', 'the user may never have seen the item|||người dùng có thể chưa từng thấy món đó', 'cosine needs ratings|||cosine cần điểm đánh giá', 'it is illegal|||nó bất hợp pháp'], 1,
    'Absence of interaction is ambiguous.|||Không tương tác là tín hiệu mơ hồ.'),
  Q('q8', 'precision@3 = 0.67 means|||precision@3 = 0,67 nghĩa là',
    ['on average 2 of the 3 recommendations were relevant|||trung bình 2 trong 3 gợi ý là phù hợp', '67% of users clicked|||67% người dùng đã click', '3 users were tested|||đã thử 3 người dùng', 'recall is 0.67|||recall là 0,67'], 0,
    'Precision@k = relevant items in the top k ÷ k.|||Precision@k = số món phù hợp trong top k ÷ k.'),
  Q('q9', 'Why confirm a recommender with an online A/B test?|||Vì sao phải xác nhận hệ gợi ý bằng A/B test online?',
    ['Offline metrics are illegal|||Chỉ số offline bất hợp pháp', 'Offline history only reflects what the old system showed; only an experiment shows real impact|||Lịch sử offline chỉ phản ánh những gì hệ thống cũ hiển thị; chỉ thử nghiệm mới cho thấy tác động thật', 'A/B tests are cheaper than counting|||A/B test rẻ hơn đếm', 'It removes cold start|||Nó xoá khởi đầu lạnh'], 1,
    'Experiments measure causal impact on behaviour.|||Thử nghiệm đo tác động nhân quả lên hành vi.'),
  Q('q10', 'Which practice best respects users in personalisation?|||Thực hành nào tôn trọng người dùng nhất khi cá nhân hoá?',
    ['Inferring health conditions from purchases to target ads|||Suy ra tình trạng sức khoẻ từ lịch sử mua để nhắm quảng cáo', 'Explaining "why you see this" and letting users turn personalisation off|||Giải thích "vì sao bạn thấy điều này" và cho tắt cá nhân hoá', 'Hiding that recommendations are personalised|||Giấu việc gợi ý được cá nhân hoá', 'Optimising only for clicks|||Chỉ tối ưu click'], 1,
    'Transparency and control build trust and match data-protection expectations.|||Minh bạch và quyền kiểm soát tạo lòng tin và phù hợp yêu cầu bảo vệ dữ liệu.'),
]);

const ch10 = {
  title: 'Chapter 10 — Recommendation and personalisation|||Chương 10 — Hệ gợi ý và cá nhân hoá',
  description: 'Các cấp độ cá nhân hoá (đại trà, theo quy tắc, theo phân khúc, từng cá nhân), gợi ý theo độ phổ biến, lọc cộng tác item–item, lọc theo nội dung bằng TF-IDF, đánh giá offline (precision@k) và online (A/B), khởi đầu lạnh, bong bóng lọc, ranh giới "đáng sợ" của cá nhân hoá.',
  lessons: [l10_1, l10_2, l10_3, q10],
};

const l11_1 = L('aba201c-ts-11-1',
  '11.1 — Designing a dashboard people actually use|||11.1 — Thiết kế dashboard mà người ta thật sự dùng',
  'Ba loại dashboard (chiến lược, vận hành, phân tích), câu hỏi trước biểu đồ sau, thứ bậc KPI, bố cục, chọn đúng loại biểu đồ, định nghĩa và độ mới dữ liệu, công cụ Looker Studio/Power BI, một bản phác dashboard chiến dịch.',
  `<span class="eyebrow">ABA201c · Chapter 11 · Lesson 11.1</span>
<h2>Designing a dashboard people actually use</h2>
<p class="lead">Many dashboards are opened once and forgotten: thirty charts, no clear question, no decision. A useful dashboard is designed backwards — from the person who reads it and the decision they must make.</p>
<h3>🎯 Objectives</h3>
<ul><li>Distinguish strategic, operational and analytical dashboards.</li><li>Organise a dashboard around questions and a KPI hierarchy.</li><li>Choose chart types that fit the comparison you want to show.</li></ul>
<h3>📖 Lecture</h3>
<h3>Three kinds of dashboard</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Strategic</span><span class="v">For directors: a few KPIs against targets, monthly or quarterly trend. "Are we on track?"</span></div>
<div class="kv"><span class="k">Operational</span><span class="v">For the campaign team: daily spend, CPA, pacing, alerts. "What must we fix today?"</span></div>
<div class="kv"><span class="k">Analytical</span><span class="v">For analysts: filters, breakdowns, drill-downs to explore "why?".</span></div>
</div>
<p>Mixing all three in one page satisfies nobody. Start by writing the 3–5 <strong>questions</strong> the reader asks, then pick one view per question.</p>
<h3>Layout and hierarchy</h3>
<ol>
<li><strong>Top row</strong>: headline KPIs as tiles — value, target, change vs previous period (e.g. "Orders 1,240 · target 1,500 · +8% WoW").</li>
<li><strong>Middle</strong>: trend over time for the main KPI, with the target line.</li>
<li><strong>Bottom</strong>: breakdowns that explain the trend — by channel, creative, region, segment.</li>
<li><strong>Footer</strong>: data source, last refresh time, metric definitions ("Order = paid order in CRM; attribution = last click with UTM").</li>
</ol>
<p>People read screens from the top left; put the most important number there.</p>
<h3>Choosing charts</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Change over time</span><span class="v">Line chart (or columns for few periods)</span></div>
<div class="kv"><span class="k">Compare categories</span><span class="v">Horizontal bar chart, sorted</span></div>
<div class="kv"><span class="k">Part of a whole</span><span class="v">Stacked bar or a simple table; pie only for 2–3 slices</span></div>
<div class="kv"><span class="k">Relationship</span><span class="v">Scatter plot (spend vs orders by campaign)</span></div>
<div class="kv"><span class="k">Exact values</span><span class="v">A clean table with conditional highlights</span></div>
</div>
<p>The Financial Times' "Visual Vocabulary" and the "From Data to Viz" site organise chart types by the relationship you want to show — useful references when you are unsure.</p>
<h3>✍️ Worked example — sketch of a launch dashboard</h3>
<div class="callout"><p><strong>Reader:</strong> brand manager, checks every Monday. <strong>Questions:</strong> (1) Are we on track for 1,500 first orders? (2) Which channel delivers orders most efficiently? (3) Is any creative fatiguing? <strong>Views:</strong> KPI tiles (orders, CPA, spend vs budget); weekly orders line with target; bar chart of CPA by channel; table of creatives with CTR trend and a red flag when CTR falls 30% below its first week. <strong>Footer:</strong> "Data: Meta/TikTok/Google Ads + CRM, refreshed daily 06:00."</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Too many charts, no hierarchy, no targets — numbers without "compared with what".</li><li>3D effects, rainbow colours, pies with ten slices.</li><li>No definitions, so two teams read "conversion" differently.</li><li>Hiding data freshness — decisions made on last month's numbers.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Know the reader and the decision; choose strategic, operational or analytical.</li><li>Questions first, then one view per question.</li><li>KPI tiles with targets on top, trend in the middle, breakdowns below, definitions in the footer.</li><li>Pick charts by the comparison: time → line, categories → sorted bars.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://support.google.com/looker-studio" target="_blank" rel="noopener">Looker Studio documentation</a></li><li><a href="https://learn.microsoft.com/en-us/training/powerplatform/power-bi" target="_blank" rel="noopener">Microsoft Learn — Training for Power BI</a></li><li><a href="https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary" target="_blank" rel="noopener">Financial Times — Visual Vocabulary</a></li><li><a href="https://www.data-to-viz.com/" target="_blank" rel="noopener">From Data to Viz — find the graphic you need</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Which chart would you use for (a) daily mentions over 30 days, (b) CPA of 8 KOLs, (c) spend vs orders for 40 campaigns?</li><li>A director asks for "everything in one dashboard". What do you propose instead?</li><li>Write a footer line that would prevent misreading of "ROAS".</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) (a) line chart, (b) sorted horizontal bar chart, (c) scatter plot. 2) A one-page strategic view with 4–5 KPIs against targets, plus links to an operational page for the team and an analytical page for deep dives. 3) e.g. "ROAS = revenue attributed by last-click UTM ÷ media spend (excludes agency fees and VAT); revenue after returns, updated daily."</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 11 · Bài 11.1</span>
<h2>Thiết kế dashboard mà người ta thật sự dùng</h2>
<p class="lead">Nhiều dashboard được mở một lần rồi bị quên: ba mươi biểu đồ, không câu hỏi rõ ràng, không quyết định nào. Một dashboard hữu ích được thiết kế ngược — từ người đọc nó và quyết định họ phải đưa ra.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phân biệt dashboard chiến lược, vận hành và phân tích.</li><li>Tổ chức dashboard quanh các câu hỏi và thứ bậc KPI.</li><li>Chọn loại biểu đồ hợp với phép so sánh muốn thể hiện.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Ba loại dashboard</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Chiến lược</span><span class="v">Cho giám đốc: vài KPI so với chỉ tiêu, xu hướng tháng hoặc quý. "Ta có đi đúng hướng không?"</span></div>
<div class="kv"><span class="k">Vận hành</span><span class="v">Cho đội chiến dịch: chi phí hằng ngày, CPA, tiến độ tiêu ngân sách, cảnh báo. "Hôm nay phải sửa gì?"</span></div>
<div class="kv"><span class="k">Phân tích</span><span class="v">Cho analyst: bộ lọc, phân rã, đào sâu để khám phá "vì sao?".</span></div>
</div>
<p>Trộn cả ba vào một trang thì chẳng ai hài lòng. Hãy bắt đầu bằng việc viết ra 3–5 <strong>câu hỏi</strong> mà người đọc đặt ra, rồi chọn một khung nhìn cho mỗi câu hỏi.</p>
<h3>Bố cục và thứ bậc</h3>
<ol>
<li><strong>Hàng trên cùng</strong>: KPI chính dạng ô — giá trị, chỉ tiêu, thay đổi so với kỳ trước (ví dụ "Đơn 1.240 · chỉ tiêu 1.500 · +8% so tuần trước").</li>
<li><strong>Giữa</strong>: xu hướng theo thời gian của KPI chính, kèm đường chỉ tiêu.</li>
<li><strong>Dưới</strong>: các phân rã giải thích xu hướng — theo kênh, mẫu quảng cáo, vùng, phân khúc.</li>
<li><strong>Chân trang</strong>: nguồn dữ liệu, thời điểm cập nhật gần nhất, định nghĩa chỉ số ("Đơn = đơn đã thanh toán trong CRM; phân bổ = click cuối có UTM").</li>
</ol>
<p>Người ta đọc màn hình từ góc trên bên trái; hãy đặt con số quan trọng nhất ở đó.</p>
<h3>Chọn biểu đồ</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Thay đổi theo thời gian</span><span class="v">Biểu đồ đường (hoặc cột nếu ít kỳ)</span></div>
<div class="kv"><span class="k">So sánh các nhóm</span><span class="v">Biểu đồ thanh ngang, đã sắp xếp</span></div>
<div class="kv"><span class="k">Thành phần của tổng</span><span class="v">Thanh xếp chồng hoặc bảng đơn giản; tròn chỉ khi 2–3 phần</span></div>
<div class="kv"><span class="k">Mối quan hệ</span><span class="v">Biểu đồ phân tán (chi phí và số đơn theo chiến dịch)</span></div>
<div class="kv"><span class="k">Giá trị chính xác</span><span class="v">Bảng gọn kèm tô sáng có điều kiện</span></div>
</div>
<p>"Visual Vocabulary" của Financial Times và trang "From Data to Viz" sắp xếp các loại biểu đồ theo mối quan hệ bạn muốn thể hiện — tài liệu tra cứu hữu ích khi phân vân.</p>
<h3>✍️ Ví dụ — phác thảo dashboard chiến dịch ra mắt</h3>
<div class="callout"><p><strong>Người đọc:</strong> brand manager, xem mỗi sáng thứ Hai. <strong>Câu hỏi:</strong> (1) Ta có kịp 1.500 đơn đầu tiên? (2) Kênh nào mang đơn hiệu quả nhất? (3) Có mẫu quảng cáo nào đang nhàm? <strong>Khung nhìn:</strong> ô KPI (đơn, CPA, chi phí so ngân sách); đường số đơn theo tuần kèm chỉ tiêu; biểu đồ thanh CPA theo kênh; bảng mẫu quảng cáo với xu hướng CTR và cờ đỏ khi CTR thấp hơn tuần đầu 30%. <strong>Chân trang:</strong> "Dữ liệu: Meta/TikTok/Google Ads + CRM, cập nhật 06:00 hằng ngày."</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quá nhiều biểu đồ, không thứ bậc, không chỉ tiêu — con số mà không có "so với cái gì".</li><li>Hiệu ứng 3D, màu cầu vồng, biểu đồ tròn mười miếng.</li><li>Không có định nghĩa, nên hai đội hiểu "chuyển đổi" khác nhau.</li><li>Giấu độ mới của dữ liệu — quyết định dựa trên số tháng trước.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Biết người đọc và quyết định; chọn chiến lược, vận hành hay phân tích.</li><li>Câu hỏi trước, rồi một khung nhìn cho mỗi câu hỏi.</li><li>Ô KPI kèm chỉ tiêu ở trên, xu hướng ở giữa, phân rã ở dưới, định nghĩa ở chân trang.</li><li>Chọn biểu đồ theo phép so sánh: thời gian → đường, nhóm → thanh đã sắp xếp.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://support.google.com/looker-studio" target="_blank" rel="noopener">Tài liệu Looker Studio</a></li><li><a href="https://learn.microsoft.com/en-us/training/powerplatform/power-bi" target="_blank" rel="noopener">Microsoft Learn — Đào tạo Power BI</a></li><li><a href="https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary" target="_blank" rel="noopener">Financial Times — Visual Vocabulary</a></li><li><a href="https://www.data-to-viz.com/" target="_blank" rel="noopener">From Data to Viz — tìm loại biểu đồ bạn cần</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Bạn dùng biểu đồ nào cho (a) lượt nhắc hằng ngày trong 30 ngày, (b) CPA của 8 KOL, (c) chi phí và số đơn của 40 chiến dịch?</li><li>Giám đốc yêu cầu "tất cả trong một dashboard". Bạn đề xuất gì thay thế?</li><li>Viết một dòng chân trang giúp không ai đọc nhầm "ROAS".</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) (a) biểu đồ đường, (b) thanh ngang đã sắp xếp, (c) biểu đồ phân tán. 2) Một trang chiến lược với 4–5 KPI so chỉ tiêu, kèm link tới trang vận hành cho đội và trang phân tích để đào sâu. 3) Ví dụ "ROAS = doanh thu phân bổ theo UTM click cuối ÷ chi phí media (không gồm phí agency và VAT); doanh thu đã trừ hàng trả, cập nhật hằng ngày."</p></div>`);

const l11_2 = L('aba201c-ts-11-2',
  '11.2 — Preparing dashboard data: aggregation, pivots and week-over-week change|||11.2 — Chuẩn bị dữ liệu cho dashboard: tổng hợp, pivot và thay đổi theo tuần',
  'Mức tổng hợp và "tỷ số của tổng", định nghĩa tuần, bảng pivot tuần × kênh bằng pandas, tính CPA và thay đổi so tuần trước, xuất sang Google Sheets/Looker Studio, các lỗi tổng hợp thường gặp.',
  `<span class="eyebrow">ABA201c · Chapter 11 · Lesson 11.2</span>
<h2>Preparing dashboard data</h2>
<p class="lead">Behind every chart is a small summary table. If that table is built wrongly — averaging ratios, mixing week definitions, double-counting — the dashboard will look professional and be wrong. Building it yourself once makes you a much sharper dashboard reader.</p>
<h3>🎯 Objectives</h3>
<ul><li>Choose the right aggregation level and compute ratios correctly.</li><li>Build a week × channel pivot table with pandas.</li><li>Compute CPA and week-over-week change, and export for a BI tool.</li></ul>
<h3>📖 Lecture</h3>
<h3>Sum first, divide later</h3>
<p>Raw data are usually daily rows per channel (or per campaign). Dashboards show weekly or monthly views. The rule: <strong>aggregate the counts (spend, clicks, orders), then compute ratios</strong> (CPA, CTR, ROAS) from the aggregated counts. Averaging daily CPAs gives every day equal weight, even a day with one order (lesson 2.2 showed the same trap for CTR).</p>
<h3>Define time carefully</h3>
<ul>
<li>Which day starts the week? pandas' <code>W-SUN</code> means weeks ending on Sunday (Monday–Sunday), common in Vietnam.</li>
<li>Time zone: ad platforms may report in the account's time zone; your CRM may use UTC. Vietnam is UTC+7, so an order placed at 03:00 Vietnam time is recorded as 20:00 of the <em>previous</em> day in UTC.</li>
<li>Incomplete periods: the current week is partial — label it or exclude it from comparisons.</li>
</ul>
<h3>Pivot tables</h3>
<p>A <strong>pivot table</strong> reshapes long data (one row per day per channel) into a grid (channels × weeks) with an aggregation function. Spreadsheets and BI tools do the same; pandas <code>pivot_table</code> makes it reproducible.</p>
<h3>✍️ Worked example — two weeks, three channels</h3>
<pre><code class="language-python">import pandas as pd

raw = pd.DataFrame({
    "date": pd.to_datetime(["2026-10-05", "2026-10-06", "2026-10-07", "2026-10-12", "2026-10-13",
                            "2026-10-14", "2026-10-05", "2026-10-08", "2026-10-12", "2026-10-15"]),
    "channel": ["Facebook", "Facebook", "TikTok", "Facebook", "TikTok",
                "TikTok", "Email", "TikTok", "Email", "Facebook"],
    "spend":   [3.0, 2.5, 4.0, 3.0, 4.5, 5.0, 0.5, 3.5, 0.5, 2.0],   # million VND
    "orders":  [30, 22, 35, 28, 40, 52, 12, 30, 15, 21],
})
raw["week"] = raw.date.dt.to_period("W-SUN").astype(str)
pv = raw.pivot_table(index="channel", columns="week", values=["spend", "orders"],
                     aggfunc="sum", fill_value=0)
print("spend (million VND):\\n", pv["spend"])
print("\\norders:\\n", pv["orders"])
cpa = (pv["spend"] * 1_000_000 / pv["orders"]).round(0)
print("\\nCPA (VND) by week:\\n", cpa)
w1, w2 = cpa.columns
print("\\nweek-over-week CPA change:\\n", ((cpa[w2] / cpa[w1] - 1) * 100).round(1).astype(str) + "%")
</code></pre>
<div class="out">spend (million VND):
 week      2026-10-05/2026-10-11  2026-10-12/2026-10-18
channel                                               
Email                       0.5                    0.5
Facebook                    5.5                    5.0
TikTok                      7.5                    9.5

orders:
 week      2026-10-05/2026-10-11  2026-10-12/2026-10-18
channel                                               
Email                        12                     15
Facebook                     52                     49
TikTok                       65                     92

CPA (VND) by week:
 week      2026-10-05/2026-10-11  2026-10-12/2026-10-18
channel                                               
Email                   41667.0                33333.0
Facebook               105769.0               102041.0
TikTok                 115385.0               103261.0

week-over-week CPA change:
 channel
Email       -20.0%
Facebook     -3.5%
TikTok      -10.5%
dtype: str</div>
<p><strong>Reading the output.</strong> The pivot sums spend and orders per channel per Monday–Sunday week. CPA is then computed from the sums: TikTok's CPA fell from about 115,000 to 103,000 VND (−10.5%) while its orders grew from 65 to 92; Email has the lowest CPA and improved by 20%, but only 12–15 orders — a small base makes percentages jumpy. A dashboard tile could say: "TikTok scaled +42% orders with CPA −10% — consider shifting budget from Facebook (flat CPA)." That sentence is the reason the table exists.</p>
<h3>From pandas to the dashboard tool</h3>
<p>Save the summary with <code>df.to_csv("weekly_channel.csv")</code> and import it into Google Sheets, which Looker Studio can read; or connect the BI tool directly to the warehouse table. Keep the transformation code in one place so the numbers are identical every week.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Averaging daily ratios instead of dividing sums.</li><li>Comparing a partial current week with a full previous week.</li><li>Percent changes on tiny bases presented without the absolute numbers.</li><li>Different week or time-zone definitions in different tabs.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Sum counts first, compute ratios second.</li><li>Fix the week definition and time zone; flag partial periods.</li><li>Pivot tables reshape long data into dashboard grids.</li><li>Always show absolute numbers next to percentage changes.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://pandas.pydata.org/docs/reference/api/pandas.pivot_table.html" target="_blank" rel="noopener">pandas — pivot_table</a></li><li><a href="https://pandas.pydata.org/docs/user_guide/reshaping.html" target="_blank" rel="noopener">pandas — Reshaping and pivot tables</a></li><li><a href="https://academy.datawrapper.de/" target="_blank" rel="noopener">Datawrapper Academy — preparing data and choosing charts</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Day 1: spend 1,000,000 VND, 10 orders. Day 2: spend 1,000,000 VND, 40 orders. What is the two-day CPA? What does averaging daily CPAs give?</li><li>Why might an order placed at 03:00 on Monday (Vietnam time) appear in the previous week's report?</li><li>Write the pandas line that would add a column "CTR" to a weekly table with columns clicks and impressions.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Correct: 2,000,000 ÷ 50 = 40,000 VND. Average of daily CPAs: (100,000 + 25,000) ÷ 2 = 62,500 VND — wrong. 2) A time-zone mismatch: if the CRM stores UTC, 03:00 Monday in Vietnam (UTC+7) is 20:00 Sunday in UTC, so the order crosses the week boundary. 3) <code>weekly["CTR"] = weekly["clicks"] / weekly["impressions"]</code></p></div>`,
  `<span class="eyebrow">ABA201c · Chương 11 · Bài 11.2</span>
<h2>Chuẩn bị dữ liệu cho dashboard</h2>
<p class="lead">Sau mỗi biểu đồ là một bảng tổng hợp nhỏ. Nếu bảng đó dựng sai — lấy trung bình tỷ số, trộn định nghĩa tuần, đếm trùng — dashboard sẽ trông chuyên nghiệp mà sai. Tự dựng một lần sẽ khiến bạn đọc dashboard sắc sảo hơn hẳn.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Chọn đúng mức tổng hợp và tính tỷ số cho đúng.</li><li>Dựng bảng pivot tuần × kênh bằng pandas.</li><li>Tính CPA và thay đổi so với tuần trước, xuất sang công cụ BI.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Cộng trước, chia sau</h3>
<p>Dữ liệu thô thường là các dòng theo ngày cho mỗi kênh (hoặc mỗi chiến dịch). Dashboard hiển thị theo tuần hoặc tháng. Quy tắc: <strong>tổng hợp các số đếm (chi phí, click, đơn) trước, rồi mới tính tỷ số</strong> (CPA, CTR, ROAS) từ các tổng đó. Lấy trung bình CPA từng ngày khiến mọi ngày có trọng số bằng nhau, kể cả ngày chỉ có một đơn (bài 2.2 đã cho thấy cái bẫy tương tự với CTR).</p>
<h3>Định nghĩa thời gian cẩn thận</h3>
<ul>
<li>Tuần bắt đầu từ ngày nào? <code>W-SUN</code> của pandas nghĩa là tuần kết thúc vào Chủ nhật (thứ Hai–Chủ nhật), phổ biến ở Việt Nam.</li>
<li>Múi giờ: nền tảng quảng cáo có thể báo theo múi giờ tài khoản; CRM có thể dùng UTC. Việt Nam là UTC+7, nên đơn đặt lúc 03:00 giờ Việt Nam được ghi thành 20:00 của ngày <em>hôm trước</em> theo UTC.</li>
<li>Kỳ chưa trọn: tuần hiện tại mới đi được một phần — hãy ghi nhãn hoặc loại khỏi phép so sánh.</li>
</ul>
<h3>Bảng pivot</h3>
<p><strong>Bảng pivot</strong> sắp lại dữ liệu dạng dài (mỗi dòng một ngày một kênh) thành lưới (kênh × tuần) kèm một hàm tổng hợp. Bảng tính và công cụ BI làm y hệt; <code>pivot_table</code> của pandas giúp lặp lại được.</p>
<h3>✍️ Ví dụ — hai tuần, ba kênh</h3>
<pre><code class="language-python">import pandas as pd

raw = pd.DataFrame({
    "date": pd.to_datetime(["2026-10-05", "2026-10-06", "2026-10-07", "2026-10-12", "2026-10-13",
                            "2026-10-14", "2026-10-05", "2026-10-08", "2026-10-12", "2026-10-15"]),
    "channel": ["Facebook", "Facebook", "TikTok", "Facebook", "TikTok",
                "TikTok", "Email", "TikTok", "Email", "Facebook"],
    "spend":   [3.0, 2.5, 4.0, 3.0, 4.5, 5.0, 0.5, 3.5, 0.5, 2.0],   # million VND
    "orders":  [30, 22, 35, 28, 40, 52, 12, 30, 15, 21],
})
raw["week"] = raw.date.dt.to_period("W-SUN").astype(str)
pv = raw.pivot_table(index="channel", columns="week", values=["spend", "orders"],
                     aggfunc="sum", fill_value=0)
print("spend (million VND):\\n", pv["spend"])
print("\\norders:\\n", pv["orders"])
cpa = (pv["spend"] * 1_000_000 / pv["orders"]).round(0)
print("\\nCPA (VND) by week:\\n", cpa)
w1, w2 = cpa.columns
print("\\nweek-over-week CPA change:\\n", ((cpa[w2] / cpa[w1] - 1) * 100).round(1).astype(str) + "%")
</code></pre>
<div class="out">spend (million VND):
 week      2026-10-05/2026-10-11  2026-10-12/2026-10-18
channel                                               
Email                       0.5                    0.5
Facebook                    5.5                    5.0
TikTok                      7.5                    9.5

orders:
 week      2026-10-05/2026-10-11  2026-10-12/2026-10-18
channel                                               
Email                        12                     15
Facebook                     52                     49
TikTok                       65                     92

CPA (VND) by week:
 week      2026-10-05/2026-10-11  2026-10-12/2026-10-18
channel                                               
Email                   41667.0                33333.0
Facebook               105769.0               102041.0
TikTok                 115385.0               103261.0

week-over-week CPA change:
 channel
Email       -20.0%
Facebook     -3.5%
TikTok      -10.5%
dtype: str</div>
<p><strong>Đọc kết quả.</strong> Bảng pivot cộng chi phí và số đơn của mỗi kênh trong từng tuần thứ Hai–Chủ nhật. Sau đó CPA được tính từ các tổng: CPA của TikTok giảm từ khoảng 115.000 xuống 103.000 VND (−10,5%) trong khi số đơn tăng từ 65 lên 92; Email có CPA thấp nhất và cải thiện 20%, nhưng chỉ 12–15 đơn — nền nhỏ khiến phần trăm nhảy mạnh. Một ô trên dashboard có thể viết: "TikTok tăng 42% số đơn với CPA −10% — cân nhắc chuyển ngân sách từ Facebook (CPA đi ngang)." Câu đó chính là lý do bảng này tồn tại.</p>
<h3>Từ pandas sang công cụ dashboard</h3>
<p>Lưu bảng tổng hợp bằng <code>df.to_csv("weekly_channel.csv")</code> rồi nhập vào Google Sheets, nơi Looker Studio đọc được; hoặc nối công cụ BI thẳng vào bảng trong kho dữ liệu. Giữ code biến đổi ở một chỗ để con số giống hệt nhau mỗi tuần.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Lấy trung bình tỷ số theo ngày thay vì chia các tổng.</li><li>So tuần hiện tại chưa trọn với tuần trước đã trọn.</li><li>Phần trăm thay đổi trên nền rất nhỏ mà không kèm số tuyệt đối.</li><li>Mỗi tab một định nghĩa tuần hoặc múi giờ khác nhau.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Cộng số đếm trước, tính tỷ số sau.</li><li>Cố định định nghĩa tuần và múi giờ; đánh dấu kỳ chưa trọn.</li><li>Bảng pivot sắp dữ liệu dạng dài thành lưới cho dashboard.</li><li>Luôn hiện số tuyệt đối cạnh phần trăm thay đổi.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://pandas.pydata.org/docs/reference/api/pandas.pivot_table.html" target="_blank" rel="noopener">pandas — pivot_table</a></li><li><a href="https://pandas.pydata.org/docs/user_guide/reshaping.html" target="_blank" rel="noopener">pandas — Sắp lại dữ liệu và bảng pivot</a></li><li><a href="https://academy.datawrapper.de/" target="_blank" rel="noopener">Datawrapper Academy — chuẩn bị dữ liệu và chọn biểu đồ</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Ngày 1: chi 1.000.000 VND, 10 đơn. Ngày 2: chi 1.000.000 VND, 40 đơn. CPA của hai ngày là bao nhiêu? Lấy trung bình CPA từng ngày thì ra bao nhiêu?</li><li>Vì sao một đơn đặt lúc 03:00 sáng thứ Hai (giờ Việt Nam) có thể rơi vào báo cáo tuần trước?</li><li>Viết dòng pandas thêm cột "CTR" vào bảng tuần có các cột clicks và impressions.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Đúng: 2.000.000 ÷ 50 = 40.000 VND. Trung bình CPA từng ngày: (100.000 + 25.000) ÷ 2 = 62.500 VND — sai. 2) Do lệch múi giờ: nếu CRM lưu theo UTC, 03:00 thứ Hai ở Việt Nam (UTC+7) là 20:00 Chủ nhật theo UTC, nên đơn bị đẩy qua ranh giới tuần. 3) <code>weekly["CTR"] = weekly["clicks"] / weekly["impressions"]</code></p></div>`);

const l11_3 = L('aba201c-ts-11-3',
  '11.3 — Storytelling with data: from chart to decision|||11.3 — Kể chuyện bằng dữ liệu: từ biểu đồ đến quyết định',
  'Sáu bài học của Knaflic (bối cảnh, chọn hình phù hợp, bỏ rác thị giác, dẫn sự chú ý, tư duy thiết kế, kể chuyện), "big idea" một câu, cấu trúc tình huống–vấn đề–giải pháp, tiêu đề biểu đồ nói ra kết luận, nhận diện biểu đồ gây hiểu lầm.',
  `<span class="eyebrow">ABA201c · Chapter 11 · Lesson 11.3</span>
<h2>Storytelling with data</h2>
<p class="lead">Communicators already know how to tell stories. Data storytelling applies the same craft to evidence: one clear message, a structure that leads to it, and visuals that make the point obvious — so the audience decides something.</p>
<h3>🎯 Objectives</h3>
<ul><li>Apply the six lessons of <em>Storytelling with Data</em> to a campaign report.</li><li>Write a one-sentence "big idea" and an action title.</li><li>Recognise misleading charts and avoid making them.</li></ul>
<h3>📖 Lecture</h3>
<h3>Six lessons</h3>
<p>Knaflic's book is organised around six lessons, summarised here in our own words:</p>
<ol>
<li><strong>Understand the context</strong>: who is the audience, what do they need to know or do, what is the mechanism (meeting, email, slide)?</li>
<li><strong>Choose an appropriate visual</strong>: often a simple line or bar chart, or even one big number.</li>
<li><strong>Eliminate clutter</strong>: remove borders, gridlines, legends you can replace with direct labels, decimal places nobody needs.</li>
<li><strong>Focus attention where you want it</strong>: one highlight colour for the important series; everything else grey.</li>
<li><strong>Think like a designer</strong>: alignment, white space, accessible colours and readable font sizes.</li>
<li><strong>Tell a story</strong>: a beginning, a middle and an end, leading to a call to action.</li>
</ol>
<h3>The big idea and action titles</h3>
<p>Before making slides, write your <strong>big idea</strong>: one complete sentence that states your point and what is at stake. "TikTok now delivers first orders 10% cheaper than Facebook; moving 20% of the November budget could add about 150 orders at the same spend." Then give every chart an <strong>action title</strong> that states the conclusion ("TikTok CPA fell for three weeks in a row") instead of a label ("CPA by channel").</p>
<h3>A simple structure</h3>
<ul>
<li><strong>Situation</strong>: what was planned (target 1,500 orders, CPA ≤ 40,000 VND).</li>
<li><strong>Complication</strong>: what the data shows (Facebook CPA stuck above target; creative B fatigued).</li>
<li><strong>Resolution</strong>: what we recommend, what it costs, how we will measure it (shift budget; test new creative; review in 2 weeks).</li>
</ul>
<h3>✍️ Worked example — rewriting a report slide</h3>
<div class="callout"><p><strong>Before:</strong> title "Channel performance October"; a 3D pie of spend by channel; a table of 12 metrics with two decimals; no conclusion.</p><p><strong>After:</strong> title "Shift 20% of Facebook budget to TikTok: same spend, about 150 more first orders". A grey bar chart of CPA by channel with TikTok highlighted and the target line labelled; a note "CPA = media spend ÷ paid first orders (CRM), 6–19 Oct"; one line at the bottom: "Decision needed today: approve the shift for 1–15 November; we will A/B test by region to confirm."</p></div>
<h3>Misleading charts to avoid</h3>
<ul>
<li><strong>Truncated axis</strong> on a bar chart: starting at 90% makes 92% vs 94% look like a huge gap. Bars must start at zero.</li>
<li><strong>Dual axes</strong> that make two unrelated lines appear to move together.</li>
<li><strong>Cherry-picked windows</strong>: showing only the three good weeks.</li>
<li><strong>Area or 3D effects</strong> that distort size; <strong>cumulative charts</strong> that always go up and hide a slowdown.</li>
</ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Presenting the analysis process ("first we cleaned the data…") instead of the conclusion.</li><li>Many messages on one slide — the audience remembers none.</li><li>Colour used for decoration rather than meaning.</li><li>Ending without a clear ask.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Context → visual → declutter → focus → design → story.</li><li>Write the big idea first; use action titles.</li><li>Situation – complication – resolution, ending with a decision.</li><li>Bars start at zero; avoid dual axes and cherry-picking.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.storytellingwithdata.com/" target="_blank" rel="noopener">storytelling with data — blog and resources by Cole Nussbaumer Knaflic</a></li><li><a href="https://academy.datawrapper.de/" target="_blank" rel="noopener">Datawrapper Academy</a></li><li><a href="https://www.kaggle.com/learn/pandas" target="_blank" rel="noopener">Kaggle Learn — Pandas (to prepare the data behind your story)</a></li><li><a href="https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary" target="_blank" rel="noopener">Financial Times — Visual Vocabulary</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Turn this label into an action title: "Email open rate by month".</li><li>Write a big idea for: CTR of creative A fell from 1.8% to 0.9% over three weeks; creative B is stable at 1.5%.</li><li>A bar chart of satisfaction scores has a y-axis from 4.0 to 4.5. What is wrong?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) e.g. "Email open rate recovered to 32% after we cleaned inactive subscribers in August." 2) e.g. "Creative A has fatigued (CTR halved in three weeks); replacing it with B this week should restore about 0.6 points of CTR on half of our impressions." 3) The truncated axis exaggerates small differences; bar charts must start at zero (or use a dot plot if small differences matter).</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 11 · Bài 11.3</span>
<h2>Kể chuyện bằng dữ liệu</h2>
<p class="lead">Người làm truyền thông vốn biết kể chuyện. Kể chuyện bằng dữ liệu áp dụng cùng tay nghề đó cho bằng chứng: một thông điệp rõ ràng, một cấu trúc dẫn tới nó, và hình ảnh làm luận điểm hiển nhiên — để khán giả đưa ra quyết định.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp dụng sáu bài học của <em>Storytelling with Data</em> vào báo cáo chiến dịch.</li><li>Viết "big idea" một câu và tiêu đề hành động.</li><li>Nhận ra biểu đồ gây hiểu lầm và tránh tạo ra chúng.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Sáu bài học</h3>
<p>Sách của Knaflic được tổ chức quanh sáu bài học, tóm lược bằng lời của chúng tôi:</p>
<ol>
<li><strong>Hiểu bối cảnh</strong>: khán giả là ai, họ cần biết hay làm gì, kênh truyền đạt là gì (cuộc họp, email, slide)?</li>
<li><strong>Chọn hình thể hiện phù hợp</strong>: thường là biểu đồ đường hoặc thanh đơn giản, thậm chí chỉ một con số lớn.</li>
<li><strong>Bỏ rác thị giác</strong>: bỏ viền, lưới, chú thích có thể thay bằng nhãn trực tiếp, các chữ số thập phân không ai cần.</li>
<li><strong>Dẫn sự chú ý tới nơi bạn muốn</strong>: một màu nhấn cho chuỗi quan trọng; mọi thứ khác màu xám.</li>
<li><strong>Tư duy như nhà thiết kế</strong>: căn lề, khoảng trắng, màu dễ tiếp cận và cỡ chữ đọc được.</li>
<li><strong>Kể một câu chuyện</strong>: có mở đầu, thân và kết, dẫn tới lời kêu gọi hành động.</li>
</ol>
<h3>Big idea và tiêu đề hành động</h3>
<p>Trước khi làm slide, hãy viết <strong>big idea</strong>: một câu hoàn chỉnh nêu luận điểm và điều đang bị đặt cược. "TikTok giờ mang đơn đầu tiên rẻ hơn Facebook 10%; chuyển 20% ngân sách tháng 11 có thể thêm khoảng 150 đơn với cùng mức chi." Rồi cho mỗi biểu đồ một <strong>tiêu đề hành động</strong> nói ra kết luận ("CPA TikTok giảm ba tuần liên tiếp") thay vì một nhãn ("CPA theo kênh").</p>
<h3>Một cấu trúc đơn giản</h3>
<ul>
<li><strong>Tình huống</strong>: kế hoạch là gì (chỉ tiêu 1.500 đơn, CPA ≤ 40.000 VND).</li>
<li><strong>Vấn đề</strong>: dữ liệu cho thấy gì (CPA Facebook kẹt trên chỉ tiêu; mẫu B bị nhàm).</li>
<li><strong>Giải pháp</strong>: ta đề xuất gì, tốn bao nhiêu, đo thế nào (dời ngân sách; thử creative mới; xem lại sau 2 tuần).</li>
</ul>
<h3>✍️ Ví dụ — viết lại một slide báo cáo</h3>
<div class="callout"><p><strong>Trước:</strong> tiêu đề "Hiệu quả kênh tháng 10"; biểu đồ tròn 3D chi phí theo kênh; bảng 12 chỉ số với hai chữ số thập phân; không có kết luận.</p><p><strong>Sau:</strong> tiêu đề "Chuyển 20% ngân sách Facebook sang TikTok: cùng chi phí, thêm khoảng 150 đơn đầu tiên". Biểu đồ thanh xám CPA theo kênh, TikTok được tô nổi và đường chỉ tiêu có nhãn; ghi chú "CPA = chi phí media ÷ đơn đầu tiên đã thanh toán (CRM), 6–19/10"; một dòng ở cuối: "Cần quyết định hôm nay: duyệt việc chuyển ngân sách cho 1–15/11; chúng tôi sẽ A/B test theo vùng để xác nhận."</p></div>
<h3>Những biểu đồ gây hiểu lầm cần tránh</h3>
<ul>
<li><strong>Trục bị cắt</strong> ở biểu đồ thanh: bắt đầu từ 90% khiến 92% và 94% trông chênh khủng khiếp. Thanh phải bắt đầu từ 0.</li>
<li><strong>Hai trục tung</strong> khiến hai đường không liên quan trông như cùng chuyển động.</li>
<li><strong>Chọn khung thời gian có lợi</strong>: chỉ hiện ba tuần đẹp.</li>
<li><strong>Hiệu ứng diện tích hay 3D</strong> làm méo kích thước; <strong>biểu đồ luỹ kế</strong> lúc nào cũng đi lên và giấu sự chững lại.</li>
</ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Trình bày quá trình phân tích ("đầu tiên tụi mình làm sạch dữ liệu…") thay vì kết luận.</li><li>Quá nhiều thông điệp trên một slide — khán giả chẳng nhớ cái nào.</li><li>Dùng màu để trang trí thay vì để mang nghĩa.</li><li>Kết thúc mà không có đề nghị rõ ràng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Bối cảnh → hình thể hiện → bỏ rác → dẫn chú ý → thiết kế → câu chuyện.</li><li>Viết big idea trước; dùng tiêu đề hành động.</li><li>Tình huống – vấn đề – giải pháp, kết bằng một quyết định.</li><li>Thanh bắt đầu từ 0; tránh hai trục tung và chọn dữ liệu có lợi.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.storytellingwithdata.com/" target="_blank" rel="noopener">storytelling with data — blog và tài nguyên của Cole Nussbaumer Knaflic</a></li><li><a href="https://academy.datawrapper.de/" target="_blank" rel="noopener">Datawrapper Academy</a></li><li><a href="https://www.kaggle.com/learn/pandas" target="_blank" rel="noopener">Kaggle Learn — Pandas (chuẩn bị dữ liệu cho câu chuyện)</a></li><li><a href="https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary" target="_blank" rel="noopener">Financial Times — Visual Vocabulary</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Biến nhãn này thành tiêu đề hành động: "Tỷ lệ mở email theo tháng".</li><li>Viết big idea cho: CTR của mẫu A giảm từ 1,8% xuống 0,9% trong ba tuần; mẫu B ổn định ở 1,5%.</li><li>Một biểu đồ thanh điểm hài lòng có trục tung từ 4,0 đến 4,5. Sai ở đâu?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Ví dụ "Tỷ lệ mở email hồi phục lên 32% sau khi tụi mình dọn người đăng ký không hoạt động hồi tháng 8." 2) Ví dụ "Mẫu A đã nhàm (CTR giảm một nửa trong ba tuần); thay bằng mẫu B ngay tuần này sẽ lấy lại khoảng 0,6 điểm CTR trên một nửa lượt hiển thị." 3) Trục bị cắt phóng đại chênh lệch nhỏ; biểu đồ thanh phải bắt đầu từ 0 (hoặc dùng biểu đồ chấm nếu chênh lệch nhỏ là quan trọng).</p></div>`);

const q11 = QZ(11, 'Chapter 11 quiz — Dashboards and storytelling|||Quiz Chương 11 — Dashboard và kể chuyện bằng dữ liệu', '10 câu ôn loại dashboard, bố cục, chọn biểu đồ, cộng trước chia sau, định nghĩa tuần, big idea, tiêu đề hành động và biểu đồ gây hiểu lầm.', [
  Q('q1', 'A page showing daily spend pacing and CPA alerts for the campaign team is a|||Trang hiển thị tiến độ tiêu ngân sách hằng ngày và cảnh báo CPA cho đội chiến dịch là dashboard',
    ['strategic dashboard|||chiến lược', 'operational dashboard|||vận hành', 'analytical dashboard|||phân tích', 'storytelling slide|||slide kể chuyện'], 1,
    'Operational dashboards answer "what must we fix today?".|||Dashboard vận hành trả lời "hôm nay phải sửa gì?".'),
  Q('q2', 'The best first step in designing a dashboard is to|||Bước đầu tiên tốt nhất khi thiết kế dashboard là',
    ['pick a colour theme|||chọn bộ màu', 'list the reader\'s questions and decisions|||liệt kê câu hỏi và quyết định của người đọc', 'add every available metric|||thêm mọi chỉ số có sẵn', 'choose 3D charts|||chọn biểu đồ 3D'], 1,
    'Design backwards from the decision.|||Thiết kế ngược từ quyết định.'),
  Q('q3', 'To compare the CPA of eight KOLs, the clearest chart is usually|||Để so CPA của tám KOL, biểu đồ rõ nhất thường là',
    ['a pie chart|||biểu đồ tròn', 'a sorted horizontal bar chart|||biểu đồ thanh ngang đã sắp xếp', 'a 3D column chart|||biểu đồ cột 3D', 'a dual-axis line chart|||biểu đồ đường hai trục'], 1,
    'Sorted bars make ranking and comparison immediate.|||Thanh đã sắp xếp cho thấy ngay thứ hạng và so sánh.'),
  Q('q4', 'Day 1: 500,000 VND, 5 orders; day 2: 500,000 VND, 20 orders. Correct two-day CPA =|||Ngày 1: 500.000 VND, 5 đơn; ngày 2: 500.000 VND, 20 đơn. CPA đúng của hai ngày =',
    ['62,500 VND|||62.500 VND', '40,000 VND|||40.000 VND', '25,000 VND|||25.000 VND', '100,000 VND|||100.000 VND'], 1,
    '1,000,000 ÷ 25 = 40,000. Averaging daily CPAs (100,000 and 25,000) wrongly gives 62,500.|||1.000.000 ÷ 25 = 40.000. Trung bình CPA từng ngày (100.000 và 25.000) sai thành 62.500.'),
  Q('q5', 'The footer of a dashboard should contain|||Chân trang dashboard nên có',
    ['the designer\'s name only|||chỉ tên người thiết kế', 'data sources, refresh time and metric definitions|||nguồn dữ liệu, thời điểm cập nhật và định nghĩa chỉ số', 'a motivational quote|||một câu trích truyền cảm hứng', 'raw data|||dữ liệu thô'], 1,
    'Definitions and freshness prevent misreading.|||Định nghĩa và độ mới ngăn việc đọc nhầm.'),
  Q('q6', 'pandas period "W-SUN" groups dates into weeks that|||Kỳ "W-SUN" của pandas gom ngày thành các tuần',
    ['start on Sunday|||bắt đầu từ Chủ nhật', 'end on Sunday (Monday–Sunday)|||kết thúc vào Chủ nhật (thứ Hai–Chủ nhật)', 'have five days|||có năm ngày', 'follow the lunar calendar|||theo âm lịch'], 1,
    'W-SUN = weekly periods anchored on Sunday as the last day.|||W-SUN = kỳ tuần lấy Chủ nhật làm ngày cuối.'),
  Q('q7', 'Which is an action title?|||Đâu là một tiêu đề hành động?',
    ['"Orders by week"|||"Số đơn theo tuần"', '"Q3 data"|||"Dữ liệu quý 3"', '"Orders grew 20% after the free-shipping test"|||"Số đơn tăng 20% sau thử nghiệm miễn phí vận chuyển"', '"Chart 4"|||"Biểu đồ 4"'], 2,
    'An action title states the conclusion.|||Tiêu đề hành động nói ra kết luận.'),
  Q('q8', 'In Knaflic\'s approach, using one highlight colour and greying the rest serves to|||Theo cách tiếp cận của Knaflic, dùng một màu nhấn và tô xám phần còn lại nhằm',
    ['decorate the slide|||trang trí slide', 'focus attention where you want it|||dẫn sự chú ý tới nơi bạn muốn', 'hide data|||giấu dữ liệu', 'save ink|||tiết kiệm mực'], 1,
    'It is one of the six lessons.|||Đó là một trong sáu bài học.'),
  Q('q9', 'A bar chart of conversion rates whose y-axis starts at 3.5% is misleading because|||Biểu đồ thanh tỷ lệ chuyển đổi có trục tung bắt đầu từ 3,5% gây hiểu lầm vì',
    ['conversion rates cannot be charted|||tỷ lệ chuyển đổi không vẽ được', 'the truncated axis exaggerates small differences|||trục bị cắt phóng đại chênh lệch nhỏ', 'it uses too few colours|||dùng quá ít màu', 'bars must be horizontal|||thanh phải nằm ngang'], 1,
    'Bar length must be proportional to the value, so bars start at zero.|||Chiều dài thanh phải tỷ lệ với giá trị, nên thanh bắt đầu từ 0.'),
  Q('q10', 'A strong data story ends with|||Một câu chuyện dữ liệu tốt kết thúc bằng',
    ['the data-cleaning steps|||các bước làm sạch dữ liệu', 'a list of all metrics|||danh sách mọi chỉ số', 'a clear recommendation and the decision needed|||một đề xuất rõ ràng và quyết định cần đưa ra', 'a thank-you slide only|||chỉ một slide cảm ơn'], 2,
    'Situation – complication – resolution leads to an ask.|||Tình huống – vấn đề – giải pháp dẫn tới một đề nghị.'),
]);

const ch11 = {
  title: 'Chapter 11 — Dashboards and data storytelling|||Chương 11 — Dashboard và kể chuyện bằng dữ liệu',
  description: 'Thiết kế dashboard theo người dùng và quyết định (chiến lược/vận hành/phân tích), chọn biểu đồ, bố cục, định nghĩa chỉ số; chuẩn bị bảng dữ liệu cho dashboard bằng pivot pandas (tuần × kênh, CPA, thay đổi theo tuần); kể chuyện bằng dữ liệu theo sáu bài học của Knaflic, cấu trúc tình huống–vấn đề–giải pháp, tránh biểu đồ gây hiểu lầm.',
  lessons: [l11_1, l11_2, l11_3, q11],
};

const l12_1 = L('aba201c-ts-12-1',
  '12.1 — Privacy and data-protection law for communicators|||12.1 — Quyền riêng tư và luật bảo vệ dữ liệu dành cho người làm truyền thông',
  'Dữ liệu cá nhân cơ bản và nhạy cảm, sự đồng ý hợp lệ, quyền của chủ thể dữ liệu, cấm mua bán dữ liệu cá nhân, quy định riêng cho kinh doanh dịch vụ quảng cáo và quảng cáo theo hành vi trong Luật BVDLCN 2025; bảy nguyên tắc của GDPR; tình huống chiến dịch thực tế.',
  `<span class="eyebrow">ABA201c · Chapter 12 · Lesson 12.1</span>
<h2>Privacy and data-protection law for communicators</h2>
<p class="lead">Almost everything in this course — CRM joins, segmentation, retargeting, personalisation — uses personal data. Doing it lawfully is not a job for the legal team alone: the communicator who designs the campaign decides what is collected, why, and how people are told.</p>
<h3>🎯 Objectives</h3>
<ul><li>Explain personal, basic and sensitive personal data under Vietnam's 2025 law.</li><li>State the conditions for valid consent and the main rights of data subjects.</li><li>Apply the rules for advertising and the GDPR principles to a campaign plan.</li></ul>
<p class="note-ct">This lesson is an educational summary, not legal advice. Follow your organisation's legal team and the official texts.</p>
<h3>📖 Lecture</h3>
<h3>Vietnam: the Personal Data Protection Law 2025</h3>
<p>The National Assembly passed the <strong>Law on Personal Data Protection No. 91/2025/QH15</strong> on 26 June 2025; it took effect on 1 January 2026. According to the official introduction document, it builds on Decree 13/2023/NĐ-CP and sets out, among other things:</p>
<ul>
<li><strong>Personal data</strong>: data that identifies or helps identify a specific person, in digital or other form. <strong>Basic</strong> personal data (e.g. name, date of birth, phone number) and <strong>sensitive</strong> personal data (e.g. biometrics, health, financial/credit information, location), with detailed lists issued by the Government.</li>
<li><strong>Consent</strong>: must be voluntary and informed (type of data, purpose, who controls it, the person's rights); expressed clearly and in a form that can be recorded; asked <em>for each purpose</em>; and <strong>silence or no response is not consent</strong>. The law also lists limited cases where consent is not required.</li>
<li><strong>Rights of the data subject</strong>: to be informed; to consent, refuse or withdraw consent; to view and correct; to request provision, deletion or restriction and to object; to complain and claim compensation.</li>
<li><strong>Prohibited acts</strong> include <strong>buying and selling personal data</strong>, except where a law provides otherwise.</li>
<li><strong>Advertising services</strong>: may use personal data only from data transferred lawfully by a controller or collected through their own business; need customers' consent with clear information about content, method and frequency; must provide a way to refuse advertising and stop on request. For <strong>behavioural or personalised advertising</strong>, tracking data from websites and apps may be collected only with consent, people must be able to refuse sharing, and retention periods and deletion must be defined.</li>
</ul>
<h3>International reference: GDPR principles</h3>
<p>Vietnamese brands serving EU residents may fall under the EU's GDPR, and its Article 5 principles are a good checklist anywhere: <strong>lawfulness, fairness and transparency</strong>; <strong>purpose limitation</strong>; <strong>data minimisation</strong>; <strong>accuracy</strong>; <strong>storage limitation</strong>; <strong>integrity and confidentiality</strong>; and <strong>accountability</strong> (being able to show compliance).</p>
<h3>✍️ Worked example — reviewing a campaign plan</h3>
<div class="callout"><p><strong>Plan:</strong> a fitness brand wants to (1) buy a list of "gym-goers in Hà Nội" from a vendor, (2) run a quiz collecting weight and health goals, (3) retarget quiz visitors on social media, (4) keep all data "forever, it might be useful".</p><p><strong>Review:</strong> (1) Buying personal data is prohibited except where a law allows — drop it; grow first-party/zero-party data instead. (2) Health information is sensitive: ask only what the quiz really needs, explain the purpose, get explicit consent for that purpose, protect it strongly. (3) Retargeting based on tracking needs consent and a way to refuse. (4) Violates storage limitation: define a retention period (e.g. 12 months after last activity) and delete afterwards.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Pre-ticked consent boxes or "by continuing you agree" banners — silence is not consent.</li><li>One consent for everything ("marketing, partners, research") instead of per purpose.</li><li>Collecting "just in case" fields (ID number, exact address) for a giveaway.</li><li>No unsubscribe or opt-out path in advertising messages.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Law 91/2025/QH15: passed 26/6/2025, effective 1/1/2026.</li><li>Valid consent: voluntary, informed, clear, per purpose; silence ≠ consent.</li><li>Buying/selling personal data is prohibited (unless a law provides otherwise); advertising needs consent and opt-out.</li><li>GDPR checklist: lawfulness/fairness/transparency, purpose, minimisation, accuracy, storage, security, accountability.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.tgu.edu.vn/upload/files/Tailieu-gioithieu-LuatBaovedulieucanhan.pdf" target="_blank" rel="noopener">Introduction document to the Personal Data Protection Law 2025 (PDF, Vietnamese)</a></li><li><a href="https://luatvietnam.vn/tin-van-ban-moi/da-co-luat-bao-ve-du-lieu-ca-nhan-2025-so-91-2025-qh15-186-102925-article.html" target="_blank" rel="noopener">LuatVietnam — Law on Personal Data Protection 2025, No. 91/2025/QH15</a></li><li><a href="https://gdpr-info.eu/art-5-gdpr/" target="_blank" rel="noopener">GDPR Article 5 — Principles relating to processing of personal data</a></li><li><a href="https://www.ibm.com/think/topics/data-privacy" target="_blank" rel="noopener">IBM — What is data privacy?</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>A pop-up says "By using this site you accept all cookies and marketing." Is this valid consent under the 2025 law's principles? Why?</li><li>Classify as basic or sensitive personal data: (a) phone number, (b) GPS location history, (c) credit information.</li><li>Your agency offers to "enrich" your CRM by buying phone numbers. What do you answer?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) No: consent must be clear and per purpose, and silence/inaction is not consent; offer separate, unticked choices for each purpose. 2) (a) basic, (b) sensitive (location data), (c) sensitive (financial/credit). 3) Decline: buying and selling personal data is prohibited except where a law provides otherwise; build first-party data with consent (sign-ups, loyalty, preference centre) instead.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 12 · Bài 12.1</span>
<h2>Quyền riêng tư và luật bảo vệ dữ liệu dành cho người làm truyền thông</h2>
<p class="lead">Gần như mọi thứ trong môn này — ghép CRM, phân khúc, quảng cáo bám đuổi, cá nhân hoá — đều dùng dữ liệu cá nhân. Làm đúng luật không chỉ là việc của phòng pháp chế: chính người thiết kế chiến dịch quyết định thu gì, để làm gì, và báo cho mọi người thế nào.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích dữ liệu cá nhân, dữ liệu cá nhân cơ bản và nhạy cảm theo luật 2025 của Việt Nam.</li><li>Nêu điều kiện của sự đồng ý hợp lệ và các quyền chính của chủ thể dữ liệu.</li><li>Áp quy định về quảng cáo và các nguyên tắc GDPR vào một kế hoạch chiến dịch.</li></ul>
<p class="note-ct">Bài này là tóm lược để học, không phải tư vấn pháp lý. Hãy làm theo bộ phận pháp chế của tổ chức và văn bản chính thức.</p>
<h3>📖 Bài giảng</h3>
<h3>Việt Nam: Luật Bảo vệ dữ liệu cá nhân 2025</h3>
<p>Quốc hội thông qua <strong>Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15</strong> ngày 26/6/2025; luật có hiệu lực từ ngày 01/01/2026. Theo tài liệu giới thiệu chính thức, luật kế thừa Nghị định 13/2023/NĐ-CP và quy định, trong đó có:</p>
<ul>
<li><strong>Dữ liệu cá nhân</strong>: dữ liệu xác định hoặc giúp xác định một con người cụ thể, ở dạng số hoặc dạng khác. Gồm dữ liệu cá nhân <strong>cơ bản</strong> (ví dụ họ tên, ngày sinh, số điện thoại) và <strong>nhạy cảm</strong> (ví dụ đặc điểm sinh trắc học, sức khoẻ, thông tin tài chính tín dụng, dữ liệu vị trí), danh mục chi tiết do Chính phủ ban hành.</li>
<li><strong>Sự đồng ý</strong>: phải tự nguyện và được biết rõ (loại dữ liệu, mục đích, bên kiểm soát, quyền của mình); thể hiện rõ ràng, cụ thể, lưu lại được; xin <em>theo từng mục đích</em>; và <strong>im lặng hoặc không phản hồi không được coi là đồng ý</strong>. Luật cũng liệt kê một số ít trường hợp không cần sự đồng ý.</li>
<li><strong>Quyền của chủ thể dữ liệu</strong>: được biết; đồng ý, không đồng ý hoặc rút lại đồng ý; xem và chỉnh sửa; yêu cầu cung cấp, xoá, hạn chế xử lý và phản đối xử lý; khiếu nại và yêu cầu bồi thường.</li>
<li><strong>Hành vi bị nghiêm cấm</strong> gồm <strong>mua, bán dữ liệu cá nhân</strong>, trừ trường hợp luật có quy định khác.</li>
<li><strong>Kinh doanh dịch vụ quảng cáo</strong>: chỉ được dùng dữ liệu cá nhân do bên kiểm soát chuyển giao hợp pháp hoặc thu qua hoạt động kinh doanh của chính mình; phải có sự đồng ý của khách hàng trên cơ sở biết rõ nội dung, phương thức, tần suất; phải có cách để khách từ chối nhận quảng cáo và ngừng khi được yêu cầu. Với <strong>quảng cáo theo hành vi hoặc cá nhân hoá</strong>, chỉ được thu dữ liệu theo dõi trên website, ứng dụng khi có đồng ý, phải cho phép từ chối chia sẻ, xác định thời gian lưu trữ và xoá khi không còn cần.</li>
</ul>
<h3>Tham chiếu quốc tế: các nguyên tắc GDPR</h3>
<p>Thương hiệu Việt phục vụ cư dân EU có thể thuộc phạm vi GDPR của EU, và các nguyên tắc ở Điều 5 là bảng kiểm tốt ở bất cứ đâu: <strong>hợp pháp, công bằng và minh bạch</strong>; <strong>giới hạn mục đích</strong>; <strong>tối thiểu hoá dữ liệu</strong>; <strong>chính xác</strong>; <strong>giới hạn lưu trữ</strong>; <strong>toàn vẹn và bảo mật</strong>; và <strong>trách nhiệm giải trình</strong> (chứng minh được việc tuân thủ).</p>
<h3>✍️ Ví dụ — soát một kế hoạch chiến dịch</h3>
<div class="callout"><p><strong>Kế hoạch:</strong> một thương hiệu thể hình muốn (1) mua danh sách "người tập gym ở Hà Nội" từ một nhà cung cấp, (2) chạy quiz thu cân nặng và mục tiêu sức khoẻ, (3) quảng cáo bám đuổi người đã làm quiz trên mạng xã hội, (4) giữ mọi dữ liệu "mãi mãi, biết đâu có lúc cần".</p><p><strong>Soát:</strong> (1) Mua dữ liệu cá nhân bị cấm trừ khi luật cho phép — bỏ; thay bằng xây dữ liệu bên thứ nhất/zero-party. (2) Thông tin sức khoẻ là nhạy cảm: chỉ hỏi những gì quiz thật sự cần, nêu rõ mục đích, xin đồng ý rõ ràng cho mục đích đó, bảo vệ chặt. (3) Quảng cáo bám đuổi dựa trên theo dõi cần đồng ý và cách để từ chối. (4) Vi phạm giới hạn lưu trữ: đặt thời hạn lưu (ví dụ 12 tháng sau lần hoạt động cuối) rồi xoá.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Ô đồng ý tick sẵn hoặc banner "tiếp tục dùng nghĩa là bạn đồng ý" — im lặng không phải là đồng ý.</li><li>Một lần đồng ý cho mọi thứ ("marketing, đối tác, nghiên cứu") thay vì theo từng mục đích.</li><li>Thu các trường "phòng khi cần" (số CCCD, địa chỉ chi tiết) cho một minigame.</li><li>Tin nhắn quảng cáo không có cách huỷ hay từ chối.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Luật 91/2025/QH15: thông qua 26/6/2025, hiệu lực 01/01/2026.</li><li>Đồng ý hợp lệ: tự nguyện, được biết rõ, rõ ràng, theo từng mục đích; im lặng ≠ đồng ý.</li><li>Mua, bán dữ liệu cá nhân bị cấm (trừ khi luật có quy định khác); quảng cáo cần đồng ý và cách từ chối.</li><li>Bảng kiểm GDPR: hợp pháp/công bằng/minh bạch, mục đích, tối thiểu hoá, chính xác, lưu trữ, bảo mật, giải trình.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.tgu.edu.vn/upload/files/Tailieu-gioithieu-LuatBaovedulieucanhan.pdf" target="_blank" rel="noopener">Tài liệu giới thiệu Luật Bảo vệ dữ liệu cá nhân 2025 (PDF)</a></li><li><a href="https://luatvietnam.vn/tin-van-ban-moi/da-co-luat-bao-ve-du-lieu-ca-nhan-2025-so-91-2025-qh15-186-102925-article.html" target="_blank" rel="noopener">LuatVietnam — Đã có Luật Bảo vệ dữ liệu cá nhân 2025, số 91/2025/QH15</a></li><li><a href="https://gdpr-info.eu/art-5-gdpr/" target="_blank" rel="noopener">GDPR Điều 5 — Các nguyên tắc xử lý dữ liệu cá nhân</a></li><li><a href="https://www.ibm.com/think/topics/data-privacy" target="_blank" rel="noopener">IBM — Quyền riêng tư dữ liệu là gì?</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Một pop-up ghi "Khi dùng trang này, bạn chấp nhận mọi cookie và marketing." Đây có phải đồng ý hợp lệ theo tinh thần luật 2025? Vì sao?</li><li>Xếp loại dữ liệu cá nhân cơ bản hay nhạy cảm: (a) số điện thoại, (b) lịch sử vị trí GPS, (c) thông tin tín dụng.</li><li>Agency đề nghị "làm giàu" CRM bằng cách mua số điện thoại. Bạn trả lời sao?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Không: đồng ý phải rõ ràng, theo từng mục đích, và im lặng/không hành động không phải là đồng ý; hãy đưa các lựa chọn riêng, không tick sẵn cho từng mục đích. 2) (a) cơ bản, (b) nhạy cảm (dữ liệu vị trí), (c) nhạy cảm (tài chính tín dụng). 3) Từ chối: mua, bán dữ liệu cá nhân bị cấm trừ trường hợp luật có quy định khác; thay vào đó xây dữ liệu bên thứ nhất có đồng ý (đăng ký, thành viên, trung tâm sở thích).</p></div>`);

const l12_2 = L('aba201c-ts-12-2',
  '12.2 — Bias and fairness in data and models|||12.2 — Thiên lệch và công bằng trong dữ liệu và mô hình',
  'Thiên lệch đi vào từ đâu (chọn mẫu, lịch sử, biến đại diện, đo lường, vòng phản hồi), nghiên cứu Gender Shades, đo tỷ lệ được chọn theo nhóm và tỷ số "four-fifths" bằng pandas (kèm cảnh báo dùng sai), cách giảm thiên lệch trong nhắm chọn quảng cáo.',
  `<span class="eyebrow">ABA201c · Chapter 12 · Lesson 12.2</span>
<h2>Bias and fairness in data and models</h2>
<p class="lead">A targeting model never "decides" to discriminate. It learns patterns from past data — and if the past was unequal, the model repeats it at scale and with an air of objectivity. Communicators who choose audiences must know where bias comes from and how to check for it.</p>
<h3>🎯 Objectives</h3>
<ul><li>Name the main sources of bias in data and AI systems.</li><li>Measure selection rates by group and interpret a disparity ratio carefully.</li><li>Propose practical mitigations for campaign targeting.</li></ul>
<h3>📖 Lecture</h3>
<h3>Where bias comes from</h3>
<ul>
<li><strong>Sampling bias</strong>: the data over-represents some groups (urban, young, online-active) — remember Chapter 2's listening data.</li>
<li><strong>Historical bias</strong>: past decisions were unequal (e.g. premium offers were only ever shown in big cities), so "who responded" reflects who was asked.</li>
<li><strong>Proxy variables</strong>: removing "gender" or "region" does not help if postcode, device price or first name carries the same information.</li>
<li><strong>Measurement bias</strong>: the label itself is skewed (sentiment labelled by a team unfamiliar with a regional dialect).</li>
<li><strong>Feedback loops</strong>: the model targets group A, only group A generates new data, and the model becomes even more confident about A.</li>
</ul>
<p>A famous demonstration is the <strong>Gender Shades</strong> study (Buolamwini &amp; Gebru, 2018), which evaluated three commercial gender-classification systems: darker-skinned women were the most misclassified group, with error rates of up to 34.7%, while the maximum error rate for lighter-skinned men was 0.8%. The benchmark datasets were mostly lighter-skinned — a sampling problem that became a product problem.</p>
<h3>Measuring disparity</h3>
<p>A simple first check is the <strong>selection rate</strong> per group (share of each group that the model selects, e.g. for an offer) and the ratio of the lowest to the highest rate. The Fairlearn documentation calls this the demographic parity ratio and notes that the "four-fifths rule" (ratio below 0.8 as a warning) has its origins in US federal employment law and is often misapplied elsewhere. Treat it as a <em>signal to investigate</em>, not a verdict.</p>
<h3>✍️ Worked example — who gets the premium-card offer?</h3>
<pre><code class="language-python">import pandas as pd

# who did a "high-value lead" model select for a premium credit-card campaign?
d = pd.DataFrame({
    "group":    ["urban"] * 100 + ["rural"] * 100,
    "selected": [1] * 42 + [0] * 58 + [1] * 18 + [0] * 82,
})
rate = d.groupby("group").selected.mean()
print(rate)
ratio = rate.min() / rate.max()
print("disparate impact ratio (min/max):", round(ratio, 2))
print("below the 0.8 'four-fifths' rule of thumb?", ratio &lt; 0.8)
</code></pre>
<div class="out">group
rural    0.18
urban    0.42
Name: selected, dtype: float64
disparate impact ratio (min/max): 0.43
below the 0.8 'four-fifths' rule of thumb? True</div>
<p><strong>Reading the output.</strong> The model selected 42% of urban leads but only 18% of rural leads: a ratio of 0.43, far below 0.8. That does not prove unfairness — rural leads may truly be less likely to qualify — but it demands questions: Was the model trained on past campaigns that never targeted rural areas (historical bias)? Do features like device price act as proxies for income or region? Are rural applicants who <em>would</em> qualify being missed (compare recall per group, Chapter 7)? Fixes range from collecting better data and removing proxies to setting group-aware thresholds or simply running a test campaign in rural areas to learn.</p>
<h3>Bias in creative and generative AI</h3>
<p>Bias is not only in targeting. Generated images may default to one skin tone or gender for a "doctor"; copy may use stereotypes. Review creative for representation with the same discipline you apply to numbers (Chapter 9).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>"We removed gender, so the model is fair" — proxies remain.</li><li>Checking only overall accuracy, never performance per group.</li><li>Applying the 0.8 rule mechanically as a legal test outside its context.</li><li>Never testing outside the segments the model already likes (feedback loop).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Bias enters through sampling, history, proxies, measurement and feedback loops.</li><li>Check selection rates and error rates per group.</li><li>A low disparity ratio is a reason to investigate, not an automatic verdict.</li><li>Mitigate with better data, fewer proxies, per-group evaluation and exploratory tests.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://proceedings.mlr.press/v81/buolamwini18a.html" target="_blank" rel="noopener">Buolamwini &amp; Gebru — Gender Shades (PMLR, 2018)</a></li><li><a href="https://fairlearn.org/main/user_guide/assessment/common_fairness_metrics.html" target="_blank" rel="noopener">Fairlearn — Common fairness metrics (incl. the four-fifths rule caveat)</a></li><li><a href="https://developers.google.com/machine-learning/crash-course/fairness" target="_blank" rel="noopener">Google ML Crash Course — Fairness</a></li><li><a href="https://www.ibm.com/think/topics/ai-bias" target="_blank" rel="noopener">IBM — What is AI bias?</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Group A: 300 of 1,000 selected; group B: 150 of 1,000. Compute the selection rates and the ratio.</li><li>Give an example of a proxy variable in a Vietnamese e-commerce dataset.</li><li>How can a feedback loop make a targeting model more biased over time?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) A = 30%, B = 15%, ratio = 0.15 ÷ 0.30 = 0.5 → investigate. 2) e.g. district or delivery address (proxy for income), phone model (proxy for income/age), shopping hours (proxy for occupation). 3) The model only targets segments it scored high; only those produce new response data; retraining on that data reinforces the same segments, and others are never given a chance to show they would respond.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 12 · Bài 12.2</span>
<h2>Thiên lệch và công bằng trong dữ liệu và mô hình</h2>
<p class="lead">Một mô hình nhắm chọn không bao giờ "quyết định" phân biệt đối xử. Nó học mẫu hình từ dữ liệu quá khứ — và nếu quá khứ bất bình đẳng, mô hình lặp lại điều đó ở quy mô lớn với vẻ ngoài khách quan. Người làm truyền thông chọn khán giả phải biết thiên lệch đến từ đâu và cách kiểm tra nó.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Kể tên các nguồn thiên lệch chính trong dữ liệu và hệ thống AI.</li><li>Đo tỷ lệ được chọn theo nhóm và diễn giải tỷ số chênh lệch một cách thận trọng.</li><li>Đề xuất cách giảm thiên lệch thực tế cho nhắm chọn chiến dịch.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Thiên lệch đến từ đâu</h3>
<ul>
<li><strong>Thiên lệch chọn mẫu</strong>: dữ liệu đại diện quá mức một số nhóm (thành thị, trẻ, hoạt động online nhiều) — nhớ lại dữ liệu listening ở Chương 2.</li>
<li><strong>Thiên lệch lịch sử</strong>: quyết định trong quá khứ đã bất bình đẳng (ví dụ ưu đãi cao cấp chỉ từng hiện ở thành phố lớn), nên "ai đã phản hồi" phản ánh "ai đã được hỏi".</li>
<li><strong>Biến đại diện (proxy)</strong>: bỏ "giới tính" hay "vùng" chẳng giúp gì nếu mã bưu chính, giá điện thoại hay tên riêng mang cùng thông tin.</li>
<li><strong>Thiên lệch đo lường</strong>: bản thân nhãn bị lệch (cảm xúc được gán bởi một nhóm không quen phương ngữ vùng miền).</li>
<li><strong>Vòng phản hồi</strong>: mô hình nhắm nhóm A, chỉ nhóm A tạo dữ liệu mới, và mô hình càng tự tin hơn về A.</li>
</ul>
<p>Một minh chứng nổi tiếng là nghiên cứu <strong>Gender Shades</strong> (Buolamwini &amp; Gebru, 2018), đánh giá ba hệ thống phân loại giới tính thương mại: phụ nữ da sẫm màu là nhóm bị phân loại sai nhiều nhất, tỷ lệ lỗi tới 34,7%, trong khi tỷ lệ lỗi tối đa của nam giới da sáng là 0,8%. Các bộ dữ liệu chuẩn chủ yếu là người da sáng — một vấn đề chọn mẫu đã trở thành vấn đề sản phẩm.</p>
<h3>Đo chênh lệch</h3>
<p>Phép kiểm đầu tiên đơn giản là <strong>tỷ lệ được chọn</strong> của mỗi nhóm (phần trăm mỗi nhóm được mô hình chọn, ví dụ nhận ưu đãi) và tỷ số giữa tỷ lệ thấp nhất với cao nhất. Tài liệu Fairlearn gọi đây là tỷ số demographic parity và lưu ý rằng "quy tắc bốn phần năm" (tỷ số dưới 0,8 là cảnh báo) bắt nguồn từ luật lao động liên bang Hoa Kỳ và thường bị áp dụng sai ở nơi khác. Hãy coi nó là <em>tín hiệu để điều tra</em>, không phải phán quyết.</p>
<h3>✍️ Ví dụ — ai nhận ưu đãi thẻ cao cấp?</h3>
<pre><code class="language-python">import pandas as pd

# who did a "high-value lead" model select for a premium credit-card campaign?
d = pd.DataFrame({
    "group":    ["urban"] * 100 + ["rural"] * 100,
    "selected": [1] * 42 + [0] * 58 + [1] * 18 + [0] * 82,
})
rate = d.groupby("group").selected.mean()
print(rate)
ratio = rate.min() / rate.max()
print("disparate impact ratio (min/max):", round(ratio, 2))
print("below the 0.8 'four-fifths' rule of thumb?", ratio &lt; 0.8)
</code></pre>
<div class="out">group
rural    0.18
urban    0.42
Name: selected, dtype: float64
disparate impact ratio (min/max): 0.43
below the 0.8 'four-fifths' rule of thumb? True</div>
<p><strong>Đọc kết quả.</strong> Mô hình chọn 42% khách tiềm năng ở thành thị nhưng chỉ 18% ở nông thôn: tỷ số 0,43, thấp xa so với 0,8. Điều đó không chứng minh bất công — có thể khách nông thôn thật sự ít đủ điều kiện hơn — nhưng đòi hỏi đặt câu hỏi: Mô hình có được huấn luyện từ các chiến dịch cũ chưa từng nhắm vùng nông thôn (thiên lệch lịch sử)? Các đặc trưng như giá điện thoại có đang đại diện cho thu nhập hay vùng miền? Những người nông thôn <em>lẽ ra</em> đủ điều kiện có đang bị bỏ sót (so recall theo nhóm, Chương 7)? Cách sửa trải từ thu dữ liệu tốt hơn, bỏ biến đại diện, đặt ngưỡng có tính đến nhóm, cho tới đơn giản là chạy một chiến dịch thử ở nông thôn để học hỏi.</p>
<h3>Thiên lệch trong sáng tạo và AI tạo sinh</h3>
<p>Thiên lệch không chỉ nằm ở nhắm chọn. Ảnh được sinh ra có thể mặc định một màu da hay giới tính cho "bác sĩ"; câu chữ có thể dùng khuôn mẫu. Hãy soát sản phẩm sáng tạo về tính đại diện với cùng kỷ luật bạn dùng cho con số (Chương 9).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>"Tụi mình bỏ cột giới tính rồi nên mô hình công bằng" — biến đại diện vẫn còn.</li><li>Chỉ kiểm accuracy chung, không bao giờ xem hiệu quả theo từng nhóm.</li><li>Áp quy tắc 0,8 một cách máy móc như phép thử pháp lý ngoài bối cảnh của nó.</li><li>Không bao giờ thử ngoài các phân khúc mà mô hình đã ưa (vòng phản hồi).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Thiên lệch đi vào qua chọn mẫu, lịch sử, biến đại diện, đo lường và vòng phản hồi.</li><li>Kiểm tỷ lệ được chọn và tỷ lệ lỗi theo nhóm.</li><li>Tỷ số chênh lệch thấp là lý do để điều tra, không phải phán quyết tự động.</li><li>Giảm thiểu bằng dữ liệu tốt hơn, ít biến đại diện hơn, đánh giá theo nhóm và thử nghiệm khám phá.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://proceedings.mlr.press/v81/buolamwini18a.html" target="_blank" rel="noopener">Buolamwini &amp; Gebru — Gender Shades (PMLR, 2018)</a></li><li><a href="https://fairlearn.org/main/user_guide/assessment/common_fairness_metrics.html" target="_blank" rel="noopener">Fairlearn — Các chỉ số công bằng thường dùng (kèm cảnh báo về quy tắc bốn phần năm)</a></li><li><a href="https://developers.google.com/machine-learning/crash-course/fairness" target="_blank" rel="noopener">Google ML Crash Course — Công bằng</a></li><li><a href="https://www.ibm.com/think/topics/ai-bias" target="_blank" rel="noopener">IBM — Thiên lệch AI là gì?</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>Nhóm A: 300/1.000 được chọn; nhóm B: 150/1.000. Tính tỷ lệ được chọn và tỷ số.</li><li>Cho ví dụ về một biến đại diện trong bộ dữ liệu thương mại điện tử ở Việt Nam.</li><li>Vòng phản hồi có thể làm mô hình nhắm chọn thiên lệch hơn theo thời gian thế nào?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) A = 30%, B = 15%, tỷ số = 0,15 ÷ 0,30 = 0,5 → cần điều tra. 2) Ví dụ quận hoặc địa chỉ giao hàng (đại diện cho thu nhập), đời điện thoại (đại diện cho thu nhập/tuổi), khung giờ mua sắm (đại diện cho nghề nghiệp). 3) Mô hình chỉ nhắm các phân khúc nó chấm điểm cao; chỉ những phân khúc đó tạo dữ liệu phản hồi mới; huấn luyện lại trên dữ liệu đó càng củng cố cùng các phân khúc, còn nhóm khác không bao giờ có cơ hội cho thấy họ sẽ phản hồi.</p></div>`);

const l12_3 = L('aba201c-ts-12-3',
  '12.3 — Responsible data practice: pseudonymisation, k-anonymity and an ethics checklist|||12.3 — Thực hành dữ liệu có trách nhiệm: giả danh hoá, k-ẩn danh và bảng kiểm đạo đức',
  'Mã hoá, giả danh hoá và khử nhận dạng khác nhau thế nào (theo Luật BVDLCN 2025), băm email có "muối" bằng Python, gộp nhóm tuổi và kiểm k-ẩn danh, bảng kiểm AI có trách nhiệm cho một dự án truyền thông, khung NIST AI RMF và nguyên tắc OECD.',
  `<span class="eyebrow">ABA201c · Chapter 12 · Lesson 12.3</span>
<h2>Responsible data practice</h2>
<p class="lead">The safest personal data is the data you never collect; the next safest is data that can no longer identify anyone. This final lesson turns principles into habits you can apply to every project — including your capstone.</p>
<h3>🎯 Objectives</h3>
<ul><li>Distinguish encryption, pseudonymisation and de-identification.</li><li>Pseudonymise emails with a salted hash and check k-anonymity.</li><li>Use a responsible-AI checklist for a communications project.</li></ul>
<h3>📖 Lecture</h3>
<h3>Three different protections</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Encryption</span><span class="v">Converts data into an unreadable form that can be decrypted with a key. Vietnam's 2025 law, as explained in its introduction document, treats encrypted personal data as <em>still personal data</em>, because it can be decrypted.</span></div>
<div class="kv"><span class="k">Pseudonymisation</span><span class="v">Replaces direct identifiers (email, phone) with a code. Useful for analysis, but whoever holds the key or can re-link the code can re-identify people — so it is still personal data and must be protected.</span></div>
<div class="kv"><span class="k">De-identification</span><span class="v">Changes or removes information so that the result can no longer identify a person. Under the 2025 law, properly de-identified data is no longer personal data — but the process must be controlled and re-identification prevented.</span></div>
</div>
<p>Removing names is rarely enough. Combinations of <strong>quasi-identifiers</strong> — age, district, gender, job — can single out one person. <strong>k-anonymity</strong> is a simple check: every combination of quasi-identifiers in a released table should be shared by at least k people.</p>
<h3>✍️ Worked example — preparing a dataset for an agency</h3>
<p>We replace emails with a salted hash (the secret "salt" stops anyone from hashing a list of known emails to find matches), turn exact age into age bands, and check the smallest group size:</p>
<pre><code class="language-python">import hashlib, pandas as pd

SALT = "doi-chuoi-bi-mat-nay"   # keep secret, store separately from the data
def pseudo(email):
    return hashlib.sha256((SALT + email.strip().lower()).encode()).hexdigest()[:12]

df = pd.DataFrame({
    "email": ["an@mail.com", "binh@mail.com", "chi@mail.com", "dung@mail.com", "em@mail.com", "giang@mail.com"],
    "age":   [19, 21, 20, 34, 37, 36],
    "district": ["Hải Châu", "Hải Châu", "Hải Châu", "Sơn Trà", "Sơn Trà", "Ngũ Hành Sơn"],
    "spend": [120, 340, 90, 800, 650, 720],
})
out = df.assign(user_key=df.email.map(pseudo)).drop(columns="email")
out["age_band"] = pd.cut(out.age, [17, 24, 34, 44], labels=["18-24", "25-34", "35-44"])
out = out.drop(columns="age")
print(out)
k = out.groupby(["age_band", "district"], observed=True).size()
print("\\nsmallest group size (k):", k.min())
print(k[k &lt; 2])
</code></pre>
<div class="out">       district  spend      user_key age_band
0      Hải Châu    120  fa83fa7cc5a7    18-24
1      Hải Châu    340  2bf3a1871e4b    18-24
2      Hải Châu     90  aca99711f360    18-24
3       Sơn Trà    800  81001325253e    25-34
4       Sơn Trà    650  0e3a22772acc    35-44
5  Ngũ Hành Sơn    720  f7cf897fd5dc    35-44

smallest group size (k): 1
age_band  district    
25-34     Sơn Trà         1
35-44     Ngũ Hành Sơn    1
          Sơn Trà         1
dtype: int64</div>
<p><strong>Reading the output.</strong> Emails are gone; each customer has a stable 12-character key, so the agency can still join purchases to behaviour. But k = 1: three combinations of age band and district contain a single person — the one 25–34-year-old in Sơn Trà is identifiable to anyone who knows them, and their spend is revealed. Fixes: widen bands (18–29, 30–44), generalise districts into areas, drop columns the agency does not need, or release only aggregated tables. And because this is <em>pseudonymised</em>, not de-identified, it still needs a data-processing agreement and security measures.</p>
<h3>A responsible-AI checklist for communication projects</h3>
<ol>
<li><strong>Purpose</strong>: what decision does this data or model support? Is it legitimate and explained to people?</li>
<li><strong>Minimisation</strong>: are we collecting only what is needed? Is there a retention and deletion date?</li>
<li><strong>Consent and rights</strong>: is consent valid and per purpose? Can people opt out, access and delete?</li>
<li><strong>Security</strong>: who can access the data? Is it pseudonymised for analysis? Are external AI tools approved?</li>
<li><strong>Fairness</strong>: have we checked results and errors per group? Any proxies? Any group never tested?</li>
<li><strong>Transparency</strong>: do we disclose AI-generated content and explain personalisation?</li>
<li><strong>Accuracy and accountability</strong>: who reviews AI outputs and model decisions? How are mistakes corrected?</li>
</ol>
<p>International frameworks offer fuller versions: the <strong>NIST AI Risk Management Framework</strong> organises AI risk work for organisations, and the <strong>OECD AI Principles</strong> and UNESCO's Recommendation on the Ethics of AI set out values such as human rights, transparency, robustness and accountability.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Calling hashed emails "anonymous data".</li><li>Sending row-level customer data when an aggregated table would do.</li><li>Storing the salt or key next to the pseudonymised file.</li><li>Treating ethics as a final sign-off instead of a design step.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Encryption and pseudonymisation protect data but it remains personal data; true de-identification does not identify anyone.</li><li>Quasi-identifiers can re-identify people; check k-anonymity and generalise.</li><li>Share aggregates whenever possible.</li><li>Run the checklist — purpose, minimisation, consent, security, fairness, transparency, accountability — at the start.</li></ul>
<h3>🔗 Further learning</h3>
<ul><li><a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noopener">NIST — AI Risk Management Framework</a></li><li><a href="https://oecd.ai/en/ai-principles" target="_blank" rel="noopener">OECD — AI Principles</a></li><li><a href="https://www.unesco.org/en/artificial-intelligence/recommendation-ethics" target="_blank" rel="noopener">UNESCO — Recommendation on the Ethics of Artificial Intelligence</a></li><li><a href="https://www.microsoft.com/en-us/ai/responsible-ai" target="_blank" rel="noopener">Microsoft — Responsible AI principles and practices</a></li></ul>
<h3>🧪 Practice</h3>
<ol><li>Is a file with SHA-256 hashes of customer phone numbers "anonymous"? Explain.</li><li>A table has columns: birth year, ward, gender, job title, monthly spend. Which are quasi-identifiers and what would you generalise?</li><li>Apply three checklist items to your own capstone idea.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) No. Phone numbers have a limited format, so anyone can hash all possible numbers and match them (unless a secret salt is used), and even with a salt the holder can re-link — it is pseudonymised personal data. 2) Birth year, ward, gender and job title are quasi-identifiers; generalise birth year to age bands, ward to district or area, job title to job family, and check that every combination has at least k (e.g. 5) people. 3) Example: purpose — "recommend study cafés to students"; minimisation — store only district, not exact location; transparency — tell users recommendations are personalised and let them turn it off.</p></div>`,
  `<span class="eyebrow">ABA201c · Chương 12 · Bài 12.3</span>
<h2>Thực hành dữ liệu có trách nhiệm</h2>
<p class="lead">Dữ liệu cá nhân an toàn nhất là dữ liệu bạn không bao giờ thu; an toàn thứ nhì là dữ liệu không còn xác định được ai. Bài cuối này biến các nguyên tắc thành thói quen áp dụng được cho mọi dự án — kể cả đồ án tốt nghiệp của bạn.</p>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phân biệt mã hoá, giả danh hoá và khử nhận dạng.</li><li>Giả danh hoá email bằng băm có muối và kiểm k-ẩn danh.</li><li>Dùng bảng kiểm AI có trách nhiệm cho một dự án truyền thông.</li></ul>
<h3>📖 Bài giảng</h3>
<h3>Ba lớp bảo vệ khác nhau</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Mã hoá</span><span class="v">Chuyển dữ liệu sang dạng không đọc được, giải mã được bằng khoá. Theo tài liệu giới thiệu, Luật 2025 của Việt Nam coi dữ liệu cá nhân đã mã hoá <em>vẫn là dữ liệu cá nhân</em>, vì luôn có thể giải mã.</span></div>
<div class="kv"><span class="k">Giả danh hoá</span><span class="v">Thay định danh trực tiếp (email, điện thoại) bằng một mã. Hữu ích cho phân tích, nhưng ai giữ khoá hoặc nối lại được mã thì vẫn nhận diện được người — nên vẫn là dữ liệu cá nhân và phải được bảo vệ.</span></div>
<div class="kv"><span class="k">Khử nhận dạng</span><span class="v">Thay đổi hoặc xoá thông tin để kết quả không còn xác định được một người. Theo luật 2025, dữ liệu đã khử nhận dạng đúng cách không còn là dữ liệu cá nhân — nhưng quá trình phải được kiểm soát và không được tái nhận dạng.</span></div>
</div>
<p>Bỏ tên hiếm khi là đủ. Tổ hợp các <strong>định danh gián tiếp (quasi-identifier)</strong> — tuổi, quận, giới tính, nghề — có thể chỉ ra đúng một người. <strong>K-ẩn danh (k-anonymity)</strong> là phép kiểm đơn giản: mọi tổ hợp định danh gián tiếp trong bảng công bố phải có ít nhất k người cùng chia sẻ.</p>
<h3>✍️ Ví dụ — chuẩn bị bộ dữ liệu gửi agency</h3>
<p>Ta thay email bằng giá trị băm có muối ("muối" bí mật ngăn người khác băm một danh sách email đã biết để dò ra trùng khớp), đổi tuổi chính xác thành nhóm tuổi, và kiểm cỡ nhóm nhỏ nhất:</p>
<pre><code class="language-python">import hashlib, pandas as pd

SALT = "doi-chuoi-bi-mat-nay"   # keep secret, store separately from the data
def pseudo(email):
    return hashlib.sha256((SALT + email.strip().lower()).encode()).hexdigest()[:12]

df = pd.DataFrame({
    "email": ["an@mail.com", "binh@mail.com", "chi@mail.com", "dung@mail.com", "em@mail.com", "giang@mail.com"],
    "age":   [19, 21, 20, 34, 37, 36],
    "district": ["Hải Châu", "Hải Châu", "Hải Châu", "Sơn Trà", "Sơn Trà", "Ngũ Hành Sơn"],
    "spend": [120, 340, 90, 800, 650, 720],
})
out = df.assign(user_key=df.email.map(pseudo)).drop(columns="email")
out["age_band"] = pd.cut(out.age, [17, 24, 34, 44], labels=["18-24", "25-34", "35-44"])
out = out.drop(columns="age")
print(out)
k = out.groupby(["age_band", "district"], observed=True).size()
print("\\nsmallest group size (k):", k.min())
print(k[k &lt; 2])
</code></pre>
<div class="out">       district  spend      user_key age_band
0      Hải Châu    120  fa83fa7cc5a7    18-24
1      Hải Châu    340  2bf3a1871e4b    18-24
2      Hải Châu     90  aca99711f360    18-24
3       Sơn Trà    800  81001325253e    25-34
4       Sơn Trà    650  0e3a22772acc    35-44
5  Ngũ Hành Sơn    720  f7cf897fd5dc    35-44

smallest group size (k): 1
age_band  district    
25-34     Sơn Trà         1
35-44     Ngũ Hành Sơn    1
          Sơn Trà         1
dtype: int64</div>
<p><strong>Đọc kết quả.</strong> Email đã biến mất; mỗi khách có một khoá ổn định 12 ký tự, nên agency vẫn nối được giao dịch với hành vi. Nhưng k = 1: ba tổ hợp nhóm tuổi–quận chỉ có một người — người duy nhất 25–34 tuổi ở Sơn Trà bị nhận ra bởi bất kỳ ai quen họ, và mức chi tiêu của họ bị lộ. Cách sửa: nới nhóm tuổi (18–29, 30–44), gộp quận thành khu vực, bỏ các cột agency không cần, hoặc chỉ gửi bảng tổng hợp. Và vì đây là <em>giả danh hoá</em> chứ không phải khử nhận dạng, vẫn cần hợp đồng xử lý dữ liệu và biện pháp bảo mật.</p>
<h3>Bảng kiểm AI có trách nhiệm cho dự án truyền thông</h3>
<ol>
<li><strong>Mục đích</strong>: dữ liệu hay mô hình này phục vụ quyết định nào? Có chính đáng và được giải thích cho mọi người?</li>
<li><strong>Tối thiểu hoá</strong>: có chỉ thu những gì cần? Có ngày lưu giữ và ngày xoá?</li>
<li><strong>Đồng ý và quyền</strong>: đồng ý có hợp lệ, theo từng mục đích? Người dùng có từ chối, xem và xoá được?</li>
<li><strong>Bảo mật</strong>: ai truy cập được dữ liệu? Có được giả danh hoá khi phân tích? Công cụ AI bên ngoài đã được duyệt chưa?</li>
<li><strong>Công bằng</strong>: đã kiểm kết quả và lỗi theo nhóm? Có biến đại diện? Có nhóm nào chưa từng được thử?</li>
<li><strong>Minh bạch</strong>: có công bố nội dung do AI tạo và giải thích việc cá nhân hoá?</li>
<li><strong>Chính xác và trách nhiệm</strong>: ai duyệt đầu ra AI và quyết định của mô hình? Sửa sai thế nào?</li>
</ol>
<p>Các khung quốc tế có phiên bản đầy đủ hơn: <strong>Khung quản trị rủi ro AI của NIST</strong> tổ chức công việc quản lý rủi ro AI cho các tổ chức, còn <strong>Nguyên tắc AI của OECD</strong> và Khuyến nghị về Đạo đức AI của UNESCO nêu các giá trị như quyền con người, minh bạch, vững vàng và trách nhiệm giải trình.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Gọi email đã băm là "dữ liệu ẩn danh".</li><li>Gửi dữ liệu khách hàng từng dòng khi một bảng tổng hợp là đủ.</li><li>Lưu "muối" hay khoá ngay cạnh file đã giả danh hoá.</li><li>Coi đạo đức là bước ký duyệt cuối cùng thay vì một bước thiết kế.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Mã hoá và giả danh hoá bảo vệ dữ liệu nhưng nó vẫn là dữ liệu cá nhân; khử nhận dạng thật sự thì không xác định được ai.</li><li>Định danh gián tiếp có thể làm lộ người; kiểm k-ẩn danh và tổng quát hoá.</li><li>Gửi số liệu tổng hợp bất cứ khi nào có thể.</li><li>Chạy bảng kiểm — mục đích, tối thiểu hoá, đồng ý, bảo mật, công bằng, minh bạch, trách nhiệm — ngay từ đầu.</li></ul>
<h3>🔗 Học thêm</h3>
<ul><li><a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noopener">NIST — Khung quản trị rủi ro AI</a></li><li><a href="https://oecd.ai/en/ai-principles" target="_blank" rel="noopener">OECD — Các nguyên tắc AI</a></li><li><a href="https://www.unesco.org/en/artificial-intelligence/recommendation-ethics" target="_blank" rel="noopener">UNESCO — Khuyến nghị về Đạo đức của Trí tuệ nhân tạo</a></li><li><a href="https://www.microsoft.com/en-us/ai/responsible-ai" target="_blank" rel="noopener">Microsoft — Nguyên tắc và thực hành AI có trách nhiệm</a></li></ul>
<h3>🧪 Tự luyện</h3>
<ol><li>File chứa giá trị băm SHA-256 của số điện thoại khách hàng có phải "ẩn danh" không? Giải thích.</li><li>Một bảng có các cột: năm sinh, phường, giới tính, chức danh, chi tiêu tháng. Đâu là định danh gián tiếp và bạn sẽ tổng quát hoá gì?</li><li>Áp ba mục trong bảng kiểm vào ý tưởng đồ án của chính bạn.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Không. Số điện thoại có định dạng giới hạn, nên ai cũng có thể băm mọi số khả dĩ rồi dò khớp (trừ khi dùng muối bí mật), và kể cả có muối thì người giữ muối vẫn nối lại được — đó là dữ liệu cá nhân đã giả danh hoá. 2) Năm sinh, phường, giới tính và chức danh là định danh gián tiếp; đổi năm sinh thành nhóm tuổi, phường thành quận hoặc khu vực, chức danh thành nhóm nghề, và kiểm mọi tổ hợp có ít nhất k (ví dụ 5) người. 3) Ví dụ: mục đích — "gợi ý quán cà phê học bài cho sinh viên"; tối thiểu hoá — chỉ lưu quận, không lưu vị trí chính xác; minh bạch — báo người dùng rằng gợi ý được cá nhân hoá và cho phép tắt.</p></div>`);

const q12 = QZ(12, 'Chapter 12 quiz — Privacy, ethics and bias|||Quiz Chương 12 — Quyền riêng tư, đạo đức và thiên lệch', '10 câu ôn Luật BVDLCN 2025 (đồng ý, dữ liệu nhạy cảm, cấm mua bán, quảng cáo theo hành vi), nguyên tắc GDPR, nguồn thiên lệch, tỷ số chọn theo nhóm, giả danh hoá, k-ẩn danh.', [
  Q('q1', 'Vietnam\'s Personal Data Protection Law No. 91/2025/QH15 took effect on|||Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 có hiệu lực từ',
    ['26 June 2025|||26/6/2025', '1 January 2026|||01/01/2026', '1 July 2025|||01/7/2025', '1 January 2025|||01/01/2025'], 1,
    'It was passed on 26 June 2025 and took effect on 1 January 2026.|||Luật được thông qua ngày 26/6/2025 và có hiệu lực từ 01/01/2026.'),
  Q('q2', 'Under the 2025 law\'s consent rules, a customer who does not respond to a consent request has|||Theo quy định về sự đồng ý của luật 2025, khách không phản hồi yêu cầu xin đồng ý thì',
    ['given consent|||đã đồng ý', 'not given consent|||chưa đồng ý', 'given consent for marketing only|||chỉ đồng ý cho marketing', 'given consent for 30 days|||đồng ý trong 30 ngày'], 1,
    'Silence or no response is not consent.|||Im lặng hoặc không phản hồi không được coi là đồng ý.'),
  Q('q3', 'Which is given as an example of SENSITIVE personal data in the law\'s introduction document?|||Ví dụ nào được nêu là dữ liệu cá nhân NHẠY CẢM trong tài liệu giới thiệu luật?',
    ['Full name|||Họ và tên', 'Phone number|||Số điện thoại', 'Location data|||Dữ liệu vị trí', 'Date of birth|||Ngày sinh'], 2,
    'Examples of sensitive data include biometrics, health, financial/credit information and location.|||Ví dụ dữ liệu nhạy cảm gồm sinh trắc học, sức khoẻ, tài chính tín dụng và vị trí.'),
  Q('q4', 'Buying a third-party list of personal phone numbers for a campaign is|||Mua danh sách số điện thoại cá nhân từ bên thứ ba cho chiến dịch là',
    ['fine if the list is cheap|||ổn nếu danh sách rẻ', 'prohibited, except where a law provides otherwise|||bị cấm, trừ trường hợp luật có quy định khác', 'required for retargeting|||bắt buộc cho retargeting', 'allowed if you hash the numbers|||được phép nếu băm các số đó'], 1,
    'Buying and selling personal data is a prohibited act under the 2025 law.|||Mua, bán dữ liệu cá nhân là hành vi bị nghiêm cấm theo luật 2025.'),
  Q('q5', '"Collect only what is needed for the purpose" is the GDPR principle of|||"Chỉ thu những gì cần cho mục đích" là nguyên tắc GDPR về',
    ['accuracy|||chính xác', 'data minimisation|||tối thiểu hoá dữ liệu', 'accountability|||trách nhiệm giải trình', 'storage limitation|||giới hạn lưu trữ'], 1,
    'Article 5(1)(c) GDPR.|||Điều 5(1)(c) GDPR.'),
  Q('q6', 'A model trained only on past campaigns that targeted big cities shows|||Mô hình chỉ học từ các chiến dịch cũ nhắm thành phố lớn thể hiện',
    ['measurement bias|||thiên lệch đo lường', 'historical bias|||thiên lệch lịch sử', 'no bias|||không thiên lệch', 'random error|||sai số ngẫu nhiên'], 1,
    'Who responded reflects who was asked in the past.|||Ai đã phản hồi phản ánh ai đã được hỏi trong quá khứ.'),
  Q('q7', 'Removing the "gender" column guarantees a fair model.|||Bỏ cột "giới tính" đảm bảo mô hình công bằng.',
    ['True|||Đúng', 'False — proxy variables can carry the same information|||Sai — biến đại diện có thể mang cùng thông tin', 'True if accuracy is high|||Đúng nếu accuracy cao', 'True for logistic regression only|||Chỉ đúng với hồi quy logistic'], 1,
    'First names, products or shopping patterns can act as proxies.|||Tên riêng, sản phẩm hay thói quen mua sắm có thể đóng vai biến đại diện.'),
  Q('q8', 'Selection rates: group X 40%, group Y 24%. The lowest/highest ratio is|||Tỷ lệ được chọn: nhóm X 40%, nhóm Y 24%. Tỷ số thấp nhất/cao nhất là',
    ['0.16|||0,16', '0.6|||0,6', '1.67|||1,67', '0.24|||0,24'], 1,
    '0.24 ÷ 0.40 = 0.6 — a signal to investigate, not an automatic verdict.|||0,24 ÷ 0,40 = 0,6 — tín hiệu để điều tra, không phải phán quyết tự động.'),
  Q('q9', 'Emails replaced by a salted hash that the company can re-link are|||Email được thay bằng giá trị băm có muối mà công ty nối lại được là',
    ['anonymous data, no longer personal|||dữ liệu ẩn danh, không còn là dữ liệu cá nhân', 'pseudonymised data, still personal data|||dữ liệu giả danh hoá, vẫn là dữ liệu cá nhân', 'public data|||dữ liệu công khai', 'sensitive data by definition|||dữ liệu nhạy cảm theo định nghĩa'], 1,
    'Re-identification is possible, so protections still apply.|||Vẫn có thể tái nhận dạng, nên các biện pháp bảo vệ vẫn áp dụng.'),
  Q('q10', 'A released table has k = 1. This means|||Một bảng công bố có k = 1. Nghĩa là',
    ['at least one combination of quasi-identifiers matches a single person|||có ít nhất một tổ hợp định danh gián tiếp chỉ khớp với một người', 'every row is unique by ID|||mọi dòng là duy nhất theo mã', 'the table is perfectly anonymous|||bảng hoàn toàn ẩn danh', 'there is one column|||chỉ có một cột'], 0,
    'Generalise or aggregate until every group has at least k people.|||Tổng quát hoá hoặc tổng hợp đến khi mọi nhóm có ít nhất k người.'),
]);

const ch12 = {
  title: 'Chapter 12 — Privacy, ethics and bias in data-driven communication|||Chương 12 — Quyền riêng tư, đạo đức và thiên lệch trong truyền thông dựa trên dữ liệu',
  description: 'Luật Bảo vệ dữ liệu cá nhân 2025 (số 91/2025/QH15) và các nguyên tắc GDPR áp vào marketing (sự đồng ý, mục đích, tối thiểu hoá, cấm mua bán dữ liệu, quảng cáo theo hành vi); thiên lệch trong dữ liệu và mô hình, đo tỷ lệ chọn theo nhóm; ẩn danh/giả danh hoá bằng băm có muối và k-ẩn danh; bảng kiểm AI có trách nhiệm cho đội truyền thông.',
  lessons: [l12_1, l12_2, l12_3, q12],
};

// ───────────────────────────── Xuất ─────────────────────────────
export default [ch0, ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9, ch10, ch11, ch12];
