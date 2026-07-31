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
  <div class="kv"><span class="k">Total hours</span><span class="v">150h <small>22.5h contact + 22.5h online + 4.5h project presentation + 1h exam</small></span></div>
  <div class="kv"><span class="k">Sessions</span><span class="v">60 <small>45 min each — offline labs + online theory</small></span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">None</span></div>
  <div class="kv"><span class="k">Grading scale</span><span class="v">10 <small>pass when average ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Eligibility</span><span class="v">Attend ≥ 80% of contact sessions</span></div>
</div>

<h3>The six graded components (official syllabus)</h3>
<table>
  <thead><tr><th>Component</th><th>Parts</th><th>Weight</th><th>Duration / note</th></tr></thead>
  <tbody>
    <tr><td>Active learning</td><td>1</td><td>10%</td><td>from start to finish — participation in class + at-home labs</td></tr>
    <tr><td>Progress test <small>(home practice, exercises, quiz)</small></td><td>2</td><td>10%</td><td>30 min each — sessions 34 &amp; 52</td></tr>
    <tr><td>Presentation</td><td>1</td><td>10%</td><td>group or individual — sessions 26–27</td></tr>
    <tr><td>On-going Project Assessment</td><td>2</td><td><b>30%</b></td><td>checkpoints on your project — sessions 46–47 &amp; 56–57</td></tr>
    <tr><td>Final Project Presentation</td><td>1</td><td><b>20%</b></td><td>30 min per group</td></tr>
    <tr><td>Final exam</td><td>1</td><td>20%</td><td>60 min, multiple choice</td></tr>
  </tbody>
</table>
<div class="out"><b>Do the arithmetic:</b> the project alone (30% on-going + 20% final presentation) is <b>50%</b> of your grade, and the written final is only 20%. IOT102 is decided by what you build, not by what you memorise.</div>

<div class="callout warn">Two duties every week: <strong>watch the online theory videos</strong> and <strong>do the labs</strong> at home. Labs are checked in class ("Practice at home Evaluation" appears in 14 sessions) — arriving with nothing built costs you the Active learning and Progress test marks directly.</div>
<div class="note-ct">This is a maker course: the marks come from things that actually work. A blinking LED you wired and coded yourself teaches more than any slide. Pick your project topic early — the syllabus registers topics at session 15, long before the deadline.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn &amp; cấu trúc điểm</h2>
<p class="lead">Từ syllabus chính thức IOT102. Môn kết hợp video lý thuyết <strong>online</strong> với lab thực hành <strong>offline</strong>, và đỉnh điểm là một <strong>project</strong> bạn tự xây và trình bày.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Tổng giờ</span><span class="v">150h <small>22.5h trên lớp + 22.5h online + 4.5h bảo vệ đồ án + 1h thi</small></span></div>
  <div class="kv"><span class="k">Số buổi</span><span class="v">60 <small>45 phút/buổi — lab offline + lý thuyết online</small></span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">Không</span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10 <small>qua khi trung bình ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Điều kiện dự thi</span><span class="v">Dự ≥ 80% buổi trên lớp</span></div>
</div>

<h3>Sáu cột điểm (theo syllabus chính thức)</h3>
<table>
  <thead><tr><th>Thành phần</th><th>Số lần</th><th>Trọng số</th><th>Thời lượng / ghi chú</th></tr></thead>
  <tbody>
    <tr><td>Active learning <small>(học tích cực)</small></td><td>1</td><td>10%</td><td>xuyên suốt kỳ — tham gia trên lớp + lab ở nhà</td></tr>
    <tr><td>Progress test <small>(kiểm tra lab về nhà, bài tập, quiz)</small></td><td>2</td><td>10%</td><td>30 phút mỗi lần — buổi 34 &amp; 52</td></tr>
    <tr><td>Presentation <small>(thuyết trình)</small></td><td>1</td><td>10%</td><td>nhóm hoặc cá nhân — buổi 26–27</td></tr>
    <tr><td>On-going Project Assessment <small>(chấm tiến độ đồ án)</small></td><td>2</td><td><b>30%</b></td><td>các mốc kiểm tra đồ án — buổi 46–47 &amp; 56–57</td></tr>
    <tr><td>Final Project Presentation <small>(bảo vệ đồ án)</small></td><td>1</td><td><b>20%</b></td><td>30 phút mỗi nhóm</td></tr>
    <tr><td>Thi cuối kỳ</td><td>1</td><td>20%</td><td>60 phút, trắc nghiệm</td></tr>
  </tbody>
</table>
<div class="out"><b>Làm phép tính:</b> riêng đồ án (30% chấm tiến độ + 20% bảo vệ) đã là <b>50%</b> điểm, còn bài thi viết chỉ 20%. IOT102 được quyết định bởi thứ bạn dựng ra, không phải thứ bạn học thuộc.</div>

