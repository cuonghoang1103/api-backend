/**
 * IBS301m — International Business Strategy. Chiến lược Kinh doanh quốc tế
 * (BBA, kỳ 5). Giáo trình trích dẫn: Hill "International Business"; Peng
 * "Global Strategy"; Bartlett/Ghoshal "Managing Across Borders". 8 chương:
 * tổng quan & động cơ quốc tế hoá, PESTEL & Hofstede, kim cương Porter,
 * phương thức thâm nhập, tích hợp-thích ứng (I-R), cấu trúc MNC, marketing &
 * chuỗi giá trị toàn cầu, rủi ro/đạo đức & DN Việt Nam vươn ra toàn cầu.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ibs301m-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình FLM, sách tham khảo (Hill, Peng, Bartlett/Ghoshal), tài liệu miễn phí, YouTube, lộ trình tự học.',
  [[
    `<span class="eyebrow">IBS301m · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn International Business Strategy — international environment analysis, entry modes, global vs local strategy, MNC structure — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for IBS301m are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>International Business: Competing in the Global Marketplace</em> — Charles W. L. Hill</li>
<li><em>Global Strategy</em> — Mike W. Peng</li>
<li><em>Managing Across Borders: The Transnational Solution</em> — Christopher A. Bartlett &amp; Sumantra Ghoshal</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.wto.org/" target="_blank" rel="noopener">WTO — World Trade Organization</a> — trade rules &amp; statistics</li>
<li><a href="https://www.imf.org/en/Publications/WEO" target="_blank" rel="noopener">IMF — World Economic Outlook</a> — macro data by country</li>
<li><a href="https://www.hofstede-insights.com/country-comparison-tool" target="_blank" rel="noopener">Hofstede Insights — Country Comparison Tool</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@HBR" target="_blank" rel="noopener">Harvard Business Review</a> — strategy &amp; global business case explainers</li>
<li><a href="https://www.youtube.com/@economicsexplained" target="_blank" rel="noopener">Economics Explained</a> — global trade &amp; country economics</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.hofstede-insights.com/country-comparison-tool" target="_blank" rel="noopener">Hofstede Country Comparison</a> — so sánh văn hoá quốc gia</li>
<li><a href="https://tradingeconomics.com/" target="_blank" rel="noopener">Trading Economics</a> — dữ liệu PESTEL theo quốc gia</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — globalization drivers, PESTEL, Hofstede, Porter's Diamond.</li>
<li><strong>Practice</strong> — pick one Vietnamese firm and map its entry mode + I-R strategy.</li>
<li><strong>Go deeper</strong> — MNC structures, global value chain, marketing standardization vs adaptation.</li>
<li><strong>Job-ready</strong> — analyze a real cross-border case: risk, ethics, and internationalization strategy.</li>
</ol></div>`,
    `<span class="eyebrow">IBS301m · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Chiến lược Kinh doanh quốc tế — phân tích môi trường quốc tế, phương thức thâm nhập, chiến lược toàn cầu vs địa phương hoá, cấu trúc MNC — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của IBS301m có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>International Business: Competing in the Global Marketplace</em> — Charles W. L. Hill</li>
<li><em>Global Strategy</em> — Mike W. Peng</li>
<li><em>Managing Across Borders: The Transnational Solution</em> — Christopher A. Bartlett &amp; Sumantra Ghoshal</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.wto.org/" target="_blank" rel="noopener">WTO — Tổ chức Thương mại Thế giới</a> — luật lệ &amp; thống kê thương mại</li>
<li><a href="https://www.imf.org/en/Publications/WEO" target="_blank" rel="noopener">IMF — World Economic Outlook</a> — dữ liệu vĩ mô theo quốc gia</li>
<li><a href="https://www.hofstede-insights.com/country-comparison-tool" target="_blank" rel="noopener">Hofstede Insights — Công cụ so sánh quốc gia</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@HBR" target="_blank" rel="noopener">Harvard Business Review</a> — giải thích case chiến lược &amp; kinh doanh toàn cầu</li>
<li><a href="https://www.youtube.com/@economicsexplained" target="_blank" rel="noopener">Economics Explained</a> — thương mại toàn cầu &amp; kinh tế quốc gia</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.hofstede-insights.com/country-comparison-tool" target="_blank" rel="noopener">Hofstede Country Comparison</a> — so sánh văn hoá quốc gia</li>
<li><a href="https://tradingeconomics.com/" target="_blank" rel="noopener">Trading Economics</a> — dữ liệu PESTEL theo quốc gia</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — động cơ toàn cầu hoá, PESTEL, Hofstede, kim cương Porter.</li>
<li><strong>Luyện tập</strong> — chọn một doanh nghiệp Việt Nam và vẽ phương thức thâm nhập + chiến lược I-R của họ.</li>
<li><strong>Đào sâu</strong> — cấu trúc MNC, chuỗi giá trị toàn cầu, chuẩn hoá vs thích ứng marketing.</li>
<li><strong>Sẵn sàng đi làm</strong> — phân tích một case xuyên biên giới thật: rủi ro, đạo đức, chiến lược quốc tế hoá.</li>
</ol></div>`,
  ]]);

const intro = doc('ibs301m-0-1-overview', 'Course overview: International Business Strategy|||Tổng quan: Chiến lược Kinh doanh quốc tế',
  'Kinh doanh quốc tế là gì; vì sao doanh nghiệp quốc tế hoá; lộ trình: môi trường quốc tế → lợi thế quốc gia → thâm nhập thị trường → chiến lược toàn cầu/địa phương → cấu trúc MNC → marketing toàn cầu → rủi ro &amp; đạo đức.',
  [[
    `<span class="eyebrow">IBS301m · Lesson 0.1 · Overview</span>
<h2>International Business Strategy</h2>
<p class="lead">This course helps you understand <strong>how firms compete across borders</strong> — why they internationalize, how they read foreign environments, which entry mode to pick, and how to balance <strong>global efficiency</strong> against <strong>local responsiveness</strong>. Grounded in Hill's <em>International Business</em>, Peng's <em>Global Strategy</em>, and Bartlett &amp; Ghoshal's <em>Managing Across Borders</em>.</p>
<h3>Why firms go international</h3>
<ul>
<li><strong>Market seeking</strong> — access new customers as home markets saturate.</li>
<li><strong>Resource seeking</strong> — cheaper labor, raw materials, or talent.</li>
<li><strong>Efficiency seeking</strong> — economies of scale by serving many markets from fewer plants.</li>
<li><strong>Strategic asset seeking</strong> — acquire technology, brands, or capabilities abroad.</li>
</ul>
<h3>Roadmap</h3>
<p>International environment (PESTEL, Hofstede culture) → national competitive advantage (Porter's Diamond) → market entry modes (export, JV, FDI) → global vs local strategy (integration-responsiveness) → MNC structure &amp; governance → global marketing &amp; value chain → international risk, ethics &amp; Vietnamese firms going global.</p>`,
    `<span class="eyebrow">IBS301m · Bài 0.1 · Tổng quan</span>
<h2>Chiến lược Kinh doanh quốc tế</h2>
<p class="lead">Môn này giúp bạn hiểu <strong>doanh nghiệp cạnh tranh xuyên biên giới thế nào</strong> — vì sao họ quốc tế hoá, cách đọc môi trường nước ngoài, chọn phương thức thâm nhập nào, và cân bằng giữa <strong>hiệu quả toàn cầu</strong> và <strong>thích ứng địa phương</strong>. Bám theo <em>International Business</em> của Hill, <em>Global Strategy</em> của Peng, và <em>Managing Across Borders</em> của Bartlett &amp; Ghoshal.</p>
<h3>Vì sao doanh nghiệp quốc tế hoá</h3>
<ul>
<li><strong>Tìm thị trường</strong> — tiếp cận khách hàng mới khi thị trường trong nước bão hoà.</li>
<li><strong>Tìm nguồn lực</strong> — lao động, nguyên liệu hoặc nhân tài rẻ hơn.</li>
<li><strong>Tìm hiệu quả</strong> — lợi thế quy mô nhờ phục vụ nhiều thị trường từ ít nhà máy hơn.</li>
<li><strong>Tìm tài sản chiến lược</strong> — mua công nghệ, thương hiệu hoặc năng lực ở nước ngoài.</li>
</ul>
<h3>Lộ trình</h3>
<p>Môi trường quốc tế (PESTEL, văn hoá Hofstede) → lợi thế cạnh tranh quốc gia (kim cương Porter) → phương thức thâm nhập (xuất khẩu, liên doanh, FDI) → chiến lược toàn cầu vs địa phương (tích hợp-thích ứng) → cấu trúc &amp; quản trị MNC → marketing &amp; chuỗi giá trị toàn cầu → rủi ro quốc tế, đạo đức &amp; doanh nghiệp Việt Nam vươn ra toàn cầu.</p>`,
  ]]);

const c1 = doc('ibs301m-1-1-overview-global-strategy', '1.1 — International business overview & global strategy|||1.1 — Tổng quan kinh doanh quốc tế & chiến lược toàn cầu',
  'Kinh doanh quốc tế là gì, động cơ toàn cầu hoá (thị trường/nguồn lực/hiệu quả/tài sản chiến lược), khái niệm chiến lược toàn cầu (Hill, Peng).',
  [[
    `<span class="eyebrow">IBS301m · Chapter 1 · Lesson 1.1</span>
<h2>International business overview &amp; global strategy</h2>
<h3>What is international business?</h3>
<p><strong>International business</strong> is any commercial transaction — private or governmental — between two or more countries (Hill). It spans exporting, licensing, foreign direct investment (FDI), and cross-border alliances. <strong>Globalization</strong> is the trend toward a more integrated world economy, driven by falling trade/investment barriers and technology (transport, communication, the internet).</p>
<h3>Dunning's motives for going international</h3>
<pre><code>Market seeking      -> new customers, escape saturated home market
Resource seeking     -> cheaper labor, materials, talent
Efficiency seeking    -> economies of scale/scope across markets
Strategic asset seeking -> acquire tech, brands, capabilities abroad
</code></pre>
<h3>Global strategy in one sentence</h3>
<p>A <strong>global strategy</strong> (Peng) is a firm's theory about how to compete successfully against its rivals across multiple countries — it decides WHERE to compete, HOW to enter, and HOW MUCH to standardize vs adapt. The rest of this course builds the toolkit to answer those three questions.</p>
<div class="callout"><span class="badge">Why it matters</span> Firms that treat "going abroad" as just "selling more of the same" often fail — international strategy requires rethinking environment, entry, structure and marketing together.</div>`,
    `<span class="eyebrow">IBS301m · Chương 1 · Bài 1.1</span>
<h2>Tổng quan kinh doanh quốc tế &amp; chiến lược toàn cầu</h2>
<h3>Kinh doanh quốc tế là gì?</h3>
<p><strong>Kinh doanh quốc tế</strong> là bất kỳ giao dịch thương mại nào — tư nhân hay chính phủ — giữa hai hay nhiều quốc gia (Hill). Nó bao gồm xuất khẩu, cấp phép (licensing), đầu tư trực tiếp nước ngoài (FDI), và liên minh xuyên biên giới. <strong>Toàn cầu hoá</strong> là xu hướng kinh tế thế giới ngày càng liên kết, nhờ rào cản thương mại/đầu tư giảm và công nghệ (vận tải, truyền thông, internet).</p>
<h3>Động cơ quốc tế hoá theo Dunning</h3>
<pre><code>Tìm thị trường      -> khách hàng mới, thoát thị trường nội địa bão hoà
Tìm nguồn lực        -> lao động, nguyên liệu, nhân tài rẻ hơn
Tìm hiệu quả         -> lợi thế quy mô/phạm vi trên nhiều thị trường
Tìm tài sản chiến lược -> mua công nghệ, thương hiệu, năng lực ở nước ngoài
</code></pre>
<h3>Chiến lược toàn cầu trong một câu</h3>
<p>Một <strong>chiến lược toàn cầu</strong> (Peng) là lý thuyết của doanh nghiệp về cách cạnh tranh thành công với đối thủ trên nhiều quốc gia — quyết định cạnh tranh Ở ĐÂU, thâm nhập THẾ NÀO, và chuẩn hoá/thích ứng BAO NHIÊU. Phần còn lại của môn xây bộ công cụ để trả lời ba câu hỏi đó.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Doanh nghiệp coi "ra nước ngoài" chỉ là "bán thêm cái cũ" thường thất bại — chiến lược quốc tế cần nghĩ lại đồng thời môi trường, thâm nhập, cấu trúc và marketing.</div>`,
  ]]);

const c1q = quiz('ibs301m-quiz-1', 'Quiz 1 — Overview & global strategy|||Quiz 1 — Tổng quan & chiến lược toàn cầu', [
  { id: 'q1', question: 'Theo Dunning, động cơ "tìm hiệu quả" (efficiency seeking) khi quốc tế hoá là gì?', options: ['Tiếp cận khách hàng mới', 'Đạt lợi thế quy mô/phạm vi trên nhiều thị trường', 'Mua thương hiệu nước ngoài', 'Tránh thuế nội địa'], correctIndex: 1, explanation: 'Efficiency seeking nhằm đạt economies of scale/scope bằng cách phục vụ nhiều thị trường từ ít cơ sở sản xuất.' },
  { id: 'q2', question: 'Toàn cầu hoá (globalization) được thúc đẩy chủ yếu bởi?', options: ['Tăng rào cản thương mại', 'Giảm rào cản thương mại/đầu tư & tiến bộ công nghệ', 'Giảm dân số toàn cầu', 'Chỉ chính sách của một quốc gia'], correctIndex: 1, explanation: 'Hill: giảm rào cản thương mại/đầu tư cộng với công nghệ vận tải/truyền thông là hai động lực chính.' },
  { id: 'q3', question: 'Chiến lược toàn cầu (theo Peng) phải trả lời ba câu hỏi nào?', options: ['Ở đâu, thâm nhập thế nào, chuẩn hoá/thích ứng bao nhiêu', 'Giá bao nhiêu, bán cho ai, lãi bao nhiêu', 'Thuê ai, trả lương bao nhiêu, khi nào tuyển', 'Vốn bao nhiêu, vay ở đâu, trả nợ khi nào'], correctIndex: 0, explanation: 'Chiến lược toàn cầu quyết định thị trường mục tiêu, phương thức thâm nhập, và mức độ chuẩn hoá vs thích ứng.' },
]);

const c2 = doc('ibs301m-2-1-pestel-hofstede', '2.1 — International environment analysis: PESTEL & Hofstede|||2.1 — Phân tích môi trường quốc tế: PESTEL & Hofstede',
  'Khung PESTEL (Chính trị, Kinh tế, Xã hội, Công nghệ, Môi trường, Pháp lý) và 6 khác biệt văn hoá Hofstede để đọc thị trường nước ngoài.',
  [[
    `<span class="eyebrow">IBS301m · Chapter 2 · Lesson 2.1</span>
<h2>International environment analysis: PESTEL &amp; Hofstede</h2>
<h3>PESTEL framework</h3>
<pre><code>P - Political      : government stability, trade policy, taxation
E - Economic       : growth, inflation, exchange rates, income levels
S - Social         : demographics, lifestyle, consumer attitudes
T - Technological   : infrastructure, innovation rate, digital adoption
E - Environmental   : climate rules, sustainability expectations
L - Legal          : contract/IP law, labor law, regulatory compliance
</code></pre>
<p>Before entering a market, a firm scans each dimension to spot opportunities and risks that don't exist at home.</p>
<h3>Hofstede's cultural dimensions</h3>
<ul>
<li><strong>Power distance</strong> — how much inequality in authority is accepted.</li>
<li><strong>Individualism vs collectivism</strong> — self vs group as the basic social unit.</li>
<li><strong>Masculinity vs femininity</strong> — competition/achievement vs cooperation/care.</li>
<li><strong>Uncertainty avoidance</strong> — tolerance for ambiguity and risk.</li>
<li><strong>Long-term vs short-term orientation</strong> — pragmatic future focus vs tradition.</li>
<li><strong>Indulgence vs restraint</strong> — free gratification of desires vs strict social norms.</li>
</ul>
<div class="callout"><span class="badge">Use case</span> A firm entering a high power-distance, collectivist market (e.g. many Asian markets) should adapt management style and marketing tone differently than in a low power-distance, individualist market.</div>`,
    `<span class="eyebrow">IBS301m · Chương 2 · Bài 2.1</span>
<h2>Phân tích môi trường quốc tế: PESTEL &amp; Hofstede</h2>
<h3>Khung PESTEL</h3>
<pre><code>P - Chính trị  : ổn định chính phủ, chính sách thương mại, thuế
E - Kinh tế    : tăng trưởng, lạm phát, tỷ giá, mức thu nhập
S - Xã hội     : dân số học, phong cách sống, thái độ tiêu dùng
T - Công nghệ  : hạ tầng, tốc độ đổi mới, mức độ số hoá
E - Môi trường : quy định khí hậu, kỳ vọng bền vững
L - Pháp lý    : luật hợp đồng/sở hữu trí tuệ, luật lao động, tuân thủ
</code></pre>
<p>Trước khi thâm nhập một thị trường, doanh nghiệp rà từng chiều để phát hiện cơ hội và rủi ro không tồn tại ở thị trường nội địa.</p>
<h3>Các chiều văn hoá của Hofstede</h3>
<ul>
<li><strong>Khoảng cách quyền lực</strong> — mức độ chấp nhận bất bình đẳng về quyền lực.</li>
<li><strong>Chủ nghĩa cá nhân vs tập thể</strong> — cá nhân hay nhóm là đơn vị xã hội cơ bản.</li>
<li><strong>Nam tính vs nữ tính</strong> — cạnh tranh/thành tích vs hợp tác/quan tâm.</li>
<li><strong>Né tránh sự không chắc chắn</strong> — khả năng chịu đựng mơ hồ và rủi ro.</li>
<li><strong>Định hướng dài hạn vs ngắn hạn</strong> — tập trung tương lai thực dụng vs truyền thống.</li>
<li><strong>Hưởng thụ vs kiềm chế</strong> — tự do thoả mãn mong muốn vs chuẩn mực xã hội nghiêm.</li>
</ul>
<div class="callout"><span class="badge">Ứng dụng</span> Doanh nghiệp vào thị trường có khoảng cách quyền lực cao, tập thể (nhiều thị trường châu Á) nên điều chỉnh phong cách quản lý và giọng điệu marketing khác với thị trường khoảng cách quyền lực thấp, cá nhân.</div>`,
  ]]);

const c2q = quiz('ibs301m-quiz-2', 'Quiz 2 — PESTEL & Hofstede|||Quiz 2 — PESTEL & Hofstede', [
  { id: 'q1', question: 'Chữ "T" trong PESTEL đại diện cho yếu tố nào?', options: ['Thương mại (Trade)', 'Công nghệ (Technological)', 'Thuế (Tax)', 'Thời tiết (Temperature)'], correctIndex: 1, explanation: 'PESTEL: Political, Economic, Social, Technological, Environmental, Legal.' },
  { id: 'q2', question: 'Chiều văn hoá Hofstede nào đo mức độ chấp nhận bất bình đẳng quyền lực?', options: ['Uncertainty avoidance', 'Power distance', 'Long-term orientation', 'Indulgence'], correctIndex: 1, explanation: 'Power distance (khoảng cách quyền lực) đo mức độ xã hội chấp nhận sự bất bình đẳng về quyền lực.' },
  { id: 'q3', question: 'Vì sao doanh nghiệp cần phân tích PESTEL trước khi thâm nhập thị trường?', options: ['Để tính lương nhân viên', 'Để phát hiện cơ hội & rủi ro không có ở thị trường nội địa', 'Để thiết kế logo mới', 'Để chọn màu sản phẩm'], correctIndex: 1, explanation: 'PESTEL giúp rà môi trường bên ngoài (chính trị, kinh tế, xã hội, công nghệ, môi trường, pháp lý) đặc thù của thị trường mới.' },
]);

const c3 = doc('ibs301m-3-1-porter-diamond', '3.1 — National competitive advantage: Porter\'s Diamond|||3.1 — Lợi thế cạnh tranh quốc gia: kim cương Porter',
  'Mô hình kim cương Porter: điều kiện nhân tố, điều kiện cầu, ngành hỗ trợ liên quan, chiến lược/cấu trúc/cạnh tranh doanh nghiệp; vai trò chính phủ & cơ may.',
  [[
    `<span class="eyebrow">IBS301m · Chapter 3 · Lesson 3.1</span>
<h2>National competitive advantage: Porter's Diamond</h2>
<p>Michael Porter asked: why do firms from a particular NATION succeed in a particular industry globally? His <strong>Diamond Model</strong> identifies four interacting determinants.</p>
<pre><code>          Firm strategy,
          structure & rivalry
                |
Factor  --------+-------- Demand
conditions      |         conditions
                |
        Related & supporting
             industries

     (Government & Chance shape all four)
</code></pre>
<ul>
<li><strong>Factor conditions</strong> — a nation's inputs: labor, infrastructure, capital, specialized skills (not just raw endowment — CREATED advanced factors matter more).</li>
<li><strong>Demand conditions</strong> — sophisticated, demanding home buyers push firms to innovate and improve quality early.</li>
<li><strong>Related &amp; supporting industries</strong> — strong local suppliers and complementary industries (clusters) create spillovers and competitive pressure.</li>
<li><strong>Firm strategy, structure &amp; rivalry</strong> — intense domestic competition forces firms to become efficient and innovative before they compete abroad.</li>
</ul>
<div class="callout"><span class="badge">Example</span> Vietnam's electronics assembly and textile/garment clusters benefit from labor factor conditions, government FDI policy, and increasingly from supporting-industry depth — key questions for policy and firm strategy alike.</div>`,
    `<span class="eyebrow">IBS301m · Chương 3 · Bài 3.1</span>
<h2>Lợi thế cạnh tranh quốc gia: kim cương Porter</h2>
<p>Michael Porter đặt câu hỏi: vì sao doanh nghiệp của một QUỐC GIA lại thành công toàn cầu trong một ngành cụ thể? <strong>Mô hình kim cương</strong> của ông xác định bốn yếu tố quyết định tương tác nhau.</p>
<pre><code>       Chiến lược, cấu trúc
       & cạnh tranh doanh nghiệp
                |
Điều kiện ------+------ Điều kiện
nhân tố         |       cầu
                |
      Ngành hỗ trợ & liên quan

    (Chính phủ & Cơ may định hình cả bốn)
</code></pre>
<ul>
<li><strong>Điều kiện nhân tố</strong> — đầu vào của quốc gia: lao động, hạ tầng, vốn, kỹ năng chuyên biệt (không chỉ tài nguyên sẵn có — nhân tố cao cấp được TẠO RA quan trọng hơn).</li>
<li><strong>Điều kiện cầu</strong> — khách hàng nội địa khó tính, tinh tế thúc doanh nghiệp đổi mới và nâng chất lượng sớm.</li>
<li><strong>Ngành hỗ trợ &amp; liên quan</strong> — nhà cung ứng nội địa mạnh và ngành bổ trợ (cụm ngành) tạo hiệu ứng lan toả và áp lực cạnh tranh.</li>
<li><strong>Chiến lược, cấu trúc &amp; cạnh tranh doanh nghiệp</strong> — cạnh tranh nội địa gay gắt buộc doanh nghiệp trở nên hiệu quả và sáng tạo trước khi cạnh tranh ra nước ngoài.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ</span> Cụm ngành lắp ráp điện tử và dệt may/may mặc Việt Nam hưởng lợi từ điều kiện nhân tố lao động, chính sách FDI của chính phủ, và ngày càng từ chiều sâu ngành hỗ trợ — câu hỏi quan trọng cho cả chính sách và chiến lược doanh nghiệp.</div>`,
  ]]);

const c3q = quiz('ibs301m-quiz-3', 'Quiz 3 — Porter\'s Diamond|||Quiz 3 — Kim cương Porter', [
  { id: 'q1', question: 'Mô hình kim cương Porter giải thích điều gì?', options: ['Vì sao tỷ giá thay đổi', 'Vì sao doanh nghiệp một quốc gia thành công toàn cầu trong một ngành', 'Vì sao lãi suất tăng', 'Vì sao dân số tăng'], correctIndex: 1, explanation: 'Kim cương Porter phân tích lợi thế cạnh tranh quốc gia trong một ngành cụ thể.' },
  { id: 'q2', question: '"Điều kiện cầu" (demand conditions) trong mô hình kim cương nghĩa là?', options: ['Số lượng nhà máy trong nước', 'Khách hàng nội địa khó tính thúc đẩy đổi mới sớm', 'Mức thuế xuất khẩu', 'Số lượng đối thủ nước ngoài'], correctIndex: 1, explanation: 'Cầu nội địa tinh tế, khó tính buộc doanh nghiệp cải thiện chất lượng và đổi mới trước khi ra quốc tế.' },
  { id: 'q3', question: 'Yếu tố nào KHÔNG phải một trong bốn góc chính của kim cương Porter?', options: ['Điều kiện nhân tố', 'Điều kiện cầu', 'Tỷ giá hối đoái', 'Chiến lược/cấu trúc/cạnh tranh doanh nghiệp'], correctIndex: 2, explanation: 'Bốn góc chính là điều kiện nhân tố, điều kiện cầu, ngành hỗ trợ liên quan, chiến lược/cấu trúc/cạnh tranh doanh nghiệp; chính phủ & cơ may là yếu tố phụ định hình cả bốn.' },
]);

const c4 = doc('ibs301m-4-1-entry-modes', '4.1 — International market entry modes|||4.1 — Phương thức thâm nhập thị trường quốc tế',
  'Xuất khẩu, cấp phép/nhượng quyền, liên doanh, đầu tư trực tiếp FDI (greenfield vs mua lại); đánh đổi giữa quyền kiểm soát, rủi ro và nguồn lực.',
  [[
    `<span class="eyebrow">IBS301m · Chapter 4 · Lesson 4.1</span>
<h2>International market entry modes</h2>
<pre><code>Low control/risk/commitment          High control/risk/commitment
Exporting -> Licensing/Franchising -> Joint Venture -> Wholly Owned Subsidiary (FDI)
</code></pre>
<ul>
<li><strong>Exporting</strong> (direct or via intermediaries) — lowest commitment, fast entry, but limited local presence and exposed to trade barriers/tariffs.</li>
<li><strong>Licensing / Franchising</strong> — a local partner uses your IP/brand for a fee; low capital risk, but weaker control over quality and risk of creating a future competitor.</li>
<li><strong>Joint venture (JV)</strong> — share ownership with a local partner; shares risk and local knowledge, but shared control can create conflict over strategy.</li>
<li><strong>Wholly owned subsidiary (FDI)</strong> — <em>greenfield</em> (build new) or <em>acquisition</em> (buy existing); highest control and profit potential, but highest capital commitment and risk.</li>
</ul>
<h3>Choosing the mode</h3>
<p>The choice balances: desired <strong>control</strong>, tolerance for <strong>risk</strong>, available <strong>resources/capital</strong>, need for <strong>local knowledge</strong>, and host-country restrictions (some markets legally require a local JV partner).</p>
<div class="callout"><span class="badge">Example</span> A Vietnamese food-tech startup might start by exporting, then license its brand regionally, before eventually forming a JV or FDI subsidiary once it has capital and local knowledge.</div>`,
    `<span class="eyebrow">IBS301m · Chương 4 · Bài 4.1</span>
<h2>Phương thức thâm nhập thị trường quốc tế</h2>
<pre><code>Kiểm soát/rủi ro/cam kết THẤP        Kiểm soát/rủi ro/cam kết CAO
Xuất khẩu -> Cấp phép/Nhượng quyền -> Liên doanh -> Công ty con 100% (FDI)
</code></pre>
<ul>
<li><strong>Xuất khẩu</strong> (trực tiếp hoặc qua trung gian) — cam kết thấp nhất, thâm nhập nhanh, nhưng hiện diện địa phương hạn chế và chịu rào cản thương mại/thuế quan.</li>
<li><strong>Cấp phép / Nhượng quyền</strong> — đối tác địa phương dùng sở hữu trí tuệ/thương hiệu của bạn có trả phí; rủi ro vốn thấp, nhưng kiểm soát chất lượng yếu hơn và rủi ro tạo ra đối thủ tương lai.</li>
<li><strong>Liên doanh (JV)</strong> — chia sẻ quyền sở hữu với đối tác địa phương; chia sẻ rủi ro và hiểu biết địa phương, nhưng quyền kiểm soát chung có thể gây xung đột chiến lược.</li>
<li><strong>Công ty con sở hữu 100% (FDI)</strong> — <em>greenfield</em> (xây mới) hoặc <em>mua lại</em> (acquisition); kiểm soát và lợi nhuận tiềm năng cao nhất, nhưng cam kết vốn và rủi ro cao nhất.</li>
</ul>
<h3>Chọn phương thức nào</h3>
<p>Lựa chọn cân bằng giữa: mức <strong>kiểm soát</strong> mong muốn, khả năng chịu <strong>rủi ro</strong>, <strong>vốn/nguồn lực</strong> sẵn có, nhu cầu <strong>hiểu biết địa phương</strong>, và hạn chế của nước chủ nhà (một số thị trường buộc phải có đối tác liên doanh nội địa theo luật).</p>
<div class="callout"><span class="badge">Ví dụ</span> Một startup food-tech Việt Nam có thể bắt đầu bằng xuất khẩu, rồi cấp phép thương hiệu theo khu vực, trước khi lập liên doanh hoặc công ty con FDI khi đã có vốn và hiểu biết địa phương.</div>`,
  ]]);

const c4q = quiz('ibs301m-quiz-4', 'Quiz 4 — Entry modes|||Quiz 4 — Phương thức thâm nhập', [
  { id: 'q1', question: 'Phương thức thâm nhập nào có mức kiểm soát và cam kết vốn CAO NHẤT?', options: ['Xuất khẩu', 'Cấp phép', 'Liên doanh', 'Công ty con sở hữu 100% (FDI)'], correctIndex: 3, explanation: 'FDI dạng công ty con 100% (greenfield hoặc mua lại) đòi hỏi vốn và mang lại kiểm soát cao nhất.' },
  { id: 'q2', question: 'Rủi ro chính của cấp phép (licensing) là gì?', options: ['Cam kết vốn quá lớn', 'Kiểm soát chất lượng yếu & có thể tạo ra đối thủ tương lai', 'Không thể thâm nhập nhanh', 'Luôn vi phạm pháp luật'], correctIndex: 1, explanation: 'Đối tác được cấp phép nắm công nghệ/thương hiệu, có thể trở thành đối thủ cạnh tranh sau này.' },
  { id: 'q3', question: 'Liên doanh (joint venture) mang lại lợi ích chính nào?', options: ['Kiểm soát tuyệt đối', 'Chia sẻ rủi ro & tận dụng hiểu biết địa phương của đối tác', 'Không cần vốn', 'Loại bỏ hoàn toàn rủi ro chính trị'], correctIndex: 1, explanation: 'JV chia sẻ vốn, rủi ro và kiến thức thị trường địa phương với đối tác.' },
]);

const c5 = doc('ibs301m-5-1-integration-responsiveness', '5.1 — Global vs local strategy: the integration-responsiveness grid|||5.1 — Chiến lược toàn cầu vs địa phương hoá: lưới tích hợp-thích ứng',
  'Áp lực tích hợp toàn cầu (chi phí) vs áp lực thích ứng địa phương (khách hàng); bốn chiến lược: quốc tế, đa địa phương, toàn cầu, xuyên quốc gia (Bartlett/Ghoshal).',
  [[
    `<span class="eyebrow">IBS301m · Chapter 5 · Lesson 5.1</span>
<h2>Global vs local strategy: the integration-responsiveness grid</h2>
<p>Every MNC faces two opposing pressures. The <strong>Integration-Responsiveness (I-R) grid</strong> (Bartlett &amp; Ghoshal) maps four strategies from them.</p>
<pre><code>High global integration
        |  Global strategy      Transnational strategy
        |  (standardize,        (standardize AND adapt,
        |   centralize)          share knowledge globally)
        |
        |  International        Multidomestic strategy
        |  strategy              (adapt fully per country,
        |  (export core          decentralize)
Low ----+---------------------------------------- High local
        product w/ minor tweaks)          responsiveness
</code></pre>
<ul>
<li><strong>International strategy</strong> — low pressure both ways; export the home product with minor tweaks (e.g. leverage a unique core competence globally).</li>
<li><strong>Multidomestic strategy</strong> — high local responsiveness, low integration; adapt product/marketing fully per country, decentralized subsidiaries (classic for consumer goods with strong local taste differences).</li>
<li><strong>Global strategy</strong> — high integration, low responsiveness; standardize product and centralize production for cost efficiency (e.g. semiconductors, commodities).</li>
<li><strong>Transnational strategy</strong> — high BOTH; standardize where possible, adapt where needed, and transfer knowledge/innovation across the whole network — hardest to execute, most competitive when achieved.</li>
</ul>
<div class="callout"><span class="badge">Example</span> Fast-food chains typically run multidomestic-leaning menus (local taste) inside a globally standardized brand and operations system — closer to transnational in practice.</div>`,
    `<span class="eyebrow">IBS301m · Chương 5 · Bài 5.1</span>
<h2>Chiến lược toàn cầu vs địa phương hoá: lưới tích hợp-thích ứng</h2>
<p>Mọi công ty đa quốc gia đối mặt hai áp lực đối nghịch. <strong>Lưới tích hợp-thích ứng (I-R)</strong> (Bartlett &amp; Ghoshal) vẽ ra bốn chiến lược từ đó.</p>
<pre><code>Tích hợp toàn cầu CAO
        |  Chiến lược toàn cầu    Chiến lược xuyên quốc gia
        |  (chuẩn hoá,            (vừa chuẩn hoá vừa thích ứng,
        |   tập trung hoá)         chia sẻ tri thức toàn cầu)
        |
        |  Chiến lược quốc tế      Chiến lược đa địa phương
        |  (xuất khẩu sản phẩm     (thích ứng hoàn toàn theo
THẤP ---+--- gốc, chỉnh nhẹ) --------- nước, phân quyền) --- CAO
                                        Thích ứng địa phương
</code></pre>
<ul>
<li><strong>Chiến lược quốc tế</strong> — áp lực cả hai phía thấp; xuất khẩu sản phẩm gốc với chỉnh sửa nhỏ (tận dụng năng lực cốt lõi độc đáo trên toàn cầu).</li>
<li><strong>Chiến lược đa địa phương</strong> — thích ứng địa phương cao, tích hợp thấp; điều chỉnh sản phẩm/marketing hoàn toàn theo từng nước, chi nhánh phân quyền (điển hình cho hàng tiêu dùng có khác biệt vị/thị hiếu địa phương lớn).</li>
<li><strong>Chiến lược toàn cầu</strong> — tích hợp cao, thích ứng thấp; chuẩn hoá sản phẩm và tập trung hoá sản xuất để tiết kiệm chi phí (vd bán dẫn, hàng hoá cơ bản).</li>
<li><strong>Chiến lược xuyên quốc gia</strong> — CẢ HAI cao; chuẩn hoá nơi có thể, thích ứng nơi cần, và chuyển giao tri thức/đổi mới xuyên toàn mạng lưới — khó thực hiện nhất, cạnh tranh nhất khi đạt được.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ</span> Chuỗi thức ăn nhanh thường có thực đơn nghiêng đa địa phương (vị địa phương) trong một hệ thống thương hiệu &amp; vận hành chuẩn hoá toàn cầu — thực tế gần với xuyên quốc gia hơn.</div>`,
  ]]);

const c5q = quiz('ibs301m-quiz-5', 'Quiz 5 — Integration-responsiveness|||Quiz 5 — Tích hợp-thích ứng', [
  { id: 'q1', question: 'Chiến lược nào có áp lực tích hợp toàn cầu CAO và thích ứng địa phương THẤP?', options: ['Chiến lược đa địa phương', 'Chiến lược toàn cầu', 'Chiến lược quốc tế', 'Không chiến lược nào'], correctIndex: 1, explanation: 'Chiến lược toàn cầu chuẩn hoá & tập trung hoá sản xuất để tối ưu chi phí, ít thích ứng địa phương.' },
  { id: 'q2', question: 'Chiến lược xuyên quốc gia (transnational) khác biệt ở điểm nào?', options: ['Chỉ tập trung chi phí thấp', 'Vừa chuẩn hoá vừa thích ứng, chia sẻ tri thức toàn mạng lưới', 'Chỉ thích ứng, không chuẩn hoá gì', 'Không cần chi nhánh nước ngoài'], correctIndex: 1, explanation: 'Transnational theo Bartlett/Ghoshal đạt CẢ hai áp lực cao — khó nhất nhưng cạnh tranh nhất.' },
  { id: 'q3', question: 'Chiến lược đa địa phương (multidomestic) phù hợp nhất khi nào?', options: ['Khi sản phẩm hoàn toàn giống nhau mọi nơi', 'Khi khác biệt thị hiếu/vị địa phương lớn và áp lực chi phí thấp', 'Khi chi phí sản xuất là ưu tiên duy nhất', 'Khi công ty chỉ hoạt động trong nước'], correctIndex: 1, explanation: 'Đa địa phương ưu tiên thích ứng sâu theo từng nước khi khác biệt địa phương lớn hơn lợi ích chuẩn hoá.' },
]);

const c6 = doc('ibs301m-6-1-mnc-structure-governance', '6.1 — MNC structure & governance|||6.1 — Cấu trúc & quản trị công ty đa quốc gia',
  'Cấu trúc tổ chức MNC: khối quốc tế, khối sản phẩm toàn cầu, khối khu vực, ma trận, mạng xuyên quốc gia; tập trung hoá vs phân quyền; chuyển giao tri thức.',
  [[
    `<span class="eyebrow">IBS301m · Chapter 6 · Lesson 6.1</span>
<h2>MNC structure &amp; governance</h2>
<h3>Common organizational structures</h3>
<ul>
<li><strong>International division</strong> — a single unit handles all foreign operations alongside domestic divisions; simple but can silo global expertise.</li>
<li><strong>Global product division</strong> — worldwide responsibility for a product line; good for standardized products, but weak local responsiveness.</li>
<li><strong>Geographic/area division</strong> — worldwide responsibility split by region; strong local responsiveness, but harder to coordinate a global product strategy.</li>
<li><strong>Matrix structure</strong> — dual reporting lines (product AND geography); tries to get both benefits, at the cost of complexity and slower decisions.</li>
<li><strong>Transnational network</strong> (Bartlett &amp; Ghoshal) — an integrated network where subsidiaries specialize and contribute knowledge back to the whole firm, not just receive orders from HQ.</li>
</ul>
<h3>Centralization vs decentralization</h3>
<p>Headquarters must decide how much decision authority to push down to subsidiaries. Centralize when global consistency/cost efficiency matters most; decentralize when local market knowledge and speed matter most.</p>
<div class="callout"><span class="badge">Knowledge flows</span> In a transnational network, innovation can originate in ANY subsidiary and flow both ways — not just top-down from headquarters — which is why the structure supports a transnational strategy from Chapter 5.</div>`,
    `<span class="eyebrow">IBS301m · Chương 6 · Bài 6.1</span>
<h2>Cấu trúc &amp; quản trị công ty đa quốc gia</h2>
<h3>Các cấu trúc tổ chức phổ biến</h3>
<ul>
<li><strong>Khối quốc tế (international division)</strong> — một đơn vị duy nhất quản lý toàn bộ hoạt động nước ngoài, tách biệt với khối trong nước; đơn giản nhưng dễ cô lập chuyên môn toàn cầu.</li>
<li><strong>Khối sản phẩm toàn cầu</strong> — chịu trách nhiệm toàn cầu cho một dòng sản phẩm; tốt cho sản phẩm chuẩn hoá, nhưng yếu về thích ứng địa phương.</li>
<li><strong>Khối khu vực/địa lý</strong> — chịu trách nhiệm toàn cầu chia theo vùng; thích ứng địa phương tốt, nhưng khó điều phối chiến lược sản phẩm toàn cầu.</li>
<li><strong>Cấu trúc ma trận</strong> — báo cáo kép (theo sản phẩm VÀ theo khu vực); cố lấy cả hai lợi ích, đánh đổi bằng độ phức tạp và quyết định chậm hơn.</li>
<li><strong>Mạng xuyên quốc gia</strong> (Bartlett &amp; Ghoshal) — mạng lưới tích hợp nơi chi nhánh chuyên môn hoá và đóng góp tri thức trở lại toàn công ty, không chỉ nhận lệnh từ trụ sở.</li>
</ul>
<h3>Tập trung hoá vs phân quyền</h3>
<p>Trụ sở phải quyết định đẩy bao nhiêu quyền quyết định xuống chi nhánh. Tập trung hoá khi nhất quán toàn cầu/hiệu quả chi phí quan trọng nhất; phân quyền khi hiểu biết thị trường địa phương và tốc độ quan trọng nhất.</p>
<div class="callout"><span class="badge">Luồng tri thức</span> Trong mạng xuyên quốc gia, đổi mới có thể xuất phát từ BẤT KỲ chi nhánh nào và chảy theo cả hai chiều — không chỉ từ trên xuống từ trụ sở — đây là lý do cấu trúc này hỗ trợ chiến lược xuyên quốc gia ở Chương 5.</div>`,
  ]]);

const c6q = quiz('ibs301m-quiz-6', 'Quiz 6 — MNC structure|||Quiz 6 — Cấu trúc MNC', [
  { id: 'q1', question: 'Cấu trúc "khối sản phẩm toàn cầu" (global product division) mạnh ở điểm gì?', options: ['Thích ứng địa phương cao', 'Quản lý thống nhất, chuẩn hoá sản phẩm toàn cầu', 'Không cần trụ sở', 'Chi phí luôn thấp nhất'], correctIndex: 1, explanation: 'Khối sản phẩm toàn cầu chịu trách nhiệm một dòng sản phẩm trên toàn thế giới, phù hợp sản phẩm chuẩn hoá.' },
  { id: 'q2', question: 'Cấu trúc ma trận (matrix) đánh đổi điều gì để có cả hai lợi ích sản phẩm và khu vực?', options: ['Tăng độ phức tạp & quyết định chậm hơn', 'Giảm chi phí tuyệt đối', 'Loại bỏ hoàn toàn trụ sở', 'Không cần báo cáo'], correctIndex: 0, explanation: 'Báo cáo kép trong ma trận tạo phức tạp tổ chức và có thể làm chậm quyết định.' },
  { id: 'q3', question: 'Điểm khác biệt của "mạng xuyên quốc gia" so với cấu trúc truyền thống là gì?', options: ['Chỉ trụ sở ra quyết định', 'Tri thức/đổi mới có thể chảy hai chiều giữa chi nhánh và trụ sở', 'Chi nhánh hoàn toàn độc lập, không chia sẻ gì', 'Không có chi nhánh nước ngoài'], correctIndex: 1, explanation: 'Mạng xuyên quốc gia coi mỗi chi nhánh là nguồn đóng góp tri thức, không chỉ nơi thực thi lệnh.' },
]);

const c7 = doc('ibs301m-7-1-global-marketing-value-chain', '7.1 — Global marketing strategy & the value chain|||7.1 — Chiến lược marketing & chuỗi giá trị toàn cầu',
  'Cấu hình & điều phối chuỗi giá trị toàn cầu; chuẩn hoá vs thích ứng marketing mix (4P); outsourcing/offshoring chuỗi cung ứng toàn cầu.',
  [[
    `<span class="eyebrow">IBS301m · Chapter 7 · Lesson 7.1</span>
<h2>Global marketing strategy &amp; the value chain</h2>
<h3>Configuring the global value chain</h3>
<p>A firm decides WHERE each value-chain activity (R&amp;D, manufacturing, marketing, service) happens:</p>
<ul>
<li><strong>Concentrated configuration</strong> — one location serves the world (economies of scale, easier control) — used when integration pressure is high.</li>
<li><strong>Dispersed configuration</strong> — activities spread across many countries (closer to customers/inputs, hedges currency/political risk) — used when responsiveness pressure is high.</li>
</ul>
<p><strong>Coordination</strong> is how those dispersed activities are managed together — logistics, quality standards, shared information systems.</p>
<h3>Standardization vs adaptation of the marketing mix (4Ps)</h3>
<pre><code>Product : same design everywhere        vs  localized features/taste
Price   : global reference price        vs  local purchasing-power pricing
Place   : centralized global channel    vs  local distribution partners
Promotion: one global campaign          vs  culturally tailored messaging
</code></pre>
<p>Most real firms mix both — global brand identity with local execution (echoing the transnational strategy of Chapter 5).</p>
<div class="callout"><span class="badge">Supply chain link</span> Outsourcing/offshoring manufacturing to lower-cost countries is a value-chain configuration decision — it must be weighed against quality control, lead time, and reputational/ethical risk (Chapter 8).</div>`,
    `<span class="eyebrow">IBS301m · Chương 7 · Bài 7.1</span>
<h2>Chiến lược marketing &amp; chuỗi giá trị toàn cầu</h2>
<h3>Cấu hình chuỗi giá trị toàn cầu</h3>
<p>Doanh nghiệp quyết định mỗi hoạt động chuỗi giá trị (R&amp;D, sản xuất, marketing, dịch vụ) diễn ra Ở ĐÂU:</p>
<ul>
<li><strong>Cấu hình tập trung</strong> — một địa điểm phục vụ toàn cầu (lợi thế quy mô, dễ kiểm soát) — dùng khi áp lực tích hợp cao.</li>
<li><strong>Cấu hình phân tán</strong> — hoạt động trải rộng nhiều quốc gia (gần khách hàng/nguyên liệu hơn, giảm rủi ro tỷ giá/chính trị) — dùng khi áp lực thích ứng cao.</li>
</ul>
<p><strong>Điều phối (coordination)</strong> là cách quản lý các hoạt động phân tán đó cùng nhau — logistics, chuẩn chất lượng, hệ thống thông tin chung.</p>
<h3>Chuẩn hoá vs thích ứng marketing mix (4P)</h3>
<pre><code>Sản phẩm  : thiết kế giống nhau mọi nơi   vs  tính năng/vị địa phương hoá
Giá       : giá tham chiếu toàn cầu       vs  giá theo sức mua địa phương
Phân phối : kênh toàn cầu tập trung       vs  đối tác phân phối địa phương
Truyền thông: một chiến dịch toàn cầu     vs  thông điệp điều chỉnh theo văn hoá
</code></pre>
<p>Hầu hết doanh nghiệp thật kết hợp cả hai — bản sắc thương hiệu toàn cầu với thực thi địa phương (gợi lại chiến lược xuyên quốc gia ở Chương 5).</p>
<div class="callout"><span class="badge">Liên kết chuỗi cung ứng</span> Thuê ngoài/dịch chuyển sản xuất (outsourcing/offshoring) sang nước chi phí thấp là quyết định cấu hình chuỗi giá trị — cần cân với kiểm soát chất lượng, thời gian giao hàng, và rủi ro danh tiếng/đạo đức (Chương 8).</div>`,
  ]]);

const c7q = quiz('ibs301m-quiz-7', 'Quiz 7 — Global marketing & value chain|||Quiz 7 — Marketing & chuỗi giá trị toàn cầu', [
  { id: 'q1', question: 'Cấu hình chuỗi giá trị "tập trung" (concentrated) phù hợp khi nào?', options: ['Khi áp lực thích ứng địa phương cao', 'Khi áp lực tích hợp toàn cầu cao, cần lợi thế quy mô', 'Khi không có khách hàng quốc tế', 'Khi tỷ giá luôn ổn định'], correctIndex: 1, explanation: 'Cấu hình tập trung tận dụng lợi thế quy mô và dễ kiểm soát, phù hợp áp lực tích hợp cao.' },
  { id: 'q2', question: 'Trong 4P marketing quốc tế, "Place" thích ứng địa phương nghĩa là?', options: ['Dùng một kênh phân phối toàn cầu duy nhất', 'Dùng đối tác phân phối địa phương phù hợp thị trường', 'Không phân phối ở nước ngoài', 'Chỉ bán online toàn cầu'], correctIndex: 1, explanation: 'Thích ứng "Place" nghĩa là dùng kênh/đối tác phân phối phù hợp với từng thị trường địa phương.' },
  { id: 'q3', question: 'Outsourcing/offshoring sản xuất là quyết định thuộc phạm trù nào?', options: ['Cấu hình chuỗi giá trị toàn cầu', 'Chỉ là quyết định nhân sự', 'Chỉ là quyết định giá', 'Không liên quan chiến lược quốc tế'], correctIndex: 0, explanation: 'Chọn nơi sản xuất/thuê ngoài là một quyết định cấu hình (WHERE) trong chuỗi giá trị toàn cầu.' },
]);

const c8 = doc('ibs301m-8-1-risk-ethics-vietnam-going-global', '8.1 — International risk, ethics & Vietnamese firms going global|||8.1 — Rủi ro quốc tế, đạo đức & doanh nghiệp Việt Nam vươn ra toàn cầu',
  'Rủi ro chính trị/kinh tế/tỷ giá; đạo đức kinh doanh & CSR quốc tế; case Vinamilk/Viettel/VinFast và chiến lược quốc tế hoá cho doanh nghiệp Việt Nam.',
  [[
    `<span class="eyebrow">IBS301m · Chapter 8 · Lesson 8.1</span>
<h2>International risk, ethics &amp; Vietnamese firms going global</h2>
<h3>Types of international risk</h3>
<ul>
<li><strong>Political risk</strong> — expropriation, sudden regulation changes, instability, sanctions.</li>
<li><strong>Economic risk</strong> — recession, inflation, sudden shifts in a host country's economic policy.</li>
<li><strong>Currency/exchange-rate risk</strong> — revenue and costs in different currencies exposed to FX swings; can be hedged financially or operationally (e.g. matching costs/revenues in the same currency).</li>
</ul>
<h3>Ethics &amp; CSR across borders</h3>
<p>What is normal in one country's business culture may be illegal or unethical in another (e.g. labor standards, environmental rules, anti-bribery laws such as the FCPA). MNCs increasingly adopt a single global <strong>code of conduct</strong> rather than "when in Rome" local flexibility, especially on labor and anti-corruption.</p>
<h3>Vietnamese firms going global</h3>
<p>Vietnamese companies increasingly apply this course's toolkit in reverse — internationalizing FROM Vietnam:</p>
<ul>
<li><strong>Vinamilk</strong> — export + local subsidiaries/JVs across Asia, Middle East, Africa.</li>
<li><strong>Viettel</strong> — FDI/greenfield telecom investment across multiple developing markets.</li>
<li><strong>VinFast</strong> — FDI (US manufacturing) plus exporting, targeting brand-building in developed markets.</li>
</ul>
<div class="callout"><span class="badge">Takeaway</span> The same frameworks — PESTEL/Hofstede, Porter's Diamond, entry modes, I-R grid, structure, value chain — apply whether a foreign firm enters Vietnam, or a Vietnamese firm goes global.</div>`,
    `<span class="eyebrow">IBS301m · Chương 8 · Bài 8.1</span>
<h2>Rủi ro quốc tế, đạo đức &amp; doanh nghiệp Việt Nam vươn ra toàn cầu</h2>
<h3>Các loại rủi ro quốc tế</h3>
<ul>
<li><strong>Rủi ro chính trị</strong> — tịch thu tài sản, thay đổi quy định bất ngờ, bất ổn, cấm vận.</li>
<li><strong>Rủi ro kinh tế</strong> — suy thoái, lạm phát, thay đổi đột ngột chính sách kinh tế nước chủ nhà.</li>
<li><strong>Rủi ro tỷ giá</strong> — doanh thu và chi phí ở các đồng tiền khác nhau chịu biến động tỷ giá; có thể phòng ngừa bằng tài chính hoặc vận hành (vd khớp chi phí/doanh thu cùng đồng tiền).</li>
</ul>
<h3>Đạo đức &amp; CSR xuyên biên giới</h3>
<p>Điều bình thường trong văn hoá kinh doanh một nước có thể bất hợp pháp hoặc phi đạo đức ở nước khác (vd chuẩn lao động, quy định môi trường, luật chống hối lộ như FCPA). MNC ngày càng áp dụng một <strong>quy tắc đạo đức</strong> toàn cầu duy nhất thay vì linh hoạt "nhập gia tuỳ tục" theo địa phương, đặc biệt về lao động và chống tham nhũng.</p>
<h3>Doanh nghiệp Việt Nam vươn ra toàn cầu</h3>
<p>Doanh nghiệp Việt Nam ngày càng áp dụng ngược lại bộ công cụ của môn học — quốc tế hoá TỪ Việt Nam:</p>
<ul>
<li><strong>Vinamilk</strong> — xuất khẩu + chi nhánh/liên doanh địa phương khắp châu Á, Trung Đông, châu Phi.</li>
<li><strong>Viettel</strong> — đầu tư FDI/greenfield viễn thông tại nhiều thị trường đang phát triển.</li>
<li><strong>VinFast</strong> — FDI (sản xuất tại Mỹ) cộng xuất khẩu, hướng tới xây thương hiệu ở thị trường phát triển.</li>
</ul>
<div class="callout"><span class="badge">Kết luận</span> Cùng những khung lý thuyết — PESTEL/Hofstede, kim cương Porter, phương thức thâm nhập, lưới I-R, cấu trúc, chuỗi giá trị — áp dụng được cả khi doanh nghiệp nước ngoài vào Việt Nam, và khi doanh nghiệp Việt Nam vươn ra toàn cầu.</div>`,
  ]]);

const c8q = quiz('ibs301m-quiz-8', 'Quiz 8 — Risk, ethics & Vietnam going global|||Quiz 8 — Rủi ro, đạo đức & DN Việt Nam ra toàn cầu', [
  { id: 'q1', question: 'Rủi ro nào phát sinh khi chính phủ nước chủ nhà tịch thu tài sản hoặc thay đổi quy định đột ngột?', options: ['Rủi ro tỷ giá', 'Rủi ro chính trị', 'Rủi ro công nghệ', 'Rủi ro nhân sự'], correctIndex: 1, explanation: 'Tịch thu tài sản, thay đổi quy định bất ngờ, bất ổn chính trị đều thuộc rủi ro chính trị.' },
  { id: 'q2', question: 'Vì sao nhiều MNC áp dụng MỘT quy tắc đạo đức toàn cầu duy nhất thay vì tuỳ theo địa phương?', options: ['Vì luật mọi nước giống nhau', 'Để tránh vi phạm chuẩn lao động/chống hối lộ dù chuẩn địa phương khác nhau', 'Vì rẻ hơn', 'Vì không ai kiểm tra'], correctIndex: 1, explanation: 'Một chuẩn đạo đức toàn cầu giúp tránh rủi ro pháp lý/danh tiếng khi chuẩn địa phương thấp hơn chuẩn quốc tế.' },
  { id: 'q3', question: 'VinFast quốc tế hoá chủ yếu bằng phương thức nào theo case trong bài?', options: ['Chỉ nhượng quyền', 'FDI (sản xuất tại Mỹ) kết hợp xuất khẩu', 'Chỉ liên doanh', 'Không quốc tế hoá'], correctIndex: 1, explanation: 'VinFast đầu tư FDI sản xuất tại Mỹ và kết hợp xuất khẩu để xây thương hiệu ở thị trường phát triển.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'IBS301m',
    slug: 'ibs301m-international-business-strategy',
    title: 'International Business Strategy',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IBS301m.webp',
    shortDescription: 'How firms compete across borders — PESTEL/Hofstede, Porter Diamond, entry modes, global vs local (I-R grid), MNC structure, global marketing, risk/ethics & Vietnamese firms going global. Bilingual, examples & quizzes.|||Doanh nghiệp cạnh tranh xuyên biên giới thế nào — PESTEL/Hofstede, kim cương Porter, phương thức thâm nhập, toàn cầu vs địa phương (I-R), cấu trúc MNC, marketing toàn cầu, rủi ro/đạo đức & DN Việt Nam ra toàn cầu. Song ngữ, có quiz.',
    description: 'Môn <strong>IBS301m — International Business Strategy</strong> (kỳ 5, khối Quản trị Kinh doanh) giúp hiểu <strong>doanh nghiệp cạnh tranh xuyên biên giới thế nào</strong>. Từ <strong>môi trường quốc tế</strong> (PESTEL, văn hoá Hofstede) → <strong>lợi thế cạnh tranh quốc gia</strong> (kim cương Porter) → <strong>phương thức thâm nhập</strong> (xuất khẩu, liên doanh, FDI) → <strong>chiến lược toàn cầu vs địa phương hoá</strong> (lưới tích hợp-thích ứng) → <strong>cấu trúc &amp; quản trị MNC</strong> → <strong>marketing &amp; chuỗi giá trị toàn cầu</strong> → <strong>rủi ro quốc tế, đạo đức &amp; doanh nghiệp Việt Nam vươn ra toàn cầu</strong>. Trích dẫn Hill, Peng, Bartlett/Ghoshal, song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Động cơ quốc tế hoá (Dunning); PESTEL & 6 chiều văn hoá Hofstede; kim cương Porter (điều kiện nhân tố/cầu/ngành hỗ trợ/cạnh tranh doanh nghiệp); phương thức thâm nhập (xuất khẩu, cấp phép, liên doanh, FDI); lưới tích hợp-thích ứng (quốc tế/đa địa phương/toàn cầu/xuyên quốc gia); cấu trúc & quản trị MNC (khối quốc tế/sản phẩm/khu vực/ma trận/mạng xuyên quốc gia); cấu hình & điều phối chuỗi giá trị toàn cầu; chuẩn hoá vs thích ứng marketing mix (4P); rủi ro chính trị/kinh tế/tỷ giá; đạo đức kinh doanh & CSR; case doanh nghiệp Việt Nam (Vinamilk, Viettel, VinFast) vươn ra toàn cầu.',
    requirements: 'Kiến thức quản trị/kinh doanh nền tảng (chiến lược, marketing cơ bản). Nên đã học các môn đại cương về quản trị kinh doanh trước kỳ 5.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách Hill/Peng/Bartlett-Ghoshal, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Kinh doanh quốc tế, động cơ quốc tế hoá, lộ trình môn học.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & chiến lược toàn cầu|||Chapter 1 — Overview & global strategy', description: 'Kinh doanh quốc tế, động cơ toàn cầu hoá, chiến lược toàn cầu.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Môi trường quốc tế: PESTEL & Hofstede|||Chapter 2 — International environment: PESTEL & Hofstede', description: 'PESTEL, 6 chiều văn hoá Hofstede.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Lợi thế cạnh tranh quốc gia: kim cương Porter|||Chapter 3 — National advantage: Porter\'s Diamond', description: 'Điều kiện nhân tố, cầu, ngành hỗ trợ, cạnh tranh doanh nghiệp.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Phương thức thâm nhập thị trường|||Chapter 4 — Market entry modes', description: 'Xuất khẩu, cấp phép, liên doanh, FDI.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Toàn cầu vs địa phương hoá|||Chapter 5 — Global vs local strategy', description: 'Lưới tích hợp-thích ứng (I-R), bốn chiến lược.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Cấu trúc & quản trị MNC|||Chapter 6 — MNC structure & governance', description: 'Cấu trúc tổ chức, tập trung hoá vs phân quyền.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Marketing & chuỗi giá trị toàn cầu|||Chapter 7 — Global marketing & value chain', description: 'Cấu hình chuỗi giá trị, chuẩn hoá vs thích ứng 4P.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Rủi ro, đạo đức & DN Việt Nam ra toàn cầu|||Chapter 8 — Risk, ethics & Vietnamese firms going global', description: 'Rủi ro chính trị/kinh tế/tỷ giá, đạo đức, case Việt Nam.', lessons: [c8, c8q] },
  ],
};
