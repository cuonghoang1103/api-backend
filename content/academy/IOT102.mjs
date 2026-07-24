/**
 * IOT102 — Internet of Things (Internet vạn vật). Kỳ 4.
 * Bám syllabus FPTU (sylID 12400, 13 CLO). Tiên quyết: None. Online + offline.
 * Arduino UNO (ATmega328p), Fritzing/Tinkercad, edX + Arduino docs.
 * Song ngữ EN/VN. Code Arduino (C/C++) <pre>+.tok-*. Ví dụ + ★ ngoài giáo trình.
 * KHÔNG có CodeLab track Arduino → luyện qua Tinkercad + Exp Hub.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/IOT102.mjs --apply
 */
export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'IOT102',
    slug: 'internet-of-things',
    title: 'Internet of Things',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Make the physical world programmable: the concepts of IoT, the Arduino UNO microcontroller, building circuits, reading sensors and driving actuators with code, and connecting devices to a network. Hands-on with Arduino and Tinkercad simulation.|||Biến thế giới vật lý thành lập trình được: khái niệm IoT, vi điều khiển Arduino UNO, dựng mạch, đọc cảm biến và điều khiển cơ cấu chấp hành bằng code, và nối thiết bị vào mạng. Thực hành với Arduino và mô phỏng Tinkercad.',
    description: 'Môn nhập môn Internet vạn vật (IoT): khái niệm và ứng dụng IoT, kiến trúc vi điều khiển Arduino UNO (ATmega328), điện tử cơ bản và dựng mạch, lập trình vào/ra số và tương tự, cảm biến & cơ cấu chấp hành, truyền thông và mạng trong IoT, ngắt (interrupt), và bảo mật IoT. Môn gồm phần online (video lý thuyết) và offline (lab thực hành + project). Tiên quyết: không.',
    whatYouLearn: 'Khái niệm & ứng dụng IoT; kiến trúc Arduino UNO / ATmega328; điện tử cơ bản (định luật Ohm, breadboard) và dựng mạch với Fritzing/Tinkercad; lập trình vào/ra số (digitalRead/Write); vào/ra tương tự (analogRead, PWM); cảm biến & cơ cấu chấp hành; truyền thông (Serial, I2C/SPI, WiFi) & mạng IoT; ngắt (interrupt); và bảo mật IoT — kèm một project IoT hoàn chỉnh.',
    requirements: 'Tiên quyết: không có. Cần cài Arduino IDE; có bộ KIT Arduino (UNO + cảm biến) để thực hành, hoặc dùng mô phỏng Tinkercad Circuits miễn phí online nếu chưa có phần cứng.',
    documentsNote: 'Học liệu: khóa edX về IoT; Introduction to Arduino (Alan G. Smith); Arduino Documentation; Instructables IoT projects; IOT102 guide (project guide, topics, rubrics, KIT list). Công cụ: Arduino IDE + Fritzing/Tinkercad. Kèm file syllabus gốc IOT102.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: IoT là gì, cách chấm (online + lab + project), và cài Arduino IDE / Tinkercad.',
      lessons: [
        {
          title: '0.1 — About IOT102 & the course map|||0.1 — Giới thiệu IOT102 & bản đồ môn học',
          slug: 'iot102-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'IoT là gì, vì sao nó bùng nổ, và lộ trình từ khái niệm tới một thiết bị Arduino nối mạng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About IOT102 — Internet of Things</h2>
<p class="lead">So far you have programmed screens. IOT102 lets your code touch the <strong>physical world</strong>: blink a light, read a temperature, open a door, and send that data over the internet. The "Internet of Things" is billions of everyday objects — sensors, appliances, cars — connected and programmable.</p>
<p>You will learn on a tiny computer called the <strong>Arduino UNO</strong>, wiring real (or simulated) circuits and writing the code that brings them to life. No prior electronics needed.</p>
<h3>Course map</h3>
<div class="lz-map">
  <div class="lz-stage">Understand IoT</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">What is IoT?</div><div class="lz-nsub">Things · architecture · applications</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">The Arduino UNO</div><div class="lz-nsub">ATmega328 · pins · setup()/loop()</div></div></div>
  <div class="lz-stage">Build circuits</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Electronics &amp; circuits</div><div class="lz-nsub">Ohm's law · breadboard · Fritzing</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Digital I/O</div><div class="lz-nsub">LED · button · digitalRead/Write</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Analog I/O &amp; PWM</div><div class="lz-nsub">Sensors in · dimming/servos out</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Sensors &amp; actuators</div><div class="lz-nsub">Sense the world, act on it</div></div></div>
  <div class="lz-stage">Connect</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Communication &amp; networking</div><div class="lz-nsub">Serial · I2C/SPI · WiFi</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Interrupts · IoT security · a full project</div><div class="lz-nsub">From blinking LED to a real device</div></div></div>
</div>
<div class="callout ok">IoT is learned by wiring and running. No hardware yet? Use <strong>Tinkercad Circuits</strong> — a free online Arduino simulator where you can build and run every lab in your browser.</div>
<a class="link-card exphub" href="/exp-hub/iot102-cai-dat-arduino?ref=%2Fcourses%2Finternet-of-things%2Flearn&reflabel=IOT102%20%E2%80%94%20Internet%20of%20Things" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Set up Arduino IDE &amp; Tinkercad</span><span class="lc-sub">Tools + simulator so you can start with or without hardware.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu IOT102 — Internet vạn vật</h2>
<p class="lead">Tới giờ bạn mới lập trình màn hình. IOT102 cho code của bạn chạm vào <strong>thế giới vật lý</strong>: nhấp nháy một đèn, đọc nhiệt độ, mở một cánh cửa, và gửi dữ liệu đó qua internet. "Internet vạn vật" là hàng tỷ vật thể đời thường — cảm biến, thiết bị gia dụng, xe hơi — được kết nối và lập trình được.</p>
<p>Bạn sẽ học trên một máy tính tí hon gọi là <strong>Arduino UNO</strong>, đấu các mạch thật (hoặc mô phỏng) và viết code làm chúng sống dậy. Không cần biết điện tử trước.</p>
<h3>Bản đồ môn học</h3>
<div class="lz-map">
  <div class="lz-stage">Hiểu IoT</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">IoT là gì?</div><div class="lz-nsub">Things · kiến trúc · ứng dụng</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Arduino UNO</div><div class="lz-nsub">ATmega328 · chân · setup()/loop()</div></div></div>
  <div class="lz-stage">Dựng mạch</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Điện tử &amp; mạch</div><div class="lz-nsub">Định luật Ohm · breadboard · Fritzing</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Vào/ra số</div><div class="lz-nsub">LED · nút · digitalRead/Write</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Vào/ra tương tự &amp; PWM</div><div class="lz-nsub">Cảm biến vào · điều khiển đèn/servo ra</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Cảm biến &amp; cơ cấu chấp hành</div><div class="lz-nsub">Cảm nhận thế giới, tác động lên nó</div></div></div>
  <div class="lz-stage">Kết nối</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Truyền thông &amp; mạng</div><div class="lz-nsub">Serial · I2C/SPI · WiFi</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Ngắt · bảo mật IoT · một project hoàn chỉnh</div><div class="lz-nsub">Từ đèn nhấp nháy tới thiết bị thật</div></div></div>
</div>
<div class="callout ok">IoT học bằng cách đấu mạch và chạy. Chưa có phần cứng? Dùng <strong>Tinkercad Circuits</strong> — trình mô phỏng Arduino online miễn phí, bạn dựng và chạy mọi lab ngay trong trình duyệt.</div>
<a class="link-card exphub" href="/exp-hub/iot102-cai-dat-arduino?ref=%2Fcourses%2Finternet-of-things%2Flearn&reflabel=IOT102%20%E2%80%94%20Internet%20of%20Things" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Cài Arduino IDE &amp; Tinkercad</span><span class="lc-sub">Công cụ + mô phỏng để bắt đầu có hoặc chưa có phần cứng.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Passing requirements & grading|||0.2 — Điều kiện qua môn & cấu trúc điểm',
          slug: 'iot102-dieu-kien-qua-mon',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Cấu trúc online + offline, điểm sàn, và project cuối kỳ (trình bày sản phẩm IoT).',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Passing requirements &amp; grading</h2>
<p class="lead">From the official IOT102 syllabus. The course blends <strong>online</strong> theory videos with <strong>offline</strong> hands-on labs, and culminates in a <strong>project</strong> you build and present.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Format</span><span class="v">Online videos + offline labs + project</span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">None</span></div>
  <div class="kv"><span class="k">Grading scale</span><span class="v">10 <small>pass when average ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Eligibility</span><span class="v">Attend ≥ 80% of sessions</span></div>
</div>
<div class="callout warn">Two duties every week: <strong>watch the online theory videos</strong> and <strong>do the labs</strong> at home. The final <strong>project</strong> (a working IoT device you present) is a big part of the grade — start thinking about your idea early.</div>
<div class="note-ct">This is a maker course: the marks come from things that actually work. A blinking LED you wired and coded yourself teaches more than any slide.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn &amp; cấu trúc điểm</h2>
<p class="lead">Từ syllabus chính thức IOT102. Môn kết hợp video lý thuyết <strong>online</strong> với lab thực hành <strong>offline</strong>, và đỉnh điểm là một <strong>project</strong> bạn tự xây và trình bày.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Hình thức</span><span class="v">Video online + lab offline + project</span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">Không</span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10 <small>qua khi trung bình ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Điều kiện dự thi</span><span class="v">Dự ≥ 80% buổi</span></div>
</div>
<div class="callout warn">Hai nhiệm vụ mỗi tuần: <strong>xem video lý thuyết online</strong> và <strong>làm lab</strong> ở nhà. <strong>Project</strong> cuối (một thiết bị IoT chạy được bạn trình bày) là phần lớn của điểm — hãy nghĩ ý tưởng sớm.</div>
<div class="note-ct">Đây là môn "maker": điểm đến từ những thứ chạy thật. Một đèn LED nhấp nháy bạn tự đấu và code dạy nhiều hơn mọi slide.</div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 1 — IoT LÀ GÌ ══════════════════ */
    {
      title: 'Chapter 1 — What is IoT?|||Chương 1 — IoT là gì?',
      description: 'Khái niệm "vạn vật", kiến trúc 4 tầng của một hệ IoT, và các ứng dụng thực tế.',
      lessons: [
        {
          title: '1.1 — The concept & architecture of IoT|||1.1 — Khái niệm & kiến trúc IoT',
          slug: 'iot102-khai-niem',
          type: 'VIDEO',
          description: 'Định nghĩa "thing"; kiến trúc 4 tầng (thiết bị → mạng → xử lý → ứng dụng); ví dụ nhà thông minh, nông nghiệp.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>What "Internet of Things" really means</h2>
<p class="lead">A "thing" in IoT is any physical object given the ability to <strong>sense</strong>, <strong>process</strong>, and <strong>communicate</strong> — a lightbulb that knows if it is on and can be switched from your phone, a field sensor that reports soil moisture to a server. IoT is the network of billions of such things.</p>

<h3>The four layers of an IoT system</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Device / Perception layer</div><div class="lz-nsub">Sensors &amp; actuators + a microcontroller (Arduino) — the physical thing.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Network layer</div><div class="lz-nsub">WiFi / Bluetooth / cellular carries the data to the internet.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Processing layer</div><div class="lz-nsub">A server / cloud stores and analyses the data.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Application layer</div><div class="lz-nsub">The app/dashboard a human uses to see and control.</div></div></div>
</div>
<div class="out"><b>Example — smart farm:</b> a soil sensor (device) sends moisture over WiFi (network) to a cloud service (processing) that shows a graph and triggers a pump on your phone app (application).</div>

<div class="note-ct">This course focuses on layer 1 (the device: Arduino + sensors) and touches layer 2 (connecting it). Layers 3–4 are where your later web/cloud courses connect — IoT is the bridge from software to the physical world.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Edge vs Cloud computing in IoT.</b> Sending every sensor reading to the cloud wastes bandwidth and adds delay. Modern IoT does <b>edge computing</b>: the device itself makes simple decisions (e.g. "sound the alarm if smoke &gt; threshold") and only sends summaries to the cloud. This lowers latency, cost, and keeps working if the internet drops. Knowing the edge/cloud trade-off is what turns "I can blink an LED" into "I can design an IoT system".</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>"Internet vạn vật" thực sự nghĩa là gì</h2>
<p class="lead">Một "thing" trong IoT là bất kỳ vật thể vật lý nào được trao khả năng <strong>cảm nhận</strong>, <strong>xử lý</strong>, và <strong>truyền thông</strong> — một bóng đèn biết nó đang bật và có thể bật/tắt từ điện thoại, một cảm biến ngoài đồng báo độ ẩm đất về server. IoT là mạng lưới hàng tỷ vật như vậy.</p>

<h3>Bốn tầng của một hệ IoT</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Tầng thiết bị / cảm nhận</div><div class="lz-nsub">Cảm biến &amp; cơ cấu chấp hành + vi điều khiển (Arduino) — vật thể vật lý.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Tầng mạng</div><div class="lz-nsub">WiFi / Bluetooth / di động đưa dữ liệu lên internet.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Tầng xử lý</div><div class="lz-nsub">Server / cloud lưu và phân tích dữ liệu.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Tầng ứng dụng</div><div class="lz-nsub">App/dashboard con người dùng để xem và điều khiển.</div></div></div>
</div>
<div class="out"><b>Ví dụ — nông trại thông minh:</b> một cảm biến đất (thiết bị) gửi độ ẩm qua WiFi (mạng) tới dịch vụ cloud (xử lý), nơi hiện biểu đồ và kích một máy bơm qua app điện thoại (ứng dụng).</div>

<div class="note-ct">Môn này tập trung tầng 1 (thiết bị: Arduino + cảm biến) và chạm tầng 2 (kết nối). Tầng 3–4 là nơi các môn web/cloud sau nối vào — IoT là cầu nối từ phần mềm tới thế giới vật lý.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Điện toán biên (Edge) vs Cloud trong IoT.</b> Gửi mọi số đọc cảm biến lên cloud lãng phí băng thông và thêm độ trễ. IoT hiện đại làm <b>điện toán biên</b>: thiết bị tự ra quyết định đơn giản (vd "báo động nếu khói &gt; ngưỡng") và chỉ gửi bản tóm tắt lên cloud. Điều này giảm độ trễ, chi phí, và vẫn chạy nếu mất internet. Biết đánh đổi edge/cloud là điều biến "tôi nhấp nháy được LED" thành "tôi thiết kế được hệ IoT".</div>
</div>
`,
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 2 — ARDUINO UNO ══════════════════ */
    {
      title: 'Chapter 2 — The Arduino UNO|||Chương 2 — Arduino UNO',
      description: 'Vi điều khiển ATmega328, sơ đồ chân, và cấu trúc chương trình Arduino: setup() & loop().',
      lessons: [
        {
          title: '2.1 — ATmega328, pins & the sketch structure|||2.1 — ATmega328, chân & cấu trúc sketch',
          slug: 'iot102-arduino-uno',
          type: 'VIDEO',
          description: 'Vi điều khiển là gì; chân digital/analog/nguồn; và hai hàm setup()/loop() với ví dụ Blink.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>The Arduino UNO — a tiny computer you program</h2>
<p class="lead">The Arduino UNO is built around the <strong>ATmega328</strong>, a <em>microcontroller</em>: a whole computer (CPU + memory + I/O) on one chip. Unlike your laptop, it has no OS — your program <em>is</em> the only thing running, directly controlling electrical pins.</p>

<h3>The pins — how it touches the world</h3>
<table>
  <thead><tr><th>Pin type</th><th>What it does</th></tr></thead>
  <tbody>
    <tr><td>Digital (0–13)</td><td>read/write ON (5V) or OFF (0V)</td></tr>
    <tr><td>Analog In (A0–A5)</td><td>read a voltage as a number 0–1023</td></tr>
    <tr><td>PWM (~3,5,6,9,10,11)</td><td>fake an analog output (dimming)</td></tr>
    <tr><td>Power (5V, 3.3V, GND)</td><td>supply and ground for components</td></tr>
  </tbody>
</table>

<h3>Every Arduino program has exactly two functions</h3>
<pre><span class="tok-keyword">void</span> <span class="tok-function">setup</span>() {          <span class="tok-comment">// runs ONCE at power-on</span>
  <span class="tok-function">pinMode</span>(13, OUTPUT);
}
<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {           <span class="tok-comment">// runs FOREVER, over and over</span>
  <span class="tok-function">digitalWrite</span>(13, HIGH);  <span class="tok-function">delay</span>(1000);
  <span class="tok-function">digitalWrite</span>(13, LOW);   <span class="tok-function">delay</span>(1000);
}</pre>
<div class="out"><b>Blink:</b> this is "Hello World" for hardware — the built-in LED on pin 13 turns on for 1s, off for 1s, forever. <span class="badge">setup()</span> configures; <span class="badge">loop()</span> is the endless heartbeat.</div>

<div class="pitfall"><b>Trap:</b> forgetting <span class="badge">pinMode()</span> in setup, or mixing up HIGH/LOW. And remember there is no "main" and no exit — loop() never stops; that endless loop is the program.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Arduino code is really C++.</b> The friendly setup()/loop() hides that you are writing C/C++ compiled to machine code for the ATmega. The chip has only ~2KB of RAM — thousands of times less than your PC. That is why IoT programmers care about every byte: a careless String in a loop can crash the board. Appreciating these tight limits is the mindset shift from PC programming to embedded.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Arduino UNO — một máy tính tí hon bạn lập trình</h2>
<p class="lead">Arduino UNO xây quanh <strong>ATmega328</strong>, một <em>vi điều khiển</em>: cả một máy tính (CPU + bộ nhớ + I/O) trên một con chip. Khác laptop, nó không có hệ điều hành — chương trình của bạn <em>chính là</em> thứ duy nhất chạy, điều khiển trực tiếp các chân điện.</p>

<h3>Các chân — cách nó chạm vào thế giới</h3>
<table>
  <thead><tr><th>Loại chân</th><th>Làm gì</th></tr></thead>
  <tbody>
    <tr><td>Digital (0–13)</td><td>đọc/ghi BẬT (5V) hoặc TẮT (0V)</td></tr>
    <tr><td>Analog In (A0–A5)</td><td>đọc một điện áp thành số 0–1023</td></tr>
    <tr><td>PWM (~3,5,6,9,10,11)</td><td>giả lập ngõ ra tương tự (điều chỉnh độ sáng)</td></tr>
    <tr><td>Nguồn (5V, 3.3V, GND)</td><td>cấp nguồn và mát cho linh kiện</td></tr>
  </tbody>
</table>

<h3>Mọi chương trình Arduino có đúng hai hàm</h3>
<pre><span class="tok-keyword">void</span> <span class="tok-function">setup</span>() {          <span class="tok-comment">// chạy MỘT LẦN khi bật nguồn</span>
  <span class="tok-function">pinMode</span>(13, OUTPUT);
}
<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {           <span class="tok-comment">// chạy MÃI MÃI, lặp đi lặp lại</span>
  <span class="tok-function">digitalWrite</span>(13, HIGH);  <span class="tok-function">delay</span>(1000);
  <span class="tok-function">digitalWrite</span>(13, LOW);   <span class="tok-function">delay</span>(1000);
}</pre>
<div class="out"><b>Blink:</b> đây là "Hello World" của phần cứng — LED tích hợp ở chân 13 bật 1s, tắt 1s, mãi mãi. <span class="badge">setup()</span> cấu hình; <span class="badge">loop()</span> là nhịp tim bất tận.</div>

<div class="pitfall"><b>Bẫy:</b> quên <span class="badge">pinMode()</span> trong setup, hoặc lẫn HIGH/LOW. Và nhớ không có "main" và không có thoát — loop() không bao giờ dừng; vòng lặp bất tận đó chính là chương trình.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Code Arduino thực chất là C++.</b> Cặp setup()/loop() thân thiện giấu đi việc bạn đang viết C/C++ biên dịch ra mã máy cho ATmega. Con chip chỉ có ~2KB RAM — ít hơn PC hàng nghìn lần. Đó là lý do lập trình viên IoT quan tâm từng byte: một String cẩu thả trong vòng lặp có thể làm treo board. Trân trọng các giới hạn chật hẹp này là bước chuyển tư duy từ lập trình PC sang nhúng.</div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 3 — ĐIỆN TỬ & MẠCH ══════════════════ */
    {
      title: 'Chapter 3 — Electronics & circuits|||Chương 3 — Điện tử & mạch',
      description: 'Điện áp/dòng/điện trở, định luật Ohm, breadboard, và mạch LED + điện trở đầu tiên.',
      lessons: [
        {
          title: '3.1 — Ohm\'s law, breadboards & your first circuit|||3.1 — Định luật Ohm, breadboard & mạch đầu tiên',
          slug: 'iot102-mach-dien',
          type: 'VIDEO',
          description: 'V=I·R giải thích trực quan; breadboard nối thế nào; và vì sao LED cần điện trở nối tiếp.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Just enough electronics to build safely</h2>
<p class="lead">You do not need to be an electrical engineer, but three quantities and one law let you build without burning parts. Think of electricity like water in a pipe.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Voltage (V)</b> — the "pressure" pushing electrons. Measured in volts. (Water pressure.)</div>
  <div class="lz-layer"><b>Current (I)</b> — the "flow" of electrons. Measured in amps. (Water flow rate.)</div>
  <div class="lz-layer"><b>Resistance (R)</b> — how much a component "restricts" flow. Measured in ohms. (A narrow pipe.)</div>
</div>
<div class="out"><b>Ohm's Law:</b> V = I × R. Rearranged: I = V / R — the current through a component is voltage divided by resistance.</div>

<h3>Ví dụ có lời giải · Why an LED needs a resistor</h3>
<div class="out">An LED drops ~2V and safely takes ~20mA (0.02A). Arduino gives 5V. The resistor must absorb the extra 3V:<br>
R = V / I = (5 − 2) / 0.02 = 3 / 0.02 = <b>150Ω</b> (a 220Ω resistor is the common safe choice).<br>
Without it, the full current burns the LED out instantly.</div>

<h3>The breadboard</h3>
<p>A breadboard lets you build circuits with no soldering: it has rows of connected holes. Push component legs into the same row to connect them; the long side rails carry power (+) and ground (−). Fritzing and Tinkercad let you draw and simulate these virtually.</p>

<div class="pitfall"><b>Trap that destroys parts:</b> connecting an LED directly across 5V and GND with no resistor, or shorting 5V to GND. Always include a current-limiting resistor, and double-check polarity — the LED's long leg is + (anode).</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Digital vs analog signals — the heart of "sensing".</b> A button is <em>digital</em>: on or off, one of two values. A temperature is <em>analog</em>: a smooth range of values. The Arduino bridges them with an <b>ADC</b> (analog-to-digital converter) that turns a 0–5V voltage into a number 0–1023 (10-bit). Understanding that every analog sensor reading is really a quantised approximation explains sensor precision limits — and why 1023 is the magic number in Chapter 5.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Vừa đủ điện tử để dựng mạch an toàn</h2>
<p class="lead">Bạn không cần là kỹ sư điện, nhưng ba đại lượng và một định luật cho phép bạn dựng mạch mà không cháy linh kiện. Hãy nghĩ điện như nước trong ống.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Điện áp (V)</b> — "áp lực" đẩy electron. Đo bằng volt. (Áp lực nước.)</div>
  <div class="lz-layer"><b>Dòng điện (I)</b> — "dòng chảy" của electron. Đo bằng ampe. (Lưu lượng nước.)</div>
  <div class="lz-layer"><b>Điện trở (R)</b> — mức một linh kiện "cản" dòng. Đo bằng ohm. (Ống hẹp.)</div>
</div>
<div class="out"><b>Định luật Ohm:</b> V = I × R. Sắp lại: I = V / R — dòng qua một linh kiện bằng điện áp chia điện trở.</div>

<h3>Ví dụ có lời giải · Vì sao LED cần điện trở</h3>
<div class="out">Một LED sụt ~2V và chịu an toàn ~20mA (0.02A). Arduino cho 5V. Điện trở phải hấp thụ 3V thừa:<br>
R = V / I = (5 − 2) / 0.02 = 3 / 0.02 = <b>150Ω</b> (điện trở 220Ω là lựa chọn an toàn phổ biến).<br>
Không có nó, dòng đầy đủ đốt cháy LED tức khắc.</div>

<h3>Breadboard</h3>
<p>Breadboard cho phép dựng mạch không cần hàn: nó có các hàng lỗ nối với nhau. Cắm chân linh kiện vào cùng một hàng để nối chúng; hai thanh ray dài mang nguồn (+) và mát (−). Fritzing và Tinkercad cho bạn vẽ và mô phỏng ảo.</p>

<div class="pitfall"><b>Bẫy phá linh kiện:</b> nối LED thẳng qua 5V và GND không có điện trở, hoặc chập 5V vào GND. Luôn có điện trở hạn dòng, và kiểm cực tính — chân dài của LED là + (anode).</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Tín hiệu số vs tương tự — trái tim của "cảm nhận".</b> Một nút là <em>số</em>: bật hoặc tắt, một trong hai giá trị. Nhiệt độ là <em>tương tự</em>: một dải giá trị liên tục. Arduino nối chúng bằng một <b>ADC</b> (bộ chuyển tương tự-số) biến điện áp 0–5V thành số 0–1023 (10-bit). Hiểu rằng mọi số đọc cảm biến tương tự thực chất là một xấp xỉ lượng tử hóa giải thích giới hạn độ chính xác cảm biến — và vì sao 1023 là con số thần kỳ ở Chương 5.</div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 4 — VÀO/RA SỐ ══════════════════ */
    {
      title: 'Chapter 4 — Digital I/O|||Chương 4 — Vào/ra số',
      description: 'Điều khiển và đọc chân số: digitalWrite điều khiển LED, digitalRead đọc nút bấm (kèm bẫy nút nổi).',
      lessons: [
        {
          title: '4.1 — Controlling & reading digital pins|||4.1 — Điều khiển & đọc chân số',
          slug: 'iot102-digital-io',
          type: 'VIDEO',
          description: 'digitalWrite/pinMode điều khiển LED; digitalRead đọc nút; bẫy chân nổi và điện trở kéo (pull-up/down).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Digital I/O — on, off, and reacting</h2>
<p class="lead">Digital pins deal in two states: HIGH (5V) or LOW (0V). You <em>write</em> to a pin to control something (an LED), and <em>read</em> a pin to sense something (a button). This is the foundation of every interactive device.</p>

<h3>Output: control an LED. Input: read a button.</h3>
<pre><span class="tok-keyword">void</span> <span class="tok-function">setup</span>() {
  <span class="tok-function">pinMode</span>(8, INPUT_PULLUP);  <span class="tok-comment">// button on pin 8</span>
  <span class="tok-function">pinMode</span>(13, OUTPUT);       <span class="tok-comment">// LED on pin 13</span>
}
<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-keyword">if</span> (<span class="tok-function">digitalRead</span>(8) == LOW)   <span class="tok-comment">// pressed (pull-up: LOW = pressed)</span>
    <span class="tok-function">digitalWrite</span>(13, HIGH);
  <span class="tok-keyword">else</span>
    <span class="tok-function">digitalWrite</span>(13, LOW);
}</pre>
<div class="out">Press the button → LED lights. Release → LED off. Your first program that reacts to the physical world.</div>

<div class="pitfall"><b>The floating pin trap.</b> A button only connects the pin when pressed. When released, the pin is connected to <em>nothing</em> — it "floats" and reads random HIGH/LOW noise. The fix is a <b>pull resistor</b> that gently ties the pin to a known state. Arduino has a built-in one: <span class="badge">INPUT_PULLUP</span> ties the pin HIGH, so a press (to GND) reads LOW. This is why the code above checks for LOW.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Switch bounce — why one press registers as many.</b> A mechanical button's metal contacts physically bounce for a few milliseconds when pressed, so <span class="badge">digitalRead</span> may see several rapid HIGH/LOW flips for one press. A naive counter counts 3 presses for 1. The fix is <b>debouncing</b>: ignore changes for ~20–50ms after the first, or check the state is stable. Every real button in every device you own is debounced — this is the classic embedded gotcha, absent from the basic slides.</div>

<a class="link-card exphub" href="/exp-hub/iot102-cai-dat-arduino?ref=%2Fcourses%2Finternet-of-things%2Flearn&reflabel=IOT102%20%E2%80%94%20Internet%20of%20Things" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Build this in Tinkercad</span><span class="lc-sub">Simulate the button+LED circuit — no hardware needed.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Vào/ra số — bật, tắt, và phản ứng</h2>
<p class="lead">Chân số làm việc với hai trạng thái: HIGH (5V) hoặc LOW (0V). Bạn <em>ghi</em> vào một chân để điều khiển thứ gì đó (một LED), và <em>đọc</em> một chân để cảm nhận thứ gì đó (một nút). Đây là nền của mọi thiết bị tương tác.</p>

<h3>Ngõ ra: điều khiển LED. Ngõ vào: đọc nút.</h3>
<pre><span class="tok-keyword">void</span> <span class="tok-function">setup</span>() {
  <span class="tok-function">pinMode</span>(8, INPUT_PULLUP);  <span class="tok-comment">// nút ở chân 8</span>
  <span class="tok-function">pinMode</span>(13, OUTPUT);       <span class="tok-comment">// LED ở chân 13</span>
}
<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-keyword">if</span> (<span class="tok-function">digitalRead</span>(8) == LOW)   <span class="tok-comment">// nhấn (pull-up: LOW = nhấn)</span>
    <span class="tok-function">digitalWrite</span>(13, HIGH);
  <span class="tok-keyword">else</span>
    <span class="tok-function">digitalWrite</span>(13, LOW);
}</pre>
<div class="out">Nhấn nút → LED sáng. Thả → LED tắt. Chương trình đầu tiên của bạn phản ứng với thế giới vật lý.</div>

<div class="pitfall"><b>Bẫy chân nổi (floating).</b> Một nút chỉ nối chân khi nhấn. Khi thả, chân nối với <em>không gì cả</em> — nó "nổi" và đọc nhiễu HIGH/LOW ngẫu nhiên. Cách sửa là một <b>điện trở kéo</b> nhẹ nhàng buộc chân về một trạng thái xác định. Arduino có sẵn một cái: <span class="badge">INPUT_PULLUP</span> buộc chân lên HIGH, nên một lần nhấn (xuống GND) đọc ra LOW. Đó là lý do code trên kiểm LOW.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Dội phím (bounce) — vì sao một lần nhấn thành nhiều.</b> Tiếp điểm kim loại của nút cơ dội vật lý vài mili-giây khi nhấn, nên <span class="badge">digitalRead</span> có thể thấy vài lần lật HIGH/LOW nhanh cho một lần nhấn. Một bộ đếm ngây thơ đếm 3 lần cho 1. Cách sửa là <b>chống dội (debounce)</b>: bỏ qua thay đổi trong ~20–50ms sau lần đầu, hoặc kiểm trạng thái đã ổn định. Mọi nút thật trong mọi thiết bị bạn có đều được chống dội — đây là cái bẫy nhúng kinh điển, vắng mặt trong slide cơ bản.</div>

<a class="link-card exphub" href="/exp-hub/iot102-cai-dat-arduino?ref=%2Fcourses%2Finternet-of-things%2Flearn&reflabel=IOT102%20%E2%80%94%20Internet%20of%20Things" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Dựng mạch này trong Tinkercad</span><span class="lc-sub">Mô phỏng mạch nút+LED — không cần phần cứng.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 1 — IoT concepts, Arduino & digital I/O|||Quiz 1 — Khái niệm IoT, Arduino & vào/ra số',
          slug: 'iot102-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra khái niệm IoT, Arduino, điện tử cơ bản và vào/ra số.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'In an Arduino sketch, code that runs once at power-on goes in…|||Trong sketch Arduino, code chạy một lần khi bật nguồn đặt ở…', options: ['loop()', 'setup()', 'main()', 'start()'], correctIndex: 1, points: 1 },
              { question: 'Ohm\'s law states that…|||Định luật Ohm nói rằng…', options: ['V = I + R', 'V = I × R', 'V = I / R', 'V = R / I'], correctIndex: 1, points: 1 },
              { question: 'An LED needs a series resistor because…|||LED cần một điện trở nối tiếp vì…', options: ['it makes it brighter|||làm nó sáng hơn', 'without it, too much current burns the LED out|||không có nó, dòng quá lớn đốt cháy LED', 'it stores data|||nó lưu dữ liệu', 'it is decorative|||để trang trí'], correctIndex: 1, points: 1 },
              { question: 'A button pin that is connected to nothing when released will…|||Một chân nút không nối gì khi thả sẽ…', options: ['read a steady LOW|||đọc LOW ổn định', 'float and read random noise (needs a pull resistor)|||nổi và đọc nhiễu ngẫu nhiên (cần điện trở kéo)', 'break the Arduino|||làm hỏng Arduino', 'always read HIGH|||luôn đọc HIGH'], correctIndex: 1, points: 1 },
              { question: 'The four-layer IoT architecture is device →|||Kiến trúc IoT bốn tầng là thiết bị →', options: ['application → network → processing', 'network → processing → application', 'processing → application → network', 'application → processing → network'], correctIndex: 1, points: 1 },
              { question: 'Edge computing in IoT means… (beyond-syllabus)|||Điện toán biên trong IoT nghĩa là… (ngoài giáo trình)', options: ['sending all data to the cloud|||gửi mọi dữ liệu lên cloud', 'the device makes simple decisions locally to cut latency/bandwidth|||thiết bị tự ra quyết định đơn giản để giảm độ trễ/băng thông', 'using the newest chip|||dùng chip mới nhất', 'a type of sensor|||một loại cảm biến'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 5 — VÀO/RA TƯƠNG TỰ ══════════════════ */
    {
      title: 'Chapter 5 — Analog I/O & PWM|||Chương 5 — Vào/ra tương tự & PWM',
      description: 'Đọc cảm biến tương tự (analogRead 0–1023) và giả lập ngõ ra tương tự bằng PWM (analogWrite).',
      lessons: [
        {
          title: '5.1 — analogRead, the ADC & PWM output|||5.1 — analogRead, ADC & ngõ ra PWM',
          slug: 'iot102-analog-io',
          type: 'VIDEO',
          description: 'analogRead trả 0–1023; đổi ra điện áp/đại lượng thật; và analogWrite (PWM) để chỉnh độ sáng/tốc độ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Analog — reading a range, not just on/off</h2>
<p class="lead">The real world is analog: light, temperature, a knob's position are smooth ranges. <span class="badge">analogRead(A0)</span> uses the chip's ADC to turn a 0–5V voltage into a number from <strong>0 to 1023</strong> (10-bit resolution).</p>
<pre><span class="tok-type">int</span> raw = <span class="tok-function">analogRead</span>(A0);        <span class="tok-comment">// 0..1023</span>
<span class="tok-type">float</span> volts = raw * 5.0 / 1023;  <span class="tok-comment">// back to a voltage</span></pre>
<div class="out"><b>Worked example:</b> a light sensor reads raw = 512. Voltage = 512 × 5.0 / 1023 ≈ <b>2.5V</b> — half of full scale, so "medium brightness". Map it to a percent with <span class="badge">map(raw, 0, 1023, 0, 100)</span>.</div>

<h3>Analog output — the PWM trick</h3>
<p>The Arduino cannot truly output 2.5V, but <span class="badge">analogWrite(pin, 0..255)</span> fakes it with <strong>PWM</strong> (Pulse Width Modulation): switching the pin on/off very fast, so on average it <em>looks</em> like a lower voltage. This dims an LED or slows a motor.</p>
<div class="out"><span class="badge">analogWrite(9, 128)</span> = 50% duty cycle = LED at half brightness. Only works on PWM (~) pins.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why 1023 and not 1000? Resolution &amp; the map() function.</b> 10 bits gives 2¹⁰ = 1024 distinct values (0–1023). That is your sensor's <em>resolution</em>: the smallest change it can detect is 5V/1024 ≈ 4.9mV. A 12-bit ADC (on fancier chips) gives 4096 steps — finer detail. Understanding resolution tells you when a cheap sensor is "good enough" and when you need better hardware — a real engineering decision beyond the intro slides.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Tương tự — đọc một dải, không chỉ bật/tắt</h2>
<p class="lead">Thế giới thật là tương tự: ánh sáng, nhiệt độ, vị trí một núm vặn là những dải liên tục. <span class="badge">analogRead(A0)</span> dùng ADC của chip biến điện áp 0–5V thành một số từ <strong>0 tới 1023</strong> (độ phân giải 10-bit).</p>
<pre><span class="tok-type">int</span> raw = <span class="tok-function">analogRead</span>(A0);        <span class="tok-comment">// 0..1023</span>
<span class="tok-type">float</span> volts = raw * 5.0 / 1023;  <span class="tok-comment">// đổi lại ra điện áp</span></pre>
<div class="out"><b>Ví dụ có lời giải:</b> một cảm biến ánh sáng đọc raw = 512. Điện áp = 512 × 5.0 / 1023 ≈ <b>2.5V</b> — nửa thang, nên "độ sáng trung bình". Ánh xạ ra phần trăm bằng <span class="badge">map(raw, 0, 1023, 0, 100)</span>.</div>

<h3>Ngõ ra tương tự — mẹo PWM</h3>
<p>Arduino không xuất được đúng 2.5V, nhưng <span class="badge">analogWrite(pin, 0..255)</span> giả lập bằng <strong>PWM</strong> (điều chế độ rộng xung): bật/tắt chân rất nhanh, nên trung bình nó <em>trông như</em> một điện áp thấp hơn. Điều này làm mờ một LED hoặc giảm tốc một động cơ.</p>
<div class="out"><span class="badge">analogWrite(9, 128)</span> = chu kỳ nhiệm vụ 50% = LED sáng một nửa. Chỉ chạy trên chân PWM (~).</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao 1023 chứ không phải 1000? Độ phân giải &amp; hàm map().</b> 10 bit cho 2¹⁰ = 1024 giá trị phân biệt (0–1023). Đó là <em>độ phân giải</em> của cảm biến: thay đổi nhỏ nhất nó phát hiện được là 5V/1024 ≈ 4.9mV. Một ADC 12-bit (trên chip xịn hơn) cho 4096 bước — chi tiết hơn. Hiểu độ phân giải cho bạn biết khi nào cảm biến rẻ là "đủ tốt" và khi nào cần phần cứng tốt hơn — một quyết định kỹ thuật thật, vượt slide nhập môn.</div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 6 — CẢM BIẾN & CƠ CẤU CHẤP HÀNH ══════════════════ */
    {
      title: 'Chapter 6 — Sensors & actuators|||Chương 6 — Cảm biến & cơ cấu chấp hành',
      description: 'Cảm biến (đầu vào: nhiệt độ, siêu âm, ánh sáng) và cơ cấu chấp hành (đầu ra: servo, relay, buzzer).',
      lessons: [
        {
          title: '6.1 — Sensing the world & acting on it|||6.1 — Cảm nhận thế giới & tác động lên nó',
          slug: 'iot102-cam-bien',
          type: 'VIDEO',
          description: 'Phân biệt sensor (input) vs actuator (output); dùng thư viện; ví dụ cảm biến siêu âm + servo.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Sensors in, actuators out</h2>
<p class="lead">Every IoT device does two things: it <strong>senses</strong> (reads the world) and <strong>acts</strong> (changes it). Learn the vocabulary and the pattern, and any new component becomes plug-and-play via its library.</p>
<table>
  <thead><tr><th>Sensors (input)</th><th>Actuators (output)</th></tr></thead>
  <tbody>
    <tr><td>temperature (DHT11/LM35)</td><td>servo motor (moves an arm)</td></tr>
    <tr><td>ultrasonic distance (HC-SR04)</td><td>relay (switches high-power devices)</td></tr>
    <tr><td>light (LDR), motion (PIR)</td><td>buzzer, LED, DC motor</td></tr>
  </tbody>
</table>
<p>Most sensors come with an Arduino <strong>library</strong> that hides the low-level timing. You <span class="badge">#include</span> it, create an object, and call a friendly method:</p>
<pre><span class="tok-comment">// ultrasonic distance → open a servo gate if something is near</span>
<span class="tok-type">long</span> cm = <span class="tok-function">readDistance</span>();     <span class="tok-comment">// from the sensor library</span>
<span class="tok-keyword">if</span> (cm &lt; 20) gate.<span class="tok-function">write</span>(90);  <span class="tok-comment">// servo opens</span>
<span class="tok-keyword">else</span>        gate.<span class="tok-function">write</span>(0);   <span class="tok-comment">// servo closes</span></pre>
<div class="out">This tiny logic is an automatic door: sense distance (sensor) → move a servo (actuator). Combine a few of these and you have a real IoT project.</div>

<div class="pitfall"><b>Trap:</b> a servo or motor draws far more current than the Arduino's 5V pin can supply. Powering motors directly from the board resets or fries it. Use a <b>separate power supply</b> and a driver/relay for anything with a motor — share the GND.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Blocking delay() vs non-blocking millis().</b> <span class="badge">delay(1000)</span> freezes the entire program for a second — during which it cannot read a sensor or respond to a button. Real devices must do many things "at once", so pros avoid delay() and instead check <span class="badge">millis()</span> (a running clock) to time actions without stopping. This is the single biggest step from a toy blink sketch to a responsive device that senses and acts simultaneously.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Cảm biến vào, cơ cấu chấp hành ra</h2>
<p class="lead">Mọi thiết bị IoT làm hai việc: nó <strong>cảm nhận</strong> (đọc thế giới) và <strong>tác động</strong> (thay đổi nó). Học từ vựng và mẫu hình, thì bất kỳ linh kiện mới nào cũng thành cắm-là-chạy qua thư viện của nó.</p>
<table>
  <thead><tr><th>Cảm biến (đầu vào)</th><th>Cơ cấu chấp hành (đầu ra)</th></tr></thead>
  <tbody>
    <tr><td>nhiệt độ (DHT11/LM35)</td><td>động cơ servo (di chuyển một cánh tay)</td></tr>
    <tr><td>khoảng cách siêu âm (HC-SR04)</td><td>relay (đóng/ngắt thiết bị công suất cao)</td></tr>
    <tr><td>ánh sáng (LDR), chuyển động (PIR)</td><td>còi, LED, động cơ DC</td></tr>
  </tbody>
</table>
<p>Hầu hết cảm biến đi kèm một <strong>thư viện</strong> Arduino giấu phần định thời cấp thấp. Bạn <span class="badge">#include</span> nó, tạo một đối tượng, và gọi một phương thức thân thiện:</p>
<pre><span class="tok-comment">// khoảng cách siêu âm → mở cổng servo nếu có vật gần</span>
<span class="tok-type">long</span> cm = <span class="tok-function">readDistance</span>();     <span class="tok-comment">// từ thư viện cảm biến</span>
<span class="tok-keyword">if</span> (cm &lt; 20) gate.<span class="tok-function">write</span>(90);  <span class="tok-comment">// servo mở</span>
<span class="tok-keyword">else</span>        gate.<span class="tok-function">write</span>(0);   <span class="tok-comment">// servo đóng</span></pre>
<div class="out">Logic tí hon này là một cửa tự động: cảm nhận khoảng cách (cảm biến) → di chuyển servo (cơ cấu chấp hành). Ghép vài cái như vậy là bạn có một project IoT thật.</div>

<div class="pitfall"><b>Bẫy:</b> một servo hay động cơ hút dòng lớn hơn nhiều so với chân 5V của Arduino cấp được. Cấp nguồn động cơ trực tiếp từ board làm nó reset hoặc cháy. Dùng một <b>nguồn riêng</b> và một driver/relay cho bất cứ thứ gì có động cơ — chung chân GND.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>delay() chặn vs millis() không chặn.</b> <span class="badge">delay(1000)</span> đóng băng cả chương trình một giây — trong lúc đó nó không đọc được cảm biến hay phản hồi nút. Thiết bị thật phải làm nhiều việc "cùng lúc", nên dân chuyên tránh delay() và thay bằng kiểm <span class="badge">millis()</span> (một đồng hồ đang chạy) để định thời hành động mà không dừng. Đây là bước lớn nhất từ một sketch nhấp nháy đồ chơi tới một thiết bị phản hồi vừa cảm nhận vừa tác động đồng thời.</div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 7 — TRUYỀN THÔNG & MẠNG ══════════════════ */
    {
      title: 'Chapter 7 — Communication & networking|||Chương 7 — Truyền thông & mạng',
      description: 'Serial (gỡ lỗi & PC), I2C/SPI (giữa các chip), và WiFi (ESP) để đưa dữ liệu lên internet.',
      lessons: [
        {
          title: '7.1 — Serial, I2C/SPI & WiFi|||7.1 — Serial, I2C/SPI & WiFi',
          slug: 'iot102-truyen-thong',
          type: 'VIDEO',
          description: 'Serial để debug/nói với PC; I2C/SPI nối nhiều linh kiện; WiFi (ESP8266/ESP32) đưa "thing" lên mạng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Making things talk — and reach the internet</h2>
<p class="lead">A device that cannot communicate is not really "IoT". Three protocols cover almost everything, from debugging on your desk to sending data across the world.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Serial (UART)</b> — the Arduino talks to your PC over USB. Your #1 debugging tool: <span class="badge">Serial.println(value)</span> prints sensor readings to the Serial Monitor. Always your first step when something misbehaves.</div>
  <div class="lz-layer"><b>I2C &amp; SPI</b> — short-distance buses between chips on the same board (a display, an RTC clock, extra sensors). I2C uses just 2 wires and addresses many devices; SPI is faster with more wires.</div>
  <div class="lz-layer"><b>WiFi</b> — modules like <b>ESP8266/ESP32</b> connect the device to your network and the internet. This is what turns a local gadget into a true IoT device that reports to a cloud.</div>
</div>
<pre>Serial.<span class="tok-function">begin</span>(9600);            <span class="tok-comment">// in setup(), then:</span>
Serial.<span class="tok-function">print</span>(<span class="tok-string">"Temp = "</span>);
Serial.<span class="tok-function">println</span>(temperature);  <span class="tok-comment">// watch it live in the Serial Monitor</span></pre>

<div class="note-ct">The networking layer is where IoT meets the web skills from your other courses: the device sends an HTTP request (or MQTT message) to a server, which stores it and shows a dashboard — the four-layer architecture from Chapter 1 in action.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>MQTT — the protocol built for IoT.</b> HTTP is heavy for tiny devices. <b>MQTT</b> is a lightweight <em>publish/subscribe</em> protocol designed for constrained IoT: a device "publishes" a reading to a topic (e.g. <span class="badge">home/livingroom/temp</span>), and any dashboard "subscribed" to that topic gets it instantly. It uses far less power and bandwidth than HTTP polling — which is why almost every real IoT platform (AWS IoT, Home Assistant) speaks MQTT. Knowing it exists is the difference between a class demo and a production IoT design.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Cho các thứ nói chuyện — và vươn tới internet</h2>
<p class="lead">Một thiết bị không truyền thông được thì không thực sự là "IoT". Ba giao thức bao phủ gần như mọi thứ, từ gỡ lỗi trên bàn tới gửi dữ liệu đi khắp thế giới.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Serial (UART)</b> — Arduino nói với PC qua USB. Công cụ gỡ lỗi số 1 của bạn: <span class="badge">Serial.println(value)</span> in số đọc cảm biến ra Serial Monitor. Luôn là bước đầu khi có gì trục trặc.</div>
  <div class="lz-layer"><b>I2C &amp; SPI</b> — bus khoảng cách ngắn giữa các chip trên cùng board (một màn hình, một đồng hồ RTC, cảm biến thêm). I2C chỉ dùng 2 dây và địa chỉ nhiều thiết bị; SPI nhanh hơn với nhiều dây hơn.</div>
  <div class="lz-layer"><b>WiFi</b> — module như <b>ESP8266/ESP32</b> nối thiết bị vào mạng và internet. Đây là thứ biến một món đồ cục bộ thành một thiết bị IoT thật báo cáo lên cloud.</div>
</div>
<pre>Serial.<span class="tok-function">begin</span>(9600);            <span class="tok-comment">// trong setup(), rồi:</span>
Serial.<span class="tok-function">print</span>(<span class="tok-string">"Temp = "</span>);
Serial.<span class="tok-function">println</span>(temperature);  <span class="tok-comment">// xem trực tiếp trong Serial Monitor</span></pre>

<div class="note-ct">Tầng mạng là nơi IoT gặp kỹ năng web từ các môn khác: thiết bị gửi một HTTP request (hoặc thông điệp MQTT) tới server, server lưu và hiển thị dashboard — kiến trúc bốn tầng từ Chương 1 vào hành động.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>MQTT — giao thức sinh ra cho IoT.</b> HTTP nặng với thiết bị tí hon. <b>MQTT</b> là một giao thức <em>publish/subscribe</em> nhẹ thiết kế cho IoT hạn chế: một thiết bị "publish" một số đọc lên một topic (vd <span class="badge">home/livingroom/temp</span>), và bất kỳ dashboard nào "subscribe" topic đó nhận được ngay. Nó tốn ít điện và băng thông hơn nhiều so với HTTP polling — đó là lý do gần như mọi nền tảng IoT thật (AWS IoT, Home Assistant) nói MQTT. Biết nó tồn tại là khác biệt giữa demo lớp học và thiết kế IoT production.</div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ NÂNG CAO ══════════════════ */
    {
      title: 'Advanced — Beyond the syllabus|||Nâng cao — Ngoài giáo trình',
      description: 'Toàn bộ chương này là học thêm: ngắt (interrupt), bảo mật IoT, và cách dựng một project IoT hoàn chỉnh.',
      lessons: [
        {
          title: 'A.1 — Interrupts, IoT security & your project|||A.1 — Ngắt, bảo mật IoT & project của bạn',
          slug: 'iot102-nang-cao',
          type: 'VIDEO',
          description: 'Ngắt phần cứng (phản ứng tức thì, CLO13); các rủi ro bảo mật IoT; và khung để dựng project cuối kỳ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced · Lesson A.1</span>
<h2><span class="badge">★ Beyond the syllabus</span> From a lab to a real device</h2>
<p class="lead">You can now sense, act, and communicate. These three topics take you from wiring exercises to a device that is responsive, safe, and worth presenting.</p>

<h3>Interrupts (CLO13) — reacting instantly</h3>
<p>In <span class="badge">loop()</span>, the Arduino only notices a button if it happens to be checking at that moment. An <strong>interrupt</strong> flips this: it tells the chip "no matter what you are doing, stop and run this code the instant pin 2 changes". Essential for catching fast or critical events (an emergency stop, a pulse counter) that a slow loop would miss.</p>
<pre><span class="tok-function">attachInterrupt</span>(<span class="tok-function">digitalPinToInterrupt</span>(2), onPulse, RISING);</pre>

<h3>IoT security (CLO4) — the layer everyone forgets</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Weak defaults</b> — devices shipped with "admin/admin" are hijacked en masse (the Mirai botnet used exactly this). Change credentials.</div>
  <div class="lz-layer"><b>No encryption</b> — data sent in plaintext can be read/altered. Use TLS/HTTPS or encrypted MQTT.</div>
  <div class="lz-layer"><b>No updates</b> — a device you cannot patch stays vulnerable forever. Plan for firmware updates.</div>
</div>

<h3>Building your project</h3>
<div class="lz-flow">
  <div class="lz-step">Pick a real problem (plant watering, parking sensor)</div>
  <div class="lz-step">Sensor(s) → Arduino logic → actuator(s)</div>
  <div class="lz-step">Add WiFi to report/control remotely</div>
  <div class="lz-step">Prototype in Tinkercad, then wire it for real</div>
  <div class="lz-step">Present: the problem, the circuit, a live demo</div>
</div>
<div class="note-ct">The best projects are simple but complete: they sense something real, decide, act, and report. A working automatic plant-waterer beats an ambitious idea that does not run — exactly like the practical exams in your other courses.</div>

<a class="link-card exphub" href="/exp-hub/iot102-cai-dat-arduino?ref=%2Fcourses%2Finternet-of-things%2Flearn&reflabel=IOT102%20%E2%80%94%20Internet%20of%20Things" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Prototype your project in Tinkercad</span><span class="lc-sub">Build &amp; simulate before touching hardware.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao · Bài A.1</span>
<h2><span class="badge">★ Ngoài giáo trình</span> Từ một lab tới một thiết bị thật</h2>
<p class="lead">Giờ bạn cảm nhận, tác động và truyền thông được. Ba chủ đề này đưa bạn từ bài tập đấu dây tới một thiết bị phản hồi nhanh, an toàn, và đáng để trình bày.</p>

<h3>Ngắt (CLO13) — phản ứng tức thì</h3>
<p>Trong <span class="badge">loop()</span>, Arduino chỉ nhận ra một nút nếu đúng lúc đó nó đang kiểm. Một <strong>ngắt (interrupt)</strong> lật điều này: nó bảo chip "dù đang làm gì, dừng lại và chạy đoạn code này ngay khi chân 2 thay đổi". Thiết yếu để bắt các sự kiện nhanh hoặc quan trọng (một nút dừng khẩn, một bộ đếm xung) mà vòng lặp chậm sẽ bỏ lỡ.</p>
<pre><span class="tok-function">attachInterrupt</span>(<span class="tok-function">digitalPinToInterrupt</span>(2), onPulse, RISING);</pre>

<h3>Bảo mật IoT (CLO4) — tầng ai cũng quên</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Mặc định yếu</b> — thiết bị xuất xưởng với "admin/admin" bị chiếm hàng loạt (botnet Mirai dùng đúng điều này). Hãy đổi thông tin đăng nhập.</div>
  <div class="lz-layer"><b>Không mã hóa</b> — dữ liệu gửi dạng thô có thể bị đọc/sửa. Dùng TLS/HTTPS hoặc MQTT mã hóa.</div>
  <div class="lz-layer"><b>Không cập nhật</b> — một thiết bị không vá được sẽ dễ tổn thương mãi. Lên kế hoạch cập nhật firmware.</div>
</div>

<h3>Dựng project của bạn</h3>
<div class="lz-flow">
  <div class="lz-step">Chọn một vấn đề thật (tưới cây, cảm biến bãi đỗ)</div>
  <div class="lz-step">Cảm biến → logic Arduino → cơ cấu chấp hành</div>
  <div class="lz-step">Thêm WiFi để báo cáo/điều khiển từ xa</div>
  <div class="lz-step">Prototype trong Tinkercad, rồi đấu thật</div>
  <div class="lz-step">Trình bày: vấn đề, mạch, demo trực tiếp</div>
</div>
<div class="note-ct">Project tốt nhất là đơn giản nhưng hoàn chỉnh: cảm nhận điều gì đó thật, quyết định, tác động, và báo cáo. Một máy tưới cây tự động chạy được hơn một ý tưởng tham vọng không chạy — đúng như thi thực hành ở các môn khác.</div>

<a class="link-card exphub" href="/exp-hub/iot102-cai-dat-arduino?ref=%2Fcourses%2Finternet-of-things%2Flearn&reflabel=IOT102%20%E2%80%94%20Internet%20of%20Things" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Prototype project trong Tinkercad</span><span class="lc-sub">Dựng &amp; mô phỏng trước khi chạm phần cứng.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 2 — Analog, sensors, communication & project|||Quiz 2 — Tương tự, cảm biến, truyền thông & project',
          slug: 'iot102-quiz-2',
          type: 'QUIZ',
          description: 'Kiểm tra analog/PWM, cảm biến/actuator, truyền thông và chủ đề nâng cao.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'analogRead() on an Arduino UNO returns a value in the range…|||analogRead() trên Arduino UNO trả giá trị trong khoảng…', options: ['0–255', '0–1023', '0–5', '0–100'], correctIndex: 1, points: 1 },
              { question: 'analogWrite() produces an analog-like output using…|||analogWrite() tạo ngõ ra giống tương tự bằng…', options: ['a real DAC|||một DAC thật', 'PWM (fast on/off switching)|||PWM (bật/tắt nhanh)', 'a resistor|||một điện trở', 'Serial'], correctIndex: 1, points: 1 },
              { question: 'A servo or motor should be powered by… (a common trap)|||Một servo hay động cơ nên được cấp nguồn từ… (bẫy phổ biến)', options: ['the Arduino 5V pin directly|||chân 5V Arduino trực tiếp', 'a separate supply, sharing GND with the Arduino|||một nguồn riêng, chung GND với Arduino', 'an analog pin|||một chân analog', 'the USB data line|||dây dữ liệu USB'], correctIndex: 1, points: 1 },
              { question: 'Your #1 tool for debugging an Arduino is…|||Công cụ số 1 để gỡ lỗi Arduino là…', options: ['analogWrite|||analogWrite', 'Serial.println to the Serial Monitor|||Serial.println ra Serial Monitor', 'a bigger resistor|||điện trở lớn hơn', 'WiFi'], correctIndex: 1, points: 1 },
              { question: 'To react instantly to a fast event regardless of loop() timing, use… (beyond-syllabus)|||Để phản ứng tức thì với sự kiện nhanh bất kể loop(), dùng… (ngoài giáo trình)', options: ['delay()', 'an interrupt|||một ngắt', 'a longer loop|||một vòng lặp dài hơn', 'analogRead'], correctIndex: 1, points: 1 },
              { question: 'MQTT is preferred over HTTP for IoT because it is… (beyond-syllabus)|||MQTT được ưu tiên hơn HTTP cho IoT vì nó… (ngoài giáo trình)', options: ['older|||cũ hơn', 'lightweight publish/subscribe, using less power &amp; bandwidth|||nhẹ, publish/subscribe, tốn ít điện &amp; băng thông', 'only for browsers|||chỉ cho trình duyệt', 'unable to encrypt|||không mã hóa được'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* END-SECTIONS-MARKER */
  ],
};
