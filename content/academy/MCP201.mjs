/**
 * MCP201 — Microcontroller Programming (Lập trình vi điều khiển). Ngành Thiết kế
 * vi mạch bán dẫn FPTU, Kỳ 3. Lập trình MCU bằng C nhúng: MCU vs MPU, thanh ghi,
 * GPIO, ngắt/timer/PWM, ADC, UART/SPI/I2C, bộ nhớ & năng lượng, gỡ lỗi & dự án.
 * Nguồn: Elecia White "Making Embedded Systems", datasheet STM32/AVR, Arduino,
 * ARM Cortex-M reference. Song ngữ + khối code C minh hoạ + quiz mỗi chương.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ trong HTML;
 * "&"→&amp;, "<"→&lt;, ">"→&gt; trong content; tránh nháy đơn trong chuỗi ''.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('mcp201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (Elecia White), datasheet STM32/AVR, Arduino & ARM docs, YouTube, công cụ mô phỏng, lộ trình tự học.',
  [[
    `<span class="eyebrow">MCP201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Microcontroller Programming — the MCU itself, embedded C, GPIO, interrupts, ADC, serial buses, memory &amp; power — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for MCP201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.oreilly.com/library/view/making-embedded-systems/9781449308889/" target="_blank" rel="noopener"><em>Making Embedded Systems</em> — Elecia White</a> (the course backbone)</li>
<li><a href="https://embedded.fm/" target="_blank" rel="noopener">embedded.fm — Elecia White podcast &amp; notes</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://docs.arduino.cc/" target="_blank" rel="noopener">Arduino Documentation (docs.arduino.cc)</a></li>
<li><a href="https://www.st.com/en/microcontrollers-microprocessors.html" target="_blank" rel="noopener">STM32 microcontrollers (ST) — datasheets &amp; reference manuals</a></li>
<li><a href="https://developer.arm.com/documentation/" target="_blank" rel="noopener">ARM Cortex-M developer documentation</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@BenEater" target="_blank" rel="noopener">Ben Eater</a> — how computers &amp; buses really work, from the wires up</li>
<li><a href="https://www.youtube.com/@DigiKey" target="_blank" rel="noopener">DigiKey</a> — practical embedded &amp; microcontroller tutorials</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://wokwi.com/" target="_blank" rel="noopener">Wokwi</a> — online Arduino/ESP32/STM32 simulator (no hardware needed)</li>
<li><a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener">Tinkercad Circuits</a> — breadboard &amp; Arduino simulation</li>
<li><a href="https://platformio.org/" target="_blank" rel="noopener">PlatformIO</a> — a modern build/debug toolchain for embedded projects</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what an MCU is (vs MPU), embedded C, registers &amp; bit manipulation.</li>
<li><strong>I/O</strong> — GPIO (LEDs, buttons), interrupts &amp; timers, PWM.</li>
<li><strong>Go deeper</strong> — ADC &amp; analog sensors, UART/SPI/I2C serial communication.</li>
<li><strong>Job-ready</strong> — memory &amp; power management, debug with SWD/JTAG, ship a full embedded project.</li>
</ol></div>`,
    `<span class="eyebrow">MCP201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Lập trình vi điều khiển — bản thân MCU, C nhúng, GPIO, ngắt, ADC, các bus nối tiếp, bộ nhớ &amp; năng lượng — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của MCP201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.oreilly.com/library/view/making-embedded-systems/9781449308889/" target="_blank" rel="noopener"><em>Making Embedded Systems</em> — Elecia White</a> (xương sống của môn)</li>
<li><a href="https://embedded.fm/" target="_blank" rel="noopener">embedded.fm — podcast &amp; ghi chú của Elecia White</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://docs.arduino.cc/" target="_blank" rel="noopener">Arduino Documentation (docs.arduino.cc)</a></li>
<li><a href="https://www.st.com/en/microcontrollers-microprocessors.html" target="_blank" rel="noopener">Vi điều khiển STM32 (ST) — datasheet &amp; reference manual</a></li>
<li><a href="https://developer.arm.com/documentation/" target="_blank" rel="noopener">Tài liệu ARM Cortex-M cho nhà phát triển</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@BenEater" target="_blank" rel="noopener">Ben Eater</a> — máy tính &amp; bus hoạt động thế nào, từ sợi dây lên</li>
<li><a href="https://www.youtube.com/@DigiKey" target="_blank" rel="noopener">DigiKey</a> — hướng dẫn nhúng &amp; vi điều khiển thực tế</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://wokwi.com/" target="_blank" rel="noopener">Wokwi</a> — mô phỏng Arduino/ESP32/STM32 trực tuyến (không cần phần cứng)</li>
<li><a href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener">Tinkercad Circuits</a> — mô phỏng breadboard &amp; Arduino</li>
<li><a href="https://platformio.org/" target="_blank" rel="noopener">PlatformIO</a> — bộ công cụ build/debug hiện đại cho dự án nhúng</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền</strong> — MCU là gì (so với MPU), C nhúng, thanh ghi &amp; thao tác bit.</li>
<li><strong>Vào/ra</strong> — GPIO (LED, nút), ngắt &amp; timer, PWM.</li>
<li><strong>Đào sâu</strong> — ADC &amp; cảm biến analog, giao tiếp UART/SPI/I2C.</li>
<li><strong>Sẵn sàng đi làm</strong> — bộ nhớ &amp; quản lý năng lượng, gỡ lỗi bằng SWD/JTAG, hoàn thành một dự án nhúng.</li>
</ol></div>`,
  ]]);

const intro = doc('mcp201-0-1-overview', 'Course overview: Microcontroller Programming|||Tổng quan: Lập trình vi điều khiển',
  'Vi điều khiển làm gì; lập trình bằng C nhúng chạm trực tiếp thanh ghi; lộ trình 4 bước: nền → vào/ra → cảm biến & giao tiếp → hệ thống & dự án.',
  [[
    `<span class="eyebrow">MCP201 · Lesson 0.1 · Overview</span>
<h2>Microcontroller Programming</h2>
<p class="lead">This course teaches you to make a <strong>microcontroller (MCU)</strong> do useful work — read sensors, drive motors and LEDs, talk to other chips — by writing <strong>embedded C</strong> that pokes the chip registers directly.</p>
<h3>Why it matters</h3>
<p>Billions of MCUs ship every year inside cars, appliances, medical devices and IoT gadgets. For a <strong>semiconductor / chip-design</strong> engineer, understanding how firmware drives silicon is essential — the hardware is nothing without the code that controls it.</p>
<h3>How we work</h3>
<p>Each chapter pairs the <strong>concept</strong> with a short block of real <strong>embedded C</strong> (AVR/ATmega and ARM Cortex-M style) plus a plain-language explanation, then a quiz. Examples target Arduino-class hardware but the ideas carry to STM32 and PIC.</p>
<h3>Roadmap (4 steps)</h3>
<ol>
<li><strong>Foundations</strong> — what an MCU is, embedded C, registers &amp; bit manipulation.</li>
<li><strong>I/O</strong> — GPIO, interrupts &amp; timers, PWM.</li>
<li><strong>Sensing &amp; comms</strong> — ADC and analog signals, UART/SPI/I2C.</li>
<li><strong>System</strong> — memory, power management, debugging &amp; a complete project.</li>
</ol>`,
    `<span class="eyebrow">MCP201 · Bài 0.1 · Tổng quan</span>
<h2>Lập trình vi điều khiển</h2>
<p class="lead">Môn này dạy bạn khiến một <strong>vi điều khiển (MCU)</strong> làm việc có ích — đọc cảm biến, điều khiển động cơ và LED, nói chuyện với chip khác — bằng cách viết <strong>C nhúng</strong> chạm trực tiếp vào thanh ghi của chip.</p>
<h3>Vì sao quan trọng</h3>
<p>Mỗi năm hàng tỉ MCU xuất xưởng trong ô tô, thiết bị gia dụng, thiết bị y tế và đồ IoT. Với kỹ sư <strong>bán dẫn / thiết kế vi mạch</strong>, hiểu firmware điều khiển silicon thế nào là điều thiết yếu — phần cứng vô nghĩa nếu thiếu mã điều khiển nó.</p>
<h3>Cách học</h3>
<p>Mỗi chương ghép <strong>khái niệm</strong> với một khối <strong>C nhúng</strong> thật (kiểu AVR/ATmega và ARM Cortex-M) kèm giải thích dễ hiểu, rồi một quiz. Ví dụ nhắm phần cứng cỡ Arduino nhưng ý tưởng áp dụng được cho STM32 và PIC.</p>
<h3>Lộ trình (4 bước)</h3>
<ol>
<li><strong>Nền tảng</strong> — MCU là gì, C nhúng, thanh ghi &amp; thao tác bit.</li>
<li><strong>Vào/ra</strong> — GPIO, ngắt &amp; timer, PWM.</li>
<li><strong>Cảm biến &amp; giao tiếp</strong> — ADC và tín hiệu analog, UART/SPI/I2C.</li>
<li><strong>Hệ thống</strong> — bộ nhớ, quản lý năng lượng, gỡ lỗi &amp; một dự án hoàn chỉnh.</li>
</ol>`,
  ]]);

const c1 = doc('mcp201-1-1-what-is-mcu', '1.1 — What is a microcontroller?|||1.1 — Vi điều khiển là gì?',
  'MCU vs MPU; bên trong chip (CPU/bộ nhớ/ngoại vi); Flash/SRAM/EEPROM; các họ AVR (8-bit), ARM Cortex-M (32-bit), PIC.',
  [[
    `<span class="eyebrow">MCP201 · Chapter 1 · Lesson 1.1</span>
<h2>What is a microcontroller?</h2>
<p class="lead">A <strong>microcontroller (MCU)</strong> is a whole tiny computer on ONE chip — CPU, memory and peripherals together — built to control a single device: a washing machine, a drone, a smartwatch.</p>
<h3>MCU vs MPU</h3>
<ul>
<li><strong>MCU</strong> — CPU + Flash + RAM + peripherals on one chip. Cheap, low-power, boots instantly, runs one fixed program. Example: ATmega328P (Arduino Uno), STM32.</li>
<li><strong>MPU (microprocessor)</strong> — just the CPU; RAM, storage and peripherals are external chips. Powerful, runs an OS like Linux. Example: the chip in a Raspberry Pi or a phone.</li>
</ul>
<h3>Inside the chip</h3>
<ul>
<li><strong>CPU</strong> — executes instructions (8/16/32-bit cores).</li>
<li><strong>Memory</strong> — Flash (program), SRAM (variables), EEPROM (settings that survive power-off).</li>
<li><strong>Peripherals</strong> — GPIO, timers, ADC, UART/SPI/I2C, PWM.</li>
</ul>
<h3>The big families</h3>
<pre><code>AVR  (8-bit)   -> ATmega328P, used in the Arduino Uno
ARM  Cortex-M  -> STM32, nRF, RP2040 (32-bit, dominant today)
PIC  (8/16/32) -> Microchip, huge across industry
</code></pre>
<div class="callout"><span class="badge">One chip, one job</span> An MCU trades raw power for integration, low cost and low power — perfect for embedded control where the program rarely changes.</div>`,
    `<span class="eyebrow">MCP201 · Chương 1 · Bài 1.1</span>
<h2>Vi điều khiển là gì?</h2>
<p class="lead">Một <strong>vi điều khiển (MCU)</strong> là cả một chiếc máy tính tí hon trên MỘT con chip — CPU, bộ nhớ và ngoại vi gộp chung — dựng ra để điều khiển một thiết bị: máy giặt, drone, đồng hồ thông minh.</p>
<h3>MCU vs MPU</h3>
<ul>
<li><strong>MCU</strong> — CPU + Flash + RAM + ngoại vi trên một chip. Rẻ, ít điện, khởi động tức thì, chạy một chương trình cố định. Ví dụ: ATmega328P (Arduino Uno), STM32.</li>
<li><strong>MPU (vi xử lý)</strong> — chỉ có CPU; RAM, lưu trữ và ngoại vi là chip rời. Mạnh, chạy hệ điều hành như Linux. Ví dụ: chip trong Raspberry Pi hay điện thoại.</li>
</ul>
<h3>Bên trong chip</h3>
<ul>
<li><strong>CPU</strong> — thực thi lệnh (lõi 8/16/32-bit).</li>
<li><strong>Bộ nhớ</strong> — Flash (chương trình), SRAM (biến), EEPROM (cấu hình còn giữ khi mất điện).</li>
<li><strong>Ngoại vi</strong> — GPIO, timer, ADC, UART/SPI/I2C, PWM.</li>
</ul>
<h3>Các họ lớn</h3>
<pre><code>AVR  (8-bit)   -> ATmega328P, dùng trong Arduino Uno
ARM  Cortex-M  -> STM32, nRF, RP2040 (32-bit, thống trị hiện nay)
PIC  (8/16/32) -> Microchip, phổ biến trong công nghiệp
</code></pre>
<div class="callout"><span class="badge">Một chip, một việc</span> MCU đánh đổi sức mạnh thô lấy tích hợp cao, giá rẻ và ít điện — hợp với điều khiển nhúng nơi chương trình hầu như không đổi.</div>`,
  ]]);

const c1q = quiz('mcp201-quiz-1', 'Quiz 1 — What is an MCU|||Quiz 1 — Vi điều khiển là gì', [
  { id: 'q1', question: 'Điểm khác biệt chính giữa MCU và MPU là?', options: ['MCU luôn chạy nhanh hơn MPU', 'MCU tích hợp CPU + bộ nhớ + ngoại vi trên một chip', 'MPU rẻ và tiết kiệm điện hơn', 'MCU luôn là lõi 64-bit'], correctIndex: 1, explanation: 'MCU gộp CPU, Flash/RAM và ngoại vi trên một chip; MPU chỉ có CPU, còn bộ nhớ và ngoại vi là chip rời.' },
  { id: 'q2', question: 'Loại bộ nhớ nào giữ dữ liệu khi mất điện, dùng lưu cấu hình?', options: ['SRAM', 'Thanh ghi CPU', 'EEPROM/Flash', 'Cache'], correctIndex: 2, explanation: 'EEPROM/Flash là bộ nhớ không bay hơi; SRAM mất dữ liệu khi tắt nguồn.' },
  { id: 'q3', question: 'Họ vi điều khiển 32-bit phổ biến nhất hiện nay?', options: ['AVR 8-bit', 'ARM Cortex-M', '8051', 'Z80'], correctIndex: 1, explanation: 'Lõi ARM Cortex-M (STM32, RP2040, nRF) thống trị MCU 32-bit hiện đại.' },
]);

const c2 = doc('mcp201-2-1-embedded-c', '2.1 — Embedded C &amp; registers|||2.1 — Lập trình C nhúng &amp; thanh ghi',
  'Đặc trưng C nhúng (không heap, gần phần cứng); thanh ghi (register) là cổng điều khiển; thao tác bit (set/clear/toggle/read); từ khoá volatile.',
  [[
    `<span class="eyebrow">MCP201 · Chapter 2 · Lesson 2.1</span>
<h2>Embedded C &amp; registers</h2>
<p class="lead">Embedded C is standard C used <em>close to the hardware</em>: no operating system, tiny RAM, and you control the chip by reading and writing special memory addresses called <strong>registers</strong>.</p>
<h3>Registers = the control panel</h3>
<p>Each peripheral (a GPIO port, a timer, the ADC) exposes registers. Writing a bit flips a real switch inside the silicon. So most embedded code is <strong>bit manipulation</strong>.</p>
<pre><code>// Set bit 5 high, leave the other bits alone
PORTB |= (1 &lt;&lt; 5);

// Clear bit 5 (turn it off)
PORTB &amp;= ~(1 &lt;&lt; 5);

// Toggle bit 5
PORTB ^= (1 &lt;&lt; 5);

// Read bit 2 of the input register
if (PINB &amp; (1 &lt;&lt; 2)) { /* bit 2 is high */ }
</code></pre>
<h3>The volatile keyword</h3>
<p>Mark a variable <code>volatile</code> when hardware or an interrupt can change it behind the compiler back. Without it the optimiser may cache a stale value and your loop never sees the update.</p>
<div class="callout"><span class="badge">Think in bits</span> OR to set, AND with an inverted mask to clear, XOR to toggle, AND to test. These four moves cover almost all register work.</div>`,
    `<span class="eyebrow">MCP201 · Chương 2 · Bài 2.1</span>