<div class="callout warn">Hai nhiệm vụ mỗi tuần: <strong>xem video lý thuyết online</strong> và <strong>làm lab</strong> ở nhà. Lab bị kiểm trên lớp ("Practice at home Evaluation" xuất hiện ở 14 buổi) — đến lớp tay không là mất thẳng điểm Active learning và Progress test.</div>
<div class="note-ct">Đây là môn "maker": điểm đến từ những thứ chạy thật. Một đèn LED nhấp nháy bạn tự đấu và code dạy nhiều hơn mọi slide. Hãy chọn đề tài đồ án sớm — syllabus đăng ký đề tài ngay buổi 15, rất lâu trước hạn nộp.</div>
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
        {
          title: '1.2 — The "things": what turns an object into a device|||1.2 — "Vạn vật": điều gì biến một vật thành thiết bị',
          slug: 'iot102-things',
          type: 'VIDEO',
          description: 'Ba khả năng bắt buộc của một "thing"; phân loại thiết bị theo tài nguyên; định danh; và ràng buộc năng lượng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>What exactly is a "thing"?</h2>
<p class="lead">The syllabus devotes a whole online session to this question, and it is not word-play. A chair is not a thing in the IoT sense. A chair that knows whether someone is sitting on it, and can say so, is. Three capabilities turn an object into a <strong>thing</strong>.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>1 · Identity</b> — it can be told apart from every other object. A MAC address, a serial number, a UUID. Without identity, a server receiving "temperature = 27" has no idea <em>whose</em> temperature it is.</div>
  <div class="lz-layer"><b>2 · Sensing and/or acting</b> — it perceives something (temperature, motion, weight) or changes something (a lock, a pump, a lamp). Most things do both.</div>
  <div class="lz-layer"><b>3 · Communication</b> — it can share what it knows. Wired, WiFi, Bluetooth, LoRa, cellular — the medium varies, the requirement does not.</div>
</div>
<div class="out"><b>Test yourself:</b> a digital thermometer on your desk senses and has an identity, but cannot communicate → not IoT. Add a WiFi module that posts readings to a server → now it is a thing.</div>

<h3>Not all things are equal — device classes</h3>
<table>
  <thead><tr><th>Class</th><th>Typical hardware</th><th>What it can do</th></tr></thead>
  <tbody>
    <tr><td>Constrained device</td><td>ATmega328 (Arduino UNO): 2KB RAM, 32KB Flash, 16MHz</td><td>read sensors, simple logic, send short messages</td></tr>
    <tr><td>Capable device</td><td>ESP32: 520KB RAM, WiFi + Bluetooth built in</td><td>everything above + TLS encryption, small web server</td></tr>
    <tr><td>Gateway / edge device</td><td>Raspberry Pi: full Linux, 1GB+ RAM</td><td>collects from many small devices, filters, forwards to cloud</td></tr>
  </tbody>
</table>
<p>A real deployment mixes them: dozens of cheap constrained sensors report to one gateway, which speaks to the cloud. Your UNO in this course is the first class — and that is deliberate, because working inside tight limits is the skill.</p>

<div class="pitfall"><b>Trap:</b> "IoT" is not the same as "embedded" or "M2M". An embedded system (a washing-machine controller) may never connect to anything. M2M is two machines talking over a dedicated link. IoT means many things on a <em>shared, internet-based</em> network, usually with a cloud service in the middle. Exam questions like to test this distinction.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Energy is the real constraint.</b> A sensor buried in a field must run for years on one battery. That single fact reshapes every design decision: the device sleeps 99% of the time and wakes for milliseconds, sends a 12-byte payload instead of a JSON document, and uses a low-power radio (LoRa, NB-IoT) instead of WiFi. When you later see engineers argue about "sleep current in microamps", this is why. Design for the battery first, features second.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Chính xác thì "thing" là gì?</h2>
<p class="lead">Syllabus dành hẳn một buổi online cho câu hỏi này, và đó không phải chơi chữ. Một cái ghế không phải "thing" theo nghĩa IoT. Một cái ghế biết có người đang ngồi lên nó và nói ra được điều đó thì có. Ba khả năng biến một vật thành <strong>thing</strong>.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>1 · Định danh</b> — phân biệt được với mọi vật khác. Một địa chỉ MAC, một số sê-ri, một UUID. Không có định danh, server nhận "nhiệt độ = 27" chẳng biết đó là nhiệt độ <em>của ai</em>.</div>
  <div class="lz-layer"><b>2 · Cảm nhận và/hoặc tác động</b> — nó cảm nhận điều gì đó (nhiệt độ, chuyển động, khối lượng) hoặc thay đổi điều gì đó (một ổ khoá, một máy bơm, một bóng đèn). Phần lớn làm cả hai.</div>
  <div class="lz-layer"><b>3 · Truyền thông</b> — nó chia sẻ được thứ nó biết. Có dây, WiFi, Bluetooth, LoRa, di động — phương tiện thì khác nhau, yêu cầu thì không.</div>
</div>
<div class="out"><b>Tự kiểm:</b> một nhiệt kế số trên bàn bạn có cảm nhận và có định danh, nhưng không truyền thông được → không phải IoT. Thêm một module WiFi đẩy số đọc lên server → giờ nó là một thing.</div>

<h3>Không phải thing nào cũng như nhau — phân lớp thiết bị</h3>
<table>
  <thead><tr><th>Lớp</th><th>Phần cứng tiêu biểu</th><th>Làm được gì</th></tr></thead>
  <tbody>
    <tr><td>Thiết bị hạn chế</td><td>ATmega328 (Arduino UNO): 2KB RAM, 32KB Flash, 16MHz</td><td>đọc cảm biến, logic đơn giản, gửi thông điệp ngắn</td></tr>
    <tr><td>Thiết bị đủ mạnh</td><td>ESP32: 520KB RAM, tích hợp sẵn WiFi + Bluetooth</td><td>mọi thứ ở trên + mã hoá TLS, web server nhỏ</td></tr>
    <tr><td>Gateway / thiết bị biên</td><td>Raspberry Pi: Linux đầy đủ, 1GB+ RAM</td><td>gom từ nhiều thiết bị nhỏ, lọc, chuyển tiếp lên cloud</td></tr>
  </tbody>
</table>
<p>Một hệ thật trộn cả ba: hàng chục cảm biến hạn chế giá rẻ báo về một gateway, gateway nói chuyện với cloud. Con UNO của bạn trong môn này thuộc lớp đầu — và đó là chủ ý, vì làm việc trong giới hạn chật hẹp mới là kỹ năng.</p>

<div class="pitfall"><b>Bẫy:</b> "IoT" không đồng nghĩa với "nhúng (embedded)" hay "M2M". Một hệ nhúng (bộ điều khiển máy giặt) có thể chẳng bao giờ nối với gì. M2M là hai máy nói chuyện qua một đường riêng. IoT nghĩa là nhiều thing trên một mạng <em>dùng chung, nền internet</em>, thường có một dịch vụ cloud ở giữa. Đề thi rất thích kiểm phân biệt này.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Năng lượng mới là ràng buộc thật.</b> Một cảm biến chôn ngoài đồng phải chạy nhiều năm bằng một viên pin. Chỉ một sự thật đó đã định hình lại mọi quyết định thiết kế: thiết bị ngủ 99% thời gian và thức dậy trong vài mili-giây, gửi một gói 12 byte thay vì một tài liệu JSON, và dùng sóng tiêu thụ thấp (LoRa, NB-IoT) thay vì WiFi. Sau này khi bạn thấy các kỹ sư tranh luận về "dòng ngủ tính bằng micro-ampe", đây là lý do. Thiết kế cho viên pin trước, cho tính năng sau.</div>
</div>
`,
        },
        {
          title: '1.3 — IoT applications across industries|||1.3 — Ứng dụng IoT theo ngành',
          slug: 'iot102-ung-dung',
          type: 'VIDEO',
          description: 'Sáu lĩnh vực ứng dụng thật với kiến trúc tương ứng — nguồn ý tưởng trực tiếp cho đồ án cuối kỳ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Where IoT actually earns its keep</h2>
<p class="lead">CLO1 asks you to understand IoT <em>applications</em>, and the final project asks you to pick one. Read this lesson as a menu: each row is a project topic you could realistically build with the course KIT.</p>
<table>
  <thead><tr><th>Domain</th><th>What it senses</th><th>What it does about it</th><th>Buildable with the KIT?</th></tr></thead>
  <tbody>
    <tr><td>Smart home</td><td>motion (PIR), light (LDR), gas, door state</td><td>switch lamps, sound an alarm, unlock</td><td>Yes — the classic project</td></tr>
    <tr><td>Smart agriculture</td><td>soil moisture, temperature, humidity</td><td>drive a pump, open a vent</td><td>Yes — soil sensor + relay</td></tr>
    <tr><td>Healthcare</td><td>heart rate, body temperature, fall detection</td><td>alert a phone or nurse station</td><td>Partly — pulse sensor exists</td></tr>
    <tr><td>Smart city</td><td>parking occupancy, air quality, bin fill level</td><td>guide drivers, schedule collection</td><td>Yes — ultrasonic parking sensor</td></tr>
    <tr><td>Industry 4.0</td><td>vibration, motor current, machine hours</td><td>predictive maintenance before a breakdown</td><td>Partly — vibration sensor</td></tr>
    <tr><td>Logistics</td><td>GPS position, container temperature</td><td>cold-chain proof, live tracking</td><td>Needs a GPS module</td></tr>
  </tbody>
</table>

<h3>The same skeleton every time</h3>
<div class="lz-flow">
  <div class="lz-step">Sense a real quantity</div>
  <div class="lz-step">Decide with a threshold or rule</div>
  <div class="lz-step">Act on the world</div>
  <div class="lz-step">Report so a human can see it</div>
</div>
<div class="out"><b>Worked example — smart parking:</b> an HC-SR04 measures the gap above each bay (sense). If distance &lt; 50cm the bay is occupied (decide). A red/green LED shows status at the bay (act). The count of free bays is sent over WiFi to a display at the entrance (report). Four components you will have built individually by Chapter 7.</div>

<div class="note-ct">Notice how modest each project is. The examiner is not looking for a self-driving car — they are looking for the four steps above done cleanly, reliably, and explained well.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The value is in the data, not the gadget.</b> One connected soil sensor is a novelty. Ten thousand of them, over three seasons, is a dataset that tells a co-op exactly when to irrigate — that is what people pay for. This is why IoT and data analytics/AI are taught close together: the device is the cheap part, the accumulated history is the asset. When you present your project, saying what the collected data <em>enables</em> scores far better than listing components.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>IoT thực sự kiếm cơm ở đâu</h2>
<p class="lead">CLO1 yêu cầu bạn hiểu <em>ứng dụng</em> IoT, và đồ án cuối kỳ yêu cầu bạn chọn một cái. Hãy đọc bài này như một thực đơn: mỗi hàng là một đề tài đồ án bạn có thể dựng thật bằng bộ KIT của môn.</p>
<table>
  <thead><tr><th>Lĩnh vực</th><th>Cảm nhận gì</th><th>Làm gì với nó</th><th>Dựng được bằng KIT?</th></tr></thead>
  <tbody>
    <tr><td>Nhà thông minh</td><td>chuyển động (PIR), ánh sáng (LDR), khí gas, trạng thái cửa</td><td>bật đèn, hú còi, mở khoá</td><td>Được — đề tài kinh điển</td></tr>
    <tr><td>Nông nghiệp thông minh</td><td>độ ẩm đất, nhiệt độ, độ ẩm không khí</td><td>chạy máy bơm, mở cửa thông gió</td><td>Được — cảm biến đất + relay</td></tr>
    <tr><td>Y tế</td><td>nhịp tim, thân nhiệt, phát hiện té ngã</td><td>báo về điện thoại hoặc trạm y tá</td><td>Một phần — có cảm biến nhịp tim</td></tr>
    <tr><td>Đô thị thông minh</td><td>chỗ đỗ trống, chất lượng không khí, mức đầy thùng rác</td><td>chỉ đường cho tài xế, xếp lịch thu gom</td><td>Được — cảm biến đỗ xe siêu âm</td></tr>
    <tr><td>Công nghiệp 4.0</td><td>rung động, dòng động cơ, giờ máy chạy</td><td>bảo trì dự đoán trước khi hỏng</td><td>Một phần — có cảm biến rung</td></tr>
    <tr><td>Logistics</td><td>vị trí GPS, nhiệt độ container</td><td>chứng minh chuỗi lạnh, theo dõi trực tiếp</td><td>Cần thêm module GPS</td></tr>
  </tbody>
</table>

<h3>Vẫn một bộ xương ấy, mọi lần</h3>
<div class="lz-flow">
  <div class="lz-step">Cảm nhận một đại lượng thật</div>
  <div class="lz-step">Quyết định bằng ngưỡng hoặc luật</div>
  <div class="lz-step">Tác động lên thế giới</div>
  <div class="lz-step">Báo cáo để con người thấy</div>
</div>
<div class="out"><b>Ví dụ có lời giải — bãi đỗ thông minh:</b> một HC-SR04 đo khoảng trống phía trên mỗi ô (cảm nhận). Nếu khoảng cách &lt; 50cm thì ô đã có xe (quyết định). Một LED đỏ/xanh hiện trạng thái ngay tại ô (tác động). Số ô trống được gửi qua WiFi tới một bảng hiển thị ở cổng (báo cáo). Bốn thành phần mà tới Chương 7 bạn đã dựng riêng lẻ từng cái.</div>

<div class="note-ct">Để ý mỗi đồ án đều khiêm tốn cỡ nào. Giám khảo không tìm một chiếc xe tự lái — họ tìm bốn bước trên được làm gọn gàng, chạy ổn định, và giải thích tốt.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Giá trị nằm ở dữ liệu, không phải món đồ.</b> Một cảm biến đất nối mạng là một thứ hay hay. Mười nghìn cái, qua ba mùa vụ, là một tập dữ liệu nói chính xác cho hợp tác xã biết khi nào nên tưới — đó mới là thứ người ta trả tiền. Đây là lý do IoT và phân tích dữ liệu/AI được dạy gần nhau: thiết bị là phần rẻ, lịch sử tích luỹ mới là tài sản. Khi bảo vệ đồ án, nói dữ liệu thu được <em>cho phép làm gì</em> ăn điểm cao hơn nhiều so với liệt kê linh kiện.</div>
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
        {
          title: '2.2 — Inside the ATmega328: memory, clock & pins|||2.2 — Bên trong ATmega328: bộ nhớ, xung nhịp & chân',
          slug: 'iot102-atmega328',
          type: 'VIDEO',
          description: 'Ba loại bộ nhớ (Flash/SRAM/EEPROM), xung nhịp 16MHz, giới hạn dòng mỗi chân, và bootloader (CLO11).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>The chip, in detail</h2>
<p class="lead">CLO11 asks you to <em>understand the ATmega328 architecture</em> — not to recite it, but because every practical limit you will hit this semester comes from a number on this page.</p>

<h3>Three kinds of memory — and they are not interchangeable</h3>
<table>
  <thead><tr><th>Memory</th><th>Size</th><th>Holds</th><th>Survives power-off?</th></tr></thead>
  <tbody>
    <tr><td><b>Flash</b></td><td>32 KB <small>(~0.5 KB used by the bootloader)</small></td><td>your compiled program</td><td>Yes</td></tr>
    <tr><td><b>SRAM</b></td><td><b>2 KB</b></td><td>variables while running</td><td>No — wiped on reset</td></tr>
    <tr><td><b>EEPROM</b></td><td>1 KB</td><td>settings you want to keep</td><td>Yes <small>(see Chapter 9)</small></td></tr>
  </tbody>
</table>
<div class="out"><b>Put 2 KB in perspective:</b> one <span class="badge">float</span> is 4 bytes, so SRAM holds about 500 of them — total, including every library's buffers. A single 500-character String can eat a quarter of your RAM.</div>

<h3>The rest of the numbers</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>CPU</b> — 8-bit AVR RISC at <b>16 MHz</b>: roughly 16 million simple instructions per second. Fast for blinking, slow for maths — a <span class="badge">float</span> division costs dozens of cycles.</div>
  <div class="lz-layer"><b>Pins</b> — 14 digital (6 of them PWM-capable), 6 analog inputs, all mapped to internal ports: Arduino pin 13 is really port bit <span class="badge">PB5</span>.</div>
  <div class="lz-layer"><b>Peripherals</b> — 3 timers (Timer0/1/2), 1 UART (Serial), SPI, I2C, a 10-bit ADC, and 2 external interrupt pins (D2, D3).</div>
  <div class="lz-layer"><b>Power</b> — 5V logic. Each pin may source/sink <b>20 mA</b> safely (40 mA absolute maximum), and <b>200 mA</b> total for the whole chip. Power the board from USB (5V) or the barrel jack (7–12V through the on-board regulator).</div>
</div>

<h3>Why you can program it with only a USB cable</h3>
<p>A small program called the <strong>bootloader</strong> sits at the top of Flash. On reset it listens on the serial port for a second: if the IDE is sending a new sketch it writes it into Flash, otherwise it jumps to your program. That is why an UNO needs no separate programmer — and why the board resets every time you open the Serial Monitor.</p>

<div class="pitfall"><b>The trap that produces "my board went crazy" bugs:</b> running out of SRAM. There is no error message — the stack and heap collide silently and the board reboots, prints garbage, or freezes. Cures: avoid the <span class="badge">String</span> class in loops (use <span class="badge">char[]</span>), keep constant text in Flash with <span class="badge">Serial.println(F("text"))</span>, and shrink arrays. Also watch the 200 mA budget: several LEDs plus a servo will exceed it.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Direct port manipulation.</b> <span class="badge">digitalWrite(13, HIGH)</span> is friendly but slow — it checks the pin number, looks up the port, disables PWM, then sets the bit: about 50 clock cycles. Writing the register directly, <span class="badge">PORTB |= (1 &lt;&lt; PB5);</span>, does it in one or two. You will not need this for a blinking LED, but for driving an 8×8 matrix or reading a fast pulse train it is the difference between working and not. It also shows what the Arduino library is hiding: plain register writes on a plain microcontroller.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Con chip, xem kỹ</h2>
<p class="lead">CLO11 yêu cầu bạn <em>hiểu kiến trúc ATmega328</em> — không phải để đọc thuộc, mà vì mọi giới hạn thực tế bạn đụng phải trong kỳ này đều bắt nguồn từ một con số trên trang này.</p>

<h3>Ba loại bộ nhớ — và chúng không thay thế nhau được</h3>
<table>
  <thead><tr><th>Bộ nhớ</th><th>Dung lượng</th><th>Chứa</th><th>Còn khi mất điện?</th></tr></thead>
  <tbody>
    <tr><td><b>Flash</b></td><td>32 KB <small>(~0.5 KB bootloader chiếm)</small></td><td>chương trình đã biên dịch</td><td>Còn</td></tr>
    <tr><td><b>SRAM</b></td><td><b>2 KB</b></td><td>biến trong lúc chạy</td><td>Mất — xoá sạch khi reset</td></tr>
    <tr><td><b>EEPROM</b></td><td>1 KB</td><td>thiết lập bạn muốn giữ lại</td><td>Còn <small>(xem Chương 9)</small></td></tr>
  </tbody>
</table>
<div class="out"><b>Hình dung 2 KB cho dễ:</b> một <span class="badge">float</span> là 4 byte, nên SRAM chứa khoảng 500 cái — tổng cộng, tính cả bộ đệm của mọi thư viện. Một chuỗi String 500 ký tự có thể ngốn một phần tư RAM của bạn.</div>

<h3>Những con số còn lại</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>CPU</b> — AVR RISC 8-bit chạy <b>16 MHz</b>: khoảng 16 triệu lệnh đơn giản mỗi giây. Nhanh với việc nhấp nháy, chậm với toán — một phép chia <span class="badge">float</span> tốn hàng chục chu kỳ.</div>
  <div class="lz-layer"><b>Chân</b> — 14 chân số (6 chân có PWM), 6 ngõ vào analog, tất cả ánh xạ tới các port bên trong: chân 13 của Arduino thực chất là bit port <span class="badge">PB5</span>.</div>
  <div class="lz-layer"><b>Ngoại vi</b> — 3 bộ định thời (Timer0/1/2), 1 UART (Serial), SPI, I2C, một ADC 10-bit, và 2 chân ngắt ngoài (D2, D3).</div>
  <div class="lz-layer"><b>Nguồn</b> — logic 5V. Mỗi chân cấp/hút an toàn <b>20 mA</b> (tối đa tuyệt đối 40 mA), và <b>200 mA</b> cho cả con chip. Cấp nguồn board qua USB (5V) hoặc jack tròn (7–12V qua bộ ổn áp trên board).</div>
</div>

<h3>Vì sao chỉ cần cáp USB là nạp được chương trình</h3>
<p>Một chương trình nhỏ tên <strong>bootloader</strong> nằm ở đỉnh vùng Flash. Khi reset, nó lắng nghe cổng serial trong một giây: nếu IDE đang gửi sketch mới thì nó ghi vào Flash, ngược lại nó nhảy vào chương trình của bạn. Đó là lý do UNO không cần mạch nạp riêng — và cũng là lý do board reset mỗi lần bạn mở Serial Monitor.</p>

<div class="pitfall"><b>Cái bẫy sinh ra loạt lỗi "board tôi phát điên":</b> hết SRAM. Không có thông báo lỗi nào — stack và heap đụng nhau âm thầm rồi board tự khởi động lại, in ra rác, hoặc treo. Thuốc chữa: tránh lớp <span class="badge">String</span> trong vòng lặp (dùng <span class="badge">char[]</span>), giữ văn bản hằng trong Flash bằng <span class="badge">Serial.println(F("text"))</span>, và thu nhỏ mảng. Cũng để mắt tới hạn mức 200 mA: vài LED cộng một servo là vượt.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Thao tác trực tiếp trên thanh ghi port.</b> <span class="badge">digitalWrite(13, HIGH)</span> thân thiện nhưng chậm — nó kiểm số chân, tra ra port, tắt PWM, rồi mới set bit: khoảng 50 chu kỳ. Ghi thẳng thanh ghi, <span class="badge">PORTB |= (1 &lt;&lt; PB5);</span>, làm xong trong một hai chu kỳ. Bạn không cần thứ này để nhấp nháy một LED, nhưng để quét ma trận 8×8 hay đọc một chuỗi xung nhanh thì đó là khác biệt giữa chạy và không chạy. Nó cũng phơi bày thứ thư viện Arduino đang giấu: chỉ là ghi thanh ghi trên một vi điều khiển bình thường.</div>
</div>
`,
        },
        {
          title: '2.3 — The toolchain: Arduino IDE, Tinkercad & Fritzing|||2.3 — Bộ công cụ: Arduino IDE, Tinkercad & Fritzing',
          slug: 'iot102-cong-cu',
          type: 'VIDEO',
          description: 'Cách IDE biên dịch và nạp; mô phỏng bằng Tinkercad; vẽ mạch bằng Fritzing; và các lỗi nạp hay gặp (CLO12).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>Three tools, three jobs</h2>
<p class="lead">CLO12 is simply "know how to use the simulation software" — but sessions 3 and 7 give you three tools, and confusing what each is for wastes hours.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Arduino IDE</b> — write the sketch, compile it, upload it to a <em>real</em> board, and watch output in the Serial Monitor. Your everyday tool.</div>
  <div class="lz-layer"><b>Tinkercad Circuits</b> — a free browser <em>simulator</em>: drag a virtual UNO, wire virtual components, paste your code, press Start Simulation. No hardware, no risk of burning anything.</div>
  <div class="lz-layer"><b>Fritzing</b> — a <em>drawing</em> tool: it makes the neat breadboard picture and the schematic that go in your project report. It does not run code.</div>
</div>

<h3>What actually happens when you press Upload</h3>
<div class="lz-flow">
  <div class="lz-step">.ino is wrapped into C++ (a main() is added around setup/loop)</div>
  <div class="lz-step">avr-gcc compiles it to machine code → a .hex file</div>
  <div class="lz-step">The board is reset; the bootloader wakes and listens</div>
  <div class="lz-step">avrdude streams the .hex over the serial port into Flash</div>
  <div class="lz-step">The board restarts and runs your program</div>
</div>
<p>Two menu choices decide whether that works at all: <b>Tools → Board</b> (Arduino UNO) and <b>Tools → Port</b> (the COM/tty your board appeared on). Both must be right.</p>

<h3>The four upload errors everyone hits</h3>
<table>
  <thead><tr><th>Symptom</th><th>Cause &amp; fix</th></tr></thead>
  <tbody>
    <tr><td><span class="badge">not in sync: resp=0x00</span></td><td>wrong port or wrong board selected — recheck both menus</td></tr>
    <tr><td>Port greyed out / missing</td><td>driver missing (CH340 clones) or a charge-only USB cable</td></tr>
    <tr><td>Upload hangs, then fails</td><td>something is wired to pins 0/1 (RX/TX) — they are the upload lines; unplug them while uploading</td></tr>
    <tr><td>Serial Monitor shows gibberish</td><td>baud rate in the monitor differs from <span class="badge">Serial.begin(9600)</span></td></tr>
  </tbody>
</table>

<div class="note-ct">Workflow that saves time all semester: prototype in <b>Tinkercad</b> until the logic is right, then wire it for real and upload with the <b>IDE</b>, then draw the final circuit in <b>Fritzing</b> for the report. The syllabus builds your project report around exactly these artefacts.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Simulators lie — politely.</b> In Tinkercad, wires have no resistance, the 5V rail never sags, sensors return perfect values, and a button never bounces. That is why a circuit that works in simulation can misbehave on the bench: real supply drops when a motor starts, real sensors are noisy, real buttons bounce (Chapter 4). Use the simulator to check <em>logic</em>, never to prove <em>electrical</em> correctness. Knowing the limits of your tools is itself an engineering skill.</div>

<a class="link-card exphub" href="/exp-hub/iot102-cai-dat-arduino?ref=%2Fcourses%2Finternet-of-things%2Flearn&reflabel=IOT102%20%E2%80%94%20Internet%20of%20Things" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Install the IDE &amp; open your first simulation</span><span class="lc-sub">Board/port setup, drivers, and a ready Tinkercad circuit.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Ba công cụ, ba nhiệm vụ</h2>
<p class="lead">CLO12 chỉ nói "biết dùng phần mềm mô phỏng" — nhưng buổi 3 và 7 đưa cho bạn ba công cụ, và lẫn lộn công dụng của chúng làm mất hàng giờ.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Arduino IDE</b> — viết sketch, biên dịch, nạp lên board <em>thật</em>, và xem kết quả trong Serial Monitor. Công cụ hằng ngày của bạn.</div>
  <div class="lz-layer"><b>Tinkercad Circuits</b> — một <em>trình mô phỏng</em> chạy trên trình duyệt, miễn phí: kéo một UNO ảo, đấu linh kiện ảo, dán code vào, bấm Start Simulation. Không cần phần cứng, không sợ cháy gì.</div>
  <div class="lz-layer"><b>Fritzing</b> — công cụ <em>vẽ</em>: nó tạo ra hình breadboard đẹp và sơ đồ nguyên lý để đưa vào báo cáo đồ án. Nó không chạy code.</div>
</div>

<h3>Chuyện gì thực sự xảy ra khi bạn bấm Upload</h3>
<div class="lz-flow">
  <div class="lz-step">.ino được bọc thành C++ (thêm một main() quanh setup/loop)</div>
  <div class="lz-step">avr-gcc biên dịch ra mã máy → một file .hex</div>
  <div class="lz-step">Board bị reset; bootloader thức dậy và lắng nghe</div>
  <div class="lz-step">avrdude bơm file .hex qua cổng serial vào Flash</div>
  <div class="lz-step">Board khởi động lại và chạy chương trình của bạn</div>
</div>
<p>Hai lựa chọn trong menu quyết định việc đó có chạy hay không: <b>Tools → Board</b> (Arduino UNO) và <b>Tools → Port</b> (cổng COM/tty mà board hiện ra). Cả hai phải đúng.</p>

<h3>Bốn lỗi nạp mà ai cũng gặp</h3>
<table>
  <thead><tr><th>Triệu chứng</th><th>Nguyên nhân &amp; cách sửa</th></tr></thead>
  <tbody>
    <tr><td><span class="badge">not in sync: resp=0x00</span></td><td>sai cổng hoặc sai board — kiểm lại cả hai menu</td></tr>
    <tr><td>Cổng bị mờ / không có</td><td>thiếu driver (board nhái dùng CH340) hoặc cáp USB chỉ sạc, không truyền dữ liệu</td></tr>
    <tr><td>Nạp treo rồi báo lỗi</td><td>có thứ gì đó đang nối vào chân 0/1 (RX/TX) — đó chính là đường nạp; rút ra khi nạp</td></tr>
    <tr><td>Serial Monitor hiện ký tự rác</td><td>tốc độ baud trong monitor khác với <span class="badge">Serial.begin(9600)</span></td></tr>
  </tbody>
</table>

<div class="note-ct">Quy trình tiết kiệm thời gian cả kỳ: dựng thử trong <b>Tinkercad</b> tới khi logic đúng, rồi đấu mạch thật và nạp bằng <b>IDE</b>, rồi vẽ mạch hoàn chỉnh bằng <b>Fritzing</b> cho báo cáo. Syllabus xây báo cáo đồ án của bạn đúng quanh mấy sản phẩm này.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Trình mô phỏng nói dối — một cách lịch sự.</b> Trong Tinkercad, dây không có điện trở, đường 5V không bao giờ sụt, cảm biến trả giá trị hoàn hảo, và nút bấm không bao giờ dội. Đó là lý do một mạch chạy ngon trong mô phỏng vẫn có thể giở chứng trên bàn thật: nguồn thật sụt khi động cơ khởi động, cảm biến thật có nhiễu, nút thật bị dội (Chương 4). Dùng mô phỏng để kiểm <em>logic</em>, đừng bao giờ dùng nó để chứng minh <em>tính đúng về điện</em>. Biết giới hạn của công cụ mình dùng tự nó đã là một kỹ năng kỹ thuật.</div>

<a class="link-card exphub" href="/exp-hub/iot102-cai-dat-arduino?ref=%2Fcourses%2Finternet-of-things%2Flearn&reflabel=IOT102%20%E2%80%94%20Internet%20of%20Things" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Cài IDE &amp; mở mô phỏng đầu tiên</span><span class="lc-sub">Chọn board/cổng, driver, và một mạch Tinkercad dựng sẵn.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
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
        {
          title: '3.2 — Reading the components in your KIT|||3.2 — Đọc hiểu linh kiện trong bộ KIT',
          slug: 'iot102-linh-kien',
          type: 'VIDEO',
          description: 'Điện trở (vòng màu), tụ, diode, transistor, relay — nhận dạng, đọc giá trị, và biết mỗi cái dùng làm gì (CLO5).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Know what you are holding</h2>
<p class="lead">CLO5 says "select and calculate the electronic components". Selection comes first: open the KIT and you will find a handful of part families. Here is what each one is for, and how to read its value.</p>

<h3>Resistor — reading the colour bands</h3>
<p>A 4-band resistor reads: <b>digit · digit · multiplier · tolerance</b>.</p>
<table>
  <thead><tr><th>Colour</th><th>Digit</th><th>Multiplier</th></tr></thead>
  <tbody>
    <tr><td>Black / Brown / Red</td><td>0 / 1 / 2</td><td>×1 / ×10 / ×100</td></tr>
    <tr><td>Orange / Yellow / Green</td><td>3 / 4 / 5</td><td>×1k / ×10k / ×100k</td></tr>
    <tr><td>Blue / Violet / Grey / White</td><td>6 / 7 / 8 / 9</td><td>×1M / … </td></tr>
    <tr><td>Gold / Silver <small>(tolerance band)</small></td><td>—</td><td>±5% / ±10%</td></tr>
  </tbody>
</table>
<div class="out"><b>Worked example:</b> red–red–brown–gold = 2, 2, ×10, ±5% = <b>220Ω ±5%</b> — the LED resistor you will use in almost every lab. Brown–black–orange = 1, 0, ×1k = <b>10kΩ</b>, the standard pull-down/divider value.</div>

<h3>The rest of the family</h3>
<table>
  <thead><tr><th>Component</th><th>What it does</th><th>Where you meet it</th></tr></thead>
  <tbody>
    <tr><td>Capacitor</td><td>stores a little charge; smooths voltage dips</td><td>across the supply near a motor; in debounce circuits</td></tr>
    <tr><td>Diode</td><td>lets current flow one way only</td><td>across a relay/motor coil to absorb the reverse spike</td></tr>
    <tr><td>Transistor <small>(e.g. 2N2222)</small></td><td>a switch controlled by a tiny current</td><td>lets a 20 mA pin control a 500 mA load</td></tr>
    <tr><td>Relay</td><td>an electrically-operated mechanical switch</td><td>switching 220V mains devices — isolated from the Arduino</td></tr>
    <tr><td>Potentiometer</td><td>a knob = an adjustable voltage divider</td><td>the analog input in Chapter 5 and the servo-knob lab</td></tr>
    <tr><td>LED</td><td>emits light, one direction only</td><td>every single lab</td></tr>
  </tbody>
</table>

<div class="pitfall"><b>Polarity kills parts.</b> Resistors do not care which way round they go; <b>LEDs, diodes, electrolytic capacitors and ICs do</b>. LED: long leg = anode (+), and the flat side of the rim = cathode (−). Electrolytic capacitor: the stripe marks the negative leg — fit it backwards and it can burst. When in doubt, check before powering on, not after.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why a motor needs a flyback diode.</b> A motor or relay coil is an inductor: it resists change in current. When you switch it off, the collapsing magnetic field generates a reverse voltage spike of tens of volts — enough to destroy the transistor or the Arduino pin driving it. A diode fitted <em>backwards</em> across the coil gives that spike a harmless loop to burn out in. Every commercial motor driver has one built in. This is the classic "it worked for ten minutes then died" failure, and it is invisible unless you know to look for it.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Biết mình đang cầm cái gì</h2>
<p class="lead">CLO5 nói "chọn và tính toán linh kiện điện tử". Chọn là bước đầu tiên: mở bộ KIT ra bạn sẽ thấy vài họ linh kiện. Đây là công dụng của từng loại, và cách đọc giá trị của nó.</p>

<h3>Điện trở — đọc vòng màu</h3>
<p>Điện trở 4 vòng đọc là: <b>chữ số · chữ số · hệ số nhân · sai số</b>.</p>
<table>
  <thead><tr><th>Màu</th><th>Chữ số</th><th>Hệ số nhân</th></tr></thead>
  <tbody>
    <tr><td>Đen / Nâu / Đỏ</td><td>0 / 1 / 2</td><td>×1 / ×10 / ×100</td></tr>
    <tr><td>Cam / Vàng / Lục</td><td>3 / 4 / 5</td><td>×1k / ×10k / ×100k</td></tr>
    <tr><td>Lam / Tím / Xám / Trắng</td><td>6 / 7 / 8 / 9</td><td>×1M / … </td></tr>
    <tr><td>Nhũ vàng / Nhũ bạc <small>(vòng sai số)</small></td><td>—</td><td>±5% / ±10%</td></tr>
  </tbody>
</table>
<div class="out"><b>Ví dụ có lời giải:</b> đỏ–đỏ–nâu–nhũ vàng = 2, 2, ×10, ±5% = <b>220Ω ±5%</b> — chính là con điện trở cho LED bạn dùng ở gần như mọi lab. Nâu–đen–cam = 1, 0, ×1k = <b>10kΩ</b>, giá trị chuẩn cho điện trở kéo xuống/chia áp.</div>

<h3>Những anh em còn lại</h3>
<table>
  <thead><tr><th>Linh kiện</th><th>Làm gì</th><th>Gặp ở đâu</th></tr></thead>
  <tbody>
    <tr><td>Tụ điện</td><td>trữ một ít điện tích; làm phẳng các cú sụt áp</td><td>mắc ngang nguồn gần động cơ; trong mạch chống dội</td></tr>
    <tr><td>Điốt</td><td>chỉ cho dòng chạy một chiều</td><td>mắc ngang cuộn relay/động cơ để hút xung ngược</td></tr>
    <tr><td>Transistor <small>(vd 2N2222)</small></td><td>một công tắc điều khiển bằng dòng rất nhỏ</td><td>cho một chân 20 mA điều khiển tải 500 mA</td></tr>
    <tr><td>Relay</td><td>công tắc cơ điều khiển bằng điện</td><td>đóng cắt thiết bị điện 220V — cách ly khỏi Arduino</td></tr>
    <tr><td>Biến trở</td><td>một núm vặn = bộ chia áp điều chỉnh được</td><td>ngõ vào analog ở Chương 5 và lab servo-knob</td></tr>
    <tr><td>LED</td><td>phát sáng, chỉ theo một chiều</td><td>mọi lab, không sót cái nào</td></tr>
  </tbody>
</table>

<div class="pitfall"><b>Cực tính giết linh kiện.</b> Điện trở không quan tâm cắm chiều nào; <b>LED, điốt, tụ hoá và IC thì có</b>. LED: chân dài = anode (+), và cạnh vát trên vành = cathode (−). Tụ hoá: vạch kẻ đánh dấu chân âm — cắm ngược là nó có thể nổ. Nghi ngờ thì kiểm TRƯỚC khi cấp nguồn, không phải sau.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao động cơ cần điốt dập xung (flyback).</b> Cuộn dây động cơ hay relay là một cuộn cảm: nó chống lại sự thay đổi dòng. Khi bạn ngắt, từ trường sụp đổ sinh ra một xung điện áp ngược hàng chục volt — đủ để phá con transistor hoặc chân Arduino đang điều khiển nó. Một điốt mắc <em>ngược</em> ngang cuộn dây cho xung đó một vòng vô hại để tiêu tán. Mọi mạch lái động cơ thương mại đều có sẵn cái này. Đây đúng là kiểu hỏng "chạy được mười phút rồi chết", và nó vô hình nếu bạn không biết mà tìm.</div>
</div>
`,
        },
        {
          title: '3.3 — Calculating a circuit: series, parallel & dividers|||3.3 — Tính toán mạch: nối tiếp, song song & chia áp',
          slug: 'iot102-tinh-toan-mach',
          type: 'VIDEO',
          description: 'Điện trở nối tiếp/song song, bộ chia áp (nền của mọi cảm biến trở), và tính công suất — nhiều ví dụ có lời giải.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>The four calculations you will actually use</h2>
<p class="lead">"Calculate the electronic components" (CLO5) comes down to four small formulas. Every one of them appears in a lab later this semester, so work through the examples with a calculator rather than reading past them.</p>

<h3>1 · Resistors in series — they add</h3>
<div class="out">R<sub>total</sub> = R₁ + R₂ + … &nbsp;→&nbsp; a 220Ω and a 330Ω in series = <b>550Ω</b>. Series components share one current; the voltage splits between them.</div>

<h3>2 · Resistors in parallel — the total is smaller than the smallest</h3>
<div class="out">1/R<sub>total</sub> = 1/R₁ + 1/R₂. For two: R<sub>total</sub> = (R₁·R₂)/(R₁+R₂).<br>
Two 220Ω in parallel = (220×220)/(440) = <b>110Ω</b>. Parallel components share one voltage; the current splits.</div>

<h3>3 · The voltage divider — how every resistive sensor works</h3>
<p>Two resistors in series across 5V produce a middle voltage you can measure:</p>
<div class="out">V<sub>out</sub> = V<sub>in</sub> × R₂ / (R₁ + R₂)<br>
<b>Worked example:</b> an LDR (light sensor) is R₁ and a fixed 10kΩ is R₂. In bright light the LDR falls to 1kΩ:<br>
V<sub>out</sub> = 5 × 10000 / (1000 + 10000) = 5 × 0.909 = <b>4.55V</b> → analogRead gives ≈ 931.<br>
In darkness the LDR rises to 100kΩ: V<sub>out</sub> = 5 × 10000 / 110000 = <b>0.45V</b> → analogRead ≈ 93.</div>
<div class="note-ct">That is the whole trick behind Chapter 5's photoresistor lab: the Arduino cannot measure resistance, only voltage — so you turn the resistance change into a voltage change with one extra resistor.</div>

<h3>4 · Power — will it get hot?</h3>
<div class="out">P = V × I (and, using Ohm, P = I²R).<br>
<b>Worked example:</b> the LED resistor from Lesson 3.1 drops 3V at 20mA → P = 3 × 0.02 = 0.06 W. A standard resistor handles 0.25 W, so it stays cool. Now switch to a 12V supply: it drops 10V at 20mA → 0.2 W, uncomfortably close to the limit.</div>

<h3>Ví dụ có lời giải · Three LEDs, one pin?</h3>
<div class="out">Each LED needs 20 mA. Three in parallel on one pin = 60 mA — <b>over the 20 mA per-pin limit and heading for the 40 mA absolute maximum</b>. Correct answers: one pin per LED (3 × 20 mA = 60 mA, still under the 200 mA chip total), or one pin driving a transistor that switches all three from the 5V rail.</div>

<div class="pitfall"><b>Never build a voltage divider to power something.</b> A divider sets a voltage only while almost no current is drawn. Feed a motor or a servo from a divider and the voltage collapses instantly. Dividers are for <em>sensing</em>; for supplying power you need a regulator or a proper supply.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Input impedance — why 10kΩ is the magic divider value.</b> The Arduino's ADC input is nearly (but not perfectly) infinite impedance: it needs a tiny current to charge its internal sample capacitor. If the divider resistors are huge (say 1MΩ), that charging is too slow and readings drift or read low. If they are tiny (100Ω), the divider wastes 50 mA continuously. Around 1kΩ–10kΩ is the sweet spot — accurate <em>and</em> low waste. That is why nearly every sensor circuit you will ever see uses a 10k.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Bốn phép tính bạn thực sự sẽ dùng</h2>
<p class="lead">"Tính toán linh kiện điện tử" (CLO5) rút lại còn bốn công thức nhỏ. Mỗi công thức đều xuất hiện trong một lab ở phần sau của kỳ, nên hãy bấm máy tính làm theo ví dụ thay vì đọc lướt qua.</p>

<h3>1 · Điện trở nối tiếp — cộng lại</h3>
<div class="out">R<sub>tổng</sub> = R₁ + R₂ + … &nbsp;→&nbsp; một 220Ω nối tiếp một 330Ω = <b>550Ω</b>. Linh kiện nối tiếp dùng chung một dòng; điện áp chia ra giữa chúng.</div>

<h3>2 · Điện trở song song — tổng nhỏ hơn cả cái nhỏ nhất</h3>
<div class="out">1/R<sub>tổng</sub> = 1/R₁ + 1/R₂. Với hai cái: R<sub>tổng</sub> = (R₁·R₂)/(R₁+R₂).<br>
Hai điện trở 220Ω song song = (220×220)/(440) = <b>110Ω</b>. Linh kiện song song dùng chung một điện áp; dòng chia ra.</div>

<h3>3 · Bộ chia áp — cách mọi cảm biến kiểu điện trở hoạt động</h3>
<p>Hai điện trở nối tiếp ngang 5V tạo ra một điện áp ở giữa mà bạn đo được:</p>
<div class="out">V<sub>ra</sub> = V<sub>vào</sub> × R₂ / (R₁ + R₂)<br>
<b>Ví dụ có lời giải:</b> một LDR (cảm biến ánh sáng) là R₁ và một điện trở cố định 10kΩ là R₂. Dưới ánh sáng mạnh, LDR giảm còn 1kΩ:<br>
V<sub>ra</sub> = 5 × 10000 / (1000 + 10000) = 5 × 0,909 = <b>4,55V</b> → analogRead cho ≈ 931.<br>
Trong bóng tối LDR tăng lên 100kΩ: V<sub>ra</sub> = 5 × 10000 / 110000 = <b>0,45V</b> → analogRead ≈ 93.</div>
<div class="note-ct">Đó là toàn bộ mẹo đằng sau lab quang trở ở Chương 5: Arduino không đo được điện trở, chỉ đo được điện áp — nên bạn biến thay đổi điện trở thành thay đổi điện áp bằng đúng một con trở thêm vào.</div>

<h3>4 · Công suất — nó có nóng không?</h3>
<div class="out">P = V × I (và, dùng Ohm, P = I²R).<br>
<b>Ví dụ có lời giải:</b> con trở cho LED ở Bài 3.1 sụt 3V ở 20mA → P = 3 × 0,02 = 0,06 W. Điện trở thường chịu 0,25 W, nên nó vẫn mát. Giờ đổi sang nguồn 12V: nó sụt 10V ở 20mA → 0,2 W, sát ngưỡng một cách khó chịu.</div>

<h3>Ví dụ có lời giải · Ba LED, một chân?</h3>
<div class="out">Mỗi LED cần 20 mA. Ba cái song song trên một chân = 60 mA — <b>vượt hạn 20 mA mỗi chân và đang tiến tới mức tối đa tuyệt đối 40 mA</b>. Đáp án đúng: mỗi LED một chân (3 × 20 mA = 60 mA, vẫn dưới tổng 200 mA của chip), hoặc một chân lái một transistor để transistor đóng cả ba từ đường 5V.</div>

<div class="pitfall"><b>Đừng bao giờ dùng bộ chia áp để CẤP NGUỒN cho thứ gì.</b> Bộ chia áp chỉ giữ đúng điện áp khi gần như không có dòng bị rút ra. Cấp cho một động cơ hay servo từ bộ chia áp thì điện áp sụp ngay lập tức. Chia áp là để <em>cảm nhận</em>; muốn cấp nguồn thì cần bộ ổn áp hoặc một nguồn tử tế.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Trở kháng vào — vì sao 10kΩ là giá trị chia áp thần kỳ.</b> Ngõ vào ADC của Arduino gần như (nhưng không hoàn toàn) trở kháng vô hạn: nó cần một dòng bé tí để nạp tụ lấy mẫu bên trong. Nếu các điện trở chia áp quá lớn (ví dụ 1MΩ), việc nạp đó quá chậm nên số đọc trôi hoặc thấp hơn thực tế. Nếu quá nhỏ (100Ω), bộ chia áp phí hoài 50 mA liên tục. Khoảng 1kΩ–10kΩ là điểm ngọt — vừa chính xác <em>vừa</em> ít lãng phí. Đó là lý do gần như mọi mạch cảm biến bạn từng thấy đều dùng con 10k.</div>
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
          title: '4.2 — Driving many LEDs: arrays, loops & effects|||4.2 — Điều khiển nhiều LED: mảng, vòng lặp & hiệu ứng',
          slug: 'iot102-led-array',
          type: 'VIDEO',
          description: 'Lab "Led array effect": dùng mảng + for để chạy đèn đuổi, và vì sao code lặp thủ công là sai hướng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>From one LED to eight</h2>
<p class="lead">Session 12's lab is "LED array effect" — a row of LEDs lighting in sequence. It looks like decoration, but it teaches the habit that separates readable embedded code from a wall of copy-paste: <strong>keep pins in an array and loop over them</strong>.</p>

<h3>The wrong way (and why you will be tempted)</h3>
<pre><span class="tok-function">digitalWrite</span>(2, HIGH); <span class="tok-function">delay</span>(100); <span class="tok-function">digitalWrite</span>(2, LOW);
<span class="tok-function">digitalWrite</span>(3, HIGH); <span class="tok-function">delay</span>(100); <span class="tok-function">digitalWrite</span>(3, LOW);
<span class="tok-comment">// … six more times. Change the speed? Edit eight lines.</span></pre>

<h3>The right way — an array of pins</h3>
<pre><span class="tok-type">int</span> leds[] = {2, 3, 4, 5, 6, 7, 8, 9};
<span class="tok-type">int</span> n = 8;
<span class="tok-type">int</span> wait = 100;

<span class="tok-keyword">void</span> <span class="tok-function">setup</span>() {
  <span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = 0; i &lt; n; i++) <span class="tok-function">pinMode</span>(leds[i], OUTPUT);
}

<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = 0; i &lt; n; i++) {        <span class="tok-comment">// chase forward</span>
    <span class="tok-function">digitalWrite</span>(leds[i], HIGH);
    <span class="tok-function">delay</span>(wait);
    <span class="tok-function">digitalWrite</span>(leds[i], LOW);
  }
  <span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = n - 2; i &gt; 0; i--) {      <span class="tok-comment">// … and back (Knight Rider)</span>
    <span class="tok-function">digitalWrite</span>(leds[i], HIGH);
    <span class="tok-function">delay</span>(wait);
    <span class="tok-function">digitalWrite</span>(leds[i], LOW);
  }
}</pre>
<div class="out">Now the whole effect is controlled by three values: <span class="badge">leds[]</span>, <span class="badge">n</span>, <span class="badge">wait</span>. Change the speed in one place; add a ninth LED by adding one number.</div>

<h3>Wiring eight LEDs safely</h3>
<p>Each LED gets its own 220Ω resistor to its own pin, and all cathodes go to a shared GND rail. Eight LEDs at 20 mA is 160 mA if they were all on at once — under the chip's 200 mA total, but only just. In a chase effect only one is lit at a time, so you are comfortably safe.</p>

<div class="pitfall"><b>Trap:</b> <span class="badge">for (int i = 0; i &lt;= n; i++)</span> with n = 8 runs nine times and reads <span class="badge">leds[8]</span> — past the end of the array. In C++ there is no bounds check: you get whatever byte sits there, and the LED pattern goes wrong for no visible reason. Use <span class="badge">i &lt; n</span>.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Charlieplexing — 12 LEDs on 4 pins.</b> When pins run out, engineers exploit that a pin can be HIGH, LOW, <em>or</em> INPUT (effectively disconnected). With n pins in this three-state scheme you can drive n×(n−1) LEDs: 4 pins → 12 LEDs. Only one lights at a time, but if you cycle fast enough (persistence of vision, &gt;50 Hz) the eye sees them all lit. The same illusion powers the multiplexed 7-segment and 8×8 matrix displays in Chapter 6.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Từ một LED lên tám</h2>
<p class="lead">Lab buổi 12 là "LED array effect" — một dãy LED sáng lần lượt. Trông như trang trí, nhưng nó dạy cái thói quen tách code nhúng dễ đọc khỏi một bức tường copy-paste: <strong>giữ các chân trong một mảng và lặp qua chúng</strong>.</p>

<h3>Cách sai (và vì sao bạn sẽ bị cám dỗ)</h3>
<pre><span class="tok-function">digitalWrite</span>(2, HIGH); <span class="tok-function">delay</span>(100); <span class="tok-function">digitalWrite</span>(2, LOW);
<span class="tok-function">digitalWrite</span>(3, HIGH); <span class="tok-function">delay</span>(100); <span class="tok-function">digitalWrite</span>(3, LOW);
<span class="tok-comment">// … sáu lần nữa. Muốn đổi tốc độ? Sửa tám dòng.</span></pre>

<h3>Cách đúng — một mảng các chân</h3>
<pre><span class="tok-type">int</span> leds[] = {2, 3, 4, 5, 6, 7, 8, 9};
<span class="tok-type">int</span> n = 8;
<span class="tok-type">int</span> wait = 100;

<span class="tok-keyword">void</span> <span class="tok-function">setup</span>() {
  <span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = 0; i &lt; n; i++) <span class="tok-function">pinMode</span>(leds[i], OUTPUT);
}

<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = 0; i &lt; n; i++) {        <span class="tok-comment">// chạy tới</span>
    <span class="tok-function">digitalWrite</span>(leds[i], HIGH);
    <span class="tok-function">delay</span>(wait);
    <span class="tok-function">digitalWrite</span>(leds[i], LOW);
  }
  <span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = n - 2; i &gt; 0; i--) {      <span class="tok-comment">// … rồi chạy về (kiểu Knight Rider)</span>
    <span class="tok-function">digitalWrite</span>(leds[i], HIGH);
    <span class="tok-function">delay</span>(wait);
    <span class="tok-function">digitalWrite</span>(leds[i], LOW);
  }
}</pre>
<div class="out">Giờ cả hiệu ứng được điều khiển bởi ba giá trị: <span class="badge">leds[]</span>, <span class="badge">n</span>, <span class="badge">wait</span>. Đổi tốc độ ở đúng một chỗ; thêm LED thứ chín bằng cách thêm một con số.</div>

<h3>Đấu tám LED an toàn</h3>
<p>Mỗi LED có điện trở 220Ω riêng nối tới chân riêng của nó, và mọi cathode về chung một thanh ray GND. Tám LED ở 20 mA là 160 mA nếu sáng cùng lúc — dưới tổng 200 mA của chip, nhưng chỉ vừa đủ. Trong hiệu ứng đuổi thì mỗi lúc chỉ một cái sáng, nên bạn thoải mái an toàn.</p>

<div class="pitfall"><b>Bẫy:</b> <span class="badge">for (int i = 0; i &lt;= n; i++)</span> với n = 8 chạy chín lần và đọc <span class="badge">leds[8]</span> — vượt quá cuối mảng. Trong C++ không có kiểm biên: bạn nhận bất kỳ byte nào nằm ở đó, và mẫu đèn sai mà chẳng có lý do nhìn thấy được. Hãy dùng <span class="badge">i &lt; n</span>.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Charlieplexing — 12 LED trên 4 chân.</b> Khi hết chân, kỹ sư khai thác việc một chân có thể ở HIGH, LOW, <em>hoặc</em> INPUT (coi như ngắt kết nối). Với n chân theo lối ba trạng thái này bạn lái được n×(n−1) LED: 4 chân → 12 LED. Mỗi lúc chỉ một cái sáng, nhưng nếu quét đủ nhanh (hiện tượng lưu ảnh, &gt;50 Hz) thì mắt thấy tất cả đều sáng. Cũng chính ảo giác này vận hành màn hình 7 đoạn và ma trận 8×8 quét đa hợp ở Chương 6.</div>
</div>
`,
        },
        {
          title: '4.3 — State change detection: counting presses|||4.3 — Phát hiện đổi trạng thái: đếm số lần nhấn',
          slug: 'iot102-state-change',
          type: 'VIDEO',
          description: 'Lab buổi 13–14: khác biệt giữa "nút đang được nhấn" và "nút VỪA được nhấn" — mẫu code phải thuộc lòng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>"Is pressed" is not "was just pressed"</h2>
<p class="lead">Sessions 13–14 pair "Button — Digital Read" with "State Change Detection", and the second one is where most students first meet a genuinely subtle bug. Lesson 4.1's code answers "is the button down <em>right now</em>?". Counting presses, or toggling a lamp, needs a different question: "did it change <em>since the last check</em>?"</p>

<h3>Why the naive toggle fails</h3>
<pre><span class="tok-keyword">if</span> (<span class="tok-function">digitalRead</span>(8) == LOW) {      <span class="tok-comment">// pressed</span>
  ledOn = !ledOn;                     <span class="tok-comment">// toggle — WRONG</span>
  <span class="tok-function">digitalWrite</span>(13, ledOn);
}</pre>
<div class="out"><b>What actually happens:</b> loop() runs thousands of times per second. Holding the button for 200 ms toggles the LED hundreds of times, and it lands on a random state. The lamp appears to flicker or ignore you.</div>

<h3>The fix — remember the previous reading</h3>
<pre><span class="tok-type">int</span> lastState = HIGH;      <span class="tok-comment">// with INPUT_PULLUP, HIGH = released</span>
<span class="tok-type">int</span> pressCount = 0;
<span class="tok-type">bool</span> ledOn = <span class="tok-keyword">false</span>;

<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-type">int</span> state = <span class="tok-function">digitalRead</span>(8);

  <span class="tok-keyword">if</span> (state != lastState) {          <span class="tok-comment">// something CHANGED</span>
    <span class="tok-keyword">if</span> (state == LOW) {              <span class="tok-comment">// … and it changed to "pressed"</span>
      pressCount++;
      ledOn = !ledOn;
      <span class="tok-function">digitalWrite</span>(13, ledOn);
      Serial.<span class="tok-function">print</span>(<span class="tok-string">"Presses: "</span>); Serial.<span class="tok-function">println</span>(pressCount);
    }
    <span class="tok-function">delay</span>(20);                      <span class="tok-comment">// crude debounce — see Lesson 4.4</span>
  }
  lastState = state;                 <span class="tok-comment">// remember for next time</span>
}</pre>
<div class="out">The pattern in one sentence: <b>compare the current reading with the previous one, act only on the transition, then store the current reading.</b> This is called <em>edge detection</em> — you are reacting to the falling edge (HIGH→LOW), not the level.</div>

<h3>Where you will need it</h3>
<div class="lz-stack">
  <div class="lz-layer">Counting how many objects passed a sensor</div>
  <div class="lz-layer">A push button that toggles a lamp or a mode</div>
  <div class="lz-layer">Detecting a door opening (not "the door is open")</div>
  <div class="lz-layer">Triggering an action once when a temperature crosses a threshold — the same edge logic on an analog value</div>
</div>

<div class="pitfall"><b>Trap:</b> forgetting <span class="badge">lastState = state;</span> at the end of loop(). The condition then fires forever and you are back to the flickering version. Put that line at the very bottom of the loop, outside the <span class="badge">if</span>.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The same pattern, with a name: the finite state machine.</b> Once a device has more than two behaviours (idle → armed → alarming → silenced), tracking them with a pile of booleans becomes unmanageable. Professionals declare <span class="badge">enum State { IDLE, ARMED, ALARMING };</span> plus a <span class="badge">currentState</span> variable, and write one <span class="badge">switch</span> that handles each state and its exits. Your final project will be far easier to explain — and to debug — if you draw its states before writing code. That drawing is exactly the flowchart the syllabus asks for at session 44.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>"Đang được nhấn" khác "vừa mới nhấn"</h2>
<p class="lead">Buổi 13–14 ghép "Button — Digital Read" với "State Change Detection", và cái thứ hai là nơi phần lớn sinh viên lần đầu gặp một lỗi thực sự tinh vi. Code ở Bài 4.1 trả lời câu "nút có đang bị nhấn <em>ngay lúc này</em> không?". Còn đếm số lần nhấn, hay bật/tắt một bóng đèn, cần một câu hỏi khác: "nó có thay đổi <em>kể từ lần kiểm trước</em> không?"</p>

<h3>Vì sao cách bật/tắt ngây thơ thất bại</h3>
<pre><span class="tok-keyword">if</span> (<span class="tok-function">digitalRead</span>(8) == LOW) {      <span class="tok-comment">// đang nhấn</span>
  ledOn = !ledOn;                     <span class="tok-comment">// đảo trạng thái — SAI</span>
  <span class="tok-function">digitalWrite</span>(13, ledOn);
}</pre>
<div class="out"><b>Thực tế xảy ra:</b> loop() chạy hàng nghìn lần mỗi giây. Giữ nút 200 ms là đảo LED hàng trăm lần, và nó dừng ở một trạng thái ngẫu nhiên. Bóng đèn trông như nhấp nháy hoặc phớt lờ bạn.</div>

<h3>Cách sửa — nhớ lại số đọc lần trước</h3>
<pre><span class="tok-type">int</span> lastState = HIGH;      <span class="tok-comment">// với INPUT_PULLUP, HIGH = đang thả</span>
<span class="tok-type">int</span> pressCount = 0;
<span class="tok-type">bool</span> ledOn = <span class="tok-keyword">false</span>;

<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-type">int</span> state = <span class="tok-function">digitalRead</span>(8);

  <span class="tok-keyword">if</span> (state != lastState) {          <span class="tok-comment">// có gì đó ĐÃ THAY ĐỔI</span>
    <span class="tok-keyword">if</span> (state == LOW) {              <span class="tok-comment">// … và đổi sang trạng thái "đang nhấn"</span>
      pressCount++;
      ledOn = !ledOn;
      <span class="tok-function">digitalWrite</span>(13, ledOn);
      Serial.<span class="tok-function">print</span>(<span class="tok-string">"So lan nhan: "</span>); Serial.<span class="tok-function">println</span>(pressCount);
    }
    <span class="tok-function">delay</span>(20);                      <span class="tok-comment">// chống dội thô sơ — xem Bài 4.4</span>
  }
  lastState = state;                 <span class="tok-comment">// nhớ lại cho lần sau</span>
}</pre>
<div class="out">Mẫu hình gói trong một câu: <b>so sánh số đọc hiện tại với số đọc trước, chỉ hành động khi có chuyển tiếp, rồi lưu số đọc hiện tại.</b> Cái này gọi là <em>phát hiện sườn (edge detection)</em> — bạn phản ứng với sườn xuống (HIGH→LOW), không phải với mức.</div>

<h3>Bạn sẽ cần nó ở đâu</h3>
<div class="lz-stack">
  <div class="lz-layer">Đếm bao nhiêu vật đã đi qua một cảm biến</div>
  <div class="lz-layer">Một nút nhấn bật/tắt bóng đèn hoặc đổi chế độ</div>
  <div class="lz-layer">Phát hiện cửa vừa mở (không phải "cửa đang mở")</div>
  <div class="lz-layer">Kích một hành động đúng một lần khi nhiệt độ vượt ngưỡng — cùng logic sườn, trên một giá trị analog</div>
</div>

