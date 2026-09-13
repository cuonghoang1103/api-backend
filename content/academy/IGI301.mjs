/**
 * IGI301 — Intercultural and Global Integrated Marketing Communication
 * (Truyền thông marketing tích hợp liên văn hoá & toàn cầu). Khối Công nghệ
 * Truyền thông FPTU. Môn KHÔNG có FLM → dựng theo giáo trình chuẩn quốc tế:
 * De Mooij "Global Marketing and Advertising: Understanding Cultural
 * Paradoxes", Hofstede "Cultures and Organizations", Keegan "Global Marketing
 * Management", Hall "Beyond Culture" (high/low context), WARC Global.
 * 8 chương: truyền thông toàn cầu là gì → chiều văn hoá → chuẩn hoá vs bản
 * địa hoá → thông điệp & sáng tạo liên văn hoá → thương hiệu toàn cầu →
 * digital toàn cầu → rào cản & sai lầm → quản trị & đo lường đa thị trường.
 * Song ngữ + mô hình + ví dụ thương hiệu toàn cầu thật + quiz.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('igi301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách kinh điển (De Mooij, Hofstede, Keegan, Hall), Hofstede Insights, WARC/AdAge/Campaign, công cụ, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">IGI301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need to learn <strong>intercultural &amp; global integrated marketing communication</strong> — how brands communicate one idea across many cultures without losing meaning — in one place. There is no single FPTU textbook; we follow the international standard bodies of knowledge below.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.routledge.com/Global-Marketing-and-Advertising-Understanding-Cultural-Paradoxes/Mooij/p/book/9781544319308" target="_blank" rel="noopener">Marieke de Mooij — <em>Global Marketing and Advertising: Understanding Cultural Paradoxes</em></a> (core text)</li>
<li><a href="https://geerthofstede.com/culture-geert-hofstede-gert-jan-hofstede/6d-model-of-national-culture/" target="_blank" rel="noopener">Hofstede, Hofstede &amp; Minkov — <em>Cultures and Organizations: Software of the Mind</em></a> (6-D model)</li>
<li><a href="https://en.wikipedia.org/wiki/Edward_T._Hall" target="_blank" rel="noopener">Edward T. Hall — <em>Beyond Culture</em></a> (high/low context)</li>
<li><a href="https://en.wikipedia.org/wiki/Global_marketing" target="_blank" rel="noopener">Keegan &amp; Green — <em>Global Marketing Management</em></a> (market entry &amp; strategy)</li>
</ul>
<h3>🌐 Official / free resources</h3>
<ul>
<li><a href="https://www.hofstede-insights.com/country-comparison-tool" target="_blank" rel="noopener">Hofstede Insights — Country Comparison Tool</a> (compare any two cultures free)</li>
<li><a href="https://www.warc.com/" target="_blank" rel="noopener">WARC</a> — global advertising effectiveness case library</li>
<li><a href="https://adage.com/" target="_blank" rel="noopener">Ad Age</a> &amp; <a href="https://www.campaignlive.com/" target="_blank" rel="noopener">Campaign</a> — industry news &amp; global cases</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=hofstede+cultural+dimensions" target="_blank" rel="noopener">Hofstede's cultural dimensions explained</a></li>
<li><a href="https://www.youtube.com/results?search_query=global+advertising+localization" target="_blank" rel="noopener">Global advertising &amp; localization case studies</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what globalization does to IMC, why culture is the hidden variable behind every message.</li>
<li><strong>Frameworks</strong> — Hofstede's 6 dimensions and Hall's high/low context; compare two real markets on Hofstede Insights.</li>
<li><strong>Apply</strong> — take one global brand (McDonald's, Coca-Cola, Nike) and map how it standardizes the idea but localizes the execution.</li>
<li><strong>Job-ready</strong> — read WARC cases, dissect a real translation blunder, and plan a two-market campaign with shared KPIs.</li>
</ol></div>`,
    `<span class="eyebrow">IGI301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>truyền thông marketing tích hợp liên văn hoá &amp; toàn cầu</strong> — cách thương hiệu truyền một ý tưởng qua nhiều nền văn hoá mà không mất nghĩa — gom về một chỗ. Môn không có giáo trình FPTU riêng; ta bám bộ kiến thức chuẩn quốc tế dưới đây.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.routledge.com/Global-Marketing-and-Advertising-Understanding-Cultural-Paradoxes/Mooij/p/book/9781544319308" target="_blank" rel="noopener">Marieke de Mooij — <em>Global Marketing and Advertising: Understanding Cultural Paradoxes</em></a> (sách lõi)</li>
<li><a href="https://geerthofstede.com/culture-geert-hofstede-gert-jan-hofstede/6d-model-of-national-culture/" target="_blank" rel="noopener">Hofstede, Hofstede &amp; Minkov — <em>Cultures and Organizations: Software of the Mind</em></a> (mô hình 6 chiều)</li>
<li><a href="https://en.wikipedia.org/wiki/Edward_T._Hall" target="_blank" rel="noopener">Edward T. Hall — <em>Beyond Culture</em></a> (bối cảnh cao/thấp)</li>
<li><a href="https://en.wikipedia.org/wiki/Global_marketing" target="_blank" rel="noopener">Keegan &amp; Green — <em>Global Marketing Management</em></a> (thâm nhập thị trường &amp; chiến lược)</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.hofstede-insights.com/country-comparison-tool" target="_blank" rel="noopener">Hofstede Insights — công cụ so sánh quốc gia</a> (so hai nền văn hoá miễn phí)</li>
<li><a href="https://www.warc.com/" target="_blank" rel="noopener">WARC</a> — thư viện case hiệu quả quảng cáo toàn cầu</li>
<li><a href="https://adage.com/" target="_blank" rel="noopener">Ad Age</a> &amp; <a href="https://www.campaignlive.com/" target="_blank" rel="noopener">Campaign</a> — tin ngành &amp; case toàn cầu</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/results?search_query=hofstede+cultural+dimensions" target="_blank" rel="noopener">Giải thích các chiều văn hoá Hofstede</a></li>
<li><a href="https://www.youtube.com/results?search_query=global+advertising+localization" target="_blank" rel="noopener">Case quảng cáo toàn cầu &amp; bản địa hoá</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — toàn cầu hoá tác động gì đến IMC, vì sao văn hoá là biến ẩn sau mọi thông điệp.</li>
<li><strong>Khung mô hình</strong> — 6 chiều Hofstede và bối cảnh cao/thấp của Hall; so hai thị trường thật trên Hofstede Insights.</li>
<li><strong>Áp dụng</strong> — lấy một thương hiệu toàn cầu (McDonald's, Coca-Cola, Nike) và soi cách nó chuẩn hoá ý tưởng nhưng bản địa hoá cách thể hiện.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc case WARC, mổ một sự cố dịch thuật thật, và lập kế hoạch chiến dịch hai thị trường với KPI chung.</li>
</ol></div>`,
  ]]);

const intro = doc('igi301-0-1-overview', 'Course overview: Intercultural & global IMC|||Tổng quan: IMC liên văn hoá & toàn cầu',
  'IMC toàn cầu là gì; nghịch lý văn hoá (De Mooij); vì sao "một thông điệp cho cả thế giới" thường thất bại; lộ trình 8 chương.',
  [[
    `<span class="eyebrow">IGI301 · Lesson 0.1 · Overview</span>
<h2>Intercultural &amp; global IMC</h2>
<p class="lead">This course is about a deceptively hard job: <strong>getting one brand idea to land in many cultures at once</strong>. Integrated Marketing Communication (IMC) already asks you to make advertising, PR, digital, promotion and packaging all say the same thing. Do it <em>across borders</em> and a new variable appears — <strong>culture</strong> — which quietly rewrites what a colour, a word, a gesture or an appeal means.</p>
<h3>The central paradox</h3>
<p>Marieke de Mooij calls it the <strong>cultural paradox</strong>: as economies converge, <em>consumer behaviour diverges</em>. People buy more of the same product categories, yet the <em>reasons</em> they buy, and the messages that move them, stay stubbornly local. So the naive dream — "one global ad for everyone" — usually underperforms a campaign that keeps the idea global but adapts the execution.</p>
<h3>Roadmap (8 chapters)</h3>
<p>Globalization &amp; why culture matters → cultural dimensions (Hofstede, Hall) → standardization vs localization (glocalization) → cross-cultural message &amp; creative → global brands → global digital &amp; social → barriers &amp; blunders → multi-market campaign management &amp; measurement. Bilingual, with real global brand cases and a quiz per chapter.</p>`,
    `<span class="eyebrow">IGI301 · Bài 0.1 · Tổng quan</span>
<h2>IMC liên văn hoá &amp; toàn cầu</h2>
<p class="lead">Môn này nói về một việc khó ngầm: <strong>làm cho một ý tưởng thương hiệu chạm được nhiều nền văn hoá cùng lúc</strong>. Truyền thông marketing tích hợp (IMC) vốn đã bắt bạn làm cho quảng cáo, PR, digital, khuyến mãi và bao bì cùng nói một điều. Làm việc đó <em>xuyên biên giới</em> thì xuất hiện một biến mới — <strong>văn hoá</strong> — thứ âm thầm viết lại nghĩa của một màu sắc, một từ, một cử chỉ hay một cách khơi gợi.</p>
<h3>Nghịch lý trung tâm</h3>
<p>Marieke de Mooij gọi đó là <strong>nghịch lý văn hoá</strong>: khi kinh tế hội tụ thì <em>hành vi người tiêu dùng lại phân kỳ</em>. Người ta mua cùng nhóm sản phẩm nhiều hơn, nhưng <em>lý do</em> họ mua và thông điệp lay động họ thì vẫn rất địa phương. Vì thế giấc mơ ngây thơ — "một mẩu quảng cáo toàn cầu cho tất cả" — thường thua một chiến dịch giữ ý tưởng toàn cầu nhưng chỉnh cách thể hiện.</p>
<h3>Lộ trình (8 chương)</h3>
<p>Toàn cầu hoá &amp; vì sao văn hoá quan trọng → các chiều văn hoá (Hofstede, Hall) → chuẩn hoá vs bản địa hoá (glocalization) → thông điệp &amp; sáng tạo liên văn hoá → thương hiệu toàn cầu → digital &amp; social toàn cầu → rào cản &amp; sai lầm → quản trị &amp; đo lường chiến dịch đa thị trường. Song ngữ, có case thương hiệu toàn cầu thật và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('igi301-1-1-global-comm', '1.1 — Global communication & why culture matters|||1.1 — Truyền thông toàn cầu & vì sao văn hoá quan trọng',
  'Toàn cầu hoá, thị trường toàn cầu vs địa phương, văn hoá là "lập trình tâm trí" (Hofstede), vì sao IMC không thể sao chép nguyên xi giữa các nước.',
  [[
    `<span class="eyebrow">IGI301 · Chapter 1 · Lesson 1.1</span>
<h2>Global communication &amp; why culture matters</h2>
<h3>What globalization did to marketing</h3>
<p><strong>Globalization</strong> — cheaper trade, travel and the internet — let brands sell the same products almost everywhere. But it did NOT make audiences the same. A message is <em>encoded</em> by a sender and <em>decoded</em> by a receiver through their own cultural lens; the wider the cultural gap, the more the decoded meaning drifts from what was sent.</p>
<h3>Culture as "software of the mind"</h3>
<p>Hofstede defines <strong>culture</strong> as the <em>collective mental programming</em> that distinguishes one group from another — learned, shared, and largely invisible to the people inside it. It shapes what is polite, funny, aspirational or offensive. Because most of it is invisible, marketers assume "everyone thinks like us" — the classic <strong>Self-Reference Criterion</strong> that sinks cross-border campaigns.</p>
<h3>Why IMC cannot just be copy-pasted</h3>
<ul>
<li><strong>Language</strong> — the same claim translates awkwardly, or loses its pun.</li>
<li><strong>Values</strong> — an appeal to individual success motivates in the US but can feel arrogant elsewhere.</li>
<li><strong>Media habits</strong> — the dominant channel differs (TV vs LINE vs WeChat vs WhatsApp).</li>
<li><strong>Regulation</strong> — what you may say about health, alcohol or competitors varies by country.</li>
</ul>
<div class="callout"><span class="badge">Real case</span> <strong>McDonald's</strong> sells the same brand worldwide yet builds culture in: the <em>Maharaja Mac</em> (chicken, no beef) in India, <em>McArabia</em> in the Gulf, teriyaci burgers in Japan. The golden arches are global; the menu is local.</div>`,
    `<span class="eyebrow">IGI301 · Chương 1 · Bài 1.1</span>
<h2>Truyền thông toàn cầu &amp; vì sao văn hoá quan trọng</h2>
<h3>Toàn cầu hoá đã làm gì với marketing</h3>
<p><strong>Toàn cầu hoá</strong> — thương mại, đi lại rẻ hơn và internet — cho phép thương hiệu bán gần như cùng một sản phẩm ở khắp nơi. Nhưng nó KHÔNG làm khán giả giống nhau. Một thông điệp được người gửi <em>mã hoá</em> và người nhận <em>giải mã</em> qua lăng kính văn hoá của họ; khoảng cách văn hoá càng rộng thì nghĩa giải mã ra càng lệch khỏi điều đã gửi.</p>
<h3>Văn hoá là "phần mềm của tâm trí"</h3>
<p>Hofstede định nghĩa <strong>văn hoá</strong> là <em>lập trình tâm trí tập thể</em> phân biệt nhóm này với nhóm khác — được học, được chia sẻ, và phần lớn vô hình với chính người trong đó. Nó quyết định điều gì lịch sự, hài hước, đáng mơ ước hay xúc phạm. Vì phần lớn vô hình, người làm marketing hay mặc định "ai cũng nghĩ như mình" — chính là <strong>tiêu chí tự quy chiếu</strong> (Self-Reference Criterion) nhấn chìm các chiến dịch xuyên biên giới.</p>
<h3>Vì sao không thể sao chép nguyên xi IMC</h3>
<ul>
<li><strong>Ngôn ngữ</strong> — cùng một lời khẳng định dịch ra thành vụng, hoặc mất chơi chữ.</li>
<li><strong>Giá trị</strong> — khơi gợi thành công cá nhân tạo động lực ở Mỹ nhưng nơi khác có thể thấy kiêu ngạo.</li>
<li><strong>Thói quen media</strong> — kênh chủ đạo khác nhau (TV vs LINE vs WeChat vs WhatsApp).</li>
<li><strong>Quy định</strong> — điều được nói về sức khoẻ, rượu bia hay đối thủ khác nhau theo nước.</li>
</ul>
<div class="callout"><span class="badge">Case thật</span> <strong>McDonald's</strong> bán cùng một thương hiệu toàn cầu nhưng cài văn hoá vào: <em>Maharaja Mac</em> (gà, không thịt bò) ở Ấn Độ, <em>McArabia</em> ở vùng Vịnh, burger teriyaci ở Nhật. Vòm vàng là toàn cầu; thực đơn là địa phương.</div>`,
  ]]);

const c1q = quiz('igi301-quiz-1', 'Quiz 1 — Global comm & culture|||Quiz 1 — Truyền thông toàn cầu & văn hoá', [
  { id: 'q1', question: 'Hofstede định nghĩa văn hoá là gì?', options: ['Ngôn ngữ của một nước', 'Lập trình tâm trí tập thể phân biệt nhóm này với nhóm khác', 'Tôn giáo chính thống', 'Thu nhập bình quân đầu người'], correctIndex: 1, explanation: 'Văn hoá = "software of the mind": lập trình tinh thần tập thể, được học và chia sẻ.' },
  { id: 'q2', question: '"Self-Reference Criterion" (tiêu chí tự quy chiếu) là lỗi gì?', options: ['Dịch sai ngôn ngữ', 'Mặc định người thị trường khác nghĩ/cảm giống mình', 'Chọn sai kênh media', 'Định giá quá cao'], correctIndex: 1, explanation: 'SRC: vô thức lấy văn hoá của mình làm chuẩn cho người khác — nguồn gốc nhiều thất bại xuyên biên giới.' },
  { id: 'q3', question: 'McDonald\'s bán Maharaja Mac (gà) ở Ấn Độ minh hoạ điều gì?', options: ['Chuẩn hoá hoàn toàn', 'Giữ thương hiệu toàn cầu nhưng bản địa hoá theo văn hoá địa phương', 'Rút khỏi thị trường', 'Bỏ logo toàn cầu'], correctIndex: 1, explanation: 'Vòm vàng toàn cầu, thực đơn địa phương — thương hiệu nhất quán, thể hiện thích ứng.' },
]);

const c2 = doc('igi301-2-1-cultural-dimensions', '2.1 — Cultural dimensions|||2.1 — Các chiều văn hoá',
  'Hofstede 6 chiều (PDI, IDV, MAS, UAI, LTO, IVR); Hall bối cảnh cao/thấp; Trompenaars; đọc một thị trường qua khung.',
  [[
    `<span class="eyebrow">IGI301 · Chapter 2 · Lesson 2.1</span>
<h2>Cultural dimensions — the maps</h2>
<p>Frameworks turn "culture" from a vague word into <em>comparable numbers</em>, so you can plan a message before you set foot in a market.</p>
<h3>Hofstede's 6 dimensions</h3>
<ul>
<li><strong>Power Distance (PDI)</strong> — how much a society accepts hierarchy. High PDI ads use authority, status, celebrity endorsement.</li>
<li><strong>Individualism vs Collectivism (IDV)</strong> — "I" vs "we". Individualist markets sell self-expression; collectivist markets sell family, group harmony, belonging.</li>
<li><strong>Masculinity vs Femininity (MAS)</strong> — achievement/competition vs care/quality-of-life.</li>
<li><strong>Uncertainty Avoidance (UAI)</strong> — comfort with ambiguity. High UAI wants proof, guarantees, expert testimony.</li>
<li><strong>Long-Term Orientation (LTO)</strong> — thrift &amp; perseverance vs tradition &amp; quick results.</li>
<li><strong>Indulgence vs Restraint (IVR)</strong> — free gratification vs restraint by social norms.</li>
</ul>
<h3>Hall — high vs low context</h3>
<p>Edward T. Hall split cultures by how much meaning sits <em>in the words</em> vs <em>in the context</em>. <strong>Low-context</strong> (Germany, US) — say it explicitly, spell out the claim. <strong>High-context</strong> (Japan, Vietnam, Arab world) — meaning is implied through relationship, tone and imagery; an ad that is too blunt feels crude.</p>
<h3>Trompenaars</h3>
<p>Adds pairs such as <em>universalism vs particularism</em> (rules vs relationships) and <em>neutral vs affective</em> (how openly emotion is shown) — useful when Hofstede feels too coarse.</p>
<div class="callout"><span class="badge">Real case</span> The same body wash runs a <strong>self-confidence "you deserve it"</strong> appeal in individualist markets, and a <strong>"a mother's care for the family"</strong> appeal in collectivist ones — one product, two value frames.</div>`,
    `<span class="eyebrow">IGI301 · Chương 2 · Bài 2.1</span>
<h2>Các chiều văn hoá — những tấm bản đồ</h2>
<p>Khung lý thuyết biến "văn hoá" từ một từ mơ hồ thành <em>những con số so sánh được</em>, để bạn hoạch định thông điệp trước cả khi đặt chân vào thị trường.</p>
<h3>6 chiều của Hofstede</h3>
<ul>
<li><strong>Khoảng cách quyền lực (PDI)</strong> — mức xã hội chấp nhận thứ bậc. PDI cao dùng uy quyền, địa vị, người nổi tiếng bảo chứng.</li>
<li><strong>Chủ nghĩa cá nhân vs tập thể (IDV)</strong> — "tôi" vs "chúng ta". Thị trường cá nhân bán cái tôi; thị trường tập thể bán gia đình, hoà hợp nhóm, sự thuộc về.</li>
<li><strong>Nam tính vs nữ tính (MAS)</strong> — thành tựu/cạnh tranh vs quan tâm/chất lượng sống.</li>
<li><strong>Né tránh bất định (UAI)</strong> — mức thoải mái với mơ hồ. UAI cao đòi bằng chứng, bảo hành, lời chuyên gia.</li>
<li><strong>Định hướng dài hạn (LTO)</strong> — tiết kiệm &amp; kiên trì vs truyền thống &amp; kết quả nhanh.</li>
<li><strong>Hưởng thụ vs kiềm chế (IVR)</strong> — thoả mãn tự do vs kiềm chế bởi chuẩn mực xã hội.</li>
</ul>
<h3>Hall — bối cảnh cao vs thấp</h3>
<p>Edward T. Hall chia văn hoá theo mức nghĩa nằm <em>trong lời</em> hay <em>trong bối cảnh</em>. <strong>Bối cảnh thấp</strong> (Đức, Mỹ) — nói thẳng, giải thích rõ lời khẳng định. <strong>Bối cảnh cao</strong> (Nhật, Việt Nam, Ả Rập) — nghĩa được ngụ ý qua quan hệ, giọng điệu và hình ảnh; quảng cáo quá thẳng thừng bị thấy thô.</p>
<h3>Trompenaars</h3>
<p>Thêm các cặp như <em>phổ quát vs cá biệt</em> (luật lệ vs quan hệ) và <em>trung tính vs cảm xúc</em> (bộc lộ cảm xúc công khai đến đâu) — hữu ích khi Hofstede thấy quá thô.</p>
<div class="callout"><span class="badge">Case thật</span> Cùng một sữa tắm chạy khơi gợi <strong>tự tin "bạn xứng đáng"</strong> ở thị trường cá nhân, và <strong>"sự chăm sóc của người mẹ cho gia đình"</strong> ở thị trường tập thể — một sản phẩm, hai khung giá trị.</div>`,
  ]]);

const c2q = quiz('igi301-quiz-2', 'Quiz 2 — Cultural dimensions|||Quiz 2 — Chiều văn hoá', [
  { id: 'q1', question: 'Chiều Hofstede nào phân biệt "tôi" với "chúng ta"?', options: ['Power Distance (PDI)', 'Individualism vs Collectivism (IDV)', 'Uncertainty Avoidance (UAI)', 'Indulgence (IVR)'], correctIndex: 1, explanation: 'IDV: thị trường cá nhân bán cái tôi/tự thể hiện; tập thể bán gia đình, nhóm, sự thuộc về.' },
  { id: 'q2', question: 'Văn hoá "bối cảnh cao" (Hall) như Nhật/Việt Nam thì thông điệp nên?', options: ['Nói thẳng, liệt kê rõ mọi lợi ích', 'Ngụ ý qua quan hệ, giọng điệu, hình ảnh; tránh quá thẳng thừng', 'Bỏ hết hình ảnh, chỉ dùng chữ', 'Luôn dùng so sánh trực diện với đối thủ'], correctIndex: 1, explanation: 'Bối cảnh cao: nghĩa nằm trong bối cảnh; quá blunt bị thấy thô. Bối cảnh thấp mới nói thẳng.' },
  { id: 'q3', question: 'Thị trường Uncertainty Avoidance (UAI) cao phản hồi tốt nhất với?', options: ['Sự mơ hồ, để người xem tự hiểu', 'Bằng chứng, bảo hành, lời chuyên gia', 'Hài hước phi lý', 'Không thông tin sản phẩm'], correctIndex: 1, explanation: 'UAI cao muốn giảm rủi ro: proof, guarantee, testimonial của chuyên gia.' },
]);

const c3 = doc('igi301-3-1-standardize-localize', '3.1 — Standardization vs localization|||3.1 — Chuẩn hoá vs bản địa hoá',
  'Chuẩn hoá vs thích ứng, glocalization, "think global act local", ma trận quyết định điều gì giữ chung điều gì đổi.',
  [[
    `<span class="eyebrow">IGI301 · Chapter 3 · Lesson 3.1</span>
<h2>Standardization vs localization</h2>
<p>The core strategic choice in global IMC. It is not either/or but a <em>dial</em> you set element by element.</p>
<h3>The two poles</h3>
<ul>
<li><strong>Standardization</strong> — one strategy, message and execution everywhere. Wins on <em>cost, speed and a consistent global brand</em>; risks cultural mismatch.</li>
<li><strong>Localization (adaptation)</strong> — tailor to each market. Wins on <em>relevance and resonance</em>; costs more and can fragment the brand.</li>
</ul>
<h3>Glocalization — "think global, act local"</h3>
<p>The practical middle ground: keep the <strong>brand idea, positioning and identity global</strong>, but <strong>localize the execution</strong> — language, casting, examples, media, sometimes the product. The rule of thumb: <em>standardize the strategy, localize the tactics</em>.</p>
<pre><code>What usually stays GLOBAL   |  What usually goes LOCAL
----------------------------|---------------------------
Brand name, logo, colours   |  Language &amp; copy / puns
Core positioning &amp; idea     |  Casting, faces, settings
Quality standards           |  Media mix &amp; channels
Global tagline (often)      |  Product variants, promotions</code></pre>
<div class="callout"><span class="badge">Real case</span> <strong>Coca-Cola "Share a Coke"</strong> kept one global idea — put a name on the bottle — but localized the <em>names</em> to each country (and used nicknames where privacy law blocked real names). Global idea, local list.</div>`,
    `<span class="eyebrow">IGI301 · Chương 3 · Bài 3.1</span>
<h2>Chuẩn hoá vs bản địa hoá</h2>
<p>Lựa chọn chiến lược cốt lõi trong IMC toàn cầu. Không phải hoặc-này-hoặc-kia mà là một <em>núm xoay</em> bạn chỉnh cho từng thành phần.</p>
<h3>Hai cực</h3>
<ul>
<li><strong>Chuẩn hoá</strong> — một chiến lược, thông điệp và cách thể hiện ở mọi nơi. Được ở <em>chi phí, tốc độ và thương hiệu toàn cầu nhất quán</em>; rủi ro lệch văn hoá.</li>
<li><strong>Bản địa hoá (thích ứng)</strong> — may đo cho từng thị trường. Được ở <em>sự liên quan và cộng hưởng</em>; tốn hơn và có thể làm phân mảnh thương hiệu.</li>
</ul>
<h3>Glocalization — "nghĩ toàn cầu, làm địa phương"</h3>
<p>Điểm giữa thực dụng: giữ <strong>ý tưởng thương hiệu, định vị và nhận diện ở tầm toàn cầu</strong>, nhưng <strong>bản địa hoá cách thể hiện</strong> — ngôn ngữ, chọn diễn viên, ví dụ, media, đôi khi cả sản phẩm. Nguyên tắc: <em>chuẩn hoá chiến lược, bản địa hoá chiến thuật</em>.</p>
<pre><code>Thường GIỮ TOÀN CẦU        |  Thường ĐỔI ĐỊA PHƯƠNG
---------------------------|---------------------------
Tên, logo, màu             |  Ngôn ngữ &amp; copy / chơi chữ
Định vị &amp; ý tưởng lõi      |  Diễn viên, gương mặt, bối cảnh
Chuẩn chất lượng           |  Media mix &amp; kênh
Tagline toàn cầu (thường)  |  Biến thể sản phẩm, khuyến mãi</code></pre>
<div class="callout"><span class="badge">Case thật</span> <strong>Coca-Cola "Share a Coke"</strong> giữ một ý tưởng toàn cầu — in tên lên chai — nhưng bản địa hoá <em>danh sách tên</em> theo từng nước (và dùng biệt danh nơi luật riêng tư chặn tên thật). Ý tưởng toàn cầu, danh sách địa phương.</div>`,
  ]]);

const c3q = quiz('igi301-quiz-3', 'Quiz 3 — Standardize vs localize|||Quiz 3 — Chuẩn hoá vs bản địa hoá', [
  { id: 'q1', question: '"Glocalization" nghĩa là?', options: ['Chuẩn hoá hoàn toàn mọi thứ', 'Giữ ý tưởng/định vị toàn cầu, bản địa hoá cách thể hiện', 'Bản địa hoá tất cả kể cả logo', 'Chỉ bán ở một nước'], correctIndex: 1, explanation: '"Think global, act local": chuẩn hoá chiến lược, bản địa hoá chiến thuật.' },
  { id: 'q2', question: 'Lợi thế lớn nhất của CHUẨN HOÁ là gì?', options: ['Liên quan văn hoá tối đa', 'Chi phí thấp, tốc độ, thương hiệu toàn cầu nhất quán', 'Không cần nghiên cứu thị trường', 'Luôn thắng bản địa hoá về doanh số'], correctIndex: 1, explanation: 'Chuẩn hoá tiết kiệm chi phí/thời gian và giữ thương hiệu nhất quán; đổi lại là rủi ro lệch văn hoá.' },
  { id: 'q3', question: '"Share a Coke" của Coca-Cola bản địa hoá phần nào?', options: ['Logo và màu', 'Danh sách tên/biệt danh in trên chai theo từng nước', 'Công thức nước ngọt', 'Tên thương hiệu'], correctIndex: 1, explanation: 'Ý tưởng "in tên lên chai" là toàn cầu; danh sách tên là địa phương.' },
]);

const c4 = doc('igi301-4-1-message-creative', '4.1 — Cross-cultural message & creative|||4.1 — Thông điệp & sáng tạo liên văn hoá',
  'Giá trị văn hoá trong quảng cáo, kiểu appeal (lý trí/cảm xúc), biểu tượng, màu sắc, ngôn ngữ; De Mooij về style quảng cáo theo văn hoá.',
  [[
    `<span class="eyebrow">IGI301 · Chapter 4 · Lesson 4.1</span>
<h2>Cross-cultural message &amp; creative</h2>
<p>Once strategy is set, the creative has to carry the idea across cultural codes — appeals, symbols, colour and language.</p>
<h3>Appeals &amp; advertising style</h3>
<p>De Mooij shows advertising <em>style</em> tracks culture: low-context cultures favour <strong>direct, informational, comparative</strong> ads; high-context cultures favour <strong>indirect, emotional, mood-and-imagery</strong> ads. An individualist market rewards a <strong>unique-self</strong> appeal; a collectivist one rewards <strong>belonging, harmony, family</strong>.</p>
<h3>Symbols &amp; colour</h3>
<ul>
<li><strong>Colour</strong> — white = purity in the West but mourning in parts of East Asia; red = luck/celebration in China, danger/stop in the West.</li>
<li><strong>Numbers &amp; gestures</strong> — 4 sounds like "death" in Chinese/Japanese; a thumbs-up or OK sign is offensive in some countries.</li>
<li><strong>Animals &amp; figures</strong> — cows are sacred in India; a pig image offends Muslim audiences.</li>
</ul>
<h3>Language beyond translation</h3>
<p>Good work is <strong>transcreated</strong>, not translated — it recreates the <em>intent and emotion</em>, often with a new line. Slogans built on English puns rarely survive a literal render.</p>
<div class="callout"><span class="badge">Real case</span> <strong>Nike "Just Do It"</strong> is a globally standardized idea, yet Nike localizes casting and story — e.g. featuring female athletes and the <em>Pro Hijab</em> for Muslim markets — so the same empowerment idea reads as locally relevant.</div>`,
    `<span class="eyebrow">IGI301 · Chương 4 · Bài 4.1</span>
<h2>Thông điệp &amp; sáng tạo liên văn hoá</h2>
<p>Khi chiến lược đã định, phần sáng tạo phải chở ý tưởng qua các mã văn hoá — cách khơi gợi, biểu tượng, màu sắc và ngôn ngữ.</p>
<h3>Kiểu khơi gợi &amp; phong cách quảng cáo</h3>
<p>De Mooij cho thấy <em>phong cách</em> quảng cáo bám theo văn hoá: văn hoá bối cảnh thấp thích quảng cáo <strong>trực tiếp, cung cấp thông tin, so sánh</strong>; bối cảnh cao thích <strong>gián tiếp, cảm xúc, thiên hình ảnh và tâm trạng</strong>. Thị trường cá nhân thưởng cho appeal <strong>cái tôi độc đáo</strong>; thị trường tập thể thưởng cho <strong>sự thuộc về, hoà hợp, gia đình</strong>.</p>
<h3>Biểu tượng &amp; màu sắc</h3>
<ul>
<li><strong>Màu</strong> — trắng = tinh khôi ở phương Tây nhưng tang tóc ở một phần Đông Á; đỏ = may mắn/lễ hội ở Trung Quốc, nguy hiểm/dừng ở phương Tây.</li>
<li><strong>Con số &amp; cử chỉ</strong> — số 4 nghe như "tử" trong tiếng Trung/Nhật; ngón cái hay dấu OK bị xúc phạm ở vài nước.</li>
<li><strong>Con vật &amp; hình tượng</strong> — bò là linh thiêng ở Ấn Độ; hình con lợn xúc phạm khán giả Hồi giáo.</li>
</ul>
<h3>Ngôn ngữ vượt trên dịch</h3>
<p>Bản tốt là <strong>transcreation (tái sáng tạo)</strong>, không phải dịch — nó tái tạo <em>ý định và cảm xúc</em>, thường bằng một câu mới. Slogan dựa trên chơi chữ tiếng Anh hiếm khi sống sót qua bản dịch nguyên văn.</p>
<div class="callout"><span class="badge">Case thật</span> <strong>Nike "Just Do It"</strong> là ý tưởng chuẩn hoá toàn cầu, nhưng Nike bản địa hoá diễn viên và câu chuyện — ví dụ đưa vận động viên nữ và <em>Pro Hijab</em> cho thị trường Hồi giáo — để cùng một ý tưởng trao quyền vẫn thấy liên quan tại chỗ.</div>`,
  ]]);

const c4q = quiz('igi301-quiz-4', 'Quiz 4 — Message & creative|||Quiz 4 — Thông điệp & sáng tạo', [
  { id: 'q1', question: '"Transcreation" khác "translation" ở chỗ?', options: ['Chỉ dịch nghĩa đen từng từ', 'Tái tạo ý định & cảm xúc, thường bằng một câu mới', 'Không đổi gì cả', 'Chỉ đổi màu sắc'], correctIndex: 1, explanation: 'Transcreation tái sáng tạo thông điệp cho văn hoá đích, giữ intent chứ không dịch máy móc.' },
  { id: 'q2', question: 'Màu trắng ở một phần Đông Á thường mang nghĩa gì (khác phương Tây)?', options: ['May mắn', 'Tang tóc', 'Giàu sang', 'Trẻ trung'], correctIndex: 1, explanation: 'Trắng = tang ở nhiều nước Đông Á; ở phương Tây = tinh khôi. Ý nghĩa màu phụ thuộc văn hoá.' },
  { id: 'q3', question: 'Theo De Mooij, văn hoá bối cảnh cao thích phong cách quảng cáo nào?', options: ['Trực tiếp, so sánh, nhiều thông tin', 'Gián tiếp, cảm xúc, thiên hình ảnh/tâm trạng', 'Chỉ liệt kê thông số', 'Luôn dùng người nổi tiếng'], correctIndex: 1, explanation: 'Bối cảnh cao ưa gián tiếp, cảm xúc; bối cảnh thấp ưa trực tiếp, informational.' },
]);

const c5 = doc('igi301-5-1-global-brand', '5.1 — Global brands & market entry|||5.1 — Thương hiệu toàn cầu & thâm nhập thị trường',
  'Thương hiệu toàn cầu, nhất quán qua các thị trường, kiến trúc thương hiệu, phương thức thâm nhập (Keegan); cân bằng nhất quán vs liên quan.',
  [[
    `<span class="eyebrow">IGI301 · Chapter 5 · Lesson 5.1</span>
<h2>Global brands &amp; market entry</h2>
<h3>What makes a brand "global"</h3>
<p>A <strong>global brand</strong> carries the same core identity, positioning and quality promise across markets, so a customer recognizes it anywhere. Its value comes from <strong>consistency</strong> — logo, colours, tone, brand promise — which builds trust and economies of scale. The tension is always <em>consistency vs local relevance</em>.</p>
<h3>Brand consistency across markets</h3>
<ul>
<li><strong>Fixed core</strong> — name, logo, colour system, brand values, tagline (usually).</li>
<li><strong>Flexible layer</strong> — campaign stories, spokespeople, product mix, promotions.</li>
<li><strong>Guardrails</strong> — a global <em>brand book</em> keeps every market on-brand while allowing local execution.</li>
</ul>
<h3>Market entry modes (Keegan)</h3>
<pre><code>Lower control / risk  ->  Higher control / risk
Exporting  ->  Licensing / Franchising  ->  Joint venture  ->  Wholly-owned subsidiary</code></pre>
<p>The entry mode shapes IMC: a franchise (McDonald's) needs tight brand control with local operators; a JV shares control with a partner who knows the market.</p>
<div class="callout"><span class="badge">Real case</span> <strong>Coca-Cola</strong> and <strong>Nike</strong> keep a globally consistent identity (the script logo; the swoosh + "Just Do It") for decades, yet run market-specific campaigns underneath — the textbook "consistent core, flexible execution".</div>`,
    `<span class="eyebrow">IGI301 · Chương 5 · Bài 5.1</span>
<h2>Thương hiệu toàn cầu &amp; thâm nhập thị trường</h2>
<h3>Điều gì làm nên một thương hiệu "toàn cầu"</h3>
<p>Một <strong>thương hiệu toàn cầu</strong> mang cùng nhận diện lõi, định vị và lời hứa chất lượng qua các thị trường, để khách hàng nhận ra nó ở bất cứ đâu. Giá trị của nó đến từ <strong>sự nhất quán</strong> — logo, màu, tông giọng, lời hứa — tạo niềm tin và lợi thế quy mô. Căng thẳng luôn là <em>nhất quán vs liên quan địa phương</em>.</p>
<h3>Nhất quán thương hiệu qua các thị trường</h3>
<ul>
<li><strong>Lõi cố định</strong> — tên, logo, hệ màu, giá trị thương hiệu, tagline (thường).</li>
<li><strong>Lớp linh hoạt</strong> — câu chuyện chiến dịch, gương mặt đại diện, cơ cấu sản phẩm, khuyến mãi.</li>
<li><strong>Rào chắn</strong> — một <em>brand book</em> toàn cầu giữ mọi thị trường đúng thương hiệu mà vẫn cho thể hiện địa phương.</li>
</ul>
<h3>Phương thức thâm nhập (Keegan)</h3>
<pre><code>Kiểm soát / rủi ro thấp  ->  Kiểm soát / rủi ro cao
Xuất khẩu  ->  Cấp phép / Nhượng quyền  ->  Liên doanh  ->  Công ty con sở hữu toàn bộ</code></pre>
<p>Phương thức thâm nhập định hình IMC: nhượng quyền (McDonald's) cần kiểm soát thương hiệu chặt với đối tác vận hành địa phương; liên doanh chia sẻ quyền kiểm soát với đối tác am hiểu thị trường.</p>
<div class="callout"><span class="badge">Case thật</span> <strong>Coca-Cola</strong> và <strong>Nike</strong> giữ nhận diện nhất quán toàn cầu (logo chữ viết; swoosh + "Just Do It") suốt hàng chục năm, nhưng chạy chiến dịch riêng theo thị trường bên dưới — đúng bài "lõi nhất quán, thể hiện linh hoạt".</div>`,
  ]]);

const c5q = quiz('igi301-quiz-5', 'Quiz 5 — Global brands|||Quiz 5 — Thương hiệu toàn cầu', [
  { id: 'q1', question: 'Giá trị cốt lõi của một thương hiệu toàn cầu đến chủ yếu từ?', options: ['Đổi logo mỗi nước', 'Sự nhất quán về nhận diện, lời hứa và chất lượng', 'Giá rẻ nhất thị trường', 'Không có tagline'], correctIndex: 1, explanation: 'Nhất quán tạo nhận biết, niềm tin và lợi thế quy mô; đổi lại phải cân với liên quan địa phương.' },
  { id: 'q2', question: 'Theo Keegan, phương thức thâm nhập nào có KIỂM SOÁT/RỦI RO cao nhất?', options: ['Xuất khẩu', 'Cấp phép', 'Công ty con sở hữu toàn bộ (wholly-owned subsidiary)', 'Nhượng quyền'], correctIndex: 2, explanation: 'Thang: xuất khẩu → cấp phép/nhượng quyền → liên doanh → công ty con sở hữu toàn bộ (kiểm soát & rủi ro cao nhất).' },
  { id: 'q3', question: 'Công cụ giữ mọi thị trường "đúng thương hiệu" mà vẫn cho thể hiện địa phương là?', options: ['Bảng giá', 'Global brand book / brand guidelines', 'Hợp đồng lao động', 'Báo cáo tài chính'], correctIndex: 1, explanation: 'Brand book đặt lõi cố định + rào chắn, cho phép lớp linh hoạt thích ứng địa phương.' },
]);

const c6 = doc('igi301-6-1-global-digital', '6.1 — Global digital & social communication|||6.1 — Truyền thông số & mạng xã hội toàn cầu',
  'Social/digital toàn cầu, nền tảng theo vùng (WeChat/LINE/KakaoTalk vs Meta), influencer đa thị trường, glocal content, nội dung do người dùng tạo.',
  [[
    `<span class="eyebrow">IGI301 · Chapter 6 · Lesson 6.1</span>
<h2>Global digital &amp; social communication</h2>
<h3>The platform map is not flat</h3>
<p>"Go global on social" hides a trap: the dominant platform is <em>regional</em>. Meta/Instagram/YouTube lead much of the West; but <strong>WeChat</strong> dominates China (super-app: chat + pay + mini-programs), <strong>LINE</strong> in Japan/Thailand, <strong>KakaoTalk</strong> in Korea, and short-video (TikTok/Douyin) reshapes all of them. A single global content calendar that ignores this simply misses the audience.</p>
<h3>Glocal content &amp; algorithms</h3>
<ul>
<li><strong>Global hub, local spoke</strong> — one brand handle sets the idea; local market accounts adapt language, memes and timing (festivals, sales days like 11.11).</li>
<li><strong>Platform-native</strong> — creative must fit each platform's format and algorithm, not just be re-posted.</li>
<li><strong>UGC &amp; community</strong> — user-generated content localizes trust; people believe local voices.</li>
</ul>
<h3>Multi-market influencers</h3>
<p>Global mega-influencers give reach but weak local trust; <strong>local micro-influencers</strong> convert better because they share the audience's culture and language. Most global programs mix a few global faces with many local creators — and must vet each for local sensitivities.</p>
<div class="callout"><span class="badge">Real case</span> Brands entering China run <strong>WeChat &amp; Douyin</strong> with local KOLs and mini-programs instead of importing their Instagram playbook — the same product, a completely different channel and content system.</div>`,
    `<span class="eyebrow">IGI301 · Chương 6 · Bài 6.1</span>
<h2>Truyền thông số &amp; mạng xã hội toàn cầu</h2>
<h3>Bản đồ nền tảng không hề phẳng</h3>
<p>"Lên toàn cầu trên social" giấu một cái bẫy: nền tảng chủ đạo mang tính <em>vùng miền</em>. Meta/Instagram/YouTube dẫn đầu phần lớn phương Tây; nhưng <strong>WeChat</strong> thống trị Trung Quốc (siêu ứng dụng: chat + thanh toán + mini-program), <strong>LINE</strong> ở Nhật/Thái, <strong>KakaoTalk</strong> ở Hàn, và video ngắn (TikTok/Douyin) định hình lại tất cả. Một lịch nội dung toàn cầu duy nhất bỏ qua điều này thì đơn giản là trượt khỏi khán giả.</p>
<h3>Nội dung glocal &amp; thuật toán</h3>
<ul>
<li><strong>Trục toàn cầu, nhánh địa phương</strong> — một tài khoản thương hiệu đặt ý tưởng; tài khoản thị trường địa phương chỉnh ngôn ngữ, meme và thời điểm (lễ hội, ngày sale như 11.11).</li>
<li><strong>Đúng chất nền tảng</strong> — sáng tạo phải hợp định dạng &amp; thuật toán từng nền tảng, không chỉ đăng lại.</li>
<li><strong>UGC &amp; cộng đồng</strong> — nội dung do người dùng tạo bản địa hoá niềm tin; người ta tin tiếng nói địa phương.</li>
</ul>
<h3>Influencer đa thị trường</h3>
<p>Mega-influencer toàn cầu cho độ phủ nhưng niềm tin địa phương yếu; <strong>micro-influencer địa phương</strong> chuyển đổi tốt hơn vì cùng văn hoá và ngôn ngữ với khán giả. Đa số chương trình toàn cầu trộn vài gương mặt toàn cầu với nhiều creator địa phương — và phải rà từng người về nhạy cảm địa phương.</p>
<div class="callout"><span class="badge">Case thật</span> Thương hiệu vào Trung Quốc chạy <strong>WeChat &amp; Douyin</strong> với KOL địa phương và mini-program thay vì bê nguyên playbook Instagram — cùng một sản phẩm, một hệ kênh và nội dung hoàn toàn khác.</div>`,
  ]]);

const c6q = quiz('igi301-quiz-6', 'Quiz 6 — Global digital|||Quiz 6 — Digital toàn cầu', [
  { id: 'q1', question: 'Vì sao "một lịch nội dung social toàn cầu duy nhất" thường thất bại?', options: ['Vì social miễn phí', 'Vì nền tảng chủ đạo mang tính vùng miền (WeChat, LINE, KakaoTalk...)', 'Vì thuật toán giống hệt nhau', 'Vì không ai dùng điện thoại'], correctIndex: 1, explanation: 'Nền tảng dominant khác theo vùng; bỏ qua điều đó là trượt khỏi khán giả.' },
  { id: 'q2', question: 'So với mega-influencer toàn cầu, micro-influencer địa phương thường mạnh ở?', options: ['Độ phủ tuyệt đối lớn hơn', 'Niềm tin & chuyển đổi vì cùng văn hoá/ngôn ngữ khán giả', 'Chi phí cao hơn nhiều', 'Không cần rà nhạy cảm địa phương'], correctIndex: 1, explanation: 'Micro-influencer địa phương chia sẻ văn hoá/ngôn ngữ nên tạo niềm tin và convert tốt hơn.' },
  { id: 'q3', question: 'Mô hình "global hub, local spoke" nghĩa là?', options: ['Chỉ một tài khoản đăng mọi nơi', 'Tài khoản thương hiệu đặt ý tưởng, tài khoản thị trường chỉnh ngôn ngữ/meme/thời điểm', 'Bỏ hết tài khoản địa phương', 'Chỉ chạy quảng cáo trả tiền'], correctIndex: 1, explanation: 'Trục toàn cầu đặt ý tưởng, nhánh địa phương thích ứng đúng chất nền tảng & dịp địa phương.' },
]);

const c7 = doc('igi301-7-1-blunders', '7.1 — Barriers & cross-cultural blunders|||7.1 — Rào cản & sai lầm liên văn hoá',
  'Sai lầm dịch thuật thật (KFC, Pepsi, HSBC), vô cảm văn hoá (Dolce & Gabbana), khủng hoảng đa thị trường; vì sao lỗi lan nhanh và cách phòng.',
  [[
    `<span class="eyebrow">IGI301 · Chapter 7 · Lesson 7.1</span>
<h2>Barriers &amp; cross-cultural blunders</h2>
<p>Every framework in this course exists because real brands got it wrong at real cost. Studying the failures is the fastest way to build judgment.</p>
<h3>Translation blunders</h3>
<ul>
<li><strong>KFC</strong> — "Finger-lickin' good" reportedly rendered in China as roughly "eat your fingers off". A literal translation destroyed the appetite appeal.</li>
<li><strong>Pepsi</strong> — "Come alive with the Pepsi Generation" was said to land in some markets as "Pepsi brings your ancestors back from the grave" — a taboo mistranslation.</li>
<li><strong>HSBC</strong> — its "Assume Nothing" tagline was mistranslated as "Do Nothing" in several countries, forcing a multi-million-dollar global rebrand to "The world's local bank".</li>
</ul>
<h3>Cultural insensitivity &amp; crisis</h3>
<p><strong>Dolce &amp; Gabbana (2018)</strong> ran videos of a model struggling to eat Italian food with chopsticks; Chinese audiences read it as mocking, a designer's messages leaked, and the brand was pulled from major Chinese e-commerce almost overnight — a full multi-market crisis. Lesson: a tone-deaf execution plus slow, defensive crisis handling multiplies the damage.</p>
<h3>Why blunders spread fast now</h3>
<p>Social media makes a local mistake <em>global in hours</em>, and screenshots outlive deletions. Prevention: <strong>local review</strong> (native speakers + cultural consultants), <strong>transcreation not translation</strong>, pre-testing, and a rehearsed multi-market crisis plan.</p>
<div class="callout"><span class="badge">Careful</span> Some famous cases (e.g. the "Chevy Nova = no va / won't go" story) are widely repeated but disputed. Cite verified cases, and treat colourful legends as cautionary, not proven.</div>`,
    `<span class="eyebrow">IGI301 · Chương 7 · Bài 7.1</span>
<h2>Rào cản &amp; sai lầm liên văn hoá</h2>
<p>Mọi khung trong môn này tồn tại vì các thương hiệu thật đã làm sai với cái giá thật. Học từ thất bại là cách nhanh nhất để rèn phán đoán.</p>
<h3>Sai lầm dịch thuật</h3>
<ul>
<li><strong>KFC</strong> — "Finger-lickin' good" được kể là dịch sang tiếng Trung thành đại ý "ăn đứt ngón tay của bạn". Bản dịch nguyên văn phá tan cảm giác ngon miệng.</li>
<li><strong>Pepsi</strong> — "Come alive with the Pepsi Generation" được cho là hiểu thành "Pepsi đưa tổ tiên bạn sống dậy từ mồ" ở vài thị trường — một lỗi dịch phạm huý.</li>
<li><strong>HSBC</strong> — tagline "Assume Nothing" bị dịch sai thành "Do Nothing" ở nhiều nước, buộc phải tái định vị toàn cầu tốn hàng triệu đô sang "The world's local bank".</li>
</ul>
<h3>Vô cảm văn hoá &amp; khủng hoảng</h3>
<p><strong>Dolce &amp; Gabbana (2018)</strong> tung video người mẫu chật vật ăn món Ý bằng đũa; khán giả Trung Quốc thấy là chế giễu, tin nhắn của nhà thiết kế bị rò rỉ, và thương hiệu bị gỡ khỏi các sàn TMĐT lớn của Trung Quốc gần như trong một đêm — một khủng hoảng đa thị trường trọn vẹn. Bài học: thể hiện vô cảm cộng với xử lý khủng hoảng chậm, phòng thủ sẽ nhân bội thiệt hại.</p>
<h3>Vì sao sai lầm lan nhanh</h3>
<p>Mạng xã hội biến một lỗi địa phương thành <em>toàn cầu trong vài giờ</em>, và ảnh chụp màn hình sống lâu hơn nút xoá. Phòng ngừa: <strong>rà soát địa phương</strong> (người bản ngữ + cố vấn văn hoá), <strong>transcreation chứ không dịch máy</strong>, pre-test, và một kế hoạch khủng hoảng đa thị trường đã diễn tập.</p>
<div class="callout"><span class="badge">Thận trọng</span> Vài case nổi tiếng (ví dụ chuyện "Chevy Nova = no va / không chạy") bị lặp lại rộng rãi nhưng còn tranh cãi. Dẫn case đã kiểm chứng, và xem các giai thoại màu mè là cảnh báo, không phải bằng chứng.</div>`,
  ]]);

const c7q = quiz('igi301-quiz-7', 'Quiz 7 — Blunders|||Quiz 7 — Sai lầm', [
  { id: 'q1', question: 'Sự cố HSBC "Assume Nothing" dịch sai thành "Do Nothing" dẫn tới?', options: ['Không hậu quả gì', 'Buộc tái định vị toàn cầu tốn hàng triệu đô ("The world\'s local bank")', 'Tăng doanh số', 'Đổi ngành kinh doanh'], correctIndex: 1, explanation: 'Một lỗi dịch tagline có thể buộc rebrand toàn cầu rất tốn kém.' },
  { id: 'q2', question: 'Bài học lớn nhất từ khủng hoảng Dolce & Gabbana 2018 ở Trung Quốc?', options: ['Nên đăng nhiều video hơn', 'Thể hiện vô cảm + xử lý khủng hoảng chậm/phòng thủ nhân bội thiệt hại', 'Chopsticks không liên quan văn hoá', 'TMĐT không quan trọng'], correctIndex: 1, explanation: 'Execution vô cảm cộng crisis handling kém khiến một chiến dịch thành khủng hoảng đa thị trường.' },
  { id: 'q3', question: 'Cách phòng ngừa sai lầm liên văn hoá TỐT nhất trước khi phát hành?', options: ['Dịch máy cho nhanh', 'Rà soát địa phương (người bản ngữ + cố vấn văn hoá), transcreation & pre-test', 'Bỏ qua thị trường khó', 'Đăng rồi sửa sau'], correctIndex: 1, explanation: 'Local review + transcreation + pre-test + kế hoạch khủng hoảng đã diễn tập là lưới an toàn chuẩn.' },
]);

const c8 = doc('igi301-8-1-campaign-mgmt', '8.1 — Multi-market campaign management & measurement|||8.1 — Quản trị & đo lường chiến dịch đa thị trường',
  'Quản trị chiến dịch toàn cầu, mô hình hub-and-spoke, mạng lưới agency, KPI đa thị trường, chuẩn hoá đo lường; WARC về hiệu quả toàn cầu.',
  [[
    `<span class="eyebrow">IGI301 · Chapter 8 · Lesson 8.1</span>
<h2>Multi-market campaign management &amp; measurement</h2>
<h3>How global campaigns are run</h3>
<p>The common structure is <strong>hub-and-spoke</strong>: a global/regional <em>hub</em> owns the idea, brand guardrails and budget; <em>local spokes</em> adapt and activate. Governance decides what is <strong>mandatory</strong> (non-negotiable brand assets), <strong>recommended</strong>, and <strong>free</strong> (fully local) — the classic "mandatory / recommended / optional" model.</p>
<h3>The agency network</h3>
<p>Global brands work through <strong>agency networks</strong> (a lead global agency plus local offices) or a <strong>roster</strong> of specialists. The lead agency guards consistency; local agencies bring market truth. Clear briefs, shared assets and one source-of-truth toolkit keep dozens of markets aligned.</p>
<h3>Measuring across markets</h3>
<ul>
<li><strong>Common KPI framework</strong> — define awareness, consideration, brand lift, engagement and sales/ROI the same way everywhere, so markets are comparable.</li>
<li><strong>Local benchmarks</strong> — the same number means different things by market maturity; compare each market to its own baseline, not just to others.</li>
<li><strong>Consistent taxonomy</strong> — shared naming, tracking and dashboards; otherwise "global results" are un-addable.</li>
</ul>
<pre><code>Global objective -> Common KPIs -> Local targets/benchmarks
              -> One dashboard -> Read consistency AND local nuance</code></pre>
<div class="callout"><span class="badge">Real case</span> Effectiveness bodies like <strong>WARC</strong> and the Effie Awards document that the strongest global campaigns share <em>one big idea + disciplined local adaptation + a common measurement frame</em> — exactly the balance this whole course has been building toward.</div>`,
    `<span class="eyebrow">IGI301 · Chương 8 · Bài 8.1</span>
<h2>Quản trị &amp; đo lường chiến dịch đa thị trường</h2>
<h3>Chiến dịch toàn cầu được vận hành thế nào</h3>
<p>Cấu trúc phổ biến là <strong>hub-and-spoke</strong>: một <em>trục</em> toàn cầu/khu vực sở hữu ý tưởng, rào chắn thương hiệu và ngân sách; các <em>nhánh</em> địa phương thích ứng và kích hoạt. Quản trị quyết định điều gì <strong>bắt buộc</strong> (tài sản thương hiệu không thương lượng), <strong>khuyến nghị</strong>, và <strong>tự do</strong> (hoàn toàn địa phương) — mô hình kinh điển "mandatory / recommended / optional".</p>
<h3>Mạng lưới agency</h3>
<p>Thương hiệu toàn cầu làm việc qua <strong>mạng lưới agency</strong> (một agency toàn cầu dẫn dắt cộng các văn phòng địa phương) hoặc một <strong>roster</strong> chuyên gia. Agency dẫn dắt giữ nhất quán; agency địa phương mang sự thật thị trường. Brief rõ, tài sản dùng chung và một bộ công cụ nguồn-sự-thật giữ hàng chục thị trường đồng nhịp.</p>
<h3>Đo lường xuyên thị trường</h3>
<ul>
<li><strong>Khung KPI chung</strong> — định nghĩa nhận biết, cân nhắc, brand lift, tương tác và doanh số/ROI giống nhau ở mọi nơi để các thị trường so sánh được.</li>
<li><strong>Chuẩn địa phương</strong> — cùng một con số mang ý nghĩa khác theo độ trưởng thành thị trường; so mỗi thị trường với chính đường nền của nó, không chỉ với thị trường khác.</li>
<li><strong>Phân loại nhất quán</strong> — đặt tên, tracking và dashboard dùng chung; nếu không thì "kết quả toàn cầu" không cộng lại được.</li>
</ul>
<pre><code>Mục tiêu toàn cầu -> KPI chung -> Mục tiêu/chuẩn địa phương
              -> Một dashboard -> Đọc cả nhất quán LẪN sắc thái địa phương</code></pre>
<div class="callout"><span class="badge">Case thật</span> Các tổ chức đo hiệu quả như <strong>WARC</strong> và giải Effie ghi nhận rằng chiến dịch toàn cầu mạnh nhất đều chia sẻ <em>một ý tưởng lớn + thích ứng địa phương kỷ luật + một khung đo chung</em> — đúng thế cân bằng mà cả môn này hướng tới.</div>`,
  ]]);

const c8q = quiz('igi301-quiz-8', 'Quiz 8 — Campaign management|||Quiz 8 — Quản trị chiến dịch', [
  { id: 'q1', question: 'Mô hình "hub-and-spoke" trong chiến dịch toàn cầu nghĩa là?', options: ['Mọi thị trường tự làm hoàn toàn độc lập', 'Trục toàn cầu sở hữu ý tưởng/rào chắn/ngân sách, nhánh địa phương thích ứng & kích hoạt', 'Chỉ một thị trường được chạy', 'Không có ai kiểm soát thương hiệu'], correctIndex: 1, explanation: 'Hub giữ ý tưởng & guardrails; spoke địa phương adapt và activate — cân bằng nhất quán và liên quan.' },
  { id: 'q2', question: 'Vì sao cần "khung KPI chung" khi đo đa thị trường?', options: ['Để các thị trường so sánh được và kết quả toàn cầu cộng lại được', 'Để giảm chi phí quảng cáo', 'Để bỏ qua chuẩn địa phương', 'Vì luật bắt buộc'], correctIndex: 0, explanation: 'Định nghĩa KPI giống nhau + taxonomy nhất quán mới cho phép so sánh và tổng hợp; vẫn cần benchmark địa phương.' },
  { id: 'q3', question: 'Theo WARC/Effie, chiến dịch toàn cầu mạnh nhất chia sẻ điều gì?', options: ['Một mẩu quảng cáo giống hệt cho mọi nước', 'Một ý tưởng lớn + thích ứng địa phương kỷ luật + khung đo chung', 'Ngân sách lớn nhất', 'Nhiều influencer toàn cầu nhất'], correctIndex: 1, explanation: 'Đúng thế cân bằng của cả môn: global idea, disciplined local adaptation, common measurement frame.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'IGI301',
    slug: 'igi301-intercultural-and-global-integrated-marketing-communication',
    title: 'Intercultural and Global Integrated Marketing Communication',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IGI301.webp',
    shortDescription: 'Intercultural & global IMC — Hofstede & Hall dimensions, standardization vs localization (glocalization), cross-cultural creative, global brands, global digital, blunders & crises, multi-market campaign management. Real brand cases & quizzes.|||IMC liên văn hoá & toàn cầu — chiều Hofstede & Hall, chuẩn hoá vs bản địa hoá, sáng tạo liên văn hoá, thương hiệu toàn cầu, digital toàn cầu, sai lầm & khủng hoảng, quản trị chiến dịch đa thị trường. Song ngữ, ví dụ thật & quiz.',
    description: 'Môn <strong>IGI301 — Intercultural and Global Integrated Marketing Communication</strong> (Truyền thông marketing tích hợp liên văn hoá &amp; toàn cầu, khối Công nghệ Truyền thông, kỳ 8) dạy cách đưa một ý tưởng thương hiệu chạm được nhiều nền văn hoá cùng lúc. Từ <strong>toàn cầu hoá &amp; vì sao văn hoá quan trọng</strong> → <strong>các chiều văn hoá</strong> (Hofstede 6 chiều, Hall bối cảnh cao/thấp) → <strong>chuẩn hoá vs bản địa hoá</strong> (glocalization) → <strong>thông điệp &amp; sáng tạo liên văn hoá</strong> → <strong>thương hiệu toàn cầu &amp; thâm nhập thị trường</strong> → <strong>digital &amp; social toàn cầu</strong> → <strong>rào cản &amp; sai lầm</strong> → <strong>quản trị &amp; đo lường chiến dịch đa thị trường</strong>. Bám giáo trình chuẩn quốc tế (De Mooij, Hofstede, Keegan, Hall, WARC), song ngữ, có case thương hiệu toàn cầu thật (McDonald\'s, Coca-Cola, Nike) và quiz mỗi chương.',
    whatYouLearn: 'Toàn cầu hoá & self-reference criterion; văn hoá là "software of the mind"; 6 chiều Hofstede (PDI/IDV/MAS/UAI/LTO/IVR) & bối cảnh cao/thấp của Hall; chuẩn hoá vs bản địa hoá & glocalization ("think global, act local"); appeal/biểu tượng/màu sắc & transcreation; thương hiệu toàn cầu, brand book & phương thức thâm nhập (Keegan); social/digital theo vùng (WeChat/LINE) & influencer đa thị trường; sai lầm dịch thuật & khủng hoảng (KFC, Pepsi, HSBC, D&G); hub-and-spoke, mạng lưới agency & KPI đa thị trường.',
    requirements: 'Không cần kiến thức chuyên môn trước. Nên có nền marketing/truyền thông cơ bản và tiếng Anh đọc hiểu để dùng tài liệu ngành (De Mooij, Hofstede Insights, WARC).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách chuẩn (De Mooij, Hofstede, Keegan, Hall), Hofstede Insights, WARC/AdAge, công cụ, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'IMC toàn cầu là gì, nghịch lý văn hoá, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Truyền thông toàn cầu|||Chapter 1 — Global communication', description: 'Toàn cầu hoá, văn hoá là software of the mind, vì sao không copy-paste IMC.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Chiều văn hoá|||Chapter 2 — Cultural dimensions', description: 'Hofstede 6 chiều, Hall bối cảnh cao/thấp, Trompenaars.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Chuẩn hoá vs bản địa hoá|||Chapter 3 — Standardize vs localize', description: 'Glocalization, think global act local, giữ gì đổi gì.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Thông điệp & sáng tạo|||Chapter 4 — Message & creative', description: 'Appeal, biểu tượng, màu sắc, ngôn ngữ & transcreation.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Thương hiệu toàn cầu|||Chapter 5 — Global brands', description: 'Nhất quán qua thị trường, brand book, thâm nhập (Keegan).', lessons: [c5, c5q] },
    { title: 'Chương 6 — Digital toàn cầu|||Chapter 6 — Global digital', description: 'Nền tảng theo vùng, glocal content, influencer đa thị trường.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Rào cản & sai lầm|||Chapter 7 — Barriers & blunders', description: 'Sai lầm dịch thuật, vô cảm văn hoá, khủng hoảng đa thị trường.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Quản trị & đo lường|||Chapter 8 — Management & measurement', description: 'Hub-and-spoke, mạng lưới agency, KPI đa thị trường, WARC.', lessons: [c8, c8q] },
  ],
};
