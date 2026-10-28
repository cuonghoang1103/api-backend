/**
 * Operating Systems for Developers — Chương 15: Quan sát và tinh chỉnh hệ điều hành (soạn 29/10/2026 theo _HOP-DONG.md).
 * Câu hỏi của cả chương: "dịch vụ chậm — đo cái gì, theo thứ tự nào, sửa cái gì, và làm sao biết đã sửa đúng?"
 * Phương pháp (USE + RED + 60 giây đầu) → lấy mẫu CPU (perf, flame graph) → thời gian NGOÀI CPU (offcputime, gdb) → profiler
 * của từng ngôn ngữ trên cùng một dịch vụ chậm → eBPF (bpftrace + libbpf-tools) → đo hiệu năng cho trung thực (làm nóng, phân
 * vị, coordinated omission, wrk/hey/k6) → núm chỉnh và khi nào KHÔNG đụng → một câu chuyện tinh chỉnh trọn vẹn.
 *
 * Output CHẠY THẬT trong ảnh `os-lab` (lab/code/ch15/c15*.sh → lab/out/c15*.out.txt), TUẦN TỰ, máy soạn bài dùng chung (Mac
 * Apple Silicon, Docker Desktop: Linux 7.0.12-linuxkit, 10 CPU, 7,7 GiB). Công cụ không có trong ảnh được nạp vào container
 * vứt đi: bpftrace 0.25 + libbpf-tools 0.35 + wrk 4.1 + hey 0.1.4 (deb Ubuntu 26.04), FlameGraph (brendangregg), async-profiler
 * 4.6, py-spy 0.4.2, k6 2.3.0 — xem chú thích "# @" đầu từng kịch bản. Chạy lại (từ lab/):
 *   docker run --rm --label oslab=1 --hostname oslab [--privileged] -v "$PWD/code/ch15":/lab/ch15 -v <tools>:/tools:ro \
 *     -v <debs>:/debs:ro -w /lab/ch15 os-lab bash -c "phien <kb>.sh 2>&1" > out/<kb>.out.txt
 * Flame graph THẬT (lab/code/ch15/fg/*.svg) do flamegraph.pl vẽ trong lab — slide nhúng nguyên tệp.
 * Thứ tự bài ≠ số trong slug: 4 slug đã seed từ khung (os-15-1-perf, os-15-2-ebpf, os-15-3-sysctl, os-15-4-phuong-phap) GIỮ
 * NGUYÊN; bài mới os-15-5-use-red, os-15-6-off-cpu, os-15-7-profiler, os-15-8-benchmark chen theo mạch học; quiz os-15-9-quiz.
 * Deck slide đánh theo SỐ BÀI trong tiêu đề (os-15-1 … os-15-8).
 * Ranh giới: công cụ hằng ngày + USE cơ bản ở Ch2 (2.1–2.7), perf stat/chuyển ngữ cảnh ở 3.3, đo song song/Amdahl ở 4.5, page
 * cache/PSI/swap ở Ch8, accept queue/backlog ở 10.1, strace + bpftrace xem trước ở 11.3/11.6, cgroup ở 12.2 — trỏ sang, không dạy lại.
 * LUẬT escaping: < > → &lt; &gt;; & → &amp;; không backtick trần; ${ của bash → \${.
 */
import { run, src, card, kv, cmd, code } from './_ui.mjs';
import { lab } from './_lab.mjs';
import G151 from './giang/os-15-1.mjs';
import G152 from './giang/os-15-2.mjs';
import G153 from './giang/os-15-3.mjs';
import G154 from './giang/os-15-4.mjs';
import G155 from './giang/os-15-5.mjs';
import G156 from './giang/os-15-6.mjs';
import G157 from './giang/os-15-7.mjs';
import G158 from './giang/os-15-8.mjs';

const L = (href, ico, t, s, cta) => card(href, ico, t, s, cta);
const OS = (slug) => '/courses/operating-systems-for-developers/learn?lessonSlug=' + slug;
const OSG = (slug) => '/courses/operating-systems/learn?lessonSlug=' + slug;

/* ───────────────────────── 15.1 — USE, RED và 60 giây đầu ───────────────────────── */
const L151 = {
  title: '15.1 — Method before tools: USE, RED and the first 60 seconds|||15.1 — Phương pháp trước công cụ: USE, RED và 60 giây đầu',
  slug: 'os-15-5-use-red',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Hai bản đồ cho mọi sự cố chậm: RED (Rate, Errors, Duration) cho dịch vụ, USE (Utilization, Saturation, Errors) cho từng tài nguyên — kể cả tài nguyên phần mềm như event loop; danh sách 60 giây của Netflix chạy thật trong một container 2 CPU đang quá tải có ba thủ phạm; vì sao container báo CPU 52% mà một luồng đã 100%, vì sao đĩa bận 1% mà PSI io 38%, và vì sao máy chủ tự đo p99 10,9 ms trong khi khách chờ 2,25 s.',
  content: `${G151}
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.1</span>
<h2>Method before tools: two maps for every "it is slow"</h2>
<p class="lead">Chapter 2 gave you the reflex: ten commands in the first five minutes (<a href="${OS('os-2-1-phuong-phap')}">lesson 2.1</a>). This chapter goes further — sampling, eBPF, honest benchmarks, tuning — and every one of those tools can bury you in numbers. So we start with the <em>method</em> that decides which number matters. The question of this lesson: <strong>a service is slow; how do you prove which resource is the cause, without skipping one and without stopping at the first scary number?</strong> We answer it on a lab container we deliberately set on fire, with three culprits hidden in it.</p>

<h3>Two maps: RED for the service, USE for the resources</h3>
<p>Users never complain about a resource. They complain about a <strong>service</strong>: "checkout takes ten seconds". So the first map describes services, from the outside. Tom Wilkie's <strong>RED method</strong> asks three questions of every endpoint:</p>
<ul>
<li><strong>R</strong>ate — how many requests per second is it receiving?</li>
<li><strong>E</strong>rrors — how many of them fail?</li>
<li><strong>D</strong>uration — how long do they take, as a <em>distribution</em> (p50, p95, p99), never only an average?</li>
</ul>
<p>RED tells you <em>which</em> service hurts and <em>how badly</em>. It cannot tell you <em>why</em>. For that you walk the second map, Brendan Gregg's <strong>USE method</strong>, which asks three questions of every <strong>resource</strong>:</p>
<ul>
<li><strong>U</strong>tilization — what fraction of the time was it busy (or how much of its capacity is used)?</li>
<li><strong>S</strong>aturation — is there extra work <em>waiting</em> for it (a queue, a run queue, throttling, a PSI number)?</li>
<li><strong>E</strong>rrors — is it reporting errors (retransmits, OOM kills, EMFILE, I/O errors)?</li>
</ul>
<p>The power of USE is that it is a <em>checklist</em>: you fill every cell, so you cannot forget the disk because the CPU looked guilty. And "resource" is wider than the four pieces of hardware. In a backend, the things requests queue for include <strong>software resources</strong>: the Node event loop (one thread), a thread pool, a database connection pool, a lock, file descriptors, PIDs, a cgroup's CPU quota or I/O budget. Each has the same three questions.</p>
<table>
<tr><th>Resource</th><th>Utilization</th><th>Saturation</th><th>Errors</th></tr>
<tr><td>CPU (cgroup)</td><td>CPUs used ÷ CPUs allowed (<code>cpu.stat</code>, <code>cpu.max</code>)</td><td>throttled periods, run-queue length, PSI <code>cpu.pressure</code></td><td>— (rare)</td></tr>
<tr><td>One thread (event loop, a lock holder)</td><td>% of <em>one</em> core (<code>pidstat -t</code>)</td><td>requests waiting in the socket/event queue (seen as client latency)</td><td>timeouts</td></tr>
<tr><td>Memory</td><td><code>memory.current</code> ÷ <code>memory.max</code></td><td>PSI <code>memory.pressure</code>, reclaim, swap-in</td><td><code>memory.events</code> oom_kill</td></tr>
<tr><td>Disk</td><td>device busy % (<code>iostat %util</code>)</td><td>queue size, <code>await</code>, PSI <code>io.pressure</code>, <code>io.max</code> throttling</td><td>I/O errors in <code>dmesg</code></td></tr>
<tr><td>Network</td><td>throughput vs link speed</td><td>listen overflows, socket backlogs</td><td>retransmits, resets</td></tr>
<tr><td>File descriptors, PIDs</td><td>open ÷ limit</td><td>—</td><td>EMFILE, EAGAIN on fork</td></tr>
</table>

<h3>The lab: one symptom, three culprits</h3>
<p>The container gets the size of a small VPS: <code>--cpus 2 --memory 1g</code>, and its writes to the VM's disk are capped at 20 MB/s (<code>--device-write-bps</code>, which becomes an <code>io.max</code> rule in its cgroup — lesson 12.2). Inside, before we look, three things start in the background (<code>lab/code/ch15/c151-use.sh</code>):</p>
<ul>
<li><code>orders.js</code> — the service of this chapter, an order report API — receives 100 requests/s on <code>/report</code> and 20/s on <code>/health</code>, from the load generator <code>tai.js</code> (lesson 15.6 explains why it is built the way it is);</li>
<li>a Python process holding 600 MiB;</li>
<li>a "backup" job writing to disk in a loop.</li>
</ul>
<p>All you are told is what the team chat says: <em>"the API is slow"</em>.</p>
${lab('sysmon', 'mystery', 'en', 'Before the real container: a box with an unknown problem. Walk the USE checklist resource by resource — CPU, memory, disk, processes — and refuse to name a culprit until every cell is filled.', { tour: 'sysmon-start' })}

<h3>The 60-second checklist, run inside the slow container</h3>
<p>Netflix's list (Gregg, "Linux Performance Analysis in 60,000 Milliseconds") is ten commands that give a first USE pass in about a minute. Here it is, run for real — with a note on what each one sees <em>from inside a container</em>, because that is where most of us type them.</p>
${run('c151-use', 'uptime')}
${run('c151-use', 'dmesg')}
<p>The load average belongs to the whole VM and is a 1-, 5- and 15-minute moving average: six seconds into the incident it still says 0.40. It tells you about the past, not about now. <code>dmesg</code> is refused: an unprivileged container may not read the kernel log (<code>kernel.dmesg_restrict</code>). On a real host you would look for OOM kills and I/O errors here (lesson 2.6) — inside a container you ask the host, or read <code>memory.events</code>.</p>
${run('c151-use', 'vmstat 1 5')}
${run('c151-use', 'mpstat -P ALL')}
<p><code>vmstat</code>: <code>r</code> 1–3 runnable, <code>b</code> 1 blocked, 10% user, 10% iowait, 78% idle — of the <em>VM's</em> ten CPUs. 10% user is exactly one CPU out of ten. <code>mpstat -P ALL</code> shows it per CPU, and this is where the average lies: CPU 1 is at <strong>99% user</strong>, CPU 8 at <strong>99% iowait</strong>, the other eight almost idle. One busy CPU and one waiting CPU, averaged over ten, look like a calm machine.</p>
${run('c151-use', 'pidstat 1 1')}
${run('c151-use', 'iostat -dx vda')}
${run('c151-use', 'free -m')}
<p><code>pidstat</code> names the busy process: <code>node</code> PID 11 at 101% — one process, one core. <code>iostat</code> on the VM's disk shows a quiet second (0 writes): the backup's writes leave in bursts, and in between they wait in the cgroup's throttle, not in the device queue. <code>free</code> shows the VM's memory (4.2 GB available), not the container's 1 GiB — the classic container trap from lesson 2.3.</p>
${run('c151-use', 'sar -n DEV')}
${run('c151-use', 'sar -n TCP,ETCP')}
${run('c151-use', 'top -bn1')}
<p>The network is nearly idle (390 packets/s on loopback, no retransmits). <code>top</code> confirms <code>node</code> at 90.9% and shows the 600 MiB Python process doing nothing. Ten commands, a minute, and already one suspect. But two numbers from this list are VM-wide and one disagrees with another, so we ask the same questions of the cgroup, which sees only this container.</p>

<h3>The same questions, asked of the cgroup</h3>
${run('c151-use', 'cat /sys/fs/cgroup/cpu.max')}
${run('c151-use', 'for r in cpu memory io')}
<p><code>cpu.max</code> = 200000/100000: two CPUs of quota. Throttled once in the whole run: the container is <em>not</em> short of CPU quota. <strong>PSI</strong> (pressure stall information, lesson 8.2) answers "saturation" directly: the share of time in which at least one task of this cgroup was <em>waiting</em> for the resource. CPU 0%, memory 0% — and <strong>io 33%</strong>: something here waits for the disk a third of the time. That is the backup, held back by the 20 MB/s cap.</p>
${run('c151-use', 'pidstat -t -p')}
<p>Per thread, the picture is sharp: the <strong>main thread</strong> of node (TID 11) is at 100%, its eleven helper threads (V8, libuv) at 0%. The service is limited not by "CPU" but by <em>one thread</em> — the event loop (lessons 3.5 and 4.3).</p>

<h3>The USE table in one command</h3>
<p><code>use.py</code> (in <code>lab/code/ch15</code>) samples the cgroup and <code>/proc</code> for three seconds and fills the checklist. Use it, or read it as a list of which file answers which cell:</p>
${run('c151-use', 'python3 use.py')}
<ul>
<li><strong>CPU (container)</strong>: 1.05 of 2 CPUs = 52%, not throttled, PSI 0 — "CPU is fine" if you stop here.</li>
<li><strong>CPU (one thread)</strong>: the event loop at 100% of one core — a <em>software resource</em> at full utilization. Its saturation does not appear in any kernel counter: the waiting requests sit in the socket's buffer and in Node's queue. You see it as latency, in RED.</li>
<li><strong>Memory</strong>: 72% used, PSI 0, no OOM. High utilization with zero saturation is <em>healthy</em>: memory you paid for is being used.</li>
<li><strong>Disk</strong>: the VM's disk is busy 1% of the time, yet PSI io is 38%. The queue is not in the device; it is in our cgroup's <code>io.max</code> budget. A real problem — for the backup job, not for the API.</li>
<li><strong>Network, fds, PIDs</strong>: nothing.</li>
</ul>

<h3>RED: the service's view and the clients' view</h3>
<p><code>orders.js</code> writes an access log (time, path, status, milliseconds spent in the handler). <code>red.py</code> turns it into RED; <code>tai.js</code> recorded what the clients saw:</p>
${run('c151-use', 'python3 red.py')}
${run('c151-use', 'cat /tmp/report.txt')}
<p>Read them side by side, because this is the most important lesson of the chapter's first hour. Inside the server, <code>/report</code> takes 10.1 ms at p50 and <strong>10.9 ms at p99</strong>; <code>/health</code> takes 0.1 ms. Outside, clients waited <strong>400 ms at p50 and 2.25 s at p99</strong> for <code>/report</code> — and <strong>567 ms at p50</strong> for <code>/health</code>, a handler that does nothing. The server's own timer starts when the handler starts. Everything before that — waiting in the socket buffer, waiting for the event loop to finish other people's reports — is invisible to it. And one request per endpoint failed on the client side; the server's log has no trace of either.</p>
${lab('threadpool', 'overload', 'en', 'Why the clients see hundreds of milliseconds: one worker (the event loop) whose service time × arrival rate is ≥ 1. Watch the queue — not the worker — grow without bound.', { tour: 'threadpool-start' })}

<h3>The verdict, and why it is the right one</h3>
<p>One <code>/report</code> costs about 10.1 ms of the event loop's time; 100 per second need 1.01 s of it per second. Capacity is about 99 requests/s, the offered load is 100 + 20: utilization ≥ 1, so the queue grows for as long as the load lasts (max wait 9.4 s by the end). <strong>The bottleneck is the single event-loop thread, saturated by <code>/report</code>.</strong> The evidence chain: RED (client p99 200× the server p99; even <code>/health</code> slow ⇒ a shared resource), USE (the only resource at 100% is the main thread; the cgroup has idle CPU), and the per-thread view. The backup's I/O pressure is real but unrelated: it does not explain why <code>/health</code> is slow. What to do: make <code>/report</code> cheaper (lesson 15.4 profiles it: 10 ms → 0.9 ms) or run more event loops (<code>cluster</code>, lesson 4.3) — and file a second, quieter ticket for the backup's I/O budget.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Container CPU is at 52% and not throttled, so CPU is not the problem."</strong> Averages over cores hide a single saturated thread: here one thread was at 100% while the cgroup had a whole idle CPU. Always look per CPU (<code>mpstat -P ALL</code>) and per thread (<code>pidstat -t</code>) before you clear the CPU.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>"Our dashboards say p99 is 11 ms."</strong> If the timer lives inside the handler, it cannot see the queue in front of it. Measure duration where the client is — the load balancer or nginx (<code>$request_time</code>), or a synthetic client — and treat the in-process number as <em>service time</em>, not latency.</p>
</div>

<h3>If you have done OSG202</h3>
<p>OSG202 measures CPU scheduling with turnaround and waiting time on a Gantt chart. RED's "duration" is turnaround time; the gap between the server's and the client's number is the waiting time — in a queue the server does not own.</p>
${L(OSG('osg202-2-4-lap-lich-tinh-toan'), '🎓', 'OSG202 · 2.4 — Scheduling calculations', 'Turnaround, waiting and response time — the same quantities, on paper.', 'Open')}

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> your team's Node API on a 2-CPU VPS "got slow after the release"; the cloud dashboard shows CPU at 50% and memory at 70%, and the manager concludes "it's not the server".</p>
<ol>
<li>Start the lab exactly like <code>c151-use.sh</code> (the <code>docker run</code> line is at the top of the script) and run the ten commands yourself. Write one line per command: what it says about U, S or E.</li>
<li>Run <code>python3 use.py 3</code> and copy the table into your notes. Mark each cell green/yellow/red.</li>
<li>Run <code>python3 red.py /tmp/access.log</code> and <code>cat /tmp/report.txt /tmp/health.txt</code> after the load ends. Compute the ratio client p99 ÷ server p99.</li>
<li>Stop the backup job (<code>kill</code> the <code>dd</code> loop) and repeat <code>use.py</code>: what changes, and does the API get faster?</li>
</ol>
<p><strong>Done when:</strong> your note names the event-loop thread as the bottleneck with three pieces of evidence (per-thread 100%, client vs server latency, <code>/health</code> slow), shows that stopping the backup drops PSI io to ~0 without changing client latency, and lists one fix for each of the two problems.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['USE method', 'For every resource: Utilization, Saturation, Errors — a checklist so no resource is skipped.'],
  ['RED method', 'For every service/endpoint: Rate, Errors, Duration (as percentiles).'],
  ['saturation', 'Work that is waiting for a resource: a queue, run queue, throttling, PSI > 0.'],
  ['software resource', 'Anything requests queue for that is not hardware: event loop, thread/DB pool, lock, fds, cgroup quota.'],
  ['PSI (pressure stall information)', 'Share of time in which tasks of a cgroup were stalled waiting for CPU, memory or I/O.'],
  ['service time vs latency', 'Time inside the handler vs time the client waited, including every queue in front.'],
  ['60-second checklist', 'Ten standard commands (uptime … top) for a first USE pass on a Linux host.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>RED describes the symptom per service; USE finds the cause per resource. Fill every USE cell before naming a culprit.</li>
<li>Inside a container, <code>uptime</code>, <code>vmstat</code>, <code>mpstat</code>, <code>free</code>, <code>iostat</code> show the whole VM; the cgroup files (<code>cpu.stat</code>, <code>*.pressure</code>, <code>memory.events</code>) show only you.</li>
<li>Measured: container CPU 52%, not throttled — yet the event-loop thread at 100%; disk busy 1% — yet PSI io 38% from an <code>io.max</code> cap.</li>
<li>The server measured p99 10.9 ms; clients waited 2.25 s at p99 and 567 ms at p50 for a no-op <code>/health</code>: the queue was invisible to the server.</li>
<li>Offered work ≥ capacity of one thread ⇒ the queue grows for as long as the load lasts. Fix the hot path or add event loops.</li>
</ul>
${L('https://www.brendangregg.com/usemethod.html', '📘', 'The USE Method — Brendan Gregg', 'The checklist, per resource, with Linux commands for each cell.', 'Open')}
${L('https://grafana.com/blog/2018/08/02/the-red-method-how-to-instrument-your-services/', '📘', 'The RED Method — Tom Wilkie (Grafana)', 'Rate, Errors, Duration for every service.', 'Open')}
${L('https://docs.kernel.org/accounting/psi.html', '🐧', 'PSI — Pressure Stall Information (kernel.org)', 'What some/full and avg10/60/300 mean, system-wide and per cgroup.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.1</span>
<h2>Phương pháp trước công cụ: hai tấm bản đồ cho mọi câu "nó chậm"</h2>
<p class="lead">Chương 2 đã cho bạn phản xạ: mười lệnh trong năm phút đầu (<a href="${OS('os-2-1-phuong-phap')}">bài 2.1</a>). Chương này đi xa hơn — lấy mẫu, eBPF, đo hiệu năng trung thực, tinh chỉnh — và công cụ nào cũng có thể chôn bạn dưới núi con số. Nên ta bắt đầu bằng <em>phương pháp</em> quyết định con số nào đáng xem. Câu hỏi của bài: <strong>một dịch vụ chậm; làm sao chứng minh tài nguyên nào là thủ phạm, mà không bỏ sót tài nguyên nào và không dừng lại ở con số đáng sợ đầu tiên?</strong> Ta trả lời trên một container lab được cố ý "đốt", có ba thủ phạm giấu bên trong.</p>

<h3>Hai tấm bản đồ: RED cho dịch vụ, USE cho tài nguyên</h3>
<p>Người dùng không bao giờ phàn nàn về một tài nguyên. Họ phàn nàn về một <strong>dịch vụ</strong>: "thanh toán mất mười giây". Nên tấm bản đồ thứ nhất mô tả dịch vụ, nhìn từ bên ngoài. <strong>Phương pháp RED</strong> của Tom Wilkie hỏi mỗi endpoint ba câu:</p>
<ul>
<li><strong>R</strong>ate (tốc độ) — mỗi giây nhận bao nhiêu request?</li>
<li><strong>E</strong>rrors (lỗi) — bao nhiêu cái thất bại?</li>
<li><strong>D</strong>uration (thời gian) — chúng mất bao lâu, dưới dạng <em>phân bố</em> (p50, p95, p99), không bao giờ chỉ một con số trung bình?</li>
</ul>
<p>RED cho biết dịch vụ <em>nào</em> đau và đau <em>tới mức nào</em>. Nó không cho biết <em>vì sao</em>. Muốn biết vì sao, bạn đi tấm bản đồ thứ hai, <strong>phương pháp USE</strong> của Brendan Gregg, hỏi mỗi <strong>tài nguyên</strong> ba câu:</p>
<ul>
<li><strong>U</strong>tilization (mức bận) — nó bận bao nhiêu phần trăm thời gian (hoặc dùng bao nhiêu phần sức chứa)?</li>
<li><strong>S</strong>aturation (bão hoà) — có việc đang <em>phải chờ</em> nó không (hàng đợi, run queue, bị bóp, một con số PSI)?</li>
<li><strong>E</strong>rrors (lỗi) — nó có báo lỗi không (gửi lại gói, OOM kill, EMFILE, lỗi I/O)?</li>
</ul>
<p>Sức mạnh của USE là nó là một <em>danh sách kiểm</em>: bạn điền đủ mọi ô, nên không thể quên cái đĩa chỉ vì CPU trông có tội. Và "tài nguyên" rộng hơn bốn món phần cứng. Trong backend, những thứ request phải xếp hàng chờ còn có <strong>tài nguyên phần mềm</strong>: event loop của Node (một luồng), thread pool, pool kết nối CSDL, một cái khoá, file descriptor, PID, hạn mức CPU hay ngân sách I/O của cgroup. Mỗi thứ cũng có đúng ba câu hỏi đó.</p>
<table>
<tr><th>Tài nguyên</th><th>Mức bận</th><th>Bão hoà</th><th>Lỗi</th></tr>
<tr><td>CPU (cgroup)</td><td>số CPU dùng ÷ số CPU được phép (<code>cpu.stat</code>, <code>cpu.max</code>)</td><td>số chu kỳ bị bóp, độ dài run queue, PSI <code>cpu.pressure</code></td><td>— (hiếm)</td></tr>
<tr><td>Một luồng (event loop, luồng giữ khoá)</td><td>% của <em>một</em> lõi (<code>pidstat -t</code>)</td><td>request chờ trong bộ đệm socket/hàng sự kiện (thấy qua độ trễ phía khách)</td><td>hết hạn chờ</td></tr>
<tr><td>Bộ nhớ</td><td><code>memory.current</code> ÷ <code>memory.max</code></td><td>PSI <code>memory.pressure</code>, thu hồi trang, swap-in</td><td><code>memory.events</code> oom_kill</td></tr>
<tr><td>Đĩa</td><td>% thời gian thiết bị bận (<code>iostat %util</code>)</td><td>độ dài hàng đợi, <code>await</code>, PSI <code>io.pressure</code>, bị <code>io.max</code> bóp</td><td>lỗi I/O trong <code>dmesg</code></td></tr>
<tr><td>Mạng</td><td>thông lượng so với tốc độ đường truyền</td><td>tràn hàng đợi listen, bộ đệm socket đầy</td><td>gửi lại gói, reset</td></tr>
<tr><td>File descriptor, PID</td><td>đang mở ÷ giới hạn</td><td>—</td><td>EMFILE, EAGAIN khi fork</td></tr>
</table>

<h3>Phòng lab: một triệu chứng, ba thủ phạm</h3>
<p>Container được cho cỡ một VPS nhỏ: <code>--cpus 2 --memory 1g</code>, và việc ghi xuống đĩa của máy ảo bị giới hạn 20 MB/s (<code>--device-write-bps</code>, thứ trở thành một luật <code>io.max</code> trong cgroup của nó — bài 12.2). Bên trong, trước khi ta nhìn, ba thứ được khởi động ngầm (<code>lab/code/ch15/c151-use.sh</code>):</p>
<ul>
<li><code>orders.js</code> — dịch vụ của chương này, một API báo cáo đơn hàng — nhận 100 request/giây vào <code>/report</code> và 20/giây vào <code>/health</code>, từ máy tạo tải <code>tai.js</code> (bài 15.6 giải thích vì sao nó được viết như thế);</li>
<li>một tiến trình Python giữ 600 MiB;</li>
<li>một job "sao lưu" ghi đĩa liên tục.</li>
</ul>
<p>Bạn chỉ được nghe điều nhóm chat nói: <em>"API chậm"</em>.</p>
${lab('sysmon', 'mystery', 'vi', 'Trước container thật: một máy có vấn đề chưa rõ. Đi danh sách USE từng tài nguyên — CPU, bộ nhớ, đĩa, tiến trình — và không gọi tên thủ phạm cho tới khi mọi ô đã điền.', { tour: 'sysmon-start' })}

<h3>Danh sách 60 giây, chạy bên trong container đang chậm</h3>
<p>Danh sách của Netflix (Gregg, "Linux Performance Analysis in 60,000 Milliseconds") là mười lệnh cho lượt USE đầu tiên trong khoảng một phút. Đây là nó, chạy thật — kèm ghi chú mỗi lệnh thấy gì <em>từ bên trong container</em>, vì đó là chỗ phần lớn chúng ta gõ chúng.</p>
${run('c151-use', 'uptime')}
${run('c151-use', 'dmesg')}
<p>Load average là của cả máy ảo và là trung bình trượt 1, 5, 15 phút: sáu giây sau khi sự cố bắt đầu nó vẫn nói 0,40. Nó kể chuyện quá khứ, không phải bây giờ. <code>dmesg</code> bị từ chối: container không đặc quyền không được đọc nhật ký nhân (<code>kernel.dmesg_restrict</code>). Trên máy thật bạn tìm OOM kill và lỗi I/O ở đây (bài 2.6) — trong container thì hỏi máy chủ, hoặc đọc <code>memory.events</code>.</p>
${run('c151-use', 'vmstat 1 5')}
${run('c151-use', 'mpstat -P ALL')}
<p><code>vmstat</code>: <code>r</code> 1–3 tác vụ sẵn sàng chạy, <code>b</code> 1 bị chặn, 10% user, 10% iowait, 78% rảnh — của mười CPU <em>máy ảo</em>. 10% user đúng bằng một CPU trên mười. <code>mpstat -P ALL</code> cho thấy từng CPU, và đây là chỗ con số trung bình nói dối: CPU 1 ở <strong>99% user</strong>, CPU 8 ở <strong>99% iowait</strong>, tám CPU còn lại gần như rảnh. Một CPU bận và một CPU đang chờ, chia trung bình cho mười, trông như một cái máy yên ả.</p>
${run('c151-use', 'pidstat 1 1')}
${run('c151-use', 'iostat -dx vda')}
${run('c151-use', 'free -m')}
<p><code>pidstat</code> gọi tên tiến trình bận: <code>node</code> PID 11 ở 101% — một tiến trình, một lõi. <code>iostat</code> trên đĩa của máy ảo cho thấy một giây yên lặng (0 lần ghi): việc ghi của job sao lưu đi ra từng đợt, và giữa các đợt chúng chờ ở bộ bóp của cgroup chứ không ở hàng đợi thiết bị. <code>free</code> cho thấy bộ nhớ máy ảo (còn 4,2 GB), không phải 1 GiB của container — cái bẫy container kinh điển của bài 2.3.</p>
${run('c151-use', 'sar -n DEV')}
${run('c151-use', 'sar -n TCP,ETCP')}
${run('c151-use', 'top -bn1')}
<p>Mạng gần như rảnh (390 gói/giây trên loopback, không gửi lại gói nào). <code>top</code> xác nhận <code>node</code> 90,9% và cho thấy tiến trình Python 600 MiB đang không làm gì. Mười lệnh, một phút, đã có một nghi phạm. Nhưng vài con số trong danh sách là của cả máy ảo và có con số mâu thuẫn với con số khác, nên ta hỏi lại đúng những câu đó với cgroup — thứ chỉ thấy riêng container này.</p>

<h3>Cùng câu hỏi, hỏi cgroup</h3>
${run('c151-use', 'cat /sys/fs/cgroup/cpu.max')}
${run('c151-use', 'for r in cpu memory io')}
<p><code>cpu.max</code> = 200000/100000: hạn mức hai CPU. Cả lượt chạy chỉ bị bóp đúng một lần: container <em>không</em> thiếu hạn mức CPU. <strong>PSI</strong> (pressure stall information, bài 8.2) trả lời thẳng câu "bão hoà": phần thời gian mà ít nhất một tác vụ của cgroup này phải <em>chờ</em> tài nguyên. CPU 0%, bộ nhớ 0% — và <strong>io 33%</strong>: có thứ gì ở đây phải chờ đĩa một phần ba thời gian. Đó là job sao lưu, bị giữ lại bởi giới hạn 20 MB/s.</p>
${run('c151-use', 'pidstat -t -p')}
<p>Nhìn theo từng luồng, bức tranh rõ hẳn: <strong>luồng chính</strong> của node (TID 11) ở 100%, mười một luồng phụ (V8, libuv) ở 0%. Dịch vụ không bị giới hạn bởi "CPU" mà bởi <em>một luồng</em> — event loop (bài 3.5 và 4.3).</p>

<h3>Bảng USE trong một lệnh</h3>
<p><code>use.py</code> (trong <code>lab/code/ch15</code>) lấy mẫu cgroup và <code>/proc</code> trong ba giây rồi điền danh sách kiểm. Hãy dùng nó, hoặc đọc nó như một danh sách "tệp nào trả lời ô nào":</p>
${run('c151-use', 'python3 use.py')}
<ul>
<li><strong>CPU (container)</strong>: 1,05 trên 2 CPU = 52%, không bị bóp, PSI 0 — "CPU ổn" nếu bạn dừng ở đây.</li>
<li><strong>CPU (một luồng)</strong>: event loop 100% của một lõi — một <em>tài nguyên phần mềm</em> bận hết mức. Sự bão hoà của nó không hiện ra ở bộ đếm nào của nhân: request đang chờ nằm trong bộ đệm socket và hàng đợi của Node. Bạn thấy nó dưới dạng độ trễ, trong RED.</li>
<li><strong>Bộ nhớ</strong>: dùng 72%, PSI 0, không OOM. Mức bận cao mà không bão hoà là <em>khoẻ</em>: bộ nhớ đã trả tiền thì đang được dùng.</li>
<li><strong>Đĩa</strong>: đĩa máy ảo bận 1% thời gian, vậy mà PSI io là 38%. Hàng đợi không nằm ở thiết bị; nó nằm ở ngân sách <code>io.max</code> của cgroup. Một vấn đề thật — của job sao lưu, không phải của API.</li>
<li><strong>Mạng, fd, PID</strong>: không có gì.</li>
</ul>

<h3>RED: góc nhìn của dịch vụ và góc nhìn của khách</h3>
<p><code>orders.js</code> ghi nhật ký truy cập (thời điểm, đường dẫn, mã trạng thái, số mili giây nằm trong hàm xử lý). <code>red.py</code> biến nó thành RED; <code>tai.js</code> đã ghi lại điều khách hàng thấy:</p>
${run('c151-use', 'python3 red.py')}
${run('c151-use', 'cat /tmp/report.txt')}
<p>Đọc hai cái cạnh nhau, vì đây là bài học quan trọng nhất của giờ đầu tiên trong chương. Bên trong máy chủ, <code>/report</code> mất 10,1 ms ở p50 và <strong>10,9 ms ở p99</strong>; <code>/health</code> mất 0,1 ms. Bên ngoài, khách chờ <strong>400 ms ở p50 và 2,25 s ở p99</strong> cho <code>/report</code> — và <strong>567 ms ở p50</strong> cho <code>/health</code>, một hàm xử lý không làm gì cả. Đồng hồ của máy chủ chỉ bắt đầu chạy khi hàm xử lý bắt đầu. Mọi thứ trước đó — chờ trong bộ đệm socket, chờ event loop làm xong báo cáo của người khác — nó không thấy. Và mỗi endpoint có một request thất bại ở phía khách; nhật ký của máy chủ không có dấu vết nào của cả hai.</p>
${lab('threadpool', 'overload', 'vi', 'Vì sao khách thấy hàng trăm mili giây: một worker (event loop) có thời gian phục vụ × tốc độ request đến ≥ 1. Hãy nhìn hàng đợi — không phải worker — phình mãi không ngừng.', { tour: 'threadpool-start' })}

<h3>Kết luận, và vì sao nó đúng</h3>
<p>Một <code>/report</code> tốn khoảng 10,1 ms thời gian của event loop; 100 cái mỗi giây cần 1,01 s của nó mỗi giây. Sức chứa khoảng 99 request/giây, tải đưa vào là 100 + 20: mức bận ≥ 1, nên hàng đợi lớn lên suốt thời gian còn tải (tới cuối, lần chờ lâu nhất là 9,4 s). <strong>Nút thắt là luồng event loop duy nhất, bị <code>/report</code> làm bão hoà.</strong> Chuỗi bằng chứng: RED (p99 phía khách gấp 200 lần p99 phía máy chủ; ngay cả <code>/health</code> cũng chậm ⇒ một tài nguyên dùng chung), USE (tài nguyên duy nhất ở 100% là luồng chính; cgroup còn dư CPU), và góc nhìn từng luồng. Áp lực I/O của job sao lưu là thật nhưng không liên quan: nó không giải thích được vì sao <code>/health</code> chậm. Việc cần làm: làm <code>/report</code> rẻ đi (bài 15.4 đo hồ sơ nó: 10 ms → 0,9 ms) hoặc chạy nhiều event loop hơn (<code>cluster</code>, bài 4.3) — và mở một phiếu thứ hai, ít gấp hơn, cho ngân sách I/O của job sao lưu.</p>

<div class="pitfall co-tieu-de">
<p><strong>"CPU của container 52% và không bị bóp, vậy không phải tại CPU."</strong> Trung bình trên nhiều lõi che mất một luồng đã bão hoà: ở đây một luồng ở 100% trong khi cgroup còn nguyên một CPU rảnh. Luôn nhìn theo từng CPU (<code>mpstat -P ALL</code>) và từng luồng (<code>pidstat -t</code>) trước khi gạch tên CPU.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>"Dashboard của mình nói p99 là 11 ms."</strong> Nếu đồng hồ nằm trong hàm xử lý, nó không thể thấy hàng đợi phía trước. Hãy đo thời gian ở nơi khách đứng — load balancer hay nginx (<code>$request_time</code>), hoặc một khách tổng hợp — và coi con số trong tiến trình là <em>thời gian phục vụ</em>, không phải độ trễ.</p>
</div>

<h3>Nếu bạn đã học OSG202</h3>
<p>OSG202 đo lập lịch CPU bằng thời gian hoàn thành và thời gian chờ trên biểu đồ Gantt. "Duration" của RED chính là thời gian hoàn thành; khoảng chênh giữa con số của máy chủ và của khách là thời gian chờ — trong một hàng đợi mà máy chủ không sở hữu.</p>
${L(OSG('osg202-2-4-lap-lich-tinh-toan'), '🎓', 'OSG202 · 2.4 — Bài tính lập lịch', 'Thời gian hoàn thành, thời gian chờ, thời gian đáp ứng — cùng những đại lượng đó, trên giấy.', 'Mở')}

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> API Node của nhóm trên VPS 2 CPU "chậm hẳn sau bản phát hành"; dashboard của nhà cung cấp cloud báo CPU 50%, bộ nhớ 70%, và trưởng nhóm kết luận "không phải tại máy chủ".</p>
<ol>
<li>Dựng lab đúng như <code>c151-use.sh</code> (dòng <code>docker run</code> nằm ở đầu kịch bản) và tự chạy mười lệnh. Viết mỗi lệnh một dòng: nó nói gì về U, S hoặc E.</li>
<li>Chạy <code>python3 use.py 3</code> và chép bảng vào ghi chú. Tô mỗi ô xanh/vàng/đỏ.</li>
<li>Khi tải kết thúc, chạy <code>python3 red.py /tmp/access.log</code> và <code>cat /tmp/report.txt /tmp/health.txt</code>. Tính tỉ số p99 phía khách ÷ p99 phía máy chủ.</li>
<li>Dừng job sao lưu (<code>kill</code> vòng lặp <code>dd</code>) rồi chạy lại <code>use.py</code>: cái gì thay đổi, và API có nhanh lên không?</li>
</ol>
<p><strong>Đạt khi:</strong> ghi chú của bạn gọi tên luồng event loop là nút thắt với ba bằng chứng (từng luồng 100%, độ trễ khách vs máy chủ, <code>/health</code> chậm), cho thấy dừng sao lưu làm PSI io về ~0 mà không đổi độ trễ phía khách, và nêu một cách sửa cho mỗi vấn đề trong hai vấn đề.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['USE method (phương pháp USE)', 'Với mỗi tài nguyên: Mức bận, Bão hoà, Lỗi — một danh sách kiểm để không bỏ sót tài nguyên nào.'],
  ['RED method (phương pháp RED)', 'Với mỗi dịch vụ/endpoint: Tốc độ, Lỗi, Thời gian (dưới dạng phân vị).'],
  ['saturation (bão hoà)', 'Việc đang phải chờ một tài nguyên: hàng đợi, run queue, bị bóp, PSI > 0.'],
  ['software resource (tài nguyên phần mềm)', 'Thứ request phải xếp hàng chờ mà không phải phần cứng: event loop, pool luồng/CSDL, khoá, fd, hạn mức cgroup.'],
  ['PSI (thông tin nghẽn do áp lực)', 'Phần thời gian mà tác vụ của một cgroup bị dừng vì chờ CPU, bộ nhớ hoặc I/O.'],
  ['service time vs latency (thời gian phục vụ vs độ trễ)', 'Thời gian bên trong hàm xử lý vs thời gian khách đã chờ, gồm mọi hàng đợi phía trước.'],
  ['60-second checklist (danh sách 60 giây)', 'Mười lệnh chuẩn (uptime … top) cho lượt USE đầu tiên trên một máy Linux.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>RED mô tả triệu chứng theo dịch vụ; USE tìm nguyên nhân theo tài nguyên. Điền đủ mọi ô USE trước khi gọi tên thủ phạm.</li>
<li>Trong container, <code>uptime</code>, <code>vmstat</code>, <code>mpstat</code>, <code>free</code>, <code>iostat</code> cho thấy cả máy ảo; các tệp cgroup (<code>cpu.stat</code>, <code>*.pressure</code>, <code>memory.events</code>) chỉ cho thấy riêng bạn.</li>
<li>Đo được: CPU container 52%, không bị bóp — vậy mà luồng event loop 100%; đĩa bận 1% — vậy mà PSI io 38% vì giới hạn <code>io.max</code>.</li>
<li>Máy chủ tự đo p99 10,9 ms; khách chờ 2,25 s ở p99 và 567 ms ở p50 cho một <code>/health</code> không làm gì: hàng đợi vô hình với máy chủ.</li>
<li>Việc đưa vào ≥ sức chứa của một luồng ⇒ hàng đợi lớn mãi suốt thời gian còn tải. Sửa đường nóng hoặc thêm event loop.</li>
</ul>
${L('https://www.brendangregg.com/usemethod.html', '📘', 'Phương pháp USE — Brendan Gregg', 'Danh sách kiểm theo từng tài nguyên, kèm lệnh Linux cho từng ô.', 'Mở')}
${L('https://grafana.com/blog/2018/08/02/the-red-method-how-to-instrument-your-services/', '📘', 'Phương pháp RED — Tom Wilkie (Grafana)', 'Tốc độ, Lỗi, Thời gian cho mọi dịch vụ.', 'Mở')}
${L('https://docs.kernel.org/accounting/psi.html', '🐧', 'PSI — Pressure Stall Information (kernel.org)', 'some/full và avg10/60/300 nghĩa là gì, toàn hệ thống và theo cgroup.', 'Mở')}
</div>
`,
};

