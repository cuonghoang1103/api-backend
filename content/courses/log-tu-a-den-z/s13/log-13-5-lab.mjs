/**
 * 13.5 — Lab 13: một container cứ khởi động lại (soạn 24/11/2026, agent lgz).
 * Lab: ./_demo/s13/lab13 (compose.yaml + app.js + an-ram.js + thumb.py; ảnh node:22-alpine, python:3.13-alpine).
 * Đáp án chạy thật: CODE['s13/lab13.bash'] + OUT['s13/lab13'] (Docker 29, Compose v5). Phần Kubernetes tuỳ chọn dùng lại OUT['s13/k8s'].
 */
import { ma, ra, lenh, kv } from '../_chung.mjs';

export default {
  title: 'Lab 13 — A container that keeps restarting: logs, events, inspect and exit codes|||Lab 13 — Một container cứ khởi động lại: logs, events, inspect và mã thoát',
  slug: 'log-13-5-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Stack compose "lab13" có ba dịch vụ cứ chết: api thoát 1 rồi khởi động lại 3 lần, worker bị OOMKilled 137 ở hạn mức 64 MiB, thumb chết 139 mà docker logs trống trơn vì Python đệm stdout. Chỉ dùng lệnh đọc (ps, logs, inspect, events) để tìm đủ ba nguyên nhân kèm bằng chứng, rồi chứng minh nguyên nhân thứ ba bằng PYTHONUNBUFFERED và -X faulthandler; viết báo cáo 5 dòng; phần thêm làm lại trên Kubernetes.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lab 13</span>
<h2>Three services keep dying — find out why using only read commands</h2>
<p class="lead">Monday, 09:05. The team chat: "staging stack lab13 is down again, can someone look? I already restarted it twice." You have read access to the Docker host. Your job: say <em>for each service</em> how it died and why, with one piece of evidence each — before anybody edits a file or restarts anything again.</p>

<h3>Rules</h3>
<ul>
<li>Allowed: <code>docker compose ps</code>, <code>docker compose logs</code>, <code>docker logs</code>, <code>docker inspect</code>, <code>docker events</code>, <code>docker stats</code>. Not allowed before you answer: opening <code>app.js</code>, <code>an-ram.js</code>, <code>thumb.py</code> or <code>compose.yaml</code>.</li>
<li>For the last question you may run the service once more with a changed environment variable (<code>docker compose run</code>) — that is an experiment, not a fix.</li>
</ul>

<h3>Setup (5 min)</h3>
<p>Copy the folder <code>_demo/s13/lab13</code> (four files) to your machine, then:</p>
<pre><code class="language-bash">cd lab13
docker compose up -d
# wait about 20 seconds, then start investigating</code></pre>

<h3>The questions</h3>
<ol>
<li>What is the status and exit code of each service? Which ones were restarted, how many times, and by what policy?</li>
<li><code>api</code>: why does it exit? Quote the line.</li>
<li><code>worker</code>: how did it die? Prove it is (or is not) memory, and give the limit.</li>
<li><code>thumb</code>: what does its log say? What does the exit code mean, and why is the log the way it is?</li>
<li>Build a short timeline (time, service, event) of the first minute from <code>docker events</code>.</li>
<li>Run <code>thumb</code> once more so that its last words become visible. Which file and line crashed?</li>
</ol>

<h3>Hints (open one at a time)</h3>
<details><summary>Hint for 1</summary><p><code>docker compose ps -a</code> shows exited services too. <code>docker inspect</code> with <code>{{.RestartCount}}</code> and <code>{{.HostConfig.RestartPolicy}}</code> (lesson 13.1, step 5). Container names are <code>lab13-&lt;service&gt;-1</code>.</p></details>
<details><summary>Hint for 2 and 3</summary><p>The first lines of the api log; the last lines of the worker log. For memory: <code>{{.State.OOMKilled}}</code>, the <code>oom</code> event and <code>{{.HostConfig.Memory}}</code> (bytes).</p></details>
<details><summary>Hint for 4 and 6</summary><p>139 = 128 + 11 (SIGSEGV). An empty log from a Python program in a container: lesson 13.1, step 4. Python can print a traceback on a segfault: <code>python3 -X faulthandler</code>. <code>docker compose run --rm --no-deps -e NAME=value service [command]</code> runs one more copy with your changes.</p></details>

<h3>Answer key (run for real — open after you finish)</h3>
<details><summary>Show the commands and output</summary>
${ma('bash', 's13/lab13.bash')}
${ra('s13/lab13')}
</details>

<h3>Reading the answers</h3>
<details><summary>Show the explanation</summary>
<ul>
<li><strong>Q1:</strong> api <em>Exited (1)</em>, RestartCount 3, policy <code>on-failure:3</code>; worker <em>Exited (137)</em>, RestartCount 2, <code>on-failure:2</code>; thumb <em>Exited (139)</em>, never restarted (policy <code>no</code>). "Restarted it twice" by hand did nothing: each policy simply ran out of retries again.</li>
<li><strong>Q2 api:</strong> <code>FATAL: thiếu biến môi trường DB_URL</code> then <code>Error: config: DB_URL is required at /app/app.js:6</code>; four FATAL lines = 1 run + 3 restarts. Cause: configuration (the service has no <code>DB_URL</code>). Owner: whoever owns the compose/env file.</li>
<li><strong>Q3 worker:</strong> <code>OOMKilled=true</code>, ExitCode 137, three <code>oom</code> + <code>die 137</code> events (1 run + 2 restarts), limit 64 MiB; the log ends at <code>held 48 MB</code> with no error message. Cause: memory grows without bound (a leak or an unbounded cache) — raising the limit only delays it.</li>
<li><strong>Q4 thumb:</strong> 0 log lines and exit 139 = segmentation fault in native code. The output is empty because Python buffered stdout (not a terminal) and a crash by signal never flushes the buffer — the process printed lines, they died with it.</li>
<li><strong>Q5 timeline:</strong> within about three seconds — api die 1 ×4, worker oom/die 137 ×3, thumb die 139 once. The exact seconds are in your output; the order between services can differ from run to run.</li>
<li><strong>Q6:</strong> with <code>PYTHONUNBUFFERED=1</code> the last words are <code>processing anh-0042.jpg</code> (and the run exits 139 again); with <code>-X faulthandler</code> Python prints <code>Fatal Python error: Segmentation fault</code> and the stack: <code>ctypes/__init__.py … string_at</code> called from <code>/app/thumb.py, line 7</code>. Cause: a native library crashes on one specific input (image 42). Next step: reproduce with that file, update/replace the library, and add a per-file try/isolation so one bad image does not kill the service.</li>
</ul>
</details>

<h3>Write the report (5 lines)</h3>
<p>This is what you post in the team chat — evidence, not opinions:</p>
<pre><code class="language-text">lab13 staging — 3 dịch vụ chết, 3 nguyên nhân khác nhau (đọc lúc 09:20, chưa sửa gì):
1. api: exit 1 ×4 (on-failure:3 đã hết lượt) — thiếu biến DB_URL (log: "FATAL: thiếu biến môi trường DB_URL", app.js:6). Cần: thêm DB_URL vào env.
2. worker: OOMKilled, exit 137 ×3, hạn mức 64 MiB — RAM tăng đều tới ~48 MB rồi bị giết. Cần: đội dev kiểm rò bộ nhớ; tăng hạn mức chỉ kéo dài thời gian.
3. thumb: exit 139 (segfault), log trống do Python đệm stdout. Chạy lại với -X faulthandler: chết ở thumb.py:7 khi xử lý anh-0042.jpg (thư viện C).
Khởi động lại tay không giúp gì — cả ba sẽ chết lại y như cũ. Đính kèm: ps, inspect, events (đã dán ở dưới).</code></pre>

<h3>Kubernetes variant (optional, 30 min)</h3>
<p>Apply <code>_demo/s13/k8s/hong.yaml</code> to a kind/minikube/k3d cluster (lesson 13.2, step 2) and answer Q1–Q4 again with <code>get pods</code>, <code>describe</code> (Last State), <code>logs -p</code> and <code>get events</code>. Compare the evidence: Kubernetes writes <code>Reason: OOMKilled</code> where Docker writes <code>OOMKilled=true</code>; a container that never started (ImagePullBackOff) has no log at all, only events.</p>
${lenh('s13/k8s', 9)}

<h3>🎤 Interviewers will ask</h3>
<ul>
<li><em>A container exits with 137. Is it out of memory?</em> — Only if <code>OOMKilled=true</code> (or Kubernetes <code>Reason: OOMKilled</code>) and there is an <code>oom</code> event. Otherwise SIGKILL came from elsewhere — most often <code>docker stop</code> after the 10-second grace period because PID 1 ignored SIGTERM.</li>
<li><em>CrashLoopBackOff — what do you do?</em> — <code>describe</code> for Last State/exit code and events, <code>logs --previous</code> for the run that died; never just delete the pod, the evidence goes with it.</li>
<li><em>The log is empty but the container died. Ideas?</em> — Buffered stdout (Python/C), a crash before logging was configured, logs written to a file inside the container, a <code>none</code> log driver, or the container was recreated so you are reading the new one.</li>
<li><em>Where are container logs physically stored, and when are they lost?</em> — Docker json-file under the daemon's data directory, Kubernetes <code>/var/log/pods</code> on the node; lost when the container/pod is removed or rotated out — ship them centrally.</li>
<li><em>How do you get the client IP behind a load balancer, safely?</em> — From the header the proxy sets, trusted only for the proxy's addresses, overwritten (not appended) on the way in; log the TCP peer too (lesson 13.3).</li>
</ul>

<h3>🛠 Project milestone</h3>
<p>In your own project's Docker Compose (SWP, LabFlow or the course project): (1) every service logs to stdout/stderr, Python services with <code>PYTHONUNBUFFERED=1</code>, Java/Node without file appenders inside the container; (2) every service has a restart policy <em>and</em> a memory limit you chose on purpose; (3) the Docker daemon (or each service) has log rotation (<code>max-size</code>/<code>max-file</code>); (4) write a "first five commands when a container dies" section in your README with the commands of this lab. Add one screenshot of <code>docker compose ps -a</code> and one of <code>docker events</code> showing a test crash.</p>

<h3>Done when</h3>
<div class="callout ok"><p>All three causes are named with one quoted piece of evidence each (log line, inspect field or event), the 137 is proven to be memory (OOMKilled + limit), the 139 is explained including why the log was empty, the file and line of the crash are found with faulthandler, and the 5-line report fits in one chat message. Clean up with <code>docker compose down</code>.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['exhausted restart policy', 'on-failure:N stops retrying after N restarts; the container stays Exited.'],
  ['faulthandler', 'Python option (-X faulthandler) that prints a traceback when the process receives SIGSEGV and similar.'],
  ['docker compose run', 'Run one extra copy of a service with changed env/command — an experiment that leaves the evidence untouched.'],
  ['evidence line', 'The exact log line, inspect field or event you quote to support a conclusion.'],
])}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Lab 13</span>
<h2>Ba dịch vụ cứ chết — tìm ra vì sao chỉ bằng lệnh đọc</h2>
<p class="lead">Thứ Hai, 09:05. Nhóm chat của đội: "stack lab13 trên staging lại sập rồi, ai xem giúp với? Mình đã khởi động lại hai lần rồi." Bạn có quyền đọc trên máy chủ Docker. Việc của bạn: nói <em>với từng dịch vụ</em> nó chết thế nào và vì sao, mỗi cái một bằng chứng — trước khi bất kỳ ai sửa tệp hay khởi động lại thêm lần nào.</p>

