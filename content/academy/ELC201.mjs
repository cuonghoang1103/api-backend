/**
 * ELC201 — Electronic Circuits (Mạch điện tử). Ngành Thiết kế vi mạch bán dẫn
 * (FPTU), kỳ 2. Khung 8 chương bám giáo trình chuẩn quốc tế: Sedra & Smith
 * "Microelectronic Circuits", Boylestad "Electronic Devices and Circuit
 * Theory", Razavi "Fundamentals of Microelectronics", All About Circuits.
 * Song ngữ + công thức/phân tích + ví dụ mạch; quiz mỗi chương.
 * Giữ NGUYÊN slug/semester/courseCode/thumb(v3). ⚠️ KHÔNG backtick/${; "&"→&amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('elc201-0-1-overview', 'Course overview: Electronic Circuits|||Tổng quan: Mạch điện tử',
  'Mạch điện tử làm gì; đại lượng cơ bản; lộ trình 4 bước: nền mạch & phân tích → thụ động/phản ứng → diode → transistor (BJT/MOSFET) & op-amp → mạch số & mô phỏng SPICE.',
  [[
    `<span class="eyebrow">ELC201 · Lesson 0.1 · Overview</span>
<h2>Electronic Circuits</h2>
<p class="lead">This course builds the analog foundation behind every chip you will design — how <strong>voltage, current and impedance</strong> behave in real circuits, and how <strong>diodes, transistors and op-amps</strong> shape signals. It is the bridge from circuit theory to the transistor-level thinking of semiconductor IC design.</p>
<h3>The three quantities</h3>
<ul>
<li><strong>Voltage (V)</strong> — potential difference, in volts; the "push".</li>
<li><strong>Current (I)</strong> — flow of charge, in amperes.</li>
<li><strong>Resistance / impedance (R, Z)</strong> — opposition to flow, in ohms (Ω).</li>
</ul>
<p>Tied by <strong>Ohm's law: V = I × R</strong>, extended to <strong>Kirchhoff's laws</strong> for whole networks, then to frequency-dependent behavior once capacitors and inductors enter.</p>
<h3>Roadmap (4 steps)</h3>
<ol>
<li><strong>Foundations</strong> — Ch1 circuit fundamentals &amp; Ch2 analysis (divider, Thevenin/Norton, superposition).</li>
<li><strong>Passives &amp; dynamics</strong> — Ch3 R/L/C, RC/RL/RLC transients.</li>
<li><strong>Devices</strong> — Ch4 diodes, Ch5 BJT &amp; Ch6 MOSFET amplifiers, Ch7 op-amps.</li>
<li><strong>Systems</strong> — Ch8 digital circuits, oscillators, supplies &amp; SPICE simulation.</li>
</ol>
<div class="callout"><span class="badge">Textbooks</span> Sedra &amp; Smith, <em>Microelectronic Circuits</em>; Boylestad, <em>Electronic Devices and Circuit Theory</em>; Razavi, <em>Fundamentals of Microelectronics</em>.</div>`,
    `<span class="eyebrow">ELC201 · Bài 0.1 · Tổng quan</span>
<h2>Mạch điện tử</h2>
<p class="lead">Môn này dựng nền analog nằm sau mọi con chip bạn sẽ thiết kế — cách <strong>điện áp, dòng điện và trở kháng</strong> hành xử trong mạch thật, và cách <strong>diode, transistor, op-amp</strong> định hình tín hiệu. Nó là cầu nối từ lý thuyết mạch tới tư duy cấp transistor của thiết kế vi mạch bán dẫn.</p>
<h3>Ba đại lượng</h3>
<ul>
<li><strong>Điện áp (V)</strong> — hiệu điện thế, đo bằng volt; "lực đẩy".</li>
<li><strong>Dòng điện (I)</strong> — dòng chảy điện tích, đo bằng ampe.</li>
<li><strong>Điện trở / trở kháng (R, Z)</strong> — cản trở dòng chảy, đo bằng ohm (Ω).</li>
</ul>
<p>Gắn với nhau bởi <strong>định luật Ohm: V = I × R</strong>, mở rộng thành <strong>định luật Kirchhoff</strong> cho cả mạng, rồi thành hành vi phụ thuộc tần số khi có tụ và cuộn cảm.</p>
<h3>Lộ trình (4 bước)</h3>
<ol>
<li><strong>Nền tảng</strong> — Ch1 cơ bản mạch &amp; Ch2 phân tích (chia áp, Thevenin/Norton, chồng chập).</li>
<li><strong>Thụ động &amp; động học</strong> — Ch3 R/L/C, quá độ RC/RL/RLC.</li>
<li><strong>Linh kiện</strong> — Ch4 diode, Ch5 BJT &amp; Ch6 MOSFET khuếch đại, Ch7 op-amp.</li>
<li><strong>Hệ thống</strong> — Ch8 mạch số, dao động, nguồn &amp; mô phỏng SPICE.</li>
</ol>
<div class="callout"><span class="badge">Sách</span> Sedra &amp; Smith, <em>Microelectronic Circuits</em>; Boylestad, <em>Electronic Devices and Circuit Theory</em>; Razavi, <em>Fundamentals of Microelectronics</em>.</div>`,
  ]]);

const c1 = doc('elc201-1-1-fundamentals', '1.1 — Circuit fundamentals|||1.1 — Cơ bản mạch điện',
  'Điện áp/dòng/trở, định luật Ohm; định luật Kirchhoff KVL (áp quanh vòng) và KCL (dòng tại nút); công suất P = V·I.',
  [[
    `<span class="eyebrow">ELC201 · Chapter 1 · Lesson 1.1</span>
<h2>Circuit fundamentals</h2>
<h3>Voltage, current, resistance</h3>
<p>A circuit moves charge around a loop. <strong>Voltage</strong> is the energy per charge that drives the flow, <strong>current</strong> is the rate of charge flow, and <strong>resistance</strong> opposes it. <strong>Ohm's law</strong> ties them: <code>V = I × R</code>, and <strong>power</strong> dissipated is <code>P = V × I = I²R</code>.</p>
<h3>Kirchhoff's laws</h3>
<ul>
<li><strong>KCL (current):</strong> the sum of currents into a node equals the sum out — charge is conserved.</li>
<li><strong>KVL (voltage):</strong> around any closed loop, the algebraic sum of voltages is zero — energy is conserved.</li>
</ul>
<pre><code>Series loop (KVL): 12 V source, R1 = 2 kΩ, R2 = 4 kΩ
  KVL:  12 = I·R1 + I·R2
  I    = 12 / (2k + 4k) = 2 mA
  P(R2) = I²·R2 = (2mA)² × 4kΩ = 16 mW
</code></pre>
<div class="callout"><span class="badge">KCL + KVL</span> Together these two laws are enough to solve any linear resistive network — node and mesh analysis are just KCL and KVL written as systems of equations.</div>`,
    `<span class="eyebrow">ELC201 · Chương 1 · Bài 1.1</span>
<h2>Cơ bản mạch điện</h2>
<h3>Điện áp, dòng điện, điện trở</h3>
<p>Mạch điện di chuyển điện tích quanh một vòng. <strong>Điện áp</strong> là năng lượng trên mỗi điện tích thúc dòng chảy, <strong>dòng điện</strong> là tốc độ chảy của điện tích, và <strong>điện trở</strong> cản lại. <strong>Định luật Ohm</strong> gắn chúng: <code>V = I × R</code>, và <strong>công suất</strong> tiêu tán là <code>P = V × I = I²R</code>.</p>
<h3>Định luật Kirchhoff</h3>
<ul>
<li><strong>KCL (dòng):</strong> tổng dòng vào một nút bằng tổng dòng ra — bảo toàn điện tích.</li>
<li><strong>KVL (áp):</strong> quanh một vòng kín, tổng đại số các điện áp bằng 0 — bảo toàn năng lượng.</li>
</ul>
<pre><code>Vòng nối tiếp (KVL): nguồn 12 V, R1 = 2 kΩ, R2 = 4 kΩ
  KVL:  12 = I·R1 + I·R2
  I    = 12 / (2k + 4k) = 2 mA
  P(R2) = I²·R2 = (2mA)² × 4kΩ = 16 mW
</code></pre>
<div class="callout"><span class="badge">KCL + KVL</span> Hai định luật này đủ để giải mọi mạng điện trở tuyến tính — phân tích nút và mắt lưới chỉ là KCL và KVL viết thành hệ phương trình.</div>`,
  ]]);

const c1q = quiz('elc201-quiz-1', 'Quiz 1 — Fundamentals|||Quiz 1 — Cơ bản mạch', [
  { id: 'q1', question: 'Định luật Ohm liên hệ áp, dòng, trở là?', options: ['V = I + R', 'V = I × R', 'V = I / R', 'V = R / I'], correctIndex: 1, explanation: 'V = I·R là quan hệ nền tảng giữa điện áp, dòng điện và điện trở.' },
  { id: 'q2', question: 'KCL (định luật dòng Kirchhoff) phát biểu?', options: ['Tổng áp quanh vòng bằng 0', 'Tổng dòng VÀO nút = tổng dòng RA nút', 'Công suất = V × I', 'Trở nối tiếp cộng lại'], correctIndex: 1, explanation: 'KCL: bảo toàn điện tích — dòng vào một nút bằng dòng ra.' },
  { id: 'q3', question: 'Công suất tiêu tán trên điện trở tính bằng?', options: ['P = V / I', 'P = V × I = I²R', 'P = V − I', 'P = R / V'], correctIndex: 1, explanation: 'P = V·I, và với điện trở P = I²R = V²/R.' },
]);

const c2 = doc('elc201-2-1-analysis', '2.1 — Circuit analysis|||2.1 — Phân tích mạch',
  'Bộ chia áp/chia dòng; định lý Thevenin và Norton (rút gọn mạng thành nguồn + trở tương đương); nguyên lý chồng chập (superposition).',
  [[
    `<span class="eyebrow">ELC201 · Chapter 2 · Lesson 2.1</span>
<h2>Circuit analysis</h2>
<h3>Voltage &amp; current dividers</h3>
<p>Two series resistors split a voltage in proportion to their values: <code>V2 = V × R2 / (R1 + R2)</code>. Two parallel resistors split a current the opposite way. These are the two most-used shortcuts in analog design.</p>
<h3>Thevenin &amp; Norton</h3>
<p>Any linear two-terminal network reduces to a single <strong>Thevenin</strong> voltage source V_TH in series with R_TH, or an equivalent <strong>Norton</strong> current source I_N in parallel with R_N, where <code>R_TH = R_N</code> and <code>V_TH = I_N × R_N</code>.</p>
<h3>Superposition</h3>
<p>In a linear circuit with several sources, the response equals the <strong>sum</strong> of the responses to each source acting alone (other voltage sources shorted, current sources opened).</p>
<pre><code>Thevenin at output of divider (12 V, R1 = R2 = 6 kΩ):
  V_TH = 12 × R2/(R1+R2) = 6 V
  R_TH = R1 || R2 = 6k·6k/(6k+6k) = 3 kΩ
  Load 3 kΩ: V_out = 6 × 3k/(3k+3k) = 3 V
</code></pre>
<div class="callout"><span class="badge">Why reduce?</span> Thevenin/Norton turn a messy sub-circuit into one source + one resistor, so you can analyze what a load actually sees without redrawing everything.</div>`,
    `<span class="eyebrow">ELC201 · Chương 2 · Bài 2.1</span>
<h2>Phân tích mạch</h2>
<h3>Bộ chia áp &amp; chia dòng</h3>
<p>Hai điện trở nối tiếp chia điện áp theo tỉ lệ giá trị: <code>V2 = V × R2 / (R1 + R2)</code>. Hai điện trở song song chia dòng theo chiều ngược lại. Đây là hai lối tắt được dùng nhiều nhất trong thiết kế analog.</p>
<h3>Thevenin &amp; Norton</h3>
<p>Mọi mạng tuyến tính hai đầu đều rút gọn được thành một nguồn áp <strong>Thevenin</strong> V_TH nối tiếp R_TH, hoặc nguồn dòng <strong>Norton</strong> tương đương I_N song song R_N, với <code>R_TH = R_N</code> và <code>V_TH = I_N × R_N</code>.</p>
<h3>Chồng chập (superposition)</h3>
<p>Trong mạch tuyến tính có nhiều nguồn, đáp ứng bằng <strong>tổng</strong> đáp ứng của từng nguồn tác động riêng lẻ (nguồn áp còn lại nối tắt, nguồn dòng còn lại hở mạch).</p>
<pre><code>Thevenin tại ngõ ra bộ chia (12 V, R1 = R2 = 6 kΩ):
  V_TH = 12 × R2/(R1+R2) = 6 V
  R_TH = R1 || R2 = 6k·6k/(6k+6k) = 3 kΩ
  Tải 3 kΩ: V_out = 6 × 3k/(3k+3k) = 3 V
</code></pre>
<div class="callout"><span class="badge">Vì sao rút gọn?</span> Thevenin/Norton biến một mạch con rối rắm thành một nguồn + một điện trở, để bạn phân tích được thứ mà tải thực sự "nhìn thấy" mà không cần vẽ lại tất cả.</div>`,
  ]]);

const c2q = quiz('elc201-quiz-2', 'Quiz 2 — Analysis|||Quiz 2 — Phân tích mạch', [
  { id: 'q1', question: 'Bộ chia áp: hai điện trở nối tiếp chia điện áp theo?', options: ['Tỉ lệ nghịch tổng', 'Tỉ lệ giá trị điện trở (V2 = V·R2/(R1+R2))', 'Bằng nhau luôn', 'Theo dòng vào'], correctIndex: 1, explanation: 'Áp trên mỗi trở tỉ lệ với giá trị của nó trên tổng nối tiếp.' },
  { id: 'q2', question: 'Định lý Thevenin rút gọn mạng tuyến tính hai đầu thành?', options: ['Một nguồn dòng nối tiếp một tụ', 'Một nguồn áp V_TH nối tiếp một điện trở R_TH', 'Chỉ một điện trở', 'Một cuộn cảm'], correctIndex: 1, explanation: 'Thevenin: nguồn áp tương đương nối tiếp trở tương đương.' },
  { id: 'q3', question: 'Nguyên lý chồng chập áp dụng cho mạch?', options: ['Phi tuyến bất kỳ', 'Tuyến tính, nhiều nguồn — cộng đáp ứng từng nguồn', 'Chỉ mạch một nguồn', 'Chỉ mạch xoay chiều'], correctIndex: 1, explanation: 'Chồng chập chỉ đúng với mạch tuyến tính; cộng đáp ứng của từng nguồn riêng lẻ.' },
]);

const c3 = doc('elc201-3-1-reactive', '3.1 — Reactive components & transients|||3.1 — Linh kiện phản ứng & quá độ',
  'Tụ (nạp/xả, chặn DC) và cuộn cảm (chống đổi dòng); mạch RC/RL và hằng số thời gian τ; đáp ứng quá độ, mạch RLC cộng hưởng.',
  [[
    `<span class="eyebrow">ELC201 · Chapter 3 · Lesson 3.1</span>
<h2>Reactive components &amp; transients</h2>
<h3>Capacitor and inductor</h3>
<ul>
<li><strong>Capacitor (C)</strong> — stores energy in an electric field; <code>i = C·dv/dt</code>. Voltage cannot jump instantly. Blocks DC, passes AC; impedance <code>Z_C = 1/(jωC)</code> falls with frequency.</li>
<li><strong>Inductor (L)</strong> — stores energy in a magnetic field; <code>v = L·di/dt</code>. Current cannot jump instantly. Impedance <code>Z_L = jωL</code> rises with frequency.</li>
</ul>
<h3>Transient response</h3>
<p>An RC circuit charges/discharges exponentially with <strong>time constant τ = R·C</strong>; an RL circuit with <strong>τ = L/R</strong>. After ~5τ the circuit has essentially settled.</p>
<pre><code>RC charging from a step V:
  v_C(t) = V × (1 − e^(−t/τ)),  τ = R·C
  R = 10 kΩ, C = 10 µF -> τ = 0.1 s
  at t = τ: v_C ≈ 0.63 × V   (63 %)
RLC: resonates near ω0 = 1/√(L·C)
</code></pre>
<div class="callout"><span class="badge">Frequency shapes behavior</span> Because C and L impedances depend on ω, R/L/C networks form <strong>filters</strong> (low-pass, high-pass, band-pass) — the basis of tuning and signal conditioning.</div>`,
    `<span class="eyebrow">ELC201 · Chương 3 · Bài 3.1</span>
<h2>Linh kiện phản ứng &amp; quá độ</h2>
<h3>Tụ điện và cuộn cảm</h3>
<ul>
<li><strong>Tụ điện (C)</strong> — trữ năng lượng trong điện trường; <code>i = C·dv/dt</code>. Điện áp không nhảy tức thời. Chặn DC, cho AC qua; trở kháng <code>Z_C = 1/(jωC)</code> giảm theo tần số.</li>
<li><strong>Cuộn cảm (L)</strong> — trữ năng lượng trong từ trường; <code>v = L·di/dt</code>. Dòng điện không nhảy tức thời. Trở kháng <code>Z_L = jωL</code> tăng theo tần số.</li>
</ul>
<h3>Đáp ứng quá độ</h3>
<p>Mạch RC nạp/xả theo hàm mũ với <strong>hằng số thời gian τ = R·C</strong>; mạch RL với <strong>τ = L/R</strong>. Sau khoảng 5τ mạch coi như đã ổn định.</p>
<pre><code>RC nạp từ bậc V:
  v_C(t) = V × (1 − e^(−t/τ)),  τ = R·C
  R = 10 kΩ, C = 10 µF -> τ = 0.1 s
  tại t = τ: v_C ≈ 0.63 × V   (63 %)
RLC: cộng hưởng quanh ω0 = 1/√(L·C)
</code></pre>
<div class="callout"><span class="badge">Tần số định hình hành vi</span> Vì trở kháng C và L phụ thuộc ω, mạng R/L/C tạo thành <strong>bộ lọc</strong> (thông thấp, thông cao, thông dải) — nền của việc chỉnh tần và điều hòa tín hiệu.</div>`,
  ]]);

const c3q = quiz('elc201-quiz-3', 'Quiz 3 — Reactive & transients|||Quiz 3 — Phản ứng & quá độ', [
  { id: 'q1', question: 'Hằng số thời gian của mạch RC là?', options: ['τ = R / C', 'τ = R × C', 'τ = L / R', 'τ = 1 / (RC)'], correctIndex: 1, explanation: 'Mạch RC: τ = R·C; sau ~5τ mạch coi như ổn định.' },
  { id: 'q2', question: 'Trở kháng của tụ điện Z_C khi tần số tăng thì?', options: ['Tăng', 'Giảm (Z_C = 1/(jωC))', 'Không đổi', 'Bằng 0 luôn'], correctIndex: 1, explanation: 'Z_C = 1/(ωC) giảm khi ω tăng — tụ "cho AC cao tần qua".' },
  { id: 'q3', question: 'Đại lượng nào KHÔNG thể thay đổi tức thời trong cuộn cảm?', options: ['Điện áp', 'Dòng điện', 'Điện trở', 'Công suất'], correctIndex: 1, explanation: 'v = L·di/dt: dòng qua cuộn cảm biến thiên liên tục, không nhảy bậc.' },
]);

const c4 = doc('elc201-4-1-diodes', '4.1 — Diodes in circuits|||4.1 — Diode trong mạch',
  'Chỉnh lưu nửa kỳ/toàn kỳ (cầu), lọc bằng tụ (gợn ripple), ổn áp Zener; mạch cắt (clipper) và ghim (clamper).',
  [[
    `<span class="eyebrow">ELC201 · Chapter 4 · Lesson 4.1</span>
<h2>Diodes in circuits</h2>
<h3>Rectification</h3>
<p>A diode conducts one way only (forward drop ≈ 0.7 V for silicon). A <strong>half-wave</strong> rectifier passes one half of the AC wave; a <strong>full-wave bridge</strong> (4 diodes) uses both halves, doubling the output frequency and easing filtering.</p>
<h3>Filtering &amp; regulation</h3>
<p>A reservoir <strong>capacitor</strong> smooths the pulsing DC; leftover <strong>ripple</strong> shrinks as C (and load resistance) grow. A reverse-biased <strong>Zener diode</strong> clamps its terminal voltage to V_Z, giving a simple voltage <strong>regulator</strong>.</p>
<h3>Clippers &amp; clampers</h3>
<p><strong>Clippers</strong> cut a waveform above/below a level; <strong>clampers</strong> shift its DC level using a capacitor + diode.</p>
<pre><code>Bridge rectifier + cap filter:
  V_peak ≈ V_rms × √2 − 2 × 0.7 V   (two diode drops)
  Ripple: V_r ≈ I_load / (f × C),  f = 2 × f_line (full-wave)
  Zener reg: V_out = V_Z while I_Z within rating
</code></pre>
<div class="callout"><span class="badge">First block of a supply</span> Rectify -> filter -> regulate is the front end of almost every DC power supply; the Zener is the simplest regulator.</div>`,
    `<span class="eyebrow">ELC201 · Chương 4 · Bài 4.1</span>
<h2>Diode trong mạch</h2>
<h3>Chỉnh lưu</h3>
<p>Diode chỉ dẫn một chiều (sụt áp thuận ≈ 0.7 V với silic). Chỉnh lưu <strong>nửa kỳ</strong> cho qua một nửa sóng AC; <strong>cầu toàn kỳ</strong> (4 diode) dùng cả hai nửa, nhân đôi tần số ngõ ra và dễ lọc hơn.</p>
<h3>Lọc &amp; ổn áp</h3>
<p><strong>Tụ</strong> chứa làm phẳng DC nhấp nhô; <strong>gợn (ripple)</strong> còn lại giảm khi C (và trở tải) tăng. Diode <strong>Zener</strong> phân cực ngược ghim điện áp tại V_Z, cho một mạch <strong>ổn áp</strong> đơn giản.</p>
<h3>Mạch cắt &amp; ghim</h3>
<p><strong>Mạch cắt (clipper)</strong> cắt phần sóng trên/dưới một mức; <strong>mạch ghim (clamper)</strong> dịch mức DC của sóng bằng tụ + diode.</p>
<pre><code>Chỉnh lưu cầu + lọc tụ:
  V_đỉnh ≈ V_rms × √2 − 2 × 0.7 V   (hai lần sụt diode)
  Gợn: V_r ≈ I_tải / (f × C),  f = 2 × f_lưới (toàn kỳ)
  Ổn áp Zener: V_out = V_Z khi I_Z trong định mức
</code></pre>
<div class="callout"><span class="badge">Khối đầu của bộ nguồn</span> Chỉnh lưu -> lọc -> ổn áp là tầng đầu của gần như mọi bộ nguồn DC; Zener là bộ ổn áp đơn giản nhất.</div>`,
  ]]);

const c4q = quiz('elc201-quiz-4', 'Quiz 4 — Diodes|||Quiz 4 — Diode', [
  { id: 'q1', question: 'Chỉnh lưu cầu toàn kỳ dùng bao nhiêu diode?', options: ['1', '2', '4', '6'], correctIndex: 2, explanation: 'Cầu toàn kỳ dùng 4 diode, khai thác cả hai nửa sóng AC.' },
  { id: 'q2', question: 'Diode Zener phân cực ngược dùng để?', options: ['Khuếch đại tín hiệu', 'Ổn áp — ghim điện áp tại V_Z', 'Tạo dao động', 'Chặn AC'], correctIndex: 1, explanation: 'Zener giữ điện áp đầu cực ở V_Z, cho ổn áp đơn giản.' },
  { id: 'q3', question: 'Sau chỉnh lưu, tụ lọc lớn hơn sẽ làm gợn (ripple)?', options: ['Tăng', 'Giảm', 'Không đổi', 'Đảo pha'], correctIndex: 1, explanation: 'V_r ≈ I_tải/(f·C): C càng lớn, gợn càng nhỏ.' },
]);

const c5 = doc('elc201-5-1-bjt-amp', '5.1 — BJT amplifiers|||5.1 — Transistor BJT khuếch đại',
  'Phân cực BJT (điểm làm việc Q), mô hình tín hiệu nhỏ (gm, rπ); các cấu hình CE/CC/CB và độ lợi áp, trở kháng vào/ra.',
  [[
    `<span class="eyebrow">ELC201 · Chapter 5 · Lesson 5.1</span>
<h2>BJT amplifiers</h2>
<h3>Biasing &amp; the Q-point</h3>
<p>To amplify, a BJT must sit in its <strong>active region</strong>. A bias network sets the DC operating point (Q-point): <code>I_C ≈ β × I_B</code>. Good bias keeps I_C stable against β spread and temperature (voltage-divider bias with an emitter resistor is the classic choice).</p>
<h3>Small-signal model</h3>
<p>Around the Q-point the transistor is linearized: <strong>transconductance</strong> <code>gm = I_C / V_T</code> (V_T ≈ 26 mV) and <code>rπ = β / gm</code>. Voltage gain of a common-emitter stage is <code>Av ≈ −gm × R_C</code>.</p>
<h3>Three configurations</h3>
<ul>
<li><strong>Common-emitter (CE)</strong> — high voltage gain, inverting; the workhorse gain stage.</li>
<li><strong>Common-collector (CC / emitter-follower)</strong> — gain ≈ 1, high input / low output impedance; a buffer.</li>
<li><strong>Common-base (CB)</strong> — high frequency response, current gain ≈ 1.</li>
</ul>
<pre><code>CE stage: I_C = 1 mA, R_C = 5 kΩ
  gm = I_C/V_T = 1mA/26mV ≈ 38.5 mS
  Av = −gm·R_C ≈ −38.5m × 5k ≈ −192  (inverting)
</code></pre>
<div class="callout"><span class="badge">Bias then linearize</span> Every amplifier problem is two steps: solve the DC bias (Q-point), then analyze the small AC signal around it.</div>`,
    `<span class="eyebrow">ELC201 · Chương 5 · Bài 5.1</span>
<h2>Transistor BJT khuếch đại</h2>
<h3>Phân cực &amp; điểm Q</h3>
<p>Để khuếch đại, BJT phải nằm ở <strong>vùng tích cực</strong>. Mạng phân cực đặt điểm làm việc DC (điểm Q): <code>I_C ≈ β × I_B</code>. Phân cực tốt giữ I_C ổn định trước tản mát β và nhiệt độ (phân cực chia áp kèm điện trở emitter là lựa chọn kinh điển).</p>
<h3>Mô hình tín hiệu nhỏ</h3>
<p>Quanh điểm Q, transistor được tuyến tính hóa: <strong>hỗ dẫn</strong> <code>gm = I_C / V_T</code> (V_T ≈ 26 mV) và <code>rπ = β / gm</code>. Độ lợi áp của tầng emitter chung là <code>Av ≈ −gm × R_C</code>.</p>
<h3>Ba cấu hình</h3>
<ul>
<li><strong>Emitter chung (CE)</strong> — độ lợi áp cao, đảo pha; tầng khuếch đại chủ lực.</li>
<li><strong>Collector chung (CC / theo emitter)</strong> — độ lợi ≈ 1, trở vào cao / trở ra thấp; một bộ đệm.</li>
<li><strong>Base chung (CB)</strong> — đáp ứng tần số cao, độ lợi dòng ≈ 1.</li>
</ul>
<pre><code>Tầng CE: I_C = 1 mA, R_C = 5 kΩ
  gm = I_C/V_T = 1mA/26mV ≈ 38.5 mS
  Av = −gm·R_C ≈ −38.5m × 5k ≈ −192  (đảo pha)
</code></pre>
<div class="callout"><span class="badge">Phân cực rồi tuyến tính hóa</span> Mọi bài khuếch đại đều gồm hai bước: giải phân cực DC (điểm Q), rồi phân tích tín hiệu AC nhỏ quanh nó.</div>`,
  ]]);

const c5q = quiz('elc201-quiz-5', 'Quiz 5 — BJT amplifiers|||Quiz 5 — BJT khuếch đại', [
  { id: 'q1', question: 'Để khuếch đại tuyến tính, BJT phải làm việc ở vùng?', options: ['Cut-off (tắt)', 'Active (tích cực)', 'Saturation (bão hòa)', 'Đánh thủng'], correctIndex: 1, explanation: 'Vùng tích cực cho I_C ≈ β·I_B — điều kiện khuếch đại.' },
  { id: 'q2', question: 'Hỗ dẫn gm của BJT tính xấp xỉ bằng?', options: ['gm = V_T / I_C', 'gm = I_C / V_T', 'gm = β × R_C', 'gm = 1 / R_C'], correctIndex: 1, explanation: 'gm = I_C/V_T với V_T ≈ 26 mV ở nhiệt độ phòng.' },
  { id: 'q3', question: 'Cấu hình nào cho độ lợi áp ≈ 1 và dùng làm bộ đệm?', options: ['Emitter chung (CE)', 'Collector chung (CC / theo emitter)', 'Base chung (CB)', 'Không cấu hình nào'], correctIndex: 1, explanation: 'CC (emitter follower): gain ≈ 1, trở vào cao, trở ra thấp — bộ đệm.' },
]);

const c6 = doc('elc201-6-1-mosfet-amp', '6.1 — MOSFET amplifiers|||6.1 — MOSFET khuếch đại',
  'Phân cực MOSFET (vùng bão hòa), mô hình tín hiệu nhỏ (gm), tầng common-source; so sánh MOSFET với BJT (trở vào, tiêu thụ, tích hợp).',
  [[
    `<span class="eyebrow">ELC201 · Chapter 6 · Lesson 6.1</span>
<h2>MOSFET amplifiers</h2>
<h3>Operation &amp; biasing</h3>
<p>A MOSFET is voltage-controlled: the gate voltage above threshold V_T sets the drain current. For amplification it works in <strong>saturation</strong>: <code>I_D ≈ ½ k (V_GS − V_T)²</code>. The gate draws essentially no DC current, so input impedance is extremely high.</p>
<h3>Small-signal &amp; common-source</h3>
<p>Transconductance <code>gm = k (V_GS − V_T) = 2·I_D/(V_GS − V_T)</code>. The <strong>common-source</strong> stage is the MOSFET analog of common-emitter: gain <code>Av ≈ −gm × R_D</code>, inverting.</p>
<h3>MOSFET vs BJT</h3>
<ul>
<li>MOSFET: near-infinite DC input impedance, tiny static gate power, dense to integrate — the device of CMOS VLSI.</li>
<li>BJT: higher gm at a given current, better matching for precision analog.</li>
</ul>
<pre><code>Common-source: I_D = 1 mA, (V_GS − V_T) = 0.5 V, R_D = 5 kΩ
  gm = 2·I_D/(V_GS − V_T) = 2mA/0.5 = 4 mS
  Av = −gm·R_D = −4m × 5k = −20  (inverting)
</code></pre>
<div class="callout"><span class="badge">Why MOSFETs rule chips</span> High input impedance, low static power and easy scaling make the MOSFET the transistor of CMOS — the fabric of modern IC design.</div>`,
    `<span class="eyebrow">ELC201 · Chương 6 · Bài 6.1</span>
<h2>MOSFET khuếch đại</h2>
<h3>Hoạt động &amp; phân cực</h3>
<p>MOSFET điều khiển bằng điện áp: áp cực cổng vượt ngưỡng V_T quyết định dòng máng. Để khuếch đại nó làm việc ở <strong>vùng bão hòa</strong>: <code>I_D ≈ ½ k (V_GS − V_T)²</code>. Cực cổng gần như không hút dòng DC, nên trở kháng vào cực cao.</p>
<h3>Tín hiệu nhỏ &amp; common-source</h3>
<p>Hỗ dẫn <code>gm = k (V_GS − V_T) = 2·I_D/(V_GS − V_T)</code>. Tầng <strong>common-source</strong> (nguồn chung) là bản MOSFET của emitter chung: độ lợi <code>Av ≈ −gm × R_D</code>, đảo pha.</p>
<h3>MOSFET so với BJT</h3>
<ul>
<li>MOSFET: trở kháng vào DC gần vô hạn, công suất cổng tĩnh cực nhỏ, dễ tích hợp dày đặc — linh kiện của CMOS VLSI.</li>
<li>BJT: gm cao hơn tại cùng dòng, phối hợp tốt hơn cho analog chính xác.</li>
</ul>
<pre><code>Common-source: I_D = 1 mA, (V_GS − V_T) = 0.5 V, R_D = 5 kΩ
  gm = 2·I_D/(V_GS − V_T) = 2mA/0.5 = 4 mS
  Av = −gm·R_D = −4m × 5k = −20  (đảo pha)
</code></pre>
<div class="callout"><span class="badge">Vì sao MOSFET thống trị chip</span> Trở kháng vào cao, công suất tĩnh thấp và dễ thu nhỏ khiến MOSFET là transistor của CMOS — chất liệu của thiết kế IC hiện đại.</div>`,
  ]]);

const c6q = quiz('elc201-quiz-6', 'Quiz 6 — MOSFET amplifiers|||Quiz 6 — MOSFET khuếch đại', [
  { id: 'q1', question: 'MOSFET khuếch đại tuyến tính khi làm việc ở vùng?', options: ['Ngắt (cut-off)', 'Bão hòa (saturation)', 'Vùng triode/tuyến tính (ohmic)', 'Đánh thủng'], correctIndex: 1, explanation: 'Vùng bão hòa: I_D ≈ ½k(V_GS − V_T)² — dùng để khuếch đại.' },
  { id: 'q2', question: 'So với BJT, ưu điểm nổi bật của MOSFET là?', options: ['gm luôn cao hơn', 'Trở kháng vào DC rất cao, công suất cổng tĩnh nhỏ', 'Sụt áp thuận 0.7 V', 'Không cần phân cực'], correctIndex: 1, explanation: 'Cổng cách điện gần như không hút dòng DC → trở vào cực cao, lý tưởng cho CMOS.' },
  { id: 'q3', question: 'Tầng common-source có độ lợi áp xấp xỉ?', options: ['Av ≈ +1', 'Av ≈ −gm × R_D (đảo pha)', 'Av ≈ gm / R_D', 'Av = 0'], correctIndex: 1, explanation: 'Common-source giống CE: Av ≈ −gm·R_D, đảo pha.' },
]);

const c7 = doc('elc201-7-1-opamp', '7.1 — Operational amplifiers|||7.1 — Khuếch đại thuật toán (Op-Amp)',
  'Op-amp lý tưởng và quy tắc "hai đầu vào bằng nhau, không hút dòng"; mạch đảo/không đảo; cộng/trừ; tích phân/vi phân.',
  [[
    `<span class="eyebrow">ELC201 · Chapter 7 · Lesson 7.1</span>
<h2>Operational amplifiers</h2>
<h3>The ideal op-amp</h3>
<p>An ideal op-amp has infinite open-loop gain, infinite input impedance and zero output impedance. With <strong>negative feedback</strong>, two golden rules follow: <strong>(1)</strong> no current flows into the inputs; <strong>(2)</strong> the two inputs are at the same voltage (a "virtual short").</p>
<h3>Core configurations</h3>
<ul>
<li><strong>Inverting:</strong> <code>Av = −Rf / Rin</code>.</li>
<li><strong>Non-inverting:</strong> <code>Av = 1 + Rf / Rin</code>.</li>
<li><strong>Summing / difference:</strong> add or subtract weighted inputs.</li>
<li><strong>Integrator / differentiator:</strong> a capacitor in the feedback or input path gives <code>V_out = −(1/RC)∫V_in dt</code> or <code>−RC·dV_in/dt</code>.</li>
</ul>
<pre><code>Inverting amp: Rin = 10 kΩ, Rf = 100 kΩ
  Av = −Rf/Rin = −10  (V_in 0.2 V -> V_out = −2 V)
Non-inverting: same Rs -> Av = 1 + 100k/10k = 11
</code></pre>
<div class="callout"><span class="badge">Two rules solve most op-amp circuits</span> "No input current" + "virtual short" plus KCL at the inverting node derive every gain formula above.</div>`,
    `<span class="eyebrow">ELC201 · Chương 7 · Bài 7.1</span>
<h2>Khuếch đại thuật toán (Op-Amp)</h2>
<h3>Op-amp lý tưởng</h3>
<p>Op-amp lý tưởng có độ lợi vòng hở vô hạn, trở kháng vào vô hạn và trở kháng ra bằng 0. Với <strong>hồi tiếp âm</strong>, hai quy tắc vàng suy ra: <strong>(1)</strong> không dòng chảy vào các đầu vào; <strong>(2)</strong> hai đầu vào cùng điện áp ("nối tắt ảo").</p>
<h3>Các cấu hình cốt lõi</h3>
<ul>
<li><strong>Đảo:</strong> <code>Av = −Rf / Rin</code>.</li>
<li><strong>Không đảo:</strong> <code>Av = 1 + Rf / Rin</code>.</li>
<li><strong>Cộng / trừ:</strong> cộng hoặc trừ các ngõ vào có trọng số.</li>
<li><strong>Tích phân / vi phân:</strong> tụ ở nhánh hồi tiếp hoặc ngõ vào cho <code>V_out = −(1/RC)∫V_in dt</code> hoặc <code>−RC·dV_in/dt</code>.</li>
</ul>
<pre><code>Mạch đảo: Rin = 10 kΩ, Rf = 100 kΩ
  Av = −Rf/Rin = −10  (V_in 0.2 V -> V_out = −2 V)
Không đảo: cùng R -> Av = 1 + 100k/10k = 11
</code></pre>
<div class="callout"><span class="badge">Hai quy tắc giải hầu hết mạch op-amp</span> "Không dòng vào" + "nối tắt ảo" cộng KCL tại nút đảo suy ra mọi công thức độ lợi ở trên.</div>`,
  ]]);

const c7q = quiz('elc201-quiz-7', 'Quiz 7 — Op-Amp|||Quiz 7 — Op-Amp', [
  { id: 'q1', question: 'Độ lợi mạch khuếch đại KHÔNG đảo (non-inverting) là?', options: ['Av = −Rf/Rin', 'Av = 1 + Rf/Rin', 'Av = Rin/Rf', 'Av = 1'], correctIndex: 1, explanation: 'Không đảo: Av = 1 + Rf/Rin, đồng pha.' },
  { id: 'q2', question: 'Khái niệm "nối tắt ảo" ở op-amp hồi tiếp âm nghĩa là?', options: ['Hai đầu vào nối đất', 'Hai đầu vào có cùng điện áp', 'Ngõ ra nối vào đất', 'Op-amp bị hỏng'], correctIndex: 1, explanation: 'Độ lợi vô hạn + hồi tiếp âm ép V+ = V−: "nối tắt ảo".' },
  { id: 'q3', question: 'Đặt tụ ở nhánh hồi tiếp của op-amp tạo ra mạch?', options: ['Cộng', 'Tích phân (integrator)', 'So sánh', 'Chỉnh lưu'], correctIndex: 1, explanation: 'Tụ hồi tiếp cho V_out = −(1/RC)∫V_in dt — mạch tích phân.' },
]);

const c8 = doc('elc201-8-1-digital-applications', '8.1 — Digital circuits & applications|||8.1 — Mạch số & ứng dụng',
  'Cổng logic từ transistor (CMOS inverter, NAND/NOR), mạch dao động (tạo xung nhịp), bộ nguồn hoàn chỉnh, và mô phỏng SPICE để kiểm chứng thiết kế.',
  [[
    `<span class="eyebrow">ELC201 · Chapter 8 · Lesson 8.1</span>
<h2>Digital circuits &amp; applications</h2>
<h3>Logic gates from transistors</h3>
<p>Digital logic is transistors used as switches. A <strong>CMOS inverter</strong> pairs a PMOS pull-up with an NMOS pull-down: only one conducts at a time, so static power is near zero. NAND and NOR gates extend the same idea — the whole digital world is built from these.</p>
<h3>Oscillators &amp; supplies</h3>
<p>An <strong>oscillator</strong> generates a periodic waveform from DC using feedback plus a frequency network (RC, LC or crystal) — the clock of every system. A complete <strong>power supply</strong> chains rectify -> filter -> regulate (Ch4) to feed the circuit.</p>
<h3>SPICE simulation</h3>
<p><strong>SPICE</strong> (and tools like LTspice, Falstad, Multisim) solve the circuit equations numerically, letting you sweep DC, plot transient waveforms and run AC/frequency response before building hardware.</p>
<pre><code>CMOS inverter:  V_in LOW  -> PMOS on,  NMOS off -> V_out HIGH
                V_in HIGH -> PMOS off, NMOS on  -> V_out LOW
  Static current ≈ 0 (only switching draws power)
SPICE: .tran for waveforms, .ac for frequency response
</code></pre>
<div class="callout"><span class="badge">Simulate before you build</span> Verify DC operating points, timing and frequency response in SPICE first — it is the standard flow of IC design.</div>`,
    `<span class="eyebrow">ELC201 · Chương 8 · Bài 8.1</span>
<h2>Mạch số &amp; ứng dụng</h2>
<h3>Cổng logic từ transistor</h3>
<p>Logic số là transistor dùng làm công tắc. <strong>Cổng đảo CMOS</strong> ghép một PMOS kéo lên với một NMOS kéo xuống: mỗi lúc chỉ một con dẫn, nên công suất tĩnh gần bằng 0. Cổng NAND và NOR mở rộng cùng ý tưởng — cả thế giới số dựng nên từ chúng.</p>
<h3>Dao động &amp; bộ nguồn</h3>
<p>Một <strong>mạch dao động</strong> sinh dạng sóng tuần hoàn từ DC nhờ hồi tiếp cộng mạng định tần (RC, LC hoặc thạch anh) — xung nhịp của mọi hệ thống. Một <strong>bộ nguồn</strong> hoàn chỉnh nối chuỗi chỉnh lưu -> lọc -> ổn áp (Ch4) để nuôi mạch.</p>
<h3>Mô phỏng SPICE</h3>
<p><strong>SPICE</strong> (và các công cụ như LTspice, Falstad, Multisim) giải hệ phương trình mạch bằng số, cho phép quét DC, vẽ dạng sóng quá độ và chạy đáp ứng AC/tần số trước khi làm phần cứng.</p>
<pre><code>Cổng đảo CMOS:  V_in THẤP -> PMOS dẫn,  NMOS tắt -> V_out CAO
                V_in CAO  -> PMOS tắt,  NMOS dẫn -> V_out THẤP
  Dòng tĩnh ≈ 0 (chỉ tốn điện lúc chuyển mức)
SPICE: .tran cho dạng sóng, .ac cho đáp ứng tần số
</code></pre>
<div class="callout"><span class="badge">Mô phỏng trước khi làm</span> Kiểm điểm làm việc DC, định thời và đáp ứng tần số trong SPICE trước — đây là quy trình chuẩn của thiết kế IC.</div>`,
  ]]);

const c8q = quiz('elc201-quiz-8', 'Quiz 8 — Digital & applications|||Quiz 8 — Mạch số & ứng dụng', [
  { id: 'q1', question: 'Cổng đảo CMOS có công suất TĨNH gần bằng 0 vì?', options: ['Không có transistor nào', 'Mỗi lúc chỉ một transistor (PMOS hoặc NMOS) dẫn', 'Cả hai luôn dẫn', 'Dùng điện trở kéo lớn'], correctIndex: 1, explanation: 'CMOS: PMOS và NMOS không cùng dẫn ở trạng thái ổn định → hầu như chỉ tốn điện khi chuyển mức.' },
  { id: 'q2', question: 'Mạch tạo dạng sóng tuần hoàn từ nguồn DC (không cần tín hiệu vào) là?', options: ['Bộ chỉnh lưu', 'Mạch dao động (oscillator)', 'Bộ chia áp', 'Bộ lọc thụ động'], correctIndex: 1, explanation: 'Oscillator dùng hồi tiếp + mạng định tần để tự sinh sóng — xung nhịp của hệ thống.' },
  { id: 'q3', question: 'Trong SPICE, lệnh phân tích quá độ (vẽ dạng sóng theo thời gian) là?', options: ['.ac', '.tran', '.op', '.dc'], correctIndex: 1, explanation: '.tran cho đáp ứng quá độ theo thời gian; .ac cho đáp ứng tần số.' },
]);

const taiLieu = doc('elc201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Sedra & Smith, Boylestad, Razavi), tài liệu miễn phí, YouTube, công cụ mô phỏng, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">ELC201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Electronic Circuits — fundamentals, analysis, R/L/C, diodes, BJT &amp; MOSFET amplifiers, op-amps and digital circuits — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ELC201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Microelectronic_Circuits" target="_blank" rel="noopener">Sedra &amp; Smith — <em>Microelectronic Circuits</em></a></li>
<li><a href="https://en.wikipedia.org/wiki/Robert_Boylestad" target="_blank" rel="noopener">Boylestad &amp; Nashelsky — <em>Electronic Devices and Circuit Theory</em></a></li>
<li><a href="https://en.wikipedia.org/wiki/Behzad_Razavi" target="_blank" rel="noopener">Razavi — <em>Fundamentals of Microelectronics</em></a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.allaboutcircuits.com/" target="_blank" rel="noopener">All About Circuits — textbook &amp; tutorials</a></li>
<li><a href="https://www.electronics-tutorials.ws/" target="_blank" rel="noopener">Electronics Tutorials (electronics-tutorials.ws)</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@ElectroBOOM" target="_blank" rel="noopener">ElectroBOOM</a> — electronics explained (with sparks)</li>
<li><a href="https://www.youtube.com/@RazaviElectronics" target="_blank" rel="noopener">Razavi Electronics</a> — university microelectronics lectures</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.falstad.com/circuit/" target="_blank" rel="noopener">Falstad Circuit Simulator</a> — animated circuit sim in the browser</li>
<li><a href="https://www.analog.com/en/resources/design-tools-and-calculators/ltspice-simulator.html" target="_blank" rel="noopener">LTspice</a> — free SPICE simulator (Analog Devices)</li>
<li><a href="https://www.multisim.com/" target="_blank" rel="noopener">Multisim Live</a> — online SPICE circuit simulation</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundations</strong> — Ohm &amp; Kirchhoff, dividers, Thevenin/Norton, superposition.</li>
<li><strong>Dynamics</strong> — R/L/C, RC/RL/RLC transients and simple filters; simulate on Falstad.</li>
<li><strong>Devices</strong> — diodes (rectify/regulate), BJT &amp; MOSFET amplifiers, op-amps.</li>
<li><strong>Systems / job-ready</strong> — digital gates, oscillators, supplies; verify everything in SPICE.</li>
</ol></div>`,
    `<span class="eyebrow">ELC201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Mạch điện tử — cơ bản, phân tích, R/L/C, diode, khuếch đại BJT &amp; MOSFET, op-amp và mạch số — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ELC201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Microelectronic_Circuits" target="_blank" rel="noopener">Sedra &amp; Smith — <em>Microelectronic Circuits</em></a></li>
<li><a href="https://en.wikipedia.org/wiki/Robert_Boylestad" target="_blank" rel="noopener">Boylestad &amp; Nashelsky — <em>Electronic Devices and Circuit Theory</em></a></li>
<li><a href="https://en.wikipedia.org/wiki/Behzad_Razavi" target="_blank" rel="noopener">Razavi — <em>Fundamentals of Microelectronics</em></a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.allaboutcircuits.com/" target="_blank" rel="noopener">All About Circuits — giáo trình &amp; hướng dẫn</a></li>
<li><a href="https://www.electronics-tutorials.ws/" target="_blank" rel="noopener">Electronics Tutorials (electronics-tutorials.ws)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ElectroBOOM" target="_blank" rel="noopener">ElectroBOOM</a> — điện tử giảng vui (kèm tia lửa)</li>
<li><a href="https://www.youtube.com/@RazaviElectronics" target="_blank" rel="noopener">Razavi Electronics</a> — bài giảng vi điện tử bậc đại học</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.falstad.com/circuit/" target="_blank" rel="noopener">Falstad Circuit Simulator</a> — mô phỏng mạch động trên trình duyệt</li>
<li><a href="https://www.analog.com/en/resources/design-tools-and-calculators/ltspice-simulator.html" target="_blank" rel="noopener">LTspice</a> — trình mô phỏng SPICE miễn phí (Analog Devices)</li>
<li><a href="https://www.multisim.com/" target="_blank" rel="noopener">Multisim Live</a> — mô phỏng mạch SPICE trực tuyến</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — Ohm &amp; Kirchhoff, chia áp, Thevenin/Norton, chồng chập.</li>
<li><strong>Động học</strong> — R/L/C, quá độ RC/RL/RLC và bộ lọc đơn giản; mô phỏng trên Falstad.</li>
<li><strong>Linh kiện</strong> — diode (chỉnh lưu/ổn áp), khuếch đại BJT &amp; MOSFET, op-amp.</li>
<li><strong>Hệ thống / sẵn sàng đi làm</strong> — cổng số, dao động, bộ nguồn; kiểm mọi thứ trong SPICE.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'ELC201',
    slug: 'elc201-electronic-circuits',
    title: 'Electronic Circuits',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ELC201.webp',
    shortDescription: 'Electronic circuits from first principles — Ohm & Kirchhoff, circuit analysis (Thevenin/Norton), R/L/C transients, diodes (rectifiers, Zener), BJT & MOSFET amplifiers, op-amps and digital/SPICE circuits. Bilingual, with worked examples & quizzes.|||Mạch điện tử từ gốc — Ohm & Kirchhoff, phân tích mạch (Thevenin/Norton), quá độ R/L/C, diode (chỉnh lưu, Zener), khuếch đại BJT & MOSFET, op-amp và mạch số/SPICE. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>ELC201 — Electronic Circuits</strong> (kỳ 2, ngành Thiết kế vi mạch bán dẫn) dựng nền analog cấp transistor. Từ <strong>cơ bản mạch &amp; phân tích</strong> (Ohm, Kirchhoff, chia áp, Thevenin/Norton, chồng chập) → <strong>linh kiện phản ứng</strong> (R/L/C, quá độ) → <strong>diode</strong> (chỉnh lưu, Zener, cắt/ghim) → <strong>transistor BJT &amp; MOSFET khuếch đại</strong> → <strong>op-amp</strong> → <strong>mạch số, dao động, nguồn &amp; SPICE</strong>. Bám giáo trình chuẩn (Sedra &amp; Smith, Boylestad, Razavi), song ngữ, có công thức, ví dụ mạch và quiz mỗi chương.',
    whatYouLearn: 'Ohm &amp; Kirchhoff (KVL/KCL), công suất; chia áp/dòng, Thevenin/Norton, chồng chập; tụ/cuộn cảm, RC/RL/RLC &amp; hằng số thời gian τ; diode &amp; chỉnh lưu (cầu), lọc tụ, ổn áp Zener, clipper/clamper; BJT (phân cực, gm, CE/CC/CB, độ lợi); MOSFET (bão hòa, common-source, so với BJT); op-amp (đảo/không đảo, cộng/trừ, tích phân/vi phân); cổng CMOS, dao động, bộ nguồn; mô phỏng SPICE.',
    requirements: 'Toán/vật lý phổ thông (điện cơ bản), giải tích cơ bản. Nên cài LTspice hoặc dùng mô phỏng mạch trực tuyến (Falstad, Multisim Live).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, tài liệu miễn phí, YouTube, công cụ SPICE, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Mạch điện tử, đại lượng cơ bản, lộ trình 4 bước.', lessons: [intro] },
    { title: 'Chương 1 — Cơ bản mạch điện|||Chapter 1 — Circuit fundamentals', description: 'Ohm, KVL/KCL, công suất.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Phân tích mạch|||Chapter 2 — Circuit analysis', description: 'Chia áp/dòng, Thevenin/Norton, chồng chập.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thụ động & phản ứng|||Chapter 3 — Reactive & transients', description: 'Tụ, cuộn cảm, RC/RL/RLC, quá độ.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Diode trong mạch|||Chapter 4 — Diodes', description: 'Chỉnh lưu, lọc, Zener, cắt/ghim.', lessons: [c4, c4q] },
    { title: 'Chương 5 — BJT khuếch đại|||Chapter 5 — BJT amplifiers', description: 'Phân cực, tín hiệu nhỏ, CE/CC/CB.', lessons: [c5, c5q] },
    { title: 'Chương 6 — MOSFET khuếch đại|||Chapter 6 — MOSFET amplifiers', description: 'Bão hòa, common-source, so với BJT.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Op-Amp|||Chapter 7 — Operational amplifiers', description: 'Đảo/không đảo, cộng/trừ, tích phân/vi phân.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Mạch số & ứng dụng|||Chapter 8 — Digital & applications', description: 'Cổng CMOS, dao động, nguồn, SPICE.', lessons: [c8, c8q] },
  ],
};
