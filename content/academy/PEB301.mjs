/**
 * PEB301 — Practice of Embedded System (Thực hành Hệ thống nhúng).
 * Ngành Kỹ thuật phần mềm ô tô, FPTU, Kỳ 4.
 * Môn THỰC HÀNH/LAB: 8 bài lab tăng dần trên STM32/ESP32/Arduino.
 * Mỗi lab = 1 DOCUMENT (mục tiêu + thiết bị + sơ đồ nối + các bước + code +
 * kết quả mong đợi + mở rộng) + 1 QUIZ 3 câu tiếng Việt có explanation.
 * Nguồn (trích dẫn): STM32 HAL docs; "Making Embedded Systems" (White);
 * Arduino/ESP-IDF docs; FreeRTOS docs.
 * GIỮ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${ trong string; "\n"→\\n.
 * ⚠️ KHÔNG ký tự Cyrillic/Hy Lạp trong code (dùng "us"/"ohm", không dùng ký tự lạ).
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức bài lab.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('peb301-0-0-tai-lieu', '📚 Lab materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), STM32 HAL docs, Arduino/ESP-IDF docs, FreeRTOS docs, sách, công cụ, lộ trình luyện lab.',
  [[
    `<span class="eyebrow">PEB301 · Materials</span>
<h2>Lab materials &amp; resource hub</h2>
<p class="lead">Everything you need for the 8 hands-on labs — from toolchain setup to a CAN-connected automotive mini-system. The official FPTU slides &amp; lab manual live on <strong>FLM</strong>; below are free, legal references.</p>
<h3>📘 Course slides &amp; lab manual</h3>
<p>The official FPTU giáo trình &amp; lab guide for PEB301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference book</h3>
<ul>
<li><a href="https://www.oreilly.com/library/view/making-embedded-systems/9781449308889/" target="_blank" rel="noopener"><em>Making Embedded Systems</em> — Elecia White (O'Reilly)</a></li>
</ul>
<h3>🌐 Official documentation</h3>
<ul>
<li><a href="https://www.st.com/en/embedded-software/stm32cube-mcu-mpu-packages.html" target="_blank" rel="noopener">STM32Cube HAL / LL drivers &amp; user manuals (ST)</a></li>
<li><a href="https://docs.arduino.cc/" target="_blank" rel="noopener">Arduino documentation &amp; language reference</a></li>
<li><a href="https://docs.espressif.com/projects/esp-idf/en/latest/" target="_blank" rel="noopener">ESP-IDF programming guide (ESP32)</a></li>
<li><a href="https://www.freertos.org/Documentation/RTOS_book.html" target="_blank" rel="noopener">FreeRTOS documentation &amp; kernel API</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.st.com/en/development-tools/stm32cubeide.html" target="_blank" rel="noopener">STM32CubeIDE</a> — IDE + HAL code generator + debugger</li>
<li><a href="https://www.arduino.cc/en/software" target="_blank" rel="noopener">Arduino IDE</a> — quick prototyping (also supports ESP32)</li>
<li><a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener">Tinkercad Circuits</a> — simulate Arduino wiring in the browser</li>
<li><a href="https://wokwi.com/" target="_blank" rel="noopener">Wokwi</a> — online simulator for Arduino/ESP32/STM32</li>
</ul>
<h3>How labs are graded</h3>
<ul>
<li><strong>Demo (live)</strong> — the circuit behaves as the spec asks in front of the instructor.</li>
<li><strong>Code &amp; wiring report</strong> — clean, commented source + a labelled wiring diagram.</li>
<li><strong>Q&amp;A / extension</strong> — explain your choices and complete the "mở rộng" task.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Set up</strong> — install the toolchain, flash a blink, confirm the board is alive.</li>
<li><strong>Peripherals</strong> — GPIO, interrupts, UART, timers/PWM, ADC one by one.</li>
<li><strong>Buses</strong> — talk to a real module over I2C/SPI.</li>
<li><strong>Concurrency</strong> — split work into FreeRTOS tasks.</li>
<li><strong>Integrate</strong> — combine everything into a CAN-connected automotive mini-system.</li>
</ol></div>`,
    `<span class="eyebrow">PEB301 · Tài liệu</span>
<h2>Trung tâm tài liệu &amp; nguồn học lab</h2>
<p class="lead">Mọi thứ cho 8 bài lab thực hành — từ thiết lập toolchain đến hệ nhúng ô tô nhỏ nối CAN. Slide &amp; hướng dẫn lab chính thức của FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Slide &amp; hướng dẫn lab</h3>
<p>Giáo trình FPTU &amp; hướng dẫn lab chính thức của PEB301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.oreilly.com/library/view/making-embedded-systems/9781449308889/" target="_blank" rel="noopener"><em>Making Embedded Systems</em> — Elecia White (O'Reilly)</a></li>
</ul>
<h3>🌐 Tài liệu chính thức</h3>
<ul>
<li><a href="https://www.st.com/en/embedded-software/stm32cube-mcu-mpu-packages.html" target="_blank" rel="noopener">STM32Cube HAL / LL drivers &amp; sổ tay (ST)</a></li>
<li><a href="https://docs.arduino.cc/" target="_blank" rel="noopener">Tài liệu &amp; tham chiếu ngôn ngữ Arduino</a></li>
<li><a href="https://docs.espressif.com/projects/esp-idf/en/latest/" target="_blank" rel="noopener">Hướng dẫn lập trình ESP-IDF (ESP32)</a></li>
<li><a href="https://www.freertos.org/Documentation/RTOS_book.html" target="_blank" rel="noopener">Tài liệu &amp; API nhân FreeRTOS</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.st.com/en/development-tools/stm32cubeide.html" target="_blank" rel="noopener">STM32CubeIDE</a> — IDE + sinh mã HAL + trình gỡ lỗi</li>
<li><a href="https://www.arduino.cc/en/software" target="_blank" rel="noopener">Arduino IDE</a> — dựng mẫu nhanh (hỗ trợ cả ESP32)</li>
<li><a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener">Tinkercad Circuits</a> — mô phỏng nối dây Arduino trên trình duyệt</li>
<li><a href="https://wokwi.com/" target="_blank" rel="noopener">Wokwi</a> — trình mô phỏng Arduino/ESP32/STM32 trực tuyến</li>
</ul>
<h3>Cách chấm điểm lab</h3>
<ul>
<li><strong>Demo (trực tiếp)</strong> — mạch chạy đúng yêu cầu đề trước mặt giảng viên.</li>
<li><strong>Báo cáo code &amp; sơ đồ</strong> — mã nguồn sạch, có chú thích + sơ đồ nối dây có nhãn.</li>
<li><strong>Hỏi đáp / mở rộng</strong> — giải thích lựa chọn và hoàn thành phần "mở rộng".</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự luyện</span>
<ol>
<li><strong>Thiết lập</strong> — cài toolchain, nạp một bản nhấp nháy, xác nhận board còn sống.</li>
<li><strong>Ngoại vi</strong> — GPIO, ngắt, UART, timer/PWM, ADC lần lượt.</li>
<li><strong>Bus</strong> — nói chuyện với module thật qua I2C/SPI.</li>
<li><strong>Đa nhiệm</strong> — chia việc thành các task FreeRTOS.</li>
<li><strong>Tích hợp</strong> — gộp tất cả thành hệ nhúng ô tô nhỏ nối CAN.</li>
</ol></div>`,
  ]]);

const intro = doc('peb301-0-1-overview', 'Course overview: how these labs work|||Tổng quan: cách học môn thực hành này',
  'Môn THỰC HÀNH: 8 bài lab tăng dần trên vi điều khiển (STM32/ESP32/Arduino). Thiết bị cần, quy ước sơ đồ nối, an toàn, cách chấm demo + báo cáo.',
  [[
    `<span class="eyebrow">PEB301 · Lesson 0.1 · Overview</span>
<h2>Practice of Embedded System</h2>
<p class="lead">This is a <strong>hands-on lab course</strong>, not a lecture course. Across <strong>8 progressive labs</strong> you build up from blinking a single LED to a small automotive mini-system that reads a sensor, decides, actuates, and reports over a <strong>CAN</strong> bus — the network that ties real cars together.</p>
<h3>What is a microcontroller (MCU)?</h3>
<p>A single chip with a CPU, flash (your program), RAM, and <strong>peripherals</strong> (GPIO, timers, ADC, UART, I2C, SPI, CAN). Embedded programming is mostly about <em>configuring peripherals</em> and reacting to events — often with no operating system, or a tiny one like <strong>FreeRTOS</strong>.</p>
<h3>Hardware you need</h3>
<ul>
<li><strong>A board</strong> — an <strong>STM32</strong> Nucleo/Blue Pill (labs use STM32 HAL), or an <strong>ESP32</strong> / <strong>Arduino Uno</strong> (labs give an equivalent). Any one is enough; code is shown for both worlds.</li>
<li><strong>Breadboard + jumper wires</strong>, a few <strong>LEDs</strong> and <strong>resistors</strong> (about 220–330 ohm), a <strong>push button</strong>.</li>
<li>Later labs: a <strong>potentiometer</strong> (ADC), an <strong>I2C/SPI module</strong> (e.g. an OLED or a temperature sensor), a small <strong>motor + driver</strong> or an LED for PWM, and for the capstone a <strong>CAN transceiver</strong> (e.g. MCP2551/SN65HVD230) or a simulated CAN in Wokwi.</li>
<li>A <strong>USB cable</strong> and a PC with the toolchain (STM32CubeIDE or Arduino IDE).</li>
</ul>
<h3>Wiring conventions used in every lab</h3>
<pre><code>3V3 / 5V  -&gt; power rail (RED)
GND       -&gt; ground rail (BLACK) - ALWAYS common all grounds
Signal    -&gt; a named MCU pin, e.g. PA5, D13, GPIO2
Resistor  -&gt; in series with every LED (limits current)
</code></pre>
<h3>How you are graded</h3>
<p>Each lab is judged on a live <strong>demo</strong> (does it behave as specified?), a short <strong>code + wiring report</strong>, and a <strong>Q&amp;A / extension</strong> task. Every lab below ends with an "expected result" and a "mở rộng" (stretch) task.</p>
<div class="callout"><span class="badge">Safety first</span> Power off before rewiring. Never drive a motor straight from an MCU pin — use a driver/transistor. Double-check 3.3V vs 5V logic levels before connecting a module.</div>`,
    `<span class="eyebrow">PEB301 · Bài 0.1 · Tổng quan</span>
<h2>Thực hành Hệ thống nhúng</h2>
<p class="lead">Đây là <strong>môn thực hành</strong>, không phải môn lý thuyết. Qua <strong>8 bài lab tăng dần</strong>, bạn đi từ nhấp nháy một LED đến một hệ nhúng ô tô nhỏ: đọc cảm biến, ra quyết định, điều khiển, và báo cáo qua bus <strong>CAN</strong> — mạng nối các bộ phận trong xe thật.</p>
<h3>Vi điều khiển (MCU) là gì?</h3>
<p>Một con chip có CPU, flash (chương trình của bạn), RAM, và <strong>ngoại vi</strong> (GPIO, timer, ADC, UART, I2C, SPI, CAN). Lập trình nhúng chủ yếu là <em>cấu hình ngoại vi</em> và phản ứng với sự kiện — thường không có hệ điều hành, hoặc dùng hệ nhỏ như <strong>FreeRTOS</strong>.</p>
<h3>Thiết bị cần</h3>
<ul>
<li><strong>Một board</strong> — <strong>STM32</strong> Nucleo/Blue Pill (lab dùng STM32 HAL), hoặc <strong>ESP32</strong> / <strong>Arduino Uno</strong> (lab có bản tương đương). Chỉ cần một; code trình bày cho cả hai thế giới.</li>
<li><strong>Breadboard + dây cắm</strong>, vài <strong>LED</strong> và <strong>điện trở</strong> (khoảng 220–330 ohm), một <strong>nút bấm</strong>.</li>
<li>Lab sau: một <strong>biến trở</strong> (ADC), một <strong>module I2C/SPI</strong> (vd màn OLED hoặc cảm biến nhiệt), một <strong>động cơ nhỏ + mạch lái</strong> hoặc LED cho PWM, và cho lab cuối là một <strong>bộ thu phát CAN</strong> (vd MCP2551/SN65HVD230) hoặc CAN mô phỏng trong Wokwi.</li>
<li>Một <strong>cáp USB</strong> và máy tính đã cài toolchain (STM32CubeIDE hoặc Arduino IDE).</li>
</ul>
<h3>Quy ước nối dây dùng trong mọi lab</h3>
<pre><code>3V3 / 5V  -&gt; đường nguồn (ĐỎ)
GND       -&gt; đường mass (ĐEN) - LUÔN nối chung mọi mass
Signal    -&gt; một chân MCU có tên, vd PA5, D13, GPIO2
Resistor  -&gt; nối tiếp với mỗi LED (hạn dòng)
</code></pre>
<h3>Cách chấm điểm</h3>
<p>Mỗi lab chấm qua <strong>demo</strong> trực tiếp (chạy đúng đề không?), một <strong>báo cáo code + sơ đồ nối</strong> ngắn, và một câu <strong>hỏi đáp / mở rộng</strong>. Mỗi lab dưới đây kết thúc bằng "kết quả mong đợi" và một nhiệm vụ "mở rộng".</p>
<div class="callout"><span class="badge">An toàn trước</span> Tắt nguồn trước khi đổi dây. Đừng bao giờ lái động cơ trực tiếp từ chân MCU — dùng mạch lái/transistor. Kiểm mức logic 3.3V hay 5V trước khi nối module.</div>`,
  ]]);

const c1 = doc('peb301-1-1-toolchain-gpio', 'Lab 1 — Toolchain setup & GPIO: blink an LED|||Lab 1 — Thiết lập toolchain & GPIO: nhấp nháy LED',
  'Cài toolchain, tạo project, cấu hình GPIO output, nạp firmware; LED nhấp nháy 1 Hz (STM32 HAL + Arduino).',
  [[
    `<span class="eyebrow">PEB301 · Lab 1</span>
<h2>Toolchain setup &amp; GPIO — blink an LED</h2>
<p><strong>Objective.</strong> Install the toolchain, create your first project, configure a GPIO pin as a push-pull output, and make an LED blink at 1 Hz (on 500 ms, off 500 ms). This is the "hello world" of embedded — it proves your board, cable, flasher and code all work.</p>
<h3>Equipment</h3>
<ul>
<li>STM32 board (or Arduino/ESP32), USB cable, PC with STM32CubeIDE / Arduino IDE.</li>
<li>1 LED + 1 resistor (about 330 ohm). Many boards have an on-board LED (STM32 Nucleo: PA5 / LD2; Arduino Uno: D13) so external wiring is optional.</li>
</ul>
<h3>Wiring</h3>
<pre><code>MCU pin (PA5 / D13) --[ 330 ohm ]--&gt; LED anode (+)
LED cathode (-) --------------------&gt; GND
</code></pre>
<p>The resistor is in <em>series</em> with the LED to limit current. Longer LED leg = anode (+).</p>
<h3>Steps</h3>
<ol>
<li>Install the IDE and the board support package. Connect the board over USB; confirm it enumerates.</li>
<li>Create a new project for your exact chip/board.</li>
<li>Configure the LED pin as <strong>GPIO Output, push-pull</strong>.</li>
<li>In the main loop: set pin high, wait 500 ms, set pin low, wait 500 ms.</li>
<li>Build and flash. Watch the LED.</li>
</ol>
<h3>Code — STM32 HAL</h3>
<pre><code>/* CubeMX generated MX_GPIO_Init() sets PA5 as output */
while (1) {
    HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_SET);
    HAL_Delay(500);                 /* ms */
    HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_RESET);
    HAL_Delay(500);
}
/* Cleaner: toggle in one call */
while (1) {
    HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
    HAL_Delay(500);
}
</code></pre>
<h3>Code — Arduino</h3>
<pre><code>void setup() {
    pinMode(LED_BUILTIN, OUTPUT);   // D13 on Uno
}
void loop() {
    digitalWrite(LED_BUILTIN, HIGH);
    delay(500);
    digitalWrite(LED_BUILTIN, LOW);
    delay(500);
}
</code></pre>
<h3>Expected result</h3>
<p>The LED blinks steadily: on for half a second, off for half a second (1 Hz). If it stays dark, check the LED polarity, the resistor, and that you flashed the right pin.</p>
<div class="callout"><span class="badge">Mở rộng</span> Make the blink rate 5 Hz, then use <code>HAL_GPIO_TogglePin</code> (or replace <code>delay</code>) so the loop is a single toggle. Bonus: why is <code>HAL_Delay</code> "blocking", and why is that bad in a bigger program?</div>`,
    `<span class="eyebrow">PEB301 · Lab 1</span>
