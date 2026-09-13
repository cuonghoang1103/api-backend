/**
 * SLN301 — Social Listening (Lắng nghe mạng xã hội). Khối Công nghệ Truyền
 * thông FPTU, Kỳ 4. Nguồn chuẩn: Brandwatch/Sprout Social/Talkwalker academy,
 * "Social Media Analytics" (Sponder), YouNet Media/Buzzmetrics (VN), Meltwater;
 * lộ trình 4 bước Nghe → Phân tích → Insight → Hành động. Song ngữ + công cụ
 * thật + ví dụ chiến dịch/khủng hoảng thật. 8 chương.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${ trong HTML; "&"→&amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

/* ── Materials ─────────────────────────────────────────────────────────────*/
const taiLieu = doc('sln301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), academy của nền tảng thật (Brandwatch/Sprout/Talkwalker), sách, công cụ VN (YouNet/Buzzmetrics), lộ trình tự học.',
  [[
    `<span class="eyebrow">SLN301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>social listening</strong> — from queries and sentiment to brand health, competitor benchmarking and turning data into strategy — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, industry-standard resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for SLN301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference book</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/Social+Media+Analytics%3A+Effective+Tools+for+Building%2C+Interpreting%2C+and+Using+Metrics-p-9780071768290" target="_blank" rel="noopener"><em>Social Media Analytics</em> — Marshall Sponder</a></li>
</ul>
<h3>🌐 Platform academies (free)</h3>
<ul>
<li><a href="https://www.brandwatch.com/resources/" target="_blank" rel="noopener">Brandwatch — resources &amp; guides</a></li>
<li><a href="https://sproutsocial.com/insights/" target="_blank" rel="noopener">Sprout Social Insights</a></li>
<li><a href="https://www.talkwalker.com/resources" target="_blank" rel="noopener">Talkwalker resources</a> · <a href="https://www.meltwater.com/en/resources" target="_blank" rel="noopener">Meltwater resources</a></li>
</ul>
<h3>🇻🇳 Vietnam market</h3>
<ul>
<li><a href="https://younetmedia.com/" target="_blank" rel="noopener">YouNet Media</a> — social listening cho thị trường Việt</li>
<li><a href="https://buzzmetrics.com/" target="_blank" rel="noopener">Buzzmetrics</a> — báo cáo ngành &amp; social index</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — listening vs monitoring, the social-data ecosystem, mention &amp; buzz.</li>
<li><strong>Build a query</strong> — boolean logic, noise removal, Vietnamese-language traps.</li>
<li><strong>Analyse</strong> — sentiment, topics, share of voice; brand health &amp; crisis alerts.</li>
<li><strong>Act</strong> — dashboards, KPIs, insight → strategy, and data ethics.</li>
</ol></div>`,
    `<span class="eyebrow">SLN301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>social listening</strong> — từ truy vấn, sentiment tới sức khỏe thương hiệu, so kè đối thủ và biến dữ liệu thành chiến lược — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, chuẩn ngành.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của SLN301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/Social+Media+Analytics%3A+Effective+Tools+for+Building%2C+Interpreting%2C+and+Using+Metrics-p-9780071768290" target="_blank" rel="noopener"><em>Social Media Analytics</em> — Marshall Sponder</a></li>
</ul>
<h3>🌐 Academy của nền tảng (miễn phí)</h3>
<ul>
<li><a href="https://www.brandwatch.com/resources/" target="_blank" rel="noopener">Brandwatch — tài nguyên &amp; hướng dẫn</a></li>
<li><a href="https://sproutsocial.com/insights/" target="_blank" rel="noopener">Sprout Social Insights</a></li>
<li><a href="https://www.talkwalker.com/resources" target="_blank" rel="noopener">Talkwalker resources</a> · <a href="https://www.meltwater.com/en/resources" target="_blank" rel="noopener">Meltwater resources</a></li>
</ul>
<h3>🇻🇳 Thị trường Việt Nam</h3>
<ul>
<li><a href="https://younetmedia.com/" target="_blank" rel="noopener">YouNet Media</a> — social listening cho thị trường Việt</li>
<li><a href="https://buzzmetrics.com/" target="_blank" rel="noopener">Buzzmetrics</a> — báo cáo ngành &amp; social index</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — listening khác monitoring, hệ sinh thái dữ liệu, mention &amp; buzz.</li>
<li><strong>Dựng truy vấn</strong> — logic boolean, loại nhiễu, bẫy tiếng Việt.</li>
<li><strong>Phân tích</strong> — sentiment, chủ đề, share of voice; sức khỏe thương hiệu &amp; cảnh báo khủng hoảng.</li>
<li><strong>Hành động</strong> — dashboard, KPI, insight → chiến lược, và đạo đức dữ liệu.</li>
</ol></div>`,
  ]]);

/* ── Intro ─────────────────────────────────────────────────────────────────*/
const intro = doc('sln301-0-1-overview', 'Course overview: Social listening|||Tổng quan: Lắng nghe mạng xã hội',
  'Social listening là gì và làm được gì; lộ trình 4 bước Nghe → Phân tích → Insight → Hành động; công cụ & thị trường VN.',
  [[
    `<span class="eyebrow">SLN301 · Lesson 0.1 · Overview</span>
<h2>Social listening</h2>
<p class="lead">This course teaches you to <strong>listen to what millions of people say online</strong> about a brand, product, competitor or topic — and turn that noise into decisions. You'll build boolean queries, measure <strong>sentiment</strong> and <strong>share of voice</strong>, spot crises early, mine consumer insight, and report to a strategy.</p>
<h3>The 4-step loop</h3>
<pre><code>1. LISTEN   collect mentions from social, forums, news, reviews
2. ANALYSE  clean noise -> classify sentiment, topics, sources
3. INSIGHT  find the "so what": a need, a risk, a trend
4. ACT      brief the team: content, product, crisis response
</code></pre>
<h3>Roadmap</h3>
<p>What listening is (vs monitoring) → the social-data ecosystem → queries &amp; filters → sentiment &amp; topics → brand health &amp; crisis → consumer insight &amp; trends → competitor benchmarking → reporting, KPIs &amp; ethics. Bilingual, with real tools (Brandwatch, Sprout, Talkwalker, YouNet, Buzzmetrics) and real campaigns.</p>`,
    `<span class="eyebrow">SLN301 · Bài 0.1 · Tổng quan</span>
<h2>Lắng nghe mạng xã hội</h2>
<p class="lead">Môn này dạy bạn <strong>nghe điều hàng triệu người nói trên mạng</strong> về một thương hiệu, sản phẩm, đối thủ hay chủ đề — rồi biến tiếng ồn đó thành quyết định. Bạn sẽ dựng truy vấn boolean, đo <strong>sentiment</strong> và <strong>share of voice</strong>, phát hiện khủng hoảng sớm, đào insight người dùng, và báo cáo ra chiến lược.</p>
<h3>Vòng lặp 4 bước</h3>
<pre><code>1. NGHE       thu mention từ mạng xã hội, forum, tin tức, review
2. PHÂN TÍCH  làm sạch nhiễu -> phân loại sentiment, chủ đề, nguồn
3. INSIGHT    tìm "vậy thì sao": một nhu cầu, một rủi ro, một xu hướng
4. HÀNH ĐỘNG  brief đội: nội dung, sản phẩm, xử lý khủng hoảng
</code></pre>
<h3>Lộ trình</h3>
<p>Listening là gì (khác monitoring) → hệ sinh thái dữ liệu xã hội → truy vấn &amp; bộ lọc → sentiment &amp; chủ đề → sức khỏe thương hiệu &amp; khủng hoảng → insight &amp; xu hướng → so kè đối thủ → báo cáo, KPI &amp; đạo đức. Song ngữ, có công cụ thật (Brandwatch, Sprout, Talkwalker, YouNet, Buzzmetrics) và chiến dịch thật.</p>`,
  ]]);

