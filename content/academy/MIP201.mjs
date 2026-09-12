/**
 * MIP201 — Microcontroller Programming. Giáo trình FLM (syl): ARM Cortex-M,
 * STM32 HAL/CubeIDE, GPIO/interrupt/timer/PWM, SPI/UART/I2C, RTOS (thread/mutex/
 * semaphore). Song ngữ, code C embedded thật + bài tập. Giữ NGUYÊN slug/semester/
 * thumb(v3). ⚠️ code: KHÔNG backtick, KHÔNG ${ }; "\n" literal viết \\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('mip201-0-1-overview', 'Course overview: Microcontroller programming|||Tổng quan: Lập trình vi điều khiển',
  'Vi điều khiển là gì, ARM Cortex-M & board Nucleo, chuỗi công cụ STM32CubeIDE + HAL; lộ trình: GPIO → ngắt/timer/PWM → giao tiếp SPI/UART/I2C → RTOS.',
  [[
    `<span class="eyebrow">MIP201 · Lesson 0.1 · Overview</span>
<h2>Microcontroller Programming (STM32 / ARM Cortex-M)</h2>
<p class="lead">A <strong>microcontroller (MCU)</strong> is a whole tiny computer on one chip — CPU, memory, and <strong>peripherals</strong> (pins, timers, communication) — that runs a single program directly on the hardware, with no operating system. This course teaches embedded C on the <strong>ARM Cortex-M</strong> using the <strong>STM32 HAL</strong> library and <strong>STM32CubeIDE</strong>, on a <strong>Nucleo</strong> board.</p>
<h3>Embedded ≠ desktop programming</h3>
<ul>
<li>You talk directly to hardware through <strong>registers/peripherals</strong> — turn a pin on, start a timer.</li>
<li>Resources are tiny (KB of RAM); every byte and cycle matters.</li>
<li>The program runs <strong>forever</strong> in a loop; there's no "exit."</li>
<li>Timing is real — an <strong>interrupt</strong> reacts to events instantly.</li>
</ul>
<h3>Roadmap</h3>
<p>Digital/analog I/O (GPIO) → interrupts, timers &amp; PWM → serial communication (UART, SPI, I2C) → a real-time operating system (threads, mutexes, semaphores). Hands-on with the HAL library and a Nucleo-F401RE/F411RE board (or simulation).</p>`,
    `<span class="eyebrow">MIP201 · Bài 0.1 · Tổng quan</span>
<h2>Lập trình vi điều khiển (STM32 / ARM Cortex-M)</h2>
<p class="lead">Một <strong>vi điều khiển (MCU)</strong> là cả một máy tính tí hon trên một con chip — CPU, bộ nhớ, và <strong>ngoại vi</strong> (chân, timer, giao tiếp) — chạy một chương trình duy nhất thẳng trên phần cứng, không hệ điều hành. Môn này dạy C nhúng trên <strong>ARM Cortex-M</strong> dùng thư viện <strong>STM32 HAL</strong> và <strong>STM32CubeIDE</strong>, trên board <strong>Nucleo</strong>.</p>
<h3>Nhúng ≠ lập trình máy để bàn</h3>
<ul>
<li>Bạn nói chuyện trực tiếp với phần cứng qua <strong>thanh ghi/ngoại vi</strong> — bật một chân, khởi động một timer.</li>
<li>Tài nguyên tí hon (KB RAM); từng byte và chu kỳ đều quý.</li>
<li>Chương trình chạy <strong>mãi mãi</strong> trong một vòng lặp; không có "thoát".</li>
<li>Thời gian là thật — một <strong>ngắt (interrupt)</strong> phản ứng tức thì với sự kiện.</li>
</ul>
<h3>Lộ trình</h3>
<p>Vào/ra số & tương tự (GPIO) → ngắt, timer & PWM → giao tiếp nối tiếp (UART, SPI, I2C) → hệ điều hành thời gian thực (thread, mutex, semaphore). Thực hành với HAL và board Nucleo-F401RE/F411RE (hoặc mô phỏng).</p>`,
  ]]);

const c1 = doc('mip201-1-1-gpio', '1.1 — GPIO: digital & analog I/O|||1.1 — GPIO: vào/ra số & tương tự',
  'Đọc/ghi chân số (LED, nút), chống dội nút, đọc analog qua ADC; vòng lặp super-loop.',
  [[
    `<span class="eyebrow">MIP201 · Chapter 1 · Lesson 1.1</span>
<h2>GPIO — talking to pins</h2>
<h3>The super-loop &amp; digital output</h3>
<pre><code class="language-c">int main(void) {
    HAL_Init();
    SystemClock_Config();
    MX_GPIO_Init();               // CubeMX-generated pin setup
    while (1) {                   // runs forever
        HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);  // blink the on-board LED
        HAL_Delay(500);           // 500 ms
    }
}
</code></pre>
<p>An MCU program is a <strong>super-loop</strong>: setup once, then loop forever. <code>HAL_GPIO_WritePin</code> sets a pin HIGH/LOW; <code>HAL_GPIO_TogglePin</code> flips it. That is literally how you turn an LED on.</p>
<h3>Digital input &amp; analog (ADC)</h3>
<pre><code class="language-c">// read a button (digital input)
if (HAL_GPIO_ReadPin(GPIOC, GPIO_PIN_13) == GPIO_PIN_RESET) { /* pressed */ }