<h2>Thiết lập toolchain &amp; GPIO — nhấp nháy LED</h2>
<p><strong>Mục tiêu.</strong> Cài toolchain, tạo project đầu tiên, cấu hình một chân GPIO thành output push-pull, và cho LED nhấp nháy 1 Hz (sáng 500 ms, tắt 500 ms). Đây là "hello world" của nhúng — nó chứng minh board, cáp, mạch nạp và code của bạn đều chạy.</p>
<h3>Thiết bị</h3>
<ul>
<li>Board STM32 (hoặc Arduino/ESP32), cáp USB, máy tính có STM32CubeIDE / Arduino IDE.</li>
<li>1 LED + 1 điện trở (khoảng 330 ohm). Nhiều board có LED sẵn trên bo (STM32 Nucleo: PA5 / LD2; Arduino Uno: D13) nên nối ngoài là tuỳ chọn.</li>
</ul>
<h3>Sơ đồ nối</h3>
<pre><code>Chân MCU (PA5 / D13) --[ 330 ohm ]--&gt; chân dương LED (+)
Chân âm LED (-) --------------------&gt; GND
</code></pre>
<p>Điện trở mắc <em>nối tiếp</em> với LED để hạn dòng. Chân dài của LED = cực dương (+).</p>
<h3>Các bước</h3>
<ol>
<li>Cài IDE và gói hỗ trợ board. Cắm board qua USB; xác nhận máy nhận.</li>
<li>Tạo project mới đúng chip/board của bạn.</li>
<li>Cấu hình chân LED thành <strong>GPIO Output, push-pull</strong>.</li>
<li>Trong vòng lặp chính: đặt chân lên cao, chờ 500 ms, đặt chân xuống thấp, chờ 500 ms.</li>
<li>Build và nạp. Quan sát LED.</li>
</ol>
<h3>Code — STM32 HAL</h3>
<pre><code>/* MX_GPIO_Init() do CubeMX sinh đặt PA5 là output */
while (1) {
    HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_SET);
    HAL_Delay(500);                 /* ms */
    HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_RESET);
    HAL_Delay(500);
}
/* Gọn hơn: đảo trạng thái trong một lệnh */
while (1) {
    HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
    HAL_Delay(500);
}
</code></pre>
<h3>Code — Arduino</h3>
<pre><code>void setup() {
    pinMode(LED_BUILTIN, OUTPUT);   // D13 trên Uno
}
void loop() {
    digitalWrite(LED_BUILTIN, HIGH);
    delay(500);
    digitalWrite(LED_BUILTIN, LOW);
    delay(500);
}
</code></pre>
<h3>Kết quả mong đợi</h3>
<p>LED nhấp nháy đều: sáng nửa giây, tắt nửa giây (1 Hz). Nếu vẫn tối, kiểm cực LED, điện trở, và bạn đã nạp đúng chân chưa.</p>
<div class="callout"><span class="badge">Mở rộng</span> Đổi nhịp nháy thành 5 Hz, rồi dùng <code>HAL_GPIO_TogglePin</code> (hoặc thay <code>delay</code>) để vòng lặp chỉ còn một lệnh đảo. Thêm: vì sao <code>HAL_Delay</code> là "chặn" (blocking), và vì sao điều đó tệ trong chương trình lớn?</div>`,
  ]]);

const c1q = quiz('peb301-quiz-1', 'Quiz Lab 1 — Toolchain & GPIO|||Quiz Lab 1 — Toolchain & GPIO', [
  { id: 'q1', question: 'Vì sao phải mắc điện trở nối tiếp với LED?', options: ['Để LED sáng hơn', 'Để hạn dòng, tránh cháy LED', 'Để LED đổi màu', 'Không cần thiết'], correctIndex: 1, explanation: 'Điện trở nối tiếp hạn dòng qua LED, giữ dòng trong mức an toàn.' },
  { id: 'q2', question: 'HAL_GPIO_TogglePin dùng để?', options: ['Đọc trạng thái nút', 'Đảo trạng thái chân output (cao<->thấp)', 'Đặt chân làm input', 'Đọc ADC'], correctIndex: 1, explanation: 'TogglePin lật trạng thái ra của chân, thay cho cặp Write cao rồi thấp.' },
  { id: 'q3', question: 'HAL_Delay(500) làm gì?', options: ['Chờ 500 giây', 'Chờ (chặn CPU) khoảng 500 mili-giây', 'Đặt tần số 500 Hz', 'Đọc 500 mẫu ADC'], correctIndex: 1, explanation: 'HAL_Delay tính bằng mili-giây và chặn CPU trong lúc chờ.' },
]);

const c2 = doc('peb301-2-1-button-interrupt', 'Lab 2 — Buttons & external interrupts (EXTI)|||Lab 2 — Nút bấm & ngắt ngoài (interrupt)',
  'Đọc nút bấm bằng polling rồi bằng ngắt ngoài EXTI; chống dội (debounce); pull-up/pull-down.',
  [[
    `<span class="eyebrow">PEB301 · Lab 2</span>