<h2>C nhúng &amp; thanh ghi</h2>
<p class="lead">C nhúng là C tiêu chuẩn dùng <em>sát phần cứng</em>: không hệ điều hành, RAM tí hon, và bạn điều khiển chip bằng cách đọc/ghi những địa chỉ bộ nhớ đặc biệt gọi là <strong>thanh ghi (register)</strong>.</p>
<h3>Thanh ghi = bảng điều khiển</h3>
<p>Mỗi ngoại vi (một cổng GPIO, một timer, bộ ADC) phơi ra các thanh ghi. Ghi một bit là gạt một công tắc thật trong silicon. Nên phần lớn code nhúng là <strong>thao tác bit</strong>.</p>
<pre><code>// Đặt bit 5 lên 1, giữ nguyên các bit khác
PORTB |= (1 &lt;&lt; 5);

// Xoá bit 5 (tắt đi)
PORTB &amp;= ~(1 &lt;&lt; 5);

// Đảo bit 5
PORTB ^= (1 &lt;&lt; 5);

// Đọc bit 2 của thanh ghi đầu vào
if (PINB &amp; (1 &lt;&lt; 2)) { /* bit 2 đang ở mức cao */ }
</code></pre>
<h3>Từ khoá volatile</h3>
<p>Đánh dấu biến là <code>volatile</code> khi phần cứng hoặc một ngắt có thể đổi nó sau lưng trình biên dịch. Thiếu nó, bộ tối ưu có thể giữ giá trị cũ và vòng lặp không bao giờ thấy thay đổi.</p>
<div class="callout"><span class="badge">Tư duy theo bit</span> OR để set, AND với mặt nạ đảo để clear, XOR để toggle, AND để kiểm tra. Bốn thao tác này bao gần hết việc với thanh ghi.</div>`,
  ]]);

const c2q = quiz('mcp201-quiz-2', 'Quiz 2 — Embedded C &amp; registers|||Quiz 2 — C nhúng &amp; thanh ghi', [
  { id: 'q1', question: 'Từ khoá volatile trong C nhúng báo cho trình biên dịch điều gì?', options: ['Biến là hằng số', 'Biến có thể đổi ngoài luồng chương trình (ngắt/phần cứng), đừng tối ưu bỏ đi', 'Biến chỉ được đọc một lần', 'Biến phải là toàn cục'], correctIndex: 1, explanation: 'volatile cấm compiler cache/loại bỏ việc đọc biến, vì phần cứng hoặc ISR có thể thay đổi nó bất cứ lúc nào.' },
  { id: 'q2', question: 'Cách đặt (set) một bit lên 1 mà KHÔNG đụng các bit khác của thanh ghi?', options: ['Gán trực tiếp REG bằng mặt nạ', 'OR thanh ghi với mặt nạ bit (REG |= mask)', 'AND thanh ghi với mặt nạ', 'XOR toàn bộ với 0xFF'], correctIndex: 1, explanation: 'Phép OR với mặt nạ chỉ đặt đúng bit lên 1 và giữ nguyên phần còn lại; AND với đảo mặt nạ mới dùng để xoá bit.' },
  { id: 'q3', question: 'Thao tác bit nào dùng để XOÁ (clear) một bit về 0?', options: ['OR với mặt nạ', 'AND với đảo của mặt nạ (~mask)', 'XOR với mặt nạ', 'Dịch trái thanh ghi'], correctIndex: 1, explanation: 'AND với ~mask xoá đúng bit trong mặt nạ; XOR dùng để đảo (toggle) bit.' },
]);

const c3 = doc('mcp201-3-1-gpio', '3.1 — GPIO: digital input &amp; output|||3.1 — GPIO: vào/ra số',
  'Chân số vào/ra; đặt hướng chân; điều khiển LED; đọc nút nhấn; điện trở pull-up/pull-down chống trôi nổi (floating).',
  [[
    `<span class="eyebrow">MCP201 · Chapter 3 · Lesson 3.1</span>