// read a sensor voltage (analog -> number)
HAL_ADC_Start(&amp;hadc1);
HAL_ADC_PollForConversion(&amp;hadc1, 100);
uint32_t value = HAL_ADC_GetValue(&amp;hadc1);   // 0..4095 (12-bit)
</code></pre>
<p>A digital pin is just 0 or 1. To read a continuous signal (temperature, a knob), the <strong>ADC</strong> (Analog-to-Digital Converter) turns a voltage into a number (0-4095 on a 12-bit ADC). Real buttons also need <strong>debouncing</strong> — a mechanical press bounces, so you filter it (short delay or check twice).</p>`,
    `<span class="eyebrow">MIP201 · Chương 1 · Bài 1.1</span>
<h2>GPIO — nói chuyện với các chân</h2>
<h3>Super-loop &amp; xuất số</h3>
<pre><code class="language-c">int main(void) {
    HAL_Init();
    SystemClock_Config();
    MX_GPIO_Init();               // cấu hình chân do CubeMX sinh
    while (1) {                   // chạy mãi
        HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);  // nháy LED trên board
        HAL_Delay(500);           // 500 ms
    }
}
</code></pre>
<p>Chương trình MCU là một <strong>super-loop</strong>: cấu hình một lần, rồi lặp mãi. <code>HAL_GPIO_WritePin</code> đặt chân HIGH/LOW; <code>HAL_GPIO_TogglePin</code> lật nó. Đó đúng là cách bạn bật một LED.</p>
<h3>Nhập số &amp; tương tự (ADC)</h3>
<pre><code class="language-c">// đọc nút (nhập số)
if (HAL_GPIO_ReadPin(GPIOC, GPIO_PIN_13) == GPIO_PIN_RESET) { /* đang nhấn */ }

// đọc điện áp cảm biến (tương tự -> số)
HAL_ADC_Start(&amp;hadc1);
HAL_ADC_PollForConversion(&amp;hadc1, 100);
uint32_t value = HAL_ADC_GetValue(&amp;hadc1);   // 0..4095 (12-bit)
</code></pre>
<p>Chân số chỉ là 0 hoặc 1. Để đọc tín hiệu liên tục (nhiệt độ, núm vặn), <strong>ADC</strong> (bộ chuyển tương tự-số) biến điện áp thành số (0-4095 với ADC 12-bit). Nút thật cũng cần <strong>chống dội (debounce)</strong> — nhấn cơ học bị dội, nên phải lọc (trễ ngắn hoặc kiểm hai lần).</p>`,
  ]]);

const c1q = quiz('mip201-quiz-1', 'Quiz 1 — GPIO|||Quiz 1 — GPIO', [
  { id: 'q1', question: 'Chương trình vi điều khiển điển hình có cấu trúc?', options: ['Chạy một lần rồi thoát', 'Cấu hình một lần rồi vòng lặp vô tận (super-loop)', 'Đa tiến trình như Linux', 'Không có main'], correctIndex: 1, explanation: 'MCU: setup rồi while(1) chạy mãi.' },
  { id: 'q2', question: 'Đọc một tín hiệu LIÊN TỤC (nhiệt độ, núm vặn) cần?', options: ['GPIO số', 'ADC (chuyển tương tự → số)', 'UART', 'PWM'], correctIndex: 1, explanation: 'ADC biến điện áp analog thành số (vd 0-4095).' },
  { id: 'q3', question: 'Nút nhấn cơ học cần "debounce" vì?', options: ['Tiết kiệm điện', 'Tiếp điểm dội gây nhiều xung → đọc nhầm nhiều lần', 'Chạy nhanh hơn', 'Bắt buộc của C'], correctIndex: 1, explanation: 'Chống dội lọc nhiễu tiếp điểm để mỗi lần nhấn đếm một lần.' },
]);

const c2 = doc('mip201-2-1-interrupt-timer-pwm', '2.1 — Interrupts, timers & PWM|||2.1 — Ngắt, timer & PWM',
  'Ngắt (phản ứng tức thì thay vì polling), timer (đo/định thời), PWM (điều chế độ rộng xung: chỉnh độ sáng LED/tốc độ động cơ).',
  [[
    `<span class="eyebrow">MIP201 · Chapter 2 · Lesson 2.1</span>