/* ───────────────────────── 15.2 — perf và flame graph ───────────────────────── */
const L152 = {
  title: '15.2 — perf and flame graphs: sample the CPU, read the hot path, fix it, re-measure|||15.2 — perf và flame graph: lấy mẫu CPU, đọc đường nóng, sửa, đo lại',
  slug: 'os-15-1-perf',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Profiler lấy mẫu nhìn chương trình ra sao (999 lần/giây, ngăn xếp qua frame pointer); perf stat → perf record → perf report → perf script → folded stacks → flame graph trên một "máy chủ" C đo thật (crc_bitwise 86,9%), đọc tới từng lệnh máy bằng perf annotate, sửa (CRC tra bảng: 921 → 313 ms) rồi đo lại và vẽ flame graph vi sai; bẫy tệp bị strip, frame pointer, --call-graph dwarf to gấp 63 lần; Node dưới perf với --perf-basic-prof (Builtins_ArrayIncludesSmiOrObject 93%).',
  content: `${G152}
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.2</span>
<h2>perf and flame graphs: let the CPU tell you where the time goes</h2>
<p class="lead">Lesson 15.1 ended with "the event loop is saturated by <code>/report</code>". That names the resource, not the line of code. To find the line you ask the CPU itself, thousands of times a second: <em>what are you running right now, and who called it?</em> The question of this lesson: <strong>how does a sampling profiler find the hot path, how do you read its output — tables, folded stacks, flame graphs — and how do you prove your fix worked?</strong> We use <code>perf</code>, the profiler built into Linux, on a small C "server" first and then on the Node service of this chapter.</p>

<h3>How a sampling profiler sees a program</h3>
<p><code>perf record -F 999 -g</code> asks the kernel to interrupt the program 999 times per second of CPU time. At each interrupt the kernel writes down the instruction pointer and walks the stack — following the chain of saved <strong>frame pointers</strong> from the current function up to <code>main</code> — and stores the list of return addresses. Afterwards <code>perf</code> turns addresses into function names using the symbol table of each binary. Three consequences matter for everything below:</p>
<ul>
<li>It is <strong>statistical</strong>: a function that appears in 87% of samples used about 87% of the CPU time. Short runs give noisy percentages.</li>
<li>It only sees code <strong>while it is on a CPU</strong>. A thread waiting for a lock, a disk or the network is never interrupted, so it never appears — lesson 15.3 is about that blind spot.</li>
<li>Names need symbols, and stacks need frame pointers (or another unwinder). Lose either and the picture breaks — you will see both failures below.</li>
</ul>
<p>Why 999 and not 1000? A round frequency can fall into lockstep with something else that runs every millisecond and sample it always or never; an odd rate avoids that. In the Docker Desktop VM <code>perf</code> needs <code>--privileged</code> (the default seccomp profile blocks <code>perf_event_open</code>) and only software events exist (<code>cpu-clock</code>, <code>task-clock</code>) — no hardware cache counters, as in lesson 3.3.</p>

<h3>The program: a request handler with a slow checksum</h3>
<p><code>hot.c</code> handles N fake HTTP requests. Each one parses headers, computes a CRC-32 of the body bit by bit (deliberately slow: eight loop iterations per byte), renders a JSON reply with <code>sprintf</code>, and "logs" it. The functions are <code>noinline</code> so each one keeps its own frame:</p>
${src('ch15/hot.c', 'c')}
${run('c152-perf', './hot 50000')}
${run('c152-perf', 'perf stat')}
<p>Start with <code>perf stat</code>: 913 ms of CPU (<code>task-clock</code>) in 0.914 s of wall time — the program is on the CPU the whole time, with 4 context switches and 52 page faults. That is the shape of a pure CPU problem, so a CPU profiler is the right tool. (If wall time were much larger than task-clock, the next lesson's tool would be.)</p>

<h3>perf record and perf report: the flat profile</h3>
${run('c152-perf', 'perf record -F 999 -g -o hot.data')}
${run('c152-perf', 'perf report -i hot.data --stdio --no-children --sort symbol 2')}
<p>915 samples, and <strong>86.9% of them were inside <code>crc_bitwise</code></strong>. <code>--no-children</code> counts each sample only for the function at the top of the stack ("self" time). The rest is <code>sprintf</code>'s internals (<code>__printf_buffer</code>, <code>_itoa_word</code>) and <code>parse_headers</code>. Who called the hot function? <code>-G</code> prints the call chain:</p>
${run('c152-perf', 'perf report -i hot.data --stdio --no-children --sort symbol --symbols')}
<p>One frame is missing: <code>checksum()</code>. Its last line is <code>return crc_bitwise(...)</code>, and at <code>-O2</code> GCC turns that into a plain jump (a <em>tail call</em>), so <code>checksum</code>'s frame no longer exists while <code>crc_bitwise</code> runs. A profiler can only show frames that exist — if a function you expected is absent, check for inlining and tail calls before you doubt the tool.</p>

<h3>From samples to folded stacks to a flame graph</h3>
<p>A flat table loses the shape of the program. Brendan Gregg's flame graph keeps it, and the pipeline is three small steps you can see one by one. <code>perf script</code> prints every sample as a stack, leaf first:</p>
${run('c152-perf', 'perf script -i hot.data -F comm,pid,tid,ip,sym,dso 2>/dev/null | head')}
<p><code>stackcollapse-perf.pl</code> folds each stack into one line, root first, and counts identical lines. 915 samples became 17 distinct stacks; the top three:</p>
${run('c152-perf', 'perf script -i hot.data -F comm,pid,tid,ip,sym,dso 2>/dev/null | perl', 2)}
<p>That text <em>is</em> the flame graph: <code>flamegraph.pl</code> only draws it. <code>folded.py</code> (in <code>lab/code/ch15</code>) prints the two numbers you read off a flame graph — <strong>self</strong> (the top edge: on CPU right now) and <strong>total</strong> (the width of a frame: it plus everything it called):</p>
${run('c152-perf', 'python3 folded.py hot.folded')}
<p>How to read the picture (it is in the slides above, drawn from exactly these stacks):</p>
<ul>
<li>Each box is a function; the box above it is a function it called. The y-axis is stack depth.</li>
<li>The x-axis is <strong>not time</strong>: boxes are sorted alphabetically so identical stacks merge. Only the <strong>width</strong> means something — the share of samples.</li>
<li>Look for wide <strong>plateaus</strong> on the top edge: that is where the CPU actually is. Here, one plateau: <code>crc_bitwise</code>, 86.9% of the width.</li>
<li>A wide box with a flat top is self time; a wide box whose children cover it is a function that is only expensive because of what it calls (<code>render_json</code>: 10.2% total, almost none self).</li>
</ul>
${lab('sysmon', 'cpuhog', 'en', 'The system view of the same situation: one process eating a core. top tells you WHICH process; the profiler of this lesson tells you WHICH LINE.', { tour: 'sysmon-read' })}

<h3>Down to the instruction: perf annotate</h3>
${run('c152-perf', 'perf annotate')}
<p>Inside <code>crc_bitwise</code>, 75.9% of the samples land on one instruction: <code>sbfx</code>, which builds the mask <code>-(c &amp; 1)</code>, and 12.8% on the branch that closes the eight-iteration bit loop. (Samples tend to "skid" onto the instruction after the one that is really slow, so read annotate as a neighbourhood, not an exact address.) The verdict needs no guesswork: the work is the inner bit loop, eight iterations for every byte of every request.</p>

<h3>Fix, then measure again — with the same tool</h3>
<p>The textbook fix for a bitwise CRC is a 256-entry table computed once: one lookup per byte instead of eight shifts. <code>./hot N table</code> runs that version:</p>
${run('c152-perf', './hot 50000 table')}
${run('c152-perf', 'perf script -i fixed.data')}
<p>921 ms → 313 ms: <strong>2.9× faster</strong> for the whole request, not 8×, because the checksum was 87% and the rest did not change — Amdahl's law from lesson 4.5 applied to one function. The new profile also tells you where to look next: <code>crc_table</code> still 64.4% (it is still the main work), and <code>render_json</code> has grown from 10.2% to 24.9% of a smaller total. The slides show the <strong>differential flame graph</strong> (<code>difffolded.pl -n before after | flamegraph.pl</code>): box widths come from the <em>after</em> profile, red means more samples than before, blue fewer. Read it with care: <code>crc_bitwise</code> no longer exists, so it cannot appear at all, and the renamed <code>crc_table</code> shows as entirely new (red) — when code is renamed or removed, also draw the reverse diff.</p>

<h3>Three ways to break the picture</h3>
${run('c152-perf', 'gcc -O2 hot.c -o hot-stripped')}
<p><strong>Stripped binaries</strong> (<code>-s</code>, or <code>strip</code> in a Docker build to save a few kilobytes) have no symbol table: the hot spot is now <code>0x...e2c</code>, which nobody can act on. Keep symbols in production builds, or keep a debug-info file next to them.</p>
${run('c152-perf', 'gcc -O2 -g hot.c -o hot-nofp')}
<p><strong>Frame pointers.</strong> The stacks above were walked through frame pointers. Built without <code>-fno-omit-frame-pointer</code>, the stacks are still complete here — on arm64, GCC keeps a frame record in every function that calls another, and the Ubuntu and Fedora distributions now build their packages with frame pointers for exactly this reason. On x86-64 with plain <code>gcc -O2</code>, the frame pointer is used as a general register and <code>perf -g</code> stacks break into fragments <em>(per the GCC and perf documentation — not measured here: the lab machine is arm64)</em>.</p>
${run('c152-perf', 'perf record -q -F 999 --call-graph dwarf')}
<p>The usual workaround, <code>--call-graph dwarf</code>, copies a slice of the stack at every sample and unwinds it later from debug info: the data file was <strong>63× bigger</strong> (7.8 MB vs 124 KB) for the same one-second run. Prefer frame pointers; use DWARF when you cannot rebuild.</p>

<h3>perf on a JIT: Node with --perf-basic-prof</h3>
<p>V8 compiles JavaScript at run time into memory that has no symbol table. <code>node --perf-basic-prof</code> writes a map file <code>/tmp/perf-PID.map</code> (address, size, name) that <code>perf</code> reads automatically. We profile <code>orders.js</code> under load:</p>
${run('c152-perf', 'perf record -F 499 -g -p')}
${run('c152-perf', 'perf report -i node.data')}
${run('c152-perf', 'ls /tmp/perf-$N.map')}
${run('c152-perf', 'perf script -i node.data')}
${run('c152-perf', "awk '{n = $NF; $NF = \"\"; print n, $0}' node.folded")}
<p>93.3% of the samples are in <code>Builtins_ArrayIncludesSmiOrObject</code> — V8's built-in <code>Array.prototype.includes</code> — and 97.7% of all stacks pass through <code>report</code> at <code>orders.js:22</code>. Reading the hottest stack bottom-up gives the whole story: the HTTP parser fires the request event, the handler calls <code>report</code>, and <code>report</code> spends its time in <code>includes</code>. (<code>uniqueCustomers</code> is gone from the stack because the JIT inlined it into <code>report</code> — lesson 15.4 shows how the language's own profiler deals with that.) Without the flag:</p>
${run('c152-perf', 'perf record -q -F 499 -g -p $N -o nomap.data')}
${run('c152-perf', "awk '{n = $NF; $NF = \"\"; print n, $0}' nomap.folded")}
<p>The built-in still has a name (it lives in the <code>node</code> binary), but every JavaScript frame above it is now <code>[perf-244.map]</code> — "some code in a map file that does not exist". You would know <em>what</em> is hot, not <em>who</em> called it.</p>

<div class="pitfall co-tieu-de">
<p><strong>"The flame graph shows <code>sprintf</code> on the left, so it runs first."</strong> The x-axis is alphabetical, not time — <code>handle;parse_headers</code> sits right of <code>handle;crc_bitwise</code> only because "p" sorts after "c". If you need time order, you need a different chart (a flame <em>chart</em>, like Chrome DevTools draws).</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>"I made the checksum 8× faster, so requests will be 8× faster."</strong> Measured: the function went from 87% to a small part of the work, but the request only got 2.9× faster, because everything else stayed. Re-profile after every fix — the new profile is your next to-do list.</p>
</div>

<h3>🧪 Practice (40 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a teammate says "the JSON rendering is slow, let's switch libraries". Before anyone rewrites anything, you profile.</p>
<ol>
<li>In a <code>--privileged</code> lab container, build <code>hot.c</code> with frame pointers and run <code>perf stat</code> and <code>perf record -F 999 -g</code> on <code>./hot 50000 table</code> (the already-fixed version).</li>
<li>Produce the folded file and a flame graph (<code>stackcollapse-perf.pl</code>, <code>flamegraph.pl</code>); open the SVG in a browser and click <code>render_json</code> to zoom.</li>
<li>Use <code>python3 folded.py</code> to give the self and total share of <code>render_json</code>. Is the teammate right, and how much could a perfect JSON renderer save at most?</li>
<li>Rebuild with <code>-s</code> and show that the same profile becomes unusable.</li>
</ol>
<p><strong>Done when:</strong> you report "render_json is X% total (≈25% here), so even an infinitely fast renderer gives at most 1/(1 − X) speedup (≈1.33×)", with the flame graph attached — and you know which other plateau is bigger.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['sampling profiler', 'Interrupts the program at a fixed rate and records where it is; the share of samples ≈ the share of CPU time.'],
  ['perf record / report / script', 'Collect samples / summarise them / print every raw sample.'],
  ['self vs total (children)', 'Time in the function itself vs in it plus everything it called.'],
  ['folded stacks', 'One line per distinct stack, root;…;leaf followed by a count — the data behind a flame graph.'],
  ['flame graph', 'Stacks drawn as boxes: width = share of samples, x-axis alphabetical (not time), top edge = on CPU.'],
  ['frame pointer', 'A register that links each stack frame to its caller, letting the profiler walk the stack cheaply.'],
  ['perf map file', '/tmp/perf-PID.map written by a JIT (node --perf-basic-prof) so perf can name generated code.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Check the shape first: <code>perf stat</code> showed task-clock ≈ wall time, so the problem was on-CPU.</li>
<li><code>perf record -g</code> + <code>perf report</code>: <code>crc_bitwise</code> 86.9%; <code>perf annotate</code> put 76% of it on one instruction of the bit loop.</li>
<li>perf script → stackcollapse → folded text → flamegraph.pl: the folded text is the data, the SVG only draws it; width = share, x-axis is not time.</li>
<li>Fix + re-measure: table CRC 921 → 313 ms (2.9×), and the new profile names the next target (<code>render_json</code> 24.9%).</li>
<li>Stripped binaries give hex addresses; <code>--call-graph dwarf</code> cost 63× more data; JITs need a map file — without it Node frames became <code>[perf-244.map]</code>.</li>
</ul>
${L('https://www.brendangregg.com/flamegraphs.html', '🔥', 'Flame Graphs — Brendan Gregg', 'What they are, how to read them, CPU/off-CPU/differential variants.', 'Open')}
${L('https://man7.org/linux/man-pages/man1/perf-record.1.html', '🐧', 'perf-record(1) — man7.org', '-F, -g, --call-graph fp|dwarf, -p: every option used in this lesson.', 'Open')}
${L('https://github.com/brendangregg/FlameGraph', '🔧', 'brendangregg/FlameGraph', 'stackcollapse-*.pl, flamegraph.pl, difffolded.pl.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.2</span>
<h2>perf và flame graph: để chính CPU kể thời gian đi đâu</h2>
<p class="lead">Bài 15.1 kết thúc ở câu "event loop bị <code>/report</code> làm bão hoà". Câu đó gọi tên tài nguyên, chưa gọi tên dòng code. Muốn tìm dòng code, bạn hỏi chính CPU, hàng nghìn lần mỗi giây: <em>bây giờ bạn đang chạy gì, và ai gọi nó?</em> Câu hỏi của bài: <strong>một profiler lấy mẫu tìm đường nóng ra sao, đọc output của nó — bảng, folded stack, flame graph — thế nào, và làm sao chứng minh bản sửa đã có tác dụng?</strong> Ta dùng <code>perf</code>, profiler có sẵn trong Linux, trước hết trên một "máy chủ" C nhỏ rồi trên dịch vụ Node của chương này.</p>

<h3>Profiler lấy mẫu nhìn chương trình ra sao</h3>
<p><code>perf record -F 999 -g</code> nhờ nhân ngắt chương trình 999 lần cho mỗi giây thời gian CPU. Mỗi lần ngắt, nhân ghi lại con trỏ lệnh và đi dọc ngăn xếp — lần theo chuỗi <strong>frame pointer</strong> đã lưu từ hàm hiện tại lên tới <code>main</code> — rồi cất danh sách địa chỉ trả về. Sau đó <code>perf</code> đổi địa chỉ thành tên hàm nhờ bảng ký hiệu của từng tệp nhị phân. Ba hệ quả quan trọng cho mọi thứ bên dưới:</p>
<ul>
<li>Nó mang tính <strong>thống kê</strong>: hàm xuất hiện trong 87% số mẫu đã dùng khoảng 87% thời gian CPU. Lượt chạy ngắn thì phần trăm nhiễu.</li>
<li>Nó chỉ thấy code <strong>khi đang chạy trên CPU</strong>. Một luồng đang chờ khoá, chờ đĩa hay chờ mạng không bao giờ bị ngắt, nên không bao giờ hiện ra — bài 15.3 nói về điểm mù đó.</li>
<li>Muốn có tên thì cần ký hiệu, muốn có ngăn xếp thì cần frame pointer (hoặc một cách tháo ngăn xếp khác). Mất một trong hai là bức tranh vỡ — bên dưới bạn sẽ thấy cả hai kiểu hỏng.</li>
</ul>
<p>Vì sao 999 mà không phải 1000? Một tần số tròn có thể chạy "cùng nhịp" với thứ gì đó cũng chạy mỗi mili giây và hoặc luôn bắt gặp nó, hoặc không bao giờ; một tần số lẻ tránh được điều đó. Trong máy ảo Docker Desktop, <code>perf</code> cần <code>--privileged</code> (hồ sơ seccomp mặc định chặn <code>perf_event_open</code>) và chỉ có sự kiện phần mềm (<code>cpu-clock</code>, <code>task-clock</code>) — không có bộ đếm phần cứng như cache, giống bài 3.3.</p>

<h3>Chương trình: một hàm xử lý request có phép tính checksum chậm</h3>
<p><code>hot.c</code> xử lý N request HTTP giả. Mỗi request: phân tích header, tính CRC-32 của thân từng bit một (cố ý chậm: tám vòng lặp cho mỗi byte), dựng JSON trả lời bằng <code>sprintf</code>, rồi "ghi log". Các hàm được đánh dấu <code>noinline</code> để mỗi hàm giữ khung riêng của nó:</p>
${src('ch15/hot.c', 'c')}
${run('c152-perf', './hot 50000')}
${run('c152-perf', 'perf stat')}
<p>Bắt đầu bằng <code>perf stat</code>: 913 ms CPU (<code>task-clock</code>) trong 0,914 s thời gian thật — chương trình nằm trên CPU suốt, chỉ 4 lần chuyển ngữ cảnh và 52 page fault. Đó là hình dạng của một vấn đề CPU thuần, nên profiler CPU là đúng công cụ. (Nếu thời gian thật lớn hơn nhiều so với task-clock, công cụ của bài sau mới đúng.)</p>

<h3>perf record và perf report: hồ sơ phẳng</h3>
${run('c152-perf', 'perf record -F 999 -g -o hot.data')}
${run('c152-perf', 'perf report -i hot.data --stdio --no-children --sort symbol 2')}
<p>915 mẫu, và <strong>86,9% trong số đó nằm trong <code>crc_bitwise</code></strong>. <code>--no-children</code> chỉ tính mỗi mẫu cho hàm ở đỉnh ngăn xếp (thời gian "self"). Phần còn lại là ruột của <code>sprintf</code> (<code>__printf_buffer</code>, <code>_itoa_word</code>) và <code>parse_headers</code>. Ai gọi hàm nóng? <code>-G</code> in chuỗi lời gọi:</p>
${run('c152-perf', 'perf report -i hot.data --stdio --no-children --sort symbol --symbols')}
<p>Thiếu một khung: <code>checksum()</code>. Dòng cuối của nó là <code>return crc_bitwise(...)</code>, và ở <code>-O2</code> GCC biến lời gọi đó thành một lệnh nhảy thường (<em>tail call</em> — gọi ở đuôi), nên khung của <code>checksum</code> không còn tồn tại trong lúc <code>crc_bitwise</code> chạy. Profiler chỉ vẽ được những khung có thật — nếu thiếu một hàm bạn chờ đợi, hãy kiểm chuyện inline và tail call trước khi nghi công cụ.</p>

<h3>Từ mẫu tới folded stack tới flame graph</h3>
<p>Một bảng phẳng làm mất hình dạng của chương trình. Flame graph của Brendan Gregg giữ được nó, và đường ống gồm ba bước nhỏ bạn xem được từng bước. <code>perf script</code> in mọi mẫu dưới dạng một ngăn xếp, lá trước:</p>
${run('c152-perf', 'perf script -i hot.data -F comm,pid,tid,ip,sym,dso 2>/dev/null | head')}
<p><code>stackcollapse-perf.pl</code> gập mỗi ngăn xếp thành một dòng, gốc trước, và đếm các dòng giống nhau. 915 mẫu thành 17 ngăn xếp khác nhau; ba dòng đầu:</p>
${run('c152-perf', 'perf script -i hot.data -F comm,pid,tid,ip,sym,dso 2>/dev/null | perl', 2)}
<p>Đoạn chữ đó <em>chính là</em> flame graph: <code>flamegraph.pl</code> chỉ vẽ nó ra. <code>folded.py</code> (trong <code>lab/code/ch15</code>) in hai con số bạn đọc được trên flame graph — <strong>self</strong> (mép trên cùng: đang chạy trên CPU) và <strong>total</strong> (bề rộng một khung: nó cộng mọi thứ nó gọi):</p>
${run('c152-perf', 'python3 folded.py hot.folded')}
<p>Cách đọc bức hình (nó nằm trong phần slide ở trên, vẽ từ đúng những ngăn xếp này):</p>
<ul>
<li>Mỗi hộp là một hàm; hộp nằm trên nó là hàm nó gọi. Trục dọc là độ sâu ngăn xếp.</li>
<li>Trục ngang <strong>không phải thời gian</strong>: các hộp được xếp theo thứ tự chữ cái để những ngăn xếp giống nhau gộp lại. Chỉ <strong>bề rộng</strong> là có nghĩa — phần trăm số mẫu.</li>
<li>Tìm những <strong>cao nguyên</strong> rộng ở mép trên: đó là chỗ CPU thật sự đang ở. Ở đây có một cao nguyên: <code>crc_bitwise</code>, 86,9% bề rộng.</li>
<li>Hộp rộng mà đỉnh phẳng là thời gian self; hộp rộng mà bị các hộp con phủ kín là hàm chỉ đắt vì những gì nó gọi (<code>render_json</code>: total 10,2%, self gần như không).</li>
</ul>
${lab('sysmon', 'cpuhog', 'vi', 'Góc nhìn hệ thống của cùng tình huống: một tiến trình ăn trọn một lõi. top cho biết tiến trình NÀO; profiler của bài này cho biết DÒNG nào.', { tour: 'sysmon-read' })}

<h3>Xuống tới từng lệnh máy: perf annotate</h3>
${run('c152-perf', 'perf annotate')}
<p>Bên trong <code>crc_bitwise</code>, 75,9% số mẫu rơi vào một lệnh: <code>sbfx</code>, lệnh dựng mặt nạ <code>-(c &amp; 1)</code>, và 12,8% vào lệnh rẽ nhánh khép vòng lặp tám bit. (Mẫu hay "trượt" sang lệnh ngay sau lệnh thật sự chậm, nên hãy đọc annotate như một vùng lân cận, không phải một địa chỉ chính xác.) Kết luận không cần đoán: việc tốn là vòng lặp bit bên trong, tám vòng cho mỗi byte của mỗi request.</p>

<h3>Sửa, rồi đo lại — bằng đúng công cụ đó</h3>
<p>Cách sửa kinh điển cho CRC từng bit là một bảng 256 phần tử tính sẵn một lần: mỗi byte một lần tra bảng thay vì tám phép dịch. <code>./hot N table</code> chạy bản đó:</p>
${run('c152-perf', './hot 50000 table')}
${run('c152-perf', 'perf script -i fixed.data')}
<p>921 ms → 313 ms: <strong>nhanh gấp 2,9 lần</strong> cho cả request, không phải 8 lần, vì checksum chiếm 87% còn phần còn lại không đổi — định luật Amdahl của bài 4.5 áp vào một hàm. Hồ sơ mới cũng cho biết nhìn đâu tiếp theo: <code>crc_table</code> vẫn 64,4% (nó vẫn là việc chính), và <code>render_json</code> đã tăng từ 10,2% lên 24,9% của một tổng nhỏ hơn. Phần slide có <strong>flame graph vi sai</strong> (<code>difffolded.pl -n before after | flamegraph.pl</code>): bề rộng các hộp lấy từ hồ sơ <em>sau</em>, đỏ là nhiều mẫu hơn trước, xanh là ít hơn. Đọc cho cẩn thận: <code>crc_bitwise</code> không còn tồn tại nên không thể hiện ra, còn <code>crc_table</code> mang tên mới nên hiện toàn màu đỏ như đồ mới hoàn toàn — khi code bị đổi tên hay bị xoá, hãy vẽ thêm bản vi sai theo chiều ngược lại.</p>

<h3>Ba cách làm vỡ bức tranh</h3>
${run('c152-perf', 'gcc -O2 hot.c -o hot-stripped')}
<p><strong>Tệp nhị phân bị strip</strong> (<code>-s</code>, hoặc <code>strip</code> trong Docker build để tiết kiệm vài KB) không còn bảng ký hiệu: chỗ nóng giờ là <code>0x...e2c</code>, không ai làm gì được với nó. Hãy giữ ký hiệu trong bản build production, hoặc giữ một tệp debug info đi kèm.</p>
${run('c152-perf', 'gcc -O2 -g hot.c -o hot-nofp')}
<p><strong>Frame pointer.</strong> Các ngăn xếp ở trên được đi dọc nhờ frame pointer. Build không có <code>-fno-omit-frame-pointer</code>, ngăn xếp ở đây vẫn đầy đủ — trên arm64, GCC giữ một bản ghi khung trong mọi hàm có gọi hàm khác, và các bản phân phối Ubuntu, Fedora giờ build gói của mình kèm frame pointer chính vì lý do này. Trên x86-64 với <code>gcc -O2</code> trơn, thanh ghi frame pointer bị dùng như thanh ghi thường và ngăn xếp của <code>perf -g</code> vỡ thành mảnh <em>(theo tài liệu GCC và perf — không đo ở đây: máy lab là arm64)</em>.</p>
${run('c152-perf', 'perf record -q -F 999 --call-graph dwarf')}
<p>Cách lách thường dùng, <code>--call-graph dwarf</code>, chép một khúc ngăn xếp ở mỗi mẫu rồi tháo nó sau bằng debug info: tệp dữ liệu <strong>to gấp 63 lần</strong> (7,8 MB so với 124 KB) cho cùng một lượt chạy một giây. Ưu tiên frame pointer; dùng DWARF khi không build lại được.</p>

<h3>perf trên mã JIT: Node với --perf-basic-prof</h3>
<p>V8 biên dịch JavaScript lúc chạy vào vùng nhớ không có bảng ký hiệu. <code>node --perf-basic-prof</code> ghi một tệp bản đồ <code>/tmp/perf-PID.map</code> (địa chỉ, kích thước, tên) mà <code>perf</code> tự đọc. Ta đo hồ sơ <code>orders.js</code> khi có tải:</p>
${run('c152-perf', 'perf record -F 499 -g -p')}
${run('c152-perf', 'perf report -i node.data')}
${run('c152-perf', 'ls /tmp/perf-$N.map')}
${run('c152-perf', 'perf script -i node.data')}
${run('c152-perf', "awk '{n = $NF; $NF = \"\"; print n, $0}' node.folded")}
<p>93,3% số mẫu nằm trong <code>Builtins_ArrayIncludesSmiOrObject</code> — hàm dựng sẵn <code>Array.prototype.includes</code> của V8 — và 97,7% mọi ngăn xếp đi qua <code>report</code> ở <code>orders.js:22</code>. Đọc ngăn xếp nóng nhất từ dưới lên là ra cả câu chuyện: bộ phân tích HTTP phát sự kiện request, hàm xử lý gọi <code>report</code>, và <code>report</code> tiêu thời gian trong <code>includes</code>. (<code>uniqueCustomers</code> biến mất khỏi ngăn xếp vì JIT đã inline nó vào <code>report</code> — bài 15.4 cho thấy profiler của chính ngôn ngữ xử lý chuyện đó ra sao.) Không có cờ:</p>
${run('c152-perf', 'perf record -q -F 499 -g -p $N -o nomap.data')}
${run('c152-perf', "awk '{n = $NF; $NF = \"\"; print n, $0}' nomap.folded")}
<p>Hàm dựng sẵn vẫn có tên (nó nằm trong tệp nhị phân <code>node</code>), nhưng mọi khung JavaScript phía trên giờ đều là <code>[perf-244.map]</code> — "một đoạn code nào đó trong một tệp bản đồ không tồn tại". Bạn biết <em>cái gì</em> nóng, nhưng không biết <em>ai</em> gọi nó.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Flame graph vẽ <code>sprintf</code> bên trái, vậy nó chạy trước."</strong> Trục ngang xếp theo chữ cái, không theo thời gian — <code>handle;parse_headers</code> nằm bên phải <code>handle;crc_bitwise</code> chỉ vì "p" đứng sau "c". Muốn thứ tự thời gian thì cần một biểu đồ khác (flame <em>chart</em>, kiểu Chrome DevTools vẽ).</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>"Mình làm checksum nhanh gấp 8, vậy request sẽ nhanh gấp 8."</strong> Đo được: hàm đó từ 87% còn một phần nhỏ của công việc, nhưng request chỉ nhanh gấp 2,9 lần, vì mọi thứ khác vẫn nguyên. Đo hồ sơ lại sau mỗi lần sửa — hồ sơ mới là danh sách việc tiếp theo của bạn.</p>
</div>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một bạn trong nhóm nói "phần dựng JSON chậm, đổi thư viện đi". Trước khi ai viết lại gì, bạn đo hồ sơ.</p>
<ol>
<li>Trong một container lab <code>--privileged</code>, build <code>hot.c</code> kèm frame pointer rồi chạy <code>perf stat</code> và <code>perf record -F 999 -g</code> trên <code>./hot 50000 table</code> (bản đã sửa).</li>
<li>Tạo tệp folded và flame graph (<code>stackcollapse-perf.pl</code>, <code>flamegraph.pl</code>); mở SVG trong trình duyệt và bấm vào <code>render_json</code> để phóng to.</li>
<li>Dùng <code>python3 folded.py</code> để lấy phần self và total của <code>render_json</code>. Bạn kia đúng không, và một bộ dựng JSON hoàn hảo tiết kiệm được tối đa bao nhiêu?</li>
<li>Build lại với <code>-s</code> và cho thấy cùng hồ sơ đó trở nên vô dụng.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn báo cáo được "render_json chiếm X% total (≈25% ở đây), nên kể cả một bộ dựng nhanh vô hạn cũng chỉ cho tối đa 1/(1 − X) lần (≈1,33×)", kèm flame graph — và biết cao nguyên nào khác còn lớn hơn.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['sampling profiler (profiler lấy mẫu)', 'Ngắt chương trình theo nhịp cố định và ghi lại nó đang ở đâu; phần trăm số mẫu ≈ phần trăm thời gian CPU.'],
  ['perf record / report / script', 'Thu mẫu / tóm tắt mẫu / in từng mẫu thô.'],
  ['self vs total (children)', 'Thời gian trong chính hàm vs trong hàm cộng mọi thứ nó gọi.'],
  ['folded stacks (ngăn xếp gập)', 'Mỗi ngăn xếp khác nhau một dòng, gốc;…;lá rồi tới số đếm — dữ liệu đằng sau flame graph.'],
  ['flame graph', 'Ngăn xếp vẽ thành hộp: bề rộng = phần trăm mẫu, trục ngang theo chữ cái (không phải thời gian), mép trên = đang trên CPU.'],
  ['frame pointer', 'Thanh ghi nối mỗi khung ngăn xếp với khung của hàm gọi, giúp profiler đi dọc ngăn xếp với giá rẻ.'],
  ['perf map file (tệp bản đồ perf)', '/tmp/perf-PID.map do JIT ghi (node --perf-basic-prof) để perf đặt tên được cho mã sinh ra lúc chạy.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Xem hình dạng trước: <code>perf stat</code> cho thấy task-clock ≈ thời gian thật, nên vấn đề nằm trên CPU.</li>
<li><code>perf record -g</code> + <code>perf report</code>: <code>crc_bitwise</code> 86,9%; <code>perf annotate</code> đặt 76% của nó vào một lệnh của vòng lặp bit.</li>
<li>perf script → stackcollapse → chữ folded → flamegraph.pl: chữ folded là dữ liệu, SVG chỉ vẽ nó; bề rộng = phần trăm, trục ngang không phải thời gian.</li>
<li>Sửa + đo lại: CRC tra bảng 921 → 313 ms (2,9×), và hồ sơ mới gọi tên mục tiêu kế tiếp (<code>render_json</code> 24,9%).</li>
<li>Tệp bị strip cho ra địa chỉ hex; <code>--call-graph dwarf</code> tốn gấp 63 lần dữ liệu; mã JIT cần tệp bản đồ — thiếu nó, khung Node thành <code>[perf-244.map]</code>.</li>
</ul>
${L('https://www.brendangregg.com/flamegraphs.html', '🔥', 'Flame Graphs — Brendan Gregg', 'Chúng là gì, đọc thế nào, các biến thể CPU/off-CPU/vi sai.', 'Mở')}
${L('https://man7.org/linux/man-pages/man1/perf-record.1.html', '🐧', 'perf-record(1) — man7.org', '-F, -g, --call-graph fp|dwarf, -p: mọi tuỳ chọn dùng trong bài.', 'Mở')}
${L('https://github.com/brendangregg/FlameGraph', '🔧', 'brendangregg/FlameGraph', 'stackcollapse-*.pl, flamegraph.pl, difffolded.pl.', 'Mở')}
</div>
`,
};

