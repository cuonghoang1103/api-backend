/**
 * Observability — Chương 2 — Đường ống log: từ stdout tới nơi hỏi được.
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${; < > → &lt; &gt;.
 */
const REF = '?ref=%2Fcourses%2Fobservability-monitoring%2Flearn&reflabel=Observability';

export default {
  title: 'Chapter 2 — The log pipeline: from stdout to something you can query|||Chương 2 — Đường ống log: từ stdout tới nơi hỏi được',
  slug: 'obs-ch2-duong-ong',
  description: 'Docker bắt log thế nào, xoay vòng hay đĩa đầy, trình thu log, LogQL, và bài toán lưu trữ.',
  sortOrder: 3,
  lessons: [
    {
      title: '2.1 — What Docker does with your log line|||2.1 — Docker làm gì với dòng log của bạn',
      slug: 'obs-2-1-docker-bat-log',
      type: 'VIDEO',
      description: 'Trình json-file, phong bì JSON bọc ngoài JSON của bạn, và hệ số phình 1,62× đo thật.',
      isFreePreview: true,
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>What Docker does with your log line</h2>
<p class="lead">Chapter 1 ended at the moment your line leaves the process. This chapter follows it the rest of the way. The first hop is the one almost nobody looks at, and it is the one that decides how much disk your logs eat.</p>

<h3>The path, in full</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Your process writes to fd 1</span><span class="lz-d">A pipe, always, in a container — established by measurement in lesson 1.5.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">containerd reads the pipe</span><span class="lz-d">A reader per container, tagging each chunk with which stream it came from (stdout or stderr) and a nanosecond timestamp.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The logging driver serialises it</span><span class="lz-d">Default driver is <code>json-file</code>. It wraps your line in another JSON object. This is the step that costs you.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">It lands on disk</span><span class="lz-d"><code>/var/lib/docker/containers/&lt;id&gt;/&lt;id&gt;-json.log</code> — on this VPS, the same filesystem that holds Postgres.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t"><code>docker logs</code> reads that file back</span><span class="lz-d">It is not a live tap on your process. It is <code>cat</code> with a filter. Which is why <code>docker logs</code> shows nothing after someone truncates the file.</span></div>
</div>

<h3>Look at the envelope</h3>
<p>Your logger emits one JSON object. Docker writes a different JSON object, with yours inside it as a <em>string</em>:</p>
<pre><code class="language-javascript">// what src/utils/logger.ts emits
{"ts":"2026-08-25T10:00:00.000Z","level":"info","msg":"request completed","method":"GET","route":"/api/v1/notes","status":200,"ms":42,"userId":"u_8f3a2b1c"}

// what actually lands in &lt;id&gt;-json.log
{"log":"{\\"ts\\":\\"2026-08-25T10:00:00.000Z\\",\\"level\\":\\"info\\",\\"msg\\":\\"request completed\\",\\"method\\":\\"GET\\",\\"route\\":\\"/api/v1/notes\\",\\"status\\":200,\\"ms\\":42,\\"userId\\":\\"u_8f3a2b1c\\"}\\n","stream":"stdout","time":"2026-08-25T10:00:00.123456789Z"}
</code></pre>
<p>Every quote in your object became <code>\\"</code>. That is one extra byte per quote, and a structured log line is mostly quotes.</p>

<h3>Measurement: how much the envelope costs</h3>
<pre><code class="language-javascript">// m8.mjs
const app = JSON.stringify({ ts:'2026-08-25T10:00:00.000Z', level:'info', msg:'request completed',
  method:'GET', route:'/api/v1/notes', status:200, ms:42, userId:'u_8f3a2b1c' });
const wrapped = JSON.stringify({ log: app + '\\n', stream: 'stdout', time: '2026-08-25T10:00:00.123456789Z' });
console.log(Buffer.byteLength(app) + 1, Buffer.byteLength(wrapped) + 1);
</code></pre>
<div class="out">dòng ứng dụng của bạn         157 byte
sau khi Docker bọc lại        255 byte
hệ số phình                   1.62×
dấu ngoặc kép bị escape        28 lần (mỗi lần +1 byte)</div>
<p><strong>1.62×.</strong> Every disk estimate you make from the size of your own log line is off by 62% before anything else happens. Here is what that does at realistic traffic:</p>
<div class="out">$ node m8.mjs
 50 rps ×  1 dòng/req =    4.3 triệu dòng/ngày  →  thô   0.63 GB  ·  sau bọc   1.03 GB/ngày
 50 rps ×  5 dòng/req =   21.6 triệu dòng/ngày  →  thô   3.16 GB  ·  sau bọc   5.13 GB/ngày
 50 rps × 20 dòng/req =   86.4 triệu dòng/ngày  →  thô  12.63 GB  ·  sau bọc  20.52 GB/ngày
200 rps ×  5 dòng/req =   86.4 triệu dòng/ngày  →  thô  12.63 GB  ·  sau bọc  20.52 GB/ngày
500 rps × 20 dòng/req =  864.0 triệu dòng/ngày  →  thô 126.33 GB  ·  sau bọc 205.19 GB/ngày</div>
<p>Read the second row against a 6 GB VPS disk that also holds Postgres. Fifty requests per second — modest — with five log lines each fills that disk in a bit over a day. Not eventually. In a day.</p>

<h3>Why <code>docker logs</code> is not a debugging tool</h3>
<pre><code>docker logs &lt;container&gt;
    │
    └─▶ opens /var/lib/docker/containers/&lt;id&gt;/&lt;id&gt;-json.log
        reads it, unwraps the "log" field, prints it

Consequences that surprise people:

  · --since / --until filter on Docker's "time" field, not on
    your "ts". Under a backlog those differ by seconds.
  · Rotation is invisible here: docker logs reads the current
    file plus rotated siblings, but a TRUNCATED file is simply
    gone. No error, just a shorter history.
  · There is no search. grep over docker logs is a full scan of
    every byte since the last rotation.
  · Restarting the container does not clear it; RECREATING it
    does — a new container id is a new, empty file.</code></pre>
<p>The last one is the one that catches people during an incident: you redeploy to try a fix, and the log explaining the original failure is now attached to a container that no longer exists. That is the whole argument for a shipper, which lesson 2.3 covers.</p>

<h3>The other drivers, and why the default wins anyway</h3>
<pre><code>json-file   default. Writes the file above. Supports rotation.
            docker logs works. → this is the right choice.

local       Docker's own binary format. Smaller and faster,
            rotation on by default. But NOTHING else reads it,
            so a shipper cannot tail it. Rarely worth it.

syslog      Forwards to a syslog daemon. docker logs STOPS
            WORKING — the file is never written. Surprising
            at 2am.

none        Discards. Reasonable for a chatty sidecar, and a
            trap everywhere else for the same reason.</code></pre>
<p>Stay on <code>json-file</code>. The file it produces is the thing every shipper knows how to read, and <code>docker logs</code> stays available as a fallback when the shipper is the thing that broke. The problem with the default is not the driver — it is that the default has no size limit, which is lesson 2.2.</p>

<div class="pitfall">
<p><strong>Trap — stderr is not an error level.</strong> Docker's <code>stream</code> field records which file descriptor a line came from, and <code>src/utils/logger.ts</code> sends <code>warn</code> and <code>error</code> to fd 2 and everything else to fd 1. So <code>stream:"stderr"</code> correlates with severity here, by accident, and only here. Plenty of well-behaved programs write ordinary progress to stderr — <code>npm</code>, <code>ffmpeg</code> and <code>prisma migrate</code> all do. If you build alerting on <code>stream == "stderr"</code>, the first FFmpeg job in this repo's media pipeline will page you at 3am about a video that encoded perfectly. <strong>Alert on your own <code>level</code> field, which you control, never on the stream Docker happened to observe.</strong></p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://docs.docker.com/engine/logging/drivers/json-file/" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Docker — the json-file logging driver</span><span class="lc-sub">The exact envelope format, every option it takes, and the rotation settings lesson 2.2 turns on.</span></span>
</a>
<a class="link-card dl" href="https://docs.docker.com/engine/logging/configure/" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">Docker — configuring logging drivers</span><span class="lc-sub">Per-daemon vs per-container configuration, and the table of which drivers keep &#96;docker logs&#96; working.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Docker làm gì với dòng log của bạn</h2>
<p class="lead">Chương 1 dừng lại đúng lúc dòng log rời khỏi tiến trình. Chương này đi nốt quãng còn lại. Chặng đầu tiên là chặng gần như không ai nhìn, và nó chính là chặng quyết định log của bạn ngốn bao nhiêu đĩa.</p>

<h3>Trọn con đường</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Tiến trình của bạn ghi vào fd 1</span><span class="lz-d">Luôn là một cái ống, trong container — đã chứng minh bằng phép đo ở bài 1.5.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">containerd đọc cái ống</span><span class="lz-d">Mỗi container một bên đọc, gắn nhãn cho từng mẩu là nó đến từ luồng nào (stdout hay stderr) kèm dấu thời gian nano giây.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Trình ghi log tuần tự hoá nó</span><span class="lz-d">Trình mặc định là <code>json-file</code>. Nó bọc dòng của bạn vào một đối tượng JSON khác. Đây là bước làm bạn tốn tiền.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Nó rơi xuống đĩa</span><span class="lz-d"><code>/var/lib/docker/containers/&lt;id&gt;/&lt;id&gt;-json.log</code> — trên VPS này là đúng cái hệ thống tệp đang chứa Postgres.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t"><code>docker logs</code> đọc ngược cái file đó</span><span class="lz-d">Nó không phải một cái vòi cắm thẳng vào tiến trình. Nó là <code>cat</code> có lọc. Đó là lý do <code>docker logs</code> chẳng thấy gì sau khi ai đó cắt cụt cái file.</span></div>
</div>

<h3>Nhìn cái phong bì</h3>
<p>Logger của bạn phát ra một đối tượng JSON. Docker ghi xuống một đối tượng JSON khác, với cái của bạn nằm bên trong dưới dạng <em>chuỗi</em>:</p>
<pre><code class="language-javascript">// thứ src/utils/logger.ts phát ra
{"ts":"2026-08-25T10:00:00.000Z","level":"info","msg":"request completed","method":"GET","route":"/api/v1/notes","status":200,"ms":42,"userId":"u_8f3a2b1c"}

// thứ thật sự rơi vào &lt;id&gt;-json.log
{"log":"{\\"ts\\":\\"2026-08-25T10:00:00.000Z\\",\\"level\\":\\"info\\",\\"msg\\":\\"request completed\\",\\"method\\":\\"GET\\",\\"route\\":\\"/api/v1/notes\\",\\"status\\":200,\\"ms\\":42,\\"userId\\":\\"u_8f3a2b1c\\"}\\n","stream":"stdout","time":"2026-08-25T10:00:00.123456789Z"}
</code></pre>
<p>Mọi dấu ngoặc kép trong đối tượng của bạn đã thành <code>\\"</code>. Đó là thêm một byte cho mỗi dấu ngoặc, mà một dòng log có cấu trúc thì phần lớn là dấu ngoặc.</p>

<h3>Phép đo: cái phong bì tốn bao nhiêu</h3>
<pre><code class="language-javascript">// m8.mjs
const app = JSON.stringify({ ts:'2026-08-25T10:00:00.000Z', level:'info', msg:'request completed',
  method:'GET', route:'/api/v1/notes', status:200, ms:42, userId:'u_8f3a2b1c' });
const wrapped = JSON.stringify({ log: app + '\\n', stream: 'stdout', time: '2026-08-25T10:00:00.123456789Z' });
console.log(Buffer.byteLength(app) + 1, Buffer.byteLength(wrapped) + 1);
</code></pre>
<div class="out">dòng ứng dụng của bạn         157 byte
sau khi Docker bọc lại        255 byte
hệ số phình                   1.62×
dấu ngoặc kép bị escape        28 lần (mỗi lần +1 byte)</div>
<p><strong>1,62×.</strong> Mọi ước lượng đĩa bạn tính từ kích thước dòng log của chính mình đều lệch 62% trước khi có bất cứ chuyện gì khác xảy ra. Đây là hệ quả ở mức lưu lượng thực tế:</p>
<div class="out">$ node m8.mjs
 50 rps ×  1 dòng/req =    4.3 triệu dòng/ngày  →  thô   0.63 GB  ·  sau bọc   1.03 GB/ngày
 50 rps ×  5 dòng/req =   21.6 triệu dòng/ngày  →  thô   3.16 GB  ·  sau bọc   5.13 GB/ngày
 50 rps × 20 dòng/req =   86.4 triệu dòng/ngày  →  thô  12.63 GB  ·  sau bọc  20.52 GB/ngày
200 rps ×  5 dòng/req =   86.4 triệu dòng/ngày  →  thô  12.63 GB  ·  sau bọc  20.52 GB/ngày
500 rps × 20 dòng/req =  864.0 triệu dòng/ngày  →  thô 126.33 GB  ·  sau bọc 205.19 GB/ngày</div>
<p>Hãy đọc hàng thứ hai bên cạnh một cái đĩa VPS 6 GB đang đồng thời chứa Postgres. Năm mươi request mỗi giây — mức khiêm tốn — với năm dòng log mỗi cái sẽ lấp đầy cái đĩa đó trong hơn một ngày. Không phải &quot;rồi sẽ&quot;. Trong một ngày.</p>

<h3>Vì sao <code>docker logs</code> không phải công cụ gỡ lỗi</h3>
<pre><code>docker logs &lt;container&gt;
    │
    └─▶ mở /var/lib/docker/containers/&lt;id&gt;/&lt;id&gt;-json.log
        đọc, bóc trường "log" ra, in lên

Những hệ quả làm người ta bất ngờ:

  · --since / --until lọc theo trường "time" của Docker, KHÔNG
    theo "ts" của bạn. Lúc có tồn đọng, hai cái lệch nhau vài giây.
  · Việc xoay vòng vô hình ở đây: docker logs đọc file hiện tại
    cộng các file anh em đã xoay, nhưng một file bị CẮT CỤT thì
    mất hẳn. Không lỗi, chỉ là lịch sử ngắn đi.
  · Không có tìm kiếm. grep qua docker logs là quét toàn bộ số
    byte kể từ lần xoay vòng gần nhất.
  · Khởi động lại container KHÔNG xoá nó; TẠO LẠI container thì có
    — id container mới là một file mới, rỗng.</code></pre>
<p>Cái cuối cùng mới là cái tóm người ta giữa lúc sự cố: bạn deploy lại để thử một cách chữa, và cái log giải thích cú hỏng ban đầu giờ đang gắn với một container không còn tồn tại. Đó chính là toàn bộ lý lẽ cho một trình thu log, thứ bài 2.3 nói tới.</p>

<h3>Mấy trình khác, và vì sao mặc định vẫn thắng</h3>
<pre><code>json-file   mặc định. Ghi cái file ở trên. Có hỗ trợ xoay vòng.
            docker logs chạy được. → đây là lựa chọn đúng.

local       Định dạng nhị phân riêng của Docker. Nhỏ hơn và nhanh
            hơn, xoay vòng bật sẵn. Nhưng KHÔNG CÓ GÌ KHÁC đọc
            được, nên trình thu log không tail được. Hiếm khi đáng.

syslog      Chuyển tiếp sang một daemon syslog. docker logs NGỪNG
            CHẠY — file không bao giờ được ghi. Rất bất ngờ vào
            lúc 2 giờ sáng.

none        Vứt bỏ. Hợp lý cho một sidecar lắm mồm, và là cái bẫy
            ở mọi chỗ khác vì đúng lý do đó.</code></pre>
<p>Cứ ở lại với <code>json-file</code>. Cái file nó tạo ra là thứ mọi trình thu log đều biết đọc, và <code>docker logs</code> vẫn còn đó làm đường lùi khi chính trình thu log là thứ bị hỏng. Vấn đề của mặc định không nằm ở trình ghi — nó nằm ở chỗ mặc định KHÔNG có giới hạn kích thước, và đó là bài 2.2.</p>

<div class="pitfall">
<p><strong>Bẫy — stderr không phải là một mức log.</strong> Trường <code>stream</code> của Docker ghi lại dòng log đến từ file descriptor nào, và <code>src/utils/logger.ts</code> gửi <code>warn</code> với <code>error</code> ra fd 2 còn mọi thứ khác ra fd 1. Vậy nên <code>stream:"stderr"</code> ở đây tương quan với mức nghiêm trọng, một cách tình cờ, và chỉ ở đây thôi. Đầy chương trình đàng hoàng vẫn ghi tiến độ bình thường ra stderr — <code>npm</code>, <code>ffmpeg</code> và <code>prisma migrate</code> đều thế. Nếu bạn dựng cảnh báo trên <code>stream == "stderr"</code>, việc FFmpeg đầu tiên trong đường ống media của kho này sẽ gọi bạn dậy lúc 3 giờ sáng vì một video mã hoá hoàn hảo. <strong>Hãy cảnh báo theo trường <code>level</code> của chính bạn, thứ bạn kiểm soát, đừng bao giờ theo cái luồng mà Docker tình cờ quan sát được.</strong></p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://docs.docker.com/engine/logging/drivers/json-file/" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Docker — trình ghi log json-file</span><span class="lc-sub">Định dạng phong bì chính xác, mọi tuỳ chọn nó nhận, và các thiết lập xoay vòng mà bài 2.2 sẽ bật lên.</span></span>
</a>
<a class="link-card dl" href="https://docs.docker.com/engine/logging/configure/" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">Docker — cấu hình trình ghi log</span><span class="lc-sub">Cấu hình theo daemon so với theo container, và bảng liệt kê trình nào giữ cho &#96;docker logs&#96; còn chạy.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '2.2 — Rotation, or a full disk|||2.2 — Xoay vòng, hoặc là đĩa đầy',
      slug: 'obs-2-2-xoay-vong',
      type: 'VIDEO',
      description: 'Kho này KHÔNG cấu hình xoay vòng — nó dùng một cron hằng tuần cắt cụt log. Vì sao đó là cách chữa sai chỗ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Rotation, or a full disk</h2>
<p class="lead">The <code>json-file</code> driver has no size limit unless you give it one. That sentence is the whole lesson. Everything below is what happens when nobody gives it one — and this repository is the worked example, because nobody did.</p>

<h3>What this repository actually configures</h3>
<pre><code class="language-bash">$ grep -n "logging:" docker-compose.yml docker-compose.ghcr.yml
# (no output)

$ grep -n "max-size\\|max-file" docker-compose.yml
# (no output)</code></pre>
<p>Seven services — <code>postgres</code>, <code>redis</code>, <code>backend</code>, <code>frontend</code>, <code>tts</code>, <code>coturn</code>, <code>nginx</code> — and not one <code>logging:</code> block between them. There is no <code>daemon.json</code> in the repo either. So every container on this VPS writes an unbounded <code>-json.log</code> onto the filesystem that also holds the Postgres data directory.</p>
<p>That is not a bug someone left behind. It is the Docker default, and it is the default everywhere, which is exactly why it is worth a whole lesson.</p>

<h3>The compensating mechanism, and its three weaknesses</h3>
<p>The repo is not naive about this. <code>.github/workflows/vps-cleanup-weekly.yml</code> has a step that handles it:</p>
<pre><code class="language-bash">- name: Truncate container logs &gt; 200MB
  run: |
    ssh vps "docker ps --format '{{.Names}}' | while read c; do
      log=\\$(docker inspect --format='{{.LogPath}}' \\$c 2&gt;/dev/null)
      size_mb=\\$(du -m \\"\\$log\\" | cut -f1)
      if [ \\"\\$size_mb\\" -gt 200 ]; then
        sudo truncate -s 0 \\"\\$log\\"
      fi
    done"</code></pre>
<p>It works. It has kept the disk alive. And it is still the wrong shape of fix, for three reasons that are worth naming precisely:</p>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Weakness 1</span><span class="lz-t">It runs weekly. Logs fill hourly.</span><span class="lz-d">Cron is <code>0 3 * * 0</code> — Sunday. At the 5.13 GB/day of lesson 2.1's second row, the disk is gone by Tuesday and the cleanup arrives five days late.</span></div>
  <div class="lz-node"><span class="lz-k">Weakness 2</span><span class="lz-t">200 MB × 7 containers = 1.4 GB of headroom</span><span class="lz-d">The threshold is per container. Seven containers can each sit at 199 MB and the job does nothing, on a disk where 1.4 GB is a large fraction of what is free.</span></div>
  <div class="lz-node"><span class="lz-k">Weakness 3</span><span class="lz-t"><code>truncate -s 0</code> destroys, it does not rotate</span><span class="lz-d">The log that grew to 200 MB is the log most likely to explain why. It is deleted whole. Rotation keeps the last N files; truncation keeps nothing.</span></div>
</div>

<h3>What rotation does instead</h3>
<pre><code>truncate -s 0                      max-size + max-file
───────────────                    ───────────────────
app.log  201 MB  ─▶  0 MB          app.log      50 MB ─┐
                                   app.log.1    50 MB  ├ 150 MB, hard cap
history: GONE                      app.log.2    50 MB ─┘

runs: weekly                       runs: continuously, by the daemon
worst case before it acts:         worst case: 150 MB. Always.
  7 × 200 MB = 1.4 GB
  plus a week of growth            history kept: the last 150 MB</code></pre>
<p>Rotation is not a cleanup job. It is a ceiling. The daemon enforces it at write time, so the disk usage of logging becomes a number you choose in advance rather than a number you discover.</p>

<h3>The fix, in the file where it belongs</h3>
<pre><code class="language-yaml"># docker-compose.yml — on EACH service
services:
  backend:
    logging:
      driver: json-file
      options:
        max-size: "50m"      # rotate at 50 MB
        max-file: "3"        # keep 3 → 150 MB ceiling per container
        compress: "true"     # gzip the rotated ones (lesson 2.5: ~12.8×)
</code></pre>
<p>Repeat that per service, or set it once for the whole daemon so that any container — including ones started outside compose — inherits it:</p>
<pre><code class="language-json">// /etc/docker/daemon.json  — then: systemctl restart docker
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "50m", "max-file": "3", "compress": "true" }
}</code></pre>
<p>Seven services at a 150 MB ceiling is 1.05 GB, worst case, forever. Compare that to &quot;unbounded, checked on Sundays&quot;.</p>

<h3>Two things the daemon-wide setting will not do</h3>
<pre><code>1. It does NOT apply retroactively.
   Existing containers keep the driver options they were
   created with. Only a recreate picks up the new default:

   $ docker inspect -f '{{.HostConfig.LogConfig}}' cuonghoangdev_backend
   {json-file map[]}          ← empty map = no limit, still

   After: docker compose -p cuonghoangdev up -d backend
   {json-file map[max-file:3 max-size:50m]}

2. It does NOT shrink the file that is already 4 GB.
   Rotation triggers on the next write crossing the threshold,
   and it renames rather than shrinks. Delete the old one by
   recreating the container, which is the only safe way — see
   the pitfall below.</code></pre>

<h3>Choosing the numbers honestly</h3>
<pre><code>How long do you need to be able to look back with
&#96;docker logs&#96; alone, before the shipper takes over?

  · If a shipper is running (chapter 2.3), you need
    minutes, not days. 20m × 2 is plenty — it is only a
    buffer against the shipper being down.

  · If there is NO shipper, docker logs IS your history.
    50m × 3 at 5 GB/day of traffic buys you ~43 minutes.
    That is the real argument for a shipper: no rotation
    setting can give you both a bounded disk and a week
    of history on the same machine.</code></pre>

<div class="pitfall">
<p><strong>Trap — never <code>rm</code> a container log file while the container is running.</strong> The daemon holds an open file descriptor to it. Deleting the directory entry does not free the space: the inode stays allocated until the last descriptor closes, so <code>df</code> still shows the disk full while <code>du</code> shows the file gone — the single most confusing state to debug under pressure, because the two tools flatly contradict each other. <code>truncate -s 0</code>, which the weekly job uses, is correct precisely because it keeps the descriptor valid and frees the blocks immediately. If you have already done the <code>rm</code>, the space comes back when the container is recreated (not restarted — recreated), or you can confirm the diagnosis first with <code>lsof +L1 | grep deleted</code>, which lists exactly the files in this state.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://docs.docker.com/engine/daemon/#configure-the-docker-daemon" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Docker — configuring the daemon (daemon.json)</span><span class="lc-sub">Where the machine-wide default lives, and the exact restart semantics for picking up a change.</span></span>
</a>
<a class="link-card dl" href="https://www.man7.org/linux/man-pages/man8/logrotate.8.html" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">logrotate(8)</span><span class="lc-sub">The system tool for everything Docker is not rotating — nginx access logs, postgres logs — and the copytruncate option that solves the same open-descriptor problem as the pitfall above.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Xoay vòng, hoặc là đĩa đầy</h2>
<p class="lead">Trình <code>json-file</code> không có giới hạn kích thước trừ khi bạn đặt cho nó một cái. Câu đó là toàn bộ bài học. Mọi thứ bên dưới là chuyện xảy ra khi không ai đặt — và kho này chính là ví dụ đã làm sẵn, vì không ai đặt cả.</p>

<h3>Kho này thật sự cấu hình những gì</h3>
<pre><code class="language-bash">$ grep -n "logging:" docker-compose.yml docker-compose.ghcr.yml
# (không có kết quả)

$ grep -n "max-size\\|max-file" docker-compose.yml
# (không có kết quả)</code></pre>
<p>Bảy dịch vụ — <code>postgres</code>, <code>redis</code>, <code>backend</code>, <code>frontend</code>, <code>tts</code>, <code>coturn</code>, <code>nginx</code> — và không một khối <code>logging:</code> nào giữa chúng. Trong kho cũng không có <code>daemon.json</code>. Vậy nên mọi container trên VPS này đều ghi một file <code>-json.log</code> không giới hạn xuống đúng cái hệ thống tệp đang chứa thư mục dữ liệu của Postgres.</p>
<p>Đó không phải một lỗi ai đó bỏ quên. Nó là mặc định của Docker, và là mặc định ở khắp nơi, mà đó lại chính là lý do nó đáng cả một bài.</p>

<h3>Cơ chế bù lại, và ba điểm yếu của nó</h3>
<p>Kho này không ngây thơ về chuyện đó. <code>.github/workflows/vps-cleanup-weekly.yml</code> có một bước xử lý nó:</p>
<pre><code class="language-bash">- name: Truncate container logs &gt; 200MB
  run: |
    ssh vps "docker ps --format '{{.Names}}' | while read c; do
      log=\\$(docker inspect --format='{{.LogPath}}' \\$c 2&gt;/dev/null)
      size_mb=\\$(du -m \\"\\$log\\" | cut -f1)
      if [ \\"\\$size_mb\\" -gt 200 ]; then
        sudo truncate -s 0 \\"\\$log\\"
      fi
    done"</code></pre>
<p>Nó chạy được. Nó đã giữ cho cái đĩa còn sống. Và nó vẫn là cách chữa sai hình dạng, vì ba lý do đáng gọi tên cho chính xác:</p>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Yếu điểm 1</span><span class="lz-t">Nó chạy hằng tuần. Log đầy theo giờ.</span><span class="lz-d">Cron là <code>0 3 * * 0</code> — Chủ nhật. Ở mức 5,13 GB/ngày của hàng thứ hai bài 2.1, cái đĩa hết chỗ từ thứ Ba và việc dọn dẹp tới muộn năm ngày.</span></div>
  <div class="lz-node"><span class="lz-k">Yếu điểm 2</span><span class="lz-t">200 MB × 7 container = 1,4 GB chỗ trống bị chiếm</span><span class="lz-d">Ngưỡng tính theo từng container. Bảy container có thể mỗi cái nằm ở 199 MB và job chẳng làm gì, trên một cái đĩa mà 1,4 GB là một phần lớn của chỗ còn trống.</span></div>
  <div class="lz-node"><span class="lz-k">Yếu điểm 3</span><span class="lz-t"><code>truncate -s 0</code> huỷ diệt, nó không xoay vòng</span><span class="lz-d">Cái log phình lên 200 MB chính là cái log nhiều khả năng giải thích được vì sao. Nó bị xoá trọn. Xoay vòng giữ lại N file cuối; cắt cụt không giữ gì.</span></div>
</div>

<h3>Xoay vòng làm gì thay vào đó</h3>
<pre><code>truncate -s 0                      max-size + max-file
───────────────                    ───────────────────
app.log  201 MB  ─▶  0 MB          app.log      50 MB ─┐
                                   app.log.1    50 MB  ├ 150 MB, trần cứng
lịch sử: MẤT                       app.log.2    50 MB ─┘

chạy: hằng tuần                    chạy: liên tục, do daemon làm
tệ nhất trước khi nó ra tay:       tệ nhất: 150 MB. Luôn luôn.
  7 × 200 MB = 1,4 GB
  cộng một tuần phình thêm         lịch sử giữ được: 150 MB gần nhất</code></pre>
<p>Xoay vòng không phải một việc dọn dẹp. Nó là một cái trần. Daemon áp nó ngay lúc ghi, nên lượng đĩa mà việc log tiêu tốn trở thành một con số bạn chọn trước, thay vì một con số bạn phát hiện ra.</p>

<h3>Cách chữa, đặt vào đúng file của nó</h3>
<pre><code class="language-yaml"># docker-compose.yml — cho TỪNG dịch vụ
services:
  backend:
    logging:
      driver: json-file
      options:
        max-size: "50m"      # xoay vòng ở mốc 50 MB
        max-file: "3"        # giữ 3 → trần 150 MB mỗi container
        compress: "true"     # gzip mấy file đã xoay (bài 2.5: ~12,8×)
</code></pre>
<p>Lặp lại cho mỗi dịch vụ, hoặc đặt một lần cho cả daemon để mọi container — kể cả những cái khởi động ngoài compose — đều thừa hưởng:</p>
<pre><code class="language-json">// /etc/docker/daemon.json  — rồi: systemctl restart docker
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "50m", "max-file": "3", "compress": "true" }
}</code></pre>
<p>Bảy dịch vụ với trần 150 MB là 1,05 GB, ở trường hợp tệ nhất, mãi mãi. So cái đó với &quot;không giới hạn, kiểm vào Chủ nhật&quot;.</p>