<h2>GPIO — digital input &amp; output</h2>
<p class="lead"><strong>GPIO</strong> (General-Purpose Input/Output) pins are the MCU hands: as <em>outputs</em> they drive LEDs and relays; as <em>inputs</em> they read buttons and switches.</p>
<h3>Direction, then value</h3>
<p>On AVR each port has three registers: <code>DDRx</code> sets direction (1 = output, 0 = input), <code>PORTx</code> writes the output level (or enables a pull-up), and <code>PINx</code> reads the actual pin level.</p>
<pre><code>// Make PB0 an output and light an LED
DDRB  |= (1 &lt;&lt; PB0);   // 1 = output
PORTB |= (1 &lt;&lt; PB0);   // drive HIGH -> LED on

// Read a button on PD2 using the internal pull-up
DDRD  &amp;= ~(1 &lt;&lt; PD2);  // input
PORTD |= (1 &lt;&lt; PD2);   // enable pull-up (idle = HIGH)
if (!(PIND &amp; (1 &lt;&lt; PD2))) { /* pressed = reads LOW */ }
</code></pre>
<h3>Pull-up / pull-down</h3>
<p>A floating input picks up noise and reads random 0/1. A <strong>pull-up</strong> resistor ties the pin to a defined HIGH when idle (a button then pulls it LOW); a <strong>pull-down</strong> does the opposite.</p>
<div class="callout"><span class="badge">Never float an input</span> Every input pin needs a defined idle level — internal pull-ups make this free. Add debounce for mechanical buttons.</div>`,
    `<span class="eyebrow">MCP201 · Chương 3 · Bài 3.1</span>
