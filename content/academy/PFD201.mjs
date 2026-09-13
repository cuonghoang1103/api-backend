/**
 * PFD201 — Photography for Designer (Nhiếp ảnh cho nhà thiết kế). Ngành Thiết kế
 * mỹ thuật số FPTU, kỳ 2. Khung chất lượng: tam giác phơi sáng, khẩu độ & DOF,
 * tốc độ & chuyển động, bố cục, ánh sáng, màu & cân bằng trắng, hậu kỳ Lightroom
 * cho thiết kế. Sách chuẩn: Bryan Peterson "Understanding Exposure", Michael
 * Freeman "The Photographer's Eye", Ansel Adams series. Song ngữ + ví dụ + quiz.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('pfd201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Peterson, Freeman, Adams), tài liệu chính thức miễn phí, YouTube, công cụ (Lightroom), lộ trình 4 bước.',
  [[
    `<span class="eyebrow">PFD201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Photography for Designer</strong> — exposure, aperture &amp; depth of field, shutter &amp; motion, composition, light, colour, and post-processing for design — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for PFD201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Understanding Exposure</em> — Bryan Peterson (the exposure triangle, made intuitive).</li>
<li><em>The Photographer's Eye</em> — Michael Freeman (composition &amp; visual design).</li>
<li><em>The Camera / The Negative / The Print</em> — Ansel Adams (the classic craft series &amp; the Zone System).</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://helpx.adobe.com/lightroom-cc/user-guide.html" target="_blank" rel="noopener">Adobe Lightroom — official user guide</a></li>
<li><a href="https://www.cambridgeincolour.com/tutorials.htm" target="_blank" rel="noopener">Cambridge in Colour — photography tutorials</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@seantucker" target="_blank" rel="noopener">Sean Tucker</a> — light, composition &amp; the craft of seeing</li>
<li><a href="https://www.youtube.com/@ThomasHeaton" target="_blank" rel="noopener">Thomas Heaton</a> — practical field photography</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.adobe.com/products/photoshop-lightroom.html" target="_blank" rel="noopener">Adobe Lightroom</a> — cull, edit &amp; export</li>
<li><a href="https://www.darktable.org/" target="_blank" rel="noopener">darktable</a> — free, open-source RAW developer</li>
<li><a href="https://coolors.co/" target="_blank" rel="noopener">Coolors</a> — pull palettes from your photos for design use</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — the exposure triangle (aperture, shutter, ISO) until you can set them by feel.</li>
<li><strong>Craft</strong> — depth of field &amp; motion: choose them on purpose, not by accident.</li>
<li><strong>See</strong> — composition &amp; light: frame, direct the eye, read the quality of light.</li>
<li><strong>Deliver</strong> — colour, white balance &amp; Lightroom edits that serve a design brief.</li>
</ol></div>`,
    `<span class="eyebrow">PFD201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Nhiếp ảnh cho nhà thiết kế</strong> — phơi sáng, khẩu độ &amp; độ sâu trường ảnh, tốc độ &amp; chuyển động, bố cục, ánh sáng, màu, và hậu kỳ cho thiết kế — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của PFD201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Understanding Exposure</em> — Bryan Peterson (tam giác phơi sáng, giảng cực dễ hiểu).</li>
<li><em>The Photographer's Eye</em> — Michael Freeman (bố cục &amp; thiết kế thị giác).</li>
<li><em>The Camera / The Negative / The Print</em> — Ansel Adams (bộ sách nghề kinh điển &amp; Hệ vùng - Zone System).</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://helpx.adobe.com/lightroom-cc/user-guide.html" target="_blank" rel="noopener">Adobe Lightroom — hướng dẫn chính thức</a></li>
<li><a href="https://www.cambridgeincolour.com/tutorials.htm" target="_blank" rel="noopener">Cambridge in Colour — hướng dẫn nhiếp ảnh</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@seantucker" target="_blank" rel="noopener">Sean Tucker</a> — ánh sáng, bố cục &amp; nghề nhìn</li>
<li><a href="https://www.youtube.com/@ThomasHeaton" target="_blank" rel="noopener">Thomas Heaton</a> — chụp ngoài thực địa</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.adobe.com/products/photoshop-lightroom.html" target="_blank" rel="noopener">Adobe Lightroom</a> — lọc, chỉnh &amp; xuất ảnh</li>
<li><a href="https://www.darktable.org/" target="_blank" rel="noopener">darktable</a> — phần mềm RAW mã nguồn mở, miễn phí</li>
<li><a href="https://coolors.co/" target="_blank" rel="noopener">Coolors</a> — rút bảng màu từ ảnh để dùng cho thiết kế</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền</strong> — tam giác phơi sáng (khẩu độ, tốc độ, ISO) đến khi đặt được theo cảm giác.</li>
<li><strong>Nghề</strong> — độ sâu trường ảnh &amp; chuyển động: chọn có chủ đích, không phải tình cờ.</li>
<li><strong>Nhìn</strong> — bố cục &amp; ánh sáng: dựng khung, dẫn mắt, đọc chất lượng ánh sáng.</li>
<li><strong>Giao</strong> — màu, cân bằng trắng &amp; chỉnh Lightroom phục vụ một brief thiết kế.</li>
</ol></div>`,
  ]]);

const intro = doc('pfd201-0-1-overview', 'Course overview: Photography for designers|||Tổng quan: Nhiếp ảnh cho nhà thiết kế',
  'Nhiếp ảnh làm gì cho nhà thiết kế; ba trụ (phơi sáng, bố cục, ánh sáng); lộ trình 4 bước: phơi sáng → khẩu độ/tốc độ → bố cục & ánh sáng → màu & hậu kỳ.',
  [[
    `<span class="eyebrow">PFD201 · Lesson 0.1 · Overview</span>
<h2>Photography for Designer</h2>
<p class="lead">This course teaches designers to <strong>make images on purpose</strong> — not to leave the camera on "Auto" and hope. You'll master the <strong>exposure triangle</strong>, learn to <strong>compose</strong> and <strong>read light</strong>, control <strong>colour &amp; white balance</strong>, and finish images in <strong>Adobe Lightroom</strong> so they serve a design brief (branding, product, web, print).</p>
<h3>Why a designer needs this</h3>
<p>Designers constantly source, shoot, art-direct and retouch photographs. Understanding how a photo is made — and why one "just works" — lets you brief a shoot, pick the right frame, and edit colour to match a palette instead of fighting it.</p>
<h3>The three pillars</h3>
<ul>
<li><strong>Exposure</strong> — aperture, shutter speed and ISO: how much light, and how it's captured.</li>
<li><strong>Composition</strong> — where things sit in the frame and how the eye travels.</li>
<li><strong>Light</strong> — direction, quality and colour of light, the raw material of every photo.</li>
</ul>
<h3>Roadmap</h3>
<p>Camera &amp; basics → the exposure triangle → aperture &amp; depth of field → shutter &amp; motion → composition → light → colour &amp; white balance → post-processing &amp; design use. Bilingual, with real settings and worked examples, plus a quiz each chapter.</p>`,
    `<span class="eyebrow">PFD201 · Bài 0.1 · Tổng quan</span>
<h2>Nhiếp ảnh cho nhà thiết kế</h2>
<p class="lead">Môn này dạy nhà thiết kế <strong>tạo ra ảnh có chủ đích</strong> — không để máy ở chế độ "Auto" rồi cầu may. Bạn nắm vững <strong>tam giác phơi sáng</strong>, học cách <strong>bố cục</strong> và <strong>đọc ánh sáng</strong>, kiểm soát <strong>màu &amp; cân bằng trắng</strong>, và hoàn thiện ảnh bằng <strong>Adobe Lightroom</strong> sao cho phục vụ một brief thiết kế (thương hiệu, sản phẩm, web, in ấn).</p>
<h3>Vì sao nhà thiết kế cần môn này</h3>
<p>Nhà thiết kế thường xuyên tìm, chụp, chỉ đạo nghệ thuật và chỉnh sửa ảnh. Hiểu một tấm ảnh được tạo ra thế nào — và vì sao nó "đẹp một cách tự nhiên" — giúp bạn brief buổi chụp, chọn đúng khung hình, và chỉnh màu khớp với bảng màu thay vì chống lại nó.</p>
<h3>Ba trụ cột</h3>
<ul>
<li><strong>Phơi sáng</strong> — khẩu độ, tốc độ màn trập và ISO: lấy bao nhiêu sáng, và ghi lại thế nào.</li>
<li><strong>Bố cục</strong> — mọi thứ nằm ở đâu trong khung và mắt di chuyển ra sao.</li>
<li><strong>Ánh sáng</strong> — hướng, chất và màu của ánh sáng, nguyên liệu thô của mọi tấm ảnh.</li>
</ul>
<h3>Lộ trình</h3>
<p>Máy ảnh &amp; cơ bản → tam giác phơi sáng → khẩu độ &amp; độ sâu trường ảnh → tốc độ &amp; chuyển động → bố cục → ánh sáng → màu &amp; cân bằng trắng → hậu kỳ &amp; ứng dụng thiết kế. Song ngữ, có thông số thật và ví dụ mẫu, kèm quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('pfd201-1-1-camera-basics', '1.1 — The camera &amp; the basics|||1.1 — Máy ảnh &amp; cơ bản',
  'Loại máy (DSLR, mirrorless, điện thoại), cảm biến (full-frame vs crop), ống kính, tiêu cự (mm) và góc nhìn; RAW vs JPEG.',
  [[
    `<span class="eyebrow">PFD201 · Chapter 1 · Lesson 1.1</span>
<h2>The camera &amp; the basics</h2>
<h3>Camera types</h3>
<ul>
<li><strong>DSLR</strong> — a mirror bounces the scene to an optical viewfinder; robust, huge lens choice.</li>
<li><strong>Mirrorless</strong> — no mirror; lighter, with a live electronic viewfinder that previews exposure. The current standard.</li>
<li><strong>Smartphone</strong> — tiny sensor but powerful computational processing; always with you.</li>
</ul>
<h3>The sensor</h3>
<p>The sensor records the light. A <strong>full-frame</strong> sensor (36×24&nbsp;mm) gathers more light and blurs backgrounds more easily; a smaller <strong>crop</strong> sensor (APS-C) applies a "crop factor" (≈1.5×) that makes a 35&nbsp;mm lens frame like a 52&nbsp;mm.</p>
<h3>Lens &amp; focal length</h3>
<p>Focal length (in <strong>mm</strong>) sets the angle of view:</p>
<pre><code>Wide     16-35mm  -> landscapes, interiors, wide context
Standard 35-70mm  -> "normal", close to how the eye sees
Tele     70-200mm+ -> portraits, compression, distant subjects
</code></pre>
<h3>RAW vs JPEG</h3>
<p>A <strong>JPEG</strong> is baked and compressed in-camera. A <strong>RAW</strong> keeps all the sensor data, so you can recover highlights/shadows and set white balance later — the format designers should shoot for maximum editing latitude.</p>
<div class="callout"><span class="badge">For designers</span> Focal length changes proportions: wide lenses exaggerate a foreground product; short telephotos (85&nbsp;mm) flatter faces for brand portraits.</div>`,
    `<span class="eyebrow">PFD201 · Chương 1 · Bài 1.1</span>
<h2>Máy ảnh &amp; cơ bản</h2>
<h3>Các loại máy ảnh</h3>
<ul>
<li><strong>DSLR</strong> — gương phản chiếu cảnh lên kính ngắm quang; bền, kho ống kính khổng lồ.</li>
<li><strong>Mirrorless (không gương)</strong> — nhẹ hơn, kính ngắm điện tử xem trước được phơi sáng. Chuẩn hiện nay.</li>
<li><strong>Điện thoại</strong> — cảm biến nhỏ nhưng xử lý điện toán mạnh; luôn ở bên bạn.</li>
</ul>
<h3>Cảm biến</h3>
<p>Cảm biến ghi lại ánh sáng. Cảm biến <strong>full-frame</strong> (36×24&nbsp;mm) thu nhiều sáng hơn và xoá phông dễ hơn; cảm biến <strong>crop</strong> (APS-C) nhỏ hơn có "hệ số crop" (≈1,5×) khiến ống 35&nbsp;mm cho khung như 52&nbsp;mm.</p>
<h3>Ống kính &amp; tiêu cự</h3>
<p>Tiêu cự (đơn vị <strong>mm</strong>) quyết định góc nhìn:</p>
<pre><code>Góc rộng  16-35mm  -> phong cảnh, nội thất, bối cảnh rộng
Tiêu chuẩn 35-70mm -> "thường", gần với cách mắt nhìn
Tele      70-200mm+ -> chân dung, nén cảnh, chủ thể ở xa
</code></pre>
<h3>RAW so với JPEG</h3>
<p><strong>JPEG</strong> đã được máy xử lý và nén sẵn. <strong>RAW</strong> giữ toàn bộ dữ liệu cảm biến, nên bạn cứu được vùng sáng/tối và đặt cân bằng trắng về sau — định dạng nhà thiết kế nên chụp để có biên độ chỉnh sửa lớn nhất.</p>
<div class="callout"><span class="badge">Cho nhà thiết kế</span> Tiêu cự làm đổi tỉ lệ: ống rộng phóng đại sản phẩm ở tiền cảnh; tele ngắn (85&nbsp;mm) làm khuôn mặt đẹp hơn cho chân dung thương hiệu.</div>`,
  ]]);

const c1q = quiz('pfd201-quiz-1', 'Quiz 1 — Camera &amp; basics|||Quiz 1 — Máy ảnh &amp; cơ bản', [
  { id: 'q1', question: 'A larger (full-frame) sensor generally makes it easier to?|||Cảm biến lớn hơn (full-frame) nhìn chung giúp dễ?', options: ['Blur the background|||Xoá phông', 'Freeze fast motion by itself|||Tự đóng băng chuyển động nhanh', 'Zoom optically|||Zoom quang học', 'Add colour|||Thêm màu'], correctIndex: 0, explanation: 'Cảm biến lớn thu nhiều sáng và tạo độ sâu trường ảnh mỏng dễ hơn → xoá phông.' },
  { id: 'q2', question: 'Which focal length is typical for flattering brand portraits?|||Tiêu cự nào hợp cho chân dung thương hiệu đẹp?', options: ['16mm rộng|||16mm góc rộng', '85mm tele ngắn|||85mm tele ngắn', '8mm mắt cá|||8mm mắt cá', 'Không liên quan|||Không liên quan'], correctIndex: 1, explanation: 'Tele ngắn (~85mm) ít méo khuôn mặt, cho tỉ lệ tự nhiên.' },
  { id: 'q3', question: 'Why should designers shoot RAW?|||Vì sao nhà thiết kế nên chụp RAW?', options: ['File nhỏ hơn|||File nhỏ hơn', 'Giữ mọi dữ liệu để chỉnh sáng/màu/WB sau|||Giữ mọi dữ liệu để chỉnh sáng/màu/WB sau', 'Đăng web nhanh hơn|||Đăng web nhanh hơn', 'Máy chụp nhanh hơn|||Máy chụp nhanh hơn'], correctIndex: 1, explanation: 'RAW giữ toàn bộ dữ liệu cảm biến → biên độ chỉnh sửa lớn nhất.' },
]);

const c2 = doc('pfd201-2-1-exposure-triangle', '2.1 — The exposure triangle|||2.1 — Tam giác phơi sáng',
  'Ba biến của phơi sáng: khẩu độ (f-stop), tốc độ màn trập (giây), ISO (độ nhạy); "stop" và cách đánh đổi cân bằng để phơi sáng đúng.',
  [[
    `<span class="eyebrow">PFD201 · Chapter 2 · Lesson 2.1</span>
<h2>The exposure triangle</h2>
<p class="lead"><strong>Exposure</strong> is how bright the final image is. Three controls set it, and they trade off against each other — this is the heart of the whole course.</p>
<h3>The three controls</h3>
<ul>
<li><strong>Aperture (f-stop)</strong> — how wide the lens opens. Small number (f/1.8) = big opening, more light; large number (f/16) = small opening, less light.</li>
<li><strong>Shutter speed</strong> — how long the sensor is exposed, in seconds (1/1000s, 1/60s, 1s).</li>
<li><strong>ISO</strong> — the sensor's sensitivity. ISO 100 is clean; ISO 6400 is brighter but noisier.</li>
</ul>
<h3>Stops</h3>
<p>A <strong>stop</strong> is a doubling or halving of light. Open the aperture one stop and you can halve the shutter time (or drop ISO one stop) for the same brightness — that's the balance you're always negotiating.</p>
<pre><code>Same exposure, three balances:
 A)  f/2.8  ·  1/500s  ·  ISO 100   (bright day, blurry background)
 B)  f/8    ·  1/60s   ·  ISO 100   (everything sharp, needs steady hands)
 C)  f/2.8  ·  1/60s   ·  ISO 100   -> OVER-exposed by 3 stops
</code></pre>
<div class="callout"><span class="badge">Key idea</span> There is no single "correct" set of numbers — only the balance that gives correct brightness AND the depth of field / motion you want.</div>`,
    `<span class="eyebrow">PFD201 · Chương 2 · Bài 2.1</span>
<h2>Tam giác phơi sáng</h2>
<p class="lead"><strong>Phơi sáng</strong> là độ sáng của ảnh cuối. Ba nút điều khiển quyết định nó, và chúng đánh đổi lẫn nhau — đây là trái tim của cả môn học.</p>
<h3>Ba nút điều khiển</h3>
<ul>
<li><strong>Khẩu độ (f-stop)</strong> — độ mở của ống kính. Số nhỏ (f/1.8) = mở lớn, nhiều sáng; số lớn (f/16) = mở nhỏ, ít sáng.</li>
<li><strong>Tốc độ màn trập</strong> — cảm biến phơi bao lâu, tính bằng giây (1/1000s, 1/60s, 1s).</li>
<li><strong>ISO</strong> — độ nhạy của cảm biến. ISO 100 sạch; ISO 6400 sáng hơn nhưng nhiễu hơn.</li>
</ul>
<h3>Khái niệm "stop"</h3>
<p>Một <strong>stop</strong> là gấp đôi hoặc chia đôi lượng sáng. Mở khẩu một stop thì bạn có thể giảm thời gian màn trập một nửa (hoặc hạ ISO một stop) mà vẫn cùng độ sáng — đó là sự cân bằng bạn luôn phải thương lượng.</p>
<pre><code>Cùng độ phơi sáng, ba cách cân bằng:
 A)  f/2.8  ·  1/500s  ·  ISO 100   (ngày nắng, phông mờ)
 B)  f/8    ·  1/60s   ·  ISO 100   (mọi thứ nét, cần tay chắc)
 C)  f/2.8  ·  1/60s   ·  ISO 100   -> DƯ sáng 3 stop
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Không có bộ số "đúng" duy nhất — chỉ có sự cân bằng cho độ sáng đúng VÀ độ sâu trường ảnh / chuyển động mà bạn muốn.</div>`,
  ]]);

const c2q = quiz('pfd201-quiz-2', 'Quiz 2 — Exposure triangle|||Quiz 2 — Tam giác phơi sáng', [
  { id: 'q1', question: 'The three controls of exposure are?|||Ba nút điều khiển phơi sáng là?', options: ['Focus, zoom, flash|||Lấy nét, zoom, đèn', 'Aperture, shutter speed, ISO|||Khẩu độ, tốc độ màn trập, ISO', 'Colour, contrast, crop|||Màu, tương phản, cắt', 'RAW, JPEG, PNG|||RAW, JPEG, PNG'], correctIndex: 1, explanation: 'Phơi sáng do khẩu độ, tốc độ, ISO cùng quyết định.' },
  { id: 'q2', question: 'A smaller aperture number like f/1.8 means?|||Số khẩu nhỏ như f/1.8 nghĩa là?', options: ['Ống mở LỚN, nhiều sáng|||Ống mở LỚN, nhiều sáng', 'Ống mở nhỏ, ít sáng|||Ống mở nhỏ, ít sáng', 'Tốc độ nhanh hơn|||Tốc độ nhanh hơn', 'ISO cao hơn|||ISO cao hơn'], correctIndex: 0, explanation: 'Số f nhỏ = khẩu mở lớn = nhiều sáng vào (và phông mờ hơn).' },
  { id: 'q3', question: 'Raising ISO makes the image brighter but also?|||Tăng ISO làm ảnh sáng hơn nhưng cũng?', options: ['Nét hơn|||Nét hơn', 'Nhiễu (noise) hơn|||Nhiễu (noise) hơn', 'Mờ phông hơn|||Mờ phông hơn', 'Đổi màu|||Đổi màu'], correctIndex: 1, explanation: 'ISO cao khuếch đại tín hiệu → tăng độ sáng kèm nhiễu.' },
]);

const c3 = doc('pfd201-3-1-aperture-dof', '3.1 — Aperture &amp; depth of field|||3.1 — Khẩu độ &amp; độ sâu trường ảnh',
  'Khẩu độ điều khiển độ sâu trường ảnh (DOF): f nhỏ = phông mờ (bokeh), f lớn = mọi thứ nét; khẩu độ sáng tạo cho chân dung, sản phẩm, phong cảnh.',
  [[
    `<span class="eyebrow">PFD201 · Chapter 3 · Lesson 3.1</span>
<h2>Aperture &amp; depth of field</h2>
<p class="lead">Beyond brightness, aperture is your main creative control over <strong>what is in focus</strong>.</p>
<h3>Depth of field (DOF)</h3>
<p><strong>Depth of field</strong> is the zone that appears sharp, front to back. Aperture is the biggest lever on it:</p>
<ul>
<li><strong>Wide aperture (f/1.8-f/2.8)</strong> — SHALLOW depth of field: subject sharp, background melts. Great for portraits and isolating a product.</li>
<li><strong>Narrow aperture (f/8-f/16)</strong> — DEEP depth of field: everything sharp, foreground to horizon. Great for landscapes and architecture.</li>
</ul>
<h3>Bokeh</h3>
<p><strong>Bokeh</strong> is the quality of the out-of-focus blur — those soft round highlights. A wide aperture on a longer lens produces the creamiest bokeh.</p>
<pre><code>Portrait:  85mm  ·  f/1.8  -> subject pops, background = soft wash
Product:   50mm  ·  f/2.8  -> label sharp, shelf behind blurred
Landscape: 24mm  ·  f/11   -> rocks AND mountains both crisp
</code></pre>
<div class="callout"><span class="badge">For designers</span> Shallow DOF cleans up a busy background so your product or subject reads instantly — and leaves smooth negative space for type.</div>`,
    `<span class="eyebrow">PFD201 · Chương 3 · Bài 3.1</span>
<h2>Khẩu độ &amp; độ sâu trường ảnh</h2>
<p class="lead">Ngoài độ sáng, khẩu độ là nút sáng tạo chính để chọn <strong>cái gì được nét</strong>.</p>
<h3>Độ sâu trường ảnh (DOF)</h3>
<p><strong>Độ sâu trường ảnh</strong> là vùng trông nét, từ trước ra sau. Khẩu độ là đòn bẩy lớn nhất:</p>
<ul>
<li><strong>Khẩu mở lớn (f/1.8-f/2.8)</strong> — DOF MỎNG: chủ thể nét, phông tan chảy. Tuyệt cho chân dung và cô lập sản phẩm.</li>
<li><strong>Khẩu khép nhỏ (f/8-f/16)</strong> — DOF DÀY: mọi thứ nét, từ tiền cảnh tới đường chân trời. Tuyệt cho phong cảnh và kiến trúc.</li>
</ul>
<h3>Bokeh</h3>
<p><strong>Bokeh</strong> là chất lượng của phần mờ ngoài vùng nét — những đốm sáng tròn mềm. Khẩu mở lớn trên ống tiêu cự dài cho bokeh mịn nhất.</p>
<pre><code>Chân dung:  85mm  ·  f/1.8  -> chủ thể nổi bật, phông = màn mờ mềm
Sản phẩm:   50mm  ·  f/2.8  -> nhãn nét, kệ phía sau mờ
Phong cảnh: 24mm  ·  f/11   -> đá VÀ núi đều nét
</code></pre>
<div class="callout"><span class="badge">Cho nhà thiết kế</span> DOF mỏng dọn sạch phông rối để sản phẩm hoặc chủ thể "đọc" ngay — và chừa vùng trống mịn để đặt chữ.</div>`,
  ]]);

const c3q = quiz('pfd201-quiz-3', 'Quiz 3 — Aperture &amp; DOF|||Quiz 3 — Khẩu độ &amp; DOF', [
  { id: 'q1', question: 'To blur the background of a portrait, you use?|||Muốn xoá phông chân dung, bạn dùng?', options: ['Khẩu khép nhỏ f/16|||Khẩu khép nhỏ f/16', 'Khẩu mở lớn f/1.8|||Khẩu mở lớn f/1.8', 'ISO cao|||ISO cao', 'Tốc độ chậm|||Tốc độ chậm'], correctIndex: 1, explanation: 'Khẩu mở lớn (số f nhỏ) → DOF mỏng → phông mờ.' },
  { id: 'q2', question: 'For a landscape where near rocks and far mountains are both sharp, use?|||Cảnh cần cả đá gần và núi xa đều nét thì dùng?', options: ['f/2.8', 'f/11 hoặc f/16|||f/11 hoặc f/16', 'ISO 6400', 'Tele 200mm|||Tele 200mm'], correctIndex: 1, explanation: 'Khẩu khép nhỏ (f/11-f/16) cho DOF dày, nét từ gần tới xa.' },
  { id: 'q3', question: 'Bokeh refers to?|||Bokeh chỉ điều gì?', options: ['Độ nhiễu của ảnh|||Độ nhiễu của ảnh', 'Chất lượng vùng mờ ngoài nét|||Chất lượng vùng mờ ngoài nét', 'Cân bằng trắng|||Cân bằng trắng', 'Tốc độ màn trập|||Tốc độ màn trập'], correctIndex: 1, explanation: 'Bokeh = chất của phần out-focus, đẹp nhất với khẩu lớn + ống dài.' },
]);

const c4 = doc('pfd201-4-1-shutter-motion', '4.1 — Shutter speed &amp; motion|||4.1 — Tốc độ màn trập &amp; chuyển động',
  'Tốc độ màn trập điều khiển chuyển động: nhanh để đóng băng (freeze), chậm để nhoè (motion blur); lia máy (panning); phơi sáng dài; quy tắc chống rung.',
  [[
    `<span class="eyebrow">PFD201 · Chapter 4 · Lesson 4.1</span>
<h2>Shutter speed &amp; motion</h2>
<p class="lead">Shutter speed sets brightness — and it is your creative control over how <strong>movement</strong> looks.</p>
<h3>Freeze vs blur</h3>
<ul>
<li><strong>Fast shutter (1/1000s+)</strong> — FREEZES motion: a splash mid-air, a sprinter, a bird in flight.</li>
<li><strong>Slow shutter (1/15s, 1s, longer)</strong> — MOTION BLUR: silky waterfalls, light trails, a sense of speed.</li>
</ul>
<h3>Panning</h3>
<p><strong>Panning</strong> means tracking a moving subject with the camera at a moderate shutter (≈1/30-1/60s): the subject stays sharp while the background streaks — a classic way to show speed.</p>
<h3>Long exposure</h3>
<p><strong>Long exposures</strong> (seconds to minutes, on a tripod) smooth water and clouds and capture star trails. Use a tripod and often a neutral-density (ND) filter to avoid over-exposure.</p>
<pre><code>Sports:      1/1000s -> athlete frozen sharp
Waterfall:   1s      -> water turns to silk (tripod!)
Panning car: 1/40s   -> car sharp, background streaked
</code></pre>
<div class="callout"><span class="badge">Reciprocal rule</span> To hand-hold sharply, keep the shutter at least 1/focal-length: on a 100&nbsp;mm lens, use 1/100s or faster (image stabilisation buys a few stops).</div>`,
    `<span class="eyebrow">PFD201 · Chương 4 · Bài 4.1</span>
<h2>Tốc độ màn trập &amp; chuyển động</h2>
<p class="lead">Tốc độ màn trập đặt độ sáng — và là nút sáng tạo quyết định <strong>chuyển động</strong> trông thế nào.</p>
<h3>Đóng băng hay nhoè</h3>
<ul>
<li><strong>Tốc độ nhanh (1/1000s trở lên)</strong> — ĐÓNG BĂNG chuyển động: giọt nước bắn giữa không trung, vận động viên chạy, chim đang bay.</li>
<li><strong>Tốc độ chậm (1/15s, 1s, lâu hơn)</strong> — NHOÈ CHUYỂN ĐỘNG: thác nước mượt như tơ, vệt đèn xe, cảm giác tốc độ.</li>
</ul>
<h3>Lia máy (panning)</h3>
<p><strong>Panning</strong> là bám theo chủ thể đang di chuyển bằng máy ở tốc độ vừa (≈1/30-1/60s): chủ thể nét còn phông kéo vệt — cách kinh điển để diễn tả tốc độ.</p>
<h3>Phơi sáng dài</h3>
<p><strong>Phơi sáng dài</strong> (vài giây tới vài phút, đặt trên chân máy) làm mượt nước và mây, ghi được vệt sao. Cần chân máy và thường có kính lọc ND để tránh dư sáng.</p>
<pre><code>Thể thao:      1/1000s -> vận động viên đóng băng nét
Thác nước:     1s      -> nước hoá tơ (cần chân máy!)
Lia xe:        1/40s   -> xe nét, phông kéo vệt
</code></pre>
<div class="callout"><span class="badge">Quy tắc nghịch đảo</span> Muốn cầm tay nét, giữ tốc độ ít nhất bằng 1/tiêu-cự: ống 100&nbsp;mm thì dùng 1/100s trở lên (chống rung mua thêm vài stop).</div>`,
  ]]);

const c4q = quiz('pfd201-quiz-4', 'Quiz 4 — Shutter &amp; motion|||Quiz 4 — Tốc độ &amp; chuyển động', [
  { id: 'q1', question: 'To freeze a fast-moving athlete, use?|||Muốn đóng băng vận động viên chuyển động nhanh, dùng?', options: ['1/15s chậm|||1/15s chậm', '1/1000s nhanh|||1/1000s nhanh', 'Khẩu f/16|||Khẩu f/16', 'ISO 100'], correctIndex: 1, explanation: 'Tốc độ nhanh (1/1000s+) đóng băng chuyển động.' },
  { id: 'q2', question: 'A silky, smooth waterfall needs?|||Thác nước mượt như tơ cần?', options: ['Tốc độ chậm + chân máy|||Tốc độ chậm + chân máy', 'Tốc độ 1/2000s|||Tốc độ 1/2000s', 'Đèn flash|||Đèn flash', 'Ống mắt cá|||Ống mắt cá'], correctIndex: 0, explanation: 'Tốc độ chậm (khoảng 1s) làm nước nhoè mượt; cần chân máy để phần còn lại nét.' },
  { id: 'q3', question: 'The reciprocal rule for hand-holding a 100mm lens suggests at least?|||Quy tắc nghịch đảo khi cầm tay ống 100mm gợi ý tốc độ tối thiểu?', options: ['1/10s', '1/100s', '1s', '1/2000s'], correctIndex: 1, explanation: 'Ít nhất 1/tiêu-cự → ống 100mm dùng 1/100s trở lên.' },
]);

const c5 = doc('pfd201-5-1-composition', '5.1 — Composition|||5.1 — Bố cục nhiếp ảnh',
  'Quy tắc một phần ba, đường dẫn, khung trong khung, cân bằng và điểm nhấn (focal point); dẫn mắt người xem qua khung hình.',
  [[
    `<span class="eyebrow">PFD201 · Chapter 5 · Lesson 5.1</span>
<h2>Composition</h2>
<p class="lead">Composition is <strong>where you put things in the frame</strong> and how you lead the viewer's eye — the same visual-design thinking you already use, applied to a photo.</p>
<h3>Core devices</h3>
<ul>
<li><strong>Rule of thirds</strong> — split the frame into a 3×3 grid; place key subjects on the lines or intersections, not dead centre.</li>
<li><strong>Leading lines</strong> — roads, fences, shadows that pull the eye toward the subject.</li>
<li><strong>Framing</strong> — use a doorway, window or branches to frame the subject within the frame.</li>
<li><strong>Balance</strong> — distribute visual weight so the image doesn't feel lopsided.</li>
<li><strong>Focal point</strong> — one clear centre of interest; everything else supports it.</li>
</ul>
<h3>Negative space</h3>
<p>Empty space around a subject gives it room to breathe — and, for designers, a clean area to drop headlines or a logo.</p>
<pre><code>Portrait:  eyes on the upper-third line, gaze into open space
Product:   item on a third, generous negative space for type
Landscape: horizon on lower third when the sky is the story
</code></pre>
<div class="callout"><span class="badge">The Photographer's Eye</span> Michael Freeman frames composition as visual design — line, shape, balance and tension — the bridge between graphic design and photography.</div>`,
    `<span class="eyebrow">PFD201 · Chương 5 · Bài 5.1</span>
<h2>Bố cục nhiếp ảnh</h2>
<p class="lead">Bố cục là <strong>bạn đặt mọi thứ ở đâu trong khung</strong> và dẫn mắt người xem ra sao — chính lối tư duy thiết kế thị giác bạn đã dùng, áp vào một tấm ảnh.</p>
<h3>Các công cụ cốt lõi</h3>
<ul>
<li><strong>Quy tắc một phần ba</strong> — chia khung thành lưới 3×3; đặt chủ thể chính trên các đường hoặc giao điểm, không phải chính giữa.</li>
<li><strong>Đường dẫn</strong> — con đường, hàng rào, bóng đổ kéo mắt về phía chủ thể.</li>
<li><strong>Khung trong khung</strong> — dùng ô cửa, cửa sổ hay cành cây để đóng khung chủ thể.</li>
<li><strong>Cân bằng</strong> — phân bố trọng lượng thị giác để ảnh không bị lệch.</li>
<li><strong>Điểm nhấn</strong> — một trung tâm chú ý rõ ràng; mọi thứ khác hỗ trợ nó.</li>
</ul>
<h3>Vùng trống (negative space)</h3>
<p>Khoảng trống quanh chủ thể cho nó "thở" — và với nhà thiết kế, đó là vùng sạch để đặt tiêu đề hay logo.</p>
<pre><code>Chân dung:  mắt trên đường một-phần-ba trên, nhìn về khoảng trống
Sản phẩm:   vật ở một phần ba, vùng trống rộng để đặt chữ
Phong cảnh: chân trời ở một phần ba dưới khi bầu trời là câu chuyện
</code></pre>
<div class="callout"><span class="badge">The Photographer's Eye</span> Michael Freeman xem bố cục là thiết kế thị giác — đường nét, hình khối, cân bằng và căng thẳng — cây cầu giữa thiết kế đồ hoạ và nhiếp ảnh.</div>`,
  ]]);

const c5q = quiz('pfd201-quiz-5', 'Quiz 5 — Composition|||Quiz 5 — Bố cục', [
  { id: 'q1', question: 'The rule of thirds suggests placing key subjects?|||Quy tắc một phần ba gợi ý đặt chủ thể chính?', options: ['Chính giữa khung|||Chính giữa khung', 'Trên các đường/giao điểm của lưới 3×3|||Trên các đường/giao điểm của lưới 3×3', 'Sát mép|||Sát mép', 'Ngẫu nhiên|||Ngẫu nhiên'], correctIndex: 1, explanation: 'Đặt chủ thể trên đường hoặc giao điểm của lưới 3×3 cho bố cục cân và cuốn hút hơn.' },
  { id: 'q2', question: 'Roads or fences that pull the eye toward the subject are?|||Con đường hay hàng rào kéo mắt về chủ thể là?', options: ['Đường dẫn (leading lines)|||Đường dẫn (leading lines)', 'Vùng trống|||Vùng trống', 'Bokeh', 'Cân bằng trắng|||Cân bằng trắng'], correctIndex: 0, explanation: 'Đó là đường dẫn — dẫn ánh nhìn tới điểm nhấn.' },
  { id: 'q3', question: 'For a designer, negative space is valuable because it?|||Với nhà thiết kế, vùng trống quý vì nó?', options: ['Làm ảnh tối hơn|||Làm ảnh tối hơn', 'Cho chỗ sạch để đặt tiêu đề/logo|||Cho chỗ sạch để đặt tiêu đề/logo', 'Tăng độ nhiễu|||Tăng độ nhiễu', 'Làm phông nét hơn|||Làm phông nét hơn'], correctIndex: 1, explanation: 'Vùng trống cho chủ thể "thở" và chừa chỗ đặt chữ/logo.' },
]);

const c6 = doc('pfd201-6-1-light', '6.1 — Light|||6.1 — Ánh sáng',
  'Ánh sáng tự nhiên và nhân tạo; golden hour và blue hour; hướng sáng (trước/bên/ngược); chất sáng (cứng vs mềm) và cách nó dựng khối.',
  [[
    `<span class="eyebrow">PFD201 · Chapter 6 · Lesson 6.1</span>
<h2>Light</h2>
<p class="lead">Photography literally means "drawing with light". Learning to <strong>see</strong> light — its direction, quality and colour — is what separates a snapshot from a photograph.</p>
<h3>Natural vs artificial</h3>
<p><strong>Natural light</strong> (sun, sky, window) is free and beautiful but changes fast. <strong>Artificial light</strong> (flash, LED, studio strobes) is controllable and repeatable — the studio designer's tool.</p>
<h3>The golden &amp; blue hours</h3>
<p>The <strong>golden hour</strong> (just after sunrise / before sunset) gives warm, soft, low-angle light that flatters almost everything. The <strong>blue hour</strong> (just before sunrise / after sunset) gives cool, even light ideal for cityscapes.</p>
<h3>Direction of light</h3>
<ul>
<li><strong>Front light</strong> — flat, even, few shadows.</li>
<li><strong>Side light</strong> — reveals texture and shape; the most sculptural.</li>
<li><strong>Backlight</strong> — rim-lights edges, creates silhouettes and glow.</li>
</ul>
<h3>Quality of light</h3>
<p><strong>Hard light</strong> (small or distant source, midday sun) makes crisp, hard-edged shadows. <strong>Soft light</strong> (large or diffused source, an overcast sky or a softbox) wraps gently with soft-edged shadows.</p>
<div class="callout"><span class="badge">Bigger = softer</span> The larger the light source is <em>relative to the subject</em>, the softer the shadows — that's why a window or a softbox flatters faces.</div>`,
    `<span class="eyebrow">PFD201 · Chương 6 · Bài 6.1</span>
<h2>Ánh sáng</h2>
<p class="lead">Nhiếp ảnh nghĩa đen là "vẽ bằng ánh sáng". Học cách <strong>nhìn</strong> ánh sáng — hướng, chất và màu của nó — là thứ tách một tấm ảnh chụp vội khỏi một tác phẩm.</p>
<h3>Tự nhiên và nhân tạo</h3>
<p><strong>Ánh sáng tự nhiên</strong> (mặt trời, bầu trời, cửa sổ) miễn phí và đẹp nhưng đổi rất nhanh. <strong>Ánh sáng nhân tạo</strong> (flash, LED, đèn studio) kiểm soát được và lặp lại được — công cụ của nhà thiết kế trong studio.</p>
<h3>Giờ vàng &amp; giờ xanh</h3>
<p><strong>Giờ vàng</strong> (ngay sau bình minh / trước hoàng hôn) cho ánh sáng ấm, mềm, góc thấp làm đẹp gần như mọi thứ. <strong>Giờ xanh</strong> (ngay trước bình minh / sau hoàng hôn) cho ánh sáng lạnh, đều, lý tưởng cho ảnh phố.</p>
<h3>Hướng sáng</h3>
<ul>
<li><strong>Sáng trước</strong> — phẳng, đều, ít bóng.</li>
<li><strong>Sáng bên</strong> — lộ kết cấu và hình khối; giàu tính điêu khắc nhất.</li>
<li><strong>Sáng ngược</strong> — viền sáng các mép, tạo bóng đổ ngược (silhouette) và quầng sáng.</li>
</ul>
<h3>Chất sáng</h3>
<p><strong>Sáng cứng</strong> (nguồn nhỏ hoặc ở xa, nắng trưa) tạo bóng sắc, mép cứng. <strong>Sáng mềm</strong> (nguồn lớn hoặc tán xạ, trời nhiều mây hay softbox) bao dịu với bóng mép mềm.</p>
<div class="callout"><span class="badge">Lớn hơn = mềm hơn</span> Nguồn sáng càng lớn <em>so với chủ thể</em> thì bóng càng mềm — vì thế cửa sổ hay softbox làm khuôn mặt đẹp hơn.</div>`,
  ]]);

const c6q = quiz('pfd201-quiz-6', 'Quiz 6 — Light|||Quiz 6 — Ánh sáng', [
  { id: 'q1', question: 'The golden hour gives light that is?|||Giờ vàng cho ánh sáng?', options: ['Lạnh và gắt|||Lạnh và gắt', 'Ấm, mềm, góc thấp|||Ấm, mềm, góc thấp', 'Trắng và phẳng|||Trắng và phẳng', 'Xanh và đều|||Xanh và đều'], correctIndex: 1, explanation: 'Ngay sau bình minh / trước hoàng hôn: ánh sáng ấm, mềm, góc thấp.' },
  { id: 'q2', question: 'Which direction of light best reveals texture and shape?|||Hướng sáng nào lộ kết cấu và hình khối rõ nhất?', options: ['Sáng trước|||Sáng trước', 'Sáng bên|||Sáng bên', 'Không có hướng nào|||Không có hướng nào', 'Sáng đều mọi phía|||Sáng đều mọi phía'], correctIndex: 1, explanation: 'Sáng bên đổ bóng ngang chủ thể → làm bật kết cấu, hình khối.' },
  { id: 'q3', question: 'To get soft, gentle shadows on a face you want a source that is?|||Muốn bóng mềm, dịu trên khuôn mặt cần nguồn sáng?', options: ['Nhỏ và ở xa|||Nhỏ và ở xa', 'Lớn so với chủ thể (cửa sổ/softbox)|||Lớn so với chủ thể (cửa sổ/softbox)', 'Nắng trưa gắt|||Nắng trưa gắt', 'Đèn flash trực diện nhỏ|||Đèn flash trực diện nhỏ'], correctIndex: 1, explanation: 'Nguồn càng lớn so với chủ thể thì bóng càng mềm.' },
]);

const c7 = doc('pfd201-7-1-color-white-balance', '7.1 — Colour &amp; white balance|||7.1 — Màu &amp; cân bằng trắng',
  'Cân bằng trắng (white balance) và nhiệt màu (Kelvin); màu ám (warm/cool cast); vai trò của màu trong nhiếp ảnh và cách khớp màu ảnh với bảng màu thiết kế.',
  [[
    `<span class="eyebrow">PFD201 · Chapter 7 · Lesson 7.1</span>
<h2>Colour &amp; white balance</h2>
<p class="lead">Light has a colour, and getting it right — or bending it on purpose — is central to how a photo feels and how it fits a brand palette.</p>
<h3>Colour temperature (Kelvin)</h3>
<p>Light sources have a <strong>colour temperature</strong> measured in Kelvin (K). Counter-intuitively, low numbers are warm and high numbers are cool:</p>
<pre><code>Candle / tungsten   ~2000-3000K  -> warm, orange
Midday sunlight     ~5500K       -> neutral "white"
Overcast / shade    ~7000-8000K  -> cool, blue
</code></pre>
<h3>White balance</h3>
<p><strong>White balance (WB)</strong> tells the camera what "white" is, so colours look natural. Set it wrong and you get a colour <strong>cast</strong> — an orange indoor shot or a blue shadow. Shoot RAW and you can set WB perfectly afterward with zero quality loss.</p>
<h3>Colour in photography</h3>
<ul>
<li><strong>Warm vs cool</strong> — warm reads friendly and inviting; cool reads calm or clinical.</li>
<li><strong>Complementary colours</strong> — opposites (blue/orange, teal/red) create punchy contrast.</li>
<li><strong>Harmony</strong> — a limited palette feels intentional and on-brand.</li>
</ul>
<div class="callout"><span class="badge">For designers</span> Nudge white balance and hue in editing so a photo's colours land on your brand palette — the fastest way to make stock or a shoot feel "designed".</div>`,
    `<span class="eyebrow">PFD201 · Chương 7 · Bài 7.1</span>
<h2>Màu &amp; cân bằng trắng</h2>
<p class="lead">Ánh sáng có màu, và chỉnh đúng — hoặc bẻ có chủ đích — là cốt lõi của cảm giác một tấm ảnh và mức độ khớp với bảng màu thương hiệu.</p>
<h3>Nhiệt màu (Kelvin)</h3>
<p>Nguồn sáng có <strong>nhiệt màu</strong> đo bằng Kelvin (K). Ngược trực giác: số thấp là ấm, số cao là lạnh:</p>
<pre><code>Nến / đèn dây tóc   ~2000-3000K  -> ấm, cam
Nắng giữa trưa      ~5500K       -> trung tính "trắng"
Trời mây / bóng râm ~7000-8000K  -> lạnh, xanh
</code></pre>
<h3>Cân bằng trắng</h3>
<p><strong>Cân bằng trắng (WB)</strong> báo cho máy biết "trắng" là gì, để màu trông tự nhiên. Đặt sai thì bị <strong>ám màu (cast)</strong> — ảnh trong nhà ám cam hay bóng ám xanh. Chụp RAW thì bạn đặt WB hoàn hảo về sau mà không mất chất lượng.</p>
<h3>Màu trong nhiếp ảnh</h3>
<ul>
<li><strong>Ấm và lạnh</strong> — ấm gợi thân thiện, mời gọi; lạnh gợi bình tĩnh hay lạnh lùng.</li>
<li><strong>Màu bổ túc</strong> — các cặp đối (xanh dương/cam, xanh mòng két/đỏ) tạo tương phản mạnh.</li>
<li><strong>Hoà sắc</strong> — bảng màu hạn chế tạo cảm giác có chủ đích và đúng thương hiệu.</li>
</ul>
<div class="callout"><span class="badge">Cho nhà thiết kế</span> Nắn cân bằng trắng và sắc độ khi chỉnh để màu ảnh rơi đúng bảng màu thương hiệu — cách nhanh nhất khiến ảnh stock hay buổi chụp trông "được thiết kế".</div>`,
  ]]);

const c7q = quiz('pfd201-quiz-7', 'Quiz 7 — Colour &amp; white balance|||Quiz 7 — Màu &amp; cân bằng trắng', [
  { id: 'q1', question: 'On the Kelvin scale, a low number (~3000K) light is?|||Trên thang Kelvin, ánh sáng số thấp (~3000K) là?', options: ['Lạnh, xanh|||Lạnh, xanh', 'Ấm, cam|||Ấm, cam', 'Trung tính trắng|||Trung tính trắng', 'Không màu|||Không màu'], correctIndex: 1, explanation: 'Ngược trực giác: Kelvin thấp = ấm/cam, Kelvin cao = lạnh/xanh.' },
  { id: 'q2', question: 'A wrong white balance produces?|||Cân bằng trắng sai gây ra?', options: ['Ám màu (colour cast)|||Ám màu (colour cast)', 'Nhoè chuyển động|||Nhoè chuyển động', 'Phông mờ|||Phông mờ', 'Nhiễu ISO|||Nhiễu ISO'], correctIndex: 0, explanation: 'WB sai → ảnh bị ám cam/xanh; chụp RAW sửa được không mất chất.' },
  { id: 'q3', question: 'Complementary colours like blue and orange are used to?|||Cặp màu bổ túc như xanh dương và cam dùng để?', options: ['Giảm tương phản|||Giảm tương phản', 'Tạo tương phản mạnh, bắt mắt|||Tạo tương phản mạnh, bắt mắt', 'Làm ảnh xám|||Làm ảnh xám', 'Xoá phông|||Xoá phông'], correctIndex: 1, explanation: 'Màu đối nhau trên vòng màu tạo tương phản punchy, hút mắt.' },
]);

const c8 = doc('pfd201-8-1-postprocessing-design', '8.1 — Post-processing &amp; design use|||8.1 — Hậu kỳ &amp; ứng dụng thiết kế',
  'Quy trình Lightroom: cull → chỉnh sáng (exposure/contrast) → chỉnh màu (WB/HSL) → cắt (crop) → xuất; ảnh cho thiết kế/branding; đạo đức chỉnh sửa.',
  [[
    `<span class="eyebrow">PFD201 · Chapter 8 · Lesson 8.1</span>
<h2>Post-processing &amp; design use</h2>
<p class="lead">Editing is where a designer finishes the image — bringing exposure, colour and crop in line with the brief. <strong>Adobe Lightroom</strong> is the standard tool.</p>
<h3>A Lightroom workflow</h3>
<ol>
<li><strong>Cull</strong> — import and flag the keepers; reject the rest.</li>
<li><strong>Tone</strong> — fix exposure, contrast, and recover highlights/shadows.</li>
<li><strong>Colour</strong> — set white balance, then refine hue/saturation/luminance (HSL) per colour.</li>
<li><strong>Crop</strong> — straighten and reframe to the aspect ratio your layout needs.</li>
<li><strong>Detail &amp; export</strong> — sharpen, reduce noise, then export at the right size and colour space (sRGB for web).</li>
</ol>
<h3>Images for design &amp; branding</h3>
<p>Match the photo to the system: consistent colour grade across a set, negative space for type, the right aspect ratios (16:9 hero, 1:1 social, 4:5 product), and export presets so every asset is consistent.</p>
<h3>The ethics of editing</h3>
<p>Enhancing tone and colour is normal craft. But be honest: don't fabricate a product's appearance, slim a body, or add/remove elements in journalism or advertising in ways that mislead. <strong>Correction is fair; deception is not.</strong></p>
<div class="callout"><span class="badge">Non-destructive</span> Lightroom edits are instructions layered over the original RAW — you can always reset. Keep the RAW; export copies.</div>`,
    `<span class="eyebrow">PFD201 · Chương 8 · Bài 8.1</span>
<h2>Hậu kỳ &amp; ứng dụng thiết kế</h2>
<p class="lead">Hậu kỳ là nơi nhà thiết kế hoàn thiện tấm ảnh — đưa phơi sáng, màu và khung về đúng brief. <strong>Adobe Lightroom</strong> là công cụ chuẩn.</p>
<h3>Quy trình Lightroom</h3>
<ol>
<li><strong>Lọc (cull)</strong> — nhập ảnh và đánh dấu ảnh giữ; loại phần còn lại.</li>
<li><strong>Chỉnh sáng</strong> — sửa exposure, tương phản, cứu vùng sáng/tối.</li>
<li><strong>Chỉnh màu</strong> — đặt cân bằng trắng, rồi tinh chỉnh sắc độ/bão hoà/độ sáng (HSL) từng màu.</li>
<li><strong>Cắt (crop)</strong> — nắn thẳng và cắt lại theo tỉ lệ khung mà bố cục cần.</li>
<li><strong>Chi tiết &amp; xuất</strong> — làm nét, giảm nhiễu, rồi xuất đúng kích thước và không gian màu (sRGB cho web).</li>
</ol>
<h3>Ảnh cho thiết kế &amp; thương hiệu</h3>
<p>Khớp ảnh với hệ thống: tông màu nhất quán cả bộ, chừa vùng trống cho chữ, đúng tỉ lệ (16:9 cho hero, 1:1 cho social, 4:5 cho sản phẩm), và tạo preset xuất để mọi asset đồng nhất.</p>
<h3>Đạo đức chỉnh sửa</h3>
<p>Nâng tông và màu là nghề bình thường. Nhưng phải trung thực: đừng bịa hình dạng sản phẩm, làm thon dáng người, hay thêm/xoá chi tiết trong báo chí hay quảng cáo theo cách gây hiểu lầm. <strong>Chỉnh sửa là công bằng; đánh lừa thì không.</strong></p>
<div class="callout"><span class="badge">Không phá huỷ</span> Chỉnh sửa trong Lightroom là các chỉ dẫn xếp chồng trên RAW gốc — luôn reset lại được. Giữ RAW; chỉ xuất bản sao.</div>`,
  ]]);

const c8q = quiz('pfd201-quiz-8', 'Quiz 8 — Post-processing &amp; design|||Quiz 8 — Hậu kỳ &amp; thiết kế', [
  { id: 'q1', question: 'Which colour space should you export in for the web?|||Nên xuất ảnh cho web ở không gian màu nào?', options: ['CMYK', 'sRGB', 'ProPhoto RGB', 'Grayscale'], correctIndex: 1, explanation: 'sRGB là không gian màu chuẩn cho web, hiển thị nhất quán trên mọi trình duyệt.' },
  { id: 'q2', question: 'Lightroom edits are non-destructive, which means?|||Chỉnh sửa Lightroom là không phá huỷ, nghĩa là?', options: ['Ảnh gốc bị ghi đè|||Ảnh gốc bị ghi đè', 'Chỉnh sửa là chỉ dẫn trên RAW, luôn reset được|||Chỉnh sửa là chỉ dẫn trên RAW, luôn reset được', 'Không xuất được|||Không xuất được', 'Chỉ dùng cho JPEG|||Chỉ dùng cho JPEG'], correctIndex: 1, explanation: 'Chỉnh sửa xếp chồng trên RAW gốc; luôn quay lại được, giữ nguyên file gốc.' },
  { id: 'q3', question: 'Which editing is ethically problematic?|||Chỉnh sửa nào gây vấn đề về đạo đức?', options: ['Sửa cân bằng trắng|||Sửa cân bằng trắng', 'Bịa hình dạng sản phẩm trong quảng cáo gây hiểu lầm|||Bịa hình dạng sản phẩm trong quảng cáo gây hiểu lầm', 'Tăng nhẹ tương phản|||Tăng nhẹ tương phản', 'Cắt khung lại|||Cắt khung lại'], correctIndex: 1, explanation: 'Chỉnh tông/màu là công bằng; bịa hoặc đánh lừa trong quảng cáo/báo chí là không.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'PFD201',
    slug: 'pfd201-photography-for-designer',
    title: 'Photography for Designer',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PFD201.webp',
    shortDescription: 'Photography for designers — exposure triangle (aperture, shutter, ISO), depth of field & bokeh, motion, composition, light, colour & white balance, and Lightroom editing for design. Bilingual, with real settings & quizzes.|||Nhiếp ảnh cho nhà thiết kế — tam giác phơi sáng (khẩu độ, tốc độ, ISO), độ sâu trường ảnh & bokeh, chuyển động, bố cục, ánh sáng, màu & cân bằng trắng, và hậu kỳ Lightroom cho thiết kế. Song ngữ, có quiz.',
    description: 'Môn <strong>PFD201 — Photography for Designer</strong> (kỳ 2, ngành Thiết kế mỹ thuật số) giúp nhà thiết kế <strong>tạo ra ảnh có chủ đích</strong>. Từ <strong>máy ảnh &amp; cơ bản</strong> (cảm biến, ống kính, tiêu cự) → <strong>tam giác phơi sáng</strong> (khẩu độ, tốc độ, ISO) → <strong>khẩu độ &amp; độ sâu trường ảnh</strong> → <strong>tốc độ &amp; chuyển động</strong> → <strong>bố cục</strong> → <strong>ánh sáng</strong> → <strong>màu &amp; cân bằng trắng</strong> → <strong>hậu kỳ Lightroom &amp; ứng dụng thiết kế</strong>. Bám sách chuẩn (Bryan Peterson, Michael Freeman, Ansel Adams), song ngữ, có thông số thật và quiz mỗi chương.',
    whatYouLearn: 'Máy ảnh, cảm biến, ống kính &amp; tiêu cự, RAW vs JPEG; tam giác phơi sáng (khẩu/tốc/ISO) &amp; khái niệm stop; khẩu độ &amp; độ sâu trường ảnh, bokeh; tốc độ màn trập, đóng băng/nhoè, panning, phơi sáng dài; bố cục (một phần ba, đường dẫn, khung, cân bằng, điểm nhấn); ánh sáng (golden/blue hour, hướng &amp; chất sáng); màu &amp; cân bằng trắng (Kelvin, cast); quy trình Lightroom &amp; đạo đức chỉnh sửa; ảnh cho thương hiệu/thiết kế.',
    requirements: 'Không cần kinh nghiệm nhiếp ảnh. Có máy ảnh (DSLR/mirrorless) hoặc điện thoại chụp chế độ chỉnh tay là đủ; nên cài Adobe Lightroom (hoặc darktable miễn phí) để thực hành hậu kỳ.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn (Peterson, Freeman, Adams), tài liệu miễn phí, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Nhiếp ảnh cho nhà thiết kế; ba trụ; lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Máy ảnh & cơ bản|||Chapter 1 — Camera & basics', description: 'Loại máy, cảm biến, ống kính, tiêu cự, RAW.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Tam giác phơi sáng|||Chapter 2 — Exposure triangle', description: 'Khẩu độ, tốc độ, ISO, stop.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Khẩu độ & độ sâu trường ảnh|||Chapter 3 — Aperture & depth of field', description: 'DOF, bokeh, khẩu độ sáng tạo.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Tốc độ & chuyển động|||Chapter 4 — Shutter & motion', description: 'Đóng băng/nhoè, panning, phơi sáng dài.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Bố cục nhiếp ảnh|||Chapter 5 — Composition', description: 'Một phần ba, đường dẫn, khung, cân bằng, điểm nhấn.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Ánh sáng|||Chapter 6 — Light', description: 'Tự nhiên/nhân tạo, golden hour, hướng & chất sáng.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Màu & cân bằng trắng|||Chapter 7 — Colour & white balance', description: 'White balance, Kelvin, màu trong nhiếp ảnh.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Hậu kỳ & ứng dụng thiết kế|||Chapter 8 — Post-processing & design', description: 'Lightroom, chỉnh sáng/màu/crop, ảnh cho branding, đạo đức.', lessons: [c8, c8q] },
  ],
};