<h3>Hai điều thiết lập cấp daemon sẽ KHÔNG làm</h3>
<pre><code>1. Nó KHÔNG áp dụng ngược lại.
   Container đang tồn tại giữ nguyên tuỳ chọn trình ghi mà nó
   được tạo ra cùng. Chỉ khi tạo lại thì mới nhận mặc định mới:

   $ docker inspect -f '{{.HostConfig.LogConfig}}' cuonghoangdev_backend
   {json-file map[]}          ← map rỗng = vẫn không giới hạn

   Sau khi: docker compose -p cuonghoangdev up -d backend
   {json-file map[max-file:3 max-size:50m]}

2. Nó KHÔNG làm nhỏ lại cái file đang 4 GB.
   Xoay vòng kích hoạt ở lần ghi kế tiếp vượt ngưỡng, và nó đổi
   tên chứ không thu nhỏ. Muốn xoá cái cũ thì tạo lại container,
   đó là cách an toàn duy nhất — xem cái bẫy bên dưới.</code></pre>

<h3>Chọn con số cho trung thực</h3>
<pre><code>Bạn cần nhìn ngược lại bao lâu chỉ bằng &#96;docker logs&#96; thôi,
trước khi trình thu log tiếp quản?

  · Nếu có một trình thu log đang chạy (bài 2.3), bạn cần vài
    PHÚT, không phải vài ngày. 20m × 2 là thừa — nó chỉ là một
    lớp đệm phòng khi trình thu log chết.

  · Nếu KHÔNG có trình thu log, docker logs CHÍNH LÀ lịch sử của
    bạn. 50m × 3 ở mức lưu lượng 5 GB/ngày mua cho bạn ~43 phút.
    Đó mới là lý lẽ thật cho một trình thu log: không thiết lập
    xoay vòng nào cho bạn được đồng thời một cái đĩa có trần VÀ
    một tuần lịch sử trên cùng một cái máy.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — đừng bao giờ <code>rm</code> file log của một container đang chạy.</strong> Daemon đang giữ một file descriptor mở tới nó. Xoá mục trong thư mục KHÔNG giải phóng chỗ: inode vẫn được cấp phát cho tới khi descriptor cuối cùng đóng lại, nên <code>df</code> vẫn báo đĩa đầy trong khi <code>du</code> báo file đã biến mất — trạng thái khó hiểu bậc nhất khi phải gỡ dưới áp lực, vì hai công cụ nói ngược hẳn nhau. <code>truncate -s 0</code>, thứ job hằng tuần đang dùng, đúng chính vì nó giữ descriptor còn hợp lệ và giải phóng các khối ngay lập tức. Nếu bạn đã lỡ <code>rm</code> rồi, chỗ trống quay lại khi container được tạo lại (không phải khởi động lại — tạo lại), hoặc bạn có thể xác nhận chẩn đoán trước bằng <code>lsof +L1 | grep deleted</code>, lệnh liệt kê đúng những file đang ở trạng thái này.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://docs.docker.com/engine/daemon/#configure-the-docker-daemon" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Docker — cấu hình daemon (daemon.json)</span><span class="lc-sub">Nơi đặt mặc định cho cả máy, và ngữ nghĩa khởi động lại chính xác để một thay đổi có hiệu lực.</span></span>
