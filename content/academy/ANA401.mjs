/**
 * ANA401 — 3D Character Animation (Diễn hoạt nhân vật 3D). Ngành Thiết kế mỹ
 * thuật số, kỳ 7 (FPTU). Giáo trình: Richard Williams "The Animator's Survival
 * Kit"; Thomas & Johnston "The Illusion of Life" (12 nguyên tắc); Jeremy Cantor
 * "Inspired 3D Character Animation"; tài liệu Maya/Blender. Môn nghệ thuật, ít
 * code. Song ngữ VI+EN + quiz/chương. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ana401-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách kinh điển (Williams, Thomas & Johnston, Cantor), tài liệu Maya/Blender, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">ANA401 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>3D Character Animation</strong> — the 12 principles, body mechanics, acting and polish — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ANA401 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Core books</h3>
<ul>
<li><a href="https://www.theanimatorssurvivalkit.com/" target="_blank" rel="noopener"><em>The Animator's Survival Kit</em> — Richard Williams</a> (the working animator's bible)</li>
<li><a href="https://en.wikipedia.org/wiki/The_Illusion_of_Life:_Disney_Animation" target="_blank" rel="noopener"><em>The Illusion of Life: Disney Animation</em> — Thomas &amp; Johnston</a> (source of the 12 principles)</li>
<li><a href="https://en.wikipedia.org/wiki/Character_animation" target="_blank" rel="noopener"><em>Inspired 3D Character Animation</em> — Jeremy Cantor</a> (3D-specific workflow)</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://docs.blender.org/manual/en/latest/animation/index.html" target="_blank" rel="noopener">Blender Manual — Animation &amp; Rigging</a></li>
<li><a href="https://help.autodesk.com/view/MAYAUL/2024/ENU/" target="_blank" rel="noopener">Autodesk Maya — official documentation</a></li>
<li><a href="https://the12principles.tumblr.com/" target="_blank" rel="noopener">The 12 Principles of Animation — illustrated</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@AlanBeckerTutorials" target="_blank" rel="noopener">Alan Becker</a> — the 12 principles explained visually</li>
<li><a href="https://www.youtube.com/@Blender" target="_blank" rel="noopener">Blender Official</a> — animation workshops &amp; open movies</li>
<li><a href="https://www.youtube.com/@NewPlastic" target="_blank" rel="noopener">New Plastic / animation critique channels</a> — body mechanics &amp; acting breakdowns</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.blender.org/" target="_blank" rel="noopener">Blender</a> — free, full 3D animation &amp; rigging suite</li>
<li><a href="https://www.autodesk.com/products/maya/" target="_blank" rel="noopener">Autodesk Maya</a> — industry-standard character animation (free student license)</li>
<li><a href="https://www.mixamo.com/" target="_blank" rel="noopener">Mixamo</a> — free rigged characters to practise on</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — learn the 12 principles cold, then animate a bouncing ball and a pendulum to feel timing &amp; spacing.</li>
<li><strong>Body mechanics</strong> — walk, run and jump cycles on a simple rig; get weight and balance believable.</li>
<li><strong>Acting</strong> — facial animation, lip-sync and a short performance shot driven by a real emotion.</li>
<li><strong>Portfolio</strong> — polish in the graph editor and cut a focused showreel that lands a studio junior role.</li>
</ol></div>`,
    `<span class="eyebrow">ANA401 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Diễn hoạt nhân vật 3D</strong> — 12 nguyên tắc, body mechanics, acting và polish — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ANA401 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách kinh điển</h3>
<ul>
<li><a href="https://www.theanimatorssurvivalkit.com/" target="_blank" rel="noopener"><em>The Animator's Survival Kit</em> — Richard Williams</a> (sách gối đầu của dân làm nghề)</li>
<li><a href="https://en.wikipedia.org/wiki/The_Illusion_of_Life:_Disney_Animation" target="_blank" rel="noopener"><em>The Illusion of Life: Disney Animation</em> — Thomas &amp; Johnston</a> (nguồn gốc của 12 nguyên tắc)</li>
<li><a href="https://en.wikipedia.org/wiki/Character_animation" target="_blank" rel="noopener"><em>Inspired 3D Character Animation</em> — Jeremy Cantor</a> (quy trình riêng cho 3D)</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://docs.blender.org/manual/en/latest/animation/index.html" target="_blank" rel="noopener">Blender Manual — Animation &amp; Rigging</a></li>
<li><a href="https://help.autodesk.com/view/MAYAUL/2024/ENU/" target="_blank" rel="noopener">Autodesk Maya — tài liệu chính thức</a></li>
<li><a href="https://the12principles.tumblr.com/" target="_blank" rel="noopener">12 nguyên tắc hoạt hình — minh hoạ động</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@AlanBeckerTutorials" target="_blank" rel="noopener">Alan Becker</a> — 12 nguyên tắc giảng trực quan</li>
<li><a href="https://www.youtube.com/@Blender" target="_blank" rel="noopener">Blender Official</a> — workshop diễn hoạt &amp; phim mở</li>
<li><a href="https://www.youtube.com/@NewPlastic" target="_blank" rel="noopener">New Plastic / kênh phân tích diễn hoạt</a> — mổ xẻ body mechanics &amp; acting</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.blender.org/" target="_blank" rel="noopener">Blender</a> — bộ 3D diễn hoạt &amp; rigging miễn phí, đầy đủ</li>
<li><a href="https://www.autodesk.com/products/maya/" target="_blank" rel="noopener">Autodesk Maya</a> — chuẩn công nghiệp cho diễn hoạt nhân vật (bản sinh viên miễn phí)</li>
<li><a href="https://www.mixamo.com/" target="_blank" rel="noopener">Mixamo</a> — nhân vật đã rig miễn phí để luyện tập</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — thuộc lòng 12 nguyên tắc, rồi làm quả bóng nảy và con lắc để cảm timing &amp; spacing.</li>
<li><strong>Body mechanics</strong> — chu kỳ đi, chạy, nhảy trên rig đơn giản; làm trọng lượng &amp; thăng bằng đáng tin.</li>
<li><strong>Acting</strong> — diễn hoạt khuôn mặt, lip-sync và một cảnh diễn xuất ngắn xuất phát từ cảm xúc thật.</li>
<li><strong>Hồ sơ</strong> — polish trong graph editor và dựng showreel tập trung để xin được vị trí junior ở studio.</li>
</ol></div>`,
  ]]);

const intro = doc('ana401-0-1-overview', 'Course overview: 3D Character Animation|||Tổng quan: Diễn hoạt nhân vật 3D',
  'Diễn hoạt là gì; khác biệt giữa MOVING và ACTING; lộ trình: 12 nguyên tắc → timing/spacing → body mechanics → weight → khuôn mặt & lip-sync → acting → polish → showreel.',
  [[
    `<span class="eyebrow">ANA401 · Lesson 0.1 · Overview</span>
<h2>3D Character Animation</h2>
<p class="lead">This course teaches you to <strong>bring a 3D character to life</strong> — not just to move a rig, but to make an audience believe there is a thinking, feeling being on screen. You'll work in <strong>Maya</strong> or <strong>Blender</strong>, building from a bouncing ball up to a full acting performance.</p>
<h3>Moving is not acting</h3>
<p>A rig that slides from A to B is <em>moving</em>. A character that decides to go, hesitates, then commits — with weight, anticipation and a clear thought — is <em>acting</em>. Everything in this course exists to close that gap.</p>
<h3>Roadmap</h3>
<ul>
<li><strong>Ch.1</strong> The 12 principles &amp; how they apply in 3D.</li>
<li><strong>Ch.2</strong> Pose-to-pose, timing &amp; spacing.</li>
<li><strong>Ch.3</strong> Body mechanics — walk, run, jump.</li>
<li><strong>Ch.4</strong> Weight &amp; balance.</li>
<li><strong>Ch.5</strong> Facial animation &amp; lip-sync.</li>
<li><strong>Ch.6</strong> Acting &amp; character expression.</li>
<li><strong>Ch.7</strong> Polish, graph editor &amp; splining.</li>
<li><strong>Ch.8</strong> Showreel &amp; studio pipeline.</li>
</ul>
<div class="callout"><span class="badge">The habit that matters most</span> Shoot <strong>reference video</strong> of yourself acting the shot, then study it frame by frame. Every professional does this — animation is observation before it is software.</div>`,
    `<span class="eyebrow">ANA401 · Bài 0.1 · Tổng quan</span>
<h2>Diễn hoạt nhân vật 3D</h2>
<p class="lead">Môn này dạy bạn <strong>thổi hồn cho nhân vật 3D</strong> — không chỉ làm rig di chuyển, mà khiến khán giả tin rằng trên màn hình có một sinh thể biết nghĩ, biết cảm. Bạn làm việc trong <strong>Maya</strong> hoặc <strong>Blender</strong>, đi từ quả bóng nảy đến một cảnh diễn xuất hoàn chỉnh.</p>
<h3>Di chuyển không phải là diễn xuất</h3>
<p>Một rig trượt từ A sang B chỉ là <em>di chuyển</em>. Một nhân vật quyết định đi, chần chừ, rồi dứt khoát — có trọng lượng, có anticipation và một suy nghĩ rõ ràng — mới là <em>diễn xuất</em>. Mọi thứ trong môn này tồn tại để khép khoảng cách đó.</p>
<h3>Lộ trình</h3>
<ul>
<li><strong>Ch.1</strong> 12 nguyên tắc &amp; ứng dụng trong 3D.</li>
<li><strong>Ch.2</strong> Pose-to-pose, timing &amp; spacing.</li>
<li><strong>Ch.3</strong> Body mechanics — đi, chạy, nhảy.</li>
<li><strong>Ch.4</strong> Weight &amp; balance (trọng lượng &amp; thăng bằng).</li>
<li><strong>Ch.5</strong> Diễn hoạt khuôn mặt &amp; lip-sync.</li>
<li><strong>Ch.6</strong> Acting &amp; biểu cảm nhân vật.</li>
<li><strong>Ch.7</strong> Polish, graph editor &amp; splining.</li>
<li><strong>Ch.8</strong> Showreel &amp; pipeline studio.</li>
</ul>
<div class="callout"><span class="badge">Thói quen quan trọng nhất</span> Quay <strong>video tham chiếu</strong> chính bạn diễn cảnh đó, rồi phân tích từng khung hình. Dân chuyên nghiệp nào cũng làm vậy — diễn hoạt là quan sát trước khi là phần mềm.</div>`,
  ]]);

const c1 = doc('ana401-1-1-twelve-principles', '1.1 — The 12 principles &amp; 3D application|||1.1 — 12 nguyên tắc &amp; ứng dụng 3D',
  '12 nguyên tắc của Disney (Thomas & Johnston): squash & stretch, anticipation, staging, straight-ahead/pose-to-pose, follow-through & overlap, slow in/out, arcs, secondary action, timing, exaggeration, solid drawing, appeal — và cách chúng biến đổi khi lên 3D.',
  [[
    `<span class="eyebrow">ANA401 · Chapter 1 · Lesson 1.1</span>
<h2>The 12 principles &amp; 3D application</h2>
<p>In <em>The Illusion of Life</em>, Frank Thomas &amp; Ollie Johnston distilled Disney's craft into <strong>12 principles</strong>. They were written for pencil-on-paper, but every one still rules 3D — the tools change, the physics of believable motion does not.</p>
<pre><code>The 12 principles
 1  Squash &amp; stretch      volume-preserving deform = weight &amp; flexibility
 2  Anticipation          wind up before an action so the eye can read it
 3  Staging               present the idea clearly; one thought per shot
 4  Straight-ahead / pose-to-pose   two ways to build a shot
 5  Follow-through &amp; overlap   parts lag and settle after the body stops
 6  Slow in &amp; slow out    ease into and out of poses (spacing)
 7  Arcs                  natural motion travels on curves, not lines
 8  Secondary action      supports the main action without stealing it
 9  Timing                number of frames = weight, mood, meaning
10  Exaggeration          push the idea past literal reality
11  Solid drawing         weight, volume, balance in 3D space
12  Appeal                charisma; the eye wants to keep watching
</code></pre>
<h3>What changes in 3D</h3>
<ul>
<li><strong>Squash &amp; stretch</strong> must keep <em>volume</em> — a rig that stretches without squashing looks like melting rubber. Watch for broken silhouettes.</li>
<li><strong>Solid drawing</strong> becomes <strong>solid posing</strong>: your model is already dimensional, so the job is balance, line of action and readable silhouette from the camera.</li>
<li><strong>Slow in/out</strong> is now literally the <em>spacing</em> of your keys, shaped in the <strong>graph editor</strong> — see Chapter 7.</li>
</ul>
<div class="callout"><span class="badge">Test yourself</span> Take any 2-second shot you admire and name which principles are doing the heavy lifting. If you can't see them, you can't yet author them.</div>`,
    `<span class="eyebrow">ANA401 · Chương 1 · Bài 1.1</span>
<h2>12 nguyên tắc &amp; ứng dụng 3D</h2>
<p>Trong <em>The Illusion of Life</em>, Frank Thomas &amp; Ollie Johnston đúc kết tay nghề Disney thành <strong>12 nguyên tắc</strong>. Chúng viết cho bút chì trên giấy, nhưng nguyên tắc nào cũng còn cai trị 3D — công cụ đổi, còn vật lý của chuyển động đáng tin thì không.</p>
<pre><code>12 nguyên tắc
 1  Squash &amp; stretch      biến dạng giữ thể tích = trọng lượng &amp; độ dẻo
 2  Anticipation          lấy đà trước hành động để mắt kịp đọc
 3  Staging               trình bày ý rõ ràng; mỗi cảnh một suy nghĩ
 4  Straight-ahead / pose-to-pose   hai cách dựng cảnh
 5  Follow-through &amp; overlap   bộ phận trễ &amp; lắng lại sau khi thân dừng
 6  Slow in &amp; slow out    vào/ra pose có gia tốc (spacing)
 7  Arcs                  chuyển động tự nhiên đi theo cung, không theo đường thẳng
 8  Secondary action      hỗ trợ hành động chính, không cướp nó
 9  Timing                số khung hình = trọng lượng, tâm trạng, ý nghĩa
10  Exaggeration          đẩy ý vượt hiện thực nguyên văn
11  Solid drawing         trọng lượng, thể tích, thăng bằng trong không gian 3D
12  Appeal                sức hút; mắt muốn xem tiếp
</code></pre>
<h3>Cái gì đổi khi lên 3D</h3>
<ul>
<li><strong>Squash &amp; stretch</strong> phải giữ <em>thể tích</em> — rig kéo giãn mà không nén trông như cao su tan chảy. Canh silhouette đừng vỡ.</li>
<li><strong>Solid drawing</strong> thành <strong>solid posing</strong>: model vốn đã có khối, nên việc còn lại là thăng bằng, line of action và silhouette đọc được từ camera.</li>
<li><strong>Slow in/out</strong> giờ chính là <em>spacing</em> của các key, nắn trong <strong>graph editor</strong> — xem Chương 7.</li>
</ul>
<div class="callout"><span class="badge">Tự kiểm</span> Lấy một cảnh 2 giây bạn thích và gọi tên nguyên tắc nào đang gánh chính. Không thấy được thì chưa dựng được.</div>`,
  ]]);

const c1q = quiz('ana401-quiz-1', 'Quiz 1 — 12 principles|||Quiz 1 — 12 nguyên tắc', [
  { id: 'q1', question: 'Nguyên tắc "squash & stretch" khi lên 3D bắt buộc phải giữ điều gì?', options: ['Số khung hình', 'Thể tích (volume) của khối', 'Màu sắc nhân vật', 'Tốc độ render'], correctIndex: 1, explanation: 'Squash & stretch phải giữ thể tích; giãn mà không nén sẽ trông như cao su tan chảy, vỡ silhouette.' },
  { id: 'q2', question: 'Động tác "lấy đà" trước một hành động để mắt khán giả kịp đọc là nguyên tắc nào?', options: ['Anticipation', 'Staging', 'Appeal', 'Secondary action'], correctIndex: 0, explanation: 'Anticipation là cú wind-up trước hành động chính, giúp người xem đoán và đọc được động tác sắp tới.' },
  { id: 'q3', question: 'Hai cuốn/nhân vật nào là NGUỒN của 12 nguyên tắc hoạt hình?', options: ['Richard Williams', 'Jeremy Cantor', 'Thomas & Johnston (The Illusion of Life)', 'Tài liệu Maya'], correctIndex: 2, explanation: '12 nguyên tắc do Frank Thomas & Ollie Johnston đúc kết trong "The Illusion of Life: Disney Animation".' },
]);

const c2 = doc('ana401-2-1-pose-timing-spacing', '2.1 — Pose-to-pose, timing &amp; spacing|||2.1 — Pose-to-pose, timing &amp; spacing',
  'Straight-ahead vs pose-to-pose; key/breakdown/inbetween; timing (số khung → cảm giác trọng lượng) vs spacing (khoảng cách giữa các khung → gia tốc); slow in/out.',
  [[
    `<span class="eyebrow">ANA401 · Chapter 2 · Lesson 2.1</span>
<h2>Pose-to-pose, timing &amp; spacing</h2>
<h3>Two ways to build a shot</h3>
<ul>
<li><strong>Straight-ahead</strong> — animate frame after frame from the start. Spontaneous and fluid (fire, water, wild action), but easy to lose control of proportion and timing.</li>
<li><strong>Pose-to-pose</strong> — plan the strongest <strong>key poses</strong> first, then add <strong>breakdowns</strong>, then let the computer or you fill <strong>inbetweens</strong>. Controlled and readable — the default for character acting in 3D.</li>
</ul>
<h3>Timing vs spacing — the pair people confuse</h3>
<p><strong>Timing</strong> is <em>how many frames</em> an action takes — it reads as weight and mood. <strong>Spacing</strong> is <em>how far apart</em> the character is on each of those frames — it reads as acceleration.</p>
<pre><code>Same 6 frames, different SPACING:
 even spacing      | .  .  .  .  .  . |  robotic, constant speed
 slow-in / slow-out| .   .  . .  .   .|  eases out, speeds up, eases in = natural
Same DISTANCE, different TIMING:
 4 frames  = fast, light
 12 frames = slow, heavy
</code></pre>
<h3>Key / breakdown / inbetween</h3>
<ul>
<li><strong>Key</strong> — the storytelling pose; if you saw only these, you'd get the idea.</li>
<li><strong>Breakdown</strong> — the pose <em>between</em> keys that defines the path and the arc (not just a halfway average).</li>
<li><strong>Inbetween</strong> — the filler frames that complete the motion.</li>
</ul>
<div class="callout"><span class="badge">Blocking first</span> Animate in <strong>stepped</strong> mode (no interpolation) so you judge poses and timing before smoothing. Never polish curves on top of weak poses.</div>`,
    `<span class="eyebrow">ANA401 · Chương 2 · Bài 2.1</span>
<h2>Pose-to-pose, timing &amp; spacing</h2>
<h3>Hai cách dựng một cảnh</h3>
<ul>
<li><strong>Straight-ahead</strong> — làm từng khung nối tiếp từ đầu. Ngẫu hứng, mượt (lửa, nước, hành động dữ dội), nhưng dễ mất kiểm soát tỉ lệ và timing.</li>
<li><strong>Pose-to-pose</strong> — chốt các <strong>key pose</strong> mạnh nhất trước, rồi thêm <strong>breakdown</strong>, rồi để máy hoặc bạn điền <strong>inbetween</strong>. Kiểm soát tốt, đọc rõ — mặc định cho diễn xuất nhân vật trong 3D.</li>
</ul>
<h3>Timing vs spacing — cặp hay bị lẫn</h3>
<p><strong>Timing</strong> là <em>bao nhiêu khung hình</em> cho một hành động — đọc ra trọng lượng và tâm trạng. <strong>Spacing</strong> là <em>khoảng cách</em> nhân vật đi được trên mỗi khung đó — đọc ra gia tốc.</p>
<pre><code>Cùng 6 khung, SPACING khác nhau:
 đều nhau        | .  .  .  .  .  . |  máy móc, tốc độ không đổi
 slow-in/slow-out| .   .  . .  .   .|  ra chậm, tăng tốc, vào chậm = tự nhiên
Cùng QUÃNG ĐƯỜNG, TIMING khác nhau:
 4 khung  = nhanh, nhẹ
 12 khung = chậm, nặng
</code></pre>
<h3>Key / breakdown / inbetween</h3>
<ul>
<li><strong>Key</strong> — pose kể chuyện; chỉ nhìn các key này cũng hiểu ý.</li>
<li><strong>Breakdown</strong> — pose <em>giữa</em> các key, định ra đường đi và arc (không phải trung bình chính giữa).</li>
<li><strong>Inbetween</strong> — các khung đệm hoàn thiện chuyển động.</li>
</ul>
<div class="callout"><span class="badge">Blocking trước</span> Làm ở chế độ <strong>stepped</strong> (không nội suy) để đánh giá pose và timing trước khi làm mượt. Đừng bao giờ polish đường cong trên nền pose yếu.</div>`,
  ]]);

const c2q = quiz('ana401-quiz-2', 'Quiz 2 — Timing & spacing|||Quiz 2 — Timing & spacing', [
  { id: 'q1', question: '"Timing" trong hoạt hình đề cập tới điều gì?', options: ['Số khung hình một hành động chiếm', 'Khoảng cách giữa các vị trí trên mỗi khung', 'Màu của nhân vật', 'Góc camera'], correctIndex: 0, explanation: 'Timing = số khung hình cho một hành động, đọc ra trọng lượng và tâm trạng. Spacing mới là khoảng cách giữa các khung.' },
  { id: 'q2', question: 'Cách dựng cảnh nào chốt các key pose mạnh trước rồi mới điền breakdown/inbetween?', options: ['Straight-ahead', 'Pose-to-pose', 'Rotoscoping', 'Motion capture'], correctIndex: 1, explanation: 'Pose-to-pose lên key pose kể chuyện trước, dễ kiểm soát tỉ lệ & timing — mặc định cho diễn xuất nhân vật 3D.' },
  { id: 'q3', question: 'Vì sao nên blocking ở chế độ "stepped" (không nội suy) trước?', options: ['Để render nhanh hơn', 'Để đánh giá pose & timing trước khi làm mượt', 'Để giảm dung lượng file', 'Để tự động lip-sync'], correctIndex: 1, explanation: 'Stepped tắt nội suy nên bạn phán đúng pose và timing; polish đường cong trên pose yếu là công cốc.' },
]);

const c3 = doc('ana401-3-1-body-mechanics', '3.1 — Body mechanics: walk, run, jump|||3.1 — Body mechanics: đi, chạy, nhảy',
  'Chu kỳ đi (contact/down/passing/up), chu kỳ chạy (có pha bay), cú nhảy (crouch → push-off → air → landing); center of gravity, hông dẫn động, đối xứng chéo tay-chân.',
  [[
    `<span class="eyebrow">ANA401 · Chapter 3 · Lesson 3.1</span>
<h2>Body mechanics: walk, run, jump</h2>
<p>Body mechanics is <em>how a body actually moves under gravity</em>. Get this wrong and no amount of acting saves the shot. Richard Williams' <em>Survival Kit</em> is the reference here.</p>
<h3>The walk cycle — four key poses</h3>
<pre><code>Contact  -> both feet planted, legs spread, body at mid height
Down     -> weight drops onto front leg, body at LOWEST point
Passing  -> free leg swings past, body rising, one foot down
Up       -> body at HIGHEST point, pushing off the back toe
(then Contact on the opposite foot -> repeat)
</code></pre>
<ul>
<li>The <strong>hips lead</strong> and rotate; the <strong>arms swing opposite</strong> to the legs (right arm forward with left leg) for balance.</li>
<li>The <strong>center of gravity</strong> bobs down at Down and up at Up — a flat head-height reads as gliding, not walking.</li>
</ul>
<h3>Run</h3>
<p>A run adds an <strong>airborne phase</strong> — both feet leave the ground. Poses lean forward, contacts are harder, arms pump more, and the whole body compresses on landing then extends on push-off.</p>
<h3>Jump</h3>
<pre><code>Anticipation (crouch) -> load the legs, arms back
Push-off              -> explosive extension, arms swing up
Airborne              -> arc of the center of gravity (ballistic)
Landing               -> absorb: bend knees, follow-through, settle
</code></pre>
<div class="callout"><span class="badge">Watch the C.O.G.</span> In the air a character can flail limbs, but the <strong>center of gravity follows a fixed parabolic arc</strong> — it cannot change mid-flight. Breaking this is the #1 tell of fake jumps.</div>`,
    `<span class="eyebrow">ANA401 · Chương 3 · Bài 3.1</span>
<h2>Body mechanics: đi, chạy, nhảy</h2>
<p>Body mechanics là <em>cách một cơ thể thực sự chuyển động dưới trọng lực</em>. Sai chỗ này thì diễn xuất giỏi mấy cũng không cứu nổi cảnh. Cuốn <em>Survival Kit</em> của Richard Williams là tài liệu gối đầu.</p>
<h3>Chu kỳ đi — bốn key pose</h3>
<pre><code>Contact  -> hai chân chạm đất, dạng ra, thân ở độ cao trung bình
Down     -> trọng lượng dồn xuống chân trước, thân THẤP nhất
Passing  -> chân rảnh vung qua, thân đang lên, một chân chạm đất
Up       -> thân CAO nhất, đạp mũi chân sau
(rồi Contact ở chân đối diện -> lặp lại)
</code></pre>
<ul>
<li><strong>Hông dẫn động</strong> và xoay; <strong>tay vung ngược</strong> với chân (tay phải tới cùng chân trái) để giữ thăng bằng.</li>
<li><strong>Trọng tâm</strong> hạ ở Down và nâng ở Up — nếu đầu giữ nguyên độ cao thì trông như trượt chứ không phải đi.</li>
</ul>
<h3>Chạy</h3>
<p>Chạy thêm một <strong>pha bay</strong> — cả hai chân rời đất. Pose ngả về trước, contact mạnh hơn, tay bơm mạnh hơn, cả người nén khi tiếp đất rồi duỗi khi đạp.</p>
<h3>Nhảy</h3>
<pre><code>Anticipation (khuỵu) -> nạp lực vào chân, tay đưa ra sau
Push-off             -> duỗi bùng nổ, tay vung lên
Airborne (bay)       -> cung của trọng tâm (đạn đạo)
Landing (tiếp đất)   -> hấp thụ: gập gối, follow-through, lắng lại
</code></pre>
<div class="callout"><span class="badge">Canh trọng tâm</span> Khi bay, nhân vật có thể vung tay chân, nhưng <strong>trọng tâm đi theo một cung parabol cố định</strong> — không đổi được giữa chừng. Vi phạm điều này là dấu hiệu số 1 của cú nhảy giả.</div>`,
  ]]);

const c3q = quiz('ana401-quiz-3', 'Quiz 3 — Body mechanics|||Quiz 3 — Body mechanics', [
  { id: 'q1', question: 'Trong chu kỳ đi, thân người ở vị trí THẤP nhất tại pose nào?', options: ['Contact', 'Down', 'Passing', 'Up'], correctIndex: 1, explanation: 'Ở pose Down, trọng lượng dồn xuống chân trước và thân hạ thấp nhất; ở Up thân cao nhất khi đạp mũi chân sau.' },
  { id: 'q2', question: 'Điểm khác biệt cốt lõi của chạy so với đi là gì?', options: ['Tay không vung', 'Có pha bay — cả hai chân rời đất', 'Hông không xoay', 'Đầu giữ nguyên độ cao'], correctIndex: 1, explanation: 'Chạy có airborne phase: cả hai chân rời đất; đi thì luôn có ít nhất một chân chạm đất.' },
  { id: 'q3', question: 'Khi nhân vật đang bay giữa cú nhảy, điều gì KHÔNG thể thay đổi?', options: ['Tư thế tay chân', 'Biểu cảm khuôn mặt', 'Cung parabol của trọng tâm (C.O.G.)', 'Hướng nhìn'], correctIndex: 2, explanation: 'Khi bay, trọng tâm đi theo cung đạn đạo cố định — vung tay chân được nhưng không đổi được quỹ đạo trọng tâm.' },
]);

const c4 = doc('ana401-4-1-weight-balance', '4.1 — Weight &amp; balance|||4.1 — Weight &amp; balance (trọng lượng &amp; thăng bằng)',
  'Cách bán trọng lượng: center of gravity trên đế đỡ (base of support), counterbalance khi nâng vật nặng, nén trước lực, easing đúng khối lượng; tránh cảm giác "float".',
  [[
    `<span class="eyebrow">ANA401 · Chapter 4 · Lesson 4.1</span>
<h2>Weight &amp; balance</h2>
<p>The single biggest thing separating student work from professional work is <strong>weight</strong>. A 3D rig has no real mass, so you must <em>author</em> the illusion of it in every pose and every transition.</p>
<h3>How to sell weight</h3>
<ul>
<li><strong>Balance over the base of support.</strong> A standing character's center of gravity must sit above the area between the feet — or the pose reads as falling.</li>
<li><strong>Counterbalance.</strong> To pick up something heavy, the body leans the <em>opposite</em> way; heavy load in front means hips push back.</li>
<li><strong>Compress before force.</strong> Heavy actions load first (bend, gather) — the anticipation itself signals mass.</li>
<li><strong>Ease by mass.</strong> Heavy things have long slow-ins and slow-outs; light things snap. Wrong easing = wrong weight, even with perfect poses.</li>
</ul>
<pre><code>Reading a pose for balance
 [ plumb line from center of gravity ]
        |
      shoulders
        |
       hips    <- must fall INSIDE the feet
      /   \\
   foot     foot   <- base of support
 If the plumb line leaves the base -> the character is falling (or acting off-balance on purpose).
</code></pre>
<div class="callout"><span class="badge">The float test</span> If a character feels like it's on the moon, check two things: your <strong>easing is too soft</strong> (add snap to the fast parts) and your <strong>down poses aren't low enough</strong> (real weight sinks).</div>`,
    `<span class="eyebrow">ANA401 · Chương 4 · Bài 4.1</span>
<h2>Weight &amp; balance</h2>
<p>Thứ tách rõ nhất bài của sinh viên với bài của dân chuyên nghiệp là <strong>trọng lượng</strong>. Rig 3D không có khối lượng thật, nên bạn phải <em>dựng</em> ảo giác đó trong từng pose và từng chuyển tiếp.</p>
<h3>Cách bán trọng lượng</h3>
<ul>
<li><strong>Thăng bằng trên đế đỡ.</strong> Trọng tâm của nhân vật đứng phải nằm trên vùng giữa hai bàn chân — nếu không, pose đọc ra như đang ngã.</li>
<li><strong>Đối trọng (counterbalance).</strong> Muốn nâng vật nặng, thân ngả <em>ngược</em> lại; tải nặng phía trước thì hông đẩy ra sau.</li>
<li><strong>Nén trước lực.</strong> Hành động nặng nạp lực trước (khuỵu, gồng) — chính anticipation đã báo hiệu khối lượng.</li>
<li><strong>Easing theo khối lượng.</strong> Vật nặng có slow-in/slow-out dài; vật nhẹ thì bật nhanh. Sai easing = sai trọng lượng, dù pose hoàn hảo.</li>
</ul>
<pre><code>Đọc một pose để xét thăng bằng
 [ dây dọi từ trọng tâm ]
        |
       vai
        |
      hông    <- phải rơi VÀO TRONG hai bàn chân
      /   \\
  chân      chân   <- đế đỡ
 Nếu dây dọi rời khỏi đế -> nhân vật đang ngã (hoặc cố tình diễn mất thăng bằng).
</code></pre>
<div class="callout"><span class="badge">Phép thử "float"</span> Nếu nhân vật như đang ở trên mặt trăng, kiểm hai thứ: <strong>easing quá mềm</strong> (thêm snap cho đoạn nhanh) và <strong>pose down chưa đủ thấp</strong> (trọng lượng thật thì lún xuống).</div>`,
  ]]);

const c4q = quiz('ana401-quiz-4', 'Quiz 4 — Weight & balance|||Quiz 4 — Weight & balance', [
  { id: 'q1', question: 'Để một nhân vật đứng trông thăng bằng, trọng tâm (C.O.G.) phải nằm ở đâu?', options: ['Trên đầu', 'Phía trước hai bàn chân', 'Bên trong vùng đế đỡ giữa hai bàn chân', 'Ngoài đế đỡ'], correctIndex: 2, explanation: 'Dây dọi từ trọng tâm phải rơi vào trong base of support (vùng giữa hai bàn chân); rời khỏi đó là đang ngã.' },
  { id: 'q2', question: 'Khi nhân vật nhấc một vật nặng phía trước, thân người thường làm gì?', options: ['Ngả về phía trước theo vật', 'Ngả ngược lại (counterbalance)', 'Giữ nguyên thẳng đứng', 'Xoay hông sang ngang'], correctIndex: 1, explanation: 'Counterbalance: tải nặng phía trước thì hông/thân đẩy ngược ra sau để giữ trọng tâm trên đế đỡ.' },
  { id: 'q3', question: 'Nhân vật bị cảm giác "float" (lơ lửng như trên mặt trăng) thường do?', options: ['Easing quá mềm và pose down chưa đủ thấp', 'Quá nhiều key pose', 'Camera sai tiêu cự', 'Thiếu texture'], correctIndex: 0, explanation: 'Trọng lượng thật cần snap ở đoạn nhanh và pose down lún đủ sâu; easing quá mềm khiến mọi thứ trôi nhẹ.' },
]);

const c5 = doc('ana401-5-1-facial-lipsync', '5.1 — Facial animation &amp; lip-sync|||5.1 — Diễn hoạt khuôn mặt &amp; lip-sync',
  'Rig khuôn mặt (blendshapes/joints), phonemes & visemes, quy trình lip-sync (phân tích audio → key hàm/môi → khớp mở đầu), mắt & chân mày dẫn cảm xúc; tránh "mỏi hàm".',
  [[
    `<span class="eyebrow">ANA401 · Chapter 5 · Lesson 5.1</span>
<h2>Facial animation &amp; lip-sync</h2>
<h3>The face carries the thought</h3>
<p>Audiences read <strong>eyes and brows</strong> first — that is where the <em>thought</em> lives. The mouth handles speech, but a technically perfect lip-sync with dead eyes still feels lifeless. Animate the thought before the words.</p>
<h3>Visemes, not letters</h3>
<p>You don't animate spelling — you animate <strong>visemes</strong>, the visible mouth shapes for groups of sounds.</p>
<pre><code>Sound group        Mouth shape (viseme)
 M B P             lips fully closed
 F V               top teeth on bottom lip
 OO W             tight rounded pucker
 EE               wide, teeth showing
 AH               open, jaw dropped
 L, T, D          tongue tip up (subtle)
</code></pre>
<h3>Lip-sync workflow</h3>
<ol>
<li><strong>Analyse the audio</strong> — mark accents and phrase breaks on the timeline; the body/head accents matter more than the mouth.</li>
<li><strong>Key the jaw first</strong> — the jaw opens/closes with the rhythm before you touch lip shapes.</li>
<li><strong>Add visemes</strong> on the strong consonants (M/B/P closes, F/V), then vowels.</li>
<li><strong>Offset</strong> — mouth shapes often hit a frame or two <em>before</em> the sound; and don't hit every phoneme, favor the readable ones.</li>
</ol>
<div class="callout"><span class="badge">Common mistake</span> "Jaw chatter" — opening the mouth on every single syllable at the same amount. Real speech has a loose, uneven jaw and the lips do much of the work.</div>`,
    `<span class="eyebrow">ANA401 · Chương 5 · Bài 5.1</span>
<h2>Diễn hoạt khuôn mặt &amp; lip-sync</h2>
<h3>Khuôn mặt mang suy nghĩ</h3>
<p>Khán giả đọc <strong>mắt và chân mày</strong> trước — đó là nơi chứa <em>suy nghĩ</em>. Miệng lo phần lời, nhưng lip-sync chuẩn kỹ thuật mà mắt vô hồn thì vẫn như xác không hồn. Diễn suy nghĩ trước khi diễn lời.</p>
<h3>Viseme, không phải chữ cái</h3>
<p>Bạn không diễn theo cách đánh vần — bạn diễn <strong>viseme</strong>, hình miệng nhìn thấy được cho từng nhóm âm.</p>
<pre><code>Nhóm âm            Hình miệng (viseme)
 M B P             môi khép hẳn
 F V               răng trên chạm môi dưới
 OO W             chu tròn khít
 EE               rộng, hở răng
 AH               mở, hạ hàm
 L, T, D          đầu lưỡi đưa lên (nhẹ)
</code></pre>
<h3>Quy trình lip-sync</h3>
<ol>
<li><strong>Phân tích audio</strong> — đánh dấu điểm nhấn và chỗ ngắt câu trên timeline; nhấn ở thân/đầu quan trọng hơn ở miệng.</li>
<li><strong>Key hàm trước</strong> — hàm mở/đóng theo nhịp trước khi đụng tới hình môi.</li>
<li><strong>Thêm viseme</strong> ở các phụ âm mạnh (M/B/P khép, F/V), rồi tới nguyên âm.</li>
<li><strong>Offset</strong> — hình miệng thường tới sớm một, hai khung <em>trước</em> âm thanh; và đừng khớp mọi phoneme, ưu tiên hình nào đọc rõ.</li>
</ol>
<div class="callout"><span class="badge">Lỗi thường gặp</span> "Mỏi hàm" — mở miệng ở mọi âm tiết với cùng một độ. Lời nói thật có hàm lỏng, không đều, và đôi môi làm phần lớn công việc.</div>`,
  ]]);

const c5q = quiz('ana401-quiz-5', 'Quiz 5 — Facial & lip-sync|||Quiz 5 — Khuôn mặt & lip-sync', [
  { id: 'q1', question: 'Trong diễn hoạt khuôn mặt, khán giả đọc bộ phận nào TRƯỚC để hiểu suy nghĩ nhân vật?', options: ['Miệng', 'Mắt và chân mày', 'Cằm', 'Tai'], correctIndex: 1, explanation: 'Mắt và chân mày chứa "suy nghĩ"; lip-sync chuẩn mà mắt vô hồn vẫn thấy như xác không hồn.' },
  { id: 'q2', question: '"Viseme" là gì?', options: ['Một khung hình key', 'Hình miệng nhìn thấy được cho một nhóm âm', 'Một loại rig xương', 'Một hiệu ứng camera'], correctIndex: 1, explanation: 'Ta animate viseme — hình miệng cho nhóm âm (M/B/P khép, OO chu tròn...) — chứ không theo từng chữ cái.' },
  { id: 'q3', question: 'Trong quy trình lip-sync nên key bộ phận nào TRƯỚC?', options: ['Hình môi chi tiết từng phoneme', 'Hàm (jaw) theo nhịp', 'Chân mày', 'Lưỡi'], correctIndex: 1, explanation: 'Key hàm mở/đóng theo nhịp trước, rồi mới thêm viseme ở phụ âm mạnh và nguyên âm; tránh "mỏi hàm".' },
]);

const c6 = doc('ana401-6-1-acting-expression', '6.1 — Acting &amp; character expression|||6.1 — Acting &amp; biểu cảm nhân vật',
  'Diễn xuất = suy nghĩ hiện ra hành động; một suy nghĩ rõ mỗi cảnh; chuỗi think → act; dùng reference video, thay đổi pose (change of pose) và moving hold; tránh diễn "chung chung".',
  [[
    `<span class="eyebrow">ANA401 · Chapter 6 · Lesson 6.1</span>
<h2>Acting &amp; character expression</h2>
<p>Acting is <strong>thought made visible</strong>. The audience should be able to say what the character is <em>thinking</em> at any frame. Body mechanics gets a character moving correctly; acting gives it a reason to move.</p>
<h3>One clear thought per shot</h3>
<p>Amateur shots try to show three emotions at once and land none. Pick <strong>one</strong> intention, stage it clearly, and let the change of thought drive the change of pose.</p>
<pre><code>The acting chain
 THINK  -> the idea forms (eyes dart, a small settle)
 ANTICIPATE -> the body prepares to act on it
 ACT   -> the decision plays out
 REACT -> the aftermath / how the character feels about it
</code></pre>
<h3>Tools of expression</h3>
<ul>
<li><strong>Change of pose</strong> — a new thought earns a distinctly new silhouette, not a small tweak.</li>
<li><strong>Moving holds</strong> — a character "holding" a pose is never frozen; it keeps a live, breathing drift so it doesn't die.</li>
<li><strong>Eye direction &amp; blinks</strong> — where the eyes go, the mind goes; blinks often punctuate a change of thought.</li>
<li><strong>Reference &amp; restraint</strong> — act it out on camera, then keep only what reads. Less, but clearer, beats busy.</li>
</ul>
<div class="callout"><span class="badge">The 30-second test</span> Mute your shot and show it to someone. If they can't tell you what the character wants or feels, the acting isn't there yet — no amount of polish fixes an unclear intention.</div>`,
    `<span class="eyebrow">ANA401 · Chương 6 · Bài 6.1</span>
<h2>Acting &amp; biểu cảm nhân vật</h2>
<p>Diễn xuất là <strong>suy nghĩ được làm cho nhìn thấy</strong>. Khán giả phải nói được nhân vật đang <em>nghĩ</em> gì ở bất kỳ khung nào. Body mechanics làm nhân vật chuyển động đúng; acting cho nó một lý do để chuyển động.</p>
<h3>Một suy nghĩ rõ ràng mỗi cảnh</h3>
<p>Cảnh của người mới hay cố thể hiện ba cảm xúc cùng lúc và trượt cả ba. Chọn <strong>một</strong> ý định, dàn dựng rõ, và để sự đổi ý dẫn tới sự đổi pose.</p>
<pre><code>Chuỗi diễn xuất
 THINK  -> ý hình thành (mắt đảo, một cái lắng nhẹ)
 ANTICIPATE -> thân chuẩn bị hành động
 ACT   -> quyết định diễn ra
 REACT -> hậu quả / nhân vật cảm thấy sao về nó
</code></pre>
<h3>Công cụ biểu cảm</h3>
<ul>
<li><strong>Change of pose</strong> — một suy nghĩ mới xứng đáng một silhouette mới hẳn, không phải chỉnh vặt.</li>
<li><strong>Moving hold</strong> — nhân vật "giữ" một pose không bao giờ đóng băng; nó vẫn có một chuyển động sống, thở khẽ để không chết cứng.</li>
<li><strong>Hướng mắt &amp; chớp mắt</strong> — mắt đi đâu, tâm trí đi đó; cái chớp mắt thường ngắt nhịp một lần đổi ý.</li>
<li><strong>Reference &amp; tiết chế</strong> — diễn trước camera, rồi chỉ giữ cái nào đọc được. Ít mà rõ thắng nhiều mà rối.</li>
</ul>
<div class="callout"><span class="badge">Phép thử 30 giây</span> Tắt tiếng cảnh và cho ai đó xem. Nếu họ không nói được nhân vật muốn gì hay cảm gì thì acting chưa có — polish nhiều mấy cũng không sửa nổi một ý định mờ.</div>`,
  ]]);

const c6q = quiz('ana401-quiz-6', 'Quiz 6 — Acting|||Quiz 6 — Acting', [
  { id: 'q1', question: 'Một cảnh diễn xuất tốt nên tập trung vào?', options: ['Càng nhiều cảm xúc cùng lúc càng tốt', 'Một suy nghĩ/ý định rõ ràng', 'Càng nhiều key pose càng tốt', 'Chuyển động liên tục không dừng'], correctIndex: 1, explanation: 'Một suy nghĩ rõ mỗi cảnh, dàn dựng rõ; cố nhồi nhiều cảm xúc cùng lúc thường trượt cả ba.' },
  { id: 'q2', question: '"Moving hold" nghĩa là gì?', options: ['Đóng băng hoàn toàn nhân vật', 'Giữ pose nhưng vẫn có chuyển động sống, thở khẽ', 'Tua nhanh một đoạn', 'Xoá bớt key'], correctIndex: 1, explanation: 'Moving hold giữ pose mà không đóng băng — vẫn drift nhẹ để pose không "chết cứng" như tượng.' },
  { id: 'q3', question: 'Vì sao nên tắt tiếng (mute) và cho người khác xem cảnh diễn?', options: ['Để kiểm tra chất lượng render', 'Để xem người xem có đọc được ý định/cảm xúc nhân vật không', 'Để đo dung lượng file', 'Để test lip-sync'], correctIndex: 1, explanation: 'Nếu tắt tiếng mà người xem vẫn hiểu nhân vật muốn gì thì acting đã rõ; polish không cứu được ý định mờ.' },
]);

const c7 = doc('ana401-7-1-polish-graph-editor', '7.1 — Polish, graph editor &amp; splining|||7.1 — Polish, graph editor &amp; splining',
  'Từ blocking stepped → spline; đọc & nắn f-curve (tangent, ease); dọn gimbal & counter-animation; sửa arc; xử lý pop/hitch; loại "computer average"; nguyên tắc polish có kỷ luật.',
  [[
    `<span class="eyebrow">ANA401 · Chapter 7 · Lesson 7.1</span>
<h2>Polish, graph editor &amp; splining</h2>
<p>Polish is where a shot goes from "blocked and readable" to "believable". It happens in the <strong>graph editor</strong>, where every channel is an editable <strong>f-curve</strong> and spacing becomes literally the slope of a line.</p>
<h3>From stepped to spline</h3>
<pre><code>Stage        What you do
 Blocking    stepped keys — nail poses &amp; timing (Ch.2)
 Splining    switch to spline; the computer interpolates
 Cleanup     the interp is wrong everywhere -> fix the curves
 Polish      arcs, overlap, texture, final offsets
</code></pre>
<h3>Reading the curves</h3>
<ul>
<li><strong>Tangents</strong> shape ease: flat tangent = slow (ease), steep = fast. A slow-in is a curve flattening as it reaches the key.</li>
<li><strong>Kill the machine average.</strong> Default interpolation makes floaty, evenly-spaced motion — the "CG look". Break it with sharper contrasts of fast and slow.</li>
<li><strong>Fix arcs.</strong> Turn on the motion trail; hands, feet and head should travel on clean curves, not zig-zags or dead-straight lines.</li>
<li><strong>Hunt pops &amp; hitches.</strong> A single stray key or a tangent spike causes a jitter — scrub slowly and clean the curve, don't add more keys on top.</li>
</ul>
<div class="callout"><span class="badge">Discipline</span> Don't polish forever. Polish the <strong>readable</strong> parts (silhouette, arcs, contacts, eyes) and stop chasing micro-detail nobody will see — an unfinished five shots beats one over-polished shot.</div>`,
    `<span class="eyebrow">ANA401 · Chương 7 · Bài 7.1</span>
<h2>Polish, graph editor &amp; splining</h2>
<p>Polish là lúc một cảnh đi từ "đã block, đọc được" sang "đáng tin". Nó diễn ra trong <strong>graph editor</strong>, nơi mỗi kênh là một <strong>f-curve</strong> chỉnh được và spacing chính là độ dốc của đường.</p>
<h3>Từ stepped sang spline</h3>
<pre><code>Giai đoạn    Bạn làm gì
 Blocking    key stepped — chốt pose &amp; timing (Ch.2)
 Splining    chuyển sang spline; máy nội suy
 Cleanup     nội suy sai khắp nơi -> nắn lại đường cong
 Polish      arc, overlap, texture, offset cuối
</code></pre>
<h3>Đọc đường cong</h3>
<ul>
<li><strong>Tangent</strong> tạo ease: tangent phẳng = chậm (ease), dốc = nhanh. Slow-in là đường cong phẳng dần khi tới key.</li>
<li><strong>Diệt "máy trung bình".</strong> Nội suy mặc định cho chuyển động trôi, đều đều — cái "CG look". Phá nó bằng tương phản nhanh/chậm rõ hơn.</li>
<li><strong>Sửa arc.</strong> Bật motion trail; tay, chân, đầu phải đi theo cung sạch, không zig-zag hay thẳng đơ.</li>
<li><strong>Săn pop &amp; hitch.</strong> Một key lạc hay một tangent nhọn gây giật — scrub chậm và dọn đường cong, đừng chồng thêm key lên trên.</li>
</ul>
<div class="callout"><span class="badge">Kỷ luật</span> Đừng polish mãi. Polish phần <strong>đọc được</strong> (silhouette, arc, contact, mắt) và dừng săn micro-detail chẳng ai thấy — năm cảnh chưa xong thắng một cảnh polish quá tay.</div>`,
  ]]);

const c7q = quiz('ana401-quiz-7', 'Quiz 7 — Polish & graph editor|||Quiz 7 — Polish & graph editor', [
  { id: 'q1', question: 'Trong graph editor, "spacing" tương ứng với điều gì trên f-curve?', options: ['Màu của đường cong', 'Độ dốc (slope) của đường', 'Số lượng kênh', 'Tên của key'], correctIndex: 1, explanation: 'Spacing chính là độ dốc của f-curve: dốc = di chuyển nhanh, phẳng = chậm (ease).' },
  { id: 'q2', question: 'Thứ tự đúng của quy trình từ blocking tới polish là?', options: ['Splining → Blocking → Polish', 'Blocking (stepped) → Splining → Cleanup → Polish', 'Polish → Cleanup → Blocking', 'Cleanup → Blocking → Splining'], correctIndex: 1, explanation: 'Block ở stepped để chốt pose/timing, chuyển spline, dọn nội suy sai, rồi mới polish arc/overlap/offset.' },
  { id: 'q3', question: 'Cái "CG look" trôi nổi, đều đều thường do đâu và sửa thế nào?', options: ['Do nội suy mặc định; phá bằng tương phản nhanh/chậm rõ hơn', 'Do thiếu texture; thêm vật liệu', 'Do camera; đổi tiêu cự', 'Do rig; thêm xương'], correctIndex: 0, explanation: 'Nội suy mặc định cho spacing đều nên chuyển động trôi; nắn tangent để có tương phản nhanh/chậm, đồng thời sửa arc.' },
]);

const c8 = doc('ana401-8-1-showreel-pipeline', '8.1 — Showreel &amp; studio production pipeline|||8.1 — Showreel &amp; pipeline sản xuất studio',
  'Dựng showreel: best-first, ngắn, chỉ acting/body mechanics của bạn; pipeline studio (story/layout → blocking → spline → polish → final; review dailies); vai trò animator; playblast & format nộp.',
  [[
    `<span class="eyebrow">ANA401 · Chapter 8 · Lesson 8.1</span>
<h2>Showreel &amp; studio production pipeline</h2>
<h3>The showreel gets you hired</h3>
<p>A junior animation reel is judged in seconds. It shows <strong>animation skill</strong> — body mechanics and acting — not modeling, lighting or effects.</p>
<pre><code>Showreel rules
 - Best shot FIRST (reviewers stop early)
 - Short: 30-60s total; quality over quantity
 - Only YOUR animation; use provided/free rigs, that's fine
 - A mix: one body-mechanics piece + one acting/dialogue piece
 - Name + contact card at the start AND end
 - Play at correct speed; no slow-mo padding
</code></pre>
<h3>The studio animation pipeline</h3>
<pre><code>Story / boards -> Layout (camera, staging, timing)
              -> Blocking (key poses approved in dailies)
              -> Splining (motion filled, arcs)
              -> Polish (final texture, offsets)
              -> Final / lighting / render
</code></pre>
<ul>
<li><strong>Dailies / reviews</strong> — the shot is approved in stages by a lead/director. You get notes and iterate; nothing ships without sign-off.</li>
<li><strong>The animator's lane</strong> — you receive a rigged character, layout and audio, and you own the <em>performance</em>. Rigging, modeling, FX and lighting are other departments.</li>
<li><strong>Playblast to review</strong> — animators judge in fast <strong>playblasts</strong> (viewport captures), not slow final renders.</li>
<li><strong>File hygiene</strong> — versioned scenes, clean naming, and delivering the exact requested frame range/format keep a pipeline sane.</li>
</ul>
<div class="callout"><span class="badge">Career reality</span> Studios hire on <strong>performance and mechanics</strong>, not on how many buttons you know. A short reel of two strong, believable shots beats ten mediocre ones.</div>`,
    `<span class="eyebrow">ANA401 · Chương 8 · Bài 8.1</span>
<h2>Showreel &amp; pipeline sản xuất studio</h2>
<h3>Showreel giúp bạn được nhận</h3>
<p>Reel của animator junior được đánh giá trong vài giây. Nó cho thấy <strong>kỹ năng diễn hoạt</strong> — body mechanics và acting — chứ không phải model, ánh sáng hay hiệu ứng.</p>
<pre><code>Nguyên tắc showreel
 - Cảnh mạnh nhất ĐẦU TIÊN (người xem dừng sớm)
 - Ngắn: tổng 30-60 giây; chất hơn lượng
 - Chỉ animation CỦA BẠN; dùng rig cho sẵn/miễn phí là ổn
 - Trộn: một bài body-mechanics + một bài acting/thoại
 - Thẻ tên + liên hệ ở ĐẦU VÀ CUỐI
 - Chạy đúng tốc độ; không slow-mo kéo dài
</code></pre>
<h3>Pipeline diễn hoạt trong studio</h3>
<pre><code>Story / boards -> Layout (camera, staging, timing)
              -> Blocking (key pose duyệt trong dailies)
              -> Splining (điền chuyển động, arc)
              -> Polish (texture cuối, offset)
              -> Final / lighting / render
</code></pre>
<ul>
<li><strong>Dailies / review</strong> — cảnh được lead/đạo diễn duyệt theo từng giai đoạn. Bạn nhận note và làm lại; không gì lên phim mà chưa được ký duyệt.</li>
<li><strong>Phần việc của animator</strong> — bạn nhận nhân vật đã rig, layout và audio, và bạn làm chủ phần <em>diễn xuất</em>. Rigging, model, FX và ánh sáng là bộ phận khác.</li>
<li><strong>Playblast để review</strong> — animator đánh giá bằng <strong>playblast</strong> nhanh (chụp viewport), không phải render final chậm.</li>
<li><strong>Vệ sinh file</strong> — scene có version, đặt tên sạch, và nộp đúng khoảng khung/định dạng được yêu cầu giữ cho pipeline tỉnh táo.</li>
</ul>
<div class="callout"><span class="badge">Thực tế nghề</span> Studio tuyển dựa trên <strong>diễn xuất và cơ học</strong>, không phải số nút bạn biết. Một reel ngắn với hai cảnh mạnh, đáng tin thắng mười cảnh làng nhàng.</div>`,
  ]]);

const c8q = quiz('ana401-quiz-8', 'Quiz 8 — Showreel & pipeline|||Quiz 8 — Showreel & pipeline', [
  { id: 'q1', question: 'Nguyên tắc quan trọng nhất khi sắp xếp showreel là?', options: ['Đặt cảnh yếu trước để "khởi động"', 'Đặt cảnh mạnh nhất ĐẦU TIÊN', 'Càng dài càng tốt', 'Trộn cả model và lighting'], correctIndex: 1, explanation: 'Người xem reel dừng rất sớm, nên cảnh mạnh nhất phải đứng đầu; reel nên ngắn 30-60s, chất hơn lượng.' },
  { id: 'q2', question: 'Trong pipeline studio, thứ tự đúng của một cảnh diễn hoạt là?', options: ['Polish → Blocking → Layout', 'Layout → Blocking → Splining → Polish → Final', 'Splining → Layout → Blocking', 'Final → Polish → Layout'], correctIndex: 1, explanation: 'Layout dựng camera/staging/timing, blocking chốt key pose, splining điền chuyển động, rồi polish, cuối là final/render.' },
  { id: 'q3', question: 'Phần việc chính mà một animator "làm chủ" trong studio là gì?', options: ['Rigging nhân vật', 'Ánh sáng và render', 'Diễn xuất (performance) của nhân vật đã rig', 'Dựng model 3D'], correctIndex: 2, explanation: 'Animator nhận nhân vật đã rig, layout và audio, và làm chủ phần diễn xuất; rigging/model/FX/lighting là bộ phận khác.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'ANA401',
    slug: 'ana401-3d-character-animation',
    title: '3D Character Animation',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ANA401.webp',
    shortDescription: 'Bring 3D characters to life — the 12 principles, timing & spacing, body mechanics, weight & balance, facial animation & lip-sync, acting, graph-editor polish, and a studio-ready showreel. Bilingual, with quizzes.|||Thổi hồn nhân vật 3D — 12 nguyên tắc, timing & spacing, body mechanics, weight & balance, diễn xuất khuôn mặt & lip-sync, acting, polish graph editor, và showreel chuẩn studio. Song ngữ, có quiz.',
    description: 'Môn <strong>ANA401 — 3D Character Animation</strong> (Diễn hoạt nhân vật 3D, kỳ 7, ngành Thiết kế mỹ thuật số) dạy bạn <strong>thổi hồn cho nhân vật 3D</strong> trong Maya/Blender. Từ <strong>12 nguyên tắc của Disney</strong> → <strong>pose-to-pose, timing &amp; spacing</strong> → <strong>body mechanics</strong> (đi/chạy/nhảy) → <strong>weight &amp; balance</strong> → <strong>diễn hoạt khuôn mặt &amp; lip-sync</strong> → <strong>acting &amp; biểu cảm</strong> → <strong>polish trong graph editor</strong> → <strong>dựng showreel &amp; pipeline studio</strong>. Bám các sách kinh điển (Williams, Thomas &amp; Johnston, Cantor), song ngữ, có quiz mỗi chương.',
    whatYouLearn: '12 nguyên tắc hoạt hình &amp; ứng dụng 3D; straight-ahead vs pose-to-pose; timing vs spacing, slow in/out; chu kỳ đi/chạy/nhảy &amp; trọng tâm; weight, balance, counterbalance, easing theo khối lượng; rig khuôn mặt, viseme &amp; quy trình lip-sync; acting (think-act-react), moving hold, change of pose; splining &amp; nắn f-curve trong graph editor, sửa arc/pop; dựng showreel và hiểu pipeline sản xuất studio.',
    requirements: 'Đã quen một phần mềm 3D (Maya hoặc Blender) và biết dùng rig nhân vật cơ bản. Nên có webcam để quay video tham chiếu diễn xuất.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách kinh điển, tài liệu Maya/Blender, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Diễn hoạt là gì, moving vs acting, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — 12 nguyên tắc|||Chapter 1 — 12 principles', description: '12 nguyên tắc Disney & ứng dụng 3D.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Timing & spacing|||Chapter 2 — Timing & spacing', description: 'Pose-to-pose, key/breakdown/inbetween, ease.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Body mechanics|||Chapter 3 — Body mechanics', description: 'Chu kỳ đi, chạy, nhảy; trọng tâm.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Weight & balance|||Chapter 4 — Weight & balance', description: 'Trọng lượng, thăng bằng, counterbalance.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Khuôn mặt & lip-sync|||Chapter 5 — Facial & lip-sync', description: 'Viseme, quy trình lip-sync, mắt & chân mày.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Acting|||Chapter 6 — Acting', description: 'Think-act-react, moving hold, change of pose.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Polish & graph editor|||Chapter 7 — Polish & graph editor', description: 'Splining, nắn f-curve, arc, pop/hitch.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Showreel & pipeline|||Chapter 8 — Showreel & pipeline', description: 'Dựng showreel, pipeline studio, vai trò animator.', lessons: [c8, c8q] },
  ],
};