/* ───────────────────────── 15.3 — thời gian ngoài CPU ───────────────────────── */
const L153 = {
  title: '15.3 — Off-CPU time: where the waiting goes, and why a CPU profiler cannot see it|||15.3 — Thời gian ngoài CPU: thời gian chờ đi đâu, và vì sao profiler CPU không thấy',
  slug: 'os-15-6-off-cpu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Thời gian thật = trên CPU + ngoài CPU: 8 luồng chạy 1,62 s mà chỉ dùng 0,63 s CPU; profiler CPU nói price_order 96,7% (đúng mà vô dụng), pidstat -w thấy ~175 lần tự nhường CPU mỗi giây mỗi luồng, offcputime (eBPF, đổi PID container sang PID của nhân) cho thấy 87,8% thời gian chờ nằm ở futex — một cái khoá, "poor man\'s profiler" bằng gdb chỉ ra đúng dòng pthread_mutex_lock; sửa (ghi ra ngoài khoá) 1 621 → 250 ms; bảng tra khung nhân ⇒ lý do chờ.',
  content: `${G153}
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.3</span>
<h2>Off-CPU time: the half of the story a CPU profiler never tells</h2>
<p class="lead">Lesson 15.2's profiler takes a sample only when a thread is <em>running</em>. A thread waiting for a lock, a disk write or a reply from the database is not running, so it is never sampled — and in backend code, waiting is usually most of the time. The question of this lesson: <strong>when a program is slow but its CPU usage is low, how do you find out what it is waiting for, and which line of code made it wait?</strong></p>

<h3>Wall time = on-CPU time + off-CPU time</h3>
<p>Brendan Gregg calls it <strong>off-CPU analysis</strong>: for every thread, the time between being switched out and being switched back in, with the stack at the moment it left. On-CPU and off-CPU profiles together account for every millisecond of a thread's life. The program, <code>wait.c</code>: eight threads each "process" 150 orders — about 0.5 ms of real CPU work (<code>price_order</code>), then they take a shared lock and, <em>while holding it</em>, write an audit record (a 1 ms sleep standing in for an <code>fsync</code> or a network call):</p>
${src('ch15/wait.c', 'c')}
${run('c153-offcpu', 'time ./wait inside')}
<p>1.62 seconds of wall time, but only 0.61 s of user CPU — on a machine where eight threads could have used eight cores. On average 0.39 cores were busy. The program is slow, and it is <strong>not</strong> busy. That gap is off-CPU time.</p>

<h3>The CPU profile is true and useless</h3>
${run('c153-offcpu', 'profile-libbpf')}
<p><code>profile</code> (the libbpf-tools version of a CPU sampler, like <code>perf record</code>) says <code>price_order</code> is 96.7% of the CPU. That is <em>correct</em> — and if you optimised <code>price_order</code> to zero, the program would still take about 1.2 s, because the CPU was never the bottleneck. The tell-tale is in the scheduler's counters (lesson 3.3):</p>
${run('c153-offcpu', './wait inside 300')}
<p>Each worker thread gives up the CPU <strong>voluntarily</strong> about 175 times per second (<code>cswch/s</code>) and is almost never preempted (<code>nvcswch/s</code> ≈ 0). Voluntary switches mean "I am going to wait for something". Now we need to know <em>what</em>.</p>

<h3>offcputime: measure the waiting, with stacks</h3>
<p><code>offcputime</code> is an eBPF tool: a tiny program attached to the scheduler's <code>sched_switch</code> event notes when a thread leaves the CPU and, when it comes back, adds the elapsed time to that thread's stack. One complication first: eBPF runs in the kernel and speaks the kernel's PIDs, while inside a container you see the container's PIDs (lesson 12.1). We translate with a one-line bpftrace program that prints the kernel's view of the process (<code>curtask-&gt;tgid</code>) — more about bpftrace in lesson 15.5:</p>
${run('c153-offcpu', 'G=$(bpftrace')}
${run('c153-offcpu', 'offcputime-libbpf -p $G 3')}
<p>One block per distinct stack: kernel frames from the leaf (<code>__schedule</code>: the thread left the CPU here) down to the system-call entry, the thread, and the microseconds it spent switched out with that stack. This build of <code>offcputime</code> records kernel stacks only; they are enough to tell <em>why</em> a thread waited. <code>offcpu2folded.py</code> turns the blocks into folded stacks (dropping the frames every sleep has in common), so the same <code>folded.py</code> as before applies:</p>
${run('c153-offcpu', 'python3 offcpu2folded.py')}
<p>22.6 seconds of off-CPU time in 3 seconds — eight threads waiting almost all the time. <strong>87.8% of it is <code>futex_do_wait</code></strong>: a <code>futex</code> is how a contended <code>pthread_mutex_lock</code> sleeps (lesson 5.2). 12.2% is <code>do_nanosleep</code>, the "audit write". The threads spend seven times longer waiting <em>for the lock</em> than doing the slow I/O itself. The off-CPU flame graph in the slides shows the same two towers.</p>

<h3>Which lock? A poor man's profiler</h3>
<p>Kernel stacks say "a lock"; they do not say which line of <em>your</em> code took it. A crude but famous technique, the <strong>poor man's profiler</strong>, answers that: stop the process with <code>gdb</code>, print the stack of every thread, repeat a few times, and count. Every thread is captured, running or not — it is wall-clock sampling. <code>pmp.py</code> does it five times, 200 ms apart:</p>
${run('c153-offcpu', 'python3 pmp.py')}
<p>73.3% of all thread snapshots are parked in <code>pthread_mutex_lock</code> called from <code>worker</code> — line 28, the <code>audit_lock</code>. 11.1% are inside <code>write_audit</code> (the one thread that holds the lock, sleeping), 11.1% are <code>main</code> in <code>pthread_join</code>, and only 4.4% are actually computing. The diagnosis is complete: <em>one thread sleeps while holding the lock, seven queue behind it.</em> (Each gdb snapshot freezes the process for tens of milliseconds; on production use it sparingly, or use a wall-clock profiler such as async-profiler's <code>-e wall</code> mode for Java.)</p>
${lab('scheduler', 'interactive', 'en', 'CPU-bound and I/O-bound tasks on one CPU: watch how much of an I/O-bound task’s life is spent blocked, never on the CPU — exactly the time a CPU profiler cannot sample.', { tour: 'scheduler-start' })}

<h3>Fix, and look at the off-CPU profile again</h3>
<p>Keep under the lock only what really must be serialised, and do the slow I/O outside it. (Here the lock then protects nothing, which is the point: the write never needed it. In real code check what ordering the lock was providing — appending to a file opened with <code>O_APPEND</code>, for example, is already atomic per <code>write</code>, lesson 9.2.)</p>
${run('c153-offcpu', 'time ./wait outside')}
${run('c153-offcpu', "G=$(bpftrace -q -e 'tracepoint:syscalls:sys_enter_futex /comm == \"wait\"/ { printf(\"%d\\n\", curtask->tgid); exit(); }'); offcputime")}
<p>1 621 ms → <strong>250 ms, 6.5× faster</strong>, with 1.93 cores busy on average instead of 0.39. The off-CPU profile changed character: 100% <code>do_nanosleep</code>. The threads still wait — the "I/O" still takes 1 ms per order — but now they wait <em>in parallel</em>, not in a queue for a lock. Remaining off-CPU time that is pure I/O is often fine; off-CPU time in a lock is almost always a bug.</p>

<h3>Reading off-CPU stacks: what the leaf frame means</h3>
<table>
<tr><th>Kernel frame near the leaf</th><th>The thread was waiting for…</th><th>Look next at</th></tr>
<tr><td><code>futex_wait</code>, <code>futex_do_wait</code></td><td>a lock or condition variable in user space (pthread mutex, Java monitor, Go/Node internals)</td><td>which lock: gdb/pmp, async-profiler <code>-e lock</code>, JFR <code>jdk.JavaMonitorEnter</code></td></tr>
<tr><td><code>do_nanosleep</code></td><td>a sleep the program asked for</td><td>why it sleeps (polling? backoff?)</td></tr>
<tr><td><code>io_schedule</code>, <code>folio_wait_*</code>, <code>jbd2_log_wait_commit</code></td><td>the disk: reads, writeback, fsync, the journal</td><td><code>biolatency</code>, <code>iostat</code>; lesson 15.8</td></tr>
<tr><td><code>sk_wait_data</code>, <code>ep_poll</code>, <code>do_epoll_wait</code></td><td>the network, or simply idle (no work)</td><td>the peer's latency; is it idle or blocked?</td></tr>
<tr><td><code>exit_to_user_mode_loop</code> (preempted)</td><td>a CPU — runnable but not running</td><td>run-queue latency: <code>runqlat</code>, lesson 15.5</td></tr>
</table>
<p>Two of these are the eBPF tools of lesson 15.5; the third column for Java names features of those tools <em>(per their documentation, not measured in this lesson)</em>.</p>

<div class="pitfall co-tieu-de">
<p><strong>"The profiler says price_order is 97%, so we optimise price_order."</strong> Measured here: the CPU was busy 0.39 cores out of 8, and the lock queue cost more than all computation together. Before you trust a CPU profile, compare <em>CPU time</em> with <em>wall time</em> (<code>time</code>, <code>perf stat</code>): if wall time is much larger, the bottleneck is off-CPU and a CPU profile will point you at the wrong place.</p>
</div>

<h3>🧪 Practice (40 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a nightly export job takes 40 minutes; the CPU graph of its server is flat at 10%, and someone suggests "buy faster CPUs".</p>
<ol>
<li>In a <code>--privileged</code> lab container (with the libbpf-tools and bpftrace debs, as in <code>c153-offcpu.sh</code>), run <code>time ./wait inside</code> and compute busy cores = (user + sys) ÷ real.</li>
<li>Run <code>./wait inside 600 &amp;</code> and collect both profiles: <code>profile-libbpf -f -p</code> (on-CPU) and <code>offcputime-libbpf -p</code> with the kernel PID (off-CPU). Fold both and compare their top frames.</li>
<li>Use <code>python3 pmp.py PID 5 0.2</code> to find the line that waits.</li>
<li>Change the program so the lock is held only around the shared update, re-measure wall time and the off-CPU profile.</li>
</ol>
<p><strong>Done when:</strong> you can show, with numbers from your run, that on-CPU time hardly changed while wall time dropped several-fold, and that the off-CPU profile moved from <code>futex</code> to <code>nanosleep</code>.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['off-CPU time', 'Time a thread spends switched out: blocked on a lock, I/O, sleep, or waiting for a CPU.'],
  ['off-CPU analysis', 'Recording how long each thread is off-CPU and with which stack, e.g. with offcputime.'],
  ['voluntary vs involuntary switch', 'The thread chose to wait (cswch) vs the scheduler took the CPU away (nvcswch).'],
  ['futex', 'Fast user-space mutex: the kernel call a contended pthread mutex or condition variable sleeps in.'],
  ['wall-clock profiling', 'Sampling every thread regardless of state (gdb snapshots, async-profiler -e wall).'],
  ["poor man's profiler", 'Repeated gdb stack dumps of all threads, counted — crude, effective, briefly stops the process.'],
  ['kernel PID vs container PID', 'eBPF tools see the kernel-wide PID; inside a PID namespace you see another number.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Wall time = on-CPU + off-CPU. A CPU profiler only sees the first; compare CPU time with wall time before you trust it.</li>
<li>Measured: 1 621 ms wall, 0.39 cores busy; the CPU profile blamed <code>price_order</code> (96.7%) — correct and irrelevant.</li>
<li><code>offcputime</code>: 87.8% of the waiting was <code>futex</code> (a lock), 12.2% the actual sleep; <code>pmp.py</code> pinned it to <code>pthread_mutex_lock</code> in <code>worker</code>.</li>
<li>Doing the I/O outside the lock: 250 ms (6.5×); off-CPU time became 100% <code>nanosleep</code> — waiting in parallel instead of in a queue.</li>
<li>Inside containers, eBPF tools use kernel PIDs; translate first.</li>
</ul>
${L('https://www.brendangregg.com/offcpuanalysis.html', '📘', 'Off-CPU Analysis — Brendan Gregg', 'The method, offcputime, off-CPU flame graphs and their caveats.', 'Open')}
${L('https://github.com/iovisor/bcc/tree/master/libbpf-tools', '🐝', 'libbpf-tools (BCC)', 'offcputime, profile, runqlat… as small CO-RE binaries.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.3</span>
<h2>Thời gian ngoài CPU: nửa câu chuyện mà profiler CPU không bao giờ kể</h2>
<p class="lead">Profiler của bài 15.2 chỉ lấy mẫu khi một luồng đang <em>chạy</em>. Một luồng đang chờ khoá, chờ ghi đĩa hay chờ cơ sở dữ liệu trả lời thì không chạy, nên không bao giờ bị lấy mẫu — mà trong code backend, chờ thường là phần lớn thời gian. Câu hỏi của bài: <strong>khi chương trình chậm mà CPU lại thấp, làm sao biết nó đang chờ cái gì, và dòng code nào bắt nó chờ?</strong></p>

<h3>Thời gian thật = thời gian trên CPU + thời gian ngoài CPU</h3>
<p>Brendan Gregg gọi đó là <strong>phân tích ngoài CPU</strong> (off-CPU analysis): với mỗi luồng, khoảng thời gian từ lúc bị đổi ra khỏi CPU tới lúc được đổi vào lại, kèm ngăn xếp ở thời điểm nó rời đi. Hồ sơ trên CPU và ngoài CPU cộng lại giải thích được mọi mili giây trong đời một luồng. Chương trình <code>wait.c</code>: tám luồng, mỗi luồng "xử lý" 150 đơn — khoảng 0,5 ms việc CPU thật (<code>price_order</code>), rồi lấy một khoá chung và, <em>trong lúc giữ khoá</em>, ghi một bản ghi kiểm toán (ngủ 1 ms, đại diện cho một lần <code>fsync</code> hay một lời gọi mạng):</p>
${src('ch15/wait.c', 'c')}
${run('c153-offcpu', 'time ./wait inside')}
<p>1,62 giây thời gian thật, mà chỉ 0,61 s CPU người dùng — trên một máy mà tám luồng lẽ ra dùng được tám lõi. Trung bình chỉ 0,39 lõi bận. Chương trình chậm, và nó <strong>không</strong> bận. Khoảng chênh đó là thời gian ngoài CPU.</p>

<h3>Hồ sơ CPU đúng mà vô dụng</h3>
${run('c153-offcpu', 'profile-libbpf')}
<p><code>profile</code> (bản libbpf-tools của một bộ lấy mẫu CPU, giống <code>perf record</code>) nói <code>price_order</code> chiếm 96,7% CPU. Điều đó <em>đúng</em> — và nếu bạn tối ưu <code>price_order</code> về không, chương trình vẫn mất khoảng 1,2 s, vì CPU chưa bao giờ là nút thắt. Dấu hiệu nằm ở bộ đếm của bộ lập lịch (bài 3.3):</p>
${run('c153-offcpu', './wait inside 300')}
<p>Mỗi luồng worker <strong>tự nguyện</strong> nhường CPU khoảng 175 lần mỗi giây (<code>cswch/s</code>) và gần như không bao giờ bị giành CPU (<code>nvcswch/s</code> ≈ 0). Chuyển ngữ cảnh tự nguyện nghĩa là "tôi sắp đi chờ một thứ gì đó". Giờ ta cần biết đó là <em>thứ gì</em>.</p>

<h3>offcputime: đo thời gian chờ, kèm ngăn xếp</h3>
<p><code>offcputime</code> là một công cụ eBPF: một chương trình nhỏ gắn vào sự kiện <code>sched_switch</code> của bộ lập lịch ghi lại lúc một luồng rời CPU và, khi nó quay lại, cộng khoảng thời gian đã trôi vào ngăn xếp của luồng đó. Có một chỗ vướng trước: eBPF chạy trong nhân và nói bằng PID của nhân, còn trong container bạn thấy PID của container (bài 12.1). Ta đổi bằng một chương trình bpftrace một dòng in góc nhìn của nhân về tiến trình (<code>curtask-&gt;tgid</code>) — bpftrace sẽ học kỹ ở bài 15.5:</p>
${run('c153-offcpu', 'G=$(bpftrace')}
${run('c153-offcpu', 'offcputime-libbpf -p $G 3')}
<p>Mỗi ngăn xếp khác nhau một khối: các khung nhân từ lá (<code>__schedule</code>: luồng rời CPU tại đây) xuống tới điểm vào lời gọi hệ thống, tên luồng, rồi số micro giây nó đã nằm ngoài CPU với ngăn xếp đó. Bản <code>offcputime</code> này chỉ ghi ngăn xếp nhân; chừng đó đủ để biết <em>vì sao</em> luồng phải chờ. <code>offcpu2folded.py</code> đổi các khối thành folded stack (bỏ những khung mà lần ngủ nào cũng có), để dùng lại đúng <code>folded.py</code> như trước:</p>
${run('c153-offcpu', 'python3 offcpu2folded.py')}
<p>22,6 giây thời gian ngoài CPU trong 3 giây — tám luồng gần như lúc nào cũng chờ. <strong>87,8% là <code>futex_do_wait</code></strong>: <code>futex</code> là cách một <code>pthread_mutex_lock</code> đang tranh chấp đi ngủ (bài 5.2). 12,2% là <code>do_nanosleep</code>, tức "lần ghi kiểm toán". Các luồng chờ <em>cái khoá</em> lâu gấp bảy lần thời gian làm chính việc I/O chậm. Flame graph ngoài CPU trong phần slide cho thấy đúng hai toà tháp đó.</p>

<h3>Khoá nào? "Profiler của người nghèo"</h3>
<p>Ngăn xếp nhân nói "một cái khoá"; nó không nói dòng nào trong code <em>của bạn</em> đã lấy khoá. Một kỹ thuật thô sơ mà nổi tiếng, <strong>poor man's profiler</strong> (profiler của người nghèo), trả lời được: dừng tiến trình bằng <code>gdb</code>, in ngăn xếp của mọi luồng, lặp vài lần rồi đếm. Luồng nào cũng bị chụp, dù đang chạy hay không — đây là lấy mẫu theo thời gian thật. <code>pmp.py</code> làm việc đó năm lần, cách nhau 200 ms:</p>
${run('c153-offcpu', 'python3 pmp.py')}
<p>73,3% tổng số lần chụp các luồng đang đứng ở <code>pthread_mutex_lock</code> được gọi từ <code>worker</code> — dòng 28, cái <code>audit_lock</code>. 11,1% đang ở trong <code>write_audit</code> (đúng một luồng đang giữ khoá, đang ngủ), 11,1% là <code>main</code> trong <code>pthread_join</code>, và chỉ 4,4% đang thật sự tính toán. Chẩn đoán đã trọn: <em>một luồng ngủ trong lúc giữ khoá, bảy luồng xếp hàng sau nó.</em> (Mỗi lần gdb chụp làm đông cứng tiến trình vài chục mili giây; trên production hãy dùng dè sẻn, hoặc dùng profiler theo thời gian thật như chế độ <code>-e wall</code> của async-profiler cho Java.)</p>
${lab('scheduler', 'interactive', 'vi', 'Tác vụ nặng CPU và tác vụ nặng I/O trên một CPU: xem một tác vụ I/O dành bao nhiêu phần đời để bị chặn, không hề ở trên CPU — đúng phần thời gian mà profiler CPU không lấy mẫu được.', { tour: 'scheduler-start' })}

<h3>Sửa, rồi nhìn lại hồ sơ ngoài CPU</h3>
<p>Chỉ giữ trong khoá những gì thật sự cần tuần tự hoá, và làm phần I/O chậm ở ngoài. (Ở đây khoá khi đó chẳng bảo vệ gì cả, và đó chính là điểm mấu chốt: lần ghi vốn chưa bao giờ cần nó. Với code thật, hãy kiểm khoá đang đảm bảo thứ tự gì — ví dụ ghi nối vào tệp mở bằng <code>O_APPEND</code> thì mỗi lần <code>write</code> đã tự nguyên tử, bài 9.2.)</p>
${run('c153-offcpu', 'time ./wait outside')}
${run('c153-offcpu', "G=$(bpftrace -q -e 'tracepoint:syscalls:sys_enter_futex /comm == \"wait\"/ { printf(\"%d\\n\", curtask->tgid); exit(); }'); offcputime")}
<p>1 621 ms → <strong>250 ms, nhanh gấp 6,5 lần</strong>, trung bình 1,93 lõi bận thay vì 0,39. Hồ sơ ngoài CPU đổi hẳn tính chất: 100% <code>do_nanosleep</code>. Các luồng vẫn chờ — "I/O" vẫn tốn 1 ms mỗi đơn — nhưng giờ chúng chờ <em>song song</em>, không phải xếp hàng chờ một cái khoá. Thời gian ngoài CPU thuần I/O thường chấp nhận được; thời gian ngoài CPU vì một cái khoá thì gần như luôn là lỗi.</p>

<h3>Đọc ngăn xếp ngoài CPU: khung lá nói gì</h3>
<table>
<tr><th>Khung nhân gần lá</th><th>Luồng đang chờ…</th><th>Nhìn tiếp vào</th></tr>
<tr><td><code>futex_wait</code>, <code>futex_do_wait</code></td><td>một khoá hay biến điều kiện ở không gian người dùng (pthread mutex, monitor của Java, ruột của Go/Node)</td><td>khoá nào: gdb/pmp, async-profiler <code>-e lock</code>, JFR <code>jdk.JavaMonitorEnter</code></td></tr>
<tr><td><code>do_nanosleep</code></td><td>một lần ngủ do chương trình tự xin</td><td>vì sao nó ngủ (thăm dò? lùi lại chờ thử lại?)</td></tr>
<tr><td><code>io_schedule</code>, <code>folio_wait_*</code>, <code>jbd2_log_wait_commit</code></td><td>đĩa: đọc, ghi về đĩa, fsync, nhật ký (journal)</td><td><code>biolatency</code>, <code>iostat</code>; bài 15.8</td></tr>
<tr><td><code>sk_wait_data</code>, <code>ep_poll</code>, <code>do_epoll_wait</code></td><td>mạng, hoặc đơn giản là đang rảnh (không có việc)</td><td>độ trễ của phía bên kia; rảnh hay bị chặn?</td></tr>
<tr><td><code>exit_to_user_mode_loop</code> (bị giành CPU)</td><td>một CPU — sẵn sàng chạy mà chưa được chạy</td><td>độ trễ hàng đợi chạy: <code>runqlat</code>, bài 15.5</td></tr>
</table>
<p>Hai trong số đó là công cụ eBPF của bài 15.5; cột thứ ba với Java nêu tính năng của các công cụ đó <em>(theo tài liệu của chúng, không đo trong bài này)</em>.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Profiler nói price_order chiếm 97%, vậy ta tối ưu price_order."</strong> Đo ở đây: CPU chỉ bận 0,39 lõi trên 8, và hàng đợi khoá tốn hơn toàn bộ phần tính toán cộng lại. Trước khi tin hồ sơ CPU, hãy so <em>thời gian CPU</em> với <em>thời gian thật</em> (<code>time</code>, <code>perf stat</code>): nếu thời gian thật lớn hơn nhiều, nút thắt nằm ngoài CPU và hồ sơ CPU sẽ chỉ bạn tới sai chỗ.</p>
</div>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một job xuất dữ liệu ban đêm chạy 40 phút; biểu đồ CPU của máy chủ phẳng lì ở 10%, và có người đề nghị "mua CPU nhanh hơn".</p>
<ol>
<li>Trong một container lab <code>--privileged</code> (kèm các gói deb libbpf-tools và bpftrace, như <code>c153-offcpu.sh</code>), chạy <code>time ./wait inside</code> và tính số lõi bận = (user + sys) ÷ real.</li>
<li>Chạy <code>./wait inside 600 &amp;</code> và thu cả hai hồ sơ: <code>profile-libbpf -f -p</code> (trên CPU) và <code>offcputime-libbpf -p</code> với PID của nhân (ngoài CPU). Gập cả hai và so khung đầu bảng.</li>
<li>Dùng <code>python3 pmp.py PID 5 0.2</code> để tìm dòng đang chờ.</li>
<li>Sửa chương trình để khoá chỉ bao quanh phần cập nhật dùng chung, đo lại thời gian thật và hồ sơ ngoài CPU.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn cho thấy được, bằng số của chính lượt chạy của mình, rằng thời gian trên CPU gần như không đổi trong khi thời gian thật giảm nhiều lần, và hồ sơ ngoài CPU chuyển từ <code>futex</code> sang <code>nanosleep</code>.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['off-CPU time (thời gian ngoài CPU)', 'Thời gian một luồng bị đổi ra khỏi CPU: chờ khoá, chờ I/O, ngủ, hoặc chờ tới lượt CPU.'],
  ['off-CPU analysis (phân tích ngoài CPU)', 'Ghi lại mỗi luồng nằm ngoài CPU bao lâu và với ngăn xếp nào, ví dụ bằng offcputime.'],
  ['voluntary vs involuntary switch (chuyển tự nguyện vs bị ép)', 'Luồng tự chọn đi chờ (cswch) vs bộ lập lịch giành CPU khỏi nó (nvcswch).'],
  ['futex', 'Fast user-space mutex: lời gọi nhân mà một pthread mutex hay biến điều kiện đang tranh chấp ngủ trong đó.'],
  ['wall-clock profiling (lấy mẫu theo thời gian thật)', 'Lấy mẫu mọi luồng bất kể trạng thái (chụp bằng gdb, async-profiler -e wall).'],
  ["poor man's profiler (profiler của người nghèo)", 'Lặp lại việc in ngăn xếp mọi luồng bằng gdb rồi đếm — thô, hiệu quả, dừng tiến trình chốc lát.'],
  ['kernel PID vs container PID', 'Công cụ eBPF thấy PID toàn hệ thống của nhân; trong một PID namespace bạn thấy một con số khác.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Thời gian thật = trên CPU + ngoài CPU. Profiler CPU chỉ thấy phần đầu; hãy so thời gian CPU với thời gian thật trước khi tin nó.</li>
<li>Đo được: 1 621 ms thời gian thật, 0,39 lõi bận; hồ sơ CPU đổ cho <code>price_order</code> (96,7%) — đúng mà không liên quan.</li>
<li><code>offcputime</code>: 87,8% thời gian chờ là <code>futex</code> (một cái khoá), 12,2% là lần ngủ thật; <code>pmp.py</code> ghim nó vào <code>pthread_mutex_lock</code> trong <code>worker</code>.</li>
<li>Làm I/O ngoài khoá: 250 ms (6,5×); thời gian ngoài CPU thành 100% <code>nanosleep</code> — chờ song song thay vì xếp hàng.</li>
<li>Trong container, công cụ eBPF dùng PID của nhân; hãy đổi trước.</li>
</ul>
${L('https://www.brendangregg.com/offcpuanalysis.html', '📘', 'Off-CPU Analysis — Brendan Gregg', 'Phương pháp, offcputime, flame graph ngoài CPU và những điều cần dè chừng.', 'Mở')}
${L('https://github.com/iovisor/bcc/tree/master/libbpf-tools', '🐝', 'libbpf-tools (BCC)', 'offcputime, profile, runqlat… dưới dạng tệp nhị phân CO-RE nhỏ.', 'Mở')}
</div>
`,
};