</a>
<a class="link-card dl" href="https://www.man7.org/linux/man-pages/man8/logrotate.8.html" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">logrotate(8)</span><span class="lc-sub">Công cụ hệ thống cho mọi thứ Docker không xoay vòng — log truy cập nginx, log postgres — và tuỳ chọn copytruncate giải đúng bài toán descriptor mở của cái bẫy ở trên.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '2.3 — The shipper: getting logs off the machine|||2.3 — Trình thu log: đưa log rời khỏi cái máy',
      slug: 'obs-2-3-trinh-thu-log',
      type: 'VIDEO',
      description: 'Vì sao log phải rời khỏi VPS, ba lựa chọn trong LOG_PIPELINE.md, và giao kèo giao-ít-nhất-một-lần.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>The shipper: getting logs off the machine</h2>
<p class="lead">Lesson 2.2 ended on a trade-off you cannot win locally: a bounded disk and a week of history are incompatible on one VPS. A shipper is how you stop trying. It reads the rotating file and copies the lines somewhere that has room.</p>

<h3>Four reasons, and only one of them is &quot;disk&quot;</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Disk</span><span class="lz-t">You can rotate aggressively</span><span class="lz-d">Once lines are safely elsewhere, <code>max-size: 20m</code> is fine locally. The two constraints stop fighting.</span></div>
  <div class="lz-node"><span class="lz-k">Survival</span><span class="lz-t">The logs outlive the container</span><span class="lz-d">Recreating a container starts a new, empty file — lesson 2.1. A shipper has already copied the old one. This is the reason that actually bites during a deploy-to-fix.</span></div>
  <div class="lz-node"><span class="lz-k">Search</span><span class="lz-t">You get an index instead of a scan</span><span class="lz-d"><code>grep</code> over 4 GB of JSON is a full read. A log store answers &quot;errors on /api/v1/notes in the last hour&quot; from an index, in milliseconds.</span></div>
  <div class="lz-node"><span class="lz-k">Join</span><span class="lz-t">Every service in one query</span><span class="lz-d">nginx, backend, postgres and the TTS container are four separate files on disk and one queryable stream once shipped. Chapter 3 depends entirely on this.</span></div>
