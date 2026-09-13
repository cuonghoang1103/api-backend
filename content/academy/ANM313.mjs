/**
 * ANM313 — Visual Tool 3D (Công cụ dựng hình 3D — Maya/Blender/3ds Max).
 * Ngành Thiết kế mỹ thuật số, kỳ 5, FPTU. Song ngữ VI+EN.
 * Nguồn: tài liệu Autodesk Maya/3ds Max, Blender manual (blender.org),
 * "Introducing Autodesk Maya" (Dariush Derakhshani), Gnomon Workshop.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n; &→&amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('anm313-0-1-overview', 'Course overview: Visual Tool 3D|||Tổng quan: Công cụ dựng hình 3D',
  'Dựng hình 3D làm gì; ba phần mềm chủ lực (Maya, Blender, 3ds Max); lộ trình: giao diện & pipeline → modeling → topology/UV → vật liệu → ánh sáng → render → xuất & tối ưu.',
  [[
    `<span class="eyebrow">ANM313 · Lesson 0.1 · Overview</span>
<h2>Visual Tool 3D</h2>
<p class="lead">This course teaches you to <strong>build 3D assets</strong> with industry tools — <strong>Autodesk Maya</strong>, <strong>Blender</strong> and <strong>3ds Max</strong> — from an empty viewport to a rendered, game-ready or film-ready model. You will model, unwrap, texture, light and render, then hand a clean asset to the next stage of the pipeline.</p>
<h3>The three big tools</h3>
<ul>
<li><strong>Autodesk Maya</strong> — the film/VFX &amp; animation standard; strong modeling, rigging and Arnold renderer.</li>
<li><strong>Blender</strong> — free &amp; open-source, all-in-one; Cycles (path-traced) &amp; Eevee (real-time) renderers.</li>
<li><strong>3ds Max</strong> — popular for archviz &amp; game art on Windows; modifier stack workflow.</li>
</ul>
<p>The <em>concepts</em> — polygons, topology, UVs, shaders, lights, render settings — are the same across all three. Learn the ideas once and the buttons follow.</p>
<h3>Roadmap</h3>
<p>Interface &amp; pipeline → polygon modeling → box modeling &amp; subdivision → topology &amp; UV unwrapping → materials, texture &amp; shaders → lighting &amp; cameras → rendering (Arnold/Cycles/Eevee) → export, optimization &amp; pipeline integration. Bilingual, with checklists and a quiz each chapter.</p>`,
    `<span class="eyebrow">ANM313 · Bài 0.1 · Tổng quan</span>
<h2>Công cụ dựng hình 3D</h2>
<p class="lead">Môn này dạy bạn <strong>dựng tài nguyên 3D</strong> bằng công cụ chuẩn ngành — <strong>Autodesk Maya</strong>, <strong>Blender</strong> và <strong>3ds Max</strong> — từ một viewport trống đến một mô hình đã render, sẵn cho game hoặc phim. Bạn sẽ modeling, trải UV, texture, chiếu sáng và render, rồi bàn giao một asset sạch cho bước tiếp theo của pipeline.</p>
<h3>Ba phần mềm chủ lực</h3>
<ul>
<li><strong>Autodesk Maya</strong> — chuẩn của phim/VFX &amp; hoạt hình; mạnh về modeling, rigging và renderer Arnold.</li>
<li><strong>Blender</strong> — miễn phí &amp; mã nguồn mở, trọn gói; có Cycles (path-tracing) &amp; Eevee (thời gian thực).</li>
<li><strong>3ds Max</strong> — phổ biến cho archviz &amp; game art trên Windows; quy trình modifier stack.</li>
</ul>
<p><em>Khái niệm</em> — polygon, topology, UV, shader, đèn, thiết lập render — giống nhau ở cả ba. Hiểu ý tưởng một lần, các nút bấm theo sau.</p>
<h3>Lộ trình</h3>
<p>Giao diện &amp; pipeline → polygon modeling → box modeling &amp; subdivision → topology &amp; trải UV → vật liệu, texture &amp; shader → ánh sáng &amp; camera → render (Arnold/Cycles/Eevee) → xuất, tối ưu &amp; tích hợp pipeline. Song ngữ, có checklist và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('anm313-1-1-interface-pipeline', '1.1 — Interface, viewport, navigation & 3D pipeline|||1.1 — Giao diện, viewport, điều hướng & pipeline 3D',
  'Bố cục giao diện, viewport & các chế độ xem, điều hướng (orbit/pan/zoom), hệ trục toạ độ, và pipeline 3D (model→UV→texture→rig→animate→render→comp).',
  [[
    `<span class="eyebrow">ANM313 · Chapter 1 · Lesson 1.1</span>
<h2>Interface, viewport &amp; the 3D pipeline</h2>
<h3>The workspace</h3>
<p>Every 3D app shares the same anatomy: a <strong>viewport</strong> (the 3D window), a <strong>menu/shelf</strong> of tools, an <strong>outliner</strong> (scene list of objects), a <strong>channel box / attribute editor</strong> (numeric properties), and a <strong>timeline</strong> for animation.</p>
<h3>Navigation &amp; axes</h3>
<ul>
<li><strong>Orbit</strong> — rotate the camera around the scene; <strong>Pan</strong> — slide the view; <strong>Zoom / dolly</strong> — move in and out.</li>
<li>3D space uses three axes: <strong>X</strong> (right/left), <strong>Y</strong> (up/down), <strong>Z</strong> (forward/back). Maya &amp; Blender are Y-up or Z-up — always know which so exports line up.</li>
<li>Transforms are <strong>Move (translate)</strong>, <strong>Rotate</strong>, <strong>Scale</strong> — the three you use constantly.</li>
</ul>
<pre><code>The 3D production pipeline (asset flow):
  Modeling     -> build the shape (polygons)
  UV unwrap    -> flatten the surface for texturing
  Texturing    -> paint colour / roughness / normal maps
  Shading      -> assign materials
  Rigging      -> add a skeleton (if it must move)
  Animation    -> keyframe the motion
  Lighting     -> place lights and cameras
  Rendering    -> compute the final image
  Compositing  -> combine passes, colour-grade
</code></pre>
<div class="callout"><span class="badge">Why the pipeline matters</span> Each stage hands clean data to the next. A messy model breaks UVs; bad UVs ruin textures. Getting the early stages right saves hours downstream.</div>`,
    `<span class="eyebrow">ANM313 · Chương 1 · Bài 1.1</span>
<h2>Giao diện, viewport &amp; pipeline 3D</h2>
<h3>Không gian làm việc</h3>
<p>Mọi phần mềm 3D có chung cấu tạo: một <strong>viewport</strong> (cửa sổ 3D), một <strong>menu/shelf</strong> công cụ, một <strong>outliner</strong> (danh sách đối tượng trong scene), một <strong>channel box / attribute editor</strong> (thuộc tính dạng số), và một <strong>timeline</strong> cho hoạt hình.</p>
<h3>Điều hướng &amp; hệ trục</h3>
<ul>
<li><strong>Orbit</strong> — xoay camera quanh scene; <strong>Pan</strong> — trượt khung nhìn; <strong>Zoom / dolly</strong> — tiến ra vào.</li>
<li>Không gian 3D có ba trục: <strong>X</strong> (phải/trái), <strong>Y</strong> (lên/xuống), <strong>Z</strong> (trước/sau). Maya &amp; Blender dùng Y-up hoặc Z-up — luôn biết rõ để khi xuất khớp trục.</li>
<li>Ba phép biến đổi: <strong>Move (di chuyển)</strong>, <strong>Rotate (xoay)</strong>, <strong>Scale (co giãn)</strong> — dùng liên tục.</li>
</ul>
<pre><code>Pipeline sản xuất 3D (dòng chảy asset):
  Modeling     -> dựng hình khối (polygon)
  Trải UV      -> làm phẳng bề mặt để texture
  Texturing    -> vẽ map màu / roughness / normal
  Shading      -> gán vật liệu
  Rigging      -> thêm bộ xương (nếu cần chuyển động)
  Animation    -> đặt keyframe cho chuyển động
  Lighting     -> đặt đèn và camera
  Rendering    -> tính ra ảnh cuối
  Compositing  -> ghép các pass, chỉnh màu
</code></pre>
<div class="callout"><span class="badge">Vì sao pipeline quan trọng</span> Mỗi bước bàn giao dữ liệu sạch cho bước sau. Model lộn xộn làm hỏng UV; UV xấu làm hỏng texture. Làm đúng từ đầu tiết kiệm hàng giờ về sau.</div>`,
  ]]);

const c1q = quiz('anm313-quiz-1', 'Quiz 1 — Interface & pipeline|||Quiz 1 — Giao diện & pipeline', [
  { id: 'q1', question: 'Cửa sổ 3D nơi bạn nhìn và thao tác với scene gọi là?', options: ['Outliner', 'Viewport', 'Timeline', 'Channel box'], correctIndex: 1, explanation: 'Viewport là cửa sổ hiển thị không gian 3D để thao tác.' },
  { id: 'q2', question: 'Ba phép biến đổi cơ bản với một đối tượng 3D là?', options: ['Extrude, bevel, cut', 'Move, rotate, scale', 'Orbit, pan, zoom', 'Model, rig, render'], correctIndex: 1, explanation: 'Move (di chuyển), Rotate (xoay), Scale (co giãn) là ba transform nền tảng.' },
  { id: 'q3', question: 'Trong pipeline 3D, bước "trải UV" nằm ngay sau bước nào?', options: ['Rendering', 'Rigging', 'Modeling', 'Compositing'], correctIndex: 2, explanation: 'Modeling dựng hình xong thì trải UV để chuẩn bị texture.' },
]);

const c2 = doc('anm313-2-1-poly-modeling', '2.1 — Basic modeling: polygons, primitives & extrude|||2.1 — Modeling cơ bản: polygon, primitive & extrude',
  'Cấu trúc polygon mesh (vertex/edge/face), các primitive (cube/sphere/cylinder), và công cụ modeling nền tảng: extrude, bevel, inset, cut, merge.',
  [[
    `<span class="eyebrow">ANM313 · Chapter 2 · Lesson 2.1</span>
<h2>Polygon modeling basics</h2>
<h3>Anatomy of a mesh</h3>
<p>A <strong>polygon mesh</strong> is built from three components:</p>
<ul>
<li><strong>Vertex</strong> — a point in 3D space (the corners).</li>
<li><strong>Edge</strong> — a line connecting two vertices.</li>
<li><strong>Face (polygon)</strong> — a flat surface bounded by edges. Prefer <strong>quads</strong> (4-sided faces); avoid triangles and <strong>n-gons</strong> (5+ sides) in models that will be smoothed or animated.</li>
</ul>
<h3>Primitives — the starting shapes</h3>
<p>You rarely model from nothing. Start from a <strong>primitive</strong>: cube, sphere, cylinder, cone, plane, torus — then reshape it.</p>
<pre><code>Core modeling tools:
  Extrude  -> push a face/edge out to add depth or length
  Bevel    -> round or chamfer a sharp edge
  Inset    -> create a smaller face inside a face
  Cut/Knife-> add new edges where you need detail
  Merge    -> weld vertices together
  Bridge   -> connect two open edge loops with faces
</code></pre>
<div class="callout"><span class="badge">Extrude is king</span> Most hard-surface modeling is repeated <strong>extrude + bevel</strong>. Add geometry only where the silhouette or detail needs it — every extra face costs memory and render time.</div>`,
    `<span class="eyebrow">ANM313 · Chương 2 · Bài 2.1</span>
<h2>Modeling polygon cơ bản</h2>
<h3>Cấu tạo một mesh</h3>
<p>Một <strong>polygon mesh</strong> dựng từ ba thành phần:</p>
<ul>
<li><strong>Vertex (đỉnh)</strong> — một điểm trong không gian 3D (các góc).</li>
<li><strong>Edge (cạnh)</strong> — đoạn nối hai đỉnh.</li>
<li><strong>Face (mặt/polygon)</strong> — bề mặt phẳng giới hạn bởi các cạnh. Ưu tiên <strong>quad</strong> (mặt 4 cạnh); tránh tam giác và <strong>n-gon</strong> (từ 5 cạnh) ở model sẽ được làm mượt hoặc animate.</li>
</ul>
<h3>Primitive — hình khởi đầu</h3>
<p>Hiếm khi dựng từ số không. Bắt đầu từ một <strong>primitive</strong>: cube, sphere, cylinder, cone, plane, torus — rồi nắn lại.</p>
<pre><code>Công cụ modeling cốt lõi:
  Extrude  -> đùn một mặt/cạnh ra để thêm độ dày, chiều dài
  Bevel    -> bo tròn hoặc vát một cạnh sắc
  Inset    -> tạo một mặt nhỏ hơn bên trong một mặt
  Cut/Knife-> thêm cạnh mới nơi cần chi tiết
  Merge    -> hàn các đỉnh lại với nhau
  Bridge   -> nối hai vòng cạnh hở bằng các mặt
</code></pre>
<div class="callout"><span class="badge">Extrude là vua</span> Phần lớn modeling hard-surface là lặp lại <strong>extrude + bevel</strong>. Chỉ thêm geometry nơi silhouette hoặc chi tiết cần — mỗi mặt thừa tốn bộ nhớ và thời gian render.</div>`,
  ]]);

const c2q = quiz('anm313-quiz-2', 'Quiz 2 — Polygon modeling|||Quiz 2 — Modeling polygon', [
  { id: 'q1', question: 'Ba thành phần cơ bản của một polygon mesh là?', options: ['Pixel, voxel, texel', 'Vertex, edge, face', 'UV, normal, tangent', 'Bone, joint, weight'], correctIndex: 1, explanation: 'Mesh gồm vertex (đỉnh), edge (cạnh) và face (mặt).' },
  { id: 'q2', question: 'Loại mặt nào nên ưu tiên khi model sẽ được làm mượt/animate?', options: ['Tam giác', 'Quad (4 cạnh)', 'N-gon (5+ cạnh)', 'Mặt hở'], correctIndex: 1, explanation: 'Quad cho subdivision và deform mượt, ổn định hơn tri/n-gon.' },
  { id: 'q3', question: 'Công cụ "đùn một mặt ra để thêm độ dày/chiều dài" là?', options: ['Bevel', 'Inset', 'Extrude', 'Merge'], correctIndex: 2, explanation: 'Extrude đùn mặt/cạnh ra, thêm geometry theo hướng.' },
]);

const c3 = doc('anm313-3-1-box-subdivision', '3.1 — Box modeling & subdivision surfaces|||3.1 — Box modeling & subdivision surfaces',
  'Kỹ thuật box modeling (từ khối lập phương nắn dần), subdivision surface (Catmull-Clark), edge loop & support/holding edges để giữ cạnh sắc khi smooth.',
  [[
    `<span class="eyebrow">ANM313 · Chapter 3 · Lesson 3.1</span>
<h2>Box modeling &amp; subdivision surfaces</h2>
<h3>Box modeling</h3>
<p><strong>Box modeling</strong> starts from a simple primitive (usually a cube) and progressively refines it — extruding, bevelling and adding edge loops — until the rough form appears, then adding detail. It is the most common workflow for characters, vehicles and props because it keeps a clean, mostly-quad mesh.</p>
<h3>Subdivision surfaces</h3>
<p>A <strong>subdivision surface</strong> takes a low-poly "cage" and smooths it into a high-resolution surface using the <strong>Catmull-Clark</strong> algorithm. You model a light cage; the software computes the smooth result — you can toggle between them at any time.</p>
<pre><code>Subdivision workflow:
  1. Build a low-poly control cage (all quads)
  2. Preview smooth  (Maya: press 3 | Blender: Subdiv modifier)
  3. Sharpen edges by adding SUPPORT / HOLDING edge loops
     (edges close together = the crease stays crisp)
  4. Loose loops = soft, rounded edges
</code></pre>
<h3>Edge loops</h3>
<p>An <strong>edge loop</strong> is a continuous ring of edges. Loops control where detail and deformation happen — placing them well is the core skill of subdivision modeling.</p>
<div class="callout"><span class="badge">Support edges</span> To keep a corner sharp after smoothing, add a supporting loop right beside it. No support = the corner melts round. This "holding edge" idea is the heart of subdivision modeling.</div>`,
    `<span class="eyebrow">ANM313 · Chương 3 · Bài 3.1</span>
<h2>Box modeling &amp; subdivision surface</h2>
<h3>Box modeling</h3>
<p><strong>Box modeling</strong> bắt đầu từ một primitive đơn giản (thường là cube) rồi tinh chỉnh dần — extrude, bevel và thêm edge loop — cho tới khi ra hình thô, sau đó thêm chi tiết. Đây là quy trình phổ biến nhất cho nhân vật, phương tiện và đạo cụ vì giữ mesh sạch, chủ yếu là quad.</p>
<h3>Subdivision surface</h3>
<p><strong>Subdivision surface</strong> lấy một "lồng" (cage) ít mặt và làm mượt thành bề mặt độ phân giải cao bằng thuật toán <strong>Catmull-Clark</strong>. Bạn model một cage nhẹ; phần mềm tính ra kết quả mượt — có thể bật/tắt giữa hai chế độ bất cứ lúc nào.</p>
<pre><code>Quy trình subdivision:
  1. Dựng cage điều khiển ít mặt (toàn quad)
  2. Xem trước mượt (Maya: bấm 3 | Blender: modifier Subdiv)
  3. Làm sắc cạnh bằng SUPPORT / HOLDING edge loop
     (hai cạnh sát nhau = nếp gấp giữ được độ sắc)
  4. Vòng thưa = cạnh mềm, bo tròn
</code></pre>
<h3>Edge loop</h3>
<p><strong>Edge loop</strong> là một vòng cạnh liên tục. Loop quyết định nơi có chi tiết và nơi biến dạng — đặt loop tốt là kỹ năng cốt lõi của subdivision modeling.</p>
<div class="callout"><span class="badge">Support edge</span> Muốn góc còn sắc sau khi smooth, thêm một loop đỡ ngay sát nó. Không có loop đỡ = góc bị bo tròn ra. Ý tưởng "holding edge" này là trái tim của subdivision modeling.</div>`,
  ]]);

const c3q = quiz('anm313-quiz-3', 'Quiz 3 — Box modeling & subdivision|||Quiz 3 — Box modeling & subdivision', [
  { id: 'q1', question: 'Box modeling thường bắt đầu từ?', options: ['Một tấm phẳng chi tiết cao', 'Một primitive đơn giản (thường cube) rồi tinh chỉnh dần', 'Một bản scan 3D', 'Một đường cong NURBS'], correctIndex: 1, explanation: 'Box modeling bắt đầu từ khối đơn giản rồi extrude/bevel/thêm loop dần.' },
  { id: 'q2', question: 'Thuật toán làm mượt bề mặt subdivision phổ biến là?', options: ['Ray marching', 'Catmull-Clark', 'Gouraud', 'Phong'], correctIndex: 1, explanation: 'Catmull-Clark là thuật toán subdivision surface tiêu chuẩn.' },
  { id: 'q3', question: 'Để giữ một góc còn sắc sau khi smooth subdivision, ta?', options: ['Xoá bớt cạnh quanh góc', 'Thêm support/holding edge loop sát góc', 'Chuyển góc thành n-gon', 'Tăng độ phân giải texture'], correctIndex: 1, explanation: 'Loop đỡ sát cạnh giữ nếp gấp sắc; thiếu nó góc sẽ bị bo tròn.' },
]);

const c4 = doc('anm313-4-1-topology-uv', '4.1 — Topology & UV unwrapping|||4.1 — Topology & trải UV',
  'Topology sạch (flow của edge loop, tránh cực/ngôi sao), tam giác/n-gon; UV unwrapping (seam, unfold), UV layout & texel density, UV cho game vs phim.',
  [[
    `<span class="eyebrow">ANM313 · Chapter 4 · Lesson 4.1</span>
<h2>Topology &amp; UV unwrapping</h2>
<h3>Clean topology</h3>
<p><strong>Topology</strong> is how the polygons are arranged. Good topology means <strong>even quads that follow the form and its deformation</strong> — edge loops flowing around joints, mouths and other bending areas. Avoid dense clusters, long thin faces, and high-valence <strong>poles</strong> (a vertex with 5+ edges) in places that bend.</p>
<h3>UV unwrapping</h3>
<p>A <strong>UV map</strong> is the 3D surface flattened onto a 2D square (U and V are the 2D axes). Without UVs, a texture cannot be placed correctly. You cut <strong>seams</strong> and let the tool <strong>unfold</strong> the shell flat, then arrange the pieces.</p>
<pre><code>UV unwrapping steps:
  1. Mark seams  (hide them in cavities / where they meet naturally)
  2. Unfold      -> flatten each shell with minimal stretch
  3. Check the checker map (even squares = even texel density)
  4. Pack shells into the 0-1 UV square, no overlaps (unless intended)
  5. Keep consistent TEXEL DENSITY across objects in a scene
</code></pre>
<div class="callout"><span class="badge">Games vs film</span> Game UVs must pack tightly and share texture space (atlas, trim sheets) to save memory. Film UVs can spread across multiple UDIM tiles for maximum resolution. Same tool, different budget.</div>`,
    `<span class="eyebrow">ANM313 · Chương 4 · Bài 4.1</span>
<h2>Topology &amp; trải UV</h2>
<h3>Topology sạch</h3>
<p><strong>Topology</strong> là cách sắp xếp các polygon. Topology tốt nghĩa là <strong>quad đều, chạy theo hình khối và theo biến dạng</strong> — edge loop chạy vòng quanh khớp, miệng và các vùng gập. Tránh cụm mặt dày, mặt dài mảnh, và <strong>pole/cực</strong> bậc cao (đỉnh có từ 5 cạnh) ở nơi bị gập.</p>
<h3>Trải UV (UV unwrapping)</h3>
<p><strong>UV map</strong> là bề mặt 3D được làm phẳng lên một hình vuông 2D (U và V là hai trục 2D). Không có UV thì texture không đặt đúng được. Bạn cắt <strong>seam (đường ráp)</strong> và để công cụ <strong>unfold</strong> mảnh ra phẳng, rồi sắp xếp các mảnh.</p>
<pre><code>Các bước trải UV:
  1. Đánh dấu seam (giấu vào khe / nơi ráp tự nhiên)
  2. Unfold      -> làm phẳng từng shell, giãn tối thiểu
  3. Kiểm bằng map ô caro (ô đều = texel density đều)
  4. Xếp shell vào ô UV 0-1, không chồng (trừ khi cố ý)
  5. Giữ TEXEL DENSITY nhất quán giữa các vật trong scene
</code></pre>
<div class="callout"><span class="badge">Game vs phim</span> UV game phải xếp khít và chia sẻ không gian texture (atlas, trim sheet) để tiết kiệm bộ nhớ. UV phim có thể trải trên nhiều ô UDIM để đạt độ phân giải tối đa. Cùng công cụ, khác ngân sách.</div>`,
  ]]);

const c4q = quiz('anm313-quiz-4', 'Quiz 4 — Topology & UV|||Quiz 4 — Topology & UV', [
  { id: 'q1', question: 'Topology tốt cho model sẽ animate nghĩa là?', options: ['Càng nhiều tam giác càng tốt', 'Quad đều chạy theo hình khối và theo vùng biến dạng', 'Toàn n-gon lớn cho nhẹ', 'Không cần edge loop'], correctIndex: 1, explanation: 'Edge loop chạy theo hình và theo chuyển động cho deform mượt.' },
  { id: 'q2', question: 'UV map là gì?', options: ['Bản đồ ánh sáng của scene', 'Bề mặt 3D được làm phẳng lên hình vuông 2D để đặt texture', 'Danh sách vật liệu', 'Bộ xương của nhân vật'], correctIndex: 1, explanation: 'UV là toạ độ 2D (U,V) trải bề mặt 3D ra phẳng cho texture.' },
  { id: 'q3', question: 'Đường "seam" trong trải UV nên đặt ở đâu?', options: ['Ngay giữa mặt trước, dễ thấy', 'Ở khe/nơi khuất, để giấu đường ráp', 'Chồng lên nhau càng nhiều càng tốt', 'Không cần seam'], correctIndex: 1, explanation: 'Giấu seam ở nơi khuất giúp đường nối texture ít lộ.' },
]);

const c5 = doc('anm313-5-1-materials-shaders', '5.1 — Materials, texture & shaders|||5.1 — Vật liệu, texture & shader',
  'Vật liệu vs texture, mô hình PBR (base color, roughness, metallic, normal), các loại map (albedo/normal/roughness/AO), shader node & texture painting.',
  [[
    `<span class="eyebrow">ANM313 · Chapter 5 · Lesson 5.1</span>
<h2>Materials, texture &amp; shaders</h2>
<h3>Material vs texture vs shader</h3>
<ul>
<li><strong>Shader</strong> — the program that computes how a surface reacts to light.</li>
<li><strong>Material</strong> — a shader with its values set (this metal, that plastic).</li>
<li><strong>Texture</strong> — an image feeding a material property (colour, roughness...).</li>
</ul>
<h3>PBR — physically based rendering</h3>
<p>Modern shading is <strong>PBR</strong>: surfaces are described with physically meaningful inputs so they look right under any lighting. The core maps:</p>
<pre><code>PBR texture maps:
  Base Color / Albedo -> the pure surface colour (no shadows baked in)
  Roughness           -> matte (1.0) to mirror-smooth (0.0)
  Metallic            -> is it metal (1) or non-metal / dielectric (0)?
  Normal              -> fakes fine bumps without extra geometry
  Ambient Occlusion   -> soft contact shadows in crevices
  Height / Displace   -> real depth (displaces geometry)
</code></pre>
<h3>Node-based shaders</h3>
<p>In Maya (Hypershade), Blender (Shader Editor) and 3ds Max you connect <strong>nodes</strong> — a texture node into the base-color input, a bump node into normal, and so on — to build any surface. Textures come from photos, procedural noise, or painting directly on the model (Substance Painter, Blender texture paint).</p>
<div class="callout"><span class="badge">Albedo has no light</span> The base-color map must contain <em>only</em> colour — no baked shadows or highlights. Lighting is the renderer's job; baking it into albedo makes the asset look flat and wrong under new lights.</div>`,
    `<span class="eyebrow">ANM313 · Chương 5 · Bài 5.1</span>
<h2>Vật liệu, texture &amp; shader</h2>
<h3>Material vs texture vs shader</h3>
<ul>
<li><strong>Shader</strong> — chương trình tính cách bề mặt phản ứng với ánh sáng.</li>
<li><strong>Material (vật liệu)</strong> — một shader đã đặt giá trị (kim loại này, nhựa kia).</li>
<li><strong>Texture</strong> — ảnh cấp cho một thuộc tính vật liệu (màu, roughness...).</li>
</ul>
<h3>PBR — render dựa trên vật lý</h3>
<p>Shading hiện đại là <strong>PBR</strong>: bề mặt được mô tả bằng thông số có ý nghĩa vật lý nên trông đúng dưới mọi ánh sáng. Các map cốt lõi:</p>
<pre><code>Các map texture PBR:
  Base Color / Albedo -> màu bề mặt thuần (không bake bóng vào)
  Roughness           -> mờ (1.0) đến bóng như gương (0.0)
  Metallic            -> là kim loại (1) hay phi kim / dielectric (0)?
  Normal              -> giả lồi lõm nhỏ mà không thêm geometry
  Ambient Occlusion   -> bóng tiếp xúc mềm trong khe
  Height / Displace   -> độ sâu thật (đùn geometry)
</code></pre>
<h3>Shader dạng node</h3>
<p>Trong Maya (Hypershade), Blender (Shader Editor) và 3ds Max bạn nối các <strong>node</strong> — node texture vào ô base-color, node bump vào normal, v.v. — để dựng bất kỳ bề mặt nào. Texture lấy từ ảnh chụp, noise thủ tục, hoặc vẽ thẳng lên model (Substance Painter, texture paint của Blender).</p>
<div class="callout"><span class="badge">Albedo không chứa ánh sáng</span> Map base-color phải chứa <em>chỉ</em> màu — không bake bóng hay highlight vào. Chiếu sáng là việc của renderer; bake nó vào albedo làm asset trông bẹt và sai dưới ánh sáng mới.</div>`,
  ]]);

const c5q = quiz('anm313-quiz-5', 'Quiz 5 — Materials & shaders|||Quiz 5 — Vật liệu & shader', [
  { id: 'q1', question: 'Trong PBR, map "Roughness" điều khiển?', options: ['Màu bề mặt', 'Độ mờ/bóng của bề mặt (matte đến như gương)', 'Độ trong suốt', 'Toạ độ UV'], correctIndex: 1, explanation: 'Roughness quyết định bề mặt mờ (1.0) hay bóng như gương (0.0).' },
  { id: 'q2', question: 'Map nào "giả lồi lõm nhỏ mà không thêm geometry"?', options: ['Base Color', 'Normal map', 'Metallic', 'Ambient Occlusion'], correctIndex: 1, explanation: 'Normal map bẻ hướng pháp tuyến để giả chi tiết bề mặt.' },
  { id: 'q3', question: 'Map Base Color / Albedo nên chứa?', options: ['Cả bóng và highlight đã bake sẵn', 'Chỉ màu thuần, không bake ánh sáng', 'Thông tin độ sâu', 'Bản đồ UV'], correctIndex: 1, explanation: 'Albedo chỉ chứa màu; ánh sáng do renderer tính, không bake vào.' },
]);

const c6 = doc('anm313-6-1-lighting-camera', '6.1 — Lighting & cameras|||6.1 — Ánh sáng & camera',
  'Các loại đèn (point/directional/spot/area), three-point lighting, HDRI & image-based lighting; camera 3D (focal length, DOF, composition), exposure.',
  [[
    `<span class="eyebrow">ANM313 · Chapter 6 · Lesson 6.1</span>
<h2>Lighting &amp; cameras</h2>
<h3>Light types</h3>
<ul>
<li><strong>Point</strong> — a bulb radiating in all directions.</li>
<li><strong>Directional / Sun</strong> — parallel rays from infinitely far (sunlight).</li>
<li><strong>Spot</strong> — a cone, like a stage light.</li>
<li><strong>Area</strong> — a glowing panel; soft, realistic shadows (softbox).</li>
</ul>
<h3>Three-point lighting</h3>
<pre><code>Classic setup:
  Key light   -> main light, sets the mood and shadows (strongest)
  Fill light  -> softens/opens shadows on the opposite side (weaker)
  Rim / back  -> edge highlight to separate subject from background
</code></pre>
<p><strong>HDRI / image-based lighting</strong> wraps the scene in a 360 photo so the whole environment lights and reflects into the model — the fastest route to realistic light.</p>
<h3>Cameras</h3>
<ul>
<li><strong>Focal length</strong> — low mm (wide, exaggerated perspective) vs high mm (telephoto, flatter). ~35-50mm reads natural.</li>
<li><strong>Depth of field (DOF)</strong> — blurs foreground/background to focus attention.</li>
<li><strong>Composition</strong> — rule of thirds, leading lines; frame the shot deliberately.</li>
</ul>
<div class="callout"><span class="badge">Light tells the story</span> Modeling defines the shape, but light defines the mood and reveals form. A great model badly lit looks flat; a simple model lit well looks finished.</div>`,
    `<span class="eyebrow">ANM313 · Chương 6 · Bài 6.1</span>
<h2>Ánh sáng &amp; camera</h2>
<h3>Các loại đèn</h3>
<ul>
<li><strong>Point</strong> — bóng đèn toả mọi hướng.</li>
<li><strong>Directional / Sun</strong> — tia song song từ xa vô cực (ánh nắng).</li>
<li><strong>Spot</strong> — hình nón, như đèn sân khấu.</li>
<li><strong>Area</strong> — tấm phát sáng; bóng mềm, thực (softbox).</li>
</ul>
<h3>Chiếu sáng ba điểm</h3>
<pre><code>Bố trí kinh điển:
  Key light   -> đèn chính, tạo tâm trạng và bóng đổ (mạnh nhất)
  Fill light  -> làm mềm/mở bóng ở phía đối diện (yếu hơn)
  Rim / back  -> viền sáng tách chủ thể khỏi hậu cảnh
</code></pre>
<p><strong>HDRI / image-based lighting</strong> bọc scene bằng ảnh 360 để cả môi trường chiếu sáng và phản chiếu vào model — cách nhanh nhất để có ánh sáng thực.</p>
<h3>Camera</h3>
<ul>
<li><strong>Tiêu cự (focal length)</strong> — mm thấp (góc rộng, phối cảnh phóng đại) vs mm cao (tele, bẹt hơn). ~35-50mm trông tự nhiên.</li>
<li><strong>Độ sâu trường ảnh (DOF)</strong> — làm mờ tiền/hậu cảnh để dồn tiêu điểm.</li>
<li><strong>Bố cục</strong> — quy tắc một phần ba, đường dẫn; căn khung có chủ đích.</li>
</ul>
<div class="callout"><span class="badge">Ánh sáng kể chuyện</span> Modeling định hình khối, nhưng ánh sáng định tâm trạng và làm lộ hình. Model đẹp mà chiếu sáng dở trông bẹt; model đơn giản mà chiếu sáng tốt trông hoàn chỉnh.</div>`,
  ]]);

const c6q = quiz('anm313-quiz-6', 'Quiz 6 — Lighting & camera|||Quiz 6 — Ánh sáng & camera', [
  { id: 'q1', question: 'Trong three-point lighting, đèn nào mạnh nhất, tạo tâm trạng và bóng chính?', options: ['Fill light', 'Rim/back light', 'Key light', 'Ambient light'], correctIndex: 2, explanation: 'Key light là đèn chính, mạnh nhất, quyết định bóng đổ.' },
  { id: 'q2', question: 'HDRI / image-based lighting làm gì?', options: ['Thêm bộ xương cho model', 'Bọc scene bằng ảnh 360 để môi trường chiếu sáng và phản chiếu vào model', 'Nén file texture', 'Tạo edge loop'], correctIndex: 1, explanation: 'HDRI dùng ảnh 360 làm nguồn sáng/phản chiếu môi trường.' },
  { id: 'q3', question: 'Hiệu ứng "làm mờ tiền/hậu cảnh để dồn tiêu điểm" của camera gọi là?', options: ['Focal length', 'Depth of field (DOF)', 'Exposure', 'Field of view'], correctIndex: 1, explanation: 'DOF (độ sâu trường ảnh) làm mờ vùng ngoài tiêu điểm.' },
]);

const c7 = doc('anm313-7-1-rendering', '7.1 — Rendering: Arnold, Cycles, Eevee & render settings|||7.1 — Render: Arnold, Cycles, Eevee & thiết lập render',
  'Ray tracing/path tracing vs render thời gian thực; Arnold (Maya), Cycles & Eevee (Blender); samples/noise & denoise, render passes/AOV, resolution & output.',
  [[
    `<span class="eyebrow">ANM313 · Chapter 7 · Lesson 7.1</span>
<h2>Rendering &amp; render settings</h2>
<h3>How renderers work</h3>
<p><strong>Rendering</strong> turns the 3D scene into a final 2D image by simulating light. Two families:</p>
<ul>
<li><strong>Path tracing (offline)</strong> — traces many light rays per pixel for physical accuracy. Realistic but slow. Examples: <strong>Arnold</strong> (Maya), <strong>Cycles</strong> (Blender).</li>
<li><strong>Real-time / rasterization</strong> — approximates light instantly for interactive work. Example: <strong>Eevee</strong> (Blender), game engines.</li>
</ul>
<h3>Samples, noise &amp; denoise</h3>
<pre><code>The render quality dial:
  Low samples   -> fast, but grainy NOISE
  High samples  -> clean, but slow (time grows with samples)
  Denoiser      -> cleans remaining noise cheaply (OptiX, OIDN)
  Rule: enough samples to be nearly clean, THEN denoise
</code></pre>
<h3>Render passes (AOVs)</h3>
<p>Instead of one flat image, render separate <strong>passes</strong> — diffuse, specular, shadow, ambient occlusion, depth (Z), object IDs — so compositing can adjust each independently. Set <strong>resolution</strong>, <strong>frame range</strong> and file format (EXR for compositing) before hitting render.</p>
<div class="callout"><span class="badge">Balance quality vs time</span> Every scene is a trade-off between render time and cleanliness. Use just enough samples plus a denoiser; render test frames small before committing to a full-resolution sequence.</div>`,
    `<span class="eyebrow">ANM313 · Chương 7 · Bài 7.1</span>
<h2>Render &amp; thiết lập render</h2>
<h3>Renderer hoạt động thế nào</h3>
<p><strong>Render</strong> biến scene 3D thành ảnh 2D cuối bằng cách mô phỏng ánh sáng. Hai họ:</p>
<ul>
<li><strong>Path tracing (offline)</strong> — bắn nhiều tia sáng mỗi pixel để chính xác vật lý. Thực nhưng chậm. Ví dụ: <strong>Arnold</strong> (Maya), <strong>Cycles</strong> (Blender).</li>
<li><strong>Thời gian thực / rasterization</strong> — xấp xỉ ánh sáng tức thì để làm tương tác. Ví dụ: <strong>Eevee</strong> (Blender), game engine.</li>
</ul>
<h3>Samples, noise &amp; denoise</h3>
<pre><code>Núm chỉnh chất lượng render:
  Ít samples    -> nhanh, nhưng NHIỄU hạt
  Nhiều samples -> sạch, nhưng chậm (thời gian tăng theo samples)
  Denoiser      -> khử nhiễu còn lại rẻ tiền (OptiX, OIDN)
  Nguyên tắc: đủ samples cho gần sạch, RỒI mới denoise
</code></pre>
<h3>Render passes (AOV)</h3>
<p>Thay vì một ảnh bẹt, render các <strong>pass</strong> riêng — diffuse, specular, bóng, ambient occlusion, độ sâu (Z), object ID — để compositing chỉnh từng phần độc lập. Đặt <strong>độ phân giải</strong>, <strong>dải khung hình</strong> và định dạng file (EXR để compositing) trước khi bấm render.</p>
<div class="callout"><span class="badge">Cân chất lượng vs thời gian</span> Mỗi scene là đánh đổi giữa thời gian render và độ sạch. Dùng vừa đủ samples cộng denoiser; render thử khung nhỏ trước khi cam kết cả chuỗi ở độ phân giải đầy.</div>`,
  ]]);

const c7q = quiz('anm313-quiz-7', 'Quiz 7 — Rendering|||Quiz 7 — Render', [
  { id: 'q1', question: 'Renderer nào thuộc họ path tracing (offline, chính xác vật lý)?', options: ['Eevee', 'Arnold và Cycles', 'Chỉ rasterizer game engine', 'Không có cái nào'], correctIndex: 1, explanation: 'Arnold (Maya) và Cycles (Blender) là path tracer; Eevee là thời gian thực.' },
  { id: 'q2', question: 'Khi để samples quá thấp, ảnh render thường bị?', options: ['Quá sáng', 'Nhiễu hạt (noise)', 'Mất UV', 'Sai topology'], correctIndex: 1, explanation: 'Ít samples → nhiễu; tăng samples hoặc denoise để làm sạch.' },
  { id: 'q3', question: 'Render passes / AOV dùng để?', options: ['Giảm số polygon', 'Tách ảnh thành các lớp (diffuse, bóng, độ sâu...) để compositing chỉnh riêng', 'Tạo bộ xương', 'Trải UV tự động'], correctIndex: 1, explanation: 'AOV xuất từng thành phần riêng để tinh chỉnh độc lập khi comp.' },
]);

const c8 = doc('anm313-8-1-export-optimize-pipeline', '8.1 — Export, scene optimization & pipeline integration|||8.1 — Xuất file, tối ưu scene & tích hợp pipeline',
  'Định dạng xuất (FBX/OBJ/glTF/USD/Alembic), tối ưu scene (poly count, LOD, bake normal, gộp material), và tích hợp pipeline: rigging & animation cơ bản.',
  [[
    `<span class="eyebrow">ANM313 · Chapter 8 · Lesson 8.1</span>
<h2>Export, optimization &amp; pipeline integration</h2>
<h3>Export formats</h3>
<ul>
<li><strong>FBX</strong> — carries mesh, materials, rig &amp; animation; the game/engine workhorse.</li>
<li><strong>OBJ</strong> — simple static geometry + UVs (no animation).</li>
<li><strong>glTF / GLB</strong> — the web/real-time standard, PBR-friendly.</li>
<li><strong>USD</strong> — Pixar's scene-description format for large studio pipelines.</li>
<li><strong>Alembic</strong> — baked geometry cache for heavy simulation/animation.</li>
</ul>
<h3>Scene optimization</h3>
<pre><code>Optimization checklist before handoff:
  [ ] Polygon count within budget (game: low-poly + normal map)
  [ ] Bake high-poly detail into a NORMAL map on the low-poly
  [ ] LODs for distant objects (fewer polys far away)
  [ ] Merge / reuse materials; atlas textures
  [ ] Freeze transforms, delete history, name objects
  [ ] Correct scale &amp; up-axis for the target engine
</code></pre>
<h3>Rigging &amp; animation (integration)</h3>
<p>If an asset must move, it gets a <strong>rig</strong>: a <strong>skeleton</strong> of joints, then <strong>skinning</strong> (weight painting) that binds mesh vertices to those joints so they deform. Animators then set <strong>keyframes</strong> the renderer plays back. Clean topology and correct pivots from earlier chapters are what make rigging possible.</p>
<div class="callout"><span class="badge">Hand off a clean asset</span> The last job is discipline: sensible names, frozen transforms, deleted history, correct scale and axis. A tidy file is what lets the rest of the pipeline — and the next artist — build on your work.</div>`,
    `<span class="eyebrow">ANM313 · Chương 8 · Bài 8.1</span>
<h2>Xuất file, tối ưu &amp; tích hợp pipeline</h2>
<h3>Định dạng xuất</h3>
<ul>
<li><strong>FBX</strong> — mang mesh, vật liệu, rig &amp; animation; ngựa thồ của game/engine.</li>
<li><strong>OBJ</strong> — geometry tĩnh đơn giản + UV (không animation).</li>
<li><strong>glTF / GLB</strong> — chuẩn web/thời gian thực, thân thiện PBR.</li>
<li><strong>USD</strong> — định dạng mô tả scene của Pixar cho pipeline studio lớn.</li>
<li><strong>Alembic</strong> — cache geometry đã bake cho mô phỏng/animation nặng.</li>
</ul>
<h3>Tối ưu scene</h3>
<pre><code>Checklist tối ưu trước khi bàn giao:
  [ ] Số polygon trong ngân sách (game: low-poly + normal map)
  [ ] Bake chi tiết high-poly thành NORMAL map lên low-poly
  [ ] LOD cho vật ở xa (ít poly khi xa camera)
  [ ] Gộp / tái dùng material; atlas texture
  [ ] Freeze transform, xoá history, đặt tên đối tượng
  [ ] Đúng scale &amp; trục up cho engine đích
</code></pre>
<h3>Rigging &amp; animation (tích hợp)</h3>
<p>Nếu asset cần chuyển động, nó được <strong>rig</strong>: một <strong>bộ xương</strong> gồm các joint, rồi <strong>skinning</strong> (vẽ weight) buộc các vertex mesh vào joint để chúng biến dạng. Animator sau đó đặt <strong>keyframe</strong> để renderer phát lại. Topology sạch và pivot đúng từ các chương trước là thứ giúp rigging khả thi.</p>
<div class="callout"><span class="badge">Bàn giao asset sạch</span> Việc cuối là kỷ luật: đặt tên hợp lý, freeze transform, xoá history, đúng scale và trục. File gọn gàng là thứ để phần còn lại của pipeline — và người sau — dựng tiếp trên công của bạn.</div>`,
  ]]);

const c8q = quiz('anm313-quiz-8', 'Quiz 8 — Export & pipeline|||Quiz 8 — Xuất & pipeline', [
  { id: 'q1', question: 'Định dạng nào mang được mesh, vật liệu, rig VÀ animation, phổ biến cho game/engine?', options: ['OBJ', 'FBX', 'PNG', 'CSV'], correctIndex: 1, explanation: 'FBX mang cả rig và animation; OBJ chỉ geometry tĩnh + UV.' },
  { id: 'q2', question: 'Để game nhẹ mà vẫn nhiều chi tiết, ta thường?', options: ['Xuất thẳng model high-poly hàng triệu mặt', 'Bake chi tiết high-poly thành normal map lên bản low-poly', 'Bỏ hết UV', 'Tăng số samples render'], correctIndex: 1, explanation: 'Bake normal map giữ chi tiết bề mặt trên mesh ít mặt.' },
  { id: 'q3', question: 'Trong rigging, "skinning" (vẽ weight) làm gì?', options: ['Thêm texture màu da', 'Buộc các vertex mesh vào joint của bộ xương để chúng biến dạng theo', 'Chiếu sáng nhân vật', 'Xuất file FBX'], correctIndex: 1, explanation: 'Skinning gán trọng số vertex theo joint để mesh deform khi xương động.' },
]);

const taiLieu = doc('anm313-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách, tài liệu chính thức Maya/3ds Max/Blender, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">ANM313 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Visual Tool 3D — interface &amp; pipeline, modeling, topology &amp; UVs, materials, lighting and rendering — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ANM313 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Introducing Autodesk Maya</em> — Dariush Derakhshani (Sybex), the classic Maya primer.</li>
<li><em>Blender For Dummies</em> — Jason van Gumster, a friendly Blender start.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://docs.blender.org/manual/en/latest/" target="_blank" rel="noopener">Blender Manual (docs.blender.org)</a> — the complete official reference.</li>
<li><a href="https://help.autodesk.com/view/MAYAUL/ENU/" target="_blank" rel="noopener">Autodesk Maya Help</a> &amp; <a href="https://help.autodesk.com/view/3DSMAX/ENU/" target="_blank" rel="noopener">3ds Max Help</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@blender" target="_blank" rel="noopener">Blender (official)</a> — tutorials &amp; showcases.</li>
<li><a href="https://www.youtube.com/@blenderguru" target="_blank" rel="noopener">Blender Guru</a> — the famous "donut" beginner series.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.blender.org/download/" target="_blank" rel="noopener">Blender</a> — free &amp; open-source 3D suite.</li>
<li><a href="https://www.autodesk.com/education/edu-software/overview" target="_blank" rel="noopener">Autodesk Education</a> — free Maya &amp; 3ds Max for students.</li>
<li><a href="https://www.adobe.com/products/substance3d-painter.html" target="_blank" rel="noopener">Substance 3D Painter</a> — industry texture painting.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — interface, navigation, transforms and the 3D pipeline; model a few simple props.</li>
<li><strong>Practice</strong> — box-model a hard-surface object, keep clean quad topology, UV unwrap it.</li>
<li><strong>Go deeper</strong> — PBR materials, three-point lighting and rendering with Cycles/Arnold/Eevee.</li>
<li><strong>Job-ready</strong> — optimize (LODs, normal bakes), export FBX/glTF, and hand a tidy asset to a rig.</li>
</ol></div>`,
    `<span class="eyebrow">ANM313 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Công cụ dựng hình 3D — giao diện &amp; pipeline, modeling, topology &amp; UV, vật liệu, ánh sáng và render — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ANM313 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Introducing Autodesk Maya</em> — Dariush Derakhshani (Sybex), sách nhập môn Maya kinh điển.</li>
<li><em>Blender For Dummies</em> — Jason van Gumster, khởi đầu Blender dễ tiếp cận.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://docs.blender.org/manual/en/latest/" target="_blank" rel="noopener">Blender Manual (docs.blender.org)</a> — tài liệu tham khảo chính thức đầy đủ.</li>
<li><a href="https://help.autodesk.com/view/MAYAUL/ENU/" target="_blank" rel="noopener">Autodesk Maya Help</a> &amp; <a href="https://help.autodesk.com/view/3DSMAX/ENU/" target="_blank" rel="noopener">3ds Max Help</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@blender" target="_blank" rel="noopener">Blender (chính thức)</a> — hướng dẫn &amp; giới thiệu.</li>
<li><a href="https://www.youtube.com/@blenderguru" target="_blank" rel="noopener">Blender Guru</a> — loạt "bánh donut" cho người mới nổi tiếng.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.blender.org/download/" target="_blank" rel="noopener">Blender</a> — bộ công cụ 3D miễn phí &amp; mã nguồn mở.</li>
<li><a href="https://www.autodesk.com/education/edu-software/overview" target="_blank" rel="noopener">Autodesk Education</a> — Maya &amp; 3ds Max miễn phí cho sinh viên.</li>
<li><a href="https://www.adobe.com/products/substance3d-painter.html" target="_blank" rel="noopener">Substance 3D Painter</a> — vẽ texture chuẩn ngành.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền</strong> — giao diện, điều hướng, transform và pipeline 3D; model vài đạo cụ đơn giản.</li>
<li><strong>Luyện tập</strong> — box-model một vật hard-surface, giữ topology quad sạch, trải UV.</li>
<li><strong>Đào sâu</strong> — vật liệu PBR, chiếu sáng ba điểm và render bằng Cycles/Arnold/Eevee.</li>
<li><strong>Sẵn sàng đi làm</strong> — tối ưu (LOD, bake normal), xuất FBX/glTF, bàn giao asset gọn cho rig.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'ANM313',
    slug: 'anm313-visual-tool-3d',
    title: 'Visual Tool 3D',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ANM313.webp',
    shortDescription: 'Build 3D assets with Maya, Blender & 3ds Max — viewport & pipeline, polygon & box modeling, subdivision, topology & UV unwrapping, PBR materials, lighting, rendering (Arnold/Cycles/Eevee), export & optimization. Bilingual, with checklists & quizzes.|||Dựng hình 3D với Maya, Blender & 3ds Max — viewport & pipeline, polygon & box modeling, subdivision, topology & trải UV, vật liệu PBR, ánh sáng, render (Arnold/Cycles/Eevee), xuất & tối ưu. Song ngữ, có checklist & quiz.',
    description: 'Môn <strong>ANM313 — Visual Tool 3D</strong> (kỳ 5) dạy bạn <strong>dựng tài nguyên 3D</strong> bằng công cụ chuẩn ngành <strong>Maya, Blender &amp; 3ds Max</strong>. Từ <strong>giao diện &amp; pipeline</strong> → <strong>polygon &amp; box modeling</strong> → <strong>subdivision surface</strong> → <strong>topology &amp; trải UV</strong> → <strong>vật liệu PBR, texture &amp; shader</strong> → <strong>ánh sáng &amp; camera</strong> → <strong>render (Arnold/Cycles/Eevee)</strong> → <strong>xuất file, tối ưu &amp; tích hợp pipeline (rigging/animation)</strong>. Song ngữ, có checklist quy trình và quiz mỗi chương.',
    whatYouLearn: 'Giao diện/viewport/điều hướng &amp; pipeline 3D; polygon mesh (vertex/edge/face), extrude/bevel/inset; box modeling &amp; subdivision (Catmull-Clark, support edge); topology sạch &amp; trải UV (seam, texel density); vật liệu PBR (albedo/roughness/metallic/normal), shader node; đèn (point/spot/area), three-point lighting, HDRI, camera &amp; DOF; render Arnold/Cycles/Eevee, samples/denoise, AOV; xuất FBX/OBJ/glTF/USD, tối ưu (LOD, bake normal), rigging/animation cơ bản.',
    requirements: 'Biết dùng máy tính cơ bản và tư duy hình học không gian. Nên cài Blender (miễn phí) hoặc Maya/3ds Max (bản giáo dục Autodesk cho sinh viên).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu Maya/3ds Max/Blender, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Dựng hình 3D, ba phần mềm chủ lực, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Giao diện & pipeline|||Chapter 1 — Interface & pipeline', description: 'Viewport, điều hướng, hệ trục, pipeline 3D.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Modeling cơ bản|||Chapter 2 — Basic modeling', description: 'Polygon mesh, primitive, extrude/bevel/inset.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Box modeling & subdivision|||Chapter 3 — Box modeling & subdivision', description: 'Box modeling, Catmull-Clark, edge loop, support edge.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Topology & UV|||Chapter 4 — Topology & UV', description: 'Topology sạch, seam, unfold, texel density.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Vật liệu & shader|||Chapter 5 — Materials & shaders', description: 'PBR, albedo/roughness/metallic/normal, shader node.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Ánh sáng & camera|||Chapter 6 — Lighting & camera', description: 'Loại đèn, three-point, HDRI, camera & DOF.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Render|||Chapter 7 — Rendering', description: 'Arnold/Cycles/Eevee, samples/denoise, AOV.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Xuất & pipeline|||Chapter 8 — Export & pipeline', description: 'FBX/OBJ/glTF/USD, tối ưu, rigging/animation.', lessons: [c8, c8q] },
  ],
};