/* ───────────────────────── 15.4 — profiler của từng ngôn ngữ ───────────────────────── */
const L154 = {
  title: '15.4 — Language profilers on one slow service: Node, Java, Python|||15.4 — Profiler của từng ngôn ngữ trên một dịch vụ chậm: Node, Java, Python',
  slug: 'os-15-7-profiler',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Cùng một API báo cáo đơn hàng chậm viết bằng Node, Java, Python; profiler của chính từng ngôn ngữ chỉ ra cùng một đường nóng (includes / ArrayList.indexOfRange / "x in list": 81–93%), kể cả khi JIT đã inline hàm; nhưng Java và Python còn một khoảng hở 40 ms mà không profiler CPU nào thấy (CPU 12,2 ms/request mà độ trễ 51,7 ms) — Nagle + ACK trễ của bài 11.3, kiểm bằng TCP_NODELAY; sửa O(n²) bằng Set rồi đo lại: Node 10,6 → 0,9 ms, Java 51,7 → 0,7 ms, Python 77 → 1,4 ms.',
  content: `${G154}
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.4</span>
<h2>Language profilers: the same slow service, three runtimes, one method</h2>
<p class="lead"><code>perf</code> works for everything, but it sees runtimes from the outside: interpreter loops, JIT stubs, built-ins. Every serious runtime ships its own profiler that knows function names, source lines and what the JIT did. The question of this lesson: <strong>given one slow endpoint written in Node, Java and Python, how does each runtime's profiler lead you to the hot path — and what do all of them miss?</strong> The answer to the second half turned out to be worth 40 ms per request.</p>

<h3>The service and the method</h3>
<p><code>orders.js</code>, <code>Orders.java</code> and <code>orders.py</code> are the same API: <code>GET /report</code> takes the first 4 000 orders, counts distinct customers, sums the totals and returns the top five as JSON. All three count distinct customers the slow way — a list and a linear search for every order (<code>includes</code>, <code>ArrayList.contains</code>, <code>x in list</code>): about 4 000 × 1 250 string comparisons per request, O(n²). The Node version (the other two are line-for-line the same in <code>lab/code/ch15</code>):</p>
${src('ch15/orders.js', 'javascript')}
<p>For each runtime: measure the baseline, profile under load, read the hot path, fix it (<code>FIX=1</code> switches to a <code>Set</code>/<code>HashSet</code>/<code>set</code>), measure again. Load: <code>tai.js</code> with one connection, back to back, 5 seconds, after a warm-up for the JVM. (This is a <em>closed</em> loop: fine for measuring service time, wrong for measuring user latency — lesson 15.6 explains the difference.)</p>

<h3>Node: --cpu-prof and --prof</h3>
${run('c154-prof', 'node tai.js http://127.0.0.1:8081/report')}
<p>Baseline: 93 requests/s, p50 10.6 ms — and since one Node process has one event loop, 10.6 ms of work per request is also why lesson 15.1's container saturated at about 99 requests/s. <code>node --cpu-prof</code> starts V8's sampling profiler and writes a <code>.cpuprofile</code> file when the process exits (exit cleanly: a process killed by a signal writes nothing, which is why <code>orders.js</code> handles <code>SIGINT</code>). The file opens in Chrome DevTools; <code>cpuprofile.js</code> summarises it as text:</p>
${run('c154-prof', 'node --cpu-prof', 2)}
${run('c154-prof', 'node cpuprofile.js')}
<p>The surprise: <code>uniqueCustomers</code> has only 0.7% self time, and <code>report</code> has 83.2%. TurboFan <strong>inlined</strong> <code>uniqueCustomers</code> into <code>report</code>, so its samples are booked to its caller — and <code>includes</code> is a V8 built-in, booked to whoever called it. The per-line ticks that V8 also records settle it: <strong>91.3% of the ticks are on line 24</strong>, <code>const customers = uniqueCustomers(list);</code>. <code>node --prof</code> (V8's tick log, processed with <code>--prof-process</code>) tells the same story from below:</p>
${run('c154-prof', 'node --prof-process')}
<p>94.1% of ticks are inside the <code>node</code> binary itself — the built-in <code>Array.prototype.includes</code>, as <code>perf</code> showed in lesson 15.2 — and 90.8% of those were called from <code>report</code>. Three tools, one answer. The fix is one line (<code>new Set(...)</code>):</p>
${run('c154-prof', 'node tai.js http://127.0.0.1:8084/report')}
<p>10.6 ms → <strong>0.9 ms</strong> at p50, 93 → 1 052 requests/s: <strong>11×</strong>.</p>
${lab('eventloop', 'block', 'en', 'Why 10 ms matters so much in Node: one slow callback holds the only JavaScript thread, and every other request — even /health — waits behind it.', { tour: 'eventloop-block' })}

<h3>Java: JFR and async-profiler — and a 40 ms gap</h3>
<p><strong>JFR</strong> (JDK Flight Recorder) is built into the JVM and cheap enough to leave on in production: start with <code>-XX:StartFlightRecording</code>, dump with <code>jcmd PID JFR.dump</code>, read with <code>jfr</code>. <strong>async-profiler</strong> attaches to a running JVM and samples with <code>perf_events</code> plus the JVM's own stack walker, so it sees Java frames, JIT-compiled code and native code together and avoids the "safepoint bias" of older Java profilers.</p>
${run('c154-prof', 'C0=$(cpu $J); node tai.js http://127.0.0.1:8085/report')}
${run('c154-prof', 'asprof -d 4')}
${run('c154-prof', 'jcmd $J JFR.dump')}
<p>Both agree: <code>ArrayList.indexOfRange</code> — the loop inside <code>contains</code> — is 81.1% (async-profiler) and 93.1% (JFR) of the CPU samples. But look at the baseline before fixing anything: p50 is <strong>51.7 ms</strong>, while the JVM used <strong>1 170 ms of CPU for 96 requests: 12.2 ms each</strong>. A CPU profiler can only explain those 12 ms. Some 40 ms per request are spent <em>not on any CPU</em> — the subject of lesson 15.3. The JDK's built-in HTTP server sends the response headers and the body in two separate writes; with Nagle's algorithm on, the second small write waits for the client's ACK, which the client delays by up to 40 ms (lesson 11.3, measured with <code>strace</code> there). That is a hypothesis; test it by changing one thing:</p>
${run('c154-prof', 'C0=$(cpu $J); node tai.js http://127.0.0.1:8086/report')}
<p>With <code>-Dsun.net.httpserver.nodelay=true</code> (TCP_NODELAY on every connection): p50 51.7 → <strong>10.1 ms</strong>, and now CPU per request (5 060 ms ÷ 493 = 10.3 ms) matches latency — nothing left off the CPU. Then the real fix:</p>
${run('c154-prof', 'node tai.js http://127.0.0.1:8087/report --closed 1 --duration 5')}
<p><strong>0.7 ms</strong> at p50, 1 354 requests/s. From 51.7 ms, two independent problems: one network option and one algorithm. The CPU profiler found only the second.</p>
${lab('nagle', 'nagle', 'en', 'The 40 ms the CPU profilers could not see: two small writes, Nagle holds the second one, the client delays its ACK.', { tour: 'nagle-delay' })}

<h3>Python: cProfile and py-spy</h3>
<p><strong>cProfile</strong> is in the standard library. It is <em>deterministic</em>: it hooks every function call and return, so it counts calls exactly but slows the program down — good for a batch job or a unit of work, not for production. <strong>py-spy</strong> is a <em>sampling</em> profiler written in Rust that reads the Python interpreter's memory from outside (<code>ptrace</code> permission needed), so it attaches to a running process without restarting or modifying it.</p>
${run('c154-prof', 'python3 -c "import cProfile')}
<p>30 reports took 1.118 s under cProfile; <code>unique_customers</code> alone has 1.020 s of <code>tottime</code> (time in the function itself) — 91%. Now the live service:</p>
${run('c154-prof', 'C0=$(cpu $P)')}
${run('c154-prof', 'py-spy dump')}
${run('c154-prof', 'py-spy record')}
<p><code>py-spy dump</code> is a live snapshot of every thread: the one holding the GIL is on line 14 of <code>unique_customers</code>. <code>py-spy record</code> samples for 4 s: 81.9% in <code>unique_customers</code>, and 15.7% in <code>readinto</code> — the handler thread waiting to read the next request on its keep-alive connection. And the same gap as Java: <strong>77 ms latency, 35.5 ms of CPU per request</strong> (2 340 ms ÷ 66). Python's <code>http.server</code> also writes headers and body separately:</p>
${run('c154-prof', 'NODELAY=1 python3 orders.py 8089', 2)}
${run('c154-prof', 'NODELAY=1 FIX=1', 2)}
<p>TCP_NODELAY: 77 → 35.3 ms (now equal to the CPU cost). The set: <strong>1.4 ms</strong>, 704 requests/s — 55× the original.</p>

<h3>Three runtimes, one table</h3>
<table>
<tr><th>p50 latency, 1 connection</th><th>baseline</th><th>CPU per request</th><th>+ TCP_NODELAY</th><th>+ Set (O(n))</th></tr>
<tr><td>Node (<code>http</code>, noDelay already on)</td><td>10.6 ms</td><td>—</td><td>—</td><td>0.9 ms</td></tr>
<tr><td>Java (JDK HttpServer, 4 threads)</td><td>51.7 ms</td><td>12.2 ms</td><td>10.1 ms</td><td>0.7 ms</td></tr>
<tr><td>Python (<code>ThreadingHTTPServer</code>)</td><td>77.0 ms</td><td>35.5 ms</td><td>35.3 ms</td><td>1.4 ms</td></tr>
</table>
<p>Two lessons sit in this table. First, every language profiler found the same hot path, each in its own words — so learn the profiler of <em>your</em> runtime, not only <code>perf</code>. Second, compare <strong>CPU per request with latency</strong> before trusting any CPU profile: in two of three runtimes, most of the latency was off-CPU and invisible to all five profilers.</p>

<div class="pitfall co-tieu-de">
<p><strong>"The profiler says <code>uniqueCustomers</code> is 0.7%, so it is not the problem."</strong> The JIT inlined it, and built-ins are charged to their caller. Look at the caller (<code>report</code>, 83.2%), at per-line ticks (line 24: 91.3%), or at the native view (<code>perf</code>: <code>Builtins_ArrayIncludesSmiOrObject</code>). A function's own row can be near zero while it is the whole problem.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>"We profiled, fixed the hot path, and Java is still at 10 ms — the JVM is slow."</strong> No: before the fix, 40 of the 52 ms were a TCP setting no CPU profiler can see. Always check that the time the profiler explains (CPU per request) adds up to the latency you measured.</p>
</div>

<h3>🧪 Practice (45 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a classmate's Spring-less Java API (JDK <code>HttpServer</code>) answers every request in "exactly about 45 ms", even trivial ones. Their profiler shows nothing hot.</p>
<ol>
<li>Start <code>Orders.java</code> in a <code>--privileged</code> lab container with JFR on, warm it up, and measure p50 with <code>tai.js --closed 1</code>. Read <code>/proc/PID/stat</code> before and after to compute CPU per request.</li>
<li>Profile with <code>asprof -d 4 -e cpu -o collapsed</code> and draw a flame graph. What fraction of the latency does it explain?</li>
<li>Add <code>-Dsun.net.httpserver.nodelay=true</code> and measure again; then add <code>FIX=1</code>.</li>
<li>Repeat steps 1–3 for <code>orders.py</code> with <code>py-spy record</code>, <code>NODELAY=1</code> and <code>FIX=1</code>.</li>
</ol>
<p><strong>Done when:</strong> your table has, for each runtime, latency and CPU per request before and after each change, and you can say for each change whether a CPU profiler could have found it.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['--cpu-prof / .cpuprofile', 'V8 sampling profiler of Node; writes a file Chrome DevTools opens (only on a clean exit).'],
  ['--prof / --prof-process', 'V8 tick log and its text report (bottom-up, top-down).'],
  ['JFR (JDK Flight Recorder)', 'Low-overhead event recorder built into the JVM; jcmd JFR.dump, jfr view hot-methods.'],
  ['async-profiler', 'Sampling profiler that attaches to a running JVM; Java + native frames, no safepoint bias.'],
  ['cProfile', 'Deterministic Python profiler: hooks every call, exact counts, noticeable overhead.'],
  ['py-spy', 'Sampling profiler that reads a running Python process from outside; dump, top, record.'],
  ['inlining', 'The JIT copies a small function into its caller; samples then show the caller, not the callee.'],
  ['TCP_NODELAY', 'Disables Nagle’s algorithm so small writes are sent immediately (lesson 11.3).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Same O(n²) hot path, three profilers per runtime: Node <code>report</code> 83.2% / line 24 91.3%; Java <code>indexOfRange</code> 81–93%; Python <code>unique_customers</code> 82–91%.</li>
<li>Inlining and built-ins hide the function that matters: read callers, per-line ticks, or the native view.</li>
<li>Java and Python had ~40 ms of off-CPU latency per request (Nagle + delayed ACK) that no CPU profiler showed; TCP_NODELAY removed it.</li>
<li>After both fixes: Node 10.6 → 0.9 ms, Java 51.7 → 0.7 ms, Python 77 → 1.4 ms (p50, one connection).</li>
<li>Always check that CPU per request ≈ latency before you trust a CPU profile.</li>
</ul>
${L('https://nodejs.org/en/learn/getting-started/profiling', '🟢', 'Profiling Node.js applications', '--prof, --prof-process, and the V8 tick processor.', 'Open')}
${L('https://github.com/async-profiler/async-profiler', '☕', 'async-profiler', 'CPU, wall-clock, allocation and lock profiling for the JVM; flame graphs.', 'Open')}
${L('https://github.com/benfred/py-spy', '🐍', 'py-spy', 'Sampling profiler for Python: dump, top, record — no restart needed.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.4</span>
<h2>Profiler của từng ngôn ngữ: cùng một dịch vụ chậm, ba runtime, một phương pháp</h2>
<p class="lead"><code>perf</code> dùng được cho mọi thứ, nhưng nó nhìn runtime từ bên ngoài: vòng lặp thông dịch, đoạn mã JIT, hàm dựng sẵn. Runtime nghiêm túc nào cũng kèm profiler riêng, biết tên hàm, dòng mã nguồn và JIT đã làm gì. Câu hỏi của bài: <strong>với một endpoint chậm viết bằng Node, Java và Python, profiler của từng runtime dẫn bạn tới đường nóng ra sao — và tất cả chúng cùng bỏ sót điều gì?</strong> Câu trả lời cho nửa sau hoá ra đáng giá 40 ms mỗi request.</p>

<h3>Dịch vụ và phương pháp</h3>
<p><code>orders.js</code>, <code>Orders.java</code> và <code>orders.py</code> là cùng một API: <code>GET /report</code> lấy 4 000 đơn đầu, đếm số khách hàng khác nhau, cộng tổng tiền và trả 5 khách mua nhiều nhất dưới dạng JSON. Cả ba đếm khách hàng khác nhau theo cách chậm — một danh sách và một lần tìm tuyến tính cho mỗi đơn (<code>includes</code>, <code>ArrayList.contains</code>, <code>x in list</code>): khoảng 4 000 × 1 250 lần so chuỗi mỗi request, O(n²). Bản Node (hai bản kia giống từng dòng, nằm trong <code>lab/code/ch15</code>):</p>
${src('ch15/orders.js', 'javascript')}
<p>Với mỗi runtime: đo mốc ban đầu, đo hồ sơ khi có tải, đọc đường nóng, sửa (<code>FIX=1</code> chuyển sang <code>Set</code>/<code>HashSet</code>/<code>set</code>), đo lại. Tải: <code>tai.js</code> với một kết nối, gửi nối tiếp, 5 giây, sau khi đã làm nóng JVM. (Đây là vòng <em>kín</em>: ổn để đo thời gian phục vụ, sai để đo độ trễ người dùng — bài 15.6 giải thích khác biệt.)</p>

<h3>Node: --cpu-prof và --prof</h3>
${run('c154-prof', 'node tai.js http://127.0.0.1:8081/report')}
<p>Mốc ban đầu: 93 request/giây, p50 10,6 ms — và vì một tiến trình Node chỉ có một event loop, 10,6 ms việc mỗi request cũng chính là lý do container của bài 15.1 bão hoà ở khoảng 99 request/giây. <code>node --cpu-prof</code> bật profiler lấy mẫu của V8 và ghi tệp <code>.cpuprofile</code> khi tiến trình thoát (phải thoát êm: tiến trình bị tín hiệu giết thì không ghi gì, vì thế <code>orders.js</code> có xử lý <code>SIGINT</code>). Tệp mở được trong Chrome DevTools; <code>cpuprofile.js</code> tóm tắt nó thành chữ:</p>
${run('c154-prof', 'node --cpu-prof', 2)}
${run('c154-prof', 'node cpuprofile.js')}
<p>Điều bất ngờ: <code>uniqueCustomers</code> chỉ có 0,7% thời gian self, còn <code>report</code> có 83,2%. TurboFan đã <strong>inline</strong> <code>uniqueCustomers</code> vào <code>report</code>, nên mẫu của nó bị ghi cho hàm gọi — và <code>includes</code> là hàm dựng sẵn của V8, cũng bị ghi cho ai gọi nó. Số nhịp theo từng dòng mà V8 cũng ghi lại chốt câu chuyện: <strong>91,3% số nhịp nằm ở dòng 24</strong>, <code>const customers = uniqueCustomers(list);</code>. <code>node --prof</code> (nhật ký nhịp của V8, xử lý bằng <code>--prof-process</code>) kể cùng câu chuyện từ phía dưới lên:</p>
${run('c154-prof', 'node --prof-process')}
<p>94,1% số nhịp nằm trong chính tệp nhị phân <code>node</code> — hàm dựng sẵn <code>Array.prototype.includes</code>, như <code>perf</code> đã cho thấy ở bài 15.2 — và 90,8% trong số đó được gọi từ <code>report</code>. Ba công cụ, một câu trả lời. Bản sửa chỉ một dòng (<code>new Set(...)</code>):</p>
${run('c154-prof', 'node tai.js http://127.0.0.1:8084/report')}
<p>10,6 ms → <strong>0,9 ms</strong> ở p50, 93 → 1 052 request/giây: <strong>11 lần</strong>.</p>
${lab('eventloop', 'block', 'vi', 'Vì sao 10 ms lại quan trọng tới vậy ở Node: một callback chậm chiếm luồng JavaScript duy nhất, và mọi request khác — kể cả /health — phải chờ sau nó.', { tour: 'eventloop-block' })}

<h3>Java: JFR và async-profiler — và một khoảng hở 40 ms</h3>
<p><strong>JFR</strong> (JDK Flight Recorder) có sẵn trong JVM và đủ rẻ để bật thường trực trên production: bật bằng <code>-XX:StartFlightRecording</code>, xuất bằng <code>jcmd PID JFR.dump</code>, đọc bằng <code>jfr</code>. <strong>async-profiler</strong> gắn vào một JVM đang chạy và lấy mẫu bằng <code>perf_events</code> cộng bộ đi ngăn xếp của chính JVM, nên thấy cùng lúc khung Java, mã đã JIT và mã native, và tránh được "thiên lệch safepoint" của các profiler Java đời cũ.</p>
${run('c154-prof', 'C0=$(cpu $J); node tai.js http://127.0.0.1:8085/report')}
${run('c154-prof', 'asprof -d 4')}
${run('c154-prof', 'jcmd $J JFR.dump')}
<p>Cả hai đồng ý: <code>ArrayList.indexOfRange</code> — vòng lặp bên trong <code>contains</code> — chiếm 81,1% (async-profiler) và 93,1% (JFR) số mẫu CPU. Nhưng hãy nhìn mốc ban đầu trước khi sửa gì: p50 là <strong>51,7 ms</strong>, trong khi JVM dùng <strong>1 170 ms CPU cho 96 request: 12,2 ms mỗi cái</strong>. Profiler CPU chỉ giải thích được 12 ms đó. Khoảng 40 ms mỗi request được tiêu <em>không trên CPU nào cả</em> — chủ đề của bài 15.3. HTTP server có sẵn của JDK gửi header và thân trả lời bằng hai lần ghi riêng; khi bật thuật toán Nagle, lần ghi nhỏ thứ hai phải chờ ACK của khách, mà khách thì hoãn ACK tới 40 ms (bài 11.3, ở đó đo bằng <code>strace</code>). Đó là một giả thuyết; kiểm nó bằng cách đổi đúng một thứ:</p>
${run('c154-prof', 'C0=$(cpu $J); node tai.js http://127.0.0.1:8086/report')}
<p>Với <code>-Dsun.net.httpserver.nodelay=true</code> (TCP_NODELAY trên mọi kết nối): p50 51,7 → <strong>10,1 ms</strong>, và giờ CPU mỗi request (5 060 ms ÷ 493 = 10,3 ms) khớp với độ trễ — không còn gì nằm ngoài CPU. Rồi tới bản sửa thật:</p>
${run('c154-prof', 'node tai.js http://127.0.0.1:8087/report --closed 1 --duration 5')}
<p><strong>0,7 ms</strong> ở p50, 1 354 request/giây. Từ 51,7 ms là hai vấn đề độc lập: một tuỳ chọn mạng và một thuật toán. Profiler CPU chỉ tìm ra cái thứ hai.</p>
${lab('nagle', 'nagle', 'vi', '40 ms mà các profiler CPU không thấy được: hai lần ghi nhỏ, Nagle giữ lần thứ hai, khách hoãn ACK.', { tour: 'nagle-delay' })}

<h3>Python: cProfile và py-spy</h3>
<p><strong>cProfile</strong> có trong thư viện chuẩn. Nó <em>tất định</em>: móc vào mọi lần gọi và trả về của hàm, nên đếm số lần gọi chính xác nhưng làm chương trình chậm đi — hợp cho một job xử lý theo lô hay một đơn vị công việc, không hợp cho production. <strong>py-spy</strong> là profiler <em>lấy mẫu</em> viết bằng Rust, đọc bộ nhớ của trình thông dịch Python từ bên ngoài (cần quyền <code>ptrace</code>), nên gắn được vào một tiến trình đang chạy mà không phải khởi động lại hay sửa nó.</p>
${run('c154-prof', 'python3 -c "import cProfile')}
<p>30 báo cáo mất 1,118 s dưới cProfile; riêng <code>unique_customers</code> có 1,020 s <code>tottime</code> (thời gian trong chính hàm) — 91%. Giờ tới dịch vụ đang chạy:</p>
${run('c154-prof', 'C0=$(cpu $P)')}
${run('c154-prof', 'py-spy dump')}
${run('c154-prof', 'py-spy record')}
<p><code>py-spy dump</code> là một ảnh chụp sống của mọi luồng: luồng đang giữ GIL nằm ở dòng 14 của <code>unique_customers</code>. <code>py-spy record</code> lấy mẫu trong 4 s: 81,9% ở <code>unique_customers</code>, và 15,7% ở <code>readinto</code> — luồng xử lý đang chờ đọc request tiếp theo trên kết nối keep-alive. Và cùng khoảng hở như Java: <strong>độ trễ 77 ms, CPU 35,5 ms mỗi request</strong> (2 340 ms ÷ 66). <code>http.server</code> của Python cũng ghi header và thân riêng nhau:</p>
${run('c154-prof', 'NODELAY=1 python3 orders.py 8089', 2)}
${run('c154-prof', 'NODELAY=1 FIX=1', 2)}
<p>TCP_NODELAY: 77 → 35,3 ms (giờ bằng đúng chi phí CPU). Dùng set: <strong>1,4 ms</strong>, 704 request/giây — gấp 55 lần bản gốc.</p>

<h3>Ba runtime, một bảng</h3>
<table>
<tr><th>Độ trễ p50, 1 kết nối</th><th>ban đầu</th><th>CPU mỗi request</th><th>+ TCP_NODELAY</th><th>+ Set (O(n))</th></tr>
<tr><td>Node (<code>http</code>, noDelay đã bật sẵn)</td><td>10,6 ms</td><td>—</td><td>—</td><td>0,9 ms</td></tr>
<tr><td>Java (JDK HttpServer, 4 luồng)</td><td>51,7 ms</td><td>12,2 ms</td><td>10,1 ms</td><td>0,7 ms</td></tr>
<tr><td>Python (<code>ThreadingHTTPServer</code>)</td><td>77,0 ms</td><td>35,5 ms</td><td>35,3 ms</td><td>1,4 ms</td></tr>
</table>
<p>Bảng này chứa hai bài học. Một, profiler của ngôn ngữ nào cũng tìm ra cùng một đường nóng, mỗi cái nói theo cách riêng — nên hãy học profiler của <em>runtime của bạn</em>, không chỉ <code>perf</code>. Hai, hãy so <strong>CPU mỗi request với độ trễ</strong> trước khi tin bất kỳ hồ sơ CPU nào: ở hai trên ba runtime, phần lớn độ trễ nằm ngoài CPU và vô hình với cả năm profiler.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Profiler nói <code>uniqueCustomers</code> chỉ 0,7%, vậy nó không phải vấn đề."</strong> JIT đã inline nó, và hàm dựng sẵn bị tính cho hàm gọi. Hãy nhìn hàm gọi (<code>report</code>, 83,2%), nhìn số nhịp theo dòng (dòng 24: 91,3%), hoặc nhìn góc native (<code>perf</code>: <code>Builtins_ArrayIncludesSmiOrObject</code>). Dòng riêng của một hàm có thể gần bằng không trong khi nó là toàn bộ vấn đề.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>"Đã đo hồ sơ, đã sửa đường nóng, Java vẫn 10 ms — JVM chậm."</strong> Không: trước khi sửa, 40 trong 52 ms là một thiết lập TCP mà không profiler CPU nào nhìn thấy. Luôn kiểm phần thời gian profiler giải thích được (CPU mỗi request) có cộng đủ thành độ trễ bạn đo hay không.</p>
</div>

<h3>🧪 Thực hành (45 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> API Java không dùng Spring (JDK <code>HttpServer</code>) của một bạn cùng lớp trả lời mọi request trong "đúng khoảng 45 ms", kể cả request tầm thường. Profiler của bạn ấy không thấy gì nóng.</p>
<ol>
<li>Chạy <code>Orders.java</code> trong một container lab <code>--privileged</code> có bật JFR, làm nóng, rồi đo p50 bằng <code>tai.js --closed 1</code>. Đọc <code>/proc/PID/stat</code> trước và sau để tính CPU mỗi request.</li>
<li>Đo hồ sơ bằng <code>asprof -d 4 -e cpu -o collapsed</code> và vẽ flame graph. Nó giải thích được bao nhiêu phần độ trễ?</li>
<li>Thêm <code>-Dsun.net.httpserver.nodelay=true</code> và đo lại; rồi thêm <code>FIX=1</code>.</li>
<li>Lặp bước 1–3 cho <code>orders.py</code> với <code>py-spy record</code>, <code>NODELAY=1</code> và <code>FIX=1</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bảng của bạn có, với mỗi runtime, độ trễ và CPU mỗi request trước và sau từng thay đổi, và bạn nói được với mỗi thay đổi rằng profiler CPU có thể tìm ra nó hay không.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['--cpu-prof / .cpuprofile', 'Profiler lấy mẫu của V8 trong Node; ghi tệp mà Chrome DevTools mở được (chỉ khi thoát êm).'],
  ['--prof / --prof-process', 'Nhật ký nhịp của V8 và báo cáo chữ của nó (từ dưới lên, từ trên xuống).'],
  ['JFR (JDK Flight Recorder)', 'Bộ ghi sự kiện chi phí thấp có sẵn trong JVM; jcmd JFR.dump, jfr view hot-methods.'],
  ['async-profiler', 'Profiler lấy mẫu gắn vào JVM đang chạy; thấy cả khung Java lẫn native, không thiên lệch safepoint.'],
  ['cProfile', 'Profiler tất định của Python: móc mọi lời gọi, đếm chính xác, tốn chi phí đáng kể.'],
  ['py-spy', 'Profiler lấy mẫu đọc một tiến trình Python đang chạy từ bên ngoài; dump, top, record.'],
  ['inlining (nội tuyến hoá)', 'JIT chép một hàm nhỏ vào hàm gọi nó; mẫu khi đó hiện hàm gọi chứ không hiện hàm được gọi.'],
  ['TCP_NODELAY', 'Tắt thuật toán Nagle để những lần ghi nhỏ được gửi ngay (bài 11.3).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cùng một đường nóng O(n²), ba profiler cho mỗi runtime: Node <code>report</code> 83,2% / dòng 24 91,3%; Java <code>indexOfRange</code> 81–93%; Python <code>unique_customers</code> 82–91%.</li>
<li>Inline và hàm dựng sẵn che mất hàm quan trọng: hãy đọc hàm gọi, số nhịp theo dòng, hoặc góc native.</li>
<li>Java và Python có ~40 ms độ trễ ngoài CPU mỗi request (Nagle + ACK trễ) mà không profiler CPU nào cho thấy; TCP_NODELAY xoá nó.</li>
<li>Sau cả hai bản sửa: Node 10,6 → 0,9 ms, Java 51,7 → 0,7 ms, Python 77 → 1,4 ms (p50, một kết nối).</li>
<li>Luôn kiểm CPU mỗi request ≈ độ trễ trước khi tin một hồ sơ CPU.</li>
</ul>
${L('https://nodejs.org/en/learn/getting-started/profiling', '🟢', 'Đo hồ sơ ứng dụng Node.js', '--prof, --prof-process và bộ xử lý nhịp của V8.', 'Mở')}
${L('https://github.com/async-profiler/async-profiler', '☕', 'async-profiler', 'Đo hồ sơ CPU, thời gian thật, cấp phát và khoá cho JVM; flame graph.', 'Mở')}
${L('https://github.com/benfred/py-spy', '🐍', 'py-spy', 'Profiler lấy mẫu cho Python: dump, top, record — không cần khởi động lại.', 'Mở')}
</div>
`,
};