<h3>Luật chơi</h3>
<ul>
<li>Được dùng: <code>docker compose ps</code>, <code>docker compose logs</code>, <code>docker logs</code>, <code>docker inspect</code>, <code>docker events</code>, <code>docker stats</code>. Không được trước khi trả lời: mở <code>app.js</code>, <code>an-ram.js</code>, <code>thumb.py</code> hay <code>compose.yaml</code>.</li>
<li>Với câu cuối, bạn được chạy dịch vụ thêm một lần với một biến môi trường khác (<code>docker compose run</code>) — đó là một thí nghiệm, không phải bản sửa.</li>
</ul>

<h3>Chuẩn bị (5 phút)</h3>
<p>Chép thư mục <code>_demo/s13/lab13</code> (bốn tệp) về máy, rồi:</p>
<pre><code class="language-bash">cd lab13
docker compose up -d
# chờ khoảng 20 giây rồi bắt đầu điều tra</code></pre>

<h3>Các câu hỏi</h3>
<ol>
<li>Trạng thái và mã thoát của từng dịch vụ là gì? Dịch vụ nào đã được khởi động lại, bao nhiêu lần, theo chính sách nào?</li>
<li><code>api</code>: vì sao nó thoát? Trích dòng log.</li>
<li><code>worker</code>: nó chết thế nào? Chứng minh đó là (hoặc không phải) bộ nhớ, và nêu hạn mức.</li>
<li><code>thumb</code>: log của nó nói gì? Mã thoát nghĩa là gì, và vì sao log lại như vậy?</li>
<li>Dựng một dòng thời gian ngắn (giờ, dịch vụ, sự kiện) cho phút đầu tiên từ <code>docker events</code>.</li>
<li>Chạy <code>thumb</code> thêm một lần sao cho lời cuối của nó hiện ra. Tệp và dòng nào đã sập?</li>
</ol>