/* ── Ch1 ───────────────────────────────────────────────────────────────────*/
const c1 = doc('sln301-1-1-what-is', '1.1 — What is social listening?|||1.1 — Social listening là gì?',
  'Listening vs monitoring; giá trị kinh doanh; các use case thật (sản phẩm, marketing, chăm sóc khách hàng, khủng hoảng).',
  [[
    `<span class="eyebrow">SLN301 · Chapter 1 · Lesson 1.1</span>
<h2>What is social listening?</h2>
<h3>Listening vs monitoring</h3>
<ul>
<li><strong>Monitoring</strong> answers "what are people saying <em>to me / about me</em> right now?" — tracking mentions, replying to comments, tactical, reactive.</li>
<li><strong>Listening</strong> answers "what does all of this <em>mean</em>, and what should we do?" — aggregating thousands of conversations into themes, sentiment and trends over time; strategic, proactive.</li>
</ul>
<p>Rule of thumb: monitoring is a <strong>stream of individual posts</strong>; listening is the <strong>pattern across them</strong>.</p>
<h3>Why it matters</h3>
<ul>
<li><strong>Voice of customer at scale</strong> — unprompted opinions, not survey answers.</li>
<li><strong>Early warning</strong> — a complaint spike hours before it becomes a crisis.</li>
<li><strong>Cheaper, faster research</strong> — spot needs and objections before a launch.</li>
</ul>
<h3>Use cases</h3>
<pre><code>Product     -> which feature do people complain about most?
Marketing   -> did the campaign hashtag actually spread?
Care        -> unhappy customers who never tagged the brand
Competitor  -> what do rivals' customers hate about them?
Crisis      -> is negative buzz spiking abnormally?
</code></pre>
<div class="callout"><span class="badge">Key idea</span> Listening turns public conversation into a data source you can query — like analytics for the whole internet, not just your own channels.</div>`,
    `<span class="eyebrow">SLN301 · Chương 1 · Bài 1.1</span>
<h2>Social listening là gì?</h2>
<h3>Listening khác monitoring</h3>
<ul>
<li><strong>Monitoring (theo dõi)</strong> trả lời "ngay lúc này người ta nói gì <em>với/về mình</em>?" — bám mention, trả lời bình luận; mang tính chiến thuật, bị động.</li>
<li><strong>Listening (lắng nghe)</strong> trả lời "tất cả những điều đó <em>nghĩa là gì</em>, và ta nên làm gì?" — gộp hàng nghìn hội thoại thành chủ đề, sentiment và xu hướng theo thời gian; chiến lược, chủ động.</li>
</ul>
<p>Mẹo nhớ: monitoring là <strong>dòng chảy từng bài lẻ</strong>; listening là <strong>quy luật xuyên suốt chúng</strong>.</p>
<h3>Vì sao quan trọng</h3>
<ul>
<li><strong>Tiếng nói khách hàng ở quy mô lớn</strong> — ý kiến tự phát, không phải câu trả lời khảo sát.</li>
<li><strong>Cảnh báo sớm</strong> — một đợt tăng phàn nàn vài giờ trước khi thành khủng hoảng.</li>
<li><strong>Nghiên cứu rẻ &amp; nhanh</strong> — thấy nhu cầu và phản đối trước khi ra mắt.</li>
</ul>
<h3>Use case</h3>
<pre><code>Sản phẩm   -> tính năng nào bị phàn nàn nhiều nhất?
Marketing  -> hashtag chiến dịch có thực sự lan không?
Chăm sóc   -> khách bực nhưng chưa từng tag thương hiệu
Đối thủ    -> khách của đối thủ ghét điều gì?
Khủng hoảng-> buzz tiêu cực có tăng bất thường không?
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Listening biến hội thoại công khai thành nguồn dữ liệu bạn truy vấn được — như analytics cho cả internet, không chỉ kênh của bạn.</div>`,
  ]]);
const c1q = quiz('sln301-quiz-1', 'Quiz 1 — What is listening|||Quiz 1 — Listening là gì', [
  { id: 'q1', question: 'Điểm khác cốt lõi giữa listening và monitoring?|||The core difference between listening and monitoring?', options: ['Listening chỉ dùng cho quảng cáo', 'Listening tìm quy luật/insight xuyên nhiều hội thoại; monitoring bám từng bài lẻ', 'Monitoring đắt hơn listening', 'Chúng hoàn toàn giống nhau'], correctIndex: 1, explanation: 'Monitoring = dòng bài lẻ (chiến thuật); listening = quy luật xuyên suốt (chiến lược).' },
  { id: 'q2', question: 'Vì sao listening là "cảnh báo sớm"?|||Why is listening an "early warning"?', options: ['Nó xoá bình luận xấu', 'Nó phát hiện đợt tăng phàn nàn trước khi thành khủng hoảng', 'Nó tự trả lời khách hàng', 'Nó chặn đối thủ'], correctIndex: 1, explanation: 'Phát hiện spike tiêu cực bất thường sớm giúp phản ứng kịp.' },
  { id: 'q3', question: 'Đâu KHÔNG phải use case điển hình của social listening?|||Which is NOT a typical social listening use case?', options: ['Tìm tính năng bị chê nhiều nhất', 'Đo mức lan của hashtag chiến dịch', 'Tự động tính lương nhân viên', 'Hiểu khách của đối thủ ghét gì'], correctIndex: 2, explanation: 'Tính lương không liên quan hội thoại xã hội — không phải use case listening.' },
]);