<h2>Interrupts, timers &amp; PWM</h2>
<h3>Interrupts — react instantly</h3>
<p>Instead of constantly <em>polling</em> ("is the button pressed yet?"), an <strong>interrupt</strong> lets the hardware call your function the instant an event happens, then return to what it was doing. It's efficient and fast.</p>
<pre><code class="language-c">// HAL calls this automatically when the button pin changes
void HAL_GPIO_EXTI_Callback(uint16_t pin) {
    if (pin == GPIO_PIN_13) {
        HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);   // toggle LED on press
    }
}
</code></pre>
<p><strong>Rule:</strong> keep an interrupt handler (ISR) <em>short</em> — set a flag, don't do slow work (no long delays, no printf) inside it.</p>
<h3>Timers &amp; PWM</h3>
<p>A <strong>timer</strong> counts clock ticks — use it for precise delays, periodic events, or measuring time. <strong>PWM</strong> (Pulse-Width Modulation) rapidly switches a pin on/off; the <strong>duty cycle</strong> (on-time %) sets the average power — so you can dim an LED or set a motor's speed with a digital pin.</p>
<pre><code class="language-c">// 0 = off, up to ARR = full brightness
HAL_TIM_PWM_Start(&amp;htim3, TIM_CHANNEL_1);
__HAL_TIM_SET_COMPARE(&amp;htim3, TIM_CHANNEL_1, 300);  // duty cycle
</code></pre>
<div class="callout"><span class="badge">Key idea</span> A digital pin is only 0/1, but PWM's duty cycle FAKES an analog level by switching fast — 25% duty ≈ 25% brightness. This is how MCUs drive LEDs, motors and servos.</div>`,
    `<span class="eyebrow">MIP201 · Chương 2 · Bài 2.1</span>
<h2>Ngắt, timer &amp; PWM</h2>
<h3>Ngắt — phản ứng tức thì</h3>
<p>Thay vì liên tục <em>polling</em> ("nút nhấn chưa?"), một <strong>ngắt</strong> cho phần cứng gọi hàm của bạn ngay khoảnh khắc sự kiện xảy ra, rồi quay lại việc đang làm. Hiệu quả và nhanh.</p>
<pre><code class="language-c">// HAL tự gọi hàm này khi chân nút đổi trạng thái
void HAL_GPIO_EXTI_Callback(uint16_t pin) {
    if (pin == GPIO_PIN_13) {
        HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);   // lật LED khi nhấn
    }
}
</code></pre>
<p><strong>Quy tắc:</strong> giữ trình xử lý ngắt (ISR) <em>ngắn</em> — đặt một cờ, đừng làm việc chậm (không delay dài, không printf) bên trong nó.</p>
<h3>Timer &amp; PWM</h3>
<p>Một <strong>timer</strong> đếm nhịp đồng hồ — dùng cho trễ chính xác, sự kiện định kỳ, hoặc đo thời gian. <strong>PWM</strong> (điều chế độ rộng xung) bật/tắt một chân rất nhanh; <strong>duty cycle</strong> (% thời gian bật) đặt công suất trung bình — nên bạn có thể chỉnh độ sáng LED hoặc tốc độ động cơ bằng một chân số.</p>
<pre><code class="language-c">// 0 = tắt, tới ARR = sáng tối đa
HAL_TIM_PWM_Start(&amp;htim3, TIM_CHANNEL_1);
__HAL_TIM_SET_COMPARE(&amp;htim3, TIM_CHANNEL_1, 300);  // duty cycle
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Chân số chỉ 0/1, nhưng duty cycle của PWM GIẢ ra mức tương tự bằng cách chuyển thật nhanh — duty 25% ≈ độ sáng 25%. Đây là cách MCU điều khiển LED, động cơ, servo.</div>`,
  ]]);