/* ───────────────────────── 15.5 — eBPF ───────────────────────── */
const L155 = {
  title: '15.5 — eBPF in practice: bpftrace one-liners and BCC-style tools|||15.5 — eBPF thực chiến: bpftrace một dòng và công cụ kiểu BCC',
  slug: 'os-15-2-ebpf',
  type: 'LESSON',
  isFreePreview: true,
  description: 'eBPF là gì (chương trình nhỏ được kiểm chứng, gắn vào sự kiện của nhân, gom số liệu ngay trong nhân; BTF + CO-RE) và chạy được tới đâu trong máy ảo Docker Desktop: bpftrace 0.25 và libbpf-tools 0.35 chạy thật trong container --privileged, lọc về đúng cgroup của mình; bốn câu bpftrace một dòng (syscall theo tiến trình, cỡ read(), độ trễ fsync 0,25–0,5 ms vs khối I/O 16–32 µs); execsnoop bắt 80 tiến trình ngắn trong 2 s mà top không thấy, opensnoop chỉ ra tệp cấu hình bị tìm sai tên, biolatency -c lặng lẽ không in gì, runqlat 2 vs 8 luồng trên 2 lõi, tcplife 200 vs 4 kết nối.',
  content: `${G155}
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.5</span>
<h2>eBPF in practice: ask the kernel your question directly</h2>
<p class="lead">Some questions have no answer in <code>top</code> or in your logs: <em>which programs start and die every second? Which file did the service try to open? How long does an fsync really take? How long do threads wait for a CPU? How many connections are we opening?</em> The kernel sees all of it. eBPF lets you run a small, safe program inside the kernel at exactly the event you care about and bring back only the answer. The question of this lesson: <strong>what can eBPF answer on a real box today, how do you use the ready-made tools and one-line bpftrace programs, and what goes wrong — inside containers in particular?</strong> Lesson 11.6 gave a first look; here we use it as a daily tool.</p>

<h3>What eBPF is, in one paragraph</h3>
<p>An eBPF program is a small piece of bytecode that you load into the kernel and attach to an event: a tracepoint (a stable hook such as <code>sched:sched_switch</code> or <code>syscalls:sys_enter_openat</code>), a kprobe (any kernel function), a uprobe (a function in a user program) or a timer. Before it runs, the kernel's <strong>verifier</strong> proves it cannot crash or loop forever; then it is JIT-compiled. It aggregates into <strong>maps</strong> (counters, histograms) inside the kernel, so only a summary crosses into user space — which is why it is cheap enough for production. <strong>BTF</strong> (type information of the running kernel, <code>/sys/kernel/btf/vmlinux</code>) lets one compiled tool work on many kernel versions (<strong>CO-RE</strong>: compile once, run everywhere). Two families of tools sit on top: <strong>bpftrace</strong>, a one-line scripting language, and the <strong>BCC tools</strong> (here the libbpf-tools build: <code>execsnoop</code>, <code>opensnoop</code>, <code>biolatency</code>, <code>runqlat</code>, <code>tcplife</code>, <code>offcputime</code>…).</p>
<p>What runs in our lab: the Docker Desktop VM's Linux 7.0 kernel has BTF, tracepoints and kprobes, and Ubuntu 26.04's bpftrace 0.25 and libbpf-tools 0.35 work in a <code>--privileged</code> container (loading BPF programs needs <code>CAP_BPF</code> + <code>CAP_PERFMON</code>, i.e. root on a real host). Everything below ran for real. Two cautions that come with the power: eBPF sees the <strong>whole machine</strong> — every container on this VM, including other people's — so every command below is filtered to our own cgroup, process name or port; and its PIDs are the kernel's, not the container's (lesson 15.3).</p>
${run('c155-ebpf', 'bpftrace --version')}

<h3>bpftrace: four one-liners</h3>
<p>A bpftrace program is <code>probe /filter/ { action }</code>. <code>@name[key] = count()</code> keeps a counter per key in a map; <code>hist()</code> builds a power-of-two histogram; <code>interval:s:2 { exit(); }</code> stops after two seconds and prints the maps. <code>cgroup == cgroupid("/sys/fs/cgroup")</code> keeps only events from our container. With the fixed <code>orders.js</code> under load from <code>hey</code>:</p>
${run('c155-ebpf', "bpftrace -q -e 'tracepoint:raw_syscalls:sys_enter")}
<p><strong>Who makes system calls?</strong> In two seconds the load generator made 33 273 and the server 10 402 — about ten per request, the cost of a request in kernel crossings (lesson 11.4). Same events, another question — <strong>how big are the reads?</strong></p>
${run('c155-ebpf', "bpftrace -q -e 'tracepoint:syscalls:sys_exit_read")}
<p>1 209 reads of 64–127 bytes: one HTTP request each. 134 reads of 8–15 bytes are not HTTP at all: an <code>eventfd</code> counter is exactly 8 bytes, and libuv uses one to wake its loop — a likely explanation that one more one-liner printing the file type would confirm. Two reads returned 0: a client closed its connection. Next, <strong>how long does an fsync take?</strong> A kprobe on <code>vfs_fsync_range</code> and its return (kretprobe), timing each call per thread, while <code>dd</code> writes with <code>oflag=dsync</code>:</p>
${run('c155-ebpf', "bpftrace -q -e 'kprobe:vfs_fsync_range")}
<p>Most syncs take 256–512 µs, with a tail out to 16–64 ms. Compare with the time of the individual block requests — the classic <code>biolatency</code>. First the ready-made tool, filtered to our cgroup:</p>
${run('c155-ebpf', 'biolatency-libbpf -c /sys/fs/cgroup')}
<p>Nothing — only the header. The cgroup filter silently matched no I/O. (Our guess: block I/O is usually completed in interrupt context, where the "current cgroup" is not ours; we did not dig further.) So we write our own biolatency in one line: remember the issue time of each request from our cgroup by device and sector, and histogram the difference at completion:</p>
${run('c155-ebpf', "bpftrace -q -e 'tracepoint:block:block_rq_issue")}
<p>The device answers in <strong>16–32 µs</strong> (the VM's disk is a file on the Mac's SSD), yet an fsync takes 10–20× longer: it waits for the data write, the ext4 journal commit and a cache flush — several requests in sequence, not one (lesson 9.4). That is the difference between "the disk is fast" and "durable writes are slow", and it is the theme of lesson 15.8.</p>

<h3>execsnoop: the processes top never shows</h3>
<p>A "health check" script runs every 0.1 s and starts <code>cat</code>, <code>awk</code>, <code>curl</code>, <code>date</code> and <code>sleep</code> each time. They live for a few milliseconds:</p>
${src('ch15/healthcheck.sh', 'bash')}
${run('c155-ebpf', 'top -bn1')}
${run('c155-ebpf', 'execsnoop-libbpf -c /sys/fs/cgroup', 2)}
${run('c155-ebpf', "awk 'NR > 1")}
<p><code>top</code> sees the script at 9.1% and none of its children. <code>execsnoop</code> hooks every <code>execve</code> and sees <strong>80 processes in 2 seconds</strong> — 40 fork+exec per second, each paying for a new address space, dynamic linking and page faults. This is the classic cause of "the CPU is busy but no process is": shell scripts in a loop, a health check that forks <code>curl</code>, a log shipper that runs a command per line. (Note the PIDs: 76427 and up are the kernel's numbers, not the container's.)</p>
${lab('sysmon', 'forkbomb', 'en', 'The extreme version of many short-lived processes: watch the process count and the load, then find who keeps forking.', { tour: 'sysmon-start' })}

<h3>opensnoop: which file did it try to open?</h3>
<p>The team says <em>"we put the config in <code>./config.yaml</code> but the service ignores it"</em>. The service only prints that it uses defaults:</p>
${run('c155-ebpf', './cfgload')}
${run('c155-ebpf', 'opensnoop-libbpf -x -n cfgload')}
<p><code>-x</code> shows only failed opens; <code>ERR 2</code> is <code>ENOENT</code>. The program looks in three places, and the last one is <code>./config.<strong>yml</strong></code> — not <code>.yaml</code>. Without eBPF you would use <code>strace -e openat</code> (lesson 11.3), which also works but stops the process at every system call; <code>opensnoop</code> watches every process on the machine at almost no cost.</p>

<h3>runqlat: how long threads wait for a CPU</h3>
<p>USE asks for the <em>saturation</em> of the CPU: work waiting to run. <code>runqlat</code> measures it directly — the time from "runnable" to "running" for every wake-up. Two CPU-bound threads pinned to two cores, then eight:</p>
${run('c155-ebpf', 'taskset -c 0,1 stress-ng --cpu 2')}
${run('c155-ebpf', 'taskset -c 0,1 stress-ng --cpu 8')}
<p>With two threads on two cores, every one of the 34 wake-ups got a CPU within a millisecond. With eight, the histogram grows a second hump at <strong>8–15 ms</strong> (989 wake-ups) and some at 16–31 ms: each thread waits for its turn behind three others. That waiting is invisible in "CPU %" (both runs show 100%) and visible in the latency of every request such a machine serves.</p>
${lab('scheduler', 'multicore', 'en', 'Six threads on two cores: follow one thread and count the ticks it spends ready but not running — that is what runqlat measures.', { tour: 'scheduler-start' })}

<h3>tcplife: who opens which connections, and for how long</h3>
<p>The same 200 requests, without and with keep-alive:</p>
${run('c155-ebpf', 'tcplife-libbpf -L 8080 > life1.txt')}
${run('c155-ebpf', 'head -4 life1.txt')}
${run('c155-ebpf', 'tcplife-libbpf -L 8080 > life2.txt')}
${run('c155-ebpf', 'cat life2.txt')}
<p>Without keep-alive: <strong>200 connections</strong> of 1–4 ms, one per request. With keep-alive: <strong>4 connections</strong> (one per client worker) of ~310 ms carrying 21 KB each. On loopback a new connection costs little, so throughput was similar (810 vs 646 requests/s — within the noise of this shared machine); across a real network each new connection adds a round trip, a TLS handshake adds more, and thousands of short connections leave thousands of sockets in <code>TIME_WAIT</code> (lesson 2.5). The <code>PID/COMM</code> column is the process that was running when the socket changed state — a hint, not proof.</p>

<h3>Which tool answers which USE question</h3>
<table>
<tr><th>Resource</th><th>Utilization</th><th>Saturation</th><th>Errors</th></tr>
<tr><td>CPU</td><td><code>profile</code>, <code>execsnoop</code> (short-lived processes)</td><td><code>runqlat</code>, <code>runqlen</code></td><td>—</td></tr>
<tr><td>Disk</td><td><code>biolatency</code> / block tracepoints</td><td>queue time (<code>biolatency -Q</code>), <code>offcputime</code> in <code>io_schedule</code></td><td>block errors</td></tr>
<tr><td>Network</td><td><code>tcplife</code>, <code>tcptop</code></td><td><code>tcpsynbl</code> (SYN backlog)</td><td><code>tcpretrans</code>-style tracing</td></tr>
<tr><td>Files</td><td><code>opensnoop</code></td><td>—</td><td><code>opensnoop -x</code></td></tr>
<tr><td>Locks / waiting</td><td>—</td><td><code>offcputime</code> (lesson 15.3)</td><td>—</td></tr>
</table>
<p>The tools in the table that this lesson did not run (<code>runqlen</code>, <code>tcptop</code>, <code>tcpsynbl</code>) ship in the same libbpf-tools package; their row is from the documentation, not measured here.</p>

<div class="pitfall co-tieu-de">
<p><strong>"biolatency printed nothing, so our container does no disk I/O."</strong> Measured: <code>dd</code> wrote 1 500 synchronous blocks while <code>biolatency -c</code> printed an empty histogram. A tool can silently filter everything away. Always run it once against a workload you <em>know</em> produces events (here, <code>dd oflag=dsync</code>) before you trust a zero.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>"eBPF is free, so let's trace every system call in production all day."</strong> Each event still runs a program: lesson 11.6 measured 1 000 HTTP requests slowing from 0.129 s to 0.177 s while bpftrace counted every syscall of the server. Trace for seconds, aggregate in the kernel (count/hist, not printf per event), and filter as early as possible.</p>
</div>

<h3>🧪 Practice (40 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> the CPU of your VPS sits at 30% "system" even at night, <code>top</code> shows nothing above 2%, and the disk graph shows short bursts every few seconds.</p>
<ol>
<li>In a <code>--privileged</code> lab container with the debs of <code>c155-ebpf.sh</code>, start <code>./healthcheck.sh</code> and find its children with <code>execsnoop-libbpf -c /sys/fs/cgroup</code>. How many processes per second?</li>
<li>Write a bpftrace one-liner that counts <code>execve</code> per parent process name (hint: <code>tracepoint:sched:sched_process_exec</code>, <code>curtask-&gt;real_parent-&gt;comm</code>).</li>
<li>Run <code>dd if=/dev/zero of=/var/tmp/x bs=4k count=1000 oflag=dsync</code> and measure fsync latency and block latency with the two one-liners of this lesson. Explain the factor between them.</li>
<li>Show that <code>runqlat</code> changes when you go from 2 to 8 busy threads on 2 cores, while <code>top</code> shows 100% in both cases.</li>
</ol>
<p><strong>Done when:</strong> you have, from your own runs, a number for each question — processes started per second, fsync vs block latency, run-queue latency with 2 and 8 threads — and one sentence per tool on why <code>top</code> could not have told you.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['eBPF', 'Small verified programs run inside the kernel at chosen events; results aggregated in maps.'],
  ['verifier', 'The kernel check that proves an eBPF program is safe (bounded, valid memory) before it runs.'],
  ['tracepoint / kprobe / uprobe', 'Stable kernel hook / any kernel function / a function in a user-space program.'],
  ['map', 'Kernel-side key-value storage (counters, histograms) that eBPF programs fill and tools read.'],
  ['BTF / CO-RE', 'Type information of the running kernel; lets one compiled tool run on many kernel versions.'],
  ['bpftrace', 'One-line tracing language: probe /filter/ { action }.'],
  ['run-queue latency', 'Time a thread spends runnable but not running — CPU saturation (runqlat).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>eBPF runs verified programs at kernel events and aggregates in the kernel; bpftrace 0.25 and libbpf-tools 0.35 ran for real in a <code>--privileged</code> container on the Docker Desktop VM.</li>
<li>It sees the whole machine: filter by cgroup, name or port; its PIDs are the kernel's.</li>
<li>Measured: fsync 0.25–0.5 ms vs block I/O 16–32 µs; 80 hidden processes in 2 s; a config looked up as <code>.yml</code>; run-queue waits of 8–15 ms with 8 threads on 2 cores; 200 vs 4 connections.</li>
<li>A tool that prints nothing may be filtering wrongly — test it on a known workload (<code>biolatency -c</code> did).</li>
<li>Map tools to USE: runqlat = CPU saturation, biolatency = disk, tcplife = connections, opensnoop -x = errors, offcputime = waiting.</li>
</ul>
${L('https://ebpf.io/what-is-ebpf/', '🐝', 'What is eBPF? — ebpf.io', 'Verifier, JIT, maps, hooks and helpers explained.', 'Open')}
${L('https://github.com/bpftrace/bpftrace', '🔎', 'bpftrace', 'The language, one-liner tutorial and reference guide.', 'Open')}
${L('https://www.brendangregg.com/ebpf.html', '📘', 'Linux eBPF Tracing Tools — Brendan Gregg', 'The tool map: which tool for which part of the system.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.5</span>
<h2>eBPF thực chiến: hỏi thẳng nhân câu hỏi của bạn</h2>
<p class="lead">Có những câu hỏi mà <code>top</code> hay log không trả lời được: <em>chương trình nào sinh ra rồi chết đi mỗi giây? Dịch vụ đã thử mở tệp nào? Một lần fsync thật sự mất bao lâu? Luồng phải chờ CPU bao lâu? Ta đang mở bao nhiêu kết nối?</em> Nhân thấy hết. eBPF cho bạn chạy một chương trình nhỏ, an toàn, bên trong nhân, đúng ở sự kiện bạn quan tâm, và chỉ mang về câu trả lời. Câu hỏi của bài: <strong>eBPF trả lời được gì trên một máy thật hôm nay, dùng công cụ dựng sẵn và chương trình bpftrace một dòng ra sao, và cái gì có thể hỏng — nhất là trong container?</strong> Bài 11.6 đã cho xem trước; ở đây ta dùng nó như công cụ hằng ngày.</p>

<h3>eBPF là gì, trong một đoạn</h3>
<p>Một chương trình eBPF là một đoạn bytecode nhỏ bạn nạp vào nhân và gắn vào một sự kiện: một tracepoint (móc ổn định như <code>sched:sched_switch</code> hay <code>syscalls:sys_enter_openat</code>), một kprobe (bất kỳ hàm nào của nhân), một uprobe (một hàm trong chương trình người dùng) hay một bộ đếm giờ. Trước khi chạy, <strong>verifier</strong> (bộ kiểm chứng) của nhân chứng minh nó không thể làm sập máy hay lặp vô tận; sau đó nó được biên dịch JIT. Nó gom số liệu vào các <strong>map</strong> (bộ đếm, histogram) ngay trong nhân, nên chỉ có bản tóm tắt đi ra không gian người dùng — vì thế nó đủ rẻ để dùng trên production. <strong>BTF</strong> (thông tin kiểu của nhân đang chạy, <code>/sys/kernel/btf/vmlinux</code>) cho phép một công cụ biên dịch một lần chạy được trên nhiều phiên bản nhân (<strong>CO-RE</strong>: compile once, run everywhere). Hai họ công cụ dựng trên đó: <strong>bpftrace</strong>, một ngôn ngữ kịch bản một dòng, và <strong>bộ công cụ BCC</strong> (ở đây là bản libbpf-tools: <code>execsnoop</code>, <code>opensnoop</code>, <code>biolatency</code>, <code>runqlat</code>, <code>tcplife</code>, <code>offcputime</code>…).</p>
<p>Những gì chạy được trong lab của ta: nhân Linux 7.0 của máy ảo Docker Desktop có BTF, tracepoint và kprobe, và bpftrace 0.25 cùng libbpf-tools 0.35 của Ubuntu 26.04 chạy được trong container <code>--privileged</code> (nạp chương trình BPF cần <code>CAP_BPF</code> + <code>CAP_PERFMON</code>, tức là root trên máy thật). Mọi thứ bên dưới đều chạy thật. Hai điều cần dè chừng đi kèm sức mạnh đó: eBPF thấy <strong>cả máy</strong> — mọi container trên máy ảo này, kể cả của người khác — nên mọi lệnh bên dưới đều lọc về cgroup, tên tiến trình hoặc cổng của chính ta; và PID của nó là PID của nhân, không phải của container (bài 15.3).</p>
${run('c155-ebpf', 'bpftrace --version')}

<h3>bpftrace: bốn câu một dòng</h3>
<p>Một chương trình bpftrace có dạng <code>probe /bộ lọc/ { hành động }</code>. <code>@tên[khoá] = count()</code> giữ một bộ đếm cho mỗi khoá trong map; <code>hist()</code> dựng histogram theo luỹ thừa 2; <code>interval:s:2 { exit(); }</code> dừng sau hai giây và in các map ra. <code>cgroup == cgroupid("/sys/fs/cgroup")</code> chỉ giữ sự kiện của container ta. Với <code>orders.js</code> đã sửa đang chịu tải từ <code>hey</code>:</p>
${run('c155-ebpf', "bpftrace -q -e 'tracepoint:raw_syscalls:sys_enter")}
<p><strong>Ai gọi syscall?</strong> Trong hai giây máy tạo tải gọi 33 273 lần và máy chủ 10 402 lần — khoảng mười lần cho mỗi request, cái giá của một request tính bằng số lần vượt ranh giới vào nhân (bài 11.4). Cùng những sự kiện đó, câu hỏi khác — <strong>các lần read() lớn cỡ nào?</strong></p>
${run('c155-ebpf', "bpftrace -q -e 'tracepoint:syscalls:sys_exit_read")}
<p>1 209 lần đọc 64–127 byte: mỗi lần một request HTTP. 134 lần đọc 8–15 byte thì không phải HTTP: bộ đếm của một <code>eventfd</code> dài đúng 8 byte, và libuv dùng một cái như thế để đánh thức vòng lặp — một lời giải thích có khả năng, cần thêm một câu một dòng in ra loại của tệp để xác nhận. Hai lần đọc trả về 0: một khách đã đóng kết nối. Tiếp theo, <strong>một lần fsync mất bao lâu?</strong> Một kprobe trên <code>vfs_fsync_range</code> và lúc nó trả về (kretprobe), bấm giờ mỗi lần gọi theo từng luồng, trong lúc <code>dd</code> ghi với <code>oflag=dsync</code>:</p>
${run('c155-ebpf', "bpftrace -q -e 'kprobe:vfs_fsync_range")}
<p>Phần lớn lần sync mất 256–512 µs, có đuôi kéo tới 16–64 ms. So với thời gian của từng request khối riêng lẻ — chính là <code>biolatency</code> kinh điển. Trước hết là công cụ dựng sẵn, lọc theo cgroup của ta:</p>
${run('c155-ebpf', 'biolatency-libbpf -c /sys/fs/cgroup')}
<p>Không có gì — chỉ có dòng tiêu đề. Bộ lọc cgroup lặng lẽ không khớp với lần I/O nào. (Phỏng đoán của chúng tôi: I/O khối thường được hoàn tất trong ngữ cảnh ngắt, nơi "cgroup hiện tại" không phải của ta; chúng tôi không đào sâu thêm.) Nên ta tự viết biolatency trong một dòng: ghi nhớ thời điểm phát lệnh của mỗi request từ cgroup của ta theo thiết bị và sector, rồi dựng histogram khoảng chênh lúc hoàn tất:</p>
${run('c155-ebpf', "bpftrace -q -e 'tracepoint:block:block_rq_issue")}
<p>Thiết bị trả lời trong <strong>16–32 µs</strong> (đĩa của máy ảo là một tệp trên SSD của Mac), vậy mà một lần fsync lâu gấp 10–20 lần: nó chờ lần ghi dữ liệu, lần commit journal của ext4 và một lần xả cache — vài request nối tiếp nhau, không phải một (bài 9.4). Đó là khác biệt giữa "đĩa nhanh" và "ghi bền thì chậm", và là chủ đề của bài 15.8.</p>

<h3>execsnoop: những tiến trình top không bao giờ thấy</h3>
<p>Một script "kiểm tra sức khoẻ" chạy mỗi 0,1 s và mỗi lần khởi động <code>cat</code>, <code>awk</code>, <code>curl</code>, <code>date</code> và <code>sleep</code>. Chúng sống vài mili giây:</p>
${src('ch15/healthcheck.sh', 'bash')}
${run('c155-ebpf', 'top -bn1')}
${run('c155-ebpf', 'execsnoop-libbpf -c /sys/fs/cgroup', 2)}
${run('c155-ebpf', "awk 'NR > 1")}
<p><code>top</code> thấy script ở 9,1% và không thấy đứa con nào. <code>execsnoop</code> móc vào mọi lần <code>execve</code> và thấy <strong>80 tiến trình trong 2 giây</strong> — 40 lần fork+exec mỗi giây, mỗi lần trả giá cho một không gian địa chỉ mới, việc liên kết động và các page fault. Đây là nguyên nhân kinh điển của "CPU bận mà không tiến trình nào bận": script shell chạy trong vòng lặp, health check fork ra <code>curl</code>, bộ chuyển log chạy một lệnh cho mỗi dòng. (Để ý PID: 76427 trở lên là số của nhân, không phải của container.)</p>
${lab('sysmon', 'forkbomb', 'vi', 'Phiên bản cực đoan của rất nhiều tiến trình ngắn ngủi: theo dõi số tiến trình và load, rồi tìm ai cứ liên tục fork.', { tour: 'sysmon-start' })}

<h3>opensnoop: nó đã thử mở tệp nào?</h3>
<p>Nhóm nói <em>"tụi mình để config ở <code>./config.yaml</code> mà dịch vụ cứ phớt lờ"</em>. Dịch vụ chỉ in ra là nó dùng mặc định:</p>
${run('c155-ebpf', './cfgload')}
${run('c155-ebpf', 'opensnoop-libbpf -x -n cfgload')}
<p><code>-x</code> chỉ hiện những lần mở thất bại; <code>ERR 2</code> là <code>ENOENT</code>. Chương trình tìm ở ba chỗ, và chỗ cuối là <code>./config.<strong>yml</strong></code> — không phải <code>.yaml</code>. Không có eBPF thì bạn dùng <code>strace -e openat</code> (bài 11.3), cũng được nhưng nó dừng tiến trình ở mỗi lời gọi hệ thống; <code>opensnoop</code> theo dõi mọi tiến trình trên máy với chi phí gần như bằng không.</p>

<h3>runqlat: luồng phải chờ CPU bao lâu</h3>
<p>USE hỏi về <em>bão hoà</em> của CPU: việc đang chờ được chạy. <code>runqlat</code> đo thẳng cái đó — khoảng thời gian từ "sẵn sàng chạy" tới "đang chạy" cho mỗi lần thức dậy. Hai luồng nặng CPU ghim vào hai lõi, rồi tám luồng:</p>
${run('c155-ebpf', 'taskset -c 0,1 stress-ng --cpu 2')}
${run('c155-ebpf', 'taskset -c 0,1 stress-ng --cpu 8')}
<p>Với hai luồng trên hai lõi, cả 34 lần thức dậy đều được CPU trong vòng một mili giây. Với tám luồng, histogram mọc thêm một cái bướu ở <strong>8–15 ms</strong> (989 lần) và vài lần ở 16–31 ms: mỗi luồng chờ tới lượt sau ba luồng khác. Sự chờ đợi đó vô hình trong "CPU %" (cả hai lượt đều 100%) và hiện rõ trong độ trễ của mọi request mà một máy như thế phục vụ.</p>
${lab('scheduler', 'multicore', 'vi', 'Sáu luồng trên hai lõi: theo dõi một luồng và đếm số nhịp nó sẵn sàng mà không được chạy — đó chính là thứ runqlat đo.', { tour: 'scheduler-start' })}

<h3>tcplife: ai mở kết nối nào, và giữ bao lâu</h3>
<p>Cùng 200 request, không và có keep-alive:</p>
${run('c155-ebpf', 'tcplife-libbpf -L 8080 > life1.txt')}
${run('c155-ebpf', 'head -4 life1.txt')}
${run('c155-ebpf', 'tcplife-libbpf -L 8080 > life2.txt')}
${run('c155-ebpf', 'cat life2.txt')}
<p>Không keep-alive: <strong>200 kết nối</strong> dài 1–4 ms, mỗi request một cái. Có keep-alive: <strong>4 kết nối</strong> (mỗi worker phía khách một cái) dài ~310 ms, mỗi cái chở 21 KB. Trên loopback một kết nối mới tốn rất ít, nên thông lượng tương tự (810 vs 646 request/giây — nằm trong độ nhiễu của máy dùng chung này); qua mạng thật mỗi kết nối mới thêm một vòng đi-về, bắt tay TLS thêm nữa, và hàng nghìn kết nối ngắn để lại hàng nghìn socket ở trạng thái <code>TIME_WAIT</code> (bài 2.5). Cột <code>PID/COMM</code> là tiến trình đang chạy lúc socket đổi trạng thái — một gợi ý, không phải bằng chứng.</p>

<h3>Công cụ nào trả lời câu hỏi USE nào</h3>
<table>
<tr><th>Tài nguyên</th><th>Mức bận</th><th>Bão hoà</th><th>Lỗi</th></tr>
<tr><td>CPU</td><td><code>profile</code>, <code>execsnoop</code> (tiến trình ngắn ngủi)</td><td><code>runqlat</code>, <code>runqlen</code></td><td>—</td></tr>
<tr><td>Đĩa</td><td><code>biolatency</code> / tracepoint khối</td><td>thời gian xếp hàng (<code>biolatency -Q</code>), <code>offcputime</code> trong <code>io_schedule</code></td><td>lỗi khối</td></tr>
<tr><td>Mạng</td><td><code>tcplife</code>, <code>tcptop</code></td><td><code>tcpsynbl</code> (hàng đợi SYN)</td><td>theo dõi kiểu <code>tcpretrans</code></td></tr>
<tr><td>Tệp</td><td><code>opensnoop</code></td><td>—</td><td><code>opensnoop -x</code></td></tr>
<tr><td>Khoá / chờ đợi</td><td>—</td><td><code>offcputime</code> (bài 15.3)</td><td>—</td></tr>
</table>
<p>Những công cụ trong bảng mà bài này không chạy (<code>runqlen</code>, <code>tcptop</code>, <code>tcpsynbl</code>) có trong cùng gói libbpf-tools; dòng của chúng lấy theo tài liệu, không đo ở đây.</p>

<div class="pitfall co-tieu-de">
<p><strong>"biolatency không in gì, vậy container của ta không có I/O đĩa."</strong> Đo được: <code>dd</code> ghi 1 500 khối đồng bộ trong khi <code>biolatency -c</code> in ra một histogram rỗng. Một công cụ có thể lặng lẽ lọc mất tất cả. Luôn chạy nó một lần với một tải bạn <em>biết chắc</em> sinh ra sự kiện (ở đây là <code>dd oflag=dsync</code>) trước khi tin vào con số không.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>"eBPF miễn phí, cứ theo dõi mọi syscall trên production cả ngày."</strong> Mỗi sự kiện vẫn chạy một chương trình: bài 11.6 đo 1 000 request HTTP chậm từ 0,129 s lên 0,177 s khi bpftrace đếm mọi syscall của máy chủ. Hãy theo dõi trong vài giây, gom trong nhân (count/hist, không printf từng sự kiện), và lọc càng sớm càng tốt.</p>
</div>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> CPU của VPS ngồi ở 30% "system" kể cả ban đêm, <code>top</code> không thấy gì trên 2%, và biểu đồ đĩa có những đợt ngắn mỗi vài giây.</p>
<ol>
<li>Trong một container lab <code>--privileged</code> với các gói deb của <code>c155-ebpf.sh</code>, chạy <code>./healthcheck.sh</code> và tìm các tiến trình con của nó bằng <code>execsnoop-libbpf -c /sys/fs/cgroup</code>. Bao nhiêu tiến trình mỗi giây?</li>
<li>Viết một câu bpftrace một dòng đếm <code>execve</code> theo tên tiến trình cha (gợi ý: <code>tracepoint:sched:sched_process_exec</code>, <code>curtask-&gt;real_parent-&gt;comm</code>).</li>
<li>Chạy <code>dd if=/dev/zero of=/var/tmp/x bs=4k count=1000 oflag=dsync</code> và đo độ trễ fsync và độ trễ khối bằng hai câu một dòng của bài. Giải thích hệ số chênh giữa chúng.</li>
<li>Cho thấy <code>runqlat</code> thay đổi khi bạn đi từ 2 lên 8 luồng bận trên 2 lõi, trong khi <code>top</code> báo 100% ở cả hai.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có, từ chính lượt chạy của mình, một con số cho mỗi câu hỏi — số tiến trình khởi động mỗi giây, độ trễ fsync vs khối, độ trễ run queue với 2 và 8 luồng — và mỗi công cụ một câu giải thích vì sao <code>top</code> không thể cho bạn biết điều đó.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['eBPF', 'Chương trình nhỏ đã được kiểm chứng, chạy trong nhân ở những sự kiện được chọn; kết quả gom trong map.'],
  ['verifier (bộ kiểm chứng)', 'Phép kiểm của nhân chứng minh chương trình eBPF an toàn (có giới hạn, truy cập bộ nhớ hợp lệ) trước khi chạy.'],
  ['tracepoint / kprobe / uprobe', 'Móc ổn định của nhân / bất kỳ hàm nào của nhân / một hàm trong chương trình người dùng.'],
  ['map', 'Kho khoá-giá trị phía nhân (bộ đếm, histogram) mà chương trình eBPF ghi vào và công cụ đọc ra.'],
  ['BTF / CO-RE', 'Thông tin kiểu của nhân đang chạy; cho một công cụ biên dịch một lần chạy được trên nhiều phiên bản nhân.'],
  ['bpftrace', 'Ngôn ngữ theo dõi một dòng: probe /bộ lọc/ { hành động }.'],
  ['run-queue latency (độ trễ hàng đợi chạy)', 'Thời gian một luồng sẵn sàng chạy mà chưa được chạy — sự bão hoà CPU (runqlat).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>eBPF chạy chương trình đã kiểm chứng ở các sự kiện của nhân và gom số liệu trong nhân; bpftrace 0.25 và libbpf-tools 0.35 chạy thật trong container <code>--privileged</code> trên máy ảo Docker Desktop.</li>
<li>Nó thấy cả máy: lọc theo cgroup, tên hoặc cổng; PID của nó là PID của nhân.</li>
<li>Đo được: fsync 0,25–0,5 ms vs I/O khối 16–32 µs; 80 tiến trình ẩn trong 2 s; tệp cấu hình bị tìm với đuôi <code>.yml</code>; chờ run queue 8–15 ms với 8 luồng trên 2 lõi; 200 vs 4 kết nối.</li>
<li>Một công cụ không in gì có thể đang lọc sai — hãy thử nó với một tải đã biết (<code>biolatency -c</code> đã như thế).</li>
<li>Ghép công cụ với USE: runqlat = bão hoà CPU, biolatency = đĩa, tcplife = kết nối, opensnoop -x = lỗi, offcputime = chờ đợi.</li>
</ul>
${L('https://ebpf.io/what-is-ebpf/', '🐝', 'eBPF là gì? — ebpf.io', 'Verifier, JIT, map, móc và hàm trợ giúp được giải thích.', 'Mở')}
${L('https://github.com/bpftrace/bpftrace', '🔎', 'bpftrace', 'Ngôn ngữ, bài hướng dẫn một dòng và tài liệu tham chiếu.', 'Mở')}
${L('https://www.brendangregg.com/ebpf.html', '📘', 'Linux eBPF Tracing Tools — Brendan Gregg', 'Bản đồ công cụ: công cụ nào cho phần nào của hệ thống.', 'Mở')}
</div>
`,
};