/* ── Ch2 ───────────────────────────────────────────────────────────────────*/
const c2 = doc('sln301-2-1-data-ecosystem', '2.1 — The social-data ecosystem|||2.1 — Hệ sinh thái dữ liệu xã hội',
  'Nguồn dữ liệu (mạng xã hội, forum, tin tức, review); mention & buzz; API vs crawl; nền tảng listening thật.',
  [[
    `<span class="eyebrow">SLN301 · Chapter 2 · Lesson 2.1</span>
<h2>The social-data ecosystem</h2>
<h3>Where the data comes from</h3>
<ul>
<li><strong>Social networks</strong> — Facebook, TikTok, Instagram, YouTube, X/Threads.</li>
<li><strong>Forums &amp; communities</strong> — Reddit, Voz, Tinh tế, group Facebook.</li>
<li><strong>News &amp; blogs</strong> — báo điện tử, bài PR, blog cá nhân.</li>
<li><strong>Reviews &amp; e-commerce</strong> — Shopee/Lazada reviews, Google Maps, app stores.</li>
</ul>
<h3>Two words you'll use daily</h3>
<ul>
<li><strong>Mention</strong> — one post/comment/article that matches your query.</li>
<li><strong>Buzz / volume</strong> — the count of mentions over time; a "buzz spike" is a sudden surge.</li>
</ul>
<h3>How tools get the data</h3>
<pre><code>Official API  -> platform grants data (X API, Meta, YouTube)
                 clean, but rate-limited &amp; may cost money
Crawling      -> read public pages like a browser
                 broad, but fragile &amp; bound by terms of use
Data partner  -> licensed firehose resold by a vendor
</code></pre>
<h3>Platforms</h3>
<p>Global: <strong>Brandwatch, Sprout Social, Talkwalker, Meltwater, Mention</strong>. Vietnam: <strong>YouNet Media (SocialHeat), Buzzmetrics</strong> — tuned for Vietnamese sources and language.</p>
<div class="callout"><span class="badge">Coverage matters</span> A tool is only as good as the sources it can reach. In Vietnam, TikTok and Facebook groups dominate — pick a platform that actually indexes them.</div>`,
    `<span class="eyebrow">SLN301 · Chương 2 · Bài 2.1</span>
<h2>Hệ sinh thái dữ liệu xã hội</h2>
<h3>Dữ liệu đến từ đâu</h3>
<ul>
<li><strong>Mạng xã hội</strong> — Facebook, TikTok, Instagram, YouTube, X/Threads.</li>
<li><strong>Forum &amp; cộng đồng</strong> — Reddit, Voz, Tinh tế, group Facebook.</li>
<li><strong>Tin tức &amp; blog</strong> — báo điện tử, bài PR, blog cá nhân.</li>
<li><strong>Review &amp; TMĐT</strong> — review Shopee/Lazada, Google Maps, app store.</li>
</ul>
<h3>Hai từ dùng mỗi ngày</h3>
<ul>
<li><strong>Mention</strong> — một bài/bình luận/bài báo khớp truy vấn của bạn.</li>
<li><strong>Buzz / volume</strong> — số lượng mention theo thời gian; "buzz spike" là đợt tăng đột ngột.</li>
</ul>
<h3>Công cụ lấy dữ liệu thế nào</h3>
<pre><code>API chính thức -> nền tảng cấp dữ liệu (X API, Meta, YouTube)
                  sạch, nhưng giới hạn tần suất &amp; có thể tốn tiền
Crawl          -> đọc trang công khai như trình duyệt
                  rộng, nhưng dễ vỡ &amp; ràng buộc điều khoản
Đối tác dữ liệu-> firehose có bản quyền do vendor bán lại
</code></pre>
<h3>Nền tảng</h3>
<p>Toàn cầu: <strong>Brandwatch, Sprout Social, Talkwalker, Meltwater, Mention</strong>. Việt Nam: <strong>YouNet Media (SocialHeat), Buzzmetrics</strong> — tối ưu cho nguồn và ngôn ngữ Việt.</p>
<div class="callout"><span class="badge">Độ phủ quyết định</span> Công cụ chỉ mạnh bằng nguồn nó với tới. Ở Việt Nam TikTok và group Facebook chiếm ưu thế — chọn nền tảng thật sự index được chúng.</div>`,
  ]]);
const c2q = quiz('sln301-quiz-2', 'Quiz 2 — Data ecosystem|||Quiz 2 — Hệ sinh thái dữ liệu', [
  { id: 'q1', question: '"Buzz spike" nghĩa là gì?|||What does a "buzz spike" mean?', options: ['Một bài bị xoá', 'Số lượng mention tăng đột ngột trong thời gian ngắn', 'Một tài khoản mới', 'Lỗi của API'], correctIndex: 1, explanation: 'Buzz spike = đợt tăng volume/mention đột biến.' },
  { id: 'q2', question: 'Ưu điểm của lấy dữ liệu qua API chính thức so với crawl?|||Advantage of an official API over crawling?', options: ['Luôn miễn phí', 'Dữ liệu sạch & ổn định hơn, đúng điều khoản, nhưng bị giới hạn tần suất', 'Không cần khoá', 'Phủ mọi nguồn'], correctIndex: 1, explanation: 'API sạch/ổn định/đúng ToS nhưng rate-limit; crawl rộng nhưng dễ vỡ.' },
  { id: 'q3', question: 'Vì sao "độ phủ nguồn" quan trọng khi chọn nền tảng ở VN?|||Why does source coverage matter for a VN platform?', options: ['Vì màu giao diện', 'Vì TikTok & group Facebook chiếm ưu thế, cần công cụ index được chúng', 'Vì giá rẻ nhất luôn tốt nhất', 'Vì càng ít nguồn càng chính xác'], correctIndex: 1, explanation: 'Công cụ chỉ mạnh bằng nguồn nó với tới; VN cần phủ TikTok/Facebook.' },
]);

/* ── Ch3 ───────────────────────────────────────────────────────────────────*/
const c3 = doc('sln301-3-1-queries-filters', '3.1 — Queries & filters|||3.1 — Truy vấn & bộ lọc',
  'Keyword; boolean query (AND/OR/NOT, ngoặc kép, proximity); loại nhiễu; bẫy ngôn ngữ tiếng Việt (dấu, teencode, đồng âm).',
  [[
    `<span class="eyebrow">SLN301 · Chapter 3 · Lesson 3.1</span>
<h2>Queries &amp; filters</h2>
<p>A listening project is only as good as its <strong>query</strong> — the boolean rule that decides which mentions get collected. Too loose and you drown in noise; too tight and you miss the conversation.</p>
<h3>Boolean building blocks</h3>
<ul>
<li><strong>AND</strong> — both terms must appear. <strong>OR</strong> — either. <strong>NOT</strong> — exclude.</li>
<li><strong>"quotes"</strong> — exact phrase. <strong>( )</strong> — grouping. <strong>*</strong> — wildcard.</li>
<li><strong>proximity</strong> (NEAR/n) — terms within n words of each other.</li>
</ul>
<h3>Example: listen to complaints about a coffee brand</h3>
<pre><code>("Highlands Coffee" OR "Highlands" OR HLC)
  AND (dở OR tệ OR "thất vọng" OR chê OR "không ngon")
  NOT (tuyển OR "tuyển dụng" OR khuyến_mãi OR share)
  lang:vi
</code></pre>
<h3>Kill the noise</h3>
<ul>
<li><strong>Ambiguity</strong> — a brand name that is also a common word (e.g. "Apple" the fruit). Add context terms with AND.</li>
<li><strong>Spam &amp; promo</strong> — exclude giveaway/recruitment posts with NOT.</li>
<li><strong>Bots &amp; reshares</strong> — filter duplicates and low-quality accounts.</li>
</ul>
<h3>Vietnamese-language traps</h3>
<ul>
<li><strong>Diacritics</strong> — "phở" vs "pho"; users drop tones. Cover both spellings.</li>
<li><strong>Teencode &amp; slang</strong> — "vãi", "cực phẩm", "u là trời"; add them explicitly.</li>
<li><strong>Homonyms</strong> — "Sen" the brand vs "sen" the flower; disambiguate with AND.</li>
</ul>
<div class="callout"><span class="badge">Iterate</span> Build the query, read a sample of results, add exclusions, repeat. A good query is tuned over days, not written once.</div>`,
    `<span class="eyebrow">SLN301 · Chương 3 · Bài 3.1</span>
<h2>Truy vấn &amp; bộ lọc</h2>
<p>Một dự án listening chỉ tốt bằng <strong>truy vấn</strong> — quy tắc boolean quyết định mention nào được thu. Lỏng quá thì ngập nhiễu; chặt quá thì hụt mất hội thoại.</p>
<h3>Khối boolean</h3>
<ul>
<li><strong>AND</strong> — phải có cả hai từ. <strong>OR</strong> — có một trong hai. <strong>NOT</strong> — loại trừ.</li>
<li><strong>"ngoặc kép"</strong> — cụm chính xác. <strong>( )</strong> — nhóm. <strong>*</strong> — ký tự đại diện.</li>
<li><strong>proximity</strong> (NEAR/n) — các từ cách nhau trong n chữ.</li>
</ul>
<h3>Ví dụ: nghe phàn nàn về một hãng cà phê</h3>
<pre><code>("Highlands Coffee" OR "Highlands" OR HLC)
  AND (dở OR tệ OR "thất vọng" OR chê OR "không ngon")
  NOT (tuyển OR "tuyển dụng" OR khuyến_mãi OR share)
  lang:vi
</code></pre>
<h3>Diệt nhiễu</h3>
<ul>
<li><strong>Đa nghĩa</strong> — tên thương hiệu trùng từ thông dụng (vd "Apple" là quả táo). Thêm từ ngữ cảnh bằng AND.</li>
<li><strong>Spam &amp; quảng cáo</strong> — loại bài giveaway/tuyển dụng bằng NOT.</li>
<li><strong>Bot &amp; chia sẻ lại</strong> — lọc trùng lặp và tài khoản kém chất lượng.</li>
</ul>
<h3>Bẫy ngôn ngữ tiếng Việt</h3>
<ul>
<li><strong>Dấu</strong> — "phở" và "pho"; người dùng hay bỏ dấu. Phủ cả hai cách viết.</li>
<li><strong>Teencode &amp; tiếng lóng</strong> — "vãi", "cực phẩm", "u là trời"; thêm rõ ràng.</li>
<li><strong>Đồng âm</strong> — "Sen" thương hiệu và "sen" hoa; tách nghĩa bằng AND.</li>
</ul>
<div class="callout"><span class="badge">Lặp để tinh</span> Dựng truy vấn, đọc một mẫu kết quả, thêm loại trừ, lặp lại. Truy vấn tốt được chỉnh qua nhiều ngày, không viết một lần xong.</div>`,
  ]]);