</div>

<h3>Two architectures, and the one this repo should pick</h3>
<pre><code>A. TAIL THE FILE  (what LOG_PIPELINE.md describes)

   your app ──▶ stdout ──▶ docker json-file ──▶ file on disk
                                                    │
                                     shipper tails ─┘──▶ store

   ✓ App knows nothing. No code change, no dependency.
   ✓ Shipper crash = lines wait on disk. Nothing lost.
   ✓ Backpressure lands on the DISK, not your heap (lesson 1.5).
   ✗ One extra hop of latency (seconds, which is fine).


B. PUSH FROM THE APP  (an HTTP transport in your logger)

   your app ──▶ HTTP POST ──▶ store

   ✓ Fewer moving parts on the VPS.
   ✗ Your app now owns retries, batching and buffering.
   ✗ When the store is slow, the queue is in YOUR heap —
     the exact failure measured in lesson 1.5, now with a
     network on the far end instead of a pipe.
   ✗ A log outage becomes an app outage.</code></pre>
<p>Architecture A, every time. The reason is lesson 1.5's measurement: the disk is a buffer with tens of gigabytes of room and an operating system managing it. Your heap is a buffer with a few hundred megabytes and an OOM killer.</p>

<h3>The three options in this repo's LOG_PIPELINE.md</h3>
<pre><code>Vector          single Go/Rust binary, no runtime deps.
(Option 2)      source = docker_logs, so it talks to the daemon
                directly and gets container labels for free.
                Sinks: Loki, S3, Elasticsearch, anything.
                → the pragmatic default for one VPS.

Promtail        the Loki-native shipper. Tails the json-log
(Option 3)      files by glob. Slightly simpler config, but only
                speaks Loki.
                → right if you already run Grafana.

Cloudflare      the doc is honest that this is awkward for
Logpush         APPLICATION logs — Logpush datasets are about
(Option 1)      the proxy's HTTP requests, not your stdout.
                → good for edge/CDN data, wrong tool here.</code></pre>
<p>The doc's own recommendation — &quot;for application logs specifically, the simpler path is Option 2 or 3&quot; — is correct, and worth noticing as a habit: a runbook that names when its own first option is the wrong one is a runbook you can trust.</p>

<h3>The Vector config, annotated</h3>
<pre><code class="language-toml"># /etc/vector/vector.toml
[sources.docker]
type = "docker_logs"                       # talks to the daemon socket
include_images = ["cuonghoangdev_backend"] # ⚠ see the pitfall below

[transforms.parse]
type = "remap"
inputs = ["docker"]
source = '''
  . = parse_json!(.message)                # ⚠ the ! means: DROP on failure
'''

[sinks.console]
type = "console"                           # swap for loki/s3/elasticsearch
inputs = ["parse"]
encoding.codec = "json"</code></pre>
<p>Two characters in that file decide whether it works in production. <code>parse_json!</code> with the bang aborts the event when the line is not valid JSON — and your container emits plenty of non-JSON: Node's startup banner, an unhandled stack trace, Prisma's migration output. All of it silently vanishes. The safe form keeps the line either way:</p>
<pre><code class="language-toml">source = '''
  parsed, err = parse_json(.message)       # no bang → returns an error
  if err == null {
    . = merge(., object!(parsed))
  } else {
    .unparsed = true                        # keep the raw line, flag it
  }
'''</code></pre>

<h3>The delivery contract you are actually buying</h3>
<pre><code>at-most-once     fire and forget. Cheap. Loses lines on any
                 failure. Never acceptable for logs.

at-least-once    ← what every real shipper gives you.
                 Retries on failure, so a line can arrive TWICE
                 if the ack was lost. Your queries must tolerate
                 duplicates.

exactly-once     not on offer for logs, at any price, from
                 anyone. Anyone claiming it is describing
                 at-least-once plus deduplication somewhere.</code></pre>
<p>The practical consequence: a count of log lines is an estimate, not a measurement. If you need an exact count of something, that is a metric — chapter 4 — not a log query. This is one of the clearest cases where knowing which pillar answers which question saves you from building the wrong thing.</p>

<div class="pitfall">
<p><strong>Trap — <code>include_images</code> means you are shipping one container's logs, not your system's.</strong> The config above filters to <code>cuonghoangdev_backend</code>. That reads like a sensible scope until the incident where nginx is returning 502 and the backend log is clean — because the backend never received the request, and the only evidence lives in the nginx container that Vector was told to ignore. The same gap hides Postgres's slow-query log and the OOM message from the TTS container. <strong>The blind spot is invisible by construction: a filtered pipeline looks perfectly healthy, because everything it collects arrives fine.</strong> Ship every container and filter at query time, where a wrong filter costs you one re-run instead of the evidence itself.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://vector.dev/docs/reference/configuration/sources/docker_logs/" target="_blank" rel="noopener">
  <span class="lc-ico">📡</span>
  <span class="lc-body"><span class="lc-title">Vector — the docker_logs source</span><span class="lc-sub">Every option including the include/exclude filters from the pitfall, and how it recovers position after a restart.</span></span>
</a>
<a class="link-card dl" href="https://grafana.com/docs/loki/latest/send-data/promtail/configuration/" target="_blank" rel="noopener">
  <span class="lc-ico">🔭</span>
  <span class="lc-body"><span class="lc-title">Promtail — configuration reference</span><span class="lc-sub">The pipeline_stages that parse Docker's envelope, and the positions file that makes tailing resumable.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Trình thu log: đưa log rời khỏi cái máy</h2>
<p class="lead">Bài 2.2 kết thúc ở một sự đánh đổi bạn không thắng được tại chỗ: một cái đĩa có trần và một tuần lịch sử là hai thứ không đội trời chung trên cùng một VPS. Trình thu log là cách bạn thôi cố. Nó đọc cái file đang xoay vòng và chép các dòng sang một nơi có chỗ.</p>

<h3>Bốn lý do, và chỉ một trong đó là &quot;đĩa&quot;</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Đĩa</span><span class="lz-t">Bạn được xoay vòng mạnh tay</span><span class="lz-d">Một khi các dòng đã an toàn ở nơi khác, <code>max-size: 20m</code> tại chỗ là ổn. Hai ràng buộc thôi đánh nhau.</span></div>
  <div class="lz-node"><span class="lz-k">Sống sót</span><span class="lz-t">Log sống lâu hơn container</span><span class="lz-d">Tạo lại một container là bắt đầu một file mới, rỗng — bài 2.1. Trình thu log thì đã chép cái cũ đi rồi. Đây là lý do thật sự cắn bạn lúc deploy-để-chữa.</span></div>
  <div class="lz-node"><span class="lz-k">Tìm kiếm</span><span class="lz-t">Bạn có một chỉ mục thay vì một lần quét</span><span class="lz-d"><code>grep</code> qua 4 GB JSON là đọc trọn. Một kho log trả lời &quot;lỗi trên /api/v1/notes trong một giờ qua&quot; từ chỉ mục, trong vài mili giây.</span></div>
  <div class="lz-node"><span class="lz-k">Ghép</span><span class="lz-t">Mọi dịch vụ trong một truy vấn</span><span class="lz-d">nginx, backend, postgres và container TTS là bốn file riêng trên đĩa, và là một luồng truy vấn được sau khi thu. Chương 3 phụ thuộc hoàn toàn vào điều này.</span></div>
</div>

<h3>Hai kiến trúc, và cái kho này nên chọn</h3>
<pre><code>A. TAIL CÁI FILE  (thứ LOG_PIPELINE.md mô tả)

   app của bạn ──▶ stdout ──▶ docker json-file ──▶ file trên đĩa
                                                       │
                                    trình thu tail ────┘──▶ kho

   ✓ App không biết gì cả. Không sửa mã, không thêm phụ thuộc.
   ✓ Trình thu chết = các dòng nằm chờ trên đĩa. Không mất gì.
   ✓ Nghẽn ngược rơi vào ĐĨA, không phải heap của bạn (bài 1.5).
   ✗ Thêm một chặng độ trễ (vài giây, và thế là ổn).


B. ĐẨY TỪ APP  (một transport HTTP trong logger của bạn)

   app của bạn ──▶ HTTP POST ──▶ kho

   ✓ Ít bộ phận chuyển động trên VPS hơn.
   ✗ App của bạn giờ phải tự lo thử lại, gom lô và đệm.
   ✗ Khi kho chậm, hàng đợi nằm trong HEAP CỦA BẠN — đúng cái
     cú hỏng đã đo ở bài 1.5, giờ với một đường mạng ở đầu kia
     thay vì một cái ống.
   ✗ Một sự cố log trở thành một sự cố ứng dụng.</code></pre>
<p>Kiến trúc A, lần nào cũng vậy. Lý do nằm ở phép đo của bài 1.5: cái đĩa là một bộ đệm có hàng chục gigabyte chỗ và có một hệ điều hành quản lý nó. Heap của bạn là một bộ đệm có vài trăm megabyte và một OOM killer.</p>

<h3>Ba lựa chọn trong LOG_PIPELINE.md của kho này</h3>
<pre><code>Vector          một binary Go/Rust duy nhất, không phụ thuộc runtime.
(Lựa chọn 2)    source = docker_logs, nên nó nói chuyện thẳng với
                daemon và có sẵn nhãn container.
                Sink: Loki, S3, Elasticsearch, gì cũng được.
                → mặc định thực dụng cho một cái VPS.

Promtail        trình thu bản địa của Loki. Tail các file json-log
(Lựa chọn 3)    theo glob. Cấu hình đơn giản hơn chút, nhưng chỉ
                nói được với Loki.
                → đúng nếu bạn đã chạy Grafana rồi.

