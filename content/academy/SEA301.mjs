/**
 * SEA301 — Sensors and Actuators (Cảm biến và Cơ cấu chấp hành).
 * Ngành Robotics & AI FPTU, Kỳ 4. Khung chất lượng — 8 chương song ngữ VI+EN,
 * mỗi chương 1 DOCUMENT + 1 QUIZ 3 câu. Bám giáo trình chuẩn quốc tế:
 * Fraden "Handbook of Modern Sensors"; de Silva "Sensors and Actuators";
 * Bishop "The Mechatronics Handbook"; + datasheet linh kiện thật (Arduino).
 * ⚠️ Giữ NGUYÊN slug/semester/courseCode/thumbnailUrl. KHÔNG backtick lồng / ${} trong HTML;
 * & → &amp; trong content HTML; shortDescription dùng & thường.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('sea301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Fraden, de Silva, Bishop), datasheet, tài liệu Arduino, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">SEA301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Sensors and Actuators</strong> — how a robot perceives the world and acts on it — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal references and the datasheet-first workflow this field really runs on.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://link.springer.com/book/10.1007/978-3-319-19303-8" target="_blank" rel="noopener">Jacob Fraden — <em>Handbook of Modern Sensors</em> (Springer)</a> — the standard on sensor physics &amp; characteristics.</li>
<li><a href="https://www.routledge.com/Sensors-and-Actuators-Engineering-System-Instrumentation/deSilva/p/book/9781466506817" target="_blank" rel="noopener">Clarence de Silva — <em>Sensors and Actuators</em></a> — instrumentation &amp; control view.</li>
<li><a href="https://www.routledge.com/The-Mechatronics-Handbook/Bishop/p/book/9780849302572" target="_blank" rel="noopener">Robert Bishop — <em>The Mechatronics Handbook</em></a> — integration into mechatronic systems.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://docs.arduino.cc/" target="_blank" rel="noopener">Arduino Docs</a> — wiring, ADC, PWM, libraries for real sensor/actuator parts.</li>
<li><a href="https://learn.sparkfun.com/tutorials" target="_blank" rel="noopener">SparkFun Tutorials</a> — sensor hookup guides with datasheets.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@GreatScottLab" target="_blank" rel="noopener">GreatScott!</a> — practical motors, drivers &amp; sensor projects.</li>
<li><a href="https://www.youtube.com/@Paulmcwhorter" target="_blank" rel="noopener">Paul McWhorter</a> — Arduino sensor tutorials, step by step.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener">Tinkercad Circuits</a> — simulate sensors &amp; motors with Arduino in the browser.</li>
<li><a href="https://wokwi.com/" target="_blank" rel="noopener">Wokwi</a> — online Arduino/ESP32 simulator with sensor libraries.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — sensor vs actuator, transducer, characteristics (sensitivity, accuracy, resolution, range).</li>
<li><strong>Read datasheets</strong> — for every part, find its range, supply, output type (analog/digital) and interface.</li>
<li><strong>Go deeper</strong> — signal conditioning (amplify, filter, ADC, sampling, fusion) and motor control (DC/servo/stepper).</li>
<li><strong>Job-ready</strong> — wire a real sensor to an MCU, close a control loop, and debug with a multimeter/oscilloscope.</li>
</ol></div>`,
    `<span class="eyebrow">SEA301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Cảm biến &amp; Cơ cấu chấp hành</strong> — cách robot cảm nhận thế giới và tác động ngược lại — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp và quy trình đọc-datasheet mà lĩnh vực này thực sự vận hành.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://link.springer.com/book/10.1007/978-3-319-19303-8" target="_blank" rel="noopener">Jacob Fraden — <em>Handbook of Modern Sensors</em> (Springer)</a> — sách chuẩn về vật lý &amp; đặc tính cảm biến.</li>
<li><a href="https://www.routledge.com/Sensors-and-Actuators-Engineering-System-Instrumentation/deSilva/p/book/9781466506817" target="_blank" rel="noopener">Clarence de Silva — <em>Sensors and Actuators</em></a> — góc nhìn đo lường &amp; điều khiển.</li>
<li><a href="https://www.routledge.com/The-Mechatronics-Handbook/Bishop/p/book/9780849302572" target="_blank" rel="noopener">Robert Bishop — <em>The Mechatronics Handbook</em></a> — tích hợp vào hệ cơ điện tử.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://docs.arduino.cc/" target="_blank" rel="noopener">Arduino Docs</a> — đấu dây, ADC, PWM, thư viện cho linh kiện cảm biến/cơ cấu thật.</li>
<li><a href="https://learn.sparkfun.com/tutorials" target="_blank" rel="noopener">SparkFun Tutorials</a> — hướng dẫn ghép cảm biến kèm datasheet.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@GreatScottLab" target="_blank" rel="noopener">GreatScott!</a> — động cơ, driver &amp; dự án cảm biến thực tế.</li>
<li><a href="https://www.youtube.com/@Paulmcwhorter" target="_blank" rel="noopener">Paul McWhorter</a> — hướng dẫn cảm biến Arduino từng bước.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener">Tinkercad Circuits</a> — mô phỏng cảm biến &amp; động cơ với Arduino trên trình duyệt.</li>
<li><a href="https://wokwi.com/" target="_blank" rel="noopener">Wokwi</a> — trình mô phỏng Arduino/ESP32 trực tuyến kèm thư viện cảm biến.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — phân biệt cảm biến với cơ cấu chấp hành, transducer, đặc tính (độ nhạy, độ chính xác, độ phân giải, dải đo).</li>
<li><strong>Đọc datasheet</strong> — với mỗi linh kiện, tìm dải đo, nguồn, kiểu ngõ ra (analog/digital) và chuẩn giao tiếp.</li>
<li><strong>Đào sâu</strong> — xử lý tín hiệu (khuếch đại, lọc, ADC, lấy mẫu, fusion) và điều khiển động cơ (DC/servo/stepper).</li>
<li><strong>Sẵn sàng đi làm</strong> — đấu một cảm biến thật vào MCU, đóng một vòng điều khiển, và debug bằng đồng hồ vạn năng/oscilloscope.</li>
</ol></div>`,
  ]]);

const intro = doc('sea301-0-1-overview', 'Course overview: sensors & actuators|||Tổng quan: cảm biến & cơ cấu chấp hành',
  'Cảm biến (đọc thế giới) và cơ cấu chấp hành (tác động ngược lại) là hai đầu của mọi robot; lộ trình 8 chương: đặc tính → nguyên lý → cảm biến vị trí/môi trường → xử lý tín hiệu → cơ cấu điện & khác → tích hợp.',
  [[
    `<span class="eyebrow">SEA301 · Lesson 0.1 · Overview</span>
<h2>Sensors &amp; actuators — a robot's senses and muscles</h2>
<p class="lead">Every robot or mechatronic system runs the same loop: <strong>sense → decide → act</strong>. <strong>Sensors</strong> convert a physical quantity (light, temperature, position, distance) into an electrical signal the controller can read. <strong>Actuators</strong> do the reverse — they convert electrical commands into physical motion or force.</p>
<h3>The sense-decide-act loop</h3>
<pre><code>Physical world
   -> Sensor      (transducer: physical -> electrical)
   -> Signal cond. (amplify, filter, ADC)
   -> Controller  (MCU decides)
   -> Driver      (power stage)
   -> Actuator    (electrical -> motion/force)
   -> Physical world  (loop closes)
</code></pre>
<h3>Roadmap</h3>
<p>Ch1 characteristics &amp; classification → Ch2 sensing principles &amp; calibration → Ch3 position/motion sensors → Ch4 environmental sensors → Ch5 signal conditioning → Ch6 electric actuators → Ch7 other actuators → Ch8 integration with an MCU. Bilingual, with real parts and a quiz per chapter.</p>`,
    `<span class="eyebrow">SEA301 · Bài 0.1 · Tổng quan</span>
<h2>Cảm biến &amp; cơ cấu chấp hành — giác quan và cơ bắp của robot</h2>
<p class="lead">Mọi robot hay hệ cơ điện tử đều chạy cùng một vòng: <strong>cảm nhận → quyết định → hành động</strong>. <strong>Cảm biến</strong> biến một đại lượng vật lý (ánh sáng, nhiệt độ, vị trí, khoảng cách) thành tín hiệu điện để bộ điều khiển đọc được. <strong>Cơ cấu chấp hành</strong> làm ngược lại — biến lệnh điện thành chuyển động hoặc lực thật.</p>
<h3>Vòng cảm nhận - quyết định - hành động</h3>
<pre><code>Thế giới vật lý
   -> Cảm biến    (transducer: vật lý -> điện)
   -> Xử lý tín hiệu (khuếch đại, lọc, ADC)
   -> Bộ điều khiển (MCU quyết định)
   -> Driver      (tầng công suất)
   -> Cơ cấu      (điện -> chuyển động/lực)
   -> Thế giới vật lý  (vòng khép lại)
</code></pre>
<h3>Lộ trình</h3>
<p>Ch1 đặc tính &amp; phân loại → Ch2 nguyên lý cảm biến &amp; hiệu chuẩn → Ch3 cảm biến vị trí/chuyển động → Ch4 cảm biến môi trường → Ch5 xử lý tín hiệu → Ch6 cơ cấu điện → Ch7 cơ cấu khác → Ch8 tích hợp với MCU. Song ngữ, có linh kiện thật và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('sea301-1-1-overview-classification', '1.1 — Sensors & actuators: roles & characteristics|||1.1 — Cảm biến & cơ cấu: vai trò & đặc tính',
  'Vai trò trong hệ cơ điện tử/robot; phân loại (theo đại lượng đo, active/passive, analog/digital); đặc tính then chốt: độ nhạy, độ chính xác, độ phân giải, dải đo, độ tuyến tính.',
  [[
    `<span class="eyebrow">SEA301 · Chapter 1 · Lesson 1.1</span>
<h2>Roles &amp; characteristics</h2>
<h3>Where they sit in a robot</h3>
<p>A <strong>sensor</strong> is the input transducer, an <strong>actuator</strong> the output transducer. In a mechatronic system the controller is only as good as the data its sensors give and the actuators it can command.</p>
<h3>Ways to classify</h3>
<ul>
<li><strong>By measured quantity</strong> — position, motion, temperature, pressure, light, distance.</li>
<li><strong>Active vs passive</strong> — active sensors need excitation power (e.g. a thermistor driven by a current); passive ones self-generate a signal (e.g. a thermocouple, a photodiode).</li>
<li><strong>Analog vs digital output</strong> — a continuous voltage vs a bus value (I2C/SPI) or pulse.</li>
</ul>
<h3>The characteristics that appear on every datasheet</h3>
<ul>
<li><strong>Sensitivity</strong> — output change per unit input (e.g. 10 mV/°C for an LM35).</li>
<li><strong>Accuracy</strong> — how close a reading is to the true value; <strong>precision</strong> is repeatability, a different thing.</li>
<li><strong>Resolution</strong> — the smallest change that can be detected.</li>
<li><strong>Range (span)</strong> — the min-to-max input it can measure.</li>
<li><strong>Linearity, hysteresis, response time</strong> — how faithfully and how fast it tracks the input.</li>
</ul>
<div class="callout"><span class="badge">Accuracy &ne; precision</span> A sensor can be precise (same reading every time) yet inaccurate (that reading is off) — calibration fixes accuracy, not scatter.</div>`,
    `<span class="eyebrow">SEA301 · Chương 1 · Bài 1.1</span>
<h2>Vai trò &amp; đặc tính</h2>
<h3>Chúng nằm ở đâu trong robot</h3>
<p><strong>Cảm biến</strong> là transducer ngõ vào, <strong>cơ cấu chấp hành</strong> là transducer ngõ ra. Trong hệ cơ điện tử, bộ điều khiển chỉ tốt bằng dữ liệu mà cảm biến cấp và cơ cấu mà nó ra lệnh được.</p>
<h3>Các cách phân loại</h3>
<ul>
<li><strong>Theo đại lượng đo</strong> — vị trí, chuyển động, nhiệt độ, áp suất, ánh sáng, khoảng cách.</li>
<li><strong>Chủ động và thụ động</strong> — cảm biến chủ động cần nguồn kích (vd nhiệt điện trở được cấp dòng); cảm biến thụ động tự sinh tín hiệu (vd cặp nhiệt điện, photodiode).</li>
<li><strong>Ngõ ra analog và digital</strong> — điện áp liên tục, hay giá trị trên bus (I2C/SPI) hoặc xung.</li>
</ul>
<h3>Những đặc tính có trên mọi datasheet</h3>
<ul>
<li><strong>Độ nhạy (sensitivity)</strong> — mức thay đổi ngõ ra trên một đơn vị ngõ vào (vd 10 mV/°C với LM35).</li>
<li><strong>Độ chính xác (accuracy)</strong> — số đọc gần giá trị thật đến đâu; <strong>độ chụm (precision)</strong> là khả năng lặp lại, là thứ khác.</li>
<li><strong>Độ phân giải (resolution)</strong> — mức thay đổi nhỏ nhất phát hiện được.</li>
<li><strong>Dải đo (range/span)</strong> — khoảng min-max ngõ vào đo được.</li>
<li><strong>Độ tuyến tính, trễ (hysteresis), thời gian đáp ứng</strong> — bám ngõ vào trung thực và nhanh đến đâu.</li>
</ul>
<div class="callout"><span class="badge">Chính xác &ne; chụm</span> Một cảm biến có thể chụm (đọc giống nhau mỗi lần) mà vẫn không chính xác (số đó lệch) — hiệu chuẩn sửa được độ chính xác, không sửa được độ tản.</div>`,
  ]]);

const c1q = quiz('sea301-quiz-1', 'Quiz 1 — Roles & characteristics|||Quiz 1 — Vai trò & đặc tính', [
  { id: 'q1', question: 'A sensor converts…|||Cảm biến biến đổi…', options: ['an electrical command into motion|||lệnh điện thành chuyển động', 'a physical quantity into an electrical signal|||đại lượng vật lý thành tín hiệu điện', 'DC into AC|||DC thành AC', 'analog into torque|||analog thành mô-men'], correctIndex: 1, explanation: 'Cảm biến là transducer ngõ vào: vật lý → điện. Cơ cấu chấp hành làm ngược lại.' },
  { id: 'q2', question: 'Which characteristic is output change per unit input?|||Đặc tính nào là mức thay đổi ngõ ra trên một đơn vị ngõ vào?', options: ['Accuracy|||Độ chính xác', 'Resolution|||Độ phân giải', 'Sensitivity|||Độ nhạy', 'Range|||Dải đo'], correctIndex: 2, explanation: 'Độ nhạy = Δngõ ra / Δngõ vào, vd 10 mV/°C.' },
  { id: 'q3', question: 'A sensor reads the same value each time but that value is wrong. It is…|||Cảm biến đọc cùng một giá trị mỗi lần nhưng giá trị đó sai. Nó…', options: ['accurate but not precise|||chính xác nhưng không chụm', 'precise but not accurate|||chụm nhưng không chính xác', 'both|||cả hai', 'neither measurable|||không đo được'], correctIndex: 1, explanation: 'Lặp lại tốt = chụm; lệch giá trị thật = không chính xác. Hiệu chuẩn sửa được.' },
]);

const c2 = doc('sea301-2-1-sensing-principles', '2.1 — Sensing principles & calibration|||2.1 — Nguyên lý cảm biến & hiệu chuẩn',
  'Nguyên lý transducer (điện trở/điện dung/áp điện/quang); ngõ ra analog vs digital; hiệu chuẩn (offset & gain); nhiễu và tỉ số tín hiệu trên nhiễu.',
  [[
    `<span class="eyebrow">SEA301 · Chapter 2 · Lesson 2.1</span>
<h2>Sensing principles &amp; calibration</h2>
<h3>How transducers turn physics into volts</h3>
<ul>
<li><strong>Resistive</strong> — resistance changes with the input (thermistor with temperature, potentiometer with angle, strain gauge with force).</li>
<li><strong>Capacitive</strong> — capacitance changes with distance/humidity (touch pads, humidity sensors).</li>
<li><strong>Piezoelectric</strong> — mechanical stress generates a charge (accelerometers, microphones).</li>
<li><strong>Optical</strong> — light changes current in a photodiode/phototransistor.</li>
</ul>
<h3>Analog vs digital output</h3>
<p>An <strong>analog</strong> sensor gives a continuous voltage you must digitize with an ADC. A <strong>digital</strong> sensor does the conversion inside and hands you a number over I2C/SPI/UART — less noise pickup, but you trust its internal ADC.</p>
<h3>Calibration — two knobs</h3>
<pre><code>reading = gain * raw + offset
  offset -> fixes a constant error (zero point)
  gain   -> fixes the slope (scale)
Two known points (e.g. 0 &deg;C ice, 100 &deg;C boiling) solve both.
</code></pre>
<h3>Noise</h3>
<p>Every signal carries <strong>noise</strong> — thermal, electromagnetic, quantization. What matters is the <strong>signal-to-noise ratio (SNR)</strong>; averaging, shielding and filtering (Ch5) raise it.</p>
<div class="callout"><span class="badge">Datasheet first</span> Before wiring anything, read the transducer principle, the output type and the calibration curve — it tells you what conditioning the signal needs.</div>`,
    `<span class="eyebrow">SEA301 · Chương 2 · Bài 2.1</span>
<h2>Nguyên lý cảm biến &amp; hiệu chuẩn</h2>
<h3>Transducer biến vật lý thành volt thế nào</h3>
<ul>
<li><strong>Điện trở</strong> — điện trở đổi theo ngõ vào (nhiệt điện trở theo nhiệt độ, biến trở theo góc, cảm biến lực strain gauge).</li>
<li><strong>Điện dung</strong> — điện dung đổi theo khoảng cách/độ ẩm (nút cảm ứng, cảm biến độ ẩm).</li>
<li><strong>Áp điện (piezo)</strong> — ứng suất cơ sinh ra điện tích (gia tốc kế, micro).</li>
<li><strong>Quang</strong> — ánh sáng làm đổi dòng trong photodiode/phototransistor.</li>
</ul>
<h3>Ngõ ra analog và digital</h3>
<p>Cảm biến <strong>analog</strong> cho điện áp liên tục, phải số hoá bằng ADC. Cảm biến <strong>digital</strong> chuyển đổi bên trong rồi trả về một con số qua I2C/SPI/UART — ít nhiễu bắt vào hơn, nhưng bạn phải tin ADC nội bộ của nó.</p>
<h3>Hiệu chuẩn — hai núm vặn</h3>
<pre><code>số đọc = gain * thô + offset
  offset -> sửa sai số cố định (điểm 0)
  gain   -> sửa độ dốc (thang đo)
Hai điểm đã biết (vd 0 &deg;C nước đá, 100 &deg;C nước sôi) giải ra cả hai.
</code></pre>
<h3>Nhiễu</h3>
<p>Mọi tín hiệu đều mang <strong>nhiễu</strong> — nhiệt, điện từ, lượng tử hoá. Cái quan trọng là <strong>tỉ số tín hiệu trên nhiễu (SNR)</strong>; lấy trung bình, bọc chống nhiễu và lọc (Ch5) làm nó cao lên.</p>
<div class="callout"><span class="badge">Đọc datasheet trước</span> Trước khi đấu bất cứ thứ gì, đọc nguyên lý transducer, kiểu ngõ ra và đường cong hiệu chuẩn — nó cho biết tín hiệu cần xử lý những gì.</div>`,
  ]]);

const c2q = quiz('sea301-quiz-2', 'Quiz 2 — Sensing principles|||Quiz 2 — Nguyên lý cảm biến', [
  { id: 'q1', question: 'A thermistor senses temperature by changing its…|||Nhiệt điện trở cảm nhận nhiệt độ bằng cách thay đổi…', options: ['capacitance|||điện dung', 'resistance|||điện trở', 'charge|||điện tích', 'inductance|||điện cảm'], correctIndex: 1, explanation: 'Nhiệt điện trở là cảm biến kiểu điện trở: R đổi theo nhiệt độ.' },
  { id: 'q2', question: 'In "reading = gain × raw + offset", which knob fixes the zero point?|||Trong "số đọc = gain × thô + offset", núm nào sửa điểm 0?', options: ['gain', 'offset', 'both|||cả hai', 'neither|||không núm nào'], correctIndex: 1, explanation: 'Offset sửa sai số cố định (điểm 0); gain sửa độ dốc/thang đo.' },
  { id: 'q3', question: 'An advantage of a digital (I2C) sensor over a raw analog one is…|||Ưu điểm của cảm biến digital (I2C) so với analog thô là…', options: ['it needs no power|||không cần nguồn', 'it picks up less wiring noise since conversion is internal|||ít bắt nhiễu đường dây hơn vì chuyển đổi bên trong', 'it is always more accurate|||luôn chính xác hơn', 'it needs no calibration ever|||không bao giờ cần hiệu chuẩn'], correctIndex: 1, explanation: 'Số hoá bên trong rồi truyền số qua bus nên ít nhiễu bắt vào dây tín hiệu.' },
]);

const c3 = doc('sea301-3-1-position-motion', '3.1 — Position & motion sensors|||3.1 — Cảm biến vị trí & chuyển động',
  'Encoder (incremental/absolute), potentiometer, IMU (accelerometer + gyroscope), cảm biến Hall; đo góc, tốc độ, gia tốc, hướng; linh kiện thật: MPU-6050, AS5600, A3144.',
  [[
    `<span class="eyebrow">SEA301 · Chapter 3 · Lesson 3.1</span>
<h2>Position &amp; motion sensors</h2>
<h3>Encoders — counting motion</h3>
<p>A rotary <strong>encoder</strong> reports shaft angle/rotation. An <strong>incremental</strong> encoder emits quadrature pulses (A/B) — direction from which channel leads, speed from pulse rate. An <strong>absolute</strong> encoder gives a unique code per position, so it knows where it is at power-on. A magnetic absolute part like the <strong>AS5600</strong> outputs 12-bit angle (0-4095) over I2C.</p>
<h3>Potentiometer — cheap absolute angle</h3>
<p>A <strong>potentiometer</strong> is a variable voltage divider; the wiper voltage maps to angle. Simple and absolute, but limited turns and wear.</p>
<h3>IMU — accelerometer + gyroscope</h3>
<ul>
<li><strong>Accelerometer</strong> — measures acceleration incl. gravity, so it gives tilt (roll/pitch) but is noisy under motion.</li>
<li><strong>Gyroscope</strong> — measures angular rate; integrate for angle, but it drifts over time.</li>
</ul>
<p>The classic 6-axis part is the <strong>MPU-6050</strong> (3-axis accel + 3-axis gyro, I2C). Ch5's sensor fusion blends the two to cancel each other's weakness.</p>
<h3>Hall-effect sensor</h3>
<p>A <strong>Hall sensor</strong> outputs a voltage in a magnetic field — used for contactless position, RPM (a magnet on a wheel), and current sensing. The <strong>A3144</strong> is a common digital Hall switch.</p>
<div class="callout"><span class="badge">Pick by need</span> Need absolute angle at boot? Absolute encoder or pot. Just speed/steps? Incremental encoder. Orientation in 3D? An IMU with fusion.</div>`,
    `<span class="eyebrow">SEA301 · Chương 3 · Bài 3.1</span>
<h2>Cảm biến vị trí &amp; chuyển động</h2>
<h3>Encoder — đếm chuyển động</h3>
<p><strong>Encoder</strong> quay báo góc/số vòng của trục. Encoder <strong>tương đối (incremental)</strong> phát xung vuông pha (A/B) — chiều quay biết nhờ kênh nào dẫn trước, tốc độ nhờ tần suất xung. Encoder <strong>tuyệt đối (absolute)</strong> cho một mã riêng cho mỗi vị trí, nên biết mình ở đâu ngay khi cấp nguồn. Linh kiện từ tính tuyệt đối như <strong>AS5600</strong> cho góc 12-bit (0-4095) qua I2C.</p>
<h3>Biến trở — góc tuyệt đối giá rẻ</h3>
<p><strong>Biến trở (potentiometer)</strong> là một bộ chia áp thay đổi được; điện áp con trượt ứng với góc. Đơn giản và tuyệt đối, nhưng giới hạn số vòng và bị mòn.</p>
<h3>IMU — gia tốc kế + con quay hồi chuyển</h3>
<ul>
<li><strong>Gia tốc kế (accelerometer)</strong> — đo gia tốc kể cả trọng lực, nên cho góc nghiêng (roll/pitch) nhưng nhiễu khi đang chuyển động.</li>
<li><strong>Con quay (gyroscope)</strong> — đo vận tốc góc; tích phân ra góc, nhưng bị trôi theo thời gian.</li>
</ul>
<p>Linh kiện 6 trục kinh điển là <strong>MPU-6050</strong> (3 trục gia tốc + 3 trục con quay, I2C). Sensor fusion ở Ch5 trộn hai cái để triệt điểm yếu của nhau.</p>
<h3>Cảm biến Hall</h3>
<p><strong>Cảm biến Hall</strong> cho ra điện áp khi ở trong từ trường — dùng đo vị trí không tiếp xúc, đo vòng/phút (gắn nam châm lên bánh xe) và đo dòng điện. <strong>A3144</strong> là công tắc Hall số phổ biến.</p>
<div class="callout"><span class="badge">Chọn theo nhu cầu</span> Cần góc tuyệt đối ngay lúc bật? Encoder tuyệt đối hoặc biến trở. Chỉ cần tốc độ/số bước? Encoder tương đối. Định hướng trong không gian 3D? IMU kèm fusion.</div>`,
  ]]);

const c3q = quiz('sea301-quiz-3', 'Quiz 3 — Position & motion|||Quiz 3 — Vị trí & chuyển động', [
  { id: 'q1', question: 'Which sensor knows its exact position immediately at power-on?|||Cảm biến nào biết vị trí chính xác của mình ngay khi cấp nguồn?', options: ['Incremental encoder|||Encoder tương đối', 'Absolute encoder|||Encoder tuyệt đối', 'Gyroscope|||Con quay hồi chuyển', 'A bare Hall switch|||Công tắc Hall trần'], correctIndex: 1, explanation: 'Encoder tuyệt đối cho mã riêng mỗi vị trí; incremental phải đếm từ lúc bật.' },
  { id: 'q2', question: 'A gyroscope integrated to get angle suffers from…|||Con quay hồi chuyển tích phân ra góc bị vấn đề…', options: ['gravity offset|||lệch do trọng lực', 'drift over time|||trôi theo thời gian', 'no output|||không có ngõ ra', 'infinite range|||dải vô hạn'], correctIndex: 1, explanation: 'Tích phân vận tốc góc cộng dồn sai số → trôi; accelerometer bù bằng fusion.' },
  { id: 'q3', question: 'The MPU-6050 combines which two sensors?|||MPU-6050 gồm hai cảm biến nào?', options: ['accelerometer + gyroscope|||gia tốc kế + con quay', 'lidar + camera', 'thermistor + LDR', 'encoder + Hall'], correctIndex: 0, explanation: 'MPU-6050 là IMU 6 trục: 3 trục gia tốc + 3 trục con quay, giao tiếp I2C.' },
]);

const c4 = doc('sea301-4-1-environmental', '4.1 — Environmental & distance sensors|||4.1 — Cảm biến môi trường & khoảng cách',
  'Nhiệt độ (LM35, DS18B20, NTC), áp suất (BMP280), ánh sáng (LDR, BH1750), khoảng cách (siêu âm HC-SR04, hồng ngoại Sharp, lidar TF-Luna); dải đo và cách chọn.',
  [[
    `<span class="eyebrow">SEA301 · Chapter 4 · Lesson 4.1</span>
<h2>Environmental &amp; distance sensors</h2>
<h3>Temperature</h3>
<ul>
<li><strong>LM35</strong> — analog, 10 mV/&deg;C, no calibration, -55 to 150 &deg;C.</li>
<li><strong>NTC thermistor (10 k)</strong> — resistive, cheap, non-linear (Steinhart-Hart).</li>
<li><strong>DS18B20</strong> — digital, 1-Wire, factory-calibrated, &plusmn;0.5 &deg;C.</li>
</ul>
<h3>Pressure &amp; light</h3>
<ul>
<li><strong>BMP280</strong> — barometric pressure/altitude, I2C/SPI, 300-1100 hPa.</li>
<li><strong>LDR (photoresistor)</strong> — analog, resistance falls with light; cheap ambient sensing.</li>
<li><strong>BH1750</strong> — digital lux meter over I2C, calibrated in real units.</li>
</ul>
<h3>Distance — three families</h3>
<pre><code>Ultrasonic HC-SR04 : 2-400 cm, ~3mm res, cheap, wide beam
                     distance = (echo_us / 58) cm
IR (Sharp GP2Y0A21): 10-80 cm, analog, narrow, cheap
Lidar (TF-Luna)    : 0.2-8 m, laser ToF, precise, more $$$
</code></pre>
<p>Ultrasonic times an echo pulse; IR triangulates a reflected beam; lidar measures laser time-of-flight. Beam width, range and cost drive the choice.</p>
<div class="callout"><span class="badge">Match to the job</span> Obstacle stop on a small robot &rarr; HC-SR04. Precise mapping &rarr; lidar. Absolute temperature you can trust out of the box &rarr; DS18B20.</div>`,
    `<span class="eyebrow">SEA301 · Chương 4 · Bài 4.1</span>
<h2>Cảm biến môi trường &amp; khoảng cách</h2>
<h3>Nhiệt độ</h3>
<ul>
<li><strong>LM35</strong> — analog, 10 mV/&deg;C, không cần hiệu chuẩn, -55 đến 150 &deg;C.</li>
<li><strong>NTC 10 k</strong> — kiểu điện trở, rẻ, phi tuyến (dùng Steinhart-Hart).</li>
<li><strong>DS18B20</strong> — digital, 1-Wire, hiệu chuẩn sẵn từ nhà máy, &plusmn;0,5 &deg;C.</li>
</ul>
<h3>Áp suất &amp; ánh sáng</h3>
<ul>
<li><strong>BMP280</strong> — áp suất khí/độ cao, I2C/SPI, 300-1100 hPa.</li>
<li><strong>LDR (quang trở)</strong> — analog, điện trở giảm khi sáng; đo ánh sáng môi trường giá rẻ.</li>
<li><strong>BH1750</strong> — đo lux dạng digital qua I2C, đơn vị thật đã hiệu chuẩn.</li>
</ul>
<h3>Khoảng cách — ba họ</h3>
<pre><code>Siêu âm HC-SR04 : 2-400 cm, phân giải ~3mm, rẻ, chùm rộng
                  khoảng cách = (echo_us / 58) cm
Hồng ngoại Sharp: 10-80 cm, analog, chùm hẹp, rẻ
Lidar TF-Luna   : 0,2-8 m, laser ToF, chính xác, đắt hơn
</code></pre>
<p>Siêu âm đo thời gian xung vọng; hồng ngoại tam giác hoá chùm phản xạ; lidar đo thời gian bay của laser. Bề rộng chùm, dải đo và giá quyết định lựa chọn.</p>
<div class="callout"><span class="badge">Chọn đúng việc</span> Dừng trước vật cản cho robot nhỏ &rarr; HC-SR04. Lập bản đồ chính xác &rarr; lidar. Nhiệt độ tuyệt đối tin được ngay &rarr; DS18B20.</div>`,
  ]]);

const c4q = quiz('sea301-quiz-4', 'Quiz 4 — Environmental & distance|||Quiz 4 — Môi trường & khoảng cách', [
  { id: 'q1', question: 'The HC-SR04 measures distance by…|||HC-SR04 đo khoảng cách bằng cách…', options: ['triangulating an IR beam|||tam giác hoá chùm hồng ngoại', 'timing an ultrasonic echo pulse|||đo thời gian xung siêu âm vọng về', 'reading a magnetic field|||đọc từ trường', 'counting light photons|||đếm photon ánh sáng'], correctIndex: 1, explanation: 'Siêu âm: phát xung, đo thời gian vọng; khoảng cách ≈ echo_us / 58 cm.' },
  { id: 'q2', question: 'Which temperature sensor is digital and factory-calibrated?|||Cảm biến nhiệt nào là digital và hiệu chuẩn sẵn từ nhà máy?', options: ['LM35', 'NTC 10k', 'DS18B20', 'LDR'], correctIndex: 2, explanation: 'DS18B20 giao tiếp 1-Wire, hiệu chuẩn sẵn ±0,5 °C; LM35 là analog.' },
  { id: 'q3', question: 'For precise long-range mapping you would prefer…|||Để lập bản đồ chính xác tầm xa bạn nên chọn…', options: ['an LDR|||một quang trở', 'a lidar (laser ToF)|||một lidar (laser ToF)', 'a potentiometer|||một biến trở', 'a thermistor|||một nhiệt điện trở'], correctIndex: 1, explanation: 'Lidar đo thời gian bay của laser: dải xa, chính xác hơn siêu âm/hồng ngoại.' },
]);

const c5 = doc('sea301-5-1-signal-conditioning', '5.1 — Signal conditioning & fusion|||5.1 — Xử lý tín hiệu & fusion',
  'Khuếch đại (op-amp, gain), lọc (thông thấp RC chống nhiễu), ADC (độ phân giải bit, Arduino 10-bit, ESP32 12-bit), lấy mẫu (Nyquist), fusion cơ bản (complementary filter).',
  [[
    `<span class="eyebrow">SEA301 · Chapter 5 · Lesson 5.1</span>
<h2>Signal conditioning &amp; fusion</h2>
<h3>Amplify</h3>
<p>Many sensors output millivolts. An <strong>op-amp</strong> raises that to the ADC's full range so you use all its resolution (non-inverting gain = 1 + Rf/Rin).</p>
<h3>Filter</h3>
<p>A <strong>low-pass RC filter</strong> removes high-frequency noise: cutoff f = 1 / (2&pi;RC). Filter <em>before</em> the ADC to stop noise being sampled in.</p>
<h3>ADC — turning volts into numbers</h3>
<pre><code>steps = 2^bits
Arduino Uno 10-bit -> 0..1023   (5V/1024 ~= 4.9 mV/step)
ESP32       12-bit -> 0..4095
value = raw * Vref / (2^bits)
</code></pre>
<h3>Sampling — Nyquist</h3>
<p>Sample at <strong>more than twice</strong> the highest signal frequency, or fast changes alias into false low-frequency readings. Audio at 20 kHz &rarr; sample &gt; 40 kHz.</p>
<h3>Fusion — the complementary filter</h3>
<pre><code>angle = 0.98*(angle + gyro*dt) + 0.02*accel_angle
  gyro  -> smooth short term (but drifts)
  accel -> stable long term (but noisy)
</code></pre>
<p>Fusion blends an IMU's gyro and accelerometer so each covers the other's weakness — the practical heart of orientation estimation.</p>
<div class="callout"><span class="badge">Order matters</span> amplify &rarr; filter &rarr; ADC &rarr; fuse. Filtering after sampling cannot remove noise that already aliased.</div>`,
    `<span class="eyebrow">SEA301 · Chương 5 · Bài 5.1</span>
<h2>Xử lý tín hiệu &amp; fusion</h2>
<h3>Khuếch đại</h3>
<p>Nhiều cảm biến cho ra vài milivolt. Một <strong>op-amp</strong> nâng nó lên đủ tầm ngõ vào ADC để tận dụng hết độ phân giải (gain không đảo = 1 + Rf/Rin).</p>
<h3>Lọc</h3>
<p>Bộ <strong>lọc thông thấp RC</strong> loại nhiễu tần cao: tần cắt f = 1 / (2&pi;RC). Lọc <em>trước</em> ADC để nhiễu không bị lấy mẫu vào.</p>
<h3>ADC — biến volt thành số</h3>
<pre><code>số mức = 2^bit
Arduino Uno 10-bit -> 0..1023   (5V/1024 ~= 4,9 mV/mức)
ESP32       12-bit -> 0..4095
giá trị = thô * Vref / (2^bit)
</code></pre>
<h3>Lấy mẫu — Nyquist</h3>
<p>Lấy mẫu ở tần số <strong>hơn gấp đôi</strong> tần số cao nhất của tín hiệu, nếu không biến thiên nhanh sẽ aliasing thành số đọc tần thấp giả. Âm thanh 20 kHz &rarr; lấy mẫu &gt; 40 kHz.</p>
<h3>Fusion — bộ lọc bù (complementary)</h3>
<pre><code>góc = 0,98*(góc + gyro*dt) + 0,02*góc_accel
  gyro  -> mượt ngắn hạn (nhưng trôi)
  accel -> ổn dài hạn (nhưng nhiễu)
</code></pre>
<p>Fusion trộn con quay và gia tốc kế của IMU để cái này bù điểm yếu cái kia — cốt lõi thực dụng của việc ước lượng hướng.</p>
<div class="callout"><span class="badge">Thứ tự quan trọng</span> khuếch đại &rarr; lọc &rarr; ADC &rarr; fusion. Lọc sau khi lấy mẫu không thể gỡ nhiễu đã aliasing.</div>`,
  ]]);

const c5q = quiz('sea301-quiz-5', 'Quiz 5 — Signal conditioning|||Quiz 5 — Xử lý tín hiệu', [
  { id: 'q1', question: 'A 10-bit ADC produces how many discrete levels?|||ADC 10-bit cho ra bao nhiêu mức rời rạc?', options: ['100', '1000', '1024', '4095'], correctIndex: 2, explanation: '2^10 = 1024 mức (0..1023). ESP32 12-bit cho 4096 mức.' },
  { id: 'q2', question: 'Nyquist says you must sample at…|||Nyquist nói phải lấy mẫu ở…', options: ['half the signal frequency|||nửa tần số tín hiệu', 'the same frequency|||đúng tần số đó', 'more than twice the highest frequency|||hơn gấp đôi tần số cao nhất', 'any rate|||tần số bất kỳ'], correctIndex: 2, explanation: 'Dưới 2× tần cao nhất → aliasing, biến thiên nhanh thành số đọc giả tần thấp.' },
  { id: 'q3', question: 'A complementary filter fuses gyro and accelerometer because…|||Bộ lọc bù trộn con quay và gia tốc kế vì…', options: ['both are perfect|||cả hai đều hoàn hảo', 'gyro is smooth short-term but drifts, accel is stable long-term but noisy|||gyro mượt ngắn hạn nhưng trôi, accel ổn dài hạn nhưng nhiễu', 'to save power|||để tiết kiệm điện', 'to increase range|||để tăng dải đo'], correctIndex: 1, explanation: 'Mỗi cảm biến bù điểm yếu của cái kia → ước lượng góc ổn định.' },
]);

const c6 = doc('sea301-6-1-electric-actuators', '6.1 — Electric actuators & control|||6.1 — Cơ cấu chấp hành điện & điều khiển',
  'Động cơ DC (PWM điều tốc, cầu H đảo chiều), servo (vị trí góc, PWM 50Hz), stepper (bước chính xác, 1.8°/bước); driver L298N, A4988; nguyên lý và điều khiển.',
  [[
    `<span class="eyebrow">SEA301 · Chapter 6 · Lesson 6.1</span>
<h2>Electric actuators &amp; control</h2>
<h3>DC motor</h3>
<p>Current in a magnetic field makes torque; speed &prop; average voltage. Control speed with <strong>PWM</strong> (duty cycle) and direction with an <strong>H-bridge</strong> (e.g. <strong>L298N</strong>). No built-in position feedback — add an encoder for that.</p>
<h3>Servo motor</h3>
<p>A hobby <strong>servo (SG90)</strong> is a DC motor + gearbox + potentiometer + control chip in a closed loop. You command an <em>angle</em> with a 50 Hz PWM pulse:</p>
<pre><code>50 Hz frame (20 ms period)
  1.0 ms pulse ->   0 deg
  1.5 ms pulse ->  90 deg (center)
  2.0 ms pulse -> 180 deg
</code></pre>
<h3>Stepper motor</h3>
<p>A <strong>stepper</strong> moves in fixed steps by energizing coils in sequence — open-loop position without an encoder. A typical <strong>NEMA 17</strong> is 1.8&deg;/step &rarr; 200 steps/rev; a driver like the <strong>A4988</strong> takes STEP/DIR pulses and does microstepping.</p>
<pre><code>DC     : fast, continuous, needs encoder for position
Servo  : bounded angle, built-in position loop
Stepper: precise open-loop steps, high holding torque, can miss steps if overloaded
</code></pre>
<div class="callout"><span class="badge">Command style</span> DC = "how fast / which way" (PWM + H-bridge). Servo = "what angle" (pulse width). Stepper = "how many steps / which direction" (STEP/DIR).</div>`,
    `<span class="eyebrow">SEA301 · Chương 6 · Bài 6.1</span>
<h2>Cơ cấu chấp hành điện &amp; điều khiển</h2>
<h3>Động cơ DC</h3>
<p>Dòng trong từ trường sinh mô-men; tốc độ &prop; điện áp trung bình. Điều tốc bằng <strong>PWM</strong> (chu kỳ nhiệm vụ) và đảo chiều bằng <strong>cầu H</strong> (vd <strong>L298N</strong>). Không có phản hồi vị trí sẵn — muốn có thì gắn encoder.</p>
<h3>Động cơ servo</h3>
<p>Một <strong>servo (SG90)</strong> đồ chơi là động cơ DC + hộp số + biến trở + chip điều khiển trong một vòng kín. Bạn ra lệnh một <em>góc</em> bằng xung PWM 50 Hz:</p>
<pre><code>Khung 50 Hz (chu kỳ 20 ms)
  xung 1,0 ms ->   0 do
  xung 1,5 ms ->  90 do (giữa)
  xung 2,0 ms -> 180 do
</code></pre>
<h3>Động cơ bước (stepper)</h3>
<p><strong>Động cơ bước</strong> di chuyển theo các bước cố định bằng cách cấp điện các cuộn theo trình tự — định vị vòng hở không cần encoder. Một <strong>NEMA 17</strong> điển hình 1,8&deg;/bước &rarr; 200 bước/vòng; driver như <strong>A4988</strong> nhận xung STEP/DIR và chạy vi bước (microstepping).</p>
<pre><code>DC     : nhanh, liên tục, cần encoder để định vị
Servo  : góc giới hạn, có vòng vị trí sẵn
Stepper: bước vòng hở chính xác, mô-men giữ lớn, quá tải sẽ mất bước
</code></pre>
<div class="callout"><span class="badge">Kiểu ra lệnh</span> DC = "nhanh bao nhiêu / chiều nào" (PWM + cầu H). Servo = "góc nào" (độ rộng xung). Stepper = "mấy bước / chiều nào" (STEP/DIR).</div>`,
  ]]);

const c6q = quiz('sea301-quiz-6', 'Quiz 6 — Electric actuators|||Quiz 6 — Cơ cấu điện', [
  { id: 'q1', question: 'You reverse a DC motor’s direction using…|||Bạn đảo chiều động cơ DC bằng…', options: ['PWM duty cycle|||chu kỳ nhiệm vụ PWM', 'an H-bridge|||một cầu H', 'a potentiometer|||một biến trở', 'a thermistor|||một nhiệt điện trở'], correctIndex: 1, explanation: 'Cầu H (vd L298N) đảo cực áp → đảo chiều; PWM chỉ chỉnh tốc độ.' },
  { id: 'q2', question: 'A hobby servo is commanded to an angle by varying…|||Servo đồ chơi được ra lệnh tới một góc bằng cách thay đổi…', options: ['supply voltage|||điện áp nguồn', 'PWM pulse width at 50 Hz|||độ rộng xung PWM ở 50 Hz', 'current only|||chỉ dòng điện', 'the frequency to 1 kHz|||tần số lên 1 kHz'], correctIndex: 1, explanation: 'Khung 50 Hz: ~1,0 ms→0°, 1,5 ms→90°, 2,0 ms→180°.' },
  { id: 'q3', question: 'A NEMA 17 stepper at 1.8°/step has how many steps per revolution?|||Stepper NEMA 17 1,8°/bước có bao nhiêu bước mỗi vòng?', options: ['100', '180', '200', '400'], correctIndex: 2, explanation: '360 / 1,8 = 200 bước/vòng (chưa tính vi bước của driver).' },
]);

const c7 = doc('sea301-7-1-other-actuators', '7.1 — Hydraulic, pneumatic & piezo actuators|||7.1 — Cơ cấu thuỷ lực, khí nén & áp điện',
  'Thuỷ lực (dầu, lực rất lớn), khí nén (khí, nhanh & sạch), áp điện (dịch chuyển siêu nhỏ, cực nhanh); nguyên lý, ưu nhược, so sánh với cơ cấu điện.',
  [[
    `<span class="eyebrow">SEA301 · Chapter 7 · Lesson 7.1</span>
<h2>Hydraulic, pneumatic &amp; piezoelectric actuators</h2>
<h3>Hydraulic — force by pressurized oil</h3>
<p>A pump pressurizes incompressible <strong>oil</strong> driving a piston. Huge force in a small package (excavators, presses, aircraft), and it holds position under load — but needs a pump, is heavy, and can leak.</p>
<h3>Pneumatic — motion by compressed air</h3>
<p>Compressed <strong>air</strong> drives a cylinder. Fast, clean, cheap and safe (no fire risk) — great for pick-and-place grippers. But air is compressible, so precise mid-stroke positioning is hard; usually used end-to-end.</p>
<h3>Piezoelectric — tiny, ultra-fast motion</h3>
<p>A voltage across a <strong>piezo</strong> crystal deforms it by micrometers, very fast. Used for precision positioning (microscope stages, inkjet nozzles, autofocus) and ultrasonic transducers.</p>
<pre><code>            Force   Speed   Precision   Notes
Electric  : med     high    high        clean, easy control
Hydraulic : v.high  med     med         holds load, heavy, leaks
Pneumatic : med     high    low(mid)    clean, cheap, compressible
Piezo     : low     v.high  v.high      micro-motion only
</code></pre>
<div class="callout"><span class="badge">Choose by demand</span> Massive lifting force &rarr; hydraulic. Fast clean on/off motion &rarr; pneumatic. Nanometer precision &rarr; piezo. General robotics &rarr; electric.</div>`,
    `<span class="eyebrow">SEA301 · Chương 7 · Bài 7.1</span>
<h2>Cơ cấu thuỷ lực, khí nén &amp; áp điện</h2>
<h3>Thuỷ lực — lực nhờ dầu nén áp</h3>
<p>Bơm nén <strong>dầu</strong> không nén được để đẩy piston. Lực rất lớn trong kích thước nhỏ (máy xúc, máy ép, máy bay), và giữ được vị trí dưới tải — nhưng cần bơm, nặng, và có thể rò rỉ.</p>
<h3>Khí nén — chuyển động nhờ khí nén</h3>
<p><strong>Khí</strong> nén đẩy một xy-lanh. Nhanh, sạch, rẻ và an toàn (không nguy cơ cháy) — rất hợp cho tay gắp gắp-thả. Nhưng khí nén được nên định vị chính xác giữa hành trình rất khó; thường chỉ dùng hai đầu.</p>
<h3>Áp điện — chuyển động siêu nhỏ, cực nhanh</h3>
<p>Đặt điện áp lên tinh thể <strong>áp điện (piezo)</strong> làm nó biến dạng vài micromet, rất nhanh. Dùng định vị siêu chính xác (bàn kính hiển vi, đầu phun mực, lấy nét tự động) và transducer siêu âm.</p>
<pre><code>            Luc     Toc do  Chinh xac   Ghi chu
Dien      : vua     cao     cao         sach, de dieu khien
Thuy luc  : rat lon vua     vua         giu tai, nang, ro ri
Khi nen   : vua     cao     thap(giua)  sach, re, khi nen duoc
Piezo     : thap    rat cao rat cao     chi vi chuyen dong
</code></pre>
<div class="callout"><span class="badge">Chọn theo yêu cầu</span> Lực nâng khổng lồ &rarr; thuỷ lực. Đóng/mở nhanh sạch &rarr; khí nén. Chính xác cỡ nanomet &rarr; piezo. Robot phổ thông &rarr; điện.</div>`,
  ]]);

const c7q = quiz('sea301-quiz-7', 'Quiz 7 — Other actuators|||Quiz 7 — Cơ cấu khác', [
  { id: 'q1', question: 'For the largest force in a compact actuator you choose…|||Muốn lực lớn nhất trong một cơ cấu nhỏ gọn bạn chọn…', options: ['pneumatic|||khí nén', 'hydraulic|||thuỷ lực', 'piezoelectric|||áp điện', 'a servo|||một servo'], correctIndex: 1, explanation: 'Thuỷ lực dùng dầu không nén được → lực rất lớn, giữ tải tốt (máy xúc, máy ép).' },
  { id: 'q2', question: 'Precise mid-stroke positioning is hard for pneumatics because…|||Định vị chính xác giữa hành trình khó với khí nén vì…', options: ['air is compressible|||khí nén được', 'air is heavy|||khí nặng', 'air leaks fire|||khí gây cháy', 'it has no piston|||nó không có piston'], correctIndex: 0, explanation: 'Khí nén được nên vị trí giữa hành trình khó giữ; thường dùng hai đầu hành trình.' },
  { id: 'q3', question: 'A piezoelectric actuator is best for…|||Cơ cấu áp điện hợp nhất cho…', options: ['heavy lifting|||nâng vật nặng', 'sub-micrometer precise motion|||chuyển động chính xác dưới micromet', 'continuous rotation|||quay liên tục', 'long strokes|||hành trình dài'], correctIndex: 1, explanation: 'Piezo biến dạng vài micromet cực nhanh → định vị siêu chính xác, không dùng cho hành trình lớn.' },
]);

const c8 = doc('sea301-8-1-integration', '8.1 — Integration with a microcontroller|||8.1 — Tích hợp với vi điều khiển',
  'Giao tiếp MCU (GPIO, ADC, PWM, I2C/SPI/UART), driver công suất, vòng điều khiển kín (feedback, PID), ví dụ robot dò line trên Arduino ghép cả cảm biến và cơ cấu.',
  [[
    `<span class="eyebrow">SEA301 · Chapter 8 · Lesson 8.1</span>
<h2>Integration with a microcontroller</h2>
<h3>How the MCU talks to parts</h3>
<ul>
<li><strong>GPIO</strong> — digital in/out (a button, a Hall switch, an LED).</li>
<li><strong>ADC</strong> — read analog sensors (LM35, LDR, pot).</li>
<li><strong>PWM</strong> — drive motor speed / servo angle.</li>
<li><strong>I2C / SPI / UART</strong> — digital sensor buses (MPU-6050, BMP280, lidar).</li>
</ul>
<h3>Never drive a motor from a GPIO pin</h3>
<p>MCU pins source only milliamps. A motor needs a <strong>driver</strong> (transistor/MOSFET, or an H-bridge like L298N, or A4988 for steppers) between the logic pin and the load — plus a flyback diode for inductive kick.</p>
<h3>Closing the loop — feedback &amp; PID</h3>
<pre><code>error = target - measured        (sensor gives 'measured')
output = Kp*error
       + Ki*integral(error)
       + Kd*derivative(error)     (drives the actuator)
</code></pre>
<p>An open loop just commands; a <strong>closed loop</strong> measures the result with a sensor and corrects — a <strong>PID</strong> controller is the workhorse (line-followers, balancing robots, temperature control).</p>
<h3>Worked example — Arduino line-follower</h3>
<p>Two IR sensors (Ch4) read the line; the MCU computes an error; PID sets two PWM values through an L298N (Ch6) to steer two DC motors — sense &rarr; decide &rarr; act, closed.</p>
<div class="callout"><span class="badge">The whole course in one loop</span> Sensor &rarr; conditioning &amp; ADC &rarr; controller (PID) &rarr; driver &rarr; actuator &rarr; back to the sensor. Every chapter is one link in it.</div>`,
    `<span class="eyebrow">SEA301 · Chương 8 · Bài 8.1</span>
<h2>Tích hợp với vi điều khiển</h2>
<h3>MCU nói chuyện với linh kiện thế nào</h3>
<ul>
<li><strong>GPIO</strong> — vào/ra số (nút nhấn, công tắc Hall, LED).</li>
<li><strong>ADC</strong> — đọc cảm biến analog (LM35, LDR, biến trở).</li>
<li><strong>PWM</strong> — điều tốc động cơ / góc servo.</li>
<li><strong>I2C / SPI / UART</strong> — bus cảm biến số (MPU-6050, BMP280, lidar).</li>
</ul>
<h3>Đừng bao giờ kéo động cơ trực tiếp từ chân GPIO</h3>
<p>Chân MCU chỉ cấp vài miliampe. Động cơ cần một <strong>driver</strong> (transistor/MOSFET, hoặc cầu H như L298N, hoặc A4988 cho stepper) đặt giữa chân logic và tải — kèm diode dập (flyback) cho xung cảm ứng.</p>
<h3>Khép vòng — phản hồi &amp; PID</h3>
<pre><code>sai số = mục tiêu - đo được      (cảm biến cho 'đo được')
ngõ ra = Kp*sai số
       + Ki*tích phân(sai số)
       + Kd*đạo hàm(sai số)       (điều khiển cơ cấu)
</code></pre>
<p>Vòng hở chỉ ra lệnh; <strong>vòng kín</strong> đo kết quả bằng cảm biến rồi sửa — bộ điều khiển <strong>PID</strong> là con ngựa thồ (robot dò line, robot cân bằng, điều khiển nhiệt độ).</p>
<h3>Ví dụ mẫu — robot dò line Arduino</h3>
<p>Hai cảm biến hồng ngoại (Ch4) đọc vạch; MCU tính sai số; PID đặt hai giá trị PWM qua L298N (Ch6) để lái hai động cơ DC — cảm nhận &rarr; quyết định &rarr; hành động, khép kín.</p>
<div class="callout"><span class="badge">Cả môn trong một vòng</span> Cảm biến &rarr; xử lý &amp; ADC &rarr; bộ điều khiển (PID) &rarr; driver &rarr; cơ cấu &rarr; quay lại cảm biến. Mỗi chương là một mắt xích trong đó.</div>`,
  ]]);

const c8q = quiz('sea301-quiz-8', 'Quiz 8 — Integration|||Quiz 8 — Tích hợp', [
  { id: 'q1', question: 'Why not connect a DC motor straight to an MCU GPIO pin?|||Vì sao không nối thẳng động cơ DC vào chân GPIO của MCU?', options: ['GPIO is too fast|||GPIO quá nhanh', 'a GPIO pin sources only milliamps; you need a driver|||chân GPIO chỉ cấp vài miliampe; cần một driver', 'motors need I2C|||động cơ cần I2C', 'it damages the ADC only|||chỉ hỏng ADC'], correctIndex: 1, explanation: 'Chân MCU cấp dòng rất nhỏ → cần driver/cầu H (và diode dập) giữa logic và tải.' },
  { id: 'q2', question: 'A closed-loop controller differs from open-loop because it…|||Bộ điều khiển vòng kín khác vòng hở ở chỗ nó…', options: ['uses more power|||dùng nhiều điện hơn', 'measures the result with a sensor and corrects|||đo kết quả bằng cảm biến rồi sửa', 'has no actuator|||không có cơ cấu', 'never uses PWM|||không bao giờ dùng PWM'], correctIndex: 1, explanation: 'Vòng kín có phản hồi cảm biến; PID dùng sai số để hiệu chỉnh ngõ ra.' },
  { id: 'q3', question: 'In an Arduino line-follower, the IR sensors provide…|||Trong robot dò line Arduino, cảm biến hồng ngoại cấp…', options: ['the motor power|||nguồn cho động cơ', 'the measured error input to the controller|||sai số đo được làm ngõ vào bộ điều khiển', 'the PWM output|||ngõ ra PWM', 'the H-bridge|||cầu H'], correctIndex: 1, explanation: 'IR đọc vạch → MCU tính sai số → PID → PWM qua L298N lái động cơ.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'SEA301',
    slug: 'sea301-sensors-and-actuators',
    title: 'Sensors and Actuators',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SEA301.webp',
    shortDescription: 'How robots sense & act — sensor characteristics, position/motion & environmental sensors, signal conditioning (filter, ADC, fusion), and actuators (DC/servo/stepper, hydraulic/pneumatic/piezo) with MCU closed-loop control.|||Robot cảm nhận & hành động — đặc tính cảm biến, cảm biến vị trí/chuyển động & môi trường, xử lý tín hiệu (lọc, ADC, fusion), và cơ cấu chấp hành (DC/servo/stepper, thuỷ lực/khí nén/áp điện) với điều khiển vòng kín qua MCU.',
    description: 'Môn <strong>SEA301 — Sensors and Actuators</strong> (Cảm biến &amp; Cơ cấu chấp hành, ngành Robotics &amp; AI, kỳ 4) dạy cách một robot <strong>cảm nhận thế giới và tác động ngược lại</strong>. Từ <strong>đặc tính &amp; nguyên lý cảm biến</strong> (độ nhạy, độ chính xác, transducer, hiệu chuẩn, nhiễu) → <strong>cảm biến vị trí/chuyển động</strong> (encoder, IMU, Hall) và <strong>môi trường</strong> (nhiệt độ, áp suất, ánh sáng, siêu âm/hồng ngoại/lidar) → <strong>xử lý tín hiệu</strong> (khuếch đại, lọc, ADC, lấy mẫu, fusion) → <strong>cơ cấu chấp hành điện</strong> (DC/servo/stepper) và <strong>thuỷ lực/khí nén/áp điện</strong> → <strong>tích hợp với vi điều khiển</strong> (I2C/SPI, driver, vòng điều khiển kín PID). Bám sách chuẩn (Fraden, de Silva, Bishop) và datasheet linh kiện thật, song ngữ, quiz mỗi chương.',
    whatYouLearn: 'Vai trò cảm biến/cơ cấu &amp; đặc tính (độ nhạy, độ chính xác, độ phân giải, dải đo); nguyên lý transducer (điện trở/điện dung/áp điện/quang), hiệu chuẩn offset &amp; gain, nhiễu/SNR; encoder tương đối/tuyệt đối, biến trở, IMU (MPU-6050), Hall (A3144); cảm biến nhiệt (LM35/DS18B20/NTC), áp suất (BMP280), ánh sáng (LDR/BH1750), khoảng cách (HC-SR04/Sharp/lidar); khuếch đại op-amp, lọc RC, ADC (10/12-bit), Nyquist, complementary filter; động cơ DC (PWM + cầu H L298N), servo (PWM 50Hz), stepper (NEMA 17, A4988); cơ cấu thuỷ lực/khí nén/áp điện; giao tiếp MCU và vòng điều khiển kín PID (ví dụ robot dò line).',
    requirements: 'Kiến thức điện cơ bản (áp/dòng/trở, định luật Ohm) và lập trình cơ bản (nên có Arduino/C). Xem điều kiện tiên quyết đầy đủ trong khung chương trình ngành Robotics &amp; AI trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách chuẩn (Fraden, de Silva, Bishop), datasheet, Arduino, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vòng cảm nhận - quyết định - hành động; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Vai trò & đặc tính|||Chapter 1 — Roles & characteristics', description: 'Phân loại; độ nhạy, chính xác, phân giải, dải đo.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nguyên lý & hiệu chuẩn|||Chapter 2 — Principles & calibration', description: 'Transducer, analog/digital, hiệu chuẩn, nhiễu.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Vị trí & chuyển động|||Chapter 3 — Position & motion', description: 'Encoder, biến trở, IMU, Hall.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Môi trường & khoảng cách|||Chapter 4 — Environmental & distance', description: 'Nhiệt, áp suất, ánh sáng, siêu âm/IR/lidar.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Xử lý tín hiệu|||Chapter 5 — Signal conditioning', description: 'Khuếch đại, lọc, ADC, lấy mẫu, fusion.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Cơ cấu điện|||Chapter 6 — Electric actuators', description: 'DC, servo, stepper; driver & điều khiển.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Cơ cấu khác|||Chapter 7 — Other actuators', description: 'Thuỷ lực, khí nén, áp điện; so sánh.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Tích hợp & ứng dụng|||Chapter 8 — Integration', description: 'Giao tiếp MCU, driver, vòng kín PID, robot dò line.', lessons: [c8, c8q] },
  ],
};
