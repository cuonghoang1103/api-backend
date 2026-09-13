/**
 * ABA201c — AI and Big Data Analytics for Communications (AI & Phân tích dữ
 * liệu lớn cho Truyền thông), khối Công nghệ Truyền thông FPTU, Kỳ 3.
 * Môn ỨNG DỤNG AI + Big Data vào truyền thông/marketing (không phải ML kỹ
 * thuật sâu). Nguồn chuẩn: Provost & Fawcett "Data Science for Business";
 * Sterne "Artificial Intelligence for Marketing"; Marr "Big Data in Practice";
 * Google Analytics Academy; Kaggle Learn. Song ngữ + ví dụ ứng dụng thật.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; & → &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('aba201c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn quốc tế, khoá học miễn phí, công cụ, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">ABA201c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to apply <strong>AI &amp; big data</strong> to communications and marketing — data pipelines, analytics, machine learning, NLP, generative AI, personalization and data ethics — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ABA201c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://data-science-for-biz.com/" target="_blank" rel="noopener"><em>Data Science for Business</em> — Provost &amp; Fawcett</a> (the mental models: what data science is good for)</li>
<li><a href="https://www.bernardmarr.com/" target="_blank" rel="noopener"><em>Big Data in Practice</em> — Bernard Marr</a> (45 real company case studies)</li>
<li><a href="https://www.targeting.com/" target="_blank" rel="noopener"><em>Artificial Intelligence for Marketing</em> — Jim Sterne</a> (AI applied to the marketing funnel)</li>
</ul>
<h3>🌐 Free courses &amp; documentation</h3>
<ul>
<li><a href="https://analytics.google.com/analytics/academy/" target="_blank" rel="noopener">Google Analytics Academy</a> — free official GA4 courses</li>
<li><a href="https://www.kaggle.com/learn" target="_blank" rel="noopener">Kaggle Learn</a> — hands-on micro-courses (Python, pandas, ML, NLP)</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://lookerstudio.google.com/" target="_blank" rel="noopener">Looker Studio</a> — free dashboards on top of your data</li>
<li><a href="https://public.tableau.com/" target="_blank" rel="noopener">Tableau Public</a> — visual analytics</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — run Python notebooks in the browser (pandas, scikit-learn)</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundations</strong> — what AI &amp; big data can do for communications, the 4Vs, where data comes from.</li>
<li><strong>Analyze</strong> — clean &amp; visualize communication data; build a dashboard and read the insight.</li>
<li><strong>Apply AI</strong> — segmentation, churn prediction, NLP sentiment &amp; social listening, generative AI, recommenders.</li>
<li><strong>Do it responsibly</strong> — check for bias, respect privacy (GDPR / NĐ13), keep humans accountable.</li>
</ol></div>`,
    `<span class="eyebrow">ABA201c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để ứng dụng <strong>AI &amp; dữ liệu lớn</strong> vào truyền thông và marketing — data pipeline, phân tích, học máy, NLP, AI tạo sinh, cá nhân hoá và đạo đức dữ liệu — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ABA201c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://data-science-for-biz.com/" target="_blank" rel="noopener"><em>Data Science for Business</em> — Provost &amp; Fawcett</a> (khung tư duy: khoa học dữ liệu giải quyết được gì)</li>
<li><a href="https://www.bernardmarr.com/" target="_blank" rel="noopener"><em>Big Data in Practice</em> — Bernard Marr</a> (45 case thật của doanh nghiệp)</li>
<li><a href="https://www.targeting.com/" target="_blank" rel="noopener"><em>Artificial Intelligence for Marketing</em> — Jim Sterne</a> (AI áp vào phễu marketing)</li>
</ul>
<h3>🌐 Khoá học &amp; tài liệu miễn phí</h3>
<ul>
<li><a href="https://analytics.google.com/analytics/academy/" target="_blank" rel="noopener">Google Analytics Academy</a> — khoá GA4 chính thức, miễn phí</li>
<li><a href="https://www.kaggle.com/learn" target="_blank" rel="noopener">Kaggle Learn</a> — micro-course thực hành (Python, pandas, ML, NLP)</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://lookerstudio.google.com/" target="_blank" rel="noopener">Looker Studio</a> — dashboard miễn phí trên dữ liệu của bạn</li>
<li><a href="https://public.tableau.com/" target="_blank" rel="noopener">Tableau Public</a> — phân tích trực quan</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — chạy notebook Python trên trình duyệt (pandas, scikit-learn)</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — AI &amp; big data làm được gì cho truyền thông, 4V, dữ liệu đến từ đâu.</li>
<li><strong>Phân tích</strong> — làm sạch &amp; trực quan hoá dữ liệu truyền thông; dựng dashboard và đọc ra insight.</li>
<li><strong>Ứng dụng AI</strong> — phân khúc, dự đoán churn, NLP sentiment &amp; social listening, AI tạo sinh, hệ khuyến nghị.</li>
<li><strong>Làm có trách nhiệm</strong> — soi thiên kiến, tôn trọng quyền riêng tư (GDPR / NĐ13), giữ con người chịu trách nhiệm.</li>
</ol></div>`,
  ]]);

const intro = doc('aba201c-0-1-overview', 'Course overview: AI & big data for communications|||Tổng quan: AI & dữ liệu lớn cho truyền thông',
  'Môn học làm gì; vì sao truyền thông ngày nay là data-driven; lộ trình 8 chương: từ khái niệm & hạ tầng dữ liệu → phân tích & học máy → NLP & AI tạo sinh → cá nhân hoá & đạo đức dữ liệu.',
  [[
    `<span class="eyebrow">ABA201c · Lesson 0.1 · Overview</span>
<h2>AI &amp; Big Data Analytics for Communications</h2>
<p class="lead">This course is about <strong>using</strong> AI and big data to make communication and marketing decisions — not about building models from scratch. Every campaign, post, ad and customer interaction now leaves a data trail; the winners are the teams who can turn that trail into <strong>insight and action</strong>.</p>
<h3>Why communications went data-driven</h3>
<ul>
<li><strong>Measure, don't guess</strong> — you can see exactly which message, audience and channel worked.</li>
<li><strong>Scale</strong> — millions of interactions per day are impossible to read by hand; AI summarizes and flags what matters.</li>
<li><strong>Personalize</strong> — the same brand can speak differently to each person, in real time.</li>
</ul>
<h3>Roadmap (8 chapters)</h3>
<p>Concepts &amp; the 4Vs → data sources &amp; pipelines → descriptive analytics &amp; dashboards → machine learning for marketing → NLP (sentiment, social listening) → generative AI → personalization &amp; recommenders → ethics, bias &amp; data governance. Bilingual, with real cases and a quiz per chapter.</p>
<div class="callout"><span class="badge">The through-line</span> Data → insight → decision → measured result → better data. This loop is the whole subject.</div>`,
    `<span class="eyebrow">ABA201c · Bài 0.1 · Tổng quan</span>
<h2>AI &amp; Phân tích dữ liệu lớn cho Truyền thông</h2>
<p class="lead">Môn này nói về việc <strong>dùng</strong> AI và dữ liệu lớn để ra quyết định truyền thông, marketing — không phải xây mô hình từ đầu. Mỗi chiến dịch, bài đăng, quảng cáo và tương tác khách hàng đều để lại dấu vết dữ liệu; đội thắng là đội biến dấu vết đó thành <strong>insight và hành động</strong>.</p>
<h3>Vì sao truyền thông thành data-driven</h3>
<ul>
<li><strong>Đo, đừng đoán</strong> — thấy chính xác thông điệp, tệp khán giả và kênh nào hiệu quả.</li>
<li><strong>Quy mô</strong> — hàng triệu tương tác mỗi ngày không thể đọc tay; AI tóm tắt và nêu bật cái quan trọng.</li>
<li><strong>Cá nhân hoá</strong> — cùng một thương hiệu nói khác nhau với từng người, theo thời gian thực.</li>
</ul>
<h3>Lộ trình (8 chương)</h3>
<p>Khái niệm &amp; 4V → nguồn &amp; hạ tầng dữ liệu → phân tích mô tả &amp; dashboard → học máy cho marketing → NLP (sentiment, social listening) → AI tạo sinh → cá nhân hoá &amp; hệ khuyến nghị → đạo đức, thiên kiến &amp; quản trị dữ liệu. Song ngữ, có case thật và quiz mỗi chương.</p>
<div class="callout"><span class="badge">Sợi chỉ xuyên suốt</span> Dữ liệu → insight → quyết định → kết quả đo được → dữ liệu tốt hơn. Vòng lặp này chính là cả môn học.</div>`,
  ]]);

const c1 = doc('aba201c-1-1-what-is', '1.1 — What AI & big data mean for communications|||1.1 — AI & big data cho truyền thông là gì',
  'Định nghĩa AI, big data, analytics; vì sao data-driven; 4V của big data (Volume, Velocity, Variety, Veracity) qua ví dụ dữ liệu truyền thông.',
  [[
    `<span class="eyebrow">ABA201c · Chapter 1 · Lesson 1.1</span>
<h2>What AI &amp; big data mean for communications</h2>
<h3>Three words, defined</h3>
<ul>
<li><strong>Analytics</strong> — turning raw data into answers to a question ("which post drove the most sign-ups?").</li>
<li><strong>Big data</strong> — datasets too large, fast or messy for a spreadsheet; needs special storage &amp; processing.</li>
<li><strong>AI / machine learning</strong> — software that learns patterns from data instead of being explicitly programmed.</li>
</ul>
<h3>The 4Vs of big data</h3>
<pre><code>Volume    -> HOW MUCH:  10M comments across FB/TikTok in a week
Velocity  -> HOW FAST:  live stream of reactions during a launch
Variety   -> WHAT KIND: text, images, video, likes, location, clicks
Veracity  -> HOW TRUE:  bots, spam, sarcasm, missing fields
</code></pre>
<p>A brand's social feed hits all four at once — which is exactly why you need AI, not a human intern, to make sense of it.</p>
<div class="callout"><span class="badge">Real example</span> Netflix does not guess what to recommend — it learns from billions of "played / paused / abandoned" events. Same idea, applied to a brand's audience, is this whole course.</div>`,
    `<span class="eyebrow">ABA201c · Chương 1 · Bài 1.1</span>
<h2>AI &amp; big data cho truyền thông là gì</h2>
<h3>Ba từ khoá, định nghĩa</h3>
<ul>
<li><strong>Analytics (phân tích)</strong> — biến dữ liệu thô thành câu trả lời cho một câu hỏi ("bài nào kéo đăng ký nhiều nhất?").</li>
<li><strong>Big data (dữ liệu lớn)</strong> — tập dữ liệu quá lớn, quá nhanh hoặc quá lộn xộn với bảng tính; cần lưu trữ &amp; xử lý riêng.</li>
<li><strong>AI / học máy</strong> — phần mềm học quy luật từ dữ liệu thay vì được lập trình tường minh.</li>
</ul>
<h3>4V của big data</h3>
<pre><code>Volume    -> BAO NHIÊU: 10 triệu bình luận FB/TikTok trong một tuần
Velocity  -> NHANH CỠ NÀO: dòng phản ứng trực tiếp lúc ra mắt
Variety   -> LOẠI GÌ:   chữ, ảnh, video, like, vị trí, click
Veracity  -> ĐÚNG CỠ NÀO: bot, spam, mỉa mai, thiếu trường
</code></pre>
<p>Feed mạng xã hội của một thương hiệu dính cả bốn cùng lúc — đó chính là lý do cần AI, không phải một thực tập sinh, để hiểu nó.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Netflix không đoán nên gợi ý gì — nó học từ hàng tỉ sự kiện "đã xem / tạm dừng / bỏ giữa chừng". Cùng ý tưởng đó, áp vào khán giả của một thương hiệu, chính là cả môn học này.</div>`,
  ]]);

const c1q = quiz('aba201c-quiz-1', 'Quiz 1 — Concepts & the 4Vs|||Quiz 1 — Khái niệm & 4V', [
  { id: 'q1', question: '"Veracity" trong 4V của big data nói về?', options: ['Dữ liệu nhiều cỡ nào', 'Dữ liệu đáng tin / đúng cỡ nào (bot, spam, thiếu)', 'Dữ liệu đến nhanh cỡ nào', 'Có bao nhiêu loại dữ liệu'], correctIndex: 1, explanation: 'Veracity = độ tin cậy/độ đúng của dữ liệu (bot, spam, sai, thiếu).' },
  { id: 'q2', question: 'Điểm khác cốt lõi của học máy so với lập trình thường?', options: ['Chạy nhanh hơn', 'Học quy luật TỪ dữ liệu thay vì được lập trình tường minh', 'Không cần dữ liệu', 'Chỉ dùng cho ảnh'], correctIndex: 1, explanation: 'ML học pattern từ dữ liệu; không viết luật tay cho từng trường hợp.' },
  { id: 'q3', question: 'Feed mạng xã hội gồm chữ, ảnh, video, like, vị trí — đây là chữ V nào?', options: ['Volume', 'Velocity', 'Variety', 'Value'], correctIndex: 2, explanation: 'Variety = nhiều LOẠI dữ liệu khác nhau.' },
]);

const c2 = doc('aba201c-2-1-data-sources', '2.1 — Data sources & infrastructure|||2.1 — Nguồn & hạ tầng dữ liệu',
  'Nguồn dữ liệu truyền thông/xã hội (API, web/social, CRM, GA4); data pipeline; data lake vs data warehouse; ETL cơ bản (Extract–Transform–Load).',
  [[
    `<span class="eyebrow">ABA201c · Chapter 2 · Lesson 2.1</span>
<h2>Data sources &amp; infrastructure</h2>
<h3>Where communication data comes from</h3>
<ul>
<li><strong>Social APIs</strong> — Facebook/Instagram Graph, TikTok, YouTube Data API: posts, comments, reach.</li>
<li><strong>Web &amp; app analytics</strong> — Google Analytics 4 (GA4): page views, events, conversions.</li>
<li><strong>CRM &amp; ads</strong> — customer records, email opens, ad spend &amp; results.</li>
</ul>
<h3>From raw to usable: the pipeline</h3>
<pre><code>ETL = Extract -> Transform -> Load
  Extract   pull comments from the TikTok API
  Transform clean text, drop bots, add a date column
  Load      write tidy rows into the warehouse
</code></pre>
<h3>Lake vs warehouse</h3>
<ul>
<li><strong>Data lake</strong> — keeps everything raw (JSON, video, logs), cheap, "figure out later".</li>
<li><strong>Data warehouse</strong> — structured, cleaned tables ready for dashboards &amp; SQL (e.g. BigQuery).</li>
</ul>
<div class="callout"><span class="badge">Rule of thumb</span> Land raw data in the <strong>lake</strong>, model the clean, query-ready version in the <strong>warehouse</strong>. Garbage in, garbage out — the transform step is where quality is won or lost.</div>`,
    `<span class="eyebrow">ABA201c · Chương 2 · Bài 2.1</span>
<h2>Nguồn &amp; hạ tầng dữ liệu</h2>
<h3>Dữ liệu truyền thông đến từ đâu</h3>
<ul>
<li><strong>API mạng xã hội</strong> — Facebook/Instagram Graph, TikTok, YouTube Data API: bài đăng, bình luận, tiếp cận.</li>
<li><strong>Analytics web &amp; app</strong> — Google Analytics 4 (GA4): lượt xem, sự kiện, chuyển đổi.</li>
<li><strong>CRM &amp; quảng cáo</strong> — hồ sơ khách hàng, lượt mở email, chi phí &amp; kết quả quảng cáo.</li>
</ul>
<h3>Từ thô đến dùng được: pipeline</h3>
<pre><code>ETL = Extract -> Transform -> Load
  Extract   kéo bình luận từ API TikTok
  Transform làm sạch chữ, loại bot, thêm cột ngày
  Load      ghi các dòng gọn gàng vào warehouse
</code></pre>
<h3>Lake vs warehouse</h3>
<ul>
<li><strong>Data lake (hồ dữ liệu)</strong> — giữ tất cả ở dạng thô (JSON, video, log), rẻ, "tính sau".</li>
<li><strong>Data warehouse (kho dữ liệu)</strong> — bảng đã cấu trúc, làm sạch, sẵn cho dashboard &amp; SQL (vd BigQuery).</li>
</ul>
<div class="callout"><span class="badge">Nguyên tắc</span> Đổ dữ liệu thô vào <strong>lake</strong>, dựng bản sạch sẵn-truy-vấn trong <strong>warehouse</strong>. Rác vào thì rác ra — bước transform là nơi được/mất chất lượng.</div>`,
  ]]);

const c2q = quiz('aba201c-quiz-2', 'Quiz 2 — Sources & pipeline|||Quiz 2 — Nguồn & pipeline', [
  { id: 'q1', question: 'ETL viết tắt của?', options: ['Explore–Test–Learn', 'Extract–Transform–Load', 'Edit–Track–Log', 'Export–Total–Link'], correctIndex: 1, explanation: 'ETL = Trích xuất → Biến đổi (làm sạch) → Nạp vào kho.' },
  { id: 'q2', question: 'Khác biệt chính giữa data lake và data warehouse?', options: ['Lake giữ dữ liệu THÔ đủ loại; warehouse giữ bảng đã LÀM SẠCH, cấu trúc', 'Lake đắt hơn warehouse', 'Warehouse chỉ chứa ảnh', 'Không có khác biệt'], correctIndex: 0, explanation: 'Lake = thô/đa dạng/rẻ; warehouse = sạch/cấu trúc/sẵn truy vấn.' },
  { id: 'q3', question: 'Nguồn nào cho dữ liệu lượt xem, sự kiện, chuyển đổi trên web?', options: ['CRM', 'Google Analytics 4 (GA4)', 'Data lake', 'ETL'], correctIndex: 1, explanation: 'GA4 đo hành vi web/app: page view, event, conversion.' },
]);

const c3 = doc('aba201c-3-1-descriptive', '3.1 — Descriptive analytics & visualization|||3.1 — Phân tích mô tả & trực quan hoá',
  'Phân tích mô tả (đã xảy ra gì); KPI truyền thông (reach, engagement rate, CTR, conversion); dashboard; chọn biểu đồ đúng; rút insight từ dữ liệu lớn.',
  [[
    `<span class="eyebrow">ABA201c · Chapter 3 · Lesson 3.1</span>
<h2>Descriptive analytics &amp; visualization</h2>
<h3>Descriptive = "what happened?"</h3>
<p>The first, most-used layer of analytics simply summarizes the past clearly. Core communication KPIs:</p>
<ul>
<li><strong>Reach / impressions</strong> — how many people saw it.</li>
<li><strong>Engagement rate</strong> — interactions ÷ reach (are people reacting?).</li>
<li><strong>CTR</strong> — clicks ÷ impressions (did it pull action?).</li>
<li><strong>Conversion rate</strong> — desired actions ÷ visitors (did it pay off?).</li>
</ul>
<h3>Pick the right chart</h3>
<pre><code>Trend over time   -> line chart   (followers per week)
Compare groups    -> bar chart    (engagement by platform)
Part of a whole   -> stacked bar  (traffic by source)
Relationship      -> scatter plot (spend vs conversions)
</code></pre>
<h3>Dashboard, not a data dump</h3>
<p>A good dashboard (Looker Studio, Tableau) answers a question at a glance and leads to a decision. The skill is turning "engagement dropped 12% on Tuesday" into <strong>"our 8pm video underperformed — reschedule to 12pm"</strong>.</p>
<div class="callout"><span class="badge">Insight ≠ number</span> A number describes; an insight recommends. Always finish the sentence: "…so we should ____."</div>`,
    `<span class="eyebrow">ABA201c · Chương 3 · Bài 3.1</span>
<h2>Phân tích mô tả &amp; trực quan hoá</h2>
<h3>Mô tả = "đã xảy ra gì?"</h3>
<p>Tầng phân tích đầu tiên, dùng nhiều nhất, chỉ đơn giản tóm tắt quá khứ cho rõ. KPI truyền thông cốt lõi:</p>
<ul>
<li><strong>Reach / hiển thị</strong> — bao nhiêu người thấy.</li>
<li><strong>Tỉ lệ tương tác (engagement rate)</strong> — tương tác ÷ reach (người ta có phản ứng không?).</li>
<li><strong>CTR</strong> — click ÷ hiển thị (có kéo hành động không?).</li>
<li><strong>Tỉ lệ chuyển đổi</strong> — hành động mong muốn ÷ khách (có sinh lời không?).</li>
</ul>
<h3>Chọn đúng biểu đồ</h3>
<pre><code>Xu hướng theo thời gian -> biểu đồ đường (follower mỗi tuần)
So sánh nhóm            -> biểu đồ cột   (tương tác theo nền tảng)
Phần trong tổng thể     -> cột chồng     (traffic theo nguồn)
Quan hệ                 -> scatter       (chi phí vs chuyển đổi)
</code></pre>
<h3>Dashboard, không phải bãi số liệu</h3>
<p>Một dashboard tốt (Looker Studio, Tableau) trả lời một câu hỏi trong một cái liếc và dẫn tới quyết định. Kỹ năng là biến "tương tác giảm 12% hôm thứ Ba" thành <strong>"video 20h kém hiệu quả — dời sang 12h trưa"</strong>.</p>
<div class="callout"><span class="badge">Insight ≠ con số</span> Con số mô tả; insight đề xuất. Luôn hoàn thành câu: "…nên chúng ta cần ____."</div>`,
  ]]);

const c3q = quiz('aba201c-quiz-3', 'Quiz 3 — Descriptive & dashboards|||Quiz 3 — Mô tả & dashboard', [
  { id: 'q1', question: 'Engagement rate được tính thế nào?', options: ['Click ÷ hiển thị', 'Tương tác ÷ reach', 'Chuyển đổi ÷ chi phí', 'Follower ÷ tuần'], correctIndex: 1, explanation: 'Engagement rate = số tương tác chia cho reach.' },
  { id: 'q2', question: 'Muốn thể hiện XU HƯỚNG follower theo thời gian, chọn biểu đồ nào?', options: ['Biểu đồ tròn', 'Biểu đồ đường (line)', 'Scatter', 'Bảng số'], correctIndex: 1, explanation: 'Line chart hợp nhất cho dữ liệu theo thời gian.' },
  { id: 'q3', question: 'Khác biệt giữa "con số" và "insight" là?', options: ['Không khác gì', 'Con số MÔ TẢ, insight ĐỀ XUẤT hành động', 'Insight luôn nhỏ hơn', 'Con số chỉ có trên dashboard'], correctIndex: 1, explanation: 'Insight dẫn tới quyết định: "…nên chúng ta cần làm gì".' },
]);

const c4 = doc('aba201c-4-1-ml-marketing', '4.1 — Machine learning for marketing (concepts)|||4.1 — Học máy cho marketing (khái niệm)',
  'Ba nhóm bài toán ML: phân loại (churn), hồi quy (dự đoán doanh thu/CLV), phân cụm (phân khúc khách hàng); train/test; ứng dụng marketing thực tế.',
  [[
    `<span class="eyebrow">ABA201c · Chapter 4 · Lesson 4.1</span>
<h2>Machine learning for marketing (concept level)</h2>
<h3>Three problem types you'll actually use</h3>
<ul>
<li><strong>Classification</strong> — predict a label. "Will this customer churn: yes/no?" "Is this lead hot or cold?"</li>
<li><strong>Regression</strong> — predict a number. "How much will this customer spend (CLV)?" "Expected reach of this post?"</li>
<li><strong>Clustering</strong> — group similar customers with no labels given → <strong>segmentation</strong> (e.g. "budget deal-hunters" vs "premium loyalists").</li>
</ul>
<h3>How a model is judged</h3>
<pre><code>Split data:  train (learn)  |  test (grade on unseen rows)
Classification metric: accuracy, precision, recall
Regression metric:     error (how far off the number is)
</code></pre>
<p>Never grade a model on data it trained on — that is like giving the exam answers in advance.</p>
<h3>Marketing payoff</h3>
<p><strong>Churn prediction</strong> flags customers about to leave so you can win them back <em>before</em> they go. <strong>Segmentation</strong> lets one budget speak to five audiences. <strong>CLV</strong> tells you which customers deserve the most attention.</p>
<div class="callout"><span class="badge">You don't build it from scratch</span> This is a communications course: you frame the problem (classification? clustering?), pick the target, and read the result — the heavy math is the tool, not the job.</div>`,
    `<span class="eyebrow">ABA201c · Chương 4 · Bài 4.1</span>
<h2>Học máy cho marketing (mức khái niệm)</h2>
<h3>Ba loại bài toán bạn sẽ thật sự dùng</h3>
<ul>
<li><strong>Phân loại (classification)</strong> — đoán một nhãn. "Khách này có rời bỏ (churn) không: có/không?" "Lead nóng hay nguội?"</li>
<li><strong>Hồi quy (regression)</strong> — đoán một con số. "Khách này sẽ chi bao nhiêu (CLV)?" "Reach dự kiến của bài này?"</li>
<li><strong>Phân cụm (clustering)</strong> — gom khách giống nhau khi không có nhãn → <strong>phân khúc</strong> (vd "săn deo giá rẻ" vs "trung thành cao cấp").</li>
</ul>
<h3>Chấm điểm mô hình thế nào</h3>
<pre><code>Chia dữ liệu: train (học)  |  test (chấm trên dòng chưa thấy)
Phân loại: accuracy, precision, recall
Hồi quy:   sai số (con số đoán lệch bao xa)
</code></pre>
<p>Đừng bao giờ chấm mô hình trên chính dữ liệu nó học — như phát đáp án trước khi thi.</p>
<h3>Lợi ích marketing</h3>
<p><strong>Dự đoán churn</strong> nêu tên khách sắp rời để giữ chân <em>trước</em> khi họ đi. <strong>Phân khúc</strong> giúp một ngân sách nói với năm tệp khán giả. <strong>CLV</strong> cho biết khách nào đáng đầu tư nhất.</p>
<div class="callout"><span class="badge">Bạn không xây từ số 0</span> Đây là môn truyền thông: bạn đóng khung bài toán (phân loại? phân cụm?), chọn mục tiêu, đọc kết quả — toán nặng là công cụ, không phải việc chính.</div>`,
  ]]);

const c4q = quiz('aba201c-quiz-4', 'Quiz 4 — ML for marketing|||Quiz 4 — Học máy cho marketing', [
  { id: 'q1', question: 'Dự đoán "khách này sẽ rời bỏ hay không" thuộc loại bài toán ML nào?', options: ['Hồi quy', 'Phân loại (classification)', 'Phân cụm', 'Trực quan hoá'], correctIndex: 1, explanation: 'Churn yes/no là nhãn → bài toán phân loại.' },
  { id: 'q2', question: 'Gom khách giống nhau thành nhóm KHÔNG có nhãn cho trước (phân khúc) là?', options: ['Phân cụm (clustering)', 'Hồi quy', 'Phân loại', 'ETL'], correctIndex: 0, explanation: 'Clustering tự nhóm dữ liệu tương tự → segmentation.' },
  { id: 'q3', question: 'Vì sao phải chấm mô hình trên tập TEST chứ không phải tập train?', options: ['Cho nhanh hơn', 'Để đánh giá trên dữ liệu CHƯA THẤY, tránh "học vẹt"', 'Vì test lớn hơn', 'Không cần thiết'], correctIndex: 1, explanation: 'Chấm trên dữ liệu chưa thấy mới đo được khả năng tổng quát.' },
]);

const c5 = doc('aba201c-5-1-nlp', '5.1 — Natural language processing|||5.1 — Xử lý ngôn ngữ tự nhiên',
  'NLP cho truyền thông: phân tích cảm xúc (sentiment), mô hình chủ đề (topic modeling), social listening tự động; thách thức tiếng Việt (dấu, từ ghép, mỉa mai).',
  [[
    `<span class="eyebrow">ABA201c · Chapter 5 · Lesson 5.1</span>
<h2>Natural language processing (NLP)</h2>
<h3>Teaching machines to read comments</h3>
<ul>
<li><strong>Sentiment analysis</strong> — is a comment positive, negative or neutral? Track brand mood at scale.</li>
<li><strong>Topic modeling</strong> — group thousands of posts into themes ("price", "shipping", "customer service") automatically.</li>
<li><strong>Social listening</strong> — monitor mentions across platforms in real time; get alerted when negativity spikes.</li>
</ul>
<h3>A modern shortcut: ask an LLM</h3>
<pre><code>Classify the sentiment of each review as
positive / negative / neutral, and give the main topic.

"Giao hàng nhanh nhưng đóng gói móp" ->
   sentiment: mixed   topic: shipping / packaging
</code></pre>
<h3>Vietnamese is harder than English</h3>
<ul>
<li><strong>Word segmentation</strong> — "học sinh" is one word, not two; spaces don't mark word boundaries.</li>
<li><strong>Diacritics</strong> — users drop accents ("cam on" = "cảm ơn"); models must cope.</li>
<li><strong>Sarcasm &amp; slang</strong> — "đỉnh của chóp" is praise; "cũng được" can be a polite complaint.</li>
</ul>
<div class="callout"><span class="badge">Real use</span> A brand watches 50,000 comments during a launch. NLP flags the 200 angry ones about a bug so the team fixes it in hours, not weeks.</div>`,
    `<span class="eyebrow">ABA201c · Chương 5 · Bài 5.1</span>
<h2>Xử lý ngôn ngữ tự nhiên (NLP)</h2>
<h3>Dạy máy "đọc" bình luận</h3>
<ul>
<li><strong>Phân tích cảm xúc (sentiment)</strong> — bình luận tích cực, tiêu cực hay trung tính? Đo tâm trạng thương hiệu ở quy mô lớn.</li>
<li><strong>Mô hình chủ đề (topic modeling)</strong> — tự động gom hàng nghìn bài thành chủ đề ("giá", "giao hàng", "chăm sóc khách").</li>
<li><strong>Social listening</strong> — theo dõi lượt nhắc trên các nền tảng theo thời gian thực; cảnh báo khi tiêu cực tăng vọt.</li>
</ul>
<h3>Lối tắt hiện đại: nhờ LLM</h3>
<pre><code>Phân loại cảm xúc mỗi đánh giá là
tích cực / tiêu cực / trung tính, và nêu chủ đề chính.

"Giao hàng nhanh nhưng đóng gói móp" ->
   cảm xúc: pha trộn   chủ đề: giao hàng / đóng gói
</code></pre>
<h3>Tiếng Việt khó hơn tiếng Anh</h3>
<ul>
<li><strong>Tách từ</strong> — "học sinh" là MỘT từ, không phải hai; dấu cách không đánh dấu ranh giới từ.</li>
<li><strong>Dấu thanh</strong> — người dùng bỏ dấu ("cam on" = "cảm ơn"); mô hình phải chịu được.</li>
<li><strong>Mỉa mai &amp; tiếng lóng</strong> — "đỉnh của chóp" là khen; "cũng được" có thể là chê lịch sự.</li>
</ul>
<div class="callout"><span class="badge">Dùng thật</span> Thương hiệu theo dõi 50.000 bình luận lúc ra mắt. NLP nêu 200 bình luận giận dữ về một lỗi để đội xử lý trong vài giờ, thay vì vài tuần.</div>`,
  ]]);

const c5q = quiz('aba201c-quiz-5', 'Quiz 5 — NLP|||Quiz 5 — NLP', [
  { id: 'q1', question: 'Xác định một bình luận là tích cực/tiêu cực/trung tính gọi là?', options: ['Topic modeling', 'Phân tích cảm xúc (sentiment analysis)', 'Phân cụm', 'ETL'], correctIndex: 1, explanation: 'Sentiment analysis đánh giá sắc thái cảm xúc của văn bản.' },
  { id: 'q2', question: 'Vì sao NLP tiếng Việt khó hơn tiếng Anh về "tách từ"?', options: ['Tiếng Việt không có chữ', 'Dấu cách KHÔNG đánh dấu ranh giới từ ("học sinh" là một từ)', 'Tiếng Việt viết hoa hết', 'Không có lý do'], correctIndex: 1, explanation: 'Từ ghép tiếng Việt gồm nhiều âm tiết cách nhau dấu cách → cần tách từ.' },
  { id: 'q3', question: 'Theo dõi lượt nhắc thương hiệu trên nhiều nền tảng theo thời gian thực gọi là?', options: ['Social listening', 'Data warehouse', 'A/B testing', 'Regression'], correctIndex: 0, explanation: 'Social listening giám sát mention và cảnh báo khi tiêu cực tăng.' },
]);

const c6 = doc('aba201c-6-1-generative', '6.1 — Generative AI in communications|||6.1 — AI tạo sinh trong truyền thông',
  'AI tạo sinh: viết nội dung, tạo ảnh/video, trợ lý AI; kỹ thuật prompt (vai trò, ngữ cảnh, ví dụ, ràng buộc); rủi ro (ảo giác, bản quyền) và vai trò con người.',
  [[
    `<span class="eyebrow">ABA201c · Chapter 6 · Lesson 6.1</span>
<h2>Generative AI in communications</h2>
<h3>What it can create</h3>
<ul>
<li><strong>Text</strong> — captions, ad copy, email drafts, first-draft articles, replies.</li>
<li><strong>Images</strong> — social visuals, mood boards, product mockups.</li>
<li><strong>Video &amp; audio</strong> — short clips, voiceovers, subtitles/dubbing.</li>
</ul>
<h3>Prompting well — the 4 ingredients</h3>
<pre><code>ROLE     You are a social media manager for a coffee brand.
CONTEXT  Audience: students, 18-24, Gen Z tone, Vietnamese.
TASK     Write 3 Instagram captions for a new cold brew.
LIMITS   Max 20 words each, 1 emoji, include a call to action.
</code></pre>
<p>Vague prompt → generic output. A precise role + context + constraints is the difference between "AI slop" and usable drafts.</p>
<h3>Keep a human in the loop</h3>
<ul>
<li><strong>Hallucination</strong> — generative AI can state confident falsehoods; verify facts &amp; numbers.</li>
<li><strong>Brand voice &amp; rights</strong> — check tone, and image/copyright before publishing.</li>
</ul>
<div class="callout"><span class="badge">10× drafting, not autopilot</span> Treat generative AI as a fast junior creative: it drafts, you edit, approve and take responsibility.</div>`,
    `<span class="eyebrow">ABA201c · Chương 6 · Bài 6.1</span>
<h2>AI tạo sinh trong truyền thông</h2>
<h3>Nó tạo được gì</h3>
<ul>
<li><strong>Văn bản</strong> — caption, lời quảng cáo, nháp email, bản thảo đầu bài viết, phản hồi.</li>
<li><strong>Hình ảnh</strong> — visual mạng xã hội, mood board, mockup sản phẩm.</li>
<li><strong>Video &amp; âm thanh</strong> — clip ngắn, voiceover, phụ đề/lồng tiếng.</li>
</ul>
<h3>Prompt tốt — 4 thành phần</h3>
<pre><code>VAI TRÒ  Bạn là quản lý mạng xã hội cho thương hiệu cà phê.
NGỮ CẢNH Khán giả: sinh viên 18-24, giọng Gen Z, tiếng Việt.
NHIỆM VỤ Viết 3 caption Instagram cho món cold brew mới.
RÀNG BUỘC Mỗi câu tối đa 20 từ, 1 emoji, có lời kêu gọi.
</code></pre>
<p>Prompt mơ hồ → kết quả chung chung. Vai trò + ngữ cảnh + ràng buộc rõ là khác biệt giữa "rác AI" và bản nháp dùng được.</p>
<h3>Giữ con người trong vòng lặp</h3>
<ul>
<li><strong>Ảo giác (hallucination)</strong> — AI tạo sinh có thể nói sai một cách tự tin; phải kiểm chứng dữ kiện &amp; con số.</li>
<li><strong>Giọng thương hiệu &amp; bản quyền</strong> — kiểm tông giọng, và bản quyền ảnh/lời trước khi đăng.</li>
</ul>
<div class="callout"><span class="badge">Nháp nhanh gấp 10, không phải tự lái</span> Coi AI tạo sinh như một creative junior nhanh: nó nháp, bạn sửa, duyệt và chịu trách nhiệm.</div>`,
  ]]);

const c6q = quiz('aba201c-quiz-6', 'Quiz 6 — Generative AI|||Quiz 6 — AI tạo sinh', [
  { id: 'q1', question: '"Hallucination" của AI tạo sinh nghĩa là?', options: ['AI chạy chậm', 'AI nói sai/bịa một cách tự tin, cần kiểm chứng', 'AI chỉ tạo ảnh', 'AI hết token'], correctIndex: 1, explanation: 'Ảo giác = AI khẳng định thông tin sai nghe rất chắc chắn.' },
  { id: 'q2', question: 'Thành phần nào KHÔNG thuộc một prompt tốt?', options: ['Vai trò', 'Ngữ cảnh & ràng buộc', 'Nhiệm vụ rõ ràng', 'Tên thật của người dùng'], correctIndex: 3, explanation: 'Prompt tốt cần vai trò, ngữ cảnh, nhiệm vụ, ràng buộc — không cần thông tin cá nhân.' },
  { id: 'q3', question: 'Cách dùng AI tạo sinh có trách nhiệm trong truyền thông?', options: ['Đăng thẳng không đọc lại', 'Coi là bản nháp — con người sửa, duyệt, chịu trách nhiệm', 'Bỏ hết biên tập viên', 'Không kiểm bản quyền'], correctIndex: 1, explanation: 'Giữ human-in-the-loop: AI nháp, người kiểm chứng và duyệt.' },
]);

const c7 = doc('aba201c-7-1-personalization', '7.1 — Personalization & recommender systems|||7.1 — Cá nhân hoá & hệ khuyến nghị',
  'Hệ khuyến nghị (content-based, collaborative filtering); targeting & phân phối nội dung; cá nhân hoá thời gian thực; đo bằng A/B testing; bẫy filter bubble.',
  [[
    `<span class="eyebrow">ABA201c · Chapter 7 · Lesson 7.1</span>
<h2>Personalization &amp; recommender systems</h2>
<h3>Two ways to recommend</h3>
<ul>
<li><strong>Content-based</strong> — "you liked this, here's something similar" (matches item features).</li>
<li><strong>Collaborative filtering</strong> — "people like you also liked…" (matches similar users' behaviour).</li>
</ul>
<h3>Personalization in communications</h3>
<ul>
<li><strong>Targeting</strong> — show the right ad/message to the right segment.</li>
<li><strong>Real-time</strong> — the homepage, email, or feed reorders itself based on what you just did.</li>
<li><strong>Dynamic content</strong> — one email template, personalized product, name and offer per recipient.</li>
</ul>
<h3>Prove it works: A/B test</h3>
<pre><code>Group A -> generic banner
Group B -> personalized banner
Compare conversion rate -> keep the winner
</code></pre>
<div class="callout"><span class="badge">Watch the downside</span> Over-personalization creates <strong>filter bubbles</strong> — people only see more of the same, and creepy over-targeting erodes trust. Personalize to help, not to stalk.</div>`,
    `<span class="eyebrow">ABA201c · Chương 7 · Bài 7.1</span>
<h2>Cá nhân hoá &amp; hệ khuyến nghị</h2>
<h3>Hai cách khuyến nghị</h3>
<ul>
<li><strong>Content-based</strong> — "bạn thích cái này, đây là thứ tương tự" (khớp đặc trưng sản phẩm).</li>
<li><strong>Collaborative filtering (lọc cộng tác)</strong> — "người giống bạn cũng thích…" (khớp hành vi người dùng tương tự).</li>
</ul>
<h3>Cá nhân hoá trong truyền thông</h3>
<ul>
<li><strong>Targeting</strong> — đưa đúng quảng cáo/thông điệp tới đúng phân khúc.</li>
<li><strong>Thời gian thực</strong> — trang chủ, email, feed tự sắp lại theo việc bạn vừa làm.</li>
<li><strong>Nội dung động</strong> — một mẫu email, cá nhân hoá sản phẩm, tên và ưu đãi cho từng người.</li>
</ul>
<h3>Chứng minh hiệu quả: A/B test</h3>
<pre><code>Nhóm A -> banner chung
Nhóm B -> banner cá nhân hoá
So tỉ lệ chuyển đổi -> giữ bản thắng
</code></pre>
<div class="callout"><span class="badge">Coi chừng mặt trái</span> Cá nhân hoá quá đà tạo <strong>filter bubble</strong> — người ta chỉ thấy thêm thứ giống cũ, và targeting quá lố làm mất niềm tin. Cá nhân hoá để giúp, không phải để bám theo.</div>`,
  ]]);

const c7q = quiz('aba201c-quiz-7', 'Quiz 7 — Personalization|||Quiz 7 — Cá nhân hoá', [
  { id: 'q1', question: '"Người giống bạn cũng thích…" là kiểu khuyến nghị nào?', options: ['Content-based', 'Collaborative filtering (lọc cộng tác)', 'ETL', 'Sentiment'], correctIndex: 1, explanation: 'Collaborative filtering dựa trên hành vi của người dùng tương tự.' },
  { id: 'q2', question: 'Cách đúng để CHỨNG MINH banner cá nhân hoá hiệu quả hơn?', options: ['Hỏi sếp', 'A/B test: so tỉ lệ chuyển đổi nhóm A vs B', 'Đếm like', 'Nhìn dashboard một ngày'], correctIndex: 1, explanation: 'A/B test so hai nhóm để đo tác động thật của thay đổi.' },
  { id: 'q3', question: 'Mặt trái của cá nhân hoá quá đà là?', options: ['Tăng doanh thu', 'Filter bubble & mất niềm tin do targeting quá lố', 'Dữ liệu sạch hơn', 'Không có mặt trái'], correctIndex: 1, explanation: 'Cá nhân hoá quá mức tạo bong bóng lọc và cảm giác bị theo dõi.' },
]);

const c8 = doc('aba201c-8-1-ethics', '8.1 — Ethics, bias & data governance|||8.1 — Đạo đức, thiên kiến & quản trị dữ liệu',
  'Thiên kiến (bias) từ dữ liệu; quyền riêng tư & tuân thủ (GDPR, Nghị định 13/2023 của Việt Nam); AI giải thích được (explainability); minh bạch & trách nhiệm.',
  [[
    `<span class="eyebrow">ABA201c · Chapter 8 · Lesson 8.1</span>
<h2>Ethics, bias &amp; data governance</h2>
<h3>Bias in, bias out</h3>
<p>A model learns from history — including its unfairness. If past hiring or targeting favoured one group, the AI will quietly repeat it. Watch for skewed training data and test outcomes across groups.</p>
<h3>Privacy &amp; the law</h3>
<ul>
<li><strong>GDPR</strong> (EU) — consent, right to access &amp; be forgotten, purpose limitation.</li>
<li><strong>Nghị định 13/2023/NĐ-CP</strong> (Vietnam's Personal Data Protection Decree) — Vietnam's rules on collecting &amp; processing personal data: get consent, state the purpose, protect and don't over-collect.</li>
</ul>
<h3>Explainable &amp; accountable AI</h3>
<pre><code>Ask of any model in production:
  Can we EXPLAIN why it made this decision?
  Is there a HUMAN accountable for the outcome?
  Can a user APPEAL or correct it?
</code></pre>
<div class="callout"><span class="badge">The rule</span> "The algorithm did it" is never an excuse. Collect the minimum, get consent, check for bias, be transparent, keep a human responsible. Trust is the real asset a brand cannot afford to lose.</div>`,
    `<span class="eyebrow">ABA201c · Chương 8 · Bài 8.1</span>
<h2>Đạo đức, thiên kiến &amp; quản trị dữ liệu</h2>
<h3>Thiên kiến vào thì thiên kiến ra</h3>
<p>Mô hình học từ quá khứ — kể cả cái bất công của nó. Nếu tuyển dụng hay targeting xưa thiên vị một nhóm, AI sẽ âm thầm lặp lại. Coi chừng dữ liệu huấn luyện lệch và hãy kiểm kết quả trên từng nhóm.</p>
<h3>Quyền riêng tư &amp; luật</h3>
<ul>
<li><strong>GDPR</strong> (EU) — cần đồng ý, quyền truy cập &amp; được quên, giới hạn mục đích.</li>
<li><strong>Nghị định 13/2023/NĐ-CP</strong> (Bảo vệ dữ liệu cá nhân của Việt Nam) — quy định về thu thập &amp; xử lý dữ liệu cá nhân: xin đồng ý, nêu rõ mục đích, bảo vệ và không thu thập quá mức.</li>
</ul>
<h3>AI giải thích được &amp; có trách nhiệm</h3>
<pre><code>Với bất kỳ mô hình nào lên production, hãy hỏi:
  Có GIẢI THÍCH được vì sao nó ra quyết định này?
  Có CON NGƯỜI chịu trách nhiệm cho kết quả không?
  Người dùng có thể KHIẾU NẠI hoặc sửa lại không?
</code></pre>
<div class="callout"><span class="badge">Nguyên tắc</span> "Do thuật toán làm" không bao giờ là cái cớ. Thu tối thiểu, xin đồng ý, soi thiên kiến, minh bạch, giữ một con người chịu trách nhiệm. Niềm tin là tài sản thật mà thương hiệu không thể để mất.</div>`,
  ]]);

const c8q = quiz('aba201c-quiz-8', 'Quiz 8 — Ethics & governance|||Quiz 8 — Đạo đức & quản trị', [
  { id: 'q1', question: '"Bias in, bias out" cảnh báo điều gì?', options: ['Mô hình chạy chậm', 'Mô hình học lại sự bất công có sẵn trong dữ liệu quá khứ', 'Dữ liệu luôn sạch', 'AI không thiên kiến'], correctIndex: 1, explanation: 'Dữ liệu lịch sử mang định kiến → mô hình lặp lại định kiến đó.' },
  { id: 'q2', question: 'Ở Việt Nam, văn bản pháp lý nào quản việc thu thập & xử lý dữ liệu cá nhân?', options: ['GDPR', 'Nghị định 13/2023/NĐ-CP', 'ISO 9001', 'Luật giao thông'], correctIndex: 1, explanation: 'Nghị định 13/2023/NĐ-CP là quy định bảo vệ dữ liệu cá nhân của Việt Nam.' },
  { id: 'q3', question: 'Nguyên tắc cốt lõi khi AI ra quyết định ảnh hưởng người dùng?', options: ['"Thuật toán làm" là đủ lý do', 'Giải thích được + có con người chịu trách nhiệm + cho khiếu nại', 'Không cần đồng ý', 'Thu càng nhiều dữ liệu càng tốt'], correctIndex: 1, explanation: 'AI có trách nhiệm: explainable, accountable, cho phép khiếu nại; thu tối thiểu và xin đồng ý.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'ABA201c',
    slug: 'aba201c-ai-and-big-data-analytics-for-communications',
    title: 'AI and Big Data Analytics for Communications',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ABA201c.webp',
    shortDescription: 'Apply AI & big data to communications & marketing — the 4Vs, data pipelines, analytics & dashboards, ML for segmentation & churn, NLP & social listening, generative AI, recommenders, and data ethics (bias, GDPR/NĐ13). Bilingual, real cases & quizzes.|||Ứng dụng AI & dữ liệu lớn vào truyền thông & marketing — 4V, data pipeline, phân tích & dashboard, ML phân khúc & churn, NLP & social listening, AI tạo sinh, hệ khuyến nghị, đạo đức dữ liệu (bias, GDPR/NĐ13). Song ngữ, có case thật & quiz.',
    description: 'Môn <strong>ABA201c — AI and Big Data Analytics for Communications</strong> (khối Công nghệ Truyền thông, kỳ 3) dạy cách <strong>ứng dụng AI &amp; dữ liệu lớn</strong> vào truyền thông và marketing. Từ <strong>khái niệm &amp; 4V</strong> → <strong>nguồn &amp; hạ tầng dữ liệu</strong> (pipeline, data lake/warehouse, ETL) → <strong>phân tích mô tả &amp; dashboard</strong> → <strong>học máy cho marketing</strong> (phân khúc, dự đoán churn) → <strong>NLP</strong> (sentiment, social listening, tiếng Việt) → <strong>AI tạo sinh</strong> → <strong>cá nhân hoá &amp; hệ khuyến nghị</strong> → <strong>đạo đức, thiên kiến &amp; quản trị dữ liệu</strong> (bias, GDPR/NĐ13). Bám giáo trình chuẩn quốc tế (Provost &amp; Fawcett, Sterne, Marr), song ngữ, có ví dụ ứng dụng thật và quiz mỗi chương.',
    whatYouLearn: 'AI/big data/analytics là gì & 4V; nguồn dữ liệu truyền thông (API, GA4, CRM) & ETL, data lake vs warehouse; KPI (reach, engagement, CTR, conversion), chọn biểu đồ, dashboard & insight; ML cho marketing (phân loại/hồi quy/phân cụm, churn, CLV, segmentation); NLP (sentiment, topic modeling, social listening, tiếng Việt); AI tạo sinh & prompt; hệ khuyến nghị, targeting, A/B test; đạo đức, bias, quyền riêng tư (GDPR, NĐ13/2023) & AI giải thích được.',
    requirements: 'Không cần biết lập trình sâu. Nên quen dùng máy tính, bảng tính và tài khoản Google (Colab, Looker Studio). Xem điều kiện tiên quyết của khối Công nghệ Truyền thông trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn quốc tế, khoá học miễn phí, công cụ, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Môn học làm gì, vì sao data-driven, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Khái niệm & 4V|||Chapter 1 — Concepts & the 4Vs', description: 'AI/big data/analytics, vì sao data-driven, 4V.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nguồn & hạ tầng dữ liệu|||Chapter 2 — Sources & infrastructure', description: 'API, GA4, CRM; pipeline, ETL, data lake vs warehouse.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Phân tích mô tả & trực quan hoá|||Chapter 3 — Descriptive analytics', description: 'KPI, chọn biểu đồ, dashboard, rút insight.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Học máy cho marketing|||Chapter 4 — ML for marketing', description: 'Phân loại/hồi quy/phân cụm, churn, CLV, segmentation.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Xử lý ngôn ngữ tự nhiên|||Chapter 5 — NLP', description: 'Sentiment, topic modeling, social listening, tiếng Việt.', lessons: [c5, c5q] },
    { title: 'Chương 6 — AI tạo sinh|||Chapter 6 — Generative AI', description: 'Viết nội dung, ảnh/video, prompt, human-in-the-loop.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Cá nhân hoá & khuyến nghị|||Chapter 7 — Personalization', description: 'Recommender, targeting, real-time, A/B test.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đạo đức & quản trị dữ liệu|||Chapter 8 — Ethics & governance', description: 'Bias, GDPR/NĐ13, explainability, trách nhiệm.', lessons: [c8, c8q] },
  ],
};
