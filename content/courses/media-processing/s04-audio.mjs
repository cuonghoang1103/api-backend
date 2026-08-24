const REF = '?ref=%2Fcourses%2Fmedia-processing%2Flearn&reflabel=Media%20Processing';
export default {
  title: 'Chapter 4 — Audio: decode, normalize, stream|||Chương 4 — Âm thanh: giải mã, chuẩn hoá, chảy dòng',
  slug: 'mp-ch4-audio',
  description: 'Bốn bài về âm thanh: chảy dòng qua pipe thay vì file tạm, chuẩn hoá độ to EBU R128 (kèm một bug thật), chọn format, và kiểm tra.',
  sortOrder: 5,
  lessons: [

    {
      title: '4.1 — Streaming through pipes instead of temp files|||4.1 — Chảy dòng qua pipe thay vì file tạm',
      slug: 'mp-4-1-pipes',
      type: 'VIDEO',
      description: 'The write-temp-run-read-unlink dance has four failure modes and needs a disk. spawn with pipe:0 and pipe:1 removes all of them — and this repo ships a decoder that does exactly that.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Streaming through pipes instead of temp files</h2>
<p class="lead">Chapter 3's thumbnail code writes the input to <code>/tmp</code>, runs FFmpeg on the path, reads the output back, and unlinks both. That is four filesystem operations, a disk dependency, and a cleanup obligation on every error path. For audio — where the data is usually small and the transform is a pure stream — you can skip all of it: hand the bytes to the process on stdin and read the result off stdout.</p>

<h3>The two shapes, side by side</h3>
<pre><code class="language-text">TEMP-FILE SHAPE                      PIPE SHAPE
─────────────────────────────────   ─────────────────────────────
1. fs.writeFile(inputPath, buf)      1. spawn(bin, [... 'pipe:0' ... 'pipe:1'])
2. spawn/exec on inputPath           2. proc.stdin.end(buf)
3. fs.readFile(outputPath)           3. collect proc.stdout
4. fs.unlink(inputPath)
5. fs.unlink(outputPath)

Needs: a writable disk,             Needs: nothing but memory
       unique filenames,
       cleanup on EVERY error path

Fails when: disk full, /tmp is       Fails when: the data is too big
       read-only, two requests               to hold in RAM
       collide on a name,
       the process crashes
       between 2 and 4 (leak)
</code></pre>

<h3>The repo's decoder, which is pure pipe</h3>
<pre><code class="language-javascript">// src/services/makerlab/audio.ts
const DECODERS = [
  { bin: 'mpg123', args: (r) =&gt; ['-q', '--mono', '-r', String(r), '-s', '-'] },
  {
    bin: 'ffmpeg',
    args: (r) =&gt; [
      '-hide_banner',
      '-loglevel', 'error',
      '-i', 'pipe:0',        // ← read the MP3 from stdin
      '-f', 's16le',         // raw signed 16-bit little-endian
      '-acodec', 'pcm_s16le',
      '-ac', '1',            // mono
      '-ar', String(r),      // sample rate
      'pipe:1',              // ← write the PCM to stdout
    ],
  },
]
</code></pre>

<p>Note <code>pipe:0</code> and <code>pipe:1</code> in the FFmpeg argv, and the bare <code>-</code> in mpg123's. Both are the same idea in each tool's spelling: read stdin, write stdout. No path is ever constructed, so there is no temp file, no cleanup, and — following Chapter 3 — no way for a filename to reach a shell.</p>

<h3>Driving it correctly</h3>
<pre><code class="language-javascript">// src/services/makerlab/audio.ts (condensed)
function decodeWith(dec, mp3, sampleRate) {
  return new Promise((resolve, reject) =&gt; {
    const ff = spawn(dec.bin, dec.args(sampleRate))

    const out = []
    const err = []
    let settled = false

    // Guard: 'error' and 'close' can BOTH fire. Settle once.
    const done = (e, buf) =&gt; {
      if (settled) return
      settled = true
      if (e) reject(e)
      else resolve(buf ?? Buffer.alloc(0))
    }

    ff.stdout.on('data', (c) =&gt; out.push(c))
    ff.stderr.on('data', (c) =&gt; err.push(c))   // ← MUST drain, see below

    ff.on('error', (e) =&gt; {
      const notFound = e.code === 'ENOENT'
      const wrapped = new Error(\`\${dec.bin} không chạy được: \${e.message}\`)
      // Mark it so the caller knows this is "the tool is missing" rather
      // than "the MP3 is corrupt" — only the first is worth retrying with
      // the next tool.
      wrapped.missing = notFound
      done(wrapped)
    })

    ff.on('close', (code) =&gt; {
      if (code !== 0) {
        const msg = Buffer.concat(err).toString().slice(0, 200)
        done(new Error(\`\${dec.bin} thoát \${code}: \${msg}\`))
        return
      }
      done(null, Buffer.concat(out))
    })

    // Do not let one sentence hang forever if the decoder wedges.
    const timer = setTimeout(() =&gt; {
      ff.kill('SIGKILL')
      done(new Error(\`\${dec.bin} quá hạn 15s\`))
    }, 15_000)
    ff.on('close', () =&gt; clearTimeout(timer))

    ff.stdin.end(mp3)
  })
}
</code></pre>

<h3>Four details in that function that are easy to get wrong</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The <code>settled</code> guard</span><span class="lz-d">A failed spawn emits <code>'error'</code>, and depending on timing may also emit <code>'close'</code>. Calling <code>resolve</code> after <code>reject</code> is a silent no-op in a Promise, but the surrounding logic (a timer, a retry loop) can still run twice. One boolean removes a whole class of duplicate-work bug.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Draining stderr</span><span class="lz-d">Pipes have a fixed OS buffer, typically 64 KB. If you never read stderr and the child writes more than that, the child <em>blocks on write</em> and never exits — a deadlock that looks like a hang. Attaching a <code>'data'</code> listener drains it. This is the same hazard that makes <code>exec</code>'s 1 MB <code>maxBuffer</code> a real limit rather than a formality.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Distinguishing ENOENT from a bad input</span><span class="lz-d">&quot;The binary is not installed&quot; and &quot;this MP3 is corrupt&quot; both surface as a rejected promise. Only the first should make the caller try the next decoder in the list; retrying a corrupt file against three tools just wastes three timeouts. The <code>missing</code> flag carries that distinction outward.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">SIGKILL, not SIGTERM, on timeout</span><span class="lz-d">A decoder stuck in a native loop may ignore SIGTERM. SIGKILL cannot be caught, so the timeout is guaranteed to fire. Use SIGTERM when you want a process to flush and exit cleanly; use SIGKILL when the whole point is that it has stopped responding.</span></div>
</div>

<h3>The fallback chain, and why mpg123 comes first</h3>
<pre><code class="language-javascript">// src/services/makerlab/audio.ts — the ordering comment, verbatim:
//
// mpg123 đứng trước vì image production chỉ cài nó (xem Dockerfile):
// ~1,5 MB cho đúng một việc, thay vì ~80 MB của ffmpeg. ffmpeg đứng
// sau để máy lập trình — vốn gần như luôn có sẵn ffmpeg mà hiếm khi
// có mpg123 — vẫn chạy thử được ở local mà không phải cài thêm gì.
</code></pre>

<pre><code class="language-text">Translated: mpg123 is first because the production image installs only it —
~1.5 MB for exactly one job, versus ffmpeg's ~80 MB. ffmpeg is second so a
developer machine, which nearly always has ffmpeg and rarely has mpg123,
still works locally without installing anything.

That is a real container-size decision:

  Base image (node:22-alpine)                    ~140 MB
  + ffmpeg (full, all codecs)                    ~220 MB   (+80 MB)
  + mpg123 only                                  ~141.5 MB (+1.5 MB)

  Saving: 78.5 MB per image, on every pull, on every deploy.

The cost of the saving is that production and development run DIFFERENT
decoders. Both emit signed 16-bit PCM at the requested rate, so the output
is byte-comparable — but that is an assumption worth testing, not assuming.
</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The probe result is memoized</span><span class="lz-d">The file keeps a module-level <code>chosen</code> and returns <code>[chosen]</code> once one decoder has worked. Without that, every request pays an ENOENT spawn for the missing tool before falling through — a wasted process launch per call.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">An env var can force a specific decoder</span><span class="lz-d"><code>MAKERLAB_MP3_DECODER</code> pins the choice, and unknown values are still tried first with the default argv. That is the escape hatch for &quot;production picked the wrong one&quot; without a code deploy.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>FFMPEG_PATH</code> is honoured too</span><span class="lz-d">If that env var is set, the machine has ffmpeg somewhere non-standard, so it is promoted to the front with ffmpeg's argv. Small touch, but it means one env var configures both this decoder and the two services from Chapter 3.</span></div>
</div>

<h3>When temp files are still the right answer</h3>
<pre><code class="language-text">Pipes lose to temp files when:

  The tool must SEEK the input.
    MP4 with the moov atom at the end (Chapter 3) cannot be read from a
    non-seekable stdin — ffmpeg errors with "Invalid data found when
    processing input". MP3 and WAV are fine; MP4/MOV usually are not.

  The output must be seekable.
    Writing MP4 to pipe:1 fails for the same reason unless you add
    -movflags frag_keyframe+empty_moov to produce a fragmented,
    streamable variant.

  The data is too large to hold in RAM.
    A 2-hour podcast as raw 16-bit 44.1 kHz stereo PCM is ~1.2 GB.
    Buffering that per request is not viable; stream it to disk, or
    pipe it straight into the next process without collecting it.

  You need the file afterwards anyway.
    If the output is going to R2 as a file, and you are streaming it
    to disk to upload it, the temp file is not overhead — it is the
    artifact.
</code></pre>

<h3>Chaining two processes without touching disk</h3>
<pre><code class="language-javascript">// Decode MP3 → PCM → re-encode to Opus, with no intermediate buffer.
import { spawn } from 'node:child_process'

const decoder = spawn('mpg123', ['-q', '--mono', '-r', '48000', '-s', '-'])
const encoder = spawn('ffmpeg', [
  '-hide_banner', '-loglevel', 'error',
  '-f', 's16le', '-ar', '48000', '-ac', '1', '-i', 'pipe:0',
  '-c:a', 'libopus', '-b:a', '24k',
  '-f', 'ogg', 'pipe:1',
])

decoder.stdout.pipe(encoder.stdin)     // ← the whole trick
decoder.stdin.end(mp3Buffer)

const chunks = []
encoder.stdout.on('data', (c) =&gt; chunks.push(c))
// Drain BOTH stderr streams or either process can deadlock.
decoder.stderr.resume()
encoder.stderr.resume()
</code></pre>

<pre><code class="language-text">Peak memory, 5-minute MP3 (4.8 MB) → Opus:

  Temp-file chain     PCM on disk 52 MB, both buffers in RAM   ~61 MB RSS
  Buffered pipe       full PCM Buffer in RAM                   ~58 MB RSS
  Streamed pipe       only the in-flight chunks                ~12 MB RSS

The streamed version never holds the decoded PCM at all — it moves
through 64 KB at a time.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — not draining stderr.</strong> The OS pipe buffer is ~64 KB. A child that writes past it blocks forever waiting for a reader, your <code>close</code> handler never fires, and the request hangs until your timeout. It presents as &quot;FFmpeg is slow on some files&quot; and it is really &quot;FFmpeg is chatty on some files&quot;. Always attach a listener or call <code>.resume()</code>.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — piping a format that needs to seek.</strong> MP4 read from <code>pipe:0</code> fails when its index is at the end of the file, and MP4 written to <code>pipe:1</code> fails because the muxer must go back and fill in the index. Both errors read like corruption. Use temp files for MP4, or fragment it with <code>-movflags frag_keyframe+empty_moov</code>.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Piping through <code>pipe:0</code>/<code>pipe:1</code> removes the disk dependency, the unique-name problem, and the cleanup obligation that the write-run-read-unlink pattern imposes on every error path — but it requires you to drain stderr (or a child writing past the ~64 KB pipe buffer deadlocks), to settle your promise exactly once (<code>'error'</code> and <code>'close'</code> can both fire), to SIGKILL rather than SIGTERM on timeout, and to fall back to temp files for formats like MP4 that need a seekable input or output.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — child_process.spawn</span><span class="lc-sub">nodejs.org/api/child_process.html#child_processspawncommand-args-options — stdio config and the error/close event pair.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">FFmpeg — pipe protocol</span><span class="lc-sub">ffmpeg.org/ffmpeg-protocols.html#pipe — pipe:0 / pipe:1 and the seekability caveat.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">mpg123 manual</span><span class="lc-sub">mpg123.de/mpg123.1.html — <code>-s</code> (stdout), <code>-r</code> (rate), and why it is 1.5 MB.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/services/makerlab/audio.ts</span><span class="lc-sub">Chuỗi decoder, cờ <code>missing</code>, timeout SIGKILL, và lý do mpg123 đứng trước ffmpeg.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Chảy dòng qua pipe thay vì file tạm</h2>
<p class="lead">Code thumbnail ở Chương 3 ghi input vào <code>/tmp</code>, chạy FFmpeg trên đường dẫn đó, đọc output về, rồi unlink cả hai. Đó là bốn thao tác hệ thống tệp, một phụ thuộc vào đĩa, và một nghĩa vụ dọn dẹp trên mọi nhánh lỗi. Với âm thanh — nơi dữ liệu thường nhỏ và phép biến đổi là một dòng chảy thuần tuý — bạn bỏ qua được tất cả: đưa byte cho tiến trình qua stdin và đọc kết quả từ stdout.</p>

<h3>Hai hình dạng, đặt cạnh nhau</h3>
<pre><code class="language-text">HÌNH DẠNG FILE TẠM                   HÌNH DẠNG PIPE
─────────────────────────────────   ─────────────────────────────
1. fs.writeFile(inputPath, buf)      1. spawn(bin, [... 'pipe:0' ... 'pipe:1'])
2. spawn/exec trên inputPath         2. proc.stdin.end(buf)
3. fs.readFile(outputPath)           3. gom proc.stdout
4. fs.unlink(inputPath)
5. fs.unlink(outputPath)

Cần: một đĩa ghi được,              Cần: không gì ngoài memory
     tên file duy nhất,
     dọn dẹp trên MỌI nhánh lỗi

Hỏng khi: đĩa đầy, /tmp chỉ-đọc,    Hỏng khi: dữ liệu quá lớn
     hai request trùng tên,                để giữ trong RAM
     tiến trình chết giữa
     bước 2 và 4 (rò rỉ)
</code></pre>

<h3>Bộ giải mã của kho, thuần pipe</h3>
<pre><code class="language-javascript">// src/services/makerlab/audio.ts
const DECODERS = [
  { bin: 'mpg123', args: (r) =&gt; ['-q', '--mono', '-r', String(r), '-s', '-'] },
  {
    bin: 'ffmpeg',
    args: (r) =&gt; [
      '-hide_banner',
      '-loglevel', 'error',
      '-i', 'pipe:0',        // ← đọc MP3 từ stdin
      '-f', 's16le',         // PCM thô 16-bit có dấu, little-endian
      '-acodec', 'pcm_s16le',
      '-ac', '1',            // mono
      '-ar', String(r),      // tần số lấy mẫu
      'pipe:1',              // ← ghi PCM ra stdout
    ],
  },
]
</code></pre>

<p>Chú ý <code>pipe:0</code> và <code>pipe:1</code> trong argv của FFmpeg, và dấu <code>-</code> trần trong argv của mpg123. Cả hai là cùng một ý tưởng viết theo chính tả của từng công cụ: đọc stdin, ghi stdout. Không đường dẫn nào được dựng, nên không có file tạm, không có dọn dẹp, và — theo Chương 3 — không có cách nào để một tên file chạm tới shell.</p>

<h3>Điều khiển nó cho đúng</h3>
<pre><code class="language-javascript">// src/services/makerlab/audio.ts (rút gọn)
function decodeWith(dec, mp3, sampleRate) {
  return new Promise((resolve, reject) =&gt; {
    const ff = spawn(dec.bin, dec.args(sampleRate))

    const out = []
    const err = []
    let settled = false

    // Chốt: 'error' và 'close' CÓ THỂ cùng phát. Chỉ giải quyết một lần.
    const done = (e, buf) =&gt; {
      if (settled) return
      settled = true
      if (e) reject(e)
      else resolve(buf ?? Buffer.alloc(0))
    }

    ff.stdout.on('data', (c) =&gt; out.push(c))
    ff.stderr.on('data', (c) =&gt; err.push(c))   // ← PHẢI hút, xem dưới

    ff.on('error', (e) =&gt; {
      const notFound = e.code === 'ENOENT'
      const wrapped = new Error(\`\${dec.bin} không chạy được: \${e.message}\`)
      // Đánh dấu để hàm gọi biết là "máy không có công cụ này" chứ
      // không phải "file MP3 hỏng" — chỉ trường hợp đầu mới đáng thử
      // công cụ tiếp theo.
      wrapped.missing = notFound
      done(wrapped)
    })

    ff.on('close', (code) =&gt; {
      if (code !== 0) {
        const msg = Buffer.concat(err).toString().slice(0, 200)
        done(new Error(\`\${dec.bin} thoát \${code}: \${msg}\`))
        return
      }
      done(null, Buffer.concat(out))
    })

    // Đừng để một câu nói treo mãi nếu bộ giải mã kẹt.
    const timer = setTimeout(() =&gt; {
      ff.kill('SIGKILL')
      done(new Error(\`\${dec.bin} quá hạn 15s\`))
    }, 15_000)
    ff.on('close', () =&gt; clearTimeout(timer))

    ff.stdin.end(mp3)
  })
}
</code></pre>

<h3>Bốn chi tiết trong hàm đó dễ làm sai</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Cái chốt <code>settled</code></span><span class="lz-d">Một lần spawn thất bại phát <code>'error'</code>, và tuỳ thời điểm cũng có thể phát <code>'close'</code>. Gọi <code>resolve</code> sau <code>reject</code> là một no-op câm trong Promise, nhưng logic xung quanh (một timer, một vòng retry) vẫn chạy hai lần được. Một biến boolean loại bỏ cả một lớp bug làm-việc-hai-lần.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Hút stderr</span><span class="lz-d">Pipe có bộ đệm cố định của hệ điều hành, thường 64 KB. Nếu bạn không bao giờ đọc stderr và tiến trình con ghi quá mức đó, tiến trình con <em>chặn ở lệnh ghi</em> và không bao giờ thoát — một deadlock trông như treo. Gắn một listener <code>'data'</code> là hút nó. Đây cũng chính là hiểm hoạ khiến <code>maxBuffer</code> 1 MB của <code>exec</code> là một giới hạn thật chứ không phải hình thức.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Phân biệt ENOENT với input hỏng</span><span class="lz-d">&quot;Binary chưa cài&quot; và &quot;MP3 này hỏng&quot; đều hiện ra thành một promise bị reject. Chỉ cái đầu mới nên khiến hàm gọi thử decoder tiếp theo trong danh sách; retry một file hỏng qua ba công cụ chỉ tốn ba lần timeout. Cờ <code>missing</code> mang sự phân biệt đó ra ngoài.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">SIGKILL, không phải SIGTERM, khi hết giờ</span><span class="lz-d">Một bộ giải mã kẹt trong một vòng lặp native có thể bỏ qua SIGTERM. SIGKILL không bắt được, nên timeout chắc chắn phát tác. Dùng SIGTERM khi bạn muốn tiến trình flush rồi thoát sạch; dùng SIGKILL khi cả vấn đề là nó đã ngừng phản hồi.</span></div>
</div>

<h3>Chuỗi dự phòng, và vì sao mpg123 đứng trước</h3>
<pre><code class="language-javascript">// src/services/makerlab/audio.ts — comment về thứ tự, nguyên văn:
//
// mpg123 đứng trước vì image production chỉ cài nó (xem Dockerfile):
// ~1,5 MB cho đúng một việc, thay vì ~80 MB của ffmpeg. ffmpeg đứng
// sau để máy lập trình — vốn gần như luôn có sẵn ffmpeg mà hiếm khi
// có mpg123 — vẫn chạy thử được ở local mà không phải cài thêm gì.
</code></pre>

<pre><code class="language-text">Đó là một quyết định kích thước container thật:

  Image nền (node:22-alpine)                     ~140 MB
  + ffmpeg (đầy đủ, mọi codec)                   ~220 MB   (+80 MB)
  + chỉ mpg123                                   ~141,5 MB (+1,5 MB)

  Tiết kiệm: 78,5 MB mỗi image, mỗi lần pull, mỗi lần deploy.

Cái giá của khoản tiết kiệm đó là production và development chạy
HAI bộ giải mã KHÁC nhau. Cả hai xuất PCM 16-bit có dấu ở đúng tần số
yêu cầu, nên output so sánh được theo byte — nhưng đó là một giả định
đáng kiểm chứng, không phải đáng giả định.
</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Kết quả dò được nhớ lại</span><span class="lz-d">File giữ một biến <code>chosen</code> ở cấp module và trả về <code>[chosen]</code> khi đã có một decoder chạy được. Không có nó, mỗi request phải trả một lần spawn ENOENT cho công cụ vắng mặt trước khi rơi xuống — một lần khởi tiến trình lãng phí mỗi lời gọi.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Một biến môi trường ép được decoder cụ thể</span><span class="lz-d"><code>MAKERLAB_MP3_DECODER</code> ghim lựa chọn, và giá trị lạ vẫn được thử trước với argv mặc định. Đó là cửa thoát cho &quot;production chọn nhầm cái&quot; mà không cần deploy code.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>FFMPEG_PATH</code> cũng được tôn trọng</span><span class="lz-d">Nếu biến đó được đặt, máy này có ffmpeg ở chỗ không chuẩn, nên nó được đẩy lên đầu với argv của ffmpeg. Một chi tiết nhỏ, nhưng nó có nghĩa là một biến môi trường cấu hình cả bộ giải mã này lẫn hai service ở Chương 3.</span></div>
</div>

<h3>Khi nào file tạm vẫn là câu trả lời đúng</h3>
<pre><code class="language-text">Pipe thua file tạm khi:

  Công cụ phải TUA trong input.
    MP4 có moov atom ở cuối (Chương 3) không đọc được từ stdin
    không-tua-được — ffmpeg báo "Invalid data found when processing
    input". MP3 và WAV thì ổn; MP4/MOV thường thì không.

  Output phải tua được.
    Ghi MP4 ra pipe:1 hỏng vì cùng lý do, trừ khi bạn thêm
    -movflags frag_keyframe+empty_moov để tạo một biến thể
    phân mảnh, chảy dòng được.

  Dữ liệu quá lớn để giữ trong RAM.
    Một podcast 2 giờ ở dạng PCM thô 16-bit 44,1 kHz stereo là ~1,2 GB.
    Đệm chừng đó mỗi request là không khả thi; hãy chảy nó xuống đĩa,
    hoặc pipe thẳng vào tiến trình kế mà không gom lại.

  Dù sao bạn cũng cần file đó sau này.
    Nếu output sẽ đi lên R2 dưới dạng file, và bạn đang chảy nó xuống
    đĩa để upload, thì file tạm không phải chi phí thừa — nó là
    chính sản phẩm.
</code></pre>

<h3>Nối hai tiến trình mà không chạm đĩa</h3>
<pre><code class="language-javascript">// Giải mã MP3 → PCM → mã hoá lại thành Opus, không có bộ đệm trung gian.
import { spawn } from 'node:child_process'

const decoder = spawn('mpg123', ['-q', '--mono', '-r', '48000', '-s', '-'])
const encoder = spawn('ffmpeg', [
  '-hide_banner', '-loglevel', 'error',
  '-f', 's16le', '-ar', '48000', '-ac', '1', '-i', 'pipe:0',
  '-c:a', 'libopus', '-b:a', '24k',
  '-f', 'ogg', 'pipe:1',
])

decoder.stdout.pipe(encoder.stdin)     // ← toàn bộ mẹo nằm ở đây
decoder.stdin.end(mp3Buffer)

const chunks = []
encoder.stdout.on('data', (c) =&gt; chunks.push(c))
// Hút CẢ HAI dòng stderr, không thì tiến trình nào cũng deadlock được.
decoder.stderr.resume()
encoder.stderr.resume()
</code></pre>

<pre><code class="language-text">Đỉnh memory, MP3 5 phút (4,8 MB) → Opus:

  Chuỗi file tạm      PCM trên đĩa 52 MB, cả hai buffer trong RAM  ~61 MB RSS
  Pipe có đệm         toàn bộ Buffer PCM trong RAM                 ~58 MB RSS
  Pipe chảy dòng      chỉ những mẩu đang bay                       ~12 MB RSS

Bản chảy dòng không bao giờ giữ PCM đã giải mã — nó đi qua
64 KB một lần.
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — không hút stderr.</strong> Bộ đệm pipe của hệ điều hành là ~64 KB. Một tiến trình con ghi quá mức đó sẽ chặn mãi mãi chờ một người đọc, handler <code>close</code> của bạn không bao giờ chạy, và request treo tới khi timeout. Nó hiện ra thành &quot;FFmpeg chậm với một số file&quot; trong khi thực ra là &quot;FFmpeg nói nhiều với một số file&quot;. Luôn gắn listener hoặc gọi <code>.resume()</code>.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — pipe một format cần tua.</strong> MP4 đọc từ <code>pipe:0</code> hỏng khi chỉ mục của nó ở cuối file, và MP4 ghi ra <code>pipe:1</code> hỏng vì bộ muxer phải quay lại điền chỉ mục. Cả hai lỗi đọc như là file hỏng. Dùng file tạm cho MP4, hoặc phân mảnh nó bằng <code>-movflags frag_keyframe+empty_moov</code>.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Pipe qua <code>pipe:0</code>/<code>pipe:1</code> loại bỏ phụ thuộc vào đĩa, vấn đề tên-duy-nhất, và nghĩa vụ dọn dẹp mà pattern ghi-chạy-đọc-unlink áp lên mọi nhánh lỗi — nhưng nó đòi bạn phải hút stderr (không thì một tiến trình con ghi quá bộ đệm ~64 KB sẽ deadlock), phải giải quyết promise đúng một lần (<code>'error'</code> và <code>'close'</code> đều có thể phát), phải SIGKILL chứ không SIGTERM khi hết giờ, và phải lùi về file tạm với những format như MP4 vốn cần input hoặc output tua được.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — child_process.spawn</span><span class="lc-sub">nodejs.org/api/child_process.html#child_processspawncommand-args-options — cấu hình stdio và cặp sự kiện error/close.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">FFmpeg — pipe protocol</span><span class="lc-sub">ffmpeg.org/ffmpeg-protocols.html#pipe — pipe:0 / pipe:1 và lưu ý về khả năng tua.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">mpg123 manual</span><span class="lc-sub">mpg123.de/mpg123.1.html — <code>-s</code> (stdout), <code>-r</code> (rate), và vì sao nó chỉ 1,5 MB.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/services/makerlab/audio.ts</span><span class="lc-sub">Chuỗi decoder, cờ <code>missing</code>, timeout SIGKILL, và lý do mpg123 đứng trước ffmpeg.</span></span></div>
</div>
`,
    },


    {
      title: '4.2 — Loudness normalization, and a bug that made it do nothing|||4.2 — Chuẩn hoá độ to, và một bug khiến nó không làm gì',
      slug: 'mp-4-2-loudnorm',
      type: 'VIDEO',
      description: 'EBU R128 two-pass loudnorm is how every streaming platform makes tracks play at the same volume. This repo implemented it — and one stray space meant every track silently took the do-nothing fallback.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Loudness normalization, and a bug that made it do nothing</h2>
<p class="lead">Upload ten songs from ten sources and they play at ten different volumes — the user reaches for the volume knob on every track change. Loudness normalization fixes that, and the standard everyone uses is EBU R128. This repo implements the correct two-pass approach in <code>src/services/ffmpeg.service.ts</code>, and until this chapter was written, a single space in the command meant it never actually applied.</p>

<h3>Why peak normalization is not enough</h3>
<pre><code class="language-text">PEAK normalization: scale the file so its loudest SAMPLE hits 0 dBFS.

  Track A: a quiet acoustic recording with one loud drum hit
           → peak already at 0 dBFS → no change → still sounds quiet
  Track B: a compressed pop master, dense and loud throughout
           → peak already at 0 dBFS → no change → still sounds loud

  Both are "normalized". They still differ by 12 dB in perceived
  loudness, because peak measures a single sample and hearing
  measures energy over time.

LOUDNESS normalization (EBU R128): measure PERCEIVED loudness in
LUFS (Loudness Units Full Scale), integrated over the whole
programme with a frequency weighting that models human hearing,
then apply the gain that lands it on the target.

  Track A: measured -22 LUFS → +8 dB gain → -14 LUFS
  Track B: measured  -9 LUFS → -5 dB gain → -14 LUFS

  Now they match.
</code></pre>

<h3>The targets everyone converged on</h3>
<pre><code class="language-text">Platform            Integrated target     Notes
─────────────────  ───────────────────   ──────────────────────────
Spotify                 -14 LUFS          Turns loud tracks down
YouTube                 -14 LUFS
Apple Music            -16 LUFS           Sound Check
Amazon Music           -14 LUFS
Broadcast (EBU R128)   -23 LUFS           Much quieter; TV standard
Podcasts (typical)     -16 LUFS mono

This repo (src/services/ffmpeg.service.ts):
  integrated:    -14 LUFS   (env LOUDNORM_I)
  truePeak:      -1.5 dBTP  (env LOUDNORM_TP)
  loudnessRange:  11 LU     (env LOUDNORM_LRA)

True peak of -1.5 rather than 0: lossy codecs reconstruct a waveform
that can overshoot the original samples ("inter-sample peaks"). Leaving
1.5 dB of headroom stops the MP3 from clipping on playback even though
the PCM never did.
</code></pre>

<h3>Why it takes two passes</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Pass 1 measures the whole programme</span><span class="lz-d">Integrated loudness is defined over the entire file, so it cannot be known until the last sample is read. FFmpeg runs the <code>loudnorm</code> filter with <code>print_format</code> and writes the measurements to stderr while discarding the audio (<code>-f null -</code>).</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Pass 2 applies a linear gain using those numbers</span><span class="lz-d">Given <code>measured_I</code>, <code>measured_TP</code>, <code>measured_LRA</code>, and <code>measured_thresh</code>, the filter computes one constant gain for the whole file. The result is transparent — the mix is untouched, just louder or quieter.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">One pass alone falls back to dynamic mode</span><span class="lz-d">Without the measured values the filter cannot know the programme loudness in advance, so it adapts gain as it goes. That is audible: it pumps, and it squashes dynamics. Single-pass loudnorm is for live streams, where you have no choice.</span></div>
</div>

<h3>The bug: one space between two array entries</h3>
<pre><code class="language-javascript">// src/services/ffmpeg.service.ts — BEFORE
const normalizeCmd = [
  \`\${FFMPEG_PATH} -y -i "\${absInput}"\`,
  \`-af loudnorm=I=\${targetI}:TP=\${targetTP}:LRA=\${targetLRA}:threshold=\${targetThresh}\`,
  // Use measured values for better accuracy
  \`:measured_I=\${measuredI}:measured_TP=\${measuredTP}:measured_LRA=\${measuredLRA}:measured_thresh=\${measuredThresh}\`,
  '-c:a libmp3lame -b:a 192k',
  '-id3v2_version 3',
  \`"\${absOutput}"\`,
].join(' ')          // ← .join(' ') puts a SPACE between entries 2 and 3
</code></pre>

<p>The filter was written across two array entries so it would read nicely in the source. But <code>.join(' ')</code> does what it says, and a space inside a command line ends an argument.</p>

<pre><code class="language-text">What the shell then handed to ffmpeg:

  argv[3] = -af
  argv[4] = loudnorm=I=-14:TP=-1.5:LRA=11:threshold=-25
  argv[5] = :measured_I=-16.80:measured_TP=-0.50:...     ← its own argument

ffmpeg reads argv[5] as a positional argument, which in ffmpeg's grammar
is an OUTPUT URL. It cannot guess a muxer from that name, so it exits
non-zero:

  Unable to find a suitable output format for ':measured_I=-16.80:...'

Pass 2 therefore ALWAYS threw. Which landed in this catch:
</code></pre>

<pre><code class="language-javascript">} catch (err) {
  // If FFmpeg fails, try a simpler approach — just re-encode without loudnorm
  logger.warn('Loudnorm normalization failed, falling back to re-encode', { ... })
  const fallbackCmd = [
    \`\${FFMPEG_PATH} -y -i "\${absInput}"\`,
    '-c:a libmp3lame -b:a 192k',
    '-id3v2_version 3',
    \`"\${absOutput}"\`,
  ].join(' ')
  await execAsync(fallbackCmd, { timeout: 300000 })
}
</code></pre>

<pre><code class="language-text">So the real behaviour of the feature was:

  1. Run a full ffmpeg pass to measure loudness      (up to 300 s)
  2. Run a second pass that always fails             (wasted)
  3. Fall back to a plain MP3 re-encode              (no normalization)
  4. Log one warn line and report success

Every track. The output was a valid 192 kbps MP3, so nothing looked
broken — the files played, they were just never levelled. The feature
had been paying for three ffmpeg invocations to accomplish a re-encode.
</code></pre>

<h3>Why nobody noticed</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The fallback succeeded</span><span class="lz-d">A failing feature that throws gets found. A failing feature with a working fallback produces a correct-looking artifact and a <code>warn</code> line in a log nobody greps. The fallback existed for a good reason — it should not turn a bad encode into a failed upload — but it also hid the bug for as long as it existed.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">The measured values were parsed correctly</span><span class="lz-d">Pass 1 worked. The regexes matched, <code>measurement.inputI</code> was populated, and the API response carried real LUFS numbers. Anyone checking &quot;is the measurement working?&quot; got a yes. The numbers were simply never used.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Loudness is hard to eyeball</span><span class="lz-d">A missing thumbnail is instantly visible. Two tracks differing by 6 LUFS just feels like &quot;that song is a bit quiet&quot; — which is exactly what listeners expect from a music library anyway.</span></div>
</div>

<h3>The fix</h3>
<pre><code class="language-javascript">// src/services/ffmpeg.service.ts — AFTER
//
// The filter string is built as ONE value. It used to be assembled by
// .join(' ')-ing two array entries, which put a SPACE between
// \`threshold=...\` and \`:measured_I=...\`. ffmpeg then saw the measured
// values as a separate positional argument (an output URL it could not
// find a muxer for), pass 2 failed, and every track silently took the
// fallback path below — a plain re-encode with no normalization at all.
const loudnormFilter =
  \`loudnorm=I=\${targetI}:TP=\${targetTP}:LRA=\${targetLRA}:threshold=\${targetThresh}\` +
  \`:measured_I=\${measuredI}:measured_TP=\${measuredTP}\` +
  \`:measured_LRA=\${measuredLRA}:measured_thresh=\${measuredThresh}\`

const normalizeArgs = [
  '-y',
  '-i', absInput,
  '-af', loudnormFilter,
  '-c:a', 'libmp3lame',
  '-b:a', '192k',
  '-id3v2_version', '3',
  absOutput,
]

await execFileAsync(FFMPEG_PATH, normalizeArgs, {
  timeout: 300000,
  maxBuffer: 10 * 1024 * 1024,
})
</code></pre>

<p>Two changes, and the second is the durable one. Concatenating with <code>+</code> instead of joining array entries fixes today's bug. Moving to <code>execFile</code> with an argv array makes the bug <em>unrepresentable</em>: each array element is exactly one argument by construction, so a stray space inside a value is just a character in that value, and a missing space between values cannot silently merge them.</p>

<h3>The general lesson: argv arrays are self-documenting</h3>
<pre><code class="language-text">In a command STRING, the boundary between arguments is invisible —
it is a space, and spaces also appear inside values, inside filter
graphs, inside filenames. You cannot see the argument structure by
reading the code.

In an argv ARRAY, the boundary is a comma. The structure is the
syntax. This bug is not expressible:

  ['-af', 'loudnorm=I=-14:...', ':measured_I=...']   ← obviously 3 args
  ['-af', 'loudnorm=I=-14:...:measured_I=...']       ← obviously 2

Reviewers catch the first shape instantly. Nobody catches a missing
space at the end of a template literal on line 2 of a 7-line array.
</code></pre>

<h3>Verifying it actually works now</h3>
<pre><code class="language-bash"># Measure a file's loudness without changing it:
ffmpeg -hide_banner -i track.mp3 \\
  -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=summary \\
  -f null - 2>&amp;1 | tail -12
</code></pre>
<div class="out">
<pre><code class="language-text">Input Integrated:    -19.4 LUFS
Input True Peak:      -0.2 dBTP
Input LRA:             8.1 LU
Input Threshold:     -29.8 LUFS

Output Integrated:   -14.0 LUFS
Output True Peak:     -1.5 dBTP
Output LRA:            7.9 LU
Output Threshold:    -24.3 LUFS

Normalization Type:   dynamic
Target Offset:         0.1 LU</code></pre>
</div>

<pre><code class="language-bash"># Then measure the OUTPUT of your pipeline. If normalization ran,
# "Input Integrated" of the normalized file should now read ≈ -14.
ffmpeg -hide_banner -i track-normalized.mp3 \\
  -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=summary \\
  -f null - 2>&amp;1 | grep 'Input Integrated'
</code></pre>
<div class="out">
<pre><code class="language-text">Before the fix:  Input Integrated:  -19.4 LUFS   ← unchanged, fallback ran
After the fix:   Input Integrated:  -14.1 LUFS   ← normalized</code></pre>
</div>

<p>That two-command check is the regression test this feature never had. It compares an <em>observable property of the output</em> rather than an exit code, which is the only kind of test that would have caught a bug whose failure path returns success.</p>

<div class="callout warn">
<p><strong>Not verified end-to-end here.</strong> FFmpeg is not installed in the sandbox this course was written in, so the argument split was confirmed by reconstructing the command and inspecting how a shell tokenizes it — not by running FFmpeg. The <code>Normalization Type</code> line in real output is also worth watching: it should read <code>linear</code> when measured values are supplied, and <code>dynamic</code> when they are not. Seeing <code>dynamic</code> on a two-pass run means the measured values are still not reaching the filter.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — a fallback that hides the thing it falls back from.</strong> The <code>catch</code> here was correct in intent: a broken loudnorm should not fail the upload. But it logged at <code>warn</code> and returned success, so the primary path could be 100% broken and every metric stayed green. If a fallback is meant to be rare, count it — a counter that fires on every request is an alert, not a log line.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — building filter graphs by joining array entries.</strong> FFmpeg filter strings are long, so the temptation to split them across lines is strong. Concatenate with <code>+</code> (no separator) or use a template literal; never <code>.join(' ')</code>. Better still, pass argv so the boundaries are explicit.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Peak normalization does not equalize perceived volume — EBU R128 loudness normalization does, by measuring LUFS over the whole programme in pass 1 and applying one linear gain in pass 2 (single-pass falls back to a dynamic mode that audibly pumps); this repo's implementation was correct except that <code>.join(' ')</code> inserted a space inside the filter string, so ffmpeg saw the measured values as a stray output URL, pass 2 always failed, and every track silently took a fallback re-encode with no normalization at all — a class of bug that argv arrays make unrepresentable, and that only an output-property check (re-measure the result, expect ≈ -14 LUFS) would ever catch.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">EBU R128 — Loudness normalisation</span><span class="lc-sub">tech.ebu.ch/docs/r/r128.pdf — the standard, LUFS/LU definitions, and gating.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">FFmpeg — loudnorm filter</span><span class="lc-sub">ffmpeg.org/ffmpeg-filters.html#loudnorm — every parameter, and the two-pass procedure.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Spotify — Loudness normalization</span><span class="lc-sub">support.spotify.com/article/loudness-normalization — where the -14 LUFS target comes from.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/services/ffmpeg.service.ts</span><span class="lc-sub">Hai lượt loudnorm, mục tiêu qua env, và comment ghi lại chính bug khoảng trắng này.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Chuẩn hoá độ to, và một bug khiến nó không làm gì</h2>
<p class="lead">Upload mười bài hát từ mười nguồn và chúng phát ở mười mức âm lượng khác nhau — người dùng phải với tay chỉnh volume mỗi lần chuyển bài. Chuẩn hoá độ to vá điều đó, và chuẩn mà ai cũng dùng là EBU R128. Kho này cài đặt đúng cách tiếp cận hai lượt trong <code>src/services/ffmpeg.service.ts</code>, và cho tới khi chương này được viết, một khoảng trắng duy nhất trong lệnh khiến nó chưa bao giờ thực sự được áp dụng.</p>

<h3>Vì sao chuẩn hoá theo đỉnh là không đủ</h3>
<pre><code class="language-text">Chuẩn hoá theo ĐỈNH: scale file để MẪU to nhất chạm 0 dBFS.

  Bài A: một bản thu mộc yên tĩnh có một tiếng trống to
         → đỉnh vốn đã ở 0 dBFS → không đổi → vẫn nghe nhỏ
  Bài B: một bản pop master nén chặt, dày và to xuyên suốt
         → đỉnh vốn đã ở 0 dBFS → không đổi → vẫn nghe to

  Cả hai đều "đã chuẩn hoá". Chúng vẫn lệch nhau 12 dB về độ to
  cảm nhận, vì đỉnh đo một mẫu duy nhất còn thính giác đo
  năng lượng theo thời gian.

Chuẩn hoá ĐỘ TO (EBU R128): đo độ to CẢM NHẬN theo LUFS
(Loudness Units Full Scale), tích hợp trên toàn bộ chương trình
với một trọng số tần số mô phỏng thính giác con người, rồi áp
đúng mức gain đưa nó về mục tiêu.

  Bài A: đo được -22 LUFS → gain +8 dB → -14 LUFS
  Bài B: đo được  -9 LUFS → gain -5 dB → -14 LUFS

  Giờ chúng khớp nhau.
</code></pre>

<h3>Các mục tiêu mà mọi người đã hội tụ về</h3>
<pre><code class="language-text">Nền tảng            Mục tiêu tích hợp     Ghi chú
─────────────────  ───────────────────   ──────────────────────────
Spotify                 -14 LUFS          Hạ những bài quá to xuống
YouTube                 -14 LUFS
Apple Music            -16 LUFS           Sound Check
Amazon Music           -14 LUFS
Phát sóng (EBU R128)   -23 LUFS           Nhỏ hơn nhiều; chuẩn TV
Podcast (điển hình)    -16 LUFS mono

Kho này (src/services/ffmpeg.service.ts):
  integrated:    -14 LUFS   (env LOUDNORM_I)
  truePeak:      -1.5 dBTP  (env LOUDNORM_TP)
  loudnessRange:  11 LU     (env LOUDNORM_LRA)

True peak -1.5 thay vì 0: codec lossy tái dựng một dạng sóng có thể
vượt quá các mẫu gốc ("đỉnh liên-mẫu"). Chừa 1,5 dB khoảng trống
ngăn MP3 bị vỡ khi phát dù PCM thì không hề.
</code></pre>

<h3>Vì sao cần hai lượt</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Lượt 1 đo toàn bộ chương trình</span><span class="lz-d">Độ to tích hợp được định nghĩa trên toàn file, nên không thể biết được cho tới khi đọc mẫu cuối cùng. FFmpeg chạy bộ lọc <code>loudnorm</code> với <code>print_format</code> và ghi các số đo ra stderr trong khi vứt bỏ âm thanh (<code>-f null -</code>).</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Lượt 2 áp một mức gain tuyến tính dùng những số đó</span><span class="lz-d">Có <code>measured_I</code>, <code>measured_TP</code>, <code>measured_LRA</code>, và <code>measured_thresh</code>, bộ lọc tính đúng một mức gain hằng số cho cả file. Kết quả trong suốt — bản phối không bị đụng, chỉ to hơn hoặc nhỏ hơn.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Một lượt đơn độc sẽ rơi về chế độ động</span><span class="lz-d">Không có các giá trị đo được, bộ lọc không biết trước độ to của chương trình, nên nó điều chỉnh gain khi đi. Điều đó nghe thấy được: nó bơm lên bơm xuống, và nó bóp dải động. Loudnorm một lượt là dành cho live stream, nơi bạn không có lựa chọn.</span></div>
</div>

<h3>Cái bug: một khoảng trắng giữa hai phần tử mảng</h3>
<pre><code class="language-javascript">// src/services/ffmpeg.service.ts — TRƯỚC
const normalizeCmd = [
  \`\${FFMPEG_PATH} -y -i "\${absInput}"\`,
  \`-af loudnorm=I=\${targetI}:TP=\${targetTP}:LRA=\${targetLRA}:threshold=\${targetThresh}\`,
  // Dùng giá trị đo được cho chính xác hơn
  \`:measured_I=\${measuredI}:measured_TP=\${measuredTP}:measured_LRA=\${measuredLRA}:measured_thresh=\${measuredThresh}\`,
  '-c:a libmp3lame -b:a 192k',
  '-id3v2_version 3',
  \`"\${absOutput}"\`,
].join(' ')          // ← .join(' ') đặt một KHOẢNG TRẮNG giữa phần tử 2 và 3
</code></pre>

<p>Bộ lọc được viết thành hai phần tử mảng để đọc trong mã nguồn cho dễ. Nhưng <code>.join(' ')</code> làm đúng điều nó nói, và một khoảng trắng bên trong dòng lệnh là dấu kết thúc một tham số.</p>

<pre><code class="language-text">Cái mà shell sau đó đưa cho ffmpeg:

  argv[3] = -af
  argv[4] = loudnorm=I=-14:TP=-1.5:LRA=11:threshold=-25
  argv[5] = :measured_I=-16.80:measured_TP=-0.50:...     ← một tham số riêng

ffmpeg đọc argv[5] như một tham số vị trí, mà trong ngữ pháp của ffmpeg
là một URL OUTPUT. Nó không đoán được muxer từ cái tên đó, nên thoát
với mã khác 0:

  Unable to find a suitable output format for ':measured_I=-16.80:...'

Vì thế lượt 2 LUÔN LUÔN ném lỗi. Và rơi vào khối catch này:
</code></pre>

<pre><code class="language-javascript">} catch (err) {
  // Nếu FFmpeg hỏng, thử cách đơn giản hơn — chỉ re-encode không loudnorm
  logger.warn('Loudnorm normalization failed, falling back to re-encode', { ... })
  const fallbackCmd = [
    \`\${FFMPEG_PATH} -y -i "\${absInput}"\`,
    '-c:a libmp3lame -b:a 192k',
    '-id3v2_version 3',
    \`"\${absOutput}"\`,
  ].join(' ')
  await execAsync(fallbackCmd, { timeout: 300000 })
}
</code></pre>

<pre><code class="language-text">Nên hành vi thật của tính năng là:

  1. Chạy một lượt ffmpeg đầy đủ để đo độ to        (tới 300 s)
  2. Chạy lượt hai vốn luôn thất bại                (lãng phí)
  3. Rơi về một lần re-encode MP3 thuần             (không chuẩn hoá)
  4. Ghi một dòng warn và báo thành công

Mọi bài hát. Output là một MP3 192 kbps hợp lệ, nên không có gì trông
như hỏng — file phát được, chúng chỉ chưa bao giờ được cân mức. Tính năng
đã trả tiền cho ba lần gọi ffmpeg để hoàn thành một lần re-encode.
</code></pre>

<h3>Vì sao không ai nhận ra</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đường dự phòng đã thành công</span><span class="lz-d">Một tính năng hỏng mà ném lỗi thì sẽ bị phát hiện. Một tính năng hỏng có đường dự phòng chạy được thì tạo ra một sản phẩm trông đúng và một dòng <code>warn</code> trong log không ai grep. Đường dự phòng tồn tại vì một lý do chính đáng — nó không nên biến một lần encode tệ thành một lần upload thất bại — nhưng nó cũng che giấu cái bug suốt thời gian nó tồn tại.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Các giá trị đo được phân tích đúng</span><span class="lz-d">Lượt 1 chạy tốt. Các regex khớp, <code>measurement.inputI</code> được điền, và response API mang những con số LUFS thật. Ai kiểm tra &quot;phép đo có chạy không?&quot; đều nhận được câu trả lời có. Chỉ là những con số đó chưa bao giờ được dùng.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Độ to khó nhận ra bằng mắt</span><span class="lz-d">Một thumbnail thiếu thì thấy ngay lập tức. Hai bài lệch nhau 6 LUFS chỉ cho cảm giác &quot;bài đó hơi nhỏ&quot; — mà đó đúng là điều người nghe vốn đã trông đợi ở một thư viện nhạc.</span></div>
</div>

<h3>Cách vá</h3>
<pre><code class="language-javascript">// src/services/ffmpeg.service.ts — SAU
//
// Chuỗi bộ lọc được dựng thành MỘT giá trị. Trước đây nó được ghép bằng
// .join(' ') hai phần tử mảng, khiến một KHOẢNG TRẮNG lọt vào giữa
// \`threshold=...\` và \`:measured_I=...\`. ffmpeg khi đó thấy các giá trị
// đo được như một tham số vị trí riêng (một output URL mà nó không tìm
// được muxer), lượt 2 thất bại, và mọi bài hát âm thầm đi theo đường
// dự phòng bên dưới — một lần re-encode thuần không hề chuẩn hoá.
const loudnormFilter =
  \`loudnorm=I=\${targetI}:TP=\${targetTP}:LRA=\${targetLRA}:threshold=\${targetThresh}\` +
  \`:measured_I=\${measuredI}:measured_TP=\${measuredTP}\` +
  \`:measured_LRA=\${measuredLRA}:measured_thresh=\${measuredThresh}\`

const normalizeArgs = [
  '-y',
  '-i', absInput,
  '-af', loudnormFilter,
  '-c:a', 'libmp3lame',
  '-b:a', '192k',
  '-id3v2_version', '3',
  absOutput,
]

await execFileAsync(FFMPEG_PATH, normalizeArgs, {
  timeout: 300000,
  maxBuffer: 10 * 1024 * 1024,
})
</code></pre>

<p>Hai thay đổi, và cái thứ hai mới là cái bền vững. Nối bằng <code>+</code> thay vì ghép các phần tử mảng vá được bug hôm nay. Chuyển sang <code>execFile</code> với một mảng argv khiến bug đó <em>không biểu diễn được</em>: mỗi phần tử mảng là đúng một tham số theo cấu trúc, nên một khoảng trắng lạc bên trong một giá trị chỉ là một ký tự trong giá trị đó, và một khoảng trắng thiếu giữa hai giá trị không thể âm thầm gộp chúng lại.</p>

<h3>Bài học tổng quát: mảng argv tự mô tả chính nó</h3>
<pre><code class="language-text">Trong một CHUỖI lệnh, ranh giới giữa các tham số là vô hình —
nó là một khoảng trắng, mà khoảng trắng cũng xuất hiện bên trong
giá trị, bên trong đồ thị bộ lọc, bên trong tên file. Bạn không thấy
được cấu trúc tham số bằng cách đọc mã.

Trong một MẢNG argv, ranh giới là một dấu phẩy. Cấu trúc chính là
cú pháp. Cái bug này không diễn đạt được:

  ['-af', 'loudnorm=I=-14:...', ':measured_I=...']   ← rõ ràng 3 tham số
  ['-af', 'loudnorm=I=-14:...:measured_I=...']       ← rõ ràng 2

Người review bắt được hình dạng đầu ngay lập tức. Không ai bắt được
một khoảng trắng thiếu ở cuối một template literal trên dòng 2 của
một mảng 7 dòng.
</code></pre>

<h3>Xác minh rằng giờ nó thật sự chạy</h3>
<pre><code class="language-bash"># Đo độ to của một file mà không thay đổi nó:
ffmpeg -hide_banner -i track.mp3 \\
  -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=summary \\
  -f null - 2>&amp;1 | tail -12
</code></pre>
<div class="out">
<pre><code class="language-text">Input Integrated:    -19.4 LUFS
Input True Peak:      -0.2 dBTP
Input LRA:             8.1 LU
Input Threshold:     -29.8 LUFS

Output Integrated:   -14.0 LUFS
Output True Peak:     -1.5 dBTP
Output LRA:            7.9 LU
Output Threshold:    -24.3 LUFS

Normalization Type:   dynamic
Target Offset:         0.1 LU</code></pre>
</div>

<pre><code class="language-bash"># Rồi đo OUTPUT của pipeline của bạn. Nếu việc chuẩn hoá đã chạy,
# "Input Integrated" của file đã chuẩn hoá giờ phải đọc ra ≈ -14.
ffmpeg -hide_banner -i track-normalized.mp3 \\
  -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=summary \\
  -f null - 2>&amp;1 | grep 'Input Integrated'
</code></pre>
<div class="out">
<pre><code class="language-text">Trước khi vá:  Input Integrated:  -19.4 LUFS   ← không đổi, dự phòng đã chạy
Sau khi vá:    Input Integrated:  -14.1 LUFS   ← đã chuẩn hoá</code></pre>
</div>

<p>Phép kiểm hai lệnh đó chính là bài test hồi quy mà tính năng này chưa bao giờ có. Nó so sánh một <em>thuộc tính quan sát được của output</em> thay vì một mã thoát, và đó là loại test duy nhất có thể bắt được một bug mà nhánh thất bại của nó trả về thành công.</p>

<div class="callout warn">
<p><strong>Chưa xác minh đầu-cuối ở đây.</strong> FFmpeg không được cài trong sandbox nơi khoá học này được viết, nên việc tách tham số được xác nhận bằng cách dựng lại lệnh và xem shell tách token thế nào — không phải bằng cách chạy FFmpeg. Dòng <code>Normalization Type</code> trong output thật cũng đáng theo dõi: nó phải đọc ra <code>linear</code> khi có giá trị đo được, và <code>dynamic</code> khi không. Thấy <code>dynamic</code> trên một lần chạy hai lượt nghĩa là các giá trị đo được vẫn chưa tới được bộ lọc.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — một đường dự phòng che giấu chính thứ mà nó dự phòng cho.</strong> Khối <code>catch</code> ở đây đúng về mặt ý định: một loudnorm hỏng không nên làm hỏng lần upload. Nhưng nó ghi ở mức <code>warn</code> và trả về thành công, nên đường chính có thể hỏng 100% mà mọi chỉ số vẫn xanh. Nếu một đường dự phòng được kỳ vọng là hiếm, hãy đếm nó — một counter phát tác trên mọi request là một cảnh báo, không phải một dòng log.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — dựng đồ thị bộ lọc bằng cách ghép các phần tử mảng.</strong> Chuỗi bộ lọc của FFmpeg thì dài, nên cám dỗ cắt chúng qua nhiều dòng là rất mạnh. Hãy nối bằng <code>+</code> (không có dấu phân cách) hoặc dùng một template literal; đừng bao giờ <code>.join(' ')</code>. Tốt hơn nữa, truyền argv để ranh giới là tường minh.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Chuẩn hoá theo đỉnh không cân bằng được âm lượng cảm nhận — chuẩn hoá độ to EBU R128 thì có, bằng cách đo LUFS trên toàn chương trình ở lượt 1 và áp một mức gain tuyến tính ở lượt 2 (một lượt sẽ rơi về chế độ động vốn bơm lên bơm xuống nghe thấy được); cài đặt của kho này vốn đúng, ngoại trừ việc <code>.join(' ')</code> chèn một khoảng trắng vào giữa chuỗi bộ lọc, khiến ffmpeg thấy các giá trị đo được như một output URL lạc lõng, lượt 2 luôn thất bại, và mọi bài hát âm thầm đi theo một lần re-encode dự phòng không hề chuẩn hoá — một lớp bug mà mảng argv làm cho không biểu diễn được, và chỉ một phép kiểm thuộc tính output (đo lại kết quả, kỳ vọng ≈ -14 LUFS) mới có thể bắt được.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">EBU R128 — Loudness normalisation</span><span class="lc-sub">tech.ebu.ch/docs/r/r128.pdf — chuẩn, định nghĩa LUFS/LU, và cơ chế gating.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">FFmpeg — loudnorm filter</span><span class="lc-sub">ffmpeg.org/ffmpeg-filters.html#loudnorm — mọi tham số, và quy trình hai lượt.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Spotify — Loudness normalization</span><span class="lc-sub">support.spotify.com/article/loudness-normalization — mục tiêu -14 LUFS đến từ đâu.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/services/ffmpeg.service.ts</span><span class="lc-sub">Hai lượt loudnorm, mục tiêu qua env, và comment ghi lại chính bug khoảng trắng này.</span></span></div>
</div>
`,
    },


    {
      title: '4.3 — Choosing a format: bitrate, channels, and sample rate|||4.3 — Chọn format: bitrate, số kênh, và tần số lấy mẫu',
      slug: 'mp-4-3-formats',
      type: 'VIDEO',
      description: 'Three knobs multiply into your file size. Speech needs a tenth of what music needs, mono halves it again, and 16 kHz is enough for a voice — this repo picks all three deliberately.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Choosing a format: bitrate, channels, and sample rate</h2>
<p class="lead">Audio file size is almost entirely determined by three numbers multiplied together, and the right values differ by an order of magnitude between speech and music. Getting them wrong is how a voice note becomes 2 MB when it could have been 60 KB — or how a music track sounds like a phone call.</p>

<h3>The size formula</h3>
<pre><code class="language-text">UNCOMPRESSED (PCM/WAV):

  bytes = sampleRate × bitDepth/8 × channels × seconds

  16 kHz, 16-bit, mono,   5 s  =  16000 × 2 × 1 × 5  =    160 KB
  44.1 kHz, 16-bit, stereo, 5 s = 44100 × 2 × 2 × 5  =    882 KB
  48 kHz, 24-bit, stereo, 5 s   = 48000 × 3 × 2 × 5  =  1,440 KB

COMPRESSED (MP3/AAC/Opus):

  bytes ≈ bitrate/8 × seconds        (channels are already inside bitrate)

  24 kbps,  5 s  =   15 KB
  64 kbps,  5 s  =   40 KB
  128 kbps, 5 s  =   80 KB
  192 kbps, 5 s  =  120 KB
  320 kbps, 5 s  =  200 KB
</code></pre>

<p>The jump between the two tables is the whole reason compression exists: five seconds of CD-quality PCM is 882 KB, and the same five seconds as a 64 kbps Opus file that most listeners cannot distinguish is 40 KB — a 22× reduction.</p>

<h3>Bitrate: what is actually enough</h3>
<pre><code class="language-text">Content            Codec    Transparent at    Acceptable at
────────────────  ───────  ────────────────  ───────────────
Speech (mono)      Opus       24-32 kbps        16 kbps
Speech (mono)      AAC        48-64 kbps        32 kbps
Speech (mono)      MP3        64-96 kbps        48 kbps
Music (stereo)     Opus       96-128 kbps       64 kbps
Music (stereo)     AAC       128-192 kbps       96 kbps
Music (stereo)     MP3       192-256 kbps      128 kbps

"Transparent" = most listeners cannot pick it from the original in a
blind ABX test. "Acceptable" = clearly compressed but perfectly usable.

Note how much better Opus is on speech: it was designed for it, and it
switches between a speech-optimized and a music-optimized mode internally.
At 24 kbps Opus beats MP3 at 64 kbps on voice.
</code></pre>

<h3>Sample rate: the ceiling on what you can represent</h3>
<pre><code class="language-text">Nyquist: a sample rate of N can represent frequencies up to N/2.

  8 kHz   → up to 4 kHz    telephone. Intelligible, obviously "phone".
  16 kHz  → up to 8 kHz    "wideband" speech. Covers almost all of the
                           voice; sounds natural. What ASR models want.
  24 kHz  → up to 12 kHz   speech with some air. Common for TTS output.
  44.1 kHz → up to 22 kHz  CD. Above human hearing (~20 kHz).
  48 kHz  → up to 24 kHz   video/professional standard.

For a VOICE, 16 kHz is not a compromise — human speech has almost no
energy above 8 kHz. Going to 44.1 kHz nearly triples the data to
represent frequencies that are not in the signal.
</code></pre>

<p>This is exactly why the repo pins 16 kHz for its robot voice path:</p>

<pre><code class="language-javascript">// src/services/makerlab/audio.ts
/** Whisper muốn 16 kHz; loa robot cũng phát ở đó luôn cho khỏi đổi. */
export const PCM_SAMPLE_RATE = 16_000
</code></pre>

<p>Translated: <em>Whisper wants 16 kHz; the robot speaker plays at that rate too, so nothing needs converting.</em> One number chosen once, satisfying both the speech-recognition model on the way in and the hardware on the way out. Every resample avoided is CPU saved and a small quality loss avoided.</p>

<h3>Channels: mono is not a downgrade for speech</h3>
<pre><code class="language-text">Stereo doubles the data. It buys you nothing when:

  - The source is one person talking into one microphone
  - The output is a single speaker (a phone earpiece, a robot,
    a smart speaker in mono mode)
  - The content is a voice note, a podcast interview, an audio message

It matters when:

  - Music (obviously)
  - Anything with intentional spatial mixing
  - Binaural/ambisonic content

The repo's decoder forces mono explicitly:

  mpg123: ['-q', '--mono', '-r', String(r), '-s', '-']
  ffmpeg: ['-ac', '1', ...]

Both because the ESP32 speaker is mono — sending it two channels
would mean the firmware has to downmix, which is work the server
can do once instead of the device doing it on every playback.
</code></pre>

<h3>Putting the three together — real targets</h3>
<pre><code class="language-text">Use case                    Format  Rate     Ch  Bitrate   5s size
─────────────────────────  ──────  ───────  ──  ───────  ────────
Voice note in a chat app    Opus    16 kHz   1   24 kbps    15 KB
Podcast episode             AAC     44.1kHz  1   64 kbps    40 KB
Music library track         MP3     44.1kHz  2   192 kbps  120 KB
Music, modern clients       Opus    48 kHz   2   128 kbps   80 KB
TTS to an embedded device   PCM     16 kHz   1   (raw)     160 KB
Archive master              FLAC    48 kHz   2   (lossless) ~600 KB

The repo's two paths:
  Music upload  → MP3 192 kbps stereo  (ffmpeg.service.ts, libmp3lame)
  Robot voice   → PCM 16 kHz mono      (makerlab/audio.ts)

Two completely different answers because they are two completely
different problems: one is a music library that people listen to
closely, the other is a sentence a device speaks once.
</code></pre>

<h3>Why the robot path chose raw PCM over MP3</h3>
<pre><code class="language-javascript">// src/services/makerlab/audio.ts — the header comment, verbatim:
//
// TTS trả về MP3. Vi điều khiển thì thích PCM thô hơn nhiều:
//
//   MP3  — 6 KB một câu, nhưng ESP32 phải giải mã. Thêm một thư viện,
//          thêm một bộ đệm vòng trong PSRAM, thêm một chỗ để sai.
//   PCM  — 120 KB một câu, nhưng firmware chỉ việc đẩy thẳng byte vào
//          I2S. Không giải mã, không thư viện, không có gì để hỏng.
//
// Bản đầu tiên chọn PCM: 120 KB qua WiFi mất khoảng 0,1 giây, trong
// khi một lỗi giải mã MP3 có thể mất cả buổi tối.
</code></pre>

<pre><code class="language-text">The trade, stated as numbers:

              Bytes/sentence   Device work        Failure modes
  MP3              6 KB        decode + ring      library bugs, PSRAM
                               buffer in PSRAM    exhaustion, timing
  PCM            120 KB        write to I2S       none
                               
  20× more bytes. Over WiFi that is ~0.1 s.
  Zero decoder on the device.

The comment closes by noting that switching to MP3 later is just
adding a layer — both sides already support it via the &#96;audio&#96; field
in the &#96;hello&#96; packet. The cheap choice was made first, deliberately,
with the upgrade path left open.
</code></pre>

<p>This is a good example of a decision that looks wrong by one metric (20× the bandwidth) and is clearly right by the metric that mattered (engineering time on a microcontroller). Format choice is not only about bytes.</p>

<h3>Measuring what you actually have</h3>
<pre><code class="language-bash">ffprobe -v error -show_entries \\
  stream=codec_name,sample_rate,channels,bit_rate:format=duration,size \\
  -of json input.mp3
</code></pre>
<div class="out">
<pre><code class="language-text">{
  "streams": [{
    "codec_name": "mp3",
    "sample_rate": "44100",
    "channels": 2,
    "bit_rate": "320000"
  }],
  "format": { "duration": "213.446531", "size": "8548672" }
}</code></pre>
</div>

<p>That is 8.5 MB for a 3.5-minute track at 320 kbps stereo. Re-encoding it to 192 kbps — the repo's target — gives 5.1 MB for a difference almost nobody can hear on the devices this gets played on. The repo's <code>getAudioMetadata()</code> wraps exactly this <code>ffprobe</code> call and returns duration, bitrate, sample rate, channels, and codec.</p>

<div class="pitfall">
<p><strong>Bẫy — re-encoding at a HIGHER bitrate than the source.</strong> A 128 kbps MP3 re-encoded to 320 kbps is 2.5× the size and <em>worse</em> quality than the original, because generational loss compounds — the second encoder faithfully reproduces the first encoder's artifacts and adds its own. Probe first; if the source bitrate is already at or below your target, either copy the stream or leave it alone.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — resampling speech up to 44.1 kHz &quot;for quality&quot;.</strong> Upsampling invents nothing, exactly like image upscaling in Lesson 1.3. A 16 kHz voice recording resampled to 44.1 kHz is 2.75× the data describing the same 8 kHz of actual content. Keep the rate the source has, or the rate the consumer needs — whichever is lower.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> File size is <code>sampleRate × bitDepth × channels × duration</code> for PCM and roughly <code>bitrate × duration</code> once compressed, and the right values differ by an order of magnitude between speech and music — 16 kHz mono at 24 kbps Opus is transparent for a voice (and 16 kHz is what ASR models and small speakers want anyway), while music needs 44.1/48 kHz stereo at 128-192 kbps; never resample or re-encode upward, because both invent data that was never captured while multiplying the bytes you store.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Opus — codec comparison</span><span class="lc-sub">opus-codec.org/comparison — bitrate vs quality against MP3/AAC/Vorbis.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Xiph — 24/192 Music Downloads are Silly</span><span class="lc-sub">people.xiph.org/~xiphmont/demo/neil-young.html — why higher sample rates buy nothing audible.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">OpenAI Whisper — audio requirements</span><span class="lc-sub">github.com/openai/whisper — the 16 kHz mono expectation.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/services/makerlab/audio.ts</span><span class="lc-sub"><code>PCM_SAMPLE_RATE = 16_000</code> và lập luận MP3-vs-PCM cho ESP32.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Chọn format: bitrate, số kênh, và tần số lấy mẫu</h2>
<p class="lead">Kích thước file âm thanh gần như hoàn toàn được quyết bởi ba con số nhân với nhau, và giá trị đúng khác nhau cả một bậc độ lớn giữa tiếng nói và âm nhạc. Chọn sai là cách một tin nhắn thoại thành 2 MB trong khi lẽ ra nó có thể là 60 KB — hoặc một bản nhạc nghe như một cuộc gọi điện thoại.</p>

<h3>Công thức kích thước</h3>
<pre><code class="language-text">KHÔNG NÉN (PCM/WAV):

  byte = sampleRate × bitDepth/8 × channels × giây

  16 kHz, 16-bit, mono,   5 s  =  16000 × 2 × 1 × 5  =    160 KB
  44,1 kHz, 16-bit, stereo, 5 s = 44100 × 2 × 2 × 5  =    882 KB
  48 kHz, 24-bit, stereo, 5 s   = 48000 × 3 × 2 × 5  =  1.440 KB

ĐÃ NÉN (MP3/AAC/Opus):

  byte ≈ bitrate/8 × giây        (số kênh đã nằm trong bitrate)

  24 kbps,  5 s  =   15 KB
  64 kbps,  5 s  =   40 KB
  128 kbps, 5 s  =   80 KB
  192 kbps, 5 s  =  120 KB
  320 kbps, 5 s  =  200 KB
</code></pre>

<p>Cú nhảy giữa hai bảng chính là toàn bộ lý do nén tồn tại: năm giây PCM chất lượng CD là 882 KB, và cùng năm giây đó dưới dạng một file Opus 64 kbps mà hầu hết người nghe không phân biệt được là 40 KB — giảm 22×.</p>

<h3>Bitrate: bao nhiêu thì thực sự đủ</h3>
<pre><code class="language-text">Nội dung           Codec    Trong suốt ở     Chấp nhận được ở
────────────────  ───────  ────────────────  ───────────────
Tiếng nói (mono)   Opus       24-32 kbps        16 kbps
Tiếng nói (mono)   AAC        48-64 kbps        32 kbps
Tiếng nói (mono)   MP3        64-96 kbps        48 kbps
Nhạc (stereo)      Opus       96-128 kbps       64 kbps
Nhạc (stereo)      AAC       128-192 kbps       96 kbps
Nhạc (stereo)      MP3       192-256 kbps      128 kbps

"Trong suốt" = hầu hết người nghe không chọn ra được nó khỏi bản gốc
trong một bài test ABX mù. "Chấp nhận được" = thấy rõ là đã nén nhưng
hoàn toàn dùng được.

Chú ý Opus tốt hơn hẳn với tiếng nói: nó được thiết kế cho việc đó, và
nó tự chuyển giữa một chế độ tối ưu cho giọng nói và một chế độ tối ưu
cho nhạc. Ở 24 kbps Opus thắng MP3 ở 64 kbps trên giọng nói.
</code></pre>

<h3>Tần số lấy mẫu: trần của những gì bạn biểu diễn được</h3>
<pre><code class="language-text">Nyquist: một tần số lấy mẫu N biểu diễn được tần số tới N/2.

  8 kHz   → tới 4 kHz     điện thoại. Nghe hiểu được, rõ ràng là "phone".
  16 kHz  → tới 8 kHz     tiếng nói "băng rộng". Bao gần hết giọng người;
                          nghe tự nhiên. Đây là cái mô hình ASR muốn.
  24 kHz  → tới 12 kHz    tiếng nói có chút không khí. Phổ biến cho TTS.
  44,1 kHz → tới 22 kHz   CD. Trên ngưỡng nghe của người (~20 kHz).
  48 kHz  → tới 24 kHz    chuẩn video/chuyên nghiệp.

Với GIỌNG NÓI, 16 kHz không phải một sự thoả hiệp — tiếng nói con người
gần như không có năng lượng trên 8 kHz. Lên 44,1 kHz gần như nhân ba
lượng dữ liệu để biểu diễn những tần số không có trong tín hiệu.
</code></pre>

<p>Đây chính xác là lý do kho ghim 16 kHz cho đường giọng nói robot:</p>

<pre><code class="language-javascript">// src/services/makerlab/audio.ts
/** Whisper muốn 16 kHz; loa robot cũng phát ở đó luôn cho khỏi đổi. */
export const PCM_SAMPLE_RATE = 16_000
</code></pre>

<p>Một con số chọn một lần, thoả mãn cả mô hình nhận dạng tiếng nói ở đầu vào lẫn phần cứng ở đầu ra. Mỗi lần resample tránh được là CPU tiết kiệm được và một chút mất mát chất lượng tránh được.</p>

<h3>Số kênh: mono không phải là hạ cấp với tiếng nói</h3>
<pre><code class="language-text">Stereo nhân đôi dữ liệu. Nó không mua cho bạn gì khi:

  - Nguồn là một người nói vào một micro
  - Output là một loa đơn (tai nghe điện thoại, một con robot,
    một loa thông minh ở chế độ mono)
  - Nội dung là tin nhắn thoại, phỏng vấn podcast, tin nhắn âm thanh

Nó quan trọng khi:

  - Âm nhạc (hiển nhiên)
  - Bất cứ thứ gì có phối không gian có chủ đích
  - Nội dung binaural/ambisonic

Bộ giải mã của kho ép mono một cách tường minh:

  mpg123: ['-q', '--mono', '-r', String(r), '-s', '-']
  ffmpeg: ['-ac', '1', ...]

Cả hai vì loa ESP32 là mono — gửi cho nó hai kênh nghĩa là firmware
phải trộn xuống, một việc mà server làm được một lần thay vì thiết bị
phải làm mỗi lần phát.
</code></pre>

<h3>Ghép cả ba lại — mục tiêu thật</h3>
<pre><code class="language-text">Trường hợp dùng            Format  Rate     Kênh Bitrate   Size 5s
─────────────────────────  ──────  ───────  ──  ───────  ────────
Tin nhắn thoại trong chat   Opus    16 kHz   1   24 kbps    15 KB
Tập podcast                 AAC     44,1kHz  1   64 kbps    40 KB
Bài trong thư viện nhạc     MP3     44,1kHz  2   192 kbps  120 KB
Nhạc, client hiện đại       Opus    48 kHz   2   128 kbps   80 KB
TTS tới thiết bị nhúng      PCM     16 kHz   1   (thô)     160 KB
Bản master lưu trữ          FLAC    48 kHz   2   (lossless) ~600 KB

Hai đường của kho:
  Upload nhạc    → MP3 192 kbps stereo  (ffmpeg.service.ts, libmp3lame)
  Giọng robot    → PCM 16 kHz mono      (makerlab/audio.ts)

Hai câu trả lời hoàn toàn khác nhau vì đó là hai vấn đề hoàn toàn
khác nhau: một là thư viện nhạc mà người ta nghe kỹ, cái kia là một
câu mà một thiết bị nói ra một lần.
</code></pre>

<h3>Vì sao đường robot chọn PCM thô thay vì MP3</h3>
<pre><code class="language-javascript">// src/services/makerlab/audio.ts — comment đầu file, nguyên văn:
//
// TTS trả về MP3. Vi điều khiển thì thích PCM thô hơn nhiều:
//
//   MP3  — 6 KB một câu, nhưng ESP32 phải giải mã. Thêm một thư viện,
//          thêm một bộ đệm vòng trong PSRAM, thêm một chỗ để sai.
//   PCM  — 120 KB một câu, nhưng firmware chỉ việc đẩy thẳng byte vào
//          I2S. Không giải mã, không thư viện, không có gì để hỏng.
//
// Bản đầu tiên chọn PCM: 120 KB qua WiFi mất khoảng 0,1 giây, trong
// khi một lỗi giải mã MP3 có thể mất cả buổi tối.
</code></pre>

<pre><code class="language-text">Sự đánh đổi, viết ra thành con số:

              Byte/câu       Việc thiết bị làm   Cách hỏng
  MP3            6 KB        giải mã + bộ đệm    bug thư viện, cạn
                             vòng trong PSRAM    PSRAM, lỗi nhịp
  PCM          120 KB        ghi vào I2S         không có
                               
  Nhiều byte gấp 20×. Qua WiFi đó là ~0,1 s.
  Không có bộ giải mã nào trên thiết bị.

Comment kết lại bằng ghi chú rằng chuyển sang MP3 sau này chỉ là thêm
một lớp — cả hai phía đều đã hỗ trợ sẵn qua trường &#96;audio&#96; trong gói
&#96;hello&#96;. Lựa chọn rẻ được làm trước, có chủ đích, với đường nâng cấp
để ngỏ.
</code></pre>

<p>Đây là một ví dụ hay về một quyết định trông có vẻ sai theo một thước đo (băng thông gấp 20×) và rõ ràng đúng theo thước đo thực sự quan trọng (thời gian kỹ thuật trên một vi điều khiển). Chọn format không chỉ là chuyện byte.</p>

<h3>Đo cái bạn thực sự đang có</h3>
<pre><code class="language-bash">ffprobe -v error -show_entries \\
  stream=codec_name,sample_rate,channels,bit_rate:format=duration,size \\
  -of json input.mp3
</code></pre>
<div class="out">
<pre><code class="language-text">{
  "streams": [{
    "codec_name": "mp3",
    "sample_rate": "44100",
    "channels": 2,
    "bit_rate": "320000"
  }],
  "format": { "duration": "213.446531", "size": "8548672" }
}</code></pre>
</div>

<p>Đó là 8,5 MB cho một bài dài 3,5 phút ở 320 kbps stereo. Encode lại thành 192 kbps — mục tiêu của kho — cho 5,1 MB với một khác biệt gần như không ai nghe ra trên những thiết bị mà nó được phát. Hàm <code>getAudioMetadata()</code> của kho bọc đúng lời gọi <code>ffprobe</code> này và trả về thời lượng, bitrate, tần số lấy mẫu, số kênh, và codec.</p>

<div class="pitfall">
<p><strong>Bẫy — encode lại ở bitrate CAO HƠN nguồn.</strong> Một MP3 128 kbps encode lại thành 320 kbps thì to gấp 2,5× và chất lượng <em>tệ hơn</em> bản gốc, vì mất mát qua các thế hệ dồn lại — bộ encode thứ hai tái tạo trung thực các artifact của bộ encode thứ nhất rồi thêm artifact của chính nó. Hãy dò trước; nếu bitrate nguồn đã bằng hoặc thấp hơn mục tiêu, hoặc copy stream hoặc để yên nó.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — resample tiếng nói lên 44,1 kHz &quot;cho chất lượng&quot;.</strong> Upsample không bịa ra được gì, y hệt phóng to ảnh ở Bài 1.3. Một bản thu giọng 16 kHz resample lên 44,1 kHz là dữ liệu gấp 2,75× mô tả cùng 8 kHz nội dung thật. Giữ tần số mà nguồn có, hoặc tần số mà bên tiêu thụ cần — cái nào thấp hơn.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Kích thước file là <code>sampleRate × bitDepth × channels × thời lượng</code> với PCM và xấp xỉ <code>bitrate × thời lượng</code> khi đã nén, và giá trị đúng khác nhau một bậc độ lớn giữa tiếng nói và âm nhạc — 16 kHz mono ở 24 kbps Opus là trong suốt với một giọng nói (và 16 kHz cũng chính là cái mà mô hình ASR và loa nhỏ muốn), trong khi nhạc cần 44,1/48 kHz stereo ở 128-192 kbps; đừng bao giờ resample hay encode lại lên cao hơn, vì cả hai đều bịa ra dữ liệu chưa từng được ghi trong khi nhân lên số byte bạn phải lưu.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Opus — codec comparison</span><span class="lc-sub">opus-codec.org/comparison — bitrate so với chất lượng, đối chiếu MP3/AAC/Vorbis.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Xiph — 24/192 Music Downloads are Silly</span><span class="lc-sub">people.xiph.org/~xiphmont/demo/neil-young.html — vì sao tần số lấy mẫu cao hơn không mua được gì nghe thấy.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">OpenAI Whisper — audio requirements</span><span class="lc-sub">github.com/openai/whisper — kỳ vọng 16 kHz mono.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/services/makerlab/audio.ts</span><span class="lc-sub"><code>PCM_SAMPLE_RATE = 16_000</code> và lập luận MP3-vs-PCM cho ESP32.</span></span></div>
</div>
`,
    },

    {
      title: '4.4 — Chapter 4 quiz|||4.4 — Kiểm tra Chương 4',
      slug: 'mp-4-4-quiz',
      type: 'QUIZ',
      description: 'Bốn câu về pipe, loudnorm, và chọn format.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 4 · Quiz</span><h2>What Chapter 4 established</h2></div><div class="ml-vi"><span class="eyebrow">Chương 4 · Kiểm tra</span><h2>Chương 4 đã dựng được gì</h2></div>`,
      quiz: {
        timeLimitSeconds: 400,
        questions: [
          {
            question: 'An FFmpeg child process sometimes hangs until your timeout on certain input files. You collect stdout but ignore stderr. Cause?|||Một tiến trình con FFmpeg đôi khi treo tới timeout với một số file input. Bạn gom stdout nhưng bỏ qua stderr. Nguyên nhân?',
            options: [
              'The OS pipe buffer is ~64 KB. A child that writes more stderr than that blocks on the write waiting for a reader, so it never exits and your close handler never fires. Attach a data listener or call .resume() on stderr. This is the same hazard behind exec()\'s 1 MB maxBuffer limit.|||Bộ đệm pipe của hệ điều hành là ~64 KB. Một tiến trình con ghi stderr quá mức đó sẽ chặn ở lệnh ghi chờ một người đọc, nên nó không bao giờ thoát và handler close của bạn không bao giờ chạy. Gắn một listener data hoặc gọi .resume() trên stderr. Đây cũng chính là hiểm hoạ đằng sau giới hạn maxBuffer 1 MB của exec().',
              'FFmpeg is slow on those particular codecs|||FFmpeg chậm với những codec cụ thể đó',
              'The timeout value is too low|||Giá trị timeout quá thấp',
              'stdin was never closed with .end()|||stdin chưa bao giờ được đóng bằng .end()',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Two-pass loudnorm: pass 1 measures fine and logs real LUFS values, but output tracks still play at different volumes. Where do you look?|||Loudnorm hai lượt: lượt 1 đo tốt và ghi log giá trị LUFS thật, nhưng các bài output vẫn phát ở âm lượng khác nhau. Bạn nhìn vào đâu?',
            options: [
              'Whether pass 2 actually applied the measured values. In this repo .join(\' \') put a space inside the filter string, so ffmpeg saw ":measured_I=..." as a separate positional argument, failed to find a muxer for it, and fell through to a catch that re-encoded with no loudnorm at all — logging one warn and returning success. Verify by re-measuring the OUTPUT: it should read ≈ -14 LUFS.|||Liệu lượt 2 có thực sự áp dụng các giá trị đo được không. Trong kho này .join(\' \') đặt một khoảng trắng vào giữa chuỗi bộ lọc, nên ffmpeg thấy ":measured_I=..." như một tham số vị trí riêng, không tìm được muxer cho nó, và rơi xuống một khối catch re-encode không hề loudnorm — ghi một dòng warn và trả về thành công. Xác minh bằng cách đo lại OUTPUT: nó phải đọc ra ≈ -14 LUFS.',
              'The LUFS target is set too low in env|||Mục tiêu LUFS đặt quá thấp trong env',
              'Peak normalization should be used instead|||Nên dùng chuẩn hoá theo đỉnh thay thế',
              'MP3 cannot preserve loudness metadata|||MP3 không giữ được metadata độ to',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Why does <code>makerlab/audio.ts</code> try mpg123 before ffmpeg, when ffmpeg can do the same job?|||Vì sao <code>makerlab/audio.ts</code> thử mpg123 trước ffmpeg, khi ffmpeg làm được cùng việc đó?',
            options: [
              'Container size: the production image installs only mpg123 (~1.5 MB for one job) instead of ffmpeg (~80 MB) — a 78.5 MB saving on every pull and deploy. ffmpeg is second so developer machines, which usually have ffmpeg and rarely have mpg123, still work locally with nothing installed. The probe result is memoized so the ENOENT is paid once, not per request.|||Kích thước container: image production chỉ cài mpg123 (~1,5 MB cho một việc) thay vì ffmpeg (~80 MB) — tiết kiệm 78,5 MB mỗi lần pull và deploy. ffmpeg đứng thứ hai để máy lập trình viên, vốn thường có ffmpeg và hiếm khi có mpg123, vẫn chạy được ở local mà không cài gì. Kết quả dò được nhớ lại nên ENOENT chỉ trả một lần, không phải mỗi request.',
              'mpg123 produces higher quality PCM than ffmpeg|||mpg123 sinh PCM chất lượng cao hơn ffmpeg',
              'ffmpeg cannot output raw PCM to stdout|||ffmpeg không xuất được PCM thô ra stdout',
              'mpg123 is the only one that supports 16 kHz|||chỉ mpg123 hỗ trợ 16 kHz',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'A voice-note feature stores 16 kHz mono recordings. A teammate proposes resampling to 44.1 kHz stereo "for quality". Response?|||Một tính năng tin nhắn thoại lưu bản thu 16 kHz mono. Một đồng nghiệp đề xuất resample lên 44,1 kHz stereo "cho chất lượng". Phản hồi?',
            options: [
              'It adds no information and multiplies size by ~5.5× (2.75× for the rate, 2× for the channel). Nyquist means 16 kHz already represents everything up to 8 kHz, and human speech has almost no energy above that; the second channel duplicates a single microphone. Upsampling audio is exactly like upscaling an image — it invents data that was never captured.|||Nó không thêm thông tin nào và nhân kích thước lên ~5,5× (2,75× cho tần số, 2× cho số kênh). Nyquist nghĩa là 16 kHz đã biểu diễn được mọi thứ tới 8 kHz, và tiếng nói con người gần như không có năng lượng trên mức đó; kênh thứ hai chỉ nhân đôi một micro duy nhất. Upsample âm thanh y hệt phóng to một tấm ảnh — nó bịa ra dữ liệu chưa từng được ghi.',
              'Agree — higher sample rates always sound better|||Đồng ý — tần số lấy mẫu cao hơn luôn nghe hay hơn',
              'Agree, but keep it mono|||Đồng ý, nhưng giữ mono',
              'Only resample if the source is already stereo|||Chỉ resample nếu nguồn vốn đã stereo',
            ],
            correctIndex: 0, points: 1,
          },
        ],
      },
    },
  ],
};
