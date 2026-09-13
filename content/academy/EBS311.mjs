/**
 * EBS311 — Advanced Embedded Systems (Hệ thống nhúng nâng cao). Ngành Kỹ thuật
 * phần mềm ô tô, kỳ 4, FPTU. Song ngữ VI+EN theo mẫu ECI101.
 * Giáo trình (trích dẫn, KHÔNG upload PDF): White "Making Embedded Systems";
 * Yiu "The Definitive Guide to ARM Cortex-M3/M4"; Simon "An Embedded Software
 * Primer"; FreeRTOS documentation; Lee/Seshia "Introduction to Embedded Systems".
 * ⚠️ GIỮ NGUYÊN slug/semester/courseCode/thumbnailUrl. Không backtick/${ trong
 * content; escape "<"→&lt;, "&"→&amp;. KHÔNG ký tự Cyrillic/Hy Lạp lạ trong code.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('ebs311-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách nền tảng, tài liệu chính thức miễn phí (ARM, FreeRTOS), YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">EBS311 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Advanced Embedded Systems</strong> — ARM Cortex-M internals, interrupts &amp; peripherals, serial buses, a real-time OS, low-power design, drivers &amp; HAL, debugging, and automotive-grade practice — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbooks (course references)</h3>
<ul>
<li>Elecia White — <em>Making Embedded Systems</em> (O'Reilly): the practical mindset of firmware.</li>
<li>Joseph Yiu — <em>The Definitive Guide to ARM Cortex-M3/M4</em>: the reference for the core this course targets.</li>
<li>David Simon — <em>An Embedded Software Primer</em>: RTOS concepts from first principles.</li>
<li>Lee &amp; Seshia — <em>Introduction to Embedded Systems</em> (free PDF at <a href="https://ptolemy.berkeley.edu/books/leeseshia/" target="_blank" rel="noopener">ptolemy.berkeley.edu</a>).</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.freertos.org/features.html" target="_blank" rel="noopener">FreeRTOS documentation</a> — tasks, queues, semaphores, the scheduler.</li>
<li><a href="https://developer.arm.com/documentation" target="_blank" rel="noopener">ARM Developer</a> — Cortex-M technical reference manuals &amp; the CMSIS standard.</li>
<li><a href="https://www.st.com/en/embedded-software/stm32cube-mcu-mpu-packages.html" target="_blank" rel="noopener">STM32Cube HAL</a> — a real vendor HAL to read and learn from.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@phils_lab" target="_blank" rel="noopener">Phil's Lab</a> — STM32, drivers, PCB &amp; DSP for embedded.</li>
<li>Search "bare metal STM32" on YouTube — register-level tutorials from the ground up.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li>Arm GCC (<code>arm-none-eabi-gcc</code>) + <code>make</code>/CMake — the open toolchain.</li>
<li>OpenOCD / pyOCD + GDB — flashing and on-chip debugging.</li>
<li>STM32CubeIDE or VS Code + Cortex-Debug — an IDE with SWV trace.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — the Cortex-M memory map, interrupts (NVIC), timers and GPIO.</li>
<li><strong>Talk to the world</strong> — UART, SPI, I2C and the ADC, from registers up.</li>
<li><strong>Go real-time</strong> — FreeRTOS tasks, scheduling and synchronization; then power &amp; memory.</li>
<li><strong>Job-ready</strong> — write HAL-style drivers, debug with SWD/trace, and apply MISRA C / ISO 26262 discipline.</li>
</ol></div>`,
    `<span class="eyebrow">EBS311 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Hệ thống nhúng nâng cao</strong> — ruột ARM Cortex-M, ngắt &amp; ngoại vi, các bus nối tiếp, một hệ điều hành thời gian thực, tối ưu năng lượng, driver &amp; HAL, gỡ lỗi, và thực hành chuẩn ô tô — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Sách (giáo trình tham khảo)</h3>
<ul>
<li>Elecia White — <em>Making Embedded Systems</em> (O'Reilly): tư duy thực chiến của lập trình firmware.</li>
<li>Joseph Yiu — <em>The Definitive Guide to ARM Cortex-M3/M4</em>: sách gối đầu cho lõi mà môn này nhắm tới.</li>
<li>David Simon — <em>An Embedded Software Primer</em>: khái niệm RTOS từ gốc.</li>
<li>Lee &amp; Seshia — <em>Introduction to Embedded Systems</em> (PDF miễn phí tại <a href="https://ptolemy.berkeley.edu/books/leeseshia/" target="_blank" rel="noopener">ptolemy.berkeley.edu</a>).</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.freertos.org/features.html" target="_blank" rel="noopener">Tài liệu FreeRTOS</a> — task, hàng đợi, semaphore, bộ lập lịch.</li>
<li><a href="https://developer.arm.com/documentation" target="_blank" rel="noopener">ARM Developer</a> — sổ tay kỹ thuật Cortex-M &amp; chuẩn CMSIS.</li>
<li><a href="https://www.st.com/en/embedded-software/stm32cube-mcu-mpu-packages.html" target="_blank" rel="noopener">STM32Cube HAL</a> — một HAL của hãng thật để đọc và học.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@phils_lab" target="_blank" rel="noopener">Phil's Lab</a> — STM32, driver, PCB &amp; DSP cho nhúng.</li>
<li>Tìm khoá "bare metal STM32" — hướng dẫn ở mức thanh ghi.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li>Arm GCC (<code>arm-none-eabi-gcc</code>) + <code>make</code>/CMake — bộ công cụ mã nguồn mở.</li>
<li>OpenOCD / pyOCD + GDB — nạp chương trình và gỡ lỗi trên chip.</li>
<li>STM32CubeIDE hoặc VS Code + Cortex-Debug — IDE có trace SWV.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền</strong> — bản đồ bộ nhớ Cortex-M, ngắt (NVIC), timer và GPIO.</li>
<li><strong>Nói chuyện với thế giới</strong> — UART, SPI, I2C và ADC, từ thanh ghi lên.</li>
<li><strong>Vào thời gian thực</strong> — task FreeRTOS, lập lịch &amp; đồng bộ; rồi năng lượng &amp; bộ nhớ.</li>
<li><strong>Sẵn sàng đi làm</strong> — viết driver kiểu HAL, gỡ lỗi bằng SWD/trace, và giữ kỷ luật MISRA C / ISO 26262.</li>
</ol></div>`,
  ]]);

const intro = doc('ebs311-0-1-overview', 'Course overview: Advanced Embedded Systems|||Tổng quan: Hệ thống nhúng nâng cao',
  'Hệ nhúng là gì, khác PC ra sao; ràng buộc thời gian thực & tài nguyên; lộ trình 8 chương: kiến trúc Cortex-M → ngoại vi → RTOS → năng lượng → driver → gỡ lỗi → ô tô.',
  [[
    `<span class="eyebrow">EBS311 · Lesson 0.1 · Overview</span>
<h2>Advanced Embedded Systems</h2>
<p class="lead">An <strong>embedded system</strong> is a computer built into a product to do one job well — an engine controller, an airbag unit, a smartwatch. This course goes below the application layer to the <strong>firmware</strong> that drives the hardware directly, on the <strong>ARM Cortex-M</strong> microcontrollers used across automotive and IoT.</p>
<h3>How embedded differs from a PC</h3>
<ul>
<li><strong>Constrained</strong> — kilobytes of RAM, no OS by default, must fit and run for years.</li>
<li><strong>Real-time</strong> — the right answer late is a wrong answer; deadlines are part of correctness.</li>
<li><strong>Close to hardware</strong> — you read and write device registers, handle interrupts, and count clock cycles.</li>
<li><strong>Reliability-first</strong> — a phone reboots; a brake controller may not.</li>
</ul>
<h3>Roadmap (8 chapters)</h3>
<p>Cortex-M architecture &amp; memory → interrupts, timers &amp; GPIO → serial peripherals (UART/SPI/I2C/ADC) → an RTOS (tasks, scheduling, synchronization) → memory management &amp; low-power → device drivers &amp; the HAL → debugging, trace &amp; test → automotive embedded (MISRA C, AUTOSAR, ISO 26262). Bilingual, with C / FreeRTOS examples and a quiz per chapter.</p>`,
    `<span class="eyebrow">EBS311 · Bài 0.1 · Tổng quan</span>
<h2>Hệ thống nhúng nâng cao</h2>
<p class="lead">Một <strong>hệ nhúng</strong> là máy tính đặt bên trong sản phẩm để làm tốt đúng một việc — bộ điều khiển động cơ, hộp túi khí, đồng hồ thông minh. Môn này đi xuống dưới lớp ứng dụng, tới <strong>firmware</strong> điều khiển phần cứng trực tiếp, trên các vi điều khiển <strong>ARM Cortex-M</strong> dùng khắp ô tô và IoT.</p>
<h3>Nhúng khác PC thế nào</h3>
<ul>
<li><strong>Hạn hẹp</strong> — RAM tính bằng kilobyte, mặc định không có OS, phải vừa khít và chạy nhiều năm.</li>
<li><strong>Thời gian thực</strong> — đúng mà muộn là sai; hạn chót là một phần của tính đúng.</li>
<li><strong>Sát phần cứng</strong> — bạn đọc/ghi thanh ghi thiết bị, xử lý ngắt, và đếm chu kỳ xung nhịp.</li>
<li><strong>Ưu tiên tin cậy</strong> — điện thoại khởi động lại được; bộ điều khiển phanh thì không.</li>
</ul>
<h3>Lộ trình (8 chương)</h3>
<p>Kiến trúc &amp; bộ nhớ Cortex-M → ngắt, timer &amp; GPIO → ngoại vi nối tiếp (UART/SPI/I2C/ADC) → một RTOS (task, lập lịch, đồng bộ) → quản lý bộ nhớ &amp; tiết kiệm năng lượng → driver thiết bị &amp; HAL → gỡ lỗi, trace &amp; kiểm thử → hệ nhúng ô tô (MISRA C, AUTOSAR, ISO 26262). Song ngữ, có ví dụ C / FreeRTOS và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('ebs311-1-1-cortex-m-architecture', '1.1 — ARM Cortex-M architecture & memory|||1.1 — Kiến trúc ARM Cortex-M & bộ nhớ',
  'Lõi Cortex-M (Thumb-2, thanh ghi, chế độ Thread/Handler), bản đồ bộ nhớ thống nhất, kiến trúc load/store, boot & vector table, CMSIS.',
  [[
    `<span class="eyebrow">EBS311 · Chapter 1 · Lesson 1.1</span>
<h2>ARM Cortex-M architecture &amp; memory</h2>
<p>The <strong>Cortex-M</strong> is a 32-bit <strong>load/store RISC</strong> core: the CPU only computes on <strong>registers</strong>, and separate <code>LDR</code>/<code>STR</code> instructions move data to and from memory. It runs the compact <strong>Thumb-2</strong> instruction set and has 16 core registers (R0-R12, plus SP, LR, PC).</p>
<h3>Two modes, two stacks</h3>
<ul>
<li><strong>Thread mode</strong> runs your normal code; <strong>Handler mode</strong> runs exceptions/interrupts.</li>
<li>Two stack pointers — <strong>MSP</strong> (main) and <strong>PSP</strong> (process) — let an RTOS give each task its own stack while the kernel/ISRs use MSP.</li>
</ul>
<h3>A single, flat memory map</h3>
<p>Everything shares one 4&nbsp;GB address space — code (Flash), SRAM, and <strong>peripherals are just memory addresses</strong>. Writing a bit at a fixed address toggles an LED. That is why C pointers can drive hardware directly.</p>
<h3>Boot: the vector table</h3>
<p>On reset the core reads two words from address 0: the <strong>initial stack pointer</strong>, then the <strong>reset handler</strong> address. The whole <strong>vector table</strong> lists one address per exception/interrupt.</p>
<pre><code>#include &lt;stdint.h&gt;

/* A peripheral register is just a volatile pointer to an address. */
#define GPIOA_ODR  (*(volatile uint32_t *)0x40020014u)

