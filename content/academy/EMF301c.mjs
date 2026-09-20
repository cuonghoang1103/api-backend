/**
 * EMF301c — Electromagnetic Field Theory and Microwave Fundamentals.
 * Ngành Thiết kế vi mạch bán dẫn, kỳ 4, FPTU. Giáo trình: Sadiku, Pozar,
 * Ulaby, Balanis. 8 chương: giải tích vector & tĩnh điện; tĩnh từ; hệ Maxwell;
 * sóng phẳng; đường truyền & Smith chart; ống dẫn sóng; tham số S; anten.
 * Song ngữ VI+EN. ⚠️ KHÔNG backtick lồng/${; KHÔNG ký tự Hy Lạp/Cyrillic —
 * viết "omega","epsilon","mu" bằng chữ Latin. "&"→&amp;, "<"→&lt;, ">"→&gt;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('emf301c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Giáo trình chuẩn (Sadiku, Pozar, Ulaby, Balanis), tài liệu miễn phí, YouTube, công cụ (Smith chart, mô phỏng trường), lộ trình tự học.',
  [[
    `<span class="eyebrow">EMF301c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>electromagnetic field theory &amp; microwave fundamentals</strong> — from vector calculus and Maxwell's equations to transmission lines, waveguides, S-parameters and antennas — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are the standard textbooks (cited, not uploaded) plus free, legal resources.</p>
<h3>📘 Standard textbooks (cited)</h3>
<ul>
<li>Sadiku — <em>Elements of Electromagnetics</em> (Oxford). The core FPTU reference: vector calculus, statics, Maxwell, waves, lines.</li>
<li>Pozar — <em>Microwave Engineering</em> (Wiley). Transmission lines, Smith chart, waveguides, S-parameters, components.</li>
<li>Ulaby — <em>Fundamentals of Applied Electromagnetics</em> (Pearson). Very approachable; strong on plane waves and lines.</li>
<li>Balanis — <em>Advanced Engineering Electromagnetics</em> (Wiley). Rigorous treatment; also his <em>Antenna Theory</em> for chapter 8.</li>
</ul>
<h3>🌐 Free / official resources</h3>
<ul>
<li><a href="https://ocw.mit.edu/" target="_blank" rel="noopener">MIT OpenCourseWare — Electromagnetics &amp; Applications</a></li>
<li><a href="https://www.allaboutcircuits.com/textbook/" target="_blank" rel="noopener">All About Circuits — textbook (transmission lines chapter)</a></li>
<li><a href="https://en.wikipedia.org/wiki/Maxwell%27s_equations" target="_blank" rel="noopener">Maxwell's equations — overview &amp; forms</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@eevblog" target="_blank" rel="noopener">EEVblog</a> — practical RF &amp; measurement</li>
<li><a href="https://www.youtube.com/@MicrowavesRF" target="_blank" rel="noopener">Microwaves &amp; RF</a> — microwave engineering topics</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.will-kelsey.com/smith_chart/" target="_blank" rel="noopener">Online Smith chart tool</a> — impedance matching practice</li>
<li><a href="https://www.falstad.com/emstatic/" target="_blank" rel="noopener">Falstad EM field simulators</a> — visualise fields and waves</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Math first</strong> — vector calculus (grad/div/curl), then electro- and magnetostatics.</li>
<li><strong>Unify</strong> — Maxwell's equations tie statics together and predict waves.</li>
<li><strong>Guided waves</strong> — transmission lines &amp; the Smith chart, then waveguides.</li>
<li><strong>Systems</strong> — describe components with S-parameters; radiate with antennas.</li>
</ol></div>`,
    `<span class="eyebrow">EMF301c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>lý thuyết trường điện từ &amp; cơ sở siêu cao tần</strong> — từ giải tích vector và hệ phương trình Maxwell đến đường truyền, ống dẫn sóng, tham số S và anten — gom về một chỗ. Slide &amp; đề cương chính thức nằm trên <strong>FLM</strong>; bên dưới là các giáo trình chuẩn (trích dẫn, KHÔNG upload) cùng nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình chuẩn (trích dẫn)</h3>
<ul>
<li>Sadiku — <em>Elements of Electromagnetics</em> (Oxford). Tài liệu lõi FPTU: giải tích vector, tĩnh điện/từ, Maxwell, sóng, đường truyền.</li>
<li>Pozar — <em>Microwave Engineering</em> (Wiley). Đường truyền, đồ thị Smith, ống dẫn sóng, tham số S, linh kiện.</li>
<li>Ulaby — <em>Fundamentals of Applied Electromagnetics</em> (Pearson). Dễ tiếp cận; mạnh về sóng phẳng và đường truyền.</li>
<li>Balanis — <em>Advanced Engineering Electromagnetics</em> (Wiley). Chặt chẽ; kèm <em>Antenna Theory</em> cho chương 8.</li>
</ul>
<h3>🌐 Tài liệu miễn phí / chính thức</h3>
<ul>
<li><a href="https://ocw.mit.edu/" target="_blank" rel="noopener">MIT OpenCourseWare — Electromagnetics &amp; Applications</a></li>
<li><a href="https://www.allaboutcircuits.com/textbook/" target="_blank" rel="noopener">All About Circuits — giáo trình (chương đường truyền)</a></li>
<li><a href="https://en.wikipedia.org/wiki/Maxwell%27s_equations" target="_blank" rel="noopener">Hệ phương trình Maxwell — tổng quan &amp; các dạng</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@eevblog" target="_blank" rel="noopener">EEVblog</a> — RF &amp; đo lường thực tế</li>
<li><a href="https://www.youtube.com/@MicrowavesRF" target="_blank" rel="noopener">Microwaves &amp; RF</a> — chủ đề kỹ thuật siêu cao tần</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.will-kelsey.com/smith_chart/" target="_blank" rel="noopener">Công cụ đồ thị Smith trực tuyến</a> — luyện phối hợp trở kháng</li>
<li><a href="https://www.falstad.com/emstatic/" target="_blank" rel="noopener">Trình mô phỏng trường EM của Falstad</a> — trực quan hoá trường và sóng</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Toán trước</strong> — giải tích vector (grad/div/curl), rồi tĩnh điện và tĩnh từ.</li>
<li><strong>Hợp nhất</strong> — hệ Maxwell nối các phần tĩnh và tiên đoán sóng.</li>
<li><strong>Sóng dẫn hướng</strong> — đường truyền &amp; đồ thị Smith, rồi ống dẫn sóng.</li>
<li><strong>Hệ thống</strong> — mô tả linh kiện bằng tham số S; bức xạ bằng anten.</li>
</ol></div>`,
  ]]);

const intro = doc('emf301c-0-1-overview', 'Course overview: EM field theory & microwave fundamentals|||Tổng quan: Trường điện từ & cơ sở siêu cao tần',
  'Môn học làm gì; vì sao trường điện từ nền cho RF/vi mạch; lộ trình 8 chương: giải tích vector & tĩnh điện → tĩnh từ → Maxwell → sóng phẳng → đường truyền/Smith → ống dẫn sóng → tham số S → anten.',
  [[
    `<span class="eyebrow">EMF301c · Lesson 0.1 · Overview</span>
<h2>Electromagnetic field theory &amp; microwave fundamentals</h2>
<p class="lead">This course explains <strong>how electric and magnetic fields behave</strong>, how <strong>Maxwell's equations</strong> unify them into electromagnetic waves, and how those waves are <strong>guided, measured and radiated</strong> at microwave frequencies — the physics beneath every RF chip, antenna and high-speed interconnect in semiconductor design.</p>
<h3>Why it matters for IC design</h3>
<ul>
<li>At GHz frequencies a wire is no longer "just a wire" — it is a <strong>transmission line</strong> with impedance, delay and reflections.</li>
<li>Signal integrity, RF front-ends and on-chip interconnect all obey the same field equations.</li>
<li>Components are characterised by <strong>S-parameters</strong>, the language of every RF datasheet and simulator.</li>
</ul>
<h3>Roadmap (8 chapters)</h3>
<p>Vector calculus &amp; electrostatics → magnetostatics → Maxwell's equations &amp; time-varying fields → uniform plane waves → transmission lines &amp; the Smith chart → waveguides → microwave network parameters (S-parameters) → antennas &amp; microwave components. Bilingual, with worked equations and a quiz per chapter.</p>
<div class="callout"><span class="badge">One thread</span> Fields (statics) → Maxwell (dynamics) → guided waves (lines, guides) → systems (S-parameters, antennas). Each chapter builds on the last.</div>`,
    `<span class="eyebrow">EMF301c · Bài 0.1 · Tổng quan</span>
<h2>Lý thuyết trường điện từ &amp; cơ sở siêu cao tần</h2>
<p class="lead">Môn này giải thích <strong>trường điện và trường từ ứng xử ra sao</strong>, <strong>hệ phương trình Maxwell</strong> hợp nhất chúng thành sóng điện từ thế nào, và các sóng đó được <strong>dẫn hướng, đo đạc và bức xạ</strong> ở tần số siêu cao ra sao — nền vật lý dưới mọi chip RF, anten và đường liên kết tốc độ cao trong thiết kế bán dẫn.</p>
<h3>Vì sao quan trọng với thiết kế vi mạch</h3>
<ul>
<li>Ở tần số GHz, một sợi dây không còn "chỉ là dây" — nó là <strong>đường truyền</strong> có trở kháng, trễ và phản xạ.</li>
<li>Toàn vẹn tín hiệu, tầng đầu RF và liên kết trên chip đều tuân cùng hệ phương trình trường.</li>
<li>Linh kiện được đặc trưng bằng <strong>tham số S</strong> — ngôn ngữ của mọi datasheet RF và trình mô phỏng.</li>
</ul>
<h3>Lộ trình (8 chương)</h3>
<p>Giải tích vector &amp; tĩnh điện → tĩnh từ → hệ Maxwell &amp; trường biến thiên → sóng phẳng đồng nhất → đường truyền &amp; đồ thị Smith → ống dẫn sóng → tham số mạng siêu cao tần (tham số S) → anten &amp; linh kiện siêu cao tần. Song ngữ, có công thức mẫu và quiz mỗi chương.</p>
<div class="callout"><span class="badge">Một mạch xuyên suốt</span> Trường (tĩnh) → Maxwell (động) → sóng dẫn hướng (đường truyền, ống dẫn) → hệ thống (tham số S, anten). Mỗi chương dựng trên chương trước.</div>`,
  ]]);

const c1 = doc('emf301c-1-1-vector-electrostatics', '1.1 — Vector calculus & electrostatics|||1.1 — Giải tích vector & tĩnh điện',
  'Hệ toạ độ & vector; grad/div/curl; định luật Coulomb & trường E; định luật Gauss; điện thế V; E = -grad V; tụ điện & năng lượng.',
  [[
    `<span class="eyebrow">EMF301c · Chapter 1 · Lesson 1.1</span>
<h2>Vector calculus &amp; electrostatics</h2>
<h3>The three vector operators</h3>
<ul>
<li><strong>Gradient (grad V)</strong> — turns a scalar field into the vector pointing "most uphill"; its size is the steepest slope.</li>
<li><strong>Divergence (div D)</strong> — measures how much a vector field flows OUT of a point (a source or sink).</li>
<li><strong>Curl (curl E)</strong> — measures the rotation, or "circulation", of a vector field around a point.</li>
</ul>
<h3>Coulomb's law &amp; the electric field</h3>
<p>Two charges attract/repel with a force proportional to the product of charges over distance squared. The <strong>electric field E</strong> is force per unit charge. Sadiku's core electrostatics results:</p>
<pre><code>Coulomb force:  F = (1 / (4*pi*epsilon)) * (Q1*Q2 / r^2)
Electric field: E = F / q      (units: volt per metre)
Gauss's law (integral):  surface_integral(D dot dS) = Q_enclosed
Gauss's law (point):     div D = rho          (D = epsilon * E)
Potential:               E = - grad V
Capacitance:             C = Q / V
Stored energy:           W = (1/2) * C * V^2
</code></pre>
<p>Here <strong>epsilon</strong> is the permittivity, <strong>rho</strong> the volume charge density, and <strong>D</strong> the electric flux density.</p>
<div class="callout"><span class="badge">Key idea</span> Gauss's law lets you find E from symmetry alone — draw a surface, count the enclosed charge, done. It reappears as Maxwell's first equation.</div>`,
    `<span class="eyebrow">EMF301c · Chương 1 · Bài 1.1</span>
<h2>Giải tích vector &amp; tĩnh điện</h2>
<h3>Ba toán tử vector</h3>
<ul>
<li><strong>Gradient (grad V)</strong> — biến trường vô hướng thành vector chỉ hướng "dốc lên nhất"; độ lớn là độ dốc lớn nhất.</li>
<li><strong>Divergence (div D)</strong> — đo lượng trường vector chảy RA khỏi một điểm (nguồn hoặc hố).</li>
<li><strong>Curl (curl E)</strong> — đo độ xoáy, hay "lưu số", của trường vector quanh một điểm.</li>
</ul>
<h3>Định luật Coulomb &amp; trường điện</h3>
<p>Hai điện tích hút/đẩy với lực tỉ lệ tích điện tích chia khoảng cách bình phương. <strong>Trường điện E</strong> là lực trên một đơn vị điện tích. Các kết quả tĩnh điện lõi theo Sadiku:</p>
<pre><code>Lực Coulomb:  F = (1 / (4*pi*epsilon)) * (Q1*Q2 / r^2)
Truong dien:  E = F / q      (don vi: volt tren met)
Dinh luat Gauss (tich phan): surface_integral(D dot dS) = Q_bao
Dinh luat Gauss (diem):      div D = rho          (D = epsilon * E)
Dien the:                    E = - grad V
Dien dung:                   C = Q / V
Nang luong tich:             W = (1/2) * C * V^2
</code></pre>
<p>Ở đây <strong>epsilon</strong> là độ điện thẩm, <strong>rho</strong> là mật độ điện tích khối, và <strong>D</strong> là mật độ thông lượng điện.</p>
<div class="callout"><span class="badge">Ý chính</span> Định luật Gauss cho phép tìm E chỉ nhờ tính đối xứng — vẽ một mặt kín, đếm điện tích bao bên trong là xong. Nó tái xuất thành phương trình Maxwell thứ nhất.</div>`,
  ]]);

const c1q = quiz('emf301c-quiz-1', 'Quiz 1 — Vector & electrostatics|||Quiz 1 — Vector & tĩnh điện', [
  { id: 'q1', question: 'Toán tử nào đo "trường chảy RA khỏi một điểm" (nguồn/hố)?', options: ['Gradient', 'Divergence (div)', 'Curl', 'Laplacian'], correctIndex: 1, explanation: 'Divergence đo thông lượng ròng ra khỏi một điểm — dương ở nguồn, âm ở hố.' },
  { id: 'q2', question: 'Liên hệ giữa trường điện E và điện thế V là?', options: ['E = grad V', 'E = -grad V', 'E = div V', 'E = curl V'], correctIndex: 1, explanation: 'E hướng theo chiều giảm nhanh nhất của thế: E = -grad V.' },
  { id: 'q3', question: 'Định luật Gauss dạng điểm phát biểu?', options: ['div D = rho', 'curl E = 0', 'div B = 0', 'E = Q/V'], correctIndex: 0, explanation: 'div D = rho: mật độ thông lượng điện phân kỳ tại nơi có mật độ điện tích rho.' },
]);

const c2 = doc('emf301c-2-1-magnetostatics', '2.1 — Magnetostatics|||2.1 — Tĩnh từ',
  'Định luật Biot-Savart & Ampere; trường H và B; div B = 0 (không đơn cực từ); thế vector từ A; điện cảm & năng lượng từ; vật liệu từ.',
  [[
    `<span class="eyebrow">EMF301c · Chapter 2 · Lesson 2.1</span>
<h2>Magnetostatics</h2>
<h3>Steady currents make magnetic fields</h3>
<p>A constant current produces a static magnetic field. Two laws give it to us:</p>
<ul>
<li><strong>Biot-Savart law</strong> — the field of a small current element, summed over the whole wire.</li>
<li><strong>Ampere's circuital law</strong> — the circulation of H around a loop equals the current threading it (the magnetostatic shortcut, like Gauss for E).</li>
</ul>
<pre><code>Ampere's law (integral):  line_integral(H dot dl) = I_enclosed
Ampere's law (point):     curl H = J          (J = current density)
No magnetic monopoles:    div B = 0
Constitutive relation:    B = mu * H          (mu = permeability)
Inductance:               L = flux_linkage / I
Stored energy:            W = (1/2) * L * I^2
</code></pre>
<p><strong>H</strong> is the magnetic field intensity, <strong>B</strong> the magnetic flux density, <strong>mu</strong> the permeability, and <strong>J</strong> the current density.</p>
<h3>div B = 0 — the deep asymmetry</h3>
<p>Unlike charges, there are no isolated magnetic "north" poles: magnetic field lines always close on themselves. That is why <strong>div B = 0</strong> everywhere — one of the four Maxwell equations already in hand.</p>
<div class="callout"><span class="badge">Symmetry note</span> Compare: div D = rho (electric charges exist) versus div B = 0 (magnetic monopoles do not). This asymmetry survives all the way into Maxwell's equations.</div>`,
    `<span class="eyebrow">EMF301c · Chương 2 · Bài 2.1</span>
<h2>Tĩnh từ</h2>
<h3>Dòng ổn định sinh trường từ</h3>
<p>Dòng điện không đổi tạo ra trường từ tĩnh. Hai định luật cho ta điều đó:</p>
<ul>
<li><strong>Định luật Biot-Savart</strong> — trường của một phần tử dòng nhỏ, cộng trên toàn dây.</li>
<li><strong>Định luật Ampere</strong> — lưu số của H quanh một vòng bằng dòng xuyên qua nó (lối tắt của tĩnh từ, giống Gauss cho E).</li>
</ul>
<pre><code>Dinh luat Ampere (tich phan):  line_integral(H dot dl) = I_bao
Dinh luat Ampere (diem):       curl H = J          (J = mat do dong)
Khong co don cuc tu:           div B = 0
He thuc vat chat:              B = mu * H          (mu = do tu tham)
Dien cam:                      L = tu_thong_moc / I
Nang luong tich:               W = (1/2) * L * I^2
</code></pre>
<p><strong>H</strong> là cường độ trường từ, <strong>B</strong> là mật độ thông lượng từ, <strong>mu</strong> là độ từ thẩm, và <strong>J</strong> là mật độ dòng.</p>
<h3>div B = 0 — sự bất đối xứng sâu xa</h3>
<p>Khác với điện tích, không có cực từ "bắc" cô lập: đường sức từ luôn khép kín. Vì thế <strong>div B = 0</strong> ở mọi nơi — một trong bốn phương trình Maxwell đã nắm sẵn.</p>
<div class="callout"><span class="badge">Lưu ý đối xứng</span> So sánh: div D = rho (có điện tích) với div B = 0 (không có đơn cực từ). Sự bất đối xứng này còn theo tới tận hệ phương trình Maxwell.</div>`,
  ]]);

const c2q = quiz('emf301c-quiz-2', 'Quiz 2 — Magnetostatics|||Quiz 2 — Tĩnh từ', [
  { id: 'q1', question: 'Phương trình div B = 0 phản ánh điều gì?', options: ['Điện tích luôn dương', 'Không tồn tại đơn cực từ (đường sức từ khép kín)', 'Dòng điện bằng 0', 'Trường B luôn bằng 0'], correctIndex: 1, explanation: 'Không có cực từ cô lập; đường sức từ luôn khép kín nên div B = 0.' },
  { id: 'q2', question: 'Định luật Ampere dạng điểm (tĩnh) viết là?', options: ['curl H = J', 'div H = rho', 'curl E = 0', 'B = mu/H'], correctIndex: 0, explanation: 'curl H = J: dòng dẫn J sinh ra xoáy của trường H.' },
  { id: 'q3', question: 'Năng lượng tích trong một cuộn cảm là?', options: ['W = C*V', 'W = (1/2)*L*I^2', 'W = L*I', 'W = (1/2)*Q*V'], correctIndex: 1, explanation: 'Năng lượng từ trong điện cảm: W = (1/2)*L*I^2.' },
]);

const c3 = doc('emf301c-3-1-maxwell', '3.1 — Maxwell equations & time-varying fields|||3.1 — Hệ Maxwell & trường biến thiên',
  'Định luật Faraday; dòng dịch của Maxwell; bốn phương trình Maxwell (vi phân & tích phân); phương trình sóng; điều kiện biên.',
  [[
    `<span class="eyebrow">EMF301c · Chapter 3 · Lesson 3.1</span>
<h2>Maxwell's equations &amp; time-varying fields</h2>
<h3>Two new time-dependent effects</h3>
<ul>
<li><strong>Faraday's law</strong> — a changing magnetic field induces an electric field (the basis of transformers and generators): curl E = -dB/dt.</li>
<li><strong>Maxwell's displacement current</strong> — a changing electric field acts like a current and creates a magnetic field. Adding dD/dt to Ampere's law was the crucial step that predicted electromagnetic waves.</li>
</ul>
<h3>The four equations (differential form)</h3>
<pre><code>div D = rho              (Gauss's law: charges make E)
div B = 0                (no magnetic monopoles)
curl E = - dB/dt         (Faraday: changing B makes E)
curl H = J + dD/dt       (Ampere-Maxwell: current + changing D make H)
</code></pre>
<p>In a source-free region these combine into the <strong>wave equation</strong>, whose solution travels at the speed of light:</p>
<pre><code>del^2 E = mu*epsilon * d^2E/dt^2
wave speed:  v = 1 / sqrt(mu * epsilon)   (= c in vacuum)
</code></pre>
<h3>Boundary conditions</h3>
<p>At an interface, the <strong>tangential E</strong> and <strong>tangential H</strong> are continuous (unless a surface current flows), while normal <strong>D</strong> and <strong>B</strong> jump by any surface charge. These rules stitch solutions together across materials.</p>
<div class="callout"><span class="badge">The punchline</span> The displacement-current term means E and H can sustain each other with no charges present — a self-propagating wave. Light, radio and microwaves are all the same thing.</div>`,
    `<span class="eyebrow">EMF301c · Chương 3 · Bài 3.1</span>
<h2>Hệ phương trình Maxwell &amp; trường biến thiên</h2>
<h3>Hai hiệu ứng phụ thuộc thời gian mới</h3>
<ul>
<li><strong>Định luật Faraday</strong> — từ trường biến thiên cảm ứng ra điện trường (nền của máy biến áp và máy phát): curl E = -dB/dt.</li>
<li><strong>Dòng dịch của Maxwell</strong> — điện trường biến thiên hoạt động như một dòng và sinh ra từ trường. Thêm dD/dt vào định luật Ampere là bước then chốt tiên đoán sóng điện từ.</li>
</ul>
<h3>Bốn phương trình (dạng vi phân)</h3>
<pre><code>div D = rho              (Gauss: dien tich sinh E)
div B = 0                (khong co don cuc tu)
curl E = - dB/dt         (Faraday: B bien thien sinh E)
curl H = J + dD/dt       (Ampere-Maxwell: dong + D bien thien sinh H)
</code></pre>
<p>Trong vùng không nguồn, chúng kết hợp thành <strong>phương trình sóng</strong>, nghiệm truyền đi với tốc độ ánh sáng:</p>
<pre><code>del^2 E = mu*epsilon * d^2E/dt^2
toc do song:  v = 1 / sqrt(mu * epsilon)   (= c trong chan khong)
</code></pre>
<h3>Điều kiện biên</h3>
<p>Tại mặt phân cách, <strong>E tiếp tuyến</strong> và <strong>H tiếp tuyến</strong> liên tục (trừ khi có dòng mặt), còn <strong>D</strong> và <strong>B</strong> pháp tuyến nhảy theo điện tích mặt. Các quy tắc này khâu các nghiệm lại qua ranh giới vật liệu.</p>
<div class="callout"><span class="badge">Điểm chốt</span> Số hạng dòng dịch nghĩa là E và H có thể nuôi nhau mà không cần điện tích — một sóng tự lan truyền. Ánh sáng, sóng radio và siêu cao tần đều là một thứ.</div>`,
  ]]);

const c3q = quiz('emf301c-quiz-3', 'Quiz 3 — Maxwell|||Quiz 3 — Maxwell', [
  { id: 'q1', question: 'Đóng góp then chốt của Maxwell vào định luật Ampere là?', options: ['Bỏ số hạng dòng dẫn', 'Thêm dòng dịch dD/dt', 'Đổi dấu curl', 'Thêm div B'], correctIndex: 1, explanation: 'Dòng dịch dD/dt cho phép trường tự lan truyền, tiên đoán sóng điện từ.' },
  { id: 'q2', question: 'Định luật Faraday dạng vi phân là?', options: ['curl E = -dB/dt', 'div D = rho', 'curl H = J', 'div B = 0'], correctIndex: 0, explanation: 'Từ trường biến thiên cảm ứng điện trường xoáy: curl E = -dB/dt.' },
  { id: 'q3', question: 'Tốc độ sóng điện từ trong môi trường là?', options: ['v = mu*epsilon', 'v = 1/sqrt(mu*epsilon)', 'v = sqrt(mu*epsilon)', 'v = mu/epsilon'], correctIndex: 1, explanation: 'v = 1/sqrt(mu*epsilon); trong chân không bằng tốc độ ánh sáng c.' },
]);

const c4 = doc('emf301c-4-1-plane-waves', '4.1 — Uniform plane waves & propagation|||4.1 — Sóng phẳng đồng nhất & lan truyền',
  'Sóng phẳng đồng nhất; hằng số truyền & pha; trở kháng nội của môi trường; sóng trong điện môi tổn hao & vật dẫn (độ sâu thấm); phân cực; vector Poynting.',
  [[
    `<span class="eyebrow">EMF301c · Chapter 4 · Lesson 4.1</span>
<h2>Uniform plane waves &amp; propagation</h2>
<h3>The simplest solution of Maxwell's equations</h3>
<p>A <strong>uniform plane wave</strong> has E and H perpendicular to each other and to the direction of travel (a TEM wave). For a wave going in the z-direction:</p>
<pre><code>E(z,t) = E0 * cos(omega*t - beta*z)
phase constant:   beta = omega * sqrt(mu*epsilon) = 2*pi / wavelength
wave impedance:   eta = E / H = sqrt(mu / epsilon)   (about 377 ohm in free space)
time-avg power:   S_avg = (1/2) * E0^2 / eta         (Poynting vector)
</code></pre>
<p>Here <strong>omega</strong> is angular frequency, <strong>beta</strong> the phase constant, and <strong>eta</strong> the intrinsic impedance of the medium.</p>
<h3>Lossy media &amp; skin depth</h3>
<p>In a conductor the wave decays as it penetrates. The <strong>skin depth</strong> is the distance over which the amplitude falls to about 37 percent — it shrinks as frequency rises, which is why microwave currents crowd onto the surface of a conductor:</p>
<pre><code>attenuation:  E = E0 * exp(-alpha*z) * cos(omega*t - beta*z)
skin depth:   delta = 1 / sqrt(pi * f * mu * sigma)
</code></pre>
<h3>Polarisation</h3>
<p>The direction the E-vector traces defines <strong>linear, circular or elliptical</strong> polarisation — critical for antennas and satellite links.</p>
<div class="callout"><span class="badge">Why 377 ohm matters</span> Free-space impedance eta = sqrt(mu0/epsilon0) about 377 ohm sets how antennas radiate and how much power a plane wave carries.</div>`,
    `<span class="eyebrow">EMF301c · Chương 4 · Bài 4.1</span>
<h2>Sóng phẳng đồng nhất &amp; lan truyền</h2>
<h3>Nghiệm đơn giản nhất của hệ Maxwell</h3>
<p>Một <strong>sóng phẳng đồng nhất</strong> có E và H vuông góc với nhau và với hướng truyền (sóng TEM). Với sóng đi theo hướng z:</p>
<pre><code>E(z,t) = E0 * cos(omega*t - beta*z)
hang so pha:      beta = omega * sqrt(mu*epsilon) = 2*pi / buoc_song
tro khang song:   eta = E / H = sqrt(mu / epsilon)   (khoang 377 ohm trong khong gian tu do)
cong suat TB:     S_tb = (1/2) * E0^2 / eta          (vector Poynting)
</code></pre>
<p>Ở đây <strong>omega</strong> là tần số góc, <strong>beta</strong> là hằng số pha, và <strong>eta</strong> là trở kháng nội của môi trường.</p>
<h3>Môi trường tổn hao &amp; độ sâu thấm</h3>
<p>Trong vật dẫn, sóng suy giảm khi thấm vào. <strong>Độ sâu thấm (skin depth)</strong> là khoảng cách để biên độ giảm còn khoảng 37 phần trăm — nó co lại khi tần số tăng, đó là lý do dòng siêu cao tần dồn ra bề mặt vật dẫn:</p>
<pre><code>suy giam:     E = E0 * exp(-alpha*z) * cos(omega*t - beta*z)
do sau tham:  delta = 1 / sqrt(pi * f * mu * sigma)
</code></pre>
<h3>Phân cực</h3>
<p>Hướng mà vector E vạch ra xác định phân cực <strong>thẳng, tròn hay elip</strong> — then chốt cho anten và liên kết vệ tinh.</p>
<div class="callout"><span class="badge">Vì sao 377 ohm quan trọng</span> Trở kháng không gian tự do eta = sqrt(mu0/epsilon0) khoảng 377 ohm quyết định anten bức xạ ra sao và sóng phẳng mang bao nhiêu công suất.</div>`,
  ]]);

const c4q = quiz('emf301c-quiz-4', 'Quiz 4 — Plane waves|||Quiz 4 — Sóng phẳng', [
  { id: 'q1', question: 'Trở kháng nội (intrinsic impedance) của không gian tự do xấp xỉ?', options: ['50 ohm', '75 ohm', '377 ohm', '1000 ohm'], correctIndex: 2, explanation: 'eta0 = sqrt(mu0/epsilon0) xấp xỉ 377 ohm (hay 120*pi).' },
  { id: 'q2', question: 'Độ sâu thấm (skin depth) thay đổi thế nào khi tần số tăng?', options: ['Tăng lên', 'Giảm đi', 'Không đổi', 'Bằng 0'], correctIndex: 1, explanation: 'delta = 1/sqrt(pi*f*mu*sigma) giảm khi f tăng — dòng dồn ra bề mặt.' },
  { id: 'q3', question: 'Trong sóng phẳng TEM, quan hệ giữa E, H và hướng truyền là?', options: ['E song song H', 'E, H vuông góc nhau và vuông góc hướng truyền', 'E cùng hướng truyền', 'H bằng 0'], correctIndex: 1, explanation: 'Sóng TEM: E vuông góc H, cả hai vuông góc với hướng lan truyền.' },
]);

const c5 = doc('emf301c-5-1-transmission-lines', '5.1 — Transmission lines & the Smith chart|||5.1 — Đường truyền & đồ thị Smith',
  'Mô hình đường truyền (RLGC); trở kháng đặc tính Z0; hệ số phản xạ & VSWR; trở kháng vào; đồ thị Smith & phối hợp trở kháng.',
  [[
    `<span class="eyebrow">EMF301c · Chapter 5 · Lesson 5.1</span>
<h2>Transmission lines &amp; the Smith chart</h2>
<h3>When a wire becomes a line</h3>
<p>Once the line length is comparable to a wavelength, voltage and current vary <em>along</em> it. The line is modelled by distributed R, L, G, C per unit length, giving:</p>
<pre><code>characteristic impedance:  Z0 = sqrt(L / C)     (lossless)
reflection coefficient:    Gamma = (ZL - Z0) / (ZL + Z0)
standing wave ratio:       VSWR = (1 + |Gamma|) / (1 - |Gamma|)
input impedance:           Zin = Z0 * (ZL + j*Z0*tan(beta*l)) / (Z0 + j*ZL*tan(beta*l))
</code></pre>
<p>A load matched to the line (ZL = Z0) gives Gamma = 0, VSWR = 1 — no reflection, all power delivered.</p>
<h3>The Smith chart</h3>
<p>The <strong>Smith chart</strong> maps every impedance onto the reflection-coefficient plane. It turns the messy Zin formula into a graphical rotation: move toward the generator = rotate clockwise. Engineers use it to design <strong>matching networks</strong> (stubs, quarter-wave transformers) by eye.</p>
<pre><code>quarter-wave transformer:  Z0_match = sqrt(Zin * ZL)
</code></pre>
<div class="callout"><span class="badge">Why matching matters</span> A mismatch reflects power back to the source, causing loss, standing waves and even device damage. The Smith chart is the RF engineer's daily tool for fixing it.</div>`,
    `<span class="eyebrow">EMF301c · Chương 5 · Bài 5.1</span>
<h2>Đường truyền &amp; đồ thị Smith</h2>
<h3>Khi sợi dây trở thành đường truyền</h3>
<p>Khi chiều dài đường dây so được với bước sóng, điện áp và dòng biến đổi <em>dọc theo</em> nó. Đường truyền được mô hình bằng R, L, G, C phân bố trên đơn vị dài, cho:</p>
<pre><code>tro khang dac tinh:  Z0 = sqrt(L / C)     (khong ton hao)
he so phan xa:       Gamma = (ZL - Z0) / (ZL + Z0)
ti so song dung:     VSWR = (1 + |Gamma|) / (1 - |Gamma|)
tro khang vao:       Zin = Z0 * (ZL + j*Z0*tan(beta*l)) / (Z0 + j*ZL*tan(beta*l))
</code></pre>
<p>Tải phối hợp với đường truyền (ZL = Z0) cho Gamma = 0, VSWR = 1 — không phản xạ, truyền hết công suất.</p>
<h3>Đồ thị Smith</h3>
<p><strong>Đồ thị Smith</strong> ánh xạ mọi trở kháng lên mặt phẳng hệ số phản xạ. Nó biến công thức Zin rối rắm thành một phép quay hình học: đi về phía nguồn = quay theo chiều kim đồng hồ. Kỹ sư dùng nó để thiết kế <strong>mạng phối hợp</strong> (stub, biến áp một phần tư sóng) bằng mắt.</p>
<pre><code>bien ap 1/4 song:  Z0_phoi_hop = sqrt(Zin * ZL)
</code></pre>
<div class="callout"><span class="badge">Vì sao phối hợp quan trọng</span> Sai lệch trở kháng phản xạ công suất về nguồn, gây tổn hao, sóng dừng và có thể hỏng linh kiện. Đồ thị Smith là công cụ hằng ngày của kỹ sư RF để xử lý điều đó.</div>`,
  ]]);

const c5q = quiz('emf301c-quiz-5', 'Quiz 5 — Transmission lines|||Quiz 5 — Đường truyền', [
  { id: 'q1', question: 'Khi tải phối hợp hoàn hảo (ZL = Z0), hệ số phản xạ Gamma bằng?', options: ['1', '0', '-1', 'vô cùng'], correctIndex: 1, explanation: 'ZL = Z0 nên Gamma = (ZL-Z0)/(ZL+Z0) = 0 — không phản xạ.' },
  { id: 'q2', question: 'VSWR bằng 1 nghĩa là gì?', options: ['Phản xạ toàn phần', 'Không có sóng dừng, phối hợp hoàn hảo', 'Đường dây hở mạch', 'Tải ngắn mạch'], correctIndex: 1, explanation: 'VSWR = 1 khi |Gamma| = 0: không sóng dừng, truyền hết công suất.' },
  { id: 'q3', question: 'Trở kháng của biến áp một phần tư sóng để phối hợp Zin với ZL là?', options: ['Z0 = Zin + ZL', 'Z0 = sqrt(Zin * ZL)', 'Z0 = Zin - ZL', 'Z0 = Zin / ZL'], correctIndex: 1, explanation: 'Biến áp 1/4 sóng dùng Z0 = sqrt(Zin*ZL) để phối hợp hai trở kháng thuần.' },
]);

const c6 = doc('emf301c-6-1-waveguides', '6.1 — Waveguides|||6.1 — Ống dẫn sóng',
  'Ống dẫn sóng chữ nhật; mode TE/TM (không TEM); tần số cắt & mode trội TE10; vận tốc pha/nhóm; vì sao dùng ở tần số cao.',
  [[
    `<span class="eyebrow">EMF301c · Chapter 6 · Lesson 6.1</span>
<h2>Waveguides</h2>
<h3>Guiding waves in a hollow pipe</h3>
<p>At high microwave frequencies, a hollow metal <strong>waveguide</strong> carries far more power with less loss than a coaxial cable. But a single hollow conductor cannot support a TEM wave, so energy travels in <strong>TE (transverse electric)</strong> or <strong>TM (transverse magnetic)</strong> modes.</p>
<h3>Cut-off frequency</h3>
<p>Each mode only propagates above its <strong>cut-off frequency</strong>; below it the wave is evanescent (dies away). For a rectangular guide of inner width a and height b:</p>
<pre><code>cut-off frequency (mode mn):
  f_c = (c/2) * sqrt( (m/a)^2 + (n/b)^2 )

dominant mode TE10 (n=0, m=1):
  f_c = c / (2*a)      (lowest cut-off, most used)

guide wavelength:  lambda_g = lambda / sqrt(1 - (f_c/f)^2)
phase velocity:    v_p = c / sqrt(1 - (f_c/f)^2)   (greater than c)
group velocity:    v_g = c * sqrt(1 - (f_c/f)^2)   (energy speed, less than c)
</code></pre>
<p>Here m and n are the mode numbers; <strong>TE10</strong> is the dominant mode with the lowest cut-off.</p>
<div class="callout"><span class="badge">A high-pass pipe</span> A waveguide acts like a high-pass filter: it only passes frequencies above cut-off. Pick the dimension a to set the usable band around your operating frequency.</div>`,
    `<span class="eyebrow">EMF301c · Chương 6 · Bài 6.1</span>
<h2>Ống dẫn sóng</h2>
<h3>Dẫn sóng trong ống rỗng</h3>
<p>Ở tần số siêu cao tần cao, <strong>ống dẫn sóng</strong> kim loại rỗng tải công suất lớn hơn nhiều và tổn hao ít hơn cáp đồng trục. Nhưng một vật dẫn rỗng đơn không đỡ được sóng TEM, nên năng lượng đi theo mode <strong>TE (điện ngang)</strong> hoặc <strong>TM (từ ngang)</strong>.</p>
<h3>Tần số cắt</h3>
<p>Mỗi mode chỉ lan truyền trên <strong>tần số cắt</strong> của nó; dưới đó sóng tắt dần (evanescent). Với ống chữ nhật chiều rộng trong a và cao b:</p>
<pre><code>tan so cat (mode mn):
  f_c = (c/2) * sqrt( (m/a)^2 + (n/b)^2 )

mode troi TE10 (n=0, m=1):
  f_c = c / (2*a)      (tan so cat thap nhat, dung nhieu nhat)

buoc song trong ong:  lambda_g = lambda / sqrt(1 - (f_c/f)^2)
van toc pha:          v_p = c / sqrt(1 - (f_c/f)^2)   (lon hon c)
van toc nhom:         v_g = c * sqrt(1 - (f_c/f)^2)   (toc do nang luong, nho hon c)
</code></pre>
<p>Ở đây m và n là số hiệu mode; <strong>TE10</strong> là mode trội có tần số cắt thấp nhất.</p>
<div class="callout"><span class="badge">Một ống thông cao</span> Ống dẫn sóng hoạt động như bộ lọc thông cao: chỉ cho qua tần số trên tần số cắt. Chọn kích thước a để đặt dải dùng được quanh tần số làm việc.</div>`,
  ]]);

const c6q = quiz('emf301c-quiz-6', 'Quiz 6 — Waveguides|||Quiz 6 — Ống dẫn sóng', [
  { id: 'q1', question: 'Vì sao ống dẫn sóng rỗng đơn KHÔNG đỡ được sóng TEM?', options: ['Vì thiếu điện môi', 'Vì cần hai vật dẫn tách biệt cho TEM', 'Vì kim loại chặn mọi sóng', 'Vì tần số quá thấp'], correctIndex: 1, explanation: 'Sóng TEM cần hai vật dẫn (như cáp đồng trục); ống rỗng đơn chỉ đỡ mode TE/TM.' },
  { id: 'q2', question: 'Điều gì xảy ra với sóng có tần số DƯỚI tần số cắt?', options: ['Truyền không suy hao', 'Tắt dần (evanescent), không lan truyền', 'Tăng biên độ', 'Đổi thành TEM'], correctIndex: 1, explanation: 'Dưới tần số cắt sóng là evanescent — tắt theo khoảng cách, không lan truyền.' },
  { id: 'q3', question: 'Mode trội trong ống chữ nhật (tần số cắt thấp nhất) là?', options: ['TM11', 'TE10', 'TEM', 'TE00'], correctIndex: 1, explanation: 'TE10 có tần số cắt thấp nhất f_c = c/(2a), là mode trội thường dùng.' },
]);

const c7 = doc('emf301c-7-1-s-parameters', '7.1 — Microwave network parameters (S-parameters)|||7.1 — Tham số mạng siêu cao tần (tham số S)',
  'Vì sao dùng tham số S ở tần cao; sóng tới/phản xạ a,b; ma trận S; S11 (phản xạ vào) & S21 (truyền qua); return loss & insertion loss; mạng thuận nghịch/không tổn hao.',
  [[
    `<span class="eyebrow">EMF301c · Chapter 7 · Lesson 7.1</span>
<h2>Microwave network parameters (S-parameters)</h2>
<h3>Why not Z or Y at microwave?</h3>
<p>Classic Z- and Y-parameters need open- and short-circuit tests — impossible to do accurately at GHz, where opens/shorts radiate or oscillate. <strong>Scattering (S) parameters</strong> instead use matched loads and describe a device by <em>incident and reflected travelling waves</em> at each port.</p>
<pre><code>Two-port relation:
  b1 = S11*a1 + S12*a2
  b2 = S21*a1 + S22*a2

where a = incident wave, b = reflected/emerging wave.

Meaning (with port 2 matched, a2 = 0):
  S11 = b1/a1  -> input reflection  (return loss)
  S21 = b2/a1  -> forward transmission (gain or insertion loss)
</code></pre>
<h3>Reading the numbers</h3>
<pre><code>return loss (dB)    = -20 * log10(|S11|)
insertion loss (dB) = -20 * log10(|S21|)
reciprocal network: S12 = S21
lossless network:   |S11|^2 + |S21|^2 = 1
</code></pre>
<p>A good amplifier wants large S21 (gain) and small S11 (well matched input). A good filter passband wants S21 near 1 and S11 near 0.</p>
<div class="callout"><span class="badge">The RF lingua franca</span> Every VNA measures S-parameters and every RF datasheet quotes them. They are just travelling-wave ratios — measurable with matched loads, no risky opens or shorts.</div>`,
    `<span class="eyebrow">EMF301c · Chương 7 · Bài 7.1</span>
<h2>Tham số mạng siêu cao tần (tham số S)</h2>
<h3>Vì sao không dùng Z hay Y ở siêu cao tần?</h3>
<p>Tham số Z và Y cổ điển cần phép đo hở mạch và ngắn mạch — khó chính xác ở GHz, nơi hở/ngắn sẽ bức xạ hoặc dao động. <strong>Tham số tán xạ (S)</strong> thay vào đó dùng tải phối hợp và mô tả linh kiện qua <em>sóng chạy tới và phản xạ</em> tại mỗi cổng.</p>
<pre><code>Quan he mang hai cong:
  b1 = S11*a1 + S12*a2
  b2 = S21*a1 + S22*a2

voi a = song toi, b = song phan xa/di ra.

Y nghia (cong 2 phoi hop, a2 = 0):
  S11 = b1/a1  -> phan xa dau vao  (return loss)
  S21 = b2/a1  -> truyen thuan     (do loi hoac insertion loss)
</code></pre>
<h3>Đọc các con số</h3>
<pre><code>return loss (dB)    = -20 * log10(|S11|)
insertion loss (dB) = -20 * log10(|S21|)
mang thuan nghich:  S12 = S21
mang khong ton hao: |S11|^2 + |S21|^2 = 1
</code></pre>
<p>Một bộ khuếch đại tốt muốn S21 lớn (độ lợi) và S11 nhỏ (đầu vào phối hợp tốt). Dải thông bộ lọc tốt muốn S21 gần 1 và S11 gần 0.</p>
<div class="callout"><span class="badge">Ngôn ngữ chung của RF</span> Mọi máy VNA đo tham số S và mọi datasheet RF trích chúng. Chúng chỉ là tỉ số sóng chạy — đo được bằng tải phối hợp, không cần hở/ngắn mạch rủi ro.</div>`,
  ]]);

const c7q = quiz('emf301c-quiz-7', 'Quiz 7 — S-parameters|||Quiz 7 — Tham số S', [
  { id: 'q1', question: 'Vì sao dùng tham số S thay vì Z/Y ở tần số siêu cao?', options: ['Vì S dễ tính hơn', 'Vì đo được bằng tải phối hợp, tránh hở/ngắn mạch khó thực hiện ở GHz', 'Vì S không cần thiết bị', 'Vì Z/Y không tồn tại ở RF'], correctIndex: 1, explanation: 'Ở GHz, hở/ngắn mạch bức xạ hoặc dao động; tham số S dùng tải phối hợp nên đo chính xác.' },
  { id: 'q2', question: 'Trong mạng hai cổng, S21 biểu diễn?', options: ['Phản xạ tại cổng 1', 'Truyền từ cổng 1 sang cổng 2 (độ lợi/insertion loss)', 'Trở kháng vào', 'Điện dung'], correctIndex: 1, explanation: 'S21 = b2/a1 (với a2=0): hệ số truyền thuận từ cổng 1 sang cổng 2.' },
  { id: 'q3', question: 'Với mạng KHÔNG tổn hao, quan hệ nào đúng?', options: ['S12 = 2*S21', '|S11|^2 + |S21|^2 = 1', 'S11 = S21', 'S11 = 1'], correctIndex: 1, explanation: 'Bảo toàn công suất: |S11|^2 + |S21|^2 = 1 với mạng hai cổng không tổn hao.' },
]);

const c8 = doc('emf301c-8-1-antennas', '8.1 — Antennas & microwave components fundamentals|||8.1 — Cơ sở anten & linh kiện siêu cao tần',
  'Anten là gì; vùng gần/xa; độ lợi, độ định hướng, hiệu suất; giản đồ bức xạ; dipole nửa sóng; phương trình truyền Friis; linh kiện siêu cao tần cơ bản.',
  [[
    `<span class="eyebrow">EMF301c · Chapter 8 · Lesson 8.1</span>
<h2>Antennas &amp; microwave components</h2>
<h3>Turning guided waves into free-space waves</h3>
<p>An <strong>antenna</strong> is the transition between a transmission line and free space. Balanis' key figures of merit:</p>
<ul>
<li><strong>Directivity</strong> — how tightly the antenna focuses power in the best direction versus an isotropic radiator.</li>
<li><strong>Gain</strong> = efficiency times directivity — the practical measure quoted in dBi.</li>
<li><strong>Radiation pattern</strong> — the plot of radiated power versus angle (main lobe, side lobes).</li>
<li><strong>Near field vs far field</strong> — measurements are made in the far field, beyond about 2*D^2/lambda.</li>
</ul>
<pre><code>half-wave dipole:  length = lambda / 2, gain about 2.15 dBi
Friis transmission (far field):
  Pr / Pt = Gt * Gr * (lambda / (4*pi*R))^2
</code></pre>
<p>The Friis equation shows received power falls as 1/R^2 and improves with antenna gains and wavelength.</p>
<h3>Common microwave components</h3>
<p>Directional couplers, power dividers, circulators, filters and attenuators — each described compactly by the <strong>S-parameters</strong> from chapter 7. Together they build RF front-ends, radar and wireless links.</p>
<div class="callout"><span class="badge">Full circle</span> Fields (ch.1-2) unified by Maxwell (ch.3) become waves (ch.4), guided by lines and guides (ch.5-6), described by S-parameters (ch.7), and finally launched into space by antennas (ch.8).</div>`,
    `<span class="eyebrow">EMF301c · Chương 8 · Bài 8.1</span>
<h2>Anten &amp; linh kiện siêu cao tần</h2>
<h3>Biến sóng dẫn hướng thành sóng không gian tự do</h3>
<p>Một <strong>anten</strong> là chuyển tiếp giữa đường truyền và không gian tự do. Các chỉ tiêu then chốt theo Balanis:</p>
<ul>
<li><strong>Độ định hướng (directivity)</strong> — anten tập trung công suất chặt đến đâu theo hướng tốt nhất so với bộ bức xạ đẳng hướng.</li>
<li><strong>Độ lợi (gain)</strong> = hiệu suất nhân độ định hướng — con số thực tế ghi bằng dBi.</li>
<li><strong>Giản đồ bức xạ</strong> — đồ thị công suất bức xạ theo góc (búp chính, búp phụ).</li>
<li><strong>Vùng gần và vùng xa</strong> — phép đo thực hiện ở vùng xa, xa hơn khoảng 2*D^2/lambda.</li>
</ul>
<pre><code>dipole nua song:  chieu dai = lambda / 2, do loi khoang 2.15 dBi
Phuong trinh truyen Friis (vung xa):
  Pr / Pt = Gt * Gr * (lambda / (4*pi*R))^2
</code></pre>
<p>Phương trình Friis cho thấy công suất thu giảm theo 1/R^2 và tăng theo độ lợi anten và bước sóng.</p>
<h3>Linh kiện siêu cao tần thường gặp</h3>
<p>Bộ ghép định hướng, bộ chia công suất, circulator, bộ lọc và bộ suy hao — mỗi thứ được mô tả gọn bằng <strong>tham số S</strong> ở chương 7. Chúng cùng dựng nên tầng đầu RF, radar và liên kết không dây.</p>
<div class="callout"><span class="badge">Khép vòng</span> Trường (ch.1-2) được Maxwell hợp nhất (ch.3) thành sóng (ch.4), dẫn bởi đường truyền và ống dẫn (ch.5-6), mô tả bằng tham số S (ch.7), và cuối cùng phóng vào không gian bởi anten (ch.8).</div>`,
  ]]);

const c8q = quiz('emf301c-quiz-8', 'Quiz 8 — Antennas|||Quiz 8 — Anten', [
  { id: 'q1', question: 'Độ lợi (gain) của anten liên hệ với độ định hướng thế nào?', options: ['Gain = độ định hướng + 1', 'Gain = hiệu suất × độ định hướng', 'Gain = độ định hướng / R', 'Gain luôn bằng độ định hướng'], correctIndex: 1, explanation: 'Gain = hiệu suất bức xạ nhân độ định hướng; tính cả tổn hao của anten.' },
  { id: 'q2', question: 'Theo phương trình Friis, công suất thu giảm theo?', options: ['1/R', '1/R^2', '1/R^3', 'R^2'], correctIndex: 1, explanation: 'Pr/Pt = Gt*Gr*(lambda/(4*pi*R))^2, nên Pr tỉ lệ 1/R^2 ở vùng xa.' },
  { id: 'q3', question: 'Chiều dài của một dipole nửa sóng xấp xỉ?', options: ['lambda', 'lambda/2', 'lambda/4', '2*lambda'], correctIndex: 1, explanation: 'Dipole nửa sóng dài khoảng lambda/2, độ lợi khoảng 2.15 dBi.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'EMF301c',
    slug: 'emf301c-electromagnetic-field-theory-and-microwave-fundamentals',
    title: 'Electromagnetic Field Theory and Microwave Fundamentals',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/EMF301c.webp',
    shortDescription: 'EM field theory & microwave fundamentals: vector calculus, electro/magnetostatics, Maxwell equations, plane waves, transmission lines & Smith chart, waveguides, S-parameters & antennas. Bilingual, with quizzes.|||Lý thuyết trường điện từ & cơ sở siêu cao tần: giải tích vector, tĩnh điện/từ, hệ Maxwell, sóng phẳng, đường truyền & đồ thị Smith, ống dẫn sóng, tham số S & anten. Song ngữ, có quiz.',
    description: 'Môn <strong>EMF301c — Electromagnetic Field Theory and Microwave Fundamentals</strong> (ngành Thiết kế vi mạch bán dẫn, kỳ 4) xây nền vật lý cho RF và vi mạch tốc độ cao. Lộ trình: <strong>giải tích vector &amp; tĩnh điện</strong> → <strong>tĩnh từ</strong> → <strong>hệ phương trình Maxwell &amp; trường biến thiên</strong> → <strong>sóng phẳng đồng nhất</strong> → <strong>đường truyền &amp; đồ thị Smith</strong> → <strong>ống dẫn sóng</strong> → <strong>tham số S</strong> → <strong>anten &amp; linh kiện siêu cao tần</strong>. Bám giáo trình chuẩn (Sadiku, Pozar, Ulaby, Balanis), song ngữ, có công thức mẫu và quiz mỗi chương.',
    whatYouLearn: 'grad/div/curl &amp; định luật Gauss; trường E, điện thế, tụ điện; định luật Ampere, div B = 0, điện cảm; bốn phương trình Maxwell &amp; phương trình sóng; sóng phẳng TEM, trở kháng nội 377 ohm, độ sâu thấm, phân cực; đường truyền (Z0, hệ số phản xạ, VSWR) &amp; đồ thị Smith; ống dẫn sóng (mode TE/TM, tần số cắt, TE10); tham số S (S11/S21, return/insertion loss); anten (độ lợi, độ định hướng, Friis) &amp; linh kiện siêu cao tần.',
    requirements: 'Giải tích (đạo hàm, tích phân), đại số vector và số phức; điện từ cơ bản ở phổ thông. Nên biết dùng đồ thị Smith và công cụ mô phỏng trường (Falstad).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình chuẩn (Sadiku, Pozar, Ulaby, Balanis), tài liệu miễn phí, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Trường điện từ nền cho RF/vi mạch; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Giải tích vector & tĩnh điện|||Chapter 1 — Vector calculus & electrostatics', description: 'grad/div/curl, Coulomb, Gauss, điện thế, tụ điện.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Tĩnh từ|||Chapter 2 — Magnetostatics', description: 'Biot-Savart, Ampere, div B = 0, điện cảm.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Hệ Maxwell|||Chapter 3 — Maxwell equations', description: 'Faraday, dòng dịch, bốn phương trình, phương trình sóng.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Sóng phẳng|||Chapter 4 — Plane waves', description: 'Sóng TEM, trở kháng nội, độ sâu thấm, phân cực.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Đường truyền & Smith|||Chapter 5 — Transmission lines & Smith', description: 'Z0, hệ số phản xạ, VSWR, đồ thị Smith, phối hợp.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Ống dẫn sóng|||Chapter 6 — Waveguides', description: 'Mode TE/TM, tần số cắt, mode trội TE10.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Tham số S|||Chapter 7 — S-parameters', description: 'Sóng tới/phản xạ, ma trận S, S11/S21, return/insertion loss.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Anten & linh kiện|||Chapter 8 — Antennas & components', description: 'Độ lợi, độ định hướng, giản đồ bức xạ, Friis, linh kiện siêu cao tần.', lessons: [c8, c8q] },
  ],
};