Cloudflare      chính tài liệu thừa nhận cái này gượng gạo cho log
Logpush         ỨNG DỤNG — các tập dữ liệu của Logpush nói về
(Lựa chọn 1)    request HTTP của proxy, không phải stdout của bạn.
                → tốt cho dữ liệu biên/CDN, sai công cụ ở đây.</code></pre>
<p>Khuyến nghị của chính tài liệu — &quot;riêng với log ứng dụng thì đường đơn giản hơn là Lựa chọn 2 hoặc 3&quot; — là đúng, và đáng để ý như một thói quen: một cuốn sổ tay biết nói rõ khi nào chính lựa chọn đầu tiên của nó là sai chính là cuốn sổ tay đáng tin.</p>

<h3>Cấu hình Vector, có chú giải</h3>
<pre><code class="language-toml"># /etc/vector/vector.toml
[sources.docker]
type = "docker_logs"                       # nói chuyện với socket của daemon
include_images = ["cuonghoangdev_backend"] # ⚠ xem cái bẫy bên dưới

[transforms.parse]
type = "remap"
inputs = ["docker"]
source = '''
  . = parse_json!(.message)                # ⚠ dấu ! nghĩa là: HỎNG thì VỨT
'''

[sinks.console]
type = "console"                           # đổi sang loki/s3/elasticsearch
inputs = ["parse"]
encoding.codec = "json"</code></pre>
<p>Hai ký tự trong file đó quyết định nó có chạy được trên production hay không. <code>parse_json!</code> với dấu chấm than sẽ huỷ sự kiện khi dòng log không phải JSON hợp lệ — mà container của bạn phát ra khối thứ không phải JSON: dòng chào lúc Node khởi động, một stack trace không bắt được, đầu ra của Prisma lúc migrate. Tất cả biến mất trong im lặng. Dạng an toàn giữ lại dòng log trong cả hai trường hợp:</p>
<pre><code class="language-toml">source = '''
  parsed, err = parse_json(.message)       # không có ! → trả về lỗi
  if err == null {
    . = merge(., object!(parsed))
  } else {
    .unparsed = true                        # giữ dòng thô, gắn cờ
  }
'''</code></pre>

<h3>Cái giao kèo giao hàng bạn thật sự đang mua</h3>
<pre><code>nhiều-nhất-một-lần   bắn rồi quên. Rẻ. Mất dòng ở mọi cú hỏng.
                     Không bao giờ chấp nhận được cho log.

ít-nhất-một-lần      ← thứ mọi trình thu thật sự cho bạn.
                     Thử lại khi hỏng, nên một dòng có thể tới HAI
                     LẦN nếu cái ack bị mất. Truy vấn của bạn phải
                     chịu được bản trùng.

đúng-một-lần         không có bán cho log, ở bất cứ giá nào, từ bất
                     cứ ai. Ai bảo có là đang mô tả ít-nhất-một-lần
                     cộng khử trùng ở đâu đó.</code></pre>
<p>Hệ quả thực tế: một con số đếm dòng log là một ƯỚC LƯỢNG, không phải một phép đo. Nếu bạn cần đếm chính xác một thứ gì đó thì thứ đó là một chỉ số — chương 4 — không phải một truy vấn log. Đây là một trong những ca rõ nhất cho thấy việc biết trụ cột nào trả lời câu hỏi nào cứu bạn khỏi dựng nhầm thứ.</p>

<div class="pitfall">
<p><strong>Bẫy — <code>include_images</code> nghĩa là bạn đang thu log của MỘT container, không phải của hệ thống.</strong> Cấu hình ở trên lọc còn <code>cuonghoangdev_backend</code>. Nghe như một phạm vi hợp lý, cho tới cái sự cố mà nginx trả 502 còn log backend thì sạch bong — vì backend chưa từng nhận được request, và bằng chứng duy nhất nằm trong container nginx mà Vector được bảo là hãy lờ đi. Đúng khoảng trống ấy giấu luôn log truy vấn chậm của Postgres và thông báo OOM từ container TTS. <strong>Điểm mù này vô hình theo đúng thiết kế: một đường ống bị lọc trông khoẻ mạnh hoàn hảo, vì mọi thứ nó thu về đều tới nơi tử tế.</strong> Hãy thu mọi container rồi lọc lúc truy vấn, nơi mà một bộ lọc sai chỉ tốn của bạn một lần chạy lại thay vì tốn chính cái bằng chứng.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://vector.dev/docs/reference/configuration/sources/docker_logs/" target="_blank" rel="noopener">
  <span class="lc-ico">📡</span>
  <span class="lc-body"><span class="lc-title">Vector — nguồn docker_logs</span><span class="lc-sub">Mọi tuỳ chọn, kể cả bộ lọc include/exclude ở cái bẫy trên, và cách nó khôi phục vị trí sau khi khởi động lại.</span></span>
</a>
<a class="link-card dl" href="https://grafana.com/docs/loki/latest/send-data/promtail/configuration/" target="_blank" rel="noopener">
  <span class="lc-ico">🔭</span>
  <span class="lc-body"><span class="lc-title">Promtail — tra cứu cấu hình</span><span class="lc-sub">Các pipeline_stages bóc phong bì của Docker, và cái file positions làm cho việc tail có thể tiếp tục được.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '2.4 — LogQL: asking a question and getting an answer|||2.4 — LogQL: hỏi một câu và nhận được câu trả lời',
      slug: 'obs-2-4-logql',
      type: 'VIDEO',
      description: 'Nhãn so với nội dung, bẫy lực lượng nhãn trong chính LOG_PIPELINE.md của kho này, và những truy vấn dùng thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>LogQL: asking a question and getting an answer</h2>
<p class="lead">Once the lines are in Loki, one distinction governs everything: labels are indexed, content is not. Get that boundary wrong and you either can't find anything or you take the store down. This repository's own documentation gets it wrong, which makes it a good place to learn.</p>

<h3>The one idea: a stream is a set of labels</h3>
<pre><code>Loki does NOT index your log text. It indexes LABELS.

  {container="backend", level="error"}   ← a STREAM.
                                            Indexed. Cheap to select.

  |= "notes"                             ← a FILTER over that
                                            stream's raw bytes.
                                            Not indexed. Grep, but
                                            only over what the labels
                                            already narrowed down.

So every query is: pick streams by label, then grep inside them.
The labels decide how much data the grep has to touch.</code></pre>
<p>This is a deliberate design: Loki is cheap because it does not build a full-text index. You pay for that by having to choose labels that partition your data usefully — and by never, ever putting something high-cardinality in one.</p>

<h3>The trap, in this repo's own config</h3>
<p><code>LOG_PIPELINE.md</code>, Option 3, ends its Promtail pipeline with:</p>
<pre><code class="language-yaml">- labels:
    level:
    msg:        # ⚠️ this line</code></pre>
<p>Labelling on <code>msg</code> creates one stream per distinct message. Count them:</p>
<pre><code class="language-bash">$ grep -rhoE "logger\\.(info|warn|error|debug)\\(\\s*'[^']+'" src/ \\
    | sed -E "s/.*'([^']+)'.*/\\1/" | sort -u | wc -l
325

$ sed -n '165,351p' LOG_PIPELINE.md | grep -cE '^- &#96;'
124        # the documented catalog is only a third of what src/ emits</code></pre>
<div class="out">nhãn: container + level              28 luồng
nhãn: container + level + msg      9,100 luồng
Loki khuyến nghị trần        ~10.000 luồng hoạt động/tenant</div>
<p>Twenty-eight streams becomes nine thousand one hundred — 325× more — and lands within 10% of the default active-stream limit before a single new log statement is written. Add <code>route</code> as a label and the 945 route declarations in this repo take it past eight million.</p>
<p>Note also the second number: the catalog documents 124 event names, <code>src/</code> emits 325. The documentation drifted, which is chapter 0's theme arriving on schedule.</p>

<h3>The rule for choosing labels</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Good label</span><span class="lz-t">Bounded, small, and stable</span><span class="lz-d">container, level, env, job. You can write down every value it will ever take. Usually fewer than 20.</span></div>
  <div class="lz-node"><span class="lz-k">Bad label</span><span class="lz-t">Grows with traffic or with your codebase</span><span class="lz-d">msg, route, userId, requestId, any id at all. Each new value is a new stream, a new index entry, and a new set of chunks.</span></div>
  <div class="lz-node"><span class="lz-k">Where those go instead</span><span class="lz-t">In the line, extracted at query time</span><span class="lz-d"><code>| json | route="/api/v1/notes"</code> reads the field out of the JSON while scanning. Slower per query, free at ingest, no limit.</span></div>
</div>
<pre><code class="language-yaml"># the corrected pipeline
pipeline_stages:
  - docker: {}
  - json:
      expressions:
        level: level
        msg: msg
        route: route
  - labels:
      level:        # bounded: 4 values
      # msg and route are extracted but NOT promoted to labels</code></pre>

<h3>Queries you will actually type</h3>
<pre><code># every error from the backend in the selected time range
{container="cuonghoangdev_backend", level="error"}

# errors mentioning the notes API — label first, then grep
{container="cuonghoangdev_backend", level="error"} |= "notes"

# parse the JSON, then filter on a field (route is NOT a label)
{container="cuonghoangdev_backend"} | json | route="/api/v1/notes"

# requests slower than 1s — numeric comparison on an extracted field
{container="cuonghoangdev_backend"} | json | ms &gt; 1000

# error RATE per minute, as a graph
sum(rate({container="cuonghoangdev_backend", level="error"}[1m]))

# top offending routes in the last hour
topk(5, sum by (route) (
  count_over_time({container="cuonghoangdev_backend"} | json | level="error" [1h])
))

# the p99 the metrics chapter will do properly — from logs, expensively
quantile_over_time(0.99,
  {container="cuonghoangdev_backend"} | json | unwrap ms [5m]) by (route)</code></pre>
<p>That last one is worth staring at. It works, and it is the demonstration for chapter 4's argument: computing a percentile from logs means reading and sorting every matching line, every time the graph refreshes. A histogram gives the same number for a few bytes. Both are available; only one is affordable on a dashboard that auto-refreshes.</p>

<h3>Reading a query's cost before you run it</h3>
<pre><code>{container="backend"} |= "error"
    │                    │
    │                    └─ scans every byte of every selected stream
    └─ selects ~1 stream. Good.

{level="error"} |= "notes"
    │
    └─ selects that label across ALL containers, ALL jobs.
       On a shared Loki this can be thousands of streams and
       hundreds of GB. The query is short; the bill is not.

Rule of thumb: the FIRST selector should always pin the
container or job. Everything else narrows from there.</code></pre>

<div class="pitfall">
<p><strong>Trap — a label you add today applies only from today.</strong> Labels are attached at ingest, by the shipper, so changing the Promtail or Vector config does not relabel the chunks already stored. The consequence appears at the worst moment: you add a <code>service</code> label, and a week later you query <code>{service="backend"}</code> over &quot;the last 30 days&quot; to compare against the previous incident — and get results for seven days, silently, with no warning that the other twenty-three are simply not selectable by that label. <strong>The graph looks like the incident began the day you changed the config.</strong> When you change labels, write the date in the runbook, and query historical ranges with the label set that existed then.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://grafana.com/docs/loki/latest/query/" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">LogQL — the full query language</span><span class="lc-sub">Stream selectors, line filters, label expressions, unwrap and every aggregation, with runnable examples.</span></span>
</a>
<a class="link-card dl" href="https://grafana.com/docs/loki/latest/get-started/labels/bp-labels/" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">Loki — label best practices</span><span class="lc-sub">Grafana's own writeup of the cardinality trap in this lesson, including why they recommend staying under about ten labels.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>LogQL: hỏi một câu và nhận được câu trả lời</h2>
<p class="lead">Một khi các dòng đã nằm trong Loki, có một sự phân biệt chi phối tất cả: nhãn thì được đánh chỉ mục, nội dung thì không. Vạch sai ranh giới đó thì hoặc bạn không tìm được gì, hoặc bạn làm sập cái kho. Chính tài liệu của kho này vạch sai, và vì thế nó là chỗ tốt để học.</p>