<h2>Buttons &amp; external interrupts (EXTI)</h2>
<p><strong>Objective.</strong> Read a push button two ways — first by <em>polling</em>, then by an <strong>external interrupt (EXTI)</strong> — and toggle an LED on each press. Learn pull-up vs pull-down and why a button must be <strong>debounced</strong>.</p>
<h3>Equipment</h3>
<ul>
<li>Board, USB, breadboard, 1 push button, 1 LED + resistor. A 10k ohm pull resistor if you do not use the MCU internal pull.</li>
</ul>
<h3>Wiring (with internal pull-up)</h3>
<pre><code>Button pin 1 -----&gt; MCU input pin (e.g. PC13 / D2)
Button pin 2 -----&gt; GND
(Internal pull-up ON: pin reads HIGH idle, LOW when pressed)
</code></pre>
<h3>Steps</h3>
<ol>
<li>Configure the button pin as <strong>input with pull-up</strong>; the LED pin as output.</li>
<li><strong>Polling version:</strong> in the loop, read the pin; on a HIGH-to-LOW change, toggle the LED.</li>
<li><strong>Interrupt version:</strong> configure the pin as EXTI on the falling edge; toggle the LED inside the interrupt callback.</li>
<li>Add <strong>debounce</strong>: ignore further edges for about 20–50 ms after a press.</li>
</ol>
<h3>Code — STM32 HAL (interrupt)</h3>
<pre><code>/* Called by HAL when an EXTI line fires */
void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin) {
    if (GPIO_Pin == GPIO_PIN_13) {
        uint32_t now = HAL_GetTick();
        static uint32_t last = 0;
        if (now - last &gt; 30) {          /* 30 ms debounce */
            HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
            last = now;
        }
    }
}
</code></pre>
<h3>Code — Arduino (interrupt)</h3>
<pre><code>volatile bool toggled = false;
volatile uint32_t last = 0;
void onPress() {
    uint32_t now = millis();
    if (now - last &gt; 30) { toggled = !toggled; last = now; }
}
void setup() {
    pinMode(2, INPUT_PULLUP);
    pinMode(LED_BUILTIN, OUTPUT);
    attachInterrupt(digitalPinToInterrupt(2), onPress, FALLING);
}
void loop() { digitalWrite(LED_BUILTIN, toggled); }
</code></pre>
<h3>Expected result</h3>
<p>Each clean press flips the LED. Without debounce, one press sometimes toggles twice (contacts bounce). With debounce, one press = one toggle.</p>
<div class="callout"><span class="badge">Mở rộng</span> Why do we keep the interrupt callback (ISR) short and mark shared variables <code>volatile</code>? Move the LED update out of the ISR and only set a flag there.</div>`,
    `<span class="eyebrow">PEB301 · Lab 2</span>
<h2>Nút bấm &amp; ngắt ngoài (EXTI)</h2>
<p><strong>Mục tiêu.</strong> Đọc nút bấm theo hai cách — trước bằng <em>polling</em>, sau bằng <strong>ngắt ngoài (EXTI)</strong> — và đảo LED mỗi lần nhấn. Học pull-up với pull-down và vì sao nút phải được <strong>chống dội (debounce)</strong>.</p>
<h3>Thiết bị</h3>
<ul>
<li>Board, USB, breadboard, 1 nút bấm, 1 LED + điện trở. Một điện trở kéo 10k ohm nếu không dùng kéo nội của MCU.</li>
</ul>
<h3>Sơ đồ nối (dùng pull-up nội)</h3>
<pre><code>Chân nút 1 -----&gt; chân input MCU (vd PC13 / D2)
Chân nút 2 -----&gt; GND
(Bật pull-up nội: chân đọc CAO lúc nghỉ, THẤP khi nhấn)
</code></pre>
<h3>Các bước</h3>
<ol>
<li>Cấu hình chân nút thành <strong>input có pull-up</strong>; chân LED thành output.</li>
<li><strong>Bản polling:</strong> trong vòng lặp, đọc chân; khi đổi CAO sang THẤP thì đảo LED.</li>
<li><strong>Bản ngắt:</strong> cấu hình chân thành EXTI theo sườn xuống; đảo LED bên trong hàm callback ngắt.</li>
<li>Thêm <strong>chống dội</strong>: bỏ qua các sườn kế tiếp trong khoảng 20–50 ms sau một lần nhấn.</li>
</ol>
<h3>Code — STM32 HAL (ngắt)</h3>
<pre><code>/* HAL gọi khi một đường EXTI kích hoạt */
void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin) {
    if (GPIO_Pin == GPIO_PIN_13) {
        uint32_t now = HAL_GetTick();
        static uint32_t last = 0;
        if (now - last &gt; 30) {          /* chống dội 30 ms */
            HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
            last = now;
        }
    }
}
</code></pre>
<h3>Code — Arduino (ngắt)</h3>
<pre><code>volatile bool toggled = false;
volatile uint32_t last = 0;
void onPress() {
    uint32_t now = millis();
    if (now - last &gt; 30) { toggled = !toggled; last = now; }
}
void setup() {
    pinMode(2, INPUT_PULLUP);
    pinMode(LED_BUILTIN, OUTPUT);
    attachInterrupt(digitalPinToInterrupt(2), onPress, FALLING);
}
void loop() { digitalWrite(LED_BUILTIN, toggled); }
</code></pre>
<h3>Kết quả mong đợi</h3>
<p>Mỗi lần nhấn sạch sẽ lật LED. Không chống dội, một lần nhấn đôi khi đảo hai lần (tiếp điểm nảy). Có chống dội, một lần nhấn = một lần đảo.</p>
<div class="callout"><span class="badge">Mở rộng</span> Vì sao giữ hàm ngắt (ISR) thật ngắn và khai báo biến dùng chung là <code>volatile</code>? Chuyển việc cập nhật LED ra ngoài ISR và chỉ đặt một cờ trong đó.</div>`,
  ]]);

const c2q = quiz('peb301-quiz-2', 'Quiz Lab 2 — Nút & ngắt|||Quiz Lab 2 — Buttons & interrupts', [
  { id: 'q1', question: 'Ngắt ngoài (EXTI) hơn polling ở điểm nào?', options: ['CPU không phải liên tục hỏi trạng thái, phản ứng đúng lúc sự kiện', 'Chạy nhanh hơn khi không có sự kiện gì', 'Không cần cấu hình chân', 'Không cần chống dội'], correctIndex: 0, explanation: 'Ngắt để CPU làm việc khác và chỉ chạy khi có sự kiện, thay vì hỏi liên tục.' },
  { id: 'q2', question: 'Hiện tượng một lần nhấn nút bị đọc thành nhiều lần gọi là?', options: ['Ngắt tràn', 'Dội tiếp điểm (bounce), cần debounce', 'Pull-up sai', 'Quá dòng'], correctIndex: 1, explanation: 'Tiếp điểm cơ khí nảy vài ms; debounce lọc các sườn giả này.' },
  { id: 'q3', question: 'Vì sao biến dùng chung giữa ISR và main phải là volatile?', options: ['Để chạy nhanh hơn', 'Để trình biên dịch không tối ưu bỏ đọc lại, luôn lấy giá trị mới', 'Để tiết kiệm RAM', 'Để tự chống dội'], correctIndex: 1, explanation: 'volatile báo trình biên dịch giá trị có thể đổi ngoài luồng chính (trong ISR), phải đọc lại mỗi lần.' },
]);

const c3 = doc('peb301-3-1-uart', 'Lab 3 — UART: talk to the PC|||Lab 3 — UART: giao tiếp với máy tính',
  'Cấu hình UART (baud 115200), gửi chuỗi ra máy tính, nhận lệnh từ terminal; printf redirect; khung dữ liệu.',
  [[
    `<span class="eyebrow">PEB301 · Lab 3</span>