void led_on(void)  { GPIOA_ODR |=  (1u &lt;&lt; 5); }  /* set bit 5   */
void led_off(void) { GPIOA_ODR &amp;= ~(1u &lt;&lt; 5); }  /* clear bit 5 */
</code></pre>
<div class="callout"><span class="badge">CMSIS</span> ARM's <strong>CMSIS</strong> standard gives every vendor the same core headers and register names, so code and the vector table look alike across STM32, NXP, and others. <code>volatile</code> is mandatory on registers — it stops the compiler caching a value that hardware changes.</div>`,
    `<span class="eyebrow">EBS311 · Chương 1 · Bài 1.1</span>
<h2>Kiến trúc ARM Cortex-M &amp; bộ nhớ</h2>
<p><strong>Cortex-M</strong> là lõi <strong>RISC load/store</strong> 32-bit: CPU chỉ tính trên <strong>thanh ghi</strong>, và các lệnh riêng <code>LDR</code>/<code>STR</code> chuyển dữ liệu vào/ra bộ nhớ. Nó chạy tập lệnh gọn <strong>Thumb-2</strong> và có 16 thanh ghi lõi (R0-R12, cùng SP, LR, PC).</p>
<h3>Hai chế độ, hai ngăn xếp</h3>
<ul>
<li><strong>Thread mode</strong> chạy mã thường; <strong>Handler mode</strong> chạy ngoại lệ/ngắt.</li>
<li>Hai con trỏ ngăn xếp — <strong>MSP</strong> (chính) và <strong>PSP</strong> (tiến trình) — cho phép RTOS cấp cho mỗi task một stack riêng, còn kernel/ISR dùng MSP.</li>
</ul>
<h3>Một bản đồ bộ nhớ phẳng, thống nhất</h3>
<p>Mọi thứ chung một không gian địa chỉ 4&nbsp;GB — mã (Flash), SRAM, và <strong>ngoại vi cũng chỉ là địa chỉ bộ nhớ</strong>. Ghi một bit vào địa chỉ cố định là bật một LED. Nhờ đó con trỏ C điều khiển phần cứng trực tiếp.</p>
<h3>Khởi động: bảng vector</h3>
<p>Khi reset, lõi đọc hai từ ở địa chỉ 0: <strong>con trỏ ngăn xếp ban đầu</strong>, rồi địa chỉ <strong>reset handler</strong>. Cả <strong>bảng vector</strong> liệt kê một địa chỉ cho mỗi ngoại lệ/ngắt.</p>
<pre><code>#include &lt;stdint.h&gt;

/* Thanh ghi ngoại vi chỉ là con trỏ volatile trỏ tới một địa chỉ. */
#define GPIOA_ODR  (*(volatile uint32_t *)0x40020014u)

void led_on(void)  { GPIOA_ODR |=  (1u &lt;&lt; 5); }  /* set bit 5   */
void led_off(void) { GPIOA_ODR &amp;= ~(1u &lt;&lt; 5); }  /* clear bit 5 */
</code></pre>
<div class="callout"><span class="badge">CMSIS</span> Chuẩn <strong>CMSIS</strong> của ARM cho mọi hãng cùng bộ header lõi và tên thanh ghi, nên mã và bảng vector nhìn giống nhau giữa STM32, NXP... <code>volatile</code> là bắt buộc với thanh ghi — nó chặn trình biên dịch nhớ đệm giá trị mà phần cứng đang thay đổi.</div>`,
  ]]);

