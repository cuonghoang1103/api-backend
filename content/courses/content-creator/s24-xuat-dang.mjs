/**
 * Content Creator — Chương 24: Xuất file & đăng tải. Song ngữ EN/VI (.ml-en / .ml-vi).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 */
import { gallery, slide } from './_slides.mjs';

const SLIDES = [
  [1, 'Bìa'],
  [2, 'Bản đồ chương'],
  [3, 'Khuyến nghị xuất của YouTube — container & video'],
  [4, 'Bitrate khuyến nghị — SDR & HDR'],
  [5, 'Chạy thật — xuất bằng ffmpeg đúng khuyến nghị, kiểm bằng ffprobe'],
  [6, 'Màn hình tải video lên YouTube Studio (minh hoạ)'],
  [7, 'Mô tả & khám phá — quy tắc đã kiểm'],
  [8, 'Đối tượng, minh bạch & lịch đăng'],
  [9, 'Quy trình đăng chéo sạch'],
  [10, 'TikTok · Facebook · Instagram — so sánh nhanh'],
  [11, 'UTM — đo đúng nền tảng nào kéo người về web'],
  [12, 'Nhạc có phép — bốn nguồn, bốn kiểu giấy phép'],
  [13, 'Content ID claim khác Copyright strike thế nào'],
  [14, '"Fair use" vs Luật Sở hữu trí tuệ Việt Nam'],
  [15, 'Bảng tra nhanh trước khi bấm Đăng'],
  [16, 'Thực hành'],
];

