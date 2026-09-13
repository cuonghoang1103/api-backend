/**
 * SDP201 — Sound Production. Khung bài học song ngữ (VI+EN) cho ngành
 * Thiết kế mỹ thuật số, Kỳ 7 (FPTU). Bám giáo trình: Sonnenschein "Sound
 * Design"; Viers "The Sound Effects Bible"; Owsinski "The Mixing Engineer
 * Handbook"; tài liệu Pro Tools / Audacity / Reaper.
 * GIỮ NGUYÊN slug/semester/courseCode/thumbnailUrl. ⚠️ KHÔNG backtick lồng /
 * ${...} / nháy đơn thừa; & trong HTML là &amp; ; "<" là &lt;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('sdp201-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (Sonnenschein, Viers, Owsinski), phần mềm DAW, tài liệu chính thức, YouTube, lộ trình tự học.',
  [[
    `<span class="eyebrow">SDP201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Sound Production</strong> for media, animation and games — waves and decibels, digital audio, recording, editing, Foley, signal processing, mixing and audio-for-picture — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are the standard textbooks and free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for SDP201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><strong>David Sonnenschein — Sound Design</strong> (the expressive power of music, voice and sound effects in cinema).</li>
<li><strong>Ric Viers — The Sound Effects Bible</strong> (how to create and record hundreds of sound effects).</li>
<li><strong>Bobby Owsinski — The Mixing Engineer Handbook</strong> (the standard reference for mixing music and media).</li>
</ul>
<h3>🎛️ Software (DAW)</h3>
<ul>
<li><a href="https://www.avid.com/pro-tools" target="_blank" rel="noopener">Pro Tools</a> — the industry standard for audio post-production.</li>
<li><a href="https://www.reaper.fm/" target="_blank" rel="noopener">Reaper</a> — powerful, low-cost DAW with a long free trial.</li>
<li><a href="https://www.audacityteam.org/" target="_blank" rel="noopener">Audacity</a> — free, open-source editor, ideal for learning.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@marshallmcgee" target="_blank" rel="noopener">Marshall McGee</a> — sound design for games &amp; film.</li>
<li><a href="https://www.youtube.com/@akashthinks" target="_blank" rel="noopener">Akash Thakkar</a> — game audio career &amp; technique.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — waves, frequency, amplitude, the decibel; digital audio (sample rate, bit depth).</li>
<li><strong>Capture</strong> — microphones and recording technique; clean gain staging with headroom.</li>
<li><strong>Craft</strong> — edit in a DAW, design Foley &amp; SFX, shape sound with EQ, compression and reverb.</li>
<li><strong>Deliver</strong> — mix &amp; master, then sync audio to picture for film, animation and games.</li>
</ol></div>`,
    `<span class="eyebrow">SDP201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Sản xuất âm thanh</strong> cho media, hoạt hình và game — sóng và decibel, âm thanh số, thu âm, biên tập, Foley, xử lý tín hiệu, mixing và âm thanh theo hình — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là sách chuẩn và nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của SDP201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><strong>David Sonnenschein — Sound Design</strong> (sức mạnh biểu đạt của nhạc, giọng nói và hiệu ứng âm thanh trong điện ảnh).</li>
<li><strong>Ric Viers — The Sound Effects Bible</strong> (cách tạo và thu hàng trăm hiệu ứng âm thanh).</li>
<li><strong>Bobby Owsinski — The Mixing Engineer Handbook</strong> (sách chuẩn về mixing nhạc và media).</li>
</ul>
<h3>🎛️ Phần mềm (DAW)</h3>
<ul>
<li><a href="https://www.avid.com/pro-tools" target="_blank" rel="noopener">Pro Tools</a> — chuẩn công nghiệp cho hậu kỳ âm thanh.</li>
<li><a href="https://www.reaper.fm/" target="_blank" rel="noopener">Reaper</a> — DAW mạnh, giá rẻ, dùng thử dài.</li>
<li><a href="https://www.audacityteam.org/" target="_blank" rel="noopener">Audacity</a> — trình biên tập miễn phí, mã nguồn mở, hợp để học.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@marshallmcgee" target="_blank" rel="noopener">Marshall McGee</a> — thiết kế âm thanh cho game &amp; phim.</li>
<li><a href="https://www.youtube.com/@akashthinks" target="_blank" rel="noopener">Akash Thakkar</a> — nghề &amp; kỹ thuật âm thanh game.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — sóng, tần số, biên độ, decibel; âm thanh số (sample rate, bit depth).</li>
<li><strong>Thu bắt</strong> — micro và kỹ thuật thu; gain staging sạch với headroom.</li>
<li><strong>Tay nghề</strong> — biên tập trong DAW, thiết kế Foley &amp; SFX, nắn tiếng bằng EQ, nén và reverb.</li>
<li><strong>Bàn giao</strong> — mixing &amp; mastering, rồi đồng bộ âm thanh theo hình cho phim, hoạt hình và game.</li>
</ol></div>`,
  ]]);

const intro = doc('sdp201-0-1-overview', 'Course overview: Sound Production|||Tổng quan: Sản xuất âm thanh',
  'Âm thanh làm gì trong media/hoạt hình/game; chuỗi sản xuất (thu → biên tập → thiết kế → xử lý → mix → đồng bộ); lộ trình 8 chương.',
  [[
    `<span class="eyebrow">SDP201 · Lesson 0.1 · Overview</span>
<h2>Sound Production</h2>
<p class="lead">This course teaches you <strong>how audio is produced for media, animation and games</strong> — from the physics of a sound wave, through recording and editing, to designing effects and delivering a finished mix in sync with picture. Sound is half the experience: it sells emotion, space and impact that the image alone cannot.</p>
<h3>The production chain</h3>
<pre><code>Record  -&gt; capture clean audio with a microphone
Edit    -&gt; trim, clean and arrange clips in a DAW
Design  -&gt; build Foley and sound effects (SFX)
Process -&gt; shape tone &amp; dynamics (EQ, compression, reverb)
Mix     -&gt; balance every element, then master
Sync    -&gt; lock audio to picture for film / game</code></pre>
<h3>Roadmap (8 chapters)</h3>
<p>Sound fundamentals (waves, dB) → digital audio (sample rate, bit depth) → recording &amp; microphones → editing in a DAW → Foley &amp; SFX design → signal processing (EQ, compression, reverb) → mixing &amp; mastering → audio for animation, film &amp; games. Bilingual, with worked examples and a quiz per chapter.</p>`,
    `<span class="eyebrow">SDP201 · Bài 0.1 · Tổng quan</span>
<h2>Sản xuất âm thanh</h2>
<p class="lead">Môn này dạy bạn <strong>cách sản xuất âm thanh cho media, hoạt hình và game</strong> — từ vật lý của một sóng âm, qua thu và biên tập, đến thiết kế hiệu ứng và bàn giao một bản mix hoàn chỉnh khớp hình. Âm thanh là một nửa trải nghiệm: nó truyền cảm xúc, không gian và lực va chạm mà riêng hình ảnh không làm được.</p>
<h3>Chuỗi sản xuất</h3>
<pre><code>Thu       -&gt; bắt tiếng sạch bằng micro
Biên tập  -&gt; cắt, làm sạch, sắp clip trong DAW
Thiết kế  -&gt; dựng Foley và hiệu ứng (SFX)
Xử lý     -&gt; nắn âm sắc &amp; động (EQ, nén, reverb)
Mix       -&gt; cân mọi thành phần, rồi master
Đồng bộ   -&gt; khoá âm thanh theo hình cho phim / game</code></pre>
<h3>Lộ trình (8 chương)</h3>
<p>Cơ sở âm thanh (sóng, dB) → âm thanh số (sample rate, bit depth) → thu âm &amp; micro → biên tập trong DAW → Foley &amp; SFX → xử lý tín hiệu (EQ, nén, reverb) → mixing &amp; mastering → âm thanh cho hoạt hình, phim &amp; game. Song ngữ, có ví dụ mẫu và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('sdp201-1-1-fundamentals', '1.1 — Sound fundamentals: waves, frequency, amplitude, dB|||1.1 — Cơ sở âm thanh: sóng, tần số, biên độ, dB',
  'Âm thanh là sóng áp suất; tần số (Hz) = cao độ, biên độ = độ to; bước sóng/chu kỳ; thang decibel (log); âm sắc & hài.',
  [[
    `<span class="eyebrow">SDP201 · Chapter 1 · Lesson 1.1</span>
<h2>Sound fundamentals</h2>
<h3>What sound is</h3>
<p>Sound is a <strong>pressure wave</strong> travelling through air: molecules compress and rarefy, and your ear reads those changes. Two properties describe a simple tone:</p>
<ul>
<li><strong>Frequency</strong> — how many cycles per second, measured in <strong>hertz (Hz)</strong>. It sets <em>pitch</em>: low Hz = low/bass, high Hz = high/treble. Human hearing spans about <strong>20 Hz to 20 kHz</strong>.</li>
<li><strong>Amplitude</strong> — the size of the pressure change. It sets <em>loudness</em>: bigger amplitude = louder.</li>
</ul>
<h3>Wavelength &amp; period</h3>
<p>The <strong>period</strong> is the time for one cycle (T = 1 / frequency); the <strong>wavelength</strong> is its length in space. Low notes have long waves, high notes short ones.</p>
<h3>The decibel (dB)</h3>
<p>Loudness is measured in <strong>decibels</strong>, a <strong>logarithmic</strong> scale — it matches how ears actually perceive level.</p>
<pre><code>+6 dB   ~ double the amplitude
+10 dB  ~ roughly twice as loud (perceived)
 0 dBFS = the digital ceiling (clipping above it)</code></pre>
<h3>Timbre &amp; harmonics</h3>
<p>Why a violin and a flute at the same pitch sound different is <strong>timbre</strong> — the mix of a fundamental frequency plus <em>harmonics</em> (overtones) above it. Timbre is what sound design shapes.</p>
<div class="callout"><span class="badge">Key idea</span> Frequency = pitch, amplitude = loudness, timbre = character. Everything in this course is you controlling these three.</div>`,
    `<span class="eyebrow">SDP201 · Chương 1 · Bài 1.1</span>
<h2>Cơ sở âm thanh</h2>
<h3>Âm thanh là gì</h3>
<p>Âm thanh là một <strong>sóng áp suất</strong> lan trong không khí: các phân tử bị nén rồi giãn, và tai bạn đọc những thay đổi đó. Hai đại lượng mô tả một âm đơn giản:</p>
<ul>
<li><strong>Tần số</strong> — số chu kỳ mỗi giây, đo bằng <strong>hertz (Hz)</strong>. Nó quyết định <em>cao độ</em>: Hz thấp = trầm/bass, Hz cao = cao/treble. Tai người nghe khoảng <strong>20 Hz đến 20 kHz</strong>.</li>
<li><strong>Biên độ</strong> — độ lớn của thay đổi áp suất. Nó quyết định <em>độ to</em>: biên độ càng lớn càng to.</li>
</ul>
<h3>Bước sóng &amp; chu kỳ</h3>
<p><strong>Chu kỳ</strong> là thời gian cho một vòng (T = 1 / tần số); <strong>bước sóng</strong> là độ dài của nó trong không gian. Nốt trầm có sóng dài, nốt cao có sóng ngắn.</p>
<h3>Decibel (dB)</h3>
<p>Độ to đo bằng <strong>decibel</strong>, một thang <strong>logarit</strong> — khớp với cách tai thực sự cảm nhận mức.</p>
<pre><code>+6 dB   ~ gấp đôi biên độ
+10 dB  ~ nghe to gấp khoảng 2 lần (cảm nhận)
 0 dBFS = trần số (vượt lên là clipping)</code></pre>
<h3>Âm sắc &amp; hài</h3>
<p>Vì sao violin và sáo cùng cao độ lại nghe khác nhau là do <strong>âm sắc (timbre)</strong> — sự pha trộn giữa tần số cơ bản cộng các <em>hài</em> (overtone) bên trên. Âm sắc chính là thứ thiết kế âm thanh nắn.</p>
<div class="callout"><span class="badge">Ý chính</span> Tần số = cao độ, biên độ = độ to, âm sắc = tính chất. Cả môn này là việc bạn điều khiển ba thứ đó.</div>`,
  ]]);

const c1q = quiz('sdp201-quiz-1', 'Quiz 1 — Sound fundamentals|||Quiz 1 — Cơ sở âm thanh', [
  { id: 'q1', question: 'Tần số (Hz) của một âm quyết định điều gì?', options: ['Độ to', 'Cao độ (pitch)', 'Âm sắc', 'Bước sóng ánh sáng'], correctIndex: 1, explanation: 'Tần số càng cao thì âm càng cao; đó là cao độ. Độ to do biên độ quyết định.' },
  { id: 'q2', question: 'Dải nghe của tai người xấp xỉ khoảng nào?', options: ['2 Hz đến 200 Hz', '20 Hz đến 20 kHz', '200 Hz đến 2 kHz', '20 kHz đến 200 kHz'], correctIndex: 1, explanation: 'Tai người nghe được khoảng 20 Hz đến 20 kHz.' },
  { id: 'q3', question: 'Thang decibel (dB) có tính chất gì?', options: ['Tuyến tính', 'Logarit', 'Ngẫu nhiên', 'Chỉ dùng cho ánh sáng'], correctIndex: 1, explanation: 'dB là thang logarit, khớp với cách tai cảm nhận mức; +6 dB xấp xỉ gấp đôi biên độ.' },
]);

const c2 = doc('sdp201-2-1-digital-audio', '2.1 — Digital audio: sample rate, bit depth, file formats|||2.1 — Âm thanh số: sample rate, bit depth, định dạng file',
  'ADC & lấy mẫu, định lý Nyquist (44.1 kHz); bit depth ↔ dải động (16-bit ~96 dB); WAV/AIFF, FLAC, MP3/AAC; tính dung lượng.',
  [[
    `<span class="eyebrow">SDP201 · Chapter 2 · Lesson 2.1</span>
<h2>Digital audio</h2>
<h3>From wave to numbers</h3>
<p>A computer cannot store a continuous wave, so an <strong>ADC (analog-to-digital converter)</strong> measures the wave many times a second and stores each measurement as a number. Two settings define the quality:</p>
<ul>
<li><strong>Sample rate</strong> — how many samples per second (Hz). By the <strong>Nyquist theorem</strong> you must sample at least twice the highest frequency you want to keep. <strong>44.1 kHz</strong> (CD) captures up to ~22 kHz — above human hearing.</li>
<li><strong>Bit depth</strong> — how many bits store each sample. It sets the <strong>dynamic range</strong> (quietest to loudest): 16-bit ~96 dB, 24-bit ~144 dB. More bits = lower noise floor and more headroom.</li>
</ul>
<h3>Common rates</h3>
<pre><code>44.1 kHz / 16-bit -&gt; music, CD
48 kHz   / 24-bit -&gt; video, film, games (standard)
96 kHz   / 24-bit -&gt; high-res capture &amp; heavy processing</code></pre>
<h3>File formats</h3>
<ul>
<li><strong>WAV / AIFF</strong> — uncompressed PCM; full quality, big files. Use for recording &amp; editing.</li>
<li><strong>FLAC</strong> — lossless compression; smaller, no quality loss.</li>
<li><strong>MP3 / AAC</strong> — lossy compression; small files, some quality discarded. Use for delivery only.</li>
</ul>
<pre><code>Size = sampleRate x bitDepth x channels x seconds / 8
48000 x 24 x 2 x 60 / 8  ~ 17.3 MB per stereo minute</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Record and edit in <strong>uncompressed 48 kHz / 24-bit</strong>; export to MP3/AAC only at the very end, for delivery.</div>`,
    `<span class="eyebrow">SDP201 · Chương 2 · Bài 2.1</span>
<h2>Âm thanh số</h2>
<h3>Từ sóng thành số</h3>
<p>Máy tính không lưu được sóng liên tục, nên một <strong>ADC (bộ chuyển analog sang số)</strong> đo sóng nhiều lần mỗi giây và lưu mỗi lần đo thành một con số. Hai thông số quyết định chất lượng:</p>
<ul>
<li><strong>Sample rate (tần số lấy mẫu)</strong> — số mẫu mỗi giây (Hz). Theo <strong>định lý Nyquist</strong>, phải lấy mẫu ít nhất gấp đôi tần số cao nhất muốn giữ. <strong>44.1 kHz</strong> (CD) giữ được tới ~22 kHz — trên ngưỡng nghe của người.</li>
<li><strong>Bit depth (độ sâu bit)</strong> — số bit lưu mỗi mẫu. Nó quyết định <strong>dải động</strong> (từ nhỏ nhất tới to nhất): 16-bit ~96 dB, 24-bit ~144 dB. Càng nhiều bit thì nền nhiễu càng thấp và headroom càng nhiều.</li>
</ul>
<h3>Các mức thường dùng</h3>
<pre><code>44.1 kHz / 16-bit -&gt; nhạc, CD
48 kHz   / 24-bit -&gt; video, phim, game (chuẩn)
96 kHz   / 24-bit -&gt; thu chất lượng cao &amp; xử lý nặng</code></pre>
<h3>Định dạng file</h3>
<ul>
<li><strong>WAV / AIFF</strong> — PCM không nén; chất lượng đầy đủ, file lớn. Dùng khi thu &amp; biên tập.</li>
<li><strong>FLAC</strong> — nén không mất dữ liệu; nhỏ hơn, không giảm chất lượng.</li>
<li><strong>MP3 / AAC</strong> — nén mất dữ liệu; file nhỏ, bỏ bớt chất lượng. Chỉ dùng để bàn giao.</li>
</ul>
<pre><code>Dung lượng = sampleRate x bitDepth x kênh x giây / 8
48000 x 24 x 2 x 60 / 8  ~ 17.3 MB mỗi phút stereo</code></pre>
<div class="callout"><span class="badge">Nguyên tắc</span> Thu và biên tập ở <strong>không nén 48 kHz / 24-bit</strong>; chỉ xuất MP3/AAC ở bước cuối cùng để bàn giao.</div>`,
  ]]);

const c2q = quiz('sdp201-quiz-2', 'Quiz 2 — Digital audio|||Quiz 2 — Âm thanh số', [
  { id: 'q1', question: 'Theo định lý Nyquist, để giữ được tần số 20 kHz thì sample rate phải ít nhất là?', options: ['10 kHz', '20 kHz', '40 kHz', '5 kHz'], correctIndex: 2, explanation: 'Phải lấy mẫu ít nhất gấp đôi tần số cao nhất; vì thế 44.1 kHz giữ được tới ~22 kHz.' },
  { id: 'q2', question: 'Bit depth (độ sâu bit) quyết định điều gì?', options: ['Cao độ', 'Dải động (dynamic range)', 'Bước sóng', 'Số kênh loa'], correctIndex: 1, explanation: 'Bit depth đặt dải động và nền nhiễu: 16-bit ~96 dB, 24-bit ~144 dB.' },
  { id: 'q3', question: 'Định dạng nào là nén MẤT dữ liệu, chỉ nên dùng để bàn giao?', options: ['WAV', 'AIFF', 'FLAC', 'MP3'], correctIndex: 3, explanation: 'MP3/AAC nén mất dữ liệu; WAV/AIFF không nén, FLAC nén không mất dữ liệu.' },
]);

const c3 = doc('sdp201-3-1-recording-mics', '3.1 — Recording &amp; microphones|||3.1 — Thu âm &amp; micro',
  'Loại micro (động/tụ/ribbon), hướng thu (cardioid/omni/figure-8); kỹ thuật đặt mic (close/room, XY, ORTF); gain staging & headroom.',
  [[
    `<span class="eyebrow">SDP201 · Chapter 3 · Lesson 3.1</span>
<h2>Recording &amp; microphones</h2>
<h3>Microphone types</h3>
<ul>
<li><strong>Dynamic</strong> — rugged, handles loud sources, no power needed. Great for drums, guitar amps, live vocals.</li>
<li><strong>Condenser</strong> — sensitive and detailed, needs +48V phantom power. The studio choice for vocals, Foley and acoustic detail.</li>
<li><strong>Ribbon</strong> — smooth, vintage tone, fragile. Used on brass and room ambience.</li>
</ul>
<h3>Polar patterns (what the mic hears)</h3>
<ul>
<li><strong>Cardioid</strong> — picks up the front, rejects the back. The default for isolating one source.</li>
<li><strong>Omnidirectional</strong> — hears all around; natural room sound.</li>
<li><strong>Figure-8</strong> — front and back, rejects the sides; used in stereo pairs.</li>
</ul>
<h3>Placement technique</h3>
<pre><code>Close mic  -&gt; near the source: dry, detailed, less room
Room mic   -&gt; further back: adds space &amp; ambience
XY pair    -&gt; two cardioids crossed: solid stereo image
ORTF pair  -&gt; two cardioids 17cm / 110deg: wide, natural</code></pre>
<h3>Gain staging &amp; headroom</h3>
<p>Set the preamp <strong>gain</strong> so the loudest peaks land around <strong>-12 to -6 dBFS</strong>. That leaves <strong>headroom</strong> — space before <strong>0 dBFS</strong>, where digital audio <strong>clips</strong> (harsh, unfixable distortion). Aim low; you can always turn up later.</p>
<div class="callout"><span class="badge">Golden rule</span> Record clean at the source. No plugin fully fixes a clipped take, a noisy room, or a badly placed mic.</div>`,
    `<span class="eyebrow">SDP201 · Chương 3 · Bài 3.1</span>
<h2>Thu âm &amp; micro</h2>
<h3>Các loại micro</h3>
<ul>
<li><strong>Động (dynamic)</strong> — bền, chịu nguồn to, không cần cấp nguồn. Hợp trống, ampli guitar, hát live.</li>
<li><strong>Tụ (condenser)</strong> — nhạy và chi tiết, cần nguồn ảo +48V (phantom). Lựa chọn phòng thu cho giọng, Foley và chi tiết acoustic.</li>
<li><strong>Ribbon</strong> — mượt, chất vintage, mong manh. Dùng cho kèn đồng và tiếng phòng.</li>
</ul>
<h3>Hướng thu (mic nghe gì)</h3>
<ul>
<li><strong>Cardioid</strong> — bắt phía trước, chặn phía sau. Mặc định để cô lập một nguồn.</li>
<li><strong>Omni (đa hướng)</strong> — nghe mọi phía; tiếng phòng tự nhiên.</li>
<li><strong>Figure-8</strong> — trước và sau, chặn hai bên; dùng trong cặp stereo.</li>
</ul>
<h3>Kỹ thuật đặt mic</h3>
<pre><code>Mic gần   -&gt; sát nguồn: khô, chi tiết, ít tiếng phòng
Mic phòng -&gt; lùi ra xa: thêm không gian &amp; ambience
Cặp XY    -&gt; hai cardioid chéo nhau: ảnh stereo chắc
Cặp ORTF  -&gt; hai cardioid cách 17cm / 110 do: rộng, tự nhiên</code></pre>
<h3>Gain staging &amp; headroom</h3>
<p>Chỉnh <strong>gain</strong> preamp sao cho đỉnh to nhất rơi quanh <strong>-12 đến -6 dBFS</strong>. Như thế còn <strong>headroom</strong> — khoảng trống trước <strong>0 dBFS</strong>, nơi âm thanh số bị <strong>clipping</strong> (méo gắt, không sửa được). Cứ để thấp; lúc nào cũng có thể tăng lên sau.</p>
<div class="callout"><span class="badge">Nguyên tắc vàng</span> Thu sạch ngay tại nguồn. Không plugin nào cứu trọn một bản thu bị clip, một phòng ồn, hay một mic đặt sai.</div>`,
  ]]);

const c3q = quiz('sdp201-quiz-3', 'Quiz 3 — Recording &amp; mics|||Quiz 3 — Thu âm &amp; micro', [
  { id: 'q1', question: 'Loại micro nào nhạy, chi tiết, và cần nguồn ảo +48V (phantom)?', options: ['Micro động (dynamic)', 'Micro tụ (condenser)', 'Micro ribbon', 'Loa'], correctIndex: 1, explanation: 'Micro tụ nhạy và chi tiết, cần phantom +48V; hợp thu giọng và Foley trong phòng thu.' },
  { id: 'q2', question: 'Hướng thu cardioid có đặc điểm gì?', options: ['Nghe mọi phía như nhau', 'Bắt phía trước, chặn phía sau', 'Chỉ bắt hai bên', 'Không thu được gì'], correctIndex: 1, explanation: 'Cardioid bắt phía trước và chặn phía sau, tốt để cô lập một nguồn.' },
  { id: 'q3', question: 'Đặt gain để đỉnh to nhất rơi quanh -12 đến -6 dBFS nhằm mục đích gì?', options: ['Để clip cho méo', 'Để chừa headroom, tránh vượt 0 dBFS', 'Để tăng nhiễu nền', 'Để giảm sample rate'], correctIndex: 1, explanation: 'Chừa headroom tránh clipping ở 0 dBFS; clipping là méo gắt không sửa được.' },
]);

const c4 = doc('sdp201-4-1-editing-daw', '4.1 — Audio editing &amp; the DAW|||4.1 — Biên tập audio &amp; DAW',
  'DAW (Pro Tools/Reaper/Audacity): track, clip, timeline; cắt/trim/fade, crossfade, comping, khử nhiễu; biên tập không phá huỷ; zero-crossing tránh click.',
  [[
    `<span class="eyebrow">SDP201 · Chapter 4 · Lesson 4.1</span>
<h2>Audio editing &amp; the DAW</h2>
<h3>The DAW workspace</h3>
<p>A <strong>DAW (Digital Audio Workstation)</strong> — Pro Tools, Reaper or Audacity — is where you assemble sound. Core parts:</p>
<ul>
<li><strong>Tracks</strong> — horizontal lanes, one per source (dialogue, Foley, music).</li>
<li><strong>Clips / regions</strong> — the audio blocks you move, trim and arrange.</li>
<li><strong>Timeline</strong> — time left to right, usually in bars or in <strong>timecode</strong> for video.</li>
</ul>
<h3>Core edits</h3>
<pre><code>Trim      -&gt; shorten a clip from its edges
Split     -&gt; cut a clip into pieces
Fade      -&gt; ramp volume in/out (avoids abrupt starts)
Crossfade -&gt; overlap two clips so the join is seamless
Comp      -&gt; pick the best bits from several takes</code></pre>
<h3>Two habits that matter</h3>
<ul>
<li><strong>Non-destructive editing</strong> — the DAW edits a <em>reference</em>, not the original file. You can always undo or revert; keep the source WAV untouched.</li>
<li><strong>Cut on a zero-crossing</strong> — cut where the waveform crosses zero, or add a tiny fade. A cut mid-wave leaves a jump that you hear as a <strong>click</strong> or <strong>pop</strong>.</li>
</ul>
<h3>Cleaning</h3>
<p>Remove hum, hiss and clicks with <strong>noise reduction</strong> and a <strong>high-pass filter</strong> to cut low rumble. Fix the recording first — cleaning is a rescue, not a substitute for a clean take.</p>
<div class="callout"><span class="badge">Workflow</span> Import at 48 kHz / 24-bit, edit non-destructively, fade every cut, and keep tracks labelled and colour-coded.</div>`,
    `<span class="eyebrow">SDP201 · Chương 4 · Bài 4.1</span>
<h2>Biên tập audio &amp; DAW</h2>
<h3>Không gian làm việc của DAW</h3>
<p>Một <strong>DAW (Digital Audio Workstation)</strong> — Pro Tools, Reaper hay Audacity — là nơi bạn lắp ghép âm thanh. Các phần cốt lõi:</p>
<ul>
<li><strong>Track</strong> — làn ngang, mỗi làn một nguồn (thoại, Foley, nhạc).</li>
<li><strong>Clip / region</strong> — các khối audio bạn di chuyển, cắt và sắp xếp.</li>
<li><strong>Timeline</strong> — thời gian từ trái sang phải, thường theo ô nhịp hoặc theo <strong>timecode</strong> với video.</li>
</ul>
<h3>Các thao tác cốt lõi</h3>
<pre><code>Trim      -&gt; cắt ngắn clip từ mép
Split     -&gt; cắt một clip thành nhiều mảnh
Fade      -&gt; dốc âm lượng vào/ra (tránh vào tiếng đột ngột)
Crossfade -&gt; chồng hai clip để mối nối liền mạch
Comp      -&gt; chọn đoạn hay nhất từ nhiều lần thu</code></pre>
<h3>Hai thói quen quan trọng</h3>
<ul>
<li><strong>Biên tập không phá huỷ</strong> — DAW sửa trên một <em>tham chiếu</em>, không sửa file gốc. Luôn hoàn tác được; giữ nguyên file WAV nguồn.</li>
<li><strong>Cắt tại điểm zero-crossing</strong> — cắt nơi dạng sóng đi qua số 0, hoặc thêm một fade nhỏ. Cắt giữa sóng để lại bước nhảy mà tai nghe thành tiếng <strong>click</strong> hay <strong>pop</strong>.</li>
</ul>
<h3>Làm sạch</h3>
<p>Bỏ ù, xì và click bằng <strong>khử nhiễu</strong> và một <strong>high-pass filter</strong> để cắt tiếng rền tần thấp. Sửa bản thu trước — làm sạch là cứu vãn, không thay được một bản thu sạch.</p>
<div class="callout"><span class="badge">Quy trình</span> Nhập ở 48 kHz / 24-bit, biên tập không phá huỷ, fade mọi vết cắt, và đặt tên cùng màu cho track.</div>`,
  ]]);

const c4q = quiz('sdp201-quiz-4', 'Quiz 4 — Editing &amp; DAW|||Quiz 4 — Biên tập &amp; DAW', [
  { id: 'q1', question: 'Vì sao nên cắt clip tại điểm zero-crossing (hoặc thêm fade nhỏ)?', options: ['Để file nhỏ hơn', 'Để tránh tiếng click/pop ở mối cắt', 'Để tăng sample rate', 'Để đổi cao độ'], correctIndex: 1, explanation: 'Cắt giữa sóng để lại bước nhảy biên độ, tai nghe thành click/pop; cắt ở zero-crossing tránh điều đó.' },
  { id: 'q2', question: '"Biên tập không phá huỷ" (non-destructive) nghĩa là gì?', options: ['Xoá vĩnh viễn file gốc', 'Sửa trên tham chiếu, giữ nguyên file gốc', 'Chỉ dùng được với MP3', 'Không thể hoàn tác'], correctIndex: 1, explanation: 'DAW sửa trên một tham chiếu chứ không sửa file gốc, nên luôn hoàn tác/khôi phục được.' },
  { id: 'q3', question: 'Thao tác nào chồng hai clip để mối nối nghe liền mạch?', options: ['Trim', 'Split', 'Crossfade', 'Normalize'], correctIndex: 2, explanation: 'Crossfade chồng đuôi clip này với đầu clip kia để chuyển tiếp mượt.' },
]);

const c5 = doc('sdp201-5-1-foley-sfx', '5.1 — Foley &amp; sound effects (SFX) design|||5.1 — Foley &amp; thiết kế hiệu ứng (SFX)',
  'Sonnenschein Sound Design; Foley (bước chân, vải, đạo cụ); hard SFX & ambience; xếp lớp (layering); thư viện (Viers); diegetic vs non-diegetic.',
  [[
    `<span class="eyebrow">SDP201 · Chapter 5 · Lesson 5.1</span>
<h2>Foley &amp; sound effects (SFX) design</h2>
<h3>Three kinds of effects</h3>
<ul>
<li><strong>Foley</strong> — everyday sounds performed live to picture: footsteps, cloth movement, handling props. Named after Jack Foley.</li>
<li><strong>Hard effects</strong> — specific, sync-to-action sounds: a door slam, a gunshot, a sword clang.</li>
<li><strong>Ambience / backgrounds</strong> — the continuous bed of a place: room tone, wind, city hum, forest.</li>
</ul>
<h3>Layering — the core technique</h3>
<p>A convincing effect is rarely one recording. Following <strong>Sonnenschein</strong>, you <strong>layer</strong> sources so each covers a frequency range and adds character.</p>
<pre><code>Design: a punch impact
  Low  : a soft thud / bass drum  (body &amp; weight)
  Mid  : a slap on skin           (contact)
  High : a small twig snap        (detail / bite)
  -&gt; pitch, trim and mix the three into ONE punch</code></pre>
<h3>Sourcing sound</h3>
<p>Record your own (a <strong>Viers</strong> approach — celery snaps for bone, coconut halves for hooves) or pull from a <strong>sound library</strong>. Always keep sounds organised and named so you can find them later.</p>
<h3>Diegetic vs non-diegetic</h3>
<p><strong>Diegetic</strong> sound exists in the story world (a character hears it); <strong>non-diegetic</strong> is for the audience only (score, a stylised whoosh). Knowing which you are making guides how real it must sound.</p>
<div class="callout"><span class="badge">Design mindset</span> Do not just match the picture — express it. A bigger thud, a sharper snap, a deeper rumble tells the audience how to feel.</div>`,
    `<span class="eyebrow">SDP201 · Chương 5 · Bài 5.1</span>
<h2>Foley &amp; thiết kế hiệu ứng (SFX)</h2>
<h3>Ba loại hiệu ứng</h3>
<ul>
<li><strong>Foley</strong> — âm thanh đời thường diễn live theo hình: bước chân, tiếng vải, cầm nắm đạo cụ. Đặt theo tên Jack Foley.</li>
<li><strong>Hard effects</strong> — âm cụ thể khớp hành động: sập cửa, phát súng, chạm kiếm.</li>
<li><strong>Ambience / nền</strong> — lớp âm liên tục của một nơi: tiếng phòng, gió, ồn phố, rừng.</li>
</ul>
<h3>Xếp lớp (layering) — kỹ thuật cốt lõi</h3>
<p>Một hiệu ứng thuyết phục hiếm khi chỉ là một bản thu. Theo <strong>Sonnenschein</strong>, bạn <strong>xếp lớp</strong> các nguồn để mỗi lớp phủ một dải tần và thêm tính chất.</p>
<pre><code>Thiết kế: một cú đấm
  Trầm : tiếng thịch mềm / trống bass  (thân &amp; sức nặng)
  Giữa : tiếng vỗ vào da               (điểm chạm)
  Cao  : tiếng gãy cành nhỏ            (chi tiết / độ sắc)
  -&gt; chỉnh cao độ, cắt và trộn ba lớp thành MỘT cú đấm</code></pre>
<h3>Nguồn âm thanh</h3>
<p>Tự thu (kiểu <strong>Viers</strong> — bẻ cần tây làm tiếng gãy xương, hai nửa gáo dừa làm tiếng vó ngựa) hoặc lấy từ một <strong>thư viện âm thanh</strong>. Luôn sắp xếp và đặt tên gọn để tìm lại được.</p>
<h3>Diegetic vs non-diegetic</h3>
<p>Âm <strong>diegetic</strong> tồn tại trong thế giới truyện (nhân vật nghe được); <strong>non-diegetic</strong> chỉ dành cho khán giả (nhạc nền, một tiếng whoosh cách điệu). Biết mình đang làm loại nào sẽ định mức độ chân thật cần có.</p>
<div class="callout"><span class="badge">Tư duy thiết kế</span> Đừng chỉ khớp hình — hãy biểu đạt nó. Tiếng thịch to hơn, tiếng gãy sắc hơn, tiếng rền sâu hơn báo cho khán giả biết nên cảm thấy thế nào.</div>`,
  ]]);

const c5q = quiz('sdp201-quiz-5', 'Quiz 5 — Foley &amp; SFX|||Quiz 5 — Foley &amp; SFX', [
  { id: 'q1', question: 'Foley là gì?', options: ['Nhạc nền của phim', 'Âm đời thường diễn live theo hình (bước chân, vải, đạo cụ)', 'Một định dạng file', 'Một loại micro'], correctIndex: 1, explanation: 'Foley là âm đời thường được diễn live khớp hình, đặt theo tên Jack Foley.' },
  { id: 'q2', question: 'Kỹ thuật "layering" trong thiết kế SFX nghĩa là?', options: ['Chỉ dùng một bản thu duy nhất', 'Xếp nhiều lớp âm phủ các dải tần khác nhau thành một hiệu ứng', 'Tăng sample rate', 'Xoá nhiễu nền'], correctIndex: 1, explanation: 'Layering ghép nhiều nguồn (trầm/giữa/cao) để mỗi lớp thêm sức nặng, điểm chạm và chi tiết.' },
  { id: 'q3', question: 'Âm "non-diegetic" là âm?', options: ['Nhân vật trong phim nghe được', 'Chỉ dành cho khán giả, không tồn tại trong thế giới truyện', 'Luôn là tiếng bước chân', 'Chỉ có ở game'], correctIndex: 1, explanation: 'Non-diegetic (vd nhạc nền) chỉ khán giả nghe; diegetic tồn tại trong thế giới truyện.' },
]);

const c6 = doc('sdp201-6-1-signal-processing', '6.1 — Signal processing: EQ, compression, reverb|||6.1 — Xử lý tín hiệu: EQ, nén, reverb',
  'EQ (cắt/tăng dải tần, high-pass/low-pass, parametric); nén (threshold/ratio/attack/release/makeup); reverb (mô phỏng phòng, decay, wet/dry); thứ tự chuỗi.',
  [[
    `<span class="eyebrow">SDP201 · Chapter 6 · Lesson 6.1</span>
<h2>Signal processing</h2>
<h3>EQ — shaping tone (frequency)</h3>
<p><strong>Equalisation</strong> boosts or cuts specific frequency bands.</p>
<ul>
<li><strong>High-pass filter</strong> — removes low rumble below a point; cleans nearly every track.</li>
<li><strong>Low-pass filter</strong> — removes highs above a point; makes sounds dull or distant.</li>
<li><strong>Parametric band</strong> — boost/cut a chosen frequency by a chosen amount. Cut to remove problems; boost to add character.</li>
</ul>
<h3>Compression — controlling dynamics (loudness)</h3>
<p>A <strong>compressor</strong> turns down audio that exceeds a level, evening out loud and quiet so the result sits steadily in the mix.</p>
<pre><code>Threshold -&gt; the level above which it acts
Ratio     -&gt; how hard it turns down (4:1 = firm)
Attack    -&gt; how fast it clamps (fast = tame transients)
Release   -&gt; how fast it lets go
Makeup    -&gt; gain back the loudness it removed</code></pre>
<h3>Reverb &amp; delay — space (time)</h3>
<p><strong>Reverb</strong> simulates a room from the reflections that follow a sound; set the <strong>decay</strong> (how long it rings) and the <strong>wet/dry</strong> balance (how much effect vs original). <strong>Delay</strong> repeats the sound as distinct echoes.</p>
<h3>Signal chain order</h3>
<pre><code>Source -&gt; EQ (clean up) -&gt; Compression -&gt; EQ (tone)
       -&gt; Reverb / Delay (send) -&gt; output</code></pre>
<div class="callout"><span class="badge">Order matters</span> Filter out rubbish first, control dynamics next, add space last. Reverb on a noisy, uneven signal just smears the mess.</div>`,
    `<span class="eyebrow">SDP201 · Chương 6 · Bài 6.1</span>
<h2>Xử lý tín hiệu</h2>
<h3>EQ — nắn âm sắc (tần số)</h3>
<p><strong>EQ (cân bằng tần số)</strong> tăng hoặc cắt các dải tần cụ thể.</p>
<ul>
<li><strong>High-pass filter</strong> — bỏ tiếng rền tần thấp dưới một điểm; làm sạch gần như mọi track.</li>
<li><strong>Low-pass filter</strong> — bỏ tần cao trên một điểm; khiến âm mờ đi hoặc nghe xa.</li>
<li><strong>Dải parametric</strong> — tăng/cắt một tần số chọn với lượng chọn. Cắt để bỏ vấn đề; tăng để thêm tính chất.</li>
</ul>
<h3>Nén (compression) — điều khiển động (độ to)</h3>
<p><strong>Bộ nén</strong> hạ những phần vượt một mức, san bằng chỗ to chỗ nhỏ để kết quả nằm ổn định trong bản mix.</p>
<pre><code>Threshold -&gt; mức mà trên đó bộ nén tác động
Ratio     -&gt; hạ mạnh cỡ nào (4:1 = chắc tay)
Attack    -&gt; kẹp nhanh cỡ nào (nhanh = ghìm transient)
Release   -&gt; nhả nhanh cỡ nào
Makeup    -&gt; bù lại độ to đã hạ</code></pre>
<h3>Reverb &amp; delay — không gian (thời gian)</h3>
<p><strong>Reverb</strong> mô phỏng một căn phòng từ các phản xạ theo sau một âm; đặt <strong>decay</strong> (ngân bao lâu) và cân <strong>wet/dry</strong> (bao nhiêu hiệu ứng so với âm gốc). <strong>Delay</strong> lặp lại âm thành các tiếng vọng rõ ràng.</p>
<h3>Thứ tự chuỗi tín hiệu</h3>
<pre><code>Nguồn -&gt; EQ (làm sạch) -&gt; Nén -&gt; EQ (âm sắc)
      -&gt; Reverb / Delay (send) -&gt; đầu ra</code></pre>
<div class="callout"><span class="badge">Thứ tự quan trọng</span> Lọc rác trước, kiểm soát động sau, thêm không gian sau cùng. Reverb trên một tín hiệu ồn và lệch chỉ làm nhoè mớ hỗn độn.</div>`,
  ]]);

const c6q = quiz('sdp201-quiz-6', 'Quiz 6 — Signal processing|||Quiz 6 — Xử lý tín hiệu', [
  { id: 'q1', question: 'Trong bộ nén (compressor), tham số "ratio" quyết định điều gì?', options: ['Reverb ngân bao lâu', 'Mức độ hạ âm vượt ngưỡng (vd 4:1)', 'Tần số cắt của high-pass', 'Sample rate'], correctIndex: 1, explanation: 'Ratio quyết định nén mạnh cỡ nào phần vượt threshold; 4:1 là nén chắc tay.' },
  { id: 'q2', question: 'High-pass filter dùng để làm gì?', options: ['Bỏ tần cao', 'Bỏ tiếng rền tần thấp dưới một điểm', 'Thêm reverb', 'Tăng độ to tổng'], correctIndex: 1, explanation: 'High-pass cho tần cao đi qua và cắt tần thấp (rền), làm sạch gần như mọi track.' },
  { id: 'q3', question: 'Thứ tự chuỗi tín hiệu hợp lý nhất là?', options: ['Reverb → EQ → Nén', 'EQ làm sạch → Nén → thêm không gian (reverb) sau cùng', 'Nén → Reverb → không lọc gì', 'Chỉ reverb'], correctIndex: 1, explanation: 'Lọc rác trước, kiểm soát động, rồi mới thêm không gian; reverb trên tín hiệu ồn/lệch chỉ làm nhoè.' },
]);

const c7 = doc('sdp201-7-1-mixing-mastering', '7.1 — Mixing &amp; mastering|||7.1 — Mixing &amp; mastering',
  'Owsinski Mixing Engineer: cân mức, panning, EQ, động, hiệu ứng, bus/group; 6 yếu tố mix; mastering (LUFS, limiting, dither); track tham chiếu.',
  [[
    `<span class="eyebrow">SDP201 · Chapter 7 · Lesson 7.1</span>
<h2>Mixing &amp; mastering</h2>
<h3>Mixing — balancing the whole</h3>
<p><strong>Mixing</strong> blends every track into one coherent piece. Following <strong>Bobby Owsinski</strong>, a mix is built from a few elements:</p>
<ul>
<li><strong>Balance</strong> — relative volume of each track; the single most important move.</li>
<li><strong>Panning</strong> — placement left to right, creating a stereo stage.</li>
<li><strong>EQ</strong> — give each element its own frequency space so nothing masks another.</li>
<li><strong>Dynamics</strong> — compression to keep parts steady and glued.</li>
<li><strong>Effects</strong> — reverb and delay for depth (front to back).</li>
</ul>
<h3>Buses &amp; groups</h3>
<p>Route related tracks (all dialogue, all Foley) to a <strong>bus / group</strong> so you can process and level them together. It keeps a big session under control.</p>
<h3>Mastering — the final polish</h3>
<p><strong>Mastering</strong> is the last stage on the finished mix: gentle EQ, glue compression, and a <strong>limiter</strong> to reach a target loudness without clipping. Loudness is measured in <strong>LUFS</strong> (a standard for perceived level). When reducing bit depth, add <strong>dither</strong> — a tiny noise that hides quantisation distortion.</p>
<pre><code>Gain staging: leave headroom on the mix bus (~ -6 dBFS)
Reference: A/B against a pro track you admire
Limiter last: hit target LUFS, keep true-peak below 0</code></pre>
<div class="callout"><span class="badge">Trust references</span> Ears drift and adapt. Compare with a professional <strong>reference track</strong> and take breaks — fatigue makes everything sound fine.</div>`,
    `<span class="eyebrow">SDP201 · Chương 7 · Bài 7.1</span>
<h2>Mixing &amp; mastering</h2>
<h3>Mixing — cân bằng tổng thể</h3>
<p><strong>Mixing</strong> hoà mọi track thành một tổng thể mạch lạc. Theo <strong>Bobby Owsinski</strong>, một bản mix dựng từ vài yếu tố:</p>
<ul>
<li><strong>Cân mức (balance)</strong> — âm lượng tương đối của từng track; nước đi quan trọng nhất.</li>
<li><strong>Panning</strong> — đặt trái sang phải, tạo sân khấu stereo.</li>
<li><strong>EQ</strong> — cho mỗi thành phần một khoảng tần riêng để không cái nào che cái nào.</li>
<li><strong>Động (dynamics)</strong> — nén để các phần ổn định và dính vào nhau.</li>
<li><strong>Hiệu ứng</strong> — reverb và delay tạo chiều sâu (trước ra sau).</li>
</ul>
<h3>Bus &amp; group</h3>
<p>Định tuyến các track cùng nhóm (mọi thoại, mọi Foley) về một <strong>bus / group</strong> để xử lý và cân mức chúng cùng lúc. Nó giữ một phiên lớn trong tầm kiểm soát.</p>
<h3>Mastering — đánh bóng cuối cùng</h3>
<p><strong>Mastering</strong> là khâu cuối trên bản mix đã xong: EQ nhẹ, nén dính, và một <strong>limiter</strong> để đạt độ to mục tiêu mà không clip. Độ to đo bằng <strong>LUFS</strong> (chuẩn cho mức cảm nhận). Khi hạ bit depth, thêm <strong>dither</strong> — một chút nhiễu nhỏ che méo lượng tử hoá.</p>
<pre><code>Gain staging: chừa headroom trên mix bus (~ -6 dBFS)
Tham chiếu: A/B với một bản pro mà bạn ngưỡng mộ
Limiter cuối: đạt LUFS mục tiêu, giữ true-peak dưới 0</code></pre>
<div class="callout"><span class="badge">Tin vào tham chiếu</span> Tai bị trôi và thích nghi. So với một <strong>track tham chiếu</strong> chuyên nghiệp và nghỉ giải lao — mệt tai làm mọi thứ nghe cũng ổn.</div>`,
  ]]);

const c7q = quiz('sdp201-quiz-7', 'Quiz 7 — Mixing &amp; mastering|||Quiz 7 — Mixing &amp; mastering', [
  { id: 'q1', question: 'Theo Owsinski, yếu tố quan trọng nhất khi mix thường là?', options: ['Reverb thật dài', 'Cân mức (balance) âm lượng giữa các track', 'Thêm càng nhiều plugin càng tốt', 'Panning tất cả sang một bên'], correctIndex: 1, explanation: 'Cân mức âm lượng tương đối là nước đi nền tảng và quan trọng nhất của mixing.' },
  { id: 'q2', question: 'LUFS dùng để đo gì?', options: ['Sample rate', 'Độ to cảm nhận (loudness) theo chuẩn', 'Số track trong phiên', 'Nhiệt độ phòng thu'], correctIndex: 1, explanation: 'LUFS là chuẩn đo độ to cảm nhận, dùng khi master để đạt mức mục tiêu.' },
  { id: 'q3', question: 'Khi hạ bit depth lúc master, "dither" là gì?', options: ['Một loại reverb', 'Một chút nhiễu nhỏ thêm vào để che méo lượng tử hoá', 'Cách tăng sample rate', 'Một kiểu panning'], correctIndex: 1, explanation: 'Dither là nhiễu rất nhỏ giúp che méo lượng tử hoá khi giảm số bit.' },
]);

const c8 = doc('sdp201-8-1-audio-for-picture-games', '8.1 — Audio for animation, film &amp; games|||8.1 — Âm thanh cho hoạt hình, phim &amp; game',
  'Đồng bộ theo hình & spotting; thoại/ADR, Foley, nhạc, SFX; âm thanh game tương tác/thích ứng (middleware Wwise/FMOD, loop, one-shot); mix theo chuẩn giao.',
  [[
    `<span class="eyebrow">SDP201 · Chapter 8 · Lesson 8.1</span>
<h2>Audio for animation, film &amp; games</h2>
<h3>Linear media (film / animation)</h3>
<p>Here sound is fixed to a timeline and must <strong>sync to picture</strong> frame-accurately. The workflow:</p>
<ul>
<li><strong>Spotting</strong> — watch the cut and mark where each sound is needed.</li>
<li><strong>Dialogue &amp; ADR</strong> — clean the recorded lines; when a line is unusable, re-record it in the studio to the picture. That is <strong>ADR (Automated Dialogue Replacement)</strong>.</li>
<li><strong>Foley, SFX &amp; music</strong> — perform, design and place them on the timeline.</li>
<li><strong>Final mix</strong> — balance dialogue, music and effects, then deliver to the target loudness (broadcast often around <strong>-23 LUFS</strong>).</li>
</ul>
<h3>Interactive media (games)</h3>
<p>Game audio is <strong>non-linear</strong>: the player, not an editor, decides when things happen. Sound must react in real time.</p>
<pre><code>One-shot -&gt; plays once on an event (a jump, a hit)
Loop     -&gt; a bed that repeats seamlessly (engine, wind)
Adaptive -&gt; music/ambience shifts with game state
Middleware (Wwise / FMOD): the audio engine that
  triggers, randomises &amp; mixes sounds from game events</code></pre>
<p><strong>Randomisation</strong> — several footstep samples chosen at random — stops repetition from sounding robotic. <strong>Adaptive music</strong> raises intensity in combat and settles when safe.</p>
<div class="callout"><span class="badge">Linear vs interactive</span> Film audio is <em>authored once</em> to a fixed picture; game audio is a <em>system</em> that must sound right for every path the player takes.</div>`,
    `<span class="eyebrow">SDP201 · Chương 8 · Bài 8.1</span>
<h2>Âm thanh cho hoạt hình, phim &amp; game</h2>
<h3>Media tuyến tính (phim / hoạt hình)</h3>
<p>Ở đây âm thanh gắn cố định vào một timeline và phải <strong>đồng bộ theo hình</strong> chính xác tới từng khung. Quy trình:</p>
<ul>
<li><strong>Spotting</strong> — xem bản dựng và đánh dấu chỗ nào cần âm gì.</li>
<li><strong>Thoại &amp; ADR</strong> — làm sạch lời đã thu; khi một câu không dùng được, thu lại trong phòng thu khớp hình. Đó là <strong>ADR (Automated Dialogue Replacement)</strong>.</li>
<li><strong>Foley, SFX &amp; nhạc</strong> — diễn, thiết kế và đặt lên timeline.</li>
<li><strong>Mix cuối</strong> — cân thoại, nhạc và hiệu ứng, rồi bàn giao ở độ to mục tiêu (phát sóng thường quanh <strong>-23 LUFS</strong>).</li>
</ul>
<h3>Media tương tác (game)</h3>
<p>Âm thanh game <strong>phi tuyến</strong>: người chơi, không phải người dựng, quyết định khi nào việc gì xảy ra. Âm phải phản ứng theo thời gian thực.</p>
<pre><code>One-shot -&gt; phát một lần theo sự kiện (nhảy, trúng đòn)
Loop     -&gt; nền lặp liền mạch (động cơ, gió)
Adaptive -&gt; nhạc/ambience đổi theo trạng thái game
Middleware (Wwise / FMOD): engine âm thanh
  kích hoạt, ngẫu nhiên hoá &amp; mix âm từ sự kiện game</code></pre>
<p><strong>Ngẫu nhiên hoá</strong> — chọn ngẫu nhiên trong vài mẫu bước chân — tránh việc lặp nghe như máy. <strong>Nhạc thích ứng</strong> đẩy cường độ khi chiến đấu và dịu lại khi an toàn.</p>
<div class="callout"><span class="badge">Tuyến tính vs tương tác</span> Âm thanh phim được <em>dựng một lần</em> theo hình cố định; âm thanh game là một <em>hệ thống</em> phải nghe đúng với mọi hướng đi của người chơi.</div>`,
  ]]);

const c8q = quiz('sdp201-quiz-8', 'Quiz 8 — Audio for picture &amp; games|||Quiz 8 — Âm thanh cho hình &amp; game', [
  { id: 'q1', question: 'ADR (Automated Dialogue Replacement) là gì?', options: ['Một loại reverb', 'Thu lại lời thoại trong phòng thu khớp với hình khi bản thu gốc không dùng được', 'Một định dạng file game', 'Cách nén âm thanh'], correctIndex: 1, explanation: 'ADR là thu lại thoại trong phòng thu khớp hình khi lời thu tại hiện trường không dùng được.' },
  { id: 'q2', question: 'Khác biệt cốt lõi giữa âm thanh phim và âm thanh game là?', options: ['Game không cần âm thanh', 'Phim tuyến tính (cố định theo hình); game phi tuyến, phải phản ứng theo hành động người chơi', 'Phim không dùng SFX', 'Game chỉ dùng nhạc'], correctIndex: 1, explanation: 'Âm thanh phim dựng một lần theo timeline cố định; âm thanh game là hệ thống phản ứng thời gian thực.' },
  { id: 'q3', question: 'Wwise và FMOD là gì trong âm thanh game?', options: ['Hai loại micro', 'Middleware (engine âm thanh) kích hoạt, ngẫu nhiên hoá và mix âm từ sự kiện game', 'Hai định dạng nén', 'Hai track tham chiếu'], correctIndex: 1, explanation: 'Wwise/FMOD là middleware âm thanh, nối sự kiện game với việc phát, ngẫu nhiên hoá và mix âm.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'SDP201',
    slug: 'sdp201-sound-production',
    title: 'Sound Production',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SDP201.webp',
    shortDescription: 'How audio is produced for media, animation & games — waves & dB, digital audio (sample rate, bit depth), recording & mics, DAW editing, Foley & SFX, EQ/compression/reverb, mixing & mastering, audio for film & games. Bilingual, with quizzes.|||Sản xuất âm thanh cho media, hoạt hình & game — sóng & dB, âm thanh số, thu âm & micro, biên tập DAW, Foley & SFX, EQ/nén/reverb, mixing & mastering, âm thanh cho phim & game. Song ngữ, có quiz.',
    description: 'Môn <strong>SDP201 — Sound Production</strong> (kỳ 7, ngành Thiết kế mỹ thuật số) dạy <strong>cách sản xuất âm thanh cho media, hoạt hình và game</strong>. Từ <strong>cơ sở âm thanh</strong> (sóng, tần số, biên độ, dB) &amp; <strong>âm thanh số</strong> (sample rate, bit depth) → <strong>thu âm &amp; micro</strong> → <strong>biên tập trong DAW</strong> → <strong>Foley &amp; thiết kế SFX</strong> → <strong>xử lý tín hiệu</strong> (EQ, nén, reverb) → <strong>mixing &amp; mastering</strong> → <strong>âm thanh theo hình cho phim &amp; game</strong> (sync, ADR, âm thanh tương tác). Bám giáo trình Sonnenschein, Viers, Owsinski; song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Sóng/tần số/biên độ &amp; decibel; sample rate, bit depth, định dạng file (WAV/FLAC/MP3); loại micro &amp; hướng thu, gain staging &amp; headroom; biên tập không phá huỷ trong DAW (cắt/fade/crossfade, zero-crossing); Foley &amp; xếp lớp SFX; EQ, nén (threshold/ratio/attack/release), reverb &amp; delay; mixing (balance, panning, bus) &amp; mastering (LUFS, limiting, dither); đồng bộ theo hình, ADR, âm thanh game (Wwise/FMOD, loop, one-shot, adaptive).',
    requirements: 'Không cần nền tảng âm thanh trước. Nên cài một DAW miễn phí (Audacity hoặc Reaper) và có tai nghe để thực hành.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách (Sonnenschein/Viers/Owsinski), DAW, YouTube, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Âm thanh trong media/game, chuỗi sản xuất, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Cơ sở âm thanh|||Chapter 1 — Sound fundamentals', description: 'Sóng, tần số, biên độ, decibel, âm sắc.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Âm thanh số|||Chapter 2 — Digital audio', description: 'Sample rate, bit depth, Nyquist, định dạng file.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thu âm & micro|||Chapter 3 — Recording & mics', description: 'Loại micro, hướng thu, kỹ thuật đặt mic, gain staging.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Biên tập & DAW|||Chapter 4 — Editing & DAW', description: 'Track/clip, cắt/fade/crossfade, không phá huỷ, zero-crossing.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Foley & SFX|||Chapter 5 — Foley & SFX', description: 'Foley, hard effects, ambience, xếp lớp, diegetic.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Xử lý tín hiệu|||Chapter 6 — Signal processing', description: 'EQ, nén, reverb/delay, thứ tự chuỗi tín hiệu.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Mixing & mastering|||Chapter 7 — Mixing & mastering', description: 'Balance, panning, bus, LUFS, limiting, dither.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Âm thanh cho hình & game|||Chapter 8 — Audio for picture & games', description: 'Sync, ADR, âm thanh game tương tác (Wwise/FMOD).', lessons: [c8, c8q] },
  ],
};
