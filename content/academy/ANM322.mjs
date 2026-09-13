/**
 * ANM322 — 3D Modeling & Shading (Dựng hình & Đổ bóng 3D). Ngành Thiết kế mỹ
 * thuật số FPTU, kỳ 5. Khung 8 chương theo giáo trình chuẩn quốc tế (Blender +
 * Autodesk Maya): nhập môn 3D → polygon modeling → topology sạch → modeling
 * nâng cао → UV unwrapping → vật liệu & shading (PBR) → texturing & baking →
 * ánh sáng & render. Song ngữ VI+EN, có thao tác phần mềm từng bước & mẹo.
 * Nguồn: W. Vaughan "Digital Modeling"; Blender docs/Blender Guru; Autodesk
 * Maya Learning; The Gnomon Workshop.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick lồng/${; & → &amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('anm322-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách, tài liệu chính thức Blender/Maya, YouTube, công cụ, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">ANM322 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything you need to learn <strong>3D modeling &amp; shading</strong> — modeling, topology, UVs, PBR materials, texturing, lighting and rendering — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; the rest are free, legal resources for Blender and Maya.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ANM322 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Digital Modeling</em> — William Vaughan (the standard text on production-quality modeling &amp; topology).</li>
<li><em>The Pushing Points Topology Workbook</em> — William Vaughan (subdivision topology drills).</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://docs.blender.org/manual/en/latest/" target="_blank" rel="noopener">Blender Manual — official documentation</a></li>
<li><a href="https://help.autodesk.com/view/MAYAUL/ENU/" target="_blank" rel="noopener">Autodesk Maya Learning &amp; docs</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@blenderguru" target="_blank" rel="noopener">Blender Guru</a> — the famous Donut beginner series.</li>
<li><a href="https://www.youtube.com/@GnomonSchool" target="_blank" rel="noopener">The Gnomon Workshop / Gnomon</a> — pro modeling &amp; shading walkthroughs.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.blender.org/download/" target="_blank" rel="noopener">Blender</a> — free, open-source 3D suite (modeling, sculpting, UV, shading, render).</li>
<li><a href="https://www.autodesk.com/products/maya/" target="_blank" rel="noopener">Autodesk Maya</a> — industry-standard (free student licence).</li>
<li><a href="https://www.adobe.com/products/substance3d-painter.html" target="_blank" rel="noopener">Adobe Substance 3D Painter</a> — PBR texture painting &amp; baking.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Model</strong> — learn 3D space &amp; the viewport, then box-model with polygons (extrude, bevel, loop cut).</li>
<li><strong>Clean it</strong> — build good edge flow, all-quad topology, and retopologise dense sculpts.</li>
<li><strong>Unwrap &amp; shade</strong> — cut seams, unwrap UVs, then assign PBR materials (base color, roughness, metallic, normal).</li>
<li><strong>Texture &amp; light</strong> — paint/bake textures, set up 3-point lighting + HDRI, and render in Cycles or Arnold.</li>
</ol></div>`,
    `<span class="eyebrow">ANM322 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>dựng hình &amp; đổ bóng 3D</strong> — modeling, topology, UV, vật liệu PBR, texturing, ánh sáng và render — gom về một chỗ. Slide &amp; giáo trình chính thức của FPTU nằm trên <strong>FLM</strong>; phần còn lại là nguồn miễn phí, hợp pháp cho Blender và Maya.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ANM322 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Digital Modeling</em> — William Vaughan (sách chuẩn về modeling &amp; topology chất lượng sản xuất).</li>
<li><em>The Pushing Points Topology Workbook</em> — William Vaughan (bài luyện topology cho subdivision).</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://docs.blender.org/manual/en/latest/" target="_blank" rel="noopener">Blender Manual — tài liệu chính thức</a></li>
<li><a href="https://help.autodesk.com/view/MAYAUL/ENU/" target="_blank" rel="noopener">Autodesk Maya Learning &amp; tài liệu</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@blenderguru" target="_blank" rel="noopener">Blender Guru</a> — bộ Donut nhập môn nổi tiếng.</li>
<li><a href="https://www.youtube.com/@GnomonSchool" target="_blank" rel="noopener">The Gnomon Workshop / Gnomon</a> — hướng dẫn modeling &amp; shading chuyên nghiệp.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.blender.org/download/" target="_blank" rel="noopener">Blender</a> — bộ 3D mã nguồn mở, miễn phí (modeling, sculpting, UV, shading, render).</li>
<li><a href="https://www.autodesk.com/products/maya/" target="_blank" rel="noopener">Autodesk Maya</a> — chuẩn công nghiệp (bản sinh viên miễn phí).</li>
<li><a href="https://www.adobe.com/products/substance3d-painter.html" target="_blank" rel="noopener">Adobe Substance 3D Painter</a> — vẽ texture PBR &amp; baking.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Dựng hình</strong> — nắm không gian 3D &amp; viewport, rồi box-model bằng polygon (extrude, bevel, loop cut).</li>
<li><strong>Làm sạch</strong> — dựng edge flow tốt, mặt lưới toàn quad, và retopology cho bản sculpt dày.</li>
<li><strong>Unwrap &amp; shading</strong> — cắt seam, trải UV, rồi gán vật liệu PBR (base color, roughness, metallic, normal).</li>
<li><strong>Texture &amp; ánh sáng</strong> — vẽ/bake texture, dựng đèn 3 điểm + HDRI, và render bằng Cycles hoặc Arnold.</li>
</ol></div>`,
  ]]);

const intro = doc('anm322-0-1-overview', 'Course overview: 3D Modeling & Shading|||Tổng quan: Dựng hình & Đổ bóng 3D',
  'Pipeline 3D làm gì; bốn giai đoạn lớn (Model → UV → Shade/Texture → Light/Render); phần mềm Blender & Maya; lộ trình môn học.',
  [[
    `<span class="eyebrow">ANM322 · Lesson 0.1 · Overview</span>
<h2>3D Modeling &amp; Shading</h2>
<p class="lead">This course teaches you to build a <strong>3D asset from scratch</strong> and make it look real — the craft behind game characters, film props, product renders and animation. You will <strong>model</strong> shapes, keep the mesh <strong>clean</strong>, <strong>unwrap UVs</strong>, assign <strong>PBR materials</strong>, <strong>texture</strong> the surface, then <strong>light</strong> and <strong>render</strong> it, working in <strong>Blender</strong> and <strong>Autodesk Maya</strong>.</p>
<h3>The 3D asset pipeline</h3>
<pre><code>Model  -> build the geometry (polygons)
Topology -> clean edge flow, all quads
UV     -> unwrap the surface to a flat map
Shade  -> PBR material (color, roughness, metal, normal)
Texture-> paint / bake image maps
Light  -> 3-point lighting + HDRI + camera
Render -> final image (Cycles / Arnold)
</code></pre>
<h3>Roadmap</h3>
<p>3D space &amp; software → polygon modeling → clean topology → advanced modeling (subdivision, boolean, sculpting) → UV unwrapping → materials &amp; shading → texturing &amp; baking → lighting &amp; render. Bilingual, with step-by-step software instructions and a quiz per chapter.</p>
<div class="callout"><span class="badge">Modeling vs shading</span> <strong>Modeling</strong> defines the <em>shape</em> (the geometry); <strong>shading</strong> defines the <em>surface</em> (how light interacts — color, glossiness, metalness). A great render needs both.</div>`,
    `<span class="eyebrow">ANM322 · Bài 0.1 · Tổng quan</span>
<h2>Dựng hình &amp; Đổ bóng 3D</h2>
<p class="lead">Môn này dạy bạn dựng một <strong>vật thể 3D từ con số không</strong> và làm nó trông thật — nghề đứng sau nhân vật game, đạo cụ phim, ảnh render sản phẩm và hoạt hình. Bạn sẽ <strong>dựng hình (model)</strong>, giữ mặt lưới <strong>sạch</strong>, <strong>trải UV</strong>, gán <strong>vật liệu PBR</strong>, <strong>texture</strong> bề mặt, rồi <strong>đánh sáng</strong> và <strong>render</strong>, làm việc trên <strong>Blender</strong> và <strong>Autodesk Maya</strong>.</p>
<h3>Quy trình (pipeline) vật thể 3D</h3>
<pre><code>Model   -> dựng hình học (polygon)
Topology-> edge flow sạch, toàn quad
UV      -> trải bề mặt ra bản đồ phẳng
Shade   -> vật liệu PBR (màu, nhám, kim loại, normal)
Texture -> vẽ / bake bản đồ ảnh
Light   -> đèn 3 điểm + HDRI + camera
Render  -> ảnh cuối (Cycles / Arnold)
</code></pre>
<h3>Lộ trình</h3>
<p>Không gian 3D &amp; phần mềm → polygon modeling → topology sạch → modeling nâng cao (subdivision, boolean, sculpting) → UV unwrapping → vật liệu &amp; shading → texturing &amp; baking → ánh sáng &amp; render. Song ngữ, có thao tác phần mềm từng bước và quiz mỗi chương.</p>
<div class="callout"><span class="badge">Modeling vs shading</span> <strong>Modeling</strong> định hình <em>dáng</em> (hình học); <strong>shading</strong> định <em>bề mặt</em> (cách ánh sáng tương tác — màu, độ bóng, độ kim loại). Một bản render đẹp cần cả hai.</div>`,
  ]]);

const c1 = doc('anm322-1-1-intro-3d', '1.1 — Getting started in 3D|||1.1 — Nhập môn 3D',
  '3D space, phần mềm Blender/Maya, viewport & điều hướng, trục XYZ, các khối primitive.',
  [[
    `<span class="eyebrow">ANM322 · Chapter 1 · Lesson 1.1</span>
<h2>Getting started in 3D</h2>
<h3>3D space &amp; axes</h3>
<p>A 3D scene lives in three axes: <strong>X</strong> (left-right), <strong>Y</strong> and <strong>Z</strong> (up/depth — Blender uses Z-up, Maya uses Y-up). Every point (vertex) has an X/Y/Z coordinate; the <strong>origin</strong> is (0,0,0). The <strong>viewport</strong> is your window into the scene, seen through a <strong>camera</strong>.</p>
<h3>Primitives — your starting shapes</h3>
<p>You rarely start from nothing. You start from a <strong>primitive</strong> — cube, sphere, cylinder, plane, cone — and reshape it. This is "box modeling".</p>
<h3>Do it in Blender — step by step</h3>
<ol>
<li>Open Blender; delete the default cube with <code>X</code>.</li>
<li><code>Shift + A</code> → Mesh → <strong>Cube</strong> to add a primitive.</li>
<li>Orbit with <strong>middle mouse</strong>, pan with <code>Shift + MMB</code>, zoom with the scroll wheel.</li>
<li>Move / rotate / scale with <code>G</code> / <code>R</code> / <code>S</code> — press <code>X</code>, <code>Y</code> or <code>Z</code> after to lock to one axis.</li>
</ol>
<div class="callout"><span class="badge">Tip</span> Tap <code>Numpad 1/3/7</code> for front/side/top views, and <code>Numpad 5</code> to toggle orthographic — essential for precise modeling. In Maya the equivalents are the space-bar view panels.</div>`,
    `<span class="eyebrow">ANM322 · Chương 1 · Bài 1.1</span>
<h2>Nhập môn 3D</h2>
<h3>Không gian 3D &amp; các trục</h3>
<p>Một cảnh 3D nằm trong ba trục: <strong>X</strong> (trái-phải), <strong>Y</strong> và <strong>Z</strong> (lên/sâu — Blender lấy Z hướng lên, Maya lấy Y hướng lên). Mỗi điểm (vertex) có toạ độ X/Y/Z; <strong>gốc toạ độ</strong> là (0,0,0). <strong>Viewport</strong> là cửa sổ nhìn vào cảnh, qua một <strong>camera</strong>.</p>
<h3>Primitive — những khối khởi đầu</h3>
<p>Hiếm khi dựng từ số không. Bạn bắt đầu từ một <strong>primitive</strong> — khối lập phương, cầu, trụ, mặt phẳng, nón — rồi nắn lại. Đây gọi là "box modeling".</p>
<h3>Làm trong Blender — từng bước</h3>
<ol>
<li>Mở Blender; xoá khối cube mặc định bằng <code>X</code>.</li>
<li><code>Shift + A</code> → Mesh → <strong>Cube</strong> để thêm một primitive.</li>
<li>Xoay quanh bằng <strong>chuột giữa</strong>, dịch cảnh <code>Shift + MMB</code>, phóng to bằng con lăn.</li>
<li>Di chuyển / xoay / co giãn bằng <code>G</code> / <code>R</code> / <code>S</code> — bấm <code>X</code>, <code>Y</code> hoặc <code>Z</code> ngay sau để khoá theo một trục.</li>
</ol>
<div class="callout"><span class="badge">Mẹo</span> Bấm <code>Numpad 1/3/7</code> để nhìn trước/bên/trên, và <code>Numpad 5</code> để bật orthographic — rất cần cho modeling chính xác. Trong Maya, tương đương là các panel view mở bằng phím cách.</div>`,
  ]]);

const c1q = quiz('anm322-quiz-1', 'Quiz 1 — Getting started in 3D|||Quiz 1 — Nhập môn 3D', [
  { id: 'q1', question: 'Điểm cơ bản nhất tạo nên hình học 3D, có toạ độ X/Y/Z, gọi là?', options: ['Face', 'Vertex (đỉnh)', 'Pixel', 'Texel'], correctIndex: 1, explanation: 'Vertex là một điểm trong không gian 3D với toạ độ X/Y/Z.' },
  { id: 'q2', question: 'Kỹ thuật bắt đầu từ một khối primitive rồi nắn dần thành vật thể gọi là?', options: ['Box modeling', 'Ray tracing', 'Rigging', 'Compositing'], correctIndex: 0, explanation: 'Box modeling: khởi từ primitive (cube...) rồi chỉnh sửa dần.' },
  { id: 'q3', question: 'Trong Blender, phím tắt di chuyển (grab/move) một đối tượng là?', options: ['R', 'S', 'G', 'E'], correctIndex: 2, explanation: 'G = grab/move; R = rotate; S = scale; E = extrude.' },
]);

const c2 = doc('anm322-2-1-polygon-modeling', '2.1 — Polygon modeling|||2.1 — Dựng hình bằng polygon',
  'Vertex/edge/face, thao tác extrude, bevel, loop cut; giới thiệu topology (dòng chảy mặt lưới).',
  [[
    `<span class="eyebrow">ANM322 · Chapter 2 · Lesson 2.1</span>
<h2>Polygon modeling</h2>
<h3>The three components</h3>
<ul>
<li><strong>Vertex</strong> — a point.</li>
<li><strong>Edge</strong> — a line joining two vertices.</li>
<li><strong>Face (polygon)</strong> — a flat surface bounded by edges (usually 4-sided, a <em>quad</em>).</li>
</ul>
<h3>Core operations</h3>
<ul>
<li><strong>Extrude</strong> — push a face/edge out to create new geometry (the workhorse of modeling).</li>
<li><strong>Bevel</strong> — round or chamfer a sharp edge into one or more segments so it catches light.</li>
<li><strong>Loop cut</strong> — insert an edge loop around the mesh to add resolution where you need to bend or add detail.</li>
</ul>
<h3>Do it in Blender — step by step</h3>
<ol>
<li>Select an object, press <code>Tab</code> to enter <strong>Edit Mode</strong>.</li>
<li>Switch between vertex / edge / face select with <code>1</code> / <code>2</code> / <code>3</code>.</li>
<li>Select a face, press <code>E</code> to <strong>extrude</strong>, move, click to confirm.</li>
<li>Select an edge, press <code>Ctrl + B</code> to <strong>bevel</strong> (scroll to add segments).</li>
<li>Press <code>Ctrl + R</code> for a <strong>loop cut</strong>, hover to place, click, then slide.</li>
</ol>
<div class="callout"><span class="badge">Tip</span> Model at low resolution first — get the big shapes right before adding loop cuts and bevels. Detail added too early is hard to move later.</div>`,
    `<span class="eyebrow">ANM322 · Chương 2 · Bài 2.1</span>
<h2>Dựng hình bằng polygon</h2>
<h3>Ba thành phần</h3>
<ul>
<li><strong>Vertex (đỉnh)</strong> — một điểm.</li>
<li><strong>Edge (cạnh)</strong> — đoạn nối hai đỉnh.</li>
<li><strong>Face (mặt/polygon)</strong> — mặt phẳng viền bởi các cạnh (thường 4 cạnh, gọi là <em>quad</em>).</li>
</ul>
<h3>Các thao tác cốt lõi</h3>
<ul>
<li><strong>Extrude</strong> — đẩy một mặt/cạnh ra để tạo hình học mới (thao tác chủ lực của modeling).</li>
<li><strong>Bevel</strong> — bo/vát một cạnh sắc thành một hoặc nhiều đoạn để nó bắt sáng.</li>
<li><strong>Loop cut</strong> — chèn một vòng cạnh quanh mặt lưới để thêm độ phân giải ở chỗ cần uốn hoặc thêm chi tiết.</li>
</ul>
<h3>Làm trong Blender — từng bước</h3>
<ol>
<li>Chọn đối tượng, bấm <code>Tab</code> để vào <strong>Edit Mode</strong>.</li>
<li>Đổi giữa chọn vertex / edge / face bằng <code>1</code> / <code>2</code> / <code>3</code>.</li>
<li>Chọn một face, bấm <code>E</code> để <strong>extrude</strong>, di chuyển, bấm để xác nhận.</li>
<li>Chọn một cạnh, bấm <code>Ctrl + B</code> để <strong>bevel</strong> (lăn chuột để thêm đoạn).</li>
<li>Bấm <code>Ctrl + R</code> để <strong>loop cut</strong>, rê để đặt, bấm, rồi trượt.</li>
</ol>
<div class="callout"><span class="badge">Mẹo</span> Dựng ở độ phân giải thấp trước — chỉnh đúng khối lớn rồi mới thêm loop cut và bevel. Chi tiết thêm quá sớm rất khó chỉnh về sau.</div>`,
  ]]);

const c2q = quiz('anm322-quiz-2', 'Quiz 2 — Polygon modeling|||Quiz 2 — Polygon modeling', [
  { id: 'q1', question: 'Thao tác đẩy một mặt ra để tạo thêm hình học mới gọi là?', options: ['Bevel', 'Extrude', 'Bake', 'Unwrap'], correctIndex: 1, explanation: 'Extrude đẩy mặt/cạnh ra tạo geometry mới — thao tác chủ lực.' },
  { id: 'q2', question: 'Một mặt polygon 4 cạnh — kiểu mặt được ưa dùng nhất khi modeling — gọi là?', options: ['Tri (tam giác)', 'N-gon', 'Quad (tứ giác)', 'Edge loop'], correctIndex: 2, explanation: 'Quad = mặt 4 cạnh, tốt cho subdivision và biến dạng.' },
  { id: 'q3', question: 'Thao tác chèn một vòng cạnh quanh mesh để thêm độ phân giải là?', options: ['Loop cut', 'Boolean', 'Merge', 'Fill'], correctIndex: 0, explanation: 'Loop cut (Ctrl+R) chèn edge loop để thêm chi tiết/độ uốn.' },
]);

const c3 = doc('anm322-3-1-topology', '3.1 — Topology & clean meshes|||3.1 — Topology & mặt lưới sạch',
  'Edge flow, quad vs tri/ngon, poles, retopology cơ bản; vì sao mesh sạch quan trọng.',
  [[
    `<span class="eyebrow">ANM322 · Chapter 3 · Lesson 3.1</span>
<h2>Topology &amp; clean meshes</h2>
<h3>What is topology?</h3>
<p><strong>Topology</strong> is <em>how</em> the polygons are arranged — the flow of edges across the surface. Good topology deforms cleanly when animated, subdivides smoothly, and is easy to edit.</p>
<h3>Quads, tris &amp; n-gons</h3>
<ul>
<li><strong>Quad</strong> (4 sides) — the goal; subdivides and deforms predictably.</li>
<li><strong>Tri</strong> (3 sides) — fine for static, hard-surface bits; avoid on deforming areas.</li>
<li><strong>N-gon</strong> (5+ sides) — avoid; renders and subdivides unpredictably.</li>
</ul>
<h3>Edge flow &amp; poles</h3>
<p><strong>Edge flow</strong> should follow the form and, for characters, the muscle/wrinkle lines (loops around eyes and mouth). A <strong>pole</strong> is a vertex where 3 or 5+ edges meet — keep them off creases and joints, where they cause pinching.</p>
<h3>Retopology — the basics</h3>
<p>A high-detail sculpt has millions of messy triangles. <strong>Retopology</strong> rebuilds a new, clean, low-poly quad mesh over that surface so it can be animated and textured. In Blender you snap a new mesh to the surface (Surface Snapping); Maya has the Quad Draw tool.</p>
<div class="callout"><span class="badge">Tip</span> Aim for all-quad flow before you subdivide or rig. Triangles and n-gons are where smoothing errors and animation pinching show up first.</div>`,
    `<span class="eyebrow">ANM322 · Chương 3 · Bài 3.1</span>
<h2>Topology &amp; mặt lưới sạch</h2>
<h3>Topology là gì?</h3>
<p><strong>Topology</strong> là <em>cách</em> các polygon được sắp xếp — dòng chảy của các cạnh trên bề mặt. Topology tốt biến dạng gọn khi hoạt hình, subdivide mượt, và dễ chỉnh sửa.</p>
<h3>Quad, tri &amp; n-gon</h3>
<ul>
<li><strong>Quad</strong> (4 cạnh) — mục tiêu; subdivide và biến dạng đoán trước được.</li>
<li><strong>Tri</strong> (3 cạnh) — ổn cho vật cứng, tĩnh; tránh ở vùng biến dạng.</li>
<li><strong>N-gon</strong> (5+ cạnh) — nên tránh; render và subdivide thất thường.</li>
</ul>
<h3>Edge flow &amp; pole</h3>
<p><strong>Edge flow</strong> nên đi theo dáng và, với nhân vật, theo đường cơ/nếp nhăn (vòng quanh mắt và miệng). <strong>Pole</strong> là đỉnh nơi 3 hoặc 5+ cạnh gặp nhau — giữ chúng tránh xa nếp gấp và khớp, nơi chúng gây nhíu.</p>
<h3>Retopology — căn bản</h3>
<p>Một bản sculpt chi tiết cao có hàng triệu tam giác lộn xộn. <strong>Retopology</strong> dựng lại một mặt lưới quad mới, sạch, low-poly đè lên bề mặt đó để có thể hoạt hình và texture. Trong Blender bạn snap mesh mới lên bề mặt (Surface Snapping); Maya có công cụ Quad Draw.</p>
<div class="callout"><span class="badge">Mẹo</span> Nhắm tới dòng chảy toàn quad trước khi subdivide hay rig. Tam giác và n-gon là nơi lỗi làm mượt và nhíu hoạt hình lộ ra đầu tiên.</div>`,
  ]]);

const c3q = quiz('anm322-quiz-3', 'Quiz 3 — Topology|||Quiz 3 — Topology', [
  { id: 'q1', question: 'Kiểu mặt nào NÊN TRÁNH vì subdivide/render thất thường?', options: ['Quad', 'N-gon (5+ cạnh)', 'Edge loop', 'Vertex'], correctIndex: 1, explanation: 'N-gon (>4 cạnh) subdivide và làm mượt không đoán trước được.' },
  { id: 'q2', question: 'Dựng lại một mặt lưới quad sạch, low-poly đè lên bản sculpt dày gọi là?', options: ['Retopology', 'Rigging', 'Baking', 'Rendering'], correctIndex: 0, explanation: 'Retopology tạo lưới sạch mới để animate/texture bản sculpt.' },
  { id: 'q3', question: 'Vì sao edge flow tốt lại quan trọng với nhân vật hoạt hình?', options: ['Làm file nhẹ hơn', 'Giúp mesh biến dạng gọn khi cử động', 'Tăng số polygon', 'Đổi màu vật liệu'], correctIndex: 1, explanation: 'Edge flow theo cơ/nếp gấp giúp biến dạng sạch, tránh nhíu.' },
]);

const c4 = doc('anm322-4-1-advanced-modeling', '4.1 — Advanced modeling|||4.1 — Modeling nâng cao',
  'Subdivision surface, boolean, sculpting cơ bản, modifier (không phá huỷ).',
  [[
    `<span class="eyebrow">ANM322 · Chapter 4 · Lesson 4.1</span>
<h2>Advanced modeling</h2>
<h3>Subdivision surface</h3>
<p>A <strong>Subdivision Surface</strong> modifier smooths a low-poly "cage" into a high-poly rounded form by adding geometry automatically. You model the simple cage; the modifier gives you the smooth result. Control sharpness with <strong>support loops</strong> (extra edge loops near a corner).</p>
<h3>Boolean</h3>
<p><strong>Boolean</strong> operations combine meshes: <em>Union</em> (merge), <em>Difference</em> (cut one shape out of another), <em>Intersect</em>. Great for hard-surface cuts (holes, panels) — but they leave messy topology, so clean up afterwards.</p>
<h3>Sculpting — the basics</h3>
<p><strong>Sculpting</strong> shapes a dense mesh like digital clay with brushes (Draw, Grab, Smooth, Crease). Use <strong>Dynamic Topology</strong> / <strong>Dyntopo</strong> or a multires modifier to add detail where you push. Sculpt organic forms, then retopologise for production.</p>
<h3>Modifiers — non-destructive</h3>
<p>Modifiers (Mirror, Array, Solidify, Bevel, Subdivision) change the mesh <em>without</em> baking the change in — you can tweak or remove them any time. Model half a symmetric object and let the <strong>Mirror</strong> modifier build the rest.</p>
<div class="callout"><span class="badge">Tip</span> Keep modifiers in the right order — e.g. Mirror before Subdivision — the stack is evaluated top to bottom and the order changes the result.</div>`,
    `<span class="eyebrow">ANM322 · Chương 4 · Bài 4.1</span>
<h2>Modeling nâng cao</h2>
<h3>Subdivision surface</h3>
<p>Modifier <strong>Subdivision Surface</strong> làm mượt một "lồng" (cage) low-poly thành dạng bo tròn high-poly bằng cách tự thêm hình học. Bạn dựng cage đơn giản; modifier cho ra kết quả mượt. Kiểm soát độ sắc bằng <strong>support loop</strong> (edge loop phụ đặt gần góc).</p>
<h3>Boolean</h3>
<p>Phép <strong>Boolean</strong> gộp các mesh: <em>Union</em> (hợp), <em>Difference</em> (cắt hình này ra khỏi hình kia), <em>Intersect</em> (giao). Rất hợp cho vật cứng (lỗ, tấm panel) — nhưng để lại topology lộn xộn, nên dọn lại sau đó.</p>
<h3>Sculpting — căn bản</h3>
<p><strong>Sculpting</strong> nặn một mesh dày như đất sét số bằng brush (Draw, Grab, Smooth, Crease). Dùng <strong>Dynamic Topology</strong> / <strong>Dyntopo</strong> hoặc modifier multires để thêm chi tiết nơi bạn nhấn. Nặn dáng hữu cơ rồi retopology để đưa vào sản xuất.</p>
<h3>Modifier — không phá huỷ</h3>
<p>Modifier (Mirror, Array, Solidify, Bevel, Subdivision) thay đổi mesh mà <em>không</em> nướng cứng thay đổi vào — bạn chỉnh hoặc gỡ bất cứ lúc nào. Dựng một nửa vật đối xứng rồi để modifier <strong>Mirror</strong> dựng nửa còn lại.</p>
<div class="callout"><span class="badge">Mẹo</span> Giữ đúng thứ tự modifier — vd Mirror trước Subdivision — stack được tính từ trên xuống và đổi thứ tự sẽ đổi kết quả.</div>`,
  ]]);

const c4q = quiz('anm322-quiz-4', 'Quiz 4 — Advanced modeling|||Quiz 4 — Modeling nâng cao', [
  { id: 'q1', question: 'Modifier làm mượt một lồng low-poly thành dạng bo tròn high-poly là?', options: ['Boolean', 'Subdivision Surface', 'Mirror', 'Solidify'], correctIndex: 1, explanation: 'Subdivision Surface tự thêm hình học, làm mượt cage low-poly.' },
  { id: 'q2', question: 'Phép Boolean "Difference" dùng để?', options: ['Gộp hai mesh thành một', 'Cắt hình này ra khỏi hình kia', 'Nhân bản theo mảng', 'Làm mượt bề mặt'], correctIndex: 1, explanation: 'Difference cắt (trừ) một mesh ra khỏi mesh khác — tạo lỗ/khe.' },
  { id: 'q3', question: 'Ưu điểm chính của làm việc bằng modifier là gì?', options: ['Không phá huỷ — chỉnh/gỡ bất cứ lúc nào', 'Luôn giảm số polygon', 'Tự động trải UV', 'Render nhanh hơn'], correctIndex: 0, explanation: 'Modifier không nướng cứng thay đổi — có thể tweak/xoá tuỳ ý.' },
]);

const c5 = doc('anm322-5-1-uv-unwrapping', '5.1 — UV unwrapping|||5.1 — Trải UV (UV unwrapping)',
  'UV mapping là gì, seam (đường cắt), unwrap, sắp xếp UV layout, checker để kiểm méo.',
  [[
    `<span class="eyebrow">ANM322 · Chapter 5 · Lesson 5.1</span>
<h2>UV unwrapping</h2>
<h3>What are UVs?</h3>
<p>A 3D surface must be flattened onto a 2D image before you can paint textures on it. <strong>UV coordinates</strong> map each vertex to a spot on that flat map (U = horizontal, V = vertical). Think of peeling an orange and pressing the peel flat.</p>
<h3>Seams</h3>
<p>You cannot flatten a closed surface without cutting it. <strong>Seams</strong> are the cut lines you choose — place them where they will be hidden (under an arm, inside a seam of clothing) to avoid visible texture breaks.</p>
<h3>Do it in Blender — step by step</h3>
<ol>
<li>In Edit Mode, select edges for the cuts → <code>Ctrl + E</code> → <strong>Mark Seam</strong>.</li>
<li>Select all (<code>A</code>), press <code>U</code> → <strong>Unwrap</strong>.</li>
<li>Open the <strong>UV Editor</strong> to see the flattened islands.</li>
<li>Apply a <strong>checker texture</strong> — even squares mean low distortion; stretched squares mean bad UVs.</li>
<li>Scale/arrange islands to fill the 0-1 UV space with even <strong>texel density</strong>.</li>
</ol>
<div class="callout"><span class="badge">Tip</span> Even texel density matters: if one island is much smaller than another, its texture will look blurrier. Keep the checker squares roughly the same size everywhere.</div>`,
    `<span class="eyebrow">ANM322 · Chương 5 · Bài 5.1</span>
<h2>Trải UV (UV unwrapping)</h2>
<h3>UV là gì?</h3>
<p>Một bề mặt 3D phải được trải phẳng lên một ảnh 2D trước khi vẽ texture. <strong>Toạ độ UV</strong> ánh xạ mỗi vertex tới một điểm trên bản đồ phẳng đó (U = ngang, V = dọc). Hình dung như lột vỏ cam rồi ép phẳng.</p>
<h3>Seam (đường cắt)</h3>
<p>Không thể trải phẳng một bề mặt kín mà không cắt. <strong>Seam</strong> là đường cắt bạn chọn — đặt ở chỗ sẽ bị che (dưới cánh tay, trong đường may áo) để tránh vết đứt texture lộ ra.</p>
<h3>Làm trong Blender — từng bước</h3>
<ol>
<li>Trong Edit Mode, chọn các cạnh cần cắt → <code>Ctrl + E</code> → <strong>Mark Seam</strong>.</li>
<li>Chọn tất cả (<code>A</code>), bấm <code>U</code> → <strong>Unwrap</strong>.</li>
<li>Mở <strong>UV Editor</strong> để thấy các "đảo" (island) đã trải phẳng.</li>
<li>Gán một <strong>checker texture</strong> — ô vuông đều nghĩa là ít méo; ô bị kéo giãn nghĩa là UV xấu.</li>
<li>Co giãn/sắp xếp island để lấp đầy không gian UV 0-1 với <strong>texel density</strong> đều.</li>
</ol>
<div class="callout"><span class="badge">Mẹo</span> Texel density đều rất quan trọng: nếu một island nhỏ hơn hẳn island khác, texture của nó sẽ trông mờ hơn. Giữ ô checker xấp xỉ cùng kích thước ở mọi nơi.</div>`,
  ]]);

const c5q = quiz('anm322-quiz-5', 'Quiz 5 — UV unwrapping|||Quiz 5 — Trải UV', [
  { id: 'q1', question: 'UV coordinates dùng để làm gì?', options: ['Ánh xạ bề mặt 3D lên ảnh 2D để vẽ texture', 'Đặt vị trí đèn', 'Định số polygon', 'Lưu animation'], correctIndex: 0, explanation: 'UV ánh xạ mỗi vertex lên bản đồ 2D phẳng cho texture.' },
  { id: 'q2', question: 'Seam trong UV unwrapping là?', options: ['Một loại đèn', 'Đường cắt để trải phẳng bề mặt', 'Bản đồ normal', 'Một modifier'], correctIndex: 1, explanation: 'Seam là đường cắt; nên đặt nơi khuất để không lộ vết texture.' },
  { id: 'q3', question: 'Checker texture giúp kiểm tra điều gì trên UV?', options: ['Số lượng đèn', 'Độ méo & texel density (ô méo/kéo giãn = UV xấu)', 'Màu vật liệu', 'Tốc độ render'], correctIndex: 1, explanation: 'Ô checker đều = ít méo, texel density đồng đều; ô giãn = UV xấu.' },
]);

const c6 = doc('anm322-6-1-materials-shading', '6.1 — Materials & shading (PBR)|||6.1 — Vật liệu & Shading (PBR)',
  'Material & shader, mô hình PBR, các kênh base color / roughness / metallic / normal; node shader.',
  [[
    `<span class="eyebrow">ANM322 · Chapter 6 · Lesson 6.1</span>
<h2>Materials &amp; shading (PBR)</h2>
<h3>Material vs shader</h3>
<p>A <strong>material</strong> describes what a surface is made of; a <strong>shader</strong> is the program that computes how light bounces off it. Modern work uses <strong>PBR</strong> (Physically Based Rendering) so a material looks correct under any lighting.</p>
<h3>The PBR channels</h3>
<ul>
<li><strong>Base color (albedo)</strong> — the pure surface color, with no lighting baked in.</li>
<li><strong>Roughness</strong> — how sharp or blurry reflections are (0 = mirror, 1 = matte).</li>
<li><strong>Metallic</strong> — is it metal (1) or not (0)? This changes how reflections and color behave.</li>
<li><strong>Normal</strong> — fakes surface bumps/detail by tilting how light hits, without adding geometry.</li>
</ul>
<h3>Do it in Blender — step by step</h3>
<ol>
<li>Select the object → <strong>Material Properties</strong> → New.</li>
<li>The default <strong>Principled BSDF</strong> shader exposes all PBR channels in one node.</li>
<li>Open the <strong>Shader Editor</strong> and set Base Color, Roughness, Metallic.</li>
<li>Plug image maps into channels via <strong>Image Texture</strong> nodes (see the next chapter).</li>
</ol>
<div class="callout"><span class="badge">Tip</span> The <strong>Principled BSDF</strong> (Blender) and <strong>aiStandardSurface</strong> (Arnold/Maya) are both single "uber" PBR shaders — learn one set of channels and it transfers between apps.</div>`,
    `<span class="eyebrow">ANM322 · Chương 6 · Bài 6.1</span>
<h2>Vật liệu &amp; Shading (PBR)</h2>
<h3>Material vs shader</h3>
<p>Một <strong>material</strong> mô tả bề mặt làm từ gì; một <strong>shader</strong> là chương trình tính cách ánh sáng phản xạ khỏi nó. Công việc hiện đại dùng <strong>PBR</strong> (Physically Based Rendering) để vật liệu trông đúng dưới mọi kiểu ánh sáng.</p>
<h3>Các kênh PBR</h3>
<ul>
<li><strong>Base color (albedo)</strong> — màu bề mặt thuần, không nướng sẵn ánh sáng.</li>
<li><strong>Roughness (độ nhám)</strong> — phản xạ sắc hay mờ (0 = gương, 1 = mờ đục).</li>
<li><strong>Metallic (kim loại)</strong> — là kim loại (1) hay không (0)? Thay đổi cách phản xạ và màu hành xử.</li>
<li><strong>Normal</strong> — giả lập gồ ghề/chi tiết bề mặt bằng cách nghiêng hướng ánh sáng chạm vào, không thêm hình học.</li>
</ul>
<h3>Làm trong Blender — từng bước</h3>
<ol>
<li>Chọn đối tượng → <strong>Material Properties</strong> → New.</li>
<li>Shader mặc định <strong>Principled BSDF</strong> gom mọi kênh PBR trong một node.</li>
<li>Mở <strong>Shader Editor</strong> và đặt Base Color, Roughness, Metallic.</li>
<li>Cắm image map vào từng kênh qua node <strong>Image Texture</strong> (xem chương sau).</li>
</ol>
<div class="callout"><span class="badge">Mẹo</span> <strong>Principled BSDF</strong> (Blender) và <strong>aiStandardSurface</strong> (Arnold/Maya) đều là shader PBR "uber" một-cho-tất — học một bộ kênh là dùng được ở cả hai phần mềm.</div>`,
  ]]);

const c6q = quiz('anm322-quiz-6', 'Quiz 6 — Materials & shading|||Quiz 6 — Vật liệu & shading', [
  { id: 'q1', question: 'Trong PBR, kênh nào quyết định phản xạ sắc nét hay mờ đục?', options: ['Base color', 'Roughness', 'Metallic', 'Normal'], correctIndex: 1, explanation: 'Roughness: 0 = như gương, 1 = mờ đục (khuếch tán).' },
  { id: 'q2', question: 'Kênh nào giả lập chi tiết gồ ghề bề mặt mà KHÔNG thêm hình học?', options: ['Normal map', 'Base color', 'Metallic', 'Roughness'], correctIndex: 0, explanation: 'Normal map nghiêng hướng ánh sáng, tạo cảm giác gồ ghề mà không thêm poly.' },
  { id: 'q3', question: 'PBR (Physically Based Rendering) nhằm mục đích gì?', options: ['Giảm số polygon', 'Vật liệu trông đúng dưới mọi điều kiện ánh sáng', 'Tăng tốc độ modeling', 'Tự động trải UV'], correctIndex: 1, explanation: 'PBR mô phỏng vật lý ánh sáng nên vật liệu nhất quán dưới mọi đèn.' },
]);

const c7 = doc('anm322-7-1-texturing', '7.1 — Texturing & baking|||7.1 — Texturing & baking',
  'Texture map, procedural vs image, baking (high→low poly), texture painting với Substance.',
  [[
    `<span class="eyebrow">ANM322 · Chapter 7 · Lesson 7.1</span>
<h2>Texturing &amp; baking</h2>
<h3>Texture maps</h3>
<p>A <strong>texture map</strong> is an image plugged into a PBR channel — a color map for base color, a grayscale map for roughness, an RGB map for normals, and so on. They ride on your UVs.</p>
<h3>Procedural vs image textures</h3>
<ul>
<li><strong>Image textures</strong> — painted or photo-based bitmaps; full artistic control, but resolution-limited.</li>
<li><strong>Procedural textures</strong> — generated by math (noise, gradients); infinite resolution and tweakable, great for wood, marble, wear.</li>
</ul>
<h3>Baking</h3>
<p><strong>Baking</strong> transfers detail from a high-poly sculpt onto the UVs of a low-poly model as maps — chiefly a <strong>normal map</strong> (fine bumps) and an <strong>ambient occlusion</strong> map (contact shadows). This is how games show sculpted detail on cheap geometry.</p>
<h3>Texture painting — Substance 3D Painter</h3>
<ol>
<li>Import the low-poly model plus the baked maps.</li>
<li>Paint materials in layers with masks (edge wear, dirt in cavities).</li>
<li>Export a full PBR set (base color, roughness, metallic, normal) for your engine or renderer.</li>
</ol>
<div class="callout"><span class="badge">Tip</span> Bake AO and curvature first — Substance uses them to drive smart masks (grime in crevices, wear on edges) automatically, saving hours of hand painting.</div>`,
    `<span class="eyebrow">ANM322 · Chương 7 · Bài 7.1</span>
<h2>Texturing &amp; baking</h2>
<h3>Texture map</h3>
<p>Một <strong>texture map</strong> là ảnh cắm vào một kênh PBR — bản đồ màu cho base color, bản đồ xám cho roughness, bản đồ RGB cho normal, v.v. Chúng bám lên UV của bạn.</p>
<h3>Procedural vs image texture</h3>
<ul>
<li><strong>Image texture</strong> — ảnh bitmap vẽ tay hoặc từ ảnh chụp; toàn quyền nghệ thuật, nhưng giới hạn độ phân giải.</li>
<li><strong>Procedural texture</strong> — sinh bằng toán (noise, gradient); độ phân giải vô hạn và chỉnh được, hợp cho gỗ, đá cẩm thạch, vết mòn.</li>
</ul>
<h3>Baking (nướng bản đồ)</h3>
<p><strong>Baking</strong> chuyển chi tiết từ bản sculpt high-poly lên UV của model low-poly thành các bản đồ — chủ yếu là <strong>normal map</strong> (gồ ghề tinh) và <strong>ambient occlusion</strong> (bóng tiếp xúc). Đây là cách game hiện chi tiết sculpt trên hình học rẻ.</p>
<h3>Texture painting — Substance 3D Painter</h3>
<ol>
<li>Nhập model low-poly cùng các bản đồ đã bake.</li>
<li>Vẽ vật liệu theo lớp có mask (mòn cạnh, bẩn trong khe).</li>
<li>Xuất bộ PBR đầy đủ (base color, roughness, metallic, normal) cho engine hoặc renderer.</li>
</ol>
<div class="callout"><span class="badge">Mẹo</span> Bake AO và curvature trước — Substance dùng chúng để chạy smart mask (bẩn đọng khe, mòn ở cạnh) tự động, tiết kiệm hàng giờ vẽ tay.</div>`,
  ]]);

const c7q = quiz('anm322-quiz-7', 'Quiz 7 — Texturing & baking|||Quiz 7 — Texturing & baking', [
  { id: 'q1', question: 'Baking từ high-poly sang low-poly chủ yếu tạo ra bản đồ nào để hiện chi tiết?', options: ['Normal map', 'UV map', 'Displacement cage', 'Light map camera'], correctIndex: 0, explanation: 'Normal map (và AO) cho phép low-poly hiện chi tiết của high-poly.' },
  { id: 'q2', question: 'Ưu điểm chính của procedural texture so với image texture là?', options: ['Độ phân giải vô hạn, chỉnh được bằng tham số', 'Luôn đẹp hơn ảnh chụp', 'Không cần UV', 'Render nhanh hơn mọi lúc'], correctIndex: 0, explanation: 'Procedural sinh bằng toán → vô hạn độ phân giải, tweak bằng tham số.' },
  { id: 'q3', question: 'Phần mềm phổ biến để vẽ texture PBR theo lớp và bake là?', options: ['Adobe Substance 3D Painter', 'Microsoft Word', 'Audacity', 'DaVinci Resolve'], correctIndex: 0, explanation: 'Substance 3D Painter: vẽ PBR theo lớp/mask và bake bản đồ.' },
]);

const c8 = doc('anm322-8-1-lighting-render', '8.1 — Lighting & rendering|||8.1 — Ánh sáng & Render',
  'Đèn 3 điểm, HDRI, camera, render engine (Cycles/Arnold), thiết lập & xuất ảnh.',
  [[
    `<span class="eyebrow">ANM322 · Chapter 8 · Lesson 8.1</span>
<h2>Lighting &amp; rendering</h2>
<h3>Three-point lighting</h3>
<ul>
<li><strong>Key light</strong> — the main, brightest light, off to one side.</li>
<li><strong>Fill light</strong> — softer, opposite the key, to lift the shadows.</li>
<li><strong>Rim / back light</strong> — behind the subject, to separate it from the background.</li>
</ul>
<h3>HDRI &amp; the camera</h3>
<p>An <strong>HDRI</strong> is a 360° high-dynamic-range image used as an environment — it lights the scene realistically and gives reflections in one step. The <strong>camera</strong> defines the final frame: focal length, depth of field and composition.</p>
<h3>Render engines</h3>
<p><strong>Cycles</strong> (Blender) and <strong>Arnold</strong> (Maya) are <em>path-tracers</em> — physically accurate but slower; Blender's <strong>Eevee</strong> is a fast real-time engine for previews. More samples = less noise but more time; use denoising to cut render time.</p>
<h3>Do it in Blender — step by step</h3>
<ol>
<li>Add lights (<code>Shift + A</code> → Light) or load an HDRI in <strong>World Properties</strong>.</li>
<li>Pick <strong>Cycles</strong> in Render Properties; set the sample count.</li>
<li>Frame the shot through the camera (<code>Numpad 0</code>).</li>
<li>Render with <code>F12</code>, enable <strong>Denoise</strong>, then export as PNG/EXR from the Image menu.</li>
</ol>
<div class="callout"><span class="badge">Tip</span> Render to a 16/32-bit EXR when you plan to composite — it keeps highlight and shadow detail you can recover later, unlike an 8-bit PNG.</div>`,
    `<span class="eyebrow">ANM322 · Chương 8 · Bài 8.1</span>
<h2>Ánh sáng &amp; Render</h2>
<h3>Ánh sáng 3 điểm</h3>
<ul>
<li><strong>Key light (đèn chính)</strong> — đèn chính, sáng nhất, đặt lệch một bên.</li>
<li><strong>Fill light (đèn phụ)</strong> — dịu hơn, đối diện key, để nâng vùng tối.</li>
<li><strong>Rim / back light (đèn viền)</strong> — sau chủ thể, để tách nó khỏi nền.</li>
</ul>
<h3>HDRI &amp; camera</h3>
<p><strong>HDRI</strong> là ảnh 360° dải động cao dùng làm môi trường — nó chiếu sáng cảnh chân thực và cho phản xạ chỉ trong một bước. <strong>Camera</strong> định khung hình cuối: tiêu cự, độ sâu trường ảnh và bố cục.</p>
<h3>Render engine</h3>
<p><strong>Cycles</strong> (Blender) và <strong>Arnold</strong> (Maya) là <em>path-tracer</em> — chính xác vật lý nhưng chậm hơn; <strong>Eevee</strong> của Blender là engine thời gian thực nhanh để xem thử. Nhiều sample = ít nhiễu nhưng tốn thời gian; dùng denoise để cắt thời gian render.</p>
<h3>Làm trong Blender — từng bước</h3>
<ol>
<li>Thêm đèn (<code>Shift + A</code> → Light) hoặc nạp HDRI trong <strong>World Properties</strong>.</li>
<li>Chọn <strong>Cycles</strong> trong Render Properties; đặt số sample.</li>
<li>Ngắm khung qua camera (<code>Numpad 0</code>).</li>
<li>Render bằng <code>F12</code>, bật <strong>Denoise</strong>, rồi xuất PNG/EXR từ menu Image.</li>
</ol>
<div class="callout"><span class="badge">Mẹo</span> Render ra EXR 16/32-bit khi định composite — nó giữ chi tiết vùng sáng và tối để phục hồi về sau, khác với PNG 8-bit.</div>`,
  ]]);

const c8q = quiz('anm322-quiz-8', 'Quiz 8 — Lighting & rendering|||Quiz 8 — Ánh sáng & render', [
  { id: 'q1', question: 'Trong ánh sáng 3 điểm, đèn nào tách chủ thể khỏi nền?', options: ['Key light', 'Fill light', 'Rim / back light', 'HDRI'], correctIndex: 2, explanation: 'Rim/back light đặt sau chủ thể tạo viền sáng, tách khỏi nền.' },
  { id: 'q2', question: 'HDRI được dùng để làm gì trong một cảnh 3D?', options: ['Chiếu sáng môi trường + cho phản xạ chân thực', 'Trải UV tự động', 'Tăng số polygon', 'Bake normal map'], correctIndex: 0, explanation: 'HDRI 360° chiếu sáng cảnh và cung cấp phản xạ trong một bước.' },
  { id: 'q3', question: 'Cycles và Arnold thuộc loại render engine nào?', options: ['Path-tracer (chính xác vật lý)', 'Trình soạn thảo văn bản', 'Công cụ trải UV', 'Bộ nén video'], correctIndex: 0, explanation: 'Cả hai là path-tracer chính xác vật lý; Eevee thì real-time để xem thử.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'ANM322',
    slug: 'anm322-3d-modeling-shading',
    title: '3D Modeling & Shading',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ANM322.webp',
    shortDescription: 'Model & shade 3D assets in Blender & Maya — polygon modeling, clean topology & retopology, subdivision & sculpting, UV unwrapping, PBR materials, texturing & baking, lighting & rendering (Cycles/Arnold). Bilingual, step-by-step, with quizzes.|||Dựng hình & đổ bóng vật thể 3D bằng Blender & Maya — polygon modeling, topology sạch, subdivision & sculpting, UV unwrapping, vật liệu PBR, texturing & baking, ánh sáng & render (Cycles/Arnold). Song ngữ, từng bước, có quiz.',
    description: 'Môn <strong>ANM322 — 3D Modeling &amp; Shading</strong> (kỳ 5, ngành Thiết kế mỹ thuật số) dạy bạn dựng một vật thể 3D từ đầu và làm nó trông thật. Đi qua cả pipeline: <strong>nhập môn 3D</strong> (không gian, viewport, primitive) → <strong>polygon modeling</strong> (extrude, bevel, loop cut) → <strong>topology sạch</strong> (edge flow, quad, retopology) → <strong>modeling nâng cao</strong> (subdivision, boolean, sculpting, modifier) → <strong>UV unwrapping</strong> → <strong>vật liệu &amp; shading PBR</strong> → <strong>texturing &amp; baking</strong> → <strong>ánh sáng &amp; render</strong> (Cycles/Arnold). Bám giáo trình chuẩn quốc tế (Blender + Autodesk Maya), song ngữ, có thao tác phần mềm từng bước và quiz mỗi chương.',
    whatYouLearn: 'Không gian 3D, viewport &amp; primitive; polygon modeling (vertex/edge/face, extrude, bevel, loop cut); topology sạch (edge flow, quad vs tri/ngon, retopology); subdivision surface, boolean, sculpting, modifier; UV unwrapping (seam, unwrap, texel density); vật liệu &amp; shader PBR (base color/roughness/metallic/normal); texturing &amp; baking (procedural vs image, normal/AO, Substance); ánh sáng 3 điểm, HDRI, camera và render bằng Cycles/Arnold.',
    requirements: 'Máy cài Blender (miễn phí) hoặc Autodesk Maya (bản sinh viên). Biết dùng máy tính cơ bản; không cần kinh nghiệm 3D trước đó.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu Blender/Maya, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Pipeline 3D, bốn giai đoạn, Blender & Maya.', lessons: [intro] },
    { title: 'Chương 1 — Nhập môn 3D|||Chapter 1 — Getting started in 3D', description: 'Không gian 3D, phần mềm, viewport, XYZ, primitive.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Polygon modeling|||Chapter 2 — Polygon modeling', description: 'Vertex/edge/face, extrude, bevel, loop cut.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Topology & mặt lưới sạch|||Chapter 3 — Topology', description: 'Edge flow, quad vs tri/ngon, retopology.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Modeling nâng cao|||Chapter 4 — Advanced modeling', description: 'Subdivision, boolean, sculpting, modifier.', lessons: [c4, c4q] },
    { title: 'Chương 5 — UV Unwrapping|||Chapter 5 — UV unwrapping', description: 'UV mapping, seam, unwrap, UV layout.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Vật liệu & Shading|||Chapter 6 — Materials & shading', description: 'Material, shader PBR, các kênh cơ bản.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Texturing|||Chapter 7 — Texturing', description: 'Texture map, procedural vs image, baking, Substance.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ánh sáng & Render|||Chapter 8 — Lighting & render', description: 'Đèn 3 điểm, HDRI, camera, Cycles/Arnold, xuất.', lessons: [c8, c8q] },
  ],
};