<h2>GPIO — vào/ra số</h2>
<p class="lead">Chân <strong>GPIO</strong> (vào/ra đa dụng) là đôi tay của MCU: làm <em>ngõ ra</em> thì điều khiển LED, relay; làm <em>ngõ vào</em> thì đọc nút, công tắc.</p>
<h3>Đặt hướng, rồi đặt mức</h3>
<p>Trên AVR mỗi cổng có ba thanh ghi: <code>DDRx</code> đặt hướng (1 = output, 0 = input), <code>PORTx</code> ghi mức ra (hoặc bật pull-up), và <code>PINx</code> đọc mức thực trên chân.</p>
<pre><code>// Đặt PB0 làm ngõ ra và bật một LED
DDRB  |= (1 &lt;&lt; PB0);   // 1 = output
PORTB |= (1 &lt;&lt; PB0);   // đưa lên HIGH -> LED sáng

// Đọc nút trên PD2 dùng pull-up nội
DDRD  &amp;= ~(1 &lt;&lt; PD2);  // input
PORTD |= (1 &lt;&lt; PD2);   // bật pull-up (nghỉ = HIGH)
if (!(PIND &amp; (1 &lt;&lt; PD2))) { /* nhấn = đọc LOW */ }
</code></pre>
<h3>Pull-up / pull-down</h3>
<p>Ngõ vào thả nổi hút nhiễu và đọc 0/1 ngẫu nhiên. Điện trở <strong>pull-up</strong> giữ chân ở mức HIGH khi nghỉ (nhấn nút thì kéo xuống LOW); <strong>pull-down</strong> làm ngược lại.</p>
<div class="callout"><span class="badge">Đừng thả nổi ngõ vào</span> Mỗi chân input cần một mức nghỉ xác định — pull-up nội cho miễn phí điều đó. Nhớ chống dội (debounce) cho nút cơ.</div>`,
  ]]);

const c3q = quiz('mcp201-quiz-3', 'Quiz 3 — GPIO|||Quiz 3 — GPIO', [
  { id: 'q1', question: 'Điện trở pull-up nội dùng để làm gì cho chân input đọc nút?', options: ['Tăng dòng ra cho LED', 'Giữ chân ở mức cao ổn định khi nút chưa nhấn (tránh trôi nổi)', 'Đổi chân thành ngõ ra', 'Tăng điện áp nguồn của chip'], correctIndex: 1, explanation: 'Pull-up giữ input ở mức HIGH khi hở; nhấn nút kéo xuống GND (đọc LOW), tránh trạng thái floating hút nhiễu.' },
  { id: 'q2', question: 'Trên AVR, thanh ghi nào ĐẶT HƯỚNG (vào/ra) cho một chân?', options: ['PORTx', 'PINx', 'DDRx', 'ADCx'], correctIndex: 2, explanation: 'DDRx (Data Direction Register): bit 1 = output, 0 = input. PORTx ghi mức ra hoặc bật pull-up; PINx đọc mức vào.' },
  { id: 'q3', question: 'Muốn ĐỌC mức logic thực tế trên một chân input của AVR, đọc thanh ghi nào?', options: ['DDRx', 'PORTx', 'PINx', 'TCNTx'], correctIndex: 2, explanation: 'PINx phản ánh mức logic thật đang hiện diện trên chân.' },
]);

const c4 = doc('mcp201-4-1-interrupts-timers', '4.1 — Interrupts &amp; timers|||4.1 — Ngắt &amp; timer',
  'Ngắt (interrupt) vs hỏi vòng (polling); hàm phục vụ ngắt (ISR); timer/counter đếm thời gian; điều chế độ rộng xung (PWM).',
  [[
    `<span class="eyebrow">MCP201 · Chapter 4 · Lesson 4.1</span>
<h2>Interrupts &amp; timers</h2>
<h3>Interrupt vs polling</h3>
<p><strong>Polling</strong> keeps asking "is it ready yet?" and wastes CPU. An <strong>interrupt</strong> lets the CPU do other work (or sleep) and jump to a handler the instant an event happens — a pin change, a timer overflow, a byte arriving.</p>
<h3>The ISR</h3>
<p>The <strong>Interrupt Service Routine</strong> runs automatically on the event. Keep it <em>short</em>; share data with the main loop through <code>volatile</code> variables.</p>
<pre><code>volatile uint32_t ticks = 0;

// Runs automatically every timer overflow
ISR(TIMER0_OVF_vect) {
  ticks++;
}
</code></pre>
<h3>Timers &amp; PWM</h3>
<p>A <strong>timer/counter</strong> counts clock pulses to measure time, generate periodic interrupts, or produce <strong>PWM</strong>. PWM rapidly switches a pin on/off; the on-fraction (<em>duty cycle</em>) sets average power — LED brightness, motor speed, servo angle.</p>
<pre><code>// ~50% duty cycle on an 8-bit PWM channel
OCR0A = 128;   // 128/255 of full power
</code></pre>
<div class="callout"><span class="badge">Do less in the ISR</span> Set a flag in the ISR, handle the heavy work back in the main loop. Long ISRs block other interrupts.</div>`,
    `<span class="eyebrow">MCP201 · Chương 4 · Bài 4.1</span>