/* ───────────────────────── 15.6 — đo hiệu năng cho trung thực ───────────────────────── */
const L156 = {
  title: '15.6 — Benchmarking honestly: warm-up, percentiles, coordinated omission|||15.6 — Đo hiệu năng trung thực: làm nóng, phân vị, coordinated omission',
  slug: 'os-15-8-benchmark',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Năm cách một con số benchmark nói dối, đo thật: JVM vòng đầu 158 ms rồi 45–77 ms (làm nóng); hyperfine 398,5 ± 12,8 ms (độ dao động, tỉ số 2,65 ± 0,22); "lõi ồn": lần tốt nhất 369 ms y như máy yên mà p90 752 ms (best-of-N giấu nhiễu); coordinated omission trên một máy chủ đứng hình 200 ms mỗi giây — hey và vòng kín báo p99 0,1–0,2 ms, k6 constant-arrival-rate và vòng mở báo p99 ~189 ms, wrk tự hiệu chỉnh sau (stats_correct); chọn công cụ và mẫu báo cáo p50/p95/p99.',
  content: `${G156}
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.6</span>
<h2>Benchmarking honestly: five ways a number lies, each one measured</h2>
<p class="lead">Every lesson so far ended with "measure again". This one asks what "measure" should mean. A benchmark is an experiment: it has conditions, noise, a model of the user and a result that is a <em>distribution</em>, not a number. The question of this lesson: <strong>how do you produce a latency or speedup number that someone else can trust — and recognise one that should not be trusted?</strong> We go through five classic mistakes and reproduce each one.</p>

<h3>1. Warm-up: the first runs are a different program</h3>
${src('ch15/Warm.java', 'java')}
${run('c156-bench', 'java Warm.java')}
<p>The same work, ten rounds: <strong>158 ms</strong> for the first, then 45–77 ms. During round 1 the JVM interprets the bytecode, then compiles the hot methods (C1, later C2) — the program literally gets faster while it runs. Node's V8 and PyPy do the same; even C programs have a warm-up (page faults, page cache, CPU frequency, branch predictors). Rule: run the workload until it is stable, throw those runs away, then measure. The later rounds still vary from 45 to 77 ms — which brings us to noise.</p>

<h3>2. Variance: one run is an anecdote</h3>
${run('c156-bench', 'hyperfine')}
<p><code>hyperfine</code> does the basic statistics for command-line benchmarks: 2 warm-up runs, 15 measured runs, mean ± standard deviation, min…max, and a ratio <em>with its uncertainty</em>: the table version is <strong>2.65 ± 0.22</strong> times faster. Note that this is not the 2.9× of lesson 15.2 — different input size, different moment on a shared machine; both are honest because both say how they were measured. A difference smaller than the spread is not a result.</p>

<h3>3. Best-of-N vs percentiles: what are you trying to know?</h3>
<p>Thirty runs of the same program, first on a quiet core, then sharing its core with one busy neighbour (<code>stress-ng</code> pinned to the same CPU — the situation of any VM on a busy host):</p>
${run('c156-bench', 'for i in $(seq 30)')}
${run('c156-bench', 'taskset -c 3 stress-ng')}
<p>The <strong>best</strong> run is the same in both cases: 371 vs 369 ms. The median moves a little (380 → 377 — within noise), but <strong>p90 doubles (399 → 752 ms)</strong> and the mean grows by a quarter with a standard deviation of 169 ms. Best-of-N answers "how fast can this code go when nothing disturbs it?" — useful when you compare two algorithms on a noisy machine (lesson 4.1 used best-of-3 for exactly that). It is the wrong answer to "how fast will it be for users?", because users meet the neighbours. For that, report the median <em>and</em> the tail.</p>
${lab('latency', 'default', 'en', 'Why tails are so wide: a request that touches the disk or the network once can take a thousand times longer than one that stays in memory.', { tour: 'latency-start' })}

<h3>4. Coordinated omission: when the load generator politely waits</h3>
<p>This is the mistake that hides outages. <code>stall.js</code> answers in ~0.1 ms but freezes for 200 ms once every second — like a stop-the-world GC pause or a blocking call on the event loop. A real user who clicks during a freeze waits up to 200 ms; that happens to about 20% of requests if they arrive at random. Now let five tools measure it:</p>
${src('ch15/stall.js', 'javascript')}
${run('c156-bench', 'hey -z 8s -c 1')}
${run('c156-bench', 'node tai.js http://127.0.0.1:8090/ --closed 1')}
<p><strong>Closed-loop</strong> tools (one connection: send, wait for the answer, send the next) report p99 = 0.1–0.2 ms. They are not lying about the requests they sent — they are lying about the requests they <em>did not send</em>: during each 200 ms freeze the client was itself waiting, so it sent one request instead of the ~1 500 it sends in 200 ms of normal operation. The tool coordinated with the server and omitted the bad period. Gil Tene named this <strong>coordinated omission</strong>.</p>
${run('c156-bench', 'node tai.js http://127.0.0.1:8090/ --rate 100 --duration 8 --conns 1')}
${run('c156-bench', 'k6 run', 2)}
<p><strong>Open-loop</strong> tools schedule requests at a fixed rate (here 100/s), whatever the server does, like independent users. k6's <code>constant-arrival-rate</code> executor starts extra virtual users when the server is slow so that requests still leave on time: p95 150 ms, <strong>p99 189 ms</strong>. <code>tai.js</code> in open mode agrees (p99 189–191 ms) — and its single-connection run shows the trap inside one tool: measured from when each request was <em>supposed</em> to leave, p99 = 189 ms; measured from when it <em>actually</em> got a socket, p99 = 6.4 ms. Same run, same requests; the second number silently forgets the queue in front of the socket.</p>
${run('c156-bench', 'wrk -t1 -c1')}
<p><code>wrk</code> is a closed-loop tool, yet it reports p99 = 187 ms. Its source shows why: after the run, <code>stats_correct()</code> takes the average interval between requests (8.02 s ÷ 123 200 ≈ 65 µs) and, for every recorded latency longer than twice that, adds the samples that "should" have been taken. That rescues the p99 — but the correction assumes a user sending 15 000 requests per second, so the rest of its distribution (p90 = 78 ms) describes that user, not yours. <code>wrk2</code> and k6's arrival-rate executors avoid the problem by design: fix the rate, then measure from the intended start.</p>
${lab('threadpool', 'mm1', 'en', 'Queueing when arrivals do not wait for the server: push the arrival rate towards the service rate and watch the p99 climb long before the average looks bad.', { tour: 'threadpool-start' })}

<h3>5. Choosing a load generator</h3>
<table>
<tr><th>Tool</th><th>Model</th><th>Latency it reports</th><th>Use it for</th></tr>
<tr><td><code>hey</code></td><td>closed (N workers)</td><td>from actual send — omits stalls</td><td>quick throughput checks</td></tr>
<tr><td><code>wrk</code></td><td>closed (connections × threads), Lua scripts</td><td>corrected afterwards (<code>stats_correct</code>)</td><td>max throughput of an endpoint</td></tr>
<tr><td><code>k6</code></td><td>open with <code>constant-arrival-rate</code> / <code>ramping-arrival-rate</code>; closed with VUs</td><td>per request; dropped iterations reported</td><td>latency at a target rate, scenarios, CI thresholds</td></tr>
<tr><td><code>wrk2</code></td><td>open, constant rate</td><td>from intended start</td><td>latency at a target rate <em>(not in Ubuntu; not run here)</em></td></tr>
<tr><td><code>tai.js</code> (this chapter)</td><td>both</td><td>both, side by side</td><td>seeing coordinated omission</td></tr>
</table>
<p>A closed loop answers "how many requests per second can it do?"; an open loop answers "how long do users wait at <em>this</em> rate?". Both are legitimate; mixing them up is how a service with 200 ms freezes gets a p99 of 0.2 ms in a slide deck.</p>

<h3>6. Report it so someone else can check it</h3>
<ul>
<li><strong>Environment</strong>: machine, CPU limit, versions, what else was running (here: a shared Mac, Docker Desktop VM, 10 CPUs).</li>
<li><strong>Procedure</strong>: warm-up, duration, number of runs, closed or open loop, rate or concurrency, connections, keep-alive.</li>
<li><strong>Result as a distribution</strong>: p50, p95, p99, max, throughput, errors — and the spread across runs.</li>
<li><strong>Comparison</strong>: same procedure, back to back, alternating if possible; a difference inside the spread is "no difference".</li>
</ul>

<div class="pitfall co-tieu-de">
<p><strong>"We load-tested with 50 concurrent users and p99 was 3 ms."</strong> If those 50 "users" were a closed-loop tool, every server pause made them stop sending. Measured here: <code>hey -c 1</code> p99 = 0.1 ms on a server that freezes 200 ms every second, while k6 at a fixed 100 requests/s measured p99 = 189 ms. Ask which loop the number came from before you believe it.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>"The fastest of 10 runs was 369 ms, so it is as fast as on the quiet machine."</strong> Measured: best-of-30 was 371 vs 369 ms; p90 was 399 vs 752 ms. The best run is the one the neighbour happened to sleep through.</p>
</div>

<h3>🧪 Practice (45 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a pull request claims "new JSON library: 30% faster" based on one <code>curl</code> timing on the author's laptop. You are asked to review the claim.</p>
<ol>
<li>Write the benchmark plan in five lines: environment, warm-up, runs, loop model, metrics.</li>
<li>With <code>hyperfine --warmup 3 --runs 20</code> compare <code>./hot 20000</code> and <code>./hot 20000 table</code>; report the ratio with its uncertainty.</li>
<li>Run <code>stall.js</code> and measure it with <code>hey -c 1</code>, <code>wrk -c1 --latency</code>, <code>k6 run k6-open.js</code> and <code>tai.js --rate 100</code>. Put p50/p95/p99 of all four in one table and mark which are closed-loop.</li>
<li>Change the stall to 50 ms every 500 ms (<code>node stall.js 8090 50 500</code>) and predict, before measuring, what the open-loop p99 will be.</li>
</ol>
<p><strong>Done when:</strong> your review says which number to trust and why, your prediction for step 4 is within ~20% of the measured open-loop p99, and your table shows the closed-loop tools missing the stalls.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['warm-up', 'Runs discarded until JIT, caches and page faults have settled.'],
  ['mean ± σ', 'Average and standard deviation of repeated runs; differences inside σ are noise.'],
  ['best-of-N', 'The fastest of N runs: estimates undisturbed cost, hides interference.'],
  ['percentile (p50/p95/p99)', 'The value below which 50/95/99% of measurements fall.'],
  ['closed-loop load', 'A fixed number of clients, each sending the next request after the previous answer.'],
  ['open-loop load', 'Requests scheduled at a fixed rate, independent of the server’s answers.'],
  ['coordinated omission', 'The load generator stops sending while the server is slow, so the slow period is under-sampled.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Warm up: JVM round 1 was 158 ms, later rounds 45–77 ms. Discard warm-up runs.</li>
<li>Report spread: hyperfine 398.5 ± 12.8 ms; the speedup is 2.65 ± 0.22, not "2.65".</li>
<li>Best-of-N hides interference: 371 vs 369 ms best, 399 vs 752 ms p90.</li>
<li>Coordinated omission: closed-loop p99 0.1–0.2 ms vs open-loop p99 ~189 ms on the same stalling server; wrk corrects afterwards; k6 arrival-rate and wrk2 avoid it.</li>
<li>Always state environment, procedure and loop model, and give p50/p95/p99 with throughput and errors.</li>
</ul>
${L('https://github.com/giltene/wrk2', '📏', 'wrk2 — constant-throughput wrk', 'The README explains coordinated omission and why rate matters.', 'Open')}
${L('https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/constant-arrival-rate/', '📈', 'k6 constant-arrival-rate executor', 'Open-model load: fixed iterations per time unit, VUs added as needed.', 'Open')}
${L('https://github.com/sharkdp/hyperfine', '⏱', 'hyperfine', 'Command-line benchmarking with warm-up, statistics and comparison.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.6</span>
<h2>Đo hiệu năng cho trung thực: năm cách một con số nói dối, mỗi cách đều đo thật</h2>
<p class="lead">Bài nào từ đầu chương tới giờ cũng kết thúc bằng "đo lại". Bài này hỏi "đo" nên được hiểu thế nào. Một benchmark là một thí nghiệm: nó có điều kiện, có nhiễu, có một mô hình về người dùng, và kết quả là một <em>phân bố</em>, không phải một con số. Câu hỏi của bài: <strong>làm sao đưa ra một con số độ trễ hay tốc độ mà người khác tin được — và nhận ra một con số không nên tin?</strong> Ta đi qua năm lỗi kinh điển và tái hiện từng lỗi một.</p>

<h3>1. Làm nóng: những lượt đầu là một chương trình khác</h3>
${src('ch15/Warm.java', 'java')}
${run('c156-bench', 'java Warm.java')}
<p>Cùng một việc, mười vòng: <strong>158 ms</strong> cho vòng đầu, sau đó 45–77 ms. Trong vòng 1, JVM thông dịch bytecode, rồi biên dịch các phương thức nóng (C1, sau đó C2) — chương trình thật sự nhanh lên trong lúc nó đang chạy. V8 của Node và PyPy cũng vậy; ngay cả chương trình C cũng có giai đoạn làm nóng (page fault, page cache, tần số CPU, bộ dự đoán rẽ nhánh). Luật: chạy tải tới khi ổn định, bỏ những lượt đó đi, rồi mới đo. Các vòng sau vẫn dao động từ 45 tới 77 ms — điều đưa ta tới chuyện nhiễu.</p>

<h3>2. Độ dao động: một lượt chạy chỉ là một giai thoại</h3>
${run('c156-bench', 'hyperfine')}
<p><code>hyperfine</code> làm phần thống kê cơ bản cho benchmark dòng lệnh: 2 lượt làm nóng, 15 lượt đo, trung bình ± độ lệch chuẩn, nhỏ nhất…lớn nhất, và một tỉ số <em>kèm độ bất định của nó</em>: bản tra bảng nhanh hơn <strong>2,65 ± 0,22</strong> lần. Để ý rằng đây không phải con số 2,9× của bài 15.2 — cỡ đầu vào khác, thời điểm khác trên một máy dùng chung; cả hai đều trung thực vì cả hai đều nói rõ được đo thế nào. Một khác biệt nhỏ hơn độ dao động thì không phải là một kết quả.</p>

<h3>3. Best-of-N hay phân vị: bạn đang muốn biết điều gì?</h3>
<p>Ba mươi lượt chạy cùng một chương trình, đầu tiên trên một lõi yên tĩnh, rồi dùng chung lõi với một hàng xóm bận rộn (<code>stress-ng</code> ghim vào cùng CPU — đúng hoàn cảnh của mọi VM trên một máy chủ đông khách):</p>
${run('c156-bench', 'for i in $(seq 30)')}
${run('c156-bench', 'taskset -c 3 stress-ng')}
<p>Lượt <strong>nhanh nhất</strong> như nhau ở cả hai trường hợp: 371 so với 369 ms. Trung vị nhích một chút (380 → 377 — trong độ nhiễu), nhưng <strong>p90 tăng gấp đôi (399 → 752 ms)</strong> và trung bình tăng một phần tư với độ lệch chuẩn 169 ms. Best-of-N trả lời câu "code này chạy nhanh được tới đâu khi không có gì quấy?" — hữu ích khi so hai thuật toán trên một máy ồn (bài 4.1 dùng best-of-3 đúng vì thế). Nó là câu trả lời sai cho "người dùng sẽ thấy nhanh tới đâu?", vì người dùng gặp phải hàng xóm. Với câu đó, hãy báo cả trung vị <em>và</em> phần đuôi.</p>
${lab('latency', 'default', 'vi', 'Vì sao phần đuôi lại rộng đến thế: một request chạm đĩa hay mạng một lần có thể lâu gấp nghìn lần một request chỉ ở trong bộ nhớ.', { tour: 'latency-start' })}

<h3>4. Coordinated omission: khi máy tạo tải lịch sự ngồi chờ</h3>
<p>Đây là lỗi che giấu sự cố. <code>stall.js</code> trả lời trong ~0,1 ms nhưng cứ mỗi giây lại đứng hình 200 ms — như một lần dọn rác stop-the-world hay một lời gọi chặn trên event loop. Một người dùng thật bấm vào đúng lúc đứng hình sẽ chờ tới 200 ms; nếu request đến ngẫu nhiên thì khoảng 20% request gặp chuyện đó. Giờ để năm công cụ cùng đo nó:</p>
${src('ch15/stall.js', 'javascript')}
${run('c156-bench', 'hey -z 8s -c 1')}
${run('c156-bench', 'node tai.js http://127.0.0.1:8090/ --closed 1')}
<p>Các công cụ <strong>vòng kín</strong> (một kết nối: gửi, chờ trả lời, gửi cái tiếp) báo p99 = 0,1–0,2 ms. Chúng không nói dối về những request đã gửi — chúng nói dối về những request <em>không được gửi</em>: trong mỗi lần đứng hình 200 ms, chính máy khách cũng đang chờ, nên nó chỉ gửi một request thay vì ~1 500 request như trong 200 ms bình thường. Công cụ đã "phối hợp" với máy chủ và bỏ sót giai đoạn tồi tệ. Gil Tene đặt tên cho chuyện này là <strong>coordinated omission</strong> (bỏ sót có phối hợp).</p>
${run('c156-bench', 'node tai.js http://127.0.0.1:8090/ --rate 100 --duration 8 --conns 1')}
${run('c156-bench', 'k6 run', 2)}
<p>Các công cụ <strong>vòng mở</strong> lên lịch request theo một tốc độ cố định (ở đây 100/giây), bất kể máy chủ làm gì, như những người dùng độc lập. Executor <code>constant-arrival-rate</code> của k6 mở thêm người dùng ảo khi máy chủ chậm để request vẫn rời đi đúng giờ: p95 150 ms, <strong>p99 189 ms</strong>. <code>tai.js</code> ở chế độ mở cũng đồng ý (p99 189–191 ms) — và lượt chạy một kết nối của nó cho thấy cái bẫy ngay trong một công cụ: tính từ lúc mỗi request <em>lẽ ra</em> được gửi, p99 = 189 ms; tính từ lúc nó <em>thật sự</em> nhận được socket, p99 = 6,4 ms. Cùng lượt chạy, cùng những request đó; con số thứ hai lặng lẽ quên đi hàng đợi phía trước socket.</p>
${run('c156-bench', 'wrk -t1 -c1')}
<p><code>wrk</code> là công cụ vòng kín, vậy mà nó báo p99 = 187 ms. Mã nguồn của nó cho biết vì sao: sau lượt chạy, <code>stats_correct()</code> lấy khoảng cách trung bình giữa các request (8,02 s ÷ 123 200 ≈ 65 µs) và, với mỗi độ trễ đã ghi dài hơn hai lần khoảng đó, thêm vào những mẫu "lẽ ra" đã được lấy. Cách đó cứu được p99 — nhưng phép hiệu chỉnh giả định một người dùng gửi 15 000 request mỗi giây, nên phần còn lại của phân bố (p90 = 78 ms) mô tả người dùng đó, không phải người dùng của bạn. <code>wrk2</code> và các executor arrival-rate của k6 tránh vấn đề ngay từ thiết kế: cố định tốc độ, rồi đo từ thời điểm dự định.</p>
${lab('threadpool', 'mm1', 'vi', 'Xếp hàng khi request đến không chờ máy chủ: đẩy tốc độ đến về gần tốc độ phục vụ và xem p99 leo thang từ rất lâu trước khi trung bình trông có vẻ tệ.', { tour: 'threadpool-start' })}

<h3>5. Chọn máy tạo tải</h3>
<table>
<tr><th>Công cụ</th><th>Mô hình</th><th>Độ trễ nó báo</th><th>Dùng cho</th></tr>
<tr><td><code>hey</code></td><td>vòng kín (N worker)</td><td>tính từ lúc gửi thật — bỏ sót lúc đứng hình</td><td>kiểm nhanh thông lượng</td></tr>
<tr><td><code>wrk</code></td><td>vòng kín (kết nối × luồng), script Lua</td><td>hiệu chỉnh sau (<code>stats_correct</code>)</td><td>thông lượng tối đa của một endpoint</td></tr>
<tr><td><code>k6</code></td><td>mở với <code>constant-arrival-rate</code> / <code>ramping-arrival-rate</code>; kín với VU</td><td>từng request; báo số lần bị bỏ</td><td>độ trễ ở một tốc độ mục tiêu, kịch bản, ngưỡng trong CI</td></tr>
<tr><td><code>wrk2</code></td><td>mở, tốc độ cố định</td><td>tính từ thời điểm dự định</td><td>độ trễ ở một tốc độ mục tiêu <em>(không có trong Ubuntu; không chạy ở đây)</em></td></tr>
<tr><td><code>tai.js</code> (của chương này)</td><td>cả hai</td><td>cả hai, đặt cạnh nhau</td><td>nhìn thấy coordinated omission</td></tr>
</table>
<p>Vòng kín trả lời "nó làm được bao nhiêu request mỗi giây?"; vòng mở trả lời "ở <em>tốc độ này</em> người dùng phải chờ bao lâu?". Cả hai đều chính đáng; trộn lẫn chúng là cách một dịch vụ đứng hình 200 ms lại có p99 0,2 ms trên slide thuyết trình.</p>

<h3>6. Báo cáo sao cho người khác kiểm lại được</h3>
<ul>
<li><strong>Môi trường</strong>: máy, giới hạn CPU, phiên bản, có gì khác đang chạy (ở đây: một máy Mac dùng chung, máy ảo Docker Desktop, 10 CPU).</li>
<li><strong>Quy trình</strong>: làm nóng, thời lượng, số lượt, vòng kín hay mở, tốc độ hay độ đồng thời, số kết nối, keep-alive.</li>
<li><strong>Kết quả dưới dạng phân bố</strong>: p50, p95, p99, max, thông lượng, lỗi — và độ dao động giữa các lượt.</li>
<li><strong>So sánh</strong>: cùng quy trình, chạy liền nhau, xen kẽ nếu được; khác biệt nằm trong độ dao động thì là "không khác".</li>
</ul>

<div class="pitfall co-tieu-de">
<p><strong>"Tụi mình đã test tải với 50 người dùng đồng thời và p99 là 3 ms."</strong> Nếu 50 "người dùng" đó là một công cụ vòng kín, mỗi lần máy chủ khựng lại thì họ ngừng gửi. Đo ở đây: <code>hey -c 1</code> p99 = 0,1 ms trên một máy chủ đứng hình 200 ms mỗi giây, trong khi k6 ở tốc độ cố định 100 request/giây đo được p99 = 189 ms. Hãy hỏi con số đến từ vòng nào trước khi tin.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>"Lượt nhanh nhất trong 10 lượt là 369 ms, vậy nó nhanh y như trên máy yên tĩnh."</strong> Đo được: best-of-30 là 371 so với 369 ms; p90 là 399 so với 752 ms. Lượt nhanh nhất là lượt mà hàng xóm tình cờ đang ngủ.</p>
</div>

<h3>🧪 Thực hành (45 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một pull request tuyên bố "thư viện JSON mới: nhanh hơn 30%" dựa trên một lần đo bằng <code>curl</code> trên laptop của tác giả. Bạn được nhờ duyệt tuyên bố đó.</p>
<ol>
<li>Viết kế hoạch benchmark trong năm dòng: môi trường, làm nóng, số lượt, mô hình vòng, chỉ số.</li>
<li>Dùng <code>hyperfine --warmup 3 --runs 20</code> so <code>./hot 20000</code> với <code>./hot 20000 table</code>; báo tỉ số kèm độ bất định.</li>
<li>Chạy <code>stall.js</code> và đo nó bằng <code>hey -c 1</code>, <code>wrk -c1 --latency</code>, <code>k6 run k6-open.js</code> và <code>tai.js --rate 100</code>. Xếp p50/p95/p99 của cả bốn vào một bảng và đánh dấu cái nào là vòng kín.</li>
<li>Đổi lần đứng hình thành 50 ms mỗi 500 ms (<code>node stall.js 8090 50 500</code>) và dự đoán, trước khi đo, p99 của vòng mở sẽ là bao nhiêu.</li>
</ol>
<p><strong>Đạt khi:</strong> bản duyệt của bạn nói rõ nên tin con số nào và vì sao, dự đoán ở bước 4 lệch không quá ~20% so với p99 vòng mở đo được, và bảng của bạn cho thấy các công cụ vòng kín bỏ sót những lần đứng hình.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['warm-up (làm nóng)', 'Những lượt bị bỏ đi cho tới khi JIT, cache và page fault đã ổn định.'],
  ['mean ± σ (trung bình ± độ lệch chuẩn)', 'Trung bình và độ lệch chuẩn của các lượt lặp lại; khác biệt nằm trong σ là nhiễu.'],
  ['best-of-N (tốt nhất trong N)', 'Lượt nhanh nhất trong N lượt: ước lượng chi phí khi không bị quấy, che giấu nhiễu.'],
  ['percentile (phân vị p50/p95/p99)', 'Giá trị mà 50/95/99% số đo nằm dưới nó.'],
  ['closed-loop load (tải vòng kín)', 'Một số khách cố định, mỗi khách gửi request kế tiếp sau khi nhận trả lời.'],
  ['open-loop load (tải vòng mở)', 'Request được lên lịch theo tốc độ cố định, không phụ thuộc vào câu trả lời của máy chủ.'],
  ['coordinated omission (bỏ sót có phối hợp)', 'Máy tạo tải ngừng gửi khi máy chủ chậm, nên giai đoạn chậm bị lấy mẫu quá ít.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Làm nóng: JVM vòng 1 mất 158 ms, các vòng sau 45–77 ms. Bỏ những lượt làm nóng.</li>
<li>Báo cả độ dao động: hyperfine 398,5 ± 12,8 ms; tỉ số là 2,65 ± 0,22, không phải "2,65".</li>
<li>Best-of-N che nhiễu: tốt nhất 371 vs 369 ms, p90 399 vs 752 ms.</li>
<li>Coordinated omission: p99 vòng kín 0,1–0,2 ms vs p99 vòng mở ~189 ms trên cùng một máy chủ đứng hình; wrk hiệu chỉnh sau; k6 arrival-rate và wrk2 tránh được ngay từ đầu.</li>
<li>Luôn nêu môi trường, quy trình và mô hình vòng, và đưa p50/p95/p99 kèm thông lượng và lỗi.</li>
</ul>
${L('https://github.com/giltene/wrk2', '📏', 'wrk2 — wrk với thông lượng cố định', 'README giải thích coordinated omission và vì sao tốc độ quan trọng.', 'Mở')}
${L('https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/constant-arrival-rate/', '📈', 'Executor constant-arrival-rate của k6', 'Tải mô hình mở: số lượt cố định mỗi đơn vị thời gian, thêm VU khi cần.', 'Mở')}
${L('https://github.com/sharkdp/hyperfine', '⏱', 'hyperfine', 'Đo hiệu năng dòng lệnh có làm nóng, thống kê và so sánh.', 'Mở')}
</div>
`,
};