<h3>Gợi ý (mở từng cái một)</h3>
<details><summary>Gợi ý câu 1</summary><p><code>docker compose ps -a</code> hiện cả dịch vụ đã thoát. <code>docker inspect</code> với <code>{{.RestartCount}}</code> và <code>{{.HostConfig.RestartPolicy}}</code> (bài 13.1, bước 5). Tên container là <code>lab13-&lt;dịch-vụ&gt;-1</code>.</p></details>
<details><summary>Gợi ý câu 2 và 3</summary><p>Mấy dòng đầu log của api; mấy dòng cuối log của worker. Về bộ nhớ: <code>{{.State.OOMKilled}}</code>, sự kiện <code>oom</code> và <code>{{.HostConfig.Memory}}</code> (tính bằng byte).</p></details>
<details><summary>Gợi ý câu 4 và 6</summary><p>139 = 128 + 11 (SIGSEGV). Log trống của một chương trình Python trong container: bài 13.1, bước 4. Python có thể in traceback khi segfault: <code>python3 -X faulthandler</code>. <code>docker compose run --rm --no-deps -e TÊN=giá-trị dịch-vụ [lệnh]</code> chạy thêm một bản với thay đổi của bạn.</p></details>

<h3>Đáp án (chạy thật — mở sau khi làm xong)</h3>
<details><summary>Xem lệnh và output</summary>
${ma('bash', 's13/lab13.bash')}
${ra('s13/lab13')}
</details>