const c1q = quiz('ebs311-quiz-1', 'Quiz 1 — Cortex-M architecture|||Quiz 1 — Kiến trúc Cortex-M', [
  { id: 'q1', question: 'Kiến trúc "load/store" của Cortex-M nghĩa là?', options: ['CPU tính trực tiếp trên ô nhớ', 'CPU chỉ tính trên thanh ghi, phải LDR/STR để chuyển dữ liệu với bộ nhớ', 'Không có thanh ghi', 'Chỉ nạp được, không lưu được'], correctIndex: 1, explanation: 'RISC load/store: mọi phép tính trên thanh ghi; LDR/STR mới đọc/ghi bộ nhớ.' },
  { id: 'q2', question: 'Vì sao con trỏ C có thể điều khiển phần cứng trực tiếp trên Cortex-M?', options: ['Vì có hàm hệ điều hành riêng', 'Vì ngoại vi được ánh xạ vào cùng không gian địa chỉ bộ nhớ', 'Vì CPU chạy Thumb-2', 'Vì có hai stack pointer'], correctIndex: 1, explanation: 'Bản đồ bộ nhớ thống nhất: thanh ghi ngoại vi là các địa chỉ, ghi con trỏ vào đó là điều khiển phần cứng.' },
  { id: 'q3', question: 'Từ khoá nào bắt buộc khi khai báo con trỏ tới thanh ghi ngoại vi?', options: ['const', 'static', 'volatile', 'register'], correctIndex: 2, explanation: 'volatile ngăn trình biên dịch nhớ đệm giá trị mà phần cứng tự thay đổi.' },
]);

const c2 = doc('ebs311-2-1-interrupts-timers-gpio', '2.1 — Interrupts, timers, GPIO & peripherals|||2.1 — Ngắt, timer, GPIO & ngoại vi',
  'GPIO (input/output, pull, alternate function), ngắt & NVIC (ưu tiên, ISR ngắn), timer (đếm, PWM, input capture), polling vs interrupt.',
  [[
    `<span class="eyebrow">EBS311 · Chapter 2 · Lesson 2.1</span>
<h2>Interrupts, timers, GPIO &amp; peripherals</h2>
<h3>GPIO — the simplest peripheral</h3>
<p>A <strong>GPIO</strong> pin can be an <strong>output</strong> (drive high/low, e.g. an LED or relay), an <strong>input</strong> (read a button, often with a pull-up/pull-down), or switched to an <strong>alternate function</strong> so a UART or timer owns the pin.</p>
<h3>Interrupts &amp; the NVIC</h3>
<p>Polling — asking "is it ready yet?" in a loop — wastes CPU. An <strong>interrupt</strong> lets the hardware call you only when something happens. The <strong>NVIC</strong> (Nested Vectored Interrupt Controller) prioritizes interrupts and lets a higher-priority one preempt a lower one.</p>
<ul>
<li>Keep an <strong>ISR</strong> (interrupt service routine) <em>short</em> — set a flag, clear the interrupt, return; do heavy work in the main loop or a task.</li>
<li>Data shared with an ISR must be <code>volatile</code> and, if wider than one word, protected against being read mid-update.</li>
</ul>
<h3>Timers</h3>
<p>A hardware <strong>timer</strong> counts clock ticks: it makes periodic interrupts (a system tick), generates <strong>PWM</strong> to dim an LED or drive a motor, and does <strong>input capture</strong> to measure a pulse width — all without CPU effort.</p>
<pre><code>volatile uint8_t g_button_pressed = 0;

/* ISR: keep it tiny. */
void EXTI0_IRQHandler(void)
{
    EXTI-&gt;PR = (1u &lt;&lt; 0);   /* clear the pending flag */
    g_button_pressed = 1;  /* signal the main loop    */
}
</code></pre>
<div class="callout"><span class="badge">Golden rule</span> Do the least possible in an ISR. A long interrupt handler blocks every lower-priority event and destroys your timing.</div>`,
    `<span class="eyebrow">EBS311 · Chương 2 · Bài 2.1</span>
<h2>Ngắt, timer, GPIO &amp; ngoại vi</h2>
<h3>GPIO — ngoại vi đơn giản nhất</h3>
<p>Một chân <strong>GPIO</strong> có thể là <strong>đầu ra</strong> (kéo cao/thấp, vd LED hay rơ-le), <strong>đầu vào</strong> (đọc nút, thường kèm điện trở kéo lên/xuống), hoặc chuyển sang <strong>chức năng thay thế</strong> để UART hay timer chiếm chân đó.</p>
<h3>Ngắt &amp; NVIC</h3>
<p>Polling — hỏi "xong chưa?" trong vòng lặp — phí CPU. Một <strong>ngắt</strong> để phần cứng gọi bạn chỉ khi có sự kiện. <strong>NVIC</strong> (Nested Vectored Interrupt Controller) xếp ưu tiên các ngắt và cho ngắt ưu tiên cao chen ngang ngắt thấp hơn.</p>
<ul>
<li>Giữ <strong>ISR</strong> (thủ tục phục vụ ngắt) <em>ngắn</em> — bật cờ, xoá ngắt, trả về; việc nặng làm ở vòng chính hoặc task.</li>
<li>Dữ liệu chia sẻ với ISR phải <code>volatile</code> và, nếu rộng hơn một từ, phải chống bị đọc giữa lúc đang cập nhật.</li>
</ul>
<h3>Timer</h3>
<p>Một <strong>timer</strong> phần cứng đếm nhịp xung: tạo ngắt định kỳ (một system tick), sinh <strong>PWM</strong> để chỉnh sáng LED hay chạy động cơ, và <strong>input capture</strong> để đo độ rộng xung — tất cả không tốn công CPU.</p>
<pre><code>volatile uint8_t g_button_pressed = 0;

/* ISR: giữ thật nhỏ. */
void EXTI0_IRQHandler(void)
{
    EXTI-&gt;PR = (1u &lt;&lt; 0);   /* xoá cờ pending    */
    g_button_pressed = 1;  /* báo cho vòng chính */
}
</code></pre>
<div class="callout"><span class="badge">Quy tắc vàng</span> Làm ít nhất có thể trong ISR. Một handler ngắt dài chặn mọi sự kiện ưu tiên thấp hơn và phá vỡ định thời của bạn.</div>`,
  ]]);

const c2q = quiz('ebs311-quiz-2', 'Quiz 2 — Interrupts, timers, GPIO|||Quiz 2 — Ngắt, timer, GPIO', [
  { id: 'q1', question: 'Vì sao ngắt thường tốt hơn polling?', options: ['Ngắt tốn nhiều CPU hơn', 'Phần cứng chỉ gọi CPU khi có sự kiện, không phí vòng lặp hỏi', 'Polling không đọc được nút', 'Ngắt không cần NVIC'], correctIndex: 1, explanation: 'Ngắt để CPU làm việc khác, chỉ nhảy vào ISR khi sự kiện xảy ra.' },
  { id: 'q2', question: 'Nguyên tắc quan trọng khi viết ISR là?', options: ['Làm càng nhiều việc càng tốt trong ISR', 'Giữ ISR ngắn: bật cờ, xoá ngắt, trả về', 'Không bao giờ xoá cờ pending', 'Gọi hàm chờ delay dài trong ISR'], correctIndex: 1, explanation: 'ISR dài chặn các ngắt ưu tiên thấp hơn và phá định thời; đẩy việc nặng ra ngoài.' },
  { id: 'q3', question: 'Timer phần cứng KHÔNG dùng để làm việc nào sau đây?', options: ['Sinh tín hiệu PWM', 'Tạo ngắt định kỳ (system tick)', 'Đo độ rộng xung (input capture)', 'Lưu trữ mã chương trình'], correctIndex: 3, explanation: 'Timer đếm nhịp để PWM, tick, capture; lưu mã là việc của Flash.' },
]);

