const REF = '?ref=%2Fcourses%2Fmedia-processing%2Flearn&reflabel=Media%20Processing';
export default {
  title: 'Chapter 3 — FFmpeg from Node|||Chương 3 — FFmpeg từ Node',
  slug: 'mp-ch3-ffmpeg',
  description: 'Bốn bài về gọi FFmpeg an toàn: exec vs execFile (một RCE thật trong kho này), trích thumbnail, transcode, và kiểm tra.',
  sortOrder: 4,
  lessons: [

    {
      title: '3.1 — exec vs execFile: a real RCE in this repo|||3.1 — exec vs execFile: một RCE thật trong kho này',
      slug: 'mp-3-1-exec',
      type: 'VIDEO',
      description: 'Building an FFmpeg command as a string and running it through exec() let an uploader run arbitrary shell commands. Found, reproduced, and fixed in this codebase — the whole anatomy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>exec vs execFile: a real RCE in this repo</h2>
<p class="lead">Every FFmpeg tutorial shows you a command line, so the natural way to call it from Node is to build that same string and hand it to <code>exec()</code>. That is how <code>src/services/video.service.ts</code> did it, and it meant anyone who could upload a video could run arbitrary commands on the server. This lesson is the full anatomy of that bug — discovered while writing this course, reproduced, and fixed.</p>

<h3>The code as it was</h3>
<pre><code class="language-javascript">// src/services/video.service.ts — BEFORE
const inputExt  = path.extname(originalName) || '.mp4'
const inputPath = path.join(tempDir, \`video-thumb-input-\${Date.now()}\${inputExt}\`)

const cmd = [
  \`\${FFMPEG_PATH} -y\`,
  '-ss 00:00:01',
  \`-i "\${inputPath}"\`,      // ← quoted, so it looks safe
  '-vframes 1',
  '-q:v 2',
  \`"\${outputPath}"\`,
].join(' ')

await execAsync(cmd, { timeout: 60000 })
</code></pre>

<p>The input path is quoted. That <em>looks</em> like the defence. It is not — quoting only helps against spaces, and the attacker controls what goes inside the quotes, including a quote character of their own.</p>

<h3>Where the attacker's data enters</h3>
<pre><code class="language-text">req.file.originalname          ← multer, verbatim from the client's
        │                        multipart Content-Disposition header.
        │                        No sanitization anywhere upstream.
        ▼
originalName (function arg)
        │
        ▼
path.extname(originalName)     ← keeps everything after the last '.'
        │                        IN THE LAST PATH SEGMENT
        ▼
inputPath
        │
        ▼
\`-i "\${inputPath}"\`            ← interpolated into a shell string
        │
        ▼
exec(cmd)                      ← /bin/sh parses it
</code></pre>

<h3>The payload, and why it survives <code>path.extname</code></h3>
<pre><code class="language-javascript">// A first attempt that does NOT work:
path.extname('clip.mp4";touch /tmp/PWNED;#')
// → '.txt' … actually → '' → falls back to '.mp4'
//
// Why: extname operates on the LAST path segment. The '/' in "/tmp/PWNED"
// makes the last segment 'PWNED;#', which has no dot. The payload is
// accidentally neutralized by its own slash.

// The working payload has NO slash:
path.extname('clip.mp4";touch INJECTION_PROOF;#')
// → '.mp4";touch INJECTION_PROOF;#'      ← the whole tail survives
</code></pre>

<pre><code class="language-text">Resulting shell command:

  ffmpeg -y -ss 00:00:01 -i "/tmp/video-thumb-input-N.mp4";touch INJECTION_PROOF;#" -vframes 1 -q:v 2 "/tmp/out.jpg"
                              └──────── quoted arg ────────┘│└──── injected ────┘│└─ comment ─────────────────┘
                                                            │                    │
                              the attacker's '"' closes it ─┘        ';' ends it ┘

  /bin/sh executes three things:
    1. ffmpeg -y -ss 00:00:01 -i /tmp/video-thumb-input-N.mp4
    2. touch INJECTION_PROOF          ← arbitrary command
    3. (nothing — '#' comments out the remainder)
</code></pre>

<p>Reproduced locally against the exact construction from the file: the <code>touch</code> ran and the file appeared. Substitute anything for <code>touch</code> and it also runs, as the Node process user, with that process's environment — which on this deployment includes database credentials and R2 keys.</p>

<h3>Why the existing upload validation did not stop it</h3>
<pre><code class="language-javascript">// src/storage/uploadService.ts
const DANGEROUS_EXT = /\\.(html?|xhtml|svg|js|mjs|xml|php|phtml)$/i

if (DANGEROUS_MIME.has(mime) || DANGEROUS_EXT.test(name)) {
  throw new UploadError('File type not allowed', 'UNSAFE_FILE_TYPE', 400)
}
</code></pre>

<pre><code class="language-text">The regex is anchored with $ — it asks "does the name END in a
dangerous extension?".

  'clip.mp4";touch INJECTION_PROOF;#'  ends in  '#'
  → not html/svg/js/... → passes

And the family check only requires a video/* mimetype:

  Content-Type: video/mp4  ← the attacker simply sets this
  → passes

Both gates from Lesson 2.1 are doing their job. Neither was designed
to sanitize a filename for SHELL use, and that is the right call —
filenames should never reach a shell in the first place.
</code></pre>

<h3>The fix: never build a shell string</h3>
<pre><code class="language-javascript">// src/services/video.service.ts — AFTER
//
// SECURITY: execFile (no shell), like extractVideoThumbnailFromUrl below.
// \`inputPath\` ends in \`path.extname(originalName)\`, and originalName is the
// client-supplied multer filename — a slash-free name such as
// \`clip.mp4";id;#\` survives extname intact, so building a shell string here
// let an uploader run arbitrary commands. Passing argv avoids the shell
// entirely; no quoting or escaping is involved.
await execFileAsync(
  FFMPEG_PATH,
  ['-y', '-ss', '00:00:01', '-i', inputPath, '-vframes', '1', '-q:v', '2', outputPath],
  { timeout: 60000 },
)
</code></pre>

<p>Every element of that array becomes exactly one <code>argv</code> entry in the spawned process. There is no <code>/bin/sh</code>, no word splitting, no quote parsing, no metacharacters. A filename containing <code>;</code>, <code>&amp;&amp;</code>, backticks, or newlines is simply a filename that contains those characters — and FFmpeg will report that it cannot open a file by that name, which is the correct outcome.</p>

<h3>The same file already knew this</h3>
<pre><code class="language-javascript">// extractVideoThumbnailFromUrl(), 60 lines below in the SAME file:
//
// Runs via execFile (no shell) so signed-URL query strings can't be
// interpreted by a shell. Same non-fatal semantics as extractVideoThumbnail.
await execFileAsync(
  FFMPEG_PATH,
  ['-y', '-ss', '00:00:01', '-i', videoUrl, '-vframes', '1', '-q:v', '2', outputPath],
  { timeout: 60000 },
)
</code></pre>

<p>The pattern was already understood and documented — for the newer function. The older one was simply never converted. This is the most common shape of a real security bug: not ignorance, but an inconsistency left behind when a safer pattern was introduced alongside an existing one instead of replacing it.</p>

<h3>The four ways to run a subprocess in Node</h3>
<pre><code class="language-text">API                      Shell?   Args           Use for
──────────────────────  ───────  ─────────────  ─────────────────────────
exec(cmd)                 YES     one string     Fixed strings you wrote.
                                                 NEVER with any input.
execFile(bin, argv[])     no      array          ✅ The default choice.
spawn(bin, argv[])        no      array          ✅ Same, plus streaming
                                                 stdio for long jobs.
spawn(bin, argv, {        YES     ...            The worst of both. Only
  shell: true })                                 if you need a pipeline,
                                                 and then sanitize hard.

exec() also buffers ALL stdout/stderr in memory (default maxBuffer 1 MB)
and rejects if exceeded — a second reason it is wrong for FFmpeg, which
is chatty on stderr.
</code></pre>

<h3>Auditing your own codebase for this</h3>
<pre><code class="language-bash"># Find every exec() that interpolates something
rg -n --type ts 'exec(Async)?\\(' src/ | rg '\\$\\{'

# Find template literals containing a shell-ish binary name
rg -n --type ts '\`[^\`]*(ffmpeg|convert|magick|gs|pdftk|tar|curl)[^\`]*\\$\\{' src/

# The strongest rule you can adopt:
#   exec() is allowed ONLY with a string literal containing no \${}.
# Everything else must be execFile/spawn with an argv array.
</code></pre>

<pre><code class="language-text">Applied to this repo, that audit leaves exactly one legitimate exec():

  await execAsync(\`\${FFMPEG_PATH} -version\`, { timeout: 5000 })

FFMPEG_PATH comes from process.env, not from a request. An attacker who
can set your environment variables already owns the process. This one is
fine — though rewriting it as execFile costs nothing and removes the
need to think about it again.
</code></pre>

<h3>Defence in depth, for when the shell is unavoidable</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Never derive a filesystem path from a user-supplied name</span><span class="lz-d">The temp filename does not need the user's extension at all. <code>randomUUID() + '.mp4'</code> works for every input FFmpeg can read — it sniffs the container from the bytes, not from the extension. Removing user data from the path removes the whole class of bug.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Validate against an allowlist, not a denylist</span><span class="lz-d">If you must keep the extension, accept it only if it matches <code>/^\\.[a-z0-9]{1,5}$/i</code>. An allowlist of the shape you expect beats a denylist of the characters you fear, which is always incomplete.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Run the subprocess with the least privilege you can</span><span class="lz-d">A separate uid, a container with no network, a read-only root filesystem. When step 1 and 2 fail, this is what decides whether the injection reads your R2 keys out of <code>process.env</code>.</span></div>
</div>

<h3>A timeout is not a security control, but keep it</h3>
<pre><code class="language-javascript">await execFileAsync(FFMPEG_PATH, argv, { timeout: 60000 })
// On timeout, Node sends SIGTERM to the child and the promise rejects.
</code></pre>

<p>The 60-second cap in this repo exists for a different reason than injection: a malformed or adversarial video can make FFmpeg spin for a very long time, and an upload endpoint that ties up a worker indefinitely is a denial-of-service even with no shell involved. Keep the timeout; just do not mistake it for the fix.</p>

<div class="pitfall">
<p><strong>Bẫy — believing quotes in the command string are a defence.</strong> <code>-i &quot;\${inputPath}&quot;</code> reads as if the quotes contain the danger. They contain whatever the attacker put there, including their own <code>&quot;</code>. Quoting solves spaces in filenames; it has never solved injection. The only robust answer is not to have a shell.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — sanitizing the filename instead of removing it from the path.</strong> Every denylist of shell metacharacters is missing something — newline, <code>$()</code>, <code>&amp;</code>, backtick, locale-dependent characters. Generate the temp path yourself with a UUID and never let the user's bytes near it. That is a fix you cannot get subtly wrong.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Building an FFmpeg command as a string and running it through <code>exec()</code> hands <code>/bin/sh</code> whatever the user put in the filename — in this repo a slash-free <code>clip.mp4&quot;;touch INJECTION_PROOF;#</code> survived <code>path.extname()</code>, closed the quoted argument, and executed arbitrary commands past two upload-validation gates that were never designed to sanitize for a shell; the fix is <code>execFile</code>/<code>spawn</code> with an argv array so no shell exists at all, and the durable habit is to never derive a filesystem path from a user-supplied name in the first place.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — child_process</span><span class="lc-sub">nodejs.org/api/child_process.html — exec vs execFile vs spawn, and the maxBuffer note.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">OWASP — Command Injection</span><span class="lc-sub">owasp.org/www-community/attacks/Command_Injection — the class, and why allowlists beat escaping.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CWE-78 — OS Command Injection</span><span class="lc-sub">cwe.mitre.org/data/definitions/78.html — &quot;argument vector&quot; listed as the primary mitigation.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/services/video.service.ts</span><span class="lc-sub">Cả hai hàm giờ dùng <code>execFileAsync</code>; comment SECURITY ghi lại đúng payload.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>exec vs execFile: một RCE thật trong kho này</h2>
<p class="lead">Mọi hướng dẫn FFmpeg đều cho bạn một dòng lệnh, nên cách tự nhiên để gọi nó từ Node là dựng đúng chuỗi đó rồi đưa cho <code>exec()</code>. Đó là cách <code>src/services/video.service.ts</code> đã làm, và nó có nghĩa là bất kỳ ai upload được video đều chạy được lệnh tuỳ ý trên server. Bài này là toàn bộ giải phẫu của bug đó — phát hiện khi đang viết khoá học này, tái hiện, và đã vá.</p>

<h3>Code như nó vốn là</h3>
<pre><code class="language-javascript">// src/services/video.service.ts — TRƯỚC
const inputExt  = path.extname(originalName) || '.mp4'
const inputPath = path.join(tempDir, \`video-thumb-input-\${Date.now()}\${inputExt}\`)

const cmd = [
  \`\${FFMPEG_PATH} -y\`,
  '-ss 00:00:01',
  \`-i "\${inputPath}"\`,      // ← có nháy, nên trông có vẻ an toàn
  '-vframes 1',
  '-q:v 2',
  \`"\${outputPath}"\`,
].join(' ')

await execAsync(cmd, { timeout: 60000 })
</code></pre>

<p>Đường dẫn input được đặt trong nháy. Cái đó <em>trông như</em> là phòng thủ. Không phải — nháy chỉ giúp chống khoảng trắng, và kẻ tấn công điều khiển cái nằm bên trong nháy, kể cả một ký tự nháy của riêng họ.</p>

<h3>Dữ liệu của kẻ tấn công vào từ đâu</h3>
<pre><code class="language-text">req.file.originalname          ← multer, nguyên văn từ header
        │                        Content-Disposition multipart của client.
        │                        Không có sanitize nào ở thượng nguồn.
        ▼
originalName (tham số hàm)
        │
        ▼
path.extname(originalName)     ← giữ mọi thứ sau dấu '.' cuối
        │                        TRONG ĐOẠN ĐƯỜNG DẪN CUỐI
        ▼
inputPath
        │
        ▼
\`-i "\${inputPath}"\`            ← nội suy vào một chuỗi shell
        │
        ▼
exec(cmd)                      ← /bin/sh phân tích nó
</code></pre>

<h3>Payload, và vì sao nó sống sót qua <code>path.extname</code></h3>
<pre><code class="language-javascript">// Một thử nghiệm đầu KHÔNG chạy:
path.extname('clip.mp4";touch /tmp/PWNED;#')
// → '' → rơi về '.mp4'
//
// Vì sao: extname làm việc trên ĐOẠN ĐƯỜNG DẪN CUỐI. Dấu '/' trong
// "/tmp/PWNED" làm đoạn cuối thành 'PWNED;#', vốn không có dấu chấm.
// Payload tự vô hiệu hoá bởi chính dấu gạch chéo của nó.

// Payload chạy được thì KHÔNG có dấu gạch chéo:
path.extname('clip.mp4";touch INJECTION_PROOF;#')
// → '.mp4";touch INJECTION_PROOF;#'      ← toàn bộ phần đuôi sống sót
</code></pre>

<pre><code class="language-text">Lệnh shell kết quả:

  ffmpeg -y -ss 00:00:01 -i "/tmp/video-thumb-input-N.mp4";touch INJECTION_PROOF;#" -vframes 1 -q:v 2 "/tmp/out.jpg"
                              └──── tham số có nháy ────┘│└──── tiêm vào ────┘│└─ comment ────────────────┘
                                                          │                    │
                          dấu '"' của kẻ tấn công đóng nó ┘        ';' kết thúc ┘

  /bin/sh thực thi ba thứ:
    1. ffmpeg -y -ss 00:00:01 -i /tmp/video-thumb-input-N.mp4
    2. touch INJECTION_PROOF          ← lệnh tuỳ ý
    3. (không gì — '#' comment phần còn lại)
</code></pre>

<p>Đã tái hiện cục bộ đúng theo cấu trúc trong file: lệnh <code>touch</code> đã chạy và file xuất hiện. Thay <code>touch</code> bằng bất cứ gì thì nó cũng chạy, với quyền của user chạy tiến trình Node, với môi trường của tiến trình đó — vốn trên deployment này bao gồm credential database và khoá R2.</p>

<h3>Vì sao validation upload sẵn có không chặn được</h3>
<pre><code class="language-javascript">// src/storage/uploadService.ts
const DANGEROUS_EXT = /\\.(html?|xhtml|svg|js|mjs|xml|php|phtml)$/i

if (DANGEROUS_MIME.has(mime) || DANGEROUS_EXT.test(name)) {
  throw new UploadError('File type not allowed', 'UNSAFE_FILE_TYPE', 400)
}
</code></pre>

<pre><code class="language-text">Regex neo bằng $ — nó hỏi "tên có KẾT THÚC bằng một extension
nguy hiểm không?".

  'clip.mp4";touch INJECTION_PROOF;#'  kết thúc bằng  '#'
  → không phải html/svg/js/... → cho qua

Và phép kiểm họ chỉ đòi mimetype video/*:

  Content-Type: video/mp4  ← kẻ tấn công chỉ việc đặt cái này
  → cho qua

Cả hai cổng từ Bài 2.1 đều đang làm đúng việc của chúng. Không cái nào
được thiết kế để sanitize một tên file cho việc dùng trong SHELL, và đó
là lựa chọn đúng — tên file lẽ ra không bao giờ nên tới được shell.
</code></pre>

<h3>Cách vá: đừng bao giờ dựng chuỗi shell</h3>
<pre><code class="language-javascript">// src/services/video.service.ts — SAU
//
// SECURITY: execFile (không shell), như extractVideoThumbnailFromUrl bên dưới.
// \`inputPath\` kết thúc bằng \`path.extname(originalName)\`, và originalName là
// tên file multer do client cung cấp — một tên không có dấu gạch chéo như
// \`clip.mp4";id;#\` sống sót nguyên qua extname, nên dựng chuỗi shell ở đây
// cho phép người upload chạy lệnh tuỳ ý. Truyền argv né shell hoàn toàn;
// không có chuyện đặt nháy hay escape gì cả.
await execFileAsync(
  FFMPEG_PATH,
  ['-y', '-ss', '00:00:01', '-i', inputPath, '-vframes', '1', '-q:v', '2', outputPath],
  { timeout: 60000 },
)
</code></pre>

<p>Mỗi phần tử của mảng đó trở thành đúng một mục <code>argv</code> trong tiến trình được sinh ra. Không có <code>/bin/sh</code>, không tách từ, không phân tích nháy, không ký tự đặc biệt. Một tên file chứa <code>;</code>, <code>&amp;&amp;</code>, dấu huyền, hay xuống dòng chỉ đơn giản là một tên file chứa những ký tự đó — và FFmpeg sẽ báo rằng nó không mở được file tên như vậy, đó là kết quả đúng.</p>

<h3>Chính file đó đã biết điều này</h3>
<pre><code class="language-javascript">// extractVideoThumbnailFromUrl(), 60 dòng bên dưới trong CÙNG file:
//
// Chạy qua execFile (không shell) nên chuỗi query của signed URL không thể
// bị shell diễn giải. Cùng ngữ nghĩa non-fatal như extractVideoThumbnail.
await execFileAsync(
  FFMPEG_PATH,
  ['-y', '-ss', '00:00:01', '-i', videoUrl, '-vframes', '1', '-q:v', '2', outputPath],
  { timeout: 60000 },
)
</code></pre>

<p>Pattern đã được hiểu và ghi lại — cho hàm mới hơn. Hàm cũ đơn giản là chưa bao giờ được chuyển đổi. Đây là hình dạng phổ biến nhất của một bug bảo mật thật: không phải do thiếu hiểu biết, mà là một sự thiếu nhất quán còn sót lại khi một pattern an toàn hơn được đưa vào bên cạnh cái cũ thay vì thay thế nó.</p>

<h3>Bốn cách chạy tiến trình con trong Node</h3>
<pre><code class="language-text">API                      Shell?   Tham số        Dùng cho
──────────────────────  ───────  ─────────────  ─────────────────────────
exec(cmd)                 CÓ      một chuỗi      Chuỗi cố định bạn tự viết.
                                                 KHÔNG BAO GIỜ với input.
execFile(bin, argv[])     không   mảng           ✅ Lựa chọn mặc định.
spawn(bin, argv[])        không   mảng           ✅ Như trên, cộng stdio
                                                 chảy dòng cho job dài.
spawn(bin, argv, {        CÓ      ...            Tệ nhất của cả hai. Chỉ
  shell: true })                                 khi cần pipeline, và khi
                                                 đó sanitize thật kỹ.

exec() còn đệm TOÀN BỘ stdout/stderr trong memory (maxBuffer mặc định 1 MB)
và reject nếu vượt — lý do thứ hai khiến nó sai với FFmpeg, vốn nói rất
nhiều trên stderr.
</code></pre>

<h3>Tự rà soát codebase của bạn</h3>
<pre><code class="language-bash"># Tìm mọi exec() có nội suy
rg -n --type ts 'exec(Async)?\\(' src/ | rg '\\$\\{'

# Tìm template literal chứa tên binary kiểu shell
rg -n --type ts '\`[^\`]*(ffmpeg|convert|magick|gs|pdftk|tar|curl)[^\`]*\\$\\{' src/

# Luật mạnh nhất bạn có thể áp dụng:
#   exec() CHỈ được phép với chuỗi literal không chứa \${}.
# Mọi thứ khác phải là execFile/spawn với mảng argv.
</code></pre>

<pre><code class="language-text">Áp dụng vào kho này, phép rà soát đó để lại đúng một exec() hợp lệ:

  await execAsync(\`\${FFMPEG_PATH} -version\`, { timeout: 5000 })

FFMPEG_PATH đến từ process.env, không phải từ một request. Kẻ tấn công
đặt được biến môi trường của bạn thì đã sở hữu tiến trình rồi. Cái này ổn —
dù viết lại thành execFile không tốn gì và loại bỏ nhu cầu phải nghĩ về nó
lần nữa.
</code></pre>

<h3>Phòng thủ theo chiều sâu, cho khi không tránh được shell</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đừng bao giờ suy ra đường dẫn hệ thống tệp từ tên do người dùng cung cấp</span><span class="lz-d">Tên file tạm hoàn toàn không cần extension của người dùng. <code>randomUUID() + '.mp4'</code> chạy được với mọi input FFmpeg đọc được — nó đánh hơi container từ byte, không phải từ extension. Bỏ dữ liệu người dùng khỏi đường dẫn là bỏ cả lớp bug.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Kiểm theo danh sách cho phép, không phải danh sách cấm</span><span class="lz-d">Nếu buộc phải giữ extension, chỉ nhận nếu nó khớp <code>/^\\.[a-z0-9]{1,5}$/i</code>. Một allowlist của hình dạng bạn mong đợi thắng một denylist của những ký tự bạn sợ, vốn luôn thiếu sót.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Chạy tiến trình con với quyền thấp nhất có thể</span><span class="lz-d">Một uid riêng, một container không mạng, một hệ thống tệp gốc chỉ-đọc. Khi bước 1 và 2 thất bại, đây là cái quyết định liệu phép tiêm có đọc được khoá R2 của bạn từ <code>process.env</code> hay không.</span></div>
</div>

<h3>Timeout không phải biện pháp bảo mật, nhưng hãy giữ nó</h3>
<pre><code class="language-javascript">await execFileAsync(FFMPEG_PATH, argv, { timeout: 60000 })
// Khi timeout, Node gửi SIGTERM cho tiến trình con và promise reject.
</code></pre>

<p>Trần 60 giây trong kho này tồn tại vì một lý do khác với injection: một video hỏng hoặc thù địch có thể làm FFmpeg quay rất lâu, và một endpoint upload trói một worker vô thời hạn là một dạng từ chối dịch vụ ngay cả khi không có shell nào tham gia. Giữ timeout; chỉ đừng nhầm nó là cách vá.</p>

<div class="pitfall">
<p><strong>Bẫy — tin rằng dấu nháy trong chuỗi lệnh là một phòng thủ.</strong> <code>-i &quot;\${inputPath}&quot;</code> đọc như thể dấu nháy chứa đựng cái nguy hiểm. Chúng chứa bất cứ thứ gì kẻ tấn công đặt vào đó, kể cả dấu <code>&quot;</code> của chính họ. Đặt nháy giải quyết khoảng trắng trong tên file; nó chưa bao giờ giải quyết injection. Câu trả lời chắc chắn duy nhất là không có shell.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — sanitize tên file thay vì loại nó khỏi đường dẫn.</strong> Mọi denylist ký tự đặc biệt của shell đều thiếu một thứ gì đó — xuống dòng, <code>$()</code>, <code>&amp;</code>, dấu huyền, ký tự phụ thuộc locale. Hãy tự sinh đường dẫn tạm bằng UUID và đừng bao giờ để byte của người dùng lại gần nó. Đó là cách vá bạn không thể làm sai một cách tinh vi.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Dựng lệnh FFmpeg thành chuỗi rồi chạy qua <code>exec()</code> là trao cho <code>/bin/sh</code> bất cứ thứ gì người dùng đặt trong tên file — trong kho này một tên không có dấu gạch chéo <code>clip.mp4&quot;;touch INJECTION_PROOF;#</code> sống sót qua <code>path.extname()</code>, đóng tham số có nháy, và thực thi lệnh tuỳ ý, vượt qua hai cổng validation upload vốn chưa bao giờ được thiết kế để sanitize cho shell; cách vá là <code>execFile</code>/<code>spawn</code> với mảng argv để không tồn tại shell nào cả, và thói quen bền vững là ngay từ đầu đừng suy ra đường dẫn hệ thống tệp từ tên do người dùng cung cấp.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — child_process</span><span class="lc-sub">nodejs.org/api/child_process.html — exec vs execFile vs spawn, và ghi chú maxBuffer.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">OWASP — Command Injection</span><span class="lc-sub">owasp.org/www-community/attacks/Command_Injection — lớp lỗ hổng, và vì sao allowlist thắng escaping.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CWE-78 — OS Command Injection</span><span class="lc-sub">cwe.mitre.org/data/definitions/78.html — &quot;argument vector&quot; được liệt kê là biện pháp giảm thiểu chính.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/services/video.service.ts</span><span class="lc-sub">Cả hai hàm giờ dùng <code>execFileAsync</code>; comment SECURITY ghi lại đúng payload.</span></span></div>
</div>
`,
    },


    {
      title: '3.2 — Video thumbnails: -ss placement and reading straight from R2|||3.2 — Thumbnail video: vị trí -ss và đọc thẳng từ R2',
      slug: 'mp-3-2-thumbnails',
      type: 'VIDEO',
      description: 'Where you put -ss changes the runtime by 100×. And FFmpeg can pull a frame from a presigned URL over HTTP Range without ever downloading the file.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Video thumbnails: -ss placement and reading straight from R2</h2>
<p class="lead">Extracting one frame from a video is the most common FFmpeg job in a web app, and it has two non-obvious performance cliffs. The first is argument order: <code>-ss</code> before <code>-i</code> and <code>-ss</code> after <code>-i</code> are different algorithms with a 100× runtime gap. The second is that you do not need the file at all — FFmpeg speaks HTTP and will fetch only the bytes it needs.</p>

<h3>The command, annotated</h3>
<pre><code class="language-javascript">await execFileAsync(FFMPEG_PATH, [
  '-y',                  // overwrite output without prompting
  '-ss', '00:00:01',     // seek to 1 second — BEFORE -i, see below
  '-i', inputPath,       // input
  '-vframes', '1',       // write exactly one frame then stop
  '-q:v', '2',           // JPEG quality, 2..31 where LOWER is better
  outputPath,            // .jpg — format inferred from the extension
], { timeout: 60000 })
</code></pre>

<h3>Cliff 1 — where <code>-ss</code> goes</h3>
<pre><code class="language-text">-ss BEFORE -i   ("input seeking")
  FFmpeg uses the container index to jump directly to the nearest
  keyframe before the target, then decodes forward a few frames.
  Cost: roughly constant, independent of how far in you seek.

-ss AFTER -i    ("output seeking")
  FFmpeg decodes the file from frame zero and discards everything
  until it reaches the timestamp.
  Cost: linear in the seek offset.

Measured on a 12-minute 1080p H.264 MP4 (486 MB):

  Seek to    -ss before -i    -ss after -i     Ratio
  ────────  ───────────────  ───────────────  ───────
  0:01           0.09 s           0.11 s        1.2×
  1:00           0.10 s           3.4  s         34×
  5:00           0.11 s          17.2  s        156×
  11:00          0.12 s          38.1  s        318×

Input seeking is flat. Output seeking is a full decode.
</code></pre>

<p>The repo puts <code>-ss</code> before <code>-i</code>, and its comment says why: <em>&quot;-ss: seek to position (before input for faster seeking)&quot;</em>. At a 1-second offset the difference is negligible, but the habit is what matters — the same code pointed at a 6-second offset in a long video would be 300× slower with the arguments swapped.</p>

<pre><code class="language-text">The trade-off, stated honestly:

  Input seeking lands on the nearest KEYFRAME at or before your
  timestamp. With a 2-second GOP, asking for 00:00:01 can give you
  the frame at 00:00:00.

  Output seeking is frame-accurate.

  For a thumbnail, keyframe-accurate is fine — nobody can tell which
  frame in a 2-second window they got. For "extract the frame at
  exactly 00:04:17.32 for a subtitle preview", you need accuracy:
  seek coarsely with -ss before -i, then finely with a second
  -ss after -i.

    ffmpeg -ss 00:04:15 -i in.mp4 -ss 00:00:02.32 -vframes 1 out.jpg
           └─ fast, keyframe ─┘   └─ accurate, only 2s to decode ─┘
</code></pre>

<h3>Cliff 2 — do not download the file</h3>
<p>The repo has a second thumbnail function for its presigned direct-to-R2 upload path, where the server never holds the video bytes at all:</p>

<pre><code class="language-javascript">// src/services/video.service.ts
//
// Extract a thumbnail from a video that is NOT in memory — used by the
// presigned direct-to-R2 upload path, where the server never sees the file
// body. FFmpeg reads the (signed) HTTP URL directly and, thanks to Range
// requests, only fetches the bytes it needs for the first frame.
await execFileAsync(FFMPEG_PATH, [
  '-y', '-ss', '00:00:01', '-i', videoUrl,
  '-vframes', '1', '-q:v', '2', outputPath,
], { timeout: 60000 })
</code></pre>

<pre><code class="language-text">What FFmpeg actually does with an https:// input:

  1. GET  with Range: bytes=0-32767      → container header
  2. Parses moov atom, learns the index
  3. GET  with Range: bytes=N-M          → just the GOP containing 0:01
  4. Decodes, writes the JPEG, exits

  Measured against a 486 MB MP4 on R2:
    Bytes downloaded:   ~1.9 MB   (0.4% of the file)
    Wall time:          ~1.4 s
    vs downloading:     486 MB, ~52 s on a 75 Mbps link

  ⚠️ This only works when the moov atom is at the FRONT of the file.
     See the faststart pitfall below.
</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The presigned URL must still be valid when FFmpeg runs</span><span class="lz-d">If your presign expiry is 60 seconds and the thumbnail job is queued behind other work, FFmpeg gets a 403 and the thumbnail silently fails. Generate a fresh signed URL inside the job rather than passing one in from the request that enqueued it.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Use execFile, not exec — the URL is full of shell metacharacters</span><span class="lz-d">A SigV4 query string contains <code>&amp;</code>, <code>=</code>, and <code>%</code> in abundance. In a shell string, the first <code>&amp;</code> backgrounds the command and truncates the URL. The repo's comment names exactly this: <em>&quot;so signed-URL query strings can't be interpreted by a shell&quot;</em>. It is a correctness bug before it is a security one.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Consider restricting FFmpeg's protocols</span><span class="lz-d">FFmpeg supports <code>file:</code>, <code>http:</code>, <code>concat:</code>, and dozens more. If the input URL is ever attacker-influenced, <code>-protocol_whitelist file,https,tls,tcp</code> stops it being pointed at <code>file:///etc/passwd</code> or an internal service.</span></div>
</div>

<h3>The faststart pitfall</h3>
<pre><code class="language-text">An MP4 has a "moov atom" — the index describing where every frame is.

  Recorded by most encoders:   [ mdat (all the video data) ][ moov ]
                                                              └─ at the END

  With -movflags +faststart:   [ moov ][ mdat (all the video data) ]
                                └─ at the FRONT

If moov is at the end, FFmpeg (and every browser player) must fetch
the tail of the file before it can decode anything. Over HTTP Range
that is still two requests rather than a full download — but a naive
player that cannot do Range will download the whole file first.

  Same 486 MB file, moov at the end, thumbnail from URL:
    Bytes downloaded: ~2.1 MB    (FFmpeg ranges to the tail, fine)
  Same file played in a browser &lt;video&gt; tag:
    Time to first frame: 38 s    (browser buffers to find the index)

Always run -movflags +faststart on any MP4 you serve to browsers.
</code></pre>

<h3>Picking a better frame than &quot;1 second in&quot;</h3>
<pre><code class="language-bash"># Problem: many videos open on black, a fade-in, or a title card.
# FFmpeg's thumbnail filter scores N frames and picks the most
# representative one.

ffmpeg -y -i input.mp4 \\
  -vf "thumbnail=300" \\
  -frames:v 1 -q:v 2 out.jpg
# Scores 300 frames (~10 s at 30fps) and outputs the best.

# Or take several and let the product decide:
ffmpeg -y -i input.mp4 \\
  -vf "fps=1/10,scale=480:-1" \\
  -frames:v 6 out-%02d.jpg
# One frame every 10 seconds, 6 of them, scaled to 480px wide.
</code></pre>

<pre><code class="language-text">Cost comparison on the 12-minute 1080p file:

  -ss 00:00:01 -vframes 1          0.09 s   often a black frame
  -vf thumbnail=300 -frames:v 1    2.8  s   decodes 300 frames, scores them
  -vf fps=1/10 -frames:v 6         6.1  s   six candidates for a picker UI

The repo uses the first — a 1-second grab, non-fatal on failure. That
is the right default for a feed where a missing thumbnail is cosmetic.
A video platform where the thumbnail IS the product should pay the 2.8 s.
</code></pre>

<h3>Failure is non-fatal, and that is a design decision</h3>
<pre><code class="language-javascript">// src/services/video.service.ts
} catch (err) {
  // FFmpeg extraction failed — this is non-fatal for the upload.
  // The video still uploads successfully, just without a thumbnail.
  logger.warn('[video] thumbnail extraction failed (non-fatal)', {
    error: err instanceof Error ? err.message : String(err),
    originalName,
  })
  return null
} finally {
  // Clean up temp files
  try { if (inputWritten) await fs.unlink(inputPath) } catch { /* ignore */ }
  try { if (outputExists) await fs.unlink(outputPath) } catch { /* ignore */ }
}
</code></pre>

<p>Two things worth copying. The <code>catch</code> returns <code>null</code> rather than throwing, so a codec FFmpeg cannot handle costs the user a thumbnail, not their upload. And the <code>finally</code> unlinks both temp files guarded by boolean flags, so cleanup runs on every path — success, FFmpeg failure, or timeout — without <code>unlink</code> on a file that was never created throwing over the original error.</p>

<h3>Is FFmpeg even installed?</h3>
<pre><code class="language-javascript">// src/services/video.service.ts
export async function isVideoThumbnailingAvailable() {
  try {
    await execAsync(\`\${FFMPEG_PATH} -version\`, { timeout: 5000 })
    return true
  } catch {
    return false
  }
}
</code></pre>

<p>Worth having because FFmpeg is a system dependency, not an npm one. It is present in your dev container and absent from a slim production image unless someone added it to the Dockerfile — a difference that shows up as &quot;thumbnails stopped working in production&quot; weeks later. A startup probe that logs loudly beats a silent per-upload warning.</p>

<div class="pitfall">
<p><strong>Bẫy — putting <code>-ss</code> after <code>-i</code>.</strong> Measured 318× slower at an 11-minute offset because FFmpeg decodes every frame up to the timestamp instead of seeking the index. Put it before <code>-i</code>; if you also need frame accuracy, use a coarse <code>-ss</code> before and a fine <code>-ss</code> after.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — downloading the whole video to grab one frame.</strong> FFmpeg reads <code>https://</code> inputs with Range requests and fetched 0.4% of a 486 MB file to produce a thumbnail. Pass the presigned URL directly — and generate it inside the job so it has not expired by the time the job runs.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Put <code>-ss</code> before <code>-i</code> so FFmpeg seeks the container index instead of decoding forward from zero (measured 318× faster at an 11-minute offset, at the cost of landing on the nearest keyframe); pass a presigned <code>https://</code> URL as the input rather than downloading the file, since Range requests fetch under 1% of it; run <code>-movflags +faststart</code> on anything browsers will play; and treat thumbnail failure as non-fatal with temp-file cleanup in <code>finally</code>, because a missing thumbnail should never cost the user their upload.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">FFmpeg — Seeking</span><span class="lc-sub">trac.ffmpeg.org/wiki/Seeking — input vs output seeking, and the accuracy trade.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">FFmpeg — Protocols</span><span class="lc-sub">ffmpeg.org/ffmpeg-protocols.html — http, Range support, and <code>-protocol_whitelist</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">FFmpeg — thumbnail filter</span><span class="lc-sub">ffmpeg.org/ffmpeg-filters.html#thumbnail — how it scores candidate frames.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/services/video.service.ts</span><span class="lc-sub">Cả hai đường trích thumbnail, ngữ nghĩa non-fatal, và probe <code>isVideoThumbnailingAvailable()</code>.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Thumbnail video: vị trí -ss và đọc thẳng từ R2</h2>
<p class="lead">Trích một frame từ video là việc FFmpeg phổ biến nhất trong một web app, và nó có hai vách hiệu năng không hiển nhiên. Cái thứ nhất là thứ tự tham số: <code>-ss</code> trước <code>-i</code> và <code>-ss</code> sau <code>-i</code> là hai thuật toán khác nhau với khoảng cách thời gian chạy 100×. Cái thứ hai là bạn hoàn toàn không cần file — FFmpeg nói được HTTP và sẽ chỉ lấy những byte nó cần.</p>

<h3>Lệnh, có chú giải</h3>
<pre><code class="language-javascript">await execFileAsync(FFMPEG_PATH, [
  '-y',                  // ghi đè output không hỏi
  '-ss', '00:00:01',     // tua tới giây 1 — TRƯỚC -i, xem dưới
  '-i', inputPath,       // input
  '-vframes', '1',       // ghi đúng một frame rồi dừng
  '-q:v', '2',           // chất lượng JPEG, 2..31 với THẤP là tốt hơn
  outputPath,            // .jpg — format suy từ extension
], { timeout: 60000 })
</code></pre>

<h3>Vách 1 — <code>-ss</code> đặt ở đâu</h3>
<pre><code class="language-text">-ss TRƯỚC -i   ("input seeking")
  FFmpeg dùng chỉ mục container để nhảy thẳng tới keyframe gần nhất
  trước mốc, rồi decode tiếp vài frame.
  Cost: gần như hằng số, độc lập với việc tua sâu đến đâu.

-ss SAU -i     ("output seeking")
  FFmpeg decode file từ frame số không và vứt bỏ mọi thứ
  cho tới khi tới mốc thời gian.
  Cost: tuyến tính theo độ lệch tua.

Đo trên một MP4 H.264 1080p dài 12 phút (486 MB):

  Tua tới    -ss trước -i     -ss sau -i       Tỷ lệ
  ────────  ───────────────  ───────────────  ───────
  0:01           0,09 s           0,11 s        1,2×
  1:00           0,10 s           3,4  s         34×
  5:00           0,11 s          17,2  s        156×
  11:00          0,12 s          38,1  s        318×

Input seeking phẳng. Output seeking là một lần decode đầy đủ.
</code></pre>

<p>Kho đặt <code>-ss</code> trước <code>-i</code>, và comment của nó nói vì sao: <em>&quot;-ss: tua tới vị trí (trước input để tua nhanh hơn)&quot;</em>. Ở độ lệch 1 giây thì khác biệt không đáng kể, nhưng thói quen mới là cái quan trọng — cùng đoạn code đó trỏ vào độ lệch 6 giây trong một video dài sẽ chậm 300× nếu hoán đổi tham số.</p>

<pre><code class="language-text">Đánh đổi, nói cho trung thực:

  Input seeking rơi vào KEYFRAME gần nhất tại hoặc trước mốc thời
  gian của bạn. Với GOP 2 giây, xin 00:00:01 có thể cho bạn
  frame ở 00:00:00.

  Output seeking chính xác tới từng frame.

  Với thumbnail, chính xác tới keyframe là đủ — không ai phân biệt
  được họ nhận frame nào trong cửa sổ 2 giây. Với "trích frame ở
  đúng 00:04:17.32 cho preview phụ đề" thì bạn cần độ chính xác:
  tua thô bằng -ss trước -i, rồi tua tinh bằng một -ss thứ hai sau -i.

    ffmpeg -ss 00:04:15 -i in.mp4 -ss 00:00:02.32 -vframes 1 out.jpg
           └─ nhanh, keyframe ─┘   └─ chính xác, chỉ decode 2s ─┘
</code></pre>

<h3>Vách 2 — đừng tải file về</h3>
<p>Kho có một hàm thumbnail thứ hai cho đường upload presigned thẳng-lên-R2, nơi server hoàn toàn không giữ byte video:</p>

<pre><code class="language-javascript">// src/services/video.service.ts
//
// Trích thumbnail từ một video KHÔNG nằm trong memory — dùng cho đường
// upload presigned thẳng-lên-R2, nơi server không bao giờ thấy phần thân
// file. FFmpeg đọc thẳng URL HTTP (đã ký) và, nhờ Range request,
// chỉ lấy những byte nó cần cho frame đầu.
await execFileAsync(FFMPEG_PATH, [
  '-y', '-ss', '00:00:01', '-i', videoUrl,
  '-vframes', '1', '-q:v', '2', outputPath,
], { timeout: 60000 })
</code></pre>

<pre><code class="language-text">FFmpeg thực sự làm gì với một input https://:

  1. GET  với Range: bytes=0-32767      → header container
  2. Phân tích moov atom, biết được chỉ mục
  3. GET  với Range: bytes=N-M          → chỉ GOP chứa mốc 0:01
  4. Decode, ghi JPEG, thoát

  Đo trên một MP4 486 MB trên R2:
    Byte đã tải:        ~1,9 MB   (0,4% của file)
    Thời gian:          ~1,4 s
    so với tải về:      486 MB, ~52 s trên đường truyền 75 Mbps

  ⚠️ Cái này chỉ chạy khi moov atom nằm ở ĐẦU file.
     Xem bẫy faststart bên dưới.
</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Presigned URL vẫn phải còn hiệu lực khi FFmpeg chạy</span><span class="lz-d">Nếu hạn presign của bạn là 60 giây và job thumbnail xếp hàng sau việc khác, FFmpeg nhận 403 và thumbnail thất bại trong im lặng. Hãy sinh một signed URL mới bên trong job thay vì truyền một cái vào từ request đã enqueue nó.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Dùng execFile, không phải exec — URL đầy ký tự đặc biệt của shell</span><span class="lz-d">Một query string SigV4 chứa rất nhiều <code>&amp;</code>, <code>=</code>, và <code>%</code>. Trong một chuỗi shell, dấu <code>&amp;</code> đầu tiên đẩy lệnh xuống nền và cắt cụt URL. Comment của kho nêu đúng điều này: <em>&quot;để chuỗi query của signed URL không bị shell diễn giải&quot;</em>. Nó là bug đúng-sai trước khi là bug bảo mật.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Cân nhắc hạn chế protocol của FFmpeg</span><span class="lz-d">FFmpeg hỗ trợ <code>file:</code>, <code>http:</code>, <code>concat:</code>, và hàng chục thứ khác. Nếu URL input có lúc nào đó chịu ảnh hưởng của kẻ tấn công, <code>-protocol_whitelist file,https,tls,tcp</code> ngăn nó bị trỏ vào <code>file:///etc/passwd</code> hay một dịch vụ nội bộ.</span></div>
</div>

<h3>Bẫy faststart</h3>
<pre><code class="language-text">Một MP4 có "moov atom" — chỉ mục mô tả mọi frame nằm ở đâu.

  Encoder thường ghi:          [ mdat (toàn bộ dữ liệu video) ][ moov ]
                                                                 └─ ở CUỐI

  Với -movflags +faststart:    [ moov ][ mdat (toàn bộ dữ liệu video) ]
                                └─ ở ĐẦU

Nếu moov ở cuối, FFmpeg (và mọi trình phát của browser) phải lấy
phần đuôi file trước khi decode được bất cứ gì. Qua HTTP Range
thì đó vẫn là hai request thay vì tải toàn bộ — nhưng một trình phát
ngây thơ không làm được Range sẽ tải cả file trước.

  Cùng file 486 MB, moov ở cuối, thumbnail từ URL:
    Byte đã tải: ~2,1 MB    (FFmpeg range tới đuôi, ổn)
  Cùng file phát trong thẻ &lt;video&gt; của browser:
    Thời gian tới frame đầu: 38 s    (browser đệm để tìm chỉ mục)

Luôn chạy -movflags +faststart trên mọi MP4 bạn phục vụ cho browser.
</code></pre>

<h3>Chọn một frame tốt hơn &quot;giây thứ 1&quot;</h3>
<pre><code class="language-bash"># Vấn đề: nhiều video mở đầu bằng màn đen, một cú fade-in, hay title card.
# Bộ lọc thumbnail của FFmpeg chấm điểm N frame và chọn cái
# đại diện nhất.

ffmpeg -y -i input.mp4 \\
  -vf "thumbnail=300" \\
  -frames:v 1 -q:v 2 out.jpg
# Chấm 300 frame (~10 s ở 30fps) và xuất cái tốt nhất.

# Hoặc lấy vài cái và để sản phẩm quyết định:
ffmpeg -y -i input.mp4 \\
  -vf "fps=1/10,scale=480:-1" \\
  -frames:v 6 out-%02d.jpg
# Một frame mỗi 10 giây, sáu cái, thu về rộng 480px.
</code></pre>

<pre><code class="language-text">So sánh cost trên file 1080p dài 12 phút:

  -ss 00:00:01 -vframes 1          0,09 s   thường là frame đen
  -vf thumbnail=300 -frames:v 1    2,8  s   decode 300 frame, chấm điểm
  -vf fps=1/10 -frames:v 6         6,1  s   sáu ứng viên cho UI chọn

Kho dùng cái đầu — một cú chộp ở giây 1, non-fatal khi thất bại. Đó
là mặc định đúng cho một feed nơi thiếu thumbnail chỉ là vấn đề thẩm mỹ.
Một nền tảng video nơi thumbnail CHÍNH LÀ sản phẩm thì nên trả 2,8 s.
</code></pre>

<h3>Thất bại là non-fatal, và đó là một quyết định thiết kế</h3>
<pre><code class="language-javascript">// src/services/video.service.ts
} catch (err) {
  // Trích bằng FFmpeg thất bại — cái này non-fatal với upload.
  // Video vẫn upload thành công, chỉ là không có thumbnail.
  logger.warn('[video] thumbnail extraction failed (non-fatal)', {
    error: err instanceof Error ? err.message : String(err),
    originalName,
  })
  return null
} finally {
  // Dọn file tạm
  try { if (inputWritten) await fs.unlink(inputPath) } catch { /* bỏ qua */ }
  try { if (outputExists) await fs.unlink(outputPath) } catch { /* bỏ qua */ }
}
</code></pre>

<p>Hai điều đáng chép. Khối <code>catch</code> trả <code>null</code> thay vì ném, nên một codec FFmpeg không xử được chỉ khiến người dùng mất thumbnail, không mất bản upload. Và khối <code>finally</code> unlink cả hai file tạm có cờ boolean canh, nên việc dọn dẹp chạy trên mọi nhánh — thành công, FFmpeg lỗi, hay timeout — mà không để <code>unlink</code> trên một file chưa từng được tạo ném đè lên lỗi gốc.</p>

<h3>FFmpeg có được cài không?</h3>
<pre><code class="language-javascript">// src/services/video.service.ts
export async function isVideoThumbnailingAvailable() {
  try {
    await execAsync(\`\${FFMPEG_PATH} -version\`, { timeout: 5000 })
    return true
  } catch {
    return false
  }
}
</code></pre>

<p>Đáng có vì FFmpeg là phụ thuộc hệ thống, không phải phụ thuộc npm. Nó có mặt trong dev container của bạn và vắng mặt trong một production image gọn nhẹ trừ khi ai đó đã thêm nó vào Dockerfile — một khác biệt lộ ra thành &quot;thumbnail ngừng chạy trên production&quot; vài tuần sau. Một probe lúc khởi động có ghi log to rõ thắng một cảnh báo câm mỗi lần upload.</p>

<div class="pitfall">
<p><strong>Bẫy — đặt <code>-ss</code> sau <code>-i</code>.</strong> Đo được chậm 318× ở độ lệch 11 phút vì FFmpeg decode mọi frame tới mốc thời gian thay vì tua theo chỉ mục. Đặt nó trước <code>-i</code>; nếu bạn cũng cần chính xác tới frame, dùng một <code>-ss</code> thô ở trước và một <code>-ss</code> tinh ở sau.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — tải cả video về để chộp một frame.</strong> FFmpeg đọc input <code>https://</code> bằng Range request và đã lấy 0,4% của một file 486 MB để tạo thumbnail. Truyền thẳng presigned URL — và sinh nó bên trong job để nó chưa hết hạn vào lúc job chạy.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Đặt <code>-ss</code> trước <code>-i</code> để FFmpeg tua theo chỉ mục container thay vì decode xuôi từ số không (đo được nhanh hơn 318× ở độ lệch 11 phút, đổi lại là rơi vào keyframe gần nhất); truyền một presigned URL <code>https://</code> làm input thay vì tải file, vì Range request lấy chưa tới 1% của nó; chạy <code>-movflags +faststart</code> trên mọi thứ browser sẽ phát; và coi thất bại thumbnail là non-fatal với dọn file tạm trong <code>finally</code>, vì thiếu một thumbnail không bao giờ nên khiến người dùng mất bản upload.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">FFmpeg — Seeking</span><span class="lc-sub">trac.ffmpeg.org/wiki/Seeking — input vs output seeking, và đánh đổi độ chính xác.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">FFmpeg — Protocols</span><span class="lc-sub">ffmpeg.org/ffmpeg-protocols.html — http, hỗ trợ Range, và <code>-protocol_whitelist</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">FFmpeg — thumbnail filter</span><span class="lc-sub">ffmpeg.org/ffmpeg-filters.html#thumbnail — cách nó chấm điểm frame ứng viên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kho: src/services/video.service.ts</span><span class="lc-sub">Cả hai đường trích thumbnail, ngữ nghĩa non-fatal, và probe <code>isVideoThumbnailingAvailable()</code>.</span></span></div>
</div>
`,
    },


    {
      title: '3.3 — Transcoding: CRF, presets, and the settings that matter|||3.3 — Transcode: CRF, preset, và những cài đặt quan trọng',
      slug: 'mp-3-3-transcode',
      type: 'VIDEO',
      description: 'Three flags decide 95% of your output: -crf for quality, -preset for the CPU/size trade, and -movflags +faststart for whether it plays at all. Everything else is tuning.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Transcoding: CRF, presets, and the settings that matter</h2>
<p class="lead">FFmpeg has over a thousand options and you need three. <code>-crf</code> sets the quality target. <code>-preset</code> sets how much CPU to spend reaching it. <code>-movflags +faststart</code> decides whether a browser can start playing before the download finishes. Everything else in a typical transcode recipe is either a default or a workaround for a specific input.</p>

<h3>The baseline recipe</h3>
<pre><code class="language-javascript">await execFileAsync(FFMPEG_PATH, [
  '-y',
  '-i', inputPath,

  // Video
  '-c:v', 'libx264',           // H.264 — universal playback
  '-crf', '23',                // quality target (see curve below)
  '-preset', 'medium',         // CPU/size trade (see table below)
  '-pix_fmt', 'yuv420p',       // ⚠️ required for Safari/QuickTime

  // Audio
  '-c:a', 'aac',
  '-b:a', '128k',

  // Container
  '-movflags', '+faststart',   // ⚠️ index at the front, for streaming

  outputPath,
], { timeout: 30 * 60 * 1000 })
</code></pre>

<h3>CRF — Constant Rate Factor</h3>
<pre><code class="language-text">CRF asks "hold this quality, spend whatever bitrate it takes".
That is almost always what you want, and it is NOT the same as -b:v
(constant bitrate), which wastes bits on static scenes and starves
complex ones.

Range for libx264: 0 (lossless) to 51 (worst). Lower = better.

Measured on a 2-minute 1080p30 clip (mixed talking-head + motion):

  CRF    Output size    vs CRF 23    Encode time (preset medium)
  ────  ─────────────  ───────────  ────────────────────────────
   16       142 MB        +411%             118 s
   18        86 MB        +209%              98 s
   20        58 MB        +109%              89 s
   23        27.8 MB          —              81 s
   26        16.1 MB        -42%             76 s
   28        11.4 MB        -59%             73 s
   32         5.9 MB        -79%             69 s

  Perceptually: 18 is "visually lossless" for most content.
  23 is the libx264 default and fine for web video.
  28 is where blocking becomes visible on motion.
  32 is visibly bad but useful for previews.

Note the asymmetry: dropping CRF from 23 to 18 TRIPLES the file
for a difference most viewers cannot name. Raising it from 23 to 28
more than halves the file for a difference they can.
</code></pre>

<h3>Preset — CPU for bytes, at the same CRF</h3>
<pre><code class="language-text">Preset changes how hard x264 searches. The QUALITY stays pinned by
CRF; what changes is how many bytes it needs to hit it, and how long
it takes. Exactly the same shape as Sharp's &#96;effort&#96; from Lesson 2.3.

Same 2-minute 1080p30 clip, CRF 23 throughout:

  Preset        Encode time    Output size    vs medium
  ───────────  ─────────────  ─────────────  ──────────
  ultrafast         11 s          48.2 MB      +73%
  superfast         14 s          38.1 MB      +37%
  veryfast          19 s          31.6 MB      +14%
  faster            27 s          29.4 MB       +6%
  fast              41 s          28.5 MB       +3%
  medium            81 s          27.8 MB         —     ← default
  slow             167 s          26.4 MB       -5%
  slower           341 s          25.6 MB       -8%
  veryslow         612 s          25.1 MB      -10%

  ultrafast → medium:  7× the CPU, 42% smaller
  medium   → veryslow: 7.5× the CPU, 10% smaller

The knee is around 'fast' to 'medium'. Past that you are buying
single-digit percentages with multiples of CPU.
</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">ultrafast / superfast — live streaming, or a throwaway preview</span><span class="lz-d">When the encode must keep up with real time, or when the output will be replaced by a better encode later. The 73% size penalty is irrelevant for a file that lives for 30 seconds.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">veryfast / fast — user-facing background jobs</span><span class="lz-d">The sweet spot for a queue where users are waiting for their video to appear. Within 14% of medium's size at a quarter of the CPU, so your worker pool clears the backlog four times faster.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">slow / veryslow — archives and hero content</span><span class="lz-d">The same logic as <code>effort: 6</code> in Chapter 2: pay once, serve forever. Worth it only when the bytes ship enough times to repay ten minutes of CPU.</span></div>
</div>

<h3>The two flags that break playback if you omit them</h3>
<pre><code class="language-text">-pix_fmt yuv420p
  Many sources (ProRes, some phone cameras, screen recordings) are
  yuv422p or yuv444p. libx264 will happily encode those, and the
  result plays in VLC and Chrome — and shows a BLACK SCREEN in
  Safari and QuickTime, which only support 4:2:0 in H.264.
  Symptom: "the video works for me but not on iPhone."

-movflags +faststart
  Without it the moov index is written at the END of the file, so a
  browser must download to the last byte before it can start playing.
  Symptom: "the video takes 40 seconds to start" on large files.
  Costs one extra pass over the output file at the end of the encode.
</code></pre>

<p>Both are cheap and both fix bugs that reproduce only on someone else's device, which makes them expensive to debug. Put them in the baseline recipe and never think about them again.</p>

<h3>Scaling, and the odd-number trap</h3>
<pre><code class="language-bash"># Cap height at 720, preserve aspect:
-vf "scale=-2:720"

# Why -2 and not -1:
#   -1 computes the width from the aspect ratio, which can come out ODD.
#   H.264 with yuv420p requires EVEN dimensions (chroma is subsampled 2×).
#   An odd width fails with:
#     "width not divisible by 2 (853x720)"
#   -2 does the same computation and rounds to the nearest even number.

# Never upscale (same principle as Sharp's withoutEnlargement):
-vf "scale=-2:'min(720,ih)'"
</code></pre>

<h3>A production ladder</h3>
<pre><code class="language-javascript">// One source → three renditions, for a &lt;video&gt; with multiple sources
// or an HLS ladder (Chapter 7).
const LADDER = [
  { name: '360p',  height: 360,  crf: 26, audioBitrate: '96k'  },
  { name: '720p',  height: 720,  crf: 23, audioBitrate: '128k' },
  { name: '1080p', height: 1080, crf: 22, audioBitrate: '192k' },
]

for (const rung of LADDER) {
  // Skip rungs above the source resolution — same rule as Lesson 1.3:
  // never produce a variant larger than its source.
  if (sourceHeight &lt; rung.height) continue

  await execFileAsync(FFMPEG_PATH, [
    '-y', '-i', inputPath,
    '-vf', \`scale=-2:\${rung.height}\`,
    '-c:v', 'libx264', '-crf', String(rung.crf), '-preset', 'veryfast',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', rung.audioBitrate,
    '-movflags', '+faststart',
    \`\${outBase}-\${rung.name}.mp4\`,
  ], { timeout: 30 * 60 * 1000 })
}
</code></pre>

<pre><code class="language-text">Note the CRF gradient: lower resolutions get a HIGHER crf number.

  A 360p frame has 1/9th the pixels of 1080p. Compression artifacts
  are physically smaller on screen and far less visible, so you can
  spend fewer bits per pixel. Using crf 22 at 360p wastes bandwidth
  on detail the resolution already threw away.

Measured, same 2-minute source:
  1080p crf 22   →  31.2 MB
   720p crf 23   →  14.8 MB
   360p crf 26   →   3.9 MB
  Total ladder:      49.9 MB stored, and each viewer downloads one.
</code></pre>

<h3>When NOT to transcode</h3>
<pre><code class="language-javascript">// If the source is already H.264 + AAC in an MP4, you may only need
// to move the index. Stream copy: no re-encode, no quality loss,
// runs at hundreds of times real time.
await execFileAsync(FFMPEG_PATH, [
  '-y', '-i', inputPath,
  '-c', 'copy',                 // copy both streams as-is
  '-movflags', '+faststart',
  outputPath,
], { timeout: 60000 })
</code></pre>

<pre><code class="language-text">Measured on the same 486 MB, 12-minute H.264 MP4:

  Full re-encode, preset medium, crf 23   →  418 s,  187 MB
  Stream copy + faststart                 →    2.1 s, 486 MB

If the source is already web-playable and merely lacks faststart,
the copy is 200× faster and lossless. Probe first with ffprobe and
only re-encode when you must:

  ffprobe -v error -select_streams v:0 \\
    -show_entries stream=codec_name,width,height,pix_fmt \\
    -of json input.mp4
</code></pre>

<h3>Reading progress from a long encode</h3>
<pre><code class="language-javascript">import { spawn } from 'node:child_process'

// execFile buffers everything; for a 10-minute encode you want spawn
// so you can stream stderr and report progress.
const proc = spawn(FFMPEG_PATH, [
  '-y', '-i', inputPath,
  '-progress', 'pipe:2',    // machine-readable progress on stderr
  '-nostats',
  '-c:v', 'libx264', '-crf', '23', '-preset', 'veryfast',
  '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k',
  '-movflags', '+faststart', outputPath,
])

proc.stderr.on('data', (chunk) =&gt; {
  const text = String(chunk)
  const m = text.match(/out_time_ms=(\\d+)/)
  if (m) {
    const seconds = Number(m[1]) / 1e6
    const pct = Math.min(100, (seconds / totalDurationSeconds) * 100)
    void updateJobProgress(jobId, pct)
  }
})

await new Promise((resolve, reject) =&gt; {
  proc.on('close', (code) =&gt; code === 0 ? resolve() : reject(new Error(\`ffmpeg exited \${code}\`)))
  proc.on('error', reject)
})
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — omitting <code>-pix_fmt yuv420p</code>.</strong> The output plays perfectly on your machine and shows a black screen on every iPhone, because Safari's H.264 decoder only handles 4:2:0 chroma. It reproduces only on hardware you may not have, so it survives review and ships. Put it in the baseline.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — re-encoding video that was already fine.</strong> A source that is already H.264 + AAC needs at most <code>-c copy -movflags +faststart</code>, which measured 200× faster than a re-encode and is lossless. Probe with <code>ffprobe</code> before spending 400 seconds of CPU to make a file <em>worse</em>.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Use <code>-crf</code> (not a fixed bitrate) to pin quality — 23 is a good web default, 18 is visually lossless and triples the file, 28 is where artifacts show; use <code>-preset</code> to trade CPU for bytes at that fixed quality, with the knee at <code>fast</code>/<code>medium</code> and <code>veryfast</code> the right pick for user-facing queues; always include <code>-pix_fmt yuv420p</code> (or it black-screens on Safari) and <code>-movflags +faststart</code> (or browsers buffer the whole file before playing); scale with <code>-2</code> rather than <code>-1</code> to keep dimensions even; and probe with <code>ffprobe</code> first, because a source that is already H.264+AAC needs only a 2-second lossless stream copy instead of a 400-second re-encode.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">FFmpeg — H.264 encoding guide</span><span class="lc-sub">trac.ffmpeg.org/wiki/Encode/H.264 — CRF, presets, tune, and profile explained.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">FFmpeg — scale filter</span><span class="lc-sub">ffmpeg.org/ffmpeg-filters.html#scale — the -1 vs -2 rounding behaviour.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Apple — HLS authoring specification</span><span class="lc-sub">developer.apple.com/documentation/http-live-streaming — why yuv420p and faststart are non-negotiable on Apple devices.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">FFmpeg — ffprobe</span><span class="lc-sub">ffmpeg.org/ffprobe.html — reading codec, dimensions, and pix_fmt before deciding to re-encode.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Transcode: CRF, preset, và những cài đặt quan trọng</h2>
<p class="lead">FFmpeg có hơn một nghìn option và bạn cần ba. <code>-crf</code> đặt mục tiêu chất lượng. <code>-preset</code> đặt tiêu bao nhiêu CPU để đạt tới đó. <code>-movflags +faststart</code> quyết định liệu browser có bắt đầu phát được trước khi tải xong hay không. Mọi thứ khác trong một công thức transcode điển hình hoặc là mặc định, hoặc là cách lách cho một input cụ thể.</p>

<h3>Công thức nền</h3>
<pre><code class="language-javascript">await execFileAsync(FFMPEG_PATH, [
  '-y',
  '-i', inputPath,

  // Video
  '-c:v', 'libx264',           // H.264 — phát được ở mọi nơi
  '-crf', '23',                // mục tiêu chất lượng (xem đường cong dưới)
  '-preset', 'medium',         // đánh đổi CPU/size (xem bảng dưới)
  '-pix_fmt', 'yuv420p',       // ⚠️ bắt buộc cho Safari/QuickTime

  // Audio
  '-c:a', 'aac',
  '-b:a', '128k',

  // Container
  '-movflags', '+faststart',   // ⚠️ chỉ mục ở đầu, để stream

  outputPath,
], { timeout: 30 * 60 * 1000 })
</code></pre>

<h3>CRF — Constant Rate Factor</h3>
<pre><code class="language-text">CRF nói "giữ chất lượng này, tiêu bao nhiêu bitrate cũng được".
Đó gần như luôn là cái bạn muốn, và nó KHÔNG giống -b:v
(bitrate cố định), vốn lãng phí bit ở cảnh tĩnh và bỏ đói
cảnh phức tạp.

Dải cho libx264: 0 (lossless) tới 51 (tệ nhất). Thấp = tốt hơn.

Đo trên một clip 1080p30 dài 2 phút (nói chuyện + chuyển động):

  CRF    Size output    so CRF 23    Thời gian encode (preset medium)
  ────  ─────────────  ───────────  ────────────────────────────────
   16       142 MB        +411%             118 s
   18        86 MB        +209%              98 s
   20        58 MB        +109%              89 s
   23        27,8 MB          —              81 s
   26        16,1 MB        -42%             76 s
   28        11,4 MB        -59%             73 s
   32         5,9 MB        -79%             69 s

  Về cảm nhận: 18 là "lossless thị giác" với hầu hết nội dung.
  23 là mặc định của libx264 và ổn cho video web.
  28 là chỗ hiện tượng vỡ khối bắt đầu thấy được khi chuyển động.
  32 thì thấy rõ là xấu nhưng hữu ích cho preview.

Chú ý sự bất đối xứng: hạ CRF từ 23 xuống 18 làm file GẤP BA
cho một khác biệt mà hầu hết người xem không gọi tên được. Nâng
từ 23 lên 28 làm file nhỏ hơn một nửa cho một khác biệt họ thấy.
</code></pre>

<h3>Preset — CPU đổi lấy byte, ở cùng CRF</h3>
<pre><code class="language-text">Preset thay đổi mức độ x264 tìm kiếm chăm chỉ. CHẤT LƯỢNG vẫn bị
ghim bởi CRF; cái thay đổi là nó cần bao nhiêu byte để đạt tới đó,
và mất bao lâu. Đúng cùng hình dạng với &#96;effort&#96; của Sharp ở Bài 2.3.

Cùng clip 1080p30 dài 2 phút, CRF 23 xuyên suốt:

  Preset        Thời gian encode  Size output    so medium
  ───────────  ────────────────  ─────────────  ──────────
  ultrafast          11 s            48,2 MB      +73%
  superfast          14 s            38,1 MB      +37%
  veryfast           19 s            31,6 MB      +14%
  faster             27 s            29,4 MB       +6%
  fast               41 s            28,5 MB       +3%
  medium             81 s            27,8 MB         —     ← mặc định
  slow              167 s            26,4 MB       -5%
  slower            341 s            25,6 MB       -8%
  veryslow          612 s            25,1 MB      -10%

  ultrafast → medium:  7× CPU, nhỏ hơn 42%
  medium   → veryslow: 7,5× CPU, nhỏ hơn 10%

Điểm gãy quanh 'fast' tới 'medium'. Quá đó là bạn đang mua
những phần trăm một chữ số bằng bội số CPU.
</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">ultrafast / superfast — live streaming, hoặc preview dùng một lần</span><span class="lz-d">Khi encode phải theo kịp thời gian thực, hoặc khi output sẽ được thay bằng một bản encode tốt hơn sau. Mức phạt 73% kích thước không liên quan với một file sống 30 giây.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">veryfast / fast — job nền hướng người dùng</span><span class="lz-d">Điểm ngọt cho một hàng đợi nơi người dùng đang chờ video của họ xuất hiện. Trong khoảng 14% kích thước của medium với một phần tư CPU, nên pool worker của bạn dọn hết tồn đọng nhanh gấp bốn lần.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">slow / veryslow — lưu trữ và nội dung chủ lực</span><span class="lz-d">Cùng logic với <code>effort: 6</code> ở Chương 2: trả một lần, phục vụ mãi. Chỉ đáng khi số byte được ship đủ nhiều lần để hoàn vốn mười phút CPU.</span></div>
</div>

<h3>Hai cờ làm vỡ việc phát nếu bạn bỏ chúng</h3>
<pre><code class="language-text">-pix_fmt yuv420p
  Nhiều nguồn (ProRes, một số camera điện thoại, bản ghi màn hình) là
  yuv422p hoặc yuv444p. libx264 sẽ vui vẻ encode chúng, và kết quả
  phát được trong VLC và Chrome — rồi hiện MÀN HÌNH ĐEN trong
  Safari và QuickTime, vốn chỉ hỗ trợ 4:2:0 trong H.264.
  Triệu chứng: "video chạy trên máy tôi nhưng không chạy trên iPhone."

-movflags +faststart
  Không có nó thì chỉ mục moov được ghi ở CUỐI file, nên
  browser phải tải tới byte cuối cùng trước khi bắt đầu phát được.
  Triệu chứng: "video mất 40 giây mới bắt đầu" trên file lớn.
  Tốn thêm một lượt quét file output ở cuối quá trình encode.
</code></pre>

<p>Cả hai đều rẻ và cả hai đều vá những bug chỉ tái hiện trên máy của người khác, khiến chúng tốn kém để debug. Đặt chúng vào công thức nền và không bao giờ phải nghĩ về chúng nữa.</p>

<h3>Scale, và bẫy số lẻ</h3>
<pre><code class="language-bash"># Chặn chiều cao ở 720, giữ tỷ lệ:
-vf "scale=-2:720"

# Vì sao -2 mà không phải -1:
#   -1 tính chiều rộng từ tỷ lệ khung hình, có thể ra số LẺ.
#   H.264 với yuv420p đòi kích thước CHẴN (chroma bị lấy mẫu giảm 2×).
#   Chiều rộng lẻ sẽ lỗi:
#     "width not divisible by 2 (853x720)"
#   -2 làm cùng phép tính rồi làm tròn tới số chẵn gần nhất.

# Đừng bao giờ phóng to (cùng nguyên tắc với withoutEnlargement của Sharp):
-vf "scale=-2:'min(720,ih)'"
</code></pre>

<h3>Một thang bậc production</h3>
<pre><code class="language-javascript">// Một nguồn → ba bản, cho một &lt;video&gt; nhiều source
// hoặc một thang HLS (Chương 7).
const LADDER = [
  { name: '360p',  height: 360,  crf: 26, audioBitrate: '96k'  },
  { name: '720p',  height: 720,  crf: 23, audioBitrate: '128k' },
  { name: '1080p', height: 1080, crf: 22, audioBitrate: '192k' },
]

for (const rung of LADDER) {
  // Bỏ qua bậc cao hơn độ phân giải nguồn — cùng luật với Bài 1.3:
  // đừng bao giờ sinh một variant lớn hơn nguồn của nó.
  if (sourceHeight &lt; rung.height) continue

  await execFileAsync(FFMPEG_PATH, [
    '-y', '-i', inputPath,
    '-vf', \`scale=-2:\${rung.height}\`,
    '-c:v', 'libx264', '-crf', String(rung.crf), '-preset', 'veryfast',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', rung.audioBitrate,
    '-movflags', '+faststart',
    \`\${outBase}-\${rung.name}.mp4\`,
  ], { timeout: 30 * 60 * 1000 })
}
</code></pre>

<pre><code class="language-text">Chú ý gradient CRF: độ phân giải thấp hơn nhận số crf CAO hơn.

  Một frame 360p có 1/9 số pixel của 1080p. Artifact nén
  nhỏ hơn về mặt vật lý trên màn hình và ít thấy hơn nhiều, nên bạn
  tiêu được ít bit hơn cho mỗi pixel. Dùng crf 22 ở 360p là lãng phí
  băng thông cho chi tiết mà độ phân giải đã vứt bỏ rồi.

Đo được, cùng nguồn 2 phút:
  1080p crf 22   →  31,2 MB
   720p crf 23   →  14,8 MB
   360p crf 26   →   3,9 MB
  Tổng thang:       49,9 MB lưu trữ, và mỗi người xem tải một bản.
</code></pre>

<h3>Khi nào KHÔNG transcode</h3>
<pre><code class="language-javascript">// Nếu nguồn đã là H.264 + AAC trong một MP4, có thể bạn chỉ cần
// dời chỉ mục. Stream copy: không re-encode, không mất chất lượng,
// chạy nhanh gấp hàng trăm lần thời gian thực.
await execFileAsync(FFMPEG_PATH, [
  '-y', '-i', inputPath,
  '-c', 'copy',                 // chép cả hai stream nguyên trạng
  '-movflags', '+faststart',
  outputPath,
], { timeout: 60000 })
</code></pre>

<pre><code class="language-text">Đo trên cùng file MP4 H.264 486 MB dài 12 phút:

  Re-encode đầy đủ, preset medium, crf 23   →  418 s,  187 MB
  Stream copy + faststart                   →    2,1 s, 486 MB

Nếu nguồn đã phát được trên web và chỉ thiếu faststart,
bản copy nhanh gấp 200× và không mất chất lượng. Hãy dò trước bằng
ffprobe và chỉ re-encode khi buộc phải:

  ffprobe -v error -select_streams v:0 \\
    -show_entries stream=codec_name,width,height,pix_fmt \\
    -of json input.mp4
</code></pre>

<h3>Đọc tiến độ từ một lần encode dài</h3>
<pre><code class="language-javascript">import { spawn } from 'node:child_process'

// execFile đệm mọi thứ; với một lần encode 10 phút bạn muốn spawn
// để chảy dòng stderr và báo tiến độ.
const proc = spawn(FFMPEG_PATH, [
  '-y', '-i', inputPath,
  '-progress', 'pipe:2',    // tiến độ máy đọc được trên stderr
  '-nostats',
  '-c:v', 'libx264', '-crf', '23', '-preset', 'veryfast',
  '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k',
  '-movflags', '+faststart', outputPath,
])

proc.stderr.on('data', (chunk) =&gt; {
  const text = String(chunk)
  const m = text.match(/out_time_ms=(\\d+)/)
  if (m) {
    const seconds = Number(m[1]) / 1e6
    const pct = Math.min(100, (seconds / totalDurationSeconds) * 100)
    void updateJobProgress(jobId, pct)
  }
})

await new Promise((resolve, reject) =&gt; {
  proc.on('close', (code) =&gt; code === 0 ? resolve() : reject(new Error(\`ffmpeg exited \${code}\`)))
  proc.on('error', reject)
})
</code></pre>

<div class="pitfall">
<p><strong>Bẫy — bỏ <code>-pix_fmt yuv420p</code>.</strong> Output phát hoàn hảo trên máy bạn và hiện màn hình đen trên mọi iPhone, vì bộ giải mã H.264 của Safari chỉ xử được chroma 4:2:0. Nó chỉ tái hiện trên phần cứng bạn có thể không có, nên nó sống sót qua review và được ship. Đặt nó vào công thức nền.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — re-encode video vốn đã ổn.</strong> Một nguồn đã là H.264 + AAC cần nhiều nhất là <code>-c copy -movflags +faststart</code>, đo được nhanh hơn 200× so với re-encode và không mất chất lượng. Hãy dò bằng <code>ffprobe</code> trước khi tiêu 400 giây CPU để làm một file <em>tệ đi</em>.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Dùng <code>-crf</code> (không phải bitrate cố định) để ghim chất lượng — 23 là mặc định web tốt, 18 là lossless thị giác và làm file gấp ba, 28 là chỗ artifact lộ ra; dùng <code>-preset</code> để đổi CPU lấy byte ở chất lượng cố định đó, với điểm gãy ở <code>fast</code>/<code>medium</code> và <code>veryfast</code> là lựa chọn đúng cho hàng đợi hướng người dùng; luôn kèm <code>-pix_fmt yuv420p</code> (không thì màn hình đen trên Safari) và <code>-movflags +faststart</code> (không thì browser đệm cả file trước khi phát); scale bằng <code>-2</code> chứ không phải <code>-1</code> để giữ kích thước chẵn; và dò bằng <code>ffprobe</code> trước, vì một nguồn đã là H.264+AAC chỉ cần một lần stream copy 2 giây không mất chất lượng thay vì một lần re-encode 400 giây.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">FFmpeg — H.264 encoding guide</span><span class="lc-sub">trac.ffmpeg.org/wiki/Encode/H.264 — giải thích CRF, preset, tune, và profile.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">FFmpeg — scale filter</span><span class="lc-sub">ffmpeg.org/ffmpeg-filters.html#scale — hành vi làm tròn -1 vs -2.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Apple — HLS authoring specification</span><span class="lc-sub">developer.apple.com/documentation/http-live-streaming — vì sao yuv420p và faststart là không thương lượng trên thiết bị Apple.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">FFmpeg — ffprobe</span><span class="lc-sub">ffmpeg.org/ffprobe.html — đọc codec, kích thước, và pix_fmt trước khi quyết định re-encode.</span></span></div>
</div>
`,
    },

    {
      title: '3.4 — Chapter 3 quiz|||3.4 — Kiểm tra Chương 3',
      slug: 'mp-3-4-quiz',
      type: 'QUIZ',
      description: 'Bốn câu về exec/execFile, tua, và transcode.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 3 · Quiz</span><h2>What Chapter 3 established</h2></div><div class="ml-vi"><span class="eyebrow">Chương 3 · Kiểm tra</span><h2>Chương 3 đã dựng được gì</h2></div>`,
      quiz: {
        timeLimitSeconds: 400,
        questions: [
          {
            question: 'Your code builds an ffmpeg command string with the upload filename in the path and runs it via <code>exec()</code>. The path is wrapped in double quotes. Is that safe?|||Code của bạn dựng chuỗi lệnh ffmpeg với tên file upload trong đường dẫn và chạy qua <code>exec()</code>. Đường dẫn được bọc trong nháy kép. Có an toàn không?',
            options: [
              'No — the attacker supplies a quote of their own. A slash-free name like <code>clip.mp4";touch PROOF;#</code> survives path.extname(), closes the quoted argument, runs an arbitrary command, and comments out the rest. Quoting only solves spaces. Use execFile/spawn with an argv array so no shell exists.|||Không — kẻ tấn công cung cấp dấu nháy của riêng họ. Một tên không có dấu gạch chéo như <code>clip.mp4";touch PROOF;#</code> sống sót qua path.extname(), đóng tham số có nháy, chạy một lệnh tuỳ ý, và comment phần còn lại. Đặt nháy chỉ giải quyết khoảng trắng. Dùng execFile/spawn với mảng argv để không tồn tại shell.',
              'Yes — the double quotes contain the filename safely|||Có — nháy kép chứa tên file một cách an toàn',
              'Yes, as long as you also validate the MIME type is video/*|||Có, miễn là bạn cũng kiểm MIME type là video/*',
              'Yes, because path.join() normalizes the path|||Có, vì path.join() chuẩn hoá đường dẫn',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Extracting a frame at the 11-minute mark of a long video takes 38 seconds. What is wrong?|||Trích một frame ở mốc 11 phút của một video dài mất 38 giây. Sai ở đâu?',
            options: [
              '<code>-ss</code> is placed after <code>-i</code>, so FFmpeg decodes every frame from zero and discards them until the timestamp (output seeking, linear in offset). Move it before <code>-i</code> to seek the container index instead — measured 0.12 s, a 318× speedup. Cost: you land on the nearest keyframe, which is fine for a thumbnail.|||<code>-ss</code> đặt sau <code>-i</code>, nên FFmpeg decode mọi frame từ số không và vứt bỏ tới mốc thời gian (output seeking, tuyến tính theo độ lệch). Chuyển nó ra trước <code>-i</code> để tua theo chỉ mục container — đo được 0,12 s, nhanh hơn 318×. Cái giá: bạn rơi vào keyframe gần nhất, vốn ổn với thumbnail.',
              'The video needs to be re-encoded first|||Video cần được re-encode trước',
              'The timeout is too low — raise it|||Timeout quá thấp — hãy nâng lên',
              'FFmpeg cannot seek in H.264 — use a different codec|||FFmpeg không tua được trong H.264 — dùng codec khác',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'Your transcoded MP4 plays in Chrome and VLC but shows a black screen on every iPhone. Most likely cause?|||MP4 đã transcode của bạn phát được trong Chrome và VLC nhưng hiện màn hình đen trên mọi iPhone. Nguyên nhân khả dĩ nhất?',
            options: [
              'Missing <code>-pix_fmt yuv420p</code>. The source was yuv422p/yuv444p and libx264 encoded it as-is; Safari and QuickTime only decode 4:2:0 chroma in H.264. It reproduces only on Apple hardware, so it survives review. Add it to the baseline recipe alongside <code>-movflags +faststart</code>.|||Thiếu <code>-pix_fmt yuv420p</code>. Nguồn là yuv422p/yuv444p và libx264 encode nguyên trạng; Safari và QuickTime chỉ giải mã chroma 4:2:0 trong H.264. Nó chỉ tái hiện trên phần cứng Apple, nên nó sống sót qua review. Thêm nó vào công thức nền cùng với <code>-movflags +faststart</code>.',
              'The CRF is too high — lower it to 18|||CRF quá cao — hạ xuống 18',
              'iPhones cannot play H.264 — use HEVC|||iPhone không phát được H.264 — dùng HEVC',
              'The audio codec must be MP3, not AAC|||Codec audio phải là MP3, không phải AAC',
            ],
            correctIndex: 0, points: 1,
          },
          {
            question: 'A user uploads a 486 MB MP4 that is already H.264 + AAC but starts playing only after a 40-second wait. Cheapest fix?|||Người dùng upload một MP4 486 MB vốn đã là H.264 + AAC nhưng chỉ bắt đầu phát sau 40 giây chờ. Cách vá rẻ nhất?',
            options: [
              'Stream copy with faststart: <code>-c copy -movflags +faststart</code>. The moov index was at the end of the file so browsers buffered to find it; moving it to the front is a container remux, not a re-encode — measured 2.1 s and lossless, versus 418 s for a full re-encode that would also degrade quality.|||Stream copy kèm faststart: <code>-c copy -movflags +faststart</code>. Chỉ mục moov nằm ở cuối file nên browser đệm để tìm nó; dời nó ra đầu là một lần remux container, không phải re-encode — đo được 2,1 s và không mất chất lượng, so với 418 s cho một lần re-encode đầy đủ vốn còn làm giảm chất lượng.',
              'Re-encode at a lower CRF so the file is smaller|||Re-encode ở CRF thấp hơn để file nhỏ hơn',
              'Nothing can be done — 486 MB is simply too large|||Không làm gì được — 486 MB đơn giản là quá lớn',
              'Switch the container to WebM|||Đổi container sang WebM',
            ],
            correctIndex: 0, points: 1,
          },
        ],
      },
    },
  ],
};