<h2>Ngắt &amp; timer</h2>
<h3>Ngắt vs hỏi vòng</h3>
<p><strong>Hỏi vòng (polling)</strong> cứ hỏi mãi "xong chưa?" và phí CPU. <strong>Ngắt (interrupt)</strong> để CPU làm việc khác (hoặc ngủ) rồi nhảy vào trình xử lý ngay khi sự kiện xảy ra — chân đổi mức, timer tràn, một byte tới.</p>
<h3>ISR</h3>
<p><strong>Hàm phục vụ ngắt (ISR)</strong> chạy tự động khi có sự kiện. Giữ nó <em>ngắn</em>; chia sẻ dữ liệu với vòng lặp chính qua biến <code>volatile</code>.</p>
<pre><code>volatile uint32_t ticks = 0;

// Chạy tự động mỗi lần timer tràn
ISR(TIMER0_OVF_vect) {
  ticks++;
}
</code></pre>
<h3>Timer &amp; PWM</h3>
<p>Một <strong>timer/counter</strong> đếm xung clock để đo thời gian, sinh ngắt định kỳ, hoặc tạo <strong>PWM</strong>. PWM bật/tắt chân rất nhanh; tỉ lệ bật (<em>duty cycle</em>) quyết định công suất trung bình — độ sáng LED, tốc độ động cơ, góc servo.</p>
<pre><code>// Duty cycle ~50% trên kênh PWM 8-bit
OCR0A = 128;   // 128/255 công suất tối đa
</code></pre>
<div class="callout"><span class="badge">Làm ít trong ISR</span> Đặt một cờ trong ISR, xử lý phần nặng lại ở vòng lặp chính. ISR dài sẽ chặn các ngắt khác.</div>`,
  ]]);

const c4q = quiz('mcp201-quiz-4', 'Quiz 4 — Interrupts &amp; timers|||Quiz 4 — Ngắt &amp; timer', [
  { id: 'q1', question: 'Ngắt (interrupt) hơn hỏi vòng (polling) ở điểm nào?', options: ['Luôn tốn điện hơn', 'CPU phản ứng ngay sự kiện mà không phải liên tục kiểm tra', 'Luôn chậm hơn polling', 'Không cần viết ISR'], correctIndex: 1, explanation: 'Ngắt cho CPU làm việc khác hoặc ngủ, chỉ chạy ISR khi sự kiện xảy ra, thay vì bận kiểm tra liên tục.' },
  { id: 'q2', question: 'Một ISR (hàm phục vụ ngắt) nên như thế nào?', options: ['Càng dài càng tốt', 'Ngắn gọn và nhanh, tránh tác vụ chậm', 'Chứa vòng delay dài', 'Không dùng biến volatile'], correctIndex: 1, explanation: 'ISR phải ngắn để không chặn ngắt khác; biến chia sẻ với main nên khai báo volatile.' },
  { id: 'q3', question: 'PWM (điều chế độ rộng xung) thường dùng để?', options: ['Đọc cảm biến analog', 'Điều chỉnh độ sáng LED hoặc tốc độ động cơ qua duty cycle', 'Giao tiếp bus I2C', 'Ghi dữ liệu vào EEPROM'], correctIndex: 1, explanation: 'PWM đổi tỉ lệ bật/tắt (duty cycle) để điều khiển công suất trung bình: độ sáng, tốc độ, góc servo.' },
]);

const c5 = doc('mcp201-5-1-adc', '5.1 — ADC &amp; analog signals|||5.1 — ADC &amp; tín hiệu analog',
  'Thế giới analog vs số; bộ chuyển đổi ADC; đọc cảm biến analog (nhiệt độ, ánh sáng); độ phân giải (8/10/12-bit) & điện áp tham chiếu Vref.',
  [[
    `<span class="eyebrow">MCP201 · Chapter 5 · Lesson 5.1</span>
<h2>ADC &amp; analog signals</h2>
<p class="lead">The real world is <strong>analog</strong> — temperature, light, sound vary continuously. An <strong>ADC</strong> (Analog-to-Digital Converter) samples a voltage and turns it into an integer the CPU can use.</p>
<h3>Resolution &amp; reference</h3>
<p>Resolution is the bit count: a <strong>10-bit</strong> ADC gives 2^10 = 1024 steps (0..1023). The <strong>reference voltage (Vref)</strong> is what the top step means. Volts per step = Vref / (2^N - 1).</p>
<pre><code>// Start a conversion and read the 10-bit result
ADCSRA |= (1 &lt;&lt; ADSC);            // start
while (ADCSRA &amp; (1 &lt;&lt; ADSC)) ;   // wait until done
uint16_t raw = ADC;                // 0..1023

// Convert to volts (Vref = 5.0V, 10-bit)
float volts = raw * 5.0f / 1023.0f;
</code></pre>
<h3>Reading a sensor</h3>
<p>A light sensor or thermistor forms a voltage divider whose voltage the ADC reads. Convert the raw number to a physical unit with the sensor curve from its datasheet.</p>
<div class="callout"><span class="badge">More bits = finer</span> A 12-bit ADC (0..4095) resolves smaller changes than 10-bit — but noise and a stable Vref matter just as much as bit count.</div>`,
    `<span class="eyebrow">MCP201 · Chương 5 · Bài 5.1</span>
<h2>ADC &amp; tín hiệu analog</h2>
<p class="lead">Thế giới thực là <strong>analog</strong> — nhiệt độ, ánh sáng, âm thanh biến thiên liên tục. Một <strong>ADC</strong> (bộ chuyển đổi tương tự - số) lấy mẫu điện áp và biến nó thành số nguyên để CPU dùng.</p>
<h3>Độ phân giải &amp; tham chiếu</h3>
<p>Độ phân giải là số bit: ADC <strong>10-bit</strong> cho 2^10 = 1024 mức (0..1023). <strong>Điện áp tham chiếu (Vref)</strong> quyết định mức cao nhất nghĩa là bao nhiêu volt. Volt mỗi mức = Vref / (2^N - 1).</p>
<pre><code>// Khởi động một lần chuyển đổi và đọc kết quả 10-bit
ADCSRA |= (1 &lt;&lt; ADSC);            // bắt đầu
while (ADCSRA &amp; (1 &lt;&lt; ADSC)) ;   // chờ đến khi xong
uint16_t raw = ADC;                // 0..1023