<h3>Một ý duy nhất: một luồng là một bộ nhãn</h3>
<pre><code>Loki KHÔNG đánh chỉ mục chữ trong log của bạn. Nó đánh chỉ mục NHÃN.

  {container="backend", level="error"}   ← một LUỒNG.
                                            Có chỉ mục. Chọn thì rẻ.

  |= "notes"                             ← một BỘ LỌC trên số byte
                                            thô của luồng đó.
                                            Không chỉ mục. Là grep,
                                            nhưng chỉ trên phần mà
                                            nhãn đã thu hẹp lại.

Nên mọi truy vấn đều là: chọn luồng theo nhãn, rồi grep bên trong.
Nhãn quyết định phép grep phải chạm vào bao nhiêu dữ liệu.</code></pre>
<p>Đây là thiết kế có chủ ý: Loki rẻ vì nó không dựng chỉ mục toàn văn. Cái giá bạn trả là phải chọn được những nhãn chia dữ liệu ra một cách hữu ích — và là không bao giờ, tuyệt đối không bao giờ, đặt một thứ có lực lượng lớn vào một cái nhãn.</p>

<h3>Cái bẫy, trong chính cấu hình của kho này</h3>
<p><code>LOG_PIPELINE.md</code>, Lựa chọn 3, kết thúc pipeline Promtail bằng:</p>
<pre><code class="language-yaml">- labels:
    level:
    msg:        # ⚠️ dòng này</code></pre>
<p>Gắn nhãn theo <code>msg</code> tạo ra một luồng cho mỗi thông điệp khác nhau. Đếm thử:</p>
<pre><code class="language-bash">$ grep -rhoE "logger\\.(info|warn|error|debug)\\(\\s*'[^']+'" src/ \\
    | sed -E "s/.*'([^']+)'.*/\\1/" | sort -u | wc -l
325

$ sed -n '165,351p' LOG_PIPELINE.md | grep -cE '^- &#96;'
124        # cuốn danh mục ghi lại chỉ bằng một phần ba thứ src/ phát ra</code></pre>
<div class="out">nhãn: container + level              28 luồng
nhãn: container + level + msg      9.100 luồng
Loki khuyến nghị trần        ~10.000 luồng hoạt động/tenant</div>
<p>Hai mươi tám luồng thành chín nghìn một trăm — gấp 325 lần — và chạm tới trong vòng 10% của hạn mức luồng hoạt động mặc định trước khi có thêm một câu lệnh log mới nào được viết. Thêm <code>route</code> làm nhãn nữa thì 945 khai báo route trong kho này đẩy nó vượt tám triệu.</p>
<p>Cũng để ý con số thứ hai: cuốn danh mục ghi lại 124 tên sự kiện, <code>src/</code> phát ra 325. Tài liệu đã trôi dạt, và đó là chủ đề của chương 0 xuất hiện đúng hẹn.</p>

<h3>Quy tắc chọn nhãn</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Nhãn tốt</span><span class="lz-t">Có chặn, nhỏ, và ổn định</span><span class="lz-d">container, level, env, job. Bạn viết ra được mọi giá trị nó sẽ từng nhận. Thường dưới 20 cái.</span></div>
  <div class="lz-node"><span class="lz-k">Nhãn tệ</span><span class="lz-t">Phình theo lưu lượng hoặc theo mã nguồn</span><span class="lz-d">msg, route, userId, requestId, bất cứ id nào. Mỗi giá trị mới là một luồng mới, một mục chỉ mục mới, và một bộ chunk mới.</span></div>
  <div class="lz-node"><span class="lz-k">Thay vào đó chúng đi đâu</span><span class="lz-t">Nằm trong dòng log, bóc ra lúc truy vấn</span><span class="lz-d"><code>| json | route="/api/v1/notes"</code> đọc trường ấy ra khỏi JSON trong lúc quét. Chậm hơn mỗi truy vấn, miễn phí lúc nạp, không có trần.</span></div>
</div>
<pre><code class="language-yaml"># pipeline đã sửa
pipeline_stages:
  - docker: {}
  - json:
      expressions:
        level: level
        msg: msg
        route: route
  - labels:
      level:        # có chặn: 4 giá trị
      # msg và route được bóc ra nhưng KHÔNG được nâng lên làm nhãn</code></pre>

<h3>Những truy vấn bạn sẽ gõ thật</h3>
<pre><code># mọi lỗi từ backend trong khoảng thời gian đang chọn
{container="cuonghoangdev_backend", level="error"}

# lỗi có nhắc tới API notes — nhãn trước, rồi mới grep
{container="cuonghoangdev_backend", level="error"} |= "notes"

# bóc JSON rồi lọc theo một trường (route KHÔNG phải nhãn)
{container="cuonghoangdev_backend"} | json | route="/api/v1/notes"

# request chậm hơn 1s — so sánh số trên một trường đã bóc
{container="cuonghoangdev_backend"} | json | ms &gt; 1000

# TỐC ĐỘ lỗi mỗi phút, dạng đồ thị
sum(rate({container="cuonghoangdev_backend", level="error"}[1m]))

# những route hỏng nhiều nhất trong một giờ qua
topk(5, sum by (route) (
  count_over_time({container="cuonghoangdev_backend"} | json | level="error" [1h])
))

# cái p99 mà chương chỉ số sẽ làm cho tử tế — từ log, và đắt
quantile_over_time(0.99,
  {container="cuonghoangdev_backend"} | json | unwrap ms [5m]) by (route)</code></pre>
<p>Cái cuối đáng ngồi nhìn một lúc. Nó chạy được, và nó chính là minh chứng cho lý lẽ của chương 4: tính một phân vị từ log nghĩa là đọc và sắp xếp mọi dòng khớp, mỗi lần đồ thị làm mới. Một histogram cho cùng con số đó với vài byte. Cả hai đều có sẵn; chỉ một cái trả nổi trên một bảng theo dõi tự làm mới.</p>

<h3>Đọc cái giá của một truy vấn trước khi chạy nó</h3>
<pre><code>{container="backend"} |= "error"
    │                    │
    │                    └─ quét mọi byte của mọi luồng đã chọn
    └─ chọn ~1 luồng. Tốt.

{level="error"} |= "notes"
    │
    └─ chọn cái nhãn đó trên MỌI container, MỌI job.
       Trên một Loki dùng chung, đây có thể là hàng nghìn luồng và
       hàng trăm GB. Câu truy vấn thì ngắn; hoá đơn thì không.

Mẹo: bộ chọn ĐẦU TIÊN phải luôn ghim container hoặc job lại.
Mọi thứ khác thu hẹp dần từ đó.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — một cái nhãn bạn thêm hôm nay chỉ áp dụng từ hôm nay.</strong> Nhãn được gắn lúc nạp, bởi trình thu log, nên đổi cấu hình Promtail hay Vector KHÔNG gắn lại nhãn cho những chunk đã lưu. Hệ quả hiện ra vào đúng lúc tệ nhất: bạn thêm một nhãn <code>service</code>, và một tuần sau bạn truy vấn <code>{service="backend"}</code> trên &quot;30 ngày qua&quot; để so với sự cố lần trước — rồi nhận kết quả của bảy ngày, trong im lặng, không một lời cảnh báo rằng hai mươi ba ngày kia đơn giản là không chọn được bằng cái nhãn đó. <strong>Đồ thị trông y như thể sự cố bắt đầu đúng cái ngày bạn đổi cấu hình.</strong> Khi đổi nhãn, hãy ghi ngày vào sổ tay, và truy vấn các khoảng lịch sử bằng bộ nhãn đã tồn tại ở thời điểm đó.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://grafana.com/docs/loki/latest/query/" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">LogQL — trọn bộ ngôn ngữ truy vấn</span><span class="lc-sub">Bộ chọn luồng, bộ lọc dòng, biểu thức nhãn, unwrap và mọi phép tổng hợp, kèm ví dụ chạy được.</span></span>
</a>
<a class="link-card dl" href="https://grafana.com/docs/loki/latest/get-started/labels/bp-labels/" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">Loki — thông lệ tốt về nhãn</span><span class="lc-sub">Chính Grafana viết về cái bẫy lực lượng trong bài này, kể cả lý do họ khuyên nên giữ dưới khoảng mười nhãn.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '2.5 — How long to keep it, and what that costs|||2.5 — Giữ bao lâu, và cái đó tốn bao nhiêu',
      slug: 'obs-2-5-luu-tru',
      type: 'VIDEO',
      description: 'Nén 12,8× đo thật, bài toán lưu trữ theo bậc, và vì sao câu hỏi đúng là "bạn nhìn lại xa tới đâu".',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2>How long to keep it, and what that costs</h2>
<p class="lead">Retention is usually picked by copying whatever number someone else used — 7 days, 30 days, 90. Here is how to derive it instead, from two things you can measure: how much your logs compress, and how far back you have ever actually looked.</p>

<h3>Measurement: log text compresses extremely well</h3>
<p>Generate 200,000 lines with realistic variation — five routes, thirteen status codes, ten thousand user ids, a moving timestamp — and compress them:</p>
<pre><code class="language-javascript">// m9.mjs
import zlib from 'node:zlib';
let raw = '';
for (let i = 0; i &lt; 200_000; i++) {
  raw += JSON.stringify({
    ts: new Date(1756108800000 + i * 43).toISOString(),
    level: codes[i % 13] &gt;= 500 ? 'error' : 'info', msg: 'request completed',
    method: i % 7 === 0 ? 'POST' : 'GET', route: routes[i % 5],
    status: codes[i % 13], ms: 8 + (i * 37) % 400,
    userId: 'u_' + ((i * 2654435761) % 10000).toString(16).padStart(4, '0'),
  }) + '\\n';
}
const b = Buffer.from(raw);
console.log(b.length, zlib.gzipSync(b, { level: 6 }).length, zlib.zstdCompressSync(b).length);
</code></pre>
<div class="out">$ node m9.mjs
200.000 dòng, thô         29.9 MB  ( 157 byte/dòng )
gzip -6                    2.3 MB  → 12.8× nhỏ hơn
zstd (mặc định)            2.1 MB  → 14.2× nhỏ hơn

50 rps × 5 dòng/req, giữ 30 ngày:
  thô            94.7 GB
  gzip            7.4 GB
  zstd            6.7 GB</div>
<p><strong>12.8×.</strong> Structured logs are the most compressible data you will ever store: the same twenty field names repeat on every line, and the values come from small sets. Compression is not a detail here — it is the difference between 94.7 GB and 7.4 GB for the same month of history.</p>
<p>Both numbers matter, for different decisions. The 94.7 GB is what your <em>local disk</em> would need, because Docker's <code>json-file</code> writes uncompressed and only gzips files it has already rotated. The 7.4 GB is what your <em>log store</em> needs, because Loki compresses chunks before writing them. Same logs, thirteen-fold difference, decided by where they live.</p>

