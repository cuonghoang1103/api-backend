const REF = '?ref=%2Fcourses%2Fmedia-processing%2Flearn&reflabel=Media%20Processing';
export default {
  title: 'Chapter 1 — Sharp fundamentals|||Chương 1 — Nền tảng Sharp',
  slug: 'mp-ch1-sharp',
  description: 'Bốn bài về Sharp: mô hình pipeline lười, metadata trước mọi thứ, resize với fit mode, và bẫy EXIF rotation.',
  sortOrder: 2,
  lessons: [

    {
      title: '1.1 — The lazy pipeline: nothing runs until you ask for bytes|||1.1 — Pipeline lười: không gì chạy tới khi bạn đòi byte',
      slug: 'mp-1-1-pipeline',
      type: 'VIDEO',
      description: 'Sharp calls look like they do work. They do not. Every method returns the pipeline object and queues an instruction; the actual decode/encode happens only at toBuffer() or toFile(). Understanding this explains most Sharp surprises.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>The lazy pipeline: nothing runs until you ask for bytes</h2>
<p class="lead">The single most useful thing to understand about Sharp is that <code>sharp(buffer).resize(800).webp()</code> has not resized or encoded anything. It has built a description of what to do. Only <code>.toBuffer()</code> or <code>.toFile()</code> triggers libvips to actually stream pixels through that description. Once you internalize this, error timing, memory behavior, and the reuse rules all stop being mysterious.</p>

<h3>What each call actually returns</h3>
<pre><code class="language-javascript">import sharp from 'sharp'

const pipeline = sharp(inputBuffer)     // Sharp instance — no decode yet
  .resize({ width: 800 })               // returns the SAME instance
  .rotate()                             // returns the SAME instance
  .webp({ quality: 80 })                // returns the SAME instance

// At this point: zero pixels decoded, zero bytes encoded.
// Memory held: the input Buffer, plus a small instruction list.

const out = await pipeline.toBuffer()   // NOW libvips runs the whole chain
</code></pre>

<p>Every transform method returns <code>this</code>. That is why chaining works, and it is also why the chain is a mutable object rather than an immutable value. Two consequences follow immediately, and both bite people who assume the fluent API is functional.</p>

<h3>Consequence 1 — a pipeline is single-use for output</h3>
<pre><code class="language-javascript">// WRONG — the second toBuffer() may throw or return unexpected results
const p = sharp(input).resize(800)
const webp = await p.webp().toBuffer()
const jpeg = await p.jpeg().toBuffer()   // ⚠️ p now has BOTH webp+jpeg queued

// RIGHT — clone() forks the pipeline before divergence
const base = sharp(input).resize(800)
const webp = await base.clone().webp({ quality: 80 }).toBuffer()
const jpeg = await base.clone().jpeg({ quality: 85 }).toBuffer()
const avif = await base.clone().avif({ quality: 50 }).toBuffer()
</code></pre>

<p><code>clone()</code> is the correct tool for the &quot;one source, many variants&quot; case that every image pipeline eventually needs. It shares the decoded input but forks the instruction list, so the source is decoded once and each output encodes independently. Without it, you either re-read the input per variant (wasteful) or mutate one shared pipeline (wrong).</p>

<h3>Consequence 2 — errors surface at the output call, not the transform call</h3>
<pre><code class="language-javascript">// This does NOT throw, even for a corrupt/non-image buffer:
const p = sharp(Buffer.from('this is not an image'))
  .resize(800)
  .webp()

// This is where it throws:
try {
  await p.toBuffer()
} catch (err) {
  // err.message: "Input buffer contains unsupported image format"
}
</code></pre>

<p>People wrap the wrong line in try/catch and wonder why the handler never fires. The rule: <strong>wrap the <code>await</code>, not the chain.</strong> The repo's <code>src/storage/imageOptimizer.ts</code> follows this — its two try/catch blocks sit around <code>await pipeline.metadata()</code> and <code>await pipeline.webp(...).toBuffer()</code>, the only two places libvips can fail.</p>

<h3>The one exception: metadata() runs immediately (header only)</h3>
<pre><code class="language-javascript">const meta = await sharp(input).metadata()
// This DOES do work — but only parses the file header, not pixels.
// Cost: microseconds. Memory: negligible.
// Returns: { format, width, height, space, channels, depth,
//            density, hasAlpha, orientation, exif, icc, ... }
</code></pre>

<p>This is why <code>metadata()</code> is the correct first call in any real pipeline: it tells you the dimensions and format for a fraction of the cost of a decode, so you can reject bad input (too many pixels, wrong format, no dimensions) before committing CPU to a full decode. Lesson 1.2 covers what to do with each field.</p>

<h3>Where the memory actually goes</h3>
<pre><code class="language-text">Stage                       RSS held                Notes
─────────────────────────  ──────────────────────  ─────────────────────────
sharp(buffer) created       input buffer only        A 3 MB JPEG = 3 MB
.resize().webp() chained    + ~1 KB instructions     Free
await .metadata()           + header parse           Transient, microseconds
await .toBuffer()           + W × H × channels       ⚠️ THE REAL COST
                            + output buffer

A 4032×3024 RGB photo decoded:
  4032 × 3024 × 3 bytes = 36.6 MB of raw pixels
  Plus libvips working buffers (~2× for some ops)
  Plus the output WebP buffer (~400 KB)
  
The 3 MB JPEG on disk is a ~37-75 MB operation in RAM.
This is the number that matters for concurrency planning.
</code></pre>

<p>That table is the whole reason the repo gates concurrent encodes at 4. Ten simultaneous 4032×3024 uploads would be ~370 MB of raw pixel buffers at once, on a VPS with 6 GB total — enough to trigger the OOM killer alongside Postgres and the Next.js frontend.</p>

<h3>libvips streams — which is why it beats ImageMagick on memory</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">ImageMagick model: decode whole image to RAM, transform, encode</span><span class="lz-d">Peak memory is the full uncompressed bitmap, always. A 100 MP TIFF is 300 MB of RAM before any work begins.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">libvips model: demand-driven regions, streamed in tiles</span><span class="lz-d">libvips computes the output in horizontal strips, pulling only the input rows each strip needs. For a resize, peak memory is a few hundred rows, not the whole image. This is why Sharp routinely uses 4-10× less RAM than ImageMagick on the same job.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The catch: some operations force full materialization</span><span class="lz-d">Rotation by arbitrary angles, some composites, and <code>.raw()</code> output break the streaming model and materialize the whole bitmap. 90/180/270 rotations stay streamable; a 37° rotation does not.</span></div>
</div>

<h3>Measure it yourself</h3>
<pre><code class="language-javascript">import sharp from 'sharp'
import { readFileSync } from 'node:fs'

const input = readFileSync('photo-4032x3024.jpg')

function rssMB() { return Math.round(process.memoryUsage().rss / 1e6) }

console.log('before        ', rssMB(), 'MB')
const p = sharp(input).resize({ width: 1200 }).webp({ quality: 80 })
console.log('after chain   ', rssMB(), 'MB')   // basically unchanged
const out = await p.toBuffer()
console.log('after toBuffer', rssMB(), 'MB')   // the jump
console.log('output size   ', Math.round(out.length / 1024), 'KB')
</code></pre>
<div class="out">
<pre><code class="language-text">before         68 MB
after chain    68 MB        ← chaining costs nothing
after toBuffer 121 MB       ← +53 MB for one 12 MP decode
output size    412 KB</code></pre>
</div>

<h3>Sharp's own thread pool — the concurrency you did not configure</h3>
<pre><code class="language-javascript">import sharp from 'sharp'

console.log(sharp.concurrency())   // default: number of CPU cores
// libvips runs each operation across this many threads.
// These are NOT Node worker threads — they are native libvips threads,
// so they do not block the event loop, but they DO compete for CPU.

sharp.concurrency(2)   // cap libvips to 2 threads per operation

// Combined with an application-level gate (max N concurrent toBuffer
// calls), this gives you two independent dials:
//   sharp.concurrency()  = threads per image
//   your semaphore       = images at once
// Total CPU pressure = concurrency × simultaneous images.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — reusing a pipeline after <code>toBuffer()</code>.</strong> The instance is not reset. Calling <code>.jpeg().toBuffer()</code> on a pipeline that already ran <code>.webp().toBuffer()</code> gives you a pipeline with two output formats queued; which one wins is an implementation detail you should not depend on. Always <code>clone()</code> before the format-specific tail.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — assuming the chain is where the CPU goes.</strong> Profilers point at <code>toBuffer()</code> because that is where all the work happens. If you are timing a pipeline, time the await, and remember the number you get includes decode + transform + encode as one inseparable block. To separate them, encode to <code>.raw()</code> once to measure decode alone.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Sharp's transform methods return the same mutable instance and queue instructions without doing work, so nothing decodes until <code>toBuffer()</code>/<code>toFile()</code> — which means errors surface at the await (wrap that, not the chain), one pipeline cannot safely produce two output formats (use <code>clone()</code>), <code>metadata()</code> is the cheap header-only exception you should always call first, and the real memory cost is <code>width × height × channels</code> at output time, which is what your concurrency limit must be sized against.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sharp — API documentation</span><span class="lc-sub">sharp.pixelplumbing.com/api-constructor — the constructor, clone(), and chaining contract.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">libvips — How it works</span><span class="lc-sub">libvips.github.io/libvips/API/current/How-it-opens-files.html — the demand-driven streaming model.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sharp — Performance</span><span class="lc-sub">sharp.pixelplumbing.com/performance — benchmark vs ImageMagick/GraphicsMagick.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/imageOptimizer.ts</span><span class="lc-sub">Hai try/catch đặt đúng ở <code>metadata()</code> và <code>toBuffer()</code> — hai chỗ duy nhất libvips fail được.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Pipeline lười: không gì chạy tới khi bạn đòi byte</h2>
<p class="lead">Điều hữu ích nhất cần hiểu về Sharp là <code>sharp(buffer).resize(800).webp()</code> chưa resize hay encode gì cả. Nó dựng một mô tả việc cần làm. Chỉ <code>.toBuffer()</code> hoặc <code>.toFile()</code> mới kích libvips thực sự chảy pixel qua mô tả đó. Khi đã thấm cái này, thời điểm lỗi, hành vi memory, và luật tái dùng đều thôi bí ẩn.</p>

<h3>Mỗi lời gọi thực sự trả về gì</h3>
<pre><code class="language-javascript">import sharp from 'sharp'

const pipeline = sharp(inputBuffer)     // Sharp instance — chưa decode
  .resize({ width: 800 })               // trả về CHÍNH instance đó
  .rotate()                             // trả về CHÍNH instance đó
  .webp({ quality: 80 })                // trả về CHÍNH instance đó

// Tại đây: zero pixel decode, zero byte encode.
// Memory giữ: Buffer input, plus danh sách chỉ thị nhỏ.

const out = await pipeline.toBuffer()   // GIỜ libvips chạy cả chuỗi
</code></pre>

<p>Mọi method transform trả về <code>this</code>. Đó là vì sao chaining work, và cũng là vì sao chuỗi là object mutable chứ không phải giá trị immutable. Hai hệ quả theo ngay, và cả hai cắn người giả định API fluent là functional.</p>

<h3>Hệ quả 1 — một pipeline dùng một lần cho output</h3>
<pre><code class="language-javascript">// SAI — toBuffer() lần hai có thể throw hoặc trả kết quả bất ngờ
const p = sharp(input).resize(800)
const webp = await p.webp().toBuffer()
const jpeg = await p.jpeg().toBuffer()   // ⚠️ p giờ có CẢ webp+jpeg queued

// ĐÚNG — clone() rẽ nhánh pipeline trước khi phân kỳ
const base = sharp(input).resize(800)
const webp = await base.clone().webp({ quality: 80 }).toBuffer()
const jpeg = await base.clone().jpeg({ quality: 85 }).toBuffer()
const avif = await base.clone().avif({ quality: 50 }).toBuffer()
</code></pre>

<p><code>clone()</code> là tool đúng cho case &quot;một nguồn, nhiều variant&quot; mà mọi pipeline ảnh cuối cùng đều cần. Nó chia sẻ input đã decode nhưng rẽ nhánh danh sách chỉ thị, nên nguồn decode một lần và mỗi output encode độc lập. Không có nó, bạn hoặc đọc lại input per variant (lãng phí) hoặc mutate một pipeline chung (sai).</p>

<h3>Hệ quả 2 — lỗi hiện ở lời gọi output, không phải lời gọi transform</h3>
<pre><code class="language-javascript">// Cái này KHÔNG throw, cả với buffer hỏng/không phải ảnh:
const p = sharp(Buffer.from('this is not an image'))
  .resize(800)
  .webp()

// Đây mới là chỗ nó throw:
try {
  await p.toBuffer()
} catch (err) {
  // err.message: "Input buffer contains unsupported image format"
}
</code></pre>

<p>Người ta bọc nhầm dòng trong try/catch và thắc mắc vì sao handler không bao giờ chạy. Luật: <strong>bọc cái <code>await</code>, không phải cái chuỗi.</strong> Kho <code>src/storage/imageOptimizer.ts</code> theo đúng luật này — hai khối try/catch của nó ngồi quanh <code>await pipeline.metadata()</code> và <code>await pipeline.webp(...).toBuffer()</code>, hai chỗ duy nhất libvips fail được.</p>

<h3>Ngoại lệ duy nhất: metadata() chạy ngay (chỉ header)</h3>
<pre><code class="language-javascript">const meta = await sharp(input).metadata()
// Cái này CÓ làm việc — nhưng chỉ parse header file, không phải pixel.
// Cost: micro giây. Memory: không đáng kể.
// Trả về: { format, width, height, space, channels, depth,
//           density, hasAlpha, orientation, exif, icc, ... }
</code></pre>

<p>Đó là vì sao <code>metadata()</code> là lời gọi đầu đúng trong mọi pipeline thật: nó cho biết kích thước và format với một phần nhỏ cost của decode, nên bạn loại được input xấu (quá nhiều pixel, sai format, không có kích thước) trước khi cam kết CPU cho decode đầy đủ. Bài 1.2 nói về việc làm gì với từng field.</p>

<h3>Memory thực sự đi đâu</h3>
<pre><code class="language-text">Giai đoạn                   RSS giữ                 Ghi chú
─────────────────────────  ──────────────────────  ─────────────────────────
sharp(buffer) tạo           chỉ buffer input         JPEG 3 MB = 3 MB
.resize().webp() chain      + ~1 KB chỉ thị          Free
await .metadata()           + parse header           Thoáng qua, micro giây
await .toBuffer()           + W × H × channel        ⚠️ COST THẬT
                            + buffer output

Ảnh RGB 4032×3024 decode:
  4032 × 3024 × 3 byte = 36.6 MB pixel thô
  Plus buffer làm việc của libvips (~2× cho một số op)
  Plus buffer WebP output (~400 KB)
  
JPEG 3 MB trên đĩa là op ~37-75 MB trong RAM.
Đây là con số quan trọng để hoạch định concurrency.
</code></pre>

<p>Bảng đó là toàn bộ lý do kho chặn encode concurrent ở 4. Mười upload 4032×3024 đồng thời sẽ là ~370 MB buffer pixel thô cùng lúc, trên VPS tổng 6 GB — đủ để kích OOM killer bên cạnh Postgres và frontend Next.js.</p>

<h3>libvips chảy dòng — vì sao nó thắng ImageMagick về memory</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Mô hình ImageMagick: decode cả ảnh vào RAM, transform, encode</span><span class="lz-d">Đỉnh memory là bitmap không nén đầy đủ, luôn luôn. TIFF 100 MP là 300 MB RAM trước khi việc nào bắt đầu.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Mô hình libvips: vùng theo nhu cầu, chảy theo tile</span><span class="lz-d">libvips tính output theo dải ngang, chỉ kéo những hàng input mà mỗi dải cần. Với resize, đỉnh memory là vài trăm hàng, không phải cả ảnh. Đây là vì sao Sharp thường xuyên dùng RAM ít hơn ImageMagick 4-10× trên cùng việc.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Cái bẫy: một số op ép materialize toàn bộ</span><span class="lz-d">Xoay theo góc tuỳ ý, một số composite, và output <code>.raw()</code> phá mô hình streaming và materialize cả bitmap. Xoay 90/180/270 vẫn stream được; xoay 37° thì không.</span></div>
</div>

<h3>Tự đo lấy</h3>
<pre><code class="language-javascript">import sharp from 'sharp'
import { readFileSync } from 'node:fs'

const input = readFileSync('photo-4032x3024.jpg')

function rssMB() { return Math.round(process.memoryUsage().rss / 1e6) }

console.log('trước         ', rssMB(), 'MB')
const p = sharp(input).resize({ width: 1200 }).webp({ quality: 80 })
console.log('sau chain     ', rssMB(), 'MB')   // gần như không đổi
const out = await p.toBuffer()
console.log('sau toBuffer  ', rssMB(), 'MB')   // cú nhảy
console.log('size output   ', Math.round(out.length / 1024), 'KB')
</code></pre>
<div class="out">
<pre><code class="language-text">trước          68 MB
sau chain      68 MB        ← chaining không tốn gì
sau toBuffer   121 MB       ← +53 MB cho một decode 12 MP
size output    412 KB</code></pre>
</div>

<h3>Thread pool riêng của Sharp — concurrency bạn không config</h3>
<pre><code class="language-javascript">import sharp from 'sharp'

console.log(sharp.concurrency())   // mặc định: số nhân CPU
// libvips chạy mỗi operation trên bấy nhiêu thread.
// Đây KHÔNG phải Node worker thread — chúng là thread libvips native,
// nên chúng không block event loop, nhưng CÓ tranh CPU.

sharp.concurrency(2)   // chặn libvips ở 2 thread mỗi operation

// Kết hợp với cổng mức ứng dụng (tối đa N lời gọi toBuffer đồng thời),
// bạn có hai núm độc lập:
//   sharp.concurrency()  = thread mỗi ảnh
//   semaphore của bạn    = ảnh cùng lúc
// Áp lực CPU tổng = concurrency × ảnh đồng thời.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — tái dùng pipeline sau <code>toBuffer()</code>.</strong> Instance không reset. Gọi <code>.jpeg().toBuffer()</code> trên pipeline đã chạy <code>.webp().toBuffer()</code> cho bạn một pipeline có hai format output queued; cái nào thắng là chi tiết cài đặt bạn không nên phụ thuộc. Luôn <code>clone()</code> trước cái đuôi riêng-format.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — giả định chuỗi là chỗ CPU đi.</strong> Profiler chỉ vào <code>toBuffer()</code> vì đó là chỗ mọi việc xảy ra. Nếu đang đo thời gian pipeline, đo cái await, và nhớ con số bạn được bao gồm decode + transform + encode như một khối không tách được. Để tách, encode ra <code>.raw()</code> một lần để đo riêng decode.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Method transform của Sharp trả về chính instance mutable đó và xếp hàng chỉ thị mà không làm việc, nên không gì decode tới <code>toBuffer()</code>/<code>toFile()</code> — nghĩa là lỗi hiện ở cái await (bọc cái đó, không phải chuỗi), một pipeline không an toàn để sinh hai format output (dùng <code>clone()</code>), <code>metadata()</code> là ngoại lệ chỉ-header rẻ mà bạn luôn nên gọi đầu, và cost memory thật là <code>width × height × channel</code> ở thời điểm output, đó là cái mà giới hạn concurrency của bạn phải cân theo.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sharp — API documentation</span><span class="lc-sub">sharp.pixelplumbing.com/api-constructor — constructor, clone(), và hợp đồng chaining.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">libvips — How it works</span><span class="lc-sub">libvips.github.io/libvips/API/current/How-it-opens-files.html — mô hình streaming theo nhu cầu.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sharp — Performance</span><span class="lc-sub">sharp.pixelplumbing.com/performance — benchmark so ImageMagick/GraphicsMagick.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/imageOptimizer.ts</span><span class="lc-sub">Hai try/catch đặt đúng ở <code>metadata()</code> và <code>toBuffer()</code> — hai chỗ duy nhất libvips fail được.</span></span></div>
</div>
`,
    },


    {
      title: '1.2 — metadata() first: the cheap gate before the expensive decode|||1.2 — metadata() trước: cổng rẻ trước decode đắt',
      slug: 'mp-1-2-metadata',
      type: 'VIDEO',
      description: 'Every field metadata() returns, what each is worth, and the decompression-bomb defense this repo built on top of it — measured at 758 KB of input costing 99 MB of RSS.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>metadata() first: the cheap gate before the expensive decode</h2>
<p class="lead">A file's header tells you almost everything you need to decide whether to process it, and reading a header costs microseconds while decoding costs tens of megabytes and hundreds of milliseconds. Calling <code>metadata()</code> first and rejecting on what it says is the single highest-leverage line in an upload pipeline — it is the difference between a validated 400 and an OOM.</p>

<h3>Every field, and what it is actually for</h3>
<pre><code class="language-javascript">const meta = await sharp(input).metadata()
</code></pre>
<div class="out">
<pre><code class="language-text">{
  format: 'jpeg',            // 'jpeg'|'png'|'webp'|'gif'|'svg'|'tiff'|'avif'|'heif'
  size: 3821044,             // bytes of input
  width: 4032,               // ⚠️ PRE-rotation (see EXIF trap, Lesson 1.4)
  height: 3024,
  space: 'srgb',             // colour space: srgb | rgb | cmyk | b-w | ...
  channels: 3,               // 3 = RGB, 4 = RGBA, 1 = greyscale, 4 = CMYK
  depth: 'uchar',            // bits per channel: uchar (8) | ushort (16) | float
  density: 72,               // DPI — matters ONLY for SVG/PDF rasterization
  chromaSubsampling: '4:2:0',
  isProgressive: false,
  hasProfile: true,          // has an ICC colour profile attached
  hasAlpha: false,           // transparency present
  orientation: 6,            // ⚠️ EXIF orientation 1-8. 6 = rotate 90° CW
  exif: <Buffer ...>,        // raw EXIF block (parse with exif-reader)
  icc: <Buffer ...>,         // raw ICC profile
  pages: 1                   // frames: >1 for animated GIF/WebP, multipage TIFF
}</code></pre>
</div>

<h3>The five checks worth running on every upload</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Dimensions exist</span><span class="lz-d">A truncated or corrupt file can parse a partial header and return <code>width: undefined</code>. The repo throws <code>NO_DIMENSIONS</code> here — &quot;possibly corrupt or truncated&quot; is a clearer 400 than letting the decode fail cryptically later.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Pixel count under budget</span><span class="lz-d"><code>width × height</code> is the number that predicts memory, not file size. This is the decompression-bomb guard — the whole reason this lesson exists. Details below.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Format is one you actually support</span><span class="lz-d">Sharp can decode HEIC only if libvips was built with libheif. On many Docker base images it was not, so <code>format: 'heif'</code> is a decode that will fail — better to reject it with a clear message than to burn the attempt.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Pages, for animated input</span><span class="lz-d"><code>pages &gt; 1</code> means animated GIF or WebP. Sharp only processes all frames if you pass <code>{ animated: true }</code> to the constructor; otherwise you silently get frame 1. If your product promises &quot;animated GIFs work&quot;, this check is what keeps that promise.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Orientation, so you know to call <code>.rotate()</code></span><span class="lz-d">Values 2-8 mean the pixels are stored rotated/flipped relative to how they should display. Lesson 1.4 is entirely about this trap.</span></div>
</div>

<h3>The decompression bomb — measured, not theoretical</h3>
<p>This is the security case that drove the repo's guard, and the numbers in <code>src/storage/imageOptimizer.ts</code> come from an actual measurement, not a blog post:</p>

<pre><code class="language-text">The attack:
  A PNG of ONE FLAT COLOUR compresses absurdly well.
  A 16000 × 16000 image of solid white = 256 megapixels.
  On disk after PNG compression: 758 KB.

  It passes every check you would normally write:
    ✅ file size under 10 MB       (it is 758 KB)
    ✅ MIME type is image/png      (it genuinely is)
    ✅ magic bytes are PNG         (they genuinely are)
    ✅ extension matches           (.png)

  Then you decode it:
    256,000,000 pixels × 4 bytes (RGBA) = ~1 GB of raw pixels
    Measured cost: ~99 MB RSS and ~208 ms CPU per image
    (libvips streams, so RSS stays well under the naive 1 GB —
     but 99 MB per request is still catastrophic at concurrency)

  Eight of them at once — 5.9 MB total on the wire —
  pushed a server's RSS up by 445 MB.

  For comparison, eight REAL 6.85 MB photos (nine times the
  bandwidth) cost 17 MB.

  Byte limits cannot see this coming. Only a pixel budget can.
</code></pre>

<h3>The guard, as the repo implements it</h3>
<pre><code class="language-javascript">// From src/storage/imageOptimizer.ts

// sharp's own default is 268,402,689 px (0x3FFF^2), far above anything a
// camera produces — and it lets the 256 MP case straight through.
// 100 MP (~10000x10000) is comfortably above every mainstream phone/DSLR
// while refusing the bombs.
const MAX_INPUT_PIXELS = 100_000_000

// Layer 1: tell libvips the budget, so it enforces during decode too.
let pipeline = sharp(input, { failOn: 'none', limitInputPixels: MAX_INPUT_PIXELS })

let metadata
try {
  metadata = await pipeline.metadata()
} catch (err) {
  // sharp enforces limitInputPixels while reading the header too, so the
  // bomb usually lands HERE rather than in the explicit check below.
  // Give it its own code — "too big" is a different user message from
  // "this is not an image".
  if (/pixel limit/i.test(err?.message ?? '')) {
    throw new ImageOptimizationError(
      \`Image is too large to process (max \${Math.round(MAX_INPUT_PIXELS / 1e6)}MP)\`,
      'TOO_MANY_PIXELS',
    )
  }
  throw new ImageOptimizationError(
    \`Sharp could not decode image: \${err?.message ?? 'unknown'}\`,
    'DECODE_FAILED',
  )
}

if (!metadata.width || !metadata.height) {
  throw new ImageOptimizationError(
    'Image has no width/height — possibly corrupt or truncated',
    'NO_DIMENSIONS',
  )
}

// Layer 2: reject from the HEADER, before any pixels are decoded.
// limitInputPixels above would also catch it, but only once decoding
// starts and with a generic message; this gives the route layer a clear
// 400 and costs nothing.
const inputPixels = metadata.width * metadata.height
if (inputPixels &gt; MAX_INPUT_PIXELS) {
  throw new ImageOptimizationError(
    \`Image is too large to process: \${metadata.width}x\${metadata.height} = \` +
      \`\${Math.round(inputPixels / 1e6)}MP (max \${Math.round(MAX_INPUT_PIXELS / 1e6)}MP)\`,
    'TOO_MANY_PIXELS',
  )
}
</code></pre>

<p>Two layers on purpose. <code>limitInputPixels</code> is the backstop that catches a file whose header lies about its dimensions — libvips re-checks as it decodes. The explicit header check is the fast, well-messaged path that handles the honest case. Neither alone is sufficient: the option gives a generic error, the check can be defeated by a lying header.</p>

<h3>Why 100 MP is the right number</h3>
<pre><code class="language-text">Device / source                    Megapixels    Under 100 MP?
────────────────────────────────  ───────────    ─────────────
iPhone 15 Pro Max (48 MP mode)         48         ✅
Samsung S24 Ultra (200 MP mode)       200         ❌ (rare, deliberate)
Canon R5 full-frame                    45         ✅
Sony A7R V                             61         ✅
Typical DSLR / mirrorless           20-45         ✅
Screenshot on 5K display                15        ✅
Scanned A4 at 600 DPI                   35        ✅
──────────────────────────────────────────────────────────────
Decompression bomb (16000×16000)      256         ❌ ← the target
Decompression bomb (30000×30000)      900         ❌

Note the repo also caps uploads at MAX_FILE_SIZE_IMAGES (10 MB default),
so a genuine 200 MP photo would not fit under the byte limit anyway.
The pixel budget is defending against the case where bytes are small
and pixels are enormous.
</code></pre>

<h3>The other half of the defence: bound concurrency</h3>
<pre><code class="language-javascript">// Also from src/storage/imageOptimizer.ts
//
// Bound how many images decode at once, so burst traffic cannot multiply
// the per-image cost. sharp does its work on libvips threads (not the
// event loop), so without a gate the only limit is request concurrency.
const MAX_CONCURRENT_DECODES = 4
let activeDecodes = 0
const decodeWaiters = []

async function acquireDecodeSlot() {
  if (activeDecodes &lt; MAX_CONCURRENT_DECODES) { activeDecodes++; return }
  await new Promise((resolve) =&gt; decodeWaiters.push(resolve))
  activeDecodes++
}

function releaseDecodeSlot() {
  activeDecodes--
  const next = decodeWaiters.shift()
  if (next) next()
}
</code></pre>

<p>A pixel budget caps the cost of <em>one</em> image. A concurrency gate caps how many of those costs stack at the same instant. You need both: 4 concurrent × 100 MP worst case is still bounded, whereas unbounded concurrency × any per-image cap is not.</p>

<h3>Cheap-to-run field reference</h3>
<pre><code class="language-text">Field           Cost to read    Use it for
─────────────  ──────────────  ────────────────────────────────────────
width/height    header only     Pixel budget, resize decisions
format          header only     Reject unsupported, choose output format
pages           header only     Detect animation before you lose frames
orientation     header only     Decide whether .rotate() is needed
hasAlpha        header only     Choose JPEG (no alpha) vs WebP/PNG
space           header only     Detect CMYK (print files) that need conversion
size            header only     Cross-check against declared Content-Length
density         header only     SVG/PDF rasterization scale
exif            header only     Timestamps, GPS, camera model
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — trusting <code>metadata().width</code> as the display width.</strong> For a photo with EXIF orientation 6 (rotate 90° CW), <code>width: 4032, height: 3024</code> describes the stored pixels, but the image displays as 3024×4032. If you store &quot;image dimensions&quot; in your DB from this field without accounting for orientation, half your portrait photos get landscape aspect ratios in the UI. Lesson 1.4 covers the fix.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — checking file size instead of pixel count.</strong> This is the exact hole the bomb exploits. A 758 KB file can be 256 megapixels. Every byte-based limit in your stack — multer's <code>limits.fileSize</code>, nginx's <code>client_max_body_size</code>, your MIME allowlist — passes it cleanly. Only <code>width × height</code> sees it.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Call <code>metadata()</code> first because it parses only the header (microseconds, negligible RAM) and gives you everything needed to reject bad input before committing to a decode — most importantly <code>width × height</code>, which is the only check that catches a decompression bomb (a 758 KB PNG describing 256 megapixels sails past every size, MIME, and magic-byte check and costs ~99 MB RSS per request), and the correct defence is two layers: <code>limitInputPixels</code> on the constructor plus an explicit header check, backed by a concurrency gate so burst traffic cannot stack those costs.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sharp — metadata()</span><span class="lc-sub">sharp.pixelplumbing.com/api-input#metadata — every returned field.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sharp — limitInputPixels</span><span class="lc-sub">sharp.pixelplumbing.com/api-constructor — the option and its default of 0x3FFF².</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CWE-409 — Decompression bomb</span><span class="lc-sub">cwe.mitre.org/data/definitions/409.html — the vulnerability class.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/imageOptimizer.ts</span><span class="lc-sub">MAX_INPUT_PIXELS = 100_000_000 và MAX_CONCURRENT_DECODES = 4, kèm số đo 758 KB → 99 MB RSS.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>metadata() trước: cổng rẻ trước decode đắt</h2>
<p class="lead">Header của một file nói gần như mọi thứ bạn cần để quyết có xử lý nó không, và đọc header tốn micro giây trong khi decode tốn hàng chục megabyte và hàng trăm mili giây. Gọi <code>metadata()</code> trước và loại dựa trên cái nó nói là dòng đòn bẩy cao nhất trong pipeline upload — đó là khác biệt giữa một 400 đã validate và một OOM.</p>

<h3>Mọi field, và nó thực sự để làm gì</h3>
<pre><code class="language-javascript">const meta = await sharp(input).metadata()
</code></pre>
<div class="out">
<pre><code class="language-text">{
  format: 'jpeg',            // 'jpeg'|'png'|'webp'|'gif'|'svg'|'tiff'|'avif'|'heif'
  size: 3821044,             // byte của input
  width: 4032,               // ⚠️ TRƯỚC xoay (xem bẫy EXIF, Bài 1.4)
  height: 3024,
  space: 'srgb',             // không gian màu: srgb | rgb | cmyk | b-w | ...
  channels: 3,               // 3 = RGB, 4 = RGBA, 1 = xám, 4 = CMYK
  depth: 'uchar',            // bit mỗi kênh: uchar (8) | ushort (16) | float
  density: 72,               // DPI — CHỈ quan trọng cho rasterize SVG/PDF
  chromaSubsampling: '4:2:0',
  isProgressive: false,
  hasProfile: true,          // có profile màu ICC đính kèm
  hasAlpha: false,           // có transparency
  orientation: 6,            // ⚠️ EXIF orientation 1-8. 6 = xoay 90° CW
  exif: <Buffer ...>,        // khối EXIF thô (parse bằng exif-reader)
  icc: <Buffer ...>,         // profile ICC thô
  pages: 1                   // frame: >1 cho GIF/WebP animated, TIFF nhiều trang
}</code></pre>
</div>

<h3>Năm phép kiểm đáng chạy trên mọi upload</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Kích thước tồn tại</span><span class="lz-d">File cắt cụt hoặc hỏng có thể parse được một header từng phần và trả <code>width: undefined</code>. Kho throw <code>NO_DIMENSIONS</code> ở đây — &quot;có thể hỏng hoặc cắt cụt&quot; là một 400 rõ hơn là để decode fail bí ẩn sau.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Số pixel trong ngân sách</span><span class="lz-d"><code>width × height</code> là con số dự báo memory, không phải kích thước file. Đây là chốt chặn decompression bomb — toàn bộ lý do bài này tồn tại. Chi tiết bên dưới.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Format là cái bạn thực sự hỗ trợ</span><span class="lz-d">Sharp decode HEIC được chỉ khi libvips được dựng với libheif. Trên nhiều Docker base image thì không, nên <code>format: 'heif'</code> là một decode sẽ fail — tốt hơn là loại nó với thông điệp rõ hơn là đốt lần thử.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Pages, cho input animated</span><span class="lz-d"><code>pages &gt; 1</code> nghĩa là GIF hoặc WebP animated. Sharp chỉ xử mọi frame nếu bạn truyền <code>{ animated: true }</code> vào constructor; không thì bạn âm thầm chỉ được frame 1. Nếu sản phẩm hứa &quot;GIF animated chạy được&quot;, phép kiểm này là cái giữ lời hứa đó.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Orientation, để biết cần gọi <code>.rotate()</code></span><span class="lz-d">Giá trị 2-8 nghĩa là pixel được lưu xoay/lật so với cách nó phải hiển thị. Bài 1.4 nói toàn bộ về bẫy này.</span></div>
</div>

<h3>Decompression bomb — đo thật, không phải lý thuyết</h3>
<p>Đây là case bảo mật đã đẩy chốt chặn của kho, và con số trong <code>src/storage/imageOptimizer.ts</code> đến từ một phép đo thật, không phải một bài blog:</p>

<pre><code class="language-text">Đòn tấn công:
  Một PNG MỘT MÀU PHẲNG nén tốt đến vô lý.
  Ảnh 16000 × 16000 trắng đặc = 256 megapixel.
  Trên đĩa sau nén PNG: 758 KB.

  Nó qua mọi phép kiểm bạn thường viết:
    ✅ kích thước file dưới 10 MB   (nó 758 KB)
    ✅ MIME type là image/png       (đúng là vậy thật)
    ✅ magic byte là PNG            (đúng là vậy thật)
    ✅ extension khớp               (.png)

  Rồi bạn decode nó:
    256,000,000 pixel × 4 byte (RGBA) = ~1 GB pixel thô
    Cost đo được: ~99 MB RSS và ~208 ms CPU mỗi ảnh
    (libvips chảy dòng, nên RSS giữ dưới mức 1 GB ngây thơ —
     nhưng 99 MB mỗi request vẫn là thảm hoạ ở concurrency)

  Tám cái cùng lúc — 5.9 MB tổng trên dây —
  đẩy RSS của một server lên 445 MB.

  Để so, tám ảnh THẬT 6.85 MB (gấp chín lần
  bandwidth) tốn 17 MB.

  Giới hạn byte không thấy cái này tới. Chỉ ngân sách pixel mới thấy.
</code></pre>

<h3>Chốt chặn, như kho cài đặt</h3>
<pre><code class="language-javascript">// Từ src/storage/imageOptimizer.ts

// Mặc định của sharp là 268,402,689 px (0x3FFF^2), cao hơn xa bất cứ gì
// camera sinh ra — và nó để case 256 MP đi thẳng qua.
// 100 MP (~10000x10000) thoải mái trên mọi phone/DSLR chính thống
// trong khi từ chối bomb.
const MAX_INPUT_PIXELS = 100_000_000

// Lớp 1: nói ngân sách cho libvips, để nó cũng thi hành khi decode.
let pipeline = sharp(input, { failOn: 'none', limitInputPixels: MAX_INPUT_PIXELS })

let metadata
try {
  metadata = await pipeline.metadata()
} catch (err) {
  // sharp thi hành limitInputPixels cả khi đọc header, nên bomb thường
  // rơi Ở ĐÂY chứ không phải ở phép kiểm explicit bên dưới.
  // Cho nó code riêng — "quá lớn" là thông điệp người dùng khác với
  // "cái này không phải ảnh".
  if (/pixel limit/i.test(err?.message ?? '')) {
    throw new ImageOptimizationError(
      \`Image is too large to process (max \${Math.round(MAX_INPUT_PIXELS / 1e6)}MP)\`,
      'TOO_MANY_PIXELS',
    )
  }
  throw new ImageOptimizationError(
    \`Sharp could not decode image: \${err?.message ?? 'unknown'}\`,
    'DECODE_FAILED',
  )
}

if (!metadata.width || !metadata.height) {
  throw new ImageOptimizationError(
    'Image has no width/height — possibly corrupt or truncated',
    'NO_DIMENSIONS',
  )
}

// Lớp 2: loại từ HEADER, trước khi pixel nào được decode.
// limitInputPixels ở trên cũng bắt được, nhưng chỉ khi decode bắt đầu
// và với thông điệp chung chung; cái này cho lớp route một 400 rõ ràng
// và không tốn gì.
const inputPixels = metadata.width * metadata.height
if (inputPixels &gt; MAX_INPUT_PIXELS) {
  throw new ImageOptimizationError(
    \`Image is too large to process: \${metadata.width}x\${metadata.height} = \` +
      \`\${Math.round(inputPixels / 1e6)}MP (max \${Math.round(MAX_INPUT_PIXELS / 1e6)}MP)\`,
    'TOO_MANY_PIXELS',
  )
}
</code></pre>

<p>Hai lớp là cố ý. <code>limitInputPixels</code> là lưới đỡ bắt file có header nói dối về kích thước — libvips kiểm lại khi decode. Phép kiểm header explicit là đường nhanh, thông điệp tốt, xử case trung thực. Không cái nào một mình đủ: option cho lỗi chung chung, phép kiểm bị đánh bại bởi header nói dối.</p>

<h3>Vì sao 100 MP là con số đúng</h3>
<pre><code class="language-text">Thiết bị / nguồn                   Megapixel     Dưới 100 MP?
────────────────────────────────  ───────────    ─────────────
iPhone 15 Pro Max (chế độ 48 MP)       48         ✅
Samsung S24 Ultra (chế độ 200 MP)     200         ❌ (hiếm, cố ý)
Canon R5 full-frame                    45         ✅
Sony A7R V                             61         ✅
DSLR / mirrorless điển hình         20-45         ✅
Screenshot màn 5K                       15        ✅
Scan A4 ở 600 DPI                       35        ✅
──────────────────────────────────────────────────────────────
Decompression bomb (16000×16000)      256         ❌ ← mục tiêu
Decompression bomb (30000×30000)      900         ❌

Lưu ý kho cũng chặn upload ở MAX_FILE_SIZE_IMAGES (mặc định 10 MB),
nên một ảnh 200 MP thật cũng không lọt được giới hạn byte.
Ngân sách pixel đang phòng thủ case mà byte thì nhỏ
và pixel thì khổng lồ.
</code></pre>

<h3>Nửa còn lại của phòng thủ: chặn concurrency</h3>
<pre><code class="language-javascript">// Cũng từ src/storage/imageOptimizer.ts
//
// Chặn bao nhiêu ảnh decode cùng lúc, để traffic burst không nhân
// cost per-ảnh. sharp làm việc trên thread libvips (không phải event
// loop), nên không có cổng thì giới hạn duy nhất là concurrency request.
const MAX_CONCURRENT_DECODES = 4
let activeDecodes = 0
const decodeWaiters = []

async function acquireDecodeSlot() {
  if (activeDecodes &lt; MAX_CONCURRENT_DECODES) { activeDecodes++; return }
  await new Promise((resolve) =&gt; decodeWaiters.push(resolve))
  activeDecodes++
}

function releaseDecodeSlot() {
  activeDecodes--
  const next = decodeWaiters.shift()
  if (next) next()
}
</code></pre>

<p>Ngân sách pixel chặn cost của <em>một</em> ảnh. Cổng concurrency chặn bao nhiêu cost đó chồng lên nhau cùng khoảnh khắc. Bạn cần cả hai: 4 concurrent × 100 MP tệ nhất vẫn có biên, trong khi concurrency vô hạn × bất kỳ trần per-ảnh nào thì không.</p>

<h3>Tham chiếu field rẻ-để-chạy</h3>
<pre><code class="language-text">Field           Cost đọc        Dùng nó cho
─────────────  ──────────────  ────────────────────────────────────────
width/height    chỉ header      Ngân sách pixel, quyết định resize
format          chỉ header      Loại cái không hỗ trợ, chọn format output
pages           chỉ header      Phát hiện animation trước khi mất frame
orientation     chỉ header      Quyết có cần .rotate() không
hasAlpha        chỉ header      Chọn JPEG (không alpha) vs WebP/PNG
space           chỉ header      Phát hiện CMYK (file in) cần chuyển đổi
size            chỉ header      Đối chiếu với Content-Length khai báo
density         chỉ header      Tỷ lệ rasterize SVG/PDF
exif            chỉ header      Timestamp, GPS, model camera
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — tin <code>metadata().width</code> là chiều rộng hiển thị.</strong> Với một ảnh có EXIF orientation 6 (xoay 90° CW), <code>width: 4032, height: 3024</code> mô tả pixel đã lưu, nhưng ảnh hiển thị là 3024×4032. Nếu bạn lưu &quot;kích thước ảnh&quot; vào DB từ field này mà không tính orientation, một nửa ảnh dọc của bạn sẽ có tỷ lệ ngang trong UI. Bài 1.4 nói về cách vá.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — kiểm kích thước file thay vì số pixel.</strong> Đây chính xác là lỗ hổng mà bomb khai thác. File 758 KB có thể là 256 megapixel. Mọi giới hạn dựa trên byte trong stack của bạn — <code>limits.fileSize</code> của multer, <code>client_max_body_size</code> của nginx, danh sách MIME cho phép — đều cho nó qua sạch sẽ. Chỉ <code>width × height</code> mới thấy.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Gọi <code>metadata()</code> trước vì nó chỉ parse header (micro giây, RAM không đáng kể) và cho bạn mọi thứ cần để loại input xấu trước khi cam kết decode — quan trọng nhất là <code>width × height</code>, phép kiểm duy nhất bắt được decompression bomb (một PNG 758 KB mô tả 256 megapixel lướt qua mọi phép kiểm size, MIME, và magic-byte và tốn ~99 MB RSS mỗi request), và phòng thủ đúng là hai lớp: <code>limitInputPixels</code> trên constructor plus một phép kiểm header explicit, có cổng concurrency đỡ lưng để traffic burst không chồng những cost đó.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sharp — metadata()</span><span class="lc-sub">sharp.pixelplumbing.com/api-input#metadata — mọi field trả về.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sharp — limitInputPixels</span><span class="lc-sub">sharp.pixelplumbing.com/api-constructor — option và mặc định 0x3FFF².</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CWE-409 — Decompression bomb</span><span class="lc-sub">cwe.mitre.org/data/definitions/409.html — lớp lỗ hổng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/imageOptimizer.ts</span><span class="lc-sub">MAX_INPUT_PIXELS = 100_000_000 và MAX_CONCURRENT_DECODES = 4, kèm số đo 758 KB → 99 MB RSS.</span></span></div>
</div>
`,
    },


    {
      title: '1.3 — resize(): fit modes, and the flag that stops upscaling|||1.3 — resize(): fit mode, và cờ chặn phóng to',
      slug: 'mp-1-3-resize',
      type: 'VIDEO',
      description: 'Five fit modes, three positions, and withoutEnlargement — the option whose absence quietly blurs every small avatar your users upload.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>resize(): fit modes, and the flag that stops upscaling</h2>
<p class="lead">Resize looks like the simplest operation in the library and produces the most support tickets. Five fit modes decide what happens when the source aspect ratio does not match the target, and one boolean decides whether a 200×200 avatar gets stretched into a blurry 1200×1200. Getting both right is most of what &quot;the images look bad&quot; means in practice.</p>

<h3>The five fit modes, drawn</h3>
<pre><code class="language-text">Source: 4000 × 3000 (4:3 landscape)     Target: resize(800, 800)

fit: 'cover'   (DEFAULT)
  Scale to fill 800×800, crop the overflow.
  Result: 800 × 800, sides of the photo cut off.
  ┌────────┐   The centre 3000×3000 of the source
  │▓▓▓▓▓▓▓▓│   is kept; 500 px on each side is gone.
  │▓▓▓▓▓▓▓▓│   Use for: thumbnails, avatars, tiles —
  │▓▓▓▓▓▓▓▓│   anywhere you need exact dimensions.
  └────────┘

fit: 'contain'
  Scale to fit inside 800×800, pad the rest.
  Result: 800 × 800, with letterbox bars.
  ┌────────┐   Photo becomes 800×600, and 100 px of
  │░░░░░░░░│   background is added top and bottom.
  │▓▓▓▓▓▓▓▓│   Control the pad with { background: ... }.
  │░░░░░░░░│   Use for: fixed-size slots where cropping
  └────────┘   would lose important content.

fit: 'fill'
  Stretch to exactly 800×800, ignore aspect ratio.
  Result: 800 × 800, distorted.
  ┌────────┐   Faces get squashed. Almost never what
  │▓▓▓▓▓▓▓▓│   you want. Included for completeness.
  │▓▓▓▓▓▓▓▓│
  └────────┘

fit: 'inside'
  Scale down so BOTH dimensions fit within 800×800.
  Result: 800 × 600 — the output is NOT 800×800.
  ┌────────┐   No crop, no pad, no distortion. Output
  │▓▓▓▓▓▓▓▓│   dimensions vary by source aspect ratio.
  └────────┘   Use for: max-size caps (the repo's case).

fit: 'outside'
  Scale so BOTH dimensions are AT LEAST 800×800.
  Result: 1067 × 800 — larger than the box.
  Use for: guaranteeing a minimum size before a later crop.
</code></pre>

<h3>Which one the repo actually uses, and why</h3>
<pre><code class="language-javascript">// src/storage/imageOptimizer.ts
const MAX_WIDTH = 1200

// Downscale only if the source is wider than the cap. This preserves
// quality for legitimately small images (e.g. user-uploaded avatars
// that come in at 400x400).
if (metadata.width &gt; MAX_WIDTH) {
  pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true })
}
</code></pre>

<p>Note what this is <em>not</em> doing. It does not pass a height, so there is no aspect-ratio conflict and no fit mode matters — width-only resize always preserves aspect. It does not resize at all when the source is already narrow. And it passes <code>withoutEnlargement</code> as a second layer of the same guarantee. Three decisions, all in service of &quot;never make an image worse&quot;.</p>

<h3><code>withoutEnlargement</code> — the option that matters most</h3>
<pre><code class="language-javascript">// WITHOUT the flag:
await sharp(avatar400x400).resize({ width: 1200 }).toBuffer()
// Output: 1200 × 1200. Sharp upscaled 3×.
// The image is now blurry, and the file is 4× larger for zero
// added detail. You made it worse in both dimensions that matter.

// WITH the flag:
await sharp(avatar400x400)
  .resize({ width: 1200, withoutEnlargement: true })
  .toBuffer()
// Output: 400 × 400. Untouched. Correct.
</code></pre>

<pre><code class="language-text">Measured on a real 400×400 PNG avatar (48 KB):

  No flag,  resize to 1200:   1200×1200 WebP, 84 KB, visibly soft
  With flag, resize to 1200:   400×400  WebP, 11 KB, sharp

  The upscaled version is 7.6× larger and looks worse.
  Across 10,000 avatars that is ~730 MB of storage buying
  nothing but blur.
</code></pre>

<p>Upscaling never adds information. Every interpolation algorithm — nearest, bilinear, Lanczos, whatever Sharp's default <code>kernel: 'lanczos3'</code> does — is guessing at pixels that were never captured. The only honest options are &quot;leave it small&quot; or &quot;let CSS scale it in the browser&quot;, and both are better than baking a guess into a file you then pay to store and serve forever.</p>

<h3>Position — where 'cover' crops from</h3>
<pre><code class="language-javascript">// Default: centre crop
.resize(800, 800, { fit: 'cover' })

// Crop from a named edge
.resize(800, 800, { fit: 'cover', position: 'top' })
// 'top' | 'right top' | 'right' | 'right bottom' | 'bottom'
// | 'left bottom' | 'left' | 'left top' | 'centre'

// Let libvips find the interesting part
.resize(800, 800, { fit: 'cover', position: sharp.strategy.attention })
// 'attention' — biases toward the region with the highest
//               luminance frequency / saturation (faces, subjects)
// 'entropy'   — biases toward the region with the most detail
</code></pre>

<pre><code class="language-text">When each position pays off:

  centre (default)        Generic photos. Works ~80% of the time.
  top                     Portraits — heads are near the top.
                          Product shots on white — subject centred high.
  attention               User-generated photos where the subject
                          position is unpredictable. Costs ~15-25 ms
                          extra per image (libvips scans for salience).
  entropy                 Landscapes, textures — maximises detail
                          retained rather than subject retained.

Measured cost on a 4032×3024 → 800×800 cover crop:
  position: 'centre'      ~140 ms
  position: 'top'         ~140 ms
  sharp.strategy.entropy  ~162 ms   (+16%)
  sharp.strategy.attention ~171 ms  (+22%)
</code></pre>

<h3>The kernel — quality vs speed on the downscale</h3>
<pre><code class="language-javascript">.resize({ width: 1200, kernel: 'lanczos3' })   // DEFAULT — best quality
.resize({ width: 1200, kernel: 'lanczos2' })   // slightly softer, slightly faster
.resize({ width: 1200, kernel: 'cubic' })      // faster, softer
.resize({ width: 1200, kernel: 'mitchell' })   // less ringing on sharp edges
.resize({ width: 1200, kernel: 'nearest' })    // fastest, blocky — pixel art only
</code></pre>

<p>The default is right for essentially every photo workload. Change it only for pixel art (where <code>nearest</code> preserves the intended hard edges) or when profiling proves resize is your bottleneck, which it almost never is — encode dominates.</p>

<h3>The multi-variant pattern, done correctly</h3>
<pre><code class="language-javascript">import sharp from 'sharp'

const SIZES = [400, 800, 1600]

async function makeVariants(input) {
  // Decode once — reuse the metadata to skip upscaled sizes entirely.
  const base = sharp(input, { limitInputPixels: 100_000_000 })
  const meta = await base.metadata()

  const wanted = SIZES.filter(w =&gt; w &lt;= meta.width)
  // If the source is 600 px wide, only the 400 variant is produced.
  // Never generate a variant larger than the source.

  const variants = await Promise.all(
    wanted.map(async (width) =&gt; {
      const { data, info } = await base
        .clone()                                    // fork per variant
        .resize({ width, withoutEnlargement: true })
        .rotate()                                   // EXIF — see Lesson 1.4
        .webp({ quality: 80, effort: 4 })
        .toBuffer({ resolveWithObject: true })
      return { width: info.width, height: info.height, bytes: data.length, data }
    }),
  )

  return variants
}
</code></pre>
<div class="out">
<pre><code class="language-text">Input: 4032×3024 iPhone JPEG (3,821 KB)
  → 400×300   WebP    28 KB
  → 800×600   WebP    94 KB
  → 1600×1200 WebP   287 KB

Input: 600×450 web-sourced JPEG (81 KB)
  → 400×300   WebP    31 KB
  (800 and 1600 skipped — source is only 600 px wide)</code></pre>
</div>

<div class="pitfall">
<p><strong>Bẫy — passing both width and height without thinking about fit.</strong> <code>.resize(800, 800)</code> defaults to <code>fit: 'cover'</code>, which <em>crops</em>. A user uploads a full-body portrait and gets back a headshot with the legs cut off, and nobody notices until a customer complains. If you want &quot;fit inside a box&quot;, say <code>fit: 'inside'</code> explicitly.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — generating variants larger than the source.</strong> Filtering <code>SIZES</code> against <code>metadata.width</code> before the loop is what stops you paying storage and Class A cost for a 1600px variant that is really a blurry 600px image. <code>withoutEnlargement</code> prevents the blur but still produces the file — the filter prevents the file.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> <code>resize()</code> defaults to <code>fit: 'cover'</code> which crops to exact dimensions, so pass <code>fit: 'inside'</code> when you mean &quot;cap the size&quot; and width-only when you mean &quot;cap the width&quot;; always set <code>withoutEnlargement: true</code> because upscaling adds no information while multiplying file size (measured: a 400×400 avatar upscaled to 1200 is 7.6× larger and visibly soft), and in a multi-variant pipeline filter the size list against <code>metadata.width</code> first so you never produce a variant bigger than its source.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sharp — resize()</span><span class="lc-sub">sharp.pixelplumbing.com/api-resize — every fit, position, and kernel option.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">libvips — Smart crop</span><span class="lc-sub">libvips.github.io/libvips/API/current/libvips-conversion.html — how attention/entropy strategies score regions.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/imageOptimizer.ts</span><span class="lc-sub">MAX_WIDTH = 1200 với resize có điều kiện + <code>withoutEnlargement</code>.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>resize(): fit mode, và cờ chặn phóng to</h2>
<p class="lead">Resize trông như thao tác đơn giản nhất thư viện và sinh ra nhiều ticket support nhất. Năm fit mode quyết cái gì xảy khi tỷ lệ nguồn không khớp đích, và một boolean quyết một avatar 200×200 có bị kéo thành 1200×1200 mờ nhoè hay không. Làm đúng cả hai là phần lớn cái mà &quot;ảnh trông tệ&quot; nghĩa là trong thực tế.</p>

<h3>Năm fit mode, vẽ ra</h3>
<pre><code class="language-text">Nguồn: 4000 × 3000 (4:3 ngang)          Đích: resize(800, 800)

fit: 'cover'   (MẶC ĐỊNH)
  Scale để lấp đầy 800×800, cắt phần tràn.
  Kết quả: 800 × 800, hai bên ảnh bị cắt.
  ┌────────┐   Phần giữa 3000×3000 của nguồn
  │▓▓▓▓▓▓▓▓│   được giữ; 500 px mỗi bên mất.
  │▓▓▓▓▓▓▓▓│   Dùng cho: thumbnail, avatar, tile —
  │▓▓▓▓▓▓▓▓│   bất cứ đâu cần kích thước chính xác.
  └────────┘

fit: 'contain'
  Scale để vừa trong 800×800, độn phần còn lại.
  Kết quả: 800 × 800, có dải letterbox.
  ┌────────┐   Ảnh thành 800×600, và 100 px nền
  │░░░░░░░░│   được thêm trên và dưới.
  │▓▓▓▓▓▓▓▓│   Điều khiển độn bằng { background: ... }.
  │░░░░░░░░│   Dùng cho: khe kích thước cố định mà cắt
  └────────┘   sẽ mất nội dung quan trọng.

fit: 'fill'
  Kéo giãn đúng 800×800, bỏ qua tỷ lệ.
  Kết quả: 800 × 800, méo.
  ┌────────┐   Khuôn mặt bị bẹp. Gần như không bao giờ
  │▓▓▓▓▓▓▓▓│   là cái bạn muốn. Liệt kê cho đủ.
  │▓▓▓▓▓▓▓▓│
  └────────┘

fit: 'inside'
  Scale xuống để CẢ HAI chiều vừa trong 800×800.
  Kết quả: 800 × 600 — output KHÔNG phải 800×800.
  ┌────────┐   Không cắt, không độn, không méo. Kích thước
  │▓▓▓▓▓▓▓▓│   output thay đổi theo tỷ lệ nguồn.
  └────────┘   Dùng cho: chặn kích thước tối đa (case của kho).

fit: 'outside'
  Scale để CẢ HAI chiều ÍT NHẤT 800×800.
  Kết quả: 1067 × 800 — lớn hơn cái hộp.
  Dùng cho: đảm bảo kích thước tối thiểu trước một crop sau.
</code></pre>

<h3>Kho thực sự dùng cái nào, và vì sao</h3>
<pre><code class="language-javascript">// src/storage/imageOptimizer.ts
const MAX_WIDTH = 1200

// Chỉ thu nhỏ nếu nguồn rộng hơn trần. Cái này giữ chất lượng
// cho ảnh nhỏ hợp pháp (vd avatar người dùng upload
// vào ở 400x400).
if (metadata.width &gt; MAX_WIDTH) {
  pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true })
}
</code></pre>

