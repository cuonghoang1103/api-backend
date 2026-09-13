/**
 * AVP201 — Audio-Visual Practice / Thực hành nghe nhìn (sản xuất video & âm
 * thanh), khối Công nghệ Truyền thông FPTU. Môn KHÔNG có FLM → khung theo
 * giáo trình sản xuất chuẩn quốc tế: "The Filmmaker's Handbook" (Ascher &
 * Pincus), "In the Blink of an Eye" (Walter Murch), No Film School, tài liệu
 * Premiere/DaVinci. Thiên THỰC HÀNH sản xuất. Song ngữ + mẹo + ví dụ + quiz.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick lồng/${; "&"→"&amp;" trong
 * content HTML; shortDescription dùng "&" thường; "\n" phải viết "\\n".
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('avp201-0-0-tai-lieu', '📚 Materials, tools & references|||📚 Tài liệu, công cụ & tham khảo',
  'Trung tâm tài liệu: sách kinh điển về sản xuất, tài liệu Premiere/DaVinci, kênh học nghề, công cụ (máy quay/điện thoại, phần mềm dựng, mic), lộ trình 4 bước.',
  [[
    `<span class="eyebrow">AVP201 · Materials</span>
<h2>Materials, tools &amp; resource hub</h2>
<p class="lead">Everything to start producing <strong>video &amp; audio</strong> — from framing a shot to delivering a finished clip — in one place. AVP201 has no FLM syllabus, so this course follows standard international production references. All resources below are free or widely available.</p>
<h3>📘 Core books</h3>
<ul>
<li><strong>The Filmmaker's Handbook</strong> — Steven Ascher &amp; Edward Pincus (the practical bible of camera, lighting, sound and post).</li>
<li><strong>In the Blink of an Eye</strong> — Walter Murch (how and why we cut; the "rule of six").</li>
</ul>
<h3>🌐 Free documentation &amp; learning</h3>
<ul>
<li><a href="https://nofilmschool.com/" target="_blank" rel="noopener">No Film School</a> — practical filmmaking articles &amp; gear.</li>
<li><a href="https://helpx.adobe.com/premiere-pro/user-guide.html" target="_blank" rel="noopener">Adobe Premiere Pro — User Guide</a>.</li>
<li><a href="https://www.blackmagicdesign.com/products/davinciresolve/training" target="_blank" rel="noopener">DaVinci Resolve — free training</a> (editing &amp; color).</li>
</ul>
<h3>🛠️ Tools you'll use</h3>
<ul>
<li><strong>Camera</strong> — a DSLR/mirrorless, a camcorder, or just a modern <strong>smartphone</strong> (all you truly need to start).</li>
<li><strong>Editing</strong> — <strong>DaVinci Resolve</strong> (free, pro-grade), <strong>Adobe Premiere Pro</strong>, or <strong>CapCut</strong> for fast social edits.</li>
<li><strong>Audio</strong> — a shotgun or lavalier <strong>mic</strong>; even a phone-clip lav beats built-in mic.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>See</strong> — learn the visual language: shot sizes, angles, composition.</li>
<li><strong>Shoot</strong> — control exposure, light and sound on real footage.</li>
<li><strong>Cut</strong> — edit for story &amp; rhythm; grade the color; add titles.</li>
<li><strong>Publish</strong> — export for the right platform and aspect ratio.</li>
</ol></div>`,
    `<span class="eyebrow">AVP201 · Tài liệu</span>
<h2>Trung tâm tài liệu, công cụ &amp; tham khảo</h2>
<p class="lead">Mọi thứ để bắt đầu <strong>sản xuất video &amp; âm thanh</strong> — từ căn một khung hình đến xuất một clip hoàn chỉnh — gom về một chỗ. AVP201 không có giáo trình FLM nên môn này bám các nguồn sản xuất chuẩn quốc tế. Tài liệu bên dưới đều miễn phí hoặc phổ biến.</p>
<h3>📘 Sách nền tảng</h3>
<ul>
<li><strong>The Filmmaker's Handbook</strong> — Steven Ascher &amp; Edward Pincus (cẩm nang thực hành về máy quay, ánh sáng, âm thanh, hậu kỳ).</li>
<li><strong>In the Blink of an Eye</strong> — Walter Murch (dựng phim thế nào và vì sao; "quy tắc sáu").</li>
</ul>
<h3>🌐 Tài liệu &amp; học nghề miễn phí</h3>
<ul>
<li><a href="https://nofilmschool.com/" target="_blank" rel="noopener">No Film School</a> — bài viết làm phim thực chiến &amp; thiết bị.</li>
<li><a href="https://helpx.adobe.com/premiere-pro/user-guide.html" target="_blank" rel="noopener">Adobe Premiere Pro — Hướng dẫn</a>.</li>
<li><a href="https://www.blackmagicdesign.com/products/davinciresolve/training" target="_blank" rel="noopener">DaVinci Resolve — đào tạo miễn phí</a> (dựng &amp; màu).</li>
</ul>
<h3>🛠️ Công cụ bạn sẽ dùng</h3>
<ul>
<li><strong>Máy quay</strong> — DSLR/mirrorless, máy camcorder, hoặc chỉ một chiếc <strong>điện thoại</strong> đời mới (đủ để bắt đầu).</li>
<li><strong>Dựng phim</strong> — <strong>DaVinci Resolve</strong> (miễn phí, cấp chuyên nghiệp), <strong>Adobe Premiere Pro</strong>, hoặc <strong>CapCut</strong> để dựng social nhanh.</li>
<li><strong>Âm thanh</strong> — mic <strong>shotgun</strong> hoặc <strong>lavalier</strong>; một chiếc lav kẹp điện thoại cũng hơn mic tích hợp.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nhìn</strong> — học ngôn ngữ hình: cỡ cảnh, góc máy, bố cục.</li>
<li><strong>Quay</strong> — làm chủ phơi sáng, ánh sáng và âm thanh trên footage thật.</li>
<li><strong>Dựng</strong> — dựng theo câu chuyện &amp; nhịp; chỉnh màu; thêm chữ.</li>
<li><strong>Phát hành</strong> — xuất đúng nền tảng và tỉ lệ khung hình.</li>
</ol></div>`,
  ]]);

const intro = doc('avp201-0-1-overview', 'Course overview: Audio-Visual Practice|||Tổng quan: Thực hành nghe nhìn',
  'AVP201 làm gì; ba giai đoạn sản xuất (tiền kỳ → quay → hậu kỳ); lộ trình: ngôn ngữ hình → tiền kỳ → máy quay → ánh sáng → âm thanh → dựng → hậu kỳ màu → phát hành nền tảng.',
  [[
    `<span class="eyebrow">AVP201 · Lesson 0.1 · Overview</span>
<h2>Audio-Visual Practice</h2>
<p class="lead">This course is <strong>hands-on video &amp; audio production</strong>. You'll learn to plan, shoot, record, edit and deliver a finished piece — the same pipeline used for a short film, a brand TVC or a social clip.</p>
<h3>The three stages of production</h3>
<ul>
<li><strong>Pre-production</strong> — the idea, script, storyboard, shot list and schedule. Most problems are cheaper to fix here.</li>
<li><strong>Production</strong> — the shoot: camera, exposure, lighting and sound recorded on set.</li>
<li><strong>Post-production</strong> — editing, color grading, sound mixing, titles and export.</li>
</ul>
<p>A simple truth of the craft: <strong>"fix it in pre, not in post."</strong> Good planning and clean capture save hours of rescue work later.</p>
<h3>Roadmap</h3>
<p>Visual language → pre-production → camera &amp; image → lighting &amp; composition → sound → editing → color &amp; graphics → deliverables &amp; platforms. Bilingual, with practical tips, examples and a quiz each chapter.</p>`,
    `<span class="eyebrow">AVP201 · Bài 0.1 · Tổng quan</span>
<h2>Thực hành nghe nhìn</h2>
<p class="lead">Môn này là <strong>thực hành sản xuất video &amp; âm thanh</strong>. Bạn học cách lên kế hoạch, quay, thu, dựng và phát hành một sản phẩm hoàn chỉnh — đúng quy trình dùng cho phim ngắn, TVC thương hiệu hay clip social.</p>
<h3>Ba giai đoạn sản xuất</h3>
<ul>
<li><strong>Tiền kỳ (pre-production)</strong> — ý tưởng, kịch bản, storyboard, shot list và lịch quay. Hầu hết vấn đề sửa ở đây rẻ hơn.</li>
<li><strong>Sản xuất (production)</strong> — buổi quay: máy quay, phơi sáng, ánh sáng và âm thanh thu tại hiện trường.</li>
<li><strong>Hậu kỳ (post-production)</strong> — dựng phim, chỉnh màu, hòa âm, chữ và xuất file.</li>
</ul>
<p>Một chân lý của nghề: <strong>"sửa ở tiền kỳ, đừng để tới hậu kỳ."</strong> Lên kế hoạch tốt và quay sạch tiết kiệm hàng giờ chữa cháy về sau.</p>
<h3>Lộ trình</h3>
<p>Ngôn ngữ hình → tiền kỳ → máy quay &amp; hình ảnh → ánh sáng &amp; bố cục → âm thanh → dựng phim → màu &amp; đồ họa → sản phẩm &amp; nền tảng. Song ngữ, có mẹo thực hành, ví dụ và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('avp201-1-1-visual-language', '1.1 — Visual language & shot sizes|||1.1 — Ngôn ngữ hình & cỡ cảnh',
  'Khung hình, cỡ cảnh (ELS→ECU), góc máy, chuyển động máy (pan/tilt/dolly), quy tắc 180 độ; đọc vị ý nghĩa mỗi cỡ cảnh.',
  [[
    `<span class="eyebrow">AVP201 · Chapter 1 · Lesson 1.1</span>
<h2>Visual language &amp; shot sizes</h2>
<p>Every shot is a <strong>choice</strong> — how much to show, from what angle, and whether the camera moves. That vocabulary is the visual language.</p>
<h3>Shot sizes (how much of the subject fills the frame)</h3>
<pre><code>ELS  Extreme Long Shot -> place &amp; scale (a city, a landscape)
LS   Long / Wide Shot  -> full body + environment
MS   Medium Shot       -> waist up; conversation default
CU   Close-Up          -> face; emotion
ECU  Extreme Close-Up  -> the eyes, a detail; intensity
</code></pre>
<h3>Angle &amp; movement</h3>
<ul>
<li><strong>Angle</strong> — eye-level (neutral), low angle (subject looks powerful), high angle (subject looks small).</li>
<li><strong>Movement</strong> — <em>pan</em> (rotate left/right), <em>tilt</em> (up/down), <em>dolly</em> (move the whole camera in/out).</li>
</ul>
<h3>The 180-degree rule</h3>
<p>Keep the camera on one side of an imaginary line between two subjects, so screen direction stays consistent — cross it and the two people suddenly seem to swap places.</p>
<div class="callout"><span class="badge">Practical tip</span> Shoot <strong>coverage</strong>: a wide to establish, a medium for action, a close-up for emotion. In the edit you'll be grateful you have all three.</div>`,
    `<span class="eyebrow">AVP201 · Chương 1 · Bài 1.1</span>
<h2>Ngôn ngữ hình &amp; cỡ cảnh</h2>
<p>Mỗi cú máy là một <strong>lựa chọn</strong> — cho thấy bao nhiêu, từ góc nào, và máy có di chuyển không. Vốn từ đó chính là ngôn ngữ hình.</p>
<h3>Cỡ cảnh (chủ thể chiếm bao nhiêu khung)</h3>
<pre><code>ELS  Viễn cảnh cực rộng -> bối cảnh &amp; quy mô (thành phố, phong cảnh)
LS   Toàn cảnh / rộng   -> toàn thân + môi trường
MS   Trung cảnh         -> từ hông lên; mặc định khi trò chuyện
CU   Cận cảnh           -> gương mặt; cảm xúc
ECU  Đặc tả             -> đôi mắt, một chi tiết; căng thẳng
</code></pre>
<h3>Góc máy &amp; chuyển động</h3>
<ul>
<li><strong>Góc</strong> — ngang tầm mắt (trung tính), góc thấp (chủ thể mạnh mẽ), góc cao (chủ thể nhỏ bé).</li>
<li><strong>Chuyển động</strong> — <em>pan</em> (xoay trái/phải), <em>tilt</em> (lên/xuống), <em>dolly</em> (đẩy cả máy tiến/lùi).</li>
</ul>
<h3>Quy tắc 180 độ</h3>
<p>Giữ máy ở một phía của đường tưởng tượng nối hai nhân vật, để hướng nhìn trên màn hình nhất quán — vượt qua nó là hai người bỗng như đổi chỗ cho nhau.</p>
<div class="callout"><span class="badge">Mẹo thực hành</span> Hãy quay <strong>coverage</strong>: một cảnh rộng để giới thiệu, một trung cảnh cho hành động, một cận cảnh cho cảm xúc. Khi dựng bạn sẽ mừng vì có đủ cả ba.</div>`,
  ]]);

const c1q = quiz('avp201-quiz-1', 'Quiz 1 — Visual language|||Quiz 1 — Ngôn ngữ hình', [
  { id: 'q1', question: 'Cỡ cảnh nào thường dùng để lột tả cảm xúc trên gương mặt?|||Which shot size best conveys emotion on the face?', options: ['Viễn cảnh (ELS)|||Extreme Long Shot', 'Cận cảnh (CU)|||Close-Up', 'Toàn cảnh (LS)|||Long Shot', 'Trung cảnh (MS)|||Medium Shot'], correctIndex: 1, explanation: 'Close-Up lấy gương mặt đầy khung → mạnh về cảm xúc.' },
  { id: 'q2', question: 'Quy tắc 180 độ giúp giữ điều gì?|||The 180-degree rule keeps what consistent?', options: ['Độ phơi sáng|||Exposure', 'Hướng nhìn trên màn hình|||Screen direction', 'Nhiệt độ màu|||Color temperature', 'Mức âm thanh|||Audio level'], correctIndex: 1, explanation: 'Ở cùng một phía đường 180° → hướng nhìn/chỗ đứng nhất quán.' },
  { id: 'q3', question: 'Chuyển động "tilt" là gì?|||What is a "tilt" move?', options: ['Xoay máy trái/phải|||Rotate left/right', 'Nghiêng máy lên/xuống|||Rotate up/down', 'Đẩy cả máy tiến/lùi|||Move the camera in/out', 'Phóng to bằng ống kính|||Optical zoom'], correctIndex: 1, explanation: 'Tilt = xoay ống kính theo trục dọc (lên/xuống); pan là trái/phải.' },
]);

const c2 = doc('avp201-2-1-preproduction', '2.1 — Pre-production: plan before you shoot|||2.1 — Tiền kỳ: lên kế hoạch trước khi quay',
  'Ý tưởng/concept, kịch bản (script), storyboard, shot list, lịch quay (call sheet); tiền kỳ kỹ = quay nhanh, hậu kỳ nhẹ.',
  [[
    `<span class="eyebrow">AVP201 · Chapter 2 · Lesson 2.1</span>
<h2>Pre-production: plan before you shoot</h2>
<p>Pre-production turns an idea into a plan the whole crew can follow. The better this stage, the less panic on set.</p>
<h3>From idea to shot list</h3>
<ul>
<li><strong>Concept / idea</strong> — what is this piece about, for whom, and what one feeling should it leave?</li>
<li><strong>Script</strong> — dialogue and action; for ads, a two-column script (video left, audio right).</li>
<li><strong>Storyboard</strong> — quick sketches of key frames; you don't need to draw well, just show framing.</li>
<li><strong>Shot list</strong> — every shot to capture, with size, angle and movement.</li>
<li><strong>Schedule / call sheet</strong> — who, where, when; group shots by location, not by story order.</li>
</ul>
<pre><code>Shot list row:
  #  Size  Angle       Move   Description
  4  CU    eye-level   static Hands typing on keyboard
</code></pre>
<div class="callout"><span class="badge">Practical tip</span> Shoot in <strong>location order</strong>, not script order. Setting up lights once per place saves enormous time on the day.</div>`,
    `<span class="eyebrow">AVP201 · Chương 2 · Bài 2.1</span>
<h2>Tiền kỳ: lên kế hoạch trước khi quay</h2>
<p>Tiền kỳ biến ý tưởng thành kế hoạch mà cả ê-kíp bám theo. Giai đoạn này càng kỹ, hiện trường càng ít hoảng loạn.</p>
<h3>Từ ý tưởng đến shot list</h3>
<ul>
<li><strong>Concept / ý tưởng</strong> — sản phẩm nói về gì, cho ai, và để lại một cảm xúc gì?</li>
<li><strong>Kịch bản (script)</strong> — thoại và hành động; với quảng cáo dùng kịch bản hai cột (hình bên trái, tiếng bên phải).</li>
<li><strong>Storyboard</strong> — phác nhanh các khung chính; không cần vẽ đẹp, chỉ cần rõ cách căn khung.</li>
<li><strong>Shot list</strong> — liệt kê mọi cú máy cần quay, kèm cỡ cảnh, góc và chuyển động.</li>
<li><strong>Lịch quay / call sheet</strong> — ai, ở đâu, khi nào; gom cảnh theo địa điểm, không theo thứ tự câu chuyện.</li>
</ul>
<pre><code>Một dòng shot list:
  #  Cỡ    Góc         Máy    Mô tả
  4  CU    ngang mắt   tĩnh   Bàn tay gõ bàn phím
</code></pre>
<div class="callout"><span class="badge">Mẹo thực hành</span> Hãy quay theo <strong>thứ tự địa điểm</strong>, không theo thứ tự kịch bản. Set đèn một lần cho mỗi nơi tiết kiệm rất nhiều thời gian trong ngày quay.</div>`,
  ]]);

const c2q = quiz('avp201-quiz-2', 'Quiz 2 — Pre-production|||Quiz 2 — Tiền kỳ', [
  { id: 'q1', question: 'Tài liệu nào phác nhanh các khung hình chính bằng hình vẽ?|||Which document sketches key frames as pictures?', options: ['Call sheet', 'Storyboard', 'Shot list', 'Script'], correctIndex: 1, explanation: 'Storyboard = phác hình các khung chính để thấy cách căn khung.' },
  { id: 'q2', question: 'Nên sắp lịch quay theo tiêu chí nào để tiết kiệm thời gian?|||To save time, group the shooting schedule by what?', options: ['Thứ tự kịch bản|||Script order', 'Địa điểm|||Location', 'Bảng chữ cái tên diễn viên|||Actor name', 'Độ dài cảnh|||Shot length'], correctIndex: 1, explanation: 'Gom theo địa điểm → set đèn/bối cảnh một lần cho mỗi nơi.' },
  { id: 'q3', question: 'Câu châm ngôn "fix it in pre, not in post" khuyên điều gì?|||What does "fix it in pre, not in post" advise?', options: ['Sửa mọi thứ khi dựng|||Fix everything while editing', 'Giải quyết vấn đề từ khâu lên kế hoạch|||Solve problems during planning', 'Quay càng nhiều càng tốt|||Shoot as much as possible', 'Bỏ qua kịch bản|||Skip the script'], correctIndex: 1, explanation: 'Lên kế hoạch kỹ ở tiền kỳ rẻ và nhanh hơn chữa cháy ở hậu kỳ.' },
]);

const c3 = doc('avp201-3-1-camera-image', '3.1 — Camera & image: the exposure triangle|||3.1 — Máy quay & hình ảnh: tam giác phơi sáng',
  'Phơi sáng, khẩu độ (aperture), tốc độ màn trập (shutter), ISO; ống kính & tiêu cự; độ sâu trường ảnh; cân bằng trắng; tần số khung hình.',
  [[
    `<span class="eyebrow">AVP201 · Chapter 3 · Lesson 3.1</span>
<h2>Camera &amp; image: the exposure triangle</h2>
<p>Correct <strong>exposure</strong> (not too dark, not blown out) comes from balancing three controls.</p>
<h3>The exposure triangle</h3>
<ul>
<li><strong>Aperture (f-stop)</strong> — how wide the lens opens. Low f (f/1.8) = lots of light + shallow depth of field (blurry background).</li>
<li><strong>Shutter speed</strong> — how long each frame is exposed. For natural motion, use <em>double the frame rate</em> (25fps -> 1/50s).</li>
<li><strong>ISO</strong> — sensor sensitivity. Raise it in the dark, but too high adds grain/noise.</li>
</ul>
<h3>Lens, focal length &amp; depth of field</h3>
<p>A <strong>wide</strong> lens (e.g. 24mm) shows more and exaggerates space; a <strong>telephoto</strong> (85mm) compresses and isolates. A wide aperture + longer lens + close subject = a <strong>shallow depth of field</strong> that separates subject from background.</p>
<pre><code>Shutter rule of thumb:
  frame rate 24-25 fps -> shutter ~ 1/50 s
  frame rate 50 fps    -> shutter ~ 1/100 s
</code></pre>
<div class="callout"><span class="badge">Practical tip</span> Set <strong>white balance</strong> to the light (daylight ~5600K, tungsten ~3200K) so skin looks natural — don't leave it on auto for a controlled shoot.</div>`,
    `<span class="eyebrow">AVP201 · Chương 3 · Bài 3.1</span>
<h2>Máy quay &amp; hình ảnh: tam giác phơi sáng</h2>
<p><strong>Phơi sáng</strong> đúng (không tối, không cháy sáng) đến từ việc cân bằng ba nút chỉnh.</p>
<h3>Tam giác phơi sáng</h3>
<ul>
<li><strong>Khẩu độ (f-stop)</strong> — độ mở của ống kính. f nhỏ (f/1.8) = nhiều sáng + độ sâu trường ảnh mỏng (nền mờ).</li>
<li><strong>Tốc độ màn trập</strong> — mỗi khung phơi bao lâu. Để chuyển động tự nhiên, dùng <em>gấp đôi tần số khung</em> (25fps -> 1/50s).</li>
<li><strong>ISO</strong> — độ nhạy cảm biến. Tăng khi thiếu sáng, nhưng cao quá sẽ bị nhiễu hạt.</li>
</ul>
<h3>Ống kính, tiêu cự &amp; độ sâu trường ảnh</h3>
<p>Ống <strong>góc rộng</strong> (vd 24mm) thấy nhiều hơn và phóng đại không gian; ống <strong>tele</strong> (85mm) nén lại và tách chủ thể. Khẩu lớn + ống dài + chủ thể gần = <strong>độ sâu trường ảnh mỏng</strong> tách chủ thể khỏi nền.</p>
<pre><code>Mẹo tốc độ màn trập:
  tần số 24-25 fps -> màn trập ~ 1/50 s
  tần số 50 fps    -> màn trập ~ 1/100 s
</code></pre>
<div class="callout"><span class="badge">Mẹo thực hành</span> Đặt <strong>cân bằng trắng</strong> theo nguồn sáng (ánh ngày ~5600K, đèn dây tóc ~3200K) để da người tự nhiên — đừng để auto khi quay có kiểm soát.</div>`,
  ]]);

const c3q = quiz('avp201-quiz-3', 'Quiz 3 — Camera & image|||Quiz 3 — Máy quay & hình ảnh', [
  { id: 'q1', question: 'Nút nào tạo hiệu ứng "nền mờ" (độ sâu trường ảnh mỏng)?|||Which control creates a blurry background (shallow depth of field)?', options: ['ISO cao|||High ISO', 'Khẩu độ mở lớn (f nhỏ)|||Wide aperture (low f)', 'Màn trập nhanh|||Fast shutter', 'Cân bằng trắng|||White balance'], correctIndex: 1, explanation: 'Khẩu lớn (f nhỏ, vd f/1.8) làm độ sâu trường ảnh mỏng → nền mờ.' },
  { id: 'q2', question: 'Quay 25 fps, tốc độ màn trập "chuẩn điện ảnh" xấp xỉ?|||At 25 fps, the natural "cinematic" shutter is about?', options: ['1/25 s', '1/50 s', '1/500 s', '2 s'], correctIndex: 1, explanation: 'Quy tắc 180° màn trập: ~ gấp đôi tần số khung → 25fps ≈ 1/50s.' },
  { id: 'q3', question: 'Đẩy ISO quá cao gây ra hiện tượng gì?|||Pushing ISO too high causes what?', options: ['Ảnh nét hơn|||Sharper image', 'Nhiễu hạt (noise)|||Grain / noise', 'Màu ấm hơn|||Warmer color', 'Nền mờ hơn|||More blur'], correctIndex: 1, explanation: 'ISO cao tăng độ nhạy nhưng thêm nhiễu hạt vào hình.' },
]);

const c4 = doc('avp201-4-1-lighting-composition', '4.1 — Lighting & composition|||4.1 — Ánh sáng & bố cục',
  'Three-point lighting (key/fill/back), chất sáng cứng/mềm, nhiệt độ màu; quy tắc 1/3, đường dẫn, headroom; dùng màu kể chuyện.',
  [[
    `<span class="eyebrow">AVP201 · Chapter 4 · Lesson 4.1</span>
<h2>Lighting &amp; composition</h2>
<h3>Three-point lighting</h3>
<ul>
<li><strong>Key light</strong> — the main light, set off to one side; defines the shape of the face.</li>
<li><strong>Fill light</strong> — softer, opposite the key; lifts the shadows so they aren't pitch black.</li>
<li><strong>Back light</strong> — behind the subject; rims the hair/shoulders and separates them from the background.</li>
</ul>
<p><strong>Hard light</strong> (bare source) = sharp shadows, drama. <strong>Soft light</strong> (diffused/big source) = gentle, flattering — great for interviews.</p>
<h3>Composition</h3>
<ul>
<li><strong>Rule of thirds</strong> — place the subject on the third-lines, eyes on the upper third; not dead center.</li>
<li><strong>Leading lines</strong> — roads, rails and edges that draw the eye to the subject.</li>
<li><strong>Headroom &amp; look room</strong> — a little space above the head, and space in the direction the subject faces.</li>
</ul>
<div class="callout"><span class="badge">Practical tip</span> No lights? Put your subject <strong>beside a window</strong> for a soft key and bounce light back with a white board or wall as fill. Free three-point.</div>`,
    `<span class="eyebrow">AVP201 · Chương 4 · Bài 4.1</span>
<h2>Ánh sáng &amp; bố cục</h2>
<h3>Chiếu sáng ba điểm</h3>
<ul>
<li><strong>Đèn chính (key)</strong> — nguồn chính, đặt lệch một bên; định hình gương mặt.</li>
<li><strong>Đèn phụ (fill)</strong> — mềm hơn, đối diện key; nâng vùng tối để không đen kịt.</li>
<li><strong>Đèn viền (back)</strong> — sau lưng chủ thể; viền sáng tóc/vai, tách khỏi nền.</li>
</ul>
<p><strong>Sáng cứng</strong> (nguồn trần) = bóng đổ sắc, kịch tính. <strong>Sáng mềm</strong> (tán xạ/nguồn lớn) = dịu, tôn dáng — hợp phỏng vấn.</p>
<h3>Bố cục</h3>
<ul>
<li><strong>Quy tắc 1/3</strong> — đặt chủ thể trên các đường 1/3, mắt ở đường 1/3 trên; đừng để chính giữa.</li>
<li><strong>Đường dẫn</strong> — đường phố, đường ray, mép cạnh dẫn mắt tới chủ thể.</li>
<li><strong>Headroom &amp; look room</strong> — chừa chút khoảng trên đầu, và khoảng theo hướng chủ thể nhìn.</li>
</ul>
<div class="callout"><span class="badge">Mẹo thực hành</span> Không có đèn? Đặt chủ thể <strong>cạnh cửa sổ</strong> làm key mềm, rồi hắt sáng lại bằng tấm trắng/tường làm fill. Ba điểm miễn phí.</div>`,
  ]]);

const c4q = quiz('avp201-quiz-4', 'Quiz 4 — Lighting & composition|||Quiz 4 — Ánh sáng & bố cục', [
  { id: 'q1', question: 'Trong ba điểm sáng, đèn nào tách chủ thể khỏi nền?|||In three-point lighting, which light separates subject from background?', options: ['Đèn chính (key)|||Key light', 'Đèn phụ (fill)|||Fill light', 'Đèn viền (back)|||Back light', 'Đèn nền (background)|||Background light'], correctIndex: 2, explanation: 'Back light viền sáng tóc/vai → tách chủ thể khỏi nền.' },
  { id: 'q2', question: 'Quy tắc 1/3 khuyên đặt chủ thể ở đâu?|||The rule of thirds advises placing the subject where?', options: ['Chính giữa khung|||Dead center', 'Trên các đường 1/3|||On the third-lines', 'Sát mép dưới|||At the bottom edge', 'Sát mép trên|||At the top edge'], correctIndex: 1, explanation: 'Đặt chủ thể/mắt trên đường 1/3 → bố cục cân và hút mắt hơn giữa khung.' },
  { id: 'q3', question: 'Muốn ánh sáng dịu, tôn dáng cho phỏng vấn thì dùng?|||For a gentle, flattering interview look you use?', options: ['Sáng cứng, nguồn trần|||Hard, bare light', 'Sáng mềm, tán xạ|||Soft, diffused light', 'ISO thật cao|||Very high ISO', 'Đèn viền duy nhất|||Only a back light'], correctIndex: 1, explanation: 'Sáng mềm (tán xạ/nguồn lớn) cho bóng đổ dịu, hợp phỏng vấn.' },
]);

const c5 = doc('avp201-5-1-sound', '5.1 — Sound: record, mix, balance|||5.1 — Âm thanh: thu, hòa, cân bằng',
  'Thu âm & loại mic (shotgun/lavalier/dynamic), thoại, room tone, nhạc nền, foley; theo dõi mức (-12 tới -6 dBFS), đeo tai nghe.',
  [[
    `<span class="eyebrow">AVP201 · Chapter 5 · Lesson 5.1</span>
<h2>Sound: record, mix, balance</h2>
<p>Audiences forgive imperfect picture but not bad sound. Half of "video" is audio.</p>
<h3>Microphones</h3>
<ul>
<li><strong>Shotgun</strong> — directional; on a boom just out of frame, above the speaker. Best all-round dialogue mic.</li>
<li><strong>Lavalier (lav)</strong> — tiny clip-on; consistent level as the subject moves. Great for interviews.</li>
<li><strong>Dynamic</strong> — rugged handheld; for presenters, vox-pop and noisy places.</li>
</ul>
<h3>What to capture &amp; how to mix</h3>
<ul>
<li><strong>Dialogue</strong> — get the mic <em>close</em>; distance is the enemy of clean voice.</li>
<li><strong>Room tone</strong> — record 30s of "silence" per location to patch edits later.</li>
<li><strong>Music &amp; foley</strong> — a bed of music sets mood; foley (footsteps, clicks) adds realism.</li>
</ul>
<pre><code>Level guide (digital):
  dialogue peaks  ~ -12 to -6 dBFS
  never touch 0 dBFS -> that is clipping (distortion)
</code></pre>
<div class="callout"><span class="badge">Practical tip</span> Always <strong>monitor with headphones</strong> while recording. A hiss, a rustle or a dead mic is unfixable later — you must hear it on set.</div>`,
    `<span class="eyebrow">AVP201 · Chương 5 · Bài 5.1</span>
<h2>Âm thanh: thu, hòa, cân bằng</h2>
<p>Khán giả tha thứ cho hình chưa hoàn hảo nhưng không tha âm thanh tệ. Một nửa "video" là âm thanh.</p>
<h3>Micro</h3>
<ul>
<li><strong>Shotgun</strong> — định hướng; gắn cần boom ngay ngoài khung, phía trên người nói. Mic thoại đa dụng tốt nhất.</li>
<li><strong>Lavalier (lav)</strong> — mic kẹp nhỏ; mức ổn định khi chủ thể di chuyển. Hợp phỏng vấn.</li>
<li><strong>Dynamic</strong> — mic cầm tay bền; cho người dẫn, phỏng vấn nhanh, nơi ồn.</li>
</ul>
<h3>Thu gì &amp; hòa thế nào</h3>
<ul>
<li><strong>Thoại</strong> — đưa mic tới <em>gần</em>; khoảng cách là kẻ thù của giọng sạch.</li>
<li><strong>Room tone</strong> — thu 30 giây "im lặng" mỗi địa điểm để vá chỗ cắt về sau.</li>
<li><strong>Nhạc &amp; foley</strong> — nền nhạc tạo cảm xúc; foley (tiếng bước chân, tiếng bấm) thêm chân thực.</li>
</ul>
<pre><code>Mức tham chiếu (số):
  đỉnh thoại   ~ -12 tới -6 dBFS
  đừng chạm 0 dBFS -> đó là clipping (méo tiếng)
</code></pre>
<div class="callout"><span class="badge">Mẹo thực hành</span> Luôn <strong>đeo tai nghe theo dõi</strong> khi thu. Tiếng rít, tiếng sột soạt hay mic chết là không sửa được sau — bạn phải nghe ra tại hiện trường.</div>`,
  ]]);

const c5q = quiz('avp201-quiz-5', 'Quiz 5 — Sound|||Quiz 5 — Âm thanh', [
  { id: 'q1', question: 'Mic nào kẹp nhỏ, cho mức ổn định khi chủ thể di chuyển?|||Which mic is a small clip-on giving consistent level as the subject moves?', options: ['Shotgun', 'Lavalier (lav)', 'Dynamic cầm tay|||Handheld dynamic', 'Mic tích hợp máy|||Built-in camera mic'], correctIndex: 1, explanation: 'Lav kẹp gần miệng → mức ổn định dù người di chuyển, hợp phỏng vấn.' },
  { id: 'q2', question: 'Mức đỉnh thoại nên nằm quanh khoảng nào (digital)?|||Dialogue should peak around what digital level?', options: ['0 dBFS', '-12 tới -6 dBFS|||-12 to -6 dBFS', '+6 dBFS', '-60 dBFS'], correctIndex: 1, explanation: 'Chừa headroom: đỉnh ~ -12..-6 dBFS; chạm 0 dBFS là clipping/méo.' },
  { id: 'q3', question: '"Room tone" là gì và thu để làm gì?|||What is "room tone" and why record it?', options: ['Nhạc nền để tạo cảm xúc|||Background music for mood', 'Vài chục giây "im lặng" của phòng để vá chỗ cắt|||Seconds of the room "silence" to patch edits', 'Tiếng foley bước chân|||Footstep foley', 'Giọng đọc lồng tiếng|||Voice-over narration'], correctIndex: 1, explanation: 'Room tone là nền âm tự nhiên của phòng, dùng lấp khoảng trống giữa các cắt cho liền mạch.' },
]);

const c6 = doc('avp201-6-1-editing', '6.1 — Editing: cut, continuity & rhythm|||6.1 — Dựng phim: cắt, liền mạch & nhịp',
  'Cut & continuity, nhịp/pacing, J-cut và L-cut, match cut; "rule of six" của Walter Murch (ưu tiên cảm xúc trước hết).',
  [[
    `<span class="eyebrow">AVP201 · Chapter 6 · Lesson 6.1</span>
<h2>Editing: cut, continuity &amp; rhythm</h2>
<p>Editing is where the story is really written. A <strong>cut</strong> joins two shots; good cutting is invisible and keeps the viewer inside the story.</p>
<h3>Continuity &amp; sound-led cuts</h3>
<ul>
<li><strong>Continuity</strong> — match action, eyelines and screen direction across the cut so it feels seamless.</li>
<li><strong>J-cut</strong> — the <em>audio</em> of the next shot starts before the picture (we hear it, then see it).</li>
<li><strong>L-cut</strong> — the audio of the current shot lingers over the next picture.</li>
<li><strong>Match cut</strong> — cut on a similar shape or motion to link two scenes.</li>
</ul>
<h3>Murch's rule of six</h3>
<pre><code>Priorities when choosing a cut (most important first):
  1. Emotion    (51%)  does the cut feel right?
  2. Story      (23%)  does it advance the story?
  3. Rhythm     (10%)  is it in time?
  4. Eye-trace  ( 7%)  where is the viewer looking?
  5. 2D plane   ( 5%)  stage line / screen geography
  6. 3D space   ( 4%)  real physical continuity
</code></pre>
<div class="callout"><span class="badge">Practical tip</span> When two cut points fight, choose the one that keeps the <strong>emotion</strong> true — Murch would sacrifice perfect continuity for the right feeling.</div>`,
    `<span class="eyebrow">AVP201 · Chương 6 · Bài 6.1</span>
<h2>Dựng phim: cắt, liền mạch &amp; nhịp</h2>
<p>Dựng phim là nơi câu chuyện thực sự được viết. Một <strong>cú cắt</strong> nối hai cảnh; cắt hay thì vô hình và giữ người xem trong câu chuyện.</p>
<h3>Liền mạch &amp; cắt dẫn bằng tiếng</h3>
<ul>
<li><strong>Liền mạch (continuity)</strong> — khớp hành động, hướng mắt và hướng nhìn qua cú cắt để mượt.</li>
<li><strong>J-cut</strong> — <em>tiếng</em> của cảnh sau vào trước hình (nghe trước, rồi mới thấy).</li>
<li><strong>L-cut</strong> — tiếng của cảnh hiện tại kéo dài sang hình cảnh sau.</li>
<li><strong>Match cut</strong> — cắt trên một hình dạng hoặc chuyển động giống nhau để nối hai cảnh.</li>
</ul>
<h3>"Rule of six" của Murch</h3>
<pre><code>Thứ tự ưu tiên khi chọn cú cắt (quan trọng nhất trước):
  1. Cảm xúc     (51%)  cú cắt có "đúng" cảm giác không?
  2. Câu chuyện  (23%)  có đẩy câu chuyện tiến lên?
  3. Nhịp        (10%)  có đúng nhịp?
  4. Hướng mắt   ( 7%)  người xem đang nhìn đâu?
  5. Mặt phẳng 2D( 5%)  đường sân khấu / vị trí trên màn hình
  6. Không gian 3D(4%)  liền mạch vật lý thật
</code></pre>
<div class="callout"><span class="badge">Mẹo thực hành</span> Khi hai điểm cắt "đánh nhau", chọn điểm giữ đúng <strong>cảm xúc</strong> — Murch sẵn sàng hy sinh liền mạch hoàn hảo để lấy cảm giác đúng.</div>`,
  ]]);

const c6q = quiz('avp201-quiz-6', 'Quiz 6 — Editing|||Quiz 6 — Dựng phim', [
  { id: 'q1', question: 'Theo "rule of six" của Murch, tiêu chí quan trọng NHẤT khi cắt là?|||In Murch\'s rule of six, the MOST important criterion is?', options: ['Nhịp|||Rhythm', 'Cảm xúc|||Emotion', 'Không gian 3D|||3D space', 'Hướng mắt|||Eye-trace'], correctIndex: 1, explanation: 'Murch xếp Cảm xúc (51%) cao nhất — trên cả liền mạch không gian.' },
  { id: 'q2', question: 'J-cut nghĩa là gì?|||What is a J-cut?', options: ['Tiếng cảnh sau vào trước hình|||Next shot\'s audio starts before its picture', 'Cắt giữa hai hình giống hệt|||Cut between identical frames', 'Cắt bỏ toàn bộ tiếng|||Remove all audio', 'Chuyển cảnh bằng mờ dần|||A fade transition'], correctIndex: 0, explanation: 'J-cut: audio của cảnh kế vào sớm hơn hình → nghe trước, thấy sau.' },
  { id: 'q3', question: '"Continuity" trong dựng phim đảm bảo điều gì?|||What does "continuity" ensure in editing?', options: ['Màu ấm hơn|||Warmer color', 'Hành động & hướng nhìn khớp qua cú cắt|||Action & eyeline match across the cut', 'Âm lượng lớn hơn|||Louder audio', 'Nhiều hiệu ứng hơn|||More effects'], correctIndex: 1, explanation: 'Liền mạch = khớp hành động, hướng mắt, hướng nhìn để cú cắt vô hình.' },
]);

const c7 = doc('avp201-7-1-color-graphics-export', '7.1 — Color grading, graphics & export|||7.1 — Chỉnh màu, đồ họa & xuất file',
  'Color correction vs grading, LUT, primary/secondary; motion graphics, title/lower-third; xuất file (H.264, bitrate, độ phân giải).',
  [[
    `<span class="eyebrow">AVP201 · Chapter 7 · Lesson 7.1</span>
<h2>Color grading, graphics &amp; export</h2>
<h3>Correction vs grading</h3>
<ul>
<li><strong>Color correction</strong> — fix the footage: neutral white balance, correct exposure, match shots so they look consistent.</li>
<li><strong>Color grading</strong> — the creative look: warm and golden, cold and clinical, teal-and-orange blockbuster.</li>
<li><strong>Primary vs secondary</strong> — primary changes the whole image; secondary isolates a range (just the skin, just the sky).</li>
<li><strong>LUT</strong> — a preset colour transform; a fast starting point, not a substitute for correcting first.</li>
</ul>
<h3>Titles &amp; motion graphics</h3>
<p>Add a <strong>title</strong> and <strong>lower-thirds</strong> (name/role captions). Keep type readable: high contrast, safe margins, on screen long enough to read twice.</p>
<h3>Export</h3>
<pre><code>Common delivery:
  Codec       H.264 (or H.265)
  Container   .mp4
  Resolution  1920x1080 or 3840x2160
  Frame rate  match the timeline (24/25/30)
  Bitrate     higher = better quality + bigger file
</code></pre>
<div class="callout"><span class="badge">Practical tip</span> Always <strong>correct before you grade</strong>. A stylish LUT on top of a wrong white balance just looks broken.</div>`,
    `<span class="eyebrow">AVP201 · Chương 7 · Bài 7.1</span>
<h2>Chỉnh màu, đồ họa &amp; xuất file</h2>
<h3>Correction so với grading</h3>
<ul>
<li><strong>Color correction</strong> — sửa footage: cân bằng trắng trung tính, đúng phơi sáng, khớp các cảnh cho đồng nhất.</li>
<li><strong>Color grading</strong> — tạo "look" sáng tạo: ấm vàng, lạnh sạch, hay teal-and-orange kiểu bom tấn.</li>
<li><strong>Primary so với secondary</strong> — primary đổi cả khung; secondary tách một dải riêng (chỉ da, chỉ trời).</li>
<li><strong>LUT</strong> — một phép biến đổi màu định sẵn; điểm bắt đầu nhanh, không thay cho việc correction trước.</li>
</ul>
<h3>Chữ &amp; motion graphics</h3>
<p>Thêm <strong>title</strong> và <strong>lower-third</strong> (chú thích tên/chức danh). Giữ chữ dễ đọc: tương phản cao, chừa lề an toàn, để đủ lâu để đọc được hai lần.</p>
<h3>Xuất file</h3>
<pre><code>Thông số phát hành phổ biến:
  Codec        H.264 (hoặc H.265)
  Định dạng    .mp4
  Độ phân giải 1920x1080 hoặc 3840x2160
  Tần số khung khớp timeline (24/25/30)
  Bitrate      cao hơn = chất lượng tốt hơn + file lớn hơn
</code></pre>
<div class="callout"><span class="badge">Mẹo thực hành</span> Luôn <strong>correction trước khi grade</strong>. Dán một LUT bay bổng lên cân bằng trắng sai chỉ khiến hình trông hỏng.</div>`,
  ]]);

const c7q = quiz('avp201-quiz-7', 'Quiz 7 — Color & export|||Quiz 7 — Màu & xuất file', [
  { id: 'q1', question: 'Đâu là bước SỬA footage cho trung tính, đúng phơi sáng?|||Which step fixes footage to neutral, correct exposure?', options: ['Color grading', 'Color correction', 'Thêm LUT sáng tạo|||Adding a creative LUT', 'Motion graphics'], correctIndex: 1, explanation: 'Correction = sửa cho đúng/đồng nhất; grading là tạo look sáng tạo sau đó.' },
  { id: 'q2', question: 'Codec phổ biến để xuất video web/social là?|||A common codec for exporting web/social video is?', options: ['H.264', 'WAV', 'PNG', 'ZIP'], correctIndex: 0, explanation: 'H.264 (hoặc H.265) trong container .mp4 là chuẩn phát hành phổ biến.' },
  { id: 'q3', question: 'Chỉnh màu chỉ riêng vùng da mà không đụng cả khung là?|||Adjusting only the skin without touching the whole frame is?', options: ['Primary correction', 'Secondary correction', 'Xuất file|||Export', 'Lower-third'], correctIndex: 1, explanation: 'Secondary tách một dải/vùng (da, trời) để chỉnh riêng; primary đổi cả khung.' },
]);

const c8 = doc('avp201-8-1-deliverables-platforms', '8.1 — Deliverables & platforms|||8.1 — Sản phẩm & nền tảng',
  'TVC, social video, short-form (Reels/TikTok/Shorts); tỉ lệ khung 16:9 / 9:16 / 1:1; hook 3 giây đầu, phụ đề, tối ưu từng nền tảng.',
  [[
    `<span class="eyebrow">AVP201 · Chapter 8 · Lesson 8.1</span>
<h2>Deliverables &amp; platforms</h2>
<p>The same story is finished differently for each destination. Match the <strong>format</strong> to where it will be watched.</p>
<h3>Formats</h3>
<ul>
<li><strong>TVC / brand film</strong> — polished, 15-30s, a clear message and call to action.</li>
<li><strong>Social video</strong> — informative or entertaining; designed to be watched on a phone, often on mute.</li>
<li><strong>Short-form</strong> — Reels, TikTok, YouTube Shorts; vertical, fast, hook-driven.</li>
</ul>
<h3>Aspect ratios</h3>
<pre><code>16:9  landscape  -> YouTube, TV, web players
9:16  vertical   -> Reels, TikTok, Shorts, Stories
1:1   square     -> feed posts (space-efficient)
</code></pre>
<h3>Platform optimization</h3>
<ul>
<li><strong>Hook in 3 seconds</strong> — the first frames decide whether anyone keeps watching.</li>
<li><strong>Burn-in captions</strong> — most feed video plays muted; on-screen text carries the message.</li>
<li><strong>Safe zones</strong> — keep key content away from edges where UI (buttons, captions) overlaps.</li>
</ul>
<div class="callout"><span class="badge">Practical tip</span> Shoot with delivery in mind: if it's going to TikTok, frame <strong>vertically on set</strong> — cropping 16:9 to 9:16 in post throws away half your picture.</div>`,
    `<span class="eyebrow">AVP201 · Chương 8 · Bài 8.1</span>
<h2>Sản phẩm &amp; nền tảng</h2>
<p>Cùng một câu chuyện được hoàn thiện khác nhau cho mỗi nơi phát. Khớp <strong>định dạng</strong> với nơi nó sẽ được xem.</p>
<h3>Các định dạng</h3>
<ul>
<li><strong>TVC / phim thương hiệu</strong> — chỉn chu, 15-30 giây, một thông điệp rõ và lời kêu gọi hành động.</li>
<li><strong>Social video</strong> — thông tin hoặc giải trí; làm để xem trên điện thoại, thường ở chế độ tắt tiếng.</li>
<li><strong>Short-form</strong> — Reels, TikTok, YouTube Shorts; dọc, nhanh, dẫn dắt bằng hook.</li>
</ul>
<h3>Tỉ lệ khung hình</h3>
<pre><code>16:9  ngang  -> YouTube, TV, trình phát web
9:16  dọc    -> Reels, TikTok, Shorts, Stories
1:1   vuông  -> bài đăng feed (gọn không gian)
</code></pre>
<h3>Tối ưu theo nền tảng</h3>
<ul>
<li><strong>Hook trong 3 giây</strong> — vài khung đầu quyết định người ta có xem tiếp không.</li>
<li><strong>Phụ đề dán cứng</strong> — phần lớn video feed phát tắt tiếng; chữ trên hình gánh thông điệp.</li>
<li><strong>Vùng an toàn</strong> — giữ nội dung chính tránh xa mép nơi UI (nút, chú thích) đè lên.</li>
</ul>
<div class="callout"><span class="badge">Mẹo thực hành</span> Quay với đích phát trong đầu: nếu lên TikTok, hãy căn khung <strong>dọc ngay khi quay</strong> — cắt 16:9 xuống 9:16 ở hậu kỳ là vứt đi nửa khung hình.</div>`,
  ]]);

const c8q = quiz('avp201-quiz-8', 'Quiz 8 — Deliverables & platforms|||Quiz 8 — Sản phẩm & nền tảng', [
  { id: 'q1', question: 'Tỉ lệ khung nào hợp cho Reels/TikTok/Shorts?|||Which aspect ratio suits Reels/TikTok/Shorts?', options: ['16:9 (ngang)|||16:9 (landscape)', '9:16 (dọc)|||9:16 (vertical)', '4:3', '2.39:1'], correctIndex: 1, explanation: 'Short-form xem trên điện thoại theo chiều dọc → 9:16.' },
  { id: 'q2', question: 'Vì sao "hook trong 3 giây đầu" quan trọng với video social?|||Why does a "3-second hook" matter for social video?', options: ['Vì file nhẹ hơn|||It shrinks the file', 'Vài khung đầu quyết định người xem ở lại hay lướt|||The first frames decide if viewers stay or scroll', 'Vì tăng độ phân giải|||It raises resolution', 'Vì đổi codec|||It changes the codec'], correctIndex: 1, explanation: 'Trên feed người xem lướt rất nhanh; mở đầu yếu là mất người xem ngay.' },
  { id: 'q3', question: 'Vì sao nên dán phụ đề (burn-in captions) cho video feed?|||Why burn in captions for feed video?', options: ['Vì luật cấm âm thanh|||Audio is banned by law', 'Vì phần lớn video feed phát khi tắt tiếng|||Most feed video autoplays muted', 'Vì làm màu đẹp hơn|||It improves color', 'Vì giảm bitrate|||It lowers bitrate'], correctIndex: 1, explanation: 'Đa số người lướt feed để tắt tiếng → chữ trên hình gánh thông điệp.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'AVP201',
    slug: 'avp201-audio-visual-practice',
    title: 'Audio-Visual Practice',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/AVP201.webp',
    shortDescription: 'Hands-on video & audio production: shot language, pre-production, camera & exposure, lighting, sound, editing (Murch), color grading & export, delivery for TVC & social. Bilingual, practical tips & quizzes.|||Thực hành sản xuất video & âm thanh: ngôn ngữ hình, tiền kỳ, máy quay & phơi sáng, ánh sáng, âm thanh, dựng phim (Murch), chỉnh màu & xuất, phát hành cho TVC & social. Song ngữ, mẹo & quiz.',
    description: 'Môn <strong>AVP201 — Audio-Visual Practice</strong> (kỳ 3, khối Công nghệ Truyền thông) là môn <strong>thực hành sản xuất video &amp; âm thanh</strong>. Đi qua trọn quy trình: <strong>ngôn ngữ hình &amp; cỡ cảnh</strong> → <strong>tiền kỳ</strong> (kịch bản, storyboard, shot list, lịch quay) → <strong>máy quay</strong> (tam giác phơi sáng, ống kính, độ sâu trường ảnh) → <strong>ánh sáng &amp; bố cục</strong> (three-point, quy tắc 1/3) → <strong>âm thanh</strong> (mic, thu, hòa) → <strong>dựng phim</strong> (J/L cut, rule of six của Murch) → <strong>hậu kỳ màu &amp; đồ họa</strong> → <strong>sản phẩm &amp; nền tảng</strong>. Không có FLM nên bám giáo trình sản xuất chuẩn quốc tế; song ngữ, có mẹo thực hành, ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Cỡ cảnh (ELS→ECU), góc máy, quy tắc 180 độ; tiền kỳ (concept, script, storyboard, shot list, call sheet); tam giác phơi sáng (khẩu/tốc/ISO), ống kính & độ sâu trường ảnh, cân bằng trắng; chiếu sáng ba điểm, quy tắc 1/3, đường dẫn; mic (shotgun/lav/dynamic), mức -12..-6 dBFS, room tone, foley; cut & continuity, J/L cut, rule of six của Murch; color correction vs grading, LUT, title/lower-third, xuất H.264; tỉ lệ 16:9 / 9:16 / 1:1, hook 3 giây, phụ đề, tối ưu nền tảng.',
    requirements: 'Không cần kinh nghiệm trước. Có một chiếc điện thoại quay được video là đủ để thực hành; nên cài một phần mềm dựng miễn phí (DaVinci Resolve hoặc CapCut).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách sản xuất kinh điển, tài liệu Premiere/DaVinci, công cụ, lộ trình 4 bước.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Ba giai đoạn sản xuất, lộ trình môn.', lessons: [intro] },
    { title: 'Chương 1 — Ngôn ngữ hình|||Chapter 1 — Visual language', description: 'Cỡ cảnh, góc máy, chuyển động, quy tắc 180°.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Tiền kỳ|||Chapter 2 — Pre-production', description: 'Concept, script, storyboard, shot list, lịch quay.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Máy quay & hình ảnh|||Chapter 3 — Camera & image', description: 'Tam giác phơi sáng, ống kính, độ sâu trường ảnh.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Ánh sáng & bố cục|||Chapter 4 — Lighting & composition', description: 'Three-point, quy tắc 1/3, đường dẫn, màu.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Âm thanh|||Chapter 5 — Sound', description: 'Mic, thu thoại, room tone, nhạc, foley, cân mức.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Dựng phim|||Chapter 6 — Editing', description: 'Cut, continuity, nhịp, J/L cut, rule of six.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Hậu kỳ màu & đồ họa|||Chapter 7 — Color & graphics', description: 'Correction vs grading, LUT, title, xuất file.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Sản phẩm & nền tảng|||Chapter 8 — Deliverables & platforms', description: 'TVC, social, short-form, tỉ lệ khung, tối ưu nền tảng.', lessons: [c8, c8q] },
  ],
};
