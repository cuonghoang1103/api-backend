/**
 * BEX301 — Brand Experience & Activation Design (Thiết kế trải nghiệm và kích
 * hoạt thương hiệu). Khối Công nghệ Truyền thông FPTU, Kỳ 7.
 * Sách chuẩn: Bernd Schmitt "Experiential Marketing" & "Customer Experience
 * Management"; Pine & Gilmore "The Experience Economy"; Brakus/Schmitt/
 * Zarantonello "Brand Experience" (JM 2009); Event Marketing Institute.
 * Song ngữ VI+EN, ví dụ activation thật. Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick/${ trong HTML; "\n"→\\n; "&"→\&amp; chỉ trong content HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('bex301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn quốc tế (Schmitt, Pine & Gilmore, Brakus), tài liệu ngành, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">BEX301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Brand Experience &amp; Activation Design</strong> — from the experience economy and Schmitt's experiential modules to journeys, activations, events, phygital and measurement — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are the canonical books and free resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for BEX301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Core reference books</h3>
<ul>
<li>Bernd H. Schmitt — <em>Experiential Marketing</em> (the SEM framework: sense, feel, think, act, relate)</li>
<li>Bernd H. Schmitt — <em>Customer Experience Management (CEM)</em></li>
<li>B. Joseph Pine II &amp; James H. Gilmore — <em>The Experience Economy</em></li>
<li>Brakus, Schmitt &amp; Zarantonello — <em>Brand Experience: What Is It? How Is It Measured? Does It Affect Loyalty?</em> (Journal of Marketing, 2009)</li>
</ul>
<h3>🌐 Industry / free resources</h3>
<ul>
<li><a href="https://www.thinkwithgoogle.com/" target="_blank" rel="noopener">Think with Google</a> — moments, journeys &amp; experience data</li>
<li><a href="https://hbr.org/topic/subject/customer-experience" target="_blank" rel="noopener">Harvard Business Review — Customer Experience</a></li>
<li><a href="https://www.cannescreativity.com/" target="_blank" rel="noopener">Cannes Lions — Experience &amp; Brand Experience &amp; Activation cases</a></li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@GaryVee" target="_blank" rel="noopener">GaryVee</a> — brand, attention &amp; activation thinking</li>
<li><a href="https://www.youtube.com/results?search_query=brand+activation+case+study" target="_blank" rel="noopener">Brand activation case studies</a> — Coca-Cola, Nike, Red Bull, IKEA</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma / FigJam</a> — journey maps &amp; service blueprints</li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — touchpoint mapping &amp; co-creation boards</li>
<li><a href="https://www.smaply.com/" target="_blank" rel="noopener">Smaply</a> — customer journey &amp; persona mapping</li>
</ul>
<div class="callout"><span class="badge">Self-study path (4 steps)</span>
<ol>
<li><strong>Foundation</strong> — the experience economy, why experiences beat goods &amp; services, the brand experience concept.</li>
<li><strong>Models</strong> — Schmitt's SEMs (sense/feel/think/act/relate) and Brakus's four dimensions; map a real brand to each.</li>
<li><strong>Design</strong> — journeys &amp; touchpoints, brand activation, events &amp; space, digital &amp; phygital, emotion &amp; community.</li>
<li><strong>Measure</strong> — experience metrics, NPS, engagement and activation ROI; run and optimise a campaign.</li>
</ol></div>`,
    `<span class="eyebrow">BEX301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Thiết kế trải nghiệm &amp; kích hoạt thương hiệu</strong> — từ nền kinh tế trải nghiệm và các module của Schmitt đến hành trình, kích hoạt, sự kiện, phygital và đo lường — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là các sách kinh điển và nguồn miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của BEX301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo cốt lõi</h3>
<ul>
<li>Bernd H. Schmitt — <em>Experiential Marketing</em> (khung SEM: sense, feel, think, act, relate)</li>
<li>Bernd H. Schmitt — <em>Customer Experience Management (CEM)</em></li>
<li>B. Joseph Pine II &amp; James H. Gilmore — <em>The Experience Economy</em></li>
<li>Brakus, Schmitt &amp; Zarantonello — <em>Brand Experience: What Is It? How Is It Measured? Does It Affect Loyalty?</em> (Journal of Marketing, 2009)</li>
</ul>
<h3>🌐 Tài liệu ngành / miễn phí</h3>
<ul>
<li><a href="https://www.thinkwithgoogle.com/" target="_blank" rel="noopener">Think with Google</a> — khoảnh khắc, hành trình &amp; dữ liệu trải nghiệm</li>
<li><a href="https://hbr.org/topic/subject/customer-experience" target="_blank" rel="noopener">Harvard Business Review — Customer Experience</a></li>
<li><a href="https://www.cannescreativity.com/" target="_blank" rel="noopener">Cannes Lions — case Experience &amp; Brand Experience &amp; Activation</a></li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@GaryVee" target="_blank" rel="noopener">GaryVee</a> — tư duy thương hiệu, sự chú ý &amp; kích hoạt</li>
<li><a href="https://www.youtube.com/results?search_query=brand+activation+case+study" target="_blank" rel="noopener">Case kích hoạt thương hiệu</a> — Coca-Cola, Nike, Red Bull, IKEA</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma / FigJam</a> — bản đồ hành trình &amp; service blueprint</li>
<li><a href="https://miro.com/" target="_blank" rel="noopener">Miro</a> — bản đồ điểm chạm &amp; bảng đồng sáng tạo</li>
<li><a href="https://www.smaply.com/" target="_blank" rel="noopener">Smaply</a> — bản đồ hành trình &amp; chân dung khách hàng</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học (4 bước)</span>
<ol>
<li><strong>Nền tảng</strong> — kinh tế trải nghiệm, vì sao trải nghiệm hơn hàng hoá &amp; dịch vụ, khái niệm trải nghiệm thương hiệu.</li>
<li><strong>Mô hình</strong> — SEM của Schmitt (sense/feel/think/act/relate) và 4 chiều của Brakus; ánh xạ một thương hiệu thật vào từng cái.</li>
<li><strong>Thiết kế</strong> — hành trình &amp; điểm chạm, kích hoạt thương hiệu, sự kiện &amp; không gian, số &amp; phygital, cảm xúc &amp; cộng đồng.</li>
<li><strong>Đo lường</strong> — chỉ số trải nghiệm, NPS, tương tác và ROI kích hoạt; chạy và tối ưu một chiến dịch.</li>
</ol></div>`,
  ]]);

const intro = doc('bex301-0-1-overview', 'Course overview: Brand experience & activation|||Tổng quan: Trải nghiệm & kích hoạt thương hiệu',
  'Môn học làm gì; trải nghiệm thương hiệu là gì; vì sao chuyển từ bán sản phẩm sang tạo trải nghiệm; lộ trình 8 chương: khái niệm → mô hình → hành trình → kích hoạt → sự kiện → số/phygital → cảm xúc/cộng đồng → đo lường.',
  [[
    `<span class="eyebrow">BEX301 · Lesson 0.1 · Overview</span>
<h2>Brand Experience &amp; Activation Design</h2>
<p class="lead">This course teaches you to <strong>design experiences, not just messages</strong>. A brand today is felt through every touchpoint — an ad, a store, an event, an app, a pop-up. You'll learn the theory (Schmitt, Pine &amp; Gilmore, Brakus) and the craft: mapping journeys, designing <strong>brand activations</strong>, building events and phygital experiences, and measuring whether they actually work.</p>
<h3>What is brand experience?</h3>
<p>Brakus, Schmitt &amp; Zarantonello (2009) define it as the <strong>sensations, feelings, cognitions and behavioural responses</strong> evoked by a brand's design, identity, packaging, communications and environments. It is not the product — it is what the customer <em>lives through</em> around the product.</p>
<h3>Why it matters now</h3>
<p>Pine &amp; Gilmore's <em>Experience Economy</em> argues that as goods and services get commoditised, the differentiator becomes the <strong>staged experience</strong>. People pay more for, and stay loyal to, brands that make them feel something memorable.</p>
<h3>Roadmap — 8 chapters</h3>
<p>Concept &amp; experience economy → experience models (SEMs, 4 dimensions) → journeys &amp; touchpoints → brand activation design → events &amp; space → digital &amp; phygital → emotion, community &amp; co-creation → measurement &amp; ROI. Bilingual, with real activation cases (Coca-Cola, Red Bull, Nike, IKEA) and a quiz per chapter.</p>`,
    `<span class="eyebrow">BEX301 · Bài 0.1 · Tổng quan</span>
<h2>Thiết kế trải nghiệm &amp; kích hoạt thương hiệu</h2>
<p class="lead">Môn này dạy bạn <strong>thiết kế trải nghiệm, không chỉ thông điệp</strong>. Ngày nay thương hiệu được cảm qua mọi điểm chạm — một quảng cáo, một cửa hàng, một sự kiện, một app, một pop-up. Bạn học lý thuyết (Schmitt, Pine &amp; Gilmore, Brakus) và tay nghề: vẽ hành trình, thiết kế <strong>kích hoạt thương hiệu</strong>, dựng sự kiện và trải nghiệm phygital, và đo xem chúng có thật sự hiệu quả.</p>
<h3>Trải nghiệm thương hiệu là gì?</h3>
<p>Brakus, Schmitt &amp; Zarantonello (2009) định nghĩa đó là <strong>cảm giác, cảm xúc, nhận thức và phản ứng hành vi</strong> mà thiết kế, bản sắc, bao bì, truyền thông và không gian của thương hiệu khơi lên. Nó không phải sản phẩm — nó là thứ khách hàng <em>trải qua</em> quanh sản phẩm.</p>
<h3>Vì sao quan trọng lúc này</h3>
<p><em>Kinh tế trải nghiệm</em> của Pine &amp; Gilmore lập luận rằng khi hàng hoá và dịch vụ bị đại trà hoá, thứ tạo khác biệt là <strong>trải nghiệm được dàn dựng</strong>. Người ta trả nhiều hơn, và trung thành hơn, với thương hiệu khiến họ cảm thấy điều gì đó đáng nhớ.</p>
<h3>Lộ trình — 8 chương</h3>
<p>Khái niệm &amp; kinh tế trải nghiệm → mô hình trải nghiệm (SEM, 4 chiều) → hành trình &amp; điểm chạm → thiết kế kích hoạt → sự kiện &amp; không gian → số &amp; phygital → cảm xúc, cộng đồng &amp; đồng sáng tạo → đo lường &amp; ROI. Song ngữ, có case activation thật (Coca-Cola, Red Bull, Nike, IKEA) và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('bex301-1-1-brand-experience', '1.1 — What is brand experience|||1.1 — Trải nghiệm thương hiệu là gì',
  'Định nghĩa brand experience; kinh tế trải nghiệm (Pine & Gilmore: commodity→good→service→experience); vì sao trải nghiệm tạo khác biệt & lòng trung thành. Ví dụ: Starbucks "third place".',
  [[
    `<span class="eyebrow">BEX301 · Chapter 1 · Lesson 1.1</span>
<h2>What is brand experience?</h2>
<h3>The concept</h3>
<p><strong>Brand experience</strong> is the sum of everything a person senses, feels, thinks and does in response to a brand — across advertising, packaging, retail, service, digital and events. Unlike brand <em>image</em> (what people think) it centres on what people <em>live through</em>.</p>
<h3>The experience economy</h3>
<p>Pine &amp; Gilmore describe an economic progression where value climbs at each step:</p>
<pre><code>Commodity  -> extract  (coffee beans, cents)
Good       -> make     (packaged coffee)
Service    -> deliver  (a cup brewed for you)
Experience -> stage    (a memorable place & ritual)</code></pre>
<p>At the top, the offering is a <strong>memorable event</strong> the customer pays a premium for. Coffee beans cost pennies; a coffee <em>experience</em> at a well-staged café commands several dollars.</p>
<h3>Why it drives loyalty</h3>
<p>Memorable, emotional experiences are harder to copy than features and cheaper to defend than price. They build <strong>attachment</strong> — customers return not for the product alone but for how the brand makes them feel.</p>
<div class="callout"><span class="badge">Case — Starbucks "third place"</span> Starbucks doesn't sell coffee so much as a <em>third place</em> between home and work — the smell, the music, your name on the cup, comfortable seating. The staged ritual is the product; that's the experience economy in one shop.</div>`,
    `<span class="eyebrow">BEX301 · Chương 1 · Bài 1.1</span>
<h2>Trải nghiệm thương hiệu là gì?</h2>
<h3>Khái niệm</h3>
<p><strong>Trải nghiệm thương hiệu</strong> là tổng hợp mọi thứ một người cảm nhận, cảm xúc, suy nghĩ và làm khi phản ứng với thương hiệu — qua quảng cáo, bao bì, cửa hàng, dịch vụ, số và sự kiện. Khác với <em>hình ảnh</em> thương hiệu (điều người ta nghĩ), nó xoay quanh điều người ta <em>trải qua</em>.</p>
<h3>Kinh tế trải nghiệm</h3>
<p>Pine &amp; Gilmore mô tả một tiến trình kinh tế mà giá trị tăng ở mỗi bậc:</p>
<pre><code>Nguyên liệu -> khai thác (hạt cà phê, vài xu)
Hàng hoá    -> chế tạo   (cà phê đóng gói)
Dịch vụ     -> phục vụ   (một ly pha cho bạn)
Trải nghiệm -> dàn dựng  (không gian & nghi thức đáng nhớ)</code></pre>
<p>Ở bậc cao nhất, thứ được bán là một <strong>sự kiện đáng nhớ</strong> mà khách trả giá cao hơn. Hạt cà phê đáng vài xu; một <em>trải nghiệm</em> cà phê ở quán dàn dựng tốt đáng vài đô.</p>
<h3>Vì sao tạo lòng trung thành</h3>
<p>Trải nghiệm đáng nhớ, giàu cảm xúc khó sao chép hơn tính năng và rẻ để bảo vệ hơn giá. Chúng tạo <strong>sự gắn bó</strong> — khách quay lại không chỉ vì sản phẩm mà vì cảm giác thương hiệu mang lại.</p>
<div class="callout"><span class="badge">Case — Starbucks "third place"</span> Starbucks bán không hẳn cà phê mà một <em>chốn thứ ba</em> giữa nhà và công sở — mùi hương, âm nhạc, tên bạn trên ly, ghế ngồi thoải mái. Nghi thức được dàn dựng chính là sản phẩm; đó là kinh tế trải nghiệm gói trong một cửa hàng.</div>`,
  ]]);

const c1q = quiz('bex301-quiz-1', 'Quiz 1 — Brand experience|||Quiz 1 — Trải nghiệm thương hiệu', [
  { id: 'q1', question: 'Theo Pine & Gilmore, bậc giá trị cao nhất trong tiến trình kinh tế là?', options: ['Nguyên liệu (commodity)', 'Hàng hoá (good)', 'Dịch vụ (service)', 'Trải nghiệm (experience)'], correctIndex: 3, explanation: 'Commodity → good → service → experience; trải nghiệm dàn dựng ở bậc cao nhất.' },
  { id: 'q2', question: 'Brand experience khác brand image ở chỗ nó tập trung vào?', options: ['Điều người ta trải qua/cảm nhận', 'Chỉ logo và màu sắc', 'Giá bán sản phẩm', 'Số lượng cửa hàng'], correctIndex: 0, explanation: 'Trải nghiệm là thứ khách sống qua; hình ảnh là thứ họ nghĩ.' },
  { id: 'q3', question: 'Vì sao trải nghiệm tạo lòng trung thành tốt hơn cạnh tranh bằng giá?', options: ['Vì luôn rẻ hơn', 'Vì khó sao chép và tạo gắn bó cảm xúc', 'Vì không tốn chi phí', 'Vì không cần đo lường'], correctIndex: 1, explanation: 'Trải nghiệm cảm xúc khó copy và tạo attachment, bền hơn giảm giá.' },
]);

const c2 = doc('bex301-2-1-experience-models', '2.1 — Experience models: SEMs & dimensions|||2.1 — Mô hình trải nghiệm: SEM & các chiều',
  'Schmitt SEMs: sense/feel/think/act/relate. Brakus 4 chiều: sensory/affective/intellectual/behavioral. Cách dùng module làm lăng kính thiết kế. Ví dụ: Apple Store (sense+act), Nike+ (act+relate).',
  [[
    `<span class="eyebrow">BEX301 · Chapter 2 · Lesson 2.1</span>
<h2>Experience models</h2>
<h3>Schmitt's Strategic Experiential Modules (SEMs)</h3>
<p>Schmitt breaks experience into five modules you can design for deliberately:</p>
<ul>
<li><strong>Sense</strong> — sight, sound, smell, taste, touch (sensory appeal).</li>
<li><strong>Feel</strong> — moods and emotions (from mild positive feeling to strong pride/joy).</li>
<li><strong>Think</strong> — curiosity, surprise, problem-solving (engaging the intellect).</li>
<li><strong>Act</strong> — bodily actions, behaviours, lifestyles (getting people to <em>do</em>).</li>
<li><strong>Relate</strong> — connecting to a group, culture or aspirational self.</li>
</ul>
<h3>Brakus's four dimensions</h3>
<p>The academic brand-experience scale (2009) measures four dimensions — a cleaner lens for research and audit:</p>
<pre><code>Sensory       -> does the brand make a strong impression on the senses?
Affective     -> does it induce feelings & emotions?
Intellectual  -> does it make me think / stimulate curiosity?
Behavioral    -> does it result in bodily actions & behaviours?</code></pre>
<h3>Using the modules</h3>
<p>Treat each module as a design lens: for a launch, decide which modules you'll lead with, then design touchpoints that hit them. Strong experiences usually combine several.</p>
<div class="callout"><span class="badge">Case — Apple Store &amp; Nike</span> An <strong>Apple Store</strong> designs <em>sense</em> (clean materials, light, touchable devices) + <em>act</em> (try everything) + <em>relate</em> (Genius Bar community). <strong>Nike Run Club</strong> leads with <em>act</em> (run) + <em>relate</em> (join runners) + <em>feel</em> (achievement).</div>`,
    `<span class="eyebrow">BEX301 · Chương 2 · Bài 2.1</span>
<h2>Mô hình trải nghiệm</h2>
<h3>Các module trải nghiệm chiến lược (SEM) của Schmitt</h3>
<p>Schmitt chia trải nghiệm thành năm module bạn có thể thiết kế có chủ đích:</p>
<ul>
<li><strong>Sense (Giác quan)</strong> — nhìn, nghe, ngửi, nếm, chạm (hấp dẫn giác quan).</li>
<li><strong>Feel (Cảm xúc)</strong> — tâm trạng và cảm xúc (từ dễ chịu nhẹ đến tự hào/vui mạnh).</li>
<li><strong>Think (Tư duy)</strong> — tò mò, bất ngờ, giải đố (cuốn hút trí tuệ).</li>
<li><strong>Act (Hành động)</strong> — hành vi cơ thể, thói quen, lối sống (khiến người ta <em>làm</em>).</li>
<li><strong>Relate (Kết nối)</strong> — gắn với một nhóm, văn hoá hay bản thân khát vọng.</li>
</ul>
<h3>Bốn chiều của Brakus</h3>
<p>Thang đo trải nghiệm thương hiệu học thuật (2009) đo bốn chiều — lăng kính gọn để nghiên cứu và rà soát:</p>
<pre><code>Giác quan (sensory)   -> thương hiệu gây ấn tượng mạnh lên giác quan?
Cảm xúc (affective)   -> nó khơi cảm xúc & tình cảm?
Trí tuệ (intellectual)-> nó khiến tôi suy nghĩ / kích thích tò mò?
Hành vi (behavioral)  -> nó dẫn tới hành động & hành vi cơ thể?</code></pre>
<h3>Dùng các module</h3>
<p>Xem mỗi module là một lăng kính thiết kế: cho một đợt ra mắt, chọn module dẫn dắt rồi thiết kế điểm chạm đánh trúng chúng. Trải nghiệm mạnh thường kết hợp nhiều module.</p>
<div class="callout"><span class="badge">Case — Apple Store &amp; Nike</span> <strong>Apple Store</strong> thiết kế <em>sense</em> (chất liệu sạch, ánh sáng, thiết bị chạm được) + <em>act</em> (thử mọi thứ) + <em>relate</em> (cộng đồng Genius Bar). <strong>Nike Run Club</strong> dẫn bằng <em>act</em> (chạy) + <em>relate</em> (nhập hội runner) + <em>feel</em> (cảm giác chinh phục).</div>`,
  ]]);

const c2q = quiz('bex301-quiz-2', 'Quiz 2 — Experience models|||Quiz 2 — Mô hình trải nghiệm', [
  { id: 'q1', question: 'Năm module SEM của Schmitt là?', options: ['See/hear/smell/taste/touch', 'Sense/feel/think/act/relate', 'Plan/do/check/act/review', 'Awareness/interest/desire/action/loyalty'], correctIndex: 1, explanation: 'SEM = Sense, Feel, Think, Act, Relate.' },
  { id: 'q2', question: 'Chiều nào trong 4 chiều Brakus đo "khiến tôi suy nghĩ / tò mò"?', options: ['Sensory (giác quan)', 'Affective (cảm xúc)', 'Intellectual (trí tuệ)', 'Behavioral (hành vi)'], correctIndex: 2, explanation: 'Intellectual = kích thích tư duy, tò mò.' },
  { id: 'q3', question: 'Module "Relate" của Schmitt hướng tới?', options: ['Kích thích giác quan', 'Kết nối với nhóm/văn hoá/bản thân khát vọng', 'Giảm giá sản phẩm', 'Đo lường ROI'], correctIndex: 1, explanation: 'Relate gắn cá nhân với một cộng đồng hay bản sắc lớn hơn.' },
]);

const c3 = doc('bex301-3-1-journey-touchpoints', '3.1 — Journeys & touchpoints|||3.1 — Hành trình & điểm chạm',
  'Customer journey (awareness→consideration→purchase→use→loyalty/advocacy); touchpoints & channels; moments of truth (ZMOT/FMOT); service blueprint (frontstage/backstage). Ví dụ: IKEA journey.',
  [[
    `<span class="eyebrow">BEX301 · Chapter 3 · Lesson 3.1</span>
<h2>Journeys &amp; touchpoints</h2>
<h3>The customer journey</h3>
<p>An experience is lived <em>over time</em>. Map it as stages:</p>
<pre><code>Awareness -> Consideration -> Purchase -> Use -> Loyalty / Advocacy</code></pre>
<p>At each stage the customer has goals, questions and emotions — and meets the brand at <strong>touchpoints</strong>.</p>
<h3>Touchpoints &amp; channels</h3>
<p>A <strong>touchpoint</strong> is any point of contact — an ad, a website, a store shelf, a delivery box, a support chat, an event. They span owned, earned and paid channels. Good design makes them <em>consistent</em> and removes friction where the customer struggles.</p>
<h3>Moments of truth</h3>
<ul>
<li><strong>ZMOT</strong> (Zero Moment of Truth) — the online research before buying.</li>
<li><strong>FMOT</strong> — the first encounter with the product (the shelf / the unboxing).</li>
<li><strong>SMOT</strong> — the ongoing experience of using it.</li>
</ul>
<h3>Service blueprint</h3>
<p>A <strong>service blueprint</strong> extends the journey map: above the "line of visibility" is what the customer sees (<em>frontstage</em>); below it are staff actions and systems (<em>backstage</em>) that make each moment happen. It reveals where an experience will break.</p>
<div class="callout"><span class="badge">Case — IKEA journey</span> IKEA choreographs a whole journey: inspiring room sets → the guided showroom path → self-serve warehouse → the famous meatballs (a <em>feel</em> break) → flat-pack pickup → build-it-yourself at home (the IKEA effect: you value what you assemble). Each stage is a designed touchpoint.</div>`,
    `<span class="eyebrow">BEX301 · Chương 3 · Bài 3.1</span>
<h2>Hành trình &amp; điểm chạm</h2>
<h3>Hành trình khách hàng</h3>
<p>Trải nghiệm diễn ra <em>theo thời gian</em>. Vẽ nó thành các giai đoạn:</p>
<pre><code>Nhận biết -> Cân nhắc -> Mua -> Sử dụng -> Trung thành / Lan toả</code></pre>
<p>Ở mỗi giai đoạn khách có mục tiêu, câu hỏi và cảm xúc — và gặp thương hiệu tại các <strong>điểm chạm</strong>.</p>
<h3>Điểm chạm &amp; kênh</h3>
<p><strong>Điểm chạm</strong> là mọi điểm tiếp xúc — một quảng cáo, một website, một kệ hàng, một hộp giao, một chat hỗ trợ, một sự kiện. Chúng trải trên kênh sở hữu, lan truyền và trả phí. Thiết kế tốt làm chúng <em>nhất quán</em> và gỡ ma sát ở nơi khách gặp khó.</p>
<h3>Khoảnh khắc quyết định (moments of truth)</h3>
<ul>
<li><strong>ZMOT</strong> — khoảnh khắc tìm hiểu online trước khi mua.</li>
<li><strong>FMOT</strong> — lần đầu chạm sản phẩm (kệ hàng / mở hộp).</li>
<li><strong>SMOT</strong> — trải nghiệm dùng sản phẩm về sau.</li>
</ul>
<h3>Service blueprint</h3>
<p><strong>Service blueprint</strong> mở rộng bản đồ hành trình: phía trên "đường tầm nhìn" là thứ khách thấy (<em>frontstage</em>); phía dưới là hành động nhân viên và hệ thống (<em>backstage</em>) làm cho mỗi khoảnh khắc xảy ra. Nó chỉ ra nơi trải nghiệm sẽ vỡ.</p>
<div class="callout"><span class="badge">Case — hành trình IKEA</span> IKEA dàn dựng cả hành trình: các phòng mẫu gợi cảm hứng → lối đi showroom dẫn dắt → kho tự lấy → món thịt viên trứ danh (một quãng <em>feel</em>) → nhận hàng phẳng → tự lắp ở nhà (hiệu ứng IKEA: bạn quý thứ mình tự ráp). Mỗi giai đoạn là một điểm chạm được thiết kế.</div>`,
  ]]);

const c3q = quiz('bex301-quiz-3', 'Quiz 3 — Journeys & touchpoints|||Quiz 3 — Hành trình & điểm chạm', [
  { id: 'q1', question: 'Thứ tự đúng của các giai đoạn hành trình khách hàng?', options: ['Mua → Nhận biết → Sử dụng → Cân nhắc', 'Nhận biết → Cân nhắc → Mua → Sử dụng → Trung thành', 'Sử dụng → Mua → Nhận biết → Lan toả', 'Cân nhắc → Trung thành → Mua → Nhận biết'], correctIndex: 1, explanation: 'Awareness → consideration → purchase → use → loyalty/advocacy.' },
  { id: 'q2', question: '"ZMOT" (Zero Moment of Truth) là?', options: ['Lúc mở hộp sản phẩm', 'Khoảnh khắc tìm hiểu online trước khi mua', 'Lúc bỏ đi thương hiệu', 'Lúc thanh toán tại quầy'], correctIndex: 1, explanation: 'ZMOT = giai đoạn nghiên cứu trực tuyến trước quyết định mua.' },
  { id: 'q3', question: 'Trong service blueprint, phần "backstage" là?', options: ['Thứ khách hàng nhìn thấy', 'Hành động nhân viên & hệ thống ẩn phía sau', 'Quảng cáo trả phí', 'Chỉ số NPS'], correctIndex: 1, explanation: 'Backstage nằm dưới đường tầm nhìn: quy trình/hệ thống làm nên khoảnh khắc.' },
]);

const c4 = doc('bex301-4-1-brand-activation', '4.1 — Designing brand activation|||4.1 — Thiết kế kích hoạt thương hiệu',
  'Brand activation là gì; experiential campaign; đặt mục tiêu SMART (awareness/trial/engagement/advocacy); big idea & cơ chế tham gia; đo bằng KPI. Ví dụ: Coca-Cola "Share a Coke", Red Bull Stratos.',
  [[
    `<span class="eyebrow">BEX301 · Chapter 4 · Lesson 4.1</span>
<h2>Designing brand activation</h2>
<h3>What is brand activation?</h3>
<p><strong>Brand activation</strong> is a campaign that brings a brand to life through direct, participatory interaction — getting people to <em>do</em> something with the brand rather than just see a message. It turns brand values into a lived moment.</p>
<h3>The design process</h3>
<ol>
<li><strong>Objective</strong> — set a SMART goal: awareness, product <em>trial</em>, engagement, data capture, or advocacy.</li>
<li><strong>Insight &amp; big idea</strong> — a human truth the brand can own, expressed as one memorable idea.</li>
<li><strong>Mechanic</strong> — how people participate (a challenge, a personalisation, a giveaway, a stunt).</li>
<li><strong>Amplification</strong> — how the live moment spreads (earned media, social, UGC).</li>
<li><strong>Measurement</strong> — KPIs tied to the objective (reach, participation, trials, sentiment).</li>
</ol>
<h3>Live + amplified</h3>
<p>The best activations are engineered to be <strong>shared</strong>: the physical moment reaches thousands, the content of it reaches millions.</p>
<div class="callout"><span class="badge">Cases — Coca-Cola &amp; Red Bull</span> <strong>Coca-Cola "Share a Coke"</strong> replaced the logo with names — a personal <em>mechanic</em> that drove trial and millions of shared photos. <strong>Red Bull Stratos</strong> (a jump from the stratosphere) was a stunt built to embody "gives you wings" — 8M live YouTube viewers, earned media worldwide.</div>`,
    `<span class="eyebrow">BEX301 · Chương 4 · Bài 4.1</span>
<h2>Thiết kế kích hoạt thương hiệu</h2>
<h3>Kích hoạt thương hiệu là gì?</h3>
<p><strong>Kích hoạt thương hiệu (brand activation)</strong> là chiến dịch làm thương hiệu sống dậy qua tương tác trực tiếp, có tham gia — khiến người ta <em>làm</em> điều gì đó với thương hiệu thay vì chỉ xem thông điệp. Nó biến giá trị thương hiệu thành một khoảnh khắc được sống.</p>
<h3>Quy trình thiết kế</h3>
<ol>
<li><strong>Mục tiêu</strong> — đặt mục tiêu SMART: nhận biết, <em>dùng thử</em>, tương tác, thu dữ liệu, hay lan toả.</li>
<li><strong>Insight &amp; big idea</strong> — một sự thật con người thương hiệu sở hữu được, gói thành một ý tưởng đáng nhớ.</li>
<li><strong>Cơ chế tham gia</strong> — cách người ta tham gia (một thử thách, một cá nhân hoá, một quà tặng, một cú stunt).</li>
<li><strong>Khuếch đại</strong> — cách khoảnh khắc trực tiếp lan ra (earned media, mạng xã hội, UGC).</li>
<li><strong>Đo lường</strong> — KPI gắn với mục tiêu (tiếp cận, lượt tham gia, dùng thử, cảm xúc).</li>
</ol>
<h3>Trực tiếp + khuếch đại</h3>
<p>Activation hay nhất được thiết kế để <strong>chia sẻ</strong>: khoảnh khắc vật lý chạm tới hàng nghìn người, nội dung của nó chạm tới hàng triệu.</p>
<div class="callout"><span class="badge">Case — Coca-Cola &amp; Red Bull</span> <strong>Coca-Cola "Share a Coke"</strong> thay logo bằng tên người — một <em>cơ chế</em> cá nhân thúc đẩy dùng thử và hàng triệu ảnh chia sẻ. <strong>Red Bull Stratos</strong> (cú nhảy từ tầng bình lưu) là stunt dựng để thể hiện "chắp cánh cho bạn" — 8 triệu người xem trực tiếp YouTube, earned media toàn cầu.</div>`,
  ]]);

const c4q = quiz('bex301-quiz-4', 'Quiz 4 — Brand activation|||Quiz 4 — Kích hoạt thương hiệu', [
  { id: 'q1', question: 'Điểm cốt lõi phân biệt brand activation với quảng cáo thường là?', options: ['Rẻ hơn', 'Có tương tác/tham gia trực tiếp — khiến người ta LÀM', 'Chỉ chạy trên TV', 'Không cần mục tiêu'], correctIndex: 1, explanation: 'Activation là tương tác có tham gia, biến giá trị thành khoảnh khắc được sống.' },
  { id: 'q2', question: 'Chiến dịch "Share a Coke" thúc đẩy tham gia bằng cơ chế nào?', options: ['Giảm giá 50%', 'Cá nhân hoá — thay logo bằng tên người', 'Rút thăm trúng xe', 'Đổi bao bì sang lon nhôm'], correctIndex: 1, explanation: 'Cơ chế cá nhân hoá tên tạo trial và hàng triệu lượt chia sẻ.' },
  { id: 'q3', question: 'Bước đầu tiên nên có khi thiết kế một activation là?', options: ['Chọn màu banner', 'Đặt mục tiêu SMART (awareness/trial/engagement...)', 'Thuê KOL', 'In tờ rơi'], correctIndex: 1, explanation: 'Mục tiêu rõ ràng dẫn dắt big idea, cơ chế và KPI đo lường.' },
]);

const c5 = doc('bex301-5-1-events-space', '5.1 — Event & spatial experience|||5.1 — Trải nghiệm sự kiện & không gian',
  'Event marketing; pop-up store; retail & space design; atmospherics & sensory (ánh sáng, âm thanh, mùi); flagship & concept store. Ví dụ: Nike House of Innovation, Coca-Cola pop-up.',
  [[
    `<span class="eyebrow">BEX301 · Chapter 5 · Lesson 5.1</span>
<h2>Event &amp; spatial experience</h2>
<h3>Event marketing</h3>
<p>An <strong>event</strong> — a launch, festival, roadshow or sponsorship — creates a concentrated, live brand experience. It gives people a reason to gather, a story to share, and a physical memory. Design it as a journey with arrival, peak moment and take-away.</p>
<h3>Pop-ups &amp; retail space</h3>
<p>A <strong>pop-up store</strong> is a temporary, high-impact space that creates scarcity and buzz. A <strong>flagship / concept store</strong> is a permanent stage for the brand — retail as theatre, not just shelves.</p>
<h3>Atmospherics &amp; the senses</h3>
<p>Space is designed through <strong>atmospherics</strong> — the deliberate use of the senses:</p>
<ul>
<li><strong>Sight</strong> — light, colour, layout, sightlines.</li>
<li><strong>Sound</strong> — music tempo and volume shape pace and mood.</li>
<li><strong>Smell</strong> — scent branding (a signature aroma) triggers memory.</li>
<li><strong>Touch</strong> — materials, product handling, comfort.</li>
</ul>
<p>Together they set how long people stay, how they feel and what they remember.</p>
<div class="callout"><span class="badge">Case — Nike &amp; Coca-Cola spaces</span> <strong>Nike House of Innovation</strong> turns a store into an interactive playground — try, customise, scan-to-buy. Coca-Cola's <strong>pop-up experiences</strong> (happiness machines, branded lounges at events) stage a feel-good moment people queue for and film.</div>`,
    `<span class="eyebrow">BEX301 · Chương 5 · Bài 5.1</span>
<h2>Trải nghiệm sự kiện &amp; không gian</h2>
<h3>Tiếp thị sự kiện</h3>
<p>Một <strong>sự kiện</strong> — ra mắt, festival, roadshow hay tài trợ — tạo trải nghiệm thương hiệu trực tiếp, cô đọng. Nó cho người ta lý do tụ họp, câu chuyện để kể và một ký ức vật lý. Thiết kế nó như một hành trình có lúc đến, cao trào và thứ mang về.</p>
<h3>Pop-up &amp; không gian bán lẻ</h3>
<p><strong>Pop-up store</strong> là không gian tạm thời, tác động mạnh, tạo sự khan hiếm và bàn tán. <strong>Flagship / concept store</strong> là sân khấu thường trực cho thương hiệu — bán lẻ như một vở kịch, không chỉ là kệ hàng.</p>
<h3>Atmospherics &amp; giác quan</h3>
<p>Không gian được thiết kế qua <strong>atmospherics</strong> — dùng giác quan có chủ đích:</p>
<ul>
<li><strong>Thị giác</strong> — ánh sáng, màu, bố cục, tầm nhìn.</li>
<li><strong>Âm thanh</strong> — nhịp và âm lượng nhạc định nhịp bước và tâm trạng.</li>
<li><strong>Khứu giác</strong> — mùi thương hiệu (một hương đặc trưng) khơi ký ức.</li>
<li><strong>Xúc giác</strong> — chất liệu, cầm nắm sản phẩm, sự thoải mái.</li>
</ul>
<p>Cùng nhau chúng quyết định người ta ở lại bao lâu, cảm thấy thế nào và nhớ gì.</p>
<div class="callout"><span class="badge">Case — không gian Nike &amp; Coca-Cola</span> <strong>Nike House of Innovation</strong> biến cửa hàng thành sân chơi tương tác — thử, cá nhân hoá, quét-để-mua. Các <strong>pop-up</strong> của Coca-Cola (máy hạnh phúc, lounge thương hiệu tại sự kiện) dàn dựng khoảnh khắc vui mà người ta xếp hàng và quay phim.</div>`,
  ]]);

const c5q = quiz('bex301-quiz-5', 'Quiz 5 — Event & space|||Quiz 5 — Sự kiện & không gian', [
  { id: 'q1', question: '"Atmospherics" trong thiết kế không gian bán lẻ là?', options: ['Dự báo thời tiết', 'Dùng có chủ đích ánh sáng/âm thanh/mùi/chất liệu', 'Giá thuê mặt bằng', 'Số nhân viên bán hàng'], correctIndex: 1, explanation: 'Atmospherics = điều khiển giác quan để tạo tâm trạng và hành vi.' },
  { id: 'q2', question: 'Ưu điểm chính của một pop-up store là?', options: ['Tồn tại vĩnh viễn', 'Tạo khan hiếm & bàn tán, tác động mạnh trong thời gian ngắn', 'Không cần thiết kế', 'Chỉ bán online'], correctIndex: 1, explanation: 'Pop-up tạm thời, tạo scarcity và buzz.' },
  { id: 'q3', question: 'Yếu tố giác quan nào đặc biệt gắn với ký ức (scent branding)?', options: ['Thị giác', 'Xúc giác', 'Khứu giác (mùi)', 'Vị giác'], correctIndex: 2, explanation: 'Mùi (khứu giác) kích hoạt trí nhớ mạnh — nền của scent branding.' },
]);

const c6 = doc('bex301-6-1-digital-phygital', '6.1 — Digital & phygital experience|||6.1 — Trải nghiệm số & phygital',
  'Digital experience (web/app/social); AR/VR & immersive; gamification (điểm/huy hiệu/thử thách); phygital (nối vật lý ↔ số qua QR/app). Ví dụ: Pepsi AR bus shelter, Nike Run Club app, Pokémon GO.',
  [[
    `<span class="eyebrow">BEX301 · Chapter 6 · Lesson 6.1</span>
<h2>Digital &amp; phygital experience</h2>
<h3>Digital experience</h3>
<p>Websites, apps, and social are experience surfaces too — designed for speed, clarity and delight, not just information. The screen is often the <em>first</em> brand experience a person has.</p>
<h3>Immersive: AR / VR</h3>
<p><strong>AR</strong> overlays brand content on the real world through a phone; <strong>VR</strong> transports the user into a fully staged environment. Both create high <em>sense</em> and <em>think</em> engagement and generate shareable moments.</p>
<h3>Gamification</h3>
<p><strong>Gamification</strong> applies game mechanics — points, badges, levels, streaks, challenges, leaderboards — to non-game experiences to drive participation and repeat behaviour (the <em>act</em> module at scale).</p>
<h3>Phygital</h3>
<p><strong>Phygital</strong> fuses physical and digital into one seamless experience: a QR code on a package that unlocks content, a store you browse with an app, an event whose moments continue online. The goal is one continuous journey, not two disconnected worlds.</p>
<div class="callout"><span class="badge">Cases — AR, apps &amp; games</span> <strong>Pepsi Max "Unbelievable" bus shelter</strong> used AR to show aliens and tigers on a real London street — a viral sense-of-wonder stunt. <strong>Nike Run Club</strong> gamifies running (streaks, badges, challenges). <strong>Pokémon GO</strong> is phygital at planetary scale — digital creatures anchored to real places, driving people to move and to sponsored locations.</div>`,
    `<span class="eyebrow">BEX301 · Chương 6 · Bài 6.1</span>
<h2>Trải nghiệm số &amp; phygital</h2>
<h3>Trải nghiệm số</h3>
<p>Website, app và mạng xã hội cũng là bề mặt trải nghiệm — thiết kế cho tốc độ, sự rõ ràng và thích thú, không chỉ để đưa thông tin. Màn hình thường là trải nghiệm thương hiệu <em>đầu tiên</em> một người có.</p>
<h3>Đắm chìm: AR / VR</h3>
<p><strong>AR</strong> phủ nội dung thương hiệu lên thế giới thật qua điện thoại; <strong>VR</strong> đưa người dùng vào một môi trường dàn dựng hoàn toàn. Cả hai tạo tương tác <em>sense</em> và <em>think</em> cao và sinh khoảnh khắc dễ chia sẻ.</p>
<h3>Gamification (trò chơi hoá)</h3>
<p><strong>Gamification</strong> áp cơ chế game — điểm, huy hiệu, cấp bậc, chuỗi ngày, thử thách, bảng xếp hạng — vào trải nghiệm phi game để thúc đẩy tham gia và hành vi lặp lại (module <em>act</em> ở quy mô lớn).</p>
<h3>Phygital</h3>
<p><strong>Phygital</strong> hợp nhất vật lý và số thành một trải nghiệm liền mạch: một mã QR trên bao bì mở ra nội dung, một cửa hàng bạn duyệt bằng app, một sự kiện có khoảnh khắc tiếp diễn online. Mục tiêu là một hành trình liên tục, không phải hai thế giới rời rạc.</p>
<div class="callout"><span class="badge">Case — AR, app &amp; game</span> <strong>Pepsi Max "Unbelievable" bus shelter</strong> dùng AR chiếu người ngoài hành tinh và hổ trên một con phố London thật — cú stunt tạo kinh ngạc viral. <strong>Nike Run Club</strong> trò chơi hoá việc chạy (chuỗi ngày, huy hiệu, thử thách). <strong>Pokémon GO</strong> là phygital ở quy mô toàn cầu — sinh vật số neo vào địa điểm thật, đưa người ta di chuyển và tới các điểm tài trợ.</div>`,
  ]]);

const c6q = quiz('bex301-quiz-6', 'Quiz 6 — Digital & phygital|||Quiz 6 — Số & phygital', [
  { id: 'q1', question: '"Phygital" nghĩa là?', options: ['Chỉ trải nghiệm vật lý', 'Chỉ trải nghiệm số', 'Hợp nhất vật lý & số thành một hành trình liền mạch', 'Một loại thẻ thanh toán'], correctIndex: 2, explanation: 'Phygital nối vật lý ↔ số (vd QR, app trong cửa hàng) thành trải nghiệm liên tục.' },
  { id: 'q2', question: 'Gamification áp cơ chế nào để thúc đẩy tham gia?', options: ['Điểm, huy hiệu, thử thách, bảng xếp hạng', 'Giảm giá cố định', 'Quảng cáo TV', 'Đường dây nóng'], correctIndex: 0, explanation: 'Points/badges/streaks/challenges/leaderboards — cơ chế game áp vào phi game.' },
  { id: 'q3', question: 'Khác biệt giữa AR và VR là?', options: ['AR đưa người dùng vào môi trường ảo hoàn toàn', 'AR phủ nội dung lên thế giới thật; VR đưa vào môi trường dựng hoàn toàn', 'Hai cái giống hệt nhau', 'VR chỉ chạy trên giấy'], correctIndex: 1, explanation: 'AR = phủ lên thực tại; VR = thay hẳn bằng môi trường ảo.' },
]);

const c7 = doc('bex301-7-1-emotion-community', '7.1 — Emotion, community & interaction|||7.1 — Cảm xúc, cộng đồng & tương tác',
  'Emotional engagement & peak-end rule; brand community & belonging; co-creation; user-generated content (UGC). Ví dụ: Apple/Harley community, GoPro & Starbucks UGC, LEGO Ideas co-creation.',
  [[
    `<span class="eyebrow">BEX301 · Chapter 7 · Lesson 7.1</span>
<h2>Emotion, community &amp; interaction</h2>
<h3>Emotional engagement</h3>
<p>People remember how an experience made them <em>feel</em>. The <strong>peak-end rule</strong> says memory is dominated by the most intense moment (the peak) and the ending — so design a clear emotional peak and a strong finish, not a flat average.</p>
<h3>Brand community &amp; belonging</h3>
<p>A <strong>brand community</strong> turns customers into members who identify with each other and the brand. Belonging deepens loyalty far beyond the transaction — the <em>relate</em> module lived out over time.</p>
<h3>Co-creation</h3>
<p><strong>Co-creation</strong> invites customers to help shape the product or experience — voting, submitting ideas, designing. It builds ownership: people value and defend what they helped make.</p>
<h3>User-generated content (UGC)</h3>
<p><strong>UGC</strong> is content customers create about the brand. It is trusted (peer, not ad), scalable and free — and it is the natural amplifier of any good activation. Design experiences that are <em>worth</em> sharing.</p>
<div class="callout"><span class="badge">Cases — community, UGC &amp; co-creation</span> <strong>Harley-Davidson &amp; Apple</strong> built identity communities people wear and defend. <strong>GoPro</strong> is powered almost entirely by UGC (customers film the ads). <strong>Starbucks #RedCupContest</strong> turns customers into content engines. <strong>LEGO Ideas</strong> lets fans design sets that get manufactured — co-creation as a product pipeline.</div>`,
    `<span class="eyebrow">BEX301 · Chương 7 · Bài 7.1</span>
<h2>Cảm xúc, cộng đồng &amp; tương tác</h2>
<h3>Gắn kết cảm xúc</h3>
<p>Người ta nhớ trải nghiệm khiến họ <em>cảm thấy</em> thế nào. <strong>Quy tắc đỉnh-kết (peak-end rule)</strong> nói ký ức bị chi phối bởi khoảnh khắc mạnh nhất (đỉnh) và đoạn kết — nên hãy thiết kế một đỉnh cảm xúc rõ và một cái kết mạnh, đừng để phẳng lì.</p>
<h3>Cộng đồng thương hiệu &amp; sự thuộc về</h3>
<p><strong>Cộng đồng thương hiệu</strong> biến khách hàng thành thành viên đồng nhất với nhau và với thương hiệu. Sự thuộc về đào sâu lòng trung thành vượt xa giao dịch — module <em>relate</em> được sống theo thời gian.</p>
<h3>Đồng sáng tạo (co-creation)</h3>
<p><strong>Đồng sáng tạo</strong> mời khách hàng góp phần định hình sản phẩm hay trải nghiệm — bỏ phiếu, gửi ý tưởng, thiết kế. Nó tạo quyền sở hữu: người ta quý và bảo vệ thứ mình góp làm.</p>
<h3>Nội dung do người dùng tạo (UGC)</h3>
<p><strong>UGC</strong> là nội dung khách hàng tạo về thương hiệu. Nó đáng tin (đồng trang lứa, không phải quảng cáo), mở rộng được và miễn phí — và là bộ khuếch đại tự nhiên của mọi activation tốt. Hãy thiết kế trải nghiệm <em>đáng</em> chia sẻ.</p>
<div class="callout"><span class="badge">Case — cộng đồng, UGC &amp; đồng sáng tạo</span> <strong>Harley-Davidson &amp; Apple</strong> dựng cộng đồng bản sắc mà người ta mặc lên người và bảo vệ. <strong>GoPro</strong> gần như chạy hoàn toàn bằng UGC (khách quay quảng cáo hộ). <strong>Starbucks #RedCupContest</strong> biến khách thành cỗ máy nội dung. <strong>LEGO Ideas</strong> cho fan thiết kế bộ đồ chơi được sản xuất — đồng sáng tạo như một dây chuyền sản phẩm.</div>`,
  ]]);

const c7q = quiz('bex301-quiz-7', 'Quiz 7 — Emotion & community|||Quiz 7 — Cảm xúc & cộng đồng', [
  { id: 'q1', question: 'Quy tắc "peak-end" nói ký ức trải nghiệm bị chi phối bởi?', options: ['Trung bình toàn bộ trải nghiệm', 'Khoảnh khắc mạnh nhất (đỉnh) và đoạn kết', 'Chỉ đoạn mở đầu', 'Giá tiền đã trả'], correctIndex: 1, explanation: 'Peak-end: nhớ chủ yếu qua đỉnh cảm xúc và cái kết.' },
  { id: 'q2', question: 'Vì sao UGC (nội dung người dùng tạo) hiệu quả?', options: ['Vì do thương hiệu tự làm', 'Vì đáng tin (đồng trang lứa), mở rộng được & miễn phí', 'Vì luôn trả phí cao', 'Vì không ai chia sẻ'], correctIndex: 1, explanation: 'UGC là tiếng nói ngang hàng, đáng tin và tự khuếch đại.' },
  { id: 'q3', question: 'LEGO Ideas là ví dụ điển hình của?', options: ['Chỉ quảng cáo TV', 'Đồng sáng tạo (co-creation) — fan thiết kế sản phẩm được sản xuất', 'Pop-up store', 'Chỉnh lưu tín hiệu'], correctIndex: 1, explanation: 'LEGO Ideas cho fan góp thiết kế → co-creation tạo quyền sở hữu.' },
]);

const c8 = doc('bex301-8-1-measurement-roi', '8.1 — Measuring & optimising experience|||8.1 — Đo lường & tối ưu trải nghiệm',
  'Experience metrics (CSAT, CES, NPS); engagement metrics (reach, participation, dwell, UGC, sentiment); activation ROI (cost per engagement, earned media value, trial→sale); test & optimise. Ví dụ: NPS vòng lặp.',
  [[
    `<span class="eyebrow">BEX301 · Chapter 8 · Lesson 8.1</span>
<h2>Measuring &amp; optimising experience</h2>
<h3>Experience metrics</h3>
<ul>
<li><strong>CSAT</strong> (Customer Satisfaction) — how satisfied with a specific interaction.</li>
<li><strong>CES</strong> (Customer Effort Score) — how easy was it (low effort = better).</li>
<li><strong>NPS</strong> (Net Promoter Score) — "how likely to recommend?" 0–10; %Promoters − %Detractors. A loyalty/advocacy proxy.</li>
</ul>
<h3>Engagement metrics for activations</h3>
<p>Reach, participation/interactions, dwell time, UGC volume, hashtag use, sentiment, and share of conversation. These tell you whether the live moment landed and spread.</p>
<h3>Activation ROI</h3>
<pre><code>Cost per engagement   = spend / interactions
Earned media value    = value of coverage the stunt generated for free
Conversion            = trials -> sales attributable to the activation
ROI                   = (value generated - cost) / cost</code></pre>
<h3>Test &amp; optimise</h3>
<p>Experience is iterative: measure against the objective, find the weak touchpoint or the flat emotional moment, A/B test a fix, and re-measure. Close the loop rather than declaring victory at launch.</p>
<div class="callout"><span class="badge">Loop — measure to improve</span> An <strong>NPS</strong> programme isn't a score to frame — it's a loop: survey → find detractors' broken touchpoint → fix it → survey again. The metric only matters if it drives a change to the experience.</div>`,
    `<span class="eyebrow">BEX301 · Chương 8 · Bài 8.1</span>
<h2>Đo lường &amp; tối ưu trải nghiệm</h2>
<h3>Chỉ số trải nghiệm</h3>
<ul>
<li><strong>CSAT</strong> (mức hài lòng) — hài lòng thế nào với một tương tác cụ thể.</li>
<li><strong>CES</strong> (mức nỗ lực) — dễ đến đâu (ít nỗ lực = tốt hơn).</li>
<li><strong>NPS</strong> (điểm thiện cảm ròng) — "khả năng giới thiệu?" 0–10; %Ủng hộ − %Chê. Đại diện cho trung thành/lan toả.</li>
</ul>
<h3>Chỉ số tương tác cho activation</h3>
<p>Tiếp cận, lượt tham gia/tương tác, thời gian lưu lại, lượng UGC, lượt dùng hashtag, cảm xúc (sentiment) và tỉ trọng bàn tán. Chúng cho biết khoảnh khắc trực tiếp có trúng và có lan không.</p>
<h3>ROI của activation</h3>
<pre><code>Chi phí mỗi tương tác = ngân sách / số tương tác
Earned media value    = giá trị đưa tin miễn phí mà stunt tạo ra
Chuyển đổi            = dùng thử -> mua quy về được cho activation
ROI                   = (giá trị tạo ra - chi phí) / chi phí</code></pre>
<h3>Thử nghiệm &amp; tối ưu</h3>
<p>Trải nghiệm là lặp: đo theo mục tiêu, tìm điểm chạm yếu hay khoảnh khắc cảm xúc phẳng, A/B test một cách sửa, rồi đo lại. Đóng vòng lặp thay vì tuyên bố thắng lợi ngay lúc ra mắt.</p>
<div class="callout"><span class="badge">Vòng lặp — đo để cải thiện</span> Một chương trình <strong>NPS</strong> không phải điểm số để đóng khung — nó là vòng lặp: khảo sát → tìm điểm chạm hỏng của người chê → sửa → khảo sát lại. Chỉ số chỉ có nghĩa nếu nó dẫn tới thay đổi trải nghiệm.</div>`,
  ]]);

const c8q = quiz('bex301-quiz-8', 'Quiz 8 — Measurement & ROI|||Quiz 8 — Đo lường & ROI', [
  { id: 'q1', question: 'NPS (Net Promoter Score) được tính bằng?', options: ['%Ủng hộ + %Chê', '%Ủng hộ − %Chê', 'Tổng doanh thu / chi phí', 'Số lượt xem quảng cáo'], correctIndex: 1, explanation: 'NPS = %Promoters − %Detractors, từ câu hỏi khả năng giới thiệu 0–10.' },
  { id: 'q2', question: '"Earned media value" trong ROI activation là?', options: ['Chi phí thuê KOL', 'Giá trị đưa tin/lan truyền miễn phí mà chiến dịch tạo ra', 'Tiền bán sản phẩm', 'Ngân sách quảng cáo trả phí'], correctIndex: 1, explanation: 'Earned media = giá trị của coverage/lan truyền không phải trả tiền.' },
  { id: 'q3', question: 'Tinh thần đúng khi dùng chỉ số trải nghiệm (vd NPS) là?', options: ['Đóng khung điểm số rồi dừng lại', 'Đóng vòng lặp: đo → sửa điểm chạm yếu → đo lại', 'Chỉ đo một lần lúc ra mắt', 'Bỏ qua người chê'], correctIndex: 1, explanation: 'Đo lường phải dẫn tới cải thiện; đóng vòng lặp thay vì chỉ chấm điểm.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'BEX301',
    slug: 'bex301-brand-experience-activation-design',
    title: 'Brand Experience & Activation Design',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/BEX301.webp',
    shortDescription: 'Design brand experiences & activations — the experience economy, Schmitt SEMs (sense/feel/think/act/relate), journeys & touchpoints, activation design, events & space, digital/phygital, community & UGC, metrics & ROI. Bilingual, real cases.|||Thiết kế trải nghiệm & kích hoạt thương hiệu — kinh tế trải nghiệm, SEM của Schmitt, hành trình & điểm chạm, thiết kế activation, sự kiện & không gian, số/phygital, cộng đồng & UGC, đo lường & ROI. Song ngữ, case thật.',
    description: 'Môn <strong>BEX301 — Brand Experience &amp; Activation Design</strong> (Thiết kế trải nghiệm và kích hoạt thương hiệu, khối Công nghệ Truyền thông, kỳ 7) dạy cách <strong>thiết kế trải nghiệm thương hiệu</strong>, không chỉ thông điệp. Từ <strong>kinh tế trải nghiệm</strong> (Pine &amp; Gilmore) &amp; khái niệm brand experience → <strong>mô hình</strong> (SEM của Schmitt, 4 chiều Brakus) → <strong>hành trình &amp; điểm chạm</strong> → <strong>thiết kế kích hoạt</strong> → <strong>sự kiện &amp; không gian</strong> → <strong>số &amp; phygital</strong> → <strong>cảm xúc, cộng đồng &amp; đồng sáng tạo</strong> → <strong>đo lường &amp; ROI</strong>. Bám sách chuẩn quốc tế, song ngữ, có case activation thật (Coca-Cola, Red Bull, Nike, IKEA) và quiz mỗi chương.',
    whatYouLearn: 'Khái niệm brand experience & kinh tế trải nghiệm; SEM (sense/feel/think/act/relate) & 4 chiều Brakus; hành trình khách hàng, điểm chạm, moments of truth, service blueprint; thiết kế brand activation (mục tiêu SMART, big idea, cơ chế, khuếch đại); event, pop-up & thiết kế không gian/giác quan; trải nghiệm số, AR/VR, gamification, phygital; gắn kết cảm xúc, cộng đồng, co-creation, UGC; đo lường (CSAT/CES/NPS, engagement) & ROI activation.',
    requirements: 'Kiến thức marketing/thương hiệu cơ bản. Xem điều kiện tiên quyết trong khung chương trình khối Công nghệ Truyền thông trên FLM (flm.fpt.edu.vn).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn (Schmitt, Pine & Gilmore, Brakus), tài liệu ngành, công cụ, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Trải nghiệm thương hiệu là gì, vì sao chuyển từ sản phẩm sang trải nghiệm, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Trải nghiệm thương hiệu|||Chapter 1 — Brand experience', description: 'Brand experience, kinh tế trải nghiệm, vì sao quan trọng.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Mô hình trải nghiệm|||Chapter 2 — Experience models', description: 'SEM (sense/feel/think/act/relate), 4 chiều Brakus.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Hành trình & điểm chạm|||Chapter 3 — Journeys & touchpoints', description: 'Customer journey, touchpoints, moments of truth, service blueprint.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Thiết kế kích hoạt|||Chapter 4 — Brand activation', description: 'Brand activation, experiential campaign, mục tiêu & cơ chế.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Sự kiện & không gian|||Chapter 5 — Event & space', description: 'Event, pop-up, retail/space design, atmospherics & giác quan.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Số & phygital|||Chapter 6 — Digital & phygital', description: 'Digital experience, AR/VR, gamification, phygital.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Cảm xúc & cộng đồng|||Chapter 7 — Emotion & community', description: 'Gắn kết cảm xúc, cộng đồng, co-creation, UGC.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đo lường & tối ưu|||Chapter 8 — Measurement & ROI', description: 'Experience metrics, NPS, engagement, ROI activation.', lessons: [c8, c8q] },
  ],
};