<h2>UART — talk to the PC</h2>
<p><strong>Objective.</strong> Set up a <strong>UART</strong> serial link at 115200 baud, print messages to a PC terminal, and receive characters/commands back. UART is your #1 debugging tool in embedded — a working <code>printf</code> saves hours.</p>
<h3>Equipment</h3>
<ul>
<li>Board (most expose a USB-to-UART bridge), USB cable, a serial terminal on the PC (the IDE's serial monitor, PuTTY, or <code>screen</code>).</li>
</ul>
<h3>Wiring (only if using an external USB-UART adapter)</h3>
<pre><code>MCU TX -----&gt; Adapter RX
MCU RX -----&gt; Adapter TX     (TX-&gt;RX crossed!)
MCU GND ----&gt; Adapter GND    (common ground)
Both sides set to 115200 baud, 8N1
</code></pre>
<h3>Steps</h3>
<ol>
<li>Enable a USART peripheral at <strong>115200 baud, 8 data bits, no parity, 1 stop (8N1)</strong>.</li>
<li>Transmit a greeting string on start-up.</li>
<li>(Optional) redirect <code>printf</code> to the UART so you can print variables.</li>
<li>Receive a byte; echo it back or act on a simple command (e.g. 'L' toggles the LED).</li>
</ol>
<h3>Code — STM32 HAL</h3>
<pre><code>char msg[] = "PEB301 UART ready\r\n";
HAL_UART_Transmit(&amp;huart2, (uint8_t*)msg, sizeof(msg)-1, 100);

uint8_t rx;
if (HAL_UART_Receive(&amp;huart2, &amp;rx, 1, 10) == HAL_OK) {
    if (rx == 'L') HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
    HAL_UART_Transmit(&amp;huart2, &amp;rx, 1, 100);   /* echo */
}

/* Redirect printf (newlib): implement _write */
int _write(int file, char *ptr, int len) {
    HAL_UART_Transmit(&amp;huart2, (uint8_t*)ptr, len, 100);
    return len;
}
</code></pre>
<h3>Code — Arduino</h3>
<pre><code>void setup() { Serial.begin(115200); Serial.println("PEB301 UART ready"); }
void loop() {
    if (Serial.available()) {
        char c = Serial.read();
        if (c == 'L') digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
        Serial.print(c);            // echo
    }
}
</code></pre>
<h3>Expected result</h3>
<p>Open the terminal at 115200: you see "PEB301 UART ready". Typing a character echoes it back; typing 'L' toggles the LED. Garbled text almost always means a baud-rate mismatch.</p>
<div class="callout"><span class="badge">Mở rộng</span> Send the LED state as a line every second using <code>printf</code>. Then switch RX to interrupt/DMA so receiving does not block your loop.</div>`,
    `<span class="eyebrow">PEB301 · Lab 3</span>
<h2>UART — giao tiếp với máy tính</h2>
<p><strong>Mục tiêu.</strong> Thiết lập liên kết nối tiếp <strong>UART</strong> ở 115200 baud, in thông điệp ra terminal máy tính, và nhận ký tự/lệnh trả về. UART là công cụ gỡ lỗi số một trong nhúng — một <code>printf</code> chạy được tiết kiệm hàng giờ.</p>
<h3>Thiết bị</h3>
<ul>
<li>Board (đa số có sẵn cầu USB-UART), cáp USB, một terminal nối tiếp trên máy (serial monitor của IDE, PuTTY, hoặc <code>screen</code>).</li>
</ul>
<h3>Sơ đồ nối (chỉ khi dùng bộ USB-UART ngoài)</h3>
<pre><code>MCU TX -----&gt; RX của bộ chuyển
MCU RX -----&gt; TX của bộ chuyển   (TX-&gt;RX bắt chéo!)
MCU GND ----&gt; GND của bộ chuyển  (chung mass)
Hai bên đặt 115200 baud, 8N1
</code></pre>
<h3>Các bước</h3>
<ol>
<li>Bật một ngoại vi USART ở <strong>115200 baud, 8 bit dữ liệu, không chẵn lẻ, 1 stop (8N1)</strong>.</li>
<li>Gửi một chuỗi chào lúc khởi động.</li>
<li>(Tuỳ chọn) chuyển hướng <code>printf</code> sang UART để in được biến.</li>
<li>Nhận một byte; dội lại hoặc xử một lệnh đơn giản (vd 'L' để đảo LED).</li>
</ol>
<h3>Code — STM32 HAL</h3>
<pre><code>char msg[] = "PEB301 UART ready\r\n";
HAL_UART_Transmit(&amp;huart2, (uint8_t*)msg, sizeof(msg)-1, 100);

uint8_t rx;
if (HAL_UART_Receive(&amp;huart2, &amp;rx, 1, 10) == HAL_OK) {
    if (rx == 'L') HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
    HAL_UART_Transmit(&amp;huart2, &amp;rx, 1, 100);   /* dội lại */
}

/* Chuyển hướng printf (newlib): cài _write */
int _write(int file, char *ptr, int len) {
    HAL_UART_Transmit(&amp;huart2, (uint8_t*)ptr, len, 100);
    return len;
}
</code></pre>
<h3>Code — Arduino</h3>
<pre><code>void setup() { Serial.begin(115200); Serial.println("PEB301 UART ready"); }
void loop() {
    if (Serial.available()) {
        char c = Serial.read();
        if (c == 'L') digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
        Serial.print(c);            // dội lại
    }
}
</code></pre>
<h3>Kết quả mong đợi</h3>
<p>Mở terminal ở 115200: bạn thấy "PEB301 UART ready". Gõ một ký tự thì nó dội lại; gõ 'L' thì LED đảo. Chữ bị rối gần như luôn là do lệch baud.</p>
<div class="callout"><span class="badge">Mở rộng</span> Gửi trạng thái LED thành một dòng mỗi giây bằng <code>printf</code>. Rồi chuyển RX sang ngắt/DMA để việc nhận không chặn vòng lặp.</div>`,
  ]]);

const c3q = quiz('peb301-quiz-3', 'Quiz Lab 3 — UART|||Quiz Lab 3 — UART', [
  { id: 'q1', question: 'Nối UART giữa hai thiết bị thì TX của bên này nối vào?', options: ['TX của bên kia', 'RX của bên kia (bắt chéo)', 'GND', 'Nguồn 5V'], correctIndex: 1, explanation: 'TX (phát) của bên này phải vào RX (thu) của bên kia, và ngược lại.' },
  { id: 'q2', question: 'Chữ hiển thị bị rối trên terminal thường do?', options: ['Thiếu điện trở', 'Lệch tốc độ baud giữa hai bên', 'LED cháy', 'Sai cực nút'], correctIndex: 1, explanation: 'Hai bên phải cùng baud (vd 115200); lệch baud làm khung bit đọc sai.' },
  { id: 'q3', question: '"8N1" trong cấu hình UART nghĩa là?', options: ['8 byte, không dừng, 1 chẵn lẻ', '8 bit dữ liệu, không chẵn lẻ (No parity), 1 bit stop', '8 MHz, N kênh, 1 dây', '8 baud, mức 1'], correctIndex: 1, explanation: '8 data bits, No parity, 1 stop bit — khung UART phổ biến nhất.' },
]);

const c4 = doc('peb301-4-1-timer-pwm', 'Lab 4 — Timers & PWM: dim an LED, drive a motor|||Lab 4 — Timer & PWM: chỉnh sáng LED, lái động cơ',
  'Timer sinh ngắt định kỳ (không blocking); PWM đổi duty cycle để chỉnh độ sáng LED / tốc độ động cơ.',
  [[
    `<span class="eyebrow">PEB301 · Lab 4</span>
<h2>Timers &amp; PWM — dim an LED, drive a motor</h2>
<p><strong>Objective.</strong> Use a hardware <strong>timer</strong> for accurate, non-blocking timing, then generate <strong>PWM</strong> to smoothly change an LED's brightness or a motor's speed by varying the <em>duty cycle</em>.</p>
<h3>Concept</h3>
<p>PWM switches a pin on/off very fast. The fraction of time it is on = <strong>duty cycle</strong>. 25% duty ~ dim; 75% duty ~ bright. The average power tracks the duty cycle.</p>
<h3>Equipment</h3>
<ul>
<li>Board, 1 LED + resistor on a PWM-capable pin. For a motor: a small DC motor + a driver (transistor/MOSFET or an H-bridge module) and a separate motor supply. Never power a motor from the MCU pin.</li>
</ul>
<h3>Wiring (motor via driver)</h3>
<pre><code>MCU PWM pin --&gt; driver input (e.g. L298N IN / MOSFET gate)
Motor supply +  --&gt; driver motor V+
Driver out      --&gt; motor terminals
MCU GND --------&gt; driver GND (COMMON ground - required)
</code></pre>
<h3>Steps</h3>
<ol>
<li>Configure a timer channel for <strong>PWM output</strong> (pick a frequency, e.g. 1 kHz).</li>
<li>Set the compare value to change the duty cycle.</li>
<li>Sweep the duty from 0% to 100% and back to see the LED breathe / motor ramp.</li>
</ol>
<h3>Code — STM32 HAL</h3>
<pre><code>/* TIM2 CH1 configured for PWM, ARR (period) = 999 -&gt; 0..999 = 0..100% */
HAL_TIM_PWM_Start(&amp;htim2, TIM_CHANNEL_1);
for (int duty = 0; duty &lt;= 999; duty += 10) {
    __HAL_TIM_SET_COMPARE(&amp;htim2, TIM_CHANNEL_1, duty);
    HAL_Delay(10);
}
</code></pre>
<h3>Code — Arduino</h3>
<pre><code>const int pwmPin = 9;               // PWM-capable
void setup() { pinMode(pwmPin, OUTPUT); }
void loop() {
    for (int duty = 0; duty &lt;= 255; duty++) { analogWrite(pwmPin, duty); delay(5); }
    for (int duty = 255; duty &gt;= 0; duty--) { analogWrite(pwmPin, duty); delay(5); }
}
</code></pre>
<h3>Expected result</h3>
<p>The LED "breathes" smoothly from off to full and back; the motor ramps its speed. Low duty = dim/slow, high duty = bright/fast.</p>
<div class="callout"><span class="badge">Mở rộng</span> Configure a separate timer to fire an <strong>update interrupt</strong> at exactly 1 kHz and toggle a pin inside it — a non-blocking alternative to <code>HAL_Delay</code>. Explain frequency vs duty cycle.</div>`,
    `<span class="eyebrow">PEB301 · Lab 4</span>
<h2>Timer &amp; PWM — chỉnh sáng LED, lái động cơ</h2>
<p><strong>Mục tiêu.</strong> Dùng <strong>timer</strong> phần cứng để định thời chính xác, không blocking, rồi sinh <strong>PWM</strong> để đổi mượt độ sáng LED hoặc tốc độ động cơ bằng cách thay đổi <em>chu kỳ nhiệm vụ (duty cycle)</em>.</p>
<h3>Khái niệm</h3>
<p>PWM bật/tắt chân rất nhanh. Tỉ lệ thời gian bật = <strong>duty cycle</strong>. Duty 25% ~ mờ; duty 75% ~ sáng. Công suất trung bình bám theo duty cycle.</p>
<h3>Thiết bị</h3>
<ul>
<li>Board, 1 LED + điện trở trên chân có PWM. Với động cơ: một động cơ DC nhỏ + mạch lái (transistor/MOSFET hoặc module cầu H) và nguồn động cơ riêng. Đừng bao giờ cấp cho động cơ từ chân MCU.</li>
</ul>
<h3>Sơ đồ nối (động cơ qua mạch lái)</h3>
<pre><code>Chân PWM MCU --&gt; input mạch lái (vd IN của L298N / gate MOSFET)
Nguồn động cơ + --&gt; V+ động cơ của mạch lái
Ngõ ra mạch lái --&gt; hai đầu động cơ
GND MCU --------&gt; GND mạch lái (CHUNG mass - bắt buộc)
</code></pre>
<h3>Các bước</h3>
<ol>
<li>Cấu hình một kênh timer thành <strong>ngõ ra PWM</strong> (chọn tần số, vd 1 kHz).</li>
<li>Đặt giá trị so sánh để đổi duty cycle.</li>
<li>Quét duty từ 0% lên 100% rồi về, để thấy LED "thở" / động cơ tăng tốc dần.</li>
</ol>
<h3>Code — STM32 HAL</h3>
<pre><code>/* TIM2 CH1 cấu hình PWM, ARR (chu kỳ) = 999 -&gt; 0..999 = 0..100% */
HAL_TIM_PWM_Start(&amp;htim2, TIM_CHANNEL_1);
for (int duty = 0; duty &lt;= 999; duty += 10) {
    __HAL_TIM_SET_COMPARE(&amp;htim2, TIM_CHANNEL_1, duty);
    HAL_Delay(10);
}
</code></pre>
<h3>Code — Arduino</h3>
<pre><code>const int pwmPin = 9;               // chân có PWM
void setup() { pinMode(pwmPin, OUTPUT); }
void loop() {
    for (int duty = 0; duty &lt;= 255; duty++) { analogWrite(pwmPin, duty); delay(5); }
    for (int duty = 255; duty &gt;= 0; duty--) { analogWrite(pwmPin, duty); delay(5); }
}
</code></pre>
<h3>Kết quả mong đợi</h3>
<p>LED "thở" mượt từ tắt đến sáng đầy rồi về; động cơ tăng/giảm tốc dần. Duty thấp = mờ/chậm, duty cao = sáng/nhanh.</p>
<div class="callout"><span class="badge">Mở rộng</span> Cấu hình một timer riêng sinh <strong>ngắt update</strong> đúng 1 kHz và đảo một chân trong đó — cách không blocking thay cho <code>HAL_Delay</code>. Giải thích tần số khác duty cycle thế nào.</div>`,
  ]]);

const c4q = quiz('peb301-quiz-4', 'Quiz Lab 4 — Timer & PWM|||Quiz Lab 4 — Timer & PWM', [
  { id: 'q1', question: 'Duty cycle của PWM quyết định điều gì?', options: ['Tần số đóng cắt', 'Tỉ lệ thời gian bật, quyết định công suất trung bình', 'Số chân dùng', 'Điện áp nguồn'], correctIndex: 1, explanation: 'Duty cycle là tỉ lệ thời gian mức cao; công suất/độ sáng/tốc độ trung bình bám theo nó.' },
  { id: 'q2', question: 'Vì sao không lái động cơ trực tiếp từ chân MCU?', options: ['Chân MCU không đủ dòng và có thể hỏng, cần mạch lái', 'Động cơ chỉ chạy PWM', 'MCU không có timer', 'Vì thiếu điện trở'], correctIndex: 0, explanation: 'Chân MCU chỉ cấp vài chục mA; động cơ cần dòng lớn nên phải qua transistor/driver.' },
  { id: 'q3', question: 'Dùng ngắt update của timer thay cho HAL_Delay để?', options: ['Tiết kiệm RAM', 'Định thời chính xác mà không chặn CPU (non-blocking)', 'Tăng baud UART', 'Đọc nhiều ADC hơn'], correctIndex: 1, explanation: 'Timer chạy độc lập phần cứng; ngắt định kỳ cho phép CPU làm việc khác thay vì chờ.' },
]);

const c5 = doc('peb301-5-1-adc', 'Lab 5 — ADC: read an analog sensor|||Lab 5 — ADC: đọc cảm biến analog',
  'ADC chuyển điện áp analog thành số; đọc biến trở/cảm biến; độ phân giải, điện áp tham chiếu, quy đổi ra đơn vị vật lý.',
  [[
    `<span class="eyebrow">PEB301 · Lab 5</span>
<h2>ADC — read an analog sensor</h2>
<p><strong>Objective.</strong> Use the <strong>ADC</strong> (analog-to-digital converter) to read a varying voltage from a potentiometer or analog sensor, convert the raw count to volts, and print it over UART.</p>
<h3>Concept</h3>
<p>An ADC maps an input voltage (0 to Vref) to an integer 0 to (2^N - 1). A 12-bit ADC gives 0..4095. Volts = raw / 4095 * Vref. Then map volts to a physical unit using the sensor's datasheet.</p>
<h3>Equipment</h3>
<ul>
<li>Board, 1 potentiometer (or an analog sensor such as an LM35/NTC/LDR), UART terminal from Lab 3.</li>
</ul>
<h3>Wiring (potentiometer)</h3>
<pre><code>Pot end 1  --&gt; 3V3   (Vref side)
Pot end 2  --&gt; GND
Pot wiper  --&gt; ADC input pin (e.g. PA0 / A0)
</code></pre>
<h3>Steps</h3>
<ol>
<li>Enable one ADC channel on the wiper pin; pick 12-bit resolution.</li>
<li>Start a conversion, read the raw value.</li>
<li>Convert to volts; print raw + volts over UART.</li>
<li>Turn the pot and watch the numbers span 0 to Vref.</li>
</ol>
<h3>Code — STM32 HAL</h3>
<pre><code>HAL_ADC_Start(&amp;hadc1);
if (HAL_ADC_PollForConversion(&amp;hadc1, 10) == HAL_OK) {
    uint32_t raw = HAL_ADC_GetValue(&amp;hadc1);   /* 0..4095 */
    float volts = raw * 3.3f / 4095.0f;
    printf("raw=%lu  V=%.3f\r\n", raw, volts);
}
HAL_ADC_Stop(&amp;hadc1);
</code></pre>
<h3>Code — Arduino</h3>
<pre><code>void setup() { Serial.begin(115200); }
void loop() {
    int raw = analogRead(A0);            // Uno: 0..1023 (10-bit)
    float volts = raw * 5.0 / 1023.0;
    Serial.print("raw="); Serial.print(raw);
    Serial.print("  V="); Serial.println(volts, 3);
    delay(200);
}
</code></pre>
<h3>Expected result</h3>
<p>Turning the pot fully sweeps raw from 0 to the max count and volts from 0 to Vref. A steady reading that never changes usually means the wiper pin is not actually connected to the ADC input.</p>
<div class="callout"><span class="badge">Mở rộng</span> Average 16 samples to reduce noise. If you used an LM35 (10 mV per degree C), convert volts to degrees C and print the temperature.</div>`,
    `<span class="eyebrow">PEB301 · Lab 5</span>
<h2>ADC — đọc cảm biến analog</h2>
<p><strong>Mục tiêu.</strong> Dùng <strong>ADC</strong> (bộ chuyển analog sang số) để đọc điện áp thay đổi từ biến trở hoặc cảm biến analog, quy đổi số thô ra volt, và in ra qua UART.</p>
<h3>Khái niệm</h3>
<p>ADC ánh xạ điện áp vào (0 đến Vref) thành số nguyên 0 đến (2^N - 1). ADC 12-bit cho 0..4095. Volt = thô / 4095 * Vref. Sau đó đổi volt sang đơn vị vật lý theo datasheet cảm biến.</p>
<h3>Thiết bị</h3>
<ul>
<li>Board, 1 biến trở (hoặc cảm biến analog như LM35/NTC/LDR), terminal UART từ Lab 3.</li>
</ul>
<h3>Sơ đồ nối (biến trở)</h3>
<pre><code>Đầu 1 biến trở --&gt; 3V3   (phía Vref)
Đầu 2 biến trở --&gt; GND
Chân giữa (wiper) --&gt; chân input ADC (vd PA0 / A0)
</code></pre>
<h3>Các bước</h3>
<ol>
<li>Bật một kênh ADC trên chân wiper; chọn độ phân giải 12-bit.</li>
<li>Khởi động một lần chuyển đổi, đọc giá trị thô.</li>
<li>Quy đổi ra volt; in cả thô + volt qua UART.</li>
<li>Xoay biến trở và xem số chạy từ 0 đến Vref.</li>
</ol>
<h3>Code — STM32 HAL</h3>
<pre><code>HAL_ADC_Start(&amp;hadc1);
if (HAL_ADC_PollForConversion(&amp;hadc1, 10) == HAL_OK) {
    uint32_t raw = HAL_ADC_GetValue(&amp;hadc1);   /* 0..4095 */
    float volts = raw * 3.3f / 4095.0f;
    printf("raw=%lu  V=%.3f\r\n", raw, volts);
}
HAL_ADC_Stop(&amp;hadc1);
</code></pre>
<h3>Code — Arduino</h3>
<pre><code>void setup() { Serial.begin(115200); }
void loop() {
    int raw = analogRead(A0);            // Uno: 0..1023 (10-bit)
    float volts = raw * 5.0 / 1023.0;
    Serial.print("raw="); Serial.print(raw);
    Serial.print("  V="); Serial.println(volts, 3);
    delay(200);
}
</code></pre>
<h3>Kết quả mong đợi</h3>
<p>Xoay hết biến trở làm số thô chạy từ 0 đến giá trị lớn nhất và volt từ 0 đến Vref. Nếu số đứng yên không đổi thì thường chân wiper chưa thật sự nối vào chân ADC.</p>
<div class="callout"><span class="badge">Mở rộng</span> Lấy trung bình 16 mẫu để giảm nhiễu. Nếu dùng LM35 (10 mV mỗi độ C), đổi volt ra độ C và in nhiệt độ.</div>`,
  ]]);

const c5q = quiz('peb301-quiz-5', 'Quiz Lab 5 — ADC|||Quiz Lab 5 — ADC', [
  { id: 'q1', question: 'ADC 12-bit cho dải giá trị số thô là?', options: ['0..255', '0..1023', '0..4095', '0..65535'], correctIndex: 2, explanation: '12-bit: 2^12 = 4096 mức, tức 0..4095.' },
  { id: 'q2', question: 'Công thức quy đổi số thô ra điện áp (ADC 12-bit)?', options: ['V = raw * Vref / 4095', 'V = raw + Vref', 'V = 4095 / raw', 'V = raw * 4095'], correctIndex: 0, explanation: 'V = raw / 4095 * Vref; số thô tỉ lệ tuyến tính với điện áp vào.' },
  { id: 'q3', question: 'Số ADC đứng yên dù xoay biến trở thường vì?', options: ['Vref quá cao', 'Chân wiper chưa nối đúng vào chân ADC', 'Độ phân giải thấp', 'Baud UART sai'], correctIndex: 1, explanation: 'Nếu chân giữa biến trở không nối vào ngõ ADC thì điện áp vào không đổi.' },
]);

const c6 = doc('peb301-6-1-i2c-spi', 'Lab 6 — I2C / SPI: talk to a module|||Lab 6 — Giao tiếp I2C/SPI với module',
  'Bus I2C (2 dây, địa chỉ) và SPI (đồng bộ, chip select); đọc cảm biến / ghi màn OLED; quét địa chỉ I2C.',
  [[
    `<span class="eyebrow">PEB301 · Lab 6</span>
<h2>I2C / SPI — talk to a module</h2>
<p><strong>Objective.</strong> Communicate with a real peripheral module over a <strong>bus</strong>: <strong>I2C</strong> (2 wires, addressed devices) or <strong>SPI</strong> (faster, uses a chip-select line). Read a sensor register, or write to an OLED display.</p>
<h3>Concept</h3>
<ul>
<li><strong>I2C</strong> — SDA (data) + SCL (clock), open-drain with pull-ups; each device has a 7-bit <strong>address</strong>; many devices share the 2 wires.</li>
<li><strong>SPI</strong> — SCK, MOSI, MISO + one <strong>CS</strong> (chip select) per device; full-duplex and fast, but more wires.</li>
</ul>
<h3>Equipment</h3>
<ul>
<li>Board, an I2C module (e.g. SSD1306 OLED or a BMP280/MPU6050 sensor) or an SPI module. 4.7k ohm pull-ups on SDA/SCL if the module lacks them.</li>
</ul>
<h3>Wiring (I2C)</h3>
<pre><code>Module VCC --&gt; 3V3      Module SDA --&gt; MCU SDA (e.g. PB7 / A4)
Module GND --&gt; GND      Module SCL --&gt; MCU SCL (e.g. PB6 / A5)
Pull-ups 4.7k ohm from SDA and SCL to 3V3 (if not on the module)
</code></pre>
<h3>Steps</h3>
<ol>
<li>Enable I2C (or SPI) at the standard speed (100 kHz / 400 kHz for I2C).</li>
<li>Scan the bus to find the device address (I2C).</li>
<li>Read a known register (e.g. the chip ID) and verify it matches the datasheet.</li>
<li>Write data (e.g. a byte to the OLED, or a config register).</li>
</ol>
<h3>Code — STM32 HAL (I2C scan + read)</h3>
<pre><code>for (uint8_t addr = 1; addr &lt; 128; addr++) {
    if (HAL_I2C_IsDeviceReady(&amp;hi2c1, addr &lt;&lt; 1, 2, 5) == HAL_OK)
        printf("Found device at 0x%02X\r\n", addr);
}
uint8_t reg = 0xD0, id = 0;                 /* BMP280 chip-id register */
HAL_I2C_Master_Transmit(&amp;hi2c1, 0x76 &lt;&lt; 1, &amp;reg, 1, 10);
HAL_I2C_Master_Receive(&amp;hi2c1, 0x76 &lt;&lt; 1, &amp;id, 1, 10);
printf("chip id = 0x%02X\r\n", id);
</code></pre>
<h3>Code — Arduino (I2C scan)</h3>
<pre><code>#include &lt;Wire.h&gt;
void setup() {
    Wire.begin(); Serial.begin(115200);
    for (byte a = 1; a &lt; 127; a++) {
        Wire.beginTransmission(a);
        if (Wire.endTransmission() == 0) { Serial.print("Found 0x"); Serial.println(a, HEX); }
    }
}
void loop() {}
</code></pre>
<h3>Expected result</h3>
<p>The scan prints the module's address; reading the chip-ID register returns the exact value from the datasheet. If the scan finds nothing, check power, the SDA/SCL pins, and the pull-ups.</p>
<div class="callout"><span class="badge">Mở rộng</span> Print live sensor readings once a second, or draw text on the OLED. Compare I2C vs SPI: when would you pick each?</div>`,
    `<span class="eyebrow">PEB301 · Lab 6</span>
<h2>I2C / SPI — giao tiếp với module</h2>
<p><strong>Mục tiêu.</strong> Giao tiếp với một module ngoại vi thật qua <strong>bus</strong>: <strong>I2C</strong> (2 dây, thiết bị có địa chỉ) hoặc <strong>SPI</strong> (nhanh hơn, dùng đường chip-select). Đọc thanh ghi cảm biến, hoặc ghi ra màn OLED.</p>
<h3>Khái niệm</h3>
<ul>
<li><strong>I2C</strong> — SDA (dữ liệu) + SCL (xung), open-drain có điện trở kéo; mỗi thiết bị có <strong>địa chỉ</strong> 7-bit; nhiều thiết bị dùng chung 2 dây.</li>
<li><strong>SPI</strong> — SCK, MOSI, MISO + một đường <strong>CS</strong> (chip select) cho mỗi thiết bị; song công và nhanh, nhưng nhiều dây hơn.</li>
</ul>
<h3>Thiết bị</h3>
<ul>
<li>Board, một module I2C (vd OLED SSD1306 hoặc cảm biến BMP280/MPU6050) hoặc module SPI. Điện trở kéo 4.7k ohm trên SDA/SCL nếu module chưa có.</li>
</ul>
<h3>Sơ đồ nối (I2C)</h3>
<pre><code>Module VCC --&gt; 3V3      Module SDA --&gt; SDA MCU (vd PB7 / A4)
Module GND --&gt; GND      Module SCL --&gt; SCL MCU (vd PB6 / A5)
Kéo 4.7k ohm từ SDA và SCL lên 3V3 (nếu module chưa có)
</code></pre>
<h3>Các bước</h3>
<ol>
<li>Bật I2C (hoặc SPI) ở tốc độ chuẩn (100 kHz / 400 kHz với I2C).</li>
<li>Quét bus để tìm địa chỉ thiết bị (I2C).</li>
<li>Đọc một thanh ghi đã biết (vd chip ID) và kiểm khớp datasheet.</li>
<li>Ghi dữ liệu (vd một byte ra OLED, hoặc một thanh ghi cấu hình).</li>
</ol>
<h3>Code — STM32 HAL (quét I2C + đọc)</h3>
<pre><code>for (uint8_t addr = 1; addr &lt; 128; addr++) {
    if (HAL_I2C_IsDeviceReady(&amp;hi2c1, addr &lt;&lt; 1, 2, 5) == HAL_OK)
        printf("Tim thay thiet bi tai 0x%02X\r\n", addr);
}
uint8_t reg = 0xD0, id = 0;                 /* thanh ghi chip-id BMP280 */
HAL_I2C_Master_Transmit(&amp;hi2c1, 0x76 &lt;&lt; 1, &amp;reg, 1, 10);
HAL_I2C_Master_Receive(&amp;hi2c1, 0x76 &lt;&lt; 1, &amp;id, 1, 10);
printf("chip id = 0x%02X\r\n", id);
</code></pre>
<h3>Code — Arduino (quét I2C)</h3>
<pre><code>#include &lt;Wire.h&gt;
void setup() {
    Wire.begin(); Serial.begin(115200);
    for (byte a = 1; a &lt; 127; a++) {
        Wire.beginTransmission(a);
        if (Wire.endTransmission() == 0) { Serial.print("Tim thay 0x"); Serial.println(a, HEX); }
    }
}
void loop() {}
</code></pre>
<h3>Kết quả mong đợi</h3>
<p>Bản quét in ra địa chỉ của module; đọc thanh ghi chip-ID trả đúng giá trị trong datasheet. Nếu quét không thấy gì, kiểm nguồn, chân SDA/SCL, và điện trở kéo.</p>
<div class="callout"><span class="badge">Mở rộng</span> In số đọc cảm biến mỗi giây, hoặc vẽ chữ lên OLED. So I2C với SPI: khi nào nên chọn cái nào?</div>`,
  ]]);

const c6q = quiz('peb301-quiz-6', 'Quiz Lab 6 — I2C/SPI|||Quiz Lab 6 — I2C/SPI', [
  { id: 'q1', question: 'Bus I2C dùng mấy dây tín hiệu và tên là gì?', options: ['1 dây: DATA', '2 dây: SDA (dữ liệu) và SCL (xung)', '3 dây: MOSI/MISO/SCK', '4 dây: TX/RX/CTS/RTS'], correctIndex: 1, explanation: 'I2C dùng SDA và SCL; nhiều thiết bị dùng chung 2 dây, phân biệt bằng địa chỉ.' },
  { id: 'q2', question: 'Nhiều thiết bị trên cùng bus I2C được phân biệt nhờ?', options: ['Chip select riêng', 'Địa chỉ 7-bit của mỗi thiết bị', 'Màu dây', 'Tốc độ baud'], correctIndex: 1, explanation: 'Mỗi thiết bị I2C có một địa chỉ; master gọi đúng địa chỉ để trao đổi.' },
  { id: 'q3', question: 'SPI khác I2C chủ yếu ở?', options: ['SPI chỉ 1 dây', 'SPI dùng đường CS riêng cho mỗi thiết bị và nhanh hơn, nhiều dây hơn', 'SPI không cần clock', 'SPI dùng địa chỉ như I2C'], correctIndex: 1, explanation: 'SPI có SCK/MOSI/MISO và một CS cho mỗi thiết bị, song công, nhanh nhưng tốn dây hơn I2C.' },
]);

const c7 = doc('peb301-7-1-freertos', 'Lab 7 — FreeRTOS: multitasking with tasks|||Lab 7 — FreeRTOS: đa nhiệm (tasks)',
  'Tạo nhiều task chạy song song; độ ưu tiên; vTaskDelay không chặn; truyền dữ liệu qua queue.',
  [[
    `<span class="eyebrow">PEB301 · Lab 7</span>
<h2>FreeRTOS — multitasking with tasks</h2>
<p><strong>Objective.</strong> Split your program into independent <strong>tasks</strong> scheduled by <strong>FreeRTOS</strong>. Run an LED blink and a UART print "at the same time" without one blocking the other, then pass data safely between tasks using a <strong>queue</strong>.</p>
<h3>Concept</h3>
<p>An RTOS scheduler switches between tasks by priority and time. <code>vTaskDelay</code> yields the CPU to other tasks (unlike <code>HAL_Delay</code>, which just burns cycles). A <strong>queue</strong> moves data between tasks without race conditions.</p>
<h3>Equipment</h3>
<ul>
<li>Board with FreeRTOS enabled (STM32CubeIDE can generate it; ESP32 Arduino core already includes it), LED, UART terminal.</li>
</ul>
<h3>Steps</h3>
<ol>
<li>Create two tasks: <em>Blink</em> (toggle LED every 500 ms) and <em>Report</em> (print a counter every 1000 ms).</li>
<li>Use <code>vTaskDelay</code> in each so both run concurrently.</li>
<li>Add a queue: Blink sends the LED state, Report receives and prints it.</li>
<li>Give the tasks different priorities and observe scheduling.</li>
</ol>
<h3>Code — FreeRTOS (CMSIS-RTOS / native API)</h3>
<pre><code>QueueHandle_t q;

void BlinkTask(void *arg) {
    bool state = false;
    for (;;) {
        HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
        state = !state;
        xQueueSend(q, &amp;state, 0);
        vTaskDelay(pdMS_TO_TICKS(500));    /* yields CPU */
    }
}
void ReportTask(void *arg) {
    bool s;
    for (;;) {
        if (xQueueReceive(q, &amp;s, portMAX_DELAY) == pdTRUE)
            printf("LED state = %d\r\n", s);
    }
}
int main(void) {
    /* HAL_Init, clocks, GPIO, UART ... */
    q = xQueueCreate(4, sizeof(bool));
    xTaskCreate(BlinkTask,  "blink",  128, NULL, 2, NULL);
    xTaskCreate(ReportTask, "report", 256, NULL, 1, NULL);
    vTaskStartScheduler();               /* never returns */
    while (1) {}
}
</code></pre>
<h3>Expected result</h3>
<p>The LED keeps blinking on its own schedule while the UART independently prints the state each time it changes — neither stalls the other. If the whole thing freezes, a task likely overflowed its stack or called a blocking delay.</p>
<div class="callout"><span class="badge">Mở rộng</span> Add a third task that reads the ADC (Lab 5) and sends the value through the queue. Explain why <code>vTaskDelay</code> is better than <code>HAL_Delay</code> under an RTOS.</div>`,
    `<span class="eyebrow">PEB301 · Lab 7</span>
<h2>FreeRTOS — đa nhiệm với các task</h2>
<p><strong>Mục tiêu.</strong> Chia chương trình thành các <strong>task</strong> độc lập do <strong>FreeRTOS</strong> lập lịch. Cho LED nhấp nháy và UART in "cùng lúc" mà không cái nào chặn cái nào, rồi truyền dữ liệu an toàn giữa các task bằng <strong>queue (hàng đợi)</strong>.</p>
<h3>Khái niệm</h3>
<p>Bộ lập lịch RTOS chuyển giữa các task theo độ ưu tiên và thời gian. <code>vTaskDelay</code> nhường CPU cho task khác (khác <code>HAL_Delay</code> chỉ đốt chu kỳ). <strong>Queue</strong> chuyển dữ liệu giữa các task mà không bị tranh chấp (race).</p>
<h3>Thiết bị</h3>
<ul>
<li>Board đã bật FreeRTOS (STM32CubeIDE sinh được; nhân Arduino ESP32 đã kèm sẵn), LED, terminal UART.</li>
</ul>
<h3>Các bước</h3>
<ol>
<li>Tạo hai task: <em>Blink</em> (đảo LED mỗi 500 ms) và <em>Report</em> (in bộ đếm mỗi 1000 ms).</li>
<li>Dùng <code>vTaskDelay</code> trong mỗi task để cả hai chạy đồng thời.</li>
<li>Thêm queue: Blink gửi trạng thái LED, Report nhận và in ra.</li>
<li>Đặt độ ưu tiên khác nhau cho các task và quan sát lập lịch.</li>
</ol>
<h3>Code — FreeRTOS (CMSIS-RTOS / API gốc)</h3>
<pre><code>QueueHandle_t q;

void BlinkTask(void *arg) {
    bool state = false;
    for (;;) {
        HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
        state = !state;
        xQueueSend(q, &amp;state, 0);
        vTaskDelay(pdMS_TO_TICKS(500));    /* nhường CPU */
    }
}
void ReportTask(void *arg) {
    bool s;
    for (;;) {
        if (xQueueReceive(q, &amp;s, portMAX_DELAY) == pdTRUE)
            printf("LED state = %d\r\n", s);
    }
}
int main(void) {
    /* HAL_Init, clock, GPIO, UART ... */
    q = xQueueCreate(4, sizeof(bool));
    xTaskCreate(BlinkTask,  "blink",  128, NULL, 2, NULL);
    xTaskCreate(ReportTask, "report", 256, NULL, 1, NULL);
    vTaskStartScheduler();               /* không bao giờ trả về */
    while (1) {}
}
</code></pre>
<h3>Kết quả mong đợi</h3>
<p>LED cứ nhấp nháy theo nhịp riêng trong khi UART in trạng thái mỗi lần nó đổi, độc lập nhau — không cái nào làm kẹt cái kia. Nếu cả hệ đơ, có thể một task tràn stack hoặc gọi delay chặn.</p>
<div class="callout"><span class="badge">Mở rộng</span> Thêm task thứ ba đọc ADC (Lab 5) và gửi giá trị qua queue. Giải thích vì sao <code>vTaskDelay</code> tốt hơn <code>HAL_Delay</code> khi có RTOS.</div>`,
  ]]);

const c7q = quiz('peb301-quiz-7', 'Quiz Lab 7 — FreeRTOS|||Quiz Lab 7 — FreeRTOS', [
  { id: 'q1', question: 'vTaskDelay khác HAL_Delay chủ yếu ở chỗ?', options: ['Chính xác hơn về thời gian', 'Nhường CPU cho task khác thay vì đốt chu kỳ chờ', 'Không cần RTOS', 'Đo bằng giây'], correctIndex: 1, explanation: 'vTaskDelay đưa task vào trạng thái chờ và nhường CPU; HAL_Delay chặn, giữ CPU.' },
  { id: 'q2', question: 'Queue trong FreeRTOS dùng để?', options: ['Đặt độ ưu tiên task', 'Truyền dữ liệu an toàn giữa các task, tránh tranh chấp', 'Tạo ngắt', 'Đọc ADC'], correctIndex: 1, explanation: 'Queue là kênh truyền dữ liệu có đồng bộ giữa các task, tránh race condition.' },
  { id: 'q3', question: 'Bộ lập lịch (scheduler) FreeRTOS quyết định task nào chạy dựa trên?', options: ['Thứ tự khai báo', 'Độ ưu tiên và thời gian', 'Kích thước stack', 'Số chân GPIO'], correctIndex: 1, explanation: 'Scheduler chọn task sẵn sàng có ưu tiên cao nhất và chia thời gian giữa các task cùng mức.' },
]);

const c8 = doc('peb301-8-1-capstone-can', 'Lab 8 — Capstone: a small automotive system with CAN|||Lab 8 — Lab tổng hợp: hệ nhúng ô tô nhỏ với CAN',
  'Gộp mọi kỹ năng: đọc cảm biến (ADC) → xử lý → điều khiển (PWM/LED) + báo cáo qua bus CAN; khung tin CAN cho ô tô.',
  [[
    `<span class="eyebrow">PEB301 · Lab 8 · Capstone</span>
<h2>Capstone — a small automotive system with CAN</h2>
<p><strong>Objective.</strong> Combine every earlier lab into one working embedded system that mirrors how a real car node behaves: <strong>read a sensor -&gt; decide -&gt; actuate -&gt; report over CAN</strong>. Two boards act as two ECUs (electronic control units) talking on a shared <strong>CAN</strong> bus.</p>
<h3>Why CAN?</h3>
<p><strong>CAN (Controller Area Network)</strong> is the robust, multi-master bus that links the dozens of ECUs in a vehicle (engine, brakes, dashboard). Messages carry an <strong>ID</strong> (which also sets priority) and up to 8 data bytes; any node can broadcast, and the lowest ID wins arbitration.</p>
<h3>System spec</h3>
<ul>
<li><strong>Node A (sensor/controller):</strong> read a potentiometer as a "throttle" (ADC), compute a "speed", drive an LED/motor with PWM proportional to it, and broadcast the speed over CAN every 100 ms.</li>
<li><strong>Node B (dashboard):</strong> receive the CAN message and print the speed over UART; light a warning LED if speed exceeds a threshold.</li>
<li>Use <strong>FreeRTOS</strong> tasks: one for sensing/actuating, one for CAN TX, one for CAN RX/report.</li>
</ul>
<h3>Equipment</h3>
<ul>
<li>2 boards, 2 <strong>CAN transceivers</strong> (MCP2551 / SN65HVD230), a potentiometer, an LED/motor+driver, jumpers, and a <strong>120 ohm termination</strong> resistor at each end of the bus. (Or simulate the whole thing in Wokwi.)</li>
</ul>
<h3>Wiring (CAN bus)</h3>
<pre><code>MCU A CAN_TX/RX --&gt; Transceiver A --&gt; CANH / CANL bus lines
MCU B CAN_TX/RX --&gt; Transceiver B --&gt; same CANH / CANL
120 ohm between CANH and CANL at EACH end of the bus
All grounds common
</code></pre>
<h3>Steps</h3>
<ol>
<li>Bring up CAN on both nodes at the same bitrate (e.g. 500 kbit/s).</li>
<li>Node A: sample ADC, map to speed, set PWM, pack speed into a CAN frame, transmit.</li>
<li>Node B: filter for that CAN ID, unpack the speed, print it, and drive the warning LED.</li>
<li>Wrap sensing, TX, and RX into separate FreeRTOS tasks.</li>
</ol>
<h3>Code — STM32 HAL (CAN transmit on Node A)</h3>
<pre><code>CAN_TxHeaderTypeDef tx;
uint8_t data[2];
uint32_t mailbox;

uint16_t speed = adc_raw / 16;          /* map 0..4095 -&gt; 0..255-ish */
data[0] = speed &amp; 0xFF;
data[1] = (speed &gt;&gt; 8) &amp; 0xFF;

tx.StdId = 0x123;                        /* message ID = priority */
tx.IDE   = CAN_ID_STD;
tx.RTR   = CAN_RTR_DATA;
tx.DLC   = 2;                            /* 2 data bytes */
HAL_CAN_AddTxMessage(&amp;hcan, &amp;tx, data, &amp;mailbox);
</code></pre>
<h3>Code — STM32 HAL (CAN receive on Node B)</h3>
<pre><code>CAN_RxHeaderTypeDef rx;
uint8_t data[8];
if (HAL_CAN_GetRxMessage(&amp;hcan, CAN_RX_FIFO0, &amp;rx, data) == HAL_OK) {
    if (rx.StdId == 0x123) {
        uint16_t speed = data[0] | (data[1] &lt;&lt; 8);
        printf("speed = %u\r\n", speed);
        HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5,
                          speed &gt; 200 ? GPIO_PIN_SET : GPIO_PIN_RESET);
    }
}
</code></pre>
<h3>Expected result</h3>
<p>Turning the pot on Node A changes the PWM output <em>and</em> the number printed by Node B in real time; the warning LED on Node B turns on above the threshold. No messages arriving usually means a bitrate mismatch, a missing 120 ohm terminator, or CANH/CANL swapped.</p>
<div class="callout"><span class="badge">Mở rộng</span> Add a second CAN ID for a "brake" command from Node B back to Node A that forces PWM to zero. Log every frame over UART. Discuss how message IDs give priority on the bus.</div>`,
    `<span class="eyebrow">PEB301 · Lab 8 · Tổng hợp</span>