const c3 = doc('ebs311-3-1-serial-peripherals', '3.1 — Serial communication (UART/SPI/I2C/ADC)|||3.1 — Giao tiếp ngoại vi (UART/SPI/I2C/ADC)',
  'UART (bất đồng bộ, baud), SPI (đồng bộ, chủ/tớ, nhanh), I2C (2 dây, địa chỉ, nhiều thiết bị), ADC (analog→số, độ phân giải, lấy mẫu).',
  [[
    `<span class="eyebrow">EBS311 · Chapter 3 · Lesson 3.1</span>
<h2>Serial communication &amp; the ADC</h2>
<p>Microcontrollers talk to sensors, memory and other chips over a few standard <strong>serial buses</strong>. Each trades wires for speed and complexity.</p>
<ul>
<li><strong>UART</strong> — asynchronous, no clock line; both sides agree a <strong>baud rate</strong>. Two wires (TX/RX). Great for logs, GPS, modems.</li>
<li><strong>SPI</strong> — synchronous with a clock; a <strong>master</strong> drives one or more slaves over 4 lines (SCLK, MOSI, MISO, CS). Fast — good for displays, flash, ADCs.</li>
<li><strong>I2C</strong> — just 2 wires (SDA, SCL) shared by many devices, each with a 7-bit <strong>address</strong>. Slower, but wiring-cheap for lots of sensors.</li>
<li><strong>ADC</strong> — an <strong>analog-to-digital converter</strong> turns a voltage into a number. Key specs: <strong>resolution</strong> (e.g. 12-bit = 0..4095) and <strong>sampling rate</strong>.</li>
</ul>
<pre><code>UART:  A ---TX---&gt; B     asynchronous, agreed baud (e.g. 115200)
SPI:   master &lt;--&gt; slave  SCLK + MOSI + MISO + CS, fast
I2C:   SDA / SCL shared   many slaves, each has a 7-bit address
ADC:   Vin -&gt; N counts    12-bit: count = Vin / Vref * 4095
</code></pre>
<div class="callout"><span class="badge">How to choose</span> One far device, few wires, human-readable? <strong>UART</strong>. Fast, one board, short traces? <strong>SPI</strong>. Many small sensors on two wires? <strong>I2C</strong>. Reading a temperature, light or battery voltage? <strong>ADC</strong>.</div>`,
    `<span class="eyebrow">EBS311 · Chương 3 · Bài 3.1</span>
<h2>Giao tiếp nối tiếp &amp; ADC</h2>
<p>Vi điều khiển nói chuyện với cảm biến, bộ nhớ và chip khác qua vài <strong>bus nối tiếp</strong> chuẩn. Mỗi loại đánh đổi số dây lấy tốc độ và độ phức tạp.</p>
<ul>
<li><strong>UART</strong> — bất đồng bộ, không dây xung; hai bên thống nhất một <strong>baud rate</strong>. Hai dây (TX/RX). Hợp cho log, GPS, modem.</li>
<li><strong>SPI</strong> — đồng bộ có xung nhịp; một <strong>master</strong> điều khiển một hoặc nhiều slave qua 4 dây (SCLK, MOSI, MISO, CS). Nhanh — hợp màn hình, flash, ADC.</li>
<li><strong>I2C</strong> — chỉ 2 dây (SDA, SCL) dùng chung cho nhiều thiết bị, mỗi cái một <strong>địa chỉ</strong> 7-bit. Chậm hơn, nhưng ít dây cho nhiều cảm biến.</li>
<li><strong>ADC</strong> — bộ <strong>chuyển analog→số</strong> biến điện áp thành số. Thông số chính: <strong>độ phân giải</strong> (vd 12-bit = 0..4095) và <strong>tần số lấy mẫu</strong>.</li>
</ul>
<pre><code>UART:  A ---TX---&gt; B     bất đồng bộ, chung baud (vd 115200)
SPI:   master &lt;--&gt; slave  SCLK + MOSI + MISO + CS, nhanh
I2C:   SDA / SCL dùng chung  nhiều slave, mỗi cái địa chỉ 7-bit
ADC:   Vin -&gt; N mức       12-bit: count = Vin / Vref * 4095
</code></pre>
<div class="callout"><span class="badge">Chọn thế nào</span> Một thiết bị ở xa, ít dây, đọc được bằng mắt? <strong>UART</strong>. Nhanh, cùng một board, đường ngắn? <strong>SPI</strong>. Nhiều cảm biến nhỏ trên hai dây? <strong>I2C</strong>. Đọc nhiệt độ, ánh sáng hay điện áp pin? <strong>ADC</strong>.</div>`,
  ]]);

const c3q = quiz('ebs311-quiz-3', 'Quiz 3 — Serial buses & ADC|||Quiz 3 — Bus nối tiếp & ADC', [
  { id: 'q1', question: 'Bus nào KHÔNG có dây xung nhịp riêng, hai bên phải thống nhất baud rate?', options: ['SPI', 'I2C', 'UART', 'CAN'], correctIndex: 2, explanation: 'UART bất đồng bộ, không có clock; đồng bộ nhờ baud rate hai bên khớp.' },
  { id: 'q2', question: 'Ưu điểm chính của I2C so với SPI là?', options: ['Nhanh hơn nhiều', 'Chỉ 2 dây dùng chung cho nhiều thiết bị, mỗi cái một địa chỉ', 'Không cần địa chỉ', 'Truyền được xa hàng km'], correctIndex: 1, explanation: 'I2C chỉ SDA+SCL cho nhiều slave, mỗi slave có địa chỉ 7-bit — tiết kiệm dây.' },
  { id: 'q3', question: 'ADC 12-bit đọc được bao nhiêu mức giá trị?', options: ['12 mức', '256 mức', '1024 mức', '4096 mức (0..4095)'], correctIndex: 3, explanation: '12-bit = 2^12 = 4096 mức, đánh số từ 0 đến 4095.' },
]);

const c4 = doc('ebs311-4-1-rtos', '4.1 — RTOS: tasks, scheduling & synchronization|||4.1 — RTOS: task, lập lịch & đồng bộ',
  'Vì sao cần RTOS; task & trạng thái; lập lịch ưu tiên preemptive; đồng bộ (semaphore, mutex, queue); đảo ưu tiên; FreeRTOS API cơ bản.',
  [[
    `<span class="eyebrow">EBS311 · Chapter 4 · Lesson 4.1</span>
<h2>RTOS: tasks, scheduling &amp; synchronization</h2>
<p>When a super-loop grows too tangled to meet deadlines, a <strong>Real-Time Operating System</strong> lets you split work into independent <strong>tasks</strong>, each written as if it owns the CPU. The <strong>scheduler</strong> decides who runs.</p>
<h3>Tasks &amp; the scheduler</h3>
<ul>
<li>A task is a function with its own stack; it is <em>Running</em>, <em>Ready</em>, or <em>Blocked</em> (waiting for time, an event, or data).</li>
<li>FreeRTOS is <strong>preemptive &amp; priority-based</strong>: the highest-priority Ready task always runs; a higher-priority task waking up preempts a lower one.</li>
</ul>
<h3>Synchronization</h3>
<ul>
<li><strong>Queue</strong> — pass data safely between tasks (or from an ISR).</li>
<li><strong>Semaphore</strong> — signal that an event happened, or count a resource.</li>
<li><strong>Mutex</strong> — guard a shared resource; supports <strong>priority inheritance</strong> to fight <strong>priority inversion</strong> (a low task holding a lock a high task needs).</li>
</ul>
<pre><code>void vSensorTask(void *pv)
{
    for (;;) {
        int reading = adc_read();
        xQueueSend(xReadings, &amp;reading, portMAX_DELAY);
        vTaskDelay(pdMS_TO_TICKS(100));   /* Blocked: yields the CPU */
    }
}

xTaskCreate(vSensorTask, "sensor", 256, NULL, 2, NULL);
vTaskStartScheduler();
</code></pre>
<div class="callout"><span class="badge">Deadline, not speed</span> "Real-time" means <em>predictable</em>, not fast. A slow system that always meets its deadline beats a fast one that sometimes misses.</div>`,
    `<span class="eyebrow">EBS311 · Chương 4 · Bài 4.1</span>
<h2>RTOS: task, lập lịch &amp; đồng bộ</h2>
<p>Khi một super-loop rối tới mức không kịp hạn chót, một <strong>Hệ điều hành thời gian thực</strong> cho phép chia việc thành các <strong>task</strong> độc lập, mỗi task viết như thể sở hữu cả CPU. <strong>Bộ lập lịch</strong> quyết định ai chạy.</p>
<h3>Task &amp; bộ lập lịch</h3>
<ul>
<li>Một task là hàm có stack riêng; nó ở trạng thái <em>Running</em>, <em>Ready</em>, hoặc <em>Blocked</em> (chờ thời gian, sự kiện, hoặc dữ liệu).</li>
<li>FreeRTOS <strong>preemptive &amp; theo ưu tiên</strong>: task Ready ưu tiên cao nhất luôn chạy; một task ưu tiên cao thức dậy sẽ chen ngang task thấp hơn.</li>
</ul>
<h3>Đồng bộ</h3>
<ul>
<li><strong>Queue (hàng đợi)</strong> — chuyển dữ liệu an toàn giữa các task (hoặc từ ISR).</li>
<li><strong>Semaphore</strong> — báo một sự kiện đã xảy ra, hoặc đếm tài nguyên.</li>
<li><strong>Mutex</strong> — canh gác tài nguyên dùng chung; hỗ trợ <strong>kế thừa ưu tiên</strong> để chống <strong>đảo ưu tiên</strong> (task thấp giữ khoá mà task cao cần).</li>
</ul>
<pre><code>void vSensorTask(void *pv)
{
    for (;;) {
        int reading = adc_read();
        xQueueSend(xReadings, &amp;reading, portMAX_DELAY);
        vTaskDelay(pdMS_TO_TICKS(100));   /* Blocked: nhường CPU */
    }
}

xTaskCreate(vSensorTask, "sensor", 256, NULL, 2, NULL);
vTaskStartScheduler();
</code></pre>
<div class="callout"><span class="badge">Hạn chót, không phải tốc độ</span> "Thời gian thực" nghĩa là <em>đoán trước được</em>, không phải nhanh. Hệ chậm mà luôn kịp hạn chót hơn hệ nhanh mà thỉnh thoảng trễ.</div>`,
  ]]);