<h3>The right question is not &quot;how long&quot;</h3>
<pre><code>Ask instead: what do I use old logs FOR?

  &lt; 1 hour     Debugging what is happening RIGHT NOW.
               This is 95% of all log reads. Needs to be fast
               and complete.

  1–7 days     &quot;When did this start?&quot; Post-incident work.
               Needs to be searchable, can be slower.

  7–30 days    &quot;Did this happen last month too?&quot; Comparison
               against a previous incident. Rare, and you
               usually know what you are looking for.

  &gt; 30 days    Almost always compliance or billing disputes,
               not debugging. If you cannot name the regulation,
               you probably do not need this tier.</code></pre>
<p>The distribution is brutally skewed toward the first row, and the storage cost is entirely in the last. That mismatch is what tiering exists to fix.</p>

<h3>Tiering, with the numbers attached</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Tier 1 · Docker, 0–1 hour</span><span class="lz-lnote"><code>max-size: 20m, max-file: 2</code> = 40 MB per container, uncompressed, instant. This is your <code>docker logs</code> fallback for when the shipper itself is broken.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tier 2 · Loki, 0–14 days</span><span class="lz-lnote">Compressed ~12.8×, indexed by label. At 50 rps × 5 lines this is about 3.5 GB. Searchable in milliseconds. This is where you live.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tier 3 · Object storage, 14–90 days</span><span class="lz-lnote">gzipped NDJSON in R2, one file per container per day. ~7.4 GB per month. R2 has no egress fee, so retrieving a day to investigate costs essentially nothing. Not indexed — you download and grep.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tier 4 · Nothing</span><span class="lz-lnote">Deleted. Chosen deliberately, written down, with the reason. &quot;We keep 90 days because X&quot; is a decision; drifting to forever because nobody set a policy is not.</span></div>
</div>
<p>This repo already runs Cloudflare R2 for media — <code>src/services/</code> has the S3 client and the credentials are already in the VPS env. Tier 3 is a Vector sink and a lifecycle rule, not a new vendor.</p>

<pre><code class="language-toml"># Tier 3, as a second Vector sink alongside Loki
[sinks.r2_archive]
type = "aws_s3"
inputs = ["parse"]
bucket = "cuongthai-logs"
endpoint = "https://&lt;account&gt;.r2.cloudflarestorage.com"
key_prefix = "logs/%Y/%m/%d/"        # date-partitioned: grep one day cheaply
compression = "gzip"
encoding.codec = "json"
batch.max_bytes = 10000000           # 10 MB objects — few large beats many small</code></pre>

<h3>What actually drives the bill</h3>
<pre><code>Storage is usually NOT the expensive part.

  7.4 GB/month on R2  ≈  $0.11/month.       ← negligible
  Loki ingest on Grafana Cloud is priced
  per GB INGESTED, not stored.              ← this is the bill

So the lever is not retention. It is VOLUME:

  · Drop debug in production. logger.ts already does
    this (lesson 1.1) — that guard is a cost control.
  · One request-completion line, not one per layer.
  · Sample the successes: keep 100% of errors and 1%
    of 200s. Ten times less data, no lost failures.
  · Health check logs. /health is hit every 30s by the
    container healthcheck — 2,880 lines/day/container
    that say nothing. Do not log successful probes.</code></pre>
<p>That last one is worth checking on any system you inherit. It is remarkably common for a third or more of production log volume to be health-check noise that nobody has ever read.</p>

<div class="pitfall">
<p><strong>Trap — retention is not deletion, and only one of the two satisfies a takedown request.</strong> Setting Loki's retention to 30 days means chunks become eligible for compaction and removal — it does not mean a specific user's data is gone on day 31, and it says nothing at all about your R2 archive, which has its own lifecycle rules, or about Sentry, which has its own. When someone exercises a right to erasure, &quot;we keep logs for 30 days&quot; is not an answer: the personal data is in three stores with three independent clocks, plus whatever a colleague exported to a spreadsheet during an incident. <strong>The only defensible position is the one from lesson 1.2 — do not put personal data in logs in the first place</strong> — because deleting it afterwards, from every tier, on request, is a project rather than a setting.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://grafana.com/docs/loki/latest/operations/storage/retention/" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Loki — retention and the compactor</span><span class="lc-sub">Global vs per-stream retention, how deletion actually happens, and the delay between &quot;expired&quot; and &quot;gone&quot;.</span></span>
</a>
<a class="link-card dl" href="https://developers.cloudflare.com/r2/buckets/object-lifecycles/" target="_blank" rel="noopener">
  <span class="lc-ico">☁️</span>
  <span class="lc-body"><span class="lc-title">Cloudflare R2 — object lifecycle rules</span><span class="lc-sub">How to expire the tier-3 archive automatically, on the same storage this repository already uses for media.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2>Giữ bao lâu, và cái đó tốn bao nhiêu</h2>
<p class="lead">Thời hạn lưu thường được chọn bằng cách chép lại con số ai đó đã dùng — 7 ngày, 30 ngày, 90. Đây là cách suy ra nó thay vì chép, từ hai thứ bạn đo được: log của bạn nén được bao nhiêu, và bạn đã thật sự từng nhìn lại xa tới đâu.</p>

<h3>Phép đo: chữ trong log nén cực tốt</h3>
<p>Sinh 200.000 dòng có biến thiên thực tế — năm route, mười ba mã trạng thái, mười nghìn id người dùng, một dấu thời gian chạy — rồi nén:</p>
<pre><code class="language-javascript">// m9.mjs
import zlib from 'node:zlib';
let raw = '';
for (let i = 0; i &lt; 200_000; i++) {
  raw += JSON.stringify({
    ts: new Date(1756108800000 + i * 43).toISOString(),
    level: codes[i % 13] &gt;= 500 ? 'error' : 'info', msg: 'request completed',
    method: i % 7 === 0 ? 'POST' : 'GET', route: routes[i % 5],
    status: codes[i % 13], ms: 8 + (i * 37) % 400,
    userId: 'u_' + ((i * 2654435761) % 10000).toString(16).padStart(4, '0'),
  }) + '\\n';
}
const b = Buffer.from(raw);
console.log(b.length, zlib.gzipSync(b, { level: 6 }).length, zlib.zstdCompressSync(b).length);
</code></pre>
<div class="out">$ node m9.mjs
200.000 dòng, thô         29.9 MB  ( 157 byte/dòng )
gzip -6                    2.3 MB  → 12.8× nhỏ hơn
zstd (mặc định)            2.1 MB  → 14.2× nhỏ hơn

50 rps × 5 dòng/req, giữ 30 ngày:
  thô            94.7 GB
  gzip            7.4 GB
  zstd            6.7 GB</div>
<p><strong>12,8×.</strong> Log có cấu trúc là loại dữ liệu nén tốt nhất bạn từng lưu: cùng hai mươi cái tên trường lặp lại ở mọi dòng, và các giá trị đến từ những tập nhỏ. Nén ở đây không phải chi tiết vụn — nó là khác biệt giữa 94,7 GB và 7,4 GB cho cùng một tháng lịch sử.</p>
<p>Cả hai con số đều quan trọng, cho hai quyết định khác nhau. 94,7 GB là thứ <em>đĩa tại chỗ</em> của bạn sẽ cần, vì <code>json-file</code> của Docker ghi không nén và chỉ gzip những file nó đã xoay vòng xong. 7,4 GB là thứ <em>kho log</em> của bạn cần, vì Loki nén chunk trước khi ghi. Cùng một mớ log, chênh mười ba lần, do chỗ chúng nằm quyết định.</p>

<h3>Câu hỏi đúng không phải là &quot;bao lâu&quot;</h3>
<pre><code>Hãy hỏi thay vào đó: tôi dùng log cũ để LÀM GÌ?

  &lt; 1 giờ      Gỡ cái đang xảy ra NGAY BÂY GIỜ.
               Đây là 95% của mọi lần đọc log. Cần nhanh và đầy đủ.

  1–7 ngày     &quot;Cái này bắt đầu từ lúc nào?&quot; Việc sau sự cố.
               Cần tìm kiếm được, chậm hơn cũng chịu được.

  7–30 ngày    &quot;Tháng trước có bị thế này không?&quot; So sánh với một
               sự cố trước. Hiếm, và bạn thường đã biết mình
               đang tìm gì.

  &gt; 30 ngày    Gần như luôn là tuân thủ hoặc tranh chấp hoá đơn,
               không phải gỡ lỗi. Nếu bạn không gọi tên được
               cái quy định nào, chắc là bạn không cần bậc này.</code></pre>
<p>Phân bố lệch tàn nhẫn về hàng đầu tiên, còn chi phí lưu trữ thì nằm trọn ở hàng cuối. Chính sự lệch pha đó là lý do phân bậc tồn tại.</p>

<h3>Phân bậc, kèm con số</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Bậc 1 · Docker, 0–1 giờ</span><span class="lz-lnote"><code>max-size: 20m, max-file: 2</code> = 40 MB mỗi container, không nén, tức thì. Đây là đường lùi <code>docker logs</code> cho lúc chính trình thu log bị hỏng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Bậc 2 · Loki, 0–14 ngày</span><span class="lz-lnote">Nén ~12,8×, đánh chỉ mục theo nhãn. Ở mức 50 rps × 5 dòng thì khoảng 3,5 GB. Tìm được trong vài mili giây. Đây là chỗ bạn sống.</span></div>
  <div class="lz-layer"><span class="lz-lname">Bậc 3 · Lưu trữ đối tượng, 14–90 ngày</span><span class="lz-lnote">NDJSON đã gzip trong R2, mỗi container mỗi ngày một file. ~7,4 GB mỗi tháng. R2 không tính phí ra, nên kéo về một ngày để điều tra gần như miễn phí. Không có chỉ mục — bạn tải về rồi grep.</span></div>
  <div class="lz-layer"><span class="lz-lname">Bậc 4 · Không gì cả</span><span class="lz-lnote">Đã xoá. Chọn một cách có chủ ý, ghi lại, kèm lý do. &quot;Chúng tôi giữ 90 ngày vì X&quot; là một quyết định; trôi dần thành giữ mãi mãi vì không ai đặt chính sách thì không phải.</span></div>
</div>
<p>Kho này vốn đã chạy Cloudflare R2 cho media — <code>src/services/</code> có sẵn client S3 và thông tin xác thực đã nằm trong env của VPS. Bậc 3 là một cái sink của Vector cộng một quy tắc vòng đời, không phải một nhà cung cấp mới.</p>

<pre><code class="language-toml"># Bậc 3, dưới dạng một sink Vector thứ hai đặt cạnh Loki
[sinks.r2_archive]
type = "aws_s3"
inputs = ["parse"]
bucket = "cuongthai-logs"
endpoint = "https://&lt;account&gt;.r2.cloudflarestorage.com"
key_prefix = "logs/%Y/%m/%d/"        # chia theo ngày: grep một ngày thì rẻ
compression = "gzip"
encoding.codec = "json"
batch.max_bytes = 10000000           # đối tượng 10 MB — ít mà to hơn nhiều mà nhỏ</code></pre>

<h3>Cái thật sự đẩy hoá đơn lên</h3>
<pre><code>Lưu trữ thường KHÔNG phải phần đắt.

  7,4 GB/tháng trên R2  ≈  0,11 $/tháng.    ← không đáng kể
  Loki trên Grafana Cloud tính tiền theo
  số GB NẠP VÀO, không theo số GB lưu.      ← đây mới là hoá đơn

