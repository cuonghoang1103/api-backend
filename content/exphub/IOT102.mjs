/**
 * Exp Hub guide for IOT102 — Arduino IDE + Tinkercad Circuits (Vietnamese).
 * Academy IOT102 links "Cài đặt / Tinkercad" cards to /exp-hub/iot102-cai-dat-arduino.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'iot102-cai-dat-arduino',
    title: 'IOT102 — Cài Arduino IDE + Tinkercad (mô phỏng)',
    kind: 'NOTE',
    language: 'cpp',
    status: 'PUBLISHED',
    description: 'Cài Arduino IDE để nạp code lên board, và dùng Tinkercad Circuits mô phỏng Arduino online miễn phí khi chưa có phần cứng — kèm link chính chủ.',
    referenceUrl: 'https://www.arduino.cc/en/software',
    codeBlocks: [
      {
        name: 'Blink — chương trình đầu tiên',
        language: 'cpp',
        code: `void setup() {
  pinMode(13, OUTPUT);   // LED tich hop tren board
}
void loop() {
  digitalWrite(13, HIGH); delay(1000);
  digitalWrite(13, LOW);  delay(1000);
}`,
      },
    ],
    noteContent: `
<span class="eyebrow">Hướng dẫn cài đặt · IOT102</span>
<h2>Cài môi trường IoT</h2>
<p class="lead">Bạn cần một phần mềm để viết & nạp code (<strong>Arduino IDE</strong>). Nếu <em>chưa có board</em>, dùng <strong>Tinkercad Circuits</strong> — mô phỏng Arduino online miễn phí, chạy được mọi lab ngay trong trình duyệt.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Có KIT</div><div class="lz-t">Arduino IDE</div><div class="lz-d">viết + nạp code lên board</div></div>
  <div class="lz-step"><div class="lz-k">Chưa có</div><div class="lz-t">Tinkercad</div><div class="lz-d">mô phỏng online</div></div>
</div>

<h3>🅐 Arduino IDE (khi có phần cứng)</h3>
<p>Tải Arduino IDE, cắm board UNO qua USB, chọn <b>Tools → Board → Arduino UNO</b> và đúng <b>Port</b>, rồi bấm Upload (mũi tên) để nạp Blink.</p>
<a class="link-card dl" href="https://www.arduino.cc/en/software" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Arduino IDE (chính chủ, miễn phí)</span><span class="lc-sub">arduino.cc/en/software · Windows/macOS/Linux</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<div class="pitfall">Không thấy Port? Thường thiếu driver USB-serial (CH340 với board giá rẻ). Cài driver CH340 và cắm lại. Chọn đúng Board + Port trước khi Upload.</div>

<h3>🅑 Tinkercad Circuits (khi chưa có phần cứng)</h3>
<p>Tinkercad của Autodesk cho bạn kéo-thả Arduino, breadboard, LED, cảm biến rồi <b>viết code và bấm "Start Simulation"</b> để chạy thật — không cần mua gì. Hoàn hảo để làm bài tập và prototype project.</p>
<a class="link-card dl" href="https://www.tinkercad.com/circuits" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">Tinkercad Circuits (mô phỏng online)</span><span class="lc-sub">tinkercad.com/circuits · miễn phí, chạy Arduino trong trình duyệt</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🅒 Vẽ mạch với Fritzing (tùy chọn)</h3>
<a class="link-card dl" href="https://fritzing.org/" target="_blank" rel="noopener">
  <span class="lc-ico">✏️</span>
  <span class="lc-body"><span class="lc-title">Fritzing (vẽ sơ đồ breadboard)</span><span class="lc-sub">fritzing.org · vẽ mạch đẹp cho báo cáo project</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<div class="note-ct">Bắt đầu ngay bằng Blink (khối code ở trên) trong Tinkercad: kéo một Arduino, dán code, bấm Start Simulation → đèn nhấp nháy. Đó là "Hello World" của phần cứng. Rồi thêm nút/cảm biến theo từng chương trong khóa học.</div>
`,
  },
};
