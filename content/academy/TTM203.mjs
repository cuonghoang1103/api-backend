/**
 * TTM203 — Consumer behavior in Tourism. Giáo trình tham khảo: "Consumer
 * Behaviour in Tourism" (Swarbrooke & Horner), "The Tourist Gaze" (Urry),
 * "Consumer Behavior" (Solomon). Khối Quản trị Kinh doanh (BBA — Du lịch),
 * FPTU, Kỳ 5. Trọng tâm: HÀNH VI người tiêu dùng (động cơ, nhận thức, ra
 * quyết định, tâm lý khách) — khác TTM201 (nhập môn ngành) và TTM202 (quản
 * trị điểm đến & marketing). Song ngữ + ví dụ + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ttm203-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách nền (Swarbrooke & Horner, Urry, Solomon), tài liệu chính thức, YouTube, công cụ nghiên cứu hành vi, lộ trình tự học.',
  [[
    `<span class="eyebrow">TTM203 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to study <strong>consumer behavior in tourism</strong> — motivation, perception, decision-making, experience &amp; loyalty — in one place. Full official slides live on <strong>FLM</strong>; below are free, legal references.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for TTM203 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Consumer Behaviour in Tourism</em> — John Swarbrooke &amp; Susan Horner (the core text this module follows: motivation, decision-making, and the tourist as a consumer).</li>
<li><em>The Tourist Gaze</em> — John Urry (how tourists perceive and construct meaning from what they see and experience).</li>
<li><em>Consumer Behavior</em> — Michael R. Solomon (the general consumer-behavior toolkit — perception, attitudes, culture, decision process — applied here to travel).</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.e-unwto.org/" target="_blank" rel="noopener">UNWTO e-library</a> — reports on tourism demand &amp; traveller trends.</li>
<li><a href="https://www.tourismnotes.com/" target="_blank" rel="noopener">TourismNotes</a> — free study notes on consumer behavior in tourism.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@MarketingWithMalak" target="_blank" rel="noopener">Marketing 101 style channels on consumer behavior</a> — search "consumer behavior in tourism" for lecture recordings.</li>
<li><a href="https://www.youtube.com/@SkillshareEDU" target="_blank" rel="noopener">Tourism &amp; hospitality lecture playlists</a> — motivation models (push-pull, Plog) explained visually.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.surveymonkey.com/" target="_blank" rel="noopener">SurveyMonkey</a> / <a href="https://forms.google.com/" target="_blank" rel="noopener">Google Forms</a> — survey traveller motivation &amp; satisfaction.</li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — map the tourist decision journey &amp; touchpoints.</li>
<li><a href="https://trends.google.com/" target="_blank" rel="noopener">Google Trends</a> — track search-driven travel demand as a proxy for motivation.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — definition of consumer behavior in tourism, push-pull motivation, Maslow, the 5-stage decision process.</li>
<li><strong>Practice</strong> — profile a traveller persona: motivation, perception, decision stages, post-trip review.</li>
<li><strong>Go deeper</strong> — culture &amp; reference groups, satisfaction/loyalty models, digital &amp; post-COVID consumer trends.</li>
<li><strong>Job-ready</strong> — turn behavioral insight into segmentation, messaging and experience design for a real product.</li>
</ol></div>`,
    `<span class="eyebrow">TTM203 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>hành vi người tiêu dùng du lịch</strong> — động cơ, nhận thức, ra quyết định, trải nghiệm &amp; lòng trung thành — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của TTM203 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Consumer Behaviour in Tourism</em> — John Swarbrooke &amp; Susan Horner (sách nền của môn: động cơ, ra quyết định, khách du lịch với vai trò người tiêu dùng).</li>
<li><em>The Tourist Gaze</em> — John Urry (khách du lịch nhận thức và tạo nghĩa từ điều họ nhìn thấy, trải nghiệm ra sao).</li>
<li><em>Consumer Behavior</em> — Michael R. Solomon (bộ công cụ hành vi tiêu dùng tổng quát — nhận thức, thái độ, văn hoá, quá trình quyết định — áp dụng vào du lịch).</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.e-unwto.org/" target="_blank" rel="noopener">Thư viện điện tử UNWTO</a> — báo cáo nhu cầu du lịch &amp; xu hướng khách.</li>
<li><a href="https://www.tourismnotes.com/" target="_blank" rel="noopener">TourismNotes</a> — ghi chú tự học miễn phí về hành vi tiêu dùng du lịch.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@MarketingWithMalak" target="_blank" rel="noopener">Kênh marketing cơ bản về hành vi tiêu dùng</a> — tìm "consumer behavior in tourism" để có bản ghi bài giảng.</li>
<li><a href="https://www.youtube.com/@SkillshareEDU" target="_blank" rel="noopener">Playlist bài giảng du lịch &amp; khách sạn</a> — mô hình động cơ (push-pull, Plog) minh hoạ trực quan.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.surveymonkey.com/" target="_blank" rel="noopener">SurveyMonkey</a> / <a href="https://forms.google.com/" target="_blank" rel="noopener">Google Forms</a> — khảo sát động cơ &amp; sự hài lòng của khách.</li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — vẽ hành trình ra quyết định &amp; điểm chạm của khách.</li>
<li><a href="https://trends.google.com/" target="_blank" rel="noopener">Google Trends</a> — theo dõi nhu cầu du lịch qua tìm kiếm, một chỉ báo động cơ.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — định nghĩa hành vi tiêu dùng du lịch, động cơ push-pull, Maslow, quy trình 5 bước ra quyết định.</li>
<li><strong>Luyện tập</strong> — dựng persona một khách du lịch: động cơ, nhận thức, các bước quyết định, đánh giá sau chuyến đi.</li>
<li><strong>Đào sâu</strong> — văn hoá &amp; nhóm tham chiếu, mô hình hài lòng/trung thành, xu hướng số hoá &amp; hậu COVID.</li>
<li><strong>Sẵn sàng đi làm</strong> — biến hiểu biết hành vi thành phân khúc, thông điệp và thiết kế trải nghiệm cho sản phẩm thật.</li>
</ol></div>`,
  ]]);

const intro = doc('ttm203-0-1-overview', 'Course overview: Consumer Behavior in Tourism|||Tổng quan: Hành vi Người tiêu dùng Du lịch',
  'Hành vi tiêu dùng du lịch là gì, khác TTM201/TTM202 ra sao, lộ trình 8 chương: động cơ → nhận thức/thái độ → cá nhân/tâm lý → văn hoá/xã hội → ra quyết định → trải nghiệm/trung thành → xu hướng mới.',
  [[
    `<span class="eyebrow">TTM203 · Lesson 0.1 · Overview</span>
<h2>Consumer Behavior in Tourism</h2>
<p class="lead">This course studies the <strong>tourist as a consumer</strong> — why people travel, how they choose a destination or a package, and what makes them come back. Unlike TTM201 (the industry's structure) or TTM202 (destination management &amp; marketing), TTM203 looks INSIDE the traveller's head: motivation, perception, personality, culture, and the decision process behind every booking.</p>
<h3>Why this matters</h3>
<p>A tour operator, a DMO or a hotel can only design the right product, price and message once it understands <em>why</em> a tourist wants to travel and <em>how</em> they choose between options. Consumer behavior is the missing "why" behind the "what" of TTM201/TTM202.</p>
<h3>Roadmap — 8 chapters</h3>
<ul>
<li><strong>Ch.1</strong> Overview of consumer behavior in tourism &amp; why it matters</li>
<li><strong>Ch.2</strong> Travel motivation — push-pull, Maslow, Plog</li>
<li><strong>Ch.3</strong> Perception, learning &amp; attitudes of tourists</li>
<li><strong>Ch.4</strong> Personal &amp; psychological factors — personality, lifestyle, emotion</li>
<li><strong>Ch.5</strong> Cultural &amp; social factors shaping travel choice</li>
<li><strong>Ch.6</strong> The decision-making &amp; purchase process for travel products</li>
<li><strong>Ch.7</strong> Experience, satisfaction &amp; tourist loyalty</li>
<li><strong>Ch.8</strong> New consumer trends — digital, sustainable, review-driven, post-COVID</li>
</ul>
<div class="callout"><span class="badge">One thread</span> Every chapter answers one link in the same chain: <strong>motive → perception → decision → experience → loyalty</strong>. Keep that chain in mind and the whole module becomes one story, not eight separate topics.</div>`,
    `<span class="eyebrow">TTM203 · Bài 0.1 · Tổng quan</span>
<h2>Hành vi Người tiêu dùng Du lịch</h2>
<p class="lead">Môn này nghiên cứu <strong>khách du lịch với vai trò người tiêu dùng</strong> — vì sao người ta đi du lịch, họ chọn điểm đến hay gói tour thế nào, và điều gì khiến họ quay lại. Khác với TTM201 (cấu trúc ngành) hay TTM202 (quản trị điểm đến &amp; marketing), TTM203 nhìn VÀO BÊN TRONG đầu khách: động cơ, nhận thức, nhân cách, văn hoá, và quá trình ra quyết định phía sau mỗi lần đặt tour.</p>
<h3>Vì sao quan trọng</h3>
<p>Một công ty lữ hành, DMO hay khách sạn chỉ thiết kế đúng sản phẩm, giá và thông điệp khi hiểu <em>vì sao</em> khách muốn đi và <em>làm sao</em> họ chọn giữa các lựa chọn. Hành vi tiêu dùng là phần "vì sao" còn thiếu phía sau phần "cái gì" của TTM201/TTM202.</p>
<h3>Lộ trình — 8 chương</h3>
<ul>
<li><strong>C.1</strong> Tổng quan hành vi tiêu dùng du lịch &amp; tầm quan trọng</li>
<li><strong>C.2</strong> Động cơ du lịch — push-pull, Maslow, Plog</li>
<li><strong>C.3</strong> Nhận thức, học tập &amp; thái độ của khách du lịch</li>
<li><strong>C.4</strong> Yếu tố cá nhân &amp; tâm lý — nhân cách, lối sống, cảm xúc</li>
<li><strong>C.5</strong> Yếu tố văn hoá &amp; xã hội ảnh hưởng lựa chọn du lịch</li>
<li><strong>C.6</strong> Quá trình ra quyết định &amp; mua sản phẩm du lịch</li>
<li><strong>C.7</strong> Trải nghiệm, sự hài lòng &amp; lòng trung thành của khách</li>
<li><strong>C.8</strong> Xu hướng tiêu dùng du lịch mới — số hoá, bền vững, review, hậu COVID</li>
</ul>
<div class="callout"><span class="badge">Một mạch xuyên suốt</span> Mỗi chương trả lời một mắt xích trong cùng chuỗi: <strong>động cơ → nhận thức → quyết định → trải nghiệm → trung thành</strong>. Nhớ chuỗi này thì cả môn trở thành một câu chuyện, không phải tám chủ đề rời rạc.</div>`,
  ]]);

const c1 = doc('ttm203-1-1-overview-importance', '1.1 — What is consumer behavior in tourism, and why it matters|||1.1 — Hành vi tiêu dùng du lịch là gì và vì sao quan trọng',
  'Định nghĩa hành vi tiêu dùng du lịch; đặc điểm riêng của sản phẩm du lịch (vô hình, không thể sở hữu/hoàn trả, cảm xúc cao, dựa vào truyền miệng); mô hình "hộp đen" đầu vào-xử lý-đầu ra; giá trị thực tiễn cho marketer.',
  [[
    `<span class="eyebrow">TTM203 · Chapter 1 · Lesson 1.1</span>
<h2>What is consumer behavior in tourism?</h2>
<p><strong>Consumer behavior in tourism</strong> is the study of how individuals select, book, experience and evaluate travel products and services to satisfy their needs — and how they behave afterward (share, rebook, complain).</p>
<h3>Why travel behavior is different</h3>
<ul>
<li><strong>Intangible &amp; unownable</strong> — you cannot inspect a holiday before buying it, and you cannot return it if it disappoints.</li>
<li><strong>High involvement</strong> — trips are expensive, infrequent and emotionally loaded; buyers research heavily.</li>
<li><strong>Consumed as an experience</strong> — satisfaction depends on service delivery, other tourists, weather, mood — not a fixed product.</li>
<li><strong>Long, risky decision</strong> — booked far in advance, hard to reverse, so perceived risk (financial, safety, social) looms large.</li>
<li><strong>Word-of-mouth &amp; reviews dominate</strong> — because you can't "test" a trip, other travellers' experiences (and now online reviews) substitute for trial.</li>
</ul>
<h3>The basic model</h3>
<pre><code>Stimuli (marketing, destination image, social influence)
        -> Consumer "black box" (motivation, perception, attitude, decision process)
        -> Response (destination/product choice, satisfaction, loyalty, word-of-mouth)
</code></pre>
<p>The rest of this module opens that "black box" chapter by chapter.</p>
<div class="callout"><span class="badge">Why practitioners care</span> Understanding tourist behavior lets a business segment the market correctly, design the right experience, price with confidence, and write messages that match the traveller's real motive — not a guess.</div>`,
    `<span class="eyebrow">TTM203 · Chương 1 · Bài 1.1</span>
<h2>Hành vi tiêu dùng du lịch là gì?</h2>
<p><strong>Hành vi tiêu dùng du lịch</strong> là nghiên cứu về cách cá nhân lựa chọn, đặt, trải nghiệm và đánh giá sản phẩm/dịch vụ du lịch để thoả mãn nhu cầu — và cách họ hành xử sau đó (chia sẻ, đặt lại, khiếu nại).</p>
<h3>Vì sao hành vi du lịch khác biệt</h3>
<ul>
<li><strong>Vô hình &amp; không thể sở hữu</strong> — không thể "xem trước" một kỳ nghỉ trước khi mua, và không thể trả lại nếu thất vọng.</li>
<li><strong>Mức độ liên quan cao</strong> — chuyến đi đắt, ít xảy ra, và nặng cảm xúc; người mua tìm hiểu rất kỹ.</li>
<li><strong>Tiêu dùng dưới dạng trải nghiệm</strong> — sự hài lòng phụ thuộc vào cách phục vụ, những khách khác, thời tiết, tâm trạng — không phải một sản phẩm cố định.</li>
<li><strong>Quyết định dài, rủi ro</strong> — đặt trước lâu, khó đảo ngược, nên rủi ro cảm nhận (tài chính, an toàn, xã hội) rất lớn.</li>
<li><strong>Truyền miệng &amp; review chiếm ưu thế</strong> — vì không thể "thử" một chuyến đi, kinh nghiệm của khách khác (và review trực tuyến) thay cho việc thử trước.</li>
</ul>
<h3>Mô hình cơ bản</h3>
<pre><code>Kích thích (marketing, hình ảnh điểm đến, ảnh hưởng xã hội)
        -> "Hộp đen" người tiêu dùng (động cơ, nhận thức, thái độ, quá trình quyết định)
        -> Phản hồi (chọn điểm đến/sản phẩm, hài lòng, trung thành, truyền miệng)
</code></pre>
<p>Phần còn lại của môn sẽ mở "hộp đen" đó theo từng chương.</p>
<div class="callout"><span class="badge">Vì sao người làm nghề cần biết</span> Hiểu hành vi khách du lịch giúp doanh nghiệp phân khúc đúng thị trường, thiết kế đúng trải nghiệm, định giá tự tin, và viết thông điệp khớp với động cơ thật của khách — không phải đoán.</div>`,
  ]]);

const c1q = quiz('ttm203-quiz-1', 'Quiz 1 — Overview & importance|||Quiz 1 — Tổng quan & tầm quan trọng', [
  { id: 'q1', question: 'Đặc điểm nào KHÔNG đúng với sản phẩm du lịch (so với hàng hoá thông thường)?', options: ['Vô hình, không xem trước được', 'Có thể hoàn trả dễ dàng nếu không hài lòng', 'Mức độ liên quan (involvement) cao khi mua', 'Phụ thuộc nhiều vào truyền miệng/review'], correctIndex: 1, explanation: 'Một kỳ nghỉ không thể "trả lại" như hàng hoá — đây chính là điểm khác biệt lớn của hành vi tiêu dùng du lịch.' },
  { id: 'q2', question: 'Mô hình "hộp đen" trong hành vi tiêu dùng mô tả điều gì?', options: ['Chỉ giá cả quyết định lựa chọn', 'Kích thích bên ngoài đi qua xử lý bên trong người tiêu dùng rồi tạo ra phản hồi', 'Khách du lịch luôn quyết định ngẫu nhiên', 'Doanh nghiệp kiểm soát hoàn toàn quyết định của khách'], correctIndex: 1, explanation: 'Kích thích (marketing, ảnh hưởng xã hội...) → "hộp đen" (động cơ, nhận thức, thái độ) → phản hồi (chọn, hài lòng, truyền miệng).' },
  { id: 'q3', question: 'Vì sao hiểu hành vi tiêu dùng du lịch quan trọng với marketer?', options: ['Để tăng giá tuỳ ý', 'Để phân khúc, thiết kế trải nghiệm và viết thông điệp đúng động cơ thật của khách', 'Vì luật pháp yêu cầu', 'Chỉ để làm báo cáo nội bộ'], correctIndex: 1, explanation: 'Biết "vì sao" khách muốn đi giúp thiết kế đúng sản phẩm, giá và thông điệp — thay vì đoán.' },
]);

const c2 = doc('ttm203-2-1-motivation', '2.1 — Travel motivation: push-pull, Maslow, Plog|||2.1 — Động cơ du lịch: push-pull, Maslow, Plog',
  'Động cơ đẩy (push, nội tại: thoát khỏi thường nhật, nghỉ ngơi, giao tiếp xã hội) vs kéo (pull, ngoại tại: thuộc tính điểm đến); tháp nhu cầu Maslow áp vào du lịch; thang tâm lý Plog (psychocentric–allocentric).',
  [[
    `<span class="eyebrow">TTM203 · Chapter 2 · Lesson 2.1</span>
<h2>Travel motivation</h2>
<h3>Push vs. pull factors</h3>
<ul>
<li><strong>Push factors</strong> (internal, "why leave home") — escape from routine, relaxation, self-esteem, novelty, social interaction, family bonding.</li>
<li><strong>Pull factors</strong> (external, "why choose THIS place") — attractions, climate, culture, price, safety, accessibility.</li>
</ul>
<p>Push decides <em>whether</em> and <em>why</em> to travel; pull decides <em>where</em>. A tourist may be pushed by "need to escape stress" and pulled toward a beach destination by "warm climate + affordable price".</p>
<h3>Maslow's hierarchy applied to travel</h3>
<pre><code>Self-actualization -> travel for personal growth, learning, transformation
Esteem             -> travel for status, achievement, bragging rights
Social             -> travel to bond with family/friends, belonging
Safety             -> travel for security, health, familiar comfort
Physiological      -> rest, sleep, escape physical fatigue
</code></pre>
<p>Most trips satisfy several levels at once — a beach holiday can be both "rest" (physiological) and "bonding" (social).</p>
<h3>Plog's psychographic scale</h3>
<p><strong>Stanley Plog</strong> placed travellers on a spectrum: <strong>psychocentric</strong> (anxious, prefers familiar, packaged, close-to-home destinations) versus <strong>allocentric</strong> (venturer, seeks novelty, adventure, unfamiliar destinations) — with most travellers falling in the <strong>midcentric</strong> middle.</p>
<div class="callout"><span class="badge">Practical use</span> Push tells the marketer WHICH emotional need to speak to; pull tells them WHICH destination features to highlight; Plog tells them HOW adventurous the messaging can be.</div>`,
    `<span class="eyebrow">TTM203 · Chương 2 · Bài 2.1</span>
<h2>Động cơ du lịch</h2>
<h3>Yếu tố đẩy (push) và kéo (pull)</h3>
<ul>
<li><strong>Push (nội tại, "vì sao muốn rời khỏi nhà")</strong> — thoát khỏi thường nhật, nghỉ ngơi, khẳng định bản thân, tìm cái mới, giao tiếp xã hội, gắn kết gia đình.</li>
<li><strong>Pull (ngoại tại, "vì sao chọn NƠI NÀY")</strong> — điểm hấp dẫn, khí hậu, văn hoá, giá cả, an toàn, khả năng tiếp cận.</li>
</ul>
<p>Push quyết định <em>có đi hay không</em> và <em>vì sao</em>; pull quyết định <em>đi đâu</em>. Một khách có thể bị đẩy bởi "cần thoát khỏi căng thẳng" và bị kéo về một điểm biển vì "khí hậu ấm + giá hợp lý".</p>
<h3>Tháp nhu cầu Maslow áp vào du lịch</h3>
<pre><code>Tự hoàn thiện     -> đi để phát triển bản thân, học hỏi, chuyển hoá
Được tôn trọng    -> đi để có địa vị, thành tích, "khoe" trải nghiệm
Xã hội            -> đi để gắn kết gia đình/bạn bè, thuộc về nhóm
An toàn           -> đi để an tâm, sức khoẻ, sự quen thuộc
Sinh lý           -> nghỉ ngơi, ngủ, thoát mệt mỏi thể chất
</code></pre>
<p>Hầu hết chuyến đi thoả nhiều tầng cùng lúc — một kỳ nghỉ biển vừa là "nghỉ ngơi" (sinh lý) vừa là "gắn kết" (xã hội).</p>
<h3>Thang tâm lý Plog</h3>
<p><strong>Stanley Plog</strong> đặt khách du lịch trên một dải: <strong>psychocentric</strong> (hay lo lắng, thích sự quen thuộc, tour đóng gói, gần nhà) đến <strong>allocentric</strong> (ưa mạo hiểm, tìm cái mới, điểm đến chưa quen) — phần lớn khách nằm ở giữa, <strong>midcentric</strong>.</p>
<div class="callout"><span class="badge">Ứng dụng thực tế</span> Push cho marketer biết nên đánh vào nhu cầu cảm xúc nào; pull cho biết nên nhấn thuộc tính nào của điểm đến; Plog cho biết thông điệp có thể "mạo hiểm" tới đâu.</div>`,
  ]]);

const c2q = quiz('ttm203-quiz-2', 'Quiz 2 — Travel motivation|||Quiz 2 — Động cơ du lịch', [
  { id: 'q1', question: 'Yếu tố "push" trong động cơ du lịch là gì?', options: ['Thuộc tính của điểm đến như khí hậu, giá', 'Động cơ nội tại khiến người ta muốn rời khỏi thường nhật', 'Chính sách visa của quốc gia', 'Loại phương tiện vận chuyển'], correctIndex: 1, explanation: 'Push là động cơ nội tại (thoát khỏi thường nhật, nghỉ ngơi, giao tiếp xã hội...) quyết định CÓ đi và VÌ SAO đi.' },
  { id: 'q2', question: 'Theo thang Plog, khách "allocentric" có xu hướng?', options: ['Thích tour đóng gói, gần nhà, quen thuộc', 'Ưa mạo hiểm, tìm điểm đến mới lạ, chưa quen', 'Không bao giờ đi du lịch', 'Chỉ đi cùng gia đình lớn'], correctIndex: 1, explanation: 'Allocentric (venturer) tìm sự mới lạ và mạo hiểm; psychocentric thì ngược lại, thích sự quen thuộc.' },
  { id: 'q3', question: 'Một chuyến du lịch có thể thoả mãn đồng thời nhu cầu "nghỉ ngơi" (sinh lý) và "gắn kết gia đình" (xã hội) theo Maslow — điều này cho thấy gì?', options: ['Maslow không áp dụng được cho du lịch', 'Một chuyến đi thường thoả nhiều tầng nhu cầu cùng lúc', 'Chỉ tầng cao nhất mới liên quan đến du lịch', 'Nhu cầu sinh lý và xã hội loại trừ nhau'], correctIndex: 1, explanation: 'Hầu hết chuyến đi đáp ứng nhiều tầng nhu cầu Maslow đồng thời, không chỉ một tầng duy nhất.' },
]);

const c3 = doc('ttm203-3-1-perception-learning-attitude', '3.1 — Perception, learning & attitudes of tourists|||3.1 — Nhận thức, học tập & thái độ của khách du lịch',
  'Nhận thức có chọn lọc & hình ảnh điểm đến; học tập qua kinh nghiệm và điều kiện hoá (loyalty với hãng bay/khách sạn); mô hình thái độ ba thành phần (nhận thức-cảm xúc-hành vi).',
  [[
    `<span class="eyebrow">TTM203 · Chapter 3 · Lesson 3.1</span>
<h2>Perception, learning &amp; attitudes</h2>
<h3>Perception &amp; destination image</h3>
<p>Tourists don't react to reality — they react to their <strong>perception</strong> of it, filtered through <strong>selective attention</strong> (we notice what matches our interests), <strong>selective distortion</strong> (we interpret ambiguous cues to fit expectations) and <strong>selective retention</strong> (we remember what confirms our beliefs). Marketing, media and word-of-mouth build a <strong>destination image</strong> long before the trip — often more decisive than the destination's actual features.</p>
<h3>Learning from experience</h3>
<p>Tourists learn through <strong>classical conditioning</strong> (a brand jingle or logo repeatedly paired with pleasant travel imagery becomes associated with "good trip") and <strong>operant conditioning</strong> (a smooth check-in and a loyalty reward reinforce booking the same airline/hotel again). This is the psychological engine behind loyalty programs.</p>
<h3>The tri-component attitude model</h3>
<pre><code>Cognitive  (belief)   -> "This resort has great reviews"
Affective  (feeling)  -> "I feel excited about it"
Behavioral (intention) -> "I will book it"
</code></pre>
<p>A positive attitude formed before the trip strongly predicts booking; a negative one (from a bad review, say) can block a sale before it ever starts.</p>
<div class="callout"><span class="badge">Key insight</span> The tourist doesn't buy the destination as it is — they buy the <em>image</em> they've perceived and the <em>attitude</em> they've formed about it.</div>`,
    `<span class="eyebrow">TTM203 · Chương 3 · Bài 3.1</span>
<h2>Nhận thức, học tập &amp; thái độ</h2>
<h3>Nhận thức &amp; hình ảnh điểm đến</h3>
<p>Khách du lịch không phản ứng với thực tế — họ phản ứng với <strong>nhận thức</strong> của mình về thực tế đó, được lọc qua <strong>chú ý có chọn lọc</strong> (chỉ để ý những gì khớp sở thích), <strong>bóp méo có chọn lọc</strong> (diễn giải thông tin mơ hồ theo kỳ vọng có sẵn) và <strong>ghi nhớ có chọn lọc</strong> (nhớ những gì xác nhận niềm tin sẵn có). Marketing, truyền thông và truyền miệng xây <strong>hình ảnh điểm đến</strong> từ rất lâu trước chuyến đi — nhiều khi quyết định hơn cả thuộc tính thật của điểm đến.</p>
<h3>Học tập qua kinh nghiệm</h3>
<p>Khách du lịch học qua <strong>điều kiện hoá cổ điển</strong> (một jingle hay logo thương hiệu lặp đi lặp lại cùng hình ảnh du lịch dễ chịu sẽ gắn với "chuyến đi tốt") và <strong>điều kiện hoá thao tác</strong> (thủ tục check-in suôn sẻ và phần thưởng tích điểm củng cố việc đặt lại đúng hãng bay/khách sạn đó). Đây chính là cơ chế tâm lý phía sau các chương trình khách hàng thân thiết.</p>
<h3>Mô hình thái độ ba thành phần</h3>
<pre><code>Nhận thức (niềm tin)  -> "Khu resort này có review tốt"
Cảm xúc (cảm nhận)    -> "Tôi thấy hào hứng về nó"
Hành vi (ý định)      -> "Tôi sẽ đặt nó"
</code></pre>
<p>Thái độ tích cực hình thành trước chuyến đi dự báo mạnh việc đặt tour; thái độ tiêu cực (do một review xấu, chẳng hạn) có thể chặn đứng giao dịch trước khi nó bắt đầu.</p>
<div class="callout"><span class="badge">Điểm mấu chốt</span> Khách du lịch không mua điểm đến như nó thật sự là — họ mua <em>hình ảnh</em> họ đã nhận thức và <em>thái độ</em> họ đã hình thành về nó.</div>`,
  ]]);

const c3q = quiz('ttm203-quiz-3', 'Quiz 3 — Perception, learning & attitude|||Quiz 3 — Nhận thức, học tập & thái độ', [
  { id: 'q1', question: '"Chú ý có chọn lọc" (selective attention) trong nhận thức khách du lịch nghĩa là?', options: ['Khách nhớ hết mọi thông tin nhận được', 'Khách chỉ để ý những thông tin khớp với sở thích/nhu cầu của họ', 'Khách luôn tin quảng cáo tuyệt đối', 'Khách không bị ảnh hưởng bởi truyền thông'], correctIndex: 1, explanation: 'Selective attention: con người chỉ chú ý những kích thích phù hợp với nhu cầu, sở thích sẵn có của mình.' },
  { id: 'q2', question: 'Chương trình khách hàng thân thiết (loyalty program) của hãng bay/khách sạn dựa trên cơ chế học tập nào?', options: ['Điều kiện hoá thao tác (operant conditioning) — thưởng củng cố hành vi đặt lại', 'Nhận thức có chọn lọc', 'Tháp nhu cầu Maslow', 'Thang Plog'], correctIndex: 0, explanation: 'Phần thưởng tích điểm là một dạng "reinforcement", củng cố hành vi lặp lại việc đặt cùng thương hiệu.' },
  { id: 'q3', question: 'Trong mô hình thái độ ba thành phần, "Tôi sẽ đặt resort này" thuộc thành phần nào?', options: ['Nhận thức (cognitive)', 'Cảm xúc (affective)', 'Hành vi/ý định (behavioral)', 'Không thuộc thành phần nào'], correctIndex: 2, explanation: 'Ý định hành động ("sẽ đặt") là thành phần hành vi (behavioral) của thái độ.' },
]);

const c4 = doc('ttm203-4-1-personal-psychological', '4.1 — Personal & psychological factors: personality, lifestyle, emotion|||4.1 — Yếu tố cá nhân & tâm lý: nhân cách, lối sống, cảm xúc',
  'Nhân cách & phong cách du lịch; vòng đời & yếu tố cá nhân (tuổi, thu nhập, nghề nghiệp); lối sống theo khung AIO (hoạt động-quan tâm-quan điểm); vai trò cảm xúc (kỳ vọng, hào hứng, lo lắng) trong quyết định du lịch.',
  [[
    `<span class="eyebrow">TTM203 · Chapter 4 · Lesson 4.1</span>
<h2>Personal &amp; psychological factors</h2>
<h3>Personality &amp; travel style</h3>
<p>Personality traits shape travel preferences: an <strong>extraverted</strong> traveller may seek group tours and nightlife; an <strong>introverted</strong> one may prefer quiet, independent trips. A traveller high in <strong>openness</strong> gravitates toward novel, unfamiliar destinations (echoing Plog's allocentric type from Chapter 2).</p>
<h3>Life-stage &amp; personal factors</h3>
<p>Age, income, occupation and family life-cycle stage (single, young couple, family with children, empty-nester, retiree) strongly shape what, when and how someone travels — a family with young children books differently than a retired couple.</p>
<h3>Lifestyle — the AIO framework</h3>
<pre><code>Activities -> what a person DOES (sports, dining out, socializing)
Interests  -> what a person CARES ABOUT (culture, nature, wellness)
Opinions   -> what a person BELIEVES (about travel, sustainability, risk)
</code></pre>
<p>AIO profiles let marketers group tourists beyond simple demographics — e.g. "wellness-seeking urban professionals" is a lifestyle segment, not an age bracket.</p>
<h3>Emotion in the travel decision</h3>
<p>Travel decisions are emotionally loaded from the start: <strong>anticipation</strong> and excitement build well before departure (often the most enjoyable part of the trip), while <strong>anxiety</strong> (safety, cost, the unknown) can delay or cancel a booking. Marketers manage both — building excitement through content, and reducing anxiety through guarantees, reviews and clear information.</p>
<div class="callout"><span class="badge">Key insight</span> Two tourists with the same income and age can choose completely different trips — because personality, lifestyle and emotional state, not demographics, drive the final choice.</div>`,
    `<span class="eyebrow">TTM203 · Chương 4 · Bài 4.1</span>
<h2>Yếu tố cá nhân &amp; tâm lý</h2>
<h3>Nhân cách &amp; phong cách du lịch</h3>
<p>Nét nhân cách định hình sở thích du lịch: khách <strong>hướng ngoại</strong> có thể tìm tour nhóm và cuộc sống về đêm; khách <strong>hướng nội</strong> có thể thích chuyến đi yên tĩnh, độc lập. Khách có tính <strong>cởi mở</strong> cao thường hướng tới điểm đến mới lạ, chưa quen (gợi lại kiểu allocentric của Plog ở Chương 2).</p>
<h3>Vòng đời &amp; yếu tố cá nhân</h3>
<p>Tuổi, thu nhập, nghề nghiệp và giai đoạn vòng đời gia đình (độc thân, cặp đôi trẻ, gia đình có con nhỏ, hết con ở nhà, hưu trí) định hình mạnh mẽ việc đi đâu, khi nào và đi thế nào — một gia đình có con nhỏ đặt tour khác hẳn một cặp đôi hưu trí.</p>
<h3>Lối sống — khung AIO</h3>
<pre><code>Hoạt động (Activities) -> người đó LÀM gì (thể thao, ăn ngoài, giao lưu)
Quan tâm (Interests)    -> người đó QUAN TÂM gì (văn hoá, thiên nhiên, sức khoẻ)
Quan điểm (Opinions)    -> người đó TIN gì (về du lịch, bền vững, rủi ro)
</code></pre>
<p>Hồ sơ AIO cho marketer nhóm khách theo cách vượt ra ngoài nhân khẩu học đơn giản — vd "dân công sở đô thị theo đuổi wellness" là một phân khúc theo lối sống, không phải theo độ tuổi.</p>
<h3>Cảm xúc trong quyết định du lịch</h3>
<p>Quyết định du lịch nặng cảm xúc ngay từ đầu: <strong>kỳ vọng (anticipation)</strong> và hào hứng xây dựng từ rất lâu trước ngày đi (thường là phần thú vị nhất của cả chuyến), trong khi <strong>lo lắng</strong> (an toàn, chi phí, điều chưa biết) có thể trì hoãn hoặc huỷ việc đặt tour. Marketer quản lý cả hai — xây hào hứng qua nội dung, và giảm lo lắng qua bảo đảm, review và thông tin rõ ràng.</p>
<div class="callout"><span class="badge">Điểm mấu chốt</span> Hai khách có cùng thu nhập và tuổi có thể chọn hai chuyến đi hoàn toàn khác nhau — vì nhân cách, lối sống và trạng thái cảm xúc, chứ không phải nhân khẩu học, mới là thứ quyết định lựa chọn cuối cùng.</div>`,
  ]]);

const c4q = quiz('ttm203-quiz-4', 'Quiz 4 — Personal & psychological factors|||Quiz 4 — Yếu tố cá nhân & tâm lý', [
  { id: 'q1', question: 'Khung AIO trong nghiên cứu lối sống khách du lịch gồm ba thành phần nào?', options: ['Tuổi - Thu nhập - Nghề nghiệp', 'Hoạt động - Quan tâm - Quan điểm', 'An toàn - Giá - Vị trí', 'Nhận thức - Cảm xúc - Hành vi'], correctIndex: 1, explanation: 'AIO = Activities (hoạt động), Interests (quan tâm), Opinions (quan điểm) — mô tả lối sống, không phải nhân khẩu học.' },
  { id: 'q2', question: 'Vì sao hai khách cùng tuổi, cùng thu nhập vẫn có thể chọn hai chuyến đi rất khác nhau?', options: ['Vì nhân khẩu học luôn quyết định tuyệt đối', 'Vì nhân cách, lối sống và cảm xúc cũng chi phối lựa chọn', 'Vì giá tour luôn giống nhau', 'Vì họ buộc phải đi cùng nhau'], correctIndex: 1, explanation: 'Nhân khẩu học không đủ giải thích hành vi — nhân cách, lối sống (AIO) và cảm xúc mới là yếu tố quyết định lựa chọn cuối.' },
  { id: 'q3', question: 'Cảm xúc "kỳ vọng, hào hứng" (anticipation) trong hành vi du lịch thường xuất hiện khi nào?', options: ['Chỉ sau khi kết thúc chuyến đi', 'Trước ngày khởi hành, khi lên kế hoạch và chờ đợi', 'Không liên quan đến quyết định du lịch', 'Chỉ khi có sự cố xảy ra'], correctIndex: 1, explanation: 'Kỳ vọng/hào hứng xây dựng từ trước chuyến đi, và thường được xem là một trong những phần thú vị nhất của trải nghiệm.' },
]);

const c5 = doc('ttm203-5-1-cultural-social', '5.1 — Cultural & social factors shaping travel choice|||5.1 — Yếu tố văn hoá & xã hội ảnh hưởng lựa chọn du lịch',
  'Văn hoá & các chiều văn hoá Hofstede (cá nhân vs tập thể) ảnh hưởng kiểu tour; nhóm tham chiếu (gia đình, bạn bè, người ảnh hưởng); tầng lớp xã hội; truyền miệng điện tử (eWOM) & bằng chứng xã hội.',
  [[
    `<span class="eyebrow">TTM203 · Chapter 5 · Lesson 5.1</span>
<h2>Cultural &amp; social factors</h2>
<h3>Culture</h3>
<p>Culture — shared values, norms and beliefs — shapes what travel even means to someone. <strong>Hofstede's individualism-collectivism</strong> dimension is a useful lens: travellers from more <strong>collectivist</strong> cultures often prefer group tours, family trips, and destinations validated by their community; travellers from more <strong>individualist</strong> cultures more often book independent, self-planned trips.</p>
<h3>Reference groups</h3>
<p>Family, friends, and increasingly <strong>social media influencers</strong> act as reference groups that shape destination choice before a marketer ever reaches the tourist. A recommendation from a trusted friend, or a well-loved travel influencer, can outweigh any advertisement.</p>
<h3>Social class</h3>
<p>Social class (linked to income, education, occupation) shapes travel consumption patterns — from budget backpacking to luxury villas — often more strongly than income alone, because it also carries taste, aspiration and what a "proper" holiday looks like within a social circle.</p>
<h3>Word-of-mouth &amp; social proof</h3>
<p>Because travel can't be tried before buying (Chapter 1), tourists lean heavily on <strong>electronic word-of-mouth (eWOM)</strong> — reviews, ratings, travel-influencer content — as <strong>social proof</strong> that reduces perceived risk.</p>
<div class="callout"><span class="badge">Key insight</span> A tourist rarely decides alone — culture sets the frame, reference groups supply the recommendation, and social proof removes the final doubt.</div>`,
    `<span class="eyebrow">TTM203 · Chương 5 · Bài 5.1</span>
<h2>Yếu tố văn hoá &amp; xã hội</h2>
<h3>Văn hoá</h3>
<p>Văn hoá — giá trị, chuẩn mực và niềm tin chung — định hình cả việc "du lịch" mang ý nghĩa gì với một người. Chiều <strong>cá nhân-tập thể của Hofstede</strong> là một lăng kính hữu ích: khách từ nền văn hoá <strong>tập thể</strong> hơn thường thích tour nhóm, chuyến đi gia đình, và điểm đến được cộng đồng của họ "công nhận"; khách từ nền văn hoá <strong>cá nhân</strong> hơn thường đặt chuyến đi độc lập, tự lên kế hoạch.</p>
<h3>Nhóm tham chiếu</h3>
<p>Gia đình, bạn bè, và ngày càng nhiều <strong>người ảnh hưởng trên mạng xã hội (influencer)</strong> đóng vai trò nhóm tham chiếu, định hình lựa chọn điểm đến trước khi bất kỳ marketer nào chạm được tới khách. Một lời gợi ý từ người bạn tin tưởng, hay một influencer du lịch được yêu thích, có thể nặng hơn bất kỳ quảng cáo nào.</p>
<h3>Tầng lớp xã hội</h3>
<p>Tầng lớp xã hội (gắn với thu nhập, học vấn, nghề nghiệp) định hình cách tiêu dùng du lịch — từ backpacking tiết kiệm đến villa hạng sang — thường mạnh hơn cả thu nhập đơn thuần, vì nó còn mang theo gu thẩm mỹ, khát vọng và hình mẫu một kỳ nghỉ "đúng chuẩn" trong nhóm xã hội của mình.</p>
<h3>Truyền miệng &amp; bằng chứng xã hội</h3>
<p>Vì không thể "thử" một chuyến đi trước khi mua (Chương 1), khách du lịch dựa rất nhiều vào <strong>truyền miệng điện tử (eWOM)</strong> — review, đánh giá, nội dung của travel influencer — như một dạng <strong>bằng chứng xã hội</strong> giúp giảm rủi ro cảm nhận.</p>
<div class="callout"><span class="badge">Điểm mấu chốt</span> Khách du lịch hiếm khi quyết định một mình — văn hoá đặt ra khung, nhóm tham chiếu đưa ra gợi ý, và bằng chứng xã hội xoá bỏ nghi ngờ cuối cùng.</div>`,
  ]]);

const c5q = quiz('ttm203-quiz-5', 'Quiz 5 — Cultural & social factors|||Quiz 5 — Yếu tố văn hoá & xã hội', [
  { id: 'q1', question: 'Theo chiều cá nhân-tập thể của Hofstede, khách từ nền văn hoá tập thể (collectivist) thường ưa thích?', options: ['Chuyến đi độc lập, tự lên kế hoạch một mình', 'Tour nhóm, chuyến đi gia đình, điểm đến được cộng đồng công nhận', 'Không bao giờ đi du lịch nước ngoài', 'Chỉ đi công tác'], correctIndex: 1, explanation: 'Văn hoá tập thể đề cao nhóm/cộng đồng, nên khách thường chọn tour nhóm và điểm đến được người xung quanh tán thành.' },
  { id: 'q2', question: '"Nhóm tham chiếu" (reference group) trong hành vi tiêu dùng du lịch bao gồm?', options: ['Chỉ nhân viên bán tour', 'Gia đình, bạn bè, và người ảnh hưởng trên mạng xã hội', 'Chỉ chính phủ và cơ quan quản lý', 'Chỉ đối thủ cạnh tranh của công ty du lịch'], correctIndex: 1, explanation: 'Nhóm tham chiếu là những người/nhóm có ảnh hưởng đến quyết định của khách: gia đình, bạn bè, influencer.' },
  { id: 'q3', question: 'Vì sao eWOM (truyền miệng điện tử) đặc biệt quan trọng trong du lịch?', options: ['Vì sản phẩm du lịch không thể thử trước khi mua, nên review đóng vai trò bằng chứng xã hội', 'Vì giá tour luôn được công khai trên mạng', 'Vì khách du lịch không tin quảng cáo truyền hình', 'Vì luật pháp bắt buộc phải có review'], correctIndex: 0, explanation: 'Không thử được trước khi mua khiến khách phụ thuộc vào kinh nghiệm của người khác (review, đánh giá) để giảm rủi ro cảm nhận.' },
]);

const c6 = doc('ttm203-6-1-decision-process', '6.1 — The decision-making & purchase process for travel products|||6.1 — Quá trình ra quyết định & mua sản phẩm du lịch',
  'Quy trình 5 bước: nhận biết nhu cầu → tìm kiếm thông tin → đánh giá lựa chọn (bộ gợi nhớ/bộ xem xét) → quyết định mua → hành vi sau mua; đặc điểm riêng của quyết định du lịch (nhiều người quyết định, thời gian tìm kiếm dài).',
  [[
    `<span class="eyebrow">TTM203 · Chapter 6 · Lesson 6.1</span>
<h2>The decision-making process</h2>
<h3>The 5-stage model, applied to travel</h3>
<pre><code>1. Need recognition   -> "I need a break / an escape"
2. Information search -> browse sites, ask friends, read reviews (long, thorough for travel)
3. Evaluate alternatives -> compare a small "evoked set" of destinations/packages
4. Purchase decision   -> book (often influenced by price, timing, promotions)
5. Post-purchase behavior -> satisfaction, complaint, review, rebooking intention
</code></pre>
<h3>What makes travel decisions distinctive</h3>
<ul>
<li><strong>Long search phase</strong> — because the stakes and cost are high, tourists compare far more options and take far longer than a routine purchase.</li>
<li><strong>Evoked set is small</strong> — out of hundreds of destinations, a tourist actively considers only a handful; brand/destination awareness in Chapter 3-5 decides who makes this shortlist at all.</li>
<li><strong>Multiple decision-makers</strong> — a family trip is rarely one person's choice; partners, children and even extended family can each veto or push an option.</li>
<li><strong>Decision can be reversed only at a cost</strong> — cancellation fees and non-refundable bookings make the purchase step higher-stakes than in most consumer categories.</li>
</ul>
<div class="callout"><span class="badge">Practical use</span> Everything from Chapters 2-5 (motivation, perception, personality, culture) feeds into this one process — they explain WHY a tourist ends up making the choice they make at each of these five stages.</div>`,
    `<span class="eyebrow">TTM203 · Chương 6 · Bài 6.1</span>
<h2>Quá trình ra quyết định</h2>
<h3>Mô hình 5 bước, áp vào du lịch</h3>
<pre><code>1. Nhận biết nhu cầu     -> "Tôi cần nghỉ ngơi / thoát khỏi thường nhật"
2. Tìm kiếm thông tin     -> lên web, hỏi bạn bè, đọc review (dài, kỹ hơn hàng hoá thường)
3. Đánh giá lựa chọn      -> so sánh một "bộ gợi nhớ" nhỏ gồm vài điểm đến/gói tour
4. Quyết định mua         -> đặt tour (thường chịu ảnh hưởng bởi giá, thời điểm, khuyến mãi)
5. Hành vi sau mua        -> hài lòng, khiếu nại, viết review, ý định đặt lại
</code></pre>
<h3>Điều làm quyết định du lịch khác biệt</h3>
<ul>
<li><strong>Giai đoạn tìm kiếm dài</strong> — vì mức rủi ro và chi phí cao, khách so sánh nhiều lựa chọn hơn và mất nhiều thời gian hơn hẳn một lần mua thông thường.</li>
<li><strong>Bộ gợi nhớ (evoked set) nhỏ</strong> — trong hàng trăm điểm đến, khách chỉ thực sự xem xét một vài cái; mức độ nhận biết thương hiệu/điểm đến (Chương 3-5) quyết định ai được vào danh sách rút gọn này ngay từ đầu.</li>
<li><strong>Nhiều người cùng quyết định</strong> — một chuyến đi gia đình hiếm khi là lựa chọn của một người; vợ/chồng, con cái, thậm chí đại gia đình đều có thể phủ quyết hoặc thúc đẩy một lựa chọn.</li>
<li><strong>Đảo ngược quyết định phải trả giá</strong> — phí huỷ và đặt tour không hoàn tiền khiến bước mua có mức độ rủi ro cao hơn hầu hết ngành hàng tiêu dùng khác.</li>
</ul>
<div class="callout"><span class="badge">Ứng dụng thực tế</span> Mọi thứ từ Chương 2-5 (động cơ, nhận thức, nhân cách, văn hoá) đều đổ vào chính quy trình này — chúng giải thích VÌ SAO khách đi đến lựa chọn cuối cùng ở mỗi bước trong 5 bước này.</div>`,
  ]]);

const c6q = quiz('ttm203-quiz-6', 'Quiz 6 — Decision-making process|||Quiz 6 — Quá trình ra quyết định', [
  { id: 'q1', question: 'Thứ tự đúng của quy trình 5 bước ra quyết định mua sản phẩm du lịch là?', options: ['Đánh giá lựa chọn → nhận biết nhu cầu → tìm kiếm thông tin → mua → sau mua', 'Nhận biết nhu cầu → tìm kiếm thông tin → đánh giá lựa chọn → quyết định mua → hành vi sau mua', 'Mua → tìm kiếm thông tin → nhận biết nhu cầu → đánh giá → sau mua', 'Sau mua → mua → đánh giá → tìm kiếm → nhận biết nhu cầu'], correctIndex: 1, explanation: 'Quy trình chuẩn: nhận biết nhu cầu → tìm kiếm thông tin → đánh giá lựa chọn → quyết định mua → hành vi sau mua.' },
  { id: 'q2', question: '"Bộ gợi nhớ" (evoked set) trong quyết định du lịch là?', options: ['Tất cả điểm đến trên thế giới', 'Một số ít điểm đến/gói tour mà khách thực sự xem xét khi ra quyết định', 'Chỉ điểm đến rẻ nhất', 'Danh sách điểm đến do chính phủ quy định'], correctIndex: 1, explanation: 'Evoked set là tập nhỏ các lựa chọn được khách thực sự cân nhắc, thay vì toàn bộ thị trường.' },
  { id: 'q3', question: 'Vì sao quyết định du lịch thường có NHIỀU người tham gia quyết định hơn mua hàng thông thường?', options: ['Vì luật pháp yêu cầu phải có nhiều người ký', 'Vì một chuyến đi (đặc biệt chuyến gia đình) ảnh hưởng đến nhiều thành viên, mỗi người có thể tác động đến lựa chọn', 'Vì giá vé máy bay luôn thay đổi', 'Vì công ty du lịch yêu cầu vậy'], correctIndex: 1, explanation: 'Một chuyến đi gia đình liên quan đến nhiều thành viên; vợ/chồng, con cái có thể cùng ảnh hưởng đến lựa chọn cuối.' },
]);

const c7 = doc('ttm203-7-1-experience-satisfaction-loyalty', '7.1 — Experience, satisfaction & tourist loyalty|||7.1 — Trải nghiệm, sự hài lòng & lòng trung thành của khách',
  'Mô hình kỳ vọng-xác nhận (expectation-confirmation); trải nghiệm nhớ đời theo khung 4E của Pine & Gilmore; từ hài lòng đến trung thành & giới thiệu (NPS); hành vi khiếu nại.',
  [[
    `<span class="eyebrow">TTM203 · Chapter 7 · Lesson 7.1</span>
<h2>Experience, satisfaction &amp; loyalty</h2>
<h3>The expectation-confirmation model</h3>
<pre><code>Perceived performance > Expectation  -> Positive disconfirmation -> Satisfied
Perceived performance = Expectation  -> Confirmation             -> Neutral
Perceived performance < Expectation  -> Negative disconfirmation -> Dissatisfied
</code></pre>
<p>Satisfaction is not about how good a trip was in absolute terms — it's about how the experience compared to what the tourist expected going in (built from image, past experience, and reviews — Chapters 3 and 5).</p>
<h3>The memorable experience (Pine &amp; Gilmore's 4Es)</h3>
<p>Beyond satisfying expectations, the best trips are <strong>memorable experiences</strong>, built from four realms: <strong>Entertainment</strong> (passively enjoying), <strong>Education</strong> (actively learning), <strong>Escapism</strong> (actively immersed) and <strong>Esthetics</strong> (passively immersed in an environment). Great tourism products blend more than one.</p>
<h3>From satisfaction to loyalty</h3>
<p>Satisfaction is necessary but not sufficient for <strong>loyalty</strong> — repeat visits and recommendation. Businesses track this with tools like the <strong>Net Promoter Score (NPS)</strong> ("how likely are you to recommend us?"), because a satisfied-but-unenthusiastic tourist may still switch next time, while a genuine promoter drives new customers through word-of-mouth.</p>
<h3>Complaint behavior</h3>
<p>Not every dissatisfied tourist complains — many simply switch brands silently or post a negative review instead. A well-designed complaint channel turns a dissatisfied tourist into a recoverable one, before they turn to public reviews.</p>
<div class="callout"><span class="badge">Key insight</span> Loyalty is built at the gap between expectation and experience — manage the expectation (Chapters 3, 5) as carefully as you manage the trip itself.</div>`,
    `<span class="eyebrow">TTM203 · Chương 7 · Bài 7.1</span>
<h2>Trải nghiệm, hài lòng &amp; trung thành</h2>
<h3>Mô hình kỳ vọng-xác nhận</h3>
<pre><code>Hiệu năng cảm nhận > Kỳ vọng  -> Xác nhận dương  -> Hài lòng
Hiệu năng cảm nhận = Kỳ vọng  -> Xác nhận         -> Trung tính
Hiệu năng cảm nhận < Kỳ vọng  -> Xác nhận âm      -> Không hài lòng
</code></pre>
<p>Sự hài lòng không nằm ở việc chuyến đi tốt tới đâu về mặt tuyệt đối — mà ở việc trải nghiệm đó so với điều khách kỳ vọng từ trước (được xây từ hình ảnh, kinh nghiệm cũ và review — Chương 3 và 5) ra sao.</p>
<h3>Trải nghiệm nhớ đời (khung 4E của Pine &amp; Gilmore)</h3>
<p>Vượt trên việc thoả kỳ vọng, những chuyến đi tốt nhất là <strong>trải nghiệm nhớ đời</strong>, được xây từ bốn miền: <strong>Giải trí</strong> (thụ động thưởng thức), <strong>Giáo dục</strong> (chủ động học hỏi), <strong>Thoát ly</strong> (chủ động đắm mình) và <strong>Thẩm mỹ</strong> (thụ động đắm mình trong không gian). Sản phẩm du lịch xuất sắc thường kết hợp nhiều hơn một miền.</p>
<h3>Từ hài lòng đến trung thành</h3>
<p>Sự hài lòng cần thiết nhưng chưa đủ cho <strong>lòng trung thành</strong> — quay lại và giới thiệu. Doanh nghiệp theo dõi điều này bằng công cụ như <strong>Điểm giới thiệu ròng (NPS)</strong> ("bạn có sẵn sàng giới thiệu chúng tôi không?"), vì một khách hài lòng nhưng không thật hào hứng vẫn có thể đổi sang thương hiệu khác lần sau, còn một người ủng hộ thật sự mang lại khách mới qua truyền miệng.</p>
<h3>Hành vi khiếu nại</h3>
<p>Không phải khách không hài lòng nào cũng khiếu nại — nhiều người chỉ lặng lẽ đổi thương hiệu hoặc viết review xấu thay vào đó. Một kênh khiếu nại được thiết kế tốt biến một khách không hài lòng thành khách có thể "cứu" được, trước khi họ chuyển sang review công khai.</p>
<div class="callout"><span class="badge">Điểm mấu chốt</span> Lòng trung thành được xây trên khoảng cách giữa kỳ vọng và trải nghiệm thật — quản lý kỳ vọng (Chương 3, 5) cẩn thận như quản lý chính chuyến đi.</div>`,
  ]]);

const c7q = quiz('ttm203-quiz-7', 'Quiz 7 — Experience, satisfaction & loyalty|||Quiz 7 — Trải nghiệm, hài lòng & trung thành', [
  { id: 'q1', question: 'Theo mô hình kỳ vọng-xác nhận, khách "hài lòng" khi nào?', options: ['Hiệu năng cảm nhận thấp hơn kỳ vọng', 'Hiệu năng cảm nhận cao hơn kỳ vọng (xác nhận dương)', 'Chuyến đi tuyệt đối hoàn hảo không có bất kỳ sai sót', 'Chỉ khi giá tour rẻ nhất thị trường'], correctIndex: 1, explanation: 'Hài lòng xảy ra khi hiệu năng cảm nhận vượt kỳ vọng ban đầu — gọi là xác nhận dương (positive disconfirmation).' },
  { id: 'q2', question: 'NPS (Net Promoter Score) đo lường điều gì?', options: ['Giá tour trung bình', 'Mức độ khách sẵn sàng giới thiệu doanh nghiệp cho người khác', 'Số lượng khách khiếu nại', 'Thời gian tìm kiếm thông tin trước khi mua'], correctIndex: 1, explanation: 'NPS hỏi trực tiếp "bạn có sẵn sàng giới thiệu chúng tôi không?" để đo khả năng khách trở thành người ủng hộ.' },
  { id: 'q3', question: 'Vì sao một khách không hài lòng nhưng KHÔNG khiếu nại vẫn nguy hiểm cho doanh nghiệp?', options: ['Vì họ sẽ chắc chắn quay lại lần sau', 'Vì họ có thể lặng lẽ đổi thương hiệu hoặc viết review xấu công khai thay vì cho doanh nghiệp cơ hội sửa', 'Vì họ luôn được hoàn tiền tự động', 'Vì điều này không ảnh hưởng gì đến doanh nghiệp'], correctIndex: 1, explanation: 'Khách không khiếu nại trực tiếp có thể "im lặng rời bỏ" hoặc phản ánh qua review công khai — mất cơ hội khắc phục sớm.' },
]);

const c8 = doc('ttm203-8-1-new-trends', '8.1 — New tourism consumer trends: digital, sustainable, review-driven, post-COVID|||8.1 — Xu hướng tiêu dùng du lịch mới: số hoá, bền vững, review, hậu COVID',
  'Hành vi số (tìm kiếm/đặt tour trực tuyến, OTA, di động); người tiêu dùng xanh & du lịch bền vững; ảnh hưởng của review/UGC/influencer; thay đổi hậu COVID (nhận thức rủi ro, "revenge travel", workation, cá nhân hoá bằng AI).',
  [[
    `<span class="eyebrow">TTM203 · Chapter 8 · Lesson 8.1</span>
<h2>New consumer trends in tourism</h2>
<h3>Digital consumer behavior</h3>
<p>Most of the decision journey (Chapter 6) now happens online: research on search engines and OTAs (online travel agencies), comparison across mobile apps, and booking that increasingly happens on a phone rather than a desktop. Digital touchpoints have compressed and sped up the "information search" and "evaluation" stages.</p>
<h3>The sustainable / green tourist</h3>
<p>A growing segment weighs environmental and social impact into the decision — choosing lower-carbon transport, eco-certified stays, or destinations perceived as managing over-tourism responsibly. This is a values-driven pull factor layered on top of the classic motivations from Chapter 2.</p>
<h3>Reviews, UGC &amp; influencers</h3>
<p>User-generated content (UGC) — reviews, photos, short-form videos — now often outweighs official marketing in shaping destination image (Chapter 3) and reducing perceived risk (Chapter 5), especially for younger travellers who trust peers and influencers over brands.</p>
<h3>Post-COVID shifts</h3>
<ul>
<li><strong>Heightened risk perception</strong> — health/safety became an explicit decision criterion, not just an afterthought.</li>
<li><strong>"Revenge travel"</strong> — pent-up demand triggered a surge of bucket-list, high-spend trips once restrictions lifted.</li>
<li><strong>Workation / bleisure</strong> — remote work blurred the line between business and leisure travel.</li>
<li><strong>AI-driven personalization</strong> — recommendation engines and chat-based planning tools now shape the "evaluation of alternatives" stage directly.</li>
</ul>
<div class="callout"><span class="badge">Full circle</span> These are not new theories — they are the same motivation, perception, social-influence and decision models from Chapters 2-6, now playing out on phones, review platforms and post-pandemic mindsets.</div>`,
    `<span class="eyebrow">TTM203 · Chương 8 · Bài 8.1</span>
<h2>Xu hướng tiêu dùng du lịch mới</h2>
<h3>Hành vi tiêu dùng số</h3>
<p>Phần lớn hành trình quyết định (Chương 6) giờ diễn ra trực tuyến: tìm kiếm trên công cụ tìm kiếm và OTA (đại lý du lịch trực tuyến), so sánh qua ứng dụng di động, và đặt tour ngày càng nhiều trên điện thoại hơn là máy tính. Các điểm chạm số đã rút ngắn và tăng tốc bước "tìm kiếm thông tin" và "đánh giá lựa chọn".</p>
<h3>Khách du lịch "xanh" / bền vững</h3>
<p>Một phân khúc đang lớn dần cân nhắc cả tác động môi trường và xã hội khi quyết định — chọn phương tiện ít carbon hơn, nơi lưu trú có chứng nhận sinh thái, hoặc điểm đến được cho là quản lý du lịch quá tải một cách có trách nhiệm. Đây là một yếu tố kéo (pull) dựa trên giá trị, chồng lên các động cơ cổ điển ở Chương 2.</p>
<h3>Review, nội dung do người dùng tạo (UGC) &amp; influencer</h3>
<p>Nội dung do người dùng tạo (UGC) — review, ảnh, video ngắn — giờ thường nặng hơn cả marketing chính thức trong việc định hình hình ảnh điểm đến (Chương 3) và giảm rủi ro cảm nhận (Chương 5), đặc biệt với khách trẻ tin bạn bè và influencer hơn thương hiệu.</p>
<h3>Thay đổi hậu COVID</h3>
<ul>
<li><strong>Nhận thức rủi ro tăng cao</strong> — sức khoẻ/an toàn trở thành tiêu chí quyết định rõ ràng, không còn là chuyện phụ.</li>
<li><strong>"Du lịch trả thù" (revenge travel)</strong> — nhu cầu bị dồn nén bùng nổ thành làn sóng chuyến đi bucket-list, chi tiêu cao khi hạn chế được dỡ bỏ.</li>
<li><strong>Workation / bleisure</strong> — làm việc từ xa xoá nhoà ranh giới giữa du lịch công vụ và nghỉ dưỡng.</li>
<li><strong>Cá nhân hoá bằng AI</strong> — công cụ gợi ý và lập kế hoạch qua chat giờ trực tiếp định hình bước "đánh giá lựa chọn".</li>
</ul>
<div class="callout"><span class="badge">Khép lại một vòng</span> Đây không phải lý thuyết mới — vẫn là các mô hình động cơ, nhận thức, ảnh hưởng xã hội và ra quyết định từ Chương 2-6, chỉ đang diễn ra trên điện thoại, nền tảng review và tâm lý hậu đại dịch.</div>`,
  ]]);

const c8q = quiz('ttm203-quiz-8', 'Quiz 8 — New consumer trends|||Quiz 8 — Xu hướng tiêu dùng mới', [
  { id: 'q1', question: '"Du lịch trả thù" (revenge travel) là hiện tượng gì?', options: ['Khách du lịch tẩy chay một điểm đến', 'Nhu cầu du lịch bị dồn nén bùng nổ thành làn sóng chuyến đi lớn khi hạn chế được dỡ bỏ (hậu COVID)', 'Một loại bảo hiểm du lịch', 'Chính sách hoàn tiền của hãng bay'], correctIndex: 1, explanation: 'Revenge travel là làn sóng du lịch bùng nổ sau khi các hạn chế đi lại (như COVID-19) được dỡ bỏ, do nhu cầu bị dồn nén lâu.' },
  { id: 'q2', question: 'Vì sao nội dung do người dùng tạo (UGC) và review ngày càng quan trọng trong hành vi tiêu dùng du lịch?', options: ['Vì chúng thay thế hoàn toàn cho giá tour', 'Vì chúng định hình hình ảnh điểm đến và giảm rủi ro cảm nhận, đặc biệt với khách trẻ', 'Vì luật pháp yêu cầu công ty du lịch phải đăng UGC', 'Vì UGC không ảnh hưởng đến quyết định mua'], correctIndex: 1, explanation: 'UGC (review, ảnh, video) tác động đến hình ảnh điểm đến (Chương 3) và bằng chứng xã hội (Chương 5), giảm rủi ro cảm nhận khi mua.' },
  { id: 'q3', question: '"Workation" (kết hợp làm việc từ xa và du lịch) phản ánh xu hướng gì?', options: ['Ranh giới giữa du lịch công vụ và nghỉ dưỡng đang xoá nhoà nhờ làm việc từ xa', 'Khách du lịch không còn cần internet khi đi du lịch', 'Doanh nghiệp cấm nhân viên đi du lịch', 'Xu hướng này chỉ tồn tại trước năm 2020'], correctIndex: 0, explanation: 'Workation/bleisure là xu hướng hậu COVID: làm việc từ xa cho phép kết hợp công việc và nghỉ dưỡng trong cùng một chuyến đi.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'TTM203',
    slug: 'ttm203-consumer-behavior-in-tourism',
    title: 'Consumer behavior in Tourism',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/TTM203.webp',
    shortDescription: 'Why tourists travel and how they choose: push-pull motivation, Maslow & Plog, perception/attitude, personality & lifestyle, culture & reference groups, the decision process, satisfaction & loyalty, digital/sustainable/post-COVID trends.|||Vì sao khách du lịch đi và họ chọn thế nào: động cơ push-pull, Maslow & Plog, nhận thức/thái độ, nhân cách & lối sống, văn hoá & nhóm tham chiếu, quy trình ra quyết định, hài lòng & trung thành, xu hướng số hoá/bền vững/hậu COVID.',
    description: 'Môn <strong>TTM203 — Consumer behavior in Tourism</strong> (khối Quản trị Kinh doanh — Du lịch, kỳ 5) nghiên cứu <strong>khách du lịch với vai trò người tiêu dùng</strong>: từ <strong>động cơ</strong> (push-pull, Maslow, Plog) → <strong>nhận thức, học tập &amp; thái độ</strong> → <strong>yếu tố cá nhân &amp; tâm lý</strong> (nhân cách, lối sống, cảm xúc) → <strong>yếu tố văn hoá &amp; xã hội</strong> → <strong>quy trình ra quyết định 5 bước</strong> → <strong>trải nghiệm, hài lòng &amp; trung thành</strong> → <strong>xu hướng tiêu dùng mới</strong> (số hoá, bền vững, review, hậu COVID). Khác TTM201 (nhập môn ngành) và TTM202 (quản trị điểm đến &amp; marketing): TTM203 nhìn từ góc độ hành vi cá nhân của khách. Bám giáo trình Swarbrooke &amp; Horner, Urry, Solomon; song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Định nghĩa & đặc điểm hành vi tiêu dùng du lịch; động cơ push-pull, tháp Maslow, thang Plog; nhận thức có chọn lọc & hình ảnh điểm đến, học tập/điều kiện hoá, mô hình thái độ ba thành phần; nhân cách, vòng đời, khung lối sống AIO, vai trò cảm xúc; văn hoá (Hofstede), nhóm tham chiếu, tầng lớp xã hội, eWOM; quy trình quyết định 5 bước & bộ gợi nhớ; mô hình kỳ vọng-xác nhận, khung 4E, NPS, hành vi khiếu nại; hành vi số, du lịch bền vững, UGC/influencer, xu hướng hậu COVID.',
    requirements: 'Nên đã học hoặc học song song TTM201 (nhập môn ngành du lịch). Không yêu cầu kiến thức tâm lý học trước đó.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách nền Swarbrooke & Horner, Urry, Solomon; giáo trình FLM, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Hành vi tiêu dùng du lịch là gì, khác TTM201/TTM202, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & tầm quan trọng|||Chapter 1 — Overview & importance', description: 'Định nghĩa, đặc điểm riêng sản phẩm du lịch, mô hình hộp đen.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Động cơ du lịch|||Chapter 2 — Travel motivation', description: 'Push-pull, Maslow, thang Plog.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Nhận thức, học tập & thái độ|||Chapter 3 — Perception, learning & attitude', description: 'Hình ảnh điểm đến, điều kiện hoá, mô hình thái độ ba thành phần.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Yếu tố cá nhân & tâm lý|||Chapter 4 — Personal & psychological factors', description: 'Nhân cách, vòng đời, khung AIO, cảm xúc.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Yếu tố văn hoá & xã hội|||Chapter 5 — Cultural & social factors', description: 'Hofstede, nhóm tham chiếu, tầng lớp xã hội, eWOM.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Quá trình ra quyết định|||Chapter 6 — Decision-making process', description: 'Quy trình 5 bước, bộ gợi nhớ, nhiều người quyết định.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Trải nghiệm, hài lòng & trung thành|||Chapter 7 — Experience, satisfaction & loyalty', description: 'Kỳ vọng-xác nhận, khung 4E, NPS, khiếu nại.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Xu hướng tiêu dùng mới|||Chapter 8 — New consumer trends', description: 'Số hoá, bền vững, UGC/influencer, hậu COVID.', lessons: [c8, c8q] },
  ],
};