export default {
  title: 'Chapter 24 — Exporting & publishing|||Chương 24 — Xuất file & đăng tải',
  description: 'File dựng xong không tự thành video sống trên internet: chương này xuất đúng chuẩn YouTube (chạy thật bằng ffmpeg), đóng gói đúng thông tin khi đăng, đăng chéo sạch sang TikTok/Facebook/Instagram có đo được lượt về web, và biết luật chơi bản quyền trước khi bấm nút.',
  lessons: [
    /* ─────────────────── 24.0 slide bài giảng ─────────────────── */
    {
      title: '24.0 — Chapter 24 in 16 slides|||24.0 — Chương 24 trong 16 slide',
      slug: 'cr-24-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Toàn bộ chương gói trong 16 slide: thông số xuất khuyến nghị của YouTube, một lượt chạy ffmpeg thật, màn hình tải lên, quy trình đăng chéo, và bản đồ bản quyền.',
      content: `
<div class="ml-en"><h2>📑 Chapter 24 in 16 slides</h2>
<p>A finished edit is not yet a published video. This chapter closes the gap in three moves: export the file the way YouTube's own encoder actually wants it (slides 3–5, proven with a real &#96;ffmpeg&#96; run on this machine), fill in everything around the file that decides whether anyone finds it (slides 6–8), and get it in front of people on TikTok, Facebook and Instagram without looking like a lazy repost (slides 9–11) — then close with the legal side of the publish button (slides 12–14).</p>
<p>Two slides are worth a second look before you start: <strong>slide 5</strong> (a real encoder trap — a single flag turns "variable bitrate" into "constant bitrate" without any error message) and <strong>slide 10</strong> (what TikTok Studio and Meta Business Suite each actually do, side by side).</p></div>
<div class="ml-vi"><h2>📑 Chương 24 trong 16 slide</h2>
<p>Một bản dựng xong chưa phải là một video đã sống trên internet. Chương này lấp khoảng trống đó bằng ba việc: xuất file đúng thứ bộ mã hoá của YouTube thật sự muốn (slide 3–5, chứng minh bằng một lượt chạy &#96;ffmpeg&#96; thật trên máy này), điền đủ mọi thứ xung quanh cái file quyết định có ai tìm thấy nó không (slide 6–8), rồi đưa nó ra trước mặt người xem trên TikTok, Facebook, Instagram mà không trông như một bài đăng lại cẩu thả (slide 9–11) — và khép lại bằng mặt luật pháp của nút Đăng (slide 12–14).</p>
<p>Hai slide đáng nhìn kỹ trước khi học: <strong>slide 5</strong> (một cái bẫy có thật của bộ mã hoá — một cờ lệnh biến "bitrate biến đổi" thành "bitrate hằng số" mà không báo lỗi nào) và <strong>slide 10</strong> (TikTok Studio và Meta Business Suite thật sự làm được gì, đặt cạnh nhau).</p></div>
${gallery('cr-24', SLIDES)}
`,
    },

    /* ─────────────────── 24.1 xuất file chuẩn ─────────────────── */
    {
      title: '24.1 — Exporting the file YouTube actually wants|||24.1 — Xuất file đúng chuẩn YouTube muốn',
      slug: 'cr-24-1-xuat-file-chuan',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Thông số mã hoá khuyến nghị đầy đủ của YouTube (container, GOP, B-frame, CABAC, bitrate SDR/HDR), và một lượt xuất thật bằng ffmpeg — kiểm lại bằng ffprobe, kể cả bẫy VBR/CBR gặp phải thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 24 · Lesson 24.1</span>
<h2>The file survives editing. Now it has to survive the trip to YouTube's re-encoder.</h2>
<p class="lead">Lesson 12.4 already gave you a table of export numbers per platform — that table is still correct, and you do not need to relearn it. What this lesson adds is the WHY behind those numbers (YouTube publishes a much longer spec than "8 Mbps"), the HDR half of the table Lesson 12.4 did not cover, and a real command line that hits every one of YouTube's stated preferences at once — checked afterward with &#96;ffprobe&#96;, not trusted by eye.</p>

<h3>Why bother matching YouTube's own spec, if it re-encodes everything anyway?</h3>
<p>Every file you upload gets transcoded into several versions (different resolutions, different codecs for different devices) — your original upload is never what most viewers actually watch. So why match YouTube's encoding preferences at all? Because that first transcode is a translation, and a translation is only as good as the source: a source encoded the way YouTube's pipeline expects to read it wastes fewer decisions doing so. A file that violates the spec still uploads and still plays — nothing blocks it — but you are handing over a source that needs more guessing.</p>

<h3>The full spec, not just the bitrate number</h3>
${slide('cr-24', 3, 'Khuyến nghị xuất của YouTube — container & video')}
<p>Here is YouTube's own <strong>"Recommended upload encoding settings"</strong> page in full, not just the one number most guides quote:</p>
<div class="kv-grid">
<div class="kv"><span class="k">Container</span><span class="v">MP4, with the &#96;moov&#96; atom at the FRONT of the file — YouTube's own term for this is <strong>"Fast Start"</strong> — and no Edit Lists.</span></div>
<div class="kv"><span class="k">Video codec</span><span class="v">H.264, <strong>High Profile</strong>, progressive scan (no interlacing).</span></div>
<div class="kv"><span class="k">GOP</span><span class="v">Closed GOP (a Group of Pictures — the group of frames anchored to one keyframe — that never references a frame outside itself), length = half the frame rate.</span></div>
<div class="kv"><span class="k">B-frames</span><span class="v">2 consecutive B-frames (frames predicted from BOTH a past and a future frame — cheaper to store than a full image).</span></div>
<div class="kv"><span class="k">Entropy coding</span><span class="v">CABAC (Context-Adaptive Binary Arithmetic Coding) — a compression stage inside H.264 itself.</span></div>
<div class="kv"><span class="k">Bitrate mode</span><span class="v">Variable (VBR) — explicitly NOT constant (CBR).</span></div>
<div class="kv"><span class="k">Chroma subsampling</span><span class="v">4:2:0 (Chapter 5.4 already explained what chroma subsampling and 8-bit vs 10-bit mean).</span></div>
</div>
<p>Two things on that list should already feel familiar. <strong>Variable bitrate</strong> is exactly the idea Lesson 5.4 measured on your Pocket 3's own footage — a camera does not spend the same number of bits on a static talking-head shot as it does on moving leaves, and neither should your export. <strong>Closed GOP with a fixed length</strong> is what lets a platform cut a video into clean segments for adaptive streaming (different quality levels switching mid-playback) without any segment landing mid-way through a frame that depends on frames outside it.</p>

<h3>Bitrate — the half you have not seen yet</h3>
${slide('cr-24', 4, 'Bitrate khuyến nghị — SDR & HDR')}
<p>You already saw the SDR row of this table in Lesson 12.4. Here is the other half — <strong>HDR</strong>, the thing Lesson 5.4 explicitly promised to cover here:</p>
<table>
<tr><th>Resolution</th><th>SDR standard fps</th><th>SDR high fps</th><th>HDR standard fps</th><th>HDR high fps</th></tr>
<tr><td>1080p</td><td>8 Mbps</td><td>12 Mbps</td><td>10 Mbps</td><td>15 Mbps</td></tr>
<tr><td>4K (2160p)</td><td>35–45 Mbps</td><td>53–68 Mbps</td><td>44–56 Mbps</td><td>66–85 Mbps</td></tr>
</table>
<p>Audio, also from the same page: <strong>AAC-LC</strong> at <strong>48kHz</strong> — <strong>384 kbps</strong> for stereo, <strong>512 kbps</strong> for 5.1 surround.</p>
<p>Should you actually export HDR? For this course's default gear, almost never. Pocket 3 has no Dolby Vision mode at all, and Lesson 6's course default turns HDR Video OFF on the iPhone whenever it is cutting next to Pocket 3 footage — Lesson 5.4 covered exactly why (an un-graded colour mismatch between two cameras nobody warned you about). The HDR row above exists for the rare project you deliberately shoot end-to-end in HLG on a single camera and grade for it — not a default you reach for out of habit.</p>

<h3>Real &#96;ffmpeg&#96;, checked with real &#96;ffprobe&#96; — and a trap I actually hit</h3>
${slide('cr-24', 5, 'Chạy thật — xuất bằng ffmpeg đúng khuyến nghị, kiểm bằng ffprobe')}
<p>A command that touches every item on the spec above, at the 25fps this course defaults to — run exactly as printed on this machine's Homebrew ffmpeg 8.1.2 to produce the &#96;ffprobe&#96; output below. A synthetic 1080p25 test picture stands in for real footage and a 440Hz tone stands in for real audio, the same honest substitution Chapter 18 used for its own synthetic test clips — swap both for a real clip and a real voice track and every flag still applies:</p>
<pre><code class="language-bash">ffmpeg -f lavfi -i "testsrc2=size=1920x1080:rate=25:duration=6" \\
  -f lavfi -i "sine=frequency=440:sample_rate=48000:duration=6" \\
  -c:v libx264 -profile:v high -pix_fmt yuv420p \\
  -b:v 8M -maxrate 10M -bufsize 16M -bf 2 -g 12 \\
  -c:a aac -b:a 384k -ar 48000 -ac 2 \\
  -movflags +faststart xuat-youtube.mp4

ffprobe -v error -select_streams v:0 \\
  -show_entries stream=codec_name,profile,pix_fmt,r_frame_rate,bit_rate \\
  -of default=nw=1 xuat-youtube.mp4</code></pre>
<div class="out">codec_name=h264
profile=High
pix_fmt=yuv420p
r_frame_rate=25/1
bit_rate=8458561</div>
<p>Profile, chroma format, frame rate — all confirmed by the file itself, not assumed from the command line. Now the honest part. My FIRST attempt set &#96;-maxrate 8M&#96;, the exact same number as &#96;-b:v 8M&#96;. x264's own console log printed &#96;rc=cbr&#96; — constant bitrate, the opposite of what YouTube asks for — even though I never typed the word "constant" anywhere. Setting &#96;maxrate&#96; equal to the target bitrate collapses x264's rate control into a stricter, near-constant mode. Raising &#96;-maxrate&#96; ABOVE the target (10M against a target of 8M, the command above) is what actually produces genuine variable bitrate — confirmed by x264 printing &#96;rc=abr&#96; the second time, and by the measured output bouncing around 8.46 Mbps rather than sitting dead-flat at 8.00.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — &#96;maxrate&#96; equal to &#96;bitrate&#96; quietly turns VBR into CBR.</strong> No error, no warning in ffmpeg's own output — only x264's internal log says &#96;rc=cbr&#96; instead of &#96;rc=abr&#96;. If your export tool exposes a "maximum bitrate" field next to a "target bitrate" field, leave real headroom between them (roughly 20–25% higher, as done above) or you have silently asked for the opposite of what you intended.</p></div>
<p>One more real number worth knowing: I asked for &#96;-b:a 384k&#96; audio, but &#96;ffprobe&#96; measured the actual output at roughly 238 kbps. That is not a bug — it is the exact same variable-bitrate idea applied to audio. A pure test tone is the least demanding audio a codec will ever see; real speech and music will sit much closer to the 384 kbps ceiling. The number you asked for is a ceiling, not a promise — measure what actually got written, the same lesson Chapter 5.4 already taught about video bitrate.</p>
<p>Finally, the "Fast Start" claim from the spec table — proven, not assumed. YouTube's MP4 requirement is that the &#96;moov&#96; atom (the file's index — where every frame lives inside the file) sits BEFORE the &#96;mdat&#96; atom (the actual frame data). A quick byte-offset check on the exported file:</p>
<pre><code class="language-bash">grep -abo "moov" xuat-youtube.mp4 | head -1
grep -abo "mdat" xuat-youtube.mp4 | head -1</code></pre>
<div class="out">moov offset: 36
mdat offset: 5545</div>
<p>36 comes before 5,545 — &#96;moov&#96; genuinely sits at the front. &#96;-movflags +faststart&#96; is not a placebo flag; without it, ffmpeg writes &#96;moov&#96; LAST by default (after all the frame data), which is exactly what "Fast Start" exists to avoid.</p>

<p class="note-ct"><strong>Connects to next:</strong> the file is now correct. Lesson 24.2 is everything that surrounds it — title, description, chapters, and the disclosure toggles YouTube expects you to set honestly.</p>

<h3>🎬 Practice (20–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Run the exact command above on this machine (or your own), substituting a real short clip and a real audio track for the test sources.</li>
<li>Run both &#96;ffprobe&#96; checks — the stream check and the &#96;moov&#96;/&#96;mdat&#96; byte-offset check — on YOUR output file.</li>
<li>Deliberately set &#96;-maxrate&#96; equal to &#96;-b:v&#96; once, and confirm you see &#96;rc=cbr&#96; in the console log; then fix it and confirm &#96;rc=abr&#96; comes back.</li>
</ol><p><strong>Done when:</strong> your own &#96;ffprobe&#96; output shows &#96;profile=High&#96;, &#96;pix_fmt=yuv420p&#96;, the frame rate you actually shot at, and your &#96;moov&#96; offset is smaller than your &#96;mdat&#96; offset.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">GOP</span><span class="v">Group of Pictures — the run of frames anchored to one keyframe. "Closed" means it never reaches outside itself.</span></div>
<div class="kv"><span class="k">B-frame</span><span class="v">A frame predicted from both a past AND a future frame — cheaper to store than a full image.</span></div>
<div class="kv"><span class="k">CABAC</span><span class="v">Context-Adaptive Binary Arithmetic Coding — a compression stage built into H.264 itself.</span></div>
<div class="kv"><span class="k">Fast Start</span><span class="v">YouTube's term for the &#96;moov&#96; atom sitting at the front of an MP4 file, set with &#96;-movflags +faststart&#96;.</span></div>
<div class="kv"><span class="k">VBR / CBR</span><span class="v">Variable vs constant bitrate — VBR spends bits where a scene needs them; setting &#96;maxrate&#96; too close to the target silently produces CBR instead.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>YouTube's spec is more than a bitrate number: MP4 with Fast Start, H.264 High Profile, closed GOP at half the frame rate, 2 B-frames, CABAC, VBR, 4:2:0 chroma.</li>
<li>1080p SDR is 8/12 Mbps (standard/high fps, already seen in Lesson 12.4); HDR is 10/15 Mbps — new in this lesson, and rarely the right choice for this course's gear.</li>
<li>Setting &#96;-maxrate&#96; equal to &#96;-b:v&#96; silently produces CBR, not VBR — leave real headroom between them.</li>
<li>A requested audio bitrate is a ceiling, not a guarantee — simple content (or real content) can land well under it. Measure with &#96;ffprobe&#96;.</li>
<li>&#96;-movflags +faststart&#96; genuinely moves &#96;moov&#96; before &#96;mdat&#96; — provable with a two-line byte-offset check, not something to take on faith.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/1722171" target="_blank" rel="noopener">YouTube Help — Recommended upload encoding settings</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/7126552" target="_blank" rel="noopener">YouTube Help — Uploading HDR video</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 24 · Bài 24.1</span>
<h2>File đã sống sót qua khâu dựng. Giờ nó phải sống sót qua chuyến đi tới bộ mã hoá lại của YouTube.</h2>
<p class="lead">Bài 12.4 đã cho bạn một bảng số xuất theo từng nền tảng — bảng đó vẫn đúng, không cần học lại. Bài này thêm vào phần VÌ SAO đằng sau những con số đó (YouTube công bố một bản mô tả kỹ thuật dài hơn hẳn "8 Mbps"), nửa HDR mà Bài 12.4 chưa nói tới, và một dòng lệnh thật chạm đủ mọi thứ YouTube khuyến nghị cùng lúc — kiểm lại bằng &#96;ffprobe&#96; sau đó, không tin bằng mắt.</p>

<h3>Vì sao phải khớp đúng thông số của YouTube, nếu nó mã hoá lại mọi thứ?</h3>
<p>Mọi file bạn tải lên đều bị chuyển mã thành nhiều bản khác nhau (nhiều độ phân giải, nhiều codec cho nhiều thiết bị) — bản gốc bạn tải lên gần như không phải thứ đa số người xem thật sự xem. Vậy sao còn phải khớp đúng khuyến nghị của YouTube? Vì lượt chuyển mã đầu tiên đó là một bản dịch, và một bản dịch chỉ tốt bằng nguồn của nó: nguồn được mã hoá đúng cách hệ thống của YouTube mong đợi thì tốn ít lần "đoán" hơn khi dịch. File vi phạm thông số vẫn tải lên được, vẫn phát được — không có gì chặn nó — nhưng bạn đang giao một nguồn cần đoán nhiều hơn.</p>

<h3>Bản mô tả đầy đủ, không chỉ một con số bitrate</h3>
${slide('cr-24', 3, 'Khuyến nghị xuất của YouTube — container & video')}
<p>Đây là toàn bộ trang <strong>"Recommended upload encoding settings"</strong> của chính YouTube, không chỉ một con số hay được trích:</p>
<div class="kv-grid">
<div class="kv"><span class="k">Container</span><span class="v">MP4, với atom &#96;moov&#96; nằm ở ĐẦU file — chính YouTube gọi đây là <strong>"Fast Start"</strong> — và không có Edit List.</span></div>
<div class="kv"><span class="k">Video codec</span><span class="v">H.264, <strong>High Profile</strong>, quét liên tục (không xen kẽ dòng).</span></div>
<div class="kv"><span class="k">GOP</span><span class="v">Đóng (closed GOP — nhóm khung hình neo vào một keyframe, không bao giờ tham chiếu ra ngoài chính nó), độ dài = một nửa fps.</span></div>
<div class="kv"><span class="k">B-frame</span><span class="v">2 khung liên tiếp (khung được dự đoán từ CẢ khung trước lẫn khung sau — rẻ hơn lưu một ảnh trọn vẹn).</span></div>
<div class="kv"><span class="k">Entropy coding</span><span class="v">CABAC — một tầng nén nằm ngay bên trong chuẩn H.264.</span></div>
<div class="kv"><span class="k">Chế độ bitrate</span><span class="v">Biến đổi (VBR) — nói RÕ là KHÔNG phải hằng số (CBR).</span></div>
<div class="kv"><span class="k">Chroma subsampling</span><span class="v">4:2:0 (Bài 5.4 đã giải thích chroma subsampling và 8-bit vs 10-bit nghĩa là gì).</span></div>
</div>
<p>Hai điều trong danh sách đó chắc đã quen. <strong>Bitrate biến đổi</strong> chính là ý Bài 5.4 đã đo thật trên cảnh quay Pocket 3 của bạn — máy quay không tốn số bit như nhau cho một cảnh nói chuyện đứng yên và một cảnh lá cây lay động, và bản xuất của bạn cũng nên vậy. <strong>GOP đóng, độ dài cố định</strong> là thứ cho phép một nền tảng cắt video thành các đoạn sạch để streaming thích ứng (nhiều mức chất lượng chuyển đổi giữa chừng) mà không đoạn nào rơi vào giữa một khung phụ thuộc khung ngoài nó.</p>

<h3>Bitrate — nửa bạn chưa thấy</h3>
${slide('cr-24', 4, 'Bitrate khuyến nghị — SDR & HDR')}
<p>Bạn đã thấy hàng SDR của bảng này ở Bài 12.4. Đây là nửa còn lại — <strong>HDR</strong>, thứ Bài 5.4 đã hẹn sẽ nói ở đây:</p>
<table>
<tr><th>Độ phân giải</th><th>SDR chuẩn</th><th>SDR cao (48–60fps)</th><th>HDR chuẩn</th><th>HDR cao (48–60fps)</th></tr>
<tr><td>1080p</td><td>8 Mbps</td><td>12 Mbps</td><td>10 Mbps</td><td>15 Mbps</td></tr>
<tr><td>4K (2160p)</td><td>35–45 Mbps</td><td>53–68 Mbps</td><td>44–56 Mbps</td><td>66–85 Mbps</td></tr>
</table>
<p>Âm thanh, cùng nguồn: <strong>AAC-LC</strong> ở <strong>48kHz</strong> — <strong>384 kbps</strong> cho stereo, <strong>512 kbps</strong> cho 5.1 surround.</p>
<p>Vậy có nên thật sự xuất HDR? Với đồ nghề mặc định của khoá này, gần như không bao giờ. Pocket 3 không có chế độ Dolby Vision nào cả, và mặc định của Bài 6 đã TẮT HDR Video trên iPhone bất cứ khi nào nó được dựng cạnh cảnh quay Pocket 3 — Bài 5.4 đã nói rõ vì sao (một lệch màu chưa qua chỉnh mà không máy nào cảnh báo bạn trước). Hàng HDR ở trên tồn tại cho dự án hiếm hoi bạn CHỦ ĐÍCH quay trọn vẹn bằng HLG trên một máy duy nhất và chỉnh màu cho nó — không phải một mặc định bạn dùng theo thói quen.</p>

<h3>ffmpeg thật, kiểm bằng ffprobe thật — và một cái bẫy tôi thật sự gặp phải</h3>
${slide('cr-24', 5, 'Chạy thật — xuất bằng ffmpeg đúng khuyến nghị, kiểm bằng ffprobe')}
<p>Một lệnh chạm đủ mọi mục trong bản mô tả ở trên, ở 25fps mặc định của khoá này — chạy đúng như in ra đây, trên bản ffmpeg 8.1.2 cài bằng Homebrew của máy này, để ra đúng output &#96;ffprobe&#96; bên dưới. Một hình thử 1080p25 tổng hợp đứng thay cho cảnh quay thật và một tiếng tone 440Hz đứng thay cho âm thanh thật — đúng kiểu thay thế trung thực Chương 18 đã dùng cho clip thử tổng hợp của chính nó — đổi cả hai sang một clip thật và một track giọng nói thật thì mọi cờ lệnh vẫn áp dụng y hệt:</p>
<pre><code class="language-bash">ffmpeg -f lavfi -i "testsrc2=size=1920x1080:rate=25:duration=6" \\
  -f lavfi -i "sine=frequency=440:sample_rate=48000:duration=6" \\
  -c:v libx264 -profile:v high -pix_fmt yuv420p \\
  -b:v 8M -maxrate 10M -bufsize 16M -bf 2 -g 12 \\
  -c:a aac -b:a 384k -ar 48000 -ac 2 \\
  -movflags +faststart xuat-youtube.mp4

ffprobe -v error -select_streams v:0 \\
  -show_entries stream=codec_name,profile,pix_fmt,r_frame_rate,bit_rate \\
  -of default=nw=1 xuat-youtube.mp4</code></pre>
<div class="out">codec_name=h264
profile=High
pix_fmt=yuv420p
r_frame_rate=25/1
bit_rate=8458561</div>
<p>Profile, định dạng màu, khung hình/giây — tất cả được chính file xác nhận, không phải suy từ dòng lệnh. Giờ tới phần thật lòng. Lượt chạy ĐẦU TIÊN của tôi đặt &#96;-maxrate 8M&#96;, đúng bằng &#96;-b:v 8M&#96;. Log của chính x264 in ra &#96;rc=cbr&#96; — bitrate HẰNG SỐ, ngược hẳn với thứ YouTube yêu cầu — dù tôi chưa từng gõ chữ "hằng số" ở đâu cả. Đặt &#96;maxrate&#96; bằng đúng bitrate mục tiêu làm chế độ kiểm soát tốc độ của x264 tự co về gần như hằng số. Nâng &#96;-maxrate&#96; lên TRÊN mức mục tiêu (10M so với mục tiêu 8M, đúng lệnh ở trên) mới thật sự ra bitrate biến đổi — xác nhận bằng việc x264 in &#96;rc=abr&#96; ở lượt hai, và bitrate đo được dao động quanh 8,46 Mbps thay vì nằm phẳng đúng 8,00.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — &#96;maxrate&#96; bằng &#96;bitrate&#96; âm thầm biến VBR thành CBR.</strong> Không lỗi, không cảnh báo nào trong output của chính ffmpeg — chỉ log nội bộ của x264 ghi &#96;rc=cbr&#96; thay vì &#96;rc=abr&#96;. Nếu công cụ xuất của bạn có ô "bitrate tối đa" cạnh ô "bitrate mục tiêu", chừa khoảng cách thật giữa hai số (khoảng 20–25% cao hơn, như lệnh ở trên) — không thì bạn đã âm thầm xin đúng thứ ngược lại với ý định.</p></div>
<p>Một con số thật khác đáng biết: tôi xin &#96;-b:a 384k&#96; cho âm thanh, nhưng &#96;ffprobe&#96; đo được output thật chỉ khoảng 238 kbps. Đây không phải lỗi — đó chính là ý tưởng bitrate biến đổi áp cho âm thanh. Một tiếng tone thử là loại âm thanh ít đòi hỏi nhất một codec từng gặp; giọng nói và nhạc thật sẽ nằm gần trần 384 kbps hơn nhiều. Con số bạn yêu cầu là một cái TRẦN, không phải một lời hứa — đo lại thứ thật sự được ghi, đúng bài học Chương 5.4 đã dạy về bitrate video.</p>
<p>Cuối cùng, lời khẳng định "Fast Start" trong bảng thông số — được chứng minh, không mặc định đúng. Yêu cầu MP4 của YouTube là atom &#96;moov&#96; (mục lục của file — chỗ mọi khung hình nằm bên trong file) phải đứng TRƯỚC atom &#96;mdat&#96; (dữ liệu khung hình thật). Kiểm nhanh bằng offset byte trên chính file vừa xuất:</p>
<pre><code class="language-bash">grep -abo "moov" xuat-youtube.mp4 | head -1
grep -abo "mdat" xuat-youtube.mp4 | head -1</code></pre>
<div class="out">moov offset: 36
mdat offset: 5545</div>
<p>36 đứng trước 5.545 — &#96;moov&#96; thật sự nằm ở đầu. &#96;-movflags +faststart&#96; không phải một cờ lệnh trang trí; thiếu nó, ffmpeg mặc định ghi &#96;moov&#96; SAU CÙNG (sau toàn bộ dữ liệu khung hình) — đúng thứ "Fast Start" sinh ra để tránh.</p>

<p class="note-ct"><strong>Nối với bài sau:</strong> file giờ đã đúng chuẩn. Bài 24.2 là mọi thứ bao quanh nó — tiêu đề, mô tả, chapters, và các công tắc công bố mà YouTube mong bạn bật trung thực.</p>

<h3>🎬 Thực hành (20–30 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy đúng lệnh ở trên trên máy của bạn (hoặc máy này), thay clip thử và âm thanh thử bằng một clip và một track thật.</li>
<li>Chạy cả hai phép kiểm &#96;ffprobe&#96; — kiểm stream và kiểm offset byte &#96;moov&#96;/&#96;mdat&#96; — trên chính file của bạn.</li>
<li>Cố tình đặt &#96;-maxrate&#96; bằng &#96;-b:v&#96; một lần, xác nhận thấy &#96;rc=cbr&#96; trong log; rồi sửa lại và xác nhận &#96;rc=abr&#96; quay lại.</li>
</ol><p><strong>Đạt khi:</strong> output &#96;ffprobe&#96; của chính bạn cho thấy &#96;profile=High&#96;, &#96;pix_fmt=yuv420p&#96;, đúng khung hình/giây bạn đã quay, và offset &#96;moov&#96; nhỏ hơn offset &#96;mdat&#96;.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">GOP</span><span class="v">Group of Pictures — chuỗi khung hình neo vào một keyframe. "Đóng" nghĩa là không bao giờ vươn ra ngoài chính nó.</span></div>
<div class="kv"><span class="k">B-frame</span><span class="v">Khung được dự đoán từ CẢ khung trước LẪN khung sau — rẻ hơn lưu một ảnh trọn vẹn.</span></div>
<div class="kv"><span class="k">CABAC</span><span class="v">Context-Adaptive Binary Arithmetic Coding — một tầng nén nằm ngay trong chuẩn H.264.</span></div>
<div class="kv"><span class="k">Fast Start</span><span class="v">Cách YouTube gọi việc atom &#96;moov&#96; nằm ở đầu file MP4, đặt bằng &#96;-movflags +faststart&#96;.</span></div>
<div class="kv"><span class="k">VBR / CBR</span><span class="v">Bitrate biến đổi vs hằng số — VBR tốn bit đúng chỗ cảnh cần; đặt &#96;maxrate&#96; quá sát mục tiêu âm thầm ra CBR.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Thông số của YouTube nhiều hơn một con số bitrate: MP4 có Fast Start, H.264 High Profile, GOP đóng dài bằng nửa fps, 2 B-frame, CABAC, VBR, chroma 4:2:0.</li>
<li>1080p SDR là 8/12 Mbps (chuẩn/cao, đã thấy ở Bài 12.4); HDR là 10/15 Mbps — mới ở bài này, và hiếm khi là lựa chọn đúng cho đồ nghề của khoá.</li>
<li>Đặt &#96;-maxrate&#96; bằng &#96;-b:v&#96; âm thầm ra CBR chứ không phải VBR — chừa khoảng cách thật giữa hai số.</li>
<li>Bitrate âm thanh yêu cầu là một cái trần, không phải lời hứa — nội dung đơn giản (hoặc nội dung thật) có thể nằm dưới trần rất xa. Đo lại bằng &#96;ffprobe&#96;.</li>
<li>&#96;-movflags +faststart&#96; thật sự đưa &#96;moov&#96; lên trước &#96;mdat&#96; — chứng minh được bằng hai dòng lệnh kiểm offset byte, không cần tin suông.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/1722171" target="_blank" rel="noopener">YouTube Help — Thông số mã hoá khuyến nghị khi tải lên</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/7126552" target="_blank" rel="noopener">YouTube Help — Tải video HDR lên</a></div>
</div>
`,
    },

    /* ─────────────────── 24.2 đăng YouTube chuẩn SEO ─────────────────── */
    {
      title: '24.2 — Publishing to YouTube: everything around the file|||24.2 — Đăng lên YouTube: mọi thứ quanh cái file',
      slug: 'cr-24-2-dang-youtube-seo',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Mô tả, chapters, tag/hashtag, danh mục, playlist, và các công tắc minh bạch bắt buộc: made for kids, quảng cáo trả phí, nội dung bị thay đổi/tổng hợp — đúng quy tắc đã kiểm của YouTube.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 24 · Lesson 24.2</span>
<h2>A correctly-encoded file with no description is still an unfindable video</h2>
<p class="lead">Lesson 24.1 got the bytes right. This lesson is everything typed and toggled around those bytes on the upload screen — most of it mechanical, three of it legally required when they apply to you. Writing a genuinely good TITLE is its own skill with its own chapter (Chapter 25) — this lesson covers the mechanics: length limits, where the algorithm cuts, and the switches most creators never open.</p>

<h3>The upload screen, region by region</h3>
${slide('cr-24', 6, 'Màn hình tải video lên YouTube Studio (minh hoạ)')}
<p>This is a wireframe — a diagram of WHERE things live, not a screenshot of the real interface, since Studio's exact layout shifts between updates. Title stays under roughly 100 characters, with whatever matters most in the first 60 (many devices truncate past that in search results). The description box does three separate jobs at once, covered below. Thumbnail, playlist and subtitles sit in their own panel — subtitles in particular need nothing new here: you already uploaded your VI/EN &#96;.srt&#96; files in Lesson 16.3's YouTube Studio → Subtitles flow, and they simply show up attached to this same video.</p>

<h3>The description's three jobs</h3>
${slide('cr-24', 7, 'Mô tả & khám phá — quy tắc đã kiểm')}
<p>The first two lines are what a search results page actually shows before a viewer clicks "more" — write them as if nothing after line two exists. Put your cuongthai.com link early, not buried at the bottom under five paragraphs. Then, if the video genuinely has distinct sections, add <strong>chapters</strong>: a list of timestamps and titles, one per line. YouTube's own rules are specific, not a suggestion: the FIRST timestamp must be &#96;00:00&#96;, you need AT LEAST three timestamps in ascending order, and each chapter must be AT LEAST 10 seconds long. Miss any one of those three conditions and YouTube silently ignores the whole list — no error, just no chapter bar under the player.</p>
<p><strong>Tags</strong>, confirmed directly on YouTube's own help page, play a genuinely minor role: "title, thumbnail and description are more important pieces of metadata," and tags mainly help when your content covers something commonly misspelled. Piling on dozens of tags is not a harmless habit either — YouTube's own policy classes excessive tagging as spam. <strong>Hashtags</strong> you already know from Lesson 1.2: put a &#96;#&#96; in the title or description, up to three of the most relevant ones show near your title, and more than 60 hashtags on one video means YouTube ignores every single one.</p>

<h3>Three switches that are legal disclosures, not SEO settings</h3>
${slide('cr-24', 8, 'Đối tượng, minh bạch & lịch đăng')}
<p><strong>Made for kids</strong> is not optional styling — YouTube states plainly that setting it accurately is the creator's legal responsibility under COPPA and similar laws, at the channel level or per video. Get it right and a whole set of features gets disabled on that content: comments, autoplay on home, live chat, personalized advertising, channel memberships, Super Chat/Stickers, cards, end screens, the notification bell, and the donate button. That is not a bug list — it is what compliance with children's-privacy law actually costs in features, and it is worth knowing BEFORE you are surprised by a disabled comment section.</p>
<p><strong>Paid promotion</strong>: if a video includes branded content, a sponsorship, or any other paid commercial relationship, YouTube's upload flow has a dedicated toggle — Studio's own path is Upload → Show more → Paid Promotion → "Yes, my video includes branded content." Turning it on adds a disclosure label at the very start of the video. This is a returning topic: Lesson 24.4 covers what actually counts as a "paid relationship" worth disclosing in the first place.</p>
<p><strong>Altered or synthetic content</strong> you have already learned properly, in Lesson 19.1 — the policy targets AI-generated or altered content realistic enough to mislead a viewer about something real, and YouTube's own listed example of something that does NOT need this disclosure is ordinary green-screen VFX ("someone floating in space"). Nothing new to relearn here; the toggle for it simply lives on this same upload screen, next to Paid Promotion and Made for Kids.</p>

<h3>Cards, end screens, and scheduling — the parts still new</h3>
<p><strong>Cards</strong> are new territory: up to 5 per video, each one a video, playlist, channel, or (only with Partner Program access) an external link — and, consistent with the theme above, cards are not available at all on videos marked made for kids. <strong>End screens</strong> you built the actual motion graphic for back in Lesson 19.1 — the mechanical rule to remember here is just that the video needs to be at least 25 seconds long before the feature turns on at all. For timing the publish itself, YouTube supports both a plain <strong>scheduled publish time</strong> and a <strong>Premiere</strong> (a scheduled premiere with a live countdown and chat) — Premieres specifically do not support Shorts, 360°/VR180 video, or any resolution above 1080p.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — treating "Made for kids" as a checkbox you can leave at the default and move on.</strong> The default is not always "no," it depends on your account history, and getting it wrong is not a cosmetic mistake — it is a compliance question YouTube explicitly puts on you, the creator, not on them. When in doubt about a specific video, check YouTube's own criteria page rather than guessing.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> the video is live on YouTube. Lesson 24.3 gets the SAME footage in front of people on TikTok, Facebook and Instagram — different upload screens, different rules, and a way to measure which one actually sends people to your site.</p>

<h3>🎬 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
<li>Open YouTube Studio on any existing video (even an unlisted test upload) and locate all three toggles from this lesson: Made for Kids, Paid Promotion, Altered/Synthetic content.</li>
<li>Write a real description for one video: two lines that work as search-result copy, your cuongthai.com link, and — if the video has 3+ natural sections at least 10 seconds each — a real chapter list starting at 00:00.</li>
<li>Count your hashtags on that description. If you already have some from habit, confirm the total is nowhere near 60.</li>
</ol><p><strong>Done when:</strong> you can point at the exact menu location of all three disclosure toggles without searching for them, and your chapter list (if you added one) follows all three rules — 00:00 first, 3+ timestamps, 10+ seconds each.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Chapters</span><span class="v">A timestamp list in the description that splits a video into a navigable bar — requires 00:00 first, 3+ timestamps, 10+ seconds each.</span></div>
<div class="kv"><span class="k">Made for kids</span><span class="v">A legally required per-video/per-channel audience setting under COPPA-style law — disables comments, personalized ads, cards, end screens and more.</span></div>
<div class="kv"><span class="k">Paid promotion</span><span class="v">The disclosure toggle for branded content or sponsorships — adds a label at the start of the video.</span></div>
<div class="kv"><span class="k">Cards</span><span class="v">Up to 5 clickable overlays per video — video, playlist, channel, or link (Partner Program only).</span></div>
<div class="kv"><span class="k">Premiere</span><span class="v">A scheduled release with a live countdown and chat — unavailable for Shorts, 360°/VR180, or above 1080p.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Title and description's first two lines do the discovery work; chapters need 00:00 first, 3+ timestamps, 10+ seconds each or YouTube silently drops the whole list.</li>
<li>Tags matter little except for misspellings; more than 60 hashtags gets every hashtag on the video ignored.</li>
<li>Made for kids, Paid promotion and Altered/synthetic content are legal disclosures, not SEO knobs — get them honest, not optimized.</li>
<li>Cards (max 5) and end screens (Lesson 19.1) both go dark on made-for-kids videos; Premieres do not support Shorts, 360°/VR180 or above 1080p.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/9884579" target="_blank" rel="noopener">YouTube Help — Add chapters to videos</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/146402" target="_blank" rel="noopener">YouTube Help — Add tags to your videos</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/9527654" target="_blank" rel="noopener">YouTube Help — Set your channel or video's audience</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/154235" target="_blank" rel="noopener">YouTube Help — Add paid promotion disclosures</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/6140493" target="_blank" rel="noopener">YouTube Help — Add cards to your videos</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 24 · Bài 24.2</span>
<h2>Một file mã hoá đúng chuẩn mà không có mô tả thì vẫn là một video không ai tìm thấy</h2>
<p class="lead">Bài 24.1 đã lo đúng phần byte. Bài này là mọi thứ được gõ và bật quanh những byte đó trên màn hình tải lên — phần lớn là thao tác máy móc, ba trong số đó là bắt buộc về pháp lý khi áp dụng cho bạn. Viết một TIÊU ĐỀ thật sự hay là một kỹ năng riêng có cả một chương riêng (Chương 25) — bài này chỉ nói phần cơ học: giới hạn độ dài, chỗ thuật toán cắt, và những công tắc phần lớn creator chưa từng mở ra xem.</p>

<h3>Màn hình tải lên, từng vùng một</h3>
${slide('cr-24', 6, 'Màn hình tải video lên YouTube Studio (minh hoạ)')}
<p>Đây là một wireframe — sơ đồ CHỖ mọi thứ nằm, không phải ảnh chụp giao diện thật, vì bố cục thật của Studio đổi qua từng đợt cập nhật. Tiêu đề nên dưới khoảng 100 ký tự, với thứ quan trọng nhất nằm trong 60 ký tự đầu (nhiều thiết bị cắt bớt phần sau đó trong kết quả tìm kiếm). Ô mô tả làm ba việc cùng lúc, nói bên dưới. Thumbnail, playlist và phụ đề nằm ở bảng riêng — phụ đề đặc biệt không cần làm gì mới ở đây: bạn đã tải file &#96;.srt&#96; VI/EN lên theo đúng quy trình YouTube Studio → Subtitles ở Bài 16.3, và chúng tự hiện gắn sẵn vào đúng video này.</p>

<h3>Ba việc của ô mô tả</h3>
${slide('cr-24', 7, 'Mô tả & khám phá — quy tắc đã kiểm')}
<p>Hai dòng đầu là thứ trang kết quả tìm kiếm thật sự hiện ra trước khi người xem bấm "thêm" — viết như thể không có gì sau dòng hai tồn tại. Đặt link cuongthai.com sớm, đừng chôn ở đáy dưới năm đoạn văn. Rồi, nếu video thật sự có các đoạn tách biệt, thêm <strong>chapters</strong>: một danh sách mốc thời gian và tiêu đề, mỗi dòng một mốc. Quy tắc của chính YouTube rất cụ thể, không phải gợi ý suông: mốc ĐẦU TIÊN phải là &#96;00:00&#96;, cần ÍT NHẤT ba mốc tăng dần, và mỗi đoạn phải dài ÍT NHẤT 10 giây. Thiếu một trong ba điều kiện đó, YouTube âm thầm bỏ qua cả danh sách — không báo lỗi, chỉ đơn giản không có thanh chương dưới trình phát.</p>
<p><strong>Thẻ tag</strong>, đã kiểm trực tiếp trên trang trợ giúp của chính YouTube, đóng vai trò thật sự nhỏ: "tiêu đề, thumbnail và mô tả là những thông tin quan trọng hơn," và tag chủ yếu có ích khi nội dung của bạn liên quan tới thứ hay bị viết sai chính tả. Nhồi hàng chục tag cũng không phải thói quen vô hại — chính sách của YouTube xếp việc nhồi tag quá mức vào nhóm spam. <strong>Hashtag</strong> bạn đã biết từ Bài 1.2: gõ &#96;#&#96; trong tiêu đề hoặc mô tả, tối đa ba hashtag liên quan nhất hiện gần tiêu đề, và hơn 60 hashtag trên một video thì YouTube bỏ qua tất cả.</p>

<h3>Ba công tắc là công bố pháp lý, không phải cài đặt SEO</h3>
${slide('cr-24', 8, 'Đối tượng, minh bạch & lịch đăng')}
<p><strong>Made for kids</strong> không phải trang trí tuỳ chọn — chính YouTube nói rõ đặt đúng đối tượng là trách nhiệm PHÁP LÝ của creator theo COPPA và các luật tương tự, ở cấp kênh hoặc từng video. Đặt đúng thì một loạt tính năng bị tắt trên nội dung đó: bình luận, tự phát trên trang chủ, live chat, quảng cáo cá nhân hoá, Channel Memberships, Super Chat/Stickers, cards, end screen, nút thông báo, và nút quyên góp. Đây không phải một danh sách lỗi — đó là cái giá thật của việc tuân thủ luật riêng tư trẻ em tính bằng tính năng, và đáng biết TRƯỚC khi bạn bất ngờ thấy khung bình luận bị tắt.</p>
<p><strong>Quảng cáo trả phí</strong>: nếu video có nội dung được tài trợ, hợp tác nhãn hàng, hoặc bất kỳ quan hệ thương mại trả phí nào khác, luồng tải lên của YouTube có một công tắc riêng — đường đi trong Studio là Upload → Show more → Paid Promotion → "Yes, my video includes branded content." Bật nó gắn một nhãn công bố ngay đầu video. Đây là chủ đề sẽ quay lại: Bài 24.4 nói rõ hơn thế nào mới thật sự tính là một "quan hệ trả phí" đáng công bố ngay từ đầu.</p>
<p><strong>Nội dung bị thay đổi hoặc tổng hợp</strong> bạn đã học đúng bài, ở Bài 19.1 — chính sách nhắm vào nội dung do AI tạo ra hoặc thay đổi đủ chân thực để đánh lừa người xem về một điều CÓ THẬT, và ví dụ chính thức của YouTube về thứ KHÔNG cần công bố này là VFX phông xanh thông thường ("ai đó lơ lửng ngoài vũ trụ"). Không có gì mới cần học lại ở đây; công tắc cho nó chỉ đơn giản nằm ngay trên cùng màn hình tải lên này, cạnh Paid Promotion và Made for Kids.</p>

<h3>Cards, end screen, và lên lịch — phần còn mới</h3>
<p><strong>Cards</strong> là địa hạt mới: tối đa 5 thẻ mỗi video, mỗi thẻ là một video, playlist, kênh, hoặc (chỉ khi có quyền Partner Program) một link ngoài — và, đúng chủ đề ở trên, cards hoàn toàn không dùng được trên video đặt made for kids. <strong>End screen</strong> bạn đã tự dựng đồ hoạ chuyển động cho nó từ Bài 19.1 — quy tắc máy móc cần nhớ ở đây chỉ là video phải dài ít nhất 25 giây thì tính năng mới bật được. Về thời điểm đăng, YouTube hỗ trợ cả <strong>hẹn giờ đăng</strong> thông thường lẫn <strong>Premiere</strong> (một buổi ra mắt hẹn giờ có đếm ngược và chat trực tiếp) — Premiere cụ thể KHÔNG hỗ trợ Shorts, video 360°/VR180, hay bất kỳ độ phân giải nào trên 1080p.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — coi "Made for kids" là một ô tick để mặc định rồi đi tiếp.</strong> Mặc định không phải lúc nào cũng là "không," nó tuỳ lịch sử tài khoản của bạn, và đặt sai không phải lỗi thẩm mỹ — đó là câu hỏi tuân thủ mà chính YouTube đặt thẳng lên vai bạn, creator, chứ không phải họ. Khi nghi ngờ về một video cụ thể, kiểm trang tiêu chí chính thức của YouTube thay vì đoán.</p></div>

<p class="note-ct"><strong>Nối với bài sau:</strong> video đã sống trên YouTube. Bài 24.3 đưa CHÍNH cảnh quay đó ra trước mặt người xem trên TikTok, Facebook, Instagram — màn hình tải lên khác, luật khác, và một cách đo xem nền tảng nào thật sự kéo người về web của bạn.</p>

<h3>🎬 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Mở YouTube Studio trên một video bất kỳ đã có (kể cả một video thử ở chế độ không công khai) và tìm cả ba công tắc trong bài này: Made for Kids, Paid Promotion, Altered/Synthetic content.</li>
<li>Viết mô tả thật cho một video: hai dòng đủ sức làm nội dung kết quả tìm kiếm, link cuongthai.com, và — nếu video có ≥3 đoạn tự nhiên mỗi đoạn ≥10 giây — một danh sách chương thật bắt đầu từ 00:00.</li>
<li>Đếm hashtag trong mô tả đó. Nếu bạn đã có sẵn vài cái theo thói quen, xác nhận tổng còn cách rất xa con số 60.</li>
</ol><p><strong>Đạt khi:</strong> bạn chỉ đúng vị trí menu của cả ba công tắc công bố mà không cần tìm kiếm, và danh sách chương của bạn (nếu có thêm) tuân đủ ba quy tắc — 00:00 đầu tiên, ≥3 mốc, mỗi đoạn ≥10 giây.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Chapters</span><span class="v">Danh sách mốc thời gian trong mô tả, chia video thành thanh điều hướng — cần 00:00 đầu tiên, ≥3 mốc, mỗi đoạn ≥10 giây.</span></div>
<div class="kv"><span class="k">Made for kids</span><span class="v">Cài đặt đối tượng bắt buộc về pháp lý theo từng video/kênh dưới luật kiểu COPPA — tắt bình luận, quảng cáo cá nhân hoá, cards, end screen và hơn thế.</span></div>
<div class="kv"><span class="k">Paid promotion</span><span class="v">Công tắc công bố cho nội dung được tài trợ/hợp tác nhãn hàng — gắn nhãn ngay đầu video.</span></div>
<div class="kv"><span class="k">Cards</span><span class="v">Tối đa 5 lớp phủ bấm được mỗi video — video, playlist, kênh, hoặc link (chỉ khi có Partner Program).</span></div>
<div class="kv"><span class="k">Premiere</span><span class="v">Một buổi ra mắt hẹn giờ có đếm ngược và chat trực tiếp — không dùng được cho Shorts, 360°/VR180, hay trên 1080p.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tiêu đề và hai dòng đầu của mô tả làm việc khám phá; chapters cần 00:00 đầu tiên, ≥3 mốc, mỗi đoạn ≥10 giây — thiếu là YouTube âm thầm bỏ cả danh sách.</li>
<li>Tag có tác dụng ít, trừ khi chống viết sai chính tả; hơn 60 hashtag thì mọi hashtag trên video bị bỏ qua.</li>
<li>Made for kids, Quảng cáo trả phí, và Nội dung bị thay đổi/tổng hợp là công bố pháp lý, không phải núm vặn SEO — đặt cho trung thực, không phải để tối ưu.</li>
<li>Cards (tối đa 5) và end screen (Bài 19.1) đều tắt trên video made-for-kids; Premiere không hỗ trợ Shorts, 360°/VR180 hay trên 1080p.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/9884579" target="_blank" rel="noopener">YouTube Help — Thêm chapters vào video</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/146402" target="_blank" rel="noopener">YouTube Help — Thêm tag cho video</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/9527654" target="_blank" rel="noopener">YouTube Help — Đặt đối tượng cho kênh/video</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/154235" target="_blank" rel="noopener">YouTube Help — Công bố quảng cáo trả phí</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/6140493" target="_blank" rel="noopener">YouTube Help — Thêm cards vào video</a></div>
</div>
`,
    },

    /* ─────────────────── 24.3 TikTok, Facebook, Instagram ─────────────────── */
    {
      title: '24.3 — TikTok, Facebook, Instagram: publishing beyond YouTube|||24.3 — TikTok, Facebook, Instagram: đăng ngoài YouTube',
      slug: 'cr-24-3-dang-tiktok-facebook-instagram',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Chế độ chuyên nghiệp Facebook, collab post & ảnh bìa Reels Instagram, lên lịch bằng Meta Business Suite và TikTok Studio, và UTM để đo đúng nền tảng nào kéo người về cuongthai.com.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 24 · Lesson 24.3</span>
<h2>The same edit, three more places to be careless about</h2>
<p class="lead">Lesson 20.4 already taught the mechanics of a clean cross-post: Watermark set to Remove on every single export, a separate description per destination instead of one caption copy-pasted everywhere, and the "Related video" link that bridges a Shorts clip back to a long-form video. That still stands. This lesson covers what Lesson 20.4 did not: the account-level choices on Facebook and Instagram, how to actually schedule a post instead of publishing live every time, and a link format that tells you — in numbers, not guessing — which platform is actually sending people to cuongthai.com.</p>

<h3>The clean cross-post, once more, as one picture</h3>
${slide('cr-24', 9, 'Quy trình đăng chéo sạch')}
<p>Five steps, in order: a genuinely clean master export (Watermark → Remove is a PER-EXPORT setting, not a saved preference — Lesson 12.4's pitfall about this applies every single time), a description rewritten per platform, a cover image checked against each platform's own safe area, a real scheduling tool instead of manually opening four apps at the right minute, and a link with tracking attached. The first two are already yours from Lesson 20.4 — the rest is new.</p>

<h3>Facebook: Professional mode, or a Page?</h3>
<p>These are genuinely two different products, confirmed directly on Meta's own comparison. <strong>Professional mode (Pro mode)</strong> turns on creator tools — insights, monetization — directly on your PERSONAL profile, while keeping your normal friends-and-family experience in the same place; you post under your own name, to a public audience or friends only. A <strong>Page</strong> is a separate entity entirely — for a business, brand, or a public persona kept apart from your personal identity — with role-based access for a team, and every post public by default.</p>
<div class="callout warn"><p><strong>The detail that actually matters for this lesson:</strong> Meta's own documentation states plainly that <strong>Professional mode on a personal profile does not integrate with Meta Business Suite's management tools</strong> — at least not currently. If your plan is "turn on Pro mode, then schedule everything through Business Suite," that plan does not work as written. Business Suite's Planner is built around Pages and professional Instagram accounts, not a personal profile in Pro mode.</p></div>

<h3>Instagram: collab posts and the Reels cover</h3>
<p>A <strong>collab post</strong>, confirmed on Instagram's own help page: the original author tags another account as a collaborator, who can accept or decline. If accepted, the post appears on BOTH profiles, gets distributed to both sets of followers, and the header credits both accounts. The original author stays in control the whole time — they can add or remove a collaborator at any point, their own privacy setting governs who can see the post, and if they delete it, it disappears from the collaborator's profile too. Worth building into content-swap collaborations with other student creators, not just brand deals.</p>
<p>The <strong>Reels cover photo</strong> has an official recommended size, confirmed directly: <strong>420×654 pixels</strong> (roughly a 1:1.55 ratio) — and Instagram states you cannot edit the cover once it is uploaded, so get it right before you post, not after. Beyond that exact upload size, treat your profile as a real device to check, not a guess: your profile grid displays a CROPPED thumbnail of that cover, narrower than the full vertical frame, so keep any face or text you care about centred rather than pinned to the edges — open your own profile after posting and look, since exactly how tight that crop runs has shifted between Instagram updates over the years.</p>

<h3>Scheduling for real: two different tools</h3>
${slide('cr-24', 10, 'TikTok · Facebook · Instagram — so sánh nhanh')}
<p><strong>Meta Business Suite</strong> covers both Facebook and Instagram from one screen, confirmed step by step on Meta's own help page: Create post → choose the destination (a Page, an Instagram account, or both at once) → add your media → write platform-specific text, hashtags and location → set a privacy audience → under Scheduling options, pick a date and time (or let it suggest times based on when your followers were actually active the past week) → Publish, Schedule, or Finish later. <strong>TikTok Studio</strong> (tiktok.com/tiktokstudio) is TikTok's own desktop creator dashboard, built for upload, scheduling and analytics together — it needs a Creator or Business account, and how many days ahead it lets you queue a post has shifted across updates, so check the live limit inside the app itself rather than trusting a number printed anywhere, including this lesson.</p>

<h3>UTM: proof instead of a guess</h3>
${slide('cr-24', 11, 'UTM — đo đúng nền tảng nào kéo người về web')}
<p>A <strong>UTM parameter</strong> is just a tagged query string appended to a URL, read by Google Analytics: &#96;utm_source&#96; (which platform sent the click — youtube, tiktok, instagram), &#96;utm_medium&#96; (what kind of placement — video, bio, reels), and &#96;utm_campaign&#96; (a name tying a batch of links together, so you can compare one launch against another later). Three real examples, one per platform:</p>
<pre><code class="language-plaintext">https://cuongthai.com/courses/content-creator?utm_source=youtube&utm_medium=video&utm_campaign=ch24-xuat-dang

https://cuongthai.com/courses/content-creator?utm_source=tiktok&utm_medium=bio&utm_campaign=ch24-xuat-dang

https://cuongthai.com/courses/content-creator?utm_source=instagram&utm_medium=reels&utm_campaign=ch24-xuat-dang</code></pre>
<p>Same destination page, three different tagged links. Put the YouTube one in that video's description, the TikTok one in your TikTok bio link, the Instagram one in your Reels caption or bio — then Chapter 26 is where you actually read the resulting traffic-source report and find out, in numbers, whether TikTok or YouTube sends more people who go on to look at a course.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — one link everywhere, then guessing which platform "feels" like it is working.</strong> Without separate UTM-tagged links per platform, every visit from every source lands in Analytics looking identical — direct traffic, no source attached. The tagging costs one extra minute per post; the alternative costs you the entire ability to answer "which platform is actually worth my time" with anything besides a feeling.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> the video is now live in four places. Lesson 24.4 covers the legal side still open — the music underneath it, and what happens if someone else's copyrighted material ends up in your upload.</p>

<h3>🎬 Practice (20–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Decide, honestly, whether your Facebook presence should be Professional mode on your own profile or a separate Page — write one sentence why, using the comparison above.</li>
<li>Build three UTM-tagged links to a real page on cuongthai.com, one per platform, following the exact parameter pattern above.</li>
<li>If you already have an Instagram or TikTok account for this, open Meta Business Suite (or TikTok Studio) and locate the actual Scheduling options screen — you do not need to publish anything yet, just find it.</li>
</ol><p><strong>Done when:</strong> you have three real UTM links that differ only in &#96;utm_source&#96; and &#96;utm_medium&#96;, and you can state which Facebook option (Pro mode vs Page) your own plan actually needs.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Professional mode (Pro mode)</span><span class="v">Creator tools turned on directly on a personal Facebook profile — does not integrate with Meta Business Suite's management tools.</span></div>
<div class="kv"><span class="k">Page</span><span class="v">A separate Facebook entity for a business/brand/public persona, with team role-based access.</span></div>
<div class="kv"><span class="k">Collab post</span><span class="v">An Instagram post credited to two accounts at once, shown on both profiles once the invited account accepts.</span></div>
<div class="kv"><span class="k">UTM parameter</span><span class="v">A tagged query string (&#96;utm_source&#96;/&#96;utm_medium&#96;/&#96;utm_campaign&#96;) that lets Analytics attribute a visit to a specific link.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Watermark-off and per-platform descriptions were already covered in Lesson 20.4 — this lesson adds account setup, scheduling, and measurement.</li>
<li>Pro mode (personal profile) and a Page are different Facebook products; Pro mode does not currently integrate with Meta Business Suite's scheduling tools.</li>
<li>Instagram collab posts show on both accounts' profiles once accepted; Reels cover photos are 420×654px and cannot be edited after upload.</li>
<li>Meta Business Suite schedules Facebook + Instagram from one screen; TikTok Studio (tiktok.com/tiktokstudio) is the equivalent for TikTok — check its live scheduling window in-app, it has changed before.</li>
<li>UTM-tagged links (utm_source/utm_medium/utm_campaign) are what actually let you prove which platform sends people to cuongthai.com, instead of guessing.</li>
</ul>
<div class="link-card"><a href="https://www.facebook.com/business/help/1608528132896450" target="_blank" rel="noopener">Meta Business Help — Professional mode vs Pages</a></div>
<div class="link-card"><a href="https://www.facebook.com/business/help/942827662903020" target="_blank" rel="noopener">Meta Business Help — Create and manage posts in Meta Business Suite</a></div>
<div class="link-card"><a href="https://help.instagram.com/291200585956732" target="_blank" rel="noopener">Instagram Help — About collab posts</a></div>
<div class="link-card"><a href="https://help.instagram.com/1038071743007909" target="_blank" rel="noopener">Instagram Help — Reel size &amp; aspect ratios</a></div>
<div class="link-card"><a href="https://support.google.com/analytics/answer/10917952" target="_blank" rel="noopener">Google Analytics Help — Collect campaign data with UTM parameters</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 24 · Bài 24.3</span>
<h2>Cùng một bản dựng, thêm ba nơi để lơ đễnh</h2>
<p class="lead">Bài 20.4 đã dạy cơ chế đăng chéo sạch: Watermark đặt Remove ở MỌI lần xuất, mô tả riêng cho từng nơi thay vì copy một caption dán khắp, và link "Related video" nối một clip Shorts về video dài. Điều đó vẫn đúng. Bài này nói phần Bài 20.4 CHƯA nói: lựa chọn cấp tài khoản trên Facebook và Instagram, cách thật sự lên lịch một bài đăng thay vì đăng trực tiếp mỗi lần, và một dạng link cho bạn biết — bằng con số, không phải đoán — nền tảng nào thật sự đang kéo người về cuongthai.com.</p>

<h3>Đăng chéo sạch, một lần nữa, gói trong một hình</h3>
${slide('cr-24', 9, 'Quy trình đăng chéo sạch')}
<p>Năm bước, theo thứ tự: một bản gốc thật sự sạch (Watermark → Remove là cài đặt theo TỪNG lần xuất, không phải tuỳ chọn lưu sẵn — cái bẫy Bài 12.4 đã nói áp dụng mỗi lần), mô tả viết lại cho từng nền tảng, ảnh bìa kiểm lại theo đúng vùng an toàn của từng nơi, một công cụ lên lịch thật thay vì tự mở bốn app đúng giờ, và một link có gắn theo dõi. Hai bước đầu đã là của bạn từ Bài 20.4 — phần còn lại mới.</p>

<h3>Facebook: Chế độ chuyên nghiệp, hay một Page?</h3>
<p>Đây thật sự là hai sản phẩm khác nhau, đã kiểm trực tiếp trên bảng so sánh của chính Meta. <strong>Chế độ chuyên nghiệp (Professional mode / Pro mode)</strong> bật công cụ creator — số liệu, kiếm tiền — ngay trên hồ sơ CÁ NHÂN của bạn, trong khi vẫn giữ trải nghiệm bạn bè/gia đình bình thường ở cùng một chỗ; bạn đăng dưới đúng tên mình, cho công chúng hoặc chỉ bạn bè. Một <strong>Page</strong> là một thực thể hoàn toàn tách biệt — cho một doanh nghiệp, thương hiệu, hoặc một hình ảnh công khai tách khỏi danh tính cá nhân — có phân quyền theo vai trò cho cả một đội, và mọi bài đăng mặc định công khai.</p>
<div class="callout warn"><p><strong>Chi tiết thật sự quan trọng cho bài này:</strong> tài liệu chính thức của Meta nói thẳng <strong>Chế độ chuyên nghiệp trên hồ sơ cá nhân KHÔNG tích hợp với công cụ quản lý của Meta Business Suite</strong> — ít nhất là chưa, tại thời điểm này. Nếu kế hoạch của bạn là "bật Pro mode, rồi lên lịch mọi thứ qua Business Suite," kế hoạch đó không hoạt động như viết ra. Planner của Business Suite dựng quanh Page và tài khoản Instagram chuyên nghiệp, không phải hồ sơ cá nhân ở chế độ Pro mode.</p></div>

<h3>Instagram: collab post và ảnh bìa Reels</h3>
<p>Một <strong>collab post</strong> (bài đăng cộng tác), đã kiểm trên đúng trang trợ giúp của Instagram: người đăng gốc tag một tài khoản khác làm cộng tác viên, người đó có thể đồng ý hoặc từ chối. Nếu đồng ý, bài đăng hiện trên CẢ HAI hồ sơ, được phân phối tới cả hai nhóm người theo dõi, và phần đầu bài ghi công cả hai tài khoản. Người đăng gốc luôn giữ quyền kiểm soát — có thể thêm/gỡ cộng tác viên bất cứ lúc nào, cài đặt riêng tư của chính họ quyết định ai xem được bài, và nếu họ xoá bài thì nó cũng biến mất khỏi hồ sơ người cộng tác. Đáng dựng thành các hợp tác đổi nội dung với creator sinh viên khác, không chỉ deal nhãn hàng.</p>
<p><strong>Ảnh bìa Reels</strong> có kích thước khuyến nghị chính thức, đã kiểm trực tiếp: <strong>420×654 pixel</strong> (tỉ lệ khoảng 1:1,55) — và Instagram nói rõ bạn KHÔNG sửa được ảnh bìa sau khi đã tải lên, nên làm đúng trước khi đăng, không phải sau. Ngoài đúng kích thước tải lên đó, hãy coi hồ sơ của bạn là một thiết bị thật để kiểm, không phải để đoán: lưới hồ sơ hiển thị một bản CẮT của ảnh bìa đó, hẹp hơn khung dọc đầy đủ, nên giữ mặt hoặc chữ quan trọng ở giữa thay vì ghim sát rìa — mở hồ sơ của chính bạn sau khi đăng và nhìn, vì đúng mức cắt hẹp tới đâu đã đổi qua nhiều đợt cập nhật của Instagram.</p>

<h3>Lên lịch thật sự: hai công cụ khác nhau</h3>
${slide('cr-24', 10, 'TikTok · Facebook · Instagram — so sánh nhanh')}
<p><strong>Meta Business Suite</strong> phủ cả Facebook lẫn Instagram từ một màn hình, đã kiểm từng bước trên đúng trang trợ giúp của Meta: Create post → chọn nơi đến (một Page, một tài khoản Instagram, hoặc cả hai cùng lúc) → thêm ảnh/video → viết chữ, hashtag, vị trí riêng cho từng nền tảng → chọn đối tượng riêng tư → dưới Scheduling options, chọn ngày giờ (hoặc để nó gợi ý theo lúc người theo dõi thật sự hoạt động tuần vừa rồi) → Publish, Schedule, hoặc Finish later. <strong>TikTok Studio</strong> (tiktok.com/tiktokstudio) là bảng điều khiển creator trên desktop của chính TikTok, dựng để tải lên, lên lịch và xem số liệu cùng một chỗ — cần tài khoản Creator hoặc Business, và số ngày trước nó cho xếp lịch đã đổi qua nhiều đợt cập nhật, nên kiểm giới hạn thật trong chính app thay vì tin một con số in ở bất cứ đâu, kể cả bài này.</p>

<h3>UTM: bằng chứng thay vì đoán</h3>
${slide('cr-24', 11, 'UTM — đo đúng nền tảng nào kéo người về web')}
<p>Một <strong>tham số UTM</strong> chỉ là một chuỗi truy vấn gắn nhãn, thêm vào cuối URL, được Google Analytics đọc: &#96;utm_source&#96; (nền tảng nào gửi cú bấm — youtube, tiktok, instagram), &#96;utm_medium&#96; (loại vị trí nào — video, bio, reels), và &#96;utm_campaign&#96; (một cái tên gộp một đợt link lại với nhau, để sau này so đợt ra mắt này với đợt khác). Ba ví dụ thật, mỗi nền tảng một cái:</p>
<pre><code class="language-plaintext">https://cuongthai.com/courses/content-creator?utm_source=youtube&utm_medium=video&utm_campaign=ch24-xuat-dang

https://cuongthai.com/courses/content-creator?utm_source=tiktok&utm_medium=bio&utm_campaign=ch24-xuat-dang

https://cuongthai.com/courses/content-creator?utm_source=instagram&utm_medium=reels&utm_campaign=ch24-xuat-dang</code></pre>
<p>Cùng một trang đích, ba link gắn nhãn khác nhau. Đặt link YouTube trong mô tả video đó, link TikTok trong link bio TikTok của bạn, link Instagram trong caption Reels hoặc bio — rồi Chương 26 là chỗ bạn thật sự đọc báo cáo nguồn lượt truy cập và biết, bằng con số, TikTok hay YouTube đang gửi nhiều người thật sự đi xem một khoá học hơn.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — một link dùng khắp nơi, rồi đoán xem nền tảng nào "có vẻ" đang hiệu quả.</strong> Không có link gắn UTM riêng cho từng nền tảng, mọi lượt ghé từ mọi nguồn đều hiện trong Analytics giống hệt nhau — lượt truy cập trực tiếp, không gắn nguồn. Gắn nhãn tốn thêm đúng một phút mỗi bài đăng; không làm thì mất luôn khả năng trả lời "nền tảng nào thật sự đáng thời gian của tôi" bằng bất cứ thứ gì ngoài cảm tính.</p></div>

<p class="note-ct"><strong>Nối với bài sau:</strong> video giờ đã sống ở bốn nơi. Bài 24.4 nói phần pháp lý còn bỏ ngỏ — nhạc bên dưới nó, và chuyện gì xảy ra nếu tư liệu có bản quyền của người khác lọt vào bản tải lên của bạn.</p>

<h3>🎬 Thực hành (20–30 phút)</h3>
<div class="callout ok"><ol>
<li>Quyết định thật lòng: Facebook của bạn nên là Chế độ chuyên nghiệp trên hồ sơ cá nhân hay một Page riêng — viết một câu vì sao, dựa trên bảng so sánh ở trên.</li>
<li>Dựng ba link gắn UTM tới một trang thật trên cuongthai.com, mỗi nền tảng một link, đúng mẫu tham số ở trên.</li>
<li>Nếu bạn đã có tài khoản Instagram hoặc TikTok cho việc này, mở Meta Business Suite (hoặc TikTok Studio) và tìm đúng màn hình Scheduling options — chưa cần đăng gì cả, chỉ cần tìm ra nó.</li>
</ol><p><strong>Đạt khi:</strong> bạn có ba link UTM thật chỉ khác nhau ở &#96;utm_source&#96; và &#96;utm_medium&#96;, và nói được lựa chọn Facebook nào (Pro mode hay Page) kế hoạch của chính bạn thật sự cần.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Professional mode (Pro mode)</span><span class="v">Công cụ creator bật ngay trên hồ sơ cá nhân Facebook — không tích hợp với công cụ quản lý của Meta Business Suite.</span></div>
<div class="kv"><span class="k">Page</span><span class="v">Một thực thể Facebook riêng cho doanh nghiệp/thương hiệu/hình ảnh công khai, có phân quyền theo vai trò cho cả đội.</span></div>
<div class="kv"><span class="k">Collab post</span><span class="v">Bài đăng Instagram ghi công hai tài khoản cùng lúc, hiện trên cả hai hồ sơ khi tài khoản được mời đồng ý.</span></div>
<div class="kv"><span class="k">Tham số UTM</span><span class="v">Chuỗi truy vấn gắn nhãn (&#96;utm_source&#96;/&#96;utm_medium&#96;/&#96;utm_campaign&#96;) giúp Analytics gán một lượt ghé cho đúng một link cụ thể.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tắt watermark và mô tả riêng cho từng nền tảng đã học ở Bài 20.4 — bài này thêm cài đặt tài khoản, lên lịch, và đo lường.</li>
<li>Pro mode (hồ sơ cá nhân) và Page là hai sản phẩm Facebook khác nhau; Pro mode hiện không tích hợp với công cụ lên lịch của Meta Business Suite.</li>
<li>Collab post Instagram hiện trên hồ sơ cả hai tài khoản khi được đồng ý; ảnh bìa Reels là 420×654px và không sửa được sau khi đã tải lên.</li>
<li>Meta Business Suite lên lịch Facebook + Instagram từ một màn hình; TikTok Studio (tiktok.com/tiktokstudio) là công cụ tương đương cho TikTok — kiểm cửa sổ lên lịch thật ngay trong app, nó từng đổi qua thời gian.</li>
<li>Link gắn UTM (utm_source/utm_medium/utm_campaign) là thứ thật sự cho bạn chứng minh nền tảng nào đang kéo người về cuongthai.com, thay vì đoán.</li>
</ul>
<div class="link-card"><a href="https://www.facebook.com/business/help/1608528132896450" target="_blank" rel="noopener">Meta Business Help — Pro mode so với Page</a></div>
<div class="link-card"><a href="https://www.facebook.com/business/help/942827662903020" target="_blank" rel="noopener">Meta Business Help — Tạo và quản lý bài đăng trong Meta Business Suite</a></div>
<div class="link-card"><a href="https://help.instagram.com/291200585956732" target="_blank" rel="noopener">Instagram Help — Về collab post</a></div>
<div class="link-card"><a href="https://help.instagram.com/1038071743007909" target="_blank" rel="noopener">Instagram Help — Kích thước & tỉ lệ Reel</a></div>
<div class="link-card"><a href="https://support.google.com/analytics/answer/10917952" target="_blank" rel="noopener">Google Analytics Help — Thu thập dữ liệu chiến dịch bằng tham số UTM</a></div>
</div>
`,
    },

    /* ─────────────────── 24.4 bản quyền & luật chơi ─────────────────── */
    {
      title: '24.4 — Copyright & the rules of the game|||24.4 — Bản quyền & luật chơi',
      slug: 'cr-24-4-ban-quyen-luat-choi',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Nhạc có phép (YouTube Audio Library, Epidemic Sound, Artlist), Content ID claim khác copyright strike thế nào, và vì sao "fair use" không tự động áp dụng ở Việt Nam — không phải tư vấn pháp lý.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 24 · Lesson 24.4</span>
<h2>The publish button is also a legal moment, not just a technical one</h2>
<p class="lead">Everything up to now has been about getting the video seen. This lesson is about what happens if the video contains something you did not have full rights to use — a music track, a clip, someone else's face — and how the consequences actually differ depending on what exactly went wrong. None of this is legal advice; it is the set of facts worth knowing before you need a lawyer, not instead of one.</p>

<h3>Four licensed-music sources, four different deals</h3>
${slide('cr-24', 12, 'Nhạc có phép — bốn nguồn, bốn kiểu giấy phép')}
<p>You have already met two of these four. <strong>YouTube Audio Library</strong> is free and monetizable — the one condition, confirmed directly: tracks carrying a Creative Commons license require crediting the artist in your description. <strong>CapCut Commercial Music</strong> you already covered in Lesson 12.3 — confirmed usable ON CapCut specifically, with no guarantee it clears anywhere else. The two genuinely new ones both turned out to work the same way, confirmed directly on each service's own help pages: <strong>Epidemic Sound</strong> — a video published while your subscription is active (and your channel is safelisted, meaning it's connected to your account to prove the license) stays cleared FOREVER, even after you cancel; using the same music in a NEW video made after cancelling is not covered. <strong>Artlist</strong> works on the same logic despite different wording — the license is PER-PROJECT and perpetual for anything published while paying, explicitly not a traditional "lifetime license," and cancelling blocks using assets in new projects, not old ones.</p>
<p>The pattern across all four: <strong>the moment of publishing, not the moment you subscribe, is what gets locked in.</strong> Publish while covered and that specific video stays covered indefinitely; the coverage does not travel forward into your next project once you stop paying.</p>

<h3>Content ID claim vs. copyright strike — genuinely different systems</h3>
${slide('cr-24', 13, 'Content ID claim khác Copyright strike thế nào')}
<p>These two get confused constantly, and the difference actually matters for how worried to be. A <strong>Content ID claim</strong> is fully automated: YouTube's system matches your video's audio or video against a database of registered content, and the rights holder picks one of three responses — block the video, monetize it (running ads, sometimes sharing the revenue with you), or just track view counts — and confirmed directly, this can vary by country: a video can be monetized in one region and blocked in another. Critically: a Content ID claim does NOT count as a strike against your channel.</p>
<p>A <strong>copyright strike</strong> is a different, human-driven process entirely: a copyright owner submits a legal removal request, YouTube takes the video down to comply, and that is a strike on your account. One video can only carry one active strike at a time. Get three strikes within 90 days and the channel is terminated. A strike expires after 90 days if you complete Copyright School, and in the meantime you can contact the claimant to ask them to retract it, or file a counter notification if you believe the takedown was a mistake or covered by fair use.</p>

<h3>"Fair use" is American law — Vietnam has its own</h3>
${slide('cr-24', 14, '"Fair use" vs Luật Sở hữu trí tuệ Việt Nam')}
<p>"Fair use" is a specific legal doctrine inside United States copyright law — it does not automatically transfer to a creator working from, or an audience watching from, Vietnam. Vietnam has its own codified framework: the <strong>Law on Intellectual Property</strong> (Law No. 50/2005/QH11, dated 29 November 2005, since amended by Law No. 36/2009/QH12, Law No. 42/2019/QH14 and Law No. 07/2022/QH15 — the most recent in force from 1 January 2023), which governs copyright domestically. This lesson states that principle and stops there deliberately — it is not legal advice, and a specific situation (using a news clip in a reaction video, quoting another creator's footage for commentary) deserves an actual official source or a lawyer, not a paragraph in a video course.</p>
<p>Practically, three habits cover most of what a student creator runs into day to day: get real permission (or a proper license) before using someone else's footage rather than assuming a short clip is automatically fine; respect people's privacy when filming in public — Lesson 10.4 already covered asking permission and never filming children without consent; and disclose a brand collaboration honestly (this lesson's Paid Promotion toggle from Lesson 24.2 is the mechanical half of that same obligation).</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — assuming a Content ID claim means you did something wrong.</strong> It usually just means the system found a match and the rights holder chose to monetize or track instead of block — extremely common, not a violation report, and not a strike. Panicking and deleting a monetized-claim video over nothing is a bigger mistake than the claim itself.</p></div>

<p class="note-ct"><strong>Chapter complete.</strong> The file is correctly encoded (24.1), correctly packaged for YouTube (24.2), correctly cross-posted and measurable (24.3), and now correctly licensed (24.4). Chapter 25 goes back to the part that decides whether anyone clicks at all: the thumbnail and the title.</p>

<h3>🎬 Practice (15–20 minutes)</h3>
<div class="callout ok"><ol>
<li>Pick one video you have already made or plan to make. Name the exact source of its background music, and state in one sentence what happens to that track if you stop paying for whatever service it came from.</li>
<li>Write, from memory, the two things a Content ID claim can do to a video that a copyright strike cannot (and vice versa).</li>
<li>If you have ever filmed a stranger in public for this course, confirm you handled it the way Lesson 10.4 described.</li>
</ol><p><strong>Done when:</strong> you can explain, without rereading this lesson, why a Content ID claim and a copyright strike require two completely different reactions from you.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Content ID claim</span><span class="v">An automated match against registered content — the rights holder can block, monetize or track; does not count as a strike.</span></div>
<div class="kv"><span class="k">Copyright strike</span><span class="v">A human-submitted legal removal request that takes a video down; 3 in 90 days terminates the channel.</span></div>
<div class="kv"><span class="k">Safelisting</span><span class="v">Connecting your social channels to a music service's account to prove your subscription covers them.</span></div>
<div class="kv"><span class="k">Fair use</span><span class="v">A doctrine specific to US copyright law — not a rule that automatically applies in Vietnam.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>YouTube Audio Library (free, credit CC tracks), CapCut Commercial Music (Lesson 12.3, CapCut-only), Epidemic Sound and Artlist (Epidemic and Artlist both lock in coverage at the moment of PUBLISHING, not subscribing — new projects after cancelling are not covered).</li>
<li>A Content ID claim is automated and does not strike your channel; a copyright strike is a legal takedown that can end it after three in 90 days.</li>
<li>"Fair use" is US law. Vietnam has its own Law on Intellectual Property (Law No. 50/2005/QH11 and its amendments) — this is a principle, not legal advice.</li>
<li>Permission for others' footage, privacy when filming strangers (Lesson 10.4), and honest paid-promotion disclosure (Lesson 24.2) cover most day-to-day situations.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/3376882" target="_blank" rel="noopener">YouTube Help — Use music from the Audio Library</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/2797370" target="_blank" rel="noopener">YouTube Help — How Content ID works</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/2814000" target="_blank" rel="noopener">YouTube Help — Copyright strike basics</a></div>
<div class="link-card"><a href="https://www.wipo.int/wipolex/en/legislation/details/12011" target="_blank" rel="noopener">WIPO Lex — Vietnam, Law on Intellectual Property (Law No. 50/2005/QH11)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 24 · Bài 24.4</span>
<h2>Nút Đăng cũng là một khoảnh khắc pháp lý, không chỉ là kỹ thuật</h2>
<p class="lead">Mọi thứ từ đầu tới giờ là để video được xem. Bài này nói chuyện gì xảy ra nếu video chứa thứ bạn không có đủ quyền dùng — một bản nhạc, một đoạn clip, khuôn mặt người khác — và hậu quả thật sự khác nhau thế nào tuỳ đúng thứ gì sai. Không có gì ở đây là tư vấn pháp lý; đây là tập hợp sự thật đáng biết TRƯỚC khi bạn cần một luật sư, không phải để THAY cho một luật sư.</p>

<h3>Bốn nguồn nhạc có phép, bốn kiểu thoả thuận khác nhau</h3>
${slide('cr-24', 12, 'Nhạc có phép — bốn nguồn, bốn kiểu giấy phép')}
<p>Bạn đã gặp hai trong bốn nguồn này. <strong>YouTube Audio Library</strong> miễn phí và kiếm tiền được — điều kiện duy nhất, đã kiểm trực tiếp: nhạc dán nhãn Creative Commons phải ghi công nghệ sĩ trong mô tả. <strong>CapCut Commercial Music</strong> bạn đã học ở Bài 12.3 — xác nhận dùng được TRÊN CapCut, không đảm bảo cho nơi khác. Hai nguồn thật sự mới hoá ra hoạt động theo cùng một logic, đã kiểm trực tiếp trên trang trợ giúp của từng dịch vụ: <strong>Epidemic Sound</strong> — video đăng LÚC gói đang trả phí (và kênh đã được safelist, nghĩa là kết nối vào tài khoản để chứng minh giấy phép) thì sạch bản quyền MÃI MÃI, kể cả sau khi huỷ; dùng cùng bản nhạc đó cho một video MỚI làm sau khi huỷ thì không được bảo vệ. <strong>Artlist</strong> hoạt động theo đúng logic đó dù chữ dùng khác — giấy phép theo TỪNG dự án và vĩnh viễn cho bất cứ thứ gì đã đăng lúc còn trả phí, nói rõ KHÔNG phải một "giấy phép trọn đời" kiểu truyền thống, và huỷ gói chặn việc dùng tư liệu vào dự án MỚI, không phải dự án cũ.</p>
<p>Điểm chung của cả bốn: <strong>khoảnh khắc ĐĂNG BÀI, không phải khoảnh khắc bạn đăng ký, mới là thứ được khoá lại.</strong> Đăng lúc còn được bảo vệ thì đúng video đó được bảo vệ vô thời hạn; sự bảo vệ đó không đi tiếp sang dự án kế tiếp khi bạn ngừng trả phí.</p>

<h3>Content ID claim khác Copyright strike — thật sự là hai hệ thống khác nhau</h3>
${slide('cr-24', 13, 'Content ID claim khác Copyright strike thế nào')}
<p>Hai thứ này liên tục bị nhầm lẫn, và sự khác biệt thật sự quyết định bạn nên lo tới mức nào. Một <strong>Content ID claim</strong> hoàn toàn tự động: hệ thống của YouTube so khớp âm thanh hoặc hình ảnh video của bạn với một cơ sở dữ liệu nội dung đã đăng ký, và chủ sở hữu chọn một trong ba phản ứng — chặn video, kiếm tiền trên đó (chạy quảng cáo, đôi khi chia doanh thu lại cho bạn), hoặc chỉ theo dõi lượt xem — và đã kiểm trực tiếp, điều này có thể khác nhau theo từng quốc gia: một video có thể được kiếm tiền ở vùng này và bị chặn ở vùng khác. Quan trọng: một Content ID claim KHÔNG tính là một strike lên kênh của bạn.</p>
<p>Một <strong>copyright strike</strong> là một quy trình hoàn toàn khác, do con người khởi động: chủ sở hữu bản quyền gửi một yêu cầu gỡ hợp lệ về mặt pháp lý, YouTube gỡ video để tuân thủ, và đó là một strike lên tài khoản bạn. Một video chỉ mang được một strike đang hiệu lực tại một thời điểm. Nhận đủ ba strike trong 90 ngày thì kênh bị chấm dứt. Một strike hết hạn sau 90 ngày nếu bạn hoàn thành Copyright School, và trong lúc đó bạn có thể liên hệ người khiếu nại để xin rút lại, hoặc gửi counter notification nếu tin rằng việc gỡ là nhầm lẫn hoặc thuộc phạm vi fair use.</p>

<h3>"Fair use" là luật Mỹ — Việt Nam có luật riêng</h3>
${slide('cr-24', 14, '"Fair use" vs Luật Sở hữu trí tuệ Việt Nam')}
<p>"Fair use" là một học thuyết pháp lý cụ thể nằm trong luật bản quyền của Hoa Kỳ — nó không tự động áp dụng cho một creator làm việc từ, hay khán giả xem từ, Việt Nam. Việt Nam có khung pháp lý được luật hoá riêng: <strong>Luật Sở hữu trí tuệ</strong> (Luật số 50/2005/QH11, ngày 29/11/2005, đã được sửa đổi bởi Luật số 36/2009/QH12, Luật số 42/2019/QH14 và Luật số 07/2022/QH15 — lần gần nhất có hiệu lực từ 01/01/2023), điều chỉnh quyền tác giả trong nước. Bài này nêu nguyên tắc đó và dừng lại có chủ đích — đây không phải tư vấn pháp lý, và một tình huống cụ thể (dùng một đoạn tin tức trong video phản ứng, trích cảnh quay của creator khác để bình luận) xứng đáng một nguồn chính thức thật sự hoặc một luật sư, không phải một đoạn văn trong khoá video.</p>
<p>Trên thực tế, ba thói quen phủ được phần lớn tình huống một creator sinh viên gặp hằng ngày: xin phép thật (hoặc mua giấy phép đúng chuẩn) trước khi dùng cảnh quay của người khác thay vì mặc định một đoạn clip ngắn là tự động ổn; tôn trọng quyền riêng tư khi quay ở nơi công cộng — Bài 10.4 đã nói về xin phép và không bao giờ quay trẻ em khi chưa được đồng ý; và công bố hợp tác nhãn hàng trung thực (công tắc Paid Promotion ở Bài 24.2 là nửa cơ học của đúng nghĩa vụ này).</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — mặc định một Content ID claim nghĩa là bạn đã làm sai điều gì đó.</strong> Nó thường chỉ có nghĩa hệ thống tìm thấy một khớp và chủ sở hữu chọn kiếm tiền hoặc theo dõi thay vì chặn — cực kỳ phổ biến, không phải một báo cáo vi phạm, và không phải một strike. Hoảng loạn rồi xoá một video bị claim-kiếm-tiền vì không có gì cả là một sai lầm lớn hơn chính cái claim đó.</p></div>

<p class="note-ct"><strong>Hết chương.</strong> File đã mã hoá đúng chuẩn (24.1), đóng gói đúng cho YouTube (24.2), đăng chéo đúng cách và đo được (24.3), và giờ có giấy phép đúng (24.4). Chương 25 quay lại phần quyết định có ai bấm vào hay không: thumbnail và tiêu đề.</p>

<h3>🎬 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Chọn một video bạn đã làm hoặc định làm. Gọi đúng tên nguồn nhạc nền của nó, và nói trong một câu chuyện gì xảy ra với bản nhạc đó nếu bạn ngừng trả phí cho dịch vụ nó đến từ.</li>
<li>Viết lại, theo trí nhớ, hai điều một Content ID claim làm được với một video mà một copyright strike không làm được (và ngược lại).</li>
<li>Nếu bạn từng quay một người lạ nơi công cộng cho khoá này, xác nhận bạn đã làm đúng như Bài 10.4 mô tả.</li>
</ol><p><strong>Đạt khi:</strong> bạn giải thích được, không cần đọc lại bài này, vì sao một Content ID claim và một copyright strike đòi hỏi hai phản ứng hoàn toàn khác nhau từ bạn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Content ID claim</span><span class="v">Một khớp tự động với nội dung đã đăng ký — chủ sở hữu có thể chặn, kiếm tiền, hoặc theo dõi; không tính là một strike.</span></div>
<div class="kv"><span class="k">Copyright strike</span><span class="v">Một yêu cầu gỡ hợp lệ về pháp lý do con người gửi, làm video bị gỡ; 3 lần trong 90 ngày thì kênh bị chấm dứt.</span></div>
<div class="kv"><span class="k">Safelisting</span><span class="v">Kết nối kênh mạng xã hội của bạn vào tài khoản một dịch vụ nhạc để chứng minh gói đăng ký phủ tới kênh đó.</span></div>
<div class="kv"><span class="k">Fair use</span><span class="v">Một học thuyết riêng của luật bản quyền Hoa Kỳ — không phải một quy tắc tự động áp dụng ở Việt Nam.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>YouTube Audio Library (miễn phí, ghi công nhạc CC), CapCut Commercial Music (Bài 12.3, chỉ trên CapCut), Epidemic Sound và Artlist (cả hai khoá sự bảo vệ vào khoảnh khắc ĐĂNG BÀI, không phải khoảnh khắc đăng ký — dự án mới sau khi huỷ gói không được bảo vệ).</li>
<li>Content ID claim tự động và không tạo strike lên kênh; copyright strike là một lệnh gỡ pháp lý có thể chấm dứt kênh sau ba lần trong 90 ngày.</li>
<li>"Fair use" là luật Mỹ. Việt Nam có Luật Sở hữu trí tuệ riêng (Luật số 50/2005/QH11 và các bản sửa đổi) — đây là nguyên tắc, không phải tư vấn pháp lý.</li>
<li>Xin phép khi dùng cảnh quay người khác, tôn trọng quyền riêng tư khi quay người lạ (Bài 10.4), và công bố hợp tác trả phí trung thực (Bài 24.2) phủ được phần lớn tình huống hằng ngày.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/3376882" target="_blank" rel="noopener">YouTube Help — Dùng nhạc từ Audio Library</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/2797370" target="_blank" rel="noopener">YouTube Help — Content ID hoạt động thế nào</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/2814000" target="_blank" rel="noopener">YouTube Help — Cơ bản về copyright strike</a></div>
<div class="link-card"><a href="https://www.wipo.int/wipolex/en/legislation/details/12011" target="_blank" rel="noopener">WIPO Lex — Việt Nam, Luật Sở hữu trí tuệ (Luật số 50/2005/QH11)</a></div>
</div>
`,
    },

    /* ─────────────────── 24.5 quiz ─────────────────── */
    {
      title: '24.5 — Chapter 24 check|||24.5 — Kiểm tra Chương 24',
      slug: 'cr-24-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Kiểm tra 10 câu tình huống: thông số xuất YouTube, bẫy VBR/CBR, chapters, hashtag, made for kids, Content ID vs strike, giấy phép nhạc, và UTM.',
      content: `
<div class="ml-en">
<h2>📌 Chapter 24 summary</h2>
<p>Four lessons, one straight line from a finished timeline to a measurable, legally sound publish: <strong>24.1</strong> exported a file matching YouTube's full spec (not just a bitrate number) and proved it with real &#96;ffmpeg&#96;/&#96;ffprobe&#96; runs, including a real VBR-collapsing-into-CBR trap. <strong>24.2</strong> filled in everything around that file on YouTube — chapters, tags, hashtags, and three disclosure toggles that are legal requirements, not SEO settings. <strong>24.3</strong> took the same edit to TikTok, Facebook and Instagram, added scheduling and UTM-tagged links on top of Lesson 20.4's cross-posting basics. <strong>24.4</strong> covered the legal side: licensed music, Content ID claims vs. copyright strikes, and why "fair use" does not travel to Vietnam.</p>
<h3>Self-check before moving on</h3>
<ul>
<li>Can you name all seven items on YouTube's video-encoding spec, not just the bitrate?</li>
<li>Can you explain, from a real log you could reproduce, why setting &#96;-maxrate&#96; equal to &#96;-b:v&#96; is a trap?</li>
<li>Do you know all three of YouTube's chapter rules, and what happens if you miss one?</li>
<li>Can you state the difference between a Content ID claim and a copyright strike without looking it up?</li>
<li>Do you have three UTM-tagged links ready, one per platform, pointing at the same cuongthai.com page?</li>
</ul>
</div>
<div class="ml-vi">
<h2>📌 Tóm tắt Chương 24</h2>
<p>Bốn bài học, một đường thẳng từ một timeline dựng xong tới một lượt đăng đo được và đúng luật: <strong>24.1</strong> xuất một file khớp đầy đủ thông số của YouTube (không chỉ một con số bitrate) và chứng minh bằng lượt chạy &#96;ffmpeg&#96;/&#96;ffprobe&#96; thật, kể cả một bẫy VBR sụp thành CBR có thật. <strong>24.2</strong> điền mọi thứ quanh file đó trên YouTube — chapters, tag, hashtag, và ba công tắc công bố là yêu cầu pháp lý, không phải cài đặt SEO. <strong>24.3</strong> đưa cùng bản dựng sang TikTok, Facebook, Instagram, thêm lên lịch và link gắn UTM lên trên nền tảng đăng chéo của Bài 20.4. <strong>24.4</strong> nói phần pháp lý: nhạc có phép, Content ID claim vs copyright strike, và vì sao "fair use" không theo tới Việt Nam.</p>
<h3>Tự kiểm trước khi học tiếp</h3>
<ul>
<li>Bạn gọi tên được cả bảy mục trong thông số mã hoá video của YouTube, không chỉ mỗi bitrate?</li>
<li>Bạn giải thích được, từ một log bạn có thể tự tạo lại, vì sao đặt &#96;-maxrate&#96; bằng &#96;-b:v&#96; là một cái bẫy?</li>
<li>Bạn biết cả ba quy tắc chapters của YouTube, và chuyện gì xảy ra nếu thiếu một?</li>
<li>Bạn nói được khác biệt giữa Content ID claim và copyright strike mà không cần tra lại?</li>
<li>Bạn đã có sẵn ba link gắn UTM, mỗi nền tảng một cái, cùng trỏ về một trang cuongthai.com?</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You export a 1080p video for YouTube with &#96;-b:v 8M -maxrate 8M -bufsize 16M&#96;. x264\'s own log prints &#96;rc=cbr&#96; instead of the variable bitrate YouTube recommends. What actually caused this?|||Bạn xuất video 1080p cho YouTube với &#96;-b:v 8M -maxrate 8M -bufsize 16M&#96;. Log của chính x264 in ra &#96;rc=cbr&#96; thay vì bitrate biến đổi YouTube khuyến nghị. Điều gì thật sự gây ra chuyện này?',
            options: [
              'Setting -maxrate equal to -b:v collapses x264\'s rate control into a near-constant mode|||Đặt -maxrate bằng -b:v làm chế độ kiểm soát tốc độ của x264 co về gần như hằng số',
              'The -bufsize value was too small for any bitrate mode to work|||Giá trị -bufsize quá nhỏ nên không chế độ bitrate nào hoạt động được',
              'YouTube always converts uploads to CBR regardless of the source file|||YouTube luôn chuyển mọi video tải lên thành CBR bất kể file nguồn',
              '-profile:v high forces constant bitrate encoding|||-profile:v high buộc phải mã hoá bitrate hằng số',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Confirmed directly in this lesson\'s real ffmpeg run — raising -maxrate above the target (e.g. 10M against 8M) restored rc=abr (genuine VBR). Equal maxrate/bitrate is what triggers the CBR-like label, not bufsize, YouTube\'s own transcoding, or the profile setting.|||VI: Đã xác nhận trực tiếp trong lượt chạy ffmpeg thật của bài này — nâng -maxrate lên trên mức mục tiêu (ví dụ 10M so với 8M) khôi phục rc=abr (VBR thật). maxrate bằng bitrate mới là thứ gây ra nhãn giống CBR, không phải bufsize, không phải việc YouTube tự chuyển mã, cũng không phải cài đặt profile.',
          },
          {
            question: 'According to YouTube\'s own recommended upload encoding settings, what is the target bitrate for a 1080p SDR video at a standard frame rate (24/25/30fps)?|||Theo đúng thông số mã hoá khuyến nghị của YouTube, bitrate mục tiêu cho video 1080p SDR ở khung hình chuẩn (24/25/30fps) là bao nhiêu?',
            options: ['4 Mbps|||4 Mbps', '8 Mbps|||8 Mbps', '12 Mbps|||12 Mbps', '35 Mbps|||35 Mbps'],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: 8 Mbps is the 1080p SDR standard-frame-rate number (already introduced in Lesson 12.4, and repeated with its HDR counterpart in Lesson 24.1). 12 Mbps is the high-frame-rate (48–60fps) SDR number, not standard; 35 Mbps is the low end of the 4K range.|||VI: 8 Mbps là con số 1080p SDR ở khung hình chuẩn (đã có từ Bài 12.4, nhắc lại cùng cặp HDR ở Bài 24.1). 12 Mbps là con số SDR khung hình cao (48–60fps), không phải chuẩn; 35 Mbps là đầu dưới của dải 4K.',
          },
          {
            question: 'A video description lists five timestamps: 00:05, 01:20, 03:00, 05:45, 08:10. Why will YouTube most likely NOT show a chapter bar for this video?|||Mô tả một video liệt kê năm mốc thời gian: 00:05, 01:20, 03:00, 05:45, 08:10. Vì sao YouTube gần như chắc chắn KHÔNG hiện thanh chương cho video này?',
            options: [
              'There are fewer than the minimum of 3 timestamps required|||Có ít hơn số mốc tối thiểu là 3 mốc',
              'Timestamps must be listed in a table, not a plain list|||Mốc thời gian phải liệt kê trong bảng, không phải danh sách thường',
              'The first timestamp is not 00:00|||Mốc đầu tiên không phải 00:00',
              'Chapters require the video to be made for kids|||Chapters yêu cầu video phải đặt made for kids',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: YouTube requires the FIRST timestamp to be exactly 00:00 — this list starts at 00:05, so the whole chapter list is silently ignored even though it has 5 (enough) ascending timestamps.|||VI: YouTube yêu cầu mốc ĐẦU TIÊN phải đúng 00:00 — danh sách này bắt đầu ở 00:05, nên cả danh sách chapters bị âm thầm bỏ qua dù có đủ 5 mốc tăng dần.',
          },
          {
            question: 'You add 84 hashtags to a YouTube video description hoping to reach more search results. What actually happens?|||Bạn gắn 84 hashtag vào mô tả một video YouTube với hy vọng xuất hiện trong nhiều kết quả tìm kiếm hơn. Điều gì thật sự xảy ra?',
            options: [
              'Only the first 60 hashtags are counted, the rest are ignored|||Chỉ 60 hashtag đầu được tính, phần còn lại bị bỏ qua',
              'The video gets flagged as made for kids automatically|||Video tự động bị gắn cờ made for kids',
              'Only the 3 most relevant hashtags show, the rest still work for search|||Chỉ 3 hashtag liên quan nhất hiện ra, phần còn lại vẫn có tác dụng cho tìm kiếm',
              'YouTube ignores every single hashtag on that video|||YouTube bỏ qua toàn bộ hashtag trên video đó',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Already established in Lesson 1.2 and reconfirmed in Lesson 24.2: more than 60 hashtags on one video means YouTube ignores ALL of them, not just the excess — there is no partial credit.|||VI: Đã xác lập từ Bài 1.2 và nhắc lại ở Bài 24.2: hơn 60 hashtag trên một video khiến YouTube bỏ qua TẤT CẢ, không chỉ phần dư ra — không có chuyện tính một phần.',
          },
          {
            question: 'A video is correctly marked "Made for kids." Which of these is a direct, documented consequence?|||Một video được đặt đúng "Made for kids." Điều nào dưới đây là hậu quả trực tiếp, đã được ghi nhận?',
            options: [
              'Comments, personalized ads, cards and end screens are all disabled on it|||Bình luận, quảng cáo cá nhân hoá, cards và end screen đều bị tắt trên video đó',
              'The video automatically gets a higher view count boost|||Video tự động được tăng lượt xem cao hơn',
              'The video can no longer be monetized at all, under any circumstance|||Video hoàn toàn không thể kiếm tiền được nữa, trong mọi trường hợp',
              'Tags and hashtags stop working for that video|||Tag và hashtag ngừng hoạt động trên video đó',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Confirmed directly in Lesson 24.2: made-for-kids content disables comments, autoplay on home, live chat, personalized ads, memberships, Super Chat/Stickers, cards, end screens, the notification bell and the donate button — a real feature cost, not a view-count reward.|||VI: Đã xác nhận trực tiếp ở Bài 24.2: nội dung made-for-kids tắt bình luận, tự phát trang chủ, live chat, quảng cáo cá nhân hoá, memberships, Super Chat/Stickers, cards, end screen, nút thông báo và nút quyên góp — một cái giá thật về tính năng, không phải phần thưởng lượt xem.',
          },
          {
            question: 'A Content ID system matches your video\'s background music against a registered track, and the rights holder chooses to run ads on your video and keep the revenue. Which is true?|||Hệ thống Content ID khớp nhạc nền video bạn với một bản nhạc đã đăng ký, và chủ sở hữu chọn chạy quảng cáo trên video của bạn và giữ doanh thu. Điều nào đúng?',
            options: [
              'This counts as one of the 3 strikes that can terminate your channel|||Đây tính là một trong 3 strike có thể làm chấm dứt kênh của bạn',
              'This is a Content ID claim, which does NOT count as a copyright strike|||Đây là một Content ID claim, KHÔNG tính là một copyright strike',
              'Your channel is automatically suspended for 90 days|||Kênh của bạn tự động bị đình chỉ 90 ngày',
              'The video is immediately removed from YouTube|||Video bị gỡ khỏi YouTube ngay lập tức',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Content ID claims are automated and can result in blocking, monetizing, or tracking (which is what happened here) — and a claim explicitly does NOT count as a strike. A strike only comes from an actual legal removal request, which did not happen in this scenario.|||VI: Content ID claim là tự động và có thể dẫn tới chặn, kiếm tiền, hoặc theo dõi (đúng như tình huống này) — và một claim rõ ràng KHÔNG tính là một strike. Strike chỉ tới từ một yêu cầu gỡ hợp lệ về pháp lý thật sự, điều không xảy ra ở đây.',
          },
          {
            question: 'You published a video using an Epidemic Sound track while your subscription was active and your channel was safelisted. You cancelled the subscription two months later. What happens to THAT specific video?|||Bạn đăng một video dùng nhạc Epidemic Sound lúc gói đăng ký đang hoạt động và kênh đã được safelist. Hai tháng sau bạn huỷ gói. Chuyện gì xảy ra với ĐÚNG video đó?',
            options: [
              'It gets a copyright strike within 30 days of cancelling|||Nó nhận một copyright strike trong vòng 30 ngày sau khi huỷ',
              'You must re-subscribe within a week or the video is taken down|||Bạn phải đăng ký lại trong một tuần nếu không video sẽ bị gỡ',
              'It stays cleared for that music permanently, even after cancellation|||Video đó vẫn sạch bản quyền nhạc mãi mãi, kể cả sau khi huỷ',
              'The music is automatically muted in the existing video|||Nhạc trong video hiện có sẽ tự động bị tắt tiếng',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Confirmed directly on Epidemic Sound\'s own help pages: content published while subscribed (and safelisted) stays cleared forever. The restriction after cancelling only applies to using the music in NEW content going forward, not anything already published.|||VI: Đã kiểm trực tiếp trên trang trợ giúp của chính Epidemic Sound: nội dung đăng lúc còn trả phí (và đã safelist) sạch bản quyền mãi mãi. Giới hạn sau khi huỷ chỉ áp dụng cho việc dùng nhạc đó vào nội dung MỚI về sau, không áp dụng cho bất cứ thứ gì đã đăng rồi.',
          },
          {
            question: 'A friend tells you: "Fair use means I can use any 10-second clip from someone else\'s video as long as it\'s under 15 seconds — that rule applies everywhere, including Vietnam." What is wrong with this claim?|||Một người bạn nói: "Fair use nghĩa là mình dùng được bất kỳ đoạn clip 10 giây nào của người khác miễn là dưới 15 giây — luật đó áp dụng ở mọi nơi, kể cả Việt Nam." Câu nói này sai ở đâu?',
            options: [
              'The rule is correct, but the limit is 8 seconds, not 15|||Quy tắc đúng, nhưng giới hạn là 8 giây, không phải 15',
              'Fair use only applies to audio, not video clips|||Fair use chỉ áp dụng cho âm thanh, không áp dụng cho clip video',
              'Nothing is wrong — this is an accurate description of fair use worldwide|||Không có gì sai — đây là mô tả chính xác về fair use trên toàn thế giới',
              'Fair use has no time-length rule, and it is a US legal doctrine that does not automatically apply in Vietnam, which has its own Law on Intellectual Property|||Fair use không có quy tắc về độ dài thời gian, và đó là học thuyết pháp lý của Mỹ, không tự động áp dụng ở Việt Nam — nơi có Luật Sở hữu trí tuệ riêng',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: There is no universal "X seconds is always fine" rule anywhere, and Lesson 24.4 was explicit: fair use is a US legal concept and Vietnam has its own Law on Intellectual Property (Law No. 50/2005/QH11) governing copyright domestically — a popular myth about a fixed safe clip length is not the same as a verified legal fact.|||VI: Không có quy tắc phổ quát nào kiểu "dưới X giây là luôn ổn" ở bất cứ đâu, và Bài 24.4 đã nói rõ: fair use là khái niệm pháp lý của Mỹ, còn Việt Nam có Luật Sở hữu trí tuệ riêng (Luật số 50/2005/QH11) điều chỉnh bản quyền trong nước — một lời đồn phổ biến về độ dài clip "an toàn cố định" không giống với một sự thật pháp lý đã kiểm chứng.',
          },
          {
            question: 'You want to know exactly which of your three posting platforms (YouTube, TikTok, Instagram) is actually sending visitors to a specific page on cuongthai.com. What should each platform\'s link contain?|||Bạn muốn biết chính xác nền tảng nào trong ba nền tảng (YouTube, TikTok, Instagram) đang thật sự gửi người ghé thăm tới một trang cụ thể trên cuongthai.com. Link của mỗi nền tảng nên chứa gì?',
            options: [
              'A different UTM-tagged link per platform, at minimum with distinct utm_source values|||Một link gắn UTM khác nhau cho từng nền tảng, tối thiểu là giá trị utm_source khác nhau',
              'The same plain link everywhere — Analytics can tell platforms apart automatically|||Một link trần giống nhau ở khắp nơi — Analytics tự phân biệt được nền tảng',
              'A shortened URL is enough on its own to identify the source platform|||Chỉ cần rút gọn URL là đủ để nhận diện nền tảng nguồn',
              'UTM parameters only work on YouTube links, not TikTok or Instagram|||Tham số UTM chỉ hoạt động trên link YouTube, không dùng được cho TikTok hay Instagram',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Lesson 24.3\'s pitfall covers exactly this: a plain, un-tagged link makes every visit look identical (direct traffic) in Analytics regardless of source. Distinct utm_source (and typically utm_medium/utm_campaign) values per platform are what actually let you attribute traffic — and UTM parameters work on any URL, not just YouTube\'s.|||VI: Cái bẫy ở Bài 24.3 nói đúng chuyện này: một link trần không gắn nhãn làm mọi lượt ghé trông giống hệt nhau (lượt truy cập trực tiếp) trong Analytics bất kể nguồn nào. Giá trị utm_source (và thường cả utm_medium/utm_campaign) khác nhau cho từng nền tảng mới thật sự cho bạn gán được nguồn lượt truy cập — và tham số UTM hoạt động trên bất kỳ URL nào, không chỉ của YouTube.',
          },
          {
            question: 'You turned on Professional mode (Pro mode) on your personal Facebook profile, then try to schedule that profile\'s posts through Meta Business Suite\'s Planner. What is the documented outcome?|||Bạn bật Chế độ chuyên nghiệp (Pro mode) trên hồ sơ Facebook cá nhân, rồi thử lên lịch bài đăng của hồ sơ đó qua Planner của Meta Business Suite. Kết quả đã được ghi nhận là gì?',
            options: [
              'It works exactly like a Page — full Business Suite scheduling support|||Hoạt động y hệt một Page — hỗ trợ lên lịch đầy đủ qua Business Suite',
              'Pro mode on a personal profile does not currently integrate with Meta Business Suite\'s management tools|||Pro mode trên hồ sơ cá nhân hiện không tích hợp với công cụ quản lý của Meta Business Suite',
              'Business Suite only works for Instagram, never for any Facebook profile or Page|||Business Suite chỉ dùng được cho Instagram, không bao giờ dùng được cho Facebook dù là profile hay Page',
              'You must delete your personal profile and recreate it as a Page first|||Bạn phải xoá hồ sơ cá nhân rồi tạo lại thành một Page trước',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Confirmed directly in Lesson 24.3 from Meta\'s own comparison page: Professional mode for profiles does not support management-tool integration with Meta Business Suite at this time — Business Suite\'s Planner is built around Pages and professional Instagram accounts, not a personal profile in Pro mode.|||VI: Đã xác nhận trực tiếp ở Bài 24.3 từ đúng trang so sánh của Meta: Professional mode cho hồ sơ cá nhân hiện không hỗ trợ tích hợp công cụ quản lý với Meta Business Suite — Planner của Business Suite dựng quanh Page và tài khoản Instagram chuyên nghiệp, không phải hồ sơ cá nhân ở Pro mode.',
          },
        ],
      },
    },
  ],
};