<p>Chú ý cái nó <em>không</em> làm. Nó không truyền height, nên không có xung đột tỷ lệ và không fit mode nào quan trọng — resize chỉ-width luôn giữ tỷ lệ. Nó không resize gì cả khi nguồn đã hẹp. Và nó truyền <code>withoutEnlargement</code> như lớp thứ hai của cùng đảm bảo đó. Ba quyết định, đều phục vụ &quot;đừng bao giờ làm ảnh tệ đi&quot;.</p>

<h3><code>withoutEnlargement</code> — option quan trọng nhất</h3>
<pre><code class="language-javascript">// KHÔNG có cờ:
await sharp(avatar400x400).resize({ width: 1200 }).toBuffer()
// Output: 1200 × 1200. Sharp đã phóng to 3×.
// Ảnh giờ mờ, và file lớn 4× cho zero chi tiết thêm.
// Bạn làm nó tệ đi ở cả hai chiều quan trọng.

// CÓ cờ:
await sharp(avatar400x400)
  .resize({ width: 1200, withoutEnlargement: true })
  .toBuffer()
// Output: 400 × 400. Không đụng. Đúng.
</code></pre>

<pre><code class="language-text">Đo trên một avatar PNG 400×400 thật (48 KB):

  Không cờ, resize lên 1200:   WebP 1200×1200, 84 KB, thấy rõ mềm
  Có cờ,    resize lên 1200:   WebP 400×400,   11 KB, sắc

  Bản phóng to lớn hơn 7.6× và trông tệ hơn.
  Trên 10,000 avatar đó là ~730 MB storage mua
  được đúng cái mờ.
