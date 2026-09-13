/**
 * ANR402 — 3D Rigging. Dựng xương & điều khiển nhân vật 3D (Thiết kế mỹ thuật
 * số, kỳ 7, FPTU). Giáo trình: Tina O'Hailey "Rig it Right! Maya Animation
 * Rigging Concepts"; Cheney/Kerlow; Gnomon/Digital Tutors; Autodesk Maya &
 * Blender rigging docs. Song ngữ + node graph + ví dụ MEL/Python.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "&"→&amp;; "<"→&lt;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('anr402-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách rigging, tài liệu Autodesk/Blender chính thức, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">ANR402 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>3D character rigging</strong> — skeletons, skinning, controllers, IK/FK, facial rigs and pipeline handoff — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ANR402 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Rig it Right! Maya Animation Rigging Concepts</em> — Tina O'Hailey (the core reference for this course).</li>
<li><em>The Art of 3D Computer Animation and Effects</em> — Isaac Victor Kerlow.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://help.autodesk.com/view/MAYAUL/2024/ENU/" target="_blank" rel="noopener">Autodesk Maya Help — Rigging &amp; Skeletons</a></li>
<li><a href="https://docs.blender.org/manual/en/latest/animation/armatures/index.html" target="_blank" rel="noopener">Blender Manual — Armatures &amp; Rigging</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@Gnomon" target="_blank" rel="noopener">Gnomon</a> — professional rigging &amp; VFX lectures.</li>
<li><a href="https://www.youtube.com/@CGDive" target="_blank" rel="noopener">CGDive</a> — Blender rigging tutorials.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.autodesk.com/products/maya/" target="_blank" rel="noopener">Autodesk Maya</a> — industry-standard rigging (free education licence).</li>
<li><a href="https://www.blender.org/" target="_blank" rel="noopener">Blender</a> — free, open-source, full rigging &amp; Rigify.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — anatomy of motion, joints &amp; hierarchy, FK vs IK.</li>
<li><strong>Practice</strong> — skin a simple biped, paint weights until deformation is clean.</li>
<li><strong>Go deeper</strong> — controllers, constraints, facial blend shapes, advanced deformers.</li>
<li><strong>Job-ready</strong> — build a reusable auto-rig script and a clean handoff for game or film.</li>
</ol></div>`,
    `<span class="eyebrow">ANR402 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>rigging nhân vật 3D</strong> — skeleton, skinning, controller, IK/FK, facial rig và bàn giao pipeline — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ANR402 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Rig it Right! Maya Animation Rigging Concepts</em> — Tina O'Hailey (sách nền của môn).</li>
<li><em>The Art of 3D Computer Animation and Effects</em> — Isaac Victor Kerlow.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://help.autodesk.com/view/MAYAUL/2024/ENU/" target="_blank" rel="noopener">Autodesk Maya Help — Rigging &amp; Skeletons</a></li>
<li><a href="https://docs.blender.org/manual/en/latest/animation/armatures/index.html" target="_blank" rel="noopener">Blender Manual — Armatures &amp; Rigging</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@Gnomon" target="_blank" rel="noopener">Gnomon</a> — bài giảng rigging &amp; VFX chuyên nghiệp.</li>
<li><a href="https://www.youtube.com/@CGDive" target="_blank" rel="noopener">CGDive</a> — hướng dẫn rigging trong Blender.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.autodesk.com/products/maya/" target="_blank" rel="noopener">Autodesk Maya</a> — chuẩn ngành cho rigging (bản giáo dục miễn phí).</li>
<li><a href="https://www.blender.org/" target="_blank" rel="noopener">Blender</a> — miễn phí, mã nguồn mở, rigging đầy đủ &amp; Rigify.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — giải phẫu chuyển động, joint &amp; phân cấp, FK vs IK.</li>
<li><strong>Luyện tập</strong> — skin một biped đơn giản, sơn weight đến khi biến dạng sạch.</li>
<li><strong>Đào sâu</strong> — controller, constraint, facial blend shape, deformer nâng cao.</li>
<li><strong>Sẵn sàng đi làm</strong> — viết script auto-rig dùng lại được và bàn giao sạch cho game hay film.</li>
</ol></div>`,
  ]]);

const intro = doc('anr402-0-1-overview', 'Course overview: 3D Rigging|||Tổng quan: Dựng xương & điều khiển 3D',
  'Rigging là gì; vì sao model tĩnh cần "bộ xương ảo" để cử động; lộ trình: giải phẫu chuyển động → joint/hierarchy → FK/IK → skinning → controller → facial → deformer nâng cao → game vs film.',
  [[
    `<span class="eyebrow">ANR402 · Lesson 0.1 · Overview</span>
<h2>3D Rigging</h2>
<p class="lead">A 3D model is just a frozen sculpture. <strong>Rigging</strong> gives it a virtual skeleton and a set of controls so an animator can pose and move it — the essential bridge between <em>modeling</em> and <em>animation</em>.</p>
<h3>The three layers of a rig</h3>
<ul>
<li><strong>Skeleton</strong> — a hierarchy of joints that defines how the body bends.</li>
<li><strong>Skin</strong> — the binding that ties each mesh vertex to one or more joints (weights).</li>
<li><strong>Controls</strong> — the handles (curves, attributes) an animator actually touches, hiding the raw joints.</li>
</ul>
<h3>Roadmap</h3>
<p>Anatomy of motion &amp; rigging fundamentals → skeletons, joints &amp; hierarchy → FK vs IK → skinning &amp; weight painting → controllers, constraints &amp; custom attributes → facial rigging &amp; blend shapes → advanced deformers &amp; MEL/Python automation → game vs film rigs, optimization &amp; pipeline handoff. Bilingual, with node graphs and script examples in <strong>Maya</strong> and <strong>Blender</strong>.</p>`,
    `<span class="eyebrow">ANR402 · Bài 0.1 · Tổng quan</span>
<h2>Dựng xương &amp; điều khiển 3D</h2>
<p class="lead">Một model 3D chỉ là bức tượng bất động. <strong>Rigging</strong> gắn cho nó bộ xương ảo và bộ điều khiển để animator tạo dáng và cử động — cây cầu thiết yếu giữa <em>modeling</em> và <em>animation</em>.</p>
<h3>Ba lớp của một rig</h3>
<ul>
<li><strong>Skeleton (bộ xương)</strong> — phân cấp joint quy định cách cơ thể gập.</li>
<li><strong>Skin (da)</strong> — ràng buộc nối mỗi đỉnh mesh với một hay nhiều joint (weight).</li>
<li><strong>Controls (điều khiển)</strong> — các tay nắm (đường cong, thuộc tính) mà animator thực sự chạm vào, che đi joint thô.</li>
</ul>
<h3>Lộ trình</h3>
<p>Giải phẫu chuyển động &amp; cơ sở rigging → skeleton, joint &amp; phân cấp → FK vs IK → skinning &amp; weight painting → controller, constraint &amp; custom attribute → facial rigging &amp; blend shape → deformer nâng cao &amp; tự động hoá MEL/Python → rig game vs film, tối ưu &amp; bàn giao pipeline. Song ngữ, có node graph và ví dụ script trong <strong>Maya</strong> và <strong>Blender</strong>.</p>`,
  ]]);

const c1 = doc('anr402-1-1-fundamentals', '1.1 — Rigging fundamentals & anatomy of motion|||1.1 — Cơ sở rigging & giải phẫu chuyển động',
  'Rig là gì; pivot & transform (translate/rotate/scale); trục xoay; giải phẫu chuyển động (khớp bản lề vs khớp cầu); nguyên tắc "rig phục vụ animator".',
  [[
    `<span class="eyebrow">ANR402 · Chapter 1 · Lesson 1.1</span>
<h2>Rigging fundamentals &amp; anatomy of motion</h2>
<h3>Transforms — the atom of every rig</h3>
<p>Every object carries a <strong>transform</strong>: translate (position), rotate (orientation) and scale. Rotation happens around a <strong>pivot</strong>; place the pivot wrong and an elbow bends from the wrong point. Order of rotation (XYZ vs ZXY) matters and is a common source of <strong>gimbal lock</strong>.</p>
<h3>Anatomy of motion</h3>
<p>A rigger studies how the real body moves so the virtual skeleton mirrors it:</p>
<ul>
<li><strong>Hinge joints</strong> (elbow, knee) — rotate on <em>one</em> axis only.</li>
<li><strong>Ball joints</strong> (shoulder, hip) — rotate on all three axes.</li>
<li><strong>Compound</strong> (spine, wrist) — many small joints share the bend.</li>
</ul>
<pre><code>Golden rule: the rig serves the ANIMATOR.
  - Controls where the animator expects them
  - Sensible default pose (T-pose / A-pose)
  - No control does two confusing jobs
  - Zeroing all controls returns to bind pose
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> A technically correct rig that is awkward to pose will be abandoned. Usability is a feature, not a nicety.</div>`,
    `<span class="eyebrow">ANR402 · Chương 1 · Bài 1.1</span>
<h2>Cơ sở rigging &amp; giải phẫu chuyển động</h2>
<h3>Transform — hạt nhân của mọi rig</h3>
<p>Mọi đối tượng mang một <strong>transform</strong>: translate (vị trí), rotate (hướng) và scale. Phép xoay quay quanh một <strong>pivot</strong>; đặt pivot sai thì khuỷu tay gập từ điểm sai. Thứ tự xoay (XYZ vs ZXY) rất quan trọng và là nguồn gây <strong>gimbal lock</strong> phổ biến.</p>
<h3>Giải phẫu chuyển động</h3>
<p>Người rig nghiên cứu cách cơ thể thật cử động để bộ xương ảo phản chiếu đúng:</p>
<ul>
<li><strong>Khớp bản lề</strong> (khuỷu, gối) — chỉ xoay trên <em>một</em> trục.</li>
<li><strong>Khớp cầu</strong> (vai, hông) — xoay trên cả ba trục.</li>
<li><strong>Khớp phức hợp</strong> (cột sống, cổ tay) — nhiều joint nhỏ chia nhau độ gập.</li>
</ul>
<pre><code>Nguyên tắc vàng: rig PHỤC VỤ animator.
  - Đặt control đúng chỗ animator mong đợi
  - Dáng mặc định hợp lý (T-pose / A-pose)
  - Không control nào làm hai việc gây rối
  - Đưa mọi control về 0 là về lại bind pose
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Một rig đúng kỹ thuật nhưng khó tạo dáng sẽ bị bỏ. Dễ dùng là một tính năng, không phải phần thêm.</div>`,
  ]]);

const c1q = quiz('anr402-quiz-1', 'Quiz 1 — Fundamentals|||Quiz 1 — Cơ sở', [
  { id: 'q1', question: 'Rigging đóng vai trò gì trong pipeline 3D?', options: ['Vẽ texture cho model', 'Tạo bộ xương & điều khiển để model cử động', 'Render ảnh cuối', 'Dựng khối hình (modeling)'], correctIndex: 1, explanation: 'Rigging là cầu nối giữa modeling và animation: gắn xương ảo + control cho model.' },
  { id: 'q2', question: 'Khớp bản lề (hinge) như khuỷu tay xoay được trên mấy trục?', options: ['Một trục', 'Hai trục', 'Ba trục', 'Không trục nào'], correctIndex: 0, explanation: 'Khuỷu/gối là khớp bản lề — chỉ xoay trên một trục; vai/hông (khớp cầu) mới xoay 3 trục.' },
  { id: 'q3', question: 'Đặt pivot (tâm xoay) sai ở một joint sẽ gây ra gì?', options: ['Model đổi màu', 'Bộ phận gập từ điểm sai', 'Tăng số polygon', 'Mất texture'], correctIndex: 1, explanation: 'Phép xoay quay quanh pivot; pivot sai chỗ thì khớp gập từ vị trí không đúng.' },
]);

const c2 = doc('anr402-2-1-skeleton-hierarchy', '2.1 — Skeletons, joints & hierarchy|||2.1 — Skeleton, joint & phân cấp',
  'Joint & bone; phân cấp cha–con (parent/child); joint orientation & trục cục bộ; đặt tên & đối xứng; root joint và luồng biến đổi xuống cây.',
  [[
    `<span class="eyebrow">ANR402 · Chapter 2 · Lesson 2.1</span>
<h2>Skeletons, joints &amp; hierarchy</h2>
<h3>Joints and the parent–child chain</h3>
<p>A <strong>joint</strong> is a pivot point; a <strong>bone</strong> is just the visual link between two joints. Joints live in a <strong>hierarchy</strong>: rotating a parent carries every child with it — rotate the shoulder and the whole arm follows. Transforms flow <em>down</em> the tree from the <strong>root</strong>.</p>
<pre><code>root (COG / hips)
 └─ spine_01
     └─ spine_02
         └─ clavicle_L
             └─ shoulder_L
                 └─ elbow_L
                     └─ wrist_L
</code></pre>
<h3>Joint orientation &amp; naming</h3>
<ul>
<li><strong>Orient joints</strong> so one axis (often X) points down the bone — clean local axes make IK and rotation predictable.</li>
<li><strong>Name and side-tag</strong> everything (<code>arm_L</code>, <code>arm_R</code>) so scripts can mirror and animators can search.</li>
</ul>
<pre><code>// Maya MEL — create &amp; orient a joint chain
select -clear;
joint -p 0 10 0 -n "shoulder_L";
joint -p 3 10 0 -n "elbow_L";
joint -p 6 10 0 -n "wrist_L";
joint -e -oj xyz -ch -zso shoulder_L;
</code></pre>
<div class="callout"><span class="badge">Clean hierarchy = clean rig</span> A tidy, well-named, well-oriented skeleton makes every later step — skinning, IK, scripting — dramatically easier.</div>`,
    `<span class="eyebrow">ANR402 · Chương 2 · Bài 2.1</span>
<h2>Skeleton, joint &amp; phân cấp</h2>
<h3>Joint và chuỗi cha–con</h3>
<p>Một <strong>joint</strong> là điểm pivot; một <strong>bone</strong> chỉ là đoạn nối trực quan giữa hai joint. Joint sống trong một <strong>phân cấp</strong>: xoay cha thì mọi con đi theo — xoay vai thì cả cánh tay theo. Biến đổi chảy <em>xuống</em> cây từ <strong>root</strong>.</p>
<pre><code>root (COG / hông)
 └─ spine_01
     └─ spine_02
         └─ clavicle_L
             └─ shoulder_L
                 └─ elbow_L
                     └─ wrist_L
</code></pre>
<h3>Định hướng joint &amp; đặt tên</h3>
<ul>
<li><strong>Orient joint</strong> sao cho một trục (thường X) chỉ dọc theo bone — trục cục bộ sạch giúp IK và phép xoay dự đoán được.</li>
<li><strong>Đặt tên và gắn thẻ bên</strong> mọi thứ (<code>arm_L</code>, <code>arm_R</code>) để script mirror được và animator tìm được.</li>
</ul>
<pre><code>// Maya MEL — tạo &amp; orient một chuỗi joint
select -clear;
joint -p 0 10 0 -n "shoulder_L";
joint -p 3 10 0 -n "elbow_L";
joint -p 6 10 0 -n "wrist_L";
joint -e -oj xyz -ch -zso shoulder_L;
</code></pre>
<div class="callout"><span class="badge">Phân cấp sạch = rig sạch</span> Một skeleton gọn gàng, đặt tên tốt, orient đúng làm mọi bước sau — skinning, IK, scripting — dễ hơn hẳn.</div>`,
  ]]);

const c2q = quiz('anr402-quiz-2', 'Quiz 2 — Skeleton & hierarchy|||Quiz 2 — Skeleton & phân cấp', [
  { id: 'q1', question: 'Trong phân cấp joint, xoay joint cha thì các joint con sẽ?', options: ['Đứng yên', 'Đi theo joint cha', 'Bị xoá', 'Đổi tên'], correctIndex: 1, explanation: 'Biến đổi chảy xuống cây: xoay cha kéo theo mọi con (xoay vai → cả tay theo).' },
  { id: 'q2', question: 'Vì sao cần "orient joint" cho trục cục bộ dọc theo bone?', options: ['Để đổi màu bone', 'Để IK và phép xoay dự đoán được, sạch', 'Để giảm polygon', 'Để render nhanh hơn'], correctIndex: 1, explanation: 'Trục cục bộ nhất quán (X dọc bone) làm IK và rotation ổn định, dễ đoán.' },
  { id: 'q3', question: 'Quy ước đặt tên như arm_L / arm_R phục vụ điều gì?', options: ['Chỉ để đẹp', 'Để script mirror & animator tìm control', 'Để tăng weight', 'Không có tác dụng'], correctIndex: 1, explanation: 'Tên có thẻ bên giúp mirror bằng script và giúp animator tìm đúng control.' },
]);

const c3 = doc('anr402-3-1-fk-ik', '3.1 — Forward vs Inverse Kinematics|||3.1 — Forward vs Inverse Kinematics',
  'FK (xoay từng joint từ gốc ra ngọn) vs IK (đặt điểm cuối, solver tính các joint trung gian); pole vector; khi nào dùng FK, khi nào IK; IK/FK switch & blend.',
  [[
    `<span class="eyebrow">ANR402 · Chapter 3 · Lesson 3.1</span>
<h2>Forward vs Inverse Kinematics</h2>
<h3>Two ways to pose a limb</h3>
<ul>
<li><strong>FK (Forward Kinematics)</strong> — you rotate each joint from root to tip. Great arcs, natural for a waving arm; but the hand "floats" and won't stay planted.</li>
<li><strong>IK (Inverse Kinematics)</strong> — you place the end effector (the hand/foot) and a <strong>solver</strong> computes the in-between joint angles. Perfect when a foot must stay on the ground or a hand on a table.</li>
</ul>
<h3>The pole vector</h3>
<p>An IK chain is under-determined — the elbow could point many ways. A <strong>pole vector</strong> control tells the solver which direction the knee/elbow should aim.</p>
<pre><code>FK  -> rotate shoulder, then elbow, then wrist   (tip follows)
IK  -> move IK handle at wrist; solver back-solves shoulder+elbow
       pole vector -> aims the elbow

Rule of thumb:
  contact with world (feet, hands on prop) -> IK
  free arcs (waving, gesturing)            -> FK
</code></pre>
<div class="callout"><span class="badge">Best of both</span> Production arms/legs usually have an <strong>IK/FK switch</strong> — a custom attribute (0 = FK, 1 = IK) that blends between the two so the animator picks per shot.</div>`,
    `<span class="eyebrow">ANR402 · Chương 3 · Bài 3.1</span>
<h2>Forward vs Inverse Kinematics</h2>
<h3>Hai cách tạo dáng cho một chi</h3>
<ul>
<li><strong>FK (Forward Kinematics)</strong> — bạn xoay từng joint từ gốc ra ngọn. Cho cung chuyển động đẹp, tự nhiên với tay vẫy; nhưng bàn tay "trôi", không đứng yên tại chỗ được.</li>
<li><strong>IK (Inverse Kinematics)</strong> — bạn đặt điểm cuối (bàn tay/chân) và một <strong>solver</strong> tính góc các joint trung gian. Hoàn hảo khi chân phải bám đất hay tay phải tì lên bàn.</li>
</ul>
<h3>Pole vector</h3>
<p>Một chuỗi IK là thiếu ràng buộc — khuỷu có thể chỉ nhiều hướng. Control <strong>pole vector</strong> báo cho solver biết đầu gối/khuỷu nên hướng về đâu.</p>
<pre><code>FK  -> xoay vai, rồi khuỷu, rồi cổ tay   (ngọn đi theo)
IK  -> di chuyển IK handle ở cổ tay; solver giải ngược vai+khuỷu
       pole vector -> nhắm hướng khuỷu

Kinh nghiệm:
  chạm thế giới (chân, tay tì đạo cụ) -> IK
  cung tự do (vẫy, ra điệu bộ)        -> FK
</code></pre>
<div class="callout"><span class="badge">Lấy cả hai</span> Tay/chân trong sản xuất thường có <strong>IK/FK switch</strong> — một custom attribute (0 = FK, 1 = IK) blend giữa hai chế độ để animator chọn theo từng cảnh.</div>`,
  ]]);

const c3q = quiz('anr402-quiz-3', 'Quiz 3 — FK vs IK|||Quiz 3 — FK vs IK', [
  { id: 'q1', question: 'Muốn bàn chân nhân vật BÁM chặt xuống đất khi nhún, nên dùng?', options: ['FK', 'IK', 'Blend shape', 'Không cần rig'], correctIndex: 1, explanation: 'IK giữ điểm cuối (bàn chân) cố định tại chỗ, solver tự tính góc gối/hông.' },
  { id: 'q2', question: 'Pole vector trong một chuỗi IK dùng để?', options: ['Đổi màu joint', 'Quy định hướng của khuỷu/đầu gối', 'Tăng số joint', 'Xoá weight'], correctIndex: 1, explanation: 'Chuỗi IK thiếu ràng buộc về hướng khớp giữa; pole vector nhắm hướng đó.' },
  { id: 'q3', question: 'IK/FK switch (custom attribute 0/1) cho phép animator điều gì?', options: ['Blend giữa chế độ FK và IK theo từng cảnh', 'Render nhanh hơn', 'Tự sơn weight', 'Tạo texture'], correctIndex: 0, explanation: 'Switch blend giữa hai chế độ, để animator chọn IK hay FK phù hợp từng shot.' },
]);

const c4 = doc('anr402-4-1-skinning', '4.1 — Skinning & weight painting|||4.1 — Skinning & weight painting',
  'Bind skin (smooth/linear blend); weight = ảnh hưởng của joint lên đỉnh (tổng = 1, normalize); weight painting; lỗi biến dạng (candy-wrap, mất khối); max influences cho game.',
  [[
    `<span class="eyebrow">ANR402 · Chapter 4 · Lesson 4.1</span>
<h2>Skinning &amp; weight painting</h2>
<h3>Binding the mesh to the skeleton</h3>
<p><strong>Skinning</strong> (bind skin) attaches every mesh vertex to one or more joints. Each vertex holds <strong>weights</strong> — how much each joint pulls it. Weights on a vertex are <strong>normalized</strong> (they sum to 1.0), so a vertex 70% elbow / 30% wrist bends as a smooth blend.</p>
<h3>Weight painting</h3>
<p>Auto-bind is only a starting point. You <strong>paint weights</strong> to fix ugly deformation — greyscale where white = full influence, black = none.</p>
<pre><code>Common deformation problems:
  Candy-wrapper : elbow collapses/pinches when twisting
                  -> add a twist joint, spread weights
  Volume loss   : shoulder caves on lift
                  -> smooth weights, add corrective
  Rigid seam    : sharp crease at a joint
                  -> blur/average weights across the bend

Golden rule: weights per vertex must SUM TO 1.0 (normalize)
</code></pre>
<div class="callout"><span class="badge">Game vs film</span> Game engines cap <strong>influences per vertex</strong> (often 4). Prune small weights and re-normalize so the export matches the engine's limit.</div>`,
    `<span class="eyebrow">ANR402 · Chương 4 · Bài 4.1</span>
<h2>Skinning &amp; weight painting</h2>
<h3>Ràng mesh vào skeleton</h3>
<p><strong>Skinning</strong> (bind skin) gắn mỗi đỉnh mesh vào một hay nhiều joint. Mỗi đỉnh giữ <strong>weight</strong> — mức mỗi joint kéo nó. Weight trên một đỉnh được <strong>normalize</strong> (tổng = 1.0), nên đỉnh 70% khuỷu / 30% cổ tay gập theo một blend mượt.</p>
<h3>Weight painting</h3>
<p>Auto-bind chỉ là điểm khởi đầu. Bạn <strong>sơn weight</strong> để sửa biến dạng xấu — thang xám với trắng = ảnh hưởng đầy, đen = không.</p>
<pre><code>Các lỗi biến dạng thường gặp:
  Candy-wrapper : khuỷu bị bóp/xoắn khi vặn
                  -> thêm twist joint, dàn weight
  Mất khối      : vai lõm khi nâng tay
                  -> làm mượt weight, thêm corrective
  Nếp gấp cứng  : gãy sắc tại joint
                  -> blur/average weight qua chỗ gập

Nguyên tắc vàng: weight mỗi đỉnh phải TỔNG = 1.0 (normalize)
</code></pre>
<div class="callout"><span class="badge">Game vs film</span> Engine game giới hạn <strong>số influence mỗi đỉnh</strong> (thường 4). Cắt weight nhỏ và normalize lại để bản export khớp giới hạn của engine.</div>`,
  ]]);

const c4q = quiz('anr402-quiz-4', 'Quiz 4 — Skinning|||Quiz 4 — Skinning', [
  { id: 'q1', question: 'Tổng các weight của một đỉnh (vertex) sau normalize bằng bao nhiêu?', options: ['0', '0.5', '1.0', 'Tuỳ số joint'], correctIndex: 2, explanation: 'Weight mỗi đỉnh được normalize để tổng = 1.0 → blend mượt giữa các joint.' },
  { id: 'q2', question: 'Weight painting dùng để làm gì?', options: ['Vẽ texture màu da', 'Sửa biến dạng bằng cách chỉnh ảnh hưởng joint lên đỉnh', 'Tạo joint mới', 'Render bóng'], correctIndex: 1, explanation: 'Sơn weight (thang xám) tinh chỉnh mức mỗi joint kéo từng đỉnh để biến dạng đẹp.' },
  { id: 'q3', question: 'Vì sao rig cho GAME thường phải cắt bớt weight nhỏ mỗi đỉnh?', options: ['Để đổi màu', 'Vì engine giới hạn số influence mỗi đỉnh (vd 4)', 'Để tăng polygon', 'Để thêm blend shape'], correctIndex: 1, explanation: 'Engine game cap influence/đỉnh; prune weight nhỏ + normalize lại cho khớp giới hạn.' },
]);

const c5 = doc('anr402-5-1-controllers-constraints', '5.1 — Controllers, constraints & custom attributes|||5.1 — Controller, constraint & custom attribute',
  'Control curve (NURBS) thay cho joint thô; constraint (parent/point/orient/aim/scale); driven keys & set-driven-key; custom attribute (spin, IK/FK, finger curl); khoá & ẩn kênh thừa.',
  [[
    `<span class="eyebrow">ANR402 · Chapter 5 · Lesson 5.1</span>
<h2>Controllers, constraints &amp; custom attributes</h2>
<h3>Controls hide the machinery</h3>
<p>Animators should never select raw joints. Instead they grab <strong>control curves</strong> (NURBS shapes) that drive the joints through <strong>constraints</strong>.</p>
<ul>
<li><strong>Parent constraint</strong> — control drives both position &amp; rotation of a joint.</li>
<li><strong>Point / Orient</strong> — only position, or only rotation.</li>
<li><strong>Aim constraint</strong> — makes an object point at a target (eyes, gun barrel).</li>
</ul>
<h3>Custom attributes &amp; driven keys</h3>
<p>Add your own channels on a control — <code>IKFKSwitch</code>, <code>fingerCurl</code>, <code>spin</code> — and use <strong>set-driven-keys</strong> so one slider drives many joints.</p>
<pre><code># Maya Python — add an attribute &amp; parent-constrain a joint to a control
import maya.cmds as mc
mc.addAttr("hand_CTL", ln="fingerCurl", at="double", min=0, max=10, k=True)
mc.parentConstraint("hand_CTL", "wrist_L", mo=True)
# lock &amp; hide channels the animator should not touch
mc.setAttr("hand_CTL.sx", lock=True, keyable=False)
</code></pre>
<div class="callout"><span class="badge">Lock what you don't animate</span> Hide and lock unused channels (e.g. scale on an FK control) so the animator can't break the rig by accident.</div>`,
    `<span class="eyebrow">ANR402 · Chương 5 · Bài 5.1</span>
<h2>Controller, constraint &amp; custom attribute</h2>
<h3>Control che đi bộ máy</h3>
<p>Animator không bao giờ nên chọn joint thô. Thay vào đó họ nắm các <strong>control curve</strong> (hình NURBS) điều khiển joint qua <strong>constraint</strong>.</p>
<ul>
<li><strong>Parent constraint</strong> — control điều khiển cả vị trí lẫn phép xoay của joint.</li>
<li><strong>Point / Orient</strong> — chỉ vị trí, hoặc chỉ phép xoay.</li>
<li><strong>Aim constraint</strong> — bắt một vật luôn hướng về target (mắt, nòng súng).</li>
</ul>
<h3>Custom attribute &amp; driven key</h3>
<p>Thêm kênh riêng lên control — <code>IKFKSwitch</code>, <code>fingerCurl</code>, <code>spin</code> — và dùng <strong>set-driven-key</strong> để một thanh trượt điều khiển nhiều joint.</p>
<pre><code># Maya Python — thêm thuộc tính &amp; parent-constrain joint vào control
import maya.cmds as mc
mc.addAttr("hand_CTL", ln="fingerCurl", at="double", min=0, max=10, k=True)
mc.parentConstraint("hand_CTL", "wrist_L", mo=True)
# khoá &amp; ẩn các kênh animator không nên chạm
mc.setAttr("hand_CTL.sx", lock=True, keyable=False)
</code></pre>
<div class="callout"><span class="badge">Khoá thứ không animate</span> Ẩn và khoá các kênh không dùng (vd scale trên control FK) để animator không lỡ làm hỏng rig.</div>`,
  ]]);

const c5q = quiz('anr402-quiz-5', 'Quiz 5 — Controllers & constraints|||Quiz 5 — Controller & constraint', [
  { id: 'q1', question: 'Vì sao animator nên chọn control curve chứ không chọn joint thô?', options: ['Joint không xoay được', 'Control gom điều khiển gọn, an toàn, đúng chỗ; che joint', 'Để tăng polygon', 'Joint không hiển thị'], correctIndex: 1, explanation: 'Control curve là tay nắm thân thiện; joint được điều khiển gián tiếp qua constraint.' },
  { id: 'q2', question: 'Constraint nào bắt một vật LUÔN HƯỚNG về một target (vd mắt nhìn theo)?', options: ['Point constraint', 'Aim constraint', 'Scale constraint', 'Parent constraint'], correctIndex: 1, explanation: 'Aim constraint xoay vật để trục của nó luôn chỉ về target.' },
  { id: 'q3', question: 'Set-driven-key (driven key) cho phép làm gì?', options: ['Một thuộc tính điều khiển nhiều joint theo quan hệ đặt sẵn', 'Render tự động', 'Xoá skeleton', 'Vẽ texture'], correctIndex: 0, explanation: 'Một kênh (vd fingerCurl) drive nhiều joint co ngón theo quan hệ key đã đặt.' },
]);

const c6 = doc('anr402-6-1-facial-blendshapes', '6.1 — Facial rigging & blend shapes|||6.1 — Facial rigging & blend shape',
  'Blend shape (morph target) vs joint-based face; phoneme/viseme cho lip-sync; FACS & biểu cảm; combo/corrective shape; điều khiển mặt bằng slider/on-face control.',
  [[
    `<span class="eyebrow">ANR402 · Chapter 6 · Lesson 6.1</span>
<h2>Facial rigging &amp; blend shapes</h2>
<h3>Two approaches to the face</h3>
<ul>
<li><strong>Blend shapes</strong> (morph targets) — you sculpt a copy of the mesh for each expression (smile, blink, "oh") and blend between them 0–1. Precise, artist-friendly, the film standard.</li>
<li><strong>Joint-based</strong> — small joints for jaw, eyelids, lips. Cheaper to evaluate; common in games.</li>
</ul>
<h3>Building an expression set</h3>
<p>Base shapes on <strong>FACS</strong> (action units) and <strong>visemes</strong> (mouth shapes for phonemes) so the face can both emote and lip-sync.</p>
<pre><code>Blend shape channels (0..1):
  browRaise_L  jawOpen   smile_L   smile_R
  blink_L      blink_R   viseme_OO viseme_EE

Combination (corrective) shapes fix ugly overlaps:
  smile_L + jawOpen  -> add a corrective so the cheek
                        does not intersect the lip
</code></pre>
<div class="callout"><span class="badge">On-face controls</span> Put small draggable controls on the face itself (a dot on each corner of the mouth) so the animator poses expressions directly instead of hunting sliders.</div>`,
    `<span class="eyebrow">ANR402 · Chương 6 · Bài 6.1</span>
<h2>Facial rigging &amp; blend shape</h2>
<h3>Hai hướng làm khuôn mặt</h3>
<ul>
<li><strong>Blend shape</strong> (morph target) — bạn nặn một bản sao mesh cho mỗi biểu cảm (cười, chớp mắt, "ồ") và blend giữa chúng 0–1. Chính xác, thân thiện với hoạ sĩ, là chuẩn của film.</li>
<li><strong>Dựa trên joint</strong> — joint nhỏ cho hàm, mí mắt, môi. Tính toán nhẹ hơn; phổ biến trong game.</li>
</ul>
<h3>Dựng bộ biểu cảm</h3>
<p>Đặt các shape nền theo <strong>FACS</strong> (action unit) và <strong>viseme</strong> (khẩu hình cho âm vị) để mặt vừa biểu cảm vừa lip-sync được.</p>
<pre><code>Kênh blend shape (0..1):
  browRaise_L  jawOpen   smile_L   smile_R
  blink_L      blink_R   viseme_OO viseme_EE

Combo (corrective) sửa các chồng lấn xấu:
  smile_L + jawOpen  -> thêm corrective để má
                        không đâm xuyên môi
</code></pre>
<div class="callout"><span class="badge">Control trên mặt</span> Đặt các control nhỏ kéo được ngay trên mặt (một chấm ở mỗi khoé miệng) để animator tạo biểu cảm trực tiếp thay vì dò slider.</div>`,
  ]]);

const c6q = quiz('anr402-quiz-6', 'Quiz 6 — Facial & blend shapes|||Quiz 6 — Facial & blend shape', [
  { id: 'q1', question: 'Blend shape (morph target) hoạt động thế nào?', options: ['Thêm joint mới cho mặt', 'Nặn bản sao mesh cho mỗi biểu cảm rồi blend 0–1', 'Sơn weight lên da', 'Render nhiều lớp'], correctIndex: 1, explanation: 'Mỗi blend shape là một hình mesh đích; blend 0–1 để chuyển giữa các biểu cảm.' },
  { id: 'q2', question: 'Viseme trong facial rig phục vụ điều gì?', options: ['Đổi màu môi', 'Khẩu hình cho âm vị → lip-sync khớp lời thoại', 'Tăng số polygon', 'Khoá kênh scale'], correctIndex: 1, explanation: 'Viseme là khẩu hình ứng với âm vị, giúp mặt nhép miệng khớp thoại.' },
  { id: 'q3', question: 'Combination (corrective) shape sinh ra để?', options: ['Sửa biến dạng xấu khi hai shape kết hợp', 'Render bóng đổ', 'Tạo skeleton', 'Giảm weight'], correctIndex: 0, explanation: 'Khi hai shape chồng nhau gây lỗi (má đâm môi), corrective shape sửa lại.' },
]);

const c7 = doc('anr402-7-1-advanced-automation', '7.1 — Advanced rigs & script automation|||7.1 — Rig nâng cao & tự động hoá script',
  'Spline IK cho cột sống/đuôi; ribbon/NURBS surface cho biến dạng mượt; deformer (lattice, wire, blendshape, cluster); auto-rig bằng MEL/Python để tái sử dụng.',
  [[
    `<span class="eyebrow">ANR402 · Chapter 7 · Lesson 7.1</span>
<h2>Advanced rigs &amp; script automation</h2>
<h3>Beyond a basic biped</h3>
<ul>
<li><strong>Spline IK</strong> — drive a chain of spine/tail joints along a NURBS curve; move a few controls and the whole curve (and joints) flows smoothly.</li>
<li><strong>Ribbon rigs</strong> — a thin NURBS surface with follicles gives squash-and-stretch limbs and soft bends (great for cartoon arms, lips).</li>
<li><strong>Deformers</strong> — lattice, wire, cluster and blendShape reshape geometry on top of the skin for extra control.</li>
</ul>
<h3>Automate with scripts</h3>
<p>Riggers rarely place controls by hand across dozens of characters — they <strong>script</strong> repetitive rig steps.</p>
<pre><code># Maya Python — build a control on every joint in a chain
import maya.cmds as mc
for jnt in mc.ls(type="joint"):
    ctl = mc.circle(n=jnt + "_CTL", nr=(1,0,0))[0]
    grp = mc.group(ctl, n=jnt + "_CTL_GRP")
    mc.matchTransform(grp, jnt)
    mc.parentConstraint(ctl, jnt, mo=True)
</code></pre>
<div class="callout"><span class="badge">Write it once</span> An auto-rig script turns a two-day manual build into a repeatable minutes-long tool — and every character gets the exact same, debuggable rig.</div>`,
    `<span class="eyebrow">ANR402 · Chương 7 · Bài 7.1</span>
<h2>Rig nâng cao &amp; tự động hoá script</h2>
<h3>Vượt qua biped cơ bản</h3>
<ul>
<li><strong>Spline IK</strong> — điều khiển chuỗi joint cột sống/đuôi dọc theo một đường NURBS; chỉ cần vài control là cả đường cong (và joint) uốn mượt theo.</li>
<li><strong>Ribbon rig</strong> — một mặt NURBS mỏng với follicle cho chi squash-and-stretch và uốn mềm (rất hợp tay hoạt hình, môi).</li>
<li><strong>Deformer</strong> — lattice, wire, cluster và blendShape nắn hình học chồng lên skin để có thêm quyền điều khiển.</li>
</ul>
<h3>Tự động hoá bằng script</h3>
<p>Người rig hiếm khi đặt control bằng tay cho hàng chục nhân vật — họ <strong>viết script</strong> cho các bước lặp.</p>
<pre><code># Maya Python — dựng control cho mọi joint trong chuỗi
import maya.cmds as mc
for jnt in mc.ls(type="joint"):
    ctl = mc.circle(n=jnt + "_CTL", nr=(1,0,0))[0]
    grp = mc.group(ctl, n=jnt + "_CTL_GRP")
    mc.matchTransform(grp, jnt)
    mc.parentConstraint(ctl, jnt, mo=True)
</code></pre>
<div class="callout"><span class="badge">Viết một lần</span> Một script auto-rig biến việc dựng tay hai ngày thành công cụ chạy vài phút lặp lại được — và mọi nhân vật có rig y hệt, dễ debug.</div>`,
  ]]);

const c7q = quiz('anr402-quiz-7', 'Quiz 7 — Advanced & automation|||Quiz 7 — Nâng cao & tự động', [
  { id: 'q1', question: 'Spline IK phù hợp nhất để rig bộ phận nào?', options: ['Một khớp bản lề đơn', 'Chuỗi joint cột sống/đuôi uốn mượt theo đường cong', 'Một blend shape mặt', 'Một texture'], correctIndex: 1, explanation: 'Spline IK điều khiển chuỗi joint dài theo đường NURBS → uốn mượt cho cột sống/đuôi.' },
  { id: 'q2', question: 'Ribbon rig (mặt NURBS + follicle) hữu ích cho hiệu ứng nào?', options: ['Tăng polygon', 'Squash-and-stretch & uốn mềm cho chi', 'Render nhanh', 'Đổi tên joint'], correctIndex: 1, explanation: 'Ribbon cho biến dạng mềm, squash-and-stretch — hợp tay hoạt hình, môi.' },
  { id: 'q3', question: 'Lợi ích chính của việc viết script auto-rig (MEL/Python) là?', options: ['Rig đẹp hơn về màu', 'Lặp lại nhanh, nhất quán, dễ debug trên nhiều nhân vật', 'Giảm số joint', 'Tự render'], correctIndex: 1, explanation: 'Script biến các bước lặp thành công cụ chạy nhanh, cho rig đồng nhất và dễ sửa.' },
]);

const c8 = doc('anr402-8-1-game-vs-film-pipeline', '8.1 — Game vs film rigs, optimization & handoff|||8.1 — Rig game vs film, tối ưu & bàn giao',
  'Rig game (joint-only, ≤4 influence, không blendshape nặng, chạy real-time trong engine) vs rig film (nặng, blendshape, deformer); tối ưu; naming/clean-up & bàn giao pipeline (export FBX, bind pose, kiểm tra).',
  [[
    `<span class="eyebrow">ANR402 · Chapter 8 · Lesson 8.1</span>
<h2>Game vs film rigs, optimization &amp; handoff</h2>
<h3>Same character, two very different rigs</h3>
<ul>
<li><strong>Game rig</strong> — must run <em>real-time</em> in an engine (Unity/Unreal). Joint-based, few influences per vertex (≤4), no expensive deformers, limited joint count. What ships is baked animation on a lightweight skeleton.</li>
<li><strong>Film rig</strong> — evaluated offline, so it can be heavy: hundreds of joints, blend shapes, correctives, ribbon and muscle sims. Quality over speed.</li>
</ul>
<h3>Clean-up &amp; handoff</h3>
<pre><code>Handoff checklist:
  [ ] Rig zeroes to a clean bind pose
  [ ] Controls named &amp; side-tagged (…_L / …_R)
  [ ] No unused nodes / history; scene organized
  [ ] Influences within engine limit (game)
  [ ] Export test: FBX round-trips into the engine
  [ ] Delivered with a short "how to use" note
</code></pre>
<div class="callout"><span class="badge">The rig is a product</span> A rig is handed to animators or an engine team — treat it like software: named, documented, tested, and predictable. A rig no one can figure out is a failed rig.</div>`,
    `<span class="eyebrow">ANR402 · Chương 8 · Bài 8.1</span>
<h2>Rig game vs film, tối ưu &amp; bàn giao</h2>
<h3>Cùng một nhân vật, hai rig rất khác nhau</h3>
<ul>
<li><strong>Rig game</strong> — phải chạy <em>real-time</em> trong engine (Unity/Unreal). Dựa trên joint, ít influence mỗi đỉnh (≤4), không deformer đắt, số joint hạn chế. Thứ ship đi là animation đã bake trên skeleton nhẹ.</li>
<li><strong>Rig film</strong> — tính offline nên có thể nặng: hàng trăm joint, blend shape, corrective, ribbon và mô phỏng cơ. Chất lượng hơn tốc độ.</li>
</ul>
<h3>Dọn dẹp &amp; bàn giao</h3>
<pre><code>Checklist bàn giao:
  [ ] Rig về được bind pose sạch khi zero
  [ ] Control có tên &amp; thẻ bên (…_L / …_R)
  [ ] Không node/history thừa; scene gọn gàng
  [ ] Influence trong giới hạn engine (game)
  [ ] Thử export: FBX vào engine chạy đúng
  [ ] Kèm một ghi chú ngắn "cách dùng"
</code></pre>
<div class="callout"><span class="badge">Rig là một sản phẩm</span> Rig được giao cho animator hay đội engine — hãy coi nó như phần mềm: đặt tên, ghi chú, kiểm thử, dự đoán được. Một rig không ai hiểu là một rig thất bại.</div>`,
  ]]);

const c8q = quiz('anr402-quiz-8', 'Quiz 8 — Game vs film & handoff|||Quiz 8 — Game vs film & bàn giao', [
  { id: 'q1', question: 'Đặc điểm nào ĐÚNG với rig cho GAME (chạy real-time)?', options: ['Hàng trăm joint & blend shape nặng', 'Joint-based, ít influence mỗi đỉnh (≤4), không deformer đắt', 'Mô phỏng cơ bắp offline', 'Không cần skeleton'], correctIndex: 1, explanation: 'Rig game phải nhẹ để chạy real-time: joint-based, cap influence, tránh deformer đắt.' },
  { id: 'q2', question: 'Rig cho FILM có thể "nặng" hơn vì?', options: ['Được tính offline nên ưu tiên chất lượng', 'Engine giới hạn joint', 'Không có blend shape', 'Phải chạy 60fps'], correctIndex: 0, explanation: 'Film render offline → chấp nhận rig nặng (nhiều joint, blendshape, sim) đổi lấy chất lượng.' },
  { id: 'q3', question: 'Việc nào thuộc checklist BÀN GIAO một rig tốt?', options: ['Xoá hết joint trước khi giao', 'Rig zero về bind pose sạch, control đặt tên, thử export FBX', 'Tăng polygon tối đa', 'Bỏ đặt tên cho nhanh'], correctIndex: 1, explanation: 'Rig là sản phẩm: bind pose sạch, đặt tên, dọn history, kiểm export — mới bàn giao.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'ANR402',
    slug: 'anr402-3d-rigging',
    title: '3D Rigging',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ANR402.webp',
    shortDescription: 'Character rigging in Maya/Blender — skeletons & joint hierarchy, FK vs IK, skinning & weight painting, controllers & constraints, facial rigs & blend shapes, advanced deformers & MEL/Python, game vs film rigs & handoff. Bilingual, with quizzes.|||Dựng xương & điều khiển nhân vật 3D — skeleton & phân cấp joint, FK vs IK, skinning & weight paint, controller & constraint, facial rig & blend shape, deformer nâng cao & MEL/Python, rig game vs film & bàn giao. Song ngữ, có quiz.',
    description: 'Môn <strong>ANR402 — 3D Rigging</strong> (kỳ 7, ngành Thiết kế mỹ thuật số) dạy cách biến một model tĩnh thành nhân vật cử động được. Từ <strong>cơ sở rigging &amp; giải phẫu chuyển động</strong> → <strong>skeleton, joint &amp; phân cấp</strong> → <strong>FK vs IK</strong> → <strong>skinning &amp; weight painting</strong> → <strong>controller, constraint &amp; custom attribute</strong> → <strong>facial rigging &amp; blend shape</strong> → <strong>deformer nâng cao (spline IK, ribbon) &amp; tự động hoá MEL/Python</strong> → <strong>rig game vs film, tối ưu &amp; bàn giao pipeline</strong>. Bám giáo trình (Tina O\'Hailey — Rig it Right!, Kerlow, Gnomon, tài liệu Autodesk Maya &amp; Blender), song ngữ, có node graph, ví dụ script và quiz mỗi chương.',
    whatYouLearn: 'Transform/pivot &amp; giải phẫu chuyển động; joint, bone &amp; phân cấp cha–con; orient joint &amp; quy ước đặt tên; FK vs IK, pole vector, IK/FK switch; bind skin, weight painting &amp; normalize; control curve, parent/point/orient/aim constraint, driven key, custom attribute; blend shape, viseme &amp; corrective cho mặt; spline IK, ribbon, deformer &amp; auto-rig bằng MEL/Python; khác biệt rig game vs film, tối ưu &amp; checklist bàn giao.',
    requirements: 'Đã biết modeling 3D cơ bản trong Maya hoặc Blender. Cài Autodesk Maya (bản giáo dục) hoặc Blender (miễn phí).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách rigging, tài liệu Autodesk/Blender, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Rigging là gì, ba lớp của rig, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Cơ sở & giải phẫu chuyển động|||Chapter 1 — Fundamentals & anatomy', description: 'Transform, pivot, khớp, rig phục vụ animator.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Skeleton & phân cấp|||Chapter 2 — Skeleton & hierarchy', description: 'Joint, bone, cha–con, orient, đặt tên.', lessons: [c2, c2q] },
    { title: 'Chương 3 — FK vs IK|||Chapter 3 — FK vs IK', description: 'Forward/Inverse Kinematics, pole vector, switch.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Skinning & weight painting|||Chapter 4 — Skinning & weights', description: 'Bind skin, weight, sửa biến dạng, giới hạn game.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Controller & constraint|||Chapter 5 — Controllers & constraints', description: 'Control curve, constraint, driven key, custom attr.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Facial rig & blend shape|||Chapter 6 — Facial & blend shapes', description: 'Blend shape, viseme, FACS, corrective.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Rig nâng cao & tự động hoá|||Chapter 7 — Advanced & automation', description: 'Spline IK, ribbon, deformer, auto-rig script.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Rig game vs film & bàn giao|||Chapter 8 — Game vs film & handoff', description: 'Tối ưu, khác biệt game/film, checklist bàn giao.', lessons: [c8, c8q] },
  ],
};
