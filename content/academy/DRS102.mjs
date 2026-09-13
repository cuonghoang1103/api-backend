/**
 * DRS102 — Drawing - Form, Still-life (Hình hoạ: Khối & Tĩnh vật).
 * Ngành Thiết kế mỹ thuật số FPTU, kỳ 1. Giáo trình vẽ chuẩn: Betty Edwards
 * "Drawing on the Right Side of the Brain", Andrew Loomis "Successful Drawing",
 * Bargue-Gérôme Drawing Course, Proko. Lộ trình 4 bước. Song ngữ + kỹ thuật
 * từng bước + bài tập. Giữ NGUYÊN slug/semester/thumb(v3).
 * ⚠️ KHÔNG backtick lồng/${; "&"→"&amp;" trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('drs102-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách vẽ chuẩn (Betty Edwards, Loomis, Bargue), tài liệu miễn phí, YouTube (Proko), công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">DRS102 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>drawing form and still-life</strong> — pencil &amp; charcoal, line &amp; proportion, the basic solids, perspective, light &amp; shadow, texture and composition — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are trusted, mostly free resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for DRS102 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books (the standard drawing canon)</h3>
<ul>
<li><em>Drawing on the Right Side of the Brain</em> — Betty Edwards. Teaches you to draw <strong>what you see</strong>, not what you think you see.</li>
<li><em>Successful Drawing</em> — Andrew Loomis. Proportion, perspective, light &amp; the "dumb-bell" of form.</li>
<li><em>Bargue-Gérôme Drawing Course</em> — the classical atelier plate method: copy, measure, refine.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@ProkoTV" target="_blank" rel="noopener">Proko</a> — the clearest free lessons on form, values, gesture &amp; still-life.</li>
<li><a href="https://www.youtube.com/@drawmixpaint" target="_blank" rel="noopener">Draw Mix Paint</a> — measured, observational still-life.</li>
</ul>
<h3>🛠️ Tools you need</h3>
<ul>
<li>Graphite pencils (a range like 2H, HB, 2B, 4B, 6B), a kneaded eraser, a blending stump.</li>
<li>Charcoal (vine + compressed) for bolder value studies; smooth cartridge paper.</li>
<li>A viewfinder / a knitting needle or pencil for <strong>sighting</strong> (measuring angles &amp; proportions).</li>
</ul>
<div class="callout"><span class="badge">Self-study path (4 steps)</span>
<ol>
<li><strong>See</strong> — train the eye: contour drawing, negative space, comparative measuring.</li>
<li><strong>Construct</strong> — build objects from the basic solids and correct perspective.</li>
<li><strong>Render</strong> — turn form with the 5 values, from lightest light to core &amp; cast shadow.</li>
<li><strong>Compose</strong> — arrange a still-life and carry it from thumbnail to finished study.</li>
</ol></div>`,
    `<span class="eyebrow">DRS102 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>vẽ khối và tĩnh vật</strong> — chì &amp; than, đường nét &amp; tỉ lệ, các khối cơ bản, phối cảnh, sáng tối, chất liệu và bố cục — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn uy tín, phần lớn miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DRS102 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo (bộ sách vẽ kinh điển)</h3>
<ul>
<li><em>Drawing on the Right Side of the Brain</em> — Betty Edwards. Dạy vẽ <strong>đúng cái mắt thấy</strong>, không phải cái trí nhớ nghĩ ra.</li>
<li><em>Successful Drawing</em> — Andrew Loomis. Tỉ lệ, phối cảnh, sáng tối và cách "dựng khối".</li>
<li><em>Bargue-Gérôme Drawing Course</em> — phương pháp atelier cổ điển: chép mẫu, đo, chỉnh.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ProkoTV" target="_blank" rel="noopener">Proko</a> — bài giảng miễn phí rõ nhất về khối, sắc độ, dáng &amp; tĩnh vật.</li>
<li><a href="https://www.youtube.com/@drawmixpaint" target="_blank" rel="noopener">Draw Mix Paint</a> — tĩnh vật quan sát, đo đạc kỹ.</li>
</ul>
<h3>🛠️ Dụng cụ cần có</h3>
<ul>
<li>Bút chì graphite (nhiều độ: 2H, HB, 2B, 4B, 6B), tẩy dẻo, cây di chì (blending stump).</li>
<li>Than (que than tự nhiên + than nén) cho bài sắc độ mạnh; giấy vẽ mịn.</li>
<li>Khung ngắm / một cây bút hoặc que để <strong>đo tỉ lệ &amp; góc (sighting)</strong>.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học (4 bước)</span>
<ol>
<li><strong>Nhìn</strong> — luyện mắt: vẽ đường viền, khoảng âm, đo so sánh.</li>
<li><strong>Dựng</strong> — dựng vật thể từ các khối cơ bản và phối cảnh đúng.</li>
<li><strong>Diễn khối</strong> — xoay khối bằng 5 sắc độ, từ sáng nhất tới sắc tối lõi &amp; bóng đổ.</li>
<li><strong>Bố cục</strong> — sắp đặt tĩnh vật và đưa từ phác nhỏ tới bài hoàn chỉnh.</li>
</ol></div>`,
  ]]);

const intro = doc('drs102-0-1-overview', 'Course overview: Drawing form & still-life|||Tổng quan: Vẽ khối & tĩnh vật',
  'Vẽ là kỹ năng NHÌN; lộ trình 4 bước (nhìn → dựng → diễn khối → bố cục); 8 chương từ dụng cụ tới bài tĩnh vật hoàn chỉnh; bám giáo trình vẽ chuẩn.',
  [[
    `<span class="eyebrow">DRS102 · Lesson 0.1 · Overview</span>
<h2>Drawing — Form &amp; Still-life</h2>
<p class="lead">This course builds the <strong>foundation of observational drawing</strong>: how to make a two-dimensional mark read as a solid, three-dimensional object in light. It is the bedrock skill for every visual designer — concept art, UI illustration, 3D, animation all start here.</p>
<h3>The one big idea: drawing is a skill of SEEING</h3>
<p>Most beginners draw <em>symbols</em> ("an apple is a red circle") instead of what is actually in front of them. Betty Edwards' insight is that you can train your brain to switch into a <strong>perceptual mode</strong> — to see edges, spaces, relationships and values as they really are. That is the whole game.</p>
<h3>The roadmap (4 steps, 8 chapters)</h3>
<ul>
<li><strong>See</strong> — tools &amp; mark-making (Ch1), line &amp; proportion (Ch2).</li>
<li><strong>Construct</strong> — the basic solids (Ch3), perspective (Ch4).</li>
<li><strong>Render</strong> — light &amp; shadow (Ch5), texture &amp; surface (Ch6).</li>
<li><strong>Compose</strong> — still-life composition (Ch7), a full finished study (Ch8).</li>
</ul>
<div class="callout"><span class="badge">How to succeed</span> Draw <strong>from real objects under a single light</strong>, every session. A photo flattens value and hides form. Miles on the page beat theory — do the exercise at the end of each chapter.</div>`,
    `<span class="eyebrow">DRS102 · Bài 0.1 · Tổng quan</span>
<h2>Hình hoạ — Khối &amp; Tĩnh vật</h2>
<p class="lead">Môn này xây <strong>nền tảng vẽ quan sát</strong>: làm sao để một nét trên mặt phẳng đọc được thành một vật thể khối, ba chiều, nằm trong ánh sáng. Đây là kỹ năng gốc cho mọi nhà thiết kế thị giác — concept art, minh hoạ UI, 3D, hoạt hình đều bắt đầu từ đây.</p>
<h3>Ý tưởng lớn nhất: vẽ là kỹ năng NHÌN</h3>
<p>Người mới thường vẽ theo <em>ký hiệu</em> ("quả táo là hình tròn màu đỏ") thay vì cái thật trước mắt. Phát hiện của Betty Edwards: có thể luyện não chuyển sang <strong>chế độ tri giác</strong> — nhìn cạnh, khoảng, tương quan và sắc độ đúng như chúng vốn có. Đó là toàn bộ vấn đề.</p>
<h3>Lộ trình (4 bước, 8 chương)</h3>
<ul>
<li><strong>Nhìn</strong> — dụng cụ &amp; luyện nét (Ch1), đường nét &amp; tỉ lệ (Ch2).</li>
<li><strong>Dựng</strong> — các khối cơ bản (Ch3), phối cảnh (Ch4).</li>
<li><strong>Diễn khối</strong> — sáng tối (Ch5), chất liệu &amp; bề mặt (Ch6).</li>
<li><strong>Bố cục</strong> — bố cục tĩnh vật (Ch7), một bài hoàn chỉnh (Ch8).</li>
</ul>
<div class="callout"><span class="badge">Cách để giỏi</span> Hãy vẽ <strong>từ vật thật dưới một nguồn sáng duy nhất</strong>, mỗi buổi. Ảnh chụp làm dẹt sắc độ và giấu mất khối. Số giờ đặt bút hơn mọi lý thuyết — hãy làm bài tập cuối mỗi chương.</div>`,
  ]]);

const c1 = doc('drs102-1-1-basics', '1.1 — Drawing basics: tools & mark-making|||1.1 — Cơ bản về vẽ: dụng cụ & luyện nét',
  'Chì graphite vs than, độ cứng H/B; cách cầm bút (overhand vs writing grip); các loại nét; luyện tay/mắt bằng đường thẳng, ellipse, hatching.',
  [[
    `<span class="eyebrow">DRS102 · Chapter 1 · Lesson 1.1</span>
<h2>Drawing basics: tools &amp; mark-making</h2>
<h3>Your two core media</h3>
<ul>
<li><strong>Graphite pencil</strong> — precise, erasable. Graded from <strong>H (hard, light, grey)</strong> to <strong>B (soft, dark, rich)</strong>: 2H for faint construction lines, HB for general work, 4B-6B for the darkest darks.</li>
<li><strong>Charcoal</strong> — softer, blacker, more expressive; ideal for big value studies where you want deep shadow fast.</li>
</ul>
<h3>How to hold the pencil</h3>
<p>Do not use the tight <em>writing grip</em> for everything. The <strong>overhand grip</strong> (pencil laid under the palm, moving from the shoulder) gives loose, light, even strokes for the whole early stage. Switch to the writing grip only for small final details.</p>
<h3>The vocabulary of marks</h3>
<ul>
<li><strong>Line</strong> — vary its weight: press for near/dark edges, lift for far/soft edges.</li>
<li><strong>Hatching &amp; cross-hatching</strong> — parallel (then crossed) lines that build tone; closer lines = darker.</li>
<li><strong>Blending</strong> — a stump or finger to smooth graphite into a gradient (use sparingly — hatching keeps drawings alive).</li>
</ul>
<div class="callout"><span class="badge">Exercise</span> Fill a page with: 20 straight lines drawn from the shoulder (no ruler), 20 ellipses, and a <strong>value strip</strong> of 5 boxes going lightest → darkest using only hatching. Do it daily for a week; this is your handwriting.</div>`,
    `<span class="eyebrow">DRS102 · Chương 1 · Bài 1.1</span>
<h2>Cơ bản về vẽ: dụng cụ &amp; luyện nét</h2>
<h3>Hai chất liệu gốc</h3>
<ul>
<li><strong>Bút chì graphite</strong> — chính xác, tẩy được. Phân độ từ <strong>H (cứng, nhạt, xám)</strong> tới <strong>B (mềm, đậm, giàu)</strong>: 2H cho nét dựng mờ, HB cho nét chung, 4B-6B cho chỗ tối nhất.</li>
<li><strong>Than</strong> — mềm hơn, đen hơn, biểu cảm hơn; hợp cho bài sắc độ lớn khi cần bóng sâu nhanh.</li>
</ul>
<h3>Cách cầm bút</h3>
<p>Đừng dùng kiểu <em>cầm viết</em> chặt cho mọi thứ. Kiểu <strong>cầm ngửa (overhand)</strong> (bút nằm dưới lòng bàn tay, chuyển động từ vai) cho nét lỏng, nhẹ, đều suốt giai đoạn đầu. Chỉ đổi sang cầm viết cho chi tiết nhỏ cuối cùng.</p>
<h3>Bộ từ vựng của nét</h3>
<ul>
<li><strong>Đường nét</strong> — thay đổi độ đậm: nhấn cho cạnh gần/tối, nhấc tay cho cạnh xa/mềm.</li>
<li><strong>Đánh bóng gạch (hatching &amp; cross-hatching)</strong> — nét song song (rồi chéo) để dựng sắc độ; nét càng khít càng tối.</li>
<li><strong>Di chì (blending)</strong> — dùng cây di hoặc ngón tay tạo chuyển mượt (dùng vừa phải — hatching giữ tranh có sức sống).</li>
</ul>
<div class="callout"><span class="badge">Bài tập</span> Kín một trang với: 20 đường thẳng vẽ từ vai (không dùng thước), 20 ellipse, và một <strong>dải sắc độ</strong> 5 ô từ nhạt nhất → tối nhất chỉ bằng hatching. Làm mỗi ngày một tuần; đây là "chữ viết tay" của bạn.</div>`,
  ]]);

const c1q = quiz('drs102-quiz-1', 'Quiz 1 — Basics & tools|||Quiz 1 — Cơ bản & dụng cụ', [
  { id: 'q1', question: 'Bút chì loại nào cho nét ĐẬM, mềm nhất?', options: ['2H', 'HB', '6B', 'F'], correctIndex: 2, explanation: 'B = soft/black; số càng lớn càng mềm và đậm (6B đậm hơn HB, 2H).' },
  { id: 'q2', question: 'Kiểu cầm bút nào hợp cho nét lỏng, nhẹ, chuyển động từ vai ở giai đoạn đầu?', options: ['Cầm viết (writing grip) chặt', 'Cầm ngửa (overhand grip)', 'Kẹp giữa hai ngón út', 'Không có kiểu nào'], correctIndex: 1, explanation: 'Overhand grip cho nét đều, nhẹ; cầm viết chỉ dùng cho chi tiết nhỏ cuối.' },
  { id: 'q3', question: 'Hatching là kỹ thuật gì?', options: ['Tẩy sáng', 'Dựng sắc độ bằng các nét song song (đậm hơn khi nét khít)', 'Đo tỉ lệ', 'Vẽ khung ngắm'], correctIndex: 1, explanation: 'Hatching/cross-hatching dùng nét song song và chéo để tạo tông; nét càng khít càng tối.' },
]);

const c2 = doc('drs102-2-1-line-proportion', '2.1 — Line & proportion|||2.1 — Đường nét & tỉ lệ',
  'Contour drawing, negative space; đo tỉ lệ bằng sighting (đơn vị đo, so sánh), đo góc bằng đồng hồ; dựng hình từ nét dựng nhẹ tới nét chắc.',
  [[
    `<span class="eyebrow">DRS102 · Chapter 2 · Lesson 2.1</span>
<h2>Line &amp; proportion</h2>
<h3>Two ways to see edges</h3>
<ul>
<li><strong>Contour drawing</strong> — draw the object's edges slowly, eyes mostly on the subject, as one continuous line. It forces you to record what you see, not a symbol.</li>
<li><strong>Negative space</strong> — draw the <em>shapes of the gaps</em> around and between objects. The brain has no symbol for "the space beside a jug", so it draws it accurately.</li>
</ul>
<h3>Sighting — measuring proportion by eye</h3>
<p>Hold a pencil at arm's length, lock your elbow, and use the tip-to-thumb distance as a <strong>unit of measure</strong>. Pick one feature as "1 unit" (e.g. the width of the cup), then ask: how many units tall? How many wide? This <strong>comparative measuring</strong> is the single most reliable way to get proportion right.</p>
<pre><code>Sighting an angle:
 1. Hold the pencil so it lies ALONG the edge you see
 2. Keep that angle fixed, move the pencil to the paper
 3. Copy the same tilt -> the angle is correct
</code></pre>
<h3>Build from light to firm</h3>
<p>Start with faint <strong>construction lines</strong> (2H) to place big proportions and angles. Only when they check out do you commit darker, confident contour lines over them. Never start dark.</p>
<div class="callout"><span class="badge">Exercise</span> Draw a mug using ONLY sighting: mark its total height, then measure the width in "heights", the ellipse of the rim, and the handle's position — all by comparative units — before drawing a single finished line.</div>`,
    `<span class="eyebrow">DRS102 · Chương 2 · Bài 2.1</span>
<h2>Đường nét &amp; tỉ lệ</h2>
<h3>Hai cách nhìn cạnh</h3>
<ul>
<li><strong>Vẽ đường viền (contour)</strong> — vẽ cạnh vật thật chậm, mắt chủ yếu nhìn mẫu, thành một nét liền. Nó buộc bạn ghi lại cái thấy, không phải ký hiệu.</li>
<li><strong>Khoảng âm (negative space)</strong> — vẽ <em>hình của các khoảng trống</em> quanh và giữa các vật. Não không có ký hiệu cho "khoảng cạnh cái bình" nên nó vẽ chính xác.</li>
</ul>
<h3>Sighting — đo tỉ lệ bằng mắt</h3>
<p>Giơ bút thẳng tay, khoá khuỷu, dùng khoảng từ đầu bút tới ngón cái làm <strong>đơn vị đo</strong>. Chọn một chi tiết làm "1 đơn vị" (vd bề ngang cái cốc), rồi hỏi: cao mấy đơn vị? rộng mấy đơn vị? <strong>Đo so sánh</strong> này là cách đáng tin nhất để lấy đúng tỉ lệ.</p>
<pre><code>Đo một góc:
 1. Giơ bút nằm DỌC THEO cạnh đang thấy
 2. Giữ nguyên góc đó, đưa bút về giấy
 3. Chép lại đúng độ nghiêng -> góc chính xác
</code></pre>
<h3>Dựng từ nhẹ tới chắc</h3>
<p>Bắt đầu bằng <strong>nét dựng</strong> thật mờ (2H) để đặt tỉ lệ lớn và các góc. Chỉ khi chúng khớp mới đè nét viền đậm, chắc chắn lên trên. Đừng bao giờ vẽ đậm ngay.</p>
<div class="callout"><span class="badge">Bài tập</span> Vẽ một cái cốc CHỈ bằng sighting: đánh dấu chiều cao tổng, rồi đo bề ngang theo "chiều cao", ellipse của miệng cốc, và vị trí quai — tất cả bằng đơn vị so sánh — trước khi vẽ nét hoàn chỉnh đầu tiên.</div>`,
  ]]);

const c2q = quiz('drs102-quiz-2', 'Quiz 2 — Line & proportion|||Quiz 2 — Đường nét & tỉ lệ', [
  { id: 'q1', question: 'Vẽ "khoảng âm" (negative space) nghĩa là vẽ?', options: ['Bóng đổ của vật', 'Hình của các khoảng trống quanh/giữa vật', 'Chỉ đường viền ngoài', 'Màu nền tối'], correctIndex: 1, explanation: 'Vẽ hình của khoảng trống giúp tránh ký hiệu và lấy đúng hình.' },
  { id: 'q2', question: 'Kỹ thuật "sighting" dùng cây bút giơ thẳng tay để?', options: ['Tô bóng', 'Đo tỉ lệ và góc bằng đơn vị so sánh', 'Làm mịn nét', 'Xoá nét dựng'], correctIndex: 1, explanation: 'Sighting = đo tỉ lệ/góc bằng mắt, dùng đơn vị so sánh với khuỷu khoá.' },
  { id: 'q3', question: 'Nên bắt đầu bài vẽ bằng?', options: ['Nét đậm, chắc ngay từ đầu', 'Nét dựng mờ (2H) đặt tỉ lệ/góc trước', 'Tô toàn bộ bóng tối', 'Chi tiết nhỏ nhất'], correctIndex: 1, explanation: 'Dựng nhẹ trước, kiểm tra tỉ lệ, rồi mới đè nét chắc.' },
]);

const c3 = doc('drs102-3-1-basic-forms', '3.1 — The basic solids|||3.1 — Hình khối cơ bản',
  'Bốn khối gốc (lập phương, cầu, trụ, nón); mọi vật quy về tổ hợp khối; dựng khối 3D bằng ellipse, trục, và mặt; tư duy khối trước bề mặt.',
  [[
    `<span class="eyebrow">DRS102 · Chapter 3 · Lesson 3.1</span>
<h2>The basic solids</h2>
<h3>Four shapes build everything</h3>
<p>Almost any object can be understood as a combination of four <strong>primitive solids</strong>: the <strong>cube</strong>, the <strong>sphere</strong>, the <strong>cylinder</strong> and the <strong>cone</strong>. A mug is a cylinder; an apple is a sphere; a bottle is a cylinder plus a cone plus a smaller cylinder. Seeing these <em>underneath</em> the surface is the key to drawing solid, believable objects.</p>
<h3>Drawing a solid, not an outline</h3>
<ul>
<li><strong>Cylinder</strong> — draw a central <strong>axis</strong>, then an <strong>ellipse</strong> at each end (the far ellipse is the same width but you still draw its full curve). The ellipse opens up as it drops below eye level.</li>
<li><strong>Cube</strong> — draw the front face, then the receding edges toward vanishing points; keep parallel edges parallel in your mind.</li>
<li><strong>Sphere</strong> — a circle, but think of the <strong>cross-contour</strong> lines wrapping around it to feel the volume.</li>
</ul>
<pre><code>Cylinder construction:
  |   <- axis (centre line)
 ( )  <- top ellipse
 | |  <- straight sides, equal to the ellipse width
 (_)  <- bottom ellipse, opens MORE than the top
</code></pre>
<div class="callout"><span class="badge">Exercise</span> Draw a cube, sphere, cylinder and cone, each as a see-through <strong>wireframe</strong> (draw the hidden back edges too). Then pick 3 objects on your desk and reduce each to its underlying solids in a quick sketch.</div>`,
    `<span class="eyebrow">DRS102 · Chương 3 · Bài 3.1</span>
<h2>Hình khối cơ bản</h2>
<h3>Bốn khối dựng nên mọi thứ</h3>
<p>Gần như mọi vật thể có thể hiểu là tổ hợp của bốn <strong>khối gốc</strong>: <strong>lập phương</strong>, <strong>cầu</strong>, <strong>trụ</strong> và <strong>nón</strong>. Cái cốc là khối trụ; quả táo là khối cầu; cái chai là trụ cộng nón cộng một trụ nhỏ. Nhìn thấy các khối này <em>nằm dưới</em> bề mặt là chìa khoá để vẽ vật thể chắc, có sức thuyết phục.</p>
<h3>Vẽ khối, không vẽ đường viền</h3>
<ul>
<li><strong>Khối trụ</strong> — vẽ một <strong>trục</strong> giữa, rồi một <strong>ellipse</strong> ở mỗi đầu (ellipse xa cùng bề ngang nhưng vẫn vẽ trọn đường cong). Ellipse mở rộng hơn khi hạ xuống dưới tầm mắt.</li>
<li><strong>Khối lập phương</strong> — vẽ mặt trước, rồi các cạnh lùi về điểm tụ; giữ các cạnh song song trong đầu.</li>
<li><strong>Khối cầu</strong> — một hình tròn, nhưng hãy nghĩ tới các nét <strong>cross-contour</strong> quấn quanh để cảm được thể tích.</li>
</ul>
<pre><code>Dựng khối trụ:
  |   <- trục (đường tâm)
 ( )  <- ellipse trên
 | |  <- cạnh thẳng, bằng bề ngang ellipse
 (_)  <- ellipse dưới, mở RỘNG hơn ellipse trên
</code></pre>
<div class="callout"><span class="badge">Bài tập</span> Vẽ khối lập phương, cầu, trụ, nón, mỗi khối dạng <strong>khung dây trong suốt</strong> (vẽ cả cạnh sau bị khuất). Rồi chọn 3 vật trên bàn và quy mỗi vật về các khối nền trong một bản phác nhanh.</div>`,
  ]]);

const c3q = quiz('drs102-quiz-3', 'Quiz 3 — Basic solids|||Quiz 3 — Hình khối cơ bản', [
  { id: 'q1', question: 'Bốn khối cơ bản mà mọi vật quy về là?', options: ['Vuông, tròn, tam giác, sao', 'Lập phương, cầu, trụ, nón', 'Trụ, ống, hộp, đĩa', 'Cầu, kim tự tháp, xoắn, sóng'], correctIndex: 1, explanation: 'Cube, sphere, cylinder, cone — bốn khối gốc dựng nên hầu hết vật thể.' },
  { id: 'q2', question: 'Khi dựng khối trụ, hai đầu được vẽ bằng?', options: ['Hai đường thẳng', 'Hai ellipse quanh một trục', 'Hai hình vuông', 'Hai hình tam giác'], correctIndex: 1, explanation: 'Trụ = trục giữa + ellipse ở mỗi đầu; ellipse mở hơn khi xuống dưới tầm mắt.' },
  { id: 'q3', question: 'Vẽ vật thể dạng "khung dây trong suốt" (cả cạnh khuất) để?', options: ['Tiết kiệm chì', 'Hiểu và cảm được khối 3D thật', 'Tránh phải tô bóng', 'Làm nhanh hơn'], correctIndex: 1, explanation: 'Vẽ cả cạnh sau ép ta tư duy thể tích 3D, không chỉ đường viền phẳng.' },
]);

const c4 = doc('drs102-4-1-perspective', '4.1 — Perspective|||4.1 — Phối cảnh',
  'Đường chân trời & điểm tụ; phối cảnh 1, 2, 3 điểm tụ; foreshortening (rút gọn); vật càng xa càng nhỏ và cạnh hội tụ về điểm tụ.',
  [[
    `<span class="eyebrow">DRS102 · Chapter 4 · Lesson 4.1</span>
<h2>Perspective</h2>
<h3>The two anchors: horizon &amp; vanishing point</h3>
<p>The <strong>horizon line</strong> is always at your <em>eye level</em>. Parallel edges that recede from you appear to converge and meet at a <strong>vanishing point (VP)</strong> on that line. This is why a road narrows in the distance and why the far end of a table looks shorter than the near end.</p>
<h3>One, two &amp; three point</h3>
<ul>
<li><strong>1-point</strong> — you face a cube's front square-on; only the depth edges recede to a single VP. Good for a box seen straight ahead, a corridor.</li>
<li><strong>2-point</strong> — you see a cube by its corner; the two sets of side edges recede to two VPs, left and right. The default for most still-life boxes.</li>
<li><strong>3-point</strong> — add a third VP above or below for strong looking-up/looking-down views; vertical edges also converge.</li>
</ul>
<h3>Foreshortening</h3>
<p>When a form points toward you, its length appears <strong>compressed</strong> — a cylinder aimed at the viewer becomes a near-circle. Trust sighting over what you "know" the length to be: measure the shortened dimension against the width.</p>
<div class="callout"><span class="badge">Exercise</span> Draw the same open box in 1-point and then 2-point perspective, ruling the receding edges back to marked VPs on a horizon line. Then draw a cylinder tilted toward you and observe how its ellipses fatten.</div>`,
    `<span class="eyebrow">DRS102 · Chương 4 · Bài 4.1</span>
<h2>Phối cảnh</h2>
<h3>Hai mốc: đường chân trời &amp; điểm tụ</h3>
<p><strong>Đường chân trời</strong> luôn nằm ở <em>tầm mắt</em> của bạn. Các cạnh song song lùi ra xa trông như hội tụ và gặp nhau tại một <strong>điểm tụ (VP)</strong> trên đường đó. Vì thế con đường thu hẹp về xa, và đầu xa của cái bàn trông ngắn hơn đầu gần.</p>
<h3>Một, hai &amp; ba điểm tụ</h3>
<ul>
<li><strong>1 điểm tụ</strong> — bạn nhìn thẳng mặt trước khối hộp; chỉ các cạnh chiều sâu lùi về một VP duy nhất. Hợp cho hộp nhìn thẳng, hành lang.</li>
<li><strong>2 điểm tụ</strong> — bạn nhìn khối hộp theo góc cạnh; hai bộ cạnh bên lùi về hai VP, trái và phải. Mặc định cho hầu hết hộp trong tĩnh vật.</li>
<li><strong>3 điểm tụ</strong> — thêm VP thứ ba ở trên hoặc dưới cho góc nhìn lên/xuống mạnh; cạnh dọc cũng hội tụ.</li>
</ul>
<h3>Foreshortening (rút gọn)</h3>
<p>Khi một khối chĩa về phía bạn, chiều dài của nó trông <strong>bị nén</strong> — một khối trụ hướng thẳng vào người xem gần thành hình tròn. Hãy tin vào sighting hơn cái bạn "biết" độ dài là bao nhiêu: đo chiều bị rút gọn so với bề ngang.</p>
<div class="callout"><span class="badge">Bài tập</span> Vẽ cùng một hộp mở theo phối cảnh 1 điểm rồi 2 điểm, kẻ các cạnh lùi về các VP đã đánh dấu trên đường chân trời. Rồi vẽ một khối trụ nghiêng về phía bạn và quan sát các ellipse phình ra.</div>`,
  ]]);

const c4q = quiz('drs102-quiz-4', 'Quiz 4 — Perspective|||Quiz 4 — Phối cảnh', [
  { id: 'q1', question: 'Đường chân trời (horizon line) luôn nằm ở?', options: ['Đáy tranh', 'Tầm mắt của người vẽ', 'Đỉnh tranh', 'Giữa vật thể'], correctIndex: 1, explanation: 'Horizon line = eye level; các cạnh lùi hội tụ về điểm tụ nằm trên nó.' },
  { id: 'q2', question: 'Nhìn một khối hộp theo GÓC CẠNH, hai bộ cạnh bên lùi về hai điểm tụ là phối cảnh?', options: ['1 điểm tụ', '2 điểm tụ', '3 điểm tụ', 'Không có điểm tụ'], correctIndex: 1, explanation: '2 điểm tụ: hai bộ cạnh bên hội tụ về hai VP trái/phải — mặc định cho hộp tĩnh vật.' },
  { id: 'q3', question: 'Foreshortening (rút gọn) là hiện tượng?', options: ['Vật xa sáng hơn', 'Chiều dài khối chĩa về người xem bị nén lại', 'Bóng đổ dài ra', 'Màu nhạt dần về xa'], correctIndex: 1, explanation: 'Khối hướng về phía người xem trông ngắn/nén; đo bằng sighting thay vì trí nhớ.' },
]);

const c5 = doc('drs102-5-1-light-shadow', '5.1 — Light, shadow & form|||5.1 — Sáng tối & khối',
  '5 sắc độ (highlight, ánh sáng, halftone, sắc tối lõi/core shadow, phản quang); form shadow vs cast shadow; chuyển sắc mượt để xoay khối; một nguồn sáng.',
  [[
    `<span class="eyebrow">DRS102 · Chapter 5 · Lesson 5.1</span>
<h2>Light, shadow &amp; form</h2>
<h3>Value turns a shape into a form</h3>
<p>Line describes an <em>edge</em>; <strong>value</strong> (light and dark) describes a <em>volume</em>. Under a single light source, a rounded form shows a predictable ladder of tones — learn it once and you can render any object.</p>
<h3>The 5 values on a sphere</h3>
<ol>
<li><strong>Highlight</strong> — the brightest spot, where light hits most directly.</li>
<li><strong>Light / halftone</strong> — the lit side turning gently toward mid-tone.</li>
<li><strong>Core shadow</strong> — the darkest band ON the object, where the light can no longer reach (the terminator).</li>
<li><strong>Reflected light</strong> — a faint glow inside the shadow, bounced from the surface nearby. Keep it darker than any lit tone.</li>
<li><strong>Cast shadow</strong> — the shadow the object throws ONTO the surface; darkest and sharpest right where the object meets the ground.</li>
</ol>
<h3>Form shadow vs cast shadow</h3>
<p><strong>Form shadow</strong> is on the object and has a <em>soft</em> edge (the surface curves away gradually). <strong>Cast shadow</strong> is on the ground and has a <em>harder</em> edge near its source. Mixing these up is the number-one reason drawings look flat.</p>
<div class="callout"><span class="badge">Exercise</span> Light a white egg or ball with a single lamp in a dark room. Draw all 5 values as clean bands first, then blend the transitions on the lit side while keeping the core shadow crisp. Squint to see the values simplified.</div>`,
    `<span class="eyebrow">DRS102 · Chương 5 · Bài 5.1</span>
<h2>Sáng tối &amp; khối</h2>
<h3>Sắc độ biến hình phẳng thành khối</h3>
<p>Đường nét tả <em>cạnh</em>; <strong>sắc độ</strong> (sáng và tối) tả <em>thể tích</em>. Dưới một nguồn sáng duy nhất, một khối tròn cho một bậc thang sắc độ có quy luật — học một lần là diễn được mọi vật.</p>
<h3>5 sắc độ trên khối cầu</h3>
<ol>
<li><strong>Highlight (điểm sáng nhất)</strong> — nơi sáng chiếu trực diện nhất.</li>
<li><strong>Ánh sáng / halftone</strong> — mặt sáng chuyển dịu dần về trung gian.</li>
<li><strong>Sắc tối lõi (core shadow)</strong> — dải tối nhất TRÊN vật, nơi ánh sáng không tới được (đường phân giới).</li>
<li><strong>Phản quang (reflected light)</strong> — ánh mờ trong vùng tối, dội lại từ bề mặt gần đó. Luôn giữ nó tối hơn mọi sắc bên phía sáng.</li>
<li><strong>Bóng đổ (cast shadow)</strong> — bóng vật hắt XUỐNG bề mặt; tối và sắc nét nhất ngay chỗ vật chạm nền.</li>
</ol>
<h3>Form shadow và cast shadow</h3>
<p><strong>Form shadow (bóng trên khối)</strong> nằm trên vật và có cạnh <em>mềm</em> (mặt cong lùi dần). <strong>Cast shadow (bóng đổ)</strong> nằm trên nền và có cạnh <em>cứng hơn</em> gần gốc. Nhầm lẫn hai loại này là lý do số một khiến tranh trông dẹt.</p>
<div class="callout"><span class="badge">Bài tập</span> Chiếu một quả trứng hoặc quả bóng trắng bằng một đèn duy nhất trong phòng tối. Vẽ đủ 5 sắc độ thành các dải rõ trước, rồi làm mượt các chuyển tiếp phía sáng nhưng giữ core shadow sắc. Nheo mắt để thấy sắc độ giản lược.</div>`,
  ]]);

const c5q = quiz('drs102-quiz-5', 'Quiz 5 — Light & shadow|||Quiz 5 — Sáng tối & khối', [
  { id: 'q1', question: 'Dải TỐI NHẤT nằm TRÊN vật, nơi ánh sáng không còn tới được, gọi là?', options: ['Highlight', 'Cast shadow', 'Core shadow (sắc tối lõi)', 'Reflected light'], correctIndex: 2, explanation: 'Core shadow (terminator) là vùng tối nhất trên vật, ranh giới sáng/tối.' },
  { id: 'q2', question: 'Khác nhau cơ bản giữa form shadow và cast shadow?', options: ['Không khác gì', 'Form shadow trên khối cạnh mềm; cast shadow trên nền cạnh cứng hơn', 'Cast shadow luôn sáng hơn', 'Form shadow nằm trên nền'], correctIndex: 1, explanation: 'Form shadow trên vật (cạnh mềm); cast shadow hắt xuống nền (cạnh cứng gần gốc).' },
  { id: 'q3', question: 'Reflected light (phản quang) trong vùng tối nên được vẽ?', options: ['Sáng hơn mặt sáng', 'Tối hơn mọi sắc bên phía sáng', 'Trắng hoàn toàn', 'Bằng highlight'], correctIndex: 1, explanation: 'Phản quang phải tối hơn mọi tông phía sáng, nếu không vật mất khối.' },
]);

const c6 = doc('drs102-6-1-texture-surface', '6.1 — Texture & surface|||6.1 — Chất liệu & bề mặt',
  'Diễn chất liệu: kim loại (tương phản gắt, phản chiếu sắc), thuỷ tinh (trong, méo nền), vải (nếp gấp mềm), gỗ (vân, tông ấm); chất liệu = cách bề mặt xử lý ánh sáng.',
  [[
    `<span class="eyebrow">DRS102 · Chapter 6 · Lesson 6.1</span>
<h2>Texture &amp; surface</h2>
<h3>Texture is how a surface handles light</h3>
<p>You do not draw "metal" — you draw the <em>way metal reflects light</em>. Every material is really a pattern of value, edge and reflection. Get those right and the material reads by itself.</p>
<ul>
<li><strong>Metal</strong> — very <em>high contrast</em>: bright, sharp highlights slammed against dark reflections, with hard edges between them. It mirrors its surroundings.</li>
<li><strong>Glass</strong> — mostly transparent: you see the background <em>distorted</em> through it, plus a few crisp highlights and dark refracted edges. Draw what is behind it, warped.</li>
<li><strong>Cloth / fabric</strong> — <em>soft</em> edges and gentle value shifts; the folds follow the form beneath. Show a few big folds, not every wrinkle.</li>
<li><strong>Wood</strong> — mid-contrast, warm; grain lines follow the surface and bend around edges; matte, so highlights are broad and soft.</li>
</ul>
<h3>Reflection &amp; the key rule</h3>
<p>Shiny surfaces (metal, glass, glaze) show sharp reflections; matte surfaces (cloth, wood, clay) show soft, gradual value. <strong>The shinier the surface, the higher the contrast and the harder the edges.</strong></p>
<div class="callout"><span class="badge">Exercise</span> Set up a metal spoon, a glass, and a folded cloth under one light. Draw a small study of each, focusing only on getting the <em>edge quality</em> (hard vs soft) and the <em>contrast level</em> right.</div>`,
    `<span class="eyebrow">DRS102 · Chương 6 · Bài 6.1</span>
<h2>Chất liệu &amp; bề mặt</h2>
<h3>Chất liệu là cách bề mặt xử lý ánh sáng</h3>
<p>Bạn không vẽ "kim loại" — bạn vẽ <em>cách kim loại phản chiếu ánh sáng</em>. Mọi vật liệu thực ra là một mẫu hình của sắc độ, cạnh và phản chiếu. Làm đúng những thứ đó thì chất liệu tự đọc được.</p>
<ul>
<li><strong>Kim loại</strong> — <em>tương phản rất cao</em>: điểm sáng chói, sắc, đặt cạnh mảng phản chiếu tối, cạnh giữa chúng cứng. Nó soi bóng môi trường xung quanh.</li>
<li><strong>Thuỷ tinh</strong> — phần lớn trong suốt: bạn thấy nền <em>bị méo</em> qua nó, cộng vài điểm sáng sắc và cạnh khúc xạ tối. Hãy vẽ cái phía sau nó, bị bóp méo.</li>
<li><strong>Vải</strong> — cạnh <em>mềm</em> và chuyển sắc dịu; nếp gấp bám theo khối bên dưới. Diễn vài nếp gấp lớn, đừng vẽ từng nếp nhăn.</li>
<li><strong>Gỗ</strong> — tương phản trung bình, ấm; vân gỗ bám mặt và uốn quanh cạnh; nhám nên điểm sáng rộng và mềm.</li>
</ul>
<h3>Phản chiếu &amp; quy tắc then chốt</h3>
<p>Bề mặt bóng (kim loại, thuỷ tinh, men) cho phản chiếu sắc; bề mặt nhám (vải, gỗ, đất) cho sắc độ mềm, chuyển dần. <strong>Càng bóng thì tương phản càng cao và cạnh càng cứng.</strong></p>
<div class="callout"><span class="badge">Bài tập</span> Bày một cái thìa kim loại, một cái cốc thuỷ tinh, và một mảnh vải gấp dưới một nguồn sáng. Vẽ một bài nhỏ cho mỗi vật, chỉ tập trung lấy đúng <em>chất cạnh</em> (cứng/mềm) và <em>mức tương phản</em>.</div>`,
  ]]);

const c6q = quiz('drs102-quiz-6', 'Quiz 6 — Texture & surface|||Quiz 6 — Chất liệu & bề mặt', [
  { id: 'q1', question: 'Đặc trưng của diễn KIM LOẠI so với vải?', options: ['Tương phản thấp, cạnh mềm', 'Tương phản rất cao, cạnh cứng, phản chiếu sắc', 'Không có điểm sáng', 'Luôn tối đều'], correctIndex: 1, explanation: 'Kim loại bóng: highlight chói cạnh mảng tối, cạnh cứng; nó soi bóng xung quanh.' },
  { id: 'q2', question: 'Để diễn THUỶ TINH trong suốt, chủ yếu ta vẽ?', options: ['Màu đặc bên trong', 'Cái nền phía sau bị méo qua nó + vài điểm sáng sắc', 'Bóng đổ rất dài', 'Vân bề mặt'], correctIndex: 1, explanation: 'Thuỷ tinh trong: vẽ nền bị bóp méo qua nó cộng highlight và cạnh khúc xạ.' },
  { id: 'q3', question: 'Quy tắc chung: bề mặt càng BÓNG thì?', options: ['Tương phản càng thấp, cạnh càng mềm', 'Tương phản càng cao, cạnh càng cứng', 'Không đổi gì', 'Càng ít điểm sáng'], correctIndex: 1, explanation: 'Càng bóng → tương phản cao, cạnh cứng; càng nhám → sắc mềm, chuyển dần.' },
]);

const c7 = doc('drs102-7-1-composition', '7.1 — Still-life composition|||7.1 — Bố cục tĩnh vật',
  'Sắp đặt nhóm vật; quy tắc 1/3 & tỉ lệ vàng; điểm nhấn (focal point) bằng tương phản; số lẻ, chồng lấn tạo chiều sâu; dẫn mắt & khoảng nghỉ.',
  [[
    `<span class="eyebrow">DRS102 · Chapter 7 · Lesson 7.1</span>
<h2>Still-life composition</h2>
<h3>Arrange before you draw</h3>
<p>A still-life is <em>designed</em>, not found. Before touching the paper, move the objects until the group itself is interesting. A few reliable principles:</p>
<ul>
<li><strong>Rule of thirds &amp; the golden ratio</strong> — place the main object off-centre, near a third-line or a golden-section point, not dead centre.</li>
<li><strong>Odd numbers &amp; grouping</strong> — three objects usually beat two or four; cluster a group and leave breathing space rather than spreading evenly.</li>
<li><strong>Overlap for depth</strong> — let objects overlap so the eye reads front-to-back; isolated objects look flat and disconnected.</li>
<li><strong>Vary the sizes</strong> — a tall, a medium and a small object make a stronger silhouette than three of the same height.</li>
</ul>
<h3>The focal point</h3>
<p>Decide <strong>one</strong> centre of interest and lead the eye to it — usually with the <em>highest contrast</em> (lightest light next to darkest dark) and the sharpest detail. Everything else supports it and stays quieter.</p>
<div class="callout"><span class="badge">Exercise</span> Do four small <strong>thumbnail</strong> sketches (matchbox-sized) of the SAME three objects in different arrangements and croppings. Pick the strongest — best focal point, best balance of shapes and negative space — before starting the full drawing.</div>`,
    `<span class="eyebrow">DRS102 · Chương 7 · Bài 7.1</span>
<h2>Bố cục tĩnh vật</h2>
<h3>Sắp đặt trước khi vẽ</h3>
<p>Tĩnh vật là thứ được <em>thiết kế</em>, không phải nhặt được. Trước khi chạm giấy, hãy xê dịch các vật cho tới khi bản thân nhóm vật đã thú vị. Vài nguyên tắc đáng tin:</p>
<ul>
<li><strong>Quy tắc 1/3 &amp; tỉ lệ vàng</strong> — đặt vật chính lệch tâm, gần đường chia ba hoặc điểm tỉ lệ vàng, đừng đặt chính giữa.</li>
<li><strong>Số lẻ &amp; gom nhóm</strong> — ba vật thường hơn hai hoặc bốn; gom một cụm và chừa khoảng thở, đừng rải đều.</li>
<li><strong>Chồng lấn tạo chiều sâu</strong> — để vật chồng lên nhau cho mắt đọc trước-sau; vật tách rời trông dẹt và rời rạc.</li>
<li><strong>Thay đổi kích cỡ</strong> — một vật cao, một vừa, một nhỏ cho bóng dáng mạnh hơn ba vật cùng chiều cao.</li>
</ul>
<h3>Điểm nhấn (focal point)</h3>
<p>Chọn <strong>một</strong> trung tâm chú ý và dẫn mắt tới đó — thường bằng <em>tương phản mạnh nhất</em> (sáng nhất cạnh tối nhất) và chi tiết sắc nhất. Mọi thứ còn lại hỗ trợ nó và giữ lặng hơn.</p>
<div class="callout"><span class="badge">Bài tập</span> Vẽ bốn bản <strong>phác nhỏ (thumbnail)</strong> cỡ bao diêm của CÙNG ba vật với các cách sắp đặt và cắt khung khác nhau. Chọn bản mạnh nhất — điểm nhấn tốt nhất, cân bằng hình và khoảng âm tốt nhất — trước khi bắt đầu bài lớn.</div>`,
  ]]);

const c7q = quiz('drs102-quiz-7', 'Quiz 7 — Composition|||Quiz 7 — Bố cục', [
  { id: 'q1', question: 'Theo quy tắc 1/3 & tỉ lệ vàng, vật chính nên đặt?', options: ['Chính giữa tranh', 'Lệch tâm, gần đường chia ba/điểm tỉ lệ vàng', 'Sát mép trái', 'Ở góc dưới cùng'], correctIndex: 1, explanation: 'Đặt lệch tâm tạo bố cục sinh động hơn; giữa tranh thường tĩnh và kém hấp dẫn.' },
  { id: 'q2', question: 'Điểm nhấn (focal point) thường được tạo bằng?', options: ['Tương phản mạnh nhất và chi tiết sắc nhất', 'Vùng mờ nhất', 'Khoảng trống lớn nhất', 'Màu nhạt đều'], correctIndex: 0, explanation: 'Sáng nhất cạnh tối nhất + chi tiết sắc dẫn mắt tới trung tâm chú ý.' },
  { id: 'q3', question: 'Cho vật chồng lấn (overlap) nhau nhằm?', options: ['Tiết kiệm giấy', 'Tạo chiều sâu, cho mắt đọc trước-sau', 'Làm tranh phẳng hơn', 'Giảm số vật phải vẽ'], correctIndex: 1, explanation: 'Chồng lấn giúp đọc quan hệ trước-sau; vật tách rời trông dẹt, rời rạc.' },
]);

const c8 = doc('drs102-8-1-still-life-study', '8.1 — A complete still-life study|||8.1 — Bài tĩnh vật hoàn chỉnh',
  'Quy trình 5 bước: bố cục/phác → dựng khối & tỉ lệ (sighting) → block-in sắc lớn → diễn khối & chất liệu → hoàn thiện (tương phản, cạnh, điểm nhấn); tổng hợp cả 7 chương.',
  [[
    `<span class="eyebrow">DRS102 · Chapter 8 · Lesson 8.1</span>
<h2>A complete still-life study</h2>
<p class="lead">Now assemble everything. A finished still-life is built in <strong>ordered stages, general to specific</strong> — you never "finish" one corner while the rest is blank.</p>
<h3>The 5-stage process</h3>
<ol>
<li><strong>Compose &amp; thumbnail</strong> — arrange the objects (Ch7), pick the best thumbnail, decide the crop and the focal point.</li>
<li><strong>Construct &amp; measure</strong> — lay in faint construction lines: reduce each object to its solids (Ch3), fix proportions and angles by sighting (Ch2), check perspective (Ch4).</li>
<li><strong>Block in the big values</strong> — squint and separate the whole scene into just <em>light, mid, dark</em>. Fill the shadow shapes as flat masses first; do not chase detail yet.</li>
<li><strong>Model the form</strong> — develop the 5 values within each object (Ch5), give each material its edge quality and contrast (Ch6). Work the whole picture up together.</li>
<li><strong>Finish</strong> — push the darkest darks and lightest lights at the focal point, sharpen a few key edges, soften the rest, add the cast shadows that tie objects to the ground. Stop before you overwork it.</li>
</ol>
<div class="callout"><span class="badge">Final exercise</span> Set up 3 objects of different materials under one light. Carry a full study through all 5 stages in one sitting. Then critique it: is there a clear focal point? Do the objects sit in space? Is the value range full (a true white and a true black)?</div>`,
    `<span class="eyebrow">DRS102 · Chương 8 · Bài 8.1</span>
<h2>Bài tĩnh vật hoàn chỉnh</h2>
<p class="lead">Giờ ghép tất cả lại. Một bài tĩnh vật hoàn chỉnh được dựng theo <strong>các giai đoạn có thứ tự, từ tổng thể tới chi tiết</strong> — không bao giờ "hoàn thiện" một góc khi phần còn lại vẫn trống.</p>
<h3>Quy trình 5 giai đoạn</h3>
<ol>
<li><strong>Bố cục &amp; phác nhỏ</strong> — sắp đặt các vật (Ch7), chọn thumbnail tốt nhất, quyết định khung cắt và điểm nhấn.</li>
<li><strong>Dựng &amp; đo</strong> — đặt nét dựng mờ: quy mỗi vật về các khối (Ch3), lấy đúng tỉ lệ và góc bằng sighting (Ch2), kiểm phối cảnh (Ch4).</li>
<li><strong>Block-in sắc độ lớn</strong> — nheo mắt và tách cả cảnh thành chỉ <em>sáng, trung, tối</em>. Tô các mảng bóng thành khối phẳng trước; chưa đuổi theo chi tiết.</li>
<li><strong>Diễn khối</strong> — phát triển 5 sắc độ trong từng vật (Ch5), cho mỗi chất liệu đúng chất cạnh và mức tương phản (Ch6). Nâng cả bức lên cùng lúc.</li>
<li><strong>Hoàn thiện</strong> — đẩy chỗ tối nhất và sáng nhất tại điểm nhấn, làm sắc vài cạnh then chốt, làm mềm phần còn lại, thêm bóng đổ gắn vật vào nền. Dừng lại trước khi vẽ quá tay.</li>
</ol>
<div class="callout"><span class="badge">Bài tập cuối</span> Bày 3 vật khác chất liệu dưới một nguồn sáng. Đưa một bài hoàn chỉnh qua đủ 5 giai đoạn trong một buổi. Rồi tự chấm: có điểm nhấn rõ không? Các vật có nằm trong không gian không? Dải sắc độ đã đủ chưa (có trắng thật và đen thật)?</div>`,
  ]]);

const c8q = quiz('drs102-quiz-8', 'Quiz 8 — Complete study|||Quiz 8 — Bài hoàn chỉnh', [
  { id: 'q1', question: 'Nguyên tắc thứ tự khi vẽ một bài tĩnh vật hoàn chỉnh là?', options: ['Hoàn thiện từng góc một', 'Từ tổng thể tới chi tiết, nâng cả bức cùng lúc', 'Vẽ chi tiết nhỏ nhất trước', 'Tô đen toàn bộ rồi tẩy sáng'], correctIndex: 1, explanation: 'General to specific: dựng/đo → block-in → diễn khối → hoàn thiện, cả bức cùng tiến.' },
  { id: 'q2', question: 'Giai đoạn "block-in" nghĩa là?', options: ['Vẽ mọi chi tiết ngay', 'Nheo mắt, tách cảnh thành sáng/trung/tối, tô mảng bóng phẳng', 'Chỉ vẽ đường viền', 'Ký tên hoàn thành'], correctIndex: 1, explanation: 'Block-in: chia sắc độ lớn thành khối phẳng trước khi diễn chi tiết.' },
  { id: 'q3', question: 'Ở bước hoàn thiện, tương phản mạnh nhất (sáng nhất cạnh tối nhất) nên dồn vào?', options: ['Các góc tranh', 'Điểm nhấn (focal point)', 'Đều khắp bức', 'Vùng nền xa nhất'], correctIndex: 1, explanation: 'Dồn tương phản và cạnh sắc vào điểm nhấn; phần còn lại giữ lặng để dẫn mắt.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'DRS102',
    slug: 'drs102-drawing-form-still-life',
    title: 'Drawing - Form, Still-life',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DRS102.webp',
    shortDescription: 'Learn to draw form & still-life from observation — pencil & charcoal, line & proportion, the basic solids (cube, sphere, cylinder), perspective, light & shadow (5 values), texture, composition and a full still-life study. Bilingual, step-by-step.|||Học vẽ khối & tĩnh vật từ quan sát — chì & than, đường nét & tỉ lệ, khối cơ bản (lập phương, cầu, trụ), phối cảnh, sáng tối (5 sắc độ), chất liệu, bố cục và bài tĩnh vật hoàn chỉnh. Song ngữ, từng bước, có bài tập & quiz.',
    description: 'Môn <strong>DRS102 — Drawing - Form, Still-life</strong> (Hình hoạ: Khối &amp; Tĩnh vật, kỳ 1, ngành Thiết kế mỹ thuật số) xây <strong>nền tảng vẽ quan sát</strong> theo lộ trình 4 bước: <strong>Nhìn</strong> (dụng cụ &amp; luyện nét, đường nét &amp; tỉ lệ/sighting) → <strong>Dựng</strong> (các khối cơ bản, phối cảnh 1-2-3 điểm tụ) → <strong>Diễn khối</strong> (5 sắc độ, form vs cast shadow, chất liệu) → <strong>Bố cục</strong> (sắp đặt tĩnh vật, điểm nhấn) và một bài tĩnh vật hoàn chỉnh. Bám giáo trình vẽ chuẩn (Betty Edwards, Loomis, Bargue, Proko), song ngữ, có kỹ thuật từng bước, bài tập và quiz mỗi chương.',
    whatYouLearn: 'Chì/than & độ cứng H/B, cách cầm bút, hatching; contour & negative space; đo tỉ lệ/góc bằng sighting; bốn khối cơ bản (lập phương/cầu/trụ/nón) & dựng khối 3D; phối cảnh 1-2-3 điểm tụ & foreshortening; 5 sắc độ, core shadow, form vs cast shadow; diễn chất liệu (kim loại/thuỷ tinh/vải/gỗ); bố cục (1/3, tỉ lệ vàng, điểm nhấn); quy trình vẽ tĩnh vật hoàn chỉnh 5 bước.',
    requirements: 'Không cần kinh nghiệm vẽ trước. Cần bút chì graphite (nhiều độ), tẩy dẻo, than, giấy vẽ, và vài vật thật để bày làm mẫu dưới một nguồn sáng.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách vẽ chuẩn, YouTube, dụng cụ, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vẽ là kỹ năng nhìn; lộ trình 4 bước, 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Cơ bản về vẽ|||Chapter 1 — Drawing basics', description: 'Dụng cụ chì/than, cách cầm bút, luyện nét.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Đường nét & tỉ lệ|||Chapter 2 — Line & proportion', description: 'Contour, negative space, sighting, dựng hình.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Hình khối cơ bản|||Chapter 3 — Basic solids', description: 'Lập phương/cầu/trụ/nón, dựng khối 3D.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Phối cảnh|||Chapter 4 — Perspective', description: 'Điểm tụ 1-2-3, foreshortening.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Sáng tối & khối|||Chapter 5 — Light & shadow', description: '5 sắc độ, form vs cast shadow, chuyển sắc.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Chất liệu & bề mặt|||Chapter 6 — Texture & surface', description: 'Kim loại, thuỷ tinh, vải, gỗ, phản chiếu.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Bố cục tĩnh vật|||Chapter 7 — Composition', description: 'Sắp đặt, 1/3, tỉ lệ vàng, điểm nhấn.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Bài tĩnh vật hoàn chỉnh|||Chapter 8 — Complete study', description: 'Quy trình 5 bước từ phác tới hoàn thiện.', lessons: [c8, c8q] },
  ],
};
