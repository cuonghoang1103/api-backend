/**
 * DGP201 — Digital Painting (Vẽ kỹ thuật số). Ngành Thiết kế mỹ thuật số FPTU.
 * Khung chất lượng, 8 chương: nhập môn vẽ số → nét & phác thảo → giá trị sáng
 * tối → lý thuyết màu & ánh sáng → brush & texture → rendering & hoàn thiện →
 * vẽ theo chủ đề → quy trình & workflow. Nguồn chuẩn: James Gurney "Color and
 * Light" & "Imaginative Realism", Ctrl+Paint, nền tảng Photoshop/Procreate,
 * ArtStation Learning. Song ngữ + kỹ thuật từng bước + mẹo phần mềm.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ lồng; &→&amp;
 * trong HTML; tránh nháy đơn trong chuỗi JS.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('dgp201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách nền tảng (Gurney), Ctrl+Paint, ArtStation Learning, YouTube, phần mềm & brush, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">DGP201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>digital painting</strong> — software &amp; tablet, line &amp; sketch, value, color &amp; light, brushes, rendering and a full workflow — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for DGP201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Foundation books</h3>
<ul>
<li><a href="https://jamesgurney.com/products/color-and-light-a-guide-for-the-realist-painter" target="_blank" rel="noopener">James Gurney — <em>Color and Light: A Guide for the Realist Painter</em></a></li>
<li><a href="https://jamesgurney.com/products/imaginative-realism-how-to-paint-what-doesnt-exist" target="_blank" rel="noopener">James Gurney — <em>Imaginative Realism</em></a></li>
</ul>
<h3>🌐 Free tutorials</h3>
<ul>
<li><a href="https://www.ctrlpaint.com/library" target="_blank" rel="noopener">Ctrl+Paint — free digital painting library (fundamentals first)</a></li>
<li><a href="https://www.artstation.com/learning" target="_blank" rel="noopener">ArtStation Learning — industry courses</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@ctrlpaint" target="_blank" rel="noopener">Ctrl+Paint</a> — short, structured lessons</li>
<li><a href="https://www.youtube.com/@ProkoTV" target="_blank" rel="noopener">Proko</a> — drawing &amp; anatomy fundamentals</li>
</ul>
<h3>🛠️ Software &amp; tools</h3>
<ul>
<li><a href="https://www.adobe.com/products/photoshop.html" target="_blank" rel="noopener">Adobe Photoshop</a> — industry standard for painting</li>
<li><a href="https://procreate.com/" target="_blank" rel="noopener">Procreate</a> — iPad painting app</li>
<li><a href="https://krita.org/" target="_blank" rel="noopener">Krita</a> — free, open-source painting software</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — set up software &amp; tablet, learn layers, brushes and line control.</li>
<li><strong>Values first</strong> — paint in greyscale to master form, light and shadow before color.</li>
<li><strong>Add color</strong> — learn hue/saturation/value and Gurney color-and-light principles.</li>
<li><strong>Job-ready</strong> — run a full idea-to-export workflow and build a clean portfolio.</li>
</ol></div>`,
    `<span class="eyebrow">DGP201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>vẽ kỹ thuật số</strong> — phần mềm &amp; bảng vẽ, nét &amp; phác thảo, giá trị, màu &amp; ánh sáng, brush, rendering và quy trình đầy đủ — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DGP201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách nền tảng</h3>
<ul>
<li><a href="https://jamesgurney.com/products/color-and-light-a-guide-for-the-realist-painter" target="_blank" rel="noopener">James Gurney — <em>Color and Light</em> (màu &amp; ánh sáng)</a></li>
<li><a href="https://jamesgurney.com/products/imaginative-realism-how-to-paint-what-doesnt-exist" target="_blank" rel="noopener">James Gurney — <em>Imaginative Realism</em></a></li>
</ul>
<h3>🌐 Hướng dẫn miễn phí</h3>
<ul>
<li><a href="https://www.ctrlpaint.com/library" target="_blank" rel="noopener">Ctrl+Paint — thư viện vẽ số miễn phí (nền tảng trước)</a></li>
<li><a href="https://www.artstation.com/learning" target="_blank" rel="noopener">ArtStation Learning — khoá học chuẩn ngành</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ctrlpaint" target="_blank" rel="noopener">Ctrl+Paint</a> — bài ngắn, có hệ thống</li>
<li><a href="https://www.youtube.com/@ProkoTV" target="_blank" rel="noopener">Proko</a> — nền tảng vẽ &amp; giải phẫu</li>
</ul>
<h3>🛠️ Phần mềm &amp; công cụ</h3>
<ul>
<li><a href="https://www.adobe.com/products/photoshop.html" target="_blank" rel="noopener">Adobe Photoshop</a> — chuẩn ngành cho vẽ số</li>
<li><a href="https://procreate.com/" target="_blank" rel="noopener">Procreate</a> — ứng dụng vẽ trên iPad</li>
<li><a href="https://krita.org/" target="_blank" rel="noopener">Krita</a> — phần mềm vẽ miễn phí, mã nguồn mở</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — cài phần mềm &amp; bảng vẽ, học layer, brush và làm chủ nét.</li>
<li><strong>Sáng tối trước</strong> — vẽ greyscale để làm chủ khối, ánh sáng và bóng trước khi lên màu.</li>
<li><strong>Thêm màu</strong> — học hue/saturation/value và nguyên lý màu-ánh sáng của Gurney.</li>
<li><strong>Sẵn sàng đi làm</strong> — chạy quy trình đầy đủ từ ý tưởng đến xuất file và dựng portfolio gọn gàng.</li>
</ol></div>`,
  ]]);

const intro = doc('dgp201-0-1-overview', 'Course overview: Digital painting|||Tổng quan: Vẽ kỹ thuật số',
  'Vẽ số là gì; vì sao học fundamentals (nét, giá trị, màu, ánh sáng) trước phần mềm; lộ trình 8 chương từ công cụ đến quy trình portfolio.',
  [[
    `<span class="eyebrow">DGP201 · Lesson 0.1 · Overview</span>
<h2>Digital painting</h2>
<p class="lead">Digital painting is <strong>traditional painting done with a computer or tablet</strong> — the same fundamentals (line, value, color, light, composition), but with the flexibility of layers, undo and endless brushes. This course takes you from a blank canvas to a finished, portfolio-ready piece.</p>
<h3>Tools do not make the artist</h3>
<p>Photoshop and Procreate are only brushes and paper. What matters are the <strong>fundamentals</strong>: how to draw a clean line, read light and shadow as <strong>values</strong>, and mix believable color. We learn the software early, then spend most of the course on those fundamentals.</p>
<h3>Roadmap</h3>
<pre><code>1. Software, tablet, brushes, layers
2. Line &amp; sketch (undersketch -> blocking)
3. Value / greyscale (form &amp; light)
4. Color theory &amp; light (Gurney)
5. Brushes &amp; texture (materials)
6. Rendering &amp; finishing
7. Subject studies (character / scene / object)
8. Full workflow -> portfolio
</code></pre>
<div class="callout"><span class="badge">Mindset</span> Finish small studies often. A dozen finished 30-minute studies teach more than one painting you never complete.</div>`,
    `<span class="eyebrow">DGP201 · Bài 0.1 · Tổng quan</span>
<h2>Vẽ kỹ thuật số</h2>
<p class="lead">Vẽ kỹ thuật số là <strong>vẽ truyền thống thực hiện bằng máy tính hoặc máy tính bảng</strong> — cùng những nền tảng (nét, giá trị, màu, ánh sáng, bố cục), nhưng có sự linh hoạt của layer, undo và vô số brush. Môn này đưa bạn từ khung trắng đến một tác phẩm hoàn thiện, sẵn cho portfolio.</p>
<h3>Công cụ không tạo nên nghệ sĩ</h3>
<p>Photoshop và Procreate chỉ là cây cọ và tờ giấy. Điều quan trọng là <strong>nền tảng</strong>: cách kẻ một nét sạch, đọc ánh sáng và bóng thành <strong>giá trị (value)</strong>, và pha màu thuyết phục. Ta học phần mềm sớm, rồi dành phần lớn thời gian cho các nền tảng đó.</p>
<h3>Lộ trình</h3>
<pre><code>1. Phần mềm, bảng vẽ, brush, layer
2. Nét &amp; phác thảo (undersketch -> blocking)
3. Giá trị / greyscale (khối &amp; ánh sáng)
4. Lý thuyết màu &amp; ánh sáng (Gurney)
5. Brush &amp; texture (chất liệu)
6. Rendering &amp; hoàn thiện
7. Vẽ theo chủ đề (nhân vật / cảnh / đồ vật)
8. Quy trình đầy đủ -> portfolio
</code></pre>
<div class="callout"><span class="badge">Tư duy</span> Hoàn thành các bài study nhỏ thường xuyên. Mười hai bài study 30 phút đã hoàn thành dạy nhiều hơn một bức bạn không bao giờ vẽ xong.</div>`,
  ]]);

const c1 = doc('dgp201-1-1-intro', '1.1 — Getting started: software, tablet, brushes, layers|||1.1 — Nhập môn: phần mềm, bảng vẽ, brush, layer',
  'Phần mềm (Photoshop/Procreate), bảng vẽ Wacom & cảm ứng lực, brush cơ bản, hệ thống layer & blend mode; thiết lập canvas.',
  [[
    `<span class="eyebrow">DGP201 · Chapter 1 · Lesson 1.1</span>
<h2>Getting started</h2>
<h3>Software &amp; tablet</h3>
<ul>
<li><strong>Photoshop</strong> — the industry standard; huge brush ecosystem, precise control.</li>
<li><strong>Procreate</strong> — an affordable iPad app that is fast and intuitive; great to learn on.</li>
<li><strong>Tablet</strong> — a <strong>Wacom</strong> (or iPad + Apple Pencil) gives <strong>pressure sensitivity</strong>: press harder for a darker, wider stroke. This is what makes digital feel like painting.</li>
</ul>
<h3>Brushes &amp; layers</h3>
<ul>
<li><strong>Basic brushes</strong> — a hard round for line, a soft round for gradients, and a textured brush for chunky paint. Start with two or three; do not hoard brushes.</li>
<li><strong>Layers</strong> — stack transparent sheets: sketch on one, color under it, highlights on top. <strong>Blend modes</strong> (Multiply for shadow, Screen/Add for light) mix layers by math, not just opacity.</li>
</ul>
<h3>Set up a canvas — step by step</h3>
<pre><code>1. New file: 2000-3000 px, 300 DPI (print-safe)
2. Fill background with mid-grey (not white)
3. Layer 1: rough sketch (low opacity)
4. Layer 2 (below): base colors / values
5. Save as .PSD / .procreate to keep layers
</code></pre>
<div class="callout"><span class="badge">Software tip</span> Learn the shortcuts early: <code>[</code> and <code>]</code> resize the brush, <code>Alt</code>/eyedropper picks a color from the canvas. They save hours.</div>`,
    `<span class="eyebrow">DGP201 · Chương 1 · Bài 1.1</span>
<h2>Nhập môn vẽ số</h2>
<h3>Phần mềm &amp; bảng vẽ</h3>
<ul>
<li><strong>Photoshop</strong> — chuẩn ngành; hệ sinh thái brush khổng lồ, điều khiển chính xác.</li>
<li><strong>Procreate</strong> — ứng dụng iPad giá dễ chịu, nhanh và trực quan; rất hợp để học.</li>
<li><strong>Bảng vẽ</strong> — <strong>Wacom</strong> (hoặc iPad + Apple Pencil) cho <strong>cảm ứng lực</strong>: nhấn mạnh hơn thì nét đậm và rộng hơn. Đây là thứ khiến vẽ số giống vẽ thật.</li>
</ul>
<h3>Brush &amp; layer</h3>
<ul>
<li><strong>Brush cơ bản</strong> — một hard round cho nét, một soft round cho chuyển sắc, và một brush có texture cho mảng sơn dày. Bắt đầu với hai ba cái; đừng ôm quá nhiều brush.</li>
<li><strong>Layer</strong> — chồng các lớp trong suốt: phác thảo một lớp, màu ở dưới, highlight ở trên. <strong>Blend mode</strong> (Multiply cho bóng, Screen/Add cho sáng) trộn layer bằng phép toán, không chỉ opacity.</li>
</ul>
<h3>Thiết lập canvas — từng bước</h3>
<pre><code>1. File mới: 2000-3000 px, 300 DPI (an toàn in ấn)
2. Đổ nền màu xám trung tính (không phải trắng)
3. Layer 1: phác thảo thô (opacity thấp)
4. Layer 2 (dưới): màu/giá trị nền
5. Lưu .PSD / .procreate để giữ layer
</code></pre>
<div class="callout"><span class="badge">Mẹo phần mềm</span> Học phím tắt sớm: <code>[</code> và <code>]</code> đổi cỡ brush, <code>Alt</code>/eyedropper hút màu từ canvas. Chúng tiết kiệm hàng giờ.</div>`,
  ]]);

const c1q = quiz('dgp201-quiz-1', 'Quiz 1 — Getting started|||Quiz 1 — Nhập môn', [
  { id: 'q1', question: 'Tính năng nào của bảng vẽ Wacom khiến vẽ số giống vẽ thật nhất?', options: ['Màn hình lớn', 'Cảm ứng lực (pressure sensitivity)', 'Cổng USB', 'Số lượng phím tắt'], correctIndex: 1, explanation: 'Cảm ứng lực: nhấn mạnh hơn cho nét đậm/rộng hơn.' },
  { id: 'q2', question: 'Blend mode nào thường dùng để vẽ BÓNG?', options: ['Screen', 'Multiply', 'Add', 'Normal'], correctIndex: 1, explanation: 'Multiply nhân màu, làm tối vùng bên dưới → hợp cho bóng.' },
  { id: 'q3', question: 'Vì sao nên đổ nền màu xám trung tính thay vì trắng khi bắt đầu?', options: ['Tiết kiệm dung lượng file', 'Dễ đánh giá cả vùng sáng và tối', 'Bắt buộc trong Photoshop', 'Giúp file mở nhanh hơn'], correctIndex: 1, explanation: 'Nền xám giúp thấy đúng cả giá trị sáng lẫn tối; nền trắng làm mọi thứ trông tối.' },
]);

const c2 = doc('dgp201-2-1-line-sketch', '2.1 — Line art & sketching|||2.1 — Nét & phác thảo số',
  'Điều khiển nét (line weight), line art sạch, sketch/undersketch, blocking hình khối lớn trước chi tiết; xoay/lật canvas kiểm lỗi.',
  [[
    `<span class="eyebrow">DGP201 · Chapter 2 · Lesson 2.1</span>
<h2>Line &amp; sketch</h2>
<h3>Line control</h3>
<p>A confident line comes from the <strong>shoulder and elbow</strong>, not the wrist. Draw with long, committed strokes. <strong>Line weight</strong> — thicker in shadow and where forms meet, thinner in light — already reads as three-dimensional before any color.</p>
<h3>From sketch to clean line</h3>
<ul>
<li><strong>Undersketch</strong> — a loose, low-opacity sketch to find the pose and big shapes. Keep it messy; it is just a map.</li>
<li><strong>Blocking</strong> — lay in the big shapes first (head, torso, limbs as simple forms) before any detail. Big shapes wrong = detail wasted.</li>
<li><strong>Line art</strong> — on a new layer above, trace clean, deliberate lines with a hard round brush; lower the sketch opacity underneath.</li>
</ul>
<h3>Fix your own errors</h3>
<pre><code>Sketch pass -> flip canvas horizontally
  (a mirrored image exposes wonky proportions)
-> fix -> block shapes -> clean line art
</code></pre>
<div class="callout"><span class="badge">Software tip</span> Bind a key to <strong>Flip Canvas Horizontal</strong>. Flipping every few minutes is the single fastest way to catch drawing mistakes your eye has gone blind to.</div>`,
    `<span class="eyebrow">DGP201 · Chương 2 · Bài 2.1</span>
<h2>Nét &amp; phác thảo số</h2>
<h3>Điều khiển nét</h3>
<p>Một nét tự tin đến từ <strong>vai và khuỷu tay</strong>, không phải cổ tay. Vẽ bằng những nét dài, dứt khoát. <strong>Độ dày nét (line weight)</strong> — dày hơn ở vùng bóng và nơi các khối giao nhau, mảnh hơn ở vùng sáng — đã tạo cảm giác ba chiều trước cả khi lên màu.</p>
<h3>Từ phác thảo đến nét sạch</h3>
<ul>
<li><strong>Undersketch</strong> — bản phác lỏng, opacity thấp để tìm dáng và mảng lớn. Cứ để nó rối; nó chỉ là bản đồ.</li>
<li><strong>Blocking</strong> — đặt các mảng lớn trước (đầu, thân, tay chân dưới dạng khối đơn giản) trước mọi chi tiết. Mảng lớn sai = chi tiết vô ích.</li>
<li><strong>Line art</strong> — trên layer mới ở trên, đồ lại nét sạch và có chủ đích bằng hard round; giảm opacity bản phác bên dưới.</li>
</ul>
<h3>Tự sửa lỗi</h3>
<pre><code>Phác thảo -> lật canvas theo chiều ngang
  (ảnh lật lộ ra tỉ lệ bị lệch)
-> sửa -> block mảng -> đi line sạch
</code></pre>
<div class="callout"><span class="badge">Mẹo phần mềm</span> Gán phím cho <strong>Flip Canvas Horizontal</strong>. Lật vài phút một lần là cách nhanh nhất để bắt lỗi vẽ mà mắt đã quen nên không còn thấy.</div>`,
  ]]);

const c2q = quiz('dgp201-quiz-2', 'Quiz 2 — Line & sketch|||Quiz 2 — Nét & phác thảo', [
  { id: 'q1', question: 'Nên vẽ thứ tự nào để không phí công?', options: ['Chi tiết trước, mảng lớn sau', 'Mảng lớn (blocking) trước, chi tiết sau', 'Màu trước, nét sau', 'Highlight trước tiên'], correctIndex: 1, explanation: 'Block mảng lớn trước; mảng lớn sai thì chi tiết vô ích.' },
  { id: 'q2', question: 'Line weight (độ dày nét) thường thế nào để gợi khối?', options: ['Dày đều khắp nơi', 'Dày ở vùng bóng, mảnh ở vùng sáng', 'Luôn mảnh nhất có thể', 'Ngẫu nhiên'], correctIndex: 1, explanation: 'Nét dày trong bóng/nơi khối giao nhau, mảnh ở sáng → cảm giác 3D.' },
  { id: 'q3', question: 'Lật canvas theo chiều ngang khi phác thảo để làm gì?', options: ['Xuất file nhanh hơn', 'Lộ ra tỉ lệ bị lệch mà mắt đã quen', 'Đổi hệ màu', 'Tăng độ phân giải'], correctIndex: 1, explanation: 'Ảnh lật cho mắt "mới" thấy lỗi tỉ lệ/đối xứng.' },
]);

const c3 = doc('dgp201-3-1-value', '3.1 — Value & greyscale painting|||3.1 — Giá trị sáng tối',
  'Value (độ sáng tối) quan trọng hơn màu; greyscale painting; đọc ánh sáng thành khối; thang giá trị 3-5 bậc; kiểm bằng chế độ xám.',
  [[
    `<span class="eyebrow">DGP201 · Chapter 3 · Lesson 3.1</span>
<h2>Value &amp; greyscale</h2>
<h3>Value beats color</h3>
<p><strong>Value</strong> is how light or dark a tone is, independent of its color. It carries the <strong>form, light and depth</strong> of an image — a painting reads even in black and white if the values are right, but great color over wrong values still looks flat.</p>
<h3>See in a few values</h3>
<ul>
<li>Squint at your reference until detail drops away and only <strong>3 to 5 values</strong> remain: light, mid, shadow (plus highlight and core shadow).</li>
<li>A rounded form has a <strong>value gradient</strong>: highlight, light, halftone, core shadow, reflected light. That gradient is what makes a sphere look round, not a flat disc.</li>
</ul>
<h3>Paint it in greyscale — step by step</h3>
<pre><code>1. Block the big shapes in mid-grey
2. Add the darkest shadow shape
3. Add the brightest light shape
4. Fill the halftones between them
5. Only now consider color (next chapter)
</code></pre>
<div class="callout"><span class="badge">Software tip</span> Add a temporary <strong>black-and-white / Hue-Saturation</strong> adjustment layer on top. If the painting falls apart in greyscale, your values — not your colors — need work.</div>`,
    `<span class="eyebrow">DGP201 · Chương 3 · Bài 3.1</span>
<h2>Giá trị sáng tối</h2>
<h3>Giá trị quan trọng hơn màu</h3>
<p><strong>Giá trị (value)</strong> là độ sáng hay tối của một tông, không phụ thuộc màu sắc. Nó gánh <strong>khối, ánh sáng và chiều sâu</strong> của bức tranh — tranh vẫn đọc được ở đen trắng nếu giá trị đúng, nhưng màu đẹp trên giá trị sai vẫn trông phẳng.</p>
<h3>Nhìn bằng vài bậc giá trị</h3>
<ul>
<li>Nheo mắt nhìn tham chiếu đến khi chi tiết biến mất, chỉ còn <strong>3 đến 5 bậc</strong>: sáng, trung, tối (thêm highlight và core shadow).</li>
<li>Một khối tròn có <strong>chuyển giá trị</strong>: highlight, sáng, nửa tông (halftone), bóng lõi (core shadow), ánh phản. Chuyển đó khiến quả cầu trông tròn thay vì một đĩa phẳng.</li>
</ul>
<h3>Vẽ greyscale — từng bước</h3>
<pre><code>1. Block mảng lớn bằng xám trung tính
2. Thêm mảng bóng tối nhất
3. Thêm mảng sáng nhất
4. Đổ các nửa tông ở giữa
5. Bây giờ mới nghĩ đến màu (chương sau)
</code></pre>
<div class="callout"><span class="badge">Mẹo phần mềm</span> Thêm layer điều chỉnh <strong>đen trắng / Hue-Saturation</strong> tạm ở trên cùng. Nếu tranh vỡ ở dạng xám thì cần sửa giá trị, không phải màu.</div>`,
  ]]);

const c3q = quiz('dgp201-quiz-3', 'Quiz 3 — Value & greyscale|||Quiz 3 — Giá trị sáng tối', [
  { id: 'q1', question: 'Vì sao value (giá trị) thường được coi quan trọng hơn màu?', options: ['Vì nó dễ vẽ hơn', 'Vì nó gánh khối, ánh sáng và chiều sâu; tranh đọc được cả ở đen trắng', 'Vì màu không cần thiết', 'Vì file nhẹ hơn'], correctIndex: 1, explanation: 'Giá trị đúng → tranh đọc được ngay ở đen trắng; màu đúng trên giá trị sai vẫn phẳng.' },
  { id: 'q2', question: 'Vì sao nên vẽ greyscale với 3-5 bậc giá trị trước?', options: ['Để tiết kiệm màu', 'Để làm chủ khối và ánh sáng trước khi thêm màu', 'Vì Photoshop yêu cầu', 'Để in đen trắng'], correctIndex: 1, explanation: 'Tách bài toán: giải quyết khối/ánh sáng trước, màu sau.' },
  { id: 'q3', question: 'Cách kiểm tra giá trị trong phần mềm là?', options: ['Tăng độ bão hoà', 'Thêm layer điều chỉnh đen trắng để xem tranh ở dạng xám', 'Đổi cỡ brush', 'Lật canvas'], correctIndex: 1, explanation: 'Layer đen trắng tạm cho thấy tranh có đứng vững ở greyscale hay không.' },
]);

const c4 = doc('dgp201-4-1-color-light', '4.1 — Color theory & light|||4.1 — Lý thuyết màu & ánh sáng',
  'Ba thuộc tính màu (hue/saturation/value); màu ánh sáng ấm → bóng lạnh (Gurney); nhiệt độ màu; hài hoà màu; picker số.',
  [[
    `<span class="eyebrow">DGP201 · Chapter 4 · Lesson 4.1</span>
<h2>Color &amp; light</h2>
<h3>The three properties of color</h3>
<ul>
<li><strong>Hue</strong> — the color name (red, blue, green).</li>
<li><strong>Saturation</strong> — how pure/intense vs. grey it is.</li>
<li><strong>Value</strong> — how light or dark (the chapter-3 idea, now inside color).</li>
</ul>
<p>Digital pickers use exactly these axes (HSV / HSB), so you can move each independently.</p>
<h3>Light and shadow have temperature</h3>
<p>A core Gurney principle: <strong>warm light produces cool shadows</strong>, and cool light produces warm shadows. A face in warm sunlight has slightly <em>blue/violet</em> shadows — not just a darker version of the skin. Getting this temperature shift right is what makes digital color look alive.</p>
<pre><code>Warm light (sun)  -> shadows drift COOL (blue/violet)
Cool light (sky)  -> shadows drift WARM
Shadow != skin color made darker
Shadow  = darker + a temperature shift
</code></pre>
<div class="callout"><span class="badge">Software tip</span> To shade, do <strong>not</strong> just lower value on the same hue. Nudge the hue and saturation too — pull shadows toward the opposite temperature. That single habit fixes most muddy digital color.</div>`,
    `<span class="eyebrow">DGP201 · Chương 4 · Bài 4.1</span>
<h2>Màu &amp; ánh sáng</h2>
<h3>Ba thuộc tính của màu</h3>
<ul>
<li><strong>Hue (tông màu)</strong> — tên màu (đỏ, xanh dương, xanh lá).</li>
<li><strong>Saturation (độ bão hoà)</strong> — độ tinh khiết/rực so với xám.</li>
<li><strong>Value (giá trị)</strong> — sáng hay tối (ý ở chương 3, nay nằm trong màu).</li>
</ul>
<p>Picker số dùng đúng các trục này (HSV / HSB), nên bạn chỉnh từng trục độc lập.</p>
<h3>Ánh sáng và bóng có nhiệt độ</h3>
<p>Một nguyên lý cốt lõi của Gurney: <strong>ánh sáng ấm cho bóng lạnh</strong>, và ánh sáng lạnh cho bóng ấm. Khuôn mặt dưới nắng ấm có bóng hơi <em>xanh/tím</em> — không chỉ là phiên bản tối hơn của màu da. Bắt đúng dịch chuyển nhiệt độ này làm màu số trông sống động.</p>
<pre><code>Sáng ấm (nắng)  -> bóng lệch LẠNH (xanh/tím)
Sáng lạnh (trời) -> bóng lệch ẤM
Bóng != màu da tô tối đi
Bóng  = tối hơn + một dịch chuyển nhiệt độ
</code></pre>
<div class="callout"><span class="badge">Mẹo phần mềm</span> Khi tô bóng, <strong>đừng</strong> chỉ hạ value trên cùng một hue. Hãy nhích cả hue và saturation — kéo bóng về phía nhiệt độ đối lập. Chỉ thói quen đó đã sửa hầu hết màu số bị đục.</div>`,
  ]]);

const c4q = quiz('dgp201-quiz-4', 'Quiz 4 — Color & light|||Quiz 4 — Màu & ánh sáng', [
  { id: 'q1', question: 'Ba thuộc tính của màu là?', options: ['Đỏ, xanh lá, xanh dương', 'Hue, saturation, value', 'Sáng, tối, xám', 'Brush, layer, blend'], correctIndex: 1, explanation: 'Hue (tông), saturation (bão hoà), value (giá trị) — chính là trục HSV.' },
  { id: 'q2', question: 'Theo Gurney, ánh sáng ẤM thường cho bóng có nhiệt độ thế nào?', options: ['Ấm hơn nữa', 'Lạnh (xanh/tím)', 'Không đổi', 'Trắng'], correctIndex: 1, explanation: 'Sáng ấm → bóng lệch lạnh; sáng lạnh → bóng lệch ấm.' },
  { id: 'q3', question: 'Cách tô bóng tránh màu bị đục là?', options: ['Chỉ hạ value trên cùng một hue', 'Hạ value và nhích hue/saturation về phía nhiệt độ đối lập', 'Tăng độ phân giải', 'Dùng brush lớn hơn'], correctIndex: 1, explanation: 'Bóng = tối hơn + dịch nhiệt độ; chỉ hạ value làm màu chết/đục.' },
]);

const c5 = doc('dgp201-5-1-brush-texture', '5.1 — Brush technique & texture|||5.1 — Kỹ thuật brush & texture',
  'Custom brush, blending (hard vs soft edge), edge control, texture & chất liệu (kim loại/da/vải), stamp brush; giữ nét sạch.',
  [[
    `<span class="eyebrow">DGP201 · Chapter 5 · Lesson 5.1</span>
<h2>Brushes &amp; texture</h2>
<h3>Edges tell the material</h3>
<p>How you blend an edge describes what a surface is made of. <strong>Hard edges</strong> read as sharp, firm, in-focus (metal, plastic, near objects); <strong>soft edges</strong> read as round, out-of-focus, distant (skin, clouds, background). A painting with <em>only</em> soft edges looks blurry; mix hard and soft deliberately.</p>
<h3>Blending &amp; custom brushes</h3>
<ul>
<li><strong>Blend</strong> by picking an intermediate color with the eyedropper and painting between two tones — cleaner than smudging, which muddies color.</li>
<li><strong>Custom / textured brushes</strong> stamp grain, foliage or fabric weave in one stroke — great for suggesting texture fast without painting every speck.</li>
<li><strong>Materials</strong> — metal has tight highlights and sharp reflections; skin is soft with subsurface warmth; cloth has soft folds and matte falloff.</li>
</ul>
<pre><code>Blend cleanly:
 eyedrop tone A -> eyedrop tone B
 -> pick a value between -> paint the transition
Texture:
 base color -> low-opacity texture brush -> keep it subtle
</code></pre>
<div class="callout"><span class="badge">Software tip</span> Texture should support form, not replace it. Paint the correct values first, then add a light texture pass — never lean on a fancy brush to fake a drawing that is not there.</div>`,
    `<span class="eyebrow">DGP201 · Chương 5 · Bài 5.1</span>
<h2>Brush &amp; texture</h2>
<h3>Cạnh (edge) nói lên chất liệu</h3>
<p>Cách bạn hoà một cạnh mô tả bề mặt được làm bằng gì. <strong>Cạnh cứng</strong> đọc là sắc, chắc, rõ nét (kim loại, nhựa, vật gần); <strong>cạnh mềm</strong> đọc là tròn, nhoè, ở xa (da, mây, hậu cảnh). Tranh <em>chỉ có</em> cạnh mềm trông bị mờ; hãy trộn cạnh cứng và mềm có chủ đích.</p>
<h3>Blending &amp; brush tuỳ chỉnh</h3>
<ul>
<li><strong>Hoà màu</strong> bằng cách hút một màu trung gian bằng eyedropper rồi tô giữa hai tông — sạch hơn smudge, thứ làm màu bị đục.</li>
<li><strong>Brush tuỳ chỉnh / có texture</strong> dập hạt, tán lá hay sợi vải chỉ trong một nét — hợp để gợi texture nhanh mà không phải vẽ từng chấm.</li>
<li><strong>Chất liệu</strong> — kim loại có highlight nhỏ gọn và phản chiếu sắc; da mềm và ấm dưới bề mặt; vải có nếp mềm và tắt sáng mờ.</li>
</ul>
<pre><code>Hoà màu sạch:
 hút tông A -> hút tông B
 -> chọn value ở giữa -> tô vùng chuyển
Texture:
 màu nền -> brush texture opacity thấp -> giữ tinh tế
</code></pre>
<div class="callout"><span class="badge">Mẹo phần mềm</span> Texture để hỗ trợ khối, không thay thế khối. Vẽ đúng giá trị trước, rồi thêm một lượt texture nhẹ — đừng dựa vào brush cầu kỳ để giả một bản vẽ không có ở đó.</div>`,
  ]]);

const c5q = quiz('dgp201-quiz-5', 'Quiz 5 — Brush & texture|||Quiz 5 — Brush & texture', [
  { id: 'q1', question: 'Cạnh CỨNG (hard edge) thường gợi bề mặt thế nào?', options: ['Nhoè, ở xa, mềm', 'Sắc, chắc, rõ nét (kim loại/nhựa/vật gần)', 'Trong suốt', 'Luôn là hậu cảnh'], correctIndex: 1, explanation: 'Cạnh cứng = sắc/rõ; cạnh mềm = tròn/nhoè/ở xa.' },
  { id: 'q2', question: 'Cách blending sạch, ít làm đục màu là?', options: ['Dùng smudge thật mạnh', 'Hút màu trung gian bằng eyedropper rồi tô vùng chuyển', 'Tăng saturation tối đa', 'Xoá rồi vẽ lại'], correctIndex: 1, explanation: 'Chọn value/màu ở giữa và tô chuyển sạch hơn smudge.' },
  { id: 'q3', question: 'Quan hệ đúng giữa texture và khối (form) là?', options: ['Texture thay thế cho việc vẽ khối', 'Vẽ đúng giá trị/khối trước, texture chỉ thêm nhẹ để hỗ trợ', 'Chỉ cần brush đẹp là đủ', 'Texture càng nhiều càng tốt'], correctIndex: 1, explanation: 'Texture hỗ trợ khối; không dùng brush để giả một bản vẽ không có.' },
]);

const c6 = doc('dgp201-6-1-rendering', '6.1 — Rendering & finishing|||6.1 — Rendering & hoàn thiện',
  'Rendering khối mượt, tăng chi tiết có chọn lọc, highlight & specular, độ sâu (khí quyển/tiêu điểm), pass cuối; tránh over-render.',
  [[
    `<span class="eyebrow">DGP201 · Chapter 6 · Lesson 6.1</span>
<h2>Rendering &amp; finishing</h2>
<h3>Render the form, not the pixels</h3>
<p><strong>Rendering</strong> is refining rough blocks into smooth, believable form — following the value gradient of each surface. Work from <strong>large to small</strong>: get the big planes right, then step down to medium shapes, and only add tiny details last, where the eye should land.</p>
<h3>Detail, highlights &amp; depth</h3>
<ul>
<li><strong>Selective detail</strong> — sharpen the focal point; leave edges and background looser. Even detail everywhere kills the focus.</li>
<li><strong>Highlights &amp; specular</strong> — the brightest hits go on last, small and precise, on a Screen/Add layer. A single crisp highlight sells wet eyes, metal or glass.</li>
<li><strong>Depth</strong> — push background back with lower contrast and cooler, less saturated color (atmospheric perspective); keep the strongest contrast up front.</li>
</ul>
<pre><code>Big planes -> medium shapes -> small details
Focal point: highest contrast + sharpest edges + brightest highlight
Background: lower contrast, cooler, softer
</code></pre>
<div class="callout"><span class="badge">Software tip</span> Do a final adjustment pass: a soft Curves/Levels tweak, a subtle color-balance shift, and one focused highlight. Then <strong>stop</strong> — over-rendering makes work stiff and lifeless.</div>`,
    `<span class="eyebrow">DGP201 · Chương 6 · Bài 6.1</span>
<h2>Rendering &amp; hoàn thiện</h2>
<h3>Render khối, không render pixel</h3>
<p><strong>Rendering</strong> là tinh chỉnh các mảng thô thành khối mượt, thuyết phục — bám theo chuyển giá trị của từng bề mặt. Làm từ <strong>lớn tới nhỏ</strong>: chỉnh đúng các mặt lớn trước, rồi hạ xuống mảng vừa, và chỉ thêm chi tiết nhỏ sau cùng, ở nơi mắt cần dừng lại.</p>
<h3>Chi tiết, highlight &amp; chiều sâu</h3>
<ul>
<li><strong>Chi tiết chọn lọc</strong> — làm sắc tiêu điểm; để cạnh và hậu cảnh lỏng hơn. Chi tiết đều khắp nơi giết mất tiêu điểm.</li>
<li><strong>Highlight &amp; specular</strong> — điểm sáng nhất đặt sau cùng, nhỏ và chính xác, trên layer Screen/Add. Một highlight sắc gọn làm nên mắt ướt, kim loại hay thuỷ tinh.</li>
<li><strong>Chiều sâu</strong> — đẩy hậu cảnh ra xa bằng tương phản thấp hơn, màu lạnh và ít bão hoà hơn (phối cảnh khí quyển); giữ tương phản mạnh nhất ở tiền cảnh.</li>
</ul>
<pre><code>Mặt lớn -> mảng vừa -> chi tiết nhỏ
Tiêu điểm: tương phản cao nhất + cạnh sắc nhất + highlight sáng nhất
Hậu cảnh: tương phản thấp, lạnh hơn, mềm hơn
</code></pre>
<div class="callout"><span class="badge">Mẹo phần mềm</span> Làm một lượt chỉnh cuối: chỉnh nhẹ Curves/Levels, dịch color-balance tinh tế, và một highlight tập trung. Rồi <strong>dừng lại</strong> — over-render làm tranh cứng và mất sức sống.</div>`,
  ]]);

const c6q = quiz('dgp201-quiz-6', 'Quiz 6 — Rendering & finishing|||Quiz 6 — Rendering & hoàn thiện', [
  { id: 'q1', question: 'Thứ tự rendering đúng là?', options: ['Chi tiết nhỏ trước, mặt lớn sau', 'Mặt lớn -> mảng vừa -> chi tiết nhỏ', 'Highlight trước tiên', 'Hậu cảnh sắc nhất'], correctIndex: 1, explanation: 'Làm từ lớn tới nhỏ; chi tiết nhỏ đặt sau cùng ở tiêu điểm.' },
  { id: 'q2', question: 'Để tạo chiều sâu (phối cảnh khí quyển), hậu cảnh nên?', options: ['Tương phản cao, màu rực', 'Tương phản thấp, màu lạnh và ít bão hoà hơn', 'Sắc nét hơn tiền cảnh', 'Nhiều chi tiết hơn'], correctIndex: 1, explanation: 'Hậu cảnh lùi ra xa: tương phản thấp, lạnh, ít bão hoà.' },
  { id: 'q3', question: 'Vì sao KHÔNG nên vẽ chi tiết đều khắp nơi?', options: ['Tốn dung lượng', 'Nó giết mất tiêu điểm; nên làm sắc điểm nhấn, để chỗ khác lỏng hơn', 'Photoshop không cho', 'Làm file chậm'], correctIndex: 1, explanation: 'Chi tiết chọn lọc dẫn mắt; chi tiết đều khắp làm mất tiêu điểm.' },
]);

const c7 = doc('dgp201-7-1-subject-studies', '7.1 — Subject studies: character, scene, object|||7.1 — Vẽ theo chủ đề: nhân vật, cảnh, đồ vật',
  'Dùng tham chiếu (reference) đúng cách; thumbnail bố cục; vẽ nhân vật (dáng/tỉ lệ), cảnh (không gian/ánh sáng), đồ vật (chất liệu).',
  [[
    `<span class="eyebrow">DGP201 · Chapter 7 · Lesson 7.1</span>
<h2>Subject studies</h2>
<h3>Reference &amp; thumbnails</h3>
<ul>
<li><strong>Reference</strong> — study real photos for proportion, light and material. Use reference to <em>learn</em>, not to trace blindly; understand why it looks that way.</li>
<li><strong>Thumbnails</strong> — before a big piece, draw several tiny (a few cm) value sketches to test composition and lighting fast. Pick the strongest, then scale up.</li>
</ul>
<h3>Three common subjects</h3>
<ul>
<li><strong>Character</strong> — gesture and proportion first (line of action), then costume and face. A strong pose beats a detailed but stiff figure.</li>
<li><strong>Scene / environment</strong> — establish space with perspective and one clear light source; use atmospheric depth to separate foreground, midground, background.</li>
<li><strong>Object / prop</strong> — nail the material: its value range, edge hardness and highlight shape (a chrome sphere vs. a clay pot look completely different).</li>
</ul>
<pre><code>Study loop: pick reference -> thumbnail 3-5 options
 -> block chosen one -> value -> color -> render
</code></pre>
<div class="callout"><span class="badge">Software tip</span> Keep reference on a second monitor or a side panel — never paint on top of the photo. Copying the photo teaches nothing you can reuse.</div>`,
    `<span class="eyebrow">DGP201 · Chương 7 · Bài 7.1</span>
<h2>Vẽ theo chủ đề</h2>
<h3>Tham chiếu &amp; thumbnail</h3>
<ul>
<li><strong>Reference (tham chiếu)</strong> — nghiên cứu ảnh thật để lấy tỉ lệ, ánh sáng và chất liệu. Dùng tham chiếu để <em>học</em>, không đồ mù; hiểu vì sao nó trông như vậy.</li>
<li><strong>Thumbnail</strong> — trước một bức lớn, vẽ vài phác giá trị rất nhỏ (vài cm) để thử bố cục và ánh sáng nhanh. Chọn cái mạnh nhất rồi phóng lớn.</li>
</ul>
<h3>Ba chủ đề thường gặp</h3>
<ul>
<li><strong>Nhân vật</strong> — dáng và tỉ lệ trước (line of action), rồi trang phục và khuôn mặt. Một dáng mạnh hơn một hình chi tiết nhưng cứng.</li>
<li><strong>Cảnh / môi trường</strong> — dựng không gian bằng phối cảnh và một nguồn sáng rõ; dùng chiều sâu khí quyển tách tiền/trung/hậu cảnh.</li>
<li><strong>Đồ vật / prop</strong> — bắt trúng chất liệu: dải giá trị, độ cứng cạnh và hình dạng highlight (quả cầu chrome khác hẳn một chiếc bình gốm).</li>
</ul>
<pre><code>Vòng study: chọn tham chiếu -> thumbnail 3-5 phương án
 -> block cái đã chọn -> giá trị -> màu -> render
</code></pre>
<div class="callout"><span class="badge">Mẹo phần mềm</span> Để tham chiếu ở màn hình thứ hai hoặc panel bên — đừng vẽ đè lên ảnh. Chép ảnh không dạy được gì có thể tái sử dụng.</div>`,
  ]]);

const c7q = quiz('dgp201-quiz-7', 'Quiz 7 — Subject studies|||Quiz 7 — Vẽ theo chủ đề', [
  { id: 'q1', question: 'Cách dùng reference (tham chiếu) đúng đắn là?', options: ['Đồ (trace) mù theo ảnh', 'Nghiên cứu để hiểu tỉ lệ/ánh sáng/chất liệu và học, không đồ mù', 'Không bao giờ dùng ảnh', 'Chỉ dùng cho nhân vật'], correctIndex: 1, explanation: 'Reference để học và hiểu; chép mù không tạo kỹ năng tái sử dụng được.' },
  { id: 'q2', question: 'Thumbnail (phác nhỏ) dùng để làm gì trước một bức lớn?', options: ['Xuất file', 'Thử nhanh bố cục và ánh sáng để chọn phương án mạnh nhất', 'Tăng độ phân giải', 'Chọn brush'], correctIndex: 1, explanation: 'Vài thumbnail giá trị nhỏ giúp thử bố cục/ánh sáng rẻ và nhanh.' },
  { id: 'q3', question: 'Khi vẽ nhân vật, nên ưu tiên điều gì trước?', options: ['Chi tiết khuôn mặt', 'Dáng và tỉ lệ (line of action)', 'Màu trang phục', 'Highlight mắt'], correctIndex: 1, explanation: 'Dáng/tỉ lệ trước; dáng mạnh hơn hình chi tiết nhưng cứng.' },
]);

const c8 = doc('dgp201-8-1-workflow', '8.1 — Workflow & portfolio|||8.1 — Quy trình & workflow',
  'Quy trình đầy đủ: ý tưởng → thumbnail → line → block màu → render → chỉnh cuối → xuất file; đặt tên layer; xuất đúng định dạng; dựng portfolio.',
  [[
    `<span class="eyebrow">DGP201 · Chapter 8 · Lesson 8.1</span>
<h2>Workflow &amp; portfolio</h2>
<h3>The full pipeline</h3>
<p>Every finished piece follows the same order — each stage locks in decisions so the next one is easier:</p>
<pre><code>Idea / brief
 -> Thumbnails (composition &amp; value)
 -> Line / sketch (drawing locked)
 -> Block color &amp; values
 -> Render (large to small)
 -> Final pass (curves, color balance, highlights)
 -> Export
</code></pre>
<h3>Files, export &amp; portfolio</h3>
<ul>
<li><strong>Layer hygiene</strong> — name and group layers (sketch / color / render / effects). A tidy file is easy to fix and to hand off.</li>
<li><strong>Export</strong> — keep the layered master (.PSD / .procreate); export a flattened <strong>PNG</strong> for lossless quality or a high-quality <strong>JPG</strong> for the web. Size for the destination.</li>
<li><strong>Portfolio</strong> — show 8 to 12 of your <em>best</em> pieces, not everything. Curate for the work you want to be hired for; a few strong images beat many average ones.</li>
</ul>
<div class="callout"><span class="badge">Software tip</span> Save iterations (v01, v02...) and flatten a copy for export — never flatten your only file. Keeping the layered master lets you fix anything later.</div>`,
    `<span class="eyebrow">DGP201 · Chương 8 · Bài 8.1</span>
<h2>Quy trình &amp; portfolio</h2>
<h3>Pipeline đầy đủ</h3>
<p>Mọi bức hoàn thiện đi theo cùng một thứ tự — mỗi bước chốt quyết định để bước sau dễ hơn:</p>
<pre><code>Ý tưởng / đề bài
 -> Thumbnail (bố cục &amp; giá trị)
 -> Line / phác thảo (chốt bản vẽ)
 -> Block màu &amp; giá trị
 -> Render (lớn tới nhỏ)
 -> Chỉnh cuối (curves, color balance, highlight)
 -> Xuất file
</code></pre>
<h3>File, xuất &amp; portfolio</h3>
<ul>
<li><strong>Vệ sinh layer</strong> — đặt tên và gom nhóm layer (sketch / màu / render / hiệu ứng). File gọn thì dễ sửa và dễ bàn giao.</li>
<li><strong>Xuất file</strong> — giữ bản gốc có layer (.PSD / .procreate); xuất bản ép phẳng <strong>PNG</strong> cho chất lượng không mất mát hoặc <strong>JPG</strong> chất lượng cao cho web. Chọn kích thước theo nơi dùng.</li>
<li><strong>Portfolio</strong> — trưng 8 đến 12 tác phẩm <em>tốt nhất</em>, không phải tất cả. Chọn lọc theo loại việc bạn muốn được thuê; vài hình mạnh hơn nhiều hình trung bình.</li>
</ul>
<div class="callout"><span class="badge">Mẹo phần mềm</span> Lưu nhiều phiên bản (v01, v02...) và ép phẳng một bản sao để xuất — đừng ép phẳng file duy nhất. Giữ bản gốc có layer cho phép sửa bất cứ thứ gì về sau.</div>`,
  ]]);

const c8q = quiz('dgp201-quiz-8', 'Quiz 8 — Workflow & portfolio|||Quiz 8 — Quy trình & portfolio', [
  { id: 'q1', question: 'Thứ tự quy trình vẽ số đầy đủ là?', options: ['Render -> line -> ý tưởng -> xuất', 'Ý tưởng -> thumbnail -> line -> block màu -> render -> chỉnh cuối -> xuất', 'Màu -> ý tưởng -> thumbnail', 'Xuất -> render -> line'], correctIndex: 1, explanation: 'Mỗi bước chốt quyết định để bước sau dễ hơn.' },
  { id: 'q2', question: 'Nên xuất định dạng nào để giữ chất lượng KHÔNG mất mát?', options: ['JPG chất lượng thấp', 'PNG (ép phẳng, lossless)', 'GIF', 'BMP nén'], correctIndex: 1, explanation: 'PNG không mất mát; JPG có nén mất mát (hợp cho web).' },
  { id: 'q3', question: 'Một portfolio tốt nên?', options: ['Trưng tất cả tác phẩm từng vẽ', 'Chọn lọc 8-12 tác phẩm tốt nhất theo loại việc muốn được thuê', 'Chỉ để bản phác', 'Càng nhiều hình càng tốt'], correctIndex: 1, explanation: 'Vài hình mạnh, chọn lọc đúng hướng > nhiều hình trung bình.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'DGP201',
    slug: 'dgp201-digital-painting',
    title: 'Digital painting',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DGP201.webp',
    shortDescription: 'Digital painting from zero — Photoshop & Procreate, Wacom tablets, line & sketch, value & greyscale, color & light (James Gurney), brushes & texture, rendering, subject studies & a full idea-to-export workflow. Bilingual, with quizzes.|||Vẽ kỹ thuật số từ đầu — Photoshop & Procreate, bảng vẽ Wacom, nét & phác thảo, sáng tối, màu & ánh sáng (Gurney), brush & texture, rendering, vẽ theo chủ đề & quy trình từ ý tưởng đến xuất file. Song ngữ, có quiz.',
    description: 'Môn <strong>DGP201 — Digital Painting (Vẽ kỹ thuật số)</strong> thuộc ngành Thiết kế mỹ thuật số, kỳ 3. Bắt đầu từ <strong>công cụ</strong> (Photoshop/Procreate, bảng vẽ Wacom, brush &amp; layer) → <strong>nét &amp; phác thảo</strong> → <strong>giá trị sáng tối</strong> (greyscale) → <strong>lý thuyết màu &amp; ánh sáng</strong> (James Gurney) → <strong>brush &amp; texture</strong> → <strong>rendering &amp; hoàn thiện</strong> → <strong>vẽ theo chủ đề</strong> → <strong>quy trình đầy đủ &amp; portfolio</strong>. Song ngữ, kỹ thuật từng bước, mẹo phần mềm, quiz mỗi chương. Nguồn chuẩn: Gurney, Ctrl+Paint, ArtStation Learning.',
    whatYouLearn: 'Cài đặt phần mềm &amp; bảng vẽ, layer &amp; blend mode; điều khiển nét, undersketch &amp; blocking; giá trị (value) &amp; greyscale painting; ba thuộc tính màu (hue/saturation/value) và nguyên lý màu-ánh sáng của Gurney; blending, edge control, brush &amp; texture, chất liệu; rendering khối, highlight &amp; chiều sâu; dùng reference &amp; thumbnail; vẽ nhân vật/cảnh/đồ vật; quy trình từ ý tưởng đến xuất file và dựng portfolio.',
    requirements: 'Nền vẽ tay cơ bản là một lợi thế nhưng không bắt buộc. Cần Photoshop/Procreate/Krita và một bảng vẽ (Wacom) hoặc iPad + Apple Pencil. Xem điều kiện tiên quyết trong khung ngành Thiết kế mỹ thuật số trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách Gurney, Ctrl+Paint, ArtStation, YouTube, phần mềm, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vẽ số là gì, vì sao học fundamentals, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Nhập môn vẽ số|||Chapter 1 — Getting started', description: 'Phần mềm, bảng vẽ, brush, layer.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nét & phác thảo|||Chapter 2 — Line & sketch', description: 'Line art, undersketch, blocking.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Giá trị sáng tối|||Chapter 3 — Value & greyscale', description: 'Value, greyscale, khối, ánh sáng.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Màu & ánh sáng|||Chapter 4 — Color & light', description: 'Hue/saturation/value, ánh sáng-bóng, Gurney.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Brush & texture|||Chapter 5 — Brush & texture', description: 'Custom brush, blending, edge, chất liệu.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Rendering & hoàn thiện|||Chapter 6 — Rendering & finishing', description: 'Render khối, chi tiết, highlight, chiều sâu.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Vẽ theo chủ đề|||Chapter 7 — Subject studies', description: 'Nhân vật/cảnh/đồ vật, reference, thumbnail.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Quy trình & workflow|||Chapter 8 — Workflow', description: 'Ý tưởng→thumbnail→line→màu→render→xuất; portfolio.', lessons: [c8, c8q] },
  ],
};