// Đổi sang volt (Vref = 5.0V, 10-bit)
float volts = raw * 5.0f / 1023.0f;
</code></pre>
<h3>Đọc một cảm biến</h3>
<p>Cảm biến ánh sáng hay nhiệt điện trở tạo một bộ chia áp mà ADC đọc điện áp của nó. Đổi số thô sang đơn vị vật lý bằng đường cong cảm biến trong datasheet.</p>
<div class="callout"><span class="badge">Nhiều bit = mịn hơn</span> ADC 12-bit (0..4095) phân biệt thay đổi nhỏ hơn 10-bit — nhưng nhiễu và một Vref ổn định cũng quan trọng ngang số bit.</div>`,
  ]]);

const c5q = quiz('mcp201-quiz-5', 'Quiz 5 — ADC|||Quiz 5 — ADC', [
  { id: 'q1', question: 'Bộ chuyển đổi ADC làm nhiệm vụ gì?', options: ['Biến tín hiệu số thành analog', 'Biến điện áp analog thành một số nguyên', 'Tạo xung PWM', 'Gửi dữ liệu qua UART'], correctIndex: 1, explanation: 'ADC lấy mẫu điện áp analog và cho ra một số nguyên tỉ lệ với điện áp đó.' },
  { id: 'q2', question: 'ADC 10-bit cho dải giá trị số là bao nhiêu?', options: ['0..255', '0..1023', '0..4095', '0..65535'], correctIndex: 1, explanation: '10-bit tức 2^10 = 1024 mức, đánh số từ 0 đến 1023.' },
  { id: 'q3', question: 'Với Vref = 5V và ADC 10-bit, giá trị thô 512 tương ứng khoảng?', options: ['~1.25V', '~2.5V', '~5V', '~0V'], correctIndex: 1, explanation: '512/1023 nhân 5V xấp xỉ 2.5V, tức khoảng nửa dải đo.' },
]);

const c6 = doc('mcp201-6-1-serial', '6.1 — Serial communication: UART, SPI, I2C|||6.1 — Giao tiếp nối tiếp: UART, SPI, I2C',
  'Vì sao nối tiếp; UART (bất đồng bộ, không clock); SPI (nhanh, chip-select); I2C (2 dây, địa chỉ, nhiều thiết bị); khi nào dùng cái nào.',
  [[
    `<span class="eyebrow">MCP201 · Chapter 6 · Lesson 6.1</span>
<h2>Serial communication: UART, SPI, I2C</h2>
<p class="lead">Chips talk to each other over a few wires by sending bits one after another — <strong>serial communication</strong>. Three buses dominate embedded systems.</p>
<h3>The three buses</h3>
<ul>
<li><strong>UART</strong> — asynchronous, no shared clock; both sides agree on a <em>baud rate</em>. Two wires (TX, RX). Great for a debug console or a GPS module.</li>
<li><strong>SPI</strong> — fast, synchronous, full-duplex; a clock line plus a <strong>chip-select (CS)</strong> per device. For displays, SD cards, fast sensors.</li>
<li><strong>I2C</strong> — only two wires (<strong>SDA</strong> data, <strong>SCL</strong> clock) shared by many devices, each with an address. For lots of slow sensors on one bus.</li>
</ul>
<pre><code>// UART: send one byte on AVR
void uart_send(uint8_t c) {
  while (!(UCSR0A &amp; (1 &lt;&lt; UDRE0))) ;  // wait for the buffer to empty
  UDR0 = c;                            // load the byte to transmit
}
</code></pre>
<div class="callout"><span class="badge">Pick by need</span> Debug/simple link -> UART. Many cheap sensors, few wires -> I2C. Raw speed, one device at a time -> SPI.</div>`,
    `<span class="eyebrow">MCP201 · Chương 6 · Bài 6.1</span>
<h2>Giao tiếp nối tiếp: UART, SPI, I2C</h2>
<p class="lead">Các chip nói chuyện qua vài sợi dây bằng cách gửi bit lần lượt — <strong>giao tiếp nối tiếp</strong>. Ba bus thống trị hệ thống nhúng.</p>
<h3>Ba bus</h3>
<ul>
<li><strong>UART</strong> — bất đồng bộ, không dây clock chung; hai bên thoả một <em>baud rate</em>. Hai dây (TX, RX). Hợp cho cổng debug hay module GPS.</li>
<li><strong>SPI</strong> — nhanh, đồng bộ, song công; có dây clock cộng một <strong>chip-select (CS)</strong> cho mỗi thiết bị. Dùng cho màn hình, thẻ SD, cảm biến tốc độ cao.</li>
<li><strong>I2C</strong> — chỉ hai dây (<strong>SDA</strong> dữ liệu, <strong>SCL</strong> clock) chung cho nhiều thiết bị, mỗi thiết bị một địa chỉ. Hợp khi có nhiều cảm biến chậm trên cùng một bus.</li>
</ul>
<pre><code>// UART: gửi một byte trên AVR
void uart_send(uint8_t c) {
  while (!(UCSR0A &amp; (1 &lt;&lt; UDRE0))) ;  // chờ bộ đệm trống
  UDR0 = c;                            // nạp byte cần truyền
}
</code></pre>
<div class="callout"><span class="badge">Chọn theo nhu cầu</span> Debug/kết nối đơn giản -> UART. Nhiều cảm biến rẻ, ít dây -> I2C. Cần tốc độ thô, mỗi lúc một thiết bị -> SPI.</div>`,
  ]]);

const c6q = quiz('mcp201-quiz-6', 'Quiz 6 — Serial buses|||Quiz 6 — Bus nối tiếp', [
  { id: 'q1', question: 'Giao tiếp nào KHÔNG cần dây clock chung (bất đồng bộ), hai bên chỉ thoả baud rate?', options: ['SPI', 'I2C', 'UART', 'JTAG'], correctIndex: 2, explanation: 'UART bất đồng bộ, không có dây clock; hai bên phải cùng baud rate để hiểu nhau.' },
  { id: 'q2', question: 'I2C dùng mấy dây tín hiệu chính?', options: ['1 dây', '2 dây (SDA và SCL)', '4 dây', '8 dây'], correctIndex: 1, explanation: 'I2C dùng hai dây: SDA (dữ liệu) và SCL (clock); nhiều thiết bị chung bus, phân biệt bằng địa chỉ.' },
  { id: 'q3', question: 'SPI chọn thiết bị đích để nói chuyện bằng cách nào?', options: ['Địa chỉ 7-bit trên bus', 'Một dây chip-select (CS/SS) riêng cho mỗi thiết bị', 'Đặt baud rate khác nhau', 'Gửi lệnh START'], correctIndex: 1, explanation: 'SPI dùng chân chip-select cho mỗi slave; địa chỉ trên bus là đặc trưng của I2C.' },
]);

const c7 = doc('mcp201-7-1-memory-power', '7.1 — Memory &amp; power management|||7.1 — Bộ nhớ &amp; quản lý năng lượng',
  'Flash vs SRAM vs EEPROM (dùng vào việc gì); lưu cấu hình bền qua EEPROM; chế độ ngủ (sleep) tiết kiệm điện; watchdog timer chống treo.',
  [[
    `<span class="eyebrow">MCP201 · Chapter 7 · Lesson 7.1</span>