<div class="pitfall"><b>Bẫy:</b> quên dòng <span class="badge">lastState = state;</span> ở cuối loop(). Điều kiện khi đó nổ mãi mãi và bạn quay về bản nhấp nháy. Hãy đặt dòng đó ở tận đáy vòng lặp, bên ngoài khối <span class="badge">if</span>.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Cũng mẫu hình đó, có tên hẳn hoi: máy trạng thái hữu hạn.</b> Khi một thiết bị có hơn hai hành vi (nghỉ → đã kích hoạt → đang báo động → đã tắt báo), theo dõi chúng bằng một đống biến boolean sẽ vỡ trận. Dân chuyên khai báo <span class="badge">enum State { IDLE, ARMED, ALARMING };</span> cộng một biến <span class="badge">currentState</span>, rồi viết một khối <span class="badge">switch</span> xử lý từng trạng thái và các lối ra của nó. Đồ án cuối kỳ của bạn sẽ dễ giải thích — và dễ gỡ lỗi — hơn nhiều nếu bạn vẽ các trạng thái ra trước khi viết code. Bản vẽ đó chính là cái lưu đồ mà syllabus yêu cầu ở buổi 44.</div>
</div>
`,
        },
        {
          title: '4.4 — Debouncing a button properly|||4.4 — Chống dội nút bấm cho đúng',
          slug: 'iot102-debounce',
          type: 'VIDEO',
          description: 'Lab buổi 49: vì sao một lần nhấn thành ba, cách chống dội bằng millis (không chặn) và bằng phần cứng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>One press, three counts</h2>
<p class="lead">You built a press counter in Lesson 4.3 and it sometimes jumps by 2 or 3. Nothing is wrong with your code — the button is lying to you. Session 49's "Debounce" lab exists because this catches everyone.</p>

<h3>What bounce actually is</h3>
<p>A push button closes two springy metal contacts. For roughly <b>5–50 milliseconds</b> after they touch, they physically bounce apart and back several times. The Arduino, checking thousands of times per second, faithfully reports each of those bounces as a separate press.</p>
<div class="out">Timeline of one human press:<br>
<span class="badge">HIGH</span> … <span class="badge">LOW HIGH LOW HIGH LOW</span> (bouncing, ~10 ms) … <span class="badge">LOW</span> (stable, 200 ms) … <span class="badge">HIGH</span><br>
Your edge detector sees three falling edges instead of one.</div>

<h3>Software debounce — the standard pattern</h3>
<pre><span class="tok-type">unsigned long</span> lastChange = 0;
<span class="tok-type">unsigned long</span> debounceMs = 50;
<span class="tok-type">int</span> lastReading = HIGH, stableState = HIGH;

<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-type">int</span> reading = <span class="tok-function">digitalRead</span>(8);

  <span class="tok-keyword">if</span> (reading != lastReading) {
    lastChange = <span class="tok-function">millis</span>();          <span class="tok-comment">// the signal just moved — restart the timer</span>
  }

  <span class="tok-keyword">if</span> (<span class="tok-function">millis</span>() - lastChange &gt; debounceMs) {
    <span class="tok-comment">// it has been quiet long enough — trust it</span>
    <span class="tok-keyword">if</span> (reading != stableState) {
      stableState = reading;
      <span class="tok-keyword">if</span> (stableState == LOW) pressCount++;   <span class="tok-comment">// a REAL press</span>
    }
  }
  lastReading = reading;
}</pre>
<div class="out">The idea: <b>ignore the input until it has held the same value for 50 ms.</b> Bounces are shorter than that, so they are filtered out; a human press is far longer, so it always gets through.</div>

<h3>Why not just delay(50)?</h3>
<p>Because <span class="badge">delay()</span> freezes everything — sensors unread, other buttons missed, motors uncontrolled. The <span class="badge">millis()</span> version keeps the loop running. This is the same non-blocking idea developed fully in Chapter 8.</p>

<table>
  <thead><tr><th>Approach</th><th>Cost</th><th>When to use</th></tr></thead>
  <tbody>
    <tr><td>delay(20–50) after a change</td><td>blocks the whole program</td><td>a quick lab with one button</td></tr>
    <tr><td>millis() debounce</td><td>a few lines, no blocking</td><td><b>the default choice</b></td></tr>
    <tr><td>Hardware: 100 nF capacitor across the button</td><td>one component</td><td>noisy environments, or when pins are interrupt-driven</td></tr>
    <tr><td>Library (e.g. Bounce2)</td><td>an include</td><td>many buttons in a real project</td></tr>
  </tbody>
</table>

<div class="pitfall"><b>Trap:</b> declaring the timing variables as <span class="badge">int</span>. <span class="badge">millis()</span> returns an <span class="badge">unsigned long</span> that reaches 32767 in 33 seconds — an <span class="badge">int</span> overflows and your debounce silently breaks after half a minute. Always store millis() values in <span class="badge">unsigned long</span>.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Debouncing is filtering, and it applies everywhere.</b> The pattern "ignore a change until it persists" is the digital cousin of the analog smoothing you meet in Lesson 5.4. Both answer the same engineering question: <em>which changes in my input are real, and which are noise?</em> A thermostat that switches on the instant the temperature crosses 25.0°C will chatter on and off; adding a <b>hysteresis</b> band (switch on at 25, off at 24) is debouncing for analog values. Once you see this pattern you find it in every robust device.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Một lần nhấn, đếm thành ba</h2>
<p class="lead">Bạn dựng bộ đếm nhấn ở Bài 4.3 và đôi khi nó nhảy 2 hoặc 3. Code của bạn chẳng sai gì — cái nút đang nói dối bạn. Lab "Debounce" ở buổi 49 tồn tại vì chuyện này tóm được tất cả mọi người.</p>

<h3>Dội (bounce) thực chất là gì</h3>
<p>Một nút nhấn đóng hai tiếp điểm kim loại đàn hồi. Trong khoảng <b>5–50 mili-giây</b> sau khi chúng chạm nhau, chúng nảy ra rồi chạm lại vài lần theo đúng nghĩa vật lý. Arduino, vốn kiểm hàng nghìn lần mỗi giây, trung thành báo cáo mỗi lần nảy đó là một lần nhấn riêng.</p>
<div class="out">Dòng thời gian của một cú nhấn tay người:<br>
<span class="badge">HIGH</span> … <span class="badge">LOW HIGH LOW HIGH LOW</span> (đang dội, ~10 ms) … <span class="badge">LOW</span> (ổn định, 200 ms) … <span class="badge">HIGH</span><br>
Bộ phát hiện sườn của bạn thấy ba sườn xuống thay vì một.</div>

<h3>Chống dội bằng phần mềm — mẫu chuẩn</h3>
<pre><span class="tok-type">unsigned long</span> lastChange = 0;
<span class="tok-type">unsigned long</span> debounceMs = 50;
<span class="tok-type">int</span> lastReading = HIGH, stableState = HIGH;

<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-type">int</span> reading = <span class="tok-function">digitalRead</span>(8);

  <span class="tok-keyword">if</span> (reading != lastReading) {
    lastChange = <span class="tok-function">millis</span>();          <span class="tok-comment">// tín hiệu vừa động đậy — đặt lại đồng hồ</span>
  }

  <span class="tok-keyword">if</span> (<span class="tok-function">millis</span>() - lastChange &gt; debounceMs) {
    <span class="tok-comment">// đã yên đủ lâu — tin được</span>
    <span class="tok-keyword">if</span> (reading != stableState) {
      stableState = reading;
      <span class="tok-keyword">if</span> (stableState == LOW) pressCount++;   <span class="tok-comment">// một cú nhấn THẬT</span>
    }
  }
  lastReading = reading;
}</pre>
<div class="out">Ý tưởng: <b>phớt lờ ngõ vào cho tới khi nó giữ nguyên một giá trị suốt 50 ms.</b> Các cú dội ngắn hơn thế nên bị lọc bỏ; một cú nhấn của người thì dài hơn nhiều nên luôn lọt qua.</div>

<h3>Sao không dùng luôn delay(50)?</h3>
<p>Vì <span class="badge">delay()</span> đóng băng mọi thứ — cảm biến không được đọc, nút khác bị bỏ lỡ, động cơ mất điều khiển. Bản dùng <span class="badge">millis()</span> giữ cho vòng lặp vẫn chạy. Đây chính là ý tưởng không-chặn được phát triển đầy đủ ở Chương 8.</p>

<table>
  <thead><tr><th>Cách làm</th><th>Cái giá</th><th>Dùng khi nào</th></tr></thead>
  <tbody>
    <tr><td>delay(20–50) sau mỗi thay đổi</td><td>chặn cả chương trình</td><td>một lab nhanh với đúng một nút</td></tr>
    <tr><td>Chống dội bằng millis()</td><td>vài dòng, không chặn</td><td><b>lựa chọn mặc định</b></td></tr>
    <tr><td>Phần cứng: tụ 100 nF mắc ngang nút</td><td>một linh kiện</td><td>môi trường nhiễu, hoặc khi chân chạy bằng ngắt</td></tr>
    <tr><td>Thư viện (vd Bounce2)</td><td>một dòng include</td><td>nhiều nút trong một đồ án thật</td></tr>
  </tbody>
</table>

<div class="pitfall"><b>Bẫy:</b> khai báo các biến thời gian là <span class="badge">int</span>. <span class="badge">millis()</span> trả về một <span class="badge">unsigned long</span> chạm 32767 sau 33 giây — một <span class="badge">int</span> sẽ tràn và bộ chống dội của bạn hỏng âm thầm sau nửa phút. Luôn lưu giá trị millis() vào <span class="badge">unsigned long</span>.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Chống dội chính là lọc nhiễu, và nó áp dụng ở khắp nơi.</b> Mẫu "bỏ qua một thay đổi cho tới khi nó bền" là anh em họ dạng số của phép làm mượt analog bạn gặp ở Bài 5.4. Cả hai trả lời cùng một câu hỏi kỹ thuật: <em>thay đổi nào trong ngõ vào của tôi là thật, thay đổi nào là nhiễu?</em> Một bộ ổn nhiệt bật ngay khoảnh khắc nhiệt độ vượt 25,0°C sẽ đóng-ngắt liên tục; thêm một dải <b>trễ (hysteresis)</b> (bật ở 25, tắt ở 24) chính là chống dội cho giá trị analog. Một khi nhìn ra mẫu này, bạn sẽ thấy nó trong mọi thiết bị chắc chắn.</div>
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
        {
          title: '5.2 — The photoresistor: from light to a number|||5.2 — Quang trở: từ ánh sáng thành một con số',
          slug: 'iot102-quang-tro',
          type: 'VIDEO',
          description: 'Lab buổi 15/18/19: đấu LDR bằng bộ chia áp, hiệu chuẩn ngưỡng, và "states of lights" nhiều mức.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Your first real sensor</h2>
<p class="lead">Three separate labs (sessions 15, 18, 19) use the photoresistor, because it is the cheapest way to learn the whole analog pipeline: a physical quantity → a resistance → a voltage → a number → a decision.</p>

<h3>Wiring: an LDR is only half a sensor</h3>
<p>An LDR (light-dependent resistor) changes resistance with light: roughly 1kΩ in bright light, 100kΩ+ in the dark. The Arduino cannot measure resistance, so you complete a <strong>voltage divider</strong> with a fixed 10kΩ (Lesson 3.3) and read the middle point with <span class="badge">analogRead(A0)</span>.</p>
<pre>5V ──[ LDR ]──┬──[ 10kΩ ]── GND
              │
              └── A0   <span class="tok-comment">// bright light → higher reading</span></pre>

<h3>Step 1: never guess the thresholds — calibrate</h3>
<pre><span class="tok-keyword">void</span> <span class="tok-function">setup</span>() { Serial.<span class="tok-function">begin</span>(9600); }
<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  Serial.<span class="tok-function">println</span>(<span class="tok-function">analogRead</span>(A0));   <span class="tok-comment">// write down the value…</span>
  <span class="tok-function">delay</span>(200);                          <span class="tok-comment">// …in the dark, in room light, under a lamp</span>
}</pre>
<div class="out"><b>Typical measured values</b> (yours will differ — that is the point): dark ≈ 90, room ≈ 450, torch ≈ 950. Every threshold you write must come from your own three numbers, not from a tutorial.</div>

<h3>Step 2: "states of lights" — more than on/off</h3>
<pre><span class="tok-type">int</span> light = <span class="tok-function">analogRead</span>(A0);

<span class="tok-keyword">if</span> (light &lt; 150)        <span class="tok-function">setLamp</span>(255);   <span class="tok-comment">// night — full brightness</span>
<span class="tok-keyword">else if</span> (light &lt; 400)   <span class="tok-function">setLamp</span>(120);   <span class="tok-comment">// dusk — dim</span>
<span class="tok-keyword">else if</span> (light &lt; 700)   <span class="tok-function">setLamp</span>(40);    <span class="tok-comment">// cloudy — very dim</span>
<span class="tok-keyword">else</span>                   <span class="tok-function">setLamp</span>(0);     <span class="tok-comment">// daylight — off</span></pre>
<div class="out">This is the syllabus's "Photoresistor — states of lights" lab: one analog input mapped to four discrete behaviours. It is also exactly how a real street lamp controller works.</div>

<h3>Step 3: the while-loop lab</h3>
<p>Session 19 pairs the LDR with a <span class="badge">while</span> loop — "keep doing X <em>as long as</em> the condition holds", e.g. keep a buzzer sounding while the room stays dark. Use it deliberately: a <span class="badge">while</span> inside <span class="badge">loop()</span> blocks everything else until it ends, so it must be short or have an escape.</p>

<div class="pitfall"><b>Two traps in one circuit.</b> (1) Swapping the LDR and the fixed resistor inverts the reading — bright light then gives a <em>low</em> number. Neither wiring is wrong, but your thresholds must match the one you built. (2) Thresholds calibrated at night fail in daytime; a lamp switching at exactly the threshold will flicker on and off. Add hysteresis: turn on below 150, but only turn off again above 250.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The map() trap: it does not clamp.</b> <span class="badge">map(raw, 0, 1023, 0, 100)</span> is linear interpolation, nothing more. If you calibrate with <span class="badge">map(raw, 90, 950, 0, 100)</span> and the sensor then reads 60 (darker than your calibration), map happily returns a <em>negative</em> percentage — and your PWM call receives garbage. The fix is one line: <span class="badge">constrain(value, 0, 100)</span>. Real firmware validates the range of every sensor reading before using it, because sensors do drift outside the range you measured.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Cảm biến thật đầu tiên của bạn</h2>
<p class="lead">Ba lab riêng biệt (buổi 15, 18, 19) đều dùng quang trở, vì đó là cách rẻ nhất để học trọn đường ống analog: một đại lượng vật lý → một điện trở → một điện áp → một con số → một quyết định.</p>

<h3>Đấu mạch: một LDR chỉ là nửa cảm biến</h3>
<p>LDR (quang trở) đổi điện trở theo ánh sáng: khoảng 1kΩ dưới ánh sáng mạnh, hơn 100kΩ trong tối. Arduino không đo được điện trở, nên bạn hoàn thiện một <strong>bộ chia áp</strong> với một điện trở cố định 10kΩ (Bài 3.3) và đọc điểm giữa bằng <span class="badge">analogRead(A0)</span>.</p>
<pre>5V ──[ LDR ]──┬──[ 10kΩ ]── GND
              │
              └── A0   <span class="tok-comment">// sáng hơn → số đọc lớn hơn</span></pre>

<h3>Bước 1: đừng bao giờ đoán ngưỡng — hãy hiệu chuẩn</h3>
<pre><span class="tok-keyword">void</span> <span class="tok-function">setup</span>() { Serial.<span class="tok-function">begin</span>(9600); }
<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  Serial.<span class="tok-function">println</span>(<span class="tok-function">analogRead</span>(A0));   <span class="tok-comment">// ghi lại giá trị…</span>
  <span class="tok-function">delay</span>(200);                          <span class="tok-comment">// …trong tối, trong phòng, dưới đèn pin</span>
}</pre>
<div class="out"><b>Giá trị đo tiêu biểu</b> (của bạn sẽ khác — và đó chính là điểm mấu chốt): tối ≈ 90, ánh sáng phòng ≈ 450, đèn pin ≈ 950. Mọi ngưỡng bạn viết phải đến từ ba con số của chính bạn, không phải từ một tutorial.</div>

<h3>Bước 2: "states of lights" — nhiều hơn bật/tắt</h3>
<pre><span class="tok-type">int</span> light = <span class="tok-function">analogRead</span>(A0);

<span class="tok-keyword">if</span> (light &lt; 150)        <span class="tok-function">setLamp</span>(255);   <span class="tok-comment">// đêm — sáng hết cỡ</span>
<span class="tok-keyword">else if</span> (light &lt; 400)   <span class="tok-function">setLamp</span>(120);   <span class="tok-comment">// chạng vạng — mờ</span>
<span class="tok-keyword">else if</span> (light &lt; 700)   <span class="tok-function">setLamp</span>(40);    <span class="tok-comment">// trời râm — rất mờ</span>
<span class="tok-keyword">else</span>                   <span class="tok-function">setLamp</span>(0);     <span class="tok-comment">// ban ngày — tắt</span></pre>
<div class="out">Đây chính là lab "Photoresistor — states of lights" của syllabus: một ngõ vào analog ánh xạ ra bốn hành vi rời rạc. Đó cũng đúng là cách một bộ điều khiển đèn đường thật hoạt động.</div>

<h3>Bước 3: lab vòng lặp while</h3>
<p>Buổi 19 ghép LDR với một vòng <span class="badge">while</span> — "cứ làm X <em>chừng nào</em> điều kiện còn đúng", ví dụ giữ còi kêu chừng nào phòng còn tối. Hãy dùng nó có chủ đích: một vòng <span class="badge">while</span> nằm trong <span class="badge">loop()</span> chặn mọi thứ khác cho tới khi nó kết thúc, nên nó phải ngắn hoặc phải có lối thoát.</p>

<div class="pitfall"><b>Hai cái bẫy trong một mạch.</b> (1) Đổi chỗ LDR và điện trở cố định làm đảo ngược số đọc — ánh sáng mạnh khi đó cho số <em>thấp</em>. Không cách đấu nào sai cả, nhưng ngưỡng của bạn phải khớp với mạch bạn đã dựng. (2) Ngưỡng hiệu chuẩn ban đêm sẽ hỏng vào ban ngày; một bóng đèn chuyển trạng thái đúng ngay tại ngưỡng sẽ chớp tắt liên tục. Hãy thêm dải trễ: bật khi dưới 150, nhưng chỉ tắt lại khi trên 250.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Bẫy của map(): nó KHÔNG kẹp giá trị.</b> <span class="badge">map(raw, 0, 1023, 0, 100)</span> chỉ là nội suy tuyến tính, không hơn. Nếu bạn hiệu chuẩn bằng <span class="badge">map(raw, 90, 950, 0, 100)</span> rồi cảm biến đọc ra 60 (tối hơn lúc hiệu chuẩn), map vui vẻ trả về một phần trăm <em>âm</em> — và lệnh PWM của bạn nhận rác. Cách sửa gọn một dòng: <span class="badge">constrain(value, 0, 100)</span>. Firmware thật luôn kiểm miền giá trị của mọi số đọc cảm biến trước khi dùng, vì cảm biến có trôi ra ngoài dải bạn đã đo.</div>
</div>
`,
        },
        {
          title: '5.3 — Fading & RGB colour mixing|||5.3 — Làm mờ dần & pha màu LED RGB',
          slug: 'iot102-rgb-fading',
          type: 'VIDEO',
          description: 'Lab buổi 9 và 30: analogWrite tạo hiệu ứng fade, và ba kênh PWM pha ra 16 triệu màu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>PWM as an expressive output</h2>
<p class="lead">Lesson 5.1 introduced <span class="badge">analogWrite(pin, 0..255)</span>. Sessions 9 ("Fading") and 30 ("RGB LED Color Mixing") turn that one function into two of the most satisfying labs in the course.</p>

<h3>Fading — a smooth breath</h3>
<pre><span class="tok-type">int</span> led = 9;          <span class="tok-comment">// must be a PWM (~) pin</span>
<span class="tok-type">int</span> level = 0, step = 5;

<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-function">analogWrite</span>(led, level);
  level += step;
  <span class="tok-keyword">if</span> (level &lt;= 0 || level &gt;= 255) step = -step;   <span class="tok-comment">// bounce at both ends</span>
  <span class="tok-function">delay</span>(30);
}</pre>
<div class="out">The LED brightens 0→255, then dims 255→0, forever. Changing <span class="badge">step</span> changes the speed; changing <span class="badge">delay</span> changes the smoothness.</div>

<h3>An RGB LED is three LEDs in one shell</h3>
<p>It has four legs: one common (cathode or anode) and one each for red, green and blue. Each colour leg needs its own 220Ω resistor and its own <b>PWM pin</b>. Setting three brightness levels mixes a colour.</p>
<pre><span class="tok-keyword">void</span> <span class="tok-function">setColor</span>(<span class="tok-type">int</span> r, <span class="tok-type">int</span> g, <span class="tok-type">int</span> b) {
  <span class="tok-function">analogWrite</span>(9,  r);
  <span class="tok-function">analogWrite</span>(10, g);
  <span class="tok-function">analogWrite</span>(11, b);
}
<span class="tok-comment">// setColor(255, 0, 0)   → red</span>
<span class="tok-comment">// setColor(255, 165, 0) → orange</span>
<span class="tok-comment">// setColor(128, 0, 128) → purple</span>
<span class="tok-comment">// setColor(255,255,255) → white-ish</span></pre>
<table>
  <thead><tr><th>Type</th><th>Common leg goes to</th><th>255 means</th></tr></thead>
  <tbody>
    <tr><td>Common <b>cathode</b></td><td>GND</td><td>full brightness</td></tr>
    <tr><td>Common <b>anode</b></td><td>5V</td><td><b>off</b> — the logic is inverted</td></tr>
  </tbody>
</table>
<div class="out"><b>Worked example — a temperature colour bar:</b> map 20–35°C onto blue → red. <span class="badge">int r = map(temp, 20, 35, 0, 255); setColor(r, 0, 255 - r);</span> The lamp turns from blue (cool) through purple to red (hot) — a whole dashboard in one component.</div>

<div class="pitfall"><b>Trap:</b> using pins 3, 5, 6, 9, 10, 11 matters — only these have the <span class="badge">~</span> mark on the UNO. <span class="badge">analogWrite</span> on any other pin silently degrades to plain on/off: values 0–127 give LOW, 128–255 give HIGH. Your fade becomes a blink and nothing warns you.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Your eye is not linear — and neither should your fade be.</b> Going from PWM 10 to 20 looks like a big jump; going from 200 to 210 is barely visible. Human brightness perception is roughly logarithmic (the Weber–Fechner law), so a linear fade appears to rush at the start and crawl at the end. Professional lighting code applies gamma correction — e.g. <span class="badge">out = pow(level / 255.0, 2.2) * 255</span> — which is why commercial dimmers feel smooth and a first Arduino fade does not. Try both and watch the difference.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>PWM như một ngõ ra biểu cảm</h2>
<p class="lead">Bài 5.1 đã giới thiệu <span class="badge">analogWrite(pin, 0..255)</span>. Buổi 9 ("Fading") và buổi 30 ("RGB LED Color Mixing") biến đúng một hàm đó thành hai lab đã tay nhất môn học.</p>

<h3>Fading — một nhịp thở mượt</h3>
<pre><span class="tok-type">int</span> led = 9;          <span class="tok-comment">// phải là chân PWM (~)</span>
<span class="tok-type">int</span> level = 0, step = 5;

<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-function">analogWrite</span>(led, level);
  level += step;
  <span class="tok-keyword">if</span> (level &lt;= 0 || level &gt;= 255) step = -step;   <span class="tok-comment">// nảy lại ở hai đầu</span>
  <span class="tok-function">delay</span>(30);
}</pre>
<div class="out">LED sáng dần 0→255, rồi mờ dần 255→0, mãi mãi. Đổi <span class="badge">step</span> là đổi tốc độ; đổi <span class="badge">delay</span> là đổi độ mượt.</div>

<h3>Một LED RGB là ba LED trong một vỏ</h3>
<p>Nó có bốn chân: một chân chung (cathode hoặc anode) và mỗi chân cho đỏ, lục, lam. Mỗi chân màu cần điện trở 220Ω riêng và một <b>chân PWM</b> riêng. Đặt ba mức sáng là pha ra một màu.</p>
<pre><span class="tok-keyword">void</span> <span class="tok-function">setColor</span>(<span class="tok-type">int</span> r, <span class="tok-type">int</span> g, <span class="tok-type">int</span> b) {
  <span class="tok-function">analogWrite</span>(9,  r);
  <span class="tok-function">analogWrite</span>(10, g);
  <span class="tok-function">analogWrite</span>(11, b);
}
<span class="tok-comment">// setColor(255, 0, 0)   → đỏ</span>
<span class="tok-comment">// setColor(255, 165, 0) → cam</span>
<span class="tok-comment">// setColor(128, 0, 128) → tím</span>
<span class="tok-comment">// setColor(255,255,255) → trắng ngà</span></pre>
<table>
  <thead><tr><th>Loại</th><th>Chân chung nối về</th><th>255 nghĩa là</th></tr></thead>
  <tbody>
    <tr><td>Chung <b>cathode</b></td><td>GND</td><td>sáng hết cỡ</td></tr>
    <tr><td>Chung <b>anode</b></td><td>5V</td><td><b>tắt</b> — logic bị đảo ngược</td></tr>
  </tbody>
</table>
<div class="out"><b>Ví dụ có lời giải — thanh màu báo nhiệt độ:</b> ánh xạ 20–35°C thành lam → đỏ. <span class="badge">int r = map(temp, 20, 35, 0, 255); setColor(r, 0, 255 - r);</span> Bóng đèn chuyển từ lam (mát) qua tím tới đỏ (nóng) — cả một bảng thông tin gói trong một linh kiện.</div>

<div class="pitfall"><b>Bẫy:</b> việc dùng đúng chân 3, 5, 6, 9, 10, 11 là quan trọng — chỉ những chân này có dấu <span class="badge">~</span> trên UNO. Gọi <span class="badge">analogWrite</span> trên chân khác sẽ âm thầm thoái hoá thành bật/tắt thường: giá trị 0–127 cho LOW, 128–255 cho HIGH. Hiệu ứng fade của bạn thành nhấp nháy mà chẳng có cảnh báo nào.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Mắt bạn không tuyến tính — và hiệu ứng fade cũng không nên tuyến tính.</b> Đi từ PWM 10 lên 20 trông như một bước nhảy lớn; đi từ 200 lên 210 thì gần như không thấy gì. Cảm nhận độ sáng của con người xấp xỉ logarit (định luật Weber–Fechner), nên một hiệu ứng fade tuyến tính trông như vọt lên ở đầu và bò lết ở cuối. Code chiếu sáng chuyên nghiệp áp dụng hiệu chỉnh gamma — ví dụ <span class="badge">out = pow(level / 255.0, 2.2) * 255</span> — đó là lý do bộ dimmer thương mại cho cảm giác mượt còn hiệu ứng fade Arduino đầu tiên thì không. Hãy thử cả hai và xem khác biệt.</div>
</div>
`,
        },
        {
          title: '5.4 — Smoothing: taming a noisy sensor|||5.4 — Làm mượt: thuần hoá một cảm biến nhiễu',
          slug: 'iot102-smoothing',
          type: 'VIDEO',
          description: 'Lab buổi 36: trung bình trượt bằng mảng vòng, khi nào dùng, và cái giá phải trả về độ trễ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>Why your readings jitter</h2>
<p class="lead">Print <span class="badge">analogRead(A0)</span> from a still sensor and the numbers still wobble: 512, 509, 514, 511… That is real electrical noise plus ADC quantisation. Session 36's "Smoothing" lab is the standard cure, and it is the analog twin of debouncing.</p>

<h3>The moving average — a circular buffer</h3>
<pre><span class="tok-keyword">const int</span> N = 10;              <span class="tok-comment">// how many samples to average</span>
<span class="tok-type">int</span> readings[N];
<span class="tok-type">int</span> index = 0, total = 0;

<span class="tok-keyword">void</span> <span class="tok-function">setup</span>() {
  Serial.<span class="tok-function">begin</span>(9600);
  <span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = 0; i &lt; N; i++) readings[i] = 0;   <span class="tok-comment">// start clean</span>
}

<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  total = total - readings[index];        <span class="tok-comment">// drop the oldest</span>
  readings[index] = <span class="tok-function">analogRead</span>(A0);      <span class="tok-comment">// take the newest</span>
  total = total + readings[index];        <span class="tok-comment">// add it in</span>
  index = (index + 1) % N;                <span class="tok-comment">// wrap around the buffer</span>

  <span class="tok-type">int</span> average = total / N;
  Serial.<span class="tok-function">println</span>(average);
  <span class="tok-function">delay</span>(10);
}</pre>
<div class="out">Only three arithmetic operations per sample, no matter how large N is — that is why <span class="badge">total</span> is kept as a running sum instead of re-adding the whole array. The <span class="badge">%</span> makes the index wrap: 0,1,…,9,0,1,…</div>

<h3>Choosing N — the trade-off nobody escapes</h3>
<table>
  <thead><tr><th>N</th><th>Noise</th><th>Response</th><th>Good for</th></tr></thead>
  <tbody>
    <tr><td>1 <small>(no smoothing)</small></td><td>full jitter</td><td>instant</td><td>fast events, edges</td></tr>
    <tr><td>10</td><td>much calmer</td><td>~10 samples behind</td><td>light, temperature</td></tr>
    <tr><td>50</td><td>very smooth</td><td>visibly laggy</td><td>slow quantities only</td></tr>
  </tbody>
</table>
<div class="out"><b>The rule:</b> smoothing buys stability with <em>delay</em>. Averaging 50 samples of a distance sensor makes a lovely steady number that tells you where the obstacle was half a second ago — useless for a robot about to hit it.</div>

<h3>Sending it to a graph</h3>
<p>The syllabus lab graphs the values in Processing; the Arduino IDE has the same thing built in — <b>Tools → Serial Plotter</b>. Print raw and smoothed values separated by a space and the plotter draws two lines, which makes the effect of N obvious at a glance:</p>
<pre>Serial.<span class="tok-function">print</span>(raw); Serial.<span class="tok-function">print</span>(<span class="tok-string">" "</span>); Serial.<span class="tok-function">println</span>(average);</pre>

<div class="pitfall"><b>Trap:</b> <span class="badge">int total</span> overflows. Ten readings of up to 1023 fit fine, but 50 readings sum to over 51,000 — past the 32,767 limit of an <span class="badge">int</span>, and the average goes negative. Use <span class="badge">long total</span> whenever N × 1023 could exceed 32,767.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Two better filters, in one line each.</b> The moving average needs an array; the <b>exponential filter</b> needs none: <span class="badge">avg = 0.9 * avg + 0.1 * newReading;</span> — it weights recent samples more and costs 4 bytes of RAM instead of 2×N. Second, for spike noise (a sensor that occasionally reports a wild value), the <b>median</b> of the last 3–5 readings beats any average: one absurd sample cannot move the median at all, while it drags an average along with it. Choosing the right filter for the right noise is a genuine engineering decision — and a great line in your project report.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Vì sao số đọc của bạn cứ nhảy múa</h2>
<p class="lead">In <span class="badge">analogRead(A0)</span> từ một cảm biến đứng yên mà các con số vẫn dao động: 512, 509, 514, 511… Đó là nhiễu điện thật cộng với sai số lượng tử hoá của ADC. Lab "Smoothing" ở buổi 36 là bài thuốc chuẩn, và nó là anh em song sinh dạng analog của chống dội.</p>

<h3>Trung bình trượt — một bộ đệm vòng</h3>
<pre><span class="tok-keyword">const int</span> N = 10;              <span class="tok-comment">// lấy trung bình bao nhiêu mẫu</span>
<span class="tok-type">int</span> readings[N];
<span class="tok-type">int</span> index = 0, total = 0;

<span class="tok-keyword">void</span> <span class="tok-function">setup</span>() {
  Serial.<span class="tok-function">begin</span>(9600);
  <span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = 0; i &lt; N; i++) readings[i] = 0;   <span class="tok-comment">// khởi đầu sạch</span>
}

<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  total = total - readings[index];        <span class="tok-comment">// bỏ mẫu cũ nhất</span>
  readings[index] = <span class="tok-function">analogRead</span>(A0);      <span class="tok-comment">// lấy mẫu mới nhất</span>
  total = total + readings[index];        <span class="tok-comment">// cộng nó vào</span>
  index = (index + 1) % N;                <span class="tok-comment">// chạy vòng quanh bộ đệm</span>

  <span class="tok-type">int</span> average = total / N;
  Serial.<span class="tok-function">println</span>(average);
  <span class="tok-function">delay</span>(10);
}</pre>
<div class="out">Chỉ ba phép tính mỗi mẫu, dù N lớn tới đâu — đó là lý do <span class="badge">total</span> được giữ như một tổng chạy thay vì cộng lại cả mảng. Phép <span class="badge">%</span> làm chỉ số quay vòng: 0,1,…,9,0,1,…</div>

<h3>Chọn N — sự đánh đổi không ai thoát được</h3>
<table>
  <thead><tr><th>N</th><th>Nhiễu</th><th>Độ nhạy</th><th>Hợp với</th></tr></thead>
  <tbody>
    <tr><td>1 <small>(không làm mượt)</small></td><td>nhảy hết cỡ</td><td>tức thì</td><td>sự kiện nhanh, phát hiện sườn</td></tr>
    <tr><td>10</td><td>êm hơn nhiều</td><td>trễ ~10 mẫu</td><td>ánh sáng, nhiệt độ</td></tr>
    <tr><td>50</td><td>rất mượt</td><td>lờ đờ thấy rõ</td><td>chỉ dùng cho đại lượng biến chậm</td></tr>
  </tbody>
</table>
<div class="out"><b>Quy tắc:</b> làm mượt đổi sự ổn định lấy <em>độ trễ</em>. Trung bình 50 mẫu của cảm biến khoảng cách cho ra một con số đẹp và ổn định, báo cho bạn biết vật cản đã ở đâu nửa giây trước — vô dụng với một con robot sắp đâm vào nó.</div>

<h3>Đưa lên đồ thị</h3>
<p>Lab trong syllabus vẽ đồ thị bằng Processing; Arduino IDE có sẵn thứ tương đương — <b>Tools → Serial Plotter</b>. In giá trị thô và giá trị đã mượt cách nhau một dấu cách thì plotter vẽ hai đường, và tác dụng của N hiện ra rõ mồn một:</p>
<pre>Serial.<span class="tok-function">print</span>(raw); Serial.<span class="tok-function">print</span>(<span class="tok-string">" "</span>); Serial.<span class="tok-function">println</span>(average);</pre>

<div class="pitfall"><b>Bẫy:</b> <span class="badge">int total</span> bị tràn. Mười số đọc tối đa 1023 thì vừa, nhưng 50 số đọc cộng lại hơn 51.000 — vượt giới hạn 32.767 của một <span class="badge">int</span>, và giá trị trung bình hoá âm. Hãy dùng <span class="badge">long total</span> mỗi khi N × 1023 có thể vượt 32.767.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hai bộ lọc tốt hơn, mỗi cái một dòng.</b> Trung bình trượt cần một mảng; <b>bộ lọc mũ</b> thì không cần gì: <span class="badge">avg = 0.9 * avg + 0.1 * newReading;</span> — nó đánh trọng số cao hơn cho mẫu gần đây và tốn 4 byte RAM thay vì 2×N. Thứ hai, với nhiễu xung (cảm biến thỉnh thoảng báo một giá trị điên rồ), <b>trung vị</b> của 3–5 số đọc gần nhất thắng mọi phép trung bình: một mẫu vô lý không nhích được trung vị chút nào, trong khi nó kéo giá trị trung bình đi theo. Chọn đúng bộ lọc cho đúng loại nhiễu là một quyết định kỹ thuật thực thụ — và là một câu rất đắt trong báo cáo đồ án.</div>
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
        {
          title: '6.2 — Ultrasonic distance with the HC-SR04|||6.2 — Đo khoảng cách siêu âm với HC-SR04',
          slug: 'iot102-sieu-am',
          type: 'VIDEO',
          description: 'Lab buổi 20: nguyên lý trigger/echo, công thức đổi thời gian ra centimet, và giới hạn thực tế của cảm biến.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Measuring distance with sound</h2>
<p class="lead">The HC-SR04 is the workhorse of student IoT projects — parking sensors, obstacle-avoiding robots, water-tank level, automatic bins. It works exactly like a bat: emit a chirp, time the echo.</p>

<h3>The four pins and the protocol</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>VCC / GND</b> — 5V power.</div>
  <div class="lz-layer"><b>Trig</b> — you send a 10-microsecond HIGH pulse to say "chirp now".</div>
  <div class="lz-layer"><b>Echo</b> — the sensor holds this pin HIGH for exactly as long as the sound took to fly out and come back.</div>
</div>

<pre><span class="tok-keyword">const int</span> TRIG = 9, ECHO = 10;

<span class="tok-keyword">void</span> <span class="tok-function">setup</span>() {
  <span class="tok-function">pinMode</span>(TRIG, OUTPUT);
  <span class="tok-function">pinMode</span>(ECHO, INPUT);
  Serial.<span class="tok-function">begin</span>(9600);
}

<span class="tok-type">long</span> <span class="tok-function">readDistanceCm</span>() {
  <span class="tok-function">digitalWrite</span>(TRIG, LOW);  <span class="tok-function">delayMicroseconds</span>(2);
  <span class="tok-function">digitalWrite</span>(TRIG, HIGH); <span class="tok-function">delayMicroseconds</span>(10);   <span class="tok-comment">// the chirp</span>
  <span class="tok-function">digitalWrite</span>(TRIG, LOW);

  <span class="tok-type">long</span> us = <span class="tok-function">pulseIn</span>(ECHO, HIGH, 30000);          <span class="tok-comment">// microseconds, 30ms timeout</span>
  <span class="tok-keyword">if</span> (us == 0) <span class="tok-keyword">return</span> -1;                          <span class="tok-comment">// nothing came back</span>
  <span class="tok-keyword">return</span> us / 58;                                  <span class="tok-comment">// → centimetres</span>
}</pre>

<h3>Where 58 comes from — do the arithmetic once</h3>
<div class="out">Sound travels ≈ <b>340 m/s</b> = 0.034 cm per microsecond. The pulse goes <em>there and back</em>, so the one-way distance is half:<br>
distance = (us × 0.034) / 2 = us / 58.8 ≈ <b>us / 58</b>.<br>
<b>Worked example:</b> echo held HIGH for 1160 µs → 1160 / 58 = <b>20 cm</b>.</div>

<h3>Honest limits (say these in your project defence)</h3>
<table>
  <thead><tr><th>Limit</th><th>Consequence</th></tr></thead>
  <tbody>
    <tr><td>Range ≈ 2 cm – 4 m</td><td>closer than 2 cm reads nonsense; further away the echo is lost</td></tr>
    <tr><td>Cone ≈ 15°</td><td>it does not see a narrow object off to the side</td></tr>
    <tr><td>Soft / angled surfaces</td><td>cloth, foam and a wall at 45° scatter the sound — no echo returns</td></tr>
    <tr><td>Temperature affects the speed of sound</td><td>±5% error across a hot/cold day if you need real precision</td></tr>
  </tbody>
</table>

<div class="pitfall"><b>Trap:</b> calling <span class="badge">pulseIn</span> without a timeout. If no echo comes back (soft object, out of range), the default call blocks for a full second — your program freezes once per reading and everything else stops. Always pass a timeout, and always handle the "no reading" case (the <span class="badge">-1</span> above) instead of treating it as distance zero.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Sensor fusion — why cars use more than one.</b> Ultrasonic is cheap and works in the dark, but fails on soft surfaces. Infrared distance sensors are fast but fooled by sunlight. LiDAR is precise but expensive. Real products combine them and trust whichever is reliable in the current conditions — that is <b>sensor fusion</b>. Even in a student project, taking three readings and using the median (Lesson 5.4) is a small step in the same direction, and shows the examiner you know a single reading is never the truth.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Đo khoảng cách bằng âm thanh</h2>
<p class="lead">HC-SR04 là con ngựa thồ của đồ án IoT sinh viên — cảm biến đỗ xe, robot tránh vật cản, đo mức nước bồn, thùng rác tự động. Nó hoạt động y hệt con dơi: phát một tiếng kêu, bấm giờ tiếng vọng.</p>

<h3>Bốn chân và giao thức</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>VCC / GND</b> — nguồn 5V.</div>
  <div class="lz-layer"><b>Trig</b> — bạn gửi một xung HIGH dài 10 micro-giây để bảo "kêu đi".</div>
  <div class="lz-layer"><b>Echo</b> — cảm biến giữ chân này ở HIGH đúng bằng khoảng thời gian âm thanh bay đi và quay về.</div>
</div>

<pre><span class="tok-keyword">const int</span> TRIG = 9, ECHO = 10;

<span class="tok-keyword">void</span> <span class="tok-function">setup</span>() {
  <span class="tok-function">pinMode</span>(TRIG, OUTPUT);
  <span class="tok-function">pinMode</span>(ECHO, INPUT);
  Serial.<span class="tok-function">begin</span>(9600);
}

<span class="tok-type">long</span> <span class="tok-function">readDistanceCm</span>() {
  <span class="tok-function">digitalWrite</span>(TRIG, LOW);  <span class="tok-function">delayMicroseconds</span>(2);
  <span class="tok-function">digitalWrite</span>(TRIG, HIGH); <span class="tok-function">delayMicroseconds</span>(10);   <span class="tok-comment">// phát tiếng kêu</span>
  <span class="tok-function">digitalWrite</span>(TRIG, LOW);

  <span class="tok-type">long</span> us = <span class="tok-function">pulseIn</span>(ECHO, HIGH, 30000);          <span class="tok-comment">// micro-giây, hạn chờ 30ms</span>
  <span class="tok-keyword">if</span> (us == 0) <span class="tok-keyword">return</span> -1;                          <span class="tok-comment">// không có gì vọng về</span>
  <span class="tok-keyword">return</span> us / 58;                                  <span class="tok-comment">// → centimet</span>
}</pre>

<h3>Số 58 ở đâu ra — tính một lần cho thuộc</h3>
<div class="out">Âm thanh đi ≈ <b>340 m/s</b> = 0,034 cm mỗi micro-giây. Xung đi <em>cả đi lẫn về</em>, nên quãng đường một chiều là một nửa:<br>
khoảng cách = (us × 0,034) / 2 = us / 58,8 ≈ <b>us / 58</b>.<br>
<b>Ví dụ có lời giải:</b> chân echo giữ HIGH trong 1160 µs → 1160 / 58 = <b>20 cm</b>.</div>

<h3>Giới hạn thật (hãy nói những điều này khi bảo vệ đồ án)</h3>
<table>
  <thead><tr><th>Giới hạn</th><th>Hệ quả</th></tr></thead>
  <tbody>
    <tr><td>Tầm đo ≈ 2 cm – 4 m</td><td>gần hơn 2 cm thì đọc bậy; xa hơn thì mất tiếng vọng</td></tr>
    <tr><td>Góc mở ≈ 15°</td><td>nó không thấy một vật hẹp nằm lệch sang bên</td></tr>
    <tr><td>Bề mặt mềm / nghiêng</td><td>vải, xốp và tường nghiêng 45° tán xạ âm — không có tiếng vọng nào về</td></tr>
    <tr><td>Nhiệt độ ảnh hưởng tốc độ âm</td><td>sai số ±5% giữa ngày nóng và lạnh nếu bạn cần độ chính xác thật</td></tr>
  </tbody>
</table>

<div class="pitfall"><b>Bẫy:</b> gọi <span class="badge">pulseIn</span> mà không đặt hạn chờ. Nếu không có tiếng vọng nào về (vật mềm, ngoài tầm), lời gọi mặc định chặn trọn một giây — chương trình của bạn đóng băng mỗi lần đọc và mọi thứ khác đứng hình. Luôn truyền hạn chờ, và luôn xử lý trường hợp "không đọc được" (giá trị <span class="badge">-1</span> ở trên) thay vì coi nó là khoảng cách bằng không.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hợp nhất cảm biến — vì sao xe hơi dùng nhiều hơn một loại.</b> Siêu âm rẻ và chạy được trong tối, nhưng chịu thua bề mặt mềm. Cảm biến khoảng cách hồng ngoại thì nhanh nhưng bị ánh nắng đánh lừa. LiDAR chính xác nhưng đắt. Sản phẩm thật kết hợp chúng và tin vào cái nào đáng tin trong điều kiện hiện tại — đó là <b>hợp nhất cảm biến (sensor fusion)</b>. Ngay trong đồ án sinh viên, lấy ba số đọc rồi dùng trung vị (Bài 5.4) đã là một bước nhỏ theo hướng đó, và cho giám khảo thấy bạn hiểu một số đọc đơn lẻ không bao giờ là sự thật.</div>
</div>
`,
        },
        {
          title: '6.3 — Servo motors: sweep & knob control|||6.3 — Động cơ servo: quét và điều khiển bằng núm vặn',
          slug: 'iot102-servo',
          type: 'VIDEO',
          description: 'Lab buổi 21: servo hoạt động bằng độ rộng xung, thư viện Servo, ghép biến trở, và bài toán cấp nguồn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>An actuator that goes to an angle</h2>
<p class="lead">A DC motor spins. A <strong>servo</strong> goes to a position and holds it — 0° to 180° — which is why it opens gates, aims sensors, and moves robot arms in nearly every project. Session 21 gives it two labs: Sweep and Knob.</p>

<h3>How a servo is commanded</h3>
<p>Three wires: red = 5V, brown/black = GND, orange/yellow = signal. The signal is a pulse repeated every 20 ms whose <em>width</em> encodes the angle: ≈1.0 ms → 0°, ≈1.5 ms → 90°, ≈2.0 ms → 180°. Inside, the servo compares the commanded angle with its own potentiometer and drives its motor until they match — a closed feedback loop in a 2-dollar package.</p>
<div class="note-ct">The <span class="badge">Servo</span> library generates those pulses for you, so you write degrees, not microseconds. It uses Timer1, which is why <b>pins 9 and 10 lose PWM</b> while the library is in use — a genuine exam-worthy side effect.</div>

<h3>Lab 1 — Sweep</h3>
<pre><span class="tok-keyword">#include</span> <span class="tok-string">&lt;Servo.h&gt;</span>
<span class="tok-type">Servo</span> gate;

<span class="tok-keyword">void</span> <span class="tok-function">setup</span>() { gate.<span class="tok-function">attach</span>(9); }

<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-keyword">for</span> (<span class="tok-type">int</span> a = 0; a &lt;= 180; a++) { gate.<span class="tok-function">write</span>(a); <span class="tok-function">delay</span>(15); }
  <span class="tok-keyword">for</span> (<span class="tok-type">int</span> a = 180; a &gt;= 0; a--) { gate.<span class="tok-function">write</span>(a); <span class="tok-function">delay</span>(15); }
}</pre>
<div class="out">The <span class="badge">delay(15)</span> is not decoration: the servo needs time to physically travel one degree. Remove it and the servo simply cannot keep up with the commands.</div>

