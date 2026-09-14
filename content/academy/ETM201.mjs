/**
 * ETM201 — Entertainment Marketing (Marketing Giải trí). Khối Quản trị Kinh
 * doanh (BBA), FPTU, Kỳ 3. Khung 8 chương song ngữ VI+EN, trích dẫn giáo
 * trình: Sayre/King "Entertainment Marketing", Kotler "Marketing", "The
 * Business of Entertainment", Vogel "Entertainment Industry Economics".
 * Giữ NGUYÊN slug/semester/courseCode/thumbnailUrl. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('etm201-0-1-overview', 'Course overview: Entertainment Marketing|||Tổng quan: Marketing Giải trí',
  'Vì sao marketing giải trí khác marketing sản phẩm; ngành công nghiệp trải nghiệm; lộ trình 8 chương của môn.',
  [[
    `<span class="eyebrow">ETM201 · Lesson 0.1 · Overview</span>
<h2>Entertainment Marketing</h2>
<p class="lead">This course studies how <strong>experiences are marketed</strong> — film, music, gaming, live events and streaming — where the "product" is intangible, consumed emotionally, and often gone the moment it ends. You will study audiences, talent brands, storytelling, digital/social strategy, influencers &amp; fan communities, sponsorship, and how success is measured in the streaming era.</p>
<h3>Why entertainment marketing is different</h3>
<ul>
<li><strong>Intangible &amp; experiential</strong> — you cannot return a concert; the value lives in the memory it leaves.</li>
<li><strong>Emotion-led demand</strong> — purchase decisions ride on mood, identity and belonging more than on features/price.</li>
<li><strong>Perishable &amp; time-bound</strong> — an unsold seat, an unwatched premiere weekend, cannot be resold later.</li>
<li><strong>Talent as the brand</strong> — the "product" is frequently a person (artist, actor, streamer) whose image must be managed like any brand.</li>
</ul>
<h3>Roadmap</h3>
<p>Ch.1 industry overview &amp; the experience economy → Ch.2 audience psychology → Ch.3 talent branding → Ch.4 content &amp; storytelling → Ch.5 digital/social → Ch.6 influencers &amp; fan communities → Ch.7 sponsorship &amp; product placement → Ch.8 measurement, streaming distribution &amp; trends.</p>`,
    `<span class="eyebrow">ETM201 · Bài 0.1 · Tổng quan</span>
<h2>Marketing Giải trí</h2>
<p class="lead">Môn này nghiên cứu cách <strong>marketing cho trải nghiệm</strong> — điện ảnh, âm nhạc, game, sự kiện trực tiếp và streaming — nơi "sản phẩm" vô hình, được tiêu thụ bằng cảm xúc, và thường biến mất ngay khi kết thúc. Bạn sẽ học về khán giả, thương hiệu nghệ sĩ, storytelling, chiến lược số/mạng xã hội, influencer &amp; fan community, tài trợ, và cách đo lường thành công thời streaming.</p>
<h3>Vì sao marketing giải trí khác biệt</h3>
<ul>
<li><strong>Vô hình &amp; trải nghiệm</strong> — bạn không thể "trả lại" một buổi hoà nhạc; giá trị nằm ở ký ức nó để lại.</li>
<li><strong>Nhu cầu dẫn dắt bởi cảm xúc</strong> — quyết định mua phụ thuộc tâm trạng, bản sắc và cảm giác thuộc về nhiều hơn tính năng/giá.</li>
<li><strong>Dễ hư hỏng &amp; có hạn thời gian</strong> — một ghế trống, một tuần công chiếu không ai xem, không thể bán lại sau đó.</li>
<li><strong>Nghệ sĩ chính là thương hiệu</strong> — "sản phẩm" thường là một con người (nghệ sĩ, diễn viên, streamer) mà hình ảnh phải được quản trị như bất kỳ thương hiệu nào.</li>
</ul>
<h3>Lộ trình</h3>
<p>Ch.1 tổng quan ngành &amp; nền kinh tế trải nghiệm → Ch.2 tâm lý khán giả → Ch.3 xây dựng thương hiệu nghệ sĩ → Ch.4 nội dung &amp; storytelling → Ch.5 số/mạng xã hội → Ch.6 influencer &amp; fan community → Ch.7 tài trợ &amp; product placement → Ch.8 đo lường, phân phối streaming &amp; xu hướng.</p>`,
  ]]);

const c1 = doc('etm201-1-1-overview-experience-industry', '1.1 — Entertainment marketing & the experience industry|||1.1 — Marketing giải trí & ngành công nghiệp trải nghiệm',
  'Định nghĩa marketing giải trí; khác biệt với marketing sản phẩm; các ngành thuộc phạm vi môn; nền kinh tế trải nghiệm (Pine & Gilmore).',
  [[
    `<span class="eyebrow">ETM201 · Chapter 1 · Lesson 1.1</span>
<h2>Entertainment marketing &amp; the experience industry</h2>
<h3>What counts as "entertainment marketing"?</h3>
<p>It is the set of strategies used to <strong>create, promote and sustain demand</strong> for experiences whose primary payoff is emotional (joy, thrill, connection, escape) rather than functional. It spans <strong>film, music, television, video games, live events (concerts/theatre/theme parks), sports entertainment, and streaming/OTT platforms</strong>.</p>
<h3>The experience economy (Pine &amp; Gilmore)</h3>
<pre><code>Progression of economic value:
  Commodities (raw material)  -> lowest, price-driven
  Goods       (tangible product)
  Services    (customized activity)
  Experiences (memorable, staged event) -> highest, emotion-driven
</code></pre>
<p>Entertainment sits at the top of this ladder: audiences pay a <strong>premium for memorable moments</strong>, not for the physical medium (a ticket stub, a disc) that delivers them.</p>
<h3>Key differences from product marketing</h3>
<ul>
<li><strong>Trial before purchase is impossible</strong> — you cannot sample a film before buying the ticket the way you sample a snack.</li>
<li><strong>Word-of-mouth and critic buzz</strong> often outweigh advertising in driving first-weekend/first-week demand.</li>
<li><strong>Demand is front-loaded and perishable</strong> — most revenue for a release concentrates in a short window.</li>
</ul>
<div class="callout"><span class="badge">Framing</span> Every chapter in this course returns to one question: how do you build and sustain emotional demand for something that cannot be physically inspected before it is "consumed"?</div>`,
    `<span class="eyebrow">ETM201 · Chương 1 · Bài 1.1</span>
<h2>Marketing giải trí &amp; ngành công nghiệp trải nghiệm</h2>
<h3>"Marketing giải trí" là gì?</h3>
<p>Là tập hợp chiến lược dùng để <strong>tạo, quảng bá và duy trì nhu cầu</strong> cho những trải nghiệm mà giá trị chính là cảm xúc (vui, hồi hộp, kết nối, thoát ly) hơn là công năng. Phạm vi gồm <strong>điện ảnh, âm nhạc, truyền hình, game, sự kiện trực tiếp (hoà nhạc/kịch/công viên giải trí), thể thao giải trí, và nền tảng streaming/OTT</strong>.</p>
<h3>Nền kinh tế trải nghiệm (Pine &amp; Gilmore)</h3>
<pre><code>Thang giá trị kinh tế:
  Sản phẩm thô (nguyên liệu)   -> thấp nhất, cạnh tranh bằng giá
  Hàng hoá     (sản phẩm hữu hình)
  Dịch vụ      (hoạt động tuỳ biến)
  Trải nghiệm  (sự kiện đáng nhớ, được dàn dựng) -> cao nhất, dẫn dắt bởi cảm xúc
</code></pre>
<p>Giải trí nằm ở nấc cao nhất của thang này: khán giả trả <strong>giá cao hơn cho khoảnh khắc đáng nhớ</strong>, không phải cho vật mang (vé giấy, đĩa) đưa nó đến.</p>
<h3>Khác biệt chính so với marketing sản phẩm</h3>
<ul>
<li><strong>Không thể thử trước khi mua</strong> — bạn không thể "nếm" một bộ phim trước khi mua vé như nếm một món ăn vặt.</li>
<li><strong>Truyền miệng và đánh giá của phê bình</strong> thường tác động mạnh hơn quảng cáo trong tuần/kỳ đầu ra mắt.</li>
<li><strong>Nhu cầu tập trung đầu kỳ và dễ hư hỏng</strong> — phần lớn doanh thu của một sản phẩm dồn vào khung thời gian ngắn.</li>
</ul>
<div class="callout"><span class="badge">Khung chung</span> Mọi chương trong môn quay lại một câu hỏi: làm sao xây và duy trì nhu cầu cảm xúc cho thứ không thể kiểm tra vật lý trước khi được "tiêu thụ"?</div>`,
  ]]);

const c1q = quiz('etm201-quiz-1', 'Quiz 1 — Overview & experience industry|||Quiz 1 — Tổng quan & ngành trải nghiệm', [
  { id: 'q1', question: 'Marketing giải trí khác marketing sản phẩm thông thường chủ yếu vì sản phẩm giải trí có đặc điểm gì?', options: ['Vô hình, trải nghiệm và dẫn dắt bằng cảm xúc', 'Luôn rẻ hơn sản phẩm thường', 'Không cần phân khúc khách hàng', 'Chỉ bán được qua cửa hàng'], correctIndex: 0, explanation: 'Sản phẩm giải trí vô hình, tiêu thụ bằng cảm xúc và dễ hư hỏng theo thời gian.' },
  { id: 'q2', question: 'Theo mô hình "nền kinh tế trải nghiệm" (Pine & Gilmore), giá trị kinh tế tăng dần theo thứ tự nào?', options: ['Hàng hoá → Dịch vụ → Sản phẩm thô → Trải nghiệm', 'Sản phẩm thô → Hàng hoá → Dịch vụ → Trải nghiệm', 'Trải nghiệm → Dịch vụ → Hàng hoá → Sản phẩm thô', 'Dịch vụ → Trải nghiệm → Hàng hoá → Sản phẩm thô'], correctIndex: 1, explanation: 'Thang giá trị đi từ sản phẩm thô rẻ nhất đến trải nghiệm — nấc cao nhất, dẫn dắt bởi cảm xúc.' },
  { id: 'q3', question: 'Ngành công nghiệp giải trí trong phạm vi môn này bao gồm những lĩnh vực nào?', options: ['Chỉ điện ảnh', 'Chỉ âm nhạc', 'Điện ảnh, âm nhạc, game, sự kiện trực tiếp, streaming', 'Chỉ thể thao'], correctIndex: 2, explanation: 'Môn bao quát điện ảnh, âm nhạc, truyền hình, game, sự kiện trực tiếp, thể thao giải trí và streaming/OTT.' },
]);

const c2 = doc('etm201-2-1-audience-behavior', '2.1 — Audience behavior & entertainment consumer psychology|||2.1 — Hành vi khán giả & tâm lý tiêu dùng giải trí',
  'Động cơ tiêu dùng giải trí (thoát ly, kết nối, tâm trạng); lý thuyết Uses & Gratifications; phân khúc theo tâm lý/fandom.',
  [[
    `<span class="eyebrow">ETM201 · Chapter 2 · Lesson 2.1</span>
<h2>Audience behavior &amp; entertainment consumer psychology</h2>
<h3>Why do people consume entertainment?</h3>
<ul>
<li><strong>Escapism</strong> — temporarily stepping out of daily reality into another world.</li>
<li><strong>Social connection</strong> — shared viewing, fandom, talking about a show/artist bonds people.</li>
<li><strong>Mood management</strong> — choosing content deliberately to shift or reinforce an emotional state.</li>
<li><strong>Identity &amp; status</strong> — taste in music/film/games signals who you are to others.</li>
</ul>
<h3>Uses and Gratifications theory</h3>
<p>This theory frames audiences as <strong>active choosers</strong>: people select specific content to satisfy specific needs (entertainment, information, social interaction, identity), rather than being passively "exposed" to media. Marketers use it to match messaging to the <em>need</em> a title fulfills, not just its features.</p>
<h3>Segmenting entertainment audiences</h3>
<pre><code>Demographic segmentation:  age, gender, income, location
Psychographic/fandom segmentation:
  Casual viewer   -> low engagement, price/convenience-sensitive
  Regular fan     -> follows releases, moderate engagement
  Superfan        -> high emotional investment, buys merch, defends the brand
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> A superfan and a casual viewer need entirely different messages — the superfan wants depth and exclusivity, the casual viewer wants a simple reason to show up.</div>`,
    `<span class="eyebrow">ETM201 · Chương 2 · Bài 2.1</span>
<h2>Hành vi khán giả &amp; tâm lý tiêu dùng giải trí</h2>
<h3>Vì sao con người tiêu dùng giải trí?</h3>
<ul>
<li><strong>Thoát ly (escapism)</strong> — tạm rời thực tại hằng ngày để bước vào một thế giới khác.</li>
<li><strong>Kết nối xã hội</strong> — xem cùng nhau, tham gia fandom, bàn luận về một show/nghệ sĩ giúp gắn kết mọi người.</li>
<li><strong>Quản trị tâm trạng</strong> — chủ động chọn nội dung để thay đổi hoặc củng cố cảm xúc hiện tại.</li>
<li><strong>Bản sắc &amp; địa vị</strong> — gu âm nhạc/phim/game thể hiện "bạn là ai" với người khác.</li>
</ul>
<h3>Lý thuyết "Uses and Gratifications"</h3>
<p>Lý thuyết này coi khán giả là <strong>người chủ động chọn lựa</strong>: họ chọn nội dung cụ thể để thoả mãn nhu cầu cụ thể (giải trí, thông tin, tương tác xã hội, bản sắc), thay vì bị "phơi nhiễm" bị động với truyền thông. Nhà marketing dùng lý thuyết này để khớp thông điệp với <em>nhu cầu</em> mà tác phẩm đáp ứng, không chỉ dựa vào tính năng.</p>
<h3>Phân khúc khán giả giải trí</h3>
<pre><code>Phân khúc nhân khẩu học: tuổi, giới, thu nhập, khu vực
Phân khúc tâm lý/fandom:
  Người xem thông thường -> gắn kết thấp, nhạy giá/tiện lợi
  Fan thường xuyên       -> theo dõi phát hành mới, gắn kết vừa
  Superfan                -> đầu tư cảm xúc cao, mua merch, bảo vệ thương hiệu
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Một superfan và một người xem thông thường cần thông điệp hoàn toàn khác — superfan muốn chiều sâu và độc quyền, người xem thông thường chỉ cần một lý do đơn giản để tham gia.</div>`,
  ]]);

const c2q = quiz('etm201-quiz-2', 'Quiz 2 — Audience behavior|||Quiz 2 — Hành vi khán giả', [
  { id: 'q1', question: 'Lý thuyết "Uses and Gratifications" giải thích điều gì?', options: ['Vì sao giá vé tăng', 'Vì sao khán giả CHỌN tiêu thụ nội dung để thoả mãn nhu cầu cụ thể (thoát ly, kết nối xã hội, tâm trạng)', 'Vì sao rạp chiếu đóng cửa', 'Vì sao nghệ sĩ nghỉ hưu'], correctIndex: 1, explanation: 'Lý thuyết coi khán giả chủ động chọn nội dung theo nhu cầu cụ thể, không bị phơi nhiễm bị động.' },
  { id: 'q2', question: 'Phân khúc khán giả giải trí theo TÂM LÝ/mức độ fandom khác phân khúc theo nhân khẩu học ở điểm nào?', options: ['Không khác gì', 'Tâm lý/fandom nhìn vào động cơ, mức gắn bó, hành vi thay vì tuổi/giới/thu nhập', 'Nhân khẩu học luôn chính xác hơn', 'Chỉ dùng cho game'], correctIndex: 1, explanation: 'Phân khúc tâm lý/fandom (casual/regular/superfan) dựa trên mức độ gắn kết và động cơ, khác với biến nhân khẩu học.' },
  { id: 'q3', question: 'Động cơ "thoát ly" (escapism) trong tiêu dùng giải trí nghĩa là gì?', options: ['Muốn tiết kiệm tiền', 'Muốn tạm rời thực tại, đắm vào một thế giới khác', 'Muốn mua merchandise', 'Muốn gặp nghệ sĩ ngoài đời'], correctIndex: 1, explanation: 'Escapism là nhu cầu tạm bước ra khỏi thực tại hằng ngày qua nội dung giải trí.' },
]);

const c3 = doc('etm201-3-1-talent-branding', '3.1 — Entertainment & talent branding|||3.1 — Xây dựng thương hiệu giải trí & nghệ sĩ',
  'Nghệ sĩ như một thương hiệu; quản trị hình ảnh; mở rộng thương hiệu nghệ sĩ; độ khớp giữa nghệ sĩ và nội dung/thương hiệu.',
  [[
    `<span class="eyebrow">ETM201 · Chapter 3 · Lesson 3.1</span>
<h2>Entertainment &amp; talent branding</h2>
<h3>The artist as a brand</h3>
<p>A performer, actor or creator functions like any brand: they need a <strong>clear identity</strong> (values, image, tone), <strong>consistency</strong> across appearances, and a <strong>reputation</strong> to protect. Unlike a product brand, talent brands are alive — a single controversy or scandal can damage years of built equity overnight.</p>
<h3>Building and managing a talent brand</h3>
<ul>
<li><strong>Positioning</strong> — what makes this artist distinct (genre, persona, values)?</li>
<li><strong>Image/reputation management</strong> — PR, crisis response, controlling the public narrative.</li>
<li><strong>Brand extension</strong> — merchandise, signature product lines, endorsement deals that fit the artist's image.</li>
</ul>
<h3>Talent-content fit</h3>
<p>When an artist endorses a brand or takes a role, audiences judge whether it <strong>fits</strong> their established image. A mismatch (e.g. an image built on authenticity endorsing something perceived as inauthentic) triggers backlash faster than it would for an unknown spokesperson, because fans hold parasocial expectations of consistency.</p>
<div class="callout"><span class="badge">Key idea</span> Talent branding is brand management with a heartbeat: the "product" can react to criticism, evolve, or make mistakes in real time — marketing must plan for that volatility.</div>`,
    `<span class="eyebrow">ETM201 · Chương 3 · Bài 3.1</span>
<h2>Xây dựng thương hiệu giải trí &amp; nghệ sĩ</h2>
<h3>Nghệ sĩ như một thương hiệu</h3>
<p>Một người biểu diễn, diễn viên hay nhà sáng tạo hoạt động như bất kỳ thương hiệu: cần <strong>bản sắc rõ ràng</strong> (giá trị, hình ảnh, tông giọng), <strong>nhất quán</strong> qua mọi lần xuất hiện, và <strong>danh tiếng</strong> cần được bảo vệ. Khác thương hiệu sản phẩm, thương hiệu nghệ sĩ "sống" — một tranh cãi hay scandal có thể phá huỷ nhiều năm xây dựng chỉ trong một đêm.</p>
<h3>Xây dựng &amp; quản trị thương hiệu nghệ sĩ</h3>
<ul>
<li><strong>Định vị</strong> — điều gì làm nghệ sĩ này khác biệt (thể loại, hình tượng, giá trị)?</li>
<li><strong>Quản trị hình ảnh/danh tiếng</strong> — PR, xử lý khủng hoảng, kiểm soát câu chuyện công chúng.</li>
<li><strong>Mở rộng thương hiệu</strong> — merchandise, dòng sản phẩm mang tên nghệ sĩ, hợp đồng quảng cáo khớp hình ảnh.</li>
</ul>
<h3>Độ khớp nghệ sĩ — nội dung/thương hiệu</h3>
<p>Khi nghệ sĩ quảng bá một thương hiệu hoặc nhận một vai diễn, khán giả đánh giá xem điều đó có <strong>khớp</strong> hình ảnh đã xây dựng không. Sự lệch pha (vd. hình ảnh xây trên "chân thật" lại quảng bá thứ bị coi là giả tạo) gây phản ứng ngược nhanh hơn so với một người phát ngôn vô danh, vì fan có kỳ vọng "cận xã hội" (parasocial) về sự nhất quán.</p>
<div class="callout"><span class="badge">Ý chính</span> Xây thương hiệu nghệ sĩ là quản trị thương hiệu có nhịp tim: "sản phẩm" có thể phản ứng với chỉ trích, thay đổi, hoặc mắc lỗi theo thời gian thực — marketing phải tính trước sự bất định đó.</div>`,
  ]]);

const c3q = quiz('etm201-quiz-3', 'Quiz 3 — Talent branding|||Quiz 3 — Thương hiệu nghệ sĩ', [
  { id: 'q1', question: 'Talent branding (xây dựng thương hiệu nghệ sĩ) coi nghệ sĩ như?', options: ['Một sản phẩm dùng một lần', 'Một thương hiệu với hình ảnh, giá trị và câu chuyện riêng cần quản trị nhất quán', 'Chỉ là gương mặt đại diện tạm thời', 'Không cần chiến lược gì'], correctIndex: 1, explanation: 'Nghệ sĩ được quản trị như một thương hiệu: định vị, hình ảnh, nhất quán và danh tiếng.' },
  { id: 'q2', question: '"Mở rộng thương hiệu" (brand extension) của một nghệ sĩ thường thể hiện qua?', options: ['Chỉ qua vé xem trực tiếp', 'Merchandise, hợp tác thương hiệu riêng, sản phẩm mang tên nghệ sĩ', 'Không mở rộng gì cả', 'Chỉ qua bài báo'], correctIndex: 1, explanation: 'Brand extension gồm merch, dòng sản phẩm và hợp đồng quảng cáo khớp hình ảnh nghệ sĩ.' },
  { id: 'q3', question: 'Vì sao "độ khớp" (talent-content fit) giữa nghệ sĩ và nội dung/thương hiệu quan trọng?', options: ['Không quan trọng', 'Khớp hình ảnh và giá trị giúp truyền thông đáng tin, lệch hình ảnh dễ gây phản ứng tiêu cực', 'Chỉ ảnh hưởng giá cát-xê', 'Chỉ áp dụng cho ca sĩ'], correctIndex: 1, explanation: 'Lệch pha giữa hình ảnh nghệ sĩ và nội dung/thương hiệu quảng bá dễ gây phản ứng ngược từ khán giả.' },
]);

const c4 = doc('etm201-4-1-content-storytelling', '4.1 — Content strategy & storytelling|||4.1 — Chiến lược nội dung & storytelling',
  'Marketing bằng kể chuyện; transmedia storytelling; vũ trụ nội dung/franchise; khung hành trình người hùng.',
  [[
    `<span class="eyebrow">ETM201 · Chapter 4 · Lesson 4.1</span>
<h2>Content strategy &amp; storytelling</h2>
<h3>Marketing as narrative</h3>
<p>Entertainment marketing rarely sells features — it sells a <strong>story worth caring about</strong>. Campaigns borrow classic narrative structures so audiences feel emotionally invested before they even consume the product.</p>
<pre><code>Hero's Journey (simplified, applied to a marketing narrative):
  Ordinary world -> Call to adventure -> Trials -> Transformation -> Return
</code></pre>
<h3>Transmedia storytelling</h3>
<p>A single story world is expanded <strong>across multiple platforms</strong> — a film, a companion game, a comic, a social-media "in-world" account — where each platform contributes a distinct piece of the whole experience, rather than just repeating the same content.</p>
<h3>Franchise / content universes</h3>
<p>Linking multiple titles into one shared universe (characters, timeline, easter eggs) keeps audiences engaged <strong>across years</strong>, not just one release, and multiplies revenue through merchandise, sequels and cross-title promotion.</p>
<div class="callout"><span class="badge">Practical rule</span> Plan the content calendar around the story arc, not the other way around — teaser, reveal, deep-dive, climax should mirror how a story is naturally paced.</div>`,
    `<span class="eyebrow">ETM201 · Chương 4 · Bài 4.1</span>
<h2>Chiến lược nội dung &amp; storytelling</h2>
<h3>Marketing như một câu chuyện</h3>
<p>Marketing giải trí hiếm khi bán tính năng — nó bán một <strong>câu chuyện đáng để quan tâm</strong>. Chiến dịch mượn các cấu trúc kể chuyện kinh điển để khán giả đầu tư cảm xúc trước cả khi tiêu thụ sản phẩm.</p>
<pre><code>Hành trình người hùng (đơn giản hoá, áp cho một câu chuyện marketing):
  Thế giới thường ngày -> Lời gọi phiêu lưu -> Thử thách -> Biến chuyển -> Trở về
</code></pre>
<h3>Storytelling xuyên nền tảng (transmedia)</h3>
<p>Một thế giới truyện được mở rộng <strong>trên nhiều nền tảng</strong> — một bộ phim, một game đồng hành, một truyện tranh, một tài khoản mạng xã hội "trong-thế-giới" — mỗi nền tảng góp một phần riêng vào tổng thể trải nghiệm, thay vì chỉ lặp lại cùng nội dung.</p>
<h3>Vũ trụ nội dung / franchise</h3>
<p>Liên kết nhiều tác phẩm vào một vũ trụ chung (nhân vật, dòng thời gian, easter egg) giữ khán giả gắn bó <strong>qua nhiều năm</strong>, không chỉ một lần ra mắt, và nhân doanh thu qua merchandise, phần tiếp theo và quảng bá chéo giữa các tác phẩm.</p>
<div class="callout"><span class="badge">Quy tắc thực tế</span> Lên lịch nội dung theo cung câu chuyện, không phải ngược lại — teaser, hé lộ, khai thác sâu, đỉnh điểm nên phản chiếu nhịp tự nhiên của một câu chuyện.</div>`,
  ]]);

const c4q = quiz('etm201-quiz-4', 'Quiz 4 — Content & storytelling|||Quiz 4 — Nội dung & storytelling', [
  { id: 'q1', question: 'Storytelling xuyên nền tảng (transmedia storytelling) là gì?', options: ['Kể một câu chuyện duy nhất trên một kênh', 'Mở rộng và kể các phần của MỘT câu chuyện/thế giới trên NHIỀU nền tảng, mỗi nền tảng góp một phần trải nghiệm', 'Không liên quan marketing giải trí', 'Chỉ dùng cho phim hoạt hình'], correctIndex: 1, explanation: 'Transmedia storytelling trải câu chuyện qua nhiều nền tảng, mỗi nơi góp một phần khác biệt.' },
  { id: 'q2', question: '"Vũ trụ nội dung" (franchise/content universe) mang lại lợi ích marketing gì?', options: ['Không có lợi ích gì', 'Giữ khán giả gắn bó lâu dài qua nhiều tác phẩm liên kết, tăng doanh thu chéo (merchandise, phần tiếp theo)', 'Chỉ tốn thêm chi phí không cần thiết', 'Chỉ áp dụng được một lần duy nhất'], correctIndex: 1, explanation: 'Vũ trụ nội dung liên kết nhiều tác phẩm, giữ khán giả gắn bó lâu dài và nhân doanh thu chéo.' },
  { id: 'q3', question: 'Cấu trúc "hành trình người hùng" (hero\'s journey) được dùng trong content strategy để làm gì?', options: ['Chỉ để viết truyện cổ tích', 'Làm khung kể chuyện tạo cảm xúc và gắn kết cho chiến dịch/nội dung thương hiệu', 'Không dùng trong marketing', 'Chỉ dùng ở phim tài liệu'], correctIndex: 1, explanation: 'Hero\'s journey được mượn làm khung cảm xúc cho chiến dịch marketing, không chỉ trong truyện kể truyền thống.' },
]);

const c5 = doc('etm201-5-1-digital-social', '5.1 — Digital & social media marketing for entertainment|||5.1 — Marketing số & mạng xã hội cho giải trí',
  'Bối cảnh nền tảng số; nội dung ngắn thuật toán ưu tiên; mô hình Owned-Earned-Paid; quản trị cộng đồng.',
  [[
    `<span class="eyebrow">ETM201 · Chapter 5 · Lesson 5.1</span>
<h2>Digital &amp; social media marketing for entertainment</h2>
<h3>The platform landscape</h3>
<p>Entertainment marketing now lives primarily on <strong>TikTok, Instagram, YouTube and X</strong>, where algorithm-driven discovery means a well-made piece of content can reach millions without a paid boost — and a poorly-timed one can vanish unseen.</p>
<h3>Why short-form video dominates release marketing</h3>
<p>Platforms actively surface <em>new</em> and <em>native-feeling</em> content to viewers who don't already follow the account, which lets a trailer clip or behind-the-scenes moment reach audiences a traditional ad never would — at a fraction of the cost.</p>
<h3>Owned — Earned — Paid media</h3>
<pre><code>Owned media  -> channels the studio/artist controls (official account, website)
Earned media -> organic mentions, reviews, shares by press and fans
Paid media   -> boosted posts, display ads, paid partnerships
</code></pre>
<p>A strong release campaign sequences all three: <strong>owned</strong> teases, <strong>earned</strong> validates and spreads it, <strong>paid</strong> fills reach gaps at the critical launch moment.</p>
<h3>Community management</h3>
<p>Between releases, responding to comments, running polls, and keeping a fan community active is what keeps interest warm — a franchise that goes silent for a year loses momentum it must then rebuild from scratch.</p>`,
    `<span class="eyebrow">ETM201 · Chương 5 · Bài 5.1</span>
<h2>Marketing số &amp; mạng xã hội cho giải trí</h2>
<h3>Bối cảnh nền tảng</h3>
<p>Marketing giải trí ngày nay chủ yếu diễn ra trên <strong>TikTok, Instagram, YouTube và X</strong>, nơi cơ chế khám phá theo thuật toán nghĩa là một nội dung được làm tốt có thể tiếp cận hàng triệu người mà không cần đẩy tiền — còn một nội dung ra mắt sai thời điểm có thể chìm nghỉm không ai thấy.</p>
<h3>Vì sao video ngắn chiếm ưu thế trong marketing ra mắt</h3>
<p>Các nền tảng chủ động đưa nội dung <em>mới</em> và <em>tự nhiên</em> tới người xem chưa theo dõi tài khoản, giúp một clip trailer hay một khoảnh khắc hậu trường tiếp cận khán giả mà quảng cáo truyền thống không thể chạm tới — với chi phí chỉ bằng một phần nhỏ.</p>
<h3>Mô hình Owned — Earned — Paid</h3>
<pre><code>Owned media  -> kênh studio/nghệ sĩ tự kiểm soát (tài khoản chính thức, website)
Earned media -> nhắc đến tự nhiên, review, chia sẻ từ báo chí và fan
Paid media   -> bài đăng được đẩy, quảng cáo hiển thị, hợp tác trả tiền
</code></pre>
<p>Một chiến dịch ra mắt mạnh kết hợp cả ba: <strong>owned</strong> nhá hàng, <strong>earned</strong> xác nhận và lan truyền, <strong>paid</strong> lấp khoảng trống tiếp cận vào thời điểm ra mắt then chốt.</p>
<h3>Quản trị cộng đồng</h3>
<p>Giữa các lần ra mắt, việc phản hồi bình luận, tổ chức bình chọn, và duy trì fan community hoạt động chính là thứ giữ "nhiệt" quan tâm — một franchise im lặng cả năm sẽ mất động lực và phải xây lại từ đầu.</p>`,
  ]]);

const c5q = quiz('etm201-quiz-5', 'Quiz 5 — Digital & social marketing|||Quiz 5 — Marketing số & mạng xã hội', [
  { id: 'q1', question: 'Trong marketing giải trí, nội dung ngắn (short-form video) trên TikTok/Reels/Shorts quan trọng chủ yếu vì?', options: ['Luôn là kênh rẻ nhất nên luôn đúng', 'Thuật toán ưu tiên nội dung mới, giúp tiếp cận khán giả rộng nhanh mà không cần lượng follow lớn', 'Không ai xem loại nội dung này', 'Chỉ dùng được khi trả tiền quảng cáo'], correctIndex: 1, explanation: 'Thuật toán các nền tảng ưu tiên đưa nội dung mới/tự nhiên tới người xem chưa follow, giúp tiếp cận rộng với chi phí thấp.' },
  { id: 'q2', question: 'Mô hình Owned — Earned — Paid media áp dụng cho một chiến dịch ra mắt (trailer drop) như thế nào?', options: ['Owned = kênh chính chủ, Earned = được nhắc tới/chia sẻ tự nhiên, Paid = quảng cáo trả tiền — kết hợp cả ba để khuếch đại', 'Chỉ cần dùng Paid media là đủ', 'Chỉ cần dùng Owned media là đủ', 'Ba loại giống nhau, không cần phân biệt'], correctIndex: 0, explanation: 'Chiến dịch ra mắt mạnh phối hợp owned (nhá hàng), earned (lan truyền tự nhiên) và paid (lấp khoảng trống tiếp cận).' },
  { id: 'q3', question: 'Quản trị cộng đồng (community management) trong marketing giải trí có vai trò gì?', options: ['Không cần thiết', 'Duy trì tương tác, phản hồi khán giả, giữ "nhiệt" quan tâm giữa các lần ra mắt sản phẩm/nội dung', 'Chỉ để trả lời khiếu nại', 'Chỉ dùng cho mục đích nội bộ studio'], correctIndex: 1, explanation: 'Community management giữ fan community hoạt động liên tục, tránh mất động lực giữa các lần ra mắt.' },
]);

const c6 = doc('etm201-6-1-influencer-fan-viral', '6.1 — Influencers, fan communities & viral marketing|||6.1 — Influencer, fan community & viral marketing',
  'Phân tầng influencer; kinh tế fandom; cơ chế viral; nội dung do người dùng tạo (UGC) và chương trình trung thành superfan.',
  [[
    `<span class="eyebrow">ETM201 · Chapter 6 · Lesson 6.1</span>
<h2>Influencers, fan communities &amp; viral marketing</h2>
<h3>Influencer tiers</h3>
<pre><code>Nano   (~1k-10k followers)   -> highest trust, niche community
Micro  (~10k-100k)           -> strong engagement, affordable
Macro  (~100k-1M)            -> broad reach, moderate cost
Mega/celebrity (1M+)         -> mass reach, highest cost, lower relative engagement
</code></pre>
<p>Bigger is not automatically better: a micro-influencer's tightly-bonded niche audience often converts better for a targeted release than a mega-influencer's broad, more passive following.</p>
<h3>Fan communities &amp; fandom economics</h3>
<p>Organized fan communities (forums, Discord servers, fan pages) generate <strong>free marketing labor</strong> — theories, fan art, translations, event organizing — that extends a title's visibility far beyond what the studio itself produces.</p>
<h3>Viral mechanics</h3>
<p>Content spreads when it triggers: <strong>strong emotion</strong> (surprise, humor, awe), <strong>social currency</strong> (sharing it makes the sharer look good/in-the-know), and <strong>easy remixability</strong> (a sound, meme format or challenge others can copy).</p>
<div class="callout"><span class="badge">User-generated content</span> UGC and fan-made content amplify reach at near-zero marketing cost and read as more authentic than brand-produced ads — but they cannot be fully controlled, which is the trade-off.</div>`,
    `<span class="eyebrow">ETM201 · Chương 6 · Bài 6.1</span>
<h2>Influencer, fan community &amp; viral marketing</h2>
<h3>Phân tầng influencer</h3>
<pre><code>Nano   (~1k-10k người theo dõi) -> độ tin cao nhất, cộng đồng ngách
Micro  (~10k-100k)              -> gắn kết mạnh, chi phí phải chăng
Macro  (~100k-1M)                -> tiếp cận rộng, chi phí trung bình
Mega/celebrity (1M+)             -> tiếp cận đại chúng, chi phí cao nhất, gắn kết tương đối thấp
</code></pre>
<p>Lớn hơn không tự động tốt hơn: khán giả ngách gắn kết chặt của một micro-influencer thường chuyển đổi tốt hơn cho một sản phẩm nhắm mục tiêu, so với lượng theo dõi rộng nhưng thụ động hơn của mega-influencer.</p>
<h3>Fan community &amp; kinh tế fandom</h3>
<p>Các cộng đồng fan có tổ chức (forum, server Discord, fanpage) tạo ra <strong>công marketing miễn phí</strong> — giả thuyết, fan art, dịch thuật, tổ chức sự kiện — mở rộng độ nhận diện của sản phẩm vượt xa những gì chính studio tự sản xuất.</p>
<h3>Cơ chế viral</h3>
<p>Nội dung lan truyền khi kích hoạt: <strong>cảm xúc mạnh</strong> (bất ngờ, hài hước, kinh ngạc), <strong>giá trị xã hội</strong> (chia sẻ nó giúp người chia sẻ trông "biết trước/sành điệu"), và <strong>dễ tái tạo</strong> (một đoạn nhạc, khuôn mẫu meme hay thử thách người khác có thể sao chép).</p>
<div class="callout"><span class="badge">Nội dung do người dùng tạo</span> UGC và nội dung do fan làm khuếch đại độ tiếp cận với chi phí marketing gần như bằng không và trông chân thực hơn quảng cáo do thương hiệu sản xuất — nhưng đổi lại không thể kiểm soát hoàn toàn.</div>`,
  ]]);

const c6q = quiz('etm201-quiz-6', 'Quiz 6 — Influencer, fan community & viral|||Quiz 6 — Influencer, fan community & viral', [
  { id: 'q1', question: 'Phân tầng influencer từ nhỏ đến lớn thường gồm?', options: ['Chỉ có một loại duy nhất', 'Nano, micro, macro, mega — theo quy mô người theo dõi và mức độ gắn kết', 'Chỉ có celebrity', 'Không phân tầng gì cả'], correctIndex: 1, explanation: 'Influencer được phân theo quy mô: nano, micro, macro, mega/celebrity, mỗi tầng khác nhau về gắn kết và chi phí.' },
  { id: 'q2', question: 'Vì sao micro-influencer đôi khi hiệu quả hơn mega-influencer cho một số chiến dịch giải trí?', options: ['Vì luôn rẻ hơn nên luôn tốt hơn', 'Vì mức gắn kết (engagement) và độ tin cậy với cộng đồng ngách thường cao hơn dù lượng theo dõi ít hơn', 'Vì không có sự khác biệt nào giữa hai loại', 'Vì micro-influencer luôn nổi tiếng hơn'], correctIndex: 1, explanation: 'Khán giả ngách của micro-influencer gắn kết chặt hơn, thường chuyển đổi tốt hơn cho mục tiêu cụ thể.' },
  { id: 'q3', question: 'Nội dung do người dùng tạo (UGC) và fan community đóng góp gì cho viral marketing?', options: ['Không đóng góp gì', 'Khuếch đại tự nhiên, tăng độ tin cậy và tạo hiệu ứng lan truyền vượt ngân sách quảng cáo', 'Chỉ gây rối cho chiến dịch', 'Chỉ có giá trị nội bộ studio'], correctIndex: 1, explanation: 'UGC và fan community mở rộng độ nhận diện gần như miễn phí và được xem là chân thực hơn quảng cáo chính thức.' },
]);

const c7 = doc('etm201-7-1-sponsorship-placement', '7.1 — Sponsorship, brand partnerships & product placement|||7.1 — Tài trợ, hợp tác thương hiệu & product placement',
  'Các dạng tài trợ; hợp tác thương hiệu; các kiểu product placement; đo ROI tài trợ; rủi ro ambush marketing.',
  [[
    `<span class="eyebrow">ETM201 · Chapter 7 · Lesson 7.1</span>
<h2>Sponsorship, brand partnerships &amp; product placement</h2>
<h3>Types of sponsorship</h3>
<ul>
<li><strong>Event sponsorship</strong> — funding a concert, festival or premiere in exchange for visibility.</li>
<li><strong>Naming rights</strong> — a brand's name attached to a venue or tour ("Brand Arena Tour").</li>
<li><strong>Brand partnerships</strong> — co-created content or capsule collections tying a brand to a title/artist.</li>
</ul>
<h3>Product placement</h3>
<pre><code>On-set / background placement -> product visible in a scene, passive
Script integration             -> product/brand becomes part of the plot or dialogue, active
Virtual placement               -> digitally inserted post-production (can vary by market/release)
</code></pre>
<p>Script-integrated placement usually drives stronger recall because the audience processes the brand as <strong>part of the story</strong>, not as background scenery.</p>
<h3>Evaluating sponsorship ROI</h3>
<p>Good evaluation combines <strong>brand awareness lift</strong>, <strong>share of voice/mentions</strong> in coverage and social conversation, and <strong>behavioral impact</strong> (sales, downloads, ticket sales) — not any single metric alone.</p>
<div class="callout"><span class="badge">Ambush marketing risk</span> A brand that is NOT an official sponsor can still associate itself with an event (via nearby ads, opportunistic social posts) to steal attention — diluting the value the official sponsor paid for.</div>`,
    `<span class="eyebrow">ETM201 · Chương 7 · Bài 7.1</span>
<h2>Tài trợ, hợp tác thương hiệu &amp; product placement</h2>
<h3>Các dạng tài trợ</h3>
<ul>
<li><strong>Tài trợ sự kiện</strong> — cấp vốn cho hoà nhạc, lễ hội hay công chiếu để đổi lại độ hiện diện.</li>
<li><strong>Quyền đặt tên</strong> — tên thương hiệu gắn với địa điểm hoặc tour diễn ("Brand Arena Tour").</li>
<li><strong>Hợp tác thương hiệu</strong> — nội dung đồng sáng tạo hoặc bộ sưu tập giới hạn gắn thương hiệu với tác phẩm/nghệ sĩ.</li>
</ul>
<h3>Product placement</h3>
<pre><code>Đặt trên set/hậu cảnh -> sản phẩm xuất hiện trong khung hình, thụ động
Tích hợp kịch bản      -> sản phẩm/thương hiệu trở thành một phần cốt truyện hoặc lời thoại, chủ động
Đặt ảo (virtual)       -> chèn kỹ thuật số sau sản xuất (có thể khác nhau theo thị trường/bản phát hành)
</code></pre>
<p>Product placement tích hợp kịch bản thường tạo ghi nhớ mạnh hơn vì khán giả xử lý thương hiệu như <strong>một phần câu chuyện</strong>, không phải chỉ là cảnh vật nền.</p>
<h3>Đánh giá ROI tài trợ</h3>
<p>Đánh giá tốt kết hợp <strong>mức tăng nhận diện thương hiệu</strong>, <strong>tỷ trọng nhắc đến</strong> trên báo chí và mạng xã hội, và <strong>tác động hành vi</strong> (doanh số, lượt tải, lượt bán vé) — không chỉ dựa vào một chỉ số duy nhất.</p>
<div class="callout"><span class="badge">Rủi ro ambush marketing</span> Một thương hiệu KHÔNG phải nhà tài trợ chính thức vẫn có thể gắn hình ảnh với sự kiện (qua quảng cáo lân cận, bài đăng chớp thời cơ) để chiếm sự chú ý — làm loãng giá trị mà nhà tài trợ chính thức đã trả tiền.</div>`,
  ]]);

const c7q = quiz('etm201-quiz-7', 'Quiz 7 — Sponsorship & product placement|||Quiz 7 — Tài trợ & product placement', [
  { id: 'q1', question: 'Product placement "tích hợp vào kịch bản" (script integration) khác gì so với đặt sản phẩm thụ động trên set?', options: ['Không khác gì cả', 'Sản phẩm/thương hiệu trở thành một phần câu chuyện, được nhắc/dùng có chủ đích, tác động ghi nhớ mạnh hơn', 'Chỉ là đặt logo ở góc màn hình', 'Luôn đắt hơn mà không có lý do'], correctIndex: 1, explanation: 'Tích hợp kịch bản khiến thương hiệu là một phần cốt truyện, tạo ghi nhớ mạnh hơn đặt sản phẩm thụ động.' },
  { id: 'q2', question: 'Rủi ro "ambush marketing" trong tài trợ sự kiện giải trí là gì?', options: ['Nhà tài trợ chính thức chi quá nhiều tiền', 'Một thương hiệu KHÔNG tài trợ chính thức vẫn gắn hình ảnh với sự kiện để hưởng lợi truyền thông, làm loãng giá trị tài trợ chính thức', 'Không có rủi ro nào cả', 'Chỉ xảy ra trong lĩnh vực thể thao'], correctIndex: 1, explanation: 'Ambush marketing là khi thương hiệu không tài trợ vẫn "ăn theo" sự chú ý của sự kiện, gây thiệt hại cho nhà tài trợ chính thức.' },
  { id: 'q3', question: 'Đánh giá ROI của một hợp đồng tài trợ/hợp tác thương hiệu trong giải trí nên dựa vào?', options: ['Chỉ cảm nhận chủ quan của ban lãnh đạo', 'Kết hợp mức tăng nhận diện thương hiệu, mức độ nhắc đến/thảo luận, và tác động đến hành vi (doanh số, lượt tải, lượt xem)', 'Chỉ số vé bán được duy nhất', 'Không thể đo lường được'], correctIndex: 1, explanation: 'Đánh giá ROI tài trợ cần kết hợp nhiều chỉ số: nhận diện, share of voice và tác động hành vi thực tế.' },
]);

const c8 = doc('etm201-8-1-measurement-streaming-trends', '8.1 — Measurement, streaming/OTT distribution & trends|||8.1 — Đo lường, phân phối streaming/OTT & xu hướng',
  'Chỉ số marketing giải trí; cửa sổ phân phối streaming/OTT; cá nhân hoá dữ liệu; xu hướng mới (AI, video ngắn, fandom toàn cầu).',
  [[
    `<span class="eyebrow">ETM201 · Chapter 8 · Lesson 8.1</span>
<h2>Measurement, streaming/OTT distribution &amp; trends</h2>
<h3>KPIs beyond box office</h3>
<pre><code>Traditional: box office revenue, album/ticket sales
Streaming-era additions:
  Watch time / completion rate  -> how much of the content is actually consumed
  Rewatch rate                   -> a strong loyalty signal
  Engagement (comments, shares, saves)
</code></pre>
<p>On OTT platforms, a title can be "seen" by millions in a release-week headline number while actual <strong>watch time</strong> tells a very different, more honest story about audience retention.</p>
<h3>Streaming/OTT distribution windows</h3>
<p>Release strategy now weighs <strong>theatrical vs. streaming-first vs. simultaneous ("day-and-date")</strong> release, each with different marketing timelines and revenue trade-offs (upfront ticket revenue vs. subscriber retention value).</p>
<h3>Data-driven personalization</h3>
<p>Streaming platforms use viewing data to <strong>recommend content</strong> and to <strong>target promotion</strong> — the same data that improves discovery for viewers also informs marketers where and to whom to push a new release.</p>
<h3>Emerging trends</h3>
<ul>
<li><strong>AI-generated content</strong> in trailers, marketing assets and even personalized ad creative.</li>
<li><strong>Short-form video dominance</strong> as the default discovery channel for new releases.</li>
<li><strong>Global, cross-border fandoms</strong> forming instantly around content via digital platforms, independent of a title's country of origin.</li>
</ul>
<div class="callout"><span class="badge">Closing idea</span> Measurement and distribution have converged: how a title is distributed now determines what can even be measured — and both keep shifting as platforms change the rules.</div>`,
    `<span class="eyebrow">ETM201 · Chương 8 · Bài 8.1</span>
<h2>Đo lường, phân phối streaming/OTT &amp; xu hướng</h2>
<h3>Chỉ số vượt ra ngoài doanh thu phòng vé</h3>
<pre><code>Truyền thống: doanh thu phòng vé, doanh số album/vé
Bổ sung thời streaming:
  Thời gian xem / tỷ lệ hoàn thành -> nội dung thực sự được tiêu thụ bao nhiêu
  Tỷ lệ xem lại                     -> tín hiệu trung thành mạnh
  Mức tương tác (bình luận, chia sẻ, lưu lại)
</code></pre>
<p>Trên nền tảng OTT, một tác phẩm có thể "được xem" bởi hàng triệu người theo số liệu tuần ra mắt, trong khi <strong>thời gian xem thực tế</strong> lại kể một câu chuyện rất khác, trung thực hơn về việc giữ chân khán giả.</p>
<h3>Cửa sổ phân phối streaming/OTT</h3>
<p>Chiến lược phát hành ngày nay phải cân nhắc <strong>chiếu rạp vs. streaming trước vs. phát hành đồng thời ("day-and-date")</strong>, mỗi lựa chọn có lịch trình marketing và đánh đổi doanh thu khác nhau (doanh thu vé trả trước so với giá trị giữ chân người đăng ký).</p>
<h3>Cá nhân hoá dựa trên dữ liệu</h3>
<p>Nền tảng streaming dùng dữ liệu xem để <strong>đề xuất nội dung</strong> và <strong>nhắm mục tiêu quảng bá</strong> — cùng một dữ liệu giúp khán giả khám phá nội dung cũng giúp nhà marketing biết đẩy sản phẩm mới tới đâu và cho ai.</p>
<h3>Xu hướng mới nổi</h3>
<ul>
<li><strong>Nội dung do AI tạo</strong> trong trailer, tài sản marketing và cả nội dung quảng cáo cá nhân hoá.</li>
<li><strong>Video ngắn chiếm ưu thế</strong> như kênh khám phá mặc định cho sản phẩm mới.</li>
<li><strong>Fandom toàn cầu, xuyên biên giới</strong> hình thành gần như ngay lập tức qua nền tảng số, không phụ thuộc quốc gia gốc của tác phẩm.</li>
</ul>
<div class="callout"><span class="badge">Ý kết</span> Đo lường và phân phối đã hội tụ: cách một tác phẩm được phân phối giờ quyết định luôn cả những gì có thể đo lường được — và cả hai vẫn đang thay đổi khi các nền tảng đổi luật chơi.</div>`,
  ]]);

const c8q = quiz('etm201-quiz-8', 'Quiz 8 — Measurement, streaming & trends|||Quiz 8 — Đo lường, streaming & xu hướng', [
  { id: 'q1', question: 'Trong kỷ nguyên streaming/OTT, chỉ số nào bổ sung quan trọng bên cạnh doanh thu phòng vé/băng đĩa truyền thống?', options: ['Không cần chỉ số mới nào', 'Thời gian xem (watch time), tỷ lệ hoàn thành, lượt xem lại — phản ánh mức độ giữ chân khán giả', 'Chỉ cần số lượt tải app', 'Chỉ cần đánh giá số sao'], correctIndex: 1, explanation: 'Watch time, completion rate và rewatch rate cho biết mức độ giữ chân khán giả thực tế, khác doanh thu bề mặt.' },
  { id: 'q2', question: 'Cá nhân hoá dựa trên dữ liệu (data-driven personalization) trên nền tảng streaming giúp gì cho marketing giải trí?', options: ['Không liên quan đến marketing', 'Đề xuất nội dung đúng khán giả, tăng thời gian xem và giữ chân người dùng, đồng thời hỗ trợ nhắm mục tiêu quảng bá', 'Chỉ giúp kỹ thuật lưu trữ dữ liệu', 'Làm chậm nền tảng streaming'], correctIndex: 1, explanation: 'Dữ liệu xem vừa cải thiện đề xuất nội dung cho người xem, vừa giúp marketing nhắm mục tiêu quảng bá chính xác hơn.' },
  { id: 'q3', question: 'Xu hướng nào ĐANG định hình lại marketing giải trí gần đây theo bài học này?', options: ['Quay lại hoàn toàn quảng cáo truyền thống', 'Nội dung do AI tạo, video ngắn chiếm ưu thế, fandom toàn cầu xuyên biên giới nhờ nền tảng số', 'Không có xu hướng mới nào', 'Chỉ áp dụng trong phạm vi một quốc gia'], correctIndex: 1, explanation: 'Ba xu hướng nổi bật: nội dung AI, video ngắn thống trị khám phá, và fandom toàn cầu hình thành xuyên biên giới.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'ETM201',
    slug: 'etm201-entertainment-marketing',
    title: 'Entertainment Marketing',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ETM201.webp',
    shortDescription: 'Entertainment marketing across the experience economy: audience psychology, talent branding, storytelling, digital & social strategy, influencers & fan communities, sponsorship & product placement, and streaming-era measurement.|||Marketing giải trí trong nền kinh tế trải nghiệm: tâm lý khán giả, xây dựng thương hiệu nghệ sĩ, storytelling, chiến lược số & mạng xã hội, influencer & fan community, tài trợ & product placement, đo lường thời streaming.',
    description: 'Môn <strong>ETM201 — Entertainment Marketing</strong> (Marketing Giải trí) thuộc khối Quản trị Kinh doanh, kỳ 3, FPTU.<br><br>Khung 8 chương song ngữ: tổng quan ngành trải nghiệm, tâm lý &amp; hành vi khán giả, xây dựng thương hiệu nghệ sĩ (talent branding), chiến lược nội dung &amp; storytelling, marketing số &amp; mạng xã hội, influencer &amp; fan community, tài trợ &amp; product placement, và đo lường/phân phối thời streaming. Trích dẫn giáo trình Sayre/King <em>Entertainment Marketing</em>, Kotler <em>Marketing</em>, <em>The Business of Entertainment</em>, Vogel <em>Entertainment Industry Economics</em>.',
    whatYouLearn: 'Đặc thù marketing cho sản phẩm giải trí; tâm lý và phân khúc khán giả; xây dựng &amp; bảo vệ thương hiệu nghệ sĩ; chiến lược nội dung/storytelling xuyên nền tảng; marketing số &amp; mạng xã hội; influencer, fan community &amp; viral marketing; tài trợ, hợp tác thương hiệu &amp; product placement; đo lường hiệu quả và phân phối trong kỷ nguyên streaming/OTT.',
    requirements: 'Không yêu cầu kiến thức chuyên sâu trước đó; nên đã học các môn marketing/quản trị kinh doanh nền tảng ở học kỳ trước theo khung chương trình khối Quản trị Kinh doanh.',
  },
  sections: [
    { title: 'Tài liệu|||Documents', lessons: [intro] },
    { title: 'Chương 1: Tổng quan marketing giải trí & ngành công nghiệp trải nghiệm|||Chapter 1: Overview & the experience industry', lessons: [c1, c1q] },
    { title: 'Chương 2: Hành vi khán giả & tâm lý tiêu dùng giải trí|||Chapter 2: Audience behavior & consumer psychology', lessons: [c2, c2q] },
    { title: 'Chương 3: Xây dựng thương hiệu giải trí & nghệ sĩ|||Chapter 3: Entertainment & talent branding', lessons: [c3, c3q] },
    { title: 'Chương 4: Chiến lược nội dung & storytelling|||Chapter 4: Content strategy & storytelling', lessons: [c4, c4q] },
    { title: 'Chương 5: Marketing số & mạng xã hội cho giải trí|||Chapter 5: Digital & social media marketing', lessons: [c5, c5q] },
    { title: 'Chương 6: Influencer, fan community & viral marketing|||Chapter 6: Influencers, fan communities & viral marketing', lessons: [c6, c6q] },
    { title: 'Chương 7: Tài trợ, hợp tác thương hiệu & product placement|||Chapter 7: Sponsorship, brand partnerships & product placement', lessons: [c7, c7q] },
    { title: 'Chương 8: Đo lường, phân phối (streaming/OTT) & xu hướng|||Chapter 8: Measurement, streaming/OTT distribution & trends', lessons: [c8, c8q] },
  ],
};