const c3q = quiz('sln301-quiz-3', 'Quiz 3 — Queries|||Quiz 3 — Truy vấn', [
  { id: 'q1', question: 'Toán tử nào loại trừ các mention chứa từ không mong muốn?|||Which operator excludes unwanted mentions?', options: ['AND', 'OR', 'NOT', 'NEAR'], correctIndex: 2, explanation: 'NOT loại trừ từ/cụm (vd NOT "tuyển dụng").' },
  { id: 'q2', question: 'Với tên thương hiệu trùng một từ thông dụng, cách xử lý nhiễu tốt nhất?|||For a brand name that is also a common word, best way to cut noise?', options: ['Bỏ hẳn từ khoá đó', 'Thêm từ ngữ cảnh bằng AND để tách đúng nghĩa', 'Dùng nhiều OR hơn', 'Chỉ crawl một nguồn'], correctIndex: 1, explanation: 'AND thêm ngữ cảnh giúp tách nghĩa thương hiệu khỏi từ đồng âm.' },
  { id: 'q3', question: 'Bẫy đặc thù tiếng Việt cần lường khi dựng truy vấn?|||A Vietnamese-specific trap when building a query?', options: ['Không có dấu câu', 'Người dùng bỏ dấu, dùng teencode và từ đồng âm', 'Chỉ viết hoa', 'Không dùng emoji'], correctIndex: 1, explanation: 'Bỏ dấu, teencode/lóng và đồng âm là ba bẫy tiếng Việt điển hình.' },
]);

/* ── Ch4 ───────────────────────────────────────────────────────────────────*/
const c4 = doc('sln301-4-1-sentiment-topics', '4.1 — Sentiment & topic analysis|||4.1 — Phân tích tình cảm & chủ đề',
  'Sentiment analysis (pos/neg/neu); topic/theme clustering; share of voice; thách thức sentiment tiếng Việt (mỉa mai, ngữ cảnh).',
  [[
    `<span class="eyebrow">SLN301 · Chapter 4 · Lesson 4.1</span>
<h2>Sentiment &amp; topic analysis</h2>
<h3>Sentiment</h3>
<p><strong>Sentiment analysis</strong> labels each mention <strong>positive / negative / neutral</strong> (some tools add mixed). What you report is usually the <strong>sentiment ratio</strong> and how it moves over time.</p>
<pre><code>Net sentiment = (positive - negative) / total mentions
</code></pre>
<h3>Topics &amp; themes</h3>
<p><strong>Topic analysis</strong> groups mentions into what they're <em>about</em> — price, taste, delivery, staff — so a wall of comments becomes a ranked list of themes. This is where the "why behind the number" lives.</p>
<h3>Share of voice (SOV)</h3>
<pre><code>SOV(brand) = mentions of brand / mentions of whole category
</code></pre>
<p>SOV shows how much of the conversation you own versus rivals — the headline number of most listening reports.</p>
<h3>Why Vietnamese sentiment is hard</h3>
<ul>
<li><strong>Sarcasm &amp; irony</strong> — "ngon dữ luôn 🙄" is negative despite a positive word.</li>
<li><strong>Context</strong> — "nóng" is good for a phone launch, bad for a laptop that overheats.</li>
<li><strong>Emoji &amp; teencode</strong> carry the real feeling; models tuned on English miss them.</li>
</ul>
<div class="callout"><span class="badge">Always sample</span> Automated sentiment is ~70–85% accurate at best. Read a sample by hand to trust the trend, and correct obvious mislabels before you present.</div>`,
    `<span class="eyebrow">SLN301 · Chương 4 · Bài 4.1</span>
<h2>Phân tích tình cảm &amp; chủ đề</h2>
<h3>Sentiment (tình cảm)</h3>
<p><strong>Sentiment analysis</strong> gán mỗi mention <strong>tích cực / tiêu cực / trung tính</strong> (vài công cụ thêm "hỗn hợp"). Cái bạn báo cáo thường là <strong>tỷ lệ sentiment</strong> và cách nó thay đổi theo thời gian.</p>
<pre><code>Sentiment ròng = (tích cực - tiêu cực) / tổng mention
</code></pre>
<h3>Chủ đề &amp; theme</h3>
<p><strong>Topic analysis</strong> gom mention theo việc chúng nói <em>về cái gì</em> — giá, vị, giao hàng, nhân viên — biến một bức tường bình luận thành danh sách chủ đề xếp hạng. Đây là chỗ chứa "vì sao đằng sau con số".</p>
<h3>Share of voice (SOV)</h3>
<pre><code>SOV(hãng) = mention của hãng / mention của cả ngành hàng
</code></pre>
<p>SOV cho thấy bạn chiếm bao nhiêu phần hội thoại so với đối thủ — con số tiêu đề của hầu hết báo cáo listening.</p>
<h3>Vì sao sentiment tiếng Việt khó</h3>
<ul>
<li><strong>Mỉa mai</strong> — "ngon dữ luôn 🙄" là tiêu cực dù có từ tích cực.</li>
<li><strong>Ngữ cảnh</strong> — "nóng" là tốt khi ra mắt điện thoại hot, xấu khi laptop quá nhiệt.</li>
<li><strong>Emoji &amp; teencode</strong> mang cảm xúc thật; mô hình luyện tiếng Anh bỏ sót chúng.</li>
</ul>
<div class="callout"><span class="badge">Luôn lấy mẫu</span> Sentiment tự động chính xác nhất ~70–85%. Đọc tay một mẫu để tin xu hướng, và sửa các nhãn sai rõ ràng trước khi trình bày.</div>`,
  ]]);