<h3>Lab 2 — Knob: an analog input driving an actuator</h3>
<pre><span class="tok-type">int</span> raw = <span class="tok-function">analogRead</span>(A0);              <span class="tok-comment">// potentiometer 0..1023</span>
<span class="tok-type">int</span> angle = <span class="tok-function">map</span>(raw, 0, 1023, 0, 180);  <span class="tok-comment">// → 0..180 degrees</span>
gate.<span class="tok-function">write</span>(angle);
<span class="tok-function">delay</span>(15);</pre>
<div class="out">This tiny sketch is the entire sense → decide → act chain in three lines, and it is the template for every "sensor controls an actuator" feature: swap the potentiometer for the HC-SR04 and you have an automatic gate.</div>

<div class="pitfall"><b>The power trap, restated because it destroys boards.</b> A small SG90 servo draws ~100–250 mA while moving and can spike over 500 mA when it starts or stalls. The Arduino's 5V pin cannot supply that: the board browns out and resets mid-movement (symptom: the servo twitches and the Serial Monitor restarts). Fix: power the servo from a separate 5V supply or battery pack, and <b>connect the two grounds together</b> — without a shared GND the signal has no reference and the servo jitters randomly.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Standard vs continuous-rotation servos.</b> They look identical, but a <em>continuous</em> servo has had its feedback potentiometer disconnected: <span class="badge">write(0)</span> means full speed one way, <span class="badge">write(90)</span> means stop, <span class="badge">write(180)</span> means full speed the other way. It is a geared motor with speed control, not a positioner — perfect for robot wheels, useless for a gate. Buying the wrong one is a classic project delay, and "which type does your design need?" is exactly the sort of question a project examiner enjoys asking.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Một cơ cấu chấp hành biết đi tới một góc</h2>
<p class="lead">Động cơ DC thì quay. Một <strong>servo</strong> thì đi tới một vị trí và giữ ở đó — 0° tới 180° — đó là lý do nó mở cổng, xoay hướng cảm biến, và cử động cánh tay robot trong gần như mọi đồ án. Buổi 21 dành cho nó hai lab: Sweep và Knob.</p>

<h3>Servo được ra lệnh thế nào</h3>
<p>Ba dây: đỏ = 5V, nâu/đen = GND, cam/vàng = tín hiệu. Tín hiệu là một xung lặp lại mỗi 20 ms mà <em>độ rộng</em> của nó mã hoá góc: ≈1,0 ms → 0°, ≈1,5 ms → 90°, ≈2,0 ms → 180°. Bên trong, servo so góc được lệnh với chính biến trở của nó và chạy động cơ tới khi hai giá trị khớp nhau — một vòng phản hồi kín gói trong món đồ 2 đô.</p>
<div class="note-ct">Thư viện <span class="badge">Servo</span> sinh các xung đó giúp bạn, nên bạn viết bằng độ, không phải micro-giây. Nó dùng Timer1, và đó là lý do <b>chân 9 và 10 mất khả năng PWM</b> khi thư viện đang được dùng — một tác dụng phụ rất đáng vào đề thi.</div>

<h3>Lab 1 — Sweep (quét qua lại)</h3>
<pre><span class="tok-keyword">#include</span> <span class="tok-string">&lt;Servo.h&gt;</span>
<span class="tok-type">Servo</span> gate;

<span class="tok-keyword">void</span> <span class="tok-function">setup</span>() { gate.<span class="tok-function">attach</span>(9); }

<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-keyword">for</span> (<span class="tok-type">int</span> a = 0; a &lt;= 180; a++) { gate.<span class="tok-function">write</span>(a); <span class="tok-function">delay</span>(15); }
  <span class="tok-keyword">for</span> (<span class="tok-type">int</span> a = 180; a &gt;= 0; a--) { gate.<span class="tok-function">write</span>(a); <span class="tok-function">delay</span>(15); }
}</pre>
<div class="out">Dòng <span class="badge">delay(15)</span> không phải để trang trí: servo cần thời gian để di chuyển vật lý một độ. Bỏ nó đi thì servo đơn giản là không theo kịp lệnh.</div>

<h3>Lab 2 — Knob: một ngõ vào analog lái một cơ cấu chấp hành</h3>
<pre><span class="tok-type">int</span> raw = <span class="tok-function">analogRead</span>(A0);              <span class="tok-comment">// biến trở 0..1023</span>
<span class="tok-type">int</span> angle = <span class="tok-function">map</span>(raw, 0, 1023, 0, 180);  <span class="tok-comment">// → 0..180 độ</span>
gate.<span class="tok-function">write</span>(angle);
<span class="tok-function">delay</span>(15);</pre>
<div class="out">Sketch tí hon này là trọn chuỗi cảm nhận → quyết định → tác động trong ba dòng, và nó là khuôn mẫu cho mọi tính năng "cảm biến điều khiển cơ cấu chấp hành": đổi biến trở thành HC-SR04 là bạn có một cái cổng tự động.</div>

<div class="pitfall"><b>Cái bẫy nguồn điện, nhắc lại vì nó phá board.</b> Một servo SG90 nhỏ hút ~100–250 mA khi chuyển động và có thể vọt trên 500 mA lúc khởi động hoặc bị kẹt. Chân 5V của Arduino không cấp nổi: board sụt áp và reset giữa chừng (triệu chứng: servo giật giật và Serial Monitor khởi động lại). Cách sửa: cấp nguồn servo từ một nguồn 5V hoặc pin riêng, và <b>nối hai đường GND với nhau</b> — không có GND chung thì tín hiệu không có mốc tham chiếu và servo rung lắc lung tung.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Servo thường và servo quay liên tục.</b> Chúng trông y hệt nhau, nhưng servo <em>quay liên tục</em> đã bị ngắt biến trở phản hồi: <span class="badge">write(0)</span> nghĩa là chạy hết tốc một chiều, <span class="badge">write(90)</span> nghĩa là dừng, <span class="badge">write(180)</span> nghĩa là hết tốc chiều kia. Nó là một động cơ có hộp số điều khiển được tốc độ, không phải bộ định vị — hoàn hảo cho bánh robot, vô dụng cho cái cổng. Mua nhầm loại là một pha trễ đồ án kinh điển, và "thiết kế của em cần loại nào?" đúng là kiểu câu hỏi giám khảo đồ án thích hỏi.</div>
</div>
`,
        },
        {
          title: '6.4 — Temperature with the LM35|||6.4 — Đo nhiệt độ với LM35',
          slug: 'iot102-lm35',
          type: 'VIDEO',
          description: 'Lab buổi 33: đổi analogRead ra độ C, so sánh LM35 với DHT11, và cải thiện độ chính xác.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>From volts to degrees</h2>
<p class="lead">The LM35 is the friendliest sensor in the KIT: three legs, no library, and an output voltage that is directly proportional to temperature — <b>10 mV per °C</b>. It is the perfect exercise in unit conversion, which is half of all sensor work.</p>

<h3>The conversion, derived step by step</h3>
<pre><span class="tok-type">int</span> raw = <span class="tok-function">analogRead</span>(A0);                <span class="tok-comment">// 0..1023</span>
<span class="tok-type">float</span> volts = raw * 5.0 / 1023.0;         <span class="tok-comment">// → volts</span>
<span class="tok-type">float</span> celsius = volts * 100.0;            <span class="tok-comment">// 10mV per °C → ×100</span>

Serial.<span class="tok-function">print</span>(celsius); Serial.<span class="tok-function">println</span>(<span class="tok-string">" C"</span>);</pre>
<div class="out"><b>Worked example:</b> raw = 154 → volts = 154 × 5 / 1023 = 0.7527 V → 0.7527 × 100 = <b>75.3… no, 75°C?</b> Check the sensor: 0.75 V really does mean 75°C for an LM35. A room-temperature reading of 27°C corresponds to 0.27 V → raw ≈ 55. If your raw value sits near 55–60, everything is correct.</div>

<h3>Resolution: the number that limits you</h3>
<p>One ADC step is 5 V / 1024 ≈ 4.9 mV, and 10 mV = 1 °C — so <b>one step ≈ 0.49 °C</b>. No amount of decimal places in your <span class="badge">float</span> can invent precision the hardware does not have. Printing "27.34 °C" is dishonest; print one decimal at most.</p>

<h3>Choosing between the two temperature sensors in the KIT</h3>
<table>
  <thead><tr><th></th><th>LM35 (analog)</th><th>DHT11 (digital)</th></tr></thead>
  <tbody>
    <tr><td>Reads</td><td>temperature only</td><td>temperature <b>and</b> humidity</td></tr>
    <tr><td>Interface</td><td>analogRead, no library</td><td>1-wire protocol, needs the DHT library</td></tr>
    <tr><td>Accuracy</td><td>±0.5 °C</td><td>±2 °C, ±5% RH</td></tr>
    <tr><td>Sampling</td><td>as fast as you like</td><td><b>once per second maximum</b></td></tr>
  </tbody>
</table>
<div class="note-ct">Rule of thumb: need humidity too → DHT11. Need accuracy or fast sampling → LM35. Being able to justify the choice is worth marks in the project defence.</div>

<div class="pitfall"><b>Two traps.</b> (1) Wiring the LM35 backwards (swapping VCC and GND) makes it heat up fast enough to burn your finger — check the flat face and pinout before powering. (2) Integer division: <span class="badge">int celsius = raw * 5 / 1023 * 100;</span> computes in integers and gives 0. Force floating point with <span class="badge">5.0</span> and <span class="badge">1023.0</span>.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Use the internal 1.1 V reference and double your precision.</b> The LM35 never exceeds ~1.5 V in normal room conditions, so measuring it against a 5 V full scale throws away three quarters of the ADC's range. Call <span class="badge">analogReference(INTERNAL)</span> and the 10 bits now span 0–1.1 V: one step becomes 1.07 mV ≈ 0.1 °C, a five-fold improvement — for free, with one line of code. The conversion changes to <span class="badge">celsius = raw * 1.1 / 1023.0 * 100</span>. Matching the reference to the signal's real range is a technique used in every serious measurement design.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Từ volt sang độ C</h2>
<p class="lead">LM35 là cảm biến dễ tính nhất trong bộ KIT: ba chân, không cần thư viện, và điện áp ra tỉ lệ thuận trực tiếp với nhiệt độ — <b>10 mV mỗi °C</b>. Nó là bài tập hoàn hảo về đổi đơn vị, thứ chiếm một nửa công việc với cảm biến.</p>

<h3>Phép đổi, dẫn từng bước</h3>
<pre><span class="tok-type">int</span> raw = <span class="tok-function">analogRead</span>(A0);                <span class="tok-comment">// 0..1023</span>
<span class="tok-type">float</span> volts = raw * 5.0 / 1023.0;         <span class="tok-comment">// → volt</span>
<span class="tok-type">float</span> celsius = volts * 100.0;            <span class="tok-comment">// 10mV mỗi °C → ×100</span>

Serial.<span class="tok-function">print</span>(celsius); Serial.<span class="tok-function">println</span>(<span class="tok-string">" C"</span>);</pre>
<div class="out"><b>Ví dụ có lời giải:</b> nhiệt độ phòng 27°C ứng với 0,27 V, tức raw = 0,27 × 1023 / 5 ≈ <b>55</b>. Kiểm ngược lại: raw = 55 → volts = 55 × 5 / 1023 = 0,2688 V → × 100 = <b>26,9 °C</b>. Nếu giá trị thô của bạn nằm quanh 55–60, mọi thứ đang đúng.</div>

<h3>Độ phân giải: con số giới hạn bạn</h3>
<p>Một bước ADC là 5 V / 1024 ≈ 4,9 mV, mà 10 mV = 1 °C — vậy <b>một bước ≈ 0,49 °C</b>. Không số thập phân nào trong biến <span class="badge">float</span> của bạn bịa ra được độ chính xác mà phần cứng không có. In "27,34 °C" là thiếu trung thực; in nhiều nhất một chữ số thập phân.</p>

<h3>Chọn giữa hai cảm biến nhiệt trong KIT</h3>
<table>
  <thead><tr><th></th><th>LM35 (analog)</th><th>DHT11 (số)</th></tr></thead>
  <tbody>
    <tr><td>Đọc được</td><td>chỉ nhiệt độ</td><td>nhiệt độ <b>và</b> độ ẩm</td></tr>
    <tr><td>Giao tiếp</td><td>analogRead, không cần thư viện</td><td>giao thức 1 dây, cần thư viện DHT</td></tr>
    <tr><td>Sai số</td><td>±0,5 °C</td><td>±2 °C, ±5% RH</td></tr>
    <tr><td>Tần suất lấy mẫu</td><td>nhanh tuỳ ý</td><td><b>tối đa một lần mỗi giây</b></td></tr>
  </tbody>
</table>
<div class="note-ct">Quy tắc bỏ túi: cần cả độ ẩm → DHT11. Cần độ chính xác hoặc lấy mẫu nhanh → LM35. Biện luận được lựa chọn của mình là ăn điểm khi bảo vệ đồ án.</div>

<div class="pitfall"><b>Hai cái bẫy.</b> (1) Đấu ngược LM35 (đảo VCC và GND) làm nó nóng lên nhanh tới mức bỏng tay — kiểm mặt phẳng và sơ đồ chân trước khi cấp nguồn. (2) Chia số nguyên: <span class="badge">int celsius = raw * 5 / 1023 * 100;</span> tính toàn số nguyên và cho ra 0. Hãy ép về số thực bằng <span class="badge">5.0</span> và <span class="badge">1023.0</span>.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Dùng điện áp tham chiếu nội 1,1 V để nhân đôi độ chính xác.</b> LM35 trong điều kiện phòng bình thường không bao giờ vượt ~1,5 V, nên đo nó trên thang toàn dải 5 V là vứt đi ba phần tư dải ADC. Gọi <span class="badge">analogReference(INTERNAL)</span> và 10 bit giờ trải trên 0–1,1 V: một bước thành 1,07 mV ≈ 0,1 °C, tốt lên gấp năm — miễn phí, bằng đúng một dòng code. Phép đổi khi đó thành <span class="badge">celsius = raw * 1.1 / 1023.0 * 100</span>. Khớp điện áp tham chiếu với dải thật của tín hiệu là kỹ thuật dùng trong mọi thiết kế đo lường nghiêm túc.</div>
</div>
`,
        },
        {
          title: '6.5 — Human input: IR remote & 4x4 keypad|||6.5 — Nhập liệu từ người: điều khiển hồng ngoại & bàn phím 4x4',
          slug: 'iot102-ir-keypad',
          type: 'VIDEO',
          description: 'Lab buổi 28 và 50: giải mã lệnh IR, quét ma trận bàn phím, và dựng menu nhập mã PIN.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.5</span>
<h2>Letting a person talk to your device</h2>
<p class="lead">A single push button was Chapter 4. Sessions 28 and 50 add two ways to give a device real commands: an infrared remote (wireless, no wiring to the user) and a 4×4 keypad (16 keys on 8 pins).</p>

<h3>IR remote — receiving a code</h3>
<p>The remote's LED flashes an invisible infrared pattern; a 3-pin receiver (e.g. VS1838B) demodulates it and hands the Arduino a stream of pulses. The library turns that into a hexadecimal code, unique to each button.</p>
<pre><span class="tok-keyword">#include</span> <span class="tok-string">&lt;IRremote.h&gt;</span>
<span class="tok-keyword">const int</span> RECV = 11;

<span class="tok-keyword">void</span> <span class="tok-function">setup</span>() {
  Serial.<span class="tok-function">begin</span>(9600);
  <span class="tok-function">IrReceiver</span>.<span class="tok-function">begin</span>(RECV);
}

<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-keyword">if</span> (<span class="tok-function">IrReceiver</span>.<span class="tok-function">decode</span>()) {
    <span class="tok-type">unsigned long</span> code = <span class="tok-function">IrReceiver</span>.decodedIRData.decodedRawData;
    Serial.<span class="tok-function">println</span>(code, HEX);        <span class="tok-comment">// step 1: LEARN the codes</span>

    <span class="tok-keyword">if</span> (code == 0xFF30CF) <span class="tok-function">digitalWrite</span>(13, HIGH);   <span class="tok-comment">// button "1"</span>
    <span class="tok-keyword">if</span> (code == 0xFF18E7) <span class="tok-function">digitalWrite</span>(13, LOW);    <span class="tok-comment">// button "2"</span>

    <span class="tok-function">IrReceiver</span>.<span class="tok-function">resume</span>();              <span class="tok-comment">// ready for the next code</span>
  }
}</pre>
<div class="out"><b>The workflow that always works:</b> first upload a sketch that only prints codes, press every button you care about, write the codes down — <em>then</em> write the <span class="badge">if</span> statements. Never copy codes from a tutorial: they differ between remotes.</div>

<h3>4×4 keypad — 16 buttons on 8 pins</h3>
<p>Wiring 16 buttons individually would need 16 pins. Instead the keys sit at the crossings of 4 rows and 4 columns. The library drives one row LOW at a time and reads which column went LOW — 8 pins, 16 keys. That is <b>matrix scanning</b>, the same idea as the LED matrix in the next lesson.</p>
<pre><span class="tok-keyword">#include</span> <span class="tok-string">&lt;Keypad.h&gt;</span>
<span class="tok-keyword">const byte</span> ROWS = 4, COLS = 4;
<span class="tok-type">char</span> keys[ROWS][COLS] = {
  {<span class="tok-string">'1'</span>,<span class="tok-string">'2'</span>,<span class="tok-string">'3'</span>,<span class="tok-string">'A'</span>},
  {<span class="tok-string">'4'</span>,<span class="tok-string">'5'</span>,<span class="tok-string">'6'</span>,<span class="tok-string">'B'</span>},
  {<span class="tok-string">'7'</span>,<span class="tok-string">'8'</span>,<span class="tok-string">'9'</span>,<span class="tok-string">'C'</span>},
  {<span class="tok-string">'*'</span>,<span class="tok-string">'0'</span>,<span class="tok-string">'#'</span>,<span class="tok-string">'D'</span>}
};
<span class="tok-keyword">byte</span> rowPins[ROWS] = {9, 8, 7, 6};
<span class="tok-keyword">byte</span> colPins[COLS] = {5, 4, 3, 2};
<span class="tok-type">Keypad</span> pad = <span class="tok-function">Keypad</span>(<span class="tok-function">makeKeymap</span>(keys), rowPins, colPins, ROWS, COLS);

<span class="tok-type">String</span> entered = <span class="tok-string">""</span>;
<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-type">char</span> k = pad.<span class="tok-function">getKey</span>();
  <span class="tok-keyword">if</span> (k) {
    <span class="tok-keyword">if</span> (k == <span class="tok-string">'#'</span>) {                      <span class="tok-comment">// # = confirm</span>
      <span class="tok-keyword">if</span> (entered == <span class="tok-string">"1234"</span>) <span class="tok-function">unlock</span>();
      entered = <span class="tok-string">""</span>;
    } <span class="tok-keyword">else if</span> (k == <span class="tok-string">'*'</span>) entered = <span class="tok-string">""</span>;   <span class="tok-comment">// * = clear</span>
    <span class="tok-keyword">else</span> entered += k;
  }
}</pre>
<div class="out">A PIN-code door lock in twenty lines — combine it with the servo from Lesson 6.3 and you have a complete, defensible project.</div>

<div class="pitfall"><b>Trap:</b> the keypad library already debounces, but the IR receiver does not deduplicate. Holding a remote button sends a "repeat" code (often <span class="badge">0xFFFFFFFF</span>) many times a second, so a toggle action fires repeatedly. Either ignore the repeat code explicitly, or apply the state-change pattern from Lesson 4.3.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Never store a PIN in plain text — and why that matters even here.</b> The comparison <span class="badge">entered == "1234"</span> keeps the secret in Flash, readable by anyone who dumps the chip with an ISP programmer (it takes seconds and no soldering). Real devices store a <em>hash</em> of the PIN and compare hashes. Your course project will not be attacked, but saying this in the defence shows Chapter 10's security thinking applied to your own design — which is exactly what CLO4 is asking for.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.5</span>
<h2>Để con người nói chuyện với thiết bị của bạn</h2>
<p class="lead">Một nút nhấn đơn lẻ là chuyện của Chương 4. Buổi 28 và 50 thêm hai cách ra lệnh thật cho thiết bị: điều khiển hồng ngoại (không dây, người dùng không phải chạm dây nhợ) và bàn phím 4×4 (16 phím trên 8 chân).</p>

<h3>Điều khiển hồng ngoại — nhận một mã lệnh</h3>
<p>LED của remote chớp một mẫu hồng ngoại vô hình; một mắt thu 3 chân (vd VS1838B) giải điều chế nó và trao cho Arduino một chuỗi xung. Thư viện biến chuỗi đó thành một mã thập lục phân, riêng biệt cho từng nút.</p>
<pre><span class="tok-keyword">#include</span> <span class="tok-string">&lt;IRremote.h&gt;</span>
<span class="tok-keyword">const int</span> RECV = 11;

<span class="tok-keyword">void</span> <span class="tok-function">setup</span>() {
  Serial.<span class="tok-function">begin</span>(9600);
  <span class="tok-function">IrReceiver</span>.<span class="tok-function">begin</span>(RECV);
}

<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-keyword">if</span> (<span class="tok-function">IrReceiver</span>.<span class="tok-function">decode</span>()) {
    <span class="tok-type">unsigned long</span> code = <span class="tok-function">IrReceiver</span>.decodedIRData.decodedRawData;
    Serial.<span class="tok-function">println</span>(code, HEX);        <span class="tok-comment">// bước 1: HỌC các mã</span>

    <span class="tok-keyword">if</span> (code == 0xFF30CF) <span class="tok-function">digitalWrite</span>(13, HIGH);   <span class="tok-comment">// nút "1"</span>
    <span class="tok-keyword">if</span> (code == 0xFF18E7) <span class="tok-function">digitalWrite</span>(13, LOW);    <span class="tok-comment">// nút "2"</span>

    <span class="tok-function">IrReceiver</span>.<span class="tok-function">resume</span>();              <span class="tok-comment">// sẵn sàng cho mã kế tiếp</span>
  }
}</pre>
<div class="out"><b>Quy trình luôn đúng:</b> đầu tiên nạp một sketch chỉ in mã ra, bấm mọi nút bạn quan tâm, ghi lại các mã — <em>rồi</em> mới viết các câu <span class="badge">if</span>. Đừng bao giờ chép mã từ tutorial: chúng khác nhau giữa các remote.</div>

<h3>Bàn phím 4×4 — 16 nút trên 8 chân</h3>
<p>Đấu 16 nút riêng lẻ sẽ cần 16 chân. Thay vào đó các phím nằm tại giao điểm của 4 hàng và 4 cột. Thư viện kéo từng hàng xuống LOW một lúc rồi đọc xem cột nào xuống LOW — 8 chân, 16 phím. Đó là <b>quét ma trận</b>, cùng ý tưởng với ma trận LED ở bài kế tiếp.</p>
<pre><span class="tok-keyword">#include</span> <span class="tok-string">&lt;Keypad.h&gt;</span>
<span class="tok-keyword">const byte</span> ROWS = 4, COLS = 4;
<span class="tok-type">char</span> keys[ROWS][COLS] = {
  {<span class="tok-string">'1'</span>,<span class="tok-string">'2'</span>,<span class="tok-string">'3'</span>,<span class="tok-string">'A'</span>},
  {<span class="tok-string">'4'</span>,<span class="tok-string">'5'</span>,<span class="tok-string">'6'</span>,<span class="tok-string">'B'</span>},
  {<span class="tok-string">'7'</span>,<span class="tok-string">'8'</span>,<span class="tok-string">'9'</span>,<span class="tok-string">'C'</span>},
  {<span class="tok-string">'*'</span>,<span class="tok-string">'0'</span>,<span class="tok-string">'#'</span>,<span class="tok-string">'D'</span>}
};
<span class="tok-keyword">byte</span> rowPins[ROWS] = {9, 8, 7, 6};
<span class="tok-keyword">byte</span> colPins[COLS] = {5, 4, 3, 2};
<span class="tok-type">Keypad</span> pad = <span class="tok-function">Keypad</span>(<span class="tok-function">makeKeymap</span>(keys), rowPins, colPins, ROWS, COLS);

<span class="tok-type">String</span> entered = <span class="tok-string">""</span>;
<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-type">char</span> k = pad.<span class="tok-function">getKey</span>();
  <span class="tok-keyword">if</span> (k) {
    <span class="tok-keyword">if</span> (k == <span class="tok-string">'#'</span>) {                      <span class="tok-comment">// # = xác nhận</span>
      <span class="tok-keyword">if</span> (entered == <span class="tok-string">"1234"</span>) <span class="tok-function">unlock</span>();
      entered = <span class="tok-string">""</span>;
    } <span class="tok-keyword">else if</span> (k == <span class="tok-string">'*'</span>) entered = <span class="tok-string">""</span>;   <span class="tok-comment">// * = xoá</span>
    <span class="tok-keyword">else</span> entered += k;
  }
}</pre>
<div class="out">Một ổ khoá cửa nhập mã PIN gói trong hai mươi dòng — ghép nó với servo ở Bài 6.3 là bạn có một đồ án hoàn chỉnh và bảo vệ được.</div>

