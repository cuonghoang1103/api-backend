/**
 * DTG102 — Visual Design Tools (Công cụ thiết kế đồ hoạ). Ngành Thiết kế mỹ
 * thuật số FPTU, Kỳ 1. Giáo trình chuẩn: Adobe Classroom in a Book
 * (Photoshop / Illustrator / InDesign) + Adobe Help + YouTube Adobe Creative
 * Cloud. 8 chương thực hành công cụ: tổng quan raster/vector → Photoshop cơ
 * bản & nâng cao → Illustrator cơ bản & nâng cao → InDesign & dàn trang →
 * quy trình & định dạng file → dự án tổng hợp. Song ngữ + thao tác từng bước
 * + mẹo + ví dụ + quiz mỗi chương.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "&"→&amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('dtg102-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách Adobe Classroom in a Book, Adobe Help chính thức, YouTube (Adobe Creative Cloud), công cụ & tài nguyên, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">DTG102 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Visual Design Tools</strong> — raster vs vector, Photoshop, Illustrator, InDesign, file formats and production workflow — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, official resources from Adobe.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for DTG102 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books (Adobe Classroom in a Book)</h3>
<ul>
<li><a href="https://helpx.adobe.com/photoshop/tutorials.html" target="_blank" rel="noopener"><em>Adobe Photoshop Classroom in a Book</em> — official tutorials</a></li>
<li><a href="https://helpx.adobe.com/illustrator/tutorials.html" target="_blank" rel="noopener"><em>Adobe Illustrator Classroom in a Book</em> — official tutorials</a></li>
<li><a href="https://helpx.adobe.com/indesign/tutorials.html" target="_blank" rel="noopener"><em>Adobe InDesign Classroom in a Book</em> — official tutorials</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://helpx.adobe.com/photoshop/user-guide.html" target="_blank" rel="noopener">Adobe Photoshop — User Guide</a></li>
<li><a href="https://helpx.adobe.com/illustrator/user-guide.html" target="_blank" rel="noopener">Adobe Illustrator — User Guide</a></li>
<li><a href="https://helpx.adobe.com/indesign/user-guide.html" target="_blank" rel="noopener">Adobe InDesign — User Guide</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@AdobeCreativeCloud" target="_blank" rel="noopener">Adobe Creative Cloud</a> — official tutorials for every app</li>
<li><a href="https://www.youtube.com/@Adobe" target="_blank" rel="noopener">Adobe</a> — features, tips &amp; live streams</li>
</ul>
<h3>🛠️ Tools &amp; free assets</h3>
<ul>
<li><a href="https://www.adobe.com/creativecloud.html" target="_blank" rel="noopener">Adobe Creative Cloud</a> — Photoshop, Illustrator, InDesign (student plan)</li>
<li><a href="https://www.photopea.com/" target="_blank" rel="noopener">Photopea</a> — free browser editor that opens PSD/AI files</li>
<li><a href="https://color.adobe.com/" target="_blank" rel="noopener">Adobe Color</a> — build &amp; extract color palettes</li>
<li><a href="https://fonts.google.com/" target="_blank" rel="noopener">Google Fonts</a> — free, licensable typefaces</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — raster vs vector, resolution/DPI, RGB vs CMYK, and which tool fits which job.</li>
<li><strong>Raster</strong> — Photoshop: layers, selections, masks, retouching, then blending, smart objects and filters.</li>
<li><strong>Vector</strong> — Illustrator: paths, the pen tool, shapes, Pathfinder, typography, logos and SVG export.</li>
<li><strong>Layout &amp; delivery</strong> — InDesign master pages and text flow; pick the right export format for print vs web.</li>
</ol></div>`,
    `<span class="eyebrow">DTG102 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Công cụ thiết kế đồ hoạ</strong> — raster &amp; vector, Photoshop, Illustrator, InDesign, định dạng file và quy trình sản xuất — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, chính thức từ Adobe.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DTG102 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo (Adobe Classroom in a Book)</h3>
<ul>
<li><a href="https://helpx.adobe.com/photoshop/tutorials.html" target="_blank" rel="noopener"><em>Adobe Photoshop Classroom in a Book</em> — hướng dẫn chính thức</a></li>
<li><a href="https://helpx.adobe.com/illustrator/tutorials.html" target="_blank" rel="noopener"><em>Adobe Illustrator Classroom in a Book</em> — hướng dẫn chính thức</a></li>
<li><a href="https://helpx.adobe.com/indesign/tutorials.html" target="_blank" rel="noopener"><em>Adobe InDesign Classroom in a Book</em> — hướng dẫn chính thức</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://helpx.adobe.com/photoshop/user-guide.html" target="_blank" rel="noopener">Adobe Photoshop — Cẩm nang người dùng</a></li>
<li><a href="https://helpx.adobe.com/illustrator/user-guide.html" target="_blank" rel="noopener">Adobe Illustrator — Cẩm nang người dùng</a></li>
<li><a href="https://helpx.adobe.com/indesign/user-guide.html" target="_blank" rel="noopener">Adobe InDesign — Cẩm nang người dùng</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@AdobeCreativeCloud" target="_blank" rel="noopener">Adobe Creative Cloud</a> — hướng dẫn chính thức cho mọi phần mềm</li>
<li><a href="https://www.youtube.com/@Adobe" target="_blank" rel="noopener">Adobe</a> — tính năng, mẹo &amp; phát trực tiếp</li>
</ul>
<h3>🛠️ Công cụ &amp; tài nguyên miễn phí</h3>
<ul>
<li><a href="https://www.adobe.com/creativecloud.html" target="_blank" rel="noopener">Adobe Creative Cloud</a> — Photoshop, Illustrator, InDesign (gói sinh viên)</li>
<li><a href="https://www.photopea.com/" target="_blank" rel="noopener">Photopea</a> — trình sửa ảnh miễn phí trên trình duyệt, mở được file PSD/AI</li>
<li><a href="https://color.adobe.com/" target="_blank" rel="noopener">Adobe Color</a> — dựng &amp; trích bảng màu</li>
<li><a href="https://fonts.google.com/" target="_blank" rel="noopener">Google Fonts</a> — kho font miễn phí, có bản quyền</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — raster &amp; vector, độ phân giải/DPI, RGB &amp; CMYK, và công cụ nào hợp việc nào.</li>
<li><strong>Ảnh raster</strong> — Photoshop: layer, vùng chọn, mask, chỉnh sửa; rồi blending, smart object và filter.</li>
<li><strong>Vector</strong> — Illustrator: path, pen tool, shape, Pathfinder, typography, logo và xuất SVG.</li>
<li><strong>Dàn trang &amp; xuất bản</strong> — master page &amp; luồng chữ trong InDesign; chọn đúng định dạng cho in &amp; web.</li>
</ol></div>`,
  ]]);

const intro = doc('dtg102-0-1-overview', 'Course overview: Visual Design Tools|||Tổng quan: Công cụ thiết kế đồ hoạ',
  'Môn học dạy gì; ba phần mềm Adobe (Photoshop cho ảnh raster, Illustrator cho vector, InDesign cho dàn trang) và khi nào dùng cái nào; lộ trình 8 chương thực hành công cụ.',
  [[
    `<span class="eyebrow">DTG102 · Lesson 0.1 · Overview</span>
<h2>Visual Design Tools</h2>
<p class="lead">This course teaches you the <strong>industry-standard toolkit</strong> for visual design: Adobe <strong>Photoshop</strong>, <strong>Illustrator</strong> and <strong>InDesign</strong>. You'll learn not just which buttons to press, but <em>which tool fits which job</em> — and how a design travels from idea to a finished, exportable file.</p>
<h3>The three tools</h3>
<ul>
<li><strong>Photoshop</strong> — the <em>raster</em> (pixel) editor: photos, retouching, digital painting, web mockups.</li>
<li><strong>Illustrator</strong> — the <em>vector</em> editor: logos, icons, illustrations, anything that must scale cleanly.</li>
<li><strong>InDesign</strong> — the <em>layout</em> tool: multi-page documents, brochures, magazines, print production.</li>
</ul>
<h3>Roadmap</h3>
<p>Tool overview &amp; raster vs vector → Photoshop basics &amp; advanced → Illustrator basics &amp; advanced → InDesign &amp; layout → workflow &amp; file formats → a capstone project. Bilingual, with step-by-step tool walkthroughs, tips and a quiz per chapter.</p>
<div class="callout"><span class="badge">Learn by doing</span> Design software is a motor skill — read a step, then do it. Keep the app open beside this course and repeat each walkthrough on your own file.</div>`,
    `<span class="eyebrow">DTG102 · Bài 0.1 · Tổng quan</span>
<h2>Công cụ thiết kế đồ hoạ</h2>
<p class="lead">Môn này dạy bạn <strong>bộ công cụ chuẩn ngành</strong> cho thiết kế đồ hoạ: Adobe <strong>Photoshop</strong>, <strong>Illustrator</strong> và <strong>InDesign</strong>. Bạn học không chỉ bấm nút nào, mà <em>công cụ nào hợp việc nào</em> — và một thiết kế đi từ ý tưởng tới file hoàn chỉnh, xuất được, như thế nào.</p>
<h3>Ba phần mềm</h3>
<ul>
<li><strong>Photoshop</strong> — trình sửa ảnh <em>raster</em> (điểm ảnh): ảnh chụp, chỉnh sửa, vẽ số, mockup web.</li>
<li><strong>Illustrator</strong> — trình vẽ <em>vector</em>: logo, icon, minh hoạ, mọi thứ cần phóng to sạch nét.</li>
<li><strong>InDesign</strong> — công cụ <em>dàn trang</em>: tài liệu nhiều trang, brochure, tạp chí, in ấn.</li>
</ul>
<h3>Lộ trình</h3>
<p>Tổng quan công cụ &amp; raster vs vector → Photoshop cơ bản &amp; nâng cao → Illustrator cơ bản &amp; nâng cao → InDesign &amp; dàn trang → quy trình &amp; định dạng file → dự án tổng hợp. Song ngữ, có hướng dẫn thao tác từng bước, mẹo và quiz mỗi chương.</p>
<div class="callout"><span class="badge">Học bằng cách làm</span> Phần mềm thiết kế là kỹ năng tay — đọc một bước rồi làm ngay bước đó. Mở phần mềm bên cạnh bài học và lặp lại từng hướng dẫn trên file của bạn.</div>`,
  ]]);

const c1 = doc('dtg102-1-1-raster-vector', '1.1 — Design tools overview: raster vs vector|||1.1 — Tổng quan công cụ: raster & vector',
  'Ảnh bitmap (điểm ảnh) so với vector (đường toán học); khi nào chọn công cụ nào; độ phân giải & DPI; hệ màu RGB (màn hình) vs CMYK (in).',
  [[
    `<span class="eyebrow">DTG102 · Chapter 1 · Lesson 1.1</span>
<h2>Design tools overview: raster vs vector</h2>
<h3>Two ways to store an image</h3>
<ul>
<li><strong>Raster (bitmap)</strong> — a grid of colored pixels. Perfect for photographs and rich, painterly detail. The catch: enlarge it and the pixels show — it <em>degrades</em>. Tools: Photoshop. Formats: JPG, PNG, GIF, PSD.</li>
<li><strong>Vector</strong> — shapes defined by mathematical paths (points, curves, fills). Scales to any size with <em>zero</em> loss — a logo works on a business card or a billboard. Tools: Illustrator. Formats: SVG, AI, EPS, PDF.</li>
</ul>
<h3>Which tool for which job</h3>
<pre><code>Photo editing, retouch, digital paint  -&gt; Photoshop (raster)
Logo, icon, illustration, type art     -&gt; Illustrator (vector)
Multi-page layout (brochure, magazine) -&gt; InDesign (layout)</code></pre>
<h3>Resolution &amp; DPI</h3>
<p><strong>Resolution</strong> = how many pixels an image has (e.g. 1920 &times; 1080). <strong>DPI/PPI</strong> = pixel density when printed. Rule of thumb: <strong>72 PPI</strong> is fine for screen, but print needs <strong>300 PPI</strong> at the final size — too few pixels and the print looks blurry.</p>
<h3>Color modes: RGB vs CMYK</h3>
<ul>
<li><strong>RGB</strong> (Red, Green, Blue) — additive light, for <em>screens</em>. Wider, brighter gamut.</li>
<li><strong>CMYK</strong> (Cyan, Magenta, Yellow, Key/black) — subtractive ink, for <em>print</em>. Convert to CMYK before sending to a printer, or bright RGB colors may shift.</li>
</ul>
<div class="callout"><span class="badge">Tip</span> If it will ever be printed large or resized, build it in <strong>vector</strong>. If it is a photo, it is <strong>raster</strong> — there is no way around that.</div>`,
    `<span class="eyebrow">DTG102 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan công cụ: raster &amp; vector</h2>
<h3>Hai cách lưu một hình ảnh</h3>
<ul>
<li><strong>Raster (bitmap)</strong> — lưới các điểm ảnh có màu. Hợp với ảnh chụp và chi tiết mềm mại như tranh vẽ. Nhược điểm: phóng to là lộ điểm ảnh — nó <em>vỡ</em>. Công cụ: Photoshop. Định dạng: JPG, PNG, GIF, PSD.</li>
<li><strong>Vector</strong> — hình dạng định nghĩa bằng đường toán học (điểm, đường cong, tô màu). Phóng to bao nhiêu cũng <em>không</em> vỡ — một logo dùng được cả trên danh thiếp lẫn biển quảng cáo. Công cụ: Illustrator. Định dạng: SVG, AI, EPS, PDF.</li>
</ul>
<h3>Công cụ nào cho việc nào</h3>
<pre><code>Sửa ảnh, chỉnh sửa, vẽ số            -&gt; Photoshop (raster)
Logo, icon, minh hoạ, chữ nghệ thuật -&gt; Illustrator (vector)
Dàn trang nhiều trang (brochure...)  -&gt; InDesign (layout)</code></pre>
<h3>Độ phân giải &amp; DPI</h3>
<p><strong>Độ phân giải</strong> = số điểm ảnh của tấm hình (vd 1920 &times; 1080). <strong>DPI/PPI</strong> = mật độ điểm ảnh khi in. Quy tắc: <strong>72 PPI</strong> đủ cho màn hình, nhưng in cần <strong>300 PPI</strong> ở đúng kích thước cuối — quá ít điểm ảnh thì bản in nhoè.</p>
<h3>Hệ màu: RGB &amp; CMYK</h3>
<ul>
<li><strong>RGB</strong> (Đỏ, Lục, Lam) — ánh sáng cộng, cho <em>màn hình</em>. Dải màu rộng, rực hơn.</li>
<li><strong>CMYK</strong> (Lục lam, Hồng cánh sen, Vàng, Đen) — mực trừ, cho <em>in ấn</em>. Đổi sang CMYK trước khi gửi nhà in, nếu không màu RGB rực có thể bị lệch.</li>
</ul>
<div class="callout"><span class="badge">Mẹo</span> Nếu sản phẩm sẽ in to hay đổi kích thước, hãy dựng bằng <strong>vector</strong>. Nếu là ảnh chụp thì bắt buộc là <strong>raster</strong> — không có cách khác.</div>`,
  ]]);

const c1q = quiz('dtg102-quiz-1', 'Quiz 1 — Raster vs vector|||Quiz 1 — Raster & vector', [
  { id: 'q1', question: 'Định dạng nào giữ nguyên nét khi phóng to tuỳ ý?', options: ['JPG (raster)', 'SVG (vector)', 'PNG (raster)', 'GIF (raster)'], correctIndex: 1, explanation: 'Vector (SVG) định nghĩa bằng đường toán học nên phóng to không vỡ.' },
  { id: 'q2', question: 'Độ phân giải nên dùng cho bản IN ở đúng kích thước là?', options: ['72 PPI', '96 PPI', '300 PPI', '10 PPI'], correctIndex: 2, explanation: 'In cần khoảng 300 PPI; 72 PPI chỉ đủ cho màn hình.' },
  { id: 'q3', question: 'Hệ màu nào dùng cho IN ẤN?', options: ['RGB', 'CMYK', 'HSL', 'Grayscale'], correctIndex: 1, explanation: 'CMYK (mực trừ) cho in; RGB (ánh sáng cộng) cho màn hình.' },
]);

const c2 = doc('dtg102-2-1-photoshop-basics', '2.1 — Photoshop basics: layers, selections, masks|||2.1 — Photoshop cơ bản: layer, vùng chọn, mask',
  'Giao diện Photoshop (panel/toolbar); layer (chồng ảnh không phá huỷ); công cụ vùng chọn (Marquee, Lasso, Object Selection); layer mask; chỉnh sửa cơ bản (Healing, Clone).',
  [[
    `<span class="eyebrow">DTG102 · Chapter 2 · Lesson 2.1</span>
<h2>Photoshop basics: layers, selections, masks</h2>
<h3>The interface</h3>
<p>The <strong>Tools</strong> panel is on the left, the <strong>Options</strong> bar runs along the top (settings for the active tool), and panels like <strong>Layers</strong> sit on the right. Set up a task-focused layout via <em>Window &gt; Workspace</em>.</p>
<h3>Layers — the core idea</h3>
<p>A layer is a transparent sheet you stack images and edits on. Because each element lives on its own layer, you edit <em>non-destructively</em> — move, hide (the eye icon), reorder or delete without touching the rest.</p>
<pre><code>New layer      : Shift + Ctrl/Cmd + N
Duplicate      : Ctrl/Cmd + J
Show/hide      : click the eye icon
Reorder        : drag up/down in the Layers panel</code></pre>
<h3>Selections</h3>
<ul>
<li><strong>Marquee</strong> — rectangular/elliptical selections.</li>
<li><strong>Lasso</strong> — freehand; Polygonal for straight edges.</li>
<li><strong>Object Selection / Magic Wand</strong> — select by subject or by similar color automatically.</li>
</ul>
<h3>Layer masks</h3>
<p>A <strong>mask</strong> hides parts of a layer without deleting them: paint <strong>black to hide</strong>, <strong>white to reveal</strong>. It is the non-destructive way to blend two images.</p>
<pre><code>Step by step (blend two photos):
1. Put photo B on a layer above photo A
2. Click "Add layer mask" at the bottom of Layers
3. Select the Brush, set color to black
4. Paint over B where A should show through</code></pre>
<h3>Retouching</h3>
<p>The <strong>Spot Healing Brush</strong> removes blemishes by blending surrounding texture; the <strong>Clone Stamp</strong> (Alt/Opt-click to sample) copies one area over another.</p>
<div class="callout"><span class="badge">Tip</span> Retouch on a <em>duplicate</em> layer, never the original — if you go wrong, just hide the copy.</div>`,
    `<span class="eyebrow">DTG102 · Chương 2 · Bài 2.1</span>
<h2>Photoshop cơ bản: layer, vùng chọn, mask</h2>
<h3>Giao diện</h3>
<p>Bảng <strong>Tools</strong> nằm bên trái, thanh <strong>Options</strong> chạy trên đỉnh (thiết lập cho công cụ đang chọn), và các panel như <strong>Layers</strong> nằm bên phải. Chọn bố cục theo việc qua <em>Window &gt; Workspace</em>.</p>
<h3>Layer — ý tưởng cốt lõi</h3>
<p>Layer là một tấm trong suốt để bạn chồng ảnh và chỉnh sửa lên. Vì mỗi thành phần nằm trên layer riêng, bạn sửa <em>không phá huỷ</em> — di chuyển, ẩn (biểu tượng con mắt), đổi thứ tự hay xoá mà không đụng phần còn lại.</p>
<pre><code>Layer mới      : Shift + Ctrl/Cmd + N
Nhân đôi       : Ctrl/Cmd + J
Ẩn/hiện        : bấm biểu tượng con mắt
Đổi thứ tự     : kéo lên/xuống trong bảng Layers</code></pre>
<h3>Vùng chọn (selection)</h3>
<ul>
<li><strong>Marquee</strong> — chọn hình chữ nhật/elip.</li>
<li><strong>Lasso</strong> — vẽ tay; Polygonal cho cạnh thẳng.</li>
<li><strong>Object Selection / Magic Wand</strong> — chọn theo chủ thể hoặc theo màu giống nhau tự động.</li>
</ul>
<h3>Layer mask</h3>
<p><strong>Mask</strong> ẩn một phần layer mà không xoá: tô <strong>đen để ẩn</strong>, <strong>trắng để hiện</strong>. Đây là cách hoà trộn hai ảnh không phá huỷ.</p>
<pre><code>Từng bước (hoà trộn hai ảnh):
1. Đặt ảnh B lên layer nằm trên ảnh A
2. Bấm "Add layer mask" ở đáy bảng Layers
3. Chọn Brush, đặt màu đen
4. Tô lên B ở chỗ muốn để A hiện xuyên qua</code></pre>
<h3>Chỉnh sửa (retouch)</h3>
<p><strong>Spot Healing Brush</strong> xoá khuyết điểm bằng cách hoà kết cấu xung quanh; <strong>Clone Stamp</strong> (Alt/Opt-bấm để lấy mẫu) chép một vùng đè lên vùng khác.</p>
<div class="callout"><span class="badge">Mẹo</span> Hãy chỉnh sửa trên layer <em>nhân đôi</em>, đừng đụng bản gốc — sai thì chỉ cần ẩn bản sao đi.</div>`,
  ]]);

const c2q = quiz('dtg102-quiz-2', 'Quiz 2 — Photoshop basics|||Quiz 2 — Photoshop cơ bản', [
  { id: 'q1', question: 'Trên layer mask, tô màu ĐEN sẽ?', options: ['Hiện phần layer đó', 'Ẩn phần layer đó', 'Xoá hẳn điểm ảnh', 'Đổi màu layer'], correctIndex: 1, explanation: 'Mask: đen để ẩn, trắng để hiện — không xoá điểm ảnh gốc.' },
  { id: 'q2', question: 'Vì sao dùng layer là "không phá huỷ"?', options: ['Vì layer nén ảnh', 'Vì mỗi thành phần ở layer riêng, sửa/ẩn/xoá không đụng phần khác', 'Vì layer khoá màu', 'Vì layer luôn ở CMYK'], correctIndex: 1, explanation: 'Mỗi phần tử nằm layer riêng nên chỉnh sửa tách biệt, không phá bản gốc.' },
  { id: 'q3', question: 'Công cụ nào dùng để xoá khuyết điểm bằng cách hoà kết cấu xung quanh?', options: ['Marquee', 'Spot Healing Brush', 'Gradient', 'Type tool'], correctIndex: 1, explanation: 'Spot Healing Brush hoà kết cấu lân cận để che khuyết điểm.' },
]);

const c3 = doc('dtg102-3-1-photoshop-advanced', '3.1 — Photoshop advanced: blending, smart objects, filters|||3.1 — Photoshop nâng cao: blending, smart object, filter',
  'Blending mode (Multiply/Screen/Overlay); Smart Object (chỉnh sửa không phá huỷ, phóng to không vỡ); Filter & Smart Filter; adjustment layer; hiệu ứng (layer style); xuất file (Export As, Save for Web).',
  [[
    `<span class="eyebrow">DTG102 · Chapter 3 · Lesson 3.1</span>
<h2>Photoshop advanced: blending, smart objects, filters</h2>
<h3>Blending modes</h3>
<p>A <strong>blending mode</strong> controls how a layer mixes with the ones below it (top of the Layers panel). The workhorses:</p>
<ul>
<li><strong>Multiply</strong> — darkens; great for shadows and putting ink on paper.</li>
<li><strong>Screen</strong> — lightens; great for glows, light and fire.</li>
<li><strong>Overlay</strong> — boosts contrast; great for textures and toning.</li>
</ul>
<h3>Smart Objects</h3>
<p>Convert a layer to a <strong>Smart Object</strong> (right-click &gt; Convert to Smart Object) to edit it non-destructively: you can scale it down and back up with <em>no</em> quality loss, and filters applied become re-editable <strong>Smart Filters</strong>.</p>
<h3>Adjustment layers</h3>
<p>Instead of editing pixels, add an <strong>adjustment layer</strong> (Brightness/Contrast, Curves, Hue/Saturation) that affects everything beneath it and can be tweaked or removed any time.</p>
<h3>Layer styles (effects)</h3>
<p>Double-click a layer to add <strong>Drop Shadow</strong>, <strong>Stroke</strong>, <strong>Gradient Overlay</strong> and more — live effects that update as you edit the layer.</p>
<h3>Exporting</h3>
<pre><code>Web/UI assets : File &gt; Export &gt; Export As (PNG for transparency, JPG for photos)
Print         : Save As TIFF/PDF in CMYK
Editable master: keep the layered .PSD</code></pre>
<div class="callout"><span class="badge">Tip</span> Always keep the layered <strong>.PSD</strong> as your master, then export a flattened copy. You cannot un-flatten a JPG.</div>`,
    `<span class="eyebrow">DTG102 · Chương 3 · Bài 3.1</span>
<h2>Photoshop nâng cao: blending, smart object, filter</h2>
<h3>Blending mode (chế độ hoà trộn)</h3>
<p><strong>Blending mode</strong> quyết định layer hoà với các layer bên dưới thế nào (ở đỉnh bảng Layers). Ba cái hay dùng:</p>
<ul>
<li><strong>Multiply</strong> — làm tối; hợp cho bóng đổ và đặt mực lên giấy.</li>
<li><strong>Screen</strong> — làm sáng; hợp cho ánh sáng, quầng sáng, lửa.</li>
<li><strong>Overlay</strong> — tăng tương phản; hợp cho kết cấu và chỉnh tông.</li>
</ul>
<h3>Smart Object</h3>
<p>Đổi một layer thành <strong>Smart Object</strong> (chuột phải &gt; Convert to Smart Object) để sửa không phá huỷ: thu nhỏ rồi phóng lại mà <em>không</em> mất chất lượng, và filter áp lên nó trở thành <strong>Smart Filter</strong> sửa lại được.</p>
<h3>Adjustment layer</h3>
<p>Thay vì sửa trực tiếp điểm ảnh, thêm <strong>adjustment layer</strong> (Brightness/Contrast, Curves, Hue/Saturation) tác động lên mọi thứ bên dưới và chỉnh hay bỏ đi lúc nào cũng được.</p>
<h3>Layer style (hiệu ứng)</h3>
<p>Bấm đúp vào layer để thêm <strong>Drop Shadow</strong>, <strong>Stroke</strong>, <strong>Gradient Overlay</strong>... — hiệu ứng sống, tự cập nhật khi bạn sửa layer.</p>
<h3>Xuất file</h3>
<pre><code>Tài nguyên web/UI : File &gt; Export &gt; Export As (PNG nếu cần trong suốt, JPG cho ảnh)
In                : Save As TIFF/PDF ở hệ CMYK
Bản gốc sửa được  : giữ file .PSD nhiều layer</code></pre>
<div class="callout"><span class="badge">Mẹo</span> Luôn giữ file <strong>.PSD</strong> nhiều layer làm bản gốc, rồi xuất bản sao đã gộp. Không thể "tách gộp" một file JPG.</div>`,
  ]]);

const c3q = quiz('dtg102-quiz-3', 'Quiz 3 — Photoshop advanced|||Quiz 3 — Photoshop nâng cao', [
  { id: 'q1', question: 'Blending mode nào LÀM SÁNG, hợp cho quầng sáng/lửa?', options: ['Multiply', 'Screen', 'Normal', 'Darken'], correctIndex: 1, explanation: 'Screen làm sáng; Multiply làm tối.' },
  { id: 'q2', question: 'Lợi ích chính của Smart Object là?', options: ['Nén file nhỏ hơn', 'Thu/phóng và áp filter không phá huỷ, phóng lại không vỡ', 'Tự đổi sang CMYK', 'Xoá nền tự động'], correctIndex: 1, explanation: 'Smart Object cho phép sửa/scale không phá huỷ và filter thành Smart Filter.' },
  { id: 'q3', question: 'Định dạng nào nên giữ làm BẢN GỐC sửa được của file Photoshop?', options: ['JPG đã gộp', 'PSD nhiều layer', 'GIF', 'BMP'], correctIndex: 1, explanation: 'PSD giữ layer; JPG gộp phẳng không tách lại được.' },
]);

const c4 = doc('dtg102-4-1-illustrator-basics', '4.1 — Illustrator basics: paths, pen tool, shapes|||4.1 — Illustrator cơ bản: path, pen tool, shape',
  'Vector & anchor point/path; Shape tool (hình cơ bản); Pen tool (vẽ đường cong Bézier); Selection vs Direct Selection; Pathfinder (gộp/cắt hình); fill & stroke.',
  [[
    `<span class="eyebrow">DTG102 · Chapter 4 · Lesson 4.1</span>
<h2>Illustrator basics: paths, pen tool, shapes</h2>
<h3>Anchor points &amp; paths</h3>
<p>Every vector shape is a <strong>path</strong>: a line between <strong>anchor points</strong>. Each point can be a corner or a smooth curve controlled by <em>handles</em>. A path has a <strong>fill</strong> (inside color) and a <strong>stroke</strong> (outline).</p>
<h3>Shape tools</h3>
<p>Start with primitives — <strong>Rectangle</strong>, <strong>Ellipse</strong>, <strong>Polygon</strong>. Hold <em>Shift</em> to constrain to a perfect square/circle. Most icons are just simple shapes combined.</p>
<h3>The Pen tool</h3>
<p>The <strong>Pen (P)</strong> is the heart of Illustrator:</p>
<pre><code>Click        -&gt; straight corner point
Click + drag -&gt; smooth curve point (drag out the handles)
Close path   -&gt; click the first anchor again
Add/remove   -&gt; hover a path segment / an anchor with the Pen</code></pre>
<h3>Selecting</h3>
<ul>
<li><strong>Selection tool (V)</strong> — moves/scales the <em>whole</em> object.</li>
<li><strong>Direct Selection (A)</strong> — grabs a single anchor point or handle to reshape a path.</li>
</ul>
<h3>Pathfinder</h3>
<p>Combine shapes with the <strong>Pathfinder</strong> panel: <strong>Unite</strong> (merge), <strong>Minus Front</strong> (punch a hole), <strong>Intersect</strong> (keep the overlap). This is how you build complex icons from simple parts.</p>
<div class="callout"><span class="badge">Tip</span> The Pen tool feels awkward for everyone at first. Trace a few letters or a simple logo — muscle memory comes fast.</div>`,
    `<span class="eyebrow">DTG102 · Chương 4 · Bài 4.1</span>
<h2>Illustrator cơ bản: path, pen tool, shape</h2>
<h3>Anchor point &amp; path</h3>
<p>Mọi hình vector là một <strong>path</strong>: đường nối giữa các <strong>anchor point</strong> (điểm neo). Mỗi điểm có thể là góc nhọn hoặc đường cong mượt điều khiển bằng <em>tay nắm (handle)</em>. Một path có <strong>fill</strong> (màu tô bên trong) và <strong>stroke</strong> (viền).</p>
<h3>Công cụ hình (shape)</h3>
<p>Bắt đầu bằng hình cơ bản — <strong>Rectangle</strong>, <strong>Ellipse</strong>, <strong>Polygon</strong>. Giữ <em>Shift</em> để ép thành hình vuông/tròn hoàn hảo. Phần lớn icon chỉ là các hình đơn giản ghép lại.</p>
<h3>Công cụ Pen</h3>
<p><strong>Pen (P)</strong> là trái tim của Illustrator:</p>
<pre><code>Bấm         -&gt; điểm góc thẳng
Bấm + kéo   -&gt; điểm cong mượt (kéo tay nắm ra)
Đóng path   -&gt; bấm lại vào anchor đầu tiên
Thêm/bớt    -&gt; rê Pen lên đoạn path / lên một anchor</code></pre>
<h3>Chọn đối tượng</h3>
<ul>
<li><strong>Selection tool (V)</strong> — di chuyển/phóng <em>cả</em> đối tượng.</li>
<li><strong>Direct Selection (A)</strong> — tóm một anchor point hay tay nắm để nắn lại path.</li>
</ul>
<h3>Pathfinder</h3>
<p>Ghép hình bằng bảng <strong>Pathfinder</strong>: <strong>Unite</strong> (gộp), <strong>Minus Front</strong> (khoét lỗ), <strong>Intersect</strong> (giữ phần chồng). Đây là cách dựng icon phức tạp từ các phần đơn giản.</p>
<div class="callout"><span class="badge">Mẹo</span> Ai mới học Pen cũng thấy ngượng tay. Hãy đồ vài chữ cái hay một logo đơn giản — quen tay rất nhanh.</div>`,
  ]]);

const c4q = quiz('dtg102-quiz-4', 'Quiz 4 — Illustrator basics|||Quiz 4 — Illustrator cơ bản', [
  { id: 'q1', question: 'Với công cụ Pen, "bấm rồi kéo" tạo ra?', options: ['Điểm góc thẳng', 'Điểm cong mượt (có tay nắm)', 'Xoá anchor', 'Đóng path'], correctIndex: 1, explanation: 'Bấm + kéo kéo tay nắm ra, tạo điểm cong Bézier mượt.' },
  { id: 'q2', question: 'Muốn nắn MỘT anchor point của path thì dùng?', options: ['Selection tool (V)', 'Direct Selection (A)', 'Zoom tool', 'Hand tool'], correctIndex: 1, explanation: 'Direct Selection (A) chọn từng anchor/handle; Selection (V) chọn cả đối tượng.' },
  { id: 'q3', question: 'Lệnh Pathfinder nào KHOÉT hình trên cùng ra khỏi hình dưới?', options: ['Unite', 'Minus Front', 'Intersect', 'Merge'], correctIndex: 1, explanation: 'Minus Front lấy hình trên trừ khỏi hình dưới (khoét lỗ).' },
]);

const c5 = doc('dtg102-5-1-illustrator-advanced', '5.1 — Illustrator advanced: type, logos, gradients, SVG|||5.1 — Illustrator nâng cao: typography, logo, gradient, SVG',
  'Typography (Type tool, font, tracking/kerning, Create Outlines); dựng logo; gradient & Gradient tool; brush; và xuất SVG cho web.',
  [[
    `<span class="eyebrow">DTG102 · Chapter 5 · Lesson 5.1</span>
<h2>Illustrator advanced: type, logos, gradients, SVG</h2>
<h3>Typography</h3>
<p>The <strong>Type tool (T)</strong> creates editable text. Control the feel with the <strong>Character</strong> panel: font, size, <strong>tracking</strong> (space across a word) and <strong>kerning</strong> (space between two letters). When the logo is final, run <strong>Type &gt; Create Outlines</strong> to turn letters into vector shapes so the file opens correctly on any machine, even without the font installed.</p>
<h3>Building a logo</h3>
<pre><code>1. Sketch the idea; block it out with simple shapes
2. Combine with Pathfinder into one clean mark
3. Set the wordmark type; adjust kerning by eye
4. Test at tiny size (favicon) and huge size (banner)
5. Create Outlines on a COPY; keep an editable master</code></pre>
<h3>Gradients</h3>
<p>Apply a <strong>gradient</strong> fill (linear or radial) and drag with the <strong>Gradient tool (G)</strong> to set its direction and length. Add color stops on the gradient bar for multi-color blends.</p>
<h3>Brushes</h3>
<p><strong>Art</strong> and <strong>Scatter</strong> brushes turn a stroke into expressive, hand-drawn or patterned lines — still fully vector and editable.</p>
<h3>Exporting SVG</h3>
<p>For the web, use <strong>File &gt; Export &gt; Export As &gt; SVG</strong>: tiny file size, infinitely scalable, and stylable with CSS. Use <strong>Save As &gt; PDF/EPS</strong> or <strong>.AI</strong> for print and archives.</p>
<div class="callout"><span class="badge">Tip</span> Always keep one editable <strong>.AI</strong> master with live text. Outline a <em>copy</em> for delivery — outlined text can no longer be edited.</div>`,
    `<span class="eyebrow">DTG102 · Chương 5 · Bài 5.1</span>
<h2>Illustrator nâng cao: typography, logo, gradient, SVG</h2>
<h3>Typography (chữ)</h3>
<p><strong>Type tool (T)</strong> tạo chữ sửa được. Điều chỉnh cảm giác chữ bằng bảng <strong>Character</strong>: font, cỡ, <strong>tracking</strong> (giãn cách cả từ) và <strong>kerning</strong> (khoảng giữa hai chữ cái). Khi logo đã chốt, chạy <strong>Type &gt; Create Outlines</strong> để biến chữ thành hình vector, nhờ vậy file mở đúng trên mọi máy dù không cài font.</p>
<h3>Dựng một logo</h3>
<pre><code>1. Phác ý tưởng; dựng thô bằng hình đơn giản
2. Ghép bằng Pathfinder thành một dấu hiệu gọn
3. Đặt phần chữ (wordmark); chỉnh kerning bằng mắt
4. Thử ở cỡ rất nhỏ (favicon) và rất lớn (banner)
5. Create Outlines trên một BẢN SAO; giữ bản gốc sửa được</code></pre>
<h3>Gradient (chuyển màu)</h3>
<p>Áp tô <strong>gradient</strong> (linear hoặc radial) rồi kéo bằng <strong>Gradient tool (G)</strong> để đặt hướng và độ dài. Thêm color stop trên thanh gradient để trộn nhiều màu.</p>
<h3>Brush (cọ)</h3>
<p>Cọ <strong>Art</strong> và <strong>Scatter</strong> biến một nét thành đường vẽ tay hay hoạ tiết biểu cảm — vẫn hoàn toàn là vector và sửa được.</p>
<h3>Xuất SVG</h3>
<p>Cho web, dùng <strong>File &gt; Export &gt; Export As &gt; SVG</strong>: dung lượng nhỏ, phóng to vô hạn, và tạo kiểu được bằng CSS. Dùng <strong>Save As &gt; PDF/EPS</strong> hoặc <strong>.AI</strong> cho in ấn và lưu trữ.</p>
<div class="callout"><span class="badge">Mẹo</span> Luôn giữ một bản gốc <strong>.AI</strong> còn chữ sống. Chỉ outline một <em>bản sao</em> để giao — chữ đã outline thì không sửa nội dung được nữa.</div>`,
  ]]);

const c5q = quiz('dtg102-quiz-5', 'Quiz 5 — Illustrator advanced|||Quiz 5 — Illustrator nâng cao', [
  { id: 'q1', question: 'Vì sao chạy "Create Outlines" cho chữ trong logo trước khi giao file?', options: ['Để nén file', 'Để chữ thành vector, mở đúng dù máy khác không cài font', 'Để đổi sang RGB', 'Để thêm gradient'], correctIndex: 1, explanation: 'Create Outlines biến chữ thành hình vector nên không phụ thuộc font đã cài.' },
  { id: 'q2', question: 'Khoảng cách giữa HAI chữ cái cụ thể gọi là?', options: ['Tracking', 'Kerning', 'Leading', 'Stroke'], correctIndex: 1, explanation: 'Kerning là khoảng giữa hai chữ; tracking là giãn cách cả cụm.' },
  { id: 'q3', question: 'Định dạng nào hợp nhất để đưa logo vector lên WEB?', options: ['JPG', 'SVG', 'BMP', 'TIFF'], correctIndex: 1, explanation: 'SVG nhỏ gọn, phóng to vô hạn và tạo kiểu bằng CSS được.' },
]);

const c6 = doc('dtg102-6-1-indesign-layout', '6.1 — InDesign & page layout|||6.1 — InDesign & dàn trang',
  'InDesign cho tài liệu nhiều trang; frame chữ & ảnh; master page (A-Master); luồng chữ (text flow) qua nhiều trang; lưới & margin; chuẩn bị in (bleed, marks).',
  [[
    `<span class="eyebrow">DTG102 · Chapter 6 · Lesson 6.1</span>
<h2>InDesign &amp; page layout</h2>
<h3>Why InDesign</h3>
<p>Photoshop and Illustrator make <em>assets</em>; <strong>InDesign</strong> assembles them into <em>multi-page documents</em> — brochures, magazines, reports — with precise, repeatable layout.</p>
<h3>Frames</h3>
<p>Everything sits in a <strong>frame</strong>: a <strong>text frame</strong> holds type, a <strong>graphic frame</strong> holds a placed image (File &gt; Place). Frames keep content tidy and re-flowable.</p>
<h3>Master pages</h3>
<p>A <strong>master page (A-Master)</strong> holds elements that repeat on every page — page numbers, headers, the grid. Change the master once and every page updates. This is the big time-saver for long documents.</p>
<h3>Text flow</h3>
<pre><code>1. File &gt; Place a long text file
2. Click to pour text into the first frame
3. Click the red "+" overflow marker
4. Click the next page/column to continue the story
   (hold Shift for auto-flow across many pages)</code></pre>
<h3>Grids, margins &amp; columns</h3>
<p>Set <strong>margins and columns</strong> at document setup; align every element to this grid so the layout reads as one clean system.</p>
<h3>Print prep</h3>
<p>Add <strong>bleed</strong> (~3 mm) so background art runs past the trim edge, and include <strong>crop marks</strong> when exporting the print PDF.</p>
<div class="callout"><span class="badge">Tip</span> Link (Place), do not paste, your images — InDesign keeps them as references so the file stays light and updates when you edit the source.</div>`,
    `<span class="eyebrow">DTG102 · Chương 6 · Bài 6.1</span>
<h2>InDesign &amp; dàn trang</h2>
<h3>Vì sao dùng InDesign</h3>
<p>Photoshop và Illustrator tạo ra <em>tài nguyên</em>; <strong>InDesign</strong> lắp chúng thành <em>tài liệu nhiều trang</em> — brochure, tạp chí, báo cáo — với bố cục chính xác, lặp lại được.</p>
<h3>Frame (khung)</h3>
<p>Mọi thứ nằm trong một <strong>frame</strong>: <strong>text frame</strong> chứa chữ, <strong>graphic frame</strong> chứa ảnh đặt vào (File &gt; Place). Frame giữ nội dung gọn gàng và chảy lại được.</p>
<h3>Master page (trang chủ)</h3>
<p><strong>Master page (A-Master)</strong> chứa những phần lặp trên mọi trang — số trang, tiêu đề chạy, lưới. Sửa master một lần là mọi trang cập nhật. Đây là thứ tiết kiệm thời gian lớn nhất cho tài liệu dài.</p>
<h3>Luồng chữ (text flow)</h3>
<pre><code>1. File &gt; Place một file văn bản dài
2. Bấm để đổ chữ vào frame đầu tiên
3. Bấm dấu "+" đỏ báo tràn (overflow)
4. Bấm sang trang/cột kế để nối tiếp mạch chữ
   (giữ Shift để tự đổ qua nhiều trang)</code></pre>
<h3>Lưới, lề &amp; cột</h3>
<p>Đặt <strong>lề và cột</strong> khi tạo tài liệu; căn mọi phần tử theo lưới này để bố cục đọc như một hệ thống gọn gàng.</p>
<h3>Chuẩn bị in</h3>
<p>Thêm <strong>bleed</strong> (khoảng 3 mm) để nền tràn qua mép cắt, và bật <strong>crop marks</strong> khi xuất PDF in.</p>
<div class="callout"><span class="badge">Mẹo</span> Hãy liên kết (Place) ảnh, đừng dán — InDesign giữ ảnh dạng tham chiếu nên file nhẹ và tự cập nhật khi bạn sửa file nguồn.</div>`,
  ]]);

const c6q = quiz('dtg102-quiz-6', 'Quiz 6 — InDesign & layout|||Quiz 6 — InDesign & dàn trang', [
  { id: 'q1', question: 'Phần mềm nào hợp nhất để dàn tài liệu NHIỀU TRANG (tạp chí, brochure)?', options: ['Photoshop', 'Illustrator', 'InDesign', 'Acrobat'], correctIndex: 2, explanation: 'InDesign chuyên lắp tài nguyên thành tài liệu nhiều trang.' },
  { id: 'q2', question: 'Đặt số trang & tiêu đề lặp lại trên MỌI trang thì dùng?', options: ['Layer style', 'Master page', 'Pathfinder', 'Smart Object'], correctIndex: 1, explanation: 'Master page chứa phần lặp; sửa master một lần, mọi trang cập nhật.' },
  { id: 'q3', question: '"Bleed" khi chuẩn bị in dùng để?', options: ['Nén PDF', 'Cho nền tràn qua mép cắt để không lộ viền trắng', 'Đổi RGB sang CMYK', 'Thêm số trang'], correctIndex: 1, explanation: 'Bleed (~3mm) cho hình nền chạy quá mép cắt, tránh viền trắng sau khi xén.' },
]);

const c7 = doc('dtg102-7-1-workflow-file-formats', '7.1 — Workflow & file formats|||7.1 — Quy trình & định dạng file',
  'Quy trình thiết kế; file gốc (PSD/AI/INDD) vs file giao (PDF/PNG/JPG/SVG); DPI cho in vs web; nén có/không mất dữ liệu; quản lý màu (color management) & profile.',
  [[
    `<span class="eyebrow">DTG102 · Chapter 7 · Lesson 7.1</span>
<h2>Workflow &amp; file formats</h2>
<h3>Master files vs delivery files</h3>
<p>Keep two kinds of files. The <strong>editable master</strong> stays layered and live; the <strong>delivery file</strong> is a flattened export for a specific use.</p>
<pre><code>Master (keep, editable)  ->  Delivery (export per use)
Photoshop  .PSD          ->  JPG / PNG (web), TIFF/PDF (print)
Illustrator .AI          ->  SVG (web), PDF/EPS (print)
InDesign   .INDD         ->  PDF (print or interactive)</code></pre>
<h3>Choosing a raster format</h3>
<ul>
<li><strong>JPG</strong> — photos; small, but <em>lossy</em> (quality drops each save). No transparency.</li>
<li><strong>PNG</strong> — <em>lossless</em>, supports transparency; best for UI, logos on web, screenshots.</li>
<li><strong>GIF</strong> — few colors, simple animation.</li>
<li><strong>WebP</strong> — modern web format, smaller than JPG/PNG at similar quality.</li>
</ul>
<h3>Print vs web</h3>
<pre><code>            Print              Web
Resolution  300 DPI            72 PPI
Color       CMYK               RGB
Format      PDF / TIFF         PNG / JPG / SVG / WebP</code></pre>
<h3>Color management</h3>
<p>A <strong>color profile</strong> (e.g. sRGB for web, a CMYK profile for a specific printer) tells every device how to interpret the numbers so colors stay consistent. Design in sRGB for screen; soft-proof and convert to the printer profile before print.</p>
<div class="callout"><span class="badge">Tip</span> Never edit a JPG repeatedly — each save loses data. Edit the master, then export a fresh JPG only when you deliver.</div>`,
    `<span class="eyebrow">DTG102 · Chương 7 · Bài 7.1</span>
<h2>Quy trình &amp; định dạng file</h2>
<h3>File gốc &amp; file giao</h3>
<p>Giữ hai loại file. <strong>File gốc sửa được</strong> còn layer, còn sống; <strong>file giao</strong> là bản xuất đã gộp phẳng cho một mục đích cụ thể.</p>
<pre><code>Gốc (giữ, sửa được)   ->  Giao (xuất theo mục đích)
Photoshop  .PSD       ->  JPG / PNG (web), TIFF/PDF (in)
Illustrator .AI       ->  SVG (web), PDF/EPS (in)
InDesign   .INDD      ->  PDF (in hoặc tương tác)</code></pre>
<h3>Chọn định dạng raster</h3>
<ul>
<li><strong>JPG</strong> — ảnh chụp; nhỏ, nhưng <em>mất dữ liệu</em> (mỗi lần lưu giảm chất). Không có nền trong suốt.</li>
<li><strong>PNG</strong> — <em>không mất dữ liệu</em>, có nền trong suốt; hợp UI, logo trên web, ảnh chụp màn hình.</li>
<li><strong>GIF</strong> — ít màu, ảnh động đơn giản.</li>
<li><strong>WebP</strong> — định dạng web hiện đại, nhỏ hơn JPG/PNG ở cùng chất lượng.</li>
</ul>
<h3>In &amp; web</h3>
<pre><code>            In                 Web
Độ phân giải 300 DPI            72 PPI
Hệ màu       CMYK               RGB
Định dạng    PDF / TIFF         PNG / JPG / SVG / WebP</code></pre>
<h3>Quản lý màu (color management)</h3>
<p><strong>Color profile</strong> (vd sRGB cho web, một profile CMYK cho máy in cụ thể) cho mọi thiết bị biết cách hiểu các con số màu để màu giữ nhất quán. Thiết kế bằng sRGB cho màn hình; soft-proof và đổi sang profile máy in trước khi in.</p>
<div class="callout"><span class="badge">Mẹo</span> Đừng sửa đi sửa lại một file JPG — mỗi lần lưu là mất thêm dữ liệu. Hãy sửa file gốc, chỉ xuất JPG mới khi giao.</div>`,
  ]]);

const c7q = quiz('dtg102-quiz-7', 'Quiz 7 — Workflow & file formats|||Quiz 7 — Quy trình & định dạng', [
  { id: 'q1', question: 'Định dạng raster nào KHÔNG mất dữ liệu và hỗ trợ nền TRONG SUỐT?', options: ['JPG', 'PNG', 'BMP', 'TIFF phẳng'], correctIndex: 1, explanation: 'PNG lossless và có kênh alpha (trong suốt); JPG lossy, không trong suốt.' },
  { id: 'q2', question: 'Vì sao không nên lưu đè một file JPG nhiều lần?', options: ['JPG không mở lại được', 'JPG lossy — mỗi lần lưu lại mất thêm dữ liệu, giảm chất', 'JPG luôn ở CMYK', 'JPG mất nền trong suốt'], correctIndex: 1, explanation: 'JPG nén mất dữ liệu; lưu lặp lại làm chất lượng xuống dần.' },
  { id: 'q3', question: 'Cặp đúng cho sản phẩm IN là?', options: ['72 PPI + RGB', '300 DPI + CMYK', '72 DPI + CMYK', '300 PPI + RGB'], correctIndex: 1, explanation: 'In cần ~300 DPI và hệ màu CMYK.' },
]);

const c8 = doc('dtg102-8-1-capstone-project', '8.1 — Capstone: from idea to published design|||8.1 — Dự án tổng hợp: từ ý tưởng tới xuất bản',
  'Ghép cả ba phần mềm vào một dự án thật (poster / brochure / social media); quy trình 6 bước: brief → moodboard → tài nguyên (PS+AI) → dàn trang (InDesign) → soát lỗi → xuất bản đúng định dạng.',
  [[
    `<span class="eyebrow">DTG102 · Chapter 8 · Lesson 8.1</span>
<h2>Capstone: from idea to published design</h2>
<h3>The project</h3>
<p>Pick one deliverable — an <strong>event poster</strong>, a <strong>tri-fold brochure</strong>, or a <strong>social media set</strong> — and take it end to end using every tool from this course.</p>
<h3>The workflow</h3>
<pre><code>1. Brief      : who is it for, one message, size &amp; medium (print/web)
2. Moodboard  : gather references; pick colors (Adobe Color) &amp; fonts
3. Assets     : Photoshop for photos/retouch; Illustrator for logo/icons
4. Layout     : assemble in InDesign (poster/brochure) or PS/AI (social)
5. Review     : proofread text, check alignment, contrast, bleed
6. Export     : right format &amp; color mode for the medium</code></pre>
<h3>Which tool where</h3>
<ul>
<li><strong>Photoshop</strong> — prepare and retouch every photo; build the RGB social-media graphics.</li>
<li><strong>Illustrator</strong> — the logo, icons, and any vector illustration or headline treatment.</li>
<li><strong>InDesign</strong> — place those assets into the multi-page or print layout with a grid and master page.</li>
</ul>
<h3>Deliver correctly</h3>
<pre><code>Print poster/brochure -&gt; PDF, CMYK, 300 DPI, 3 mm bleed + crop marks
Social media set       -&gt; PNG/JPG, RGB, exact pixel size per platform</code></pre>
<div class="callout"><span class="badge">Tip</span> A design is only finished when it is exported in the <strong>right format, color mode and resolution</strong> for where it will live. Keep every editable master alongside the final export.</div>`,
    `<span class="eyebrow">DTG102 · Chương 8 · Bài 8.1</span>
<h2>Dự án tổng hợp: từ ý tưởng tới xuất bản</h2>
<h3>Dự án</h3>
<p>Chọn một sản phẩm — <strong>poster sự kiện</strong>, <strong>brochure gấp ba</strong>, hoặc <strong>bộ ảnh mạng xã hội</strong> — và làm trọn vẹn từ đầu tới cuối bằng mọi công cụ trong môn này.</p>
<h3>Quy trình</h3>
<pre><code>1. Brief      : cho ai, một thông điệp, kích thước &amp; kênh (in/web)
2. Moodboard  : gom tham chiếu; chọn màu (Adobe Color) &amp; font
3. Tài nguyên : Photoshop cho ảnh/retouch; Illustrator cho logo/icon
4. Dàn trang  : lắp trong InDesign (poster/brochure) hoặc PS/AI (social)
5. Soát lỗi   : dò chữ, kiểm căn lề, tương phản, bleed
6. Xuất bản   : đúng định dạng &amp; hệ màu cho kênh</code></pre>
<h3>Công cụ nào ở đâu</h3>
<ul>
<li><strong>Photoshop</strong> — chuẩn bị và chỉnh mọi ảnh chụp; dựng đồ hoạ mạng xã hội hệ RGB.</li>
<li><strong>Illustrator</strong> — logo, icon, và mọi minh hoạ vector hay xử lý tiêu đề.</li>
<li><strong>InDesign</strong> — đặt các tài nguyên đó vào bố cục nhiều trang hay bản in với lưới và master page.</li>
</ul>
<h3>Giao đúng cách</h3>
<pre><code>Poster/brochure in -&gt; PDF, CMYK, 300 DPI, bleed 3 mm + crop marks
Bộ ảnh mạng xã hội  -&gt; PNG/JPG, RGB, đúng số điểm ảnh theo nền tảng</code></pre>
<div class="callout"><span class="badge">Mẹo</span> Một thiết kế chỉ xong khi được xuất đúng <strong>định dạng, hệ màu và độ phân giải</strong> cho nơi nó sẽ nằm. Luôn giữ mọi file gốc sửa được bên cạnh bản xuất cuối.</div>`,
  ]]);

const c8q = quiz('dtg102-quiz-8', 'Quiz 8 — Capstone project|||Quiz 8 — Dự án tổng hợp', [
  { id: 'q1', question: 'Trong dự án, phần mềm nào hợp nhất để tạo LOGO và icon?', options: ['Photoshop', 'Illustrator', 'InDesign', 'Acrobat'], correctIndex: 1, explanation: 'Logo/icon là vector — dựng trong Illustrator để phóng to sạch nét.' },
  { id: 'q2', question: 'Xuất một POSTER để IN thì đúng nhất là?', options: ['PNG, RGB, 72 DPI', 'PDF, CMYK, 300 DPI, có bleed', 'JPG, RGB, 72 PPI', 'SVG, RGB'], correctIndex: 1, explanation: 'Bản in: PDF, hệ CMYK, ~300 DPI, kèm bleed & crop marks.' },
  { id: 'q3', question: 'Bước nào của quy trình đặt ra "cho ai, thông điệp gì, kích thước/kênh nào"?', options: ['Brief', 'Xuất bản', 'Soát lỗi', 'Dàn trang'], correctIndex: 0, explanation: 'Brief xác định đối tượng, thông điệp và kích thước/kênh trước khi làm.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'DTG102',
    slug: 'dtg102-visual-design-tools',
    title: 'Visual Design Tools',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DTG102.webp',
    shortDescription: 'Industry-standard toolkit for visual design: raster vs vector, Photoshop (layers, masks, blending, smart objects), Illustrator (pen tool, logos, SVG) and InDesign (layout, print). Bilingual, step-by-step, with quizzes.|||Bộ công cụ chuẩn ngành cho thiết kế đồ hoạ: raster & vector, Photoshop (layer, mask, blending, smart object), Illustrator (pen tool, logo, SVG) và InDesign (dàn trang, in ấn). Song ngữ, từng bước, có quiz.',
    description: 'Môn <strong>DTG102 — Visual Design Tools</strong> (Kỳ 1, ngành Thiết kế mỹ thuật số) dạy <strong>bộ công cụ chuẩn ngành</strong>: Adobe Photoshop, Illustrator và InDesign. Từ <strong>raster vs vector</strong> (độ phân giải, RGB/CMYK) → <strong>Photoshop</strong> (layer, vùng chọn, mask, retouch; blending, smart object, filter) → <strong>Illustrator</strong> (path, pen tool, Pathfinder; typography, logo, gradient, SVG) → <strong>InDesign</strong> (master page, luồng chữ, dàn trang, in ấn) → <strong>quy trình &amp; định dạng file</strong> và <strong>dự án tổng hợp</strong> từ ý tưởng tới xuất bản. Bám giáo trình Adobe, song ngữ, hướng dẫn thao tác từng bước, quiz mỗi chương.',
    whatYouLearn: 'Phân biệt raster &amp; vector, độ phân giải/DPI, RGB &amp; CMYK; Photoshop: layer, vùng chọn, layer mask, retouch, blending mode, smart object, filter, xuất file; Illustrator: path &amp; pen tool, shape, Pathfinder, typography, logo, gradient, brush, xuất SVG; InDesign: frame, master page, luồng chữ, lưới/lề, chuẩn bị in (bleed); quy trình thiết kế và chọn đúng định dạng cho in vs web; dự án tổng hợp poster/brochure/social media.',
    requirements: 'Không cần kinh nghiệm trước. Nên cài Adobe Creative Cloud (gói sinh viên) hoặc dùng bản thay thế miễn phí (Photopea) để thực hành theo từng bước.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách Adobe, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Ba phần mềm Adobe và khi nào dùng cái nào.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & raster vs vector|||Chapter 1 — Overview & raster vs vector', description: 'Bitmap vs vector, chọn công cụ, DPI, RGB/CMYK.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Photoshop cơ bản|||Chapter 2 — Photoshop basics', description: 'Giao diện, layer, vùng chọn, mask, retouch.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Photoshop nâng cao|||Chapter 3 — Photoshop advanced', description: 'Blending, smart object, filter, hiệu ứng, xuất file.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Illustrator cơ bản|||Chapter 4 — Illustrator basics', description: 'Path, pen tool, shape, Pathfinder, fill/stroke.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Illustrator nâng cao|||Chapter 5 — Illustrator advanced', description: 'Typography, logo, gradient, brush, xuất SVG.', lessons: [c5, c5q] },
    { title: 'Chương 6 — InDesign & dàn trang|||Chapter 6 — InDesign & layout', description: 'Frame, master page, luồng chữ, lưới, chuẩn bị in.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Quy trình & định dạng file|||Chapter 7 — Workflow & file formats', description: 'File gốc vs giao, PSD/AI/PDF/PNG/JPG, DPI, color management.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Dự án tổng hợp|||Chapter 8 — Capstone project', description: 'Poster/brochure/social media, quy trình 6 bước tới xuất bản.', lessons: [c8, c8q] },
  ],
};
