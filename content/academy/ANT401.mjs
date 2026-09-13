/**
 * ANT401 — Traditional Animation Principles. Ngành Thiết kế mỹ thuật số, kỳ 7.
 * Song ngữ VI+EN: 12 nguyên tắc Disney, timing & exposure sheet, quy trình 2D
 * → kỹ thuật số. Nguồn: Thomas & Johnston "The Illusion of Life"; Richard
 * Williams "The Animator's Survival Kit"; Preston Blair "Cartoon Animation";
 * Harold Whitaker "Timing for Animation".
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick lồng/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ant401-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình FLM, bốn cuốn kinh điển (Illusion of Life, Survival Kit, Cartoon Animation, Timing for Animation), YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">ANT401 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>traditional (2D hand-drawn) animation</strong> — the 12 principles, timing, the exposure sheet, and the 2D production pipeline — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are the classic references and free, legal resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ANT401 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 The four classic textbooks</h3>
<ul>
<li><strong>Frank Thomas &amp; Ollie Johnston — <em>The Illusion of Life: Disney Animation</em></strong>. The source of the <strong>12 basic principles</strong>; written by two of Disney's "Nine Old Men".</li>
<li><strong>Richard Williams — <em>The Animator's Survival Kit</em></strong>. The modern working handbook: timing, spacing, walks, arcs.</li>
<li><strong>Preston Blair — <em>Cartoon Animation</em></strong>. Construction, squash &amp; stretch, mouth shapes, model sheets.</li>
<li><strong>Harold Whitaker &amp; John Halas — <em>Timing for Animation</em></strong>. How many drawings, and where, to sell a movement.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@AlanBeckerTutorials" target="_blank" rel="noopener">Alan Becker</a> — the 12 principles, explained clip by clip.</li>
<li><a href="https://www.youtube.com/@NewFrameProductions" target="_blank" rel="noopener">New Frame Plus</a> — animation principles for games &amp; film.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://opentoonz.github.io/e/" target="_blank" rel="noopener">OpenToonz</a> — the free/open 2D studio used on Studio Ghibli films.</li>
<li><a href="https://www.pencil2d.org/" target="_blank" rel="noopener">Pencil2D</a> — a tiny, free hand-drawn animation app for beginners.</li>
<li><a href="https://krita.org/" target="_blank" rel="noopener">Krita</a> — free painting app with a full frame-by-frame animation timeline.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — read the 12 principles once, then watch them animated.</li>
<li><strong>The classic exercises</strong> — bouncing ball, flour sack, pendulum, then a simple walk cycle.</li>
<li><strong>Go deeper</strong> — timing charts &amp; the exposure sheet; straight-ahead vs pose-to-pose.</li>
<li><strong>Job-ready</strong> — run a full shot through storyboard → keyframes → inbetweens → clean-up, then re-time it in a digital tool.</li>
</ol></div>`,
    `<span class="eyebrow">ANT401 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>hoạt hình truyền thống (2D vẽ tay)</strong> — 12 nguyên tắc, timing, bảng exposure và quy trình sản xuất 2D — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là các sách kinh điển và nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ANT401 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Bốn cuốn sách kinh điển</h3>
<ul>
<li><strong>Frank Thomas &amp; Ollie Johnston — <em>The Illusion of Life: Disney Animation</em></strong>. Nguồn gốc của <strong>12 nguyên tắc cơ bản</strong>; viết bởi hai trong "Chín Ông Già" của Disney.</li>
<li><strong>Richard Williams — <em>The Animator's Survival Kit</em></strong>. Cẩm nang hành nghề hiện đại: timing, spacing, dáng đi, cung chuyển động.</li>
<li><strong>Preston Blair — <em>Cartoon Animation</em></strong>. Dựng hình, squash &amp; stretch, khẩu hình, model sheet.</li>
<li><strong>Harold Whitaker &amp; John Halas — <em>Timing for Animation</em></strong>. Cần bao nhiêu hình, đặt ở đâu, để một chuyển động thuyết phục.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@AlanBeckerTutorials" target="_blank" rel="noopener">Alan Becker</a> — 12 nguyên tắc, giảng từng đoạn phim.</li>
<li><a href="https://www.youtube.com/@NewFrameProductions" target="_blank" rel="noopener">New Frame Plus</a> — nguyên tắc hoạt hình cho game &amp; phim.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://opentoonz.github.io/e/" target="_blank" rel="noopener">OpenToonz</a> — studio 2D mã nguồn mở, miễn phí, từng dùng trong phim Ghibli.</li>
<li><a href="https://www.pencil2d.org/" target="_blank" rel="noopener">Pencil2D</a> — app hoạt hình vẽ tay nhỏ gọn, miễn phí, hợp người mới.</li>
<li><a href="https://krita.org/" target="_blank" rel="noopener">Krita</a> — app vẽ miễn phí có timeline hoạt hình từng khung đầy đủ.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — đọc 12 nguyên tắc một lượt, rồi xem chúng được hoạt hình hoá.</li>
<li><strong>Các bài tập kinh điển</strong> — quả bóng nảy, túi bột, con lắc, rồi một chu kỳ đi đơn giản.</li>
<li><strong>Đào sâu</strong> — biểu đồ timing &amp; bảng exposure; straight-ahead vs pose-to-pose.</li>
<li><strong>Sẵn sàng đi làm</strong> — chạy trọn một cảnh qua storyboard → keyframe → inbetween → clean-up, rồi chỉnh timing lại trong công cụ số.</li>
</ol></div>`,
  ]]);

const intro = doc('ant401-0-1-overview', 'Course overview: Traditional Animation Principles|||Tổng quan: Nguyên lý hoạt hình truyền thống',
  'Hoạt hình là ảo giác chuyển động từ những hình tĩnh; nguyên lý làm chuyển động sống động; lộ trình: 12 nguyên tắc → timing & exposure sheet → sức hút → quy trình 2D sang kỹ thuật số.',
  [[
    `<span class="eyebrow">ANT401 · Lesson 0.1 · Overview</span>
<h2>Traditional Animation Principles</h2>
<p class="lead">Animation is the <strong>illusion of life</strong> — the brain reads a fast sequence of still drawings as continuous motion (roughly <strong>24 frames per second</strong> in film). This course teaches the craft that makes that motion feel <em>alive</em> rather than mechanical: the <strong>12 principles</strong> distilled at Disney, plus timing, the exposure sheet, and the full 2D production pipeline.</p>
<h3>Why principles, not tricks</h3>
<p>A drawing that simply slides across the screen looks dead. The principles — squash &amp; stretch, anticipation, follow-through, arcs, timing, appeal — are the tools that give weight, intention and personality to a moving character. They were named in <em>The Illusion of Life</em> and are used in <strong>2D, 3D, stop-motion and games alike</strong>.</p>
<h3>Roadmap</h3>
<p>History &amp; the 12 principles → squash/stretch &amp; anticipation → staging &amp; the two work methods → follow-through, overlap &amp; slow in/out → arcs &amp; secondary action → timing &amp; the exposure sheet → exaggeration, solid drawing &amp; appeal → the 2D pipeline (storyboard → keyframe → inbetween → clean-up) and the move to digital. Bilingual, with worked charts and a quiz each chapter.</p>`,
    `<span class="eyebrow">ANT401 · Bài 0.1 · Tổng quan</span>
<h2>Nguyên lý hoạt hình truyền thống</h2>
<p class="lead">Hoạt hình là <strong>ảo giác về sự sống</strong> — não đọc một chuỗi hình tĩnh chạy nhanh thành chuyển động liên tục (phim thường <strong>24 khung mỗi giây</strong>). Môn này dạy kỹ nghệ làm chuyển động ấy <em>có hồn</em> thay vì máy móc: <strong>12 nguyên tắc</strong> đúc kết ở Disney, cùng timing, bảng exposure và trọn quy trình sản xuất 2D.</p>
<h3>Vì sao là nguyên tắc, không phải mẹo</h3>
<p>Một hình chỉ trượt ngang màn hình trông chết cứng. Các nguyên tắc — squash &amp; stretch, anticipation, follow-through, arc, timing, sức hút — là công cụ tạo trọng lượng, ý đồ và cá tính cho nhân vật đang chuyển động. Chúng được đặt tên trong <em>The Illusion of Life</em> và dùng chung cho <strong>2D, 3D, stop-motion lẫn game</strong>.</p>
<h3>Lộ trình</h3>
<p>Lịch sử &amp; 12 nguyên tắc → squash/stretch &amp; anticipation → staging &amp; hai phương pháp làm → follow-through, overlap &amp; slow in/out → arc &amp; secondary action → timing &amp; bảng exposure → phóng đại, dựng hình vững &amp; sức hút → quy trình 2D (storyboard → keyframe → inbetween → clean-up) và bước sang kỹ thuật số. Song ngữ, có biểu đồ mẫu và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('ant401-1-1-history-12-principles', '1.1 — History & the 12 Disney principles|||1.1 — Lịch sử & 12 nguyên tắc Disney',
  'Từ thaumatrope/zoetrope đến phim vẽ tay; Disney thập niên 1930 hệ thống hoá; 12 nguyên tắc cơ bản đúc kết trong The Illusion of Life.',
  [[
    `<span class="eyebrow">ANT401 · Chapter 1 · Lesson 1.1</span>
<h2>History &amp; the 12 principles</h2>
<h3>A short history</h3>
<p>Persistence-of-vision toys — the <strong>thaumatrope, phenakistoscope, zoetrope</strong> — showed that rapid still images read as motion. Winsor McCay (<em>Gertie the Dinosaur</em>, 1914) proved characters could act; by the 1930s <strong>Walt Disney</strong> turned animation into an industry and, crucially, into a <em>craft with rules</em>.</p>
<h3>The 12 basic principles</h3>
<p>Frank Thomas &amp; Ollie Johnston named them in <em>The Illusion of Life</em> (1981):</p>
<pre><code>1  Squash &amp; stretch      7  Arcs
2  Anticipation          8  Secondary action
3  Staging               9  Timing
4  Straight-ahead /      10 Exaggeration
   Pose-to-pose          11 Solid drawing
5  Follow-through &amp;       12 Appeal
   overlapping action
6  Slow in &amp; slow out</code></pre>
<div class="callout"><span class="badge">Why it still matters</span> These 12 are stack-agnostic — the same list underpins Pixar 3D, stop-motion and game animation. Learn them in 2D and they transfer everywhere.</div>`,
    `<span class="eyebrow">ANT401 · Chương 1 · Bài 1.1</span>
<h2>Lịch sử &amp; 12 nguyên tắc</h2>
<h3>Lược sử</h3>
<p>Các đồ chơi dựa vào lưu ảnh võng mạc — <strong>thaumatrope, phenakistoscope, zoetrope</strong> — cho thấy hình tĩnh chạy nhanh được đọc thành chuyển động. Winsor McCay (<em>Gertie the Dinosaur</em>, 1914) chứng minh nhân vật có thể diễn xuất; đến thập niên 1930 <strong>Walt Disney</strong> biến hoạt hình thành một ngành, và quan trọng hơn, thành một <em>kỹ nghệ có quy tắc</em>.</p>
<h3>12 nguyên tắc cơ bản</h3>
<p>Frank Thomas &amp; Ollie Johnston đặt tên chúng trong <em>The Illusion of Life</em> (1981):</p>
<pre><code>1  Squash &amp; stretch      7  Arc (cung)
2  Anticipation          8  Secondary action
3  Staging               9  Timing
4  Straight-ahead /      10 Phóng đại
   Pose-to-pose          11 Dựng hình vững
5  Follow-through &amp;       12 Sức hút (appeal)
   overlapping action
6  Slow in &amp; slow out</code></pre>
<div class="callout"><span class="badge">Vì sao vẫn quan trọng</span> 12 nguyên tắc này không lệ thuộc công nghệ — cùng danh sách ấy đỡ cho 3D Pixar, stop-motion và game. Học ở 2D thì chuyển sang đâu cũng dùng được.</div>`,
  ]]);

const c1q = quiz('ant401-quiz-1', 'Quiz 1 — History & principles|||Quiz 1 — Lịch sử & nguyên tắc', [
  { id: 'q1', question: 'Ai đúc kết và đặt tên 12 nguyên tắc trong sách The Illusion of Life?', options: ['Winsor McCay', 'Frank Thomas & Ollie Johnston', 'Richard Williams', 'Preston Blair'], correctIndex: 1, explanation: 'Thomas & Johnston, hai trong Nine Old Men của Disney, viết The Illusion of Life (1981).' },
  { id: 'q2', question: 'Zoetrope, thaumatrope, phenakistoscope minh hoạ hiện tượng nào?', options: ['Lưu ảnh / ảo giác chuyển động từ hình tĩnh', 'In offset', 'Âm thanh nổi', 'Chỉnh màu số'], correctIndex: 0, explanation: 'Chúng dựa vào lưu ảnh võng mạc: hình tĩnh chạy nhanh được não đọc thành chuyển động.' },
  { id: 'q3', question: 'Có bao nhiêu nguyên tắc cơ bản của hoạt hình?', options: ['7', '10', '12', '24'], correctIndex: 2, explanation: 'Có 12 nguyên tắc cơ bản; 24 là số khung/giây thông dụng của phim, đừng nhầm.' },
]);

const c2 = doc('ant401-2-1-squash-anticipation', '2.1 — Squash & stretch, anticipation|||2.1 — Squash & stretch, anticipation',
  'Squash & stretch tạo trọng lượng và độ mềm nhưng GIỮ NGUYÊN thể tích; anticipation là động tác lấy đà báo trước hành động chính.',
  [[
    `<span class="eyebrow">ANT401 · Chapter 2 · Lesson 2.1</span>
<h2>Squash &amp; stretch, anticipation</h2>
<h3>Squash &amp; stretch</h3>
<p>The most important principle. Objects <strong>deform under force</strong> — a bouncing ball flattens (squash) on impact and elongates (stretch) as it falls fast. The golden rule: <strong>volume stays constant</strong> — as it flattens it must widen, or it looks like it is shrinking. How much you squash reads as <em>how soft</em> the material is (a tyre vs a bowling ball).</p>
<h3>Anticipation</h3>
<p>A <strong>wind-up before the action</strong>: crouch before a jump, pull the arm back before a throw. It prepares the audience so the main action reads, and it gives the movement force. No anticipation → the action feels sudden and weak.</p>
<pre><code>Bouncing ball (spacing tells the story):
  top      o          slow  (slow in/out at the peak)
          o
        o
      o
    o
  ( )   &lt;- squash &amp; wide at impact, then stretch up
  spacing wide = fast    spacing tight = slow</code></pre>
<div class="callout"><span class="badge">Watch the volume</span> Squash a shape without widening it and the character seems to deflate. Keep the area/volume the same in every deformed drawing.</div>`,
    `<span class="eyebrow">ANT401 · Chương 2 · Bài 2.1</span>
<h2>Squash &amp; stretch, anticipation</h2>
<h3>Squash &amp; stretch (co &amp; giãn)</h3>
<p>Nguyên tắc quan trọng nhất. Vật thể <strong>biến dạng dưới lực</strong> — quả bóng nảy bẹp xuống (squash) khi chạm đất và kéo dài ra (stretch) khi rơi nhanh. Quy tắc vàng: <strong>thể tích luôn không đổi</strong> — bẹp xuống thì phải bè ngang ra, không thì trông như đang teo lại. Squash nhiều hay ít cho thấy chất liệu <em>mềm tới đâu</em> (lốp xe so với quả bowling).</p>
<h3>Anticipation (lấy đà)</h3>
<p><strong>Động tác lấy đà trước hành động</strong>: khuỵu gối trước khi nhảy, kéo tay ra sau trước khi ném. Nó chuẩn bị cho khán giả để hành động chính đọc được, và tạo lực cho chuyển động. Không có anticipation → hành động thấy đột ngột và yếu.</p>
<pre><code>Quả bóng nảy (spacing kể câu chuyện):
  đỉnh     o          chậm  (slow in/out ở đỉnh)
          o
        o
      o
    o
  ( )   &lt;- squash &amp; bè ra khi chạm, rồi stretch lên
  spacing thưa = nhanh   spacing sít = chậm</code></pre>
<div class="callout"><span class="badge">Giữ thể tích</span> Squash một hình mà không bè ngang thì nhân vật như xì hơi. Giữ diện tích/thể tích như nhau ở mọi hình biến dạng.</div>`,
  ]]);

const c2q = quiz('ant401-quiz-2', 'Quiz 2 — Squash & anticipation|||Quiz 2 — Squash & lấy đà', [
  { id: 'q1', question: 'Quy tắc vàng của squash & stretch là gì?', options: ['Đổi màu khi chạm đất', 'Giữ nguyên thể tích: bẹp xuống thì bè ngang ra', 'Luôn kéo dài gấp đôi', 'Chỉ dùng cho mặt nhân vật'], correctIndex: 1, explanation: 'Thể tích phải không đổi; nếu không nhân vật trông như teo/xì hơi.' },
  { id: 'q2', question: 'Anticipation (lấy đà) có tác dụng chính nào?', options: ['Làm cảnh dài hơn', 'Báo trước và tạo lực cho hành động chính', 'Đổi bảng màu', 'Xoá đường chì thừa'], correctIndex: 1, explanation: 'Động tác ngược hướng lấy đà chuẩn bị khán giả và tăng lực cho hành động.' },
  { id: 'q3', question: 'Mức độ squash của một vật thể cho người xem cảm nhận điều gì?', options: ['Vật nặng bao nhiêu kg', 'Chất liệu mềm/cứng tới đâu', 'Cảnh quay lúc mấy giờ', 'Số khung/giây'], correctIndex: 1, explanation: 'Squash nhiều = mềm (bóng cao su); squash ít = cứng (quả bowling).' },
]);

const c3 = doc('ant401-3-1-staging-methods', '3.1 — Staging, straight-ahead vs pose-to-pose|||3.1 — Staging, straight-ahead & pose-to-pose',
  'Staging: dàn dựng để ý đồ rõ ràng (silhouette, bố cục, một ý mỗi lúc); hai phương pháp làm: straight-ahead (vẽ liền mạch) và pose-to-pose (dựng key rồi chèn giữa).',
  [[
    `<span class="eyebrow">ANT401 · Chapter 3 · Lesson 3.1</span>
<h2>Staging, straight-ahead vs pose-to-pose</h2>
<h3>Staging</h3>
<p><strong>Present an idea so it is unmistakable.</strong> Direct the eye with pose, composition, framing and timing — and show <em>one</em> clear idea at a time. The classic test is the <strong>silhouette</strong>: if the action reads as a black shape, it will read in full colour. Overlapping, mushy poses are the enemy.</p>
<h3>Two ways to animate</h3>
<ul>
<li><strong>Straight-ahead</strong> — draw frame 1, then 2, 3, 4… in order. Spontaneous, fluid, great for fire, water, explosions. Risk: proportions and volumes drift, hard to hit exact timing.</li>
<li><strong>Pose-to-pose</strong> — draw the key poses first, then the <strong>breakdowns</strong>, then the <strong>inbetweens</strong>. Planned, controllable, easy to time — the standard for acting and dialogue. Most pros <strong>combine both</strong>.</li>
</ul>
<pre><code>Pose-to-pose plan:
  KEY -------- BREAKDOWN -------- KEY
   |              |                |
   +-- inbetween --+-- inbetween --+
  (keys = the story poses; inbetweens fill the motion)</code></pre>
<div class="callout"><span class="badge">Silhouette test</span> Fill your pose solid black. Still readable? Good staging. Lost in the body? Re-stage the action to the side.</div>`,
    `<span class="eyebrow">ANT401 · Chương 3 · Bài 3.1</span>
<h2>Staging, straight-ahead &amp; pose-to-pose</h2>
<h3>Staging (dàn dựng)</h3>
<p><strong>Trình bày một ý sao cho không thể hiểu nhầm.</strong> Dẫn mắt người xem bằng dáng, bố cục, khung hình và timing — và mỗi lúc chỉ nói <em>một</em> ý rõ. Phép thử kinh điển là <strong>silhouette (bóng đổ)</strong>: nếu hành động đọc được ở dạng khối đen, thì tô màu đầy đủ cũng đọc được. Dáng chồng chéo, nhoè nhoẹt là kẻ thù.</p>
<h3>Hai cách làm hoạt hình</h3>
<ul>
<li><strong>Straight-ahead</strong> — vẽ khung 1, rồi 2, 3, 4… theo thứ tự. Ngẫu hứng, mượt, hợp lửa, nước, vụ nổ. Rủi ro: tỉ lệ &amp; thể tích trôi dạt, khó khớp timing chính xác.</li>
<li><strong>Pose-to-pose</strong> — vẽ các dáng chính (key) trước, rồi <strong>breakdown</strong>, rồi <strong>inbetween</strong>. Có kế hoạch, kiểm soát được, dễ canh timing — chuẩn cho diễn xuất và lời thoại. Đa số dân chuyên <strong>kết hợp cả hai</strong>.</li>
</ul>
<pre><code>Kế hoạch pose-to-pose:
  KEY -------- BREAKDOWN -------- KEY
   |              |                |
   +-- inbetween --+-- inbetween --+
  (key = các dáng kể chuyện; inbetween lấp đầy chuyển động)</code></pre>
<div class="callout"><span class="badge">Phép thử silhouette</span> Tô kín dáng thành khối đen. Vẫn đọc ra? Staging tốt. Lẫn vào thân? Dàn lại hành động sang bên hông.</div>`,
  ]]);

const c3q = quiz('ant401-quiz-3', 'Quiz 3 — Staging & methods|||Quiz 3 — Staging & phương pháp', [
  { id: 'q1', question: 'Phép thử silhouette dùng để kiểm tra điều gì?', options: ['Màu sắc có hài hoà không', 'Hành động/dáng có đọc rõ khi thành khối đen không', 'File nặng bao nhiêu', 'Nhạc nền có khớp không'], correctIndex: 1, explanation: 'Nếu đọc được ở dạng bóng đen thì staging rõ; đó là cốt lõi của staging.' },
  { id: 'q2', question: 'Phương pháp nào dựng các dáng chính (key) trước rồi mới chèn hình giữa?', options: ['Straight-ahead', 'Pose-to-pose', 'Rotoscoping', 'Onion skinning'], correctIndex: 1, explanation: 'Pose-to-pose: vẽ key → breakdown → inbetween, dễ kiểm soát timing.' },
  { id: 'q3', question: 'Straight-ahead thường hợp nhất với loại chuyển động nào?', options: ['Lời thoại tĩnh', 'Hiệu ứng lửa, nước, khói ngẫu hứng', 'Ảnh chân dung', 'Bảng exposure'], correctIndex: 1, explanation: 'Vẽ liền mạch từng khung cho hiệu ứng mượt, ngẫu hứng; đổi lại tỉ lệ dễ trôi.' },
]);

const c4 = doc('ant401-4-1-followthrough-slowinout', '4.1 — Follow-through, overlapping action, slow in/out|||4.1 — Follow-through, overlap, slow in/out',
  'Follow-through: các phần rời tiếp tục chuyển động sau khi thân dừng; overlapping: các phần đi lệch nhịp nhau (drag); slow in/out: gia/giảm tốc ở đầu-cuối chuyển động.',
  [[
    `<span class="eyebrow">ANT401 · Chapter 4 · Lesson 4.1</span>
<h2>Follow-through, overlapping action, slow in/out</h2>
<h3>Follow-through &amp; overlapping action</h3>
<p>Nothing stops all at once. When a character halts, loose parts — hair, cloth, ears, a coat — keep going and settle afterward (<strong>follow-through</strong>). And parts move at <em>different times</em>: the body leads, the appendages <strong>drag</strong> behind and catch up (<strong>overlapping action</strong>). This is what makes motion feel physical rather than robotic.</p>
<h3>Slow in &amp; slow out (easing)</h3>
<p>Real movement <strong>accelerates and decelerates</strong> — it does not start or stop at full speed. In drawings this means <strong>more frames near the extremes</strong> (where it is slow) and <strong>fewer frames in the middle</strong> (where it is fast). Spacing, not the number of poses, controls the feel of speed.</p>
<pre><code>Spacing on a move (dots = drawings):
  A ..  .   .    .     . B     straight (even, mechanical)
  A....  .   .  ....B          slow-in/out (bunched at ends)
  close spacing = slow    wide spacing = fast</code></pre>
<div class="callout"><span class="badge">Drag &amp; settle</span> Offset the tip of a tail or antenna by a frame or two behind the base, then let it overshoot and settle. Instant life.</div>`,
    `<span class="eyebrow">ANT401 · Chương 4 · Bài 4.1</span>
<h2>Follow-through, overlap, slow in/out</h2>
<h3>Follow-through &amp; overlapping action</h3>
<p>Không gì dừng lại cùng một lúc. Khi nhân vật dừng, các phần lỏng — tóc, vải, tai, áo khoác — vẫn đi tiếp rồi mới lắng lại (<strong>follow-through</strong>). Và các phần chuyển động <em>lệch thời điểm</em> nhau: thân dẫn trước, các phần phụ <strong>kéo lê (drag)</strong> theo sau rồi bắt kịp (<strong>overlapping action</strong>). Đây là thứ làm chuyển động thấy có thật thay vì như robot.</p>
<h3>Slow in &amp; slow out (gia/giảm tốc)</h3>
<p>Chuyển động thật <strong>tăng tốc rồi giảm tốc</strong> — không bắt đầu hay dừng ở tốc độ tối đa. Trong hình vẽ nghĩa là <strong>nhiều khung ở hai đầu</strong> (nơi chậm) và <strong>ít khung ở giữa</strong> (nơi nhanh). Chính spacing, chứ không phải số dáng, điều khiển cảm giác tốc độ.</p>
<pre><code>Spacing của một chuyển động (chấm = hình vẽ):
  A ..  .   .    .     . B     đều (máy móc)
  A....  .   .  ....B          slow-in/out (dồn về hai đầu)
  spacing sít = chậm     spacing thưa = nhanh</code></pre>
<div class="callout"><span class="badge">Kéo lê &amp; lắng</span> Cho chóp đuôi hay râu trễ base một-hai khung, rồi cho nó vọt quá đà và lắng lại. Sống động ngay.</div>`,
  ]]);

const c4q = quiz('ant401-quiz-4', 'Quiz 4 — Follow-through & easing|||Quiz 4 — Follow-through & easing', [
  { id: 'q1', question: 'Follow-through mô tả điều gì?', options: ['Các phần rời tiếp tục chuyển động sau khi thân đã dừng', 'Nhân vật đổi màu', 'Cắt cảnh đột ngột', 'Vẽ ngược từ khung cuối'], correctIndex: 0, explanation: 'Tóc, vải, đuôi… đi tiếp và lắng lại sau khi cơ thể dừng.' },
  { id: 'q2', question: 'Slow in/out trong hoạt hình vẽ tay được tạo ra bằng cách nào?', options: ['Thêm nhạc', 'Nhiều khung ở hai đầu chuyển động, ít khung ở giữa', 'Vẽ to hơn', 'Đổi tỉ lệ khung hình'], correctIndex: 1, explanation: 'Spacing dồn ở hai extreme (chậm) và thưa ở giữa (nhanh) tạo gia/giảm tốc.' },
  { id: 'q3', question: 'Overlapping action nghĩa là gì?', options: ['Mọi bộ phận dừng cùng lúc', 'Các bộ phận chuyển động lệch thời điểm, phần phụ kéo lê theo thân', 'Hai cảnh chồng mờ', 'Tô hai lớp màu'], correctIndex: 1, explanation: 'Thân dẫn, phần phụ drag theo sau rồi bắt kịp — chuyển động lệch nhịp.' },
]);

const c5 = doc('ant401-5-1-arcs-secondary', '5.1 — Arcs & secondary action|||5.1 — Arc & secondary action',
  'Arc: hầu hết chuyển động tự nhiên đi theo đường cong, không thẳng; secondary action: động tác phụ tô đậm cho hành động chính mà không lấn át nó.',
  [[
    `<span class="eyebrow">ANT401 · Chapter 5 · Lesson 5.1</span>
<h2>Arcs &amp; secondary action</h2>
<h3>Arcs</h3>
<p>Living things move in <strong>curves, not straight lines</strong> — a swinging arm, a turning head, a thrown ball all trace an <strong>arc</strong>. Plotting the path of action as a smooth arc is one of the fastest ways to make motion look natural; break the arc and the movement snaps and feels robotic. Animators literally draw the arc on the page and keep every inbetween on it.</p>
<h3>Secondary action</h3>
<p>A <strong>supporting action that enriches the main one</strong> — a character walks angrily (main) while jamming hands in pockets and muttering (secondary). The rule: secondary action must <em>reinforce</em>, never <em>compete</em>. If it pulls the eye away from the primary idea, cut it or subdue it. Do not confuse it with <em>overlapping</em> action (physics of drag); secondary action is an <em>acting</em> choice.</p>
<pre><code>Head turn on an arc:
        . . .
      .        .
    .            .     &lt;- inbetweens ride the curve
  ( L )        ( R )      not a straight line between L and R</code></pre>
<div class="callout"><span class="badge">Check the path</span> Flip through your drawings and trace the tip of the hand/nose. A jagged path = broken arc. Nudge inbetweens back onto the curve.</div>`,
    `<span class="eyebrow">ANT401 · Chương 5 · Bài 5.1</span>
<h2>Arc &amp; secondary action</h2>
<h3>Arc (cung chuyển động)</h3>
<p>Sinh vật sống chuyển động theo <strong>đường cong, không phải đường thẳng</strong> — cánh tay vung, cái đầu quay, quả bóng ném đều vạch một <strong>arc</strong>. Vẽ đường đi của hành động thành một cung mượt là một trong những cách nhanh nhất làm chuyển động tự nhiên; gãy cung thì chuyển động giật và như robot. Người làm hoạt hình vẽ hẳn đường cung lên giấy và giữ mọi inbetween nằm trên đó.</p>
<h3>Secondary action (động tác phụ)</h3>
<p><strong>Động tác hỗ trợ làm giàu cho hành động chính</strong> — nhân vật bước đi giận dữ (chính) đồng thời thọc tay vào túi và lầm bầm (phụ). Quy tắc: động tác phụ phải <em>tô đậm</em>, không bao giờ <em>tranh</em> với chính. Nếu nó kéo mắt khỏi ý chính thì bỏ hoặc làm dịu đi. Đừng nhầm với <em>overlapping</em> (vật lý kéo lê); secondary action là lựa chọn <em>diễn xuất</em>.</p>
<pre><code>Quay đầu theo arc:
        . . .
      .        .
    .            .     &lt;- inbetween bám theo đường cong
  ( T )        ( P )      không phải đường thẳng nối T và P</code></pre>
<div class="callout"><span class="badge">Kiểm đường đi</span> Lật nhanh các hình và dò chóp bàn tay/mũi. Đường gấp khúc = gãy arc. Nắn inbetween trở lại đường cong.</div>`,
  ]]);

const c5q = quiz('ant401-quiz-5', 'Quiz 5 — Arcs & secondary action|||Quiz 5 — Arc & động tác phụ', [
  { id: 'q1', question: 'Vì sao chuyển động tự nhiên nên đi theo arc?', options: ['Vì đường thẳng vẽ khó hơn', 'Vì cơ thể sống chuyển động theo đường cong; gãy cung thì thấy giật/robot', 'Vì tiết kiệm khung', 'Vì bắt buộc theo luật bản quyền'], correctIndex: 1, explanation: 'Khớp xoay quanh trục tạo đường cong; giữ inbetween trên arc làm chuyển động mượt tự nhiên.' },
  { id: 'q2', question: 'Quy tắc của secondary action là gì?', options: ['Phải lấn át hành động chính', 'Tô đậm cho hành động chính, không được tranh mắt người xem', 'Luôn nhanh hơn hành động chính', 'Chỉ dùng cho nền'], correctIndex: 1, explanation: 'Động tác phụ hỗ trợ ý chính; nếu kéo mắt đi thì phải làm dịu hoặc bỏ.' },
  { id: 'q3', question: 'Điểm khác nhau giữa secondary action và overlapping action?', options: ['Không khác gì', 'Secondary action là lựa chọn diễn xuất; overlapping là vật lý kéo lê của các phần rời', 'Overlapping chỉ dùng cho màu', 'Secondary action chỉ có trong 3D'], correctIndex: 1, explanation: 'Secondary = diễn xuất bổ trợ; overlapping = phần phụ trễ nhịp theo quán tính.' },
]);

const c6 = doc('ant401-6-1-timing-exposure-sheet', '6.1 — Timing & the exposure sheet (X-sheet)|||6.1 — Timing & bảng exposure (X-sheet)',
  'Timing = số khung cho một động tác quyết định trọng lượng & cảm xúc; ones/twos; bảng exposure (X-sheet) là bảng ghi khung nào giữ hình nào, khớp lời thoại và âm thanh.',
  [[
    `<span class="eyebrow">ANT401 · Chapter 6 · Lesson 6.1</span>
<h2>Timing &amp; the exposure sheet</h2>
<h3>Timing</h3>
<p><strong>How many frames a movement takes</strong> changes everything: the same two poses played over 4 frames vs 24 frames read as a snappy jolt vs a slow, heavy turn. Timing conveys <strong>weight</strong> (heavy things accelerate slowly) and <strong>emotion/mood</strong>. Film runs at <strong>24 fps</strong>; drawings on <strong>ones</strong> = a new drawing every frame (smoothest), on <strong>twos</strong> = each drawing held 2 frames (12 drawings/sec, the TV/anime standard).</p>
<h3>The exposure sheet (X-sheet / dope sheet)</h3>
<p>The animator's spreadsheet: each <strong>row is one frame</strong>, columns hold the <strong>dialogue/sound track, the drawing numbers for each layer, and camera notes</strong>. It is the master plan that tells the inbetweener and the camera exactly which drawing shows on which frame, and keeps the mouth shapes locked to the sound.</p>
<pre><code>FRAME | DIALOGUE | CHAR(A) | MOUTH | CAMERA
  1   |  H       |   1     |  MBP  |
  2   |          |   1     |  MBP  |   &lt;- held on twos
  3   |  e       |   3     |  E    |
  4   |          |   3     |  E    |
  5   |  llo     |   5     |  L    |  pan L
  6   |          |   7     |  O    |
  (row = 1 frame; a held number = same drawing exposed again)</code></pre>
<div class="callout"><span class="badge">Ones vs twos</span> Twos save half the drawings and look right for most acting; switch to ones for fast pans or camera moves where twos would strobe.</div>`,
    `<span class="eyebrow">ANT401 · Chương 6 · Bài 6.1</span>
<h2>Timing &amp; bảng exposure</h2>
<h3>Timing</h3>
<p><strong>Một động tác kéo dài bao nhiêu khung</strong> thay đổi tất cả: cùng hai dáng chạy trong 4 khung so với 24 khung sẽ đọc thành cú giật gọn so với cú xoay chậm, nặng. Timing truyền tải <strong>trọng lượng</strong> (vật nặng tăng tốc chậm) và <strong>cảm xúc/không khí</strong>. Phim chạy <strong>24 fps</strong>; vẽ trên <strong>ones</strong> = mỗi khung một hình mới (mượt nhất), trên <strong>twos</strong> = mỗi hình giữ 2 khung (12 hình/giây, chuẩn TV/anime).</p>
<h3>Bảng exposure (X-sheet / dope sheet)</h3>
<p>Bảng tính của người làm hoạt hình: mỗi <strong>hàng là một khung</strong>, các cột chứa <strong>lời thoại/âm thanh, số hiệu hình vẽ cho từng lớp, và ghi chú máy quay</strong>. Đây là bản kế hoạch cái, nói cho người vẽ inbetween và máy quay biết chính xác hình nào hiện ở khung nào, và khoá khẩu hình khớp với âm thanh.</p>
<pre><code>KHUNG | THOẠI | NV(A) | KHẨU HÌNH | MÁY QUAY
  1   |  H    |   1   |   MBP     |
  2   |       |   1   |   MBP     |   &lt;- giữ trên twos
  3   |  e    |   3   |   E       |
  4   |       |   3   |   E       |
  5   |  llo  |   5   |   L       |  lia trái
  6   |       |   7   |   O       |
  (hàng = 1 khung; số giữ nguyên = phơi lại cùng một hình)</code></pre>
<div class="callout"><span class="badge">Ones vs twos</span> Twos tiết kiệm nửa số hình và hợp phần lớn diễn xuất; chuyển sang ones cho lia máy nhanh nơi twos sẽ bị nhấp nháy (strobe).</div>`,
  ]]);

const c6q = quiz('ant401-quiz-6', 'Quiz 6 — Timing & X-sheet|||Quiz 6 — Timing & bảng exposure', [
  { id: 'q1', question: 'Trong bảng exposure (X-sheet), một HÀNG tương ứng với gì?', options: ['Một lớp màu', 'Một khung hình (frame)', 'Một nhân vật', 'Một cảnh quay'], correctIndex: 1, explanation: 'Mỗi hàng là một khung; các cột ghi thoại, số hình từng lớp và ghi chú máy quay.' },
  { id: 'q2', question: 'Vẽ "trên twos" (on twos) nghĩa là gì?', options: ['Hai nhân vật mỗi khung', 'Mỗi hình vẽ được giữ 2 khung (12 hình/giây)', 'Tốc độ 2 fps', 'Hai lớp nền'], correctIndex: 1, explanation: 'On twos: mỗi hình phơi 2 khung, ra 12 hình/giây — chuẩn phổ biến cho TV/anime.' },
  { id: 'q3', question: 'Timing (số khung cho một động tác) chủ yếu truyền tải điều gì?', options: ['Độ phân giải file', 'Trọng lượng và cảm xúc của chuyển động', 'Bảng màu', 'Định dạng xuất'], correctIndex: 1, explanation: 'Cùng hai dáng, ít khung = nhẹ/gọn, nhiều khung = nặng/chậm; timing tạo weight và mood.' },
]);

const c7 = doc('ant401-7-1-exaggeration-solid-appeal', '7.1 — Exaggeration, solid drawing & appeal|||7.1 — Phóng đại, dựng hình vững & sức hút',
  'Exaggeration: đẩy mạnh cái cốt lõi cho rõ, không méo mó; solid drawing: hình có khối, trọng lượng, phối cảnh, tránh twinning; appeal: nhân vật cuốn hút, dễ đọc, có cá tính.',
  [[
    `<span class="eyebrow">ANT401 · Chapter 7 · Lesson 7.1</span>
<h2>Exaggeration, solid drawing &amp; appeal</h2>
<h3>Exaggeration</h3>
<p>Reality copied exactly looks stiff on screen. <strong>Push the essence</strong> — make the sad sadder, the fast faster, the pose more extreme — while staying <em>true to the idea</em>. The trick is balance: exaggerate everything equally and the scene turns to chaos; pick what matters and push that.</p>
<h3>Solid drawing</h3>
<p>Draw forms that feel like they have <strong>volume, weight and balance in 3D space</strong> — a character built from spheres and boxes, correctly foreshortened, sitting believably in perspective. Watch for <strong>twinning</strong> (both sides doing the exact same thing symmetrically) — it kills life; offset the pose.</p>
<h3>Appeal</h3>
<p>Not "cuteness" — <strong>a design and performance that is interesting and reads clearly</strong>. Clear silhouette, strong shapes, a bit of asymmetry, avoiding the generic. A villain can have appeal. Weak, muddy shapes have none.</p>
<pre><code>Shape language cue:
  round shapes -> friendly, soft
  square shapes -> strong, stable, tough
  sharp/triangle -> dangerous, edgy
  avoid twinning:  R-arm == L-arm  =&gt; break the symmetry</code></pre>
<div class="callout"><span class="badge">Read then feel</span> Appeal starts with readability. If the pose is clear in silhouette and the shapes have character, appeal follows.</div>`,
    `<span class="eyebrow">ANT401 · Chương 7 · Bài 7.1</span>
<h2>Phóng đại, dựng hình vững &amp; sức hút</h2>
<h3>Exaggeration (phóng đại)</h3>
<p>Sao chép y hệt thực tế trông cứng đờ trên màn hình. <strong>Đẩy mạnh cái cốt lõi</strong> — làm cái buồn buồn hơn, cái nhanh nhanh hơn, dáng cực hơn — mà vẫn <em>trung thành với ý</em>. Mẹo là ở cân bằng: phóng đại đều mọi thứ thì cảnh thành hỗn loạn; chọn cái quan trọng và đẩy nó.</p>
<h3>Solid drawing (dựng hình vững)</h3>
<p>Vẽ hình có cảm giác <strong>khối, trọng lượng và cân bằng trong không gian 3D</strong> — nhân vật dựng từ khối cầu và khối hộp, thu phối cảnh đúng, đứng đáng tin trong phối cảnh. Coi chừng <strong>twinning</strong> (hai bên làm y hệt nhau đối xứng) — nó giết sự sống; hãy làm lệch dáng đi.</p>
<h3>Appeal (sức hút)</h3>
<p>Không phải "dễ thương" — <strong>thiết kế và diễn xuất thú vị và đọc rõ</strong>. Silhouette rõ, hình khối mạnh, một chút bất đối xứng, tránh cái tầm thường. Một nhân vật phản diện vẫn có thể có appeal. Hình yếu, nhoè nhoẹt thì không có.</p>
<pre><code>Ngôn ngữ hình khối:
  hình tròn -> thân thiện, mềm
  hình vuông -> mạnh, vững, cứng cáp
  hình nhọn/tam giác -> nguy hiểm, gai góc
  tránh twinning:  tay P == tay T  =&gt; phá đối xứng</code></pre>
<div class="callout"><span class="badge">Đọc được rồi mới cảm</span> Appeal bắt đầu từ tính dễ đọc. Nếu dáng rõ trong silhouette và hình khối có cá tính, sức hút sẽ theo sau.</div>`,
  ]]);

const c7q = quiz('ant401-quiz-7', 'Quiz 7 — Exaggeration & appeal|||Quiz 7 — Phóng đại & sức hút', [
  { id: 'q1', question: 'Phóng đại (exaggeration) đúng cách nghĩa là gì?', options: ['Bóp méo mọi thứ tối đa', 'Đẩy mạnh cái cốt lõi cho rõ nhưng vẫn trung thành với ý', 'Chỉ dùng cho phản diện', 'Sao chép y hệt thực tế'], correctIndex: 1, explanation: 'Đẩy cái quan trọng để rõ ràng, giữ đúng ý; phóng đại đều mọi thứ thì cảnh loạn.' },
  { id: 'q2', question: '"Twinning" là lỗi gì trong solid drawing?', options: ['Vẽ hai nhân vật', 'Hai bên cơ thể làm động tác đối xứng y hệt, làm dáng chết cứng', 'Dùng hai màu', 'Tô hai lớp'], correctIndex: 1, explanation: 'Đối xứng hoàn toàn hai bên giết sự sống; nên làm lệch dáng (offset).' },
  { id: 'q3', question: 'Appeal (sức hút) trước hết dựa vào yếu tố nào?', options: ['Nhân vật phải dễ thương', 'Tính dễ đọc: silhouette rõ và hình khối có cá tính', 'Số lượng màu', 'Độ phân giải cao'], correctIndex: 1, explanation: 'Appeal khởi từ readability; phản diện cũng có appeal nếu hình rõ và mạnh.' },
]);

const c8 = doc('ant401-8-1-pipeline-to-digital', '8.1 — The 2D production pipeline & the move to digital|||8.1 — Quy trình sản xuất 2D & chuyển sang kỹ thuật số',
  'Quy trình 2D: kịch bản → storyboard → animatic → thiết kế/model sheet → layout → keyframe → inbetween → clean-up → tô màu → ghép; và bước chuyển từ giấy/cel sang phần mềm số (paperless).',
  [[
    `<span class="eyebrow">ANT401 · Chapter 8 · Lesson 8.1</span>
<h2>The 2D pipeline &amp; going digital</h2>
<h3>The traditional 2D pipeline</h3>
<p>A hand-drawn film flows through a fixed chain of stages, each handing off to the next:</p>
<pre><code>Script
  -> Storyboard      (shots as sketches, like a comic)
  -> Animatic        (boards timed to the soundtrack)
  -> Design / model sheets (characters, props, colour)
  -> Layout          (staging, camera, backgrounds)
  -> Keyframes       (lead animator: the story poses)
  -> Breakdowns / Inbetweens (assistants fill the motion)
  -> Clean-up        (final tight lines over the roughs)
  -> Ink &amp; paint / colour
  -> Composite &amp; edit -> final film</code></pre>
<h3>The move to digital (paperless)</h3>
<p>The <em>principles do not change</em> — squash, timing, arcs still rule. What changed is the medium: instead of paper, pegs and painted <strong>cels</strong>, animators draw <strong>frame-by-frame in software</strong> (OpenToonz, Toon Boom Harmony, Krita). Digital adds <strong>onion-skinning</strong> (see the frames before/after ghosted), a virtual <strong>X-sheet/timeline</strong>, instant re-timing, layers instead of cel stacks, and paint-bucket colour. The workflow above stays the same; only ink &amp; paint and inbetween mechanics got faster.</p>
<div class="callout"><span class="badge">Same craft, new tools</span> Digital removes the drudgery (repainting cels, physical inbetweening) but rewards nothing you have not planned. Story, timing and appeal are still done by hand and eye.</div>`,
    `<span class="eyebrow">ANT401 · Chương 8 · Bài 8.1</span>
<h2>Quy trình 2D &amp; chuyển sang số</h2>
<h3>Quy trình sản xuất 2D truyền thống</h3>
<p>Một phim vẽ tay chảy qua một chuỗi công đoạn cố định, mỗi khâu bàn giao cho khâu sau:</p>
<pre><code>Kịch bản
  -> Storyboard      (các cảnh vẽ phác, như truyện tranh)
  -> Animatic        (board canh theo âm thanh)
  -> Thiết kế / model sheet (nhân vật, đạo cụ, màu)
  -> Layout          (dàn dựng, máy quay, nền)
  -> Keyframe        (animator chính: các dáng kể chuyện)
  -> Breakdown / Inbetween (trợ lý lấp đầy chuyển động)
  -> Clean-up        (nét sạch cuối đè lên bản phác)
  -> Ink &amp; paint / tô màu
  -> Ghép &amp; dựng -> phim hoàn chỉnh</code></pre>
<h3>Chuyển sang kỹ thuật số (paperless)</h3>
<p><em>Nguyên tắc không đổi</em> — squash, timing, arc vẫn cai trị. Cái đổi là phương tiện: thay vì giấy, chốt định vị và <strong>cel</strong> tô tay, người làm hoạt hình vẽ <strong>từng khung trong phần mềm</strong> (OpenToonz, Toon Boom Harmony, Krita). Số hoá thêm <strong>onion-skinning</strong> (thấy mờ các khung trước/sau), <strong>X-sheet/timeline</strong> ảo, chỉnh timing tức thì, layer thay cho chồng cel, và tô màu bằng thùng sơn. Quy trình ở trên vẫn thế; chỉ khâu ink &amp; paint và cơ học inbetween nhanh hơn.</p>
<div class="callout"><span class="badge">Cùng kỹ nghệ, công cụ mới</span> Số hoá bỏ đi phần cực nhọc (tô lại cel, vẽ inbetween tay) nhưng không thưởng cho thứ bạn chưa lên kế hoạch. Câu chuyện, timing và sức hút vẫn làm bằng tay và mắt.</div>`,
  ]]);

const c8q = quiz('ant401-quiz-8', 'Quiz 8 — Pipeline & digital|||Quiz 8 — Quy trình & số hoá', [
  { id: 'q1', question: 'Thứ tự nào đúng trong quy trình sản xuất 2D?', options: ['Clean-up → keyframe → storyboard', 'Storyboard → keyframe → inbetween → clean-up', 'Inbetween → storyboard → layout', 'Tô màu → keyframe → kịch bản'], correctIndex: 1, explanation: 'Kịch bản → storyboard → layout → keyframe → inbetween → clean-up → tô màu → ghép.' },
  { id: 'q2', question: 'Khi chuyển sang hoạt hình số (paperless), điều gì KHÔNG thay đổi?', options: ['Công cụ vẽ', 'Các nguyên tắc hoạt hình (squash, timing, arc…)', 'Cách tô màu', 'Cách lưu file'], correctIndex: 1, explanation: '12 nguyên tắc và timing vẫn nguyên; chỉ phương tiện và cơ học inbetween/tô màu nhanh hơn.' },
  { id: 'q3', question: 'Tính năng số nào cho phép thấy mờ các khung trước/sau khi đang vẽ?', options: ['Onion-skinning', 'Ink & paint', 'Rotoscope', 'Compositing'], correctIndex: 0, explanation: 'Onion-skinning hiện bóng mờ các khung kề để canh chuyển động — thay cho việc lật giấy trên bàn ánh sáng.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'ANT401',
    slug: 'ant401-traditional-animation-principles',
    title: 'Traditional Animation Principles',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ANT401.webp',
    shortDescription: 'Traditional 2D animation — Disney 12 principles, squash & stretch, timing & the exposure sheet, arcs & appeal, and the storyboard→keyframe→inbetween→clean-up pipeline into digital. Bilingual, with worked charts & quizzes.|||Hoạt hình 2D truyền thống — 12 nguyên tắc Disney, squash & stretch, timing & bảng exposure, arc & sức hút, quy trình storyboard→keyframe→inbetween→clean-up sang kỹ thuật số. Song ngữ, có biểu đồ & quiz.',
    description: 'Môn <strong>ANT401 — Traditional Animation Principles</strong> (kỳ 7, ngành Thiết kế mỹ thuật số) dạy kỹ nghệ làm <strong>hoạt hình 2D vẽ tay</strong> sống động. Từ <strong>lịch sử &amp; 12 nguyên tắc Disney</strong> → <strong>squash/stretch &amp; anticipation</strong> → <strong>staging và hai phương pháp làm</strong> → <strong>follow-through, overlap &amp; slow in/out</strong> → <strong>arc &amp; secondary action</strong> → <strong>timing &amp; bảng exposure (X-sheet)</strong> → <strong>phóng đại, dựng hình vững &amp; sức hút</strong> → <strong>quy trình sản xuất 2D và bước sang kỹ thuật số</strong>. Bám bốn cuốn kinh điển (Thomas &amp; Johnston, Richard Williams, Preston Blair, Harold Whitaker), song ngữ, có biểu đồ mẫu và quiz mỗi chương.',
    whatYouLearn: '12 nguyên tắc hoạt hình; squash &amp; stretch (giữ thể tích); anticipation; staging &amp; phép thử silhouette; straight-ahead vs pose-to-pose; follow-through, overlapping action, slow in/out (spacing); arc &amp; secondary action; timing, ones/twos &amp; đọc-viết bảng exposure (X-sheet); phóng đại, solid drawing (tránh twinning), appeal; quy trình storyboard → keyframe → inbetween → clean-up và cách chuyển sang công cụ số (onion-skinning, timeline).',
    requirements: 'Biết vẽ phác cơ bản là một lợi thế nhưng không bắt buộc. Nên cài một công cụ hoạt hình miễn phí (Pencil2D, Krita hoặc OpenToonz) để thực hành các bài tập kinh điển.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình FLM, bốn cuốn kinh điển, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Hoạt hình là gì, 24 fps, vì sao học nguyên tắc.', lessons: [intro] },
    { title: 'Chương 1 — Lịch sử & 12 nguyên tắc|||Chapter 1 — History & 12 principles', description: 'Từ zoetrope đến Disney; 12 nguyên tắc cơ bản.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Squash & anticipation|||Chapter 2 — Squash & anticipation', description: 'Co/giãn giữ thể tích; lấy đà.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Staging & phương pháp|||Chapter 3 — Staging & methods', description: 'Silhouette; straight-ahead vs pose-to-pose.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Follow-through & easing|||Chapter 4 — Follow-through & easing', description: 'Kéo lê, overlap, slow in/out, spacing.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Arc & động tác phụ|||Chapter 5 — Arcs & secondary action', description: 'Đường cong chuyển động; secondary action.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Timing & bảng exposure|||Chapter 6 — Timing & X-sheet', description: 'Số khung, ones/twos, X-sheet.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Phóng đại & sức hút|||Chapter 7 — Exaggeration & appeal', description: 'Exaggeration, solid drawing, appeal.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Quy trình 2D & số hoá|||Chapter 8 — Pipeline & digital', description: 'Storyboard→keyframe→inbetween→clean-up; paperless.', lessons: [c8, c8q] },
  ],
};