const c2q = quiz('mip201-quiz-2', 'Quiz 2 — Interrupt/timer/PWM|||Quiz 2 — Ngắt/timer/PWM', [
  { id: 'q1', question: 'Ưu điểm của ngắt so với polling?', options: ['Tốn CPU hơn', 'Phản ứng tức thì với sự kiện, không phải hỏi vòng liên tục', 'Đơn giản hơn luôn', 'Không cần phần cứng'], correctIndex: 1, explanation: 'Ngắt để phần cứng gọi khi có sự kiện → hiệu quả, kịp thời.' },
  { id: 'q2', question: 'Trong trình xử lý ngắt (ISR) nên?', options: ['Làm mọi việc nặng ở đó', 'Giữ NGẮN — đặt cờ, tránh delay/printf', 'Gọi HAL_Delay dài', 'Vẽ giao diện'], correctIndex: 1, explanation: 'ISR phải ngắn để không chặn hệ thống.' },
  { id: 'q3', question: 'Chỉnh độ sáng LED / tốc độ động cơ bằng một chân số dùng?', options: ['ADC', 'PWM (duty cycle)', 'UART', 'GPIO đọc'], correctIndex: 1, explanation: 'PWM đổi duty cycle để giả mức analog.' },
]);

const c3 = doc('mip201-3-1-uart-spi-i2c', '3.1 — Serial: UART, SPI & I2C|||3.1 — Nối tiếp: UART, SPI & I2C',
  'Ba giao thức giao tiếp: UART (2 dây, không đồng hồ), SPI (nhanh, đồng hồ chung, nhiều dây), I2C (2 dây, địa chỉ, nhiều thiết bị); khi nào dùng cái nào.',
  [[
    `<span class="eyebrow">MIP201 · Chapter 3 · Lesson 3.1</span>
<h2>Serial communication — UART, SPI, I2C</h2>
<p>MCUs talk to sensors, displays and PCs over <strong>serial protocols</strong>. The three you must know:</p>
<table><thead><tr><th></th><th>UART</th><th>SPI</th><th>I2C</th></tr></thead><tbody>
<tr><td>Wires</td><td>2 (TX, RX)</td><td>4 (MOSI/MISO/SCK/CS)</td><td>2 (SDA, SCL)</td></tr>
<tr><td>Clock</td><td>none (async)</td><td>shared clock</td><td>shared clock</td></tr>
<tr><td>Speed</td><td>low-med</td><td>fastest</td><td>medium</td></tr>
<tr><td>Devices</td><td>1-to-1</td><td>many (one CS each)</td><td>many (by address)</td></tr>
<tr><td>Use</td><td>PC/debug, GPS</td><td>SD card, display</td><td>many small sensors</td></tr>
</tbody></table>
<pre><code class="language-c">// UART: print to a PC terminal
char msg[] = "Temp OK\r\n";
HAL_UART_Transmit(&amp;huart2, (uint8_t*)msg, sizeof(msg)-1, 100);

// I2C: read 1 byte from a sensor at address 0x48
uint8_t data;
HAL_I2C_Master_Receive(&amp;hi2c1, 0x48 &lt;&lt; 1, &amp;data, 1, 100);
</code></pre>
<p><strong>Choosing:</strong> talk to a PC / simple module → <strong>UART</strong>. Need speed (display, SD card) → <strong>SPI</strong>. Many small sensors on 2 shared wires → <strong>I2C</strong> (each device has an address). UART is also your main <em>debugging</em> tool — printf over UART to see what's happening.</p>`,
    `<span class="eyebrow">MIP201 · Chương 3 · Bài 3.1</span>
<h2>Giao tiếp nối tiếp — UART, SPI, I2C</h2>
<p>MCU nói chuyện với cảm biến, màn hình và PC qua <strong>giao thức nối tiếp</strong>. Ba cái bắt buộc biết:</p>
<table><thead><tr><th></th><th>UART</th><th>SPI</th><th>I2C</th></tr></thead><tbody>
<tr><td>Số dây</td><td>2 (TX, RX)</td><td>4 (MOSI/MISO/SCK/CS)</td><td>2 (SDA, SCL)</td></tr>
<tr><td>Đồng hồ</td><td>không (bất đồng bộ)</td><td>chung</td><td>chung</td></tr>
<tr><td>Tốc độ</td><td>thấp-vừa</td><td>nhanh nhất</td><td>vừa</td></tr>
<tr><td>Thiết bị</td><td>1-1</td><td>nhiều (mỗi cái một CS)</td><td>nhiều (theo địa chỉ)</td></tr>
<tr><td>Dùng</td><td>PC/debug, GPS</td><td>thẻ SD, màn hình</td><td>nhiều cảm biến nhỏ</td></tr>
</tbody></table>
<pre><code class="language-c">// UART: in ra terminal PC
char msg[] = "Temp OK\r\n";
HAL_UART_Transmit(&amp;huart2, (uint8_t*)msg, sizeof(msg)-1, 100);

// I2C: đọc 1 byte từ cảm biến ở địa chỉ 0x48
uint8_t data;
HAL_I2C_Master_Receive(&amp;hi2c1, 0x48 &lt;&lt; 1, &amp;data, 1, 100);
</code></pre>
<p><strong>Chọn:</strong> nói với PC / module đơn giản → <strong>UART</strong>. Cần tốc độ (màn hình, thẻ SD) → <strong>SPI</strong>. Nhiều cảm biến nhỏ trên 2 dây chung → <strong>I2C</strong> (mỗi thiết bị một địa chỉ). UART cũng là công cụ <em>gỡ lỗi</em> chính — printf qua UART để thấy chuyện gì đang xảy ra.</p>`,
  ]]);

