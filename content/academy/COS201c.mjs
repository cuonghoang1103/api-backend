/**
 * COS201c — Communication Systems (Hệ thống truyền thông / Kỹ thuật truyền tin).
 * Ngành Robotics & AI, FPTU. Giáo trình: Proakis & Salehi "Communication
 * Systems Engineering"; Haykin "Communication Systems"; Lathi "Modern Digital
 * and Analog Communication Systems". 8 chương song ngữ + quiz mỗi chương.
 * Giữ NGUYÊN format slug/semester/thumb. ⚠️ KHÔNG backtick/${; công thức Latin.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('cos201c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Proakis, Haykin, Lathi), tài liệu miễn phí, YouTube, công cụ mô phỏng, lộ trình tự học.',
  [[
    `<span class="eyebrow">COS201c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Communication Systems</strong> — signals, analog &amp; digital modulation, information theory and coding — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for COS201c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference textbooks</h3>
<ul>
<li>Proakis &amp; Salehi — <em>Communication Systems Engineering</em> (the course spine)</li>
<li>Simon Haykin — <em>Communication Systems</em></li>
<li>B. P. Lathi &amp; Z. Ding — <em>Modern Digital and Analog Communication Systems</em></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/6-450-principles-of-digital-communications-i-fall-2006/" target="_blank" rel="noopener">MIT OCW 6.450 — Principles of Digital Communications</a></li>
<li><a href="https://www.dsprelated.com/" target="_blank" rel="noopener">DSPRelated — signals &amp; DSP tutorials</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@iain_explains" target="_blank" rel="noopener">Iain Explains Signals, Systems, and Digital Comms</a></li>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — Fourier transform, intuition</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.gnuradio.org/" target="_blank" rel="noopener">GNU Radio</a> — build real SDR communication flows</li>
<li><a href="https://octave.org/" target="_blank" rel="noopener">GNU Octave</a> — free MATLAB-compatible numerics for modulation demos</li>
<li><a href="https://numpy.org/" target="_blank" rel="noopener">NumPy / SciPy</a> — Python signal processing</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — the block model, bandwidth, SNR, and Fourier analysis of signals.</li>
<li><strong>Analog</strong> — AM/FM/PM: how a message rides a carrier.</li>
<li><strong>Digital</strong> — sampling, PCM, and digital modulation (ASK/FSK/PSK/QAM).</li>
<li><strong>Theory + practice</strong> — Shannon capacity, coding, and multiple access for wireless robots.</li>
</ol></div>`,
    `<span class="eyebrow">COS201c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Hệ thống truyền thông</strong> — tín hiệu, điều chế tương tự &amp; số, lý thuyết thông tin và mã hoá — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của COS201c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo chuẩn</h3>
<ul>
<li>Proakis &amp; Salehi — <em>Communication Systems Engineering</em> (xương sống môn học)</li>
<li>Simon Haykin — <em>Communication Systems</em></li>
<li>B. P. Lathi &amp; Z. Ding — <em>Modern Digital and Analog Communication Systems</em></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/6-450-principles-of-digital-communications-i-fall-2006/" target="_blank" rel="noopener">MIT OCW 6.450 — Principles of Digital Communications</a></li>
<li><a href="https://www.dsprelated.com/" target="_blank" rel="noopener">DSPRelated — hướng dẫn tín hiệu &amp; DSP</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@iain_explains" target="_blank" rel="noopener">Iain Explains Signals, Systems, and Digital Comms</a></li>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — biến đổi Fourier, trực giác</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.gnuradio.org/" target="_blank" rel="noopener">GNU Radio</a> — dựng luồng truyền thông SDR thật</li>
<li><a href="https://octave.org/" target="_blank" rel="noopener">GNU Octave</a> — numerics tương thích MATLAB, miễn phí, để demo điều chế</li>
<li><a href="https://numpy.org/" target="_blank" rel="noopener">NumPy / SciPy</a> — xử lý tín hiệu bằng Python</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — mô hình khối, băng thông, SNR và phân tích Fourier của tín hiệu.</li>
<li><strong>Tương tự</strong> — AM/FM/PM: thông điệp cưỡi lên sóng mang thế nào.</li>
<li><strong>Số</strong> — lấy mẫu, PCM và điều chế số (ASK/FSK/PSK/QAM).</li>
<li><strong>Lý thuyết + thực hành</strong> — dung lượng Shannon, mã hoá, và đa truy nhập cho robot không dây.</li>
</ol></div>`,
  ]]);

const intro = doc('cos201c-0-1-overview', 'Course overview: Communication systems|||Tổng quan: Hệ thống truyền thông',
  'Truyền thông làm gì; mô hình khối nguồn→phát→kênh→thu→đích; hai đại lượng cốt lõi băng thông & SNR; lộ trình tương tự → số → lý thuyết thông tin & mã hoá → đa truy nhập.',
  [[
    `<span class="eyebrow">COS201c · Lesson 0.1 · Overview</span>
<h2>Communication Systems</h2>
<p class="lead">A communication system moves <strong>information from one point to another</strong> across space (a radio link) or time (a stored file). This course explains how a message — voice, image, sensor data — is turned into a signal, sent through an imperfect <strong>channel</strong>, and recovered at the far end, for both <strong>analog</strong> and <strong>digital</strong> systems.</p>
<h3>The block model</h3>
<pre><code>Source -> Transmitter -> Channel -> Receiver -> Sink
                            |
                         Noise / distortion / attenuation
</code></pre>
<h3>Two numbers that rule everything</h3>
<ul>
<li><strong>Bandwidth (B)</strong> — the range of frequencies the signal uses, in hertz. More bandwidth = more data possible.</li>
<li><strong>Signal-to-noise ratio (SNR)</strong> — how strong the wanted signal is versus the noise; often in decibels: <code>SNR_dB = 10 * log10(Psignal / Pnoise)</code>.</li>
</ul>
<p>Shannon later ties them into one law for the maximum data rate — the destination of this course.</p>
<h3>Roadmap</h3>
<p>Signal &amp; system analysis (Fourier) → analog modulation (AM/FM/PM) → digitizing (sampling, PCM) → digital modulation (ASK/FSK/PSK/QAM) → noise &amp; information theory → source &amp; channel coding → multiple access &amp; wireless for robots.</p>`,
    `<span class="eyebrow">COS201c · Bài 0.1 · Tổng quan</span>
<h2>Hệ thống truyền thông</h2>
<p class="lead">Một hệ thống truyền thông đưa <strong>thông tin từ nơi này tới nơi khác</strong> qua không gian (đường vô tuyến) hoặc thời gian (tệp lưu trữ). Môn học giải thích một thông điệp — tiếng nói, hình ảnh, dữ liệu cảm biến — được biến thành tín hiệu, gửi qua một <strong>kênh</strong> không hoàn hảo, rồi khôi phục ở đầu kia thế nào, cho cả hệ <strong>tương tự</strong> lẫn <strong>số</strong>.</p>
<h3>Mô hình khối</h3>
<pre><code>Nguồn -> Bộ phát -> Kênh -> Bộ thu -> Đích
                       |
                    Nhiễu / méo / suy hao
</code></pre>
<h3>Hai con số chi phối tất cả</h3>
<ul>
<li><strong>Băng thông (B)</strong> — khoảng tần số tín hiệu chiếm, đo bằng hertz. Băng thông càng lớn = truyền được càng nhiều dữ liệu.</li>
<li><strong>Tỉ số tín hiệu trên nhiễu (SNR)</strong> — tín hiệu mong muốn mạnh so với nhiễu bao nhiêu; thường tính bằng decibel: <code>SNR_dB = 10 * log10(Psignal / Pnoise)</code>.</li>
</ul>
<p>Về sau Shannon buộc hai con số này vào một định luật cho tốc độ dữ liệu tối đa — điểm đến của môn học.</p>
<h3>Lộ trình</h3>
<p>Phân tích tín hiệu &amp; hệ thống (Fourier) → điều chế tương tự (AM/FM/PM) → số hoá (lấy mẫu, PCM) → điều chế số (ASK/FSK/PSK/QAM) → nhiễu &amp; lý thuyết thông tin → mã hoá nguồn &amp; kênh → đa truy nhập &amp; không dây cho robot.</p>`,
  ]]);

const c1 = doc('cos201c-1-1-model', '1.1 — Communication system model|||1.1 — Mô hình hệ thống truyền thông',
  'Các khối nguồn/phát/kênh/thu/đích; analog vs digital; loại kênh (dây, quang, vô tuyến); suy hao, méo, nhiễu; băng gốc vs băng thông; đo bằng dB.',
  [[
    `<span class="eyebrow">COS201c · Chapter 1 · Lesson 1.1</span>
<h2>The communication system model</h2>
<h3>Blocks and their jobs</h3>
<ul>
<li><strong>Source</strong> — produces the message (mic, camera, sensor).</li>
<li><strong>Transmitter</strong> — encodes and <em>modulates</em> the message onto a carrier suited to the channel.</li>
<li><strong>Channel</strong> — the physical path (copper, fibre, air). It adds <strong>attenuation</strong>, <strong>distortion</strong> and <strong>noise</strong>.</li>
<li><strong>Receiver</strong> — demodulates and decodes, undoing channel effects as far as possible.</li>
<li><strong>Sink</strong> — the destination user or device.</li>
</ul>
<h3>Analog vs digital</h3>
<p>An <strong>analog</strong> system carries a continuous waveform; a <strong>digital</strong> system carries a stream of bits. Digital wins in practice: it can be regenerated exactly at repeaters, protected by coding, encrypted, and compressed — so noise does not accumulate the way it does in analog.</p>
<h3>Channels &amp; impairments</h3>
<pre><code>Wired    : twisted pair, coax, fibre  (low noise, bounded)
Wireless : radio, microwave, optical  (fading, interference)

Received power falls with distance (free space):
  Pr proportional to Pt / d^2
</code></pre>
<p><strong>Baseband</strong> is the message at its natural low frequencies; <strong>passband</strong> shifts it up to a carrier so it fits the channel and shares the medium with others.</p>
<div class="callout"><span class="badge">Why decibels</span> Gains and losses multiply along a link; in dB they simply add, so a link budget becomes an easy sum: <code>Pr_dB = Pt_dB + Gains_dB - Losses_dB</code>.</div>`,
    `<span class="eyebrow">COS201c · Chương 1 · Bài 1.1</span>
<h2>Mô hình hệ thống truyền thông</h2>
<h3>Các khối và nhiệm vụ</h3>
<ul>
<li><strong>Nguồn</strong> — tạo thông điệp (micro, camera, cảm biến).</li>
<li><strong>Bộ phát</strong> — mã hoá và <em>điều chế</em> thông điệp lên sóng mang phù hợp với kênh.</li>
<li><strong>Kênh</strong> — đường truyền vật lý (đồng, quang, không khí). Nó thêm <strong>suy hao</strong>, <strong>méo</strong> và <strong>nhiễu</strong>.</li>
<li><strong>Bộ thu</strong> — giải điều chế và giải mã, khử ảnh hưởng của kênh nhiều nhất có thể.</li>
<li><strong>Đích</strong> — người dùng hoặc thiết bị nhận cuối.</li>
</ul>
<h3>Tương tự vs số</h3>
<p>Hệ <strong>tương tự</strong> mang sóng liên tục; hệ <strong>số</strong> mang dòng bit. Số thắng trong thực tế: có thể tái tạo chính xác tại trạm lặp, được bảo vệ bằng mã hoá, mã mật, và nén — nên nhiễu không tích luỹ như ở tương tự.</p>
<h3>Kênh &amp; suy giảm</h3>
<pre><code>Có dây     : đôi xoắn, đồng trục, quang  (ít nhiễu, giới hạn)
Không dây  : vô tuyến, vi ba, quang       (pha-đinh, giao thoa)

Công suất thu giảm theo khoảng cách (không gian tự do):
  Pr tỉ lệ Pt / d^2
</code></pre>
<p><strong>Băng gốc (baseband)</strong> là thông điệp ở tần số thấp tự nhiên; <strong>băng thông qua (passband)</strong> dịch nó lên sóng mang để vừa kênh và chia sẻ môi trường với người khác.</p>
<div class="callout"><span class="badge">Vì sao dùng decibel</span> Độ lợi và suy hao nhân nhau dọc đường truyền; tính bằng dB thì chỉ cần cộng, nên một bảng cân đối đường truyền thành phép cộng đơn giản: <code>Pr_dB = Pt_dB + Gains_dB - Losses_dB</code>.</div>`,
  ]]);

const c1q = quiz('cos201c-quiz-1', 'Quiz 1 — System model|||Quiz 1 — Mô hình hệ thống', [
  { id: 'q1', question: 'Trong mô hình khối, khối nào thêm nhiễu, suy hao và méo vào tín hiệu?', options: ['Nguồn', 'Bộ phát', 'Kênh (channel)', 'Đích'], correctIndex: 2, explanation: 'Kênh là đường truyền vật lý, nơi thêm suy hao, méo và nhiễu.' },
  { id: 'q2', question: 'Vì sao hệ số được ưa dùng hơn hệ tương tự trong thực tế?', options: ['Sóng đẹp hơn', 'Có thể tái tạo chính xác tại trạm lặp, mã hoá sửa lỗi, nén, mã mật', 'Không cần sóng mang', 'Băng thông luôn bằng 0'], correctIndex: 1, explanation: 'Số có thể tái tạo bit chính xác nên nhiễu không tích luỹ, lại thêm mã hoá/nén/mã mật.' },
  { id: 'q3', question: 'Vì sao độ lợi và suy hao đường truyền hay tính bằng decibel (dB)?', options: ['Vì dB là đơn vị dòng điện', 'Vì các hệ số nhân nhau thành phép cộng trong dB', 'Vì dB đo băng thông', 'Vì dB loại bỏ nhiễu'], correctIndex: 1, explanation: 'Chuyển sang dB (log) thì nhân thành cộng, bảng cân đối đường truyền chỉ là phép cộng.' },
]);

const c2 = doc('cos201c-2-1-signal-analysis', '2.1 — Signal & system analysis|||2.1 — Phân tích tín hiệu & hệ thống',
  'Fourier: mọi tín hiệu là tổng các sóng sin; phổ tần số; chuỗi vs biến đổi Fourier; băng thông; hệ LTI, đáp ứng xung, tích chập; lọc thông thấp/cao/dải.',
  [[
    `<span class="eyebrow">COS201c · Chapter 2 · Lesson 2.1</span>
<h2>Signal &amp; system analysis</h2>
<h3>Fourier: signals live in two worlds</h3>
<p>The big idea: <strong>any signal can be written as a sum of sine waves</strong> of different frequencies, amplitudes and phases. Looking at a signal versus time is the <em>time domain</em>; looking at how much of each frequency it contains is the <em>frequency domain</em> or <strong>spectrum</strong>.</p>
<ul>
<li><strong>Fourier series</strong> — for a periodic signal: a sum of harmonics at multiples of the fundamental frequency.</li>
<li><strong>Fourier transform</strong> — for a general signal: a continuous spectrum X(f).</li>
</ul>
<pre><code>Periodic square wave = fundamental + odd harmonics
  s(t) = (4/pi) * [ sin(w0 t) + (1/3) sin(3 w0 t) + (1/5) sin(5 w0 t) + ... ]
  where w0 = 2 * pi * f0
</code></pre>
<h3>Bandwidth</h3>
<p><strong>Bandwidth</strong> is the width of the frequency band a signal occupies: <code>B = f_high - f_low</code>. Sharp edges and fast changes need <em>high</em> frequencies, so a fast digital pulse needs a wide bandwidth.</p>
<h3>LTI systems &amp; filters</h3>
<p>A <strong>linear time-invariant (LTI)</strong> system is fully described by its <strong>impulse response h(t)</strong>. The output is the <strong>convolution</strong> of input and h(t); in the frequency domain it is simply multiplication by H(f):</p>
<pre><code>time domain : y(t) = x(t) * h(t)      (convolution)
freq domain : Y(f) = X(f) . H(f)      (multiply)

Filters: low-pass, high-pass, band-pass keep chosen frequencies.
</code></pre>
<div class="callout"><span class="badge">Key takeaway</span> Filtering is just shaping a spectrum. Because convolution in time is multiplication in frequency, we design in whichever domain is easier.</div>`,
    `<span class="eyebrow">COS201c · Chương 2 · Bài 2.1</span>
<h2>Phân tích tín hiệu &amp; hệ thống</h2>
<h3>Fourier: tín hiệu sống ở hai thế giới</h3>
<p>Ý tưởng lớn: <strong>mọi tín hiệu đều viết được thành tổng các sóng sin</strong> khác tần số, biên độ và pha. Nhìn tín hiệu theo thời gian là <em>miền thời gian</em>; nhìn nó chứa bao nhiêu của mỗi tần số là <em>miền tần số</em> hay <strong>phổ</strong>.</p>
<ul>
<li><strong>Chuỗi Fourier</strong> — cho tín hiệu tuần hoàn: tổng các hài ở bội của tần số cơ bản.</li>
<li><strong>Biến đổi Fourier</strong> — cho tín hiệu tổng quát: phổ liên tục X(f).</li>
</ul>
<pre><code>Sóng vuông tuần hoàn = cơ bản + các hài lẻ
  s(t) = (4/pi) * [ sin(w0 t) + (1/3) sin(3 w0 t) + (1/5) sin(5 w0 t) + ... ]
  với w0 = 2 * pi * f0
</code></pre>
<h3>Băng thông</h3>
<p><strong>Băng thông</strong> là độ rộng dải tần một tín hiệu chiếm: <code>B = f_high - f_low</code>. Cạnh sắc và thay đổi nhanh cần tần số <em>cao</em>, nên một xung số nhanh cần băng thông rộng.</p>
<h3>Hệ LTI &amp; bộ lọc</h3>
<p>Một hệ <strong>tuyến tính bất biến theo thời gian (LTI)</strong> được mô tả trọn vẹn bởi <strong>đáp ứng xung h(t)</strong>. Đầu ra là <strong>tích chập</strong> của đầu vào với h(t); trong miền tần số chỉ là nhân với H(f):</p>
<pre><code>miền thời gian : y(t) = x(t) * h(t)      (tích chập)
miền tần số    : Y(f) = X(f) . H(f)      (phép nhân)

Bộ lọc: thông thấp, thông cao, thông dải giữ lại tần số chọn.
</code></pre>
<div class="callout"><span class="badge">Điểm cốt lõi</span> Lọc chỉ là tạo hình cho phổ. Vì tích chập ở miền thời gian là phép nhân ở miền tần số, ta thiết kế ở miền nào dễ hơn thì làm.</div>`,
  ]]);

const c2q = quiz('cos201c-quiz-2', 'Quiz 2 — Signals & Fourier|||Quiz 2 — Tín hiệu & Fourier', [
  { id: 'q1', question: 'Tư tưởng trung tâm của phân tích Fourier là gì?', options: ['Mọi tín hiệu là tổng các sóng sin khác tần số', 'Mọi tín hiệu là hằng số', 'Tín hiệu không có phổ', 'Chỉ sóng vuông mới có phổ'], correctIndex: 0, explanation: 'Fourier: bất kỳ tín hiệu nào cũng viết được thành tổng các sóng sin (phổ tần số).' },
  { id: 'q2', question: 'Tích chập x(t)*h(t) ở miền thời gian tương ứng với gì ở miền tần số?', options: ['Phép cộng X(f)+H(f)', 'Phép nhân X(f).H(f)', 'Phép trừ', 'Phép chia'], correctIndex: 1, explanation: 'Tích chập trong thời gian = nhân trong tần số: Y(f)=X(f).H(f).' },
  { id: 'q3', question: 'Vì sao một xung số nhanh (cạnh sắc) cần băng thông rộng?', options: ['Vì nó công suất thấp', 'Vì thay đổi nhanh chứa các thành phần tần số cao', 'Vì nó không có nhiễu', 'Vì băng thông luôn cố định'], correctIndex: 1, explanation: 'Cạnh sắc/biến đổi nhanh cần tần số cao, nên chiếm dải tần rộng hơn.' },
]);

const c3 = doc('cos201c-3-1-analog-modulation', '3.1 — Analog modulation (AM, FM, PM)|||3.1 — Điều chế tương tự (AM, FM, PM)',
  'Vì sao cần điều chế; sóng mang; AM (đổi biên độ, băng thông 2W, chỉ số m); FM & PM (đổi tần số/pha, quy tắc Carson); đánh đổi băng thông vs chống nhiễu.',
  [[
    `<span class="eyebrow">COS201c · Chapter 3 · Lesson 3.1</span>
<h2>Analog modulation: AM, FM, PM</h2>
<h3>Why modulate?</h3>
<p>A message (e.g. audio, 0-15 kHz) cannot radiate efficiently and everyone would occupy the same band. <strong>Modulation</strong> rides the message on a high-frequency <strong>carrier</strong> so we can use a practical antenna and give each station its own slice of spectrum.</p>
<h3>Amplitude modulation (AM)</h3>
<p>The carrier's <em>amplitude</em> follows the message. Simple receivers, but wasteful of power and sensitive to noise.</p>
<pre><code>s(t) = Ac * [ 1 + m * x(t) ] * cos(2 * pi * fc * t)
  m = modulation index (keep m &lt;= 1 to avoid over-modulation)
  Transmission bandwidth = 2 * W   (W = message bandwidth)
</code></pre>
<h3>Frequency &amp; phase modulation (FM, PM)</h3>
<p>In <strong>FM</strong> the carrier's <em>frequency</em> tracks the message; in <strong>PM</strong> its <em>phase</em> does. Both are <strong>angle modulation</strong> and resist amplitude noise far better than AM — why FM radio sounds clean.</p>
<pre><code>Carson's rule (FM bandwidth):
  B approx 2 * (delta_f + W)
  delta_f = peak frequency deviation
</code></pre>
<div class="callout"><span class="badge">The trade-off</span> FM spends more bandwidth to buy better noise immunity. This bandwidth-vs-quality trade is the recurring theme of the whole course.</div>`,
    `<span class="eyebrow">COS201c · Chương 3 · Bài 3.1</span>
<h2>Điều chế tương tự: AM, FM, PM</h2>
<h3>Vì sao phải điều chế?</h3>
<p>Một thông điệp (vd âm thanh, 0-15 kHz) không bức xạ hiệu quả và ai cũng chiếm chung một dải. <strong>Điều chế</strong> cho thông điệp cưỡi lên một <strong>sóng mang</strong> tần số cao để dùng được ăng-ten thực tế và cấp cho mỗi đài một lát phổ riêng.</p>
<h3>Điều biên (AM)</h3>
<p><em>Biên độ</em> sóng mang bám theo thông điệp. Máy thu đơn giản, nhưng tốn công suất và nhạy với nhiễu.</p>
<pre><code>s(t) = Ac * [ 1 + m * x(t) ] * cos(2 * pi * fc * t)
  m = chỉ số điều chế (giữ m &lt;= 1 để tránh quá điều chế)
  Băng thông truyền = 2 * W   (W = băng thông thông điệp)
</code></pre>
<h3>Điều tần &amp; điều pha (FM, PM)</h3>
<p>Ở <strong>FM</strong> <em>tần số</em> sóng mang bám theo thông điệp; ở <strong>PM</strong> là <em>pha</em>. Cả hai là <strong>điều chế góc</strong> và chống nhiễu biên độ tốt hơn AM nhiều — vì thế radio FM nghe sạch.</p>
<pre><code>Quy tắc Carson (băng thông FM):
  B xap xi 2 * (delta_f + W)
  delta_f = độ lệch tần số đỉnh
</code></pre>
<div class="callout"><span class="badge">Sự đánh đổi</span> FM tốn nhiều băng thông hơn để đổi lấy khả năng chống nhiễu tốt hơn. Đánh đổi băng thông đổi chất lượng này là chủ đề lặp lại suốt cả môn học.</div>`,
  ]]);

const c3q = quiz('cos201c-quiz-3', 'Quiz 3 — Analog modulation|||Quiz 3 — Điều chế tương tự', [
  { id: 'q1', question: 'Trong AM, đại lượng nào của sóng mang thay đổi theo thông điệp?', options: ['Tần số', 'Biên độ', 'Pha', 'Không đại lượng nào'], correctIndex: 1, explanation: 'AM = điều biên: biên độ sóng mang bám theo tín hiệu thông điệp.' },
  { id: 'q2', question: 'Vì sao radio FM thường nghe sạch (ít nhiễu) hơn AM?', options: ['FM không dùng sóng mang', 'FM là điều chế góc, chống nhiễu biên độ tốt hơn', 'FM có băng thông bằng 0', 'FM chỉ truyền ban đêm'], correctIndex: 1, explanation: 'FM/PM là điều chế góc, ít nhạy với nhiễu biên độ hơn AM.' },
  { id: 'q3', question: 'Quy tắc Carson ước lượng gì cho tín hiệu FM?', options: ['Công suất phát', 'Băng thông B approx 2*(delta_f + W)', 'Số bit mỗi giây', 'Chỉ số điều chế AM'], correctIndex: 1, explanation: 'Quy tắc Carson: băng thông FM xấp xỉ 2*(độ lệch tần đỉnh + băng thông thông điệp).' },
]);

const c4 = doc('cos201c-4-1-digitizing', '4.1 — Digitizing signals (sampling, quantization, PCM)|||4.1 — Số hoá tín hiệu (lấy mẫu, lượng tử, PCM)',
  'Ba bước lấy mẫu → lượng tử → mã hoá; định lý Nyquist fs ≥ 2W & aliasing; số mức 2^n & nhiễu lượng tử; PCM và tốc độ bit R = n*fs; ví dụ thoại 64 kbps.',
  [[
    `<span class="eyebrow">COS201c · Chapter 4 · Lesson 4.1</span>
<h2>Digitizing signals: sampling, quantization, PCM</h2>
<p>To send an analog signal digitally we take three steps: <strong>sample</strong> (discrete in time), <strong>quantize</strong> (discrete in amplitude), then <strong>encode</strong> into bits.</p>
<h3>1) Sampling &amp; the Nyquist theorem</h3>
<p>Measure the signal at regular instants. To reconstruct it perfectly the sampling rate must be at least twice the highest frequency:</p>
<pre><code>Nyquist:  fs &gt;= 2 * W       (W = highest signal frequency)
If fs &lt; 2*W  -&gt; ALIASING: high frequencies masquerade as low ones (unrecoverable)
</code></pre>
<h3>2) Quantization</h3>
<p>Round each sample to one of a finite set of levels. With <code>n</code> bits there are <code>2^n</code> levels. Rounding error is <strong>quantization noise</strong>; more bits = finer steps = higher SNR (about 6 dB per extra bit).</p>
<h3>3) Encoding: PCM</h3>
<p><strong>Pulse-code modulation (PCM)</strong> writes each quantized level as an n-bit codeword. The resulting bit rate is:</p>
<pre><code>R = n * fs    (bits per second)

Telephone voice example:
  W = 4 kHz  -&gt; fs = 8 kHz,  n = 8 bits
  R = 8 * 8000 = 64000 bps = 64 kbps
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Once a signal is bits, it inherits every digital advantage: exact regeneration, error-correcting codes, compression and encryption. Sampling + PCM is the bridge from the analog world to all of that.</div>`,
    `<span class="eyebrow">COS201c · Chương 4 · Bài 4.1</span>
<h2>Số hoá tín hiệu: lấy mẫu, lượng tử, PCM</h2>
<p>Để gửi tín hiệu tương tự dưới dạng số ta làm ba bước: <strong>lấy mẫu</strong> (rời rạc theo thời gian), <strong>lượng tử hoá</strong> (rời rạc theo biên độ), rồi <strong>mã hoá</strong> thành bit.</p>
<h3>1) Lấy mẫu &amp; định lý Nyquist</h3>
<p>Đo tín hiệu tại các thời điểm đều đặn. Để khôi phục hoàn hảo, tần số lấy mẫu phải ít nhất gấp đôi tần số cao nhất:</p>
<pre><code>Nyquist:  fs &gt;= 2 * W       (W = tần số cao nhất của tín hiệu)
Nếu fs &lt; 2*W  -&gt; ALIASING: tần số cao giả dạng tần số thấp (không khôi phục được)
</code></pre>
<h3>2) Lượng tử hoá</h3>
<p>Làm tròn mỗi mẫu về một trong số hữu hạn mức. Với <code>n</code> bit có <code>2^n</code> mức. Sai số làm tròn là <strong>nhiễu lượng tử</strong>; nhiều bit hơn = bước nhỏ hơn = SNR cao hơn (khoảng 6 dB cho mỗi bit thêm).</p>
<h3>3) Mã hoá: PCM</h3>
<p><strong>Điều chế xung mã (PCM)</strong> viết mỗi mức đã lượng tử thành một từ mã n bit. Tốc độ bit thu được là:</p>
<pre><code>R = n * fs    (bit mỗi giây)

Ví dụ thoại điện thoại:
  W = 4 kHz  -&gt; fs = 8 kHz,  n = 8 bit
  R = 8 * 8000 = 64000 bps = 64 kbps
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Khi tín hiệu đã thành bit, nó thừa hưởng mọi lợi thế của số: tái tạo chính xác, mã sửa lỗi, nén và mã mật. Lấy mẫu + PCM là cây cầu từ thế giới tương tự sang tất cả những thứ đó.</div>`,
  ]]);

const c4q = quiz('cos201c-quiz-4', 'Quiz 4 — Digitizing & PCM|||Quiz 4 — Số hoá & PCM', [
  { id: 'q1', question: 'Theo định lý Nyquist, tần số lấy mẫu tối thiểu để khôi phục tín hiệu băng thông W là?', options: ['fs >= W', 'fs >= 2*W', 'fs >= W/2', 'fs = 0'], correctIndex: 1, explanation: 'Nyquist: fs phải >= 2*W, nếu không sẽ bị aliasing (chồng phổ).' },
  { id: 'q2', question: 'Lượng tử hoá với n bit tạo ra bao nhiêu mức, và sai số làm tròn gọi là gì?', options: ['n mức; nhiễu nhiệt', '2^n mức; nhiễu lượng tử', 'n^2 mức; aliasing', '2*n mức; pha-đinh'], correctIndex: 1, explanation: 'n bit cho 2^n mức; sai số làm tròn mẫu là nhiễu lượng tử.' },
  { id: 'q3', question: 'Thoại điện thoại lấy mẫu fs=8kHz, n=8 bit. Tốc độ bit PCM R = n*fs là?', options: ['8 kbps', '16 kbps', '64 kbps', '128 kbps'], correctIndex: 2, explanation: 'R = 8 * 8000 = 64000 bps = 64 kbps.' },
]);

const c5 = doc('cos201c-5-1-digital-modulation', '5.1 — Digital modulation (ASK, FSK, PSK, QAM)|||5.1 — Điều chế số (ASK, FSK, PSK, QAM)',
  'Ánh xạ bit lên sóng mang; ASK/FSK/PSK/QAM; giản đồ chòm sao; bit/ký hiệu = log2(M); tốc độ bit R = Rs*log2(M); hiệu suất phổ vs chống nhiễu (BER).',
  [[
    `<span class="eyebrow">COS201c · Chapter 5 · Lesson 5.1</span>
<h2>Digital modulation: ASK, FSK, PSK, QAM</h2>
<p>Digital modulation maps bits onto a carrier by changing its amplitude, frequency or phase. Each transmitted waveform is a <strong>symbol</strong>; a symbol can carry several bits.</p>
<h3>The four families</h3>
<ul>
<li><strong>ASK</strong> — amplitude-shift keying: bit selects carrier amplitude (e.g. on/off).</li>
<li><strong>FSK</strong> — frequency-shift keying: bit selects one of two frequencies.</li>
<li><strong>PSK</strong> — phase-shift keying: bit selects a carrier phase (BPSK = 2 phases, QPSK = 4).</li>
<li><strong>QAM</strong> — quadrature amplitude modulation: vary amplitude AND phase together, packing many bits per symbol (16-QAM, 64-QAM, 256-QAM).</li>
</ul>
<h3>Constellations &amp; bits per symbol</h3>
<p>A <strong>constellation diagram</strong> plots each symbol as a point on I (in-phase) and Q (quadrature) axes. With <code>M</code> symbols each carries <code>log2(M)</code> bits.</p>
<pre><code>bits per symbol : k = log2(M)
bit rate        : R = Rs * log2(M)      (Rs = symbol rate)

QPSK   : M=4   -&gt; 2 bits/symbol
16-QAM : M=16  -&gt; 4 bits/symbol
64-QAM : M=64  -&gt; 6 bits/symbol
</code></pre>
<div class="callout"><span class="badge">The trade-off again</span> Denser constellations (higher M) send more bits in the same bandwidth, but points sit closer together, so noise flips them more easily — higher bit-error rate (BER). High-order QAM needs a high SNR.</div>`,
    `<span class="eyebrow">COS201c · Chương 5 · Bài 5.1</span>
<h2>Điều chế số: ASK, FSK, PSK, QAM</h2>
<p>Điều chế số ánh xạ bit lên sóng mang bằng cách đổi biên độ, tần số hoặc pha. Mỗi dạng sóng phát đi là một <strong>ký hiệu (symbol)</strong>; một ký hiệu có thể mang nhiều bit.</p>
<h3>Bốn họ</h3>
<ul>
<li><strong>ASK</strong> — khoá dịch biên độ: bit chọn biên độ sóng mang (vd bật/tắt).</li>
<li><strong>FSK</strong> — khoá dịch tần số: bit chọn một trong hai tần số.</li>
<li><strong>PSK</strong> — khoá dịch pha: bit chọn pha sóng mang (BPSK = 2 pha, QPSK = 4).</li>
<li><strong>QAM</strong> — điều chế biên độ cầu phương: đổi ĐỒNG THỜI cả biên độ và pha, gói nhiều bit mỗi ký hiệu (16-QAM, 64-QAM, 256-QAM).</li>
</ul>
<h3>Chòm sao &amp; số bit mỗi ký hiệu</h3>
<p>Một <strong>giản đồ chòm sao</strong> vẽ mỗi ký hiệu thành một điểm trên trục I (đồng pha) và Q (vuông pha). Với <code>M</code> ký hiệu, mỗi ký hiệu mang <code>log2(M)</code> bit.</p>
<pre><code>bit mỗi ký hiệu : k = log2(M)
tốc độ bit      : R = Rs * log2(M)      (Rs = tốc độ ký hiệu)

QPSK   : M=4   -&gt; 2 bit/ký hiệu
16-QAM : M=16  -&gt; 4 bit/ký hiệu
64-QAM : M=64  -&gt; 6 bit/ký hiệu
</code></pre>
<div class="callout"><span class="badge">Lại là sự đánh đổi</span> Chòm sao dày hơn (M lớn) gửi nhiều bit hơn trong cùng băng thông, nhưng các điểm nằm gần nhau hơn nên nhiễu dễ làm lật — tỉ lệ lỗi bit (BER) cao hơn. QAM bậc cao cần SNR cao.</div>`,
  ]]);

const c5q = quiz('cos201c-quiz-5', 'Quiz 5 — Digital modulation|||Quiz 5 — Điều chế số', [
  { id: 'q1', question: 'QAM khác PSK ở chỗ nào?', options: ['QAM chỉ đổi tần số', 'QAM đổi đồng thời cả biên độ và pha', 'QAM không dùng sóng mang', 'QAM chỉ có 2 ký hiệu'], correctIndex: 1, explanation: 'QAM thay đổi cả biên độ lẫn pha, nên gói được nhiều bit mỗi ký hiệu.' },
  { id: 'q2', question: 'Với chòm sao M = 16 (16-QAM), mỗi ký hiệu mang bao nhiêu bit?', options: ['2 bit', '4 bit', '8 bit', '16 bit'], correctIndex: 1, explanation: 'k = log2(M) = log2(16) = 4 bit mỗi ký hiệu.' },
  { id: 'q3', question: 'Vì sao chòm sao bậc cao (như 256-QAM) dễ lỗi bit hơn khi nhiễu?', options: ['Vì băng thông bằng 0', 'Vì các điểm ký hiệu nằm gần nhau hơn, nhiễu dễ làm lật', 'Vì nó không cần SNR', 'Vì nó chỉ dùng 1 bit'], correctIndex: 1, explanation: 'M lớn => các điểm chòm sao sát nhau => nhiễu dễ đẩy sang điểm khác => BER cao, cần SNR cao.' },
]);

const c6 = doc('cos201c-6-1-noise-information', '6.1 — Noise & information theory|||6.1 — Nhiễu & lý thuyết thông tin',
  'Các loại nhiễu (nhiệt/AWGN); thông tin & entropy H = -sum p*log2(p) bit; dung lượng kênh Shannon C = B*log2(1+SNR); ý nghĩa: dưới C truyền gần như không lỗi.',
  [[
    `<span class="eyebrow">COS201c · Chapter 6 · Lesson 6.1</span>
<h2>Noise &amp; information theory</h2>
<h3>Noise</h3>
<p>Every real channel adds <strong>noise</strong>. The most common model is <strong>thermal noise</strong>, treated as <strong>AWGN</strong> (additive white Gaussian noise) — random, spread evenly across frequency. Noise is what limits how fast and how reliably we can communicate.</p>
<h3>Information &amp; entropy</h3>
<p>Claude Shannon defined <strong>information</strong> precisely: a rare event carries more information than a common one. The average information per symbol is the <strong>entropy H</strong>, in bits:</p>
<pre><code>H = - sum( p_i * log2(p_i) )     bits per symbol

Fair coin (p=0.5, 0.5):  H = 1 bit
Biased coin (0.9, 0.1):  H = 0.47 bit  (more predictable = less information)
</code></pre>
<h3>The channel capacity theorem</h3>
<p>Shannon's famous result gives the <strong>maximum error-free data rate</strong> of a channel from just its bandwidth and SNR:</p>
<pre><code>C = B * log2( 1 + SNR )     bits per second
  B   = bandwidth (Hz)
  SNR = signal power / noise power (linear, not dB)
</code></pre>
<div class="callout"><span class="badge">The headline</span> Below C, error-free communication is possible (with good enough coding); above C it is impossible, no matter how clever the scheme. C is the speed limit every design in this course lives under.</div>`,
    `<span class="eyebrow">COS201c · Chương 6 · Bài 6.1</span>
<h2>Nhiễu &amp; lý thuyết thông tin</h2>
<h3>Nhiễu</h3>
<p>Mọi kênh thực đều thêm <strong>nhiễu</strong>. Mô hình phổ biến nhất là <strong>nhiễu nhiệt</strong>, coi như <strong>AWGN</strong> (nhiễu Gauss trắng cộng tính) — ngẫu nhiên, trải đều trên mọi tần số. Nhiễu là thứ giới hạn ta truyền nhanh và tin cậy đến đâu.</p>
<h3>Thông tin &amp; entropy</h3>
<p>Claude Shannon định nghĩa <strong>thông tin</strong> chính xác: một sự kiện hiếm mang nhiều thông tin hơn sự kiện thường gặp. Lượng thông tin trung bình mỗi ký hiệu là <strong>entropy H</strong>, tính bằng bit:</p>
<pre><code>H = - sum( p_i * log2(p_i) )     bit mỗi ký hiệu

Đồng xu cân (p=0.5, 0.5):  H = 1 bit
Đồng xu lệch (0.9, 0.1):   H = 0.47 bit  (dễ đoán hơn = ít thông tin hơn)
</code></pre>
<h3>Định lý dung lượng kênh</h3>
<p>Kết quả nổi tiếng của Shannon cho <strong>tốc độ dữ liệu tối đa không lỗi</strong> của một kênh chỉ từ băng thông và SNR:</p>
<pre><code>C = B * log2( 1 + SNR )     bit mỗi giây
  B   = băng thông (Hz)
  SNR = công suất tín hiệu / công suất nhiễu (tuyến tính, không phải dB)
</code></pre>
<div class="callout"><span class="badge">Điểm mấu chốt</span> Dưới C, truyền tin không lỗi là khả thi (nếu mã hoá đủ tốt); trên C thì bất khả, dù sơ đồ có khôn đến đâu. C là giới hạn tốc độ mà mọi thiết kế trong môn này phải sống dưới nó.</div>`,
  ]]);

const c6q = quiz('cos201c-quiz-6', 'Quiz 6 — Noise & information|||Quiz 6 — Nhiễu & thông tin', [
  { id: 'q1', question: 'Công thức dung lượng kênh Shannon là?', options: ['C = B + SNR', 'C = B * log2(1 + SNR)', 'C = 2 * B', 'C = SNR / B'], correctIndex: 1, explanation: 'C = B*log2(1+SNR), với SNR ở dạng tuyến tính, cho tốc độ tối đa không lỗi.' },
  { id: 'q2', question: 'Entropy H của nguồn nói lên điều gì?', options: ['Công suất nhiễu', 'Lượng thông tin trung bình mỗi ký hiệu (bit)', 'Băng thông kênh', 'Số sóng mang'], correctIndex: 1, explanation: 'H = -sum(p*log2 p) là lượng thông tin trung bình mỗi ký hiệu; nguồn dễ đoán có H thấp.' },
  { id: 'q3', question: 'Nếu tốc độ dữ liệu vượt quá dung lượng C của kênh thì?', options: ['Vẫn truyền không lỗi', 'Không thể truyền tin cậy dù mã hoá thế nào', 'Nhiễu biến mất', 'Băng thông tự tăng'], correctIndex: 1, explanation: 'Định lý Shannon: trên C thì không thể truyền không lỗi; dưới C mới khả thi.' },
]);

const c7 = doc('cos201c-7-1-coding', '7.1 — Source coding & channel coding|||7.1 — Mã hoá nguồn & mã hoá kênh',
  'Hai loại mã đối lập: mã nguồn nén (Huffman, bỏ dư thừa) tiến tới entropy H; mã kênh thêm dư thừa có kiểm soát (parity, Hamming) để phát hiện & sửa lỗi.',
  [[
    `<span class="eyebrow">COS201c · Chapter 7 · Lesson 7.1</span>
<h2>Source coding &amp; channel coding</h2>
<p>Two kinds of coding pull in opposite directions. <strong>Source coding removes redundancy</strong> to shrink data; <strong>channel coding adds controlled redundancy</strong> to survive errors.</p>
<h3>Source coding (compression)</h3>
<p>Assign short codewords to frequent symbols, long ones to rare symbols. <strong>Huffman coding</strong> is the classic example. Shannon's source-coding theorem says the average code length cannot go below the entropy H — that is the compression limit.</p>
<pre><code>Symbols by probability -&gt; Huffman -&gt; average bits/symbol close to H
No lossless scheme beats H bits/symbol.
</code></pre>
<h3>Channel coding (error control)</h3>
<p>Add extra bits so the receiver can detect or fix errors caused by noise.</p>
<ul>
<li><strong>Parity bit</strong> — detects a single-bit error (odd number of flips).</li>
<li><strong>Hamming code</strong> — adds several parity bits that pinpoint and correct a single-bit error.</li>
<li><strong>CRC</strong> — strong error detection for whole frames; heavy codes (Reed-Solomon, LDPC, turbo) approach the Shannon limit.</li>
</ul>
<pre><code>Hamming distance d between codewords:
  detect up to (d - 1) errors
  correct up to floor((d - 1) / 2) errors
</code></pre>
<div class="callout"><span class="badge">Two limits, one system</span> Source coding pushes toward H (the least bits needed); channel coding pushes toward C (the most bits a channel carries error-free). Real systems compress first, then protect.</div>`,
    `<span class="eyebrow">COS201c · Chương 7 · Bài 7.1</span>
<h2>Mã hoá nguồn &amp; mã hoá kênh</h2>
<p>Hai loại mã kéo về hai hướng ngược nhau. <strong>Mã nguồn bỏ bớt dư thừa</strong> để thu nhỏ dữ liệu; <strong>mã kênh thêm dư thừa có kiểm soát</strong> để sống sót qua lỗi.</p>
<h3>Mã hoá nguồn (nén)</h3>
<p>Gán từ mã ngắn cho ký hiệu hay gặp, từ mã dài cho ký hiệu hiếm. <strong>Mã Huffman</strong> là ví dụ kinh điển. Định lý mã hoá nguồn của Shannon nói độ dài mã trung bình không thể xuống dưới entropy H — đó là giới hạn nén.</p>
<pre><code>Ký hiệu theo xác suất -&gt; Huffman -&gt; số bit/ký hiệu trung bình gần H
Không sơ đồ không mất mát nào vượt được H bit/ký hiệu.
</code></pre>
<h3>Mã hoá kênh (kiểm soát lỗi)</h3>
<p>Thêm bit dư để bên thu phát hiện hoặc sửa lỗi do nhiễu gây ra.</p>
<ul>
<li><strong>Bit chẵn lẻ (parity)</strong> — phát hiện lỗi một bit (số lần lật lẻ).</li>
<li><strong>Mã Hamming</strong> — thêm vài bit parity chỉ đúng vị trí và sửa được lỗi một bit.</li>
<li><strong>CRC</strong> — phát hiện lỗi mạnh cho cả khung; mã nặng (Reed-Solomon, LDPC, turbo) tiến sát giới hạn Shannon.</li>
</ul>
<pre><code>Khoảng cách Hamming d giữa các từ mã:
  phát hiện tới (d - 1) lỗi
  sửa tới floor((d - 1) / 2) lỗi
</code></pre>
<div class="callout"><span class="badge">Hai giới hạn, một hệ thống</span> Mã nguồn đẩy về H (số bit ít nhất cần thiết); mã kênh đẩy về C (số bit nhiều nhất kênh tải được không lỗi). Hệ thực nén trước, rồi bảo vệ sau.</div>`,
  ]]);

const c7q = quiz('cos201c-quiz-7', 'Quiz 7 — Source & channel coding|||Quiz 7 — Mã nguồn & mã kênh', [
  { id: 'q1', question: 'Mã Huffman thuộc loại mã nào và làm gì?', options: ['Mã kênh, thêm bit dư', 'Mã nguồn, nén bằng cách bỏ dư thừa', 'Mã mật, mã hoá bảo mật', 'Mã đường truyền, tăng công suất'], correctIndex: 1, explanation: 'Huffman là mã nguồn (nén): gán từ mã ngắn cho ký hiệu hay gặp, tiến tới entropy H.' },
  { id: 'q2', question: 'Mục đích của mã hoá kênh (như Hamming) là gì?', options: ['Thu nhỏ dữ liệu', 'Thêm dư thừa có kiểm soát để phát hiện/sửa lỗi', 'Tăng băng thông kênh', 'Loại bỏ sóng mang'], correctIndex: 1, explanation: 'Mã kênh thêm bit dư có kiểm soát để bên thu phát hiện và sửa lỗi do nhiễu.' },
  { id: 'q3', question: 'Với khoảng cách Hamming d giữa các từ mã, số lỗi sửa được tối đa là?', options: ['d lỗi', 'floor((d-1)/2) lỗi', 'd+1 lỗi', '0 lỗi'], correctIndex: 1, explanation: 'Sửa tới floor((d-1)/2) lỗi và phát hiện tới (d-1) lỗi.' },
]);

const c8 = doc('cos201c-8-1-multiple-access', '8.1 — Multiple access, wireless & robot applications|||8.1 — Đa truy nhập, không dây & ứng dụng robot',
  'Chia sẻ kênh: FDMA/TDMA/CDMA/OFDMA; kênh không dây (pha-đinh, đa đường, OFDM); ứng dụng robot: Wi-Fi/BLE/LoRa/5G, độ trễ vs tầm vs tốc độ, robot cần gì.',
  [[
    `<span class="eyebrow">COS201c · Chapter 8 · Lesson 8.1</span>
<h2>Multiple access, wireless &amp; robot applications</h2>
<h3>Sharing one channel among many users</h3>
<p>Many devices must share the same medium. <strong>Multiple-access</strong> schemes divide it up:</p>
<ul>
<li><strong>FDMA</strong> — each user gets a different frequency band.</li>
<li><strong>TDMA</strong> — users take turns in different time slots.</li>
<li><strong>CDMA</strong> — users share time and frequency but use different spreading codes.</li>
<li><strong>OFDMA</strong> — the band is split into many orthogonal subcarriers shared flexibly (Wi-Fi, LTE, 5G).</li>
</ul>
<h3>The wireless channel</h3>
<p>Radio suffers <strong>fading</strong> (signal strength varies) and <strong>multipath</strong> (echoes arrive at different times). <strong>OFDM</strong> tames multipath by sending many slow subcarriers in parallel instead of one fast stream.</p>
<h3>Communication for robots</h3>
<pre><code>Link       Range     Rate        Best for
Wi-Fi      ~50 m     high        video, teleop, maps
BLE        ~10 m     low         sensors, config
LoRa       km        very low    remote telemetry
5G / LTE   wide      high        cloud robotics, low latency
</code></pre>
<p>A robot designer trades <strong>range, data rate, latency and power</strong>. A camera stream needs Wi-Fi or 5G; a battery field sensor needs LoRa's range at low bit rate; a safety stop command needs low latency above all.</p>
<div class="callout"><span class="badge">Full circle</span> Every choice here comes back to Chapters 1-7: bandwidth, SNR, modulation order, coding and the Shannon limit decide what a robot's radio can actually do.</div>`,
    `<span class="eyebrow">COS201c · Chương 8 · Bài 8.1</span>
<h2>Đa truy nhập, không dây &amp; ứng dụng robot</h2>
<h3>Chia sẻ một kênh cho nhiều người dùng</h3>
<p>Nhiều thiết bị phải dùng chung một môi trường. Các sơ đồ <strong>đa truy nhập</strong> chia nó ra:</p>
<ul>
<li><strong>FDMA</strong> — mỗi người dùng một dải tần khác nhau.</li>
<li><strong>TDMA</strong> — người dùng thay phiên theo khe thời gian khác nhau.</li>
<li><strong>CDMA</strong> — dùng chung thời gian và tần số nhưng mỗi người một mã trải phổ khác nhau.</li>
<li><strong>OFDMA</strong> — dải tần chia thành nhiều sóng mang con trực giao, chia sẻ linh hoạt (Wi-Fi, LTE, 5G).</li>
</ul>
<h3>Kênh không dây</h3>
<p>Vô tuyến chịu <strong>pha-đinh</strong> (cường độ tín hiệu dao động) và <strong>đa đường</strong> (các tiếng vọng tới lệch thời gian). <strong>OFDM</strong> khắc chế đa đường bằng cách gửi nhiều sóng mang con chậm song song thay vì một dòng nhanh.</p>
<h3>Truyền thông cho robot</h3>
<pre><code>Đường     Tầm       Tốc độ      Hợp cho
Wi-Fi     ~50 m     cao         video, điều khiển từ xa, bản đồ
BLE       ~10 m     thấp        cảm biến, cấu hình
LoRa      km        rất thấp    đo xa từ xa
5G / LTE  rộng      cao         robot đám mây, độ trễ thấp
</code></pre>
<p>Người thiết kế robot đánh đổi giữa <strong>tầm, tốc độ dữ liệu, độ trễ và công suất</strong>. Luồng camera cần Wi-Fi hoặc 5G; cảm biến chạy pin ngoài đồng cần tầm xa của LoRa ở tốc độ thấp; lệnh dừng an toàn cần độ trễ thấp trên hết.</p>
<div class="callout"><span class="badge">Khép vòng</span> Mọi lựa chọn ở đây đều quay về Chương 1-7: băng thông, SNR, bậc điều chế, mã hoá và giới hạn Shannon quyết định vô tuyến của robot thật sự làm được gì.</div>`,
  ]]);

const c8q = quiz('cos201c-quiz-8', 'Quiz 8 — Multiple access & robots|||Quiz 8 — Đa truy nhập & robot', [
  { id: 'q1', question: 'Trong sơ đồ đa truy nhập nào, các người dùng dùng chung thời gian và tần số nhưng phân biệt bằng mã trải phổ?', options: ['FDMA', 'TDMA', 'CDMA', 'Không sơ đồ nào'], correctIndex: 2, explanation: 'CDMA: chia sẻ cả thời gian và tần số, phân biệt người dùng bằng mã trải phổ riêng.' },
  { id: 'q2', question: 'OFDM khắc chế hiện tượng đa đường (multipath) bằng cách nào?', options: ['Tăng công suất phát', 'Gửi nhiều sóng mang con chậm song song thay vì một dòng nhanh', 'Bỏ hẳn sóng mang', 'Giảm băng thông về 0'], correctIndex: 1, explanation: 'OFDM chia thành nhiều sóng mang con trực giao chậm song song, giảm ảnh hưởng đa đường.' },
  { id: 'q3', question: 'Cảm biến robot chạy pin ngoài đồng, gửi ít dữ liệu nhưng cần tầm xa nhất, nên chọn đường nào?', options: ['BLE', 'Wi-Fi', 'LoRa', 'Cáp quang'], correctIndex: 2, explanation: 'LoRa cho tầm km ở tốc độ rất thấp, tiết kiệm pin — hợp đo xa từ xa.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'COS201c',
    slug: 'cos201c-communication-systems',
    title: 'Communication Systems',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/COS201c.webp',
    shortDescription: 'How information travels — the block model, Fourier & bandwidth, analog modulation (AM/FM/PM), sampling & PCM, digital modulation (ASK/FSK/PSK/QAM), noise & Shannon limit, coding, multiple access & wireless for robots. Bilingual, with examples & quizzes.|||Thông tin truyền đi thế nào — mô hình khối, Fourier & băng thông, điều chế tương tự (AM/FM/PM), lấy mẫu & PCM, điều chế số (ASK/FSK/PSK/QAM), nhiễu & dung lượng Shannon, mã hoá, đa truy nhập & không dây cho robot. Song ngữ, có quiz.',
    description: 'Môn <strong>COS201c — Communication Systems</strong> (Hệ thống truyền thông, ngành Robotics &amp; AI) giải thích <strong>thông tin di chuyển từ điểm này tới điểm khác thế nào</strong>. Từ <strong>mô hình khối &amp; phân tích tín hiệu</strong> (Fourier, phổ, băng thông, SNR) → <strong>điều chế tương tự</strong> (AM/FM/PM) → <strong>số hoá</strong> (lấy mẫu Nyquist, PCM) → <strong>điều chế số</strong> (ASK/FSK/PSK/QAM) → <strong>nhiễu &amp; lý thuyết thông tin</strong> (entropy, dung lượng Shannon) → <strong>mã hoá nguồn &amp; kênh</strong> (Huffman, Hamming) → <strong>đa truy nhập &amp; không dây</strong> cho robot. Bám giáo trình Proakis, Haykin, Lathi; song ngữ, có ví dụ tính toán và quiz mỗi chương.',
    whatYouLearn: 'Mô hình nguồn/phát/kênh/thu/đích, băng thông &amp; SNR, dB; Fourier, phổ, hệ LTI &amp; lọc; AM/FM/PM, chỉ số điều chế, quy tắc Carson; lấy mẫu Nyquist, lượng tử, PCM (R=n*fs); ASK/FSK/PSK/QAM, chòm sao, bit/ký hiệu; nhiễu AWGN, entropy, dung lượng Shannon C=B*log2(1+SNR); mã Huffman, parity/Hamming, khoảng cách Hamming; FDMA/TDMA/CDMA/OFDMA, kênh không dây, chọn đường truyền cho robot.',
    requirements: 'Toán giải tích &amp; xác suất cơ bản, tín hiệu &amp; hệ thống, và điện tử cơ bản. Nên biết Python/NumPy hoặc Octave/MATLAB để chạy demo.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách Proakis/Haykin/Lathi, tài liệu miễn phí, YouTube, công cụ.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Mô hình khối, băng thông, SNR, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & mô hình|||Chapter 1 — Overview & model', description: 'Khối, analog vs số, kênh, dB.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Phân tích tín hiệu|||Chapter 2 — Signal analysis', description: 'Fourier, phổ, băng thông, LTI, lọc.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Điều chế tương tự|||Chapter 3 — Analog modulation', description: 'AM, FM, PM, quy tắc Carson.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Số hoá tín hiệu|||Chapter 4 — Digitizing signals', description: 'Lấy mẫu Nyquist, lượng tử, PCM.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Điều chế số|||Chapter 5 — Digital modulation', description: 'ASK/FSK/PSK/QAM, chòm sao.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Nhiễu & lý thuyết thông tin|||Chapter 6 — Noise & information theory', description: 'AWGN, entropy, dung lượng Shannon.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Mã hoá nguồn & kênh|||Chapter 7 — Source & channel coding', description: 'Huffman, parity/Hamming, sửa lỗi.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đa truy nhập & không dây|||Chapter 8 — Multiple access & wireless', description: 'FDMA/TDMA/CDMA/OFDMA, robot.', lessons: [c8, c8q] },
  ],
};