<h3>Đọc đáp án</h3>
<details><summary>Xem giải thích</summary>
<ul>
<li><strong>Câu 1:</strong> api <em>Exited (1)</em>, RestartCount 3, chính sách <code>on-failure:3</code>; worker <em>Exited (137)</em>, RestartCount 2, <code>on-failure:2</code>; thumb <em>Exited (139)</em>, chưa từng được khởi động lại (chính sách <code>no</code>). "Đã khởi động lại hai lần" bằng tay chẳng được gì: mỗi chính sách lại hết lượt thử y như cũ.</li>
<li><strong>Câu 2 api:</strong> <code>FATAL: thiếu biến môi trường DB_URL</code> rồi <code>Error: config: DB_URL is required at /app/app.js:6</code>; bốn dòng FATAL = 1 lần chạy + 3 lần khởi động lại. Nguyên nhân: cấu hình (dịch vụ không có <code>DB_URL</code>). Người phải sửa: ai giữ tệp compose/env.</li>
<li><strong>Câu 3 worker:</strong> <code>OOMKilled=true</code>, ExitCode 137, ba lần <code>oom</code> + <code>die 137</code> (1 lần chạy + 2 lần khởi động lại), hạn mức 64 MiB; log dừng ở <code>held 48 MB</code> mà không có thông báo lỗi nào. Nguyên nhân: bộ nhớ tăng không giới hạn (rò rỉ hoặc bộ đệm không chặn trần) — nâng hạn mức chỉ làm nó chết muộn hơn.</li>
<li><strong>Câu 4 thumb:</strong> 0 dòng log và thoát 139 = lỗi phân đoạn trong mã gốc. Output trống vì Python đệm stdout (không phải terminal) và chết vì tín hiệu thì bộ đệm không bao giờ được đẩy ra — tiến trình đã in dòng, chúng chết cùng nó.</li>
<li><strong>Câu 5 dòng thời gian:</strong> trong khoảng ba giây — api die 1 ×4, worker oom/die 137 ×3, thumb die 139 một lần. Giây chính xác nằm trong output của bạn; thứ tự giữa các dịch vụ có thể khác nhau mỗi lần chạy.</li>
<li><strong>Câu 6:</strong> với <code>PYTHONUNBUFFERED=1</code>, lời cuối là <code>processing anh-0042.jpg</code> (và lần chạy lại thoát 139); với <code>-X faulthandler</code>, Python in <code>Fatal Python error: Segmentation fault</code> và stack: <code>ctypes/__init__.py … string_at</code> được gọi từ <code>/app/thumb.py, line 7</code>. Nguyên nhân: một thư viện mã gốc sập với một đầu vào cụ thể (ảnh 42). Bước tiếp: tái hiện với đúng tệp đó, cập nhật/thay thư viện, và cô lập xử lý từng tệp để một ảnh hỏng không giết cả dịch vụ.</li>
</ul>
</details>