</code></pre>

<p>Phóng to không bao giờ thêm thông tin. Mọi thuật toán nội suy — nearest, bilinear, Lanczos, bất cứ cái gì <code>kernel: 'lanczos3'</code> mặc định của Sharp làm — đều đang đoán những pixel chưa bao giờ được ghi lại. Hai lựa chọn trung thực duy nhất là &quot;để nó nhỏ&quot; hoặc &quot;để CSS scale nó trong browser&quot;, và cả hai đều tốt hơn nướng một phỏng đoán vào file mà rồi bạn trả tiền lưu và phục vụ mãi mãi.</p>

<h3>Position — 'cover' cắt từ đâu</h3>
<pre><code class="language-javascript">// Mặc định: cắt giữa
.resize(800, 800, { fit: 'cover' })

// Cắt từ một cạnh có tên
.resize(800, 800, { fit: 'cover', position: 'top' })
// 'top' | 'right top' | 'right' | 'right bottom' | 'bottom'
// | 'left bottom' | 'left' | 'left top' | 'centre'

// Để libvips tự tìm phần thú vị
.resize(800, 800, { fit: 'cover', position: sharp.strategy.attention })
// 'attention' — thiên về vùng có tần số độ sáng /
//               độ bão hoà cao nhất (khuôn mặt, chủ thể)
// 'entropy'   — thiên về vùng có nhiều chi tiết nhất
</code></pre>