const c4q = quiz('sln301-quiz-4', 'Quiz 4 — Sentiment & topics|||Quiz 4 — Sentiment & chủ đề', [
  { id: 'q1', question: 'Share of voice (SOV) đo điều gì?|||What does share of voice (SOV) measure?', options: ['Số nhân viên của hãng', 'Tỷ lệ mention của hãng trên tổng mention cả ngành hàng', 'Doanh thu theo quý', 'Số follower'], correctIndex: 1, explanation: 'SOV = mention của hãng / mention cả ngành — phần hội thoại bạn sở hữu.' },
  { id: 'q2', question: 'Vì sao sentiment tự động cần được kiểm tay?|||Why should automated sentiment be sampled by hand?', options: ['Vì nó luôn đúng 100%', 'Vì mỉa mai, ngữ cảnh và emoji khiến máy gán nhầm', 'Vì nó chậm', 'Vì nó chỉ đọc tiếng Anh được'], correctIndex: 1, explanation: 'Độ chính xác ~70–85%; mỉa mai/ngữ cảnh dễ bị gán sai, cần đọc mẫu.' },
  { id: 'q3', question: 'Topic/theme analysis giúp trả lời câu hỏi nào?|||Topic/theme analysis answers which question?', options: ['Ai đăng nhiều nhất', '"Vì sao" đằng sau con số — người ta bàn về khía cạnh nào', 'Bài đăng lúc mấy giờ', 'Giá cổ phiếu'], correctIndex: 1, explanation: 'Topic gom hội thoại theo khía cạnh (giá, vị, giao hàng...) — cái "vì sao".' },
]);

/* ── Ch5 ───────────────────────────────────────────────────────────────────*/
const c5 = doc('sln301-5-1-brand-crisis', '5.1 — Brand health & crisis|||5.1 — Sức khỏe thương hiệu & khủng hoảng',
  'Brand health (volume, sentiment, SOV); phát hiện khủng hoảng; cảnh báo sớm & ngưỡng spike; ví dụ khủng hoảng thật.',
  [[
    `<span class="eyebrow">SLN301 · Chapter 5 · Lesson 5.1</span>
<h2>Brand health &amp; crisis detection</h2>
<h3>Brand health</h3>
<p><strong>Brand health</strong> is a small dashboard of vital signs tracked continuously:</p>
<ul>
<li><strong>Volume</strong> — how much people talk about you.</li>
<li><strong>Sentiment ratio</strong> — how they feel.</li>
<li><strong>Share of voice</strong> — your slice vs the category.</li>
<li><strong>Reach / engagement</strong> — how far conversation travels.</li>
</ul>
<h3>Crisis detection &amp; early warning</h3>
<p>A crisis shows up first as an <strong>abnormal negative spike</strong>. Tools fire an <strong>alert</strong> when volume or negative sentiment crosses a threshold — e.g. "negative mentions &gt; 3× the 7-day average". Speed matters: the first hour decides whether you shape the story or chase it.</p>
<pre><code>Alert rule (example):
  IF negative_mentions(last 1h) > 3 * avg_hourly(last 7d)
  THEN notify crisis team
</code></pre>
<h3>Real crises</h3>
<ul>
<li><strong>United Airlines (2017)</strong> — a passenger dragged off a plane; video went global within hours, a textbook negative buzz explosion.</li>
<li><strong>Tân Hiệp Phát — "con ruồi" (2015, VN)</strong> — a fly-in-a-bottle case spiralled into a boycott; listening would have caught the spike early.</li>
</ul>
<div class="callout"><span class="badge">Warning</span> The goal of listening in a crisis is not to delete comments — it's to <strong>see the surge early, understand the driver, and respond honestly</strong> before it defines the brand.</div>`,
    `<span class="eyebrow">SLN301 · Chương 5 · Bài 5.1</span>
<h2>Sức khỏe thương hiệu &amp; phát hiện khủng hoảng</h2>
<h3>Brand health</h3>
<p><strong>Brand health</strong> là một dashboard nhỏ gồm các "dấu hiệu sinh tồn" theo dõi liên tục:</p>
<ul>
<li><strong>Volume</strong> — người ta nói về bạn nhiều bao nhiêu.</li>
<li><strong>Tỷ lệ sentiment</strong> — họ cảm thấy thế nào.</li>
<li><strong>Share of voice</strong> — phần của bạn so với ngành hàng.</li>
<li><strong>Reach / tương tác</strong> — hội thoại lan xa tới đâu.</li>
</ul>
<h3>Phát hiện khủng hoảng &amp; cảnh báo sớm</h3>
<p>Khủng hoảng lộ diện đầu tiên bằng một <strong>đợt tăng tiêu cực bất thường</strong>. Công cụ bắn <strong>cảnh báo</strong> khi volume hoặc sentiment tiêu cực vượt ngưỡng — vd "mention tiêu cực &gt; 3× trung bình 7 ngày". Tốc độ quyết định: giờ đầu tiên định đoạt bạn dẫn dắt câu chuyện hay chạy theo nó.</p>
<pre><code>Quy tắc cảnh báo (ví dụ):
  NẾU mention_tiêu_cực(1h qua) > 3 * trung_bình_giờ(7 ngày qua)
  THÌ báo đội xử lý khủng hoảng
</code></pre>
<h3>Khủng hoảng thật</h3>
<ul>
<li><strong>United Airlines (2017)</strong> — một hành khách bị lôi khỏi máy bay; video lan toàn cầu trong vài giờ, một vụ bùng buzz tiêu cực kinh điển.</li>
<li><strong>Tân Hiệp Phát — "con ruồi" (2015, VN)</strong> — vụ con ruồi trong chai leo thang thành tẩy chay; listening lẽ ra bắt được đợt tăng sớm.</li>
</ul>
<div class="callout"><span class="badge">Lưu ý</span> Mục tiêu của listening trong khủng hoảng không phải xoá bình luận — mà là <strong>thấy đợt tăng sớm, hiểu nguyên nhân, và phản hồi trung thực</strong> trước khi nó định nghĩa thương hiệu.</div>`,
  ]]);
