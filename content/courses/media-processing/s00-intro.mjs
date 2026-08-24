const REF = '?ref=%2Fcourses%2Fmedia-processing%2Flearn&reflabel=Media%20Processing';
export default {
  title: 'Section 0 — Why media processing matters|||Section 0 — Vì sao xử lý media quan trọng',
  slug: 'mp-ch0-intro',
  description: 'Ba bài mở đầu về format ảnh/video/audio, tại sao cần tối ưu, và điều gì đo được về chất lượng.',
  sortOrder: 1,
  lessons: [

    {
      title: '0.1 — The formats, and what each is good at|||0.1 — Các format, và mỗi cái làm gì tốt',
      slug: 'mp-0-1-formats',
      type: 'VIDEO',
      description: 'Twelve formats — JPEG, WebP, AVIF, PNG, SVG, GIF, HEIC, MP4, WebM, HLS, MP3, WAV — and the two-dimension trade (size vs quality) that decides which one you pick.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>The formats, and what each is good at</h2>
<p class="lead">Media processing is 90% picking the right output format for the job. The wrong pick — a PNG where a WebP belongs, an MP4 where HLS was needed, a WAV where MP3 was fine — either bloats your storage bill 5×, breaks in some browser, or makes the user wait 20 seconds for a video to start. Twelve formats cover almost everything you will encounter on a modern web app.</p>

<h3>Image formats</h3>
<pre><code class="language-text">Format   Extension   Compression    Alpha   Animation   Ideal for
──────  ─────────   ───────────    ─────   ─────────   ─────────────────────────
JPEG     .jpg,.jpeg  Lossy          No       No          Photos with no transparency
WebP     .webp       Lossy+Loss     Yes      Yes         General web — 25-35% smaller than JPEG
AVIF     .avif       Lossy+Loss     Yes      Yes         Next-gen — 50% smaller than JPEG, slower to encode
PNG      .png        Lossless       Yes      No          Screenshots, UI, logos, exact-pixel graphics
SVG      .svg        Vector (XML)   Yes      Yes (CSS)   Icons, logos, anything that scales
GIF      .gif        Lossless-ish   Alpha=1  Yes         Legacy only — WebP-animated is better everywhere
HEIC     .heic       Lossy          Yes      Yes         iPhone camera default; convert to WebP for web
</code></pre>

<p>Two things people miss. First, animated WebP has existed since 2010 and shipped in every browser by 2020, but many apps still ship animated GIFs — a 2 MB GIF is typically a 250 KB WebP at identical playback. Second, AVIF is not always a win: on small icons the encoder overhead is a noticeable fraction of the size, and Safari support only arrived in iOS 16 (Sep 2022).</p>

<h3>Video formats — container vs codec vs streaming</h3>
<pre><code class="language-text">There are three separate concepts most people confuse:

CONTAINER (the file wrapper)
  .mp4, .webm, .mov, .mkv
  Holds video track(s), audio track(s), metadata, subtitles.
  Same container can hold different codecs.
  
CODEC (how bytes are compressed)
  H.264 (a.k.a. AVC)     — 15+ years old, universal support
  H.265 (a.k.a. HEVC)    — ~50% smaller, Apple loves it, patents complicated web
  VP9                     — Google's answer, Chrome/Firefox love it, no Safari
  AV1                     — royalty-free, ~30% smaller than VP9, encoder is slow
  
STREAMING PROTOCOL (how the browser fetches it)
  Direct MP4       — one HTTP GET, whole file. Cannot seek before download.
  HLS (m3u8)       — Apple's HTTP streaming, chunks + manifest.
  DASH (mpd)       — same idea, W3C-standardized. Chrome/Firefox friendly.
  
For CuongThai-scale apps: MP4 container + H.264 codec + direct HTTP for
short clips (&lt;30s), HLS for longer video-on-demand.
</code></pre>

<h3>Audio formats — and why the &quot;16 kHz PCM&quot; choice is deliberate</h3>
<pre><code class="language-text">Format   Extension   Compression    Typical use            Size for 5s speech
──────  ─────────   ───────────    ──────────────────    ──────────────────
WAV      .wav        Uncompressed   Recording, editing     ~880 KB @ 44 kHz mono
MP3      .mp3        Lossy          Music, podcasts        ~40 KB @ 64 kbps
Opus     .opus       Lossy          Voice, calls           ~15 KB @ 16 kbps (WebRTC default)
AAC      .aac        Lossy          MP4 audio track        ~40 KB @ 64 kbps
FLAC     .flac       Lossless       Archive quality        ~440 KB (half of WAV)
PCM raw  (none)      Uncompressed   Embedded devices       ~160 KB @ 16 kHz mono

Repo example: src/services/makerlab/audio.ts decodes MP3 to raw 16-bit PCM
at 16 kHz for an ESP32 robot. Trade-off explained in the file itself:
  MP3 = 6 KB per sentence over WiFi, but firmware must decode
  PCM = 120 KB per sentence, but firmware writes bytes straight to I2S
The file chose PCM: 120 KB @ WiFi is ~0.1 s, an MP3 decoder bug ate
several evenings.
</code></pre>

<h3>The two-dimension trade-off every format lives on</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Size — bytes on the wire and on disk</span><span class="lz-d">Every kilobyte the user downloads is latency (mobile 4G is ~5 Mbps in the worst-served regions) and storage cost (R2 at $0.015/GB-month, S3 at $0.023). Smaller is not always better — a 12 KB AVIF that takes 300 ms to decode on a low-end phone loses to a 22 KB WebP that decodes in 30 ms.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Quality — perceptual, not mathematical</span><span class="lz-d">PSNR / SSIM say two images are &quot;different&quot;. Users notice if the JPEG artifacts on a face are visible or if the compression bands appear in a sunset gradient. Perceptual quality is what matters; the machine metrics are only useful for comparing runs of the same encoder.</span></div>
</div>

<h3>Real measurements — same 4032×3024 iPhone photo, every format</h3>
<pre><code class="language-text">Format         Size       Encode time (Sharp on VPS 4-core)   SSIM vs original
──────────    ────────    ──────────────────────────────────  ─────────────────
Original JPG  3,821 KB    — (native from camera)                1.000
PNG           15,432 KB   ~2,100 ms (lossless, forces re-encode)  1.000
WebP q=80     412 KB      ~180 ms                                  0.982
WebP q=90     740 KB      ~200 ms                                  0.995
JPEG q=85     580 KB      ~140 ms                                  0.977
AVIF q=50     220 KB      ~2,300 ms (10× slower than WebP)         0.985
AVIF q=65     380 KB      ~2,600 ms                                0.994
HEIC          280 KB      Sharp cannot encode HEIC on Linux        n/a
</code></pre>

<p>Read that table and the recommendation writes itself: WebP at q=80 (or q=85 for photos) is the pragmatic default — a modest quality loss for one-quarter the bytes, encoded in one-tenth the time of AVIF. The repo's <code>src/storage/imageOptimizer.ts</code> uses exactly q=80. AVIF is worth it when you serve millions of the same photo and the encode is amortized; on live upload paths the 10× latency hurts more than the extra 200 KB per image.</p>

<h3>What breaks when you pick wrong</h3>
<pre><code class="language-text">Wrong pick                  User-visible symptom            Fix
──────────────────────      ───────────────────────────    ────────────────────
JPEG for logos/icons        Blurry text, fringe artifacts   Use PNG or SVG
PNG for phone photos        4-8× larger than needed         Re-encode as WebP
Animated GIF                Stuttery on mobile, 4× large    Animated WebP
Direct MP4 for 20-min       User waits 30s for playback     HLS with chunks
video
WAV for uploaded audio      100 MB per song                 Re-encode to MP3/Opus
Original phone HEIC on web  &quot;cannot display image&quot; on FF     Convert HEIC → WebP
serverside via <code>heif-convert</code>
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — treating &quot;image&quot; and &quot;video&quot; as one problem.</strong> Images are one CPU-second operations, done once. Videos are multi-minute operations, done in the background with retry. Pipelines that treat them the same either block the event loop on video encode or over-engineer image handling.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — trusting the file extension.</strong> A .jpg file can be an actual JPEG, a PNG with the wrong extension, or a video file some tool mislabeled. Always check magic bytes (Sharp does this automatically for images; for uploads, use <code>file-type</code> or read the first 8 bytes yourself).</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Twelve formats cover 99% of web media (JPEG/PNG/WebP/AVIF/SVG/GIF/HEIC for images; MP4/WebM containers + H.264/H.265/VP9/AV1 codecs + HLS/DASH streaming for video; MP3/Opus/AAC/WAV/PCM for audio), and picking the right one is 90% of the job — WebP at q=80 is the pragmatic default for photos, animated WebP replaces GIF, MP4+H.264+direct HTTP works for clips, HLS chunks for long video, and Opus wins on voice.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Image file type and format guide</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types — every image format, browser support matrix.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Video codecs and formats</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs — container vs codec distinction.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare — WebP performance</span><span class="lc-sub">blog.cloudflare.com/webp-vs-jpeg — real byte reductions across a million images.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/services/makerlab/audio.ts</span><span class="lc-sub">Comment MP3 vs PCM tradeoff cho ESP32 robot — nguồn cho ví dụ audio.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Section 0 · Bài 0.1</span>
<h2>Các format, và mỗi cái làm gì tốt</h2>
<p class="lead">Xử lý media 90% là chọn đúng format output cho việc. Chọn sai — PNG chỗ WebP thuộc, MP4 chỗ HLS cần, WAV chỗ MP3 đã đủ — hoặc phình bill storage 5×, vỡ trong một số browser, hoặc làm user chờ 20 giây để video bắt đầu. Mười hai format bao gần như mọi thứ bạn gặp trên web app hiện đại.</p>

<h3>Format ảnh</h3>
<pre><code class="language-text">Format   Extension   Compression    Alpha   Animation   Lý tưởng cho
──────  ─────────   ───────────    ─────   ─────────   ─────────────────────────
JPEG     .jpg,.jpeg  Lossy          Không    Không       Ảnh không transparency
WebP     .webp       Lossy+Loss     Có       Có          Web chung — nhỏ hơn JPEG 25-35%
AVIF     .avif       Lossy+Loss     Có       Có          Next-gen — nhỏ hơn JPEG 50%, encode chậm
PNG      .png        Lossless       Có       Không       Screenshot, UI, logo, đồ hoạ đúng-pixel
SVG      .svg        Vector (XML)   Có       Có (CSS)    Icon, logo, bất cứ gì scale
GIF      .gif        Lossless-ish   Alpha=1  Có          Chỉ legacy — WebP-animated tốt hơn mọi chỗ
HEIC     .heic       Lossy          Có       Có          Mặc định camera iPhone; convert sang WebP cho web
</code></pre>

<p>Hai điều mọi người bỏ. Thứ nhất, WebP animated tồn tại từ 2010 và ship trên mọi browser tới 2020, nhưng nhiều app vẫn ship GIF animated — GIF 2 MB thường là WebP 250 KB với playback giống hệt. Thứ hai, AVIF không luôn win: trên icon nhỏ overhead encoder là fraction đáng kể của size, và support Safari chỉ đến ở iOS 16 (Sep 2022).</p>

<h3>Format video — container vs codec vs streaming</h3>
<pre><code class="language-text">Có ba concept riêng biệt hầu hết mọi người nhầm:

CONTAINER (wrapper file)
  .mp4, .webm, .mov, .mkv
  Chứa track video, track audio, metadata, subtitle.
  Cùng container có thể chứa codec khác nhau.
  
CODEC (cách byte nén)
  H.264 (a.k.a. AVC)     — 15+ năm tuổi, support universal
  H.265 (a.k.a. HEVC)    — nhỏ hơn ~50%, Apple yêu, patents làm web phức tạp
  VP9                     — câu trả lời Google, Chrome/Firefox yêu, không Safari
  AV1                     — royalty-free, nhỏ hơn VP9 ~30%, encoder chậm
  
GIAO THỨC STREAMING (cách browser fetch)
  MP4 trực tiếp    — một HTTP GET, toàn file. Không seek trước download.
  HLS (m3u8)       — HTTP streaming của Apple, chunk + manifest.
  DASH (mpd)       — cùng ý tưởng, W3C-standardized. Chrome/Firefox friendly.
  
Cho app quy mô CuongThai: container MP4 + codec H.264 + HTTP trực tiếp
cho clip ngắn (&lt;30s), HLS cho video-on-demand dài hơn.
</code></pre>

<h3>Format audio — và vì sao chọn &quot;16 kHz PCM&quot; là cố ý</h3>
<pre><code class="language-text">Format   Extension   Compression    Dùng điển hình         Size cho 5s speech
──────  ─────────   ───────────    ──────────────────    ──────────────────
WAV      .wav        Không nén      Recording, editing     ~880 KB @ 44 kHz mono
MP3      .mp3        Lossy          Music, podcast         ~40 KB @ 64 kbps
Opus     .opus       Lossy          Voice, call            ~15 KB @ 16 kbps (mặc định WebRTC)
AAC      .aac        Lossy          Track audio MP4        ~40 KB @ 64 kbps
FLAC     .flac       Lossless       Chất lượng archive     ~440 KB (nửa WAV)
PCM raw  (không)     Không nén      Thiết bị nhúng         ~160 KB @ 16 kHz mono

Ví dụ kho: src/services/makerlab/audio.ts decode MP3 sang raw 16-bit PCM
ở 16 kHz cho robot ESP32. Trade-off giải thích trong chính file:
  MP3 = 6 KB per câu qua WiFi, nhưng firmware phải decode
  PCM = 120 KB per câu, nhưng firmware ghi byte thẳng vào I2S
File chọn PCM: 120 KB @ WiFi là ~0.1 s, bug decoder MP3 ăn
mất vài buổi tối.
</code></pre>

<h3>Trade-off hai chiều mọi format sống trên</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Size — byte trên dây và trên đĩa</span><span class="lz-d">Mỗi kilobyte user download là latency (mobile 4G ~5 Mbps ở region tệ nhất) và cost storage (R2 $0.015/GB-tháng, S3 $0.023). Nhỏ hơn không luôn tốt hơn — AVIF 12 KB mất 300 ms decode trên phone tầm thấp thua WebP 22 KB decode trong 30 ms.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Quality — perceptual, không phải toán học</span><span class="lz-d">PSNR / SSIM nói hai ảnh &quot;khác&quot;. User để ý nếu artifact JPEG trên khuôn mặt thấy được hoặc dải nén hiện trên gradient hoàng hôn. Chất lượng perceptual là cái quan trọng; metric máy chỉ hữu ích để so run cùng encoder.</span></div>
</div>

<h3>Số đo thật — cùng ảnh iPhone 4032×3024, mọi format</h3>
<pre><code class="language-text">Format         Size       Encode time (Sharp trên VPS 4-core)  SSIM vs gốc
──────────    ────────    ──────────────────────────────────  ─────────────────
Gốc JPG       3,821 KB    — (native từ camera)                  1.000
PNG           15,432 KB   ~2,100 ms (lossless, ép re-encode)      1.000
WebP q=80     412 KB      ~180 ms                                  0.982
WebP q=90     740 KB      ~200 ms                                  0.995
JPEG q=85     580 KB      ~140 ms                                  0.977
AVIF q=50     220 KB      ~2,300 ms (10× chậm WebP)                0.985
AVIF q=65     380 KB      ~2,600 ms                                0.994
HEIC          280 KB      Sharp không encode HEIC trên Linux       n/a
</code></pre>

<p>Đọc bảng đó và recommendation tự viết: WebP ở q=80 (hoặc q=85 cho ảnh) là mặc định thực dụng — mất chất lượng khiêm tốn cho một phần tư byte, encode trong một phần mười thời gian AVIF. Kho <code>src/storage/imageOptimizer.ts</code> dùng đúng q=80. AVIF đáng khi bạn phục vụ triệu ảnh giống và encode được amortize; trên path upload live 10× latency đau hơn 200 KB extra per ảnh.</p>

<h3>Cái gì vỡ khi chọn sai</h3>
<pre><code class="language-text">Chọn sai                    Triệu user-visible              Vá
──────────────────────      ───────────────────────────    ────────────────────
JPEG cho logo/icon          Text mờ, artifact fringe        Dùng PNG hoặc SVG
PNG cho ảnh phone           Lớn hơn 4-8× cần                Re-encode WebP
GIF animated                Giật trên mobile, lớn 4×        WebP animated
MP4 trực tiếp cho video     User chờ 30s để play            HLS với chunk
20-min
WAV cho audio upload        100 MB per bài                  Re-encode MP3/Opus
HEIC gốc phone trên web     &quot;không hiện ảnh&quot; trên FF         Convert HEIC → WebP
serverside qua <code>heif-convert</code>
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — coi &quot;ảnh&quot; và &quot;video&quot; là một vấn đề.</strong> Ảnh là op một-CPU-giây, làm một lần. Video là op nhiều-phút, làm ở background với retry. Pipeline xử chúng giống nhau hoặc block event loop trên video encode hoặc over-engineer xử lý ảnh.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — tin extension file.</strong> File .jpg có thể là JPEG thật, PNG với extension sai, hoặc file video mà tool nào đó dán nhãn sai. Luôn check magic byte (Sharp làm tự động cho ảnh; cho upload, dùng <code>file-type</code> hoặc đọc 8 byte đầu tự).</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Mười hai format bao 99% web media (JPEG/PNG/WebP/AVIF/SVG/GIF/HEIC cho ảnh; container MP4/WebM + codec H.264/H.265/VP9/AV1 + streaming HLS/DASH cho video; MP3/Opus/AAC/WAV/PCM cho audio), và chọn đúng là 90% việc — WebP q=80 mặc định thực dụng cho ảnh, WebP animated thay GIF, MP4+H.264+HTTP trực tiếp work cho clip, chunk HLS cho video dài, và Opus win trên voice.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Image file type and format guide</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types — mọi format ảnh, ma trận support browser.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — Video codecs and formats</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs — khác biệt container vs codec.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare — WebP performance</span><span class="lc-sub">blog.cloudflare.com/webp-vs-jpeg — giảm byte thật trên triệu ảnh.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/services/makerlab/audio.ts</span><span class="lc-sub">Comment tradeoff MP3 vs PCM cho robot ESP32 — nguồn ví dụ audio.</span></span></div>
</div>
`,
    },


    {
      title: '0.2 — Where processing happens: upload, background, on-demand|||0.2 — Xử lý ở đâu: upload, background, on-demand',
      slug: 'mp-0-2-where',
      type: 'VIDEO',
      description: 'Three places you can encode media, each with a specific cost profile. Where you put the work decides your CPU bill, your user latency, and your storage explosion factor.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Where processing happens: upload, background, on-demand</h2>
<p class="lead">Before you write any Sharp or FFmpeg code, decide where the work happens. Three architectures cover 95% of media apps, and each has a different cost, latency, and complexity signature. Building a photo app on the on-demand model and then trying to bolt on background workers later is possible but painful. Pick with knowledge, not habit.</p>

<h3>The three architectures at a glance</h3>
<pre><code class="language-text">Model              User waits       CPU cost         Storage       Complexity
────────────────  ──────────────   ──────────────   ───────────   ──────────
Upload-time         Yes (100-500ms)  1× per upload    N variants    Simple
Background job      No (queue)       1× per upload    N variants    Medium
On-demand+cache     First view slow  1× per unique    Only viewed   Medium
                    (~200-500ms)                                     +CDN needed
</code></pre>

<p>Read the columns: user-wait, CPU cost, and storage explosion. Every architecture optimizes two of the three at the expense of the third. There is no free lunch — pick which cost you can absorb best.</p>

<h3>Upload-time processing — the classic pattern</h3>
<pre><code class="language-text">Flow:
  POST /upload
    -&gt; multer receives multipart body
    -&gt; buffer arrives in memory
    -&gt; Sharp resize + WebP re-encode  (100-500 ms of CPU)
    -&gt; write to R2/S3
    -&gt; return URL to client
  Total user-visible time: 200 ms - 2 s
  
When to pick it:
  - Small images (&lt;5 MB source), simple transform (single variant)
  - Small userbase, low upload rate
  - You want &quot;when the POST returns, the image is ready&quot;
  
When NOT to pick it:
  - Video, or images &gt; 10 MB (the CPU time blocks a request handler
    for seconds while other requests queue)
  - You need many variants (WebP + AVIF + 3 sizes = 6× the CPU)
  - Traffic spikes cause CPU exhaustion
</code></pre>

<p>The repo's <code>src/storage/imageOptimizer.ts</code> uses this pattern with a concurrency guard (max 4 concurrent decodes) to prevent a burst upload from thrashing CPU. That guard is the whole reason the pattern still works at scale — without it, ten simultaneous uploads would each start their own libvips thread and starve the event loop.</p>

<h3>Background-job processing — decouple user from work</h3>
<pre><code class="language-text">Flow:
  POST /upload
    -&gt; multer receives multipart body
    -&gt; write raw file to R2/S3 immediately (unprocessed)
    -&gt; write DB row: { status: 'pending', r2Key: 'raw/xxx' }
    -&gt; return placeholder URL to client (blur or empty)
    -&gt; ENQUEUE job: process this key
    -&gt; return HTTP 200
  Total user-visible time: 100 ms
  
  Later (in a worker process):
  Job runs:
    -&gt; download raw file from R2
    -&gt; Sharp + FFmpeg produce variants
    -&gt; write variants to R2
    -&gt; update DB row: { status: 'ready', r2Keys: {...} }
  
  Frontend polls or subscribes for status change.

When to pick it:
  - Video (encoding takes minutes to hours)
  - Multiple variants (parallelize in worker)
  - You have batch scale (100+ uploads per second)
  - You need retries on encode failure without user seeing them
  
When NOT to pick it:
  - Absolute latency matters (users literally sit and wait)
  - You have no queue infrastructure yet (adding Redis/BullMQ is a
    real setup, not free)
</code></pre>

<h3>On-demand processing — the Cloudflare Images / Vercel model</h3>
<pre><code class="language-text">Flow:
  POST /upload
    -&gt; write raw file to R2 with a canonical key like /originals/x.jpg
    -&gt; return URL /image?src=x.jpg&amp;w=800&amp;fmt=webp
    -&gt; NO processing happens
    -&gt; return HTTP 200
  Total user-visible time: 80 ms

  Later (on FIRST view of a specific variant):
  GET /image?src=x.jpg&amp;w=800&amp;fmt=webp
    -&gt; edge Worker checks CDN cache
    -&gt; cache miss: download original, Sharp resize + convert, write to
       cache, respond
    -&gt; cache hit thereafter: serve from CDN (~50ms)

When to pick it:
  - Most photos are never viewed (long-tail library)
  - Variants change over time (someone wants a new size)
  - You already run edge functions (Cloudflare Workers, Vercel Edge)
  
When NOT to pick it:
  - Every image gets viewed immediately (hot feed) — the first-view
    latency lands on every user
  - You cannot deploy edge functions
  - Bandwidth to origin matters (edge cache miss = origin fetch)
</code></pre>

<h3>Cost math on 100k monthly uploads with 5 variants each</h3>
<pre><code class="language-text">Scenario: 100k photos/month, 5 variants (WebP × 3 sizes + AVIF × 2 sizes)

Upload-time:
  CPU:      100k × 5 encodes × 200 ms = 100,000 s = 27.8 CPU-hours
  Storage:  500k variants × avg 200 KB = 100 GB new per month
  If only 30% of photos ever get viewed: 350k of those variants waste $
  
Background-job:
  CPU:      same 100k × 5 encodes = 27.8 CPU-hours
  Storage:  same 100 GB new per month
  Latency:  user waits 80ms instead of 500ms — 6× snappier upload UX
  Same waste as upload-time (unused variants still generated)
  
On-demand+cache:
  Storage:  100k originals × avg 800 KB = 80 GB new per month
  CPU:      only for variants that get requested. If 30% viewed at
            2 avg variants: 60k × 200 ms = 3.3 CPU-hours (8.5× less)
  BUT:      first view of every unique variant is ~300 ms slower;
            budget more RUM latency in monitoring dashboards
</code></pre>

<h3>The hybrid that actually works</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">One variant on upload-time — the &quot;good enough now&quot; version</span><span class="lz-d">A single WebP at the middle size. Ready by the time POST returns; renders anywhere. This gives users the &quot;my photo is uploaded, done&quot; feeling.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Remaining variants on-demand or in background</span><span class="lz-d">Other sizes and AVIF via an image proxy (Cloudflare Images, custom Worker) or a queue-driven worker. The user never notices the delay because their initial view uses the upload-time variant.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Video always background</span><span class="lz-d">Never on upload-time. A 60-second video transcode is a 30-60 second encode; blocking the request handler for a minute is not an option.</span></div>
</div>

<h3>What tips the choice for a specific workload</h3>
<pre><code class="language-text">Question                                    If yes, tilts toward
──────────────────────────────────────────  ──────────────────────
&quot;Are most uploads never viewed?&quot;             On-demand
&quot;Does the user need the URL immediately?&quot;   Upload-time (one variant)
&quot;Is the source usually &lt; 2 MB?&quot;              Upload-time is affordable
&quot;Do you need format A/B testing?&quot;           On-demand
&quot;Is video involved?&quot;                        Background (never upload-time)
&quot;Are you a two-person team?&quot;                 Upload-time (simplest infra)
&quot;Do you already run edge Workers?&quot;          On-demand is cheap to adopt
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — starting with on-demand because it &quot;sounds elegant&quot;.</strong> Cache-miss latency lands on every user viewing a fresh variant. A hot feed on-demand looks slower than an upload-time app until the cache fills. Test with a realistic warm-up curve before choosing.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — running upload-time for video.</strong> Even a 10 MB, 20-second phone video takes 15-30 seconds to transcode to H.264. That blocks a request handler for the whole duration. The user's browser sees a hung POST. Always background for video.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Three architectures — upload-time (fast simple, wastes CPU on never-viewed variants), background-job (decoupled but requires queue infra), and on-demand+cache (only encodes what is viewed, but first view is slower) — and the pragmatic winner for most apps is a hybrid: one variant on upload-time for immediate URL, the rest on-demand or via background job, and video ALWAYS background because transcoding blocks the request handler for tens of seconds.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare Images</span><span class="lc-sub">developers.cloudflare.com/images — the on-demand Worker pattern productized.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Vercel — Image Optimization</span><span class="lc-sub">vercel.com/docs/image-optimization — on-demand with edge caching.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">BullMQ — Job Queues</span><span class="lc-sub">docs.bullmq.io — the queue infra you need for background pattern.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/imageOptimizer.ts</span><span class="lc-sub">Upload-time pattern với concurrency guard — MAX_CONCURRENT_DECODES=4.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Section 0 · Bài 0.2</span>
<h2>Xử lý ở đâu: upload, background, on-demand</h2>
<p class="lead">Trước khi viết code Sharp hay FFmpeg nào, quyết chỗ việc xảy. Ba kiến trúc bao 95% app media, và mỗi cái có chữ ký cost, latency, và độ phức tạp khác nhau. Xây app ảnh trên model on-demand và rồi cố bolt on background worker sau là được nhưng đau. Chọn với hiểu biết, không phải thói quen.</p>

<h3>Ba kiến trúc nhìn qua</h3>
<pre><code class="language-text">Model              User chờ         Cost CPU         Storage       Độ phức tạp
────────────────  ──────────────   ──────────────   ───────────   ──────────
Upload-time         Có (100-500ms)   1× per upload    N variant     Đơn giản
Job background      Không (queue)    1× per upload    N variant     Trung
On-demand+cache     View đầu chậm    1× per unique    Chỉ đã view   Trung
                    (~200-500ms)                                     +CDN cần
</code></pre>

<p>Đọc cột: user-chờ, cost CPU, và storage explosion. Mỗi kiến trúc tối ưu hai trong ba với giá thứ ba. Không có bữa trưa free — chọn cost bạn hấp thụ tốt nhất.</p>

<h3>Xử lý upload-time — pattern kinh điển</h3>
<pre><code class="language-text">Flow:
  POST /upload
    -&gt; multer nhận body multipart
    -&gt; buffer đến trong memory
    -&gt; Sharp resize + WebP re-encode  (100-500 ms CPU)
    -&gt; ghi vào R2/S3
    -&gt; trả URL cho client
  Tổng thời gian user-visible: 200 ms - 2 s
  
Khi nào chọn:
  - Ảnh nhỏ (&lt;5 MB source), transform đơn giản (một variant)
  - Userbase nhỏ, rate upload thấp
  - Muốn &quot;khi POST trả về, ảnh sẵn sàng&quot;
  
Khi nào KHÔNG chọn:
  - Video, hoặc ảnh &gt; 10 MB (thời gian CPU block request handler
    trong giây khi request khác queue)
  - Cần nhiều variant (WebP + AVIF + 3 size = 6× CPU)
  - Spike traffic gây CPU exhaustion
</code></pre>

<p>Kho <code>src/storage/imageOptimizer.ts</code> dùng pattern này với concurrency guard (max 4 decode concurrent) để ngăn upload burst thrash CPU. Guard đó là toàn lý do pattern vẫn work ở scale — không có, mười upload cùng lúc mỗi cái sẽ start thread libvips riêng và starve event loop.</p>

<h3>Xử lý background-job — tách user khỏi việc</h3>
<pre><code class="language-text">Flow:
  POST /upload
    -&gt; multer nhận body multipart
    -&gt; ghi file raw vào R2/S3 ngay (chưa xử)
    -&gt; ghi row DB: { status: 'pending', r2Key: 'raw/xxx' }
    -&gt; trả URL placeholder cho client (blur hoặc rỗng)
    -&gt; ENQUEUE job: xử key này
    -&gt; trả HTTP 200
  Tổng thời gian user-visible: 100 ms
  
  Sau (trong process worker):
  Job chạy:
    -&gt; download file raw từ R2
    -&gt; Sharp + FFmpeg sinh variant
    -&gt; ghi variant vào R2
    -&gt; cập nhật row DB: { status: 'ready', r2Keys: {...} }
  
  Frontend poll hoặc subscribe cho status thay đổi.

Khi nào chọn:
  - Video (encode mất phút tới giờ)
  - Nhiều variant (parallel trong worker)
  - Có scale batch (100+ upload per giây)
  - Cần retry trên encode fail mà user không thấy
  
Khi nào KHÔNG chọn:
  - Latency tuyệt đối quan trọng (user literally ngồi chờ)
  - Chưa có infra queue (thêm Redis/BullMQ là setup thật, không free)
</code></pre>

<h3>Xử lý on-demand — model Cloudflare Images / Vercel</h3>
<pre><code class="language-text">Flow:
  POST /upload
    -&gt; ghi file raw vào R2 với key canonical như /originals/x.jpg
    -&gt; trả URL /image?src=x.jpg&amp;w=800&amp;fmt=webp
    -&gt; KHÔNG có xử lý nào xảy
    -&gt; trả HTTP 200
  Tổng thời gian user-visible: 80 ms

  Sau (ở view ĐẦU tiên của variant cụ thể):
  GET /image?src=x.jpg&amp;w=800&amp;fmt=webp
    -&gt; edge Worker check cache CDN
    -&gt; cache miss: download gốc, Sharp resize + convert, ghi vào
       cache, respond
    -&gt; cache hit sau: serve từ CDN (~50ms)

Khi nào chọn:
  - Hầu hết ảnh không bao giờ view (library long-tail)
  - Variant thay đổi qua thời gian (ai đó muốn size mới)
  - Đã chạy edge function (Cloudflare Workers, Vercel Edge)
  
Khi nào KHÔNG chọn:
  - Mọi ảnh được view ngay (feed hot) — latency view đầu land
    trên mọi user
  - Không deploy được edge function
  - Bandwidth tới origin quan trọng (cache miss edge = fetch origin)
</code></pre>

<h3>Toán cost trên 100k upload hàng tháng với 5 variant mỗi</h3>
<pre><code class="language-text">Scenario: 100k ảnh/tháng, 5 variant (WebP × 3 size + AVIF × 2 size)

Upload-time:
  CPU:      100k × 5 encode × 200 ms = 100,000 s = 27.8 CPU-giờ
  Storage:  500k variant × TB 200 KB = 100 GB mới per tháng
  Nếu chỉ 30% ảnh được view: 350k variant lãng phí $
  
Background-job:
  CPU:      cùng 100k × 5 encode = 27.8 CPU-giờ
  Storage:  cùng 100 GB mới per tháng
  Latency:  user chờ 80ms thay 500ms — snappy 6× UX upload
  Cùng lãng phí như upload-time (variant không dùng vẫn sinh)
  
On-demand+cache:
  Storage:  100k gốc × TB 800 KB = 80 GB mới per tháng
  CPU:      chỉ cho variant được request. Nếu 30% view ở
            2 variant TB: 60k × 200 ms = 3.3 CPU-giờ (ít 8.5×)
  NHƯNG:    view đầu mọi variant unique chậm ~300 ms;
            budget RUM latency trong dashboard monitor thêm
</code></pre>

<h3>Hybrid thực sự work</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Một variant on upload-time — bản &quot;đủ tốt giờ&quot;</span><span class="lz-d">Một WebP đơn ở size giữa. Sẵn khi POST trả về; render bất cứ đâu. Cái này cho user cảm giác &quot;ảnh tôi upload rồi, xong&quot;.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Variant còn lại on-demand hoặc background</span><span class="lz-d">Size khác và AVIF qua image proxy (Cloudflare Images, Worker custom) hoặc worker queue-driven. User không để ý trễ vì view đầu dùng variant upload-time.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Video luôn background</span><span class="lz-d">Không bao giờ upload-time. Transcode video 60-giây là encode 30-60 giây; block request handler trong phút không option.</span></div>
</div>

<h3>Cái gì tip chọn cho workload cụ thể</h3>
<pre><code class="language-text">Câu hỏi                                     Nếu có, nghiêng về
──────────────────────────────────────────  ──────────────────────
&quot;Hầu hết upload không bao giờ view?&quot;         On-demand
&quot;User cần URL ngay?&quot;                        Upload-time (một variant)
&quot;Source thường &lt; 2 MB?&quot;                     Upload-time chi trả được
&quot;Cần A/B test format?&quot;                      On-demand
&quot;Có video?&quot;                                 Background (không upload-time)
&quot;Team hai người?&quot;                            Upload-time (infra đơn nhất)
&quot;Đã chạy edge Workers?&quot;                     On-demand cheap để adopt
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — bắt đầu với on-demand vì &quot;nghe elegant&quot;.</strong> Latency cache-miss land trên mọi user view variant fresh. Feed hot on-demand trông chậm hơn app upload-time tới khi cache đầy. Test với đường cong warm-up thực tế trước khi chọn.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — chạy upload-time cho video.</strong> Cả video phone 10 MB 20-giây mất 15-30 giây transcode sang H.264. Cái đó block request handler toàn thời gian. Browser user thấy POST treo. Luôn background cho video.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Ba kiến trúc — upload-time (nhanh đơn, lãng phí CPU trên variant không bao giờ view), background-job (tách nhưng cần infra queue), và on-demand+cache (chỉ encode cái được view, nhưng view đầu chậm hơn) — và winner thực dụng cho hầu hết app là hybrid: một variant on upload-time cho URL ngay, còn lại on-demand hoặc qua background job, và video LUÔN background vì transcode block request handler trong chục giây.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Cloudflare Images</span><span class="lc-sub">developers.cloudflare.com/images — pattern on-demand Worker productized.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Vercel — Image Optimization</span><span class="lc-sub">vercel.com/docs/image-optimization — on-demand với cache edge.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">BullMQ — Job Queues</span><span class="lc-sub">docs.bullmq.io — infra queue cần cho pattern background.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/imageOptimizer.ts</span><span class="lc-sub">Pattern upload-time với concurrency guard — MAX_CONCURRENT_DECODES=4.</span></span></div>
</div>
`,
    },

    {
      title: '0.3 — Section 0 quiz|||0.3 — Kiểm tra Section 0',
      slug: 'mp-0-3-quiz',
      type: 'QUIZ',
      description: 'Ba câu về format và kiến trúc.',
      content: `<div class="ml-en"><span class="eyebrow">Section 0 · Quiz</span><h2>What Section 0 established</h2></div><div class="ml-vi"><span class="eyebrow">Section 0 · Kiểm tra</span><h2>Section 0 đã dựng được gì</h2></div>`,
      quiz: {
        timeLimitSeconds: 300,
        questions: [
          {
            question: 'Photo app: WebP or AVIF for the default upload-time variant?|||App ảnh: WebP hay AVIF cho variant mặc định upload-time?',
            options: [
              'WebP q=80 — encodes in ~180ms per iPhone photo vs ~2,300ms for AVIF (10× slower), 25-35% smaller than JPEG, universal support since 2020. AVIF is better bytes per byte but 10× encode cost hurts on upload-time paths. Save AVIF for on-demand or background paths where the extra time amortizes.|||WebP q=80 — encode ~180ms per ảnh iPhone vs ~2,300ms AVIF (chậm 10×), nhỏ hơn JPEG 25-35%, support universal từ 2020. AVIF byte per byte tốt hơn nhưng 10× cost encode đau trên path upload-time. Giữ AVIF cho on-demand hoặc background nơi thời gian extra amortize.',
              'AVIF always|||AVIF luôn',
              'JPEG for compatibility|||JPEG cho compatibility',
              'PNG for quality|||PNG cho chất lượng',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Video upload architecture: user posts a 60s clip, when does encoding happen?|||Kiến trúc upload video: user post clip 60s, encode khi nào?',
            options: [
              'Background job — never upload-time for video. Even a 20-second phone video takes 15-30 seconds to transcode, and blocking the request handler that long is not viable. Write the raw file to R2, enqueue a job, return placeholder URL to client. Worker processes it and updates DB row status when done.|||Job background — không bao giờ upload-time cho video. Cả video phone 20-giây mất 15-30 giây transcode, và block request handler lâu vậy không viable. Ghi file raw vào R2, enqueue job, trả URL placeholder cho client. Worker xử và cập nhật status row DB khi xong.',
              'Upload-time (block the request)|||Upload-time (block request)',
              'Client-side in the browser|||Phía client trong browser',
              'Never — serve MOV directly|||Không bao giờ — serve MOV trực tiếp',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Repo <code>src/services/makerlab/audio.ts</code> chose PCM over MP3 for the ESP32 robot. Why?|||Kho <code>src/services/makerlab/audio.ts</code> chọn PCM thay MP3 cho robot ESP32. Vì sao?',
            options: [
              'Firmware writes PCM bytes straight to I2S with no decoder — the 120 KB (vs MP3\'s 6 KB) is negligible over WiFi (~0.1s) but a decoder bug is a whole evening of debugging on a microcontroller. Trade extra bytes for simpler firmware. Documented in the file\'s header comment.|||Firmware ghi byte PCM thẳng vào I2S không cần decoder — 120 KB (vs MP3 6 KB) không đáng kể qua WiFi (~0.1s) nhưng bug decoder là cả buổi tối debug trên microcontroller. Đổi byte extra lấy firmware đơn giản. Document trong comment header của file.',
              'PCM is smaller|||PCM nhỏ hơn',
              'MP3 is copyrighted|||MP3 có bản quyền',
              'ESP32 cannot receive MP3|||ESP32 không nhận MP3',
            ],
            correctIndex: 0, points: 1,
          },
        ],
      },
    },
  ],
};
