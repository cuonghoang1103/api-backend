const REF = '?ref=%2Fcourses%2Fmedia-processing%2Flearn&reflabel=Media%20Processing';
export default {
  title: 'Chapter 9 — Diagnosis cookbook|||Chương 9 — Sách công thức chẩn đoán',
  slug: 'mp-ch9-chan-doan',
  description: 'Ba bài chẩn đoán: triệu chứng tới nguyên nhân, bug im lặng, và kiểm tra.',
  sortOrder: 10,
  lessons: [

    {
      title: '9.1 — Symptom to cause, in one table|||9.1 — Từ triệu chứng tới nguyên nhân, trong một bảng',
      slug: 'mp-9-1-symptoms',
      type: 'VIDEO',
      description: 'Fourteen symptoms from this course, each mapped to its cause and the one command that confirms it. This is the page to open when something is broken.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Symptom to cause, in one table</h2>
<p class="lead">Media bugs are unusually hard to diagnose because the failure is almost never at the point of failure — a sideways photo is a missing rotate three modules away, a silent GIF is a constructor option, a frozen live stream is a cache header. This lesson is the reverse index: what the user reports, what it actually is, and the single command that confirms it before you change anything.</p>

<h3>Images</h3>
<pre><code class="language-text">SYMPTOM                        CAUSE                      CONFIRM WITH
────────────────────────────  ─────────────────────────  ──────────────────────
~40% of photos are sideways    Missing .rotate() before   sharp(f).metadata()
                               the encode. EXIF tag       → orientation is 6 or 8
                               dropped on re-encode.      (Lesson 1.4)

Server RSS spikes on some      Decompression bomb: tiny   metadata().width ×
uploads; 758 KB file costs     file, enormous pixel       .height vs a budget.
~99 MB                         count.                     (Lesson 1.2)

Uploaded GIFs become still     Sharp read frame 1 only.   metadata().pages > 1
images, no error logged        { animated: true } is      but output pages === 1
                               missing on the CONSTRUCTOR (Lesson 2.2)

Small avatars look blurry      Upscaled. withoutEnlarge-  Compare output width
and files got bigger           ment not set.              to metadata().width
                                                          (Lesson 1.3)

AVIF files are LARGER than     Quality scale copied from  Re-encode at q=50 and
the WebP they replaced         WebP. AVIF q=80 ≈ much     compare. (Lesson 2.3)
                               higher quality.

A .png key serves as           Key derived from the       curl -I the URL, read
image/png but holds WebP       INPUT extension, not the   Content-Type
                               output format.             (Lesson 5.1)

Feed images render in Chrome,  SVG accepted and served    Check DANGEROUS_MIME /
blocked or scripted elsewhere  from the media origin.     DANGEROUS_EXT are both
                                                          enforced (Lesson 2.1)
</code></pre>

<h3>Video and audio</h3>
<pre><code class="language-text">SYMPTOM                        CAUSE                      CONFIRM WITH
────────────────────────────  ─────────────────────────  ──────────────────────
Thumbnail extraction takes     -ss placed AFTER -i, so    Move -ss before -i and
30+ seconds                    ffmpeg decodes from zero.  re-time. 318× measured
                                                          (Lesson 3.2)

Video is black on iPhone,      Missing -pix_fmt yuv420p.  ffprobe → pix_fmt is
fine in Chrome                 Safari decodes 4:2:0 only. yuv422p/444p
                                                          (Lesson 3.3)

Video takes 40 s to start      moov atom at end of file.  ffprobe -v trace 2>&1 |
                               No +faststart.             grep -m1 moov
                                                          (Lesson 3.2)

An ffmpeg child hangs until    stderr never drained; the  Attach a data listener
the timeout, on some files     child blocks writing past  or .resume(). ~64 KB
                               the ~64 KB pipe buffer.    pipe buffer (Lesson 4.1)

Tracks still play at wildly    loudnorm pass 2 failed and Re-measure the OUTPUT:
different volumes              the no-op fallback ran.    Input Integrated should
                                                          read ≈ -14 (Chapter 4)

Uploading a file named         Shell string built from    Any exec() with \${} —
clip.mp4";id;# runs commands   path.extname(originalName) rg 'exec' | rg '\\$\\{'
                               and passed to exec().      (Lesson 3.1)
</code></pre>

<h3>Streaming</h3>
<pre><code class="language-text">SYMPTOM                        CAUSE                      CONFIRM WITH
────────────────────────────  ─────────────────────────  ──────────────────────
HLS plays but has no seek      Missing -hls_playlist_     grep ENDLIST index.m3u8
bar and no duration            type vod → no ENDLIST →    → absent (Lesson 7.2)
                               treated as live

Live stream freezes after      VOD cache headers on a     curl the manifest twice
~12 s for everyone; origin     live manifest; CDN pinned  10 s apart and diff.
healthy                        the playlist.              Identical = wrong
                                                          (Lesson 8.1)

Rendition switching glitches   Keyframes not pinned, so   ffprobe -select_streams
on mobile, never in testing    segment boundaries drift   v -show_frames | grep
                               between renditions.        key_frame=1 (Lesson 7.2)

Seeking re-downloads from      Custom route returns 200   Network tab: expect 206
the start                      instead of 206 Partial     with Content-Range
                               Content.                   (Lesson 7.1)
</code></pre>

<h3>The four commands that cover most of the table</h3>
<pre><code class="language-bash"># 1. What IS this file, really?
ffprobe -v error -show_entries \\
  stream=codec_name,width,height,pix_fmt,sample_rate,channels:format=duration,size \\
  -of json input.mp4

# 2. Where is the moov atom? (faststart check)
ffprobe -v trace -i input.mp4 2>&amp;1 | grep -m1 -o 'type:.moov.*'
# Early in the output = front = good. Near the end = needs +faststart.

# 3. What does Sharp think of this image?
node -e "import('sharp').then(async ({default:s})=>console.log(await s('$1').metadata()))"
# Read: orientation, pages, width×height, format.

# 4. Is the served Content-Type right?
curl -sI "https://media.cuongthai.com/path/to/file.webp" \\
  | grep -iE 'content-type|content-length|accept-ranges|cache-control'
</code></pre>

<h3>The ordering rule that saves the most time</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Confirm what the file actually is before theorising</span><span class="lz-d">Half the symptoms above are &quot;the file is not what you think it is&quot;. <code>ffprobe</code> or <code>metadata()</code> costs a second and eliminates most of the table. Do it before reading any application code.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Check the headers before checking the bytes</span><span class="lz-d">Content-Type, Cache-Control, Accept-Ranges, and the status code explain the frozen live stream, the 40-second start, the re-downloading seek, and the wrong-format render. <code>curl -I</code> is faster than any code reading.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Reproduce on ONE file before touching the pipeline</span><span class="lz-d">Find a single input that shows the symptom and run the transform by hand. A bug that reproduces in a one-line script is a bug you can fix in minutes; the same bug observed only through the full upload path can take hours.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Compare against a known-good file</span><span class="lz-d">Run the same <code>ffprobe</code> on a file that works. The diff between the two outputs is usually the answer, and it is faster than reasoning about what the output <em>should</em> contain.</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — debugging through the browser instead of the file.</strong> &quot;It looks wrong in Chrome&quot; conflates the file, the headers, the CDN, and the renderer. Download the object, run <code>ffprobe</code>/<code>metadata()</code> on it, and you have separated four systems into one.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — trusting the file extension.</strong> A <code>.png</code> key can hold WebP bytes (Lesson 5.1's exact failure), a <code>.jpg</code> can be a mislabelled video, and a <code>.mp4</code> can be a MOV. Every diagnosis starts by asking the file what it is, not by reading its name.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Media failures are almost never located where they present — a sideways photo is a missing <code>.rotate()</code>, a silent GIF is a constructor option, a frozen live stream is a cache header — so work the table by symptom rather than by intuition, and follow a fixed order: ask the file what it is with <code>ffprobe</code>/<code>metadata()</code>, then check the served headers with <code>curl -I</code>, then reproduce on a single file by hand, then diff against a known-good example.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">FFmpeg — ffprobe</span><span class="lc-sub">ffmpeg.org/ffprobe.html — mọi trường show_entries dùng ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sharp — metadata()</span><span class="lc-sub">sharp.pixelplumbing.com/api-input#metadata — orientation, pages, format.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — HTTP headers reference</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTTP/Headers — Content-Type, Cache-Control, Accept-Ranges.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Từ triệu chứng tới nguyên nhân, trong một bảng</h2>
<p class="lead">Bug media khó chẩn đoán một cách khác thường vì chỗ hỏng gần như không bao giờ nằm ở điểm biểu hiện — một tấm ảnh nằm nghiêng là một lệnh rotate bị thiếu ở cách đó ba module, một GIF câm là một option của constructor, một luồng trực tiếp đóng băng là một header cache. Bài này là chỉ mục ngược: người dùng báo cái gì, thực chất nó là gì, và một lệnh duy nhất xác nhận điều đó trước khi bạn sửa bất cứ thứ gì.</p>

<h3>Ảnh</h3>
<pre><code class="language-text">TRIỆU CHỨNG                    NGUYÊN NHÂN                XÁC NHẬN BẰNG
────────────────────────────  ─────────────────────────  ──────────────────────
~40% ảnh nằm nghiêng           Thiếu .rotate() trước lúc  sharp(f).metadata()
                               encode. Thẻ EXIF rơi mất   → orientation là 6 hoặc 8
                               khi re-encode.             (Bài 1.4)

RSS server vọt lên với một số  Decompression bomb: file   metadata().width ×
upload; file 758 KB tốn ~99 MB nhỏ, số pixel khổng lồ.    .height so với ngân sách
                                                          (Bài 1.2)

GIF upload lên thành ảnh tĩnh, Sharp chỉ đọc frame 1.     metadata().pages > 1
không lỗi nào được ghi         Thiếu { animated: true }   mà output pages === 1
                               trên CONSTRUCTOR.          (Bài 2.2)

Avatar nhỏ trông mờ và file    Bị phóng to. Chưa đặt      So chiều rộng output với
lại to ra                      withoutEnlargement.        metadata().width (Bài 1.3)

File AVIF TO HƠN file WebP     Thang quality chép từ      Encode lại ở q=50 rồi so.
mà nó thay thế                 WebP. AVIF q=80 ≈ chất     (Bài 2.3)
                               lượng cao hơn nhiều.

Một key .png phục vụ dưới      Key suy từ extension của   curl -I cái URL, đọc
image/png nhưng chứa WebP      INPUT, không phải format   Content-Type
                               output.                    (Bài 5.1)

Ảnh feed render ở Chrome,      SVG được nhận và phục vụ   Kiểm cả DANGEROUS_MIME lẫn
bị chặn hoặc chạy script chỗ khác từ origin media.        DANGEROUS_EXT (Bài 2.1)
</code></pre>

<h3>Video và âm thanh</h3>
<pre><code class="language-text">TRIỆU CHỨNG                    NGUYÊN NHÂN                XÁC NHẬN BẰNG
────────────────────────────  ─────────────────────────  ──────────────────────
Trích thumbnail mất 30+ giây   -ss đặt SAU -i, nên ffmpeg Chuyển -ss ra trước -i
                               giải mã từ số không.       rồi đo lại. Đo được 318×
                                                          (Bài 3.2)

Video đen trên iPhone, tốt     Thiếu -pix_fmt yuv420p.    ffprobe → pix_fmt là
trên Chrome                    Safari chỉ giải mã 4:2:0.  yuv422p/444p (Bài 3.3)

Video mất 40 s mới bắt đầu     moov atom ở cuối file.     ffprobe -v trace 2>&1 |
                               Không có +faststart.       grep -m1 moov (Bài 3.2)

Tiến trình con ffmpeg treo tới stderr không được hút;     Gắn một listener data
timeout với một số file        tiến trình con chặn khi    hoặc .resume(). Bộ đệm
                               ghi quá bộ đệm ~64 KB.     pipe ~64 KB (Bài 4.1)

Các bài vẫn phát ở âm lượng    loudnorm lượt 2 thất bại   Đo lại OUTPUT: Input
chênh lệch lớn                 và đường dự phòng no-op    Integrated phải đọc ra
                               đã chạy.                   ≈ -14 (Chương 4)

Upload file tên                Chuỗi shell dựng từ        Bất kỳ exec() nào có \${} —
clip.mp4";id;# chạy lệnh       path.extname(originalName) rg 'exec' | rg '\\$\\{'
                               rồi đưa cho exec().        (Bài 3.1)
</code></pre>

<h3>Streaming</h3>
<pre><code class="language-text">TRIỆU CHỨNG                    NGUYÊN NHÂN                XÁC NHẬN BẰNG
────────────────────────────  ─────────────────────────  ──────────────────────
HLS phát được nhưng không có   Thiếu -hls_playlist_type   grep ENDLIST index.m3u8
thanh tua và không thời lượng  vod → không ENDLIST → bị   → không có (Bài 7.2)
                               coi là live

Luồng trực tiếp đóng băng sau  Header cache của VOD đặt   curl manifest hai lần
~12 s với mọi người; origin    lên manifest live; CDN     cách 10 s rồi diff.
vẫn khoẻ                       ghim playlist.             Giống hệt = sai (Bài 8.1)

Chuyển bản bị giật trên mobile Keyframe không được ghim,  ffprobe -select_streams
không bao giờ giật khi test    nên ranh giới segment trôi v -show_frames | grep
                               lệch giữa các bản.         key_frame=1 (Bài 7.2)

Tua lại tải từ đầu             Route tự viết trả 200 thay Tab Network: phải là 206
                               vì 206 Partial Content.    kèm Content-Range (Bài 7.1)
</code></pre>

<h3>Bốn lệnh phủ được phần lớn cái bảng</h3>
<pre><code class="language-bash"># 1. File này THỰC SỰ là cái gì?
ffprobe -v error -show_entries \\
  stream=codec_name,width,height,pix_fmt,sample_rate,channels:format=duration,size \\
  -of json input.mp4

# 2. moov atom nằm ở đâu? (kiểm faststart)
ffprobe -v trace -i input.mp4 2>&amp;1 | grep -m1 -o 'type:.moov.*'
# Xuất hiện sớm trong output = ở đầu = tốt. Gần cuối = cần +faststart.

# 3. Sharp nghĩ gì về tấm ảnh này?
node -e "import('sharp').then(async ({default:s})=>console.log(await s('$1').metadata()))"
# Đọc: orientation, pages, width×height, format.

# 4. Content-Type được phục vụ có đúng không?
curl -sI "https://media.cuongthai.com/path/to/file.webp" \\
  | grep -iE 'content-type|content-length|accept-ranges|cache-control'
</code></pre>

<h3>Luật thứ tự tiết kiệm nhiều thời gian nhất</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Xác nhận file thực sự là gì trước khi đặt giả thuyết</span><span class="lz-d">Một nửa số triệu chứng ở trên là &quot;file không phải cái bạn nghĩ&quot;. <code>ffprobe</code> hoặc <code>metadata()</code> tốn một giây và loại bỏ được phần lớn cái bảng. Hãy làm nó trước khi đọc bất kỳ dòng mã ứng dụng nào.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Kiểm header trước khi kiểm byte</span><span class="lz-d">Content-Type, Cache-Control, Accept-Ranges, và mã trạng thái giải thích được luồng trực tiếp đóng băng, cú khởi động 40 giây, lần tua tải lại từ đầu, và cảnh render sai format. <code>curl -I</code> nhanh hơn mọi lần đọc mã.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Tái hiện trên MỘT file trước khi động vào pipeline</span><span class="lz-d">Tìm một input duy nhất thể hiện triệu chứng rồi chạy phép biến đổi bằng tay. Một bug tái hiện được trong một script một dòng là một bug bạn vá được trong vài phút; cùng bug đó nếu chỉ quan sát qua toàn bộ đường upload có thể ngốn hàng giờ.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">So với một file biết chắc là tốt</span><span class="lz-d">Chạy cùng lệnh <code>ffprobe</code> trên một file chạy được. Phần khác nhau giữa hai output thường chính là câu trả lời, và cách đó nhanh hơn việc ngồi suy luận xem output <em>lẽ ra</em> phải chứa gì.</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — gỡ lỗi qua trình duyệt thay vì qua file.</strong> &quot;Nó trông sai trên Chrome&quot; gộp chung file, header, CDN, và bộ render lại làm một. Tải object về, chạy <code>ffprobe</code>/<code>metadata()</code> lên nó, và bạn vừa tách bốn hệ thống thành một.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — tin vào phần mở rộng file.</strong> Một key <code>.png</code> có thể chứa byte WebP (đúng kiểu hỏng ở Bài 5.1), một <code>.jpg</code> có thể là một video bị dán nhãn sai, và một <code>.mp4</code> có thể là một MOV. Mọi chẩn đoán bắt đầu bằng việc hỏi chính file nó là cái gì, không phải bằng việc đọc tên nó.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Sự cố media gần như không bao giờ nằm ở chỗ nó biểu hiện — một tấm ảnh nghiêng là thiếu <code>.rotate()</code>, một GIF câm là một option của constructor, một luồng trực tiếp đóng băng là một header cache — nên hãy tra bảng theo triệu chứng thay vì theo trực giác, và theo một thứ tự cố định: hỏi file nó là gì bằng <code>ffprobe</code>/<code>metadata()</code>, rồi kiểm header được phục vụ bằng <code>curl -I</code>, rồi tái hiện trên một file bằng tay, rồi so với một ví dụ biết chắc là tốt.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">FFmpeg — ffprobe</span><span class="lc-sub">ffmpeg.org/ffprobe.html — mọi trường show_entries dùng ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sharp — metadata()</span><span class="lc-sub">sharp.pixelplumbing.com/api-input#metadata — orientation, pages, format.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — HTTP headers reference</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/HTTP/Headers — Content-Type, Cache-Control, Accept-Ranges.</span></span></div>
</div>
`,
    },


    {
      title: '9.2 — The bugs that return success|||9.2 — Những bug trả về thành công',
      slug: 'mp-9-2-silent',
      type: 'VIDEO',
      description: 'Both real bugs in this repo returned HTTP 200 and logged nothing alarming. That is the hardest failure class, and it has a specific defence.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>The bugs that return success</h2>
<p class="lead">A crash gets fixed within a day. A bug that returns HTTP 200, writes a plausible-looking file, and logs at most one <code>warn</code> can live in production indefinitely — because every dashboard is green and nobody has a reason to look. Both real defects found in this repo while writing this course were of exactly this kind, and so are most of the pitfalls in Chapters 1-8.</p>

<h3>The pattern, stated generally</h3>
<pre><code class="language-text">A silent failure needs three ingredients:

  1. The operation produces OUTPUT that is structurally valid
     — a real WebP, a real MP3, a real 200 response

  2. Nothing compares that output to what was INTENDED
     — no assertion that the image rotated, that the audio
       was normalized, that the animation survived

  3. There is a fallback, a default, or a swallowed error
     that converts "wrong" into "different but fine"

Remove any one ingredient and the bug surfaces. Most systems have
all three by default, which is why this class is so common.
</code></pre>

<h3>Case 1 — the loudnorm fallback</h3>
<pre><code class="language-text">Chapter 4's bug, scored against the three ingredients:

  1. Valid output?     Yes — a correct 192 kbps MP3, plays everywhere
  2. Compared to
     intent?           No — nothing measured the output's loudness
  3. Fallback?         Yes — catch { fallbackCmd } re-encoded without
                       loudnorm and returned success

  Result: the feature ran three ffmpeg passes to accomplish a plain
  re-encode, for every track, while logging one warn line. Pass 1
  even produced correct LUFS numbers that went into the API response,
  so anyone checking "is measurement working?" got a yes.
</code></pre>

<h3>Case 2 — the command injection</h3>
<pre><code class="language-text">Chapter 3's bug, same scoring:

  1. Valid output?     Yes — the thumbnail was produced correctly.
                       ffmpeg ran, the injected command ran too, and
                       both succeeded.
  2. Compared to
     intent?           No — nothing asserted that ONLY ffmpeg ran
  3. Fallback?         Yes — catch { return null } made even a total
                       failure non-fatal by design

  Result: an exploited request is indistinguishable from a normal
  one in every log and metric. There is no error to alert on,
  because from the application's perspective nothing went wrong.
</code></pre>

<h3>The defence: assert on an output property</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Pick a property that only success produces</span><span class="lz-d">Not &quot;the function returned&quot; and not &quot;the file exists&quot; — both are true in every case above. Pick something that is <em>false</em> when the bug is present: the output's measured loudness, the output's orientation, the output's page count, the output's byte size relative to input.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Measure it on the OUTPUT, not the input</span><span class="lz-d">Pass 1 of loudnorm measured the input correctly and told you nothing about whether pass 2 worked. Re-reading the artifact you produced is the only check that spans the whole pipeline, including the parts that swallowed an error.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Count the fallbacks, do not just log them</span><span class="lz-d">A fallback expected to be rare that fires on 100% of requests is the loudest possible signal — but only if something counts it. A <code>warn</code> line in a log nobody greps is invisible; a counter on a dashboard makes &quot;the primary path never runs&quot; obvious in a glance.</span></div>
</div>

<h3>What that looks like in practice</h3>
<pre><code class="language-javascript">// The repo already has one of these and it is the model for the rest:
// uploadImage() logs originalSize → optimizedSize on every upload.
//
// That single line answers "is the optimizer still working?" — because
// if a deploy breaks Sharp and every image passes through unchanged,
// the ratio goes from ~0.11 to ~1.00 and it is visible in aggregate.

// Generalised: assert the property, count the exceptions.
const optimized = await optimizeImage(buf, mime)

metrics.histogram('media.compression_ratio',
  optimized.optimizedSize / optimized.originalSize)

if (optimized.optimizedSize &gt;= optimized.originalSize) {
  metrics.increment('media.reencode_larger')   // ← counted, not just logged
}
</code></pre>

<pre><code class="language-javascript">// For rotation — the Lesson 1.4 bug — the assertion is a test, not a metric:
const { info } = await optimizeImage(readFileSync('portrait-orient-6.jpg'), 'image/jpeg')
expect(info.height).toBeGreaterThan(info.width)   // must be portrait

// For animation — the Lesson 2.2 bug:
const out = await optimizeImage(readFileSync('animated.gif'), 'image/gif')
const outMeta = await sharp(out.buffer).metadata()
expect(outMeta.pages).toBe(48)                    // frames survived

// For loudness — the Chapter 4 bug: re-measure the output and expect ≈ -14.
</code></pre>

<p>Note what these have in common: each one would have <em>failed</em> while the bug was present, and each is a property of the artifact rather than of the code path. A test that only checks &quot;no exception was thrown&quot; passes in all three cases.</p>

<h3>The three-question review checklist</h3>
<pre><code class="language-text">When reviewing any media code, ask:

  1. If this silently did the WRONG thing, what would be different?
     If the answer is "nothing observable", you have found the gap.

  2. What does the catch block turn a failure into?
     Non-fatal is often correct — a missing thumbnail should not fail
     an upload. But then the fallback must be COUNTED, or you have
     built a place for bugs to hide.

  3. Is any check comparing the OUTPUT to the intent?
     Input validation is not output verification. Passing a pixel
     budget says nothing about whether the encode did what you asked.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — a fallback with no counter.</strong> Both repo bugs hid behind one. The fallback itself is usually the right design; what is missing is a metric that makes &quot;the primary path never runs&quot; visible. If a code path is expected to be rare, count it — then a 100% rate is an alert rather than an archaeology project.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — testing that the function returns.</strong> Every silent bug in this course returns normally. The test must assert a property of the artifact — its orientation, its page count, its measured loudness, its size ratio — because that is the only thing that differs between working and broken.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> The hardest media bugs return HTTP 200, write a structurally valid file, and log at most one <code>warn</code> — both real defects found in this repo were of that kind — and they require three ingredients (valid-looking output, nothing comparing output to intent, and a fallback that converts wrong into merely different), so the defence is to assert a property that only success produces, measure it on the <em>output</em> rather than the input, and put a counter on every fallback so a path that was supposed to be rare firing 100% of the time shows up as a signal instead of hiding as a log line.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/services/ffmpeg.service.ts</span><span class="lc-sub">Đường dự phòng loudnorm — đúng về ý định, nhưng không được đếm.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/services/video.service.ts</span><span class="lc-sub">Ngữ nghĩa non-fatal của thumbnail, và vì sao nó khiến việc khai thác trở nên vô hình.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/imageOptimizer.ts</span><span class="lc-sub"><code>formatSavings()</code> — một khẳng định trên thuộc tính output, vốn đã có sẵn trong kho.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Những bug trả về thành công</h2>
<p class="lead">Một cú crash được vá trong vòng một ngày. Một bug trả về HTTP 200, ghi ra một file trông có vẻ hợp lý, và ghi log nhiều nhất một dòng <code>warn</code> thì có thể sống trên production vô thời hạn — vì mọi dashboard đều xanh và không ai có lý do để nhìn vào. Cả hai khiếm khuyết thật tìm thấy trong kho này khi viết khoá học đều thuộc đúng loại đó, và phần lớn các cái bẫy ở Chương 1-8 cũng vậy.</p>

<h3>Cái pattern, nói một cách tổng quát</h3>
<pre><code class="language-text">Một thất bại câm cần ba nguyên liệu:

  1. Thao tác sinh ra OUTPUT hợp lệ về cấu trúc
     — một file WebP thật, một file MP3 thật, một response 200 thật

  2. Không có gì so cái output đó với cái ĐÃ ĐỊNH LÀM
     — không khẳng định nào rằng ảnh đã xoay, rằng âm thanh đã được
       chuẩn hoá, rằng animation còn sống sót

  3. Có một đường dự phòng, một giá trị mặc định, hoặc một lỗi bị nuốt
     biến "sai" thành "khác đi nhưng vẫn ổn"

Bỏ đi một nguyên liệu bất kỳ là bug lộ ra. Hầu hết hệ thống có sẵn cả
ba theo mặc định, đó là lý do lớp bug này phổ biến đến vậy.
</code></pre>

<h3>Ca 1 — đường dự phòng loudnorm</h3>
<pre><code class="language-text">Bug ở Chương 4, chấm theo ba nguyên liệu:

  1. Output hợp lệ?    Có — một MP3 192 kbps đúng chuẩn, phát được mọi nơi
  2. So với ý định?    Không — không gì đo độ to của output
  3. Dự phòng?         Có — catch { fallbackCmd } re-encode mà không
                       loudnorm rồi trả về thành công

  Kết quả: tính năng chạy ba lượt ffmpeg để hoàn thành một lần re-encode
  thuần, với mọi bài hát, trong khi ghi một dòng warn. Lượt 1 thậm chí
  còn sinh ra những con số LUFS đúng và chúng đi vào response API, nên
  ai kiểm "phép đo có chạy không?" đều nhận được câu trả lời có.
</code></pre>

<h3>Ca 2 — vụ command injection</h3>
<pre><code class="language-text">Bug ở Chương 3, chấm tương tự:

  1. Output hợp lệ?    Có — thumbnail được tạo ra đúng. ffmpeg đã chạy,
                       lệnh bị tiêm cũng chạy, và cả hai đều thành công.
  2. So với ý định?    Không — không gì khẳng định rằng CHỈ ffmpeg chạy
  3. Dự phòng?         Có — catch { return null } khiến ngay cả một thất
                       bại toàn phần cũng là non-fatal theo thiết kế

  Kết quả: một request bị khai thác không phân biệt được với một request
  bình thường trong mọi log và mọi chỉ số. Không có lỗi nào để cảnh báo,
  vì dưới góc nhìn của ứng dụng thì chẳng có gì sai cả.
</code></pre>

<h3>Cách phòng thủ: khẳng định trên một thuộc tính của output</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Chọn một thuộc tính mà chỉ thành công mới sinh ra</span><span class="lz-d">Không phải &quot;hàm đã trả về&quot; và không phải &quot;file tồn tại&quot; — cả hai đều đúng trong mọi ca ở trên. Hãy chọn thứ gì đó <em>sai</em> khi bug có mặt: độ to đo được của output, orientation của output, số trang của output, tỷ lệ byte của output so với input.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đo nó trên OUTPUT, không phải trên input</span><span class="lz-d">Lượt 1 của loudnorm đo input đúng và chẳng nói gì cho bạn biết về việc lượt 2 có chạy không. Đọc lại chính cái sản phẩm bạn vừa tạo ra là phép kiểm duy nhất trải suốt cả pipeline, kể cả những đoạn đã nuốt mất một lỗi.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Hãy đếm các lần dự phòng, đừng chỉ ghi log</span><span class="lz-d">Một đường dự phòng được kỳ vọng là hiếm mà lại phát tác trên 100% request chính là tín hiệu to nhất có thể có — nhưng chỉ khi có thứ gì đó đếm nó. Một dòng <code>warn</code> trong log không ai grep là vô hình; một counter trên dashboard làm cho chuyện &quot;đường chính không bao giờ chạy&quot; hiện ra chỉ trong một cái liếc.</span></div>
</div>

<h3>Trong thực tế nó trông thế nào</h3>
<pre><code class="language-javascript">// Kho vốn đã có sẵn một cái như vậy và nó là hình mẫu cho phần còn lại:
// uploadImage() ghi log originalSize → optimizedSize ở mọi lần upload.
//
// Một dòng đó trả lời câu "bộ tối ưu còn chạy không?" — vì nếu một lần
// deploy làm hỏng Sharp và mọi ảnh đi qua nguyên vẹn, tỷ lệ nhảy từ
// ~0,11 lên ~1,00 và điều đó nhìn thấy được ở mức tổng hợp.

// Tổng quát hoá: khẳng định thuộc tính, đếm các trường hợp ngoại lệ.
const optimized = await optimizeImage(buf, mime)

metrics.histogram('media.compression_ratio',
  optimized.optimizedSize / optimized.originalSize)

if (optimized.optimizedSize &gt;= optimized.originalSize) {
  metrics.increment('media.reencode_larger')   // ← được đếm, không chỉ log
}
</code></pre>

<pre><code class="language-javascript">// Với phép xoay — bug ở Bài 1.4 — khẳng định là một bài test, không phải metric:
const { info } = await optimizeImage(readFileSync('portrait-orient-6.jpg'), 'image/jpeg')
expect(info.height).toBeGreaterThan(info.width)   // phải là ảnh dọc

// Với animation — bug ở Bài 2.2:
const out = await optimizeImage(readFileSync('animated.gif'), 'image/gif')
const outMeta = await sharp(out.buffer).metadata()
expect(outMeta.pages).toBe(48)                    // các frame còn sống sót

// Với độ to — bug ở Chương 4: đo lại output và kỳ vọng ≈ -14.
</code></pre>

<p>Chú ý điểm chung của chúng: mỗi cái đều sẽ <em>thất bại</em> khi bug còn hiện diện, và mỗi cái đều là một thuộc tính của sản phẩm chứ không phải của đường mã. Một bài test chỉ kiểm &quot;không có exception nào được ném&quot; sẽ pass trong cả ba ca.</p>

<h3>Checklist ba câu hỏi khi review</h3>
<pre><code class="language-text">Khi review bất kỳ đoạn mã media nào, hãy hỏi:

  1. Nếu chỗ này âm thầm làm SAI, thì cái gì sẽ khác đi?
     Nếu câu trả lời là "không có gì quan sát được", bạn vừa tìm ra
     khoảng trống.

  2. Khối catch biến một thất bại thành cái gì?
     Non-fatal thường là đúng — thiếu một thumbnail không nên làm hỏng
     một lần upload. Nhưng khi đó đường dự phòng phải được ĐẾM, không
     thì bạn vừa xây một chỗ cho bug ẩn nấp.

  3. Có phép kiểm nào so OUTPUT với ý định không?
     Validation đầu vào không phải là xác minh đầu ra. Vượt qua một
     ngân sách pixel chẳng nói gì về việc lần encode có làm đúng thứ
     bạn yêu cầu hay không.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — một đường dự phòng không có counter.</strong> Cả hai bug của kho đều nấp sau một cái. Bản thân đường dự phòng thường là thiết kế đúng; thứ còn thiếu là một chỉ số làm cho chuyện &quot;đường chính không bao giờ chạy&quot; trở nên nhìn thấy được. Nếu một đường mã được kỳ vọng là hiếm, hãy đếm nó — khi đó tỷ lệ 100% là một cảnh báo chứ không phải một dự án khảo cổ.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — test rằng hàm có trả về.</strong> Mọi bug câm trong khoá này đều trả về bình thường. Bài test phải khẳng định một thuộc tính của sản phẩm — orientation của nó, số trang của nó, độ to đo được của nó, tỷ lệ kích thước của nó — vì đó là thứ duy nhất khác nhau giữa chạy đúng và hỏng.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Những bug media khó nhất đều trả về HTTP 200, ghi ra một file hợp lệ về cấu trúc, và ghi log nhiều nhất một dòng <code>warn</code> — cả hai khiếm khuyết thật tìm thấy trong kho này đều thuộc loại đó — và chúng cần ba nguyên liệu (output trông hợp lệ, không gì so output với ý định, và một đường dự phòng biến sai thành chỉ-là-khác), nên cách phòng thủ là khẳng định một thuộc tính mà chỉ thành công mới sinh ra, đo nó trên <em>output</em> chứ không phải input, và đặt một counter lên mọi đường dự phòng để một đường lẽ ra hiếm mà phát tác 100% thời gian hiện lên thành một tín hiệu thay vì ẩn mình thành một dòng log.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/services/ffmpeg.service.ts</span><span class="lc-sub">Đường dự phòng loudnorm — đúng về ý định, nhưng không được đếm.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/services/video.service.ts</span><span class="lc-sub">Ngữ nghĩa non-fatal của thumbnail, và vì sao nó khiến việc khai thác trở nên vô hình.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/imageOptimizer.ts</span><span class="lc-sub"><code>formatSavings()</code> — một khẳng định trên thuộc tính output, vốn đã có sẵn trong kho.</span></span></div>
</div>
`,
    },

    {
      title: '9.3 — Chapter 9 quiz|||9.3 — Kiểm tra Chương 9',
      slug: 'mp-9-3-quiz',
      type: 'QUIZ',
      description: 'Ba câu về chẩn đoán và bug câm.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 9 · Quiz</span><h2>What Chapter 9 established</h2></div><div class="ml-vi"><span class="eyebrow">Chương 9 · Kiểm tra</span><h2>Chương 9 đã dựng được gì</h2></div>`,
      quiz: {
        timeLimitSeconds: 300,
        questions: [
          {
            question: 'A user reports "the video is black on my iPhone but fine on my laptop". What is the first command you run?|||Người dùng báo "video đen trên iPhone của tôi nhưng tốt trên laptop". Lệnh đầu tiên bạn chạy là gì?',
            options: [
              'ffprobe on the file to read pix_fmt. Safari and QuickTime decode only 4:2:0 chroma in H.264, so a yuv422p/yuv444p source encoded without -pix_fmt yuv420p plays in Chrome and black-screens on Apple devices. Ask the file what it is before reading any application code — that eliminates most of the symptom table.|||ffprobe lên file để đọc pix_fmt. Safari và QuickTime chỉ giải mã chroma 4:2:0 trong H.264, nên một nguồn yuv422p/yuv444p encode mà không có -pix_fmt yuv420p sẽ phát được ở Chrome và đen màn hình trên thiết bị Apple. Hãy hỏi file nó là gì trước khi đọc bất kỳ dòng mã ứng dụng nào — việc đó loại bỏ phần lớn bảng triệu chứng.',
              'Check the CDN cache headers|||Kiểm header cache của CDN',
              'Re-encode at a lower CRF|||Encode lại ở CRF thấp hơn',
              'Look at the browser console on the iPhone|||Xem console trình duyệt trên iPhone',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'What three ingredients does a silent media bug need, and which one is easiest to remove?|||Một bug media câm cần ba nguyên liệu nào, và cái nào dễ loại bỏ nhất?',
            options: [
              'Structurally valid output, nothing comparing output to intent, and a fallback that turns wrong into merely different. The easiest to remove is the second: assert a property that only success produces — measured loudness, orientation, page count, size ratio — and measure it on the OUTPUT, not the input. Removing any one ingredient surfaces the bug.|||Output hợp lệ về cấu trúc, không gì so output với ý định, và một đường dự phòng biến sai thành chỉ-là-khác. Dễ loại bỏ nhất là cái thứ hai: khẳng định một thuộc tính mà chỉ thành công mới sinh ra — độ to đo được, orientation, số trang, tỷ lệ kích thước — và đo nó trên OUTPUT, không phải input. Bỏ đi một nguyên liệu bất kỳ là bug lộ ra.',
              'Bad input, missing validation, and no logging|||Input xấu, thiếu validation, và không có log',
              'A race condition, a retry, and a cache|||Một race condition, một lần retry, và một cache',
              'Missing types, missing tests, and missing docs|||Thiếu type, thiếu test, thiếu tài liệu',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'A catch block makes thumbnail failure non-fatal so an upload never fails. Is that wrong, and what is missing?|||Một khối catch làm cho thất bại thumbnail thành non-fatal để một lần upload không bao giờ hỏng. Điều đó có sai không, và cái gì còn thiếu?',
            options: [
              'The non-fatal design is right — a missing thumbnail should not cost the user their upload. What is missing is a COUNTER. A fallback expected to be rare that fires on 100% of requests is the loudest possible signal, but only if something counts it; a warn line in a log nobody greps is invisible. Both real bugs in this repo hid behind exactly such an uncounted fallback.|||Thiết kế non-fatal là đúng — thiếu một thumbnail không nên khiến người dùng mất bản upload. Cái còn thiếu là một COUNTER. Một đường dự phòng được kỳ vọng là hiếm mà phát tác trên 100% request là tín hiệu to nhất có thể có, nhưng chỉ khi có thứ gì đó đếm nó; một dòng warn trong log không ai grep là vô hình. Cả hai bug thật trong kho này đều nấp sau đúng một đường dự phòng không được đếm như vậy.',
              'Yes, wrong — thumbnail failure should fail the upload|||Có, sai — thất bại thumbnail nên làm hỏng lần upload',
              'Yes, wrong — the catch should re-throw|||Có, sai — khối catch nên ném lại lỗi',
              'Nothing is missing — a warn log is sufficient|||Không thiếu gì — một dòng log warn là đủ',
            ],
            correctIndex: 0, points: 1,
          },
        ],
      },
    },
  ],
};