const c4q = quiz('ebs311-quiz-4', 'Quiz 4 — RTOS|||Quiz 4 — RTOS', [
  { id: 'q1', question: 'Lập lịch preemptive theo ưu tiên trong FreeRTOS nghĩa là?', options: ['Task chạy theo thứ tự tạo ra', 'Task Ready có ưu tiên cao nhất luôn được chạy, chen ngang task thấp hơn', 'Mỗi task chạy đúng 1ms rồi đổi', 'Chỉ một task duy nhất chạy mãi'], correctIndex: 1, explanation: 'Preemptive priority-based: task ưu tiên cao nhất ở trạng thái Ready giành CPU.' },
  { id: 'q2', question: 'Cơ chế nào dùng để chuyển dữ liệu an toàn giữa hai task?', options: ['Biến toàn cục không khoá', 'Queue (hàng đợi)', 'vTaskDelay', 'GPIO'], correctIndex: 1, explanation: 'Queue truyền dữ liệu an toàn giữa các task và cả từ ISR.' },
  { id: 'q3', question: 'Mutex hỗ trợ "kế thừa ưu tiên" để chống hiện tượng gì?', options: ['Tràn stack', 'Đảo ưu tiên (priority inversion)', 'Rò rỉ bộ nhớ', 'Nhiễu ADC'], correctIndex: 1, explanation: 'Đảo ưu tiên: task thấp giữ khoá mà task cao cần; kế thừa ưu tiên nâng tạm task thấp lên.' },
]);

const c5 = doc('ebs311-5-1-memory-power', '5.1 — Memory management & real-time low-power|||5.1 — Quản lý bộ nhớ & tối ưu năng lượng',
  'Flash vs SRAM, stack vs heap, vì sao tránh malloc động; tràn stack; xác định thời gian; chế độ ngủ (sleep/stop/standby), đánh thức, đo dòng.',
  [[
    `<span class="eyebrow">EBS311 · Chapter 5 · Lesson 5.1</span>
<h2>Memory management &amp; low-power design</h2>
<h3>Where your bytes live</h3>
<ul>
<li><strong>Flash</strong> — non-volatile, holds code and constants; survives power-off.</li>
<li><strong>SRAM</strong> — fast, volatile; holds <strong>stack</strong> (locals, call frames) and <strong>heap</strong> (dynamic).</li>
<li>The stack grows toward the heap; a <strong>stack overflow</strong> silently corrupts data — a classic, hard bug.</li>
</ul>
<h3>Avoid dynamic allocation</h3>
<p>Long-running firmware usually avoids <code>malloc</code>/<code>free</code>: they cause <strong>fragmentation</strong> and unpredictable timing. Prefer static buffers and fixed pools, so memory use is known at build time and bounded.</p>
<h3>Low-power modes</h3>
<p>Battery devices spend most time asleep. Typical modes trade wake-up speed for current:</p>
<pre><code>Run     : CPU + peripherals on        highest current
Sleep   : CPU stopped, peripherals on wakes fast (any interrupt)
Stop    : clocks off, RAM retained    wakes slower, tiny current
Standby : almost everything off       lowest current, slow cold-ish wake
</code></pre>
<p>The pattern: <strong>wake on interrupt, do the work fast, sleep again</strong>. Average current — not peak — sets battery life.</p>
<div class="callout"><span class="badge">Measure, don't guess</span> Duty cycle dominates: a chip that is awake 1&nbsp;ms every second at 10&nbsp;mA and sleeps at 2&nbsp;uA averages microamps. Verify with a current meter, not the datasheet alone.</div>`,
    `<span class="eyebrow">EBS311 · Chương 5 · Bài 5.1</span>
<h2>Quản lý bộ nhớ &amp; tối ưu năng lượng</h2>
<h3>Byte của bạn nằm ở đâu</h3>
<ul>
<li><strong>Flash</strong> — bất biến, chứa mã và hằng số; còn khi mất điện.</li>
<li><strong>SRAM</strong> — nhanh, bay hơi; chứa <strong>stack</strong> (biến cục bộ, khung gọi hàm) và <strong>heap</strong> (cấp phát động).</li>
<li>Stack lớn dần về phía heap; <strong>tràn stack</strong> âm thầm phá dữ liệu — một lỗi kinh điển, khó tìm.</li>
</ul>
<h3>Tránh cấp phát động</h3>
<p>Firmware chạy dài thường tránh <code>malloc</code>/<code>free</code>: chúng gây <strong>phân mảnh</strong> và thời gian khó đoán. Nên dùng buffer tĩnh và pool cố định, để lượng bộ nhớ biết trước lúc build và có chặn trên.</p>
<h3>Các chế độ tiết kiệm năng lượng</h3>
<p>Thiết bị pin dành phần lớn thời gian để ngủ. Các chế độ điển hình đánh đổi tốc độ đánh thức lấy dòng tiêu thụ:</p>
<pre><code>Run     : CPU + ngoại vi bật        dòng cao nhất
Sleep   : CPU dừng, ngoại vi chạy   thức nhanh (ngắt bất kỳ)
Stop    : tắt xung, giữ RAM         thức chậm hơn, dòng rất nhỏ
Standby : tắt gần hết               dòng thấp nhất, thức chậm
</code></pre>
<p>Mẫu hình: <strong>thức khi có ngắt, làm việc thật nhanh, ngủ lại</strong>. Dòng trung bình — không phải đỉnh — quyết định tuổi thọ pin.</p>
<div class="callout"><span class="badge">Đo, đừng đoán</span> Chu kỳ làm việc là chính: chip thức 1&nbsp;ms mỗi giây ở 10&nbsp;mA rồi ngủ ở 2&nbsp;uA có dòng trung bình cỡ microampe. Kiểm bằng đồng hồ đo dòng, đừng chỉ tin datasheet.</div>`,
  ]]);