<div class="pitfall"><b>Bẫy:</b> thư viện keypad đã chống dội sẵn, nhưng mắt thu IR thì không khử trùng lặp. Giữ một nút trên remote sẽ gửi mã "lặp lại" (thường là <span class="badge">0xFFFFFFFF</span>) nhiều lần mỗi giây, nên một hành động bật/tắt sẽ nổ liên tục. Hoặc bỏ qua mã lặp một cách tường minh, hoặc áp dụng mẫu phát hiện đổi trạng thái ở Bài 4.3.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đừng bao giờ lưu mã PIN dạng văn bản thô — và vì sao điều đó vẫn quan trọng ngay cả ở đây.</b> Phép so sánh <span class="badge">entered == "1234"</span> giữ bí mật nằm trong Flash, ai đổ được nội dung chip bằng mạch nạp ISP là đọc ra (mất vài giây, không cần hàn xì). Thiết bị thật lưu một <em>hàm băm</em> của mã PIN và so sánh các hàm băm. Đồ án môn học của bạn sẽ không bị ai tấn công, nhưng nói điều này khi bảo vệ cho thấy tư duy bảo mật ở Chương 10 được áp dụng vào chính thiết kế của bạn — đúng thứ mà CLO4 đang yêu cầu.</div>
</div>
`,
        },
        {
          title: '6.6 — Displays: 7-segment, LCD 1602 & 8x8 matrix|||6.6 — Hiển thị: LED 7 đoạn, LCD 1602 & ma trận 8x8',
          slug: 'iot102-hien-thi',
          type: 'VIDEO',
          description: 'Lab buổi 32, 38, 55: ba cách cho thiết bị tự nói ra kết quả, và cách chọn đúng loại cho đồ án.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.6</span>
<h2>Letting the device speak for itself</h2>
<p class="lead">Until now your output has been an LED and the Serial Monitor — and the Serial Monitor disappears the moment you unplug the USB cable. A project that must stand on a table and be understood by a visitor needs a display. The syllabus gives you three, in rising order of capability.</p>

<h3>1 · The 7-segment display (session 32)</h3>
<p>Seven LEDs arranged in a figure-8 plus a dot. Light the right combination and you get a digit: for "7" you light segments a, b, c. Each segment needs a resistor; a single digit uses 7 pins, which is why multi-digit modules use a driver chip or multiplexing.</p>
<div class="out"><b>Best for:</b> one number that must be readable across a room — a counter, a temperature, a countdown. <b>Cannot show:</b> letters (beyond a crude A-F), or anything longer than its digits.</div>

<h3>2 · The LCD 1602 (session 38) — the practical choice</h3>
<p>Two rows of 16 characters. Wired directly it eats 6 pins; with the <b>I2C backpack</b> module it needs just two (SDA = A4, SCL = A5) and is by far the most common choice in student projects.</p>
<pre><span class="tok-keyword">#include</span> <span class="tok-string">&lt;LiquidCrystal_I2C.h&gt;</span>
<span class="tok-type">LiquidCrystal_I2C</span> lcd(0x27, 16, 2);   <span class="tok-comment">// address, cols, rows</span>

<span class="tok-keyword">void</span> <span class="tok-function">setup</span>() {
  lcd.<span class="tok-function">init</span>();
  lcd.<span class="tok-function">backlight</span>();
  lcd.<span class="tok-function">setCursor</span>(0, 0);
  lcd.<span class="tok-function">print</span>(<span class="tok-string">"Nhiet do:"</span>);
}

<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  lcd.<span class="tok-function">setCursor</span>(0, 1);           <span class="tok-comment">// column 0, row 1 (second line)</span>
  lcd.<span class="tok-function">print</span>(<span class="tok-function">readTemperature</span>(), 1);
  lcd.<span class="tok-function">print</span>(<span class="tok-string">" C   "</span>);            <span class="tok-comment">// trailing spaces erase leftovers</span>
  <span class="tok-function">delay</span>(500);
}</pre>
<div class="out"><b>Best for:</b> almost every project — labels plus values, a menu, a status message. Two lines of 16 characters is enough for "Distance: 24cm" and "Gate: OPEN".</div>

<h3>3 · The 8×8 LED matrix (session 55)</h3>
<p>64 LEDs on 8 rows × 8 columns, driven by a MAX7219 chip over 3 pins. Only one row is actually lit at any instant; the chip scans all eight hundreds of times per second and your eye merges them — the same persistence-of-vision trick as Charlieplexing in Lesson 4.2.</p>
<div class="out"><b>Best for:</b> icons, arrows, scrolling text, simple animations. <b>Worst for:</b> precise numbers — a 4-digit value simply will not fit.</div>

<h3>Choosing, in one table</h3>
<table>
  <thead><tr><th>Need</th><th>Use</th><th>Pins</th></tr></thead>
  <tbody>
    <tr><td>One big number</td><td>7-segment</td><td>7 (or 3 with a driver)</td></tr>
    <tr><td>Text, labels, a menu</td><td><b>LCD 1602 I2C</b></td><td>2</td></tr>
    <tr><td>Icons / animation</td><td>8×8 matrix</td><td>3</td></tr>
  </tbody>
</table>

<div class="pitfall"><b>The I2C address trap.</b> LCD backpacks ship with address <span class="badge">0x27</span> <em>or</em> <span class="badge">0x3F</span>, and the wrong one produces a blank screen with the backlight on — which looks exactly like a broken display. Run an "I2C scanner" sketch to print the real address before you debug anything else. Second trap: overwriting a longer previous value leaves stray characters ("25.5" over "100.0" shows "25.50"), so pad with trailing spaces or call <span class="badge">lcd.clear()</span>.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Never call lcd.clear() every loop.</b> A full clear takes about 2 ms and makes the whole screen blink visibly when it runs hundreds of times a second. Professional firmware redraws <em>only what changed</em>: keep the label static, rewrite just the value field with <span class="badge">setCursor</span>. The same principle — update the smallest region that changed — is exactly what React's virtual DOM does on the web. Different scale, identical idea, and it is why a well-written device display looks calm while a beginner's flickers.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.6</span>
<h2>Để thiết bị tự nói ra kết quả</h2>
<p class="lead">Tới giờ ngõ ra của bạn mới là một LED và Serial Monitor — mà Serial Monitor biến mất ngay khoảnh khắc bạn rút cáp USB. Một đồ án phải đứng trên bàn và người xem hiểu được thì cần màn hình. Syllabus cho bạn ba loại, theo thứ tự khả năng tăng dần.</p>

<h3>1 · LED 7 đoạn (buổi 32)</h3>
<p>Bảy LED xếp thành hình số 8 cộng một dấu chấm. Thắp đúng tổ hợp là ra một chữ số: để hiện "7" bạn thắp các đoạn a, b, c. Mỗi đoạn cần một điện trở; một chữ số dùng hết 7 chân, đó là lý do các module nhiều chữ số phải dùng chip lái hoặc quét đa hợp.</p>
<div class="out"><b>Hợp nhất với:</b> một con số phải đọc được từ xa trong phòng — bộ đếm, nhiệt độ, đồng hồ đếm ngược. <b>Không hiện được:</b> chữ cái (ngoài vài ký tự A-F thô), hay bất cứ gì dài hơn số chữ số của nó.</div>

<h3>2 · LCD 1602 (buổi 38) — lựa chọn thực dụng</h3>
<p>Hai hàng, mỗi hàng 16 ký tự. Đấu trực tiếp thì ngốn 6 chân; với module <b>I2C backpack</b> nó chỉ cần hai (SDA = A4, SCL = A5) và là lựa chọn phổ biến nhất trong đồ án sinh viên, cách biệt rất xa.</p>
<pre><span class="tok-keyword">#include</span> <span class="tok-string">&lt;LiquidCrystal_I2C.h&gt;</span>
<span class="tok-type">LiquidCrystal_I2C</span> lcd(0x27, 16, 2);   <span class="tok-comment">// địa chỉ, số cột, số hàng</span>

<span class="tok-keyword">void</span> <span class="tok-function">setup</span>() {
  lcd.<span class="tok-function">init</span>();
  lcd.<span class="tok-function">backlight</span>();
  lcd.<span class="tok-function">setCursor</span>(0, 0);
  lcd.<span class="tok-function">print</span>(<span class="tok-string">"Nhiet do:"</span>);
}

<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  lcd.<span class="tok-function">setCursor</span>(0, 1);           <span class="tok-comment">// cột 0, hàng 1 (dòng thứ hai)</span>
  lcd.<span class="tok-function">print</span>(<span class="tok-function">readTemperature</span>(), 1);
  lcd.<span class="tok-function">print</span>(<span class="tok-string">" C   "</span>);            <span class="tok-comment">// khoảng trắng cuối để xoá ký tự thừa</span>
  <span class="tok-function">delay</span>(500);
}</pre>
<div class="out"><b>Hợp nhất với:</b> gần như mọi đồ án — nhãn kèm giá trị, một menu, một dòng trạng thái. Hai dòng 16 ký tự là đủ cho "Distance: 24cm" và "Gate: OPEN".</div>

<h3>3 · Ma trận LED 8×8 (buổi 55)</h3>
<p>64 LED trên 8 hàng × 8 cột, lái bằng chip MAX7219 qua 3 chân. Tại mỗi khoảnh khắc thực ra chỉ một hàng sáng; con chip quét cả tám hàng hàng trăm lần mỗi giây và mắt bạn ghép chúng lại — đúng mẹo lưu ảnh như Charlieplexing ở Bài 4.2.</p>
<div class="out"><b>Hợp nhất với:</b> biểu tượng, mũi tên, chữ chạy, hoạt hình đơn giản. <b>Tệ nhất với:</b> số liệu chính xác — một giá trị 4 chữ số đơn giản là không nhét vừa.</div>

<h3>Chọn loại nào, gói trong một bảng</h3>
<table>
  <thead><tr><th>Nhu cầu</th><th>Dùng</th><th>Số chân</th></tr></thead>
  <tbody>
    <tr><td>Một con số lớn</td><td>LED 7 đoạn</td><td>7 (hoặc 3 nếu có chip lái)</td></tr>
    <tr><td>Chữ, nhãn, menu</td><td><b>LCD 1602 I2C</b></td><td>2</td></tr>
    <tr><td>Biểu tượng / hoạt hình</td><td>Ma trận 8×8</td><td>3</td></tr>
  </tbody>
</table>

<div class="pitfall"><b>Bẫy địa chỉ I2C.</b> Backpack của LCD xuất xưởng với địa chỉ <span class="badge">0x27</span> <em>hoặc</em> <span class="badge">0x3F</span>, và chọn nhầm cho ra một màn hình trắng trơn còn đèn nền vẫn sáng — trông y hệt một màn hình hỏng. Hãy chạy một sketch "I2C scanner" để in ra địa chỉ thật trước khi gỡ lỗi bất cứ thứ gì khác. Bẫy thứ hai: ghi đè lên một giá trị dài hơn để lại ký tự thừa ("25.5" đè lên "100.0" hiện ra "25.50"), nên hãy đệm khoảng trắng ở cuối hoặc gọi <span class="badge">lcd.clear()</span>.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đừng bao giờ gọi lcd.clear() mỗi vòng lặp.</b> Một lần xoá toàn màn hình mất khoảng 2 ms và làm cả màn hình chớp thấy rõ khi nó chạy hàng trăm lần mỗi giây. Firmware chuyên nghiệp vẽ lại <em>chỉ phần đã thay đổi</em>: giữ nguyên nhãn tĩnh, chỉ ghi lại ô giá trị bằng <span class="badge">setCursor</span>. Cũng nguyên tắc đó — cập nhật vùng nhỏ nhất đã đổi — chính là điều virtual DOM của React làm trên web. Khác quy mô, y hệt ý tưởng, và đó là lý do màn hình của một thiết bị viết tốt trông êm đềm còn của người mới thì giật liên hồi.</div>
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
        {
          title: '7.2 — Networking in IoT: how data reaches the cloud|||7.2 — Mạng trong IoT: dữ liệu lên cloud bằng cách nào',
          slug: 'iot102-mang-iot',
          type: 'VIDEO',
          description: 'Hai buổi online 5–6: mô hình tầng, các công nghệ mạng IoT (WiFi/BLE/LoRa/NB-IoT), địa chỉ IP, và chọn công nghệ (CLO3).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Choosing how a thing connects</h2>
<p class="lead">CLO3 — "understand the networking in IoT" — gets two full online sessions (5 and 6), because connecting a device is a design decision with real consequences: range, battery life, cost and data volume all pull in different directions.</p>

<h3>The layers, in the terms you already know</h3>
<table>
  <thead><tr><th>Layer</th><th>Question it answers</th><th>Examples in IoT</th></tr></thead>
  <tbody>
    <tr><td>Physical / link</td><td>How do bits travel through the air?</td><td>WiFi, BLE, LoRa, Zigbee, Ethernet, 4G</td></tr>
    <tr><td>Network</td><td>How is a device addressed and routed to?</td><td>IPv4 / IPv6, 6LoWPAN</td></tr>
    <tr><td>Transport</td><td>Reliable or fast?</td><td>TCP (reliable, heavier) · UDP (light, no guarantee)</td></tr>
    <tr><td>Application</td><td>What does the message look like?</td><td>HTTP, <b>MQTT</b>, CoAP, WebSocket</td></tr>
  </tbody>
</table>

<h3>The four radio technologies you must be able to compare</h3>
<table>
  <thead><tr><th>Technology</th><th>Range</th><th>Power</th><th>Data rate</th><th>Typical use</th></tr></thead>
  <tbody>
    <tr><td><b>WiFi</b> (ESP8266/ESP32)</td><td>~50 m indoors</td><td>high — mains or big battery</td><td>Mbps</td><td>home devices, cameras</td></tr>
    <tr><td><b>Bluetooth LE</b></td><td>~10 m</td><td>very low</td><td>kbps</td><td>wearables, phone-to-device</td></tr>
    <tr><td><b>LoRa</b></td><td><b>2–15 km</b></td><td>extremely low</td><td>~0.3–50 kbps</td><td>farm/city sensors, years on a battery</td></tr>
    <tr><td><b>NB-IoT / 4G</b></td><td>national (carrier)</td><td>medium</td><td>kbps–Mbps</td><td>trackers, meters with no local WiFi</td></tr>
  </tbody>
</table>
<div class="out"><b>Worked decision — a soil sensor 3 km from the farmhouse, one battery per year:</b> WiFi cannot reach and would drain the battery in days; BLE is far too short; NB-IoT costs a SIM subscription. <b>LoRa</b> is the answer. Notice that the requirement (distance + battery) chose the radio, not the other way round.</div>

<h3>Topology — who talks to whom</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Star</b> — every device talks straight to a router/gateway. Simple, and what your WiFi project will use.</div>
  <div class="lz-layer"><b>Mesh</b> — devices relay for each other, extending coverage without more infrastructure (Zigbee, Thread).</div>
  <div class="lz-layer"><b>Gateway pattern</b> — many constrained devices speak a local radio to one gateway, which alone holds the internet connection. This is how most real deployments are built.</div>
</div>

<div class="pitfall"><b>Trap:</b> assuming an Arduino UNO can "just connect to WiFi". The UNO has <em>no</em> radio — you add an ESP8266 module (and deal with its 3.3V logic), or you switch to an ESP32 board that has WiFi and Bluetooth built in. Plan this at the design stage, not the night before the demo.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>IPv6 and why IoT forced it.</b> IPv4 has about 4.3 billion addresses — fewer than the number of connected devices already deployed. IPv6 has 3.4×10³⁸, enough to give every grain of sand on Earth several. Constrained devices use a compressed form called <b>6LoWPAN</b> so that IPv6 packets fit in radio frames of a few dozen bytes. The lesson underneath: IoT does not just <em>use</em> the internet, its scale has repeatedly forced the internet to change — new addressing (IPv6), new protocols (MQTT, CoAP), new architectures (edge computing).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Chọn cách một "thing" kết nối</h2>
<p class="lead">CLO3 — "hiểu về mạng trong IoT" — được dành trọn hai buổi online (5 và 6), vì kết nối một thiết bị là một quyết định thiết kế có hệ quả thật: tầm xa, tuổi thọ pin, chi phí và lượng dữ liệu kéo về bốn hướng khác nhau.</p>

<h3>Các tầng, diễn đạt bằng thứ bạn đã biết</h3>
<table>
  <thead><tr><th>Tầng</th><th>Trả lời câu hỏi</th><th>Ví dụ trong IoT</th></tr></thead>
  <tbody>
    <tr><td>Vật lý / liên kết</td><td>Bit đi qua không khí bằng cách nào?</td><td>WiFi, BLE, LoRa, Zigbee, Ethernet, 4G</td></tr>
    <tr><td>Mạng</td><td>Thiết bị được đánh địa chỉ và định tuyến ra sao?</td><td>IPv4 / IPv6, 6LoWPAN</td></tr>
    <tr><td>Vận chuyển</td><td>Tin cậy hay nhanh?</td><td>TCP (tin cậy, nặng) · UDP (nhẹ, không đảm bảo)</td></tr>
    <tr><td>Ứng dụng</td><td>Thông điệp trông như thế nào?</td><td>HTTP, <b>MQTT</b>, CoAP, WebSocket</td></tr>
  </tbody>
</table>

<h3>Bốn công nghệ sóng bạn phải so sánh được</h3>
<table>
  <thead><tr><th>Công nghệ</th><th>Tầm xa</th><th>Tiêu thụ</th><th>Tốc độ</th><th>Dùng điển hình</th></tr></thead>
  <tbody>
    <tr><td><b>WiFi</b> (ESP8266/ESP32)</td><td>~50 m trong nhà</td><td>cao — cần điện lưới hoặc pin lớn</td><td>Mbps</td><td>thiết bị gia đình, camera</td></tr>
    <tr><td><b>Bluetooth LE</b></td><td>~10 m</td><td>rất thấp</td><td>kbps</td><td>thiết bị đeo, điện thoại nối thiết bị</td></tr>
    <tr><td><b>LoRa</b></td><td><b>2–15 km</b></td><td>cực thấp</td><td>~0,3–50 kbps</td><td>cảm biến nông trại/đô thị, chạy pin nhiều năm</td></tr>
    <tr><td><b>NB-IoT / 4G</b></td><td>toàn quốc (nhà mạng)</td><td>trung bình</td><td>kbps–Mbps</td><td>thiết bị định vị, đồng hồ đo nơi không có WiFi</td></tr>
  </tbody>
</table>
<div class="out"><b>Quyết định có lời giải — một cảm biến đất cách nhà 3 km, mỗi năm thay pin một lần:</b> WiFi không với tới và sẽ ngốn cạn pin trong vài ngày; BLE quá ngắn; NB-IoT tốn phí thuê bao SIM. <b>LoRa</b> là đáp án. Để ý: chính yêu cầu (khoảng cách + pin) chọn ra loại sóng, chứ không phải ngược lại.</div>

<h3>Tô-pô — ai nói với ai</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Hình sao</b> — mỗi thiết bị nói thẳng với router/gateway. Đơn giản, và là thứ đồ án WiFi của bạn sẽ dùng.</div>
  <div class="lz-layer"><b>Lưới (mesh)</b> — các thiết bị chuyển tiếp giúp nhau, mở rộng vùng phủ mà không cần thêm hạ tầng (Zigbee, Thread).</div>
  <div class="lz-layer"><b>Mẫu gateway</b> — nhiều thiết bị hạn chế nói sóng cục bộ với một gateway, và chỉ mình gateway giữ kết nối internet. Đây là cách phần lớn hệ thống thật được xây.</div>
</div>

<div class="pitfall"><b>Bẫy:</b> tưởng Arduino UNO "cứ thế mà nối WiFi". UNO <em>không hề có</em> sóng — bạn phải gắn thêm module ESP8266 (và xử lý mức logic 3,3V của nó), hoặc chuyển sang board ESP32 vốn tích hợp sẵn WiFi và Bluetooth. Hãy tính chuyện này ở khâu thiết kế, không phải đêm trước buổi demo.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>IPv6 và chuyện IoT ép nó ra đời.</b> IPv4 có khoảng 4,3 tỷ địa chỉ — ít hơn số thiết bị nối mạng đã triển khai. IPv6 có 3,4×10³⁸, đủ để cấp cho mỗi hạt cát trên Trái Đất vài cái. Thiết bị hạn chế dùng một dạng nén gọi là <b>6LoWPAN</b> để gói IPv6 lọt vào khung sóng chỉ vài chục byte. Bài học nằm bên dưới: IoT không chỉ <em>dùng</em> internet, quy mô của nó đã nhiều lần ép internet phải đổi thay — cách đánh địa chỉ mới (IPv6), giao thức mới (MQTT, CoAP), kiến trúc mới (điện toán biên).</div>
</div>
`,
        },
        {
          title: '7.3 — Serial in depth: sending commands to the board|||7.3 — Serial chuyên sâu: gửi lệnh xuống board',
          slug: 'iot102-serial-sau',
          type: 'VIDEO',
          description: 'Lab buổi 35/39/42/48: đọc lệnh từ PC, serialEvent, bảng ASCII, và giao thức văn bản đơn giản.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>Serial is two-way</h2>
<p class="lead">So far Serial has been an output — <span class="badge">Serial.println</span> for debugging. Four labs (sessions 35, 39, 42, 48) turn it around: the PC sends text <em>to</em> the board. This is the foundation of every command interface, and of the AT commands you will send to a WiFi module.</p>

<h3>Reading one character at a time</h3>
<pre><span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-keyword">if</span> (Serial.<span class="tok-function">available</span>() &gt; 0) {      <span class="tok-comment">// is a byte waiting?</span>
    <span class="tok-type">char</span> c = Serial.<span class="tok-function">read</span>();           <span class="tok-comment">// take it out of the buffer</span>
    <span class="tok-keyword">if</span> (c == <span class="tok-string">'r'</span>) <span class="tok-function">setColor</span>(255, 0, 0);
    <span class="tok-keyword">if</span> (c == <span class="tok-string">'g'</span>) <span class="tok-function">setColor</span>(0, 255, 0);
    <span class="tok-keyword">if</span> (c == <span class="tok-string">'b'</span>) <span class="tok-function">setColor</span>(0, 0, 255);
  }
}</pre>
<div class="note-ct"><span class="badge">available()</span> returns how many bytes have arrived; <span class="badge">read()</span> removes and returns one. The incoming buffer is only <b>64 bytes</b> — read promptly or data is silently lost.</div>

<h3>Reading a whole line ("Read ASCII String")</h3>
<p>Session 35's lab sends "255,100,0" and expects three numbers. The clean way:</p>
<pre><span class="tok-keyword">if</span> (Serial.<span class="tok-function">available</span>() &gt; 0) {
  <span class="tok-type">int</span> r = Serial.<span class="tok-function">parseInt</span>();      <span class="tok-comment">// reads digits until a non-digit</span>
  <span class="tok-type">int</span> g = Serial.<span class="tok-function">parseInt</span>();
  <span class="tok-type">int</span> b = Serial.<span class="tok-function">parseInt</span>();
  <span class="tok-keyword">if</span> (Serial.<span class="tok-function">read</span>() == <span class="tok-string">'\\n'</span>) {     <span class="tok-comment">// the line is complete</span>
    <span class="tok-function">setColor</span>(<span class="tok-function">constrain</span>(r,0,255), <span class="tok-function">constrain</span>(g,0,255), <span class="tok-function">constrain</span>(b,0,255));
  }
}</pre>
<div class="out">Set the Serial Monitor's line ending to <b>Newline</b> or this never triggers — a five-minute bug that has cost many students an evening.</div>

<h3>serialEvent() — the "arrives on its own" version</h3>
<p>Session 39's lab uses a function Arduino calls automatically after each <span class="badge">loop()</span> if new serial data is waiting:</p>
<pre><span class="tok-type">String</span> input = <span class="tok-string">""</span>;
<span class="tok-type">bool</span> ready = <span class="tok-keyword">false</span>;

<span class="tok-keyword">void</span> <span class="tok-function">serialEvent</span>() {
  <span class="tok-keyword">while</span> (Serial.<span class="tok-function">available</span>()) {
    <span class="tok-type">char</span> c = (<span class="tok-type">char</span>) Serial.<span class="tok-function">read</span>();
    <span class="tok-keyword">if</span> (c == <span class="tok-string">'\\n'</span>) ready = <span class="tok-keyword">true</span>;
    <span class="tok-keyword">else</span> input += c;
  }
}

<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-keyword">if</span> (ready) { <span class="tok-function">handleCommand</span>(input); input = <span class="tok-string">""</span>; ready = <span class="tok-keyword">false</span>; }
}</pre>
<div class="note-ct">Despite the name, this is <b>not</b> an interrupt — it runs between loops. It is a tidy way to separate "collect the line" from "act on the line", exactly the structure a real command parser uses.</div>

<h3>Why the ASCII table lab matters</h3>
<p>Session 42 prints the ASCII table because of one recurring confusion: the <em>character</em> <span class="badge">'5'</span> is the byte 53, not the number 5. Sending "5" over Serial delivers 53. That is why you need <span class="badge">parseInt()</span> or <span class="badge">c - '0'</span> to convert. The same trap appears in every protocol you will ever parse.</p>

<div class="pitfall"><b>Trap:</b> <span class="badge">Serial.parseInt()</span> blocks for one second (its default timeout) if no digits arrive — freezing your device. For anything time-critical, collect characters yourself as in the serialEvent example and parse only when you have a full line.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>You just invented a protocol — now design it deliberately.</b> "r", "255,100,0", "LED ON" are all ad-hoc protocols. Real devices agree on a frame: a start marker, a command, a length, a payload and a <b>checksum</b> so a corrupted message is detected instead of obeyed. Adding even a simple XOR checksum to your project's serial link is a small change that demonstrates you understand why data over a wire cannot be trusted blindly — the same lesson that reappears as TLS in Chapter 10.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Serial là con đường hai chiều</h2>
<p class="lead">Tới giờ Serial mới đóng vai ngõ ra — <span class="badge">Serial.println</span> để gỡ lỗi. Bốn lab (buổi 35, 39, 42, 48) lật ngược lại: PC gửi văn bản <em>xuống</em> board. Đây là nền của mọi giao diện lệnh, và của các lệnh AT bạn sẽ gửi cho module WiFi.</p>

<h3>Đọc từng ký tự một</h3>
<pre><span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-keyword">if</span> (Serial.<span class="tok-function">available</span>() &gt; 0) {      <span class="tok-comment">// có byte nào đang chờ không?</span>
    <span class="tok-type">char</span> c = Serial.<span class="tok-function">read</span>();           <span class="tok-comment">// lấy nó ra khỏi bộ đệm</span>
    <span class="tok-keyword">if</span> (c == <span class="tok-string">'r'</span>) <span class="tok-function">setColor</span>(255, 0, 0);
    <span class="tok-keyword">if</span> (c == <span class="tok-string">'g'</span>) <span class="tok-function">setColor</span>(0, 255, 0);
    <span class="tok-keyword">if</span> (c == <span class="tok-string">'b'</span>) <span class="tok-function">setColor</span>(0, 0, 255);
  }
}</pre>
<div class="note-ct"><span class="badge">available()</span> trả về số byte đã tới; <span class="badge">read()</span> lấy ra và trả về một byte. Bộ đệm nhận chỉ <b>64 byte</b> — đọc kịp thời, không thì dữ liệu mất âm thầm.</div>

<h3>Đọc trọn một dòng ("Read ASCII String")</h3>
<p>Lab buổi 35 gửi xuống "255,100,0" và mong nhận ba con số. Cách sạch sẽ:</p>
<pre><span class="tok-keyword">if</span> (Serial.<span class="tok-function">available</span>() &gt; 0) {
  <span class="tok-type">int</span> r = Serial.<span class="tok-function">parseInt</span>();      <span class="tok-comment">// đọc chữ số tới khi gặp ký tự không phải số</span>
  <span class="tok-type">int</span> g = Serial.<span class="tok-function">parseInt</span>();
  <span class="tok-type">int</span> b = Serial.<span class="tok-function">parseInt</span>();
  <span class="tok-keyword">if</span> (Serial.<span class="tok-function">read</span>() == <span class="tok-string">'\\n'</span>) {     <span class="tok-comment">// dòng đã trọn vẹn</span>
    <span class="tok-function">setColor</span>(<span class="tok-function">constrain</span>(r,0,255), <span class="tok-function">constrain</span>(g,0,255), <span class="tok-function">constrain</span>(b,0,255));
  }
}</pre>
<div class="out">Nhớ đặt kiểu kết thúc dòng của Serial Monitor thành <b>Newline</b>, không thì đoạn này chẳng bao giờ chạy — một lỗi năm phút đã ngốn của nhiều sinh viên cả buổi tối.</div>

<h3>serialEvent() — bản "tự nó tới"</h3>
<p>Lab buổi 39 dùng một hàm mà Arduino tự gọi sau mỗi <span class="badge">loop()</span> nếu có dữ liệu serial mới đang chờ:</p>
<pre><span class="tok-type">String</span> input = <span class="tok-string">""</span>;
<span class="tok-type">bool</span> ready = <span class="tok-keyword">false</span>;

<span class="tok-keyword">void</span> <span class="tok-function">serialEvent</span>() {
  <span class="tok-keyword">while</span> (Serial.<span class="tok-function">available</span>()) {
    <span class="tok-type">char</span> c = (<span class="tok-type">char</span>) Serial.<span class="tok-function">read</span>();
    <span class="tok-keyword">if</span> (c == <span class="tok-string">'\\n'</span>) ready = <span class="tok-keyword">true</span>;
    <span class="tok-keyword">else</span> input += c;
  }
}

<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-keyword">if</span> (ready) { <span class="tok-function">handleCommand</span>(input); input = <span class="tok-string">""</span>; ready = <span class="tok-keyword">false</span>; }
}</pre>
<div class="note-ct">Dù mang cái tên đó, đây <b>không phải</b> một ngắt — nó chạy giữa các vòng lặp. Đó là cách gọn gàng để tách "gom cho đủ dòng" khỏi "hành động theo dòng", đúng cấu trúc mà một bộ phân tích lệnh thật sử dụng.</div>

<h3>Vì sao lab bảng ASCII lại quan trọng</h3>
<p>Buổi 42 in bảng ASCII vì một nhầm lẫn lặp đi lặp lại: <em>ký tự</em> <span class="badge">'5'</span> là byte 53, không phải số 5. Gửi "5" qua Serial thì nhận được 53. Đó là lý do bạn cần <span class="badge">parseInt()</span> hoặc <span class="badge">c - '0'</span> để đổi. Cùng cái bẫy đó xuất hiện trong mọi giao thức bạn sẽ phân tích sau này.</p>

<div class="pitfall"><b>Bẫy:</b> <span class="badge">Serial.parseInt()</span> chặn một giây (hạn chờ mặc định của nó) nếu không có chữ số nào tới — đóng băng thiết bị của bạn. Với bất cứ thứ gì nhạy về thời gian, hãy tự gom ký tự như ví dụ serialEvent và chỉ phân tích khi đã đủ một dòng.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Bạn vừa phát minh ra một giao thức — giờ hãy thiết kế nó cho tử tế.</b> "r", "255,100,0", "LED ON" đều là những giao thức tự phát. Thiết bị thật thống nhất một khung tin: dấu bắt đầu, mã lệnh, độ dài, phần dữ liệu và một <b>checksum</b> để thông điệp bị hỏng bị phát hiện thay vì được thi hành. Thêm dù chỉ một checksum XOR đơn giản vào đường serial của đồ án là một thay đổi nhỏ nhưng chứng tỏ bạn hiểu vì sao dữ liệu đi trên dây không thể tin mù quáng — cũng chính bài học tái xuất dưới dạng TLS ở Chương 10.</div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 8 — NGẮT & ĐỊNH THỜI ══════════════════ */
    {
      title: 'Chapter 8 — Interrupts & timing|||Chương 8 — Ngắt & định thời',
      description: 'Làm nhiều việc "cùng lúc": millis() không chặn, ngắt ngoài (CLO13), và ngắt định thời.',
      lessons: [
        {
          title: '8.1 — Blink without delay: the millis() pattern|||8.1 — Nhấp nháy không delay: mẫu millis()',
          slug: 'iot102-millis',
          type: 'VIDEO',
          description: 'Lab buổi 41: vì sao delay() giết chết thiết bị thật, và cách viết nhiều nhiệm vụ chạy song song bằng millis.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>The most important sketch in the whole course</h2>
<p class="lead">"Blink Without Delay" (session 41) looks like a variation on the first lab. It is not — it is the moment your code stops being a toy. Everything after this lesson depends on it.</p>

<h3>The problem, stated precisely</h3>
<pre><span class="tok-function">digitalWrite</span>(13, HIGH);
<span class="tok-function">delay</span>(1000);            <span class="tok-comment">// ← the CPU does NOTHING for one second</span>
<span class="tok-function">digitalWrite</span>(13, LOW);
<span class="tok-function">delay</span>(1000);            <span class="tok-comment">// ← and again</span></pre>
<div class="out">During those two seconds the board cannot read a button, check a sensor, answer a serial command or feed a servo. A user pressing a button during the delay gets no response at all. Add a second LED that must blink at a different rate and the delay approach simply cannot express it.</div>

<h3>The pattern: ask "has enough time passed?"</h3>
<pre><span class="tok-type">unsigned long</span> prev = 0;
<span class="tok-keyword">const long</span> interval = 1000;
<span class="tok-type">int</span> ledState = LOW;

<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-type">unsigned long</span> now = <span class="tok-function">millis</span>();       <span class="tok-comment">// ms since power-on</span>

  <span class="tok-keyword">if</span> (now - prev &gt;= interval) {
    prev = now;                          <span class="tok-comment">// remember when we acted</span>
    ledState = (ledState == LOW) ? HIGH : LOW;
    <span class="tok-function">digitalWrite</span>(13, ledState);
  }

  <span class="tok-comment">// ← the loop keeps running: read buttons, sensors, serial here</span>
}</pre>
<div class="note-ct">Read it as: "every time round the loop, check the clock; if a second has gone by since the last blink, blink and note the time." The loop never stops, so everything else stays responsive.</div>

<h3>Two tasks at different rates — impossible with delay, trivial with millis</h3>
<pre><span class="tok-type">unsigned long</span> prevLed = 0, prevSensor = 0;

<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-type">unsigned long</span> now = <span class="tok-function">millis</span>();

  <span class="tok-keyword">if</span> (now - prevLed &gt;= 500)    { prevLed = now;    <span class="tok-function">toggleLed</span>(); }
  <span class="tok-keyword">if</span> (now - prevSensor &gt;= 2000) { prevSensor = now; <span class="tok-function">readAndReport</span>(); }
  <span class="tok-function">checkButton</span>();                 <span class="tok-comment">// runs thousands of times a second</span>
}</pre>
<div class="out">An LED blinking twice a second, a sensor read every two seconds, and a button that responds instantly — all in one <span class="badge">loop()</span> with no threads and no operating system. This is the standard structure of embedded firmware.</div>

<div class="pitfall"><b>The overflow trap, and why the subtraction order matters.</b> <span class="badge">millis()</span> wraps back to 0 after about 49.7 days. Writing <span class="badge">if (now &gt;= prev + interval)</span> breaks at the wrap; writing <span class="badge">if (now - prev &gt;= interval)</span> keeps working, because unsigned arithmetic wraps correctly too. Always subtract, never add — and always use <span class="badge">unsigned long</span> for both variables.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>This is cooperative multitasking — and the next step is an RTOS.</b> Your loop is a scheduler: each <span class="badge">if</span> block is a task that must finish quickly and hand control back. That is exactly the cooperative model, and its one rule is "no task may block". On bigger chips (ESP32) engineers move up to <b>FreeRTOS</b>, where the operating system can pause a task mid-execution and switch to another. Everything you learn about non-blocking design here transfers directly — and a project that stays responsive while doing four things at once is the clearest evidence to an examiner that you understand embedded programming.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Sketch quan trọng nhất của cả môn học</h2>
<p class="lead">"Blink Without Delay" (buổi 41) trông như một biến thể của lab đầu tiên. Không phải — đó là khoảnh khắc code của bạn thôi làm đồ chơi. Mọi thứ sau bài này đều dựa vào nó.</p>

<h3>Vấn đề, phát biểu cho chính xác</h3>
<pre><span class="tok-function">digitalWrite</span>(13, HIGH);
<span class="tok-function">delay</span>(1000);            <span class="tok-comment">// ← CPU KHÔNG LÀM GÌ suốt một giây</span>
<span class="tok-function">digitalWrite</span>(13, LOW);
<span class="tok-function">delay</span>(1000);            <span class="tok-comment">// ← rồi lại thế</span></pre>
<div class="out">Trong hai giây đó board không đọc được nút, không kiểm được cảm biến, không trả lời được lệnh serial và không nuôi được servo. Người dùng bấm nút giữa lúc delay thì chẳng nhận phản hồi nào. Thêm một LED thứ hai phải nháy ở nhịp khác thì cách dùng delay đơn giản là không diễn đạt nổi.</div>

<h3>Mẫu hình: hỏi "đã đủ thời gian chưa?"</h3>
<pre><span class="tok-type">unsigned long</span> prev = 0;
<span class="tok-keyword">const long</span> interval = 1000;
<span class="tok-type">int</span> ledState = LOW;

<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-type">unsigned long</span> now = <span class="tok-function">millis</span>();       <span class="tok-comment">// số ms kể từ lúc bật nguồn</span>

  <span class="tok-keyword">if</span> (now - prev &gt;= interval) {
    prev = now;                          <span class="tok-comment">// nhớ lại thời điểm vừa hành động</span>
    ledState = (ledState == LOW) ? HIGH : LOW;
    <span class="tok-function">digitalWrite</span>(13, ledState);
  }

  <span class="tok-comment">// ← vòng lặp vẫn chạy: đọc nút, cảm biến, serial ở đây</span>
}</pre>
<div class="note-ct">Đọc nó thành: "mỗi vòng lặp, liếc đồng hồ; nếu đã trôi qua một giây kể từ lần nháy trước thì nháy và ghi lại thời điểm." Vòng lặp không bao giờ dừng, nên mọi thứ khác vẫn nhạy.</div>