const c5q = quiz('sln301-quiz-5', 'Quiz 5 — Brand health & crisis|||Quiz 5 — Sức khỏe & khủng hoảng', [
  { id: 'q1', question: 'Dấu hiệu sớm nhất của một khủng hoảng trong dữ liệu listening?|||Earliest signal of a crisis in listening data?', options: ['SOV tăng đều', 'Một đợt tăng tiêu cực bất thường (spike) vượt ngưỡng', 'Follower giảm nhẹ', 'Một bài quảng cáo mới'], correctIndex: 1, explanation: 'Khủng hoảng lộ ra bằng spike tiêu cực bất thường vượt ngưỡng cảnh báo.' },
  { id: 'q2', question: 'Đâu KHÔNG phải chỉ số brand health điển hình?|||Which is NOT a typical brand-health metric?', options: ['Volume', 'Tỷ lệ sentiment', 'Share of voice', 'Số dòng code của website'], correctIndex: 3, explanation: 'Brand health gồm volume, sentiment, SOV, reach — không phải số dòng code.' },
  { id: 'q3', question: 'Mục tiêu đúng của listening khi khủng hoảng là gì?|||The right goal of listening during a crisis?', options: ['Xoá mọi bình luận xấu', 'Thấy đợt tăng sớm, hiểu nguyên nhân và phản hồi trung thực', 'Mua thêm follower', 'Ẩn thương hiệu đi'], correctIndex: 1, explanation: 'Phát hiện sớm + hiểu driver + phản hồi trung thực, không phải xoá bình luận.' },
]);

/* ── Ch6 ───────────────────────────────────────────────────────────────────*/
const c6 = doc('sln301-6-1-insight-trends', '6.1 — Consumer insight & trends|||6.1 — Insight người tiêu dùng & xu hướng',
  'Consumer insight (từ dữ liệu tới "sự thật ngầm hiểu"); trend spotting; nhận diện influencer; ví dụ chiến dịch thật.',
  [[
    `<span class="eyebrow">SLN301 · Chapter 6 · Lesson 6.1</span>
<h2>Consumer insight &amp; trend spotting</h2>
<h3>From data to insight</h3>
<p>A number is not an insight. <strong>Consumer insight</strong> is the <em>hidden truth</em> behind behaviour — the unspoken need or tension you can act on.</p>
<pre><code>Data     "40% of coffee mentions are posted after 21:00"
Finding  "people talk about late-night coffee"
Insight  "young workers use coffee as an excuse to stay
          out with friends, not for caffeine"
Action   position the brand around connection, not energy
</code></pre>
<h3>Trend spotting</h3>
<p>Listening surfaces <strong>rising topics, hashtags and memes</strong> before they peak — the difference between riding a trend and arriving late. Watch the <em>slope</em> (fast-growing volume), not just the total.</p>
<h3>Influencer identification</h3>
<p>Find the accounts that actually <strong>drive</strong> conversation in your topic — ranked by reach, engagement and relevance, not just follower count. Micro-influencers often out-convert celebrities.</p>
<h3>Real campaigns</h3>
<ul>
<li><strong>Biti's Hunt — "Đi để trở về" (2017, VN)</strong> — the brand rode a Tết travel conversation and product placement in hit MVs, a classic insight-plus-trend win.</li>
<li><strong>Trend-jacking</strong> — brands that jump on a viral moment within hours (a meme, a song) earn outsized reach when the fit is genuine.</li>
</ul>
<div class="callout"><span class="badge">So what</span> Always push a finding one step further: "…which means our customer really wants ___." That sentence is the insight.</div>`,
    `<span class="eyebrow">SLN301 · Chương 6 · Bài 6.1</span>
<h2>Insight người tiêu dùng &amp; bắt xu hướng</h2>
<h3>Từ dữ liệu tới insight</h3>
<p>Một con số chưa phải insight. <strong>Consumer insight</strong> là <em>sự thật ngầm hiểu</em> đằng sau hành vi — nhu cầu hay căng thẳng chưa nói ra mà bạn hành động được.</p>
<pre><code>Dữ liệu   "40% mention về cà phê đăng sau 21:00"
Phát hiện "người ta bàn về cà phê đêm khuya"
Insight   "dân văn phòng trẻ mượn cà phê làm cớ ở lại
           với bạn bè, không phải vì caffeine"
Hành động định vị thương hiệu quanh sự kết nối, không phải năng lượng
</code></pre>
<h3>Bắt xu hướng</h3>
<p>Listening làm nổi lên <strong>chủ đề, hashtag và meme đang lên</strong> trước khi chúng đạt đỉnh — khác biệt giữa cưỡi xu hướng và tới trễ. Nhìn <em>độ dốc</em> (volume tăng nhanh), không chỉ tổng số.</p>
<h3>Nhận diện influencer</h3>
<p>Tìm những tài khoản thật sự <strong>dẫn dắt</strong> hội thoại trong chủ đề của bạn — xếp theo reach, tương tác và độ liên quan, không chỉ số follower. Micro-influencer thường chuyển đổi tốt hơn người nổi tiếng.</p>
<h3>Chiến dịch thật</h3>
<ul>
<li><strong>Biti's Hunt — "Đi để trở về" (2017, VN)</strong> — thương hiệu cưỡi làn hội thoại đi lại dịp Tết và product placement trong MV hit, một cú thắng insight cộng trend kinh điển.</li>
<li><strong>Trend-jacking</strong> — thương hiệu bắt nhịp khoảnh khắc viral trong vài giờ (một meme, một bài hát) thu reach vượt trội khi ăn khớp thật.</li>
</ul>
<div class="callout"><span class="badge">Vậy thì sao</span> Luôn đẩy một phát hiện thêm một bước: "…nghĩa là khách hàng thật sự muốn ___." Câu đó chính là insight.</div>`,
  ]]);
const c6q = quiz('sln301-quiz-6', 'Quiz 6 — Insight & trends|||Quiz 6 — Insight & xu hướng', [
  { id: 'q1', question: 'Điều gì phân biệt một "insight" với một "con số"?|||What separates an insight from a number?', options: ['Insight có màu đẹp hơn', 'Insight là sự thật ngầm hiểu/nhu cầu hành động được đằng sau hành vi', 'Insight luôn lớn hơn', 'Không có gì khác'], correctIndex: 1, explanation: 'Insight = sự thật ngầm hiểu, nhu cầu chưa nói ra mà ta hành động được.' },
  { id: 'q2', question: 'Khi bắt xu hướng, nên chú ý điều gì nhất?|||When trend spotting, what matters most?', options: ['Tổng số mention mọi thời điểm', 'Độ dốc — volume đang tăng nhanh trước khi đạt đỉnh', 'Màu của hashtag', 'Số ký tự bài đăng'], correctIndex: 1, explanation: 'Nhìn slope (tăng nhanh) để cưỡi xu hướng sớm, không chỉ tổng số.' },
  { id: 'q3', question: 'Nên xếp hạng influencer chủ yếu theo gì?|||Influencers should be ranked mainly by?', options: ['Chỉ số follower', 'Reach, tương tác và độ liên quan tới chủ đề', 'Ngày tạo tài khoản', 'Số bài mỗi ngày'], correctIndex: 1, explanation: 'Reach + engagement + relevance quan trọng hơn con số follower đơn thuần.' },
]);

