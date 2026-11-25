/**
 * 13.1 — docker logs và docker events (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s13/docker'] (Docker 29 + Compose v5 trên máy lab; ứng dụng thử ./_demo/s13/c13: app.js, an-ram.js, dem.py, compose.yaml).
 * Chạy lại: bash _demo/s13/chay-s13.bash <thư mục> ⇒ giờ/ms đổi: soát số trong lời ("11 dòng stdout, 3 dòng stderr", "4 dòng FATAL", "10,2 s / 0,1 s").
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '13.1 — docker logs and docker events: -f, --since, --tail, -t, compose logs, exit codes 0/1/137/139/143|||13.1 — docker logs và docker events: -f, --since, --tail, -t, compose logs, mã thoát 0/1/137/139/143',
  slug: 'log-13-1-docker-logs',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đọc log container như người trực sự cố: log của container chỉ là stdout/stderr, tách hai luồng, --tail/--since/-t/-f, vì sao Python trong container "im lặng" (đệm stdout), container khởi động lại thì log nối tiếp, docker logs trống khi driver none hoặc container đã xoá, docker events thấy die/oom/kill, docker inspect State, và bảng mã thoát 0/1/137/139/143 — có cả 137 KHÔNG phải OOM.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.1</span>
<h2>Container logs: where they come from, and what the exit code is telling you</h2>
<p class="lead">From Chapter 7 you know where a Linux service writes its log. A container has no <code>/var/log</code> worth reading: by convention it writes to <strong>stdout and stderr</strong>, and Docker captures both streams. This lesson reads that capture like an on-call engineer: filter it by time, separate the two streams, notice when it is empty for the wrong reason, then use <code>docker events</code> and <code>docker inspect</code> to learn <em>how</em> the container died. How Docker stores and rotates these files (drivers, <code>max-size</code>) is taught in the Docker course; here we read.</p>

<h3>The everyday picture: the flight recorder and the control tower</h3>
<p>A plane carries a flight recorder: what the crew said, minute by minute (<code>docker logs</code>). The control tower keeps a separate book: "took off 07:04, lost contact 07:05, emergency landing" (<code>docker events</code>). And the accident report has one line in a box: <em>cause of the crash</em> (the exit code and <code>OOMKilled</code> in <code>docker inspect</code>). You need all three; the recorder alone does not say the plane ran out of fuel.</p>

<h3>Step 1 — a container's log is just its stdout and stderr</h3>
<p>The test app <code>c13/app.js</code> logs JSON to stdout and a warning to stderr every fourth tick:</p>
${ma('js', 's13/c13/app.js')}
${lenh('s13/docker', 0)}
${lenh('s13/docker', 1)}
<p>No file was configured anywhere: <code>console.log</code> and <code>console.error</code> are the log. That is the <strong>twelve-factor</strong> rule "treat logs as event streams" — the app writes, the platform (Docker, Kubernetes, systemd) collects. JSON lines and plain <code>WARN</code> lines are mixed because they come from two different streams.</p>

<h3>Step 2 — --tail, -t and the two streams</h3>
${lenh('s13/docker', 2)}
${lenh('s13/docker', 3)}
<ul>
<li><code>--tail 3</code> = last three lines. On a container that has run for weeks, <strong>always</strong> start with <code>--tail</code>: plain <code>docker logs</code> dumps everything since the container was created.</li>
<li><code>-t</code> adds the time <strong>Docker received</strong> the line, in UTC with nanoseconds. It exists even when the app prints no time at all — and it is the only timestamp you get for crash text.</li>
</ul>
${lenh('s13/docker', 4)}
${lenh('s13/docker', 5)}
<p><code>docker logs</code> replays stdout to your stdout and stderr to your stderr. So <code>2&gt;/dev/null</code> keeps 11 stdout lines, and <code>2&gt;&amp;1 &gt;/dev/null</code> keeps only the 3 stderr lines. This bites people every week: <code>docker logs api | grep ERROR</code> misses errors written to stderr, because the pipe only carries stdout. Write <code>docker logs api 2&gt;&amp;1 | grep …</code>.</p>
${lenh('s13/docker', 6)}
${lenh('s13/docker', 7)}
<p>Since stdout is clean JSON, jq works directly (with <code>2&gt;/dev/null</code> so the WARN lines do not break it — lesson 2.4). <code>--since 3s</code> (also <code>10m</code>, <code>2h</code>, or an RFC 3339 time like <code>2026-11-24T00:01:40</code>) and <code>--until</code> cut by Docker's receive time, not by the <code>time</code> field inside your JSON.</p>

<h3>Step 3 — where the lines are kept, and how long</h3>
${lenh('s13/docker', 8)}
<p>This machine's daemon uses <code>json-file</code> with <code>max-size 10m, max-file 3</code>: at most ~30 MB per container, older lines are gone. Docker's own default is json-file <strong>without</strong> rotation (the disk fills up), so check this line on every server you inherit. The log lives as long as the <em>container</em> exists — not as long as it runs:</p>
${lenh('s13/docker', 25)}
${lenh('s13/docker', 26)}
<p>With the <code>none</code> driver nothing is kept; after <code>docker rm</code> (or <code>docker compose down</code>, or <code>--rm</code>) the log is deleted with the container. If logs matter for an investigation, they must be shipped somewhere else <em>before</em> the container is removed — that is Chapter 15.</p>

<h3>Step 4 — "the container prints nothing": stdout buffering</h3>
${ma('python', 's13/c13/dem.py')}
${lenh('s13/docker', 9)}
${lenh('s13/docker', 10)}
${lenh('s13/docker', 11)}
<p>Same script, two behaviours. When stdout is not a terminal, Python (and C's stdio, and many others) collects output in a buffer and writes it in blocks. After 3 seconds the first container had printed <strong>0</strong> lines; when it exited, all five arrived in the same microsecond — the timestamps are useless. With <code>PYTHONUNBUFFERED=1</code> (or <code>python -u</code>) each line arrives when it is printed, one second apart. Node's <code>console.log</code> to a pipe is effectively unbuffered, Java's <code>System.out</code> flushes per line by default, but Python, Ruby and C programs need the flag. Worse: if the process <em>crashes</em>, the buffer is never written — you will see this in Lab 13.</p>

<h3>Step 5 — a restart loop: the log is continuous, the exit code is in inspect</h3>
<p>Now the same app without <code>DB_URL</code>, with a restart policy:</p>
${lenh('s13/docker', 12)}
${lenh('s13/docker', 13)}
${lenh('s13/docker', 14)}
${lenh('s13/docker', 15)}
${lenh('s13/docker', 16)}
<p>Read it in this order:</p>
<ol>
<li><code>docker ps -a</code>: <em>Exited (1)</em> — the process chose to exit with code 1.</li>
<li><code>docker inspect</code>: <code>RestartCount=3</code> — Docker restarted it three times (the <code>on-failure:3</code> limit) and gave up.</li>
<li><code>docker logs</code> keeps the output of <strong>all</strong> runs of the same container, back to back. Four identical crash reports = 1 start + 3 restarts. <code>-t | grep FATAL</code> shows the restart rhythm (Docker doubles the delay each time).</li>
<li>The first line of each crash is the reason: <code>FATAL: thiếu biến môi trường DB_URL</code>; the stack frame <code>/app/app.js:6</code> is where it was detected (lesson 10.4).</li>
</ol>

<h3>Step 6 — docker events: the control tower</h3>
${lenh('s13/docker', 17)}
<p><code>docker events</code> is the daemon's own log: create, start, die (with <code>exitCode</code>), oom, kill (with the signal), stop, destroy, health_status… Here it proves the loop: four <code>start</code>/<code>die exitCode=1</code> pairs within a second. Two details:</p>
<ul>
<li>Without <code>--since</code>/<code>--until</code> the command waits forever for new events (like <code>tail -f</code>). With them it prints a window and exits. The daemon keeps only a limited number of recent events in memory (the documentation mentions 256) — they are not a history; ship them if you need them.</li>
<li>The times above are <strong>07:04</strong> while <code>docker logs -t</code> said <strong>00:04</strong>: <code>awk strftime</code> uses the machine's time zone (UTC+7), Docker prints UTC. Same moment, two clocks — lesson 1.5.</li>
</ul>

<h3>Step 7 — exit codes: how did it die?</h3>
<p>Six containers, six endings. 0 and 1 are chosen by the program; above 128 means "killed by signal number <em>code − 128</em>":</p>
${lenh('s13/docker', 18)}
${lenh('s13/docker', 19)}
${lenh('s13/docker', 20)}
${lenh('s13/docker', 21)}
${lenh('s13/docker', 22)}
${lenh('s13/docker', 23)}
${lenh('s13/docker', 24)}
<table>
<thead><tr><th>Exit code</th><th>Meaning</th><th>Evidence to confirm</th><th>First thing to check</th></tr></thead>
<tbody>
<tr><td><code>0</code></td><td>Program finished normally</td><td><code>die 0</code></td><td>Was it supposed to stop? (a "server" that exits 0 usually ran out of work or lost its foreground process)</td></tr>
<tr><td><code>1</code> (or 2, 3…)</td><td>Program decided to fail</td><td>The last lines of <code>docker logs</code></td><td>Config, missing env, cannot reach DB, uncaught exception</td></tr>
<tr><td><code>137</code> = 128+9</td><td>SIGKILL</td><td><code>OOMKilled=true</code> + event <code>oom</code> ⇒ memory limit; otherwise someone/something killed it</td><td><code>docker stats</code>, <code>-m</code>; or a slow shutdown (below)</td></tr>
<tr><td><code>139</code> = 128+11</td><td>SIGSEGV, segmentation fault</td><td>No OOM; often <em>no log</em> at all</td><td>Native code: C extensions, image libraries, drivers, wrong CPU architecture</td></tr>
<tr><td><code>143</code> = 128+15</td><td>SIGTERM, polite stop</td><td>event <code>kill 15</code> then <code>die 143</code></td><td>Normal for <code>docker stop</code> when the app has no handler; harmless</td></tr>
<tr><td><code>125/126/127</code></td><td>Docker could not run it / command not executable / not found</td><td>The error is printed by <code>docker run</code>, not in the container log</td><td>Typo in command or entrypoint, missing binary in the image</td></tr>
</tbody></table>
<div class="pitfall co-tieu-de"><p><strong>"137 = out of memory." Not always.</strong> <code>lgz-stop</code> also ended with 137, but <code>OOMKilled=false</code>, and <code>docker stop</code> took 10.2 s. <code>sleep</code> was PID 1 without a SIGTERM handler, so it ignored the polite signal; after the 10-second grace period Docker sent SIGKILL (events: <code>kill 15</code>, ten seconds later <code>kill 9</code>, <code>die 137</code>). With <code>--init</code> a tiny init forwarded SIGTERM and it stopped in 0.1 s with 143. So: 137 + OOMKilled=true = memory; 137 + <code>kill 9</code> 10 s after <code>kill 15</code> = slow shutdown (every deploy waits 10 s and cuts requests). Memory limits and graceful shutdown in depth: Docker course 11.2 and 11.4.</p></div>

<h3>Step 8 — docker compose logs: many services, one stream</h3>
${ma('yaml', 's13/c13/compose.yaml')}
${lenh('s13/docker', 27)}
${lenh('s13/docker', 28)}
${lenh('s13/docker', 29)}
${lenh('s13/docker', 30)}
${lenh('s13/docker', 31)}
<p><code>compose logs</code> prefixes each line with <code>service-N |</code> (N = replica number). Without <code>-f</code> it prints service by service — <strong>not</strong> in time order across services. To see what happened at the same moment in api and worker, add <code>-t</code> and sort by the timestamp column (the second command: worker's <code>tick 1</code> lands between api lines). <code>--no-log-prefix</code> gives clean lines for jq; <code>compose logs api worker</code> limits to some services; <code>-f --since 5m</code> follows live.</p>

<h3>Hacker's corner: what the container log gives away</h3>
<p>Many apps print their whole config at startup "to help debugging" — database URL with password, API keys. In a container that output stays in <code>docker logs</code> as long as the container exists, and <code>docker inspect</code> shows every <code>-e</code> environment variable in clear text. Anyone in the <code>docker</code> group can read both — and membership of that group is effectively root on the host. Environment variables are a favourite target: in the <strong>Codecov</strong> incident (from 31 January 2021, disclosed April 2021) attackers modified Codecov's Bash Uploader script so that it exported the environment of customers' CI jobs — tokens and keys that were simply sitting in env. Rules: never log config values or env; pass secrets as files (Docker/Kubernetes secrets) rather than <code>-e</code>; treat log access and docker-group membership as privileged. More in lesson 16.3.</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>OJT, the first "it keeps restarting" ticket:</strong> run three commands before touching anything — <code>docker ps -a</code> (status + code), <code>docker inspect -f '{{.RestartCount}} {{.State.ExitCode}} {{.State.OOMKilled}}'</code>, <code>docker logs --tail 50 -t</code>. Paste all three into the ticket. Half the time the answer is already in the last ten lines.</li>
<li><strong>Your Spring Boot app on a VPS dies every night at 02:10 with 137:</strong> <code>OOMKilled=true</code> ⇒ the container limit is lower than the JVM's idea of its heap (Docker course 11.2). <code>OOMKilled=false</code> ⇒ look for a cron job doing <code>docker restart</code> or an orchestrator health check.</li>
<li><strong>"docker logs shows nothing, but the worker is running":</strong> Python without <code>-u</code>, a log level filtering everything, or the app writing to a file inside the container (then <code>docker exec … tail /app/logs/app.log</code>, and ask the team to log to stdout).</li>
</ul>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
<li>Start <code>c13/app.js</code> as in step 1, then print only the stderr lines with Docker's receive time.</li>
<li>Run <code>docker run --name t1 alpine sh -c 'exit 3'</code>, <code>docker run --name t2 alpine nosuchcmd</code>. Note the two codes and where each error message appears.</li>
<li>Start <code>docker run -d --name t3 alpine sleep 600</code>, then <code>docker kill t3</code> (no stop). Read the code, <code>OOMKilled</code> and the events.</li>
<li>Run <code>dem.py</code> once without and once with <code>-u</code> (<code>python3 -u /w/dem.py</code>) and compare <code>docker logs -t</code>.</li>
</ol>
<p><strong>Done when:</strong> 1 shows three <code>WARN slow query</code> lines with UTC timestamps (<code>docker logs -t app 2&gt;&amp;1 &gt;/dev/null</code>); 2 gives 3 (your program's choice, nothing in the log) and 127 (error printed by <code>docker run</code>: executable file not found); 3 gives 137, <code>OOMKilled=false</code>, a single <code>kill</code> event with signal 9 and no signal 15; 4 shows five lines with identical timestamps vs one second apart. Clean up: <code>docker rm -f t1 t2 t3</code>.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['stdout / stderr', 'The two output streams Docker captures as the container log; pipes carry only stdout unless you add 2>&1.'],
  ['docker logs -t / --since / --tail / -f', 'Receive timestamp (UTC), time window, last N lines, follow live.'],
  ['log driver', 'Where Docker stores the stream: json-file (default), local, none, journald, syslog, fluentd, awslogs…'],
  ['docker events', 'The daemon\'s event stream: start, die (exitCode), oom, kill (signal), health_status; in memory only.'],
  ['exit code > 128', 'Killed by signal (code − 128): 137 SIGKILL, 139 SIGSEGV, 143 SIGTERM.'],
  ['OOMKilled', 'Flag in docker inspect: the kernel killed the container for exceeding its memory limit.'],
  ['--init', 'Runs a tiny init as PID 1 that forwards signals, so docker stop works in time.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A container's log = its stdout + stderr; <code>2&gt;&amp;1</code> before every pipe.</li>
<li>Start with <code>--tail</code> and <code>-t</code>; <code>--since/--until</code> cut by receive time.</li>
<li>The log survives restarts but not <code>docker rm</code>; <code>none</code> keeps nothing.</li>
<li>Empty log while running: suspect stdout buffering (<code>PYTHONUNBUFFERED=1</code>).</li>
<li>How it died: exit code + <code>OOMKilled</code> + <code>docker events</code>. 137 is OOM only if OOMKilled=true.</li>
<li>compose logs is not time-ordered across services: <code>-t</code> and sort.</li>
</ul>
${nguon('📘', 'docker container logs', 'Options --since, --until, --tail, -t, --details', 'https://docs.docker.com/reference/cli/docker/container/logs/')}
${nguon('📘', 'docker system events', 'Event types, filters, the "die" exitCode and "kill" signal attributes', 'https://docs.docker.com/reference/cli/docker/system/events/')}
${nguon('🛡️', 'Codecov — Bash Uploader Security Update (2021)', 'Modified script exported CI environment variables from 31 Jan 2021', 'https://about.codecov.io/security-update/')}
${lienKet({ khoa: 'docker', bai: 'dk-11-3-log', title: 'Docker 11.3 — Logs', sub: 'Drivers, max-size, cleaning a disk full of logs', cta: 'Open lesson' })}
${lienKet({ khoa: 'docker', bai: 'dk-11-2-han-muc-137', title: 'Docker 11.2 — Limits and 137', sub: 'Memory/CPU limits, two kinds of OOM kill', cta: 'Open lesson' })}
${lienKet({ khoa: 'docker', bai: 'dk-11-1-restart', title: 'Docker 11.1 — Restart policies', sub: 'Backoff and recognising a crash loop', cta: 'Open lesson' })}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-2-1-docker-bat-log', title: 'Observability 2.1 — How Docker captures logs', sub: 'The json-file envelope around your JSON', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.1</span>
<h2>Log container: chúng từ đâu ra, và mã thoát đang nói gì với bạn</h2>
<p class="lead">Từ Chương 7 bạn đã biết một dịch vụ Linux ghi log vào đâu. Container thì không có <code>/var/log</code> nào đáng đọc: theo quy ước, nó ghi ra <strong>stdout và stderr</strong>, và Docker thu cả hai luồng. Bài này đọc phần thu được đó như một kỹ sư trực sự cố: lọc theo thời gian, tách hai luồng, nhận ra khi log trống vì lý do sai, rồi dùng <code>docker events</code> và <code>docker inspect</code> để biết container đã chết <em>thế nào</em>. Cách Docker lưu và xoay các tệp này (driver, <code>max-size</code>) được dạy ở khoá Docker; ở đây ta đọc.</p>

<h3>Liên tưởng đời thường: hộp đen và đài kiểm soát không lưu</h3>
<p>Máy bay mang hộp đen: tổ lái đã nói gì, từng phút một (<code>docker logs</code>). Đài kiểm soát giữ một cuốn sổ riêng: "cất cánh 07:04, mất liên lạc 07:05, hạ cánh khẩn cấp" (<code>docker events</code>). Còn biên bản tai nạn có một ô ghi đúng một dòng: <em>nguyên nhân</em> (mã thoát và <code>OOMKilled</code> trong <code>docker inspect</code>). Bạn cần cả ba; riêng hộp đen không cho biết máy bay đã hết nhiên liệu.</p>

<h3>Bước 1 — log của container chỉ là stdout và stderr của nó</h3>
<p>Ứng dụng thử <code>c13/app.js</code> ghi JSON ra stdout, và cứ mỗi lần thứ tư thì ghi một cảnh báo ra stderr:</p>
${ma('js', 's13/c13/app.js')}
${lenh('s13/docker', 0)}
${lenh('s13/docker', 1)}
<p>Không hề cấu hình tệp nào: <code>console.log</code> và <code>console.error</code> chính là log. Đó là quy tắc <strong>twelve-factor</strong> "coi log là luồng sự kiện" — ứng dụng chỉ việc ghi, nền tảng (Docker, Kubernetes, systemd) thu gom. Dòng JSON và dòng <code>WARN</code> trơn trộn lẫn vì chúng đến từ hai luồng khác nhau.</p>

<h3>Bước 2 — --tail, -t và hai luồng</h3>
${lenh('s13/docker', 2)}
${lenh('s13/docker', 3)}
<ul>
<li><code>--tail 3</code> = ba dòng cuối. Với container đã chạy nhiều tuần, <strong>luôn</strong> bắt đầu bằng <code>--tail</code>: <code>docker logs</code> trơn sẽ đổ ra mọi thứ từ lúc container được tạo.</li>
<li><code>-t</code> thêm thời điểm <strong>Docker nhận</strong> dòng đó, theo UTC, tới nano giây. Nó có kể cả khi ứng dụng không in giờ — và là mốc giờ duy nhất bạn có cho chữ của một cú sập.</li>
</ul>
${lenh('s13/docker', 4)}
${lenh('s13/docker', 5)}
<p><code>docker logs</code> phát lại stdout vào stdout của bạn và stderr vào stderr của bạn. Nên <code>2&gt;/dev/null</code> giữ 11 dòng stdout, còn <code>2&gt;&amp;1 &gt;/dev/null</code> chỉ giữ 3 dòng stderr. Lỗi này cắn người ta hằng tuần: <code>docker logs api | grep ERROR</code> bỏ sót lỗi ghi ra stderr, vì ống chỉ chở stdout. Hãy viết <code>docker logs api 2&gt;&amp;1 | grep …</code>.</p>
${lenh('s13/docker', 6)}
${lenh('s13/docker', 7)}
<p>Vì stdout là JSON sạch nên jq chạy thẳng được (kèm <code>2&gt;/dev/null</code> để dòng WARN không làm hỏng — bài 2.4). <code>--since 3s</code> (hoặc <code>10m</code>, <code>2h</code>, hay giờ RFC 3339 kiểu <code>2026-11-24T00:01:40</code>) và <code>--until</code> cắt theo giờ Docker nhận, không theo trường <code>time</code> trong JSON của bạn.</p>

<h3>Bước 3 — dòng log được giữ ở đâu, và bao lâu</h3>
${lenh('s13/docker', 8)}
<p>Daemon của máy này dùng <code>json-file</code> với <code>max-size 10m, max-file 3</code>: mỗi container tối đa ~30 MB, dòng cũ hơn thì mất. Mặc định gốc của Docker là json-file <strong>không</strong> xoay (đĩa sẽ đầy), nên hãy kiểm dòng này trên mọi máy chủ bạn tiếp quản. Log sống lâu bằng <em>container</em> — không phải bằng thời gian nó chạy:</p>
${lenh('s13/docker', 25)}
${lenh('s13/docker', 26)}
<p>Với driver <code>none</code> thì không giữ gì; sau <code>docker rm</code> (hoặc <code>docker compose down</code>, hoặc <code>--rm</code>) log bị xoá cùng container. Nếu log quan trọng cho một cuộc điều tra, nó phải được gửi đi nơi khác <em>trước khi</em> container bị xoá — đó là Chương 15.</p>

<h3>Bước 4 — "container chẳng in gì": đệm stdout</h3>
${ma('python', 's13/c13/dem.py')}
${lenh('s13/docker', 9)}
${lenh('s13/docker', 10)}
${lenh('s13/docker', 11)}
<p>Cùng một script, hai cách cư xử. Khi stdout không phải terminal, Python (cũng như stdio của C và nhiều thứ khác) gom output vào bộ đệm rồi ghi theo khối. Sau 3 giây, container đầu đã in <strong>0</strong> dòng; khi nó thoát, cả năm dòng đến trong cùng một micro giây — mốc giờ thành vô dụng. Với <code>PYTHONUNBUFFERED=1</code> (hoặc <code>python -u</code>) mỗi dòng đến đúng lúc được in, cách nhau một giây. <code>console.log</code> của Node khi ghi vào ống gần như không đệm, <code>System.out</code> của Java mặc định đẩy theo từng dòng, nhưng chương trình Python, Ruby và C cần cờ này. Tệ hơn: nếu tiến trình <em>sập</em>, bộ đệm không bao giờ được ghi ra — bạn sẽ gặp chuyện này ở Lab 13.</p>

<h3>Bước 5 — một vòng lặp khởi động lại: log liền mạch, mã thoát nằm trong inspect</h3>
<p>Giờ là cùng ứng dụng đó nhưng thiếu <code>DB_URL</code>, có chính sách khởi động lại:</p>
${lenh('s13/docker', 12)}
${lenh('s13/docker', 13)}
${lenh('s13/docker', 14)}
${lenh('s13/docker', 15)}
${lenh('s13/docker', 16)}
<p>Đọc theo thứ tự này:</p>
<ol>
<li><code>docker ps -a</code>: <em>Exited (1)</em> — tiến trình tự chọn thoát với mã 1.</li>
<li><code>docker inspect</code>: <code>RestartCount=3</code> — Docker đã khởi động lại nó ba lần (giới hạn <code>on-failure:3</code>) rồi bỏ cuộc.</li>
<li><code>docker logs</code> giữ output của <strong>mọi</strong> lần chạy của cùng một container, nối đuôi nhau. Bốn bản báo sập giống hệt = 1 lần chạy + 3 lần khởi động lại. <code>-t | grep FATAL</code> cho thấy nhịp khởi động lại (Docker nhân đôi độ trễ mỗi lần).</li>
<li>Dòng đầu của mỗi cú sập là lý do: <code>FATAL: thiếu biến môi trường DB_URL</code>; khung stack <code>/app/app.js:6</code> là chỗ phát hiện ra (bài 10.4).</li>
</ol>

<h3>Bước 6 — docker events: đài kiểm soát không lưu</h3>
${lenh('s13/docker', 17)}
<p><code>docker events</code> là log riêng của daemon: create, start, die (kèm <code>exitCode</code>), oom, kill (kèm tín hiệu), stop, destroy, health_status… Ở đây nó chứng minh vòng lặp: bốn cặp <code>start</code>/<code>die exitCode=1</code> trong vòng một giây. Hai chi tiết:</p>
<ul>
<li>Không có <code>--since</code>/<code>--until</code> thì lệnh chờ sự kiện mới mãi mãi (giống <code>tail -f</code>). Có chúng thì in ra một khoảng rồi thoát. Daemon chỉ giữ một số ít sự kiện gần nhất trong bộ nhớ (tài liệu nhắc tới con số 256) — đó không phải lịch sử; cần thì phải gửi đi lưu.</li>
<li>Giờ ở trên là <strong>07:04</strong> trong khi <code>docker logs -t</code> nói <strong>00:04</strong>: <code>strftime</code> của awk dùng múi giờ của máy (UTC+7), Docker in UTC. Cùng một khoảnh khắc, hai đồng hồ — bài 1.5.</li>
</ul>

<h3>Bước 7 — mã thoát: nó đã chết thế nào?</h3>
<p>Sáu container, sáu cái kết. 0 và 1 do chương trình chọn; trên 128 nghĩa là "bị giết bởi tín hiệu số <em>mã − 128</em>":</p>
${lenh('s13/docker', 18)}
${lenh('s13/docker', 19)}
${lenh('s13/docker', 20)}
${lenh('s13/docker', 21)}
${lenh('s13/docker', 22)}
${lenh('s13/docker', 23)}
${lenh('s13/docker', 24)}
<table>
<thead><tr><th>Mã thoát</th><th>Nghĩa</th><th>Bằng chứng để xác nhận</th><th>Việc kiểm đầu tiên</th></tr></thead>
<tbody>
<tr><td><code>0</code></td><td>Chương trình kết thúc bình thường</td><td><code>die 0</code></td><td>Nó có phải dừng không? ("máy chủ" mà thoát 0 thường là hết việc hoặc mất tiến trình tiền cảnh)</td></tr>
<tr><td><code>1</code> (hoặc 2, 3…)</td><td>Chương trình tự quyết định thất bại</td><td>Mấy dòng cuối của <code>docker logs</code></td><td>Cấu hình, thiếu biến môi trường, không tới được DB, ngoại lệ không bắt</td></tr>
<tr><td><code>137</code> = 128+9</td><td>SIGKILL</td><td><code>OOMKilled=true</code> + sự kiện <code>oom</code> ⇒ hạn mức bộ nhớ; nếu không thì ai/cái gì đó đã giết nó</td><td><code>docker stats</code>, <code>-m</code>; hoặc dừng chậm (xem dưới)</td></tr>
<tr><td><code>139</code> = 128+11</td><td>SIGSEGV, lỗi phân đoạn bộ nhớ</td><td>Không OOM; thường <em>không có log</em> nào</td><td>Mã gốc: phần mở rộng C, thư viện ảnh, driver, sai kiến trúc CPU</td></tr>
<tr><td><code>143</code> = 128+15</td><td>SIGTERM, yêu cầu dừng lịch sự</td><td>sự kiện <code>kill 15</code> rồi <code>die 143</code></td><td>Bình thường với <code>docker stop</code> khi ứng dụng không bắt tín hiệu; vô hại</td></tr>
<tr><td><code>125/126/127</code></td><td>Docker không chạy được / lệnh không thực thi được / không tìm thấy</td><td>Lỗi do <code>docker run</code> in ra, không nằm trong log container</td><td>Gõ sai command hay entrypoint, ảnh thiếu tệp chạy</td></tr>
</tbody></table>
<div class="pitfall co-tieu-de"><p><strong>"137 = hết bộ nhớ." Không phải lúc nào cũng vậy.</strong> <code>lgz-stop</code> cũng kết thúc với 137, nhưng <code>OOMKilled=false</code>, và <code>docker stop</code> mất 10,2 giây. <code>sleep</code> là PID 1 không có trình xử lý SIGTERM nên lờ tín hiệu lịch sự; hết 10 giây ân hạn, Docker gửi SIGKILL (sự kiện: <code>kill 15</code>, mười giây sau <code>kill 9</code>, <code>die 137</code>). Với <code>--init</code>, một init tí hon chuyển tiếp SIGTERM và nó dừng trong 0,1 giây với 143. Vậy: 137 + OOMKilled=true = bộ nhớ; 137 + <code>kill 9</code> 10 giây sau <code>kill 15</code> = dừng chậm (mỗi lần deploy đều chờ 10 giây và cắt ngang request). Hạn mức bộ nhớ và dừng êm chuyên sâu: khoá Docker bài 11.2 và 11.4.</p></div>

<h3>Bước 8 — docker compose logs: nhiều dịch vụ, một luồng</h3>
${ma('yaml', 's13/c13/compose.yaml')}
${lenh('s13/docker', 27)}
${lenh('s13/docker', 28)}
${lenh('s13/docker', 29)}
${lenh('s13/docker', 30)}
${lenh('s13/docker', 31)}
<p><code>compose logs</code> gắn trước mỗi dòng tiền tố <code>dịch-vụ-N |</code> (N = số thứ tự bản sao). Không có <code>-f</code> thì nó in lần lượt từng dịch vụ — <strong>không</strong> theo thứ tự thời gian giữa các dịch vụ. Muốn xem cùng một lúc api và worker đã làm gì, thêm <code>-t</code> rồi sắp theo cột giờ (lệnh thứ hai: <code>tick 1</code> của worker rơi vào giữa các dòng api). <code>--no-log-prefix</code> cho dòng sạch để đưa vào jq; <code>compose logs api worker</code> chỉ lấy vài dịch vụ; <code>-f --since 5m</code> theo dõi trực tiếp.</p>

<h3>Góc hacker: log container để lộ những gì</h3>
<p>Nhiều ứng dụng in toàn bộ cấu hình lúc khởi động "cho dễ gỡ lỗi" — URL cơ sở dữ liệu kèm mật khẩu, khoá API. Trong container, output đó nằm lại trong <code>docker logs</code> chừng nào container còn, và <code>docker inspect</code> hiện mọi biến môi trường <code>-e</code> ở dạng rõ. Ai thuộc nhóm <code>docker</code> cũng đọc được cả hai — mà thuộc nhóm đó thì gần như là root trên máy. Biến môi trường là mục tiêu ưa thích: trong vụ <strong>Codecov</strong> (từ 31/01/2021, công bố tháng 4/2021), kẻ tấn công sửa script Bash Uploader của Codecov để nó xuất môi trường của các job CI của khách hàng — token và khoá cứ thế nằm sẵn trong env. Quy tắc: không bao giờ log giá trị cấu hình hay env; truyền bí mật bằng tệp (secret của Docker/Kubernetes) thay vì <code>-e</code>; coi quyền đọc log và quyền thuộc nhóm docker là quyền đặc biệt. Thêm ở bài 16.3.</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>OJT, ticket "nó cứ khởi động lại" đầu tiên:</strong> chạy ba lệnh trước khi đụng vào bất cứ thứ gì — <code>docker ps -a</code> (trạng thái + mã), <code>docker inspect -f '{{.RestartCount}} {{.State.ExitCode}} {{.State.OOMKilled}}'</code>, <code>docker logs --tail 50 -t</code>. Dán cả ba vào ticket. Một nửa số lần, câu trả lời đã nằm sẵn trong mười dòng cuối.</li>
<li><strong>App Spring Boot của bạn trên VPS chết mỗi đêm lúc 02:10 với 137:</strong> <code>OOMKilled=true</code> ⇒ hạn mức container thấp hơn mức heap JVM tự tính (khoá Docker 11.2). <code>OOMKilled=false</code> ⇒ tìm một cron job chạy <code>docker restart</code> hoặc health check của bộ điều phối.</li>
<li><strong>"docker logs không có gì, mà worker vẫn đang chạy":</strong> Python thiếu <code>-u</code>, mức log lọc mất mọi thứ, hoặc ứng dụng ghi vào một tệp bên trong container (khi đó <code>docker exec … tail /app/logs/app.log</code>, và đề nghị cả đội log ra stdout).</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy <code>c13/app.js</code> như bước 1, rồi chỉ in các dòng stderr kèm giờ Docker nhận.</li>
<li>Chạy <code>docker run --name t1 alpine sh -c 'exit 3'</code>, <code>docker run --name t2 alpine nosuchcmd</code>. Ghi lại hai mã và xem thông báo lỗi của mỗi cái hiện ở đâu.</li>
<li>Chạy <code>docker run -d --name t3 alpine sleep 600</code>, rồi <code>docker kill t3</code> (không stop). Đọc mã, <code>OOMKilled</code> và các sự kiện.</li>
<li>Chạy <code>dem.py</code> một lần không có và một lần có <code>-u</code> (<code>python3 -u /w/dem.py</code>), so sánh <code>docker logs -t</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 ra ba dòng <code>WARN slow query</code> kèm giờ UTC (<code>docker logs -t app 2&gt;&amp;1 &gt;/dev/null</code>); câu 2 ra 3 (do chương trình chọn, log không có gì) và 127 (lỗi do <code>docker run</code> in: executable file not found); câu 3 ra 137, <code>OOMKilled=false</code>, một sự kiện <code>kill</code> duy nhất với tín hiệu 9 và không có tín hiệu 15; câu 4 cho năm dòng cùng mốc giờ so với cách nhau một giây. Dọn: <code>docker rm -f t1 t2 t3</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['stdout / stderr', 'Hai luồng output Docker thu làm log container; ống chỉ chở stdout trừ khi thêm 2>&1.'],
  ['docker logs -t / --since / --tail / -f', 'Giờ nhận (UTC), khoảng thời gian, N dòng cuối, theo dõi trực tiếp.'],
  ['log driver', 'Nơi Docker lưu luồng: json-file (mặc định), local, none, journald, syslog, fluentd, awslogs…'],
  ['docker events', 'Luồng sự kiện của daemon: start, die (exitCode), oom, kill (tín hiệu), health_status; chỉ trong bộ nhớ.'],
  ['mã thoát > 128', 'Bị giết bởi tín hiệu (mã − 128): 137 SIGKILL, 139 SIGSEGV, 143 SIGTERM.'],
  ['OOMKilled', 'Cờ trong docker inspect: nhân đã giết container vì vượt hạn mức bộ nhớ.'],
  ['--init', 'Chạy một init tí hon làm PID 1 để chuyển tiếp tín hiệu, giúp docker stop dừng đúng lúc.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Log của container = stdout + stderr của nó; <code>2&gt;&amp;1</code> trước mọi ống.</li>
<li>Bắt đầu bằng <code>--tail</code> và <code>-t</code>; <code>--since/--until</code> cắt theo giờ nhận.</li>
<li>Log sống qua các lần khởi động lại nhưng không qua <code>docker rm</code>; <code>none</code> không giữ gì.</li>
<li>Log trống trong khi vẫn chạy: nghi đệm stdout (<code>PYTHONUNBUFFERED=1</code>).</li>
<li>Chết thế nào: mã thoát + <code>OOMKilled</code> + <code>docker events</code>. 137 chỉ là OOM khi OOMKilled=true.</li>
<li>compose logs không xếp theo thời gian giữa các dịch vụ: <code>-t</code> rồi sắp.</li>
</ul>
${nguon('📘', 'docker container logs', 'Tuỳ chọn --since, --until, --tail, -t, --details', 'https://docs.docker.com/reference/cli/docker/container/logs/')}
${nguon('📘', 'docker system events', 'Loại sự kiện, bộ lọc, thuộc tính exitCode của "die" và signal của "kill"', 'https://docs.docker.com/reference/cli/docker/system/events/')}
${nguon('🛡️', 'Codecov — Bash Uploader Security Update (2021)', 'Script bị sửa xuất biến môi trường CI từ 31/01/2021', 'https://about.codecov.io/security-update/')}
${lienKet({ khoa: 'docker', bai: 'dk-11-3-log', title: 'Docker 11.3 — Log', sub: 'Driver, max-size, dọn một ổ đĩa đầy vì log', cta: 'Mở bài' })}
${lienKet({ khoa: 'docker', bai: 'dk-11-2-han-muc-137', title: 'Docker 11.2 — Hạn mức và 137', sub: 'Hạn mức RAM/CPU, hai kiểu giết OOM', cta: 'Mở bài' })}
${lienKet({ khoa: 'docker', bai: 'dk-11-1-restart', title: 'Docker 11.1 — Chính sách restart', sub: 'Độ trễ tăng dần và nhận ra vòng lặp sập', cta: 'Mở bài' })}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-2-1-docker-bat-log', title: 'Observability 2.1 — Docker bắt log thế nào', sub: 'Phong bì json-file bọc ngoài JSON của bạn', cta: 'Mở bài' })}
</div>
`,
};
