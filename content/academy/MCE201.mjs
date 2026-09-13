/**
 * MCE201 — Measurement and Control Engineering. Ngành Thiết kế vi mạch bán dẫn,
 * kỳ 4. Giáo trình chuẩn: Nise "Control Systems Engineering"; Ogata "Modern
 * Control Engineering"; Morris "Measurement and Instrumentation Principles";
 * Doebelin "Measurement Systems". 8 chương song ngữ + ví dụ MATLAB/Python + quiz.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${ lồng; "&"→&amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('mce201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách kinh điển (Nise, Ogata, Morris, Doebelin), tài liệu miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">MCE201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Measurement and Control Engineering</strong> — from sensors and measurement uncertainty to transfer functions, stability and PID control — in one place. The official slides &amp; giáo trình live on <strong>FLM</strong>; below are the classic textbooks and free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for MCE201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books (standard texts)</h3>
<ul>
<li><strong>Norman S. Nise</strong> — <em>Control Systems Engineering</em> (transfer functions, time/frequency response, stability, PID).</li>
<li><strong>Katsuhiko Ogata</strong> — <em>Modern Control Engineering</em> (root locus, frequency-domain design, state space).</li>
<li><strong>Alan S. Morris</strong> — <em>Measurement and Instrumentation Principles</em> (errors, sensors, signal conditioning).</li>
<li><strong>Ernest O. Doebelin</strong> — <em>Measurement Systems: Application and Design</em> (transducers, dynamic response of instruments).</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://ctms.engin.umich.edu/CTMS/index.php?aux=Home" target="_blank" rel="noopener">Control Tutorials for MATLAB &amp; Simulink (CTMS, Univ. of Michigan)</a></li>
<li><a href="https://python-control.readthedocs.io/" target="_blank" rel="noopener">Python Control Systems Library (python-control)</a></li>
<li><a href="https://www.nist.gov/pml/nist-technical-note-1297" target="_blank" rel="noopener">NIST TN 1297 — guidelines for evaluating measurement uncertainty</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@BrianBDouglas" target="_blank" rel="noopener">Brian Douglas</a> — clear control-theory intuition (poles, PID, Bode, Nyquist).</li>
<li><a href="https://www.youtube.com/@MATLAB" target="_blank" rel="noopener">MATLAB — Tech Talks</a> — control design and understanding series.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://octave-online.net/" target="_blank" rel="noopener">Octave Online</a> — free MATLAB-compatible environment in the browser.</li>
<li><a href="https://python-control.readthedocs.io/" target="_blank" rel="noopener">python-control + NumPy/SciPy</a> — transfer functions, step/Bode/Nyquist plots.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Measurement core</strong> — errors, uncertainty, sensors and signal conditioning (Morris, Doebelin).</li>
<li><strong>Modeling</strong> — differential equations, Laplace transform and transfer functions.</li>
<li><strong>Analysis</strong> — time response, frequency response and stability (Nise, Ogata).</li>
<li><strong>Design</strong> — PID tuning, then digital control on a microcontroller / IC.</li>
</ol></div>`,
    `<span class="eyebrow">MCE201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Kỹ thuật Đo lường &amp; Điều khiển</strong> — từ cảm biến và độ không đảm bảo đo đến hàm truyền, ổn định và điều khiển PID — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là các sách kinh điển và nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của MCE201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo (kinh điển)</h3>
<ul>
<li><strong>Norman S. Nise</strong> — <em>Control Systems Engineering</em> (hàm truyền, đáp ứng thời gian/tần số, ổn định, PID).</li>
<li><strong>Katsuhiko Ogata</strong> — <em>Modern Control Engineering</em> (quỹ đạo nghiệm, thiết kế miền tần số, không gian trạng thái).</li>
<li><strong>Alan S. Morris</strong> — <em>Measurement and Instrumentation Principles</em> (sai số, cảm biến, xử lý tín hiệu).</li>
<li><strong>Ernest O. Doebelin</strong> — <em>Measurement Systems: Application and Design</em> (bộ chuyển đổi, đáp ứng động của thiết bị đo).</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://ctms.engin.umich.edu/CTMS/index.php?aux=Home" target="_blank" rel="noopener">Control Tutorials for MATLAB &amp; Simulink (CTMS, ĐH Michigan)</a></li>
<li><a href="https://python-control.readthedocs.io/" target="_blank" rel="noopener">Thư viện Python Control Systems (python-control)</a></li>
<li><a href="https://www.nist.gov/pml/nist-technical-note-1297" target="_blank" rel="noopener">NIST TN 1297 — hướng dẫn đánh giá độ không đảm bảo đo</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@BrianBDouglas" target="_blank" rel="noopener">Brian Douglas</a> — trực giác điều khiển rõ ràng (điểm cực, PID, Bode, Nyquist).</li>
<li><a href="https://www.youtube.com/@MATLAB" target="_blank" rel="noopener">MATLAB — Tech Talks</a> — chuỗi thiết kế và hiểu điều khiển.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://octave-online.net/" target="_blank" rel="noopener">Octave Online</a> — môi trường tương thích MATLAB miễn phí trên trình duyệt.</li>
<li><a href="https://python-control.readthedocs.io/" target="_blank" rel="noopener">python-control + NumPy/SciPy</a> — hàm truyền, vẽ đáp ứng nấc/Bode/Nyquist.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Lõi đo lường</strong> — sai số, độ không đảm bảo, cảm biến và xử lý tín hiệu (Morris, Doebelin).</li>
<li><strong>Mô hình hoá</strong> — phương trình vi phân, biến đổi Laplace và hàm truyền.</li>
<li><strong>Phân tích</strong> — đáp ứng thời gian, đáp ứng tần số và ổn định (Nise, Ogata).</li>
<li><strong>Thiết kế</strong> — chỉnh định PID, rồi điều khiển số trên vi điều khiển / vi mạch.</li>
</ol></div>`,
  ]]);

const intro = doc('mce201-0-1-overview', 'Course overview: Measurement & control engineering|||Tổng quan: Kỹ thuật đo lường & điều khiển',
  'Đo lường và điều khiển làm gì; vòng kín cảm biến→điều khiển→cơ cấu chấp hành; lộ trình 8 chương từ sai số đo đến PID & điều khiển số.',
  [[
    `<span class="eyebrow">MCE201 · Lesson 0.1 · Overview</span>
<h2>Measurement &amp; Control Engineering</h2>
<p class="lead">This course connects two ideas: how to <strong>measure</strong> a physical quantity accurately, and how to <strong>control</strong> it automatically. Together they form the <strong>feedback loop</strong> at the heart of every modern system — a thermostat, a robot arm, a chip's power regulator.</p>
<h3>The feedback loop</h3>
<p>A sensor measures the output, a controller compares it to the desired <em>setpoint</em>, and an actuator drives the process to close the gap:</p>
<pre><code>setpoint  --&gt;( error )--&gt; [ controller ] --&gt; [ actuator ] --&gt; [ process ] --&gt; output
                  ^                                                            |
                  +-------------------- [ sensor ] &lt;--------------------------+</code></pre>
<h3>Why it matters for IC design</h3>
<p>Chips regulate their own voltage, temperature and clock; test equipment measures nanovolts and picoseconds. Understanding sensing accuracy and control stability is core semiconductor engineering.</p>
<h3>Roadmap (8 chapters)</h3>
<p>Measurement &amp; uncertainty → sensors &amp; transducers → signal conditioning → system modeling &amp; transfer functions → time &amp; frequency response → stability (Routh/Nyquist) → PID design → digital &amp; embedded control.</p>`,
    `<span class="eyebrow">MCE201 · Bài 0.1 · Tổng quan</span>
<h2>Kỹ thuật Đo lường &amp; Điều khiển</h2>
<p class="lead">Môn này nối hai ý tưởng: đo <strong>chính xác</strong> một đại lượng vật lý, và <strong>điều khiển</strong> nó tự động. Cùng nhau chúng tạo nên <strong>vòng hồi tiếp</strong> nằm ở trung tâm mọi hệ thống hiện đại — bộ ổn nhiệt, cánh tay robot, bộ ổn áp trong con chip.</p>
<h3>Vòng hồi tiếp</h3>
<p>Cảm biến đo đầu ra, bộ điều khiển so nó với <em>giá trị đặt</em> mong muốn, và cơ cấu chấp hành tác động vào quá trình để khép khoảng sai lệch:</p>
<pre><code>gia tri dat --&gt;( sai lech )--&gt; [ bo dieu khien ] --&gt; [ co cau ] --&gt; [ qua trinh ] --&gt; dau ra
                    ^                                                              |
                    +----------------------- [ cam bien ] &lt;-----------------------+</code></pre>
<h3>Vì sao quan trọng với thiết kế vi mạch</h3>
<p>Con chip tự điều chỉnh điện áp, nhiệt độ và xung nhịp của chính nó; thiết bị kiểm tra đo tới nanovolt và picosecond. Hiểu độ chính xác đo và tính ổn định điều khiển là kiến thức lõi của kỹ thuật bán dẫn.</p>
<h3>Lộ trình (8 chương)</h3>
<p>Đo lường &amp; sai số → cảm biến &amp; bộ chuyển đổi → xử lý tín hiệu → mô hình hoá &amp; hàm truyền → đáp ứng thời gian &amp; tần số → ổn định (Routh/Nyquist) → thiết kế PID → điều khiển số &amp; nhúng.</p>`,
  ]]);

const c1 = doc('mce201-1-1-measurement-error', '1.1 — Measurement fundamentals & uncertainty|||1.1 — Cơ sở đo lường & độ không đảm bảo',
  'Đại lượng đo, đơn vị SI; sai số hệ thống vs ngẫu nhiên; độ chính xác vs độ đúng; sai số tuyệt đối/tương đối; lan truyền & độ không đảm bảo kết hợp.',
  [[
    `<span class="eyebrow">MCE201 · Chapter 1 · Lesson 1.1</span>
<h2>Measurement fundamentals &amp; uncertainty</h2>
<h3>Error types</h3>
<ul>
<li><strong>Systematic error</strong> — a consistent bias (a mis-calibrated scale). Reduced by calibration.</li>
<li><strong>Random error</strong> — scatter around the mean (noise). Reduced by averaging many readings.</li>
</ul>
<p><strong>Accuracy</strong> = closeness to the true value; <strong>precision</strong> = repeatability. A tight-but-off cluster is precise, not accurate.</p>
<h3>Quantifying error</h3>
<pre><code>Absolute error   = measured - true
Relative error   = (measured - true) / true * 100%
Combined std unc = sqrt(u1^2 + u2^2 + u3^2)   (independent sources)</code></pre>
<h3>Propagation of uncertainty</h3>
<p>For R = V / I, relative uncertainties add in quadrature:</p>
<pre><code>(uR/R)^2 = (uV/V)^2 + (uI/I)^2</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Report a result as value ± uncertainty with matching significant figures — 5.00 ± 0.02 V, never 5.0000 ± 0.02.</div>`,
    `<span class="eyebrow">MCE201 · Chương 1 · Bài 1.1</span>
<h2>Cơ sở đo lường &amp; độ không đảm bảo</h2>
<h3>Các loại sai số</h3>
<ul>
<li><strong>Sai số hệ thống</strong> — độ lệch nhất quán (cân bị chỉnh sai). Giảm bằng hiệu chuẩn.</li>
<li><strong>Sai số ngẫu nhiên</strong> — tản mát quanh giá trị trung bình (nhiễu). Giảm bằng lấy trung bình nhiều lần đo.</li>
</ul>
<p><strong>Độ đúng (accuracy)</strong> = gần giá trị thực; <strong>độ chụm (precision)</strong> = lặp lại được. Một chùm điểm sát nhau nhưng lệch tâm là chụm chứ không đúng.</p>
<h3>Định lượng sai số</h3>
<pre><code>Sai so tuyet doi = do duoc - gia tri thuc
Sai so tuong doi = (do duoc - gia tri thuc) / gia tri thuc * 100%
Do khong dam bao ket hop = sqrt(u1^2 + u2^2 + u3^2)   (cac nguon doc lap)</code></pre>
<h3>Lan truyền độ không đảm bảo</h3>
<p>Với R = V / I, độ không đảm bảo tương đối cộng theo bình phương:</p>
<pre><code>(uR/R)^2 = (uV/V)^2 + (uI/I)^2</code></pre>
<div class="callout"><span class="badge">Mẹo</span> Báo kết quả dạng giá trị ± độ không đảm bảo với số chữ số ý nghĩa khớp nhau — 5.00 ± 0.02 V, không bao giờ 5.0000 ± 0.02.</div>`,
  ]]);

const c1q = quiz('mce201-quiz-1', 'Quiz 1 — Measurement & uncertainty|||Quiz 1 — Đo lường & độ không đảm bảo', [
  { id: 'q1', question: 'Sai số nào giảm được bằng cách lấy trung bình nhiều lần đo?', options: ['Sai số hệ thống', 'Sai số ngẫu nhiên', 'Sai số hiệu chuẩn', 'Sai số phân giải'], correctIndex: 1, explanation: 'Sai số ngẫu nhiên (nhiễu) tản đều hai phía nên trung bình hoá làm nó nhỏ đi; sai số hệ thống là độ lệch nhất quán, trung bình không xoá được.' },
  { id: 'q2', question: 'Một chùm kết quả đo sát nhau nhưng đều lệch xa giá trị thực. Đó là?', options: ['Đúng nhưng không chụm', 'Chụm nhưng không đúng', 'Vừa đúng vừa chụm', 'Không đúng không chụm'], correctIndex: 1, explanation: 'Sát nhau = độ chụm (precision) cao; lệch tâm = độ đúng (accuracy) thấp.' },
  { id: 'q3', question: 'Độ không đảm bảo kết hợp của các nguồn độc lập u1, u2 được tính bằng?', options: ['u1 + u2', 'sqrt(u1^2 + u2^2)', '(u1 + u2) / 2', 'u1 * u2'], correctIndex: 1, explanation: 'Các nguồn độc lập cộng theo bình phương (cộng phương sai) rồi lấy căn: u_c = sqrt(u1^2 + u2^2).' },
]);

const c2 = doc('mce201-2-1-sensors', '2.1 — Sensors & transducers|||2.1 — Cảm biến & bộ chuyển đổi',
  'Cảm biến nhiệt (RTD, cặp nhiệt, thermistor), áp suất (strain gauge, piezo), vị trí (potentiometer, LVDT, encoder); độ nhạy, tuyến tính, dải đo.',
  [[
    `<span class="eyebrow">MCE201 · Chapter 2 · Lesson 2.1</span>
<h2>Sensors &amp; transducers</h2>
<p>A <strong>transducer</strong> converts a physical quantity into an electrical signal. Its key specs are <strong>sensitivity</strong> (output per unit input), <strong>range</strong>, and <strong>linearity</strong>.</p>
<h3>Temperature</h3>
<ul>
<li><strong>RTD</strong> (e.g. Pt100) — resistance rises nearly linearly with temperature; very accurate.</li>
<li><strong>Thermocouple</strong> — a voltage from two dissimilar metals (Seebeck effect); wide range.</li>
<li><strong>Thermistor</strong> — large, nonlinear resistance change; cheap and sensitive.</li>
</ul>
<h3>Pressure &amp; position</h3>
<ul>
<li><strong>Strain gauge</strong> — resistance changes when stretched; used in load cells &amp; pressure sensors.</li>
<li><strong>LVDT</strong> — inductive, contactless linear position; robust.</li>
<li><strong>Encoder</strong> — digital angular position (incremental or absolute).</li>
</ul>
<pre><code>RTD model:  R(T) = R0 * (1 + alpha * T)
  Pt100:    R0 = 100 ohm at 0 C, alpha approx 0.00385 /C
  At 50 C:  R = 100 * (1 + 0.00385*50) = 119.25 ohm</code></pre>
<div class="callout"><span class="badge">Sensitivity</span> Sensitivity is the slope of the output-vs-input curve. A steeper slope means a larger, easier-to-read signal for the same change.</div>`,
    `<span class="eyebrow">MCE201 · Chương 2 · Bài 2.1</span>
<h2>Cảm biến &amp; bộ chuyển đổi</h2>
<p>Một <strong>bộ chuyển đổi (transducer)</strong> biến đại lượng vật lý thành tín hiệu điện. Thông số then chốt là <strong>độ nhạy</strong> (đầu ra trên mỗi đơn vị đầu vào), <strong>dải đo</strong>, và <strong>độ tuyến tính</strong>.</p>
<h3>Nhiệt độ</h3>
<ul>
<li><strong>RTD</strong> (vd Pt100) — điện trở tăng gần tuyến tính theo nhiệt độ; rất chính xác.</li>
<li><strong>Cặp nhiệt điện</strong> — điện áp từ hai kim loại khác nhau (hiệu ứng Seebeck); dải đo rộng.</li>
<li><strong>Thermistor</strong> — điện trở đổi lớn, phi tuyến; rẻ và nhạy.</li>
</ul>
<h3>Áp suất &amp; vị trí</h3>
<ul>
<li><strong>Strain gauge</strong> — điện trở đổi khi bị kéo giãn; dùng trong loadcell &amp; cảm biến áp.</li>
<li><strong>LVDT</strong> — đo vị trí thẳng kiểu cảm ứng, không tiếp xúc; bền.</li>
<li><strong>Encoder</strong> — vị trí góc dạng số (tương đối hoặc tuyệt đối).</li>
</ul>
<pre><code>Mo hinh RTD:  R(T) = R0 * (1 + alpha * T)
  Pt100:      R0 = 100 ohm o 0 C, alpha xap xi 0.00385 /C
  Tai 50 C:   R = 100 * (1 + 0.00385*50) = 119.25 ohm</code></pre>
<div class="callout"><span class="badge">Độ nhạy</span> Độ nhạy là độ dốc của đường đầu ra theo đầu vào. Dốc hơn nghĩa là tín hiệu lớn hơn, dễ đọc hơn cho cùng một lượng thay đổi.</div>`,
  ]]);

const c2q = quiz('mce201-quiz-2', 'Quiz 2 — Sensors|||Quiz 2 — Cảm biến', [
  { id: 'q1', question: 'Cảm biến nhiệt nào dựa trên hiệu ứng Seebeck (điện áp từ hai kim loại khác nhau)?', options: ['RTD (Pt100)', 'Cặp nhiệt điện (thermocouple)', 'Thermistor', 'Strain gauge'], correctIndex: 1, explanation: 'Cặp nhiệt điện sinh điện áp nhờ hiệu ứng Seebeck tại mối nối hai kim loại khác nhau; RTD và thermistor đổi điện trở, strain gauge đo biến dạng.' },
  { id: 'q2', question: 'Độ nhạy (sensitivity) của một cảm biến là gì?', options: ['Dải đo lớn nhất', 'Độ dốc đầu ra theo đầu vào', 'Sai số lớn nhất', 'Thời gian đáp ứng'], correctIndex: 1, explanation: 'Độ nhạy = thay đổi đầu ra chia thay đổi đầu vào, tức độ dốc của đường đặc tuyến.' },
  { id: 'q3', question: 'Pt100 có R0 = 100 ohm ở 0 C, alpha ≈ 0.00385/C. Điện trở ở 100 C xấp xỉ?', options: ['100 ohm', '138.5 ohm', '385 ohm', '119.25 ohm'], correctIndex: 1, explanation: 'R = 100*(1 + 0.00385*100) = 100*1.385 = 138.5 ohm.' },
]);

const c3 = doc('mce201-3-1-signal-conditioning', '3.1 — Signal conditioning: amplification & filtering|||3.1 — Xử lý tín hiệu đo: khuếch đại & lọc',
  'Cầu Wheatstone; khuếch đại (op-amp, instrumentation amp, CMRR); lọc thông thấp/cao/dải; chống nhiễu; lấy mẫu & định lý Nyquist.',
  [[
    `<span class="eyebrow">MCE201 · Chapter 3 · Lesson 3.1</span>
<h2>Signal conditioning: amplification &amp; filtering</h2>
<p>Raw sensor signals are tiny, noisy and often not in a convenient form. <strong>Signal conditioning</strong> prepares them for the ADC.</p>
<h3>Wheatstone bridge</h3>
<p>A bridge turns a small resistance change (e.g. a strain gauge) into a measurable differential voltage — near zero at balance, so tiny changes stand out.</p>
<h3>Amplification</h3>
<ul>
<li><strong>Non-inverting op-amp</strong> gain = 1 + Rf/Rin.</li>
<li><strong>Instrumentation amplifier</strong> — high input impedance and high <strong>CMRR</strong> (common-mode rejection) to kill noise shared by both wires.</li>
</ul>
<h3>Filtering &amp; sampling</h3>
<pre><code>Low-pass RC:  fc = 1 / (2 * pi * R * C)
Nyquist:      fsample &gt;= 2 * fmax   (else aliasing)
Example:      R=10k, C=100nF
              fc = 1/(2*pi*1e4*1e-7) = 159 Hz</code></pre>
<div class="callout"><span class="badge">Anti-aliasing</span> Always low-pass filter BEFORE sampling to remove content above half the sample rate — aliasing folds it back as fake low-frequency signals you cannot undo later.</div>`,
    `<span class="eyebrow">MCE201 · Chương 3 · Bài 3.1</span>
<h2>Xử lý tín hiệu đo: khuếch đại &amp; lọc</h2>
<p>Tín hiệu thô từ cảm biến rất nhỏ, nhiều nhiễu và thường chưa ở dạng tiện dùng. <strong>Xử lý tín hiệu (signal conditioning)</strong> chuẩn bị nó cho bộ ADC.</p>
<h3>Cầu Wheatstone</h3>
<p>Cầu biến một thay đổi điện trở nhỏ (vd strain gauge) thành điện áp vi sai đo được — gần 0 khi cân bằng, nên thay đổi rất nhỏ cũng nổi bật.</p>
<h3>Khuếch đại</h3>
<ul>
<li><strong>Op-amp không đảo</strong> độ lợi = 1 + Rf/Rin.</li>
<li><strong>Khuếch đại đo lường (instrumentation amp)</strong> — trở kháng vào cao và <strong>CMRR</strong> (tỉ số nén tín hiệu đồng pha) cao để triệt nhiễu chung trên cả hai dây.</li>
</ul>
<h3>Lọc &amp; lấy mẫu</h3>
<pre><code>Loc thong thap RC:  fc = 1 / (2 * pi * R * C)
Nyquist:            fmau &gt;= 2 * fmax   (khong thi bi chong pho)
Vi du:              R=10k, C=100nF
                    fc = 1/(2*pi*1e4*1e-7) = 159 Hz</code></pre>
<div class="callout"><span class="badge">Chống chồng phổ</span> Luôn lọc thông thấp TRƯỚC khi lấy mẫu để bỏ thành phần trên nửa tần số lấy mẫu — chồng phổ (aliasing) gập nó lại thành tín hiệu tần thấp giả mà sau này không gỡ được.</div>`,
  ]]);

const c3q = quiz('mce201-quiz-3', 'Quiz 3 — Signal conditioning|||Quiz 3 — Xử lý tín hiệu', [
  { id: 'q1', question: 'Theo định lý lấy mẫu Nyquist, tần số lấy mẫu tối thiểu để không bị chồng phổ là?', options: ['Bằng fmax', 'Ít nhất 2 lần fmax', 'Một nửa fmax', 'Bằng 0.1 lần fmax'], correctIndex: 1, explanation: 'Phải lấy mẫu ở ít nhất 2 lần tần số cao nhất (fsample ≥ 2·fmax), nếu không tín hiệu cao tần bị gập thành tần thấp giả (aliasing).' },
  { id: 'q2', question: 'Vì sao dùng khuếch đại đo lường (instrumentation amplifier) cho tín hiệu cảm biến?', options: ['Vì nó rẻ nhất', 'Vì CMRR cao, triệt nhiễu đồng pha trên hai dây', 'Vì nó tạo dao động', 'Vì nó chỉnh lưu tín hiệu'], correctIndex: 1, explanation: 'Instrumentation amp có trở kháng vào cao và CMRR cao, loại bỏ nhiễu chung xuất hiện đồng thời trên cả hai đầu vào.' },
  { id: 'q3', question: 'Lọc thông thấp RC với R=10k, C=100nF có tần số cắt fc xấp xỉ bằng bao nhiêu?', options: ['16 Hz', '159 Hz', '1.59 kHz', '15.9 kHz'], correctIndex: 1, explanation: 'fc = 1/(2*pi*R*C) = 1/(2*pi*1e4*1e-7) ≈ 159 Hz.' },
]);

const c4 = doc('mce201-4-1-modeling-transfer-function', '4.1 — System modeling & transfer functions|||4.1 — Mô hình hoá hệ thống & hàm truyền',
  'Phương trình vi phân; biến đổi Laplace; hàm truyền G(s) = Y(s)/U(s); điểm cực/không; hệ bậc 1 & bậc 2; hằng số thời gian tau, omega_n, zeta.',
  [[
    `<span class="eyebrow">MCE201 · Chapter 4 · Lesson 4.1</span>
<h2>System modeling &amp; transfer functions</h2>
<p>To control a system you first <strong>model</strong> it. Physical laws give a differential equation; the <strong>Laplace transform</strong> turns it into an algebraic <strong>transfer function</strong>.</p>
<h3>Transfer function</h3>
<pre><code>G(s) = Y(s) / U(s)      (zero initial conditions)
First order:   G(s) = K / (tau*s + 1)
Second order:  G(s) = wn^2 / (s^2 + 2*zeta*wn*s + wn^2)</code></pre>
<ul>
<li><strong>tau</strong> — time constant: time to reach ~63% of final value (first order).</li>
<li><strong>wn</strong> — natural frequency; <strong>zeta</strong> — damping ratio (second order).</li>
<li><strong>Poles</strong> — roots of the denominator; they decide stability and response shape.</li>
</ul>
<pre><code>% MATLAB: build a 2nd-order system, plot step response
wn = 2; zeta = 0.5;
num = wn^2;
den = [1, 2*zeta*wn, wn^2];
sys = tf(num, den);
step(sys)</code></pre>
<div class="callout"><span class="badge">Poles rule everything</span> Where the poles sit in the s-plane tells you if the system is stable, how fast it responds, and whether it oscillates — before you plot a single curve.</div>`,
    `<span class="eyebrow">MCE201 · Chương 4 · Bài 4.1</span>
<h2>Mô hình hoá hệ thống &amp; hàm truyền</h2>
<p>Muốn điều khiển một hệ, trước hết phải <strong>mô hình hoá</strong> nó. Định luật vật lý cho phương trình vi phân; <strong>biến đổi Laplace</strong> biến nó thành <strong>hàm truyền</strong> dạng đại số.</p>
<h3>Hàm truyền</h3>
<pre><code>G(s) = Y(s) / U(s)      (dieu kien dau bang 0)
Bac mot:  G(s) = K / (tau*s + 1)
Bac hai:  G(s) = wn^2 / (s^2 + 2*zeta*wn*s + wn^2)</code></pre>
<ul>
<li><strong>tau</strong> — hằng số thời gian: thời gian đạt ~63% giá trị cuối (bậc một).</li>
<li><strong>wn</strong> — tần số tự nhiên; <strong>zeta</strong> — hệ số tắt dần (bậc hai).</li>
<li><strong>Điểm cực (poles)</strong> — nghiệm của mẫu số; quyết định tính ổn định và dạng đáp ứng.</li>
</ul>
<pre><code>% MATLAB: dung he bac hai, ve dap ung nac
wn = 2; zeta = 0.5;
num = wn^2;
den = [1, 2*zeta*wn, wn^2];
sys = tf(num, den);
step(sys)</code></pre>
<div class="callout"><span class="badge">Điểm cực quyết định tất cả</span> Vị trí điểm cực trên mặt phẳng s cho biết hệ có ổn định không, đáp ứng nhanh cỡ nào, có dao động không — trước cả khi vẽ một đường cong.</div>`,
  ]]);

const c4q = quiz('mce201-quiz-4', 'Quiz 4 — Modeling & transfer functions|||Quiz 4 — Mô hình hoá & hàm truyền', [
  { id: 'q1', question: 'Biến đổi Laplace giúp gì cho việc phân tích hệ thống?', options: ['Biến phương trình vi phân thành phương trình đại số theo s', 'Đo nhiệt độ', 'Lọc nhiễu tần cao', 'Tăng độ nhạy cảm biến'], correctIndex: 0, explanation: 'Laplace đổi phép vi phân/tích phân theo thời gian thành phép đại số theo biến s, nhờ đó lập được hàm truyền G(s).' },
  { id: 'q2', question: 'Trong hệ bậc một G(s)=K/(tau*s+1), hằng số thời gian tau là?', options: ['Giá trị cuối của đầu ra', 'Thời gian đạt khoảng 63% giá trị cuối', 'Tần số dao động', 'Độ lợi một chiều'], correctIndex: 1, explanation: 'tau là hằng số thời gian: sau một tau đầu ra đạt xấp xỉ 63% giá trị xác lập.' },
  { id: 'q3', question: 'Yếu tố nào của hàm truyền quyết định tính ổn định và dạng đáp ứng?', options: ['Các điểm không (zeros) của tử số', 'Các điểm cực (poles) là nghiệm của mẫu số', 'Hệ số khuếch đại DC', 'Số bậc của tử số'], correctIndex: 1, explanation: 'Điểm cực là nghiệm của mẫu số; vị trí của chúng trên mặt phẳng s quyết định ổn định, tốc độ và dao động.' },
]);

const c5 = doc('mce201-5-1-time-frequency-response', '5.1 — Time & frequency response|||5.1 — Đáp ứng thời gian & miền tần số',
  'Đáp ứng nấc: thời gian lên, quá độ, độ vọt lố, xác lập; hệ bậc hai theo zeta; đáp ứng tần số & biểu đồ Bode (độ lợi, pha, băng thông).',
  [[
    `<span class="eyebrow">MCE201 · Chapter 5 · Lesson 5.1</span>
<h2>Time &amp; frequency response</h2>
<h3>Step response (time domain)</h3>
<p>Feed a system a sudden step and watch how it settles. Key metrics:</p>
<ul>
<li><strong>Rise time</strong> — how fast it first reaches the target.</li>
<li><strong>Overshoot</strong> — how far it exceeds the target (grows as damping zeta falls).</li>
<li><strong>Settling time</strong> — time to stay within a band (e.g. 2%) of final value.</li>
</ul>
<pre><code>Second-order damping (zeta):
  zeta = 0    -&gt; undamped, oscillates forever
  0 &lt; zeta &lt; 1 -&gt; underdamped, overshoots then settles
  zeta = 1    -&gt; critically damped, fastest with no overshoot
  zeta &gt; 1    -&gt; overdamped, slow, no overshoot
Percent overshoot approx: PO = exp(-pi*zeta / sqrt(1 - zeta^2)) * 100%</code></pre>
<h3>Frequency response (Bode)</h3>
<p>Drive the system with sine waves at many frequencies and plot <strong>gain (dB)</strong> and <strong>phase (deg)</strong> versus frequency. <strong>Bandwidth</strong> is where gain drops 3 dB — how fast the system can track inputs.</p>
<div class="callout"><span class="badge">Trade-off</span> Less damping gives a faster rise but bigger overshoot. Design is choosing zeta to balance speed against ringing.</div>`,
    `<span class="eyebrow">MCE201 · Chương 5 · Bài 5.1</span>
<h2>Đáp ứng thời gian &amp; miền tần số</h2>
<h3>Đáp ứng nấc (miền thời gian)</h3>
<p>Đưa vào hệ một bước nhảy đột ngột và xem nó ổn định thế nào. Chỉ số then chốt:</p>
<ul>
<li><strong>Thời gian lên (rise time)</strong> — nhanh cỡ nào để lần đầu chạm mục tiêu.</li>
<li><strong>Độ vọt lố (overshoot)</strong> — vượt mục tiêu bao nhiêu (tăng khi hệ số tắt dần zeta giảm).</li>
<li><strong>Thời gian xác lập (settling time)</strong> — thời gian để nằm trong dải (vd 2%) quanh giá trị cuối.</li>
</ul>
<pre><code>Tat dan bac hai (zeta):
  zeta = 0     -&gt; khong tat, dao dong mai
  0 &lt; zeta &lt; 1 -&gt; tat dan yeu, vot lo roi on dinh
  zeta = 1     -&gt; tat dan toi han, nhanh nhat va khong vot lo
  zeta &gt; 1     -&gt; tat dan qua muc, cham, khong vot lo
Phan tram vot lo: PO = exp(-pi*zeta / sqrt(1 - zeta^2)) * 100%</code></pre>
<h3>Đáp ứng tần số (Bode)</h3>
<p>Kích hệ bằng sóng sin ở nhiều tần số và vẽ <strong>độ lợi (dB)</strong> và <strong>pha (độ)</strong> theo tần số. <strong>Băng thông (bandwidth)</strong> là chỗ độ lợi tụt 3 dB — cho biết hệ bám được đầu vào nhanh cỡ nào.</p>
<div class="callout"><span class="badge">Đánh đổi</span> Ít tắt dần thì lên nhanh nhưng vọt lố lớn. Thiết kế là chọn zeta để cân bằng giữa tốc độ và rung dao động.</div>`,
  ]]);

const c5q = quiz('mce201-quiz-5', 'Quiz 5 — Time & frequency response|||Quiz 5 — Đáp ứng thời gian & tần số', [
  { id: 'q1', question: 'Khi hệ số tắt dần zeta giảm về gần 0, đáp ứng nấc của hệ bậc hai sẽ?', options: ['Vọt lố nhiều hơn và dao động lâu hơn', 'Không vọt lố và rất chậm', 'Không đổi', 'Trở nên tuyến tính'], correctIndex: 0, explanation: 'zeta nhỏ = tắt dần yếu, độ vọt lố tăng và hệ dao động dai; zeta=1 là tắt dần tới hạn, nhanh nhất mà không vọt lố.' },
  { id: 'q2', question: 'Trường hợp zeta = 1 (tắt dần tới hạn) đặc trưng bởi?', options: ['Dao động vô hạn', 'Nhanh nhất mà không có vọt lố', 'Vọt lố lớn nhất', 'Đáp ứng chậm nhất'], correctIndex: 1, explanation: 'Tắt dần tới hạn (critically damped) cho đáp ứng nhanh nhất mà không vọt lố; zeta>1 (quá tắt) thì chậm hơn.' },
  { id: 'q3', question: 'Băng thông (bandwidth) trên biểu đồ Bode thường được lấy ở điểm nào?', options: ['Độ lợi tăng 3 dB', 'Độ lợi tụt 3 dB', 'Pha bằng 0', 'Độ lợi bằng 0 dB tại DC'], correctIndex: 1, explanation: 'Băng thông là tần số mà độ lợi giảm 3 dB so với dải thông; nó cho biết hệ bám tín hiệu nhanh cỡ nào.' },
]);

const c6 = doc('mce201-6-1-stability', '6.1 — Stability: Routh & Nyquist|||6.1 — Ổn định: Routh & Nyquist',
  'Khái niệm ổn định BIBO; điểm cực nửa trái mặt phẳng s; tiêu chí Routh-Hurwitz; biên độ dự trữ & pha dự trữ; tiêu chí Nyquist.',
  [[
    `<span class="eyebrow">MCE201 · Chapter 6 · Lesson 6.1</span>
<h2>Stability: Routh &amp; Nyquist</h2>
<p>A system is <strong>stable</strong> if a bounded input gives a bounded output (BIBO). In terms of poles: <strong>all poles must lie in the left half of the s-plane</strong> (negative real part).</p>
<h3>Routh-Hurwitz criterion</h3>
<p>Decide stability from the characteristic polynomial <em>without</em> finding the roots: build the Routh array; the system is stable iff every entry in the first column has the <strong>same sign</strong> (no sign changes).</p>
<pre><code>Char. eq:  s^3 + 6 s^2 + 11 s + 6 = 0
Routh 1st column:  1, 6, (6*11 - 1*6)/6 = 10, 6
All positive -&gt; no sign change -&gt; STABLE</code></pre>
<h3>Nyquist &amp; stability margins</h3>
<ul>
<li><strong>Gain margin</strong> — how much more gain before instability.</li>
<li><strong>Phase margin</strong> — how much more phase lag before instability.</li>
</ul>
<p>The <strong>Nyquist criterion</strong> counts how the open-loop frequency plot encircles the point -1 to predict closed-loop stability.</p>
<div class="callout"><span class="badge">Margins matter</span> A system can be stable yet fragile. Healthy margins (e.g. gain margin &gt; 6 dB, phase margin &gt; 45 deg) keep it stable despite model error and aging parts.</div>`,
    `<span class="eyebrow">MCE201 · Chương 6 · Bài 6.1</span>
<h2>Ổn định: Routh &amp; Nyquist</h2>
<p>Một hệ <strong>ổn định</strong> nếu đầu vào bị chặn cho đầu ra bị chặn (BIBO). Theo điểm cực: <strong>mọi điểm cực phải nằm ở nửa trái mặt phẳng s</strong> (phần thực âm).</p>
<h3>Tiêu chí Routh-Hurwitz</h3>
<p>Xác định ổn định từ đa thức đặc trưng <em>mà không</em> phải tìm nghiệm: lập bảng Routh; hệ ổn định khi và chỉ khi mọi phần tử ở cột đầu <strong>cùng dấu</strong> (không đổi dấu).</p>
<pre><code>PT dac trung:  s^3 + 6 s^2 + 11 s + 6 = 0
Cot dau bang Routh:  1, 6, (6*11 - 1*6)/6 = 10, 6
Tat ca duong -&gt; khong doi dau -&gt; ON DINH</code></pre>
<h3>Nyquist &amp; dự trữ ổn định</h3>
<ul>
<li><strong>Biên độ dự trữ (gain margin)</strong> — còn tăng độ lợi được bao nhiêu trước khi mất ổn định.</li>
<li><strong>Pha dự trữ (phase margin)</strong> — còn thêm trễ pha được bao nhiêu trước khi mất ổn định.</li>
</ul>
<p><strong>Tiêu chí Nyquist</strong> đếm số lần đường tần số hở bao quanh điểm -1 để suy ra ổn định của hệ kín.</p>
<div class="callout"><span class="badge">Dự trữ rất quan trọng</span> Một hệ có thể ổn định nhưng mong manh. Dự trữ lành mạnh (vd biên độ dự trữ &gt; 6 dB, pha dự trữ &gt; 45 độ) giữ nó ổn định dù mô hình sai lệch và linh kiện lão hoá.</div>`,
  ]]);

const c6q = quiz('mce201-quiz-6', 'Quiz 6 — Stability|||Quiz 6 — Ổn định', [
  { id: 'q1', question: 'Điều kiện điểm cực để một hệ tuyến tính liên tục ổn định là?', options: ['Mọi điểm cực nằm nửa phải mặt phẳng s', 'Mọi điểm cực nằm nửa trái mặt phẳng s (phần thực âm)', 'Ít nhất một điểm cực ở gốc toạ độ', 'Mọi điểm cực có phần thực dương'], correctIndex: 1, explanation: 'Hệ ổn định (BIBO) khi mọi điểm cực có phần thực âm, tức nằm ở nửa trái mặt phẳng s.' },
  { id: 'q2', question: 'Tiêu chí Routh-Hurwitz kết luận hệ ổn định khi?', options: ['Cột đầu của bảng Routh không đổi dấu', 'Tử số bằng 0', 'Có đúng một lần đổi dấu', 'Bậc đa thức là chẵn'], correctIndex: 0, explanation: 'Số lần đổi dấu ở cột đầu bằng số điểm cực nửa phải; không đổi dấu (mọi phần tử cùng dấu) nghĩa là ổn định.' },
  { id: 'q3', question: 'Tiêu chí Nyquist dựa trên việc đường tần số hở bao quanh điểm nào?', options: ['Điểm 0', 'Điểm -1', 'Điểm +1', 'Gốc toạ độ trên trục ảo'], correctIndex: 1, explanation: 'Tiêu chí Nyquist đếm số vòng bao quanh điểm -1 (trục thực) của đồ thị hàm truyền hở để suy ra ổn định hệ kín.' },
]);

const c7 = doc('mce201-7-1-pid', '7.1 — PID controllers & design|||7.1 — Bộ điều khiển PID & thiết kế',
  'Vai trò P, I, D; công thức PID; ảnh hưởng từng khâu tới đáp ứng; chỉnh định Ziegler-Nichols; chống windup; ví dụ tính toán.',
  [[
    `<span class="eyebrow">MCE201 · Chapter 7 · Lesson 7.1</span>
<h2>PID controllers &amp; design</h2>
<p>The <strong>PID controller</strong> is the workhorse of industry. It acts on the error e (setpoint minus measurement) with three terms:</p>
<pre><code>u(t) = Kp*e + Ki*(integral of e dt) + Kd*(de/dt)
  P (Kp): reacts to present error  -&gt; faster, but steady-state error remains
  I (Ki): sums past error          -&gt; removes steady-state error, adds lag
  D (Kd): predicts from error rate -&gt; damps overshoot, sensitive to noise</code></pre>
<h3>Effect of each gain</h3>
<ul>
<li>Raise <strong>Kp</strong>: faster response, more overshoot, small steady-state error.</li>
<li>Raise <strong>Ki</strong>: kills steady-state error, but can add overshoot / oscillation.</li>
<li>Raise <strong>Kd</strong>: reduces overshoot and settling time, amplifies noise.</li>
</ul>
<h3>Tuning &amp; windup</h3>
<p><strong>Ziegler-Nichols</strong> gives starting gains from the ultimate gain Ku and period Pu. Guard against <strong>integral windup</strong>: clamp the integral term when the actuator saturates, or the controller overshoots badly on recovery.</p>
<div class="callout"><span class="badge">Start simple</span> Many loops need only PI — D is skipped when the measurement is noisy. Add complexity only when P and I cannot meet the spec.</div>`,
    `<span class="eyebrow">MCE201 · Chương 7 · Bài 7.1</span>
<h2>Bộ điều khiển PID &amp; thiết kế</h2>
<p><strong>Bộ điều khiển PID</strong> là công cụ chủ lực của công nghiệp. Nó tác động lên sai lệch e (giá trị đặt trừ giá trị đo) qua ba khâu:</p>
<pre><code>u(t) = Kp*e + Ki*(tich phan e dt) + Kd*(de/dt)
  P (Kp): phan ung sai lech hien tai  -&gt; nhanh hon, nhung con sai lech xac lap
  I (Ki): cong don sai lech qua khu    -&gt; xoa sai lech xac lap, them tre
  D (Kd): du bao tu toc do sai lech    -&gt; giam vot lo, nhay voi nhieu</code></pre>
<h3>Ảnh hưởng của từng hệ số</h3>
<ul>
<li>Tăng <strong>Kp</strong>: đáp ứng nhanh hơn, vọt lố nhiều hơn, còn sai lệch xác lập nhỏ.</li>
<li>Tăng <strong>Ki</strong>: xoá sai lệch xác lập, nhưng có thể thêm vọt lố / dao động.</li>
<li>Tăng <strong>Kd</strong>: giảm vọt lố và thời gian xác lập, khuếch đại nhiễu.</li>
</ul>
<h3>Chỉnh định &amp; windup</h3>
<p><strong>Ziegler-Nichols</strong> cho bộ hệ số khởi đầu từ độ lợi tới hạn Ku và chu kỳ Pu. Phải chống <strong>bão hoà tích phân (windup)</strong>: kẹp khâu tích phân khi cơ cấu chấp hành bão hoà, nếu không bộ điều khiển sẽ vọt lố nặng khi hồi phục.</p>
<div class="callout"><span class="badge">Bắt đầu đơn giản</span> Nhiều vòng chỉ cần PI — bỏ khâu D khi tín hiệu đo nhiều nhiễu. Chỉ thêm phức tạp khi P và I không đạt yêu cầu.</div>`,
  ]]);

const c7q = quiz('mce201-quiz-7', 'Quiz 7 — PID|||Quiz 7 — PID', [
  { id: 'q1', question: 'Khâu nào trong PID có tác dụng chính là xoá sai lệch xác lập (steady-state error)?', options: ['Khâu tỉ lệ P', 'Khâu tích phân I', 'Khâu vi phân D', 'Không khâu nào'], correctIndex: 1, explanation: 'Khâu tích phân I cộng dồn sai lệch quá khứ nên đẩy sai lệch xác lập về 0; khâu P một mình luôn để lại sai lệch xác lập.' },
  { id: 'q2', question: 'Khâu vi phân D có nhược điểm gì đáng chú ý?', options: ['Làm chậm đáp ứng', 'Khuếch đại nhiễu đo', 'Gây sai lệch xác lập', 'Không có tác dụng gì'], correctIndex: 1, explanation: 'D phản ứng theo tốc độ thay đổi sai lệch nên rất nhạy với nhiễu; vì vậy vòng có tín hiệu nhiễu thường bỏ D và chỉ dùng PI.' },
  { id: 'q3', question: 'Hiện tượng "bão hoà tích phân" (integral windup) xảy ra khi?', options: ['Cảm biến hỏng', 'Khâu tích phân tiếp tục cộng dồn trong khi cơ cấu chấp hành đã bão hoà', 'Kp quá nhỏ', 'Không có khâu D'], correctIndex: 1, explanation: 'Khi cơ cấu chấp hành đã bão hoà mà tích phân vẫn dồn, giá trị tích phân phình lớn, khiến hệ vọt lố mạnh lúc hồi phục; cần kẹp/chống windup.' },
]);

const c8 = doc('mce201-8-1-digital-embedded-control', '8.1 — Digital control & embedded/IC applications|||8.1 — Điều khiển số & ứng dụng nhúng/vi mạch',
  'Rời rạc hoá; ADC/DAC & chu kỳ lấy mẫu; PID số; hiện thực trên vi điều khiển/vi mạch; độ phân giải & lượng tử hoá; ví dụ Python.',
  [[
    `<span class="eyebrow">MCE201 · Chapter 8 · Lesson 8.1</span>
<h2>Digital control &amp; embedded/IC applications</h2>
<p>Real controllers run on microcontrollers and ICs: they read a sensor through an <strong>ADC</strong>, compute in software, and drive an actuator through a <strong>DAC</strong> or PWM — all on a fixed <strong>sample period Ts</strong>.</p>
<h3>From continuous to discrete</h3>
<ul>
<li>Choose <strong>Ts</strong> small vs the system dynamics (rule of thumb: 10-20 samples per rise time).</li>
<li><strong>ADC resolution</strong>: an N-bit ADC splits the range into 2^N steps; quantization adds noise.</li>
</ul>
<pre><code>ADC step (LSB) = Vref / 2^N
  12-bit, Vref=3.3V: step = 3.3 / 4096 = 0.806 mV</code></pre>
<h3>Discrete PID (runs every Ts)</h3>
<pre><code># Python: PID roi rac tren vi dieu khien
integral = 0.0
e_prev = 0.0
def pid_step(setpoint, measured, Ts, Kp, Ki, Kd):
    global integral, e_prev
    e = setpoint - measured
    integral += e * Ts
    deriv = (e - e_prev) / Ts
    e_prev = e
    return Kp*e + Ki*integral + Kd*deriv</code></pre>
<div class="callout"><span class="badge">On-chip control</span> Modern ICs run tiny control loops in hardware — voltage regulators, thermal throttling, clock/PLL locking — the same PID ideas, just faster and in silicon.</div>`,
    `<span class="eyebrow">MCE201 · Chương 8 · Bài 8.1</span>
<h2>Điều khiển số &amp; ứng dụng nhúng/vi mạch</h2>
<p>Bộ điều khiển thực chạy trên vi điều khiển và vi mạch: đọc cảm biến qua <strong>ADC</strong>, tính toán bằng phần mềm, và điều khiển cơ cấu qua <strong>DAC</strong> hoặc PWM — tất cả trên một <strong>chu kỳ lấy mẫu Ts</strong> cố định.</p>
<h3>Từ liên tục sang rời rạc</h3>
<ul>
<li>Chọn <strong>Ts</strong> nhỏ so với động học của hệ (mẹo: 10-20 mẫu trong một thời gian lên).</li>
<li><strong>Độ phân giải ADC</strong>: ADC N bit chia dải thành 2^N bậc; lượng tử hoá thêm nhiễu.</li>
</ul>
<pre><code>Buoc ADC (LSB) = Vref / 2^N
  12-bit, Vref=3.3V: buoc = 3.3 / 4096 = 0.806 mV</code></pre>
<h3>PID rời rạc (chạy mỗi Ts)</h3>
<pre><code># Python: PID roi rac tren vi dieu khien
integral = 0.0
e_prev = 0.0
def pid_step(setpoint, measured, Ts, Kp, Ki, Kd):
    global integral, e_prev
    e = setpoint - measured
    integral += e * Ts
    deriv = (e - e_prev) / Ts
    e_prev = e
    return Kp*e + Ki*integral + Kd*deriv</code></pre>
<div class="callout"><span class="badge">Điều khiển trong chip</span> Vi mạch hiện đại chạy những vòng điều khiển tí hon ngay trong phần cứng — ổn áp, giảm nhiệt theo tải, khoá xung nhịp/PLL — cùng ý tưởng PID, chỉ nhanh hơn và nằm trong silicon.</div>`,
  ]]);

const c8q = quiz('mce201-quiz-8', 'Quiz 8 — Digital control|||Quiz 8 — Điều khiển số', [
  { id: 'q1', question: 'Bước lượng tử (LSB) của một ADC 12-bit với Vref = 3.3V xấp xỉ bằng?', options: ['3.3 V', '0.806 mV', '3.3 mV', '12 mV'], correctIndex: 1, explanation: 'LSB = Vref / 2^N = 3.3 / 4096 ≈ 0.806 mV.' },
  { id: 'q2', question: 'Khi rời rạc hoá bộ điều khiển, nên chọn chu kỳ lấy mẫu Ts thế nào?', options: ['Càng lớn càng tốt', 'Đủ nhỏ so với động học của hệ (nhiều mẫu trong một thời gian lên)', 'Bằng đúng thời gian xác lập', 'Không quan trọng'], correctIndex: 1, explanation: 'Ts phải đủ nhỏ so với động học hệ (mẹo 10-20 mẫu mỗi thời gian lên) để bản số bám sát hành vi liên tục.' },
  { id: 'q3', question: 'Trong PID số, khâu tích phân thường được hiện thực bằng?', options: ['Cộng dồn sai lệch nhân chu kỳ lấy mẫu (integral += e * Ts)', 'Lấy đạo hàm của đầu ra', 'Nhân hai lần Kp', 'Chỉ lấy giá trị e hiện tại'], correctIndex: 0, explanation: 'Tích phân rời rạc xấp xỉ bằng tổng tích luỹ e*Ts qua các bước; khâu vi phân xấp xỉ (e - e_prev)/Ts.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'MCE201',
    slug: 'mce201-measurement-and-control-engineering',
    title: 'Measurement and Control Engineering',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MCE201.webp',
    shortDescription: 'Measurement & control engineering — error & uncertainty, sensors, signal conditioning, transfer functions, time/frequency response, stability (Routh/Nyquist), PID & digital control. Bilingual, MATLAB/Python examples & quizzes.|||Đo lường & điều khiển — sai số & độ không đảm bảo, cảm biến, xử lý tín hiệu, hàm truyền, đáp ứng thời gian/tần số, ổn định (Routh/Nyquist), PID & điều khiển số. Song ngữ, ví dụ MATLAB/Python & quiz.',
    description: 'Môn <strong>MCE201 — Measurement and Control Engineering</strong> (Kỹ thuật Đo lường &amp; Điều khiển, kỳ 4) dạy cách <strong>đo</strong> chính xác một đại lượng và <strong>điều khiển</strong> nó tự động qua vòng hồi tiếp. Từ <strong>sai số &amp; độ không đảm bảo</strong> → <strong>cảm biến &amp; bộ chuyển đổi</strong> → <strong>xử lý tín hiệu</strong> → <strong>mô hình hoá &amp; hàm truyền</strong> → <strong>đáp ứng thời gian/tần số</strong> → <strong>ổn định (Routh/Nyquist)</strong> → <strong>PID</strong> → <strong>điều khiển số &amp; nhúng/vi mạch</strong>. Bám các giáo trình chuẩn (Nise, Ogata, Morris, Doebelin), song ngữ, có ví dụ MATLAB/Python và quiz mỗi chương.',
    whatYouLearn: 'Sai số hệ thống/ngẫu nhiên, độ chính xác vs độ đúng, lan truyền độ không đảm bảo; cảm biến nhiệt/áp/vị trí (RTD, cặp nhiệt, strain gauge, LVDT, encoder); cầu Wheatstone, khuếch đại đo lường, lọc & Nyquist; hàm truyền G(s), điểm cực/không, tau/omega_n/zeta; đáp ứng nấc (vọt lố, xác lập) & Bode; ổn định Routh-Hurwitz & Nyquist, biên/pha dự trữ; thiết kế & chỉnh định PID, chống windup; điều khiển số, ADC/DAC, PID rời rạc trên vi điều khiển/vi mạch.',
    requirements: 'Toán giải tích (đạo hàm, tích phân), số phức và cơ sở điện/điện tử. Nên biết chút MATLAB/Octave hoặc Python (NumPy) để chạy ví dụ mô phỏng.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách (Nise, Ogata, Morris, Doebelin), tài liệu miễn phí, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vòng hồi tiếp cảm biến–điều khiển–chấp hành; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Cơ sở đo lường & sai số|||Chapter 1 — Measurement & uncertainty', description: 'Sai số hệ thống/ngẫu nhiên, độ chính xác/độ đúng, độ không đảm bảo.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Cảm biến & bộ chuyển đổi|||Chapter 2 — Sensors & transducers', description: 'Cảm biến nhiệt, áp, vị trí; độ nhạy, dải đo, tuyến tính.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Xử lý tín hiệu đo|||Chapter 3 — Signal conditioning', description: 'Cầu Wheatstone, khuếch đại, lọc, lấy mẫu Nyquist.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Mô hình hoá & hàm truyền|||Chapter 4 — Modeling & transfer functions', description: 'Laplace, hàm truyền G(s), điểm cực/không, hệ bậc 1 & 2.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Đáp ứng thời gian & tần số|||Chapter 5 — Time & frequency response', description: 'Đáp ứng nấc, vọt lố, xác lập; Bode, băng thông.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Ổn định: Routh & Nyquist|||Chapter 6 — Stability', description: 'BIBO, điểm cực nửa trái, Routh-Hurwitz, biên/pha dự trữ, Nyquist.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Bộ điều khiển PID|||Chapter 7 — PID controllers', description: 'P/I/D, ảnh hưởng từng khâu, Ziegler-Nichols, chống windup.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Điều khiển số & nhúng|||Chapter 8 — Digital & embedded control', description: 'Rời rạc hoá, ADC/DAC, PID số trên vi điều khiển/vi mạch.', lessons: [c8, c8q] },
  ],
};
