/**
 * DGT302 — Digital Signal Processing / Xử lý tín hiệu số.
 * Ngành Thiết kế vi mạch bán dẫn FPTU (Kỳ 4). Nền DSP: tín hiệu & hệ rời rạc,
 * lấy mẫu, biến đổi Z, DTFT, DFT/FFT, thiết kế bộ lọc FIR/IIR, ứng dụng.
 * Song ngữ + công thức + ví dụ + quiz. Sách chuẩn: Oppenheim & Schafer
 * "Discrete-Time Signal Processing"; Proakis "Digital Signal Processing";
 * MIT 6.341; scipy.signal. Giữ NGUYÊN slug/semester/thumb(v3).
 * ⚠️ KHÔNG backtick/${ lồng trong HTML; "\n"→\\n; "&"→&amp; trong content.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('dgt302-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Oppenheim & Schafer, Proakis), MIT 6.341, scipy.signal, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">DGT302 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Digital Signal Processing — discrete signals &amp; LTI systems, sampling, the Z and Fourier transforms, DFT/FFT, and FIR/IIR filter design — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for DGT302 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><em>Discrete-Time Signal Processing</em> — Oppenheim &amp; Schafer (the field standard)</li>
<li><em>Digital Signal Processing</em> — Proakis &amp; Manolakis</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/6-341-discrete-time-signal-processing-fall-2005/" target="_blank" rel="noopener">MIT 6.341 — Discrete-Time Signal Processing (OpenCourseWare)</a></li>
<li><a href="https://docs.scipy.org/doc/scipy/reference/signal.html" target="_blank" rel="noopener">scipy.signal — filter design &amp; spectral analysis API</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@iiitkalyani" target="_blank" rel="noopener">DSP lectures</a> — transforms &amp; filter design worked out</li>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — the Fourier transform, visually</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.python.org/" target="_blank" rel="noopener">Python + NumPy + scipy.signal</a> — design filters &amp; run FFTs</li>
<li><a href="https://jupyter.org/" target="_blank" rel="noopener">Jupyter Notebook</a> — plot spectra &amp; impulse responses interactively</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — discrete signals x[n], LTI systems, convolution; sampling &amp; the Nyquist theorem.</li>
<li><strong>Transforms</strong> — Z-transform &amp; ROC, DTFT &amp; frequency response, DFT/FFT for spectral analysis.</li>
<li><strong>Design</strong> — FIR filters (windowing, linear phase) and IIR filters (Butterworth/Chebyshev, bilinear transform).</li>
<li><strong>Job-ready</strong> — apply DSP to audio/image, noise removal, and real-time processing on a DSP chip or FPGA.</li>
</ol></div>`,
    `<span class="eyebrow">DGT302 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Xử lý tín hiệu số — tín hiệu &amp; hệ rời rạc, lấy mẫu, biến đổi Z và Fourier, DFT/FFT, thiết kế bộ lọc FIR/IIR — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của DGT302 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><em>Discrete-Time Signal Processing</em> — Oppenheim &amp; Schafer (sách chuẩn của ngành)</li>
<li><em>Digital Signal Processing</em> — Proakis &amp; Manolakis</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://ocw.mit.edu/courses/6-341-discrete-time-signal-processing-fall-2005/" target="_blank" rel="noopener">MIT 6.341 — Discrete-Time Signal Processing (OpenCourseWare)</a></li>
<li><a href="https://docs.scipy.org/doc/scipy/reference/signal.html" target="_blank" rel="noopener">scipy.signal — API thiết kế bộ lọc &amp; phân tích phổ</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@iiitkalyani" target="_blank" rel="noopener">Bài giảng DSP</a> — biến đổi &amp; thiết kế bộ lọc giải chi tiết</li>
<li><a href="https://www.youtube.com/@3blue1brown" target="_blank" rel="noopener">3Blue1Brown</a> — biến đổi Fourier bằng hình ảnh</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.python.org/" target="_blank" rel="noopener">Python + NumPy + scipy.signal</a> — thiết kế bộ lọc &amp; chạy FFT</li>
<li><a href="https://jupyter.org/" target="_blank" rel="noopener">Jupyter Notebook</a> — vẽ phổ &amp; đáp ứng xung tương tác</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — tín hiệu rời rạc x[n], hệ LTI, tích chập; lấy mẫu &amp; định lý Nyquist.</li>
<li><strong>Biến đổi</strong> — biến đổi Z &amp; ROC, DTFT &amp; đáp ứng tần số, DFT/FFT để phân tích phổ.</li>
<li><strong>Thiết kế</strong> — bộ lọc FIR (cửa sổ, pha tuyến tính) và bộ lọc IIR (Butterworth/Chebyshev, biến đổi song tuyến).</li>
<li><strong>Sẵn sàng đi làm</strong> — áp dụng DSP cho âm thanh/ảnh, lọc nhiễu, xử lý thời gian thực trên chip DSP hoặc FPGA.</li>
</ol></div>`,
  ]]);

const intro = doc('dgt302-0-1-overview', 'Course overview: Digital Signal Processing|||Tổng quan: Xử lý tín hiệu số',
  'DSP là gì; tín hiệu tương tự vs số; vì sao xử lý bằng số; lộ trình: tín hiệu & hệ rời rạc → lấy mẫu → biến đổi Z/DTFT → DFT/FFT → thiết kế bộ lọc FIR/IIR → ứng dụng.',
  [[
    `<span class="eyebrow">DGT302 · Lesson 0.1 · Overview</span>
<h2>Digital Signal Processing</h2>
<p class="lead">This course teaches how to <strong>represent, analyze and transform signals with numbers</strong>. A signal is anything that carries information over time — sound, an image row, a sensor reading. DSP samples it into a sequence <code>x[n]</code>, then filters, transforms and reshapes it using arithmetic that runs on a CPU, a DSP chip or an FPGA.</p>
<h3>Why do it digitally?</h3>
<ul>
<li><strong>Exact &amp; repeatable</strong> — the same numbers give the same result, with no drift from temperature or aging parts.</li>
<li><strong>Programmable</strong> — change the algorithm, not the hardware; one chip runs many filters.</li>
<li><strong>Powerful</strong> — the FFT and digital filters do things analog circuits cannot practically match.</li>
</ul>
<h3>Roadmap</h3>
<p>Discrete signals &amp; LTI systems (convolution) → sampling &amp; reconstruction (Nyquist) → the Z-transform → the DTFT &amp; frequency response → DFT &amp; FFT → FIR filter design → IIR filter design → real-world DSP applications. Bilingual, with formulas, worked examples and a quiz per chapter.</p>`,
    `<span class="eyebrow">DGT302 · Bài 0.1 · Tổng quan</span>
<h2>Xử lý tín hiệu số</h2>
<p class="lead">Môn này dạy cách <strong>biểu diễn, phân tích và biến đổi tín hiệu bằng con số</strong>. Tín hiệu là bất cứ thứ gì mang thông tin theo thời gian — âm thanh, một hàng điểm ảnh, số đo cảm biến. DSP lấy mẫu nó thành dãy <code>x[n]</code>, rồi lọc, biến đổi và nắn lại bằng các phép tính chạy trên CPU, chip DSP hay FPGA.</p>
<h3>Vì sao xử lý bằng số?</h3>
<ul>
<li><strong>Chính xác &amp; lặp lại được</strong> — cùng bộ số cho cùng kết quả, không trôi theo nhiệt độ hay linh kiện lão hoá.</li>
<li><strong>Lập trình được</strong> — đổi thuật toán chứ không đổi phần cứng; một con chip chạy được nhiều bộ lọc.</li>
<li><strong>Mạnh</strong> — FFT và bộ lọc số làm được những việc mạch analog khó lòng đạt tới.</li>
</ul>
<h3>Lộ trình</h3>
<p>Tín hiệu &amp; hệ LTI rời rạc (tích chập) → lấy mẫu &amp; khôi phục (Nyquist) → biến đổi Z → DTFT &amp; đáp ứng tần số → DFT &amp; FFT → thiết kế bộ lọc FIR → thiết kế bộ lọc IIR → ứng dụng DSP thực tế. Song ngữ, có công thức, ví dụ mẫu và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('dgt302-1-1-signals-systems', '1.1 — Discrete signals &amp; LTI systems|||1.1 — Tín hiệu &amp; hệ rời rạc',
  'Tín hiệu rời rạc x[n], các tín hiệu cơ bản (xung đơn vị, bậc thang, mũ); hệ LTI (tuyến tính, bất biến thời gian); tích chập y[n] = x[n] * h[n].',
  [[
    `<span class="eyebrow">DGT302 · Chapter 1 · Lesson 1.1</span>
<h2>Discrete signals &amp; LTI systems</h2>
<h3>The discrete signal x[n]</h3>
<p>A <strong>discrete-time signal</strong> <code>x[n]</code> is a sequence of numbers indexed by an integer n (a sample count), not continuous time. Building blocks:</p>
<ul>
<li><strong>Unit impulse</strong> δ[n] — equals 1 at n=0, else 0. Every signal is a sum of shifted, scaled impulses.</li>
<li><strong>Unit step</strong> u[n] — equals 1 for n ≥ 0, else 0.</li>
<li><strong>Exponential</strong> x[n] = a^n — grows or decays; the sinusoid is its complex-valued cousin.</li>
</ul>
<h3>LTI systems</h3>
<p>A system that is both <strong>Linear</strong> (scaling &amp; adding inputs scales &amp; adds outputs) and <strong>Time-Invariant</strong> (a delayed input just delays the output) is an <strong>LTI system</strong>. An LTI system is fully described by its <strong>impulse response</strong> h[n] — the output when the input is δ[n].</p>
<h3>Convolution</h3>
<p>Once you know h[n], the output for any input is the <strong>convolution</strong> sum:</p>
<pre><code>y[n] = x[n] * h[n] = Σ  x[k] · h[n - k]     (sum over k)

Example: x[n] = {1, 2, 3},  h[n] = {1, 1}
 y[0] = 1·1               = 1
 y[1] = 2·1 + 1·1         = 3
 y[2] = 3·1 + 2·1         = 5
 y[3] = 3·1               = 3
 y[n] = {1, 3, 5, 3}   (a 2-point moving sum)</code></pre>
<div class="callout"><span class="badge">Key idea</span> Convolution IS the LTI system. Filtering, echo, smoothing — all are one signal convolved with a chosen h[n].</div>`,
    `<span class="eyebrow">DGT302 · Chương 1 · Bài 1.1</span>
<h2>Tín hiệu &amp; hệ rời rạc</h2>
<h3>Tín hiệu rời rạc x[n]</h3>
<p>Một <strong>tín hiệu thời gian rời rạc</strong> <code>x[n]</code> là một dãy số đánh chỉ số bằng số nguyên n (thứ tự mẫu), không phải thời gian liên tục. Các khối cơ bản:</p>
<ul>
<li><strong>Xung đơn vị</strong> δ[n] — bằng 1 tại n=0, còn lại bằng 0. Mọi tín hiệu là tổng các xung dịch và nhân hệ số.</li>
<li><strong>Bậc thang đơn vị</strong> u[n] — bằng 1 khi n ≥ 0, còn lại bằng 0.</li>
<li><strong>Hàm mũ</strong> x[n] = a^n — tăng hoặc giảm; tín hiệu sin là họ hàng phức của nó.</li>
</ul>
<h3>Hệ LTI</h3>
<p>Một hệ vừa <strong>Tuyến tính</strong> (nhân &amp; cộng đầu vào thì nhân &amp; cộng đầu ra) vừa <strong>Bất biến thời gian</strong> (trễ đầu vào chỉ làm trễ đầu ra) là một <strong>hệ LTI</strong>. Hệ LTI được mô tả trọn vẹn bởi <strong>đáp ứng xung</strong> h[n] — đầu ra khi đầu vào là δ[n].</p>
<h3>Tích chập</h3>
<p>Biết h[n] rồi thì đầu ra cho mọi đầu vào là tổng <strong>tích chập</strong>:</p>
<pre><code>y[n] = x[n] * h[n] = Σ  x[k] · h[n - k]     (tổng theo k)

Ví dụ: x[n] = {1, 2, 3},  h[n] = {1, 1}
 y[0] = 1·1               = 1
 y[1] = 2·1 + 1·1         = 3
 y[2] = 3·1 + 2·1         = 5
 y[3] = 3·1               = 3
 y[n] = {1, 3, 5, 3}   (tổng trượt 2 điểm)</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Tích chập CHÍNH LÀ hệ LTI. Lọc, tạo tiếng vọng, làm mượt — tất cả là một tín hiệu tích chập với h[n] chọn trước.</div>`,
  ]]);

const c1q = quiz('dgt302-quiz-1', 'Quiz 1 — Signals & LTI|||Quiz 1 — Tín hiệu & LTI', [
  { id: 'q1', question: 'Đáp ứng xung h[n] của hệ LTI là gì?', options: ['Đầu ra khi đầu vào là bậc thang u[n]', 'Đầu ra khi đầu vào là xung đơn vị δ[n]', 'Đầu vào khi đầu ra bằng 0', 'Trung bình của tín hiệu'], correctIndex: 1, explanation: 'h[n] là đầu ra của hệ khi kích thích bằng xung đơn vị δ[n].' },
  { id: 'q2', question: 'Đầu ra của hệ LTI với đầu vào x[n] được tính bằng?', options: ['Nhân từng điểm x[n]·h[n]', 'Tích chập x[n] * h[n]', 'Cộng x[n] + h[n]', 'Biến đổi Fourier của x[n]'], correctIndex: 1, explanation: 'y[n] = x[n] * h[n] = tổng x[k]·h[n-k].' },
  { id: 'q3', question: 'Tính chất "bất biến thời gian" nghĩa là?', options: ['Trễ đầu vào thì đầu ra cũng trễ đúng bằng vậy', 'Đầu ra không đổi theo đầu vào', 'Hệ không có nhớ', 'Tín hiệu tuần hoàn'], correctIndex: 0, explanation: 'Bất biến thời gian: dịch đầu vào n0 mẫu thì đầu ra dịch đúng n0 mẫu.' },
]);

const c2 = doc('dgt302-2-1-sampling', '2.1 — Sampling &amp; reconstruction|||2.1 — Lấy mẫu &amp; khôi phục',
  'Lấy mẫu tín hiệu tương tự thành số; định lý lấy mẫu Nyquist (fs > 2·fmax); hiện tượng chồng phổ (aliasing); ADC/DAC và bộ lọc chống chồng phổ.',
  [[
    `<span class="eyebrow">DGT302 · Chapter 2 · Lesson 2.1</span>
<h2>Sampling &amp; reconstruction</h2>
<h3>From analog to digital</h3>
<p><strong>Sampling</strong> reads an analog signal x(t) every T seconds to get x[n] = x(nT). The <strong>sampling rate</strong> is fs = 1/T (samples per second). An <strong>ADC</strong> (analog-to-digital converter) does this and also quantizes each value to a finite number of bits; a <strong>DAC</strong> reverses it.</p>
<h3>The Nyquist sampling theorem</h3>
<p>To capture a signal without losing information, you must sample <em>fast enough</em>:</p>
<pre><code>Nyquist:  fs > 2 · fmax

fmax  = highest frequency present in the signal
fs/2  = the "Nyquist frequency" (the fold point)

Example: audio up to 20 kHz  ->  fs > 40 kHz
         CD uses fs = 44.1 kHz  (safely above 40 kHz)</code></pre>
<h3>Aliasing</h3>
<p>If you sample too slowly (fs ≤ 2·fmax), high frequencies <strong>fold back</strong> and masquerade as lower ones — this is <strong>aliasing</strong>, and it is irreversible. The wagon-wheel that seems to spin backward in films is aliasing in time. The fix: an <strong>anti-aliasing filter</strong> (analog low-pass) removes content above fs/2 <em>before</em> the ADC.</p>
<div class="callout"><span class="badge">Rule of thumb</span> Sample above twice the highest frequency, and always low-pass filter before sampling. Aliased data cannot be un-aliased later.</div>`,
    `<span class="eyebrow">DGT302 · Chương 2 · Bài 2.1</span>
<h2>Lấy mẫu &amp; khôi phục</h2>
<h3>Từ tương tự sang số</h3>
<p><strong>Lấy mẫu</strong> đọc tín hiệu tương tự x(t) sau mỗi T giây để được x[n] = x(nT). <strong>Tần số lấy mẫu</strong> là fs = 1/T (mẫu mỗi giây). Một <strong>ADC</strong> (bộ chuyển tương tự-số) làm việc này và còn lượng tử hoá mỗi giá trị về số bit hữu hạn; một <strong>DAC</strong> làm ngược lại.</p>
<h3>Định lý lấy mẫu Nyquist</h3>
<p>Để nắm tín hiệu mà không mất thông tin, phải lấy mẫu <em>đủ nhanh</em>:</p>
<pre><code>Nyquist:  fs > 2 · fmax

fmax  = tần số cao nhất có trong tín hiệu
fs/2  = "tần số Nyquist" (điểm gập phổ)

Ví dụ: âm thanh tới 20 kHz  ->  fs > 40 kHz
        CD dùng fs = 44,1 kHz  (an toàn trên 40 kHz)</code></pre>
<h3>Chồng phổ (aliasing)</h3>
<p>Nếu lấy mẫu quá chậm (fs ≤ 2·fmax), các tần số cao <strong>gập ngược</strong> lại và giả dạng thành tần số thấp hơn — đó là <strong>chồng phổ</strong>, và nó không đảo ngược được. Bánh xe như quay ngược trong phim chính là chồng phổ theo thời gian. Cách chữa: một <strong>bộ lọc chống chồng phổ</strong> (thông thấp analog) loại bỏ thành phần trên fs/2 <em>trước</em> khi vào ADC.</p>
<div class="callout"><span class="badge">Quy tắc nhớ</span> Lấy mẫu trên gấp đôi tần số cao nhất, và luôn lọc thông thấp trước khi lấy mẫu. Dữ liệu đã chồng phổ thì về sau không gỡ ra được.</div>`,
  ]]);

const c2q = quiz('dgt302-quiz-2', 'Quiz 2 — Sampling|||Quiz 2 — Lấy mẫu', [
  { id: 'q1', question: 'Định lý Nyquist yêu cầu tần số lấy mẫu fs thế nào?', options: ['fs > fmax', 'fs > 2·fmax', 'fs = fmax', 'fs < fmax/2'], correctIndex: 1, explanation: 'Phải lấy mẫu nhanh hơn gấp đôi tần số cao nhất: fs > 2·fmax.' },
  { id: 'q2', question: 'Chồng phổ (aliasing) xảy ra khi nào?', options: ['Lấy mẫu quá nhanh', 'Lấy mẫu quá chậm (fs ≤ 2·fmax)', 'Dùng bộ lọc thông thấp', 'Tín hiệu là DC'], correctIndex: 1, explanation: 'Lấy mẫu dưới Nyquist làm tần số cao gập ngược thành tần số thấp giả.' },
  { id: 'q3', question: 'Bộ lọc chống chồng phổ (anti-aliasing) đặt ở đâu?', options: ['Sau DAC', 'Trước ADC, loại thành phần trên fs/2', 'Bên trong FFT', 'Không cần dùng'], correctIndex: 1, explanation: 'Lọc thông thấp trước ADC để bỏ nội dung trên fs/2 trước khi lấy mẫu.' },
]);

const c3 = doc('dgt302-3-1-z-transform', '3.1 — The Z-transform|||3.1 — Biến đổi Z',
  'Biến đổi Z X(z) = Σ x[n]·z^(-n); miền hội tụ (ROC); tính chất (dịch, tuyến tính, tích chập → nhân); hàm truyền H(z) và cực/không của hệ.',
  [[
    `<span class="eyebrow">DGT302 · Chapter 3 · Lesson 3.1</span>
<h2>The Z-transform</h2>
<h3>Definition</h3>
<p>The <strong>Z-transform</strong> turns a sequence into a function of a complex variable z — the discrete-time counterpart of the Laplace transform:</p>
<pre><code>X(z) = Σ  x[n] · z^(-n)      (sum over all n)

Example: x[n] = a^n · u[n]  (a decaying exponential)
 X(z) = Σ a^n z^(-n) = 1 / (1 - a·z^(-1))   for |z| &gt; |a|</code></pre>
<h3>Region of convergence (ROC)</h3>
<p>The sum only converges for some values of z — that set is the <strong>ROC</strong>. The ROC matters: the same X(z) formula with different ROCs describes different signals, and the ROC decides <strong>stability</strong> and <strong>causality</strong>.</p>
<h3>Key properties</h3>
<ul>
<li><strong>Linearity</strong> — a·x[n] + b·y[n] ↔ a·X(z) + b·Y(z).</li>
<li><strong>Time shift</strong> — x[n-k] ↔ z^(-k)·X(z). A delay of one sample is a factor z^(-1).</li>
<li><strong>Convolution → product</strong> — x[n] * h[n] ↔ X(z)·H(z). Hard convolution becomes easy multiplication.</li>
</ul>
<h3>Transfer function, poles &amp; zeros</h3>
<p>An LTI system has a <strong>transfer function</strong> H(z) = Y(z)/X(z), a ratio of polynomials. Its roots are the <strong>zeros</strong> (numerator) and <strong>poles</strong> (denominator). A causal system is <strong>stable</strong> when all poles lie <em>inside the unit circle</em> (|z| &lt; 1).</p>
<div class="callout"><span class="badge">Why it matters</span> Poles &amp; zeros are the DNA of a filter: their positions set the frequency response and whether the system blows up or settles.</div>`,
    `<span class="eyebrow">DGT302 · Chương 3 · Bài 3.1</span>
<h2>Biến đổi Z</h2>
<h3>Định nghĩa</h3>
<p><strong>Biến đổi Z</strong> biến một dãy thành hàm của biến phức z — bản rời rạc của biến đổi Laplace:</p>
<pre><code>X(z) = Σ  x[n] · z^(-n)      (tổng theo mọi n)

Ví dụ: x[n] = a^n · u[n]  (hàm mũ suy giảm)
 X(z) = Σ a^n z^(-n) = 1 / (1 - a·z^(-1))   với |z| &gt; |a|</code></pre>
<h3>Miền hội tụ (ROC)</h3>
<p>Tổng chỉ hội tụ với một số giá trị z — tập đó là <strong>ROC</strong>. ROC rất quan trọng: cùng một công thức X(z) với ROC khác nhau lại mô tả tín hiệu khác nhau, và ROC quyết định <strong>tính ổn định</strong> và <strong>tính nhân quả</strong>.</p>
<h3>Các tính chất chính</h3>
<ul>
<li><strong>Tuyến tính</strong> — a·x[n] + b·y[n] ↔ a·X(z) + b·Y(z).</li>
<li><strong>Dịch thời gian</strong> — x[n-k] ↔ z^(-k)·X(z). Trễ một mẫu là hệ số z^(-1).</li>
<li><strong>Tích chập → nhân</strong> — x[n] * h[n] ↔ X(z)·H(z). Tích chập khó biến thành phép nhân dễ.</li>
</ul>
<h3>Hàm truyền, cực &amp; không</h3>
<p>Hệ LTI có <strong>hàm truyền</strong> H(z) = Y(z)/X(z), là tỉ số hai đa thức. Nghiệm của chúng là các <strong>điểm không (zero)</strong> (tử số) và <strong>điểm cực (pole)</strong> (mẫu số). Hệ nhân quả <strong>ổn định</strong> khi mọi cực nằm <em>trong đường tròn đơn vị</em> (|z| &lt; 1).</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Cực &amp; không là ADN của bộ lọc: vị trí của chúng định ra đáp ứng tần số và việc hệ có vỡ hay ổn định.</div>`,
  ]]);

const c3q = quiz('dgt302-quiz-3', 'Quiz 3 — Z-transform|||Quiz 3 — Biến đổi Z', [
  { id: 'q1', question: 'Biến đổi Z của x[n] định nghĩa là?', options: ['Σ x[n]·z^(-n)', 'Σ x[n]·e^(jωn)', '∫ x(t)·e^(-st) dt', 'x[n]·h[n]'], correctIndex: 0, explanation: 'X(z) = tổng x[n]·z^(-n) theo mọi n.' },
  { id: 'q2', question: 'Trễ một mẫu x[n-1] tương ứng với thừa số nào trong miền Z?', options: ['z', 'z^(-1)', 'z^2', 'e^(jω)'], correctIndex: 1, explanation: 'Dịch một mẫu: x[n-1] ↔ z^(-1)·X(z).' },
  { id: 'q3', question: 'Hệ nhân quả ổn định khi các điểm cực (pole) nằm ở đâu?', options: ['Ngoài đường tròn đơn vị', 'Trên trục thực', 'Trong đường tròn đơn vị (|z| < 1)', 'Tại gốc toạ độ'], correctIndex: 2, explanation: 'Mọi cực nằm trong đường tròn đơn vị thì hệ nhân quả ổn định.' },
]);

const c4 = doc('dgt302-4-1-dtft', '4.1 — The DTFT &amp; frequency response|||4.1 — DTFT &amp; đáp ứng tần số',
  'Biến đổi Fourier thời gian rời rạc X(e^jω) = Σ x[n]·e^(-jωn); phổ biên độ/pha; đáp ứng tần số H(e^jω) của hệ; quan hệ với biến đổi Z trên đường tròn đơn vị.',
  [[
    `<span class="eyebrow">DGT302 · Chapter 4 · Lesson 4.1</span>
<h2>The DTFT &amp; frequency response</h2>
<h3>From samples to spectrum</h3>
<p>The <strong>Discrete-Time Fourier Transform (DTFT)</strong> asks: what frequencies make up x[n]?</p>
<pre><code>X(e^jω) = Σ  x[n] · e^(-jωn)      (sum over all n)

- ω is angular frequency in radians/sample, ranging over (-π, π]
- X(e^jω) is continuous in ω and periodic with period 2π</code></pre>
<h3>Magnitude &amp; phase spectrum</h3>
<p>X(e^jω) is complex, so it splits into two real curves: the <strong>magnitude</strong> |X(e^jω)| (how much of each frequency is present) and the <strong>phase</strong> ∠X(e^jω) (its timing/shift). The magnitude spectrum is what you see on a spectrum analyzer.</p>
<h3>Frequency response of a system</h3>
<p>Feed a system its impulse response h[n] through the DTFT and you get its <strong>frequency response</strong> H(e^jω). It tells you the gain and phase the filter applies at each frequency:</p>
<pre><code>Output spectrum = H(e^jω) · X(e^jω)

|H(e^jω)| small  ->  that band is attenuated (a "stop" band)
|H(e^jω)| ≈ 1    ->  that band passes through (a "pass" band)</code></pre>
<p>The DTFT is the Z-transform evaluated on the unit circle, z = e^jω — which is why poles near the circle create peaks in the response.</p>
<div class="callout"><span class="badge">Key idea</span> A filter is defined by the shape of |H(e^jω)|: low-pass keeps low ω, high-pass keeps high ω, band-pass keeps a middle band.</div>`,
    `<span class="eyebrow">DGT302 · Chương 4 · Bài 4.1</span>
<h2>DTFT &amp; đáp ứng tần số</h2>
<h3>Từ mẫu sang phổ</h3>
<p><strong>Biến đổi Fourier thời gian rời rạc (DTFT)</strong> hỏi: x[n] gồm những tần số nào?</p>
<pre><code>X(e^jω) = Σ  x[n] · e^(-jωn)      (tổng theo mọi n)

- ω là tần số góc, đơn vị radian/mẫu, chạy trong (-π, π]
- X(e^jω) liên tục theo ω và tuần hoàn chu kỳ 2π</code></pre>
<h3>Phổ biên độ &amp; pha</h3>
<p>X(e^jω) là số phức, nên tách thành hai đường thực: <strong>biên độ</strong> |X(e^jω)| (mỗi tần số có mặt bao nhiêu) và <strong>pha</strong> ∠X(e^jω) (thời điểm/độ dịch). Phổ biên độ chính là thứ ta thấy trên máy phân tích phổ.</p>
<h3>Đáp ứng tần số của hệ</h3>
<p>Đưa đáp ứng xung h[n] qua DTFT sẽ được <strong>đáp ứng tần số</strong> H(e^jω). Nó cho biết độ lợi và pha mà bộ lọc áp lên từng tần số:</p>
<pre><code>Phổ đầu ra = H(e^jω) · X(e^jω)

|H(e^jω)| nhỏ  ->  dải đó bị suy giảm (dải "chặn")
|H(e^jω)| ≈ 1  ->  dải đó đi qua (dải "thông")</code></pre>
<p>DTFT là biến đổi Z lấy trên đường tròn đơn vị, z = e^jω — vì thế các cực gần đường tròn tạo ra đỉnh nhọn trong đáp ứng.</p>
<div class="callout"><span class="badge">Ý chính</span> Bộ lọc được định nghĩa bởi hình dạng của |H(e^jω)|: thông thấp giữ ω nhỏ, thông cao giữ ω lớn, thông dải giữ một dải giữa.</div>`,
  ]]);

const c4q = quiz('dgt302-quiz-4', 'Quiz 4 — DTFT|||Quiz 4 — DTFT', [
  { id: 'q1', question: 'DTFT X(e^jω) của x[n] được tính bằng?', options: ['Σ x[n]·z^(-n)', 'Σ x[n]·e^(-jωn)', 'Σ x[k]·h[n-k]', 'x[n]/h[n]'], correctIndex: 1, explanation: 'DTFT: X(e^jω) = tổng x[n]·e^(-jωn).' },
  { id: 'q2', question: 'DTFT tuần hoàn theo ω với chu kỳ bằng bao nhiêu?', options: ['π', '2π', 'fs', '1'], correctIndex: 1, explanation: 'X(e^jω) tuần hoàn chu kỳ 2π theo tần số góc ω.' },
  { id: 'q3', question: 'Đáp ứng tần số H(e^jω) của bộ lọc thông thấp lớn ở đâu?', options: ['Ở tần số cao', 'Ở tần số thấp (quanh ω = 0)', 'Ở mọi tần số như nhau', 'Chỉ tại ω = π'], correctIndex: 1, explanation: 'Thông thấp cho qua ω nhỏ (|H| ≈ 1 quanh ω=0), chặn ω cao.' },
]);

const c5 = doc('dgt302-5-1-dft-fft', '5.1 — DFT &amp; FFT|||5.1 — DFT &amp; FFT',
  'Biến đổi Fourier rời rạc DFT X[k] = Σ x[n]·e^(-j2πkn/N) cho tín hiệu N mẫu; thuật toán FFT hạ độ phức tạp N^2 → N·log N; phân tích phổ, độ phân giải tần số.',
  [[
    `<span class="eyebrow">DGT302 · Chapter 5 · Lesson 5.1</span>
<h2>DFT &amp; FFT</h2>
<h3>The DFT — a computable spectrum</h3>
<p>The DTFT is continuous in ω, so a computer cannot store it. The <strong>Discrete Fourier Transform (DFT)</strong> samples that spectrum at N evenly spaced points — a finite set of numbers you can actually compute:</p>
<pre><code>X[k] = Σ  x[n] · e^(-j2πkn/N)     n = 0..N-1,  k = 0..N-1

Each bin k corresponds to frequency  f_k = k · fs / N
Frequency resolution  Δf = fs / N   (more samples -> finer bins)</code></pre>
<h3>The FFT — the algorithm that made DSP practical</h3>
<p>Computing the DFT directly costs about <strong>N^2</strong> operations. The <strong>Fast Fourier Transform (FFT)</strong> (Cooley-Tukey) exploits symmetry to do it in <strong>N·log2(N)</strong> — the same answer, dramatically faster:</p>
<pre><code>N = 1024:
 direct DFT  ~ N^2       = 1,048,576 operations
 FFT         ~ N·log2 N  =    10,240 operations   (~100x fewer)</code></pre>
<h3>Spectral analysis</h3>
<p>Take an FFT of a block of samples and the magnitude |X[k]| shows the frequency content — the basis of spectrum analyzers, audio equalizers, tuning apps and modem demodulation. Watch two pitfalls: <strong>spectral leakage</strong> (fix with a window function) and limited resolution Δf = fs/N (fix with more samples or zero-padding).</p>
<div class="callout"><span class="badge">Why it matters</span> Almost every real DSP frequency task runs an FFT. Knowing bin spacing fs/N and windowing is the difference between a clean spectrum and a smeared one.</div>`,
    `<span class="eyebrow">DGT302 · Chương 5 · Bài 5.1</span>
<h2>DFT &amp; FFT</h2>
<h3>DFT — phổ tính được</h3>
<p>DTFT liên tục theo ω nên máy tính không lưu nổi. <strong>Biến đổi Fourier rời rạc (DFT)</strong> lấy mẫu phổ đó tại N điểm cách đều — một tập số hữu hạn thực sự tính được:</p>
<pre><code>X[k] = Σ  x[n] · e^(-j2πkn/N)     n = 0..N-1,  k = 0..N-1

Mỗi bin k ứng với tần số  f_k = k · fs / N
Độ phân giải tần số  Δf = fs / N   (càng nhiều mẫu -> bin càng mịn)</code></pre>
<h3>FFT — thuật toán khiến DSP khả thi</h3>
<p>Tính DFT trực tiếp tốn khoảng <strong>N^2</strong> phép tính. <strong>Biến đổi Fourier nhanh (FFT)</strong> (Cooley-Tukey) khai thác tính đối xứng để làm trong <strong>N·log2(N)</strong> — cùng kết quả, nhanh hơn rất nhiều:</p>
<pre><code>N = 1024:
 DFT trực tiếp  ~ N^2       = 1.048.576 phép tính
 FFT            ~ N·log2 N  =    10.240 phép tính   (~100 lần ít hơn)</code></pre>
<h3>Phân tích phổ</h3>
<p>Lấy FFT của một khối mẫu thì biên độ |X[k]| cho thấy thành phần tần số — nền của máy phân tích phổ, equalizer âm thanh, ứng dụng lên dây đàn, giải điều chế modem. Coi chừng hai bẫy: <strong>rò phổ (leakage)</strong> (chữa bằng hàm cửa sổ) và độ phân giải hữu hạn Δf = fs/N (chữa bằng thêm mẫu hoặc chèn số 0).</p>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Gần như mọi việc tần số trong DSP thực tế đều chạy FFT. Nắm khoảng cách bin fs/N và cửa sổ là ranh giới giữa phổ sạch và phổ nhoè.</div>`,
  ]]);

const c5q = quiz('dgt302-quiz-5', 'Quiz 5 — DFT & FFT|||Quiz 5 — DFT & FFT', [
  { id: 'q1', question: 'FFT hạ độ phức tạp tính DFT từ N^2 xuống còn?', options: ['N', 'N·log2(N)', 'log(N)', 'N^3'], correctIndex: 1, explanation: 'FFT tính DFT trong ~N·log2(N) thay vì N^2.' },
  { id: 'q2', question: 'Độ phân giải tần số của DFT N điểm với tần số lấy mẫu fs là?', options: ['fs·N', 'fs / N', 'N / fs', '2·fs'], correctIndex: 1, explanation: 'Khoảng cách bin Δf = fs/N; càng nhiều mẫu càng mịn.' },
  { id: 'q3', question: 'Hiện tượng "rò phổ" (spectral leakage) được giảm bằng?', options: ['Tăng biên độ tín hiệu', 'Áp một hàm cửa sổ (window) trước FFT', 'Giảm N', 'Bỏ pha đi'], correctIndex: 1, explanation: 'Hàm cửa sổ làm mềm hai đầu khối mẫu, giảm rò phổ.' },
]);

const c6 = doc('dgt302-6-1-fir', '6.1 — FIR filter design|||6.1 — Thiết kế bộ lọc FIR',
  'Bộ lọc đáp ứng xung hữu hạn (FIR); pha tuyến tính (không méo pha); thiết kế bằng phương pháp cửa sổ (window: Hamming, Hann, Blackman); ưu/nhược so với IIR.',
  [[
    `<span class="eyebrow">DGT302 · Chapter 6 · Lesson 6.1</span>
<h2>FIR filter design</h2>
<h3>What is a FIR filter?</h3>
<p>A <strong>Finite Impulse Response (FIR)</strong> filter has an impulse response of finite length — the output is a weighted sum of the last M+1 inputs, with no feedback:</p>
<pre><code>y[n] = Σ  b[k] · x[n-k]      k = 0..M

The coefficients b[k] ARE the impulse response h[k].
No feedback -> always stable.</code></pre>
<h3>Linear phase — the big advantage</h3>
<p>If the coefficients are <strong>symmetric</strong> (b[k] = b[M-k]), the filter has <strong>exactly linear phase</strong>: every frequency is delayed by the same amount, so the waveform shape is preserved (no phase distortion). This is why FIR filters are chosen for audio and image work where shape matters.</p>
<h3>The window method</h3>
<p>The ideal low-pass filter has an infinitely long sinc-shaped h[n]. You cannot store infinity, so you <strong>truncate</strong> it — but a hard cut causes ripples (the Gibbs phenomenon). A <strong>window function</strong> tapers the ends smoothly instead:</p>
<pre><code>b[k] = h_ideal[k] · w[k]

Windows (trade sharpness vs. ripple):
  Rectangular -> sharpest, worst ripple
  Hann / Hamming -> good all-round balance
  Blackman -> lowest ripple, widest transition</code></pre>
<div class="callout"><span class="badge">FIR vs IIR</span> FIR: always stable, linear phase, but needs many taps (higher cost). Use FIR when phase linearity matters more than efficiency.</div>`,
    `<span class="eyebrow">DGT302 · Chương 6 · Bài 6.1</span>
<h2>Thiết kế bộ lọc FIR</h2>
<h3>Bộ lọc FIR là gì?</h3>
<p>Bộ lọc <strong>đáp ứng xung hữu hạn (FIR)</strong> có đáp ứng xung dài hữu hạn — đầu ra là tổng có trọng số của M+1 mẫu vào gần nhất, không hồi tiếp:</p>
<pre><code>y[n] = Σ  b[k] · x[n-k]      k = 0..M

Các hệ số b[k] CHÍNH LÀ đáp ứng xung h[k].
Không hồi tiếp -> luôn ổn định.</code></pre>
<h3>Pha tuyến tính — ưu điểm lớn</h3>
<p>Nếu các hệ số <strong>đối xứng</strong> (b[k] = b[M-k]), bộ lọc có <strong>pha tuyến tính chính xác</strong>: mọi tần số bị trễ đúng bằng nhau, nên dạng sóng được giữ nguyên (không méo pha). Vì thế FIR được chọn cho âm thanh và ảnh, nơi hình dạng quan trọng.</p>
<h3>Phương pháp cửa sổ</h3>
<p>Bộ lọc thông thấp lý tưởng có h[n] dạng sinc dài vô hạn. Không lưu vô hạn được nên phải <strong>cắt ngắn</strong> — nhưng cắt cứng gây gợn sóng (hiện tượng Gibbs). Một <strong>hàm cửa sổ</strong> vuốt hai đầu mượt mà thay thế:</p>
<pre><code>b[k] = h_ly_tuong[k] · w[k]

Cửa sổ (đánh đổi độ sắc và gợn):
  Chữ nhật -> sắc nhất, gợn tệ nhất
  Hann / Hamming -> cân bằng tốt cho đa số
  Blackman -> gợn thấp nhất, dải chuyển rộng nhất</code></pre>
<div class="callout"><span class="badge">FIR so với IIR</span> FIR: luôn ổn định, pha tuyến tính, nhưng cần nhiều hệ số (tốn hơn). Dùng FIR khi pha tuyến tính quan trọng hơn hiệu suất.</div>`,
  ]]);

const c6q = quiz('dgt302-quiz-6', 'Quiz 6 — FIR|||Quiz 6 — FIR', [
  { id: 'q1', question: 'Vì sao bộ lọc FIR luôn ổn định?', options: ['Vì có hồi tiếp mạnh', 'Vì không có hồi tiếp (đáp ứng xung hữu hạn)', 'Vì dùng ít hệ số', 'Vì có pha phi tuyến'], correctIndex: 1, explanation: 'FIR không hồi tiếp, đáp ứng xung hữu hạn nên luôn ổn định.' },
  { id: 'q2', question: 'Điều kiện để FIR có pha tuyến tính là?', options: ['Hệ số đối xứng b[k] = b[M-k]', 'Hệ số toàn số dương', 'Có nhiều điểm cực', 'Dùng cửa sổ chữ nhật'], correctIndex: 0, explanation: 'Hệ số đối xứng cho pha tuyến tính, mọi tần số trễ như nhau.' },
  { id: 'q3', question: 'Hàm cửa sổ (Hamming, Blackman) dùng để làm gì khi thiết kế FIR?', options: ['Tăng độ lợi', 'Vuốt mượt đáp ứng bị cắt ngắn, giảm gợn Gibbs', 'Thêm hồi tiếp', 'Đổi tần số lấy mẫu'], correctIndex: 1, explanation: 'Cửa sổ vuốt hai đầu đáp ứng xung cắt ngắn, giảm gợn sóng.' },
]);

const c7 = doc('dgt302-7-1-iir', '7.1 — IIR filter design|||7.1 — Thiết kế bộ lọc IIR',
  'Bộ lọc đáp ứng xung vô hạn (IIR) có hồi tiếp; các mẫu prototype Butterworth/Chebyshev/Elliptic; biến đổi song tuyến (bilinear) từ analog sang số; đánh đổi với FIR.',
  [[
    `<span class="eyebrow">DGT302 · Chapter 7 · Lesson 7.1</span>
<h2>IIR filter design</h2>
<h3>What is an IIR filter?</h3>
<p>An <strong>Infinite Impulse Response (IIR)</strong> filter uses <strong>feedback</strong> — the output depends on past outputs as well as past inputs:</p>
<pre><code>y[n] = Σ b[k]·x[n-k] - Σ a[k]·y[n-k]     (feedback term)

Feedback -> very steep filters with FEW coefficients,
            but stability must be checked (poles inside |z| &lt; 1).</code></pre>
<h3>Classic analog prototypes</h3>
<p>IIR filters usually start from a well-studied analog design and are converted to digital. Each prototype trades ripple against sharpness:</p>
<ul>
<li><strong>Butterworth</strong> — maximally flat passband, gentle roll-off. The safe default.</li>
<li><strong>Chebyshev</strong> — steeper roll-off, at the cost of ripple (Type I in passband, Type II in stopband).</li>
<li><strong>Elliptic</strong> — steepest possible for a given order, ripple in both bands.</li>
</ul>
<h3>The bilinear transform</h3>
<p>To turn an analog design H(s) into a digital H(z), the <strong>bilinear transform</strong> maps the s-plane onto the z-plane, substituting s = (2/T)·(1 - z^(-1))/(1 + z^(-1)). It keeps stability intact but warps the frequency axis, so you <strong>pre-warp</strong> the critical frequencies first.</p>
<div class="callout"><span class="badge">FIR vs IIR</span> IIR: very efficient (few coefficients, steep cutoff) but nonlinear phase and can go unstable. Use IIR when you need a sharp filter cheaply and phase distortion is acceptable.</div>`,
    `<span class="eyebrow">DGT302 · Chương 7 · Bài 7.1</span>
<h2>Thiết kế bộ lọc IIR</h2>
<h3>Bộ lọc IIR là gì?</h3>
<p>Bộ lọc <strong>đáp ứng xung vô hạn (IIR)</strong> dùng <strong>hồi tiếp</strong> — đầu ra phụ thuộc cả đầu ra quá khứ lẫn đầu vào quá khứ:</p>
<pre><code>y[n] = Σ b[k]·x[n-k] - Σ a[k]·y[n-k]     (số hạng hồi tiếp)

Hồi tiếp -> bộ lọc rất dốc với ÍT hệ số,
            nhưng phải kiểm ổn định (cực nằm trong |z| &lt; 1).</code></pre>
<h3>Các prototype analog kinh điển</h3>
<p>Bộ lọc IIR thường xuất phát từ một thiết kế analog đã nghiên cứu kỹ rồi chuyển sang số. Mỗi prototype đánh đổi gợn với độ dốc:</p>
<ul>
<li><strong>Butterworth</strong> — dải thông phẳng tối đa, dốc thoải. Lựa chọn an toàn mặc định.</li>
<li><strong>Chebyshev</strong> — dốc hơn, đổi lại có gợn (Loại I ở dải thông, Loại II ở dải chặn).</li>
<li><strong>Elliptic</strong> — dốc nhất có thể với một bậc cho trước, gợn ở cả hai dải.</li>
</ul>
<h3>Biến đổi song tuyến</h3>
<p>Để biến thiết kế analog H(s) thành số H(z), <strong>biến đổi song tuyến (bilinear)</strong> ánh xạ mặt phẳng s sang mặt phẳng z, thay s = (2/T)·(1 - z^(-1))/(1 + z^(-1)). Nó giữ nguyên tính ổn định nhưng làm cong trục tần số, nên phải <strong>bù cong (pre-warp)</strong> các tần số then chốt trước.</p>
<div class="callout"><span class="badge">FIR so với IIR</span> IIR: rất hiệu quả (ít hệ số, cắt dốc) nhưng pha phi tuyến và có thể mất ổn định. Dùng IIR khi cần bộ lọc dốc mà rẻ và méo pha chấp nhận được.</div>`,
  ]]);

const c7q = quiz('dgt302-quiz-7', 'Quiz 7 — IIR|||Quiz 7 — IIR', [
  { id: 'q1', question: 'Điểm khác cốt lõi của IIR so với FIR là?', options: ['IIR có hồi tiếp (phụ thuộc đầu ra quá khứ)', 'IIR không có hệ số', 'IIR luôn ổn định', 'IIR có pha tuyến tính'], correctIndex: 0, explanation: 'IIR dùng hồi tiếp nên đạt độ dốc cao với ít hệ số, nhưng phải kiểm ổn định.' },
  { id: 'q2', question: 'Bộ lọc prototype nào có dải thông phẳng tối đa (maximally flat)?', options: ['Chebyshev', 'Butterworth', 'Elliptic', 'FIR cửa sổ'], correctIndex: 1, explanation: 'Butterworth cho dải thông phẳng nhất, roll-off thoải.' },
  { id: 'q3', question: 'Biến đổi song tuyến (bilinear) dùng để làm gì?', options: ['Chuyển thiết kế analog H(s) sang bộ lọc số H(z)', 'Tính FFT', 'Lấy mẫu tín hiệu', 'Tạo cửa sổ Hamming'], correctIndex: 0, explanation: 'Bilinear ánh xạ mặt phẳng s sang z, giữ ổn định (cần bù cong tần số).' },
]);

const c8 = doc('dgt302-8-1-applications', '8.1 — DSP applications|||8.1 — Ứng dụng DSP',
  'Ứng dụng thực tế: xử lý âm thanh (equalizer, nén, effect) và ảnh (làm sắc, làm mờ, phát hiện biên); lọc nhiễu; xử lý thời gian thực (độ trễ, khối/streaming); chạy trên chip DSP và FPGA.',
  [[
    `<span class="eyebrow">DGT302 · Chapter 8 · Lesson 8.1</span>
<h2>DSP applications</h2>
<h3>Audio &amp; image processing</h3>
<ul>
<li><strong>Audio</strong> — equalizers (band filters), compression (MP3/AAC use the FFT), echo/reverb (convolution), noise gates and voice effects.</li>
<li><strong>Image</strong> — an image is a 2-D signal; blur, sharpen and edge-detection are 2-D convolutions, and JPEG compresses with a cousin of the DFT (the DCT).</li>
</ul>
<h3>Noise filtering</h3>
<p>Real signals carry noise. A well-placed filter removes it: a <strong>low-pass</strong> filter smooths high-frequency hiss, a <strong>notch</strong> filter kills a single tone (e.g. 50/60 Hz mains hum on an ECG), and adaptive filters track noise that changes over time.</p>
<h3>Real-time processing</h3>
<p>Many systems must process samples <em>as they arrive</em>, within a fixed <strong>latency</strong> budget. Signals are handled in blocks (streaming), and the algorithm must finish each block before the next arrives:</p>
<pre><code>in -> [buffer block] -> [FIR/IIR/FFT] -> [output block] -> out
constraint:  processing time per block  &lt;  block duration</code></pre>
<h3>Where DSP runs: chips &amp; FPGA</h3>
<p>DSP maps naturally to hardware. A <strong>DSP chip</strong> has a multiply-accumulate (MAC) unit that computes b[k]·x[n-k] in one cycle — ideal for filters. An <strong>FPGA</strong> lays many MACs in parallel for very high throughput, which is why radios, radar and medical imaging build their filters in silicon. This is the bridge from DSP to chip/IC design.</p>
<div class="callout"><span class="badge">Big picture</span> Everything in this course — convolution, the FFT, FIR/IIR filters — becomes a real product when it runs in real time on a DSP core or an FPGA.</div>`,
    `<span class="eyebrow">DGT302 · Chương 8 · Bài 8.1</span>
<h2>Ứng dụng DSP</h2>
<h3>Xử lý âm thanh &amp; ảnh</h3>
<ul>
<li><strong>Âm thanh</strong> — equalizer (bộ lọc dải), nén (MP3/AAC dùng FFT), tiếng vọng/reverb (tích chập), cổng nhiễu và hiệu ứng giọng.</li>
<li><strong>Ảnh</strong> — ảnh là tín hiệu 2 chiều; làm mờ, làm sắc, phát hiện biên là tích chập 2-D, và JPEG nén bằng họ hàng của DFT (biến đổi DCT).</li>
</ul>
<h3>Lọc nhiễu</h3>
<p>Tín hiệu thật luôn có nhiễu. Một bộ lọc đặt đúng chỗ sẽ loại đi: bộ lọc <strong>thông thấp</strong> làm mượt tiếng rít tần số cao, bộ lọc <strong>notch</strong> giết một tần đơn (vd nhiễu điện lưới 50/60 Hz trên tín hiệu ECG), và bộ lọc thích nghi bám theo nhiễu thay đổi theo thời gian.</p>
<h3>Xử lý thời gian thực</h3>
<p>Nhiều hệ phải xử lý mẫu <em>ngay khi vừa tới</em>, trong một hạn mức <strong>độ trễ</strong> cố định. Tín hiệu được xử lý theo khối (streaming), và thuật toán phải xong mỗi khối trước khi khối sau tới:</p>
<pre><code>vào -> [đệm 1 khối] -> [FIR/IIR/FFT] -> [khối ra] -> ra
ràng buộc:  thời gian xử lý mỗi khối  &lt;  thời lượng khối</code></pre>
<h3>DSP chạy ở đâu: chip &amp; FPGA</h3>
<p>DSP ánh xạ tự nhiên vào phần cứng. Một <strong>chip DSP</strong> có khối nhân-cộng (MAC) tính b[k]·x[n-k] trong một chu kỳ — lý tưởng cho bộ lọc. Một <strong>FPGA</strong> xếp nhiều MAC song song để thông lượng rất cao, vì thế radio, radar và ảnh y tế dựng bộ lọc bằng silicon. Đây là cầu nối từ DSP sang thiết kế chip/IC.</p>
<div class="callout"><span class="badge">Bức tranh lớn</span> Mọi thứ trong môn này — tích chập, FFT, bộ lọc FIR/IIR — thành sản phẩm thật khi chạy thời gian thực trên lõi DSP hay FPGA.</div>`,
  ]]);

const c8q = quiz('dgt302-quiz-8', 'Quiz 8 — Applications|||Quiz 8 — Ứng dụng', [
  { id: 'q1', question: 'Để loại nhiễu điện lưới 50/60 Hz (một tần đơn) trên tín hiệu ECG, dùng bộ lọc nào?', options: ['Bộ lọc thông cao', 'Bộ lọc notch (chặn dải hẹp)', 'Bộ khuếch đại', 'FFT'], correctIndex: 1, explanation: 'Bộ lọc notch giết một tần số hẹp như nhiễu điện lưới.' },
  { id: 'q2', question: 'Trong xử lý thời gian thực theo khối, ràng buộc cốt lõi là?', options: ['Thời gian xử lý mỗi khối phải nhỏ hơn thời lượng khối', 'Khối càng lớn càng tốt', 'Không cần bộ đệm', 'Tần số lấy mẫu bằng 0'], correctIndex: 0, explanation: 'Phải xử lý xong khối trước khi khối kế tới, nếu không sẽ trễ dồn.' },
  { id: 'q3', question: 'Khối nào trong chip DSP/FPGA giúp chạy bộ lọc rất nhanh?', options: ['Khối nhân-cộng (MAC)', 'Bộ nhớ ROM', 'Cổng USB', 'Đồng hồ thời gian thực'], correctIndex: 0, explanation: 'MAC tính b[k]·x[n-k] trong một chu kỳ; FPGA xếp nhiều MAC song song.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'DGT302',
    slug: 'dgt302-digital-signal-processing',
    title: 'Digital Signal Processing',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/DGT302.webp',
    shortDescription: 'How to process signals with numbers — discrete signals x[n] & LTI systems, sampling & Nyquist, the Z-transform, DTFT, DFT/FFT, FIR & IIR filter design, and real-time DSP on chips/FPGA. Bilingual, with formulas & quizzes.|||Xử lý tín hiệu bằng con số — tín hiệu rời rạc x[n] & hệ LTI, lấy mẫu & Nyquist, biến đổi Z, DTFT, DFT/FFT, thiết kế bộ lọc FIR & IIR, DSP thời gian thực trên chip/FPGA. Song ngữ, có công thức & quiz.',
    description: 'Môn <strong>DGT302 — Digital Signal Processing</strong> (Xử lý tín hiệu số, kỳ 4, ngành Thiết kế vi mạch bán dẫn) dạy cách <strong>biểu diễn, phân tích và biến đổi tín hiệu bằng con số</strong>. Từ <strong>tín hiệu &amp; hệ rời rạc</strong> (x[n], hệ LTI, tích chập) → <strong>lấy mẫu &amp; khôi phục</strong> (Nyquist, chồng phổ, ADC/DAC) → <strong>biến đổi Z</strong> (ROC, cực/không) → <strong>DTFT &amp; đáp ứng tần số</strong> → <strong>DFT &amp; FFT</strong> (phân tích phổ) → <strong>thiết kế bộ lọc FIR</strong> (cửa sổ, pha tuyến tính) → <strong>thiết kế bộ lọc IIR</strong> (Butterworth/Chebyshev, biến đổi song tuyến) → <strong>ứng dụng DSP</strong> (âm thanh/ảnh, lọc nhiễu, thời gian thực, chip/FPGA). Bám sách chuẩn quốc tế (Oppenheim &amp; Schafer, Proakis), song ngữ, có công thức, ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Tín hiệu rời rạc x[n], xung/bậc thang/mũ, hệ LTI &amp; tích chập; lấy mẫu, định lý Nyquist, chồng phổ, ADC/DAC; biến đổi Z, ROC, cực/không &amp; ổn định; DTFT, phổ biên độ/pha, đáp ứng tần số H(e^jω); DFT, FFT (N·log N), độ phân giải fs/N, rò phổ &amp; cửa sổ; thiết kế FIR (window, pha tuyến tính); thiết kế IIR (Butterworth/Chebyshev/Elliptic, bilinear); ứng dụng âm thanh/ảnh, lọc nhiễu, xử lý thời gian thực trên chip DSP/FPGA.',
    requirements: 'Giải tích &amp; số phức cơ bản (e^jω, tổng chuỗi). Biết Python/NumPy để chạy scipy.signal và FFT là một lợi thế, nhưng không bắt buộc.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn (Oppenheim & Schafer, Proakis), MIT 6.341, scipy.signal, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'DSP là gì; tín hiệu tương tự vs số; vì sao xử lý bằng số.', lessons: [intro] },
    { title: 'Chương 1 — Tín hiệu & hệ rời rạc|||Chapter 1 — Discrete signals & LTI systems', description: 'x[n], hệ LTI, đáp ứng xung, tích chập.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Lấy mẫu & khôi phục|||Chapter 2 — Sampling & reconstruction', description: 'Nyquist, chồng phổ, ADC/DAC, lọc chống chồng phổ.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Biến đổi Z|||Chapter 3 — The Z-transform', description: 'X(z), ROC, tính chất, hàm truyền, cực/không.', lessons: [c3, c3q] },
    { title: 'Chương 4 — DTFT & đáp ứng tần số|||Chapter 4 — DTFT & frequency response', description: 'X(e^jω), phổ biên độ/pha, H(e^jω).', lessons: [c4, c4q] },
    { title: 'Chương 5 — DFT & FFT|||Chapter 5 — DFT & FFT', description: 'DFT, FFT (N·log N), phân tích phổ, độ phân giải.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Thiết kế bộ lọc FIR|||Chapter 6 — FIR filter design', description: 'FIR, pha tuyến tính, phương pháp cửa sổ.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thiết kế bộ lọc IIR|||Chapter 7 — IIR filter design', description: 'IIR, Butterworth/Chebyshev, biến đổi song tuyến.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ứng dụng DSP|||Chapter 8 — DSP applications', description: 'Âm thanh/ảnh, lọc nhiễu, thời gian thực, chip DSP/FPGA.', lessons: [c8, c8q] },
  ],
};
