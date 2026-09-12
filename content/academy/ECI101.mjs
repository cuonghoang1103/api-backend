/**
 * ECI101 — Introduction to Electronic Components and Circuits. Giáo trình FLM
 * (syl): mạch analog cơ bản — linh kiện thụ động (R/L/C), diode, transistor,
 * khuếch đại, nguồn, dao động; mô phỏng Multisim. Song ngữ + ví dụ + bài tập.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('eci101-0-1-overview', 'Course overview: Electronic components & circuits|||Tổng quan: Linh kiện & mạch điện tử',
  'Điện tử làm gì; đại lượng cơ bản (áp/dòng/trở), định luật Ohm; lộ trình: linh kiện thụ động → diode → transistor & khuếch đại → nguồn & dao động (mô phỏng Multisim).',
  [[
    `<span class="eyebrow">ECI101 · Lesson 0.1 · Overview</span>
<h2>Electronic Components &amp; Circuits</h2>
<p class="lead">This course helps you understand <strong>how electronic circuits work</strong> — the underpinning knowledge behind amplifiers, logic circuits, power supplies and oscillators. You'll analyze and design basic <strong>analog</strong> circuits using passive components and active elements (diodes, transistors), and simulate them in <strong>Multisim</strong>.</p>
<h3>The three fundamentals</h3>
<ul>
<li><strong>Voltage (V)</strong> — the "push", measured in volts.</li>
<li><strong>Current (I)</strong> — the flow of charge, in amperes.</li>
<li><strong>Resistance (R)</strong> — opposition to flow, in ohms.</li>
</ul>
<p>They're tied together by <strong>Ohm's law: V = I × R</strong> — the single most important equation in electronics.</p>
<h3>Roadmap</h3>
<p>Passive components (resistor, capacitor, inductor) &amp; circuit laws → diodes (rectification) → transistors &amp; amplification → power supplies &amp; oscillators. Bilingual, with worked examples and Multisim simulations.</p>`,
    `<span class="eyebrow">ECI101 · Bài 0.1 · Tổng quan</span>
<h2>Linh kiện &amp; mạch điện tử</h2>
<p class="lead">Môn này giúp bạn hiểu <strong>mạch điện tử hoạt động thế nào</strong> — kiến thức nền sau các mạch khuếch đại, mạch logic, nguồn và dao động. Bạn phân tích và thiết kế mạch <strong>analog</strong> cơ bản dùng linh kiện thụ động và phần tử tích cực (diode, transistor), và mô phỏng bằng <strong>Multisim</strong>.</p>
<h3>Ba đại lượng nền tảng</h3>
<ul>
<li><strong>Điện áp (V)</strong> — "lực đẩy", đo bằng volt.</li>
<li><strong>Dòng điện (I)</strong> — dòng chảy của điện tích, đo bằng ampe.</li>
<li><strong>Điện trở (R)</strong> — cản trở dòng chảy, đo bằng ohm.</li>
</ul>
<p>Chúng gắn với nhau bởi <strong>định luật Ohm: V = I × R</strong> — phương trình quan trọng nhất trong điện tử.</p>
<h3>Lộ trình</h3>
<p>Linh kiện thụ động (điện trở, tụ, cuộn cảm) &amp; định luật mạch → diode (chỉnh lưu) → transistor &amp; khuếch đại → nguồn &amp; dao động. Song ngữ, có ví dụ mẫu và mô phỏng Multisim.</p>`,
  ]]);

const c1 = doc('eci101-1-1-passives', '1.1 — Passive components & circuit laws|||1.1 — Linh kiện thụ động & định luật mạch',
  'Điện trở (Ohm, nối tiếp/song song), tụ điện (tích/xả, chặn DC), cuộn cảm; định luật Kirchhoff (KVL/KCL).',
  [[
    `<span class="eyebrow">ECI101 · Chapter 1 · Lesson 1.1</span>
<h2>Passive components &amp; circuit laws</h2>
<h3>Resistor, capacitor, inductor</h3>
<ul>
<li><strong>Resistor (R)</strong> — limits current; <code>V = I·R</code>. In <strong>series</strong> resistances add (R = R1+R2); in <strong>parallel</strong> they combine as 1/R = 1/R1 + 1/R2.</li>
<li><strong>Capacitor (C)</strong> — stores charge in an electric field; blocks DC, passes AC; charges/discharges over time (RC time constant τ = R·C). Used for filtering and smoothing.</li>
<li><strong>Inductor (L)</strong> — stores energy in a magnetic field; opposes changes in current. Used in filters and power supplies.</li>
</ul>
<h3>Kirchhoff's laws</h3>
<ul>
<li><strong>KCL (current):</strong> the current flowing INTO a node equals the current flowing OUT — charge is conserved.</li>
<li><strong>KVL (voltage):</strong> around any loop, the voltage rises equal the voltage drops — energy is conserved.</li>
</ul>
<pre><code>Example (Ohm's law + series):
 12 V across R1=2kΩ + R2=4kΩ (series)
 I = V / (R1+R2) = 12 / 6000 = 2 mA
 V across R2 = I·R2 = 2mA · 4kΩ = 8 V   (voltage divider)
</code></pre>
<div class="callout"><span class="badge">Voltage divider</span> Two resistors in series split a voltage in proportion to their values — one of the most-used building blocks in analog design.</div>`,
    `<span class="eyebrow">ECI101 · Chương 1 · Bài 1.1</span>
<h2>Linh kiện thụ động &amp; định luật mạch</h2>
<h3>Điện trở, tụ điện, cuộn cảm</h3>
<ul>
<li><strong>Điện trở (R)</strong> — hạn dòng; <code>V = I·R</code>. <strong>Nối tiếp</strong> điện trở cộng lại (R = R1+R2); <strong>song song</strong> ghép theo 1/R = 1/R1 + 1/R2.</li>
<li><strong>Tụ điện (C)</strong> — tích điện trong điện trường; chặn DC, cho AC qua; nạp/xả theo thời gian (hằng số RC τ = R·C). Dùng để lọc và làm phẳng.</li>
<li><strong>Cuộn cảm (L)</strong> — trữ năng lượng trong từ trường; chống lại thay đổi dòng điện. Dùng trong bộ lọc và nguồn.</li>
</ul>
<h3>Định luật Kirchhoff</h3>
<ul>
<li><strong>KCL (dòng):</strong> dòng VÀO một nút bằng dòng RA — bảo toàn điện tích.</li>
<li><strong>KVL (áp):</strong> quanh một vòng, tổng áp tăng bằng tổng áp giảm — bảo toàn năng lượng.</li>
</ul>
<pre><code>Ví dụ (Ohm + nối tiếp):
 12 V trên R1=2kΩ + R2=4kΩ (nối tiếp)
 I = V / (R1+R2) = 12 / 6000 = 2 mA
 V trên R2 = I·R2 = 2mA · 4kΩ = 8 V   (bộ chia áp)
</code></pre>
<div class="callout"><span class="badge">Bộ chia áp</span> Hai điện trở nối tiếp chia điện áp theo tỉ lệ giá trị của chúng — một trong những khối được dùng nhiều nhất trong thiết kế analog.</div>`,
  ]]);

const c1q = quiz('eci101-quiz-1', 'Quiz 1 — Passives & laws|||Quiz 1 — Thụ động & định luật', [
  { id: 'q1', question: 'Định luật Ohm là?', options: ['V = I + R', 'V = I × R', 'V = I / R', 'V = I − R'], correctIndex: 1, explanation: 'V = I·R liên hệ áp, dòng, trở.' },
  { id: 'q2', question: 'Linh kiện chặn DC nhưng cho AC qua, dùng lọc/làm phẳng?', options: ['Điện trở', 'Tụ điện', 'Diode', 'Transistor'], correctIndex: 1, explanation: 'Tụ điện chặn DC, dẫn AC; nạp/xả theo RC.' },
  { id: 'q3', question: 'KCL (định luật dòng Kirchhoff) nói?', options: ['Áp quanh vòng bằng 0', 'Dòng VÀO nút = dòng RA nút', 'Trở nối tiếp cộng lại', 'Tụ trữ điện'], correctIndex: 1, explanation: 'KCL: bảo toàn điện tích tại mỗi nút.' },
]);

const c2 = doc('eci101-2-1-diode-transistor', '2.1 — Diodes & transistors|||2.1 — Diode & transistor',
  'Diode (cho dòng một chiều, chỉnh lưu AC→DC); transistor (BJT: khoá & khuếch đại), vùng hoạt động; ứng dụng.',
  [[
    `<span class="eyebrow">ECI101 · Chapter 2 · Lesson 2.1</span>
<h2>Diodes &amp; transistors</h2>
<h3>The diode — a one-way valve</h3>
<p>A <strong>diode</strong> conducts current in <em>one direction</em> only (forward), blocking the reverse. Its killer app is <strong>rectification</strong> — turning AC (alternating) into DC (one direction), the first step in almost every power supply. A <strong>full-bridge rectifier</strong> (4 diodes) uses both halves of the AC wave.</p>
<h3>The transistor — switch &amp; amplifier</h3>
<p>A <strong>transistor</strong> (e.g. a BJT with Base, Collector, Emitter) does two crucial jobs:</p>
<ul>
<li><strong>Switch</strong> — a small base current turns a large collector current fully on/off (this is how digital logic and MCUs drive loads).</li>
<li><strong>Amplifier</strong> — in its active region, a small input signal controls a proportionally larger output — the basis of audio amps, radios, sensors.</li>
</ul>
<pre><code>BJT regions:
  Cut-off    -> OFF   (no base current -> no collector current)
  Saturation -> ON    (fully conducting -> acts like a closed switch)
  Active     -> AMPLIFY (collector current ≈ β × base current)
</code></pre>
<div class="callout"><span class="badge">Why it changed the world</span> The transistor is the building block of every chip. One idea — "a small current controls a big one" — gives us both digital switching and analog amplification.</div>`,
    `<span class="eyebrow">ECI101 · Chương 2 · Bài 2.1</span>
<h2>Diode &amp; transistor</h2>
<h3>Diode — van một chiều</h3>
<p>Một <strong>diode</strong> chỉ dẫn dòng theo <em>một chiều</em> (thuận), chặn chiều ngược. Ứng dụng đắt giá là <strong>chỉnh lưu</strong> — biến AC (xoay chiều) thành DC (một chiều), bước đầu tiên trong hầu hết mọi bộ nguồn. Một <strong>chỉnh lưu cầu</strong> (4 diode) dùng cả hai nửa sóng AC.</p>
<h3>Transistor — khoá &amp; khuếch đại</h3>
<p>Một <strong>transistor</strong> (vd BJT với cực Base, Collector, Emitter) làm hai việc quan trọng:</p>
<ul>
<li><strong>Khoá (switch)</strong> — một dòng base nhỏ bật/tắt hoàn toàn một dòng collector lớn (đây là cách logic số và MCU điều khiển tải).</li>
<li><strong>Khuếch đại</strong> — ở vùng tích cực, tín hiệu vào nhỏ điều khiển đầu ra lớn theo tỉ lệ — nền của mạch khuếch đại âm thanh, radio, cảm biến.</li>
</ul>
<pre><code>Các vùng BJT:
  Cut-off    -> TẮT   (không dòng base -> không dòng collector)
  Saturation -> BẬT   (dẫn hoàn toàn -> như công tắc đóng)
  Active     -> KHUẾCH ĐẠI (dòng collector ≈ β × dòng base)
</code></pre>
<div class="callout"><span class="badge">Vì sao đổi thế giới</span> Transistor là khối dựng nên mọi con chip. Một ý tưởng — "dòng nhỏ điều khiển dòng lớn" — cho ta cả chuyển mạch số lẫn khuếch đại analog.</div>`,
  ]]);

const c2q = quiz('eci101-quiz-2', 'Quiz 2 — Diode & transistor|||Quiz 2 — Diode & transistor', [
  { id: 'q1', question: 'Diode dùng để biến AC thành DC gọi là?', options: ['Khuếch đại', 'Chỉnh lưu (rectification)', 'Dao động', 'Lọc thông cao'], correctIndex: 1, explanation: 'Diode dẫn một chiều → chỉnh lưu AC→DC.' },
  { id: 'q2', question: 'Transistor BJT ở vùng "active" dùng để?', options: ['Tắt hẳn', 'Khuếch đại (Ic ≈ β·Ib)', 'Chỉ làm công tắc đóng', 'Trữ điện'], correctIndex: 1, explanation: 'Vùng active: khuếch đại tín hiệu theo hệ số β.' },
  { id: 'q3', question: 'Transistor làm "công tắc" điều khiển tải lớn nhờ?', options: ['Dòng base nhỏ bật/tắt dòng collector lớn', 'Tụ điện', 'Điện trở kéo', 'Cuộn cảm'], correctIndex: 0, explanation: 'Dòng điều khiển nhỏ → đóng/mở dòng lớn (saturation/cut-off).' },
]);

const c3 = doc('eci101-3-1-amp-supply-oscillator', '3.1 — Amplifiers, power supplies & oscillators|||3.1 — Khuếch đại, nguồn & dao động',
  'Op-amp & mạch khuếch đại (độ lợi), bộ nguồn (chỉnh lưu→lọc→ổn áp), mạch dao động (tạo tín hiệu tuần hoàn); mô phỏng Multisim.',
  [[
    `<span class="eyebrow">ECI101 · Chapter 3 · Lesson 3.1</span>
<h2>Amplifiers, power supplies &amp; oscillators</h2>
<h3>Amplifiers &amp; the op-amp</h3>
<p>An <strong>amplifier</strong> increases a signal's amplitude; its <strong>gain</strong> is output/input. The <strong>operational amplifier (op-amp)</strong> is a versatile building block — with a couple of resistors you set the gain (e.g. a non-inverting amp gain = 1 + Rf/Rin). Op-amps build filters, comparators, and sensor front-ends.</p>
<h3>Power supply chain</h3>
<pre><code>AC mains -> Transformer (step down)
        -> Rectifier (diodes: AC -> pulsing DC)
        -> Filter (capacitor: smooth the ripple)
        -> Regulator (steady, fixed DC out, e.g. 5V)
</code></pre>
<p>That chain — <strong>rectify → filter → regulate</strong> — is inside every phone charger and PC power brick.</p>
<h3>Oscillators</h3>
<p>An <strong>oscillator</strong> produces a repeating waveform (sine, square) with <em>no</em> input signal — it generates a clock or tone from DC power, using feedback plus a frequency-setting network (RC or crystal). Clocks, radios and tone generators all rely on oscillators.</p>
<div class="callout"><span class="badge">Simulate first</span> Use <strong>Multisim</strong> to build and test these circuits virtually — measure voltages/currents and see waveforms before touching real hardware.</div>`,
    `<span class="eyebrow">ECI101 · Chương 3 · Bài 3.1</span>
<h2>Khuếch đại, nguồn &amp; dao động</h2>
<h3>Khuếch đại &amp; op-amp</h3>
<p>Một <strong>mạch khuếch đại</strong> tăng biên độ tín hiệu; <strong>độ lợi (gain)</strong> = ra/vào. <strong>Op-amp (khuếch đại thuật toán)</strong> là khối đa dụng — với vài điện trở bạn đặt được độ lợi (vd mạch không đảo gain = 1 + Rf/Rin). Op-amp dựng bộ lọc, so sánh, và tầng đầu cho cảm biến.</p>
<h3>Chuỗi bộ nguồn</h3>
<pre><code>Điện lưới AC -> Biến áp (hạ áp)
            -> Chỉnh lưu (diode: AC -> DC nhấp nhô)
            -> Lọc (tụ: làm phẳng gợn)
            -> Ổn áp (DC ổn định, cố định, vd 5V)
</code></pre>
<p>Chuỗi đó — <strong>chỉnh lưu → lọc → ổn áp</strong> — nằm trong mọi cục sạc điện thoại và nguồn PC.</p>
<h3>Mạch dao động</h3>
<p>Một <strong>mạch dao động</strong> tạo dạng sóng lặp lại (sin, vuông) mà <em>không</em> cần tín hiệu vào — nó sinh xung nhịp hoặc âm từ nguồn DC, dùng hồi tiếp cộng mạng định tần (RC hoặc thạch anh). Đồng hồ, radio, máy tạo âm đều dựa vào dao động.</p>
<div class="callout"><span class="badge">Mô phỏng trước</span> Dùng <strong>Multisim</strong> để dựng và thử các mạch này ảo — đo áp/dòng và xem dạng sóng trước khi đụng phần cứng thật.</div>`,
  ]]);

const c3q = quiz('eci101-quiz-3', 'Quiz 3 — Amp/supply/oscillator|||Quiz 3 — Khuếch đại/nguồn/dao động', [
  { id: 'q1', question: 'Độ lợi (gain) của mạch khuếch đại là?', options: ['Vào × Ra', 'Ra / Vào', 'Vào − Ra', 'Điện trở nối tiếp'], correctIndex: 1, explanation: 'Gain = tín hiệu ra chia tín hiệu vào.' },
  { id: 'q2', question: 'Thứ tự đúng của chuỗi bộ nguồn?', options: ['Ổn áp → lọc → chỉnh lưu', 'Chỉnh lưu → lọc → ổn áp', 'Lọc → chỉnh lưu → biến áp', 'Dao động → lọc → ổn áp'], correctIndex: 1, explanation: 'AC→biến áp→chỉnh lưu→lọc (tụ)→ổn áp.' },
  { id: 'q3', question: 'Mạch tạo dạng sóng tuần hoàn mà KHÔNG cần tín hiệu vào là?', options: ['Mạch chỉnh lưu', 'Mạch dao động (oscillator)', 'Bộ chia áp', 'Diode', ], correctIndex: 1, explanation: 'Oscillator sinh sóng từ nguồn DC nhờ hồi tiếp + mạng định tần.' },
]);

const taiLieu = doc('eci101-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">ECI101 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Electronic Components and Circuits — passives, diodes &amp; transistors, amplifiers and power supplies — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for ECI101 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.artofelectronics.net/" target="_blank" rel="noopener"><em>The Art of Electronics</em> — Horowitz &amp; Hill</a></li>
<li><a href="https://en.wikipedia.org/wiki/The_Art_of_Electronics" target="_blank" rel="noopener"><em>The Art of Electronics</em> — overview &amp; contents</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.allaboutcircuits.com/" target="_blank" rel="noopener">All About Circuits — textbook &amp; tutorials</a></li>
<li><a href="https://www.electronics-tutorials.ws/" target="_blank" rel="noopener">Electronics Tutorials (electronics-tutorials.ws)</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@ElectroBOOM" target="_blank" rel="noopener">ElectroBOOM</a> — electronics explained (with sparks)</li>
<li><a href="https://www.youtube.com/@greatscottlab" target="_blank" rel="noopener">GreatScott!</a> — practical component &amp; circuit projects</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.falstad.com/circuit/" target="_blank" rel="noopener">Falstad Circuit Simulator</a> — animated circuit sim in the browser</li>
<li><a href="https://www.multisim.com/" target="_blank" rel="noopener">Multisim Live</a> — online SPICE circuit simulation</li>
<li><a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener">Tinkercad Circuits</a> — breadboard &amp; Arduino simulation</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — voltage/current/resistance, Ohm's &amp; Kirchhoff's laws, R/L/C and voltage dividers.</li>
<li><strong>Practice</strong> — analyse simple circuits and simulate them on Falstad until the maths matches the meter.</li>
<li><strong>Go deeper</strong> — diodes (rectifiers), transistors (switch &amp; amplify), op-amps and power supplies.</li>
<li><strong>Job-ready</strong> — read datasheets, build real circuits on a breadboard, and debug with a multimeter.</li>
</ol></div>`,
    `<span class="eyebrow">ECI101 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Linh kiện &amp; mạch điện tử — linh kiện thụ động, diode &amp; transistor, khuếch đại và bộ nguồn — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ECI101 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.artofelectronics.net/" target="_blank" rel="noopener"><em>The Art of Electronics</em> — Horowitz &amp; Hill</a></li>
<li><a href="https://en.wikipedia.org/wiki/The_Art_of_Electronics" target="_blank" rel="noopener"><em>The Art of Electronics</em> — tổng quan &amp; mục lục</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.allaboutcircuits.com/" target="_blank" rel="noopener">All About Circuits — giáo trình &amp; hướng dẫn</a></li>
<li><a href="https://www.electronics-tutorials.ws/" target="_blank" rel="noopener">Electronics Tutorials (electronics-tutorials.ws)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ElectroBOOM" target="_blank" rel="noopener">ElectroBOOM</a> — điện tử giảng vui (kèm tia lửa)</li>
<li><a href="https://www.youtube.com/@greatscottlab" target="_blank" rel="noopener">GreatScott!</a> — dự án linh kiện &amp; mạch thực tế</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.falstad.com/circuit/" target="_blank" rel="noopener">Falstad Circuit Simulator</a> — mô phỏng mạch động trên trình duyệt</li>
<li><a href="https://www.multisim.com/" target="_blank" rel="noopener">Multisim Live</a> — mô phỏng mạch SPICE trực tuyến</li>
<li><a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener">Tinkercad Circuits</a> — mô phỏng breadboard &amp; Arduino</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — điện áp/dòng/trở, định luật Ohm &amp; Kirchhoff, R/L/C và mạch chia áp.</li>
<li><strong>Luyện tập</strong> — phân tích mạch đơn giản và mô phỏng trên Falstad đến khi tính khớp đồng hồ đo.</li>
<li><strong>Đào sâu thực tế</strong> — diode (chỉnh lưu), transistor (khoá &amp; khuếch đại), op-amp và bộ nguồn.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc datasheet, ráp mạch thật trên breadboard, debug bằng đồng hồ vạn năng.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'ECI101',
    slug: 'eci101-introduction-to-electronic-components-and-circuits',
    title: 'Introduction to Electronic Components and Circuits',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ECI101.webp',
    shortDescription: 'How electronic circuits work — Ohm/Kirchhoff laws, passive components (R/L/C), diodes (rectification), transistors (switch & amplify), amplifiers, power supplies & oscillators, simulated in Multisim. Bilingual, with worked examples & quizzes.|||Mạch điện tử hoạt động thế nào — định luật Ohm/Kirchhoff, linh kiện thụ động (R/L/C), diode (chỉnh lưu), transistor (khoá & khuếch đại), khuếch đại, nguồn & dao động, mô phỏng Multisim. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>ECI101 — Introduction to Electronic Components and Circuits</strong> (kỳ 5) giúp hiểu <strong>mạch điện tử hoạt động thế nào</strong>. Từ <strong>đại lượng nền &amp; định luật</strong> (áp/dòng/trở, Ohm, Kirchhoff, bộ chia áp) → <strong>linh kiện thụ động</strong> (điện trở, tụ, cuộn cảm) → <strong>diode</strong> (chỉnh lưu AC→DC) → <strong>transistor</strong> (khoá &amp; khuếch đại) → <strong>khuếch đại (op-amp), bộ nguồn &amp; dao động</strong>. Bám giáo trình FLM, song ngữ, có ví dụ tính toán và mô phỏng Multisim, quiz mỗi chương.',
    whatYouLearn: 'Áp/dòng/trở & định luật Ohm; điện trở nối tiếp/song song, bộ chia áp; tụ (RC) & cuộn cảm; Kirchhoff KVL/KCL; diode & chỉnh lưu (cầu); transistor BJT (cut-off/saturation/active, khoá & khuếch đại β); op-amp & độ lợi; chuỗi nguồn (chỉnh lưu→lọc→ổn áp); mạch dao động; mô phỏng bằng Multisim.',
    requirements: 'Toán/vật lý phổ thông (điện cơ bản). Nên cài Multisim hoặc dùng mô phỏng mạch trực tuyến (Falstad).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Điện tử, áp/dòng/trở, Ohm.', lessons: [intro] },
    { title: 'Chương 1 — Thụ động & định luật|||Chapter 1 — Passives & laws', description: 'R/L/C, Ohm, Kirchhoff, chia áp.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Diode & transistor|||Chapter 2 — Diodes & transistors', description: 'Chỉnh lưu, khoá & khuếch đại.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Khuếch đại, nguồn & dao động|||Chapter 3 — Amp, supply & oscillator', description: 'Op-amp, bộ nguồn, oscillator, Multisim.', lessons: [c3, c3q] },
  ],
};