<h2>Tổng hợp — hệ nhúng ô tô nhỏ với CAN</h2>
<p><strong>Mục tiêu.</strong> Gộp mọi lab trước thành một hệ nhúng chạy được, mô phỏng cách một node trong xe thật hoạt động: <strong>đọc cảm biến -&gt; ra quyết định -&gt; điều khiển -&gt; báo cáo qua CAN</strong>. Hai board đóng vai hai ECU (bộ điều khiển điện tử) nói chuyện trên một bus <strong>CAN</strong> chung.</p>
<h3>Vì sao dùng CAN?</h3>
<p><strong>CAN (Controller Area Network)</strong> là bus bền vững, đa chủ, nối hàng chục ECU trong xe (động cơ, phanh, bảng đồng hồ). Mỗi tin mang một <strong>ID</strong> (cũng là độ ưu tiên) và tối đa 8 byte dữ liệu; node nào cũng phát được, ID nhỏ nhất thắng phân xử.</p>
<h3>Đặc tả hệ thống</h3>
<ul>
<li><strong>Node A (cảm biến/điều khiển):</strong> đọc biến trở làm "chân ga" (ADC), tính ra "tốc độ", lái LED/động cơ bằng PWM tỉ lệ với nó, và phát tốc độ qua CAN mỗi 100 ms.</li>
<li><strong>Node B (bảng đồng hồ):</strong> nhận tin CAN và in tốc độ qua UART; bật LED cảnh báo nếu tốc độ vượt ngưỡng.</li>
<li>Dùng task <strong>FreeRTOS</strong>: một task cảm biến/điều khiển, một task phát CAN, một task nhận CAN/báo cáo.</li>
</ul>
<h3>Thiết bị</h3>
<ul>
<li>2 board, 2 <strong>bộ thu phát CAN</strong> (MCP2551 / SN65HVD230), một biến trở, một LED/động cơ+mạch lái, dây cắm, và một điện trở <strong>đầu cuối 120 ohm</strong> ở mỗi đầu bus. (Hoặc mô phỏng toàn bộ trong Wokwi.)</li>
</ul>
<h3>Sơ đồ nối (bus CAN)</h3>
<pre><code>MCU A CAN_TX/RX --&gt; Transceiver A --&gt; đường bus CANH / CANL
MCU B CAN_TX/RX --&gt; Transceiver B --&gt; cùng CANH / CANL
120 ohm giữa CANH và CANL ở MỖI đầu bus
Mọi mass nối chung
</code></pre>
<h3>Các bước</h3>
<ol>
<li>Khởi động CAN trên cả hai node cùng bitrate (vd 500 kbit/s).</li>
<li>Node A: lấy mẫu ADC, quy ra tốc độ, đặt PWM, đóng gói tốc độ vào khung CAN, phát đi.</li>
<li>Node B: lọc đúng CAN ID, giải gói tốc độ, in ra, và lái LED cảnh báo.</li>
<li>Gói việc cảm biến, phát, nhận vào các task FreeRTOS riêng.</li>
</ol>
<h3>Code — STM32 HAL (phát CAN ở Node A)</h3>
<pre><code>CAN_TxHeaderTypeDef tx;
uint8_t data[2];
uint32_t mailbox;

