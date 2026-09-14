/**
 * CDR301 — 3D CAD Design for Robotics. Ngành Robotics & AI, kỳ 8 (FPTU).
 * Song ngữ VI+EN. Giáo trình: SolidWorks/Fusion 360/Inventor (tài liệu chính
 * thức), Engineering Design Graphics (Bertoline), Up and Running with Fusion
 * 360, Onshape Learning. 8 chương: cơ sở CAD → sketch → modeling khối rắn →
 * assembly → dung sai/GD&T & bản vẽ → chi tiết robot → mô phỏng/FEA → chế tạo.
 * Giữ NGUYÊN slug/semester/courseCode/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('cdr301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách, tài liệu chính thức miễn phí, YouTube, công cụ CAD, lộ trình tự học.',
  [[
    `<span class="eyebrow">CDR301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>3D CAD design for robotics</strong> — sketching, solid modeling, assemblies, tolerances, robot parts, simulation and manufacturing prep — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for CDR301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Engineering Design Graphics</em> — Bertoline &amp; Wiebe (sketching, projection, GD&amp;T).</li>
<li><em>Up and Running with Autodesk Fusion 360</em> — a hands-on modeling walkthrough.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://help.autodesk.com/view/fusion360/ENU/" target="_blank" rel="noopener">Autodesk Fusion 360 Help</a> — modeling, assemblies, simulation, CAM.</li>
<li><a href="https://help.solidworks.com/" target="_blank" rel="noopener">SolidWorks Help</a> — parts, mates, drawings.</li>
<li><a href="https://learn.onshape.com/" target="_blank" rel="noopener">Onshape Learning Center</a> — free browser CAD courses.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@LarsLive" target="_blank" rel="noopener">Lars Christensen</a> — Fusion 360 from zero.</li>
<li><a href="https://www.youtube.com/@ProductDesignOnline" target="_blank" rel="noopener">Product Design Online</a> — Fusion 360 tutorials.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.autodesk.com/products/fusion-360/" target="_blank" rel="noopener">Autodesk Fusion 360</a> — free for students; modeling + assembly + FEA + CAM.</li>
<li><a href="https://www.onshape.com/" target="_blank" rel="noopener">Onshape</a> — full CAD in the browser, free plan.</li>
<li><a href="https://www.freecad.org/" target="_blank" rel="noopener">FreeCAD</a> — open-source parametric CAD.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — coordinate systems, the sketch &amp; feature workflow, and design intent.</li>
<li><strong>Model</strong> — build parts from constrained sketches with extrude / revolve / sweep / loft.</li>
<li><strong>Assemble &amp; document</strong> — mate parts into mechanisms, add tolerances and drawings.</li>
<li><strong>Robot-ready</strong> — design joints and frames, simulate motion &amp; stress, export for 3D print / CNC.</li>
</ol></div>`,
    `<span class="eyebrow">CDR301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>thiết kế CAD 3D cho robot</strong> — vẽ phác, modeling khối rắn, lắp ráp, dung sai, chi tiết robot, mô phỏng và chuẩn bị chế tạo — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của CDR301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Engineering Design Graphics</em> — Bertoline &amp; Wiebe (vẽ phác, hình chiếu, GD&amp;T).</li>
<li><em>Up and Running with Autodesk Fusion 360</em> — học modeling qua thực hành.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://help.autodesk.com/view/fusion360/ENU/" target="_blank" rel="noopener">Autodesk Fusion 360 Help</a> — modeling, lắp ráp, mô phỏng, CAM.</li>
<li><a href="https://help.solidworks.com/" target="_blank" rel="noopener">SolidWorks Help</a> — chi tiết, mate, bản vẽ.</li>
<li><a href="https://learn.onshape.com/" target="_blank" rel="noopener">Onshape Learning Center</a> — khoá CAD trên trình duyệt, miễn phí.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@LarsLive" target="_blank" rel="noopener">Lars Christensen</a> — Fusion 360 từ số 0.</li>
<li><a href="https://www.youtube.com/@ProductDesignOnline" target="_blank" rel="noopener">Product Design Online</a> — hướng dẫn Fusion 360.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.autodesk.com/products/fusion-360/" target="_blank" rel="noopener">Autodesk Fusion 360</a> — miễn phí cho sinh viên; modeling + lắp ráp + FEA + CAM.</li>
<li><a href="https://www.onshape.com/" target="_blank" rel="noopener">Onshape</a> — CAD đầy đủ chạy trên trình duyệt, có gói miễn phí.</li>
<li><a href="https://www.freecad.org/" target="_blank" rel="noopener">FreeCAD</a> — CAD tham số mã nguồn mở.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — hệ toạ độ, quy trình sketch &amp; feature, và ý đồ thiết kế (design intent).</li>
<li><strong>Modeling</strong> — dựng chi tiết từ sketch đã ràng buộc bằng extrude / revolve / sweep / loft.</li>
<li><strong>Lắp ráp &amp; lập tài liệu</strong> — ghép chi tiết thành cơ cấu, thêm dung sai và bản vẽ.</li>
<li><strong>Sẵn sàng cho robot</strong> — thiết kế khớp và khung, mô phỏng chuyển động &amp; ứng suất, xuất file để in 3D / CNC.</li>
</ol></div>`,
  ]]);

const intro = doc('cdr301-0-1-overview', 'Course overview: 3D CAD design for robotics|||Tổng quan: Thiết kế CAD 3D cho robot',
  'CAD 3D là gì, dùng để làm gì trong robot; mô hình tham số & lịch sử feature; quy trình sketch → feature → assembly → drawing → chế tạo.',
  [[
    `<span class="eyebrow">CDR301 · Lesson 0.1 · Overview</span>
<h2>3D CAD design for robotics</h2>
<p class="lead">This course teaches you to turn an idea for a robot part into a precise <strong>3D digital model</strong> that can be assembled, simulated, and manufactured. You'll work in a parametric CAD tool (Fusion 360 / SolidWorks / Onshape) and follow the same workflow professional mechanical engineers use.</p>
<h3>What is 3D CAD?</h3>
<p><strong>CAD (Computer-Aided Design)</strong> replaces paper drawings with a 3D model the computer understands. <strong>Parametric</strong> CAD means the model is driven by dimensions and rules — change a number and the part rebuilds itself. Every model keeps a <strong>feature history</strong> (a timeline of the steps that built it), so any step can be edited later.</p>
<h3>Why it matters for robots</h3>
<p>A robot is a stack of mechanical parts — links, joints, brackets, gears, a chassis — that must fit together and move without colliding. CAD lets you design each part, check the fit virtually, verify motion, and hand off files to a 3D printer or CNC machine.</p>
<h3>The workflow — roadmap</h3>
<pre><code>Sketch (2D)  -> constrain &amp; dimension
   -> Feature (extrude / revolve / sweep / loft)  -> a solid part
   -> Assembly  -> mate parts into a mechanism
   -> Tolerances + Drawing  -> a documented design
   -> Simulation (motion + FEA)  -> verify it works &amp; is strong
   -> Export (STL / STEP)  -> 3D print / CNC / share
</code></pre>
<p>Chapters 1-8 walk this exact chain, from a single sketch to a manufacturable robot part.</p>`,
    `<span class="eyebrow">CDR301 · Bài 0.1 · Tổng quan</span>
<h2>Thiết kế CAD 3D cho robot</h2>
<p class="lead">Môn này dạy bạn biến ý tưởng về một chi tiết robot thành <strong>mô hình 3D</strong> chính xác — có thể lắp ráp, mô phỏng và chế tạo. Bạn làm việc trên công cụ CAD tham số (Fusion 360 / SolidWorks / Onshape) theo đúng quy trình mà kỹ sư cơ khí chuyên nghiệp dùng.</p>
<h3>CAD 3D là gì?</h3>
<p><strong>CAD (thiết kế có máy tính trợ giúp)</strong> thay bản vẽ giấy bằng mô hình 3D mà máy tính hiểu được. CAD <strong>tham số (parametric)</strong> nghĩa là mô hình được điều khiển bởi kích thước và quy tắc — đổi một con số thì chi tiết tự dựng lại. Mỗi mô hình giữ một <strong>lịch sử feature</strong> (dòng thời gian các bước dựng nên nó), nên bước nào cũng sửa lại được về sau.</p>
<h3>Vì sao quan trọng với robot</h3>
<p>Robot là một chồng chi tiết cơ khí — thanh nối, khớp, gá, bánh răng, khung — phải khớp vào nhau và chuyển động mà không va chạm. CAD cho bạn thiết kế từng chi tiết, kiểm tra độ khớp ảo, xác minh chuyển động, và xuất file cho máy in 3D hay máy CNC.</p>
<h3>Quy trình — lộ trình</h3>
<pre><code>Sketch (2D)  -> ràng buộc &amp; ghi kích thước
   -> Feature (extrude / revolve / sweep / loft)  -> một khối rắn
   -> Assembly  -> ghép chi tiết thành cơ cấu
   -> Dung sai + Bản vẽ  -> thiết kế đã lập tài liệu
   -> Mô phỏng (chuyển động + FEA)  -> kiểm nó chạy &amp; đủ bền
   -> Xuất (STL / STEP)  -> in 3D / CNC / chia sẻ
</code></pre>
<p>Chương 1-8 đi đúng chuỗi này, từ một bản sketch đến chi tiết robot chế tạo được.</p>`,
  ]]);

const c1 = doc('cdr301-1-1-cad-foundations', '1.1 — CAD foundations & mechanical design thinking|||1.1 — Cơ sở CAD 3D & tư duy thiết kế cơ khí',
  'Hệ toạ độ & mặt phẳng, mô hình tham số vs trực tiếp, cây feature/lịch sử, và design intent — thiết kế để sau này sửa được.',
  [[
    `<span class="eyebrow">CDR301 · Chapter 1 · Lesson 1.1</span>
<h2>CAD foundations &amp; design thinking</h2>
<h3>The 3D workspace</h3>
<p>Every CAD model lives in a <strong>coordinate system</strong>: three axes (X, Y, Z) meeting at the <strong>origin</strong>, and three default <strong>planes</strong> (Front / Top / Right). You draw 2D sketches <em>on</em> a plane or a flat face, then give them depth to become 3D.</p>
<h3>Parametric vs direct modeling</h3>
<ul>
<li><strong>Parametric (history-based)</strong> — the model is a recipe of steps driven by dimensions. Change a dimension and everything downstream updates. This is what you use for engineered parts.</li>
<li><strong>Direct modeling</strong> — push/pull geometry with no history. Fast for quick edits or fixing imported files, but no automatic rebuild.</li>
</ul>
<h3>Design intent</h3>
<p><strong>Design intent</strong> is building the model so it changes the way you <em>want</em> it to. Example: if a mounting hole must always stay 5 mm from an edge, dimension it <em>from that edge</em>, not from the origin — then widening the part keeps the hole in the right place.</p>
<pre><code>Feature-tree mindset:
  1. Sketch on a plane        (2D profile)
  2. Feature turns it 3D      (extrude / revolve ...)
  3. Add features in order    (holes, fillets, shells)
  4. History = editable       (double-click any step to change it)
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Model the part the way it would really be made or measured. A good feature tree is one a teammate can edit six months later without it breaking.</div>`,
    `<span class="eyebrow">CDR301 · Chương 1 · Bài 1.1</span>
<h2>Cơ sở CAD &amp; tư duy thiết kế</h2>
<h3>Không gian làm việc 3D</h3>
<p>Mỗi mô hình CAD nằm trong một <strong>hệ toạ độ</strong>: ba trục (X, Y, Z) gặp nhau tại <strong>gốc toạ độ (origin)</strong>, và ba <strong>mặt phẳng</strong> mặc định (Front / Top / Right). Bạn vẽ sketch 2D <em>trên</em> một mặt phẳng hoặc một mặt phẳng của khối, rồi tạo chiều sâu để thành 3D.</p>
<h3>Mô hình tham số vs trực tiếp</h3>
<ul>
<li><strong>Tham số (theo lịch sử)</strong> — mô hình là một chuỗi bước được điều khiển bởi kích thước. Đổi một kích thước thì mọi thứ phía sau cập nhật theo. Đây là cách dùng cho chi tiết kỹ thuật.</li>
<li><strong>Trực tiếp (direct)</strong> — kéo/đẩy hình học, không có lịch sử. Nhanh khi sửa gấp hoặc chỉnh file nhập vào, nhưng không tự dựng lại.</li>
</ul>
<h3>Ý đồ thiết kế (design intent)</h3>
<p><strong>Design intent</strong> là dựng mô hình sao cho nó thay đổi đúng theo cách bạn <em>muốn</em>. Ví dụ: nếu một lỗ bắt vít luôn phải cách mép 5 mm, hãy ghi kích thước <em>từ mép đó</em>, đừng ghi từ gốc toạ độ — khi nới rộng chi tiết, lỗ vẫn ở đúng chỗ.</p>
<pre><code>Tư duy cây feature:
  1. Sketch trên một mặt phẳng   (biên dạng 2D)
  2. Feature biến nó thành 3D    (extrude / revolve ...)
  3. Thêm feature theo thứ tự    (lỗ, bo góc, khoét vỏ)
  4. Lịch sử = sửa được          (bấm đúp bước nào cũng đổi được)
</code></pre>
<div class="callout"><span class="badge">Nguyên tắc</span> Hãy dựng chi tiết theo cách nó thật sự được gia công hoặc đo. Một cây feature tốt là cây mà nửa năm sau đồng đội mở ra sửa vẫn không vỡ.</div>`,
  ]]);

const c1q = quiz('cdr301-quiz-1', 'Quiz 1 — CAD foundations|||Quiz 1 — Cơ sở CAD', [
  { id: 'q1', question: 'Mô hình CAD "tham số" (parametric) có đặc điểm gì?', options: ['Không có kích thước', 'Được điều khiển bởi kích thước & lịch sử, đổi số thì tự dựng lại', 'Chỉ vẽ 2D', 'Không sửa lại được sau khi dựng'], correctIndex: 1, explanation: 'Parametric = mô hình theo lịch sử, đổi kích thước thì các bước phía sau tự cập nhật.' },
  { id: 'q2', question: 'Bạn vẽ sketch 2D ở đâu trước khi tạo thành 3D?', options: ['Trên một mặt phẳng hoặc mặt phẳng của khối', 'Trên gốc toạ độ (một điểm)', 'Trong bảng vật liệu', 'Trong file STL'], correctIndex: 0, explanation: 'Sketch được vẽ trên một plane hoặc một mặt phẳng, rồi mới tạo chiều sâu.' },
  { id: 'q3', question: 'Vì sao nên ghi kích thước lỗ "cách mép 5 mm" từ chính cái mép đó?', options: ['Để file nhẹ hơn', 'Để giữ design intent — nới rộng chi tiết thì lỗ vẫn đúng chỗ', 'Vì origin không dùng được', 'Để đổi màu chi tiết'], correctIndex: 1, explanation: 'Ghi kích thước theo đúng ý đồ giúp mô hình thay đổi đúng như mong muốn khi sửa.' },
]);

const c2 = doc('cdr301-2-1-sketch-constraints', '2.1 — 2D sketches & constraints|||2.1 — Sketch 2D & ràng buộc (constraints)',
  'Vẽ đường/cung/hình; ràng buộc hình học (trùng, song song, vuông góc, đồng tâm) và kích thước; sketch "fully defined".',
  [[
    `<span class="eyebrow">CDR301 · Chapter 2 · Lesson 2.1</span>
<h2>2D sketches &amp; constraints</h2>
<p>A <strong>sketch</strong> is the 2D profile a 3D feature grows from. Sketching well is the single biggest lever on a clean model. The goal is a <strong>fully defined</strong> sketch — every point locked by constraints and dimensions, so nothing can drift.</p>
<h3>Geometric constraints (relationships)</h3>
<ul>
<li><strong>Coincident</strong> — two points share a location.</li>
<li><strong>Horizontal / Vertical</strong> — a line aligns to an axis.</li>
<li><strong>Parallel / Perpendicular</strong> — set the angle between lines.</li>
<li><strong>Concentric</strong> — circles/arcs share a center.</li>
<li><strong>Equal / Symmetric / Tangent</strong> — enforce equal size, mirror, or smooth joins.</li>
</ul>
<h3>Dimensions</h3>
<p>Dimensions add the <em>numbers</em> (lengths, radii, angles). Constraints fix <em>shape</em>; dimensions fix <em>size</em>. Together they should leave zero degrees of freedom.</p>
<pre><code>Sketch state (most tools color-code it):
  Under-defined  -> geometry can still be dragged  (usually blue)
  Fully defined  -> everything locked              (usually black)
  Over-defined   -> conflicting constraints        (red - remove one)
Aim: FULLY DEFINED before you extrude.
</code></pre>
<div class="callout"><span class="badge">Habit to build</span> Constrain first, dimension second, and always finish fully defined. An under-defined sketch is a part that will move on you the day you change something nearby.</div>`,
    `<span class="eyebrow">CDR301 · Chương 2 · Bài 2.1</span>
<h2>Sketch 2D &amp; ràng buộc</h2>
<p>Một <strong>sketch</strong> là biên dạng 2D mà feature 3D mọc lên từ đó. Vẽ sketch tốt là đòn bẩy lớn nhất cho một mô hình sạch. Mục tiêu là sketch <strong>xác định đầy đủ (fully defined)</strong> — mọi điểm bị khoá bởi ràng buộc và kích thước, không gì trôi được.</p>
<h3>Ràng buộc hình học (quan hệ)</h3>
<ul>
<li><strong>Trùng (coincident)</strong> — hai điểm chung một vị trí.</li>
<li><strong>Ngang / Dọc</strong> — một đường thẳng bám theo trục.</li>
<li><strong>Song song / Vuông góc</strong> — đặt góc giữa các đường.</li>
<li><strong>Đồng tâm (concentric)</strong> — các đường tròn/cung chung tâm.</li>
<li><strong>Bằng nhau / Đối xứng / Tiếp tuyến</strong> — ép cùng kích thước, lấy đối xứng, hoặc nối trơn.</li>
</ul>
<h3>Kích thước</h3>
<p>Kích thước thêm phần <em>con số</em> (chiều dài, bán kính, góc). Ràng buộc khoá <em>hình dạng</em>; kích thước khoá <em>kích cỡ</em>. Cả hai cộng lại phải không còn bậc tự do nào.</p>
<pre><code>Trạng thái sketch (đa số công cụ tô màu):
  Thiếu ràng buộc  -> còn kéo được hình học   (thường màu xanh)
  Đủ ràng buộc     -> mọi thứ đã khoá          (thường màu đen)
  Thừa ràng buộc   -> ràng buộc xung đột        (đỏ - bỏ bớt một)
Đích: ĐỦ RÀNG BUỘC trước khi extrude.
</code></pre>
<div class="callout"><span class="badge">Thói quen cần rèn</span> Ràng buộc trước, ghi kích thước sau, và luôn kết thúc ở trạng thái đủ ràng buộc. Sketch thiếu ràng buộc là chi tiết sẽ trôi đúng vào ngày bạn sửa thứ gì đó gần đó.</div>`,
  ]]);

const c2q = quiz('cdr301-quiz-2', 'Quiz 2 — Sketch & constraints|||Quiz 2 — Sketch & ràng buộc', [
  { id: 'q1', question: 'Mục tiêu của một sketch tốt là gì?', options: ['Vẽ càng nhanh càng tốt, bỏ qua ràng buộc', 'Xác định đầy đủ (fully defined) — không còn bậc tự do', 'Để nhiều đường thừa cho đẹp', 'Không ghi kích thước nào'], correctIndex: 1, explanation: 'Sketch fully defined khoá mọi điểm bằng ràng buộc + kích thước, không gì trôi được.' },
  { id: 'q2', question: 'Ràng buộc "đồng tâm" (concentric) làm gì?', options: ['Hai đường song song', 'Các đường tròn/cung chung một tâm', 'Một đường thành ngang', 'Hai đoạn bằng nhau'], correctIndex: 1, explanation: 'Concentric buộc các đường tròn/cung có chung tâm.' },
  { id: 'q3', question: 'Sketch báo màu đỏ / "over-defined" nghĩa là?', options: ['Đã hoàn hảo', 'Thiếu kích thước', 'Ràng buộc xung đột — cần bỏ bớt một', 'Đang thiếu mặt phẳng'], correctIndex: 2, explanation: 'Over-defined = ràng buộc/kích thước mâu thuẫn nhau, phải gỡ bớt.' },
]);

const c3 = doc('cdr301-3-1-solid-modeling', '3.1 — Solid modeling: extrude, revolve, sweep, loft|||3.1 — Modeling khối rắn: extrude, revolve, sweep, loft',
  'Bốn feature nền tảng biến sketch thành khối; feature phụ (lỗ, fillet, chamfer, shell, pattern); cộng/trừ khối (boolean).',
  [[
    `<span class="eyebrow">CDR301 · Chapter 3 · Lesson 3.1</span>
<h2>Solid modeling</h2>
<p>Once a sketch is defined, a <strong>feature</strong> turns it into a solid. Four features build most parts:</p>
<ul>
<li><strong>Extrude</strong> — push a profile in a straight line (a plate, a boss, a slot).</li>
<li><strong>Revolve</strong> — spin a profile around an axis (a shaft, a pulley, anything round).</li>
<li><strong>Sweep</strong> — drag a profile along a path (a pipe, a handle, a cable channel).</li>
<li><strong>Loft</strong> — blend between two or more profiles (a transition, an ergonomic grip).</li>
</ul>
<h3>Add or remove material</h3>
<p>Each feature can <strong>join</strong> (add material) or <strong>cut</strong> (remove it). A cut-extrude is how you make holes and pockets. Modeling is a sequence of add/remove operations on the same body.</p>
<h3>Dress-up &amp; efficiency features</h3>
<pre><code>Common finishing features:
  Hole      -> proper sized/threaded holes (not just a cut circle)
  Fillet    -> round an edge (reduces stress, safer to handle)
  Chamfer   -> bevel an edge (helps assembly, deburrs)
  Shell     -> hollow a solid to a wall thickness (light robot parts)
  Pattern   -> repeat a feature (rows of vent holes, bolt circles)
  Mirror    -> copy across a plane (left/right symmetric parts)
</code></pre>
<div class="callout"><span class="badge">Model smart</span> Prefer one big base feature plus a few edits over dozens of tiny ones. Add fillets and shells <em>late</em> in the tree — they are the features most likely to fail when earlier dimensions change.</div>`,
    `<span class="eyebrow">CDR301 · Chương 3 · Bài 3.1</span>
<h2>Modeling khối rắn</h2>
<p>Khi sketch đã xác định, một <strong>feature</strong> biến nó thành khối rắn. Bốn feature dựng nên hầu hết chi tiết:</p>
<ul>
<li><strong>Extrude</strong> — đẩy biên dạng theo đường thẳng (tấm, vấu lồi, rãnh).</li>
<li><strong>Revolve</strong> — xoay biên dạng quanh một trục (trục, puli, mọi thứ tròn xoay).</li>
<li><strong>Sweep</strong> — kéo biên dạng dọc theo một đường dẫn (ống, tay cầm, máng dây).</li>
<li><strong>Loft</strong> — chuyển tiếp giữa hai hay nhiều biên dạng (đoạn chuyển tiết diện, tay nắm ôm tay).</li>
</ul>
<h3>Cộng hoặc trừ vật liệu</h3>
<p>Mỗi feature có thể <strong>join</strong> (thêm vật liệu) hoặc <strong>cut</strong> (bỏ đi). Cut-extrude là cách tạo lỗ và hốc. Modeling là một chuỗi thao tác cộng/trừ trên cùng một khối.</p>
<h3>Feature hoàn thiện &amp; tăng hiệu quả</h3>
<pre><code>Feature hoàn thiện hay dùng:
  Hole     -> lỗ đúng chuẩn/có ren (không chỉ là cắt hình tròn)
  Fillet   -> bo tròn cạnh (giảm ứng suất, cầm an toàn hơn)
  Chamfer  -> vát cạnh (dễ lắp, khử ba-via)
  Shell    -> khoét rỗng khối theo bề dày thành (chi tiết robot nhẹ)
  Pattern  -> lặp một feature (hàng lỗ thoát khí, vòng bu-lông)
  Mirror   -> chép qua một mặt phẳng (chi tiết đối xứng trái/phải)
</code></pre>
<div class="callout"><span class="badge">Modeling khôn</span> Ưu tiên một feature gốc lớn cộng vài lần sửa, hơn là hàng chục feature vụn. Thêm fillet và shell <em>muộn</em> trong cây feature — đó là những feature dễ vỡ nhất khi kích thước phía trước thay đổi.</div>`,
  ]]);

const c3q = quiz('cdr301-quiz-3', 'Quiz 3 — Solid modeling|||Quiz 3 — Modeling khối rắn', [
  { id: 'q1', question: 'Feature nào phù hợp nhất để tạo một trục tròn xoay?', options: ['Extrude', 'Revolve', 'Shell', 'Chamfer'], correctIndex: 1, explanation: 'Revolve xoay biên dạng quanh một trục — đúng cho trục, puli, chi tiết tròn xoay.' },
  { id: 'q2', question: 'Sweep khác Extrude ở chỗ nào?', options: ['Sweep chỉ cắt, không cộng', 'Sweep kéo biên dạng dọc theo một đường dẫn (path)', 'Sweep không cần sketch', 'Sweep chỉ dùng cho lỗ'], correctIndex: 1, explanation: 'Extrude đẩy thẳng; Sweep kéo biên dạng theo một đường dẫn (ống, tay cầm...).' },
  { id: 'q3', question: 'Feature "Shell" dùng để làm gì?', options: ['Bo tròn cạnh', 'Khoét rỗng khối theo một bề dày thành', 'Lặp lại lỗ theo hàng', 'Xoay quanh trục'], correctIndex: 1, explanation: 'Shell khoét rỗng khối để lại thành mỏng — giúp chi tiết robot nhẹ hơn.' },
]);

const c4 = doc('cdr301-4-1-assembly-mates', '4.1 — Assemblies & mates|||4.1 — Assembly & mating (lắp ráp cụm)',
  'Đưa nhiều chi tiết vào assembly; ràng buộc lắp (mate): trùng mặt, đồng trục, khoảng cách, góc; bậc tự do & mating cho khớp chuyển động.',
  [[
    `<span class="eyebrow">CDR301 · Chapter 4 · Lesson 4.1</span>
<h2>Assemblies &amp; mates</h2>
<p>An <strong>assembly</strong> brings separate parts together into a product. You position parts relative to each other with <strong>mates</strong> (constraints) — the 3D cousins of sketch constraints.</p>
<h3>Common mates</h3>
<ul>
<li><strong>Coincident / Flush</strong> — two faces touch or line up.</li>
<li><strong>Concentric / Axis</strong> — a shaft sits inside a hole, sharing a centerline.</li>
<li><strong>Distance / Offset</strong> — hold a fixed gap.</li>
<li><strong>Angle</strong> — set the angle between two parts.</li>
</ul>
<h3>Degrees of freedom (DOF)</h3>
<p>A free part in space has <strong>6 DOF</strong> — move along X/Y/Z and rotate about X/Y/Z. Each mate removes some. For a <em>static</em> bracket you remove all 6 (fully constrained). For a <em>moving</em> joint you leave exactly the freedom the joint needs.</p>
<pre><code>Robot joint examples (freedom left ON PURPOSE):
  Revolute (hinge/elbow)  -> 1 rotation left
  Slider (linear rail)    -> 1 translation left
  Cylindrical             -> 1 rotation + 1 translation
  Fixed (bolted bracket)  -> 0 (fully constrained)
</code></pre>
<div class="callout"><span class="badge">Bottom-up vs top-down</span> <em>Bottom-up:</em> model each part alone, then assemble. <em>Top-down:</em> design parts in the context of the assembly so mating faces match automatically. Robotics uses both — often top-down for a chassis, bottom-up for standard fasteners.</div>`,
    `<span class="eyebrow">CDR301 · Chương 4 · Bài 4.1</span>
<h2>Assembly &amp; mating</h2>
<p>Một <strong>assembly</strong> gom các chi tiết rời thành một sản phẩm. Bạn định vị các chi tiết so với nhau bằng <strong>mate</strong> (ràng buộc lắp) — họ hàng 3D của ràng buộc sketch.</p>
<h3>Các mate thường gặp</h3>
<ul>
<li><strong>Trùng mặt / Áp sát (coincident/flush)</strong> — hai mặt chạm hoặc thẳng hàng.</li>
<li><strong>Đồng trục (concentric)</strong> — trục nằm trong lỗ, chung đường tâm.</li>
<li><strong>Khoảng cách (distance/offset)</strong> — giữ một khe cố định.</li>
<li><strong>Góc (angle)</strong> — đặt góc giữa hai chi tiết.</li>
</ul>
<h3>Bậc tự do (DOF)</h3>
<p>Một chi tiết tự do trong không gian có <strong>6 bậc tự do</strong> — tịnh tiến theo X/Y/Z và xoay quanh X/Y/Z. Mỗi mate lấy đi bớt vài bậc. Với gá <em>tĩnh</em> bạn khoá cả 6 (ràng buộc đầy đủ). Với khớp <em>chuyển động</em> bạn để lại đúng bậc tự do mà khớp cần.</p>
<pre><code>Ví dụ khớp robot (bậc tự do để lại CÓ CHỦ ĐÍCH):
  Khớp quay (bản lề/khuỷu)  -> còn 1 chuyển động xoay
  Khớp trượt (ray thẳng)    -> còn 1 chuyển động tịnh tiến
  Khớp trụ (cylindrical)    -> còn 1 xoay + 1 tịnh tiến
  Cố định (gá bắt bu-lông)  -> còn 0 (ràng buộc đầy đủ)
</code></pre>
<div class="callout"><span class="badge">Bottom-up vs top-down</span> <em>Bottom-up:</em> dựng từng chi tiết riêng rồi lắp. <em>Top-down:</em> thiết kế chi tiết ngay trong bối cảnh assembly để các mặt lắp tự khớp. Robotics dùng cả hai — thường top-down cho khung, bottom-up cho chi tiết tiêu chuẩn như bu-lông.</div>`,
  ]]);

const c4q = quiz('cdr301-quiz-4', 'Quiz 4 — Assemblies & mates|||Quiz 4 — Assembly & mate', [
  { id: 'q1', question: 'Một chi tiết tự do trong không gian có bao nhiêu bậc tự do?', options: ['3', '6', '1', '12'], correctIndex: 1, explanation: '6 bậc: tịnh tiến theo X/Y/Z và xoay quanh X/Y/Z.' },
  { id: 'q2', question: 'Để lắp một trục vào lỗ, chung đường tâm, dùng mate nào?', options: ['Góc (angle)', 'Đồng trục / concentric', 'Khoảng cách 10 mm', 'Không cần mate'], correctIndex: 1, explanation: 'Mate đồng trục buộc trục và lỗ chung một đường tâm.' },
  { id: 'q3', question: 'Với một khớp quay (bản lề), assembly nên để lại bao nhiêu bậc tự do?', options: ['0 — khoá hết', 'Còn 1 chuyển động xoay', 'Còn cả 6', 'Còn 3 tịnh tiến'], correctIndex: 1, explanation: 'Khớp quay cần đúng 1 bậc xoay; các bậc còn lại bị mate khoá.' },
]);

const c5 = doc('cdr301-5-1-tolerances-gdt-drawings', '5.1 — Tolerances, fits, GD&T & drawings|||5.1 — Dung sai, lắp ghép, GD&T & bản vẽ kỹ thuật',
  'Dung sai kích thước; lắp lỏng/chặt/trung gian; GD&T (đọc khung điều khiển feature); bản vẽ 2D: hình chiếu, mặt cắt, ghi kích thước, khung tên.',
  [[
    `<span class="eyebrow">CDR301 · Chapter 5 · Lesson 5.1</span>
<h2>Tolerances, fits, GD&amp;T &amp; drawings</h2>
<h3>Why tolerance?</h3>
<p>No part is made perfectly to size. A <strong>tolerance</strong> is the allowed range, e.g. 10.0 mm +0.1 / -0.0. Choosing tolerances is a trade-off: tighter = more precise but more expensive to make.</p>
<h3>Fits between mating parts</h3>
<ul>
<li><strong>Clearance fit</strong> — always a gap; the shaft slides in the hole (bearings that must spin).</li>
<li><strong>Interference fit</strong> — the shaft is slightly bigger; it is pressed in and grips (a gear locked on a shaft).</li>
<li><strong>Transition fit</strong> — in between; snug locating with easy assembly.</li>
</ul>
<h3>GD&amp;T — the language of shape control</h3>
<p><strong>Geometric Dimensioning &amp; Tolerancing</strong> controls form and position, not just size — flatness, concentricity, position, parallelism. It is read from <strong>feature control frames</strong> and makes drawings unambiguous across any factory.</p>
<h3>Engineering drawings</h3>
<pre><code>A 2D drawing of a 3D part typically has:
  Views        -> front / top / right (orthographic projection)
  Section view -> cut through to show internal features
  Dimensions   -> sizes + tolerances
  GD&amp;T frames  -> geometric controls
  Title block  -> part name, material, scale, units, revision
</code></pre>
<div class="callout"><span class="badge">Model + drawing</span> The 3D model drives the shape; the drawing communicates <em>how good it must be</em> to whoever manufactures it. A part with no tolerances is a part nobody can make correctly.</div>`,
    `<span class="eyebrow">CDR301 · Chương 5 · Bài 5.1</span>
<h2>Dung sai, lắp ghép, GD&amp;T &amp; bản vẽ</h2>
<h3>Vì sao cần dung sai?</h3>
<p>Không chi tiết nào gia công đúng kích thước tuyệt đối. <strong>Dung sai</strong> là khoảng cho phép, ví dụ 10,0 mm +0,1 / -0,0. Chọn dung sai là đánh đổi: chặt hơn = chính xác hơn nhưng đắt hơn khi gia công.</p>
<h3>Kiểu lắp giữa hai chi tiết</h3>
<ul>
<li><strong>Lắp lỏng (clearance)</strong> — luôn có khe; trục trượt trong lỗ (ổ bi phải quay).</li>
<li><strong>Lắp chặt (interference)</strong> — trục lớn hơn một chút; ép vào và bám cứng (bánh răng khoá trên trục).</li>
<li><strong>Lắp trung gian (transition)</strong> — ở giữa; định vị khít mà vẫn lắp được.</li>
</ul>
<h3>GD&amp;T — ngôn ngữ kiểm soát hình học</h3>
<p><strong>GD&amp;T (dung sai hình học)</strong> kiểm soát hình dạng và vị trí, không chỉ kích thước — độ phẳng, độ đồng tâm, vị trí, độ song song. Nó được đọc từ <strong>khung điều khiển feature</strong> và làm bản vẽ không thể hiểu nhầm ở bất kỳ xưởng nào.</p>
<h3>Bản vẽ kỹ thuật</h3>
<pre><code>Bản vẽ 2D của một chi tiết 3D thường có:
  Hình chiếu   -> đứng / bằng / cạnh (hình chiếu vuông góc)
  Mặt cắt      -> cắt qua để lộ chi tiết bên trong
  Kích thước   -> kích cỡ + dung sai
  Khung GD&amp;T   -> kiểm soát hình học
  Khung tên    -> tên chi tiết, vật liệu, tỉ lệ, đơn vị, số hiệu bản
</code></pre>
<div class="callout"><span class="badge">Mô hình + bản vẽ</span> Mô hình 3D quyết định hình dạng; bản vẽ truyền đạt <em>nó phải chính xác đến đâu</em> cho người gia công. Một chi tiết không có dung sai là chi tiết không ai làm đúng được.</div>`,
  ]]);

const c5q = quiz('cdr301-quiz-5', 'Quiz 5 — Tolerances & GD&T|||Quiz 5 — Dung sai & GD&T', [
  { id: 'q1', question: 'Dung sai (tolerance) là gì?', options: ['Kích thước tuyệt đối không sai lệch', 'Khoảng sai lệch cho phép quanh kích thước danh nghĩa', 'Tên vật liệu', 'Màu của chi tiết'], correctIndex: 1, explanation: 'Không chi tiết nào làm đúng tuyệt đối; dung sai là khoảng cho phép, vd +0,1/-0,0.' },
  { id: 'q2', question: 'Ổ bi phải quay trơn trong lỗ thì cần kiểu lắp nào?', options: ['Lắp chặt (interference)', 'Lắp lỏng (clearance) — luôn có khe', 'Không cần lắp', 'Lắp ép nóng'], correctIndex: 1, explanation: 'Lắp lỏng luôn để lại khe hở nên trục/ổ trượt và quay được.' },
  { id: 'q3', question: 'GD&T kiểm soát thêm điều gì mà dung sai kích thước thường không?', options: ['Chỉ màu sắc', 'Hình dạng & vị trí — độ phẳng, đồng tâm, vị trí, song song', 'Giá thành', 'Khối lượng'], correctIndex: 1, explanation: 'GD&T kiểm soát hình học (form/position), không chỉ kích cỡ.' },
]);

const c6 = doc('cdr301-6-1-robot-parts', '6.1 — Designing robot parts: joints, brackets, gears, frames|||6.1 — Thiết kế chi tiết robot: khớp, gá, bánh răng, khung',
  'Khớp (quay/trượt), gá & mặt bích gắn động cơ/cảm biến, bánh răng (mô-đun, tỉ số truyền), khung/chassis chịu tải; thiết kế cho lắp ráp.',
  [[
    `<span class="eyebrow">CDR301 · Chapter 6 · Lesson 6.1</span>
<h2>Designing robot parts</h2>
<p>Robotics-specific parts reuse everything from Chapters 1-5, aimed at parts that <em>move and carry loads</em>.</p>
<h3>Joints &amp; links</h3>
<p>A robot arm is <strong>links</strong> connected by <strong>joints</strong>. Design each joint around its bearing or motor shaft, keep the rotation axis clean, and leave room for wiring.</p>
<h3>Mounting brackets &amp; flanges</h3>
<p>Motors, servos and sensors ship with standard bolt patterns. Model the bracket to that pattern exactly — hole spacing, shaft clearance, and locating features so the part can only go on one way.</p>
<h3>Gears &amp; transmission</h3>
<pre><code>Spur-gear basics:
  Module (m)     -> tooth size; two meshing gears MUST share m
  Teeth (z)      -> count on each gear
  Ratio          -> z_out / z_in  (torque up, speed down)
  Center dist.   -> m * (z1 + z2) / 2
Example: m=1, z1=20, z2=40 -> ratio 2:1, centers = 1*(20+40)/2 = 30 mm
</code></pre>
<h3>Frame / chassis</h3>
<p>The frame carries every load. Use ribs and gussets for stiffness, shell where you can for weight, and put mounting bosses where motors and boards attach.</p>
<div class="callout"><span class="badge">Design for assembly (DFA)</span> Fewer parts, standard fasteners, and features that self-locate. If a part can be installed backwards, add a feature that makes the wrong way impossible.</div>`,
    `<span class="eyebrow">CDR301 · Chương 6 · Bài 6.1</span>
<h2>Thiết kế chi tiết robot</h2>
<p>Chi tiết đặc thù robot dùng lại mọi thứ ở Chương 1-5, hướng vào những chi tiết <em>chuyển động và chịu tải</em>.</p>
<h3>Khớp &amp; thanh nối</h3>
<p>Một cánh tay robot là các <strong>thanh nối (link)</strong> nối bằng <strong>khớp (joint)</strong>. Thiết kế mỗi khớp quanh ổ bi hoặc trục động cơ, giữ trục quay sạch sẽ, và chừa chỗ đi dây.</p>
<h3>Gá &amp; mặt bích gắn</h3>
<p>Động cơ, servo và cảm biến đi kèm mẫu lỗ bu-lông tiêu chuẩn. Hãy dựng gá đúng mẫu đó — khoảng cách lỗ, khe trục, và feature định vị để chi tiết chỉ lắp được theo một chiều.</p>
<h3>Bánh răng &amp; truyền động</h3>
<pre><code>Cơ bản bánh răng trụ răng thẳng:
  Mô-đun (m)     -> cỡ răng; hai bánh ăn khớp PHẢI cùng m
  Số răng (z)    -> số răng mỗi bánh
  Tỉ số truyền   -> z_ra / z_vào  (mô-men tăng, tốc độ giảm)
  Khoảng cách tâm-> m * (z1 + z2) / 2
Ví dụ: m=1, z1=20, z2=40 -> tỉ số 2:1, tâm = 1*(20+40)/2 = 30 mm
</code></pre>
<h3>Khung / chassis</h3>
<p>Khung gánh mọi tải. Dùng gân và tấm tăng cứng để tăng độ cứng, khoét vỏ chỗ nào được để giảm cân, và đặt vấu bắt ở nơi động cơ, mạch gắn vào.</p>
<div class="callout"><span class="badge">Thiết kế để lắp ráp (DFA)</span> Ít chi tiết, dùng chi tiết ghép tiêu chuẩn, và feature tự định vị. Nếu một chi tiết có thể lắp ngược, hãy thêm feature làm cho chiều sai không lắp được.</div>`,
  ]]);

const c6q = quiz('cdr301-quiz-6', 'Quiz 6 — Robot parts|||Quiz 6 — Chi tiết robot', [
  { id: 'q1', question: 'Hai bánh răng ăn khớp với nhau bắt buộc phải cùng đại lượng nào?', options: ['Cùng số răng', 'Cùng mô-đun (module)', 'Cùng màu', 'Cùng khối lượng'], correctIndex: 1, explanation: 'Hai bánh ăn khớp phải cùng mô-đun m thì răng mới khớp; số răng có thể khác.' },
  { id: 'q2', question: 'Cặp bánh z1=20 và z2=40 cho tỉ số truyền và hệ quả gì?', options: ['1:1, không đổi', '2:1 — mô-men tăng, tốc độ giảm', '1:2 — tốc độ tăng', 'Không truyền được'], correctIndex: 1, explanation: 'Tỉ số = z_ra/z_vào = 40/20 = 2:1: mô-men lớn hơn, tốc độ nhỏ hơn.' },
  { id: 'q3', question: 'Nguyên tắc "thiết kế để lắp ráp" (DFA) khuyên điều gì?', options: ['Càng nhiều chi tiết càng tốt', 'Ít chi tiết, chi tiết ghép tiêu chuẩn, feature tự định vị chống lắp sai', 'Bỏ hết dung sai', 'Không dùng bu-lông tiêu chuẩn'], correctIndex: 1, explanation: 'DFA: giảm số chi tiết, dùng chuẩn, và làm cho chiều lắp sai không thể xảy ra.' },
]);

const c7 = doc('cdr301-7-1-motion-fea', '7.1 — Motion simulation & stress analysis (basic FEA)|||7.1 — Mô phỏng chuyển động & phân tích ứng suất (FEA cơ bản)',
  'Mô phỏng chuyển động cơ cấu (kiểm va chạm, hành trình); FEA cơ bản: tải, ràng buộc, lưới (mesh), ứng suất von Mises, hệ số an toàn.',
  [[
    `<span class="eyebrow">CDR301 · Chapter 7 · Lesson 7.1</span>
<h2>Motion simulation &amp; basic FEA</h2>
<h3>Motion study</h3>
<p>A <strong>motion study</strong> drives the joints you left free in the assembly and plays the mechanism. It answers: does the arm reach its target? Do parts <strong>collide</strong> anywhere in the range? What is the travel and speed at each joint? You catch interference on screen instead of on a broken prototype.</p>
<h3>What FEA is</h3>
<p><strong>FEA (Finite Element Analysis)</strong> predicts how a part deforms and where it is stressed under load. The solver splits the part into a <strong>mesh</strong> of small elements and computes the physics on each.</p>
<pre><code>Static FEA setup (the recipe):
  1. Material   -> set it (steel, aluminum, PLA ...) - stiffness matters
  2. Constraints-> fix faces that are bolted/held (where it can't move)
  3. Loads      -> apply forces / pressure / gravity where they act
  4. Mesh       -> divide into elements (finer = more accurate, slower)
  5. Solve      -> read von Mises stress + displacement
  6. Check      -> Safety Factor = yield strength / max stress  (want &gt; 1)
</code></pre>
<h3>Reading results</h3>
<p>Look at peak <strong>von Mises stress</strong> vs the material's yield strength, and at <strong>displacement</strong> (is it too flexible?). A <strong>safety factor</strong> below 1 means it will likely yield — add material, a rib, or a fillet at the hot spot and re-run.</p>
<div class="callout"><span class="badge">Garbage in, garbage out</span> FEA is only as good as its loads and constraints. Simulation guides design; it does not replace real testing on a load-critical robot part.</div>`,
    `<span class="eyebrow">CDR301 · Chương 7 · Bài 7.1</span>
<h2>Mô phỏng chuyển động &amp; FEA cơ bản</h2>
<h3>Nghiên cứu chuyển động</h3>
<p>Một <strong>motion study</strong> điều khiển các khớp bạn để tự do trong assembly và cho cơ cấu chạy. Nó trả lời: cánh tay có với tới đích không? Chi tiết có <strong>va chạm</strong> ở đâu trong hành trình không? Hành trình và tốc độ mỗi khớp là bao nhiêu? Bạn bắt được va chạm trên màn hình thay vì trên mẫu thật đã gãy.</p>
<h3>FEA là gì</h3>
<p><strong>FEA (phân tích phần tử hữu hạn)</strong> dự đoán chi tiết biến dạng thế nào và ứng suất tập trung ở đâu khi chịu tải. Bộ giải chia chi tiết thành một <strong>lưới (mesh)</strong> gồm nhiều phần tử nhỏ và tính vật lý trên từng phần tử.</p>
<pre><code>Thiết lập FEA tĩnh (công thức):
  1. Vật liệu   -> đặt (thép, nhôm, PLA ...) - độ cứng rất quan trọng
  2. Ràng buộc  -> cố định mặt bị bắt/giữ (nơi không di chuyển được)
  3. Tải        -> đặt lực / áp / trọng lực đúng chỗ tác dụng
  4. Lưới       -> chia thành phần tử (mịn hơn = chính xác hơn, chậm hơn)
  5. Giải       -> đọc ứng suất von Mises + chuyển vị
  6. Kiểm       -> Hệ số an toàn = giới hạn chảy / ứng suất max  (muốn &gt; 1)
</code></pre>
<h3>Đọc kết quả</h3>
<p>Nhìn đỉnh <strong>ứng suất von Mises</strong> so với giới hạn chảy của vật liệu, và <strong>chuyển vị</strong> (có quá mềm không?). <strong>Hệ số an toàn</strong> nhỏ hơn 1 nghĩa là chi tiết dễ bị chảy dẻo — thêm vật liệu, gân, hoặc bo góc ở điểm nóng rồi chạy lại.</p>
<div class="callout"><span class="badge">Rác vào, rác ra</span> FEA chỉ tốt bằng tải và ràng buộc bạn đặt. Mô phỏng dẫn hướng thiết kế; nó không thay được thử nghiệm thật với chi tiết robot chịu tải quan trọng.</div>`,
  ]]);

const c7q = quiz('cdr301-quiz-7', 'Quiz 7 — Motion & FEA|||Quiz 7 — Chuyển động & FEA', [
  { id: 'q1', question: 'Mục đích chính của "motion study" trong assembly là?', options: ['Đổi màu chi tiết', 'Cho cơ cấu chạy để kiểm hành trình & phát hiện va chạm', 'Tính giá thành', 'Xuất file STL'], correctIndex: 1, explanation: 'Motion study chạy các khớp tự do, kiểm hành trình/tốc độ và bắt va chạm trước khi làm mẫu thật.' },
  { id: 'q2', question: 'Trong FEA tĩnh, "mesh" (lưới) là gì?', options: ['Vật liệu của chi tiết', 'Chia chi tiết thành nhiều phần tử nhỏ để tính; mịn hơn = chính xác hơn, chậm hơn', 'Một loại tải', 'Bản vẽ 2D'], correctIndex: 1, explanation: 'Mesh chia chi tiết thành phần tử hữu hạn; lưới mịn hơn cho kết quả chính xác hơn nhưng giải lâu hơn.' },
  { id: 'q3', question: 'Hệ số an toàn (safety factor) nhỏ hơn 1 nghĩa là?', options: ['Chi tiết rất an toàn', 'Chi tiết có khả năng bị chảy dẻo/hỏng — cần gia cố', 'Không đặt được tải', 'Lưới quá mịn'], correctIndex: 1, explanation: 'SF < 1 = ứng suất vượt giới hạn chảy: thêm vật liệu/gân/bo góc rồi chạy lại.' },
]);

const c8 = doc('cdr301-8-1-manufacturing-prep', '8.1 — Manufacturing prep & design optimization|||8.1 — Chuẩn bị chế tạo & tối ưu thiết kế',
  'Xuất STL/STEP; thiết kế cho in 3D (thành, overhang, dung sai) và CNC (bán kính dao, undercut); nhẹ hoá & tối ưu; checklist trước khi chế tạo.',
  [[
    `<span class="eyebrow">CDR301 · Chapter 8 · Lesson 8.1</span>
<h2>Manufacturing prep &amp; optimization</h2>
<h3>Export formats</h3>
<ul>
<li><strong>STL</strong> — a mesh of triangles; the standard input for <strong>3D printing</strong>. It loses parametric data — export only when done.</li>
<li><strong>STEP</strong> — precise solid geometry; the standard for <strong>sharing between CAD systems</strong> and for CNC / machine shops.</li>
</ul>
<h3>Design for 3D printing (DFAM)</h3>
<pre><code>3D-print rules of thumb (FDM):
  Wall thickness  >= 2-3 perimeters (don't model 0.2 mm walls)
  Overhangs       <= ~45 deg without support
  Holes           print undersized -> add clearance or ream after
  Orientation     lay layers ACROSS the load (layers are weak in Z)
</code></pre>
<h3>Design for CNC machining</h3>
<p>A rotating tool cannot make a perfectly sharp internal corner — every internal corner needs a radius at least the tool radius. Avoid deep narrow pockets and <strong>undercuts</strong> the tool cannot reach.</p>
<h3>Optimization &amp; lightweighting</h3>
<p>Once it works, make it better: shell and rib to cut mass, consolidate parts, and use FEA to remove material where stress is low (topology optimization). Lighter robot links mean faster motion and smaller motors.</p>
<div class="callout"><span class="badge">Pre-manufacture checklist</span>
<ol>
<li>Model fully defined, no errors in the feature tree.</li>
<li>Tolerances &amp; fits set on every mating surface.</li>
<li>Interference &amp; motion checked in the assembly.</li>
<li>FEA safety factor acceptable on load-bearing parts.</li>
<li>Correct export: STL (print) or STEP (CNC / share), right units.</li>
</ol></div>`,
    `<span class="eyebrow">CDR301 · Chương 8 · Bài 8.1</span>
<h2>Chuẩn bị chế tạo &amp; tối ưu</h2>
<h3>Định dạng xuất</h3>
<ul>
<li><strong>STL</strong> — lưới tam giác; chuẩn đầu vào cho <strong>in 3D</strong>. Nó mất dữ liệu tham số — chỉ xuất khi đã xong.</li>
<li><strong>STEP</strong> — hình học khối chính xác; chuẩn để <strong>trao đổi giữa các phần mềm CAD</strong> và cho CNC / xưởng gia công.</li>
</ul>
<h3>Thiết kế cho in 3D (DFAM)</h3>
<pre><code>Nguyên tắc in 3D (FDM):
  Bề dày thành  >= 2-3 lớp viền (đừng dựng thành 0,2 mm)
  Phần đua      <= ~45 độ mới khỏi cần support
  Lỗ            in bị nhỏ lại -> chừa khe hoặc doa lại sau
  Hướng đặt     xếp lớp NGANG hướng tải (lớp yếu theo trục Z)
</code></pre>
<h3>Thiết kế cho gia công CNC</h3>
<p>Dao quay không tạo được góc trong sắc tuyệt đối — mọi góc trong cần bán kính ít nhất bằng bán kính dao. Tránh hốc sâu và hẹp, và tránh <strong>undercut</strong> mà dao không với tới.</p>
<h3>Tối ưu &amp; nhẹ hoá</h3>
<p>Khi đã chạy được, hãy làm tốt hơn: khoét vỏ và thêm gân để giảm khối lượng, gộp bớt chi tiết, và dùng FEA để bỏ vật liệu ở chỗ ứng suất thấp (tối ưu topology). Thanh nối robot nhẹ hơn thì chuyển động nhanh hơn và động cơ nhỏ hơn.</p>
<div class="callout"><span class="badge">Checklist trước khi chế tạo</span>
<ol>
<li>Mô hình xác định đầy đủ, cây feature không lỗi.</li>
<li>Đặt dung sai &amp; kiểu lắp trên mọi mặt lắp ghép.</li>
<li>Kiểm va chạm &amp; chuyển động trong assembly.</li>
<li>Hệ số an toàn FEA đạt trên các chi tiết chịu tải.</li>
<li>Xuất đúng: STL (in) hay STEP (CNC / chia sẻ), đúng đơn vị.</li>
</ol></div>`,
  ]]);

const c8q = quiz('cdr301-quiz-8', 'Quiz 8 — Manufacturing prep|||Quiz 8 — Chuẩn bị chế tạo', [
  { id: 'q1', question: 'Định dạng nào là chuẩn đầu vào cho máy in 3D?', options: ['STEP', 'STL (lưới tam giác)', 'PDF', 'DWG'], correctIndex: 1, explanation: 'STL mô tả bề mặt bằng lưới tam giác — chuẩn cho in 3D; STEP dùng để trao đổi CAD/CNC.' },
  { id: 'q2', question: 'Vì sao góc trong của chi tiết gia công CNC luôn phải có bán kính?', options: ['Cho đẹp', 'Vì dao quay tròn không tạo được góc trong sắc tuyệt đối', 'Để nhẹ hơn', 'Để in nhanh hơn'], correctIndex: 1, explanation: 'Dao phay quay tròn nên góc trong tối thiểu bằng bán kính dao — không thể sắc tuyệt đối.' },
  { id: 'q3', question: 'Khi in FDM, nên đặt hướng chi tiết thế nào so với tải?', options: ['Xếp lớp dọc theo tải', 'Xếp lớp NGANG hướng tải, vì lớp yếu theo trục Z', 'Hướng nào cũng như nhau', 'Luôn in dựng đứng'], correctIndex: 1, explanation: 'Liên kết giữa các lớp (trục Z) yếu; đặt sao cho tải không tách các lớp.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'CDR301',
    slug: 'cdr301-3d-cad-design-for-robotics',
    title: '3D CAD Design for Robotics',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CDR301.webp',
    shortDescription: '3D CAD for robots — sketches & constraints, solid modeling (extrude/revolve/sweep/loft), assemblies & mates, GD&T & drawings, robot parts, motion & FEA, manufacturing prep (3D print/CNC, STL/STEP). Bilingual with quizzes.|||CAD 3D cho robot — sketch & ràng buộc, modeling khối rắn, lắp ráp & mating, dung sai GD&T & bản vẽ, chi tiết robot, mô phỏng chuyển động & FEA, chuẩn bị chế tạo (in 3D/CNC, STL/STEP). Song ngữ, có quiz.',
    description: 'Môn <strong>CDR301 — 3D CAD Design for Robotics</strong> (ngành Robotics &amp; AI, kỳ 8) dạy bạn biến ý tưởng thành <strong>mô hình 3D chính xác, lắp ráp và chế tạo được</strong>. Đi đúng quy trình của kỹ sư cơ khí: <strong>sketch &amp; ràng buộc</strong> → <strong>modeling khối rắn</strong> (extrude/revolve/sweep/loft) → <strong>assembly &amp; mating</strong> → <strong>dung sai, GD&amp;T &amp; bản vẽ kỹ thuật</strong> → <strong>chi tiết robot</strong> (khớp, gá, bánh răng, khung) → <strong>mô phỏng chuyển động &amp; FEA</strong> → <strong>chuẩn bị chế tạo</strong> (in 3D, CNC, xuất STL/STEP). Bám tài liệu SolidWorks/Fusion 360/Inventor &amp; Onshape, song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Hệ toạ độ & mô hình tham số, cây feature & design intent; sketch 2D + ràng buộc (fully defined); extrude/revolve/sweep/loft + hole/fillet/chamfer/shell/pattern; assembly & mate, bậc tự do cho khớp; dung sai, kiểu lắp lỏng/chặt/trung gian, GD&T & bản vẽ; thiết kế khớp/gá/bánh răng (mô-đun, tỉ số truyền)/khung; motion study & FEA (mesh, von Mises, hệ số an toàn); DFAM cho in 3D & CNC; xuất STL/STEP.',
    requirements: 'Hình học & vật lý phổ thông. Nên cài Autodesk Fusion 360 (miễn phí cho sinh viên) hoặc dùng Onshape trên trình duyệt.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ CAD, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'CAD 3D là gì, mô hình tham số, quy trình sketch → chế tạo.', lessons: [intro] },
    { title: 'Chương 1 — Cơ sở CAD & tư duy thiết kế|||Chapter 1 — CAD foundations', description: 'Hệ toạ độ, tham số vs trực tiếp, cây feature, design intent.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Sketch 2D & ràng buộc|||Chapter 2 — Sketches & constraints', description: 'Ràng buộc hình học, kích thước, fully defined.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Modeling khối rắn|||Chapter 3 — Solid modeling', description: 'Extrude/revolve/sweep/loft, hole/fillet/shell/pattern.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Assembly & mating|||Chapter 4 — Assemblies & mates', description: 'Mate, bậc tự do, khớp chuyển động, bottom-up/top-down.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Dung sai, GD&T & bản vẽ|||Chapter 5 — Tolerances, GD&T & drawings', description: 'Dung sai, kiểu lắp, GD&T, hình chiếu & khung tên.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Chi tiết robot|||Chapter 6 — Robot parts', description: 'Khớp, gá, bánh răng (mô-đun/tỉ số), khung; DFA.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Mô phỏng & FEA|||Chapter 7 — Motion & FEA', description: 'Motion study, mesh, von Mises, hệ số an toàn.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Chuẩn bị chế tạo|||Chapter 8 — Manufacturing prep', description: 'STL/STEP, DFAM in 3D & CNC, nhẹ hoá, checklist.', lessons: [c8, c8q] },
  ],
};