<h3>Viết báo cáo (5 dòng)</h3>
<p>Đây là thứ bạn đăng vào nhóm chat — bằng chứng, không phải ý kiến:</p>
<pre><code class="language-text">lab13 staging — 3 dịch vụ chết, 3 nguyên nhân khác nhau (đọc lúc 09:20, chưa sửa gì):
1. api: exit 1 ×4 (on-failure:3 đã hết lượt) — thiếu biến DB_URL (log: "FATAL: thiếu biến môi trường DB_URL", app.js:6). Cần: thêm DB_URL vào env.
2. worker: OOMKilled, exit 137 ×3, hạn mức 64 MiB — RAM tăng đều tới ~48 MB rồi bị giết. Cần: đội dev kiểm rò bộ nhớ; tăng hạn mức chỉ kéo dài thời gian.
3. thumb: exit 139 (segfault), log trống do Python đệm stdout. Chạy lại với -X faulthandler: chết ở thumb.py:7 khi xử lý anh-0042.jpg (thư viện C).
Khởi động lại tay không giúp gì — cả ba sẽ chết lại y như cũ. Đính kèm: ps, inspect, events (đã dán ở dưới).</code></pre>

<h3>Biến thể Kubernetes (tuỳ chọn, 30 phút)</h3>
<p>Apply <code>_demo/s13/k8s/hong.yaml</code> lên một cụm kind/minikube/k3d (bài 13.2, bước 2) rồi trả lời lại câu 1–4 bằng <code>get pods</code>, <code>describe</code> (Last State), <code>logs -p</code> và <code>get events</code>. So sánh bằng chứng: Kubernetes ghi <code>Reason: OOMKilled</code> ở chỗ Docker ghi <code>OOMKilled=true</code>; container chưa từng chạy (ImagePullBackOff) hoàn toàn không có log, chỉ có event.</p>
${lenh('s13/k8s', 9)}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><em>Một container thoát với 137. Có phải hết bộ nhớ không?</em> — Chỉ khi <code>OOMKilled=true</code> (hoặc Kubernetes ghi <code>Reason: OOMKilled</code>) và có sự kiện <code>oom</code>. Nếu không thì SIGKILL đến từ nơi khác — thường gặp nhất là <code>docker stop</code> sau 10 giây ân hạn vì PID 1 lờ SIGTERM.</li>
<li><em>CrashLoopBackOff — bạn làm gì?</em> — <code>describe</code> để xem Last State/mã thoát và event, <code>logs --previous</code> cho lần chạy đã chết; đừng bao giờ chỉ xoá pod, bằng chứng đi theo nó.</li>
<li><em>Log trống mà container đã chết. Bạn nghĩ tới gì?</em> — stdout bị đệm (Python/C), sập trước khi kịp cấu hình log, log ghi vào tệp bên trong container, log driver <code>none</code>, hoặc container đã bị tạo lại nên bạn đang đọc bản mới.</li>
<li><em>Log container được lưu vật lý ở đâu, và khi nào thì mất?</em> — Docker json-file trong thư mục dữ liệu của daemon, Kubernetes <code>/var/log/pods</code> trên node; mất khi container/pod bị xoá hoặc bị xoay vòng — hãy gửi về một chỗ tập trung.</li>
<li><em>Lấy IP của khách sau bộ cân bằng tải thế nào cho an toàn?</em> — Từ header do proxy đặt, chỉ tin khi đến từ địa chỉ của proxy, ghi đè (không nối thêm) khi đi vào; log cả đầu TCP (bài 13.3).</li>
</ul>