/* ── Ch7 ───────────────────────────────────────────────────────────────────*/
const c7 = doc('sln301-7-1-competitor-category', '7.1 — Competitor & category listening|||7.1 — Phân tích đối thủ & thị trường',
  'Competitive benchmarking (SOV, sentiment so sánh); category listening; định vị & khoảng trống thị trường; ví dụ ngành cà phê VN.',
  [[
    `<span class="eyebrow">SLN301 · Chapter 7 · Lesson 7.1</span>
<h2>Competitor &amp; category listening</h2>
<h3>Competitive benchmarking</h3>
<p>Your numbers mean little in isolation. <strong>Benchmarking</strong> tracks the same metrics for you <em>and</em> your rivals side by side:</p>
<ul>
<li><strong>Share of voice</strong> — who owns the conversation.</li>
<li><strong>Comparative sentiment</strong> — who is loved / disliked, and for what.</li>
<li><strong>Drivers</strong> — the topics winning or hurting each brand.</li>
</ul>
<h3>Category listening</h3>
<p>Zoom out from brands to the <strong>whole category</strong> — "milk tea", "electric scooters" — to see demand shifts, unmet needs and <strong>white space</strong> no brand yet owns. This is where new products and positioning are born.</p>
<pre><code>Example — VN coffee category:
  Track: Highlands, Phúc Long, Katinat, Starbucks VN, The Coffee House
  Compare: SOV, price sentiment, "không gian" (space) sentiment
  White space: who owns "study / work-friendly" talk?
</code></pre>
<div class="callout"><span class="badge">Positioning</span> Category listening answers "where can we win?" — pick the theme rivals are weak on and your brand is credible in, then own it in content and product.</div>`,
    `<span class="eyebrow">SLN301 · Chương 7 · Bài 7.1</span>
<h2>Phân tích đối thủ &amp; thị trường</h2>
<h3>So kè đối thủ (benchmarking)</h3>
<p>Con số của bạn ít nghĩa nếu đứng một mình. <strong>Benchmarking</strong> theo dõi cùng bộ chỉ số cho bạn <em>và</em> đối thủ cạnh nhau:</p>
<ul>
<li><strong>Share of voice</strong> — ai sở hữu hội thoại.</li>
<li><strong>Sentiment so sánh</strong> — ai được yêu / bị ghét, và vì cái gì.</li>
<li><strong>Driver</strong> — chủ đề đang thắng hay làm hại mỗi thương hiệu.</li>
</ul>
<h3>Category listening (nghe cả ngành)</h3>
<p>Phóng to từ thương hiệu ra <strong>cả ngành hàng</strong> — "trà sữa", "xe điện" — để thấy dịch chuyển nhu cầu, nhu cầu chưa được đáp ứng và <strong>khoảng trống (white space)</strong> chưa hãng nào chiếm. Đây là nơi sản phẩm mới và định vị ra đời.</p>
<pre><code>Ví dụ — ngành cà phê VN:
  Theo dõi: Highlands, Phúc Long, Katinat, Starbucks VN, The Coffee House
  So sánh: SOV, sentiment về giá, sentiment về "không gian"
  Khoảng trống: ai sở hữu hội thoại "học/làm việc tiện"?
</code></pre>
<div class="callout"><span class="badge">Định vị</span> Category listening trả lời "ta thắng ở đâu?" — chọn chủ đề đối thủ yếu mà thương hiệu bạn đáng tin, rồi sở hữu nó bằng nội dung và sản phẩm.</div>`,
  ]]);
const c7q = quiz('sln301-quiz-7', 'Quiz 7 — Competitor & category|||Quiz 7 — Đối thủ & thị trường', [
  { id: 'q1', question: 'Vì sao benchmarking đối thủ lại quan trọng?|||Why does competitive benchmarking matter?', options: ['Để sao chép nội dung đối thủ', 'Vì con số của bạn chỉ có nghĩa khi so cạnh đối thủ (SOV, sentiment)', 'Để tăng follower', 'Không thật sự cần'], correctIndex: 1, explanation: 'Chỉ số đứng một mình ít nghĩa; so cạnh đối thủ mới thấy vị thế thật.' },
  { id: 'q2', question: '"White space" trong category listening là gì?|||What is "white space" in category listening?', options: ['Khoảng trắng trên dashboard', 'Chủ đề/nhu cầu chưa thương hiệu nào chiếm — cơ hội định vị', 'Bài đăng không có ảnh', 'Tài khoản chưa xác minh'], correctIndex: 1, explanation: 'White space = khoảng trống nhu cầu chưa ai sở hữu, cơ hội cho sản phẩm/định vị.' },
  { id: 'q3', question: 'Category listening trả lời câu hỏi chiến lược nào?|||Category listening answers which strategic question?', options: ['"Đăng lúc mấy giờ?"', '"Ta có thể thắng ở đâu?"', '"Font nào đẹp?"', '"Ai like bài mới nhất?"'], correctIndex: 1, explanation: 'Nghe cả ngành giúp chọn nơi thương hiệu có thể thắng và sở hữu.' },
]);

/* ── Ch8 ───────────────────────────────────────────────────────────────────*/
const c8 = doc('sln301-8-1-reporting-action', '8.1 — Reporting, KPIs & ethics|||8.1 — Báo cáo, KPI & đạo đức',
  'Dashboard & KPI; biến listening thành chiến lược; đạo đức & quyền riêng tư dữ liệu (Nghị định 13/2023, GDPR).',
  [[
    `<span class="eyebrow">SLN301 · Chapter 8 · Lesson 8.1</span>
<h2>Reporting, KPIs &amp; ethics</h2>
<h3>Dashboards &amp; KPIs</h3>
<p>A report is only useful if a decision-maker acts on it. Lead with a few <strong>KPIs</strong>, not a wall of charts:</p>
<ul>
<li><strong>Volume</strong> &amp; trend · <strong>Sentiment ratio</strong> · <strong>Share of voice</strong></li>
<li><strong>Reach / engagement</strong> · <strong>Top topics</strong> · <strong>Top sources / influencers</strong></li>
</ul>
<h3>Listening → strategy</h3>
<p>Close every report with the <strong>"so what → now what"</strong>: each insight paired with a concrete action for content, product, or customer care. A metric with no recommendation is a missed report.</p>
<pre><code>Insight  -> Recommendation      -> Owner
neg spike on delivery time -> add SLA + apology template -> Ops
"work-friendly" white space -> a study-corner campaign   -> Marketing
</code></pre>
<h3>Ethics &amp; privacy</h3>
<ul>
<li><strong>Public ≠ free-for-all.</strong> Analyse aggregate patterns; don't build creepy profiles of named individuals.</li>
<li><strong>Personal data law</strong> — Vietnam's <strong>Nghị định 13/2023/NĐ-CP (PDPD)</strong> and the EU <strong>GDPR</strong> govern how personal data is collected and used.</li>
<li><strong>Platform terms</strong> — respect each network's terms of service and rate limits.</li>
<li><strong>No manipulation</strong> — listen to understand, not to astroturf or harass.</li>
</ul>
<div class="callout"><span class="badge">Finish the loop</span> Listening only pays off at step 4: <strong>action</strong>. Report the number, name the insight, recommend the move — then measure whether it worked, and listen again.</div>`,
    `<span class="eyebrow">SLN301 · Chương 8 · Bài 8.1</span>
<h2>Báo cáo, KPI &amp; đạo đức</h2>
<h3>Dashboard &amp; KPI</h3>
<p>Một báo cáo chỉ hữu ích khi người ra quyết định hành động theo nó. Dẫn đầu bằng vài <strong>KPI</strong>, không phải bức tường biểu đồ:</p>
<ul>
<li><strong>Volume</strong> &amp; xu hướng · <strong>Tỷ lệ sentiment</strong> · <strong>Share of voice</strong></li>
<li><strong>Reach / tương tác</strong> · <strong>Chủ đề nổi bật</strong> · <strong>Nguồn / influencer hàng đầu</strong></li>
</ul>
<h3>Listening → chiến lược</h3>
<p>Kết mỗi báo cáo bằng <strong>"vậy thì sao → giờ làm gì"</strong>: mỗi insight đi kèm một hành động cụ thể cho nội dung, sản phẩm hay chăm sóc khách. Một chỉ số không kèm khuyến nghị là một báo cáo hụt.</p>
<pre><code>Insight  -> Khuyến nghị          -> Người phụ trách
spike tiêu cực về giao hàng -> thêm SLA + mẫu xin lỗi -> Vận hành
white space "tiện học/làm" -> chiến dịch góc học bài  -> Marketing
</code></pre>
<h3>Đạo đức &amp; quyền riêng tư</h3>
<ul>
<li><strong>Công khai ≠ muốn làm gì thì làm.</strong> Phân tích quy luật tổng hợp; đừng dựng hồ sơ soi mói từng cá nhân có tên.</li>
<li><strong>Luật dữ liệu cá nhân</strong> — <strong>Nghị định 13/2023/NĐ-CP (PDPD)</strong> của Việt Nam và <strong>GDPR</strong> của EU chi phối cách thu thập, dùng dữ liệu cá nhân.</li>
<li><strong>Điều khoản nền tảng</strong> — tôn trọng ToS và giới hạn tần suất của từng mạng.</li>
<li><strong>Không thao túng</strong> — nghe để hiểu, không để tạo dư luận giả hay quấy rối.</li>
</ul>
<div class="callout"><span class="badge">Khép vòng lặp</span> Listening chỉ sinh lời ở bước 4: <strong>hành động</strong>. Báo con số, gọi tên insight, khuyến nghị nước đi — rồi đo xem có hiệu quả, và nghe lại.</div>`,
  ]]);