uint16_t speed = adc_raw / 16;          /* quy 0..4095 -&gt; ~0..255 */
data[0] = speed &amp; 0xFF;
data[1] = (speed &gt;&gt; 8) &amp; 0xFF;

tx.StdId = 0x123;                        /* ID tin = độ ưu tiên */
tx.IDE   = CAN_ID_STD;
tx.RTR   = CAN_RTR_DATA;
tx.DLC   = 2;                            /* 2 byte dữ liệu */
HAL_CAN_AddTxMessage(&amp;hcan, &amp;tx, data, &amp;mailbox);
</code></pre>
<h3>Code — STM32 HAL (nhận CAN ở Node B)</h3>
<pre><code>CAN_RxHeaderTypeDef rx;
uint8_t data[8];
if (HAL_CAN_GetRxMessage(&amp;hcan, CAN_RX_FIFO0, &amp;rx, data) == HAL_OK) {
    if (rx.StdId == 0x123) {
        uint16_t speed = data[0] | (data[1] &lt;&lt; 8);
        printf("speed = %u\r\n", speed);
        HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5,
                          speed &gt; 200 ? GPIO_PIN_SET : GPIO_PIN_RESET);
    }
}
</code></pre>
<h3>Kết quả mong đợi</h3>
<p>Xoay biến trở ở Node A làm đổi ngõ PWM <em>và</em> con số Node B in ra theo thời gian thực; LED cảnh báo ở Node B bật khi vượt ngưỡng. Không nhận được tin thường do lệch bitrate, thiếu điện trở đầu cuối 120 ohm, hoặc đảo CANH/CANL.</p>
<div class="callout"><span class="badge">Mở rộng</span> Thêm một CAN ID thứ hai cho lệnh "phanh" từ Node B về Node A để ép PWM về 0. Log mọi khung qua UART. Bàn xem ID tin cho độ ưu tiên trên bus thế nào.</div>`,
  ]]);

const c8q = quiz('peb301-quiz-8', 'Quiz Lab 8 — Capstone CAN|||Quiz Lab 8 — Tổng hợp CAN', [
  { id: 'q1', question: 'Bus CAN trong ô tô dùng để?', options: ['Cấp nguồn cho động cơ', 'Nối nhiều ECU trao đổi dữ liệu bền vững, đa chủ', 'Thay cho pin', 'Đo nhiệt độ'], correctIndex: 1, explanation: 'CAN là bus đa chủ, chống nhiễu, nối các ECU (động cơ, phanh, bảng đồng hồ) trong xe.' },
  { id: 'q2', question: 'ID của một khung CAN ngoài để nhận diện còn quyết định?', options: ['Tốc độ bus', 'Độ ưu tiên khi phân xử (ID nhỏ hơn thắng)', 'Số byte dữ liệu tối đa', 'Điện áp bus'], correctIndex: 1, explanation: 'ID vừa nhận diện tin vừa đặt độ ưu tiên; ID nhỏ hơn thắng arbitration và được phát trước.' },
  { id: 'q3', question: 'Node B không nhận được tin CAN nào, nguyên nhân thường gặp là?', options: ['Thiếu LED', 'Lệch bitrate, thiếu điện trở đầu cuối 120 ohm, hoặc đảo CANH/CANL', 'Sai baud UART', 'ADC quá phân giải'], correctIndex: 1, explanation: 'CAN cần cùng bitrate, đủ hai điện trở đầu cuối 120 ohm, và nối đúng CANH/CANL.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'PEB301',
    slug: 'peb301-practice-of-embedded-system',
    title: 'Practice of Embedded System',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PEB301.webp',
    shortDescription: 'Hands-on embedded lab: 8 progressive labs on STM32/ESP32/Arduino — GPIO LED, buttons & interrupts, UART, timers & PWM, ADC, I2C/SPI, FreeRTOS tasks, and a CAN capstone for automotive. Bilingual with wiring, C/HAL code & quizzes.|||Thực hành nhúng: 8 bài lab tăng dần trên STM32/ESP32/Arduino — LED GPIO, nút & ngắt, UART, timer & PWM, ADC, I2C/SPI, tác vụ FreeRTOS, lab tổng hợp có CAN cho ô tô. Song ngữ, kèm sơ đồ nối, code C/HAL & quiz.',
    description: 'Môn <strong>PEB301 — Practice of Embedded System</strong> (Thực hành Hệ thống nhúng, ngành Kỹ thuật phần mềm ô tô, kỳ 4) là môn <strong>thực hành/lab</strong>. Qua <strong>8 bài lab tăng dần</strong> trên vi điều khiển (STM32 HAL, kèm bản Arduino/ESP32), bạn đi từ <strong>thiết lập toolchain &amp; nhấp nháy LED (GPIO)</strong> → <strong>nút bấm &amp; ngắt ngoài</strong> → <strong>UART</strong> → <strong>timer &amp; PWM</strong> → <strong>ADC</strong> → <strong>I2C/SPI</strong> → <strong>FreeRTOS (đa nhiệm)</strong> → <strong>lab tổng hợp: hệ nhúng ô tô nhỏ đọc cảm biến, xử lý, điều khiển và báo cáo qua bus CAN</strong>. Mỗi lab có mục tiêu, thiết bị, sơ đồ nối, các bước, code và kết quả mong đợi. Bám STM32 HAL docs, Arduino/ESP-IDF docs, FreeRTOS docs và sách <em>Making Embedded Systems</em>.',
    whatYouLearn: 'Thiết lập toolchain &amp; nạp firmware; GPIO input/output; ngắt ngoài (EXTI) &amp; chống dội; UART (115200, 8N1) &amp; printf; timer &amp; PWM (duty cycle) lái LED/động cơ; ADC đọc cảm biến analog &amp; quy đổi đơn vị; bus I2C (địa chỉ) &amp; SPI (chip select); FreeRTOS tasks, vTaskDelay &amp; queue; đóng/giải gói khung CAN và ghép một hệ nhúng ô tô hoàn chỉnh.',
    requirements: 'Biết lập trình C cơ bản; nền điện tử cơ bản (áp/dòng/trở, LED, điện trở). Cần một board STM32/ESP32/Arduino, breadboard, dây cắm và các module trong từng lab; cài STM32CubeIDE hoặc Arduino IDE (hoặc mô phỏng bằng Wokwi/Tinkercad).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Lab materials', description: 'Giáo trình & slide FLM, STM32 HAL/Arduino/ESP-IDF/FreeRTOS docs, sách, công cụ, cách chấm.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Môn thực hành, thiết bị cần, quy ước nối dây, an toàn, cách chấm.', lessons: [intro] },
    { title: 'Lab 1 — Toolchain & GPIO|||Lab 1 — Toolchain & GPIO', description: 'Cài toolchain, GPIO output, nhấp nháy LED.', lessons: [c1, c1q] },
    { title: 'Lab 2 — Nút & ngắt ngoài|||Lab 2 — Buttons & interrupts', description: 'Đọc nút, EXTI, chống dội, pull-up.', lessons: [c2, c2q] },
    { title: 'Lab 3 — UART|||Lab 3 — UART', description: 'Giao tiếp máy tính, printf, nhận lệnh.', lessons: [c3, c3q] },
    { title: 'Lab 4 — Timer & PWM|||Lab 4 — Timer & PWM', description: 'Định thời, PWM, chỉnh sáng LED / lái động cơ.', lessons: [c4, c4q] },
    { title: 'Lab 5 — ADC|||Lab 5 — ADC', description: 'Đọc cảm biến analog, quy đổi ra volt/đơn vị.', lessons: [c5, c5q] },
    { title: 'Lab 6 — I2C/SPI|||Lab 6 — I2C/SPI', description: 'Bus I2C/SPI, giao tiếp module, quét địa chỉ.', lessons: [c6, c6q] },
    { title: 'Lab 7 — FreeRTOS|||Lab 7 — FreeRTOS', description: 'Đa nhiệm, task, vTaskDelay, queue.', lessons: [c7, c7q] },
    { title: 'Lab 8 — Tổng hợp CAN|||Lab 8 — Capstone CAN', description: 'Hệ nhúng ô tô: cảm biến → xử lý → điều khiển + CAN.', lessons: [c8, c8q] },
  ],
};