const c3q = quiz('mip201-quiz-3', 'Quiz 3 — UART/SPI/I2C|||Quiz 3 — UART/SPI/I2C', [
  { id: 'q1', question: 'Nhiều cảm biến nhỏ dùng chung 2 dây, phân biệt bằng ĐỊA CHỈ là giao thức?', options: ['UART', 'SPI', 'I2C', 'PWM'], correctIndex: 2, explanation: 'I2C dùng SDA/SCL, mỗi thiết bị một địa chỉ.' },
  { id: 'q2', question: 'Cần tốc độ cao nhất (màn hình, thẻ SD) thường dùng?', options: ['UART', 'SPI', 'I2C', 'ADC'], correctIndex: 1, explanation: 'SPI nhanh nhất, dùng 4 dây, đồng hồ chung.' },
  { id: 'q3', question: 'In debug từ MCU ra terminal PC thường qua?', options: ['UART (printf)', 'PWM', 'ADC', 'GPIO số'], correctIndex: 0, explanation: 'UART 2 dây TX/RX, công cụ debug phổ biến.' },
]);

const c4 = doc('mip201-4-1-rtos', '4.1 — Real-time OS (RTOS)|||4.1 — Hệ điều hành thời gian thực (RTOS)',
  'Vì sao super-loop không đủ; RTOS: task/thread, scheduler theo ưu tiên, mutex (tranh chấp tài nguyên), semaphore (đồng bộ/báo hiệu).',
  [[
    `<span class="eyebrow">MIP201 · Chapter 4 · Lesson 4.1</span>
<h2>Real-time operating systems</h2>
<h3>Why an RTOS?</h3>
<p>A single super-loop struggles when several things must happen "at once" at different rates (read a sensor every 10 ms, update a screen every 100 ms, respond to a button instantly). An <strong>RTOS</strong> (e.g. FreeRTOS / CMSIS-RTOS) lets you write each job as an independent <strong>task (thread)</strong>; a <strong>scheduler</strong> runs them by priority and switches between them.</p>
<pre><code class="language-c">void BlinkTask(void *arg) {
    for (;;) {                         // each task is its own forever-loop
        HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
        osDelay(500);                  // yields CPU to other tasks
    }
}
</code></pre>
<h3>Sharing safely: mutex &amp; semaphore</h3>
<ul>
<li><strong>Mutex</strong> — a lock so only one task uses a shared resource (a UART, a variable) at a time, preventing corruption from two tasks writing together.</li>
<li><strong>Semaphore</strong> — a counter/signal used to <em>synchronize</em>: an interrupt "gives" a semaphore when data arrives, and a task "takes" it to wake up and process the data.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> Multitasking creates <strong>resource contention</strong> — two tasks touching the same thing. A mutex serializes access; a semaphore signals events between tasks/interrupts. Use <code>osDelay</code>, never a busy <code>HAL_Delay</code>, so a task yields the CPU.</div>`,
    `<span class="eyebrow">MIP201 · Chương 4 · Bài 4.1</span>
<h2>Hệ điều hành thời gian thực</h2>
<h3>Vì sao cần RTOS?</h3>
<p>Một super-loop đơn chật vật khi nhiều việc phải xảy ra "cùng lúc" ở nhịp khác nhau (đọc cảm biến mỗi 10 ms, cập nhật màn hình mỗi 100 ms, phản ứng nút tức thì). Một <strong>RTOS</strong> (vd FreeRTOS / CMSIS-RTOS) cho bạn viết mỗi việc thành một <strong>task (thread)</strong> độc lập; một <strong>bộ lập lịch</strong> chạy chúng theo ưu tiên và chuyển qua lại.</p>
<pre><code class="language-c">void BlinkTask(void *arg) {
    for (;;) {                         // mỗi task là vòng-lặp-mãi của riêng nó
        HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
        osDelay(500);                  // nhường CPU cho task khác
    }
}
</code></pre>
<h3>Chia sẻ an toàn: mutex &amp; semaphore</h3>
<ul>
<li><strong>Mutex</strong> — một khoá để chỉ một task dùng tài nguyên chung (một UART, một biến) tại một thời điểm, tránh hỏng do hai task ghi cùng lúc.</li>
<li><strong>Semaphore</strong> — một bộ đếm/tín hiệu dùng để <em>đồng bộ</em>: một ngắt "give" semaphore khi dữ liệu tới, và một task "take" nó để thức dậy xử lý dữ liệu.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> Đa nhiệm tạo <strong>tranh chấp tài nguyên</strong> — hai task đụng cùng một thứ. Mutex tuần tự hoá truy cập; semaphore báo hiệu sự kiện giữa task/ngắt. Dùng <code>osDelay</code>, không dùng <code>HAL_Delay</code> bận, để task nhường CPU.</div>`,
  ]]);