const c5q = quiz('ebs311-quiz-5', 'Quiz 5 — Memory & power|||Quiz 5 — Bộ nhớ & năng lượng', [
  { id: 'q1', question: 'Vì sao firmware chạy dài thường tránh malloc/free động?', options: ['Vì C không có malloc', 'Vì gây phân mảnh bộ nhớ và thời gian khó đoán', 'Vì malloc chỉ chạy trên Flash', 'Vì heap nhanh hơn stack'], correctIndex: 1, explanation: 'Cấp phát động gây phân mảnh và timing không xác định; nhúng ưa buffer tĩnh/pool cố định.' },
  { id: 'q2', question: 'Yếu tố nào quyết định tuổi thọ pin của thiết bị nhúng?', options: ['Dòng đỉnh lúc chạy', 'Dòng trung bình (theo chu kỳ thức/ngủ)', 'Dung lượng Flash', 'Số chân GPIO'], correctIndex: 1, explanation: 'Average current theo duty cycle mới quyết định, không phải dòng đỉnh.' },
  { id: 'q3', question: 'Bộ nhớ nào giữ được nội dung khi mất điện, chứa mã chương trình?', options: ['SRAM', 'Stack', 'Flash', 'Heap'], correctIndex: 2, explanation: 'Flash bất biến (non-volatile) chứa mã và hằng; SRAM bay hơi khi mất điện.' },
]);

const c6 = doc('ebs311-6-1-drivers-hal', '6.1 — Device drivers & the HAL|||6.1 — Trình điều khiển thiết bị & HAL',
  'Vai trò của driver; phân lớp (thanh ghi → HAL → ứng dụng); giao diện driver (init/read/write); truyền dữ liệu polling/interrupt/DMA; tính khả chuyển.',
  [[
    `<span class="eyebrow">EBS311 · Chapter 6 · Lesson 6.1</span>
<h2>Device drivers &amp; the HAL</h2>
<p>A <strong>device driver</strong> is the software that hides a peripheral's register details behind a clean API. A <strong>HAL</strong> (Hardware Abstraction Layer) is the layer of drivers that lets application code stay the same when the chip changes.</p>
<h3>Layering</h3>
<pre><code>Application     "read the temperature"
   |
HAL / driver    temp_sensor_read()  -> i2c_read(addr, reg, buf, n)
   |
Register access *I2C1_DR, *I2C1_SR1 ... (the metal)
</code></pre>
<h3>A clean driver interface</h3>
<p>Most drivers expose the same shape: <strong>init</strong>, <strong>read</strong>, <strong>write</strong>, and often a <strong>callback</strong> for completion. Keep hardware specifics inside; expose only what the application needs.</p>
<pre><code>typedef struct {
    int  (*init)(void);
    int  (*read)(uint8_t *buf, uint32_t len);
    int  (*write)(const uint8_t *buf, uint32_t len);
} uart_driver_t;
</code></pre>
<h3>How data moves</h3>
<ul>
<li><strong>Polling</strong> — simplest, but the CPU waits.</li>
<li><strong>Interrupt-driven</strong> — the CPU is free until a byte arrives.</li>
<li><strong>DMA</strong> — the DMA engine moves a whole buffer with no CPU per byte; best for high throughput.</li>
</ul>
<div class="callout"><span class="badge">Portability</span> Program to the driver interface, not the registers. Swap the HAL and the same application runs on a new MCU — the whole reason vendors ship a HAL such as STM32Cube.</div>`,
    `<span class="eyebrow">EBS311 · Chương 6 · Bài 6.1</span>
<h2>Trình điều khiển thiết bị &amp; HAL</h2>
<p>Một <strong>driver (trình điều khiển)</strong> là phần mềm giấu chi tiết thanh ghi của ngoại vi sau một API gọn. Một <strong>HAL</strong> (Lớp trừu tượng phần cứng) là tầng driver giúp mã ứng dụng không đổi khi thay chip.</p>
<h3>Phân lớp</h3>
<pre><code>Ứng dụng        "đọc nhiệt độ"
   |
HAL / driver    temp_sensor_read()  -&gt; i2c_read(addr, reg, buf, n)
   |
Thanh ghi       *I2C1_DR, *I2C1_SR1 ... (mức "kim loại")
</code></pre>
<h3>Giao diện driver gọn gàng</h3>
<p>Đa số driver có cùng hình dạng: <strong>init</strong>, <strong>read</strong>, <strong>write</strong>, và thường thêm <strong>callback</strong> báo hoàn tất. Giấu đặc thù phần cứng bên trong; chỉ phơi ra thứ ứng dụng cần.</p>
<pre><code>typedef struct {
    int  (*init)(void);
    int  (*read)(uint8_t *buf, uint32_t len);
    int  (*write)(const uint8_t *buf, uint32_t len);
} uart_driver_t;
</code></pre>
<h3>Dữ liệu di chuyển thế nào</h3>
<ul>
<li><strong>Polling</strong> — đơn giản nhất, nhưng CPU phải chờ.</li>
<li><strong>Dùng ngắt</strong> — CPU rảnh cho tới khi có byte tới.</li>
<li><strong>DMA</strong> — bộ máy DMA chuyển cả buffer mà CPU không phải lo từng byte; tốt cho lưu lượng cao.</li>
</ul>
<div class="callout"><span class="badge">Tính khả chuyển</span> Lập trình theo giao diện driver, không theo thanh ghi. Thay HAL là cùng một ứng dụng chạy trên MCU mới — đúng lý do các hãng phát hành HAL như STM32Cube.</div>`,
  ]]);

const c6q = quiz('ebs311-quiz-6', 'Quiz 6 — Drivers & HAL|||Quiz 6 — Driver & HAL', [
  { id: 'q1', question: 'Mục đích chính của một HAL (Hardware Abstraction Layer) là?', options: ['Tăng xung nhịp CPU', 'Giúp mã ứng dụng không đổi khi thay chip, nhờ giấu chi tiết thanh ghi', 'Thay thế trình biên dịch', 'Xoá bỏ nhu cầu dùng driver'], correctIndex: 1, explanation: 'HAL trừu tượng phần cứng: ứng dụng gọi API chung, đổi chip chỉ đổi HAL.' },
  { id: 'q2', question: 'Cách truyền dữ liệu nào để CPU KHÔNG phải xử lý từng byte, hợp lưu lượng cao?', options: ['Polling', 'DMA', 'Vòng lặp busy-wait', 'Đọc thanh ghi thủ công'], correctIndex: 1, explanation: 'DMA chuyển cả buffer bằng phần cứng, giải phóng CPU khỏi từng byte.' },
  { id: 'q3', question: 'Một giao diện driver gọn thường phơi ra các hàm nào?', options: ['Chỉ main()', 'init / read / write (và có thể callback hoàn tất)', 'malloc / free', 'Các thanh ghi thô cho ứng dụng dùng trực tiếp'], correctIndex: 1, explanation: 'Driver chuẩn: init, read, write, thường kèm callback; giấu thanh ghi bên trong.' },
]);