<h2>Memory &amp; power management</h2>
<h3>Three kinds of memory</h3>
<ul>
<li><strong>Flash</strong> — holds your program; non-volatile, big, slow to write.</li>
<li><strong>SRAM</strong> — holds variables/stack while running; fast but <em>volatile</em> (lost at power-off) and small.</li>
<li><strong>EEPROM</strong> — small non-volatile store for settings that must survive a reboot (calibration, user prefs).</li>
</ul>
<pre><code>// Save a setting that survives power-off (AVR EEPROM)
eeprom_write_byte((uint8_t*)0, volume);
uint8_t v = eeprom_read_byte((uint8_t*)0);
</code></pre>
<h3>Power management</h3>
<p>Battery devices spend most time doing nothing, so put the CPU to <strong>sleep</strong> and let an interrupt wake it — cutting current from milliamps to microamps.</p>
<pre><code>set_sleep_mode(SLEEP_MODE_PWR_DOWN);
sleep_mode();   // CPU stops here until an interrupt wakes it
</code></pre>
<h3>Watchdog</h3>
<p>A <strong>watchdog timer</strong> resets the chip if the program hangs and stops "kicking" it in time — a safety net for unattended embedded systems.</p>
<div class="callout"><span class="badge">Sleep is free battery</span> The biggest power win is usually not a faster clock but staying asleep longer between events.</div>`,
    `<span class="eyebrow">MCP201 · Chương 7 · Bài 7.1</span>
<h2>Bộ nhớ &amp; quản lý năng lượng</h2>
<h3>Ba loại bộ nhớ</h3>
<ul>
<li><strong>Flash</strong> — chứa chương trình; không bay hơi, dung lượng lớn, ghi chậm.</li>
<li><strong>SRAM</strong> — chứa biến/ngăn xếp khi chạy; nhanh nhưng <em>bay hơi</em> (mất khi tắt nguồn) và nhỏ.</li>
<li><strong>EEPROM</strong> — kho nhỏ không bay hơi cho cấu hình phải sống qua khởi động lại (hiệu chỉnh, tuỳ chọn người dùng).</li>
</ul>
<pre><code>// Lưu một thiết lập còn giữ khi mất điện (EEPROM của AVR)
eeprom_write_byte((uint8_t*)0, volume);
uint8_t v = eeprom_read_byte((uint8_t*)0);
</code></pre>
<h3>Quản lý năng lượng</h3>
<p>Thiết bị chạy pin phần lớn thời gian không làm gì, nên hãy cho CPU <strong>ngủ (sleep)</strong> và để một ngắt đánh thức — hạ dòng từ miliampe xuống microampe.</p>
<pre><code>set_sleep_mode(SLEEP_MODE_PWR_DOWN);
sleep_mode();   // CPU dừng ở đây tới khi một ngắt đánh thức
</code></pre>
<h3>Watchdog</h3>
<p>Một <strong>watchdog timer</strong> reset chip nếu chương trình treo và không kịp "vỗ về" nó đúng hạn — lưới an toàn cho hệ thống nhúng chạy không người trông.</p>
<div class="callout"><span class="badge">Ngủ là pin miễn phí</span> Cú tiết kiệm điện lớn nhất thường không phải clock nhanh hơn mà là ngủ lâu hơn giữa các sự kiện.</div>`,
  ]]);

const c7q = quiz('mcp201-quiz-7', 'Quiz 7 — Memory &amp; power|||Quiz 7 — Bộ nhớ &amp; năng lượng', [
  { id: 'q1', question: 'Bộ nhớ nào lưu biến khi chạy chương trình nhưng MẤT khi tắt nguồn?', options: ['Flash', 'EEPROM', 'SRAM', 'ROM'], correctIndex: 2, explanation: 'SRAM bay hơi (mất khi mất điện); Flash chứa chương trình, EEPROM lưu cấu hình bền.' },
  { id: 'q2', question: 'Watchdog timer dùng để làm gì?', options: ['Đo nhiệt độ chip', 'Tự khởi động lại MCU nếu chương trình treo không kịp reset nó', 'Tạo tín hiệu PWM', 'Giao tiếp SPI'], correctIndex: 1, explanation: 'Watchdog reset chip nếu code không kick nó đúng hạn, giúp hệ thống tự phục hồi khỏi treo.' },
  { id: 'q3', question: 'Chế độ sleep (ngủ) của MCU giúp gì?', options: ['Tăng tốc độ CPU', 'Giảm tiêu thụ điện khi rảnh, một ngắt sẽ đánh thức lại', 'Xoá sạch EEPROM', 'Tăng độ phân giải ADC'], correctIndex: 1, explanation: 'Sleep mode tắt bớt các khối để tiết kiệm điện; một ngắt sẽ đánh thức CPU dậy làm việc.' },
]);

const c8 = doc('mcp201-8-1-project-debug', '8.1 — Project &amp; debugging|||8.1 — Dự án &amp; gỡ lỗi',
  'Nền real-time cơ bản (super-loop hợp tác, RTOS là gì); gỡ lỗi qua JTAG/SWD (breakpoint, xem biến); một dự án nhúng hoàn chỉnh (từ yêu cầu tới firmware).',
  [[
    `<span class="eyebrow">MCP201 · Chapter 8 · Lesson 8.1</span>
<h2>Project &amp; debugging</h2>
<h3>Basic real-time structure</h3>
<p>Most small firmware runs a <strong>cooperative super-loop</strong>: tasks take turns on a time base, no operating system. When timing gets strict or tasks many, an <strong>RTOS</strong> adds a scheduler and priorities.</p>
<pre><code>// A tiny cooperative real-time loop (no RTOS)
while (1) {
  if (tick_10ms)  { tick_10ms  = 0; read_sensors();  }
  if (tick_100ms) { tick_100ms = 0; update_display(); }
}
// Flags are set by a timer ISR; the loop just dispatches
</code></pre>
<h3>Debugging with SWD/JTAG</h3>
<p><strong>JTAG</strong> and <strong>SWD</strong> are hardware debug interfaces: flash the chip, set <em>breakpoints</em>, single-step, and watch variables live — far more powerful than sprinkling print statements.</p>
<h3>A complete project</h3>
<p>Tie it together: read a temperature sensor over I2C (Ch.6, Ch.5), drive a fan with PWM on a timer (Ch.4), show the value on GPIO/serial (Ch.3), save the set-point in EEPROM (Ch.7), and sleep between reads. That is a real embedded product.</p>
<div class="callout"><span class="badge">Debug the system, not the line</span> Reproduce, isolate with breakpoints and a logic analyser, form a hypothesis, then fix — guessing wastes hours on hardware.</div>`,
    `<span class="eyebrow">MCP201 · Chương 8 · Bài 8.1</span>