const c4q = quiz('mip201-quiz-4', 'Quiz 4 — RTOS|||Quiz 4 — RTOS', [
  { id: 'q1', question: 'RTOS giúp gì so với một super-loop đơn?', options: ['Chạy chậm hơn', 'Chia nhiều việc thành task độc lập, scheduler theo ưu tiên', 'Bỏ được phần cứng', 'Không cần main'], correctIndex: 1, explanation: 'RTOS quản nhiều task chạy "cùng lúc" theo ưu tiên.' },
  { id: 'q2', question: 'Đảm bảo chỉ MỘT task dùng UART chung tại một thời điểm dùng?', options: ['Semaphore đếm', 'Mutex (khoá)', 'PWM', 'ADC'], correctIndex: 1, explanation: 'Mutex tuần tự hoá truy cập tài nguyên chung, chống hỏng.' },
  { id: 'q3', question: 'Ngắt báo cho một task "có dữ liệu, dậy xử lý đi" thường dùng?', options: ['Mutex', 'Semaphore (give/take)', 'HAL_Delay', 'GPIO'], correctIndex: 1, explanation: 'Semaphore đồng bộ sự kiện giữa ngắt và task.' },
]);

const taiLieu = doc('mip201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">MIP201 · 📚 Resource hub</span>
<h2>Course materials &amp; references</h2>
<p class="lead">One hub for learning microcontroller programming on STM32/ARM Cortex-M: the official syllabus &amp; slides, books, free official docs, video channels, tools, and a self-study roadmap.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>Sign in to <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) with your FPTU account to read the official MIP201 syllabus and lecture slides.</p>
<h3>📗 Books</h3>
<ul>
<li><a href="https://leanpub.com/mastering-stm32" target="_blank" rel="noopener">Mastering STM32</a> — Carmine Noviello: HAL, CubeIDE, peripherals in depth.</li>
<li><a href="https://www.oreilly.com/library/view/making-embedded-systems/9781449308889/" target="_blank" rel="noopener">Making Embedded Systems</a> — Elecia White: how to think like an embedded engineer.</li>
</ul>
<h3>🌐 Free official docs</h3>
<ul>
<li><a href="https://www.st.com/en/development-tools/stm32cubeide.html" target="_blank" rel="noopener">STM32CubeIDE</a> — official IDE, downloads &amp; docs.</li>
<li><a href="https://www.st.com/content/st_com/en/support/learning/stm32-education.html" target="_blank" rel="noopener">STM32 Education (ST)</a> — free courses, HAL &amp; peripheral guides.</li>
<li><a href="https://developer.arm.com/documentation" target="_blank" rel="noopener">Arm Developer</a> — Cortex-M architecture &amp; reference.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@PhilsLab" target="_blank" rel="noopener">Phil's Lab</a> — STM32 &amp; embedded firmware, hands-on.</li>
<li><a href="https://www.youtube.com/@ControllersTech" target="_blank" rel="noopener">ControllersTech</a> — STM32 HAL peripheral tutorials.</li>
<li><a href="https://www.youtube.com/@digikey" target="_blank" rel="noopener">DigiKey</a> — embedded &amp; RTOS explainer series.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.st.com/en/development-tools/stm32cubeide.html" target="_blank" rel="noopener">STM32CubeIDE</a> — edit, build &amp; flash.</li>
<li><a href="https://www.st.com/en/development-tools/stm32cubemx.html" target="_blank" rel="noopener">STM32CubeMX</a> — pin/clock/peripheral configurator.</li>
<li><a href="https://www.putty.org/" target="_blank" rel="noopener">PuTTY / a serial terminal</a> — read UART debug output.</li>
<li><a href="https://www.saleae.com/" target="_blank" rel="noopener">Logic analyzer (Saleae/PulseView)</a> — inspect SPI/I2C/UART lines.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations (exam core)</strong> — super-loop, GPIO, ADC, following the lessons here.</li>
<li><strong>Practice on hardware</strong> — blink, read a button with debounce, read a sensor on a Nucleo board.</li>
<li><strong>Go deeper</strong> — interrupts, timers/PWM, UART/SPI/I2C, then an RTOS with tasks and a mutex.</li>
<li><strong>Job-ready</strong> — build one complete embedded project (sensor + display or motor) and write clean, interrupt-driven firmware.</li>
</ol>
<div class="callout"><span class="badge">Note</span> An original hub of real links — no copyrighted slides or books are embedded. If a link moves, start from the official homepage.</div>`,
    `<span class="eyebrow">MIP201 · 📚 Trung tâm tài liệu</span>