const c7 = doc('ebs311-7-1-debug-trace-test', '7.1 — Debugging, trace & testing|||7.1 — Gỡ lỗi, trace & kiểm thử',
  'SWD/JTAG & GDB breakpoint; printf qua UART/ITM; SWV/ITM trace, watchpoint; watchdog; kiểm thử unit trên host, HIL; lỗi phổ biến (Hard Fault).',
  [[
    `<span class="eyebrow">EBS311 · Chapter 7 · Lesson 7.1</span>
<h2>Debugging, trace &amp; testing</h2>
<h3>On-chip debug</h3>
<p>A debug probe connects to the MCU over <strong>SWD</strong> (2 pins) or JTAG and speaks to <strong>GDB</strong>. You can set <strong>breakpoints</strong>, single-step, inspect memory and registers, and set a <strong>watchpoint</strong> that halts when a variable changes.</p>
<h3>Getting information out</h3>
<ul>
<li><strong>printf over UART</strong> — cheap and universal.</li>
<li><strong>ITM / SWO trace</strong> — a dedicated trace pin prints without stopping the core, so timing is barely disturbed — vital for real-time bugs a breakpoint would hide.</li>
</ul>
<h3>When it crashes</h3>
<p>A bad pointer or misaligned access triggers a <strong>Hard Fault</strong>. Read the stacked registers in the fault handler to find the offending PC. A <strong>watchdog</strong> timer resets a hung system if the code stops "petting" it — a last line of defence.</p>
<h3>Testing</h3>
<ul>
<li><strong>Unit tests on the host</strong> — compile the logic for your PC and test it fast, away from hardware.</li>
<li><strong>Hardware-in-the-loop (HIL)</strong> — run the real firmware against simulated inputs to test timing and I/O.</li>
</ul>
<pre><code>/* A watchdog must be fed, or it resets the MCU. */
for (;;) {
    do_work();
    watchdog_refresh();   /* miss this -&gt; reset (recovers a hang) */
}
</code></pre>
<div class="callout"><span class="badge">Heisenbug warning</span> A breakpoint stops time; a race or timing bug can vanish while you watch it. Prefer non-intrusive <strong>trace</strong> for real-time faults.</div>`,
    `<span class="eyebrow">EBS311 · Chương 7 · Bài 7.1</span>
<h2>Gỡ lỗi, trace &amp; kiểm thử</h2>
<h3>Gỡ lỗi trên chip</h3>
<p>Mạch nạp/gỡ lỗi nối với MCU qua <strong>SWD</strong> (2 chân) hoặc JTAG và nói chuyện với <strong>GDB</strong>. Bạn đặt được <strong>breakpoint</strong>, chạy từng bước, xem bộ nhớ và thanh ghi, và đặt <strong>watchpoint</strong> để dừng khi một biến thay đổi.</p>
<h3>Lấy thông tin ra ngoài</h3>
<ul>
<li><strong>printf qua UART</strong> — rẻ và phổ biến.</li>
<li><strong>Trace ITM / SWO</strong> — một chân trace riêng in ra mà không dừng lõi, nên gần như không xáo trộn định thời — thiết yếu cho lỗi thời gian thực mà breakpoint sẽ che mất.</li>
</ul>
<h3>Khi nó sập</h3>
<p>Con trỏ hỏng hoặc truy cập lệch địa chỉ gây <strong>Hard Fault</strong>. Đọc các thanh ghi đã xếp trong fault handler để tìm PC gây lỗi. Một <strong>watchdog</strong> sẽ reset hệ treo nếu mã ngừng "vỗ về" nó — hàng phòng thủ cuối.</p>
<h3>Kiểm thử</h3>
<ul>
<li><strong>Unit test trên host</strong> — biên dịch phần logic cho PC và test nhanh, tách khỏi phần cứng.</li>
<li><strong>Hardware-in-the-loop (HIL)</strong> — chạy firmware thật với đầu vào mô phỏng để kiểm định thời và vào/ra.</li>
</ul>
<pre><code>/* Watchdog phải được "cho ăn", nếu không nó reset MCU. */
for (;;) {
    do_work();
    watchdog_refresh();   /* bỏ lỡ -&gt; reset (cứu khi treo) */
}
</code></pre>
<div class="callout"><span class="badge">Cảnh báo Heisenbug</span> Breakpoint làm dừng thời gian; một lỗi đua/định thời có thể biến mất khi bạn nhìn vào. Ưu tiên <strong>trace</strong> không xâm lấn cho lỗi thời gian thực.</div>`,
  ]]);

const c7q = quiz('ebs311-quiz-7', 'Quiz 7 — Debug, trace & test|||Quiz 7 — Gỡ lỗi, trace & kiểm thử', [
  { id: 'q1', question: 'Vì sao ITM/SWO trace hữu ích hơn breakpoint cho lỗi thời gian thực?', options: ['Vì nó dừng CPU lâu hơn', 'Vì nó in ra mà gần như không dừng lõi, ít xáo trộn định thời', 'Vì nó không cần chân nào', 'Vì nó thay thế được GDB'], correctIndex: 1, explanation: 'Trace không xâm lấn: lõi vẫn chạy nên lỗi đua/định thời không bị che như khi đặt breakpoint.' },
  { id: 'q2', question: 'Vai trò của watchdog timer là?', options: ['Tăng tốc CPU', 'Reset hệ thống nếu mã ngừng "cho ăn" nó (bị treo)', 'Đo nhiệt độ chip', 'Cấp phát bộ nhớ'], correctIndex: 1, explanation: 'Watchdog phải được refresh định kỳ; treo là bỏ lỡ, nó reset để phục hồi.' },
  { id: 'q3', question: 'Truy cập con trỏ hỏng hoặc lệch địa chỉ trên Cortex-M thường gây ra?', options: ['Cảnh báo biên dịch', 'Hard Fault (ngoại lệ)', 'Rò rỉ bộ nhớ chậm', 'Tăng dòng tiêu thụ'], correctIndex: 1, explanation: 'Lỗi truy cập bộ nhớ kích hoạt Hard Fault; đọc thanh ghi đã xếp để tìm PC lỗi.' },
]);

const c8 = doc('ebs311-8-1-automotive-safety', '8.1 — Automotive embedded: MISRA C, AUTOSAR, ISO 26262|||8.1 — Hệ nhúng ô tô: MISRA C, AUTOSAR, ISO 26262',
  'Vì sao ô tô khác; MISRA C (tập con C an toàn); AUTOSAR (kiến trúc phần mềm chuẩn); ISO 26262 & ASIL (an toàn chức năng); bus CAN.',
  [[
    `<span class="eyebrow">EBS311 · Chapter 8 · Lesson 8.1</span>
<h2>Automotive embedded &amp; functional safety</h2>
<p>A car has dozens of <strong>ECUs</strong> (electronic control units) whose failure can hurt people. So automotive firmware follows strict standards on coding, architecture and safety.</p>
<h3>MISRA C — a safer subset of C</h3>
<p>C is powerful but easy to misuse. <strong>MISRA C</strong> is a set of rules banning risky constructs (implicit conversions, undefined behavior, uncontrolled pointer tricks) so code is analysable and portable. Static-analysis tools check compliance.</p>
<h3>AUTOSAR — standard software architecture</h3>
<p><strong>AUTOSAR</strong> layers ECU software so application components sit above a standardized <strong>Basic Software</strong> (drivers, communication, OS) via the <strong>RTE</strong>. Suppliers can reuse and integrate components across carmakers.</p>
<h3>ISO 26262 &amp; ASIL</h3>
<p><strong>ISO 26262</strong> is the road-vehicle functional-safety standard. It rates each function's risk as <strong>ASIL A to D</strong> (D = highest, e.g. steering/braking) and demands matching rigor — requirements, reviews, testing and traceability.</p>
<h3>The CAN bus</h3>
<p>ECUs talk over the <strong>CAN</strong> bus: a robust, multi-master, message-based network. Each message has an ID that also sets its priority; a two-wire differential pair resists electrical noise in a car.</p>
<pre><code>typedef struct {
    uint32_t id;        /* message id / priority   */
    uint8_t  dlc;       /* data length (0..8)      */
    uint8_t  data[8];   /* payload bytes           */
} CanFrame;
</code></pre>
<div class="callout"><span class="badge">Safety is a process</span> ISO 26262 is not a library you link — it is discipline across the whole lifecycle: hazard analysis, redundancy, reviews, and evidence that each safety goal is met.</div>`,
    `<span class="eyebrow">EBS311 · Chương 8 · Bài 8.1</span>
<h2>Hệ nhúng ô tô &amp; an toàn chức năng</h2>
<p>Một chiếc xe có hàng chục <strong>ECU</strong> (bộ điều khiển điện tử) mà hỏng hóc có thể gây thương tích. Vì thế firmware ô tô tuân theo các chuẩn nghiêm ngặt về viết mã, kiến trúc và an toàn.</p>
<h3>MISRA C — tập con C an toàn hơn</h3>
<p>C mạnh nhưng dễ dùng sai. <strong>MISRA C</strong> là bộ quy tắc cấm các cấu trúc rủi ro (ép kiểu ngầm, hành vi không xác định, mánh con trỏ khó kiểm) để mã phân tích được và khả chuyển. Công cụ phân tích tĩnh kiểm tra tuân thủ.</p>
<h3>AUTOSAR — kiến trúc phần mềm chuẩn</h3>
<p><strong>AUTOSAR</strong> phân lớp phần mềm ECU sao cho các thành phần ứng dụng nằm trên một <strong>Basic Software</strong> chuẩn hoá (driver, truyền thông, OS) qua <strong>RTE</strong>. Nhà cung cấp tái dùng và tích hợp thành phần giữa các hãng xe.</p>
<h3>ISO 26262 &amp; ASIL</h3>
<p><strong>ISO 26262</strong> là chuẩn an toàn chức năng cho xe đường bộ. Nó xếp rủi ro mỗi chức năng theo <strong>ASIL A đến D</strong> (D cao nhất, vd lái/phanh) và đòi mức chặt chẽ tương ứng — yêu cầu, rà soát, kiểm thử và truy vết.</p>
<h3>Bus CAN</h3>
<p>Các ECU nói chuyện qua bus <strong>CAN</strong>: một mạng bền, nhiều chủ, dựa trên thông điệp. Mỗi thông điệp có một ID cũng là mức ưu tiên; cặp dây vi sai chống nhiễu điện trong xe.</p>
<pre><code>typedef struct {
    uint32_t id;        /* id thông điệp / ưu tiên */
    uint8_t  dlc;       /* độ dài dữ liệu (0..8)   */
    uint8_t  data[8];   /* các byte tải            */
} CanFrame;
</code></pre>
<div class="callout"><span class="badge">An toàn là một quy trình</span> ISO 26262 không phải thư viện để link — nó là kỷ luật xuyên suốt vòng đời: phân tích hiểm hoạ, dự phòng, rà soát, và bằng chứng mỗi mục tiêu an toàn đã đạt.</div>`,
  ]]);

