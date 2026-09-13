/**
 * VCM202 — Visual Communication (Truyền thông thị giác). Ngành Thiết kế mỹ
 * thuật số FPTU, kỳ 1. Khung 8 chương theo giáo trình chuẩn quốc tế:
 * Lupton "Graphic Design: The New Basics", Arntson "Graphic Design Basics",
 * Berger "Ways of Seeing", Gestalt, Canva Design School, Adobe. Song ngữ +
 * ví dụ tác phẩm/thương hiệu thật + quiz mỗi chương.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick lồng/${; "&"→&amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('vcm202-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Lupton, Arntson, Berger), Canva Design School, Adobe, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">VCM202 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>visual communication</strong> — design elements &amp; principles, Gestalt, colour, typography, semiotics and applied projects — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for VCM202 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Graphic Design: The New Basics</em> — Ellen Lupton &amp; Jennifer Cole Phillips (the core elements &amp; principles text).</li>
<li><em>Graphic Design Basics</em> — Amy Arntson (classic intro to visual design).</li>
<li><em>Ways of Seeing</em> — John Berger (how we read images, meaning &amp; context).</li>
</ul>
<h3>🌐 Official / free learning</h3>
<ul>
<li><a href="https://www.canva.com/learn/" target="_blank" rel="noopener">Canva Design School</a> — free courses on colour, type &amp; layout.</li>
<li><a href="https://helpx.adobe.com/design.html" target="_blank" rel="noopener">Adobe Design &amp; tutorials</a> — Photoshop, Illustrator, InDesign basics.</li>
<li><a href="https://www.interaction-design.org/literature/topics/gestalt-principles" target="_blank" rel="noopener">Interaction Design Foundation — Gestalt principles</a>.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@TheFutur" target="_blank" rel="noopener">The Futur</a> — design theory, branding &amp; typography.</li>
<li><a href="https://www.youtube.com/@satori_graphics" target="_blank" rel="noopener">Satori Graphics</a> — practical graphic design tips.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> — layout &amp; UI design in the browser.</li>
<li><a href="https://color.adobe.com/" target="_blank" rel="noopener">Adobe Color</a> — build &amp; test colour palettes.</li>
<li><a href="https://fonts.google.com/" target="_blank" rel="noopener">Google Fonts</a> — free typefaces &amp; pairing ideas.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>See the language</strong> — elements (point/line/shape) &amp; principles (balance/contrast/hierarchy).</li>
<li><strong>Practice</strong> — recreate a poster you admire; name every principle it uses.</li>
<li><strong>Go deeper</strong> — Gestalt, colour theory, typographic hierarchy &amp; grids.</li>
<li><strong>Job-ready</strong> — read images critically (semiotics) and build a small portfolio: poster, infographic, mini brand.</li>
</ol></div>`,
    `<span class="eyebrow">VCM202 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>truyền thông thị giác</strong> — yếu tố &amp; nguyên lý thiết kế, Gestalt, màu sắc, chữ, ký hiệu học và dự án ứng dụng — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của VCM202 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Graphic Design: The New Basics</em> — Ellen Lupton &amp; Jennifer Cole Phillips (sách lõi về yếu tố &amp; nguyên lý).</li>
<li><em>Graphic Design Basics</em> — Amy Arntson (nhập môn thiết kế thị giác kinh điển).</li>
<li><em>Ways of Seeing</em> — John Berger (cách ta đọc hình ảnh, nghĩa &amp; ngữ cảnh).</li>
</ul>
<h3>🌐 Học chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.canva.com/learn/" target="_blank" rel="noopener">Canva Design School</a> — khoá miễn phí về màu, chữ &amp; bố cục.</li>
<li><a href="https://helpx.adobe.com/design.html" target="_blank" rel="noopener">Adobe Design &amp; hướng dẫn</a> — Photoshop, Illustrator, InDesign căn bản.</li>
<li><a href="https://www.interaction-design.org/literature/topics/gestalt-principles" target="_blank" rel="noopener">Interaction Design Foundation — nguyên lý Gestalt</a>.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@TheFutur" target="_blank" rel="noopener">The Futur</a> — lý thuyết thiết kế, thương hiệu &amp; chữ.</li>
<li><a href="https://www.youtube.com/@satori_graphics" target="_blank" rel="noopener">Satori Graphics</a> — mẹo thiết kế đồ hoạ thực hành.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a> — dựng bố cục &amp; giao diện trên trình duyệt.</li>
<li><a href="https://color.adobe.com/" target="_blank" rel="noopener">Adobe Color</a> — tạo &amp; thử bảng màu.</li>
<li><a href="https://fonts.google.com/" target="_blank" rel="noopener">Google Fonts</a> — font miễn phí &amp; gợi ý phối chữ.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Thấy được ngôn ngữ</strong> — yếu tố (điểm/đường/hình) &amp; nguyên lý (cân bằng/tương phản/nhấn mạnh).</li>
<li><strong>Luyện tập</strong> — vẽ lại một poster bạn thích; gọi tên từng nguyên lý nó dùng.</li>
<li><strong>Đào sâu</strong> — Gestalt, lý thuyết màu, phân cấp chữ &amp; lưới.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc hình ảnh có phản biện (ký hiệu học) và dựng portfolio nhỏ: poster, infographic, bộ nhận diện mini.</li>
</ol></div>`,
  ]]);

const intro = doc('vcm202-0-1-overview', 'Course overview: Visual communication|||Tổng quan: Truyền thông thị giác',
  'Thiết kế truyền đạt bằng hình ảnh: yếu tố → nguyên lý → Gestalt → màu → chữ & bố cục → ký hiệu học → ứng dụng (poster, infographic, branding).',
  [[
    `<span class="eyebrow">VCM202 · Lesson 0.1 · Overview</span>
<h2>Visual Communication</h2>
<p class="lead">This course teaches you to <strong>communicate ideas with images</strong> — how visual messages are built, why some designs are instantly clear while others confuse, and how to make deliberate choices instead of guessing.</p>
<h3>What you will be able to do</h3>
<ul>
<li>Break any design into its <strong>elements</strong> (point, line, shape, colour, type) and <strong>principles</strong> (balance, contrast, hierarchy).</li>
<li>Use <strong>Gestalt</strong> to control how the eye groups and reads a layout.</li>
<li>Choose <strong>colour</strong> and <strong>typography</strong> that carry the right meaning and mood.</li>
<li>Read images critically with <strong>semiotics</strong>, then apply it all to posters, infographics and brand identities.</li>
</ul>
<h3>Roadmap</h3>
<p>What visual communication is → design elements → design principles → Gestalt → colour → type &amp; layout → semiotics &amp; imagery → applied projects. Bilingual, with real works and brands analysed in every chapter.</p>`,
    `<span class="eyebrow">VCM202 · Bài 0.1 · Tổng quan</span>
<h2>Truyền thông thị giác</h2>
<p class="lead">Môn này dạy bạn <strong>truyền đạt ý tưởng bằng hình ảnh</strong> — thông điệp thị giác được dựng thế nào, vì sao có thiết kế rõ ngay còn thiết kế khác gây rối, và làm sao ra quyết định có chủ đích thay vì đoán mò.</p>
<h3>Bạn sẽ làm được gì</h3>
<ul>
<li>Tách bất kỳ thiết kế nào thành <strong>yếu tố</strong> (điểm, đường, hình, màu, chữ) và <strong>nguyên lý</strong> (cân bằng, tương phản, phân cấp).</li>
<li>Dùng <strong>Gestalt</strong> để điều khiển cách mắt nhóm và đọc bố cục.</li>
<li>Chọn <strong>màu sắc</strong> và <strong>chữ (typography)</strong> mang đúng nghĩa và cảm xúc.</li>
<li>Đọc hình ảnh có phản biện bằng <strong>ký hiệu học</strong>, rồi áp vào poster, infographic và nhận diện thương hiệu.</li>
</ul>
<h3>Lộ trình</h3>
<p>Truyền thông thị giác là gì → yếu tố thiết kế → nguyên lý thiết kế → Gestalt → màu sắc → chữ &amp; bố cục → ký hiệu học &amp; hình ảnh → dự án ứng dụng. Song ngữ, mỗi chương có tác phẩm và thương hiệu thật để phân tích.</p>`,
  ]]);

const c1 = doc('vcm202-1-1-what-is-vc', '1.1 — What is visual communication|||1.1 — Truyền thông thị giác là gì',
  'Định nghĩa, vai trò; quy trình truyền đạt bằng hình ảnh (người gửi → mã hoá → thông điệp → giải mã → người nhận); vì sao hình ảnh mạnh.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 1 · Lesson 1.1</span>
<h2>What is visual communication?</h2>
<p><strong>Visual communication</strong> is conveying ideas, information and emotion through visual form — images, symbols, colour, type and layout — rather than words alone. It works because the brain processes images far faster than text: a road sign, an app icon or a logo is understood in a glance.</p>
<h3>The communication process</h3>
<pre><code>Sender -> Encode (into visual form) -> Message
       -> Channel (poster, screen, packaging)
       -> Decode (viewer interprets) -> Receiver
</code></pre>
<p>Good design controls <em>encoding</em> so the viewer <em>decodes</em> the intended meaning. Noise (clutter, poor contrast, wrong culture cues) distorts the message.</p>
<h3>Where it lives</h3>
<ul>
<li><strong>Wayfinding</strong> — airport pictograms, the London Underground map.</li>
<li><strong>Brand identity</strong> — the Apple logo, Coca-Cola red &amp; script.</li>
<li><strong>Information</strong> — weather infographics, dashboards, safety cards.</li>
</ul>
<div class="callout"><span class="badge">Real example</span> The <strong>1972 Munich Olympics pictograms</strong> by Otl Aicher let visitors from any country find a sport with no shared language — pure visual communication.</div>`,
    `<span class="eyebrow">VCM202 · Chương 1 · Bài 1.1</span>
<h2>Truyền thông thị giác là gì?</h2>
<p><strong>Truyền thông thị giác</strong> là truyền đạt ý tưởng, thông tin và cảm xúc qua hình thức thị giác — hình ảnh, ký hiệu, màu, chữ và bố cục — thay vì chỉ bằng lời. Nó hiệu quả vì não xử lý hình ảnh nhanh hơn chữ rất nhiều: một biển báo, một icon ứng dụng hay một logo được hiểu chỉ trong một cái liếc.</p>
<h3>Quy trình truyền đạt</h3>
<pre><code>Người gửi -> Mã hoá (thành hình thức thị giác) -> Thông điệp
          -> Kênh (poster, màn hình, bao bì)
          -> Giải mã (người xem diễn giải) -> Người nhận
</code></pre>
<p>Thiết kế tốt kiểm soát khâu <em>mã hoá</em> để người xem <em>giải mã</em> ra đúng nghĩa mong muốn. Nhiễu (rối rắm, tương phản kém, sai tín hiệu văn hoá) làm méo thông điệp.</p>
<h3>Nó ở đâu</h3>
<ul>
<li><strong>Định hướng</strong> — biểu tượng sân bay, bản đồ tàu điện ngầm London.</li>
<li><strong>Nhận diện thương hiệu</strong> — logo Apple, sắc đỏ &amp; chữ viết tay Coca-Cola.</li>
<li><strong>Thông tin</strong> — infographic thời tiết, dashboard, thẻ hướng dẫn an toàn.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thật</span> Bộ <strong>biểu tượng Olympic Munich 1972</strong> của Otl Aicher giúp khách từ mọi nước tìm được môn thi mà không cần chung ngôn ngữ — truyền thông thị giác thuần tuý.</div>`,
  ]]);

const c1q = quiz('vcm202-quiz-1', 'Quiz 1 — What is VC|||Quiz 1 — Truyền thông thị giác là gì', [
  { id: 'q1', question: 'Truyền thông thị giác là gì?', options: ['Chỉ viết chữ cho đẹp', 'Truyền đạt ý tưởng/thông tin bằng hình thức thị giác', 'Chụp ảnh sản phẩm', 'Lập trình giao diện'], correctIndex: 1, explanation: 'Là truyền đạt bằng hình ảnh, ký hiệu, màu, chữ, bố cục — không chỉ bằng lời.' },
  { id: 'q2', question: 'Trong quy trình truyền đạt, khâu người xem diễn giải thông điệp gọi là?', options: ['Mã hoá (encode)', 'Giải mã (decode)', 'Kênh (channel)', 'Nhiễu (noise)'], correctIndex: 1, explanation: 'Người gửi mã hoá; người nhận giải mã (decode) thông điệp.' },
  { id: 'q3', question: 'Vì sao hình ảnh mạnh hơn chữ trong nhiều tình huống?', options: ['Vì luôn đẹp hơn', 'Vì não xử lý hình ảnh nhanh, hiểu trong một cái liếc', 'Vì rẻ hơn', 'Vì không cần thiết kế'], correctIndex: 1, explanation: 'Biển báo, icon, logo được hiểu tức thì nhờ tốc độ xử lý hình ảnh của não.' },
]);

const c2 = doc('vcm202-2-1-elements', '2.1 — Design elements|||2.1 — Yếu tố thiết kế',
  'Điểm, đường, hình (shape), mảng/khối (form), texture, không gian — những viên gạch của mọi thiết kế thị giác.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 2 · Lesson 2.1</span>
<h2>Design elements — the building blocks</h2>
<p>Every visual is made of a small set of <strong>elements</strong>. Learn to see them and you can dissect — and build — any design.</p>
<ul>
<li><strong>Point</strong> — a single mark; the eye is drawn to it. A logo dot or a bullet.</li>
<li><strong>Line</strong> — a point in motion; directs the eye, divides space, conveys energy (diagonal) or calm (horizontal).</li>
<li><strong>Shape</strong> — a closed area (geometric or organic). Circles feel friendly, triangles feel dynamic.</li>
<li><strong>Form</strong> — shape with the illusion of depth/volume (light &amp; shadow).</li>
<li><strong>Texture</strong> — the surface feel, real or implied (rough paper, smooth gradient).</li>
<li><strong>Space</strong> — the area around and between elements; <em>negative space</em> is as important as the objects.</li>
</ul>
<h3>Negative space in action</h3>
<p>The <strong>FedEx</strong> logo hides an arrow in the space between the E and x — an element made of nothing but space. The <strong>WWF panda</strong> is built from a few shapes plus the white we read as the body.</p>
<div class="callout"><span class="badge">Try it</span> Pick any poster and label its points, lines, shapes and the negative space. You will never look at design the same way again.</div>`,
    `<span class="eyebrow">VCM202 · Chương 2 · Bài 2.1</span>
<h2>Yếu tố thiết kế — những viên gạch</h2>
<p>Mọi hình ảnh đều dựng từ một bộ nhỏ các <strong>yếu tố</strong>. Học nhìn ra chúng là bạn có thể mổ xẻ — và dựng — bất kỳ thiết kế nào.</p>
<ul>
<li><strong>Điểm (point)</strong> — một dấu đơn; mắt bị hút vào nó. Chấm trong logo hay một bullet.</li>
<li><strong>Đường (line)</strong> — điểm chuyển động; dẫn mắt, chia không gian, tạo năng lượng (chéo) hay tĩnh lặng (ngang).</li>
<li><strong>Hình (shape)</strong> — một vùng khép kín (hình học hoặc hữu cơ). Hình tròn thân thiện, tam giác năng động.</li>
<li><strong>Khối (form)</strong> — hình có ảo giác chiều sâu/thể tích (sáng &amp; tối).</li>
<li><strong>Chất liệu (texture)</strong> — cảm giác bề mặt, thật hoặc gợi (giấy nhám, gradient mượt).</li>
<li><strong>Không gian (space)</strong> — vùng quanh và giữa các yếu tố; <em>không gian âm</em> quan trọng ngang với vật thể.</li>
</ul>
<h3>Không gian âm khi hoạt động</h3>
<p>Logo <strong>FedEx</strong> giấu một mũi tên trong khoảng trống giữa chữ E và x — một yếu tố làm từ chính không gian. <strong>Gấu trúc WWF</strong> dựng từ vài mảng hình cộng phần trắng mà ta đọc thành thân gấu.</p>
<div class="callout"><span class="badge">Thử ngay</span> Chọn một poster bất kỳ và gắn nhãn các điểm, đường, hình và không gian âm. Bạn sẽ không còn nhìn thiết kế như cũ.</div>`,
  ]]);

const c2q = quiz('vcm202-quiz-2', 'Quiz 2 — Elements|||Quiz 2 — Yếu tố thiết kế', [
  { id: 'q1', question: 'Yếu tố nào là "điểm chuyển động", dùng để dẫn mắt và chia không gian?', options: ['Điểm', 'Đường (line)', 'Chất liệu', 'Khối'], correctIndex: 1, explanation: 'Đường là điểm chuyển động; đường ngang gợi tĩnh, đường chéo gợi năng lượng.' },
  { id: 'q2', question: 'Khoảng trống quanh và giữa các đối tượng, quan trọng ngang vật thể, gọi là?', options: ['Texture', 'Không gian âm (negative space)', 'Điểm nhấn', 'Khối'], correctIndex: 1, explanation: 'Không gian âm định hình bố cục; logo FedEx giấu mũi tên trong đó.' },
  { id: 'q3', question: 'Logo FedEx nổi tiếng vì ẩn yếu tố gì trong không gian âm?', options: ['Một ngôi sao', 'Một mũi tên giữa E và x', 'Một hình tròn', 'Một chữ ký'], correctIndex: 1, explanation: 'Mũi tên nằm ở khoảng trống giữa E và x — ví dụ kinh điển về không gian âm.' },
]);

const c3 = doc('vcm202-3-1-principles', '3.1 — Design principles|||3.1 — Nguyên lý thiết kế',
  'Cân bằng, tương phản, nhịp điệu, nhấn mạnh, thống nhất, tỉ lệ — cách sắp xếp các yếu tố để thiết kế hiệu quả.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 3 · Lesson 3.1</span>
<h2>Design principles — how elements work together</h2>
<p>If elements are the words, <strong>principles</strong> are the grammar — the rules for arranging elements so a design reads clearly.</p>
<ul>
<li><strong>Balance</strong> — visual weight distributed evenly. <em>Symmetrical</em> feels formal/stable; <em>asymmetrical</em> feels dynamic and modern.</li>
<li><strong>Contrast</strong> — difference (big/small, dark/light, thick/thin) that creates interest and aids reading.</li>
<li><strong>Rhythm</strong> — repeated elements at intervals that lead the eye, like a beat.</li>
<li><strong>Emphasis</strong> — one clear focal point; what the viewer sees first.</li>
<li><strong>Unity</strong> — everything feels like it belongs to one piece (consistent colour, type, spacing).</li>
<li><strong>Proportion / scale</strong> — relative size shows importance; big = loud, small = quiet.</li>
</ul>
<h3>Real example</h3>
<p>A <strong>Nike ad</strong> uses strong <em>emphasis</em> (one athlete), high <em>contrast</em> (bold subject on plain ground), and <em>unity</em> (one typeface, the swoosh) — you get the message in a second. The <strong>rule of thirds</strong> and <strong>golden ratio</strong> are classic proportion guides.</p>
<div class="callout"><span class="badge">Diagnostic</span> When a layout feels wrong, name the missing principle: no focal point (emphasis), everything the same size (contrast), or parts that clash (unity).</div>`,
    `<span class="eyebrow">VCM202 · Chương 3 · Bài 3.1</span>
<h2>Nguyên lý thiết kế — cách các yếu tố phối hợp</h2>
<p>Nếu yếu tố là từ, thì <strong>nguyên lý</strong> là ngữ pháp — luật sắp xếp các yếu tố để thiết kế đọc ra rõ ràng.</p>
<ul>
<li><strong>Cân bằng (balance)</strong> — sức nặng thị giác phân bố đều. <em>Đối xứng</em> gợi trang trọng/ổn định; <em>bất đối xứng</em> gợi năng động, hiện đại.</li>
<li><strong>Tương phản (contrast)</strong> — sự khác biệt (to/nhỏ, đậm/nhạt, dày/mảnh) tạo hứng thú và giúp đọc dễ.</li>
<li><strong>Nhịp điệu (rhythm)</strong> — yếu tố lặp theo khoảng cách dẫn mắt như một nhịp.</li>
<li><strong>Nhấn mạnh (emphasis)</strong> — một điểm nhấn rõ; thứ người xem thấy trước tiên.</li>
<li><strong>Thống nhất (unity)</strong> — mọi thứ thuộc về một tổng thể (màu, chữ, khoảng cách nhất quán).</li>
<li><strong>Tỉ lệ (proportion/scale)</strong> — kích thước tương đối cho biết mức quan trọng; to = mạnh, nhỏ = nhẹ.</li>
</ul>
<h3>Ví dụ thật</h3>
<p>Một <strong>quảng cáo Nike</strong> dùng <em>nhấn mạnh</em> mạnh (một vận động viên), <em>tương phản</em> cao (chủ thể đậm trên nền trơn) và <em>thống nhất</em> (một font, dấu swoosh) — bạn hiểu thông điệp trong một giây. <strong>Quy tắc một phần ba</strong> và <strong>tỉ lệ vàng</strong> là những chuẩn tỉ lệ kinh điển.</p>
<div class="callout"><span class="badge">Chẩn đoán</span> Khi bố cục thấy sai, hãy gọi tên nguyên lý còn thiếu: không có điểm nhấn (nhấn mạnh), mọi thứ cùng cỡ (tương phản), hoặc các phần đá nhau (thống nhất).</div>`,
  ]]);

const c3q = quiz('vcm202-quiz-3', 'Quiz 3 — Principles|||Quiz 3 — Nguyên lý thiết kế', [
  { id: 'q1', question: 'Nguyên lý tạo một điểm mà người xem thấy trước tiên là?', options: ['Nhịp điệu', 'Nhấn mạnh (emphasis)', 'Cân bằng', 'Thống nhất'], correctIndex: 1, explanation: 'Nhấn mạnh tạo focal point — thứ hút mắt đầu tiên.' },
  { id: 'q2', question: 'Bố cục đối xứng thường gợi cảm giác gì?', options: ['Hỗn loạn', 'Trang trọng, ổn định', 'Năng động, hiện đại', 'Buồn bã'], correctIndex: 1, explanation: 'Đối xứng gợi trang trọng/ổn định; bất đối xứng gợi năng động, hiện đại.' },
  { id: 'q3', question: 'Sự khác biệt to/nhỏ, đậm/nhạt để tạo hứng thú và dễ đọc là nguyên lý?', options: ['Tương phản (contrast)', 'Thống nhất', 'Tỉ lệ', 'Nhịp điệu'], correctIndex: 0, explanation: 'Tương phản dùng khác biệt để tạo điểm chú ý và tăng khả năng đọc.' },
]);

const c4 = doc('vcm202-4-1-gestalt', '4.1 — Gestalt principles|||4.1 — Nguyên lý Gestalt',
  'Proximity, similarity, closure, continuity, figure-ground — cách mắt tự nhóm và tổ chức các phần rời thành tổng thể.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 4 · Lesson 4.1</span>
<h2>Gestalt — the eye groups automatically</h2>
<p><strong>Gestalt</strong> (German for "whole") describes how we perceive separate parts as organised wholes. "The whole is other than the sum of its parts." Designers exploit these rules to guide perception.</p>
<ul>
<li><strong>Proximity</strong> — things placed close together are read as a group. Spacing alone can organise a form.</li>
<li><strong>Similarity</strong> — items sharing colour, shape or size are seen as related.</li>
<li><strong>Closure</strong> — the mind completes missing parts to see a whole shape.</li>
<li><strong>Continuity</strong> — the eye follows lines and curves, preferring smooth paths.</li>
<li><strong>Figure-ground</strong> — we separate an object (figure) from its background (ground); ambiguous cases flip (the Rubin vase / two faces).</li>
</ul>
<h3>Real examples</h3>
<p>The <strong>WWF panda</strong> and the <strong>IBM 8-bar logo</strong> rely on <em>closure</em> — you complete the shapes. The <strong>NBC peacock</strong> and <strong>USA Network</strong> logos use <em>figure-ground</em>. Menus and forms use <em>proximity</em> so labels bind to the right fields.</p>
<div class="callout"><span class="badge">Why it matters</span> Gestalt is how you build structure without drawing boxes — group by space and similarity instead of adding clutter.</div>`,
    `<span class="eyebrow">VCM202 · Chương 4 · Bài 4.1</span>
<h2>Gestalt — mắt tự động nhóm lại</h2>
<p><strong>Gestalt</strong> (tiếng Đức nghĩa là "tổng thể") mô tả cách ta tri giác các phần rời thành những tổng thể có tổ chức. "Tổng thể khác với tổng của các phần." Nhà thiết kế tận dụng các quy luật này để dẫn dắt tri giác.</p>
<ul>
<li><strong>Gần nhau (proximity)</strong> — vật đặt gần nhau được đọc thành một nhóm. Chỉ riêng khoảng cách đã tổ chức được một biểu mẫu.</li>
<li><strong>Tương đồng (similarity)</strong> — vật cùng màu, hình hay cỡ được thấy là liên quan.</li>
<li><strong>Khép kín (closure)</strong> — trí óc bù phần thiếu để thấy một hình trọn vẹn.</li>
<li><strong>Liên tục (continuity)</strong> — mắt đi theo đường và cong, thích đường mượt.</li>
<li><strong>Hình-nền (figure-ground)</strong> — ta tách đối tượng (hình) khỏi nền (ground); ca nhập nhằng thì lật qua lại (bình Rubin / hai khuôn mặt).</li>
</ul>
<h3>Ví dụ thật</h3>
<p><strong>Gấu trúc WWF</strong> và <strong>logo 8 vạch IBM</strong> dựa vào <em>khép kín</em> — bạn tự bù nốt hình. Logo <strong>con công NBC</strong> và <strong>USA Network</strong> dùng <em>hình-nền</em>. Menu và biểu mẫu dùng <em>gần nhau</em> để nhãn dính đúng vào ô nhập.</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Gestalt giúp bạn tạo cấu trúc mà không cần vẽ khung — nhóm bằng khoảng cách và tương đồng thay vì thêm rối.</div>`,
  ]]);

const c4q = quiz('vcm202-quiz-4', 'Quiz 4 — Gestalt|||Quiz 4 — Gestalt', [
  { id: 'q1', question: 'Nguyên lý Gestalt nào nói "vật đặt gần nhau được đọc thành một nhóm"?', options: ['Similarity', 'Proximity (gần nhau)', 'Closure', 'Figure-ground'], correctIndex: 1, explanation: 'Proximity: khoảng cách gần khiến mắt nhóm các vật lại.' },
  { id: 'q2', question: 'Logo gấu trúc WWF khai thác nguyên lý nào khi ta tự bù phần thiếu?', options: ['Closure (khép kín)', 'Continuity', 'Similarity', 'Proximity'], correctIndex: 0, explanation: 'Closure: trí óc hoàn thiện hình còn dang dở thành một tổng thể.' },
  { id: 'q3', question: 'Việc tách đối tượng khỏi nền, đôi khi lật qua lại (bình Rubin) là?', options: ['Figure-ground (hình-nền)', 'Rhythm', 'Balance', 'Continuity'], correctIndex: 0, explanation: 'Figure-ground: phân biệt hình và nền; ca nhập nhằng thì đảo vai.' },
]);

const c5 = doc('vcm202-5-1-color', '5.1 — Colour|||5.1 — Màu sắc',
  'Lý thuyết màu, bánh xe màu, hệ RGB (màn hình) vs CMYK (in), tâm lý màu, các sơ đồ phối màu (bổ túc, tương đồng, bộ ba).',
  [[
    `<span class="eyebrow">VCM202 · Chapter 5 · Lesson 5.1</span>
<h2>Colour — theory, systems &amp; psychology</h2>
<h3>The colour wheel</h3>
<p>Built from <strong>primary</strong> (red, yellow, blue), <strong>secondary</strong> and <strong>tertiary</strong> hues. Every colour has three properties: <strong>hue</strong> (which colour), <strong>saturation</strong> (intensity) and <strong>value</strong> (light/dark).</p>
<h3>RGB vs CMYK</h3>
<ul>
<li><strong>RGB</strong> (red-green-blue) — <em>additive</em> light, for screens. Mixing all = white.</li>
<li><strong>CMYK</strong> (cyan-magenta-yellow-black) — <em>subtractive</em> ink, for print. Mixing all approaches black.</li>
</ul>
<p>Design for screen in RGB, for print in CMYK — colours can shift between them, so proof before printing.</p>
<h3>Colour schemes</h3>
<ul>
<li><strong>Complementary</strong> — opposites (blue/orange); high energy, high contrast.</li>
<li><strong>Analogous</strong> — neighbours (blue/teal/green); harmonious, calm.</li>
<li><strong>Triadic</strong> — three evenly spaced; balanced and vibrant.</li>
</ul>
<h3>Colour psychology &amp; brands</h3>
<p>Red = energy/urgency (<strong>Coca-Cola</strong>, YouTube); blue = trust/calm (<strong>Facebook</strong>, PayPal); green = nature/health (<strong>Spotify</strong>, Starbucks); yellow = optimism (<strong>McDonald's</strong>). Meaning is also cultural — white is purity in the West, mourning in parts of Asia.</p>
<div class="callout"><span class="badge">Accessibility</span> Never rely on colour alone; keep enough text-to-background contrast so everyone, including colour-blind viewers, can read it.</div>`,
    `<span class="eyebrow">VCM202 · Chương 5 · Bài 5.1</span>
<h2>Màu sắc — lý thuyết, hệ màu &amp; tâm lý</h2>
<h3>Bánh xe màu</h3>
<p>Dựng từ màu <strong>bậc một</strong> (đỏ, vàng, lam), <strong>bậc hai</strong> và <strong>bậc ba</strong>. Mỗi màu có ba thuộc tính: <strong>tông (hue)</strong> (màu gì), <strong>độ bão hoà (saturation)</strong> (đậm nhạt cường độ) và <strong>độ sáng (value)</strong> (sáng/tối).</p>
<h3>RGB và CMYK</h3>
<ul>
<li><strong>RGB</strong> (đỏ-lục-lam) — ánh sáng <em>cộng</em>, cho màn hình. Trộn hết = trắng.</li>
<li><strong>CMYK</strong> (lục lam-hồng sen-vàng-đen) — mực <em>trừ</em>, cho in ấn. Trộn hết tiến về đen.</li>
</ul>
<p>Thiết kế cho màn hình dùng RGB, cho in dùng CMYK — màu có thể lệch giữa hai hệ, nên in thử (proof) trước.</p>
<h3>Các sơ đồ phối màu</h3>
<ul>
<li><strong>Bổ túc (complementary)</strong> — đối nhau (lam/cam); nhiều năng lượng, tương phản cao.</li>
<li><strong>Tương đồng (analogous)</strong> — liền kề (lam/xanh mòng két/lục); hài hoà, dịu.</li>
<li><strong>Bộ ba (triadic)</strong> — ba màu cách đều; cân bằng và rực.</li>
</ul>
<h3>Tâm lý màu &amp; thương hiệu</h3>
<p>Đỏ = năng lượng/khẩn cấp (<strong>Coca-Cola</strong>, YouTube); lam = tin cậy/điềm tĩnh (<strong>Facebook</strong>, PayPal); lục = thiên nhiên/sức khoẻ (<strong>Spotify</strong>, Starbucks); vàng = lạc quan (<strong>McDonald's</strong>). Nghĩa còn tuỳ văn hoá — trắng là tinh khiết ở phương Tây nhưng là tang tóc ở nhiều nơi châu Á.</p>
<div class="callout"><span class="badge">Khả dụng</span> Đừng chỉ dựa vào màu; giữ đủ tương phản chữ với nền để mọi người, kể cả người mù màu, đọc được.</div>`,
  ]]);

const c5q = quiz('vcm202-quiz-5', 'Quiz 5 — Colour|||Quiz 5 — Màu sắc', [
  { id: 'q1', question: 'Hệ màu nào dùng cho MÀN HÌNH (ánh sáng cộng)?', options: ['CMYK', 'RGB', 'Pantone', 'Grayscale'], correctIndex: 1, explanation: 'RGB là ánh sáng cộng cho màn hình; CMYK là mực trừ cho in.' },
  { id: 'q2', question: 'Hai màu đối nhau trên bánh xe (vd lam/cam) tạo sơ đồ phối màu?', options: ['Tương đồng (analogous)', 'Bổ túc (complementary)', 'Đơn sắc', 'Bộ ba'], correctIndex: 1, explanation: 'Bổ túc dùng cặp màu đối nhau, cho tương phản cao.' },
  { id: 'q3', question: 'Màu lam trong thương hiệu (Facebook, PayPal) thường gợi?', options: ['Khẩn cấp', 'Tin cậy, điềm tĩnh', 'Nguy hiểm', 'Rẻ tiền'], correctIndex: 1, explanation: 'Lam gắn với tin cậy và điềm tĩnh — nhưng nghĩa màu còn tuỳ văn hoá.' },
]);

const c6 = doc('vcm202-6-1-type-layout', '6.1 — Typography & layout|||6.1 — Chữ & bố cục',
  'Typography cơ bản (serif/sans-serif, kerning/leading), phân cấp thị giác (hierarchy), hệ lưới (grid) và bố cục (layout).',
  [[
    `<span class="eyebrow">VCM202 · Chapter 6 · Lesson 6.1</span>
<h2>Typography &amp; layout</h2>
<h3>Type basics</h3>
<ul>
<li><strong>Serif</strong> (Times, Garamond) — small feet; traditional, editorial.</li>
<li><strong>Sans-serif</strong> (Helvetica, Arial) — clean, modern, great on screen.</li>
<li><strong>Kerning</strong> (space between two letters), <strong>tracking</strong> (across a word), <strong>leading</strong> (line spacing) — control readability.</li>
</ul>
<h3>Hierarchy</h3>
<p><strong>Visual hierarchy</strong> ranks content so the eye knows what to read first: large bold headline → subhead → body → caption. Achieved with size, weight, colour and spacing — not decoration.</p>
<h3>Grids &amp; layout</h3>
<p>A <strong>grid</strong> is an invisible skeleton of columns and margins that aligns everything, creating order and rhythm. Magazines, newspapers and websites all sit on grids. The <strong>Swiss / International Typographic Style</strong> (Helvetica + grid, Josef Müller-Brockmann) is the classic reference.</p>
<div class="callout"><span class="badge">Real example</span> The <strong>New York Times</strong> masthead pairs a serif for authority with a strict grid; <strong>Google</strong> and <strong>Spotify</strong> use clean sans-serifs and strong hierarchy so screens stay scannable.</div>`,
    `<span class="eyebrow">VCM202 · Chương 6 · Bài 6.1</span>
<h2>Chữ &amp; bố cục</h2>
<h3>Cơ bản về chữ</h3>
<ul>
<li><strong>Serif</strong> (Times, Garamond) — có chân nhỏ; truyền thống, phù hợp báo chí/xuất bản.</li>
<li><strong>Sans-serif</strong> (Helvetica, Arial) — sạch, hiện đại, đọc tốt trên màn hình.</li>
<li><strong>Kerning</strong> (khoảng giữa hai chữ cái), <strong>tracking</strong> (giãn cả từ), <strong>leading</strong> (giãn dòng) — điều khiển khả năng đọc.</li>
</ul>
<h3>Phân cấp (hierarchy)</h3>
<p><strong>Phân cấp thị giác</strong> xếp hạng nội dung để mắt biết đọc gì trước: tiêu đề to đậm → tiêu đề phụ → thân bài → chú thích. Đạt được bằng cỡ, độ đậm, màu và khoảng cách — không phải bằng trang trí.</p>
<h3>Lưới &amp; bố cục</h3>
<p><strong>Lưới (grid)</strong> là bộ xương vô hình gồm cột và lề, căn chỉnh mọi thứ, tạo trật tự và nhịp. Tạp chí, báo và website đều nằm trên lưới. <strong>Phong cách Swiss / International Typographic</strong> (Helvetica + lưới, Josef Müller-Brockmann) là tham chiếu kinh điển.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Măng-sét <strong>New York Times</strong> ghép serif tạo uy tín với một lưới chặt; <strong>Google</strong> và <strong>Spotify</strong> dùng sans-serif sạch và phân cấp mạnh để màn hình dễ lướt.</div>`,
  ]]);

const c6q = quiz('vcm202-quiz-6', 'Quiz 6 — Type & layout|||Quiz 6 — Chữ & bố cục', [
  { id: 'q1', question: 'Khoảng cách giữa CÁC DÒNG chữ gọi là?', options: ['Kerning', 'Leading (giãn dòng)', 'Tracking', 'Serif'], correctIndex: 1, explanation: 'Leading = giãn dòng; kerning là khoảng giữa hai chữ cái, tracking giãn cả từ.' },
  { id: 'q2', question: 'Phân cấp thị giác (hierarchy) chủ yếu đạt được bằng?', options: ['Thêm trang trí', 'Cỡ, độ đậm, màu và khoảng cách', 'Dùng thật nhiều font', 'Viết hoa tất cả'], correctIndex: 1, explanation: 'Hierarchy dùng size/weight/màu/khoảng cách để xếp thứ tự đọc.' },
  { id: 'q3', question: 'Bộ xương vô hình gồm cột và lề giúp căn chỉnh, tạo trật tự là?', options: ['Grid (lưới)', 'Serif', 'Palette', 'Texture'], correctIndex: 0, explanation: 'Grid căn chỉnh bố cục; phong cách Swiss dựa mạnh vào lưới.' },
]);

const c7 = doc('vcm202-7-1-semiotics', '7.1 — Semiotics & imagery|||7.1 — Ký hiệu học & hình ảnh',
  'Ký hiệu học (signifier/signified), biểu tượng (icon/index/symbol), ẩn dụ thị giác, denotation vs connotation, đọc hình ảnh (Berger).',
  [[
    `<span class="eyebrow">VCM202 · Chapter 7 · Lesson 7.1</span>
<h2>Semiotics — reading images for meaning</h2>
<p><strong>Semiotics</strong> is the study of signs. A <strong>sign</strong> has a <em>signifier</em> (the form you see) and a <em>signified</em> (the concept it triggers). A red heart (signifier) means love (signified).</p>
<h3>Peirce's three sign types</h3>
<ul>
<li><strong>Icon</strong> — resembles its object (a camera glyph for "photo").</li>
<li><strong>Index</strong> — is caused by / points to it (smoke means fire; an arrow).</li>
<li><strong>Symbol</strong> — meaning is agreed by convention (a red octagon = stop; a heart = love).</li>
</ul>
<h3>Denotation vs connotation</h3>
<p><strong>Denotation</strong> is the literal thing (a rose = a flower); <strong>connotation</strong> is the added meaning (romance, passion). Designers work mostly in connotation. <strong>Visual metaphor</strong> carries one idea via another — a lightbulb for an idea, a shield for security.</p>
<h3>Ways of seeing</h3>
<p>John Berger showed that images are never neutral — framing, context and who made them shape meaning. The same photo in a news page vs an advert reads differently.</p>
<div class="callout"><span class="badge">Real example</span> The <strong>Amazon</strong> logo arrow goes A→Z (everything) and forms a smile; the <strong>Apple</strong> bite is a symbol read as knowledge/tech, not literal fruit.</div>`,
    `<span class="eyebrow">VCM202 · Chương 7 · Bài 7.1</span>
<h2>Ký hiệu học — đọc nghĩa của hình ảnh</h2>
<p><strong>Ký hiệu học (semiotics)</strong> là ngành nghiên cứu dấu hiệu. Một <strong>dấu hiệu (sign)</strong> gồm <em>cái biểu đạt (signifier)</em> (hình thức bạn thấy) và <em>cái được biểu đạt (signified)</em> (ý niệm nó gợi). Trái tim đỏ (biểu đạt) nghĩa là tình yêu (được biểu đạt).</p>
<h3>Ba loại dấu hiệu của Peirce</h3>
<ul>
<li><strong>Icon (tương tự)</strong> — giống đối tượng (hình máy ảnh cho "chụp ảnh").</li>
<li><strong>Index (chỉ dấu)</strong> — do đối tượng gây ra / trỏ tới (khói báo lửa; mũi tên).</li>
<li><strong>Symbol (biểu tượng)</strong> — nghĩa do quy ước (bát giác đỏ = dừng; trái tim = yêu).</li>
</ul>
<h3>Nghĩa đen &amp; nghĩa liên tưởng</h3>
<p><strong>Denotation</strong> là vật theo nghĩa đen (hoa hồng = một loài hoa); <strong>connotation</strong> là nghĩa cộng thêm (lãng mạn, đam mê). Nhà thiết kế làm việc chủ yếu ở tầng liên tưởng. <strong>Ẩn dụ thị giác</strong> mang một ý qua một ý khác — bóng đèn cho ý tưởng, tấm khiên cho sự an toàn.</p>
<h3>Cách ta nhìn (Ways of Seeing)</h3>
<p>John Berger chỉ ra hình ảnh không bao giờ trung tính — khung hình, ngữ cảnh và người tạo ra nó định hình nghĩa. Cùng một tấm ảnh trên trang tin và trong quảng cáo sẽ được đọc khác nhau.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Mũi tên logo <strong>Amazon</strong> đi từ A→Z (bán mọi thứ) và tạo thành nụ cười; vết cắn của <strong>Apple</strong> là biểu tượng được đọc thành tri thức/công nghệ, không phải quả táo theo nghĩa đen.</div>`,
  ]]);

const c7q = quiz('vcm202-quiz-7', 'Quiz 7 — Semiotics|||Quiz 7 — Ký hiệu học', [
  { id: 'q1', question: 'Trong ký hiệu học, "cái biểu đạt (signifier)" là?', options: ['Ý niệm được gợi ra', 'Hình thức/dấu ta nhìn thấy', 'Người thiết kế', 'Màu nền'], correctIndex: 1, explanation: 'Signifier là hình thức nhìn thấy; signified là ý niệm nó gợi.' },
  { id: 'q2', question: 'Bát giác đỏ nghĩa "dừng" là loại dấu hiệu nào của Peirce?', options: ['Icon', 'Index', 'Symbol (theo quy ước)', 'Metaphor'], correctIndex: 2, explanation: 'Symbol: nghĩa do quy ước xã hội, không do giống hay do gây ra.' },
  { id: 'q3', question: 'Nghĩa cộng thêm của hình ảnh (hoa hồng gợi lãng mạn) gọi là?', options: ['Denotation (nghĩa đen)', 'Connotation (nghĩa liên tưởng)', 'Icon', 'Grid'], correctIndex: 1, explanation: 'Connotation là nghĩa liên tưởng; denotation là nghĩa đen của vật.' },
]);

const c8 = doc('vcm202-8-1-applications', '8.1 — Applied visual communication|||8.1 — Ứng dụng truyền thông thị giác',
  'Poster, infographic, branding (nhận diện thương hiệu), thông điệp thị giác; quy trình và phân tích case thật.',
  [[
    `<span class="eyebrow">VCM202 · Chapter 8 · Lesson 8.1</span>
<h2>Applied visual communication</h2>
<p>Now put elements, principles, Gestalt, colour, type and semiotics to work.</p>
<h3>Poster</h3>
<p>One clear message, strong hierarchy, a single focal point. Classic references: <strong>Toulouse-Lautrec</strong>, Swiss posters by <strong>Müller-Brockmann</strong>, and film posters like <strong>Saul Bass</strong> (Vertigo, Anatomy of a Murder).</p>
<h3>Infographic</h3>
<p>Turns data into a visual story — chart + icon + type + flow. Good ones (e.g. the <strong>London Tube map</strong> by Harry Beck) simplify reality into a clear diagram, sacrificing geography for readability.</p>
<h3>Branding / identity</h3>
<p>A system, not just a logo: logo + colour + type + imagery + voice, applied consistently. <strong>Airbnb</strong> (the "Bélo" symbol) and <strong>Mastercard</strong> (two overlapping circles, now wordless) show identity working across every touchpoint.</p>
<h3>Design process</h3>
<pre><code>Brief -> Research -> Sketch/ideate
      -> Draft (elements + principles)
      -> Feedback -> Refine -> Deliver
</code></pre>
<h3>Case analysis (a method)</h3>
<p>To critique any piece, ask: what is the message? who is the audience? which principles &amp; Gestalt rules are used? what do the colours and symbols connote? does it succeed — and why?</p>
<div class="callout"><span class="badge">Your project</span> Build a mini set: one poster, one infographic, one small brand mark — and write a short rationale naming the choices, the way a designer defends work to a client.</div>`,
    `<span class="eyebrow">VCM202 · Chương 8 · Bài 8.1</span>
<h2>Ứng dụng truyền thông thị giác</h2>
<p>Giờ đưa yếu tố, nguyên lý, Gestalt, màu, chữ và ký hiệu học vào thực chiến.</p>
<h3>Poster</h3>
<p>Một thông điệp rõ, phân cấp mạnh, một điểm nhấn duy nhất. Tham chiếu kinh điển: <strong>Toulouse-Lautrec</strong>, poster Swiss của <strong>Müller-Brockmann</strong>, và poster phim của <strong>Saul Bass</strong> (Vertigo, Anatomy of a Murder).</p>
<h3>Infographic</h3>
<p>Biến dữ liệu thành câu chuyện thị giác — biểu đồ + icon + chữ + luồng. Bản tốt (vd <strong>bản đồ tàu điện ngầm London</strong> của Harry Beck) đơn giản hoá thực tế thành sơ đồ rõ ràng, hy sinh địa lý để dễ đọc.</p>
<h3>Nhận diện thương hiệu (branding)</h3>
<p>Là một hệ thống, không chỉ cái logo: logo + màu + chữ + hình ảnh + giọng điệu, dùng nhất quán. <strong>Airbnb</strong> (biểu tượng "Bélo") và <strong>Mastercard</strong> (hai vòng tròn chồng nhau, nay bỏ cả chữ) cho thấy nhận diện hoạt động trên mọi điểm chạm.</p>
<h3>Quy trình thiết kế</h3>
<pre><code>Đề bài -> Nghiên cứu -> Phác thảo/lên ý
       -> Bản nháp (yếu tố + nguyên lý)
       -> Phản hồi -> Tinh chỉnh -> Bàn giao
</code></pre>
<h3>Phân tích case (một phương pháp)</h3>
<p>Để phê bình một tác phẩm, hãy hỏi: thông điệp là gì? ai là công chúng? dùng nguyên lý &amp; quy luật Gestalt nào? màu và biểu tượng gợi nghĩa gì? nó có thành công không — vì sao?</p>
<div class="callout"><span class="badge">Dự án của bạn</span> Dựng một bộ nhỏ: một poster, một infographic, một dấu hiệu thương hiệu nhỏ — và viết một bản luận giải ngắn gọi tên các lựa chọn, như cách nhà thiết kế bảo vệ tác phẩm trước khách hàng.</div>`,
  ]]);

const c8q = quiz('vcm202-quiz-8', 'Quiz 8 — Applications|||Quiz 8 — Ứng dụng', [
  { id: 'q1', question: 'Bản đồ tàu điện ngầm London của Harry Beck là ví dụ kinh điển của?', options: ['Poster phim', 'Infographic (sơ đồ hoá dữ liệu, hy sinh địa lý để dễ đọc)', 'Logo', 'Bao bì'], correctIndex: 1, explanation: 'Nó đơn giản hoá thực tế thành sơ đồ rõ — infographic kinh điển.' },
  { id: 'q2', question: 'Nhận diện thương hiệu (brand identity) đúng nghĩa là?', options: ['Chỉ một cái logo', 'Một hệ thống: logo + màu + chữ + hình ảnh + giọng điệu dùng nhất quán', 'Một tấm poster', 'Một bảng màu'], correctIndex: 1, explanation: 'Branding là hệ thống nhất quán trên mọi điểm chạm, không chỉ logo.' },
  { id: 'q3', question: 'Khi phân tích một tác phẩm thị giác, câu hỏi ĐẦU TIÊN nên là?', options: ['Nó dùng font gì', 'Thông điệp và công chúng là gì', 'Giá bao nhiêu', 'Ai in nó'], correctIndex: 1, explanation: 'Bắt đầu từ thông điệp và đối tượng; rồi mới xét nguyên lý, màu, ký hiệu.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'VCM202',
    slug: 'vcm202-visual-communication',
    title: 'Visual Communication',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/VCM202.webp',
    shortDescription: 'Communicate ideas with images — design elements & principles, Gestalt, colour (RGB/CMYK & psychology), typography & grids, semiotics, and applied work (poster, infographic, branding). Bilingual, real brands & quizzes.|||Truyền đạt ý tưởng bằng hình ảnh — yếu tố & nguyên lý thiết kế, Gestalt, màu (RGB/CMYK & tâm lý), chữ & lưới, ký hiệu học, và ứng dụng (poster, infographic, branding). Song ngữ, thương hiệu thật & quiz.',
    description: 'Môn <strong>VCM202 — Visual Communication (Truyền thông thị giác)</strong> thuộc ngành Thiết kế mỹ thuật số, kỳ 1, giúp bạn <strong>truyền đạt ý tưởng bằng hình ảnh</strong>. Từ <strong>truyền thông thị giác là gì</strong> → <strong>yếu tố</strong> (điểm/đường/hình/không gian) → <strong>nguyên lý</strong> (cân bằng, tương phản, nhấn mạnh, thống nhất) → <strong>Gestalt</strong> → <strong>màu sắc</strong> (bánh xe màu, RGB/CMYK, tâm lý màu) → <strong>chữ &amp; bố cục</strong> (typography, hierarchy, grid) → <strong>ký hiệu học</strong> (semiotics, ẩn dụ thị giác) → <strong>ứng dụng</strong> (poster, infographic, branding). Bám giáo trình chuẩn quốc tế (Lupton, Arntson, Berger, Gestalt), song ngữ, có ví dụ tác phẩm/thương hiệu thật và quiz mỗi chương.',
    whatYouLearn: 'Quy trình truyền đạt bằng hình ảnh; yếu tố thiết kế (điểm, đường, hình, khối, texture, không gian âm); nguyên lý (cân bằng, tương phản, nhịp điệu, nhấn mạnh, thống nhất, tỉ lệ); Gestalt (proximity, similarity, closure, continuity, figure-ground); lý thuyết màu, RGB vs CMYK, sơ đồ phối màu & tâm lý màu; typography (serif/sans, kerning/leading), hierarchy, grid; ký hiệu học (signifier/signified, icon/index/symbol, denotation/connotation, ẩn dụ thị giác); ứng dụng poster, infographic, branding & phân tích case.',
    requirements: 'Không cần nền thiết kế. Nên có sổ phác thảo và một công cụ (Figma/Canva/Adobe) để thực hành. Xem điều kiện tiên quyết của ngành Thiết kế mỹ thuật số trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, Canva/Adobe, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Truyền đạt bằng hình ảnh, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Truyền thông thị giác là gì|||Chapter 1 — What is VC', description: 'Định nghĩa, vai trò, quy trình truyền đạt.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Yếu tố thiết kế|||Chapter 2 — Design elements', description: 'Điểm, đường, hình, khối, texture, không gian.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Nguyên lý thiết kế|||Chapter 3 — Design principles', description: 'Cân bằng, tương phản, nhịp, nhấn mạnh, thống nhất, tỉ lệ.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Nguyên lý Gestalt|||Chapter 4 — Gestalt', description: 'Proximity, similarity, closure, continuity, figure-ground.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Màu sắc|||Chapter 5 — Colour', description: 'Bánh xe màu, RGB/CMYK, tâm lý màu, phối màu.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Chữ & bố cục|||Chapter 6 — Type & layout', description: 'Typography, hierarchy, grid, layout.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Ký hiệu học & hình ảnh|||Chapter 7 — Semiotics', description: 'Signifier/signified, biểu tượng, ẩn dụ, đọc hình ảnh.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ứng dụng|||Chapter 8 — Applications', description: 'Poster, infographic, branding, phân tích case.', lessons: [c8, c8q] },
  ],
};
