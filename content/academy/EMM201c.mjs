/**
 * EMM201c — Engineering Mechanics and Machine Elements (Cơ học kỹ thuật & Chi
 * tiết máy). Ngành Robotics & AI, FPTU. Khung 8 chương: tĩnh học, mô men,
 * kết cấu/giàn, ma sát/trọng tâm, động học, động lực học, sức bền vật liệu,
 * chi tiết máy. Sách chuẩn: Hibbeler "Engineering Mechanics"; Beer & Johnston
 * "Vector Mechanics for Engineers"; Shigley "Mechanical Engineering Design".
 * Song ngữ + công thức + ví dụ giải. Giữ NGUYÊN slug/semester/courseCode/thumb.
 * ⚠️ KHÔNG backtick/${ lồng; "&"→&amp; trong content HTML; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('emm201c-0-1-overview', 'Course overview: Engineering mechanics & machine elements|||Tổng quan: Cơ học kỹ thuật & chi tiết máy',
  'Cơ học kỹ thuật làm gì; tĩnh học vs động lực học; đại lượng nền (lực, mô men, ứng suất); lộ trình 4 bước: tĩnh học → động học/động lực học → sức bền → chi tiết máy.',
  [[
    `<span class="eyebrow">EMM201c · Lesson 0.1 · Overview</span>
<h2>Engineering Mechanics &amp; Machine Elements</h2>
<p class="lead">This course gives robotics engineers the <strong>mechanical foundation</strong> behind every arm, joint and drivetrain: how forces balance a body, how bodies move, how materials fail, and how the parts that transmit power — shafts, bearings, gears — are sized.</p>
<h3>The two halves of mechanics</h3>
<ul>
<li><strong>Statics</strong> — bodies at rest or in equilibrium. The core equations are <strong>ΣF = 0</strong> and <strong>ΣM = 0</strong>.</li>
<li><strong>Dynamics</strong> — bodies in motion. Kinematics describes the motion; kinetics links it to force through <strong>Newton: F = ma</strong>.</li>
</ul>
<h3>Roadmap (4 steps)</h3>
<p>Statics (forces &amp; equilibrium, moments, trusses, friction) → kinematics &amp; dynamics (motion, F = ma, energy, momentum) → strength of materials (stress-strain, τ = F/A) → machine elements (shafts, bearings, gears, belts). Textbooks: Hibbeler, Beer &amp; Johnston, Shigley.</p>`,
    `<span class="eyebrow">EMM201c · Bài 0.1 · Tổng quan</span>
<h2>Cơ học kỹ thuật &amp; chi tiết máy</h2>
<p class="lead">Môn này trang bị cho kỹ sư robot <strong>nền tảng cơ học</strong> sau mỗi cánh tay, khớp và bộ truyền động: lực cân bằng vật thế nào, vật chuyển động ra sao, vật liệu hỏng khi nào, và các chi tiết truyền công suất — trục, ổ, bánh răng — được tính toán thế nào.</p>
<h3>Hai nửa của cơ học</h3>
<ul>
<li><strong>Tĩnh học</strong> — vật đứng yên hoặc cân bằng. Phương trình cốt lõi là <strong>ΣF = 0</strong> và <strong>ΣM = 0</strong>.</li>
<li><strong>Động lực học</strong> — vật chuyển động. Động học mô tả chuyển động; động lực học nối nó với lực qua <strong>Newton: F = ma</strong>.</li>
</ul>
<h3>Lộ trình (4 bước)</h3>
<p>Tĩnh học (lực &amp; cân bằng, mô men, giàn, ma sát) → động học &amp; động lực học (chuyển động, F = ma, năng lượng, động lượng) → sức bền vật liệu (ứng suất-biến dạng, τ = F/A) → chi tiết máy (trục, ổ, bánh răng, đai). Sách: Hibbeler, Beer &amp; Johnston, Shigley.</p>`,
  ]]);

const c1 = doc('emm201c-1-1-statics-forces', '1.1 — Statics: forces & equilibrium|||1.1 — Tĩnh học: lực & cân bằng',
  'Lực là vector (độ lớn, hướng); phân tích thành phần Fx/Fy; hệ lực đồng quy; điều kiện cân bằng của điểm ΣF = 0.',
  [[
    `<span class="eyebrow">EMM201c · Chapter 1 · Lesson 1.1</span>
<h2>Statics: forces &amp; equilibrium</h2>
<h3>Force as a vector</h3>
<p>A <strong>force</strong> has magnitude AND direction, so it is a <strong>vector</strong>. Resolve it into components along the axes: Fx = F·cosθ, Fy = F·sinθ. Adding forces means adding components, not magnitudes.</p>
<h3>Concurrent forces &amp; equilibrium of a particle</h3>
<p>When all forces pass through one point (a <strong>concurrent</strong> system), a particle is in <strong>equilibrium</strong> only when the forces cancel. In 2D that is two scalar equations:</p>
<pre><code>Equilibrium of a particle (2D):
  ΣFx = 0     (sum of x-components = 0)
  ΣFy = 0     (sum of y-components = 0)

Example: a 100 N weight hung by two cables at 30 deg
  Each cable tension T, symmetric:
  2 · T · sin(30) = 100 N
  T = 100 / (2 · 0.5) = 100 N
</code></pre>
<div class="callout"><span class="badge">Robotics link</span> Every static hold of a robot gripper or a parked arm is a ΣF = 0 problem — the actuators must supply exactly the forces that cancel gravity and payload.</div>`,
    `<span class="eyebrow">EMM201c · Chương 1 · Bài 1.1</span>
<h2>Tĩnh học: lực &amp; cân bằng</h2>
<h3>Lực là một vector</h3>
<p>Một <strong>lực</strong> có độ lớn VÀ hướng, nên nó là <strong>vector</strong>. Phân tích thành thành phần theo các trục: Fx = F·cosθ, Fy = F·sinθ. Cộng lực là cộng thành phần, không phải cộng độ lớn.</p>
<h3>Hệ lực đồng quy &amp; cân bằng của chất điểm</h3>
<p>Khi mọi lực đi qua một điểm (hệ <strong>đồng quy</strong>), chất điểm <strong>cân bằng</strong> chỉ khi các lực triệt tiêu nhau. Trong 2D đó là hai phương trình vô hướng:</p>
<pre><code>Cân bằng của chất điểm (2D):
  ΣFx = 0     (tổng thành phần theo x = 0)
  ΣFy = 0     (tổng thành phần theo y = 0)

Ví dụ: vật nặng 100 N treo bởi hai dây nghiêng 30 do
  Mỗi dây có sức căng T, đối xứng:
  2 · T · sin(30) = 100 N
  T = 100 / (2 · 0.5) = 100 N
</code></pre>
<div class="callout"><span class="badge">Liên hệ robot</span> Mọi trạng thái giữ tĩnh của tay kẹp hay cánh tay đứng yên đều là bài toán ΣF = 0 — cơ cấu chấp hành phải sinh đúng lực triệt tiêu trọng lực và tải.</div>`,
  ]]);

const c1q = quiz('emm201c-quiz-1', 'Quiz 1 — Forces & equilibrium|||Quiz 1 — Lực & cân bằng', [
  { id: 'q1', question: 'Lực là đại lượng gì?', options: ['Vô hướng (chỉ độ lớn)', 'Vector (độ lớn và hướng)', 'Chỉ có hướng', 'Không đo được'], correctIndex: 1, explanation: 'Lực có cả độ lớn lẫn hướng nên là vector; phân tích được thành Fx, Fy.' },
  { id: 'q2', question: 'Điều kiện cân bằng của một chất điểm trong 2D là?', options: ['ΣFx = 0 và ΣFy = 0', 'ΣM = 0', 'F = ma', 'ΣFx > 0'], correctIndex: 0, explanation: 'Chất điểm cân bằng khi tổng thành phần lực theo mỗi trục bằng 0.' },
  { id: 'q3', question: 'Thành phần theo trục x của lực F nghiêng góc θ là?', options: ['F·sinθ', 'F·cosθ', 'F·tanθ', 'F/θ'], correctIndex: 1, explanation: 'Fx = F·cosθ, Fy = F·sinθ.' },
]);

const c2 = doc('emm201c-2-1-moment-rigid-body', '2.1 — Moments & rigid-body equilibrium|||2.1 — Mô men & cân bằng vật rắn',
  'Mô men của lực M = F·d; ngẫu lực (couple); sơ đồ vật tự do (free body diagram); điều kiện cân bằng vật rắn ΣF = 0 và ΣM = 0.',
  [[
    `<span class="eyebrow">EMM201c · Chapter 2 · Lesson 2.1</span>
<h2>Moments &amp; rigid-body equilibrium</h2>
<h3>Moment of a force</h3>
<p>A <strong>moment</strong> (torque) is the turning effect of a force about a point: <strong>M = F · d</strong>, where d is the perpendicular distance from the point to the line of action. Longer lever arm = more turning for the same force.</p>
<h3>Couples &amp; the free-body diagram</h3>
<p>A <strong>couple</strong> is two equal, opposite, parallel forces — it produces pure rotation, no net force. To solve any rigid body you first draw a <strong>free-body diagram (FBD)</strong>: isolate the body and mark every external force and reaction.</p>
<pre><code>Rigid-body equilibrium (2D):
  ΣFx = 0
  ΣFy = 0
  ΣM  = 0    (moments about any point)

Example: beam 4 m, load 200 N at 3 m from support A
  ΣM about A: RB · 4 = 200 · 3  ->  RB = 150 N
  ΣFy: RA + RB = 200  ->  RA = 50 N
</code></pre>
<div class="callout"><span class="badge">Robotics link</span> Joint torque is exactly M = F·d. Sizing a servo means checking ΣM about each joint under the worst-case payload and arm reach.</div>`,
    `<span class="eyebrow">EMM201c · Chương 2 · Bài 2.1</span>
<h2>Mô men &amp; cân bằng vật rắn</h2>
<h3>Mô men của lực</h3>
<p>Một <strong>mô men</strong> (mô men xoắn) là tác dụng làm quay của lực quanh một điểm: <strong>M = F · d</strong>, với d là khoảng cách vuông góc từ điểm tới đường tác dụng. Cánh tay đòn dài hơn = quay mạnh hơn với cùng một lực.</p>
<h3>Ngẫu lực &amp; sơ đồ vật tự do</h3>
<p>Một <strong>ngẫu lực</strong> là hai lực bằng nhau, ngược chiều, song song — nó gây quay thuần, không có hợp lực. Để giải vật rắn, trước hết vẽ <strong>sơ đồ vật tự do (FBD)</strong>: tách riêng vật và đánh dấu mọi ngoại lực và phản lực.</p>
<pre><code>Cân bằng vật rắn (2D):
  ΣFx = 0
  ΣFy = 0
  ΣM  = 0    (mô men quanh một điểm bất kỳ)

Ví dụ: dầm 4 m, tải 200 N tại 3 m tính từ gối A
  ΣM quanh A: RB · 4 = 200 · 3  ->  RB = 150 N
  ΣFy: RA + RB = 200  ->  RA = 50 N
</code></pre>
<div class="callout"><span class="badge">Liên hệ robot</span> Mô men khớp chính là M = F·d. Chọn servo là kiểm ΣM quanh mỗi khớp với tải và tầm với xấu nhất.</div>`,
  ]]);

const c2q = quiz('emm201c-quiz-2', 'Quiz 2 — Moments & rigid body|||Quiz 2 — Mô men & vật rắn', [
  { id: 'q1', question: 'Mô men của lực quanh một điểm tính bằng?', options: ['M = F + d', 'M = F · d (lực nhân cánh tay đòn)', 'M = F / d', 'M = F − d'], correctIndex: 1, explanation: 'M = F·d với d là khoảng cách vuông góc tới đường tác dụng.' },
  { id: 'q2', question: 'Điều kiện cân bằng đầy đủ của vật rắn trong 2D gồm?', options: ['Chỉ ΣF = 0', 'Chỉ ΣM = 0', 'ΣFx = 0, ΣFy = 0 và ΣM = 0', 'F = ma'], correctIndex: 2, explanation: 'Vật rắn cần cả cân bằng lực lẫn cân bằng mô men.' },
  { id: 'q3', question: 'Sơ đồ vật tự do (free body diagram) dùng để?', options: ['Vẽ quỹ đạo chuyển động', 'Tách vật và đánh dấu mọi ngoại lực, phản lực', 'Tính vận tốc', 'Đo nhiệt độ'], correctIndex: 1, explanation: 'FBD cô lập vật và liệt kê toàn bộ lực tác dụng — bước đầu để giải cân bằng.' },
]);

const c3 = doc('emm201c-3-1-trusses-structures', '3.1 — Structures & trusses|||3.1 — Kết cấu & giàn',
  'Giàn (truss): thanh chịu lực dọc trục; giả thiết chốt khớp; phương pháp nút (joints) và phương pháp mặt cắt (sections); nội lực kéo/nén.',
  [[
    `<span class="eyebrow">EMM201c · Chapter 3 · Lesson 3.1</span>
<h2>Structures &amp; trusses</h2>
<h3>What a truss is</h3>
<p>A <strong>truss</strong> is a frame of straight members joined at pin joints. We assume loads act only at the joints, so each member carries only an <strong>axial force</strong> — pure tension or pure compression, never bending.</p>
<h3>Two solving methods</h3>
<ul>
<li><strong>Method of joints</strong> — apply ΣFx = 0, ΣFy = 0 at each pin. Best when you need every member force.</li>
<li><strong>Method of sections</strong> — cut through the members of interest and apply ΣM = 0 to the free part. Best when you need just a few members quickly.</li>
</ul>
<pre><code>Method of joints at a pin:
  ΣFx = 0
  ΣFy = 0
  Member force positive -> TENSION (pulls the joint)
  Member force negative -> COMPRESSION (pushes the joint)
</code></pre>
<div class="callout"><span class="badge">Robotics link</span> Robot chassis, gantries and lightweight arm links are trusses — resolving member forces tells you which strut can be thinned to save weight.</div>`,
    `<span class="eyebrow">EMM201c · Chương 3 · Bài 3.1</span>
<h2>Kết cấu &amp; giàn</h2>
<h3>Giàn là gì</h3>
<p>Một <strong>giàn</strong> là khung gồm các thanh thẳng nối tại chốt khớp. Ta giả thiết tải chỉ đặt tại nút, nên mỗi thanh chỉ chịu <strong>lực dọc trục</strong> — kéo thuần hoặc nén thuần, không có uốn.</p>
<h3>Hai phương pháp giải</h3>
<ul>
<li><strong>Phương pháp nút</strong> — áp dụng ΣFx = 0, ΣFy = 0 tại mỗi chốt. Hợp khi cần nội lực của mọi thanh.</li>
<li><strong>Phương pháp mặt cắt</strong> — cắt qua các thanh cần tìm rồi áp ΣM = 0 cho phần tách ra. Hợp khi chỉ cần vài thanh, nhanh.</li>
</ul>
<pre><code>Phương pháp nút tại một chốt:
  ΣFx = 0
  ΣFy = 0
  Nội lực dương -> KÉO (kéo nút về phía thanh)
  Nội lực âm   -> NÉN (đẩy nút ra)
</code></pre>
<div class="callout"><span class="badge">Liên hệ robot</span> Khung robot, cầu trục và thanh cánh tay nhẹ đều là giàn — tính nội lực từng thanh cho biết thanh nào có thể làm mảnh để giảm khối lượng.</div>`,
  ]]);

const c3q = quiz('emm201c-quiz-3', 'Quiz 3 — Trusses|||Quiz 3 — Giàn', [
  { id: 'q1', question: 'Trong giàn lý tưởng, mỗi thanh chịu loại nội lực nào?', options: ['Uốn', 'Xoắn', 'Lực dọc trục (kéo hoặc nén)', 'Cắt ngang'], correctIndex: 2, explanation: 'Chốt khớp + tải đặt tại nút ⇒ thanh chỉ chịu lực dọc trục.' },
  { id: 'q2', question: 'Phương pháp nào áp ΣFx = 0, ΣFy = 0 tại từng chốt?', options: ['Phương pháp nút', 'Phương pháp mặt cắt', 'Phương pháp năng lượng', 'Phương pháp Newton'], correctIndex: 0, explanation: 'Phương pháp nút giải cân bằng lực tại mỗi chốt khớp.' },
  { id: 'q3', question: 'Nội lực thanh mang dấu dương theo quy ước thường là?', options: ['Nén', 'Kéo', 'Xoắn', 'Không xác định'], correctIndex: 1, explanation: 'Dương = kéo (thanh kéo nút về phía mình); âm = nén.' },
]);

const c4 = doc('emm201c-4-1-friction-centroid', '4.1 — Friction & centroids|||4.1 — Ma sát & trọng tâm',
  'Ma sát khô (Coulomb) F ≤ μN; ma sát tĩnh vs động; trọng tâm (centroid) của diện tích; mô men quán tính (moment of inertia) I.',
  [[
    `<span class="eyebrow">EMM201c · Chapter 4 · Lesson 4.1</span>
<h2>Friction &amp; centroids</h2>
<h3>Dry (Coulomb) friction</h3>
<p>Friction resists sliding between surfaces. The maximum static friction is <strong>F = μs · N</strong> (N is the normal force); once moving, kinetic friction is <strong>F = μk · N</strong>, usually a bit smaller. Below the limit, friction only supplies as much as is needed for equilibrium.</p>
<h3>Centroid &amp; moment of inertia</h3>
<p>The <strong>centroid</strong> is the geometric center of an area — where the resultant of a distributed effect acts. The <strong>moment of inertia (I)</strong> measures how area is spread from an axis; it governs how stiff a beam is in bending.</p>
<pre><code>Friction (impending slip):
  F_max = μs · N

Centroid of a composite area:
  x_bar = Σ(Ai · xi) / ΣAi
  y_bar = Σ(Ai · yi) / ΣAi
</code></pre>
<div class="callout"><span class="badge">Robotics link</span> Wheel grip, gripper hold and a robot climbing an incline all live at the μN limit; centroid &amp; I set where a link balances and how much it flexes.</div>`,
    `<span class="eyebrow">EMM201c · Chương 4 · Bài 4.1</span>
<h2>Ma sát &amp; trọng tâm</h2>
<h3>Ma sát khô (Coulomb)</h3>
<p>Ma sát cản trượt giữa hai bề mặt. Ma sát tĩnh cực đại là <strong>F = μs · N</strong> (N là phản lực pháp tuyến); khi đã trượt, ma sát động là <strong>F = μk · N</strong>, thường nhỏ hơn chút. Dưới ngưỡng, ma sát chỉ sinh vừa đủ để giữ cân bằng.</p>
<h3>Trọng tâm &amp; mô men quán tính</h3>
<p><strong>Trọng tâm (centroid)</strong> là tâm hình học của một diện tích — nơi hợp lực của tác dụng phân bố đặt vào. <strong>Mô men quán tính (I)</strong> đo mức phân bố diện tích quanh một trục; nó quyết định độ cứng chống uốn của dầm.</p>
<pre><code>Ma sát (sắp trượt):
  F_max = μs · N

Trọng tâm của diện tích ghép:
  x_bar = Σ(Ai · xi) / ΣAi
  y_bar = Σ(Ai · yi) / ΣAi
</code></pre>
<div class="callout"><span class="badge">Liên hệ robot</span> Độ bám bánh xe, lực giữ của tay kẹp và robot leo dốc đều nằm ở ngưỡng μN; trọng tâm &amp; I quyết định vị trí cân bằng của thanh và độ võng của nó.</div>`,
  ]]);

const c4q = quiz('emm201c-quiz-4', 'Quiz 4 — Friction & centroid|||Quiz 4 — Ma sát & trọng tâm', [
  { id: 'q1', question: 'Lực ma sát tĩnh cực đại giữa hai bề mặt là?', options: ['F = μs · N', 'F = N / μs', 'F = μs + N', 'F = μs − N'], correctIndex: 0, explanation: 'F_max = μs·N; N là phản lực pháp tuyến, μs hệ số ma sát tĩnh.' },
  { id: 'q2', question: 'Trọng tâm (centroid) của một diện tích là?', options: ['Điểm nóng nhất', 'Tâm hình học nơi hợp lực phân bố đặt vào', 'Điểm cứng nhất', 'Điểm xa trục nhất'], correctIndex: 1, explanation: 'Centroid là tâm hình học của diện tích.' },
  { id: 'q3', question: 'Mô men quán tính (I) của tiết diện chủ yếu ảnh hưởng tới?', options: ['Nhiệt độ', 'Độ cứng chống uốn của dầm', 'Màu vật liệu', 'Hệ số ma sát'], correctIndex: 1, explanation: 'I đo mức phân bố diện tích quanh trục ⇒ quyết định độ cứng chống uốn.' },
]);

const c5 = doc('emm201c-5-1-kinematics', '5.1 — Kinematics|||5.1 — Động học',
  'Động học: vị trí, vận tốc, gia tốc; chuyển động thẳng (v = ds/dt, a = dv/dt); chuyển động quay (θ, ω, α); liên hệ v = ω·r.',
  [[
    `<span class="eyebrow">EMM201c · Chapter 5 · Lesson 5.1</span>
<h2>Kinematics</h2>
<h3>Describing motion (without forces)</h3>
<p><strong>Kinematics</strong> is the geometry of motion: how position, velocity and acceleration relate over time — regardless of what causes them. Velocity is the rate of change of position; acceleration is the rate of change of velocity.</p>
<h3>Linear &amp; rotational motion</h3>
<pre><code>Linear (straight-line):
  v = ds/dt          a = dv/dt
  Constant a:  v = v0 + a·t
               s = s0 + v0·t + 0.5·a·t^2

Rotational (about an axis):
  ω = dθ/dt          α = dω/dt
  Link to a point on the body:  v = ω · r
</code></pre>
<p>Rotation mirrors linear motion: angle θ replaces distance, angular velocity ω replaces v, angular acceleration α replaces a.</p>
<div class="callout"><span class="badge">Robotics link</span> Motion planning is kinematics — mapping joint angles (θ, ω, α) to the end-effector velocity through v = ω·r is the everyday math of a manipulator.</div>`,
    `<span class="eyebrow">EMM201c · Chương 5 · Bài 5.1</span>
<h2>Động học</h2>
<h3>Mô tả chuyển động (không xét lực)</h3>
<p><strong>Động học</strong> là hình học của chuyển động: vị trí, vận tốc và gia tốc liên hệ với thời gian ra sao — bất kể nguyên nhân. Vận tốc là tốc độ biến thiên vị trí; gia tốc là tốc độ biến thiên vận tốc.</p>
<h3>Chuyển động thẳng &amp; chuyển động quay</h3>
<pre><code>Thẳng (đường thẳng):
  v = ds/dt          a = dv/dt
  Khi a không đổi:  v = v0 + a·t
                    s = s0 + v0·t + 0.5·a·t^2

Quay (quanh một trục):
  ω = dθ/dt          α = dω/dt
  Liên hệ tới điểm trên vật:  v = ω · r
</code></pre>
<p>Chuyển động quay phản chiếu chuyển động thẳng: góc θ thay cho quãng đường, vận tốc góc ω thay cho v, gia tốc góc α thay cho a.</p>
<div class="callout"><span class="badge">Liên hệ robot</span> Lập quỹ đạo chính là động học — ánh xạ góc khớp (θ, ω, α) sang vận tốc đầu cuối qua v = ω·r là phép toán hằng ngày của tay máy.</div>`,
  ]]);

const c5q = quiz('emm201c-quiz-5', 'Quiz 5 — Kinematics|||Quiz 5 — Động học', [
  { id: 'q1', question: 'Gia tốc trong chuyển động thẳng được định nghĩa là?', options: ['Tốc độ biến thiên vị trí', 'Tốc độ biến thiên vận tốc (a = dv/dt)', 'Tích của lực và khối lượng', 'Khoảng cách chia thời gian'], correctIndex: 1, explanation: 'a = dv/dt; vận tốc là ds/dt.' },
  { id: 'q2', question: 'Với gia tốc a không đổi, vận tốc theo thời gian là?', options: ['v = v0 + a·t', 'v = a / t', 'v = a · t^2', 'v = v0 − t'], correctIndex: 0, explanation: 'Công thức chuyển động biến đổi đều: v = v0 + a·t.' },
  { id: 'q3', question: 'Liên hệ giữa vận tốc dài v của điểm cách trục r và vận tốc góc ω là?', options: ['v = ω / r', 'v = ω + r', 'v = ω · r', 'v = r / ω'], correctIndex: 2, explanation: 'v = ω·r nối chuyển động quay với vận tốc dài của điểm.' },
]);

const c6 = doc('emm201c-6-1-dynamics', '6.1 — Dynamics|||6.1 — Động lực học',
  'Định luật Newton F = ma; nguyên lý công-năng lượng (W = ΔKE); động lượng p = m·v và bảo toàn động lượng; xung lực.',
  [[
    `<span class="eyebrow">EMM201c · Chapter 6 · Lesson 6.1</span>
<h2>Dynamics</h2>
<h3>Newton second law</h3>
<p>Dynamics links motion to its cause. <strong>Newton second law: F = m · a</strong> — the net force equals mass times acceleration. It is the bridge from the forces of statics to the accelerations of kinematics.</p>
<h3>Work-energy &amp; momentum</h3>
<pre><code>Newton:            ΣF = m · a

Work-energy:       W = ΔKE = 0.5·m·v2^2 − 0.5·m·v1^2
  (work done by net force = change in kinetic energy)

Impulse-momentum:  F · Δt = Δ(m·v)
  p = m · v      (momentum; conserved with no external force)
</code></pre>
<p>Three viewpoints on the same motion: force-and-acceleration (F = ma), energy (good for speed over distance), and momentum (good for impacts and collisions over time).</p>
<div class="callout"><span class="badge">Robotics link</span> Torque sizing under acceleration, braking distance, and the recoil of a fast pick-and-place all come from F = ma, work-energy and momentum.</div>`,
    `<span class="eyebrow">EMM201c · Chương 6 · Bài 6.1</span>
<h2>Động lực học</h2>
<h3>Định luật II Newton</h3>
<p>Động lực học nối chuyển động với nguyên nhân của nó. <strong>Định luật II Newton: F = m · a</strong> — hợp lực bằng khối lượng nhân gia tốc. Đây là cầu nối từ lực của tĩnh học tới gia tốc của động học.</p>
<h3>Công-năng lượng &amp; động lượng</h3>
<pre><code>Newton:            ΣF = m · a

Công-năng lượng:   W = ΔKE = 0.5·m·v2^2 − 0.5·m·v1^2
  (công của hợp lực = biến thiên động năng)

Xung lực-động lượng: F · Δt = Δ(m·v)
  p = m · v      (động lượng; bảo toàn khi không có ngoại lực)
</code></pre>
<p>Ba góc nhìn cho cùng chuyển động: lực-gia tốc (F = ma), năng lượng (hợp cho tốc độ theo quãng đường), và động lượng (hợp cho va chạm theo thời gian).</p>
<div class="callout"><span class="badge">Liên hệ robot</span> Chọn mô men khi tăng tốc, quãng đường phanh, và phản lực của gắp-đặt tốc độ cao đều đến từ F = ma, công-năng lượng và động lượng.</div>`,
  ]]);

const c6q = quiz('emm201c-quiz-6', 'Quiz 6 — Dynamics|||Quiz 6 — Động lực học', [
  { id: 'q1', question: 'Định luật II Newton phát biểu là?', options: ['F = m / a', 'F = m · a', 'F = m + a', 'F = a / m'], correctIndex: 1, explanation: 'Hợp lực bằng khối lượng nhân gia tốc: F = m·a.' },
  { id: 'q2', question: 'Nguyên lý công-năng lượng nói công của hợp lực bằng?', options: ['Biến thiên động năng (ΔKE)', 'Động lượng', 'Mô men quán tính', 'Lực ma sát'], correctIndex: 0, explanation: 'W = ΔKE — công của hợp lực bằng biến thiên động năng.' },
  { id: 'q3', question: 'Động lượng của vật khối lượng m, vận tốc v là?', options: ['p = m / v', 'p = m · v', 'p = 0.5·m·v^2', 'p = m + v'], correctIndex: 1, explanation: 'p = m·v; bảo toàn khi không có ngoại lực.' },
]);

const c7 = doc('emm201c-7-1-strength-materials', '7.1 — Strength of materials|||7.1 — Sức bền vật liệu',
  'Ứng suất-biến dạng (stress-strain); ứng suất σ = P/A, τ = F/A; kéo/nén/uốn/xoắn; định luật Hooke σ = E·ε; hệ số an toàn.',
  [[
    `<span class="eyebrow">EMM201c · Chapter 7 · Lesson 7.1</span>
<h2>Strength of materials</h2>
<h3>Stress &amp; strain</h3>
<p><strong>Stress</strong> is internal force per unit area; <strong>strain</strong> is the fractional deformation. For direct loading, normal stress σ = P/A; for shear, <strong>τ = F/A</strong>. In the elastic range they are linked by <strong>Hooke law: σ = E · ε</strong> (E is Young modulus).</p>
<h3>Four basic loadings</h3>
<ul>
<li><strong>Tension / compression</strong> — axial pull or push, σ = P/A.</li>
<li><strong>Bending</strong> — a beam under transverse load; stress varies across the section.</li>
<li><strong>Torsion</strong> — twisting a shaft; shear stress grows with radius.</li>
</ul>
<pre><code>Normal stress:   σ = P / A
Shear stress:    τ = F / A
Hooke law:       σ = E · ε        ε = ΔL / L
Factor of safety: FoS = σ_yield / σ_working
</code></pre>
<div class="callout"><span class="badge">Robotics link</span> Every link, bolt and shaft is checked with σ = P/A and τ = F/A against the yield stress, then a factor of safety keeps it well below failure.</div>`,
    `<span class="eyebrow">EMM201c · Chương 7 · Bài 7.1</span>
<h2>Sức bền vật liệu</h2>
<h3>Ứng suất &amp; biến dạng</h3>
<p><strong>Ứng suất</strong> là nội lực trên một đơn vị diện tích; <strong>biến dạng</strong> là mức biến dạng tương đối. Với tải trực tiếp, ứng suất pháp σ = P/A; với cắt, <strong>τ = F/A</strong>. Trong miền đàn hồi chúng liên hệ qua <strong>định luật Hooke: σ = E · ε</strong> (E là mô đun Young).</p>
<h3>Bốn dạng tải cơ bản</h3>
<ul>
<li><strong>Kéo / nén</strong> — kéo hoặc đẩy dọc trục, σ = P/A.</li>
<li><strong>Uốn</strong> — dầm chịu tải ngang; ứng suất biến thiên qua tiết diện.</li>
<li><strong>Xoắn</strong> — vặn một trục; ứng suất cắt tăng theo bán kính.</li>
</ul>
<pre><code>Ứng suất pháp:   σ = P / A
Ứng suất cắt:    τ = F / A
Định luật Hooke: σ = E · ε        ε = ΔL / L
Hệ số an toàn:   FoS = σ_chảy / σ_làm việc
</code></pre>
<div class="callout"><span class="badge">Liên hệ robot</span> Mỗi thanh, bu lông và trục đều kiểm bằng σ = P/A và τ = F/A so với ứng suất chảy, rồi hệ số an toàn giữ nó thấp hơn nhiều so với ngưỡng hỏng.</div>`,
  ]]);

const c7q = quiz('emm201c-quiz-7', 'Quiz 7 — Strength of materials|||Quiz 7 — Sức bền vật liệu', [
  { id: 'q1', question: 'Ứng suất cắt trên tiết diện diện tích A do lực F gây ra là?', options: ['τ = A / F', 'τ = F / A', 'τ = F · A', 'τ = F − A'], correctIndex: 1, explanation: 'τ = F/A — nội lực cắt trên một đơn vị diện tích.' },
  { id: 'q2', question: 'Định luật Hooke trong miền đàn hồi phát biểu?', options: ['σ = E · ε', 'σ = E / ε', 'σ = E + ε', 'σ = ε / E'], correctIndex: 0, explanation: 'Ứng suất tỉ lệ biến dạng: σ = E·ε, với E là mô đun Young.' },
  { id: 'q3', question: 'Vặn một trục gây ra dạng tải nào?', options: ['Kéo', 'Nén', 'Uốn', 'Xoắn'], correctIndex: 3, explanation: 'Xoắn (torsion) — ứng suất cắt tăng dần theo bán kính trục.' },
]);

const c8 = doc('emm201c-8-1-machine-elements', '8.1 — Machine elements|||8.1 — Chi tiết máy',
  'Chi tiết máy: trục (shaft), ổ (bearing), bánh răng (gear, tỉ số truyền), bộ truyền đai (belt), then (key); nguyên tắc thiết kế cơ bản.',
  [[
    `<span class="eyebrow">EMM201c · Chapter 8 · Lesson 8.1</span>
<h2>Machine elements</h2>
<h3>The parts that transmit power</h3>
<ul>
<li><strong>Shaft</strong> — a rotating bar that carries torque; sized against torsion (τ = F/A on the surface) and bending.</li>
<li><strong>Bearing</strong> — supports a shaft and lets it turn with low friction (ball, roller, journal).</li>
<li><strong>Gear</strong> — transmits rotation and changes speed/torque. The <strong>gear ratio</strong> = N2/N1 (teeth); it multiplies torque and divides speed by the same factor.</li>
<li><strong>Belt &amp; pulley</strong> — transmits power over a distance; speed ratio set by pulley diameters.</li>
<li><strong>Key</strong> — a small bar that locks a gear or pulley to a shaft so they turn together.</li>
</ul>
<pre><code>Gear train:
  ratio i = N_driven / N_driver   (tooth counts)
  ω_out = ω_in / i
  T_out = T_in · i        (torque up, speed down)

Design idea: pick material &amp; size so σ_working &lt; σ_yield / FoS
</code></pre>
<div class="callout"><span class="badge">Robotics link</span> A robot joint is machine elements in miniature: a motor, a reduction gear (high ratio for torque), a shaft on bearings, and a key transmitting the twist — sized with everything from Chapters 1-7.</div>`,
    `<span class="eyebrow">EMM201c · Chương 8 · Bài 8.1</span>
<h2>Chi tiết máy</h2>
<h3>Những chi tiết truyền công suất</h3>
<ul>
<li><strong>Trục</strong> — thanh quay mang mô men xoắn; tính theo xoắn (τ = F/A trên bề mặt) và uốn.</li>
<li><strong>Ổ</strong> — đỡ trục và cho nó quay với ma sát thấp (ổ bi, ổ đũa, ổ trượt).</li>
<li><strong>Bánh răng</strong> — truyền chuyển động quay và đổi tốc độ/mô men. <strong>Tỉ số truyền</strong> = N2/N1 (số răng); nó nhân mô men và chia tốc độ theo cùng hệ số.</li>
<li><strong>Đai &amp; puly</strong> — truyền công suất qua khoảng cách; tỉ số tốc độ do đường kính puly quyết định.</li>
<li><strong>Then</strong> — thanh nhỏ khoá bánh răng hoặc puly vào trục để chúng quay cùng nhau.</li>
</ul>
<pre><code>Bộ truyền bánh răng:
  tỉ số i = N_bị dẫn / N_dẫn   (số răng)
  ω_ra = ω_vào / i
  T_ra = T_vào · i        (mô men tăng, tốc độ giảm)

Ý tưởng thiết kế: chọn vật liệu &amp; kích thước sao cho σ_làm việc &lt; σ_chảy / FoS
</code></pre>
<div class="callout"><span class="badge">Liên hệ robot</span> Một khớp robot là chi tiết máy thu nhỏ: động cơ, hộp giảm tốc (tỉ số cao để tăng mô men), trục trên ổ, và then truyền lực xoắn — tính bằng mọi thứ từ Chương 1-7.</div>`,
  ]]);

const c8q = quiz('emm201c-quiz-8', 'Quiz 8 — Machine elements|||Quiz 8 — Chi tiết máy', [
  { id: 'q1', question: 'Chi tiết nào khoá bánh răng hoặc puly vào trục để quay cùng nhau?', options: ['Ổ (bearing)', 'Then (key)', 'Đai (belt)', 'Trục (shaft)'], correctIndex: 1, explanation: 'Then (key) truyền mô men giữa trục và chi tiết lắp trên nó.' },
  { id: 'q2', question: 'Bộ truyền bánh răng có tỉ số truyền i > 1 sẽ?', options: ['Tăng tốc độ, giảm mô men', 'Tăng mô men, giảm tốc độ', 'Giữ nguyên cả hai', 'Chỉ đổi chiều quay'], correctIndex: 1, explanation: 'i > 1: T_ra = T_vào·i (mô men tăng), ω_ra = ω_vào/i (tốc độ giảm).' },
  { id: 'q3', question: 'Chi tiết máy nào đỡ trục và cho phép nó quay với ma sát thấp?', options: ['Bánh răng', 'Then', 'Ổ (bearing)', 'Đai'], correctIndex: 2, explanation: 'Ổ (ball/roller/journal) đỡ trục và giảm ma sát khi quay.' },
]);

const taiLieu = doc('emm201c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Hibbeler, Beer & Johnston, Shigley), tài liệu miễn phí, YouTube, công cụ, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">EMM201c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Engineering Mechanics &amp; Machine Elements — statics, dynamics, strength of materials and machine design — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are trusted books and free resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for EMM201c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Russell_C._Hibbeler" target="_blank" rel="noopener">Hibbeler — <em>Engineering Mechanics: Statics &amp; Dynamics</em></a></li>
<li><a href="https://en.wikipedia.org/wiki/Ferdinand_Beer" target="_blank" rel="noopener">Beer &amp; Johnston — <em>Vector Mechanics for Engineers</em></a></li>
<li><a href="https://en.wikipedia.org/wiki/Shigley%27s_Mechanical_Engineering_Design" target="_blank" rel="noopener">Shigley — <em>Mechanical Engineering Design</em></a></li>
</ul>
<h3>🌐 Free documentation</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/2-001-mechanics-materials-i-fall-2006/" target="_blank" rel="noopener">MIT OCW — Mechanics &amp; Materials</a></li>
<li><a href="https://en.wikibooks.org/wiki/Statics" target="_blank" rel="noopener">Wikibooks — Statics</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@TheEfficientEngineer" target="_blank" rel="noopener">The Efficient Engineer</a> — statics, stress &amp; machine design, visual</li>
<li><a href="https://www.youtube.com/@JeffHanson" target="_blank" rel="noopener">Jeff Hanson</a> — worked statics &amp; dynamics problems</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://skyciv.com/free-truss-calculator/" target="_blank" rel="noopener">SkyCiv Truss Calculator</a> — solve member forces online</li>
<li><a href="https://www.geogebra.org/" target="_blank" rel="noopener">GeoGebra</a> — plot force vectors &amp; motion</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Statics core</strong> — forces &amp; equilibrium (ΣF = 0, ΣM = 0), free-body diagrams, trusses, friction.</li>
<li><strong>Motion</strong> — kinematics (position/velocity/acceleration), then dynamics with F = ma, energy and momentum.</li>
<li><strong>Materials</strong> — stress-strain, σ = P/A, τ = F/A, Hooke law and factor of safety.</li>
<li><strong>Machine design</strong> — shafts, bearings, gears, belts &amp; keys; size a real robot joint end to end.</li>
</ol></div>`,
    `<span class="eyebrow">EMM201c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Cơ học kỹ thuật &amp; chi tiết máy — tĩnh học, động lực học, sức bền vật liệu và thiết kế máy — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là sách chuẩn và nguồn miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của EMM201c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Russell_C._Hibbeler" target="_blank" rel="noopener">Hibbeler — <em>Engineering Mechanics: Statics &amp; Dynamics</em></a></li>
<li><a href="https://en.wikipedia.org/wiki/Ferdinand_Beer" target="_blank" rel="noopener">Beer &amp; Johnston — <em>Vector Mechanics for Engineers</em></a></li>
<li><a href="https://en.wikipedia.org/wiki/Shigley%27s_Mechanical_Engineering_Design" target="_blank" rel="noopener">Shigley — <em>Mechanical Engineering Design</em></a></li>
</ul>
<h3>🌐 Tài liệu miễn phí</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/2-001-mechanics-materials-i-fall-2006/" target="_blank" rel="noopener">MIT OCW — Cơ học &amp; vật liệu</a></li>
<li><a href="https://en.wikibooks.org/wiki/Statics" target="_blank" rel="noopener">Wikibooks — Tĩnh học (Statics)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@TheEfficientEngineer" target="_blank" rel="noopener">The Efficient Engineer</a> — tĩnh học, ứng suất &amp; thiết kế máy, trực quan</li>
<li><a href="https://www.youtube.com/@JeffHanson" target="_blank" rel="noopener">Jeff Hanson</a> — bài giải tĩnh học &amp; động lực học</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://skyciv.com/free-truss-calculator/" target="_blank" rel="noopener">SkyCiv Truss Calculator</a> — giải nội lực giàn trực tuyến</li>
<li><a href="https://www.geogebra.org/" target="_blank" rel="noopener">GeoGebra</a> — vẽ vector lực &amp; chuyển động</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Lõi tĩnh học</strong> — lực &amp; cân bằng (ΣF = 0, ΣM = 0), sơ đồ vật tự do, giàn, ma sát.</li>
<li><strong>Chuyển động</strong> — động học (vị trí/vận tốc/gia tốc), rồi động lực học với F = ma, năng lượng và động lượng.</li>
<li><strong>Vật liệu</strong> — ứng suất-biến dạng, σ = P/A, τ = F/A, định luật Hooke và hệ số an toàn.</li>
<li><strong>Thiết kế máy</strong> — trục, ổ, bánh răng, đai &amp; then; tính một khớp robot thật từ đầu tới cuối.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'EMM201c',
    slug: 'emm201c-engineering-mechanics-and-machine-elements',
    title: 'Engineering Mechanics and Machine Elements',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/EMM201c.webp',
    shortDescription: 'Statics & dynamics for robotics — forces & equilibrium (ΣF=0, ΣM=0), free-body diagrams, trusses, friction, kinematics, Newton (F=ma), stress-strain (τ=F/A) & machine elements (shafts, bearings, gears). Bilingual, worked examples & quizzes.|||Tĩnh học & động lực học cho robot — lực & cân bằng (ΣF=0, ΣM=0), sơ đồ vật tự do, giàn, ma sát, động học, Newton (F=ma), sức bền (τ=F/A) & chi tiết máy (trục, ổ, bánh răng). Song ngữ, ví dụ & quiz.',
    description: 'Môn <strong>EMM201c — Engineering Mechanics and Machine Elements</strong> (kỳ 2, ngành Robotics &amp; AI) trang bị nền tảng cơ học sau mỗi cánh tay và bộ truyền động. Từ <strong>tĩnh học</strong> (lực &amp; cân bằng ΣF=0, mô men ΣM=0, giàn, ma sát, trọng tâm) → <strong>động học &amp; động lực học</strong> (vị trí/vận tốc/gia tốc, Newton F=ma, công-năng lượng, động lượng) → <strong>sức bền vật liệu</strong> (ứng suất-biến dạng, τ=F/A, Hooke) → <strong>chi tiết máy</strong> (trục, ổ, bánh răng, đai, then). Bám sách chuẩn Hibbeler, Beer &amp; Johnston và Shigley; song ngữ, có công thức, ví dụ giải và quiz mỗi chương.',
    whatYouLearn: 'Lực là vector &amp; cân bằng chất điểm (ΣF=0); mô men M=F·d &amp; cân bằng vật rắn (ΣM=0), sơ đồ vật tự do; giàn (phương pháp nút/mặt cắt); ma sát Coulomb (F=μN), trọng tâm &amp; mô men quán tính; động học thẳng/quay (v=ω·r); động lực học Newton (F=ma), công-năng lượng, động lượng; sức bền (σ=P/A, τ=F/A, Hooke σ=E·ε, hệ số an toàn); chi tiết máy (trục, ổ, bánh răng &amp; tỉ số truyền, đai, then).',
    requirements: 'Toán/vật lý phổ thông (vector, đạo hàm cơ bản, lực và chuyển động). Không cần kiến thức cơ khí trước đó.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, tài liệu miễn phí, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Cơ học kỹ thuật, tĩnh học vs động lực học, lộ trình 4 bước.', lessons: [intro] },
    { title: 'Chương 1 — Tĩnh học: lực & cân bằng|||Chapter 1 — Statics: forces & equilibrium', description: 'Lực vector, hệ đồng quy, ΣF=0.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Mô men & cân bằng vật rắn|||Chapter 2 — Moments & rigid-body equilibrium', description: 'M=F·d, ngẫu lực, FBD, ΣM=0.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Kết cấu & giàn|||Chapter 3 — Structures & trusses', description: 'Giàn, phương pháp nút/mặt cắt, nội lực.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Ma sát & trọng tâm|||Chapter 4 — Friction & centroids', description: 'Ma sát Coulomb, trọng tâm, mô men quán tính.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Động học|||Chapter 5 — Kinematics', description: 'Vị trí/vận tốc/gia tốc, chuyển động thẳng & quay.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Động lực học|||Chapter 6 — Dynamics', description: 'Newton F=ma, công-năng lượng, động lượng.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Sức bền vật liệu|||Chapter 7 — Strength of materials', description: 'Ứng suất-biến dạng, τ=F/A, Hooke, hệ số an toàn.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Chi tiết máy|||Chapter 8 — Machine elements', description: 'Trục, ổ, bánh răng, đai, then, thiết kế cơ bản.', lessons: [c8, c8q] },
  ],
};