const c8q = quiz('ebs311-quiz-8', 'Quiz 8 — Automotive & safety|||Quiz 8 — Ô tô & an toàn', [
  { id: 'q1', question: 'MISRA C là gì?', options: ['Một trình biên dịch C mới', 'Một bộ quy tắc giới hạn C vào tập con an toàn, phân tích được', 'Một hệ điều hành ô tô', 'Một loại bus truyền thông'], correctIndex: 1, explanation: 'MISRA C cấm các cấu trúc rủi ro của C để mã an toàn, khả chuyển, phân tích tĩnh được.' },
  { id: 'q2', question: 'Trong ISO 26262, mức ASIL nào có yêu cầu an toàn nghiêm ngặt nhất?', options: ['ASIL A', 'ASIL B', 'ASIL C', 'ASIL D'], correctIndex: 3, explanation: 'ASIL D là mức rủi ro cao nhất (vd lái, phanh), đòi mức chặt chẽ cao nhất.' },
  { id: 'q3', question: 'Đặc điểm của bus CAN dùng trong ô tô là?', options: ['Một chủ duy nhất, dây đơn', 'Nhiều chủ, dựa trên thông điệp có ID kiêm ưu tiên, cặp dây vi sai chống nhiễu', 'Chỉ nối được 2 thiết bị', 'Không có cơ chế ưu tiên'], correctIndex: 1, explanation: 'CAN: multi-master, thông điệp có ID định ưu tiên, cặp vi sai chống nhiễu trong xe.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'EBS311',
    slug: 'ebs311-advanced-embedded-systems',
    title: 'Advanced Embedded Systems',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/EBS311.webp',
    shortDescription: 'ARM Cortex-M, interrupts/timers/GPIO, serial buses (UART/SPI/I2C/ADC), FreeRTOS, memory & low-power, drivers/HAL, debug/trace/test, automotive (MISRA C, AUTOSAR, ISO 26262). Bilingual with C examples.|||ARM Cortex-M, ngắt/timer/GPIO, bus nối tiếp (UART/SPI/I2C/ADC), FreeRTOS, bộ nhớ & tiết kiệm năng lượng, driver/HAL, gỡ lỗi/trace/kiểm thử, ô tô (MISRA C, AUTOSAR, ISO 26262). Song ngữ, ví dụ C.',
    description: 'Môn <strong>EBS311 — Advanced Embedded Systems</strong> (Hệ thống nhúng nâng cao, kỳ 4, ngành Kỹ thuật phần mềm ô tô) đi từ <strong>kiến trúc ARM Cortex-M &amp; bộ nhớ</strong> → <strong>ngắt, timer &amp; GPIO</strong> → <strong>ngoại vi nối tiếp</strong> (UART/SPI/I2C/ADC) → <strong>RTOS</strong> (task, lập lịch, đồng bộ với FreeRTOS) → <strong>quản lý bộ nhớ &amp; tiết kiệm năng lượng</strong> → <strong>driver &amp; HAL</strong> → <strong>gỡ lỗi, trace &amp; kiểm thử</strong> → <strong>hệ nhúng ô tô</strong> (MISRA C, AUTOSAR, ISO 26262). Song ngữ, có ví dụ C / FreeRTOS và quiz mỗi chương. Bám giáo trình: White, Yiu, Simon, Lee &amp; Seshia, tài liệu FreeRTOS.',
    whatYouLearn: 'Kiến trúc load/store Cortex-M, bản đồ bộ nhớ &amp; bảng vector, CMSIS; GPIO, ngắt &amp; NVIC, timer/PWM; UART/SPI/I2C và ADC; FreeRTOS (task, lập lịch preemptive, queue/semaphore/mutex, chống đảo ưu tiên); Flash vs SRAM, tránh cấp phát động, các chế độ ngủ &amp; dòng trung bình; driver &amp; HAL, polling/interrupt/DMA; SWD/GDB, trace ITM/SWO, watchdog, unit test &amp; HIL; MISRA C, AUTOSAR, ISO 26262/ASIL và bus CAN.',
    requirements: 'Biết lập trình C và kiến thức hệ thống máy tính cơ bản. Nên có kit ARM Cortex-M (vd STM32) và bộ công cụ arm-none-eabi-gcc + OpenOCD/GDB, hoặc STM32CubeIDE.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách nền tảng, tài liệu ARM/FreeRTOS, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Hệ nhúng là gì, ràng buộc thời gian thực & tài nguyên, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Kiến trúc Cortex-M & bộ nhớ|||Chapter 1 — Cortex-M architecture & memory', description: 'Lõi Cortex-M, load/store, bản đồ bộ nhớ, bảng vector, CMSIS.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Ngắt, timer, GPIO|||Chapter 2 — Interrupts, timers, GPIO', description: 'GPIO, ngắt & NVIC, timer/PWM, polling vs interrupt.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Ngoại vi nối tiếp|||Chapter 3 — Serial peripherals', description: 'UART, SPI, I2C và ADC — chọn bus nào cho việc gì.', lessons: [c3, c3q] },
    { title: 'Chương 4 — RTOS|||Chapter 4 — RTOS', description: 'Task, lập lịch preemptive, queue/semaphore/mutex, FreeRTOS.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Bộ nhớ & năng lượng|||Chapter 5 — Memory & power', description: 'Flash/SRAM, tránh malloc, chế độ ngủ, dòng trung bình.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Driver & HAL|||Chapter 6 — Drivers & HAL', description: 'Phân lớp, giao diện driver, polling/interrupt/DMA, khả chuyển.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Gỡ lỗi, trace & kiểm thử|||Chapter 7 — Debug, trace & test', description: 'SWD/GDB, trace ITM/SWO, watchdog, unit test & HIL.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Hệ nhúng ô tô|||Chapter 8 — Automotive embedded', description: 'MISRA C, AUTOSAR, ISO 26262/ASIL, bus CAN.', lessons: [c8, c8q] },
  ],
};