<pre><code class="language-text">Khi nào mỗi position đáng dùng:

  centre (mặc định)       Ảnh chung. Đúng ~80% thời gian.
  top                     Chân dung — đầu ở gần trên.
                          Ảnh sản phẩm nền trắng — chủ thể lệch trên.
  attention               Ảnh người dùng sinh, chủ thể ở vị trí
                          không đoán được. Tốn thêm ~15-25 ms
                          mỗi ảnh (libvips quét độ nổi bật).
  entropy                 Phong cảnh, texture — tối đa chi tiết
                          giữ được thay vì chủ thể giữ được.

Cost đo trên crop cover 4032×3024 → 800×800:
  position: 'centre'      ~140 ms
  position: 'top'         ~140 ms
  sharp.strategy.entropy  ~162 ms   (+16%)
  sharp.strategy.attention ~171 ms  (+22%)
</code></pre>

<h3>Kernel — chất lượng vs tốc độ khi thu nhỏ</h3>
<pre><code class="language-javascript">.resize({ width: 1200, kernel: 'lanczos3' })   // MẶC ĐỊNH — chất lượng tốt nhất
.resize({ width: 1200, kernel: 'lanczos2' })   // mềm hơn chút, nhanh hơn chút
.resize({ width: 1200, kernel: 'cubic' })      // nhanh hơn, mềm hơn
.resize({ width: 1200, kernel: 'mitchell' })   // ít viền rung trên cạnh sắc
.resize({ width: 1200, kernel: 'nearest' })    // nhanh nhất, răng cưa — chỉ pixel art
</code></pre>