<h2>Tài liệu tham khảo môn học</h2>
<p class="lead">Một nơi gom để học lập trình vi điều khiển trên STM32/ARM Cortex-M: giáo trình &amp; slide chính thức, sách, tài liệu miễn phí chính thống, kênh video, công cụ, và lộ trình tự học.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Đăng nhập <strong>FLM</strong> (<a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a>) bằng tài khoản FPTU để đọc giáo trình và slide bài giảng chính thức của MIP201.</p>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://leanpub.com/mastering-stm32" target="_blank" rel="noopener">Mastering STM32</a> — Carmine Noviello: HAL, CubeIDE, ngoại vi rất sâu.</li>
<li><a href="https://www.oreilly.com/library/view/making-embedded-systems/9781449308889/" target="_blank" rel="noopener">Making Embedded Systems</a> — Elecia White: tư duy như kỹ sư nhúng.</li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://www.st.com/en/development-tools/stm32cubeide.html" target="_blank" rel="noopener">STM32CubeIDE</a> — IDE chính thức, tải &amp; tài liệu.</li>
<li><a href="https://www.st.com/content/st_com/en/support/learning/stm32-education.html" target="_blank" rel="noopener">STM32 Education (ST)</a> — khoá học miễn phí, hướng dẫn HAL &amp; ngoại vi.</li>
<li><a href="https://developer.arm.com/documentation" target="_blank" rel="noopener">Arm Developer</a> — kiến trúc &amp; tham chiếu Cortex-M.</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@PhilsLab" target="_blank" rel="noopener">Phil's Lab</a> — STM32 &amp; firmware nhúng, thực hành.</li>
<li><a href="https://www.youtube.com/@ControllersTech" target="_blank" rel="noopener">ControllersTech</a> — hướng dẫn ngoại vi STM32 HAL.</li>
<li><a href="https://www.youtube.com/@digikey" target="_blank" rel="noopener">DigiKey</a> — loạt bài giải thích nhúng &amp; RTOS.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.st.com/en/development-tools/stm32cubeide.html" target="_blank" rel="noopener">STM32CubeIDE</a> — soạn, build &amp; nạp.</li>
<li><a href="https://www.st.com/en/development-tools/stm32cubemx.html" target="_blank" rel="noopener">STM32CubeMX</a> — cấu hình chân/clock/ngoại vi.</li>
<li><a href="https://www.putty.org/" target="_blank" rel="noopener">PuTTY / terminal nối tiếp</a> — đọc debug qua UART.</li>
<li><a href="https://www.saleae.com/" target="_blank" rel="noopener">Logic analyzer (Saleae/PulseView)</a> — soi đường SPI/I2C/UART.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng (lõi thi)</strong> — super-loop, GPIO, ADC, theo đúng các bài ở đây.</li>
<li><strong>Luyện trên phần cứng</strong> — nháy LED, đọc nút có chống dội, đọc cảm biến trên board Nucleo.</li>
<li><strong>Đào sâu</strong> — ngắt, timer/PWM, UART/SPI/I2C, rồi RTOS với task và mutex.</li>
<li><strong>Sẵn sàng đi làm</strong> — làm trọn một dự án nhúng (cảm biến + màn hình hoặc động cơ) và viết firmware sạch, chạy theo ngắt.</li>
</ol>
<div class="callout"><span class="badge">Lưu ý</span> Đây là trung tâm liên kết nguyên gốc — không nhúng slide/sách có bản quyền. Link đổi thì vào trang chủ chính thức để tìm.</div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'MIP201',
    slug: 'mip201-microcontroller-programming',
    title: 'Microcontroller Programming',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MIP201.webp',
    shortDescription: 'Embedded C on ARM Cortex-M (STM32 HAL/CubeIDE) — GPIO & ADC, interrupts, timers & PWM, serial comms (UART/SPI/I2C), and an RTOS (tasks/mutex/semaphore). Bilingual, with embedded C & quizzes.|||C nhúng trên ARM Cortex-M (STM32 HAL/CubeIDE) — GPIO & ADC, ngắt, timer & PWM, giao tiếp nối tiếp (UART/SPI/I2C), và RTOS (task/mutex/semaphore). Song ngữ, có C nhúng & quiz.',
    description: 'Môn <strong>MIP201 — Microcontroller Programming</strong> (kỳ 7) dạy <strong>C nhúng trên ARM Cortex-M</strong> với thư viện <strong>STM32 HAL</strong> và <strong>STM32CubeIDE</strong>, board Nucleo. Từ <strong>GPIO &amp; ADC</strong> (super-loop, đọc/ghi chân, chống dội, đọc analog) → <strong>ngắt, timer &amp; PWM</strong> (phản ứng tức thì, điều khiển độ sáng/tốc độ) → <strong>giao tiếp nối tiếp</strong> (UART, SPI, I2C) → <strong>RTOS</strong> (task/thread, scheduler, mutex, semaphore). Bám giáo trình FLM, song ngữ, code C nhúng thật và quiz mỗi chương.',
    whatYouLearn: 'Kiến trúc MCU & ARM Cortex-M; super-loop; GPIO số (LED/nút, debounce) & ADC (analog→số); ngắt (ISR ngắn, callback); timer & PWM (duty cycle điều khiển LED/động cơ); UART/SPI/I2C (chọn theo tốc độ/số thiết bị/địa chỉ, debug qua UART); RTOS (task, ưu tiên, osDelay, mutex chống tranh chấp, semaphore đồng bộ).',
    requirements: 'Biết C cơ bản (con trỏ, kiểu). Nên có board STM32 Nucleo-F401RE/F411RE (hoặc dùng mô phỏng) + STM32CubeIDE.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'MCU, ARM Cortex-M, HAL/CubeIDE.', lessons: [intro] },
    { title: 'Chương 1 — GPIO & ADC|||Chapter 1 — GPIO & ADC', description: 'Super-loop, vào/ra số, analog, debounce.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Ngắt, timer & PWM|||Chapter 2 — Interrupts, timers & PWM', description: 'Phản ứng tức thì, duty cycle.', lessons: [c2, c2q] },
    { title: 'Chương 3 — UART/SPI/I2C|||Chapter 3 — Serial comms', description: 'Ba giao thức & khi nào dùng.', lessons: [c3, c3q] },
    { title: 'Chương 4 — RTOS|||Chapter 4 — RTOS', description: 'Task, mutex, semaphore.', lessons: [c4, c4q] },
  ],
};
