/**
 * MIC301 — Mixed-signal IC Design (Thiết kế IC tín hiệu hỗn hợp).
 * Ngành Thiết kế vi mạch bán dẫn, Kỳ 8, khung FPTU. Song ngữ EN+VI.
 * Giáo trình chuẩn (trích dẫn, KHÔNG upload PDF): Razavi "Principles of Data
 * Conversion System Design"; Maloberti "Data Converters"; Schreier/Temes
 * "Understanding Delta-Sigma Data Converters"; Johns/Martin "Analog IC Design".
 * Giữ NGUYÊN slug/semester/courseCode/thumbnailUrl. ⚠️ KHÔNG backtick/${ trong
 * chuỗi; HTML "&"->&amp;, "<"->&lt;; "\n"->\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('mic301-0-1-overview', 'Course overview: Mixed-signal IC design|||Tổng quan: Thiết kế IC tín hiệu hỗn hợp',
  'Analog gặp digital trên cùng một die; vai trò của ADC/DAC làm cầu nối; lộ trình 8 chương: lấy mẫu → S/H và tụ chuyển mạch → so sánh → DAC → ADC → delta-sigma → PLL → layout và kiểm chứng.',
  [[
    `<span class="eyebrow">MIC301 · Lesson 0.1 · Overview</span>
<h2>Mixed-signal IC design</h2>
<p class="lead">A <strong>mixed-signal IC</strong> puts <strong>analog</strong> and <strong>digital</strong> circuits on the <em>same chip</em>. The real world is continuous (sound, light, temperature, radio); computers are discrete. The blocks that bridge the two — <strong>ADCs</strong> (analog &amp; digital) and <strong>DACs</strong> — are the heart of this course.</p>
<h3>Why it matters</h3>
<p>Every phone, sensor, radio and data link contains a data converter. Its accuracy, speed and power set the ceiling for the whole system: a great DSP behind a poor ADC still delivers poor results.</p>
<h3>Roadmap (8 chapters)</h3>
<ol>
<li>Sampling &amp; quantization theory</li>
<li>Sample-and-hold &amp; switched-capacitor circuits</li>
<li>Comparators</li>
<li>Nyquist-rate DAC architectures</li>
<li>Nyquist-rate ADC — flash, SAR, pipeline</li>
<li>Delta-sigma modulators</li>
<li>PLL &amp; clock generation</li>
<li>Layout, noise coupling &amp; verification</li>
</ol>
<div class="callout"><span class="badge">Textbooks</span> Razavi (Data Conversion), Maloberti (Data Converters), Schreier &amp; Temes (Delta-Sigma), Johns &amp; Martin (Analog IC Design).</div>`,
    `<span class="eyebrow">MIC301 · Bài 0.1 · Tổng quan</span>
<h2>Thiết kế IC tín hiệu hỗn hợp</h2>
<p class="lead">Một <strong>IC tín hiệu hỗn hợp</strong> đặt mạch <strong>analog</strong> và <strong>digital</strong> trên <em>cùng một die</em>. Thế giới thực là liên tục (âm thanh, ánh sáng, nhiệt độ, sóng vô tuyến); máy tính thì rời rạc. Các khối nối hai thế giới đó — <strong>ADC</strong> (analog sang số) và <strong>DAC</strong> — là trọng tâm của môn này.</p>
<h3>Vì sao quan trọng</h3>
<p>Mọi điện thoại, cảm biến, radio và đường truyền dữ liệu đều chứa một bộ chuyển đổi dữ liệu. Độ chính xác, tốc độ và công suất của nó đặt trần cho cả hệ: một DSP giỏi phía sau một ADC kém vẫn cho kết quả kém.</p>
<h3>Lộ trình (8 chương)</h3>
<ol>
<li>Lý thuyết lấy mẫu &amp; lượng tử hoá</li>
<li>Mạch lấy-giữ &amp; tụ chuyển mạch</li>
<li>Mạch so sánh (comparator)</li>
<li>Kiến trúc DAC Nyquist</li>
<li>ADC Nyquist — flash, SAR, pipeline</li>
<li>Điều chế delta-sigma</li>
<li>PLL &amp; tạo xung nhịp</li>
<li>Layout, nhiễu ghép &amp; kiểm chứng</li>
</ol>
<div class="callout"><span class="badge">Giáo trình</span> Razavi (Data Conversion), Maloberti (Data Converters), Schreier &amp; Temes (Delta-Sigma), Johns &amp; Martin (Analog IC Design).</div>`,
  ]]);

const c1 = doc('mic301-1-1-sampling', '1.1 — Mixed-signal fundamentals & sampling theory|||1.1 — Nền tảng & lý thuyết lấy mẫu',
  'Lấy mẫu (Nyquist fs ≥ 2·fmax), aliasing, bộ lọc chống chồng phổ; lượng tử hoá, LSB, nhiễu lượng tử; SNR lý tưởng 6.02N + 1.76 dB; quá lấy mẫu.',
  [[
    `<span class="eyebrow">MIC301 · Chapter 1 · Lesson 1.1</span>
<h2>Mixed-signal fundamentals &amp; sampling theory</h2>
<h3>Sampling in time</h3>
<p>An ADC captures a continuous signal at discrete instants spaced by the <strong>sampling period</strong> T = 1/fs. The <strong>Nyquist theorem</strong> says you must sample at least twice the highest signal frequency, else high frequencies <strong>alias</strong> (fold) into the band and become indistinguishable from real signals. An <strong>anti-alias filter</strong> before the ADC removes energy above fs/2.</p>
<h3>Quantization in amplitude</h3>
<p>An N-bit converter maps the input to one of 2^N levels. The step size is the <strong>LSB</strong> = V_FS / 2^N. Rounding to the nearest level adds <strong>quantization noise</strong> spread uniformly over one LSB, giving an ideal signal-to-noise ratio that grows ~6 dB per bit.</p>
<pre><code>Ideal data-converter limits:
  LSB       = V_FS / 2^N
  SNR_max   = 6.02*N + 1.76   (dB, full-scale sine)
    N = 12  -&gt; ~74 dB
    N = 16  -&gt; ~98 dB
  Nyquist   : fs &gt;= 2 * f_max     (else aliasing)
  Oversample: fs &gt;&gt; 2 * f_max     (eases the anti-alias filter)
</code></pre>
<div class="callout"><span class="badge">Two axes</span> Sampling discretizes <em>time</em>; quantization discretizes <em>amplitude</em>. Every data converter trades off both, plus speed and power.</div>`,
    `<span class="eyebrow">MIC301 · Chương 1 · Bài 1.1</span>
<h2>Nền tảng &amp; lý thuyết lấy mẫu</h2>
<h3>Lấy mẫu theo thời gian</h3>
<p>ADC bắt tín hiệu liên tục tại các thời điểm rời rạc cách nhau một <strong>chu kỳ lấy mẫu</strong> T = 1/fs. <strong>Định lý Nyquist</strong> nói phải lấy mẫu ít nhất gấp đôi tần số cao nhất của tín hiệu, nếu không tần số cao sẽ <strong>chồng phổ (alias)</strong> gập vào dải và lẫn với tín hiệu thật. Một <strong>bộ lọc chống chồng phổ</strong> đặt trước ADC loại bỏ năng lượng trên fs/2.</p>
<h3>Lượng tử hoá theo biên độ</h3>
<p>Bộ chuyển đổi N bit ánh xạ ngõ vào về một trong 2^N mức. Bước lượng tử là <strong>LSB</strong> = V_FS / 2^N. Làm tròn về mức gần nhất thêm <strong>nhiễu lượng tử</strong> trải đều trong một LSB, cho tỉ số tín hiệu trên nhiễu lý tưởng tăng ~6 dB mỗi bit.</p>
<pre><code>Giới hạn lý tưởng của bộ chuyển đổi:
  LSB       = V_FS / 2^N
  SNR_max   = 6.02*N + 1.76   (dB, sin toàn thang)
    N = 12  -&gt; ~74 dB
    N = 16  -&gt; ~98 dB
  Nyquist   : fs &gt;= 2 * f_max     (không thì aliasing)
  Quá mẫu   : fs &gt;&gt; 2 * f_max     (giảm gánh cho bộ lọc chống chồng phổ)
</code></pre>
<div class="callout"><span class="badge">Hai trục</span> Lấy mẫu rời rạc hoá <em>thời gian</em>; lượng tử hoá rời rạc hoá <em>biên độ</em>. Mọi bộ chuyển đổi đều đánh đổi cả hai, cộng tốc độ và công suất.</div>`,
  ]]);

const c1q = quiz('mic301-quiz-1', 'Quiz 1 — Sampling & quantization|||Quiz 1 — Lấy mẫu & lượng tử', [
  { id: 'q1', question: 'Theo Nyquist, để không bị chồng phổ (aliasing), tần số lấy mẫu fs phải?', options: ['fs ≥ fmax', 'fs ≥ 2·fmax', 'fs = fmax/2', 'fs bất kỳ'], correctIndex: 1, explanation: 'Nyquist: fs ≥ 2·fmax; nếu không, tần số cao gập vào dải cơ bản.' },
  { id: 'q2', question: 'SNR lý tưởng của ADC N bit (sin toàn thang) xấp xỉ?', options: ['6.02·N + 1.76 dB', '3.01·N dB', '10·log(N) dB', '20·N dB'], correctIndex: 0, explanation: 'Nhiễu lượng tử trải đều trong 1 LSB cho SNR ≈ 6.02N + 1.76 dB, ~6 dB/bit.' },
  { id: 'q3', question: 'Bước lượng tử LSB của ADC N bit toàn thang V_FS là?', options: ['V_FS · 2^N', 'V_FS / N', 'V_FS / 2^N', '2^N / V_FS'], correctIndex: 2, explanation: 'N bit có 2^N mức nên mỗi bước LSB = V_FS / 2^N.' },
]);

const c2 = doc('mic301-2-1-sh-sc', '2.1 — Sample-and-hold & switched-capacitor circuits|||2.1 — Mạch lấy-giữ & tụ chuyển mạch',
  'Mạch lấy-giữ (track/hold); lỗi bơm điện tích, xuyên nhiễu xung nhịp; nhiễu kT/C; tụ chuyển mạch thay điện trở Req = 1/(fs·C); lấy mẫu bản đáy, CDS.',
  [[
    `<span class="eyebrow">MIC301 · Chapter 2 · Lesson 2.1</span>
<h2>Sample-and-hold &amp; switched-capacitor circuits</h2>
<h3>The sample-and-hold (S/H)</h3>
<p>A data converter needs a <em>frozen</em> input while it decides. A <strong>S/H</strong> tracks the input while a switch is closed, then holds the last value on a capacitor when the switch opens. Real switches inject error: <strong>charge injection</strong> and <strong>clock feedthrough</strong> shift the held voltage; <strong>bottom-plate sampling</strong> and dummy switches cancel much of it.</p>
<h3>The fundamental noise floor</h3>
<p>Sampling onto a capacitor traps thermal noise of variance <strong>kT/C</strong> — independent of the switch resistance. Want lower noise? Use a bigger C (at the cost of speed and area). This sets the smallest usable signal.</p>
<h3>Switched-capacitor (SC) technique</h3>
<p>Toggling a capacitor between two nodes at rate fs moves a packet of charge each cycle, <strong>emulating a resistor</strong>. This lets us build accurate integrators and filters whose time constants depend on <em>capacitor ratios</em> (well controlled in CMOS) and a clock — not on absolute R and C.</p>
<pre><code>Switched-cap resistor emulation:
  Charge per clock : Q   = C * (V1 - V2)
  Average current  : I   = Q * fs = C * fs * (V1 - V2)
  Equivalent R     : Req = 1 / (fs * C)
  Sampling noise   : v_n^2 = kT / C   (does NOT depend on switch R)
</code></pre>
<div class="callout"><span class="badge">Ratios, not absolutes</span> SC circuits are accurate because C1/C2 matches to ~0.1% on-chip, while an absolute R or C can be off by 20%.</div>`,
    `<span class="eyebrow">MIC301 · Chương 2 · Bài 2.1</span>
<h2>Mạch lấy-giữ &amp; tụ chuyển mạch</h2>
<h3>Mạch lấy-giữ (S/H)</h3>
<p>Bộ chuyển đổi cần ngõ vào <em>đứng yên</em> trong lúc phán quyết. <strong>S/H</strong> bám ngõ vào khi khoá đóng, rồi giữ giá trị cuối trên một tụ khi khoá mở. Khoá thật gây sai số: <strong>bơm điện tích</strong> và <strong>xuyên nhiễu xung nhịp</strong> làm lệch áp giữ; <strong>lấy mẫu bản đáy</strong> và khoá giả (dummy) khử phần lớn sai số này.</p>
<h3>Sàn nhiễu cơ bản</h3>
<p>Lấy mẫu lên một tụ nhốt lại nhiễu nhiệt phương sai <strong>kT/C</strong> — không phụ thuộc điện trở khoá. Muốn nhiễu thấp hơn? Dùng C lớn hơn (đổi lại chậm hơn và tốn diện tích). Đây là mức đặt tín hiệu nhỏ nhất dùng được.</p>
<h3>Kỹ thuật tụ chuyển mạch (SC)</h3>
<p>Đảo một tụ qua lại giữa hai nút với nhịp fs sẽ chuyển một gói điện tích mỗi chu kỳ, <strong>giả lập một điện trở</strong>. Nhờ đó ta dựng được bộ tích phân và bộ lọc chính xác, có hằng số thời gian phụ thuộc <em>tỉ số tụ</em> (kiểm soát tốt trong CMOS) và xung nhịp — chứ không phụ thuộc R, C tuyệt đối.</p>
<pre><code>Giả lập điện trở bằng tụ chuyển mạch:
  Điện tích/nhịp : Q   = C * (V1 - V2)
  Dòng trung bình: I   = Q * fs = C * fs * (V1 - V2)
  Trở tương đương: Req = 1 / (fs * C)
  Nhiễu lấy mẫu  : v_n^2 = kT / C   (KHÔNG phụ thuộc R khoá)
</code></pre>
<div class="callout"><span class="badge">Tỉ số, không phải tuyệt đối</span> Mạch SC chính xác vì C1/C2 khớp tới ~0.1% trên chip, trong khi R hay C tuyệt đối có thể lệch 20%.</div>`,
  ]]);

const c2q = quiz('mic301-quiz-2', 'Quiz 2 — S/H & switched-cap|||Quiz 2 — Lấy-giữ & tụ chuyển mạch', [
  { id: 'q1', question: 'Nhiễu lấy mẫu trên tụ C có phương sai bằng?', options: ['kT·C', 'kT/C', 'C/kT', 'k/(T·C)'], correctIndex: 1, explanation: 'Nhiễu nhiệt bị nhốt khi lấy mẫu có phương sai kT/C, không phụ thuộc điện trở khoá.' },
  { id: 'q2', question: 'Điện trở tương đương của tụ C chuyển mạch ở nhịp fs là?', options: ['fs·C', 'C/fs', '1/(fs·C)', 'fs/C'], correctIndex: 2, explanation: 'Mỗi nhịp chuyển Q = C·ΔV; dòng trung bình I = C·fs·ΔV nên Req = 1/(fs·C).' },
  { id: 'q3', question: 'Vì sao mạch tụ chuyển mạch chính xác trong CMOS?', options: ['Vì R tuyệt đối rất chuẩn', 'Vì phụ thuộc TỈ SỐ tụ (khớp tốt)', 'Vì không có nhiễu', 'Vì tụ tuyệt đối chuẩn 0.1%'], correctIndex: 1, explanation: 'Trên chip tỉ số tụ khớp ~0.1%, còn giá trị tuyệt đối R/C có thể lệch tới 20%.' },
]);

const c3 = doc('mic301-3-1-comparators', '3.1 — Comparators|||3.1 — Mạch so sánh',
  'Comparator quyết định Vin so Vref ra 1 bit; offset, trễ (hysteresis), kickback, siêu ổn định (metastability); kiến trúc tiền khuếch đại + latch tái tạo; đánh đổi độ phân giải/tốc độ/công suất.',
  [[
    `<span class="eyebrow">MIC301 · Chapter 3 · Lesson 3.1</span>
<h2>Comparators</h2>
<h3>The 1-bit decision</h3>
<p>A <strong>comparator</strong> outputs digital HIGH if its + input exceeds its - input, LOW otherwise. It is the ADC's atomic decision element: a flash ADC is a bank of them, a SAR ADC reuses one.</p>
<h3>The non-idealities that bite</h3>
<ul>
<li><strong>Offset</strong> — device mismatch makes the trip point drift from zero; large offset eats resolution.</li>
<li><strong>Hysteresis</strong> — deliberate memory to reject noise near the threshold.</li>
<li><strong>Kickback</strong> — the fast switching latch injects charge back into the input.</li>
<li><strong>Metastability</strong> — when inputs are almost equal, the latch may take too long to resolve, giving a wrong or late bit.</li>
</ul>
<h3>Preamp + regenerative latch</h3>
<p>A common structure is a low-gain <strong>preamplifier</strong> (reduces offset and kickback) driving a <strong>regenerative latch</strong> (positive feedback that snaps to a rail fast, at almost no static power).</p>
<pre><code>// Behavioral comparator (Verilog-A)
analog begin
  if (V(inp) - V(inn) &gt; voffset)
    V(out) &lt;+ vhigh;
  else
    V(out) &lt;+ vlow;
end
</code></pre>
<div class="callout"><span class="badge">Trade-off</span> Faster regeneration and lower offset both cost power and area — the comparator is where resolution meets speed.</div>`,
    `<span class="eyebrow">MIC301 · Chương 3 · Bài 3.1</span>
<h2>Mạch so sánh (comparator)</h2>
<h3>Quyết định 1 bit</h3>
<p>Một <strong>comparator</strong> cho ngõ ra số MỨC CAO nếu ngõ + lớn hơn ngõ -, ngược lại MỨC THẤP. Đây là phần tử quyết định nguyên tử của ADC: ADC flash là một dàn comparator, ADC SAR dùng lại một cái.</p>
<h3>Những khiếm khuyết gây hại</h3>
<ul>
<li><strong>Offset</strong> — sai lệch linh kiện làm điểm lật trôi khỏi 0; offset lớn ăn mất độ phân giải.</li>
<li><strong>Trễ (hysteresis)</strong> — cố ý thêm bộ nhớ để chống nhiễu quanh ngưỡng.</li>
<li><strong>Kickback</strong> — latch chuyển nhanh bơm điện tích ngược về ngõ vào.</li>
<li><strong>Siêu ổn định (metastability)</strong> — khi hai ngõ gần bằng nhau, latch có thể mất quá lâu để phân giải, cho bit sai hoặc trễ.</li>
</ul>
<h3>Tiền khuếch đại + latch tái tạo</h3>
<p>Cấu trúc phổ biến là một <strong>tiền khuếch đại</strong> độ lợi thấp (giảm offset và kickback) lái một <strong>latch tái tạo</strong> (hồi tiếp dương búng nhanh về mức nguồn, gần như không tốn công suất tĩnh).</p>
<pre><code>// Comparator hành vi (Verilog-A)
analog begin
  if (V(inp) - V(inn) &gt; voffset)
    V(out) &lt;+ vhigh;
  else
    V(out) &lt;+ vlow;
end
</code></pre>
<div class="callout"><span class="badge">Đánh đổi</span> Tái tạo nhanh hơn và offset thấp hơn đều tốn công suất và diện tích — comparator là chỗ độ phân giải gặp tốc độ.</div>`,
  ]]);

const c3q = quiz('mic301-quiz-3', 'Quiz 3 — Comparators|||Quiz 3 — Mạch so sánh', [
  { id: 'q1', question: 'Ngõ ra của comparator là?', options: ['Tín hiệu analog liên tục', '1 bit số (cao/thấp) tuỳ Vin so ngưỡng', 'Dòng điện tỉ lệ', 'Tần số'], correctIndex: 1, explanation: 'Comparator so hai ngõ vào và ra quyết định 1 bit số.' },
  { id: 'q2', question: 'Hiện tượng latch mất quá lâu để phân giải khi hai ngõ gần bằng nhau gọi là?', options: ['Offset', 'Kickback', 'Metastability (siêu ổn định)', 'Hysteresis'], correctIndex: 2, explanation: 'Khi chênh lệch quá nhỏ, latch tái tạo có thể không kịp búng dứt khoát → metastability.' },
  { id: 'q3', question: 'Vì sao thường đặt một tiền khuếch đại trước latch tái tạo?', options: ['Để tăng công suất tĩnh', 'Để giảm offset và kickback về ngõ vào', 'Để làm chậm quyết định', 'Để tạo nhiễu'], correctIndex: 1, explanation: 'Tiền khuếch đại cách ly ngõ vào khỏi kickback của latch và giảm ảnh hưởng offset.' },
]);

const c4 = doc('mic301-4-1-dac', '4.1 — Nyquist-rate DAC architectures|||4.1 — Kiến trúc DAC Nyquist',
  'DAC biến mã số thành analog; kiến trúc: nhị phân theo trọng số, thang R-2R, lái dòng (current-steering), mảng tụ; chỉ tiêu tĩnh INL/DNL, đơn điệu, năng lượng glitch; mã nhiệt kế.',
  [[
    `<span class="eyebrow">MIC301 · Chapter 4 · Lesson 4.1</span>
<h2>Nyquist-rate DAC architectures</h2>
<h3>Turning code into voltage</h3>
<p>A <strong>DAC</strong> maps a digital word to an analog level. Common architectures trade area, speed and matching:</p>
<ul>
<li><strong>Binary-weighted</strong> — one element per bit sized 1,2,4,8...; compact but hard to match at high resolution.</li>
<li><strong>R-2R ladder</strong> — uses only two resistor values, easy to match.</li>
<li><strong>Current-steering</strong> — steers weighted currents to the output; fastest, used in high-speed comms and video.</li>
<li><strong>Charge-scaling</strong> — a binary capacitor array; natural in CMOS SC design.</li>
</ul>
<h3>Static accuracy: DNL &amp; INL</h3>
<p><strong>DNL</strong> measures how much each step differs from an ideal LSB; <strong>INL</strong> is the accumulated deviation from the straight line. If DNL ever reaches -1 LSB the output stops increasing — the DAC becomes <strong>non-monotonic</strong>, fatal in a feedback loop.</p>
<pre><code>R-2R ladder, N bits:
  V_out = V_ref * sum( b_k / 2^(N-k) ),  b_k in {0,1}
  DNL(k) = (step_k - LSB) / LSB
  INL(k) = sum(DNL up to k)
  Monotonic  &lt;=&gt;  DNL &gt; -1 LSB for every code
</code></pre>
<div class="callout"><span class="badge">Thermometer coding</span> Decoding the MSBs into equal unit elements guarantees monotonicity and small DNL, at the cost of more elements and decode logic.</div>`,
    `<span class="eyebrow">MIC301 · Chương 4 · Bài 4.1</span>
<h2>Kiến trúc DAC Nyquist</h2>
<h3>Biến mã số thành điện áp</h3>
<p>Một <strong>DAC</strong> ánh xạ từ số thành mức analog. Các kiến trúc phổ biến đánh đổi diện tích, tốc độ và độ khớp:</p>
<ul>
<li><strong>Nhị phân theo trọng số</strong> — mỗi bit một phần tử cỡ 1,2,4,8...; gọn nhưng khó khớp ở độ phân giải cao.</li>
<li><strong>Thang R-2R</strong> — chỉ dùng hai giá trị điện trở, dễ khớp.</li>
<li><strong>Lái dòng (current-steering)</strong> — lái các dòng có trọng số ra ngõ ra; nhanh nhất, dùng trong truyền thông tốc độ cao và video.</li>
<li><strong>Mảng tụ (charge-scaling)</strong> — mảng tụ nhị phân; tự nhiên trong thiết kế SC CMOS.</li>
</ul>
<h3>Độ chính xác tĩnh: DNL &amp; INL</h3>
<p><strong>DNL</strong> đo mỗi bước lệch bao nhiêu so với 1 LSB lý tưởng; <strong>INL</strong> là độ lệch tích luỹ so với đường thẳng. Nếu DNL chạm -1 LSB thì ngõ ra ngừng tăng — DAC thành <strong>không đơn điệu</strong>, chí mạng khi nằm trong vòng hồi tiếp.</p>
<pre><code>Thang R-2R, N bit:
  V_out = V_ref * tổng( b_k / 2^(N-k) ),  b_k thuộc {0,1}
  DNL(k) = (bước_k - LSB) / LSB
  INL(k) = tổng DNL tới k
  Đơn điệu  &lt;=&gt;  DNL &gt; -1 LSB với mọi mã
</code></pre>
<div class="callout"><span class="badge">Mã nhiệt kế</span> Giải mã các MSB thành các phần tử đơn vị bằng nhau bảo đảm đơn điệu và DNL nhỏ, đổi lại nhiều phần tử và logic giải mã hơn.</div>`,
  ]]);

const c4q = quiz('mic301-quiz-4', 'Quiz 4 — DAC|||Quiz 4 — DAC', [
  { id: 'q1', question: 'Kiến trúc DAC nào nhanh nhất, hay dùng trong truyền thông tốc độ cao?', options: ['Nhị phân theo trọng số', 'Thang R-2R', 'Lái dòng (current-steering)', 'Mảng tụ'], correctIndex: 2, explanation: 'Current-steering lái các dòng ra ngõ ra, chuyển mức rất nhanh.' },
  { id: 'q2', question: 'DAC bị "không đơn điệu" khi?', options: ['INL = 0', 'DNL chạm -1 LSB (ngõ ra ngừng tăng)', 'SNR quá cao', 'Có mã nhiệt kế'], correctIndex: 1, explanation: 'DNL ≤ -1 LSB nghĩa là tăng mã mà ngõ ra không tăng → mất đơn điệu, nguy hiểm trong hồi tiếp.' },
  { id: 'q3', question: 'Ưu điểm chính của thang R-2R so với nhị phân theo trọng số là?', options: ['Chỉ cần hai giá trị điện trở, dễ khớp', 'Không cần điện trở nào', 'Luôn nhanh hơn', 'Không có INL'], correctIndex: 0, explanation: 'R-2R chỉ dùng hai giá trị R nên dễ khớp và chế tạo hơn dàn trọng số 1,2,4,8...' },
]);

const c5 = doc('mic301-5-1-adc', '5.1 — Nyquist-rate ADC: flash, SAR, pipeline|||5.1 — ADC Nyquist: flash, SAR, pipeline',
  'Flash (2^N−1 comparator, nhanh nhất, tốn diện tích/công suất); SAR (tìm nhị phân, 1 comparator + DAC, rất tiết kiệm điện); pipeline (nhiều tầng có khuếch đại phần dư, tốc độ + độ phân giải cao); bảng đánh đổi.',
  [[
    `<span class="eyebrow">MIC301 · Chapter 5 · Lesson 5.1</span>
<h2>Nyquist-rate ADC: flash, SAR, pipeline</h2>
<h3>Flash — the fastest</h3>
<p>A bank of 2^N-1 comparators compares the input to every reference level at once, giving a result in one clock. Blazing fast, but comparator count (and power/area) doubles per bit — practical only to ~6-8 bits.</p>
<h3>SAR — the efficient one</h3>
<p>A <strong>successive-approximation</strong> ADC does a binary search: one comparator, one DAC, one bit resolved per step. Slower than flash but tiny and extremely power-efficient — the default for medium-speed, 8-16 bit sensing.</p>
<pre><code>SAR binary search (N bits):
  code = 0
  for k = N-1 downto 0:
    code = code OR (1 shifted-left by k)   // try this bit = 1
    if Vin &lt; DAC(code):
      code = code AND NOT(1 shifted-left by k)  // too big -&gt; clear it
  return code
</code></pre>
<h3>Pipeline — speed AND resolution</h3>
<p>Each stage resolves a few bits, then amplifies the <strong>residue</strong> and passes it on, so stages work concurrently on different samples. High throughput at 10-14 bits, at the cost of latency and calibration.</p>
<pre><code>Rule of thumb:
  Flash    : &lt;= 6-8 bit, GHz-class, high power
  SAR      : 8-16 bit, low power, medium speed
  Pipeline : 10-14 bit, high speed, has latency
</code></pre>
<div class="callout"><span class="badge">No free lunch</span> Resolution, speed and power form a triangle; the architecture you pick is where you sit inside it.</div>`,
    `<span class="eyebrow">MIC301 · Chương 5 · Bài 5.1</span>
<h2>ADC Nyquist: flash, SAR, pipeline</h2>
<h3>Flash — nhanh nhất</h3>
<p>Một dàn 2^N-1 comparator so ngõ vào với mọi mức tham chiếu cùng lúc, cho kết quả trong một nhịp. Cực nhanh, nhưng số comparator (và công suất/diện tích) gấp đôi mỗi bit — chỉ thực tế tới ~6-8 bit.</p>
<h3>SAR — tiết kiệm điện</h3>
<p>ADC <strong>xấp xỉ liên tiếp</strong> làm tìm kiếm nhị phân: một comparator, một DAC, mỗi bước giải một bit. Chậm hơn flash nhưng rất nhỏ và cực tiết kiệm điện — lựa chọn mặc định cho đo lường 8-16 bit tốc độ vừa.</p>
<pre><code>Tìm nhị phân SAR (N bit):
  code = 0
  cho k = N-1 xuống 0:
    code = code HOẶC (1 dịch-trái k)    // thử đặt bit này = 1
    nếu Vin &lt; DAC(code):
      code = code VÀ ĐẢO(1 dịch-trái k)  // quá lớn -&gt; xoá bit
  trả về code
</code></pre>
<h3>Pipeline — vừa nhanh vừa phân giải cao</h3>
<p>Mỗi tầng giải vài bit rồi khuếch đại <strong>phần dư (residue)</strong> chuyển sang tầng sau, nên các tầng xử lý song song trên các mẫu khác nhau. Thông lượng cao ở 10-14 bit, đổi lại có độ trễ và cần hiệu chỉnh.</p>
<pre><code>Quy tắc chọn:
  Flash    : &lt;= 6-8 bit, cỡ GHz, tốn điện
  SAR      : 8-16 bit, ít điện, tốc độ vừa
  Pipeline : 10-14 bit, tốc độ cao, có độ trễ
</code></pre>
<div class="callout"><span class="badge">Không có bữa trưa miễn phí</span> Độ phân giải, tốc độ và công suất tạo thành một tam giác; kiến trúc bạn chọn là vị trí bạn ngồi trong đó.</div>`,
  ]]);

const c5q = quiz('mic301-quiz-5', 'Quiz 5 — Nyquist ADC|||Quiz 5 — ADC Nyquist', [
  { id: 'q1', question: 'ADC flash N bit cần bao nhiêu comparator?', options: ['N', '2·N', '2^N − 1', 'N^2'], correctIndex: 2, explanation: 'Flash so đồng thời với mọi mức nên cần 2^N − 1 comparator; số này gấp đôi mỗi bit.' },
  { id: 'q2', question: 'ADC SAR hoạt động theo nguyên lý?', options: ['So song song tất cả mức', 'Tìm kiếm nhị phân bằng 1 comparator + DAC', 'Lấy tích phân delta-sigma', 'Khuếch đại phần dư qua nhiều tầng'], correctIndex: 1, explanation: 'SAR giải từng bit từ MSB xuống bằng tìm nhị phân, dùng 1 comparator và 1 DAC.' },
  { id: 'q3', question: 'Đặc trưng của ADC pipeline là?', options: ['Không có độ trễ', 'Các tầng khuếch đại phần dư, xử lý song song, có latency', 'Chỉ 1 bit', 'Chậm nhất trong ba loại'], correctIndex: 1, explanation: 'Pipeline chia thành tầng, khuếch đại residue truyền tiếp; thông lượng cao nhưng có độ trễ.' },
]);

const c6 = doc('mic301-6-1-delta-sigma', '6.1 — Delta-Sigma modulators|||6.1 — Điều chế Delta-Sigma',
  'Quá lấy mẫu + định hình nhiễu; bộ tích phân + lượng tử 1 bit + hồi tiếp; NTF đẩy nhiễu lượng tử lên tần cao, bộ lọc trích mẫu loại đi; bậc L và OSR; đổi độ phân giải lấy tốc độ.',
  [[
    `<span class="eyebrow">MIC301 · Chapter 6 · Lesson 6.1</span>
<h2>Delta-Sigma modulators</h2>
<h3>Trade speed for resolution</h3>
<p>A <strong>delta-sigma (ΔΣ)</strong> converter samples far above Nyquist and uses a coarse (often 1-bit) quantizer inside a feedback loop. Two ideas combine: <strong>oversampling</strong> spreads quantization noise over a wide band, and <strong>noise shaping</strong> pushes most of that noise to high frequencies where a digital <strong>decimation filter</strong> removes it.</p>
<h3>The loop</h3>
<p>An integrator accumulates the error between input and the fed-back quantizer output; the loop forces the average output to track the input. The signal passes unchanged (STF ≈ 1) while quantization noise sees a high-pass <strong>noise transfer function (NTF)</strong>.</p>
<pre><code>% Delta-sigma SNR (MATLAB), L-th order, 1-bit
OSR = 128; L = 2;                       % oversample ratio, order
SNRdB = 6.02 + 1.76 ...                 % 1-bit quantizer base
      + (20*L + 10) * log10(OSR) ...    % noise-shaping gain
      - 10 * log10( pi^(2*L) / (2*L + 1) );
% Each doubling of OSR adds (6*L + 3) dB
%   L = 1 -&gt;  9 dB/octave,  L = 2 -&gt; 15 dB/octave
</code></pre>
<div class="callout"><span class="badge">Why it wins</span> A crude 1-bit quantizer plus a fast clock and heavy digital filtering buys 16-24 bit audio precision — trading transistor-level analog accuracy for cheap digital.</div>`,
    `<span class="eyebrow">MIC301 · Chương 6 · Bài 6.1</span>
<h2>Điều chế Delta-Sigma</h2>
<h3>Đổi tốc độ lấy độ phân giải</h3>
<p>Bộ chuyển đổi <strong>delta-sigma (ΔΣ)</strong> lấy mẫu cao hơn Nyquist rất nhiều và dùng bộ lượng tử thô (thường 1 bit) đặt trong vòng hồi tiếp. Hai ý tưởng kết hợp: <strong>quá lấy mẫu</strong> trải nhiễu lượng tử ra dải rộng, còn <strong>định hình nhiễu</strong> đẩy phần lớn nhiễu lên tần số cao để một <strong>bộ lọc trích mẫu (decimation)</strong> số loại đi.</p>
<h3>Vòng lặp</h3>
<p>Bộ tích phân cộng dồn sai số giữa ngõ vào và ngõ ra lượng tử hồi tiếp; vòng lặp ép giá trị trung bình ngõ ra bám ngõ vào. Tín hiệu đi qua gần như nguyên vẹn (STF ≈ 1) trong khi nhiễu lượng tử chịu một <strong>hàm truyền nhiễu (NTF)</strong> thông cao.</p>
<pre><code>% SNR delta-sigma (MATLAB), bậc L, lượng tử 1 bit
OSR = 128; L = 2;                       % tỉ số quá mẫu, bậc
SNRdB = 6.02 + 1.76 ...                 % nền lượng tử 1 bit
      + (20*L + 10) * log10(OSR) ...    % lợi ích định hình nhiễu
      - 10 * log10( pi^(2*L) / (2*L + 1) );
% Mỗi lần gấp đôi OSR thêm (6*L + 3) dB
%   L = 1 -&gt;  9 dB/octave,  L = 2 -&gt; 15 dB/octave
</code></pre>
<div class="callout"><span class="badge">Vì sao thắng</span> Một bộ lượng tử 1 bit thô cộng xung nhịp nhanh và lọc số mạnh mua được độ chính xác âm thanh 16-24 bit — đổi độ chính xác analog cấp transistor lấy phần số rẻ.</div>`,
  ]]);

const c6q = quiz('mic301-quiz-6', 'Quiz 6 — Delta-Sigma|||Quiz 6 — Delta-Sigma', [
  { id: 'q1', question: 'Hai cơ chế chính giúp ADC delta-sigma đạt độ phân giải cao là?', options: ['Flash + pipeline', 'Quá lấy mẫu + định hình nhiễu', 'R-2R + mã nhiệt kế', 'Hysteresis + kickback'], correctIndex: 1, explanation: 'Quá lấy mẫu trải nhiễu ra dải rộng; định hình nhiễu (NTF thông cao) đẩy nhiễu ra ngoài dải tín hiệu.' },
  { id: 'q2', question: 'Hàm truyền nhiễu (NTF) trong bộ điều chế delta-sigma có dạng?', options: ['Thông thấp với nhiễu', 'Thông cao với nhiễu (đẩy nhiễu lên tần cao)', 'Chặn mọi tần số', 'Bằng 1 ở mọi tần số'], correctIndex: 1, explanation: 'NTF thông cao đẩy năng lượng nhiễu lượng tử ra khỏi dải cơ bản để bộ lọc số loại bỏ.' },
  { id: 'q3', question: 'Tăng tỉ số quá lấy mẫu (OSR) hoặc bậc L của bộ điều chế sẽ?', options: ['Giảm SNR', 'Tăng SNR (đổi tốc độ lấy độ phân giải)', 'Không đổi gì', 'Làm mất tín hiệu'], correctIndex: 1, explanation: 'OSR và bậc cao hơn cho SNR cao hơn ((6L+3) dB mỗi octave OSR), đánh đổi bằng tốc độ.' },
]);

const c7 = doc('mic301-7-1-pll', '7.1 — PLL & clock generation|||7.1 — PLL & tạo xung nhịp',
  'PLL khoá pha ngõ ra theo tham chiếu; khối PFD, bơm điện tích, bộ lọc vòng, VCO, bộ chia /N; fout = N·fref; jitter, nhiễu pha, băng thông vòng; ứng dụng tổng hợp tần số, khôi phục xung nhịp.',
  [[
    `<span class="eyebrow">MIC301 · Chapter 7 · Lesson 7.1</span>
<h2>PLL &amp; clock generation</h2>
<h3>What a PLL does</h3>
<p>A <strong>phase-locked loop</strong> forces a local oscillator to track the phase and frequency of a reference. By putting a <strong>divide-by-N</strong> in the feedback, the output becomes a clean multiple of the reference — the standard way to synthesize high on-chip clocks from a cheap crystal.</p>
<h3>The building blocks</h3>
<ul>
<li><strong>PFD</strong> — phase/frequency detector: measures the timing error.</li>
<li><strong>Charge pump + loop filter</strong> — turns that error into a control voltage and sets loop dynamics.</li>
<li><strong>VCO</strong> — voltage-controlled oscillator: frequency follows the control voltage.</li>
<li><strong>Divider /N</strong> — closes the loop and sets the multiply factor.</li>
</ul>
<pre><code>PLL frequency relation:
  integer-N   : f_out = N * f_ref
  fractional-N: f_out = (N + F/M) * f_ref
  Loop bandwidth trade-off:
    wide   -&gt; fast lock, but tracks reference jitter
    narrow -&gt; filters reference noise, but slow lock &amp; more VCO noise
</code></pre>
<div class="callout"><span class="badge">Jitter</span> A PLL's job is a low-jitter clock: loop bandwidth is chosen where reference noise and VCO noise cross, minimizing total phase noise.</div>`,
    `<span class="eyebrow">MIC301 · Chương 7 · Bài 7.1</span>
<h2>PLL &amp; tạo xung nhịp</h2>
<h3>PLL làm gì</h3>
<p>Một <strong>vòng khoá pha (PLL)</strong> ép dao động cục bộ bám theo pha và tần số của tham chiếu. Đặt một <strong>bộ chia N</strong> trong nhánh hồi tiếp, ngõ ra thành một bội số sạch của tham chiếu — cách chuẩn để tổng hợp xung nhịp cao trên chip từ một thạch anh rẻ.</p>
<h3>Các khối</h3>
<ul>
<li><strong>PFD</strong> — bộ dò pha/tần số: đo sai số thời điểm.</li>
<li><strong>Bơm điện tích + bộ lọc vòng</strong> — biến sai số thành áp điều khiển và định động học vòng.</li>
<li><strong>VCO</strong> — dao động điều khiển bằng áp: tần số bám theo áp điều khiển.</li>
<li><strong>Bộ chia /N</strong> — khép vòng và đặt hệ số nhân.</li>
</ul>
<pre><code>Quan hệ tần số PLL:
  N nguyên    : f_out = N * f_ref
  N phân số   : f_out = (N + F/M) * f_ref
  Đánh đổi băng thông vòng:
    rộng -&gt; khoá nhanh, nhưng bám cả jitter tham chiếu
    hẹp  -&gt; lọc nhiễu tham chiếu, nhưng khoá chậm &amp; nhiều nhiễu VCO
</code></pre>
<div class="callout"><span class="badge">Jitter</span> Nhiệm vụ của PLL là xung nhịp ít jitter: băng thông vòng chọn ở chỗ nhiễu tham chiếu và nhiễu VCO cắt nhau, cho tổng nhiễu pha nhỏ nhất.</div>`,
  ]]);

const c7q = quiz('mic301-quiz-7', 'Quiz 7 — PLL|||Quiz 7 — PLL', [
  { id: 'q1', question: 'Với PLL chia nguyên N, tần số ngõ ra bằng?', options: ['f_ref / N', 'N · f_ref', 'f_ref − N', 'N + f_ref'], correctIndex: 1, explanation: 'Bộ chia /N trong hồi tiếp làm f_out = N·f_ref — bội số sạch của tham chiếu.' },
  { id: 'q2', question: 'Khối nào trong PLL có tần số bám theo điện áp điều khiển?', options: ['PFD', 'Bộ chia', 'VCO (dao động điều khiển bằng áp)', 'Bơm điện tích'], correctIndex: 2, explanation: 'VCO nhận áp điều khiển từ bộ lọc vòng và đổi tần số theo áp đó.' },
  { id: 'q3', question: 'Chọn băng thông vòng RỘNG cho PLL sẽ?', options: ['Khoá nhanh nhưng bám cả jitter tham chiếu', 'Khoá chậm và lọc nhiễu tham chiếu', 'Loại bỏ hoàn toàn nhiễu VCO', 'Không ảnh hưởng lock time'], correctIndex: 0, explanation: 'Băng thông rộng bám nhanh nhưng cho jitter tham chiếu lọt qua; băng hẹp lọc tham chiếu nhưng khoá chậm.' },
]);

const c8 = doc('mic301-8-1-layout-verification', '8.1 — Layout, noise coupling & mixed-signal verification|||8.1 — Layout, nhiễu ghép & kiểm chứng',
  'Analog và digital chung die → nhiễu nền, sụt nguồn; tách nguồn/đất, guard ring, deep n-well, đất hình sao, khớp linh kiện (common-centroid, dummy), tụ giảm nhiễu; kiểm chứng DRC/LVS/trích ký sinh/mô phỏng hậu layout/góc.',
  [[
    `<span class="eyebrow">MIC301 · Chapter 8 · Lesson 8.1</span>
<h2>Layout, noise coupling &amp; verification</h2>
<h3>The mixed-signal problem</h3>
<p>Fast digital switching dumps current spikes into the shared <strong>substrate</strong> and supply rails; a sensitive ADC nearby then sees this as noise. Good layout is what keeps the promised resolution in silicon.</p>
<h3>Isolation &amp; matching techniques</h3>
<ul>
<li><strong>Separate supplies/grounds</strong> — split AVDD/AGND from DVDD/DGND, tied at a single <strong>star</strong> point.</li>
<li><strong>Guard rings &amp; deep n-well</strong> — collect substrate current before it reaches analog nodes.</li>
<li><strong>Matching</strong> — <strong>common-centroid</strong> layout and <strong>dummy</strong> devices cancel gradients so ratios stay accurate.</li>
<li><strong>Decoupling caps</strong> — placed close to supply pins to absorb switching current.</li>
</ul>
<pre><code>Mixed-signal layout checklist:
  - split AVDD/AGND vs DVDD/DGND, single-point star tie
  - guard rings + deep n-well around sensitive analog
  - common-centroid + dummies for matched pairs
  - decoupling caps next to supply pins
Verification flow:
  DRC  -&gt; LVS  -&gt; RC extraction  -&gt; post-layout sim  -&gt; corners/Monte-Carlo
</code></pre>
<div class="callout"><span class="badge">Verify, do not assume</span> Schematic-level SNR means nothing until post-layout, extracted-parasitic simulation across process corners confirms it. Mixed-signal sim (real-number modeling) checks the analog-digital handshake.</div>`,
    `<span class="eyebrow">MIC301 · Chương 8 · Bài 8.1</span>
<h2>Layout, nhiễu ghép &amp; kiểm chứng</h2>
<h3>Bài toán tín hiệu hỗn hợp</h3>
<p>Chuyển mạch số nhanh bơm các xung dòng vào <strong>nền (substrate)</strong> và đường nguồn dùng chung; một ADC nhạy nằm gần đó sẽ thấy đây là nhiễu. Layout tốt là thứ giữ lại độ phân giải đã hứa khi lên silic.</p>
<h3>Kỹ thuật cách ly &amp; khớp</h3>
<ul>
<li><strong>Tách nguồn/đất</strong> — tách AVDD/AGND khỏi DVDD/DGND, nối tại một điểm <strong>hình sao</strong> duy nhất.</li>
<li><strong>Guard ring &amp; deep n-well</strong> — hứng dòng nền trước khi tới các nút analog.</li>
<li><strong>Khớp linh kiện</strong> — layout <strong>common-centroid</strong> và linh kiện <strong>giả (dummy)</strong> khử gradient để tỉ số giữ chính xác.</li>
<li><strong>Tụ giảm nhiễu</strong> — đặt sát chân nguồn để hấp thụ dòng chuyển mạch.</li>
</ul>
<pre><code>Danh mục kiểm layout tín hiệu hỗn hợp:
  - tách AVDD/AGND với DVDD/DGND, nối một điểm hình sao
  - guard ring + deep n-well quanh analog nhạy
  - common-centroid + dummy cho cặp cần khớp
  - tụ giảm nhiễu sát chân nguồn
Quy trình kiểm chứng:
  DRC  -&gt; LVS  -&gt; trích ký sinh  -&gt; mô phỏng hậu layout  -&gt; góc/Monte-Carlo
</code></pre>
<div class="callout"><span class="badge">Kiểm, đừng giả định</span> SNR ở mức sơ đồ chẳng có nghĩa gì cho tới khi mô phỏng hậu layout với ký sinh đã trích, chạy qua các góc quy trình xác nhận nó. Mô phỏng hỗn hợp (mô hình số thực) kiểm cái bắt tay analog-số.</div>`,
  ]]);

const c8q = quiz('mic301-quiz-8', 'Quiz 8 — Layout & verification|||Quiz 8 — Layout & kiểm chứng', [
  { id: 'q1', question: 'Vì sao mạch analog nhạy trên IC hỗn hợp dễ bị nhiễu?', options: ['Vì analog tự sinh nhiễu số', 'Vì chuyển mạch số bơm xung dòng vào nền/nguồn dùng chung', 'Vì thiếu comparator', 'Vì lấy mẫu quá chậm'], correctIndex: 1, explanation: 'Digital switching bơm nhiễu vào substrate và đường nguồn chung, ghép sang analog.' },
  { id: 'q2', question: 'Kỹ thuật layout nào giúp cặp linh kiện KHỚP tốt nhất?', options: ['Đặt xa nhau ngẫu nhiên', 'Common-centroid + dummy', 'Bỏ guard ring', 'Dùng dây nguồn dài'], correctIndex: 1, explanation: 'Common-centroid và dummy khử gradient quy trình/nhiệt nên tỉ số linh kiện giữ chính xác.' },
  { id: 'q3', question: 'Bước kiểm chứng nào so layout với sơ đồ để bảo đảm nối đúng?', options: ['DRC', 'LVS (Layout vs Schematic)', 'Trích ký sinh', 'Mô phỏng góc'], correctIndex: 1, explanation: 'LVS đối chiếu netlist rút từ layout với sơ đồ; DRC chỉ kiểm luật vẽ hình học.' },
]);

const taiLieu = doc('mic301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình chuẩn (Razavi, Maloberti, Schreier/Temes, Johns/Martin), slide FLM, công cụ mô phỏng (ngspice, Delta-Sigma Toolbox), YouTube, lộ trình tự học.',
  [[
    `<span class="eyebrow">MIC301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything for Mixed-signal IC Design — sampling, data converters, delta-sigma, PLLs and layout — in one place. The official slides live on <strong>FLM</strong>; the standard textbooks and free tools are below.</p>
<h3>📘 Standard textbooks</h3>
<ul>
<li>Behzad Razavi — <em>Principles of Data Conversion System Design</em> (Wiley/IEEE)</li>
<li>Franco Maloberti — <em>Data Converters</em> (Springer)</li>
<li>Schreier &amp; Temes — <em>Understanding Delta-Sigma Data Converters</em> (Wiley/IEEE)</li>
<li>Johns &amp; Martin — <em>Analog Integrated Circuit Design</em> (Wiley)</li>
</ul>
<h3>📗 FPTU slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for MIC301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>🛠️ Tools &amp; simulators</h3>
<ul>
<li><a href="https://ngspice.sourceforge.io/" target="_blank" rel="noopener">ngspice</a> — free open-source SPICE circuit simulator</li>
<li><a href="https://www.mathworks.com/matlabcentral/fileexchange/19-delta-sigma-toolbox" target="_blank" rel="noopener">Schreier Delta-Sigma Toolbox</a> — MATLAB modulator design/analysis</li>
<li><a href="https://www.falstad.com/circuit/" target="_blank" rel="noopener">Falstad Circuit Simulator</a> — animated circuit sim in the browser</li>
</ul>
<h3>🌐 Free reading</h3>
<ul>
<li><a href="https://www.allaboutcircuits.com/" target="_blank" rel="noopener">All About Circuits — ADC/DAC &amp; analog tutorials</a></li>
<li><a href="https://ocw.mit.edu/" target="_blank" rel="noopener">MIT OpenCourseWare</a> — analog &amp; mixed-signal courses</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ALLABOUTELECTRONICS" target="_blank" rel="noopener">ALL ABOUT ELECTRONICS</a> — sampling, ADC/DAC, PLL explained</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — sampling, aliasing, quantization, SNR = 6.02N + 1.76.</li>
<li><strong>Circuits</strong> — S/H, switched-capacitor, comparators (offset, latch).</li>
<li><strong>Converters</strong> — DAC (INL/DNL), flash/SAR/pipeline ADC, delta-sigma.</li>
<li><strong>System &amp; silicon</strong> — PLL/clocking, then layout, noise coupling &amp; post-layout verification.</li>
</ol></div>`,
    `<span class="eyebrow">MIC301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ cho Thiết kế IC tín hiệu hỗn hợp — lấy mẫu, bộ chuyển đổi dữ liệu, delta-sigma, PLL và layout — gom về một chỗ. Slide chính thức nằm trên <strong>FLM</strong>; giáo trình chuẩn và công cụ miễn phí ở bên dưới.</p>
<h3>📘 Giáo trình chuẩn</h3>
<ul>
<li>Behzad Razavi — <em>Principles of Data Conversion System Design</em> (Wiley/IEEE)</li>
<li>Franco Maloberti — <em>Data Converters</em> (Springer)</li>
<li>Schreier &amp; Temes — <em>Understanding Delta-Sigma Data Converters</em> (Wiley/IEEE)</li>
<li>Johns &amp; Martin — <em>Analog Integrated Circuit Design</em> (Wiley)</li>
</ul>
<h3>📗 Slide FPTU</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của MIC301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>🛠️ Công cụ &amp; mô phỏng</h3>
<ul>
<li><a href="https://ngspice.sourceforge.io/" target="_blank" rel="noopener">ngspice</a> — trình mô phỏng mạch SPICE mã nguồn mở miễn phí</li>
<li><a href="https://www.mathworks.com/matlabcentral/fileexchange/19-delta-sigma-toolbox" target="_blank" rel="noopener">Schreier Delta-Sigma Toolbox</a> — thiết kế/phân tích bộ điều chế trên MATLAB</li>
<li><a href="https://www.falstad.com/circuit/" target="_blank" rel="noopener">Falstad Circuit Simulator</a> — mô phỏng mạch động trên trình duyệt</li>
</ul>
<h3>🌐 Đọc miễn phí</h3>
<ul>
<li><a href="https://www.allaboutcircuits.com/" target="_blank" rel="noopener">All About Circuits — hướng dẫn ADC/DAC &amp; analog</a></li>
<li><a href="https://ocw.mit.edu/" target="_blank" rel="noopener">MIT OpenCourseWare</a> — các khoá analog &amp; mixed-signal</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ALLABOUTELECTRONICS" target="_blank" rel="noopener">ALL ABOUT ELECTRONICS</a> — giảng về lấy mẫu, ADC/DAC, PLL</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — lấy mẫu, aliasing, lượng tử hoá, SNR = 6.02N + 1.76.</li>
<li><strong>Mạch</strong> — S/H, tụ chuyển mạch, comparator (offset, latch).</li>
<li><strong>Bộ chuyển đổi</strong> — DAC (INL/DNL), ADC flash/SAR/pipeline, delta-sigma.</li>
<li><strong>Hệ thống &amp; silic</strong> — PLL/xung nhịp, rồi layout, nhiễu ghép &amp; kiểm chứng hậu layout.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'MIC301',
    slug: 'mic301-mixed-signal-ic-design',
    title: 'Mixed-signal IC Design',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MIC301.webp',
    shortDescription: 'Mixed-signal IC design — sampling & quantization, sample-and-hold & switched-capacitor circuits, comparators, Nyquist DAC/ADC (flash, SAR, pipeline), delta-sigma modulators, PLL & clocking, layout & noise coupling. Bilingual, with SPICE/Verilog-A examples & quizzes.|||Thiết kế IC tín hiệu hỗn hợp — lấy mẫu & lượng tử, S/H & tụ chuyển mạch, so sánh, DAC/ADC Nyquist (flash, SAR, pipeline), delta-sigma, PLL & xung nhịp, layout & nhiễu ghép. Song ngữ, ví dụ SPICE/Verilog-A & quiz.',
    description: 'Môn <strong>MIC301 — Mixed-signal IC Design</strong> (Thiết kế IC tín hiệu hỗn hợp, kỳ 8, ngành Thiết kế vi mạch bán dẫn) học cách nối thế giới analog với digital trên cùng một chip. Từ <strong>lý thuyết lấy mẫu &amp; lượng tử hoá</strong> → <strong>mạch lấy-giữ &amp; tụ chuyển mạch</strong> → <strong>comparator</strong> → <strong>DAC</strong> (INL/DNL) → <strong>ADC</strong> (flash, SAR, pipeline) → <strong>delta-sigma</strong> → <strong>PLL &amp; tạo xung nhịp</strong> → <strong>layout, nhiễu ghép &amp; kiểm chứng</strong>. Bám giáo trình chuẩn (Razavi, Maloberti, Schreier/Temes, Johns/Martin), song ngữ, có ví dụ SPICE/Verilog-A/MATLAB và quiz mỗi chương.',
    whatYouLearn: 'Lấy mẫu &amp; Nyquist, aliasing, lượng tử hoá, SNR = 6.02N + 1.76; mạch lấy-giữ, nhiễu kT/C, tụ chuyển mạch (Req = 1/fsC); comparator (offset, latch tái tạo, metastability); DAC (nhị phân, R-2R, current-steering, INL/DNL, đơn điệu); ADC flash/SAR/pipeline; điều chế delta-sigma (quá mẫu, định hình nhiễu, NTF, OSR); PLL (PFD, charge pump, VCO, chia N, jitter); layout tín hiệu hỗn hợp &amp; quy trình DRC/LVS/mô phỏng hậu layout.',
    requirements: 'Đã học mạch analog cơ bản (op-amp, transistor MOS), tín hiệu &amp; hệ thống, và CMOS cơ bản. Nên biết dùng một trình SPICE (ngspice) và MATLAB.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình chuẩn, slide FLM, công cụ mô phỏng, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Analog gặp digital; vai trò ADC/DAC; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Nền tảng & lấy mẫu|||Chapter 1 — Fundamentals & sampling', description: 'Nyquist, aliasing, lượng tử hoá, SNR.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Lấy-giữ & tụ chuyển mạch|||Chapter 2 — S/H & switched-cap', description: 'S/H, nhiễu kT/C, Req = 1/fsC.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Mạch so sánh|||Chapter 3 — Comparators', description: 'Offset, latch tái tạo, metastability.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Kiến trúc DAC|||Chapter 4 — DAC architectures', description: 'R-2R, current-steering, INL/DNL.', lessons: [c4, c4q] },
    { title: 'Chương 5 — ADC Nyquist|||Chapter 5 — Nyquist ADC', description: 'Flash, SAR, pipeline.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Delta-Sigma|||Chapter 6 — Delta-Sigma', description: 'Quá mẫu, định hình nhiễu, NTF, OSR.', lessons: [c6, c6q] },
    { title: 'Chương 7 — PLL & xung nhịp|||Chapter 7 — PLL & clocking', description: 'PFD, charge pump, VCO, chia N, jitter.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Layout & kiểm chứng|||Chapter 8 — Layout & verification', description: 'Nhiễu ghép, guard ring, DRC/LVS, hậu layout.', lessons: [c8, c8q] },
  ],
};