<h2>Dự án &amp; gỡ lỗi</h2>
<h3>Cấu trúc real-time cơ bản</h3>
<p>Phần lớn firmware nhỏ chạy một <strong>super-loop hợp tác</strong>: các tác vụ thay phiên theo nhịp thời gian, không hệ điều hành. Khi thời gian đòi hỏi ngặt hoặc tác vụ nhiều, một <strong>RTOS</strong> thêm bộ lập lịch và mức ưu tiên.</p>
<pre><code>// Vòng lặp real-time hợp tác tí hon (không RTOS)
while (1) {
  if (tick_10ms)  { tick_10ms  = 0; read_sensors();  }
  if (tick_100ms) { tick_100ms = 0; update_display(); }
}
// Cờ được đặt bởi ISR của timer; vòng lặp chỉ điều phối
</code></pre>
<h3>Gỡ lỗi với SWD/JTAG</h3>
<p><strong>JTAG</strong> và <strong>SWD</strong> là giao diện gỡ lỗi phần cứng: nạp chip, đặt <em>breakpoint</em>, chạy từng bước, và xem biến trực tiếp — mạnh hơn nhiều so với rải lệnh in.</p>
<h3>Một dự án hoàn chỉnh</h3>
<p>Ráp lại: đọc cảm biến nhiệt qua I2C (Ch.6, Ch.5), điều khiển quạt bằng PWM trên timer (Ch.4), hiển thị giá trị qua GPIO/serial (Ch.3), lưu ngưỡng đặt vào EEPROM (Ch.7), và ngủ giữa các lần đọc. Đó là một sản phẩm nhúng thật.</p>
<div class="callout"><span class="badge">Gỡ cả hệ thống, đừng gỡ từng dòng</span> Tái hiện lỗi, cô lập bằng breakpoint và máy phân tích logic, dựng giả thuyết rồi sửa — đoán mò tốn hàng giờ trên phần cứng.</div>`,
  ]]);

const c8q = quiz('mcp201-quiz-8', 'Quiz 8 — Project &amp; debug|||Quiz 8 — Dự án &amp; gỡ lỗi', [
  { id: 'q1', question: 'JTAG/SWD dùng để làm gì?', options: ['Cấp nguồn cho MCU', 'Nạp chương trình và gỡ lỗi (đặt breakpoint, xem biến trực tiếp)', 'Đọc cảm biến analog', 'Tạo âm thanh'], correctIndex: 1, explanation: 'JTAG/SWD là giao diện debug/nạp phần cứng: đặt breakpoint, chạy từng bước, xem biến trực tiếp.' },
  { id: 'q2', question: 'Vòng lặp super-loop hợp tác (không RTOS) hoạt động thế nào?', options: ['Chạy nhiều luồng ưu tiên song song', 'Lần lượt kiểm tra và chạy từng tác vụ theo nhịp thời gian trong while(1)', 'Chỉ dùng ngắt, không có hàm main', 'Bắt buộc cần hệ điều hành Linux'], correctIndex: 1, explanation: 'Super-loop chạy tuần tự các tác vụ theo cờ/nhịp thời gian; đơn giản, không cần bộ lập lịch RTOS.' },
  { id: 'q3', question: 'Khi gỡ lỗi nhúng, biến chia sẻ giữa ISR và vòng lặp chính nên khai báo là?', options: ['const', 'static cục bộ', 'volatile', 'register'], correctIndex: 2, explanation: 'volatile đảm bảo vòng lặp chính luôn đọc giá trị mới nhất mà ISR cập nhật.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'MCP201',
    slug: 'mcp201-microcontroller-programming',
    title: 'Microcontroller Programming',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MCP201.webp',
    shortDescription: 'How microcontrollers work & how to program them — MCU vs MPU, embedded C & registers, GPIO, interrupts & timers/PWM, ADC, serial (UART/SPI/I2C), memory & power, debugging (JTAG/SWD) & a full embedded project. Bilingual, with C code & quizzes.|||Vi điều khiển hoạt động & lập trình thế nào — MCU vs MPU, C nhúng & thanh ghi, GPIO, ngắt & timer/PWM, ADC, nối tiếp (UART/SPI/I2C), bộ nhớ & năng lượng, gỡ lỗi (JTAG/SWD) & dự án nhúng. Song ngữ, có code C & quiz.',
    description: 'Môn <strong>MCP201 — Microcontroller Programming</strong> (kỳ 3, ngành Thiết kế vi mạch bán dẫn) dạy <strong>lập trình vi điều khiển</strong> bằng C nhúng. Từ <strong>vi điều khiển là gì</strong> (MCU vs MPU, CPU/bộ nhớ/ngoại vi, họ AVR/ARM/PIC) → <strong>C nhúng &amp; thanh ghi</strong> → <strong>GPIO</strong> (LED, nút) → <strong>ngắt &amp; timer/PWM</strong> → <strong>ADC</strong> → <strong>giao tiếp nối tiếp</strong> (UART/SPI/I2C) → <strong>bộ nhớ &amp; quản lý năng lượng</strong> → <strong>gỡ lỗi &amp; dự án nhúng</strong>. Song ngữ, có code C minh hoạ và quiz mỗi chương. Nguồn: Elecia White, datasheet STM32/AVR, Arduino, ARM Cortex-M.',
    whatYouLearn: 'MCU vs MPU &amp; kiến trúc chip; C nhúng, thanh ghi, thao tác bit, volatile; GPIO (LED, nút, pull-up); ngắt &amp; ISR, timer/counter, PWM; ADC &amp; đọc cảm biến analog, độ phân giải; giao tiếp UART/SPI/I2C; Flash/SRAM/EEPROM, sleep mode, watchdog; gỡ lỗi JTAG/SWD và một dự án nhúng hoàn chỉnh.',
    requirements: 'Biết lập trình C cơ bản (biến, hàm, con trỏ). Nên có bo mạch Arduino/STM32 hoặc dùng mô phỏng trực tuyến (Wokwi, Tinkercad).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách Elecia White, datasheet STM32/AVR, Arduino & ARM docs, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vi điều khiển làm gì, C nhúng, lộ trình 4 bước.', lessons: [intro] },
    { title: 'Chương 1 — Vi điều khiển là gì|||Chapter 1 — What is an MCU', description: 'MCU vs MPU, CPU/bộ nhớ/ngoại vi, họ AVR/ARM/PIC.', lessons: [c1, c1q] },
    { title: 'Chương 2 — C nhúng & thanh ghi|||Chapter 2 — Embedded C & registers', description: 'Register, thao tác bit, volatile.', lessons: [c2, c2q] },
    { title: 'Chương 3 — GPIO|||Chapter 3 — GPIO', description: 'Vào/ra số, LED, nút, pull-up/down.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Ngắt & timer|||Chapter 4 — Interrupts & timers', description: 'Interrupt, ISR, timer/counter, PWM.', lessons: [c4, c4q] },
    { title: 'Chương 5 — ADC & analog|||Chapter 5 — ADC & analog', description: 'ADC, cảm biến analog, độ phân giải.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Giao tiếp nối tiếp|||Chapter 6 — Serial communication', description: 'UART, SPI, I2C — nguyên lý & code.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Bộ nhớ & năng lượng|||Chapter 7 — Memory & power', description: 'Flash/RAM/EEPROM, sleep, watchdog.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Dự án & gỡ lỗi|||Chapter 8 — Project & debugging', description: 'Real-time, JTAG/SWD, dự án nhúng hoàn chỉnh.', lessons: [c8, c8q] },
  ],
};
