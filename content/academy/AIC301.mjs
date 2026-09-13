/**
 * AIC301 — Analog ICs (Thiết kế mạch tích hợp tương tự). Ngành Thiết kế vi mạch
 * bán dẫn, Kỳ 7 FPTU. Song ngữ VI+EN, 8 chương, mỗi chương 1 DOCUMENT + 1 QUIZ.
 * Giáo trình tham khảo: Razavi, Sedra/Smith, Gray/Hurst/Lewis/Meyer, Baker.
 * Giữ NGUYEN slug/semester/courseCode/thumb. ⚠️ KHONG backtick/${; "&"→&amp;;
 * "<"→&lt; ">"→&gt; trong code. Tranh nhay don trong chuoi JS nhay don.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('aic301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình chuẩn (Razavi, Sedra/Smith, Gray-Meyer, Baker), công cụ SPICE miễn phí, YouTube, lộ trình tự học.',
  [[
    `<span class="eyebrow">AIC301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>analog integrated-circuit design</strong> — from the MOSFET small-signal model up to op-amps, bandgap references and data converters — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for AIC301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Standard reference textbooks</h3>
<ul>
<li><strong>Razavi</strong> — <em>Design of Analog CMOS Integrated Circuits</em> (the core text for this course)</li>
<li><strong>Sedra &amp; Smith</strong> — <em>Microelectronic Circuits</em> (device &amp; single-stage fundamentals)</li>
<li><strong>Gray, Hurst, Lewis &amp; Meyer</strong> — <em>Analysis and Design of Analog Integrated Circuits</em></li>
<li><strong>Baker</strong> — <em>CMOS: Circuit Design, Layout, and Simulation</em> (layout &amp; SPICE oriented)</li>
</ul>
<p class="note">Reference books are copyrighted — buy or borrow legally; we do not host PDFs.</p>
<h3>🌐 Free documentation</h3>
<ul>
<li><a href="https://ngspice.sourceforge.io/docs.html" target="_blank" rel="noopener">Ngspice manual</a> — open-source SPICE simulator docs</li>
<li><a href="https://ptolemy.berkeley.edu/projects/embedded/eecsx44/lectures/" target="_blank" rel="noopener">UC Berkeley analog IC lecture notes</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@RazaviElectronics" target="_blank" rel="noopener">Behzad Razavi</a> — full analog CMOS lecture series</li>
<li><a href="https://www.youtube.com/@sandsoftmar" target="_blank" rel="noopener">Sandeep / analog design walk-throughs</a></li>
</ul>
<h3>🛠️ Tools (free)</h3>
<ul>
<li><a href="https://ngspice.sourceforge.io/" target="_blank" rel="noopener">Ngspice</a> — open-source SPICE circuit simulation</li>
<li><a href="https://xschem.sourceforge.io/stefan/index.html" target="_blank" rel="noopener">Xschem</a> — schematic capture for SPICE</li>
<li><a href="https://skywater-pdk.readthedocs.io/" target="_blank" rel="noopener">SkyWater 130nm open PDK</a> — a real, free CMOS process for practice</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Device foundation</strong> — MOSFET operation, I-V equations, small-signal model (gm, ro).</li>
<li><strong>Single stages</strong> — common-source, common-gate, source follower; then current mirrors and differential pairs.</li>
<li><strong>Systems</strong> — frequency response, feedback, op-amp design, stability &amp; compensation.</li>
<li><strong>Precision &amp; mixed-signal</strong> — noise, CMOS process, bandgap references, PLL and ADC/DAC blocks. Verify every intuition in SPICE.</li>
</ol></div>`,
    `<span class="eyebrow">AIC301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>thiết kế mạch tích hợp tương tự</strong> — từ mô hình tín hiệu nhỏ của MOSFET lên tới op-amp, nguồn tham chiếu bandgap và bộ chuyển đổi dữ liệu — gom về một chỗ. Slide &amp; giáo trình chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của AIC301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Giáo trình chuẩn tham khảo</h3>
<ul>
<li><strong>Razavi</strong> — <em>Design of Analog CMOS Integrated Circuits</em> (sách lõi của môn)</li>
<li><strong>Sedra &amp; Smith</strong> — <em>Microelectronic Circuits</em> (nền linh kiện &amp; tầng đơn)</li>
<li><strong>Gray, Hurst, Lewis &amp; Meyer</strong> — <em>Analysis and Design of Analog Integrated Circuits</em></li>
<li><strong>Baker</strong> — <em>CMOS: Circuit Design, Layout, and Simulation</em> (thiên về layout &amp; SPICE)</li>
</ul>
<p class="note">Sách tham khảo có bản quyền — mua hoặc mượn hợp pháp; chúng tôi không đăng file PDF.</p>
<h3>🌐 Tài liệu miễn phí</h3>
<ul>
<li><a href="https://ngspice.sourceforge.io/docs.html" target="_blank" rel="noopener">Sổ tay Ngspice</a> — tài liệu bộ mô phỏng SPICE mã nguồn mở</li>
<li><a href="https://ptolemy.berkeley.edu/projects/embedded/eecsx44/lectures/" target="_blank" rel="noopener">Ghi chú bài giảng analog IC của UC Berkeley</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@RazaviElectronics" target="_blank" rel="noopener">Behzad Razavi</a> — trọn bộ bài giảng analog CMOS</li>
<li><a href="https://www.youtube.com/@sandsoftmar" target="_blank" rel="noopener">Sandeep / hướng dẫn thiết kế analog</a></li>
</ul>
<h3>🛠️ Công cụ (miễn phí)</h3>
<ul>
<li><a href="https://ngspice.sourceforge.io/" target="_blank" rel="noopener">Ngspice</a> — mô phỏng mạch SPICE mã nguồn mở</li>
<li><a href="https://xschem.sourceforge.io/stefan/index.html" target="_blank" rel="noopener">Xschem</a> — vẽ sơ đồ nguyên lý cho SPICE</li>
<li><a href="https://skywater-pdk.readthedocs.io/" target="_blank" rel="noopener">PDK mở SkyWater 130nm</a> — một quy trình CMOS thật, miễn phí để luyện tập</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền linh kiện</strong> — hoạt động MOSFET, phương trình I-V, mô hình tín hiệu nhỏ (gm, ro).</li>
<li><strong>Tầng đơn</strong> — cực nguồn chung, cực cổng chung, mạch lặp nguồn; rồi gương dòng và cặp vi sai.</li>
<li><strong>Hệ thống</strong> — đáp ứng tần số, hồi tiếp, thiết kế op-amp, ổn định &amp; bù pha.</li>
<li><strong>Chính xác &amp; tín hiệu hỗn hợp</strong> — nhiễu, quy trình CMOS, nguồn bandgap, PLL và khối ADC/DAC. Kiểm mọi trực giác bằng SPICE.</li>
</ol></div>`,
  ]]);

const intro = doc('aic301-0-1-overview', 'Course overview: Analog IC design|||Tổng quan: Thiết kế mạch tích hợp tương tự',
  'Analog IC làm gì; vì sao khó (không có 0/1); lộ trình 8 chương: MOSFET → tầng đơn → gương dòng → cặp vi sai → tần số/hồi tiếp → op-amp → nhiễu/CMOS → bandgap/PLL/data converter.',
  [[
    `<span class="eyebrow">AIC301 · Lesson 0.1 · Overview</span>
<h2>Analog Integrated Circuits</h2>
<p class="lead">Almost every chip that touches the real world — a radio receiver, a sensor front-end, a power regulator, the input of any ADC — is <strong>analog</strong> at its edge. This course teaches how to <strong>design analog blocks in CMOS</strong>: amplifiers, current sources, comparators, references and data-converter building blocks, all analysed by hand and verified in SPICE.</p>
<h3>Why analog is hard</h3>
<ul>
<li>There is no "0 or 1" to hide behind — you work with continuous voltages and currents where <strong>every mismatch, noise source and parasitic matters</strong>.</li>
<li>Design is a web of <strong>trade-offs</strong>: gain vs. bandwidth, speed vs. power, noise vs. area. Razavi calls this the "analog design octagon".</li>
<li>The transistor is a device with a rich model — you must understand <strong>gm, ro, and the operating region</strong> to size it well.</li>
</ul>
<h3>Roadmap (8 chapters)</h3>
<p>MOSFET &amp; small-signal model → single-stage amplifiers → current mirrors &amp; biasing → differential pairs → frequency response &amp; feedback → op-amp design, stability &amp; compensation → noise &amp; the CMOS process → bandgap references, PLL &amp; ADC/DAC building blocks. Bilingual, with worked equations and SPICE / Verilog-A examples, plus a quiz each chapter.</p>
<div class="callout"><span class="badge">Mindset</span> An analog designer does not memorise circuits — they build <strong>intuition</strong> for how gm, ro and capacitances set gain, bandwidth and noise, then confirm with simulation.</div>`,
    `<span class="eyebrow">AIC301 · Bài 0.1 · Tổng quan</span>
<h2>Mạch tích hợp tương tự</h2>
<p class="lead">Gần như mọi con chip chạm vào thế giới thực — bộ thu radio, tầng đầu cảm biến, mạch ổn nguồn, ngõ vào của bất kỳ ADC nào — đều <strong>tương tự (analog)</strong> ở rìa của nó. Môn này dạy cách <strong>thiết kế các khối analog trong CMOS</strong>: khuếch đại, nguồn dòng, so sánh, nguồn tham chiếu và khối chuyển đổi dữ liệu, phân tích bằng tay và kiểm bằng SPICE.</p>
<h3>Vì sao analog khó</h3>
<ul>
<li>Không có "0 hay 1" để nấp sau — bạn làm việc với áp và dòng liên tục, nơi <strong>mọi sai lệch, nguồn nhiễu và ký sinh đều quan trọng</strong>.</li>
<li>Thiết kế là mạng lưới <strong>đánh đổi</strong>: độ lợi và băng thông, tốc độ và công suất, nhiễu và diện tích. Razavi gọi đây là "bát giác thiết kế analog".</li>
<li>Transistor là linh kiện có mô hình phong phú — phải hiểu <strong>gm, ro và vùng hoạt động</strong> mới chọn kích thước đúng.</li>
</ul>
<h3>Lộ trình (8 chương)</h3>
<p>MOSFET &amp; mô hình tín hiệu nhỏ → khuếch đại một tầng → gương dòng &amp; phân cực → cặp vi sai → đáp ứng tần số &amp; hồi tiếp → thiết kế op-amp, ổn định &amp; bù pha → nhiễu &amp; quy trình CMOS → nguồn bandgap, PLL &amp; khối ADC/DAC. Song ngữ, có công thức tính và ví dụ SPICE / Verilog-A, kèm một quiz mỗi chương.</p>
<div class="callout"><span class="badge">Tư duy</span> Người làm analog không học thuộc mạch — họ xây <strong>trực giác</strong> về cách gm, ro và điện dung đặt ra độ lợi, băng thông và nhiễu, rồi xác nhận bằng mô phỏng.</div>`,
  ]]);

const c1 = doc('aic301-1-1-mosfet-model', '1.1 — MOSFET operation & small-signal model|||1.1 — MOSFET & mô hình tín hiệu nhỏ',
  'Vùng cut-off/triode/bão hoà; phương trình dòng bão hoà; hỗ dẫn gm, điện trở ra ro, hiệu ứng thân; mô hình tín hiệu nhỏ; ví dụ SPICE .op.',
  [[
    `<span class="eyebrow">AIC301 · Chapter 1 · Lesson 1.1</span>
<h2>MOSFET operation &amp; the small-signal model</h2>
<h3>Regions of operation (NMOS)</h3>
<ul>
<li><strong>Cut-off:</strong> V<sub>GS</sub> &lt; V<sub>TH</sub> → the channel is off, I<sub>D</sub> ≈ 0.</li>
<li><strong>Triode (linear):</strong> V<sub>DS</sub> &lt; V<sub>GS</sub> − V<sub>TH</sub> → acts like a voltage-controlled resistor.</li>
<li><strong>Saturation (active):</strong> V<sub>DS</sub> ≥ V<sub>GS</sub> − V<sub>TH</sub> → the useful amplifying region.</li>
</ul>
<h3>Key equations</h3>
<p>Overdrive voltage V<sub>ov</sub> = V<sub>GS</sub> − V<sub>TH</sub>. In saturation:</p>
<pre><code>I_D = (1/2) * mu*Cox * (W/L) * (Vgs - Vth)^2 * (1 + lambda*Vds)
gm  = dI_D/dVgs = mu*Cox*(W/L)*(Vgs-Vth) = 2*I_D / Vov = sqrt(2*mu*Cox*(W/L)*I_D)
ro  = 1 / (lambda*I_D)         (channel-length modulation)
gmb = eta * gm                 (body effect, back-gate transconductance)
</code></pre>
<p>The most important design number is the <strong>intrinsic gain</strong> g<sub>m</sub>·r<sub>o</sub> — the maximum voltage gain one transistor can give. Note gm rises only with the square root of current, so pushing gain by raising I<sub>D</sub> gives diminishing returns.</p>
<h3>Small-signal model</h3>
<p>For AC analysis the transistor becomes a current source g<sub>m</sub>·v<sub>gs</sub> from drain to source, in parallel with r<sub>o</sub>, plus capacitances C<sub>gs</sub>, C<sub>gd</sub>. The body adds g<sub>mb</sub>·v<sub>bs</sub>.</p>
<pre><code>* SPICE: find the operating point of one NMOS
M1 d g 0 0 nmos W=10u L=0.5u
Vg g 0 0.9
Vd d 0 1.2
.op
.print dc @M1[gm] @M1[gds] @M1[id]
.end
</code></pre>
<div class="callout"><span class="badge">Design rule</span> Pick the <strong>overdrive V<sub>ov</sub></strong> first: small V<sub>ov</sub> (≈ 0.1–0.2 V) gives high gm/I<sub>D</sub> (good for gain/noise) but eats headroom and slows the device; large V<sub>ov</sub> is faster but burns current.</div>`,
    `<span class="eyebrow">AIC301 · Chương 1 · Bài 1.1</span>
<h2>Hoạt động MOSFET &amp; mô hình tín hiệu nhỏ</h2>
<h3>Các vùng hoạt động (NMOS)</h3>
<ul>
<li><strong>Ngắt (cut-off):</strong> V<sub>GS</sub> &lt; V<sub>TH</sub> → kênh tắt, I<sub>D</sub> ≈ 0.</li>
<li><strong>Triode (tuyến tính):</strong> V<sub>DS</sub> &lt; V<sub>GS</sub> − V<sub>TH</sub> → như một điện trở điều khiển bằng áp.</li>
<li><strong>Bão hoà (tích cực):</strong> V<sub>DS</sub> ≥ V<sub>GS</sub> − V<sub>TH</sub> → vùng khuếch đại hữu ích.</li>
</ul>
<h3>Công thức cốt lõi</h3>
<p>Điện áp quá ngưỡng V<sub>ov</sub> = V<sub>GS</sub> − V<sub>TH</sub>. Trong bão hoà:</p>
<pre><code>I_D = (1/2) * mu*Cox * (W/L) * (Vgs - Vth)^2 * (1 + lambda*Vds)
gm  = dI_D/dVgs = mu*Cox*(W/L)*(Vgs-Vth) = 2*I_D / Vov = sqrt(2*mu*Cox*(W/L)*I_D)
ro  = 1 / (lambda*I_D)         (điều biến chiều dài kênh)
gmb = eta * gm                 (hiệu ứng thân, hỗ dẫn cực đáy)
</code></pre>
<p>Con số thiết kế quan trọng nhất là <strong>độ lợi nội tại</strong> g<sub>m</sub>·r<sub>o</sub> — độ lợi áp lớn nhất mà một transistor có thể cho. Lưu ý gm chỉ tăng theo căn bậc hai của dòng, nên tăng I<sub>D</sub> để lấy độ lợi càng về sau càng ít hiệu quả.</p>
<h3>Mô hình tín hiệu nhỏ</h3>
<p>Khi phân tích AC, transistor trở thành nguồn dòng g<sub>m</sub>·v<sub>gs</sub> từ máng về nguồn, song song với r<sub>o</sub>, cộng các điện dung C<sub>gs</sub>, C<sub>gd</sub>. Cực thân thêm g<sub>mb</sub>·v<sub>bs</sub>.</p>
<pre><code>* SPICE: tìm điểm làm việc của một NMOS
M1 d g 0 0 nmos W=10u L=0.5u
Vg g 0 0.9
Vd d 0 1.2
.op
.print dc @M1[gm] @M1[gds] @M1[id]
.end
</code></pre>
<div class="callout"><span class="badge">Quy tắc thiết kế</span> Chọn <strong>quá ngưỡng V<sub>ov</sub></strong> trước: V<sub>ov</sub> nhỏ (≈ 0,1–0,2 V) cho gm/I<sub>D</sub> cao (tốt cho độ lợi/nhiễu) nhưng ngốn headroom và làm linh kiện chậm; V<sub>ov</sub> lớn nhanh hơn nhưng tốn dòng.</div>`,
  ]]);

const c1q = quiz('aic301-quiz-1', 'Quiz 1 — MOSFET & model|||Quiz 1 — MOSFET & mô hình', [
  { id: 'q1', question: 'Điều kiện để NMOS ở vùng bão hoà (active) là?', options: ['V_DS < V_GS − V_TH', 'V_GS < V_TH', 'V_DS ≥ V_GS − V_TH', 'V_DS = 0'], correctIndex: 2, explanation: 'Bão hoà khi V_DS ≥ V_ov = V_GS − V_TH; đây là vùng khuếch đại.' },
  { id: 'q2', question: 'Hỗ dẫn gm trong bão hoà bằng biểu thức nào?', options: ['gm = 2·I_D / V_ov', 'gm = lambda·I_D', 'gm = 1 / r_o', 'gm = V_ov / I_D'], correctIndex: 0, explanation: 'gm = mu·Cox·(W/L)·V_ov = 2·I_D/V_ov; gm chỉ tăng theo căn của I_D.' },
  { id: 'q3', question: 'Độ lợi nội tại của một transistor là?', options: ['gm + ro', 'gm · ro', 'ro / gm', 'lambda · V_DS'], correctIndex: 1, explanation: 'gm·ro là độ lợi áp cực đại một transistor cho được; ro = 1/(lambda·I_D).' },
]);

const c2 = doc('aic301-2-1-single-stage', '2.1 — Single-stage amplifiers|||2.1 — Khuếch đại một tầng',
  'Common-source (kèm tải điện trở/tải tích cực/cascode), source follower, common-gate; độ lợi, trở kháng vào/ra; ví dụ SPICE .ac.',
  [[
    `<span class="eyebrow">AIC301 · Chapter 2 · Lesson 2.1</span>
<h2>Single-stage amplifiers</h2>
<p>Three canonical stages cover almost everything; know their gain and impedances by heart.</p>
<h3>Common-source (CS) — the workhorse voltage amplifier</h3>
<pre><code>Resistor load:      Av = -gm * (Ro || ro)
Current-source load: Av = -gm * (ro_n || ro_p)   (high gain ~ gm*ro)
With source degeneration Rs: Av = -gm*RD / (1 + gm*Rs)
</code></pre>
<p>High output impedance, high gain, inverting. A <strong>cascode</strong> adds a common-gate device on top to boost R<sub>out</sub> to ≈ g<sub>m2</sub>·r<sub>o2</sub>·r<sub>o1</sub> and cut the Miller effect.</p>
<h3>Source follower (common-drain) — a buffer</h3>
<pre><code>Av = gm*(ro||RL) / (1 + gm*(ro||RL) + gmb*(ro||RL))  ~ slightly less than 1
Rout ~ 1/gm     (low output impedance -> good buffer)
</code></pre>
<h3>Common-gate (CG) — low input impedance, current buffer</h3>
<pre><code>Av = (gm + gmb) * (RD || ...)      Rin ~ 1/(gm+gmb)
Non-inverting; used as the top device of a cascode and in RF/LNA inputs.
</code></pre>
<pre><code>* SPICE: AC gain of a CS stage with resistor load
M1 out in 0 0 nmos W=20u L=0.5u
RD out vdd 5k
Vdd vdd 0 1.8
Vin in 0 0.7 ac 1
.ac dec 20 1k 1G
.end
</code></pre>
<div class="callout"><span class="badge">Pick by need</span> Need <strong>voltage gain</strong> → CS. Need to <strong>drive a load without loading the previous stage</strong> → source follower. Need <strong>low input impedance / current buffering</strong> → CG.</div>`,
    `<span class="eyebrow">AIC301 · Chương 2 · Bài 2.1</span>
<h2>Khuếch đại một tầng</h2>
<p>Ba tầng kinh điển bao gần hết mọi trường hợp; thuộc lòng độ lợi và trở kháng của chúng.</p>
<h3>Cực nguồn chung (CS) — bộ khuếch đại áp chủ lực</h3>
<pre><code>Tải điện trở:       Av = -gm * (Ro || ro)
Tải nguồn dòng:     Av = -gm * (ro_n || ro_p)   (độ lợi cao ~ gm*ro)
Có suy giảm nguồn Rs: Av = -gm*RD / (1 + gm*Rs)
</code></pre>
<p>Trở kháng ra cao, độ lợi cao, đảo pha. Một <strong>cascode</strong> chồng thêm một linh kiện cực cổng chung lên trên để nâng R<sub>out</sub> lên ≈ g<sub>m2</sub>·r<sub>o2</sub>·r<sub>o1</sub> và giảm hiệu ứng Miller.</p>
<h3>Mạch lặp nguồn (cực máng chung) — bộ đệm</h3>
<pre><code>Av = gm*(ro||RL) / (1 + gm*(ro||RL) + gmb*(ro||RL))  ~ hơi nhỏ hơn 1
Rout ~ 1/gm     (trở kháng ra thấp -> đệm tốt)
</code></pre>
<h3>Cực cổng chung (CG) — trở kháng vào thấp, đệm dòng</h3>
<pre><code>Av = (gm + gmb) * (RD || ...)      Rin ~ 1/(gm+gmb)
Không đảo; dùng làm linh kiện trên của cascode và ngõ vào RF/LNA.
</code></pre>
<pre><code>* SPICE: độ lợi AC của tầng CS tải điện trở
M1 out in 0 0 nmos W=20u L=0.5u
RD out vdd 5k
Vdd vdd 0 1.8
Vin in 0 0.7 ac 1
.ac dec 20 1k 1G
.end
</code></pre>
<div class="callout"><span class="badge">Chọn theo nhu cầu</span> Cần <strong>độ lợi áp</strong> → CS. Cần <strong>lái tải mà không đè lên tầng trước</strong> → mạch lặp nguồn. Cần <strong>trở kháng vào thấp / đệm dòng</strong> → CG.</div>`,
  ]]);

const c2q = quiz('aic301-quiz-2', 'Quiz 2 — Single-stage|||Quiz 2 — Tầng đơn', [
  { id: 'q1', question: 'Tầng cực nguồn chung (CS) với tải nguồn dòng cho độ lợi xấp xỉ?', options: ['1', 'gm·ro (cao)', '1/gm', 'gm·Rs'], correctIndex: 1, explanation: 'CS tải tích cực: Av = -gm·(ro_n||ro_p) ~ độ lợi cỡ gm·ro, đảo pha.' },
  { id: 'q2', question: 'Mạch lặp nguồn (source follower) đặc trưng bởi?', options: ['Độ lợi rất cao, đảo pha', 'Trở kháng ra thấp ~1/gm, độ lợi gần 1', 'Trở kháng vào thấp', 'Không dẫn ở bão hoà'], correctIndex: 1, explanation: 'Source follower là bộ đệm: Rout ~ 1/gm, độ lợi hơi nhỏ hơn 1, không đảo.' },
  { id: 'q3', question: 'Cascode được thêm vào chủ yếu để?', options: ['Giảm độ lợi', 'Nâng trở kháng ra và giảm hiệu ứng Miller', 'Tăng dòng tĩnh', 'Đảo pha tín hiệu'], correctIndex: 1, explanation: 'Cascode nâng Rout lên ~gm2·ro2·ro1 và chặn hiệu ứng Miller ở tầng vào.' },
]);

const c3 = doc('aic301-3-1-current-mirrors', '3.1 — Current mirrors & biasing|||3.1 — Gương dòng & phân cực',
  'Gương dòng cơ bản, tỉ lệ W/L, sai số do ro & mismatch, gương cascode & Wilson, phân cực, ví dụ SPICE gương dòng.',
  [[
    `<span class="eyebrow">AIC301 · Chapter 3 · Lesson 3.1</span>
<h2>Current mirrors &amp; biasing</h2>
<p>Analog blocks are biased by <strong>copying a reference current</strong>, not by resistors — mirrors track over process and temperature far better.</p>
<h3>The basic mirror</h3>
<p>Diode-connect M1 (gate tied to drain) so it sets V<sub>GS</sub>; M2 shares that V<sub>GS</sub> and copies the current scaled by the W/L ratio:</p>
<pre><code>I_out / I_ref = (W/L)_2 / (W/L)_1        (ideal)
Error sources:
  - finite ro: I_out depends on Vds2 (add cascode to fix)
  - Vth / beta mismatch between M1, M2 (use large area + good layout)
Output resistance of basic mirror = ro2
</code></pre>
<h3>Cascode &amp; Wilson mirrors</h3>
<p>A <strong>cascode mirror</strong> stacks a second device to raise R<sub>out</sub> to ≈ g<sub>m</sub>·r<sub>o</sub>² and make I<sub>out</sub> nearly independent of the output voltage — at the cost of headroom. The <strong>Wilson mirror</strong> uses feedback to get high R<sub>out</sub> with fewer stacked devices.</p>
<pre><code>* SPICE: 1:1 NMOS current mirror
Iref vdd n1 50u
M1 n1 n1 0 0 nmos W=10u L=1u
M2 out n1 0 0 nmos W=10u L=1u
Vout out 0 1.0
Vdd vdd 0 1.8
.op
.print dc @M2[id]
.end
</code></pre>
<div class="callout"><span class="badge">Matching &amp; layout</span> Mirror accuracy is a <strong>matching</strong> problem: use identical fingers, common-centroid layout, dummies, and adequate device area (mismatch shrinks as 1/sqrt(W·L)).</div>`,
    `<span class="eyebrow">AIC301 · Chương 3 · Bài 3.1</span>
<h2>Gương dòng &amp; phân cực</h2>
<p>Các khối analog được phân cực bằng cách <strong>sao chép một dòng tham chiếu</strong>, không dùng điện trở — gương dòng bám theo quy trình và nhiệt độ tốt hơn nhiều.</p>
<h3>Gương dòng cơ bản</h3>
<p>Nối diode cho M1 (cổng nối với máng) để nó đặt V<sub>GS</sub>; M2 dùng chung V<sub>GS</sub> đó và sao dòng theo tỉ lệ W/L:</p>
<pre><code>I_out / I_ref = (W/L)_2 / (W/L)_1        (lý tưởng)
Nguồn sai số:
  - ro hữu hạn: I_out phụ thuộc Vds2 (thêm cascode để khắc phục)
  - lệch Vth / beta giữa M1, M2 (dùng diện tích lớn + layout tốt)
Trở kháng ra của gương cơ bản = ro2
</code></pre>
<h3>Gương cascode &amp; Wilson</h3>
<p>Một <strong>gương cascode</strong> chồng thêm một linh kiện để nâng R<sub>out</sub> lên ≈ g<sub>m</sub>·r<sub>o</sub>², làm I<sub>out</sub> gần như độc lập với áp ra — đổi lại tốn headroom. <strong>Gương Wilson</strong> dùng hồi tiếp để đạt R<sub>out</sub> cao với ít linh kiện chồng hơn.</p>
<pre><code>* SPICE: gương dòng NMOS tỉ lệ 1:1
Iref vdd n1 50u
M1 n1 n1 0 0 nmos W=10u L=1u
M2 out n1 0 0 nmos W=10u L=1u
Vout out 0 1.0
Vdd vdd 0 1.8
.op
.print dc @M2[id]
.end
</code></pre>
<div class="callout"><span class="badge">Ghép cặp &amp; layout</span> Độ chính xác của gương là bài toán <strong>ghép cặp (matching)</strong>: dùng các finger giống hệt, layout common-centroid, thêm dummy, và đủ diện tích (sai lệch giảm theo 1/căn(W·L)).</div>`,
  ]]);

const c3q = quiz('aic301-quiz-3', 'Quiz 3 — Current mirrors|||Quiz 3 — Gương dòng', [
  { id: 'q1', question: 'Trong gương dòng lý tưởng, tỉ lệ I_out/I_ref được đặt bởi?', options: ['Tỉ lệ (W/L) của hai transistor', 'Điện áp nguồn', 'Nhiệt độ', 'Điện dung cổng'], correctIndex: 0, explanation: 'M2 dùng chung V_GS với M1 nên I_out/I_ref = (W/L)2/(W/L)1.' },
  { id: 'q2', question: 'Vì sao dùng gương cascode thay vì gương cơ bản?', options: ['Tiết kiệm headroom', 'Nâng trở kháng ra (~gm·ro^2), giảm phụ thuộc áp ra', 'Giảm diện tích', 'Tăng dòng tham chiếu'], correctIndex: 1, explanation: 'Cascode nâng Rout để I_out ít phụ thuộc Vout, đổi lại tốn headroom.' },
  { id: 'q3', question: 'Sai lệch (mismatch) ngẫu nhiên giữa hai transistor giảm theo?', options: ['Tăng dòng', '1/căn(W·L) — tăng diện tích', 'Giảm chiều dài kênh', 'Tăng lambda'], correctIndex: 1, explanation: 'Độ lệch tỉ lệ nghịch với căn diện tích: diện tích lớn + layout tốt cho matching tốt.' },
]);

const c4 = doc('aic301-4-1-differential-pairs', '4.1 — Differential pairs|||4.1 — Cặp vi sai',
  'Cặp vi sai MOS, tải gương dòng biến vi sai→đơn, độ lợi vi sai/chung, CMRR, mất cân bằng offset, ví dụ SPICE quét vi sai.',
  [[
    `<span class="eyebrow">AIC301 · Chapter 4 · Lesson 4.1</span>
<h2>Differential pairs</h2>
<p>The differential pair is the <strong>input stage of nearly every op-amp</strong>. Two matched transistors share a tail current source and steer it based on the difference of their gate voltages — rejecting whatever is common to both inputs (supply noise, temperature drift).</p>
<h3>Gains</h3>
<pre><code>Differential gain (resistor load):  Adm = -gm * RD
With active (current-mirror) load:   Adm = -gm * (ro_n || ro_p)   (single-ended out)
Common-mode gain:                    Acm ~ -RD / (2*Rss)   (Rss = tail source ro)
CMRR = |Adm / Acm| ~ gm * 2 * Rss    (bigger tail ro -> better rejection)
</code></pre>
<p>A <strong>current-mirror (active) load</strong> does the differential-to-single-ended conversion for free and doubles the effective gain.</p>
<h3>Offset &amp; slewing</h3>
<p>Mismatch in V<sub>TH</sub>, W/L or load resistors appears as an <strong>input-referred offset voltage</strong> — a DC error you cannot trim away by design alone. The tail current also sets the <strong>slew rate</strong>: SR = I<sub>tail</sub> / C<sub>L</sub>.</p>
<pre><code>* SPICE: differential DC sweep of an NMOS pair
M1 o1 inp s 0 nmos W=20u L=0.5u
M2 o2 inn s 0 nmos W=20u L=0.5u
Itail s 0 100u
R1 vdd o1 8k
R2 vdd o2 8k
Vdd vdd 0 1.8
Vcm inp 0 0.9 ac 0.5
Vdiff inn 0 0.9 ac -0.5
.dc Vdiff 0.85 0.95 0.001
.end
</code></pre>
<div class="callout"><span class="badge">Why differential wins</span> Differential signalling <strong>rejects common-mode disturbances</strong> and cancels even-order distortion — the reason virtually all high-performance analog is differential.</div>`,
    `<span class="eyebrow">AIC301 · Chương 4 · Bài 4.1</span>
<h2>Cặp vi sai</h2>
<p>Cặp vi sai là <strong>tầng vào của gần như mọi op-amp</strong>. Hai transistor ghép cặp dùng chung một nguồn dòng đuôi và lái dòng đó theo hiệu điện áp cổng — loại bỏ những gì chung cho cả hai ngõ vào (nhiễu nguồn, trôi nhiệt).</p>
<h3>Độ lợi</h3>
<pre><code>Độ lợi vi sai (tải điện trở):   Adm = -gm * RD
Với tải tích cực (gương dòng):   Adm = -gm * (ro_n || ro_p)   (ra đơn)
Độ lợi đồng pha:                 Acm ~ -RD / (2*Rss)   (Rss = ro nguồn đuôi)
CMRR = |Adm / Acm| ~ gm * 2 * Rss   (ro đuôi lớn -> loại bỏ tốt hơn)
</code></pre>
<p>Một <strong>tải gương dòng (tích cực)</strong> làm luôn việc biến vi sai thành đơn miễn phí và nhân đôi độ lợi hiệu dụng.</p>
<h3>Offset &amp; tốc độ đổi (slew)</h3>
<p>Sai lệch V<sub>TH</sub>, W/L hay điện trở tải xuất hiện dưới dạng <strong>điện áp offset quy về ngõ vào</strong> — một sai số DC không thể chỉ dùng thiết kế mà bỏ hết. Dòng đuôi cũng đặt <strong>tốc độ đổi</strong>: SR = I<sub>đuôi</sub> / C<sub>L</sub>.</p>
<pre><code>* SPICE: quét DC vi sai của cặp NMOS
M1 o1 inp s 0 nmos W=20u L=0.5u
M2 o2 inn s 0 nmos W=20u L=0.5u
Itail s 0 100u
R1 vdd o1 8k
R2 vdd o2 8k
Vdd vdd 0 1.8
Vcm inp 0 0.9 ac 0.5
Vdiff inn 0 0.9 ac -0.5
.dc Vdiff 0.85 0.95 0.001
.end
</code></pre>
<div class="callout"><span class="badge">Vì sao vi sai thắng</span> Tín hiệu vi sai <strong>loại bỏ nhiễu đồng pha</strong> và triệt méo bậc chẵn — lý do gần như mọi mạch analog hiệu năng cao đều vi sai.</div>`,
  ]]);

const c4q = quiz('aic301-quiz-4', 'Quiz 4 — Differential pair|||Quiz 4 — Cặp vi sai', [
  { id: 'q1', question: 'Tải gương dòng (tích cực) cho cặp vi sai giúp?', options: ['Giảm độ lợi một nửa', 'Biến vi sai→đơn và nhân đôi độ lợi hiệu dụng', 'Tăng offset', 'Loại bỏ dòng đuôi'], correctIndex: 1, explanation: 'Active load làm chuyển vi sai sang đơn miễn phí và tăng gấp đôi độ lợi.' },
  { id: 'q2', question: 'CMRR của cặp vi sai tăng khi?', options: ['Trở kháng ra nguồn đuôi (Rss) lớn hơn', 'Dòng đuôi nhỏ hơn', 'RD nhỏ hơn', 'Bỏ nguồn đuôi'], correctIndex: 0, explanation: 'CMRR ~ gm·2·Rss; nguồn đuôi có ro cao (vd cascode) loại bỏ đồng pha tốt hơn.' },
  { id: 'q3', question: 'Tốc độ đổi (slew rate) của tầng vi sai bị giới hạn bởi?', options: ['gm của tải', 'I_đuôi / C_L', 'Điện áp ngưỡng', 'CMRR'], correctIndex: 1, explanation: 'Khi vào lớn, một nhánh cắt dòng, C_L nạp bằng cả dòng đuôi: SR = I_tail/C_L.' },
]);

const c5 = doc('aic301-5-1-frequency-feedback', '5.1 — Frequency response & feedback|||5.1 — Đáp ứng tần số & hồi tiếp',
  'Cực/zero, hiệu ứng Miller, băng thông; hồi tiếp âm: độ lợi vòng, độ nhạy, đánh đổi độ lợi–băng thông; bốn topo hồi tiếp.',
  [[
    `<span class="eyebrow">AIC301 · Chapter 5 · Lesson 5.1</span>
<h2>Frequency response &amp; feedback</h2>
<h3>Poles, zeros and bandwidth</h3>
<p>Every node with capacitance creates a <strong>pole</strong> at f = 1/(2·pi·R·C). The <strong>Miller effect</strong> multiplies C<sub>gd</sub> of an inverting stage by (1 + |A|), so it dominates the input pole and limits bandwidth.</p>
<pre><code>Dominant pole:   f_p1 = 1 / (2*pi * Rout * Cout)
Miller cap:      C_in,eff = Cgd * (1 + |Av|)
Gain-bandwidth:  GBW = Av0 * f_p1 ~ gm / (2*pi * C)   (roughly constant)
</code></pre>
<h3>Negative feedback</h3>
<p>Feedback trades raw gain for <strong>everything you actually want</strong>: precise, predictable gain, lower distortion, wider bandwidth, and modified impedances.</p>
<pre><code>Closed-loop gain:  Acl = A / (1 + A*beta)    (beta = feedback factor)
Loop gain:         T = A*beta                (the figure that governs accuracy)
If A*beta >> 1:    Acl ~ 1/beta              (set by passive ratio, not the device)
Desensitivity:     dAcl/Acl = (1/(1+T)) * dA/A
</code></pre>
<p>The four topologies are named by what is sensed and returned: <strong>series-shunt</strong> (voltage amp), shunt-series (current amp), series-series (transconductance), shunt-shunt (transimpedance).</p>
<div class="callout"><span class="badge">The core trade-off</span> A single-pole amp has roughly constant <strong>gain-bandwidth product</strong>: push closed-loop gain down and bandwidth rises by the same factor. You spend loop gain T to buy accuracy and linearity.</div>`,
    `<span class="eyebrow">AIC301 · Chương 5 · Bài 5.1</span>
<h2>Đáp ứng tần số &amp; hồi tiếp</h2>
<h3>Cực, zero và băng thông</h3>
<p>Mỗi nút có điện dung tạo một <strong>cực (pole)</strong> tại f = 1/(2·pi·R·C). <strong>Hiệu ứng Miller</strong> nhân C<sub>gd</sub> của tầng đảo lên (1 + |A|), nên nó chi phối cực ngõ vào và giới hạn băng thông.</p>
<pre><code>Cực trội:        f_p1 = 1 / (2*pi * Rout * Cout)
Tụ Miller:       C_in,eff = Cgd * (1 + |Av|)
Tích độ lợi-BW:  GBW = Av0 * f_p1 ~ gm / (2*pi * C)   (gần như hằng)
</code></pre>
<h3>Hồi tiếp âm</h3>
<p>Hồi tiếp đánh đổi độ lợi thô để lấy <strong>tất cả những gì ta thực sự cần</strong>: độ lợi chính xác và dự đoán được, méo thấp hơn, băng thông rộng hơn, và trở kháng được nắn lại.</p>
<pre><code>Độ lợi vòng kín:  Acl = A / (1 + A*beta)    (beta = hệ số hồi tiếp)
Độ lợi vòng:      T = A*beta                (con số chi phối độ chính xác)
Nếu A*beta >> 1:  Acl ~ 1/beta              (đặt bởi tỉ lệ thụ động, không phải linh kiện)
Giảm nhạy:        dAcl/Acl = (1/(1+T)) * dA/A
</code></pre>
<p>Bốn topo được gọi theo cái được cảm nhận và trả về: <strong>nối tiếp-song song</strong> (khuếch đại áp), song song-nối tiếp (khuếch đại dòng), nối tiếp-nối tiếp (hỗ dẫn), song song-song song (trở kháng chuyển).</p>
<div class="callout"><span class="badge">Đánh đổi cốt lõi</span> Bộ khuếch đại một cực có <strong>tích độ lợi-băng thông</strong> gần như hằng: hạ độ lợi vòng kín thì băng thông tăng đúng bấy nhiêu lần. Bạn tiêu độ lợi vòng T để mua độ chính xác và tuyến tính.</div>`,
  ]]);

const c5q = quiz('aic301-quiz-5', 'Quiz 5 — Frequency & feedback|||Quiz 5 — Tần số & hồi tiếp', [
  { id: 'q1', question: 'Hiệu ứng Miller làm gì với điện dung C_gd của tầng đảo?', options: ['Nhân lên (1 + |Av|), làm hẹp băng thông', 'Triệt tiêu C_gd', 'Biến nó thành điện trở', 'Không ảnh hưởng'], correctIndex: 0, explanation: 'C_in,eff = Cgd·(1+|Av|); tụ Miller chi phối cực vào và giới hạn băng thông.' },
  { id: 'q2', question: 'Khi độ lợi vòng A·beta >> 1, độ lợi vòng kín xấp xỉ?', options: ['A', '1/beta — đặt bởi tỉ lệ thụ động', 'A·beta', 'beta'], correctIndex: 1, explanation: 'Acl = A/(1+A·beta) ~ 1/beta; độ lợi do tỉ lệ linh kiện thụ động chính xác đặt.' },
  { id: 'q3', question: 'Với bộ khuếch đại một cực, hạ độ lợi vòng kín xuống thì?', options: ['Băng thông giảm theo', 'Băng thông tăng lên đúng bấy nhiêu lần (GBW ~ hằng)', 'Không đổi gì', 'Độ lợi vòng tăng'], correctIndex: 1, explanation: 'Tích độ lợi-băng thông gần như hằng: đổi độ lợi lấy băng thông.' },
]);

const c6 = doc('aic301-6-1-opamp-compensation', '6.1 — Op-amp design, stability & compensation|||6.1 — Thiết kế op-amp, ổn định & bù pha',
  'OTA hai tầng, độ lợi vòng hở; biên pha, ổn định; bù Miller + zero điều khiển bằng điện trở nối tiếp; ví dụ SPICE .ac vòng hở.',
  [[
    `<span class="eyebrow">AIC301 · Chapter 6 · Lesson 6.1</span>
<h2>Op-amp design, stability &amp; compensation</h2>
<h3>The two-stage op-amp (OTA)</h3>
<p>A classic op-amp is a <strong>differential pair with active load</strong> (high gain, sets one pole) followed by a <strong>common-source stage</strong> (more gain, drives the load). Total DC gain is the product — often 60–80 dB.</p>
<h3>Stability: phase margin</h3>
<p>With two comparable poles, the loop can ring or oscillate. The health metric is <strong>phase margin (PM)</strong> — the extra phase above −180 deg at the unity-gain frequency.</p>
<pre><code>Unity-gain freq f_u : |T(f_u)| = 1  (0 dB)
Phase margin PM = 180 deg + angle(T) at f_u
  PM > 60 deg  -> well damped (target)
  PM ~ 45 deg  -> some overshoot
  PM -> 0      -> oscillation
</code></pre>
<h3>Miller (pole-splitting) compensation</h3>
<p>Add a capacitor C<sub>c</sub> across the second stage. It <strong>splits the poles</strong> — pushing the dominant pole down and the second pole up — creating a clean single-pole rolloff. But C<sub>c</sub> also makes a <strong>right-half-plane zero</strong> at g<sub>m2</sub>/C<sub>c</sub> that hurts phase; a series <strong>nulling resistor R<sub>z</sub></strong> moves or cancels it.</p>
<pre><code>Dominant pole:  f_p1 ~ 1 / (2*pi * gm2 * ro1 * ro2 * Cc)
Second pole:    f_p2 ~ gm2 / (2*pi * CL)
RHP zero:       f_z  = gm2 / (2*pi * Cc)   -> add Rz so Rz = 1/gm2 cancels it
</code></pre>
<pre><code>* SPICE: open-loop AC to read gain, f_u and phase margin
Vin inp 0 dc 0.9 ac 1
Vinn inn 0 dc 0.9
.ac dec 20 1 100Meg
* measure: gain at low f, unity-gain f, and phase there
.end
</code></pre>
<div class="callout"><span class="badge">Design flow</span> Set DC gain and current → place the dominant pole with C<sub>c</sub> → check that f<sub>p2</sub> is well above f<sub>u</sub> → add R<sub>z</sub> to kill the RHP zero → confirm PM &gt; 60 deg in SPICE, and re-check over corners.</div>`,
    `<span class="eyebrow">AIC301 · Chương 6 · Bài 6.1</span>
<h2>Thiết kế op-amp, ổn định &amp; bù pha</h2>
<h3>Op-amp hai tầng (OTA)</h3>
<p>Một op-amp kinh điển là <strong>cặp vi sai với tải tích cực</strong> (độ lợi cao, đặt một cực) nối tiếp một <strong>tầng cực nguồn chung</strong> (thêm độ lợi, lái tải). Độ lợi DC tổng là tích của hai — thường 60–80 dB.</p>
<h3>Ổn định: biên pha</h3>
<p>Với hai cực xấp xỉ nhau, vòng có thể dao động hoặc rung. Chỉ số sức khoẻ là <strong>biên pha (PM)</strong> — phần pha dư trên −180 độ tại tần số độ lợi đơn vị.</p>
<pre><code>Tần số độ lợi đơn vị f_u : |T(f_u)| = 1  (0 dB)
Biên pha PM = 180 deg + góc(T) tại f_u
  PM > 60 deg  -> giảm rung tốt (mục tiêu)
  PM ~ 45 deg  -> có vọt lố
  PM -> 0      -> dao động
</code></pre>
<h3>Bù Miller (tách cực)</h3>
<p>Thêm một tụ C<sub>c</sub> qua tầng hai. Nó <strong>tách các cực</strong> — đẩy cực trội xuống thấp và cực thứ hai lên cao — tạo dốc giảm một cực sạch. Nhưng C<sub>c</sub> cũng sinh một <strong>zero nửa mặt phẳng phải (RHP)</strong> tại g<sub>m2</sub>/C<sub>c</sub> làm hại pha; một <strong>điện trở khử R<sub>z</sub></strong> nối tiếp sẽ dời hoặc triệt nó.</p>
<pre><code>Cực trội:   f_p1 ~ 1 / (2*pi * gm2 * ro1 * ro2 * Cc)
Cực thứ hai: f_p2 ~ gm2 / (2*pi * CL)
Zero RHP:   f_z  = gm2 / (2*pi * Cc)   -> thêm Rz sao cho Rz = 1/gm2 triệt nó
</code></pre>
<pre><code>* SPICE: AC vòng hở để đọc độ lợi, f_u và biên pha
Vin inp 0 dc 0.9 ac 1
Vinn inn 0 dc 0.9
.ac dec 20 1 100Meg
* đo: độ lợi ở f thấp, f độ lợi đơn vị, và pha tại đó
.end
</code></pre>
<div class="callout"><span class="badge">Quy trình thiết kế</span> Đặt độ lợi DC và dòng → đặt cực trội bằng C<sub>c</sub> → kiểm f<sub>p2</sub> cao hơn hẳn f<sub>u</sub> → thêm R<sub>z</sub> để diệt zero RHP → xác nhận PM &gt; 60 độ trong SPICE, và kiểm lại theo các góc quy trình (corner).</div>`,
  ]]);

const c6q = quiz('aic301-quiz-6', 'Quiz 6 — Op-amp & compensation|||Quiz 6 — Op-amp & bù pha', [
  { id: 'q1', question: 'Biên pha (phase margin) nên đạt khoảng bao nhiêu để ổn định tốt?', options: ['0 độ', '> 60 độ', '−180 độ', 'Càng nhỏ càng tốt'], correctIndex: 1, explanation: 'PM > 60 độ cho đáp ứng giảm rung tốt; PM → 0 là biên giới dao động.' },
  { id: 'q2', question: 'Bù Miller (tụ Cc qua tầng hai) có tác dụng chính là?', options: ['Tách cực: đẩy cực trội xuống, cực hai lên', 'Tăng độ lợi DC', 'Loại bỏ nhiễu nhiệt', 'Tăng dòng đuôi'], correctIndex: 0, explanation: 'Cc tách cực (pole splitting) tạo dốc một cực sạch quanh f_u.' },
  { id: 'q3', question: 'Vì sao thêm điện trở nối tiếp Rz với tụ bù Miller?', options: ['Tăng công suất', 'Dời/triệt zero nửa mặt phẳng phải (RHP) hại pha', 'Giảm độ lợi vòng hở', 'Đặt điểm tĩnh'], correctIndex: 1, explanation: 'Cc sinh zero RHP tại gm2/Cc; chọn Rz = 1/gm2 để triệt nó, cứu biên pha.' },
]);

const c7 = doc('aic301-7-1-noise-cmos-process', '7.1 — Noise & the CMOS process|||7.1 — Nhiễu & quy trình CMOS',
  'Nhiễu nhiệt & nhiễu 1/f (flicker), nhiễu quy về ngõ vào, mật độ phổ; quy trình CMOS: lớp, layout, ký sinh, mismatch, corner.',
  [[
    `<span class="eyebrow">AIC301 · Chapter 7 · Lesson 7.1</span>
<h2>Noise &amp; the CMOS process</h2>
<h3>Where noise comes from</h3>
<ul>
<li><strong>Thermal noise</strong> — random motion of carriers; flat ("white") over frequency. A MOSFET channel contributes a drain current noise density:</li>
</ul>
<pre><code>Thermal (drain):  in^2 / df = 4*k*T*gamma*gm         (gamma ~ 2/3 in long channel)
Flicker (1/f):    vn^2 / df = K / (Cox * W * L * f)   (falls with frequency)
Corner freq f_c:  where 1/f noise = thermal noise
Input-referred:   vn,in^2 = in^2 / gm^2                (divide by gm^2)
</code></pre>
<p>Two levers cut noise: raise <strong>g<sub>m</sub></strong> (more current, or higher gm/I<sub>D</sub>) to shrink input-referred thermal noise, and grow <strong>device area W·L</strong> to shrink flicker noise. PMOS is usually quieter for 1/f than NMOS.</p>
<h3>The CMOS process &amp; layout</h3>
<p>A chip is built in layers — wells, diffusion, poly gate, contacts, several metals. What you draw as a schematic becomes silicon through <strong>layout</strong>, and layout adds reality:</p>
<ul>
<li><strong>Parasitics</strong> — every wire has R and C; junctions add capacitance that moves your poles.</li>
<li><strong>Matching</strong> — common-centroid, dummies and orientation matter for pairs and mirrors.</li>
<li><strong>Corners &amp; PVT</strong> — verify across process corners (SS/TT/FF), supply Voltage and Temperature; a design that only works at TT is not done.</li>
</ul>
<pre><code>* SPICE: input-referred noise of an amplifier
Vin in 0 dc 0.9 ac 1
.noise V(out) Vin dec 20 1 10Meg
* reports output noise and input-referred noise vs frequency
.end
</code></pre>
<div class="callout"><span class="badge">Noise is a budget</span> You cannot remove noise, only <strong>trade power and area for it</strong>. Decide the target input-referred noise first, then spend gm (current) and area to hit it.</div>`,
    `<span class="eyebrow">AIC301 · Chương 7 · Bài 7.1</span>
<h2>Nhiễu &amp; quy trình CMOS</h2>
<h3>Nhiễu đến từ đâu</h3>
<ul>
<li><strong>Nhiễu nhiệt</strong> — chuyển động ngẫu nhiên của hạt tải; phẳng ("trắng") theo tần số. Kênh MOSFET góp một mật độ nhiễu dòng máng:</li>
</ul>
<pre><code>Nhiệt (máng):   in^2 / df = 4*k*T*gamma*gm         (gamma ~ 2/3 với kênh dài)
Flicker (1/f):  vn^2 / df = K / (Cox * W * L * f)   (giảm theo tần số)
Tần số góc f_c: nơi nhiễu 1/f = nhiễu nhiệt
Quy về ngõ vào: vn,in^2 = in^2 / gm^2                (chia cho gm^2)
</code></pre>
<p>Hai đòn bẩy giảm nhiễu: nâng <strong>g<sub>m</sub></strong> (thêm dòng, hoặc gm/I<sub>D</sub> cao hơn) để giảm nhiễu nhiệt quy về ngõ vào, và tăng <strong>diện tích W·L</strong> để giảm nhiễu flicker. PMOS thường ít nhiễu 1/f hơn NMOS.</p>
<h3>Quy trình CMOS &amp; layout</h3>
<p>Con chip được dựng theo lớp — well, khuếch tán, cổng poly, contact, nhiều lớp kim loại. Thứ bạn vẽ trên sơ đồ trở thành silicon qua <strong>layout</strong>, và layout thêm phần thực tế:</p>
<ul>
<li><strong>Ký sinh</strong> — mỗi dây có R và C; các tiếp giáp thêm điện dung làm dịch cực của bạn.</li>
<li><strong>Ghép cặp</strong> — common-centroid, dummy và hướng đặt đều quan trọng với cặp và gương dòng.</li>
<li><strong>Corner &amp; PVT</strong> — kiểm qua các góc quy trình (SS/TT/FF), điện áp nguồn và nhiệt độ; một thiết kế chỉ chạy ở TT là chưa xong.</li>
</ul>
<pre><code>* SPICE: nhiễu quy về ngõ vào của bộ khuếch đại
Vin in 0 dc 0.9 ac 1
.noise V(out) Vin dec 20 1 10Meg
* báo nhiễu ở ngõ ra và nhiễu quy về ngõ vào theo tần số
.end
</code></pre>
<div class="callout"><span class="badge">Nhiễu là một ngân sách</span> Không thể xoá nhiễu, chỉ có thể <strong>đổi công suất và diện tích lấy nó</strong>. Quyết định nhiễu quy về ngõ vào mục tiêu trước, rồi tiêu gm (dòng) và diện tích để đạt.</div>`,
  ]]);

const c7q = quiz('aic301-quiz-7', 'Quiz 7 — Noise & CMOS|||Quiz 7 — Nhiễu & CMOS', [
  { id: 'q1', question: 'Nhiễu nhiệt của kênh MOSFET có mật độ tỉ lệ với?', options: ['1/f', 'gm (in^2/df = 4kT·gamma·gm)', 'W·L', 'lambda'], correctIndex: 1, explanation: 'Nhiễu nhiệt phẳng theo tần số, mật độ ~ 4kT·gamma·gm.' },
  { id: 'q2', question: 'Cách hữu hiệu để giảm nhiễu flicker (1/f)?', options: ['Giảm dòng', 'Tăng diện tích W·L của transistor', 'Giảm gm', 'Tăng lambda'], correctIndex: 1, explanation: 'Nhiễu 1/f ~ K/(Cox·W·L·f); diện tích lớn (thường dùng PMOS) giảm nhiễu này.' },
  { id: 'q3', question: 'Vì sao phải kiểm thiết kế qua các "corner" SS/TT/FF và PVT?', options: ['Để tăng độ lợi DC', 'Vì chạy đúng ở TT không đảm bảo chạy đúng khi quy trình/áp/nhiệt thay đổi', 'Để giảm diện tích', 'Để bỏ nhiễu nhiệt'], correctIndex: 1, explanation: 'Tham số linh kiện trôi theo quy trình/áp/nhiệt; phải verify mọi corner mới coi là xong.' },
]);

const c8 = doc('aic301-8-1-references-mixed-signal', '8.1 — Bandgap references, PLL & data-converter blocks|||8.1 — Nguồn bandgap, PLL & khối ADC-DAC',
  'Nguồn tham chiếu bandgap (CTAT+PTAT), PLL (PFD/CP/VCO/divider), khối ADC/DAC (lấy mẫu, lượng tử hoá, R-2R, SAR); Verilog-A VCO.',
  [[
    `<span class="eyebrow">AIC301 · Chapter 8 · Lesson 8.1</span>
<h2>Bandgap references, PLL &amp; data-converter blocks</h2>
<h3>Bandgap voltage reference</h3>
<p>Circuits need a voltage that does <strong>not</strong> drift with temperature or supply. A bandgap sums two opposing terms:</p>
<pre><code>V_BE (diode)          -> CTAT: falls ~ -2 mV/K   (Complementary To Absolute Temp)
delta V_BE (or VT)    -> PTAT: rises with T       (Proportional To Absolute Temp)
V_ref = V_BE + K * delta_V_BE  ~ 1.2 V (silicon bandgap), slope ~ 0 near room temp
</code></pre>
<p>Choosing K so the PTAT slope cancels the CTAT slope gives a near-flat ~1.2 V, stable over temperature and process.</p>
<h3>Phase-locked loop (PLL)</h3>
<p>A PLL locks an output clock to a reference. Blocks: <strong>PFD</strong> (phase-frequency detector) → <strong>charge pump + loop filter</strong> → <strong>VCO</strong> → <strong>divider</strong> back to the PFD. In lock, f<sub>out</sub> = N · f<sub>ref</sub>.</p>
<pre><code>// Verilog-A: a simple VCO (frequency proportional to control voltage)
module vco(vout, vctrl);
  output vout; input vctrl;
  electrical vout, vctrl;
  parameter real kvco = 1e8;   // Hz per Volt
  parameter real f0   = 1e9;   // free-running Hz
  real phase;
  analog begin
    phase = 2*3.14159*idt(f0 + kvco*V(vctrl));
    V(vout) &lt;+ sin(phase);
  end
endmodule
</code></pre>
<h3>Data converters (ADC / DAC)</h3>
<p>An <strong>ADC</strong> turns analog into digital in two steps: <strong>sample &amp; hold</strong> (freeze the value) then <strong>quantise</strong> (map to the nearest of 2^N levels). Key limits: resolution N bits, quantisation noise, and sample rate (Nyquist: f<sub>s</sub> &gt; 2·f<sub>signal</sub>). A <strong>DAC</strong> does the reverse — an R-2R ladder or weighted current sources sum bits into a voltage; a SAR ADC uses a DAC in a binary search.</p>
<pre><code>LSB (step) = V_ref / 2^N
Quantisation noise (rms) = LSB / sqrt(12)
Ideal SNR = 6.02*N + 1.76  dB
</code></pre>
<div class="callout"><span class="badge">It all connects</span> A data-converter chip uses <strong>every</strong> block in this course: a bandgap sets its reference, mirrors bias it, a diff-pair op-amp buffers the sample, and a PLL clocks it — analog IC design in one system.</div>`,
    `<span class="eyebrow">AIC301 · Chương 8 · Bài 8.1</span>
<h2>Nguồn bandgap, PLL &amp; khối ADC-DAC</h2>
<h3>Nguồn tham chiếu bandgap</h3>
<p>Mạch cần một điện áp <strong>không</strong> trôi theo nhiệt độ hay nguồn. Bandgap cộng hai số hạng ngược chiều nhau:</p>
<pre><code>V_BE (diode)          -> CTAT: giảm ~ -2 mV/K   (ngược với nhiệt độ tuyệt đối)
delta V_BE (hay VT)   -> PTAT: tăng theo T       (tỉ lệ nhiệt độ tuyệt đối)
V_ref = V_BE + K * delta_V_BE  ~ 1,2 V (bandgap của silicon), độ dốc ~ 0 gần nhiệt phòng
</code></pre>
<p>Chọn K sao cho độ dốc PTAT triệt độ dốc CTAT cho ra ~1,2 V gần như phẳng, ổn định theo nhiệt độ và quy trình.</p>
<h3>Vòng khoá pha (PLL)</h3>
<p>PLL khoá một xung nhịp ra vào một tham chiếu. Các khối: <strong>PFD</strong> (bộ dò pha-tần) → <strong>bơm điện tích + bộ lọc vòng</strong> → <strong>VCO</strong> → <strong>bộ chia</strong> quay lại PFD. Khi khoá, f<sub>ra</sub> = N · f<sub>ref</sub>.</p>
<pre><code>// Verilog-A: một VCO đơn giản (tần số tỉ lệ áp điều khiển)
module vco(vout, vctrl);
  output vout; input vctrl;
  electrical vout, vctrl;
  parameter real kvco = 1e8;   // Hz mỗi Volt
  parameter real f0   = 1e9;   // tần số tự chạy Hz
  real phase;
  analog begin
    phase = 2*3.14159*idt(f0 + kvco*V(vctrl));
    V(vout) &lt;+ sin(phase);
  end
endmodule
</code></pre>
<h3>Bộ chuyển đổi dữ liệu (ADC / DAC)</h3>
<p>Một <strong>ADC</strong> biến analog thành số qua hai bước: <strong>lấy mẫu &amp; giữ</strong> (đóng băng giá trị) rồi <strong>lượng tử hoá</strong> (ánh xạ về mức gần nhất trong 2^N mức). Giới hạn chính: độ phân giải N bit, nhiễu lượng tử, và tốc độ lấy mẫu (Nyquist: f<sub>s</sub> &gt; 2·f<sub>tín hiệu</sub>). Một <strong>DAC</strong> làm ngược lại — thang R-2R hay các nguồn dòng trọng số cộng các bit thành áp; ADC kiểu SAR dùng một DAC trong tìm kiếm nhị phân.</p>
<pre><code>LSB (bước) = V_ref / 2^N
Nhiễu lượng tử (rms) = LSB / sqrt(12)
SNR lý tưởng = 6.02*N + 1.76  dB
</code></pre>
<div class="callout"><span class="badge">Mọi thứ nối lại</span> Một chip chuyển đổi dữ liệu dùng <strong>mọi</strong> khối trong môn này: bandgap đặt tham chiếu, gương dòng phân cực, op-amp cặp vi sai đệm mẫu, và PLL cấp nhịp — thiết kế analog IC trong một hệ thống.</div>`,
  ]]);

const c8q = quiz('aic301-quiz-8', 'Quiz 8 — References & mixed-signal|||Quiz 8 — Tham chiếu & tín hiệu hỗn hợp', [
  { id: 'q1', question: 'Nguồn bandgap đạt điện áp ổn nhiệt bằng cách?', options: ['Chỉ dùng V_BE (CTAT)', 'Cộng số hạng CTAT (V_BE) với số hạng PTAT (delta V_BE) đã nhân hệ số', 'Dùng một điện trở lớn', 'Lấy mẫu và giữ'], correctIndex: 1, explanation: 'V_ref = V_BE + K·delta_V_BE ~ 1,2 V; PTAT triệt độ dốc nhiệt của CTAT.' },
  { id: 'q2', question: 'Trong PLL khi đã khoá, tần số ra liên hệ tần số tham chiếu qua bộ chia N là?', options: ['f_ra = f_ref / N', 'f_ra = N · f_ref', 'f_ra = f_ref', 'f_ra = 2·f_ref'], correctIndex: 1, explanation: 'Bộ chia :N trong hồi tiếp làm f_ra = N·f_ref khi vòng khoá.' },
  { id: 'q3', question: 'SNR lý tưởng của một ADC N bit xấp xỉ?', options: ['6.02·N + 1.76 dB', 'N dB', '2^N dB', '1.76·N dB'], correctIndex: 0, explanation: 'Từ nhiễu lượng tử LSB/căn12: SNR = 6.02·N + 1.76 dB.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'AIC301',
    slug: 'aic301-analog-ics',
    title: 'Analog ICs',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/AIC301.webp',
    shortDescription: 'Analog CMOS IC design: MOSFET small-signal model, single-stage amps, current mirrors, differential pairs, frequency response & feedback, op-amp compensation & stability, noise & CMOS process, bandgap/PLL/ADC-DAC. Bilingual, SPICE examples & quizzes.|||Thiết kế mạch tích hợp tương tự CMOS: mô hình tín hiệu nhỏ MOSFET, khuếch đại một tầng, gương dòng, cặp vi sai, đáp ứng tần số & hồi tiếp, bù pha op-amp, nhiễu & quy trình CMOS, bandgap/PLL/ADC-DAC. Song ngữ, ví dụ SPICE & quiz.',
    description: 'Môn <strong>AIC301 — Analog ICs</strong> (Thiết kế mạch tích hợp tương tự, ngành Thiết kế vi mạch bán dẫn, kỳ 7) dạy cách <strong>thiết kế các khối analog trong CMOS</strong> và phân tích chúng bằng tay lẫn SPICE. Từ <strong>MOSFET &amp; mô hình tín hiệu nhỏ</strong> (gm, ro) → <strong>khuếch đại một tầng</strong> (CS/CG/lặp nguồn, cascode) → <strong>gương dòng &amp; phân cực</strong> → <strong>cặp vi sai</strong> (CMRR, offset) → <strong>đáp ứng tần số &amp; hồi tiếp</strong> (Miller, độ lợi vòng) → <strong>op-amp, ổn định &amp; bù pha</strong> → <strong>nhiễu &amp; quy trình CMOS</strong> → <strong>bandgap, PLL &amp; khối ADC/DAC</strong>. Song ngữ, có công thức, ví dụ SPICE/Verilog-A và quiz mỗi chương. Bám các giáo trình chuẩn Razavi, Sedra/Smith, Gray-Meyer, Baker.',
    whatYouLearn: 'Vùng hoạt động MOSFET, phương trình I-V, gm/ro/gmb, mô hình tín hiệu nhỏ; tầng CS/CG/source follower & cascode; gương dòng, matching, phân cực; cặp vi sai, độ lợi vi sai/đồng pha, CMRR, offset, slew; cực/zero, hiệu ứng Miller, hồi tiếp âm & bốn topo; op-amp hai tầng, biên pha, bù Miller + Rz; nhiễu nhiệt & 1/f, nhiễu quy về ngõ vào, layout & corner PVT; nguồn bandgap, PLL (PFD/CP/VCO/divider), ADC/DAC (SAR, R-2R, SNR).',
    requirements: 'Đã học điện tử cơ bản (ECI101 hoặc tương đương) và giải tích/đại số tuyến tính. Nên cài một bộ SPICE miễn phí (Ngspice) để mô phỏng các ví dụ.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình chuẩn (Razavi, Sedra/Smith, Gray-Meyer, Baker), công cụ SPICE, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Analog IC là gì, vì sao khó, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — MOSFET & mô hình|||Chapter 1 — MOSFET & model', description: 'Vùng hoạt động, gm/ro, tín hiệu nhỏ.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Khuếch đại một tầng|||Chapter 2 — Single-stage amps', description: 'CS/CG/lặp nguồn, cascode.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Gương dòng & phân cực|||Chapter 3 — Current mirrors & biasing', description: 'Gương cơ bản/cascode, matching.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Cặp vi sai|||Chapter 4 — Differential pairs', description: 'CMRR, tải tích cực, offset, slew.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Tần số & hồi tiếp|||Chapter 5 — Frequency & feedback', description: 'Cực/zero, Miller, độ lợi vòng.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Op-amp & bù pha|||Chapter 6 — Op-amp & compensation', description: 'OTA hai tầng, biên pha, bù Miller.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Nhiễu & quy trình CMOS|||Chapter 7 — Noise & CMOS process', description: 'Nhiễu nhiệt/1/f, layout, corner.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Bandgap, PLL & ADC/DAC|||Chapter 8 — Bandgap, PLL & ADC/DAC', description: 'Tham chiếu, PLL, chuyển đổi dữ liệu.', lessons: [c8, c8q] },
  ],
};