<h3>Hai nhiệm vụ ở hai nhịp khác nhau — bất khả với delay, dễ như bỡn với millis</h3>
<pre><span class="tok-type">unsigned long</span> prevLed = 0, prevSensor = 0;

<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-type">unsigned long</span> now = <span class="tok-function">millis</span>();

  <span class="tok-keyword">if</span> (now - prevLed &gt;= 500)    { prevLed = now;    <span class="tok-function">toggleLed</span>(); }
  <span class="tok-keyword">if</span> (now - prevSensor &gt;= 2000) { prevSensor = now; <span class="tok-function">readAndReport</span>(); }
  <span class="tok-function">checkButton</span>();                 <span class="tok-comment">// chạy hàng nghìn lần mỗi giây</span>
}</pre>
<div class="out">Một LED nháy hai lần mỗi giây, một cảm biến đọc mỗi hai giây, và một cái nút phản hồi tức thì — tất cả trong một <span class="badge">loop()</span> không luồng, không hệ điều hành. Đây là cấu trúc chuẩn của firmware nhúng.</div>

<div class="pitfall"><b>Bẫy tràn số, và vì sao thứ tự phép trừ lại quan trọng.</b> <span class="badge">millis()</span> quay về 0 sau khoảng 49,7 ngày. Viết <span class="badge">if (now &gt;= prev + interval)</span> sẽ hỏng đúng lúc quay vòng; viết <span class="badge">if (now - prev &gt;= interval)</span> vẫn chạy đúng, vì số học không dấu cũng quay vòng chuẩn theo. Luôn TRỪ, đừng bao giờ CỘNG — và luôn dùng <span class="badge">unsigned long</span> cho cả hai biến.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đây là đa nhiệm hợp tác — và bước tiếp theo là một RTOS.</b> Vòng lặp của bạn chính là một bộ lập lịch: mỗi khối <span class="badge">if</span> là một nhiệm vụ phải xong nhanh rồi trả quyền điều khiển lại. Đó đúng là mô hình hợp tác, và luật duy nhất của nó là "không nhiệm vụ nào được phép chặn". Trên chip lớn hơn (ESP32) kỹ sư tiến lên <b>FreeRTOS</b>, nơi hệ điều hành có thể tạm dừng một nhiệm vụ giữa chừng và chuyển sang cái khác. Mọi thứ bạn học về thiết kế không-chặn ở đây chuyển thẳng sang được — và một đồ án vẫn nhạy trong khi làm bốn việc cùng lúc là bằng chứng rõ nhất với giám khảo rằng bạn hiểu lập trình nhúng.</div>
</div>
`,
        },
        {
          title: '8.2 — External interrupts (CLO13)|||8.2 — Ngắt ngoài (CLO13)',
          slug: 'iot102-ngat-ngoai',
          type: 'VIDEO',
          description: 'Lab buổi 40: attachInterrupt, các chế độ RISING/FALLING/CHANGE, và luật vàng khi viết hàm ISR.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>When polling is not fast enough</h2>
<p class="lead">CLO13 asks specifically for interrupts on the Arduino UNO, and session 40 is the lab. Lesson 8.1 keeps the loop responsive, but a loop that takes 20 ms to run will still miss a 2 ms pulse. An <strong>interrupt</strong> removes the loop from the equation entirely.</p>

<h3>What actually happens</h3>
<div class="lz-flow">
  <div class="lz-step">Your program runs normally</div>
  <div class="lz-step">Pin 2 changes electrically</div>
  <div class="lz-step">Hardware stops the CPU mid-instruction-stream</div>
  <div class="lz-step">Your ISR runs to completion</div>
  <div class="lz-step">The CPU resumes exactly where it was</div>
</div>

<pre><span class="tok-keyword">volatile</span> <span class="tok-type">unsigned long</span> pulses = 0;   <span class="tok-comment">// shared with the ISR</span>

<span class="tok-keyword">void</span> <span class="tok-function">countPulse</span>() {      <span class="tok-comment">// the ISR — keep it tiny</span>
  pulses++;
}

<span class="tok-keyword">void</span> <span class="tok-function">setup</span>() {
  Serial.<span class="tok-function">begin</span>(9600);
  <span class="tok-function">pinMode</span>(2, INPUT_PULLUP);
  <span class="tok-function">attachInterrupt</span>(<span class="tok-function">digitalPinToInterrupt</span>(2), countPulse, FALLING);
}

<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-function">noInterrupts</span>();                  <span class="tok-comment">// read the shared value safely</span>
  <span class="tok-type">unsigned long</span> p = pulses;
  <span class="tok-function">interrupts</span>();
  Serial.<span class="tok-function">println</span>(p);
  <span class="tok-function">delay</span>(1000);
}</pre>

<h3>The two pins and the four modes</h3>
<p>On the UNO only <b>pin 2 (INT0)</b> and <b>pin 3 (INT1)</b> support <span class="badge">attachInterrupt</span>.</p>
<table>
  <thead><tr><th>Mode</th><th>Fires when the pin goes</th><th>Typical use</th></tr></thead>
  <tbody>
    <tr><td><span class="badge">RISING</span></td><td>LOW → HIGH</td><td>a sensor pulse starting</td></tr>
    <tr><td><span class="badge">FALLING</span></td><td>HIGH → LOW</td><td>a button press with INPUT_PULLUP</td></tr>
    <tr><td><span class="badge">CHANGE</span></td><td>either direction</td><td>rotary encoders</td></tr>
    <tr><td><span class="badge">LOW</span></td><td>continuously while LOW</td><td>waking from sleep</td></tr>
  </tbody>
</table>

<h3>The rules for an ISR — break them and you get bugs that look like magic</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Keep it very short.</b> While the ISR runs, nothing else does — including the timer that drives millis().</div>
  <div class="lz-layer"><b>No <span class="badge">delay()</span>, no <span class="badge">Serial.print</span>.</b> They depend on interrupts, which are disabled inside an ISR: delay() hangs forever, Serial output corrupts.</div>
  <div class="lz-layer"><b>Shared variables must be <span class="badge">volatile</span>.</b> Otherwise the compiler may cache the value in a register and your loop reads a stale copy — the classic "my counter never changes" bug.</div>
  <div class="lz-layer"><b>Read multi-byte shared variables with interrupts off.</b> An <span class="badge">unsigned long</span> takes 4 separate byte reads; an interrupt landing in the middle gives you a half-updated number.</div>
</div>

<div class="pitfall"><b>Trap:</b> attaching an interrupt to a mechanical button and counting bounces at full speed — one press can register a dozen times. Interrupts do not debounce. Either add the hardware capacitor from Lesson 4.4, or ignore events that arrive within 50 ms of the previous one by comparing <span class="badge">millis()</span> inside the ISR (reading millis() is allowed; it just will not advance <em>during</em> the ISR).</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Interrupts + sleep = years on a battery.</b> The real reason professionals love interrupts is not speed, it is power. A device can enter <span class="badge">SLEEP_MODE_PWR_DOWN</span>, dropping from ~20 mA to well under 1 mA, and an external interrupt is one of the very few things that can wake it. Poll a button in a loop and the CPU burns power a million times a second to learn nothing; sleep and let the button wake you, and the same battery lasts hundreds of times longer. That is how a door sensor runs three years on a coin cell.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Khi thăm dò vòng lặp không còn đủ nhanh</h2>
<p class="lead">CLO13 yêu cầu đích danh ngắt trên Arduino UNO, và buổi 40 là lab của nó. Bài 8.1 giữ cho vòng lặp nhạy, nhưng một vòng lặp mất 20 ms để chạy hết vẫn sẽ bỏ lỡ một xung dài 2 ms. Một <strong>ngắt</strong> loại vòng lặp ra khỏi bài toán hoàn toàn.</p>

<h3>Chuyện gì thực sự xảy ra</h3>
<div class="lz-flow">
  <div class="lz-step">Chương trình của bạn đang chạy bình thường</div>
  <div class="lz-step">Chân 2 thay đổi về mặt điện</div>
  <div class="lz-step">Phần cứng chặn CPU ngay giữa dòng lệnh</div>
  <div class="lz-step">Hàm ISR của bạn chạy tới hết</div>
  <div class="lz-step">CPU quay lại đúng chỗ đang dang dở</div>
</div>

<pre><span class="tok-keyword">volatile</span> <span class="tok-type">unsigned long</span> pulses = 0;   <span class="tok-comment">// chia sẻ với ISR</span>

<span class="tok-keyword">void</span> <span class="tok-function">countPulse</span>() {      <span class="tok-comment">// hàm ISR — giữ cho thật ngắn</span>
  pulses++;
}

<span class="tok-keyword">void</span> <span class="tok-function">setup</span>() {
  Serial.<span class="tok-function">begin</span>(9600);
  <span class="tok-function">pinMode</span>(2, INPUT_PULLUP);
  <span class="tok-function">attachInterrupt</span>(<span class="tok-function">digitalPinToInterrupt</span>(2), countPulse, FALLING);
}

<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-function">noInterrupts</span>();                  <span class="tok-comment">// đọc giá trị chia sẻ một cách an toàn</span>
  <span class="tok-type">unsigned long</span> p = pulses;
  <span class="tok-function">interrupts</span>();
  Serial.<span class="tok-function">println</span>(p);
  <span class="tok-function">delay</span>(1000);
}</pre>

<h3>Hai cái chân và bốn chế độ</h3>
<p>Trên UNO chỉ <b>chân 2 (INT0)</b> và <b>chân 3 (INT1)</b> hỗ trợ <span class="badge">attachInterrupt</span>.</p>
<table>
  <thead><tr><th>Chế độ</th><th>Kích hoạt khi chân</th><th>Dùng điển hình</th></tr></thead>
  <tbody>
    <tr><td><span class="badge">RISING</span></td><td>LOW → HIGH</td><td>một xung cảm biến bắt đầu</td></tr>
    <tr><td><span class="badge">FALLING</span></td><td>HIGH → LOW</td><td>một cú nhấn nút với INPUT_PULLUP</td></tr>
    <tr><td><span class="badge">CHANGE</span></td><td>đổi theo cả hai chiều</td><td>bộ mã hoá vòng quay (encoder)</td></tr>
    <tr><td><span class="badge">LOW</span></td><td>liên tục trong khi còn LOW</td><td>đánh thức khỏi chế độ ngủ</td></tr>
  </tbody>
</table>

<h3>Luật viết ISR — phá luật là gặp lỗi trông như ma thuật</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Giữ nó cực ngắn.</b> Trong lúc ISR chạy, không gì khác chạy — kể cả bộ định thời nuôi millis().</div>
  <div class="lz-layer"><b>Không <span class="badge">delay()</span>, không <span class="badge">Serial.print</span>.</b> Chúng phụ thuộc vào ngắt, mà ngắt bị tắt bên trong ISR: delay() treo vĩnh viễn, Serial in ra rác.</div>
  <div class="lz-layer"><b>Biến dùng chung phải khai báo <span class="badge">volatile</span>.</b> Nếu không, trình biên dịch có thể giữ giá trị trong thanh ghi và vòng lặp của bạn đọc một bản cũ — đúng lỗi kinh điển "bộ đếm của tôi chẳng bao giờ đổi".</div>
  <div class="lz-layer"><b>Đọc biến chung nhiều byte thì phải tắt ngắt.</b> Một <span class="badge">unsigned long</span> cần 4 lần đọc byte riêng; một ngắt rơi vào giữa cho bạn một con số cập nhật dở dang.</div>
</div>

<div class="pitfall"><b>Bẫy:</b> gắn ngắt vào một nút cơ và đếm các cú dội ở tốc độ tối đa — một lần nhấn có thể ghi nhận cả chục lần. Ngắt không tự chống dội. Hoặc thêm tụ phần cứng như ở Bài 4.4, hoặc bỏ qua các sự kiện đến trong vòng 50 ms sau sự kiện trước bằng cách so <span class="badge">millis()</span> ngay trong ISR (đọc millis() thì được phép; chỉ là nó không nhích lên <em>trong lúc</em> ISR chạy).</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Ngắt + ngủ = pin dùng nhiều năm.</b> Lý do thật khiến dân chuyên yêu ngắt không phải tốc độ, mà là điện năng. Một thiết bị có thể vào <span class="badge">SLEEP_MODE_PWR_DOWN</span>, tụt từ ~20 mA xuống dưới 1 mA rất xa, và ngắt ngoài là một trong rất ít thứ đánh thức được nó. Thăm dò một cái nút trong vòng lặp thì CPU đốt điện cả triệu lần mỗi giây để chẳng biết thêm gì; cho nó ngủ và để cái nút đánh thức, thì cùng viên pin đó dùng lâu gấp hàng trăm lần. Đó là cách một cảm biến cửa chạy ba năm bằng một viên pin cúc áo.</div>
</div>
`,
        },
        {
          title: '8.3 — Timer interrupts: doing something exactly on time|||8.3 — Ngắt định thời: làm đúng nhịp tuyệt đối',
          slug: 'iot102-timer-interrupt',
          type: 'VIDEO',
          description: 'Lab buổi 45: ba timer của ATmega328, dùng thư viện TimerOne, và khi nào cần timer thay vì millis.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>A heartbeat the loop cannot disturb</h2>
<p class="lead">Session 45's lab is "Timer Interrupts". An external interrupt reacts to the outside world; a <strong>timer interrupt</strong> reacts to the passage of time — the chip's own counter fires an ISR at a fixed rate, no matter what your loop is doing.</p>

<h3>millis() vs a timer interrupt</h3>
<table>
  <thead><tr><th></th><th>millis() polling (8.1)</th><th>Timer interrupt</th></tr></thead>
  <tbody>
    <tr><td>Accuracy</td><td>as good as your loop is fast — jitter if a task runs long</td><td>exact, hardware-driven</td></tr>
    <tr><td>Complexity</td><td>a few lines, easy to read</td><td>registers or a library, easy to get wrong</td></tr>
    <tr><td>Good for</td><td><b>almost everything</b></td><td>sampling at a fixed rate, generating waveforms, control loops</td></tr>
  </tbody>
</table>
<div class="note-ct">Reach for a timer only when jitter actually matters. Reading a temperature "about every 2 seconds" does not need one; sampling audio at exactly 8 kHz does.</div>

<h3>The three timers — and what they already do</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Timer0</b> — 8-bit. Already used by <span class="badge">millis()</span>, <span class="badge">micros()</span> and <span class="badge">delay()</span>. Touch it and time itself breaks.</div>
  <div class="lz-layer"><b>Timer1</b> — 16-bit, the roomiest. Used by the <span class="badge">Servo</span> library and PWM on pins 9/10. The usual choice for your own timing.</div>
  <div class="lz-layer"><b>Timer2</b> — 8-bit. Drives <span class="badge">tone()</span> and PWM on pins 3/11.</div>
</div>

<h3>The easy way — the TimerOne library</h3>
<pre><span class="tok-keyword">#include</span> <span class="tok-string">&lt;TimerOne.h&gt;</span>
<span class="tok-keyword">volatile</span> <span class="tok-type">bool</span> tick = <span class="tok-keyword">false</span>;

<span class="tok-keyword">void</span> <span class="tok-function">onTimer</span>() { tick = <span class="tok-keyword">true</span>; }      <span class="tok-comment">// keep the ISR trivial</span>

<span class="tok-keyword">void</span> <span class="tok-function">setup</span>() {
  Serial.<span class="tok-function">begin</span>(9600);
  <span class="tok-function">Timer1</span>.<span class="tok-function">initialize</span>(100000);       <span class="tok-comment">// 100,000 µs = every 0.1 s</span>
  <span class="tok-function">Timer1</span>.<span class="tok-function">attachInterrupt</span>(onTimer);
}

<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-keyword">if</span> (tick) {                     <span class="tok-comment">// the ISR only raised a flag…</span>
    tick = <span class="tok-keyword">false</span>;
    <span class="tok-function">sampleSensor</span>();               <span class="tok-comment">// …the real work happens here</span>
  }
}</pre>
<div class="out">This is the standard <b>flag pattern</b>: the ISR does one assignment, the loop does the work. It keeps the ISR legal (no Serial, no delay) while still giving you exact timing.</div>

<h3>What it is really for</h3>
<div class="lz-stack">
  <div class="lz-layer">Sampling a sensor at a precise, constant rate so a filter or FFT is meaningful</div>
  <div class="lz-layer">Refreshing a multiplexed display (the 8×8 matrix) at a steady 100+ Hz so it never flickers</div>
  <div class="lz-layer">A control loop (PID) that must run every 10 ms exactly</div>
  <div class="lz-layer">A watchdog-style safety check that must happen even if the main code is stuck</div>
</div>

<div class="pitfall"><b>Trap:</b> using Timer1 while a servo is attached. The <span class="badge">Servo</span> library owns Timer1, so <span class="badge">TimerOne</span> silently fights it — the servo jitters or your interval is wrong. Symptoms look like a wiring fault. Either use Timer2 or restructure to millis(); reading the library documentation about timer usage before combining libraries saves a whole evening.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Where the frequency numbers come from.</b> The chip counts at 16 MHz divided by a <em>prescaler</em> (1, 8, 64, 256 or 1024). With prescaler 64 the counter ticks every 4 µs; a 16-bit Timer1 overflows after 65536 ticks ≈ 262 ms. That is why libraries pick a prescaler based on the interval you ask for, and why very long intervals need a software counter on top ("fire every 100 ms, act on the tenth tick"). Understanding prescaler → tick → overflow is what lets you read any microcontroller's timer datasheet, on any chip family, for the rest of your career.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Một nhịp tim mà vòng lặp không quấy rối được</h2>
<p class="lead">Lab buổi 45 là "Timer Interrupts". Ngắt ngoài phản ứng với thế giới bên ngoài; một <strong>ngắt định thời</strong> phản ứng với dòng thời gian — bộ đếm của chính con chip kích một ISR ở nhịp cố định, bất kể vòng lặp của bạn đang làm gì.</p>

<h3>millis() so với ngắt định thời</h3>
<table>
  <thead><tr><th></th><th>Thăm dò bằng millis() (8.1)</th><th>Ngắt định thời</th></tr></thead>
  <tbody>
    <tr><td>Độ chính xác</td><td>tốt ngang mức vòng lặp chạy nhanh — bị xê dịch nếu một nhiệm vụ chạy lâu</td><td>chuẩn xác, do phần cứng lo</td></tr>
    <tr><td>Độ phức tạp</td><td>vài dòng, dễ đọc</td><td>thanh ghi hoặc thư viện, dễ làm sai</td></tr>
    <tr><td>Hợp với</td><td><b>gần như mọi thứ</b></td><td>lấy mẫu ở nhịp cố định, tạo dạng sóng, vòng điều khiển</td></tr>
  </tbody>
</table>
<div class="note-ct">Chỉ với tới timer khi độ xê dịch thực sự quan trọng. Đọc nhiệt độ "khoảng mỗi 2 giây" thì không cần; lấy mẫu âm thanh ở đúng 8 kHz thì cần.</div>

<h3>Ba bộ timer — và chúng đã đang làm gì</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Timer0</b> — 8 bit. Đã bị <span class="badge">millis()</span>, <span class="badge">micros()</span> và <span class="badge">delay()</span> dùng. Đụng vào nó là chính thời gian gãy.</div>
  <div class="lz-layer"><b>Timer1</b> — 16 bit, rộng rãi nhất. Được thư viện <span class="badge">Servo</span> và PWM chân 9/10 dùng. Lựa chọn thường thấy cho việc định thời của riêng bạn.</div>
  <div class="lz-layer"><b>Timer2</b> — 8 bit. Nuôi <span class="badge">tone()</span> và PWM chân 3/11.</div>
</div>

<h3>Cách dễ — thư viện TimerOne</h3>
<pre><span class="tok-keyword">#include</span> <span class="tok-string">&lt;TimerOne.h&gt;</span>
<span class="tok-keyword">volatile</span> <span class="tok-type">bool</span> tick = <span class="tok-keyword">false</span>;

<span class="tok-keyword">void</span> <span class="tok-function">onTimer</span>() { tick = <span class="tok-keyword">true</span>; }      <span class="tok-comment">// giữ ISR đơn giản hết mức</span>

<span class="tok-keyword">void</span> <span class="tok-function">setup</span>() {
  Serial.<span class="tok-function">begin</span>(9600);
  <span class="tok-function">Timer1</span>.<span class="tok-function">initialize</span>(100000);       <span class="tok-comment">// 100.000 µs = mỗi 0,1 s</span>
  <span class="tok-function">Timer1</span>.<span class="tok-function">attachInterrupt</span>(onTimer);
}

<span class="tok-keyword">void</span> <span class="tok-function">loop</span>() {
  <span class="tok-keyword">if</span> (tick) {                     <span class="tok-comment">// ISR chỉ dựng một lá cờ…</span>
    tick = <span class="tok-keyword">false</span>;
    <span class="tok-function">sampleSensor</span>();               <span class="tok-comment">// …việc thật diễn ra ở đây</span>
  }
}</pre>
<div class="out">Đây là <b>mẫu lá cờ</b> chuẩn: ISR làm đúng một phép gán, vòng lặp làm phần việc. Nó giữ cho ISR hợp lệ (không Serial, không delay) mà vẫn cho bạn định thời chính xác.</div>

<h3>Nó thực sự dùng để làm gì</h3>
<div class="lz-stack">
  <div class="lz-layer">Lấy mẫu cảm biến ở nhịp chính xác và hằng định để một bộ lọc hay phép FFT có ý nghĩa</div>
  <div class="lz-layer">Quét làm tươi một màn hình đa hợp (ma trận 8×8) ở nhịp ổn định trên 100 Hz để nó không bao giờ chớp</div>
  <div class="lz-layer">Một vòng điều khiển (PID) bắt buộc phải chạy đúng mỗi 10 ms</div>
  <div class="lz-layer">Một phép kiểm an toàn kiểu watchdog phải xảy ra ngay cả khi code chính bị kẹt</div>
</div>

