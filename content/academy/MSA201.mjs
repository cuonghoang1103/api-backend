/**
 * MSA201 — Modeling and Simulation for Automotive Systems. Mô hình hoá & mô
 * phỏng hệ thống ô tô (ngành Kỹ thuật phần mềm ô tô FPTU). Song ngữ + mô hình
 * + ví dụ + khối pre. Nguồn: Rajamani "Vehicle Dynamics and Control",
 * MathWorks MATLAB/Simulink Automotive, model-based design (MBD), MIL/SIL/HIL.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n; &→&amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('msa201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách Rajamani, tài liệu MathWorks MATLAB/Simulink, YouTube, công cụ mô phỏng, lộ trình tự học.',
  [[
    `<span class="eyebrow">MSA201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>modeling &amp; simulation for automotive systems</strong> — math models, MATLAB/Simulink, vehicle dynamics, subsystems, model-based design and MIL/SIL/HIL testing — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for MSA201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://link.springer.com/book/10.1007/978-1-4614-1433-9" target="_blank" rel="noopener"><em>Vehicle Dynamics and Control</em> — Rajamani</a> (the standard automotive-model reference)</li>
<li><a href="https://www.mathworks.com/help/simulink/model-based-design.html" target="_blank" rel="noopener">Model-Based Design — MathWorks documentation</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.mathworks.com/help/simulink/" target="_blank" rel="noopener">Simulink documentation (MathWorks)</a></li>
<li><a href="https://www.mathworks.com/solutions/automotive.html" target="_blank" rel="noopener">MathWorks Automotive — model-based design solutions</a></li>
<li><a href="https://www.autosar.org/" target="_blank" rel="noopener">AUTOSAR — automotive software architecture standard</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@MATLAB" target="_blank" rel="noopener">MATLAB</a> — Simulink &amp; model-based design tutorials</li>
<li><a href="https://www.youtube.com/@controlsystemslectures" target="_blank" rel="noopener">Brian Douglas — Control Systems Lectures</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.mathworks.com/products/matlab.html" target="_blank" rel="noopener">MATLAB &amp; Simulink</a> — the industry standard for automotive modeling</li>
<li><a href="https://octave.org/" target="_blank" rel="noopener">GNU Octave</a> — free MATLAB-compatible numerical computing</li>
<li><a href="https://www.python.org/" target="_blank" rel="noopener">Python + SciPy</a> — free ODE solvers (scipy.integrate) for simulation</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what modeling &amp; simulation are, and why model-based design dominates automotive engineering.</li>
<li><strong>Math &amp; tools</strong> — differential equations, transfer functions, state-space; build and run them in Simulink.</li>
<li><strong>Vehicle models</strong> — longitudinal/lateral/vertical dynamics and subsystems (engine, brake, steering, suspension).</li>
<li><strong>Job-ready</strong> — MBD workflow, code generation, and MIL/SIL/HIL verification for real ECUs.</li>
</ol></div>`,
    `<span class="eyebrow">MSA201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>mô hình hoá &amp; mô phỏng hệ thống ô tô</strong> — mô hình toán, MATLAB/Simulink, động lực học xe, hệ thống con, model-based design và kiểm thử MIL/SIL/HIL — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của MSA201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://link.springer.com/book/10.1007/978-1-4614-1433-9" target="_blank" rel="noopener"><em>Vehicle Dynamics and Control</em> — Rajamani</a> (sách chuẩn về mô hình ô tô)</li>
<li><a href="https://www.mathworks.com/help/simulink/model-based-design.html" target="_blank" rel="noopener">Model-Based Design — tài liệu MathWorks</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.mathworks.com/help/simulink/" target="_blank" rel="noopener">Tài liệu Simulink (MathWorks)</a></li>
<li><a href="https://www.mathworks.com/solutions/automotive.html" target="_blank" rel="noopener">MathWorks Automotive — giải pháp model-based design</a></li>
<li><a href="https://www.autosar.org/" target="_blank" rel="noopener">AUTOSAR — chuẩn kiến trúc phần mềm ô tô</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@MATLAB" target="_blank" rel="noopener">MATLAB</a> — hướng dẫn Simulink &amp; model-based design</li>
<li><a href="https://www.youtube.com/@controlsystemslectures" target="_blank" rel="noopener">Brian Douglas — Control Systems Lectures</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.mathworks.com/products/matlab.html" target="_blank" rel="noopener">MATLAB &amp; Simulink</a> — chuẩn công nghiệp cho mô phỏng ô tô</li>
<li><a href="https://octave.org/" target="_blank" rel="noopener">GNU Octave</a> — tính số tương thích MATLAB, miễn phí</li>
<li><a href="https://www.python.org/" target="_blank" rel="noopener">Python + SciPy</a> — bộ giải ODE miễn phí (scipy.integrate) để mô phỏng</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — mô hình hoá &amp; mô phỏng là gì, và vì sao model-based design thống trị kỹ thuật ô tô.</li>
<li><strong>Toán &amp; công cụ</strong> — phương trình vi phân, hàm truyền, state-space; dựng và chạy trong Simulink.</li>
<li><strong>Mô hình xe</strong> — động lực học dọc/ngang/thẳng đứng và hệ thống con (động cơ, phanh, lái, treo).</li>
<li><strong>Sẵn sàng đi làm</strong> — quy trình MBD, sinh mã, và kiểm thử MIL/SIL/HIL cho ECU thật.</li>
</ol></div>`,
  ]]);

const intro = doc('msa201-0-1-overview', 'Course overview: Modeling & simulation for automotive systems|||Tổng quan: Mô hình hoá & mô phỏng hệ thống ô tô',
  'Vì sao ô tô hiện đại được thiết kế bằng mô hình; model-based design; lộ trình: mô hình toán → Simulink → động lực học xe → hệ thống con → MBD/sinh mã → MIL/SIL/HIL → ứng dụng.',
  [[
    `<span class="eyebrow">MSA201 · Lesson 0.1 · Overview</span>
<h2>Modeling &amp; Simulation for Automotive Systems</h2>
<p class="lead">A modern car is a computer on wheels: dozens of <strong>ECUs</strong> control the engine, brakes, steering and safety systems. Before a single line of production code runs on real hardware, engineers <strong>model</strong> the physics and <strong>simulate</strong> the behavior — this is <strong>model-based design (MBD)</strong>, and it is how the automotive industry actually builds software.</p>
<h3>Why model &amp; simulate?</h3>
<ul>
<li><strong>Safety</strong> — you cannot crash a real car to test every brake scenario; you can run millions of simulated ones.</li>
<li><strong>Cost &amp; speed</strong> — a bug found in a Simulink model costs cents; the same bug found in a recalled car costs millions.</li>
<li><strong>Automation</strong> — a validated model can generate the C code that ships in the ECU (code generation).</li>
</ul>
<h3>Roadmap</h3>
<p>Modeling &amp; simulation basics → math models (ODEs, transfer functions, state-space) → MATLAB/Simulink → vehicle dynamics → subsystem models (engine, brake, steering, suspension) → model-based design &amp; code generation → MIL/SIL/HIL testing → applications (ADAS, EV, autonomous, digital twin).</p>
<div class="callout"><span class="badge">One idea</span> A model is a set of equations that predicts how the real system behaves. Simulation runs those equations over time so you can see the future before it happens.</div>`,
    `<span class="eyebrow">MSA201 · Bài 0.1 · Tổng quan</span>
<h2>Mô hình hoá &amp; mô phỏng hệ thống ô tô</h2>
<p class="lead">Ô tô hiện đại là một chiếc máy tính có bánh: hàng chục <strong>ECU</strong> điều khiển động cơ, phanh, lái và hệ thống an toàn. Trước khi một dòng mã sản phẩm chạy trên phần cứng thật, kỹ sư <strong>mô hình hoá</strong> vật lý và <strong>mô phỏng</strong> hành vi — đây là <strong>model-based design (MBD)</strong>, và là cách ngành ô tô thực sự xây dựng phần mềm.</p>
<h3>Vì sao phải mô hình &amp; mô phỏng?</h3>
<ul>
<li><strong>An toàn</strong> — không thể đâm một chiếc xe thật để thử mọi tình huống phanh; nhưng có thể chạy hàng triệu tình huống mô phỏng.</li>
<li><strong>Chi phí &amp; tốc độ</strong> — lỗi tìm thấy trong mô hình Simulink tốn vài xu; cùng lỗi đó tìm thấy trong xe bị triệu hồi tốn hàng triệu đô.</li>
<li><strong>Tự động hoá</strong> — một mô hình đã kiểm chứng có thể sinh ra mã C chạy trong ECU (code generation).</li>
</ul>
<h3>Lộ trình</h3>
<p>Cơ bản về mô hình &amp; mô phỏng → mô hình toán (ODE, hàm truyền, state-space) → MATLAB/Simulink → động lực học xe → hệ thống con (động cơ, phanh, lái, treo) → model-based design &amp; sinh mã → kiểm thử MIL/SIL/HIL → ứng dụng (ADAS, xe điện, tự hành, digital twin).</p>
<div class="callout"><span class="badge">Một ý tưởng</span> Mô hình là tập phương trình dự đoán hệ thống thật hành xử ra sao. Mô phỏng chạy các phương trình đó theo thời gian để bạn thấy tương lai trước khi nó xảy ra.</div>`,
  ]]);

const c1 = doc('msa201-1-1-modeling-simulation', '1.1 — What is modeling & simulation|||1.1 — Mô hình hoá & mô phỏng là gì',
  'Mô hình (model) vs mô phỏng (simulation); mô hình vật lý/toán/thực nghiệm; vì sao dùng trong ô tô; vòng lặp model-based design.',
  [[
    `<span class="eyebrow">MSA201 · Chapter 1 · Lesson 1.1</span>
<h2>What is modeling &amp; simulation</h2>
<h3>Model vs simulation</h3>
<ul>
<li><strong>Model</strong> — a simplified representation of a real system (equations, blocks, or data) that captures the behavior you care about and ignores the rest.</li>
<li><strong>Simulation</strong> — running that model over time (or over inputs) on a computer to predict outputs.</li>
</ul>
<h3>Kinds of models</h3>
<ul>
<li><strong>Physical / first-principles</strong> — from the laws of physics (Newton, thermodynamics). Example: F = m·a for vehicle motion.</li>
<li><strong>Data-driven / empirical</strong> — fitted from measured data (a lookup table of engine torque vs. throttle &amp; rpm).</li>
<li><strong>Hybrid</strong> — physics for the structure, data for the parameters (most real automotive models).</li>
</ul>
<h3>The model-based design loop</h3>
<pre><code>Model-based design (MBD) workflow:
  1. MODEL     -> capture physics/logic as equations or Simulink blocks
  2. SIMULATE  -> run and check behavior against requirements
  3. GENERATE  -> auto-produce C code from the validated model
  4. VERIFY    -> test the code (MIL -> SIL -> HIL) before real hardware
</code></pre>
<div class="callout"><span class="badge">All models are wrong</span> A famous saying: "all models are wrong, but some are useful." The skill is choosing what to keep and what to ignore for the question you are asking.</div>`,
    `<span class="eyebrow">MSA201 · Chương 1 · Bài 1.1</span>
<h2>Mô hình hoá &amp; mô phỏng là gì</h2>
<h3>Mô hình vs mô phỏng</h3>
<ul>
<li><strong>Mô hình (model)</strong> — biểu diễn đơn giản hoá của hệ thống thật (phương trình, khối, hay dữ liệu) giữ lại hành vi bạn quan tâm và bỏ qua phần còn lại.</li>
<li><strong>Mô phỏng (simulation)</strong> — chạy mô hình đó theo thời gian (hoặc theo đầu vào) trên máy tính để dự đoán đầu ra.</li>
</ul>
<h3>Các loại mô hình</h3>
<ul>
<li><strong>Vật lý / nguyên lý gốc</strong> — từ định luật vật lý (Newton, nhiệt động). Ví dụ: F = m·a cho chuyển động của xe.</li>
<li><strong>Dữ liệu / thực nghiệm</strong> — khớp từ dữ liệu đo (bảng tra mô-men động cơ theo ga &amp; vòng tua).</li>
<li><strong>Lai (hybrid)</strong> — vật lý cho cấu trúc, dữ liệu cho tham số (hầu hết mô hình ô tô thực tế).</li>
</ul>
<h3>Vòng lặp model-based design</h3>
<pre><code>Quy trình model-based design (MBD):
  1. MÔ HÌNH   -> nắm vật lý/logic thành phương trình hoặc khối Simulink
  2. MÔ PHỎNG  -> chạy và đối chiếu hành vi với yêu cầu
  3. SINH MÃ   -> tự động tạo mã C từ mô hình đã kiểm chứng
  4. KIỂM CHỨNG-> thử mã (MIL -> SIL -> HIL) trước khi lên phần cứng thật
</code></pre>
<div class="callout"><span class="badge">Mọi mô hình đều sai</span> Câu nói nổi tiếng: "mọi mô hình đều sai, nhưng một số hữu ích". Kỹ năng nằm ở chỗ chọn giữ gì và bỏ gì cho câu hỏi bạn đang đặt ra.</div>`,
  ]]);

const c1q = quiz('msa201-quiz-1', 'Quiz 1 — Modeling & simulation|||Quiz 1 — Mô hình & mô phỏng', [
  { id: 'q1', question: 'Khác biệt cốt lõi giữa "mô hình" và "mô phỏng" là?', options: ['Chúng giống hệt nhau', 'Mô hình là biểu diễn hệ thống; mô phỏng là chạy mô hình đó theo thời gian', 'Mô hình chỉ dùng cho phần cứng', 'Mô phỏng không cần máy tính'], correctIndex: 1, explanation: 'Model = biểu diễn; simulation = chạy mô hình để dự đoán đầu ra.' },
  { id: 'q2', question: 'Mô hình "nguyên lý gốc" (first-principles) dựa trên?', options: ['Dữ liệu đo được', 'Định luật vật lý (vd F = m·a)', 'Đoán ngẫu nhiên', 'Ý kiến khách hàng'], correctIndex: 1, explanation: 'First-principles xây từ định luật vật lý; empirical mới từ dữ liệu.' },
  { id: 'q3', question: 'Thứ tự đúng của vòng lặp model-based design là?', options: ['Sinh mã → mô hình → mô phỏng → kiểm chứng', 'Mô hình → mô phỏng → sinh mã → kiểm chứng', 'Kiểm chứng → mô phỏng → mô hình → sinh mã', 'Mô phỏng → sinh mã → mô hình → kiểm chứng'], correctIndex: 1, explanation: 'MBD: Model → Simulate → Generate → Verify (MIL/SIL/HIL).' },
]);

const c2 = doc('msa201-2-1-math-models', '2.1 — Mathematical models of systems|||2.1 — Mô hình toán của hệ thống',
  'Phương trình vi phân (ODE, dx/dt); hàm truyền G(s)=Y(s)/U(s) trên miền Laplace; biểu diễn state-space x. = Ax + Bu, y = Cx + Du cho hệ cơ/điện.',
  [[
    `<span class="eyebrow">MSA201 · Chapter 2 · Lesson 2.1</span>
<h2>Mathematical models of systems</h2>
<h3>Differential equations — the language of dynamics</h3>
<p>Almost every physical system is described by how its state <em>changes over time</em>, i.e. a <strong>differential equation (ODE)</strong>. For a mass on a spring with damping:</p>
<pre><code>Mass-spring-damper (Newton's 2nd law, F = m·a):
  m·(d2x/dt2) + c·(dx/dt) + k·x = F(t)
    x   = position        m = mass
    dx/dt = velocity      c = damping coefficient
    d2x/dt2 = acceleration k = spring stiffness
</code></pre>
<h3>Transfer functions (frequency domain)</h3>
<p>Apply the Laplace transform and the ODE becomes an algebraic ratio — the <strong>transfer function</strong> G(s), output over input:</p>
<pre><code>  G(s) = Y(s) / U(s) = 1 / (m·s^2 + c·s + k)
</code></pre>
<h3>State-space (modern control)</h3>
<p>Rewrite any high-order ODE as first-order equations in a state vector x — the form Simulink and controllers use:</p>
<pre><code>  x. = A·x + B·u      (state equation, x. means dx/dt)
  y  = C·x + D·u      (output equation)
</code></pre>
<div class="callout"><span class="badge">Three views, one system</span> ODE, transfer function and state-space describe the SAME dynamics — you convert between them depending on the tool and the question.</div>`,
    `<span class="eyebrow">MSA201 · Chương 2 · Bài 2.1</span>
<h2>Mô hình toán của hệ thống</h2>
<h3>Phương trình vi phân — ngôn ngữ của động lực học</h3>
<p>Hầu hết hệ vật lý được mô tả bằng cách trạng thái của nó <em>thay đổi theo thời gian</em>, tức một <strong>phương trình vi phân (ODE)</strong>. Với vật nặng gắn lò xo có giảm chấn:</p>
<pre><code>Khối lượng - lò xo - giảm chấn (định luật 2 Newton, F = m·a):
  m·(d2x/dt2) + c·(dx/dt) + k·x = F(t)
    x   = vị trí          m = khối lượng
    dx/dt = vận tốc       c = hệ số giảm chấn
    d2x/dt2 = gia tốc     k = độ cứng lò xo
</code></pre>
<h3>Hàm truyền (miền tần số)</h3>
<p>Biến đổi Laplace và ODE trở thành một tỉ số đại số — <strong>hàm truyền</strong> G(s), ra trên vào:</p>
<pre><code>  G(s) = Y(s) / U(s) = 1 / (m·s^2 + c·s + k)
</code></pre>
<h3>State-space (điều khiển hiện đại)</h3>
<p>Viết lại một ODE bậc cao thành các phương trình bậc nhất theo vector trạng thái x — dạng mà Simulink và bộ điều khiển dùng:</p>
<pre><code>  x. = A·x + B·u      (phương trình trạng thái, x. nghĩa là dx/dt)
  y  = C·x + D·u      (phương trình đầu ra)
</code></pre>
<div class="callout"><span class="badge">Ba góc nhìn, một hệ</span> ODE, hàm truyền và state-space mô tả CÙNG một động lực học — bạn chuyển đổi giữa chúng tuỳ công cụ và câu hỏi.</div>`,
  ]]);

const c2q = quiz('msa201-quiz-2', 'Quiz 2 — Math models|||Quiz 2 — Mô hình toán', [
  { id: 'q1', question: 'Trong mô hình khối lượng-lò xo-giảm chấn, số hạng c·(dx/dt) biểu diễn?', options: ['Lực lò xo', 'Lực giảm chấn (tỉ lệ vận tốc)', 'Khối lượng', 'Gia tốc'], correctIndex: 1, explanation: 'c·(dx/dt) là lực cản/giảm chấn, tỉ lệ với vận tốc dx/dt.' },
  { id: 'q2', question: 'Hàm truyền G(s) được định nghĩa là?', options: ['Vào chia ra', 'Ra chia vào: Y(s)/U(s) (miền Laplace)', 'Tổng các trạng thái', 'Đạo hàm của đầu vào'], correctIndex: 1, explanation: 'G(s) = Y(s)/U(s), tỉ số đầu ra trên đầu vào ở miền Laplace.' },
  { id: 'q3', question: 'Cặp phương trình state-space chuẩn là?', options: ['y = m·a; F = k·x', 'x. = A·x + B·u và y = C·x + D·u', 'G(s) = 1/(s+1)', 'V = I·R'], correctIndex: 1, explanation: 'State-space: phương trình trạng thái x.=Ax+Bu và đầu ra y=Cx+Du.' },
]);

const c3 = doc('msa201-3-1-matlab-simulink', '3.1 — MATLAB/Simulink tools|||3.1 — Công cụ MATLAB/Simulink',
  'Simulink là môi trường sơ đồ khối; khối cơ bản (Integrator, Gain, Sum, Scope); bộ giải số (fixed/variable-step, ODE45); dựng và chạy một mô phỏng.',
  [[
    `<span class="eyebrow">MSA201 · Chapter 3 · Lesson 3.1</span>
<h2>MATLAB/Simulink tools</h2>
<h3>Simulink — block-diagram modeling</h3>
<p><strong>Simulink</strong> lets you draw a system as a <strong>block diagram</strong> instead of writing equations by hand. Signals flow along wires between blocks; you press Run and it solves the underlying ODEs for you.</p>
<h3>Core blocks</h3>
<ul>
<li><strong>Integrator (1/s)</strong> — turns acceleration into velocity, velocity into position (integrates a signal).</li>
<li><strong>Gain</strong> — multiplies a signal by a constant (e.g. spring stiffness k).</li>
<li><strong>Sum</strong> — adds/subtracts signals (build the force balance).</li>
<li><strong>Scope</strong> — plots a signal over time so you can see the result.</li>
</ul>
<h3>Numerical solvers</h3>
<pre><code>Simulink solves ODEs step by step over time:
  Fixed-step   -> constant dt (needed for code generation / HIL)
  Variable-step-> dt adapts to accuracy (ode45 is the default)

Mass-spring-damper as blocks:
  F --> [Sum] --> [Gain 1/m] --> [Integrator] --> velocity
                                   [Integrator] --> position
  feedback:  k*x  and  c*v  subtracted at the Sum
</code></pre>
<div class="callout"><span class="badge">Pick the right solver</span> A variable-step solver is fast and accurate for design; a FIXED-step solver is mandatory once you generate code for a real-time ECU.</div>`,
    `<span class="eyebrow">MSA201 · Chương 3 · Bài 3.1</span>
<h2>Công cụ MATLAB/Simulink</h2>
<h3>Simulink — mô hình bằng sơ đồ khối</h3>
<p><strong>Simulink</strong> cho phép vẽ hệ thống thành một <strong>sơ đồ khối</strong> thay vì viết phương trình bằng tay. Tín hiệu chảy theo dây nối giữa các khối; bạn bấm Run và nó tự giải các ODE bên dưới.</p>
<h3>Các khối cơ bản</h3>
<ul>
<li><strong>Integrator (1/s)</strong> — biến gia tốc thành vận tốc, vận tốc thành vị trí (tích phân tín hiệu).</li>
<li><strong>Gain</strong> — nhân tín hiệu với một hằng số (vd độ cứng lò xo k).</li>
<li><strong>Sum</strong> — cộng/trừ tín hiệu (dựng cân bằng lực).</li>
<li><strong>Scope</strong> — vẽ tín hiệu theo thời gian để bạn thấy kết quả.</li>
</ul>
<h3>Bộ giải số</h3>
<pre><code>Simulink giải ODE từng bước theo thời gian:
  Fixed-step   -> dt cố định (cần cho sinh mã / HIL)
  Variable-step-> dt tự điều chỉnh theo độ chính xác (ode45 mặc định)

Khối lượng-lò xo-giảm chấn dạng khối:
  F --> [Sum] --> [Gain 1/m] --> [Integrator] --> vận tốc
                                  [Integrator] --> vị trí
  hồi tiếp:  k*x  và  c*v  bị trừ tại Sum
</code></pre>
<div class="callout"><span class="badge">Chọn đúng bộ giải</span> Bộ giải variable-step nhanh và chính xác khi thiết kế; bộ giải FIXED-step là bắt buộc khi sinh mã cho ECU thời gian thực.</div>`,
  ]]);

const c3q = quiz('msa201-quiz-3', 'Quiz 3 — MATLAB/Simulink|||Quiz 3 — MATLAB/Simulink', [
  { id: 'q1', question: 'Khối nào trong Simulink biến gia tốc thành vận tốc?', options: ['Gain', 'Integrator (1/s)', 'Scope', 'Sum'], correctIndex: 1, explanation: 'Integrator tích phân tín hiệu: gia tốc → vận tốc → vị trí.' },
  { id: 'q2', question: 'Khi sinh mã cho ECU thời gian thực (HIL), bắt buộc dùng bộ giải?', options: ['Variable-step', 'Fixed-step (dt cố định)', 'Không cần bộ giải', 'ode45'], correctIndex: 1, explanation: 'Thời gian thực cần bước cố định (fixed-step) để nhịp xác định.' },
  { id: 'q3', question: 'Simulink mô hình hệ thống chủ yếu bằng?', options: ['Viết tay phương trình vi phân', 'Sơ đồ khối với tín hiệu chảy theo dây', 'Chỉ dùng bảng tính', 'Gõ mã assembly'], correctIndex: 1, explanation: 'Simulink là môi trường sơ đồ khối; nó tự giải ODE bên dưới.' },
]);

const c4 = doc('msa201-4-1-vehicle-dynamics', '4.1 — Vehicle dynamics models|||4.1 — Mô hình động lực học xe',
  'Ba trục chuyển động: dọc (tăng/phanh), ngang (lái/quay vòng), thẳng đứng (nhún/treo); mô hình xe cơ bản (điểm khối, bicycle model, quarter-car).',
  [[
    `<span class="eyebrow">MSA201 · Chapter 4 · Lesson 4.1</span>
<h2>Vehicle dynamics models</h2>
<h3>Three axes of motion</h3>
<ul>
<li><strong>Longitudinal</strong> — forward/backward: acceleration, braking, drag. Governs speed and stopping distance.</li>
<li><strong>Lateral</strong> — sideways: steering, cornering, yaw. Governs handling and stability.</li>
<li><strong>Vertical</strong> — up/down: bumps, suspension travel, ride comfort.</li>
</ul>
<h3>Longitudinal model (point mass)</h3>
<pre><code>Newton along the road (F = m·a):
  m·(dv/dt) = F_traction - F_drag - F_roll - F_grade
    F_drag  = 0.5 · rho · Cd · A · v^2   (aerodynamic)
    F_roll  = Cr · m · g                 (rolling resistance)
</code></pre>
<h3>Lateral model (bicycle model)</h3>
<p>The two front wheels are lumped into one, the two rear into one — the <strong>bicycle model</strong>, the standard first model for steering &amp; yaw (Rajamani). It captures how steering angle produces lateral acceleration and yaw rate.</p>
<h3>Vertical model (quarter-car)</h3>
<pre><code>Quarter-car (one corner, 2 masses):
  m_s (sprung, body)   on spring k_s + damper c_s
  m_u (unsprung, wheel) on tire stiffness k_t
  road bump z_r --> suspension --> body motion z_s
</code></pre>
<div class="callout"><span class="badge">Start simple</span> A point mass answers "how fast can it stop?"; the bicycle model answers "will it spin out in a turn?"; the quarter-car answers "is the ride comfortable?" — pick the model for the question.</div>`,
    `<span class="eyebrow">MSA201 · Chương 4 · Bài 4.1</span>
<h2>Mô hình động lực học xe</h2>
<h3>Ba trục chuyển động</h3>
<ul>
<li><strong>Dọc (longitudinal)</strong> — tiến/lùi: tăng tốc, phanh, lực cản. Chi phối tốc độ và quãng đường dừng.</li>
<li><strong>Ngang (lateral)</strong> — sang bên: lái, quay vòng, yaw. Chi phối tính điều khiển và ổn định.</li>
<li><strong>Thẳng đứng (vertical)</strong> — lên/xuống: ổ gà, hành trình treo, êm ái.</li>
</ul>
<h3>Mô hình dọc (điểm khối)</h3>
<pre><code>Newton dọc mặt đường (F = m·a):
  m·(dv/dt) = F_keo - F_can_gio - F_can_lan - F_doc
    F_can_gio = 0.5 · rho · Cd · A · v^2   (khí động)
    F_can_lan = Cr · m · g                 (cản lăn)
</code></pre>
<h3>Mô hình ngang (bicycle model)</h3>
<p>Hai bánh trước gộp thành một, hai bánh sau gộp thành một — <strong>bicycle model</strong>, mô hình đầu tiên chuẩn cho lái &amp; yaw (Rajamani). Nó nắm được cách góc lái sinh ra gia tốc ngang và tốc độ yaw.</p>
<h3>Mô hình đứng (quarter-car)</h3>
<pre><code>Quarter-car (một góc xe, 2 khối lượng):
  m_s (được treo, thân xe) trên lò xo k_s + giảm chấn c_s
  m_u (không treo, bánh xe) trên độ cứng lốp k_t
  ổ gà z_r --> hệ treo --> chuyển động thân z_s
</code></pre>
<div class="callout"><span class="badge">Bắt đầu đơn giản</span> Điểm khối trả lời "dừng nhanh cỡ nào?"; bicycle model trả lời "vào cua có văng không?"; quarter-car trả lời "ngồi có êm không?" — chọn mô hình theo câu hỏi.</div>`,
  ]]);

const c4q = quiz('msa201-quiz-4', 'Quiz 4 — Vehicle dynamics|||Quiz 4 — Động lực học xe', [
  { id: 'q1', question: 'Chuyển động "ngang" (lateral) của xe chi phối chủ yếu điều gì?', options: ['Quãng đường phanh', 'Lái, quay vòng và độ ổn định (yaw)', 'Độ êm khi qua ổ gà', 'Mức tiêu hao nhiên liệu'], correctIndex: 1, explanation: 'Lateral = lái/quay vòng/yaw → tính điều khiển và ổn định.' },
  { id: 'q2', question: 'Trong mô hình dọc, lực cản khí động F_drag tỉ lệ với?', options: ['Vận tốc v', 'Bình phương vận tốc v^2', 'Khối lượng m', 'Góc lái'], correctIndex: 1, explanation: 'F_drag = 0.5·rho·Cd·A·v^2, tỉ lệ với v^2.' },
  { id: 'q3', question: 'Mô hình "quarter-car" dùng để nghiên cứu chủ yếu?', options: ['Quay vòng và yaw', 'Dao động thẳng đứng và độ êm của hệ treo', 'Tiêu hao nhiên liệu', 'Truyền dữ liệu CAN'], correctIndex: 1, explanation: 'Quarter-car mô hình trục thẳng đứng: treo, êm ái khi qua ổ gà.' },
]);

const c5 = doc('msa201-5-1-subsystems', '5.1 — Subsystem models|||5.1 — Mô hình hệ thống con',
  'Mô phỏng hệ thống con của xe: động cơ (mô-men theo ga/vòng tua), phanh (lực hãm, ABS), lái (điện trợ lực EPS), treo (bị động/chủ động).',
  [[
    `<span class="eyebrow">MSA201 · Chapter 5 · Lesson 5.1</span>
<h2>Subsystem models</h2>
<p>A full vehicle is built from <strong>subsystem models</strong> — each a small model you can develop and test on its own, then wire together.</p>
<h3>Engine / powertrain</h3>
<p>Modeled as a <strong>torque map</strong>: a lookup table of output torque vs. throttle &amp; engine speed, plus rotational inertia. For EVs, an electric-motor torque model replaces it.</p>
<h3>Brake system</h3>
<pre><code>Braking force -> deceleration:
  F_brake = mu · N          (friction · normal load)
  ABS logic: if wheel slip > target -> release pressure
                                     -> prevent lock-up
</code></pre>
<h3>Steering</h3>
<p><strong>Electric power steering (EPS)</strong>: a motor adds assist torque based on driver input and speed — modeled as a torque source plus a control law.</p>
<h3>Suspension</h3>
<ul>
<li><strong>Passive</strong> — fixed spring k_s + damper c_s (the quarter-car of Chapter 4).</li>
<li><strong>Active / semi-active</strong> — a controllable damper adjusts c_s in real time for comfort vs. handling.</li>
</ul>
<div class="callout"><span class="badge">Divide &amp; conquer</span> Each subsystem is validated alone (engine on a dyno model, brakes on a slip model), then integrated — the same modular approach real OEMs use.</div>`,
    `<span class="eyebrow">MSA201 · Chương 5 · Bài 5.1</span>
<h2>Mô hình hệ thống con</h2>
<p>Một chiếc xe hoàn chỉnh được ghép từ các <strong>mô hình hệ thống con</strong> — mỗi cái là một mô hình nhỏ bạn phát triển và thử riêng, rồi nối lại.</p>
<h3>Động cơ / hệ truyền động</h3>
<p>Mô hình bằng <strong>bản đồ mô-men</strong>: bảng tra mô-men ra theo ga &amp; vòng tua, cộng quán tính quay. Với xe điện, mô hình mô-men động cơ điện thay thế.</p>
<h3>Hệ thống phanh</h3>
<pre><code>Lực phanh -> giảm tốc:
  F_phanh = mu · N          (ma sát · tải pháp tuyến)
  Logic ABS: nếu trượt bánh > mục tiêu -> nhả áp
                                        -> chống bó cứng
</code></pre>
<h3>Hệ thống lái</h3>
<p><strong>Trợ lực lái điện (EPS)</strong>: một mô-tơ thêm mô-men trợ lực theo lực tài xế và tốc độ — mô hình là một nguồn mô-men cộng một luật điều khiển.</p>
<h3>Hệ thống treo</h3>
<ul>
<li><strong>Bị động</strong> — lò xo k_s + giảm chấn c_s cố định (quarter-car của Chương 4).</li>
<li><strong>Chủ động / bán chủ động</strong> — giảm chấn điều chỉnh được c_s theo thời gian thực để cân bằng êm ái vs điều khiển.</li>
</ul>
<div class="callout"><span class="badge">Chia để trị</span> Mỗi hệ thống con được kiểm chứng riêng (động cơ trên mô hình dyno, phanh trên mô hình trượt), rồi tích hợp — đúng cách làm module của các OEM thật.</div>`,
  ]]);

const c5q = quiz('msa201-quiz-5', 'Quiz 5 — Subsystems|||Quiz 5 — Hệ thống con', [
  { id: 'q1', question: 'Động cơ ô tô thường được mô hình hoá bằng?', options: ['Một hằng số duy nhất', 'Bản đồ mô-men (lookup table) theo ga & vòng tua', 'Một hàm truyền bậc nhất cố định', 'Không mô hình được'], correctIndex: 1, explanation: 'Torque map: bảng tra mô-men theo ga và vòng tua + quán tính quay.' },
  { id: 'q2', question: 'Mục tiêu của logic ABS trong mô hình phanh là?', options: ['Tăng tốc độ tối đa', 'Ngăn bánh bị bó cứng bằng cách điều tiết áp phanh theo độ trượt', 'Giảm tiêu hao nhiên liệu', 'Tăng lực trợ lực lái'], correctIndex: 1, explanation: 'ABS điều tiết áp khi độ trượt vượt ngưỡng để chống bó cứng bánh.' },
  { id: 'q3', question: 'Khác biệt của hệ treo "chủ động/bán chủ động" so với bị động?', options: ['Không có lò xo', 'Giảm chấn c_s điều chỉnh được theo thời gian thực', 'Chỉ dùng cho xe điện', 'Không cần mô hình'], correctIndex: 1, explanation: 'Treo chủ động điều chỉnh giảm chấn theo thời gian thực; bị động cố định.' },
]);

const c6 = doc('msa201-6-1-mbd-codegen', '6.1 — Model-Based Design & code generation|||6.1 — Model-Based Design & sinh mã',
  'Quy trình MBD end-to-end; sinh mã C tự động từ mô hình (Embedded Coder); tổng quan AUTOSAR (kiến trúc phần mềm ECU chuẩn hoá).',
  [[
    `<span class="eyebrow">MSA201 · Chapter 6 · Lesson 6.1</span>
<h2>Model-Based Design &amp; code generation</h2>
<h3>The MBD promise</h3>
<p>In classic development, engineers write a spec and programmers hand-code it — two chances to introduce bugs. In <strong>model-based design</strong>, the <em>model is the spec</em>, and a tool <strong>generates the C code</strong> directly from it. The behavior you simulated is the behavior you ship.</p>
<h3>Code generation</h3>
<pre><code>MBD toolchain (MathWorks example):
  Simulink model  --(Embedded Coder)-->  C source
     |                                      |
  simulate &amp; verify                   compile to ECU binary
</code></pre>
<p>Generated code is deterministic, MISRA-C compliant, and traceable back to each block — critical for safety certification.</p>
<h3>AUTOSAR (overview)</h3>
<p><strong>AUTOSAR</strong> (AUTomotive Open System ARchitecture) is the industry standard that separates <em>software components</em> from the <em>hardware</em> (ECU). It defines a layered architecture (application → runtime environment → basic software) so a component can be reused across different ECUs and suppliers.</p>
<div class="callout"><span class="badge">Simulate once, deploy anywhere</span> A validated model plus code generation plus AUTOSAR means the same tested logic can target many ECUs — the backbone of modern automotive software.</div>`,
    `<span class="eyebrow">MSA201 · Chương 6 · Bài 6.1</span>
<h2>Model-Based Design &amp; sinh mã</h2>
<h3>Lời hứa của MBD</h3>
<p>Trong phát triển cổ điển, kỹ sư viết đặc tả và lập trình viên code tay — hai cơ hội để lỗi lọt vào. Trong <strong>model-based design</strong>, <em>mô hình chính là đặc tả</em>, và một công cụ <strong>sinh ra mã C</strong> trực tiếp từ nó. Hành vi bạn mô phỏng chính là hành vi bạn phát hành.</p>
<h3>Sinh mã</h3>
<pre><code>Chuỗi công cụ MBD (ví dụ MathWorks):
  Mô hình Simulink --(Embedded Coder)-->  mã nguồn C
     |                                       |
  mô phỏng &amp; kiểm chứng               biên dịch ra binary ECU
</code></pre>
<p>Mã sinh ra có tính xác định, tuân MISRA-C, và truy vết được về từng khối — then chốt cho chứng nhận an toàn.</p>
<h3>AUTOSAR (tổng quan)</h3>
<p><strong>AUTOSAR</strong> (AUTomotive Open System ARchitecture) là chuẩn công nghiệp tách <em>thành phần phần mềm</em> khỏi <em>phần cứng</em> (ECU). Nó định nghĩa kiến trúc phân lớp (ứng dụng → môi trường thực thi → phần mềm nền) để một thành phần dùng lại được trên nhiều ECU và nhà cung cấp khác nhau.</p>
<div class="callout"><span class="badge">Mô phỏng một lần, triển khai mọi nơi</span> Mô hình đã kiểm chứng cộng sinh mã cộng AUTOSAR nghĩa là cùng một logic đã thử nghiệm có thể nhắm nhiều ECU — xương sống của phần mềm ô tô hiện đại.</div>`,
  ]]);

const c6q = quiz('msa201-quiz-6', 'Quiz 6 — MBD & code gen|||Quiz 6 — MBD & sinh mã', [
  { id: 'q1', question: 'Ý tưởng cốt lõi của model-based design là?', options: ['Bỏ hẳn mô phỏng', 'Mô hình chính là đặc tả, và mã C được sinh tự động từ nó', 'Chỉ viết code tay', 'Chỉ dùng cho thử nghiệm phần cứng'], correctIndex: 1, explanation: 'MBD: model = spec; công cụ sinh mã C trực tiếp từ mô hình đã kiểm chứng.' },
  { id: 'q2', question: 'AUTOSAR chủ yếu làm gì?', options: ['Sinh dạng sóng', 'Chuẩn hoá kiến trúc phần mềm ECU, tách phần mềm khỏi phần cứng', 'Đo lực phanh', 'Thay thế Simulink'], correctIndex: 1, explanation: 'AUTOSAR là chuẩn kiến trúc phân lớp, tách software component khỏi ECU.' },
  { id: 'q3', question: 'Vì sao mã sinh tự động cần "truy vết được về từng khối"?', options: ['Để chạy nhanh hơn', 'Để phục vụ chứng nhận an toàn và tuân MISRA-C', 'Để giảm dung lượng', 'Không cần thiết'], correctIndex: 1, explanation: 'Truy vết block ↔ mã là yêu cầu của chứng nhận an toàn (traceability).' },
]);

const c7 = doc('msa201-7-1-mil-sil-hil', '7.1 — MIL/SIL/HIL testing|||7.1 — Kiểm thử MIL/SIL/HIL',
  'Ba tầng kiểm chứng: Model-in-the-Loop (thử mô hình), Software-in-the-Loop (thử mã sinh ra), Hardware-in-the-Loop (thử ECU thật với xe mô phỏng thời gian thực).',
  [[
    `<span class="eyebrow">MSA201 · Chapter 7 · Lesson 7.1</span>
<h2>MIL / SIL / HIL testing</h2>
<p>Before code reaches a real car, model-based design verifies it in three escalating loops — each closer to reality, each catching different bugs.</p>
<h3>The three loops</h3>
<ul>
<li><strong>MIL (Model-in-the-Loop)</strong> — the controller <em>model</em> is tested against a plant <em>model</em>, entirely in Simulink. Fastest, cheapest; validates the logic.</li>
<li><strong>SIL (Software-in-the-Loop)</strong> — the <em>generated C code</em> runs against the plant model on your PC. Confirms the code behaves like the model (no code-gen surprises).</li>
<li><strong>HIL (Hardware-in-the-Loop)</strong> — the real <em>ECU hardware</em> runs the code, wired to a <strong>real-time simulator</strong> pretending to be the car. Catches timing, I/O and electrical issues without a physical vehicle.</li>
</ul>
<pre><code>Escalation (cheap/fast -> real/expensive):
  MIL:  model   controller  <->  model  plant     (PC, Simulink)
  SIL:  C code  controller  <->  model  plant     (PC)
  HIL:  ECU     controller  <->  real-time plant   (hardware rig)
</code></pre>
<div class="callout"><span class="badge">Shift left</span> Each loop catches bugs earlier and cheaper than a road test. A defect found at MIL costs almost nothing; the same defect found on a test track costs a fleet and a schedule.</div>`,
    `<span class="eyebrow">MSA201 · Chương 7 · Bài 7.1</span>
<h2>Kiểm thử MIL / SIL / HIL</h2>
<p>Trước khi mã lên xe thật, model-based design kiểm chứng qua ba vòng tăng dần — mỗi vòng gần thực tế hơn, bắt các loại lỗi khác nhau.</p>
<h3>Ba vòng lặp</h3>
<ul>
<li><strong>MIL (Model-in-the-Loop)</strong> — <em>mô hình</em> bộ điều khiển thử với <em>mô hình</em> đối tượng, hoàn toàn trong Simulink. Nhanh nhất, rẻ nhất; kiểm chứng logic.</li>
<li><strong>SIL (Software-in-the-Loop)</strong> — <em>mã C sinh ra</em> chạy với mô hình đối tượng trên PC. Xác nhận mã hành xử giống mô hình (không có bất ngờ từ sinh mã).</li>
<li><strong>HIL (Hardware-in-the-Loop)</strong> — <em>phần cứng ECU</em> thật chạy mã, nối với một <strong>bộ mô phỏng thời gian thực</strong> đóng vai chiếc xe. Bắt lỗi định thời, I/O và điện mà không cần xe vật lý.</li>
</ul>
<pre><code>Tăng dần (rẻ/nhanh -> thật/đắt):
  MIL:  mô hình điều khiển  <->  mô hình đối tượng   (PC, Simulink)
  SIL:  mã C điều khiển     <->  mô hình đối tượng   (PC)
  HIL:  ECU điều khiển      <->  đối tượng thời gian thực (giàn phần cứng)
</code></pre>
<div class="callout"><span class="badge">Đẩy sớm (shift left)</span> Mỗi vòng bắt lỗi sớm hơn và rẻ hơn thử trên đường. Lỗi phát hiện ở MIL gần như không tốn gì; cùng lỗi đó phát hiện trên đường thử tốn cả đội xe và lịch trình.</div>`,
  ]]);

const c7q = quiz('msa201-quiz-7', 'Quiz 7 — MIL/SIL/HIL|||Quiz 7 — MIL/SIL/HIL', [
  { id: 'q1', question: 'Trong SIL (Software-in-the-Loop), thứ được đưa vào thử là?', options: ['Mô hình điều khiển trong Simulink', 'Mã C sinh ra chạy với mô hình đối tượng trên PC', 'Phần cứng ECU thật', 'Chiếc xe thật trên đường'], correctIndex: 1, explanation: 'SIL: mã C sinh ra chạy đối chiếu với mô hình đối tượng trên PC.' },
  { id: 'q2', question: 'HIL (Hardware-in-the-Loop) khác MIL/SIL ở chỗ?', options: ['Không cần mô hình đối tượng', 'ECU phần cứng thật chạy mã, nối với bộ mô phỏng thời gian thực', 'Chạy nhanh nhất và rẻ nhất', 'Chỉ chạy trong Simulink'], correctIndex: 1, explanation: 'HIL dùng ECU thật + real-time simulator, bắt lỗi định thời/I-O/điện.' },
  { id: 'q3', question: 'Vì sao ưu tiên bắt lỗi ở MIL trước ("shift left")?', options: ['MIL cho kết quả sai', 'Lỗi bắt càng sớm càng rẻ; ở MIL gần như không tốn gì', 'MIL cần xe thật', 'MIL chậm nhất'], correctIndex: 1, explanation: 'Lỗi càng phát hiện sớm càng rẻ; MIL là vòng rẻ và nhanh nhất.' },
]);

const c8 = doc('msa201-8-1-applications-trends', '8.1 — Applications & trends|||8.1 — Ứng dụng & xu hướng',
  'Mô phỏng ADAS (kịch bản lái, cảm biến), xe điện (pin/mô-tơ/quãng đường), xe tự hành; digital twin (bản sao số); ví dụ một dự án mô phỏng.',
  [[
    `<span class="eyebrow">MSA201 · Chapter 8 · Lesson 8.1</span>
<h2>Applications &amp; trends</h2>
<h3>ADAS &amp; autonomous driving</h3>
<p><strong>ADAS</strong> (adaptive cruise, lane keeping, emergency braking) and self-driving stacks are validated in simulation first: millions of virtual <em>scenarios</em> (cut-ins, pedestrians, weather) with modeled sensors (camera, radar, lidar) — impossible to cover on real roads.</p>
<h3>Electric vehicles</h3>
<p>EV simulation models the <strong>battery</strong> (state-of-charge, thermal), <strong>electric motor</strong> (torque, efficiency) and <strong>range</strong> over a drive cycle — used to size components and tune energy management before building a prototype.</p>
<h3>Digital twin</h3>
<pre><code>Digital twin = a live simulation mirroring a real asset:
  real vehicle  --sensor data-->  running model
       ^                              |
       +------ prediction / health ---+
</code></pre>
<p>A <strong>digital twin</strong> runs alongside a real car (or fleet), fed by live data, to predict wear, optimize performance and test updates safely.</p>
<h3>Example project</h3>
<p>Build a Simulink model of a car doing an emergency stop: longitudinal dynamics + brake subsystem + ABS logic → simulate stopping distance on dry vs. icy roads → generate code → verify in SIL. That single project touches every chapter of this course.</p>
<div class="callout"><span class="badge">Where it is going</span> More autonomy, more electrification, more software — and all of it born in a model long before it turns a wheel.</div>`,
    `<span class="eyebrow">MSA201 · Chương 8 · Bài 8.1</span>
<h2>Ứng dụng &amp; xu hướng</h2>
<h3>ADAS &amp; lái tự động</h3>
<p><strong>ADAS</strong> (ga tự thích ứng, giữ làn, phanh khẩn cấp) và các stack xe tự lái được kiểm chứng trong mô phỏng trước: hàng triệu <em>kịch bản</em> ảo (xe tạt đầu, người đi bộ, thời tiết) với cảm biến mô hình hoá (camera, radar, lidar) — bất khả thi nếu chỉ chạy đường thật.</p>
<h3>Xe điện</h3>
<p>Mô phỏng xe điện dựng mô hình <strong>pin</strong> (mức sạc, nhiệt), <strong>mô-tơ điện</strong> (mô-men, hiệu suất) và <strong>quãng đường</strong> qua một chu trình lái — dùng để chọn kích cỡ linh kiện và tinh chỉnh quản lý năng lượng trước khi làm nguyên mẫu.</p>
<h3>Digital twin (bản sao số)</h3>
<pre><code>Digital twin = một mô phỏng sống phản chiếu tài sản thật:
  xe thật  --dữ liệu cảm biến-->  mô hình đang chạy
      ^                              |
      +------ dự đoán / sức khoẻ ----+
</code></pre>
<p>Một <strong>digital twin</strong> chạy song song với xe thật (hoặc đội xe), nạp dữ liệu trực tiếp, để dự đoán hao mòn, tối ưu vận hành và thử bản cập nhật an toàn.</p>
<h3>Ví dụ một dự án</h3>
<p>Dựng mô hình Simulink một chiếc xe phanh khẩn cấp: động lực học dọc + hệ thống con phanh + logic ABS → mô phỏng quãng đường dừng trên đường khô vs đường băng → sinh mã → kiểm chứng trong SIL. Chỉ một dự án đó chạm tới mọi chương của môn học này.</p>
<div class="callout"><span class="badge">Nó đi về đâu</span> Tự hành nhiều hơn, điện hoá nhiều hơn, phần mềm nhiều hơn — và tất cả sinh ra trong một mô hình từ rất lâu trước khi lăn bánh.</div>`,
  ]]);

const c8q = quiz('msa201-quiz-8', 'Quiz 8 — Applications & trends|||Quiz 8 — Ứng dụng & xu hướng', [
  { id: 'q1', question: 'Vì sao ADAS và xe tự hành được kiểm chứng trong mô phỏng trước?', options: ['Vì mô phỏng luôn rẻ hơn', 'Có thể chạy hàng triệu kịch bản (tạt đầu, người đi bộ, thời tiết) bất khả thi trên đường thật', 'Vì không cần cảm biến', 'Vì luật cấm chạy thật'], correctIndex: 1, explanation: 'Mô phỏng chạy triệu kịch bản + cảm biến mô hình mà đường thật không phủ nổi.' },
  { id: 'q2', question: '"Digital twin" (bản sao số) là gì?', options: ['Một bản sao lưu dữ liệu', 'Một mô phỏng sống phản chiếu tài sản thật, nạp dữ liệu trực tiếp để dự đoán/tối ưu', 'Một loại pin', 'Một chuẩn phần mềm ECU'], correctIndex: 1, explanation: 'Digital twin: mô phỏng chạy song song xe thật, nạp dữ liệu live để dự đoán.' },
  { id: 'q3', question: 'Mô phỏng xe điện chủ yếu dựng mô hình cho những gì?', options: ['Chỉ khí động học', 'Pin (mức sạc/nhiệt), mô-tơ điện (mô-men/hiệu suất) và quãng đường', 'Chỉ hệ thống lái', 'Chỉ AUTOSAR'], correctIndex: 1, explanation: 'EV sim: pin, mô-tơ điện và quãng đường qua chu trình lái.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'MSA201',
    slug: 'msa201-modeling-and-simulation-for-automotive-systems',
    title: 'Modeling and Simulation for Automotive Systems',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MSA201.webp',
    shortDescription: 'Model & simulate automotive systems — math models (ODE, transfer function, state-space), MATLAB/Simulink, vehicle dynamics, engine/brake/steering/suspension, model-based design & code gen, MIL/SIL/HIL, ADAS/EV/digital twin. Bilingual, with quizzes.|||Mô hình hoá & mô phỏng hệ thống ô tô — mô hình toán, MATLAB/Simulink, động lực học xe, hệ thống con, model-based design & sinh mã, MIL/SIL/HIL, ADAS/xe điện/digital twin. Song ngữ, có quiz.',
    description: 'Môn <strong>MSA201 — Modeling and Simulation for Automotive Systems</strong> (kỳ 5, ngành Kỹ thuật phần mềm ô tô) dạy bạn thiết kế hệ thống ô tô bằng <strong>mô hình &amp; mô phỏng</strong> — cách ngành ô tô thực sự xây dựng phần mềm. Đi qua cả lộ trình: <strong>mô hình hoá &amp; mô phỏng là gì</strong> → <strong>mô hình toán</strong> (ODE, hàm truyền, state-space) → <strong>MATLAB/Simulink</strong> → <strong>động lực học xe</strong> (dọc/ngang/thẳng đứng) → <strong>hệ thống con</strong> (động cơ, phanh, lái, treo) → <strong>model-based design &amp; sinh mã</strong> (AUTOSAR) → <strong>kiểm thử MIL/SIL/HIL</strong> → <strong>ứng dụng</strong> (ADAS, xe điện, tự hành, digital twin). Bám giáo trình chuẩn quốc tế (Rajamani, MathWorks), song ngữ, có mô hình toán và quiz mỗi chương.',
    whatYouLearn: 'Mô hình vs mô phỏng &amp; vòng lặp MBD; phương trình vi phân, hàm truyền G(s), state-space (x.=Ax+Bu); Simulink (Integrator/Gain/Sum/Scope, bộ giải fixed/variable-step); động lực học dọc (F=ma, cản gió/lăn), ngang (bicycle model, yaw), đứng (quarter-car); mô hình động cơ (torque map), phanh (ABS), lái (EPS), treo (bị động/chủ động); sinh mã C từ mô hình &amp; AUTOSAR; kiểm thử MIL/SIL/HIL; mô phỏng ADAS, xe điện, tự hành và digital twin.',
    requirements: 'Toán/vật lý phổ thông (đạo hàm, định luật Newton). Nên cài MATLAB/Simulink (hoặc dùng Octave/Python + SciPy) để chạy thử mô phỏng.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách Rajamani, tài liệu MathWorks, YouTube, công cụ.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao ô tô được thiết kế bằng mô hình; model-based design; lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Mô hình & mô phỏng|||Chapter 1 — Modeling & simulation', description: 'Model vs simulation, loại mô hình, vòng lặp MBD.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Mô hình toán|||Chapter 2 — Math models', description: 'ODE, hàm truyền G(s), state-space.', lessons: [c2, c2q] },
    { title: 'Chương 3 — MATLAB/Simulink|||Chapter 3 — MATLAB/Simulink', description: 'Khối cơ bản, bộ giải số, chạy mô phỏng.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Động lực học xe|||Chapter 4 — Vehicle dynamics', description: 'Dọc/ngang/thẳng đứng, bicycle & quarter-car.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Hệ thống con|||Chapter 5 — Subsystems', description: 'Động cơ, phanh (ABS), lái (EPS), treo.', lessons: [c5, c5q] },
    { title: 'Chương 6 — MBD & sinh mã|||Chapter 6 — MBD & code gen', description: 'Quy trình MBD, code generation, AUTOSAR.', lessons: [c6, c6q] },
    { title: 'Chương 7 — MIL/SIL/HIL|||Chapter 7 — MIL/SIL/HIL', description: 'Model/software/hardware-in-the-loop.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ứng dụng & xu hướng|||Chapter 8 — Applications & trends', description: 'ADAS, xe điện, tự hành, digital twin.', lessons: [c8, c8q] },
  ],
};
