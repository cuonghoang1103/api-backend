/**
 * ANS301 — Storyboarding (Vẽ phân cảnh / Bảng phân cảnh). Ngành Thiết kế mỹ
 * thuật số FPTU, kỳ 5. Khung 8 chương theo sách chuẩn quốc tế: Marcos
 * Mateu-Mestre "Framed Ink", John Hart "The Art of the Storyboard", tài liệu
 * story artist của Disney/Pixar. Song ngữ VI+EN, mỗi chương 1 DOCUMENT + 1 QUIZ.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; & → &amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ans301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Framed Ink, The Art of the Storyboard), tài liệu story artist Disney/Pixar, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">ANS301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>storyboarding</strong> — from the film language behind a shot to a full animatic — in one place. The official slides &amp; textbook live on <strong>FLM</strong>; below are the industry-standard books and free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ANS301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.framedink.com/" target="_blank" rel="noopener"><em>Framed Ink</em> — Marcos Mateu-Mestre</a> (composition &amp; visual storytelling for comics, film &amp; animation)</li>
<li><a href="https://en.wikipedia.org/wiki/Storyboard" target="_blank" rel="noopener"><em>The Art of the Storyboard</em> — John Hart</a> (a filmmaker's introduction)</li>
<li><em>Directing the Story</em> — Francis Glebas (Disney story artist) — story structure for boards</li>
</ul>
<h3>🌐 Official / free resources</h3>
<ul>
<li><a href="https://www.pixar.com/" target="_blank" rel="noopener">Pixar</a> &amp; <a href="https://www.disneyanimation.com/" target="_blank" rel="noopener">Disney Animation</a> — behind-the-scenes on story reels &amp; boarding</li>
<li><a href="https://www.studiobinder.com/blog/" target="_blank" rel="noopener">StudioBinder blog</a> — shot lists, storyboards, camera language</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@marcosmateumestre" target="_blank" rel="noopener">Marcos Mateu-Mestre</a> — composition talks from the author of Framed Ink</li>
<li><a href="https://www.youtube.com/@Toniko" target="_blank" rel="noopener">Toniko Pantoja</a> — working story artist on process &amp; storyboarding</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://wonderunit.com/storyboarder/" target="_blank" rel="noopener">Storyboarder (Wonder Unit)</a> — free storyboarding app</li>
<li><a href="https://krita.org/" target="_blank" rel="noopener">Krita</a> — free digital drawing for thumbnails &amp; boards</li>
<li><a href="https://www.blender.org/" target="_blank" rel="noopener">Blender</a> — grease pencil &amp; 3D layout for previz / animatic</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Read the frame</strong> — learn shot sizes, camera angles and composition (Framed Ink) so a single panel reads clearly.</li>
<li><strong>Board a scene</strong> — take a short script or comic page and thumbnail it into a sequence; keep continuity and the 180° rule.</li>
<li><strong>Go deeper</strong> — camera moves, staging, pacing and transitions; study a real film's storyboards next to the finished shots.</li>
<li><strong>Job-ready</strong> — cut a timed animatic, take direction and revise, and build a focused portfolio.</li>
</ol></div>`,
    `<span class="eyebrow">ANS301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>vẽ phân cảnh (storyboard)</strong> — từ ngôn ngữ điện ảnh sau một cú máy đến một animatic hoàn chỉnh — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là các sách chuẩn của ngành và nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ANS301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.framedink.com/" target="_blank" rel="noopener"><em>Framed Ink</em> — Marcos Mateu-Mestre</a> (bố cục &amp; kể chuyện bằng hình cho truyện tranh, phim &amp; hoạt hình)</li>
<li><a href="https://en.wikipedia.org/wiki/Storyboard" target="_blank" rel="noopener"><em>The Art of the Storyboard</em> — John Hart</a> (nhập môn cho người làm phim)</li>
<li><em>Directing the Story</em> — Francis Glebas (story artist Disney) — cấu trúc kể chuyện cho storyboard</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.pixar.com/" target="_blank" rel="noopener">Pixar</a> &amp; <a href="https://www.disneyanimation.com/" target="_blank" rel="noopener">Disney Animation</a> — hậu trường story reel &amp; vẽ phân cảnh</li>
<li><a href="https://www.studiobinder.com/blog/" target="_blank" rel="noopener">Blog StudioBinder</a> — shot list, storyboard, ngôn ngữ máy quay</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@marcosmateumestre" target="_blank" rel="noopener">Marcos Mateu-Mestre</a> — bài giảng bố cục từ tác giả Framed Ink</li>
<li><a href="https://www.youtube.com/@Toniko" target="_blank" rel="noopener">Toniko Pantoja</a> — story artist đang làm nghề chia sẻ quy trình &amp; vẽ board</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://wonderunit.com/storyboarder/" target="_blank" rel="noopener">Storyboarder (Wonder Unit)</a> — phần mềm vẽ storyboard miễn phí</li>
<li><a href="https://krita.org/" target="_blank" rel="noopener">Krita</a> — vẽ số miễn phí cho thumbnail &amp; board</li>
<li><a href="https://www.blender.org/" target="_blank" rel="noopener">Blender</a> — grease pencil &amp; layout 3D cho previz / animatic</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Đọc được khung hình</strong> — học cỡ cảnh, góc máy và bố cục (Framed Ink) để một panel đọc ra ý ngay.</li>
<li><strong>Vẽ board một cảnh</strong> — lấy một đoạn kịch bản hay trang truyện, thumbnail thành chuỗi; giữ continuity và quy tắc 180°.</li>
<li><strong>Đào sâu</strong> — chuyển động máy, dàn cảnh, nhịp và chuyển cảnh; đối chiếu storyboard của một phim thật với cú máy hoàn chỉnh.</li>
<li><strong>Sẵn sàng đi làm</strong> — dựng animatic có canh giờ, nhận và sửa theo đạo diễn, và làm portfolio gọn.</li>
</ol></div>`,
  ]]);

const intro = doc('ans301-0-1-overview', 'Course overview: Storyboarding|||Tổng quan: Vẽ phân cảnh',
  'Storyboard là gì và vai trò của nó; lộ trình: storyboard & quy trình → ngôn ngữ điện ảnh → chuyển động máy → dàn cảnh & continuity → kể chuyện bằng hình → vẽ nhanh → theo thể loại → quy trình chuyên nghiệp & dự án.',
  [[
    `<span class="eyebrow">ANS301 · Lesson 0.1 · Overview</span>
<h2>Storyboarding</h2>
<p class="lead">A <strong>storyboard</strong> is the visual plan of a film, animation or ad — a sequence of drawn panels that shows, shot by shot, <em>what the camera sees</em> and how the story unfolds in time. Before anyone spends money on shooting or animating, the board proves the sequence works.</p>
<h3>Why board first</h3>
<ul>
<li><strong>Think in shots, not sentences</strong> — you plan camera, staging and cutting on cheap paper, not expensive footage.</li>
<li><strong>Communicate the plan</strong> — a director, editor and crew read one shared visual document.</li>
<li><strong>Find problems early</strong> — a confusing action or a broken screen direction is obvious on the board.</li>
</ul>
<h3>Roadmap</h3>
<p>What a storyboard is &amp; the production pipeline → film language (shot sizes, angles, composition) → camera movement → staging &amp; continuity (the 180° rule, eyelines) → visual storytelling (pacing, time, transitions) → fast drawing (thumbnails, gesture) → boarding for different formats → the professional workflow and a portfolio project. Bilingual, with real film/board examples and a quiz per chapter.</p>
<div class="callout"><span class="badge">The core skill</span> Storyboarding is not "nice drawing" — it is <strong>clear visual thinking</strong>. A rough panel that reads instantly beats a beautiful one that confuses.</div>`,
    `<span class="eyebrow">ANS301 · Bài 0.1 · Tổng quan</span>
<h2>Vẽ phân cảnh (Storyboard)</h2>
<p class="lead">Một <strong>storyboard</strong> là bản kế hoạch bằng hình của một phim, hoạt hình hay quảng cáo — một chuỗi khung vẽ cho thấy, từng cú máy, <em>máy quay nhìn thấy gì</em> và câu chuyện diễn ra theo thời gian ra sao. Trước khi ai đó tốn tiền quay hay làm hoạt hình, tấm board chứng minh chuỗi cảnh chạy được.</p>
<h3>Vì sao vẽ board trước</h3>
<ul>
<li><strong>Nghĩ bằng cú máy, không phải bằng câu chữ</strong> — bạn lên máy, dàn cảnh và cách cắt cảnh trên giấy rẻ, không phải trên thước phim đắt tiền.</li>
<li><strong>Truyền đạt kế hoạch</strong> — đạo diễn, dựng phim và ê-kíp cùng đọc một tài liệu hình chung.</li>
<li><strong>Phát hiện lỗi sớm</strong> — một hành động khó hiểu hay một hướng nhìn bị đảo lộ lộ ra ngay trên board.</li>
</ul>
<h3>Lộ trình</h3>
<p>Storyboard là gì &amp; quy trình sản xuất → ngôn ngữ điện ảnh (cỡ cảnh, góc máy, bố cục) → chuyển động máy quay → dàn cảnh &amp; continuity (quy tắc 180°, eyeline) → kể chuyện bằng hình (nhịp, thời gian, chuyển cảnh) → vẽ nhanh (thumbnail, gesture) → board theo từng thể loại → quy trình chuyên nghiệp và dự án portfolio. Song ngữ, có ví dụ phim/board thật và quiz mỗi chương.</p>
<div class="callout"><span class="badge">Kỹ năng cốt lõi</span> Vẽ phân cảnh không phải "vẽ đẹp" — đó là <strong>tư duy hình rõ ràng</strong>. Một panel thô mà đọc ra ngay hơn hẳn một panel đẹp mà gây rối.</div>`,
  ]]);

const c1 = doc('ans301-1-1-what-is-storyboard', '1.1 — What a storyboard is|||1.1 — Storyboard là gì',
  'Định nghĩa, vai trò trong phim/hoạt hình/quảng cáo; vị trí trong quy trình sản xuất (tiền kỳ → sản xuất → hậu kỳ); story reel/animatic.',
  [[
    `<span class="eyebrow">ANS301 · Chapter 1 · Lesson 1.1</span>
<h2>What a storyboard is</h2>
<h3>A visual blueprint</h3>
<p>A <strong>storyboard</strong> is a sequence of panels — like a comic — that maps a film or animation shot by shot. Each panel shows the framing, the key action and often the camera move; notes below carry dialogue, sound and timing. It answers three questions before production: <em>where is the camera, what is in frame, and what happens next?</em></p>
<h3>Where it lives in the pipeline</h3>
<pre><code>Development  -> script / concept
Pre-production
   -> STORYBOARD  (plan every shot on paper)
   -> animatic / story reel (boards cut to timing + sound)
Production   -> shoot (live action) OR animate (animation)
Post         -> edit, VFX, sound, grade
</code></pre>
<p>In <strong>animation</strong> the board is the true first draft of the film — a scene that fails on the board is redrawn, not re-animated. In <strong>live action</strong> and <strong>advertising (TVC)</strong> the board aligns the director, DP and client before an expensive shoot day.</p>
<h3>Storyboard vs animatic</h3>
<p>A storyboard is still images; an <strong>animatic</strong> (or <strong>story reel</strong>) is those panels edited to real timing with scratch dialogue and sound — so you can feel the pacing, not just see the shots.</p>
<div class="callout"><span class="badge">Real example</span> Pixar builds an entire <strong>story reel</strong> from hand-drawn boards and rebuilds it many times before a single frame is animated — the story is "shot" on paper first.</div>`,
    `<span class="eyebrow">ANS301 · Chương 1 · Bài 1.1</span>
<h2>Storyboard là gì</h2>
<h3>Bản thiết kế bằng hình</h3>
<p>Một <strong>storyboard</strong> là một chuỗi panel — như truyện tranh — vạch ra một phim hay hoạt hình theo từng cú máy. Mỗi panel cho thấy cách đóng khung, hành động chính và thường cả chuyển động máy; ghi chú bên dưới mang lời thoại, âm thanh và thời lượng. Nó trả lời ba câu hỏi trước khi sản xuất: <em>máy quay ở đâu, trong khung có gì, và tiếp theo xảy ra gì?</em></p>
<h3>Vị trí trong quy trình</h3>
<pre><code>Phát triển   -> kịch bản / ý tưởng
Tiền kỳ
   -> STORYBOARD  (lên từng cú máy trên giấy)
   -> animatic / story reel (board cắt theo giờ + âm thanh)
Sản xuất     -> quay (phim thật) HOẶC làm hoạt hình
Hậu kỳ       -> dựng, VFX, âm thanh, chỉnh màu
</code></pre>
<p>Trong <strong>hoạt hình</strong>, board chính là bản nháp đầu tiên thật sự của phim — một cảnh hỏng trên board thì vẽ lại, chứ không làm lại hoạt hình. Trong <strong>phim người đóng</strong> và <strong>quảng cáo (TVC)</strong>, board thống nhất đạo diễn, DP và khách hàng trước một ngày quay tốn kém.</p>
<h3>Storyboard và animatic</h3>
<p>Storyboard là các hình tĩnh; <strong>animatic</strong> (hay <strong>story reel</strong>) là các panel đó được dựng theo thời gian thật kèm thoại và âm thanh nháp — để bạn cảm được nhịp, chứ không chỉ nhìn thấy cú máy.</p>
<div class="callout"><span class="badge">Ví dụ thật</span> Pixar dựng cả một <strong>story reel</strong> từ board vẽ tay và làm lại nhiều lần trước khi làm hoạt hình một khung nào — câu chuyện được "quay" trên giấy trước.</div>`,
  ]]);

const c1q = quiz('ans301-quiz-1', 'Quiz 1 — What a storyboard is|||Quiz 1 — Storyboard là gì', [
  { id: 'q1', question: 'Storyboard chủ yếu được dựng ở giai đoạn nào của sản xuất?', options: ['Hậu kỳ (post)', 'Tiền kỳ (pre-production)', 'Phát hành', 'Quảng bá'], correctIndex: 1, explanation: 'Storyboard là công cụ tiền kỳ — lên kế hoạch từng cú máy trước khi quay/làm hoạt hình.' },
  { id: 'q2', question: 'Khác biệt cốt lõi giữa storyboard và animatic là?', options: ['Animatic là các panel dựng theo thời gian thật kèm âm thanh', 'Animatic vẽ đẹp hơn', 'Storyboard luôn màu, animatic đen trắng', 'Không có khác biệt'], correctIndex: 0, explanation: 'Animatic (story reel) cắt board theo timing thật + thoại/âm thanh để cảm được nhịp.' },
  { id: 'q3', question: 'Trong hoạt hình, vì sao board được coi là bản nháp đầu tiên của phim?', options: ['Vì nó tô màu sẵn', 'Vì cảnh hỏng có thể sửa trên board, không phải làm lại hoạt hình đắt tiền', 'Vì nó thay cho kịch bản', 'Vì nó là khâu cuối'], correctIndex: 1, explanation: 'Sửa trên board rẻ; làm lại hoạt hình một cảnh đã dựng thì rất tốn kém.' },
]);

const c2 = doc('ans301-2-1-film-language', '2.1 — Film language: shots, angles & composition|||2.1 — Ngôn ngữ điện ảnh: cỡ cảnh, góc máy & bố cục',
  'Cỡ cảnh (ELS/LS/MS/CU/ECU), góc máy (ngang/cao/thấp/dutch), bố cục khung hình (rule of thirds, headroom, lead room, đường dẫn).',
  [[
    `<span class="eyebrow">ANS301 · Chapter 2 · Lesson 2.1</span>
<h2>Film language: shots, angles &amp; composition</h2>
<h3>Shot size — how much we see</h3>
<ul>
<li><strong>ELS / LS (extreme long / long shot)</strong> — the world &amp; where the character is; establishes place.</li>
<li><strong>MS (medium shot)</strong> — waist up; conversation and gesture.</li>
<li><strong>CU / ECU (close-up / extreme close-up)</strong> — a face or a detail; emotion and emphasis.</li>
</ul>
<p>Cutting from wide to close controls what the audience pays attention to — the size <em>is</em> the meaning.</p>
<h3>Camera angle — how we feel</h3>
<ul>
<li><strong>Eye level</strong> — neutral.</li>
<li><strong>Low angle</strong> (looking up) — the subject feels powerful, dominant.</li>
<li><strong>High angle</strong> (looking down) — the subject feels small, vulnerable.</li>
<li><strong>Dutch tilt</strong> (canted) — unease, tension.</li>
</ul>
<h3>Composition inside the frame</h3>
<p>Place the subject with the <strong>rule of thirds</strong>; leave <strong>headroom</strong> above the head and <strong>lead room</strong> in the direction of a look or a move; use <strong>leading lines</strong> and light/dark contrast to point the eye. Framed Ink calls this "designing the shot so the eye lands where the story needs it."</p>
<div class="callout"><span class="badge">Board tip</span> On a panel, label the shot size (LS / MS / CU) — it tells the crew the framing even when the drawing is rough.</div>`,
    `<span class="eyebrow">ANS301 · Chương 2 · Bài 2.1</span>
<h2>Ngôn ngữ điện ảnh: cỡ cảnh, góc máy &amp; bố cục</h2>
<h3>Cỡ cảnh — thấy được bao nhiêu</h3>
<ul>
<li><strong>ELS / LS (viễn cảnh / toàn cảnh)</strong> — thế giới &amp; vị trí nhân vật; thiết lập không gian.</li>
<li><strong>MS (trung cảnh)</strong> — từ hông lên; hội thoại và cử chỉ.</li>
<li><strong>CU / ECU (cận / đặc tả)</strong> — một gương mặt hay chi tiết; cảm xúc và nhấn mạnh.</li>
</ul>
<p>Cắt từ rộng sang cận điều khiển việc khán giả chú ý vào đâu — cỡ cảnh <em>chính là</em> ý nghĩa.</p>
<h3>Góc máy — cảm giác ra sao</h3>
<ul>
<li><strong>Ngang tầm mắt</strong> — trung tính.</li>
<li><strong>Góc thấp</strong> (nhìn lên) — nhân vật thấy quyền lực, áp đảo.</li>
<li><strong>Góc cao</strong> (nhìn xuống) — nhân vật thấy nhỏ bé, yếu thế.</li>
<li><strong>Dutch tilt</strong> (nghiêng máy) — bất an, căng thẳng.</li>
</ul>
<h3>Bố cục trong khung</h3>
<p>Đặt chủ thể theo <strong>quy tắc một phần ba</strong>; chừa <strong>headroom</strong> phía trên đầu và <strong>lead room</strong> theo hướng nhìn hoặc hướng di chuyển; dùng <strong>đường dẫn</strong> và tương phản sáng/tối để dắt mắt. Framed Ink gọi đây là "thiết kế cú máy sao cho mắt rơi đúng nơi câu chuyện cần."</p>
<div class="callout"><span class="badge">Mẹo board</span> Trên mỗi panel, ghi cỡ cảnh (LS / MS / CU) — nó nói cho ê-kíp cách đóng khung ngay cả khi bản vẽ còn thô.</div>`,
  ]]);

const c2q = quiz('ans301-quiz-2', 'Quiz 2 — Film language|||Quiz 2 — Ngôn ngữ điện ảnh', [
  { id: 'q1', question: 'Muốn thiết lập không gian và cho thấy nhân vật đang ở đâu, dùng cỡ cảnh nào?', options: ['Cận cảnh (CU)', 'Đặc tả (ECU)', 'Toàn cảnh / viễn cảnh (LS/ELS)', 'Trung cảnh (MS)'], correctIndex: 2, explanation: 'LS/ELS cho thấy bối cảnh và vị trí nhân vật — cảnh thiết lập.' },
  { id: 'q2', question: 'Góc máy thấp (nhìn lên chủ thể) thường tạo cảm giác gì?', options: ['Nhân vật nhỏ bé, yếu thế', 'Nhân vật quyền lực, áp đảo', 'Trung tính', 'Hài hước'], correctIndex: 1, explanation: 'Góc thấp làm chủ thể có vẻ to lớn, mạnh mẽ; góc cao thì ngược lại.' },
  { id: 'q3', question: '"Lead room" trong bố cục là gì?', options: ['Khoảng trống phía trên đầu', 'Khoảng trống chừa theo hướng nhìn hoặc hướng di chuyển', 'Đường chân trời nghiêng', 'Vùng lấy nét'], correctIndex: 1, explanation: 'Lead room là khoảng trống trước hướng nhìn/di chuyển; headroom mới là khoảng trên đầu.' },
]);

const c3 = doc('ans301-3-1-camera-movement', '3.1 — Camera movement on the board|||3.1 — Chuyển động máy quay trên board',
  'Pan, tilt, zoom, dolly/truck, crane, tracking; cách thể hiện chuyển động trên storyboard bằng mũi tên và khung phụ (start/end frame).',
  [[
    `<span class="eyebrow">ANS301 · Chapter 3 · Lesson 3.1</span>
<h2>Camera movement on the board</h2>
<h3>The basic moves</h3>
<ul>
<li><strong>Pan</strong> — camera pivots left/right on a fixed point.</li>
<li><strong>Tilt</strong> — camera pivots up/down on a fixed point.</li>
<li><strong>Zoom</strong> — the lens magnifies; the camera does not move (flattens depth).</li>
<li><strong>Dolly / truck</strong> — the whole camera moves in/out or sideways (depth changes — different feel from a zoom).</li>
<li><strong>Crane / boom</strong> — camera rises or lowers through space.</li>
<li><strong>Tracking / follow</strong> — camera travels with a moving subject.</li>
</ul>
<h3>Showing motion in a static panel</h3>
<p>A board is still, so movement is drawn with a visual grammar:</p>
<ul>
<li><strong>Arrows</strong> — a straight arrow shows a dolly/truck direction; a curved arrow shows a pan/tilt pivot; arrows <em>on the subject</em> show character motion.</li>
<li><strong>Start / end frames</strong> — draw the framing at the beginning and again at the end of the move, and label them "1" and "2".</li>
<li><strong>Inner frame</strong> — a smaller rectangle inside the panel marks where a zoom/push-in ends.</li>
</ul>
<pre><code>Panel notes example:
  Panel 4  | LS -> MS, DOLLY IN on hero (arrow: camera ->)
           | start frame = full room; end frame = hero waist-up
</code></pre>
<div class="callout"><span class="badge">Dolly ≠ zoom</span> A <strong>dolly</strong> changes perspective (background shifts); a <strong>zoom</strong> only magnifies. Boards should say which — they read very differently on screen.</div>`,
    `<span class="eyebrow">ANS301 · Chương 3 · Bài 3.1</span>
<h2>Chuyển động máy quay trên board</h2>
<h3>Các chuyển động cơ bản</h3>
<ul>
<li><strong>Pan</strong> — máy xoay trái/phải quanh một điểm cố định.</li>
<li><strong>Tilt</strong> — máy ngẩng lên/cúi xuống quanh một điểm cố định.</li>
<li><strong>Zoom</strong> — ống kính phóng to; máy không di chuyển (làm dẹt chiều sâu).</li>
<li><strong>Dolly / truck</strong> — cả máy di chuyển vào/ra hoặc sang ngang (chiều sâu đổi — cảm giác khác zoom).</li>
<li><strong>Crane / boom</strong> — máy nâng lên hoặc hạ xuống trong không gian.</li>
<li><strong>Tracking / follow</strong> — máy đi theo chủ thể đang di chuyển.</li>
</ul>
<h3>Thể hiện chuyển động trên một panel tĩnh</h3>
<p>Board là hình tĩnh, nên chuyển động được vẽ bằng một hệ quy ước:</p>
<ul>
<li><strong>Mũi tên</strong> — mũi tên thẳng chỉ hướng dolly/truck; mũi tên cong chỉ trục xoay pan/tilt; mũi tên <em>trên chủ thể</em> chỉ chuyển động nhân vật.</li>
<li><strong>Khung đầu / cuối</strong> — vẽ cách đóng khung ở đầu và ở cuối chuyển động, ghi "1" và "2".</li>
<li><strong>Khung trong</strong> — một hình chữ nhật nhỏ bên trong panel đánh dấu nơi cú zoom/push-in kết thúc.</li>
</ul>
<pre><code>Ví dụ ghi chú panel:
  Panel 4  | LS -> MS, DOLLY IN vào nhân vật (mũi tên: máy ->)
           | khung đầu = cả phòng; khung cuối = nhân vật từ hông lên
</code></pre>
<div class="callout"><span class="badge">Dolly ≠ zoom</span> <strong>Dolly</strong> đổi phối cảnh (hậu cảnh dịch chuyển); <strong>zoom</strong> chỉ phóng to. Board phải ghi rõ cái nào — chúng lên màn hình rất khác nhau.</div>`,
  ]]);

const c3q = quiz('ans301-quiz-3', 'Quiz 3 — Camera movement|||Quiz 3 — Chuyển động máy quay', [
  { id: 'q1', question: 'Khác biệt cốt lõi giữa dolly-in và zoom-in là?', options: ['Không có khác biệt', 'Dolly đổi phối cảnh (máy di chuyển thật); zoom chỉ phóng to bằng ống kính', 'Zoom di chuyển máy, dolly thì không', 'Dolly chỉ dùng cho hoạt hình'], correctIndex: 1, explanation: 'Dolly di chuyển cả máy nên hậu cảnh dịch chuyển; zoom chỉ phóng to, làm dẹt chiều sâu.' },
  { id: 'q2', question: 'Trên storyboard, cách chuẩn để thể hiện một cú dolly-in là?', options: ['Vẽ mỗi một panel tĩnh', 'Vẽ khung đầu và khung cuối kèm mũi tên chỉ hướng máy', 'Tô màu đỏ toàn panel', 'Viết chữ "nhanh"'], correctIndex: 1, explanation: 'Board tĩnh nên chuyển động thể hiện bằng khung start/end + mũi tên.' },
  { id: 'q3', question: 'Máy xoay trái/phải quanh một điểm cố định gọi là?', options: ['Tilt', 'Pan', 'Dolly', 'Crane'], correctIndex: 1, explanation: 'Pan = xoay ngang quanh điểm cố định; tilt = xoay dọc.' },
]);

const c4 = doc('ans301-4-1-staging-continuity', '4.1 — Staging & continuity|||4.1 — Dàn cảnh & continuity',
  'Dàn cảnh (staging), quy tắc 180 độ (trục hành động / line of action), eyeline match, screen direction, continuity giữa các cú máy.',
  [[
    `<span class="eyebrow">ANS301 · Chapter 4 · Lesson 4.1</span>
<h2>Staging &amp; continuity</h2>
<h3>Staging — arrange so it reads</h3>
<p><strong>Staging</strong> is placing characters and camera so the important thing is unmistakable — clear silhouettes, one clear centre of attention, and depth (foreground / midground / background). If you can read the pose as a black silhouette, the staging works.</p>
<h3>The 180° rule (the line of action)</h3>
<p>Draw an imaginary <strong>line</strong> between two characters (or along a movement). Keep the camera on <em>one side</em> of that line across the scene. Then character A always faces screen-right and B faces screen-left — cut to cut, the audience never gets confused about who is where.</p>
<pre><code>          A  <----- line ----->  B
   [cam]  [cam]   both cameras same side -> screen direction holds
                  cross the line -> A and B suddenly swap sides (jarring)
</code></pre>
<h3>Eyeline &amp; screen direction</h3>
<ul>
<li><strong>Eyeline match</strong> — if A looks screen-right at B, the next shot of B should have B looking screen-left, so their looks "meet."</li>
<li><strong>Screen direction</strong> — a character exiting frame-right should enter the next shot from frame-left, so travel feels continuous.</li>
</ul>
<div class="callout"><span class="badge">Why it matters on the board</span> Continuity errors are cheapest to catch on the storyboard. Boarding both shots side by side makes a crossed line or a flipped eyeline obvious before the shoot.</div>`,
    `<span class="eyebrow">ANS301 · Chương 4 · Bài 4.1</span>
<h2>Dàn cảnh &amp; continuity</h2>
<h3>Dàn cảnh (staging) — sắp xếp để đọc ra</h3>
<p><strong>Dàn cảnh</strong> là đặt nhân vật và máy quay sao cho điều quan trọng hiện rõ không nhầm được — bóng dáng rõ, một trung tâm chú ý duy nhất, và có chiều sâu (tiền cảnh / trung cảnh / hậu cảnh). Nếu đọc được dáng nhân vật khi tô đen thành bóng, thì dàn cảnh đã ổn.</p>
<h3>Quy tắc 180° (trục hành động)</h3>
<p>Vẽ một <strong>đường</strong> tưởng tượng nối hai nhân vật (hoặc dọc theo một chuyển động). Giữ máy quay ở <em>một phía</em> của đường đó suốt cảnh. Khi ấy nhân vật A luôn hướng phải màn hình còn B hướng trái — từ cú này sang cú khác, khán giả không bao giờ rối về ai đang ở đâu.</p>
<pre><code>          A  <----- trục ----->  B
   [máy]  [máy]  cùng một phía -> hướng màn hình được giữ
                 vượt qua trục -> A và B đột ngột đổi phía (gây rối)
</code></pre>
<h3>Eyeline &amp; hướng màn hình</h3>
<ul>
<li><strong>Eyeline match</strong> — nếu A nhìn sang phải màn hình về phía B, cú tiếp theo của B nên cho B nhìn sang trái, để hai ánh nhìn "gặp nhau."</li>
<li><strong>Hướng màn hình</strong> — nhân vật ra khỏi khung bên phải thì nên vào cú kế tiếp từ bên trái, để hành trình thấy liền mạch.</li>
</ul>
<div class="callout"><span class="badge">Vì sao quan trọng trên board</span> Lỗi continuity rẻ nhất là bắt ngay trên storyboard. Vẽ hai cú máy cạnh nhau làm lộ ngay một trục bị vượt hay một eyeline bị lật, trước khi quay.</div>`,
  ]]);

const c4q = quiz('ans301-quiz-4', 'Quiz 4 — Staging & continuity|||Quiz 4 — Dàn cảnh & continuity', [
  { id: 'q1', question: 'Quy tắc 180° (trục hành động) yêu cầu gì?', options: ['Máy quay luôn ở một phía của đường nối hai nhân vật', 'Máy quay phải xoay 180° mỗi cú', 'Mọi cảnh dài 180 giây', 'Nhân vật đứng cách nhau 180cm'], correctIndex: 0, explanation: 'Giữ máy một phía của trục để hướng màn hình (screen direction) nhất quán qua các cú cắt.' },
  { id: 'q2', question: '"Eyeline match" nghĩa là?', options: ['Hai nhân vật cùng chiều cao', 'Hướng nhìn giữa các cú máy khớp nhau (A nhìn phải, B nhìn trái) để ánh nhìn gặp nhau', 'Máy đặt ngang tầm mắt', 'Nhân vật nhìn thẳng ống kính'], correctIndex: 1, explanation: 'Eyeline match giữ cho ánh nhìn của hai nhân vật khớp hướng qua các cú cắt.' },
  { id: 'q3', question: 'Test nhanh để biết staging có rõ không là?', options: ['Đếm số màu', 'Đọc được dáng nhân vật khi tô đen thành bóng (silhouette)', 'Đo độ phân giải', 'Xem có bao nhiêu chữ trong panel'], correctIndex: 1, explanation: 'Silhouette rõ = pose và trung tâm chú ý đọc ra được ngay.' },
]);

const c5 = doc('ans301-5-1-visual-storytelling', '5.1 — Visual storytelling: pacing, time & transitions|||5.1 — Kể chuyện bằng hình: nhịp, thời gian & chuyển cảnh',
  'Kể chuyện bằng hình; nhịp (số cú máy & thời lượng), thể hiện thời gian, các kiểu chuyển cảnh (cut, dissolve, wipe, match cut) và ý nghĩa của chúng.',
  [[
    `<span class="eyebrow">ANS301 · Chapter 5 · Lesson 5.1</span>
<h2>Visual storytelling: pacing, time &amp; transitions</h2>
<h3>Tell the story with pictures, not captions</h3>
<p>The goal is that a viewer understands the beat from the <em>images alone</em>. Each panel should advance the story — a new piece of information, a change in emotion, or a shift in the situation. If two panels say the same thing, cut one.</p>
<h3>Pacing — the rhythm of shots</h3>
<ul>
<li><strong>Many short shots</strong> — fast, tense, energetic (an action or chase).</li>
<li><strong>Fewer long shots</strong> — calm, contemplative, lets a moment breathe.</li>
</ul>
<p>On an animatic you set the duration of each panel; pacing is a decision you can hear and feel, not just draw.</p>
<h3>Showing time</h3>
<p>Compress or expand time with cutting: a <strong>montage</strong> collapses hours into seconds; slowing to many small shots stretches a single instant. A held empty frame can signal a pause or the passage of time.</p>
<h3>Transitions and what they mean</h3>
<ul>
<li><strong>Cut</strong> — instant; the default, continuous time.</li>
<li><strong>Dissolve</strong> — one image fades into the next; time passing or a soft link.</li>
<li><strong>Wipe</strong> — a line pushes the old image off; a clear scene/location change.</li>
<li><strong>Match cut</strong> — cut on a matching shape/motion (a bone → a spaceship); a strong idea link.</li>
</ul>
<div class="callout"><span class="badge">Real example</span> The famous <em>2001: A Space Odyssey</em> match cut — a thrown bone cuts to an orbiting craft — leaps millions of years in one frame. On a board you draw the two matching shapes side by side.</div>`,
    `<span class="eyebrow">ANS301 · Chương 5 · Bài 5.1</span>
<h2>Kể chuyện bằng hình: nhịp, thời gian &amp; chuyển cảnh</h2>
<h3>Kể bằng hình, không phải bằng chú thích</h3>
<p>Mục tiêu là người xem hiểu được nhịp truyện chỉ từ <em>hình ảnh</em>. Mỗi panel phải đẩy câu chuyện tiến lên — một thông tin mới, một đổi thay cảm xúc, hay một chuyển biến tình huống. Nếu hai panel nói cùng một điều, bỏ bớt một.</p>
<h3>Nhịp — tiết tấu của các cú máy</h3>
<ul>
<li><strong>Nhiều cú ngắn</strong> — nhanh, căng, dồn dập (một pha hành động hay rượt đuổi).</li>
<li><strong>Ít cú dài</strong> — êm, trầm, để một khoảnh khắc "thở."</li>
</ul>
<p>Trên animatic bạn đặt thời lượng cho từng panel; nhịp là một quyết định nghe và cảm được, chứ không chỉ để vẽ.</p>
<h3>Thể hiện thời gian</h3>
<p>Nén hay giãn thời gian bằng cách cắt: một <strong>montage</strong> dồn nhiều giờ vào vài giây; chậm lại bằng nhiều cú nhỏ thì kéo dài một khoảnh khắc. Một khung trống giữ lâu có thể báo một khoảng lặng hoặc sự trôi qua của thời gian.</p>
<h3>Các kiểu chuyển cảnh và ý nghĩa</h3>
<ul>
<li><strong>Cut</strong> — tức thì; mặc định, thời gian liền mạch.</li>
<li><strong>Dissolve (mờ chồng)</strong> — hình này tan vào hình kia; thời gian trôi hoặc liên kết mềm.</li>
<li><strong>Wipe (gạt)</strong> — một đường đẩy hình cũ đi; đổi cảnh/địa điểm rõ ràng.</li>
<li><strong>Match cut</strong> — cắt trên hình dạng/chuyển động khớp nhau (khúc xương → tàu vũ trụ); liên kết ý tưởng mạnh.</li>
</ul>
<div class="callout"><span class="badge">Ví dụ thật</span> Cú match cut nổi tiếng trong <em>2001: A Space Odyssey</em> — khúc xương tung lên cắt sang con tàu trên quỹ đạo — nhảy hàng triệu năm trong một khung. Trên board bạn vẽ hai hình dạng khớp nhau cạnh nhau.</div>`,
  ]]);

const c5q = quiz('ans301-quiz-5', 'Quiz 5 — Visual storytelling|||Quiz 5 — Kể chuyện bằng hình', [
  { id: 'q1', question: 'Để tạo cảm giác nhanh, căng thẳng cho một pha hành động, cách dựng nhịp nào phù hợp?', options: ['Ít cú dài', 'Nhiều cú ngắn', 'Một cú tĩnh duy nhất', 'Chỉ dùng dissolve'], correctIndex: 1, explanation: 'Nhiều cú ngắn cắt nhanh tạo năng lượng và sự dồn dập.' },
  { id: 'q2', question: '"Match cut" là kiểu chuyển cảnh?', options: ['Cắt trên hình dạng hoặc chuyển động khớp nhau giữa hai cảnh', 'Làm mờ chồng hai hình', 'Một đường gạt hình cũ đi', 'Cắt ngẫu nhiên'], correctIndex: 0, explanation: 'Match cut nối hai cảnh bằng hình dạng/chuyển động tương đồng, tạo liên kết ý mạnh.' },
  { id: 'q3', question: 'Nguyên tắc "mỗi panel phải đẩy câu chuyện tiến lên" nghĩa là?', options: ['Vẽ càng nhiều panel càng tốt', 'Nếu hai panel nói cùng một điều thì bỏ bớt một', 'Mỗi panel phải có lời thoại', 'Panel nào cũng phải là cận cảnh'], correctIndex: 1, explanation: 'Panel thừa (lặp thông tin) làm chậm nhịp — cắt bớt để giữ mạch.' },
]);

const c6 = doc('ans301-6-1-fast-drawing', '6.1 — Fast drawing for storyboards|||6.1 — Vẽ nhanh cho storyboard',
  'Thumbnail, gesture/dáng động, biểu cảm gương mặt cơ bản, phối cảnh nhanh (đường chân trời & điểm tụ), ưu tiên rõ ràng hơn đẹp.',
  [[
    `<span class="eyebrow">ANS301 · Chapter 6 · Lesson 6.1</span>
<h2>Fast drawing for storyboards</h2>
<h3>Thumbnails first</h3>
<p><strong>Thumbnails</strong> are tiny, quick sketches — a whole sequence explored in minutes. Because they are small and rough, you judge <em>composition and flow</em>, not detail. Draw many options fast, pick the ones that read, then refine only those.</p>
<h3>Gesture — capture the action</h3>
<p>A <strong>gesture drawing</strong> catches the <em>line of action</em> — the single sweeping curve of a pose — in a few seconds. Storyboards live on gesture: a clear, dynamic pose beats a stiff, "correct" one. Start every figure from that action line.</p>
<h3>Expression &amp; storytelling shorthand</h3>
<p>Simple face shorthand (brows, mouth, eye direction) carries emotion; you do not need rendered faces. A few lines can say <em>angry, afraid, surprised</em>.</p>
<h3>Fast perspective</h3>
<p>Set a <strong>horizon line</strong> (the camera's eye level) and one or two <strong>vanishing points</strong>; block the space with simple boxes before adding anything. This is enough to place characters believably in depth for a high or low angle.</p>
<div class="callout"><span class="badge">Clarity beats beauty</span> A storyboard is read in seconds by busy people. The professional standard is <strong>fast, clear, and consistent</strong> — not gallery art.</div>`,
    `<span class="eyebrow">ANS301 · Chương 6 · Bài 6.1</span>
<h2>Vẽ nhanh cho storyboard</h2>
<h3>Thumbnail trước tiên</h3>
<p><strong>Thumbnail</strong> là những phác thảo nhỏ, nhanh — khám phá cả một chuỗi cảnh trong vài phút. Vì nhỏ và thô, bạn đánh giá <em>bố cục và mạch chảy</em>, không phải chi tiết. Vẽ thật nhiều phương án nhanh, chọn cái nào đọc ra được, rồi mới tinh chỉnh những cái đó.</p>
<h3>Gesture — bắt lấy hành động</h3>
<p>Một bản <strong>gesture</strong> bắt lấy <em>trục hành động (line of action)</em> — đường cong quét duy nhất của một dáng — trong vài giây. Storyboard sống nhờ gesture: một dáng động rõ ràng hơn hẳn một dáng "đúng" mà cứng đơ. Bắt đầu mỗi nhân vật từ đường hành động đó.</p>
<h3>Biểu cảm &amp; ký hiệu kể chuyện</h3>
<p>Ký hiệu gương mặt đơn giản (lông mày, miệng, hướng mắt) đủ mang cảm xúc; không cần vẽ mặt chi tiết. Vài nét là nói được <em>giận, sợ, bất ngờ</em>.</p>
<h3>Phối cảnh nhanh</h3>
<p>Đặt một <strong>đường chân trời</strong> (ngang tầm mắt của máy) và một hoặc hai <strong>điểm tụ</strong>; dựng khối không gian bằng các hộp đơn giản trước khi thêm gì. Bấy nhiêu là đủ để đặt nhân vật vào chiều sâu một cách thuyết phục cho góc cao hay góc thấp.</p>
<div class="callout"><span class="badge">Rõ ràng hơn đẹp</span> Storyboard được người bận rộn đọc trong vài giây. Chuẩn nghề là <strong>nhanh, rõ, nhất quán</strong> — không phải tranh trưng bày.</div>`,
  ]]);

const c6q = quiz('ans301-quiz-6', 'Quiz 6 — Fast drawing|||Quiz 6 — Vẽ nhanh', [
  { id: 'q1', question: 'Mục đích chính của thumbnail (phác thảo nhỏ) là?', options: ['Vẽ chi tiết từng nhân vật', 'Đánh giá nhanh bố cục & mạch chảy trước khi tinh chỉnh', 'Tô màu cuối cùng', 'Thay cho animatic'], correctIndex: 1, explanation: 'Thumbnail nhỏ & thô để so nhanh bố cục/flow, không phải để hoàn thiện chi tiết.' },
  { id: 'q2', question: '"Line of action" (trục hành động) trong gesture là gì?', options: ['Đường chân trời của phối cảnh', 'Đường cong quét chính thể hiện dáng động của nhân vật', 'Đường nối hai điểm tụ', 'Viền khung panel'], correctIndex: 1, explanation: 'Trục hành động là đường cong chủ đạo tạo nên dáng động, vẽ trước tiên.' },
  { id: 'q3', question: 'Với storyboard, tiêu chí ưu tiên hàng đầu là?', options: ['Đẹp như tranh trưng bày', 'Rõ ràng, nhanh và nhất quán để đọc trong vài giây', 'Càng nhiều chi tiết càng tốt', 'Luôn tô màu đầy đủ'], correctIndex: 1, explanation: 'Board phục vụ giao tiếp nhanh — clarity beats beauty.' },
]);

const c7 = doc('ans301-7-1-boarding-by-format', '7.1 — Storyboarding for different formats|||7.1 — Storyboard cho các thể loại',
  'Board cho phim người đóng, hoạt hình, quảng cáo TVC, game cinematic; animatic và điểm khác nhau về mục tiêu, mật độ cú máy, ràng buộc.',
  [[
    `<span class="eyebrow">ANS301 · Chapter 7 · Lesson 7.1</span>
<h2>Storyboarding for different formats</h2>
<h3>Live-action film</h3>
<p>Boards are used most heavily for complex, expensive, or dangerous shots — action, VFX, crane/car sequences. The board aligns director, DP and stunt/VFX teams and doubles as a shot list. Not every scene is boarded; the tricky ones are.</p>
<h3>Animation</h3>
<p>Here <strong>everything</strong> is boarded — the board is the film's first cut. Story artists board with acting and timing in mind, then it becomes the story reel that the whole production follows.</p>
<h3>Advertising (TVC)</h3>
<p>Short and message-driven. Boards must sell the idea to a <strong>client</strong>, so they are often cleaner/more finished, hit the product beat and the call-to-action, and respect a strict duration (15s / 30s).</p>
<h3>Game cinematic</h3>
<p>Cinematics board like film, but must respect engine and asset limits and often connect to interactive moments; camera can be more free (fully 3D), so previz/layout in 3D often follows the board.</p>
<h3>Animatic — the common deliverable</h3>
<p>Across all formats, the boards are edited into an <strong>animatic</strong> to test timing and pacing before committing budget.</p>
<div class="callout"><span class="badge">One rule, many shapes</span> The visual language (shots, staging, continuity) is the same everywhere; what changes is the <strong>goal</strong> — sell the idea (TVC), be the first cut (animation), or plan the hard shot (live action).</div>`,
    `<span class="eyebrow">ANS301 · Chương 7 · Bài 7.1</span>
<h2>Storyboard cho các thể loại</h2>
<h3>Phim người đóng</h3>
<p>Board được dùng nhiều nhất cho các cú phức tạp, tốn kém hoặc nguy hiểm — hành động, VFX, chuỗi cần crane/xe. Board thống nhất đạo diễn, DP và tổ đóng thế/VFX, và đóng luôn vai một shot list. Không phải cảnh nào cũng board; những cảnh hóc búa thì có.</p>
<h3>Hoạt hình</h3>
<p>Ở đây <strong>mọi thứ</strong> đều được board — board chính là bản cắt đầu tiên của phim. Story artist board với diễn xuất và timing trong đầu, rồi nó thành story reel mà cả đoàn bám theo.</p>
<h3>Quảng cáo (TVC)</h3>
<p>Ngắn và bám thông điệp. Board phải bán được ý tưởng cho <strong>khách hàng</strong>, nên thường sạch/hoàn thiện hơn, phải trúng nhịp sản phẩm và lời kêu gọi hành động, và tôn trọng thời lượng chặt (15s / 30s).</p>
<h3>Game cinematic</h3>
<p>Cinematic board như phim, nhưng phải tôn trọng giới hạn engine và tài nguyên (asset), và thường nối vào các khoảnh khắc tương tác; máy quay có thể tự do hơn (3D hoàn toàn), nên previz/layout 3D thường theo sau board.</p>
<h3>Animatic — sản phẩm giao chung</h3>
<p>Xuyên suốt mọi thể loại, board được dựng thành một <strong>animatic</strong> để thử timing và nhịp trước khi cam kết ngân sách.</p>
<div class="callout"><span class="badge">Một luật, nhiều hình dạng</span> Ngôn ngữ hình (cú máy, dàn cảnh, continuity) ở đâu cũng như nhau; cái đổi là <strong>mục tiêu</strong> — bán ý tưởng (TVC), là bản cắt đầu (hoạt hình), hay lên kế hoạch cú khó (phim thật).</div>`,
  ]]);

const c7q = quiz('ans301-quiz-7', 'Quiz 7 — Boarding by format|||Quiz 7 — Board theo thể loại', [
  { id: 'q1', question: 'Trong hoạt hình, mức độ board so với phim người đóng là?', options: ['Chỉ board cảnh hành động', 'Board gần như MỌI cảnh — board là bản cắt đầu tiên của phim', 'Không cần board', 'Chỉ board cảnh thoại'], correctIndex: 1, explanation: 'Hoạt hình board toàn bộ; story reel là bản nháp đầu của phim.' },
  { id: 'q2', question: 'Đặc thù của board quảng cáo TVC là?', options: ['Không cần tôn trọng thời lượng', 'Phải bán ý tưởng cho khách hàng, trúng nhịp sản phẩm/CTA và tôn trọng thời lượng chặt', 'Luôn dài hơn 5 phút', 'Không cần thông điệp'], correctIndex: 1, explanation: 'TVC ngắn, bám thông điệp, board thường sạch để thuyết phục khách hàng.' },
  { id: 'q3', question: 'Sản phẩm chung được tạo ra từ board ở hầu hết mọi thể loại để thử nhịp/timing là?', options: ['Poster', 'Animatic (story reel)', 'Kịch bản', 'Bản dựng cuối'], correctIndex: 1, explanation: 'Animatic dựng từ board để kiểm nhịp trước khi tốn ngân sách.' },
]);

const c8 = doc('ans301-8-1-pro-workflow-project', '8.1 — Professional workflow & project|||8.1 — Quy trình chuyên nghiệp & dự án',
  'Quy trình đầy đủ: kịch bản → thumbnail → board sạch → animatic; làm việc với đạo diễn (pitch, ghi chú, revision); xây dựng portfolio storyboard.',
  [[
    `<span class="eyebrow">ANS301 · Chapter 8 · Lesson 8.1</span>
<h2>Professional workflow &amp; project</h2>
<h3>The end-to-end pipeline</h3>
<pre><code>1. Read script / brief  -> break into beats
2. Thumbnails           -> explore shots &amp; flow (many, rough)
3. Clean boards         -> readable panels + shot/camera notes
4. Animatic             -> cut to timing + scratch audio
5. Notes &amp; revisions    -> re-board, re-cut, repeat
</code></pre>
<h3>Working with the director</h3>
<ul>
<li><strong>Pitch the boards</strong> — story artists often "act out" the sequence panel by panel to the director/team.</li>
<li><strong>Take notes</strong> — expect revisions; the board serves the story, not your ego. Iterate fast.</li>
<li><strong>Communicate, don't decorate</strong> — a clear note ("PUSH IN", "hold 2s") is worth more than extra rendering.</li>
</ul>
<h3>Building a portfolio</h3>
<p>Show <strong>sequences, not single pretty panels</strong> — a recruiter wants to see you can tell a story across shots: clear staging, continuity, camera choices and pacing. Include at least one full boarded scene (with an animatic if you can), and show range across formats (a dialogue scene, an action beat).</p>
<h3>Your course project</h3>
<p>Take a short script (½–1 page) and carry it through the whole pipeline: beats → thumbnails → clean boards with shot notes → a timed animatic. Apply everything from chapters 2–6 (shot sizes, camera moves, the 180° rule, pacing, transitions) — this is your portfolio piece.</p>
<div class="callout"><span class="badge">The professional habit</span> Board fast and rough first, get feedback early, and revise often. Storyboarding is an <strong>iterative, collaborative</strong> craft — the best board is the one the whole team can build the film from.</div>`,
    `<span class="eyebrow">ANS301 · Chương 8 · Bài 8.1</span>
<h2>Quy trình chuyên nghiệp &amp; dự án</h2>
<h3>Pipeline đầu-cuối</h3>
<pre><code>1. Đọc kịch bản / brief -> chia thành các beat
2. Thumbnail            -> khám phá cú máy &amp; mạch chảy (nhiều, thô)
3. Board sạch           -> panel đọc được + ghi chú cú máy/camera
4. Animatic             -> cắt theo timing + âm thanh nháp
5. Ghi chú &amp; sửa        -> board lại, cắt lại, lặp
</code></pre>
<h3>Làm việc với đạo diễn</h3>
<ul>
<li><strong>Pitch board</strong> — story artist thường "diễn" chuỗi cảnh từng panel cho đạo diễn/đoàn.</li>
<li><strong>Nhận ghi chú</strong> — hãy quen với việc revision; board phục vụ câu chuyện, không phải cái tôi. Lặp nhanh.</li>
<li><strong>Giao tiếp, đừng trang trí</strong> — một ghi chú rõ ("PUSH IN", "giữ 2s") đáng giá hơn tô vẽ thêm.</li>
</ul>
<h3>Xây dựng portfolio</h3>
<p>Trưng ra <strong>chuỗi cảnh, không phải panel đẹp lẻ</strong> — nhà tuyển dụng muốn thấy bạn kể được chuyện qua nhiều cú máy: dàn cảnh rõ, continuity, lựa chọn camera và nhịp. Có ít nhất một cảnh board đầy đủ (kèm animatic nếu được), và cho thấy độ rộng qua các thể loại (một cảnh thoại, một beat hành động).</p>
<h3>Dự án của môn</h3>
<p>Lấy một kịch bản ngắn (½–1 trang) và đưa nó qua cả pipeline: chia beat → thumbnail → board sạch kèm ghi chú cú máy → một animatic có canh giờ. Áp dụng tất cả từ chương 2–6 (cỡ cảnh, chuyển động máy, quy tắc 180°, nhịp, chuyển cảnh) — đây là bài portfolio của bạn.</p>
<div class="callout"><span class="badge">Thói quen nhà nghề</span> Board nhanh và thô trước, lấy phản hồi sớm, và sửa thường xuyên. Vẽ phân cảnh là một nghề <strong>lặp đi lặp lại, cộng tác</strong> — board tốt nhất là board mà cả đoàn dựng được phim từ đó.</div>`,
  ]]);

const c8q = quiz('ans301-quiz-8', 'Quiz 8 — Pro workflow & project|||Quiz 8 — Quy trình & dự án', [
  { id: 'q1', question: 'Thứ tự đúng của pipeline storyboard là?', options: ['Animatic → thumbnail → board sạch → kịch bản', 'Kịch bản/beat → thumbnail → board sạch → animatic', 'Board sạch → kịch bản → thumbnail → animatic', 'Thumbnail → animatic → kịch bản → board'], correctIndex: 1, explanation: 'Chia beat từ kịch bản → thumbnail thô → board sạch + ghi chú → animatic có timing.' },
  { id: 'q2', question: 'Khi làm việc với đạo diễn, thái độ đúng của story artist là?', options: ['Từ chối sửa vì board đã đẹp', 'Quen với revision — board phục vụ câu chuyện, lặp nhanh theo ghi chú', 'Chỉ nộp một phương án duy nhất', 'Trang trí thật kỹ thay vì ghi chú rõ'], correctIndex: 1, explanation: 'Vẽ phân cảnh là công việc lặp và cộng tác; nhận ghi chú và revise nhanh.' },
  { id: 'q3', question: 'Một portfolio storyboard tốt nên trưng ra điều gì trước hết?', options: ['Vài panel đẹp lẻ', 'Chuỗi cảnh đầy đủ cho thấy khả năng kể chuyện qua nhiều cú máy', 'Chỉ ảnh chân dung tô kỹ', 'Số lượng panel càng nhiều càng tốt'], correctIndex: 1, explanation: 'Nhà tuyển dụng muốn thấy staging, continuity, camera & nhịp qua cả một chuỗi, không phải panel lẻ.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'ANS301',
    slug: 'ans301-storyboarding',
    title: 'Storyboarding',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ANS301.webp',
    shortDescription: 'Storyboarding for film, animation & ads — film language (shots, angles, composition), camera movement, staging & continuity (180° rule), visual storytelling, fast drawing & the pro workflow. Bilingual, based on Framed Ink.|||Vẽ phân cảnh cho phim, hoạt hình & quảng cáo — ngôn ngữ điện ảnh (cỡ cảnh, góc máy, bố cục), chuyển động máy, dàn cảnh & continuity (quy tắc 180°), kể chuyện bằng hình (nhịp, chuyển cảnh), vẽ nhanh & quy trình nhà nghề. Song ngữ, dựa trên Framed Ink.',
    description: 'Môn <strong>ANS301 — Storyboarding (Vẽ phân cảnh)</strong> thuộc ngành Thiết kế mỹ thuật số, kỳ 5. Học cách biến kịch bản thành một bản kế hoạch bằng hình: từ <strong>storyboard là gì &amp; quy trình sản xuất</strong> → <strong>ngôn ngữ điện ảnh</strong> (cỡ cảnh, góc máy, bố cục) → <strong>chuyển động máy quay</strong> → <strong>dàn cảnh &amp; continuity</strong> (quy tắc 180°, eyeline) → <strong>kể chuyện bằng hình</strong> (nhịp, thời gian, chuyển cảnh) → <strong>vẽ nhanh</strong> (thumbnail, gesture) → <strong>board theo thể loại</strong> → <strong>quy trình chuyên nghiệp &amp; dự án portfolio</strong>. Bám sách chuẩn quốc tế (Marcos Mateu-Mestre "Framed Ink", John Hart "The Art of the Storyboard", tài liệu story artist Disney/Pixar), song ngữ, có ví dụ phim/board thật và quiz mỗi chương.',
    whatYouLearn: 'Vai trò của storyboard & vị trí trong pipeline; cỡ cảnh (LS/MS/CU), góc máy, bố cục (rule of thirds, headroom, lead room); chuyển động máy (pan/tilt/zoom/dolly/crane) & cách thể hiện bằng mũi tên/khung start-end; dàn cảnh, quy tắc 180°, eyeline, screen direction; nhịp, thể hiện thời gian, các kiểu chuyển cảnh (cut/dissolve/wipe/match cut); vẽ nhanh (thumbnail, gesture, biểu cảm, phối cảnh nhanh); board cho phim/hoạt hình/TVC/game cinematic & animatic; quy trình kịch bản→thumbnail→board→animatic, làm việc với đạo diễn và xây dựng portfolio.',
    requirements: 'Biết vẽ tay/vẽ số cơ bản (nét, dáng người ở mức phác thảo) là lợi thế nhưng không bắt buộc — môn chú trọng tư duy hình rõ ràng hơn kỹ thuật vẽ đẹp. Nên có phần mềm vẽ số (Krita) hoặc giấy bút.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn (Framed Ink, The Art of the Storyboard), tài liệu Disney/Pixar, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Storyboard là gì, vì sao board trước, lộ trình môn.', lessons: [intro] },
    { title: 'Chương 1 — Storyboard là gì|||Chapter 1 — What a storyboard is', description: 'Định nghĩa, vai trò, vị trí trong quy trình, animatic.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Ngôn ngữ điện ảnh|||Chapter 2 — Film language', description: 'Cỡ cảnh, góc máy, bố cục khung hình.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Chuyển động máy quay|||Chapter 3 — Camera movement', description: 'Pan/tilt/zoom/dolly, mũi tên, khung start-end.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Dàn cảnh & continuity|||Chapter 4 — Staging & continuity', description: 'Staging, quy tắc 180°, eyeline, screen direction.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Kể chuyện bằng hình|||Chapter 5 — Visual storytelling', description: 'Nhịp, thời gian, các kiểu chuyển cảnh.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Vẽ nhanh|||Chapter 6 — Fast drawing', description: 'Thumbnail, gesture, biểu cảm, phối cảnh nhanh.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Storyboard cho các thể loại|||Chapter 7 — Boarding by format', description: 'Phim, hoạt hình, TVC, game cinematic, animatic.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Quy trình chuyên nghiệp & dự án|||Chapter 8 — Pro workflow & project', description: 'Kịch bản→thumbnail→board→animatic, làm việc với đạo diễn, portfolio.', lessons: [c8, c8q] },
  ],
};