Nên cái cần bẩy không phải thời hạn lưu. Là LƯỢNG:

  · Bỏ debug trên production. logger.ts đã làm sẵn điều này
    (bài 1.1) — cái chốt đó là một biện pháp kiểm soát chi phí.
  · Một dòng kết-thúc-request, không phải mỗi tầng một dòng.
  · Lấy mẫu phần thành công: giữ 100% lỗi và 1% số 200.
    Ít hơn mười lần dữ liệu, không mất cú hỏng nào.
  · Log của phép kiểm sức khoẻ. /health bị gọi 30 giây một lần
    bởi healthcheck của container — 2.880 dòng/ngày/container
    chẳng nói gì cả. Đừng log những lần thăm dò thành công.</code></pre>
<p>Cái cuối đáng đi kiểm trên bất cứ hệ thống nào bạn tiếp quản. Chuyện một phần ba hoặc hơn lượng log production là tiếng ồn của phép kiểm sức khoẻ mà chưa ai từng đọc là chuyện hết sức phổ biến.</p>

<div class="pitfall">
<p><strong>Bẫy — thời hạn lưu không phải là xoá, và chỉ một trong hai đáp ứng được yêu cầu gỡ bỏ dữ liệu.</strong> Đặt thời hạn lưu của Loki là 30 ngày nghĩa là các chunk trở nên đủ điều kiện để được gom nén và loại bỏ — nó KHÔNG nghĩa là dữ liệu của một người dùng cụ thể biến mất vào ngày thứ 31, và nó chẳng nói gì về kho lưu trữ R2 của bạn, thứ có quy tắc vòng đời riêng, hay về Sentry, thứ cũng có riêng. Khi ai đó thực thi quyền được xoá, &quot;chúng tôi giữ log 30 ngày&quot; không phải một câu trả lời: dữ liệu cá nhân nằm trong ba kho với ba cái đồng hồ độc lập, cộng thêm bất cứ thứ gì một đồng nghiệp đã xuất ra bảng tính trong lúc sự cố. <strong>Vị thế duy nhất bảo vệ được là vị thế của bài 1.2 — đừng đưa dữ liệu cá nhân vào log ngay từ đầu</strong> — vì xoá nó về sau, khỏi mọi bậc, theo yêu cầu, là một dự án chứ không phải một thiết lập.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://grafana.com/docs/loki/latest/operations/storage/retention/" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Loki — thời hạn lưu và bộ gom nén</span><span class="lc-sub">Thời hạn toàn cục so với theo từng luồng, việc xoá thật sự diễn ra thế nào, và độ trễ giữa &quot;hết hạn&quot; và &quot;biến mất&quot;.</span></span>
</a>
<a class="link-card dl" href="https://developers.cloudflare.com/r2/buckets/object-lifecycles/" target="_blank" rel="noopener">
  <span class="lc-ico">☁️</span>
  <span class="lc-body"><span class="lc-title">Cloudflare R2 — quy tắc vòng đời đối tượng</span><span class="lc-sub">Cách cho kho lưu trữ bậc 3 tự hết hạn, trên đúng dịch vụ lưu trữ mà kho này đã dùng cho media.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '2.6 — Chapter 2 quiz|||2.6 — Kiểm tra chương 2',
      slug: 'obs-2-6-quiz',
      type: 'QUIZ',
      description: 'Sáu câu về phong bì của Docker, xoay vòng, trình thu log, nhãn LogQL và bài toán lưu trữ.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 2 · Quiz</span><h2>Six questions on the pipeline</h2><p class="lead">Three of these are about numbers measured in this chapter; three are about a mechanism that fails silently. Both kinds show up in real incidents.</p></div><div class="ml-vi"><span class="eyebrow">Chương 2 · Kiểm tra</span><h2>Sáu câu về đường ống</h2><p class="lead">Ba câu về những con số đã đo trong chương này; ba câu về một cơ chế hỏng trong im lặng. Cả hai loại đều xuất hiện trong sự cố thật.</p></div>`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          {
            question: 'Your log line is 157 bytes. How much lands on disk, and why?|||Dòng log của bạn 157 byte. Bao nhiêu rơi xuống đĩa, và vì sao?',
            options: [
              '255 bytes — 1.62× — because the json-file driver wraps your JSON inside another JSON object as a string, which backslash-escapes all 28 quotes and adds the stream and time fields.|||255 byte — 1,62× — vì trình json-file bọc JSON của bạn vào một đối tượng JSON khác dưới dạng chuỗi, làm cả 28 dấu ngoặc kép bị escape bằng gạch chéo ngược, rồi thêm trường stream và time.',
              '157 bytes — Docker writes the line through unchanged|||157 byte — Docker ghi thẳng dòng đó không đổi',
              'Fewer than 157, because Docker compresses each line|||Ít hơn 157, vì Docker nén từng dòng',
              'It depends on the log level, which decides the driver|||Tuỳ mức log, vì mức log quyết định trình ghi',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'This repo truncates container logs over 200 MB, weekly, by cron. What is the strongest objection?|||Kho này cắt cụt log container quá 200 MB, hằng tuần, bằng cron. Phản bác mạnh nhất là gì?',
            options: [
              'Three things at once: a weekly job cannot catch a disk that fills in a day, the 200 MB threshold is per container so seven containers reserve 1.4 GB before it acts, and truncate destroys the whole history — including the log that would explain why it grew. max-size + max-file gives a continuous hard ceiling and keeps the last N files.|||Ba điều cùng lúc: một việc chạy hằng tuần không đỡ nổi một cái đĩa đầy trong một ngày, ngưỡng 200 MB tính theo từng container nên bảy container giữ chỗ 1,4 GB trước khi nó ra tay, và truncate huỷ trọn lịch sử — kể cả cái log lẽ ra giải thích được vì sao nó phình. max-size + max-file cho một cái trần cứng liên tục và giữ lại N file cuối.',
              'Nothing — truncation is the standard way to bound Docker logs|||Không có gì — cắt cụt là cách chuẩn để chặn trần log Docker',
              'It should use rm instead of truncate, which is faster|||Nên dùng rm thay cho truncate, vì nhanh hơn',
              'The threshold should be 500 MB rather than 200 MB|||Ngưỡng nên là 500 MB thay vì 200 MB',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why ship logs by tailing the file rather than POSTing them from inside the app?|||Vì sao nên thu log bằng cách tail file thay vì POST thẳng từ trong ứng dụng?',
            options: [
              'Because tailing puts the buffer on disk, where the OS manages tens of gigabytes, while an in-app HTTP transport puts the queue in your heap — the exact failure measured in lesson 1.5, now with a network on the far end. A log-store outage becomes an app outage.|||Vì tail đặt bộ đệm lên đĩa, nơi hệ điều hành quản lý hàng chục gigabyte, còn một transport HTTP trong app đặt hàng đợi vào heap của bạn — đúng cú hỏng đã đo ở bài 1.5, giờ với một đường mạng ở đầu kia. Một sự cố của kho log trở thành một sự cố của ứng dụng.',
              'Because tailing is faster and adds less latency|||Vì tail nhanh hơn và thêm ít độ trễ hơn',
              'Because HTTP transports cannot batch or retry|||Vì transport HTTP không gom lô hay thử lại được',
              'Because Docker forbids outbound HTTP from containers|||Vì Docker cấm container gửi HTTP ra ngoài',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'LOG_PIPELINE.md promotes msg to a Loki label. What does that cost, concretely?|||LOG_PIPELINE.md nâng msg lên làm nhãn Loki. Cái đó tốn gì, cụ thể?',
            options: [
              'src/ emits 325 distinct msg values, so container × level × msg is 9,100 streams instead of 28 — a 325× increase that lands within 10% of the default active-stream limit. Labels must be bounded and small; msg and route belong in the line, extracted with | json at query time.|||src/ phát ra 325 giá trị msg khác nhau, nên container × level × msg là 9.100 luồng thay vì 28 — tăng 325 lần và chạm tới trong vòng 10% hạn mức luồng hoạt động mặc định. Nhãn phải có chặn và nhỏ; msg và route thuộc về trong dòng log, bóc ra bằng | json lúc truy vấn.',
              'Nothing measurable — Loki indexes labels cheaply by design|||Không tốn gì đo được — Loki vốn thiết kế để đánh chỉ mục nhãn rẻ',
              'Slower queries, but no effect on storage or limits|||Truy vấn chậm hơn, nhưng không ảnh hưởng lưu trữ hay hạn mức',
              'It duplicates each line once per label value|||Nó nhân bản mỗi dòng một lần cho mỗi giá trị nhãn',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Measured on realistic log text, gzip -6 achieved 12.8×. Which decision does that number change?|||Đo trên chữ log thực tế, gzip -6 đạt 12,8×. Con số đó làm đổi quyết định nào?',
            options: [
              'Where the logs live, not how long you keep them: the same 30 days is 94.7 GB uncompressed on the local disk and 7.4 GB in a store that compresses chunks. And since managed Loki bills per GB ingested rather than stored, the real lever is volume — dropping debug, not logging successful health probes, sampling 200s.|||Chỗ log nằm, chứ không phải giữ chúng bao lâu: cùng 30 ngày là 94,7 GB không nén trên đĩa tại chỗ và 7,4 GB trong một kho có nén chunk. Và vì Loki dịch vụ tính tiền theo số GB nạp vào chứ không theo số GB lưu, cái cần bẩy thật sự là lượng — bỏ debug, không log những lần thăm dò sức khoẻ thành công, lấy mẫu các mã 200.',
              'It means retention can be set to forever at negligible cost|||Nghĩa là có thể đặt thời hạn lưu là mãi mãi với chi phí không đáng kể',
              'It means compression should be disabled, since CPU costs more|||Nghĩa là nên tắt nén, vì CPU đắt hơn',
              'Nothing — compression ratios are the same for all data|||Không gì cả — tỉ lệ nén thì như nhau với mọi dữ liệu',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'nginx returns 502, the backend log is clean, and Vector is configured with include_images = ["cuonghoangdev_backend"]. What happened?|||nginx trả 502, log backend sạch bong, và Vector cấu hình include_images = ["cuonghoangdev_backend"]. Chuyện gì đã xảy ra?',
            options: [
              'The backend never received the request, so the only evidence is in the nginx container — which the shipper was told to ignore. The filter also hides Postgres slow queries and the TTS container\'s OOM. A filtered pipeline looks perfectly healthy because everything it does collect arrives fine; ship every container and filter at query time.|||Backend chưa từng nhận được request, nên bằng chứng duy nhất nằm trong container nginx — thứ trình thu log được bảo là hãy lờ đi. Bộ lọc đó cũng giấu luôn truy vấn chậm của Postgres và OOM của container TTS. Một đường ống bị lọc trông khoẻ mạnh hoàn hảo vì mọi thứ nó có thu đều tới nơi tử tế; hãy thu mọi container rồi lọc lúc truy vấn.',
              'Vector dropped the lines because they were not valid JSON|||Vector vứt các dòng đó vì chúng không phải JSON hợp lệ',
              'The backend log rotated away before the shipper read it|||Log backend đã xoay vòng mất trước khi trình thu đọc tới',
              'A 502 is generated by the browser, so nothing is logged anywhere|||Mã 502 do trình duyệt sinh ra, nên chẳng có gì được log ở đâu cả',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
