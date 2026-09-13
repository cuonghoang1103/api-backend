/**
 * COS201 — Communication System / Hệ thống truyền thông (viễn thông).
 * Ngành Thiết kế vi mạch bán dẫn FPTU, Kỳ 5. Khung chất lượng — 8 chương.
 * Giáo trình chuẩn: Proakis & Salehi "Communication Systems Engineering";
 * Haykin "Communication Systems"; Lathi "Modern Digital and Analog
 * Communication Systems". Song ngữ VI+EN + công thức + ví dụ + quiz.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${ trong HTML; & → &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('cos201-0-1-overview', 'Course overview: Communication Systems|||Tổng quan: Hệ thống truyền thông',
  'Truyền thông làm gì; sơ đồ nguồn→phát→kênh→thu; analog vs số; lộ trình: tín hiệu & phổ → điều chế analog (AM/FM) → số hoá & điều chế số → nhiễu, dung lượng kênh & hệ hiện đại (4G/5G).',
  [[
    `<span class="eyebrow">COS201 · Lesson 0.1 · Overview</span>
<h2>Communication Systems</h2>
<p class="lead">This course explains <strong>how information travels from one place to another</strong> — the theory behind radio, phone networks, Wi-Fi and optical links. You will learn to describe <strong>signals</strong> in time and frequency, to <strong>modulate</strong> them onto a carrier, to <strong>digitize</strong> voice and data, and to reason about <strong>noise</strong>, <strong>bit errors</strong> and the ultimate <strong>capacity</strong> of a channel.</p>
<h3>The one picture behind everything</h3>
<pre><code>Source -> Transmitter -> Channel -> Receiver -> Destination
 (info)   (modulate)    (+ noise)   (demodulate)  (info out)
</code></pre>
<p>Every system in this course — AM radio, a 5G phone, a fibre link — is a special case of this same block diagram.</p>
<h3>Analog vs digital</h3>
<ul>
<li><strong>Analog</strong> — the message is a continuous waveform (AM/FM radio).</li>
<li><strong>Digital</strong> — the message is a stream of bits (Wi-Fi, 4G/5G, the internet). Digital wins on noise immunity, error correction and encryption.</li>
</ul>
<h3>Roadmap</h3>
<p>Signals &amp; spectra (Fourier) &rarr; amplitude modulation (AM/DSB/SSB) &rarr; angle modulation (FM/PM) &rarr; sampling &amp; PCM &rarr; digital modulation (ASK/FSK/PSK/QAM) &rarr; noise, SNR, BER &amp; Shannon capacity &rarr; multiplexing, spread spectrum and 4G/5G. Bilingual, with worked formulas and quizzes.</p>`,
    `<span class="eyebrow">COS201 · Bài 0.1 · Tổng quan</span>
<h2>Hệ thống truyền thông</h2>
<p class="lead">Môn này giải thích <strong>thông tin đi từ nơi này tới nơi khác thế nào</strong> — lý thuyết đằng sau radio, mạng điện thoại, Wi-Fi và cáp quang. Bạn sẽ học mô tả <strong>tín hiệu</strong> theo thời gian và tần số, <strong>điều chế</strong> nó lên sóng mang, <strong>số hoá</strong> tiếng nói và dữ liệu, và lập luận về <strong>nhiễu</strong>, <strong>lỗi bit</strong> và <strong>dung lượng</strong> tối đa của kênh.</p>
<h3>Một hình bao trùm tất cả</h3>
<pre><code>Nguồn -> Bộ phát -> Kênh -> Bộ thu -> Đích
 (tin)  (điều chế)  (+nhiễu) (giải đ.c.) (tin ra)
</code></pre>
<p>Mọi hệ trong môn này — radio AM, điện thoại 5G, cáp quang — đều là một trường hợp của cùng sơ đồ khối đó.</p>
<h3>Analog và số</h3>
<ul>
<li><strong>Analog</strong> — bản tin là sóng liên tục (radio AM/FM).</li>
<li><strong>Số (digital)</strong> — bản tin là dòng bit (Wi-Fi, 4G/5G, internet). Số thắng về khả năng chống nhiễu, sửa lỗi và mã hoá bảo mật.</li>
</ul>
<h3>Lộ trình</h3>
<p>Tín hiệu &amp; phổ (Fourier) &rarr; điều chế biên độ (AM/DSB/SSB) &rarr; điều chế góc (FM/PM) &rarr; lấy mẫu &amp; PCM &rarr; điều chế số (ASK/FSK/PSK/QAM) &rarr; nhiễu, SNR, BER &amp; dung lượng Shannon &rarr; ghép kênh, trải phổ và 4G/5G. Song ngữ, có công thức mẫu và quiz.</p>`,
  ]]);

const c1 = doc('cos201-1-1-system-overview', '1.1 — The communication system|||1.1 — Tổng quan hệ truyền thông',
  'Sơ đồ khối nguồn-phát-kênh-thu; vai trò từng khối; tín hiệu băng gốc vs băng thông (passband); băng thông và suy hao của kênh.',
  [[
    `<span class="eyebrow">COS201 · Chapter 1 · Lesson 1.1</span>
<h2>The communication system</h2>
<h3>The building blocks</h3>
<ul>
<li><strong>Source</strong> — produces the message (voice, image, data).</li>
<li><strong>Transmitter</strong> — turns the message into a signal fit for the channel: it may compress (source coding), protect (channel coding) and <strong>modulate</strong> onto a carrier.</li>
<li><strong>Channel</strong> — the physical medium (cable, air, fibre). It <strong>attenuates</strong>, <strong>distorts</strong> and adds <strong>noise</strong>.</li>
<li><strong>Receiver</strong> — reverses the transmitter: demodulate, decode, reconstruct.</li>
<li><strong>Destination</strong> — the end user.</li>
</ul>
<h3>Baseband vs passband</h3>
<p>A <strong>baseband</strong> signal keeps its original low frequencies (audio 0&ndash;4 kHz). To send it over the air we shift it up to a high <strong>carrier</strong> frequency (a <strong>passband</strong> signal) so it fits the channel and a practical antenna. <strong>Bandwidth</strong> is the span of frequencies a signal (or channel) occupies, in hertz.</p>
<pre><code>Key terms:
  Bandwidth B  = f_high - f_low     (Hz)  -> how much room the signal needs
  Carrier f_c                        (Hz)  -> where we place the signal
  Attenuation                        (dB)  -> how much the channel weakens it
</code></pre>
<div class="callout"><span class="badge">Why modulate at all</span> A 3 kHz voice would need a kilometres-long antenna and would collide with everyone else. Shifting it to a high, assigned carrier makes the antenna small and lets many users share the air.</div>`,
    `<span class="eyebrow">COS201 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan hệ truyền thông</h2>
<h3>Các khối dựng nên hệ</h3>
<ul>
<li><strong>Nguồn</strong> — sinh bản tin (tiếng nói, ảnh, dữ liệu).</li>
<li><strong>Bộ phát</strong> — biến bản tin thành tín hiệu hợp với kênh: có thể nén (mã nguồn), bảo vệ (mã kênh) và <strong>điều chế</strong> lên sóng mang.</li>
<li><strong>Kênh</strong> — môi trường vật lý (cáp, không khí, sợi quang). Nó <strong>suy hao</strong>, <strong>méo</strong> và thêm <strong>nhiễu</strong>.</li>
<li><strong>Bộ thu</strong> — làm ngược bộ phát: giải điều chế, giải mã, tái tạo.</li>
<li><strong>Đích</strong> — người dùng cuối.</li>
</ul>
<h3>Băng gốc và băng thông (passband)</h3>
<p>Tín hiệu <strong>băng gốc (baseband)</strong> giữ tần số thấp ban đầu (âm thanh 0&ndash;4 kHz). Để phát qua không khí ta dịch nó lên tần số <strong>sóng mang</strong> cao (tín hiệu <strong>passband</strong>) để vừa kênh và dùng được ăng-ten thực tế. <strong>Băng thông</strong> là dải tần một tín hiệu (hay kênh) chiếm, tính bằng hertz.</p>
<pre><code>Thuật ngữ chính:
  Băng thông B = f_cao - f_thap     (Hz)  -> tín hiệu cần bao nhiêu chỗ
  Sóng mang f_c                      (Hz)  -> đặt tín hiệu ở đâu
  Suy hao                            (dB)  -> kênh làm yếu đi bao nhiêu
</code></pre>
<div class="callout"><span class="badge">Vì sao phải điều chế</span> Một giọng nói 3 kHz cần ăng-ten dài hàng cây số và sẽ đè lên mọi người khác. Dịch nó lên một sóng mang cao được cấp phát khiến ăng-ten nhỏ lại và cho nhiều người dùng chia sẻ không khí.</div>`,
  ]]);

const c1q = quiz('cos201-quiz-1', 'Quiz 1 — System overview|||Quiz 1 — Tổng quan hệ',
  [
    { id: 'q1', question: 'Thứ tự đúng các khối của hệ truyền thông?|||Correct order of the blocks?', options: ['Nguồn → kênh → phát → thu', 'Nguồn → phát → kênh → thu → đích', 'Phát → nguồn → thu → kênh', 'Kênh → nguồn → phát → đích'], correctIndex: 1, explanation: 'Nguồn → bộ phát (điều chế) → kênh (+nhiễu) → bộ thu → đích.' },
    { id: 'q2', question: 'Vì sao phải điều chế bản tin lên sóng mang cao?|||Why modulate onto a high carrier?', options: ['Để ăng-ten nhỏ đi & nhiều người chia sẻ băng tần|||To shrink the antenna & let users share the band', 'Để tăng công suất nguồn|||To raise source power', 'Để xoá nhiễu hoàn toàn|||To remove all noise', 'Để nén dữ liệu|||To compress data'], correctIndex: 0, explanation: 'Dịch lên tần số cao khiến ăng-ten thực tế và cho phép ghép nhiều người dùng.' },
    { id: 'q3', question: 'Băng thông (bandwidth) của một tín hiệu là?|||A signal bandwidth is?', options: ['Công suất trung bình|||Its average power', 'Dải tần nó chiếm (f_cao − f_thấp)|||The frequency span it occupies', 'Tần số sóng mang|||The carrier frequency', 'Độ suy hao của kênh|||The channel attenuation'], correctIndex: 1, explanation: 'Băng thông = bề rộng dải tần tín hiệu chiếm, đo bằng Hz.' },
  ]);

const c2 = doc('cos201-2-1-signals-spectra', '2.1 — Signals & spectra|||2.1 — Tín hiệu & phổ tần',
  'Tín hiệu tuần hoàn/không tuần hoàn; biến đổi Fourier (miền thời gian ↔ miền tần số); phổ biên độ; năng lượng vs công suất; băng thông.',
  [[
    `<span class="eyebrow">COS201 · Chapter 2 · Lesson 2.1</span>
<h2>Signals &amp; spectra</h2>
<h3>Two views of the same signal</h3>
<p>A signal <code>s(t)</code> can be seen in the <strong>time domain</strong> (amplitude vs time, what an oscilloscope shows) or the <strong>frequency domain</strong> (which frequencies it contains, what a spectrum analyzer shows). The <strong>Fourier transform</strong> is the bridge between them.</p>
<pre><code>Time domain  s(t)   &lt;-- Fourier transform --&gt;   Frequency domain S(f)
 A pure tone  s(t) = A cos(2*pi*f_c*t)  -> a single spike at f = f_c
 A square wave                          -> f_c plus odd harmonics 3f, 5f, ...
</code></pre>
<h3>Why the spectrum matters</h3>
<p>The spectrum tells you the <strong>bandwidth</strong> the signal needs and whether it will fit the channel or clash with a neighbour. Sharp edges in time = high frequencies in the spectrum = wide bandwidth.</p>
<h3>Energy vs power</h3>
<ul>
<li><strong>Energy signals</strong> — finite total energy (a short pulse).</li>
<li><strong>Power signals</strong> — infinite energy but finite average <strong>power</strong> (a never-ending sine wave). We describe them by average power, not total energy.</li>
</ul>
<div class="callout"><span class="badge">The core idea</span> Any signal is a sum of sine waves. Communication engineering is largely about placing, shaping and separating those sine waves in frequency.</div>`,
    `<span class="eyebrow">COS201 · Chương 2 · Bài 2.1</span>
<h2>Tín hiệu &amp; phổ tần</h2>
<h3>Hai cách nhìn cùng một tín hiệu</h3>
<p>Một tín hiệu <code>s(t)</code> có thể nhìn ở <strong>miền thời gian</strong> (biên độ theo thời gian, thứ dao động ký hiện) hoặc <strong>miền tần số</strong> (nó chứa những tần số nào, thứ máy phân tích phổ hiện). <strong>Biến đổi Fourier</strong> là cây cầu giữa hai miền.</p>
<pre><code>Miền thời gian s(t)  &lt;-- biến đổi Fourier --&gt;  Miền tần số S(f)
 Một âm thuần   s(t) = A cos(2*pi*f_c*t)  -> một vạch tại f = f_c
 Một sóng vuông                          -> f_c cộng hài lẻ 3f, 5f, ...
</code></pre>
<h3>Vì sao phổ quan trọng</h3>
<p>Phổ cho biết <strong>băng thông</strong> tín hiệu cần và nó có vừa kênh hay đè lên hàng xóm không. Cạnh sắc trong thời gian = tần số cao trong phổ = băng thông rộng.</p>
<h3>Năng lượng và công suất</h3>
<ul>
<li><strong>Tín hiệu năng lượng</strong> — tổng năng lượng hữu hạn (một xung ngắn).</li>
<li><strong>Tín hiệu công suất</strong> — năng lượng vô hạn nhưng <strong>công suất</strong> trung bình hữu hạn (một sóng sin không dứt). Ta mô tả chúng bằng công suất trung bình, không phải tổng năng lượng.</li>
</ul>
<div class="callout"><span class="badge">Ý cốt lõi</span> Mọi tín hiệu là tổng các sóng sin. Kỹ thuật truyền thông phần lớn là đặt, tạo dạng và tách các sóng sin đó trong miền tần số.</div>`,
  ]]);

const c2q = quiz('cos201-quiz-2', 'Quiz 2 — Signals & spectra|||Quiz 2 — Tín hiệu & phổ',
  [
    { id: 'q1', question: 'Công cụ nối miền thời gian với miền tần số là?|||What links the time and frequency domains?', options: ['Định luật Ohm|||Ohm law', 'Biến đổi Fourier|||The Fourier transform', 'Định lý Nyquist|||The Nyquist theorem', 'Định luật Kirchhoff|||Kirchhoff law'], correctIndex: 1, explanation: 'Biến đổi Fourier chuyển s(t) ↔ S(f).' },
    { id: 'q2', question: 'Phổ của một âm sin thuần A·cos(2πf_c t) là?|||Spectrum of a pure tone?', options: ['Một vạch tại f = f_c|||A single spike at f = f_c', 'Một dải rộng vô hạn|||An infinitely wide band', 'Bằng 0 ở mọi tần số|||Zero everywhere', 'Nhiều hài lẻ|||Many odd harmonics'], correctIndex: 0, explanation: 'Âm thuần chỉ có một tần số → một vạch tại f_c.' },
    { id: 'q3', question: 'Cạnh càng sắc trong miền thời gian thì trong phổ nghĩa là?|||Sharper time-domain edges mean?', options: ['Băng thông hẹp hơn|||Narrower bandwidth', 'Tần số cao hơn, băng thông rộng hơn|||Higher frequencies, wider bandwidth', 'Công suất bằng 0|||Zero power', 'Không đổi phổ|||No change in spectrum'], correctIndex: 1, explanation: 'Chuyển biến nhanh cần các thành phần tần số cao → phổ rộng.' },
  ]);

const c3 = doc('cos201-3-1-amplitude-modulation', '3.1 — Amplitude modulation (AM)|||3.1 — Điều chế biên độ (AM)',
  'AM chuẩn (s(t) = [1 + m·x(t)]·cos), chỉ số điều chế m; DSB (nén sóng mang); SSB (một biên tần, tiết kiệm băng thông); điều chế/giải điều chế bao hình.',
  [[
    `<span class="eyebrow">COS201 · Chapter 3 · Lesson 3.1</span>
<h2>Amplitude modulation (AM)</h2>
<h3>The idea</h3>
<p>In <strong>AM</strong> the message rides on the <em>amplitude</em> (envelope) of a fixed carrier. The standard AM signal is:</p>
<pre><code>s(t) = [1 + m*x(t)] * A_c*cos(2*pi*f_c*t)
   x(t) = message (scaled to |x| &lt;= 1)
   m    = modulation index (0..1)
   f_c  = carrier frequency
Bandwidth of AM = 2 * B_message   (two sidebands around f_c)
</code></pre>
<p>If <code>m &gt; 1</code> the carrier is <strong>over-modulated</strong> and the envelope distorts — the receiver can no longer recover the message cleanly.</p>
<h3>Variants that save power or bandwidth</h3>
<ul>
<li><strong>DSB-SC</strong> (double sideband, suppressed carrier) — drops the wasteful carrier; more power-efficient but needs a coherent receiver.</li>
<li><strong>SSB</strong> (single sideband) — sends only <em>one</em> sideband, halving the bandwidth to <code>B_message</code>. Used where spectrum is precious (HF radio).</li>
</ul>
<h3>Demodulation</h3>
<p>Standard AM is decoded with a cheap <strong>envelope detector</strong> (diode + capacitor) — that low cost is exactly why broadcast AM radio uses it. DSB/SSB need a <strong>coherent</strong> (synchronous) detector.</p>
<div class="callout"><span class="badge">Trade-off</span> AM is simple &amp; cheap to receive but wastes power in the carrier; SSB is spectrum-efficient but needs a more complex receiver.</div>`,
    `<span class="eyebrow">COS201 · Chương 3 · Bài 3.1</span>
<h2>Điều chế biên độ (AM)</h2>
<h3>Ý tưởng</h3>
<p>Trong <strong>AM</strong> bản tin cưỡi trên <em>biên độ</em> (bao hình) của một sóng mang cố định. Tín hiệu AM chuẩn:</p>
<pre><code>s(t) = [1 + m*x(t)] * A_c*cos(2*pi*f_c*t)
   x(t) = bản tin (chuẩn hoá |x| &lt;= 1)
   m    = chỉ số điều chế (0..1)
   f_c  = tần số sóng mang
Băng thông AM = 2 * B_bản_tin   (hai biên tần quanh f_c)
</code></pre>
<p>Nếu <code>m &gt; 1</code> thì sóng mang bị <strong>quá điều chế</strong> và bao hình méo — bộ thu không còn khôi phục bản tin sạch được.</p>
<h3>Các biến thể tiết kiệm công suất hoặc băng thông</h3>
<ul>
<li><strong>DSB-SC</strong> (hai biên tần, nén sóng mang) — bỏ sóng mang lãng phí; hiệu quả công suất hơn nhưng cần bộ thu đồng bộ.</li>
<li><strong>SSB</strong> (đơn biên tần) — chỉ gửi <em>một</em> biên tần, giảm băng thông còn <code>B_bản_tin</code>. Dùng nơi phổ quý (radio HF).</li>
</ul>
<h3>Giải điều chế</h3>
<p>AM chuẩn được giải bằng <strong>bộ tách bao hình</strong> rẻ tiền (diode + tụ) — chính giá rẻ đó là lý do radio AM quảng bá dùng nó. DSB/SSB cần bộ tách <strong>đồng bộ (coherent)</strong>.</p>
<div class="callout"><span class="badge">Đánh đổi</span> AM đơn giản &amp; thu rẻ nhưng lãng phí công suất ở sóng mang; SSB tiết kiệm phổ nhưng cần bộ thu phức tạp hơn.</div>`,
  ]]);

const c3q = quiz('cos201-quiz-3', 'Quiz 3 — AM|||Quiz 3 — Điều chế biên độ',
  [
    { id: 'q1', question: 'Trong AM, bản tin nằm trên đại lượng nào của sóng mang?|||In AM the message rides on the carrier?', options: ['Tần số|||Frequency', 'Biên độ (bao hình)|||Amplitude (envelope)', 'Pha|||Phase', 'Băng thông|||Bandwidth'], correctIndex: 1, explanation: 'AM = điều chế biên độ; bản tin nằm trên bao hình.' },
    { id: 'q2', question: 'Chỉ số điều chế m > 1 gây ra?|||Modulation index m > 1 causes?', options: ['Tiết kiệm băng thông|||Saves bandwidth', 'Quá điều chế, méo bao hình|||Over-modulation, envelope distortion', 'Tăng SNR|||Higher SNR', 'Không có gì|||Nothing'], correctIndex: 1, explanation: 'm > 1 → quá điều chế, bao hình méo, thu không sạch.' },
    { id: 'q3', question: 'Kỹ thuật chỉ gửi MỘT biên tần để tiết kiệm băng thông?|||Which sends only one sideband?', options: ['DSB-SC', 'SSB (đơn biên tần)|||SSB (single sideband)', 'FM', 'PCM'], correctIndex: 1, explanation: 'SSB gửi một biên tần, băng thông còn một nửa (B_bản_tin).' },
  ]);

const c4 = doc('cos201-4-1-angle-modulation', '4.1 — Angle modulation (FM/PM)|||4.1 — Điều chế góc (FM/PM)',
  'FM (biến tần theo bản tin) và PM (biến pha); độ lệch tần Δf, chỉ số điều chế FM; băng thông theo quy tắc Carson; đánh đổi băng thông ↔ chống nhiễu.',
  [[
    `<span class="eyebrow">COS201 · Chapter 4 · Lesson 4.1</span>
<h2>Angle modulation (FM/PM)</h2>
<h3>The idea</h3>
<p>Instead of the amplitude, angle modulation varies the <strong>angle</strong> of the carrier — its instantaneous frequency (<strong>FM</strong>) or its phase (<strong>PM</strong>). The amplitude stays constant, which is why FM shrugs off amplitude noise so well.</p>
<pre><code>FM: the carrier frequency swings with the message
  f_inst(t) = f_c + delta_f * x(t)
  delta_f   = peak frequency deviation
  beta      = delta_f / f_m    (FM modulation index, f_m = top message freq)
</code></pre>
<h3>Carson bandwidth rule</h3>
<p>FM spreads energy over many sidebands, so it needs more bandwidth than AM. A good estimate is <strong>Carson rule</strong>:</p>
<pre><code>B_FM  ~=  2 * (delta_f + f_m)
Example: delta_f = 75 kHz, f_m = 15 kHz  ->  B ~= 2*(90) = 180 kHz
(this is why broadcast FM channels are 200 kHz wide)
</code></pre>
<h3>Why FM sounds better</h3>
<p>Because the information is in frequency, not amplitude, a receiver can <strong>limit</strong> (clip) the amplitude to strip off noise. FM trades <em>more bandwidth</em> for <em>better noise immunity</em> — the classic wideband-FM bargain.</p>
<div class="callout"><span class="badge">FM vs PM</span> They are close cousins: FM integrates the message before phase-shifting it. Both keep constant amplitude and resist amplitude noise.</div>`,
    `<span class="eyebrow">COS201 · Chương 4 · Bài 4.1</span>
<h2>Điều chế góc (FM/PM)</h2>
<h3>Ý tưởng</h3>
<p>Thay vì biên độ, điều chế góc biến đổi <strong>góc</strong> của sóng mang — tần số tức thời (<strong>FM</strong>) hoặc pha (<strong>PM</strong>). Biên độ giữ không đổi, chính vì thế FM chống nhiễu biên độ rất tốt.</p>
<pre><code>FM: tần số sóng mang dao động theo bản tin
  f_tucthoi(t) = f_c + delta_f * x(t)
  delta_f      = độ lệch tần đỉnh
  beta         = delta_f / f_m   (chỉ số điều chế FM, f_m = tần số tin cao nhất)
</code></pre>
<h3>Quy tắc băng thông Carson</h3>
<p>FM trải năng lượng lên nhiều biên tần nên cần băng thông rộng hơn AM. Ước lượng tốt là <strong>quy tắc Carson</strong>:</p>
<pre><code>B_FM  ~=  2 * (delta_f + f_m)
Ví dụ: delta_f = 75 kHz, f_m = 15 kHz  ->  B ~= 2*(90) = 180 kHz
(vì thế kênh FM quảng bá rộng 200 kHz)
</code></pre>
<h3>Vì sao FM nghe hay hơn</h3>
<p>Vì thông tin nằm ở tần số, không phải biên độ, bộ thu có thể <strong>giới hạn (limiter)</strong> biên độ để gạt nhiễu đi. FM đổi <em>băng thông rộng hơn</em> lấy <em>khả năng chống nhiễu tốt hơn</em> — món hời kinh điển của FM băng rộng.</p>
<div class="callout"><span class="badge">FM và PM</span> Hai anh em họ gần: FM tích phân bản tin trước khi dịch pha. Cả hai giữ biên độ không đổi và kháng nhiễu biên độ.</div>`,
  ]]);

const c4q = quiz('cos201-quiz-4', 'Quiz 4 — FM/PM|||Quiz 4 — Điều chế góc',
  [
    { id: 'q1', question: 'FM điều chế đại lượng nào của sóng mang?|||FM varies which carrier quantity?', options: ['Biên độ|||Amplitude', 'Tần số tức thời|||Instantaneous frequency', 'Băng thông|||Bandwidth', 'Công suất|||Power'], correctIndex: 1, explanation: 'FM = biến tần số theo bản tin; biên độ không đổi.' },
    { id: 'q2', question: 'Quy tắc Carson ước lượng băng thông FM là?|||Carson rule estimates FM bandwidth as?', options: ['B ≈ delta_f / f_m', 'B ≈ 2·(delta_f + f_m)', 'B ≈ f_m − delta_f', 'B ≈ f_c'], correctIndex: 1, explanation: 'B_FM ≈ 2·(độ lệch tần + tần số tin cao nhất).' },
    { id: 'q3', question: 'Ưu điểm chính FM đổi lấy bằng băng thông rộng hơn?|||FM trades wider bandwidth for?', options: ['Chống nhiễu (biên độ) tốt hơn|||Better (amplitude) noise immunity', 'Ăng-ten nhỏ hơn|||Smaller antenna', 'Bộ thu rẻ hơn|||Cheaper receiver', 'Ít công suất hơn|||Less power'], correctIndex: 0, explanation: 'Biên độ không mang tin nên có thể limiter gạt nhiễu → kháng nhiễu tốt.' },
  ]);

const c5 = doc('cos201-5-1-sampling-pcm', '5.1 — Digitization: sampling & PCM|||5.1 — Số hoá: lấy mẫu & PCM',
  'Định lý lấy mẫu Nyquist (f_s ≥ 2·f_max), aliasing; lượng tử hoá & nhiễu lượng tử; PCM (lấy mẫu→lượng tử→mã hoá); mã hoá nguồn/nén.',
  [[
    `<span class="eyebrow">COS201 · Chapter 5 · Lesson 5.1</span>
<h2>Digitization: sampling &amp; PCM</h2>
<h3>Sampling &mdash; the Nyquist theorem</h3>
<p>To turn a continuous signal into numbers we <strong>sample</strong> it. The Nyquist theorem says you must sample at least <em>twice</em> the highest frequency, or the signal is lost to <strong>aliasing</strong>:</p>
<pre><code>f_s &gt;= 2 * f_max        (Nyquist rate)
Telephone voice: f_max ~= 4 kHz  ->  f_s = 8 kHz (8000 samples/second)
</code></pre>
<h3>Quantization</h3>
<p>Each sample is rounded to the nearest of a finite set of levels. Rounding introduces <strong>quantization noise</strong>. More bits per sample = more levels = less noise:</p>
<pre><code>Levels L = 2^n     (n bits per sample)
SNR from quantization  ~=  6.02*n + 1.76   dB   (each extra bit ~ +6 dB)
</code></pre>
<h3>PCM &mdash; putting it together</h3>
<pre><code>PCM = Sample  ->  Quantize  ->  Encode (to bits)
Telephone PCM: 8000 samples/s * 8 bits = 64 kbit/s per voice channel
</code></pre>
<p><strong>Source coding</strong> (compression) then removes redundancy so the same voice or image needs fewer bits (MP3, JPEG, speech codecs).</p>
<div class="callout"><span class="badge">Aliasing warning</span> Sample too slowly and a high tone masquerades as a low one — irreversibly. Always band-limit (anti-alias filter) before sampling.</div>`,
    `<span class="eyebrow">COS201 · Chương 5 · Bài 5.1</span>
<h2>Số hoá: lấy mẫu &amp; PCM</h2>
<h3>Lấy mẫu &mdash; định lý Nyquist</h3>
<p>Để biến tín hiệu liên tục thành con số ta <strong>lấy mẫu</strong> nó. Định lý Nyquist nói phải lấy mẫu ít nhất <em>gấp đôi</em> tần số cao nhất, nếu không tín hiệu mất vì <strong>aliasing</strong>:</p>
<pre><code>f_s &gt;= 2 * f_max        (nhịp Nyquist)
Tiếng nói điện thoại: f_max ~= 4 kHz  ->  f_s = 8 kHz (8000 mẫu/giây)
</code></pre>
<h3>Lượng tử hoá</h3>
<p>Mỗi mẫu được làm tròn về mức gần nhất trong một tập hữu hạn mức. Làm tròn sinh <strong>nhiễu lượng tử</strong>. Nhiều bit/mẫu hơn = nhiều mức hơn = ít nhiễu hơn:</p>
<pre><code>Số mức L = 2^n     (n bit mỗi mẫu)
SNR do lượng tử  ~=  6.02*n + 1.76   dB   (mỗi bit thêm ~ +6 dB)
</code></pre>
<h3>PCM &mdash; ghép lại</h3>
<pre><code>PCM = Lấy mẫu  ->  Lượng tử  ->  Mã hoá (thành bit)
PCM điện thoại: 8000 mẫu/s * 8 bit = 64 kbit/s mỗi kênh thoại
</code></pre>
<p><strong>Mã hoá nguồn</strong> (nén) sau đó bỏ dư thừa để cùng giọng nói hay ảnh cần ít bit hơn (MP3, JPEG, codec thoại).</p>
<div class="callout"><span class="badge">Cảnh báo aliasing</span> Lấy mẫu quá chậm thì âm cao giả dạng âm thấp — không cứu được. Luôn giới hạn băng (lọc chống aliasing) trước khi lấy mẫu.</div>`,
  ]]);

const c5q = quiz('cos201-quiz-5', 'Quiz 5 — Sampling & PCM|||Quiz 5 — Lấy mẫu & PCM',
  [
    { id: 'q1', question: 'Định lý Nyquist yêu cầu nhịp lấy mẫu tối thiểu?|||Nyquist minimum sampling rate?', options: ['f_s ≥ f_max', 'f_s ≥ 2·f_max', 'f_s ≤ f_max/2', 'f_s = f_c'], correctIndex: 1, explanation: 'Phải lấy mẫu ít nhất gấp đôi tần số cao nhất, nếu không aliasing.' },
    { id: 'q2', question: 'Thêm 1 bit lượng tử làm SNR tăng khoảng?|||Each extra quantization bit adds about?', options: ['+1 dB', '+3 dB', '+6 dB', '+20 dB'], correctIndex: 2, explanation: 'SNR ≈ 6.02·n + 1.76 dB → mỗi bit ~ +6 dB.' },
    { id: 'q3', question: 'PCM gồm ba bước theo thứ tự?|||PCM three steps in order?', options: ['Mã hoá → lấy mẫu → lượng tử', 'Lấy mẫu → lượng tử → mã hoá', 'Lượng tử → mã hoá → lấy mẫu', 'Lấy mẫu → mã hoá → lượng tử'], correctIndex: 1, explanation: 'PCM = lấy mẫu → lượng tử hoá → mã hoá thành bit.' },
  ]);

const c6 = doc('cos201-6-1-digital-modulation', '6.1 — Digital modulation|||6.1 — Điều chế số',
  'ASK/FSK/PSK và QAM; chòm sao (constellation), số bit trên mỗi ký hiệu; quan hệ bit rate ↔ symbol rate; đánh đổi hiệu suất phổ ↔ chống nhiễu.',
  [[
    `<span class="eyebrow">COS201 · Chapter 6 · Lesson 6.1</span>
<h2>Digital modulation</h2>
<h3>Carrying bits on a carrier</h3>
<p>Digital modulation maps <strong>bits</strong> onto changes of the carrier:</p>
<ul>
<li><strong>ASK</strong> — amplitude shift keying (on/off is the simplest).</li>
<li><strong>FSK</strong> — frequency shift keying (two tones = bit 0/1).</li>
<li><strong>PSK</strong> — phase shift keying (bits change the phase; BPSK, QPSK).</li>
<li><strong>QAM</strong> — combines amplitude &amp; phase to pack many bits per symbol (16-QAM, 64-QAM, 256-QAM).</li>
</ul>
<h3>Constellation &amp; bits per symbol</h3>
<p>A <strong>constellation</strong> plots each symbol as a point (amplitude + phase). More points = more bits per symbol, but they sit closer together and are easier for noise to confuse.</p>
<pre><code>bits per symbol  k = log2(M)      (M = number of constellation points)
bit rate  R_b = k * R_symbol
Example: 64-QAM -> M=64 -> k=6 bits/symbol; at 1 Msymbol/s -> 6 Mbit/s
</code></pre>
<div class="callout"><span class="badge">The core trade-off</span> Denser constellations (256-QAM) give higher <strong>spectral efficiency</strong> (more bits/Hz) but need a <strong>higher SNR</strong>. Good links use 256-QAM; weak ones fall back to QPSK. This adaptive step is exactly how Wi-Fi and 4G/5G keep you connected as signal fades.</div>`,
    `<span class="eyebrow">COS201 · Chương 6 · Bài 6.1</span>
<h2>Điều chế số</h2>
<h3>Mang bit trên sóng mang</h3>
<p>Điều chế số ánh xạ <strong>bit</strong> lên các thay đổi của sóng mang:</p>
<ul>
<li><strong>ASK</strong> — dịch biên độ (bật/tắt là đơn giản nhất).</li>
<li><strong>FSK</strong> — dịch tần số (hai âm = bit 0/1).</li>
<li><strong>PSK</strong> — dịch pha (bit đổi pha; BPSK, QPSK).</li>
<li><strong>QAM</strong> — kết hợp biên độ &amp; pha để gói nhiều bit mỗi ký hiệu (16-QAM, 64-QAM, 256-QAM).</li>
</ul>
<h3>Chòm sao &amp; số bit mỗi ký hiệu</h3>
<p>Một <strong>chòm sao (constellation)</strong> vẽ mỗi ký hiệu thành một điểm (biên độ + pha). Càng nhiều điểm = càng nhiều bit mỗi ký hiệu, nhưng chúng ngồi sát nhau hơn và dễ bị nhiễu nhầm lẫn hơn.</p>
<pre><code>số bit mỗi ký hiệu  k = log2(M)      (M = số điểm chòm sao)
bit rate  R_b = k * R_symbol
Ví dụ: 64-QAM -> M=64 -> k=6 bit/ký hiệu; ở 1 Msymbol/s -> 6 Mbit/s
</code></pre>
<div class="callout"><span class="badge">Đánh đổi cốt lõi</span> Chòm sao dày (256-QAM) cho <strong>hiệu suất phổ</strong> cao hơn (nhiều bit/Hz) nhưng cần <strong>SNR cao hơn</strong>. Kênh tốt dùng 256-QAM; kênh yếu lùi về QPSK. Bước thích nghi này chính là cách Wi-Fi và 4G/5G giữ kết nối khi sóng yếu đi.</div>`,
  ]]);

const c6q = quiz('cos201-quiz-6', 'Quiz 6 — Digital modulation|||Quiz 6 — Điều chế số',
  [
    { id: 'q1', question: 'Kỹ thuật kết hợp CẢ biên độ và pha để gói nhiều bit/ký hiệu?|||Which combines amplitude AND phase?', options: ['ASK', 'FSK', 'QAM', 'BPSK'], correctIndex: 2, explanation: 'QAM dùng cả biên độ lẫn pha → 16/64/256-QAM.' },
    { id: 'q2', question: 'Với 64-QAM, số bit trên mỗi ký hiệu là?|||Bits per symbol for 64-QAM?', options: ['3', '6', '8', '64'], correctIndex: 1, explanation: 'k = log2(64) = 6 bit/ký hiệu.' },
    { id: 'q3', question: 'Chòm sao càng dày (256-QAM) thì cần?|||A denser constellation needs?', options: ['SNR cao hơn|||A higher SNR', 'Băng thông rộng hơn nhiều|||Much wider bandwidth', 'Công suất bằng 0|||Zero power', 'Ít bit/Hz hơn|||Fewer bits/Hz'], correctIndex: 0, explanation: 'Điểm sát nhau hơn → dễ nhầm → cần SNR cao hơn để tách đúng.' },
  ]);

const c7 = doc('cos201-7-1-noise-performance', '7.1 — Noise & performance|||7.1 — Nhiễu & hiệu năng',
  'Nhiễu (nhiệt/AWGN); tỉ số tín/tạp SNR (dB); tỉ lệ lỗi bit BER và quan hệ với SNR; dung lượng kênh Shannon C = B·log2(1+SNR).',
  [[
    `<span class="eyebrow">COS201 · Chapter 7 · Lesson 7.1</span>
<h2>Noise &amp; performance</h2>
<h3>Noise</h3>
<p>Every channel adds random <strong>noise</strong>. The most common model is <strong>AWGN</strong> (additive white Gaussian noise), the thermal hiss present in all electronics. Noise sets the floor on how weak a signal we can still read.</p>
<h3>SNR &mdash; signal-to-noise ratio</h3>
<pre><code>SNR = signal power / noise power
SNR(dB) = 10 * log10(signal / noise)
Example: signal 1 mW, noise 0.01 mW  ->  SNR = 100 = 20 dB
</code></pre>
<h3>BER &mdash; bit error rate</h3>
<p>For a digital link, quality is the <strong>bit error rate</strong>: the fraction of bits received wrong. Higher SNR &rarr; lower BER. A BER of 10^-6 means one wrong bit per million.</p>
<h3>Shannon capacity &mdash; the ceiling</h3>
<p>Shannon proved a hard limit on error-free bits/second for a channel of bandwidth B and a given SNR:</p>
<pre><code>C = B * log2(1 + SNR)      bits/second
Example: B = 20 MHz, SNR = 1000 (30 dB)
  C = 20e6 * log2(1001) ~= 20e6 * 9.97 ~= 199 Mbit/s
</code></pre>
<div class="callout"><span class="badge">The law you cannot beat</span> No coding scheme, however clever, sends error-free data faster than Shannon C. Real systems (4G/5G) chase C with strong error-correcting codes (turbo, LDPC) and adaptive modulation.</div>`,
    `<span class="eyebrow">COS201 · Chương 7 · Bài 7.1</span>
<h2>Nhiễu &amp; hiệu năng</h2>
<h3>Nhiễu</h3>
<p>Mọi kênh đều thêm <strong>nhiễu</strong> ngẫu nhiên. Mô hình phổ biến nhất là <strong>AWGN</strong> (nhiễu Gauss trắng cộng), tiếng rít nhiệt có trong mọi mạch điện tử. Nhiễu đặt sàn cho việc ta còn đọc được tín hiệu yếu tới đâu.</p>
<h3>SNR &mdash; tỉ số tín hiệu trên tạp</h3>
<pre><code>SNR = công suất tín hiệu / công suất nhiễu
SNR(dB) = 10 * log10(tín hiệu / nhiễu)
Ví dụ: tín hiệu 1 mW, nhiễu 0.01 mW  ->  SNR = 100 = 20 dB
</code></pre>
<h3>BER &mdash; tỉ lệ lỗi bit</h3>
<p>Với kênh số, chất lượng là <strong>tỉ lệ lỗi bit</strong>: tỉ phần bit thu sai. SNR cao hơn &rarr; BER thấp hơn. BER 10^-6 nghĩa là một bit sai trên một triệu.</p>
<h3>Dung lượng Shannon &mdash; trần tối đa</h3>
<p>Shannon chứng minh một giới hạn cứng cho số bit/giây không lỗi của kênh băng thông B và SNR cho trước:</p>
<pre><code>C = B * log2(1 + SNR)      bit/giây
Ví dụ: B = 20 MHz, SNR = 1000 (30 dB)
  C = 20e6 * log2(1001) ~= 20e6 * 9.97 ~= 199 Mbit/s
</code></pre>
<div class="callout"><span class="badge">Luật không thể phá</span> Không sơ đồ mã hoá nào, dù khôn tới đâu, gửi dữ liệu không lỗi nhanh hơn C của Shannon. Hệ thực (4G/5G) đuổi theo C bằng mã sửa lỗi mạnh (turbo, LDPC) và điều chế thích nghi.</div>`,
  ]]);

const c7q = quiz('cos201-quiz-7', 'Quiz 7 — Noise & capacity|||Quiz 7 — Nhiễu & dung lượng',
  [
    { id: 'q1', question: 'Dung lượng kênh Shannon được cho bởi?|||Shannon channel capacity is?', options: ['C = B + SNR', 'C = B · log2(1 + SNR)', 'C = 2·B·SNR', 'C = SNR / B'], correctIndex: 1, explanation: 'C = B·log2(1+SNR) bit/giây — trần không lỗi của kênh.' },
    { id: 'q2', question: 'BER (tỉ lệ lỗi bit) thay đổi thế nào khi SNR tăng?|||How does BER change as SNR rises?', options: ['BER tăng|||BER rises', 'BER giảm|||BER falls', 'BER không đổi|||BER unchanged', 'BER = SNR'], correctIndex: 1, explanation: 'SNR cao hơn → ít bit sai hơn → BER thấp hơn.' },
    { id: 'q3', question: 'AWGN là mô hình của?|||AWGN models?', options: ['Suy hao đường truyền|||Path loss', 'Nhiễu nhiệt Gauss trắng cộng|||Additive white Gaussian thermal noise', 'Sóng mang|||The carrier', 'Aliasing khi lấy mẫu|||Sampling aliasing'], correctIndex: 1, explanation: 'AWGN = nhiễu Gauss trắng cộng, tiếng rít nhiệt của mạch.' },
  ]);

const c8 = doc('cos201-8-1-modern-systems', '8.1 — Modern communication systems|||8.1 — Hệ thống hiện đại',
  'Ghép kênh FDM (theo tần số) và TDM (theo thời gian); trải phổ (CDMA); viễn thông số & mạng tế bào; tổng quan 4G (OFDM) và 5G (mmWave, MIMO).',
  [[
    `<span class="eyebrow">COS201 · Chapter 8 · Lesson 8.1</span>
<h2>Modern communication systems</h2>
<h3>Multiplexing &mdash; sharing one channel</h3>
<ul>
<li><strong>FDM</strong> (frequency-division) — each user gets a different frequency slot (old radio/TV, cable).</li>
<li><strong>TDM</strong> (time-division) — users take turns in time slots on the same frequency (digital telephony).</li>
<li><strong>CDMA / spread spectrum</strong> — users share the whole band at once, separated by unique codes; also resists jamming and interception (GPS, 3G).</li>
</ul>
<h3>Cellular evolution &mdash; the big picture</h3>
<pre><code>1G analog voice  -> 2G digital (GSM)  -> 3G data (CDMA)
 -> 4G LTE  (OFDM, all-IP, ~100s Mbit/s)
 -> 5G NR   (mmWave, massive MIMO, low latency, ~Gbit/s)
</code></pre>
<p><strong>OFDM</strong> (used by 4G, Wi-Fi, 5G) splits one wide channel into thousands of narrow, robust subcarriers — this tames multipath and is why modern wireless is so fast and reliable.</p>
<h3>Where this course leads</h3>
<p>Everything you learned — spectra, modulation, sampling, SNR, capacity — converges here. A 5G phone samples voice, source-codes it, wraps it in error-correcting bits, maps them to a QAM constellation, spreads them across OFDM subcarriers, and does all of it right up against the Shannon limit.</p>
<div class="callout"><span class="badge">One system, many chapters</span> A 5G link is Chapters 2&ndash;7 running at once: Fourier, digital modulation, sampling, coding, SNR and capacity, in silicon, in your pocket.</div>`,
    `<span class="eyebrow">COS201 · Chương 8 · Bài 8.1</span>
<h2>Hệ thống hiện đại</h2>
<h3>Ghép kênh &mdash; chia sẻ một kênh</h3>
<ul>
<li><strong>FDM</strong> (theo tần số) — mỗi người dùng một khe tần khác nhau (radio/TV cũ, cáp).</li>
<li><strong>TDM</strong> (theo thời gian) — người dùng luân phiên theo khe thời gian trên cùng tần số (điện thoại số).</li>
<li><strong>CDMA / trải phổ</strong> — người dùng chia sẻ cả băng cùng lúc, tách nhau bằng mã riêng; còn kháng nhiễu phá và chống nghe lén (GPS, 3G).</li>
</ul>
<h3>Tiến hoá mạng tế bào &mdash; bức tranh lớn</h3>
<pre><code>1G thoại analog  -> 2G số (GSM)  -> 3G dữ liệu (CDMA)
 -> 4G LTE  (OFDM, toàn IP, ~hàng trăm Mbit/s)
 -> 5G NR   (mmWave, massive MIMO, độ trễ thấp, ~Gbit/s)
</code></pre>
<p><strong>OFDM</strong> (dùng bởi 4G, Wi-Fi, 5G) chia một kênh rộng thành hàng nghìn sóng mang con hẹp, bền — nó thuần hoá đa đường (multipath) và là lý do vô tuyến hiện đại nhanh và tin cậy tới vậy.</p>
<h3>Môn này dẫn tới đâu</h3>
<p>Mọi thứ bạn học — phổ, điều chế, lấy mẫu, SNR, dung lượng — hội tụ ở đây. Một điện thoại 5G lấy mẫu tiếng nói, mã hoá nguồn, bọc bit sửa lỗi, ánh xạ lên chòm sao QAM, trải chúng lên các sóng mang con OFDM, và làm tất cả sát ngay giới hạn Shannon.</p>
<div class="callout"><span class="badge">Một hệ, nhiều chương</span> Một kết nối 5G là Chương 2&ndash;7 chạy cùng lúc: Fourier, điều chế số, lấy mẫu, mã hoá, SNR và dung lượng, trong silicon, trong túi bạn.</div>`,
  ]]);

const c8q = quiz('cos201-quiz-8', 'Quiz 8 — Modern systems|||Quiz 8 — Hệ hiện đại',
  [
    { id: 'q1', question: 'Kỹ thuật ghép kênh cấp mỗi người dùng một KHE TẦN riêng?|||Which gives each user a frequency slot?', options: ['TDM', 'FDM', 'PCM', 'BER'], correctIndex: 1, explanation: 'FDM chia theo tần số; TDM chia theo thời gian.' },
    { id: 'q2', question: 'Kỹ thuật lõi của 4G/Wi-Fi/5G chia kênh rộng thành nhiều sóng mang con hẹp?|||Core technique splitting one wide channel into many narrow subcarriers?', options: ['SSB', 'OFDM', 'ASK', 'FDM analog'], correctIndex: 1, explanation: 'OFDM chia kênh thành hàng nghìn sóng mang con, thuần hoá đa đường.' },
    { id: 'q3', question: 'CDMA (trải phổ) tách người dùng bằng?|||CDMA separates users by?', options: ['Khe thời gian|||Time slots', 'Khe tần số|||Frequency slots', 'Mã riêng cho mỗi người|||A unique code per user', 'Mức điện áp|||Voltage levels'], correctIndex: 2, explanation: 'CDMA: mọi người dùng cả băng cùng lúc, tách nhau bằng mã trực giao.' },
  ]);

const taiLieu = doc('cos201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Proakis, Haykin, Lathi), tài liệu miễn phí, YouTube, công cụ mô phỏng, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">COS201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Communication Systems — signals &amp; spectra, analog &amp; digital modulation, sampling, noise and capacity — in one place. The official slides &amp; textbook live on <strong>FLM</strong>; below are the standard books and free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for COS201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Standard reference books</h3>
<ul>
<li>Proakis &amp; Salehi — <em>Communication Systems Engineering</em> (the primary text).</li>
<li>Haykin — <em>Communication Systems</em> (a classic, very readable).</li>
<li>Lathi &amp; Ding — <em>Modern Digital and Analog Communication Systems</em>.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/6-450-principles-of-digital-communications-i-fall-2006/" target="_blank" rel="noopener">MIT OCW 6.450 — Principles of Digital Communications</a></li>
<li><a href="https://www.tutorialspoint.com/digital_communication/index.htm" target="_blank" rel="noopener">TutorialsPoint — Digital Communication</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@iain_explains" target="_blank" rel="noopener">Iain Explains Signals, Systems &amp; DSP</a> — clear communications theory</li>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — the visual intuition for Fourier &amp; signals</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.desmos.com/calculator" target="_blank" rel="noopener">Desmos</a> — plot AM/FM waveforms and spectra interactively</li>
<li><a href="https://www.gnuradio.org/" target="_blank" rel="noopener">GNU Radio</a> — free software-defined-radio toolkit for real modulation</li>
<li><a href="https://octave.org/" target="_blank" rel="noopener">GNU Octave</a> — free MATLAB-compatible maths for signal experiments</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — the block diagram, signals &amp; spectra (Fourier), bandwidth, and AM/FM.</li>
<li><strong>Practice</strong> — sketch spectra, compute AM/FM bandwidth (Carson), and Nyquist/PCM bit rates by hand.</li>
<li><strong>Go deeper</strong> — digital modulation (constellations), SNR/BER and Shannon capacity.</li>
<li><strong>Job-ready</strong> — build a real modulator/demodulator in GNU Radio and read a 4G/5G physical-layer overview.</li>
</ol></div>`,
    `<span class="eyebrow">COS201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Hệ thống truyền thông — tín hiệu &amp; phổ, điều chế analog &amp; số, lấy mẫu, nhiễu và dung lượng — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là các sách chuẩn và nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của COS201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách chuẩn tham khảo</h3>
<ul>
<li>Proakis &amp; Salehi — <em>Communication Systems Engineering</em> (sách chính).</li>
<li>Haykin — <em>Communication Systems</em> (kinh điển, rất dễ đọc).</li>
<li>Lathi &amp; Ding — <em>Modern Digital and Analog Communication Systems</em>.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/6-450-principles-of-digital-communications-i-fall-2006/" target="_blank" rel="noopener">MIT OCW 6.450 — Principles of Digital Communications</a></li>
<li><a href="https://www.tutorialspoint.com/digital_communication/index.htm" target="_blank" rel="noopener">TutorialsPoint — Digital Communication</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@iain_explains" target="_blank" rel="noopener">Iain Explains Signals, Systems &amp; DSP</a> — lý thuyết truyền thông rõ ràng</li>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — trực giác hình ảnh cho Fourier &amp; tín hiệu</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.desmos.com/calculator" target="_blank" rel="noopener">Desmos</a> — vẽ dạng sóng AM/FM và phổ tương tác</li>
<li><a href="https://www.gnuradio.org/" target="_blank" rel="noopener">GNU Radio</a> — bộ công cụ vô tuyến định nghĩa bằng phần mềm, điều chế thật</li>
<li><a href="https://octave.org/" target="_blank" rel="noopener">GNU Octave</a> — toán tương thích MATLAB miễn phí để thử nghiệm tín hiệu</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — sơ đồ khối, tín hiệu &amp; phổ (Fourier), băng thông, và AM/FM.</li>
<li><strong>Luyện tập</strong> — vẽ phổ, tính băng thông AM/FM (Carson) và bit rate Nyquist/PCM bằng tay.</li>
<li><strong>Đào sâu</strong> — điều chế số (chòm sao), SNR/BER và dung lượng Shannon.</li>
<li><strong>Sẵn sàng đi làm</strong> — dựng bộ điều chế/giải điều chế thật trong GNU Radio và đọc tổng quan lớp vật lý 4G/5G.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'COS201',
    slug: 'cos201-communication-system',
    title: 'Communication System',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/COS201.webp',
    shortDescription: 'How information travels — signals & spectra (Fourier), analog modulation (AM/FM, Carson bandwidth), sampling & PCM, digital modulation (ASK/FSK/PSK/QAM), noise, SNR, BER & Shannon capacity, plus multiplexing and 4G/5G. Bilingual, with formulas & quizzes.|||Thông tin đi thế nào — tín hiệu & phổ (Fourier), điều chế analog (AM/FM, băng thông Carson), lấy mẫu & PCM, điều chế số (ASK/FSK/PSK/QAM), nhiễu, SNR, BER & dung lượng Shannon, cùng ghép kênh và 4G/5G. Song ngữ, có công thức & quiz.',
    description: 'Môn <strong>COS201 — Communication System</strong> (Hệ thống truyền thông, kỳ 5, ngành Thiết kế vi mạch bán dẫn) giúp hiểu <strong>thông tin đi từ nơi này tới nơi khác thế nào</strong>. Từ <strong>sơ đồ khối &amp; tín hiệu</strong> (nguồn/phát/kênh/thu, Fourier, phổ, băng thông) → <strong>điều chế analog</strong> (AM/DSB/SSB, FM/PM, quy tắc Carson) → <strong>số hoá</strong> (Nyquist, PCM) → <strong>điều chế số</strong> (ASK/FSK/PSK/QAM, chòm sao) → <strong>nhiễu, SNR, BER &amp; dung lượng Shannon</strong> → <strong>ghép kênh &amp; hệ hiện đại</strong> (FDM/TDM, trải phổ, 4G/5G). Bám sách chuẩn (Proakis, Haykin, Lathi), song ngữ, có công thức và ví dụ, quiz mỗi chương.',
    whatYouLearn: 'Sơ đồ khối hệ truyền thông; tín hiệu, Fourier, phổ, băng thông; AM (chỉ số điều chế, DSB, SSB) &amp; giải điều chế; FM/PM &amp; băng thông Carson; định lý lấy mẫu Nyquist, lượng tử hoá &amp; PCM; điều chế số ASK/FSK/PSK/QAM &amp; chòm sao (bit/ký hiệu); nhiễu AWGN, SNR (dB), BER; dung lượng kênh Shannon C = B·log2(1+SNR); ghép kênh FDM/TDM, trải phổ CDMA và tổng quan 4G (OFDM)/5G.',
    requirements: 'Toán (lượng giác, log, số phức cơ bản) và tín hiệu/vật lý phổ thông. Biết dùng một công cụ vẽ đồ thị (Desmos/Octave) là một lợi thế.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn (Proakis, Haykin, Lathi), tài liệu miễn phí, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Truyền thông làm gì, sơ đồ nguồn→phát→kênh→thu, analog vs số.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan hệ truyền thông|||Chapter 1 — System overview', description: 'Sơ đồ khối, băng gốc vs passband, băng thông.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Tín hiệu & phổ tần|||Chapter 2 — Signals & spectra', description: 'Fourier, phổ, năng lượng/công suất, băng thông.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Điều chế biên độ AM|||Chapter 3 — Amplitude modulation', description: 'AM, DSB, SSB, điều chế & giải điều chế.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Điều chế góc FM/PM|||Chapter 4 — Angle modulation', description: 'FM, PM, độ lệch tần, băng thông Carson.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Số hoá & lấy mẫu|||Chapter 5 — Sampling & PCM', description: 'Nyquist, lượng tử hoá, PCM, mã hoá nguồn.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Điều chế số|||Chapter 6 — Digital modulation', description: 'ASK/FSK/PSK/QAM, chòm sao, bit rate.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Nhiễu & hiệu năng|||Chapter 7 — Noise & performance', description: 'Nhiễu, SNR, BER, dung lượng Shannon.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Hệ thống hiện đại|||Chapter 8 — Modern systems', description: 'FDM/TDM, trải phổ, viễn thông số, 4G/5G.', lessons: [c8, c8q] },
  ],
};
