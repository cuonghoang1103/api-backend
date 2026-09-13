/**
 * DTG303 — Principles of Animation (Nguyên lý hoạt hình). Ngành Thiết kế mỹ
 * thuật số FPTU, kỳ 4. Khung chất lượng — 8 chương, song ngữ VI+EN.
 * Tài liệu chuẩn: Frank Thomas & Ollie Johnston "The Illusion of Life: Disney
 * Animation" (12 nguyên lý) + Richard Williams "The Animator's Survival Kit";
 * AlanBeckerTutorials (12 principles); Toon Boom / Blender.
 * Giữ NGUYÊN slug/semester/courseCode/thumbnailUrl. ⚠️ KHÔNG backtick lồng/${;
 * "&"→&amp; trong content HTML; tránh nháy đơn trong chuỗi nháy đơn.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('dtg303-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: sách kinh điển (Illusion of Life, Animator Survival Kit), tài liệu miễn phí, YouTube, công cụ (Toon Boom/Blender), lộ trình 4 bước.',
  [[
    `<span class="eyebrow">DTG303 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn the <strong>principles of animation</strong> — the timeless rules behind believable motion — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are the classic books plus free, legal resources.</p>
<h3>📘 The two canonical books</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/The_Illusion_of_Life:_Disney_Animation" target="_blank" rel="noopener"><em>The Illusion of Life: Disney Animation</em> — Frank Thomas &amp; Ollie Johnston</a> — the book that named the <strong>12 principles</strong>.</li>
<li><a href="https://www.theanimatorssurvivalkit.com/" target="_blank" rel="noopener"><em>The Animator's Survival Kit</em> — Richard Williams</a> — timing, spacing and walks, drill by drill.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://docs.toonboom.com/" target="_blank" rel="noopener">Toon Boom Harmony documentation</a> — industry 2D pipeline.</li>
<li><a href="https://docs.blender.org/manual/en/latest/animation/index.html" target="_blank" rel="noopener">Blender manual — Animation</a> — free 3D animation tooling.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@AlanBeckerTutorials" target="_blank" rel="noopener">AlanBeckerTutorials</a> — the 12 principles, one clear video each.</li>
<li><a href="https://www.youtube.com/@BloopAnimation" target="_blank" rel="noopener">Bloop Animation</a> — filmmaking &amp; animation craft.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.blender.org/" target="_blank" rel="noopener">Blender</a> — free 2D grease-pencil &amp; 3D animation.</li>
<li><a href="https://krita.org/" target="_blank" rel="noopener">Krita</a> — free frame-by-frame 2D animation.</li>
<li><a href="https://www.toonboom.com/" target="_blank" rel="noopener">Toon Boom Harmony</a> — professional 2D studio tool.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — learn the 12 principles and what each one fixes; watch the AlanBecker series.</li>
<li><strong>Drill the classics</strong> — animate a <strong>bouncing ball</strong>, then a heavy vs light ball, then a pendulum.</li>
<li><strong>Go deeper</strong> — add anticipation, follow-through and arcs; build a <strong>walk cycle</strong>.</li>
<li><strong>Job-ready</strong> — polish a short shot end to end in Blender or Toon Boom with proper staging and appeal.</li>
</ol></div>`,
    `<span class="eyebrow">DTG303 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>nguyên lý hoạt hình</strong> — những quy tắc bất biến tạo nên chuyển động đáng tin — gom về một chỗ. Slide &amp; giáo trình chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là hai cuốn sách kinh điển cùng nguồn miễn phí, hợp pháp.</p>
<h3>📘 Hai cuốn sách gối đầu</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/The_Illusion_of_Life:_Disney_Animation" target="_blank" rel="noopener"><em>The Illusion of Life: Disney Animation</em> — Frank Thomas &amp; Ollie Johnston</a> — cuốn sách đặt tên cho <strong>12 nguyên lý</strong>.</li>
<li><a href="https://www.theanimatorssurvivalkit.com/" target="_blank" rel="noopener"><em>The Animator's Survival Kit</em> — Richard Williams</a> — timing, spacing và dáng đi, từng bài tập một.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://docs.toonboom.com/" target="_blank" rel="noopener">Tài liệu Toon Boom Harmony</a> — quy trình 2D chuẩn ngành.</li>
<li><a href="https://docs.blender.org/manual/en/latest/animation/index.html" target="_blank" rel="noopener">Sổ tay Blender — Animation</a> — công cụ hoạt hình 3D miễn phí.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@AlanBeckerTutorials" target="_blank" rel="noopener">AlanBeckerTutorials</a> — 12 nguyên lý, mỗi nguyên lý một video rõ ràng.</li>
<li><a href="https://www.youtube.com/@BloopAnimation" target="_blank" rel="noopener">Bloop Animation</a> — nghề làm phim &amp; hoạt hình.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.blender.org/" target="_blank" rel="noopener">Blender</a> — hoạt hình 2D (grease pencil) &amp; 3D miễn phí.</li>
<li><a href="https://krita.org/" target="_blank" rel="noopener">Krita</a> — vẽ hoạt hình 2D từng khung miễn phí.</li>
<li><a href="https://www.toonboom.com/" target="_blank" rel="noopener">Toon Boom Harmony</a> — công cụ studio 2D chuyên nghiệp.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — nắm 12 nguyên lý và mỗi nguyên lý sửa được gì; xem loạt video AlanBecker.</li>
<li><strong>Luyện bài kinh điển</strong> — làm <strong>bóng nảy</strong>, rồi bóng nặng vs bóng nhẹ, rồi con lắc.</li>
<li><strong>Đào sâu</strong> — thêm đón trước, quán tính và cung chuyển động; dựng <strong>chu kỳ đi bộ</strong>.</li>
<li><strong>Sẵn sàng đi làm</strong> — hoàn thiện một cảnh ngắn trọn vẹn trong Blender/Toon Boom với dàn cảnh và sức hút đúng.</li>
</ol></div>`,
  ]]);

const intro = doc('dtg303-0-1-overview', 'Course overview: Principles of Animation|||Tổng quan: Nguyên lý hoạt hình',
  'Hoạt hình là ảo giác chuyển động từ ảnh tĩnh liên tiếp; 12 nguyên lý Disney là bộ quy tắc lõi; lộ trình: nguyên lý nền → phương pháp & quán tính → cung & nhấn nhá → ứng dụng (bóng nảy, walk cycle).',
  [[
    `<span class="eyebrow">DTG303 · Lesson 0.1 · Overview</span>
<h2>Principles of Animation</h2>
<p class="lead">Animation is the <strong>illusion of movement</strong> created by showing a series of still drawings, one after another, fast enough that the eye reads them as motion. This course teaches the craft that makes that motion <strong>believable</strong> — the <strong>12 basic principles</strong> distilled by Disney animators Frank Thomas &amp; Ollie Johnston in <em>The Illusion of Life</em>.</p>
<h3>What the principles are for</h3>
<p>The principles are not decoration — each one solves a specific problem. <strong>Squash &amp; stretch</strong> sells weight and flexibility; <strong>timing</strong> sells mass; <strong>anticipation</strong> makes an action readable; <strong>arcs</strong> make motion feel natural instead of robotic. Learn what each fixes and you can diagnose why a shot feels wrong.</p>
<h3>Roadmap</h3>
<p>The 12 principles &amp; a short history → timing &amp; spacing → squash &amp; stretch and solid drawing → anticipation &amp; staging → straight-ahead vs pose-to-pose, follow-through &amp; overlap → slow in/out &amp; arcs → secondary action, exaggeration &amp; appeal → applying it all to the <strong>bouncing ball</strong> and the <strong>walk cycle</strong> in a 2D/3D pipeline. Bilingual, with classic film references, exercises and a quiz per chapter.</p>`,
    `<span class="eyebrow">DTG303 · Bài 0.1 · Tổng quan</span>
<h2>Nguyên lý hoạt hình</h2>
<p class="lead">Hoạt hình là <strong>ảo giác chuyển động</strong> tạo ra bằng cách chiếu một chuỗi hình tĩnh nối tiếp, đủ nhanh để mắt đọc thành chuyển động. Môn này dạy kỹ năng khiến chuyển động đó <strong>đáng tin</strong> — <strong>12 nguyên lý cơ bản</strong> do các họa sĩ Disney Frank Thomas &amp; Ollie Johnston đúc kết trong cuốn <em>The Illusion of Life</em>.</p>
<h3>Nguyên lý để làm gì</h3>
<p>Nguyên lý không phải trang trí — mỗi cái giải một vấn đề cụ thể. <strong>Squash &amp; stretch</strong> tạo cảm giác trọng lượng và độ dẻo; <strong>timing</strong> tạo khối lượng; <strong>đón trước</strong> khiến động tác dễ đọc; <strong>cung chuyển động</strong> khiến chuyển động tự nhiên thay vì máy móc. Hiểu mỗi nguyên lý sửa gì thì bạn chẩn được vì sao một cảnh nhìn sai.</p>
<h3>Lộ trình</h3>
<p>12 nguyên lý &amp; lịch sử ngắn → timing &amp; spacing → squash &amp; stretch và vẽ chắc → đón trước &amp; dàn cảnh → straight-ahead vs pose-to-pose, quán tính &amp; chồng lấn → slow in/out &amp; cung chuyển động → hành động phụ, phóng đại &amp; sức hút → áp dụng tất cả vào <strong>bóng nảy</strong> và <strong>chu kỳ đi bộ</strong> trong quy trình 2D/3D. Song ngữ, có dẫn chiếu phim kinh điển, bài tập và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('dtg303-1-1-history-12-principles', '1.1 — Animation history & the 12 principles|||1.1 — Lịch sử hoạt hình & 12 nguyên lý',
  'Lịch sử ngắn (persistence of vision, thaumatrope → phim vẽ tay → 3D); tổng quan 12 nguyên lý Disney và mỗi nguyên lý giải quyết điều gì.',
  [[
    `<span class="eyebrow">DTG303 · Chapter 1 · Lesson 1.1</span>
<h2>A short history &amp; the 12 principles</h2>
<h3>How we got here</h3>
<p>Animation works because of <strong>persistence of vision / the phi phenomenon</strong> — the brain fills the gaps between rapid still images into continuous motion. From Victorian toys (thaumatrope, zoetrope) to hand-drawn cinema, and then to CGI, the medium changed but the goal did not: convince the viewer that a drawing is <em>alive</em>.</p>
<h3>The 12 principles at a glance</h3>
<ol>
<li>Squash &amp; stretch</li>
<li>Anticipation</li>
<li>Staging</li>
<li>Straight ahead &amp; pose to pose</li>
<li>Follow through &amp; overlapping action</li>
<li>Slow in &amp; slow out (ease)</li>
<li>Arcs</li>
<li>Secondary action</li>
<li>Timing</li>
<li>Exaggeration</li>
<li>Solid drawing</li>
<li>Appeal</li>
</ol>
<div class="callout"><span class="badge">Why they endure</span> Codified at Disney in the 1930s and named in 1981, these rules describe how real things move and how audiences read motion — so they apply equally to 2D, 3D, stop-motion and motion graphics.</div>`,
    `<span class="eyebrow">DTG303 · Chương 1 · Bài 1.1</span>
<h2>Lịch sử ngắn &amp; 12 nguyên lý</h2>
<h3>Ta đến đây bằng cách nào</h3>
<p>Hoạt hình chạy được nhờ <strong>hiện tượng lưu ảnh / hiệu ứng phi (phi phenomenon)</strong> — não lấp khoảng trống giữa các ảnh tĩnh nối nhanh thành chuyển động liền mạch. Từ đồ chơi thời Victoria (thaumatrope, zoetrope) đến phim vẽ tay, rồi CGI, phương tiện đổi nhưng mục tiêu không đổi: thuyết phục người xem rằng bức vẽ đang <em>sống</em>.</p>
<h3>12 nguyên lý nhìn nhanh</h3>
<ol>
<li>Squash &amp; stretch (co &amp; giãn)</li>
<li>Anticipation (đón trước)</li>
<li>Staging (dàn cảnh)</li>
<li>Straight ahead &amp; pose to pose</li>
<li>Follow through &amp; overlapping (quán tính &amp; chồng lấn)</li>
<li>Slow in &amp; slow out (ease vào/ra)</li>
<li>Arcs (cung chuyển động)</li>
<li>Secondary action (hành động phụ)</li>
<li>Timing (canh thời gian)</li>
<li>Exaggeration (phóng đại)</li>
<li>Solid drawing (vẽ chắc)</li>
<li>Appeal (sức hút)</li>
</ol>
<div class="callout"><span class="badge">Vì sao trường tồn</span> Được hệ thống hóa ở Disney thập ni 1930 và đặt tên năm 1981, các quy tắc này mô tả cách vật thật chuyển động và cách khán giả đọc chuyển động — nên áp dụng như nhau cho 2D, 3D, stop-motion và motion graphics.</div>`,
  ]]);

const c1q = quiz('dtg303-quiz-1', 'Quiz 1 — History & 12 principles|||Quiz 1 — Lịch sử & 12 nguyên lý', [
  { id: 'q1', question: 'Hoạt hình tạo ảo giác chuyển động nhờ hiện tượng nào?', options: ['Khúc xạ ánh sáng', 'Lưu ảnh / hiệu ứng phi (persistence of vision)', 'Cộng hưởng âm', 'Hiệu ứng Doppler'], correctIndex: 1, explanation: 'Não lấp khoảng trống giữa các ảnh tĩnh nối nhanh thành chuyển động liền mạch.' },
  { id: 'q2', question: '12 nguyên lý hoạt hình được đúc kết bởi các họa sĩ của hãng nào?', options: ['Pixar', 'Disney (Thomas & Johnston)', 'Studio Ghibli', 'DreamWorks'], correctIndex: 1, explanation: 'Frank Thomas & Ollie Johnston nêu trong cuốn The Illusion of Life.' },
  { id: 'q3', question: 'Ý nào đúng về 12 nguyên lý?', options: ['Chỉ dùng cho phim 2D vẽ tay', 'Áp dụng cho cả 2D, 3D, stop-motion và motion graphics', 'Chỉ là quy ước màu sắc', 'Đã lỗi thời với CGI'], correctIndex: 1, explanation: 'Chúng mô tả cách chuyển động được đọc, nên áp dụng cho mọi kỹ thuật.' },
]);

const c2 = doc('dtg303-2-1-timing-spacing', '2.1 — Timing & spacing|||2.1 — Timing & spacing',
  'Timing (số khung cho một động tác → khối lượng/cảm xúc), spacing (khoảng cách giữa các khung → gia tốc), frame rate (24fps, ones/twos), key & inbetween.',
  [[
    `<span class="eyebrow">DTG303 · Chapter 2 · Lesson 2.1</span>
<h2>Timing &amp; spacing</h2>
<h3>Timing — how many frames</h3>
<p><strong>Timing</strong> is the number of frames an action takes. Fewer frames = faster = lighter or more forceful; more frames = slower = heavier or calmer. Timing is how you sell <strong>weight</strong>: a bowling ball and a beach ball can travel the same distance, but the timing tells us which is which.</p>
<h3>Spacing — how far between frames</h3>
<p><strong>Spacing</strong> is the distance an object moves between consecutive frames. Even spacing reads as constant speed; spacing that grows or shrinks reads as <strong>acceleration or deceleration</strong>. Two shots with identical timing can feel completely different depending on spacing.</p>
<h3>Frame rate, keys &amp; inbetweens</h3>
<ul>
<li>Film runs at <strong>24 frames per second</strong>. Drawing a new image every frame is <strong>on ones</strong>; every second frame is <strong>on twos</strong> (the common TV/feature default).</li>
<li><strong>Keys</strong> are the defining poses; <strong>inbetweens</strong> are the frames drawn between them; a <strong>breakdown</strong> defines how the motion travels from one key to the next.</li>
</ul>
<pre><code>Same 12 frames, different spacing:
  even    ....  ....  ....   -> constant speed
  bunched .   . .  .   .  .. -> speeds up then slows (ease)
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Timing = mass and mood; spacing = acceleration. Get these two right and half the illusion is done.</div>`,
    `<span class="eyebrow">DTG303 · Chương 2 · Bài 2.1</span>
<h2>Timing &amp; spacing</h2>
<h3>Timing — bao nhiêu khung</h3>
<p><strong>Timing</strong> là số khung hình một động tác chiếm. Ít khung = nhanh = nhẹ hoặc mạnh; nhiều khung = chậm = nặng hoặc điềm tĩnh. Timing là cách tạo cảm giác <strong>trọng lượng</strong>: quả bowling và quả bóng bãi biển có thể đi cùng quãng đường, nhưng timing cho ta biết cái nào là cái nào.</p>
<h3>Spacing — cách nhau bao xa</h3>
<p><strong>Spacing</strong> là khoảng cách vật di chuyển giữa hai khung liên tiếp. Spacing đều đọc thành tốc độ không đổi; spacing tăng dần hoặc giảm dần đọc thành <strong>tăng tốc hoặc giảm tốc</strong>. Hai cảnh cùng timing y hệt vẫn cảm giác khác hẳn tùy spacing.</p>
<h3>Frame rate, key &amp; inbetween</h3>
<ul>
<li>Phim chạy <strong>24 khung mỗi giây</strong>. Vẽ ảnh mới mỗi khung là <strong>on ones</strong>; cứ hai khung một là <strong>on twos</strong> (mặc định thường gặp của TV/phim chiếu rạp).</li>
<li><strong>Key</strong> là các dáng then chốt; <strong>inbetween</strong> là khung vẽ chen giữa; <strong>breakdown</strong> quy định chuyển động đi từ key này sang key kia thế nào.</li>
</ul>
<pre><code>Cùng 12 khung, spacing khác nhau:
  đều     ....  ....  ....   -> tốc độ không đổi
  dồn     .   . .  .   .  .. -> nhanh dần rồi chậm (ease)
</code></pre>
<div class="callout"><span class="badge">Mẹo nhớ</span> Timing = khối lượng &amp; cảm xúc; spacing = gia tốc. Chỉnh đúng hai thứ này là xong nửa ảo giác.</div>`,
  ]]);

const c2q = quiz('dtg303-quiz-2', 'Quiz 2 — Timing & spacing|||Quiz 2 — Timing & spacing', [
  { id: 'q1', question: 'Muốn một vật nhìn NẶNG hơn, thường ta điều chỉnh timing thế nào?', options: ['Dùng ÍT khung hơn (nhanh)', 'Dùng NHIỀU khung hơn (chậm)', 'Đổi màu', 'Thêm outline'], correctIndex: 1, explanation: 'Nhiều khung = chuyển động chậm = cảm giác nặng/quán tính lớn.' },
  { id: 'q2', question: 'Spacing (khoảng cách giữa các khung) quyết định chủ yếu điều gì?', options: ['Khối lượng tuyệt đối', 'Gia tốc — nhanh dần hay chậm dần', 'Màu sắc', 'Độ phân giải'], correctIndex: 1, explanation: 'Spacing thay đổi = tăng/giảm tốc; spacing đều = tốc độ không đổi.' },
  { id: 'q3', question: '"On twos" nghĩa là gì?', options: ['Chạy phim ở 2 fps', 'Mỗi ảnh giữ trong 2 khung (vẽ mới cứ 2 khung một)', 'Hai lớp cảnh', 'Hai họa sĩ cùng vẽ'], correctIndex: 1, explanation: 'On twos: một hình dùng cho 2 khung, tiết kiệm so với on ones mà vẫn mượt.' },
]);

const c3 = doc('dtg303-3-1-squash-stretch-solid', '3.1 — Squash & stretch + solid drawing|||3.1 — Squash & stretch + vẽ chắc',
  'Squash & stretch tạo độ dẻo/trọng lượng nhưng PHẢI giữ thể tích không đổi; solid drawing (khối 3D, trọng lượng, tránh twinning) giữ hình vững qua mọi khung.',
  [[
    `<span class="eyebrow">DTG303 · Chapter 3 · Lesson 3.1</span>
<h2>Squash &amp; stretch + solid drawing</h2>
<h3>Squash &amp; stretch — flexibility &amp; weight</h3>
<p><strong>Squash &amp; stretch</strong> is often called the most important principle. A soft object squashes on impact and stretches while moving fast, which reads as <strong>flexibility and weight</strong>. A stiff object (a chair, a skull) shows almost none; how much you use tells the viewer what a thing is made of.</p>
<div class="callout"><span class="badge">The golden rule</span> Whatever you squash or stretch, the <strong>volume must stay constant</strong>. If a ball flattens, it must widen by the same amount — otherwise it looks like it is shrinking or growing.</div>
<h3>The bouncing ball</h3>
<pre><code>Ball hits ground -> squash (wide &amp; flat, same volume)
Ball rises/falls -> stretch along the direction of travel
Top of arc       -> back to a round shape
</code></pre>
<h3>Solid drawing — form in space</h3>
<p><strong>Solid drawing</strong> means drawing with a sense of three-dimensional <strong>form, weight and balance</strong> — a character occupies real space and holds together from every angle. Watch out for <strong>twinning</strong> (both arms/legs doing the exact same symmetrical thing), which kills the sense of a living, weighted body.</p>`,
    `<span class="eyebrow">DTG303 · Chương 3 · Bài 3.1</span>
<h2>Squash &amp; stretch + vẽ chắc</h2>
<h3>Squash &amp; stretch — độ dẻo &amp; trọng lượng</h3>
<p><strong>Squash &amp; stretch</strong> thường được coi là nguyên lý quan trọng nhất. Vật mềm bị nén (squash) khi va chạm và kéo dài (stretch) khi di chuyển nhanh, đọc thành <strong>độ dẻo và trọng lượng</strong>. Vật cứng (cái ghế, hộp sọ) gần như không co giãn; dùng nhiều hay ít cho người xem biết vật làm bằng gì.</p>
<div class="callout"><span class="badge">Quy tắc vàng</span> Dù squash hay stretch tới đâu, <strong>thể tích phải giữ không đổi</strong>. Bóng dẹt xuống thì phải bè ngang ra bằng chừng đó — nếu không nó nhìn như đang co lại hoặc phình to.</div>
<h3>Quả bóng nảy</h3>
<pre><code>Bóng chạm đất -> squash (bè &amp; dẹt, cùng thể tích)
Bóng lên/xuống -> stretch theo hướng di chuyển
Đỉnh cung      -> trở lại hình tròn
</code></pre>
<h3>Solid drawing — vẽ có khối</h3>
<p><strong>Solid drawing</strong> nghĩa là vẽ với cảm giác <strong>khối ba chiều, trọng lượng và thăng bằng</strong> — nhân vật chiếm không gian thật và vững ở mọi góc nhìn. Coi chừng <strong>twinning</strong> (hai tay/hai chân làm y hệt đối xứng), nó giết cảm giác một cơ thể sống, có trọng lượng.</p>`,
  ]]);

const c3q = quiz('dtg303-quiz-3', 'Quiz 3 — Squash/stretch & solid drawing|||Quiz 3 — Squash/stretch & vẽ chắc', [
  { id: 'q1', question: 'Quy tắc BẮT BUỘC khi squash & stretch một vật là gì?', options: ['Giữ nguyên màu', 'Giữ THỂ TÍCH không đổi', 'Giữ nguyên số khung', 'Luôn kéo dài gấp đôi'], correctIndex: 1, explanation: 'Bảo toàn thể tích: dẹt xuống bao nhiêu thì bè ngang bấy nhiêu, nếu không vật như phình/co.' },
  { id: 'q2', question: 'Vật nào áp dụng squash & stretch RÕ nhất?', options: ['Hộp sọ cứng', 'Quả bóng cao su mềm', 'Khối bê tông', 'Thanh sắt'], correctIndex: 1, explanation: 'Độ co giãn tỉ lệ với độ mềm; vật cứng gần như không squash/stretch.' },
  { id: 'q3', question: '"Twinning" trong solid drawing là lỗi gì?', options: ['Vẽ hai nhân vật giống nhau', 'Hai tay/chân làm động tác đối xứng y hệt, mất tự nhiên', 'Tô hai lớp màu', 'Nhân đôi khung hình'], correctIndex: 1, explanation: 'Twinning khiến dáng cứng, thiếu sức sống; nên lệch pha/lệch dáng hai bên.' },
]);

const c4 = doc('dtg303-4-1-anticipation-staging', '4.1 — Anticipation & staging|||4.1 — Đón trước & dàn cảnh',
  'Anticipation (động tác chuẩn bị ngược hướng để báo trước, giúp action dễ đọc); staging (dàn cảnh: hướng mắt người xem tới ý chính qua bố cục, silhouette, tương phản).',
  [[
    `<span class="eyebrow">DTG303 · Chapter 4 · Lesson 4.1</span>
<h2>Anticipation &amp; staging</h2>
<h3>Anticipation — prepare the action</h3>
<p><strong>Anticipation</strong> is a small movement in the <em>opposite</em> direction that prepares the audience for the main action. A character crouches before jumping; an arm pulls back before a throw; a pitcher winds up. Without it, an action happens too suddenly to read. Anticipation makes motion <strong>legible</strong> and adds power.</p>
<pre><code>Jump = anticipate (crouch down)
     -> action (spring up, stretch)
     -> settle (land, squash, recover)
</code></pre>
<h3>Staging — direct the eye</h3>
<p><strong>Staging</strong> is presenting an idea so it is <strong>unmistakably clear</strong>: one main thing at a time. Use composition, camera angle, contrast and timing to point the viewer at what matters. A strong test is the <strong>silhouette</strong> — if the pose reads as a solid black shape, it is well staged.</p>
<div class="callout"><span class="badge">Silhouette test</span> Fill the pose with solid black. Can you still tell what the character is doing? If not, restage it so the key action sits clear of the body.</div>`,
    `<span class="eyebrow">DTG303 · Chương 4 · Bài 4.1</span>
<h2>Đón trước &amp; dàn cảnh</h2>
<h3>Anticipation — chuẩn bị cho động tác</h3>
<p><strong>Anticipation (đón trước)</strong> là một cử động nhỏ theo <em>hướng ngược lại</em> để báo cho người xem biết động tác chính sắp tới. Nhân vật khuỵu xuống trước khi nhảy; cánh tay kéo ra sau trước khi ném; cầu thủ lấy đà. Thiếu nó, động tác xảy ra quá đột ngột, khó đọc. Đón trước khiến chuyển động <strong>dễ đọc</strong> và tăng lực.</p>
<pre><code>Nhảy = đón trước (khuỵu xuống)
     -> động tác (bật lên, stretch)
     -> ổn định (tiếp đất, squash, hồi)
</code></pre>
<h3>Staging — dẫn mắt người xem</h3>
<p><strong>Staging (dàn cảnh)</strong> là trình bày một ý sao cho <strong>rõ không thể nhầm</strong>: mỗi lúc một ý chính. Dùng bố cục, góc máy, tương phản và timing để chỉ mắt người xem vào cái quan trọng. Một phép thử mạnh là <strong>silhouette</strong> — nếu dáng đọc được khi tô đen đặc, thì dàn cảnh tốt.</p>
<div class="callout"><span class="badge">Phép thử silhouette</span> Tô kín dáng bằng màu đen. Còn nhận ra nhân vật đang làm gì không? Nếu không, dàn lại để động tác chính nằm tách khỏi thân.</div>`,
  ]]);

const c4q = quiz('dtg303-quiz-4', 'Quiz 4 — Anticipation & staging|||Quiz 4 — Đón trước & dàn cảnh', [
  { id: 'q1', question: 'Anticipation (đón trước) thường là cử động theo hướng nào so với động tác chính?', options: ['Cùng hướng', 'Ngược hướng', 'Vuông góc cố định', 'Không di chuyển'], correctIndex: 1, explanation: 'Khuỵu xuống trước khi nhảy, kéo tay ra sau trước khi ném — chuẩn bị ngược hướng.' },
  { id: 'q2', question: 'Mục đích chính của anticipation là?', options: ['Làm cảnh dài hơn', 'Giúp người xem đọc kịp và cảm nhận lực của động tác', 'Tiết kiệm khung', 'Đổi màu nền'], correctIndex: 1, explanation: 'Nó báo trước nên action không xảy ra quá đột ngột, và tăng cảm giác lực.' },
  { id: 'q3', question: 'Phép thử silhouette dùng để kiểm tra điều gì trong staging?', options: ['Màu sắc hài hòa', 'Dáng/động tác có đọc rõ khi tô đen đặc không', 'Số khung hình', 'Độ nét đường vẽ'], correctIndex: 1, explanation: 'Nếu bóng đen đặc vẫn nói rõ nhân vật đang làm gì thì dàn cảnh tốt.' },
]);

const c5 = doc('dtg303-5-1-methods-follow-through', '5.1 — Straight ahead / pose to pose, follow through & overlap|||5.1 — Straight ahead / pose to pose, quán tính & chồng lấn',
  'Hai phương pháp dựng (straight ahead vs pose to pose) và khi nào dùng; follow through (bộ phận tiếp tục sau khi thân dừng), overlapping (các phần chuyển lệch pha), drag/quán tính.',
  [[
    `<span class="eyebrow">DTG303 · Chapter 5 · Lesson 5.1</span>
<h2>Method &amp; momentum</h2>
<h3>Straight ahead vs pose to pose</h3>
<ul>
<li><strong>Straight ahead</strong> — draw frame by frame from start to finish. Spontaneous and fluid (good for fire, water, wild action) but harder to control size and timing.</li>
<li><strong>Pose to pose</strong> — plan the key poses first, then fill inbetweens. Controlled and clear (good for acting and dialogue). Most production mixes both.</li>
</ul>
<h3>Follow through &amp; overlapping action</h3>
<p>When a body stops, its loose parts do not stop at once. <strong>Follow through</strong> is the parts that keep going after the main mass halts (hair, a coat, a tail settling). <strong>Overlapping action</strong> is different parts moving on <em>different timing</em>, so nothing moves as one stiff block. Related is <strong>drag</strong> — trailing parts lag behind the leading mass.</p>
<pre><code>Character runs then stops:
  body stops (frame 0)
  arms swing forward   (frames 1-3, follow through)
  hair/cloth settle    (frames 2-6, overlap + drag)
</code></pre>
<div class="callout"><span class="badge">Never move as one</span> Real, living things move in loose, offset parts. Offsetting the timing of secondary parts is what separates animation from a sliding cardboard cut-out.</div>`,
    `<span class="eyebrow">DTG303 · Chương 5 · Bài 5.1</span>
<h2>Phương pháp &amp; quán tính</h2>
<h3>Straight ahead vs pose to pose</h3>
<ul>
<li><strong>Straight ahead</strong> — vẽ lần lượt từng khung từ đầu tới cuối. Tự nhiên, mượt (hợp lửa, nước, action loạn) nhưng khó kiểm soát tỉ lệ và timing.</li>
<li><strong>Pose to pose</strong> — lên các dáng key trước, rồi mới chèn inbetween. Kiểm soát tốt, rõ ràng (hợp diễn xuất, thoại). Sản xuất thực tế thường trộn cả hai.</li>
</ul>
<h3>Follow through &amp; overlapping action</h3>
<p>Khi thân dừng, các bộ phận rời không dừng cùng lúc. <strong>Follow through (quán tính)</strong> là những phần còn tiếp tục sau khi khối chính đã dừng (tóc, áo khoác, cái đuôi lắng lại). <strong>Overlapping (chồng lấn)</strong> là các phần chuyển động ở <em>timing khác nhau</em>, nên không gì di chuyển như một khối cứng. Liên quan là <strong>drag</strong> — phần đuôi trễ lại phía sau khối dẫn đầu.</p>
<pre><code>Nhân vật chạy rồi dừng:
  thân dừng (khung 0)
  tay vung tới   (khung 1-3, follow through)
  tóc/vải lắng   (khung 2-6, overlap + drag)
</code></pre>
<div class="callout"><span class="badge">Đừng di chuyển như một khối</span> Vật sống thật di chuyển theo các phần rời, lệch pha. Làm lệch timing của các phần phụ chính là thứ tách hoạt hình khỏi một miếng bìa trượt đi.</div>`,
  ]]);

const c5q = quiz('dtg303-quiz-5', 'Quiz 5 — Methods & momentum|||Quiz 5 — Phương pháp & quán tính', [
  { id: 'q1', question: 'Phương pháp nào lên các dáng KEY trước rồi mới chèn inbetween?', options: ['Straight ahead', 'Pose to pose', 'On ones', 'Rotoscoping'], correctIndex: 1, explanation: 'Pose to pose: kiểm soát timing/bố cục tốt, hợp diễn xuất và thoại.' },
  { id: 'q2', question: 'Follow through mô tả điều gì?', options: ['Thân dừng thì mọi thứ dừng ngay', 'Các bộ phận rời (tóc, áo) tiếp tục chuyển động sau khi thân đã dừng', 'Đổi hướng camera', 'Tăng số key'], correctIndex: 1, explanation: 'Do quán tính, phần rời còn đi tiếp và lắng lại sau khối chính.' },
  { id: 'q3', question: 'Overlapping action nghĩa là?', options: ['Mọi bộ phận chuyển động cùng một timing', 'Các bộ phận chuyển động ở timing khác nhau, lệch pha', 'Chồng hai cảnh lên nhau', 'Vẽ đè hai lớp màu'], correctIndex: 1, explanation: 'Lệch timing giữa các phần khiến cơ thể không di chuyển như một khối cứng.' },
]);

const c6 = doc('dtg303-6-1-ease-arcs', '6.1 — Slow in / slow out + arcs|||6.1 — Slow in / slow out + cung chuyển động',
  'Slow in/slow out (ease): vật tăng/giảm tốc chứ không bật tức thì → dồn khung ở hai đầu; arcs: hầu hết chuyển động tự nhiên đi theo đường cong, không thẳng.',
  [[
    `<span class="eyebrow">DTG303 · Chapter 6 · Lesson 6.1</span>
<h2>Slow in / slow out + arcs</h2>
<h3>Slow in &amp; slow out (easing)</h3>
<p>Real objects <strong>accelerate and decelerate</strong> — they do not snap from rest to full speed. Animators create this by <strong>bunching drawings near the ends</strong> of a move (many close frames = slow) and spreading them in the middle (few, far apart = fast). This is the spacing side of timing, and it is what makes motion feel physical rather than mechanical.</p>
<pre><code>Ease spacing across a move:
  start  | . .  .   .    .   .  . . |  end
  slow in     -> fast middle ->     slow out
</code></pre>
<h3>Arcs</h3>
<p>Almost all natural movement travels along a <strong>curved path</strong>, not a straight line — a swinging arm, a turning head, a thrown ball all follow <strong>arcs</strong>. Tracking motion on straight lines looks robotic and lifeless. Check your work by plotting the path of a hand or a prop across frames: it should sweep a smooth arc.</p>
<div class="callout"><span class="badge">Arc + ease together</span> The bouncing ball is the classic exercise for both: it follows a parabolic <em>arc</em>, and it <em>eases</em> — slow at the top of each bounce, fast near the ground.</div>`,
    `<span class="eyebrow">DTG303 · Chương 6 · Bài 6.1</span>
<h2>Slow in / slow out + cung chuyển động</h2>
<h3>Slow in &amp; slow out (ease)</h3>
<p>Vật thật <strong>tăng tốc rồi giảm tốc</strong> — không bật tức thì từ đứng yên sang tốc độ tối đa. Họa sĩ tạo điều này bằng cách <strong>dồn khung ở hai đầu</strong> động tác (nhiều khung sát nhau = chậm) và giãn ra ở giữa (ít khung, cách xa = nhanh). Đây là mặt spacing của timing, và là thứ khiến chuyển động cảm thấy có vật lý thay vì máy móc.</p>
<pre><code>Spacing kiểu ease qua một động tác:
  đầu   | . .  .   .    .   .  . . |  cuối
  slow in    -> giữa nhanh ->    slow out
</code></pre>
<h3>Arcs — cung chuyển động</h3>
<p>Gần như mọi chuyển động tự nhiên đi theo <strong>đường cong</strong>, không phải đường thẳng — cánh tay vung, cái đầu quay, quả bóng ném đều đi theo <strong>cung (arc)</strong>. Bám chuyển động theo đường thẳng nhìn máy móc, vô hồn. Kiểm tra bằng cách vẽ lại đường đi của bàn tay hoặc đạo cụ qua các khung: nó phải quét thành một cung mượt.</p>
<div class="callout"><span class="badge">Arc + ease đi cùng nhau</span> Quả bóng nảy là bài tập kinh điển cho cả hai: nó đi theo <em>cung</em> parabol, và có <em>ease</em> — chậm ở đỉnh mỗi lần nảy, nhanh khi gần đất.</div>`,
  ]]);

const c6q = quiz('dtg303-quiz-6', 'Quiz 6 — Ease & arcs|||Quiz 6 — Ease & cung chuyển động', [
  { id: 'q1', question: 'Để tạo slow in / slow out, ta bố trí khung thế nào?', options: ['Khung cách đều nhau', 'Dồn khung sát nhau ở hai đầu, giãn ra ở giữa', 'Ít khung ở hai đầu', 'Chỉ dùng 2 khung'], correctIndex: 1, explanation: 'Nhiều khung sát = chậm (hai đầu), ít khung cách xa = nhanh (giữa) → ease.' },
  { id: 'q2', question: 'Nguyên lý arcs nói rằng chuyển động tự nhiên thường đi theo?', options: ['Đường thẳng', 'Đường cong (cung)', 'Đường gấp khúc vuông', 'Ngẫu nhiên'], correctIndex: 1, explanation: 'Tay vung, đầu quay, bóng ném đều theo cung; đường thẳng nhìn máy móc.' },
  { id: 'q3', question: 'Vì sao quả bóng nảy là bài tập kinh điển?', options: ['Vì nó chỉ cần một khung', 'Vì nó kết hợp arc parabol và ease (chậm ở đỉnh, nhanh gần đất)', 'Vì không cần squash', 'Vì luôn chuyển động đều'], correctIndex: 1, explanation: 'Bóng nảy luyện đồng thời arc, ease, timing và squash & stretch.' },
]);

const c7 = doc('dtg303-7-1-secondary-exaggeration-appeal', '7.1 — Secondary action, exaggeration & appeal|||7.1 — Hành động phụ, phóng đại & sức hút',
  'Secondary action (động tác phụ bổ trợ, không lấn action chính); exaggeration (phóng đại có chủ đích để rõ ý, giữ cái thật); appeal (sức hút: thiết kế rõ, thú vị, dễ đọc — cả nhân vật phản diện).',
  [[
    `<span class="eyebrow">DTG303 · Chapter 7 · Lesson 7.1</span>
<h2>Secondary action, exaggeration &amp; appeal</h2>
<h3>Secondary action</h3>
<p>A <strong>secondary action</strong> supports and enriches the main action without competing with it — a character walks (main) while wiping tears or humming (secondary). Done well it adds life and personality; overdone, it distracts from the primary idea. It is not the same as overlapping action: secondary action is a <em>separate gesture</em>, not just physics on loose parts.</p>
<h3>Exaggeration</h3>
<p><strong>Exaggeration</strong> pushes an action or expression beyond the literal to make it read clearly and feel alive — a sad face gets sadder, a fast run gets faster. The trick is to stay true to the essence: exaggerate the idea, not into random distortion. Caricature, not chaos.</p>
<h3>Appeal</h3>
<p><strong>Appeal</strong> is the charisma of a design — clear, interesting, pleasing to watch. It is not the same as being cute: a villain can have appeal. It comes from strong, readable shapes, avoiding symmetry and sameness, and giving a character a design the eye enjoys following.</p>
<div class="callout"><span class="badge">Read, then feel</span> Secondary action adds texture, exaggeration adds clarity and energy, appeal makes us want to keep watching — together they turn correct motion into a performance.</div>`,
    `<span class="eyebrow">DTG303 · Chương 7 · Bài 7.1</span>
<h2>Hành động phụ, phóng đại &amp; sức hút</h2>
<h3>Secondary action — hành động phụ</h3>
<p><strong>Hành động phụ</strong> hỗ trợ và làm giàu cho action chính mà không tranh chấp với nó — nhân vật đi bộ (chính) trong khi lau nước mắt hoặc ngân nga (phụ). Làm tốt thì thêm sức sống và cá tính; làm quá thì cướp mất ý chính. Nó khác overlapping action: hành động phụ là một <em>cử chỉ riêng</em>, không chỉ là vật lý trên các phần rời.</p>
<h3>Exaggeration — phóng đại</h3>
<p><strong>Phóng đại</strong> đẩy một động tác hay biểu cảm vượt mức nguyên bản để đọc rõ và có sức sống — mặt buồn buồn hơn, cú chạy nhanh nhanh hơn. Bí quyết là trung thành với cái cốt: phóng đại cái ý, đừng méo mó lung tung. Biếm họa, không phải hỗn loạn.</p>
<h3>Appeal — sức hút</h3>
<p><strong>Appeal (sức hút)</strong> là sức lôi cuốn của thiết kế — rõ ràng, thú vị, xem thấy thích. Nó không đồng nghĩa với dễ thương: một nhân vật phản diện vẫn có thể có appeal. Nó đến từ hình khối mạnh, dễ đọc, tránh đối xứng và trùng lặp, và cho nhân vật một thiết kế mà mắt thích dõi theo.</p>
<div class="callout"><span class="badge">Đọc được, rồi cảm được</span> Hành động phụ thêm chất, phóng đại thêm độ rõ và năng lượng, sức hút khiến ta muốn xem tiếp — cùng nhau chúng biến chuyển động đúng thành một màn diễn.</div>`,
  ]]);

const c7q = quiz('dtg303-quiz-7', 'Quiz 7 — Secondary/exaggeration/appeal|||Quiz 7 — Phụ/phóng đại/sức hút', [
  { id: 'q1', question: 'Hành động phụ (secondary action) tốt phải?', options: ['Lấn át action chính', 'Bổ trợ action chính mà không tranh chấp', 'Thay thế action chính', 'Luôn cùng timing với action chính'], correctIndex: 1, explanation: 'Nó làm giàu, thêm cá tính; làm quá sẽ cướp mất ý chính.' },
  { id: 'q2', question: 'Nguyên tắc khi phóng đại (exaggeration) là gì?', options: ['Méo mó càng nhiều càng tốt', 'Đẩy mạnh nhưng giữ đúng cốt/ý — biếm họa, không hỗn loạn', 'Không bao giờ dùng', 'Chỉ dùng cho nền'], correctIndex: 1, explanation: 'Phóng đại để rõ ý và có sức sống, vẫn trung thành với bản chất.' },
  { id: 'q3', question: 'Câu nào ĐÚNG về appeal (sức hút)?', options: ['Chỉ nhân vật dễ thương mới có appeal', 'Cả phản diện cũng cần appeal; đến từ hình khối rõ, dễ đọc', 'Appeal là dùng nhiều màu', 'Appeal chỉ về giọng lồng tiếng'], correctIndex: 1, explanation: 'Appeal là sức lôi cuốn của thiết kế, đến từ shape mạnh, tránh đối xứng — áp dụng cả phản diện.' },
]);

const c8 = doc('dtg303-8-1-applying-walk-cycle', '8.1 — Putting it together: bouncing ball, walk cycle & pipeline|||8.1 — Ghép lại: bóng nảy, walk cycle & quy trình',
  'Ráp mọi nguyên lý vào bài kinh điển: hoàn thiện bóng nảy, dựng walk cycle (contact/down/passing/up), quy trình dựng một cảnh ngắn; khác biệt pipeline 2D và 3D.',
  [[
    `<span class="eyebrow">DTG303 · Chapter 8 · Lesson 8.1</span>
<h2>Putting the principles to work</h2>
<h3>The bouncing ball — every principle in one exercise</h3>
<p>The bouncing ball is where beginners prove they understand motion: it needs an <strong>arc</strong> (parabola), <strong>ease</strong> (slow at the top, fast near the ground), <strong>timing</strong> (a heavy ball bounces slower and lower), and <strong>squash &amp; stretch</strong> (flatten on impact, stretch mid-fall, constant volume). Change the timing and spacing and the same ball becomes a bowling ball or a balloon.</p>
<h3>The walk cycle</h3>
<p>A walk is built from four key poses that repeat:</p>
<pre><code>Contact  -> heel strikes, legs spread (widest pose)
Down     -> body dips lowest, weight absorbed
Passing  -> free leg passes under, body at mid height
Up       -> body pushes to its highest, then back to Contact
</code></pre>
<p>Add arcs to the hips and head, follow-through on the arms, and overlap on hair/clothing, and the walk shows <strong>weight and personality</strong> — a sneak, a march and a strut differ mostly in timing and staging.</p>
<h3>2D vs 3D pipeline</h3>
<ul>
<li><strong>2D</strong> — keys → breakdowns → inbetweens, drawn frame by frame (Toon Boom, Krita, Blender grease pencil).</li>
<li><strong>3D</strong> — pose a rigged model on keyframes; the software inbetweens, and you refine the motion curves (ease, arcs) in a graph editor (Blender, Maya).</li>
</ul>
<div class="callout"><span class="badge">The same 12 rules</span> Whether you draw every frame or key a rig, the principles do not change — only the tools do. Master the bouncing ball and the walk, and you can animate anything.</div>`,
    `<span class="eyebrow">DTG303 · Chương 8 · Bài 8.1</span>
<h2>Đưa nguyên lý vào việc</h2>
<h3>Quả bóng nảy — mọi nguyên lý trong một bài</h3>
<p>Quả bóng nảy là nơi người mới chứng minh mình hiểu chuyển động: cần <strong>arc</strong> (parabol), <strong>ease</strong> (chậm ở đỉnh, nhanh gần đất), <strong>timing</strong> (bóng nặng nảy chậm và thấp hơn), và <strong>squash &amp; stretch</strong> (dẹt khi chạm, kéo dài giữa lúc rơi, thể tích không đổi). Đổi timing và spacing thì cùng quả bóng đó thành quả bowling hay quả bóng bay.</p>
<h3>Chu kỳ đi bộ (walk cycle)</h3>
<p>Một bước đi dựng từ bốn dáng key lặp lại:</p>
<pre><code>Contact  -> gót chạm, hai chân dang rộng (dáng rộng nhất)
Down     -> thân hạ thấp nhất, hấp thụ trọng lượng
Passing  -> chân rảnh lướt qua dưới, thân ở giữa
Up       -> thân đẩy lên cao nhất, rồi về Contact
</code></pre>
<p>Thêm arc cho hông và đầu, follow-through cho tay, overlap cho tóc/áo, thì bước đi lộ <strong>trọng lượng và cá tính</strong> — đi rón rén, đi diễu hành và đi vênh váo khác nhau chủ yếu ở timing và staging.</p>
<h3>Quy trình 2D vs 3D</h3>
<ul>
<li><strong>2D</strong> — key → breakdown → inbetween, vẽ từng khung (Toon Boom, Krita, Blender grease pencil).</li>
<li><strong>3D</strong> — đặt dáng mô hình đã rig trên keyframe; phần mềm nội suy inbetween, ta tinh chỉnh đường cong chuyển động (ease, arc) trong graph editor (Blender, Maya).</li>
</ul>
<div class="callout"><span class="badge">Vẫn 12 quy tắc đó</span> Dù bạn vẽ từng khung hay key một bộ rig, nguyên lý không đổi — chỉ công cụ đổi. Làm chủ bóng nảy và bước đi thì animate được mọi thứ.</div>`,
  ]]);

const c8q = quiz('dtg303-quiz-8', 'Quiz 8 — Bouncing ball, walk cycle & pipeline|||Quiz 8 — Bóng nảy, walk cycle & quy trình', [
  { id: 'q1', question: 'Bốn dáng key kinh điển của một chu kỳ đi bộ theo đúng thứ tự là?', options: ['Down → Up → Contact → Passing', 'Contact → Down → Passing → Up', 'Passing → Contact → Up → Down', 'Up → Contact → Down → Passing'], correctIndex: 1, explanation: 'Contact (gót chạm) → Down (hạ thấp) → Passing (chân lướt qua) → Up (đẩy cao) rồi lặp lại.' },
  { id: 'q2', question: 'Vì sao bóng nảy được coi là bài "gói trọn" nhiều nguyên lý?', options: ['Vì chỉ cần timing', 'Vì cần đồng thời arc, ease, timing và squash & stretch', 'Vì không cần vẽ', 'Vì chỉ dùng cho 3D'], correctIndex: 1, explanation: 'Một bài luyện cùng lúc cung, gia tốc, khối lượng và co giãn giữ thể tích.' },
  { id: 'q3', question: 'Khác biệt cốt lõi giữa pipeline 2D và 3D là gì?', options: ['3D không dùng 12 nguyên lý', '2D vẽ từng khung; 3D key rig rồi phần mềm nội suy, ta chỉnh graph editor', '2D không cần key', '3D không có ease'], correctIndex: 1, explanation: 'Nguyên lý như nhau, chỉ công cụ khác: vẽ tay vs key rig + nội suy máy.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'DTG303',
    slug: 'dtg303-principles-of-animation',
    title: 'Principles of Animation',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DTG303.webp',
    shortDescription: 'The 12 classic principles of animation (Disney & Richard Williams) — timing & spacing, squash & stretch, anticipation, staging, follow-through, arcs, exaggeration & appeal — applied to the bouncing ball & walk cycle. Bilingual, with quizzes.|||12 nguyên lý hoạt hình kinh điển (Disney & Richard Williams) — timing & spacing, squash & stretch, đón trước, dàn cảnh, quán tính, cung chuyển động, phóng đại & sức hút — áp dụng vào bóng nảy & walk cycle. Song ngữ, có quiz.',
    description: 'Môn <strong>DTG303 — Principles of Animation</strong> (kỳ 4, ngành Thiết kế mỹ thuật số) dạy <strong>12 nguyên lý hoạt hình</strong> đúc kết bởi Disney (Thomas &amp; Johnston, <em>The Illusion of Life</em>) và Richard Williams (<em>The Animator’s Survival Kit</em>). Từ <strong>lịch sử &amp; tổng quan 12 nguyên lý</strong> → <strong>timing &amp; spacing</strong> → <strong>squash &amp; stretch, vẽ chắc</strong> → <strong>đón trước &amp; dàn cảnh</strong> → <strong>straight-ahead/pose-to-pose, quán tính &amp; chồng lấn</strong> → <strong>ease &amp; cung chuyển động</strong> → <strong>hành động phụ, phóng đại &amp; sức hút</strong> → <strong>ứng dụng</strong> (bóng nảy, walk cycle, quy trình 2D/3D). Song ngữ, có ví dụ phim/bài tập kinh điển và quiz mỗi chương.',
    whatYouLearn: '12 nguyên lý hoạt hình và mỗi nguyên lý sửa gì; timing (khối lượng) &amp; spacing (gia tốc), frame rate, on ones/twos, key/inbetween; squash &amp; stretch giữ thể tích; solid drawing, tránh twinning; anticipation &amp; staging (silhouette); straight-ahead vs pose-to-pose; follow-through, overlapping, drag; slow in/out &amp; arcs; secondary action, exaggeration, appeal; dựng bóng nảy và walk cycle (contact/down/passing/up); khác biệt quy trình 2D và 3D.',
    requirements: 'Biết vẽ cơ bản là một lợi thế nhưng không bắt buộc. Nên cài công cụ miễn phí (Blender hoặc Krita) để luyện bóng nảy và walk cycle.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách kinh điển, tài liệu miễn phí, YouTube, công cụ 2D/3D, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Hoạt hình là gì, 12 nguyên lý để làm gì, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Lịch sử & 12 nguyên lý|||Chapter 1 — History & 12 principles', description: 'Lưu ảnh, lịch sử ngắn, tổng quan 12 nguyên lý.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Timing & spacing|||Chapter 2 — Timing & spacing', description: 'Timing, spacing, frame rate, key/inbetween.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Squash & stretch + vẽ chắc|||Chapter 3 — Squash & stretch + solid drawing', description: 'Độ dẻo, giữ thể tích, vẽ chắc, twinning.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Đón trước & dàn cảnh|||Chapter 4 — Anticipation & staging', description: 'Chuẩn bị động tác, dàn cảnh, silhouette.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Phương pháp & quán tính|||Chapter 5 — Method & momentum', description: 'Straight ahead/pose to pose, follow-through, overlap, drag.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Ease & cung chuyển động|||Chapter 6 — Ease & arcs', description: 'Slow in/out, đường cong chuyển động.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Hành động phụ, phóng đại & sức hút|||Chapter 7 — Secondary, exaggeration & appeal', description: 'Hành động phụ, phóng đại, appeal.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ứng dụng|||Chapter 8 — Application', description: 'Bóng nảy, walk cycle, cảnh ngắn, quy trình 2D/3D.', lessons: [c8, c8q] },
  ],
};