<div class="pitfall"><b>Bẫy:</b> dùng Timer1 trong khi đang gắn servo. Thư viện <span class="badge">Servo</span> sở hữu Timer1, nên <span class="badge">TimerOne</span> âm thầm giành giật với nó — servo giật hoặc khoảng thời gian của bạn sai bét. Triệu chứng trông y như lỗi đấu dây. Hoặc dùng Timer2, hoặc cấu trúc lại theo millis(); đọc tài liệu thư viện về việc chúng dùng timer nào trước khi ghép nhiều thư viện sẽ tiết kiệm cho bạn trọn một buổi tối.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Các con số tần suất ở đâu ra.</b> Con chip đếm ở 16 MHz chia cho một <em>hệ số chia trước (prescaler)</em> (1, 8, 64, 256 hoặc 1024). Với prescaler 64 thì bộ đếm nhích mỗi 4 µs; một Timer1 16 bit tràn sau 65536 nhịp ≈ 262 ms. Đó là lý do thư viện chọn prescaler dựa trên khoảng thời gian bạn yêu cầu, và vì sao khoảng rất dài cần thêm một bộ đếm phần mềm chồng lên ("kích mỗi 100 ms, hành động ở nhịp thứ mười"). Hiểu được prescaler → nhịp đếm → tràn là thứ cho phép bạn đọc datasheet timer của bất kỳ vi điều khiển nào, thuộc bất kỳ họ chip nào, suốt phần đời nghề nghiệp còn lại.</div>
</div>
`,
        },
        {
          title: 'Quiz 3 — Sensors, displays, networking & interrupts|||Quiz 3 — Cảm biến, hiển thị, mạng & ngắt',
          slug: 'iot102-quiz-3',
          type: 'QUIZ',
          description: 'Kiểm tra chương 5–8: cảm biến, hiển thị, mạng IoT, serial, millis và ngắt.',
          quiz: {
            timeLimitSeconds: 480,
            questions: [
              { question: 'The HC-SR04 converts the echo time to centimetres by dividing microseconds by…|||HC-SR04 đổi thời gian vọng ra centimet bằng cách chia số micro-giây cho…', options: ['2', '58', '340', '1023'], correctIndex: 1, points: 1 },
              { question: 'A servo motor should be powered…|||Động cơ servo nên được cấp nguồn…', options: ['from the Arduino 5V pin|||từ chân 5V của Arduino', 'from a separate supply with a shared GND|||từ nguồn riêng, chung GND với Arduino', 'from an analog pin|||từ một chân analog', 'from the USB data line|||từ dây dữ liệu USB'], correctIndex: 1, points: 1 },
              { question: 'The LM35 outputs 10 mV per °C, so 0.27 V means…|||LM35 xuất 10 mV mỗi °C, nên 0,27 V nghĩa là…', options: ['2.7 °C', '27 °C', '270 °C', '0.27 °C'], correctIndex: 1, points: 1 },
              { question: 'For a sensor 3 km away that must run a year on one battery, choose…|||Với cảm biến cách 3 km phải chạy một năm bằng một viên pin, hãy chọn…', options: ['WiFi', 'LoRa', 'Bluetooth LE', 'Ethernet'], correctIndex: 1, points: 1 },
              { question: 'In the non-blocking pattern, the correct test is…|||Trong mẫu không chặn, phép kiểm đúng là…', options: ['if (millis() >= prev + interval)', 'if (millis() - prev >= interval)', 'if (delay(interval))', 'if (prev - millis() >= interval)'], correctIndex: 1, points: 1 },
              { question: 'A variable shared between an ISR and loop() must be declared…|||Biến dùng chung giữa ISR và loop() phải khai báo là…', options: ['static', 'volatile', 'const', 'unsigned'], correctIndex: 1, points: 1 },
              { question: 'Inside an ISR you must NOT…|||Bên trong một ISR bạn KHÔNG được…', options: ['increment a counter|||tăng một bộ đếm', 'call delay() or Serial.print()|||gọi delay() hoặc Serial.print()', 'set a flag|||đặt một cờ', 'read a pin|||đọc một chân'], correctIndex: 1, points: 1 },
              { question: 'Moving-average smoothing costs you… (beyond-syllabus)|||Làm mượt bằng trung bình trượt khiến bạn phải trả giá bằng… (ngoài giáo trình)', options: ['memory only|||chỉ bộ nhớ', 'response delay — the average lags the real value|||độ trễ phản hồi — giá trị trung bình chậm hơn giá trị thật', 'accuracy of the ADC|||độ chính xác của ADC', 'nothing|||không gì cả'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 9 — BỘ NHỚ & LƯU TRỮ ══════════════════ */
    {
      title: 'Chapter 9 — Memory & storage: EEPROM|||Chương 9 — Bộ nhớ & lưu trữ: EEPROM',
      description: 'Giữ lại thiết lập khi mất điện: đọc/ghi EEPROM, giới hạn số lần ghi, và bố trí dữ liệu.',
      lessons: [
        {
          title: '9.1 — Saving settings that survive a power cut|||9.1 — Lưu thiết lập sống sót qua mất điện',
          slug: 'iot102-eeprom',
          type: 'VIDEO',
          description: 'Lab buổi 51: EEPROM.read/write/update/get/put, hạn 100.000 lần ghi, và mẫu "magic byte" cho lần chạy đầu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>The 1 KB that remembers</h2>
<p class="lead">Session 51's lab exists to solve a real problem: your device is configured with a threshold, a PIN or a counter — and a power cut resets every variable to its starting value, because SRAM is volatile. The ATmega328's <strong>EEPROM</strong> is 1024 bytes of memory that survives.</p>

<h3>The whole API is five functions</h3>
<pre><span class="tok-keyword">#include</span> <span class="tok-string">&lt;EEPROM.h&gt;</span>

EEPROM.<span class="tok-function">write</span>(0, 42);              <span class="tok-comment">// write one byte (0..255) to address 0</span>
<span class="tok-type">byte</span> v = EEPROM.<span class="tok-function">read</span>(0);        <span class="tok-comment">// read it back</span>

EEPROM.<span class="tok-function">update</span>(0, 42);             <span class="tok-comment">// writes ONLY if the value differs — prefer this</span>

<span class="tok-type">float</span> threshold = 27.5;
EEPROM.<span class="tok-function">put</span>(10, threshold);        <span class="tok-comment">// store any type (4 bytes here)</span>
EEPROM.<span class="tok-function">get</span>(10, threshold);        <span class="tok-comment">// read it back into the variable</span></pre>
<div class="note-ct"><span class="badge">write/read</span> handle single bytes; <span class="badge">put/get</span> handle whole variables (float, int, struct) by writing their bytes in sequence. Addresses run 0–1023 and you choose the layout yourself — there is no file system.</div>

<h3>The rule that matters: 100,000 writes</h3>
<div class="out">Each EEPROM cell tolerates roughly <b>100,000 write cycles</b> before it wears out. That sounds huge until you do the arithmetic: writing once per loop iteration at 1000 loops/second destroys a cell in <b>100 seconds</b>. Writing once a minute lasts about 190 years.</div>
<div class="lz-stack">
  <div class="lz-layer"><b>Never write in loop() unconditionally.</b> Write when a setting <em>changes</em>, not continuously.</div>
  <div class="lz-layer"><b>Always prefer <span class="badge">update()</span> to <span class="badge">write()</span></b> — it skips the write when the value is unchanged, which is most of the time.</div>
  <div class="lz-layer"><b>Reads are free</b> and unlimited; only writes wear the cells.</div>
</div>

<h3>Ví dụ có lời giải · A remembered threshold</h3>
<pre><span class="tok-keyword">const int</span> ADDR_MAGIC = 0, ADDR_THRESHOLD = 1;
<span class="tok-keyword">const byte</span> MAGIC = 0xA5;      <span class="tok-comment">// "this EEPROM has been initialised"</span>
<span class="tok-type">int</span> threshold;

<span class="tok-keyword">void</span> <span class="tok-function">setup</span>() {
  <span class="tok-keyword">if</span> (EEPROM.<span class="tok-function">read</span>(ADDR_MAGIC) != MAGIC) {   <span class="tok-comment">// first ever run</span>
    threshold = 500;                            <span class="tok-comment">// factory default</span>
    EEPROM.<span class="tok-function">put</span>(ADDR_THRESHOLD, threshold);
    EEPROM.<span class="tok-function">update</span>(ADDR_MAGIC, MAGIC);
  } <span class="tok-keyword">else</span> {
    EEPROM.<span class="tok-function">get</span>(ADDR_THRESHOLD, threshold); <span class="tok-comment">// restore the saved value</span>
  }
}

<span class="tok-keyword">void</span> <span class="tok-function">saveThreshold</span>(<span class="tok-type">int</span> t) {       <span class="tok-comment">// called only when the user changes it</span>
  threshold = t;
  EEPROM.<span class="tok-function">put</span>(ADDR_THRESHOLD, t);
}</pre>
<div class="out">The <b>magic byte</b> solves a subtle problem: a brand-new chip's EEPROM is filled with 255, so without this check your first boot would load a nonsense threshold of 65535. Real firmware always distinguishes "never configured" from "configured".</div>

<div class="pitfall"><b>Trap:</b> forgetting that <span class="badge">put</span> occupies several addresses. A <span class="badge">float</span> at address 10 uses 10, 11, 12 and 13 — putting the next value at address 11 corrupts both. Write your address map down in a comment before you write the code.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Wear levelling — how commercial devices get past 100,000 writes.</b> If a value must be written often, do not keep it at one fixed address. Instead cycle through a block of, say, 100 addresses, tagging each record with a sequence number; on boot, scan the block and take the highest sequence number. You have multiplied the endurance by 100. This is exactly the technique inside every SSD and SD card, at a much larger scale — and it is a very strong thing to explain in a project defence when your device logs data.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>1 KB biết nhớ</h2>
<p class="lead">Lab buổi 51 tồn tại để giải một vấn đề thật: thiết bị của bạn được cấu hình một ngưỡng, một mã PIN hay một bộ đếm — rồi một cú mất điện đưa mọi biến về giá trị khởi đầu, vì SRAM mất nội dung khi ngắt nguồn. <strong>EEPROM</strong> của ATmega328 là 1024 byte bộ nhớ sống sót được.</p>

<h3>Toàn bộ API gói trong năm hàm</h3>
<pre><span class="tok-keyword">#include</span> <span class="tok-string">&lt;EEPROM.h&gt;</span>

EEPROM.<span class="tok-function">write</span>(0, 42);              <span class="tok-comment">// ghi một byte (0..255) vào địa chỉ 0</span>
<span class="tok-type">byte</span> v = EEPROM.<span class="tok-function">read</span>(0);        <span class="tok-comment">// đọc lại</span>

EEPROM.<span class="tok-function">update</span>(0, 42);             <span class="tok-comment">// CHỈ ghi nếu giá trị khác — nên ưu tiên dùng cái này</span>

<span class="tok-type">float</span> threshold = 27.5;
EEPROM.<span class="tok-function">put</span>(10, threshold);        <span class="tok-comment">// lưu kiểu bất kỳ (ở đây 4 byte)</span>
EEPROM.<span class="tok-function">get</span>(10, threshold);        <span class="tok-comment">// đọc lại vào chính biến đó</span></pre>
<div class="note-ct"><span class="badge">write/read</span> làm việc với từng byte; <span class="badge">put/get</span> làm việc với cả biến (float, int, struct) bằng cách ghi các byte của nó liên tiếp. Địa chỉ chạy 0–1023 và bạn tự chọn bố trí — không có hệ thống tập tin nào cả.</div>

<h3>Luật quan trọng nhất: 100.000 lần ghi</h3>
<div class="out">Mỗi ô EEPROM chịu được khoảng <b>100.000 chu kỳ ghi</b> trước khi hỏng. Nghe thì to cho tới khi bạn làm phép tính: ghi một lần mỗi vòng lặp ở nhịp 1000 vòng/giây thì phá hỏng một ô trong <b>100 giây</b>. Ghi mỗi phút một lần thì dùng được khoảng 190 năm.</div>
<div class="lz-stack">
  <div class="lz-layer"><b>Đừng bao giờ ghi vô điều kiện trong loop().</b> Ghi khi một thiết lập <em>thay đổi</em>, không phải ghi liên tục.</div>
  <div class="lz-layer"><b>Luôn ưu tiên <span class="badge">update()</span> hơn <span class="badge">write()</span></b> — nó bỏ qua lần ghi khi giá trị không đổi, tức là phần lớn thời gian.</div>
  <div class="lz-layer"><b>Đọc thì miễn phí</b> và không giới hạn; chỉ ghi mới làm mòn ô nhớ.</div>
</div>

<h3>Ví dụ có lời giải · Một ngưỡng được nhớ lại</h3>
<pre><span class="tok-keyword">const int</span> ADDR_MAGIC = 0, ADDR_THRESHOLD = 1;
<span class="tok-keyword">const byte</span> MAGIC = 0xA5;      <span class="tok-comment">// "EEPROM này đã được khởi tạo"</span>
<span class="tok-type">int</span> threshold;

<span class="tok-keyword">void</span> <span class="tok-function">setup</span>() {
  <span class="tok-keyword">if</span> (EEPROM.<span class="tok-function">read</span>(ADDR_MAGIC) != MAGIC) {   <span class="tok-comment">// lần chạy đầu tiên</span>
    threshold = 500;                            <span class="tok-comment">// giá trị mặc định xuất xưởng</span>
    EEPROM.<span class="tok-function">put</span>(ADDR_THRESHOLD, threshold);
    EEPROM.<span class="tok-function">update</span>(ADDR_MAGIC, MAGIC);
  } <span class="tok-keyword">else</span> {
    EEPROM.<span class="tok-function">get</span>(ADDR_THRESHOLD, threshold); <span class="tok-comment">// khôi phục giá trị đã lưu</span>
  }
}

<span class="tok-keyword">void</span> <span class="tok-function">saveThreshold</span>(<span class="tok-type">int</span> t) {       <span class="tok-comment">// chỉ gọi khi người dùng đổi giá trị</span>
  threshold = t;
  EEPROM.<span class="tok-function">put</span>(ADDR_THRESHOLD, t);
}</pre>
<div class="out"><b>Byte thần chú (magic byte)</b> giải một vấn đề tinh vi: EEPROM của chip mới tinh toàn giá trị 255, nên không có phép kiểm này thì lần khởi động đầu tiên sẽ nạp một ngưỡng vô nghĩa bằng 65535. Firmware thật luôn phân biệt "chưa từng cấu hình" với "đã cấu hình".</div>

<div class="pitfall"><b>Bẫy:</b> quên rằng <span class="badge">put</span> chiếm nhiều địa chỉ. Một <span class="badge">float</span> ở địa chỉ 10 dùng hết 10, 11, 12 và 13 — đặt giá trị kế tiếp vào địa chỉ 11 là hỏng cả hai. Hãy viết bản đồ địa chỉ ra một dòng chú thích trước khi viết code.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Cân bằng hao mòn — cách thiết bị thương mại vượt qua giới hạn 100.000 lần ghi.</b> Nếu một giá trị buộc phải ghi thường xuyên, đừng giữ nó ở một địa chỉ cố định. Thay vào đó hãy xoay vòng qua một khối, ví dụ 100 địa chỉ, gắn cho mỗi bản ghi một số thứ tự; lúc khởi động thì quét cả khối và lấy số thứ tự lớn nhất. Bạn vừa nhân tuổi thọ lên 100 lần. Đây đúng là kỹ thuật bên trong mọi ổ SSD và thẻ nhớ SD, chỉ ở quy mô lớn hơn nhiều — và là một điều rất mạnh để trình bày khi bảo vệ đồ án có ghi nhật ký dữ liệu.</div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 10 — BẢO MẬT IoT ══════════════════ */
    {
      title: 'Chapter 10 — Securing IoT|||Chương 10 — Bảo mật IoT',
      description: 'Hai buổi online 16–17 (CLO4): bề mặt tấn công của một thiết bị, các vụ thật, và biện pháp phòng vệ khả thi.',
      lessons: [
        {
          title: '10.1 — Threats: why IoT devices get hacked|||10.1 — Mối đe doạ: vì sao thiết bị IoT bị tấn công',
          slug: 'iot102-bao-mat-de-doa',
          type: 'VIDEO',
          description: 'Bề mặt tấn công bốn tầng, botnet Mirai, và những sai lầm thiết kế lặp đi lặp lại (CLO4).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>The layer everyone skips</h2>
<p class="lead">CLO4 gets two dedicated online sessions (16 and 17). The reason is uncomfortable: IoT devices are, on average, the least secure computers on any network — cheap, numerous, rarely updated, and often installed and forgotten.</p>

<h3>The attack surface, layer by layer</h3>
<table>
  <thead><tr><th>Layer</th><th>What an attacker does</th><th>Real consequence</th></tr></thead>
  <tbody>
    <tr><td>Device (physical)</td><td>reads the firmware out of Flash, finds keys and PINs</td><td>every device of that model is now open</td></tr>
    <tr><td>Network</td><td>sniffs unencrypted traffic; replays a captured "unlock" message</td><td>the door opens without any credentials</td></tr>
    <tr><td>Cloud / API</td><td>guesses default passwords, exploits an unauthenticated endpoint</td><td>control of thousands of devices at once</td></tr>
    <tr><td>Application</td><td>hijacks a session in the phone app</td><td>a stranger sees your camera feed</td></tr>
  </tbody>
</table>

<h3>Mirai, 2016 — the case study worth remembering</h3>
<div class="out">Malware scanned the internet for cameras and routers, then tried a list of about <b>60 default username/password pairs</b> (admin/admin, root/12345…). No exploit, no clever code — just factory defaults nobody changed. It captured hundreds of thousands of devices and used them to knock major internet services offline. The lesson: <b>the weakest link in IoT is almost never the cryptography, it is the configuration.</b></div>

<h3>The five recurring design mistakes</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>1 · Default credentials</b> that the user is never forced to change.</div>
  <div class="lz-layer"><b>2 · Plaintext traffic</b> — HTTP and unencrypted MQTT can be read and modified by anyone on the path.</div>
  <div class="lz-layer"><b>3 · No update mechanism</b> — a flaw found in year two can never be fixed.</div>
  <div class="lz-layer"><b>4 · Secrets in firmware</b> — an API key compiled into the sketch is extractable in minutes with a programmer.</div>
  <div class="lz-layer"><b>5 · Trusting the client</b> — a device that obeys any command that reaches it, without checking who sent it.</div>
</div>

<div class="pitfall"><b>The mistake specific to student projects:</b> uploading your sketch to GitHub with the WiFi SSID, password and cloud API key in plain sight. Bots scan public repositories for exactly these strings within minutes of a commit. Keep credentials in a separate <span class="badge">secrets.h</span> that you exclude from the repository — a habit worth forming now, before it costs you a real account.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Threat modelling in four questions.</b> Before defending anything, professionals ask: <em>What am I protecting?</em> (data, physical access, availability) · <em>Who might attack it?</em> (a curious neighbour, an automated bot, a determined thief) · <em>What can they reach?</em> (radio, cloud, physical) · <em>What happens if they win?</em> Answering those four for your own project — even in three sentences — turns a vague "we should add security" into concrete decisions, and is exactly the analysis CLO4 is testing.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Cái tầng ai cũng bỏ qua</h2>
<p class="lead">CLO4 được dành hẳn hai buổi online (16 và 17). Lý do khá khó chịu: thiết bị IoT, tính trung bình, là những máy tính kém an toàn nhất trên bất kỳ mạng nào — rẻ, nhiều, hiếm khi cập nhật, và thường lắp xong là quên.</p>

<h3>Bề mặt tấn công, theo từng tầng</h3>
<table>
  <thead><tr><th>Tầng</th><th>Kẻ tấn công làm gì</th><th>Hậu quả thật</th></tr></thead>
  <tbody>
    <tr><td>Thiết bị (vật lý)</td><td>đổ firmware ra khỏi Flash, tìm khoá và mã PIN</td><td>mọi thiết bị cùng đời sản phẩm đó giờ đều mở toang</td></tr>
    <tr><td>Mạng</td><td>nghe lén lưu lượng không mã hoá; phát lại một thông điệp "mở khoá" đã bắt được</td><td>cửa mở mà chẳng cần thông tin đăng nhập nào</td></tr>
    <tr><td>Cloud / API</td><td>đoán mật khẩu mặc định, khai thác một điểm cuối không xác thực</td><td>chiếm quyền hàng nghìn thiết bị cùng lúc</td></tr>
    <tr><td>Ứng dụng</td><td>chiếm phiên đăng nhập trong app điện thoại</td><td>người lạ xem được hình từ camera nhà bạn</td></tr>
  </tbody>
</table>

<h3>Mirai, 2016 — vụ điển hình đáng nhớ</h3>
<div class="out">Mã độc quét internet tìm camera và router, rồi thử một danh sách khoảng <b>60 cặp tên đăng nhập/mật khẩu mặc định</b> (admin/admin, root/12345…). Không khai thác lỗ hổng nào, chẳng có đoạn code khôn ngoan nào — chỉ là cấu hình xuất xưởng mà không ai đổi. Nó chiếm hàng trăm nghìn thiết bị và dùng chúng đánh sập nhiều dịch vụ internet lớn. Bài học: <b>mắt xích yếu nhất trong IoT gần như không bao giờ là mật mã học, mà là cấu hình.</b></div>

<h3>Năm sai lầm thiết kế lặp đi lặp lại</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>1 · Thông tin đăng nhập mặc định</b> mà người dùng không bao giờ bị buộc phải đổi.</div>
  <div class="lz-layer"><b>2 · Lưu lượng dạng thô</b> — HTTP và MQTT không mã hoá thì ai nằm trên đường truyền cũng đọc và sửa được.</div>
  <div class="lz-layer"><b>3 · Không có cơ chế cập nhật</b> — một lỗ hổng phát hiện ở năm thứ hai sẽ chẳng bao giờ vá được.</div>
  <div class="lz-layer"><b>4 · Bí mật nằm trong firmware</b> — một khoá API biên dịch thẳng vào sketch có thể moi ra trong vài phút bằng mạch nạp.</div>
  <div class="lz-layer"><b>5 · Tin tưởng phía client</b> — thiết bị tuân theo mọi lệnh gửi tới, không hề kiểm ai là người gửi.</div>
</div>

<div class="pitfall"><b>Sai lầm đặc trưng của đồ án sinh viên:</b> đẩy sketch lên GitHub với tên WiFi, mật khẩu và khoá API cloud phơi lồ lộ. Bot quét các kho mã công khai để tìm đúng những chuỗi đó trong vòng vài phút sau một commit. Hãy giữ thông tin nhạy cảm trong một file riêng <span class="badge">secrets.h</span> và loại nó khỏi kho mã — một thói quen đáng tạo ngay từ bây giờ, trước khi nó khiến bạn mất một tài khoản thật.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Mô hình hoá mối đe doạ trong bốn câu hỏi.</b> Trước khi phòng vệ bất cứ thứ gì, dân chuyên tự hỏi: <em>Tôi đang bảo vệ cái gì?</em> (dữ liệu, quyền truy cập vật lý, tính sẵn sàng) · <em>Ai có thể tấn công?</em> (một người hàng xóm tò mò, một con bot tự động, một kẻ trộm quyết tâm) · <em>Họ chạm được tới đâu?</em> (sóng, cloud, vật lý) · <em>Nếu họ thắng thì sao?</em> Trả lời bốn câu đó cho chính đồ án của bạn — dù chỉ ba câu văn — biến một câu chung chung "chắc nên thêm bảo mật" thành các quyết định cụ thể, và đó đúng là phần phân tích mà CLO4 đang kiểm tra.</div>
</div>
`,
        },
        {
          title: '10.2 — Defences you can actually implement|||10.2 — Biện pháp phòng vệ bạn làm được thật',
          slug: 'iot102-bao-mat-phong-ve',
          type: 'VIDEO',
          description: 'TLS/MQTT có mã hoá, xác thực thiết bị, cập nhật OTA, và những gì khả thi ngay trên đồ án của bạn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>From "we should be secure" to concrete steps</h2>
<p class="lead">Lesson 10.1 listed what goes wrong. This one is the checklist — ordered so that the cheap, high-impact items come first, which is how security is prioritised in practice.</p>

<h3>The defence checklist, in priority order</h3>
<table>
  <thead><tr><th>#</th><th>Defence</th><th>Effort</th><th>Stops</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Change every default credential; force the user to set one on first boot</td><td>trivial</td><td>Mirai-class attacks entirely</td></tr>
    <tr><td>2</td><td>Encrypt the link: HTTPS/TLS, or MQTT over TLS on port 8883</td><td>low on ESP32</td><td>sniffing and tampering in transit</td></tr>
    <tr><td>3</td><td>Authenticate the device: a per-device token or certificate, not one shared key</td><td>medium</td><td>one leaked key compromising the whole fleet</td></tr>
    <tr><td>4</td><td>Validate every input before acting on it (length, range, format)</td><td>low</td><td>malformed or hostile commands</td></tr>
    <tr><td>5</td><td>Support firmware updates (OTA)</td><td>medium</td><td>permanent vulnerability</td></tr>
    <tr><td>6</td><td>Keep secrets out of the repository and out of plaintext Flash where possible</td><td>trivial</td><td>casual key extraction</td></tr>
  </tbody>
</table>

<h3>Why an UNO cannot do TLS — and what to do about it</h3>
<p>TLS needs kilobytes of RAM for certificates and buffers; the ATmega328 has 2 KB total. This is not a coding problem, it is a hardware limit. Two honest options:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Move up a chip.</b> An <b>ESP32</b> has 520 KB RAM and hardware crypto acceleration; <span class="badge">WiFiClientSecure</span> gives you real TLS in a few lines.</div>
  <div class="lz-layer"><b>Use the gateway pattern.</b> The UNO speaks a short-range link to a Raspberry Pi gateway; the <em>gateway</em> holds the TLS connection to the cloud. The constrained device never touches the internet directly — which is how most industrial deployments are built anyway.</div>
</div>

<h3>What is realistic in your course project</h3>
<div class="lz-flow">
  <div class="lz-step">No hard-coded default password; PIN stored (hashed) in EEPROM</div>
  <div class="lz-step">Credentials in secrets.h, excluded from the repo</div>
  <div class="lz-step">Every serial/radio command validated before acting</div>
  <div class="lz-step">If using MQTT: broker username/password, TLS if the board allows</div>
  <div class="lz-step">A paragraph in the report: threats considered, defences chosen, and what you consciously did not do</div>
</div>
<div class="note-ct">That last step matters more than students expect. Examiners do not require an unbreakable device; they require evidence that you <em>thought</em> about it. "We did not implement TLS because the UNO has 2 KB of RAM; in production we would move to an ESP32 or a gateway" is a far stronger answer than silence.</div>

<div class="pitfall"><b>Trap:</b> confusing <em>encoding</em> with <em>encryption</em>. Base64 and hexadecimal make data unreadable to a human but are reversible by anyone in one command — they provide zero security. Likewise, "the attacker would have to know our message format" is <b>security by obscurity</b>: it delays a curious person by an afternoon and a determined one by nothing.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Secure boot and hardware roots of trust.</b> The strongest defence against firmware tampering is a chip that refuses to run code which is not cryptographically signed by the manufacturer. The verification key lives in one-time-programmable fuses, so even physical access cannot replace it — this is <em>secure boot</em>, standard on ESP32, phones and modern cars. Combined with encrypted flash, it means an attacker holding the physical device still cannot read the firmware or install their own. Knowing this exists explains why serious IoT products cost more than the sum of their components.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Từ "chắc nên bảo mật" thành các bước cụ thể</h2>
<p class="lead">Bài 10.1 liệt kê những gì hỏng. Bài này là bảng kiểm — sắp xếp sao cho các mục rẻ tiền mà tác dụng lớn đứng trước, đúng cách người ta ưu tiên bảo mật trong thực tế.</p>

<h3>Bảng kiểm phòng vệ, theo thứ tự ưu tiên</h3>
<table>
  <thead><tr><th>#</th><th>Biện pháp</th><th>Công sức</th><th>Chặn được</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Đổi mọi thông tin đăng nhập mặc định; buộc người dùng đặt mật khẩu ở lần khởi động đầu</td><td>không đáng kể</td><td>trọn vẹn các đợt tấn công kiểu Mirai</td></tr>
    <tr><td>2</td><td>Mã hoá đường truyền: HTTPS/TLS, hoặc MQTT qua TLS ở cổng 8883</td><td>thấp trên ESP32</td><td>nghe lén và sửa dữ liệu trên đường truyền</td></tr>
    <tr><td>3</td><td>Xác thực thiết bị: token hoặc chứng chỉ riêng từng máy, không dùng chung một khoá</td><td>vừa</td><td>một khoá lộ kéo sập cả đàn thiết bị</td></tr>
    <tr><td>4</td><td>Kiểm mọi dữ liệu vào trước khi hành động (độ dài, miền giá trị, định dạng)</td><td>thấp</td><td>lệnh dị dạng hoặc thù địch</td></tr>
    <tr><td>5</td><td>Hỗ trợ cập nhật firmware (OTA)</td><td>vừa</td><td>lỗ hổng tồn tại vĩnh viễn</td></tr>
    <tr><td>6</td><td>Giữ bí mật ngoài kho mã và, nếu được, ngoài vùng Flash dạng thô</td><td>không đáng kể</td><td>việc moi khoá một cách dễ dãi</td></tr>
  </tbody>
</table>

<h3>Vì sao UNO không làm được TLS — và phải làm gì</h3>
<p>TLS cần vài kilobyte RAM cho chứng chỉ và bộ đệm; ATmega328 có tổng cộng 2 KB. Đây không phải vấn đề lập trình, mà là giới hạn phần cứng. Hai lựa chọn trung thực:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Nâng lên con chip khác.</b> <b>ESP32</b> có 520 KB RAM và mạch tăng tốc mật mã trong phần cứng; <span class="badge">WiFiClientSecure</span> cho bạn TLS thật bằng vài dòng.</div>
  <div class="lz-layer"><b>Dùng mẫu gateway.</b> UNO nói một đường sóng tầm ngắn với một gateway Raspberry Pi; chính <em>gateway</em> mới giữ kết nối TLS tới cloud. Thiết bị hạn chế không bao giờ chạm internet trực tiếp — mà đằng nào phần lớn hệ thống công nghiệp cũng được xây đúng như vậy.</div>
</div>

<h3>Cái gì khả thi trong đồ án môn học của bạn</h3>
<div class="lz-flow">
  <div class="lz-step">Không có mật khẩu mặc định viết cứng; mã PIN lưu (dạng băm) trong EEPROM</div>
  <div class="lz-step">Thông tin nhạy cảm để trong secrets.h, loại khỏi kho mã</div>
  <div class="lz-step">Mọi lệnh qua serial/sóng đều được kiểm trước khi thi hành</div>
  <div class="lz-step">Nếu dùng MQTT: đặt username/password cho broker, bật TLS nếu board cho phép</div>
  <div class="lz-step">Một đoạn trong báo cáo: đã cân nhắc mối đe doạ nào, chọn phòng vệ gì, và cố ý KHÔNG làm gì</div>
</div>
<div class="note-ct">Bước cuối cùng đó quan trọng hơn sinh viên tưởng nhiều. Giám khảo không đòi một thiết bị không thể phá; họ đòi bằng chứng rằng bạn đã <em>suy nghĩ</em> về nó. "Chúng em không làm TLS vì UNO chỉ có 2 KB RAM; nếu làm sản phẩm thật thì sẽ chuyển sang ESP32 hoặc dùng gateway" là câu trả lời mạnh hơn hẳn sự im lặng.</div>

<div class="pitfall"><b>Bẫy:</b> lẫn lộn <em>mã hoá ký tự (encoding)</em> với <em>mật mã hoá (encryption)</em>. Base64 và thập lục phân làm dữ liệu khó đọc với người nhưng ai cũng đảo ngược được bằng một dòng lệnh — chúng cho bạn số không về bảo mật. Tương tự, "kẻ tấn công phải biết định dạng thông điệp của chúng em" là <b>bảo mật bằng cách giấu diếm</b>: nó làm chậm một người tò mò mất một buổi chiều và làm chậm một kẻ quyết tâm đúng không giây nào.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Khởi động an toàn và gốc tin cậy phần cứng.</b> Phòng vệ mạnh nhất chống sửa firmware là một con chip từ chối chạy đoạn mã không được nhà sản xuất ký bằng mật mã. Khoá kiểm tra nằm trong các cầu chì chỉ ghi được một lần, nên ngay cả tiếp cận vật lý cũng không thay được — đó là <em>secure boot</em>, tiêu chuẩn trên ESP32, điện thoại và ô tô đời mới. Kết hợp với Flash được mã hoá, nó có nghĩa là kẻ tấn công dù cầm thiết bị trong tay vẫn không đọc được firmware hay cài được bản của họ. Biết điều này tồn tại giải thích vì sao sản phẩm IoT nghiêm túc đắt hơn tổng giá linh kiện của nó.</div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 11 — ĐỒ ÁN CUỐI KỲ ══════════════════ */
    {
      title: 'Chapter 11 — The final project|||Chương 11 — Đồ án cuối kỳ',
      description: '50% điểm môn: chọn đề tài, vẽ sơ đồ khối & lưu đồ (buổi 44), dựng, kiểm thử, và bảo vệ.',
      lessons: [
        {
          title: '11.1 — Choosing and planning your project|||11.1 — Chọn và lập kế hoạch đồ án',
          slug: 'iot102-do-an-lap-ke-hoach',
          type: 'VIDEO',
          description: 'Buổi 24–25: tiêu chí chọn đề tài khả thi, phạm vi vừa sức, và bản kế hoạch một trang.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>Half your grade starts here</h2>
<p class="lead">Recall the arithmetic from Lesson 0.2: on-going project assessment (30%) plus the final presentation (20%) is <b>50%</b> of the course. Topics are registered at session 15 and planned in sessions 24–25, which means the decision happens long before you feel ready. Here is how to make it well.</p>

<h3>Four tests for a good topic</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>1 · Solves a stated problem.</b> "A device that waters plants when the soil is dry" beats "a device with lots of sensors". The problem sentence is the first line of your report.</div>
  <div class="lz-layer"><b>2 · Uses the full chain.</b> Sense → decide → act → report. A project that only reads a sensor and prints it is a lab, not a project.</div>
  <div class="lz-layer"><b>3 · Buildable with the KIT plus at most one purchase.</b> Waiting three weeks for a part from overseas has ruined more projects than bad code.</div>
  <div class="lz-layer"><b>4 · Degrades gracefully.</b> If the WiFi module fails, the device should still water the plant locally. Always have a version that works without the riskiest component.</div>
</div>

<h3>Scoping: the two-layer plan</h3>
<table>
  <thead><tr><th>Layer</th><th>Contains</th><th>Deadline</th></tr></thead>
  <tbody>
    <tr><td><b>Core</b> <small>(must work)</small></td><td>one sensor, one decision, one actuator, one display</td><td>before the first on-going assessment (session 46)</td></tr>
    <tr><td><b>Extension</b> <small>(nice to have)</small></td><td>WiFi reporting, a dashboard, a second sensor, a nicer enclosure</td><td>before the final presentation</td></tr>
  </tbody>
</table>
<div class="out"><b>Worked example — smart plant watering.</b> Core: soil moisture sensor → threshold → relay drives a pump → LCD shows "DRY / WATERING / OK". Extension: ESP8266 posts readings to a dashboard; a button forces manual watering; EEPROM remembers the threshold. If the extension fails on demo day you still have a complete, working device.</div>

<h3>The one-page plan (bring this to session 24)</h3>
<div class="lz-flow">
  <div class="lz-step">Problem statement — one sentence</div>
  <div class="lz-step">Component list with quantities and what each one is for</div>
  <div class="lz-step">Block diagram (Lesson 11.2)</div>
  <div class="lz-step">Flowchart of the main logic (Lesson 11.2)</div>
  <div class="lz-step">Weekly milestones from now to the presentation</div>
  <div class="lz-step">Risks and the fallback for each</div>
</div>

<div class="pitfall"><b>The two ways student projects fail, both avoidable.</b> (1) <em>Too ambitious</em> — face recognition, an app, five sensors, all in six weeks: nothing is finished and there is nothing to show. (2) <em>Left too late</em> — the on-going assessments at sessions 46 and 56 mean the schedule is checked twice; a project that starts in the last two weeks loses those marks before the demo even happens.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Build the riskiest part first.</b> Professional teams call this <em>de-risking</em>: if a component might not work, prove it in week one, not week six. If your design needs an ESP8266 to talk to a cloud service, spend the first evening getting a single "hello" message to arrive — before you build the enclosure, before you write the display code. The natural instinct is the opposite: to build the easy, satisfying parts first and leave the scary one for later. That instinct is exactly why projects fail at the last minute.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Một nửa điểm môn bắt đầu từ đây</h2>
<p class="lead">Nhớ lại phép tính ở Bài 0.2: chấm tiến độ đồ án (30%) cộng bảo vệ cuối (20%) là <b>50%</b> điểm môn. Đề tài đăng ký ở buổi 15 và lập kế hoạch ở buổi 24–25, tức là quyết định diễn ra rất lâu trước khi bạn cảm thấy mình sẵn sàng. Đây là cách quyết định cho tốt.</p>

<h3>Bốn phép thử cho một đề tài tốt</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>1 · Giải một vấn đề nêu rõ ràng.</b> "Thiết bị tưới cây khi đất khô" hơn hẳn "thiết bị có nhiều cảm biến". Câu nêu vấn đề chính là dòng đầu tiên trong báo cáo của bạn.</div>
  <div class="lz-layer"><b>2 · Dùng trọn chuỗi.</b> Cảm nhận → quyết định → tác động → báo cáo. Một đồ án chỉ đọc cảm biến rồi in ra là một bài lab, không phải đồ án.</div>
  <div class="lz-layer"><b>3 · Dựng được bằng KIT cộng nhiều nhất một lần mua thêm.</b> Chờ ba tuần một linh kiện từ nước ngoài đã phá nhiều đồ án hơn cả code dở.</div>
  <div class="lz-layer"><b>4 · Hỏng có duyên.</b> Nếu module WiFi chết, thiết bị vẫn phải tưới cây được tại chỗ. Luôn có một phiên bản chạy được mà không cần thành phần rủi ro nhất.</div>
</div>

<h3>Khoanh phạm vi: kế hoạch hai lớp</h3>
<table>
  <thead><tr><th>Lớp</th><th>Gồm</th><th>Hạn chót</th></tr></thead>
  <tbody>
    <tr><td><b>Lõi</b> <small>(bắt buộc chạy)</small></td><td>một cảm biến, một quyết định, một cơ cấu chấp hành, một màn hình</td><td>trước buổi chấm tiến độ lần một (buổi 46)</td></tr>
    <tr><td><b>Mở rộng</b> <small>(có thì tốt)</small></td><td>báo cáo qua WiFi, một dashboard, cảm biến thứ hai, vỏ hộp đẹp hơn</td><td>trước buổi bảo vệ cuối</td></tr>
  </tbody>
</table>
<div class="out"><b>Ví dụ có lời giải — tưới cây thông minh.</b> Lõi: cảm biến độ ẩm đất → ngưỡng → relay chạy máy bơm → LCD hiện "DRY / WATERING / OK". Mở rộng: ESP8266 đẩy số đọc lên dashboard; một nút cho phép tưới tay; EEPROM nhớ ngưỡng. Nếu phần mở rộng hỏng vào ngày demo, bạn vẫn còn một thiết bị hoàn chỉnh và chạy được.</div>

<h3>Bản kế hoạch một trang (mang tới buổi 24)</h3>
<div class="lz-flow">
  <div class="lz-step">Phát biểu vấn đề — một câu</div>
  <div class="lz-step">Danh mục linh kiện kèm số lượng và công dụng từng cái</div>
  <div class="lz-step">Sơ đồ khối (Bài 11.2)</div>
  <div class="lz-step">Lưu đồ của logic chính (Bài 11.2)</div>
  <div class="lz-step">Các mốc theo tuần từ nay tới buổi bảo vệ</div>
  <div class="lz-step">Các rủi ro và phương án dự phòng cho từng cái</div>
</div>

<div class="pitfall"><b>Hai kiểu chết của đồ án sinh viên, đều tránh được.</b> (1) <em>Quá tham vọng</em> — nhận diện khuôn mặt, một app, năm cảm biến, tất cả trong sáu tuần: chẳng cái nào xong và chẳng có gì để trình bày. (2) <em>Để quá muộn</em> — các buổi chấm tiến độ ở buổi 46 và 56 nghĩa là lịch trình bị kiểm hai lần; một đồ án khởi động trong hai tuần cuối đã mất số điểm đó trước cả khi buổi demo diễn ra.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hãy dựng phần rủi ro nhất trước.</b> Đội ngũ chuyên nghiệp gọi đây là <em>khử rủi ro</em>: nếu một thành phần có thể không chạy, hãy chứng minh nó ở tuần một, đừng để tuần sáu. Nếu thiết kế của bạn cần một ESP8266 nói chuyện với dịch vụ cloud, hãy dành buổi tối đầu tiên để một thông điệp "hello" duy nhất tới nơi — trước khi làm vỏ hộp, trước khi viết code màn hình. Bản năng tự nhiên thì ngược lại: làm những phần dễ và đã tay trước, để dành phần đáng sợ lại sau. Chính cái bản năng đó là lý do đồ án chết vào phút chót.</div>
</div>
`,
        },
        {
          title: '11.2 — Block diagram & flowchart|||11.2 — Sơ đồ khối & lưu đồ',
          slug: 'iot102-so-do-luu-do',
          type: 'VIDEO',
          description: 'Buổi 44: hai bản vẽ bắt buộc trong báo cáo — vẽ gì, vẽ thế nào, và lỗi hay gặp.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>Two drawings that explain the whole device</h2>
<p class="lead">Session 44 is dedicated to the block diagram and flowchart of the final project. They are not paperwork: the block diagram answers "what is connected to what", the flowchart answers "what does it decide". An examiner reads them before they look at your code.</p>

<h3>The block diagram — hardware</h3>
<p>Boxes for components, arrows for the direction data or power flows. Group them by role, and label each arrow with the interface.</p>
<div class="lz-map">
  <div class="lz-stage">Input</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Soil moisture sensor</div><div class="lz-nsub">— analog A0 →</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Push button (manual)</div><div class="lz-nsub">— digital D2 (interrupt) →</div></div></div>
  <div class="lz-stage">Processing</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Arduino UNO</div><div class="lz-nsub">threshold logic · EEPROM settings</div></div></div>
  <div class="lz-stage">Output</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Relay → pump</div><div class="lz-nsub">← digital D7 · separate 12V supply</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">LCD 1602 I2C</div><div class="lz-nsub">← A4/A5 (SDA/SCL)</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">ESP8266 → cloud</div><div class="lz-nsub">← serial · WiFi</div></div></div>
</div>
<div class="note-ct">Notice what a good block diagram makes obvious at a glance: which pins are used, where the second power supply is, and that the pump is isolated behind a relay. Those are the three things a reviewer checks first.</div>

<h3>The flowchart — software</h3>
<p>Standard shapes, used correctly: oval = start/end, rectangle = action, <b>diamond = decision</b> (exactly two labelled exits), parallelogram = input/output.</p>
<div class="lz-flow">
  <div class="lz-step">START → initialise pins, LCD, load threshold from EEPROM</div>
  <div class="lz-step">Read soil moisture (average of 5 samples)</div>
  <div class="lz-step">◇ moisture &lt; threshold ? — No → show "OK", wait 10 min, loop back</div>
  <div class="lz-step">Yes → relay ON, show "WATERING", run pump 5 s</div>
  <div class="lz-step">Relay OFF, log the event, wait 10 min, loop back</div>
</div>

<h3>Common mistakes in both drawings</h3>
<table>
  <thead><tr><th>Mistake</th><th>Fix</th></tr></thead>
  <tbody>
    <tr><td>Block diagram drawn as a wiring diagram</td><td>blocks are <em>roles</em>, not physical positions — Fritzing does the wiring picture</td></tr>
    <tr><td>Arrows with no direction or label</td><td>every arrow states what flows and over which interface</td></tr>
    <tr><td>A decision diamond with three exits</td><td>split into two diamonds</td></tr>
    <tr><td>Flowchart that shows every line of code</td><td>show decisions and actions, not syntax — one page maximum</td></tr>
    <tr><td>No end/loop-back arrow</td><td>an embedded flowchart almost always loops; show it explicitly</td></tr>
  </tbody>
</table>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Draw the state diagram too — it is the one that finds bugs.</b> A flowchart shows the happy path; a <em>state diagram</em> (from Lesson 4.3) shows every state your device can be in and every transition between them: IDLE → WATERING → COOLDOWN → IDLE. Drawing it forces the questions nobody asks until the demo fails: what happens if the button is pressed <em>while</em> watering? What if the sensor is unplugged mid-cycle? Each unanswered arrow on that diagram is a bug you have not hit yet. Fifteen minutes with a pen regularly saves an evening with a debugger.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>Hai bản vẽ giải thích trọn thiết bị</h2>
<p class="lead">Buổi 44 dành riêng cho sơ đồ khối và lưu đồ của đồ án cuối. Chúng không phải thủ tục giấy tờ: sơ đồ khối trả lời "cái gì nối với cái gì", lưu đồ trả lời "nó quyết định như thế nào". Giám khảo đọc chúng trước khi nhìn vào code của bạn.</p>

<h3>Sơ đồ khối — phần cứng</h3>
<p>Hộp cho linh kiện, mũi tên cho chiều dữ liệu hoặc nguồn chảy. Nhóm chúng theo vai trò, và ghi chú trên mỗi mũi tên là giao tiếp gì.</p>
<div class="lz-map">
  <div class="lz-stage">Đầu vào</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Cảm biến độ ẩm đất</div><div class="lz-nsub">— analog A0 →</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Nút nhấn (tưới tay)</div><div class="lz-nsub">— số D2 (ngắt) →</div></div></div>
  <div class="lz-stage">Xử lý</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Arduino UNO</div><div class="lz-nsub">logic ngưỡng · thiết lập trong EEPROM</div></div></div>
  <div class="lz-stage">Đầu ra</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Relay → máy bơm</div><div class="lz-nsub">← số D7 · nguồn 12V riêng</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">LCD 1602 I2C</div><div class="lz-nsub">← A4/A5 (SDA/SCL)</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">ESP8266 → cloud</div><div class="lz-nsub">← serial · WiFi</div></div></div>
</div>
<div class="note-ct">Để ý một sơ đồ khối tốt phơi bày ngay điều gì: chân nào đang dùng, nguồn thứ hai nằm ở đâu, và máy bơm được cách ly sau một relay. Đó đúng là ba thứ người chấm kiểm tra đầu tiên.</div>

<h3>Lưu đồ — phần mềm</h3>
<p>Các hình chuẩn, dùng cho đúng: bầu dục = bắt đầu/kết thúc, chữ nhật = hành động, <b>hình thoi = quyết định</b> (đúng hai lối ra có ghi nhãn), hình bình hành = vào/ra.</p>
<div class="lz-flow">
  <div class="lz-step">BẮT ĐẦU → khởi tạo chân, LCD, nạp ngưỡng từ EEPROM</div>
  <div class="lz-step">Đọc độ ẩm đất (trung bình 5 mẫu)</div>
  <div class="lz-step">◇ độ ẩm &lt; ngưỡng ? — Không → hiện "OK", chờ 10 phút, quay lại</div>
  <div class="lz-step">Có → bật relay, hiện "WATERING", chạy bơm 5 giây</div>
  <div class="lz-step">Tắt relay, ghi nhật ký sự kiện, chờ 10 phút, quay lại</div>
</div>

<h3>Lỗi hay gặp ở cả hai bản vẽ</h3>
<table>
  <thead><tr><th>Lỗi</th><th>Cách sửa</th></tr></thead>
  <tbody>
    <tr><td>Vẽ sơ đồ khối thành sơ đồ đấu dây</td><td>khối là <em>vai trò</em>, không phải vị trí vật lý — hình đấu dây để Fritzing lo</td></tr>
    <tr><td>Mũi tên không có chiều hoặc không ghi nhãn</td><td>mỗi mũi tên phải nói rõ cái gì chảy và qua giao tiếp nào</td></tr>
    <tr><td>Một hình thoi quyết định có ba lối ra</td><td>tách thành hai hình thoi</td></tr>
    <tr><td>Lưu đồ vẽ ra từng dòng code</td><td>thể hiện quyết định và hành động, không phải cú pháp — tối đa một trang</td></tr>
    <tr><td>Không có mũi tên kết thúc/quay vòng</td><td>lưu đồ nhúng gần như luôn lặp; hãy vẽ ra tường minh</td></tr>
  </tbody>
</table>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hãy vẽ thêm sơ đồ trạng thái — đó mới là cái tìm ra lỗi.</b> Lưu đồ thể hiện đường đi thuận lợi; một <em>sơ đồ trạng thái</em> (từ Bài 4.3) thể hiện mọi trạng thái thiết bị có thể ở và mọi phép chuyển giữa chúng: NGHỈ → ĐANG TƯỚI → CHỜ NGUỘI → NGHỈ. Vẽ nó ra là buộc phải trả lời những câu hỏi không ai đặt cho tới khi buổi demo hỏng: chuyện gì xảy ra nếu nút được bấm <em>trong lúc</em> đang tưới? Nếu cảm biến bị rút giữa chu kỳ thì sao? Mỗi mũi tên chưa trả lời được trên sơ đồ đó là một lỗi bạn chưa gặp. Mười lăm phút với cây bút thường xuyên cứu bạn khỏi một buổi tối với trình gỡ lỗi.</div>
</div>
`,
        },
        {
          title: '11.3 — Building, testing & defending your project|||11.3 — Dựng, kiểm thử & bảo vệ đồ án',
          slug: 'iot102-do-an-bao-ve',
          type: 'VIDEO',
          description: 'Buổi 46–47, 56–57 và bảo vệ cuối: cách kiểm thử, chuẩn bị demo chống hỏng, và trả lời câu hỏi giám khảo.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>Getting it built, and getting it marked</h2>
<p class="lead">The syllabus checks your project three times: on-going assessment at sessions 46–47 and 56–57, then the final presentation (30 minutes per group). Each is a chance to earn or lose marks, and each rewards different preparation.</p>

<h3>Build in this order</h3>
<div class="lz-flow">
  <div class="lz-step">1 · Test each component alone, with the example sketch</div>
  <div class="lz-step">2 · Combine two at a time (sensor + display), never all at once</div>
  <div class="lz-step">3 · Add the decision logic with fake values first (force "dry" in code)</div>
  <div class="lz-step">4 · Connect the real actuator last — it is the part that can break things</div>
  <div class="lz-step">5 · Run for an hour continuously before believing it works</div>
</div>
<div class="note-ct">Step 5 catches what a two-minute test never will: SRAM exhaustion, millis() drift, a servo browning out the board, a sensor that heats up. "It worked when I tested it" usually means "I tested it for ninety seconds".</div>

<h3>Test cases to write down (and show the examiner)</h3>
<table>
  <thead><tr><th>Case</th><th>Input</th><th>Expected</th></tr></thead>
  <tbody>
    <tr><td>Normal</td><td>moisture above threshold</td><td>display "OK", pump off</td></tr>
    <tr><td>Trigger</td><td>moisture below threshold</td><td>pump runs 5 s, display "WATERING"</td></tr>
    <tr><td>Boundary</td><td>moisture exactly at threshold</td><td>defined behaviour, no oscillation (hysteresis)</td></tr>
    <tr><td>Fault</td><td>sensor unplugged</td><td>reads 0 or 1023 → show "SENSOR ERROR", do NOT run the pump</td></tr>
    <tr><td>Recovery</td><td>power cut and restore</td><td>threshold restored from EEPROM, device resumes</td></tr>
  </tbody>
</table>
<div class="out">The fault and recovery rows are what separate a top-marked project from an average one. Anyone can demo the happy path; showing that you thought about the sensor falling out is engineering.</div>

<h3>Demo day: assume something will fail</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Bring a recorded video</b> of the device working. If the WiFi in the room is hostile, you still have proof.</div>
  <div class="lz-layer"><b>Bring spare parts</b> — jumper wires, a spare LED, a charged battery pack. Loose jumpers cause most demo failures.</div>
  <div class="lz-layer"><b>Have a manual trigger.</b> A button that forces the action means you do not have to genuinely dry out the soil in front of the room.</div>
  <div class="lz-layer"><b>Do not upload new code on demo day.</b> Freeze the working sketch the night before and keep a copy.</div>
</div>

<h3>Questions examiners actually ask</h3>
<div class="lz-stack">
  <div class="lz-layer">"Why did you choose this sensor over the alternative?" → Lessons 6.4 and 7.2 give you the comparison tables.</div>
  <div class="lz-layer">"What happens if the sensor fails?" → your fault test case.</div>
  <div class="lz-layer">"How is the pump powered? What protects the Arduino?" → separate supply, relay, shared GND, flyback diode (Lesson 3.2).</div>
  <div class="lz-layer">"How would you scale this to 100 devices?" → gateway pattern, MQTT, per-device credentials (Chapters 7 and 10).</div>
  <div class="lz-layer">"What would you do differently next time?" → an honest, specific answer scores better than "nothing".</div>
</div>

<div class="pitfall"><b>Trap:</b> a group where only one person can explain the code. Examiners often direct a question at the quietest member. Split ownership by subsystem, but make sure everyone can walk through the block diagram and the main loop.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Demo the failure on purpose.</b> The strongest move in a project defence is to unplug the sensor yourself and let the panel watch the device show "SENSOR ERROR" and refuse to run the pump. You have just proved a fault case live, controlled the narrative, and shown engineering maturity — instead of hoping nobody asks. Choose the failure you are proud of handling and make it part of the script.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>Dựng cho xong, và lấy được điểm</h2>
<p class="lead">Syllabus kiểm đồ án của bạn ba lần: chấm tiến độ ở buổi 46–47 và 56–57, rồi bảo vệ cuối (30 phút mỗi nhóm). Mỗi lần là một dịp được hoặc mất điểm, và mỗi lần thưởng cho một kiểu chuẩn bị khác nhau.</p>

<h3>Hãy dựng theo thứ tự này</h3>
<div class="lz-flow">
  <div class="lz-step">1 · Kiểm từng linh kiện một mình, bằng sketch ví dụ</div>
  <div class="lz-step">2 · Ghép mỗi lần hai cái (cảm biến + màn hình), đừng bao giờ ghép tất cả cùng lúc</div>
  <div class="lz-step">3 · Thêm logic quyết định với giá trị giả trước (ép "khô" ngay trong code)</div>
  <div class="lz-step">4 · Nối cơ cấu chấp hành thật sau cùng — đó là phần có thể làm hỏng đồ</div>
  <div class="lz-step">5 · Chạy liên tục một tiếng trước khi tin rằng nó hoạt động</div>
</div>
<div class="note-ct">Bước 5 tóm được thứ mà một phép thử hai phút không bao giờ tóm nổi: cạn SRAM, millis() trôi, một con servo làm sụt áp cả board, một cảm biến nóng lên. "Lúc em test thì chạy mà" thường có nghĩa là "em test chín mươi giây".</div>

<h3>Các ca kiểm thử nên viết ra giấy (và cho giám khảo xem)</h3>
<table>
  <thead><tr><th>Ca</th><th>Đầu vào</th><th>Kỳ vọng</th></tr></thead>
  <tbody>
    <tr><td>Bình thường</td><td>độ ẩm trên ngưỡng</td><td>hiện "OK", bơm tắt</td></tr>
    <tr><td>Kích hoạt</td><td>độ ẩm dưới ngưỡng</td><td>bơm chạy 5 giây, hiện "WATERING"</td></tr>
    <tr><td>Biên</td><td>độ ẩm đúng bằng ngưỡng</td><td>hành vi xác định, không dao động (nhờ dải trễ)</td></tr>
    <tr><td>Sự cố</td><td>rút cảm biến ra</td><td>đọc ra 0 hoặc 1023 → hiện "SENSOR ERROR", KHÔNG chạy bơm</td></tr>
    <tr><td>Phục hồi</td><td>mất điện rồi có lại</td><td>ngưỡng được khôi phục từ EEPROM, thiết bị chạy tiếp</td></tr>
  </tbody>
</table>
<div class="out">Hai hàng sự cố và phục hồi mới là thứ tách một đồ án điểm cao khỏi một đồ án trung bình. Ai cũng demo được đường đi thuận lợi; cho thấy bạn đã nghĩ tới chuyện cảm biến rơi ra mới là kỹ thuật.</div>

<h3>Ngày demo: hãy giả định sẽ có thứ gì đó hỏng</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Mang theo video đã quay</b> cảnh thiết bị chạy. Nếu WiFi trong phòng khó tính, bạn vẫn có bằng chứng.</div>
  <div class="lz-layer"><b>Mang linh kiện dự phòng</b> — dây jumper, một LED phòng hờ, một cục pin đã sạc. Dây jumper lỏng là nguyên nhân của phần lớn sự cố demo.</div>
  <div class="lz-layer"><b>Chuẩn bị một nút kích tay.</b> Một cái nút ép hành động xảy ra nghĩa là bạn không phải làm khô đất thật ngay trước cả phòng.</div>
  <div class="lz-layer"><b>Đừng nạp code mới vào ngày demo.</b> Hãy đóng băng bản sketch chạy được từ tối hôm trước và giữ một bản sao.</div>
</div>

<h3>Những câu giám khảo thực sự hỏi</h3>
<div class="lz-stack">
  <div class="lz-layer">"Vì sao em chọn cảm biến này thay vì cái kia?" → Bài 6.4 và 7.2 cho bạn sẵn các bảng so sánh.</div>
  <div class="lz-layer">"Nếu cảm biến hỏng thì sao?" → chính là ca kiểm thử sự cố của bạn.</div>
  <div class="lz-layer">"Máy bơm lấy nguồn ở đâu? Cái gì bảo vệ Arduino?" → nguồn riêng, relay, chung GND, điốt dập xung (Bài 3.2).</div>
  <div class="lz-layer">"Nếu nhân lên 100 thiết bị thì em làm thế nào?" → mẫu gateway, MQTT, thông tin đăng nhập riêng từng máy (Chương 7 và 10).</div>
  <div class="lz-layer">"Nếu làm lại em sẽ làm khác chỗ nào?" → một câu trả lời thành thật và cụ thể ăn điểm hơn hẳn "không có gì ạ".</div>
</div>

<div class="pitfall"><b>Bẫy:</b> một nhóm mà chỉ đúng một người giải thích được code. Giám khảo thường chĩa câu hỏi vào thành viên im lặng nhất. Hãy chia quyền sở hữu theo từng phân hệ, nhưng đảm bảo mọi người đều đi qua được sơ đồ khối và vòng lặp chính.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hãy cố ý demo cả tình huống hỏng.</b> Nước cờ mạnh nhất khi bảo vệ đồ án là tự tay bạn rút cảm biến ra và để hội đồng nhìn thiết bị hiện "SENSOR ERROR" rồi từ chối chạy bơm. Bạn vừa chứng minh trực tiếp một ca sự cố, làm chủ được câu chuyện, và cho thấy sự chín chắn kỹ thuật — thay vì hồi hộp mong không ai hỏi tới. Hãy chọn tình huống hỏng mà bạn tự hào vì đã xử lý được và đưa nó vào kịch bản trình bày.</div>
</div>
`,
        },
        {
          title: 'Quiz 4 — EEPROM, security & the project|||Quiz 4 — EEPROM, bảo mật & đồ án',
          slug: 'iot102-quiz-4',
          type: 'QUIZ',
          description: 'Kiểm tra chương 9–11: lưu trữ EEPROM, bảo mật IoT (CLO4), và quy trình đồ án.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'EEPROM on the ATmega328 tolerates roughly how many writes per cell?|||EEPROM trên ATmega328 chịu được khoảng bao nhiêu lần ghi mỗi ô?', options: ['1,000', '100,000', '10 million|||10 triệu', 'unlimited|||không giới hạn'], correctIndex: 1, points: 1 },
              { question: 'EEPROM.update() is preferred over write() because it…|||EEPROM.update() được ưu tiên hơn write() vì nó…', options: ['is faster to type|||gõ nhanh hơn', 'skips the write when the value is unchanged, saving wear|||bỏ qua lần ghi khi giá trị không đổi, đỡ hao mòn', 'writes two bytes|||ghi hai byte', 'works without the library|||chạy không cần thư viện'], correctIndex: 1, points: 1 },
              { question: 'The Mirai botnet succeeded mainly because devices…|||Botnet Mirai thành công chủ yếu vì các thiết bị…', options: ['used weak encryption|||dùng mã hoá yếu', 'kept factory default usernames and passwords|||giữ nguyên tên đăng nhập và mật khẩu mặc định', 'had no sensors|||không có cảm biến', 'ran on Arduino|||chạy Arduino'], correctIndex: 1, points: 1 },
              { question: 'An Arduino UNO cannot do TLS mainly because…|||Arduino UNO không làm được TLS chủ yếu vì…', options: ['it has no WiFi library|||không có thư viện WiFi', 'it has only 2 KB of SRAM|||nó chỉ có 2 KB SRAM', 'TLS is not free|||TLS không miễn phí', 'the IDE forbids it|||IDE cấm'], correctIndex: 1, points: 1 },
              { question: 'In a flowchart, a decision is drawn as a…|||Trong lưu đồ, một quyết định được vẽ bằng hình…', options: ['rectangle|||chữ nhật', 'diamond with two labelled exits|||thoi với hai lối ra có ghi nhãn', 'oval|||bầu dục', 'circle|||tròn'], correctIndex: 1, points: 1 },
              { question: 'The project is worth what share of the IOT102 grade?|||Đồ án chiếm bao nhiêu phần điểm IOT102?', options: ['20%', '50% (30% on-going + 20% final presentation)|||50% (30% chấm tiến độ + 20% bảo vệ cuối)', '10%', '100%'], correctIndex: 1, points: 1 },
              { question: 'Best practice when planning a project is to build… (beyond-syllabus)|||Thực hành tốt khi lập kế hoạch đồ án là dựng… (ngoài giáo trình)', options: ['the easiest part first|||phần dễ nhất trước', 'the riskiest part first, to de-risk early|||phần rủi ro nhất trước, để khử rủi ro sớm', 'the enclosure first|||vỏ hộp trước', 'everything at once|||tất cả cùng lúc'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ NÂNG CAO ══════════════════ */
    {
      title: 'Advanced — Beyond the syllabus|||Nâng cao — Ngoài giáo trình',
      description: 'Toàn bộ chương này là học thêm: ngắt (interrupt), bảo mật IoT, và cách dựng một project IoT hoàn chỉnh.',
      lessons: [
        {
          title: 'A.1 — Where to go next: ESP32, power & edge AI|||A.1 — Đi tiếp về đâu: ESP32, năng lượng & AI ở biên',
          slug: 'iot102-nang-cao',
          type: 'VIDEO',
          description: 'Nâng cấp lên ESP32/FreeRTOS, ngủ sâu để chạy pin nhiều năm, cập nhật OTA, và TinyML — bốn hướng đi sau môn học.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced · Lesson A.1</span>
<h2><span class="badge">★ Beyond the syllabus</span> Four doors out of this course</h2>
<p class="lead">You can now sense, act, communicate, store and secure. Everything in this lesson is optional — it is the map of where each of those skills leads if you keep going.</p>

<h3>1 · Move up to the ESP32</h3>
<p>The UNO taught you the constraints; the ESP32 removes most of them for roughly the same price. Same Arduino IDE, same <span class="badge">setup()/loop()</span>, but with WiFi and Bluetooth built in, 520 KB of RAM instead of 2 KB, a 12-bit ADC, hardware crypto for real TLS, and two CPU cores running <b>FreeRTOS</b> — so tasks can genuinely run in parallel rather than cooperatively (Lesson 8.1).</p>
<table>
  <thead><tr><th></th><th>Arduino UNO</th><th>ESP32</th></tr></thead>
  <tbody>
    <tr><td>RAM / Flash</td><td>2 KB / 32 KB</td><td>520 KB / 4 MB</td></tr>
    <tr><td>Radio</td><td>none</td><td>WiFi + BLE</td></tr>
    <tr><td>ADC</td><td>10-bit</td><td>12-bit</td></tr>
    <tr><td>TLS</td><td>impossible</td><td>built in</td></tr>
  </tbody>
</table>

<h3>2 · Power: sleep is a feature, not an absence</h3>
<p>An always-awake UNO draws ~45 mA and flattens a 2000 mAh battery in under two days. With deep sleep between readings the same device averages well under 1 mA and runs for months. The arithmetic your project report should contain:</p>
<div class="out"><b>Worked example:</b> wake for 2 s every 10 minutes at 40 mA, sleep the rest at 0.05 mA.<br>
Average = (40 × 2 + 0.05 × 598) / 600 ≈ <b>0.18 mA</b>.<br>
A 2000 mAh battery / 0.18 mA ≈ 11,000 hours ≈ <b>15 months</b>. The same hardware, one design decision apart.</div>

<h3>3 · OTA — updating a device you can no longer reach</h3>
<p>A sensor screwed to a wall four metres up cannot be re-flashed with a USB cable. <b>Over-the-air updates</b> let the device download new firmware over WiFi, verify a signature, write it to a spare flash partition and reboot into it — keeping the old version to roll back to if the new one fails to start. This is what makes the "no updates" security failure from Lesson 10.1 fixable, and it is standard on ESP32.</p>

<h3>4 · Edge AI (TinyML) — where IoT is heading</h3>
<p>Machine-learning models now run <em>on</em> microcontrollers: a few tens of kilobytes recognising a spoken keyword, an unusual vibration in a motor, or a person in a low-resolution image — without any cloud connection. It is the logical end of the edge-computing argument from Lesson 1.1: send a conclusion ("bearing failure likely"), not a data stream. Frameworks such as TensorFlow Lite for Microcontrollers make this reachable from exactly the skills you now have.</p>

<div class="note-ct">Notice the thread running through all four: each one is a constraint from this course being lifted — memory, energy, physical access, and the need for a cloud. Knowing <em>which</em> constraint is blocking you is the skill; the technology to lift it is a detail you can look up.</div>

<a class="link-card exphub" href="/exp-hub/iot102-cai-dat-arduino?ref=%2Fcourses%2Finternet-of-things%2Flearn&reflabel=IOT102%20%E2%80%94%20Internet%20of%20Things" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Prototype your project in Tinkercad</span><span class="lc-sub">Build &amp; simulate before touching hardware.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao · Bài A.1</span>
<h2><span class="badge">★ Ngoài giáo trình</span> Bốn cánh cửa đi ra khỏi môn học này</h2>
<p class="lead">Giờ bạn đã cảm nhận, tác động, truyền thông, lưu trữ và bảo vệ được. Mọi thứ trong bài này đều là tuỳ chọn — nó là tấm bản đồ chỉ ra từng kỹ năng đó dẫn tới đâu nếu bạn đi tiếp.</p>

<h3>1 · Nâng lên ESP32</h3>
<p>UNO dạy bạn các ràng buộc; ESP32 gỡ bỏ gần hết chúng với giá xấp xỉ như nhau. Vẫn Arduino IDE đó, vẫn <span class="badge">setup()/loop()</span> đó, nhưng có sẵn WiFi và Bluetooth, 520 KB RAM thay vì 2 KB, ADC 12 bit, mạch mật mã phần cứng cho TLS thật, và hai lõi CPU chạy <b>FreeRTOS</b> — nên các nhiệm vụ chạy song song thật sự chứ không chỉ hợp tác (Bài 8.1).</p>
<table>
  <thead><tr><th></th><th>Arduino UNO</th><th>ESP32</th></tr></thead>
  <tbody>
    <tr><td>RAM / Flash</td><td>2 KB / 32 KB</td><td>520 KB / 4 MB</td></tr>
    <tr><td>Sóng</td><td>không có</td><td>WiFi + BLE</td></tr>
    <tr><td>ADC</td><td>10 bit</td><td>12 bit</td></tr>
    <tr><td>TLS</td><td>bất khả</td><td>tích hợp sẵn</td></tr>
  </tbody>
</table>

<h3>2 · Năng lượng: ngủ là một tính năng, không phải sự vắng mặt</h3>
<p>Một UNO thức suốt hút ~45 mA và làm cạn viên pin 2000 mAh trong chưa đầy hai ngày. Với chế độ ngủ sâu giữa các lần đọc, cùng thiết bị đó trung bình dưới 1 mA rất xa và chạy được hàng tháng. Phép tính mà báo cáo đồ án của bạn nên có:</p>
<div class="out"><b>Ví dụ có lời giải:</b> thức 2 giây mỗi 10 phút ở 40 mA, thời gian còn lại ngủ ở 0,05 mA.<br>
Trung bình = (40 × 2 + 0,05 × 598) / 600 ≈ <b>0,18 mA</b>.<br>
Pin 2000 mAh / 0,18 mA ≈ 11.000 giờ ≈ <b>15 tháng</b>. Vẫn phần cứng đó, chỉ cách nhau một quyết định thiết kế.</div>

<h3>3 · OTA — cập nhật một thiết bị bạn không còn với tới</h3>
<p>Một cảm biến bắt vít trên tường cao bốn mét thì không nạp lại được bằng cáp USB. <b>Cập nhật qua sóng (OTA)</b> cho phép thiết bị tải firmware mới qua WiFi, kiểm chữ ký, ghi vào một phân vùng flash dự phòng rồi khởi động vào đó — vẫn giữ bản cũ để quay lui nếu bản mới không chạy nổi. Đây chính là thứ làm cho lỗi bảo mật "không có cập nhật" ở Bài 10.1 trở nên sửa được, và nó là chuyện tiêu chuẩn trên ESP32.</p>

<h3>4 · AI ở biên (TinyML) — nơi IoT đang tiến tới</h3>
<p>Các mô hình học máy giờ chạy được <em>ngay trên</em> vi điều khiển: vài chục kilobyte đủ để nhận ra một từ khoá được nói ra, một rung động bất thường trong động cơ, hay một bóng người trong ảnh độ phân giải thấp — không cần kết nối cloud nào. Đó là điểm cuối hợp logic của lập luận điện toán biên ở Bài 1.1: gửi đi một kết luận ("vòng bi nhiều khả năng sắp hỏng"), không phải một dòng dữ liệu. Các bộ khung như TensorFlow Lite for Microcontrollers khiến điều này trong tầm với từ đúng những kỹ năng bạn đang có.</p>

<div class="note-ct">Để ý sợi chỉ xuyên suốt cả bốn hướng: mỗi hướng là một ràng buộc của môn học này được gỡ bỏ — bộ nhớ, năng lượng, khả năng tiếp cận vật lý, và nhu cầu phải có cloud. Biết <em>ràng buộc nào</em> đang chặn mình mới là kỹ năng; công nghệ để gỡ nó chỉ là chi tiết bạn tra cứu được.</div>

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
    {
      "title": "Final Exam|||Thi cuối kỳ",
      "description": "Thi cuối kỳ gồm PE (thi thực hành) và FE (trắc nghiệm). Khung + câu mẫu; đề thật thêm sau khi có trang phòng thi.",
      "lessons": [
        {
          "title": "PE — Practical Exam|||PE — Thi thực hành",
          "slug": "iot102-final-exam-pe",
          "type": "article",
          "description": "Khung thi thực hành (PE) của môn — format, cách chấm và cách chuẩn bị. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · PE</span>\n<h2>PE — Practical Exam</h2>\n<p class=\"lead\">The Practical Exam (PE) is a <strong>hands-on coding exam</strong>: you are given a problem or feature and must write (and usually run) working code on the machine within a time limit. It is graded on correctness, whether it runs, and good practice.</p>\n<h3>How to prepare</h3>\n<ul>\n<li>Rebuild small features from a blank file, <em>without notes</em> &mdash; copying tutorials is not enough.</li>\n<li>Practise the core pattern of this subject end-to-end until you can do it from memory.</li>\n<li>Read the requirement twice; build the smallest working version first, then extend.</li>\n<li>Test as you go; a program that runs and does 80% beats one that does not compile.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> A real practical prompt bank for this subject will be added here later, in the exam room. Use the guidance above to prepare now.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · PE</span>\n<h2>PE — Thi thực hành</h2>\n<p class=\"lead\">Thi thực hành (PE) là <strong>thi code trực tiếp</strong>: bạn được giao một bài toán/tính năng và phải viết (thường là chạy) code hoạt động trên máy trong thời gian quy định. Chấm theo tính đúng, có chạy được không, và thực hành tốt.</p>\n<h3>Cách chuẩn bị</h3>\n<ul>\n<li>Dựng lại các tính năng nhỏ từ một file trống, <em>không nhìn ghi chú</em> &mdash; chép tutorial là chưa đủ.</li>\n<li>Luyện mẫu cốt lõi của môn đầu-cuối tới khi làm được từ trí nhớ.</li>\n<li>Đọc yêu cầu hai lần; dựng bản chạy được nhỏ nhất trước, rồi mở rộng.</li>\n<li>Test dọc đường; một chương trình chạy và làm được 80% hơn một chương trình không biên dịch nổi.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Ngân hàng đề thực hành thật cho môn này sẽ được thêm vào đây sau, trong trang phòng thi. Dùng hướng dẫn trên để chuẩn bị ngay từ giờ.</div>\n</div>"
        },
        {
          "title": "FE — Final Exam (Multiple Choice)|||FE — Thi trắc nghiệm cuối kỳ",
          "slug": "iot102-final-exam-fe",
          "type": "article",
          "description": "Khung thi trắc nghiệm cuối kỳ (FE) + vài câu mẫu từ môn. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · FE</span>\n<h2>FE — Final Exam (Multiple Choice)</h2>\n<p class=\"lead\">The Final Exam (FE) for this subject is a <strong>computer-graded multiple-choice test</strong>. For the exact number of questions, duration, weight and pass mark, see <em>Lesson 0.2 — Grading</em>.</p>\n<h3>How to do well</h3>\n<ul>\n<li>Pace yourself: divide time by the number of questions; flag hard ones and return at the end.</li>\n<li>Eliminate clearly wrong options first, then choose among the rest.</li>\n<li>For \"what should you do / which is best\" items, answer by this subject's method, not gut feeling.</li>\n<li>Never leave the gated final blank &mdash; an educated guess beats an empty answer.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> The questions below are <strong>sample questions</strong> drawn from this course to show the format. The <em>real past-exam questions</em> will be added here later, in the exam room.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · FE</span>\n<h2>FE — Thi trắc nghiệm cuối kỳ</h2>\n<p class=\"lead\">Bài thi cuối kỳ (FE) của môn này là <strong>thi trắc nghiệm, máy chấm</strong>. Số câu, thời gian, trọng số và điểm qua cụ thể: xem <em>Bài 0.2 — Thang điểm</em>.</p>\n<h3>Cách làm tốt</h3>\n<ul>\n<li>Phân bổ thời gian: chia đều theo số câu; đánh dấu câu khó, quay lại ở cuối.</li>\n<li>Loại phương án sai rõ ràng trước, rồi chọn trong số còn lại.</li>\n<li>Câu \"nên làm gì / cái nào tốt nhất\" &mdash; trả lời theo phương pháp của môn, không theo cảm tính.</li>\n<li>Đừng bao giờ bỏ trống bài thi có cổng &mdash; đoán có suy luận vẫn hơn để trống.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Các câu dưới đây là <strong>câu mẫu</strong> lấy từ chính môn học để minh hoạ format. <em>Đề thi thật</em> sẽ được thêm vào đây sau, trong trang phòng thi.</div>\n</div>",
          "quiz": {
            "timeLimitSeconds": 360,
            "questions": [
              {
                "id": "q1",
                "points": 1,
                "question": "In an Arduino sketch, code that runs once at power-on goes in…|||Trong sketch Arduino, code chạy một lần khi bật nguồn đặt ở…",
                "options": [
                  "loop()",
                  "setup()",
                  "main()",
                  "start()"
                ],
                "correctIndex": 1
              },
              {
                "id": "q2",
                "points": 1,
                "question": "Ohm's law states that…|||Định luật Ohm nói rằng…",
                "options": [
                  "V = I + R",
                  "V = I × R",
                  "V = I / R",
                  "V = R / I"
                ],
                "correctIndex": 1
              },
              {
                "id": "q3",
                "points": 1,
                "question": "An LED needs a series resistor because…|||LED cần một điện trở nối tiếp vì…",
                "options": [
                  "it makes it brighter|||làm nó sáng hơn",
                  "without it, too much current burns the LED out|||không có nó, dòng quá lớn đốt cháy LED",
                  "it stores data|||nó lưu dữ liệu",
                  "it is decorative|||để trang trí"
                ],
                "correctIndex": 1
              },
              {
                "id": "q4",
                "points": 1,
                "question": "A button pin that is connected to nothing when released will…|||Một chân nút không nối gì khi thả sẽ…",
                "options": [
                  "read a steady LOW|||đọc LOW ổn định",
                  "float and read random noise (needs a pull resistor)|||nổi và đọc nhiễu ngẫu nhiên (cần điện trở kéo)",
                  "break the Arduino|||làm hỏng Arduino",
                  "always read HIGH|||luôn đọc HIGH"
                ],
                "correctIndex": 1
              },
              {
                "id": "q5",
                "points": 1,
                "question": "The four-layer IoT architecture is device →|||Kiến trúc IoT bốn tầng là thiết bị →",
                "options": [
                  "application → network → processing",
                  "network → processing → application",
                  "processing → application → network",
                  "application → processing → network"
                ],
                "correctIndex": 1
              },
              {
                "id": "q6",
                "points": 1,
                "question": "Edge computing in IoT means… (beyond-syllabus)|||Điện toán biên trong IoT nghĩa là… (ngoài giáo trình)",
                "options": [
                  "sending all data to the cloud|||gửi mọi dữ liệu lên cloud",
                  "the device makes simple decisions locally to cut latency/bandwidth|||thiết bị tự ra quyết định đơn giản để giảm độ trễ/băng thông",
                  "using the newest chip|||dùng chip mới nhất",
                  "a type of sensor|||một loại cảm biến"
                ],
                "correctIndex": 1
              }
            ]
          }
        }
      ]
    },
  ],
};
