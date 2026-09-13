/**
 * EEI101 — Introduction to Electrical-Electronics Engineering.
 * Ngành Kỹ thuật phần mềm ô tô (Automotive Software Engineering), kỳ 1, FPTU.
 * Giáo trình chuẩn (trích dẫn): Hambley "Electrical Engineering: Principles
 * and Applications"; Sedra/Smith "Microelectronic Circuits"; Boylestad
 * "Introductory Circuit Analysis"; Floyd "Digital Fundamentals".
 * 8 chương song ngữ VI+EN, mỗi chương 1 DOCUMENT + 1 QUIZ 3 câu.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; escape
 * &->&amp; và <->&lt;, >->&gt; trong code; viết omega/mu/beta bằng Latin.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('eei101-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Hambley, Sedra/Smith, Boylestad, Floyd), tài liệu miễn phí, YouTube, công cụ mô phỏng, lộ trình tự học.',
  [[
    `<span class="eyebrow">EEI101 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Electrical-Electronics Engineering</strong> for the Automotive Software track — from circuit laws to semiconductors, digital logic and vehicle electrical systems. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for EEI101 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books (standard texts)</h3>
<ul>
<li>Hambley — <em>Electrical Engineering: Principles and Applications</em> (the core circuits + electronics text)</li>
<li>Sedra &amp; Smith — <em>Microelectronic Circuits</em> (diodes, BJT/MOSFET, op-amps)</li>
<li>Boylestad — <em>Introductory Circuit Analysis</em> (DC/AC circuit methods)</li>
<li>Floyd — <em>Digital Fundamentals</em> (logic gates, Boolean algebra)</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.allaboutcircuits.com/" target="_blank" rel="noopener">All About Circuits — textbook &amp; tutorials</a></li>
<li><a href="https://www.electronics-tutorials.ws/" target="_blank" rel="noopener">Electronics Tutorials (electronics-tutorials.ws)</a></li>
<li><a href="https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/" target="_blank" rel="noopener">MIT OCW 6.002 — Circuits and Electronics</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@ElectroBOOM" target="_blank" rel="noopener">ElectroBOOM</a> — electronics explained (with sparks)</li>
<li><a href="https://www.youtube.com/@EngineeringFunda" target="_blank" rel="noopener">Neso Academy / Engineering Funda</a> — circuits, electronics &amp; digital lectures</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.falstad.com/circuit/" target="_blank" rel="noopener">Falstad Circuit Simulator</a> — animated circuit sim in the browser</li>
<li><a href="https://www.multisim.com/" target="_blank" rel="noopener">Multisim Live</a> — online SPICE circuit simulation</li>
<li><a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener">Tinkercad Circuits</a> — breadboard, Arduino &amp; microcontroller simulation</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — voltage/current/resistance, Ohm's &amp; Kirchhoff's laws, DC circuit analysis.</li>
<li><strong>Signals &amp; power</strong> — AC circuits, phasors, RMS and power factor.</li>
<li><strong>Devices</strong> — diodes, BJT/MOSFET, op-amps, logic gates &amp; Boolean algebra.</li>
<li><strong>Automotive</strong> — sensors &amp; actuators, vehicle electrical systems, and microcontrollers that tie software to hardware.</li>
</ol></div>`,
    `<span class="eyebrow">EEI101 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Kỹ thuật Điện-Điện tử</strong> cho ngành Kỹ thuật phần mềm ô tô — từ định luật mạch tới bán dẫn, logic số và hệ thống điện ô tô. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của EEI101 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo (giáo trình chuẩn)</h3>
<ul>
<li>Hambley — <em>Electrical Engineering: Principles and Applications</em> (sách lõi về mạch + điện tử)</li>
<li>Sedra &amp; Smith — <em>Microelectronic Circuits</em> (diode, BJT/MOSFET, op-amp)</li>
<li>Boylestad — <em>Introductory Circuit Analysis</em> (phương pháp phân tích mạch DC/AC)</li>
<li>Floyd — <em>Digital Fundamentals</em> (cổng logic, đại số Boole)</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.allaboutcircuits.com/" target="_blank" rel="noopener">All About Circuits — giáo trình &amp; hướng dẫn</a></li>
<li><a href="https://www.electronics-tutorials.ws/" target="_blank" rel="noopener">Electronics Tutorials (electronics-tutorials.ws)</a></li>
<li><a href="https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/" target="_blank" rel="noopener">MIT OCW 6.002 — Circuits and Electronics</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ElectroBOOM" target="_blank" rel="noopener">ElectroBOOM</a> — điện tử giảng vui (kèm tia lửa)</li>
<li><a href="https://www.youtube.com/@EngineeringFunda" target="_blank" rel="noopener">Neso Academy / Engineering Funda</a> — bài giảng mạch, điện tử &amp; số</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.falstad.com/circuit/" target="_blank" rel="noopener">Falstad Circuit Simulator</a> — mô phỏng mạch động trên trình duyệt</li>
<li><a href="https://www.multisim.com/" target="_blank" rel="noopener">Multisim Live</a> — mô phỏng mạch SPICE trực tuyến</li>
<li><a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener">Tinkercad Circuits</a> — mô phỏng breadboard, Arduino &amp; vi điều khiển</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — điện áp/dòng/trở, định luật Ohm &amp; Kirchhoff, phân tích mạch DC.</li>
<li><strong>Tín hiệu &amp; công suất</strong> — mạch AC, phasor, RMS và hệ số công suất.</li>
<li><strong>Linh kiện</strong> — diode, BJT/MOSFET, op-amp, cổng logic &amp; đại số Boole.</li>
<li><strong>Ô tô</strong> — cảm biến &amp; cơ cấu chấp hành, hệ thống điện, và vi điều khiển nối phần mềm với phần cứng.</li>
</ol></div>`,
  ]]);

const intro = doc('eei101-0-1-overview', 'Course overview: Electrical-Electronics Engineering|||Tổng quan: Kỹ thuật Điện-Điện tử',
  'Vì sao kỹ sư phần mềm ô tô cần điện-điện tử; ba đại lượng nền (áp/dòng/trở), định luật Ohm; lộ trình 8 chương: mạch DC → AC & công suất → bán dẫn → op-amp → số → cảm biến → hệ thống điện & vi điều khiển.',
  [[
    `<span class="eyebrow">EEI101 · Lesson 0.1 · Overview</span>
<h2>Electrical-Electronics Engineering</h2>
<p class="lead">A modern car is a computer on wheels — but that computer only matters because it reads sensors and drives actuators through <strong>electrical and electronic circuits</strong>. This course gives an automotive software engineer the hardware literacy to reason about the signals, voltages and devices their code depends on.</p>
<h3>The three fundamentals</h3>
<ul>
<li><strong>Voltage (V)</strong> — the electrical "push", measured in volts.</li>
<li><strong>Current (I)</strong> — the flow of charge, in amperes.</li>
<li><strong>Resistance (R)</strong> — opposition to flow, in ohms.</li>
</ul>
<p>They are tied together by <strong>Ohm's law: V = I x R</strong> — the single most important equation in electronics.</p>
<h3>Roadmap (8 chapters)</h3>
<p>Electrical quantities &amp; laws → DC circuit analysis → AC circuits &amp; power → semiconductor devices (diode, BJT, MOSFET) → op-amps &amp; amplifiers → digital electronics (logic gates, Boolean algebra) → automotive sensors &amp; actuators → vehicle electrical systems &amp; microcontrollers. Bilingual, with worked examples and quizzes.</p>`,
    `<span class="eyebrow">EEI101 · Bài 0.1 · Tổng quan</span>
<h2>Kỹ thuật Điện-Điện tử</h2>
<p class="lead">Một chiếc xe hiện đại là "máy tính có bánh" — nhưng cái máy tính đó chỉ có nghĩa vì nó đọc cảm biến và điều khiển cơ cấu chấp hành qua <strong>mạch điện và điện tử</strong>. Môn này trang bị cho kỹ sư phần mềm ô tô hiểu biết phần cứng để lập luận về tín hiệu, điện áp và linh kiện mà mã của họ phụ thuộc vào.</p>
<h3>Ba đại lượng nền tảng</h3>
<ul>
<li><strong>Điện áp (V)</strong> — "lực đẩy" điện, đo bằng volt.</li>
<li><strong>Dòng điện (I)</strong> — dòng chảy của điện tích, đo bằng ampe.</li>
<li><strong>Điện trở (R)</strong> — cản trở dòng chảy, đo bằng ohm.</li>
</ul>
<p>Chúng gắn với nhau bởi <strong>định luật Ohm: V = I x R</strong> — phương trình quan trọng nhất trong điện tử.</p>
<h3>Lộ trình (8 chương)</h3>
<p>Đại lượng điện &amp; định luật → phân tích mạch DC → mạch AC &amp; công suất → linh kiện bán dẫn (diode, BJT, MOSFET) → op-amp &amp; khuếch đại → điện tử số (cổng logic, đại số Boole) → cảm biến &amp; cơ cấu chấp hành ô tô → hệ thống điện ô tô &amp; vi điều khiển. Song ngữ, có ví dụ mẫu và quiz.</p>`,
  ]]);

const c1 = doc('eei101-1-1-quantities-laws', '1.1 — Electrical quantities & Ohm/Kirchhoff laws|||1.1 — Đại lượng điện & định luật Ohm/Kirchhoff',
  'Điện tích, áp, dòng, trở, công suất; định luật Ohm; định luật Kirchhoff dòng (KCL) và áp (KVL). Ví dụ tính dòng và công suất.',
  [[
    `<span class="eyebrow">EEI101 · Chapter 1 · Lesson 1.1</span>
<h2>Electrical quantities &amp; the fundamental laws</h2>
<h3>Quantities &amp; units</h3>
<ul>
<li><strong>Charge (Q)</strong> — coulombs; <strong>current I = dQ/dt</strong> is charge per second (amperes).</li>
<li><strong>Voltage (V)</strong> — energy per charge between two points (volts).</li>
<li><strong>Resistance (R)</strong> — opposition to current (ohms).</li>
<li><strong>Power (P)</strong> — energy per second: <code>P = V x I = I^2 x R = V^2 / R</code> (watts).</li>
</ul>
<h3>Ohm's law</h3>
<p><strong>V = I x R</strong>. Rearranged: I = V/R and R = V/I. It links the three fundamentals and is used in almost every calculation.</p>
<h3>Kirchhoff's laws</h3>
<ul>
<li><strong>KCL (current):</strong> the sum of currents flowing INTO a node equals the sum flowing OUT — charge is conserved.</li>
<li><strong>KVL (voltage):</strong> around any closed loop, the sum of voltage rises equals the sum of voltage drops — energy is conserved.</li>
</ul>
<pre><code>Example: 12 V battery drives a single 100 ohm resistor.
  Ohm's law:  I = V / R = 12 / 100 = 0.12 A = 120 mA
  Power:      P = V x I = 12 x 0.12 = 1.44 W
  Check:      P = I^2 x R = 0.12^2 x 100 = 1.44 W  (matches)
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> A car's 12 V bus feeds hundreds of loads; Ohm's and Kirchhoff's laws are how you predict current draw, size fuses and wires, and spot a short before it burns.</div>`,
    `<span class="eyebrow">EEI101 · Chương 1 · Bài 1.1</span>
<h2>Đại lượng điện &amp; các định luật nền tảng</h2>
<h3>Đại lượng &amp; đơn vị</h3>
<ul>
<li><strong>Điện tích (Q)</strong> — coulomb; <strong>dòng điện I = dQ/dt</strong> là điện tích mỗi giây (ampe).</li>
<li><strong>Điện áp (V)</strong> — năng lượng trên mỗi điện tích giữa hai điểm (volt).</li>
<li><strong>Điện trở (R)</strong> — cản trở dòng điện (ohm).</li>
<li><strong>Công suất (P)</strong> — năng lượng mỗi giây: <code>P = V x I = I^2 x R = V^2 / R</code> (watt).</li>
</ul>
<h3>Định luật Ohm</h3>
<p><strong>V = I x R</strong>. Biến đổi: I = V/R và R = V/I. Nó liên hệ ba đại lượng nền và có mặt trong gần như mọi phép tính.</p>
<h3>Định luật Kirchhoff</h3>
<ul>
<li><strong>KCL (dòng):</strong> tổng dòng VÀO một nút bằng tổng dòng RA — bảo toàn điện tích.</li>
<li><strong>KVL (áp):</strong> quanh một vòng kín, tổng áp tăng bằng tổng áp giảm — bảo toàn năng lượng.</li>
</ul>
<pre><code>Ví dụ: pin 12 V cấp cho một điện trở 100 ohm.
  Định luật Ohm: I = V / R = 12 / 100 = 0.12 A = 120 mA
  Công suất:     P = V x I = 12 x 0.12 = 1.44 W
  Kiểm tra:      P = I^2 x R = 0.12^2 x 100 = 1.44 W  (khớp)
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Bus 12 V của xe cấp cho hàng trăm tải; định luật Ohm và Kirchhoff là cách bạn dự đoán dòng tiêu thụ, chọn cầu chì và tiết diện dây, và phát hiện ngắn mạch trước khi nó cháy.</div>`,
  ]]);

const c1q = quiz('eei101-quiz-1', 'Quiz 1 — Quantities & laws|||Quiz 1 — Đại lượng & định luật', [
  { id: 'q1', question: 'Định luật Ohm liên hệ áp, dòng, trở là?', options: ['V = I + R', 'V = I x R', 'V = I / R', 'V = R / I'], correctIndex: 1, explanation: 'V = I x R; suy ra I = V/R và R = V/I.' },
  { id: 'q2', question: 'KCL (định luật dòng Kirchhoff) phát biểu điều gì?', options: ['Tổng áp quanh vòng kín bằng 0', 'Tổng dòng VÀO nút = tổng dòng RA nút', 'Trở nối tiếp cộng lại', 'Công suất = V x I'], correctIndex: 1, explanation: 'KCL: bảo toàn điện tích — dòng vào nút bằng dòng ra nút.' },
  { id: 'q3', question: 'Điện trở 100 ohm nối vào 12 V thì công suất tiêu tán xấp xỉ?', options: ['0.12 W', '1.2 W', '1.44 W', '12 W'], correctIndex: 2, explanation: 'I = 12/100 = 0.12 A; P = V x I = 12 x 0.12 = 1.44 W.' },
]);

const c2 = doc('eei101-2-1-dc-analysis', '2.1 — DC circuit analysis|||2.1 — Phân tích mạch DC',
  'Điện trở nối tiếp/song song, bộ chia áp và chia dòng; phương pháp điện thế nút; định lý Thevenin. Ví dụ chia áp.',
  [[
    `<span class="eyebrow">EEI101 · Chapter 2 · Lesson 2.1</span>
<h2>DC circuit analysis</h2>
<h3>Series and parallel</h3>
<ul>
<li><strong>Series</strong> — same current through each element; resistances add: <code>R = R1 + R2 + ...</code></li>
<li><strong>Parallel</strong> — same voltage across each; conductances add: <code>1/R = 1/R1 + 1/R2 + ...</code> For two: R = (R1 x R2) / (R1 + R2).</li>
</ul>
<h3>Voltage divider &amp; current divider</h3>
<p><strong>Voltage divider:</strong> two series resistors split a voltage in proportion to their values — <code>Vout = Vin x R2 / (R1 + R2)</code>. <strong>Current divider:</strong> parallel branches split current inversely to their resistance.</p>
<h3>Systematic methods</h3>
<ul>
<li><strong>Nodal analysis</strong> — write KCL at each node, solve for node voltages.</li>
<li><strong>Thevenin equivalent</strong> — any linear two-terminal network reduces to one source Vth in series with one resistor Rth; makes load calculations trivial.</li>
</ul>
<pre><code>Voltage divider: Vin = 5 V, R1 = 2 kohm, R2 = 3 kohm (series)
  I    = Vin / (R1 + R2) = 5 / 5000 = 1 mA
  Vout = I x R2 = 1 mA x 3 kohm = 3 V
  (or  Vout = 5 x 3000 / 5000 = 3 V)
</code></pre>
<div class="callout"><span class="badge">Sensor front-end</span> A resistive sensor (thermistor, potentiometer) plus a fixed resistor is a voltage divider — that's how many automotive sensors turn a physical quantity into a voltage an ADC can read.</div>`,
    `<span class="eyebrow">EEI101 · Chương 2 · Bài 2.1</span>
<h2>Phân tích mạch DC</h2>
<h3>Nối tiếp và song song</h3>
<ul>
<li><strong>Nối tiếp</strong> — cùng dòng qua mỗi phần tử; điện trở cộng: <code>R = R1 + R2 + ...</code></li>
<li><strong>Song song</strong> — cùng áp trên mỗi phần tử; điện dẫn cộng: <code>1/R = 1/R1 + 1/R2 + ...</code> Với hai trở: R = (R1 x R2) / (R1 + R2).</li>
</ul>
<h3>Bộ chia áp &amp; chia dòng</h3>
<p><strong>Chia áp:</strong> hai điện trở nối tiếp chia áp theo tỉ lệ giá trị — <code>Vout = Vin x R2 / (R1 + R2)</code>. <strong>Chia dòng:</strong> các nhánh song song chia dòng nghịch với điện trở của chúng.</p>
<h3>Phương pháp hệ thống</h3>
<ul>
<li><strong>Điện thế nút (nodal)</strong> — viết KCL tại mỗi nút, giải ra điện thế các nút.</li>
<li><strong>Tương đương Thevenin</strong> — mọi mạng tuyến tính hai cực rút về một nguồn Vth nối tiếp một điện trở Rth; giúp tính tải cực dễ.</li>
</ul>
<pre><code>Chia áp: Vin = 5 V, R1 = 2 kohm, R2 = 3 kohm (nối tiếp)
  I    = Vin / (R1 + R2) = 5 / 5000 = 1 mA
  Vout = I x R2 = 1 mA x 3 kohm = 3 V
  (hoặc Vout = 5 x 3000 / 5000 = 3 V)
</code></pre>
<div class="callout"><span class="badge">Tầng đầu cảm biến</span> Một cảm biến điện trở (nhiệt điện trở, biến trở) cộng một điện trở cố định là một bộ chia áp — đó là cách nhiều cảm biến ô tô biến đại lượng vật lý thành điện áp cho ADC đọc.</div>`,
  ]]);

const c2q = quiz('eei101-quiz-2', 'Quiz 2 — DC analysis|||Quiz 2 — Phân tích DC', [
  { id: 'q1', question: 'Hai điện trở 2 kohm và 3 kohm nối tiếp, tổng điện trở là?', options: ['1.2 kohm', '5 kohm', '6 kohm', '1 kohm'], correctIndex: 1, explanation: 'Nối tiếp thì điện trở cộng: 2 + 3 = 5 kohm.' },
  { id: 'q2', question: 'Bộ chia áp Vin=5V, R1=2kohm (trên), R2=3kohm (dưới), Vout trên R2 là?', options: ['2 V', '2.5 V', '3 V', '5 V'], correctIndex: 2, explanation: 'Vout = Vin x R2/(R1+R2) = 5 x 3000/5000 = 3 V.' },
  { id: 'q3', question: 'Định lý Thevenin rút một mạng tuyến tính hai cực về?', options: ['Một tụ và một cuộn cảm', 'Một nguồn áp Vth nối tiếp một điện trở Rth', 'Hai điện trở song song', 'Một nguồn dòng duy nhất, không điện trở'], correctIndex: 1, explanation: 'Tương đương Thevenin: một Vth nối tiếp một Rth.' },
]);

const c3 = doc('eei101-3-1-ac-power', '3.1 — AC circuits & power|||3.1 — Mạch AC & công suất',
  'Tín hiệu sin, tần số & chu kỳ, giá trị hiệu dụng RMS; trở kháng của R/L/C; công suất thực/phản kháng/biểu kiến và hệ số công suất.',
  [[
    `<span class="eyebrow">EEI101 · Chapter 3 · Lesson 3.1</span>
<h2>AC circuits &amp; power</h2>
<h3>The sinusoid</h3>
<p>An AC signal is <code>v(t) = Vm x sin(2 x pi x f x t)</code> with peak Vm, frequency f (Hz) and period T = 1/f. The useful "equivalent DC" value is the <strong>RMS</strong>: for a sine, <code>Vrms = Vm / sqrt(2) ~ 0.707 x Vm</code>. Mains "220 V" is an RMS value.</p>
<h3>Impedance</h3>
<p>In AC, capacitors and inductors oppose current with a frequency-dependent <strong>reactance</strong>:</p>
<ul>
<li>Resistor: <code>Z = R</code> (no phase shift).</li>
<li>Capacitor: <code>Xc = 1 / (2 x pi x f x C)</code> — blocks low f, passes high f.</li>
<li>Inductor: <code>Xl = 2 x pi x f x L</code> — passes low f, blocks high f.</li>
</ul>
<h3>Power &amp; power factor</h3>
<p><strong>Real power P</strong> (watts) does work; <strong>reactive power Q</strong> (VAR) sloshes back and forth; <strong>apparent power S = Vrms x Irms</strong> (VA). The <strong>power factor</strong> pf = P/S = cos(phi) tells how much of the delivered VA becomes useful watts.</p>
<pre><code>Sine wave: Vm = 12 V peak, f = 60 Hz
  Vrms   = 12 / sqrt(2) = 8.49 V
  T      = 1 / f = 1 / 60 = 16.7 ms
  Xc of 10 uF: Xc = 1 / (2 x pi x 60 x 10e-6) = 265 ohm
</code></pre>
<div class="callout"><span class="badge">Automotive link</span> The alternator produces AC that diodes rectify to charge the 12 V battery; PWM signals driving motors and LEDs are analyzed with these same AC ideas.</div>`,
    `<span class="eyebrow">EEI101 · Chương 3 · Bài 3.1</span>
<h2>Mạch AC &amp; công suất</h2>
<h3>Sóng sin</h3>
<p>Tín hiệu AC là <code>v(t) = Vm x sin(2 x pi x f x t)</code> với đỉnh Vm, tần số f (Hz) và chu kỳ T = 1/f. Giá trị "DC tương đương" hữu dụng là <strong>RMS (hiệu dụng)</strong>: với sóng sin, <code>Vrms = Vm / sqrt(2) ~ 0.707 x Vm</code>. Điện lưới "220 V" là giá trị RMS.</p>
<h3>Trở kháng</h3>
<p>Trong AC, tụ và cuộn cảm cản dòng bằng <strong>điện kháng</strong> phụ thuộc tần số:</p>
<ul>
<li>Điện trở: <code>Z = R</code> (không lệch pha).</li>
<li>Tụ điện: <code>Xc = 1 / (2 x pi x f x C)</code> — chặn f thấp, cho f cao qua.</li>
<li>Cuộn cảm: <code>Xl = 2 x pi x f x L</code> — cho f thấp qua, chặn f cao.</li>
</ul>
<h3>Công suất &amp; hệ số công suất</h3>
<p><strong>Công suất thực P</strong> (watt) sinh công; <strong>công suất phản kháng Q</strong> (VAR) dao động qua lại; <strong>công suất biểu kiến S = Vrms x Irms</strong> (VA). <strong>Hệ số công suất</strong> pf = P/S = cos(phi) cho biết bao nhiêu VA cấp vào trở thành watt hữu ích.</p>
<pre><code>Sóng sin: Vm = 12 V đỉnh, f = 60 Hz
  Vrms   = 12 / sqrt(2) = 8.49 V
  T      = 1 / f = 1 / 60 = 16.7 ms
  Xc của 10 uF: Xc = 1 / (2 x pi x 60 x 10e-6) = 265 ohm
</code></pre>
<div class="callout"><span class="badge">Liên hệ ô tô</span> Máy phát tạo AC, diode chỉnh lưu để nạp pin 12 V; tín hiệu PWM điều khiển động cơ và LED được phân tích bằng chính những ý niệm AC này.</div>`,
  ]]);

const c3q = quiz('eei101-quiz-3', 'Quiz 3 — AC & power|||Quiz 3 — AC & công suất', [
  { id: 'q1', question: 'Với sóng sin đỉnh Vm, giá trị hiệu dụng (RMS) bằng?', options: ['Vm', 'Vm / 2', 'Vm / sqrt(2)', 'Vm x sqrt(2)'], correctIndex: 2, explanation: 'Vrms = Vm/sqrt(2) ~ 0.707 x Vm cho sóng sin.' },
  { id: 'q2', question: 'Điện kháng của tụ Xc khi tần số f TĂNG sẽ?', options: ['Tăng', 'Giảm', 'Không đổi', 'Bằng 0 ngay'], correctIndex: 1, explanation: 'Xc = 1/(2 pi f C): f tăng thì Xc giảm — tụ cho tần số cao qua dễ hơn.' },
  { id: 'q3', question: 'Hệ số công suất pf được định nghĩa là?', options: ['S / P', 'P / S = cos(phi)', 'Q / P', 'Vrms x Irms'], correctIndex: 1, explanation: 'pf = P/S = cos(phi): tỉ lệ công suất thực trên biểu kiến.' },
]);

const c4 = doc('eei101-4-1-semiconductors', '4.1 — Semiconductor devices: diode, BJT, MOSFET|||4.1 — Linh kiện bán dẫn: diode, BJT, MOSFET',
  'Diode (van một chiều, chỉnh lưu, sụt áp ~0.7V); BJT (khoá & khuếch đại, hệ số beta); MOSFET (khoá điều khiển bằng áp cổng, dùng nhiều nhất trong ô tô).',
  [[
    `<span class="eyebrow">EEI101 · Chapter 4 · Lesson 4.1</span>
<h2>Semiconductor devices</h2>
<h3>Diode — a one-way valve</h3>
<p>A <strong>diode</strong> conducts in one direction only, dropping about <strong>0.7 V</strong> (silicon) when forward. Its killer app is <strong>rectification</strong> (AC to DC). A <strong>Zener</strong> conducts in reverse at a fixed voltage — a simple reference/clamp.</p>
<h3>BJT — current-controlled</h3>
<p>A <strong>bipolar transistor</strong> (Base, Collector, Emitter) uses a small base current to control a large collector current: <code>Ic = beta x Ib</code>. It works as a switch (cut-off / saturation) or an amplifier (active region).</p>
<h3>MOSFET — voltage-controlled</h3>
<p>A <strong>MOSFET</strong> (Gate, Drain, Source) is switched by the <em>gate voltage</em> — almost no gate current, so it is efficient and easy to drive from a microcontroller pin. In its on-state it looks like a small resistance Rds(on). MOSFETs are the workhorse switch for motors, LEDs and power in vehicles.</p>
<pre><code>BJT regions:
  Cut-off    -> OFF     (Ib = 0  -> Ic = 0)
  Saturation -> ON      (fully conducting, like a closed switch)
  Active     -> AMPLIFY (Ic = beta x Ib)

MOSFET as a low-side switch:
  Vgs &lt; Vth  -> OFF   (load current blocked)
  Vgs &gt; Vth  -> ON    (load current flows, drop = Id x Rds_on)
</code></pre>
<div class="callout"><span class="badge">Why it changed the world</span> One idea — "a small input controls a big output" — gives both digital switching and analog amplification, and every chip is built from it.</div>`,
    `<span class="eyebrow">EEI101 · Chương 4 · Bài 4.1</span>
<h2>Linh kiện bán dẫn</h2>
<h3>Diode — van một chiều</h3>
<p>Một <strong>diode</strong> chỉ dẫn theo một chiều, sụt khoảng <strong>0.7 V</strong> (silic) khi phân cực thuận. Ứng dụng đắt giá là <strong>chỉnh lưu</strong> (AC sang DC). Diode <strong>Zener</strong> dẫn ngược ở một điện áp cố định — một nguồn tham chiếu/ghim áp đơn giản.</p>
<h3>BJT — điều khiển bằng dòng</h3>
<p><strong>Transistor lưỡng cực</strong> (Base, Collector, Emitter) dùng dòng base nhỏ điều khiển dòng collector lớn: <code>Ic = beta x Ib</code>. Nó làm khoá (cut-off / saturation) hoặc khuếch đại (vùng active).</p>
<h3>MOSFET — điều khiển bằng áp</h3>
<p><strong>MOSFET</strong> (Gate, Drain, Source) được đóng/mở bằng <em>điện áp cổng</em> — gần như không có dòng cổng, nên hiệu quả và dễ lái trực tiếp từ chân vi điều khiển. Khi dẫn, nó như một điện trở nhỏ Rds(on). MOSFET là công tắc chủ lực cho động cơ, LED và công suất trên xe.</p>
<pre><code>Các vùng BJT:
  Cut-off    -> TẮT       (Ib = 0  -> Ic = 0)
  Saturation -> BẬT       (dẫn hoàn toàn, như công tắc đóng)
  Active     -> KHUẾCH ĐẠI (Ic = beta x Ib)

MOSFET làm khoá phía thấp (low-side):
  Vgs &lt; Vth  -> TẮT   (chặn dòng tải)
  Vgs &gt; Vth  -> BẬT   (dòng tải chảy, sụt = Id x Rds_on)
</code></pre>
<div class="callout"><span class="badge">Vì sao đổi thế giới</span> Một ý tưởng — "đầu vào nhỏ điều khiển đầu ra lớn" — cho cả chuyển mạch số lẫn khuếch đại analog, và mọi con chip đều dựng từ nó.</div>`,
  ]]);

const c4q = quiz('eei101-quiz-4', 'Quiz 4 — Semiconductors|||Quiz 4 — Bán dẫn', [
  { id: 'q1', question: 'Sụt áp thuận điển hình của diode silic là?', options: ['0 V', 'Khoảng 0.7 V', '5 V', '12 V'], correctIndex: 1, explanation: 'Diode silic dẫn thuận sụt khoảng 0.7 V.' },
  { id: 'q2', question: 'BJT được điều khiển bằng ___, còn MOSFET được điều khiển bằng ___?', options: ['Áp cổng / dòng base', 'Dòng base / áp cổng (Vgs)', 'Nhiệt độ / ánh sáng', 'Điện dung / điện cảm'], correctIndex: 1, explanation: 'BJT điều khiển bằng dòng base (Ic=beta·Ib); MOSFET bằng áp cổng Vgs.' },
  { id: 'q3', question: 'Vì sao MOSFET dễ lái trực tiếp từ chân vi điều khiển?', options: ['Vì cần dòng cổng rất lớn', 'Vì gần như không cần dòng cổng, điều khiển bằng áp', 'Vì nó là linh kiện cơ khí', 'Vì nó luôn dẫn'], correctIndex: 1, explanation: 'Cổng MOSFET gần như không rút dòng, chỉ cần áp Vgs > Vth để bật.' },
]);

const c5 = doc('eei101-5-1-opamp', '5.1 — Op-amps & amplifier circuits|||5.1 — Op-amp & mạch khuếch đại',
  'Op-amp lý tưởng và hai quy tắc vàng; mạch đảo và không đảo, độ lợi; bộ đệm, so sánh. Ví dụ tính gain.',
  [[
    `<span class="eyebrow">EEI101 · Chapter 5 · Lesson 5.1</span>
<h2>Op-amps &amp; amplifier circuits</h2>
<h3>The ideal op-amp</h3>
<p>An <strong>operational amplifier</strong> has two inputs (+ and -) and huge open-loop gain. With negative feedback, two "golden rules" hold:</p>
<ul>
<li><strong>No current</strong> flows into the inputs (infinite input impedance).</li>
<li>The op-amp drives its output so the two inputs are at the <strong>same voltage</strong> (a "virtual short").</li>
</ul>
<h3>The two standard amplifiers</h3>
<ul>
<li><strong>Non-inverting:</strong> <code>Gain = 1 + Rf / Rin</code>, always &gt;= 1, keeps signal polarity.</li>
<li><strong>Inverting:</strong> <code>Gain = - Rf / Rin</code>, flips polarity.</li>
</ul>
<p>A <strong>voltage follower</strong> (buffer) has gain 1 and isolates a weak source from a heavy load. A <strong>comparator</strong> uses the op-amp open-loop to output high/low depending on which input is larger.</p>
<pre><code>Non-inverting amp: Rin = 1 kohm, Rf = 9 kohm, Vin = 0.2 V
  Gain = 1 + Rf / Rin = 1 + 9000 / 1000 = 10
  Vout = Gain x Vin = 10 x 0.2 = 2.0 V
</code></pre>
<div class="callout"><span class="badge">Sensor conditioning</span> Op-amps amplify tiny sensor signals (thermocouples, current shunts) up to a range an ADC can read cleanly — the bridge between the physical world and the software.</div>`,
    `<span class="eyebrow">EEI101 · Chương 5 · Bài 5.1</span>
<h2>Op-amp &amp; mạch khuếch đại</h2>
<h3>Op-amp lý tưởng</h3>
<p><strong>Khuếch đại thuật toán (op-amp)</strong> có hai đầu vào (+ và -) và độ lợi vòng hở rất lớn. Khi có hồi tiếp âm, hai "quy tắc vàng" đúng:</p>
<ul>
<li><strong>Không có dòng</strong> chảy vào các đầu vào (trở kháng vào vô cùng).</li>
<li>Op-amp lái đầu ra sao cho hai đầu vào ở <strong>cùng điện áp</strong> (điểm "ngắn mạch ảo").</li>
</ul>
<h3>Hai mạch khuếch đại chuẩn</h3>
<ul>
<li><strong>Không đảo:</strong> <code>Gain = 1 + Rf / Rin</code>, luôn &gt;= 1, giữ nguyên dấu tín hiệu.</li>
<li><strong>Đảo:</strong> <code>Gain = - Rf / Rin</code>, đảo dấu.</li>
</ul>
<p><strong>Bộ đệm (voltage follower)</strong> có gain 1, cách ly nguồn yếu khỏi tải nặng. <strong>Bộ so sánh (comparator)</strong> dùng op-amp vòng hở để xuất mức cao/thấp tuỳ đầu vào nào lớn hơn.</p>
<pre><code>Khuếch đại không đảo: Rin = 1 kohm, Rf = 9 kohm, Vin = 0.2 V
  Gain = 1 + Rf / Rin = 1 + 9000 / 1000 = 10
  Vout = Gain x Vin = 10 x 0.2 = 2.0 V
</code></pre>
<div class="callout"><span class="badge">Chuẩn hoá cảm biến</span> Op-amp khuếch đại tín hiệu cảm biến rất nhỏ (cặp nhiệt, điện trở đo dòng) lên dải mà ADC đọc sạch — cầu nối giữa thế giới vật lý và phần mềm.</div>`,
  ]]);

const c5q = quiz('eei101-quiz-5', 'Quiz 5 — Op-amps|||Quiz 5 — Op-amp', [
  { id: 'q1', question: 'Độ lợi của mạch khuếch đại KHÔNG đảo là?', options: ['- Rf / Rin', '1 + Rf / Rin', 'Rf / Rin', 'Rin / Rf'], correctIndex: 1, explanation: 'Không đảo: Gain = 1 + Rf/Rin, luôn >= 1.' },
  { id: 'q2', question: 'Với Rin=1kohm, Rf=9kohm (không đảo), Vin=0.2V thì Vout là?', options: ['0.2 V', '1.8 V', '2.0 V', '9 V'], correctIndex: 2, explanation: 'Gain = 1 + 9000/1000 = 10; Vout = 10 x 0.2 = 2.0 V.' },
  { id: 'q3', question: 'Một "quy tắc vàng" của op-amp lý tưởng có hồi tiếp âm là?', options: ['Dòng vào đầu vào rất lớn', 'Hai đầu vào ở cùng điện áp (ngắn mạch ảo)', 'Đầu ra luôn bằng 0', 'Độ lợi luôn bằng 1'], correctIndex: 1, explanation: 'Không có dòng vào và hai đầu vào cùng áp (virtual short).' },
]);

const c6 = doc('eei101-6-1-digital', '6.1 — Digital electronics: logic gates & Boolean algebra|||6.1 — Điện tử số: cổng logic & đại số Boole',
  'Nhị phân, mức logic; cổng AND/OR/NOT/NAND/NOR/XOR; đại số Boole và bảng chân trị; định luật De Morgan. Ví dụ bảng chân trị.',
  [[
    `<span class="eyebrow">EEI101 · Chapter 6 · Lesson 6.1</span>
<h2>Digital electronics</h2>
<h3>Binary &amp; logic levels</h3>
<p>Digital circuits use two states — <strong>0 (low)</strong> and <strong>1 (high)</strong> — mapped to voltage ranges (e.g. 0 V and 3.3 V). Everything a computer does is built from combining these bits.</p>
<h3>Logic gates</h3>
<ul>
<li><strong>AND</strong> — 1 only if all inputs are 1.</li>
<li><strong>OR</strong> — 1 if any input is 1.</li>
<li><strong>NOT</strong> — inverts the input.</li>
<li><strong>NAND / NOR</strong> — AND/OR then invert; each alone can build any logic ("universal" gates).</li>
<li><strong>XOR</strong> — 1 when inputs differ.</li>
</ul>
<h3>Boolean algebra</h3>
<p>Logic is described by <strong>Boolean algebra</strong>: AND is written as a product (A.B), OR as a sum (A+B), NOT as a bar. <strong>De Morgan:</strong> <code>NOT(A.B) = NOT A + NOT B</code> and <code>NOT(A+B) = NOT A . NOT B</code> — used constantly to simplify logic.</p>
<pre><code>Truth table for a 2-input XOR (Y = A XOR B):
  A  B | Y
  0  0 | 0
  0  1 | 1
  1  0 | 1
  1  1 | 0
Boolean form: Y = A.(NOT B) + (NOT A).B
</code></pre>
<div class="callout"><span class="badge">From gates to CPUs</span> Adders, memory and the CPU inside every engine control unit are all built from these gates — the physical layer beneath the code you write.</div>`,
    `<span class="eyebrow">EEI101 · Chương 6 · Bài 6.1</span>
<h2>Điện tử số</h2>
<h3>Nhị phân &amp; mức logic</h3>
<p>Mạch số dùng hai trạng thái — <strong>0 (thấp)</strong> và <strong>1 (cao)</strong> — ánh xạ tới dải điện áp (vd 0 V và 3.3 V). Mọi thứ máy tính làm đều dựng từ việc kết hợp các bit này.</p>
<h3>Cổng logic</h3>
<ul>
<li><strong>AND</strong> — bằng 1 chỉ khi mọi đầu vào là 1.</li>
<li><strong>OR</strong> — bằng 1 nếu có bất kỳ đầu vào nào là 1.</li>
<li><strong>NOT</strong> — đảo đầu vào.</li>
<li><strong>NAND / NOR</strong> — AND/OR rồi đảo; mỗi cổng này một mình dựng được mọi logic (cổng "vạn năng").</li>
<li><strong>XOR</strong> — bằng 1 khi các đầu vào khác nhau.</li>
</ul>
<h3>Đại số Boole</h3>
<p>Logic được mô tả bằng <strong>đại số Boole</strong>: AND viết như tích (A.B), OR như tổng (A+B), NOT như dấu gạch. <strong>De Morgan:</strong> <code>NOT(A.B) = NOT A + NOT B</code> và <code>NOT(A+B) = NOT A . NOT B</code> — dùng liên tục để rút gọn logic.</p>
<pre><code>Bảng chân trị cổng XOR 2 đầu vào (Y = A XOR B):
  A  B | Y
  0  0 | 0
  0  1 | 1
  1  0 | 1
  1  1 | 0
Dạng Boole: Y = A.(NOT B) + (NOT A).B
</code></pre>
<div class="callout"><span class="badge">Từ cổng tới CPU</span> Bộ cộng, bộ nhớ và CPU trong mọi hộp điều khiển động cơ đều dựng từ các cổng này — lớp vật lý bên dưới mã bạn viết.</div>`,
  ]]);

const c6q = quiz('eei101-quiz-6', 'Quiz 6 — Digital|||Quiz 6 — Số', [
  { id: 'q1', question: 'Cổng AND cho đầu ra bằng 1 khi nào?', options: ['Khi có ít nhất một đầu vào là 1', 'Chỉ khi TẤT CẢ đầu vào đều là 1', 'Khi các đầu vào khác nhau', 'Khi mọi đầu vào là 0'], correctIndex: 1, explanation: 'AND: ra 1 chỉ khi mọi đầu vào đều 1.' },
  { id: 'q2', question: 'Định luật De Morgan phát biểu NOT(A.B) bằng?', options: ['NOT A . NOT B', 'NOT A + NOT B', 'A + B', 'A . B'], correctIndex: 1, explanation: 'NOT(A.B) = NOT A + NOT B (và NOT(A+B) = NOT A . NOT B).' },
  { id: 'q3', question: 'Cổng XOR 2 đầu vào cho ra 1 khi?', options: ['Hai đầu vào giống nhau', 'Hai đầu vào khác nhau', 'Cả hai bằng 1', 'Cả hai bằng 0'], correctIndex: 1, explanation: 'XOR ra 1 khi hai đầu vào khác nhau (0,1 hoặc 1,0).' },
]);

const c7 = doc('eei101-7-1-sensors-actuators', '7.1 — Automotive sensors & actuators|||7.1 — Cảm biến & cơ cấu chấp hành trên ô tô',
  'Cảm biến (nhiệt, vị trí, áp suất, Hall, oxy) biến đại lượng vật lý thành tín hiệu; cơ cấu chấp hành (motor, van điện từ, kim phun) do MCU điều khiển qua khoá công suất và PWM.',
  [[
    `<span class="eyebrow">EEI101 · Chapter 7 · Lesson 7.1</span>
<h2>Automotive sensors &amp; actuators</h2>
<h3>Sensors — physical world to signal</h3>
<p>A <strong>sensor</strong> converts a physical quantity into an electrical signal the ECU can read:</p>
<ul>
<li><strong>Thermistor</strong> — resistance changes with temperature (coolant, intake air).</li>
<li><strong>Potentiometer / Hall sensor</strong> — position &amp; speed (throttle, crankshaft, wheels).</li>
<li><strong>Piezoresistive sensor</strong> — pressure (manifold, tyre).</li>
<li><strong>Oxygen (lambda) sensor</strong> — air/fuel ratio for emissions.</li>
</ul>
<p>Most produce a small analog voltage read by an <strong>ADC</strong>; the divider and op-amp ideas from earlier chapters condition that signal.</p>
<h3>Actuators — signal back to the world</h3>
<p>An <strong>actuator</strong> turns an electrical command into motion or action: DC motors, solenoids, relays, fuel injectors, LEDs. They draw more current than an MCU pin can supply, so the pin drives a <strong>MOSFET or relay</strong>, and speed/brightness is set by <strong>PWM</strong> (rapid on/off whose duty cycle sets the average power).</p>
<pre><code>PWM average voltage to a motor from a 12 V supply:
  Vavg = Vsupply x DutyCycle
  25% duty -> Vavg = 12 x 0.25 = 3.0 V
  75% duty -> Vavg = 12 x 0.75 = 9.0 V
</code></pre>
<div class="callout"><span class="badge">Sensor-compute-actuate</span> Read a sensor (ADC) -> decide in software -> drive an actuator (PWM + MOSFET). This loop is the heart of nearly every automotive control function.</div>`,
    `<span class="eyebrow">EEI101 · Chương 7 · Bài 7.1</span>
<h2>Cảm biến &amp; cơ cấu chấp hành trên ô tô</h2>
<h3>Cảm biến — từ thế giới vật lý thành tín hiệu</h3>
<p>Một <strong>cảm biến</strong> biến đại lượng vật lý thành tín hiệu điện cho ECU đọc:</p>
<ul>
<li><strong>Nhiệt điện trở (thermistor)</strong> — điện trở đổi theo nhiệt độ (nước làm mát, khí nạp).</li>
<li><strong>Biến trở / cảm biến Hall</strong> — vị trí &amp; tốc độ (bướm ga, trục khuỷu, bánh xe).</li>
<li><strong>Cảm biến áp điện trở</strong> — áp suất (đường ống nạp, lốp).</li>
<li><strong>Cảm biến oxy (lambda)</strong> — tỉ lệ khí/nhiên liệu cho khí thải.</li>
</ul>
<p>Đa số tạo một điện áp analog nhỏ được <strong>ADC</strong> đọc; ý niệm chia áp và op-amp ở các chương trước dùng để chuẩn hoá tín hiệu đó.</p>
<h3>Cơ cấu chấp hành — tín hiệu trở lại thế giới</h3>
<p>Một <strong>cơ cấu chấp hành</strong> biến lệnh điện thành chuyển động hoặc hành động: motor DC, van điện từ (solenoid), rơ-le, kim phun, LED. Chúng rút dòng lớn hơn chân MCU cấp được, nên chân đó lái một <strong>MOSFET hoặc rơ-le</strong>, và tốc độ/độ sáng đặt bằng <strong>PWM</strong> (bật/tắt nhanh, chu kỳ nhiệm vụ quyết định công suất trung bình).</p>
<pre><code>Điện áp trung bình PWM cấp cho motor từ nguồn 12 V:
  Vavg = Vsupply x DutyCycle
  duty 25% -> Vavg = 12 x 0.25 = 3.0 V
  duty 75% -> Vavg = 12 x 0.75 = 9.0 V
</code></pre>
<div class="callout"><span class="badge">Đọc-tính-điều khiển</span> Đọc cảm biến (ADC) -> quyết định trong phần mềm -> lái cơ cấu chấp hành (PWM + MOSFET). Vòng lặp này là trái tim của gần như mọi chức năng điều khiển trên ô tô.</div>`,
  ]]);

const c7q = quiz('eei101-quiz-7', 'Quiz 7 — Sensors & actuators|||Quiz 7 — Cảm biến & chấp hành', [
  { id: 'q1', question: 'Nhiệt điện trở (thermistor) đo đại lượng nào?', options: ['Áp suất', 'Nhiệt độ', 'Vị trí góc', 'Tỉ lệ khí/nhiên liệu'], correctIndex: 1, explanation: 'Thermistor: điện trở thay đổi theo nhiệt độ.' },
  { id: 'q2', question: 'Vì sao chân MCU thường lái motor qua MOSFET/rơ-le thay vì nối thẳng?', options: ['Vì motor cần điện áp âm', 'Vì motor rút dòng lớn hơn chân MCU cấp được', 'Vì MCU không có chân ra', 'Vì motor là tín hiệu số'], correctIndex: 1, explanation: 'Tải như motor rút dòng lớn; chân MCU chỉ lái khoá công suất (MOSFET/rơ-le).' },
  { id: 'q3', question: 'PWM 75% duty trên nguồn 12 V cho điện áp trung bình xấp xỉ?', options: ['3 V', '6 V', '9 V', '12 V'], correctIndex: 2, explanation: 'Vavg = 12 x 0.75 = 9 V.' },
]);

const c8 = doc('eei101-8-1-vehicle-electrical-mcu', '8.1 — Vehicle electrical systems & microcontrollers|||8.1 — Hệ thống điện ô tô & vi điều khiển',
  'Hệ 12V, pin/ắc-quy & máy phát, cầu chì & rơ-le, ECU và mạng CAN; vi điều khiển (CPU, bộ nhớ, GPIO, ADC, timer/PWM) — nơi phần mềm gặp phần cứng.',
  [[
    `<span class="eyebrow">EEI101 · Chapter 8 · Lesson 8.1</span>
<h2>Vehicle electrical systems &amp; microcontrollers</h2>
<h3>The vehicle electrical system</h3>
<ul>
<li><strong>12 V bus</strong> — the battery stores energy; the <strong>alternator</strong> (AC + rectifier) recharges it while running.</li>
<li><strong>Protection &amp; switching</strong> — <strong>fuses</strong> open on overcurrent; <strong>relays</strong> let a small signal switch a large load.</li>
<li><strong>ECUs &amp; the network</strong> — dozens of Electronic Control Units talk over a <strong>CAN bus</strong>, a robust two-wire differential network built for the noisy electrical environment of a car.</li>
</ul>
<h3>The microcontroller (MCU)</h3>
<p>An <strong>MCU</strong> is a whole computer on one chip — <strong>CPU + memory + peripherals</strong>. The peripherals are where your software touches the physical world:</p>
<ul>
<li><strong>GPIO</strong> — digital in/out pins (read a switch, drive a MOSFET).</li>
<li><strong>ADC</strong> — turns a sensor's analog voltage into a number.</li>
<li><strong>Timer / PWM</strong> — precise timing and duty-cycle outputs for motors and lights.</li>
<li><strong>Communication</strong> — UART, SPI, I2C, CAN to talk to other chips and ECUs.</li>
</ul>
<pre><code>ADC reading -> voltage -> physical value (10-bit ADC, Vref = 5 V):
  step   = Vref / (2^10 - 1) = 5 / 1023 = 4.89 mV per count
  count 512 -> V = 512 x 4.89 mV = 2.50 V
  (a divider/formula then maps 2.50 V to the sensor's units)
</code></pre>
<div class="callout"><span class="badge">Where software meets hardware</span> Every line of automotive code eventually becomes a GPIO level, an ADC reading, or a PWM duty cycle. Understanding these registers is what turns a programmer into an embedded engineer.</div>`,
    `<span class="eyebrow">EEI101 · Chương 8 · Bài 8.1</span>
<h2>Hệ thống điện ô tô &amp; vi điều khiển</h2>
<h3>Hệ thống điện trên xe</h3>
<ul>
<li><strong>Bus 12 V</strong> — ắc-quy trữ năng lượng; <strong>máy phát</strong> (AC + chỉnh lưu) nạp lại khi xe chạy.</li>
<li><strong>Bảo vệ &amp; đóng cắt</strong> — <strong>cầu chì</strong> đứt khi quá dòng; <strong>rơ-le</strong> cho một tín hiệu nhỏ đóng cắt tải lớn.</li>
<li><strong>ECU &amp; mạng</strong> — hàng chục Hộp điều khiển điện tử nói chuyện qua <strong>bus CAN</strong>, một mạng vi sai hai dây bền vững, thiết kế cho môi trường điện nhiều nhiễu của xe.</li>
</ul>
<h3>Vi điều khiển (MCU)</h3>
<p>Một <strong>MCU</strong> là cả một máy tính trên một con chip — <strong>CPU + bộ nhớ + ngoại vi</strong>. Ngoại vi là nơi phần mềm của bạn chạm vào thế giới vật lý:</p>
<ul>
<li><strong>GPIO</strong> — chân vào/ra số (đọc công tắc, lái MOSFET).</li>
<li><strong>ADC</strong> — biến điện áp analog của cảm biến thành một con số.</li>
<li><strong>Timer / PWM</strong> — định thời chính xác và đầu ra chu kỳ nhiệm vụ cho motor và đèn.</li>
<li><strong>Truyền thông</strong> — UART, SPI, I2C, CAN để nói với các chip và ECU khác.</li>
</ul>
<pre><code>Giá trị ADC -> điện áp -> đại lượng vật lý (ADC 10 bit, Vref = 5 V):
  bước    = Vref / (2^10 - 1) = 5 / 1023 = 4.89 mV mỗi mức
  mức 512 -> V = 512 x 4.89 mV = 2.50 V
  (một công thức/chia áp sau đó ánh xạ 2.50 V ra đơn vị của cảm biến)
</code></pre>
<div class="callout"><span class="badge">Nơi phần mềm gặp phần cứng</span> Mọi dòng mã ô tô rốt cuộc trở thành một mức GPIO, một giá trị ADC, hoặc một chu kỳ PWM. Hiểu các thanh ghi này là thứ biến một lập trình viên thành kỹ sư nhúng.</div>`,
  ]]);

const c8q = quiz('eei101-quiz-8', 'Quiz 8 — Vehicle systems & MCU|||Quiz 8 — Hệ thống xe & MCU', [
  { id: 'q1', question: 'Thành phần nào nạp lại ắc-quy khi xe đang chạy?', options: ['Cầu chì', 'Máy phát (alternator)', 'Rơ-le', 'Cảm biến Hall'], correctIndex: 1, explanation: 'Máy phát tạo AC, diode chỉnh lưu để nạp ắc-quy 12 V.' },
  { id: 'q2', question: 'Ngoại vi nào của MCU biến điện áp analog của cảm biến thành con số?', options: ['GPIO', 'ADC', 'PWM', 'UART'], correctIndex: 1, explanation: 'ADC (bộ chuyển đổi tương tự-số) lượng tử hoá điện áp thành giá trị số.' },
  { id: 'q3', question: 'Các ECU trên xe thường giao tiếp với nhau qua mạng nào?', options: ['HDMI', 'Bus CAN', 'Wi-Fi', 'USB'], correctIndex: 1, explanation: 'CAN là mạng vi sai hai dây bền vững, chuẩn cho môi trường điện ô tô.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'EEI101',
    slug: 'eei101-introduction-to-electrical-electronics-engineering',
    title: 'Introduction to Electrical-Electronics Engineering',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/EEI101.webp',
    shortDescription: 'Electrical-electronics foundations for automotive software: Ohm/Kirchhoff, DC & AC circuits, semiconductors, op-amps, digital logic, automotive sensors & vehicle electrical systems. Bilingual with examples & quizzes.|||Nền điện-điện tử cho phần mềm ô tô: Ohm/Kirchhoff, mạch DC & AC, bán dẫn, op-amp, logic số, cảm biến & hệ thống điện ô tô. Song ngữ, ví dụ & quiz.',
    description: 'Môn <strong>EEI101 — Introduction to Electrical-Electronics Engineering</strong> (kỳ 1, ngành Kỹ thuật phần mềm ô tô) trang bị hiểu biết phần cứng nền tảng cho kỹ sư phần mềm ô tô. Từ <strong>đại lượng điện &amp; định luật</strong> (Ohm, Kirchhoff) → <strong>phân tích mạch DC</strong> → <strong>mạch AC &amp; công suất</strong> → <strong>linh kiện bán dẫn</strong> (diode, BJT, MOSFET) → <strong>op-amp &amp; khuếch đại</strong> → <strong>điện tử số</strong> (cổng logic, đại số Boole) → <strong>cảm biến &amp; cơ cấu chấp hành</strong> → <strong>hệ thống điện ô tô &amp; vi điều khiển</strong>. Bám giáo trình chuẩn (Hambley, Sedra/Smith, Boylestad, Floyd), song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Áp/dòng/trở &amp; định luật Ohm; KVL/KCL; mạch nối tiếp/song song, chia áp, Thevenin; mạch AC, RMS, trở kháng, hệ số công suất; diode &amp; chỉnh lưu; BJT (beta) &amp; MOSFET (Vgs); op-amp (đảo/không đảo, độ lợi); cổng logic &amp; đại số Boole, De Morgan; cảm biến &amp; cơ cấu chấp hành ô tô, PWM; hệ 12V, CAN bus; vi điều khiển (GPIO, ADC, timer/PWM).',
    requirements: 'Toán/vật lý phổ thông (điện cơ bản). Nên dùng mô phỏng mạch trực tuyến (Falstad, Multisim Live, Tinkercad Circuits) để thử lại các ví dụ.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, tài liệu miễn phí, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao cần điện-điện tử; áp/dòng/trở, Ohm; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Đại lượng & định luật|||Chapter 1 — Quantities & laws', description: 'Áp/dòng/trở/công suất, Ohm, Kirchhoff KVL/KCL.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Phân tích mạch DC|||Chapter 2 — DC analysis', description: 'Nối tiếp/song song, chia áp/dòng, nodal, Thevenin.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Mạch AC & công suất|||Chapter 3 — AC & power', description: 'Sin, RMS, trở kháng, công suất & hệ số công suất.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Linh kiện bán dẫn|||Chapter 4 — Semiconductors', description: 'Diode, BJT (beta), MOSFET (Vgs), khoá & khuếch đại.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Op-amp & khuếch đại|||Chapter 5 — Op-amps', description: 'Op-amp lý tưởng, mạch đảo/không đảo, độ lợi.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Điện tử số|||Chapter 6 — Digital', description: 'Cổng logic, đại số Boole, bảng chân trị, De Morgan.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Cảm biến & chấp hành|||Chapter 7 — Sensors & actuators', description: 'Cảm biến ô tô, cơ cấu chấp hành, MOSFET & PWM.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Hệ thống điện & MCU|||Chapter 8 — Vehicle systems & MCU', description: 'Hệ 12V, máy phát, CAN, vi điều khiển (GPIO/ADC/PWM).', lessons: [c8, c8q] },
  ],
};
