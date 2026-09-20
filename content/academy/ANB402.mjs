/**
 * ANB402 — Background Design (Thiết kế bối cảnh cho hoạt hình/game). Ngành
 * Thiết kế mỹ thuật số (Digital Art & Design), kỳ 5, FPTU. Giáo trình tham
 * khảo: Nathan Fowkes (How to Draw and Paint / Color and Light for the Visual
 * Storyteller), James Gurney (Color and Light), Dice Tsutsumi & Robert Kondo,
 * "Framed Ink" (Marcos Mateu-Mestre). Song ngữ VI+EN, 8 chương + quiz.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick lồng/${; "<"→&lt;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('anb402-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách nghề (Fowkes, Gurney, Framed Ink), studio tham khảo, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">ANB402 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Background Design</strong> for animation and games — storytelling through environments, perspective, composition, color &amp; light — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are legal references.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ANB402 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li>Nathan Fowkes — <em>How to Draw and Paint What You See</em> &amp; <em>Color and Light for the Visual Storyteller</em></li>
<li>James Gurney — <em>Color and Light: A Guide for the Realist Painter</em></li>
<li>Marcos Mateu-Mestre — <em>Framed Ink</em> (drawing &amp; composition for visual storytellers)</li>
<li>Dice Tsutsumi &amp; Robert Kondo (Tonko House) — environment &amp; light studies</li>
</ul>
<h3>🌐 Free learning</h3>
<ul>
<li><a href="https://www.jamesgurney.com/" target="_blank" rel="noopener">Gurney Journey — color, light &amp; plein-air studies</a></li>
<li><a href="https://www.youtube.com/@NathanFowkesArt" target="_blank" rel="noopener">Nathan Fowkes — landscape &amp; visual development</a></li>
<li><a href="https://www.youtube.com/@FZDSCHOOL" target="_blank" rel="noopener">FZD School — environment &amp; concept design</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.adobe.com/products/photoshop.html" target="_blank" rel="noopener">Adobe Photoshop</a> — painting &amp; matte painting</li>
<li><a href="https://www.clipstudio.net/" target="_blank" rel="noopener">Clip Studio Paint</a> — perspective rulers &amp; layout</li>
<li><a href="https://krita.org/" target="_blank" rel="noopener">Krita</a> — free digital painting</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>See first</strong> — draw from observation (Fowkes): shapes, values, edges before detail.</li>
<li><strong>Build space</strong> — perspective (1/2/3-point), composition &amp; leading lines (Framed Ink).</li>
<li><strong>Color &amp; light</strong> — value structure, temperature, mood (Gurney), time of day &amp; weather.</li>
<li><strong>Deliver</strong> — concept → line → color, matte painting, layout &amp; handoff to production.</li>
</ol></div>`,
    `<span class="eyebrow">ANB402 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Thiết kế bối cảnh</strong> cho hoạt hình và game — kể chuyện qua môi trường, phối cảnh, bố cục, màu &amp; ánh sáng — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ANB402 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách nghề tham khảo</h3>
<ul>
<li>Nathan Fowkes — <em>How to Draw and Paint What You See</em> &amp; <em>Color and Light for the Visual Storyteller</em></li>
<li>James Gurney — <em>Color and Light: A Guide for the Realist Painter</em></li>
<li>Marcos Mateu-Mestre — <em>Framed Ink</em> (vẽ &amp; bố cục cho người kể chuyện hình ảnh)</li>
<li>Dice Tsutsumi &amp; Robert Kondo (Tonko House) — nghiên cứu môi trường &amp; ánh sáng</li>
</ul>
<h3>🌐 Học miễn phí</h3>
<ul>
<li><a href="https://www.jamesgurney.com/" target="_blank" rel="noopener">Gurney Journey — màu, ánh sáng &amp; ký hoạ ngoài trời</a></li>
<li><a href="https://www.youtube.com/@NathanFowkesArt" target="_blank" rel="noopener">Nathan Fowkes — phong cảnh &amp; visual development</a></li>
<li><a href="https://www.youtube.com/@FZDSCHOOL" target="_blank" rel="noopener">FZD School — thiết kế môi trường &amp; concept</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.adobe.com/products/photoshop.html" target="_blank" rel="noopener">Adobe Photoshop</a> — vẽ &amp; matte painting</li>
<li><a href="https://www.clipstudio.net/" target="_blank" rel="noopener">Clip Studio Paint</a> — thước phối cảnh &amp; layout</li>
<li><a href="https://krita.org/" target="_blank" rel="noopener">Krita</a> — vẽ số miễn phí</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Quan sát trước</strong> — vẽ từ quan sát (Fowkes): hình khối, sắc độ, cạnh trước khi chi tiết.</li>
<li><strong>Dựng không gian</strong> — phối cảnh (1/2/3 điểm tụ), bố cục &amp; đường dẫn mắt (Framed Ink).</li>
<li><strong>Màu &amp; ánh sáng</strong> — cấu trúc sắc độ, nhiệt màu, không khí (Gurney), thời gian &amp; thời tiết.</li>
<li><strong>Bàn giao</strong> — concept → line → color, matte painting, layout &amp; giao cho sản xuất.</li>
</ol></div>`,
  ]]);

const intro = doc('anb402-0-1-overview', 'Course overview: Background Design|||Tổng quan: Thiết kế bối cảnh',
  'Bối cảnh là gì và làm gì cho câu chuyện; lộ trình 8 chương: vai trò kể chuyện → phối cảnh → bố cục → màu &amp; ánh sáng → không khí → kiến trúc &amp; thiên nhiên → 2D vs game → quy trình bàn giao.',
  [[
    `<span class="eyebrow">ANB402 · Lesson 0.1 · Overview</span>
<h2>Background Design</h2>
<p class="lead">A <strong>background</strong> (or environment) is the world a character lives in — it is <strong>acting without a body</strong>. Before a line of dialogue, the place already tells us the time, the mood, the social class, and what is about to happen. This course teaches you to design environments that <strong>serve the story</strong>, not just decorate the frame.</p>
<h3>What a good background does</h3>
<ul>
<li><strong>Sets the stage</strong> — where and when are we; what kind of world is this.</li>
<li><strong>Carries mood</strong> — value, color and light make us feel safe, tense, lonely or hopeful.</li>
<li><strong>Directs the eye</strong> — composition guides the viewer to the character or the key action.</li>
<li><strong>Supports staging</strong> — leaves room for the character to move and be read clearly.</li>
</ul>
<h3>Roadmap (8 chapters)</h3>
<p>Storytelling role → perspective &amp; space → composition &amp; leading the eye → color theory &amp; light → mood, time of day &amp; weather → architecture &amp; natural environments → 2D animation vs game layout → the pipeline concept → line → color, matte painting &amp; handoff. Bilingual, with process checklists and a quiz per chapter.</p>
<div class="callout"><span class="badge">Core idea</span> Design the <strong>place as a character</strong>. If the environment could be swapped for any other and the scene still reads the same, it is not yet doing its job.</div>`,
    `<span class="eyebrow">ANB402 · Bài 0.1 · Tổng quan</span>
<h2>Thiết kế bối cảnh</h2>
<p class="lead">Một <strong>bối cảnh</strong> (môi trường) là thế giới nhân vật đang sống — nó là <strong>diễn xuất không cần cơ thể</strong>. Trước cả một câu thoại, không gian đã kể cho ta biết thời gian, không khí, tầng lớp xã hội, và điều sắp xảy ra. Môn này dạy bạn thiết kế môi trường <strong>phục vụ câu chuyện</strong>, chứ không chỉ trang trí khung hình.</p>
<h3>Một bối cảnh tốt làm gì</h3>
<ul>
<li><strong>Dựng sân khấu</strong> — ta đang ở đâu, khi nào; đây là thế giới kiểu gì.</li>
<li><strong>Mang không khí</strong> — sắc độ, màu và ánh sáng khiến ta thấy an toàn, căng thẳng, cô đơn hay hy vọng.</li>
<li><strong>Dẫn mắt</strong> — bố cục đưa mắt người xem tới nhân vật hay hành động chính.</li>
<li><strong>Đỡ dàn cảnh</strong> — chừa chỗ cho nhân vật di chuyển và được đọc rõ ràng.</li>
</ul>
<h3>Lộ trình (8 chương)</h3>
<p>Vai trò kể chuyện → phối cảnh &amp; không gian → bố cục &amp; dẫn mắt → lý thuyết màu &amp; ánh sáng → không khí, thời gian trong ngày &amp; thời tiết → kiến trúc &amp; môi trường tự nhiên → layout hoạt hình 2D vs game → quy trình concept → line → color, matte painting &amp; bàn giao. Song ngữ, có checklist quy trình và quiz mỗi chương.</p>
<div class="callout"><span class="badge">Ý cốt lõi</span> Thiết kế <strong>không gian như một nhân vật</strong>. Nếu môi trường có thể thay bằng bất kỳ nơi nào khác mà cảnh vẫn đọc y hệt, thì nó chưa làm tròn việc.</div>`,
  ]]);

const c1 = doc('anb402-1-1-storytelling', '1.1 — The role of background in visual storytelling|||1.1 — Vai trò của bối cảnh trong kể chuyện hình ảnh',
  'Bối cảnh là diễn xuất không lời: thiết lập không-thời gian, tâm trạng, chủ đề; nguyên tắc "story first"; đọc bối cảnh phim để rút bài học.',
  [[
    `<span class="eyebrow">ANB402 · Chapter 1 · Lesson 1.1</span>
<h2>The role of background in visual storytelling</h2>
<p>Every environment answers three questions before anyone speaks: <strong>Where? When? Who lives here?</strong> The designer's job is to make those answers deliberate.</p>
<h3>Background as silent acting</h3>
<ul>
<li><strong>Establish</strong> the world (a wide "establishing shot" orients the audience).</li>
<li><strong>Characterize</strong> — a tidy room vs a cluttered one says everything about who owns it.</li>
<li><strong>Foreshadow</strong> — a dark hallway, a distant storm, promises what comes next.</li>
</ul>
<h3>Story first</h3>
<p>Fowkes and the Tonko House artists insist that <strong>design serves the story beat</strong>. Ask: what should the audience feel <em>here</em>? Then choose shapes, value and color to deliver that feeling — everything else is cut.</p>
<pre><code>Design brief (fill BEFORE drawing):
  Beat     -> what happens in this scene?
  Emotion  -> one word (lonely / safe / dread / wonder)
  Time     -> era + time of day
  Focus    -> where must the eye land?
  Staging  -> where does the character sit in the frame?
</code></pre>
<div class="callout"><span class="badge">Watch and learn</span> Pause any animated film on a background. Ask what the place tells you before the characters act. That reverse-engineering is the fastest way to learn.</div>`,
    `<span class="eyebrow">ANB402 · Chương 1 · Bài 1.1</span>
<h2>Vai trò của bối cảnh trong kể chuyện hình ảnh</h2>
<p>Mọi môi trường trả lời ba câu hỏi trước khi có ai lên tiếng: <strong>Ở đâu? Khi nào? Ai sống ở đây?</strong> Việc của người thiết kế là làm cho những câu trả lời đó có chủ đích.</p>
<h3>Bối cảnh là diễn xuất không lời</h3>
<ul>
<li><strong>Thiết lập</strong> thế giới (một "establishing shot" toàn cảnh định hướng khán giả).</li>
<li><strong>Khắc hoạ tính cách</strong> — phòng gọn gàng và phòng bừa bộn nói hết về chủ nhân.</li>
<li><strong>Báo trước</strong> — hành lang tối, cơn bão xa, hứa hẹn điều sắp tới.</li>
</ul>
<h3>Câu chuyện trước tiên</h3>
<p>Fowkes và các hoạ sĩ Tonko House nhấn mạnh rằng <strong>thiết kế phục vụ nhịp truyện</strong>. Hãy hỏi: khán giả nên cảm thấy gì <em>ở đây</em>? Rồi chọn hình khối, sắc độ và màu để tạo cảm giác đó — mọi thứ khác thì cắt.</p>
<pre><code>Brief thiết kế (điền TRƯỚC khi vẽ):
  Nhịp     -> cảnh này xảy ra chuyện gì?
  Cảm xúc  -> một từ (cô đơn / an toàn / sợ / kỳ diệu)
  Thời gian-> thời đại + giờ trong ngày
  Tâm điểm -> mắt phải dừng ở đâu?
  Dàn cảnh -> nhân vật đứng chỗ nào trong khung?
</code></pre>
<div class="callout"><span class="badge">Xem và học</span> Dừng bất kỳ phim hoạt hình nào ở một cảnh nền. Hỏi xem không gian nói gì trước khi nhân vật diễn. Ngược dòng như vậy là cách học nhanh nhất.</div>`,
  ]]);

const c1q = quiz('anb402-quiz-1', 'Quiz 1 — Storytelling role|||Quiz 1 — Vai trò kể chuyện', [
  { id: 'q1', question: 'Nguyên tắc quan trọng nhất khi bắt đầu thiết kế một bối cảnh là?', options: ['Vẽ càng nhiều chi tiết càng tốt', 'Bám nhịp truyện & cảm xúc cần truyền (story first)', 'Dùng màu rực để gây chú ý', 'Sao chép ảnh chụp thật'], correctIndex: 1, explanation: 'Thiết kế phục vụ câu chuyện: xác định nhịp truyện và cảm xúc trước, rồi mới chọn hình/sắc độ/màu.' },
  { id: 'q2', question: '"Establishing shot" (cảnh thiết lập) dùng để làm gì?', options: ['Cận cảnh cảm xúc nhân vật', 'Định hướng khán giả về không gian & thời gian', 'Chuyển cảnh nhanh', 'Che lỗi diễn xuất'], correctIndex: 1, explanation: 'Cảnh thiết lập thường là toàn cảnh, cho khán giả biết ở đâu và khi nào trước khi vào hành động.' },
  { id: 'q3', question: 'Vì sao nói bối cảnh là "diễn xuất không lời"?', options: ['Vì nó luôn im lặng', 'Vì nó truyền thời gian, tâm trạng, tính cách trước cả lời thoại', 'Vì nó không quan trọng bằng nhân vật', 'Vì nó chỉ là nền tô màu'], correctIndex: 1, explanation: 'Không gian kể thời-đại, không khí và chủ nhân trước khi nhân vật kịp nói hay hành động.' },
]);

const c2 = doc('anb402-2-1-perspective', '2.1 — Perspective (1/2/3-point) & space|||2.1 — Phối cảnh (1/2/3 điểm tụ) & không gian',
  'Đường chân trời &amp; điểm tụ; phối cảnh 1, 2, 3 điểm tụ; tầm mắt (eye level) kể chuyện; foreground/midground/background dựng chiều sâu.',
  [[
    `<span class="eyebrow">ANB402 · Chapter 2 · Lesson 2.1</span>
<h2>Perspective &amp; space</h2>
<p>Perspective is how we fake 3D depth on a flat surface. Two tools rule it: the <strong>horizon line</strong> (the viewer's eye level) and <strong>vanishing points</strong> (where parallel lines converge).</p>
<h3>One, two, three points</h3>
<ul>
<li><strong>1-point</strong> — one vanishing point on the horizon. Good for looking straight down a road, hallway or train track. Calm, symmetric.</li>
<li><strong>2-point</strong> — two vanishing points; the classic street-corner or building view. The most-used for environments.</li>
<li><strong>3-point</strong> — add a third point above or below for extreme up-shots (towering) or down-shots (vertigo). Dramatic.</li>
</ul>
<h3>Eye level tells a story</h3>
<p>A <strong>low horizon</strong> makes things loom and feel powerful; a <strong>high horizon</strong> (bird's eye) makes a character small and vulnerable. Choose eye level for meaning, not habit.</p>
<pre><code>Depth in 3 planes:
  Foreground  -> large shapes, framing, darkest/lightest contrast
  Midground   -> the subject / main action lives here
  Background  -> soft, low-contrast, cool -> pushes back (atmosphere)
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Overlap + size change + atmospheric fade = readable depth. If everything is equally sharp and equally dark, the space goes flat.</div>`,
    `<span class="eyebrow">ANB402 · Chương 2 · Bài 2.1</span>
<h2>Phối cảnh &amp; không gian</h2>
<p>Phối cảnh là cách ta giả lập chiều sâu 3D trên mặt phẳng. Hai công cụ chi phối: <strong>đường chân trời</strong> (tầm mắt người xem) và <strong>điểm tụ</strong> (nơi các đường song song hội tụ).</p>
<h3>Một, hai, ba điểm tụ</h3>
<ul>
<li><strong>1 điểm tụ</strong> — một điểm tụ trên đường chân trời. Hợp khi nhìn thẳng vào con đường, hành lang, đường ray. Yên tĩnh, đối xứng.</li>
<li><strong>2 điểm tụ</strong> — hai điểm tụ; góc phố hay công trình kinh điển. Được dùng nhiều nhất cho môi trường.</li>
<li><strong>3 điểm tụ</strong> — thêm điểm thứ ba ở trên hoặc dưới cho góc ngước cực mạnh (chót vót) hay góc cúi (chóng mặt). Kịch tính.</li>
</ul>
<h3>Tầm mắt kể chuyện</h3>
<p><strong>Chân trời thấp</strong> khiến vật thể sừng sững, đầy quyền lực; <strong>chân trời cao</strong> (nhìn từ trên) khiến nhân vật nhỏ bé, yếu thế. Chọn tầm mắt vì ý nghĩa, đừng theo thói quen.</p>
<pre><code>Chiều sâu qua 3 lớp:
  Tiền cảnh  -> mảng lớn, khung hình, tương phản mạnh nhất
  Trung cảnh -> chủ thể / hành động chính nằm đây
  Hậu cảnh   -> mờ, tương phản thấp, lạnh -> lùi ra xa (khí quyển)
</code></pre>
<div class="callout"><span class="badge">Mẹo nhớ</span> Chồng lớp + đổi kích thước + mờ dần khí quyển = chiều sâu đọc được. Nếu mọi thứ sắc nét và đậm như nhau, không gian bị bẹt.</div>`,
  ]]);

const c2q = quiz('anb402-quiz-2', 'Quiz 2 — Perspective|||Quiz 2 — Phối cảnh', [
  { id: 'q1', question: 'Đường chân trời (horizon line) trong phối cảnh biểu thị điều gì?', options: ['Ranh giới trời và đất luôn cố định', 'Tầm mắt (eye level) của người xem', 'Điểm sáng nhất của cảnh', 'Đường trung tâm khung hình'], correctIndex: 1, explanation: 'Đường chân trời chính là tầm mắt người xem; đặt nó cao/thấp đổi cả cảm giác và ý nghĩa.' },
  { id: 'q2', question: 'Góc phố của một toà nhà, thấy hai mặt tường chạy về hai phía, thường dùng phối cảnh?', options: ['1 điểm tụ', '2 điểm tụ', '3 điểm tụ', 'Không phối cảnh'], correctIndex: 1, explanation: 'Hai mặt tường hội tụ về hai điểm tụ hai bên = phối cảnh 2 điểm tụ, phổ biến nhất cho môi trường.' },
  { id: 'q3', question: 'Để tạo chiều sâu, hậu cảnh (background) thường nên được xử lý thế nào?', options: ['Tương phản mạnh, sắc nét, màu nóng', 'Mờ nhẹ, tương phản thấp, ngả lạnh', 'Đậm hơn tiền cảnh', 'Chi tiết nhiều nhất'], correctIndex: 1, explanation: 'Khí quyển làm vật ở xa mờ, tương phản thấp và ngả lạnh, nhờ đó chúng lùi ra sau.' },
]);

const c3 = doc('anb402-3-1-composition', '3.1 — Composition & leading the eye|||3.1 — Bố cục & dẫn mắt',
  'Điểm nhấn (focal point) &amp; tương phản; đường dẫn (leading lines), quy tắc 1/3, khung trong khung; nhóm hình lớn (big shapes) &amp; nhịp; Framed Ink.',
  [[
    `<span class="eyebrow">ANB402 · Chapter 3 · Lesson 3.1</span>
<h2>Composition &amp; leading the eye</h2>
<p>Composition is the deliberate arrangement of shapes so the viewer's eye lands where you want, in the order you want. Mateu-Mestre's <em>Framed Ink</em> is the classic reference.</p>
<h3>Create one focal point</h3>
<p>The eye goes to the area of <strong>greatest contrast</strong> — of value, color, edge sharpness or detail. Give the story's subject that contrast, and quiet everything else. Two competing focal points split attention and kill the read.</p>
<h3>Lead the eye</h3>
<ul>
<li><strong>Leading lines</strong> — roads, rivers, light beams, arms all funnel the eye toward the focus.</li>
<li><strong>Rule of thirds</strong> — place the subject on a third line, not dead center, for tension and balance.</li>
<li><strong>Frame within a frame</strong> — doorways, branches, arches wrap the subject and add depth.</li>
</ul>
<pre><code>Big-shape check (squint!):
  1. Reduce the whole image to 3-4 big value shapes
  2. Does one clear focal shape read instantly?
  3. Is there a path of lights (or darks) leading to it?
  4. If two things fight for attention -> subdue one
</code></pre>
<div class="callout"><span class="badge">Squint test</span> Squint until detail disappears. If the composition still reads — big shapes, clear focus, a path for the eye — the foundation is solid.</div>`,
    `<span class="eyebrow">ANB402 · Chương 3 · Bài 3.1</span>
<h2>Bố cục &amp; dẫn mắt</h2>
<p>Bố cục là sự sắp đặt có chủ đích các hình khối để mắt người xem dừng đúng chỗ bạn muốn, theo thứ tự bạn muốn. <em>Framed Ink</em> của Mateu-Mestre là tài liệu kinh điển.</p>
<h3>Tạo một điểm nhấn duy nhất</h3>
<p>Mắt đi tới vùng <strong>tương phản mạnh nhất</strong> — về sắc độ, màu, độ sắc của cạnh hay chi tiết. Hãy dành sự tương phản đó cho chủ thể câu chuyện, và làm dịu mọi thứ còn lại. Hai điểm nhấn tranh nhau sẽ xé sự chú ý và phá cách đọc.</p>
<h3>Dẫn mắt</h3>
<ul>
<li><strong>Đường dẫn</strong> — con đường, dòng sông, tia sáng, cánh tay đều lùa mắt về điểm nhấn.</li>
<li><strong>Quy tắc 1/3</strong> — đặt chủ thể trên đường 1/3, không ở chính giữa, để tạo lực và cân bằng.</li>
<li><strong>Khung trong khung</strong> — khung cửa, cành cây, mái vòm bọc lấy chủ thể và thêm chiều sâu.</li>
</ul>
<pre><code>Kiểm tra mảng lớn (nheo mắt!):
  1. Rút cả tranh về 3-4 mảng sắc độ lớn
  2. Có một mảng điểm nhấn rõ, đọc ra ngay không?
  3. Có đường ánh sáng (hoặc tối) dẫn tới nó không?
  4. Nếu hai thứ tranh nhau -> dịu bớt một
</code></pre>
<div class="callout"><span class="badge">Phép nheo mắt</span> Nheo tới khi chi tiết biến mất. Nếu bố cục vẫn đọc được — mảng lớn, điểm nhấn rõ, đường cho mắt đi — thì nền móng vững.</div>`,
  ]]);

const c3q = quiz('anb402-quiz-3', 'Quiz 3 — Composition|||Quiz 3 — Bố cục', [
  { id: 'q1', question: 'Mắt người xem tự nhiên bị hút tới vùng nào của tranh?', options: ['Vùng tối nhất luôn luôn', 'Vùng có tương phản mạnh nhất (sắc độ/màu/cạnh/chi tiết)', 'Góc trên bên trái', 'Vùng nhiều màu nóng'], correctIndex: 1, explanation: 'Điểm nhấn là nơi tương phản cao nhất; hãy dành nó cho chủ thể và làm dịu phần còn lại.' },
  { id: 'q2', question: '"Leading lines" (đường dẫn) trong bố cục dùng để?', options: ['Chia khung thành ô vuông', 'Hướng ánh mắt người xem về điểm nhấn', 'Đo phối cảnh', 'Tạo hoa văn nền'], correctIndex: 1, explanation: 'Con đường, sông, tia sáng... đóng vai đường dẫn, lùa mắt tới chủ thể.' },
  { id: 'q3', question: '"Phép nheo mắt" (squint test) giúp kiểm tra điều gì?', options: ['Độ sắc của chi tiết', 'Cấu trúc mảng sắc độ lớn & điểm nhấn có rõ không', 'Màu có đúng không', 'Kích thước file'], correctIndex: 1, explanation: 'Nheo mắt xoá chi tiết, chỉ còn mảng lớn — nếu bố cục vẫn đọc rõ thì nền móng vững.' },
]);

const c4 = doc('anb402-4-1-color-light', '4.1 — Color theory & light for backgrounds|||4.1 — Lý thuyết màu & ánh sáng cho bối cảnh',
  'Sắc độ (value) trước màu; hue/saturation/value; nhiệt màu &amp; ánh sáng/bóng; nguồn sáng &amp; ánh sáng phản; bảng màu giới hạn; Gurney "Color and Light".',
  [[
    `<span class="eyebrow">ANB402 · Chapter 4 · Lesson 4.1</span>
<h2>Color theory &amp; light</h2>
<p>James Gurney's rule: <strong>value does the work, color gets the credit</strong>. Get the light/shadow structure right in grayscale first; color is layered on top.</p>
<h3>Three properties of color</h3>
<ul>
<li><strong>Hue</strong> — the color name (red, blue).</li>
<li><strong>Saturation</strong> — how pure vs grayed it is.</li>
<li><strong>Value</strong> — how light or dark. This is the one that builds form and depth.</li>
</ul>
<h3>Light and temperature</h3>
<p>A key rule: if the <strong>light is warm</strong> (sunlight), the <strong>shadows go cool</strong> (sky-lit blue) — and vice versa. This warm/cool interplay is what makes light feel real. Shadows are never just "black"; they carry reflected and ambient color.</p>
<pre><code>Light setup (per scene):
  Key light     -> direction + color (warm sun? cool moon?)
  Shadow color  -> opposite temperature of the key
  Bounce/fill   -> light reflected from ground into shadow
  Ambient/sky   -> overall tint the whole scene sits in
</code></pre>
<div class="callout"><span class="badge">Limited palette</span> Pick a small set of colors (e.g. one warm, one cool, a neutral) and stay in it. A limited palette reads as <strong>one unified light</strong> — mixing too many hues muddies the mood.</div>`,
    `<span class="eyebrow">ANB402 · Chương 4 · Bài 4.1</span>
<h2>Lý thuyết màu &amp; ánh sáng</h2>
<p>Quy tắc của James Gurney: <strong>sắc độ làm việc, màu nhận công</strong>. Hãy dựng đúng cấu trúc sáng/tối ở dạng xám trước; màu được phủ lên trên.</p>
<h3>Ba thuộc tính của màu</h3>
<ul>
<li><strong>Sắc (hue)</strong> — tên màu (đỏ, xanh).</li>
<li><strong>Độ tươi (saturation)</strong> — tinh khiết hay xám.</li>
<li><strong>Sắc độ (value)</strong> — sáng hay tối. Chính nó dựng nên khối và chiều sâu.</li>
</ul>
<h3>Ánh sáng và nhiệt màu</h3>
<p>Một quy tắc then chốt: nếu <strong>ánh sáng nóng</strong> (nắng), thì <strong>bóng ngả lạnh</strong> (xanh do trời chiếu) — và ngược lại. Sự đối đáp nóng/lạnh này khiến ánh sáng có vẻ thật. Bóng không bao giờ chỉ là "đen"; nó mang màu phản chiếu và màu môi trường.</p>
<pre><code>Thiết lập ánh sáng (mỗi cảnh):
  Nguồn chính  -> hướng + màu (nắng ấm? trăng lạnh?)
  Màu bóng     -> nhiệt màu ngược với nguồn chính
  Sáng phản    -> ánh sáng dội từ nền vào vùng bóng
  Môi trường   -> sắc chung cả cảnh đang chìm trong đó
</code></pre>
<div class="callout"><span class="badge">Bảng màu giới hạn</span> Chọn một nhóm nhỏ (vd một nóng, một lạnh, một trung tính) và ở trong đó. Bảng màu giới hạn cho cảm giác <strong>một nguồn sáng thống nhất</strong> — trộn quá nhiều sắc sẽ làm đục không khí.</div>`,
  ]]);

const c4q = quiz('anb402-quiz-4', 'Quiz 4 — Color & light|||Quiz 4 — Màu & ánh sáng', [
  { id: 'q1', question: 'Theo Gurney, thuộc tính nào của màu dựng nên khối và chiều sâu mạnh nhất?', options: ['Sắc (hue)', 'Độ tươi (saturation)', 'Sắc độ (value)', 'Nhiệt độ file'], correctIndex: 2, explanation: '"Value does the work" — sắc độ (sáng/tối) tạo hình khối và chiều sâu; hãy dựng nó trước khi tô màu.' },
  { id: 'q2', question: 'Nếu nguồn sáng chính là nắng ấm (nóng), bóng đổ thường nên ngả về?', options: ['Nóng hơn nữa', 'Lạnh (xanh do trời chiếu)', 'Đen tuyền', 'Trắng'], correctIndex: 1, explanation: 'Quy tắc nóng/lạnh: sáng nóng thì bóng lạnh (và ngược lại), khiến ánh sáng thật hơn.' },
  { id: 'q3', question: 'Vì sao nên dùng bảng màu giới hạn (limited palette)?', options: ['Vẽ nhanh hơn', 'Cho cảm giác một nguồn sáng thống nhất, tránh đục không khí', 'Tiết kiệm màu', 'Bắt buộc trong mọi phần mềm'], correctIndex: 1, explanation: 'Bảng màu giới hạn giữ cảnh trong một ánh sáng thống nhất; trộn quá nhiều sắc làm mood bị đục.' },
]);

const c5 = doc('anb402-5-1-mood', '5.1 — Building mood: time of day & weather|||5.1 — Xây dựng không khí: thời gian trong ngày & thời tiết',
  'Không khí (mood) từ sắc độ + màu + ánh sáng; bình minh/trưa/hoàng hôn/đêm; sương, mưa, tuyết, bão; key (high/low) &amp; contrast quyết định cảm xúc.',
  [[
    `<span class="eyebrow">ANB402 · Chapter 5 · Lesson 5.1</span>
<h2>Building mood: time of day &amp; weather</h2>
<p>Mood is the emotional temperature of a scene — and it comes almost entirely from <strong>light, value and color</strong>. The same building feels welcoming at golden hour and menacing at midnight.</p>
<h3>Time of day</h3>
<ul>
<li><strong>Dawn</strong> — cool, soft, low contrast, hopeful and quiet.</li>
<li><strong>Midday</strong> — high contrast, short hard shadows, neutral/harsh, honest.</li>
<li><strong>Golden hour / sunset</strong> — warm key, long shadows, romantic, nostalgic.</li>
<li><strong>Night</strong> — low key, cool, small pools of warm light, mysterious or tense.</li>
</ul>
<h3>Weather &amp; atmosphere</h3>
<p>Fog lowers contrast and hides the background (isolation, mystery). Rain adds reflections and cool grays (melancholy). Snow simplifies shapes and raises overall value (calm, cold). Storm clouds and dramatic skies raise tension.</p>
<pre><code>Mood dial (choose deliberately):
  Key       -> high-key (light, airy) or low-key (dark, heavy)
  Contrast  -> high (drama/tension) or low (calm/dreamy)
  Temp      -> warm (safe/nostalgic) or cool (lonely/cold)
  Saturation-> vivid (energetic) or muted (somber)
</code></pre>
<div class="callout"><span class="badge">One mood per frame</span> Decide the single feeling first, then push time-of-day, weather and palette all in that direction. Half-measures read as "nothing in particular".</div>`,
    `<span class="eyebrow">ANB402 · Chương 5 · Bài 5.1</span>
<h2>Xây dựng không khí: thời gian trong ngày &amp; thời tiết</h2>
<p>Không khí (mood) là nhiệt độ cảm xúc của một cảnh — và nó gần như hoàn toàn đến từ <strong>ánh sáng, sắc độ và màu</strong>. Cùng một toà nhà thấy ấm áp lúc hoàng hôn và đe doạ lúc nửa đêm.</p>
<h3>Thời gian trong ngày</h3>
<ul>
<li><strong>Bình minh</strong> — lạnh, dịu, tương phản thấp, hy vọng và tĩnh.</li>
<li><strong>Giữa trưa</strong> — tương phản cao, bóng ngắn và gắt, trung tính/khắc nghiệt, thẳng thắn.</li>
<li><strong>Giờ vàng / hoàng hôn</strong> — nguồn sáng ấm, bóng dài, lãng mạn, hoài niệm.</li>
<li><strong>Ban đêm</strong> — tông thấp, lạnh, những vũng sáng ấm nhỏ, bí ẩn hoặc căng.</li>
</ul>
<h3>Thời tiết &amp; khí quyển</h3>
<p>Sương hạ tương phản và giấu hậu cảnh (cô lập, bí ẩn). Mưa thêm phản chiếu và xám lạnh (u buồn). Tuyết đơn giản hoá hình khối và nâng sắc độ chung (tĩnh, lạnh). Mây bão và bầu trời kịch tính đẩy sự căng thẳng lên.</p>
<pre><code>Núm chỉnh mood (chọn có chủ đích):
  Tông       -> high-key (sáng, thoáng) hay low-key (tối, nặng)
  Tương phản -> cao (kịch tính/căng) hay thấp (tĩnh/mộng)
  Nhiệt màu  -> ấm (an toàn/hoài niệm) hay lạnh (cô đơn/lạnh)
  Độ tươi    -> rực (năng lượng) hay trầm (u buồn)
</code></pre>
<div class="callout"><span class="badge">Một mood mỗi khung</span> Quyết cảm giác duy nhất trước, rồi đẩy thời gian, thời tiết và bảng màu cùng về hướng đó. Làm nửa vời thì đọc ra "chẳng cụ thể gì".</div>`,
  ]]);

const c5q = quiz('anb402-quiz-5', 'Quiz 5 — Mood|||Quiz 5 — Không khí', [
  { id: 'q1', question: 'Không khí (mood) của một bối cảnh đến chủ yếu từ đâu?', options: ['Số lượng chi tiết', 'Ánh sáng, sắc độ và màu', 'Độ phân giải', 'Kích thước khung hình'], correctIndex: 1, explanation: 'Cùng một không gian đổi hẳn cảm xúc chỉ nhờ ánh sáng, sắc độ và bảng màu khác nhau.' },
  { id: 'q2', question: 'Cảnh "giờ vàng / hoàng hôn" thường mang cảm giác gì và có đặc điểm ánh sáng nào?', options: ['Lạnh, tương phản thấp, hy vọng', 'Ấm, bóng dài, lãng mạn/hoài niệm', 'Gắt, bóng ngắn, khắc nghiệt', 'Tối, lạnh, bí ẩn'], correctIndex: 1, explanation: 'Giờ vàng có nguồn sáng ấm và bóng dài, gợi cảm giác lãng mạn, hoài niệm.' },
  { id: 'q3', question: 'Sương mù ảnh hưởng thế nào tới bối cảnh?', options: ['Tăng tương phản và làm rõ hậu cảnh', 'Hạ tương phản và giấu hậu cảnh, gợi cô lập/bí ẩn', 'Làm màu rực hơn', 'Không ảnh hưởng chiều sâu'], correctIndex: 1, explanation: 'Sương hạ tương phản, làm mờ và ẩn vật ở xa, tạo cảm giác cô lập, bí ẩn.' },
]);

const c6 = doc('anb402-6-1-architecture-nature', '6.1 — Architecture & natural environments|||6.1 — Thiết kế kiến trúc & môi trường tự nhiên',
  'Kiến trúc kể văn hoá/thời đại; ngôn ngữ hình khối &amp; silhouette; vật liệu; môi trường tự nhiên (cây, đá, nước, địa hình); tính nhất quán thế giới &amp; nghiên cứu tư liệu.',
  [[
    `<span class="eyebrow">ANB402 · Chapter 6 · Lesson 6.1</span>
<h2>Architecture &amp; natural environments</h2>
<h3>Designing architecture</h3>
<p>Buildings are worldbuilding. Their <strong>shape language</strong>, materials and wear tell us the culture, era, climate and wealth of the people who built them. A curved organic village and a rigid steel city say opposite things about their societies.</p>
<ul>
<li><strong>Silhouette first</strong> — a design should read from its outline alone before any detail.</li>
<li><strong>Shape language</strong> — round = friendly/soft; angular = dangerous/rigid; tall = powerful.</li>
<li><strong>Believable structure</strong> — even fantasy buildings need gravity, support and function to feel real.</li>
<li><strong>Wear &amp; story</strong> — cracks, moss, repairs tell how long a place has stood and how it is used.</li>
</ul>
<h3>Natural environments</h3>
<p>Nature has its own logic: trees grow toward light, water flows downhill and pools, rock stratifies and erodes. Study real reference — <strong>observe the rules, then stylize</strong>. Group foliage and rocks into big simple masses before adding detail, so the forms stay readable.</p>
<pre><code>World-consistency check:
  1. Same era + culture across all buildings?
  2. Materials match the climate (wood forest / stone mountain)?
  3. Does light &amp; palette match the established mood?
  4. Scale cues (doors, steps) keep sizes believable?
</code></pre>
<div class="callout"><span class="badge">Research, then stylize</span> Gather reference (photos, real places, history). Understand <em>why</em> a form exists, then simplify it to your film's style. Invented-from-nothing worlds feel hollow.</div>`,
    `<span class="eyebrow">ANB402 · Chương 6 · Bài 6.1</span>
<h2>Thiết kế kiến trúc &amp; môi trường tự nhiên</h2>
<h3>Thiết kế kiến trúc</h3>
<p>Công trình là cách dựng thế giới. <strong>Ngôn ngữ hình khối</strong>, vật liệu và sự hao mòn của chúng cho ta biết văn hoá, thời đại, khí hậu và mức giàu nghèo của người dựng nên. Một ngôi làng cong mềm hữu cơ và một thành phố thép cứng nhắc nói hai điều trái ngược về xã hội của chúng.</p>
<ul>
<li><strong>Silhouette trước</strong> — một thiết kế phải đọc được chỉ từ đường viền, trước mọi chi tiết.</li>
<li><strong>Ngôn ngữ hình khối</strong> — tròn = thân thiện/mềm; góc cạnh = nguy hiểm/cứng; cao = quyền lực.</li>
<li><strong>Cấu trúc hợp lý</strong> — dù là kiến trúc kỳ ảo cũng cần trọng lực, điểm đỡ và công năng để thấy thật.</li>
<li><strong>Hao mòn &amp; câu chuyện</strong> — vết nứt, rêu, chỗ vá kể nơi đó đứng bao lâu và được dùng ra sao.</li>
</ul>
<h3>Môi trường tự nhiên</h3>
<p>Thiên nhiên có logic riêng: cây vươn về ánh sáng, nước chảy xuống thấp và đọng lại, đá phân tầng và bị bào mòn. Hãy nghiên cứu tư liệu thật — <strong>quan sát quy luật, rồi mới cách điệu</strong>. Gom tán lá và đá thành các mảng lớn đơn giản trước khi thêm chi tiết, để hình khối vẫn đọc được.</p>
<pre><code>Kiểm tra nhất quán thế giới:
  1. Cùng thời đại + văn hoá trên mọi công trình?
  2. Vật liệu hợp khí hậu (gỗ rừng / đá núi)?
  3. Ánh sáng &amp; bảng màu khớp mood đã định?
  4. Mốc tỉ lệ (cửa, bậc thang) giữ kích thước hợp lý?
</code></pre>
<div class="callout"><span class="badge">Nghiên cứu rồi cách điệu</span> Thu thập tư liệu (ảnh, nơi thật, lịch sử). Hiểu <em>vì sao</em> một hình khối tồn tại, rồi đơn giản hoá theo phong cách phim. Thế giới bịa từ hư không sẽ rỗng.</div>`,
  ]]);

const c6q = quiz('anb402-quiz-6', 'Quiz 6 — Architecture & nature|||Quiz 6 — Kiến trúc & thiên nhiên', [
  { id: 'q1', question: 'Vì sao "silhouette" (đường viền) quan trọng khi thiết kế công trình?', options: ['Vì nó tô màu nhanh', 'Vì thiết kế nên đọc được từ đường viền trước cả khi có chi tiết', 'Vì nó đo phối cảnh', 'Vì nó chỉ dùng cho nhân vật'], correctIndex: 1, explanation: 'Một thiết kế tốt nhận ra được chỉ từ silhouette; nếu outline mờ nhạt thì chi tiết cũng không cứu được.' },
  { id: 'q2', question: 'Kiến trúc trong bối cảnh chủ yếu kể cho khán giả điều gì?', options: ['Giá xây dựng', 'Văn hoá, thời đại, khí hậu & tầng lớp của người dựng', 'Phần mềm dùng để vẽ', 'Độ phân giải cảnh'], correctIndex: 1, explanation: 'Ngôn ngữ hình khối, vật liệu và hao mòn của công trình bộc lộ văn hoá, thời đại và xã hội.' },
  { id: 'q3', question: 'Cách làm đúng khi thiết kế môi trường tự nhiên (cây, đá, nước) là?', options: ['Bịa hoàn toàn cho khác lạ', 'Nghiên cứu quy luật thật rồi cách điệu, gom thành mảng lớn trước', 'Vẽ từng chiếc lá thật chi tiết ngay từ đầu', 'Sao chép nguyên ảnh chụp'], correctIndex: 1, explanation: 'Hiểu logic tự nhiên (cây vươn sáng, nước chảy xuống) rồi đơn giản hoá thành mảng lớn, sau mới thêm chi tiết.' },
]);

const c7 = doc('anb402-7-1-2d-vs-game', '7.1 — Backgrounds for 2D animation vs games: layout|||7.1 — Thiết kế bối cảnh cho hoạt hình 2D vs game: layout',
  'Layout &amp; camera cho hoạt hình 2D (BG/overlay, pan, chừa chỗ diễn xuất); môi trường game (tính lặp/module, tile, 3 chiều đi được, hiệu năng); điểm chung &amp; khác biệt.',
  [[
    `<span class="eyebrow">ANB402 · Chapter 7 · Lesson 7.1</span>
<h2>Backgrounds for 2D animation vs games</h2>
<h3>2D animation layout</h3>
<p>In animation the <strong>layout</strong> stage places the camera and stages the shot before final art. Backgrounds are painted for a <em>specific shot</em>: they must leave clear space for the character to act and read, and are split into layers.</p>
<ul>
<li><strong>BG + overlay layers</strong> — foreground elements sit on separate planes for parallax on a pan.</li>
<li><strong>Pan &amp; camera moves</strong> — a background may be painted wider than the frame to allow panning.</li>
<li><strong>Staging space</strong> — keep busy detail away from where the character will be.</li>
</ul>
<h3>Game environments</h3>
<p>Games are <strong>interactive and repeated</strong>: the player sees a place from many angles and for a long time, so environments favor <strong>modularity and reuse</strong>.</p>
<ul>
<li><strong>Modular / tiling</strong> — reusable pieces and seamless tiles build large worlds cheaply.</li>
<li><strong>Playable space</strong> — layout must guide the player and support navigation, not just look good.</li>
<li><strong>Performance</strong> — budgets on detail, texture size and repetition; readability at speed.</li>
</ul>
<pre><code>2D shot vs Game level:
  2D  -> one camera, one moment, painted for THIS shot
  Game-> many cameras, hours of play, built from reusable parts
  Both-> composition, mood, color/light, story still rule
</code></pre>
<div class="callout"><span class="badge">Same craft, different constraints</span> Storytelling, composition and light apply to both. The difference is the medium's rules: a film frame is fixed; a game space must work from every angle and be cheap to repeat.</div>`,
    `<span class="eyebrow">ANB402 · Chương 7 · Bài 7.1</span>
<h2>Thiết kế bối cảnh cho hoạt hình 2D vs game</h2>
<h3>Layout hoạt hình 2D</h3>
<p>Trong hoạt hình, giai đoạn <strong>layout</strong> đặt camera và dàn cảnh trước khi vẽ hoàn thiện. Bối cảnh được vẽ cho một <em>cảnh cụ thể</em>: phải chừa chỗ rõ ràng cho nhân vật diễn và được đọc, và tách thành nhiều lớp.</p>
<ul>
<li><strong>Lớp BG + overlay</strong> — phần tiền cảnh nằm ở lớp riêng để tạo parallax khi pan.</li>
<li><strong>Pan &amp; chuyển camera</strong> — bối cảnh có thể vẽ rộng hơn khung để cho phép lia máy.</li>
<li><strong>Khoảng dàn cảnh</strong> — giữ chi tiết rối tránh xa chỗ nhân vật sẽ đứng.</li>
</ul>
<h3>Môi trường game</h3>
<p>Game <strong>tương tác và lặp lại</strong>: người chơi thấy một nơi từ nhiều góc và trong thời gian dài, nên môi trường ưu tiên <strong>tính module và tái sử dụng</strong>.</p>
<ul>
<li><strong>Module / tile</strong> — các mảnh tái dùng và tile liền mạch dựng thế giới lớn với chi phí thấp.</li>
<li><strong>Không gian chơi được</strong> — layout phải dẫn người chơi và hỗ trợ di chuyển, không chỉ đẹp.</li>
<li><strong>Hiệu năng</strong> — ngân sách cho chi tiết, kích thước texture và độ lặp; đọc được cả khi lướt nhanh.</li>
</ul>
<pre><code>Cảnh 2D vs màn game:
  2D  -> một camera, một khoảnh khắc, vẽ cho ĐÚNG cảnh này
  Game-> nhiều camera, hàng giờ chơi, ghép từ mảnh tái dùng
  Chung-> bố cục, mood, màu/ánh sáng, câu chuyện vẫn chi phối
</code></pre>
<div class="callout"><span class="badge">Cùng nghề, khác ràng buộc</span> Kể chuyện, bố cục và ánh sáng áp cho cả hai. Khác nhau ở quy tắc của môi trường: khung phim là cố định; không gian game phải hoạt động từ mọi góc và rẻ để lặp lại.</div>`,
  ]]);

const c7q = quiz('anb402-quiz-7', 'Quiz 7 — 2D vs game|||Quiz 7 — 2D vs game', [
  { id: 'q1', question: 'Giai đoạn "layout" trong hoạt hình 2D làm gì?', options: ['Tô màu cuối cùng', 'Đặt camera & dàn cảnh trước khi vẽ hoàn thiện', 'Kết xuất video', 'Lồng tiếng'], correctIndex: 1, explanation: 'Layout xác định góc máy và dàn cảnh; bối cảnh được vẽ cho đúng cảnh đó, chừa chỗ cho nhân vật.' },
  { id: 'q2', question: 'Vì sao môi trường game ưu tiên tính module và tile liền mạch?', options: ['Vì game không cần đẹp', 'Vì người chơi thấy nơi đó từ nhiều góc/lâu, cần tái dùng & tiết kiệm hiệu năng', 'Vì tile luôn đẹp hơn', 'Vì không cần bố cục'], correctIndex: 1, explanation: 'Game tương tác, lặp lại và có ngân sách hiệu năng, nên các mảnh module/tile tái dùng để dựng thế giới lớn với chi phí thấp.' },
  { id: 'q3', question: 'Điểm chung giữa bối cảnh phim 2D và môi trường game là?', options: ['Đều chỉ vẽ một góc nhìn', 'Bố cục, mood, màu/ánh sáng và kể chuyện vẫn chi phối cả hai', 'Đều dùng chung engine', 'Đều không cần chừa chỗ nhân vật'], correctIndex: 1, explanation: 'Dù ràng buộc khác nhau, nguyên lý kể chuyện, bố cục và ánh sáng áp dụng cho cả hai môi trường.' },
]);

const c8 = doc('anb402-8-1-pipeline', '8.1 — Pipeline: concept → line → color, matte painting & handoff|||8.1 — Quy trình: concept → line → color, matte painting & bàn giao',
  'Quy trình sản xuất: thumbnail → concept/color key → line/rough → color/paint → matte painting → cleanup &amp; bàn giao (layer, tài liệu, model pack) cho sản xuất.',
  [[
    `<span class="eyebrow">ANB402 · Chapter 8 · Lesson 8.1</span>
<h2>Pipeline: concept → line → color, matte painting &amp; handoff</h2>
<p>A professional background moves through clear stages. Solving big problems early (composition, mood) means late stages are just execution.</p>
<pre><code>Production pipeline:
  1. Thumbnails   -> small B/W value sketches, test compositions
  2. Color key    -> tiny color study locking mood & light
  3. Line / rough -> perspective grid + clean line drawing
  4. Color / paint-> flats -> light & shadow -> detail passes
  5. Matte paint  -> photo + paint blend for realistic vistas
  6. Cleanup      -> layers, labels, ready for production
</code></pre>
<h3>Concept vs matte painting</h3>
<ul>
<li><strong>Concept art</strong> — explores and sells the idea; can be loose. Its job is to decide the design.</li>
<li><strong>Matte painting</strong> — a finished, believable environment (often photo + paint), used as final imagery or a plate behind the action.</li>
</ul>
<h3>Handoff to production</h3>
<p>The deliverable is not a single flat image. It is <strong>organized</strong> so others can build on it: separated layers (BG/mid/FG, overlays), color/light notes, scale references, and consistency with the model pack so the whole film or game feels like one world.</p>
<div class="callout"><span class="badge">Solve early</span> Never fix a broken composition with rendering. Get thumbnails and the color key right first — polish cannot rescue a weak foundation, and reworking late costs the most.</div>`,
    `<span class="eyebrow">ANB402 · Chương 8 · Bài 8.1</span>
<h2>Quy trình: concept → line → color, matte painting &amp; bàn giao</h2>
<p>Một bối cảnh chuyên nghiệp đi qua các bước rõ ràng. Giải quyết vấn đề lớn sớm (bố cục, mood) thì các bước sau chỉ còn là thực thi.</p>
<pre><code>Quy trình sản xuất:
  1. Thumbnail   -> phác trắng-đen nhỏ, thử bố cục
  2. Color key   -> nghiên cứu màu nhỏ, chốt mood & ánh sáng
  3. Line / rough-> lưới phối cảnh + nét vẽ sạch
  4. Color / paint-> flat -> sáng & bóng -> các lượt chi tiết
  5. Matte paint -> trộn ảnh + vẽ cho toàn cảnh chân thực
  6. Cleanup     -> chia lớp, gắn nhãn, sẵn cho sản xuất
</code></pre>
<h3>Concept và matte painting</h3>
<ul>
<li><strong>Concept art</strong> — khám phá và "bán" ý tưởng; có thể vẽ phóng. Việc của nó là chốt thiết kế.</li>
<li><strong>Matte painting</strong> — một môi trường hoàn thiện, đáng tin (thường ảnh + vẽ), dùng làm hình cuối hoặc phông sau hành động.</li>
</ul>
<h3>Bàn giao cho sản xuất</h3>
<p>Sản phẩm giao không phải một ảnh bẹt đơn lẻ. Nó được <strong>tổ chức</strong> để người khác dựng tiếp: các lớp tách riêng (BG/mid/FG, overlay), ghi chú màu/ánh sáng, mốc tỉ lệ, và nhất quán với model pack để cả phim hay game thấy như một thế giới.</p>
<div class="callout"><span class="badge">Giải sớm</span> Đừng bao giờ cứu một bố cục hỏng bằng cách tô kỹ. Hãy làm đúng thumbnail và color key trước — độ bóng bẩy không cứu nổi nền móng yếu, và sửa muộn là tốn kém nhất.</div>`,
  ]]);

const c8q = quiz('anb402-quiz-8', 'Quiz 8 — Pipeline & handoff|||Quiz 8 — Quy trình & bàn giao', [
  { id: 'q1', question: 'Bước đầu tiên nên làm trong quy trình thiết kế một bối cảnh là?', options: ['Tô màu chi tiết ngay', 'Phác thumbnail trắng-đen để thử bố cục & sắc độ', 'Matte painting', 'Gắn nhãn layer'], correctIndex: 1, explanation: 'Giải bố cục và sắc độ sớm bằng thumbnail nhỏ; các bước sau chỉ là thực thi khi nền móng đã vững.' },
  { id: 'q2', question: '"Color key" trong quy trình dùng để làm gì?', options: ['Chốt mã màu cho lập trình', 'Nghiên cứu màu nhỏ để chốt mood & ánh sáng trước khi vẽ lớn', 'Đặt tên file', 'Kiểm tra phối cảnh'], correctIndex: 1, explanation: 'Color key là study màu nhỏ giúp khoá không khí và ánh sáng trước khi đầu tư vẽ bản lớn.' },
  { id: 'q3', question: 'Khi bàn giao bối cảnh cho sản xuất, điều quan trọng nhất là?', options: ['Xuất một ảnh bẹt duy nhất', 'Tổ chức lớp, ghi chú màu/tỉ lệ, nhất quán với model pack', 'Nén file nhỏ nhất', 'Xoá hết layer cho gọn'], correctIndex: 1, explanation: 'Sản phẩm giao phải có các lớp tách riêng, ghi chú và nhất quán thế giới để người khác dựng tiếp.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'ANB402',
    slug: 'anb402-background-design',
    title: 'Background Design',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ANB402.webp',
    shortDescription: 'Design environments that tell the story for animation & games — the storytelling role of background, perspective, composition, color & light, mood, architecture & nature, 2D vs game layout, and the concept-to-color pipeline. Bilingual, with process checklists & quizzes.|||Thiết kế bối cảnh kể chuyện cho hoạt hình & game — vai trò kể chuyện, phối cảnh, bố cục, màu & ánh sáng, không khí, kiến trúc & thiên nhiên, layout 2D vs game, quy trình concept đến màu. Song ngữ, có checklist & quiz.',
    description: 'Môn <strong>ANB402 — Background Design</strong> (kỳ 5, ngành Thiết kế mỹ thuật số) dạy thiết kế <strong>bối cảnh phục vụ câu chuyện</strong> cho hoạt hình và game. Từ <strong>vai trò kể chuyện của bối cảnh</strong> → <strong>phối cảnh</strong> (1/2/3 điểm tụ) &amp; không gian → <strong>bố cục &amp; dẫn mắt</strong> → <strong>lý thuyết màu &amp; ánh sáng</strong> → <strong>không khí, thời gian &amp; thời tiết</strong> → <strong>kiến trúc &amp; môi trường tự nhiên</strong> → <strong>layout 2D vs game</strong> → <strong>quy trình concept → line → color, matte painting &amp; bàn giao</strong>. Bám giáo trình nghề (Fowkes, Gurney, Framed Ink, Tonko House), song ngữ, có checklist quy trình và quiz mỗi chương.',
    whatYouLearn: 'Bối cảnh như diễn xuất không lời (story first); phối cảnh 1/2/3 điểm tụ, đường chân trời & 3 lớp chiều sâu; bố cục, điểm nhấn, đường dẫn & phép nheo mắt; sắc độ trước màu, nhiệt màu nóng/lạnh, bảng màu giới hạn; xây dựng mood theo thời gian trong ngày & thời tiết; thiết kế kiến trúc (silhouette, ngôn ngữ hình khối) & môi trường tự nhiên; khác biệt layout hoạt hình 2D vs môi trường game; quy trình concept → line → color, matte painting & bàn giao có tổ chức.',
    requirements: 'Kỹ năng vẽ cơ bản (hình khối, sắc độ). Nên có phần mềm vẽ số (Photoshop, Clip Studio Paint hoặc Krita miễn phí) và thói quen quan sát, ký hoạ tư liệu.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách nghề, studio tham khảo, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Bối cảnh làm gì cho câu chuyện; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Vai trò kể chuyện|||Chapter 1 — Storytelling role', description: 'Bối cảnh là diễn xuất không lời, story first.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Phối cảnh & không gian|||Chapter 2 — Perspective & space', description: 'Điểm tụ 1/2/3, tầm mắt, 3 lớp chiều sâu.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Bố cục & dẫn mắt|||Chapter 3 — Composition', description: 'Điểm nhấn, đường dẫn, quy tắc 1/3, nheo mắt.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Màu & ánh sáng|||Chapter 4 — Color & light', description: 'Sắc độ trước màu, nhiệt nóng/lạnh, bảng màu giới hạn.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Không khí (mood)|||Chapter 5 — Mood', description: 'Thời gian trong ngày, thời tiết, núm chỉnh mood.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Kiến trúc & thiên nhiên|||Chapter 6 — Architecture & nature', description: 'Silhouette, ngôn ngữ hình khối, nhất quán thế giới.', lessons: [c6, c6q] },
    { title: 'Chương 7 — 2D vs game (layout)|||Chapter 7 — 2D vs game', description: 'Layout phim, môi trường module/tile, điểm chung.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Quy trình & bàn giao|||Chapter 8 — Pipeline & handoff', description: 'Concept → line → color, matte painting, bàn giao.', lessons: [c8, c8q] },
  ],
};
