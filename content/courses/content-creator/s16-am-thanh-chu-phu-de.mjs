/**
 * Content Creator — Chương 16: Âm thanh hậu kỳ, chữ, đồ hoạ & phụ đề. Song ngữ EN/VI (.ml-en / .ml-vi).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 *
 * Nguồn số liệu chính (xem đầy đủ trong báo cáo bàn giao):
 *  - LUFS/true peak đo thật bằng ffmpeg ebur128 + loudnorm (2 lượt) trong scratch của phiên soạn bài
 *  - EBU R128 true peak ≤ −1 dBTP: tech.ebu.ch/docs/r/r128.pdf
 *  - YouTube KHÔNG công bố số LUFS chính thức — đã kiểm support.google.com, không có trang nào ghi rõ
 *  - DaVinci Resolve Fairlight free vs Studio: đối chiếu với Chương 13 (bảng free/Studio) + nhiều nguồn độc lập
 *  - YouTube auto captions: support.google.com/youtube/answer/6373554
 *  - YouTube tải phụ đề lên: support.google.com/youtube/answer/2734796
 *  - YouTube định dạng phụ đề hỗ trợ (.srt xác nhận): support.google.com/youtube/answer/2734698
 *  - Font tiếng Việt: fonts.google.com/specimen/Be+Vietnam+Pro, /Roboto?subset=vietnamese, /Inter?subset=vietnamese
 *  - faster-whisper: github.com/SYSTRAN/faster-whisper (README)
 *  - whisper.cpp: github.com/ggml-org/whisper.cpp (README)
 *  - Số đo GPU/VRAM/thời gian chạy Whisper: đo trên máy nhà của người điều phối, 22/09/2026
 */
import { gallery, slide } from './_slides.mjs';

