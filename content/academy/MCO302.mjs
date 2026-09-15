/**
 * MCO302 — Intercultural Communication (Truyền thông liên văn hoá). Khung
 * 8 chương song ngữ VI+EN, khối Quản trị Kinh doanh (BBA), FPTU, Kỳ 5.
 * Giáo trình trích dẫn (KHÔNG upload PDF): Hofstede "Cultures and
 * Organizations"; Samovar "Communication Between Cultures"; Trompenaars
 * "Riding the Waves of Culture"; Hall "Beyond Culture".
 * Giữ NGUYÊN slug/semester/courseCode/thumbnailUrl. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('mco302-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình trích dẫn (Hofstede, Samovar, Trompenaars, Hall), slide FLM, tài liệu chính thức miễn phí, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">MCO302 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Intercultural Communication — how culture shapes values, communication styles and behaviour across borders — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are the core references this course draws on plus free, legal resources.</p>
<h3>📘 Core references (cited, not reproduced)</h3>
<ul>
<li><strong>Geert Hofstede et al.</strong> — <em>Cultures and Organizations: Software of the Mind</em> — the 6-dimension model of national culture.</li>
<li><strong>Larry A. Samovar et al.</strong> — <em>Communication Between Cultures</em> — verbal &amp; non-verbal communication across cultures.</li>
<li><strong>Fons Trompenaars &amp; Charles Hampden-Turner</strong> — <em>Riding the Waves of Culture</em> — 7 dimensions of business culture.</li>
<li><strong>Edward T. Hall</strong> — <em>Beyond Culture</em> — high-context vs low-context communication.</li>
</ul>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for MCO302 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Geert_Hofstede" target="_blank" rel="noopener">Geert Hofstede — Wikipedia</a></li>
<li><a href="https://en.wikipedia.org/wiki/High-context_and_low-context_cultures" target="_blank" rel="noopener">High-context and low-context cultures — Wikipedia</a></li>
<li><a href="https://en.wikipedia.org/wiki/Fons_Trompenaars" target="_blank" rel="noopener">Fons Trompenaars — Wikipedia</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.hofstede-insights.com/country-comparison-tool" target="_blank" rel="noopener">Hofstede Country Comparison Tool</a> — compare any two countries on the 6 dimensions</li>
</ul>
<h3>▶️ Video</h3>
<ul>
<li><a href="https://www.youtube.com/@TED" target="_blank" rel="noopener">TED</a> — search the channel for talks on culture &amp; cross-cultural communication</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what culture is, its elements, why intercultural communication matters.</li>
<li><strong>Frameworks</strong> — Hofstede's 6 dimensions, Hall's context theory, Trompenaars' 7 dimensions.</li>
<li><strong>Practice</strong> — verbal/non-verbal differences, spotting your own stereotypes and biases.</li>
<li><strong>Apply</strong> — negotiate and work in multicultural teams; build intercultural competence for a Vietnam-global career.</li>
</ol></div>`,
    `<span class="eyebrow">MCO302 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Truyền thông liên văn hoá — văn hoá định hình giá trị, phong cách giao tiếp và hành vi xuyên biên giới thế nào — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là các nguồn tham khảo gốc của môn cùng tài liệu miễn phí, hợp pháp.</p>
<h3>📘 Tài liệu gốc (trích dẫn, không sao chép lại)</h3>
<ul>
<li><strong>Geert Hofstede và đồng nghiệp</strong> — <em>Cultures and Organizations: Software of the Mind</em> — mô hình 6 chiều văn hoá quốc gia.</li>
<li><strong>Larry A. Samovar và đồng nghiệp</strong> — <em>Communication Between Cultures</em> — giao tiếp ngôn ngữ &amp; phi ngôn ngữ xuyên văn hoá.</li>
<li><strong>Fons Trompenaars &amp; Charles Hampden-Turner</strong> — <em>Riding the Waves of Culture</em> — 7 chiều văn hoá kinh doanh.</li>
<li><strong>Edward T. Hall</strong> — <em>Beyond Culture</em> — giao tiếp high-context vs low-context.</li>
</ul>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của MCO302 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Geert_Hofstede" target="_blank" rel="noopener">Geert Hofstede — Wikipedia</a></li>
<li><a href="https://en.wikipedia.org/wiki/High-context_and_low-context_cultures" target="_blank" rel="noopener">High-context and low-context cultures — Wikipedia</a></li>
<li><a href="https://en.wikipedia.org/wiki/Fons_Trompenaars" target="_blank" rel="noopener">Fons Trompenaars — Wikipedia</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.hofstede-insights.com/country-comparison-tool" target="_blank" rel="noopener">Hofstede Country Comparison Tool</a> — so sánh hai quốc gia bất kỳ theo 6 chiều văn hoá</li>
</ul>
<h3>▶️ Video</h3>
<ul>
<li><a href="https://www.youtube.com/@TED" target="_blank" rel="noopener">TED</a> — tìm trong kênh các bài nói về văn hoá &amp; giao tiếp liên văn hoá</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — văn hoá là gì, các thành tố, vì sao truyền thông liên văn hoá quan trọng.</li>
<li><strong>Khung lý thuyết</strong> — 6 chiều Hofstede, lý thuyết ngữ cảnh của Hall, 7 chiều Trompenaars.</li>
<li><strong>Luyện tập</strong> — khác biệt ngôn ngữ/phi ngôn ngữ, nhận ra định kiến của chính mình.</li>
<li><strong>Áp dụng</strong> — đàm phán và làm việc trong nhóm đa văn hoá; xây năng lực liên văn hoá cho sự nghiệp Việt Nam-quốc tế.</li>
</ol></div>`,
  ]]);

const intro = doc('mco302-0-1-overview', '0.1 — Course overview: Intercultural Communication|||0.1 — Tổng quan môn học: Truyền thông liên văn hoá',
  'Văn hoá định hình giao tiếp thế nào; vì sao quan trọng với sinh viên BBA; lộ trình 8 chương.',
  [[
    `<span class="eyebrow">MCO302 · Lesson 0.1 · Overview</span>
<h2>Intercultural Communication</h2>
<p class="lead">This course helps you understand <strong>how culture shapes communication</strong> — why the same word, gesture or silence can mean different things to different people, and how to work, negotiate and build relationships across cultures without those differences turning into costly misunderstandings.</p>
<h3>Why it matters for a BBA graduate</h3>
<ul>
<li>Global teams, remote work and outsourcing put you in daily contact with colleagues from other cultures.</li>
<li>Foreign investment, export markets and multinational employers all require reading a partner's culture correctly.</li>
<li>Most cross-border business failures trace back to a communication or trust breakdown, not a bad product.</li>
</ul>
<h3>Roadmap</h3>
<p>What culture is &amp; its elements → Hofstede's 6 dimensions → Hall's high/low-context &amp; Trompenaars → verbal/non-verbal communication → barriers, stereotypes &amp; culture shock → cross-cultural negotiation &amp; teamwork → intercultural competence, ethics &amp; the Vietnam-global context. Bilingual, with comparison tables and a quiz per chapter.</p>`,
    `<span class="eyebrow">MCO302 · Bài 0.1 · Tổng quan</span>
<h2>Truyền thông liên văn hoá</h2>
<p class="lead">Môn này giúp bạn hiểu <strong>văn hoá định hình giao tiếp thế nào</strong> — vì sao cùng một từ, một cử chỉ hay một khoảng lặng có thể mang nghĩa khác nhau với những người khác nhau, và làm sao để làm việc, đàm phán và xây quan hệ xuyên văn hoá mà không để khác biệt biến thành hiểu lầm đắt giá.</p>
<h3>Vì sao quan trọng với sinh viên BBA</h3>
<ul>
<li>Nhóm toàn cầu, làm việc từ xa và thuê ngoài đặt bạn vào tiếp xúc hằng ngày với đồng nghiệp từ nền văn hoá khác.</li>
<li>Đầu tư nước ngoài, thị trường xuất khẩu và nhà tuyển dụng đa quốc gia đều đòi hỏi đọc đúng văn hoá đối tác.</li>
<li>Phần lớn thất bại kinh doanh xuyên biên giới bắt nguồn từ đổ vỡ giao tiếp hoặc niềm tin, không phải sản phẩm tệ.</li>
</ul>
<h3>Lộ trình</h3>
<p>Văn hoá là gì &amp; các thành tố → 6 chiều văn hoá Hofstede → high/low-context của Hall &amp; Trompenaars → giao tiếp ngôn ngữ/phi ngôn ngữ → rào cản, định kiến &amp; sốc văn hoá → đàm phán &amp; làm việc nhóm đa văn hoá → năng lực liên văn hoá, đạo đức &amp; bối cảnh Việt Nam-quốc tế. Song ngữ, có bảng so sánh và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('mco302-1-1-overview-importance', '1.1 — Intercultural communication: overview & importance|||1.1 — Tổng quan truyền thông liên văn hoá & tầm quan trọng',
  'Định nghĩa truyền thông liên văn hoá, mô hình quá trình giao tiếp (văn hoá là "nhiễu"), vì sao ngày càng quan trọng.',
  [[
    `<span class="eyebrow">MCO302 · Chapter 1 · Lesson 1.1</span>
<h2>Intercultural communication: overview &amp; importance</h2>
<h3>What is intercultural communication?</h3>
<p><strong>Intercultural communication</strong> is the exchange of meaning between people who identify with different cultural groups — different nations, ethnicities, religions or organizational cultures. What makes it distinct from ordinary communication is that the two sides may not share the same <strong>values, norms and assumptions</strong> that normally make a message easy to decode correctly.</p>
<h3>The communication process — and where culture intervenes</h3>
<pre><code>Sender -&gt; Encode message -&gt; Channel -&gt; Decode message -&gt; Receiver
                                  ^
                            Culture acts as "noise":
                            different values/assumptions can
                            distort encoding AND decoding
</code></pre>
<h3>Why it matters today</h3>
<ul>
<li><strong>Globalization</strong> — trade, investment and supply chains cross cultural borders every day.</li>
<li><strong>Multinational &amp; remote teams</strong> — colleagues collaborate daily without ever meeting face to face.</li>
<li><strong>Tourism &amp; diplomacy</strong> — a single misread gesture can damage a relationship or a deal.</li>
</ul>
<div class="callout"><span class="badge">Example</span> A firm handshake and direct eye contact read as "confident" in the US but can read as aggressive or disrespectful in cultures where a softer handshake and lowered gaze signal respect — same behaviour, opposite meaning.</div>`,
    `<span class="eyebrow">MCO302 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan truyền thông liên văn hoá &amp; tầm quan trọng</h2>
<h3>Truyền thông liên văn hoá là gì?</h3>
<p><strong>Truyền thông liên văn hoá</strong> là sự trao đổi ý nghĩa giữa những người thuộc các nhóm văn hoá khác nhau — quốc gia, dân tộc, tôn giáo hay văn hoá tổ chức khác nhau. Điểm khác biệt so với giao tiếp thông thường là hai bên có thể không chia sẻ chung <strong>giá trị, chuẩn mực và giả định</strong> vốn giúp một thông điệp dễ được giải mã đúng.</p>
<h3>Mô hình quá trình giao tiếp — và chỗ văn hoá can thiệp</h3>
<pre><code>Người gửi -&gt; Mã hoá thông điệp -&gt; Kênh -&gt; Giải mã -&gt; Người nhận
                                  ^
                            Văn hoá đóng vai trò "nhiễu":
                            giá trị/giả định khác nhau có thể
                            làm lệch cả mã hoá VÀ giải mã
</code></pre>
<h3>Vì sao ngày càng quan trọng</h3>
<ul>
<li><strong>Toàn cầu hoá</strong> — thương mại, đầu tư và chuỗi cung ứng vượt biên giới văn hoá mỗi ngày.</li>
<li><strong>Nhóm đa quốc gia &amp; làm việc từ xa</strong> — đồng nghiệp hợp tác hằng ngày mà không bao giờ gặp mặt.</li>
<li><strong>Du lịch &amp; ngoại giao</strong> — một cử chỉ bị hiểu sai có thể làm hỏng một quan hệ hoặc một thương vụ.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ</span> Bắt tay chặt và nhìn thẳng vào mắt được hiểu là "tự tin" ở Mỹ nhưng có thể bị coi là hung hăng hoặc thiếu tôn trọng ở nền văn hoá nơi bắt tay nhẹ và cụp mắt xuống thể hiện sự tôn trọng — cùng hành vi, ý nghĩa ngược nhau.</div>`,
  ]]);

const c1q = quiz('mco302-quiz-1', 'Quiz 1 — Overview & importance|||Quiz 1 — Tổng quan & tầm quan trọng', [
  { id: 'q1', question: 'Truyền thông liên văn hoá khác truyền thông thông thường chủ yếu ở điểm nào?', options: ['Dùng ngôn ngữ khác nhau', 'Hai bên có thể không chia sẻ chung giá trị/chuẩn mực/giả định', 'Chỉ xảy ra qua điện thoại', 'Không có người nhận'], correctIndex: 1, explanation: 'Khác biệt cốt lõi là giá trị, chuẩn mực và giả định không được chia sẻ chung, dễ gây giải mã sai.' },
  { id: 'q2', question: 'Trong mô hình quá trình giao tiếp, văn hoá đóng vai trò gì?', options: ['Kênh truyền tin', 'Người nhận', 'Một dạng "nhiễu" có thể làm lệch mã hoá và giải mã', 'Không liên quan tới mô hình'], correctIndex: 2, explanation: 'Khác biệt văn hoá can thiệp vào cả bước mã hoá của người gửi và giải mã của người nhận.' },
  { id: 'q3', question: 'Vì sao truyền thông liên văn hoá ngày càng quan trọng?', options: ['Vì mọi người nói cùng một ngôn ngữ', 'Vì toàn cầu hoá và làm việc đa quốc gia/từ xa ngày càng phổ biến', 'Vì công nghệ đã loại bỏ hoàn toàn khác biệt văn hoá', 'Vì nó chỉ quan trọng với ngoại giao'], correctIndex: 1, explanation: 'Thương mại, đầu tư, nhóm đa quốc gia và làm việc từ xa khiến tiếp xúc liên văn hoá diễn ra hằng ngày.' },
]);

const c2 = doc('mco302-2-1-what-is-culture', '2.1 — What is culture? Elements of culture|||2.1 — Văn hoá là gì & các thành tố',
  'Định nghĩa văn hoá (Hofstede: "software of the mind"), mô hình iceberg (phần nổi/phần chìm), các thành tố: giá trị, chuẩn mực, niềm tin, biểu tượng.',
  [[
    `<span class="eyebrow">MCO302 · Chapter 2 · Lesson 2.1</span>
<h2>What is culture? Elements of culture</h2>
<h3>Defining culture</h3>
<p>Hofstede defines culture as <strong>"software of the mind"</strong> — the shared, learned patterns of values, beliefs and behaviour that distinguish members of one group from another. Culture is not innate: it is <strong>learned</strong>, <strong>shared</strong> by a group, and <strong>passed down</strong> across generations, yet it also <strong>adapts</strong> over time.</p>
<h3>The iceberg model</h3>
<pre><code>Above the surface (visible): language, food, dress,
                              art, greetings, behaviour
--------------------------------------------------------
Below the surface (invisible): values, beliefs,
                              assumptions, worldview
</code></pre>
<p>What you can observe about another culture is only the tip of the iceberg; the values and assumptions driving that behaviour lie hidden beneath.</p>
<h3>Core elements of culture</h3>
<ul>
<li><strong>Values</strong> — what a group considers good/bad, important/unimportant.</li>
<li><strong>Norms</strong> — unwritten rules for acceptable behaviour.</li>
<li><strong>Beliefs</strong> — shared convictions about how the world works.</li>
<li><strong>Symbols, language &amp; rituals</strong> — the visible carriers of meaning (a flag, a greeting phrase, a ceremony).</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> Judging another culture only by its visible tip (food, dress, jokes) while ignoring the values beneath is the single most common root of cross-cultural misunderstanding.</div>`,
    `<span class="eyebrow">MCO302 · Chương 2 · Bài 2.1</span>
<h2>Văn hoá là gì &amp; các thành tố</h2>
<h3>Định nghĩa văn hoá</h3>
<p>Hofstede định nghĩa văn hoá là <strong>"phần mềm của tâm trí" (software of the mind)</strong> — những khuôn mẫu giá trị, niềm tin và hành vi được học và chia sẻ, phân biệt thành viên nhóm này với nhóm khác. Văn hoá không phải bản năng: nó được <strong>học</strong>, được <strong>chia sẻ</strong> trong một nhóm, được <strong>truyền lại</strong> qua các thế hệ, nhưng cũng <strong>thích nghi</strong> theo thời gian.</p>
<h3>Mô hình iceberg (tảng băng)</h3>
<pre><code>Phần nổi (quan sát được): ngôn ngữ, ẩm thực, trang phục,
                          nghệ thuật, cách chào, hành vi
--------------------------------------------------------
Phần chìm (không thấy được): giá trị, niềm tin,
                          giả định, thế giới quan
</code></pre>
<p>Những gì bạn quan sát được ở một văn hoá khác chỉ là phần nổi của tảng băng; giá trị và giả định thúc đẩy hành vi đó nằm ẩn phía dưới.</p>
<h3>Các thành tố cốt lõi của văn hoá</h3>
<ul>
<li><strong>Giá trị</strong> — điều một nhóm coi là tốt/xấu, quan trọng/không quan trọng.</li>
<li><strong>Chuẩn mực</strong> — quy tắc bất thành văn về hành vi được chấp nhận.</li>
<li><strong>Niềm tin</strong> — những xác tín chung về cách thế giới vận hành.</li>
<li><strong>Biểu tượng, ngôn ngữ &amp; nghi lễ</strong> — vật mang nghĩa hữu hình (một lá cờ, một câu chào, một lễ nghi).</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> Chỉ đánh giá một văn hoá khác qua phần nổi (món ăn, trang phục, câu đùa) mà bỏ qua giá trị bên dưới là gốc rễ phổ biến nhất của hiểu lầm liên văn hoá.</div>`,
  ]]);

const c2q = quiz('mco302-quiz-2', 'Quiz 2 — What is culture|||Quiz 2 — Văn hoá là gì', [
  { id: 'q1', question: 'Hofstede gọi văn hoá là gì?', options: ['Bản năng sinh học', '"Phần mềm của tâm trí" — khuôn mẫu được học và chia sẻ', 'Một bộ luật cố định không đổi', 'Chỉ là ngôn ngữ và ẩm thực'], correctIndex: 1, explanation: 'Văn hoá là "software of the mind": giá trị/niềm tin/hành vi được học và chia sẻ trong nhóm.' },
  { id: 'q2', question: 'Trong mô hình iceberg, phần "chìm" (không thấy được) gồm những gì?', options: ['Ngôn ngữ, ẩm thực, trang phục', 'Giá trị, niềm tin, giả định', 'Cử chỉ và cách chào', 'Nghệ thuật và kiến trúc'], correctIndex: 1, explanation: 'Phần nổi là hành vi quan sát được; phần chìm là giá trị/niềm tin/giả định thúc đẩy hành vi đó.' },
  { id: 'q3', question: 'Đâu KHÔNG phải một thành tố cốt lõi của văn hoá theo bài học?', options: ['Giá trị', 'Chuẩn mực', 'Niềm tin', 'Tỉ giá hối đoái'], correctIndex: 3, explanation: 'Tỉ giá hối đoái là một chỉ số kinh tế, không phải thành tố văn hoá.' },
]);

const c3 = doc('mco302-3-1-hofstede-model', '3.1 — Hofstede\'s model: 6 cultural dimensions|||3.1 — Mô hình Hofstede: 6 chiều văn hoá',
  'Sáu chiều văn hoá Hofstede (PDI, IDV, MAS, UAI, LTO, IVR); ví dụ so sánh điểm số Việt Nam và Mỹ; lưu ý khi dùng điểm số quốc gia.',
  [[
    `<span class="eyebrow">MCO302 · Chapter 3 · Lesson 3.1</span>
<h2>Hofstede's model: 6 cultural dimensions</h2>
<h3>The six dimensions</h3>
<ul>
<li><strong>Power Distance (PDI)</strong> — how much a society accepts unequal distribution of power.</li>
<li><strong>Individualism vs Collectivism (IDV)</strong> — "I" vs "we"; personal goals vs group loyalty.</li>
<li><strong>Masculinity vs Femininity (MAS)</strong> — competition/achievement vs cooperation/quality of life.</li>
<li><strong>Uncertainty Avoidance (UAI)</strong> — tolerance for ambiguity and unstructured situations.</li>
<li><strong>Long-term vs Short-term Orientation (LTO)</strong> — pragmatic future focus vs respect for tradition &amp; quick results.</li>
<li><strong>Indulgence vs Restraint (IVR)</strong> — free gratification of desires vs regulation by social norms.</li>
</ul>
<pre><code>Approx. scores (0-100, Hofstede Insights):
              PDI  IDV  MAS  UAI  LTO  IVR
 Vietnam       70   20   40   30   57   35
 United States 40   91   62   46   26   68
</code></pre>
<p>Vietnam's high power distance + low individualism explains hierarchical, group-oriented workplace norms; the US profile (low PDI, high IDV) explains flatter, more individual-credit-driven norms — two very different defaults for the same task: "give feedback to your boss".</p>
<div class="callout"><span class="badge">Use with care</span> Scores describe a country's <em>statistical average</em>, not any one person — never use them to stereotype an individual.</div>`,
    `<span class="eyebrow">MCO302 · Chương 3 · Bài 3.1</span>
<h2>Mô hình Hofstede: 6 chiều văn hoá</h2>
<h3>Sáu chiều văn hoá</h3>
<ul>
<li><strong>Khoảng cách quyền lực (PDI)</strong> — mức độ xã hội chấp nhận phân bổ quyền lực không đồng đều.</li>
<li><strong>Cá nhân vs Tập thể (IDV)</strong> — "tôi" vs "chúng ta"; mục tiêu cá nhân vs lòng trung thành với nhóm.</li>
<li><strong>Nam tính vs Nữ tính (MAS)</strong> — cạnh tranh/thành tích vs hợp tác/chất lượng sống.</li>
<li><strong>Né tránh bất định (UAI)</strong> — mức chịu đựng sự mập mờ và tình huống thiếu cấu trúc.</li>
<li><strong>Định hướng dài hạn vs ngắn hạn (LTO)</strong> — thực tế hướng tương lai vs coi trọng truyền thống &amp; kết quả nhanh.</li>
<li><strong>Buông thả vs Kiềm chế (IVR)</strong> — tự do thoả mãn ham muốn vs bị điều chỉnh bởi chuẩn mực xã hội.</li>
</ul>
<pre><code>Điểm số ước lượng (0-100, Hofstede Insights):
              PDI  IDV  MAS  UAI  LTO  IVR
 Việt Nam       70   20   40   30   57   35
 Hoa Kỳ         40   91   62   46   26   68
</code></pre>
<p>Việt Nam có khoảng cách quyền lực cao + tính cá nhân thấp giải thích cho chuẩn mực nơi làm việc theo thứ bậc, đề cao nhóm; hồ sơ của Mỹ (PDI thấp, IDV cao) giải thích cho chuẩn mực phẳng hơn, đề cao ghi nhận cá nhân — hai "mặc định" rất khác nhau cho cùng một việc: "góp ý với cấp trên".</p>
<div class="callout"><span class="badge">Dùng cẩn trọng</span> Điểm số mô tả <em>trung bình thống kê</em> của một quốc gia, không phải của riêng một cá nhân — đừng dùng nó để rập khuôn một người cụ thể.</div>`,
  ]]);

const c3q = quiz('mco302-quiz-3', 'Quiz 3 — Hofstede\'s 6 dimensions|||Quiz 3 — 6 chiều văn hoá Hofstede', [
  { id: 'q1', question: 'Chiều đo mức độ xã hội chấp nhận phân bổ quyền lực không đồng đều gọi là gì?', options: ['Individualism (IDV)', 'Power Distance (PDI)', 'Uncertainty Avoidance (UAI)', 'Indulgence (IVR)'], correctIndex: 1, explanation: 'Power Distance (PDI) đo mức chấp nhận bất bình đẳng quyền lực trong xã hội.' },
  { id: 'q2', question: 'Việt Nam có điểm Individualism (IDV) thấp nghĩa là gì?', options: ['Đề cao cá nhân hơn nhóm', 'Đề cao tập thể/nhóm hơn cá nhân', 'Không có khái niệm gia đình', 'Né tránh mọi bất định'], correctIndex: 1, explanation: 'IDV thấp = văn hoá tập thể, quyết định và lòng trung thành gắn với nhóm nhiều hơn cá nhân.' },
  { id: 'q3', question: 'Điểm số Hofstede của một quốc gia thể hiện điều gì?', options: ['Chuẩn mực bắt buộc của mọi cá nhân trong nước đó', 'Trung bình thống kê của xã hội, không áp cho từng cá nhân', 'Luật pháp chính thức của quốc gia', 'Kết quả một cuộc khảo sát duy nhất năm 1980'], correctIndex: 1, explanation: 'Đây là xu hướng trung bình của một xã hội; từng cá nhân có thể lệch khỏi điểm số đó.' },
]);

const c4 = doc('mco302-4-1-context-trompenaars', '4.1 — High- vs low-context (Hall) & Trompenaars\' dimensions|||4.1 — High-context vs low-context (Hall) & mô hình Trompenaars',
  'Lý thuyết ngữ cảnh của Hall (high-context vs low-context) và các chiều nổi bật của Trompenaars (universalism/particularism, neutral/emotional...).',
  [[
    `<span class="eyebrow">MCO302 · Chapter 4 · Lesson 4.1</span>
<h2>High- vs low-context (Hall) &amp; Trompenaars' dimensions</h2>
<h3>Hall's context theory</h3>
<pre><code>High-context (implicit)         Low-context (explicit)
 - meaning in relationship,      - meaning in the words
   tone, shared history            themselves
 - indirect, reads "between      - direct, says what it
   the lines"                      means
 - e.g. Vietnam, Japan,          - e.g. US, Germany,
   China, Middle East              Scandinavia
</code></pre>
<h3>Trompenaars' 7 dimensions (selected)</h3>
<ul>
<li><strong>Universalism vs Particularism</strong> — rules apply to everyone vs rules bend for relationships.</li>
<li><strong>Neutral vs Emotional</strong> — hide feelings vs show them openly in business.</li>
<li><strong>Specific vs Diffuse</strong> — separate work life from private life vs blend the two.</li>
<li><strong>Achievement vs Ascription</strong> — status earned by results vs status from age/position/connections.</li>
</ul>
<div class="callout"><span class="badge">Example</span> A low-context, universalist manager writes an explicit contract and expects it followed to the letter; a high-context, particularist partner expects the relationship — not the paper — to settle disputes. Neither is "wrong"; they are reading the same deal through different lenses.</div>`,
    `<span class="eyebrow">MCO302 · Chương 4 · Bài 4.1</span>
<h2>High-context vs low-context (Hall) &amp; mô hình Trompenaars</h2>
<h3>Lý thuyết ngữ cảnh của Hall</h3>
<pre><code>High-context (hàm ý)             Low-context (rõ ràng)
 - nghĩa nằm trong quan hệ,       - nghĩa nằm trong chính
   giọng điệu, lịch sử chung        lời nói
 - gián tiếp, đọc "ý ngoài lời"   - trực tiếp, nói đúng
                                    điều muốn nói
 - vd Việt Nam, Nhật Bản,        - vd Mỹ, Đức,
   Trung Quốc, Trung Đông           Bắc Âu
</code></pre>
<h3>7 chiều Trompenaars (chọn lọc)</h3>
<ul>
<li><strong>Phổ quát vs Đặc thù (Universalism vs Particularism)</strong> — quy tắc áp dụng cho mọi người như nhau vs quy tắc uốn theo quan hệ.</li>
<li><strong>Trung tính vs Biểu cảm (Neutral vs Emotional)</strong> — che giấu cảm xúc vs bộc lộ cởi mở trong kinh doanh.</li>
<li><strong>Cụ thể vs Khuếch tán (Specific vs Diffuse)</strong> — tách bạch công việc và đời tư vs hoà trộn cả hai.</li>
<li><strong>Thành tích vs Địa vị (Achievement vs Ascription)</strong> — địa vị đến từ kết quả vs địa vị đến từ tuổi tác/chức vụ/quan hệ.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ</span> Một quản lý low-context, theo phổ quát soạn hợp đồng rõ ràng và mong nó được tuân thủ đúng câu chữ; một đối tác high-context, theo đặc thù lại mong quan hệ — không phải giấy tờ — giải quyết tranh chấp. Không bên nào "sai"; họ chỉ đang đọc cùng một thương vụ qua lăng kính khác nhau.</div>`,
  ]]);

const c4q = quiz('mco302-quiz-4', 'Quiz 4 — High/low-context & Trompenaars|||Quiz 4 — High/low-context & Trompenaars', [
  { id: 'q1', question: 'Văn hoá high-context đặt ý nghĩa chủ yếu ở đâu?', options: ['Trong chính lời nói', 'Trong quan hệ, ngữ cảnh và điều không nói ra', 'Trong văn bản pháp luật', 'Không đặt ở đâu cả'], correctIndex: 1, explanation: 'High-context: nghĩa nằm nhiều trong quan hệ, giọng điệu, ngữ cảnh chung hơn là câu chữ.' },
  { id: 'q2', question: 'Chiều "Universalism" của Trompenaars nghĩa là gì?', options: ['Quy tắc áp dụng cho mọi người như nhau, bất kể quan hệ', 'Quy tắc luôn thay đổi theo quan hệ cá nhân', 'Không có quy tắc nào cả', 'Chỉ áp dụng cho người nước ngoài'], correctIndex: 0, explanation: 'Universalism: luật/quy tắc được áp dụng nhất quán, không phân biệt quan hệ thân sơ.' },
  { id: 'q3', question: 'Theo lý thuyết của Hall, quốc gia nào thường được xem là low-context?', options: ['Việt Nam', 'Nhật Bản', 'Mỹ hoặc Đức', 'Trung Quốc'], correctIndex: 2, explanation: 'Mỹ và Đức là ví dụ điển hình của văn hoá low-context: giao tiếp trực tiếp, rõ ràng bằng lời.' },
]);

const c5 = doc('mco302-5-1-verbal-nonverbal', '5.1 — Verbal & non-verbal intercultural communication|||5.1 — Giao tiếp ngôn ngữ & phi ngôn ngữ liên văn hoá',
  'Khác biệt ngôn ngữ (mức trực tiếp, thành ngữ, sự trang trọng) và các kênh phi ngôn ngữ: kinesics, proxemics, haptics, chronemics, ánh mắt & im lặng.',
  [[
    `<span class="eyebrow">MCO302 · Chapter 5 · Lesson 5.1</span>
<h2>Verbal &amp; non-verbal intercultural communication</h2>
<h3>Verbal: more than translation</h3>
<ul>
<li><strong>Directness</strong> — some cultures value stating disagreement plainly; others soften it heavily or avoid "no" altogether.</li>
<li><strong>Idioms &amp; humor</strong> — often untranslatable; a joke that lands in one language can confuse or offend in another.</li>
<li><strong>Formality</strong> — titles, honorifics and levels of politeness vary sharply by culture and hierarchy.</li>
</ul>
<h3>Non-verbal channels</h3>
<ul>
<li><strong>Kinesics</strong> — gestures &amp; body language (a "thumbs up" is friendly in many places, offensive in some).</li>
<li><strong>Proxemics</strong> — personal space (comfortable conversation distance varies by culture).</li>
<li><strong>Haptics</strong> — touch (handshake, hug, pat on the back — acceptable in some contexts, inappropriate in others).</li>
<li><strong>Chronemics</strong> — how a culture treats time (monochronic: one thing at a time, punctuality is respect; polychronic: several things at once, relationships outrank the clock).</li>
<li><strong>Eye contact &amp; silence</strong> — direct eye contact reads as confidence in some cultures, disrespect in others; silence can mean agreement, thinking, or discomfort depending on the culture.</li>
</ul>
<div class="callout"><span class="badge">Rule of thumb</span> Non-verbal signals carry a large share of meaning — and they are exactly the part people are least aware they are sending or misreading.</div>`,
    `<span class="eyebrow">MCO302 · Chương 5 · Bài 5.1</span>
<h2>Giao tiếp ngôn ngữ &amp; phi ngôn ngữ liên văn hoá</h2>
<h3>Ngôn ngữ: hơn cả dịch thuật</h3>
<ul>
<li><strong>Mức trực tiếp</strong> — một số văn hoá coi trọng nói thẳng sự bất đồng; văn hoá khác giảm nhẹ rất nhiều hoặc tránh hẳn nói "không".</li>
<li><strong>Thành ngữ &amp; hài hước</strong> — thường không dịch được; một câu đùa "chuẩn" ở ngôn ngữ này có thể gây khó hiểu hoặc xúc phạm ở ngôn ngữ khác.</li>
<li><strong>Sự trang trọng</strong> — chức danh, kính ngữ và mức độ lễ nghi khác nhau rõ rệt theo văn hoá và thứ bậc.</li>
</ul>
<h3>Các kênh phi ngôn ngữ</h3>
<ul>
<li><strong>Kinesics</strong> — cử chỉ &amp; ngôn ngữ cơ thể (dấu "thumbs up" thân thiện ở nhiều nơi nhưng xúc phạm ở một số nơi).</li>
<li><strong>Proxemics</strong> — không gian cá nhân (khoảng cách trò chuyện thoải mái khác nhau theo văn hoá).</li>
<li><strong>Haptics</strong> — sự đụng chạm (bắt tay, ôm, vỗ vai — được chấp nhận ở ngữ cảnh này nhưng không phù hợp ở ngữ cảnh khác).</li>
<li><strong>Chronemics</strong> — cách văn hoá đối xử với thời gian (monochronic: mỗi lúc một việc, đúng giờ là tôn trọng; polychronic: làm nhiều việc cùng lúc, quan hệ quan trọng hơn đồng hồ).</li>
<li><strong>Ánh mắt &amp; im lặng</strong> — nhìn thẳng vào mắt được hiểu là tự tin ở văn hoá này, thiếu tôn trọng ở văn hoá khác; im lặng có thể là đồng ý, đang suy nghĩ, hoặc khó chịu tuỳ văn hoá.</li>
</ul>
<div class="callout"><span class="badge">Nguyên tắc chung</span> Tín hiệu phi ngôn ngữ mang một phần lớn ý nghĩa — và đây chính là phần người ta ít ý thức nhất là mình đang gửi đi hoặc hiểu sai.</div>`,
  ]]);

const c5q = quiz('mco302-quiz-5', 'Quiz 5 — Verbal & non-verbal|||Quiz 5 — Ngôn ngữ & phi ngôn ngữ', [
  { id: 'q1', question: 'Proxemics nghiên cứu về điều gì?', options: ['Cách dùng thời gian', 'Không gian cá nhân trong giao tiếp', 'Cử chỉ tay', 'Ngữ điệu giọng nói'], correctIndex: 1, explanation: 'Proxemics là nghiên cứu về khoảng cách/không gian cá nhân trong tương tác.' },
  { id: 'q2', question: 'Văn hoá polychronic thường có đặc điểm gì?', options: ['Chỉ làm một việc tại một thời điểm, đúng giờ tuyệt đối', 'Làm nhiều việc cùng lúc, coi quan hệ quan trọng hơn giờ giấc cứng', 'Không bao giờ họp trễ', 'Không quan tâm đến quan hệ cá nhân'], correctIndex: 1, explanation: 'Chronemics polychronic: linh hoạt nhiều việc song song, ưu tiên quan hệ hơn lịch trình cứng.' },
  { id: 'q3', question: 'Sự im lặng trong giao tiếp liên văn hoá nên được hiểu như thế nào?', options: ['Luôn có nghĩa là từ chối', 'Luôn có nghĩa là đồng ý', 'Tuỳ văn hoá — có thể là đồng ý, đang suy nghĩ, hoặc khó chịu', 'Không mang ý nghĩa gì'], correctIndex: 2, explanation: 'Ý nghĩa của im lặng phụ thuộc vào ngữ cảnh văn hoá cụ thể, không có một cách hiểu duy nhất.' },
]);

const c6 = doc('mco302-6-1-barriers-culture-shock', '6.1 — Barriers, stereotypes & culture shock|||6.1 — Rào cản, định kiến & sốc văn hoá',
  'Rào cản phổ biến (ethnocentrism, định kiến, giả định giống nhau); mô hình sốc văn hoá chữ U của Oberg; cách giảm rào cản.',
  [[
    `<span class="eyebrow">MCO302 · Chapter 6 · Lesson 6.1</span>
<h2>Barriers, stereotypes &amp; culture shock</h2>
<h3>Common barriers</h3>
<ul>
<li><strong>Ethnocentrism</strong> — judging other cultures by the standards of your own, assuming yours is "normal" or "better".</li>
<li><strong>Stereotyping &amp; prejudice</strong> — reducing a whole group to a fixed, oversimplified idea, then pre-judging individuals by it.</li>
<li><strong>Assumption of similarity</strong> — expecting others to think and react the way you would.</li>
<li><strong>Language barriers</strong> — literal translation loses tone, idiom and intent.</li>
</ul>
<h3>Culture shock — the U-curve</h3>
<pre><code>Honeymoon -&gt; Crisis (culture shock) -&gt; Adjustment -&gt; Mastery
 excited      frustrated,              coping          feels
 curious      homesick,                strategies      "at home"
              everything is            emerge
              "wrong"
</code></pre>
<p>Oberg's U-curve describes the emotional arc most people go through living or working in a new culture — recognizing which stage you (or a colleague) are in helps normalize the dip instead of reading it as failure.</p>
<div class="callout"><span class="badge">Reducing barriers</span> Cultural self-awareness + empathy + suspending judgment ("describe, don't evaluate") are the three habits that most reliably defuse these traps.</div>`,
    `<span class="eyebrow">MCO302 · Chương 6 · Bài 6.1</span>
<h2>Rào cản, định kiến &amp; sốc văn hoá</h2>
<h3>Các rào cản phổ biến</h3>
<ul>
<li><strong>Ethnocentrism (dân tộc trung tâm)</strong> — lấy chuẩn văn hoá của mình để đánh giá văn hoá khác, coi văn hoá mình là "bình thường" hoặc "tốt hơn".</li>
<li><strong>Định kiến &amp; thiên kiến</strong> — quy giản cả một nhóm thành một ý tưởng cố định, đơn giản hoá quá mức, rồi phán xét trước cá nhân theo đó.</li>
<li><strong>Giả định giống nhau</strong> — kỳ vọng người khác nghĩ và phản ứng giống cách mình sẽ làm.</li>
<li><strong>Rào cản ngôn ngữ</strong> — dịch theo nghĩa đen làm mất tông giọng, thành ngữ và dụng ý.</li>
</ul>
<h3>Sốc văn hoá — đường cong chữ U</h3>
<pre><code>Trăng mật -&gt; Khủng hoảng (sốc văn hoá) -&gt; Điều chỉnh -&gt; Thành thục
 hào hứng     thất vọng,                 hình thành        cảm thấy
 tò mò        nhớ nhà,                   chiến lược        "như ở nhà"
              mọi thứ đều
              "sai"
</code></pre>
<p>Đường cong chữ U của Oberg mô tả diễn biến cảm xúc mà hầu hết mọi người trải qua khi sống/làm việc trong văn hoá mới — nhận ra mình (hoặc đồng nghiệp) đang ở giai đoạn nào giúp coi giai đoạn khủng hoảng là bình thường, không phải thất bại.</p>
<div class="callout"><span class="badge">Giảm rào cản</span> Tự nhận thức văn hoá + đồng cảm + không vội đánh giá ("mô tả, không phán xét") là ba thói quen giảm hiệu quả nhất các bẫy trên.</div>`,
  ]]);

const c6q = quiz('mco302-quiz-6', 'Quiz 6 — Barriers & culture shock|||Quiz 6 — Rào cản & sốc văn hoá', [
  { id: 'q1', question: 'Ethnocentrism là gì?', options: ['Yêu thích văn hoá nước ngoài', 'Lấy chuẩn văn hoá của mình để đánh giá văn hoá khác', 'Học nhiều ngôn ngữ', 'Sốc văn hoá giai đoạn đầu'], correctIndex: 1, explanation: 'Ethnocentrism: coi chuẩn mực văn hoá của mình là chuẩn "đúng" để đánh giá người khác.' },
  { id: 'q2', question: 'Mô hình chữ U của Oberg mô tả điều gì?', options: ['Các giai đoạn cảm xúc khi sống/làm việc trong văn hoá mới', 'Cách tính điểm Hofstede', 'Cấu trúc của một hợp đồng quốc tế', 'Các bước dịch một tài liệu'], correctIndex: 0, explanation: 'Đường cong chữ U mô tả: trăng mật → khủng hoảng → điều chỉnh → thành thục.' },
  { id: 'q3', question: 'Cách nào được xem là hiệu quả nhất để giảm rào cản văn hoá?', options: ['Tránh tiếp xúc với văn hoá khác', 'Tự nhận thức văn hoá + đồng cảm + không vội đánh giá', 'Áp dụng đúng chuẩn văn hoá của mình cho mọi tình huống', 'Chỉ dùng bản dịch máy'], correctIndex: 1, explanation: 'Ba thói quen này giúp nhận ra và hoá giải ethnocentrism, định kiến và giả định giống nhau.' },
]);

const c7 = doc('mco302-7-1-negotiation-teamwork', '7.1 — Cross-cultural negotiation & teamwork|||7.1 — Đàm phán & làm việc nhóm đa văn hoá',
  'Phong cách đàm phán khác nhau theo văn hoá (deal-focus vs relationship-focus, trực tiếp vs gián tiếp); làm việc nhóm đa văn hoá: ra quyết định, giải quyết xung đột.',
  [[
    `<span class="eyebrow">MCO302 · Chapter 7 · Lesson 7.1</span>
<h2>Cross-cultural negotiation &amp; teamwork</h2>
<h3>Negotiation styles differ by culture</h3>
<ul>
<li><strong>Deal-focus vs relationship-focus</strong> — some cultures negotiate the contract first and trust later; others build the relationship first and let the contract follow.</li>
<li><strong>Direct vs indirect</strong> — a direct "no" can close a deal instantly with a low-context partner, or read as an insult and end trust with a high-context one.</li>
<li><strong>Time orientation</strong> — monochronic negotiators want a fast, linear process; polychronic negotiators may take breaks, socialize, and circle back — not stalling, just a different rhythm.</li>
</ul>
<h3>Working in multicultural teams</h3>
<ul>
<li><strong>Decision-making</strong> — hierarchical (the boss decides) vs consensus (the team decides together) — mismatched expectations slow meetings and frustrate both sides.</li>
<li><strong>Conflict resolution</strong> — direct confrontation vs face-saving, indirect mediation through a third party.</li>
<li><strong>Communication rhythm</strong> — some team members expect instant replies; others treat a slower, considered reply as respectful.</li>
</ul>
<div class="callout"><span class="badge">Best practice</span> Before an important cross-cultural negotiation or team launch: brief yourself on the other side's likely style, adapt your pace and directness, and build trust explicitly if their culture is relationship-focused — don't assume your default style is the neutral one.</div>`,
    `<span class="eyebrow">MCO302 · Chương 7 · Bài 7.1</span>
<h2>Đàm phán &amp; làm việc nhóm đa văn hoá</h2>
<h3>Phong cách đàm phán khác nhau theo văn hoá</h3>
<ul>
<li><strong>Deal-focus vs relationship-focus</strong> — một số văn hoá đàm phán hợp đồng trước rồi mới tin nhau sau; văn hoá khác xây quan hệ trước, để hợp đồng theo sau.</li>
<li><strong>Trực tiếp vs gián tiếp</strong> — một câu "không" thẳng thắn có thể đóng thương vụ ngay với đối tác low-context, nhưng bị coi là xúc phạm và chấm hết niềm tin với đối tác high-context.</li>
<li><strong>Định hướng thời gian</strong> — người đàm phán monochronic muốn quy trình nhanh, tuyến tính; người polychronic có thể nghỉ giữa buổi, giao lưu, rồi quay lại — không phải trì hoãn, chỉ là nhịp độ khác.</li>
</ul>
<h3>Làm việc trong nhóm đa văn hoá</h3>
<ul>
<li><strong>Ra quyết định</strong> — theo thứ bậc (cấp trên quyết) vs đồng thuận (cả nhóm cùng quyết) — kỳ vọng lệch nhau làm chậm cuộc họp và gây khó chịu cho cả hai phía.</li>
<li><strong>Giải quyết xung đột</strong> — đối đầu trực tiếp vs giữ thể diện, hoà giải gián tiếp qua người thứ ba.</li>
<li><strong>Nhịp độ giao tiếp</strong> — một số thành viên mong phản hồi ngay; người khác coi phản hồi chậm, cân nhắc kỹ là tôn trọng.</li>
</ul>
<div class="callout"><span class="badge">Thực hành tốt</span> Trước một cuộc đàm phán hay khởi động nhóm đa văn hoá quan trọng: tìm hiểu trước phong cách khả năng của đối tác, điều chỉnh nhịp độ và mức trực tiếp của mình, và xây niềm tin rõ ràng nếu văn hoá của họ đề cao quan hệ — đừng cho rằng phong cách mặc định của mình là chuẩn trung lập.</div>`,
  ]]);

const c7q = quiz('mco302-quiz-7', 'Quiz 7 — Negotiation & teamwork|||Quiz 7 — Đàm phán & làm việc nhóm', [
  { id: 'q1', question: 'Văn hoá relationship-focus trong đàm phán thường ưu tiên điều gì?', options: ['Ký hợp đồng ngay trong buổi gặp đầu tiên', 'Xây quan hệ tin tưởng trước, hợp đồng theo sau', 'Không cần gặp mặt trực tiếp', 'Chỉ giao tiếp qua email'], correctIndex: 1, explanation: 'Relationship-focus: niềm tin và quan hệ được xây trước khi bàn đến các điều khoản chi tiết.' },
  { id: 'q2', question: 'Ra quyết định theo kiểu "consensus" nghĩa là gì?', options: ['Một người đứng đầu quyết định cho cả nhóm', 'Cả nhóm cùng thảo luận và đồng thuận quyết định', 'Quyết định do máy tính đưa ra', 'Không ai chịu trách nhiệm quyết định'], correctIndex: 1, explanation: 'Consensus: quyết định được đưa ra sau khi cả nhóm cùng thảo luận và đồng thuận.' },
  { id: 'q3', question: 'Khi đàm phán với đối tác đến từ văn hoá high-context, nên làm gì?', options: ['Nói "không" thật trực tiếp và nhanh để tiết kiệm thời gian', 'Chú ý ngữ cảnh, quan hệ và tránh từ chối quá thẳng', 'Bỏ qua hoàn toàn yếu tố quan hệ cá nhân', 'Chỉ trao đổi bằng văn bản pháp lý'], correctIndex: 1, explanation: 'Với đối tác high-context, ngữ cảnh và quan hệ mang nhiều ý nghĩa hơn lời nói trực tiếp.' },
]);

const c8 = doc('mco302-8-1-competence-ethics-vietnam', '8.1 — Intercultural competence, ethics & the Vietnam-global context|||8.1 — Năng lực liên văn hoá, đạo đức & bối cảnh Việt Nam-quốc tế',
  'Ba thành phần năng lực liên văn hoá (kiến thức, kỹ năng, thái độ); đạo đức xuyên văn hoá; văn hoá kinh doanh Việt Nam khi làm việc với đối tác quốc tế.',
  [[
    `<span class="eyebrow">MCO302 · Chapter 8 · Lesson 8.1</span>
<h2>Intercultural competence, ethics &amp; the Vietnam-global context</h2>
<h3>What makes someone interculturally competent?</h3>
<ul>
<li><strong>Knowledge</strong> — understanding that cultures differ, and roughly how (the frameworks in this course).</li>
<li><strong>Skills</strong> — actively listening, observing non-verbal cues, adapting your communication style.</li>
<li><strong>Attitude</strong> — curiosity, respect, and tolerance for ambiguity instead of quick judgment.</li>
</ul>
<h3>Ethics across cultures</h3>
<p>Two traps to avoid: <strong>cultural relativism</strong> taken too far ("anything goes because it's their culture" — used to excuse real harm) and <strong>ethical absolutism</strong> that ignores context entirely. The practical middle ground: hold firmly to core ethical lines (honesty, no exploitation) while staying flexible on style, custom and etiquette.</p>
<h3>Vietnam in a global workplace</h3>
<ul>
<li>Vietnamese business culture carries strong Confucian influence: <strong>hierarchy</strong>, respect for age/seniority, and <strong>collectivism</strong> — decisions often flow through the group and "quan hệ" (relationship) opens doors that a cold email cannot.</li>
<li>Working with lower-power-distance, individualist partners (many Western firms): be ready to speak up individually, state disagreement more directly than feels natural, and expect faster, flatter decision-making.</li>
<li>Working with even higher-context partners (parts of East Asia, the Middle East): invest more time in relationship-building before pushing for a signed deal.</li>
</ul>
<div class="callout"><span class="badge">Takeaway</span> Intercultural competence is not memorizing rules for every country — it is the habit of noticing "this might be a cultural difference, not a personal flaw," and adjusting instead of judging.</div>`,
    `<span class="eyebrow">MCO302 · Chương 8 · Bài 8.1</span>
<h2>Năng lực liên văn hoá, đạo đức &amp; bối cảnh Việt Nam-quốc tế</h2>
<h3>Điều gì tạo nên năng lực liên văn hoá?</h3>
<ul>
<li><strong>Kiến thức</strong> — hiểu rằng văn hoá khác nhau, và khác nhau theo hướng nào (các khung lý thuyết trong môn này).</li>
<li><strong>Kỹ năng</strong> — lắng nghe chủ động, quan sát tín hiệu phi ngôn ngữ, điều chỉnh phong cách giao tiếp của mình.</li>
<li><strong>Thái độ</strong> — tò mò, tôn trọng, và chấp nhận sự mập mờ thay vì vội phán xét.</li>
</ul>
<h3>Đạo đức xuyên văn hoá</h3>
<p>Hai cái bẫy cần tránh: <strong>chủ nghĩa tương đối văn hoá</strong> bị đẩy quá xa ("cái gì cũng được vì đó là văn hoá của họ" — dùng để biện minh cho hành vi gây hại thật) và <strong>chủ nghĩa tuyệt đối đạo đức</strong> bỏ qua hoàn toàn ngữ cảnh. Điểm cân bằng thực tế: giữ chắc những giới hạn đạo đức cốt lõi (trung thực, không bóc lột) nhưng linh hoạt về phong cách, tập quán và lễ nghi.</p>
<h3>Việt Nam trong môi trường làm việc toàn cầu</h3>
<ul>
<li>Văn hoá kinh doanh Việt Nam chịu ảnh hưởng mạnh của Nho giáo: <strong>tôn ti thứ bậc</strong>, tôn trọng tuổi tác/thâm niên, và <strong>tính tập thể</strong> — quyết định thường đi qua nhóm và "quan hệ" mở ra những cánh cửa mà một email lạnh lùng không làm được.</li>
<li>Khi làm việc với đối tác cá nhân chủ nghĩa, khoảng cách quyền lực thấp (nhiều doanh nghiệp phương Tây): cần sẵn sàng phát biểu ý kiến cá nhân, nói thẳng sự bất đồng hơn cảm giác tự nhiên, và chờ đợi quyết định nhanh, phẳng hơn.</li>
<li>Khi làm việc với đối tác còn high-context hơn (một số nơi ở Đông Á, Trung Đông): dành nhiều thời gian hơn để xây quan hệ trước khi thúc đẩy ký kết.</li>
</ul>
<div class="callout"><span class="badge">Điểm chốt</span> Năng lực liên văn hoá không phải là học vẹt quy tắc của mọi quốc gia — mà là thói quen nhận ra "đây có thể là khác biệt văn hoá, không phải lỗi cá nhân", rồi điều chỉnh thay vì phán xét.</div>`,
  ]]);

const c8q = quiz('mco302-quiz-8', 'Quiz 8 — Competence, ethics & Vietnam|||Quiz 8 — Năng lực, đạo đức & Việt Nam', [
  { id: 'q1', question: 'Ba thành phần của năng lực liên văn hoá là gì?', options: ['Kiến thức, kỹ năng, thái độ', 'Tiền, thời gian, quan hệ', 'Ngôn ngữ, ẩm thực, trang phục', 'Luật pháp, kinh tế, chính trị'], correctIndex: 0, explanation: 'Năng lực liên văn hoá gồm kiến thức (hiểu khác biệt), kỹ năng (lắng nghe, điều chỉnh) và thái độ (tò mò, tôn trọng).' },
  { id: 'q2', question: 'Chủ nghĩa tương đối văn hoá bị đẩy quá xa có nguy cơ gì?', options: ['Giúp hiểu văn hoá khác tốt hơn', 'Bị dùng để biện minh cho hành vi gây hại thật', 'Làm tăng tính tuyệt đối trong đạo đức', 'Không có nguy cơ nào'], correctIndex: 1, explanation: '"Cái gì cũng được vì đó là văn hoá của họ" có thể bị lợi dụng để bao che cho hành vi thực sự gây hại.' },
  { id: 'q3', question: 'Văn hoá kinh doanh Việt Nam chịu ảnh hưởng mạnh từ đâu, và thể hiện qua điều gì?', options: ['Từ chủ nghĩa cá nhân phương Tây, thể hiện qua quyết định cá nhân nhanh', 'Từ Nho giáo, thể hiện qua tôn trọng cấp trên/tuổi tác và tính tập thể', 'Không chịu ảnh hưởng văn hoá nào cụ thể', 'Từ luật thương mại quốc tế duy nhất'], correctIndex: 1, explanation: 'Ảnh hưởng Nho giáo thể hiện qua tôn ti thứ bậc, tôn trọng tuổi tác/thâm niên và ra quyết định mang tính tập thể.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'MCO302',
    slug: 'mco302-intercultural-communication-truyen-th244ng-li234n-van-h243a',
    title: 'Intercultural Communication - Truyền thông liên văn hoá',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MCO302.webp',
    shortDescription: 'How culture shapes communication — Hofstede\'s 6 dimensions, high/low-context (Hall) & Trompenaars, verbal/non-verbal gaps, stereotypes & culture shock, cross-cultural negotiation, intercultural competence for Vietnam-global work.|||Văn hoá định hình giao tiếp thế nào — 6 chiều Hofstede, high/low-context (Hall) & Trompenaars, khác biệt ngôn ngữ/phi ngôn ngữ, định kiến & sốc văn hoá, đàm phán đa văn hoá, năng lực liên văn hoá cho môi trường Việt Nam-quốc tế.',
    description: 'Môn <strong>MCO302 — Intercultural Communication (Truyền thông liên văn hoá)</strong> (kỳ 5, khối Quản trị Kinh doanh) giúp hiểu <strong>văn hoá định hình giao tiếp thế nào</strong>. Từ <strong>khái niệm văn hoá &amp; các thành tố</strong> → <strong>mô hình Hofstede (6 chiều văn hoá)</strong> → <strong>high-context/low-context (Hall) &amp; Trompenaars</strong> → <strong>giao tiếp ngôn ngữ &amp; phi ngôn ngữ</strong> → <strong>rào cản, định kiến &amp; sốc văn hoá</strong> → <strong>đàm phán &amp; làm việc nhóm đa văn hoá</strong> → <strong>năng lực liên văn hoá, đạo đức &amp; bối cảnh Việt Nam-quốc tế</strong>. Bám giáo trình quốc tế (Hofstede, Samovar, Trompenaars, Hall), song ngữ, có bảng so sánh và quiz mỗi chương.',
    whatYouLearn: 'Định nghĩa truyền thông liên văn hoá & mô hình quá trình giao tiếp; văn hoá là gì, mô hình iceberg, các thành tố (giá trị/chuẩn mực/niềm tin); 6 chiều văn hoá Hofstede (PDI/IDV/MAS/UAI/LTO/IVR); high-context vs low-context (Hall), 7 chiều Trompenaars; giao tiếp ngôn ngữ & phi ngôn ngữ (kinesics/proxemics/haptics/chronemics); rào cản (ethnocentrism, định kiến), mô hình sốc văn hoá chữ U; đàm phán & làm việc nhóm đa văn hoá; năng lực liên văn hoá, đạo đức xuyên văn hoá & bối cảnh làm việc Việt Nam-quốc tế.',
    requirements: 'Không yêu cầu kiến thức nền đặc biệt; nên có vốn tiếng Anh cơ bản để đọc thuật ngữ gốc và giáo trình chính thức trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình trích dẫn, slide FLM, tài liệu chính thức, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Truyền thông liên văn hoá, tầm quan trọng, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & tầm quan trọng|||Chapter 1 — Overview & importance', description: 'Định nghĩa, mô hình giao tiếp, vì sao quan trọng.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Văn hoá là gì|||Chapter 2 — What is culture', description: 'Iceberg model, các thành tố văn hoá.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Mô hình Hofstede|||Chapter 3 — Hofstede\'s model', description: '6 chiều văn hoá, ví dụ so sánh.', lessons: [c3, c3q] },
    { title: 'Chương 4 — High/low-context & Trompenaars|||Chapter 4 — High/low-context & Trompenaars', description: 'Hall & 7 chiều Trompenaars.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Ngôn ngữ & phi ngôn ngữ|||Chapter 5 — Verbal & non-verbal', description: 'Kinesics, proxemics, haptics, chronemics.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Rào cản & sốc văn hoá|||Chapter 6 — Barriers & culture shock', description: 'Ethnocentrism, định kiến, mô hình chữ U.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Đàm phán & làm việc nhóm|||Chapter 7 — Negotiation & teamwork', description: 'Phong cách đàm phán, ra quyết định, xung đột.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Năng lực liên văn hoá & Việt Nam|||Chapter 8 — Competence & Vietnam', description: 'Đạo đức, bối cảnh Việt Nam-quốc tế.', lessons: [c8, c8q] },
  ],
};
