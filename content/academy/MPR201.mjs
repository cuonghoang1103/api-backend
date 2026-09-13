/**
 * MPR201 — Media Production: Theory and Practice (Sản xuất truyền thông: Lý
 * thuyết & thực hành), khối Công nghệ Truyền thông FPTU. KHÔNG có syllabus FLM
 * chi tiết → khung theo giáo trình chuẩn quốc tế: Zettl "Television Production
 * Handbook" & "Sight Sound Motion"; Millerson & Owens "Video Production
 * Handbook"; Bordwell & Thompson "Film Art". 8 chương, song ngữ + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick lồng/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('mpr201-0-1-overview', 'Course overview: Media production|||Tổng quan: Sản xuất truyền thông',
  'Sản xuất truyền thông là gì; ba giai đoạn tiền kỳ → sản xuất → hậu kỳ; lộ trình: ngôn ngữ hình ảnh → ánh sáng & âm thanh → quay → dựng → phân phối số.',
  [[
    `<span class="eyebrow">MPR201 · Lesson 0.1 · Overview</span>
<h2>Media Production: Theory &amp; Practice</h2>
<p class="lead">This course turns an idea into a finished, publishable video. You'll learn <strong>how professional media is made</strong> — the craft behind film, TV, ads and online content — and practise every step, from writing a script to exporting for YouTube and TikTok.</p>
<h3>The three stages of every production</h3>
<ul>
<li><strong>Pre-production</strong> — planning: concept, script, storyboard, shot list, schedule. The cheapest place to fix problems.</li>
<li><strong>Production</strong> — the shoot: camera, lighting, sound recorded on location or in studio.</li>
<li><strong>Post-production</strong> — editing, sound mix, colour grade, graphics, and final export.</li>
</ul>
<p>Professionals say <em>"fix it in pre, not in post"</em> — a strong plan saves days of editing.</p>
<h3>Roadmap</h3>
<p>Overview &amp; the pipeline → pre-production → visual language (framing, shots, angles) → lighting &amp; composition → sound → shooting on set → post-production (edit, grade, motion) → distribution &amp; digital practice. Bilingual, with real examples, hands-on exercises and quizzes.</p>`,
    `<span class="eyebrow">MPR201 · Bài 0.1 · Tổng quan</span>
<h2>Sản xuất truyền thông: Lý thuyết &amp; thực hành</h2>
<p class="lead">Môn này biến một ý tưởng thành video hoàn chỉnh, xuất bản được. Bạn học <strong>cách làm sản phẩm truyền thông chuyên nghiệp</strong> — nghề đứng sau phim, TV, quảng cáo và nội dung mạng — và thực hành từng bước, từ viết kịch bản đến xuất bản cho YouTube và TikTok.</p>
<h3>Ba giai đoạn của mọi sản phẩm</h3>
<ul>
<li><strong>Tiền kỳ (pre-production)</strong> — lập kế hoạch: ý tưởng, kịch bản, storyboard, shot list, lịch quay. Chỗ sửa lỗi rẻ nhất.</li>
<li><strong>Sản xuất (production)</strong> — buổi quay: máy quay, ánh sáng, âm thanh thu tại hiện trường hoặc studio.</li>
<li><strong>Hậu kỳ (post-production)</strong> — dựng phim, mix tiếng, chỉnh màu, đồ hoạ và xuất bản cuối.</li>
</ul>
<p>Người trong nghề nói <em>"sửa ở tiền kỳ, đừng để tới hậu kỳ"</em> — kế hoạch tốt tiết kiệm nhiều ngày dựng.</p>
<h3>Lộ trình</h3>
<p>Tổng quan &amp; quy trình → tiền kỳ → ngôn ngữ hình ảnh (khung hình, cỡ cảnh, góc máy) → ánh sáng &amp; bố cục → âm thanh → quay hiện trường → hậu kỳ (dựng, chỉnh màu, motion) → phân phối &amp; thực hành số. Song ngữ, có ví dụ thật, bài thực hành và quiz.</p>`,
  ]]);

const c1 = doc('mpr201-1-1-overview-production', '1.1 — What is media production|||1.1 — Tổng quan sản xuất truyền thông',
  'Media production là gì; các loại sản phẩm (phim, TV, quảng cáo, phim tài liệu, nội dung số); ba giai đoạn pre/production/post và vai trò trong đoàn.',
  [[
    `<span class="eyebrow">MPR201 · Chapter 1 · Lesson 1.1</span>
<h2>What is media production?</h2>
<p><strong>Media production</strong> is the organised process of creating audiovisual content — planning it, capturing images and sound, then assembling them into a finished piece that communicates a message to an audience.</p>
<h3>Types of media product</h3>
<ul>
<li><strong>Narrative film / short</strong> — tells a story with actors and a script.</li>
<li><strong>Television &amp; broadcast</strong> — news, talk shows, live events (often multi-camera).</li>
<li><strong>Advertising / promo</strong> — short, persuasive, brand-driven.</li>
<li><strong>Documentary</strong> — real people and events, interviews and b-roll.</li>
<li><strong>Digital / social content</strong> — vlogs, explainers, reels — fast, vertical, platform-native.</li>
</ul>
<h3>The pipeline &amp; key roles</h3>
<pre><code>PRE-PRODUCTION  -> concept, script, storyboard, shot list, schedule, crew
PRODUCTION      -> director, DoP/camera, gaffer (light), sound, talent
POST-PRODUCTION -> editor, colourist, sound designer, motion/graphics
</code></pre>
<div class="callout"><span class="badge">Practice</span> Pick a 30-second video you love (an ad or a reel). Write one sentence for each of the three stages describing what must have happened to make it.</div>`,
    `<span class="eyebrow">MPR201 · Chương 1 · Bài 1.1</span>
<h2>Sản xuất truyền thông là gì?</h2>
<p><strong>Sản xuất truyền thông</strong> là quá trình có tổ chức để tạo ra nội dung nghe-nhìn — lên kế hoạch, thu hình và tiếng, rồi ghép lại thành một sản phẩm hoàn chỉnh truyền tải thông điệp tới khán giả.</p>
<h3>Các loại sản phẩm</h3>
<ul>
<li><strong>Phim truyện / phim ngắn</strong> — kể chuyện bằng diễn viên và kịch bản.</li>
<li><strong>Truyền hình &amp; phát sóng</strong> — tin tức, talk show, sự kiện trực tiếp (thường đa máy).</li>
<li><strong>Quảng cáo / promo</strong> — ngắn, thuyết phục, xoay quanh thương hiệu.</li>
<li><strong>Phim tài liệu</strong> — người thật việc thật, phỏng vấn và b-roll.</li>
<li><strong>Nội dung số / mạng xã hội</strong> — vlog, explainer, reel — nhanh, dọc, hợp nền tảng.</li>
</ul>
<h3>Quy trình &amp; các vai trò chính</h3>
<pre><code>TIỀN KỲ    -> ý tưởng, kịch bản, storyboard, shot list, lịch, ê-kíp
SẢN XUẤT   -> đạo diễn, DoP/quay phim, gaffer (ánh sáng), âm thanh, diễn viên
HẬU KỲ     -> dựng phim, chỉnh màu, thiết kế âm thanh, motion/đồ hoạ
</code></pre>
<div class="callout"><span class="badge">Thực hành</span> Chọn một video 30 giây bạn thích (quảng cáo hoặc reel). Viết một câu cho mỗi giai đoạn, mô tả điều đã phải xảy ra để làm ra nó.</div>`,
  ]]);

const c1q = quiz('mpr201-quiz-1', 'Quiz 1 — Production overview|||Quiz 1 — Tổng quan sản xuất', [
  { id: 'q1', question: 'Ba giai đoạn của một sản phẩm truyền thông theo đúng thứ tự là?', options: ['Sản xuất → tiền kỳ → hậu kỳ', 'Tiền kỳ → sản xuất → hậu kỳ', 'Hậu kỳ → sản xuất → tiền kỳ', 'Tiền kỳ → hậu kỳ → sản xuất'], correctIndex: 1, explanation: 'Pre-production (lập kế hoạch) → production (quay) → post-production (dựng).' },
  { id: 'q2', question: '"Fix it in pre, not in post" có nghĩa là?', options: ['Sửa mọi lỗi khi dựng', 'Lập kế hoạch kỹ ở tiền kỳ rẻ hơn sửa ở hậu kỳ', 'Không cần kịch bản', 'Quay càng nhiều càng tốt'], correctIndex: 1, explanation: 'Kế hoạch tốt ở tiền kỳ là chỗ sửa lỗi rẻ nhất.' },
  { id: 'q3', question: 'Người phụ trách ánh sáng trong đoàn thường gọi là?', options: ['Editor', 'Gaffer', 'Colourist', 'DoP'], correctIndex: 1, explanation: 'Gaffer phụ trách ánh sáng; DoP/quay phim phụ trách hình ảnh tổng thể.' },
]);

const c2 = doc('mpr201-2-1-preproduction', '2.1 — Pre-production|||2.1 — Tiền kỳ',
  'Từ ý tưởng đến kế hoạch: concept & logline, kịch bản/script, storyboard, shot list, lịch sản xuất (call sheet) và ngân sách.',
  [[
    `<span class="eyebrow">MPR201 · Chapter 2 · Lesson 2.1</span>
<h2>Pre-production — planning the shoot</h2>
<p>Pre-production turns an idea into a plan detailed enough that the shoot runs smoothly. Skipping it is the most common cause of wasted time on set.</p>
<h3>The core documents</h3>
<ul>
<li><strong>Concept &amp; logline</strong> — one sentence: who, wants what, why it matters.</li>
<li><strong>Script</strong> — dialogue, action, and for factual work a two-column A/V script (visuals left, audio right).</li>
<li><strong>Storyboard</strong> — sketches of key frames: composition, angle, movement.</li>
<li><strong>Shot list</strong> — every shot to capture, so nothing is forgotten on the day.</li>
<li><strong>Schedule / call sheet</strong> — who is where, when; grouped by location, not by script order.</li>
</ul>
<pre><code>Shot list (excerpt):
 #  SIZE   ANGLE     MOVE     DESCRIPTION
 1  WS     eye       static   Establish the cafe
 2  MS     eye       pan      Anna enters, sits
 3  CU     slight hi static   Anna reads the note
</code></pre>
<div class="callout"><span class="badge">Practice</span> Write a 1-line logline and a 5-shot shot list for a short "morning routine" clip. Note size, angle and movement for each shot.</div>`,
    `<span class="eyebrow">MPR201 · Chương 2 · Bài 2.1</span>
<h2>Tiền kỳ — lập kế hoạch buổi quay</h2>
<p>Tiền kỳ biến ý tưởng thành một kế hoạch đủ chi tiết để buổi quay trơn tru. Bỏ qua nó là nguyên nhân phổ biến nhất gây lãng phí thời gian trên trường quay.</p>
<h3>Các tài liệu cốt lõi</h3>
<ul>
<li><strong>Ý tưởng &amp; logline</strong> — một câu: ai, muốn gì, vì sao quan trọng.</li>
<li><strong>Kịch bản (script)</strong> — thoại, hành động; với sản phẩm phi hư cấu dùng kịch bản A/V hai cột (hình bên trái, tiếng bên phải).</li>
<li><strong>Storyboard</strong> — phác thảo các khung hình chính: bố cục, góc máy, chuyển động.</li>
<li><strong>Shot list</strong> — danh sách mọi cảnh cần quay, để không quên gì trong ngày quay.</li>
<li><strong>Lịch / call sheet</strong> — ai ở đâu, lúc nào; nhóm theo bối cảnh, không theo thứ tự kịch bản.</li>
</ul>
<pre><code>Shot list (trích):
 #  CỠ    GÓC       ĐỘNG     MÔ TẢ
 1  WS    ngang     tĩnh     Giới thiệu quán cafe
 2  MS    ngang     lia      Anna bước vào, ngồi xuống
 3  CU    hơi cao   tĩnh     Anna đọc mảnh giấy
</code></pre>
<div class="callout"><span class="badge">Thực hành</span> Viết một logline 1 câu và shot list 5 cảnh cho clip ngắn "thói quen buổi sáng". Ghi cỡ cảnh, góc máy và chuyển động cho mỗi cảnh.</div>`,
  ]]);

const c2q = quiz('mpr201-quiz-2', 'Quiz 2 — Pre-production|||Quiz 2 — Tiền kỳ', [
  { id: 'q1', question: 'Storyboard chủ yếu dùng để?', options: ['Ghi thoại chi tiết', 'Phác thảo bố cục/góc/chuyển động các khung hình chính', 'Tính ngân sách', 'Xuất file cuối'], correctIndex: 1, explanation: 'Storyboard trực quan hoá khung hình trước khi quay.' },
  { id: 'q2', question: 'Vì sao lịch quay nên nhóm theo bối cảnh thay vì theo thứ tự kịch bản?', options: ['Để diễn viên vui', 'Tiết kiệm thời gian di chuyển/thiết lập ánh sáng ở mỗi địa điểm', 'Bắt buộc theo luật', 'Để dựng nhanh hơn'], correctIndex: 1, explanation: 'Quay hết cảnh cùng địa điểm một lần giảm thời gian dời máy, set sáng.' },
  { id: 'q3', question: 'Shot list dùng để?', options: ['Liệt kê mọi cảnh cần quay để không bỏ sót', 'Chỉnh màu', 'Thu âm', 'Viết nhạc nền'], correctIndex: 0, explanation: 'Shot list đảm bảo mọi cảnh cần thiết đều được ghi hình.' },
]);

const c3 = doc('mpr201-3-1-visual-language', '3.1 — Visual language|||3.1 — Ngôn ngữ hình ảnh',
  'Khung hình & aspect ratio, quy tắc 1/3 (rule of thirds), cỡ cảnh (WS/MS/CU), góc máy (cao/thấp/ngang), chuyển động máy (pan/tilt/dolly/zoom).',
  [[
    `<span class="eyebrow">MPR201 · Chapter 3 · Lesson 3.1</span>
<h2>Visual language — how the frame speaks</h2>
<p>Where you place the camera and how you frame the subject <em>tells the audience how to feel</em>, before a word is spoken.</p>
<h3>Framing &amp; the rule of thirds</h3>
<p>Divide the frame into a 3×3 grid; place key subjects on the lines or intersections rather than dead centre. Leave <strong>look room</strong> in the direction a subject faces and <strong>head room</strong> above them.</p>
<h3>Shot sizes</h3>
<ul>
<li><strong>WS (Wide Shot)</strong> — shows the whole scene; establishes place.</li>
<li><strong>MS (Medium Shot)</strong> — waist up; good for dialogue.</li>
<li><strong>CU (Close-Up)</strong> — the face; carries emotion.</li>
</ul>
<h3>Angles &amp; camera movement</h3>
<pre><code>ANGLE:  low  -> subject looks powerful
        high -> subject looks weak/small
        eye  -> neutral, natural
MOVE:   pan/tilt (rotate)  dolly/track (move)  zoom (lens)  handheld (energy)
</code></pre>
<div class="callout"><span class="badge">Practice</span> Shoot the same object three ways — WS, MS, CU — and once from a low angle. Notice how meaning changes with no edit at all.</div>`,
    `<span class="eyebrow">MPR201 · Chương 3 · Bài 3.1</span>
<h2>Ngôn ngữ hình ảnh — khung hình biết nói</h2>
<p>Bạn đặt máy ở đâu và bố cục nhân vật thế nào <em>mách khán giả cảm nhận ra sao</em>, trước cả khi có một lời thoại.</p>
<h3>Khung hình &amp; quy tắc 1/3</h3>
<p>Chia khung thành lưới 3×3; đặt chủ thể chính lên đường kẻ hoặc điểm giao thay vì chính giữa. Chừa <strong>look room</strong> (khoảng nhìn) theo hướng chủ thể quay mặt và <strong>head room</strong> (khoảng đầu) phía trên.</p>
<h3>Cỡ cảnh</h3>
<ul>
<li><strong>WS (toàn cảnh)</strong> — thấy cả bối cảnh; giới thiệu địa điểm.</li>
<li><strong>MS (trung cảnh)</strong> — từ eo lên; hợp thoại.</li>
<li><strong>CU (cận cảnh)</strong> — khuôn mặt; truyền cảm xúc.</li>
</ul>
<h3>Góc máy &amp; chuyển động máy</h3>
<pre><code>GÓC:   thấp  -> chủ thể mạnh mẽ, uy quyền
       cao   -> chủ thể yếu/nhỏ bé
       ngang -> trung tính, tự nhiên
ĐỘNG:  pan/tilt (xoay)  dolly/track (dời máy)  zoom (ống kính)  cầm tay (năng lượng)
</code></pre>
<div class="callout"><span class="badge">Thực hành</span> Quay cùng một vật theo ba cỡ — WS, MS, CU — và một lần từ góc thấp. Để ý ý nghĩa đổi ra sao mà chưa cần dựng.</div>`,
  ]]);

const c3q = quiz('mpr201-quiz-3', 'Quiz 3 — Visual language|||Quiz 3 — Ngôn ngữ hình ảnh', [
  { id: 'q1', question: 'Cỡ cảnh nào truyền cảm xúc khuôn mặt tốt nhất?', options: ['Toàn cảnh (WS)', 'Trung cảnh (MS)', 'Cận cảnh (CU)', 'Viễn cảnh cực rộng'], correctIndex: 2, explanation: 'CU tập trung vào khuôn mặt nên tải cảm xúc mạnh nhất.' },
  { id: 'q2', question: 'Góc máy THẤP (low angle) thường khiến chủ thể trông?', options: ['Yếu, nhỏ bé', 'Mạnh mẽ, uy quyền', 'Trung tính', 'Buồn'], correctIndex: 1, explanation: 'Nhìn từ dưới lên làm chủ thể trông cao lớn, quyền lực.' },
  { id: 'q3', question: 'Quy tắc 1/3 khuyên đặt chủ thể chính ở?', options: ['Chính giữa khung', 'Trên đường kẻ/điểm giao của lưới 3×3', 'Sát mép trên', 'Sát mép dưới'], correctIndex: 1, explanation: 'Đặt trên đường/điểm giao lưới 3×3 tạo bố cục cân đối, tự nhiên.' },
]);

const c4 = doc('mpr201-4-1-lighting-composition', '4.1 — Lighting & composition|||4.1 — Ánh sáng & bố cục',
  'Three-point lighting (key/fill/back), nhiệt màu (Kelvin) & cân bằng trắng, chất sáng cứng/mềm, tạo mood; bố cục dẫn mắt.',
  [[
    `<span class="eyebrow">MPR201 · Chapter 4 · Lesson 4.1</span>
<h2>Lighting &amp; composition — shaping the image</h2>
<h3>Three-point lighting</h3>
<pre><code>            BACK LIGHT
                 |
                 v
   FILL  ---&gt;  SUBJECT  &lt;---  KEY
  (soft, less)             (main, bright)
        camera below
</code></pre>
<ul>
<li><strong>Key</strong> — the main light, sets exposure and the direction of shadow.</li>
<li><strong>Fill</strong> — softer, opposite the key, lifts shadows so they aren't too dark.</li>
<li><strong>Back (rim)</strong> — behind the subject, separates them from the background.</li>
</ul>
<h3>Colour temperature &amp; white balance</h3>
<p>Light has a colour, measured in <strong>Kelvin (K)</strong>: candle/tungsten ≈ 3200K (warm/orange), daylight ≈ 5600K (cool/blue). Set <strong>white balance</strong> to the source so white looks white — mixing sources without correction gives ugly colour casts.</p>
<h3>Hard vs soft &amp; mood</h3>
<p>A small/bare source = <strong>hard</strong> light (sharp shadows, drama). A large/diffused source = <strong>soft</strong> light (gentle, flattering). Low-key (mostly dark) feels tense; high-key (bright, even) feels light and clean.</p>
<div class="callout"><span class="badge">Practice</span> Light a face with one lamp as key, then add a white card as a bounce fill. Compare the mood with and without the fill.</div>`,
    `<span class="eyebrow">MPR201 · Chương 4 · Bài 4.1</span>
<h2>Ánh sáng &amp; bố cục — nhào nặn hình ảnh</h2>
<h3>Ánh sáng ba điểm (three-point)</h3>
<pre><code>            ĐÈN VIỀN (BACK)
                 |
                 v
   FILL  ---&gt;  CHỦ THỂ  &lt;---  KEY
  (mềm, nhẹ)               (chính, sáng)
        máy quay phía dưới
</code></pre>
<ul>
<li><strong>Key</strong> — đèn chính, quyết định độ phơi sáng và hướng đổ bóng.</li>
<li><strong>Fill</strong> — mềm hơn, đối diện key, làm sáng vùng bóng để không quá tối.</li>
<li><strong>Back (viền)</strong> — sau chủ thể, tách chủ thể khỏi nền.</li>
</ul>
<h3>Nhiệt màu &amp; cân bằng trắng</h3>
<p>Ánh sáng có màu, đo bằng <strong>Kelvin (K)</strong>: nến/tungsten ≈ 3200K (ấm/cam), ánh sáng ngày ≈ 5600K (lạnh/xanh). Đặt <strong>cân bằng trắng (white balance)</strong> theo nguồn để màu trắng ra trắng — trộn nhiều nguồn mà không hiệu chỉnh sẽ ám màu xấu.</p>
<h3>Cứng/mềm &amp; mood</h3>
<p>Nguồn nhỏ/trần = ánh sáng <strong>cứng</strong> (bóng sắc, kịch tính). Nguồn lớn/tán xạ = ánh sáng <strong>mềm</strong> (dịu, tôn dáng). Low-key (chủ yếu tối) tạo căng thẳng; high-key (sáng, đều) tạo cảm giác nhẹ, sạch.</p>
<div class="callout"><span class="badge">Thực hành</span> Chiếu một khuôn mặt bằng một đèn làm key, rồi thêm tấm phản trắng làm fill. So sánh mood khi có và không có fill.</div>`,
  ]]);

const c4q = quiz('mpr201-quiz-4', 'Quiz 4 — Lighting|||Quiz 4 — Ánh sáng', [
  { id: 'q1', question: 'Trong three-point lighting, đèn nào tách chủ thể khỏi nền?', options: ['Key', 'Fill', 'Back (đèn viền)', 'Practical'], correctIndex: 2, explanation: 'Đèn back/rim đặt sau chủ thể tạo viền sáng, tách khỏi nền.' },
  { id: 'q2', question: 'Ánh sáng ban ngày ~5600K so với tungsten ~3200K thì?', options: ['Ấm/cam hơn', 'Lạnh/xanh hơn', 'Cùng màu', 'Không có màu'], correctIndex: 1, explanation: 'Kelvin càng cao càng lạnh/xanh; 5600K lạnh hơn 3200K.' },
  { id: 'q3', question: 'Muốn ánh sáng MỀM, dịu, tôn dáng thì dùng nguồn?', options: ['Nhỏ và trần trụi', 'Lớn và tán xạ (khuếch tán)', 'Đặt xa nhất có thể', 'Đèn flash trực diện'], correctIndex: 1, explanation: 'Nguồn lớn/khuếch tán cho bóng mềm; nguồn nhỏ cho bóng cứng.' },
]);

const c5 = doc('mpr201-5-1-audio', '5.1 — Audio for production|||5.1 — Âm thanh trong sản xuất',
  'Micro (lav/shotgun/handheld), thu tiếng hiện trường & room tone, mức/độ vọng, nhạc nền & bản quyền, mix (dialogue/music/SFX), luật âm thanh.',
  [[
    `<span class="eyebrow">MPR201 · Chapter 5 · Lesson 5.1</span>
<h2>Audio — half of the experience</h2>
<p>Audiences forgive imperfect picture but not bad sound. Good audio is recorded well on set — you can't fully "fix it in post".</p>
<h3>Microphones</h3>
<ul>
<li><strong>Lavalier (lav)</strong> — clip-on, close to the mouth; great for interviews.</li>
<li><strong>Shotgun</strong> — highly directional, on a boom just out of frame; picks up dialogue, rejects sides.</li>
<li><strong>Handheld</strong> — reporting, vox pops.</li>
</ul>
<h3>Recording on location</h3>
<p>Get the mic <em>close</em>, monitor with headphones, and watch levels — aim for a healthy signal that never clips (peaks around −12 to −6 dBFS). Always record 30s of <strong>room tone</strong> (the silence of the space) to smooth edits later.</p>
<h3>Music, SFX &amp; the mix</h3>
<p>Use <strong>licensed or royalty-free</strong> music — never rip a copyrighted track. In the mix, balance three layers so <strong>dialogue stays clear</strong>:</p>
<pre><code>Dialogue   ~ -12 dBFS   (always intelligible; the priority)
Music bed  ~ -24 dBFS   (ducks under speech)
SFX        to taste     (footsteps, ambience, transitions)
</code></pre>
<div class="callout"><span class="badge">Practice</span> Record a line with a phone at arm's length, then 20cm away. Hear how distance changes clarity and room echo.</div>`,
    `<span class="eyebrow">MPR201 · Chương 5 · Bài 5.1</span>
<h2>Âm thanh — một nửa trải nghiệm</h2>
<p>Khán giả tha thứ hình chưa hoàn hảo nhưng không tha tiếng dở. Âm thanh tốt phải thu tốt tại hiện trường — không thể "sửa hết ở hậu kỳ".</p>
<h3>Micro</h3>
<ul>
<li><strong>Lavalier (lav)</strong> — micro kẹp áo, gần miệng; tuyệt cho phỏng vấn.</li>
<li><strong>Shotgun</strong> — định hướng cao, gắn cần boom ngay ngoài khung; bắt thoại, loại tiếng bên.</li>
<li><strong>Cầm tay (handheld)</strong> — đưa tin, phỏng vấn nhanh.</li>
</ul>
<h3>Thu tiếng hiện trường</h3>
<p>Đưa micro lại <em>gần</em>, nghe kiểm bằng tai nghe, và canh mức — nhắm tín hiệu khỏe nhưng không bao giờ vỡ (đỉnh khoảng −12 đến −6 dBFS). Luôn thu 30 giây <strong>room tone</strong> (tiếng nền tĩnh của không gian) để làm mượt các mối dựng về sau.</p>
<h3>Nhạc, SFX &amp; mix</h3>
<p>Dùng nhạc <strong>có bản quyền hoặc royalty-free</strong> — đừng lấy nhạc bản quyền. Khi mix, cân ba lớp sao cho <strong>thoại luôn rõ</strong>:</p>
<pre><code>Thoại      ~ -12 dBFS   (luôn nghe rõ; ưu tiên số 1)
Nhạc nền   ~ -24 dBFS   (hạ xuống dưới lời nói)
SFX        tuỳ chỉnh    (bước chân, tiếng nền, chuyển cảnh)
</code></pre>
<div class="callout"><span class="badge">Thực hành</span> Thu một câu bằng điện thoại để xa một sải tay, rồi cách 20cm. Nghe khoảng cách đổi độ rõ và tiếng vọng phòng thế nào.</div>`,
  ]]);

const c5q = quiz('mpr201-quiz-5', 'Quiz 5 — Audio|||Quiz 5 — Âm thanh', [
  { id: 'q1', question: 'Vì sao luôn thu 30 giây "room tone"?', options: ['Để làm nhạc nền', 'Để làm mượt các mối dựng và lấp khoảng lặng tự nhiên', 'Để kiểm tra micro', 'Bắt buộc theo luật'], correctIndex: 1, explanation: 'Room tone là tiếng nền tĩnh, dùng lấp và làm liền các mối cắt.' },
  { id: 'q2', question: 'Trong mix, lớp nào phải luôn rõ nhất?', options: ['Nhạc nền', 'Hiệu ứng SFX', 'Thoại (dialogue)', 'Tiếng ồn nền'], correctIndex: 2, explanation: 'Thoại là ưu tiên; nhạc nền phải "ducks" xuống dưới lời nói.' },
  { id: 'q3', question: 'Mức thu nên tránh điều gì để không méo tiếng?', options: ['Clip (vỡ, quá 0 dBFS)', 'Quá nhỏ dưới −60 dBFS', 'Đúng −12 dBFS', 'Dùng tai nghe'], correctIndex: 0, explanation: 'Tín hiệu vượt 0 dBFS bị clip/méo không cứu được; nhắm đỉnh −12..−6.' },
]);

const c6 = doc('mpr201-6-1-shooting', '6.1 — Shooting & field production|||6.1 — Quay & sản xuất hiện trường',
  'Máy quay & ống kính, tam giác phơi sáng (khẩu/tốc/ISO), lấy nét & tốc độ màn trập 180°, đa máy, tổ chức đoàn & an toàn trường quay.',
  [[
    `<span class="eyebrow">MPR201 · Chapter 6 · Lesson 6.1</span>
<h2>Shooting — capturing on set</h2>
<h3>The exposure triangle</h3>
<ul>
<li><strong>Aperture (f-stop)</strong> — how wide the lens opens; also controls depth of field (small f-number = blurry background).</li>
<li><strong>Shutter speed</strong> — for natural motion use the <strong>180° rule</strong>: shutter ≈ 1/(2×fps), e.g. 1/50s at 25 fps.</li>
<li><strong>ISO</strong> — sensor sensitivity; raise it in low light, but too high adds noise.</li>
</ul>
<h3>Focus &amp; framing on the day</h3>
<p>Pull focus onto the subject's eyes; use a wide-then-tight coverage plan so the editor has options. Keep the horizon level and mind continuity (props, wardrobe, screen direction).</p>
<h3>Multi-camera &amp; crew</h3>
<pre><code>Multi-cam (event/interview):
  CAM A - wide master (always rolling)
  CAM B - close-up / reaction
  -> jam sync timecode or clap once so editors can align in post
</code></pre>
<p>On set: brief the crew, respect the schedule, and keep it <strong>safe</strong> — tape down cables, mind power loads, control the public.</p>
<div class="callout"><span class="badge">Practice</span> Film one action at 25 fps with a 1/50 shutter, then 1/500. Compare how motion blur changes the feel.</div>`,
    `<span class="eyebrow">MPR201 · Chương 6 · Bài 6.1</span>
<h2>Quay — ghi hình trên trường quay</h2>
<h3>Tam giác phơi sáng</h3>
<ul>
<li><strong>Khẩu độ (f-stop)</strong> — độ mở ống kính; cũng quyết định độ sâu trường ảnh (f nhỏ = nền mờ).</li>
<li><strong>Tốc độ màn trập</strong> — muốn chuyển động tự nhiên dùng <strong>quy tắc 180°</strong>: tốc ≈ 1/(2×fps), vd 1/50s ở 25 fps.</li>
<li><strong>ISO</strong> — độ nhạy cảm biến; tăng khi thiếu sáng, nhưng cao quá thì nhiễu (noise).</li>
</ul>
<h3>Lấy nét &amp; căn khung trong ngày quay</h3>
<p>Bắt nét vào mắt chủ thể; quay theo kế hoạch bao quát rộng-rồi-cận để người dựng có nhiều lựa chọn. Giữ đường chân trời thẳng và chú ý continuity (đạo cụ, trang phục, hướng nhìn).</p>
<h3>Đa máy &amp; ê-kíp</h3>
<pre><code>Đa máy (sự kiện/phỏng vấn):
  MÁY A - toàn cảnh master (luôn quay)
  MÁY B - cận cảnh / phản ứng
  -> đồng bộ timecode hoặc vỗ tay một cái để hậu kỳ căn khớp
</code></pre>
<p>Trên trường: dặn kỹ ê-kíp, tôn trọng lịch, và giữ <strong>an toàn</strong> — dán cố định dây, canh tải điện, kiểm soát người ngoài.</p>
<div class="callout"><span class="badge">Thực hành</span> Quay một hành động ở 25 fps với tốc 1/50, rồi 1/500. So sánh nhoè chuyển động đổi cảm giác thế nào.</div>`,
  ]]);

const c6q = quiz('mpr201-quiz-6', 'Quiz 6 — Shooting|||Quiz 6 — Quay hiện trường', [
  { id: 'q1', question: 'Quy tắc 180° cho tốc độ màn trập ở 25 fps là?', options: ['1/25 s', '1/50 s', '1/500 s', '1/1000 s'], correctIndex: 1, explanation: 'Tốc ≈ 1/(2×fps) = 1/50s ở 25 fps cho nhoè chuyển động tự nhiên.' },
  { id: 'q2', question: 'Muốn NỀN MỜ (xoá phông) thì chọn?', options: ['Khẩu f lớn (vd f/16)', 'Khẩu f nhỏ (vd f/1.8)', 'ISO thật cao', 'Tốc màn trập nhanh'], correctIndex: 1, explanation: 'f nhỏ = độ mở lớn = độ sâu trường ảnh mỏng = nền mờ.' },
  { id: 'q3', question: 'Khi quay đa máy phỏng vấn, vì sao vỗ tay/đồng bộ timecode đầu buổi?', options: ['Để diễn viên sẵn sàng', 'Để hậu kỳ căn khớp các máy theo thời gian', 'Để kiểm tra âm thanh', 'Để tăng ISO'], correctIndex: 1, explanation: 'Điểm mốc chung (clap/timecode) giúp căn thẳng các nguồn khi dựng.' },
]);

const c7 = doc('mpr201-7-1-postproduction', '7.1 — Post-production|||7.1 — Hậu kỳ',
  'Dựng phi tuyến (NLE), quy trình import→cut→refine→export, cut & transition, nhịp dựng & J/L-cut, color correction vs grading, đồ hoạ/motion & title.',
  [[
    `<span class="eyebrow">MPR201 · Chapter 7 · Lesson 7.1</span>
<h2>Post-production — assembling the story</h2>
<h3>Non-linear editing (NLE)</h3>
<p>Editors work in an <strong>NLE</strong> (Premiere Pro, DaVinci Resolve, Final Cut) — clips on a timeline you can rearrange freely. A typical flow:</p>
<pre><code>IMPORT / organise -> ROUGH CUT (story &amp; length)
 -> FINE CUT (timing, rhythm) -> SOUND -> COLOUR -> TITLES/GFX -> EXPORT
</code></pre>
<h3>Cuts &amp; transitions</h3>
<ul>
<li><strong>Hard cut</strong> — the default; invisible when motion/eyeline match.</li>
<li><strong>J-cut / L-cut</strong> — audio leads or trails the picture; makes dialogue flow naturally.</li>
<li><strong>Dissolve / fade</strong> — signals time passing; use sparingly.</li>
</ul>
<h3>Colour: correction vs grading</h3>
<p><strong>Correction</strong> = make it accurate (balance white, fix exposure so shots match). <strong>Grading</strong> = give it a look/mood (warm nostalgia, cold thriller). Correct first, then grade.</p>
<h3>Graphics &amp; motion</h3>
<p>Add lower-thirds (names), titles, and simple motion graphics — keep them legible and on-brand, and respect safe margins so nothing is cropped on TV/phones.</p>
<div class="callout"><span class="badge">Practice</span> Take three clips, build a 20-second rough cut, then tighten each cut by trimming 3–5 frames. Feel the rhythm improve.</div>`,
    `<span class="eyebrow">MPR201 · Chương 7 · Bài 7.1</span>
<h2>Hậu kỳ — ghép nên câu chuyện</h2>
<h3>Dựng phi tuyến (NLE)</h3>
<p>Người dựng làm trong <strong>NLE</strong> (Premiere Pro, DaVinci Resolve, Final Cut) — các clip trên timeline sắp xếp tự do. Quy trình điển hình:</p>
<pre><code>IMPORT / sắp xếp -> ROUGH CUT (câu chuyện &amp; độ dài)
 -> FINE CUT (nhịp, timing) -> ÂM THANH -> MÀU -> TITLE/GFX -> XUẤT
</code></pre>
<h3>Cắt &amp; chuyển cảnh</h3>
<ul>
<li><strong>Hard cut</strong> — mặc định; vô hình khi chuyển động/hướng nhìn khớp.</li>
<li><strong>J-cut / L-cut</strong> — tiếng vào trước hoặc kéo dài qua hình; làm thoại trôi tự nhiên.</li>
<li><strong>Dissolve / fade</strong> — báo thời gian trôi; dùng tiết chế.</li>
</ul>
<h3>Màu: correction và grading</h3>
<p><strong>Color correction</strong> = làm cho ĐÚNG (cân trắng, chỉnh phơi sáng cho các cảnh khớp nhau). <strong>Grading</strong> = tạo LOOK/mood (ấm hoài niệm, lạnh giật gân). Sửa đúng trước, tạo look sau.</p>
<h3>Đồ hoạ &amp; motion</h3>
<p>Thêm lower-third (tên), title và motion graphics đơn giản — giữ dễ đọc, đúng nhận diện, và tôn trọng safe margin để không bị cắt trên TV/điện thoại.</p>
<div class="callout"><span class="badge">Thực hành</span> Lấy ba clip, dựng rough cut 20 giây, rồi siết mỗi mối cắt bằng cách xén 3–5 khung hình. Cảm nhận nhịp cải thiện.</div>`,
  ]]);

const c7q = quiz('mpr201-quiz-7', 'Quiz 7 — Post-production|||Quiz 7 — Hậu kỳ', [
  { id: 'q1', question: 'Khác biệt đúng giữa color correction và grading?', options: ['Giống hệt nhau', 'Correction làm hình ĐÚNG/khớp; grading tạo LOOK/mood', 'Grading làm trước correction', 'Correction chỉ dùng cho ảnh tĩnh'], correctIndex: 1, explanation: 'Correction cân đúng màu/phơi sáng; grading tạo phong cách. Correct trước, grade sau.' },
  { id: 'q2', question: 'J-cut/L-cut là kỹ thuật?', options: ['Chuyển cảnh 3D', 'Cho tiếng vào trước hoặc kéo dài qua mối cắt hình', 'Xoá phông', 'Tăng ISO'], correctIndex: 1, explanation: 'Tiếng đi lệch nhịp với hình làm thoại/chuyển cảnh trôi tự nhiên.' },
  { id: 'q3', question: 'NLE (non-linear editor) nghĩa là?', options: ['Chỉ dựng theo đúng thứ tự quay', 'Sắp xếp clip tự do trên timeline, sửa lại bất kỳ lúc nào', 'Chỉ dùng cho âm thanh', 'Một loại máy quay'], correctIndex: 1, explanation: 'Phi tuyến: clip trên timeline có thể sắp xếp/sửa tự do.' },
]);

const c8 = doc('mpr201-8-1-distribution', '8.1 — Distribution & digital practice|||8.1 — Phân phối & thực hành số',
  'Định dạng & nén (codec/bitrate/H.264), độ phân giải & khung hình, xuất bản đa nền tảng (YouTube ngang 16:9, TikTok/Reels dọc 9:16), FFmpeg, quy trình dự án thực tế.',
  [[
    `<span class="eyebrow">MPR201 · Chapter 8 · Lesson 8.1</span>
<h2>Distribution &amp; digital practice</h2>
<h3>Formats, codecs &amp; compression</h3>
<p>The finished timeline is <strong>exported</strong> to a delivery file. A <strong>codec</strong> compresses the video; <strong>H.264</strong> in an <strong>.mp4</strong> is the safe universal choice for the web. <strong>Bitrate</strong> trades size for quality — too low = blocky artefacts, too high = huge files.</p>
<h3>Platform specs</h3>
<pre><code>YouTube    16:9  1920x1080 (or 4K)  H.264  ~8-12 Mbps
TikTok/Reels 9:16 1080x1920         H.264  ~6-10 Mbps
Frame rate: keep the source (24/25/30 fps); 30/60 for fast action
</code></pre>
<p>Shoot and frame for the destination — a 16:9 master crops badly to vertical, so plan vertical framing when the target is TikTok/Reels.</p>
<h3>Exporting with FFmpeg</h3>
<pre><code># Compress a master to a web-ready 1080p mp4
ffmpeg -i master.mov -c:v libx264 -crf 20 -preset medium \
       -c:a aac -b:a 192k -movflags +faststart web.mp4

# Make a vertical 9:16 version (crop then scale)
ffmpeg -i web.mp4 -vf "crop=ih*9/16:ih,scale=1080:1920" vertical.mp4
</code></pre>
<h3>Real project workflow</h3>
<p>Brief → pre-production docs → shoot → edit → grade &amp; mix → export per platform → publish (title, thumbnail, description, captions) → review the analytics and iterate.</p>
<div class="callout"><span class="badge">Practice</span> Export one clip as 16:9 for YouTube and 9:16 for TikTok. Compare file size and how framing has to change.</div>`,
    `<span class="eyebrow">MPR201 · Chương 8 · Bài 8.1</span>
<h2>Phân phối &amp; thực hành số</h2>
<h3>Định dạng, codec &amp; nén</h3>
<p>Timeline hoàn chỉnh được <strong>xuất (export)</strong> thành file phân phối. <strong>Codec</strong> nén video; <strong>H.264</strong> trong <strong>.mp4</strong> là lựa chọn phổ dụng an toàn cho web. <strong>Bitrate</strong> đánh đổi dung lượng lấy chất lượng — thấp quá = vỡ khối, cao quá = file khổng lồ.</p>
<h3>Thông số theo nền tảng</h3>
<pre><code>YouTube      16:9  1920x1080 (hoặc 4K)  H.264  ~8-12 Mbps
TikTok/Reels 9:16  1080x1920            H.264  ~6-10 Mbps
Khung hình: giữ theo nguồn (24/25/30 fps); 30/60 cho cảnh động nhanh
</code></pre>
<p>Quay và căn khung theo đích đến — master 16:9 crop sang dọc rất xấu, nên hãy tính khung dọc ngay từ đầu khi đích là TikTok/Reels.</p>
<h3>Xuất bằng FFmpeg</h3>
<pre><code># Nén master thành mp4 1080p sẵn cho web
ffmpeg -i master.mov -c:v libx264 -crf 20 -preset medium \
       -c:a aac -b:a 192k -movflags +faststart web.mp4

# Tạo bản dọc 9:16 (crop rồi scale)
ffmpeg -i web.mp4 -vf "crop=ih*9/16:ih,scale=1080:1920" vertical.mp4
</code></pre>
<h3>Quy trình dự án thực tế</h3>
<p>Brief → tài liệu tiền kỳ → quay → dựng → grade &amp; mix → xuất theo từng nền tảng → xuất bản (tiêu đề, thumbnail, mô tả, phụ đề) → xem analytics và cải tiến.</p>
<div class="callout"><span class="badge">Thực hành</span> Xuất một clip thành 16:9 cho YouTube và 9:16 cho TikTok. So sánh dung lượng và cách khung hình phải đổi.</div>`,
  ]]);

const c8q = quiz('mpr201-quiz-8', 'Quiz 8 — Distribution|||Quiz 8 — Phân phối số', [
  { id: 'q1', question: 'Tỉ lệ khung hình chuẩn cho TikTok/Reels là?', options: ['16:9 ngang', '1:1 vuông', '9:16 dọc', '4:3'], correctIndex: 2, explanation: 'TikTok/Reels dùng khung dọc 9:16 (vd 1080x1920).' },
  { id: 'q2', question: 'Codec phổ dụng an toàn nhất để xuất video cho web là?', options: ['H.264 (.mp4)', 'ProRes RAW', 'GIF', 'WAV'], correctIndex: 0, explanation: 'H.264 trong mp4 tương thích rộng nhất trên trình duyệt/nền tảng.' },
  { id: 'q3', question: 'Bitrate quá THẤP khi xuất sẽ gây?', options: ['File quá lớn', 'Vỡ khối/nhiễu nén (blocky artefacts)', 'Âm thanh to hơn', 'Khung hình nhanh hơn'], correctIndex: 1, explanation: 'Bitrate thấp = ít dữ liệu = vỡ khối; cao = file lớn. Cân bằng bằng CRF/bitrate hợp lý.' },
]);

const taiLieu = doc('mpr201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình chuẩn (Zettl, Millerson & Owens, Bordwell & Thompson), tutorial Adobe/DaVinci, YouTube, công cụ, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">MPR201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn media production — the pipeline, visual language, lighting, sound, shooting, editing and delivery — in one place. This subject has no detailed FLM syllabus, so the course follows the international standard textbooks below.</p>
<h3>📗 Standard textbooks</h3>
<ul>
<li><a href="https://www.cengage.com/c/television-production-handbook-13e-zettl/" target="_blank" rel="noopener">Herbert Zettl — <em>Television Production Handbook</em></a></li>
<li><a href="https://en.wikipedia.org/wiki/Herbert_Zettl" target="_blank" rel="noopener">Herbert Zettl — <em>Sight, Sound, Motion: Applied Media Aesthetics</em></a></li>
<li><a href="https://www.routledge.com/Video-Production-Handbook/Owens/p/book/9781138932487" target="_blank" rel="noopener">Millerson &amp; Owens — <em>Video Production Handbook</em></a></li>
<li><a href="https://www.mheducation.com/highered/product/film-art-introduction-bordwell-thompson.html" target="_blank" rel="noopener">Bordwell &amp; Thompson — <em>Film Art: An Introduction</em></a></li>
</ul>
<h3>🌐 Official / free tutorials</h3>
<ul>
<li><a href="https://helpx.adobe.com/premiere-pro/tutorials.html" target="_blank" rel="noopener">Adobe Premiere Pro — official tutorials</a></li>
<li><a href="https://www.blackmagicdesign.com/products/davinciresolve/training" target="_blank" rel="noopener">DaVinci Resolve — free training &amp; certification</a></li>
<li><a href="https://ffmpeg.org/documentation.html" target="_blank" rel="noopener">FFmpeg — official documentation</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@StudioBinder" target="_blank" rel="noopener">StudioBinder</a> — filmmaking, shot lists &amp; cinematography</li>
<li><a href="https://www.youtube.com/@DSLRguide" target="_blank" rel="noopener">DSLR Video Shooter / Parker Walbeck</a> — practical shooting &amp; editing</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.blackmagicdesign.com/products/davinciresolve" target="_blank" rel="noopener">DaVinci Resolve</a> — free edit, grade &amp; audio suite</li>
<li><a href="https://www.capcut.com/" target="_blank" rel="noopener">CapCut</a> — fast mobile/desktop editing for social</li>
<li><a href="https://ffmpeg.org/" target="_blank" rel="noopener">FFmpeg</a> — command-line convert/compress/export</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — the three stages, visual language (shots, angles), and framing.</li>
<li><strong>Practice</strong> — plan &amp; shoot a 30-second clip with a phone: script, shot list, light, sound.</li>
<li><strong>Go deeper</strong> — edit in DaVinci Resolve: cut rhythm, J/L-cuts, correction then grade, sound mix.</li>
<li><strong>Job-ready</strong> — export per platform (YouTube 16:9, TikTok 9:16), publish and read the analytics.</li>
</ol></div>`,
    `<span class="eyebrow">MPR201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học sản xuất truyền thông — quy trình, ngôn ngữ hình ảnh, ánh sáng, âm thanh, quay, dựng và phân phối — gom về một chỗ. Môn này không có giáo trình FLM chi tiết, nên khoá bám theo các sách chuẩn quốc tế dưới đây.</p>
<h3>📗 Sách giáo trình chuẩn</h3>
<ul>
<li><a href="https://www.cengage.com/c/television-production-handbook-13e-zettl/" target="_blank" rel="noopener">Herbert Zettl — <em>Television Production Handbook</em></a></li>
<li><a href="https://en.wikipedia.org/wiki/Herbert_Zettl" target="_blank" rel="noopener">Herbert Zettl — <em>Sight, Sound, Motion: Applied Media Aesthetics</em></a></li>
<li><a href="https://www.routledge.com/Video-Production-Handbook/Owens/p/book/9781138932487" target="_blank" rel="noopener">Millerson &amp; Owens — <em>Video Production Handbook</em></a></li>
<li><a href="https://www.mheducation.com/highered/product/film-art-introduction-bordwell-thompson.html" target="_blank" rel="noopener">Bordwell &amp; Thompson — <em>Film Art: An Introduction</em></a></li>
</ul>
<h3>🌐 Tutorial chính thức / miễn phí</h3>
<ul>
<li><a href="https://helpx.adobe.com/premiere-pro/tutorials.html" target="_blank" rel="noopener">Adobe Premiere Pro — tutorial chính thức</a></li>
<li><a href="https://www.blackmagicdesign.com/products/davinciresolve/training" target="_blank" rel="noopener">DaVinci Resolve — đào tạo &amp; chứng chỉ miễn phí</a></li>
<li><a href="https://ffmpeg.org/documentation.html" target="_blank" rel="noopener">FFmpeg — tài liệu chính thức</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@StudioBinder" target="_blank" rel="noopener">StudioBinder</a> — làm phim, shot list &amp; quay phim</li>
<li><a href="https://www.youtube.com/@DSLRguide" target="_blank" rel="noopener">DSLR Video Shooter / Parker Walbeck</a> — quay &amp; dựng thực tế</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.blackmagicdesign.com/products/davinciresolve" target="_blank" rel="noopener">DaVinci Resolve</a> — bộ dựng, chỉnh màu &amp; âm thanh miễn phí</li>
<li><a href="https://www.capcut.com/" target="_blank" rel="noopener">CapCut</a> — dựng nhanh trên di động/desktop cho mạng xã hội</li>
<li><a href="https://ffmpeg.org/" target="_blank" rel="noopener">FFmpeg</a> — chuyển đổi/nén/xuất bằng dòng lệnh</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — ba giai đoạn, ngôn ngữ hình ảnh (cỡ cảnh, góc máy) và bố cục khung hình.</li>
<li><strong>Luyện tập</strong> — lên kế hoạch &amp; quay clip 30 giây bằng điện thoại: kịch bản, shot list, ánh sáng, âm thanh.</li>
<li><strong>Đào sâu</strong> — dựng trong DaVinci Resolve: nhịp cắt, J/L-cut, correction rồi grade, mix tiếng.</li>
<li><strong>Sẵn sàng đi làm</strong> — xuất theo nền tảng (YouTube 16:9, TikTok 9:16), xuất bản và đọc analytics.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'MPR201',
    slug: 'mpr201-media-production-theory-and-practice',
    title: 'Media production: Theory and practice',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MPR201.webp',
    shortDescription: 'Turn an idea into a publishable video — the pipeline (pre/production/post), visual language, lighting, sound, shooting, editing (cut/grade/motion) and multi-platform delivery (YouTube 16:9, TikTok 9:16). Bilingual, hands-on, with quizzes.|||Biến ý tưởng thành video xuất bản được — quy trình (tiền kỳ/sản xuất/hậu kỳ), ngôn ngữ hình ảnh, ánh sáng, âm thanh, quay, dựng (cut/grade/motion) và phân phối đa nền tảng. Song ngữ, thực hành, có quiz.',
    description: 'Môn <strong>MPR201 — Media Production: Theory and Practice</strong> (kỳ 5, khối Công nghệ Truyền thông) dạy <strong>cách làm ra một sản phẩm truyền thông hoàn chỉnh</strong>. Từ <strong>quy trình &amp; tiền kỳ</strong> (ý tưởng, kịch bản, storyboard, shot list, lịch) → <strong>ngôn ngữ hình ảnh</strong> (khung hình, cỡ cảnh, góc máy, chuyển động) → <strong>ánh sáng &amp; âm thanh</strong> (three-point, nhiệt màu, micro, mix) → <strong>quay hiện trường</strong> (phơi sáng, lấy nét, đa máy) → <strong>hậu kỳ</strong> (dựng phi tuyến, cut, grade, motion) → <strong>phân phối số</strong> (nén, FFmpeg, YouTube/TikTok). Vì môn không có syllabus FLM chi tiết, khoá bám sách chuẩn quốc tế (Zettl, Millerson &amp; Owens, Bordwell &amp; Thompson). Song ngữ, có ví dụ &amp; thực hành thật, quiz mỗi chương.',
    whatYouLearn: 'Ba giai đoạn pre/production/post & vai trò trong đoàn; viết logline, script A/V, storyboard, shot list, lịch quay; khung hình, quy tắc 1/3, cỡ cảnh (WS/MS/CU), góc máy, chuyển động; three-point lighting, nhiệt màu Kelvin & white balance; micro (lav/shotgun), room tone, mix (thoại/nhạc/SFX); tam giác phơi sáng, quy tắc 180°, độ sâu trường ảnh, đa máy; dựng phi tuyến, hard/J/L-cut, color correction vs grading, motion/title; codec/bitrate H.264, xuất FFmpeg, khung 16:9 vs 9:16, quy trình dự án thực tế.',
    requirements: 'Không cần kiến thức trước. Nên có điện thoại/máy quay để thực hành và cài một phần mềm dựng miễn phí (DaVinci Resolve hoặc CapCut); FFmpeg nếu muốn xuất bằng dòng lệnh.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách chuẩn (Zettl, Millerson & Owens, Bordwell & Thompson), tutorial Adobe/DaVinci, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Sản xuất truyền thông là gì, ba giai đoạn, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan sản xuất|||Chapter 1 — Production overview', description: 'Media production, các loại sản phẩm, pipeline & vai trò.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Tiền kỳ|||Chapter 2 — Pre-production', description: 'Ý tưởng, kịch bản, storyboard, shot list, lịch.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Ngôn ngữ hình ảnh|||Chapter 3 — Visual language', description: 'Khung hình, quy tắc 1/3, cỡ cảnh, góc, chuyển động.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Ánh sáng & bố cục|||Chapter 4 — Lighting & composition', description: 'Three-point, nhiệt màu, cứng/mềm, mood.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Âm thanh|||Chapter 5 — Audio', description: 'Micro, thu hiện trường, room tone, nhạc nền, mix.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Quay & hiện trường|||Chapter 6 — Shooting', description: 'Phơi sáng, lấy nét, 180°, đa máy, tổ chức đoàn.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Hậu kỳ|||Chapter 7 — Post-production', description: 'Dựng phi tuyến, cut/transition, grade, motion.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Phân phối & thực hành số|||Chapter 8 — Distribution', description: 'Codec/nén, FFmpeg, YouTube/TikTok, quy trình dự án.', lessons: [c8, c8q] },
  ],
};