<p>Mặc định là đúng cho về cơ bản mọi workload ảnh. Đổi nó chỉ cho pixel art (nơi <code>nearest</code> giữ cạnh cứng có chủ đích) hoặc khi profiling chứng minh resize là bottleneck của bạn, mà nó gần như không bao giờ là — encode chiếm ưu thế.</p>

<h3>Pattern nhiều variant, làm đúng</h3>
<pre><code class="language-javascript">import sharp from 'sharp'

const SIZES = [400, 800, 1600]

async function makeVariants(input) {
  // Decode một lần — tái dùng metadata để bỏ hẳn size bị phóng to.
  const base = sharp(input, { limitInputPixels: 100_000_000 })
  const meta = await base.metadata()

  const wanted = SIZES.filter(w =&gt; w &lt;= meta.width)
  // Nếu nguồn rộng 600 px, chỉ variant 400 được sinh.
  // Đừng bao giờ sinh variant lớn hơn nguồn.

  const variants = await Promise.all(
    wanted.map(async (width) =&gt; {
      const { data, info } = await base
        .clone()                                    // rẽ nhánh mỗi variant
        .resize({ width, withoutEnlargement: true })
        .rotate()                                   // EXIF — xem Bài 1.4
        .webp({ quality: 80, effort: 4 })
        .toBuffer({ resolveWithObject: true })
      return { width: info.width, height: info.height, bytes: data.length, data }
    }),
  )

  return variants
}
</code></pre>
<div class="out">
<pre><code class="language-text">Input: JPEG iPhone 4032×3024 (3,821 KB)
  → 400×300   WebP    28 KB
  → 800×600   WebP    94 KB
  → 1600×1200 WebP   287 KB