/* ───────────────────────── 15.7 — núm chỉnh ───────────────────────── */
const L157 = {
  title: '15.7 — Tuning knobs and when not to touch them: sysctl, ulimit, CPU governor and NUMA|||15.7 — Núm chỉnh và khi nào đừng đụng vào: sysctl, ulimit, CPU governor và NUMA',
  slug: 'os-15-3-sysctl',
  type: 'LESSON',
  isFreePreview: true,
  description: '1 845 núm sysctl, và năm luật trước khi vặn: tìm nút thắt trước, núm phải khớp bằng chứng, đổi một thứ một lần, đo trước/sau cùng một tải, biết phạm vi (net.* theo namespace, vm.* toàn máy). Đo thật: somaxconn 128 → 4096 với một máy chủ chậm accept (connect p50 3,1 s → 18 ms, 1 717 lần tràn hàng đợi → 0); ulimit -n 1024 → 65536 (giữ được 1 002 → 2 000 kết nối, và không có lỗi nào được báo); vm.swappiness/overcommit/dirty_* chỉ đọc vì dùng chung cả máy ảo; không có cpufreq, không có NUMA trong máy ảo — ghi rõ "không đo".',
  content: `${G157}
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.7</span>
<h2>Tuning knobs, and when not to touch them</h2>
<p class="lead">Linux exposes well over a thousand runtime knobs, and the internet is full of lists that promise a faster server if you paste them all into <code>/etc/sysctl.conf</code>. The question of this lesson: <strong>which knobs actually matter for a backend, how do you prove that a change helped — and when is the right answer to leave a knob alone?</strong> Two knobs are measured before and after on real failures; the others are labelled honestly as "not measured here" with the reason.</p>
${run('c157-knobs', 'sysctl -a')}

<h3>Five rules before you turn anything</h3>
<ol>
<li><strong>Find the bottleneck first</strong> (USE, lesson 15.1). A knob is a fix for a specific saturation or error you have seen.</li>
<li><strong>The knob must match the evidence</strong>: listen-queue overflows → backlog and <code>somaxconn</code>; <code>EMFILE</code> → file-descriptor limit; reclaim stalls → memory settings. No evidence, no change.</li>
<li><strong>One change at a time</strong>, with the same load before and after (lesson 15.6), so you know which change did what.</li>
<li><strong>Know the scope</strong>: <code>net.*</code> settings are per network namespace (each container has its own); <code>vm.*</code> and <code>kernel.*</code> are global to the machine; <code>ulimit</code> is per process; cgroup files are per container.</li>
<li><strong>Write it down and make it revertable</strong>: a file in <code>/etc/sysctl.d/</code> with a comment saying which measurement justified it — or a <code>docker run --sysctl</code>/<code>--ulimit</code> flag next to the service.</li>
</ol>

<h3>net.core.somaxconn: measured before and after</h3>
<p>A listening socket keeps finished handshakes in an <strong>accept queue</strong> until the program calls <code>accept()</code> (lesson 10.1). Its length is <code>min(backlog passed to listen(), net.core.somaxconn)</code>. When it is full, the kernel drops new handshakes and the client retries the SYN after 1 s, then 3 s, then 7 s. That only hurts when connections arrive faster than the program accepts them — for example a burst right after a restart, or during a long GC pause. <code>slowaccept.py</code> reproduces that: it listens with a backlog of 1 024 but does not accept for 3 seconds; <code>burst.py</code> opens 600 connections at once and times each <code>connect()</code>:</p>
${run('c157-knobs', 'sysctl net.core.somaxconn net.ipv4')}
${run('c157-knobs', 'sysctl -w net.core.somaxconn=128')}
${run('c157-knobs', "python3 slowaccept.py 9000")}
${run('c157-knobs', 'nstat -n; python3 burst.py 9000')}
${run('c157-knobs', 'sysctl -w net.core.somaxconn=4096')}
${run('c157-knobs', "python3 slowaccept.py 9001")}
${run('c157-knobs', 'nstat -n; python3 burst.py 9001')}
<table>
<tr><th>600 connections in a burst, server not accepting for 3 s</th><th>somaxconn = 128</th><th>somaxconn = 4096</th></tr>
<tr><td>effective queue (<code>ss</code> Send-Q)</td><td>128</td><td>1 024 (the program's backlog)</td></tr>
<tr><td>connect time p50 / p99</td><td><strong>3 099 / 3 112 ms</strong></td><td><strong>18 / 25 ms</strong></td></tr>
<tr><td>connections that waited ≥ 1 s</td><td>471</td><td>0</td></tr>
<tr><td>TcpExtListenOverflows</td><td>1 717</td><td>0</td></tr>
</table>
<p>With the queue capped at 128, 471 of the 600 clients had their SYN dropped, retried after 1 s (still full: the server was not accepting yet), and got in after the 3 s retry — the overflow counter counts every one of those drops, several per client. With 4 096, all 600 waited quietly in the queue. Two lessons hide in the table. First, the effective queue is the <em>smaller</em> of two numbers: raising <code>somaxconn</code> does nothing if the program asks for a small backlog — Node and nginx ask for 511, Python's <code>http.server</code> for 5 (lesson 10.1). Second, this knob is per network namespace, which is why the lab could change it safely inside its own container (<code>docker run --sysctl net.core.somaxconn=…</code> does the same without <code>--privileged</code>). It has been 4 096 by default since Linux 5.4, so on a modern kernel you more often need to raise the program's backlog than the sysctl.</p>
${lab('threadpool', 'overload', 'en', 'The same shape one level up: arrivals faster than the server takes them. A bounded queue overflows and work is turned away — which is what the accept queue does with SYNs.', { tour: 'threadpool-start' })}

<h3>ulimit -n: measured before and after</h3>
<p>Every connection is a file descriptor (lesson 10.1), and each process has a limit (<code>RLIMIT_NOFILE</code>, shown by <code>ulimit -n</code>). A WebSocket or SSE server holds one per client. <code>hold.js</code> accepts and holds every connection; <code>burst.py</code> opens 2 000 and keeps them for 4 seconds:</p>
${run('c157-knobs', '(ulimit -n 1024')}
${run('c157-knobs', '(ulimit -n 65536')}
<p>With the limit at 1 024 the server held <strong>1 002</strong> connections (the other ~22 descriptors are Node's own: stdio, epoll, the listening socket, internal pipes); with 65 536, all <strong>2 000</strong>. The worrying part is what did <em>not</em> happen: <strong>no error anywhere</strong>. Node emitted no event, and every one of the 2 000 clients saw its <code>connect()</code> succeed — the kernel completes the handshake before the program accepts. The ~1 000 connections that did not fit were, by libuv's documented EMFILE workaround (lesson 10.4), accepted and closed at once. The only trace on a real server is an <code>EMFILE</code> in <code>strace</code> or in nginx's error log. Set the limit where the service starts: <code>LimitNOFILE=</code> in a systemd unit, <code>--ulimit nofile=65536:65536</code> or <code>ulimits:</code> in Docker Compose. (<code>fs.file-max</code>, the system-wide ceiling, is effectively unlimited here and is not the limit that bites.)</p>
${lab('fdtable', 'emfile', 'en', 'What runs out at 1 024: the per-process file-descriptor table. Fill it, watch accept fail with EMFILE, then raise the limit.', { tour: 'fdtable-start' })}

<h3>Knobs we did not turn — and why</h3>
${run('c157-knobs', 'sysctl vm.swappiness')}
${run('c157-knobs', 'cat /sys/kernel/mm/transparent_hugepage/enabled')}
<p>These are global to the whole Docker Desktop VM, which other people's containers on this Mac share (a PostgreSQL, a Redis…). Changing them from a lab container would change the machine under them, so this lesson only reads them: <em>not measured here</em>. What each one does, and where it was measured safely:</p>
<ul>
<li><code>vm.swappiness</code> (60): how readily the kernel swaps anonymous memory instead of dropping page cache. Lesson 8.2 measured the same trade-off per cgroup with <code>memory.reclaim</code> and <code>swappiness=</code>. "Set it to 0 for databases" is advice that depends on having enough RAM — and on what you want to happen when you do not.</li>
<li><code>vm.overcommit_memory</code> (1 here: always allow): whether <code>malloc</code> may promise more than RAM + swap. Lesson 8.3 showed what 0/1/2 mean and who the OOM killer picks.</li>
<li><code>vm.dirty_ratio</code> / <code>dirty_background_ratio</code> (20 / 10): how much written data may wait in the page cache before writers are throttled. Lowering them smooths write bursts at the cost of throughput <em>(per the kernel documentation; not measured here)</em>.</li>
<li>Transparent huge pages (<code>always</code> here): fewer TLB misses, but latency spikes from compaction and memory bloat; Redis and several databases recommend <code>madvise</code> or <code>never</code> (lesson 7.2).</li>
</ul>
${run('c157-knobs', 'ls /sys/devices/system/cpu/cpu0/cpufreq')}
${run('c157-knobs', "lscpu | grep -E 'NUMA")}
<ul>
<li><strong>CPU frequency governor</strong>: the VM has no <code>cpufreq</code> directory — the host (macOS) controls frequency, so there is nothing to tune or measure. On bare-metal Linux, <code>performance</code> keeps cores at maximum frequency (lower latency, more power) while <code>powersave</code>/<code>schedutil</code> scale with load; most cloud VMs do not expose it either. <em>Not measured.</em></li>
<li><strong>NUMA</strong>: no <code>/sys/devices/system/node</code> — this kernel sees one memory node. On a two-socket server each CPU socket has its own RAM; memory on the other socket costs more to reach, so <code>numactl --hardware</code>, binding a database to one node or interleaving its memory, and the kernel's automatic NUMA balancing start to matter. <em>Conceptual only; not measured.</em></li>
</ul>

<h3>A table to keep</h3>
<table>
<tr><th>Knob</th><th>Scope</th><th>Here</th><th>Evidence that justifies changing it</th><th>Measured in this course</th></tr>
<tr><td><code>net.core.somaxconn</code> + app backlog</td><td>network namespace / socket</td><td>4096 / 511 (Node)</td><td><code>ListenOverflows</code> &gt; 0, Recv-Q at the limit, 1 s/3 s connect times</td><td>yes — this lesson</td></tr>
<tr><td><code>ulimit -n</code> (<code>LimitNOFILE</code>)</td><td>process</td><td>1 048 576 (container default)</td><td><code>EMFILE</code>, connections held = limit − ~20</td><td>yes — this lesson, 10.4</td></tr>
<tr><td><code>vm.swappiness</code></td><td>machine (or cgroup reclaim)</td><td>60</td><td>reclaim stalls, PSI memory, swap-in during latency spikes</td><td>8.2 (per cgroup)</td></tr>
<tr><td><code>vm.overcommit_memory</code></td><td>machine</td><td>1</td><td>allocation failures vs OOM kills you would rather have</td><td>8.3</td></tr>
<tr><td><code>vm.dirty_*</code></td><td>machine</td><td>20 / 10</td><td>writers stalled in balance_dirty_pages, write bursts</td><td>no</td></tr>
<tr><td>THP</td><td>machine</td><td>always</td><td>latency spikes in compaction, RSS bloat</td><td>7.2 (concept)</td></tr>
<tr><td>CPU governor, NUMA</td><td>machine</td><td>absent in this VM</td><td>frequency scaling visible in latency; remote-node memory access</td><td>no</td></tr>
</table>

<div class="pitfall co-tieu-de">
<p><strong>"I found a blog with 40 sysctl settings for a fast server and applied them all."</strong> Then nobody knows which one changed anything, several are global and affect every other service on the machine, and some are obsolete — <code>net.ipv4.tcp_tw_recycle</code> still appears in such lists although it was removed from Linux in 4.12 because it broke clients behind NAT <em>(per the kernel history; not run here)</em>. Measured in this lesson: the one knob that mattered for a connection burst changed p50 from 3.1 s to 18 ms; it would have been invisible among 40.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>"We raised somaxconn, the 1-second connects are still there."</strong> The queue is <code>min(backlog, somaxconn)</code>. If the program still asks <code>listen(…, 128)</code> (or Python's default 5), the sysctl changes nothing. Check <code>ss -lnt</code>: the Send-Q column of a LISTEN socket is the effective limit.</p>
</div>

<h3>🧪 Practice (40 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> after every deploy, the first minute shows 502 errors in nginx and some clients take "exactly 1 or 3 seconds" to connect to the Node API; later traffic is fine.</p>
<ol>
<li>Reproduce with <code>slowaccept.py</code> and <code>burst.py</code> in a <code>--privileged</code> lab container (or <code>docker run --sysctl net.core.somaxconn=128</code>). Record <code>nstat</code> overflow counters and connect-time percentiles.</li>
<li>Change only the program's backlog (second argument of <code>slowaccept.py</code>) to 128 with somaxconn 4096: same result? Then restore 1024 and raise somaxconn.</li>
<li>Run <code>hold.js</code> under <code>ulimit -n 1024</code> and 65536 with 2 000 clients; find the evidence of the limit with <code>strace -f -e accept4 -p</code> (lesson 11.3).</li>
<li>Write the two changes you would make to the real service (systemd/Compose lines), each with the measurement that justifies it.</li>
</ol>
<p><strong>Done when:</strong> you have a before/after table for both knobs from your own runs, and a one-line justification next to each config change.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['sysctl', 'Interface to kernel runtime parameters under /proc/sys (sysctl -w, /etc/sysctl.d/).'],
  ['accept queue / backlog', 'Completed handshakes waiting for accept(); length = min(listen backlog, somaxconn).'],
  ['ListenOverflows', 'Counter of connections dropped because the accept queue was full (nstat, netstat -s).'],
  ['RLIMIT_NOFILE (ulimit -n)', 'Per-process limit on open file descriptors; exceeded ⇒ EMFILE.'],
  ['namespaced vs global knob', 'net.* settings live per network namespace; vm.* and kernel.* apply to the whole machine.'],
  ['CPU frequency governor', 'Policy that scales CPU clock speed (performance, schedutil, powersave).'],
  ['NUMA', 'Non-uniform memory access: each socket has local RAM; remote memory is slower.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Change a knob only for a measured saturation or error, one at a time, with the same load before and after.</li>
<li>somaxconn 128 → 4096 on a connection burst: connect p50 3 099 → 18 ms, ListenOverflows 1 717 → 0; the effective queue is min(backlog, somaxconn).</li>
<li>ulimit -n 1024 → 65536: held connections 1 002 → 2 000 — and the limit produced no visible error at all.</li>
<li><code>vm.*</code>, THP: global to the shared VM, read only, "not measured" (Ch7–8 measured the cgroup-level versions).</li>
<li>No cpufreq and no NUMA nodes in the VM: governor and NUMA stay conceptual here.</li>
</ul>
${L('https://docs.kernel.org/networking/ip-sysctl.html', '🐧', 'IP sysctl — kernel.org', 'Every net.ipv4/net.core knob, with defaults and meaning.', 'Open')}
${L('https://docs.kernel.org/admin-guide/sysctl/vm.html', '🐧', 'vm sysctl — kernel.org', 'swappiness, overcommit_memory, dirty_ratio and the rest of /proc/sys/vm.', 'Open')}
${L('https://man7.org/linux/man-pages/man2/listen.2.html', '📗', 'listen(2) — man7.org', 'The backlog argument and its cap by somaxconn.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.7</span>
<h2>Núm chỉnh, và khi nào đừng đụng vào</h2>
<p class="lead">Linux có hơn một nghìn núm chỉnh lúc chạy, và Internet đầy những danh sách hứa hẹn máy chủ nhanh hơn nếu bạn dán tất cả vào <code>/etc/sysctl.conf</code>. Câu hỏi của bài: <strong>những núm nào thật sự quan trọng với backend, làm sao chứng minh một thay đổi có ích — và khi nào câu trả lời đúng là để yên núm đó?</strong> Hai núm được đo trước và sau trên những lỗi thật; các núm còn lại được ghi trung thực là "không đo ở đây" kèm lý do.</p>
${run('c157-knobs', 'sysctl -a')}

<h3>Năm luật trước khi vặn bất cứ thứ gì</h3>
<ol>
<li><strong>Tìm nút thắt trước</strong> (USE, bài 15.1). Một núm là cách sửa cho một sự bão hoà hay một lỗi cụ thể bạn đã thấy.</li>
<li><strong>Núm phải khớp với bằng chứng</strong>: tràn hàng đợi listen → backlog và <code>somaxconn</code>; <code>EMFILE</code> → giới hạn file descriptor; nghẽn khi thu hồi trang → các thiết lập bộ nhớ. Không có bằng chứng thì không đổi.</li>
<li><strong>Đổi một thứ mỗi lần</strong>, với cùng một tải trước và sau (bài 15.6), để biết thay đổi nào làm gì.</li>
<li><strong>Biết phạm vi</strong>: thiết lập <code>net.*</code> theo từng network namespace (mỗi container có bản riêng); <code>vm.*</code> và <code>kernel.*</code> áp cho cả máy; <code>ulimit</code> theo từng tiến trình; tệp cgroup theo từng container.</li>
<li><strong>Ghi lại và để hoàn tác được</strong>: một tệp trong <code>/etc/sysctl.d/</code> có chú thích phép đo nào biện minh cho nó — hoặc một cờ <code>docker run --sysctl</code>/<code>--ulimit</code> nằm ngay cạnh dịch vụ.</li>
</ol>

<h3>net.core.somaxconn: đo trước và sau</h3>
<p>Một socket đang nghe giữ các lần bắt tay đã xong trong một <strong>hàng đợi accept</strong> cho tới khi chương trình gọi <code>accept()</code> (bài 10.1). Độ dài của nó là <code>min(backlog truyền cho listen(), net.core.somaxconn)</code>. Khi hàng đợi đầy, nhân bỏ những lần bắt tay mới và khách gửi lại SYN sau 1 s, rồi 3 s, rồi 7 s. Điều đó chỉ gây hại khi kết nối đến nhanh hơn chương trình nhận — ví dụ một đợt dồn ngay sau khi khởi động lại, hay trong một lần dọn rác dài. <code>slowaccept.py</code> tái hiện đúng chuyện đó: nó nghe với backlog 1 024 nhưng 3 giây đầu không accept; <code>burst.py</code> mở 600 kết nối cùng lúc và bấm giờ từng lần <code>connect()</code>:</p>
${run('c157-knobs', 'sysctl net.core.somaxconn net.ipv4')}
${run('c157-knobs', 'sysctl -w net.core.somaxconn=128')}
${run('c157-knobs', "python3 slowaccept.py 9000")}
${run('c157-knobs', 'nstat -n; python3 burst.py 9000')}
${run('c157-knobs', 'sysctl -w net.core.somaxconn=4096')}
${run('c157-knobs', "python3 slowaccept.py 9001")}
${run('c157-knobs', 'nstat -n; python3 burst.py 9001')}
<table>
<tr><th>600 kết nối dồn một lúc, máy chủ 3 s không accept</th><th>somaxconn = 128</th><th>somaxconn = 4096</th></tr>
<tr><td>hàng đợi hiệu dụng (<code>ss</code> Send-Q)</td><td>128</td><td>1 024 (backlog của chương trình)</td></tr>
<tr><td>thời gian connect p50 / p99</td><td><strong>3 099 / 3 112 ms</strong></td><td><strong>18 / 25 ms</strong></td></tr>
<tr><td>số kết nối phải chờ ≥ 1 s</td><td>471</td><td>0</td></tr>
<tr><td>TcpExtListenOverflows</td><td>1 717</td><td>0</td></tr>
</table>
<p>Khi hàng đợi bị chặn ở 128, 471 trong 600 khách bị bỏ SYN, gửi lại sau 1 s (vẫn đầy: máy chủ chưa accept), và vào được sau lần gửi lại ở giây thứ 3 — bộ đếm tràn đếm từng lần bị bỏ đó, vài lần cho mỗi khách. Với 4 096, cả 600 nằm chờ yên trong hàng đợi. Bảng này giấu hai bài học. Một, hàng đợi hiệu dụng là số <em>nhỏ hơn</em> trong hai số: nâng <code>somaxconn</code> chẳng làm gì nếu chương trình xin một backlog nhỏ — Node và nginx xin 511, <code>http.server</code> của Python xin 5 (bài 10.1). Hai, núm này theo từng network namespace, nên lab đổi nó an toàn ngay trong container riêng của mình (<code>docker run --sysctl net.core.somaxconn=…</code> làm được điều tương tự mà không cần <code>--privileged</code>). Nó mặc định là 4 096 từ Linux 5.4, nên trên nhân hiện đại bạn thường cần nâng backlog của chương trình hơn là sysctl.</p>
${lab('threadpool', 'overload', 'vi', 'Cùng hình dạng ở tầng cao hơn: việc đến nhanh hơn máy chủ nhận. Một hàng đợi có giới hạn sẽ tràn và việc bị từ chối — đúng như hàng đợi accept làm với SYN.', { tour: 'threadpool-start' })}

<h3>ulimit -n: đo trước và sau</h3>
<p>Mỗi kết nối là một file descriptor (bài 10.1), và mỗi tiến trình có một giới hạn (<code>RLIMIT_NOFILE</code>, xem bằng <code>ulimit -n</code>). Một máy chủ WebSocket hay SSE giữ mỗi khách một cái. <code>hold.js</code> nhận và giữ mọi kết nối; <code>burst.py</code> mở 2 000 kết nối và giữ chúng 4 giây:</p>
${run('c157-knobs', '(ulimit -n 1024')}
${run('c157-knobs', '(ulimit -n 65536')}
<p>Với giới hạn 1 024, máy chủ giữ được <strong>1 002</strong> kết nối (khoảng 22 descriptor còn lại là của chính Node: stdio, epoll, socket nghe, các ống nội bộ); với 65 536, đủ cả <strong>2 000</strong>. Điều đáng lo là những gì <em>không</em> xảy ra: <strong>không có lỗi nào ở đâu cả</strong>. Node không phát sự kiện nào, và cả 2 000 khách đều thấy <code>connect()</code> thành công — nhân hoàn tất bắt tay trước khi chương trình accept. Khoảng 1 000 kết nối không vừa, theo mẹo xử lý EMFILE đã biết của libuv (bài 10.4), bị accept rồi đóng ngay. Dấu vết duy nhất trên một máy chủ thật là một <code>EMFILE</code> trong <code>strace</code> hay trong log lỗi của nginx. Hãy đặt giới hạn ở nơi dịch vụ khởi động: <code>LimitNOFILE=</code> trong unit systemd, <code>--ulimit nofile=65536:65536</code> hoặc <code>ulimits:</code> trong Docker Compose. (<code>fs.file-max</code>, trần toàn hệ thống, ở đây gần như vô hạn và không phải giới hạn gây chuyện.)</p>
${lab('fdtable', 'emfile', 'vi', 'Thứ cạn ở mốc 1 024: bảng file descriptor của từng tiến trình. Đổ đầy nó, xem accept hỏng với EMFILE, rồi nâng giới hạn.', { tour: 'fdtable-start' })}

<h3>Những núm ta không vặn — và vì sao</h3>
${run('c157-knobs', 'sysctl vm.swappiness')}
${run('c157-knobs', 'cat /sys/kernel/mm/transparent_hugepage/enabled')}
<p>Những thứ này là của toàn bộ máy ảo Docker Desktop, nơi container của người khác trên máy Mac này cũng đang chạy (một PostgreSQL, một Redis…). Đổi chúng từ một container lab là đổi cả cái máy dưới chân họ, nên bài này chỉ đọc: <em>không đo ở đây</em>. Mỗi núm làm gì, và nó đã được đo an toàn ở đâu:</p>
<ul>
<li><code>vm.swappiness</code> (60): nhân sẵn lòng swap bộ nhớ ẩn danh tới mức nào thay vì bỏ page cache. Bài 8.2 đã đo cùng sự đánh đổi đó theo cgroup bằng <code>memory.reclaim</code> với <code>swappiness=</code>. "Đặt 0 cho cơ sở dữ liệu" là lời khuyên phụ thuộc vào việc có đủ RAM — và vào điều bạn muốn xảy ra khi không đủ.</li>
<li><code>vm.overcommit_memory</code> (ở đây là 1: luôn cho): <code>malloc</code> có được hứa nhiều hơn RAM + swap hay không. Bài 8.3 đã cho thấy 0/1/2 nghĩa là gì và OOM killer chọn ai.</li>
<li><code>vm.dirty_ratio</code> / <code>dirty_background_ratio</code> (20 / 10): dữ liệu đã ghi được nằm chờ trong page cache tới mức nào trước khi người ghi bị bóp. Hạ chúng xuống làm mượt những đợt ghi dồn, đổi lại giảm thông lượng <em>(theo tài liệu của nhân; không đo ở đây)</em>.</li>
<li>Transparent huge pages (ở đây <code>always</code>): ít TLB miss hơn, nhưng có những cú vọt độ trễ do gom trang và phình bộ nhớ; Redis và vài cơ sở dữ liệu khuyên <code>madvise</code> hoặc <code>never</code> (bài 7.2).</li>
</ul>
${run('c157-knobs', 'ls /sys/devices/system/cpu/cpu0/cpufreq')}
${run('c157-knobs', "lscpu | grep -E 'NUMA")}
<ul>
<li><strong>CPU frequency governor</strong> (bộ điều tốc CPU): máy ảo không có thư mục <code>cpufreq</code> — máy chủ (macOS) điều khiển tần số, nên không có gì để chỉnh hay đo. Trên Linux chạy thẳng trên phần cứng, <code>performance</code> giữ lõi ở tần số tối đa (độ trễ thấp hơn, tốn điện hơn) còn <code>powersave</code>/<code>schedutil</code> co giãn theo tải; phần lớn VM trên cloud cũng không lộ ra núm này. <em>Không đo.</em></li>
<li><strong>NUMA</strong>: không có <code>/sys/devices/system/node</code> — nhân này chỉ thấy một nút bộ nhớ. Trên máy chủ hai socket, mỗi socket CPU có RAM riêng; với tới bộ nhớ của socket bên kia tốn hơn, nên <code>numactl --hardware</code>, ghim một cơ sở dữ liệu vào một nút hay rải đều bộ nhớ của nó, và cơ chế tự cân bằng NUMA của nhân bắt đầu quan trọng. <em>Chỉ ở mức khái niệm; không đo.</em></li>
</ul>

<h3>Một bảng để giữ lại</h3>
<table>
<tr><th>Núm</th><th>Phạm vi</th><th>Ở đây</th><th>Bằng chứng biện minh cho việc đổi</th><th>Đã đo trong khoá</th></tr>
<tr><td><code>net.core.somaxconn</code> + backlog của app</td><td>network namespace / socket</td><td>4096 / 511 (Node)</td><td><code>ListenOverflows</code> &gt; 0, Recv-Q chạm giới hạn, connect mất 1 s/3 s</td><td>có — bài này</td></tr>
<tr><td><code>ulimit -n</code> (<code>LimitNOFILE</code>)</td><td>tiến trình</td><td>1 048 576 (mặc định container)</td><td><code>EMFILE</code>, số kết nối giữ được = giới hạn − ~20</td><td>có — bài này, 10.4</td></tr>
<tr><td><code>vm.swappiness</code></td><td>cả máy (hoặc thu hồi theo cgroup)</td><td>60</td><td>nghẽn thu hồi trang, PSI memory, swap-in trong lúc độ trễ vọt</td><td>8.2 (theo cgroup)</td></tr>
<tr><td><code>vm.overcommit_memory</code></td><td>cả máy</td><td>1</td><td>cấp phát hỏng vs OOM kill — bạn muốn cái nào hơn</td><td>8.3</td></tr>
<tr><td><code>vm.dirty_*</code></td><td>cả máy</td><td>20 / 10</td><td>người ghi bị chặn trong balance_dirty_pages, đợt ghi dồn</td><td>không</td></tr>
<tr><td>THP</td><td>cả máy</td><td>always</td><td>độ trễ vọt khi gom trang, RSS phình</td><td>7.2 (khái niệm)</td></tr>
<tr><td>CPU governor, NUMA</td><td>cả máy</td><td>không có trong VM này</td><td>co giãn tần số thấy được trên độ trễ; truy cập bộ nhớ nút xa</td><td>không</td></tr>
</table>

<div class="pitfall co-tieu-de">
<p><strong>"Mình tìm được một blog có 40 thiết lập sysctl cho máy chủ nhanh và áp hết."</strong> Rồi không ai biết thiết lập nào đã thay đổi điều gì, vài cái là toàn cục và ảnh hưởng mọi dịch vụ khác trên máy, và có cái đã lỗi thời — <code>net.ipv4.tcp_tw_recycle</code> vẫn xuất hiện trong những danh sách như thế dù đã bị gỡ khỏi Linux từ bản 4.12 vì làm hỏng các máy khách sau NAT <em>(theo lịch sử của nhân; không chạy ở đây)</em>. Đo trong bài: núm duy nhất có tác dụng với một đợt kết nối dồn đã đổi p50 từ 3,1 s xuống 18 ms; giữa 40 núm, nó sẽ vô hình.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>"Đã nâng somaxconn mà vẫn có những lần connect mất 1 giây."</strong> Hàng đợi là <code>min(backlog, somaxconn)</code>. Nếu chương trình vẫn xin <code>listen(…, 128)</code> (hoặc mặc định 5 của Python), sysctl chẳng đổi được gì. Hãy kiểm <code>ss -lnt</code>: cột Send-Q của socket LISTEN là giới hạn hiệu dụng.</p>
</div>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> sau mỗi lần deploy, phút đầu tiên nginx báo lỗi 502 và một số khách mất "đúng 1 hoặc 3 giây" mới kết nối được tới API Node; sau đó thì ổn.</p>
<ol>
<li>Tái hiện bằng <code>slowaccept.py</code> và <code>burst.py</code> trong một container lab <code>--privileged</code> (hoặc <code>docker run --sysctl net.core.somaxconn=128</code>). Ghi bộ đếm tràn của <code>nstat</code> và các phân vị thời gian connect.</li>
<li>Chỉ đổi backlog của chương trình (đối số thứ hai của <code>slowaccept.py</code>) thành 128 với somaxconn 4096: kết quả có giống không? Rồi trả về 1024 và nâng somaxconn.</li>
<li>Chạy <code>hold.js</code> dưới <code>ulimit -n 1024</code> và 65536 với 2 000 khách; tìm bằng chứng của giới hạn bằng <code>strace -f -e accept4 -p</code> (bài 11.3).</li>
<li>Viết hai thay đổi bạn sẽ làm cho dịch vụ thật (dòng systemd/Compose), mỗi thay đổi kèm phép đo biện minh cho nó.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có bảng trước/sau cho cả hai núm từ lượt chạy của chính mình, và một dòng biện minh cạnh mỗi thay đổi cấu hình.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['sysctl', 'Giao diện tới các tham số chạy của nhân dưới /proc/sys (sysctl -w, /etc/sysctl.d/).'],
  ['accept queue / backlog (hàng đợi accept)', 'Các lần bắt tay đã xong đang chờ accept(); độ dài = min(backlog của listen, somaxconn).'],
  ['ListenOverflows', 'Bộ đếm số kết nối bị bỏ vì hàng đợi accept đầy (nstat, netstat -s).'],
  ['RLIMIT_NOFILE (ulimit -n)', 'Giới hạn số file descriptor mở của mỗi tiến trình; vượt ⇒ EMFILE.'],
  ['namespaced vs global knob (núm theo namespace vs toàn cục)', 'Thiết lập net.* nằm theo từng network namespace; vm.* và kernel.* áp cho cả máy.'],
  ['CPU frequency governor (bộ điều tốc CPU)', 'Chính sách co giãn xung nhịp CPU (performance, schedutil, powersave).'],
  ['NUMA', 'Truy cập bộ nhớ không đồng nhất: mỗi socket có RAM gần; bộ nhớ ở xa chậm hơn.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chỉ đổi một núm khi có một sự bão hoà hay lỗi đã đo được, mỗi lần một thứ, với cùng một tải trước và sau.</li>
<li>somaxconn 128 → 4096 với một đợt kết nối dồn: connect p50 3 099 → 18 ms, ListenOverflows 1 717 → 0; hàng đợi hiệu dụng là min(backlog, somaxconn).</li>
<li>ulimit -n 1024 → 65536: số kết nối giữ được 1 002 → 2 000 — và giới hạn đó không sinh ra lỗi nào nhìn thấy được.</li>
<li><code>vm.*</code>, THP: toàn cục trên máy ảo dùng chung, chỉ đọc, "không đo" (Ch7–8 đã đo các phiên bản ở mức cgroup).</li>
<li>Máy ảo không có cpufreq và không có nút NUMA: governor và NUMA ở đây chỉ là khái niệm.</li>
</ul>
${L('https://docs.kernel.org/networking/ip-sysctl.html', '🐧', 'IP sysctl — kernel.org', 'Mọi núm net.ipv4/net.core, kèm giá trị mặc định và ý nghĩa.', 'Mở')}
${L('https://docs.kernel.org/admin-guide/sysctl/vm.html', '🐧', 'vm sysctl — kernel.org', 'swappiness, overcommit_memory, dirty_ratio và phần còn lại của /proc/sys/vm.', 'Mở')}
${L('https://man7.org/linux/man-pages/man2/listen.2.html', '📗', 'listen(2) — man7.org', 'Đối số backlog và việc nó bị somaxconn chặn trần.', 'Mở')}
</div>
`,
};

/* ───────────────────────── 15.8 — một câu chuyện tinh chỉnh trọn vẹn ───────────────────────── */
const L158 = {
  title: '15.8 — A tuning story end to end: measure, change one thing, verify|||15.8 — Một câu chuyện tinh chỉnh trọn vẹn: đo, đổi một thứ, kiểm lại',
  slug: 'os-15-4-phuong-phap',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Dịch vụ thanh toán checkout.js ghi nhật ký kiểm toán bền (fsync) cho từng đơn trên một ổ ngân sách 300 IOPS: ngày thường 200 req/s p99 6,4 ms, ngày sale 400 req/s p99 11,3 s. Đo: CPU 2%, luồng chính nằm ngoài CPU 1,77 s mỗi 2 s — 90% chờ writeback trong fsync. Giả thuyết A (UV_THREADPOOL_SIZE=64): không đổi gì ⇒ hoàn tác; B (fsync bất đồng bộ): p99 2,75 s, nghẽn chuyển sang ngân sách đĩa; C (group commit, vẫn trả lời sau fdatasync): p99 32,9 ms ở 400 req/s, 68 ms ở 800 req/s ⇒ giữ; kiểm độ bền (13 600 dòng = 13 600 đơn) và viết lại thành báo cáo.',
  content: `${G158}
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.8</span>
<h2>A tuning story, end to end</h2>
<p class="lead">This lesson puts the chapter together on one small service, the way a real incident goes: a symptom, measurements that point somewhere, hypotheses — one of them tempting and wrong — exactly one change at a time, verification under the same load, and a decision to keep or to revert. The question: <strong>can you take a service from "p99 is 11 seconds on sale day" to a fix you can defend with numbers, without guessing and without weakening what the service promises?</strong></p>

<h3>The service and its promise</h3>
<p><code>checkout.js</code> takes an order, does a little CPU work (checks the cart), writes one line to an <strong>audit log that must survive a crash</strong>, and only then answers "PAID". "Survive a crash" means the line must be on the disk before the answer, so the original version calls <code>fsyncSync</code> for every order. All three variants below keep that promise — they answer only after the line has been synced:</p>
${src('ch15/checkout.js', 'javascript')}
<p>The lab gives this container a disk budget of 300 write operations per second with a cgroup <code>io.max</code> rule (lesson 12.2) — the budget of a small cloud volume. The Docker Desktop VM's own disk is much faster; without the cap we would need thousands of requests per second to see the same story.</p>
${run('c158-story', 'echo "254:0 wiops=300"')}

<h3>1. Symptom: fine on a normal day, minutes of waiting on sale day</h3>
${run('c158-story', 'node tai.js http://127.0.0.1:8080/checkout --rate 200')}
${run('c158-story', 'cat /tmp/sale.txt')}
<p>RED, measured with an open-loop generator (lesson 15.6): at 200 requests/s, p99 is 6.4 ms. At 400 requests/s the service completes only <strong>298 per second</strong>, errors are 0, and latency explodes: p50 1.17 s, <strong>p99 11.3 s</strong>. Throughput stuck below the offered rate with exploding latency is the signature of a saturated resource. Which one?</p>

<h3>2. Measure: USE, then where the time goes</h3>
${run('c158-story', 'python3 use.py 2')}
${run('c158-story', 'pidstat -p $C')}
<p>CPU: the container uses 2% of the VM, and the checkout process (PID 107) 7–8% of one core. It is <strong>not</strong> CPU. Disk: the VM's device is busy only 9% of the time, but our cgroup's I/O pressure (PSI) is 16.7%: work is waiting for the <em>budget</em>, not for the device. A process that is slow and not busy is spending its time off the CPU — lesson 15.3's tool, aimed at the main thread only (<code>-t</code>, the event loop):</p>
${run('c158-story', 'G=$(gpid $C)')}
${run('c158-story', "sort -t' ' -k2 -nr off.folded")}
<p>In 2 seconds the event-loop thread spent <strong>1.77 s off the CPU</strong>: 90% in <code>io_schedule</code> waiting for its data to be written back, inside <code>ext4_sync_file</code> ← <code>vfs_fsync_range</code> ← <code>do_fsync</code>; 10% waiting for the journal commit. While it waits, no other request can be parsed, answered or even accepted — the event loop is blocked by a system call (lesson 3.5). And every request costs at least one write operation from a budget of 300 per second; at 400 per second the queue can only grow.</p>
${lab('threadpool', 'mm1', 'en', 'The queueing math of this incident: arrivals 400/s, service capacity ≈ 300/s. With utilisation above 1 the queue grows for as long as the load lasts — exactly the 11 s p99.', { tour: 'threadpool-start' })}

<h3>3. Hypothesis A — tempting, and wrong</h3>
<p>The first idea in the team chat: <em>"Node is single-threaded; give libuv more threads."</em> It is cheap to try, so try it — one change, same load:</p>
${run('c158-story', 'UV_THREADPOOL_SIZE=64 LOG=sync', 2)}
<p>p99 11.3 s → 12.7 s, throughput 298 → 292/s: no improvement (the difference is noise). <strong>Revert.</strong> And understand why, because that is the lesson: <code>fsyncSync</code> runs <em>on the event-loop thread</em>; the libuv pool only runs the asynchronous <code>fs</code> calls, and this code made none. The change did not match the evidence (lesson 15.7, rule 2).</p>

<h3>4. Hypothesis B — move the fsync off the event loop</h3>
${run('c158-story', 'LOG=async node checkout.js', 2)}
<p>With <code>fs.promises</code> the write and the <code>sync</code> run in the libuv pool, so the event loop stays free. p99 drops from 11.3 s to <strong>2.75 s</strong> — four times better, and still unacceptable. Throughput: 312/s, and <code>/stats</code> shows 4 000 syncs for 4 000 orders. The bottleneck <em>moved</em>: from the event loop to the disk budget. One sync per order cannot exceed ~300 orders per second, however many threads wait for them. B is better than the original, but it does not fix the problem.</p>
${lab('eventloop', 'block', 'en', 'What hypothesis B fixed: a synchronous call (here fsyncSync) holds the only JavaScript thread and every request waits behind it; moving it to the pool frees the loop.', { tour: 'eventloop-block' })}

<h3>5. Hypothesis C — group commit</h3>
<p>If one sync costs one write operation whatever it contains, make each sync carry many orders: collect the lines that arrive while a sync is in flight, write them together, call <code>fdatasync</code> once, then answer every order in that batch. Databases call this <strong>group commit</strong> (PostgreSQL's WAL works this way). The promise is unchanged: no order is answered before its line is on disk.</p>
${run('c158-story', 'LOG=group node checkout.js', 2)}
${run('c158-story', 'node tai.js http://127.0.0.1:8080/checkout --rate 800', 2)}
<p>At 400 requests/s: all 400 served per second, <strong>p99 32.9 ms</strong> (from 11.3 s), with 2 941 syncs for 4 000 orders. Doubling the load to 800/s: p99 68 ms, and 2 908 syncs for 8 000 orders — about 290 per second, right at the budget. The batches simply grow with the load (2.75 orders per sync at 800/s), which is why the latency stays bounded. That is the shape of a good fix: it changes the cost per request, not just who waits for it.</p>

<h3>6. Verify: the normal day, and the promise</h3>
${run('c158-story', 'tail -2 /var/tmp/audit.log')}
<p>Two checks before keeping a change. A normal day must not get worse — the 200 requests/s run right after the 800 (above) gives p99 8.6 ms against 6.4 ms with the original code: the same order of magnitude, within this shared machine's noise, though a batch can add a little latency at low load. And the promise must hold: the log has <strong>13 600 lines for 13 600 orders</strong> (4 000 + 8 000 + 1 600 in this server's lifetime) — nothing answered was lost, nothing was answered before it was written.</p>

<h3>7. Decide, and write it down</h3>
<table>
<tr><th>Change</th><th>Evidence it addressed</th><th>p99 at 400 req/s</th><th>Decision</th></tr>
<tr><td>— (baseline: fsyncSync per order)</td><td>—</td><td>11 341 ms, 298 req/s served</td><td>—</td></tr>
<tr><td>A: <code>UV_THREADPOOL_SIZE=64</code></td><td>none (the pool was not used)</td><td>12 722 ms</td><td><strong>revert</strong></td></tr>
<tr><td>B: async fsync per order</td><td>event loop blocked in fsync</td><td>2 755 ms, 312 req/s</td><td>superseded</td></tr>
<tr><td>C: group commit (fdatasync per batch)</td><td>one write op per order &gt; 300 IOPS budget</td><td><strong>32.9 ms</strong>, 400 req/s</td><td><strong>keep</strong></td></tr>
</table>
<p>What we deliberately did <em>not</em> try: dropping the <code>fsync</code> (fast, and it silently breaks the audit promise), tuning <code>vm.dirty_*</code> (an explicit fsync writes regardless of those thresholds), or mount options that disable write barriers (they trade correctness for speed). None of them was measured here, and none would be accepted for an audit log.</p>
<p>The write-up follows the postmortem shape of lesson 2.1: <strong>symptom</strong> (p99 11.3 s at 400 req/s, 298 served), <strong>measurements</strong> (CPU 2%, PSI io 16.7%, main thread 88% of its time off-CPU in fsync), <strong>hypotheses tried</strong> (A reverted, B superseded, C kept, each with numbers), <strong>fix</strong>, <strong>verification</strong> (normal day, 800 req/s, durability), <strong>follow-up</strong> (alert on PSI io and on syncs per second near the budget). Chapter 17 asks you to do this on an incident you did not plant yourself.</p>

<div class="pitfall co-tieu-de">
<p><strong>"We tried three settings together and it got faster."</strong> Then you do not know which one helped, which one did nothing (here: A) and which one made something else worse. Measured in this lesson: A alone changed nothing, B alone gave 4×, C alone 340×. One change at a time is slower to do and much faster to understand.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>"Just remove the fsync, the disk is fast."</strong> The device answers in microseconds (lesson 15.5); a durable write is what costs milliseconds. Removing it makes the benchmark look great and the audit log lose the last seconds of orders on a power cut. Fix the cost per request (batching), not the promise.</p>
</div>

<h3>🧪 Practice (60 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> you own <code>checkout.js</code>. Marketing announces a sale at 600 orders/s on the same 300-IOPS volume.</p>
<ol>
<li>Reproduce the baseline in a <code>--privileged</code> lab container with <code>io.max</code> as in <code>c158-story.sh</code>; record RED at 200 and 400 req/s with <code>tai.js --rate</code>.</li>
<li>Run USE (<code>use.py</code>, <code>pidstat</code>) and <code>offcputime -t</code> on the main thread; write the hypothesis in one sentence before changing anything.</li>
<li>Apply A, B and C one at a time with the same load; fill the decision table with your numbers.</li>
<li>With C, find the highest rate at which p99 stays under 100 ms. Predict it from "≈ 290 syncs/s × orders per sync" before you measure.</li>
<li>Prove durability: count lines in the audit log against orders served.</li>
</ol>
<p><strong>Done when:</strong> your decision table has measured numbers for every row, your prediction in step 4 is within ~30% of the measured limit, and your one-page write-up has the six parts above.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['hypothesis', 'A testable statement linking evidence to a cause, made before changing anything.'],
  ['one change at a time', 'Change one variable per measurement so the effect can be attributed.'],
  ['revert', 'Undo a change that did not improve the measured symptom — even if it "should" have.'],
  ['fsync / fdatasync', 'System calls that return only when data (and for fsync, metadata) are on stable storage.'],
  ['group commit', 'Batching many durable writes into one sync; each waits for the batch’s sync before being acknowledged.'],
  ['IOPS budget (io.max)', 'A cap on I/O operations per second for a cgroup, like the limit of a cloud volume.'],
  ['postmortem', 'A blameless write-up: symptom, impact, evidence, hypotheses, fix, verification, follow-ups.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Symptom: 400 req/s offered, 298 served, p99 11.3 s; normal day p99 6.4 ms.</li>
<li>Evidence: CPU 2%; PSI io 16.7%; event-loop thread 1.77 s of 2 s off-CPU, 90% inside fsync waiting for writeback.</li>
<li>A (more libuv threads): no change — revert; the evidence never pointed at the pool.</li>
<li>B (async fsync): p99 2.75 s; the bottleneck moved to one write per order vs a 300 IOPS budget.</li>
<li>C (group commit, same durability): p99 32.9 ms at 400/s, 68 ms at 800/s; 13 600 log lines for 13 600 orders. Keep — and write it up.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/fsync.2.html', '📗', 'fsync(2) — man7.org', 'fsync vs fdatasync, and what "on stable storage" promises.', 'Open')}
${L('https://www.postgresql.org/docs/current/runtime-config-wal.html', '🐘', 'PostgreSQL — Write Ahead Log settings', 'commit_delay, commit_siblings and synchronous_commit: group commit in a real database.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.8</span>
<h2>Một câu chuyện tinh chỉnh, trọn vẹn từ đầu tới cuối</h2>
<p class="lead">Bài này ráp cả chương lại trên một dịch vụ nhỏ, đúng như một sự cố thật diễn ra: một triệu chứng, những phép đo chỉ về một hướng, các giả thuyết — trong đó có một cái hấp dẫn mà sai — đúng một thay đổi mỗi lần, kiểm lại dưới cùng một tải, và một quyết định giữ hay hoàn tác. Câu hỏi: <strong>bạn có đưa được một dịch vụ từ "ngày sale p99 là 11 giây" tới một bản sửa bảo vệ được bằng số liệu, mà không đoán mò và không làm yếu đi lời hứa của dịch vụ?</strong></p>

<h3>Dịch vụ và lời hứa của nó</h3>
<p><code>checkout.js</code> nhận một đơn, làm một chút việc CPU (kiểm giỏ hàng), ghi một dòng vào <strong>nhật ký kiểm toán phải sống sót qua sự cố sập máy</strong>, rồi mới trả lời "PAID". "Sống sót qua sập máy" nghĩa là dòng đó phải nằm trên đĩa trước khi trả lời, nên bản gốc gọi <code>fsyncSync</code> cho mỗi đơn. Cả ba biến thể bên dưới đều giữ lời hứa đó — chúng chỉ trả lời sau khi dòng nhật ký đã được sync:</p>
${src('ch15/checkout.js', 'javascript')}
<p>Lab cho container này một ngân sách đĩa 300 lần ghi mỗi giây bằng một luật <code>io.max</code> của cgroup (bài 12.2) — ngân sách của một ổ cloud nhỏ. Đĩa của chính máy ảo Docker Desktop nhanh hơn nhiều; không có giới hạn này thì phải bắn hàng nghìn request mỗi giây mới thấy cùng câu chuyện.</p>
${run('c158-story', 'echo "254:0 wiops=300"')}

<h3>1. Triệu chứng: ngày thường ổn, ngày sale chờ hàng phút</h3>
${run('c158-story', 'node tai.js http://127.0.0.1:8080/checkout --rate 200')}
${run('c158-story', 'cat /tmp/sale.txt')}
<p>RED, đo bằng máy tạo tải vòng mở (bài 15.6): ở 200 request/giây, p99 là 6,4 ms. Ở 400 request/giây dịch vụ chỉ xong <strong>298 cái mỗi giây</strong>, lỗi bằng 0, còn độ trễ bùng nổ: p50 1,17 s, <strong>p99 11,3 s</strong>. Thông lượng kẹt dưới tốc độ đưa vào kèm độ trễ bùng nổ là chữ ký của một tài nguyên đã bão hoà. Tài nguyên nào?</p>

<h3>2. Đo: USE, rồi thời gian đi đâu</h3>
${run('c158-story', 'python3 use.py 2')}
${run('c158-story', 'pidstat -p $C')}
<p>CPU: container dùng 2% máy ảo, tiến trình checkout (PID 107) dùng 7–8% một lõi. <strong>Không phải</strong> tại CPU. Đĩa: thiết bị của máy ảo chỉ bận 9% thời gian, nhưng áp lực I/O (PSI) của cgroup ta là 16,7%: việc đang chờ <em>ngân sách</em>, không phải chờ thiết bị. Một tiến trình chậm mà không bận là đang tiêu thời gian ngoài CPU — công cụ của bài 15.3, chĩa vào riêng luồng chính (<code>-t</code>, luồng event loop):</p>
${run('c158-story', 'G=$(gpid $C)')}
${run('c158-story', "sort -t' ' -k2 -nr off.folded")}
<p>Trong 2 giây, luồng event loop nằm <strong>1,77 s ngoài CPU</strong>: 90% ở <code>io_schedule</code> chờ dữ liệu của nó được ghi về đĩa, bên trong <code>ext4_sync_file</code> ← <code>vfs_fsync_range</code> ← <code>do_fsync</code>; 10% chờ lần commit journal. Trong lúc nó chờ, không request nào khác được phân tích, trả lời, thậm chí được nhận — event loop bị một lời gọi hệ thống chặn (bài 3.5). Và mỗi request tốn ít nhất một lần ghi trong ngân sách 300 lần mỗi giây; ở 400 request mỗi giây thì hàng đợi chỉ có thể dài ra.</p>
${lab('threadpool', 'mm1', 'vi', 'Phép tính xếp hàng của sự cố này: việc đến 400/giây, sức phục vụ ≈ 300/giây. Mức bận vượt 1 thì hàng đợi dài ra suốt thời gian còn tải — đúng như p99 11 giây.', { tour: 'threadpool-start' })}

<h3>3. Giả thuyết A — hấp dẫn, và sai</h3>
<p>Ý tưởng đầu tiên trong nhóm chat: <em>"Node đơn luồng mà; cho libuv thêm luồng đi."</em> Thử rẻ, nên cứ thử — một thay đổi, cùng một tải:</p>
${run('c158-story', 'UV_THREADPOOL_SIZE=64 LOG=sync', 2)}
<p>p99 11,3 s → 12,7 s, thông lượng 298 → 292/giây: không cải thiện (khác biệt chỉ là nhiễu). <strong>Hoàn tác.</strong> Và hiểu vì sao, vì đó mới là bài học: <code>fsyncSync</code> chạy <em>trên luồng event loop</em>; thread pool của libuv chỉ chạy các lời gọi <code>fs</code> bất đồng bộ, mà code này không có cái nào. Thay đổi không khớp với bằng chứng (bài 15.7, luật 2).</p>

<h3>4. Giả thuyết B — đưa fsync ra khỏi event loop</h3>
${run('c158-story', 'LOG=async node checkout.js', 2)}
<p>Với <code>fs.promises</code>, lần ghi và lần <code>sync</code> chạy trong thread pool của libuv, nên event loop được rảnh. p99 giảm từ 11,3 s xuống <strong>2,75 s</strong> — tốt hơn bốn lần, và vẫn không chấp nhận được. Thông lượng: 312/giây, và <code>/stats</code> cho thấy 4 000 lần sync cho 4 000 đơn. Nút thắt đã <em>dời chỗ</em>: từ event loop sang ngân sách đĩa. Mỗi đơn một lần sync thì không thể vượt ~300 đơn mỗi giây, dù có bao nhiêu luồng ngồi chờ. B tốt hơn bản gốc, nhưng không sửa được vấn đề.</p>
${lab('eventloop', 'block', 'vi', 'Thứ mà giả thuyết B sửa được: một lời gọi đồng bộ (ở đây là fsyncSync) chiếm luồng JavaScript duy nhất và mọi request phải chờ sau nó; chuyển nó sang pool là giải phóng vòng lặp.', { tour: 'eventloop-block' })}

<h3>5. Giả thuyết C — group commit</h3>
<p>Nếu một lần sync tốn một lần ghi bất kể nó chở gì, hãy để mỗi lần sync chở nhiều đơn: gom các dòng đến trong lúc một lần sync đang chạy, ghi chúng cùng nhau, gọi <code>fdatasync</code> một lần, rồi trả lời mọi đơn trong nhóm đó. Cơ sở dữ liệu gọi đó là <strong>group commit</strong> (WAL của PostgreSQL làm như vậy). Lời hứa không đổi: không đơn nào được trả lời trước khi dòng của nó nằm trên đĩa.</p>
${run('c158-story', 'LOG=group node checkout.js', 2)}
${run('c158-story', 'node tai.js http://127.0.0.1:8080/checkout --rate 800', 2)}
<p>Ở 400 request/giây: phục vụ đủ 400 mỗi giây, <strong>p99 32,9 ms</strong> (từ 11,3 s), với 2 941 lần sync cho 4 000 đơn. Gấp đôi tải lên 800/giây: p99 68 ms, và 2 908 lần sync cho 8 000 đơn — khoảng 290 mỗi giây, sát đúng ngân sách. Các nhóm đơn giản là lớn dần theo tải (2,75 đơn mỗi lần sync ở 800/giây), vì thế độ trễ vẫn bị chặn. Đó là hình dạng của một bản sửa tốt: nó đổi chi phí cho mỗi request, chứ không chỉ đổi ai phải ngồi chờ.</p>

<h3>6. Kiểm: ngày thường, và lời hứa</h3>
${run('c158-story', 'tail -2 /var/tmp/audit.log')}
<p>Hai phép kiểm trước khi giữ một thay đổi. Ngày thường không được tệ đi — lượt 200 request/giây ngay sau lượt 800 (ở trên) cho p99 8,6 ms so với 6,4 ms của code gốc: cùng cỡ, trong độ nhiễu của máy dùng chung này, dù một nhóm có thể thêm chút độ trễ khi tải thấp. Và lời hứa phải còn nguyên: nhật ký có <strong>13 600 dòng cho 13 600 đơn</strong> (4 000 + 8 000 + 1 600 trong đời của máy chủ này) — không đơn nào đã trả lời bị mất, không đơn nào được trả lời trước khi được ghi.</p>

<h3>7. Quyết định, và ghi lại</h3>
<table>
<tr><th>Thay đổi</th><th>Bằng chứng nó nhắm tới</th><th>p99 ở 400 req/s</th><th>Quyết định</th></tr>
<tr><td>— (mốc: fsyncSync mỗi đơn)</td><td>—</td><td>11 341 ms, phục vụ 298 req/s</td><td>—</td></tr>
<tr><td>A: <code>UV_THREADPOOL_SIZE=64</code></td><td>không có (pool không được dùng)</td><td>12 722 ms</td><td><strong>hoàn tác</strong></td></tr>
<tr><td>B: fsync bất đồng bộ mỗi đơn</td><td>event loop bị chặn trong fsync</td><td>2 755 ms, 312 req/s</td><td>bị thay thế</td></tr>
<tr><td>C: group commit (fdatasync mỗi nhóm)</td><td>mỗi đơn một lần ghi &gt; ngân sách 300 IOPS</td><td><strong>32,9 ms</strong>, 400 req/s</td><td><strong>giữ</strong></td></tr>
</table>
<p>Những gì ta cố ý <em>không</em> thử: bỏ <code>fsync</code> (nhanh, và lặng lẽ phá lời hứa kiểm toán), chỉnh <code>vm.dirty_*</code> (một lần fsync tường minh vẫn ghi bất kể các ngưỡng đó), hay các tuỳ chọn mount tắt rào ghi (đổi tính đúng đắn lấy tốc độ). Không cái nào được đo ở đây, và không cái nào chấp nhận được cho một nhật ký kiểm toán.</p>
<p>Bản tường thuật theo khuôn postmortem của bài 2.1: <strong>triệu chứng</strong> (p99 11,3 s ở 400 req/s, phục vụ 298), <strong>số đo</strong> (CPU 2%, PSI io 16,7%, luồng chính 88% thời gian nằm ngoài CPU trong fsync), <strong>các giả thuyết đã thử</strong> (A hoàn tác, B bị thay thế, C giữ, mỗi cái kèm số), <strong>bản sửa</strong>, <strong>kiểm chứng</strong> (ngày thường, 800 req/s, độ bền), <strong>việc tiếp theo</strong> (cảnh báo theo PSI io và theo số lần sync mỗi giây khi sát ngân sách). Chương 17 sẽ yêu cầu bạn làm đúng như thế với một sự cố mà không phải bạn tự cài.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Tụi mình thử ba thiết lập cùng lúc và nó nhanh lên."</strong> Vậy thì bạn không biết cái nào có ích, cái nào chẳng làm gì (ở đây: A) và cái nào làm thứ khác tệ đi. Đo trong bài: riêng A không đổi gì, riêng B cho 4 lần, riêng C cho 340 lần. Mỗi lần đổi một thứ thì làm chậm hơn nhưng hiểu nhanh hơn nhiều.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>"Bỏ fsync đi, đĩa nhanh mà."</strong> Thiết bị trả lời trong vài micro giây (bài 15.5); thứ tốn hàng mili giây là một lần ghi bền. Bỏ nó đi thì benchmark trông tuyệt vời, còn nhật ký kiểm toán mất vài giây đơn hàng cuối cùng khi cúp điện. Hãy sửa chi phí cho mỗi request (gom nhóm), đừng sửa lời hứa.</p>
</div>

<h3>🧪 Thực hành (60 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> bạn phụ trách <code>checkout.js</code>. Bộ phận marketing thông báo một đợt sale 600 đơn/giây trên cùng ổ 300 IOPS.</p>
<ol>
<li>Tái hiện mốc ban đầu trong một container lab <code>--privileged</code> với <code>io.max</code> như <code>c158-story.sh</code>; ghi RED ở 200 và 400 req/s bằng <code>tai.js --rate</code>.</li>
<li>Chạy USE (<code>use.py</code>, <code>pidstat</code>) và <code>offcputime -t</code> trên luồng chính; viết giả thuyết trong một câu trước khi đổi bất cứ thứ gì.</li>
<li>Áp A, B và C từng cái một với cùng một tải; điền bảng quyết định bằng số của bạn.</li>
<li>Với C, tìm tốc độ cao nhất mà p99 vẫn dưới 100 ms. Dự đoán nó từ "≈ 290 lần sync/giây × số đơn mỗi lần sync" trước khi đo.</li>
<li>Chứng minh độ bền: đếm số dòng trong nhật ký kiểm toán so với số đơn đã phục vụ.</li>
</ol>
<p><strong>Đạt khi:</strong> bảng quyết định của bạn có số đo cho mọi dòng, dự đoán ở bước 4 lệch không quá ~30% so với giới hạn đo được, và bản tường thuật một trang của bạn có đủ sáu phần ở trên.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['hypothesis (giả thuyết)', 'Một mệnh đề kiểm được, nối bằng chứng với nguyên nhân, đặt ra trước khi đổi bất cứ thứ gì.'],
  ['one change at a time (mỗi lần một thay đổi)', 'Đổi một biến cho mỗi lần đo để quy được tác dụng về đúng nó.'],
  ['revert (hoàn tác)', 'Bỏ một thay đổi không cải thiện được triệu chứng đã đo — kể cả khi "lẽ ra" nó phải có ích.'],
  ['fsync / fdatasync', 'Lời gọi hệ thống chỉ trả về khi dữ liệu (và với fsync, cả siêu dữ liệu) đã nằm trên bộ lưu trữ bền.'],
  ['group commit (commit theo nhóm)', 'Gom nhiều lần ghi bền vào một lần sync; mỗi lần ghi chờ lần sync của nhóm rồi mới được xác nhận.'],
  ['IOPS budget (ngân sách IOPS, io.max)', 'Trần số thao tác I/O mỗi giây cho một cgroup, giống giới hạn của một ổ cloud.'],
  ['postmortem (báo cáo sau sự cố)', 'Bản tường thuật không đổ lỗi: triệu chứng, ảnh hưởng, bằng chứng, giả thuyết, bản sửa, kiểm chứng, việc tiếp theo.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Triệu chứng: đưa vào 400 req/s, phục vụ 298, p99 11,3 s; ngày thường p99 6,4 ms.</li>
<li>Bằng chứng: CPU 2%; PSI io 16,7%; luồng event loop nằm ngoài CPU 1,77 s mỗi 2 s, 90% bên trong fsync chờ ghi về đĩa.</li>
<li>A (thêm luồng libuv): không đổi gì — hoàn tác; bằng chứng chưa bao giờ chỉ vào pool.</li>
<li>B (fsync bất đồng bộ): p99 2,75 s; nút thắt dời sang chuyện mỗi đơn một lần ghi so với ngân sách 300 IOPS.</li>
<li>C (group commit, cùng độ bền): p99 32,9 ms ở 400/giây, 68 ms ở 800/giây; 13 600 dòng nhật ký cho 13 600 đơn. Giữ — và viết lại thành báo cáo.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/fsync.2.html', '📗', 'fsync(2) — man7.org', 'fsync vs fdatasync, và "nằm trên bộ lưu trữ bền" hứa hẹn điều gì.', 'Mở')}
${L('https://www.postgresql.org/docs/current/runtime-config-wal.html', '🐘', 'PostgreSQL — thiết lập Write Ahead Log', 'commit_delay, commit_siblings và synchronous_commit: group commit trong một cơ sở dữ liệu thật.', 'Mở')}
</div>
`,
};