const c8q = quiz('sln301-quiz-8', 'Quiz 8 — Reporting & ethics|||Quiz 8 — Báo cáo & đạo đức', [
  { id: 'q1', question: 'Điều làm một báo cáo listening thực sự hữu ích?|||What makes a listening report actually useful?', options: ['Càng nhiều biểu đồ càng tốt', 'Mỗi insight đi kèm một khuyến nghị hành động cụ thể', 'Chỉ hiển thị volume', 'Dùng nhiều màu'], correctIndex: 1, explanation: 'Chỉ số không kèm khuyến nghị là báo cáo hụt; phải có "so what → now what".' },
  { id: 'q2', question: 'Văn bản luật nào ở Việt Nam chi phối dữ liệu cá nhân?|||Which Vietnamese law governs personal data?', options: ['Luật Giao thông', 'Nghị định 13/2023/NĐ-CP (PDPD)', 'Luật Doanh nghiệp', 'Không có luật nào'], correctIndex: 1, explanation: 'Nghị định 13/2023/NĐ-CP (PDPD) điều chỉnh bảo vệ dữ liệu cá nhân ở VN.' },
  { id: 'q3', question: 'Nguyên tắc đạo đức đúng khi làm social listening?|||A correct ethics principle for social listening?', options: ['Dựng hồ sơ soi mói từng cá nhân', 'Phân tích quy luật tổng hợp, tôn trọng ToS & luật, không thao túng dư luận', 'Tạo tài khoản giả để tăng buzz', 'Bỏ qua quyền riêng tư vì dữ liệu công khai'], correctIndex: 1, explanation: 'Phân tích tổng hợp, đúng luật/ToS, không astroturf — đó là listening có đạo đức.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'SLN301',
    slug: 'sln301-social-listening',
    title: 'Social Listening',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SLN301.webp',
    shortDescription: 'Social listening A–Z: vs monitoring, the social-data ecosystem, boolean queries & Vietnamese filters, sentiment & topics, share of voice, brand health & crisis alerts, consumer insight, competitor benchmarking, listening → strategy & data ethics. Real tools.|||Social listening A–Z: khác monitoring, hệ dữ liệu xã hội, truy vấn boolean & lọc tiếng Việt, sentiment & chủ đề, share of voice, sức khỏe thương hiệu & khủng hoảng, insight, so kè đối thủ, listening → chiến lược & đạo đức dữ liệu.',
    description: 'Môn <strong>SLN301 — Social Listening</strong> (khối Công nghệ Truyền thông, kỳ 4) dạy bạn <strong>lắng nghe mạng xã hội</strong> và biến hội thoại của hàng triệu người thành quyết định. Đi từ <strong>listening khác monitoring</strong> &amp; hệ sinh thái dữ liệu → <strong>truy vấn boolean &amp; lọc tiếng Việt</strong> → <strong>sentiment, chủ đề &amp; share of voice</strong> → <strong>sức khỏe thương hiệu &amp; phát hiện khủng hoảng</strong> → <strong>insight người dùng &amp; xu hướng</strong> → <strong>so kè đối thủ &amp; nghe cả ngành</strong> → <strong>báo cáo, KPI &amp; đạo đức dữ liệu</strong>. Song ngữ, có công cụ thật (Brandwatch, Sprout, Talkwalker, YouNet, Buzzmetrics) và ví dụ chiến dịch/khủng hoảng thật, quiz mỗi chương.',
    whatYouLearn: 'Phân biệt listening &amp; monitoring; hệ sinh thái nguồn dữ liệu, mention &amp; buzz, API vs crawl; dựng truy vấn boolean (AND/OR/NOT) &amp; loại nhiễu, bẫy tiếng Việt; sentiment analysis, topic/theme, share of voice; brand health &amp; phát hiện khủng hoảng bằng cảnh báo spike; consumer insight, trend spotting, nhận diện influencer; competitive benchmarking &amp; category listening; dashboard, KPI, biến insight thành chiến lược; đạo đức &amp; luật dữ liệu (Nghị định 13/2023, GDPR).',
    requirements: 'Không cần nền kỹ thuật. Nên có tài khoản mạng xã hội để quan sát thực tế và, nếu có thể, bản dùng thử của một công cụ listening (Brandwatch/Sprout/Talkwalker) hoặc tham khảo báo cáo của YouNet Media/Buzzmetrics.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, academy nền tảng thật, sách, công cụ VN, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Social listening là gì, lộ trình 4 bước Nghe → Phân tích → Insight → Hành động.', lessons: [intro] },
    { title: 'Chương 1 — Social listening là gì|||Chapter 1 — What is social listening', description: 'Listening vs monitoring, giá trị, use case.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Hệ sinh thái dữ liệu|||Chapter 2 — Social-data ecosystem', description: 'Nguồn dữ liệu, mention & buzz, API/crawl, nền tảng.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Truy vấn & bộ lọc|||Chapter 3 — Queries & filters', description: 'Keyword, boolean, loại nhiễu, tiếng Việt.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Sentiment & chủ đề|||Chapter 4 — Sentiment & topics', description: 'Sentiment, topic/theme, share of voice.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Thương hiệu & khủng hoảng|||Chapter 5 — Brand & crisis', description: 'Brand health, phát hiện khủng hoảng, cảnh báo sớm.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Insight & xu hướng|||Chapter 6 — Insight & trends', description: 'Consumer insight, trend spotting, influencer.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Đối thủ & thị trường|||Chapter 7 — Competitor & category', description: 'Benchmarking, category listening, white space.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Báo cáo & hành động|||Chapter 8 — Reporting & action', description: 'Dashboard, KPI, insight → chiến lược, đạo đức.', lessons: [c8, c8q] },
  ],
};
