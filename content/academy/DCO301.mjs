/**
 * DCO301 — Digital Controls (Điều khiển số). Ngành Robotics & AI, Kỳ 5 (FPTU).
 * Khung chất lượng, 8 chương: hệ điều khiển → mô hình hoá → đáp ứng → PID →
 * rời rạc hoá & lấy mẫu → phân tích hệ rời rạc → thiết kế bộ điều khiển số →
 * ứng dụng robot & nhúng. Sách chuẩn: Ogata "Discrete-Time Control Systems",
 * Franklin "Feedback Control of Dynamic Systems", Nise "Control Systems
 * Engineering"; MATLAB/Simulink. Song ngữ + công thức (text) + ví dụ + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3)/courseCode. ⚠️ KHÔNG backtick/${; & → &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('dco301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Ogata, Franklin, Nise), tài liệu miễn phí, YouTube, công cụ (MATLAB/Simulink), lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">DCO301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Digital Controls</strong> — from continuous feedback control and transfer functions to sampling, the z-transform and digital controller design for robots — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are trusted books and free resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for DCO301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><strong>Ogata</strong> — <em>Discrete-Time Control Systems</em> (the core reference for sampling, z-transform and digital design).</li>
<li><strong>Franklin, Powell &amp; Emami-Naeini</strong> — <em>Feedback Control of Dynamic Systems</em>.</li>
<li><strong>Nise</strong> — <em>Control Systems Engineering</em> (clear intro to modelling, response &amp; PID).</li>
</ul>
<h3>🌐 Free documentation</h3>
<ul>
<li><a href="https://www.mathworks.com/help/control/" target="_blank" rel="noopener">MATLAB Control System Toolbox docs</a></li>
<li><a href="https://ctms.engin.umich.edu/CTMS/index.php?aux=Home" target="_blank" rel="noopener">Control Tutorials for MATLAB &amp; Simulink (Univ. of Michigan)</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@ControlSystemLectures" target="_blank" rel="noopener">Brian Douglas — Control System Lectures</a></li>
<li><a href="https://www.youtube.com/@MATLAB" target="_blank" rel="noopener">MATLAB — Control &amp; Simulink tutorials</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.mathworks.com/products/matlab.html" target="_blank" rel="noopener">MATLAB / Simulink</a> — modelling, simulation &amp; controller design.</li>
<li><a href="https://www.gnu.org/software/octave/" target="_blank" rel="noopener">GNU Octave</a> — free MATLAB-compatible alternative.</li>
<li><a href="https://www.python-control.org/" target="_blank" rel="noopener">python-control</a> — control systems library for Python.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — open/closed loop &amp; feedback, transfer function G(s), first/second-order response, stability.</li>
<li><strong>PID</strong> — the P, I, D terms, what each does, and how to tune a loop.</li>
<li><strong>Go digital</strong> — sampling, the z-transform, ZOH, stability inside the unit circle, and digital PID.</li>
<li><strong>Job-ready</strong> — put a controller on a microcontroller and drive a real motor or servo.</li>
</ol></div>`,
    `<span class="eyebrow">DCO301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Điều khiển số</strong> — từ điều khiển phản hồi liên tục và hàm truyền tới lấy mẫu, biến đổi z và thiết kế bộ điều khiển số cho robot — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là sách uy tín và nguồn miễn phí.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DCO301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><strong>Ogata</strong> — <em>Discrete-Time Control Systems</em> (tài liệu lõi về lấy mẫu, biến đổi z và thiết kế số).</li>
<li><strong>Franklin, Powell &amp; Emami-Naeini</strong> — <em>Feedback Control of Dynamic Systems</em>.</li>
<li><strong>Nise</strong> — <em>Control Systems Engineering</em> (nhập môn rõ ràng về mô hình hoá, đáp ứng &amp; PID).</li>
</ul>
<h3>🌐 Tài liệu miễn phí</h3>
<ul>
<li><a href="https://www.mathworks.com/help/control/" target="_blank" rel="noopener">Tài liệu MATLAB Control System Toolbox</a></li>
<li><a href="https://ctms.engin.umich.edu/CTMS/index.php?aux=Home" target="_blank" rel="noopener">Control Tutorials for MATLAB &amp; Simulink (ĐH Michigan)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ControlSystemLectures" target="_blank" rel="noopener">Brian Douglas — Control System Lectures</a></li>
<li><a href="https://www.youtube.com/@MATLAB" target="_blank" rel="noopener">MATLAB — hướng dẫn Control &amp; Simulink</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.mathworks.com/products/matlab.html" target="_blank" rel="noopener">MATLAB / Simulink</a> — mô hình hoá, mô phỏng &amp; thiết kế bộ điều khiển.</li>
<li><a href="https://www.gnu.org/software/octave/" target="_blank" rel="noopener">GNU Octave</a> — bản thay thế miễn phí tương thích MATLAB.</li>
<li><a href="https://www.python-control.org/" target="_blank" rel="noopener">python-control</a> — thư viện điều khiển cho Python.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — vòng hở/kín &amp; phản hồi, hàm truyền G(s), đáp ứng bậc 1/bậc 2, ổn định.</li>
<li><strong>PID</strong> — ba khâu P, I, D, mỗi khâu làm gì, và cách chỉnh định một vòng.</li>
<li><strong>Chuyển sang số</strong> — lấy mẫu, biến đổi z, ZOH, ổn định trong vòng tròn đơn vị, và PID số.</li>
<li><strong>Sẵn sàng đi làm</strong> — nạp bộ điều khiển vào vi điều khiển và chạy một động cơ hoặc servo thật.</li>
</ol></div>`,
  ]]);

const intro = doc('dco301-0-1-overview', 'Course overview: Digital Controls|||Tổng quan: Điều khiển số',
  'Điều khiển làm gì; vì sao robot cần điều khiển số; lộ trình: hệ điều khiển & mô hình hoá → đáp ứng & PID → rời rạc hoá & phân tích z → thiết kế bộ điều khiển số → ứng dụng robot/nhúng.',
  [[
    `<span class="eyebrow">DCO301 · Lesson 0.1 · Overview</span>
<h2>Digital Controls</h2>
<p class="lead">This course teaches you <strong>how to make a system behave the way you want</strong> — hold a motor at a target speed, keep a robot arm on a path, balance a self-driving robot. You start with classical <strong>continuous</strong> control (transfer functions, response, PID), then move to <strong>digital</strong> control: the maths and design that run inside a microcontroller sampling the world many times a second.</p>
<h3>Why digital?</h3>
<p>Real robot controllers are software running on an MCU. They read a sensor, compute, and drive an actuator on a fixed <strong>sample clock</strong> — not continuously. That sampling changes the maths: the Laplace transform G(s) gives way to the <strong>z-transform</strong>, and stability is judged inside the <strong>unit circle</strong> instead of the left half-plane.</p>
<h3>Roadmap (8 chapters)</h3>
<ul>
<li><strong>1–2 Foundations</strong> — control systems (open/closed loop, feedback) &amp; modelling (transfer function, state space).</li>
<li><strong>3–4 Analysis &amp; PID</strong> — time response, stability, poles/zeros; the PID controller and tuning.</li>
<li><strong>5–6 Going discrete</strong> — sampling, z-transform, ZOH; analysing discrete systems.</li>
<li><strong>7–8 Design &amp; apply</strong> — digital controller design &amp; quantization; motor/servo control on an MCU.</li>
</ul>
<div class="callout"><span class="badge">Tools</span> We reason with formulas by hand and check them in <strong>MATLAB/Simulink</strong> (or Octave / python-control). Simulate first, then deploy to hardware.</div>`,
    `<span class="eyebrow">DCO301 · Bài 0.1 · Tổng quan</span>
<h2>Điều khiển số</h2>
<p class="lead">Môn này dạy bạn <strong>cách bắt một hệ thống hành xử đúng ý mình</strong> — giữ động cơ ở tốc độ đặt, giữ cánh tay robot bám quỹ đạo, cân bằng một robot tự hành. Bạn bắt đầu từ điều khiển <strong>liên tục</strong> kinh điển (hàm truyền, đáp ứng, PID), rồi chuyển sang điều khiển <strong>số</strong>: phần toán và thiết kế chạy bên trong vi điều khiển lấy mẫu thế giới nhiều lần mỗi giây.</p>
<h3>Vì sao lại là số?</h3>
<p>Bộ điều khiển robot thực tế là phần mềm chạy trên MCU. Nó đọc cảm biến, tính toán, rồi tác động cơ cấu chấp hành theo một <strong>nhịp lấy mẫu</strong> cố định — không liên tục. Việc lấy mẫu làm đổi phần toán: biến đổi Laplace G(s) nhường chỗ cho <strong>biến đổi z</strong>, và ổn định được xét bên trong <strong>vòng tròn đơn vị</strong> thay vì nửa mặt phẳng trái.</p>
<h3>Lộ trình (8 chương)</h3>
<ul>
<li><strong>1–2 Nền tảng</strong> — hệ điều khiển (vòng hở/kín, phản hồi) &amp; mô hình hoá (hàm truyền, không gian trạng thái).</li>
<li><strong>3–4 Phân tích &amp; PID</strong> — đáp ứng thời gian, ổn định, cực/zero; bộ điều khiển PID và chỉnh định.</li>
<li><strong>5–6 Chuyển sang rời rạc</strong> — lấy mẫu, biến đổi z, ZOH; phân tích hệ rời rạc.</li>
<li><strong>7–8 Thiết kế &amp; ứng dụng</strong> — thiết kế bộ điều khiển số &amp; lượng tử hoá; điều khiển động cơ/servo trên MCU.</li>
</ul>
<div class="callout"><span class="badge">Công cụ</span> Ta suy luận bằng công thức trên giấy và kiểm lại trong <strong>MATLAB/Simulink</strong> (hoặc Octave / python-control). Mô phỏng trước, rồi mới nạp lên phần cứng.</div>`,
  ]]);

const c1 = doc('dco301-1-1-control-systems', '1.1 — Control systems|||1.1 — Hệ thống điều khiển',
  'Vòng hở vs vòng kín, phản hồi (feedback) và sai số, ví dụ đời thực (lò nhiệt, cruise control), sơ đồ khối và các khối tham chiếu/bộ điều khiển/đối tượng/cảm biến.',
  [[
    `<span class="eyebrow">DCO301 · Chapter 1 · Lesson 1.1</span>
<h2>Control systems</h2>
<h3>Open loop vs closed loop</h3>
<ul>
<li><strong>Open loop</strong> — the controller acts without checking the result (a toaster runs a fixed time). Simple, but blind to disturbances.</li>
<li><strong>Closed loop (feedback)</strong> — a sensor measures the output, the system compares it to the target, and corrects the difference. This is what makes control robust.</li>
</ul>
<h3>Feedback &amp; error</h3>
<p>The heart of feedback control is the <strong>error</strong>: how far the measured output is from what we want. The controller works to drive that error toward zero.</p>
<pre><code>reference r(t)  --&gt;( + )--&gt; error e(t) --&gt; [Controller] --&gt; u(t) --&gt; [Plant] --&gt; output y(t)
                    ^-                                                              |
                    |------------------ [Sensor] &lt;------------------------------------|

  e(t) = r(t) - y(t)      (error = target - measured)
</code></pre>
<h3>Everyday examples</h3>
<ul>
<li><strong>Cruise control</strong> — target speed r, measured speed y; throttle corrects the error on a hill.</li>
<li><strong>Thermostat / heater</strong> — target temperature vs room temperature.</li>
<li><strong>Robot arm joint</strong> — target angle vs encoder angle.</li>
</ul>
<div class="callout"><span class="badge">Block diagram</span> Reference, controller, plant (the thing being controlled), sensor. Every control problem in this course is drawn as this loop — learn to read it and half the subject is done.</div>`,
    `<span class="eyebrow">DCO301 · Chương 1 · Bài 1.1</span>
<h2>Hệ thống điều khiển</h2>
<h3>Vòng hở và vòng kín</h3>
<ul>
<li><strong>Vòng hở</strong> — bộ điều khiển tác động mà không kiểm tra kết quả (máy nướng chạy một khoảng thời gian cố định). Đơn giản, nhưng mù với nhiễu.</li>
<li><strong>Vòng kín (phản hồi)</strong> — cảm biến đo đầu ra, hệ so với giá trị đặt, và sửa phần chênh lệch. Đây là điều làm cho điều khiển bền vững.</li>
</ul>
<h3>Phản hồi &amp; sai số</h3>
<p>Trái tim của điều khiển phản hồi là <strong>sai số</strong>: đầu ra đo được cách giá trị mong muốn bao xa. Bộ điều khiển làm việc để kéo sai số đó về không.</p>
<pre><code>đặt r(t)  --&gt;( + )--&gt; sai số e(t) --&gt; [Bộ điều khiển] --&gt; u(t) --&gt; [Đối tượng] --&gt; ra y(t)
              ^-                                                                   |
              |------------------------ [Cảm biến] &lt;-----------------------------------|

  e(t) = r(t) - y(t)      (sai số = giá trị đặt - đo được)
</code></pre>
<h3>Ví dụ đời thực</h3>
<ul>
<li><strong>Ga tự động (cruise control)</strong> — tốc độ đặt r, tốc độ đo y; chân ga sửa sai số khi lên dốc.</li>
<li><strong>Bộ ổn nhiệt / lò sưởi</strong> — nhiệt độ đặt so với nhiệt độ phòng.</li>
<li><strong>Khớp cánh tay robot</strong> — góc đặt so với góc encoder đo được.</li>
</ul>
<div class="callout"><span class="badge">Sơ đồ khối</span> Giá trị đặt, bộ điều khiển, đối tượng (thứ được điều khiển), cảm biến. Mọi bài điều khiển trong môn đều vẽ thành vòng này — đọc được nó là xong nửa môn học.</div>`,
  ]]);

const c1q = quiz('dco301-quiz-1', 'Quiz 1 — Control systems|||Quiz 1 — Hệ điều khiển', [
  { id: 'q1', question: 'Điểm khác biệt cốt lõi của hệ vòng kín so với vòng hở là?', options: ['Chạy nhanh hơn', 'Có phản hồi (đo đầu ra) để sửa sai số', 'Không cần cảm biến', 'Luôn rẻ hơn'], correctIndex: 1, explanation: 'Vòng kín đo đầu ra và sửa sai số; vòng hở tác động mù.' },
  { id: 'q2', question: 'Sai số e(t) trong vòng điều khiển được tính bằng?', options: ['y(t) × r(t)', 'r(t) − y(t)', 'r(t) + y(t)', 'u(t) − r(t)'], correctIndex: 1, explanation: 'e(t) = giá trị đặt r(t) trừ đầu ra đo được y(t).' },
  { id: 'q3', question: 'Trong sơ đồ khối, "đối tượng" (plant) là?', options: ['Cảm biến đo đầu ra', 'Thứ đang được điều khiển', 'Giá trị đặt', 'Bộ khuếch đại sai số'], correctIndex: 1, explanation: 'Plant là hệ vật lý cần điều khiển (động cơ, lò, cánh tay...).' },
]);

const c2 = doc('dco301-2-1-modelling', '2.1 — System modelling|||2.1 — Mô hình hoá hệ thống',
  'Từ phương trình vi phân tới hàm truyền G(s) = Y(s)/U(s) qua biến đổi Laplace; ví dụ hệ bậc 1 (RC, động cơ); tổng quan không gian trạng thái (state space).',
  [[
    `<span class="eyebrow">DCO301 · Chapter 2 · Lesson 2.1</span>
<h2>System modelling</h2>
<p>To design a controller you first need a <strong>model</strong> — a maths description of how the plant responds to input.</p>
<h3>Differential equation → transfer function</h3>
<p>Physics gives a <strong>differential equation</strong> relating output y(t) to input u(t). The <strong>Laplace transform</strong> turns calculus into algebra: derivatives become multiplication by s. The <strong>transfer function</strong> is the ratio of output to input in the s-domain, assuming zero initial conditions.</p>
<pre><code>Differential eq (first order):   tau * dy/dt + y = K * u

Laplace (zero initial cond.):    tau * s * Y(s) + Y(s) = K * U(s)

Transfer function:
                    Y(s)        K
          G(s) = -------- = -----------
                    U(s)      tau*s + 1

  K   = DC gain (final value for a unit step)
  tau = time constant (how fast it responds)
</code></pre>
<h3>State space (overview)</h3>
<p>An alternative model uses <strong>state variables</strong> x (e.g. position and velocity) in matrix form. It scales to many inputs/outputs and underpins modern and digital control.</p>
<pre><code>  dx/dt = A*x + B*u        (state equation)
      y = C*x + D*u        (output equation)
</code></pre>
<div class="callout"><span class="badge">Two views, one system</span> Transfer function G(s) is great for single-loop analysis; state space (A, B, C, D) is the natural language for multivariable and computer-based (digital) control.</div>`,
    `<span class="eyebrow">DCO301 · Chương 2 · Bài 2.1</span>
<h2>Mô hình hoá hệ thống</h2>
<p>Để thiết kế bộ điều khiển, trước hết bạn cần một <strong>mô hình</strong> — mô tả toán học cách đối tượng đáp ứng với đầu vào.</p>
<h3>Phương trình vi phân → hàm truyền</h3>
<p>Vật lý cho một <strong>phương trình vi phân</strong> nối đầu ra y(t) với đầu vào u(t). <strong>Biến đổi Laplace</strong> biến giải tích thành đại số: đạo hàm trở thành phép nhân với s. <strong>Hàm truyền</strong> là tỉ số đầu ra trên đầu vào trong miền s, với điều kiện đầu bằng không.</p>
<pre><code>PT vi phân (bậc 1):   tau * dy/dt + y = K * u

Laplace (đk đầu = 0): tau * s * Y(s) + Y(s) = K * U(s)

Hàm truyền:
                    Y(s)        K
          G(s) = -------- = -----------
                    U(s)      tau*s + 1

  K   = độ lợi DC (giá trị cuối khi vào bậc thang đơn vị)
  tau = hằng số thời gian (đáp ứng nhanh hay chậm)
</code></pre>
<h3>Không gian trạng thái (tổng quan)</h3>
<p>Một mô hình khác dùng <strong>biến trạng thái</strong> x (vd vị trí và vận tốc) ở dạng ma trận. Nó mở rộng được cho nhiều vào/ra và là nền của điều khiển hiện đại và điều khiển số.</p>
<pre><code>  dx/dt = A*x + B*u        (phương trình trạng thái)
      y = C*x + D*u        (phương trình đầu ra)
</code></pre>
<div class="callout"><span class="badge">Hai góc nhìn, một hệ</span> Hàm truyền G(s) hợp cho phân tích một vòng; không gian trạng thái (A, B, C, D) là ngôn ngữ tự nhiên cho điều khiển đa biến và điều khiển trên máy tính (số).</div>`,
  ]]);

const c2q = quiz('dco301-quiz-2', 'Quiz 2 — Modelling|||Quiz 2 — Mô hình hoá', [
  { id: 'q1', question: 'Hàm truyền G(s) được định nghĩa là?', options: ['Y(s) × U(s)', 'Y(s) / U(s) với điều kiện đầu bằng 0', 'U(s) / Y(s)', 'Đạo hàm của y(t)'], correctIndex: 1, explanation: 'G(s) = Y(s)/U(s) trong miền Laplace, điều kiện đầu = 0.' },
  { id: 'q2', question: 'Trong G(s) = K/(tau·s + 1), tham số tau biểu thị?', options: ['Độ lợi một chiều', 'Hằng số thời gian (nhanh/chậm)', 'Số cực', 'Sai số xác lập'], correctIndex: 1, explanation: 'tau là hằng số thời gian; K là độ lợi DC.' },
  { id: 'q3', question: 'Cặp phương trình dx/dt = A·x + B·u và y = C·x + D·u mô tả?', options: ['Biến đổi z', 'Mô hình không gian trạng thái', 'Bộ điều khiển PID', 'Định luật Ohm'], correctIndex: 1, explanation: 'Đó là mô hình không gian trạng thái (state space).' },
]);

const c3 = doc('dco301-3-1-response', '3.1 — System response|||3.1 — Đáp ứng hệ thống',
  'Đáp ứng thời gian với đầu vào bậc thang; hệ bậc 1 (hằng số thời gian, 63%) và bậc 2 (vọt lố, thời gian xác lập, tần số riêng, hệ số tắt dần); cực-zero và ổn định (nửa mặt phẳng trái).',
  [[
    `<span class="eyebrow">DCO301 · Chapter 3 · Lesson 3.1</span>
<h2>System response</h2>
<h3>Time response to a step</h3>
<p>Poke a system with a <strong>step input</strong> and watch the output. This reveals its character.</p>
<ul>
<li><strong>First order</strong> — smooth rise toward the final value; reaches ~63% after one time constant tau, ~95% after 3·tau.</li>
<li><strong>Second order</strong> — may <strong>overshoot</strong> and oscillate before settling. Described by natural frequency wn and damping ratio zeta.</li>
</ul>
<pre><code>Second-order key metrics:
  zeta &lt; 1  -&gt; underdamped  (overshoots, rings)
  zeta = 1  -&gt; critically damped (fastest with no overshoot)
  zeta &gt; 1  -&gt; overdamped   (slow, no overshoot)

  Overshoot and settling time both depend on zeta and wn.
</code></pre>
<h3>Poles, zeros &amp; stability</h3>
<p>The <strong>poles</strong> are the roots of the denominator of G(s); they set the response shape. A continuous system is <strong>stable</strong> when every pole lies in the <strong>left half of the s-plane</strong> (negative real part) — then any disturbance dies out instead of growing.</p>
<pre><code>  Pole real part &lt; 0  -&gt; STABLE   (response decays)
  Pole real part = 0  -&gt; marginal  (sustained oscillation)
  Pole real part &gt; 0  -&gt; UNSTABLE (response blows up)
</code></pre>
<div class="callout"><span class="badge">Design goal</span> A good controller places the closed-loop poles so the response is fast enough, with acceptable overshoot, and always stable.</div>`,
    `<span class="eyebrow">DCO301 · Chương 3 · Bài 3.1</span>
<h2>Đáp ứng hệ thống</h2>
<h3>Đáp ứng thời gian với bậc thang</h3>
<p>Kích hệ bằng một <strong>đầu vào bậc thang</strong> rồi quan sát đầu ra. Điều này bộc lộ tính cách của hệ.</p>
<ul>
<li><strong>Bậc 1</strong> — tăng mượt tới giá trị cuối; đạt ~63% sau một hằng số thời gian tau, ~95% sau 3·tau.</li>
<li><strong>Bậc 2</strong> — có thể <strong>vọt lố</strong> và dao động trước khi ổn định. Mô tả bằng tần số riêng wn và hệ số tắt dần zeta.</li>
</ul>
<pre><code>Chỉ tiêu bậc 2 quan trọng:
  zeta &lt; 1  -&gt; thiếu tắt dần (vọt lố, rung)
  zeta = 1  -&gt; tắt dần tới hạn (nhanh nhất mà không vọt lố)
  zeta &gt; 1  -&gt; quá tắt dần   (chậm, không vọt lố)

  Vọt lố và thời gian xác lập đều phụ thuộc zeta và wn.
</code></pre>
<h3>Cực, zero &amp; ổn định</h3>
<p><strong>Cực (pole)</strong> là nghiệm mẫu số của G(s); chúng định hình dáng đáp ứng. Hệ liên tục <strong>ổn định</strong> khi mọi cực nằm ở <strong>nửa trái mặt phẳng s</strong> (phần thực âm) — khi đó nhiễu tắt dần thay vì lớn lên.</p>
<pre><code>  Phần thực của cực &lt; 0  -&gt; ỔN ĐỊNH   (đáp ứng tắt dần)
  Phần thực của cực = 0  -&gt; biên giới  (dao động duy trì)
  Phần thực của cực &gt; 0  -&gt; KHÔNG ỔN ĐỊNH (đáp ứng bùng nổ)
</code></pre>
<div class="callout"><span class="badge">Mục tiêu thiết kế</span> Bộ điều khiển tốt đặt các cực vòng kín sao cho đáp ứng đủ nhanh, vọt lố chấp nhận được, và luôn ổn định.</div>`,
  ]]);

const c3q = quiz('dco301-quiz-3', 'Quiz 3 — Response|||Quiz 3 — Đáp ứng', [
  { id: 'q1', question: 'Sau một hằng số thời gian tau, đáp ứng bậc 1 đạt khoảng?', options: ['100%', '63%', '10%', '50%'], correctIndex: 1, explanation: 'Hệ bậc 1 đạt ~63% giá trị cuối sau 1·tau, ~95% sau 3·tau.' },
  { id: 'q2', question: 'Hệ bậc 2 với zeta < 1 (thiếu tắt dần) sẽ?', options: ['Không bao giờ tới đích', 'Vọt lố và dao động trước khi ổn định', 'Tăng mượt không vọt lố', 'Luôn không ổn định'], correctIndex: 1, explanation: 'zeta < 1: thiếu tắt dần → có vọt lố và dao động.' },
  { id: 'q3', question: 'Hệ liên tục ổn định khi mọi cực nằm ở đâu?', options: ['Nửa phải mặt phẳng s', 'Trên trục ảo', 'Nửa trái mặt phẳng s (phần thực âm)', 'Ngoài vòng tròn đơn vị'], correctIndex: 2, explanation: 'Ổn định liên tục: mọi cực có phần thực âm (nửa trái mặt phẳng s).' },
]);

const c4 = doc('dco301-4-1-pid', '4.1 — PID control|||4.1 — Điều khiển PID',
  'Ba khâu P (tỉ lệ), I (tích phân), D (vi phân) và tác dụng của từng khâu; luật u(t); chỉnh định (Ziegler-Nichols, thử-sai); ứng dụng điều khiển tốc độ/vị trí robot.',
  [[
    `<span class="eyebrow">DCO301 · Chapter 4 · Lesson 4.1</span>
<h2>PID control</h2>
<p>The <strong>PID controller</strong> is the workhorse of industry and robotics. It builds the control action from the error e(t) using three terms.</p>
<pre><code>  u(t) = Kp * e(t)  +  Ki * integral( e(t) dt )  +  Kd * de(t)/dt
          \\_______/     \\____________________/       \\___________/
         Proportional         Integral                  Derivative
</code></pre>
<h3>What each term does</h3>
<ul>
<li><strong>P (proportional)</strong> — pushes in proportion to the current error. Bigger Kp = faster, but too big = overshoot and oscillation. Alone it often leaves a small steady-state error.</li>
<li><strong>I (integral)</strong> — accumulates past error, so it erases steady-state error. Too much = sluggish and can add overshoot (integral windup).</li>
<li><strong>D (derivative)</strong> — reacts to the rate of change of error; adds damping and reduces overshoot. Sensitive to sensor noise.</li>
</ul>
<h3>Tuning</h3>
<p>Choosing Kp, Ki, Kd is <strong>tuning</strong>. Methods include <strong>Ziegler–Nichols</strong> (from the gain that just makes the loop oscillate) and practical trial-and-error: raise P for speed, add I to kill offset, add D to tame overshoot.</p>
<div class="callout"><span class="badge">Where you meet it</span> Motor speed &amp; position loops, quadcopter attitude, temperature, line-following robots — PID is everywhere. Most robot control code you write will be a PID loop.</div>`,
    `<span class="eyebrow">DCO301 · Chương 4 · Bài 4.1</span>
<h2>Điều khiển PID</h2>
<p><strong>Bộ điều khiển PID</strong> là ngựa thồ của công nghiệp và robot. Nó dựng tác động điều khiển từ sai số e(t) bằng ba khâu.</p>
<pre><code>  u(t) = Kp * e(t)  +  Ki * integral( e(t) dt )  +  Kd * de(t)/dt
          \\_______/     \\____________________/       \\___________/
          Tỉ lệ              Tích phân                    Vi phân
</code></pre>
<h3>Mỗi khâu làm gì</h3>
<ul>
<li><strong>P (tỉ lệ)</strong> — đẩy theo tỉ lệ với sai số hiện tại. Kp lớn = nhanh hơn, nhưng quá lớn = vọt lố và dao động. Riêng P thường để lại sai số xác lập nhỏ.</li>
<li><strong>I (tích phân)</strong> — cộng dồn sai số quá khứ, nên xoá sai số xác lập. Quá nhiều = ì và có thể thêm vọt lố (bão hoà tích phân, windup).</li>
<li><strong>D (vi phân)</strong> — phản ứng theo tốc độ thay đổi của sai số; thêm tắt dần và giảm vọt lố. Nhạy với nhiễu cảm biến.</li>
</ul>
<h3>Chỉnh định</h3>
<p>Chọn Kp, Ki, Kd gọi là <strong>chỉnh định (tuning)</strong>. Có phương pháp <strong>Ziegler–Nichols</strong> (từ độ lợi vừa làm vòng dao động) và thử-sai thực dụng: tăng P cho nhanh, thêm I để diệt sai số dư, thêm D để ghìm vọt lố.</p>
<div class="callout"><span class="badge">Gặp ở đâu</span> Vòng tốc độ &amp; vị trí động cơ, giữ thăng bằng quadcopter, nhiệt độ, robot dò line — PID ở khắp nơi. Phần lớn mã điều khiển robot bạn viết sẽ là một vòng PID.</div>`,
  ]]);

const c4q = quiz('dco301-quiz-4', 'Quiz 4 — PID|||Quiz 4 — PID', [
  { id: 'q1', question: 'Khâu nào của PID chuyên xoá sai số xác lập (steady-state error)?', options: ['P (tỉ lệ)', 'I (tích phân)', 'D (vi phân)', 'Không khâu nào'], correctIndex: 1, explanation: 'Khâu tích phân cộng dồn sai số quá khứ nên triệt tiêu sai số xác lập.' },
  { id: 'q2', question: 'Khâu D (vi phân) chủ yếu giúp?', options: ['Tăng sai số', 'Thêm tắt dần, giảm vọt lố', 'Xoá sai số dư', 'Làm hệ chậm hẳn'], correctIndex: 1, explanation: 'D phản ứng theo tốc độ thay đổi sai số → thêm damping, giảm vọt lố (nhưng nhạy nhiễu).' },
  { id: 'q3', question: 'Luật điều khiển PID là?', options: ['u = Kp·e', 'u = Kp·e + Ki·∫e dt + Kd·de/dt', 'u = Ki·∫e dt', 'u = e/Kp'], correctIndex: 1, explanation: 'PID cộng ba khâu tỉ lệ, tích phân và vi phân của sai số.' },
]);

const c5 = doc('dco301-5-1-sampling', '5.1 — Discretisation & sampling|||5.1 — Rời rạc hoá & lấy mẫu',
  'Vì sao điều khiển số phải lấy mẫu; chu kỳ lấy mẫu T và định lý Nyquist; biến đổi z và toán tử trễ z^-1; giữ mẫu bậc 0 (ZOH); tín hiệu rời rạc x[k].',
  [[
    `<span class="eyebrow">DCO301 · Chapter 5 · Lesson 5.1</span>
<h2>Discretisation &amp; sampling</h2>
<h3>Why sample?</h3>
<p>A digital controller cannot see a signal continuously. It reads the sensor every <strong>sampling period T</strong> seconds, producing a sequence x[k] = x(kT). The continuous time t is replaced by an integer step index k.</p>
<pre><code>  continuous  x(t)  --[sample every T]-->  discrete  x[k] = x(kT),  k = 0,1,2,...

  Nyquist: sample fast enough! Sampling rate must be &gt; 2 x the highest
  signal frequency, or you get aliasing (fake low-frequency ghosts).
</code></pre>
<h3>The z-transform</h3>
<p>Just as Laplace suits continuous signals, the <strong>z-transform</strong> suits sampled sequences. The key object is the <strong>unit delay</strong>: z^-1 means "one sample ago".</p>
<pre><code>  z^-1 * X(z)   &lt;--&gt;   x[k-1]      (delay by one sample)

  A discrete transfer function relates output to input in z:
                  Y(z)
        H(z) =  --------
                  U(z)
</code></pre>
<h3>Zero-order hold (ZOH)</h3>
<p>Between samples the controller output must stay put — the DAC <strong>holds</strong> the last value constant until the next update. This <strong>zero-order hold</strong> is how a discrete command becomes a real continuous voltage to the motor, and it is part of the model when we discretise a plant.</p>
<div class="callout"><span class="badge">Choosing T</span> Faster sampling (small T) tracks better and is more stable, but costs CPU. A common rule: sample 10–20x faster than the closed-loop bandwidth.</div>`,
    `<span class="eyebrow">DCO301 · Chương 5 · Bài 5.1</span>
<h2>Rời rạc hoá &amp; lấy mẫu</h2>
<h3>Vì sao phải lấy mẫu?</h3>
<p>Bộ điều khiển số không thể thấy tín hiệu liên tục. Nó đọc cảm biến mỗi <strong>chu kỳ lấy mẫu T</strong> giây, tạo ra dãy x[k] = x(kT). Thời gian liên tục t được thay bằng chỉ số bước nguyên k.</p>
<pre><code>  liên tục  x(t)  --[lấy mẫu mỗi T]-->  rời rạc  x[k] = x(kT),  k = 0,1,2,...

  Nyquist: lấy mẫu đủ nhanh! Tần số lấy mẫu phải &gt; 2 x tần số cao nhất
  của tín hiệu, nếu không sẽ bị chồng phổ (aliasing, bóng tần số thấp giả).
</code></pre>
<h3>Biến đổi z</h3>
<p>Như Laplace hợp với tín hiệu liên tục, <strong>biến đổi z</strong> hợp với dãy đã lấy mẫu. Đối tượng then chốt là <strong>trễ đơn vị</strong>: z^-1 nghĩa là "mẫu ngay trước".</p>
<pre><code>  z^-1 * X(z)   &lt;--&gt;   x[k-1]      (trễ một mẫu)

  Hàm truyền rời rạc nối đầu ra với đầu vào theo z:
                  Y(z)
        H(z) =  --------
                  U(z)
</code></pre>
<h3>Giữ mẫu bậc 0 (ZOH)</h3>
<p>Giữa các mẫu, đầu ra bộ điều khiển phải giữ nguyên — DAC <strong>giữ</strong> giá trị cuối không đổi tới lần cập nhật kế. <strong>Giữ mẫu bậc 0</strong> này là cách một lệnh rời rạc trở thành điện áp liên tục thật cấp cho động cơ, và là một phần mô hình khi ta rời rạc hoá đối tượng.</p>
<div class="callout"><span class="badge">Chọn T</span> Lấy mẫu nhanh hơn (T nhỏ) bám tốt hơn và ổn định hơn, nhưng tốn CPU. Quy tắc thường gặp: lấy mẫu nhanh hơn 10–20 lần băng thông vòng kín.</div>`,
  ]]);

const c5q = quiz('dco301-quiz-5', 'Quiz 5 — Sampling|||Quiz 5 — Lấy mẫu', [
  { id: 'q1', question: 'Toán tử z^-1 trong biến đổi z biểu diễn?', options: ['Nhân với thời gian', 'Trễ một mẫu (x[k-1])', 'Đạo hàm', 'Tần số lấy mẫu'], correctIndex: 1, explanation: 'z^-1 là trễ đơn vị: z^-1·X(z) tương ứng x[k-1].' },
  { id: 'q2', question: 'Định lý Nyquist yêu cầu tần số lấy mẫu?', options: ['Bằng tần số tín hiệu', 'Lớn hơn 2 lần tần số cao nhất của tín hiệu', 'Nhỏ hơn tần số tín hiệu', 'Bất kỳ giá trị nào'], correctIndex: 1, explanation: 'Lấy mẫu > 2× tần số cao nhất để tránh chồng phổ (aliasing).' },
  { id: 'q3', question: 'Giữ mẫu bậc 0 (ZOH) làm gì?', options: ['Lấy đạo hàm tín hiệu', 'Giữ giá trị cuối không đổi giữa các mẫu', 'Lọc nhiễu tần cao', 'Đổi z sang s'], correctIndex: 1, explanation: 'ZOH giữ nguyên giá trị đầu ra tới mẫu kế, biến lệnh rời rạc thành tín hiệu liên tục.' },
]);

const c6 = doc('dco301-6-1-discrete-analysis', '6.1 — Analysing discrete systems|||6.1 — Phân tích hệ rời rạc',
  'Ổn định trong miền z: mọi cực phải nằm TRONG vòng tròn đơn vị |z| < 1; ánh xạ s → z qua z = e^(sT); đáp ứng hệ rời rạc; phương trình sai phân từ H(z).',
  [[
    `<span class="eyebrow">DCO301 · Chapter 6 · Lesson 6.1</span>
<h2>Analysing discrete systems</h2>
<h3>Stability in the z-plane</h3>
<p>Continuous stability asked "are all poles in the left half-plane?" For a <strong>discrete</strong> system the test moves to the <strong>unit circle</strong>.</p>
<pre><code>  Discrete pole magnitude |z| &lt; 1  -&gt; STABLE   (response decays)
                          |z| = 1  -&gt; marginal  (sustained)
                          |z| &gt; 1  -&gt; UNSTABLE (blows up)

  Mapping continuous -&gt; discrete:   z = e^(s*T)
  The stable left-half s-plane maps to the INSIDE of the unit circle.
</code></pre>
<h3>From H(z) to a difference equation</h3>
<p>A discrete transfer function H(z) turns directly into a <strong>difference equation</strong> — the exact recipe your microcontroller runs each sample, using stored past inputs and outputs.</p>
<pre><code>  Example H(z) = Y(z)/U(z) = b0 / (1 - a1 * z^-1)

  -&gt;  y[k] = a1 * y[k-1] + b0 * u[k]

  (each step: use the previous output y[k-1] and current input u[k])
</code></pre>
<h3>Response &amp; design idea</h3>
<p>Poles nearer z = 0 give faster decay; poles near the unit circle are slow and lightly damped. <strong>Designing a digital controller</strong> means choosing its coefficients so the closed-loop poles sit at good spots inside the circle.</p>
<div class="callout"><span class="badge">One test to remember</span> Continuous: left half-plane. Discrete: inside the unit circle. Same idea — disturbances must decay, not grow.</div>`,
    `<span class="eyebrow">DCO301 · Chương 6 · Bài 6.1</span>
<h2>Phân tích hệ rời rạc</h2>
<h3>Ổn định trong mặt phẳng z</h3>
<p>Ổn định liên tục hỏi "mọi cực có ở nửa trái mặt phẳng không?" Với hệ <strong>rời rạc</strong>, phép kiểm chuyển sang <strong>vòng tròn đơn vị</strong>.</p>
<pre><code>  Độ lớn cực rời rạc |z| &lt; 1  -&gt; ỔN ĐỊNH   (đáp ứng tắt dần)
                     |z| = 1  -&gt; biên giới  (duy trì)
                     |z| &gt; 1  -&gt; KHÔNG ỔN ĐỊNH (bùng nổ)

  Ánh xạ liên tục -&gt; rời rạc:   z = e^(s*T)
  Nửa trái mặt phẳng s (ổn định) ánh xạ vào BÊN TRONG vòng tròn đơn vị.
</code></pre>
<h3>Từ H(z) tới phương trình sai phân</h3>
<p>Hàm truyền rời rạc H(z) chuyển thẳng thành <strong>phương trình sai phân</strong> — chính công thức mà vi điều khiển chạy mỗi mẫu, dùng các đầu vào/ra quá khứ đã lưu.</p>
<pre><code>  Ví dụ H(z) = Y(z)/U(z) = b0 / (1 - a1 * z^-1)

  -&gt;  y[k] = a1 * y[k-1] + b0 * u[k]

  (mỗi bước: dùng đầu ra trước y[k-1] và đầu vào hiện tại u[k])
</code></pre>
<h3>Đáp ứng &amp; ý tưởng thiết kế</h3>
<p>Cực gần z = 0 cho tắt dần nhanh; cực gần vòng tròn đơn vị thì chậm và ít tắt dần. <strong>Thiết kế bộ điều khiển số</strong> nghĩa là chọn các hệ số của nó để cực vòng kín nằm ở vị trí tốt bên trong vòng tròn.</p>
<div class="callout"><span class="badge">Một phép kiểm cần nhớ</span> Liên tục: nửa trái mặt phẳng. Rời rạc: bên trong vòng tròn đơn vị. Cùng một ý — nhiễu phải tắt dần, không được lớn lên.</div>`,
  ]]);

const c6q = quiz('dco301-quiz-6', 'Quiz 6 — Discrete analysis|||Quiz 6 — Phân tích rời rạc', [
  { id: 'q1', question: 'Hệ rời rạc ổn định khi mọi cực z thoả?', options: ['|z| > 1', '|z| = 1', '|z| < 1 (trong vòng tròn đơn vị)', 'phần thực z < 0'], correctIndex: 2, explanation: 'Ổn định rời rạc: mọi cực nằm trong vòng tròn đơn vị |z| < 1.' },
  { id: 'q2', question: 'Ánh xạ giữa miền s và miền z là?', options: ['z = s·T', 'z = e^(s·T)', 'z = 1/s', 'z = s + T'], correctIndex: 1, explanation: 'z = e^(sT); nửa trái mặt phẳng s ánh xạ vào trong vòng tròn đơn vị.' },
  { id: 'q3', question: 'H(z) = b0/(1 − a1·z^-1) tương ứng phương trình sai phân?', options: ['y[k] = a1·y[k-1] + b0·u[k]', 'y[k] = b0·y[k-1]', 'y[k] = u[k] − u[k-1]', 'y[k] = a1·u[k]'], correctIndex: 0, explanation: 'Chia cho mẫu rồi chuyển z^-1 thành trễ: y[k] = a1·y[k-1] + b0·u[k].' },
]);

const c7 = doc('dco301-7-1-digital-controller', '7.1 — Digital controller design|||7.1 — Thiết kế bộ điều khiển số',
  'PID số hoá (xấp xỉ tích phân/vi phân theo T), phương trình sai phân của PID; hai hướng thiết kế (emulation vs trực tiếp trên z); lượng tử hoá (quantization) và sai số hữu hạn bit.',
  [[
    `<span class="eyebrow">DCO301 · Chapter 7 · Lesson 7.1</span>
<h2>Digital controller design</h2>
<h3>Digital PID</h3>
<p>To run PID on an MCU, replace the integral with a running sum and the derivative with a difference over the sample period T.</p>
<pre><code>  integral( e dt )   -&gt;   sum of e[k] * T        (accumulate)
  de/dt              -&gt;   ( e[k] - e[k-1] ) / T  (difference)

  Digital PID (position form):
    integ = integ + e[k] * T
    u[k]  = Kp*e[k] + Ki*integ + Kd*( e[k] - e[k-1] ) / T
</code></pre>
<h3>Two design routes</h3>
<ul>
<li><strong>Emulation</strong> — design a good continuous controller C(s), then discretise it (e.g. Tustin / bilinear) to C(z). Quick if T is small.</li>
<li><strong>Direct digital</strong> — design straight in the z-domain, placing the closed-loop poles inside the unit circle. More accurate at slower sample rates.</li>
</ul>
<h3>Quantization</h3>
<p>Real hardware uses <strong>finite bits</strong>: the ADC rounds the measurement, the DAC rounds the command, and coefficients are stored with limited precision. This <strong>quantization</strong> adds a small error/noise and can cause limit cycles. Guard against it: enough ADC bits, clamp the integrator (anti-windup), and avoid dividing by a tiny T.</p>
<div class="callout"><span class="badge">Practical note</span> Add anti-windup (limit the integral) and output saturation to every real digital PID — textbook maths assumes unlimited actuators; motors do not.</div>`,
    `<span class="eyebrow">DCO301 · Chương 7 · Bài 7.1</span>
<h2>Thiết kế bộ điều khiển số</h2>
<h3>PID số</h3>
<p>Để chạy PID trên MCU, thay tích phân bằng tổng tích luỹ và vi phân bằng hiệu chia cho chu kỳ lấy mẫu T.</p>
<pre><code>  integral( e dt )   -&gt;   tổng e[k] * T          (tích luỹ)
  de/dt              -&gt;   ( e[k] - e[k-1] ) / T  (sai phân)

  PID số (dạng vị trí):
    integ = integ + e[k] * T
    u[k]  = Kp*e[k] + Ki*integ + Kd*( e[k] - e[k-1] ) / T
</code></pre>
<h3>Hai hướng thiết kế</h3>
<ul>
<li><strong>Mô phỏng lại (emulation)</strong> — thiết kế bộ điều khiển liên tục C(s) tốt, rồi rời rạc hoá (vd Tustin / song tuyến) thành C(z). Nhanh khi T nhỏ.</li>
<li><strong>Số trực tiếp</strong> — thiết kế thẳng trong miền z, đặt cực vòng kín trong vòng tròn đơn vị. Chính xác hơn khi lấy mẫu chậm.</li>
</ul>
<h3>Lượng tử hoá</h3>
<p>Phần cứng thật dùng <strong>số bit hữu hạn</strong>: ADC làm tròn giá trị đo, DAC làm tròn lệnh, và hệ số được lưu với độ chính xác giới hạn. <strong>Lượng tử hoá</strong> này thêm một sai số/nhiễu nhỏ và có thể gây dao động chu trình giới hạn (limit cycle). Phòng tránh: đủ bit ADC, kẹp bộ tích phân (chống windup), và tránh chia cho T quá nhỏ.</p>
<div class="callout"><span class="badge">Lưu ý thực tế</span> Thêm chống windup (giới hạn tích phân) và bão hoà đầu ra cho mọi PID số thật — toán sách vở giả định cơ cấu chấp hành vô hạn; động cơ thì không.</div>`,
  ]]);

const c7q = quiz('dco301-quiz-7', 'Quiz 7 — Digital controller|||Quiz 7 — Bộ điều khiển số', [
  { id: 'q1', question: 'Trong PID số, khâu vi phân de/dt được xấp xỉ bằng?', options: ['e[k] × T', '(e[k] − e[k-1]) / T', 'tổng e[k]·T', 'e[k] / e[k-1]'], correctIndex: 1, explanation: 'Vi phân → sai phân lùi: (e[k] − e[k-1])/T.' },
  { id: 'q2', question: 'Thiết kế theo hướng "emulation" nghĩa là?', options: ['Thiết kế thẳng trong miền z', 'Thiết kế C(s) liên tục rồi rời rạc hoá thành C(z)', 'Bỏ khâu tích phân', 'Tăng số bit ADC'], correctIndex: 1, explanation: 'Emulation: thiết kế liên tục rồi rời rạc hoá (vd Tustin) sang C(z).' },
  { id: 'q3', question: 'Lượng tử hoá (quantization) trong điều khiển số gây ra?', options: ['Không ảnh hưởng gì', 'Sai số/nhiễu do làm tròn hữu hạn bit', 'Tăng tần số lấy mẫu', 'Xoá sai số xác lập'], correctIndex: 1, explanation: 'ADC/DAC và hệ số hữu hạn bit làm tròn → thêm sai số, có thể gây limit cycle.' },
]);

const c8 = doc('dco301-8-1-robot-embedded', '8.1 — Robotics & embedded applications|||8.1 — Ứng dụng robot & nhúng',
  'Điều khiển động cơ DC (vòng tốc độ/vị trí, encoder, PWM), servo, vòng điều khiển trên vi điều khiển (đọc-tính-tác động theo T), ví dụ robot cân bằng và cánh tay.',
  [[
    `<span class="eyebrow">DCO301 · Chapter 8 · Lesson 8.1</span>
<h2>Robotics &amp; embedded applications</h2>
<h3>Motor control loops</h3>
<p>A DC motor is the classic plant. On an MCU you close the loop in software:</p>
<ul>
<li><strong>Sense</strong> — an <strong>encoder</strong> gives position; differencing it gives speed.</li>
<li><strong>Compute</strong> — a digital PID turns the error into a command.</li>
<li><strong>Act</strong> — the command sets a <strong>PWM</strong> duty cycle driving the motor through an H-bridge.</li>
</ul>
<pre><code>Embedded control loop (runs every T seconds, timer interrupt):
  y   = read_encoder()          // measured position/speed
  e   = setpoint - y            // error
  u   = pid_update(e)           // digital PID (Ch.7)
  set_pwm( saturate(u) )        // drive actuator, clamp to limits
</code></pre>
<h3>Servos &amp; higher levels</h3>
<p>A hobby <strong>servo</strong> hides its own position loop and takes a target angle as a PWM pulse. In a robot arm you stack loops: an inner fast <strong>current/torque</strong> loop, a <strong>velocity</strong> loop, then an outer <strong>position</strong> loop — each a controller from this course.</p>
<h3>Real examples</h3>
<ul>
<li><strong>Self-balancing robot</strong> — PID on tilt angle keeps it upright, sampled hundreds of times a second.</li>
<li><strong>Line-following / differential drive</strong> — PID on line-sensor error steers the wheels.</li>
<li><strong>Robot arm joint</strong> — cascaded position/velocity loops track a trajectory.</li>
</ul>
<div class="callout"><span class="badge">The whole course in one loop</span> Model the motor (Ch.2), know its response (Ch.3), pick PID (Ch.4), sample it (Ch.5–6), make it digital (Ch.7), and run it on hardware (Ch.8). That is digital control.</div>`,
    `<span class="eyebrow">DCO301 · Chương 8 · Bài 8.1</span>
<h2>Ứng dụng robot &amp; nhúng</h2>
<h3>Vòng điều khiển động cơ</h3>
<p>Động cơ DC là đối tượng kinh điển. Trên MCU, bạn khép vòng bằng phần mềm:</p>
<ul>
<li><strong>Cảm nhận</strong> — <strong>encoder</strong> cho vị trí; lấy sai phân cho tốc độ.</li>
<li><strong>Tính toán</strong> — PID số biến sai số thành lệnh.</li>
<li><strong>Tác động</strong> — lệnh đặt độ rộng xung <strong>PWM</strong> lái động cơ qua mạch cầu H.</li>
</ul>
<pre><code>Vòng điều khiển nhúng (chạy mỗi T giây, ngắt timer):
  y   = read_encoder()          // vị trí/tốc độ đo được
  e   = setpoint - y            // sai số
  u   = pid_update(e)           // PID số (Ch.7)
  set_pwm( saturate(u) )        // lái cơ cấu, kẹp trong giới hạn
</code></pre>
<h3>Servo &amp; các tầng cao hơn</h3>
<p>Một <strong>servo</strong> phổ thông giấu vòng vị trí riêng bên trong và nhận góc đặt qua xung PWM. Trong cánh tay robot, bạn xếp chồng nhiều vòng: vòng <strong>dòng/mô-men</strong> nhanh bên trong, vòng <strong>vận tốc</strong>, rồi vòng <strong>vị trí</strong> bên ngoài — mỗi vòng là một bộ điều khiển của môn này.</p>
<h3>Ví dụ thực tế</h3>
<ul>
<li><strong>Robot tự cân bằng</strong> — PID trên góc nghiêng giữ nó thẳng, lấy mẫu hàng trăm lần mỗi giây.</li>
<li><strong>Robot dò line / lái vi sai</strong> — PID trên sai số cảm biến line lái bánh xe.</li>
<li><strong>Khớp cánh tay robot</strong> — vòng vị trí/vận tốc xếp tầng bám quỹ đạo.</li>
</ul>
<div class="callout"><span class="badge">Cả môn học trong một vòng lặp</span> Mô hình hoá động cơ (Ch.2), biết đáp ứng (Ch.3), chọn PID (Ch.4), lấy mẫu (Ch.5–6), số hoá (Ch.7), và chạy trên phần cứng (Ch.8). Đó là điều khiển số.</div>`,
  ]]);

const c8q = quiz('dco301-quiz-8', 'Quiz 8 — Robotics & embedded|||Quiz 8 — Robot & nhúng', [
  { id: 'q1', question: 'Trong vòng điều khiển động cơ trên MCU, encoder dùng để?', options: ['Cấp nguồn cho động cơ', 'Đo vị trí/tốc độ (phản hồi)', 'Tạo xung PWM', 'Lọc nhiễu'], correctIndex: 1, explanation: 'Encoder là cảm biến cho vị trí; lấy sai phân ra tốc độ — phần phản hồi của vòng.' },
  { id: 'q2', question: 'Đầu ra bộ điều khiển thường lái động cơ DC qua?', options: ['Độ rộng xung PWM và cầu H', 'Biến đổi z', 'Cảm biến line', 'ADC'], correctIndex: 0, explanation: 'Lệnh u đặt duty cycle PWM, qua H-bridge cấp cho động cơ.' },
  { id: 'q3', question: 'Vì sao vòng điều khiển nhúng chạy trong ngắt timer theo chu kỳ T?', options: ['Để tiết kiệm pin', 'Để lấy mẫu và cập nhật lệnh đều đặn đúng nhịp', 'Để tăng độ phân giải ADC', 'Vì PID không cần thời gian'], correctIndex: 1, explanation: 'Điều khiển số cần nhịp lấy mẫu T ổn định; timer interrupt bảo đảm đọc-tính-tác động đều đặn.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'DCO301',
    slug: 'dco301-digital-controls',
    title: 'Digital Controls',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DCO301.webp',
    shortDescription: 'Digital control for robotics — feedback & transfer functions G(s), PID tuning, sampling, the z-transform, discrete-system stability & digital controller design, applied to motor/servo control on MCUs. Bilingual, with formulas & quizzes.|||Điều khiển số cho robot — phản hồi & hàm truyền G(s), chỉnh định PID, lấy mẫu, biến đổi z, ổn định hệ rời rạc & thiết kế bộ điều khiển số, ứng dụng động cơ/servo trên vi điều khiển. Song ngữ, có công thức & quiz.',
    description: 'Môn <strong>DCO301 — Digital Controls</strong> (ngành Robotics &amp; AI, kỳ 5) dạy cách <strong>bắt một hệ thống hành xử đúng ý</strong> — từ điều khiển liên tục kinh điển tới điều khiển số chạy trong vi điều khiển. Lộ trình: <strong>hệ điều khiển</strong> (vòng hở/kín, phản hồi) → <strong>mô hình hoá</strong> (hàm truyền G(s), không gian trạng thái) → <strong>đáp ứng &amp; ổn định</strong> (bậc 1/bậc 2, cực-zero) → <strong>PID</strong> → <strong>rời rạc hoá &amp; lấy mẫu</strong> (biến đổi z, ZOH) → <strong>phân tích hệ rời rạc</strong> (ổn định miền z) → <strong>thiết kế bộ điều khiển số</strong> (PID số, lượng tử hoá) → <strong>ứng dụng robot &amp; nhúng</strong> (động cơ, servo, MCU). Bám sách chuẩn Ogata, Franklin, Nise; song ngữ, có công thức, ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Vòng hở/kín & phản hồi, sai số e(t); mô hình hoá: phương trình vi phân → hàm truyền G(s), tổng quan không gian trạng thái; đáp ứng thời gian bậc 1/bậc 2 (hằng số thời gian, vọt lố, tắt dần), cực-zero & ổn định; PID (P/I/D, chỉnh định, chống windup); lấy mẫu & Nyquist, biến đổi z, z^-1, ZOH; ổn định miền z (vòng tròn đơn vị), phương trình sai phân từ H(z); PID số & lượng tử hoá; điều khiển động cơ/servo, encoder, PWM, vòng điều khiển trên vi điều khiển; mô phỏng bằng MATLAB/Simulink.',
    requirements: 'Toán (giải tích, số phức), vật lý cơ bản; nền lập trình nhúng/vi điều khiển là một lợi thế. Nên cài MATLAB/Simulink hoặc Octave / python-control để mô phỏng.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn (Ogata/Franklin/Nise), tài liệu miễn phí, YouTube, MATLAB/Simulink, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Điều khiển làm gì, vì sao robot cần điều khiển số, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Hệ thống điều khiển|||Chapter 1 — Control systems', description: 'Vòng hở/kín, phản hồi, sai số, sơ đồ khối, ví dụ.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Mô hình hoá|||Chapter 2 — System modelling', description: 'Phương trình vi phân → hàm truyền G(s), không gian trạng thái.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Đáp ứng hệ thống|||Chapter 3 — System response', description: 'Đáp ứng bậc 1/bậc 2, cực-zero, ổn định.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Điều khiển PID|||Chapter 4 — PID control', description: 'P/I/D, tác dụng từng khâu, chỉnh định, ứng dụng.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Rời rạc hoá & lấy mẫu|||Chapter 5 — Discretisation & sampling', description: 'Lấy mẫu, Nyquist, biến đổi z, ZOH.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Phân tích hệ rời rạc|||Chapter 6 — Discrete analysis', description: 'Ổn định miền z, vòng tròn đơn vị, phương trình sai phân.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thiết kế bộ điều khiển số|||Chapter 7 — Digital controller design', description: 'PID số, hai hướng thiết kế, lượng tử hoá.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ứng dụng robot & nhúng|||Chapter 8 — Robotics & embedded', description: 'Động cơ, servo, encoder/PWM, vòng điều khiển trên MCU.', lessons: [c8, c8q] },
  ],
};