/* ───────────────────────── 15.9 — Quiz ───────────────────────── */
const L159 = {
  title: '15.9 — Chapter 15 check: observing and tuning the OS|||15.9 — Kiểm tra Chương 15: quan sát và tinh chỉnh hệ điều hành',
  slug: 'os-15-9-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống trên chính các số đo của chương: USE/RED, flame graph, thời gian ngoài CPU, PID trong container, inline của JIT, khoảng hở Nagle, runqlat, coordinated omission, somaxconn và group commit.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Check</span>
<h2>Chapter 15 check: observe and tune</h2>
<p class="lead">Ten situations taken from the measurements of this chapter. Each question asks what you would conclude or do next — and each explanation says why the most tempting wrong answer is wrong.</p>
<h3>Self-check: I can…</h3>
<ul>
<li>run the 60-second checklist plus the cgroup files, fill a USE table, and compare server-side with client-side latency (RED);</li>
<li>record a CPU profile with perf or my runtime's profiler, fold it, read a flame graph, fix the hot path and profile again;</li>
<li>tell on-CPU from off-CPU problems by comparing CPU time with wall time, and find what threads wait for (offcputime, gdb snapshots);</li>
<li>use bpftrace one-liners and execsnoop, opensnoop, runqlat, tcplife — filtered to my container — and distrust an empty result;</li>
<li>benchmark with warm-up, percentiles and an open loop, change one knob at a time with before/after numbers, and write the result up.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Kiểm tra</span>
<h2>Kiểm tra Chương 15: quan sát và tinh chỉnh</h2>
<p class="lead">Mười tình huống lấy từ chính các số đo của chương. Mỗi câu hỏi bạn sẽ kết luận gì hoặc làm gì tiếp — và mỗi lời giải thích nói vì sao đáp án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm: tôi làm được…</h3>
<ul>
<li>chạy danh sách 60 giây cộng các tệp cgroup, điền bảng USE, và so độ trễ phía máy chủ với phía khách (RED);</li>
<li>ghi hồ sơ CPU bằng perf hoặc profiler của runtime, gập nó lại, đọc flame graph, sửa đường nóng rồi đo hồ sơ lại;</li>
<li>phân biệt vấn đề trên CPU với ngoài CPU bằng cách so thời gian CPU với thời gian thật, và tìm xem luồng đang chờ gì (offcputime, ảnh chụp gdb);</li>
<li>dùng bpftrace một dòng và execsnoop, opensnoop, runqlat, tcplife — lọc về container của mình — và không vội tin một kết quả rỗng;</li>
<li>đo hiệu năng có làm nóng, có phân vị và vòng mở, đổi từng núm một kèm số trước/sau, và viết lại kết quả.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'A Node API in a 2-CPU container is slow. use.py shows: container CPU 1.05 of 2 CPUs (52%), not throttled, PSI cpu 0%; the node main thread at 100% of one core. The server’s own log says /report p99 = 10.9 ms; clients measured p99 = 2.25 s and even /health p50 = 567 ms. What is the bottleneck?|||Một API Node trong container 2 CPU bị chậm. use.py cho thấy: CPU container 1,05 trên 2 CPU (52%), không bị bóp, PSI cpu 0%; luồng chính của node 100% một lõi. Log của chính máy chủ nói /report p99 = 10,9 ms; khách đo được p99 = 2,25 s và ngay cả /health p50 = 567 ms. Nút thắt là gì?',
        options: [
          'The container’s CPU quota — raise --cpus to 4|||Hạn mức CPU của container — nâng --cpus lên 4',
          'The disk — the logs are slow to write|||Đĩa — log ghi chậm',
          'The single event-loop thread, saturated by /report; requests queue in front of it|||Luồng event loop duy nhất, bị /report làm bão hoà; request xếp hàng phía trước nó',
          'Nothing — the server-side p99 of 10.9 ms is fine|||Không có gì — p99 phía máy chủ 10,9 ms là ổn',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: One thread at 100% while the cgroup still has a free CPU and is never throttled: the limit is the event loop, a software resource. Even /health is slow, so requests wait for something shared, before the handler’s timer starts — that is why the server sees 10.9 ms and clients 2.25 s. Raising --cpus (the tempting answer) gives a single thread nothing; the fix is a cheaper /report or more event loops.|||VI: Một luồng ở 100% trong khi cgroup vẫn còn dư một CPU và không hề bị bóp: giới hạn là event loop, một tài nguyên phần mềm. Ngay cả /health cũng chậm, nên request đang chờ một thứ dùng chung, trước khi đồng hồ của hàm xử lý bắt đầu chạy — vì thế máy chủ thấy 10,9 ms còn khách thấy 2,25 s. Nâng --cpus (đáp án hấp dẫn) chẳng cho một luồng đơn thêm gì; cách sửa là làm /report rẻ đi hoặc thêm event loop.',
      },
      {
        question: 'In the flame graph of hot.c, the box handle;parse_headers is drawn to the right of handle;crc_bitwise. What does that position tell you?|||Trong flame graph của hot.c, hộp handle;parse_headers được vẽ bên phải hộp handle;crc_bitwise. Vị trí đó cho bạn biết gì?',
        options: [
          'parse_headers ran after crc_bitwise|||parse_headers chạy sau crc_bitwise',
          'Nothing about time — boxes are sorted alphabetically; only the width (share of samples) has meaning|||Không nói gì về thời gian — các hộp được xếp theo chữ cái; chỉ bề rộng (phần trăm số mẫu) là có nghĩa',
          'parse_headers ran on another CPU|||parse_headers chạy trên một CPU khác',
          'parse_headers was called by crc_bitwise|||parse_headers được crc_bitwise gọi',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: A flame graph merges identical stacks by sorting frames alphabetically along the x-axis; "p" sorts after "c". Width is the share of samples (crc_bitwise 86.9%), height is stack depth (a box sits on its caller). The tempting "it ran later" reading needs a flame chart (time-ordered), not a flame graph.|||VI: Flame graph gộp những ngăn xếp giống nhau bằng cách xếp khung theo chữ cái dọc trục ngang; "p" đứng sau "c". Bề rộng là phần trăm số mẫu (crc_bitwise 86,9%), chiều cao là độ sâu ngăn xếp (hộp nằm trên hàm gọi nó). Cách đọc hấp dẫn "nó chạy sau" cần một flame chart (theo thời gian), không phải flame graph.',
      },
      {
        question: '8 worker threads; time ./wait inside prints real 1.622 s, user 0.612 s; the CPU profile says price_order = 96.7%. What should you do next?|||8 luồng worker; time ./wait inside in real 1,622 s, user 0,612 s; hồ sơ CPU nói price_order = 96,7%. Bạn nên làm gì tiếp?',
        options: [
          'Look off the CPU: offcputime or gdb snapshots, because wall time ≫ CPU time|||Nhìn ra ngoài CPU: offcputime hoặc ảnh chụp gdb, vì thời gian thật ≫ thời gian CPU',
          'Optimise price_order, the 96.7% hot spot|||Tối ưu price_order, điểm nóng 96,7%',
          'Add more threads to use all cores|||Thêm luồng để dùng hết các lõi',
          'Profile at a higher frequency (9999 Hz) to see more|||Lấy mẫu ở tần số cao hơn (9 999 Hz) để thấy nhiều hơn',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Eight threads were busy only 0.39 cores on average: most of the time is off-CPU, where a CPU profiler never samples. offcputime showed 87.8% of the waiting in futex (a lock) and gdb snapshots pointed at pthread_mutex_lock in worker. Optimising price_order to zero would still leave ≥ 1.2 s of serialised sleeps; sampling faster samples the same running code more often.|||VI: Tám luồng trung bình chỉ bận 0,39 lõi: phần lớn thời gian nằm ngoài CPU, nơi profiler CPU không bao giờ lấy mẫu. offcputime cho thấy 87,8% thời gian chờ ở futex (một cái khoá) và ảnh chụp gdb chỉ vào pthread_mutex_lock trong worker. Tối ưu price_order về không vẫn còn ≥ 1,2 s ngủ nối tiếp; lấy mẫu nhanh hơn chỉ là lấy mẫu cùng đoạn code đang chạy nhiều lần hơn.',
      },
      {
        question: 'Inside a privileged container, ./wait inside 600 & W=$! then offcputime-libbpf -p $W 3 prints no stacks at all, although the program is waiting most of the time. Why?|||Trong một container đặc quyền, ./wait inside 600 & W=$! rồi offcputime-libbpf -p $W 3 không in ra ngăn xếp nào, dù chương trình gần như lúc nào cũng chờ. Vì sao?',
        options: [
          'The program does not go off-CPU|||Chương trình không hề rời CPU',
          'The kernel has no BTF|||Nhân không có BTF',
          'offcputime only works on the host, never in containers|||offcputime chỉ chạy trên máy chủ, không bao giờ chạy trong container',
          '$W is the container’s PID; the eBPF program filters by the kernel’s PID, which is a different number|||$W là PID của container; chương trình eBPF lọc theo PID của nhân, là một con số khác',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: eBPF runs in the kernel and compares the global TGID; inside a PID namespace the same process has another number (156 vs 74736 in the lesson). Translating with bpftrace (curtask->tgid) made offcputime work in the same container — so "never in containers" is wrong, and the program was clearly off-CPU (175 voluntary switches per second per thread).|||VI: eBPF chạy trong nhân và so với TGID toàn cục; trong một PID namespace cùng tiến trình đó có một con số khác (156 so với 74736 trong bài). Đổi bằng bpftrace (curtask->tgid) thì offcputime chạy được ngay trong container đó — nên "không bao giờ chạy trong container" là sai, và chương trình rõ ràng có rời CPU (175 lần tự nhường CPU mỗi giây mỗi luồng).',
      },
      {
        question: 'node --cpu-prof on orders.js: uniqueCustomers has 0.7% self time, report has 83.2%, and the per-line ticks put 91.3% on line 24 (const customers = uniqueCustomers(list)). What is going on?|||node --cpu-prof trên orders.js: uniqueCustomers có 0,7% thời gian self, report có 83,2%, và số nhịp theo dòng đặt 91,3% vào dòng 24 (const customers = uniqueCustomers(list)). Chuyện gì đang xảy ra?',
        options: [
          'uniqueCustomers is cheap; report itself is slow|||uniqueCustomers rẻ; chính report chậm',
          'The JIT inlined uniqueCustomers into report, and the built-in includes is charged to its caller — uniqueCustomers is the hot path|||JIT đã inline uniqueCustomers vào report, và hàm dựng sẵn includes được tính cho hàm gọi nó — uniqueCustomers chính là đường nóng',
          'The profiler lost samples while the GC ran|||Profiler mất mẫu trong lúc GC chạy',
          'Line 24 is slow because of the event loop, not the code|||Dòng 24 chậm vì event loop, không phải vì code',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: TurboFan copies a small hot function into its caller, so its samples show up under the caller; V8 built-ins such as Array.prototype.includes are charged to the JavaScript frame that called them. Line ticks, --prof bottom-up (90.8% from report) and perf (Builtins_ArrayIncludesSmiOrObject 93%) all agree. Replacing the array with a Set took p50 from 10.6 to 0.9 ms — "report itself is slow" would have sent you to the wrong lines.|||VI: TurboFan chép một hàm nhỏ và nóng vào hàm gọi nó, nên mẫu của nó hiện dưới hàm gọi; các hàm dựng sẵn của V8 như Array.prototype.includes được tính cho khung JavaScript đã gọi chúng. Số nhịp theo dòng, --prof từ dưới lên (90,8% từ report) và perf (Builtins_ArrayIncludesSmiOrObject 93%) đều đồng ý. Thay mảng bằng Set đưa p50 từ 10,6 xuống 0,9 ms — "chính report chậm" sẽ dẫn bạn tới sai dòng.',
      },
      {
        question: 'Orders.java (JDK HttpServer): p50 latency 51.7 ms with one connection; the JVM used 1 170 ms of CPU for 96 requests in 5 s; async-profiler shows ArrayList.indexOfRange at 81%. What explains most of the latency, and how do you test it?|||Orders.java (JDK HttpServer): độ trễ p50 51,7 ms với một kết nối; JVM dùng 1 170 ms CPU cho 96 request trong 5 s; async-profiler cho thấy ArrayList.indexOfRange 81%. Điều gì giải thích phần lớn độ trễ, và kiểm nó thế nào?',
        options: [
          '~40 ms per request is off-CPU (headers and body in two writes: Nagle + delayed ACK); test with -Dsun.net.httpserver.nodelay=true|||~40 ms mỗi request nằm ngoài CPU (header và thân trong hai lần ghi: Nagle + ACK trễ); kiểm bằng -Dsun.net.httpserver.nodelay=true',
          'indexOfRange is 81% of 51.7 ms, so fixing it removes ~42 ms|||indexOfRange chiếm 81% của 51,7 ms, nên sửa nó bỏ được ~42 ms',
          'JIT warm-up; run longer|||JIT chưa làm nóng; chạy lâu hơn',
          'The 4-thread pool is too small; use 200 threads|||Pool 4 luồng quá nhỏ; dùng 200 luồng',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: CPU per request is 1 170 ÷ 96 = 12.2 ms, so a CPU profiler can explain at most 12 of the 51.7 ms — 81% is a share of CPU samples, not of latency. With TCP_NODELAY the p50 fell to 10.1 ms (≈ CPU per request), confirming the Nagle hypothesis; the Set then took it to 0.7 ms. The measurement was already warm (3 s warm-up), and with one connection a bigger pool changes nothing.|||VI: CPU mỗi request là 1 170 ÷ 96 = 12,2 ms, nên profiler CPU giải thích được tối đa 12 trong 51,7 ms — 81% là phần trăm số mẫu CPU, không phải của độ trễ. Bật TCP_NODELAY thì p50 giảm còn 10,1 ms (≈ CPU mỗi request), xác nhận giả thuyết Nagle; sau đó Set đưa nó xuống 0,7 ms. Phép đo đã được làm nóng (3 s), và với một kết nối thì pool lớn hơn chẳng đổi gì.',
      },
      {
        question: 'Two runs, both showing 100% CPU in top: 2 busy threads pinned to 2 cores, then 8. runqlat shows all wake-ups at 0–1 ms in the first run and a large hump at 8–15 ms in the second. What does runqlat measure?|||Hai lượt chạy, cả hai đều 100% CPU trong top: 2 luồng bận ghim vào 2 lõi, rồi 8 luồng. runqlat cho thấy mọi lần thức dậy đều 0–1 ms ở lượt đầu và một bướu lớn ở 8–15 ms ở lượt sau. runqlat đo cái gì?',
        options: [
          'CPU utilisation, per thread|||Mức bận CPU, theo từng luồng',
          'How long system calls take|||Các lời gọi hệ thống mất bao lâu',
          'Run-queue latency: time a thread is runnable but waiting for a CPU — the saturation of the CPU|||Độ trễ hàng đợi chạy: thời gian một luồng sẵn sàng chạy mà phải chờ CPU — sự bão hoà của CPU',
          'Time spent waiting for disk I/O|||Thời gian chờ I/O đĩa',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Utilisation is identical (100%) in both runs, so it cannot tell them apart; saturation can. runqlat histograms the delay between a wake-up and actually running: with 8 threads on 2 cores each waits behind three others (8–15 ms). Disk waits are off-CPU sleeps, not run-queue time.|||VI: Mức bận giống hệt nhau (100%) ở cả hai lượt, nên nó không phân biệt được chúng; sự bão hoà thì được. runqlat dựng histogram khoảng chờ từ lúc thức dậy tới lúc thật sự được chạy: với 8 luồng trên 2 lõi, mỗi luồng chờ sau ba luồng khác (8–15 ms). Chờ đĩa là ngủ ngoài CPU, không phải thời gian trong run queue.',
      },
      {
        question: 'stall.js answers in ~0.1 ms but freezes 200 ms every second. hey -c 1 reports p99 = 0.1 ms; k6 with constant-arrival-rate 100/s reports p99 = 189 ms. Which number describes users who arrive at 100 requests per second, and why?|||stall.js trả lời trong ~0,1 ms nhưng mỗi giây đứng hình 200 ms. hey -c 1 báo p99 = 0,1 ms; k6 với constant-arrival-rate 100/giây báo p99 = 189 ms. Con số nào mô tả người dùng đến với tốc độ 100 request/giây, và vì sao?',
        options: [
          'hey — it sent far more requests, so its percentiles are more accurate|||hey — nó gửi nhiều request hơn hẳn, nên phân vị của nó chính xác hơn',
          'Neither: you must average them|||Không cái nào: phải lấy trung bình hai con số',
          'hey — k6 adds its own overhead of ~190 ms|||hey — k6 tự cộng thêm chi phí ~190 ms của nó',
          'k6 — a closed-loop client stops sending during each freeze (coordinated omission), so the freezes are almost never sampled|||k6 — một khách vòng kín ngừng gửi trong mỗi lần đứng hình (coordinated omission), nên những lần đứng hình gần như không được lấy mẫu',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: With one connection, hey waits for each answer, so during a 200 ms freeze it sends one request instead of ~1 500; more samples of the good periods do not fix that bias. Open-loop tools (k6 arrival-rate, tai.js --rate) keep sending on schedule: about 20% of arrivals hit a freeze, giving p95 150 ms and p99 189 ms. k6’s own overhead is sub-millisecond (its p50 was 0.43 ms).|||VI: Với một kết nối, hey chờ từng câu trả lời, nên trong một lần đứng hình 200 ms nó chỉ gửi một request thay vì ~1 500; có thêm nhiều mẫu ở giai đoạn tốt cũng không sửa được độ lệch đó. Công cụ vòng mở (k6 arrival-rate, tai.js --rate) vẫn gửi đúng lịch: khoảng 20% lượt đến gặp lúc đứng hình, cho p95 150 ms và p99 189 ms. Chi phí riêng của k6 dưới một mili giây (p50 của nó là 0,43 ms).',
      },
      {
        question: 'A server calls listen(fd, 1024) but net.core.somaxconn = 128. It does not call accept() for 3 seconds while 600 clients connect at once. What connect-time median did the lab measure?|||Một máy chủ gọi listen(fd, 1024) nhưng net.core.somaxconn = 128. Nó không gọi accept() trong 3 giây trong khi 600 khách kết nối cùng lúc. Lab đã đo được trung vị thời gian connect là bao nhiêu?',
        options: [
          '≈ 18 ms — the backlog of 1024 is large enough|||≈ 18 ms — backlog 1024 đủ lớn',
          '≈ 1 s — every client retries once|||≈ 1 s — mỗi khách gửi lại một lần',
          '≈ 3.1 s — the queue is min(1024, 128); dropped SYNs are retried after 1 s (still full) and 3 s|||≈ 3,1 s — hàng đợi là min(1024, 128); SYN bị bỏ được gửi lại sau 1 s (vẫn đầy) và 3 s',
          'Most connections are refused with ECONNREFUSED|||Phần lớn kết nối bị từ chối với ECONNREFUSED',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: The effective accept queue is the smaller number, 128; 471 of 600 SYNs were dropped (not refused — no RST), retried at 1 s while the server was still not accepting, and got in after the 3 s retry: p50 3 099 ms, ListenOverflows 1 717. With somaxconn 4096 the same burst connected in 18 ms. 18 ms is the tempting answer if you forget the min().|||VI: Hàng đợi accept hiệu dụng là số nhỏ hơn, 128; 471 trên 600 SYN bị bỏ (không bị từ chối — không có RST), gửi lại ở giây thứ 1 khi máy chủ vẫn chưa accept, và vào được sau lần gửi lại ở giây thứ 3: p50 3 099 ms, ListenOverflows 1 717. Với somaxconn 4096 cùng đợt đó kết nối trong 18 ms. 18 ms là đáp án hấp dẫn nếu bạn quên chữ min().',
      },
      {
        question: 'checkout.js does fsyncSync for every order on a 300-IOPS volume; at 400 req/s p99 = 11.3 s. Which change fixed it while keeping "answer only after the audit line is on disk"?|||checkout.js gọi fsyncSync cho mỗi đơn trên một ổ 300 IOPS; ở 400 req/s p99 = 11,3 s. Thay đổi nào sửa được mà vẫn giữ "chỉ trả lời sau khi dòng kiểm toán đã nằm trên đĩa"?',
        options: [
          'UV_THREADPOOL_SIZE=64|||UV_THREADPOOL_SIZE=64',
          'Group commit: one write + one fdatasync per batch of waiting orders, then answer the whole batch|||Group commit: một lần ghi + một lần fdatasync cho mỗi nhóm đơn đang chờ, rồi trả lời cả nhóm',
          'Async fsync for each order (fs.promises)|||fsync bất đồng bộ cho từng đơn (fs.promises)',
          'Remove the fsync — the disk is fast|||Bỏ fsync — đĩa nhanh mà',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured: A (more libuv threads) did nothing (p99 12.7 s) because fsyncSync runs on the event loop, not in the pool; B (async fsync per order) freed the loop but still needed one write operation per order, so p99 stayed at 2.75 s; C cut the cost per order (2 941 syncs for 4 000 orders) and gave p99 32.9 ms at 400/s and 68 ms at 800/s, with 13 600 log lines for 13 600 orders. Removing fsync is fast and breaks the promise.|||VI: Đo được: A (thêm luồng libuv) không làm gì (p99 12,7 s) vì fsyncSync chạy trên event loop chứ không trong pool; B (fsync bất đồng bộ từng đơn) giải phóng vòng lặp nhưng vẫn cần một lần ghi cho mỗi đơn, nên p99 còn 2,75 s; C giảm chi phí mỗi đơn (2 941 lần sync cho 4 000 đơn) và cho p99 32,9 ms ở 400/giây, 68 ms ở 800/giây, với 13 600 dòng nhật ký cho 13 600 đơn. Bỏ fsync thì nhanh và phá lời hứa.',
      },
    ],
  },
};

export default {
  title: 'Chapter 15 — Observing and tuning the OS|||Chương 15 — Quan sát và tinh chỉnh hệ điều hành',
  description: 'Thấy được nhân đang làm gì với chương trình của bạn, rồi sửa có bằng chứng: phương pháp USE + RED và danh sách 60 giây chạy thật trên một container quá tải (CPU 52% mà một luồng 100%, máy chủ tự đo p99 11 ms trong khi khách chờ 2,25 s); perf record/report/script/annotate, folded stack và flame graph (C, Node + --perf-basic-prof, vi sai); thời gian ngoài CPU bằng offcputime và ảnh chụp gdb (khoá 87,8% thời gian chờ, sửa 1 621 → 250 ms); profiler của Node, Java (JFR, async-profiler) và Python (cProfile, py-spy) trên cùng một dịch vụ chậm, và khoảng hở 40 ms do Nagle mà không profiler CPU nào thấy; eBPF với bpftrace một dòng và execsnoop/opensnoop/biolatency/runqlat/tcplife trong container; đo hiệu năng trung thực (làm nóng, phân vị, coordinated omission, wrk/hey/k6); núm chỉnh đo trước/sau (somaxconn, ulimit -n) và những núm không nên đụng; và một câu chuyện tinh chỉnh trọn vẹn (fsync → group commit: p99 11,3 s → 33 ms).',
  lessons: [L151, L152, L153, L154, L155, L156, L157, L158, L159],
};
