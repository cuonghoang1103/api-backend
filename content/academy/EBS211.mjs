/**
 * EBS211 — Embedded Systems (Hệ thống nhúng). Ngành Kỹ thuật phần mềm ô tô
 * FPTU, Kỳ 3. Khung chất lượng: 8 chương, song ngữ VI+EN, mỗi chương 1 DOCUMENT
 * (khái niệm + cơ chế + khối pre-code C minh hoạ) + 1 QUIZ 3 câu.
 * Giáo trình chuẩn: Elecia White "Making Embedded Systems"; Marilyn Wolf
 * "Computers as Components"; Lee & Seshia "Introduction to Embedded Systems";
 * FreeRTOS docs. Giữ NGUYÊN slug/semester/courseCode/thumb(v3).
 * ⚠️ KHÔNG backtick lồng / ${...} trong HTML. Trong content: & -> &amp;,
 *    < -> &lt;, > -> &gt;. "\n" thật -> \\n. shortDescription dùng & thường.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('ebs211-0-1-overview', 'Course overview: Embedded Systems|||Tổng quan: Hệ thống nhúng',
  'Hệ thống nhúng là gì; thời gian thực & ràng buộc tài nguyên; lộ trình 4 bước: phần cứng MCU -> lập trình C bare-metal -> ngoại vi & ngắt -> RTOS, năng lượng & ứng dụng ô tô/IoT.',
  [[
    `<span class="eyebrow">EBS211 · Lesson 0.1 · Overview</span>
<h2>Embedded Systems</h2>
<p class="lead">An <strong>embedded system</strong> is a computer built into a larger product to do <em>one job well</em> — a washing machine controller, an engine ECU, a smartwatch. You program it in <strong>C</strong> close to the hardware, under tight limits on memory, power and timing. This course takes you from the silicon up to a real-time operating system and automotive/IoT applications.</p>
<h3>What makes it different from a PC</h3>
<ul>
<li><strong>Dedicated</strong> — runs a fixed application, not arbitrary software.</li>
<li><strong>Real-time</strong> — the answer must arrive <em>on time</em>, not just eventually.</li>
<li><strong>Resource-constrained</strong> — kilobytes of RAM, milliwatts of power, no OS by default.</li>
<li><strong>Reactive</strong> — it continuously reads sensors and drives actuators in a loop.</li>
</ul>
<h3>Roadmap (4 steps)</h3>
<p>MCU/SoC hardware &amp; memory → embedded C, toolchain &amp; bare-metal → peripherals (GPIO/timer/PWM/ADC, UART/SPI/I2C/CAN), interrupts &amp; real-time → RTOS (FreeRTOS), power, reliability &amp; automotive/IoT. Bilingual, with C code examples and a quiz per chapter.</p>`,
    `<span class="eyebrow">EBS211 · Bài 0.1 · Tổng quan</span>
<h2>Hệ thống nhúng</h2>
<p class="lead">Một <strong>hệ thống nhúng</strong> là máy tính đặt bên trong một sản phẩm lớn hơn để làm <em>tốt một việc</em> — bộ điều khiển máy giặt, ECU động cơ, đồng hồ thông minh. Bạn lập trình nó bằng <strong>C</strong> sát phần cứng, dưới giới hạn ngặt về bộ nhớ, năng lượng và thời gian. Môn này đưa bạn đi từ con chip lên tới hệ điều hành thời gian thực và ứng dụng ô tô/IoT.</p>
<h3>Khác PC ở đâu</h3>
<ul>
<li><strong>Chuyên dụng</strong> — chạy một ứng dụng cố định, không phải phần mềm tuỳ ý.</li>
<li><strong>Thời gian thực</strong> — câu trả lời phải đến <em>đúng hạn</em>, không chỉ là cuối cùng có.</li>
<li><strong>Ràng buộc tài nguyên</strong> — vài kilobyte RAM, vài milliwatt điện, mặc định không có OS.</li>
<li><strong>Phản ứng</strong> — liên tục đọc cảm biến và điều khiển cơ cấu chấp hành trong một vòng lặp.</li>
</ul>
<h3>Lộ trình (4 bước)</h3>
<p>Phần cứng MCU/SoC &amp; bộ nhớ → embedded C, toolchain &amp; bare-metal → ngoại vi (GPIO/timer/PWM/ADC, UART/SPI/I2C/CAN), ngắt &amp; thời gian thực → RTOS (FreeRTOS), năng lượng, độ tin cậy &amp; ô tô/IoT. Song ngữ, có ví dụ mã C và một quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('ebs211-1-1-what-is-embedded', '1.1 — What is an embedded system|||1.1 — Hệ thống nhúng là gì',
  'Đặc điểm hệ nhúng: chuyên dụng, phản ứng, ràng buộc tài nguyên; thời gian thực hard/soft; vòng lặp cảm biến -> xử lý -> chấp hành; ví dụ ứng dụng.',
  [[
    `<span class="eyebrow">EBS211 · Chapter 1 · Lesson 1.1</span>
<h2>What is an embedded system?</h2>
<p>An embedded system senses the physical world, decides, and acts — over and over. Its defining pressures are <strong>time</strong> and <strong>resources</strong>.</p>
<h3>Real-time: on time is part of correct</h3>
<ul>
<li><strong>Hard real-time</strong> — a missed deadline is a failure (airbag firing, ABS braking, motor commutation).</li>
<li><strong>Soft real-time</strong> — a late result loses value but is not catastrophic (a laggy display, a dropped audio sample).</li>
</ul>
<h3>Resource constraints</h3>
<p>You may have only a few KB of RAM and flash, run on a coin cell for months, and have no operating system. Every byte and every microamp counts, so you count them.</p>
<h3>The reactive loop</h3>
<pre><code>// The heartbeat of most small embedded systems
int main(void) {
    hw_init();                 // clocks, pins, peripherals
    while (1) {                // never returns
        read_sensors();        // sense the world
        update_control();      // decide
        drive_actuators();     // act
    }
}
</code></pre>
<div class="callout"><span class="badge">Examples</span> Engine ECU, ABS controller, pacemaker, drone flight controller, smart thermostat, washing-machine board — all dedicated, reactive, resource-constrained computers.</div>`,
    `<span class="eyebrow">EBS211 · Chương 1 · Bài 1.1</span>
<h2>Hệ thống nhúng là gì?</h2>
<p>Một hệ nhúng cảm nhận thế giới vật lý, quyết định, rồi hành động — lặp đi lặp lại. Hai sức ép định hình nó là <strong>thời gian</strong> và <strong>tài nguyên</strong>.</p>
<h3>Thời gian thực: đúng giờ là một phần của đúng</h3>
<ul>
<li><strong>Hard real-time</strong> — trễ hạn là hỏng (nổ túi khí, phanh ABS, đảo pha động cơ).</li>
<li><strong>Soft real-time</strong> — trễ thì mất giá trị nhưng không thảm hoạ (màn hình giật, rớt một mẫu âm thanh).</li>
</ul>
<h3>Ràng buộc tài nguyên</h3>
<p>Bạn có thể chỉ có vài KB RAM và flash, chạy pin cúc áo hàng tháng, và không có hệ điều hành. Mỗi byte và mỗi microamp đều đáng kể, nên bạn phải đếm chúng.</p>
<h3>Vòng lặp phản ứng</h3>
<pre><code>// Nhịp tim của hầu hết hệ nhúng nhỏ
int main(void) {
    hw_init();                 // clock, chân, ngoại vi
    while (1) {                // không bao giờ trả về
        read_sensors();        // cảm nhận
        update_control();      // quyết định
        drive_actuators();     // hành động
    }
}
</code></pre>
<div class="callout"><span class="badge">Ví dụ</span> ECU động cơ, bộ điều khiển ABS, máy trợ tim, bộ bay của drone, bộ ổn nhiệt thông minh, board máy giặt — đều là máy tính chuyên dụng, phản ứng, ràng buộc tài nguyên.</div>`,
  ]]);

const c1q = quiz('ebs211-quiz-1', 'Quiz 1 — What is embedded|||Quiz 1 — Hệ nhúng là gì', [
  { id: 'q1', question: 'Điểm KHÁC biệt cốt lõi của hệ nhúng so với PC là?', options: ['Chạy mọi phần mềm tuỳ ý', 'Chuyên dụng, phản ứng, ràng buộc tài nguyên & thời gian', 'Luôn có màn hình lớn', 'Luôn chạy Windows'], correctIndex: 1, explanation: 'Hệ nhúng làm một việc cố định, phản ứng liên tục, giới hạn tài nguyên và thời gian.' },
  { id: 'q2', question: 'Hệ "hard real-time" nghĩa là?', options: ['Trễ hạn thì mất chút giá trị', 'Trễ hạn là một lỗi/hỏng', 'Không cần đúng giờ', 'Chỉ chạy khi cắm điện'], correctIndex: 1, explanation: 'Hard real-time: bỏ lỡ deadline coi như thất bại (túi khí, ABS).' },
  { id: 'q3', question: 'Vòng lặp phản ứng điển hình của hệ nhúng nhỏ là?', options: ['Đọc cảm biến -> xử lý -> điều khiển chấp hành, lặp mãi', 'Chạy một lần rồi thoát', 'Chỉ tính toán, không có I/O', 'Đợi người dùng gõ lệnh'], correctIndex: 0, explanation: 'Super-loop: sense -> decide -> act, lặp vô tận trong while(1).' },
]);

const c2 = doc('ebs211-2-1-hardware-architecture', '2.1 — Embedded hardware architecture|||2.1 — Kiến trúc phần cứng nhúng',
  'MCU vs SoC; CPU + flash + RAM + ngoại vi trên một chip; bản đồ bộ nhớ, thanh ghi ánh xạ bộ nhớ (memory-mapped); bus (AHB/APB); ý niệm thiết kế board.',
  [[
    `<span class="eyebrow">EBS211 · Chapter 2 · Lesson 2.1</span>
<h2>Embedded hardware architecture</h2>
<h3>MCU vs SoC</h3>
<ul>
<li><strong>Microcontroller (MCU)</strong> — CPU core + flash + RAM + peripherals on ONE chip (e.g. STM32, AVR). Cheap, low power, boots instantly.</li>
<li><strong>System-on-Chip (SoC)</strong> — a bigger CPU (often runs Linux) plus GPU/radios; used in phones and infotainment.</li>
</ul>
<h3>Memory map &amp; memory-mapped registers</h3>
<p>Everything lives at an address: flash (code), RAM (data), and <strong>peripheral registers</strong>. Writing to a peripheral register address turns hardware on/off — this is how you control a chip in C.</p>
<pre><code>#include &lt;stdint.h&gt;
// A peripheral register is just a fixed address
#define RCC_AHB1ENR (*(volatile uint32_t*)0x40023830)
#define GPIOA_MODER (*(volatile uint32_t*)0x40020000)

RCC_AHB1ENR |= (1u &lt;&lt; 0);      // enable clock for GPIO port A
GPIOA_MODER &amp;= ~(3u &lt;&lt; 10);    // clear mode bits for pin 5
GPIOA_MODER |=  (1u &lt;&lt; 10);    // set pin 5 as output
</code></pre>
<h3>Buses</h3>
<p>Internal buses (e.g. ARM <strong>AHB</strong> fast bus, <strong>APB</strong> peripheral bus) connect the CPU to memory and peripherals. A peripheral is off until you enable its clock on the right bus.</p>
<div class="callout"><span class="badge">Datasheet + reference manual</span> The two documents you live in: the datasheet (pins, electrical limits) and the reference manual (every register address and bit).</div>`,
    `<span class="eyebrow">EBS211 · Chương 2 · Bài 2.1</span>
<h2>Kiến trúc phần cứng nhúng</h2>
<h3>MCU và SoC</h3>
<ul>
<li><strong>Vi điều khiển (MCU)</strong> — lõi CPU + flash + RAM + ngoại vi trên MỘT chip (vd STM32, AVR). Rẻ, ít điện, khởi động tức thì.</li>
<li><strong>SoC (System-on-Chip)</strong> — CPU lớn hơn (thường chạy Linux) kèm GPU/thu phát; dùng trong điện thoại và infotainment.</li>
</ul>
<h3>Bản đồ bộ nhớ &amp; thanh ghi ánh xạ bộ nhớ</h3>
<p>Mọi thứ nằm ở một địa chỉ: flash (mã), RAM (dữ liệu), và <strong>thanh ghi ngoại vi</strong>. Ghi vào địa chỉ thanh ghi ngoại vi là bật/tắt phần cứng — đây là cách bạn điều khiển chip bằng C.</p>
<pre><code>#include &lt;stdint.h&gt;
// Một thanh ghi ngoại vi chỉ là một địa chỉ cố định
#define RCC_AHB1ENR (*(volatile uint32_t*)0x40023830)
#define GPIOA_MODER (*(volatile uint32_t*)0x40020000)

RCC_AHB1ENR |= (1u &lt;&lt; 0);      // bật clock cho cổng GPIO A
GPIOA_MODER &amp;= ~(3u &lt;&lt; 10);    // xoá bit chế độ của chân 5
GPIOA_MODER |=  (1u &lt;&lt; 10);    // đặt chân 5 làm ngõ ra
</code></pre>
<h3>Bus</h3>
<p>Các bus nội bộ (vd <strong>AHB</strong> bus nhanh, <strong>APB</strong> bus ngoại vi của ARM) nối CPU với bộ nhớ và ngoại vi. Một ngoại vi bị tắt cho tới khi bạn bật clock của nó trên đúng bus.</p>
<div class="callout"><span class="badge">Datasheet + reference manual</span> Hai tài liệu bạn sống cùng: datasheet (chân, giới hạn điện) và reference manual (mọi địa chỉ thanh ghi và từng bit).</div>`,
  ]]);

const c2q = quiz('ebs211-quiz-2', 'Quiz 2 — Hardware|||Quiz 2 — Phần cứng', [
  { id: 'q1', question: 'Đặc điểm của một vi điều khiển (MCU) là?', options: ['Chỉ có CPU, không có bộ nhớ', 'CPU + flash + RAM + ngoại vi trên một chip', 'Luôn chạy hệ điều hành Linux', 'Không có ngoại vi'], correctIndex: 1, explanation: 'MCU tích hợp CPU, flash, RAM và ngoại vi trên cùng một chip.' },
  { id: 'q2', question: '"Thanh ghi ánh xạ bộ nhớ" (memory-mapped register) nghĩa là?', options: ['Thanh ghi nằm ở một địa chỉ; ghi vào đó điều khiển phần cứng', 'Một biến trong RAM bình thường', 'Một tệp trên đĩa', 'Bộ nhớ cache của CPU'], correctIndex: 0, explanation: 'Ngoại vi được điều khiển bằng cách đọc/ghi các thanh ghi tại địa chỉ cố định.' },
  { id: 'q3', question: 'Vì sao thường phải "bật clock" cho một ngoại vi trước khi dùng?', options: ['Để tiết kiệm điện, ngoại vi mặc định tắt cho tới khi cấp clock', 'Vì clock làm nóng chip', 'Vì C yêu cầu như vậy', 'Không cần, ngoại vi luôn bật'], correctIndex: 0, explanation: 'Ngoại vi tắt để tiết kiệm điện; phải bật clock trên bus (AHB/APB) mới hoạt động.' },
]);

const c3 = doc('ebs211-3-1-embedded-c-toolchain', '3.1 — Embedded C, toolchain & bare-metal|||3.1 — Lập trình nhúng: embedded C, toolchain, bare-metal',
  'Embedded C: kiểu số cố định (uint8_t), volatile, con trỏ thanh ghi; cross-compile (compile trên PC, chạy trên MCU); toolchain (gcc-arm, linker, flash); bare-metal vs có OS.',
  [[
    `<span class="eyebrow">EBS211 · Chapter 3 · Lesson 3.1</span>
<h2>Embedded C, toolchain &amp; bare-metal</h2>
<h3>Embedded C dialect</h3>
<ul>
<li><strong>Fixed-width types</strong> — use <code>uint8_t</code>, <code>int16_t</code> (from stdint.h); you must know exactly how wide a value is.</li>
<li><strong>volatile</strong> — tells the compiler "this can change outside the program" (a hardware register, an ISR flag) so it must re-read it every time, never cache it.</li>
<li><strong>No malloc by default</strong> — dynamic memory is risky on tiny RAM; you prefer static allocation.</li>
</ul>
<h3>Cross-compilation</h3>
<p>You compile on your PC (x86) but the code runs on the MCU (e.g. ARM Cortex-M). A <strong>cross-compiler</strong> targets a different CPU than the one it runs on. The <strong>toolchain</strong> = compiler + linker + flasher.</p>
<pre><code>// Compile on PC, run on ARM:
// arm-none-eabi-gcc -mcpu=cortex-m4 -O2 main.c -o firmware.elf
// arm-none-eabi-objcopy -O binary firmware.elf firmware.bin
// st-flash write firmware.bin 0x8000000   // program the flash

volatile uint8_t adc_ready = 0;   // set by an ISR -> must be volatile
</code></pre>
<h3>Bare-metal vs OS</h3>
<p><strong>Bare-metal</strong> = your code runs directly on the CPU, no operating system (the super-loop of Chapter 1). Later you add an <strong>RTOS</strong> when you need many concurrent tasks.</p>
<div class="callout"><span class="badge">Why volatile matters</span> Forget <code>volatile</code> on an ISR flag and the compiler may optimise your <code>while (!flag)</code> into an infinite loop — it never re-reads memory.</div>`,
    `<span class="eyebrow">EBS211 · Chương 3 · Bài 3.1</span>
<h2>Embedded C, toolchain &amp; bare-metal</h2>
<h3>Phương ngữ embedded C</h3>
<ul>
<li><strong>Kiểu số cố định</strong> — dùng <code>uint8_t</code>, <code>int16_t</code> (từ stdint.h); bạn phải biết chính xác một giá trị rộng bao nhiêu bit.</li>
<li><strong>volatile</strong> — báo cho trình biên dịch "cái này có thể đổi bên ngoài chương trình" (thanh ghi phần cứng, cờ trong ISR) nên phải đọc lại mỗi lần, không được cache.</li>
<li><strong>Mặc định không malloc</strong> — cấp phát động rủi ro trên RAM bé; ưu tiên cấp phát tĩnh.</li>
</ul>
<h3>Biên dịch chéo (cross-compile)</h3>
<p>Bạn biên dịch trên PC (x86) nhưng mã chạy trên MCU (vd ARM Cortex-M). <strong>Cross-compiler</strong> tạo mã cho một CPU khác với CPU đang chạy nó. <strong>Toolchain</strong> = trình biên dịch + linker + công cụ nạp flash.</p>
<pre><code>// Biên dịch trên PC, chạy trên ARM:
// arm-none-eabi-gcc -mcpu=cortex-m4 -O2 main.c -o firmware.elf
// arm-none-eabi-objcopy -O binary firmware.elf firmware.bin
// st-flash write firmware.bin 0x8000000   // nạp vào flash

volatile uint8_t adc_ready = 0;   // do ISR đặt -> phải volatile
</code></pre>
<h3>Bare-metal và có OS</h3>
<p><strong>Bare-metal</strong> = mã chạy thẳng trên CPU, không hệ điều hành (super-loop ở Chương 1). Sau này bạn thêm <strong>RTOS</strong> khi cần nhiều tác vụ đồng thời.</p>
<div class="callout"><span class="badge">Vì sao cần volatile</span> Quên <code>volatile</code> trên cờ ISR, trình biên dịch có thể biến <code>while (!flag)</code> thành vòng lặp vô tận — nó không đọc lại bộ nhớ nữa.</div>`,
  ]]);

const c3q = quiz('ebs211-quiz-3', 'Quiz 3 — Embedded C & toolchain|||Quiz 3 — Embedded C & toolchain', [
  { id: 'q1', question: 'Từ khoá "volatile" trong embedded C dùng để?', options: ['Tăng tốc biến', 'Báo trình biên dịch đọc lại biến mỗi lần, không cache (thanh ghi, cờ ISR)', 'Xoá biến khỏi RAM', 'Cấp phát động'], correctIndex: 1, explanation: 'volatile ngăn tối ưu cache, buộc đọc lại giá trị thật mỗi lần — cần cho thanh ghi/cờ ISR.' },
  { id: 'q2', question: '"Cross-compile" (biên dịch chéo) nghĩa là?', options: ['Biên dịch nhiều lần', 'Biên dịch trên một CPU nhưng tạo mã cho CPU khác (PC -> ARM)', 'Trộn hai ngôn ngữ', 'Biên dịch trực tiếp trên MCU'], correctIndex: 1, explanation: 'Cross-compiler chạy trên PC nhưng sinh mã cho MCU đích (vd ARM Cortex-M).' },
  { id: 'q3', question: 'Vì sao hệ nhúng nhỏ thường tránh cấp phát động (malloc)?', options: ['Vì C không hỗ trợ', 'RAM rất ít và phân mảnh/thiếu bộ nhớ gây lỗi khó lường; ưu tiên cấp phát tĩnh', 'Vì malloc quá nhanh', 'Vì không có kiểu con trỏ'], correctIndex: 1, explanation: 'RAM bé; malloc dễ gây phân mảnh và hết bộ nhớ lúc chạy nên thường dùng cấp phát tĩnh.' },
]);

const c4 = doc('ebs211-4-1-peripherals-comms', '4.1 — Peripherals & communication|||4.1 — Ngoại vi & giao tiếp',
  'Ngoại vi: GPIO, timer, PWM, ADC; giao tiếp nối tiếp UART (async), SPI (nhanh, master/slave), I2C (2 dây, địa chỉ), CAN (bus ô tô chống nhiễu).',
  [[
    `<span class="eyebrow">EBS211 · Chapter 4 · Lesson 4.1</span>
<h2>Peripherals &amp; communication</h2>
<h3>On-chip peripherals</h3>
<ul>
<li><strong>GPIO</strong> — general-purpose pins you set high/low (drive an LED) or read (a button).</li>
<li><strong>Timer</strong> — counts clock ticks to measure time or fire events periodically.</li>
<li><strong>PWM</strong> — a timer that outputs a square wave whose duty cycle sets motor speed or LED brightness.</li>
<li><strong>ADC</strong> — converts an analog voltage (a temperature sensor) into a number.</li>
</ul>
<h3>Serial buses</h3>
<ul>
<li><strong>UART</strong> — simple 2-wire async link (TX/RX), no clock, for logs and modems.</li>
<li><strong>SPI</strong> — fast, full-duplex, master + one clock line + chip-select per slave.</li>
<li><strong>I2C</strong> — just 2 wires (SDA/SCL) shared by many devices, each with an address.</li>
<li><strong>CAN</strong> — rugged, multi-master automotive bus; nodes broadcast messages by ID, built to survive electrical noise.</li>
</ul>
<pre><code>// Blink an LED and read a button with GPIO
while (1) {
    if (gpio_read(BUTTON_PIN) == 0) {   // pressed (active-low)
        gpio_write(LED_PIN, 1);
    } else {
        gpio_write(LED_PIN, 0);
    }
}
// PWM: 50% duty -> LED at half brightness
timer_pwm_set_duty(TIM3, CH1, 50);
</code></pre>
<div class="callout"><span class="badge">Pick the bus</span> UART for logs, I2C for many slow sensors on 2 wires, SPI for fast displays/flash, CAN for the car.</div>`,
    `<span class="eyebrow">EBS211 · Chương 4 · Bài 4.1</span>
<h2>Ngoại vi &amp; giao tiếp</h2>
<h3>Ngoại vi trên chip</h3>
<ul>
<li><strong>GPIO</strong> — chân đa dụng bạn đặt mức cao/thấp (thắp LED) hoặc đọc (nút bấm).</li>
<li><strong>Timer</strong> — đếm nhịp clock để đo thời gian hoặc sinh sự kiện định kỳ.</li>
<li><strong>PWM</strong> — một timer xuất sóng vuông có duty cycle đặt tốc độ động cơ hay độ sáng LED.</li>
<li><strong>ADC</strong> — biến điện áp analog (cảm biến nhiệt) thành một con số.</li>
</ul>
<h3>Bus nối tiếp</h3>
<ul>
<li><strong>UART</strong> — kết nối 2 dây bất đồng bộ (TX/RX), không clock, dùng cho log và modem.</li>
<li><strong>SPI</strong> — nhanh, song công, một master + một dây clock + chân chọn chip cho mỗi slave.</li>
<li><strong>I2C</strong> — chỉ 2 dây (SDA/SCL) nhiều thiết bị dùng chung, mỗi thiết bị một địa chỉ.</li>
<li><strong>CAN</strong> — bus ô tô đa master, bền; các nút phát bản tin theo ID, thiết kế để chịu nhiễu điện.</li>
</ul>
<pre><code>// Nháy LED và đọc nút bằng GPIO
while (1) {
    if (gpio_read(BUTTON_PIN) == 0) {   // nhấn (tích cực mức thấp)
        gpio_write(LED_PIN, 1);
    } else {
        gpio_write(LED_PIN, 0);
    }
}
// PWM: duty 50% -> LED sáng nửa
timer_pwm_set_duty(TIM3, CH1, 50);
</code></pre>
<div class="callout"><span class="badge">Chọn bus</span> UART cho log, I2C cho nhiều cảm biến chậm trên 2 dây, SPI cho màn hình/flash tốc độ cao, CAN cho xe hơi.</div>`,
  ]]);

const c4q = quiz('ebs211-quiz-4', 'Quiz 4 — Peripherals|||Quiz 4 — Ngoại vi & giao tiếp', [
  { id: 'q1', question: 'Ngoại vi nào biến điện áp analog (cảm biến nhiệt) thành số?', options: ['PWM', 'ADC', 'GPIO', 'UART'], correctIndex: 1, explanation: 'ADC (Analog-to-Digital Converter) chuyển điện áp analog thành giá trị số.' },
  { id: 'q2', question: 'Bus giao tiếp chỉ dùng 2 dây (SDA/SCL) chia sẻ cho nhiều thiết bị theo địa chỉ là?', options: ['SPI', 'I2C', 'CAN', 'UART'], correctIndex: 1, explanation: 'I2C dùng 2 dây SDA/SCL, mỗi thiết bị có một địa chỉ trên bus chung.' },
  { id: 'q3', question: 'Trong ô tô, bus chống nhiễu, đa master, phát bản tin theo ID là?', options: ['CAN', 'SPI', 'I2C', 'GPIO'], correctIndex: 0, explanation: 'CAN là bus tiêu chuẩn trong ô tô: bền, đa master, gửi bản tin theo ID.' },
]);

const c5 = doc('ebs211-5-1-interrupts-realtime', '5.1 — Interrupts & real-time processing|||5.1 — Ngắt & xử lý thời gian thực',
  'Ngắt (interrupt) vs polling; ISR & vector table; độ trễ (latency); hard vs soft real-time; lập lịch (scheduling), ưu tiên, tránh làm việc nặng trong ISR.',
  [[
    `<span class="eyebrow">EBS211 · Chapter 5 · Lesson 5.1</span>
<h2>Interrupts &amp; real-time processing</h2>
<h3>Interrupt vs polling</h3>
<p>Polling = keep asking "is it ready?" (wastes CPU). An <strong>interrupt</strong> = the hardware tells the CPU the moment an event happens; the CPU jumps to an <strong>ISR</strong> (Interrupt Service Routine), then resumes what it was doing.</p>
<h3>Latency &amp; the ISR rule</h3>
<ul>
<li><strong>Latency</strong> — the delay between the event and the ISR running. Hard real-time systems need it small and predictable.</li>
<li><strong>Keep ISRs short</strong> — do the urgent minimum (read a byte, set a flag) and hand the heavy work back to the main loop.</li>
</ul>
<h3>Scheduling</h3>
<p>With several jobs competing, a <strong>scheduler</strong> decides who runs. Higher-<strong>priority</strong> interrupts pre-empt lower ones — the airbag ISR must beat the display refresh.</p>
<pre><code>volatile uint8_t rx_flag = 0;
volatile uint8_t rx_byte = 0;

// ISR: short! just grab the byte and signal main
void USART1_IRQHandler(void) {
    rx_byte = USART1_DR;   // read clears the interrupt
    rx_flag = 1;           // tell the main loop
}

// Main loop does the slow work
while (1) {
    if (rx_flag) { rx_flag = 0; process(rx_byte); }
}
</code></pre>
<div class="callout"><span class="badge">Golden rule</span> Never do slow work (printf, long loops) inside an ISR — you delay every other interrupt and blow your real-time deadlines.</div>`,
    `<span class="eyebrow">EBS211 · Chương 5 · Bài 5.1</span>
<h2>Ngắt &amp; xử lý thời gian thực</h2>
<h3>Ngắt và polling</h3>
<p>Polling = liên tục hỏi "xong chưa?" (phí CPU). <strong>Ngắt</strong> = phần cứng báo cho CPU ngay khi sự kiện xảy ra; CPU nhảy vào <strong>ISR</strong> (trình phục vụ ngắt) rồi quay lại việc đang làm.</p>
<h3>Độ trễ &amp; nguyên tắc ISR</h3>
<ul>
<li><strong>Latency</strong> — độ trễ giữa sự kiện và lúc ISR chạy. Hệ hard real-time cần nó nhỏ và đoán được.</li>
<li><strong>ISR phải ngắn</strong> — làm phần khẩn tối thiểu (đọc một byte, đặt một cờ) rồi trả việc nặng về vòng lặp chính.</li>
</ul>
<h3>Lập lịch</h3>
<p>Khi nhiều việc tranh nhau, một <strong>bộ lập lịch (scheduler)</strong> quyết ai chạy. Ngắt <strong>ưu tiên</strong> cao chiếm quyền của ngắt thấp — ISR túi khí phải thắng việc làm mới màn hình.</p>
<pre><code>volatile uint8_t rx_flag = 0;
volatile uint8_t rx_byte = 0;

// ISR: ngắn! chỉ lấy byte và báo cho main
void USART1_IRQHandler(void) {
    rx_byte = USART1_DR;   // đọc là xoá cờ ngắt
    rx_flag = 1;           // báo cho vòng lặp chính
}

// Vòng lặp chính làm việc chậm
while (1) {
    if (rx_flag) { rx_flag = 0; process(rx_byte); }
}
</code></pre>
<div class="callout"><span class="badge">Nguyên tắc vàng</span> Đừng làm việc chậm (printf, vòng lặp dài) trong ISR — bạn làm trễ mọi ngắt khác và vỡ deadline thời gian thực.</div>`,
  ]]);

const c5q = quiz('ebs211-quiz-5', 'Quiz 5 — Interrupts|||Quiz 5 — Ngắt & real-time', [
  { id: 'q1', question: 'Ưu điểm của ngắt so với polling là?', options: ['Tốn CPU hơn', 'Phần cứng báo ngay khi có sự kiện, CPU không phải hỏi liên tục', 'Luôn chậm hơn', 'Không cần ISR'], correctIndex: 1, explanation: 'Ngắt để CPU làm việc khác và chỉ phản ứng khi sự kiện thật sự xảy ra.' },
  { id: 'q2', question: '"Interrupt latency" là gì?', options: ['Số dòng mã trong ISR', 'Độ trễ giữa lúc sự kiện xảy ra và lúc ISR bắt đầu chạy', 'Tần số clock', 'Dung lượng RAM'], correctIndex: 1, explanation: 'Latency = thời gian từ sự kiện tới khi ISR thực thi; cần nhỏ & đoán được cho hard real-time.' },
  { id: 'q3', question: 'Vì sao ISR phải ngắn gọn?', options: ['Vì trình biên dịch bắt buộc', 'ISR dài làm trễ mọi ngắt khác và vỡ deadline; nên chỉ làm tối thiểu rồi báo main', 'Vì ISR không được đọc thanh ghi', 'Vì tiết kiệm flash'], correctIndex: 1, explanation: 'Giữ ISR ngắn (set cờ) và đẩy việc nặng về vòng lặp chính để bảo đảm thời gian thực.' },
]);

const c6 = doc('ebs211-6-1-rtos-freertos', '6.1 — Real-time operating system (RTOS)|||6.1 — Hệ điều hành thời gian thực (RTOS)',
  'RTOS là gì; task/thread, scheduler ưu tiên (preemptive); đồng bộ: semaphore, mutex (chống race, chống priority inversion); FreeRTOS (xTaskCreate, xSemaphore).',
  [[
    `<span class="eyebrow">EBS211 · Chapter 6 · Lesson 6.1</span>
<h2>Real-time operating system (RTOS)</h2>
<h3>Why an RTOS</h3>
<p>When one super-loop cannot juggle many jobs with different deadlines, an <strong>RTOS</strong> lets you write each job as its own <strong>task</strong>. The <strong>scheduler</strong> runs the highest-priority ready task and pre-empts lower ones — deterministically.</p>
<h3>Tasks &amp; synchronisation</h3>
<ul>
<li><strong>Task</strong> — an independent function with its own stack and priority.</li>
<li><strong>Semaphore</strong> — a signal/counter; an ISR "gives" it, a task "takes" it (event notification, resource counting).</li>
<li><strong>Mutex</strong> — a lock so only one task touches a shared resource at a time; it also fights <em>priority inversion</em>.</li>
</ul>
<pre><code>// FreeRTOS: two tasks + a semaphore from an ISR
SemaphoreHandle_t sem;

void vSensorTask(void *p) {
    for (;;) {
        xSemaphoreTake(sem, portMAX_DELAY);  // wait for data
        read_and_process();
    }
}

void ADC_IRQHandler(void) {
    xSemaphoreGiveFromISR(sem, NULL);        // wake the task
}

int main(void) {
    sem = xSemaphoreCreateBinary();
    xTaskCreate(vSensorTask, "sensor", 256, NULL, 2, NULL);
    vTaskStartScheduler();                    // never returns
}
</code></pre>
<div class="callout"><span class="badge">Preemptive &amp; deterministic</span> An RTOS scheduler guarantees the urgent task runs within a bounded time — the core of "real-time".</div>`,
    `<span class="eyebrow">EBS211 · Chương 6 · Bài 6.1</span>
<h2>Hệ điều hành thời gian thực (RTOS)</h2>
<h3>Vì sao cần RTOS</h3>
<p>Khi một super-loop không kham nổi nhiều việc với deadline khác nhau, <strong>RTOS</strong> cho bạn viết mỗi việc thành một <strong>task</strong> riêng. <strong>Scheduler</strong> chạy task sẵn sàng có ưu tiên cao nhất và chiếm quyền task thấp — một cách xác định.</p>
<h3>Task &amp; đồng bộ</h3>
<ul>
<li><strong>Task</strong> — một hàm độc lập có stack và mức ưu tiên riêng.</li>
<li><strong>Semaphore</strong> — một tín hiệu/bộ đếm; ISR "give", task "take" (báo sự kiện, đếm tài nguyên).</li>
<li><strong>Mutex</strong> — khoá để mỗi lúc chỉ một task chạm tài nguyên chung; còn chống <em>priority inversion</em>.</li>
</ul>
<pre><code>// FreeRTOS: hai task + một semaphore từ ISR
SemaphoreHandle_t sem;

void vSensorTask(void *p) {
    for (;;) {
        xSemaphoreTake(sem, portMAX_DELAY);  // chờ dữ liệu
        read_and_process();
    }
}

void ADC_IRQHandler(void) {
    xSemaphoreGiveFromISR(sem, NULL);        // đánh thức task
}

int main(void) {
    sem = xSemaphoreCreateBinary();
    xTaskCreate(vSensorTask, "sensor", 256, NULL, 2, NULL);
    vTaskStartScheduler();                    // không trả về
}
</code></pre>
<div class="callout"><span class="badge">Preemptive &amp; xác định</span> Scheduler của RTOS bảo đảm task khẩn chạy trong thời gian có chặn trên — cốt lõi của "thời gian thực".</div>`,
  ]]);

const c6q = quiz('ebs211-quiz-6', 'Quiz 6 — RTOS|||Quiz 6 — RTOS & FreeRTOS', [
  { id: 'q1', question: 'Trong RTOS, một "task" là?', options: ['Một thanh ghi phần cứng', 'Một hàm độc lập có stack và mức ưu tiên riêng, được scheduler quản lý', 'Một tệp cấu hình', 'Một ngắt phần cứng'], correctIndex: 1, explanation: 'Task là luồng thực thi độc lập với stack và priority riêng.' },
  { id: 'q2', question: 'Mutex khác semaphore ở chỗ chủ yếu nào?', options: ['Mutex nhanh hơn CPU', 'Mutex là khoá sở hữu để bảo vệ tài nguyên chung và chống priority inversion', 'Mutex không dùng trong RTOS', 'Mutex thay thế ngắt'], correctIndex: 1, explanation: 'Mutex là khoá độc quyền cho tài nguyên chung, có cơ chế chống đảo ưu tiên; semaphore thiên về báo hiệu/đếm.' },
  { id: 'q3', question: 'Scheduler "preemptive" (chiếm quyền) của RTOS bảo đảm?', options: ['Task chạy theo thứ tự tạo ra', 'Task ưu tiên cao khi sẵn sàng sẽ chiếm CPU của task thấp, trong thời gian có chặn trên', 'Mọi task chạy đúng bằng nhau', 'Không bao giờ chuyển task'], correctIndex: 1, explanation: 'Preemptive scheduler chạy task ưu tiên cao nhất đang sẵn sàng và chiếm quyền task thấp một cách xác định.' },
]);

const c7 = doc('ebs211-7-1-power-reliability', '7.1 — Power management & reliability|||7.1 — Quản lý năng lượng & độ tin cậy',
  'Chế độ ngủ (sleep/stop) & tiết kiệm điện; watchdog timer tự reset khi treo; fault tolerance (kiểm tra, giá trị an toàn); kiểm thử firmware (unit test, HIL).',
  [[
    `<span class="eyebrow">EBS211 · Chapter 7 · Lesson 7.1</span>
<h2>Power management &amp; reliability</h2>
<h3>Low power</h3>
<p>Battery devices spend most of their life <em>asleep</em>. The MCU enters a <strong>sleep/stop mode</strong>, wakes on an interrupt (a timer or a pin), does its work, and sleeps again. Duty-cycling like this stretches a coin cell from days to years.</p>
<h3>Watchdog timer</h3>
<p>A <strong>watchdog</strong> is a countdown timer that resets the chip if it ever reaches zero. Healthy firmware "kicks" (reloads) it regularly; if the code hangs, it stops kicking, the watchdog fires, and the system reboots itself — vital for unattended devices.</p>
<h3>Fault tolerance &amp; testing</h3>
<ul>
<li>Validate inputs and use <strong>safe defaults</strong> — a bad sensor reading must not crash the system.</li>
<li><strong>Unit test</strong> logic on the PC; <strong>HIL</strong> (hardware-in-the-loop) tests the firmware against simulated signals.</li>
</ul>
<pre><code>// Sleep until an interrupt, and pet the watchdog
watchdog_init(2000);      // reset if not kicked within 2 s

while (1) {
    watchdog_kick();      // "I'm alive"
    if (work_pending) do_work();
    enter_sleep_mode();   // wake on next interrupt
}
</code></pre>
<div class="callout"><span class="badge">Design for the field</span> Sleep aggressively, kick the watchdog only when the whole system is healthy, and fail into a safe state — never a random one.</div>`,
    `<span class="eyebrow">EBS211 · Chương 7 · Bài 7.1</span>
<h2>Quản lý năng lượng &amp; độ tin cậy</h2>
<h3>Tiết kiệm điện</h3>
<p>Thiết bị chạy pin phần lớn thời gian là <em>đang ngủ</em>. MCU vào <strong>chế độ sleep/stop</strong>, thức dậy khi có ngắt (timer hoặc một chân), làm việc, rồi ngủ tiếp. Cách "duty-cycle" này kéo pin cúc áo từ vài ngày lên vài năm.</p>
<h3>Watchdog timer</h3>
<p><strong>Watchdog</strong> là bộ đếm lùi, sẽ reset chip nếu về 0. Firmware khoẻ mạnh "kick" (nạp lại) nó đều đặn; nếu mã treo, nó ngừng kick, watchdog kích hoạt và hệ thống tự khởi động lại — sống còn với thiết bị không người trông.</p>
<h3>Chịu lỗi &amp; kiểm thử</h3>
<ul>
<li>Kiểm tra đầu vào và dùng <strong>giá trị an toàn mặc định</strong> — một số đọc sai từ cảm biến không được làm sập hệ thống.</li>
<li><strong>Unit test</strong> logic trên PC; <strong>HIL</strong> (hardware-in-the-loop) kiểm firmware với tín hiệu mô phỏng.</li>
</ul>
<pre><code>// Ngủ tới khi có ngắt, và vỗ về watchdog
watchdog_init(2000);      // reset nếu không kick trong 2 giây

while (1) {
    watchdog_kick();      // "tôi còn sống"
    if (work_pending) do_work();
    enter_sleep_mode();   // thức khi có ngắt tiếp theo
}
</code></pre>
<div class="callout"><span class="badge">Thiết kế cho thực địa</span> Ngủ triệt để, chỉ kick watchdog khi toàn hệ thống khoẻ, và hỏng thì rơi vào trạng thái an toàn — không phải trạng thái ngẫu nhiên.</div>`,
  ]]);

const c7q = quiz('ebs211-quiz-7', 'Quiz 7 — Power & reliability|||Quiz 7 — Năng lượng & độ tin cậy', [
  { id: 'q1', question: 'Watchdog timer dùng để?', options: ['Đo nhiệt độ chip', 'Tự reset hệ thống nếu firmware treo (không kick kịp)', 'Tăng tốc CPU', 'Lưu dữ liệu vào flash'], correctIndex: 1, explanation: 'Watchdog reset chip khi bộ đếm về 0; firmware khoẻ phải kick đều, treo là nó reboot.' },
  { id: 'q2', question: 'Cách chính để kéo dài tuổi thọ pin của thiết bị nhúng là?', options: ['Chạy CPU tối đa liên tục', 'Cho MCU ngủ (sleep) phần lớn thời gian, thức khi có ngắt', 'Tắt mọi ngắt', 'Tăng điện áp cấp'], correctIndex: 1, explanation: 'Duty-cycle: ngủ sâu và chỉ thức khi cần giúp giảm dòng tiêu thụ rất nhiều.' },
  { id: 'q3', question: '"Fail-safe" (rơi vào trạng thái an toàn) khi có lỗi nghĩa là?', options: ['Bỏ qua mọi lỗi', 'Khi gặp lỗi, hệ thống chuyển về trạng thái an toàn đã định, không phải trạng thái ngẫu nhiên', 'Luôn reset về nhà máy', 'Xoá toàn bộ RAM'], correctIndex: 1, explanation: 'Kiểm tra đầu vào, dùng giá trị an toàn và thiết kế để lỗi dẫn tới trạng thái an toàn xác định.' },
]);

const c8 = doc('ebs211-8-1-automotive-iot', '8.1 — Automotive & IoT applications|||8.1 — Ứng dụng ô tô & IoT',
  'ECU & mạng ô tô (CAN); automotive embedded, AUTOSAR nói qua; ISO 26262 (an toàn chức năng, ASIL) tổng quan; thiết bị IoT (cảm biến -> MCU -> mạng -> đám mây).',
  [[
    `<span class="eyebrow">EBS211 · Chapter 8 · Lesson 8.1</span>
<h2>Automotive &amp; IoT applications</h2>
<h3>Automotive: ECUs on a CAN network</h3>
<p>A modern car has dozens of <strong>ECUs</strong> (Electronic Control Units) — engine, ABS, airbags, body — talking over <strong>CAN</strong>. Each is an embedded system running hard real-time control. AUTOSAR is a common software architecture standard across suppliers.</p>
<h3>Functional safety: ISO 26262 (overview)</h3>
<ul>
<li><strong>ISO 26262</strong> is the road-vehicle functional-safety standard: manage the risk that a failure causes harm.</li>
<li><strong>ASIL</strong> (A→D) rates how critical a function is; a D-rated function (braking, steering) demands the most rigorous design, redundancy and testing.</li>
</ul>
<h3>IoT devices</h3>
<p>An <strong>IoT node</strong> is an embedded system that talks to the internet: sensor → MCU → wireless (Wi-Fi/BLE/LoRa) → cloud. It reuses everything in this course — low power, RTOS, buses — plus security and connectivity.</p>
<pre><code>// Automotive: send a CAN frame; IoT: publish a reading
CanFrame f = { .id = 0x100, .len = 2 };
f.data[0] = speed_kmh &amp; 0xFF;
f.data[1] = (speed_kmh &gt;&gt; 8) &amp; 0xFF;
can_send(&amp;f);              // broadcast on the bus

// IoT: read sensor, then publish to the cloud
uint16_t t = adc_read(TEMP_CH);
mqtt_publish("car/cabin/temp", t);
</code></pre>
<div class="callout"><span class="badge">Where it all meets</span> The car and the smart device are the same idea at different scales: dedicated, real-time, resource-aware computers — now networked and safety-critical.</div>`,
    `<span class="eyebrow">EBS211 · Chương 8 · Bài 8.1</span>
<h2>Ứng dụng ô tô &amp; IoT</h2>
<h3>Ô tô: các ECU trên mạng CAN</h3>
<p>Một xe hiện đại có hàng chục <strong>ECU</strong> (bộ điều khiển điện tử) — động cơ, ABS, túi khí, thân xe — nói chuyện qua <strong>CAN</strong>. Mỗi ECU là một hệ nhúng chạy điều khiển hard real-time. AUTOSAR là chuẩn kiến trúc phần mềm dùng chung giữa các nhà cung cấp.</p>
<h3>An toàn chức năng: ISO 26262 (tổng quan)</h3>
<ul>
<li><strong>ISO 26262</strong> là chuẩn an toàn chức năng cho xe đường bộ: quản trị rủi ro khi một hư hỏng gây tổn hại.</li>
<li><strong>ASIL</strong> (A→D) xếp mức nghiêm trọng của chức năng; chức năng mức D (phanh, lái) đòi thiết kế, dự phòng và kiểm thử nghiêm ngặt nhất.</li>
</ul>
<h3>Thiết bị IoT</h3>
<p>Một <strong>nút IoT</strong> là hệ nhúng có nối internet: cảm biến → MCU → không dây (Wi-Fi/BLE/LoRa) → đám mây. Nó dùng lại mọi thứ trong môn này — tiết kiệm điện, RTOS, bus — cộng thêm bảo mật và kết nối.</p>
<pre><code>// Ô tô: gửi một CAN frame; IoT: đăng một số đo
CanFrame f = { .id = 0x100, .len = 2 };
f.data[0] = speed_kmh &amp; 0xFF;
f.data[1] = (speed_kmh &gt;&gt; 8) &amp; 0xFF;
can_send(&amp;f);              // phát lên bus

// IoT: đọc cảm biến rồi đăng lên đám mây
uint16_t t = adc_read(TEMP_CH);
mqtt_publish("car/cabin/temp", t);
</code></pre>
<div class="callout"><span class="badge">Nơi mọi thứ gặp nhau</span> Ô tô và thiết bị thông minh là cùng một ý tưởng ở quy mô khác nhau: máy tính chuyên dụng, thời gian thực, tiết kiệm tài nguyên — nay được nối mạng và an toàn-trọng-yếu.</div>`,
  ]]);

const c8q = quiz('ebs211-quiz-8', 'Quiz 8 — Automotive & IoT|||Quiz 8 — Ô tô & IoT', [
  { id: 'q1', question: 'Trong ô tô, "ECU" là?', options: ['Một loại pin', 'Bộ điều khiển điện tử (một hệ nhúng) điều khiển một chức năng như động cơ/ABS', 'Màn hình giải trí', 'Một loại cảm biến nhiệt'], correctIndex: 1, explanation: 'ECU (Electronic Control Unit) là hệ nhúng điều khiển một chức năng, giao tiếp qua CAN.' },
  { id: 'q2', question: 'ISO 26262 và mức ASIL liên quan tới?', options: ['Tốc độ truyền UART', 'An toàn chức năng của xe; ASIL xếp mức nghiêm trọng (A->D), D là khắt khe nhất', 'Kích thước flash', 'Giao thức Wi-Fi'], correctIndex: 1, explanation: 'ISO 26262 là chuẩn an toàn chức năng ô tô; ASIL A->D đo mức trọng yếu, D cao nhất.' },
  { id: 'q3', question: 'Chuỗi điển hình của một thiết bị IoT là?', options: ['Cảm biến -> MCU -> mạng không dây -> đám mây', 'Đám mây -> pin -> màn hình', 'CPU -> GPU -> ổ cứng', 'Chỉ có cảm biến, không có xử lý'], correctIndex: 0, explanation: 'Nút IoT: cảm biến -> MCU xử lý -> kết nối (Wi-Fi/BLE/LoRa) -> đám mây.' },
]);

const taiLieu = doc('ebs211-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (White, Wolf, Lee & Seshia), tài liệu chính thức miễn phí (FreeRTOS, ARM), YouTube, công cụ, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">EBS211 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Embedded Systems — hardware, embedded C, peripherals, interrupts, RTOS and automotive/IoT — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for EBS211 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.oreilly.com/library/view/making-embedded-systems/9781449308889/" target="_blank" rel="noopener"><em>Making Embedded Systems</em> — Elecia White</a></li>
<li><a href="https://www.marilynwolf.us/CaC4e/" target="_blank" rel="noopener"><em>Computers as Components</em> — Marilyn Wolf</a></li>
<li><a href="https://ptolemy.berkeley.edu/books/leeseshia/" target="_blank" rel="noopener"><em>Introduction to Embedded Systems</em> — Lee &amp; Seshia (free PDF)</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.freertos.org/Documentation/RTOS_book.html" target="_blank" rel="noopener">FreeRTOS — official docs &amp; book</a></li>
<li><a href="https://developer.arm.com/documentation" target="_blank" rel="noopener">ARM Developer — Cortex-M documentation</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@phils_lab" target="_blank" rel="noopener">Phil's Lab</a> — embedded firmware &amp; hardware design</li>
<li><a href="https://www.youtube.com/@DigiKey" target="_blank" rel="noopener">DigiKey — Intro to RTOS series</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.st.com/en/development-tools/stm32cubeide.html" target="_blank" rel="noopener">STM32CubeIDE</a> — free IDE + toolchain for STM32</li>
<li><a href="https://wokwi.com/" target="_blank" rel="noopener">Wokwi</a> — online MCU &amp; Arduino/ESP32 simulator</li>
<li><a href="https://www.freertos.org/" target="_blank" rel="noopener">FreeRTOS</a> — the reference open-source RTOS</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Hardware foundation</strong> — what an MCU is, memory map, registers, buses; read a datasheet.</li>
<li><strong>Program bare-metal</strong> — embedded C, volatile, the toolchain; blink an LED, drive GPIO/timer/ADC.</li>
<li><strong>React in real time</strong> — interrupts &amp; ISRs, then an RTOS (FreeRTOS tasks, semaphores, mutexes).</li>
<li><strong>Ship it</strong> — low power, watchdog &amp; reliability, then automotive (CAN, ISO 26262) and IoT.</li>
</ol></div>`,
    `<span class="eyebrow">EBS211 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Hệ thống nhúng — phần cứng, embedded C, ngoại vi, ngắt, RTOS và ô tô/IoT — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của EBS211 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.oreilly.com/library/view/making-embedded-systems/9781449308889/" target="_blank" rel="noopener"><em>Making Embedded Systems</em> — Elecia White</a></li>
<li><a href="https://www.marilynwolf.us/CaC4e/" target="_blank" rel="noopener"><em>Computers as Components</em> — Marilyn Wolf</a></li>
<li><a href="https://ptolemy.berkeley.edu/books/leeseshia/" target="_blank" rel="noopener"><em>Introduction to Embedded Systems</em> — Lee &amp; Seshia (PDF miễn phí)</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.freertos.org/Documentation/RTOS_book.html" target="_blank" rel="noopener">FreeRTOS — tài liệu &amp; sách chính thức</a></li>
<li><a href="https://developer.arm.com/documentation" target="_blank" rel="noopener">ARM Developer — tài liệu Cortex-M</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@phils_lab" target="_blank" rel="noopener">Phil's Lab</a> — firmware nhúng &amp; thiết kế phần cứng</li>
<li><a href="https://www.youtube.com/@DigiKey" target="_blank" rel="noopener">DigiKey — chuỗi Intro to RTOS</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.st.com/en/development-tools/stm32cubeide.html" target="_blank" rel="noopener">STM32CubeIDE</a> — IDE + toolchain miễn phí cho STM32</li>
<li><a href="https://wokwi.com/" target="_blank" rel="noopener">Wokwi</a> — mô phỏng MCU &amp; Arduino/ESP32 trực tuyến</li>
<li><a href="https://www.freertos.org/" target="_blank" rel="noopener">FreeRTOS</a> — RTOS mã nguồn mở tham chiếu</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền phần cứng</strong> — MCU là gì, bản đồ bộ nhớ, thanh ghi, bus; đọc được datasheet.</li>
<li><strong>Lập trình bare-metal</strong> — embedded C, volatile, toolchain; nháy LED, điều khiển GPIO/timer/ADC.</li>
<li><strong>Phản ứng thời gian thực</strong> — ngắt &amp; ISR, rồi RTOS (FreeRTOS task, semaphore, mutex).</li>
<li><strong>Đưa vào sản phẩm</strong> — tiết kiệm điện, watchdog &amp; độ tin cậy, rồi ô tô (CAN, ISO 26262) và IoT.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'EBS211',
    slug: 'ebs211-embedded-systems',
    title: 'Embedded Systems',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/EBS211.webp',
    shortDescription: 'How embedded systems work — real-time & resource-constrained MCUs, MCU/SoC hardware, embedded C & bare-metal, peripherals (GPIO/PWM/ADC, UART/SPI/I2C/CAN), interrupts, RTOS (FreeRTOS), power & reliability, automotive ECUs, ISO 26262 & IoT.|||Hệ nhúng hoạt động thế nào — thời gian thực & ràng buộc tài nguyên, phần cứng MCU/SoC, embedded C & bare-metal, ngoại vi (GPIO/PWM/ADC, UART/SPI/I2C/CAN), ngắt, RTOS (FreeRTOS), độ tin cậy, ECU ô tô, ISO 26262 & IoT.',
    description: 'Môn <strong>EBS211 — Embedded Systems</strong> (Hệ thống nhúng, ngành Kỹ thuật phần mềm ô tô, kỳ 3) giúp hiểu <strong>hệ thống nhúng hoạt động thế nào</strong>. Từ <strong>hệ nhúng là gì</strong> (thời gian thực, ràng buộc tài nguyên) → <strong>kiến trúc phần cứng</strong> (MCU/SoC, bộ nhớ, thanh ghi, bus) → <strong>lập trình embedded C</strong> (cross-compile, toolchain, bare-metal) → <strong>ngoại vi &amp; giao tiếp</strong> (GPIO/timer/PWM/ADC, UART/SPI/I2C/CAN) → <strong>ngắt &amp; thời gian thực</strong> → <strong>RTOS (FreeRTOS)</strong> → <strong>năng lượng &amp; độ tin cậy</strong> → <strong>ứng dụng ô tô (ECU, ISO 26262) &amp; IoT</strong>. Bám giáo trình chuẩn (White, Wolf, Lee &amp; Seshia, FreeRTOS), song ngữ, có ví dụ mã C và quiz mỗi chương.',
    whatYouLearn: 'Đặc điểm hệ nhúng & thời gian thực (hard/soft); MCU/SoC, bản đồ bộ nhớ & thanh ghi ánh xạ bộ nhớ, bus AHB/APB; embedded C (uint8_t, volatile), cross-compile & toolchain, bare-metal; GPIO/timer/PWM/ADC và UART/SPI/I2C/CAN; ngắt, ISR, latency, lập lịch; RTOS FreeRTOS (task, scheduler, semaphore, mutex); sleep & tiết kiệm điện, watchdog, chịu lỗi & kiểm thử; ECU ô tô, mạng CAN, tổng quan ISO 26262/ASIL, thiết bị IoT.',
    requirements: 'Biết lập trình C cơ bản (biến, con trỏ, hàm, vòng lặp). Nên có kiến thức điện tử nhập môn (áp/dòng, số nhị phân). Xem điều kiện tiên quyết trong khung chương trình ngành Kỹ thuật phần mềm ô tô trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Hệ nhúng là gì, thời gian thực, lộ trình 4 bước.', lessons: [intro] },
    { title: 'Chương 1 — Hệ thống nhúng là gì|||Chapter 1 — What is an embedded system', description: 'Đặc điểm, real-time, ràng buộc tài nguyên, ví dụ.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Kiến trúc phần cứng|||Chapter 2 — Hardware architecture', description: 'MCU/SoC, bộ nhớ, thanh ghi, bus, thiết kế.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Lập trình nhúng|||Chapter 3 — Embedded programming', description: 'Embedded C, cross-compile, toolchain, bare-metal.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Ngoại vi & giao tiếp|||Chapter 4 — Peripherals & comms', description: 'GPIO/timer/PWM/ADC, UART/SPI/I2C/CAN.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Ngắt & thời gian thực|||Chapter 5 — Interrupts & real-time', description: 'Interrupt, latency, hard/soft real-time, scheduling.', lessons: [c5, c5q] },
    { title: 'Chương 6 — RTOS (FreeRTOS)|||Chapter 6 — RTOS (FreeRTOS)', description: 'Task, scheduler, semaphore/mutex, FreeRTOS.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Năng lượng & độ tin cậy|||Chapter 7 — Power & reliability', description: 'Low power, watchdog, fault tolerance, testing.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ứng dụng ô tô & IoT|||Chapter 8 — Automotive & IoT', description: 'ECU, automotive, ISO 26262 tổng quan, IoT.', lessons: [c8, c8q] },
  ],
};
