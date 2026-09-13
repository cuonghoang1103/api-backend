/**
 * BPD301 — Strategic Brand Positioning & Differentiation. Định vị và khác biệt
 * hoá thương hiệu chiến lược (khối Công nghệ Truyền thông FPTU, kỳ 5). Sách
 * chuẩn: Ries & Trout "Positioning", Kapferer "New Strategic Brand Management",
 * Aaker "Building Strong Brands", Keller "Strategic Brand Management", Neumeier
 * "Zag". Song ngữ VI+EN, ví dụ thương hiệu thật, quiz mỗi chương.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; & → &amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('bpd301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), 5 sách kinh điển về định vị & thương hiệu, tài liệu miễn phí, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">BPD301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to master <strong>strategic brand positioning &amp; differentiation</strong> in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are the field's classic books and free resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>Official FPTU syllabus &amp; lecture slides for BPD301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 The five essential books</h3>
<ul>
<li><em>Positioning: The Battle for Your Mind</em> — Al Ries &amp; Jack Trout (the founding text)</li>
<li><em>The New Strategic Brand Management</em> — Jean-Noël Kapferer (the identity prism)</li>
<li><em>Building Strong Brands</em> — David Aaker (brand identity &amp; equity)</li>
<li><em>Strategic Brand Management</em> — Kevin Lane Keller (CBBE pyramid)</li>
<li><em>Zag</em> — Marty Neumeier (radical differentiation, "onliness")</li>
</ul>
<h3>🌐 Free resources</h3>
<ul>
<li><a href="https://www.marketingweek.com/" target="_blank" rel="noopener">Marketing Week — brand strategy articles</a></li>
<li><a href="https://hbr.org/topic/subject/branding" target="_blank" rel="noopener">Harvard Business Review — Branding</a></li>
<li><a href="https://www.interbrand.com/best-global-brands/" target="_blank" rel="noopener">Interbrand — Best Global Brands (equity rankings)</a></li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@TheFutur" target="_blank" rel="noopener">The Futur</a> — brand strategy &amp; positioning (Chris Do)</li>
<li><a href="https://www.youtube.com/@MarketingMediaMoney" target="_blank" rel="noopener">Marketing Media Money</a> — brand differentiation cases</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li>Positioning statement template (For / Who / Is / That / Unlike)</li>
<li>Perceptual map (2 axes) — spreadsheet or whiteboard</li>
<li>Kapferer brand identity prism — 6-facet canvas</li>
</ul>
<div class="callout"><span class="badge">4-step path</span>
<ol>
<li><strong>Understand</strong> — what positioning is and why the mind, not the market, is the battlefield.</li>
<li><strong>Analyse</strong> — category, competitors, target, points of parity &amp; difference.</li>
<li><strong>Build</strong> — a positioning statement, perceptual map and brand identity.</li>
<li><strong>Sustain</strong> — deliver through touchpoints, reposition when needed, measure brand equity.</li>
</ol></div>`,
    `<span class="eyebrow">BPD301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để làm chủ <strong>định vị &amp; khác biệt hoá thương hiệu chiến lược</strong> gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là các sách kinh điển của ngành và nguồn miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của BPD301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Năm cuốn sách nền tảng</h3>
<ul>
<li><em>Positioning: The Battle for Your Mind</em> — Al Ries &amp; Jack Trout (cuốn khai sinh)</li>
<li><em>The New Strategic Brand Management</em> — Jean-Noël Kapferer (lăng kính bản sắc)</li>
<li><em>Building Strong Brands</em> — David Aaker (bản sắc &amp; tài sản thương hiệu)</li>
<li><em>Strategic Brand Management</em> — Kevin Lane Keller (kim tự tháp CBBE)</li>
<li><em>Zag</em> — Marty Neumeier (khác biệt cực đoan, "onliness")</li>
</ul>
<h3>🌐 Tài liệu miễn phí</h3>
<ul>
<li><a href="https://www.marketingweek.com/" target="_blank" rel="noopener">Marketing Week — bài viết chiến lược thương hiệu</a></li>
<li><a href="https://hbr.org/topic/subject/branding" target="_blank" rel="noopener">Harvard Business Review — Branding</a></li>
<li><a href="https://www.interbrand.com/best-global-brands/" target="_blank" rel="noopener">Interbrand — Best Global Brands (xếp hạng tài sản)</a></li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@TheFutur" target="_blank" rel="noopener">The Futur</a> — chiến lược thương hiệu &amp; định vị (Chris Do)</li>
<li><a href="https://www.youtube.com/@MarketingMediaMoney" target="_blank" rel="noopener">Marketing Media Money</a> — ca khác biệt hoá thương hiệu</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li>Mẫu positioning statement (Cho / Ai / Là / Mang lại / Khác với)</li>
<li>Perceptual map (2 trục) — bảng tính hoặc bảng trắng</li>
<li>Lăng kính bản sắc Kapferer — khung 6 mặt</li>
</ul>
<div class="callout"><span class="badge">Lộ trình 4 bước</span>
<ol>
<li><strong>Hiểu</strong> — định vị là gì và vì sao chiến trường là tâm trí, không phải thị trường.</li>
<li><strong>Phân tích</strong> — ngành hàng, đối thủ, khách hàng mục tiêu, điểm tương đồng &amp; khác biệt.</li>
<li><strong>Xây</strong> — một positioning statement, perceptual map và bản sắc thương hiệu.</li>
<li><strong>Duy trì</strong> — hiện thực qua điểm chạm, tái định vị khi cần, đo tài sản thương hiệu.</li>
</ol></div>`,
  ]]);

const intro = doc('bpd301-0-1-overview', 'Course overview: Positioning & differentiation|||Tổng quan: Định vị & khác biệt hoá',
  'Định vị thương hiệu là gì, vì sao quan trọng; lộ trình 8 chương: định vị → bối cảnh → mô hình → khác biệt hoá → kiến trúc & bản sắc → điểm chạm → tái định vị → đo lường.',
  [[
    `<span class="eyebrow">BPD301 · Lesson 0.1 · Overview</span>
<h2>Strategic Brand Positioning &amp; Differentiation</h2>
<p class="lead">Markets are crowded and customers are overloaded. A brand wins not by being <em>better</em> on every feature, but by owning a <strong>clear, distinctive place in the customer's mind</strong>. This course teaches you how to find that place, claim it, and defend it.</p>
<h3>Two ideas that run through everything</h3>
<ul>
<li><strong>Positioning</strong> — the space a brand occupies in the customer's mind relative to competitors (Volvo = safety, Apple = creative simplicity).</li>
<li><strong>Differentiation</strong> — the meaningful, defensible reason that space is <em>yours</em> and no one else's.</li>
</ul>
<h3>Roadmap — 8 chapters</h3>
<ol>
<li>What positioning is (Ries &amp; Trout, the battle for the mind)</li>
<li>Analysing the positioning context (category, competitors, target, POP/POD)</li>
<li>Models &amp; tools (positioning statement, perceptual map, Kapferer prism)</li>
<li>Differentiation strategy (USP, brand mantra, Zag / onliness)</li>
<li>Brand architecture &amp; identity (essence, personality, values)</li>
<li>Positioning through experience &amp; touchpoints (consistency)</li>
<li>Repositioning &amp; its risks (extension, dilution, confusion)</li>
<li>Measuring positioning strength (brand equity, awareness, tracking)</li>
</ol>
<p>Bilingual throughout, with real brands — Volvo, Apple, Tesla, Biti's — and a quiz after every chapter.</p>`,
    `<span class="eyebrow">BPD301 · Bài 0.1 · Tổng quan</span>
<h2>Định vị &amp; khác biệt hoá thương hiệu chiến lược</h2>
<p class="lead">Thị trường chật chội và khách hàng quá tải thông tin. Thương hiệu thắng không phải nhờ <em>tốt hơn</em> ở mọi tính năng, mà nhờ chiếm được một <strong>vị trí rõ ràng, khác biệt trong tâm trí khách hàng</strong>. Môn này dạy bạn cách tìm ra vị trí đó, giành lấy, và bảo vệ nó.</p>
<h3>Hai ý xuyên suốt</h3>
<ul>
<li><strong>Định vị (positioning)</strong> — khoảng không gian thương hiệu chiếm trong tâm trí khách hàng so với đối thủ (Volvo = an toàn, Apple = sáng tạo &amp; tinh giản).</li>
<li><strong>Khác biệt hoá (differentiation)</strong> — lý do có ý nghĩa và bảo vệ được để khoảng không gian đó là <em>của bạn</em>, không của ai khác.</li>
</ul>
<h3>Lộ trình — 8 chương</h3>
<ol>
<li>Định vị là gì (Ries &amp; Trout, trận chiến trong tâm trí)</li>
<li>Phân tích bối cảnh định vị (ngành, đối thủ, khách hàng, POP/POD)</li>
<li>Mô hình &amp; công cụ (positioning statement, perceptual map, prism Kapferer)</li>
<li>Chiến lược khác biệt hoá (USP, brand mantra, Zag / onliness)</li>
<li>Kiến trúc &amp; bản sắc thương hiệu (tinh tuý, tính cách, giá trị)</li>
<li>Định vị qua trải nghiệm &amp; điểm chạm (nhất quán)</li>
<li>Tái định vị &amp; rủi ro (mở rộng, loãng, lẫn lộn)</li>
<li>Đo lường sức mạnh định vị (tài sản thương hiệu, nhận biết, theo dõi)</li>
</ol>
<p>Song ngữ xuyên suốt, với thương hiệu thật — Volvo, Apple, Tesla, Biti's — và quiz sau mỗi chương.</p>`,
  ]]);

const c1 = doc('bpd301-1-1-what-is-positioning', '1.1 — What positioning is|||1.1 — Định vị là gì',
  'Định vị theo Ries & Trout: không thay đổi sản phẩm mà thay đổi tâm trí khách hàng; vì sao tâm trí là chiến trường; định vị là sự khác biệt được ghi nhớ.',
  [[
    `<span class="eyebrow">BPD301 · Chapter 1 · Lesson 1.1</span>
<h2>What positioning is</h2>
<h3>The Ries &amp; Trout definition</h3>
<p>In <em>Positioning: The Battle for Your Mind</em> (1981), Al Ries and Jack Trout gave the classic definition: <strong>"Positioning is not what you do to a product. Positioning is what you do to the mind of the prospect."</strong> You don't change the product — you change how it is <em>perceived</em> and where it sits in the customer's memory.</p>
<h3>Why the mind is the battlefield</h3>
<ul>
<li><strong>Overload</strong> — people see thousands of messages a day and remember almost none. The mind defends itself by simplifying.</li>
<li><strong>Ladders</strong> — for each category the mind keeps a short "ladder" of brands (a top few). If you're not on the ladder, you're invisible.</li>
<li><strong>First wins</strong> — it is far easier to be <em>first</em> in a category (or to create a new one) than to be "better" than the leader.</li>
</ul>
<h3>Positioning = a remembered difference</h3>
<p>A strong position is <strong>one clear idea</strong> a customer can say back to you. Ask someone about <strong>Volvo</strong> and they say "safety". That single owned word is worth more than a list of features nobody remembers.</p>
<div class="callout"><span class="badge">Real brand</span> <strong>Volvo</strong> has owned "safety" for decades — not because its cars are the only safe cars, but because it claimed the word first and repeated it consistently until it stuck in the mind.</div>`,
    `<span class="eyebrow">BPD301 · Chương 1 · Bài 1.1</span>
<h2>Định vị là gì</h2>
<h3>Định nghĩa Ries &amp; Trout</h3>
<p>Trong <em>Positioning: The Battle for Your Mind</em> (1981), Al Ries và Jack Trout đưa ra định nghĩa kinh điển: <strong>"Định vị không phải là điều bạn làm với sản phẩm. Định vị là điều bạn làm với tâm trí khách hàng tiềm năng."</strong> Bạn không đổi sản phẩm — bạn đổi cách nó được <em>cảm nhận</em> và vị trí của nó trong trí nhớ khách hàng.</p>
<h3>Vì sao tâm trí là chiến trường</h3>
<ul>
<li><strong>Quá tải</strong> — mỗi ngày con người thấy hàng nghìn thông điệp và nhớ gần như không gì. Tâm trí tự vệ bằng cách đơn giản hoá.</li>
<li><strong>Thang bậc</strong> — với mỗi ngành hàng, tâm trí giữ một "thang" ngắn vài thương hiệu. Không có mặt trên thang thì bạn vô hình.</li>
<li><strong>Người đầu tiên thắng</strong> — làm <em>người đầu tiên</em> trong một ngành (hoặc tạo ngành mới) dễ hơn nhiều so với "tốt hơn" người dẫn đầu.</li>
</ul>
<h3>Định vị = một khác biệt được ghi nhớ</h3>
<p>Một định vị mạnh là <strong>một ý duy nhất rõ ràng</strong> mà khách hàng nói lại được. Hỏi ai đó về <strong>Volvo</strong>, họ nói "an toàn". Một từ sở hữu đó đáng giá hơn cả danh sách tính năng không ai nhớ.</p>
<div class="callout"><span class="badge">Thương hiệu thật</span> <strong>Volvo</strong> sở hữu chữ "an toàn" suốt nhiều thập kỷ — không phải vì xe của họ là xe an toàn duy nhất, mà vì họ giành chữ đó trước và lặp lại nhất quán đến khi nó dính vào tâm trí.</div>`,
  ]]);

const c1q = quiz('bpd301-quiz-1', 'Quiz 1 — What positioning is|||Quiz 1 — Định vị là gì', [
  { id: 'q1', question: 'Theo Ries & Trout, định vị là điều bạn làm với?', options: ['Sản phẩm', 'Tâm trí khách hàng tiềm năng', 'Giá bán', 'Kênh phân phối'], correctIndex: 1, explanation: 'Định vị thay đổi cảm nhận trong tâm trí, không thay đổi bản thân sản phẩm.' },
  { id: 'q2', question: 'Vì sao "làm người đầu tiên" trong một ngành lại lợi thế?', options: ['Vì sản phẩm rẻ hơn', 'Vì dễ chiếm chỗ trên "thang" trong tâm trí hơn là tốt hơn người dẫn đầu', 'Vì có nhiều tính năng hơn', 'Vì quảng cáo rẻ hơn'], correctIndex: 1, explanation: 'Tâm trí giữ thang ngắn; vào trước dễ được nhớ hơn cố "tốt hơn".' },
  { id: 'q3', question: 'Từ mà thương hiệu Volvo sở hữu trong tâm trí là?', options: ['Rẻ', 'Sang trọng', 'An toàn', 'Nhanh'], correctIndex: 2, explanation: 'Volvo giành và lặp lại "an toàn" đến khi thành sở hữu.' },
]);

const c2 = doc('bpd301-2-1-positioning-context', '2.1 — Analysing the positioning context|||2.1 — Phân tích bối cảnh định vị',
  'Bốn câu hỏi nền: khung ngành hàng (frame of reference), đối thủ, khách hàng mục tiêu, và points of parity/difference (POP/POD của Keller).',
  [[
    `<span class="eyebrow">BPD301 · Chapter 2 · Lesson 2.1</span>
<h2>Analysing the positioning context</h2>
<p>Before you claim a position, you map the ground. Four questions define the context.</p>
<h3>1. Category — the frame of reference</h3>
<p>Which category does the brand compete in? The <strong>frame of reference</strong> tells the customer what to compare you against. Tesla framed itself not as "a cheaper luxury car" but as <strong>the premium electric car</strong> — a frame where legacy makers had no lead.</p>
<h3>2. Competitors</h3>
<p>Who already owns space in this category, and which word or attribute do they hold? You cannot take a position an entrenched leader already owns — you find an open one.</p>
<h3>3. Target customer</h3>
<p>Positioning is always <em>for someone</em>. The same product positioned for a different segment needs a different message. Define the target's needs, values and alternatives.</p>
<h3>4. Points of parity &amp; points of difference (Keller)</h3>
<ul>
<li><strong>Points of parity (POP)</strong> — the "table stakes" you must have to be considered a credible member of the category (a smartphone must make calls and run apps).</li>
<li><strong>Points of difference (POD)</strong> — the attributes customers strongly associate with <em>you</em> and can't get elsewhere. This is where the position is won.</li>
</ul>
<div class="callout"><span class="badge">Real brand</span> <strong>Tesla</strong> matched the POPs of a luxury car (comfort, prestige) while owning PODs no rival had — instant electric torque, over-the-air software, and Supercharger network.</div>`,
    `<span class="eyebrow">BPD301 · Chương 2 · Bài 2.1</span>
<h2>Phân tích bối cảnh định vị</h2>
<p>Trước khi giành một vị trí, bạn phải vẽ bản đồ địa hình. Bốn câu hỏi xác định bối cảnh.</p>
<h3>1. Ngành hàng — khung tham chiếu</h3>
<p>Thương hiệu cạnh tranh trong ngành nào? <strong>Khung tham chiếu (frame of reference)</strong> cho khách hàng biết phải so bạn với ai. Tesla tự khung mình không phải "xe sang rẻ hơn" mà là <strong>xe điện cao cấp</strong> — một khung mà các hãng cũ chưa dẫn đầu.</p>
<h3>2. Đối thủ</h3>
<p>Ai đã chiếm chỗ trong ngành này, và họ giữ chữ hay thuộc tính nào? Bạn không thể lấy một vị trí mà người dẫn đầu đã sở hữu chắc — bạn tìm một chỗ trống.</p>
<h3>3. Khách hàng mục tiêu</h3>
<p>Định vị luôn <em>dành cho ai đó</em>. Cùng một sản phẩm định vị cho phân khúc khác cần thông điệp khác. Xác định nhu cầu, giá trị và lựa chọn thay thế của họ.</p>
<h3>4. Điểm tương đồng &amp; điểm khác biệt (Keller)</h3>
<ul>
<li><strong>Điểm tương đồng (POP)</strong> — "vé vào cửa" bắt buộc phải có để được xem là thành viên đáng tin của ngành (điện thoại phải gọi được và chạy app).</li>
<li><strong>Điểm khác biệt (POD)</strong> — thuộc tính khách hàng gắn mạnh với <em>bạn</em> và không có nơi khác. Đây là nơi giành được vị trí.</li>
</ul>
<div class="callout"><span class="badge">Thương hiệu thật</span> <strong>Tesla</strong> khớp POP của xe sang (tiện nghi, uy tín) đồng thời sở hữu POD không đối thủ nào có — mô-men điện tức thì, phần mềm cập nhật qua mạng, và mạng Supercharger.</div>`,
  ]]);

const c2q = quiz('bpd301-quiz-2', 'Quiz 2 — Positioning context|||Quiz 2 — Bối cảnh định vị', [
  { id: 'q1', question: '"Frame of reference" (khung tham chiếu) trong định vị là?', options: ['Ngân sách quảng cáo', 'Ngành hàng khách hàng dùng để so sánh bạn', 'Màu sắc logo', 'Giá niêm yết'], correctIndex: 1, explanation: 'Khung tham chiếu nói cho khách biết so bạn với ai.' },
  { id: 'q2', question: 'Points of parity (POP) là?', options: ['Thứ khiến bạn khác biệt duy nhất', 'Thuộc tính "vé vào cửa" bắt buộc để được xem là thành viên đáng tin của ngành', 'Giá thấp nhất thị trường', 'Slogan'], correctIndex: 1, explanation: 'POP là điểm tương đồng tối thiểu để được cân nhắc.' },
  { id: 'q3', question: 'Points of difference (POD) là nơi?', options: ['Bạn giống hệt đối thủ', 'Giành được vị trí — thuộc tính khách gắn mạnh với riêng bạn', 'Cắt giảm chi phí', 'Sao chép người dẫn đầu'], correctIndex: 1, explanation: 'POD là khác biệt riêng, không có ở nơi khác — nơi thắng định vị.' },
]);

const c3 = doc('bpd301-3-1-models-tools', '3.1 — Positioning models & tools|||3.1 — Mô hình & công cụ định vị',
  'Positioning statement (For/Who/Is/That/Unlike), perceptual map (bản đồ nhận thức 2 trục), và brand identity prism 6 mặt của Kapferer.',
  [[
    `<span class="eyebrow">BPD301 · Chapter 3 · Lesson 3.1</span>
<h2>Positioning models &amp; tools</h2>
<h3>1. The positioning statement</h3>
<p>A one-sentence internal tool that forces clarity. The classic template:</p>
<pre><code>For [target customer]
Who [need or opportunity]
[Brand] is [the category / frame of reference]
That [key point of difference / benefit]
Unlike [main competitor], [reason to believe].</code></pre>
<p>It is written for the team, not the ad — but every ad should be traceable back to it.</p>
<h3>2. The perceptual map</h3>
<p>A <strong>perceptual map</strong> plots brands on two axes that matter to customers (e.g. price vs. performance, traditional vs. modern). It reveals crowded zones to avoid and <strong>open space</strong> to claim. The best positions sit in a gap that customers value but no rival occupies.</p>
<h3>3. Kapferer's brand identity prism</h3>
<p>Kapferer models a brand's identity as six connected facets:</p>
<ul>
<li><strong>Physique</strong> — tangible features &amp; look</li>
<li><strong>Personality</strong> — the brand's character, as if it were a person</li>
<li><strong>Culture</strong> — the values and origin it stands for</li>
<li><strong>Relationship</strong> — the bond between brand and customer</li>
<li><strong>Reflection</strong> — the customer as others see them using it</li>
<li><strong>Self-image</strong> — how the customer sees themselves</li>
</ul>
<div class="callout"><span class="badge">Real brand</span> <strong>Apple</strong>'s prism: physique (clean minimalist hardware), personality (creative, confident), culture ("Think Different"), relationship (empowering), reflection (a creative person), self-image ("I make things"). Every touchpoint reinforces the same six.</div>`,
    `<span class="eyebrow">BPD301 · Chương 3 · Bài 3.1</span>
<h2>Mô hình &amp; công cụ định vị</h2>
<h3>1. Positioning statement (tuyên bố định vị)</h3>
<p>Một câu công cụ nội bộ buộc phải rõ ràng. Mẫu kinh điển:</p>
<pre><code>Cho [khách hàng mục tiêu]
Người mà [nhu cầu hoặc cơ hội]
[Thương hiệu] là [ngành / khung tham chiếu]
Mang lại [điểm khác biệt / lợi ích cốt lõi]
Khác với [đối thủ chính], [lý do để tin].</code></pre>
<p>Viết cho đội ngũ, không phải cho quảng cáo — nhưng mọi quảng cáo phải truy về được nó.</p>
<h3>2. Perceptual map (bản đồ nhận thức)</h3>
<p>Một <strong>perceptual map</strong> đặt các thương hiệu lên hai trục quan trọng với khách hàng (vd giá vs hiệu năng, truyền thống vs hiện đại). Nó lộ ra vùng chật cần tránh và <strong>khoảng trống</strong> để chiếm. Vị trí tốt nhất nằm ở khe mà khách hàng coi trọng nhưng chưa đối thủ nào chiếm.</p>
<h3>3. Lăng kính bản sắc Kapferer</h3>
<p>Kapferer mô hình hoá bản sắc thương hiệu thành sáu mặt liên kết:</p>
<ul>
<li><strong>Physique (thể chất)</strong> — đặc điểm hữu hình &amp; diện mạo</li>
<li><strong>Personality (tính cách)</strong> — tính cách thương hiệu như một con người</li>
<li><strong>Culture (văn hoá)</strong> — giá trị và cội nguồn nó đại diện</li>
<li><strong>Relationship (quan hệ)</strong> — mối liên kết giữa thương hiệu và khách</li>
<li><strong>Reflection (phản chiếu)</strong> — hình ảnh người dùng trong mắt người khác</li>
<li><strong>Self-image (tự hình dung)</strong> — cách khách tự nhìn mình</li>
</ul>
<div class="callout"><span class="badge">Thương hiệu thật</span> Prism của <strong>Apple</strong>: thể chất (phần cứng tối giản, sạch), tính cách (sáng tạo, tự tin), văn hoá ("Think Different"), quan hệ (trao quyền), phản chiếu (người sáng tạo), tự hình dung ("Tôi tạo ra thứ mới"). Mọi điểm chạm củng cố cùng sáu mặt.</div>`,
  ]]);

const c3q = quiz('bpd301-quiz-3', 'Quiz 3 — Models & tools|||Quiz 3 — Mô hình & công cụ', [
  { id: 'q1', question: 'Positioning statement được viết chủ yếu để phục vụ ai?', options: ['Khách hàng cuối, làm slogan', 'Đội ngũ nội bộ, buộc rõ ràng và dẫn hướng mọi thông điệp', 'Nhà đầu tư', 'Cơ quan thuế'], correctIndex: 1, explanation: 'Là công cụ nội bộ; mọi quảng cáo phải truy về được nó.' },
  { id: 'q2', question: 'Perceptual map giúp tìm ra?', options: ['Giá vốn sản phẩm', 'Khoảng trống mà khách coi trọng nhưng chưa đối thủ nào chiếm', 'Số nhân viên', 'Tỷ giá'], correctIndex: 1, explanation: 'Bản đồ 2 trục lộ vùng chật cần tránh và khoảng trống để chiếm.' },
  { id: 'q3', question: 'Sáu mặt trong lăng kính Kapferer gồm physique, personality, culture, relationship, reflection và?', options: ['Price (giá)', 'Self-image (tự hình dung)', 'Revenue (doanh thu)', 'Logo'], correctIndex: 1, explanation: 'Mặt thứ sáu là self-image — cách khách tự nhìn mình.' },
]);

const c4 = doc('bpd301-4-1-differentiation', '4.1 — Differentiation strategy|||4.1 — Chiến lược khác biệt hoá',
  'USP, brand mantra (3 từ của Keller), và "onliness"/Zag của Neumeier: đừng làm tốt hơn, hãy làm KHÁC — khi mọi người zig, bạn zag.',
  [[
    `<span class="eyebrow">BPD301 · Chapter 4 · Lesson 4.1</span>
<h2>Differentiation strategy</h2>
<p>A position is only defensible if the difference behind it is real. Three lenses.</p>
<h3>1. The USP (unique selling proposition)</h3>
<p>The single benefit you promise that rivals can't or don't. A good USP is <strong>specific, meaningful to the customer, and hard to copy</strong> — not "high quality" (everyone says that) but a concrete, ownable claim.</p>
<h3>2. The brand mantra (Keller)</h3>
<p>Keller compresses the brand into a <strong>three-word mantra</strong> — an internal filter for every decision. Nike's is often cited as "Authentic Athletic Performance"; Disney's as "Fun Family Entertainment". If an initiative doesn't fit the mantra, you don't do it.</p>
<h3>3. Onliness &amp; the Zag (Neumeier)</h3>
<p>In <em>Zag</em>, Marty Neumeier argues: <strong>"When everybody zigs, zag."</strong> The goal is <strong>onliness</strong> — being able to complete the sentence "Our brand is the ONLY ______ that ______." Not the best, the <em>only</em>. Radical differentiation beats incremental improvement because the mind rewards the unique, not the marginally better.</p>
<div class="callout"><span class="badge">Real brand</span> <strong>Biti's Hunter</strong> zagged: instead of competing on price with cheap sneakers, it repositioned around a proud "Đi để trở về" (go out, come home) Vietnamese story — the only local sneaker owning that emotional, patriotic space, and it re-energised the brand with young buyers.</div>`,
    `<span class="eyebrow">BPD301 · Chương 4 · Bài 4.1</span>
<h2>Chiến lược khác biệt hoá</h2>
<p>Một vị trí chỉ bảo vệ được nếu khác biệt phía sau nó là thật. Ba lăng kính.</p>
<h3>1. USP (đề xuất bán hàng độc nhất)</h3>
<p>Một lợi ích duy nhất bạn hứa mà đối thủ không thể hoặc không làm. USP tốt phải <strong>cụ thể, có ý nghĩa với khách, và khó sao chép</strong> — không phải "chất lượng cao" (ai cũng nói), mà là một tuyên bố cụ thể, sở hữu được.</p>
<h3>2. Brand mantra (Keller)</h3>
<p>Keller nén thương hiệu thành một <strong>mantra ba từ</strong> — bộ lọc nội bộ cho mọi quyết định. Nike thường được trích là "Authentic Athletic Performance"; Disney là "Fun Family Entertainment". Việc gì không khớp mantra thì không làm.</p>
<h3>3. Onliness &amp; cú Zag (Neumeier)</h3>
<p>Trong <em>Zag</em>, Marty Neumeier lập luận: <strong>"Khi mọi người zig, hãy zag."</strong> Mục tiêu là <strong>onliness</strong> — điền được câu "Thương hiệu của chúng tôi là thứ DUY NHẤT ______ mà ______." Không phải tốt nhất, mà <em>duy nhất</em>. Khác biệt cực đoan thắng cải tiến từng chút, vì tâm trí thưởng cho cái độc nhất, không phải cái nhỉnh hơn.</p>
<div class="callout"><span class="badge">Thương hiệu thật</span> <strong>Biti's Hunter</strong> đã zag: thay vì đua giá với giày rẻ, hãng tái định vị quanh câu chuyện tự hào "Đi để trở về" của người Việt — thương hiệu giày nội duy nhất sở hữu khoảng không cảm xúc, tự hào đó, và làm sống lại thương hiệu với người trẻ.</div>`,
  ]]);

const c4q = quiz('bpd301-quiz-4', 'Quiz 4 — Differentiation|||Quiz 4 — Khác biệt hoá', [
  { id: 'q1', question: 'Một USP tốt cần?', options: ['Chung chung như "chất lượng cao"', 'Cụ thể, có ý nghĩa với khách, và khó sao chép', 'Giá thấp nhất', 'Nhiều tính năng nhất'], correctIndex: 1, explanation: 'USP mạnh là lời hứa cụ thể, sở hữu được, đối thủ khó copy.' },
  { id: 'q2', question: 'Theo Neumeier, mục tiêu của "onliness" là?', options: ['Làm tốt hơn đối thủ một chút', 'Là thứ DUY NHẤT làm được điều gì đó — khác biệt cực đoan', 'Bắt chước người dẫn đầu', 'Giảm giá liên tục'], correctIndex: 1, explanation: 'Không phải best mà là only — "khi mọi người zig, hãy zag".' },
  { id: 'q3', question: 'Brand mantra của Keller thường có độ dài?', options: ['Một đoạn văn', 'Ba từ, làm bộ lọc nội bộ cho mọi quyết định', 'Đúng 100 ký tự', 'Một trang'], correctIndex: 1, explanation: 'Mantra ba từ (vd "Fun Family Entertainment") lọc mọi quyết định.' },
]);

const c5 = doc('bpd301-5-1-architecture-identity', '5.1 — Brand architecture & identity|||5.1 — Kiến trúc & bản sắc thương hiệu',
  'Kiến trúc thương hiệu (house of brands vs branded house), và bản sắc: essence (tinh tuý), personality (tính cách), values (giá trị) theo Aaker.',
  [[
    `<span class="eyebrow">BPD301 · Chapter 5 · Lesson 5.1</span>
<h2>Brand architecture &amp; identity</h2>
<h3>Brand architecture — how brands relate</h3>
<p>When a company has several brands, <strong>architecture</strong> decides how they connect:</p>
<ul>
<li><strong>Branded house</strong> — one master brand stretches across products (Google Search, Google Maps, Google Drive). Efficient, one reputation to build.</li>
<li><strong>House of brands</strong> — independent brands under a hidden parent (Unilever owns Dove, Axe, Knorr). Each can own a distinct position without diluting the others.</li>
<li><strong>Endorsed / sub-brands</strong> — hybrids (Marriott → Courtyard by Marriott).</li>
</ul>
<p>Architecture is a positioning decision: it controls how much one brand's meaning transfers to another.</p>
<h3>Brand identity — the core (Aaker)</h3>
<p>Aaker distinguishes identity (what the brand aspires to mean) from image (what customers currently think). The core layers:</p>
<ul>
<li><strong>Essence</strong> — the single timeless idea at the heart (Disney = "magic").</li>
<li><strong>Personality</strong> — human traits (rugged, sophisticated, sincere).</li>
<li><strong>Values</strong> — what the brand believes and won't compromise.</li>
</ul>
<div class="callout"><span class="badge">Real brand</span> <strong>Apple</strong> runs a branded house — iPhone, iPad, Mac, Watch all carry one essence (creative simplicity) and one personality — so a great experience with any product lifts the whole brand.</div>`,
    `<span class="eyebrow">BPD301 · Chương 5 · Bài 5.1</span>
<h2>Kiến trúc &amp; bản sắc thương hiệu</h2>
<h3>Kiến trúc thương hiệu — các thương hiệu liên hệ ra sao</h3>
<p>Khi một công ty có nhiều thương hiệu, <strong>kiến trúc</strong> quyết định chúng nối với nhau thế nào:</p>
<ul>
<li><strong>Branded house</strong> — một thương hiệu mẹ trải khắp sản phẩm (Google Search, Google Maps, Google Drive). Hiệu quả, chỉ một danh tiếng cần xây.</li>
<li><strong>House of brands</strong> — các thương hiệu độc lập dưới một công ty mẹ ẩn (Unilever sở hữu Dove, Axe, Knorr). Mỗi cái sở hữu vị trí riêng mà không làm loãng cái khác.</li>
<li><strong>Endorsed / sub-brand</strong> — dạng lai (Marriott → Courtyard by Marriott).</li>
</ul>
<p>Kiến trúc là một quyết định định vị: nó kiểm soát mức ý nghĩa của thương hiệu này truyền sang thương hiệu kia.</p>
<h3>Bản sắc thương hiệu — phần lõi (Aaker)</h3>
<p>Aaker phân biệt bản sắc (điều thương hiệu muốn đại diện) với hình ảnh (điều khách đang nghĩ). Các lớp lõi:</p>
<ul>
<li><strong>Essence (tinh tuý)</strong> — một ý bất biến ở trung tâm (Disney = "phép màu").</li>
<li><strong>Personality (tính cách)</strong> — nét người (mạnh mẽ, tinh tế, chân thành).</li>
<li><strong>Values (giá trị)</strong> — điều thương hiệu tin và không đánh đổi.</li>
</ul>
<div class="callout"><span class="badge">Thương hiệu thật</span> <strong>Apple</strong> theo mô hình branded house — iPhone, iPad, Mac, Watch đều mang một tinh tuý (sáng tạo &amp; tinh giản) và một tính cách — nên trải nghiệm tốt với bất kỳ sản phẩm nào cũng nâng cả thương hiệu.</div>`,
  ]]);

const c5q = quiz('bpd301-quiz-5', 'Quiz 5 — Architecture & identity|||Quiz 5 — Kiến trúc & bản sắc', [
  { id: 'q1', question: 'Mô hình "branded house" là?', options: ['Nhiều thương hiệu độc lập dưới mẹ ẩn', 'Một thương hiệu mẹ trải khắp sản phẩm (như Google)', 'Không có thương hiệu nào', 'Chỉ bán một sản phẩm'], correctIndex: 1, explanation: 'Branded house: một master brand cho nhiều sản phẩm.' },
  { id: 'q2', question: 'Unilever sở hữu Dove, Axe, Knorr là ví dụ của?', options: ['Branded house', 'House of brands', 'Sub-brand', 'Không có kiến trúc'], correctIndex: 1, explanation: 'House of brands: các thương hiệu độc lập, mỗi cái vị trí riêng.' },
  { id: 'q3', question: 'Theo Aaker, "essence" (tinh tuý thương hiệu) là?', options: ['Danh sách tính năng', 'Một ý bất biến ở trung tâm thương hiệu', 'Bảng giá', 'Số cửa hàng'], correctIndex: 1, explanation: 'Essence là ý cốt lõi, timeless (vd Disney = "phép màu").' },
]);

const c6 = doc('bpd301-6-1-touchpoints', '6.1 — Positioning through touchpoints|||6.1 — Định vị qua điểm chạm',
  'Định vị sống ở trải nghiệm, không chỉ ở quảng cáo; mọi điểm chạm phải kể cùng một câu chuyện; nhất quán qua thời gian xây niềm tin.',
  [[
    `<span class="eyebrow">BPD301 · Chapter 6 · Lesson 6.1</span>
<h2>Positioning through experience &amp; touchpoints</h2>
<h3>A position is proven, not just claimed</h3>
<p>Customers don't believe your positioning statement — they believe their <strong>experience</strong>. A brand that says "premium" but ships in a cheap box has just contradicted its position. Every <strong>touchpoint</strong> is a chance to confirm or break the position.</p>
<h3>Map the touchpoints</h3>
<ul>
<li><strong>Product</strong> — the experience of using it (the strongest signal of all).</li>
<li><strong>Packaging &amp; unboxing</strong>, retail or app UI, service &amp; support.</li>
<li><strong>Communications</strong> — ads, social, tone of voice, visual identity.</li>
<li><strong>People</strong> — staff behaviour; and post-purchase (delivery, returns).</li>
</ul>
<h3>Consistency is the multiplier</h3>
<p>The position only sticks when <strong>every touchpoint tells the same story</strong>, and tells it <em>over time</em>. Inconsistency confuses the mind and erases the ladder position you fought for. Consistency across channels and years is what turns a claim into a belief.</p>
<div class="callout"><span class="badge">Real brand</span> <strong>Apple</strong> reinforces "creative simplicity" at every touchpoint — the hardware, the OS, the store architecture, the unboxing, even the font — so the position is experienced, not merely advertised.</div>`,
    `<span class="eyebrow">BPD301 · Chương 6 · Bài 6.1</span>
<h2>Định vị qua trải nghiệm &amp; điểm chạm</h2>
<h3>Vị trí phải được chứng minh, không chỉ tuyên bố</h3>
<p>Khách hàng không tin tuyên bố định vị của bạn — họ tin <strong>trải nghiệm</strong> của chính họ. Một thương hiệu nói "cao cấp" nhưng giao trong hộp rẻ tiền là vừa tự mâu thuẫn với vị trí. Mỗi <strong>điểm chạm</strong> là một cơ hội xác nhận hoặc phá vỡ vị trí.</p>
<h3>Vẽ bản đồ điểm chạm</h3>
<ul>
<li><strong>Sản phẩm</strong> — trải nghiệm khi dùng (tín hiệu mạnh nhất).</li>
<li><strong>Bao bì &amp; mở hộp</strong>, giao diện cửa hàng hoặc app, dịch vụ &amp; hỗ trợ.</li>
<li><strong>Truyền thông</strong> — quảng cáo, mạng xã hội, giọng điệu, nhận diện thị giác.</li>
<li><strong>Con người</strong> — hành vi nhân viên; và sau mua (giao hàng, đổi trả).</li>
</ul>
<h3>Nhất quán là cấp số nhân</h3>
<p>Vị trí chỉ dính khi <strong>mọi điểm chạm kể cùng một câu chuyện</strong>, và kể <em>qua thời gian</em>. Thiếu nhất quán làm rối tâm trí và xoá vị trí trên thang mà bạn đã tranh giành. Nhất quán qua các kênh và qua nhiều năm là thứ biến một tuyên bố thành niềm tin.</p>
<div class="callout"><span class="badge">Thương hiệu thật</span> <strong>Apple</strong> củng cố "sáng tạo &amp; tinh giản" ở mọi điểm chạm — phần cứng, hệ điều hành, kiến trúc cửa hàng, trải nghiệm mở hộp, đến cả font chữ — nên vị trí được trải nghiệm, không chỉ được quảng cáo.</div>`,
  ]]);

const c6q = quiz('bpd301-quiz-6', 'Quiz 6 — Touchpoints|||Quiz 6 — Điểm chạm', [
  { id: 'q1', question: 'Khách hàng tin điều gì hơn cả tuyên bố định vị?', options: ['Logo', 'Trải nghiệm thực tế của chính họ với thương hiệu', 'Giá cổ phiếu', 'Số nhân viên'], correctIndex: 1, explanation: 'Vị trí phải được chứng minh qua trải nghiệm, không chỉ tuyên bố.' },
  { id: 'q2', question: 'Điểm chạm nào thường là tín hiệu mạnh nhất về định vị?', options: ['Chữ ký email', 'Trải nghiệm dùng bản thân sản phẩm', 'Danh thiếp', 'Số điện thoại tổng đài'], correctIndex: 1, explanation: 'Trải nghiệm sản phẩm là bằng chứng mạnh nhất của vị trí.' },
  { id: 'q3', question: 'Vì sao nhất quán qua các kênh và thời gian quan trọng?', options: ['Để tiết kiệm giấy', 'Vì thiếu nhất quán làm rối tâm trí và xoá vị trí đã giành', 'Vì luật bắt buộc', 'Không quan trọng'], correctIndex: 1, explanation: 'Nhất quán biến tuyên bố thành niềm tin; bất nhất xoá vị trí trên thang.' },
]);

const c7 = doc('bpd301-7-1-repositioning', '7.1 — Repositioning & its risks|||7.1 — Tái định vị & thách thức',
  'Khi nào cần tái định vị; mở rộng thương hiệu (brand extension) và rủi ro loãng; tránh lẫn lộn và làm loãng định vị.',
  [[
    `<span class="eyebrow">BPD301 · Chapter 7 · Lesson 7.1</span>
<h2>Repositioning &amp; its challenges</h2>
<h3>When to reposition</h3>
<p><strong>Repositioning</strong> means deliberately changing the place a brand holds in the mind. Triggers: the old position no longer sells, the market has shifted, a new competitor took your space, or you are chasing a new audience. It is risky — you are asking the mind to <em>relearn</em> something, which is far harder than teaching it the first time.</p>
<h3>Brand extension — leverage vs. dilution</h3>
<p>A <strong>brand extension</strong> uses an existing brand to enter a new category. It borrows equity (cheaper, faster trust) but carries danger:</p>
<ul>
<li><strong>Dilution</strong> — stretching the brand so far the core idea blurs (what does it stand for now?).</li>
<li><strong>Confusion</strong> — an extension that contradicts the position damages the parent (a "safety" brand launching a race car).</li>
</ul>
<h3>Avoiding a blurred position</h3>
<p>Ries &amp; Trout warn against the <strong>"line-extension trap"</strong>: adding more products under one name can weaken the single idea that made it strong. Discipline — knowing what <em>not</em> to do — protects the position. Reposition on purpose; never let the position drift by accident.</p>
<div class="callout"><span class="badge">Real brand</span> <strong>Biti's</strong> repositioned from "durable children's shoes" to a youthful, patriotic sneaker with Hunter — a purposeful, well-supported shift. A careless extension into an unrelated category, by contrast, would have blurred what people knew it for.</div>`,
    `<span class="eyebrow">BPD301 · Chương 7 · Bài 7.1</span>
<h2>Tái định vị &amp; thách thức</h2>
<h3>Khi nào cần tái định vị</h3>
<p><strong>Tái định vị</strong> là chủ động thay đổi vị trí thương hiệu giữ trong tâm trí. Nguyên nhân: vị trí cũ không còn bán được, thị trường đã đổi, đối thủ mới chiếm chỗ của bạn, hoặc bạn đuổi theo một tập khách mới. Nó rủi ro — bạn đang yêu cầu tâm trí <em>học lại</em>, khó hơn nhiều so với dạy nó lần đầu.</p>
<h3>Mở rộng thương hiệu — đòn bẩy vs loãng</h3>
<p>Một <strong>brand extension</strong> dùng thương hiệu sẵn có để vào ngành mới. Nó mượn tài sản (rẻ hơn, tin nhanh hơn) nhưng mang rủi ro:</p>
<ul>
<li><strong>Loãng (dilution)</strong> — kéo thương hiệu quá xa đến mức ý cốt lõi mờ đi (giờ nó đại diện cho gì?).</li>
<li><strong>Lẫn lộn (confusion)</strong> — một mở rộng mâu thuẫn với vị trí làm hại thương hiệu mẹ (thương hiệu "an toàn" ra mắt xe đua).</li>
</ul>
<h3>Tránh định vị bị mờ</h3>
<p>Ries &amp; Trout cảnh báo về <strong>"bẫy mở rộng dòng" (line-extension trap)</strong>: thêm nhiều sản phẩm dưới một cái tên có thể làm yếu chính ý duy nhất đã khiến nó mạnh. Kỷ luật — biết điều <em>không</em> nên làm — bảo vệ vị trí. Hãy tái định vị có chủ đích; đừng để vị trí trôi dạt vì vô tình.</p>
<div class="callout"><span class="badge">Thương hiệu thật</span> <strong>Biti's</strong> tái định vị từ "giày trẻ em bền" sang giày trẻ trung, tự hào dân tộc với dòng Hunter — một dịch chuyển có chủ đích, được hậu thuẫn tốt. Ngược lại, một mở rộng cẩu thả sang ngành không liên quan sẽ làm mờ điều người ta vốn nhớ về nó.</div>`,
  ]]);

const c7q = quiz('bpd301-quiz-7', 'Quiz 7 — Repositioning|||Quiz 7 — Tái định vị', [
  { id: 'q1', question: 'Vì sao tái định vị rủi ro hơn định vị lần đầu?', options: ['Vì tốn giấy hơn', 'Vì phải yêu cầu tâm trí HỌC LẠI điều đã tin, khó hơn dạy lần đầu', 'Vì phải đổi logo', 'Không rủi ro gì'], correctIndex: 1, explanation: 'Bắt tâm trí học lại khó hơn nhiều so với ghi lần đầu.' },
  { id: 'q2', question: 'Rủi ro "dilution" (loãng) khi mở rộng thương hiệu là?', options: ['Giá tăng', 'Kéo thương hiệu quá xa khiến ý cốt lõi mờ đi', 'Có thêm khách hàng', 'Logo đẹp hơn'], correctIndex: 1, explanation: 'Mở rộng quá đà làm mờ ý duy nhất từng khiến thương hiệu mạnh.' },
  { id: 'q3', question: 'Ries & Trout gọi việc thêm nhiều sản phẩm dưới một tên làm yếu ý cốt lõi là?', options: ['Bẫy mở rộng dòng (line-extension trap)', 'Perceptual map', 'Points of parity', 'Brand mantra'], correctIndex: 0, explanation: 'Line-extension trap: kỷ luật biết điều KHÔNG nên làm bảo vệ vị trí.' },
]);

const c8 = doc('bpd301-8-1-measuring-equity', '8.1 — Measuring positioning strength|||8.1 — Đo lường sức mạnh định vị',
  'Brand equity (Keller CBBE, Aaker); đo nhận biết (awareness), liên tưởng (association), theo dõi (brand tracking); ví dụ và xếp hạng.',
  [[
    `<span class="eyebrow">BPD301 · Chapter 8 · Lesson 8.1</span>
<h2>Measuring positioning strength</h2>
<h3>Brand equity — the value of the position</h3>
<p><strong>Brand equity</strong> is the extra value a brand adds beyond the functional product — the reason a customer chooses and pays more for it. It is the financial shadow of a strong position. Two classic models:</p>
<ul>
<li><strong>Keller's CBBE pyramid</strong> — climb from <em>salience</em> (who are you?) → <em>performance &amp; imagery</em> (what are you?) → <em>judgments &amp; feelings</em> (what about you?) → <em>resonance</em> (loyalty, the peak).</li>
<li><strong>Aaker's equity</strong> — awareness, perceived quality, associations, and loyalty.</li>
</ul>
<h3>What to measure</h3>
<ul>
<li><strong>Awareness</strong> — unaided ("name a sneaker brand") vs. aided recall; top-of-mind share.</li>
<li><strong>Associations</strong> — which words customers link to the brand (do they match the intended position?).</li>
<li><strong>Differentiation &amp; preference</strong> — is the brand seen as distinct, and is it chosen?</li>
</ul>
<h3>Track over time</h3>
<p><strong>Brand tracking</strong> repeats these measures on a schedule so you can see the position strengthening, drifting, or being attacked — before sales fall. External rankings like <strong>Interbrand Best Global Brands</strong> convert equity into a dollar figure.</p>
<div class="callout"><span class="badge">Real brand</span> <strong>Apple</strong> and <strong>Tesla</strong> repeatedly top global brand-value rankings — evidence that a clear, consistently delivered position (creative simplicity; premium electric) compounds into measurable, durable equity.</div>`,
    `<span class="eyebrow">BPD301 · Chương 8 · Bài 8.1</span>
<h2>Đo lường sức mạnh định vị</h2>
<h3>Brand equity — giá trị của vị trí</h3>
<p><strong>Tài sản thương hiệu (brand equity)</strong> là giá trị tăng thêm mà thương hiệu tạo ra ngoài sản phẩm chức năng — lý do khách chọn và trả nhiều hơn. Nó là cái bóng tài chính của một vị trí mạnh. Hai mô hình kinh điển:</p>
<ul>
<li><strong>Kim tự tháp CBBE của Keller</strong> — leo từ <em>salience</em> (bạn là ai?) → <em>performance &amp; imagery</em> (bạn là gì?) → <em>judgments &amp; feelings</em> (nghĩ gì về bạn?) → <em>resonance</em> (lòng trung thành, đỉnh tháp).</li>
<li><strong>Equity của Aaker</strong> — nhận biết, chất lượng cảm nhận, liên tưởng, và trung thành.</li>
</ul>
<h3>Đo gì</h3>
<ul>
<li><strong>Nhận biết (awareness)</strong> — không gợi ý ("kể tên một hãng giày") vs có gợi ý; tỷ lệ top-of-mind.</li>
<li><strong>Liên tưởng (associations)</strong> — khách gắn từ nào với thương hiệu (có khớp vị trí mong muốn không?).</li>
<li><strong>Khác biệt &amp; ưu tiên</strong> — thương hiệu có được xem là khác biệt, và có được chọn không?</li>
</ul>
<h3>Theo dõi qua thời gian</h3>
<p><strong>Brand tracking</strong> lặp lại các phép đo theo lịch để bạn thấy vị trí đang mạnh lên, trôi dạt, hay bị tấn công — trước khi doanh số rơi. Xếp hạng bên ngoài như <strong>Interbrand Best Global Brands</strong> quy tài sản thành con số đô-la.</p>
<div class="callout"><span class="badge">Thương hiệu thật</span> <strong>Apple</strong> và <strong>Tesla</strong> nhiều lần dẫn đầu bảng xếp hạng giá trị thương hiệu toàn cầu — bằng chứng rằng một vị trí rõ ràng, được hiện thực nhất quán (sáng tạo &amp; tinh giản; xe điện cao cấp) tích luỹ thành tài sản đo được và bền vững.</div>`,
  ]]);

const c8q = quiz('bpd301-quiz-8', 'Quiz 8 — Measuring equity|||Quiz 8 — Đo lường tài sản', [
  { id: 'q1', question: 'Brand equity (tài sản thương hiệu) là?', options: ['Chi phí sản xuất', 'Giá trị tăng thêm ngoài sản phẩm chức năng — lý do khách chọn & trả nhiều hơn', 'Số lượng cửa hàng', 'Ngân sách quảng cáo'], correctIndex: 1, explanation: 'Equity là cái bóng tài chính của một vị trí mạnh.' },
  { id: 'q2', question: 'Đỉnh của kim tự tháp CBBE (Keller) là?', options: ['Salience (nhận diện)', 'Resonance (cộng hưởng — lòng trung thành)', 'Performance', 'Giá'], correctIndex: 1, explanation: 'CBBE leo từ salience → performance/imagery → judgments/feelings → resonance.' },
  { id: 'q3', question: 'Mục đích của "brand tracking" là?', options: ['Chỉ để in báo cáo', 'Lặp phép đo theo lịch để thấy vị trí mạnh lên/trôi dạt/bị tấn công trước khi doanh số rơi', 'Đếm nhân viên', 'Tính thuế'], correctIndex: 1, explanation: 'Theo dõi định kỳ giúp phát hiện sớm thay đổi của vị trí.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'BPD301',
    slug: 'bpd301-strategic-brand-positioning-differentiation',
    title: 'Strategic Brand Positioning & Differentiation',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/BPD301.webp',
    shortDescription: 'Win a place in the customer\'s mind — positioning (Ries & Trout), points of parity/difference, positioning statements, perceptual maps, Kapferer\'s prism, differentiation & Zag, architecture, touchpoints, repositioning & equity. Real brands, quizzes.|||Giành chỗ trong tâm trí khách hàng — định vị (Ries & Trout), điểm tương đồng/khác biệt, positioning statement, perceptual map, prism Kapferer, khác biệt hoá & Zag, kiến trúc, điểm chạm, tái định vị & tài sản thương hiệu. Thương hiệu thật, quiz.',
    description: 'Môn <strong>BPD301 — Strategic Brand Positioning &amp; Differentiation</strong> (khối Công nghệ Truyền thông, kỳ 5) dạy cách giành và bảo vệ một <strong>vị trí rõ ràng, khác biệt trong tâm trí khách hàng</strong>. Từ <strong>định vị</strong> (Ries &amp; Trout) → <strong>bối cảnh</strong> (ngành, đối thủ, POP/POD của Keller) → <strong>công cụ</strong> (positioning statement, perceptual map, lăng kính Kapferer) → <strong>khác biệt hoá</strong> (USP, brand mantra, Zag/onliness của Neumeier) → <strong>kiến trúc &amp; bản sắc</strong> (Aaker) → <strong>điểm chạm</strong> → <strong>tái định vị</strong> → <strong>đo lường tài sản thương hiệu</strong>. Song ngữ, ví dụ thật (Volvo, Apple, Tesla, Biti\'s), quiz mỗi chương.',
    whatYouLearn: 'Định vị là gì (Ries & Trout, trận chiến trong tâm trí); frame of reference, đối thủ, khách hàng mục tiêu, POP/POD (Keller); positioning statement, perceptual map, brand identity prism (Kapferer); USP, brand mantra, Zag/onliness (Neumeier); kiến trúc thương hiệu (branded house vs house of brands), essence/personality/values (Aaker); định vị qua điểm chạm & nhất quán; tái định vị, brand extension & tránh loãng; brand equity (CBBE, Aaker), awareness/association, brand tracking.',
    requirements: 'Không cần kiến thức tiên quyết chuyên sâu. Nên có hiểu biết marketing cơ bản. Xem điều kiện tiên quyết của khối Công nghệ Truyền thông trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: '5 sách kinh điển, tài liệu miễn phí, YouTube, công cụ, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Định vị & khác biệt hoá là gì, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Định vị là gì|||Chapter 1 — What positioning is', description: 'Ries & Trout, tâm trí là chiến trường, khác biệt được ghi nhớ.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Bối cảnh định vị|||Chapter 2 — Positioning context', description: 'Ngành, đối thủ, khách hàng mục tiêu, POP/POD.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Mô hình & công cụ|||Chapter 3 — Models & tools', description: 'Positioning statement, perceptual map, prism Kapferer.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Khác biệt hoá|||Chapter 4 — Differentiation', description: 'USP, brand mantra, Zag/onliness của Neumeier.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Kiến trúc & bản sắc|||Chapter 5 — Architecture & identity', description: 'Brand architecture, essence, personality, values (Aaker).', lessons: [c5, c5q] },
    { title: 'Chương 6 — Định vị qua điểm chạm|||Chapter 6 — Touchpoints', description: 'Trải nghiệm, mọi điểm chạm cùng câu chuyện, nhất quán.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Tái định vị|||Chapter 7 — Repositioning', description: 'Khi nào tái định vị, brand extension, tránh loãng/lẫn.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đo lường sức mạnh|||Chapter 8 — Measuring strength', description: 'Brand equity (CBBE, Aaker), awareness/association, tracking.', lessons: [c8, c8q] },
  ],
};
