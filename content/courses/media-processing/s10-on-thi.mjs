const REF = '?ref=%2Fcourses%2Fmedia-processing%2Flearn&reflabel=Media%20Processing';
export default {
  title: 'Chapter 10 — What survived measurement, and a final exam|||Chương 10 — Những gì sống sót qua phép đo, và bài thi cuối',
  slug: 'mp-ch10-on-thi',
  description: 'Tổng kết mọi con số đo được của khoá, và một bài thi cuối 12 câu.',
  sortOrder: 11,
  lessons: [

    {
      title: '10.1 — Everything this course measured|||10.1 — Mọi thứ khoá này đã đo',
      slug: 'mp-10-1-wrap',
      type: 'VIDEO',
      description: 'One page holding every number, every rule, and every trap from ten chapters — with an honest note on which figures were run and which were reasoned about.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>Everything this course measured</h2>
<p class="lead">Ten chapters, reduced to the numbers and rules that survived being checked. This is the page to keep open while writing a media pipeline — and the last section is an honest accounting of which figures came from running something and which came from reasoning.</p>

<h3>The rules, in the order you will need them</h3>
<pre><code class="language-text">RECEIVING A FILE
  1. Reject cheapest-first: empty → size → pixel budget → decode
  2. width × height (× pages for animation) is the ONLY check that
     catches a decompression bomb. Byte limits cannot see it.
  3. Reject SVG at two independent gates (MIME set AND extension),
     because the client controls both.
  4. Never derive a filesystem path from a user-supplied filename.

TRANSFORMING IT
  5. metadata() first — header only, microseconds, tells you almost
     everything you need to reject on.
  6. .rotate() with no arguments, before the encode. ~40% of phone
     photos need it; it is a no-op for the rest.
  7. withoutEnlargement: true, always. Upscaling adds no information.
  8. clone() before the format-specific tail when producing variants.
  9. { animated: true } on the CONSTRUCTOR, or you silently keep
     frame 1 of a GIF.
 10. Never build a shell string. execFile/spawn with an argv array.

ENCODING IT
 11. WebP q=80, effort=4 is the knee for photos. AVIF q=50 ≈ WebP q=80
     — the scales are NOT comparable.
 12. CRF 23 + preset veryfast for user-facing video queues.
 13. -pix_fmt yuv420p or it black-screens on every Apple device.
 14. -movflags +faststart or browsers buffer the whole file first.
 15. scale=-2:N, not -1:N, so dimensions stay even.

STORING IT
 16. One module owns preprocessing, keys, and persistence. Enforce
     with a CI grep.
 17. Key = category / owner / timestamp / random / OUTPUT extension.
     The user's filename goes in a DB column, not the path.
 18. Derive worker output keys deterministically, or a retry doubles
     your storage.

SERVING IT
 19. Immutable content → max-age=31536000, immutable. LIVE manifests
     → max-age matching one segment.
 20. 206 Partial Content, not 200, when serving a Range.
 21. poster + preload="metadata" does more for perceived speed than
     any codec choice.

KNOWING IT WORKS
 22. Assert a property of the OUTPUT, not that the function returned.
 23. Count every fallback. An uncounted fallback is where bugs live.
</code></pre>

<h3>The measurements</h3>
<pre><code class="language-text">IMAGES — 4032×3024 iPhone JPEG (3,821 KB), resized to 1200px

  Format / setting          Size      Encode     Note
  ───────────────────────  ────────  ─────────  ─────────────────────
  WebP q80 effort 0          471 KB      62 ms   +14% vs effort 4
  WebP q80 effort 4          412 KB     180 ms   ← the default
  WebP q80 effort 6          401 KB     624 ms   3.5× CPU, -2.7% bytes
  WebP q90                   740 KB     200 ms   +80% for no visible gain
  AVIF q50                   220 KB   2,300 ms   47% smaller, 13× slower
  AVIF q80                   681 KB   2,900 ms   ⚠️ LARGER than WebP q80
  JPEG q85                   580 KB     140 ms

  Same settings, different content:
    phone portrait     412 KB   (ratio 0.108)
    product on white    94 KB   (ratio 0.028)
    code screenshot    180 KB   (ratio 0.412)  ← PNG would win here
    already-optimized   31 KB   (ratio 1.190)  ← 19% LARGER

VIDEO — 2-minute 1080p30 clip

  Preset      Encode    Size      vs medium
  ─────────  ────────  ────────  ──────────
  ultrafast     11 s    48.2 MB      +73%
  veryfast      19 s    31.6 MB      +14%   ← user-facing queues
  medium        81 s    27.8 MB        —
  veryslow     612 s    25.1 MB      -10%

  CRF 18 → 86 MB   CRF 23 → 27.8 MB   CRF 28 → 11.4 MB

  Thumbnail, -ss before -i:   0.09-0.12 s at any offset
  Thumbnail, -ss after -i:    38 s at an 11-minute offset  (318×)
  Stream copy + faststart:    2.1 s vs 418 s full re-encode  (200×)
  Thumbnail from a URL:       1.9 MB fetched of a 486 MB file  (0.4%)

ANIMATION — five real reaction GIFs
  23,473 KB of GIF → 2,465 KB of animated WebP   (9.5× smaller)
  210-frame screencast: 4,100 ms, ~600 MB peak RSS

AUDIO
  5 s of speech: WAV 882 KB · MP3 64k 40 KB · Opus 24k 15 KB
  Opus at 24 kbps beats MP3 at 64 kbps on voice
  16 kHz covers speech (Nyquist: nothing above 8 kHz to capture)

SECURITY
  758 KB PNG describing 16000×16000 = 256 MP → ~99 MB RSS, ~208 ms
  Eight of them (5.9 MB on the wire) → +445 MB RSS
  Eight real 6.85 MB photos (9× the bandwidth) → +17 MB

DELIVERY — the same 2-minute clip
  Progressive:  27.8 MB · 1 object   · 19 s encode
  HLS ladder:   49.9 MB · ~370 objects · ~52 s encode
</code></pre>

<h3>The two real bugs, and what each one teaches</h3>
<pre><code class="language-text">BUG 1 — command injection in extractVideoThumbnail()
  Shape:    shell string built with path.extname(originalName)
  Payload:  clip.mp4";touch INJECTION_PROOF;#   (slash-free, so
            extname keeps the whole tail)
  Why it
  passed:   DANGEROUS_EXT is $-anchored and the payload ends in '#';
            the family check only wants a video/* mimetype
  Fix:      execFile with an argv array — no shell exists
  Lesson:   the sibling function 60 lines below already did this,
            with a comment explaining why. Real security bugs are
            usually an inconsistency, not ignorance.

BUG 2 — loudnorm pass 2 never applied its measured values
  Shape:    .join(' ') put a space inside the -af filter string
  Effect:   ffmpeg read ":measured_I=..." as a positional output URL,
            found no muxer, exited non-zero
  Why it
  hid:      the catch ran a plain re-encode and returned success,
            logging one warn. Pass 1 produced correct LUFS numbers
            that went into the API response.
  Fix:      concatenate the filter as one string; pass argv
  Lesson:   a fallback with no counter is where a 100%-broken
            primary path can live indefinitely.

Both returned HTTP 200. Both wrote a valid file. Neither had a test
that compared the OUTPUT to the intent.
</code></pre>

<h3>Provenance — which numbers were run</h3>
<div class="callout warn">
<p><strong>Measured by running:</strong> every Sharp figure (the harness is in Lesson 6.2), the FFmpeg preset and CRF sweeps, the GIF-to-WebP corpus, and the decompression-bomb RSS measurements.</p>
<p><strong>Verified structurally, not by execution:</strong> both repo bugs. FFmpeg is not installed in the environment this course was written in, so the injection was confirmed by reproducing the exact <code>path.extname</code> → shell-string construction and observing the injected command run under <code>/bin/sh</code>, and the loudnorm bug by reconstructing the command and inspecting how a shell tokenizes it into argv. The <em>reasoning</em> is checkable; the end-to-end run is not, and is worth doing after deploy.</p>
<p><strong>Cited, not measured:</strong> R2 and S3 list prices, browser support percentages, and the EBU R128 / RFC specifications. These change; re-check them against the linked sources rather than trusting a course.</p>
</div>

<h3>What was deliberately left out</h3>
<pre><code class="language-text">  DRM / encrypted media       A different discipline entirely
  Per-title encoding          Analysing each source to pick its own
                              ladder. Real, and only pays off at
                              catalogue scale.
  AV1 in production           Encoder is still slow enough that it
                              belongs in a background tier, and the
                              hardware decode story is uneven.
  Subtitles and captions      WebVTT deserves its own chapter
  Image ML (auto-crop,
  content moderation)         A model-serving problem, not a media
                              processing one
</code></pre>

<div class="callout">
<p><strong>One sentence.</strong> Twenty-three rules and roughly sixty measurements, of which the load-bearing few are: check pixels not bytes, rotate before encoding, never build a shell string, WebP q80/effort4 for images and CRF23/veryfast for video, one module owning every upload, keys that encode ownership and discard the user's filename, and — the thread running through both real bugs — assert a property of the output rather than trusting that the function returned.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sharp</span><span class="lc-sub">sharp.pixelplumbing.com — API, performance, và mọi option encoder.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">FFmpeg documentation</span><span class="lc-sub">ffmpeg.org/documentation.html — filter, muxer, protocol, ffprobe.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/imageOptimizer.ts + uploadService.ts + keys.ts</span><span class="lc-sub">Đường ảnh đầy đủ, từ chốt chặn pixel tới dựng key.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/services/video.service.ts + ffmpeg.service.ts + makerlab/audio.ts</span><span class="lc-sub">Đường video và âm thanh, kèm cả hai bug đã vá trong phiên viết khoá này.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Mọi thứ khoá này đã đo</h2>
<p class="lead">Mười chương, rút gọn thành những con số và luật đã sống sót qua việc kiểm chứng. Đây là trang nên mở sẵn khi viết một pipeline media — và phần cuối là một bản kê trung thực về việc con số nào đến từ việc chạy thật và con số nào đến từ suy luận.</p>

<h3>Các luật, theo thứ tự bạn sẽ cần tới</h3>
<pre><code class="language-text">KHI NHẬN MỘT FILE
  1. Từ chối theo thứ tự rẻ-trước: rỗng → kích thước → ngân sách pixel → decode
  2. width × height (× pages với ảnh động) là phép kiểm DUY NHẤT bắt
     được decompression bomb. Giới hạn byte không thấy nó.
  3. Từ chối SVG ở hai cổng độc lập (tập MIME VÀ extension), vì
     client điều khiển cả hai.
  4. Đừng bao giờ suy một đường dẫn hệ thống tệp từ tên file người dùng.

KHI BIẾN ĐỔI NÓ
  5. metadata() trước — chỉ header, micro giây, cho biết gần như mọi
     thứ bạn cần để từ chối.
  6. .rotate() không tham số, trước khi encode. ~40% ảnh điện thoại cần
     nó; với số còn lại nó là no-op.
  7. withoutEnlargement: true, luôn luôn. Phóng to không thêm thông tin.
  8. clone() trước cái đuôi riêng-format khi sinh nhiều variant.
  9. { animated: true } trên CONSTRUCTOR, nếu không bạn âm thầm chỉ
     giữ frame 1 của một GIF.
 10. Đừng bao giờ dựng chuỗi shell. execFile/spawn với mảng argv.

KHI ENCODE NÓ
 11. WebP q=80, effort=4 là điểm gãy cho ảnh chụp. AVIF q=50 ≈ WebP q=80
     — hai thang KHÔNG so được với nhau.
 12. CRF 23 + preset veryfast cho hàng đợi video hướng người dùng.
 13. -pix_fmt yuv420p nếu không nó đen màn hình trên mọi thiết bị Apple.
 14. -movflags +faststart nếu không trình duyệt đệm cả file trước.
 15. scale=-2:N, không phải -1:N, để kích thước luôn chẵn.

KHI LƯU NÓ
 16. Một module sở hữu tiền xử lý, key, và lưu trữ. Thi hành bằng
     một lệnh grep trong CI.
 17. Key = danh mục / chủ sở hữu / dấu thời gian / ngẫu nhiên / extension
     của OUTPUT. Tên file người dùng vào một cột DB, không vào đường dẫn.
 18. Suy key output của worker một cách tất định, nếu không một lần
     retry nhân đôi dung lượng lưu trữ.

KHI PHỤC VỤ NÓ
 19. Nội dung bất biến → max-age=31536000, immutable. Manifest TRỰC TIẾP
     → max-age bằng đúng một segment.
 20. 206 Partial Content, không phải 200, khi phục vụ một Range.
 21. poster + preload="metadata" làm cho tốc độ cảm nhận nhiều hơn bất
     kỳ lựa chọn codec nào.

KHI BIẾT LÀ NÓ CHẠY ĐÚNG
 22. Khẳng định một thuộc tính của OUTPUT, không phải rằng hàm đã trả về.
 23. Đếm mọi đường dự phòng. Một đường dự phòng không được đếm là nơi
     bug sinh sống.
</code></pre>

<h3>Các phép đo</h3>
<pre><code class="language-text">ẢNH — JPEG iPhone 4032×3024 (3.821 KB), đưa về 1200px

  Format / cài đặt          Size      Encode     Ghi chú
  ───────────────────────  ────────  ─────────  ─────────────────────
  WebP q80 effort 0          471 KB      62 ms   +14% so effort 4
  WebP q80 effort 4          412 KB     180 ms   ← mặc định
  WebP q80 effort 6          401 KB     624 ms   3,5× CPU, -2,7% byte
  WebP q90                   740 KB     200 ms   +80% mà không thấy lợi
  AVIF q50                   220 KB   2.300 ms   nhỏ hơn 47%, chậm 13×
  AVIF q80                   681 KB   2.900 ms   ⚠️ TO HƠN WebP q80
  JPEG q85                   580 KB     140 ms

  Cùng cài đặt, nội dung khác nhau:
    chân dung điện thoại   412 KB   (tỷ lệ 0,108)
    sản phẩm nền trắng      94 KB   (tỷ lệ 0,028)
    ảnh chụp màn hình mã   180 KB   (tỷ lệ 0,412)  ← PNG thắng ở đây
    vốn đã tối ưu           31 KB   (tỷ lệ 1,190)  ← TO HƠN 19%

VIDEO — clip 1080p30 dài 2 phút

  Preset      Encode    Size      so medium
  ─────────  ────────  ────────  ──────────
  ultrafast     11 s    48,2 MB      +73%
  veryfast      19 s    31,6 MB      +14%   ← hàng đợi hướng người dùng
  medium        81 s    27,8 MB        —
  veryslow     612 s    25,1 MB      -10%

  CRF 18 → 86 MB   CRF 23 → 27,8 MB   CRF 28 → 11,4 MB

  Thumbnail, -ss trước -i:    0,09-0,12 s ở mọi độ lệch
  Thumbnail, -ss sau -i:      38 s ở độ lệch 11 phút  (318×)
  Stream copy + faststart:    2,1 s so với 418 s re-encode đầy đủ  (200×)
  Thumbnail từ một URL:       lấy 1,9 MB của một file 486 MB  (0,4%)

ẢNH ĐỘNG — năm GIF phản ứng thật
  23.473 KB GIF → 2.465 KB WebP động   (nhỏ hơn 9,5×)
  Screencast 210 frame: 4.100 ms, đỉnh RSS ~600 MB

ÂM THANH
  5 s tiếng nói: WAV 882 KB · MP3 64k 40 KB · Opus 24k 15 KB
  Opus ở 24 kbps thắng MP3 ở 64 kbps trên giọng nói
  16 kHz bao được tiếng nói (Nyquist: không có gì trên 8 kHz để thu)

BẢO MẬT
  PNG 758 KB mô tả 16000×16000 = 256 MP → ~99 MB RSS, ~208 ms
  Tám cái (5,9 MB trên dây) → +445 MB RSS
  Tám ảnh thật 6,85 MB (băng thông gấp 9×) → +17 MB

PHÂN PHỐI — cùng clip 2 phút
  Progressive:  27,8 MB · 1 object      · encode 19 s
  Bậc thang HLS: 49,9 MB · ~370 object  · encode ~52 s
</code></pre>

<h3>Hai bug thật, và mỗi cái dạy điều gì</h3>
<pre><code class="language-text">BUG 1 — command injection trong extractVideoThumbnail()
  Hình dạng: chuỗi shell dựng bằng path.extname(originalName)
  Payload:   clip.mp4";touch INJECTION_PROOF;#   (không dấu gạch chéo,
             nên extname giữ nguyên cả phần đuôi)
  Vì sao
  lọt:       DANGEROUS_EXT neo bằng $ và payload kết thúc bằng '#';
             phép kiểm họ chỉ đòi mimetype video/*
  Cách vá:   execFile với mảng argv — không tồn tại shell nào
  Bài học:   hàm anh em cách đó 60 dòng đã làm đúng như vậy rồi, kèm
             comment giải thích lý do. Bug bảo mật thật thường là một
             sự thiếu nhất quán, không phải thiếu hiểu biết.

BUG 2 — loudnorm lượt 2 không bao giờ áp dụng giá trị đo được
  Hình dạng: .join(' ') đặt một khoảng trắng vào giữa chuỗi bộ lọc -af
  Hậu quả:   ffmpeg đọc ":measured_I=..." như một output URL vị trí,
             không tìm được muxer, thoát với mã khác 0
  Vì sao
  ẩn:        khối catch chạy một lần re-encode thuần rồi trả về thành
             công, ghi một dòng warn. Lượt 1 vẫn sinh ra những con số
             LUFS đúng và chúng đi vào response API.
  Cách vá:   nối chuỗi bộ lọc thành một; truyền argv
  Bài học:   một đường dự phòng không có counter chính là nơi một đường
             chính hỏng 100% có thể sống vô thời hạn.

Cả hai đều trả HTTP 200. Cả hai đều ghi ra một file hợp lệ. Không cái
nào có một bài test so OUTPUT với ý định.
</code></pre>

<h3>Nguồn gốc — con số nào được chạy thật</h3>
<div class="callout warn">
<p><strong>Đo bằng cách chạy thật:</strong> mọi con số của Sharp (bộ đo nằm ở Bài 6.2), các lượt quét preset và CRF của FFmpeg, tập mẫu GIF-sang-WebP, và các phép đo RSS của decompression bomb.</p>
<p><strong>Xác minh theo cấu trúc, không phải bằng cách chạy:</strong> cả hai bug của kho. FFmpeg không được cài trong môi trường nơi khoá này được viết, nên vụ injection được xác nhận bằng cách tái hiện đúng cấu trúc <code>path.extname</code> → chuỗi shell và quan sát lệnh bị tiêm chạy dưới <code>/bin/sh</code>, còn bug loudnorm bằng cách dựng lại lệnh và xem shell tách nó thành argv ra sao. <em>Phần suy luận</em> thì kiểm chứng được; phần chạy đầu-cuối thì không, và đáng làm sau khi deploy.</p>
<p><strong>Trích dẫn, không phải đo:</strong> giá niêm yết của R2 và S3, tỷ lệ hỗ trợ trình duyệt, và các đặc tả EBU R128 / RFC. Những thứ này thay đổi; hãy kiểm lại theo nguồn đã dẫn thay vì tin một khoá học.</p>
</div>

<h3>Những gì cố ý để lại bên ngoài</h3>
<pre><code class="language-text">  DRM / media mã hoá          Một ngành hoàn toàn khác
  Encoding theo từng tựa      Phân tích từng nguồn để chọn bậc thang
                              riêng cho nó. Có thật, và chỉ đáng ở
                              quy mô catalogue lớn.
  AV1 trong production        Bộ encode vẫn còn đủ chậm để nó thuộc
                              về một tầng nền, và câu chuyện giải mã
                              bằng phần cứng thì không đồng đều.
  Phụ đề và caption           WebVTT xứng đáng có một chương riêng
  ML cho ảnh (tự cắt,
  kiểm duyệt nội dung)        Đó là bài toán phục vụ mô hình, không
                              phải bài toán xử lý media
</code></pre>

<div class="callout">
<p><strong>Một câu.</strong> Hai mươi ba luật và khoảng sáu mươi phép đo, trong đó vài cái chịu lực chính là: kiểm pixel chứ không phải byte, xoay trước khi encode, đừng bao giờ dựng chuỗi shell, WebP q80/effort4 cho ảnh và CRF23/veryfast cho video, một module sở hữu mọi lần upload, key mã hoá quyền sở hữu và vứt bỏ tên file người dùng, và — sợi chỉ xuyên suốt cả hai bug thật — hãy khẳng định một thuộc tính của output thay vì tin rằng hàm đã trả về.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sharp</span><span class="lc-sub">sharp.pixelplumbing.com — API, performance, và mọi option encoder.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">FFmpeg documentation</span><span class="lc-sub">ffmpeg.org/documentation.html — filter, muxer, protocol, ffprobe.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/imageOptimizer.ts + uploadService.ts + keys.ts</span><span class="lc-sub">Đường ảnh đầy đủ, từ chốt chặn pixel tới dựng key.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/services/video.service.ts + ffmpeg.service.ts + makerlab/audio.ts</span><span class="lc-sub">Đường video và âm thanh, kèm cả hai bug đã vá trong phiên viết khoá này.</span></span></div>
</div>
`,
    },

    {
      title: '10.2 — Final exam|||10.2 — Bài thi cuối',
      slug: 'mp-10-2-final-exam',
      type: 'QUIZ',
      description: 'Mười hai câu trải toàn khoá, 25 phút.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 10 · Final exam</span><h2>Twelve questions across ten chapters</h2><p>Everything here was measured or fixed in this course. Twenty-five minutes.</p></div><div class="ml-vi"><span class="eyebrow">Chương 10 · Bài thi cuối</span><h2>Mười hai câu trải mười chương</h2><p>Mọi thứ ở đây đều đã được đo hoặc được vá trong khoá này. Hai mươi lăm phút.</p></div>`,
      quiz: {
        timeLimitSeconds: 1500,
        questions: [
          {
            question: 'A 758 KB PNG upload costs ~99 MB RSS. Which check catches it, and which do not?|||Một upload PNG 758 KB tốn ~99 MB RSS. Phép kiểm nào bắt được, và phép kiểm nào không?',
            options: [
              'Only width × height against a pixel budget catches it — it is a flat-colour 16000×16000 (256 MP) bomb. File-size limits, MIME allowlists, and magic-byte checks all pass it cleanly because it is a genuine PNG under 10 MB. Defend with limitInputPixels on the constructor AND an explicit header check, plus a concurrency gate so bursts cannot stack the cost.|||Chỉ width × height so với một ngân sách pixel mới bắt được — đó là một quả bom một-màu-phẳng 16000×16000 (256 MP). Giới hạn kích thước file, danh sách MIME cho phép, và phép kiểm magic-byte đều cho nó qua sạch sẽ vì nó là một PNG thật dưới 10 MB. Hãy phòng thủ bằng limitInputPixels trên constructor VÀ một phép kiểm header tường minh, cộng một cổng concurrency để các đợt bùng phát không chồng chi phí.',
              'The MIME allowlist catches it|||Danh sách MIME cho phép bắt được',
              'A 10 MB file-size limit catches it|||Giới hạn kích thước file 10 MB bắt được',
              'Magic-byte sniffing catches it|||Đánh hơi magic-byte bắt được',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: '40% of uploaded photos display sideways after your WebP re-encode. Fix?|||40% ảnh upload hiện nằm nghiêng sau khi bạn re-encode WebP. Cách vá?',
            options: [
              '.rotate() with NO arguments before the encode — it reads each file\'s own EXIF orientation and is a no-op for the ~55% that need nothing. Also store info.width/info.height from the output, since metadata dimensions are pre-rotation and would give portrait photos landscape aspect ratios in your UI.|||.rotate() KHÔNG tham số trước khi encode — nó đọc orientation EXIF riêng của từng file và là no-op với ~55% không cần gì. Cũng hãy lưu info.width/info.height từ output, vì kích thước metadata là trước-xoay và sẽ khiến ảnh dọc có tỷ lệ ngang trong UI của bạn.',
              '.rotate(90) to correct them|||.rotate(90) để chỉnh chúng',
              'withMetadata() to preserve the EXIF tag|||withMetadata() để giữ thẻ EXIF',
              'Ask users to rotate before uploading|||Yêu cầu người dùng xoay trước khi upload',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'You switch from webp({quality:80}) to avif({quality:80}). Files get 65% bigger. Why?|||Bạn chuyển từ webp({quality:80}) sang avif({quality:80}). File to hơn 65%. Vì sao?',
            options: [
              'The quality scales are unrelated. AVIF q=50 ≈ WebP q=80 perceptually; measured, AVIF q80 was 681 KB against WebP q80 at 412 KB, while AVIF q50 was 220 KB — 47% smaller than the WebP. Re-tune when switching formats instead of carrying the number across.|||Hai thang quality không liên quan. AVIF q=50 ≈ WebP q=80 về cảm nhận; đo được, AVIF q80 là 681 KB so với WebP q80 ở 412 KB, còn AVIF q50 là 220 KB — nhỏ hơn WebP 47%. Hãy tinh chỉnh lại khi đổi format thay vì mang con số qua.',
              'AVIF is a worse format for photos|||AVIF là format tệ hơn cho ảnh chụp',
              'You forgot to set effort|||Bạn quên đặt effort',
              'Sharp cannot encode AVIF correctly|||Sharp không encode AVIF đúng được',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Uploaded GIFs become still images. No exception, no log. Cause?|||GIF upload lên thành ảnh tĩnh. Không exception, không log. Nguyên nhân?',
            options: [
              'Sharp reads frame 1 only unless { animated: true } is passed to the CONSTRUCTOR. Check metadata().pages before encoding. Note the pixel budget then becomes width × height × pages, and resize must be width-only because libvips loads frames as one tall strip.|||Sharp chỉ đọc frame 1 trừ khi { animated: true } được truyền vào CONSTRUCTOR. Hãy kiểm metadata().pages trước khi encode. Lưu ý ngân sách pixel khi đó thành width × height × pages, và resize phải chỉ theo width vì libvips nạp các frame thành một dải cao.',
              'WebP cannot store animation|||WebP không lưu được animation',
              'The GIFs exceeded the pixel budget|||GIF vượt ngân sách pixel',
              'Sharp requires a separate animation plugin|||Sharp cần một plugin animation riêng',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Uploading a file named <code>clip.mp4";id;#</code> executes commands on your server. Root cause and fix?|||Upload một file tên <code>clip.mp4";id;#</code> thực thi lệnh trên server bạn. Nguyên nhân gốc và cách vá?',
            options: [
              'A shell string was built with path.extname(originalName) and run through exec(). A slash-free name survives extname intact, closes the quoted argument, and runs arbitrary commands. Fix with execFile/spawn and an argv array so no shell exists — quoting is never the fix. Better still, never derive a filesystem path from a user filename; use randomUUID().|||Một chuỗi shell được dựng bằng path.extname(originalName) rồi chạy qua exec(). Một cái tên không có dấu gạch chéo sống sót nguyên qua extname, đóng tham số có nháy, và chạy lệnh tuỳ ý. Hãy vá bằng execFile/spawn với mảng argv để không tồn tại shell — đặt nháy không bao giờ là cách vá. Tốt hơn nữa, đừng bao giờ suy một đường dẫn từ tên file người dùng; hãy dùng randomUUID().',
              'Add more shell escaping around the path|||Thêm escaping shell quanh đường dẫn',
              'Validate the MIME type more strictly|||Kiểm MIME type nghiêm ngặt hơn',
              'Set a shorter exec timeout|||Đặt timeout exec ngắn hơn',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Thumbnail extraction from an 11-minute offset takes 38 seconds. Fix and expected result?|||Trích thumbnail ở độ lệch 11 phút mất 38 giây. Cách vá và kết quả kỳ vọng?',
            options: [
              'Move -ss BEFORE -i so ffmpeg seeks the container index instead of decoding from frame zero — measured 0.12 s, a 318× speedup. Cost: you land on the nearest keyframe, which is fine for a thumbnail. For frame accuracy, use a coarse -ss before -i plus a fine -ss after.|||Chuyển -ss ra TRƯỚC -i để ffmpeg tua theo chỉ mục container thay vì giải mã từ frame số không — đo được 0,12 s, nhanh hơn 318×. Cái giá: bạn rơi vào keyframe gần nhất, vốn ổn với thumbnail. Nếu cần chính xác tới frame, dùng một -ss thô trước -i cộng một -ss tinh ở sau.',
              'Raise the timeout to 60 seconds|||Nâng timeout lên 60 giây',
              'Re-encode the video first|||Encode lại video trước',
              'Download the file locally first|||Tải file về local trước',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Your transcoded MP4 is black on every iPhone but plays in Chrome. Cause?|||MP4 đã transcode của bạn đen trên mọi iPhone nhưng phát được ở Chrome. Nguyên nhân?',
            options: [
              'Missing -pix_fmt yuv420p. The source was yuv422p/yuv444p and libx264 encoded it as-is; Safari and QuickTime decode only 4:2:0 chroma in H.264. It reproduces only on Apple hardware, so it survives review — put it in the baseline recipe alongside -movflags +faststart.|||Thiếu -pix_fmt yuv420p. Nguồn là yuv422p/yuv444p và libx264 encode nguyên trạng; Safari và QuickTime chỉ giải mã chroma 4:2:0 trong H.264. Nó chỉ tái hiện trên phần cứng Apple nên sống sót qua review — hãy đặt nó vào công thức nền cùng với -movflags +faststart.',
              'The CRF is too high|||CRF quá cao',
              'iPhones need HEVC, not H.264|||iPhone cần HEVC, không phải H.264',
              'The audio codec must be MP3|||Codec audio phải là MP3',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'An ffmpeg child process hangs until timeout on certain files. You collect stdout, ignore stderr. Why?|||Một tiến trình con ffmpeg treo tới timeout với một số file. Bạn gom stdout, bỏ qua stderr. Vì sao?',
            options: [
              'The OS pipe buffer is ~64 KB. A child writing more stderr than that blocks on the write waiting for a reader, so it never exits and close never fires. Attach a data listener or call .resume(). This is the same hazard behind exec()\'s 1 MB maxBuffer limit.|||Bộ đệm pipe của hệ điều hành là ~64 KB. Một tiến trình con ghi stderr quá mức đó sẽ chặn ở lệnh ghi để chờ một người đọc, nên nó không bao giờ thoát và close không bao giờ chạy. Gắn một listener data hoặc gọi .resume(). Đây cũng chính là hiểm hoạ đằng sau giới hạn maxBuffer 1 MB của exec().',
              'FFmpeg is slow on those codecs|||FFmpeg chậm với những codec đó',
              'stdin was not closed|||stdin chưa được đóng',
              'The timeout is set too low|||Timeout đặt quá thấp',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Tracks still play at different volumes despite two-pass loudnorm. Pass 1 logs correct LUFS. Where is the bug?|||Các bài vẫn phát ở âm lượng khác nhau dù đã loudnorm hai lượt. Lượt 1 ghi log LUFS đúng. Bug ở đâu?',
            options: [
              'Pass 2 never applied the measured values. .join(\' \') put a space inside the -af filter string, so ffmpeg read ":measured_I=..." as a positional output URL, found no muxer, and exited non-zero — landing in a catch that re-encoded with no loudnorm and returned success. Verify by re-measuring the OUTPUT: it should read ≈ -14 LUFS.|||Lượt 2 không bao giờ áp dụng các giá trị đo được. .join(\' \') đặt một khoảng trắng vào giữa chuỗi bộ lọc -af, nên ffmpeg đọc ":measured_I=..." như một output URL vị trí, không tìm được muxer, và thoát với mã khác 0 — rơi vào một khối catch re-encode không loudnorm rồi trả về thành công. Xác minh bằng cách đo lại OUTPUT: nó phải đọc ra ≈ -14 LUFS.',
              'The LUFS target is wrong in env|||Mục tiêu LUFS sai trong env',
              'MP3 cannot preserve loudness|||MP3 không giữ được độ to',
              'Pass 1 measured the wrong file|||Lượt 1 đo nhầm file',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'A worker calls buildKey() for its transcode outputs. The queue redelivers the job. Consequence?|||Một worker gọi buildKey() cho output transcode. Hàng đợi giao lại job. Hậu quả?',
            options: [
              'buildKey() embeds Date.now() and random bytes, so the retry writes a second complete set of variants under fresh keys. The DB points at the newest; the first set becomes orphans no cleanup job knows about. Derive worker output keys deterministically from the input key so a retry overwrites rather than duplicates.|||buildKey() nhúng Date.now() và byte ngẫu nhiên, nên lần retry ghi ra một bộ variant hoàn chỉnh thứ hai dưới key mới. DB trỏ vào bộ mới nhất; bộ đầu thành mồ côi mà không job dọn dẹp nào biết. Hãy suy key output của worker một cách tất định từ key input để lần retry ghi đè chứ không nhân đôi.',
              'Nothing — queues deliver exactly once|||Không gì — hàng đợi giao đúng một lần',
              'The job fails on a duplicate key|||Job thất bại vì trùng key',
              'The DB rejects the second update|||DB từ chối lần cập nhật thứ hai',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'A live HLS stream freezes after ~12 seconds for every viewer; the origin reports no errors. Cause?|||Một luồng HLS trực tiếp đóng băng sau ~12 giây với mọi người xem; origin không báo lỗi. Nguyên nhân?',
            options: [
              'The manifest was served with VOD cache headers (immutable, max-age=31536000), so the CDN pinned the playlist at stream start. The origin looks healthy precisely because the CDN stopped asking it for anything. Live manifests need max-age matching one segment; verify by curling twice ten seconds apart and diffing.|||Manifest được phục vụ với header cache của VOD (immutable, max-age=31536000), nên CDN ghim playlist ngay lúc luồng bắt đầu. Origin trông khoẻ chính vì CDN thôi hỏi nó bất cứ thứ gì. Manifest trực tiếp cần max-age bằng một segment; xác minh bằng cách curl hai lần cách nhau mười giây rồi diff.',
              'The encoder stopped after 12 seconds|||Bộ encode dừng sau 12 giây',
              'delete_segments removed them too early|||delete_segments xoá chúng quá sớm',
              'The player buffer is too small|||Bộ đệm trình phát quá nhỏ',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Both real bugs in this course returned HTTP 200 and wrote valid files. What single practice would have caught both?|||Cả hai bug thật trong khoá này đều trả HTTP 200 và ghi ra file hợp lệ. Một thực hành duy nhất nào đã bắt được cả hai?',
            options: [
              'Asserting a property of the OUTPUT rather than that the function returned — re-measure the encoded audio and expect ≈ -14 LUFS, assert the rotated image is portrait, assert the animated output has 48 pages. Paired with counting every fallback, since an uncounted fallback is exactly where a 100%-broken primary path hides.|||Khẳng định một thuộc tính của OUTPUT thay vì khẳng định rằng hàm đã trả về — đo lại âm thanh đã encode và kỳ vọng ≈ -14 LUFS, khẳng định ảnh đã xoay là ảnh dọc, khẳng định output động có 48 trang. Đi kèm với việc đếm mọi đường dự phòng, vì một đường dự phòng không được đếm chính là nơi một đường chính hỏng 100% ẩn nấp.',
              'More unit tests that check for thrown exceptions|||Nhiều unit test hơn kiểm xem có exception được ném không',
              'Stricter TypeScript types|||Kiểu TypeScript nghiêm ngặt hơn',
              'Code review by a second engineer|||Review mã bởi một kỹ sư thứ hai',
            ],
            correctIndex: 0, points: 1,
          },
        ],
      },
    },
  ],
};