export default {
  title: 'Chapter 16 — Post sound, text, graphics & subtitles|||Chương 16 — Âm thanh hậu kỳ, chữ, đồ hoạ & phụ đề',
  description: 'Dạy trộn âm thanh về đúng chuẩn độ lớn của nền tảng bằng số đo LUFS/true peak thật, dựng chuỗi xử lý giọng, thiết kế chữ/đồ hoạ đọc được, viết đúng định dạng SRT, và tự tạo phụ đề song ngữ bằng Whisper chạy trên GPU ở nhà.',
  lessons: [
    /* ─────────────────── 16.0 slide bài giảng ─────────────────── */
    {
      title: '16.0 — Chapter 16 in 16 slides|||16.0 — Chương 16 trong 16 slide',
      slug: 'cr-16-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Toàn bộ chương 16 gói trong 16 slide: LUFS thật đo bằng ffmpeg, chuỗi xử lý giọng, chữ/đồ hoạ, SRT, và Whisper trên máy Linux.',
      content: `
<div class="ml-en"><h2>📑 Chapter 16 in 16 slides</h2>
<p>Chapter 9 got your voice recorded clean on set — peaks between −12 and −6 dBFS, no clipping. That is necessary but not sufficient. A quiet, clean recording can still sit far too quiet (or too loud) once it reaches a platform that automatically adjusts playback volume, and a beautifully cut video can still lose half its audience if the on-screen text is illegible or the captions are missing. This chapter closes the loop: mixing to a real loudness target instead of guessing, laying text and graphics viewers can actually read, writing subtitles in the format every platform expects, and — because you have a GPU sitting idle at home — generating those subtitles automatically instead of typing every line by hand.</p>
<p>Skim these 16 slides before the four lessons below, then come back to slide 6 (the true-peak ceiling) and slide 15 (the quick-reference table) whenever you forget a number mid-edit.</p></div>
<div class="ml-vi"><h2>📑 Chương 16 trong 16 slide</h2>
<p>Chương 9 đã lo cho giọng nói của bạn sạch ngay lúc quay — đỉnh nằm trong −12…−6dBFS, không vỡ tiếng. Vậy là cần, nhưng chưa đủ. Một bản ghi sạch, yên tĩnh vẫn có thể quá nhỏ (hoặc quá to) một khi tới tay một nền tảng tự động chỉnh âm lượng phát lại, và một video dựng đẹp vẫn mất phân nửa người xem nếu chữ trên hình không đọc được hoặc thiếu phụ đề. Chương này khép vòng lặp đó: mix về đúng mục tiêu độ lớn thay vì đoán, đặt chữ/đồ hoạ mà người xem thật sự đọc được, viết phụ đề đúng định dạng mọi nền tảng chấp nhận, và — vì bạn có sẵn một GPU ngồi không ở nhà — tự động sinh phụ đề đó thay vì gõ tay từng dòng.</p>
<p>Lướt qua 16 slide này trước khi vào 4 bài dưới, rồi quay lại slide 6 (trần true peak) và slide 15 (bảng tra nhanh) mỗi khi quên số giữa buổi dựng.</p></div>
${gallery('cr-16', [
  [1, 'Bìa chương'],
  [2, 'Bản đồ chương'],
  [3, 'Vì sao mix hậu kỳ khác lúc quay'],
  [4, 'dBFS tức thời vs LUFS cảm nhận (minh hoạ)'],
  [5, 'Đo & chuẩn hoá thật bằng ffmpeg — 2 lượt'],
  [6, 'True peak — trần −1 dBTP (EBU R128)'],
  [7, 'Chuỗi xử lý giọng'],
  [8, 'Fairlight: miễn phí hay Studio?'],
  [9, 'Chữ & đồ hoạ cho video'],
  [10, 'Ba font tiếng Việt đủ dấu'],
  [11, 'Phụ đề cứng (burn-in) và phụ đề mềm'],
  [12, 'Cấu trúc file SRT thật'],
  [13, 'Phụ đề trong vùng an toàn — đặt đúng/sai'],
  [14, 'Whisper trên máy Linux → SRT VI/EN → Mac'],
  [15, 'Bảng tra nhanh trước khi làm hậu kỳ'],
  [16, 'Thực hành'],
])}
`,
    },

    /* ─────────────────── 16.1 Mix âm thanh ─────────────────── */
    {
      title: '16.1 — Mixing sound: LUFS, true peak, the vocal chain|||16.1 — Mix âm thanh: LUFS, true peak, chuỗi xử lý giọng',
      slug: 'cr-16-1-mix-am-thanh',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'LUFS khác dBFS thế nào, đo & chuẩn hoá thật bằng ffmpeg loudnorm hai lượt, trần true peak theo EBU R128, chuỗi xử lý giọng, và Fairlight miễn phí làm được gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.1</span>
<h2>Your peaks are clean. Is the video actually the right loudness?</h2>
<p class="lead">Chapter 9.3 taught you to read peaks with &#96;ffmpeg -af volumedetect&#96; and keep them at −12…−6 dBFS while recording. That number tells you whether a single moment clips — it says almost nothing about how LOUD the whole video feels next to every other video on the platform. That is a different measurement, LUFS, and this lesson is about mixing to it on purpose instead of exporting whatever level you happened to record at.</p>

${slide('cr-16', 3, 'Vì sao mix hậu kỳ khác lúc quay')}

<h3>dBFS tells you "did it clip." LUFS tells you "how loud does it feel."</h3>
<p>dBFS (decibels Full Scale, from Chapter 9.1) is an <strong>instantaneous</strong> reading — it jumps with every sample, spiking on a loud word and dropping in the silence right after. <strong>LUFS</strong> (Loudness Units Full Scale) integrates level over time using a model closer to human hearing, so it stays comparatively stable even while the raw waveform is jumping around underneath it. A video can have perfectly clean −8 dBFS peaks and still measure far too quiet or too loud in LUFS, because LUFS is answering a different question: not "did any single instant clip" but "how loud does a viewer feel this whole video is."</p>
${slide('cr-16', 4, 'dBFS tức thời vs LUFS cảm nhận (minh hoạ)')}

<h3>The target: roughly −14 LUFS — and where that number actually comes from</h3>
<div class="callout warn"><p><strong>Checked directly, not assumed:</strong> YouTube's own Help Center does not publish an exact LUFS figure for video loudness normalization (checked support.google.com, as of 09/2026 no page states one — YouTube Music's separate community threads about a −7 LKFS-style song target are a different system). <strong>−14 LUFS</strong> circulates everywhere because it is the default target in mixing tools and matches independent community measurement, not because YouTube wrote it down. Treat it as a well-supported reference point, not a written promise.</p></div>
<p>What matters practically: platforms that loudness-normalize on playback only ever turn your audio <strong>down</strong> if it is louder than their target — they do not turn quiet audio up for you. Mixing to roughly −14 LUFS integrated keeps your video close to its intended level everywhere, instead of getting turned down after the fact or sitting oddly louder/quieter than everyone else's video in the same feed.</p>

<h3>Measuring and normalizing for real, with ffmpeg — two passes</h3>
${slide('cr-16', 5, 'Đo & chuẩn hoá thật bằng ffmpeg — 2 lượt')}
<p>Every number here came from actually running these commands on a real test file, not from a spec sheet. First, measure a deliberately under-mixed test clip with &#96;ebur128&#96; (the same filter Lesson 9.3 introduced):</p>
<pre><code class="language-bash">ffmpeg -i truoc-chuan-hoa.wav -af ebur128=peak=true -f null -</code></pre>
<div class="out">Integrated loudness:
  I:         -42.0 LUFS
Loudness range:
  LRA:         0.0 LU
True peak:
  Peak:      -41.1 dBFS</div>
<p>Far too quiet. Now run &#96;loudnorm&#96; in its recommended <strong>two-pass</strong> mode. Pass one only measures — it changes nothing:</p>
<pre><code class="language-bash">ffmpeg -i in.wav -af loudnorm=I=-14:TP=-1:LRA=11:print_format=json -f null -</code></pre>
<div class="out">{
  "input_i" : "-42.05", "input_tp" : "-41.05", "input_lra" : "0.00",
  "input_thresh" : "-52.05", "target_offset" : "-0.05"
}</div>
<p>Pass two feeds those exact &#96;measured_*&#96; numbers back in with &#96;linear=true&#96; (a linear gain change, which preserves the dynamics you just spent Lesson 14.4 shaping — avoid the single-pass, non-linear mode for anything with real dynamic range) and actually writes the file:</p>
<pre><code class="language-bash">ffmpeg -i in.wav -af loudnorm=I=-14:TP=-1:LRA=11:measured_I=-42.05:\\
  measured_TP=-41.05:measured_LRA=0.00:measured_thresh=-52.05:\\
  offset=-0.05:linear=true out.wav</code></pre>
<p>Then — do not just trust loudnorm's own printout — measure the RESULT independently with the same &#96;ebur128&#96; command from before:</p>
<div class="out">Integrated loudness:
  I:         -14.0 LUFS
True peak:
  Peak:      -13.1 dBFS</div>
<p>−14.0 LUFS, right on target, confirmed by a second, independent tool rather than taking loudnorm's word for its own work.</p>

<h3>True peak: the hard ceiling loudness alone will not protect you from</h3>
${slide('cr-16', 6, 'True peak — trần −1 dBTP (EBU R128)')}
<p>Notice the true peak above landed at −13.1 dBTP, nowhere near a ceiling — the test tone has very little difference between its average level and its instantaneous peaks (a low <strong>crest factor</strong>). Real speech and music have sharper peaks relative to their average loudness, so hitting −14 LUFS on real content pushes peaks much closer to the ceiling than this clean test suggests. The ceiling itself is not a guess: <strong>EBU R128</strong> sets the maximum permitted true peak in production at <strong>−1 dBTP</strong> (decibels True Peak — catches inter-sample peaks a simple dBFS reading can miss).</p>
<p><strong>True peak</strong> and LUFS solve different problems and both matter: LUFS is about how loud the whole video feels; true peak is a hard ceiling that, if crossed, causes the same harsh distortion Lesson 9.1 called clipping — except now it can happen invisibly, introduced by a platform's own re-encoding, even if your original file never touched 0 dBFS. Leave real margin under −1 dBTP (many mixers target −2 or −3 dBTP) rather than mixing right up against the line.</p>

<h3>The vocal processing chain</h3>
${slide('cr-16', 7, 'Chuỗi xử lý giọng')}
<p>A clean recording (Chapter 9) still usually benefits from a standard chain of processing before it is loud enough and polished enough to sit under a title sequence or over B-roll:</p>
<ul>
<li><strong>Denoise:</strong> DaVinci Resolve's one-click <strong>Voice Isolation</strong> AI tool, or CapCut's <strong>Reduce noise</strong> — both already covered in Lesson 12.3, and both gated behind a paid tier (Resolve Studio; CapCut Pro).</li>
<li><strong>EQ:</strong> a high-pass cut around <strong>80–100 Hz</strong> removes handling rumble, room hum, and wind that carries no actual voice content — nothing about a human voice's fundamental frequency lives down there.</li>
<li><strong>Compressor:</strong> evens out the gap between your quietest and loudest words, so a viewer does not have to keep adjusting their volume.</li>
<li><strong>De-esser:</strong> tames harsh "s"/"x" sibilance that a compressor alone tends to make worse, not better (compression raises quiet moments, including quiet-but-harsh sibilants).</li>
<li><strong>Limiter:</strong> the final safety net — a hard ceiling that catches anything still spiking toward 0 dBFS / your true-peak target after everything else.</li>
<li><strong>Music underneath:</strong> ducked under the voice — mechanics already taught in Lessons 12.3 and 14.4, not repeated here.</li>
</ul>

<h3>Fairlight: what is free, what needs Studio</h3>
${slide('cr-16', 8, 'Fairlight: miễn phí hay Studio?')}
<p>Chapter 13.1 already introduced <strong>Fairlight</strong> as Resolve's dedicated audio page. The split that matters here: the traditional, hands-on tools — 6-band parametric EQ, compressor, gate/expander, de-esser, limiter — ship in the <strong>free</strong> version, full channel-strip dynamics included. What needs <strong>Studio</strong> is the one-click <strong>AI</strong> layer: Voice Isolation and AI-assisted noise reduction (matching Chapter 13's free-vs-Studio table), plus automatic subtitle generation (Lesson 16.3). You can build this whole five-step chain by hand in free Resolve — Studio just buys a faster AI shortcut for the noisiest recordings.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — mixing by ear on laptop speakers, then it sounds wrong on a phone:</strong> laptop speakers are usually much more forgiving of thin, bass-light mixes than a phone speaker (where most of your audience actually watches). After ducking and compressing, listen back on your phone's own speaker, not just headphones — a mix that sounds full on studio-ish monitors can disappear entirely on a tiny phone driver if the low end was never addressed.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 16.2 moves from what viewers hear to what they read — text and graphics that stay legible over any footage, in a typeface that actually renders every Vietnamese diacritic.</p>

<h3>🎬 Practice (25–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Run &#96;ffmpeg -af ebur128=peak=true -f null -&#96; on any exported clip you have and read its real Integrated LUFS and True Peak lines.</li>
<li>Run the two-pass &#96;loudnorm&#96; sequence above on that same clip, targeting I=-14, TP=-1, LRA=11.</li>
<li>Measure the result independently with &#96;ebur128&#96; again — confirm it actually landed near −14 LUFS, do not trust loudnorm's own printout alone.</li>
<li>If you have DaVinci Resolve, open Fairlight and add EQ + Compressor + Limiter from the free effects list to one clip's channel strip.</li>
</ol><p><strong>Done when:</strong> you can read a real LUFS number from ffmpeg and say whether it needs to go up, down, or is already close to −14, without opening this lesson again.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">LUFS</span><span class="v">Loudness Units Full Scale — độ lớn CẢM NHẬN, tích hợp theo thời gian, khác dBFS tức thời.</span></div>
<div class="kv"><span class="k">True peak / dBTP</span><span class="v">Đỉnh thật, kể cả đỉnh liên-mẫu (inter-sample) — trần sản xuất khuyến nghị −1 dBTP (EBU R128).</span></div>
<div class="kv"><span class="k">loudnorm hai lượt</span><span class="v">Bộ lọc ffmpeg: lượt 1 chỉ ĐO, lượt 2 ÁP dụng đúng số đo được, &#96;linear=true&#96; giữ dải động.</span></div>
<div class="kv"><span class="k">Crest factor</span><span class="v">Chênh lệch giữa đỉnh tức thời và mức trung bình — giọng nói/nhạc thật cao hơn nhiều so với tông thử đơn giản.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>dBFS answers "did this instant clip"; LUFS answers "how loud does the whole video feel" — mix to both, they are not interchangeable.</li>
<li>−14 LUFS integrated is a widely used target, but it is community/industry consensus, not a number YouTube's Help Center publishes.</li>
<li>True peak ≤ −1 dBTP is an official EBU R128 production ceiling — leave real margin under it, do not mix right up to the line.</li>
<li>The vocal chain — denoise → EQ (cut 80–100Hz) → compressor → de-esser → limiter — is buildable entirely in free Resolve; Studio only speeds up the AI denoise step.</li>
<li>Always verify loudnorm's result with an independent &#96;ebur128&#96; pass, not the tool's own summary alone.</li>
</ul>

<div class="link-card"><a href="https://tech.ebu.ch/docs/r/r128.pdf" target="_blank" rel="noopener">EBU R128 — official loudness recommendation (true peak ≤ −1 dBTP)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.1</span>
<h2>Đỉnh đã sạch. Nhưng cả video có ĐÚNG độ lớn không?</h2>
<p class="lead">Bài 9.3 đã dạy bạn đọc đỉnh bằng &#96;ffmpeg -af volumedetect&#96; và giữ nó trong −12…−6dBFS lúc quay. Con số đó chỉ nói lên một khoảnh khắc có vỡ tiếng hay không — nó gần như không nói lên cả video nghe TO cỡ nào so với mọi video khác trên nền tảng. Đó là một phép đo khác, LUFS, và bài này nói về việc mix VỀ ĐÚNG con số đó một cách có chủ đích, thay vì xuất ra bất kỳ mức nào bạn tình cờ quay được.</p>

${slide('cr-16', 3, 'Vì sao mix hậu kỳ khác lúc quay')}

<h3>dBFS nói "có vỡ không." LUFS nói "nghe to cỡ nào."</h3>
<p>dBFS (decibel so với Full Scale, từ Bài 9.1) là một phép đo <strong>tức thời</strong> — nó nhảy theo từng mẫu âm, vọt lên ở một từ nói to rồi rơi xuống ngay khoảng lặng sau đó. <strong>LUFS</strong> (Loudness Units Full Scale) tích hợp mức âm theo thời gian bằng một mô hình gần với tai người hơn, nên nó tương đối ổn định dù sóng âm thô bên dưới vẫn đang nhảy loạn xạ. Một video có thể có đỉnh sạch đúng −8dBFS mà vẫn đo được quá nhỏ hoặc quá to theo LUFS, vì LUFS đang trả lời một câu hỏi khác: không phải "khoảnh khắc nào đó có vỡ không" mà là "người xem cảm thấy cả video này to cỡ nào."</p>
${slide('cr-16', 4, 'dBFS tức thời vs LUFS cảm nhận (minh hoạ)')}

<h3>Mục tiêu: khoảng −14 LUFS — và con số đó thật ra từ đâu ra</h3>
<div class="callout warn"><p><strong>Đã kiểm trực tiếp, không mặc định đúng:</strong> Trang trợ giúp chính thức của YouTube KHÔNG công bố một con số LUFS cụ thể cho việc chuẩn hoá độ lớn video (đã kiểm support.google.com, tính đến 09/2026 không trang nào ghi rõ số này — thread cộng đồng của YouTube Music về mục tiêu kiểu −7 LKFS cho bài hát là một hệ thống KHÁC). Con số <strong>−14 LUFS</strong> lưu hành khắp nơi vì nó là mặc định trong nhiều công cụ mix và khớp với đo đạc độc lập của cộng đồng, không phải vì YouTube ghi thành văn bản. Coi nó là một điểm tham chiếu được ủng hộ rộng rãi, không phải một cam kết chính thức.</p></div>
<p>Điều thật sự quan trọng trong thực hành: các nền tảng chuẩn hoá độ lớn lúc phát chỉ bao giờ HẠ âm lượng của bạn xuống nếu nó to hơn mục tiêu của họ — họ không tự tăng âm lượng cho bạn nếu bạn ghi quá nhỏ. Mix về khoảng −14 LUFS tích hợp giữ video của bạn gần đúng mức bạn định ở khắp mọi nơi, thay vì bị hạ xuống sau đó hoặc nằm ở một mức to/nhỏ tuỳ tiện so với video khác trong cùng một feed.</p>

<h3>Đo & chuẩn hoá thật bằng ffmpeg — hai lượt</h3>
${slide('cr-16', 5, 'Đo & chuẩn hoá thật bằng ffmpeg — 2 lượt')}
<p>Mọi con số ở đây đến từ việc THẬT SỰ chạy các lệnh này trên một file thử thật, không phải từ bảng thông số. Trước tiên, đo một clip thử cố tình mix ẩu (quá nhỏ) bằng &#96;ebur128&#96; (đúng bộ lọc Bài 9.3 đã giới thiệu):</p>
<pre><code class="language-bash">ffmpeg -i truoc-chuan-hoa.wav -af ebur128=peak=true -f null -</code></pre>
<div class="out">Integrated loudness:
  I:         -42.0 LUFS
Loudness range:
  LRA:         0.0 LU
True peak:
  Peak:      -41.1 dBFS</div>
<p>Quá nhỏ. Giờ chạy &#96;loudnorm&#96; ở chế độ <strong>hai lượt</strong> được khuyến nghị. Lượt một CHỈ đo — không đổi gì cả:</p>
<pre><code class="language-bash">ffmpeg -i in.wav -af loudnorm=I=-14:TP=-1:LRA=11:print_format=json -f null -</code></pre>
<div class="out">{
  "input_i" : "-42.05", "input_tp" : "-41.05", "input_lra" : "0.00",
  "input_thresh" : "-52.05", "target_offset" : "-0.05"
}</div>
<p>Lượt hai đưa đúng những số &#96;measured_*&#96; đó trở lại kèm &#96;linear=true&#96; (một phép đổi gain TUYẾN TÍNH, giữ nguyên dải động bạn vừa mất công tạo ở Bài 14.4 — tránh chế độ một-lượt phi tuyến tính cho bất cứ thứ gì có dải động thật) và thật sự ghi ra file:</p>
<pre><code class="language-bash">ffmpeg -i in.wav -af loudnorm=I=-14:TP=-1:LRA=11:measured_I=-42.05:\\
  measured_TP=-41.05:measured_LRA=0.00:measured_thresh=-52.05:\\
  offset=-0.05:linear=true out.wav</code></pre>
<p>Rồi — đừng chỉ tin vào bản in kết quả của chính loudnorm — đo lại KẾT QUẢ một cách độc lập bằng đúng lệnh &#96;ebur128&#96; ở trên:</p>
<div class="out">Integrated loudness:
  I:         -14.0 LUFS
True peak:
  Peak:      -13.1 dBFS</div>
<p>−14,0 LUFS, đúng mục tiêu, được xác nhận bởi một công cụ THỨ HAI độc lập, thay vì tin lời chính loudnorm tự báo cáo về việc nó vừa làm.</p>

<h3>True peak: cái trần cứng mà riêng LUFS không bảo vệ bạn khỏi</h3>
${slide('cr-16', 6, 'True peak — trần −1 dBTP (EBU R128)')}
<p>Để ý true peak ở trên rơi vào −13,1dBTP, còn cách rất xa trần — vì tông thử gần như không có chênh lệch giữa mức trung bình và đỉnh tức thời (một <strong>crest factor</strong> thấp). Giọng nói và nhạc thật có đỉnh sắc và đột ngột hơn nhiều so với mức trung bình, nên đạt đúng −14 LUFS trên nội dung thật đẩy đỉnh gần trần hơn nhiều so với ví dụ sạch sẽ này. Bản thân cái trần không phải đoán mò: chuẩn <strong>EBU R128</strong> đặt true peak tối đa cho phép trong sản xuất ở <strong>−1 dBTP</strong> (bắt cả đỉnh liên-mẫu (inter-sample) mà một phép đọc dBFS đơn giản có thể bỏ sót).</p>
<p><strong>True peak</strong> và LUFS giải quyết hai vấn đề khác nhau và cả hai đều quan trọng: LUFS nói về cả video nghe to cỡ nào; true peak là một trần cứng mà nếu vượt qua, gây ra đúng kiểu méo tiếng số gắt mà Bài 9.1 gọi là vỡ tiếng — chỉ khác là giờ nó có thể xảy ra ÂM THẦM, do chính nền tảng mã hoá lại sau khi tải lên, kể cả khi file gốc của bạn chưa từng chạm 0dBFS về mặt kỹ thuật. Chừa khoảng lùi thật dưới −1dBTP (nhiều người mix nhắm −2 hoặc −3dBTP chính vì lý do này) thay vì mix sát ngay lằn ranh.</p>

<h3>Chuỗi xử lý giọng</h3>
${slide('cr-16', 7, 'Chuỗi xử lý giọng')}
<p>Một bản ghi sạch (Chương 9) thường vẫn hưởng lợi từ một chuỗi xử lý chuẩn trước khi đủ to và đủ mượt để nằm dưới một đoạn tiêu đề hay chồng lên B-roll:</p>
<ul>
<li><strong>Khử ồn:</strong> công cụ AI một-chạm <strong>Voice Isolation</strong> của DaVinci Resolve, hoặc <strong>Reduce noise</strong> của CapCut — cả hai đã nói ở Bài 12.3, và cả hai đều nằm sau một gói trả phí (Resolve Studio; CapCut Pro).</li>
<li><strong>EQ:</strong> cắt cao-thông (high-pass) quanh <strong>80–100Hz</strong> gỡ tiếng ù cầm máy, tiếng ù phòng, và gió — không có nội dung giọng nói thật nào nằm ở dải tần đó.</li>
<li><strong>Compressor:</strong> đều lại khoảng cách giữa từ nói nhỏ nhất và to nhất, để người xem khỏi phải liên tục chỉnh âm lượng.</li>
<li><strong>De-esser:</strong> hãm tiếng rít "s/x" gắt mà một compressor đơn thuần thường làm NẶNG hơn, không nhẹ đi (nén kéo các khoảnh khắc nhỏ lên to hơn, kể cả tiếng rít nhỏ-nhưng-gắt).</li>
<li><strong>Limiter:</strong> lưới an toàn cuối cùng — một trần cứng chặn lại bất cứ thứ gì vẫn còn vọt về phía 0dBFS / mục tiêu true peak sau tất cả các bước trên.</li>
<li><strong>Nhạc nền bên dưới:</strong> ducking dưới giọng nói — cơ chế đã dạy ở Bài 12.3 và 14.4, không nhắc lại ở đây.</li>
</ul>

<h3>Fairlight: cái gì miễn phí, cái gì cần Studio</h3>
${slide('cr-16', 8, 'Fairlight: miễn phí hay Studio?')}
<p>Bài 13.1 đã giới thiệu <strong>Fairlight</strong> là trang âm thanh riêng của Resolve. Ranh giới quan trọng cho chuỗi xử lý này: công cụ TAY truyền thống — EQ 6-band, compressor, gate/expander, de-esser, limiter — có đầy đủ trong bản <strong>miễn phí</strong>, trọn bộ dynamics trên channel strip. Thứ cần <strong>Studio</strong> là lớp <strong>AI</strong> một-chạm: Voice Isolation và khử ồn có AI hỗ trợ (khớp bảng miễn phí/Studio Chương 13 đã dựng), cộng tạo phụ đề tự động (Bài 16.3). Bạn dựng được TRỌN VẸN chuỗi 5 bước này bằng tay trên Resolve miễn phí — Studio chỉ mua một đường tắt AI nhanh hơn cho bản ghi ồn nhất.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — mix bằng tai trên loa laptop, rồi nghe sai hẳn trên điện thoại:</strong> loa laptop thường dễ dãi hơn nhiều với một bản mix mỏng, thiếu trầm so với loa điện thoại (nơi phần lớn khán giả của bạn thật sự xem). Sau khi ducking và nén xong, nghe lại trên chính loa điện thoại, không chỉ tai nghe — một bản mix nghe đầy đặn trên loa kiểm âm có thể biến mất hoàn toàn trên một loa điện thoại bé xíu nếu dải trầm chưa từng được xử lý.</p></div>

<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 16.2 chuyển từ thứ người xem NGHE sang thứ họ ĐỌC — chữ và đồ hoạ vẫn đọc được trên mọi loại cảnh quay, bằng một font thật sự hiển thị đủ mọi dấu tiếng Việt.</p>

<h3>🎬 Thực hành (25–30 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy &#96;ffmpeg -af ebur128=peak=true -f null -&#96; trên bất kỳ clip đã xuất nào bạn có, đọc dòng Integrated LUFS và True Peak thật.</li>
<li>Chạy chuỗi &#96;loudnorm&#96; hai lượt ở trên trên đúng clip đó, nhắm I=-14, TP=-1, LRA=11.</li>
<li>Đo lại kết quả một cách độc lập bằng &#96;ebur128&#96; lần nữa — xác nhận nó thật sự rơi gần −14 LUFS, đừng chỉ tin bản in của chính loudnorm.</li>
<li>Nếu có DaVinci Resolve, mở Fairlight và thêm EQ + Compressor + Limiter từ danh sách hiệu ứng miễn phí vào channel strip của một clip.</li>
</ol><p><strong>Đạt khi:</strong> bạn đọc được một số LUFS thật từ ffmpeg và nói được nó cần tăng, giảm, hay đã gần −14, mà không cần mở lại bài này.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">LUFS</span><span class="v">Loudness Units Full Scale — độ lớn CẢM NHẬN, tích hợp theo thời gian, khác dBFS tức thời.</span></div>
<div class="kv"><span class="k">True peak / dBTP</span><span class="v">Đỉnh thật, kể cả đỉnh liên-mẫu (inter-sample) — trần sản xuất khuyến nghị −1 dBTP (EBU R128).</span></div>
<div class="kv"><span class="k">loudnorm hai lượt</span><span class="v">Bộ lọc ffmpeg: lượt 1 chỉ ĐO, lượt 2 ÁP dụng đúng số đo được, &#96;linear=true&#96; giữ dải động.</span></div>
<div class="kv"><span class="k">Crest factor</span><span class="v">Chênh lệch giữa đỉnh tức thời và mức trung bình — giọng nói/nhạc thật cao hơn nhiều so với tông thử đơn giản.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>dBFS trả lời "khoảnh khắc này có vỡ không"; LUFS trả lời "cả video nghe to cỡ nào" — mix theo cả hai, chúng KHÔNG thay thế nhau được.</li>
<li>−14 LUFS tích hợp là mục tiêu được dùng rộng rãi, nhưng đó là đồng thuận cộng đồng/ngành, không phải con số trang trợ giúp YouTube công bố.</li>
<li>True peak ≤ −1dBTP là trần sản xuất chính thức của EBU R128 — chừa khoảng lùi thật dưới nó, đừng mix sát lằn ranh.</li>
<li>Chuỗi xử lý giọng — khử ồn → EQ (cắt 80–100Hz) → compressor → de-esser → limiter — dựng được trọn vẹn trên Resolve miễn phí; Studio chỉ tăng tốc bước khử ồn AI.</li>
<li>Luôn xác nhận kết quả loudnorm bằng một lượt &#96;ebur128&#96; độc lập, không chỉ tin bản tóm tắt của chính công cụ đó.</li>
</ul>

<div class="link-card"><a href="https://tech.ebu.ch/docs/r/r128.pdf" target="_blank" rel="noopener">EBU R128 — khuyến nghị độ lớn chính thức (true peak ≤ −1 dBTP)</a></div>
</div>
`,
    },

    /* ─────────────────── 16.2 Chữ & đồ hoạ ─────────────────── */
    {
      title: '16.2 — Text and graphics on screen|||16.2 — Chữ và đồ hoạ trên hình',
      slug: 'cr-16-2-chu-do-hoa',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Chữ đọc được trên mọi cảnh quay, lower third, callout cho video code, bộ nhận diện nhất quán, chuyển động ease in-out, và ba font tiếng Việt đủ dấu đã kiểm trên Google Fonts.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.2</span>
<h2>Text on screen has one job: get read, on a small, moving screen, in under two seconds</h2>
<p class="lead">Most viewers watch with sound off first — Lesson 12.3 already told you that when it introduced captions. The same rule applies to every other piece of text you put on screen: a lower third with your name, a callout pointing at a line of code, a chapter label. If it takes longer than a glance to read, or disappears under a platform's own UI, it does not exist for that viewer. This lesson is about designing text and graphics that survive contact with a real phone screen.</p>

<h3>Readable text: four non-negotiables</h3>
${slide('cr-16', 9, 'Chữ & đồ hoạ cho video')}
<p>Four things decide whether text on a video gets read at all: <strong>no serifs</strong> (the small decorative feet on letters in fonts like Times New Roman blur away at small sizes and low bitrates — sans-serif fonts stay crisp), <strong>large enough</strong> to read at arm's length on a phone (test it the same way Lesson 12.3 told you to test captions — hold your phone away from your face, not your Mac display up close), <strong>contrast</strong> against whatever footage sits behind it (a stroke or a semi-transparent background box protects legibility over busy or bright footage the same text color would vanish into), and staying inside the <strong>safe zone</strong> — the same platform-UI-free area Lesson 12.3 defined for captions applies to every other on-screen text element too.</p>

<h3>Lower thirds: earn the name, then get out of the way</h3>
<p>A <strong>lower third</strong> is the name/title graphic sitting in the lower area of frame — introducing you, a guest, or a location. Three habits separate a professional one from an amateur one: it appears once per person (not every time they reappear after a cut), it animates in and out with <strong>ease in/out</strong> motion (starts slow, speeds up, slows down again — a linear, constant-speed slide reads as robotic and cheap by comparison), and it clears itself after a few seconds instead of sitting on screen for the whole scene, competing with whatever else is happening in frame.</p>

<h3>Callouts for programming/tutorial footage</h3>
<p>For your programming lessons specifically (Chapter 22 covers screen recording in full — this is about the graphics layer on top of it): a <strong>callout</strong> is anything that directs the viewer's eye to one specific place — an arrow pointing at a function name, a rectangle circling a line of code, a punch-in/zoom on the exact area you are talking about. The point is not decoration, it is the same "pattern interrupt" and attention-directing logic Lesson 14.3 taught for editing rhythm, applied to a single frame: without a callout, a viewer scans the whole screen guessing what you mean by "this line here."</p>

<h3>A consistent identity, not a new look every video</h3>
<p>Your <strong>identity</strong> (bộ nhận diện) is the repeated visual decisions — one font family, one small color palette — that show up in every video's lower thirds, callouts, and titles. This is a recognition shortcut: a viewer scrolling a feed should be able to tell it is your channel within about a second, from the graphics alone, before they even process what the video is about. Changing font or color scheme every video throws that shortcut away.</p>

<h3>Three Vietnamese-ready fonts, checked on Google Fonts</h3>
${slide('cr-16', 10, 'Ba font tiếng Việt đủ dấu')}
<p>A font that looks fine in English can silently drop or misrender Vietnamese diacritics — checked directly on fonts.google.com (22/09/2026), these three carry the "Vietnamese" language subset: <strong>Be Vietnam Pro</strong> (designed specifically with Vietnamese letterforms in mind, 18 weights — a strong pick for titles and lower thirds), <strong>Inter</strong> (a neutral workhorse with a huge weight range — solid for longer on-screen text and captions), and <strong>Roboto</strong> (Android/Material's default — familiar for short UI-style callouts). Any of the three is a safe choice; picking ONE and reusing it everywhere is what actually builds the identity above.</p>

<div class="callout warn"><p><strong>Check before you commit to a font you found elsewhere:</strong> not every free font supports Vietnamese, even popular ones. Before locking a title font into your template, type a sentence with the trickiest Vietnamese diacritic stacks you actually use ("nghiêng", "khuỷu", "ngoằn") and look for missing marks, wrong stacking height, or a fallback font silently substituting in — catching this once, in your template, beats catching it on video 40.</p></div>

<div class="pitfall co-tieu-de"><p><strong>Trap — building every callout as a fresh one-off:</strong> without a reusable title/callout template (in CapCut or Resolve), every new video means re-guessing font size, color, and animation timing from scratch, and small inconsistencies creep in that undermine the identity you are trying to build. Build the lower third and callout ONCE as a template or saved preset, then reuse it — this is exactly the same "build the chain once, reuse it" logic Lesson 16.1 applied to audio processing.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 16.3 is the one piece of on-screen text every video needs by default — subtitles — and the exact file format platforms expect them in.</p>

<h3>🎬 Practice (15–20 minutes)</h3>
<div class="callout ok"><ol>
<li>Pick one of the three checked fonts and build a lower third template with it — your name, a role/title, ease in/out animation.</li>
<li>Type a Vietnamese sentence with dense diacritic stacks into that template and confirm every mark renders correctly.</li>
<li>On a screen-recording clip, add one callout (arrow or highlight box) pointing at a specific line — time it to appear exactly when you start talking about that line, not before or after.</li>
</ol><p><strong>Done when:</strong> your lower third and callout both sit inside the safe zone on a 9:16 preview, and you could describe your "identity" (font + palette) in one sentence.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Lower third</span><span class="v">Đồ hoạ tên/chức danh ở phần dưới khung hình.</span></div>
<div class="kv"><span class="k">Callout</span><span class="v">Bất kỳ yếu tố nào dẫn mắt người xem tới một chỗ cụ thể — mũi tên, khoanh vùng, zoom.</span></div>
<div class="kv"><span class="k">Ease in/out</span><span class="v">Chuyển động bắt đầu chậm, tăng tốc, rồi chậm lại — trái ngược chuyển động đều (linear) trông máy móc.</span></div>
<div class="kv"><span class="k">Bộ nhận diện</span><span class="v">Font + bảng màu lặp lại nhất quán mỗi video, giúp khán giả nhận ra kênh trong một giây.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Text on screen must be sans-serif, large enough for a phone at arm's length, high-contrast, and inside the safe zone — miss any one and it stops being read.</li>
<li>Lower thirds appear once per person, animate with ease in/out, and clear themselves — they do not sit on screen the whole scene.</li>
<li>Callouts direct the eye to one exact spot, timed to when you start talking about it — same attention logic as editing rhythm from Chapter 14.</li>
<li>Be Vietnam Pro, Inter, and Roboto all carry the Vietnamese subset (checked on fonts.google.com) — pick one and reuse it everywhere to build a recognizable identity.</li>
<li>Build lower thirds/callouts as a reusable template once, not from scratch every video.</li>
</ul>

<div class="link-card"><a href="https://fonts.google.com/specimen/Be+Vietnam+Pro" target="_blank" rel="noopener">Be Vietnam Pro — Google Fonts (thiết kế riêng cho chữ Việt)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.2</span>
<h2>Chữ trên hình chỉ có một việc: được đọc, trên một màn hình nhỏ, đang di chuyển, trong chưa tới hai giây</h2>
<p class="lead">Phần lớn người xem xem tắt tiếng trước — Bài 12.3 đã nói điều đó khi giới thiệu phụ đề. Luật tương tự áp dụng cho mọi mẩu chữ khác bạn đặt lên hình: một lower third ghi tên bạn, một callout chỉ vào một dòng code, một nhãn chương. Nếu đọc lâu hơn một cái liếc mắt, hoặc bị UI của nền tảng che mất, nó coi như không tồn tại với người xem đó. Bài này nói về thiết kế chữ và đồ hoạ sống sót được khi chạm vào một màn hình điện thoại thật.</p>

<h3>Chữ đọc được: bốn điều không thể thiếu</h3>
${slide('cr-16', 9, 'Chữ & đồ hoạ cho video')}
<p>Bốn thứ quyết định chữ trên video có được đọc hay không: <strong>không chân</strong> (những cái "chân" trang trí nhỏ trên chữ ở font kiểu Times New Roman bị nhoè ở cỡ nhỏ và bitrate thấp — font không chân giữ được nét sắc), <strong>đủ lớn</strong> để đọc ở khoảng cách cầm điện thoại xa tay (thử đúng cách Bài 12.3 đã dặn cho phụ đề — cầm điện thoại xa mặt ra, không phải nhìn sát màn hình Mac), <strong>tương phản</strong> với bất cứ cảnh quay nào phía sau (một viền chữ hoặc một khối nền bán trong suốt bảo vệ độ đọc được trên nền quay bận rộn hoặc sáng mà cùng màu chữ đó sẽ biến mất vào), và nằm trong <strong>vùng an toàn</strong> — đúng vùng không bị UI nền tảng che mà Bài 12.3 đã định nghĩa cho phụ đề cũng áp dụng cho mọi thành phần chữ khác trên hình.</p>

<h3>Lower third: giành được cái tên, rồi biến mất đúng lúc</h3>
<p>Một <strong>lower third</strong> là đồ hoạ tên/chức danh nằm ở phần dưới khung hình — giới thiệu bạn, một khách mời, hay một địa điểm. Ba thói quen tách một cái chuyên nghiệp khỏi một cái nghiệp dư: nó xuất hiện MỘT lần cho mỗi người (không phải mỗi lần họ xuất hiện lại sau một lần cắt), nó chuyển động vào/ra bằng <strong>ease in/out</strong> (bắt đầu chậm, tăng tốc, rồi chậm lại — một cú trượt đều tốc độ (linear) đọc lên máy móc và rẻ tiền hơn hẳn), và nó tự dọn đi sau vài giây thay vì nằm lì trên hình suốt cả cảnh, tranh chỗ với mọi thứ khác đang diễn ra trong khung hình.</p>

<h3>Callout cho cảnh quay lập trình/hướng dẫn</h3>
<p>Riêng cho các bài giảng lập trình của bạn (Chương 22 nói đầy đủ về quay màn hình — đây là lớp đồ hoạ chồng lên trên đó): một <strong>callout</strong> là bất cứ thứ gì dẫn mắt người xem tới đúng một chỗ cụ thể — mũi tên chỉ vào tên một hàm, một hình chữ nhật khoanh một dòng code, một cú punch-in/zoom vào đúng vùng bạn đang nói tới. Mục đích không phải trang trí, mà chính là logic "ngắt mẫu" và dẫn sự chú ý mà Bài 14.3 đã dạy cho nhịp dựng, áp dụng cho MỘT khung hình: không có callout, người xem quét cả màn hình đoán xem bạn đang nói "dòng này đây" là dòng nào.</p>

<h3>Một bộ nhận diện nhất quán, không phải một diện mạo mới mỗi video</h3>
<p><strong>Bộ nhận diện</strong> của bạn là những quyết định thị giác lặp lại — một họ font, một bảng màu nhỏ — xuất hiện trong lower third, callout, và tiêu đề của MỌI video. Đây là một đường tắt nhận diện: một người đang lướt feed phải nhận ra đây là kênh của bạn trong khoảng một giây, chỉ từ phần đồ hoạ, trước cả khi họ kịp hiểu video đang nói về gì. Đổi font hay bảng màu mỗi video là vứt bỏ đường tắt đó.</p>

<h3>Ba font sẵn sàng cho tiếng Việt, đã kiểm trên Google Fonts</h3>
${slide('cr-16', 10, 'Ba font tiếng Việt đủ dấu')}
<p>Một font nhìn ổn với tiếng Anh vẫn có thể âm thầm mất hoặc hiển thị sai dấu tiếng Việt — đã kiểm trực tiếp trên fonts.google.com (22/09/2026), ba font này mang subset ngôn ngữ "Vietnamese": <strong>Be Vietnam Pro</strong> (thiết kế RIÊNG với chữ cái tiếng Việt trong đầu, 18 độ đậm — lựa chọn mạnh cho tiêu đề và lower third), <strong>Inter</strong> (một "thợ cày" trung tính với dải độ đậm khổng lồ — hợp cho chữ trên hình dài hơn và phụ đề), và <strong>Roboto</strong> (mặc định của Android/Material — quen mắt cho callout ngắn kiểu giao diện). Cả ba đều là lựa chọn an toàn; chọn MỘT và dùng lại khắp nơi mới chính là thứ xây nên bộ nhận diện ở trên.</p>

<div class="callout warn"><p><strong>Kiểm trước khi chốt một font bạn tìm được ở nơi khác:</strong> không phải font miễn phí nào cũng hỗ trợ tiếng Việt, kể cả những font phổ biến. Trước khi khoá một font tiêu đề vào template, gõ thử một câu có những chồng dấu tiếng Việt hóc búa nhất bạn thật sự dùng ("nghiêng", "khuỷu", "ngoằn") và tìm dấu bị mất, chồng dấu sai độ cao, hay một font dự phòng âm thầm thế chỗ — bắt lỗi này một lần, ngay trong template, tốt hơn bắt được nó ở video thứ 40.</p></div>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — dựng mỗi callout mới hoàn toàn từ đầu:</strong> không có một template lower third/callout dùng lại được (trong CapCut hoặc Resolve), mỗi video mới nghĩa là đoán lại cỡ chữ, màu, và thời gian chuyển động từ số 0, và những bất nhất nhỏ len vào phá hỏng bộ nhận diện bạn đang cố xây. Dựng lower third và callout MỘT LẦN thành template hoặc preset đã lưu, rồi dùng lại — đúng logic "dựng chuỗi một lần, dùng lại" mà Bài 16.1 đã áp dụng cho xử lý âm thanh.</p></div>

<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 16.3 là mẩu chữ trên hình mà MỌI video cần theo mặc định — phụ đề — và đúng định dạng file mà các nền tảng mong đợi.</p>

<h3>🎬 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Chọn một trong ba font đã kiểm và dựng một template lower third với nó — tên bạn, vai trò/chức danh, chuyển động ease in/out.</li>
<li>Gõ một câu tiếng Việt có chồng dấu dày vào template đó và xác nhận mọi dấu hiển thị đúng.</li>
<li>Trên một clip quay màn hình, thêm một callout (mũi tên hoặc khung nổi bật) chỉ vào một dòng cụ thể — canh thời điểm xuất hiện đúng lúc bạn bắt đầu nói về dòng đó, không sớm không muộn.</li>
</ol><p><strong>Đạt khi:</strong> cả lower third và callout của bạn đều nằm trong vùng an toàn trên khung xem trước 9:16, và bạn mô tả được "bộ nhận diện" của mình (font + bảng màu) trong một câu.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Lower third</span><span class="v">Đồ hoạ tên/chức danh ở phần dưới khung hình.</span></div>
<div class="kv"><span class="k">Callout</span><span class="v">Bất kỳ yếu tố nào dẫn mắt người xem tới một chỗ cụ thể — mũi tên, khoanh vùng, zoom.</span></div>
<div class="kv"><span class="k">Ease in/out</span><span class="v">Chuyển động bắt đầu chậm, tăng tốc, rồi chậm lại — trái ngược chuyển động đều (linear) trông máy móc.</span></div>
<div class="kv"><span class="k">Bộ nhận diện</span><span class="v">Font + bảng màu lặp lại nhất quán mỗi video, giúp khán giả nhận ra kênh trong một giây.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chữ trên hình phải không chân, đủ lớn cho điện thoại ở khoảng tay, tương phản cao, và nằm trong vùng an toàn — thiếu một trong bốn là hết được đọc.</li>
<li>Lower third xuất hiện một lần mỗi người, chuyển động bằng ease in/out, và tự dọn đi — không nằm lì suốt cả cảnh.</li>
<li>Callout dẫn mắt tới đúng một chỗ, canh đúng lúc bạn bắt đầu nói tới nó — cùng logic sự chú ý như nhịp dựng ở Chương 14.</li>
<li>Be Vietnam Pro, Inter, và Roboto đều mang subset tiếng Việt (đã kiểm trên fonts.google.com) — chọn một và dùng lại khắp nơi để xây bộ nhận diện dễ nhận ra.</li>
<li>Dựng lower third/callout thành template dùng lại được một lần, không phải làm lại từ đầu mỗi video.</li>
</ul>

<div class="link-card"><a href="https://fonts.google.com/specimen/Be+Vietnam+Pro" target="_blank" rel="noopener">Be Vietnam Pro — Google Fonts (thiết kế riêng cho chữ Việt)</a></div>
</div>
`,
    },

    /* ─────────────────── 16.3 Phụ đề ─────────────────── */
    {
      title: '16.3 — Subtitles: SRT, hard vs soft, safe zones|||16.3 — Phụ đề: SRT, cứng/mềm, vùng an toàn',
      slug: 'cr-16-3-phu-de',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Định dạng SRT thật, phụ đề cứng (burn-in) khác phụ đề mềm thế nào, tải phụ đề lên YouTube đúng quy trình, phụ đề tự động của YouTube/CapCut/Resolve, và đặt phụ đề trong vùng an toàn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.3</span>
<h2>Most viewers watch with the sound off. Without subtitles, you lose them in the first three seconds.</h2>
<p class="lead">Lesson 12.3 already had you run CapCut's Auto captions on a short-form edit. This lesson goes one level deeper: the actual file format underneath every subtitle track, the real difference between "burning" text into the picture versus keeping it as a separate switchable track, how to upload your own file to YouTube correctly, and where each of your tools' automatic-caption features actually lives — including which one costs a paid tier and which does not.</p>

<h3>SRT: a plain text file, four parts, nothing more</h3>
${slide('cr-16', 12, 'Cấu trúc file SRT thật')}
<p><strong>SRT</strong> (SubRip Text) is the subtitle format almost every platform accepts. It is just a plain text file — no special software required to write or read one — built from repeating blocks with exactly four parts: a sequence number, a start/end timestamp (&#96;hours:minutes:seconds,milliseconds&#96;), the text (up to two lines), and a blank line separating each block from the next. Here is a real, valid three-cue file, written by hand:</p>
<pre><code class="language-plaintext">1
00:00:00,000 --> 00:00:02,500
Chao mung ban quay lai kenh.

2
00:00:02,500 --> 00:00:05,200
Hom nay minh se noi ve hau ky am thanh.

3
00:00:05,200 --> 00:00:08,000
Welcome back to the channel.</code></pre>
<p>YouTube's own list of supported caption/subtitle file types confirms &#96;.srt&#96; directly — alongside &#96;.sbv&#96;, &#96;.vtt&#96;, and several broadcast formats — so a hand-written or Whisper-generated &#96;.srt&#96; needs no conversion before upload.</p>

<h3>Hard (burn-in) vs soft (closed caption) — a real tradeoff, not a "better" option</h3>
${slide('cr-16', 11, 'Phụ đề cứng (burn-in) và phụ đề mềm')}
<p><strong>Hard subtitles (burn-in)</strong> are rendered permanently into the video's pixels — a viewer cannot turn them off, and fixing a typo means re-exporting the whole video. <strong>Soft subtitles</strong> stay a separate track (or separate &#96;.srt&#96; file) the player switches on and off, editable without touching the video file at all, and — critically for Chapter 23's bilingual plan — a single video can carry multiple language tracks at once instead of needing a separate export per language. For anywhere that supports a real subtitle track, default to soft; YouTube is exactly that place.</p>

<h3>Uploading your own .srt to YouTube — the real steps</h3>
<p>Confirmed directly against YouTube Help: in <strong>YouTube Studio → Subtitles</strong>, select the video, click <strong>ADD LANGUAGE</strong> and pick the language, then under "Subtitles" click <strong>ADD → Upload file</strong>, choose <strong>With timing</strong> (for a timed &#96;.srt&#96;) or <strong>Without timing</strong> (for a plain transcript YouTube times itself), pick your file, and <strong>Save</strong>. Repeat "ADD LANGUAGE" for a second language — this is how a single upload ends up carrying both a Vietnamese and an English subtitle track (Chapter 23 builds the full bilingual workflow on top of this).</p>

<h3>Style for a phone screen and a safe zone, not a cinema screen</h3>
${slide('cr-16', 13, 'Phụ đề trong vùng an toàn — đặt đúng/sai')}
<p>Lesson 12.3 already defined the <strong>safe zone</strong> for short-form: platform UI (like/comment buttons, the caption line, username) covers roughly the bottom ~20% and a strip on the right of a 9:16 frame. A caption positioned "correctly" in your editor's own preview can still land directly under a real phone's UI once published — always check against the actual safe zone, not just how it looks in the editing window. General captioning convention beyond any one platform's rule: short lines (two maximum), a stroke or background box for contrast against any footage, and a size legible at arm's length.</p>

<h3>Automatic subtitles: three tools, three different deals</h3>
<p><strong>CapCut's Auto captions</strong> (Lesson 12.3) already covers your short-form workflow — including a Bilingual captions option — with a monthly free-use quota shown live in-app, removed on CapCut Pro. <strong>YouTube's own automatic captions</strong> use speech recognition in the language of your original audio, across 80+ languages (support.google.com/youtube/answer/6373554) — free, but generated only after upload, and, like every auto-transcription tool in this course, it needs a proofread pass (mispronunciations, accents, and background noise all cause misreads). <strong>DaVinci Resolve's Create Subtitles from Audio</strong> is a <strong>Studio-only</strong> feature — consistent with the free-vs-Studio split Lesson 16.1 just walked through for Voice Isolation, the free version of Resolve does not generate subtitles from audio automatically; it can still import, style, and burn in a subtitle file someone/something else generated (including a Whisper &#96;.srt&#96; from Lesson 16.4).</p>

<div class="callout warn"><p><strong>Checked, not assumed, on this machine:</strong> ffmpeg's own &#96;subtitles=&#96; video filter is the standard tool-agnostic way to burn an &#96;.srt&#96; into a video from the command line — but it depends on the library <strong>libass</strong> being compiled into your ffmpeg build. Running &#96;ffmpeg -vf "subtitles=file.srt"&#96; on the machine used to write this course failed outright (this Homebrew ffmpeg build was not compiled with libass support) — a real, honest result, not a hypothetical warning. In practice this does not matter for your workflow: CapCut and DaVinci Resolve (Lesson 12.3, Chapter 13) both burn in or style subtitles through their own GUI without needing ffmpeg at all. If you want the raw ffmpeg command line route on your own machine later, confirm your build supports it first (&#96;ffmpeg -filters | grep subtitles&#96;) rather than assuming it does.</p></div>

<div class="pitfall co-tieu-de"><p><strong>Trap — burning in subtitles as the very last export step, after picture lock:</strong> the moment subtitles are burned into pixels, every later fix (a typo, a re-timed cut, a translation) means a full re-export. Keep subtitles soft for as long as possible in your pipeline, and only burn in — if you ever need to — as the final step for a platform that specifically requires it.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 16.4 is where you stop writing &#96;.srt&#96; files by hand — your Linux GPU box turns raw audio into a timed subtitle file automatically, in Vietnamese or English.</p>

<h3>🎬 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
<li>Write a real &#96;.srt&#96; file by hand for a 15–20 second clip, matching the exact four-part structure above.</li>
<li>Upload it to a test video in YouTube Studio → Subtitles → Add language → Upload file → With timing.</li>
<li>Preview your most recent short-form edit's captions against the 9:16 safe zone — confirm nothing sits under the bottom ~20% or right-edge UI strip.</li>
</ol><p><strong>Done when:</strong> your hand-written &#96;.srt&#96; displays correctly after upload, and you can state which of your three tools' "auto captions" costs a paid tier and which does not.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">SRT</span><span class="v">SubRip Text — file phụ đề dạng chữ thuần, 4 phần: số cue, mốc thời gian, văn bản, dòng trống.</span></div>
<div class="kv"><span class="k">Phụ đề cứng (burn-in)</span><span class="v">In vĩnh viễn vào pixel video — không tắt được, sửa phải render lại cả video.</span></div>
<div class="kv"><span class="k">Phụ đề mềm</span><span class="v">Track/file riêng, bật/tắt được, sửa không đụng tới video, chứa được nhiều ngôn ngữ.</span></div>
<div class="kv"><span class="k">Vùng an toàn</span><span class="v">Phần khung hình 9:16 KHÔNG bị UI nền tảng che — đã định nghĩa ở Bài 12.3.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>SRT is plain text, four parts per cue — YouTube officially supports &#96;.srt&#96; directly, no conversion needed.</li>
<li>Soft subtitles (a switchable track) beat hard burn-in almost everywhere a platform supports them — YouTube does.</li>
<li>Upload your own file: YouTube Studio → Subtitles → Add language → Upload file → With/Without timing → Save.</li>
<li>Three auto-caption tools, three different deals: CapCut (free with monthly quota), YouTube (free, post-upload), DaVinci Resolve (Studio-only) — all still need a proofread pass.</li>
<li>ffmpeg's &#96;subtitles=&#96; filter needs libass compiled in — confirmed absent on this machine; use CapCut/Resolve's own GUI burn-in instead, which is what you already learned.</li>
</ul>

<div class="link-card"><a href="https://support.google.com/youtube/answer/2734796" target="_blank" rel="noopener">YouTube Help — Add your own subtitles and closed captions</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.3</span>
<h2>Phần lớn người xem tắt tiếng. Không có phụ đề, bạn mất họ trong ba giây đầu.</h2>
<p class="lead">Bài 12.3 đã cho bạn chạy Auto captions của CapCut trên một bản dựng video ngắn. Bài này đi sâu thêm một tầng: định dạng file thật sự nằm dưới mọi track phụ đề, khác biệt thật giữa "in" chữ vào hình và giữ nó như một track riêng bật/tắt được, cách tải đúng file của bạn lên YouTube, và tính năng phụ đề tự động của từng công cụ bạn có thật sự nằm ở đâu — kể cả cái nào tốn gói trả phí, cái nào không.</p>

<h3>SRT: một file chữ thuần, bốn phần, không hơn</h3>
${slide('cr-16', 12, 'Cấu trúc file SRT thật')}
<p><strong>SRT</strong> (SubRip Text) là định dạng phụ đề gần như mọi nền tảng chấp nhận. Nó chỉ là một file văn bản thuần — không cần phần mềm đặc biệt để viết hay đọc — dựng từ các khối lặp lại với đúng bốn phần: số thứ tự cue, mốc bắt đầu/kết thúc (&#96;giờ:phút:giây,mili giây&#96;), văn bản (tối đa hai dòng), và một dòng trống ngăn cách khối này với khối kế tiếp. Đây là một file thật, hợp lệ, ba cue, viết tay:</p>
<pre><code class="language-plaintext">1
00:00:00,000 --> 00:00:02,500
Chao mung ban quay lai kenh.

2
00:00:02,500 --> 00:00:05,200
Hom nay minh se noi ve hau ky am thanh.

3
00:00:05,200 --> 00:00:08,000
Welcome back to the channel.</code></pre>
<p>Danh sách định dạng phụ đề/closed caption chính thức của YouTube xác nhận &#96;.srt&#96; trực tiếp — cùng với &#96;.sbv&#96;, &#96;.vtt&#96;, và vài định dạng broadcast — nên một file &#96;.srt&#96; viết tay hay Whisper sinh ra không cần đổi định dạng trước khi tải lên.</p>

<h3>Cứng (burn-in) vs mềm (closed caption) — một đánh đổi thật, không phải "cái nào tốt hơn"</h3>
${slide('cr-16', 11, 'Phụ đề cứng (burn-in) và phụ đề mềm')}
<p><strong>Phụ đề cứng (burn-in)</strong> được "in" vĩnh viễn vào pixel của video — người xem không tắt được, sửa một lỗi chính tả nghĩa là phải xuất lại cả video. <strong>Phụ đề mềm</strong> nằm ở một track riêng (hoặc file &#96;.srt&#96; riêng) mà trình phát bật/tắt được, sửa được mà không đụng vào file video, và — quan trọng cho kế hoạch song ngữ ở Chương 23 — một video có thể mang NHIỀU track ngôn ngữ cùng lúc thay vì phải xuất riêng cho mỗi ngôn ngữ. Ở bất cứ đâu hỗ trợ track phụ đề thật, mặc định dùng mềm; YouTube chính xác là một nơi như vậy.</p>

<h3>Tải file .srt của bạn lên YouTube — đúng các bước thật</h3>
<p>Đã kiểm trực tiếp theo hướng dẫn của YouTube: trong <strong>YouTube Studio → Subtitles</strong>, chọn video, bấm <strong>ADD LANGUAGE</strong> và chọn ngôn ngữ, rồi dưới mục "Subtitles" bấm <strong>ADD → Upload file</strong>, chọn <strong>With timing</strong> (cho file &#96;.srt&#96; đã có thời gian) hoặc <strong>Without timing</strong> (cho một bản chép lời thuần, YouTube tự canh thời gian), chọn file, và <strong>Save</strong>. Lặp lại "ADD LANGUAGE" cho ngôn ngữ thứ hai — đây là cách một lượt tải lên duy nhất mang được cả track phụ đề tiếng Việt lẫn tiếng Anh (Chương 23 dựng trọn vẹn quy trình song ngữ dựa trên đúng cơ chế này).</p>

<h3>Kiểu chữ cho màn hình điện thoại và vùng an toàn, không phải màn ảnh rạp</h3>
${slide('cr-16', 13, 'Phụ đề trong vùng an toàn — đặt đúng/sai')}
<p>Bài 12.3 đã định nghĩa <strong>vùng an toàn</strong> cho video ngắn: UI nền tảng (nút thích/bình luận, dòng chú thích, tên người dùng) che khoảng ~20% đáy và một dải bên phải của khung 9:16. Một phụ đề đặt "đúng" trong khung xem trước của chính phần mềm dựng vẫn có thể rơi thẳng xuống dưới UI của một điện thoại thật sau khi đăng — luôn kiểm theo đúng vùng an toàn thật, không chỉ theo cách nó nhìn trong cửa sổ dựng. Quy ước phụ đề phổ biến vượt ra ngoài luật riêng của bất kỳ nền tảng nào: dòng ngắn (tối đa hai dòng), viền hoặc khối nền để tương phản với mọi loại cảnh quay, và cỡ chữ đọc được ở khoảng cách cầm tay.</p>

<h3>Phụ đề tự động: ba công cụ, ba thoả thuận khác nhau</h3>
<p><strong>Auto captions của CapCut</strong> (Bài 12.3) đã phủ quy trình video ngắn của bạn — kể cả tuỳ chọn Bilingual captions — với một hạn mức miễn phí hàng tháng hiện trực tiếp trong app, gỡ bỏ khi có CapCut Pro. <strong>Phụ đề tự động của chính YouTube</strong> dùng nhận diện giọng nói theo ngôn ngữ của âm thanh gốc, trên hơn 80 ngôn ngữ (support.google.com/youtube/answer/6373554) — miễn phí, nhưng chỉ sinh ra SAU khi tải lên, và giống mọi công cụ tự chép lời trong khoá này, nó cần một lượt đọc soát (phát âm sai, giọng vùng miền, và tiếng ồn nền đều gây nghe sai). <strong>Create Subtitles from Audio của DaVinci Resolve</strong> là tính năng <strong>chỉ có ở Studio</strong> — khớp với ranh giới miễn phí/Studio Bài 16.1 vừa đi qua cho Voice Isolation, bản Resolve miễn phí không tự sinh phụ đề từ âm thanh; nó vẫn nhập, chỉnh kiểu, và burn-in được một file phụ đề do người/công cụ khác tạo ra (kể cả một file &#96;.srt&#96; từ Whisper ở Bài 16.4).</p>

<div class="callout warn"><p><strong>Đã kiểm, không mặc định đúng, ngay trên máy này:</strong> filter video &#96;subtitles=&#96; của chính ffmpeg là cách chuẩn, không phụ thuộc phần mềm nào, để burn-in một file &#96;.srt&#96; vào video từ dòng lệnh — nhưng nó phụ thuộc thư viện <strong>libass</strong> có được biên dịch vào bản ffmpeg của bạn hay không. Chạy &#96;ffmpeg -vf "subtitles=file.srt"&#96; trên máy dùng để soạn khoá học này THẤT BẠI hoàn toàn (bản ffmpeg Homebrew ở đây không biên dịch kèm libass) — một kết quả thật, trung thực, không phải một lời cảnh báo giả định. Trong thực hành điều này không quan trọng với quy trình của bạn: cả CapCut lẫn DaVinci Resolve (Bài 12.3, Chương 13) đều burn-in hoặc chỉnh kiểu phụ đề qua giao diện riêng, không cần ffmpeg chút nào. Nếu sau này muốn đi đường ffmpeg dòng lệnh trên máy của chính bạn, kiểm bản ffmpeg có hỗ trợ không trước (&#96;ffmpeg -filters | grep subtitles&#96;) thay vì mặc định là có.</p></div>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — burn-in phụ đề như bước xuất CUỐI CÙNG, sau khi đã khoá hình:</strong> ngay khi phụ đề bị in vào pixel, mọi sửa chữa sau đó (một lỗi chính tả, một nhát cắt canh lại thời gian, một bản dịch) nghĩa là phải xuất lại toàn bộ. Giữ phụ đề ở dạng mềm càng lâu càng tốt trong quy trình của bạn, và chỉ burn-in — nếu thật sự cần — như bước cuối cùng cho một nền tảng đòi hỏi đúng kiểu đó.</p></div>

<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 16.4 là lúc bạn ngừng gõ tay file &#96;.srt&#96; — máy Linux có GPU của bạn tự biến âm thanh thô thành file phụ đề có canh thời gian, bằng tiếng Việt hoặc tiếng Anh.</p>

<h3>🎬 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Viết tay một file &#96;.srt&#96; thật cho một clip 15–20 giây, đúng cấu trúc bốn phần ở trên.</li>
<li>Tải nó lên một video thử trong YouTube Studio → Subtitles → Add language → Upload file → With timing.</li>
<li>Xem lại phụ đề trong bản dựng video ngắn gần nhất của bạn, đối chiếu với vùng an toàn 9:16 — xác nhận không có dòng nào nằm dưới ~20% đáy hay dải UI bên phải.</li>
</ol><p><strong>Đạt khi:</strong> file &#96;.srt&#96; viết tay của bạn hiển thị đúng sau khi tải lên, và bạn nói được tính năng "phụ đề tự động" của công cụ nào trong ba công cụ tốn gói trả phí, công cụ nào không.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">SRT</span><span class="v">SubRip Text — file phụ đề dạng chữ thuần, 4 phần: số cue, mốc thời gian, văn bản, dòng trống.</span></div>
<div class="kv"><span class="k">Phụ đề cứng (burn-in)</span><span class="v">In vĩnh viễn vào pixel video — không tắt được, sửa phải render lại cả video.</span></div>
<div class="kv"><span class="k">Phụ đề mềm</span><span class="v">Track/file riêng, bật/tắt được, sửa không đụng tới video, chứa được nhiều ngôn ngữ.</span></div>
<div class="kv"><span class="k">Vùng an toàn</span><span class="v">Phần khung hình 9:16 KHÔNG bị UI nền tảng che — đã định nghĩa ở Bài 12.3.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>SRT là chữ thuần, bốn phần mỗi cue — YouTube xác nhận chính thức hỗ trợ &#96;.srt&#96; trực tiếp, không cần đổi định dạng.</li>
<li>Phụ đề mềm (track bật/tắt được) thắng burn-in cứng ở gần như mọi nơi nền tảng hỗ trợ nó — YouTube là một nơi như vậy.</li>
<li>Tải file của bạn: YouTube Studio → Subtitles → Add language → Upload file → With/Without timing → Save.</li>
<li>Ba công cụ phụ đề tự động, ba thoả thuận khác nhau: CapCut (miễn phí có hạn mức tháng), YouTube (miễn phí, sau khi tải lên), DaVinci Resolve (chỉ Studio) — cả ba đều vẫn cần đọc soát lại.</li>
<li>Filter &#96;subtitles=&#96; của ffmpeg cần biên dịch kèm libass — đã xác nhận KHÔNG có trên máy này; dùng giao diện burn-in riêng của CapCut/Resolve thay thế, đúng thứ bạn đã học.</li>
</ul>

<div class="link-card"><a href="https://support.google.com/youtube/answer/2734796" target="_blank" rel="noopener">YouTube Help — Thêm phụ đề và closed caption của riêng bạn</a></div>
</div>
`,
    },

    /* ─────────────────── 16.4 Whisper trên máy Linux ─────────────────── */
    {
      title: '16.4 — Whisper on your Linux GPU box|||16.4 — Whisper trên máy Linux có GPU',
      slug: 'cr-16-4-whisper-linux',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Tách âm thanh thật bằng ffmpeg, chạy faster-whisper trên GPU RTX 3060 để tự sinh phụ đề tiếng Việt/Anh, số đo thật về VRAM và thời gian chạy, và đồng bộ kết quả về Mac.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.4</span>
<h2>You already own the hardware to stop typing subtitles by hand</h2>
<p class="lead">Your Linux machine at home — Chapter 11 already used it for backups and transcoding — has a GPU sitting idle most of the day. <strong>Whisper</strong>, OpenAI's speech-recognition model, turns raw audio into a timed transcript, and a GPU-accelerated implementation runs it fast enough to caption a whole video in well under a minute. This lesson covers the one ffmpeg step that runs the same everywhere (tested for real on this course's own machine), and the GPU-specific steps that were measured for real on your own Linux box.</p>

<h3>Step one — extract 16kHz mono audio (runs anywhere, tested for real)</h3>
${slide('cr-16', 14, 'Whisper trên máy Linux → SRT VI/EN → Mac')}
<p>Whisper models expect 16kHz mono audio, not your camera's 48kHz stereo. This command was actually run while writing this course, on a synthetic 6-second test clip with picture and sound:</p>
<pre><code class="language-bash">ffmpeg -i clip.mp4 -vn -ac 1 -ar 16000 audio.wav</code></pre>
<div class="out">Stream #0:0: Audio: pcm_s16le, 16000 Hz, mono, s16, 256 kb/s
size=     188KiB time=00:00:06.01 bitrate=256.1kbits/s</div>
<p>&#96;-vn&#96; drops the video stream entirely, &#96;-ac 1&#96; forces mono, &#96;-ar 16000&#96; resamples to 16kHz — a real 6-second clip came out to 188KiB, confirming the format and duration before it ever reaches Whisper.</p>

<h3>Check VRAM before you run anything — a lesson learned the hard way</h3>
<p>Your Linux box does not sit idle the way you might assume: a local LLM and a couple of TTS (text-to-speech) reader services already occupy VRAM in the background. <strong>Measured on your own home machine, 22/09/2026</strong> (Fedora, RTX 3060 12GB): the local LLM held roughly <strong>5.9GB</strong>, two TTS readers held about <strong>2.9GB</strong> and <strong>1.3GB</strong>, leaving only about <strong>1.3GB</strong> free — not enough for Whisper's &#96;medium&#96; model. Temporarily stopping the 2.9GB reader freed it up to about <strong>4.1GB</strong>, enough to run. Check with &#96;nvidia-smi&#96; <strong>before</strong> starting a transcription job, not after it fails.</p>

<h3>faster-whisper: the GPU-accelerated implementation to actually use</h3>
<p><strong>faster-whisper</strong> (SYSTRAN, built on CTranslate2) is a faster, lower-memory reimplementation of OpenAI's Whisper, confirmed directly against its own README:</p>
<pre><code class="language-bash">pip install faster-whisper</code></pre>
<pre><code class="language-python">from faster_whisper import WhisperModel

model = WhisperModel("medium", device="cuda", compute_type="float16")
segments, info = model.transcribe(
    "audio.wav",
    vad_filter=True,        # required — see why below
    word_timestamps=True,   # per-word timing, not just per-line
)
for segment in segments:
    print(f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text}")</code></pre>
<p><strong>&#96;vad_filter=True&#96; is not optional.</strong> VAD (Voice Activity Detection) filters out stretches of audio with no speech — without it, Whisper is well known to "hallucinate" text during silence or background music, inventing sentences nobody said. Measured on your own machine, 22/09/2026, with exactly this configuration (&#96;medium&#96;, &#96;cuda&#96;, &#96;float16&#96;, &#96;vad_filter=True&#96;, &#96;word_timestamps=True&#96;): a 7-minute English clip produced <strong>1,003 words in 16 seconds</strong>; a 5-minute clip produced <strong>679 words in 11 seconds</strong>. Running 88 videos back-to-back (downloading audio with yt-dlp, transcribing, with rest breaks between downloads) took <strong>1.4 hours</strong> total.</p>

<h3>Translating a foreign-language track straight to English</h3>
<p>Pass &#96;task="translate"&#96; and Whisper does not just transcribe — it translates directly into English as it goes. Measured on your own machine: a <strong>29-minute Hindi</strong> clip, using &#96;task="translate"&#96;, produced <strong>4,239 English words in 91 seconds</strong>. That is not a separate translation step bolted on afterward — it is one model call doing both jobs at once.</p>

<h3>The fix for "libcublas.so.12 is not found"</h3>
<p>faster-whisper's CTranslate2 backend needs NVIDIA's <strong>cuBLAS</strong> (CUDA 12) and <strong>cuDNN 9</strong> libraries reachable at runtime. The library path has to be set <strong>before</strong> Python starts, not after — the common error, exactly as its README documents, is &#96;libcublas.so.12 is not found&#96;. If you installed the NVIDIA pip packages, the README's fix is to export the path they were installed to:</p>
<pre><code class="language-bash">export LD_LIBRARY_PATH=$(python3 -c 'import os, nvidia.cublas.lib, nvidia.cudnn.lib; \\
  print(os.path.dirname(nvidia.cublas.lib.__file__) + ":" + os.path.dirname(nvidia.cudnn.lib.__file__))')</code></pre>

<h3>Even a good model gets it wrong — always proofread</h3>
<p>YouTube's own automatic captions have a known pattern of mishearing technical terms — "sorting" coming out as "shopping" is a real example from this kind of programming content. Whisper &#96;medium&#96; generally hears more accurately and adds real punctuation, but it is not immune either — "safe and sound" once came out as "safe in SAM" on real audio. Lesson 16.3 already told you every auto-caption tool needs a proofread pass; this is the GPU-accelerated one, not an exception.</p>

<h3>whisper.cpp: the lightweight alternative — not run on this machine</h3>
<div class="callout warn"><p><strong>Command not run here — documented from the official README only.</strong> &#96;whisper.cpp&#96; (a dependency-free C/C++ implementation) is the other well-known option, useful on machines without a strong GPU. Confirmed from github.com/ggml-org/whisper.cpp: build with &#96;cmake -B build && cmake --build build -j&#96;, download a model with &#96;sh ./models/download-ggml-model.sh base.en&#96;, then run &#96;./build/bin/whisper-cli -f audio.wav -osrt&#96; — the &#96;-osrt&#96; flag writes an &#96;.srt&#96; file directly. This was not run on your Linux box during this course (no SSH access into your machine while writing it) — treat the commands as README-accurate, not as verified on your specific setup, and check &#96;./build/bin/whisper-cli -h&#96; yourself before relying on them.</p></div>

<h3>Getting the result back to your Mac</h3>
<p>Once you have a &#96;.srt&#96; file on the Linux box, copy it over your home network (or however you already move files between the two, from Chapter 11's backup routine) into your CapCut or Resolve project folder — both already know how to import a standard &#96;.srt&#96; (Lesson 12.3, Chapter 13), no conversion needed, since it is the exact same file format Lesson 16.3 just covered.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — running &#96;medium&#96; without checking VRAM first, on a machine also running other services:</strong> the failure mode is not always a clean out-of-memory error — it can also just be very slow, or fail deep into a long file after already spending real time on it. &#96;nvidia-smi&#96; first, every time, costs ten seconds and saves you from finding out the hard way.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Chapters 17–19 take the edit to a professional level — transitions, keyframes, speed, masks, tracking, VFX, motion graphics and 3D; then Chapter 24 covers exporting and uploading everything this chapter produced — audio mixed to target loudness, on-screen text and graphics, and subtitles in both languages.</p>

<h3>🎬 Practice (varies — depends on your Linux box's availability)</h3>
<div class="callout ok"><ol>
<li>Run the ffmpeg extraction command on a real clip of yours and confirm the output is 16kHz mono.</li>
<li>On your Linux machine, run &#96;nvidia-smi&#96; before attempting anything — note how much VRAM is actually free right now.</li>
<li>If you have faster-whisper set up, transcribe a short clip with &#96;vad_filter=True&#96; and &#96;word_timestamps=True&#96;, and proofread the result against what was actually said.</li>
</ol><p><strong>Done when:</strong> you have one real &#96;.srt&#96; file generated by Whisper (or a clear note of exactly which step blocked you), proofread, and imported into your editor.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">VAD</span><span class="v">Voice Activity Detection — lọc bỏ đoạn không có tiếng nói, chặn Whisper "bịa" chữ trong khoảng lặng/nhạc.</span></div>
<div class="kv"><span class="k">word_timestamps</span><span class="v">Canh thời gian theo TỪNG TỪ, không chỉ theo từng dòng/câu.</span></div>
<div class="kv"><span class="k">task=translate</span><span class="v">Whisper dịch thẳng sang tiếng Anh trong cùng một lượt chạy, không phải bước dịch riêng.</span></div>
<div class="kv"><span class="k">LD_LIBRARY_PATH</span><span class="v">Biến môi trường trỏ tới thư viện cuBLAS/cuDNN — phải đặt TRƯỚC khi Python khởi động.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Extract 16kHz mono audio first — &#96;ffmpeg -i clip.mp4 -vn -ac 1 -ar 16000 audio.wav&#96;, confirmed for real on a test clip.</li>
<li>Check &#96;nvidia-smi&#96; before transcribing — other services on your Linux box already use most of the VRAM.</li>
<li>faster-whisper, &#96;medium&#96;, &#96;device="cuda"&#96;, &#96;compute_type="float16"&#96;, &#96;vad_filter=True&#96;, &#96;word_timestamps=True&#96; — measured real speed: minutes of audio transcribed in seconds.</li>
<li>&#96;task="translate"&#96; produces English text directly from a foreign-language track in one pass.</li>
<li>Even GPU-accelerated Whisper mishears words sometimes — proofread every generated &#96;.srt&#96; the same as any other auto-caption tool.</li>
</ul>

<div class="link-card"><a href="https://github.com/SYSTRAN/faster-whisper" target="_blank" rel="noopener">SYSTRAN/faster-whisper — official README (install, VAD, word timestamps)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.4</span>
<h2>Bạn đã có sẵn phần cứng để ngừng gõ tay phụ đề</h2>
<p class="lead">Máy Linux ở nhà bạn — Chương 11 đã dùng nó để sao lưu và chuyển mã — có một GPU ngồi không phần lớn thời gian trong ngày. <strong>Whisper</strong>, model nhận diện giọng nói của OpenAI, biến âm thanh thô thành bản chép lời có canh thời gian, và một bản chạy tăng tốc bằng GPU đủ nhanh để làm phụ đề cho cả một video trong chưa tới một phút. Bài này nói về bước ffmpeg chạy giống nhau ở mọi nơi (đã chạy thật trên chính máy soạn khoá này), và các bước riêng cho GPU đã được đo thật trên đúng máy Linux của bạn.</p>

<h3>Bước một — tách âm thanh 16kHz mono (chạy ở đâu cũng được, đã chạy thật)</h3>
${slide('cr-16', 14, 'Whisper trên máy Linux → SRT VI/EN → Mac')}
<p>Model Whisper cần âm thanh 16kHz mono, không phải 48kHz stereo từ máy quay của bạn. Lệnh này đã THẬT SỰ chạy khi soạn khoá học này, trên một clip thử 6 giây tổng hợp có cả hình và tiếng:</p>
<pre><code class="language-bash">ffmpeg -i clip.mp4 -vn -ac 1 -ar 16000 audio.wav</code></pre>
<div class="out">Stream #0:0: Audio: pcm_s16le, 16000 Hz, mono, s16, 256 kb/s
size=     188KiB time=00:00:06.01 bitrate=256.1kbits/s</div>
<p>&#96;-vn&#96; bỏ hẳn stream hình, &#96;-ac 1&#96; ép về mono, &#96;-ar 16000&#96; resample về 16kHz — một clip thử thật 6 giây ra đúng 188KiB, xác nhận định dạng và thời lượng trước khi nó tới tay Whisper.</p>

<h3>Kiểm VRAM trước khi chạy bất cứ gì — bài học từ thực tế</h3>
<p>Máy Linux của bạn không hề rảnh rỗi như bạn có thể tưởng: một LLM cục bộ và vài dịch vụ đọc TTS (chuyển chữ thành giọng nói) đã chiếm VRAM sẵn trong nền. <strong>Đo trên chính máy nhà của bạn, 22/09/2026</strong> (Fedora, RTX 3060 12GB): LLM cục bộ giữ khoảng <strong>5,9GB</strong>, hai máy đọc TTS giữ khoảng <strong>2,9GB</strong> và <strong>1,3GB</strong>, chỉ còn trống khoảng <strong>1,3GB</strong> — không đủ cho model &#96;medium&#96; của Whisper. Tạm tắt máy đọc 2,9GB giải phóng được lên khoảng <strong>4,1GB</strong>, đủ để chạy. Kiểm bằng &#96;nvidia-smi&#96; <strong>TRƯỚC</strong> khi bắt đầu một lượt chép lời, không phải sau khi nó đã chạy hỏng.</p>

<h3>faster-whisper: bản tăng tốc GPU thật sự nên dùng</h3>
<p><strong>faster-whisper</strong> (của SYSTRAN, dựng trên CTranslate2) là bản viết lại nhanh hơn, tốn ít bộ nhớ hơn của Whisper gốc từ OpenAI, đã kiểm trực tiếp theo đúng README của chính nó:</p>
<pre><code class="language-bash">pip install faster-whisper</code></pre>
<pre><code class="language-python">from faster_whisper import WhisperModel

model = WhisperModel("medium", device="cuda", compute_type="float16")
segments, info = model.transcribe(
    "audio.wav",
    vad_filter=True,        # bắt buộc — xem lý do dưới đây
    word_timestamps=True,   # canh thời gian từng từ, không chỉ từng dòng
)
for segment in segments:
    print(f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text}")</code></pre>
<p><strong>&#96;vad_filter=True&#96; không phải tuỳ chọn.</strong> VAD (Voice Activity Detection — nhận diện có tiếng nói) lọc bỏ những đoạn âm thanh không có giọng nói — không có nó, Whisper nổi tiếng "bịa" chữ trong khoảng lặng hoặc nhạc nền, tự nghĩ ra những câu chẳng ai nói. Đo trên chính máy của bạn, 22/09/2026, với đúng cấu hình này (&#96;medium&#96;, &#96;cuda&#96;, &#96;float16&#96;, &#96;vad_filter=True&#96;, &#96;word_timestamps=True&#96;): một clip tiếng Anh 7 phút cho ra <strong>1.003 từ trong 16 giây</strong>; một clip 5 phút cho ra <strong>679 từ trong 11 giây</strong>. Chạy liền 88 video (tải âm bằng yt-dlp, chép lời, có nghỉ giữa các lượt tải) tốn tổng cộng <strong>1,4 giờ</strong>.</p>

<h3>Dịch thẳng một track tiếng nước ngoài sang tiếng Anh</h3>
<p>Truyền &#96;task="translate"&#96; và Whisper không chỉ chép lời — nó dịch thẳng sang tiếng Anh trong lúc chạy. Đo trên chính máy của bạn: một clip <strong>tiếng Hindi 29 phút</strong>, dùng &#96;task="translate"&#96;, cho ra <strong>4.239 từ tiếng Anh trong 91 giây</strong>. Đó không phải một bước dịch riêng gắn thêm vào sau — đó là MỘT lượt gọi model làm cả hai việc cùng lúc.</p>

<h3>Cách sửa lỗi "libcublas.so.12 is not found"</h3>
<p>Phần lõi CTranslate2 của faster-whisper cần thư viện <strong>cuBLAS</strong> (CUDA 12) và <strong>cuDNN 9</strong> của NVIDIA có mặt được lúc chạy. Đường dẫn thư viện phải được đặt <strong>TRƯỚC</strong> khi Python khởi động, không phải sau — lỗi hay gặp, đúng như README của nó ghi, là &#96;libcublas.so.12 is not found&#96;. Nếu bạn cài các gói pip của NVIDIA, cách sửa theo README là export đúng đường dẫn chúng được cài vào:</p>
<pre><code class="language-bash">export LD_LIBRARY_PATH=$(python3 -c 'import os, nvidia.cublas.lib, nvidia.cudnn.lib; \\
  print(os.path.dirname(nvidia.cublas.lib.__file__) + ":" + os.path.dirname(nvidia.cudnn.lib.__file__))')</code></pre>

<h3>Kể cả model tốt vẫn sai — luôn đọc soát</h3>
<p>Phụ đề tự động của chính YouTube có kiểu nghe sai thuật ngữ kỹ thuật nổi tiếng — "sorting" nghe thành "shopping" là một ví dụ thật từ đúng kiểu nội dung lập trình này. Whisper &#96;medium&#96; nhìn chung nghe chính xác hơn và có dấu câu thật, nhưng cũng không miễn nhiễm — "safe and sound" từng ra thành "safe in SAM" trên âm thanh thật. Bài 16.3 đã nói mọi công cụ phụ đề tự động đều cần một lượt đọc soát; đây là bản tăng tốc GPU, không phải ngoại lệ.</p>

<h3>whisper.cpp: lựa chọn nhẹ hơn — chưa chạy trên máy này</h3>
<div class="callout warn"><p><strong>Lệnh CHƯA chạy ở đây — chỉ ghi lại theo đúng README chính thức.</strong> &#96;whisper.cpp&#96; (bản C/C++ không phụ thuộc thư viện ngoài) là lựa chọn nổi tiếng khác, hữu ích trên máy không có GPU mạnh. Đã kiểm theo github.com/ggml-org/whisper.cpp: dựng bằng &#96;cmake -B build && cmake --build build -j&#96;, tải model bằng &#96;sh ./models/download-ggml-model.sh base.en&#96;, rồi chạy &#96;./build/bin/whisper-cli -f audio.wav -osrt&#96; — cờ &#96;-osrt&#96; ghi thẳng ra file &#96;.srt&#96;. Lệnh này CHƯA chạy trên máy Linux của bạn trong lúc soạn khoá học (không SSH vào máy bạn lúc soạn) — coi các lệnh này đúng theo README, không phải đã kiểm chứng trên đúng máy của bạn, và tự chạy &#96;./build/bin/whisper-cli -h&#96; trước khi tin vào chúng.</p></div>

<h3>Đưa kết quả về lại Mac</h3>
<p>Khi đã có file &#96;.srt&#96; trên máy Linux, chép nó qua mạng nhà (hoặc bất cứ cách nào bạn đã dùng để chuyển file giữa hai máy, từ quy trình sao lưu ở Chương 11) vào thư mục dự án CapCut hoặc Resolve — cả hai đều đã biết nhập một file &#96;.srt&#96; chuẩn (Bài 12.3, Chương 13), không cần đổi định dạng, vì đây đúng là định dạng file Bài 16.3 vừa nói tới.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — chạy &#96;medium&#96; mà không kiểm VRAM trước, trên một máy đang chạy sẵn dịch vụ khác:</strong> kiểu lỗi không phải lúc nào cũng là một thông báo hết bộ nhớ rõ ràng — nó cũng có thể chỉ đơn giản là RẤT chậm, hoặc hỏng giữa chừng một file dài sau khi đã tốn thời gian thật cho nó. &#96;nvidia-smi&#96; trước, mỗi lần, tốn mười giây và cứu bạn khỏi việc phát hiện ra theo cách khó chịu.</p></div>

<p class="note-ct"><strong>Nối với chương sau:</strong> Chương 17–19 đưa bản dựng lên mức chuyên nghiệp — chuyển cảnh, keyframe, tốc độ, mask, tracking, VFX, motion graphics và 3D; rồi Chương 24 xuất file và đăng tải mọi thứ chương này vừa tạo ra — âm thanh đã mix về đúng mục tiêu độ lớn, chữ/đồ hoạ trên hình, và phụ đề ở cả hai ngôn ngữ.</p>

<h3>🎬 Thực hành (tuỳ máy Linux của bạn rảnh lúc nào)</h3>
<div class="callout ok"><ol>
<li>Chạy lệnh tách âm ffmpeg ở trên trên một clip thật của bạn, xác nhận output đúng 16kHz mono.</li>
<li>Trên máy Linux, chạy &#96;nvidia-smi&#96; trước khi thử bất cứ gì — ghi lại đang còn trống bao nhiêu VRAM thật sự.</li>
<li>Nếu đã cài faster-whisper, chép lời một clip ngắn với &#96;vad_filter=True&#96; và &#96;word_timestamps=True&#96;, rồi đọc soát kết quả so với những gì thật sự được nói.</li>
</ol><p><strong>Đạt khi:</strong> bạn có một file &#96;.srt&#96; thật do Whisper sinh ra (hoặc ghi rõ đúng bước nào đang chặn bạn), đã đọc soát, và đã nhập vào phần mềm dựng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">VAD</span><span class="v">Voice Activity Detection — lọc bỏ đoạn không có tiếng nói, chặn Whisper "bịa" chữ trong khoảng lặng/nhạc.</span></div>
<div class="kv"><span class="k">word_timestamps</span><span class="v">Canh thời gian theo TỪNG TỪ, không chỉ theo từng dòng/câu.</span></div>
<div class="kv"><span class="k">task=translate</span><span class="v">Whisper dịch thẳng sang tiếng Anh trong cùng một lượt chạy, không phải bước dịch riêng.</span></div>
<div class="kv"><span class="k">LD_LIBRARY_PATH</span><span class="v">Biến môi trường trỏ tới thư viện cuBLAS/cuDNN — phải đặt TRƯỚC khi Python khởi động.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tách âm 16kHz mono trước — &#96;ffmpeg -i clip.mp4 -vn -ac 1 -ar 16000 audio.wav&#96;, đã xác nhận thật trên một clip thử.</li>
<li>Kiểm &#96;nvidia-smi&#96; trước khi chép lời — dịch vụ khác trên máy Linux đã chiếm sẵn phần lớn VRAM.</li>
<li>faster-whisper, &#96;medium&#96;, &#96;device="cuda"&#96;, &#96;compute_type="float16"&#96;, &#96;vad_filter=True&#96;, &#96;word_timestamps=True&#96; — tốc độ thật đã đo: vài phút âm thanh chép lời xong trong vài giây.</li>
<li>&#96;task="translate"&#96; cho ra chữ tiếng Anh trực tiếp từ một track tiếng nước ngoài chỉ trong một lượt chạy.</li>
<li>Kể cả Whisper chạy GPU vẫn nghe sai đôi chỗ — đọc soát mọi file &#96;.srt&#96; sinh ra, như với bất kỳ công cụ phụ đề tự động nào khác.</li>
</ul>

<div class="link-card"><a href="https://github.com/SYSTRAN/faster-whisper" target="_blank" rel="noopener">SYSTRAN/faster-whisper — README chính thức (cài đặt, VAD, canh thời gian theo từ)</a></div>
</div>
`,
    },

    /* ─────────────────── 16.5 Kiểm tra chương ─────────────────── */
    {
      title: '16.5 — Chapter 16 check|||16.5 — Kiểm tra chương 16',
      slug: 'cr-16-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tóm tắt chương 16 + checklist tự kiểm, và 10 câu hỏi tình huống về LUFS/true peak, chuỗi xử lý giọng, chữ/font, SRT, và Whisper trên GPU.',
      content: `<div class="ml-en">
<h2>📌 Chapter 16 summary</h2>
<p>Chapter 9 got peaks clean on set; this chapter mixes to how loud the whole video FEELS. LUFS (an integrated, perception-based measurement) is not the same thing as dBFS (an instantaneous peak reading) — measure with &#96;ffmpeg -af ebur128&#96;, normalize with two-pass &#96;loudnorm&#96; (measure, then apply with &#96;linear=true&#96;), and verify the result independently rather than trusting the tool's own printout. Roughly −14 LUFS is the widely used target, but it is community/industry consensus, not a number YouTube's Help Center publishes — true peak ≤ −1 dBTP, by contrast, IS an official EBU R128 ceiling. A standard vocal chain — denoise → EQ (cut 80–100Hz) → compressor → de-esser → limiter — is buildable entirely in free DaVinci Resolve Fairlight; only the one-click AI tools (Voice Isolation, automatic subtitle generation) need Studio. On-screen text needs to be sans-serif, large, high-contrast, and inside the safe zone, in a font confirmed to carry the Vietnamese subset (Be Vietnam Pro, Inter, Roboto all checked). Subtitles are a plain-text SRT file, four parts per cue; soft (switchable) beats hard burn-in almost everywhere YouTube-style platforms are involved, and YouTube directly supports uploading your own &#96;.srt&#96;. Finally, your Linux GPU box can generate that &#96;.srt&#96; automatically with faster-whisper — &#96;vad_filter=True&#96; is required to stop it inventing text during silence, and checking &#96;nvidia-smi&#96; first avoids fighting other services for VRAM.</p>
<h3>Self-check before your next mix</h3>
<div class="callout ok"><ul>
<li>☐ I can explain why a clean dBFS peak does not guarantee the right LUFS, without checking this lesson.</li>
<li>☐ I ran a real two-pass &#96;loudnorm&#96; on a clip and verified the result with an independent &#96;ebur128&#96; pass.</li>
<li>☐ I know which vocal-chain tools are free in Fairlight and which one specifically needs Studio.</li>
<li>☐ My title/lower-third font is confirmed to carry the Vietnamese subset.</li>
<li>☐ I can write a valid four-part SRT cue from memory.</li>
<li>☐ I know why &#96;vad_filter=True&#96; matters before running Whisper on a real clip.</li>
</ul></div>
</div>
<div class="ml-vi">
<h2>📌 Tóm tắt Chương 16</h2>
<p>Chương 9 đã lo cho đỉnh sạch lúc quay; chương này mix về cả video CẢM GIÁC to cỡ nào. LUFS (một phép đo tích hợp, dựa trên cảm nhận) không giống dBFS (một phép đọc đỉnh tức thời) — đo bằng &#96;ffmpeg -af ebur128&#96;, chuẩn hoá bằng &#96;loudnorm&#96; hai lượt (đo, rồi áp dụng với &#96;linear=true&#96;), và xác nhận kết quả một cách độc lập thay vì tin bản in của chính công cụ đó. Khoảng −14 LUFS là mục tiêu được dùng rộng rãi, nhưng đó là đồng thuận cộng đồng/ngành, không phải con số trang trợ giúp YouTube công bố — ngược lại, true peak ≤ −1dBTP LÀ một trần chính thức của EBU R128. Một chuỗi xử lý giọng chuẩn — khử ồn → EQ (cắt 80–100Hz) → compressor → de-esser → limiter — dựng được trọn vẹn trên Fairlight miễn phí của DaVinci Resolve; chỉ công cụ AI một-chạm (Voice Isolation, tự sinh phụ đề) mới cần Studio. Chữ trên hình cần không chân, đủ lớn, tương phản cao, và nằm trong vùng an toàn, bằng một font đã xác nhận mang subset tiếng Việt (Be Vietnam Pro, Inter, Roboto đều đã kiểm). Phụ đề là một file SRT chữ thuần, bốn phần mỗi cue; mềm (bật/tắt được) thắng burn-in cứng ở gần như mọi nơi kiểu nền tảng như YouTube, và YouTube hỗ trợ trực tiếp việc tải lên file &#96;.srt&#96; của riêng bạn. Cuối cùng, máy Linux có GPU của bạn tự sinh được file &#96;.srt&#96; đó bằng faster-whisper — &#96;vad_filter=True&#96; là bắt buộc để chặn nó bịa chữ trong khoảng lặng, và kiểm &#96;nvidia-smi&#96; trước giúp tránh tranh VRAM với dịch vụ khác.</p>
<h3>Tự kiểm trước lượt mix tiếp theo</h3>
<div class="callout ok"><ul>
<li>☐ Tôi giải thích được vì sao một đỉnh dBFS sạch không đảm bảo LUFS đúng, mà không cần xem lại bài.</li>
<li>☐ Tôi đã chạy &#96;loudnorm&#96; hai lượt thật trên một clip và xác nhận kết quả bằng một lượt &#96;ebur128&#96; độc lập.</li>
<li>☐ Tôi biết công cụ nào trong chuỗi xử lý giọng miễn phí trên Fairlight, và công cụ nào cụ thể cần Studio.</li>
<li>☐ Font tiêu đề/lower third của tôi đã xác nhận mang subset tiếng Việt.</li>
<li>☐ Tôi viết được một cue SRT bốn phần hợp lệ từ trí nhớ.</li>
<li>☐ Tôi biết vì sao &#96;vad_filter=True&#96; quan trọng trước khi chạy Whisper trên một clip thật.</li>
</ul></div>
</div>`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Your voice peaks read a clean -8dBFS in every clip, yet your video sounds noticeably quieter than other channels\' videos in the same feed. What is missing?|||Đỉnh giọng nói của bạn luôn đọc sạch -8dBFS trong mọi clip, nhưng video của bạn nghe nhỏ hơn hẳn video của kênh khác trong cùng một feed. Bạn đang thiếu gì?',
            options: [
              'Nothing — a clean -8dBFS peak already guarantees correct playback loudness|||Không thiếu gì — đỉnh sạch -8dBFS đã đảm bảo độ lớn phát lại đúng rồi',
              'Mixing to an integrated LUFS target (roughly -14) — dBFS peak and LUFS measure different things|||Mix về đúng mục tiêu LUFS tích hợp (khoảng -14) — đỉnh dBFS và LUFS đo hai thứ khác nhau',
              'A louder microphone during recording|||Một chiếc micro thu to hơn lúc quay',
              'Re-exporting at a higher bitrate|||Xuất lại ở bitrate cao hơn',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: dBFS is an instantaneous peak reading (Chapter 9\'s concern — did any single moment clip); LUFS is an integrated, perception-based measurement of how loud the WHOLE video feels. A clip can have perfectly clean -8dBFS peaks and still measure far too quiet in LUFS. Measure with ebur128 and normalize with two-pass loudnorm toward roughly -14 LUFS.|||VI: dBFS là một phép đọc đỉnh TỨC THỜI (mối quan tâm của Chương 9 — có khoảnh khắc nào vỡ không); LUFS là một phép đo TÍCH HỢP, dựa trên cảm nhận, cho biết CẢ video nghe to cỡ nào. Một clip có thể có đỉnh sạch đúng -8dBFS mà vẫn đo được quá nhỏ theo LUFS. Đo bằng ebur128 và chuẩn hoá bằng loudnorm hai lượt về khoảng -14 LUFS.',
          },
          {
            question: 'A fellow creator insists YouTube\'s official Help Center states an exact "-14 LUFS" requirement for uploads. Is that accurate?|||Một người làm nội dung khác khẳng định trang trợ giúp chính thức của YouTube ghi rõ yêu cầu chính xác "-14 LUFS" cho video tải lên. Điều đó có đúng không?',
            options: [
              'Yes, and it is enforced at upload — videos above it get rejected|||Đúng, và nó được ép buộc lúc tải lên — video vượt mức đó bị từ chối',
              'No such normalization exists on YouTube at all|||YouTube không hề có cơ chế chuẩn hoá độ lớn nào cả',
              'No — YouTube\'s Help Center does not publish that exact figure; -14 LUFS is a widely used community/industry reference point, not an official written spec|||Không — trang trợ giúp của YouTube không công bố đúng con số đó; -14 LUFS là điểm tham chiếu được cộng đồng/ngành dùng rộng rãi, không phải đặc tả chính thức bằng văn bản',
              'Yes, but only for videos longer than 20 minutes|||Đúng, nhưng chỉ áp dụng cho video dài hơn 20 phút',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Checked directly against support.google.com: no page states an exact LUFS figure for YouTube video loudness normalization. -14 LUFS circulates widely because it is the default target in many mixing tools and matches independent community measurement, not because YouTube wrote it down as a spec. Platforms that normalize on playback only ever turn audio DOWN if louder than target — they never turn quiet audio up.|||VI: Đã kiểm trực tiếp trên support.google.com: không có trang nào công bố đúng con số LUFS cho việc chuẩn hoá video YouTube. -14 LUFS lưu hành rộng vì nó là mục tiêu mặc định trong nhiều công cụ mix và khớp với đo đạc độc lập của cộng đồng, không phải vì YouTube ghi thành đặc tả. Nền tảng chuẩn hoá lúc phát chỉ bao giờ HẠ âm lượng nếu to hơn mục tiêu — không bao giờ tự tăng âm lượng nhỏ lên.',
          },
          {
            question: 'You run ffmpeg loudnorm in a single pass with default (non-linear) settings on a clip with real dynamic range from careful mixing. What is the risk, and what should you do instead?|||Bạn chạy ffmpeg loudnorm một lượt với cài đặt mặc định (phi tuyến tính) trên một clip có dải động thật từ một lượt mix cẩn thận. Rủi ro là gì, và nên làm gì thay vào đó?',
            options: [
              'No risk — single-pass is always equivalent to two-pass|||Không rủi ro gì — một lượt luôn tương đương hai lượt',
              'It can compress away the dynamic range you deliberately shaped — instead, measure first (print_format=json), then apply with the exact measured_* values and linear=true|||Nó có thể nén mất dải động bạn cố tình tạo ra — thay vào đó, đo trước (print_format=json), rồi áp dụng đúng các giá trị measured_* với linear=true',
              'The only risk is a slightly longer render time|||Rủi ro duy nhất chỉ là thời gian render lâu hơn một chút',
              'Single-pass mode cannot reach -14 LUFS at all|||Chế độ một lượt không thể nào đạt -14 LUFS',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: The two-pass workflow — pass one measures only (print_format=json gives input_i, input_tp, input_lra, input_thresh, target_offset), pass two applies those exact numbers with linear=true — produces a linear gain change that preserves dynamics. The single-pass default is non-linear and can audibly squash dynamic range you already shaped in Lesson 14.4.|||VI: Quy trình hai lượt — lượt một CHỈ đo (print_format=json cho ra input_i, input_tp, input_lra, input_thresh, target_offset), lượt hai áp dụng đúng những số đó với linear=true — tạo ra một phép đổi gain TUYẾN TÍNH, giữ nguyên dải động. Chế độ một lượt mặc định là phi tuyến tính và có thể nén mất rõ rệt dải động bạn đã tạo ở Bài 14.4.',
          },
          {
            question: 'Where does the "true peak must not exceed -1 dBTP in production" ceiling actually come from?|||Trần "true peak không được vượt -1 dBTP trong sản xuất" thật ra đến từ đâu?',
            options: [
              'The EBU R128 loudness recommendation — an official broadcast/production standard|||Khuyến nghị độ lớn EBU R128 — một chuẩn sản xuất/phát sóng chính thức',
              'A YouTube-specific upload requirement|||Một yêu cầu riêng của YouTube khi tải video lên',
              'A default CapCut setting with no external source|||Một cài đặt mặc định của CapCut, không có nguồn ngoài',
              'It is just a personal habit among audio engineers, with no written standard|||Chỉ là thói quen cá nhân của kỹ sư âm thanh, không có chuẩn viết ra',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: EBU R128 (tech.ebu.ch/docs/r/r128.pdf) sets the maximum permitted true peak in production at -1 dBTP — an official, citable standard, unlike the -14 LUFS figure from the previous question. True peak catches inter-sample peaks a simple dBFS sample reading can miss, and crossing it risks distortion introduced by a platform\'s own re-encoding even if your original file never touched 0dBFS.|||VI: EBU R128 (tech.ebu.ch/docs/r/r128.pdf) đặt true peak tối đa cho phép trong sản xuất ở -1dBTP — một chuẩn CHÍNH THỨC, trích dẫn được, khác với con số -14 LUFS ở câu trước. True peak bắt được cả đỉnh liên-mẫu mà một phép đọc dBFS đơn giản có thể bỏ sót, và vượt qua nó có nguy cơ gây méo tiếng do chính nền tảng mã hoá lại, dù file gốc của bạn chưa từng chạm 0dBFS.',
          },
          {
            question: 'After compressing your voice track, the "s" and "x" sounds became MORE harsh, not less. What happened, and where does the fix belong in the chain?|||Sau khi nén (compress) track giọng nói, tiếng "s" và "x" trở nên GẮT hơn, không phải dịu đi. Chuyện gì đã xảy ra, và chỗ sửa nằm ở đâu trong chuỗi?',
            options: [
              'The microphone is broken — re-record everything|||Micro bị hỏng — phải thu lại toàn bộ',
              'This is expected and cannot be fixed at the mixing stage|||Đây là chuyện bình thường và không sửa được ở khâu mix',
              'A compressor raises quiet moments including quiet-but-harsh sibilants — add a de-esser after the compressor, before the final limiter|||Compressor kéo các khoảnh khắc nhỏ lên to hơn, kể cả tiếng rít nhỏ-nhưng-gắt — thêm một de-esser SAU compressor, TRƯỚC limiter cuối',
              'Lower the EQ high-pass cutoff below 80Hz|||Hạ điểm cắt high-pass của EQ xuống dưới 80Hz',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: The standard vocal chain is denoise → EQ (cut 80-100Hz rumble) → compressor → de-esser → limiter. A compressor evens out loud/quiet gaps, which includes making quiet sibilance relatively louder — exactly why de-esser sits AFTER the compressor in the chain, specifically to tame what the compressor just made worse, with the limiter as the final safety net.|||VI: Chuỗi xử lý giọng chuẩn là khử ồn → EQ (cắt ù 80-100Hz) → compressor → de-esser → limiter. Compressor đều lại khoảng cách to/nhỏ, nghĩa là kéo cả tiếng rít nhỏ lên tương đối to hơn — đúng lý do de-esser nằm SAU compressor trong chuỗi, để hãm lại đúng thứ compressor vừa làm nặng hơn, với limiter là lưới an toàn cuối cùng.',
          },
          {
            question: 'On a limited budget, you want to clean up noisy dialogue in DaVinci Resolve without paying for Studio. What is actually available to you for free?|||Với ngân sách hạn chế, bạn muốn làm sạch lời thoại ồn trong DaVinci Resolve mà không trả tiền cho Studio. Bạn thật sự có gì miễn phí?',
            options: [
              'Nothing — all noise-related tools in Fairlight need Studio|||Không có gì — mọi công cụ liên quan tới tiếng ồn trong Fairlight đều cần Studio',
              'The hands-on channel-strip tools — 6-band EQ, compressor, gate/expander, de-esser, limiter — are all free; only the one-click AI Voice Isolation tool needs Studio|||Công cụ tay trên channel strip — EQ 6-band, compressor, gate/expander, de-esser, limiter — đều miễn phí; chỉ công cụ AI một-chạm Voice Isolation mới cần Studio',
              'Only the EQ is free; compressor and limiter both need Studio|||Chỉ EQ là miễn phí; compressor và limiter đều cần Studio',
              'Free Resolve has no audio tools at all, only Studio does|||Resolve miễn phí không có công cụ âm thanh nào cả, chỉ Studio mới có',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Consistent with Chapter 13\'s free-vs-Studio table: the traditional dynamics processors (EQ, compressor, gate, de-esser, limiter) ship in free Resolve\'s Fairlight page in full. What is Studio-exclusive is the one-click AI layer — Voice Isolation and AI-assisted noise reduction — plus automatic subtitle generation (Lesson 16.3). You can build the entire manual vocal chain for free; Studio only buys a faster AI shortcut.|||VI: Khớp với bảng miễn phí/Studio của Chương 13: các bộ xử lý dynamics truyền thống (EQ, compressor, gate, de-esser, limiter) có đầy đủ trên trang Fairlight của Resolve miễn phí. Thứ chỉ có ở Studio là lớp AI một-chạm — Voice Isolation và khử ồn có AI hỗ trợ — cộng với tự sinh phụ đề (Bài 16.3). Bạn dựng được trọn vẹn chuỗi xử lý giọng bằng tay, miễn phí; Studio chỉ mua một đường tắt AI nhanh hơn.',
          },
          {
            question: 'You found a nice-looking free font online for your video titles. Before locking it into your template, what should you check first?|||Bạn tìm được một font miễn phí đẹp mắt trên mạng cho tiêu đề video. Trước khi khoá nó vào template, bạn nên kiểm gì trước?',
            options: [
              'Type a sentence with dense Vietnamese diacritic stacks and confirm every mark renders correctly — not every free font carries the Vietnamese subset|||Gõ một câu có chồng dấu tiếng Việt dày và xác nhận mọi dấu hiển thị đúng — không phải font miễn phí nào cũng mang subset tiếng Việt',
              'Nothing — all fonts support every language by default|||Không cần kiểm gì — mọi font đều hỗ trợ mọi ngôn ngữ theo mặc định',
              'Only check the file size|||Chỉ cần kiểm dung lượng file',
              'Only check that it looks good in English|||Chỉ cần kiểm nó nhìn đẹp với tiếng Anh',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: A font can look fine in English and still silently drop or misrender Vietnamese diacritics. Be Vietnam Pro, Inter, and Roboto were specifically checked on fonts.google.com to carry the Vietnamese language subset — any other font should be checked the same way, with a real sentence containing dense diacritic stacks, before it goes into a reusable template.|||VI: Một font có thể nhìn ổn với tiếng Anh mà vẫn âm thầm mất hoặc hiển thị sai dấu tiếng Việt. Be Vietnam Pro, Inter, và Roboto đã được kiểm riêng trên fonts.google.com để xác nhận mang subset ngôn ngữ tiếng Việt — bất kỳ font nào khác cũng nên kiểm theo đúng cách đó, bằng một câu thật có chồng dấu dày, trước khi đưa vào một template dùng lại.',
          },
          {
            question: 'A week after publishing, you spot a typo in a subtitle that was burned into the video (hard subtitles). What does fixing it require?|||Một tuần sau khi đăng, bạn phát hiện lỗi chính tả trong một dòng phụ đề đã burn-in vào video (phụ đề cứng). Sửa nó đòi hỏi gì?',
            options: [
              'Editing a text file and re-uploading just that file|||Sửa một file văn bản rồi tải lại đúng file đó',
              'Nothing — YouTube lets you edit burned-in text directly|||Không cần gì — YouTube cho sửa trực tiếp chữ đã burn-in',
              'A quick toggle in YouTube Studio|||Một cú bật/tắt nhanh trong YouTube Studio',
              'Re-exporting and re-uploading the entire video — the text is permanently rendered into the pixels|||Xuất lại và tải lại TOÀN BỘ video — chữ đã được in vĩnh viễn vào pixel',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Hard (burned-in) subtitles are rendered permanently into the video\'s pixels — there is no separate text layer to edit. Soft subtitles (a switchable track, like the .srt files this chapter teaches you to upload) would have let you fix the same typo by editing and re-uploading just the subtitle file, with no re-export needed. This is exactly why the lesson defaults to soft subtitles wherever a platform supports them.|||VI: Phụ đề cứng (burn-in) được "in" vĩnh viễn vào pixel của video — không có lớp chữ riêng nào để sửa. Phụ đề mềm (một track bật/tắt được, như các file .srt chương này dạy bạn tải lên) sẽ cho phép sửa đúng lỗi chính tả đó bằng cách chỉnh và tải lại MỖI file phụ đề, không cần xuất lại video. Đây chính xác là lý do bài học mặc định dùng phụ đề mềm ở bất cứ đâu nền tảng hỗ trợ.',
          },
          {
            question: 'You have a Whisper-generated subtitle file saved as clip.srt. What do you need to do before uploading it as a subtitle track on YouTube?|||Bạn có một file phụ đề do Whisper sinh ra, lưu là clip.srt. Bạn cần làm gì trước khi tải nó lên làm track phụ đề trên YouTube?',
            options: [
              'Convert it to .docx first, since YouTube does not read .srt|||Chuyển nó sang .docx trước, vì YouTube không đọc .srt',
              'Manually retype every line into YouTube\'s caption editor|||Gõ tay lại từng dòng vào trình soạn phụ đề của YouTube',
              'Burn it into the video with ffmpeg first, since YouTube only accepts hard subtitles|||Burn-in nó vào video bằng ffmpeg trước, vì YouTube chỉ nhận phụ đề cứng',
              'Nothing format-related — YouTube officially supports .srt directly; just proofread it, then use YouTube Studio → Subtitles → Add language → Upload file → With timing|||Không cần đổi định dạng gì — YouTube hỗ trợ chính thức .srt trực tiếp; chỉ cần đọc soát, rồi dùng YouTube Studio → Subtitles → Add language → Upload file → With timing',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: YouTube\'s official supported-formats list confirms .srt directly (alongside .sbv, .vtt, and others) — no conversion needed. The real steps, confirmed against YouTube Help: YouTube Studio → Subtitles → select the video → ADD LANGUAGE → under Subtitles click ADD → Upload file → With timing (since a Whisper .srt already has timestamps) → choose the file → Save. Always proofread first, per Lesson 16.3 and 16.4 — auto-generated text, GPU-accelerated or not, still makes mistakes.|||VI: Danh sách định dạng hỗ trợ chính thức của YouTube xác nhận .srt trực tiếp (cùng .sbv, .vtt, và vài định dạng khác) — không cần đổi định dạng. Các bước thật, đã kiểm theo hướng dẫn YouTube: YouTube Studio → Subtitles → chọn video → ADD LANGUAGE → dưới mục Subtitles bấm ADD → Upload file → With timing (vì file .srt từ Whisper đã có mốc thời gian sẵn) → chọn file → Save. Luôn đọc soát trước, theo đúng Bài 16.3 và 16.4 — chữ tự sinh, dù chạy GPU hay không, vẫn có lỗi.',
          },
          {
            question: 'Your Whisper transcript includes full, confident sentences during a stretch of the video where music plays and nobody speaks. What setting most likely would have prevented this, and why?|||Bản chép lời Whisper của bạn có những câu đầy đủ, chắc chắn ngay ở đoạn video chỉ có nhạc và không ai nói. Cài đặt nào nhiều khả năng đã ngăn được điều này, và vì sao?',
            options: [
              'device="cuda" instead of CPU|||device="cuda" thay vì chạy CPU',
              'compute_type="float16" instead of a different precision|||compute_type="float16" thay vì một độ chính xác khác',
              'vad_filter=True — Voice Activity Detection filters out stretches with no speech, which is exactly what prevents Whisper from "hallucinating" invented sentences during silence or music|||vad_filter=True — Voice Activity Detection lọc bỏ đoạn không có tiếng nói, đúng thứ ngăn Whisper "bịa" ra câu trong khoảng lặng hoặc nhạc nền',
              'word_timestamps=True instead of segment-level timestamps|||word_timestamps=True thay vì canh thời gian theo đoạn',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: device, compute_type, and word_timestamps affect where the model runs, its precision/speed, and timing granularity — none of them stop hallucination. vad_filter=True specifically filters out audio stretches with no detected speech before they ever reach the transcription step, which is the documented fix for Whisper inventing text during silence or background music. It is not optional for real footage.|||VI: device, compute_type, và word_timestamps ảnh hưởng tới model chạy ở đâu, độ chính xác/tốc độ, và độ chi tiết canh thời gian — không cái nào chặn được việc bịa chữ. vad_filter=True cụ thể lọc bỏ những đoạn âm thanh không phát hiện tiếng nói trước khi chúng tới được bước chép lời, đúng cách sửa đã ghi nhận cho việc Whisper bịa chữ trong khoảng lặng hoặc nhạc nền. Nó không phải tuỳ chọn với cảnh quay thật.',
          },
        ],
      },
    },
  ],
};