<h3>🛠 Mốc dự án</h3>
<p>Trong Docker Compose của dự án của bạn (SWP, LabFlow hay dự án của khoá): (1) mọi dịch vụ log ra stdout/stderr, dịch vụ Python có <code>PYTHONUNBUFFERED=1</code>, Java/Node không dùng appender ghi tệp bên trong container; (2) mọi dịch vụ có chính sách restart <em>và</em> một hạn mức bộ nhớ bạn chủ động chọn; (3) daemon Docker (hoặc từng dịch vụ) có xoay log (<code>max-size</code>/<code>max-file</code>); (4) viết mục "năm lệnh đầu tiên khi một container chết" trong README với các lệnh của lab này. Thêm một ảnh chụp <code>docker compose ps -a</code> và một ảnh <code>docker events</code> cho thấy một cú sập thử.</p>

<h3>Đạt khi</h3>
<div class="callout ok"><p>Cả ba nguyên nhân được gọi tên, mỗi cái kèm một bằng chứng trích dẫn (dòng log, trường inspect hoặc sự kiện), 137 được chứng minh là do bộ nhớ (OOMKilled + hạn mức), 139 được giải thích kể cả vì sao log trống, tệp và dòng gây sập được tìm ra bằng faulthandler, và báo cáo 5 dòng gói gọn trong một tin nhắn chat. Dọn bằng <code>docker compose down</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['chính sách restart hết lượt', 'on-failure:N ngừng thử sau N lần khởi động lại; container nằm lại ở Exited.'],
  ['faulthandler', 'Tuỳ chọn của Python (-X faulthandler) in traceback khi tiến trình nhận SIGSEGV và các tín hiệu tương tự.'],
  ['docker compose run', 'Chạy thêm một bản của dịch vụ với env/lệnh đã đổi — một thí nghiệm không đụng vào bằng chứng.'],
  ['dòng bằng chứng', 'Đúng dòng log, trường inspect hay sự kiện bạn trích để làm chỗ dựa cho kết luận.'],
])}
</div>
`,
};