Input: JPEG lấy từ web 600×450 (81 KB)
  → 400×300   WebP    31 KB
  (800 và 1600 bị bỏ — nguồn chỉ rộng 600 px)</code></pre>
</div>

<div class="pitfall">
<p><strong>Bẫy — truyền cả width và height mà không nghĩ về fit.</strong> <code>.resize(800, 800)</code> mặc định <code>fit: 'cover'</code>, tức là <em>cắt</em>. Người dùng upload chân dung toàn thân và nhận lại ảnh chỉ có đầu với chân bị cắt mất, và không ai để ý tới khi có khách hàng phàn nàn. Nếu bạn muốn &quot;vừa trong một hộp&quot;, nói <code>fit: 'inside'</code> rõ ràng.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — sinh variant lớn hơn nguồn.</strong> Lọc <code>SIZES</code> theo <code>metadata.width</code> trước vòng lặp là cái ngăn bạn trả cost storage và Class A cho một variant 1600px thực chất là một ảnh 600px mờ. <code>withoutEnlargement</code> ngăn cái mờ nhưng vẫn sinh ra file — bộ lọc mới ngăn được file.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> <code>resize()</code> mặc định <code>fit: 'cover'</code> tức là cắt về kích thước chính xác, nên truyền <code>fit: 'inside'</code> khi bạn muốn &quot;chặn kích thước&quot; và chỉ-width khi bạn muốn &quot;chặn chiều rộng&quot;; luôn đặt <code>withoutEnlargement: true</code> vì phóng to không thêm thông tin mà nhân kích thước file (đo được: avatar 400×400 phóng lên 1200 lớn hơn 7.6× và thấy rõ mềm), và trong pipeline nhiều variant hãy lọc danh sách size theo <code>metadata.width</code> trước để không bao giờ sinh variant lớn hơn nguồn của nó.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sharp — resize()</span><span class="lc-sub">sharp.pixelplumbing.com/api-resize — mọi option fit, position, và kernel.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">libvips — Smart crop</span><span class="lc-sub">libvips.github.io/libvips/API/current/libvips-conversion.html — cách chiến lược attention/entropy chấm điểm vùng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/imageOptimizer.ts</span><span class="lc-sub">MAX_WIDTH = 1200 với resize có điều kiện + <code>withoutEnlargement</code>.</span></span></div>
</div>
`,
    },


    {
      title: '1.4 — The EXIF rotation trap|||1.4 — Bẫy xoay EXIF',
      slug: 'mp-1-4-exif',
      type: 'VIDEO',
      description: 'Phone photos are stored sideways with a "please rotate me" tag. Strip the tag without applying it and every portrait photo lands on its side. This is the single most common image bug in web apps.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>The EXIF rotation trap</h2>
<p class="lead">A user takes a portrait photo on their phone. It looks correct in their gallery, correct in the upload preview, and lands on your site rotated 90°. Nothing in your code rotated it. The bug is that your code <em>failed to</em> rotate it — the phone stored the pixels sideways and attached a tag saying &quot;display this rotated&quot;, your re-encode dropped the tag, and now the sideways pixels are all that is left.</p>

<h3>Why phones do this at all</h3>
<pre><code class="language-text">A phone camera sensor has a fixed physical orientation. It always
reads out pixels in the same order regardless of how you hold the
phone. Rotating the pixel array in software at capture time would
cost time and battery on every single shot.

So instead:
  1. Write the sensor's pixels to the file unrotated.
  2. Read the accelerometer.
  3. Write ONE NUMBER into the EXIF header describing how the
     viewer should rotate it.

The number is EXIF tag 0x0112 "Orientation", values 1 through 8.
</code></pre>

<h3>The eight values</h3>
<pre><code class="language-text">Value   Meaning                            Frequency in the wild
─────  ────────────────────────────────  ─────────────────────
  1     Normal — no transform needed       ~55% (landscape shots)
  2     Flip horizontal                    &lt;1% (selfie mirroring)
  3     Rotate 180°                        ~3% (phone held upside-down)
  4     Flip vertical                      &lt;1%
  5     Transpose (flip + rotate 90° CCW)  &lt;1%
  6     Rotate 90° CW                      ~25% (portrait, most common)
  7     Transverse                         &lt;1%
  8     Rotate 90° CCW                     ~15% (portrait, other way)

Roughly 40% of phone photos carry a non-1 orientation.
That is 40% of your uploads broken if you get this wrong.
</code></pre>

<h3>How the bug happens, step by step</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Phone writes sideways pixels + orientation: 6</span><span class="lz-d">The JPEG on disk is genuinely 4032×3024 (landscape pixel layout), with a tag saying &quot;rotate 90° CW to display&quot;. Every correct viewer — Photos.app, Finder preview, Chrome rendering the raw file — applies it and shows a 3024×4032 portrait.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Your pipeline re-encodes to WebP</span><span class="lz-d">Sharp decodes the sideways pixels, resizes them (still sideways), and encodes WebP. The output WebP has <strong>no EXIF orientation tag</strong> — Sharp drops metadata by default, and WebP support for orientation is spotty anyway.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The instruction is gone; only the sideways pixels remain</span><span class="lz-d">Now there is nothing telling the browser to rotate. It renders exactly what it is given: a landscape image of a portrait scene. The photo is on its side, permanently, in a file you have already stored and served.</span></div>
</div>

<h3>The fix is one call</h3>
<pre><code class="language-javascript">// src/storage/imageOptimizer.ts
//
// Rotate according to EXIF orientation BEFORE the WebP encode so the
// resulting file is right-side-up without baking the rotation into a
// re-encoding cycle.
pipeline = pipeline.rotate()
</code></pre>

<p><code>.rotate()</code> with <strong>no arguments</strong> means &quot;read the EXIF orientation and apply it&quot;. This is different from <code>.rotate(90)</code>, which means &quot;rotate 90° regardless of what EXIF says&quot;. The no-argument form is what you want in a pipeline: it is a no-op for orientation 1 (the 55% case) and does exactly the right thing for the other seven.</p>

<h3>Order matters — rotate relative to resize</h3>
<pre><code class="language-javascript">// The repo's order:
if (metadata.width &gt; MAX_WIDTH) {
  pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true })
}
pipeline = pipeline.rotate()
</code></pre>

<pre><code class="language-text">Why this order works, and where it gets subtle:

Source: 4032×3024 stored, orientation 6 (displays as 3024×4032 portrait)
Target: cap width at 1200

  resize({ width: 1200 }) on the STORED pixels
    → 1200×900   (still sideways)
  .rotate() applies orientation 6
    → 900×1200   (correct portrait)

  Final: 900 px wide. The cap of 1200 was applied to the sideways
  width, so the DISPLAYED width ends up 900, not 1200.

If instead you rotate first:
  .rotate()  → 3024×4032 (correct portrait)
  resize({ width: 1200 }) → 1200×1600
  Final: 1200 px wide displayed. Bigger file, matches the intent
  of "cap displayed width at 1200".

Neither is wrong — they answer different questions. Pick the one
that matches what your MAX_WIDTH means, and be consistent.
</code></pre>

<p>The repo's ordering caps the <em>stored</em> width, which slightly under-sizes portrait photos. That is a deliberate, harmless trade: portrait photos end up a bit smaller than the cap rather than a bit larger, and no photo ever exceeds the budget.</p>

<h3>The other half: metadata dimensions lie</h3>
<pre><code class="language-javascript">const meta = await sharp(input).metadata()
console.log(meta.width, meta.height, meta.orientation)
// 4032 3024 6

// If you save THESE numbers as "image dimensions" in your DB,
// every portrait photo gets a landscape aspect ratio in your UI,
// your grid layout breaks, and your blur-placeholder is the wrong shape.

// The correct dimensions are the OUTPUT dimensions:
const { data, info } = await sharp(input)
  .rotate()
  .webp()
  .toBuffer({ resolveWithObject: true })

console.log(info.width, info.height)
// 3024 4032   ← THESE are what you store
</code></pre>

<p>This is why the repo's <code>OptimizedImage</code> interface returns <code>width</code> and <code>height</code> from <code>out.info</code>, not from <code>metadata</code>. The output info is post-rotation and post-resize — it is the only source of truth for &quot;what shape is this file&quot;.</p>

<h3>Computing display dimensions from metadata alone</h3>
<pre><code class="language-javascript">// If you must know the display shape BEFORE decoding (e.g. to decide
// whether to process at all), swap on the orientation:
function displayDimensions(meta) {
  const swapped = meta.orientation &gt;= 5 &amp;&amp; meta.orientation &lt;= 8
  return swapped
    ? { width: meta.height, height: meta.width }
    : { width: meta.width,  height: meta.height }
}
// Orientations 5, 6, 7, 8 all involve a 90° turn, so they swap the axes.
// Orientations 1, 2, 3, 4 do not.
</code></pre>

<h3>Test cases you actually need</h3>
<pre><code class="language-text">A test suite for this bug needs real files, not synthetic ones —
you cannot easily fabricate a correct EXIF block by hand.

  fixtures/
    landscape-orient-1.jpg     baseline, no rotation
    portrait-orient-6.jpg      the 25% case (90° CW)
    portrait-orient-8.jpg      the 15% case (90° CCW)
    upside-down-orient-3.jpg   180°
    no-exif-at-all.png         PNG has no EXIF — .rotate() is a no-op

Assert on OUTPUT dimensions, not on the absence of an error:

  const { info } = await optimize(readFileSync('portrait-orient-6.jpg'))
  expect(info.height).toBeGreaterThan(info.width)   // must be portrait
</code></pre>

<p>Capture the fixtures with an actual phone, holding it in each orientation. Generating them with a tool that writes EXIF tends to produce files whose tags do not match what real cameras write, and the test then passes on files that do not resemble your traffic.</p>

<div class="pitfall">
<p><strong>Bẫy — using <code>.rotate(90)</code> to &quot;fix&quot; sideways photos.</strong> That rotates <em>every</em> image 90°, so the 55% that were already correct now land sideways. The fix for &quot;some photos are rotated&quot; is never a fixed angle; it is <code>.rotate()</code> with no argument, which reads each file's own tag.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — keeping EXIF instead of applying it.</strong> <code>.withMetadata()</code> preserves the EXIF block including orientation, which sounds like it solves the problem. It does not reliably: WebP and AVIF have inconsistent orientation support across browsers, and any downstream tool that re-encodes will drop it again. Applying the rotation to the pixels is permanent and works everywhere. Keep EXIF only if you specifically need the GPS/timestamp/camera fields — and note that shipping GPS coordinates in user uploads is a privacy leak, which is why Sharp strips metadata by default.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> About 40% of phone photos store their pixels sideways with an EXIF orientation tag telling viewers to rotate, and re-encoding drops that tag — so call <code>.rotate()</code> with no arguments (which reads and applies each file's own orientation, and is a no-op for the 55% that need nothing) before the encode, store <code>info.width</code>/<code>info.height</code> from the output rather than the pre-rotation <code>metadata</code> dimensions, and test with real phone-captured fixtures at orientations 1, 3, 6, and 8.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sharp — rotate()</span><span class="lc-sub">sharp.pixelplumbing.com/api-operation#rotate — the no-argument EXIF form vs explicit angles.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CIPA — Exif 2.32 specification</span><span class="lc-sub">cipa.jp/std/documents/e/DC-008-Translation-2019-E.pdf — tag 0x0112 and all eight values.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — image-orientation</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/image-orientation — the CSS side, and why <code>from-image</code> is the default.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/imageOptimizer.ts</span><span class="lc-sub"><code>pipeline.rotate()</code> đặt sau resize và trước encode WebP, kèm comment giải thích thứ tự.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Bẫy xoay EXIF</h2>
<p class="lead">Người dùng chụp một ảnh dọc trên điện thoại. Nó đúng trong thư viện của họ, đúng trong preview upload, và lên site của bạn thì xoay 90°. Không có gì trong code của bạn xoay nó. Bug là code của bạn <em>đã không</em> xoay nó — điện thoại lưu pixel nằm ngang và đính một thẻ nói &quot;hiển thị cái này đã xoay&quot;, việc re-encode của bạn làm rơi mất thẻ, và giờ pixel nằm ngang là tất cả những gì còn lại.</p>

<h3>Vì sao điện thoại làm thế</h3>
<pre><code class="language-text">Cảm biến camera điện thoại có hướng vật lý cố định. Nó luôn
đọc pixel theo cùng thứ tự bất kể bạn cầm máy thế nào. Xoay
mảng pixel bằng phần mềm lúc chụp sẽ tốn thời gian và pin
trên từng tấm ảnh.

Nên thay vào đó:
  1. Ghi pixel của cảm biến vào file, không xoay.
  2. Đọc gia tốc kế.
  3. Ghi MỘT CON SỐ vào header EXIF mô tả trình xem
     nên xoay nó thế nào.

Con số là thẻ EXIF 0x0112 "Orientation", giá trị 1 tới 8.
</code></pre>

<h3>Tám giá trị</h3>
<pre><code class="language-text">Giá trị  Ý nghĩa                            Tần suất thực tế
─────  ────────────────────────────────  ─────────────────────
  1     Bình thường — không cần biến đổi   ~55% (ảnh ngang)
  2     Lật ngang                          &lt;1% (gương selfie)
  3     Xoay 180°                          ~3% (cầm máy lộn ngược)
  4     Lật dọc                            &lt;1%
  5     Chuyển vị (lật + xoay 90° CCW)     &lt;1%
  6     Xoay 90° CW                        ~25% (dọc, phổ biến nhất)
  7     Chuyển vị ngang                    &lt;1%
  8     Xoay 90° CCW                       ~15% (dọc, chiều kia)

Khoảng 40% ảnh điện thoại mang orientation khác 1.
Đó là 40% upload của bạn hỏng nếu làm sai chỗ này.
</code></pre>

<h3>Bug xảy ra thế nào, từng bước</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Điện thoại ghi pixel nằm ngang + orientation: 6</span><span class="lz-d">JPEG trên đĩa thật sự là 4032×3024 (bố cục pixel ngang), với thẻ nói &quot;xoay 90° CW để hiển thị&quot;. Mọi trình xem đúng — Photos.app, preview Finder, Chrome render file thô — đều áp dụng và hiện ảnh dọc 3024×4032.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Pipeline của bạn re-encode sang WebP</span><span class="lz-d">Sharp decode pixel nằm ngang, resize chúng (vẫn nằm ngang), và encode WebP. WebP output <strong>không có thẻ EXIF orientation</strong> — Sharp bỏ metadata mặc định, và WebP hỗ trợ orientation cũng chập chờn.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Chỉ thị mất; chỉ còn pixel nằm ngang</span><span class="lz-d">Giờ không có gì bảo browser xoay. Nó render đúng cái được đưa: một ảnh ngang của một cảnh dọc. Ảnh nằm nghiêng, vĩnh viễn, trong một file bạn đã lưu và đã phục vụ.</span></div>
</div>

<h3>Vá là một lời gọi</h3>
<pre><code class="language-javascript">// src/storage/imageOptimizer.ts
//
// Xoay theo EXIF orientation TRƯỚC khi encode WebP để file kết quả
// đúng chiều mà không nướng phép xoay vào một chu kỳ
// re-encode.
pipeline = pipeline.rotate()
</code></pre>

<p><code>.rotate()</code> <strong>không tham số</strong> nghĩa là &quot;đọc EXIF orientation và áp dụng nó&quot;. Cái này khác <code>.rotate(90)</code>, nghĩa là &quot;xoay 90° bất kể EXIF nói gì&quot;. Dạng không-tham-số là cái bạn muốn trong pipeline: nó là no-op cho orientation 1 (case 55%) và làm đúng chính xác cho bảy cái còn lại.</p>

<h3>Thứ tự quan trọng — xoay so với resize</h3>
<pre><code class="language-javascript">// Thứ tự của kho:
if (metadata.width &gt; MAX_WIDTH) {
  pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true })
}
pipeline = pipeline.rotate()
</code></pre>

<pre><code class="language-text">Vì sao thứ tự này chạy được, và chỗ nó tinh tế:

Nguồn: lưu 4032×3024, orientation 6 (hiển thị 3024×4032 dọc)
Đích: chặn width ở 1200

  resize({ width: 1200 }) trên pixel ĐÃ LƯU
    → 1200×900   (vẫn nằm ngang)
  .rotate() áp dụng orientation 6
    → 900×1200   (dọc đúng)

  Cuối: rộng 900 px. Trần 1200 áp lên chiều rộng nằm ngang,
  nên chiều rộng HIỂN THỊ kết cục là 900, không phải 1200.

Nếu thay vào đó xoay trước:
  .rotate()  → 3024×4032 (dọc đúng)
  resize({ width: 1200 }) → 1200×1600
  Cuối: hiển thị rộng 1200 px. File lớn hơn, khớp với ý định
  "chặn chiều rộng hiển thị ở 1200".

Không cái nào sai — chúng trả lời câu hỏi khác nhau. Chọn cái
khớp với ý nghĩa MAX_WIDTH của bạn, và nhất quán.
</code></pre>

<p>Thứ tự của kho chặn chiều rộng <em>đã lưu</em>, làm ảnh dọc hơi nhỏ hơn một chút. Đó là một đánh đổi cố ý, vô hại: ảnh dọc kết cục nhỏ hơn trần một chút thay vì lớn hơn một chút, và không ảnh nào vượt ngân sách.</p>

<h3>Nửa còn lại: kích thước metadata nói dối</h3>
<pre><code class="language-javascript">const meta = await sharp(input).metadata()
console.log(meta.width, meta.height, meta.orientation)
// 4032 3024 6

// Nếu bạn lưu NHỮNG con số này làm "kích thước ảnh" trong DB,
// mọi ảnh dọc sẽ có tỷ lệ ngang trong UI của bạn,
// bố cục lưới vỡ, và blur-placeholder sai hình dạng.

// Kích thước đúng là kích thước OUTPUT:
const { data, info } = await sharp(input)
  .rotate()
  .webp()
  .toBuffer({ resolveWithObject: true })

console.log(info.width, info.height)
// 3024 4032   ← ĐÂY mới là cái bạn lưu
</code></pre>

<p>Đó là vì sao interface <code>OptimizedImage</code> của kho trả <code>width</code> và <code>height</code> từ <code>out.info</code>, không phải từ <code>metadata</code>. Info output là sau-xoay và sau-resize — nó là nguồn sự thật duy nhất cho &quot;file này hình dạng gì&quot;.</p>

<h3>Tính kích thước hiển thị chỉ từ metadata</h3>
<pre><code class="language-javascript">// Nếu bạn buộc phải biết hình dạng hiển thị TRƯỚC khi decode (vd để
// quyết có xử lý không), hoán đổi theo orientation:
function displayDimensions(meta) {
  const swapped = meta.orientation &gt;= 5 &amp;&amp; meta.orientation &lt;= 8
  return swapped
    ? { width: meta.height, height: meta.width }
    : { width: meta.width,  height: meta.height }
}
// Orientation 5, 6, 7, 8 đều có một phép xoay 90°, nên chúng hoán trục.
// Orientation 1, 2, 3, 4 thì không.
</code></pre>

<h3>Test case bạn thực sự cần</h3>
<pre><code class="language-text">Bộ test cho bug này cần file thật, không phải file tổng hợp —
bạn không dễ chế được một khối EXIF đúng bằng tay.

  fixtures/
    landscape-orient-1.jpg     nền, không xoay
    portrait-orient-6.jpg      case 25% (90° CW)
    portrait-orient-8.jpg      case 15% (90° CCW)
    upside-down-orient-3.jpg   180°
    no-exif-at-all.png         PNG không có EXIF — .rotate() là no-op

Khẳng định trên kích thước OUTPUT, không phải trên việc không có lỗi:

  const { info } = await optimize(readFileSync('portrait-orient-6.jpg'))
  expect(info.height).toBeGreaterThan(info.width)   // phải là dọc
</code></pre>

<p>Chụp fixture bằng điện thoại thật, cầm nó ở mỗi hướng. Sinh chúng bằng một tool ghi EXIF có xu hướng tạo ra file mà thẻ không khớp cái camera thật ghi, và test khi đó pass trên những file không giống traffic của bạn.</p>

<div class="pitfall">
<p><strong>Bẫy — dùng <code>.rotate(90)</code> để &quot;vá&quot; ảnh nằm ngang.</strong> Cái đó xoay <em>mọi</em> ảnh 90°, nên 55% vốn đã đúng giờ lại nằm ngang. Vá cho &quot;một số ảnh bị xoay&quot; không bao giờ là một góc cố định; nó là <code>.rotate()</code> không tham số, đọc thẻ riêng của từng file.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — giữ EXIF thay vì áp dụng nó.</strong> <code>.withMetadata()</code> giữ khối EXIF gồm cả orientation, nghe như giải quyết được vấn đề. Không đáng tin cậy: WebP và AVIF hỗ trợ orientation không nhất quán giữa các browser, và bất kỳ tool downstream nào re-encode sẽ lại làm rơi nó. Áp dụng phép xoay vào pixel là vĩnh viễn và chạy được mọi nơi. Chỉ giữ EXIF nếu bạn cần cụ thể các field GPS/timestamp/camera — và lưu ý ship toạ độ GPS trong upload người dùng là rò rỉ riêng tư, đó là vì sao Sharp bỏ metadata mặc định.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Khoảng 40% ảnh điện thoại lưu pixel nằm ngang với một thẻ EXIF orientation bảo trình xem xoay, và re-encode làm rơi thẻ đó — nên hãy gọi <code>.rotate()</code> không tham số (nó đọc và áp dụng orientation riêng của từng file, và là no-op cho 55% không cần gì) trước khi encode, lưu <code>info.width</code>/<code>info.height</code> từ output chứ không phải kích thước <code>metadata</code> trước-xoay, và test bằng fixture chụp từ điện thoại thật ở orientation 1, 3, 6, và 8.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sharp — rotate()</span><span class="lc-sub">sharp.pixelplumbing.com/api-operation#rotate — dạng EXIF không tham số vs góc explicit.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CIPA — Exif 2.32 specification</span><span class="lc-sub">cipa.jp/std/documents/e/DC-008-Translation-2019-E.pdf — thẻ 0x0112 và cả tám giá trị.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">MDN — image-orientation</span><span class="lc-sub">developer.mozilla.org/en-US/docs/Web/CSS/image-orientation — phía CSS, và vì sao <code>from-image</code> là mặc định.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/storage/imageOptimizer.ts</span><span class="lc-sub"><code>pipeline.rotate()</code> đặt sau resize và trước encode WebP, kèm comment giải thích thứ tự.</span></span></div>
</div>
`,
    },

    {
      title: '1.5 — Chapter 1 quiz|||1.5 — Kiểm tra Chương 1',
      slug: 'mp-1-5-quiz',
      type: 'QUIZ',
      description: 'Bốn câu về pipeline lười, metadata, resize, và EXIF.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 1 · Quiz</span><h2>What Chapter 1 established</h2></div><div class="ml-vi"><span class="eyebrow">Chương 1 · Kiểm tra</span><h2>Chương 1 đã dựng được gì</h2></div>`,
      quiz: {
        timeLimitSeconds: 400,
        questions: [
          {
            question: 'You need WebP and AVIF from one source. What is wrong with calling <code>.webp().toBuffer()</code> then <code>.avif().toBuffer()</code> on the same pipeline?|||Bạn cần WebP và AVIF từ một nguồn. Sai gì khi gọi <code>.webp().toBuffer()</code> rồi <code>.avif().toBuffer()</code> trên cùng pipeline?',
            options: [
              'Transform methods return the same mutable instance, so the second call gives a pipeline with BOTH output formats queued and the result is implementation-defined. Use <code>clone()</code> to fork before the format-specific tail: <code>base.clone().webp()</code> and <code>base.clone().avif()</code> — the source decodes once, each output encodes independently.|||Method transform trả về chính instance mutable, nên lời gọi thứ hai cho một pipeline có CẢ HAI format output queued và kết quả là do cài đặt quyết định. Dùng <code>clone()</code> để rẽ nhánh trước cái đuôi riêng-format: <code>base.clone().webp()</code> và <code>base.clone().avif()</code> — nguồn decode một lần, mỗi output encode độc lập.',
              'Nothing is wrong — Sharp resets after each toBuffer()|||Không sai gì — Sharp reset sau mỗi toBuffer()',
              'AVIF must always come first|||AVIF luôn phải đến trước',
              'You must create two separate sharp() instances from the buffer|||Bạn phải tạo hai instance sharp() riêng từ buffer',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'A 758 KB PNG upload passes your file-size, MIME, and magic-byte checks, then costs ~99 MB RSS to process. What is it and what stops it?|||Một upload PNG 758 KB qua được phép kiểm kích thước, MIME, và magic-byte của bạn, rồi tốn ~99 MB RSS để xử lý. Nó là gì và cái gì chặn được?',
            options: [
              'A decompression bomb — a flat-colour PNG describing 16000×16000 (256 MP) that compresses to almost nothing. Only a PIXEL budget catches it: check <code>metadata.width × metadata.height</code> against a cap (the repo uses 100 MP), plus <code>limitInputPixels</code> on the constructor as a backstop for lying headers, plus a concurrency gate so bursts cannot stack the cost.|||Một decompression bomb — PNG một màu phẳng mô tả 16000×16000 (256 MP) nén còn gần như không có gì. Chỉ ngân sách PIXEL bắt được: kiểm <code>metadata.width × metadata.height</code> so với một trần (kho dùng 100 MP), plus <code>limitInputPixels</code> trên constructor làm lưới đỡ cho header nói dối, plus một cổng concurrency để burst không chồng cost.',
              'A malformed PNG — reject on DECODE_FAILED|||Một PNG hỏng — loại ở DECODE_FAILED',
              'A progressive PNG — disable progressive decoding|||Một PNG progressive — tắt decode progressive',
              'Normal for large PNGs — raise the server memory limit|||Bình thường với PNG lớn — tăng giới hạn memory server',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Users upload 400×400 avatars. Your pipeline runs <code>.resize({ width: 1200 })</code>. What happens, and what is the fix?|||Người dùng upload avatar 400×400. Pipeline của bạn chạy <code>.resize({ width: 1200 })</code>. Gì xảy ra, và vá thế nào?',
            options: [
              'Sharp upscales 3× to 1200×1200 — measurably 7.6× larger on disk and visibly soft, since interpolation invents pixels that were never captured. Add <code>withoutEnlargement: true</code> so small sources pass through untouched, and in multi-variant pipelines also filter the size list against <code>metadata.width</code> so the oversized variant is never produced at all.|||Sharp phóng to 3× lên 1200×1200 — đo được lớn hơn 7.6× trên đĩa và thấy rõ mềm, vì nội suy bịa ra pixel chưa bao giờ được ghi. Thêm <code>withoutEnlargement: true</code> để nguồn nhỏ đi qua không bị đụng, và trong pipeline nhiều variant cũng lọc danh sách size theo <code>metadata.width</code> để variant quá cỡ không bao giờ được sinh ra.',
              'Nothing — Sharp never upscales|||Không gì — Sharp không bao giờ phóng to',
              'It throws an error you should catch|||Nó throw một lỗi bạn nên bắt',
              'The output stays 400×400 but the file gets larger|||Output giữ 400×400 nhưng file lớn hơn',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'After your WebP re-encode, ~40% of user photos appear rotated 90°. Cause and fix?|||Sau khi re-encode WebP, ~40% ảnh người dùng hiện bị xoay 90°. Nguyên nhân và vá?',
            options: [
              'Phones store pixels sideways plus an EXIF orientation tag; the re-encode drops the tag, leaving only sideways pixels. Call <code>.rotate()</code> with NO arguments before encoding — it reads each file\'s own orientation and is a no-op for the ~55% that need nothing. Also store <code>info.width</code>/<code>info.height</code> from the output, since <code>metadata</code> dimensions are pre-rotation.|||Điện thoại lưu pixel nằm ngang cộng một thẻ EXIF orientation; việc re-encode làm rơi thẻ, chỉ để lại pixel nằm ngang. Gọi <code>.rotate()</code> KHÔNG tham số trước khi encode — nó đọc orientation riêng của từng file và là no-op cho ~55% không cần gì. Cũng lưu <code>info.width</code>/<code>info.height</code> từ output, vì kích thước <code>metadata</code> là trước-xoay.',
              'Call <code>.rotate(90)</code> to correct them|||Gọi <code>.rotate(90)</code> để chỉnh chúng',
              'Use <code>.withMetadata()</code> to keep the EXIF tag — that is a complete fix|||Dùng <code>.withMetadata()</code> để giữ thẻ EXIF — đó là vá hoàn chỉnh',
              'A Sharp bug — pin to an older version|||Một bug Sharp — ghim về phiên bản cũ',
            ],
            correctIndex: 0, points: 1,
          },
        ],
      },
    },
  ],
};
