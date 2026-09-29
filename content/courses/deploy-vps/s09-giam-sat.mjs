import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';
/**
 * Deploy VPS — Chương 9: Giám sát.
 * Nâng cấp 29/09/2026: bài 9.0 slide (deck dv-09, 31 slide) + slide/🧪/🗂/📌 trong 9.1–9.5; đào sâu: lịch sử giám sát
 * (NetSaint 1999 → Uptime Kuma 2021), PSI đo lại, cpu.sh từng dòng + delta đo được, 1.000 request đo lại + histogram,
 * pv.sh nearest-rank + cỡ mẫu, trung bình hai p95 (440,6 vs 25,9 ms), jq -R fromjson?, bảng cờ journalctl, -p err mù JSON,
 * request id nginx↔app, docker logs tách stderr, journald mất nhãn unit (-u 0 / -t 6), bao.sh chống báo trùng + webhook giả,
 * bộ kiểm hỏng (awk thiếu tệp, curl || echo 000 → 000000), trang lỗi mã 200, -checkend, bộ canh máy nhà thật (timer 5 phút
 * + AccuracySec 30 s) và 26 ngày đỏ vì container job bị quên (journal đọc chỉ-đọc), so công cụ; quiz 10 câu có giải thích.
 * Sửa câu SAI ở 9.2: nginx KHÔNG ghi $request_time trong định dạng mặc định combined.
 * Mọi số đo là ĐO THẬT: /proc/stat và /proc/loadavg trên nhân Linux 6.18 với
 * bốn nhân bị ép bận 100%, 200 request thật qua một dịch vụ có đuôi chậm,
 * 200.000 dòng log sinh ra ở hai định dạng, và một cấu hình nginx sai cổng
 * để chốt kiểm sức khoẻ nói dối một cách thuyết phục.
 */

export default {
  title: 'Chapter 9 — Monitoring: the numbers that lie and the ones that do not|||Chương 9 — Giám sát: những con số nói dối và những con số thì không',
  slug: 'deploy-ch9-giam-sat',
  description: 'Load average mất 60 giây mới bò tới 2,62 trong khi CPU đã 100% từ giây số 0. Trung bình 60,8 ms trong khi một phần hai mươi người dùng chờ 900 ms. Và một chốt kiểm sức khoẻ trả 200 qua đúng con proxy người dùng đi qua, trong khi trang chủ trả 502.',
  sortOrder: 10,
  lessons: [

    /* ─────────────────────────── 9.0 ─────────────────────────── */
    {
      title: '9.0 — Chapter 9 slides: monitoring in pictures|||9.0 — Slide Chương 9: giám sát bằng hình',
      slug: 'deploy-9-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 31 slide của Chương 9: lịch sử giám sát, load average trễ và PSI, trung bình 65 ms với p95 857 ms, log JSON và jq, request id, báo động chống trùng với webhook giả, /health 200 khi trang chủ 502, và 26 ngày đỏ của bộ canh máy nhà.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Slides</span>
<h2>The whole chapter in 31 slides</h2>
<p class="lead">Skim these before the lessons to see where the chapter goes, then come back after the quiz as a revision sheet. Two pictures carry it: a histogram of 1,000 real requests where the average of 65 ms falls into a bucket that contains nobody, and 43 days of a real monitor&#39;s journal where one forgotten job container kept the alarm red for 26 days and 602 messages.</p>
<p>Slides 3–6 belong to Lesson 9.1 (history, load average against PSI, CPU from <code>/proc/stat</code>, the golden signals), 7–11 to 9.2 (mean against percentiles, the histogram, <code>pv.sh</code>, averaging p95, the tail at page level), 12–16 to 9.3 (missing fields, JSON with <code>jq</code>, <code>-p err</code>, a request id, logs your search cannot see), 17–21 to 9.4 (threshold against trend, <code>bao.sh</code>, fingerprints, a simulated day, broken checkers) and 22–27 to 9.5 (<code>/health</code> 200 with a 502 homepage, content checks, the home-machine monitor, the 26-day story, tools). The last four are the common mistakes, a two-page cheat sheet and a 45-minute practice session. New terminals are real output recorded on 29/09/2026 on the "lab VPS" — an Ubuntu 24.04 container with systemd, sshd and nginx that the Mac reaches over SSH like a rented server — plus <code>docker</code> runs on the Mac and a read-only look at the real monitor&#39;s journal on the home machine.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Slide</span>
<h2>Cả chương trong 31 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để thấy chương đi về đâu, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Hai bức hình gánh cả chương: histogram của 1.000 request thật, nơi con trung bình 65 ms rơi đúng vào một thùng KHÔNG có ai; và 43 ngày journal của một bộ canh có thật, nơi một container job bị bỏ quên giữ báo động đỏ suốt 26 ngày và 602 tin nhắn.</p>
<p>Slide 3–6 thuộc Bài 9.1 (lịch sử, load average so với PSI, CPU từ <code>/proc/stat</code>, bốn tín hiệu vàng), 7–11 thuộc 9.2 (trung bình so với phân vị, histogram, <code>pv.sh</code>, lấy trung bình p95, cái đuôi ở mức trang), 12–16 thuộc 9.3 (thiếu trường, JSON với <code>jq</code>, <code>-p err</code>, request id, log mà lệnh tìm không thấy), 17–21 thuộc 9.4 (ngưỡng so với xu hướng, <code>bao.sh</code>, vân tay, một ngày mô phỏng, bộ kiểm hỏng) và 22–27 thuộc 9.5 (<code>/health</code> 200 mà trang chủ 502, kiểm nội dung, bộ canh máy nhà, chuyện 26 ngày, công cụ). Bốn slide cuối là những sai lầm hay gặp, bảng tra nhanh hai trang và một buổi thực hành 45 phút. Terminal mới đều là output THẬT ghi ngày 29/09/2026 trên "VPS thí nghiệm" — một container Ubuntu 24.04 có systemd, sshd và nginx mà máy Mac SSH vào như một máy chủ thuê — cộng các lần chạy <code>docker</code> trên Mac và một lần đọc chỉ-đọc journal của bộ canh thật trên máy nhà.</p>
</div>
${gallery('dv-09', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Giám sát: từ "gửi pager" tới canh từ ngoài'], [4, 'Load average trễ cả phút, PSI thấy ngay'], [5, 'CPU đúng = hai lần đọc /proc/stat'], [6, 'Bốn tín hiệu vàng, và giá của việc đo'],
  [7, 'Trung bình 65 ms — không ai chờ 65 ms'], [8, 'Hai đám đông, một khe trống ở giữa'], [9, 'Phân vị bằng sort + awk'], [10, 'Không lấy trung bình các p95'], [11, 'Đuôi 5% thành trải nghiệm của đa số'],
  [12, 'Log thiếu trường: trả lời nhanh mà sai'], [13, 'Log JSON: hỏi bằng jq'], [14, '-p err không thấy lỗi nào'], [15, 'Một request id nối nginx với ứng dụng'], [16, 'Log có đó mà lệnh tìm không thấy'],
  [17, 'Ngưỡng 90% cho 5 giờ, xu hướng cho 24 giờ'], [18, 'Báo khi tập lỗi đổi'], [19, 'Vân tay chứa con số: 6 tin so với 1'], [20, 'Một ngày của bộ báo'], [21, 'Bộ kiểm hỏng thì im lặng trông như xanh'],
  [22, '/health 200 trong khi trang chủ 502'], [23, 'Mã 200 chưa chứng minh trang chạy'], [24, 'Canh từ bên ngoài: máy nhà canh VPS'], [25, 'canh-vps.sh: sáu phép kiểm'], [26, '26 ngày đỏ vì một container job bị quên'], [27, 'Chọn công cụ giám sát'],
  [28, 'Sai lầm hay gặp'], [29, 'Bảng tra nhanh (1/2)'], [30, 'Bảng tra nhanh (2/2)'], [31, 'Thực hành chương 9'],
])}
`,
    },

    /* ─────────────────────────── 9.1 ─────────────────────────── */
    {
      title: '9.1 — What to measure, and the number that lies|||9.1 — Đo cái gì, và con số NÓI DỐI',
      slug: 'deploy-9-1-do-cai-gi',
      type: 'VIDEO',
      description: 'Bốn nhân bị ép bận 100% từ giây số 0. CPU đọc ra 100% ngay. Load average mất 60 giây mới bò tới 2,62 — và giá trị đúng là 4,00. Đo thật cả bảy lần lấy mẫu, kèm cách tính CPU từ /proc/stat cho đúng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>What to measure, and the number that lies</h2>
<p class="lead">Chapter 8 was about failures the kernel announces. This chapter is about noticing the ones it does not — and the first problem is that the number everybody reaches for first is the slowest one on the machine.</p>

<h3>Why monitoring exists, and where the idea came from</h3>
${slide('dv-09', 3, 'Giám sát: từ "gửi pager" tới canh từ ngoài — các mốc đã kiểm nguồn')}
<p>Monitoring (<em>giám sát</em> — watching a system so a human hears about trouble before the users do) is older than most of the tools you will read about. On 14 March 1999 Ethan Galstad released NetSaint 0.0.1, renamed Nagios in 2002: a program that ran checks on a schedule and, when one failed, sent an email or a pager message. Google started its Site Reliability Engineering team in 2003; SoundCloud began Prometheus in 2012 (the CNCF accepted it in 2016, its second project after Kubernetes); Torkel Ödegaard released Grafana in January 2014; O&#39;Reilly published the SRE book in 2016 with its "four golden signals"; and Uptime Kuma, the self-hosted uptime checker many small sites run today, appeared in 2021. The tools changed completely. The idea did not: <strong>check on a schedule, and when something is wrong, reach a person.</strong></p>
<div class="callout warn"><p><strong>What happens without it.</strong> Without monitoring, your users are the alarm — and users do not report problems, they leave. For a student project that means finding out the evening before the defence, when the lecturer clicks the link and asks why it is dead. For a real site it means finding out from a support message hours later. Everything in this chapter is about shortening that gap, and about not replacing silence with noise.</p></div>
<h3>Load average, measured against the truth</h3>
${slide('dv-09', 4, 'Load average trễ cả phút, PSI thấy ngay (đo lại 29/09 trên VPS thí nghiệm)')}
<p>Four cores pinned at 100% starting at t=0, with the true load therefore 4.00. Sampling both numbers every ten seconds:</p>

<div class="out">  truoc : 0.10 0.12 0.09
  t= 0s  load=0.10 0.12 0.09   CPU_ban=100.0%
  t=10s  load=0.70 0.25 0.13   CPU_ban=100.0%
  t=20s  load=1.21 0.37 0.18   CPU_ban=100.0%
  t=30s  load=1.71 0.51 0.22   CPU_ban=100.0%
  t=40s  load=2.07 0.62 0.26   CPU_ban=100.0%
  t=50s  load=2.36 0.73 0.30   CPU_ban=100.0%
  t=60s  load=2.62 0.84 0.34   CPU_ban=100.0%</div>

<div class="callout warn">
<p><strong>Read the first row.</strong> The machine is <em>completely saturated</em> and the one-minute load average says <strong>0.10</strong>. Sixty seconds later — a full minute into a total CPU outage — it has reached 2.62 against a true value of 4.00, and the fifteen-minute figure is still 0.34. If your alerting looks at load average, your first notification arrives long after your users did.</p>
</div>

<p>This is not a bug. Load average is an exponentially-weighted moving average with time constants of 1, 5 and 15 minutes, and a moving average is by construction a description of the past. It is a good number for "was yesterday busier than today" and a useless one for "is something wrong right now".</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">load average</span><span class="lz-t">minutes late</span><span class="lz-d">good for trends, useless for incidents</span></div>
<div class="lz-step"><span class="lz-k">CPU from /proc/stat</span><span class="lz-t">as current as your sample interval</span><span class="lz-d">what you actually want</span></div>
</div>

<h3>Measured again: PSI answers in seconds</h3>
<p>The measurement above was repeated on the lab VPS (an Ubuntu 24.04 container on a Mac M1 with 10 virtual cores — see the practice section). Fourteen busy loops on ten cores, read twelve seconds later:</p>
<div class="out">$ bash cpu.sh
ban 99%  steal 0%  (delta tong=687)
$ cat /proc/pressure/cpu
some avg10=28.72 avg60=7.56 avg300=3.24 total=778488055
full avg10=0.00 avg60=0.00 avg300=0.00 total=0
$ cat /proc/loadavg
2.81 1.49 1.23 15/841 5551</div>
<p>Fifteen runnable tasks (the fourth field, <code>15/841</code>) and the one-minute load average says 2.81 — the same lag as before. PSI (<em>pressure stall information</em> — the share of time tasks were ready but had to wait) already says <strong>28.72%</strong> for the last ten seconds. Read the <code>some</code> line as "at least one task was waiting for a CPU during 28.7% of that window". <code>full</code> (every task stalled at once) is always zero for CPU at the system level; it matters for memory and I/O.</p>
<table><tr><th>PSI line</th><th>Meaning</th><th>Worth alerting when</th></tr>
<tr><td><code>cpu some avg10</code></td><td>% of the last 10 s someone waited for a CPU</td><td>stays above ~20–30% for minutes</td></tr>
<tr><td><code>memory some / full</code></td><td>% of time stalled reclaiming memory</td><td><code>full</code> above a few % — the step before the OOM killer (Chapter 8)</td></tr>
<tr><td><code>io some / full</code></td><td>% of time waiting on the disk</td><td>rises together with slow requests</td></tr></table>
<h3>Computing CPU correctly</h3>
${slide('dv-09', 5, 'CPU đúng = hai lần đọc /proc/stat, một phép trừ — cpu.sh từng dòng')}
<p><code>/proc/stat</code> holds cumulative counters since boot, in units of 1/100 second (<code>getconf CLK_TCK</code> = 100 here). A single reading tells you nothing; you need two, and the difference between them:</p>

<pre><code>head -1 /proc/stat
<span class="tok-comment"># cpu  91419 0 66238 9302856 3770 0 13102 904 0 0</span>
<span class="tok-comment"># user nice system idle iowait irq softirq steal guest guest_nice</span></code></pre>

<pre><code>doc() { awk '/^cpu /{t=0;for(i=2;i&lt;=NF;i++)t+=\$i; print t, \$5}' /proc/stat; }
read T1 I1 &lt; &lt;(doc); sleep 1; read T2 I2 &lt; &lt;(doc)
<span class="tok-comment"># ban% = 100 * (delta tong - delta idle) / delta tong</span></code></pre>

<div class="out">=== may dang ranh ===
  CPU ban: 1.5%  (delta tong=399, delta idle=393)
=== ep mot nhan ban 100% trong 2 giay ===
  CPU ban: 26.9%  (delta tong=802, delta idle=586)</div>

<p>One busy core out of four reads as 26.9%, which is correct — the counters sum across all CPUs, so 100% means every core.</p>

<div class="pitfall">
<p><strong>Trap — the <code>steal</code> column is the one that matters on a cheap VPS.</strong> Field eight is time your virtual CPU was ready to run and the hypervisor gave the physical core to somebody else. On an oversubscribed host it can be double digits, and it produces the most confusing possible symptom: your application is slow, your CPU graph shows plenty of idle, and nothing you own is at fault. If <code>steal</code> is consistently above a few percent, the problem is your neighbours and no amount of optimisation on your side will fix it — that is a conversation with the provider, or a different machine.</p>
</div>

<h3>The whole script, line by line</h3>
<p>The two lines above are the core. Here is the complete script used for every CPU number in this chapter, with <code>steal</code> added:</p>
<pre><code class="language-bash">#!/bin/bash
# cpu.sh — CPU ban % tu HAI lan doc /proc/stat (cach nhau 1 giay)
doc() { awk '/^cpu /{ t=0; for (i=2; i&lt;=NF; i++) t+=$i; print t, $5+$6, $9 }' /proc/stat; }
read T1 I1 S1 &lt; &lt;(doc); sleep 1; read T2 I2 S2 &lt; &lt;(doc)
dt=$((T2 - T1))
echo "ban $(( 100 * (dt - (I2 - I1)) / dt ))%  steal $(( 100 * (S2 - S1) / dt ))%  (delta tong=$dt)"</code></pre>
<table><tr><th>Piece</th><th>What it does</th></tr>
<tr><td><code>/^cpu /</code></td><td>the first line only — the sum of all cores. <code>cpu0</code>, <code>cpu1</code>… are per core</td></tr>
<tr><td><code>for (i=2; i&lt;=NF; i++) t+=$i</code></td><td>total jiffies in every state</td></tr>
<tr><td><code>$5+$6</code></td><td>idle + iowait — both are "the CPU did no work"</td></tr>
<tr><td><code>$9</code></td><td>steal — time the hypervisor gave your virtual CPU to another guest</td></tr>
<tr><td><code>read … &lt; &lt;(doc)</code></td><td>process substitution: read the function&#39;s output into variables without a subshell swallowing them</td></tr>
<tr><td><code>dt</code></td><td>the measured interval, in jiffies across all cores</td></tr></table>
<p>Look at <code>delta tong=687</code> in the loaded run and <code>delta tong=1013</code> on the idle machine. With ten cores and one second you would expect about 1,000; under load, inside a Docker Desktop VM, the kernel accounted 687. That is exactly why the formula divides by the <em>measured</em> total and never by "100 × number of cores": the percentage stays right even when the tick count is not what you assumed.</p>
<div class="callout ok"><p><strong>On Windows/WSL and macOS.</strong> macOS has no <code>/proc</code> at all — <code>top -l 1 | head</code> and <code>vm_stat</code> are the local equivalents, and none of the scripts here run on the Mac itself; run them on the VPS. WSL2 does have <code>/proc</code>, but it describes the WSL virtual machine, not Windows. In every case the numbers that matter are the ones on the server, read over SSH.</p></div>
<h3>The four things worth watching on a small server</h3>
${slide('dv-09', 6, 'Bốn tín hiệu vàng cho một VPS — và cái giá của việc đo')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">saturation</span><span class="lz-lnote">CPU busy%, memory available, disk % and inodes, connection-pool depth. "How close to the wall am I?"</span></div>
<div class="lz-layer"><span class="lz-lname">errors</span><span class="lz-lnote">5xx rate, restart count, the cgroup&#39;s <code>oom_kill</code> counter (8.1). "How often is it already broken?"</span></div>
<div class="lz-layer"><span class="lz-lname">latency</span><span class="lz-lnote">not the mean — p50, p95, p99 (9.2). "How does it feel to use?"</span></div>
<div class="lz-layer"><span class="lz-lname">traffic</span><span class="lz-lnote">requests per second. Only useful as the denominator for the other three, but you cannot interpret them without it</span></div>
</div>

<p>A 5% error rate at ten requests per second is one unhappy person a minute. The same 5% at a thousand requests per second is an outage. The error rate alone does not distinguish them.</p>

<h3>The cost of measuring</h3>
<p>Reading <code>/proc</code> is essentially free — but <em>how</em> you read it is not:</p>

<div class="out">=== doc /proc, 1000 lan moi tep, bang 'cat' (co fork) ===
  /proc/stat          1.647 ms/lan
  /proc/meminfo       1.643 ms/lan
  /proc/loadavg       1.715 ms/lan
  /proc/diskstats     1.580 ms/lan

=== doc TRONG mot tien trinh (khong fork) ===
  /proc/stat         0.0135 ms/lan
  /proc/meminfo      0.0104 ms/lan
  /proc/loadavg      0.0077 ms/lan
  /proc/diskstats    0.0164 ms/lan</div>

<p>0.01 ms to read the file, 1.6 ms to <code>cat</code> it — <strong>120× more</strong>, essentially all of it <code>fork</code> and <code>exec</code>. A shell monitoring loop that spawns a dozen processes every five seconds is spending more effort on the measurement than on anything it measures. Read the files directly from one long-lived process, or accept that your monitoring is a background load of its own.</p>

<div class="callout ok">
<p><strong>What to install on a 1 GB VPS.</strong> Honestly: nothing heavy. A Prometheus server plus Grafana on the same box you are monitoring is a memory-hungry way to guarantee that your monitoring dies at exactly the moment it becomes interesting (8.2 — it will be one of the biggest processes on the machine). Either run <code>node_exporter</code> alone and scrape it from somewhere else, or write twenty lines that read <code>/proc</code>, append a line to a file, and let a cron job look at the trend (9.4). The second option is genuinely enough for one small server.</p>
</div>

<h3>Where the counters live</h3>
<div class="kv-grid">
<div class="kv"><span class="k">/proc/stat</span><span class="v">CPU jiffies per state; also context switches and boot time</span></div>
<div class="kv"><span class="k">/proc/meminfo</span><span class="v"><code>MemAvailable</code> is the line to read — not <code>MemFree</code>, which excludes reclaimable cache</span></div>
<div class="kv"><span class="k">/proc/diskstats</span><span class="v">reads, writes and — field 10 — milliseconds spent doing I/O, the basis of disk utilisation</span></div>
<div class="kv"><span class="k">/proc/net/dev</span><span class="v">bytes and packets per interface, cumulative like everything else here</span></div>
<div class="kv"><span class="k">/proc/pressure/*</span><span class="v">PSI on kernels 4.20+: the fraction of time tasks were stalled on cpu, io or memory. Closer to "is it bad" than anything else in this list</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — every number in <code>/proc</code> here is cumulative, and a single reading is meaningless.</strong> This catches people writing their first monitoring script: they read <code>/proc/diskstats</code>, see a huge number, and report it as a rate. It is a total since boot. Everything in this lesson needs two samples and a subtraction — and the interval between them has to be measured too, not assumed, because <code>sleep 1</code> does not sleep for exactly one second.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your group&#39;s VPS "feels slow" the night before the demo and a teammate says load average is only 0.4, so the server must be fine. Build the lab VPS used in this whole chapter and find out which number to believe.</p>
<ol>
<li>Build the lab VPS on your machine (a container that behaves like a rented Ubuntu server): a Dockerfile <code>FROM ubuntu:24.04</code> that installs <code>systemd systemd-sysv openssh-server nginx python3 curl jq openssl procps</code>, adds a <code>deploy</code> user with your public key, and ends with <code>CMD ["/sbin/init"]</code>. Then <code>docker build -t dv09-img .</code> and <code>docker run -d --name dv09-vps --privileged --cgroupns=private --tmpfs /run --tmpfs /run/lock --memory 512m -p 127.0.0.1:19092:22 dv09-img</code>.</li>
<li>SSH in (<code>ssh -p 19092 deploy@127.0.0.1</code>), save <code>cpu.sh</code> from this lesson and run it on the idle machine.</li>
<li>Start more busy loops than you have cores: <code>for i in $(seq 14); do timeout 15 sh -c 'while :; do :; done' &amp; done</code>. After 10 seconds run <code>bash cpu.sh</code>, <code>cat /proc/pressure/cpu</code> and <code>cat /proc/loadavg</code> together.</li>
<li>Wait until the loops end and run the three commands again a minute later.</li>
</ol>
<p><strong>Done when:</strong> you can show three numbers taken at the same moment — CPU busy near 100%, PSI <code>some avg10</code> in double digits, one-minute load still far below the number of running tasks — and explain in one sentence why the load average is behind.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Monitoring (giám sát)</span><span class="v">Checking a system on a schedule and telling a person when something is wrong.</span></div>
<div class="kv"><span class="k">Load average (tải trung bình)</span><span class="v">A 1/5/15-minute moving average of runnable and uninterruptible tasks — good for trends, late for incidents.</span></div>
<div class="kv"><span class="k">Jiffy (tick đồng hồ)</span><span class="v">The kernel&#39;s time unit in <code>/proc/stat</code>, 1/100 s here (<code>getconf CLK_TCK</code>).</span></div>
<div class="kv"><span class="k">Steal time (thời gian bị lấy)</span><span class="v">Time your virtual CPU wanted to run but the host gave the core to another guest.</span></div>
<div class="kv"><span class="k">PSI — pressure stall information (thông tin kẹt vì áp lực)</span><span class="v">Share of time tasks waited for CPU, memory or I/O; answers "is it hurting" within seconds.</span></div>
<div class="kv"><span class="k">Golden signals (tín hiệu vàng)</span><span class="v">Saturation, errors, latency, traffic — the four numbers worth watching first.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Monitoring has been "check on a schedule, then reach a person" since NetSaint in 1999; only the tools changed.</li>
<li>Load average is a moving average: 0.10 with the CPU already at 100%, and still far behind after a minute.</li>
<li>CPU busy needs two readings of <code>/proc/stat</code> and a division by the measured total, never by an assumed one.</li>
<li>PSI shows waiting within ten seconds; <code>steal</code> shows when the problem is your neighbours on the host.</li>
<li>Watch saturation, errors, latency and traffic — and read <code>/proc</code> from one process, because forking is 120× the cost.</li>
</ul>
<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">proc(5) — /proc/stat and /proc/loadavg</span><span class="lc-sub">man 5 proc — the field order used above, and the definition of load average as a count of runnable <em>and uninterruptible</em> tasks, which is why disk waits inflate it.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Brendan Gregg — Linux load averages: solving the mystery</span><span class="lc-sub">brendangregg.com/blog/2017-08-08/linux-load-averages.html — why Linux counts uninterruptible tasks when other Unixes do not, and what that makes the number mean.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Linux kernel — PSI, pressure stall information</span><span class="lc-sub">docs.kernel.org/accounting/psi.html — <code>/proc/pressure/{cpu,io,memory}</code>, designed specifically to answer "is this resource hurting me" rather than "how much of it is used".</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Monitoring Distributed Systems</span><span class="lc-sub">sre.google/sre-book/monitoring-distributed-systems/ — the four golden signals the list above is a small-server version of.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — reading /proc, and writing a metrics loop</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the awk and file-reading patterns above, and why avoiding subshells matters in a loop that runs forever.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Đo cái gì, và con số NÓI DỐI</h2>
<p class="lead">Chương 8 nói về những cú hỏng mà nhân hệ điều hành TUYÊN BỐ. Chương này nói về việc nhận ra những cú nó KHÔNG tuyên bố — và vấn đề đầu tiên là cái con số mà ai cũng với tay lấy trước nhất lại là con số CHẬM NHẤT trên cái máy.</p>

<h3>Vì sao phải giám sát, và ý tưởng này từ đâu ra</h3>
${slide('dv-09', 3, 'Giám sát: từ "gửi pager" tới canh từ ngoài — các mốc đã kiểm nguồn')}
<p>Monitoring (<em>giám sát</em> — theo dõi một hệ thống để CON NGƯỜI biết chuyện trước khi người dùng biết) còn già hơn phần lớn công cụ bạn sẽ đọc tới. Ngày 14/03/1999, Ethan Galstad phát hành NetSaint 0.0.1, năm 2002 đổi tên thành Nagios: một chương trình chạy các phép kiểm theo lịch và, khi có cái hỏng, gửi email hoặc tin nhắn pager (máy nhắn tin). Google lập đội Site Reliability Engineering (SRE — kỹ sư độ tin cậy) năm 2003; SoundCloud bắt đầu Prometheus năm 2012 (CNCF nhận nó năm 2016, dự án thứ hai sau Kubernetes); Torkel Ödegaard phát hành Grafana tháng 1/2014; O&#39;Reilly in cuốn sách SRE năm 2016 cùng "bốn tín hiệu vàng"; và Uptime Kuma — bộ canh tự host mà nhiều website nhỏ đang chạy — ra đời năm 2021. Công cụ đổi hoàn toàn. Ý tưởng thì không: <strong>kiểm theo lịch, và khi có gì sai thì CHẠM TỚI một con người.</strong></p>
<div class="callout warn"><p><strong>Không có nó thì sao.</strong> Không giám sát thì NGƯỜI DÙNG là cái chuông báo — mà người dùng không báo lỗi, họ bỏ đi. Với đồ án sinh viên, đó là phát hiện ra vào tối trước hôm bảo vệ, lúc thầy bấm link và hỏi sao nó chết. Với một website thật, đó là phát hiện ra qua một tin nhắn hỗ trợ vài giờ sau. Cả chương này là về việc rút ngắn khoảng trống đó — và về việc đừng thay sự im lặng bằng TIẾNG ỒN.</p></div>
<h3>Load average, đo đối chiếu với sự thật</h3>
${slide('dv-09', 4, 'Load average trễ cả phút, PSI thấy ngay (đo lại 29/09 trên VPS thí nghiệm)')}
<p>Bốn nhân bị ghim 100% bắt đầu từ t=0, nên tải thật là 4,00. Lấy mẫu cả hai con số mỗi mười giây:</p>

<div class="out">  truoc : 0.10 0.12 0.09
  t= 0s  load=0.10 0.12 0.09   CPU_ban=100.0%
  t=10s  load=0.70 0.25 0.13   CPU_ban=100.0%
  t=20s  load=1.21 0.37 0.18   CPU_ban=100.0%
  t=30s  load=1.71 0.51 0.22   CPU_ban=100.0%
  t=40s  load=2.07 0.62 0.26   CPU_ban=100.0%
  t=50s  load=2.36 0.73 0.30   CPU_ban=100.0%
  t=60s  load=2.62 0.84 0.34   CPU_ban=100.0%</div>

<div class="callout warn">
<p><strong>Đọc hàng đầu tiên.</strong> Cái máy đang <em>BÃO HOÀ HOÀN TOÀN</em> và load average một phút nói <strong>0,10</strong>. Sáu mươi giây sau — tròn một phút giữa một cú chết CPU toàn phần — nó mới bò tới 2,62 so với giá trị thật 4,00, còn con số mười lăm phút thì vẫn là 0,34. Nếu hệ báo động của bạn nhìn load average, thì thông báo đầu tiên của bạn tới LÂU sau khi người dùng đã tới.</p>
</div>

<p>Đây không phải một con bọ. Load average là một trung bình động có trọng số mũ với hằng số thời gian 1, 5 và 15 phút, mà một trung bình động thì theo cấu tạo là một MÔ TẢ VỀ QUÁ KHỨ. Nó là con số tốt cho câu "hôm qua có bận hơn hôm nay không" và vô dụng cho câu "ngay lúc này có gì sai không".</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">load average</span><span class="lz-t">trễ hàng phút</span><span class="lz-d">tốt cho xu hướng, vô dụng cho sự cố</span></div>
<div class="lz-step"><span class="lz-k">CPU từ /proc/stat</span><span class="lz-t">mới bằng đúng khoảng lấy mẫu của bạn</span><span class="lz-d">thứ bạn thật sự muốn</span></div>
</div>

<h3>Đo lại: PSI trả lời trong vài giây</h3>
<p>Phép đo ở trên được làm lại trên VPS thí nghiệm (một container Ubuntu 24.04 chạy trên Mac M1 với 10 nhân ảo — xem phần thực hành). Mười bốn vòng lặp bận trên mười nhân, đọc sau mười hai giây:</p>
<div class="out">$ bash cpu.sh
ban 99%  steal 0%  (delta tong=687)
$ cat /proc/pressure/cpu
some avg10=28.72 avg60=7.56 avg300=3.24 total=778488055
full avg10=0.00 avg60=0.00 avg300=0.00 total=0
$ cat /proc/loadavg
2.81 1.49 1.23 15/841 5551</div>
<p>Mười lăm tác vụ đang chờ chạy (trường thứ tư, <code>15/841</code>) mà load average một phút mới nói 2,81 — trễ y như trước. PSI (<em>pressure stall information — thông tin kẹt vì áp lực</em>: tỷ lệ thời gian các tác vụ đã sẵn sàng mà phải CHỜ) thì đã nói <strong>28,72%</strong> cho mười giây vừa qua. Đọc dòng <code>some</code> là "trong 28,7% khoảng đó có ít nhất một tác vụ phải chờ CPU". <code>full</code> (mọi tác vụ cùng kẹt) với CPU ở mức toàn hệ thống luôn bằng không; nó có nghĩa với bộ nhớ và I/O.</p>
<table><tr><th>Dòng PSI</th><th>Nghĩa</th><th>Đáng báo động khi</th></tr>
<tr><td><code>cpu some avg10</code></td><td>% của 10 s vừa qua có ai đó chờ CPU</td><td>ở trên ~20–30% suốt vài phút</td></tr>
<tr><td><code>memory some / full</code></td><td>% thời gian kẹt vì phải thu hồi bộ nhớ</td><td><code>full</code> trên vài % — bước ngay trước OOM killer (Chương 8)</td></tr>
<tr><td><code>io some / full</code></td><td>% thời gian chờ đĩa</td><td>tăng cùng lúc với request chậm</td></tr></table>
<h3>Tính CPU cho đúng</h3>
${slide('dv-09', 5, 'CPU đúng = hai lần đọc /proc/stat, một phép trừ — cpu.sh từng dòng')}
<p><code>/proc/stat</code> giữ các bộ đếm CỘNG DỒN từ lúc khởi động, đơn vị 1/100 giây (<code>getconf CLK_TCK</code> = 100 ở đây). Một lần đọc chẳng nói gì cả; bạn cần HAI lần, và hiệu giữa chúng:</p>

<pre><code>head -1 /proc/stat
<span class="tok-comment"># cpu  91419 0 66238 9302856 3770 0 13102 904 0 0</span>
<span class="tok-comment"># user nice system idle iowait irq softirq steal guest guest_nice</span></code></pre>

<pre><code>doc() { awk '/^cpu /{t=0;for(i=2;i&lt;=NF;i++)t+=\$i; print t, \$5}' /proc/stat; }
read T1 I1 &lt; &lt;(doc); sleep 1; read T2 I2 &lt; &lt;(doc)
<span class="tok-comment"># ban% = 100 * (delta tong - delta idle) / delta tong</span></code></pre>

<div class="out">=== may dang ranh ===
  CPU ban: 1.5%  (delta tong=399, delta idle=393)
=== ep mot nhan ban 100% trong 2 giay ===
  CPU ban: 26.9%  (delta tong=802, delta idle=586)</div>

<p>Một nhân bận trên bốn đọc ra 26,9%, và đó là ĐÚNG — các bộ đếm cộng gộp qua mọi CPU, nên 100% nghĩa là MỌI nhân.</p>

<div class="pitfall">
<p><strong>Bẫy — cột <code>steal</code> mới là cái quan trọng trên một VPS rẻ tiền.</strong> Trường thứ tám là thời gian CPU ảo của bạn SẴN SÀNG chạy mà bộ ảo hoá lại đưa nhân vật lý cho người khác. Trên một máy chủ bán quá tay, nó có thể lên hai chữ số, và nó đẻ ra triệu chứng khó hiểu nhất có thể: ứng dụng của bạn chậm, đồ thị CPU của bạn cho thấy còn thừa mứa chỗ rảnh, và chẳng có gì thuộc về bạn là có lỗi. Nếu <code>steal</code> liên tục trên vài phần trăm, thì vấn đề là HÀNG XÓM của bạn và không có mức tối ưu nào ở phía bạn chữa được — đó là một cuộc nói chuyện với nhà cung cấp, hoặc một cái máy khác.</p>
</div>

<h3>Cả script, từng dòng</h3>
<p>Hai dòng ở trên là phần lõi. Đây là script đầy đủ dùng cho mọi con số CPU trong chương này, thêm cả <code>steal</code>:</p>
<pre><code class="language-bash">#!/bin/bash
# cpu.sh — CPU ban % tu HAI lan doc /proc/stat (cach nhau 1 giay)
doc() { awk '/^cpu /{ t=0; for (i=2; i&lt;=NF; i++) t+=$i; print t, $5+$6, $9 }' /proc/stat; }
read T1 I1 S1 &lt; &lt;(doc); sleep 1; read T2 I2 S2 &lt; &lt;(doc)
dt=$((T2 - T1))
echo "ban $(( 100 * (dt - (I2 - I1)) / dt ))%  steal $(( 100 * (S2 - S1) / dt ))%  (delta tong=$dt)"</code></pre>
<table><tr><th>Mảnh</th><th>Làm gì</th></tr>
<tr><td><code>/^cpu /</code></td><td>chỉ dòng đầu — tổng của MỌI nhân. <code>cpu0</code>, <code>cpu1</code>… là từng nhân</td></tr>
<tr><td><code>for (i=2; i&lt;=NF; i++) t+=$i</code></td><td>tổng jiffy (đơn vị 1/100 giây) ở mọi trạng thái</td></tr>
<tr><td><code>$5+$6</code></td><td>idle + iowait — cả hai đều là "CPU không làm việc"</td></tr>
<tr><td><code>$9</code></td><td>steal (<em>bị lấy</em>) — thời gian bộ ảo hoá đưa CPU ảo của bạn cho máy khác</td></tr>
<tr><td><code>read … &lt; &lt;(doc)</code></td><td>process substitution (<em>thay thế tiến trình</em>): đọc output của hàm vào biến mà không để shell con nuốt mất biến</td></tr>
<tr><td><code>dt</code></td><td>khoảng ĐO ĐƯỢC, tính bằng jiffy cộng qua mọi nhân</td></tr></table>
<p>Nhìn <code>delta tong=687</code> ở lần đo có tải và <code>delta tong=1013</code> ở máy rảnh. Mười nhân, một giây, bạn sẽ đoán cỡ 1.000; có tải, bên trong máy ảo của Docker Desktop, nhân chỉ ghi được 687. Đó chính là lý do công thức chia cho TỔNG ĐO ĐƯỢC chứ không bao giờ chia cho "100 × số nhân": tỷ lệ vẫn đúng kể cả khi số tick không như bạn giả định.</p>
<div class="callout ok"><p><strong>Trên Windows/WSL và macOS.</strong> macOS KHÔNG có <code>/proc</code> — thứ tương đương tại chỗ là <code>top -l 1 | head</code> và <code>vm_stat</code>, và không script nào ở đây chạy trên chính máy Mac; hãy chạy chúng trên VPS. WSL2 CÓ <code>/proc</code>, nhưng nó mô tả máy ảo WSL chứ không phải Windows. Trong mọi trường hợp, con số đáng quan tâm là con số TRÊN MÁY CHỦ, đọc qua SSH.</p></div>
<h3>Bốn thứ đáng nhìn trên một máy chủ nhỏ</h3>
${slide('dv-09', 6, 'Bốn tín hiệu vàng cho một VPS — và cái giá của việc đo')}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">độ bão hoà</span><span class="lz-lnote">CPU bận%, bộ nhớ khả dụng, % đĩa và inode, độ sâu bể kết nối. "Tôi cách bức tường bao xa?"</span></div>
<div class="lz-layer"><span class="lz-lname">lỗi</span><span class="lz-lnote">tỷ lệ 5xx, số lần khởi động lại, bộ đếm <code>oom_kill</code> của cgroup (8.1). "Nó ĐANG hỏng thường xuyên tới mức nào?"</span></div>
<div class="lz-layer"><span class="lz-lname">độ trễ</span><span class="lz-lnote">không phải trung bình — p50, p95, p99 (9.2). "Dùng nó cảm giác thế nào?"</span></div>
<div class="lz-layer"><span class="lz-lname">lưu lượng</span><span class="lz-lnote">số request mỗi giây. Chỉ hữu dụng như MẪU SỐ cho ba cái kia, nhưng thiếu nó thì không diễn giải được ba cái kia</span></div>
</div>

<p>Tỷ lệ lỗi 5% ở mười request mỗi giây là một người khó chịu mỗi phút. Cũng 5% đó ở một nghìn request mỗi giây là một cú sập. Riêng tỷ lệ lỗi không phân biệt được hai chuyện.</p>

<h3>Giá của việc đo</h3>
<p>Đọc <code>/proc</code> về cơ bản là miễn phí — nhưng <em>CÁCH</em> bạn đọc nó thì không:</p>

<div class="out">=== doc /proc, 1000 lan moi tep, bang 'cat' (co fork) ===
  /proc/stat          1.647 ms/lan
  /proc/meminfo       1.643 ms/lan
  /proc/loadavg       1.715 ms/lan
  /proc/diskstats     1.580 ms/lan

=== doc TRONG mot tien trinh (khong fork) ===
  /proc/stat         0.0135 ms/lan
  /proc/meminfo      0.0104 ms/lan
  /proc/loadavg      0.0077 ms/lan
  /proc/diskstats    0.0164 ms/lan</div>

<p>0,01 ms để đọc cái tệp, 1,6 ms để <code>cat</code> nó — <strong>gấp 120 lần</strong>, mà gần như toàn bộ phần chênh là <code>fork</code> với <code>exec</code>. Một vòng lặp giám sát viết bằng shell đẻ ra hàng chục tiến trình mỗi năm giây đang bỏ nhiều công sức vào PHÉP ĐO hơn vào bất cứ thứ gì nó đo. Hãy đọc thẳng các tệp đó từ MỘT tiến trình sống lâu, hoặc chấp nhận rằng hệ giám sát của bạn tự nó là một mức tải nền.</p>

<div class="callout ok">
<p><strong>Cài gì trên một VPS 1 GB.</strong> Thành thật: đừng cài gì nặng. Một máy chủ Prometheus cộng Grafana trên chính cái máy bạn đang giám sát là một cách ngốn bộ nhớ để bảo đảm rằng hệ giám sát của bạn CHẾT đúng vào khoảnh khắc nó trở nên thú vị (8.2 — nó sẽ là một trong những tiến trình lớn nhất trên máy). Hoặc chỉ chạy <code>node_exporter</code> rồi thu thập từ NƠI KHÁC, hoặc viết hai mươi dòng đọc <code>/proc</code>, nối một dòng vào một tệp, và để một cron job nhìn xu hướng (9.4). Lựa chọn thứ hai thật sự là ĐỦ cho một máy chủ nhỏ.</p>
</div>

<h3>Các bộ đếm nằm ở đâu</h3>
<div class="kv-grid">
<div class="kv"><span class="k">/proc/stat</span><span class="v">jiffy CPU theo từng trạng thái; cả số lần chuyển ngữ cảnh và thời điểm khởi động</span></div>
<div class="kv"><span class="k">/proc/meminfo</span><span class="v"><code>MemAvailable</code> mới là dòng cần đọc — không phải <code>MemFree</code>, thứ loại trừ phần bộ đệm thu hồi được</span></div>
<div class="kv"><span class="k">/proc/diskstats</span><span class="v">số lần đọc, ghi và — trường 10 — số mili giây đã dành cho I/O, cơ sở của mức sử dụng đĩa</span></div>
<div class="kv"><span class="k">/proc/net/dev</span><span class="v">byte và gói theo từng giao diện, cộng dồn như mọi thứ ở đây</span></div>
<div class="kv"><span class="k">/proc/pressure/*</span><span class="v">PSI trên nhân 4.20+: tỷ lệ thời gian các tác vụ bị kẹt vì cpu, io hay bộ nhớ. Gần với "nó có tệ không" hơn bất cứ thứ gì khác trong danh sách này</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — MỌI con số trong <code>/proc</code> ở đây là CỘNG DỒN, và một lần đọc thì vô nghĩa.</strong> Cái này bắt được những người viết script giám sát đầu tiên của họ: họ đọc <code>/proc/diskstats</code>, thấy một con số khổng lồ, rồi báo cáo nó như một TỐC ĐỘ. Nó là tổng kể từ lúc khởi động. Mọi thứ trong bài này cần HAI lần lấy mẫu và một phép trừ — và khoảng cách giữa chúng cũng phải được ĐO, chứ đừng giả định, vì <code>sleep 1</code> không ngủ đúng một giây.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> tối trước buổi demo, VPS của nhóm "thấy chậm chậm", một bạn bảo load average có 0,4 thôi nên máy chủ chắc ổn. Hãy dựng VPS thí nghiệm dùng cho cả chương này và tìm ra nên tin con số nào.</p>
<ol>
<li>Dựng VPS thí nghiệm trên máy bạn (một container cư xử như một máy chủ Ubuntu thuê): Dockerfile <code>FROM ubuntu:24.04</code> cài <code>systemd systemd-sysv openssh-server nginx python3 curl jq openssl procps</code>, thêm người dùng <code>deploy</code> với khoá công khai của bạn, kết thúc bằng <code>CMD ["/sbin/init"]</code>. Rồi <code>docker build -t dv09-img .</code> và <code>docker run -d --name dv09-vps --privileged --cgroupns=private --tmpfs /run --tmpfs /run/lock --memory 512m -p 127.0.0.1:19092:22 dv09-img</code>.</li>
<li>SSH vào (<code>ssh -p 19092 deploy@127.0.0.1</code>), lưu <code>cpu.sh</code> của bài này rồi chạy trên máy đang rảnh.</li>
<li>Chạy nhiều vòng lặp bận hơn số nhân: <code>for i in $(seq 14); do timeout 15 sh -c 'while :; do :; done' &amp; done</code>. Sau 10 giây chạy cùng lúc <code>bash cpu.sh</code>, <code>cat /proc/pressure/cpu</code> và <code>cat /proc/loadavg</code>.</li>
<li>Chờ các vòng lặp kết thúc, một phút sau chạy lại ba lệnh đó.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đưa ra được ba con số lấy CÙNG một lúc — CPU bận gần 100%, PSI <code>some avg10</code> hai chữ số, load một phút vẫn thấp xa so với số tác vụ đang chạy — và giải thích trong một câu vì sao load average đi sau.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Monitoring (giám sát)</span><span class="v">Kiểm một hệ thống theo lịch và báo cho một con người khi có gì sai.</span></div>
<div class="kv"><span class="k">Load average (tải trung bình)</span><span class="v">Trung bình động 1/5/15 phút của số tác vụ đang chạy được và không ngắt được — tốt cho xu hướng, trễ cho sự cố.</span></div>
<div class="kv"><span class="k">Jiffy (tick đồng hồ)</span><span class="v">Đơn vị thời gian của nhân trong <code>/proc/stat</code>, ở đây là 1/100 giây (<code>getconf CLK_TCK</code>).</span></div>
<div class="kv"><span class="k">Steal time (thời gian bị lấy)</span><span class="v">Thời gian CPU ảo của bạn muốn chạy mà máy chủ vật lý lại đưa nhân cho khách khác.</span></div>
<div class="kv"><span class="k">PSI — pressure stall information (thông tin kẹt vì áp lực)</span><span class="v">Tỷ lệ thời gian tác vụ phải chờ CPU, bộ nhớ hay I/O; trả lời "có đang đau không" trong vài giây.</span></div>
<div class="kv"><span class="k">Golden signals (tín hiệu vàng)</span><span class="v">Bão hoà, lỗi, độ trễ, lưu lượng — bốn con số đáng nhìn trước tiên.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Giám sát là "kiểm theo lịch, rồi chạm tới một con người" từ NetSaint 1999; chỉ công cụ là đổi.</li>
<li>Load average là trung bình động: 0,10 trong khi CPU đã 100%, và sau một phút vẫn còn đi sau xa.</li>
<li>CPU bận cần hai lần đọc <code>/proc/stat</code> và chia cho tổng ĐO ĐƯỢC, không bao giờ chia cho tổng giả định.</li>
<li>PSI cho thấy việc phải chờ trong vòng mười giây; <code>steal</code> cho thấy khi thủ phạm là hàng xóm trên cùng máy vật lý.</li>
<li>Nhìn bão hoà, lỗi, độ trễ và lưu lượng — và đọc <code>/proc</code> từ MỘT tiến trình, vì fork tốn gấp 120 lần.</li>
</ul>
<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">proc(5) — /proc/stat và /proc/loadavg</span><span class="lc-sub">man 5 proc — thứ tự trường dùng ở trên, và định nghĩa load average là số tác vụ CHẠY ĐƯỢC <em>VÀ không ngắt được</em>, đó là lý do chờ đĩa làm nó phồng lên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Brendan Gregg — Linux load averages: solving the mystery</span><span class="lc-sub">brendangregg.com/blog/2017-08-08/linux-load-averages.html — vì sao Linux đếm cả tác vụ không ngắt được trong khi các Unix khác thì không, và điều đó làm con số ấy có nghĩa gì.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Linux kernel — PSI, pressure stall information</span><span class="lc-sub">docs.kernel.org/accounting/psi.html — <code>/proc/pressure/{cpu,io,memory}</code>, thiết kế riêng để trả lời "tài nguyên này có đang làm tôi đau không" thay vì "nó được dùng bao nhiêu".</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Monitoring Distributed Systems</span><span class="lc-sub">sre.google/sre-book/monitoring-distributed-systems/ — bốn tín hiệu vàng mà danh sách ở trên là bản dành cho máy chủ nhỏ của chúng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — đọc /proc, và viết một vòng lặp thu số đo</span><span class="lc-sub">/courses/linux-bash/learn${REF} — các khuôn mẫu awk và đọc tệp ở trên, và vì sao tránh shell con lại quan trọng trong một vòng lặp chạy mãi mãi.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 9.2 ─────────────────────────── */
    {
      title: '9.2 — The average lies too|||9.2 — Trung bình cũng NÓI DỐI',
      slug: 'deploy-9-2-trung-binh',
      type: 'VIDEO',
      description: '200 request thật qua một dịch vụ có đuôi chậm. Trung bình 60,8 ms — con số đẹp đẽ trên bảng điều khiển. Một nửa người dùng chờ 14,8 ms, và một phần hai mươi chờ 900,8 ms. Không ai chờ 60,8 ms cả.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>The average lies too</h2>
<p class="lead">9.1 was about a number that is late. This one is about a number that is on time, correct, and still describes an experience nobody had.</p>

<h3>The measurement</h3>
<p>A service with a realistic latency shape: most requests are quick, and one in twenty has to do something expensive. 200 real HTTP requests, timed by <code>curl</code>:</p>

<div class="out">  n = 200 request
  trung binh :     60.8 ms   ← con so tren bang dieu khien
  p50        :     14.8 ms
  p90        :     19.9 ms
  p95        :    900.8 ms   ← 1 tren 20 nguoi dung
  p99        :    981.6 ms
  max        :    982.4 ms
  so request > 500 ms: 10 (5%)</div>

<div class="callout warn">
<p><strong>Nobody waited 60.8 ms.</strong> Half the users got 14.8 ms — four times better than the average. One in twenty got 900 ms — fifteen times worse. The mean sits in a gap between two populations and describes neither of them. Worse, it is <em>reassuring</em>: 60 ms looks like a healthy API.</p>
</div>

<p>Look at the jump between p90 and p95: 19.9 ms to 900.8 ms, a 45× step in five percentage points. That cliff is the signature of a bimodal distribution — two different code paths, not one path with variance. The mean hides the cliff completely; the percentiles make it the most obvious thing on the page.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">p50</span><span class="lz-t">14.8 ms</span><span class="lz-d">the typical experience — what "it feels fast" means</span></div>
<div class="lz-step"><span class="lz-k">p90 → p95</span><span class="lz-t">19.9 → 900.8 ms</span><span class="lz-d">the cliff. Something different happens here</span></div>
<div class="lz-step"><span class="lz-k">p99</span><span class="lz-t">981.6 ms</span><span class="lz-d">one request in a hundred; at 100 rps that is one per second</span></div>
<div class="lz-step"><span class="lz-k">mean</span><span class="lz-t">60.8 ms</span><span class="lz-d">describes nobody, and hides both halves</span></div>
</div>

<h3>Measured again: 1,000 requests on the lab VPS</h3>
${slide('dv-09', 7, 'Trung bình 65 ms — không ai chờ 65 ms (1.000 request, VPS thí nghiệm)')}
${slide('dv-09', 8, 'Hai đám đông, một khe trống ở giữa — histogram 1.000 request')}
<p>The same shape, rebuilt from scratch so you can reproduce it: a tiny Python app behind nginx on the lab VPS, where 95% of <code>/api/don</code> requests take 10–20 ms and 5% take 850–980 ms (a stand-in for a cache miss or a heavy query). One thousand requests, timed by <code>curl</code>:</p>
<pre><code class="language-bash">for i in $(seq 1000); do
  curl -s -o /dev/null -w "%{time_total}\\n" localhost/api/don
done &gt; tre.txt
bash pv.sh &lt; tre.txt</code></pre>
<div class="out">  n = 1000
  trung binh :     65.2 ms
  p50        :     18.4 ms
  p90        :     24.2 ms
  p95        :    856.7 ms
  p99        :    956.6 ms
  max        :    984.6 ms</div>
<p>52 of the 1,000 requests took more than 500 ms. Bucketed by milliseconds, 938 requests sit at 10–29 ms, 52 at 800–999 ms, and the 50–99 ms bucket — where the mean of 65.2 ms lives — contains <strong>zero</strong> requests. That empty bucket is the whole lesson in one picture.</p>
<p><code>-w "%{time_total}\\n"</code> tells curl to print only the total time in seconds; <code>-o /dev/null</code> throws the body away; <code>-s</code> hides the progress bar. Run from the same machine as the server, this measures the server plus nginx and nothing of the network — keep that in mind before comparing it with what users see.</p>
<h3>Why the tail matters more than it looks</h3>
${slide('dv-09', 11, 'Đuôi 5% thành trải nghiệm của đa số: 0,95 mũ số lời gọi')}
<p>Two arguments, and the second is the one people underestimate.</p>

<p>First: a single page view is not one request. If loading a page makes twenty backend calls and each has a 5% chance of being slow, the chance that <em>all twenty</em> are fast is 0.95²⁰ ≈ 36%. Nearly two thirds of page loads hit at least one slow call. A "5% tail" at the request level is a majority experience at the page level.</p>

<p>Second: the slow requests are the ones that hold resources. Ten requests at 900 ms occupy connections, memory and worker slots for the same total time as 600 requests at 15 ms. Under load, the tail is what fills your connection pool — which is how a slow tail turns into a full outage without the mean moving much at all.</p>

<div class="pitfall">
<p><strong>Trap — you cannot average percentiles, and every dashboard invites you to.</strong> If one server reports p95=100 ms and another reports p95=300 ms, the fleet p95 is <em>not</em> 200 ms — that quantity has no meaning at all. Percentiles have to be computed from the underlying distribution, which is why real metric systems ship histogram buckets rather than pre-computed percentiles. Averaging p95 across servers, or across time buckets, produces a number that looks plausible and is arithmetic nonsense.</p>
</div>

<h3>Getting percentiles without a metrics stack</h3>
${slide('dv-09', 9, 'Phân vị bằng sort + awk — pv.sh, và vì sao ít mẫu thì p95 nhảy')}
<p>You do not need Prometheus for this. Nginx can log <code>$request_time</code> for every request — not in its default <code>combined</code> format, which has no duration field (Lesson 9.3 measures what that costs), but with one variable added to a <code>log_format</code> (the Nginx course covers the log format). With that field last on the line, the whole calculation is a sort:</p>

<pre><code><span class="tok-comment"># p50/p95/p99 tu mot tep log co truong thoi gian</span>
awk '{print \$NF}' access.log | sort -n | awk '
  {a[NR]=\$1}
  END{printf "p50=%.0fms p95=%.0fms p99=%.0fms max=%.0fms\\n",
      a[int(NR*.50)]*1000, a[int(NR*.95)]*1000, a[int(NR*.99)]*1000, a[NR]*1000}'</code></pre>

<p>Ten seconds of work, run from cron, appending one line an hour to a file. That is a latency history, and on a single small server it is genuinely enough.</p>

<div class="callout ok">
<p><strong>What to alert on.</strong> Not the mean, and not a fixed millisecond threshold either — those go stale as the app changes. Alert when <strong>p95 doubles relative to the same hour last week</strong>. That catches real regressions, ignores the daily traffic shape, and does not need retuning every time you ship a feature. The comparison needs a week of history, which is the argument for starting to record it before you need it.</p>
</div>

<h3>A sturdier version, and what "p95" means exactly</h3>
<p>The one-liner above indexes <code>a[int(NR*.95)]</code>. It works on large files, but <code>int()</code> rounds down, so on a tiny sample it can point at element 0, which does not exist (with one line, <code>int(1*.5)</code> is 0 and the p50 comes out empty). The version used for every number in this lesson uses the <em>nearest-rank</em> method — round the rank <strong>up</strong> — and prints the mean and the sample size next to it:</p>
<pre><code class="language-bash">#!/bin/bash
# pv.sh — doc cot so (giay) tu stdin, in trung binh + phan vi (ms)
sort -n | awk '{ a[NR]=$1; t+=$1 }
END {
  n=NR; if (n==0) exit 1
  printf "  n = %d\\n", n
  printf "  trung binh : %8.1f ms\\n", t/n*1000
  split("50 90 95 99", P, " ")
  for (i=1; i&lt;=4; i++) { k=int(n*P[i]/100+0.999); printf "  p%-9s : %8.1f ms\\n", P[i], a[k]*1000 }
  printf "  max        : %8.1f ms\\n", a[n]*1000
}'</code></pre>
<p>"p95 = 856.7 ms" means: sort all 1,000 times, and the 950th one is 856.7 ms — 95% of requests were at or below it. Feeding it nginx&#39;s own <code>rt=</code> field instead of curl&#39;s timing gives the same shape (p50 18.0, p95 856.0 ms), because both measure the same requests from nearly the same place.</p>
<div class="callout warn"><p><strong>Small samples make p95 jump.</strong> An earlier run of the same app with only 400 requests happened to get 15 slow ones (3.75%) instead of 5% — and its p95 came out as <strong>31.4 ms</strong>, not 857. When the cliff sits right next to the 95% mark, a few requests either way move p95 from one side of it to the other. Always report percentiles with <code>n</code>, and do not compare a p95 from 400 requests with one from 10,000.</p></div>

<h3>Measured: averaging two p95 values</h3>
${slide('dv-09', 10, 'Không lấy trung bình các p95: 440,6 ms thay cho 25,9 ms thật')}
<p>The pitfall above, with real numbers. "Server A" is the 1,000 requests with a slow tail; "server B" is 948 fast requests only:</p>
<div class="out">may A: p95=856.7 ms  (1000 mau)
may B: p95=24.4 ms  (948 mau)
trung binh hai p95: 440.6 ms
p95 THAT cua ca hai: 25.9 ms</div>
<p>The spreadsheet answer is 440.6 ms, seventeen times the real p95 of the combined traffic. Nothing about 440.6 ms happened to anyone. If you need a fleet-wide percentile, merge the raw data (or histogram buckets, which can be added) and compute it once.</p>
<h3>The same trap in every other number</h3>
<div class="kv-grid">
<div class="kv"><span class="k">average CPU over 5 minutes</span><span class="v">hides a 30-second pin at 100% — the exact window in which requests queued and timed out</span></div>
<div class="kv"><span class="k">average memory</span><span class="v">hides the peak, which is the only number the OOM killer cares about (8.5)</span></div>
<div class="kv"><span class="k">average error rate per day</span><span class="v">hides a total outage lasting twenty minutes</span></div>
<div class="kv"><span class="k">the general rule</span><span class="v">averages hide the extremes, and the extremes are the incident. Record max and p95 alongside every mean</span></div>
</div>

<p>Chapter 8 made this argument for memory without naming it: <code>memory.max_usage_in_bytes</code> is worth reading precisely because it is a <em>peak</em>, and a process is killed by its peak, not by its average.</p>

<h3>A note on what my measurement is not</h3>
<p>These 200 samples came from <code>curl</code> on the same machine as the service, so they include no network and no client-side time. Real percentiles measured from the user&#39;s side will be worse — sometimes much worse — because they include TLS handshakes, DNS, and the mobile connection the user is actually on. The shape of the distribution is the point here; the absolute numbers belong to this sandbox and nowhere else.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the group dashboard says the API averages 60 ms and everybody is happy, but two testers keep complaining that "sometimes it hangs for a second". Prove who is right with percentiles.</p>
<ol>
<li>On the lab VPS run a small app on <code>127.0.0.1:8080</code> whose <code>/api/don</code> sleeps 10–20 ms normally and 850–980 ms one time in twenty, behind nginx on port 80.</li>
<li>Collect 1,000 timings with the curl loop from this lesson into <code>tre.txt</code> and run <code>bash pv.sh &lt; tre.txt</code>.</li>
<li>Count the slow ones with <code>awk '$1&gt;0.5' tre.txt | wc -l</code>, then repeat the whole run with 200 requests and compare the p95.</li>
<li>Split the file in two (<code>head -500</code>/<code>tail -500</code>), compute each half&#39;s p95, and compare their average with the p95 of the whole file.</li>
</ol>
<p><strong>Done when:</strong> you can state mean, p50 and p95 with <code>n</code>, show the p90→p95 cliff, and explain why the 200-request p95 differs from the 1,000-request one.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Latency (độ trễ)</span><span class="v">Time from sending a request to receiving the full response.</span></div>
<div class="kv"><span class="k">Percentile, p95 (phân vị, phân vị 95)</span><span class="v">The value 95% of samples are at or below, after sorting.</span></div>
<div class="kv"><span class="k">Tail latency (độ trễ đuôi)</span><span class="v">The slow end of the distribution — p95, p99, max — where incidents live.</span></div>
<div class="kv"><span class="k">Bimodal distribution (phân bố hai đỉnh)</span><span class="v">Two separate groups of values, a sign of two code paths.</span></div>
<div class="kv"><span class="k">Nearest-rank (hạng gần nhất)</span><span class="v">Percentile method: take element ⌈n·p/100⌉ of the sorted list.</span></div>
<div class="kv"><span class="k">Histogram bucket (thùng histogram)</span><span class="v">A count of samples in a value range; buckets add up across servers, percentiles do not.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The mean of 65.2 ms sat in an empty bucket: 938 requests were under 30 ms and 52 were over 800 ms.</li>
<li>A jump between p90 and p95 means two code paths, not noise.</li>
<li><code>sort -n</code> plus a few lines of awk give p50/p95/p99 from any log with a duration field.</li>
<li>Percentiles need their sample size: 400 requests gave p95 31.4 ms, 1,000 gave 856.7 ms.</li>
<li>Never average percentiles — 440.6 ms against a real 25.9 ms; merge the data or the buckets instead.</li>
</ul>
<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Gil Tene — How NOT to measure latency</span><span class="lc-sub">A talk worth watching in full (search "Tene coordinated omission"). Its core point: most latency tools stop sending requests while the system is stalled, so they systematically miss the worst numbers.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prometheus — histograms and summaries</span><span class="lc-sub">prometheus.io/docs/practices/histograms/ — explains directly why percentiles must be computed from buckets and cannot be averaged, the trap above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Service Level Objectives</span><span class="lc-sub">sre.google/sre-book/service-level-objectives/ — why an SLO is stated as a percentile over a window rather than as an average, and how to pick the window.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — log_format and \$request_time</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_log_module.html — the variable that makes the awk one-liner above possible, plus <code>\$upstream_response_time</code> for separating your app&#39;s time from the proxy&#39;s.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — a log format that answers questions</span><span class="lc-sub">/courses/nginx/learn${REF} — which variables to log so latency, cache status and upstream can be separated afterwards.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Trung bình cũng NÓI DỐI</h2>
<p class="lead">Bài 9.1 nói về một con số ĐẾN MUỘN. Bài này nói về một con số đúng giờ, chính xác, và vẫn mô tả một trải nghiệm mà KHÔNG AI có.</p>

<h3>Phép đo</h3>
<p>Một dịch vụ có hình dạng độ trễ thực tế: phần lớn request thì nhanh, và một trên hai mươi phải làm một việc đắt đỏ. 200 request HTTP thật, bấm giờ bằng <code>curl</code>:</p>

<div class="out">  n = 200 request
  trung binh :     60.8 ms   ← con so tren bang dieu khien
  p50        :     14.8 ms
  p90        :     19.9 ms
  p95        :    900.8 ms   ← 1 tren 20 nguoi dung
  p99        :    981.6 ms
  max        :    982.4 ms
  so request > 500 ms: 10 (5%)</div>

<div class="callout warn">
<p><strong>KHÔNG AI chờ 60,8 ms cả.</strong> Một nửa người dùng nhận 14,8 ms — tốt hơn trung bình bốn lần. Một trên hai mươi nhận 900 ms — tệ hơn mười lăm lần. Cái trung bình ngồi trong khe giữa hai đám đông và không mô tả đám nào. Tệ hơn, nó còn <em>TRẤN AN</em>: 60 ms trông như một API khoẻ mạnh.</p>
</div>

<p>Nhìn cú nhảy giữa p90 và p95: 19,9 ms lên 900,8 ms, một bậc thang gấp 45 lần trong năm điểm phần trăm. Cái vách đó là chữ ký của một phân bố HAI ĐỈNH — hai đường mã khác nhau, chứ không phải một đường mã có độ tản. Trung bình giấu cái vách đi hoàn toàn; các phân vị làm nó thành thứ hiển nhiên nhất trên trang.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">p50</span><span class="lz-t">14,8 ms</span><span class="lz-d">trải nghiệm điển hình — đây là ý nghĩa của "thấy nó nhanh"</span></div>
<div class="lz-step"><span class="lz-k">p90 → p95</span><span class="lz-t">19,9 → 900,8 ms</span><span class="lz-d">cái vách. Ở đây có chuyện gì đó KHÁC đang xảy ra</span></div>
<div class="lz-step"><span class="lz-k">p99</span><span class="lz-t">981,6 ms</span><span class="lz-d">một request trên một trăm; ở 100 rps thì đó là một cái mỗi giây</span></div>
<div class="lz-step"><span class="lz-k">trung bình</span><span class="lz-t">60,8 ms</span><span class="lz-d">mô tả không ai cả, và giấu đi cả hai nửa</span></div>
</div>

<h3>Đo lại: 1.000 request trên VPS thí nghiệm</h3>
${slide('dv-09', 7, 'Trung bình 65 ms — không ai chờ 65 ms (1.000 request, VPS thí nghiệm)')}
${slide('dv-09', 8, 'Hai đám đông, một khe trống ở giữa — histogram 1.000 request')}
<p>Cùng hình dạng đó, dựng lại từ đầu để bạn làm lại được: một app Python nhỏ đứng sau nginx trên VPS thí nghiệm, 95% request tới <code>/api/don</code> mất 10–20 ms còn 5% mất 850–980 ms (đóng vai một lần hụt cache hay một truy vấn nặng). Một nghìn request, bấm giờ bằng <code>curl</code>:</p>
<pre><code class="language-bash">for i in $(seq 1000); do
  curl -s -o /dev/null -w "%{time_total}\\n" localhost/api/don
done &gt; tre.txt
bash pv.sh &lt; tre.txt</code></pre>
<div class="out">  n = 1000
  trung binh :     65.2 ms
  p50        :     18.4 ms
  p90        :     24.2 ms
  p95        :    856.7 ms
  p99        :    956.6 ms
  max        :    984.6 ms</div>
<p>52 trên 1.000 request mất hơn 500 ms. Chia theo thùng mili giây: 938 request nằm ở 10–29 ms, 52 ở 800–999 ms, còn thùng 50–99 ms — nơi con trung bình 65,2 ms sống — chứa <strong>KHÔNG</strong> request nào. Cái thùng rỗng ấy là cả bài học gói trong một bức hình.</p>
<p><code>-w "%{time_total}\\n"</code> bảo curl chỉ in tổng thời gian tính bằng giây; <code>-o /dev/null</code> vứt phần thân; <code>-s</code> giấu thanh tiến trình. Chạy từ CHÍNH máy chủ, phép đo này gồm máy chủ cộng nginx và không có chút mạng nào — nhớ điều đó trước khi so với thứ người dùng thấy.</p>
<h3>Vì sao cái đuôi quan trọng hơn vẻ ngoài</h3>
${slide('dv-09', 11, 'Đuôi 5% thành trải nghiệm của đa số: 0,95 mũ số lời gọi')}
<p>Hai lập luận, và cái thứ hai là cái người ta hay đánh giá thấp.</p>

<p>Thứ nhất: một lượt xem trang không phải MỘT request. Nếu tải một trang gọi hai mươi lời gọi backend và mỗi cái có 5% khả năng chậm, thì xác suất <em>CẢ HAI MƯƠI</em> đều nhanh là 0,95²⁰ ≈ 36%. Gần hai phần ba số lượt tải trang dính ít nhất một lời gọi chậm. Một "cái đuôi 5%" ở mức REQUEST là trải nghiệm của ĐA SỐ ở mức TRANG.</p>

<p>Thứ hai: các request chậm là những cái GIỮ tài nguyên. Mười request ở 900 ms chiếm kết nối, bộ nhớ và suất thợ trong cùng tổng thời gian với 600 request ở 15 ms. Dưới tải, cái đuôi mới là thứ làm đầy bể kết nối của bạn — và đó là cách một cái đuôi chậm biến thành một cú sập toàn phần mà trung bình gần như không nhúc nhích.</p>

<div class="pitfall">
<p><strong>Bẫy — bạn KHÔNG lấy trung bình của các phân vị được, và mọi bảng điều khiển đều mời bạn làm thế.</strong> Nếu một máy chủ báo p95=100 ms và một máy khác báo p95=300 ms, thì p95 của cả đội <em>KHÔNG</em> phải 200 ms — cái đại lượng đó không có nghĩa gì cả. Phân vị phải được tính từ PHÂN BỐ nằm dưới, và đó là lý do các hệ số đo nghiêm túc gửi đi các thùng histogram chứ không gửi phân vị tính sẵn. Lấy trung bình p95 qua các máy chủ, hay qua các khoảng thời gian, đẻ ra một con số trông có lý và là vô nghĩa về mặt số học.</p>
</div>

<h3>Có phân vị mà không cần cả một hệ đo</h3>
${slide('dv-09', 9, 'Phân vị bằng sort + awk — pv.sh, và vì sao ít mẫu thì p95 nhảy')}
<p>Bạn không cần Prometheus cho việc này. Nginx GHI ĐƯỢC <code>$request_time</code> cho mỗi request — không phải trong định dạng mặc định <code>combined</code>, thứ không có trường thời lượng nào (Bài 9.3 đo xem điều đó tốn gì), mà bằng cách thêm một biến vào <code>log_format</code> (khoá Nginx nói về định dạng log). Khi trường đó đứng cuối dòng, toàn bộ phép tính là một lần sắp xếp:</p>

<pre><code><span class="tok-comment"># p50/p95/p99 tu mot tep log co truong thoi gian</span>
awk '{print \$NF}' access.log | sort -n | awk '
  {a[NR]=\$1}
  END{printf "p50=%.0fms p95=%.0fms p99=%.0fms max=%.0fms\\n",
      a[int(NR*.50)]*1000, a[int(NR*.95)]*1000, a[int(NR*.99)]*1000, a[NR]*1000}'</code></pre>

<p>Mười giây công sức, chạy từ cron, nối một dòng mỗi giờ vào một tệp. Đó là một lịch sử độ trễ, và trên một máy chủ nhỏ đơn lẻ thì nó thật sự là ĐỦ.</p>

<div class="callout ok">
<p><strong>Báo động theo cái gì.</strong> Không phải trung bình, và cũng không phải một ngưỡng mili giây cố định — mấy cái đó ôi thiu dần khi ứng dụng đổi. Hãy báo động khi <strong>p95 tăng GẤP ĐÔI so với cùng giờ đó tuần trước</strong>. Nó bắt được các cú thụt lùi thật, phớt lờ hình dạng lưu lượng theo ngày, và không cần chỉnh lại mỗi khi bạn phát hành một tính năng. Phép so sánh ấy cần một tuần lịch sử, và đó là lý lẽ cho việc bắt đầu ghi lại TRƯỚC khi bạn cần tới.</p>
</div>

<h3>Một bản chắc hơn, và "p95" nghĩa là gì cho chính xác</h3>
<p>Dòng awk ở trên lấy phần tử <code>a[int(NR*.95)]</code>. Với tệp lớn thì chạy, nhưng <code>int()</code> làm tròn XUỐNG, nên với mẫu rất nhỏ nó có thể trỏ vào phần tử số 0 vốn không tồn tại (một dòng thôi thì <code>int(1*.5)</code> là 0 và p50 ra rỗng). Bản dùng cho mọi con số trong bài này theo cách <em>nearest-rank (hạng gần nhất)</em> — làm tròn hạng LÊN — và in kèm trung bình với cỡ mẫu:</p>
<pre><code class="language-bash">#!/bin/bash
# pv.sh — doc cot so (giay) tu stdin, in trung binh + phan vi (ms)
sort -n | awk '{ a[NR]=$1; t+=$1 }
END {
  n=NR; if (n==0) exit 1
  printf "  n = %d\\n", n
  printf "  trung binh : %8.1f ms\\n", t/n*1000
  split("50 90 95 99", P, " ")
  for (i=1; i&lt;=4; i++) { k=int(n*P[i]/100+0.999); printf "  p%-9s : %8.1f ms\\n", P[i], a[k]*1000 }
  printf "  max        : %8.1f ms\\n", a[n]*1000
}'</code></pre>
<p>"p95 = 856,7 ms" nghĩa là: xếp cả 1.000 thời gian tăng dần, cái thứ 950 là 856,7 ms — 95% request bằng hoặc nhanh hơn nó. Đưa vào trường <code>rt=</code> trong log của chính nginx thay cho số của curl cho ra cùng hình dạng (p50 18,0, p95 856,0 ms), vì cả hai đo cùng những request từ gần như cùng một chỗ.</p>
<div class="callout warn"><p><strong>Mẫu nhỏ làm p95 nhảy.</strong> Một lượt trước đó của cùng app chỉ với 400 request tình cờ có 15 cái chậm (3,75%) thay vì 5% — và p95 của nó ra <strong>31,4 ms</strong>, không phải 857. Khi cái vách nằm ngay sát mốc 95%, vài request lệch qua lệch lại là đủ đẩy p95 sang bên này hay bên kia vách. Luôn báo phân vị kèm <code>n</code>, và đừng so p95 của 400 request với p95 của 10.000 request.</p></div>

<h3>Đo thật: lấy trung bình hai giá trị p95</h3>
${slide('dv-09', 10, 'Không lấy trung bình các p95: 440,6 ms thay cho 25,9 ms thật')}
<p>Cái bẫy ở trên, với số thật. "Máy A" là 1.000 request có đuôi chậm; "máy B" chỉ có 948 request nhanh:</p>
<div class="out">may A: p95=856.7 ms  (1000 mau)
may B: p95=24.4 ms  (948 mau)
trung binh hai p95: 440.6 ms
p95 THAT cua ca hai: 25.9 ms</div>
<p>Câu trả lời kiểu bảng tính là 440,6 ms, gấp mười bảy lần p95 thật của lưu lượng gộp. Chẳng có gì mất 440,6 ms với ai cả. Cần phân vị cho cả cụm thì gộp dữ liệu thô (hoặc các thùng histogram — thùng thì CỘNG được) rồi tính một lần.</p>
<h3>Cùng cái bẫy đó trong mọi con số khác</h3>
<div class="kv-grid">
<div class="kv"><span class="k">CPU trung bình trong 5 phút</span><span class="v">giấu đi một cú ghim 100% dài 30 giây — đúng cái cửa sổ mà request xếp hàng rồi hết giờ</span></div>
<div class="kv"><span class="k">bộ nhớ trung bình</span><span class="v">giấu đi cái ĐỈNH, con số duy nhất mà OOM killer quan tâm (8.5)</span></div>
<div class="kv"><span class="k">tỷ lệ lỗi trung bình theo ngày</span><span class="v">giấu đi một cú sập toàn phần dài hai mươi phút</span></div>
<div class="kv"><span class="k">quy tắc chung</span><span class="v">trung bình giấu các cực trị, và các cực trị chính là sự cố. Hãy ghi max và p95 cạnh MỌI con trung bình</span></div>
</div>

<p>Chương 8 đã đưa ra lập luận này cho bộ nhớ mà không gọi tên nó: <code>memory.max_usage_in_bytes</code> đáng đọc CHÍNH VÌ nó là một cái <em>ĐỈNH</em>, và một tiến trình bị giết bởi cái đỉnh của nó, không phải bởi cái trung bình.</p>

<h3>Một ghi chú về việc phép đo của tôi KHÔNG phải cái gì</h3>
<p>200 mẫu này tới từ <code>curl</code> chạy trên cùng cái máy với dịch vụ, nên chúng không gồm mạng và không gồm thời gian phía máy khách. Phân vị thật đo từ phía NGƯỜI DÙNG sẽ tệ hơn — đôi khi tệ hơn nhiều — vì chúng gồm cả bắt tay TLS, DNS, và cái kết nối di động mà người dùng đang thật sự ngồi trên đó. HÌNH DẠNG của phân bố mới là điểm cần rút ra ở đây; các con số tuyệt đối thuộc về hộp cát này và không thuộc về đâu khác.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bảng điều khiển của nhóm nói API trung bình 60 ms và ai cũng vui, nhưng hai bạn kiểm thử cứ than "thỉnh thoảng nó treo cả giây". Hãy chứng minh ai đúng bằng phân vị.</p>
<ol>
<li>Trên VPS thí nghiệm, chạy một app nhỏ ở <code>127.0.0.1:8080</code> mà <code>/api/don</code> bình thường ngủ 10–20 ms và cứ hai mươi lần thì có một lần ngủ 850–980 ms, đứng sau nginx ở cổng 80.</li>
<li>Thu 1.000 thời gian bằng vòng curl của bài này vào <code>tre.txt</code> rồi chạy <code>bash pv.sh &lt; tre.txt</code>.</li>
<li>Đếm số request chậm bằng <code>awk '$1&gt;0.5' tre.txt | wc -l</code>, rồi làm lại cả lượt với 200 request và so p95.</li>
<li>Chia tệp làm đôi (<code>head -500</code>/<code>tail -500</code>), tính p95 từng nửa, rồi so trung bình của chúng với p95 của cả tệp.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nêu được trung bình, p50 và p95 kèm <code>n</code>, chỉ ra cái vách p90→p95, và giải thích vì sao p95 của 200 request khác p95 của 1.000 request.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Latency (độ trễ)</span><span class="v">Thời gian từ lúc gửi request tới lúc nhận đủ phản hồi.</span></div>
<div class="kv"><span class="k">Percentile, p95 (phân vị, phân vị 95)</span><span class="v">Giá trị mà 95% mẫu bằng hoặc thấp hơn, sau khi sắp xếp.</span></div>
<div class="kv"><span class="k">Tail latency (độ trễ đuôi)</span><span class="v">Đầu chậm của phân bố — p95, p99, max — nơi sự cố sống.</span></div>
<div class="kv"><span class="k">Bimodal distribution (phân bố hai đỉnh)</span><span class="v">Hai nhóm giá trị tách rời, dấu hiệu của hai đường mã.</span></div>
<div class="kv"><span class="k">Nearest-rank (hạng gần nhất)</span><span class="v">Cách tính phân vị: lấy phần tử thứ ⌈n·p/100⌉ của danh sách đã xếp.</span></div>
<div class="kv"><span class="k">Histogram bucket (thùng histogram)</span><span class="v">Số mẫu rơi vào một khoảng giá trị; thùng cộng được qua nhiều máy, phân vị thì không.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Trung bình 65,2 ms nằm trong một thùng RỖNG: 938 request dưới 30 ms và 52 request trên 800 ms.</li>
<li>Cú nhảy giữa p90 và p95 nghĩa là hai đường mã, không phải nhiễu.</li>
<li><code>sort -n</code> cộng vài dòng awk cho ra p50/p95/p99 từ bất kỳ log nào có trường thời lượng.</li>
<li>Phân vị cần đi kèm cỡ mẫu: 400 request cho p95 31,4 ms, 1.000 request cho 856,7 ms.</li>
<li>Đừng bao giờ lấy trung bình các phân vị — 440,6 ms so với 25,9 ms thật; hãy gộp dữ liệu hoặc gộp thùng.</li>
</ul>
<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Gil Tene — How NOT to measure latency</span><span class="lc-sub">Một bài nói đáng xem trọn vẹn (tìm "Tene coordinated omission"). Điểm cốt lõi: phần lớn công cụ đo độ trễ NGỪNG gửi request trong lúc hệ thống đang kẹt, nên chúng bỏ sót một cách có hệ thống đúng những con số tệ nhất.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prometheus — histogram và summary</span><span class="lc-sub">prometheus.io/docs/practices/histograms/ — giải thích thẳng vì sao phân vị phải tính từ các thùng và không lấy trung bình được, đúng cái bẫy ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Service Level Objectives</span><span class="lc-sub">sre.google/sre-book/service-level-objectives/ — vì sao một SLO được phát biểu bằng một phân vị trên một cửa sổ chứ không phải bằng trung bình, và chọn cửa sổ thế nào.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — log_format và \$request_time</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_log_module.html — cái biến làm cho dòng awk ở trên khả thi, cộng <code>\$upstream_response_time</code> để tách thời gian của ứng dụng khỏi thời gian của proxy.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — một định dạng log trả lời được câu hỏi</span><span class="lc-sub">/courses/nginx/learn${REF} — ghi những biến nào để sau này tách được độ trễ, trạng thái bộ đệm và upstream.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 9.3 ─────────────────────────── */
    {
      title: '9.3 — Logs that answer questions|||9.3 — Log TRẢ LỜI ĐƯỢC câu hỏi',
      slug: 'deploy-9-3-log',
      type: 'VIDEO',
      description: '200.000 dòng log sinh ra ở hai định dạng, rồi hỏi cả hai cùng một câu. Log thuần trả lời trong 82 mili giây — và trả lời SAI, vì nó không có trường thời gian. JSON mất 497 ms và trả lời đúng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>Logs that answer questions</h2>
<p class="lead">Metrics tell you something is wrong. Logs are supposed to tell you what. Whether they can depends entirely on decisions you made before the incident, and the most consequential one is which fields you wrote down.</p>

<h3>The question</h3>
${slide('dv-09', 12, 'Log thiếu trường: trả lời nhanh mà SAI — và log_format có đủ trường')}
<p>200,000 requests written to two formats — the nginx <code>combined</code> default and one line of JSON per event — and then a question a real incident would produce: <em>which URIs are returning 5xx and taking more than two seconds?</em></p>

<div class="out">--- tren log THUAN (combined) ---
    830 /api/v1/don
    817 /api/v1/nguoi-dung/42
    792 /health
  → 82 ms  — VA khong tra loi duoc phan 'cham hon 2 giay':
             combined KHONG co truong thoi gian

--- tren log JSON ---
     281 /api/v1/don
     280 /api/v1/nguoi-dung/42
     257 /health
  → 538 ms</div>

<div class="callout warn">
<p><strong>The fast answer is the wrong answer.</strong> <code>awk</code> over the plain log took 82 ms and returned 830 — but that is <em>every</em> 5xx on that URI, because the combined format has no <code>$request_time</code> field. The question cannot be answered from that file at any speed. The correct number is 281, and getting it cost 538 ms. Six times slower and actually true.</p>
</div>

<p><code>jq</code> did the same work in 497 ms, close enough to the hand-written Python to say the parsing cost is inherent to JSON rather than to the tool.</p>

<h3>What that costs in disk</h3>
<div class="out">  json.log           23.5 MB
  ket-hop.log        22.2 MB
  → cung 200.000 su kien: JSON to hon 1.06 lan

  ket-hop.log: 22.2 MB → 1.4 MB (ti le 15.4x)
  json.log: 23.5 MB → 1.9 MB (ti le 12.1x)</div>

<p>Six percent larger — far less than people expect, because the repeated key names compress extremely well. Both formats shrink by more than 12× under plain gzip, which is the real lesson: <strong>rotate and compress, and the format barely matters for storage.</strong> 200,000 requests is about 1.4–1.9 MB compressed, so a small site keeping ninety days of logs is talking about a few hundred megabytes — affordable even on the disk from Chapter 8.</p>

<h3>The fields worth having</h3>
<p>Format is a smaller decision than content. The combined format loses because of what it omits, not because of its syntax:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">timestamp, status, method, path</span><span class="lz-lnote">every format has these; they are not the interesting part</span></div>
<div class="lz-layer"><span class="lz-lname">request duration</span><span class="lz-lnote">the field the whole measurement above turned on. Without it, no percentiles (9.2) and no "slow" query</span></div>
<div class="lz-layer"><span class="lz-lname">upstream duration, separately</span><span class="lz-lnote">splits "my app is slow" from "the proxy is slow" without guessing</span></div>
<div class="lz-layer"><span class="lz-lname">a request id</span><span class="lz-lnote">one identifier tying the proxy line to the application lines. This is what makes a log searchable rather than readable</span></div>
<div class="lz-layer"><span class="lz-lname">release version</span><span class="lz-lnote">so "did this start with the deploy?" is a query rather than an argument (6.3 made the same case for data rows)</span></div>
<div class="lz-layer"><span class="lz-lname">user or tenant id</span><span class="lz-lnote">so "is it everyone or one customer?" is answerable in one command</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — a log line is a place secrets go to be permanently archived.</strong> Logging a full request body captures passwords on the login route. Logging headers captures <code>Authorization</code> and session cookies. Logging a query string captures a password-reset token. And unlike a leak in memory, this one is written to disk, shipped to an aggregator, backed up, and retained for months — Chapter 4&#39;s rules about where secrets may appear apply to logs with more force than anywhere else, because logs are the one place you are deliberately keeping everything. Choose fields explicitly; never log whole objects.</p>
</div>

<h3>Structured does not mean JSON everywhere</h3>
<p>The measurement above compares two extremes, and there is a middle that is often the right answer on a single server: keep the human-readable format and <em>add the fields you need</em>. Nginx makes this trivial:</p>

<pre><code>log_format huu_dung '\$remote_addr \$status \$request_time \$upstream_response_time '
                    '\$upstream_addr \$upstream_status "\$request_uri" '
                    '\$body_bytes_sent \$upstream_cache_status';</code></pre>

<p>Still one line per request, still greppable with <code>awk</code> at 82 ms, and now it contains the duration. You lose JSON&#39;s robustness against fields containing spaces, and you keep the speed. On one server that is usually the better trade; the argument for JSON gets much stronger the moment a machine is shipping logs to something that will parse them.</p>

<div class="callout ok">
<p><strong>What is genuinely worth doing on a small VPS.</strong> Log to files, rotate with <code>logrotate</code> (daily, compress, keep 14–30), and cap the journal with <code>SystemMaxUse=</code> — Chapter 8 measured what an uncapped log does to a disk shared with the database. Do not ship logs off the box until you have a reason to; a single server&#39;s logs are searchable with <code>grep</code> and <code>awk</code> in milliseconds, as measured above.</p>
</div>

<h3>Reading JSON logs from journald with jq</h3>
${slide('dv-09', 13, 'Log JSON: hỏi như hỏi cơ sở dữ liệu — và vì sao jq chết ở dòng 1')}
<p>On a VPS, an app run by systemd writes to stdout and journald stores it; <code>journalctl -u app</code> reads it back. The lab app writes one JSON object per request (<code>ts</code>, <code>level</code>, <code>path</code>, <code>status</code>, <code>ms</code>, <code>req_id</code>, <code>ban</code> = release). The obvious first query fails:</p>
<div class="out">$ journalctl -u app -o cat | jq -r 'select(.level=="error") | .path'
jq: parse error: Invalid numeric literal at line 1, column 8
$ journalctl -u app -o cat | grep -v "^{" | head -1
Started app.service - Ung dung thu (Chuong 9).</div>
<p>journald mixes systemd&#39;s own messages about the unit ("Started…", "Stopping…") into the same stream, and plain <code>jq</code> gives up at the first line that is not JSON. The fix is to read raw lines and parse only the ones that are JSON:</p>
<div class="out">$ journalctl -u app -o cat | jq -R -r 'fromjson? | select(.level=="error") | .path' | sort | uniq -c
     25 /api/don
$ journalctl -u app -o cat | jq -R -r 'fromjson? | select(.status&gt;=500 and .ms&gt;500) | [.ts,.status,.ms,.req_id[0:8]] | @tsv' | head -2
2026-09-29T06:31:38	500	967.4	61b63b4a
2026-09-29T06:31:40	500	953.1	52469d98</div>
<table><tr><th>jq piece</th><th>What it does</th></tr>
<tr><td><code>-R</code></td><td>read each input line as a raw string instead of as JSON</td></tr>
<tr><td><code>fromjson?</code></td><td>try to parse the string as JSON; the <code>?</code> silently drops lines that are not</td></tr>
<tr><td><code>select(cond)</code></td><td>keep only objects where the condition is true — the WHERE of a query</td></tr>
<tr><td><code>[.a,.b] | @tsv</code> with <code>-r</code></td><td>print fields as tab-separated columns without quotes, ready for <code>sort</code>/<code>awk</code></td></tr>
<tr><td><code>.req_id[0:8]</code></td><td>a slice: the first eight characters of a string</td></tr>
<tr><td><code>-s</code> + <code>group_by(.status)</code></td><td>collect the whole stream into one array and group it</td></tr></table>

<h3>journalctl, flag by flag — and why -p err finds nothing</h3>
${slide('dv-09', 14, '-p err không thấy lỗi nào: journald không đọc JSON — bảng cờ journalctl')}
<div class="out">$ journalctl -u app -p err
-- No entries --
$ journalctl -u app -o cat | grep -c '"level": "error"'
25</div>
<p>Twenty-five error lines exist and <code>-p err</code> finds none. journald assigns a priority per <em>stream</em>: everything a service writes to stdout is stored at priority 6 (info), whatever the text says. The word "error" lives inside your JSON, and journald does not read JSON. Either query the field with <code>jq</code>, or make the app log through syslog/<code>sd_journal</code> with a real priority, or prefix lines with <code>&lt;3&gt;</code> (the kernel-style priority prefix journald understands on stdout).</p>
<table><tr><th>Flag</th><th>Meaning</th></tr>
<tr><td><code>-u app</code> / <code>--user -u x</code></td><td>entries of one system unit / one user unit</td></tr>
<tr><td><code>-t NAME</code></td><td>entries whose SYSLOG_IDENTIFIER is NAME (usually the program name)</td></tr>
<tr><td><code>--since "10 min ago"</code>, <code>--until</code></td><td>time window; also accepts <code>2026-09-29 06:00</code></td></tr>
<tr><td><code>-p err</code></td><td>priority err or more severe — only works when the priority was really set</td></tr>
<tr><td><code>-g REGEX</code></td><td>grep inside the message field (journald ≥ 237)</td></tr>
<tr><td><code>-o cat</code> / <code>-o short-iso</code> / <code>-o verbose</code></td><td>message only / ISO timestamps / every stored field</td></tr>
<tr><td><code>-f</code>, <code>-n 50</code>, <code>--no-pager</code></td><td>follow, last 50, do not open <code>less</code> (needed in scripts)</td></tr></table>

<h3>One request id across the proxy and the app</h3>
${slide('dv-09', 15, 'Một request id nối nginx với ứng dụng: 983 ms ở nginx, 967,8 ms ở app')}
<p>The lab nginx logs <code>rid=$request_id</code> and passes the same value to the app with <code>proxy_set_header X-Request-Id $request_id;</code>; the app writes it as <code>req_id</code>. One slow 500, followed through both logs:</p>
<div class="out">$ grep rid=$R /var/log/nginx/dodo.log | awk '{print $5, $7, $9, $10}'
/api/don 500 rt=0.983 urt=0.983
$ journalctl -u app -o cat | grep $R | jq -c '{ts,level,status,ms,ban}'
{"ts":"2026-09-29T06:38:13","level":"error","status":500,"ms":967.8,"ban":"v42"}</div>
<p>nginx says 983 ms, the app says 967.8 ms: about 15 ms is connection and proxy overhead, the rest is the app. Because the line also carries <code>"ban":"v42"</code>, "did this start with the last deploy?" becomes a query over the release field instead of a debate.</p>

<h3>When the log exists but your search cannot see it</h3>
${slide('dv-09', 16, 'Log có đó mà lệnh tìm không thấy: docker logs tách stderr; journald mất nhãn unit')}
<p>Two measurements where the line is in the log and the obvious command reports nothing. First, <code>docker logs</code> (a container that crashes with a library error, run on the Mac):</p>
<div class="out">$ docker logs dv09-api | grep -c -i error
Error: loading shared library libssl.so.3
0
$ docker logs dv09-api 2&gt;&amp;1 | grep -c -i error
1</div>
<p><code>docker logs</code> replays the container&#39;s stdout on your stdout and its <strong>stderr on your stderr</strong>. The error line is printed on the terminal, but it never enters the pipe, so <code>grep</code> counts zero. Always add <code>2&gt;&amp;1</code>; useful companions are <code>--since 10m</code>, <code>--tail 100</code> and <code>-t</code> (timestamps).</p>
<p>Second, journald and very short-lived processes. The real home-machine monitor in Lesson 9.5 is a <em>user</em> unit (<code>systemctl --user</code>) whose script prints its findings through <code>| tr</code>. Reproduced on the lab VPS with six runs:</p>
<div class="out">$ journalctl --user -u canh-vps -g HONG -o cat | wc -l
0
$ journalctl --user -t canh-vps.sh -g HONG -o cat | wc -l
6
$ journalctl --user -t canh-vps.sh -g HONG -o verbose -n 1 | grep -E "_SYSTEMD_USER_UNIT|_COMM|_LINE_BREAK|MESSAGE"
    _LINE_BREAK=pid-change
    MESSAGE=HONG: 1 container da CHET (exited) Dia 91%</div>
<p>The line was written by <code>tr</code>, a child that exited within milliseconds. By the time journald looked up which unit the writer belonged to, the process was gone — so the entry has no <code>_SYSTEMD_USER_UNIT</code> field, and <code>-u</code>, which filters on that field, skips it. <code>-t</code> filters on the identifier attached to the stream and finds all six. Rewriting the line with the shell builtin <code>printf</code> (no child process) raised <code>-u</code> to 5 of 6, not 6 — the script itself also exits quickly. On the real home machine the same query over one day returns 0 lines with <code>-u</code> and 264 with <code>-t</code>. For short scripts, search by <code>-t</code>.</p>
<div class="callout ok"><p><strong>On Windows/WSL and macOS.</strong> <code>docker logs</code> behaves the same on Docker Desktop for Mac and Windows. There is no journald on macOS (<code>log show --last 10m</code> is the unrelated local equivalent) and none on WSL unless systemd is enabled in <code>/etc/wsl.conf</code>. <code>jq</code> exists everywhere (<code>brew install jq</code>, <code>winget install jqlang.jq</code>), so the queries in this lesson also work on a log file copied off the server.</p></div>
<h3>The lines that should never be written</h3>
<p>The most common failure in logging is not too little, it is too much. A log that records every successful request at INFO level, with a full object dump, produces a file nobody reads and a disk that fills. Two rules cut most of it:</p>

<div class="kv-grid">
<div class="kv"><span class="k">log the exceptional</span><span class="v">nginx: <code>access_log … if=\$dang_chu_y</code> with a map that zeroes 2xx/3xx. Errors keep a full log, successes go to the summary file</span></div>
<div class="kv"><span class="k">sample the routine</span><span class="v">one in a hundred successful requests is plenty to establish the shape; keep all the failures</span></div>
<div class="kv"><span class="k">never log in a loop</span><span class="v">a per-item log line inside a batch job is how 40 GB appears overnight</span></div>
<div class="kv"><span class="k">health checks off</span><span class="v"><code>location /health { access_log off; }</code> — a probe every two seconds is 43,200 lines a day saying nothing</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> after tonight&#39;s deploy a few users got errors on the orders page. Your teammate ran <code>journalctl -u app -p err</code>, saw "-- No entries --" and declared the app clean. Find the errors, and prove which release and which part of the stack they came from.</p>
<ol>
<li>On the lab VPS, make the app log one JSON line per request (with <code>status</code>, <code>ms</code>, <code>req_id</code>, <code>ban</code>) and give nginx a <code>log_format</code> with <code>rt=</code>, <code>urt=</code> and <code>rid=$request_id</code>, passing <code>X-Request-Id</code> to the app.</li>
<li>Send 300 requests, then run <code>journalctl -u app -p err</code> and the <code>jq -R 'fromjson? | select(.level=="error")'</code> query side by side.</li>
<li>Take one <code>req_id</code> of a 500 and find the same request in <code>/var/log/nginx/dodo.log</code>; compare <code>rt</code> with <code>ms</code>.</li>
<li>On your own machine, run a container that prints to stderr and exits 1, and compare <code>docker logs X | grep -c -i error</code> with the <code>2&gt;&amp;1</code> version.</li>
</ol>
<p><strong>Done when:</strong> you have the error count from <code>jq</code> (non-zero while <code>-p err</code> says none), one request traced through both logs with its release, and the two <code>docker logs</code> counts that differ.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Structured log (log có cấu trúc)</span><span class="v">Log lines with named fields (usually JSON), so they can be queried rather than just read.</span></div>
<div class="kv"><span class="k">journald / journalctl (nhật ký của systemd)</span><span class="v">The service that stores logs of systemd units, and the command that queries it.</span></div>
<div class="kv"><span class="k">Priority (mức ưu tiên)</span><span class="v">journald&#39;s severity, 0–7; stdout of a service is stored as 6 (info) unless told otherwise.</span></div>
<div class="kv"><span class="k">SYSLOG_IDENTIFIER (tên nhận diện)</span><span class="v">The program name attached to a log stream; what <code>journalctl -t</code> filters on.</span></div>
<div class="kv"><span class="k">Request id (mã request)</span><span class="v">One identifier written by every component a request passes through, so its lines can be joined.</span></div>
<div class="kv"><span class="k">stderr (luồng lỗi chuẩn)</span><span class="v">The second output stream; not captured by <code>|</code> unless redirected with <code>2&gt;&amp;1</code>.</span></div>
<div class="kv"><span class="k">Log rotation (xoay vòng log)</span><span class="v">Closing, compressing and eventually deleting old log files so they cannot fill the disk.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A log answers only the questions its fields allow: no duration field, no "slow" query at any speed.</li>
<li>journald mixes systemd lines into your app&#39;s log — query JSON with <code>jq -R 'fromjson? | …'</code>.</li>
<li><code>journalctl -p err</code> is blind to "error" written inside JSON on stdout: everything there is priority info.</li>
<li>One request id logged by nginx and the app joins the two sides and splits proxy time from app time.</li>
<li><code>docker logs</code> keeps stderr separate (use <code>2&gt;&amp;1</code>), and short-lived writers can lose their unit label (use <code>-t</code>).</li>
</ul>
<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — ngx_http_log_module</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_log_module.html — <code>log_format</code>, the <code>if=</code> parameter, <code>escape=json</code>, and buffered writes with <code>buffer=</code>/<code>flush=</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">logrotate(8)</span><span class="lc-sub">man 8 logrotate — <code>compress</code>, <code>delaycompress</code>, <code>maxsize</code>, and the <code>copytruncate</code> caveat measured in Lesson 8.4.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd-journald.conf(5)</span><span class="lc-sub">freedesktop.org/software/systemd/man/journald.conf.html — <code>SystemMaxUse=</code> and <code>MaxRetentionSec=</code>, the two settings that stop the journal from being the thing that fills your disk.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">jq manual</span><span class="lc-sub">jqlang.github.io/jq/manual/ — <code>select()</code>, <code>group_by()</code> and <code>-r</code>, which cover most of what log analysis needs.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — log formats, conditional logging and buffered writes</span><span class="lc-sub">/courses/nginx/learn${REF} — the measured cost of logging every request versus buffering it, and the <code>map</code> trick behind conditional logging.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>Log TRẢ LỜI ĐƯỢC câu hỏi</h2>
<p class="lead">Số đo nói cho bạn biết có gì đó SAI. Log lẽ ra phải nói cho bạn biết đó là GÌ. Chuyện nó làm được hay không phụ thuộc hoàn toàn vào các quyết định bạn đã ra TRƯỚC sự cố, và quyết định nặng ký nhất là bạn đã ghi lại NHỮNG TRƯỜNG NÀO.</p>

<h3>Câu hỏi</h3>
${slide('dv-09', 12, 'Log thiếu trường: trả lời nhanh mà SAI — và log_format có đủ trường')}
<p>200.000 request ghi ra hai định dạng — mặc định <code>combined</code> của nginx và một dòng JSON cho mỗi sự kiện — rồi hỏi một câu mà một sự cố thật sẽ đẻ ra: <em>URI nào đang trả 5xx VÀ tốn hơn hai giây?</em></p>

<div class="out">--- tren log THUAN (combined) ---
    830 /api/v1/don
    817 /api/v1/nguoi-dung/42
    792 /health
  → 82 ms  — VA khong tra loi duoc phan 'cham hon 2 giay':
             combined KHONG co truong thoi gian

--- tren log JSON ---
     281 /api/v1/don
     280 /api/v1/nguoi-dung/42
     257 /health
  → 538 ms</div>

<div class="callout warn">
<p><strong>Câu trả lời NHANH là câu trả lời SAI.</strong> <code>awk</code> chạy trên log thuần mất 82 ms và trả về 830 — nhưng đó là <em>MỌI</em> cú 5xx trên URI ấy, vì định dạng combined không có trường <code>$request_time</code>. Câu hỏi đó KHÔNG trả lời được từ cái tệp ấy dù với tốc độ nào. Con số đúng là 281, và lấy được nó tốn 538 ms. Chậm hơn sáu lần và thật sự đúng.</p>
</div>

<p><code>jq</code> làm cùng việc đó trong 497 ms, đủ gần với bản Python viết tay để kết luận rằng chi phí phân tích là bản chất của JSON chứ không phải của công cụ.</p>

<h3>Chuyện đó tốn bao nhiêu đĩa</h3>
<div class="out">  json.log           23.5 MB
  ket-hop.log        22.2 MB
  → cung 200.000 su kien: JSON to hon 1.06 lan

  ket-hop.log: 22.2 MB → 1.4 MB (ti le 15.4x)
  json.log: 23.5 MB → 1.9 MB (ti le 12.1x)</div>

<p>Lớn hơn sáu phần trăm — ít hơn nhiều so với người ta tưởng, vì các tên khoá lặp lại nén cực tốt. Cả hai định dạng đều co lại hơn 12 lần dưới gzip thường, và đó mới là bài học thật: <strong>xoay vòng và nén, thì định dạng gần như không ảnh hưởng tới chỗ lưu.</strong> 200.000 request là khoảng 1,4–1,9 MB sau nén, nên một website nhỏ giữ chín mươi ngày log đang nói về vài trăm megabyte — kham được kể cả trên cái đĩa của Chương 8.</p>

<h3>Những trường đáng có</h3>
<p>Định dạng là một quyết định nhỏ hơn NỘI DUNG. Định dạng combined thua vì thứ nó BỎ SÓT, không phải vì cú pháp của nó:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">thời điểm, mã trạng thái, phương thức, đường dẫn</span><span class="lz-lnote">định dạng nào cũng có; chúng không phải phần thú vị</span></div>
<div class="lz-layer"><span class="lz-lname">thời lượng request</span><span class="lz-lnote">cái trường mà cả phép đo ở trên xoay quanh. Thiếu nó thì không có phân vị (9.2) và không truy vấn được "chậm"</span></div>
<div class="lz-layer"><span class="lz-lname">thời lượng upstream, RIÊNG</span><span class="lz-lnote">tách "ứng dụng tôi chậm" khỏi "con proxy chậm" mà không cần đoán</span></div>
<div class="lz-layer"><span class="lz-lname">một mã request</span><span class="lz-lnote">một định danh nối dòng của proxy với các dòng của ứng dụng. Đây là thứ làm một cuốn log TRA CỨU ĐƯỢC chứ không chỉ đọc được</span></div>
<div class="lz-layer"><span class="lz-lname">phiên bản bản phát hành</span><span class="lz-lnote">để "cái này có bắt đầu từ lần deploy không?" thành một câu truy vấn chứ không phải một cuộc tranh cãi (6.3 đã lập luận y hệt cho các dòng dữ liệu)</span></div>
<div class="lz-layer"><span class="lz-lname">mã người dùng hoặc khách thuê</span><span class="lz-lnote">để "là mọi người hay chỉ một khách hàng?" trả lời được bằng một lệnh</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — một dòng log là nơi bí mật đi tới để được LƯU TRỮ VĨNH VIỄN.</strong> Ghi log toàn bộ thân request là bắt được mật khẩu ở route đăng nhập. Ghi log các header là bắt được <code>Authorization</code> và cookie phiên. Ghi log chuỗi truy vấn là bắt được token đặt lại mật khẩu. Và khác với một cú rò trong bộ nhớ, cái này được GHI XUỐNG ĐĨA, gửi tới hệ gom, sao lưu, và giữ hàng tháng — các quy tắc của Chương 4 về chỗ bí mật được phép xuất hiện áp cho log MẠNH HƠN bất cứ đâu, vì log là chỗ duy nhất bạn CỐ Ý giữ lại mọi thứ. Hãy chọn trường một cách tường minh; đừng bao giờ ghi log cả một đối tượng.</p>
</div>

<h3>Có cấu trúc KHÔNG có nghĩa là JSON ở mọi nơi</h3>
<p>Phép đo ở trên so hai thái cực, và có một chặng giữa thường là câu trả lời đúng trên một máy chủ đơn lẻ: giữ định dạng người-đọc-được và <em>THÊM những trường bạn cần</em>. Nginx làm chuyện đó dễ như bỡn:</p>

<pre><code>log_format huu_dung '\$remote_addr \$status \$request_time \$upstream_response_time '
                    '\$upstream_addr \$upstream_status "\$request_uri" '
                    '\$body_bytes_sent \$upstream_cache_status';</code></pre>

<p>Vẫn một dòng mỗi request, vẫn grep được bằng <code>awk</code> ở mức 82 ms, và giờ nó CÓ thời lượng. Bạn mất đi tính bền của JSON trước các trường chứa dấu cách, và bạn giữ được tốc độ. Trên một máy chủ thì đó thường là đánh đổi tốt hơn; lý lẽ cho JSON mạnh lên rất nhiều ngay khi một cái máy bắt đầu gửi log tới thứ gì đó sẽ đi phân tích chúng.</p>

<div class="callout ok">
<p><strong>Thứ thật sự đáng làm trên một VPS nhỏ.</strong> Ghi log ra tệp, xoay vòng bằng <code>logrotate</code> (hằng ngày, nén, giữ 14–30), và chặn trần journal bằng <code>SystemMaxUse=</code> — Chương 8 đã đo xem một cuốn log không có trần làm gì với cái đĩa dùng chung với cơ sở dữ liệu. ĐỪNG gửi log ra khỏi máy cho tới khi bạn có lý do; log của một máy chủ đơn lẻ tra cứu được bằng <code>grep</code> và <code>awk</code> trong vài mili giây, như đã đo ở trên.</p>
</div>

<h3>Đọc log JSON từ journald bằng jq</h3>
${slide('dv-09', 13, 'Log JSON: hỏi như hỏi cơ sở dữ liệu — và vì sao jq chết ở dòng 1')}
<p>Trên VPS, một app do systemd chạy ghi ra stdout và journald cất lại; <code>journalctl -u app</code> đọc ngược ra. App thí nghiệm ghi một đối tượng JSON cho mỗi request (<code>ts</code>, <code>level</code>, <code>path</code>, <code>status</code>, <code>ms</code>, <code>req_id</code>, <code>ban</code> = bản phát hành). Câu truy vấn hiển nhiên đầu tiên thì hỏng:</p>
<div class="out">$ journalctl -u app -o cat | jq -r 'select(.level=="error") | .path'
jq: parse error: Invalid numeric literal at line 1, column 8
$ journalctl -u app -o cat | grep -v "^{" | head -1
Started app.service - Ung dung thu (Chuong 9).</div>
<p>journald trộn chính các dòng của systemd về unit ("Started…", "Stopping…") vào cùng luồng, và <code>jq</code> trần bỏ cuộc ở dòng đầu tiên không phải JSON. Cách chữa là đọc dòng THÔ rồi chỉ phân tích những dòng là JSON:</p>
<div class="out">$ journalctl -u app -o cat | jq -R -r 'fromjson? | select(.level=="error") | .path' | sort | uniq -c
     25 /api/don
$ journalctl -u app -o cat | jq -R -r 'fromjson? | select(.status&gt;=500 and .ms&gt;500) | [.ts,.status,.ms,.req_id[0:8]] | @tsv' | head -2
2026-09-29T06:31:38	500	967.4	61b63b4a
2026-09-29T06:31:40	500	953.1	52469d98</div>
<table><tr><th>Mảnh jq</th><th>Làm gì</th></tr>
<tr><td><code>-R</code></td><td>đọc mỗi dòng vào như một chuỗi thô thay vì như JSON</td></tr>
<tr><td><code>fromjson?</code></td><td>thử phân tích chuỗi thành JSON; dấu <code>?</code> lặng lẽ bỏ các dòng không phải JSON</td></tr>
<tr><td><code>select(điều kiện)</code></td><td>chỉ giữ đối tượng thoả điều kiện — như WHERE của một truy vấn</td></tr>
<tr><td><code>[.a,.b] | @tsv</code> kèm <code>-r</code></td><td>in các trường thành cột cách bằng tab, không nháy — sẵn cho <code>sort</code>/<code>awk</code></td></tr>
<tr><td><code>.req_id[0:8]</code></td><td>lát cắt: tám ký tự đầu của một chuỗi</td></tr>
<tr><td><code>-s</code> + <code>group_by(.status)</code></td><td>gom cả luồng thành một mảng rồi nhóm lại</td></tr></table>

<h3>journalctl, từng cờ một — và vì sao -p err không thấy gì</h3>
${slide('dv-09', 14, '-p err không thấy lỗi nào: journald không đọc JSON — bảng cờ journalctl')}
<div class="out">$ journalctl -u app -p err
-- No entries --
$ journalctl -u app -o cat | grep -c '"level": "error"'
25</div>
<p>Có hai mươi lăm dòng lỗi mà <code>-p err</code> không thấy dòng nào. journald gán mức ưu tiên (priority) theo từng LUỒNG: mọi thứ một service ghi ra stdout đều cất ở mức 6 (info), dù chữ bên trong nói gì. Chữ "error" nằm TRONG JSON của bạn, còn journald không đọc JSON. Hoặc truy vấn trường đó bằng <code>jq</code>, hoặc cho app ghi log qua syslog/<code>sd_journal</code> với mức ưu tiên thật, hoặc thêm tiền tố <code>&lt;3&gt;</code> vào đầu dòng (tiền tố mức ưu tiên kiểu nhân mà journald hiểu được trên stdout).</p>
<table><tr><th>Cờ</th><th>Nghĩa</th></tr>
<tr><td><code>-u app</code> / <code>--user -u x</code></td><td>dòng của một unit hệ thống / một unit người dùng</td></tr>
<tr><td><code>-t TÊN</code></td><td>dòng có SYSLOG_IDENTIFIER (tên nhận diện) là TÊN — thường là tên chương trình</td></tr>
<tr><td><code>--since "10 min ago"</code>, <code>--until</code></td><td>khoảng thời gian; nhận cả <code>2026-09-29 06:00</code></td></tr>
<tr><td><code>-p err</code></td><td>mức err hoặc nặng hơn — chỉ có tác dụng khi mức đó thật sự được đặt</td></tr>
<tr><td><code>-g REGEX</code></td><td>grep bên trong trường thông điệp (journald ≥ 237)</td></tr>
<tr><td><code>-o cat</code> / <code>-o short-iso</code> / <code>-o verbose</code></td><td>chỉ thông điệp / giờ dạng ISO / mọi trường đã cất</td></tr>
<tr><td><code>-f</code>, <code>-n 50</code>, <code>--no-pager</code></td><td>theo dõi tiếp, 50 dòng cuối, không mở <code>less</code> (cần trong script)</td></tr></table>

<h3>Một request id xuyên qua proxy và app</h3>
${slide('dv-09', 15, 'Một request id nối nginx với ứng dụng: 983 ms ở nginx, 967,8 ms ở app')}
<p>nginx thí nghiệm ghi <code>rid=$request_id</code> và chuyển đúng giá trị đó cho app bằng <code>proxy_set_header X-Request-Id $request_id;</code>; app ghi nó thành <code>req_id</code>. Một cú 500 chậm, lần theo qua cả hai cuốn log:</p>
<div class="out">$ grep rid=$R /var/log/nginx/dodo.log | awk '{print $5, $7, $9, $10}'
/api/don 500 rt=0.983 urt=0.983
$ journalctl -u app -o cat | grep $R | jq -c '{ts,level,status,ms,ban}'
{"ts":"2026-09-29T06:38:13","level":"error","status":500,"ms":967.8,"ban":"v42"}</div>
<p>nginx nói 983 ms, app nói 967,8 ms: khoảng 15 ms là kết nối và proxy, phần còn lại là của app. Vì dòng log mang cả <code>"ban":"v42"</code>, câu hỏi "cái này có bắt đầu từ lần deploy vừa rồi không?" thành một truy vấn trên trường bản phát hành chứ không còn là một cuộc tranh cãi.</p>

<h3>Khi log CÓ đó mà lệnh tìm không thấy</h3>
${slide('dv-09', 16, 'Log có đó mà lệnh tìm không thấy: docker logs tách stderr; journald mất nhãn unit')}
<p>Hai phép đo mà dòng log có thật, còn lệnh hiển nhiên thì báo không có gì. Thứ nhất, <code>docker logs</code> (một container chết vì lỗi thư viện, chạy trên Mac):</p>
<div class="out">$ docker logs dv09-api | grep -c -i error
Error: loading shared library libssl.so.3
0
$ docker logs dv09-api 2&gt;&amp;1 | grep -c -i error
1</div>
<p><code>docker logs</code> phát lại stdout của container ra stdout của bạn và <strong>stderr của nó ra stderr của bạn</strong>. Dòng lỗi hiện trên màn hình, nhưng không bao giờ đi vào ống dẫn, nên <code>grep</code> đếm ra số không. Luôn thêm <code>2&gt;&amp;1</code>; đi kèm hay dùng là <code>--since 10m</code>, <code>--tail 100</code> và <code>-t</code> (dấu thời gian).</p>
<p>Thứ hai, journald và các tiến trình sống cực ngắn. Bộ canh máy nhà có thật ở Bài 9.5 là một unit NGƯỜI DÙNG (<code>systemctl --user</code>) mà script của nó in kết quả qua <code>| tr</code>. Dựng lại trên VPS thí nghiệm với sáu lần chạy:</p>
<div class="out">$ journalctl --user -u canh-vps -g HONG -o cat | wc -l
0
$ journalctl --user -t canh-vps.sh -g HONG -o cat | wc -l
6
$ journalctl --user -t canh-vps.sh -g HONG -o verbose -n 1 | grep -E "_SYSTEMD_USER_UNIT|_COMM|_LINE_BREAK|MESSAGE"
    _LINE_BREAK=pid-change
    MESSAGE=HONG: 1 container da CHET (exited) Dia 91%</div>
<p>Dòng đó do <code>tr</code> viết, một tiến trình con thoát sau vài mili giây. Lúc journald đi tra xem kẻ viết thuộc unit nào thì tiến trình đã biến mất — nên dòng ấy KHÔNG có trường <code>_SYSTEMD_USER_UNIT</code>, và <code>-u</code>, vốn lọc theo trường đó, bỏ qua nó. <code>-t</code> lọc theo tên gắn trên luồng và thấy đủ sáu. Viết lại dòng đó bằng <code>printf</code> dựng sẵn của shell (không tiến trình con) nâng <code>-u</code> lên 5 trên 6, không phải 6 — vì chính script cũng thoát rất nhanh. Trên máy nhà thật, cùng câu hỏi cho một ngày trả 0 dòng với <code>-u</code> và 264 dòng với <code>-t</code>. Với script ngắn, hãy tìm bằng <code>-t</code>.</p>
<div class="callout ok"><p><strong>Trên Windows/WSL và macOS.</strong> <code>docker logs</code> cư xử y hệt trên Docker Desktop cho Mac và Windows. macOS không có journald (<code>log show --last 10m</code> là thứ tương đương tại chỗ, không liên quan), WSL cũng không, trừ khi bật systemd trong <code>/etc/wsl.conf</code>. <code>jq</code> thì có ở mọi nơi (<code>brew install jq</code>, <code>winget install jqlang.jq</code>), nên các truy vấn trong bài này chạy được cả trên một tệp log chép từ máy chủ về.</p></div>
<h3>Những dòng KHÔNG BAO GIỜ nên được ghi</h3>
<p>Cú hỏng phổ biến nhất trong việc ghi log không phải là QUÁ ÍT, mà là QUÁ NHIỀU. Một cuốn log ghi lại mọi request thành công ở mức INFO, kèm một bản đổ đối tượng đầy đủ, đẻ ra một tệp không ai đọc và một cái đĩa đầy. Hai quy tắc cắt được phần lớn:</p>

<div class="kv-grid">
<div class="kv"><span class="k">ghi cái BẤT THƯỜNG</span><span class="v">nginx: <code>access_log … if=\$dang_chu_y</code> với một map cho 2xx/3xx về không. Lỗi thì giữ log đầy đủ, thành công thì vào tệp tóm tắt</span></div>
<div class="kv"><span class="k">lấy mẫu cái THƯỜNG NGÀY</span><span class="v">một trên một trăm request thành công là quá đủ để dựng ra hình dạng; giữ TẤT CẢ các cú hỏng</span></div>
<div class="kv"><span class="k">đừng bao giờ ghi log trong vòng lặp</span><span class="v">một dòng log cho mỗi phần tử bên trong một tác vụ lô là cách 40 GB xuất hiện sau một đêm</span></div>
<div class="kv"><span class="k">tắt log chốt kiểm sức khoẻ</span><span class="v"><code>location /health { access_log off; }</code> — một cú thăm dò mỗi hai giây là 43.200 dòng mỗi ngày chẳng nói gì</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> sau lần deploy tối nay vài người dùng gặp lỗi ở trang đơn hàng. Bạn cùng nhóm chạy <code>journalctl -u app -p err</code>, thấy "-- No entries --" rồi tuyên bố app sạch. Hãy tìm ra các lỗi, và chứng minh chúng đến từ bản phát hành nào, từ phần nào của hệ thống.</p>
<ol>
<li>Trên VPS thí nghiệm, cho app ghi một dòng JSON mỗi request (có <code>status</code>, <code>ms</code>, <code>req_id</code>, <code>ban</code>) và cho nginx một <code>log_format</code> có <code>rt=</code>, <code>urt=</code> và <code>rid=$request_id</code>, chuyển <code>X-Request-Id</code> cho app.</li>
<li>Gửi 300 request, rồi chạy song song <code>journalctl -u app -p err</code> và câu truy vấn <code>jq -R 'fromjson? | select(.level=="error")'</code>.</li>
<li>Lấy một <code>req_id</code> của một cú 500 và tìm đúng request đó trong <code>/var/log/nginx/dodo.log</code>; so <code>rt</code> với <code>ms</code>.</li>
<li>Trên máy của bạn, chạy một container in ra stderr rồi thoát 1, và so <code>docker logs X | grep -c -i error</code> với bản có <code>2&gt;&amp;1</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có số lỗi từ <code>jq</code> (khác 0 trong khi <code>-p err</code> nói không có), một request được lần theo qua cả hai cuốn log kèm bản phát hành của nó, và hai con số <code>docker logs</code> khác nhau.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Structured log (log có cấu trúc)</span><span class="v">Dòng log có trường đặt tên (thường là JSON), để TRUY VẤN được chứ không chỉ để đọc.</span></div>
<div class="kv"><span class="k">journald / journalctl (nhật ký của systemd)</span><span class="v">Dịch vụ cất log của các unit systemd, và lệnh dùng để hỏi nó.</span></div>
<div class="kv"><span class="k">Priority (mức ưu tiên)</span><span class="v">Mức nghiêm trọng của journald, 0–7; stdout của một service được cất ở mức 6 (info) nếu không ai nói khác.</span></div>
<div class="kv"><span class="k">SYSLOG_IDENTIFIER (tên nhận diện)</span><span class="v">Tên chương trình gắn trên một luồng log; thứ mà <code>journalctl -t</code> dùng để lọc.</span></div>
<div class="kv"><span class="k">Request id (mã request)</span><span class="v">Một định danh mà mọi thành phần request đi qua đều ghi lại, để nối các dòng của nó với nhau.</span></div>
<div class="kv"><span class="k">stderr (luồng lỗi chuẩn)</span><span class="v">Luồng output thứ hai; <code>|</code> không bắt được nó trừ khi chuyển hướng bằng <code>2&gt;&amp;1</code>.</span></div>
<div class="kv"><span class="k">Log rotation (xoay vòng log)</span><span class="v">Đóng, nén rồi cuối cùng xoá tệp log cũ để chúng không làm đầy đĩa.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Log chỉ trả lời được những câu mà các trường của nó cho phép: không có trường thời lượng thì không có truy vấn "chậm" ở tốc độ nào.</li>
<li>journald trộn dòng của systemd vào log của app — hỏi JSON bằng <code>jq -R 'fromjson? | …'</code>.</li>
<li><code>journalctl -p err</code> mù trước chữ "error" viết trong JSON trên stdout: mọi thứ ở đó đều là mức info.</li>
<li>Một request id do nginx và app cùng ghi nối hai bên lại, và tách thời gian proxy khỏi thời gian app.</li>
<li><code>docker logs</code> để stderr đi riêng (dùng <code>2&gt;&amp;1</code>), và tiến trình viết sống quá ngắn có thể mất nhãn unit (dùng <code>-t</code>).</li>
</ul>
<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — ngx_http_log_module</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_log_module.html — <code>log_format</code>, tham số <code>if=</code>, <code>escape=json</code>, và ghi có đệm bằng <code>buffer=</code>/<code>flush=</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">logrotate(8)</span><span class="lc-sub">man 8 logrotate — <code>compress</code>, <code>delaycompress</code>, <code>maxsize</code>, và điều kiện kèm theo của <code>copytruncate</code> đo ở Bài 8.4.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd-journald.conf(5)</span><span class="lc-sub">freedesktop.org/software/systemd/man/journald.conf.html — <code>SystemMaxUse=</code> và <code>MaxRetentionSec=</code>, hai thiết lập ngăn cuốn journal trở thành thứ làm đầy đĩa của bạn.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">jq manual</span><span class="lc-sub">jqlang.github.io/jq/manual/ — <code>select()</code>, <code>group_by()</code> và <code>-r</code>, ba thứ bao được phần lớn nhu cầu phân tích log.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — định dạng log, log có điều kiện và ghi có đệm</span><span class="lc-sub">/courses/nginx/learn${REF} — giá đo được của việc ghi log mọi request so với ghi có đệm, và mẹo <code>map</code> nằm sau log có điều kiện.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 9.4 ─────────────────────────── */
    {
      title: '9.4 — Alerting on the trend, not the threshold|||9.4 — Báo động theo XU HƯỚNG, không theo ngưỡng',
      slug: 'deploy-9-4-bao-dong',
      type: 'VIDEO',
      description: 'Mô phỏng 48 giờ một cái đĩa đầy dần. Báo động ngưỡng 90% nổ ở giờ thứ 36 với năm giờ còn lại. Báo động xu hướng nổ ở giờ thứ 17 với hai mươi bốn giờ. Chênh nhau 19 giờ, và một cái rơi vào giờ hành chính.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>Alerting on the trend, not the threshold</h2>
<p class="lead">An alert has one job: reach a human while there is still time to act. A threshold does not do that — it tells you how full something is, which is not the same as how long you have.</p>

<h3>The two alarms, on identical data</h3>
${slide('dv-09', 17, 'Ngưỡng 90% cho 5 giờ, xu hướng cho 24 giờ — cùng một bộ dữ liệu 48 giờ')}
<p>A 20 GB disk starting at 30% and growing 350 MB an hour, sampled hourly for 48 hours. One alarm fires at 90%. The other computes the rate from the last three samples and fires when the extrapolated time-to-full drops below 24 hours:</p>

<div class="out">  gio | dung  |   %   | bao dong NGUONG | bao dong XU HUONG
  ----+-------+-------+-----------------+------------------
    0 |   6.0G |  30.0 |   im lang       |   im lang
   12 |  10.1G |  50.5 |   im lang       |   im lang
   17 |  11.8G |  59.1 |   im lang       | 🟠 day sau 24h
   24 |  14.2G |  71.0 |   im lang       | 🟠 day sau 17h
   30 |  16.3G |  81.3 |   im lang       | 🟠 day sau 11h
   36 |  18.3G |  91.5 | 🔴 NO           | 🟠 day sau 5h
   40 |  19.7G |  98.4 | 🔴 NO           | 🟠 day sau 1h
   41 |  20.0G | 100.1 | 🔴 NO           | 🟠 day sau -0h</div>

<div class="callout warn">
<p><strong>Nineteen hours of difference.</strong> The trend alarm fires at hour 17 with a full day of warning. The threshold alarm fires at hour 36 with five hours left — and there is no way to choose when in the day that lands. If the disk crosses 90% at 03:00, the threshold alarm wakes somebody at 03:00. The trend alarm would have said something the previous afternoon, while the fix was unhurried and reversible.</p>
</div>

<h3>The arithmetic</h3>
<p>It is one subtraction and one division, over samples you are already collecting:</p>

<pre><code>DUNG=\$(df --output=used /srv | tail -1)
TONG=\$(df --output=size /srv | tail -1)
echo "\$(date +%s) \$DUNG" >> dia.dat

awk -v tong="\$TONG" '
  {t[NR]=\$1; u[NR]=\$2}
  END{
    if (NR&lt;2) exit
    dt=t[NR]-t[1]; du=u[NR]-u[1]
    if (dt&lt;=0 || du&lt;=0) exit          <span class="tok-comment"># khong tang thi khong bao</span>
    toc=du/dt                          <span class="tok-comment"># KB moi giay</span>
    printf "day sau %.1f gio\\n", ((tong-u[NR])/toc)/3600
  }' dia.dat</code></pre>

<p>Run against the real filesystem while filling it deliberately:</p>

<div class="out">  chua du diem do
  dung 4.0% | toc do 15362.0 KB/s | con trong 247697.2 MB → DAY sau 4.6 gio
  dung 4.0% | toc do 15361.0 KB/s | con trong 247667.2 MB → DAY sau 4.6 gio
  dung 4.0% | toc do 15360.7 KB/s | con trong 247637.2 MB → DAY sau 4.6 gio</div>

<p>Four percent used. A threshold alarm has nothing to say. The trend alarm says four and a half hours, and it is right.</p>

<h3>The same shape for everything else</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">disk</span><span class="lz-lnote">time-to-full, as measured. Also apply it to inodes separately (8.4)</span></div>
<div class="lz-layer"><span class="lz-lname">memory</span><span class="lz-lnote">a steadily rising RSS with no plateau is a leak, and it is visible days before the OOM kill (8.1)</span></div>
<div class="lz-layer"><span class="lz-lname">latency</span><span class="lz-lnote">p95 against the same hour last week (9.2), not against a fixed millisecond number</span></div>
<div class="lz-layer"><span class="lz-lname">certificates</span><span class="lz-lnote">days remaining, alerting at 21 — the one deadline that is knowable months ahead and still catches people</span></div>
<div class="lz-layer"><span class="lz-lname">error rate</span><span class="lz-lnote">this one is genuinely a threshold, but as a ratio over a window: 5xx per request over five minutes, not a raw count</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — a trend alarm on noisy data fires constantly.</strong> My measurement used a clean monotonic series. Real disk usage goes up and down: a build writes 2 GB and deletes it, a backup lands and is shipped away. Extrapolating from two samples across that produces "full in 20 minutes" several times a day, and an alarm that cries wolf is an alarm somebody mutes. Smooth first — use a linear fit over the last several hours rather than the last two points, require the prediction to hold for two consecutive evaluations, and never alert on a shrinking series. My three-sample version above is the minimum that works on a quiet machine, not a template for a busy one.</p>
</div>

<h3>The alert that is worse than no alert</h3>
<p>Every alarm has a cost that is paid whether or not it is correct: someone reads it. An alarm that fires and is ignored has trained the reader to ignore the next one, including the real one. This is not a discipline problem — it is arithmetic. If five alarms a day are noise, the sixth gets three seconds of attention.</p>

<div class="kv-grid">
<div class="kv"><span class="k">an alert must be actionable</span><span class="v">if the answer is "yes, we know" or "nothing to do", it is a dashboard entry, not an alert</span></div>
<div class="kv"><span class="k">an alert must be urgent</span><span class="v">if it can wait until morning, send it somewhere that waits until morning</span></div>
<div class="kv"><span class="k">an alert must say what to do</span><span class="v">the message should name the command or the runbook page, not the metric</span></div>
<div class="kv"><span class="k">count your alerts</span><span class="v">more than one or two a week that need no action means the thresholds are wrong, not the reader</span></div>
</div>

<h3>Deduplication: alert when the set of problems changes</h3>
${slide('dv-09', 18, 'Báo khi TẬP LỖI đổi, không phải mỗi 5 phút — bao.sh và năm luật')}
<p>A check that runs every 5.5 minutes and messages you on every failed run sends 262 messages a day for one broken thing. Nobody reads the 262nd. The real home-machine monitor in Lesson 9.5 solves this with a small state file, and the lab version below does the same, plus one improvement that the real one learned the hard way:</p>
<pre><code class="language-bash">#!/bin/bash
# bao.sh — bao khi TAP LOI doi, nhac lai sau NHAC giay, bao khi binh thuong lai
cd /srv/app; mkdir -p tt
NOW=\${NOW:-$(date +%s)}; NHAC=\${NHAC:-21600}
LOI=$(awk -v now="$NOW" '                   # bo loi "da biet" con han im
  BEGIN { while ((getline l &lt; "da-biet.txt") &gt; 0) {
            split(l, a, "|"); if (now &lt; a[2]) im[a[1]] = 1 } }
  { for (k in im) if (index($0, k)) next; print }' loi.txt)
van_tay() {                                  # dau van tay cua TAP loi
  if [ "\${VT:-khoa}" = khoa ]; then sed -E 's/[0-9]+/N/g'; else cat; fi | md5sum | cut -c1-8
}
gui() {
  curl -s -m 5 -H 'Content-Type: application/json' -d "{\\"text\\":\\"$1\\"}" \\
       http://127.0.0.1:9099/hook &gt; /dev/null &amp;&amp; echo "  -&gt; GUI: $1"
}
CU=; LUC=0; [ -f tt/dang-hong ] &amp;&amp; read -r CU LUC &lt; tt/dang-hong
if [ -n "$LOI" ]; then
  V=$(printf '%s' "$LOI" | van_tay)
  if [ "$V" != "$CU" ] || [ $((NOW - LUC)) -ge "$NHAC" ]; then
    gui "HONG: $(echo $LOI)"; echo "$V $NOW" &gt; tt/dang-hong
  else
    echo "  (im lang: da bao $(( (NOW - LUC) / 60 )) phut truoc)"
  fi
elif [ -f tt/dang-hong ]; then gui "DA BINH THUONG LAI"; rm -f tt/dang-hong
else echo "  ok"; fi</code></pre>
<table><tr><th>Piece</th><th>Why it is there</th></tr>
<tr><td><code>loi.txt</code></td><td>one line per failed check, written by whatever does the checking</td></tr>
<tr><td><code>da-biet.txt</code> (<code>text|expiry</code>)</td><td>"known and accepted until…": a silence with an end date, per problem</td></tr>
<tr><td><code>van_tay</code> (fingerprint)</td><td>an 8-character hash of the <em>set</em> of problems; <code>sed 's/[0-9]+/N/g'</code> removes numbers first</td></tr>
<tr><td><code>tt/dang-hong</code></td><td>state: the last fingerprint sent, and when</td></tr>
<tr><td><code>NHAC=21600</code></td><td>re-send after 6 hours even if nothing changed — the real monitor&#39;s value</td></tr>
<tr><td><code>DA BINH THUONG LAI</code></td><td>the recovery message, so nobody has to ask "is it fixed?"</td></tr>
<tr><td><code>NOW=…</code></td><td>overridable clock, so a whole day can be simulated in one second</td></tr></table>

<h3>Measured with a fake webhook</h3>
${slide('dv-09', 19, 'Vân tay chứa con số = báo lại mỗi khi số đổi: 6 tin so với 1 tin')}
${slide('dv-09', 20, 'Một ngày của bộ báo: nhắc lại, lỗi mới, tạm im có hạn, bình thường lại')}
<p>The "channel" is a fake webhook: twelve lines of Python on <code>127.0.0.1:9099</code> that accept a POST, append the body to <code>hook.log</code> and answer 200. It stands in for Telegram or ntfy, so the whole path can be tested without a real token and without messaging anyone. Twelve checks, 5.5 minutes apart, with a dead job container and a disk creeping from 90% to 95%:</p>
<div class="out">$ VT=day_du bash mophong.sh
lan  1  t=  0p   -&gt; GUI: HONG: 1 container da CHET (exited) Dia VPS 90%
lan  2  t=  5p   (im lang: da bao 5 phut truoc)
lan  3  t= 11p   -&gt; GUI: HONG: 1 container da CHET (exited) Dia VPS 91%
…
lan 11  t= 55p   -&gt; GUI: HONG: 1 container da CHET (exited) Dia VPS 95%
lan 12  t= 60p   (im lang: da bao 5 phut truoc)
  == webhook nhan: 6 tin
$ VT=khoa bash mophong.sh
lan  1  t=  0p   -&gt; GUI: HONG: 1 container da CHET (exited) Dia VPS 90%
lan  2  t=  5p   (im lang: da bao 5 phut truoc)
…
lan 12  t= 60p   (im lang: da bao 60 phut truoc)
  == webhook nhan: 1 tin</div>
<p>With the numbers inside the fingerprint, every time the disk percentage ticked up the set of problems "changed" and a new message went out: six in an hour, about 144 a day. With numbers removed, one. The price: 90% → 95% no longer produces a message. If crossing 95% matters, make it a <em>different problem</em> (<code>Dia VPS NGUY</code>) rather than a different number.</p>
<p>A simulated day with the time variable:</p>
<div class="out">$ bash mophong2.sh
00:00    container job chet                  -&gt; GUI: HONG: 1 container da CHET (exited)
00:05    van chet                            (im lang: da bao 5 phut truoc)
06:00    van chet - du 6 tieng               -&gt; GUI: HONG: 1 container da CHET (exited)
06:05    them: dia 91%                       -&gt; GUI: HONG: 1 container da CHET (exited) Dia VPS 91%
06:11    dia 92% (chi so doi)                (im lang: da bao 6 phut truoc)
06:16    ghi da-biet (im 3 ngay)             -&gt; GUI: HONG: Dia VPS 92%
06:22    don dia xong                        -&gt; GUI: DA BINH THUONG LAI
  == webhook nhan: 5 tin</div>
<p>Five messages for a day with real events in it: broken; still broken after six hours; a new problem; the known one silenced (the message now names only the disk); fixed. Note what "DA BINH THUONG LAI" at 06:22 does not say — the dead container is still dead, only silenced until its expiry, after which it will alert again. A silence without an expiry is simply a check you deleted.</p>

<h3>When the checker itself is broken</h3>
${slide('dv-09', 21, 'Bộ kiểm hỏng thì im lặng trông như xanh — awk thiếu tệp, curl || echo 000')}
<p>Two bugs, both mine or the real monitor&#39;s, both invisible because a broken checker looks exactly like a healthy system. The first version of <code>bao.sh</code> read the silence list as the first file of an <code>awk 'NR==FNR{…; next} …' da-biet.txt loi.txt 2&gt;/dev/null</code>. Before <code>da-biet.txt</code> existed:</p>
<div class="out">$ VT=day_du bash mophong.sh
lan  1  t=  0p   ok
lan  2  t=  5p   ok
…
lan 12  t= 60p   ok
mophong.sh: line 8: hook.log: No such file or directory
  == webhook nhan:  tin</div>
<p>awk failed on the missing file, <code>2&gt;/dev/null</code> hid the failure, <code>LOI</code> came out empty, and twelve checks reported "ok" while the container was dead. An <em>empty</em> silence file breaks the same idiom differently: <code>NR==FNR</code> stays true through the second file, so every problem is swallowed as if it were a silence. The fixed version reads the list with <code>getline</code> in <code>BEGIN</code>, which simply finds nothing when the file is missing or empty.</p>
<p>The second bug is in the real monitor and in countless scripts copied from the internet:</p>
<div class="out">$ MA=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 $U || echo 000); echo "[$MA]"
[000000]
$ curl -s -o /dev/null -w "%{http_code}" --max-time 3 $U; echo " exit=$?"
000 exit=7
$ MA=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 $U); echo "[\${MA:-000}]"
[000]</div>
<p>When curl cannot connect it still prints <code>000</code> through <code>-w</code>, <em>and</em> exits non-zero (7 = could not connect), so <code>|| echo 000</code> appends a second <code>000</code>. The check still fires, so nobody noticed — but any comparison against <code>"000"</code> silently fails. The real home monitor logged "HTTP 000000" in 314 checks. The rule both bugs teach: <strong>test the failure path of your checker on purpose</strong> — a missing file, an unreachable port, an empty list — before you trust its silence.</p>
<h3>What to alert on, on one small server</h3>
<p>Short list, and deliberately short:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">the site is down</span><span class="lz-t">from outside</span><span class="lz-d">checked from another machine — 9.5 is entirely about why this one is not optional</span></div>
<div class="lz-step"><span class="lz-k">disk full in &lt; 24h</span><span class="lz-t">trend</span><span class="lz-d">measured above; include inodes</span></div>
<div class="lz-step"><span class="lz-k">something was OOM-killed</span><span class="lz-t">counter grew</span><span class="lz-d"><code>oom_kill</code> from the cgroup, or <code>dmesg | grep -c oom</code> (8.1)</span></div>
<div class="lz-step"><span class="lz-k">TLS expires in &lt; 21 days</span><span class="lz-t">countdown</span><span class="lz-d">renewal is automated and automation breaks silently</span></div>
<div class="lz-step"><span class="lz-k">5xx rate above 1% for 5 min</span><span class="lz-t">ratio</span><span class="lz-d">the one genuine threshold, and it needs the window</span></div>
</div>

<p>Five alarms. Everything else goes on a page you look at when something already told you to look — which is the actual role of a dashboard.</p>

<div class="callout ok">
<p><strong>The one you will forget: test that the alert can reach you.</strong> An alerting pipeline is code that runs rarely, which by Chapter 7&#39;s rule makes it code that is probably broken. Send yourself a deliberate test alert on a schedule — monthly is enough — and treat its absence as an incident. The failure mode this catches is silent and complete: an expired webhook, a changed phone number, a mail server rejecting the sender. You find out either during a test, or during the outage.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the group set up "disk &gt; 90% → message the group chat every 5 minutes". After one weekend the chat has 400 identical messages and everyone muted it — including for the outage on Monday. Rebuild the alerting so it speaks only when something changes, and test it without a real chat.</p>
<ol>
<li>On the lab VPS start the fake webhook (<code>python3 hook.py &amp;</code>, POST → <code>hook.log</code>, answer 200) and save <code>bao.sh</code> from this lesson.</li>
<li>Write <code>loi.txt</code> by hand and run <code>NOW=… bash bao.sh</code> for a sequence of times 330 s apart: the same problem, a changed number, a new problem, an empty file. Count lines in <code>hook.log</code>.</li>
<li>Run it once with <code>VT=day_du</code> and once with the default, and compare how many messages each sends for a disk going from 90% to 95%.</li>
<li>Break the checker on purpose: point the check at a port nobody listens on with <code>|| echo 000</code> and print the code in brackets.</li>
</ol>
<p><strong>Done when:</strong> one broken thing produces one message, a reminder after <code>NHAC</code> seconds, a new message for a new problem, a recovery message, and you have seen <code>[000000]</code> and fixed it to <code>[000]</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Threshold alert (báo động theo ngưỡng)</span><span class="v">Fires when a value crosses a fixed line; says how full, not how long you have.</span></div>
<div class="kv"><span class="k">Trend alert (báo động theo xu hướng)</span><span class="v">Extrapolates the rate to predict when the limit is reached.</span></div>
<div class="kv"><span class="k">Deduplication (chống báo trùng)</span><span class="v">Sending one message per state change instead of one per failed check.</span></div>
<div class="kv"><span class="k">Fingerprint (dấu vân tay)</span><span class="v">A short hash identifying the current set of problems, used to detect a change.</span></div>
<div class="kv"><span class="k">Silence with expiry (tạm im có hạn)</span><span class="v">Muting one known problem until a date, after which it alerts again.</span></div>
<div class="kv"><span class="k">Webhook (móc gọi lại qua HTTP)</span><span class="v">A URL that accepts a POST — how Telegram bots, Slack and ntfy receive alerts.</span></div>
<div class="kv"><span class="k">Alert fatigue (mệt mỏi vì báo động)</span><span class="v">When noise has trained people to ignore alerts, including the real one.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A trend alarm fired 19 hours before a threshold alarm on the same disk data.</li>
<li>Send a message when the set of problems changes, remind after a fixed time, and announce recovery.</li>
<li>Keep numbers out of the fingerprint — six messages an hour became one — and make severity levels separate problems.</li>
<li>Silence a known problem only with an expiry date; otherwise it is a deleted check.</li>
<li>Test the checker&#39;s own failure paths: a missing file gave twelve false "ok", and <code>|| echo 000</code> gave "000000".</li>
</ul>
<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Practical Alerting, and Being On-Call</span><span class="lc-sub">sre.google/sre-book/practical-alerting/ — the argument that alerts should be based on symptoms users feel rather than on causes, and the cost model for alert fatigue.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prometheus — predict_linear</span><span class="lc-sub">prometheus.io/docs/prometheus/latest/querying/functions/#predict_linear — the built-in that does exactly the extrapolation above, fitted over a window instead of two points; the canonical example in its docs is disk-full prediction.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">df(1) — the --output flag</span><span class="lc-sub">man 1 df — <code>--output=used,size,pcent</code> gives parseable columns instead of the human table, which is what makes the script above robust.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Rob Ewaschuk — My Philosophy on Alerting</span><span class="lc-sub">The internal Google document that became the SRE book&#39;s alerting chapter; its rule that every page must be actionable, novel and require intelligence is the shortest useful statement of the idea.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — cron, and writing a job that reports failure</span><span class="lc-sub">/courses/linux-bash/learn${REF} — where cron sends output, why a silent cron job is usually a broken one, and how to make it complain.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Báo động theo XU HƯỚNG, không theo ngưỡng</h2>
<p class="lead">Một cái báo động có đúng một việc: CHẠM TỚI một con người trong lúc vẫn còn thời gian để hành động. Một cái ngưỡng KHÔNG làm được việc đó — nó nói cho bạn biết thứ gì đó đầy tới đâu, mà đó không phải cùng một chuyện với việc bạn còn bao lâu.</p>

<h3>Hai cái báo động, trên cùng một bộ dữ liệu</h3>
${slide('dv-09', 17, 'Ngưỡng 90% cho 5 giờ, xu hướng cho 24 giờ — cùng một bộ dữ liệu 48 giờ')}
<p>Một cái đĩa 20 GB bắt đầu ở 30% và tăng 350 MB mỗi giờ, lấy mẫu hằng giờ suốt 48 giờ. Một cái báo động nổ ở 90%. Cái kia tính TỐC ĐỘ từ ba mẫu gần nhất và nổ khi thời gian ngoại suy tới lúc đầy tụt xuống dưới 24 giờ:</p>

<div class="out">  gio | dung  |   %   | bao dong NGUONG | bao dong XU HUONG
  ----+-------+-------+-----------------+------------------
    0 |   6.0G |  30.0 |   im lang       |   im lang
   12 |  10.1G |  50.5 |   im lang       |   im lang
   17 |  11.8G |  59.1 |   im lang       | 🟠 day sau 24h
   24 |  14.2G |  71.0 |   im lang       | 🟠 day sau 17h
   30 |  16.3G |  81.3 |   im lang       | 🟠 day sau 11h
   36 |  18.3G |  91.5 | 🔴 NO           | 🟠 day sau 5h
   40 |  19.7G |  98.4 | 🔴 NO           | 🟠 day sau 1h
   41 |  20.0G | 100.1 | 🔴 NO           | 🟠 day sau -0h</div>

<div class="callout warn">
<p><strong>Mười chín giờ chênh lệch.</strong> Báo động xu hướng nổ ở giờ thứ 17 với trọn một ngày để cảnh báo. Báo động ngưỡng nổ ở giờ thứ 36 với năm giờ còn lại — và không có cách nào chọn xem nó rơi vào lúc nào trong ngày. Nếu cái đĩa vượt 90% lúc 3 giờ sáng, thì báo động ngưỡng đánh thức ai đó lúc 3 giờ sáng. Báo động xu hướng lẽ ra đã nói gì đó vào chiều hôm trước, lúc cách chữa còn thong thả và đảo ngược được.</p>
</div>

<h3>Phép tính</h3>
<p>Nó là một phép trừ và một phép chia, trên những mẫu bạn vốn đã thu thập:</p>

<pre><code>DUNG=\$(df --output=used /srv | tail -1)
TONG=\$(df --output=size /srv | tail -1)
echo "\$(date +%s) \$DUNG" >> dia.dat

awk -v tong="\$TONG" '
  {t[NR]=\$1; u[NR]=\$2}
  END{
    if (NR&lt;2) exit
    dt=t[NR]-t[1]; du=u[NR]-u[1]
    if (dt&lt;=0 || du&lt;=0) exit          <span class="tok-comment"># khong tang thi khong bao</span>
    toc=du/dt                          <span class="tok-comment"># KB moi giay</span>
    printf "day sau %.1f gio\\n", ((tong-u[NR])/toc)/3600
  }' dia.dat</code></pre>

<p>Chạy trên hệ tệp thật trong lúc cố tình đổ dữ liệu vào:</p>

<div class="out">  chua du diem do
  dung 4.0% | toc do 15362.0 KB/s | con trong 247697.2 MB → DAY sau 4.6 gio
  dung 4.0% | toc do 15361.0 KB/s | con trong 247667.2 MB → DAY sau 4.6 gio
  dung 4.0% | toc do 15360.7 KB/s | con trong 247637.2 MB → DAY sau 4.6 gio</div>

<p>Bốn phần trăm đã dùng. Một cái báo động ngưỡng chẳng có gì để nói. Báo động xu hướng nói bốn giờ rưỡi, và nó ĐÚNG.</p>

<h3>Cùng hình dạng đó cho mọi thứ khác</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">đĩa</span><span class="lz-lnote">thời gian tới lúc đầy, như đã đo. Áp riêng cho inode nữa (8.4)</span></div>
<div class="lz-layer"><span class="lz-lname">bộ nhớ</span><span class="lz-lnote">một RSS tăng đều mà không có đoạn bằng phẳng là một chỗ rò, và nó nhìn thấy được HÀNG NGÀY trước cú OOM (8.1)</span></div>
<div class="lz-layer"><span class="lz-lname">độ trễ</span><span class="lz-lnote">p95 so với CÙNG GIỜ ĐÓ tuần trước (9.2), không so với một con số mili giây cố định</span></div>
<div class="lz-layer"><span class="lz-lname">chứng chỉ</span><span class="lz-lnote">số ngày còn lại, báo ở mức 21 — cái hạn chót DUY NHẤT biết trước được hàng tháng mà vẫn tóm được người ta</span></div>
<div class="lz-layer"><span class="lz-lname">tỷ lệ lỗi</span><span class="lz-lnote">cái này đúng là một NGƯỠNG thật, nhưng dưới dạng TỶ LỆ trên một cửa sổ: 5xx trên mỗi request trong năm phút, không phải một con số đếm thô</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — một báo động xu hướng trên dữ liệu NHIỄU thì nổ liên tục.</strong> Phép đo của tôi dùng một chuỗi tăng đơn điệu sạch sẽ. Mức dùng đĩa THẬT thì lên xuống: một bản dựng ghi 2 GB rồi xoá đi, một bản sao lưu đáp xuống rồi được chuyển đi. Ngoại suy từ hai mẫu cắt ngang chuyện đó sẽ đẻ ra "đầy sau 20 phút" vài lần mỗi ngày, và một cái báo động kêu oan là một cái báo động sẽ bị người ta tắt tiếng. Hãy LÀM MƯỢT trước — dùng một phép khớp tuyến tính trên vài giờ gần nhất chứ không phải hai điểm cuối, đòi hỏi dự đoán ấy phải GIỮ NGUYÊN qua hai lần đánh giá liên tiếp, và đừng bao giờ báo động trên một chuỗi đang giảm. Bản ba mẫu của tôi ở trên là mức tối thiểu chạy được trên một cái máy yên tĩnh, không phải khuôn mẫu cho một cái máy bận rộn.</p>
</div>

<h3>Cái báo động còn TỆ HƠN là không có báo động</h3>
<p>Mọi cái báo động đều có một cái giá phải trả bất kể nó đúng hay sai: có người ĐỌC nó. Một cái báo động nổ rồi bị làm ngơ đã HUẤN LUYỆN người đọc làm ngơ cái tiếp theo, kể cả cái thật. Đây không phải vấn đề kỷ luật — đó là số học. Nếu mỗi ngày có năm cái báo động là nhiễu, thì cái thứ sáu nhận được ba giây chú ý.</p>

<div class="kv-grid">
<div class="kv"><span class="k">báo động phải HÀNH ĐỘNG ĐƯỢC</span><span class="v">nếu câu trả lời là "ừ, biết rồi" hay "chẳng làm gì được", thì nó là một mục trên bảng điều khiển, không phải một cái báo động</span></div>
<div class="kv"><span class="k">báo động phải KHẨN</span><span class="v">nếu nó chờ được tới sáng, hãy gửi nó tới nơi biết chờ tới sáng</span></div>
<div class="kv"><span class="k">báo động phải nói LÀM GÌ</span><span class="v">dòng thông báo nên gọi tên cái lệnh hoặc trang sổ tay, không phải gọi tên cái số đo</span></div>
<div class="kv"><span class="k">hãy ĐẾM số báo động của bạn</span><span class="v">nhiều hơn một hai cái mỗi tuần mà chẳng cần hành động gì nghĩa là các ngưỡng sai, không phải người đọc sai</span></div>
</div>

<h3>Chống báo trùng: báo khi TẬP LỖI đổi</h3>
${slide('dv-09', 18, 'Báo khi TẬP LỖI đổi, không phải mỗi 5 phút — bao.sh và năm luật')}
<p>Một phép kiểm chạy mỗi 5,5 phút mà nhắn bạn ở mỗi lần hỏng thì gửi 262 tin một ngày cho MỘT thứ hỏng. Không ai đọc tin thứ 262. Bộ canh máy nhà có thật ở Bài 9.5 giải chuyện này bằng một tệp trạng thái nhỏ, và bản thí nghiệm dưới đây làm y như vậy, cộng một cải tiến mà bản thật đã phải học bằng giá đắt:</p>
<pre><code class="language-bash">#!/bin/bash
# bao.sh — bao khi TAP LOI doi, nhac lai sau NHAC giay, bao khi binh thuong lai
cd /srv/app; mkdir -p tt
NOW=\${NOW:-$(date +%s)}; NHAC=\${NHAC:-21600}
LOI=$(awk -v now="$NOW" '                   # bo loi "da biet" con han im
  BEGIN { while ((getline l &lt; "da-biet.txt") &gt; 0) {
            split(l, a, "|"); if (now &lt; a[2]) im[a[1]] = 1 } }
  { for (k in im) if (index($0, k)) next; print }' loi.txt)
van_tay() {                                  # dau van tay cua TAP loi
  if [ "\${VT:-khoa}" = khoa ]; then sed -E 's/[0-9]+/N/g'; else cat; fi | md5sum | cut -c1-8
}
gui() {
  curl -s -m 5 -H 'Content-Type: application/json' -d "{\\"text\\":\\"$1\\"}" \\
       http://127.0.0.1:9099/hook &gt; /dev/null &amp;&amp; echo "  -&gt; GUI: $1"
}
CU=; LUC=0; [ -f tt/dang-hong ] &amp;&amp; read -r CU LUC &lt; tt/dang-hong
if [ -n "$LOI" ]; then
  V=$(printf '%s' "$LOI" | van_tay)
  if [ "$V" != "$CU" ] || [ $((NOW - LUC)) -ge "$NHAC" ]; then
    gui "HONG: $(echo $LOI)"; echo "$V $NOW" &gt; tt/dang-hong
  else
    echo "  (im lang: da bao $(( (NOW - LUC) / 60 )) phut truoc)"
  fi
elif [ -f tt/dang-hong ]; then gui "DA BINH THUONG LAI"; rm -f tt/dang-hong
else echo "  ok"; fi</code></pre>
<table><tr><th>Mảnh</th><th>Vì sao có</th></tr>
<tr><td><code>loi.txt</code></td><td>mỗi phép kiểm hỏng một dòng, do thứ đi kiểm ghi ra</td></tr>
<tr><td><code>da-biet.txt</code> (<code>chữ|hạn</code>)</td><td>"đã biết và chấp nhận tới lúc…": một lần tắt tiếng CÓ ngày hết, cho từng lỗi</td></tr>
<tr><td><code>van_tay</code> (dấu vân tay)</td><td>một mã băm 8 ký tự của TẬP lỗi; <code>sed 's/[0-9]+/N/g'</code> bỏ con số trước</td></tr>
<tr><td><code>tt/dang-hong</code></td><td>trạng thái: vân tay đã gửi lần trước, và gửi lúc nào</td></tr>
<tr><td><code>NHAC=21600</code></td><td>gửi lại sau 6 giờ dù không có gì đổi — đúng giá trị của bộ canh thật</td></tr>
<tr><td><code>DA BINH THUONG LAI</code></td><td>tin báo khỏi, để không ai phải hỏi "sửa xong chưa?"</td></tr>
<tr><td><code>NOW=…</code></td><td>đồng hồ ghi đè được, để mô phỏng cả một ngày trong một giây</td></tr></table>

<h3>Đo thật với một webhook GIẢ</h3>
${slide('dv-09', 19, 'Vân tay chứa con số = báo lại mỗi khi số đổi: 6 tin so với 1 tin')}
${slide('dv-09', 20, 'Một ngày của bộ báo: nhắc lại, lỗi mới, tạm im có hạn, bình thường lại')}
<p>"Kênh báo" là một webhook giả: mười hai dòng Python ở <code>127.0.0.1:9099</code> nhận POST, nối phần thân vào <code>hook.log</code> rồi trả 200. Nó đóng vai Telegram hay ntfy, để thử cả đường đi mà không cần token thật và không nhắn cho ai. Mười hai lần kiểm, cách nhau 5,5 phút, với một container job đã chết và cái đĩa bò từ 90% lên 95%:</p>
<div class="out">$ VT=day_du bash mophong.sh
lan  1  t=  0p   -&gt; GUI: HONG: 1 container da CHET (exited) Dia VPS 90%
lan  2  t=  5p   (im lang: da bao 5 phut truoc)
lan  3  t= 11p   -&gt; GUI: HONG: 1 container da CHET (exited) Dia VPS 91%
…
lan 11  t= 55p   -&gt; GUI: HONG: 1 container da CHET (exited) Dia VPS 95%
lan 12  t= 60p   (im lang: da bao 5 phut truoc)
  == webhook nhan: 6 tin
$ VT=khoa bash mophong.sh
lan  1  t=  0p   -&gt; GUI: HONG: 1 container da CHET (exited) Dia VPS 90%
lan  2  t=  5p   (im lang: da bao 5 phut truoc)
…
lan 12  t= 60p   (im lang: da bao 60 phut truoc)
  == webhook nhan: 1 tin</div>
<p>Khi con số nằm trong vân tay, mỗi lần phần trăm đĩa nhích lên là tập lỗi "đổi" và một tin mới bay đi: sáu tin một giờ, cỡ 144 tin một ngày. Bỏ con số ra thì một tin. Cái giá: 90% → 95% không còn đẻ ra tin nào. Nếu vượt 95% là chuyện quan trọng, hãy biến nó thành một LỖI KHÁC (<code>Dia VPS NGUY</code>) chứ đừng để nó là một con số khác.</p>
<p>Một ngày mô phỏng bằng biến thời gian:</p>
<div class="out">$ bash mophong2.sh
00:00    container job chet                  -&gt; GUI: HONG: 1 container da CHET (exited)
00:05    van chet                            (im lang: da bao 5 phut truoc)
06:00    van chet - du 6 tieng               -&gt; GUI: HONG: 1 container da CHET (exited)
06:05    them: dia 91%                       -&gt; GUI: HONG: 1 container da CHET (exited) Dia VPS 91%
06:11    dia 92% (chi so doi)                (im lang: da bao 6 phut truoc)
06:16    ghi da-biet (im 3 ngay)             -&gt; GUI: HONG: Dia VPS 92%
06:22    don dia xong                        -&gt; GUI: DA BINH THUONG LAI
  == webhook nhan: 5 tin</div>
<p>Năm tin cho một ngày có sự kiện thật: hỏng; vẫn hỏng sau sáu giờ; một lỗi mới; lỗi đã biết được tạm im (tin giờ chỉ nói về đĩa); đã sửa. Để ý điều "DA BINH THUONG LAI" lúc 06:22 KHÔNG nói — container chết vẫn đang chết, chỉ bị tạm im tới hạn, qua hạn nó sẽ kêu lại. Tắt tiếng mà không có hạn thì chẳng khác gì xoá hẳn phép kiểm đó.</p>

<h3>Khi chính bộ kiểm bị hỏng</h3>
${slide('dv-09', 21, 'Bộ kiểm hỏng thì im lặng trông như xanh — awk thiếu tệp, curl || echo 000')}
<p>Hai con bọ, một của tôi và một của bộ canh thật, cả hai đều vô hình vì một bộ kiểm hỏng trông Y HỆT một hệ thống khoẻ. Bản đầu tiên của <code>bao.sh</code> đọc danh sách tạm im như tệp thứ nhất của <code>awk 'NR==FNR{…; next} …' da-biet.txt loi.txt 2&gt;/dev/null</code>. Khi <code>da-biet.txt</code> chưa tồn tại:</p>
<div class="out">$ VT=day_du bash mophong.sh
lan  1  t=  0p   ok
lan  2  t=  5p   ok
…
lan 12  t= 60p   ok
mophong.sh: line 8: hook.log: No such file or directory
  == webhook nhan:  tin</div>
<p>awk hỏng vì thiếu tệp, <code>2&gt;/dev/null</code> giấu cú hỏng, <code>LOI</code> ra rỗng, và mười hai lần kiểm báo "ok" trong khi container đã chết. Một tệp tạm im RỖNG thì làm hỏng cùng kiểu viết đó theo cách khác: <code>NR==FNR</code> vẫn đúng suốt tệp thứ hai, nên mọi lỗi bị nuốt như thể chúng là danh sách tạm im. Bản đã sửa đọc danh sách bằng <code>getline</code> trong <code>BEGIN</code>, thứ đơn giản là không thấy gì khi tệp thiếu hoặc rỗng.</p>
<p>Con bọ thứ hai nằm trong bộ canh thật và trong vô số script chép từ mạng về:</p>
<div class="out">$ MA=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 $U || echo 000); echo "[$MA]"
[000000]
$ curl -s -o /dev/null -w "%{http_code}" --max-time 3 $U; echo " exit=$?"
000 exit=7
$ MA=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 $U); echo "[\${MA:-000}]"
[000]</div>
<p>Khi curl không nối được, nó VẪN in <code>000</code> qua <code>-w</code>, <em>VÀ</em> thoát khác không (7 = không kết nối được), nên <code>|| echo 000</code> nối thêm một <code>000</code> nữa. Báo động vẫn nổ nên không ai để ý — nhưng mọi phép so với <code>"000"</code> đều lặng lẽ trượt. Bộ canh máy nhà thật đã ghi "HTTP 000000" trong 314 lần kiểm. Bài học mà cả hai con bọ dạy: <strong>cố tình thử ĐƯỜNG HỎNG của bộ kiểm</strong> — tệp thiếu, cổng không ai nghe, danh sách rỗng — trước khi tin vào sự im lặng của nó.</p>
<h3>Báo động cái gì, trên một máy chủ nhỏ</h3>
<p>Danh sách ngắn, và ngắn một cách có chủ đích:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">website sập</span><span class="lz-t">từ BÊN NGOÀI</span><span class="lz-d">kiểm từ một cái máy khác — bài 9.5 nói trọn vẹn về việc vì sao cái này không phải tuỳ chọn</span></div>
<div class="lz-step"><span class="lz-k">đĩa đầy sau &lt; 24h</span><span class="lz-t">xu hướng</span><span class="lz-d">đo ở trên; gồm cả inode</span></div>
<div class="lz-step"><span class="lz-k">có thứ bị OOM giết</span><span class="lz-t">bộ đếm tăng</span><span class="lz-d"><code>oom_kill</code> của cgroup, hoặc <code>dmesg | grep -c oom</code> (8.1)</span></div>
<div class="lz-step"><span class="lz-k">TLS hết hạn sau &lt; 21 ngày</span><span class="lz-t">đếm ngược</span><span class="lz-d">việc gia hạn đã tự động hoá, mà tự động hoá thì hỏng ÂM THẦM</span></div>
<div class="lz-step"><span class="lz-k">tỷ lệ 5xx trên 1% suốt 5 phút</span><span class="lz-t">tỷ lệ</span><span class="lz-d">cái ngưỡng THẬT duy nhất, và nó cần cái cửa sổ</span></div>
</div>

<p>Năm cái báo động. Mọi thứ khác nằm trên một trang mà bạn nhìn vào KHI đã có thứ gì đó bảo bạn nhìn — và đó mới là vai trò thật của một bảng điều khiển.</p>

<div class="callout ok">
<p><strong>Cái bạn sẽ quên: KIỂM xem báo động có tới được bạn không.</strong> Một đường ống báo động là mã chạy HIẾM KHI, mà theo quy tắc của Chương 7 thì đó là mã có lẽ đang hỏng. Hãy tự gửi cho mình một cái báo động thử có chủ đích theo lịch — hằng tháng là đủ — và coi việc nó KHÔNG tới là một sự cố. Kiểu hỏng mà cái này bắt được thì âm thầm và toàn phần: một webhook hết hạn, một số điện thoại đã đổi, một máy chủ thư từ chối người gửi. Bạn phát hiện ra hoặc trong một lần thử, hoặc giữa lúc đang sập.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm đặt "đĩa &gt; 90% → nhắn vào nhóm chat mỗi 5 phút". Sau một cuối tuần, nhóm chat có 400 tin giống hệt nhau và ai cũng đã tắt tiếng nó — kể cả cho cú sập sáng thứ Hai. Hãy làm lại phần báo động để nó chỉ lên tiếng khi có gì ĐỔI, và thử nó mà không cần nhóm chat thật.</p>
<ol>
<li>Trên VPS thí nghiệm, bật webhook giả (<code>python3 hook.py &amp;</code>, POST → <code>hook.log</code>, trả 200) và lưu <code>bao.sh</code> của bài này.</li>
<li>Tự viết <code>loi.txt</code> rồi chạy <code>NOW=… bash bao.sh</code> cho một chuỗi thời điểm cách nhau 330 giây: cùng một lỗi, một con số đổi, một lỗi mới, một tệp rỗng. Đếm số dòng trong <code>hook.log</code>.</li>
<li>Chạy một lần với <code>VT=day_du</code> và một lần với mặc định, so xem mỗi kiểu gửi bao nhiêu tin khi đĩa đi từ 90% lên 95%.</li>
<li>Cố tình làm hỏng bộ kiểm: trỏ phép kiểm vào một cổng không ai nghe kèm <code>|| echo 000</code> và in mã trong ngoặc vuông.</li>
</ol>
<p><strong>Đạt khi:</strong> một thứ hỏng đẻ ra một tin, một tin nhắc lại sau <code>NHAC</code> giây, một tin mới cho lỗi mới, một tin báo khỏi, và bạn đã thấy <code>[000000]</code> rồi sửa thành <code>[000]</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Threshold alert (báo động theo ngưỡng)</span><span class="v">Nổ khi một giá trị vượt một vạch cố định; nói đầy tới đâu, không nói bạn còn bao lâu.</span></div>
<div class="kv"><span class="k">Trend alert (báo động theo xu hướng)</span><span class="v">Ngoại suy tốc độ để đoán lúc nào chạm giới hạn.</span></div>
<div class="kv"><span class="k">Deduplication (chống báo trùng)</span><span class="v">Gửi một tin cho mỗi lần trạng thái đổi thay vì một tin cho mỗi lần kiểm hỏng.</span></div>
<div class="kv"><span class="k">Fingerprint (dấu vân tay)</span><span class="v">Một mã băm ngắn định danh tập lỗi hiện tại, dùng để phát hiện thay đổi.</span></div>
<div class="kv"><span class="k">Silence with expiry (tạm im có hạn)</span><span class="v">Tắt tiếng một lỗi đã biết tới một ngày, qua ngày đó nó kêu lại.</span></div>
<div class="kv"><span class="k">Webhook (móc gọi lại qua HTTP)</span><span class="v">Một URL nhận POST — cách bot Telegram, Slack, ntfy nhận báo động.</span></div>
<div class="kv"><span class="k">Alert fatigue (mệt mỏi vì báo động)</span><span class="v">Khi tiếng ồn đã dạy người ta phớt lờ báo động, kể cả cái thật.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Báo động xu hướng nổ sớm hơn báo động ngưỡng 19 giờ trên cùng dữ liệu đĩa.</li>
<li>Gửi tin khi TẬP LỖI đổi, nhắc lại sau một khoảng cố định, và báo cả lúc khỏi.</li>
<li>Để con số ra ngoài vân tay — sáu tin một giờ thành một tin — và biến các mức nặng nhẹ thành các lỗi riêng.</li>
<li>Chỉ tắt tiếng một lỗi đã biết kèm ngày hết hạn; không thì đó là một phép kiểm đã bị xoá.</li>
<li>Thử đường hỏng của chính bộ kiểm: thiếu một tệp cho ra mười hai "ok" giả, và <code>|| echo 000</code> cho ra "000000".</li>
</ul>
<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Practical Alerting, và Being On-Call</span><span class="lc-sub">sre.google/sre-book/practical-alerting/ — lập luận rằng báo động nên dựa trên TRIỆU CHỨNG mà người dùng cảm thấy chứ không dựa trên nguyên nhân, và mô hình chi phí cho việc mệt mỏi vì báo động.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prometheus — predict_linear</span><span class="lc-sub">prometheus.io/docs/prometheus/latest/querying/functions/#predict_linear — hàm dựng sẵn làm đúng phép ngoại suy ở trên, khớp trên một cửa sổ thay vì hai điểm; ví dụ kinh điển trong tài liệu của nó chính là dự đoán đầy đĩa.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">df(1) — cờ --output</span><span class="lc-sub">man 1 df — <code>--output=used,size,pcent</code> cho ra các cột phân tích được thay vì bảng dành cho người đọc, và đó là thứ làm script ở trên bền.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Rob Ewaschuk — My Philosophy on Alerting</span><span class="lc-sub">Tài liệu nội bộ của Google về sau thành chương báo động của cuốn SRE; quy tắc rằng mỗi cú gọi phải HÀNH ĐỘNG ĐƯỢC, MỚI MẺ và ĐÒI HỎI TRÍ TUỆ là phát biểu ngắn gọn hữu dụng nhất của ý tưởng này.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — cron, và viết một tác vụ biết báo hỏng</span><span class="lc-sub">/courses/linux-bash/learn${REF} — cron gửi output đi đâu, vì sao một cron job im lặng thường là một cron job hỏng, và làm sao bắt nó lên tiếng.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 9.5 ─────────────────────────── */
    {
      title: '9.5 — Checking from where the user stands|||9.5 — Kiểm từ CHỖ NGƯỜI DÙNG ĐỨNG',
      slug: 'deploy-9-5-cua-truoc',
      type: 'VIDEO',
      description: 'Chốt kiểm sức khoẻ đi qua ĐÚNG con proxy, ĐÚNG cổng, ĐÚNG đường người dùng đi — và trả 200 trong khi trang chủ trả 502. Đo thật, và cách chữa không phải là một chốt kiểm sâu hơn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.5</span>
<h2>Checking from where the user stands</h2>
<p class="lead">Lesson 6.2 showed a health check returning 200 while every endpoint returned 500. This one is worse: the check goes through the real proxy, on the real port, down the path a real user takes — and still says everything is fine while the homepage is dead.</p>

<h3>The measurement</h3>
${slide('dv-09', 22, '/health 200 trong khi trang chủ 502 — đo lại 29/09 trên VPS thí nghiệm')}
<p>An application on port 3361 answering everything correctly, behind nginx on 3360. The proxy has two location blocks, and one of them points at a port nobody is listening on:</p>

<pre><code>location /health { proxy_pass http://127.0.0.1:3361; }   <span class="tok-comment"># dung</span>
location /       { proxy_pass http://127.0.0.1:3399; }   <span class="tok-comment"># CONG SAI</span></code></pre>

<div class="out">=== kiem TU BEN TRONG (thang ung dung) ===
  127.0.0.1:3361/health   → 200
  127.0.0.1:3361/         → 200
=== kiem TU BEN NGOAI (qua nginx, dung duong nguoi dung di) ===
  127.0.0.1:3360/health   → 200
  127.0.0.1:3360/         → 502</div>

<div class="callout warn">
<p><strong>The health check is green, through the proxy, on the user-facing port.</strong> It is not a shallow-check problem — the application really is healthy, the proxy really is running, and that URL really does return 200. The homepage returns <strong>502</strong>. The check and the failure live in different location blocks, so no amount of checking harder on <code>/health</code> will ever find it.</p>
</div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">app itself</span><span class="lz-t">200 on everything</span><span class="lz-d">nothing wrong here</span></div>
<div class="lz-step"><span class="lz-k">proxy /health</span><span class="lz-t">200</span><span class="lz-d">correct block, correct upstream</span></div>
<div class="lz-step"><span class="lz-k">proxy /</span><span class="lz-t">502</span><span class="lz-d">wrong upstream port — the site is down and nothing reports it</span></div>
</div>

<h3>Measured again, from a second machine</h3>
<p>Rebuilt on the lab VPS with nginx 1.24 (app on 8080, a second server block on 8081 whose <code>location /</code> points at 8099), and checked from <em>another container on the same Docker network</em> — a stand-in for "another machine":</p>
<div class="out">  dv09-vps/              200
  dv09-vps:8081/health   200
  dv09-vps:8081/         502</div>
<p>Same result as the original measurement, from outside the box: the health endpoint is green through the proxy, the page users open is 502.</p>
<h3>What this class of failure actually is</h3>
<p>Everything between your process and your user can break independently of your process:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">a location block pointing at the wrong upstream</span><span class="lz-lnote">measured above — 502 for users, 200 for the check</span></div>
<div class="lz-layer"><span class="lz-lname">a TLS certificate that expired</span><span class="lz-lnote">an HTTP check on 127.0.0.1 never touches TLS and stays green through the whole outage</span></div>
<div class="lz-layer"><span class="lz-lname">DNS pointing at an old address</span><span class="lz-lnote">the server is perfect; nobody can find it</span></div>
<div class="lz-layer"><span class="lz-lname">a firewall rule closing 443</span><span class="lz-lnote">every local check passes; the port is unreachable from the internet</span></div>
<div class="lz-layer"><span class="lz-lname">a cache serving a rolled-back version</span><span class="lz-lnote">measured in 6.5: the app served v1, users got v3 for five minutes</span></div>
<div class="lz-layer"><span class="lz-lname">the machine losing its network</span><span class="lz-lnote">local monitoring is fine and cannot tell anybody</span></div>
</div>

<p>That last one is the argument in one line: <strong>a monitor on the machine it monitors cannot report the failures that matter most.</strong> When the server is unreachable, so is anything running on it.</p>

<h3>What an external check should ask for</h3>
${slide('dv-09', 23, 'Mã 200 chưa chứng minh trang chạy: kiểm NỘI DUNG, tên miền thật, hạn chứng chỉ')}
<p>Not <code>/health</code>. The whole point is to exercise the path users take:</p>

<pre><code><span class="tok-comment"># kiem tu MOT MAY KHAC, dung ten mien that, va doi thu THAT SU co tren trang</span>
curl -sS --max-time 10 https://vidu.com/ \\
  | grep -q 'id="trang-chu"' || echo "TRANG CHU HONG"

<span class="tok-comment"># kem: chung chi con bao nhieu ngay</span>
echo | openssl s_client -connect vidu.com:443 -servername vidu.com 2>/dev/null \\
  | openssl x509 -noout -enddate</code></pre>

<div class="kv-grid">
<div class="kv"><span class="k">the real hostname</span><span class="v">exercises DNS, TLS, the firewall and the proxy — four things an <code>127.0.0.1</code> check cannot see</span></div>
<div class="kv"><span class="k">a real page</span><span class="v">not an endpoint that exists only to be probed. 9.5&#39;s failure lived in the block <code>/health</code> was not in</span></div>
<div class="kv"><span class="k">content, not status</span><span class="v">a 200 that renders an error page is still a 200. Grep for something only the working page contains</span></div>
<div class="kv"><span class="k">from elsewhere</span><span class="v">any other machine. A free uptime service, a cron on a laptop, another VPS — the requirement is only that it is not this one</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — checking content is what catches the failures that return 200.</strong> A single-page app whose JavaScript bundle 404s serves a perfectly valid 200 with an empty <code>&lt;div id="root"&gt;</code>. A backend returning <code>{"error":"database unavailable"}</code> with status 200 — which more frameworks do than you would like — is invisible to a status-code check. And Chapter 6&#39;s cache case returned 200 with the <em>wrong version</em>. In all three the status code is fine and the site is not, which is why the check has to look at the body.</p>
</div>

<h3>Measured: an error page that returns 200</h3>
<p>The lab app returns its homepage with <code>&lt;main id="trang-chu"&gt;</code>. Creating the file <code>/srv/app/CSDL_HONG</code> makes it behave like an app whose database is gone: it still answers <strong>200</strong>, with an error message instead of the page.</p>
<div class="out">$ sudo touch /srv/app/CSDL_HONG
$ curl -s -o /dev/null -w "%{http_code}" localhost/
200
$ curl -sf localhost/ &gt;/dev/null; echo exit=$?
exit=0
$ curl -s localhost/ | grep -q 'id="trang-chu"' || echo "TRANG CHU HONG"
TRANG CHU HONG</div>
<p><code>curl -f</code> (<code>--fail</code>) only turns HTTP 4xx/5xx into a non-zero exit; a 200 error page passes it. Only the content check noticed. The marker you grep for should be something that exists <em>only</em> when the page really rendered — an element id, a heading, a data value — not the site name, which also appears on the error page.</p>
<p>The certificate half of the external check, against a lab certificate issued for 10 days (with <code>vidu.test</code> pointed at the lab VPS in <code>/etc/hosts</code>):</p>
<div class="out">$ echo | openssl s_client -connect vidu.test:443 -servername vidu.test 2&gt;/dev/null | openssl x509 -noout -enddate
notAfter=Oct  9 06:41:48 2026 GMT
$ echo | openssl s_client -connect vidu.test:443 -servername vidu.test 2&gt;/dev/null | openssl x509 -noout -checkend $((14*86400)); echo "checkend 14 ngay: exit=$?"
Certificate will expire
checkend 14 ngay: exit=1</div>
<table><tr><th>Piece</th><th>Meaning</th></tr>
<tr><td><code>echo |</code></td><td>closes s_client&#39;s input so it disconnects after the handshake instead of waiting</td></tr>
<tr><td><code>-servername vidu.test</code></td><td>SNI: tells a server hosting several sites which certificate to present. Without it you may check the wrong one</td></tr>
<tr><td><code>x509 -noout -enddate</code></td><td>print only the <code>notAfter</code> date</td></tr>
<tr><td><code>-checkend N</code></td><td>exit 1 if the certificate expires within N seconds — ready for <code>if</code> in a script</td></tr></table>
<h3>Two checks, and they are not interchangeable</h3>
<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">internal</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">the process supervisor</div><div class="lz-nsub">shallow <code>/health</code>, polled every few seconds, restarts the process. Must stay cheap and must not touch the database (6.2)</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">external</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">the user-experience check</div><div class="lz-nsub">a real page over the real hostname, from another machine, checking content. Wakes a human, never restarts anything</div></div></div>
</div>
</div>

<p>They answer different questions, and confusing them produces both classic mistakes: a deep health check that gets the app killed during a database blip, and an external monitor so shallow it cannot see an outage.</p>

<h3>The cheapest version that works</h3>
<p>A free uptime service checking one URL every five minutes covers most of this list and costs nothing. If you would rather own it, the whole thing is a cron job on any other machine you have:</p>

<pre><code>*/5 * * * * /usr/bin/curl -sS --max-time 10 https://vidu.com/ \\
  | grep -q 'id="trang-chu"' || /usr/local/bin/bao-dong "trang chu hong"</code></pre>

<p>The important property is not sophistication, it is <em>location</em>. A twelve-line shell script on a different machine detects an entire class of failure that a full observability stack on the same machine cannot.</p>

<div class="callout ok">
<p><strong>The rule this chapter and Chapter 6 both arrive at.</strong> Chapter 6 said a rollback is not done until the front door agrees. Chapter 9 says the same thing about health: <strong>every claim about whether the site works has to be verified from the address users type, checking something only a working page contains.</strong> Everything else — the process is up, the port is bound, <code>/health</code> is 200 — is a statement about your machine, not about your users.</p>
</div>

<h3>A real external monitor: the home machine watching the VPS</h3>
${slide('dv-09', 24, 'Canh từ BÊN NGOÀI: máy nhà canh VPS — timer 5 phút + AccuracySec 30 s')}
${slide('dv-09', 25, 'canh-vps.sh: sáu phép kiểm, một kênh báo, khoá SSH chỉ đọc')}
<p>Everything above, as it actually runs for cuongthai.com. On 18/08/2026 an audit found that the monitoring script on the VPS itself, <code>monitor.sh</code>, detected problems every five minutes and told nobody: the Telegram token was empty, the alert email was empty and <code>mail</code> was not installed. <code>send_alert()</code> wrote to a log file. The same day a replacement went live on the home machine (Fedora, the one that builds the images): <code>canh-vps.sh</code>, run by a <em>user</em> systemd timer.</p>
<table><tr><th>Setting</th><th>Value</th><th>Effect</th></tr>
<tr><td><code>OnBootSec=</code></td><td><code>3min</code></td><td>first run three minutes after the machine starts</td></tr>
<tr><td><code>OnUnitActiveSec=</code></td><td><code>5min</code></td><td>next run five minutes after the previous one started</td></tr>
<tr><td><code>AccuracySec=</code></td><td><code>30s</code></td><td>systemd may delay it up to 30 s to batch wake-ups — measured spacing is about <strong>5 min 30 s</strong> (12:44:17, 12:49:47, 12:55:16…)</td></tr>
<tr><td><code>Type=oneshot</code>, <code>TimeoutStartSec=300</code></td><td></td><td>the service runs once per tick and is killed if a check hangs</td></tr></table>
<p>It checks, from the internet side: <code>/</code> must be 200; <code>/api/v1/system/health</code> and <code>/api/v1/feed/posts</code> must be 200 or 401 (a 404 on the feed route means an old or incomplete image — the lesson of 02/07); the TLS certificate must have 14 days or more. Then it asks the VPS itself over SSH with a key that can run exactly one read-only command, <code>tinh-trang</code> (forced with <code>command=</code> in the VPS&#39;s <code>authorized_keys</code>), which returns disk %, unhealthy, exited and running containers, and the age of the newest backup. Thresholds: disk ≥ 90%, any unhealthy or exited container, fewer than 6 running, backup older than 26 hours. It alerts through a Telegram bot only when the md5 fingerprint of the problem list changes, repeats after 6 hours, and announces recovery.</p>
<div class="pitfall co-tieu-de"><p><strong>A Telegram bot cannot message you first.</strong> Telegram only lets a bot send to a chat that has written to it. If you set up the bot and never press START, every request looks correct and no message ever arrives. It is the step most often forgotten when rebuilding the monitor — test it with a deliberate alert the day you set it up.</p></div>

<h3>26 days red: the forgotten job container</h3>
${slide('dv-09', 26, '26 ngày đỏ vì một container job bị quên — 43 ngày journal của bộ canh')}
<p>The monitor&#39;s own journal (read-only, 18/08 → 29/09/2026) is the best argument in this chapter for everything in Lesson 9.4. About 263 checks a day. Green every day until 25/08, when the certificate warning started at 13 days left. On <strong>03/09 at 13:12</strong> a new problem appeared: <code>1 container da CHET (exited)</code>. A container from a one-off job (classifying exam questions for a course) had finished and been left behind — no <code>--rm</code> — and the check counted every exited container as dead. It stayed there until the container was deleted on <strong>29/09</strong>; the next check, at 02:00:08, printed "OK tat ca binh thuong".</p>
<div class="kv-grid">
<div class="kv"><span class="k">6,517 checks</span><span class="v">contained "1 container da CHET" between 03/09 and 29/09.</span></div>
<div class="kv"><span class="k">602 Telegram messages</span><span class="v">from 03/09 to 29/09 (643 in total since 18/08), up to 70 in a single day (07/09).</span></div>
<div class="kv"><span class="k">In the same channel</span><span class="v">real incidents: the certificate reached "0 days" on 07–08/09 before renewing, and the disk hit 100% on 04, 10 and 13/09.</span></div>
<div class="kv"><span class="k">201 single-check blips</span><span class="v">"homepage down" for exactly one check; each cost two messages (change, change back). 314 of 324 "homepage down" checks were <code>HTTP 000000</code> — no response at all, which from a home connection cannot be told apart from the home network dropping.</span></div>
</div>
<p>Three lessons, each already in Lesson 9.4, now with a price attached. <strong>An alert that is always red stops being read</strong>, and the real problems — a certificate at zero days, a full disk — arrive in a channel everybody has learned to skim. <strong>Count only what is actually wrong</strong>: an exited job container is not a crashed service; count <code>Exited</code> with a non-zero code, or only containers of your Compose project, and run one-off jobs with <code>docker run --rm</code>. <strong>Require two consecutive failures</strong> and check a third-party address first before reporting "site down" from a home connection — 201 blips would have cost nothing.</p>
<div class="out">$ docker ps -a --filter label=dvhoc=09 --filter status=exited --format "{{.Names}}\\t{{.Status}}"
dv09-api	Exited (1) 2 seconds ago
dv09-job-phanloai	Exited (0) 12 seconds ago
$ docker ps -a --filter label=dvhoc=09 --filter status=exited --format "{{.Names}}\\t{{.Status}}" | grep -v "Exited (0)"
dv09-api	Exited (1) 2 seconds ago</div>
<p>Reproduced on the Mac: a finished job (<code>Exited (0)</code>) and a crashed API (<code>Exited (1)</code>) are both "exited". Filtering out <code>Exited (0)</code> keeps only the one that matters.</p>

<h3>Tools: when to write your own and when not to</h3>
${slide('dv-09', 27, 'Chọn công cụ: tự viết, Uptime Kuma, Prometheus + Grafana, Netdata')}
<table><tr><th>Tool</th><th>What it is</th><th>Use when</th></tr>
<tr><td>cron/systemd timer + curl + webhook</td><td>the 30–150 lines of shell in this chapter</td><td>one or two servers, and you want to understand every line</td></tr>
<tr><td>Uptime Kuma</td><td>self-hosted web UI (since 2021; 2.5.5 released 16/09/2026): HTTP, keyword, TCP, DNS, Docker checks, 90+ notification services including Telegram</td><td>you want a status page and alerts without writing code — run it on a <em>different</em> machine</td></tr>
<tr><td>Prometheus + Grafana</td><td>pull-based metrics database with PromQL (<code>predict_linear</code>, <code>histogram_quantile</code>) plus dashboards</td><td>several machines or services, SLOs, graphs over months — not next to the app on a 1 GB VPS</td></tr>
<tr><td>Netdata</td><td>per-second metrics agent with a built-in dashboard on port 19999; its README cites about 5% CPU and 150 MB RAM by default</td><td>investigating an incident that is happening now on one machine</td></tr></table>
<p>The site has a whole course on the next step — <strong>Observability &amp; Monitoring</strong> (structured logs, metrics, traces, alerts, SLOs); this chapter covers what you need the day you first deploy.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> for the group project defence, the team wants a monitor that would have caught "the homepage is blank but the API is fine". Build one that runs from a <em>different</em> machine and checks content, not just status codes.</p>
<ol>
<li>On the lab VPS add a second nginx server block on 8081 whose <code>location /health</code> is correct and <code>location /</code> points at a port nobody uses; check both paths from another container: <code>docker run --rm --network dv09-net alpine wget -S -O /dev/null http://dv09-vps:8081/</code>.</li>
<li>Make the app return a 200 error page (<code>touch /srv/app/CSDL_HONG</code>) and compare <code>curl -sf</code> with <code>curl -s … | grep -q 'id="trang-chu"'</code>.</li>
<li>Issue a 10-day certificate with <code>openssl req -x509 … -days 10</code>, serve it on 443 and test it with <code>-checkend $((14*86400))</code>.</li>
<li>Start two containers labelled <code>dvhoc=09</code> — one that exits 0, one that exits 1 — and write a count of "dead" containers that ignores the first.</li>
</ol>
<p><strong>Done when:</strong> your check reports the 502 on <code>/</code> while <code>/health</code> is 200, catches the 200 error page, exits 1 on the 10-day certificate, and counts exactly one dead container.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Health check (phép kiểm còn sống)</span><span class="v">A cheap endpoint a supervisor polls to decide whether to restart a process.</span></div>
<div class="kv"><span class="k">External / synthetic check (kiểm từ bên ngoài)</span><span class="v">A request made like a user&#39;s, from another machine, over the real hostname.</span></div>
<div class="kv"><span class="k">Content check (kiểm nội dung)</span><span class="v">Looking for something only a working page contains, instead of trusting the status code.</span></div>
<div class="kv"><span class="k">SNI — Server Name Indication (chỉ định tên máy chủ)</span><span class="v">The hostname sent in the TLS handshake so the server picks the right certificate.</span></div>
<div class="kv"><span class="k">Forced command (lệnh bị ép)</span><span class="v"><code>command=</code> in <code>authorized_keys</code>: the key can run only that one command.</span></div>
<div class="kv"><span class="k">Flapping (chập chờn)</span><span class="v">A check that fails once and recovers; alerting on each blip doubles the noise.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A check proves only the path it exercises: <code>/health</code> 200 and <code>/</code> 502 through the same proxy.</li>
<li>Status 200 is not "working": check content, the real hostname, and certificate expiry with <code>-checkend</code>.</li>
<li>Monitor from another machine — the real one runs on the home machine every 5 min 30 s, with a read-only SSH key.</li>
<li>One forgotten job container kept the alarm red for 26 days and 602 messages, burying a 0-day certificate and a full disk.</li>
<li>Count only real failures, require two in a row, and choose tools by size: shell, Uptime Kuma, then Prometheus.</li>
</ul>
<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Uptime Kuma — self-hosted monitoring tool</span><span class="lc-sub">github.com/louislam/uptime-kuma — monitor types, notification services and the one-line Docker install (checked 09/2026).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.timer(5)</span><span class="lc-sub">freedesktop.org/software/systemd/man/latest/systemd.timer.html — <code>OnUnitActiveSec=</code> and <code>AccuracySec=</code>, the reason the home monitor runs every 5 min 30 s.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Telegram Bot API</span><span class="lc-sub">core.telegram.org/bots/api — <code>sendMessage</code>, and why a bot can only write to a chat that started it.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Observability &amp; Monitoring — the next course</span><span class="lc-sub">/courses/observability-monitoring/learn${REF} — structured logs, metrics, traces, alerting and SLOs for a Node.js backend on a VPS.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — proxy_pass and location matching</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass — why one location block can be correct while another is not, which is the whole mechanism of the failure above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">curl(1) — --max-time, --fail and --resolve</span><span class="lc-sub">curl.se/docs/manpage.html — <code>--resolve</code> in particular lets you test a specific server by its real hostname before DNS points at it.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">openssl-s_client(1)</span><span class="lc-sub">docs.openssl.org/master/man1/openssl-s_client/ — the certificate-expiry check above, and <code>-servername</code> for SNI, without which you test the wrong virtual host.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kubernetes — liveness, readiness and startup probes</span><span class="lc-sub">kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/ — the clearest published statement of why the restart check and the "is it working" check must be separate things.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — location matching order, and diagnosing a 502</span><span class="lc-sub">/courses/nginx/learn${REF} — which block a request actually lands in, and what the error log says when an upstream refuses the connection.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.5</span>
<h2>Kiểm từ CHỖ NGƯỜI DÙNG ĐỨNG</h2>
<p class="lead">Bài 6.2 cho thấy một chốt kiểm sức khoẻ trả 200 trong khi mọi endpoint trả 500. Bài này còn tệ hơn: phép kiểm đi qua ĐÚNG con proxy, trên ĐÚNG cổng, xuống ĐÚNG con đường một người dùng thật đi — và vẫn nói mọi thứ ổn trong khi trang chủ đã chết.</p>

<h3>Phép đo</h3>
${slide('dv-09', 22, '/health 200 trong khi trang chủ 502 — đo lại 29/09 trên VPS thí nghiệm')}
<p>Một ứng dụng ở cổng 3361 trả lời mọi thứ đúng đắn, đứng sau nginx ở 3360. Con proxy có hai khối location, và một trong hai trỏ vào một cổng chẳng ai nghe:</p>

<pre><code>location /health { proxy_pass http://127.0.0.1:3361; }   <span class="tok-comment"># dung</span>
location /       { proxy_pass http://127.0.0.1:3399; }   <span class="tok-comment"># CONG SAI</span></code></pre>

<div class="out">=== kiem TU BEN TRONG (thang ung dung) ===
  127.0.0.1:3361/health   → 200
  127.0.0.1:3361/         → 200
=== kiem TU BEN NGOAI (qua nginx, dung duong nguoi dung di) ===
  127.0.0.1:3360/health   → 200
  127.0.0.1:3360/         → 502</div>

<div class="callout warn">
<p><strong>Chốt kiểm sức khoẻ XANH, đi qua proxy, trên cổng người dùng vào.</strong> Đây KHÔNG phải vấn đề kiểm-quá-nông — ứng dụng thật sự khoẻ, con proxy thật sự đang chạy, và cái URL đó thật sự trả 200. Trang chủ trả <strong>502</strong>. Phép kiểm và cú hỏng sống trong HAI khối location khác nhau, nên có kiểm <code>/health</code> gắt tới đâu cũng không bao giờ tìm ra.</p>
</div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">bản thân ứng dụng</span><span class="lz-t">200 với mọi thứ</span><span class="lz-d">chỗ này chẳng sai gì</span></div>
<div class="lz-step"><span class="lz-k">proxy /health</span><span class="lz-t">200</span><span class="lz-d">đúng khối, đúng upstream</span></div>
<div class="lz-step"><span class="lz-k">proxy /</span><span class="lz-t">502</span><span class="lz-d">sai cổng upstream — website sập và chẳng gì báo cả</span></div>
</div>

<h3>Đo lại, từ một cái máy thứ hai</h3>
<p>Dựng lại trên VPS thí nghiệm với nginx 1.24 (app ở 8080, một khối server thứ hai ở 8081 mà <code>location /</code> trỏ vào 8099), và kiểm từ <em>một container khác trên cùng mạng Docker</em> — đóng vai "một cái máy khác":</p>
<div class="out">  dv09-vps/              200
  dv09-vps:8081/health   200
  dv09-vps:8081/         502</div>
<p>Cùng kết quả với phép đo gốc, nhìn từ BÊN NGOÀI máy: endpoint sức khoẻ xanh qua proxy, còn trang người dùng mở thì 502.</p>
<h3>Lớp hỏng này THẬT RA là gì</h3>
<p>Mọi thứ nằm giữa tiến trình của bạn và người dùng của bạn đều hỏng ĐỘC LẬP với tiến trình của bạn được:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">một khối location trỏ sai upstream</span><span class="lz-lnote">đo ở trên — 502 cho người dùng, 200 cho phép kiểm</span></div>
<div class="lz-layer"><span class="lz-lname">một chứng chỉ TLS hết hạn</span><span class="lz-lnote">một phép kiểm HTTP trên 127.0.0.1 chẳng đụng tới TLS và giữ màu xanh suốt cả cú sập</span></div>
<div class="lz-layer"><span class="lz-lname">DNS trỏ vào một địa chỉ cũ</span><span class="lz-lnote">máy chủ hoàn hảo; chẳng ai tìm thấy nó</span></div>
<div class="lz-layer"><span class="lz-lname">một luật tường lửa đóng cổng 443</span><span class="lz-lnote">mọi phép kiểm cục bộ đều đạt; cái cổng không với tới được từ internet</span></div>
<div class="lz-layer"><span class="lz-lname">một bộ đệm phục vụ bản đã lùi</span><span class="lz-lnote">đo ở 6.5: ứng dụng phục vụ v1, người dùng nhận v3 suốt năm phút</span></div>
<div class="lz-layer"><span class="lz-lname">cái máy MẤT MẠNG</span><span class="lz-lnote">hệ giám sát cục bộ vẫn ổn và không nói được cho ai</span></div>
</div>

<p>Cái cuối cùng là lập luận gói trong một dòng: <strong>một hệ giám sát nằm trên chính cái máy nó giám sát thì KHÔNG báo được những cú hỏng quan trọng nhất.</strong> Khi máy chủ không với tới được, thì mọi thứ chạy trên nó cũng thế.</p>

<h3>Một phép kiểm từ bên ngoài nên HỎI cái gì</h3>
${slide('dv-09', 23, 'Mã 200 chưa chứng minh trang chạy: kiểm NỘI DUNG, tên miền thật, hạn chứng chỉ')}
<p>Không phải <code>/health</code>. Toàn bộ ý nghĩa của nó là đi qua con đường NGƯỜI DÙNG đi:</p>

<pre><code><span class="tok-comment"># kiem tu MOT MAY KHAC, dung ten mien that, va doi thu THAT SU co tren trang</span>
curl -sS --max-time 10 https://vidu.com/ \\
  | grep -q 'id="trang-chu"' || echo "TRANG CHU HONG"

<span class="tok-comment"># kem: chung chi con bao nhieu ngay</span>
echo | openssl s_client -connect vidu.com:443 -servername vidu.com 2>/dev/null \\
  | openssl x509 -noout -enddate</code></pre>

<div class="kv-grid">
<div class="kv"><span class="k">đúng tên miền thật</span><span class="v">đi qua DNS, TLS, tường lửa và proxy — bốn thứ mà một phép kiểm <code>127.0.0.1</code> không thấy được</span></div>
<div class="kv"><span class="k">một trang THẬT</span><span class="v">không phải một endpoint tồn tại chỉ để bị thăm dò. Cú hỏng của 9.5 sống trong đúng cái khối mà <code>/health</code> KHÔNG ở trong</span></div>
<div class="kv"><span class="k">NỘI DUNG, không phải mã trạng thái</span><span class="v">một cái 200 hiển thị ra trang lỗi thì vẫn là 200. Hãy grep một thứ chỉ trang chạy được mới có</span></div>
<div class="kv"><span class="k">từ NƠI KHÁC</span><span class="v">bất kỳ máy nào khác. Một dịch vụ theo dõi miễn phí, một cron trên laptop, một VPS khác — yêu cầu duy nhất là nó KHÔNG phải cái máy này</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — kiểm NỘI DUNG mới là thứ bắt được những cú hỏng trả về 200.</strong> Một ứng dụng một-trang mà gói JavaScript của nó 404 sẽ phục vụ một cái 200 hoàn toàn hợp lệ với một <code>&lt;div id="root"&gt;</code> rỗng. Một backend trả <code>{"error":"database unavailable"}</code> kèm mã 200 — mà nhiều framework làm thế hơn bạn muốn — thì vô hình với một phép kiểm mã trạng thái. Và ca bộ đệm ở Chương 6 trả 200 với <em>SAI PHIÊN BẢN</em>. Cả ba ca đều có mã trạng thái ổn còn website thì không, và đó là lý do phép kiểm phải nhìn vào PHẦN THÂN.</p>
</div>

<h3>Đo thật: một trang lỗi trả mã 200</h3>
<p>App thí nghiệm trả trang chủ có <code>&lt;main id="trang-chu"&gt;</code>. Tạo tệp <code>/srv/app/CSDL_HONG</code> làm nó cư xử như một app mất cơ sở dữ liệu: nó VẪN trả <strong>200</strong>, kèm một dòng báo lỗi thay cho trang.</p>
<div class="out">$ sudo touch /srv/app/CSDL_HONG
$ curl -s -o /dev/null -w "%{http_code}" localhost/
200
$ curl -sf localhost/ &gt;/dev/null; echo exit=$?
exit=0
$ curl -s localhost/ | grep -q 'id="trang-chu"' || echo "TRANG CHU HONG"
TRANG CHU HONG</div>
<p><code>curl -f</code> (<code>--fail</code>) chỉ biến mã HTTP 4xx/5xx thành mã thoát khác không; một trang lỗi trả 200 thì lọt qua. Chỉ phép kiểm NỘI DUNG nhận ra. Dấu hiệu bạn grep phải là thứ CHỈ có khi trang thật sự dựng xong — một id phần tử, một tiêu đề, một giá trị dữ liệu — chứ không phải tên website, thứ cũng nằm trên trang lỗi.</p>
<p>Nửa chứng chỉ của phép kiểm bên ngoài, với một chứng chỉ thí nghiệm cấp cho 10 ngày (tên <code>vidu.test</code> trỏ vào VPS thí nghiệm trong <code>/etc/hosts</code>):</p>
<div class="out">$ echo | openssl s_client -connect vidu.test:443 -servername vidu.test 2&gt;/dev/null | openssl x509 -noout -enddate
notAfter=Oct  9 06:41:48 2026 GMT
$ echo | openssl s_client -connect vidu.test:443 -servername vidu.test 2&gt;/dev/null | openssl x509 -noout -checkend $((14*86400)); echo "checkend 14 ngay: exit=$?"
Certificate will expire
checkend 14 ngay: exit=1</div>
<table><tr><th>Mảnh</th><th>Nghĩa</th></tr>
<tr><td><code>echo |</code></td><td>đóng đầu vào của s_client để nó ngắt sau khi bắt tay thay vì đứng chờ</td></tr>
<tr><td><code>-servername vidu.test</code></td><td>SNI (<em>chỉ định tên máy chủ</em>): nói cho máy chủ đang chứa nhiều website biết phải đưa chứng chỉ nào. Thiếu nó có thể bạn kiểm nhầm chứng chỉ</td></tr>
<tr><td><code>x509 -noout -enddate</code></td><td>chỉ in ngày <code>notAfter</code> (hết hạn)</td></tr>
<tr><td><code>-checkend N</code></td><td>thoát 1 nếu chứng chỉ hết hạn trong vòng N giây — dùng thẳng trong <code>if</code> của script</td></tr></table>
<h3>Hai phép kiểm, và chúng KHÔNG thay thế nhau được</h3>
<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">bên trong</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">bộ giám sát tiến trình</div><div class="lz-nsub"><code>/health</code> NÔNG, thăm dò vài giây một lần, khởi động lại tiến trình. Phải RẺ và KHÔNG được đụng tới cơ sở dữ liệu (6.2)</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">bên ngoài</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">phép kiểm trải nghiệm người dùng</div><div class="lz-nsub">một trang THẬT qua tên miền THẬT, từ một máy khác, kiểm NỘI DUNG. Đánh thức một con người, không bao giờ khởi động lại thứ gì</div></div></div>
</div>
</div>

<p>Chúng trả lời hai câu hỏi khác nhau, và lẫn lộn chúng đẻ ra cả hai lỗi kinh điển: một chốt kiểm sức khoẻ SÂU làm ứng dụng bị giết trong một cú nấc của cơ sở dữ liệu, và một hệ theo dõi bên ngoài NÔNG tới mức không thấy được một cú sập.</p>

<h3>Bản rẻ nhất mà vẫn chạy</h3>
<p>Một dịch vụ theo dõi miễn phí kiểm một URL mỗi năm phút bao được phần lớn danh sách trên và tốn không đồng nào. Nếu bạn muốn tự sở hữu, thì toàn bộ chuyện đó là một cron job trên bất kỳ cái máy nào khác mà bạn có:</p>

<pre><code>*/5 * * * * /usr/bin/curl -sS --max-time 10 https://vidu.com/ \\
  | grep -q 'id="trang-chu"' || /usr/local/bin/bao-dong "trang chu hong"</code></pre>

<p>Tính chất quan trọng không phải sự tinh vi, mà là <em>VỊ TRÍ</em>. Một script shell mười hai dòng trên một cái máy KHÁC phát hiện được cả một lớp hỏng mà một hệ quan sát đầy đủ trên CÙNG cái máy thì không.</p>

<div class="callout ok">
<p><strong>Quy tắc mà chương này và Chương 6 cùng đi tới.</strong> Chương 6 nói một cú lùi chưa xong cho tới khi CỬA TRƯỚC đồng ý. Chương 9 nói y hệt thế về sức khoẻ: <strong>mọi lời khẳng định về việc website có chạy hay không đều phải được kiểm chứng từ cái địa chỉ người dùng GÕ VÀO, kiểm một thứ mà chỉ trang chạy được mới có.</strong> Mọi thứ khác — tiến trình đang sống, cổng đã gắn, <code>/health</code> trả 200 — là một phát biểu về CÁI MÁY của bạn, không phải về NGƯỜI DÙNG của bạn.</p>
</div>

<h3>Một bộ canh bên ngoài có thật: máy nhà canh VPS</h3>
${slide('dv-09', 24, 'Canh từ BÊN NGOÀI: máy nhà canh VPS — timer 5 phút + AccuracySec 30 s')}
${slide('dv-09', 25, 'canh-vps.sh: sáu phép kiểm, một kênh báo, khoá SSH chỉ đọc')}
<p>Mọi thứ ở trên, đúng như nó đang chạy cho cuongthai.com. Ngày 18/08/2026, một lần rà soát phát hiện script giám sát nằm ngay trên VPS, <code>monitor.sh</code>, cứ năm phút lại phát hiện sự cố và KHÔNG NÓI VỚI AI: token Telegram trống, email báo động trống, và lệnh <code>mail</code> chưa được cài. <code>send_alert()</code> chỉ ghi vào một tệp log. Cùng ngày, một bộ thay thế chạy trên máy nhà (Fedora, cái máy dựng ảnh): <code>canh-vps.sh</code>, do một timer systemd của NGƯỜI DÙNG chạy.</p>
<table><tr><th>Thiết lập</th><th>Giá trị</th><th>Tác dụng</th></tr>
<tr><td><code>OnBootSec=</code></td><td><code>3min</code></td><td>lần chạy đầu ba phút sau khi máy khởi động</td></tr>
<tr><td><code>OnUnitActiveSec=</code></td><td><code>5min</code></td><td>lần kế tiếp năm phút sau khi lần trước BẮT ĐẦU</td></tr>
<tr><td><code>AccuracySec=</code></td><td><code>30s</code></td><td>systemd được phép lùi tới 30 giây để gom các lần đánh thức — khoảng cách đo thật cỡ <strong>5 phút 30 giây</strong> (12:44:17, 12:49:47, 12:55:16…)</td></tr>
<tr><td><code>Type=oneshot</code>, <code>TimeoutStartSec=300</code></td><td></td><td>mỗi nhịp chạy một lần, và bị giết nếu một phép kiểm treo</td></tr></table>
<p>Nó kiểm, từ phía Internet: <code>/</code> phải 200; <code>/api/v1/system/health</code> và <code>/api/v1/feed/posts</code> phải 200 hoặc 401 (404 ở route feed nghĩa là ảnh cũ hoặc dựng thiếu — bài học 02/07); chứng chỉ TLS phải còn từ 14 ngày. Rồi nó hỏi chính VPS qua SSH bằng một khoá chỉ chạy được ĐÚNG một lệnh chỉ đọc, <code>tinh-trang</code> (ép bằng <code>command=</code> trong <code>authorized_keys</code> của VPS), lệnh này trả về % đĩa, số container không khoẻ, đã thoát, đang chạy, và tuổi của bản backup mới nhất. Ngưỡng: đĩa ≥ 90%, bất kỳ container không khoẻ hay đã thoát, ít hơn 6 container chạy, backup cũ hơn 26 giờ. Nó báo qua một bot Telegram chỉ khi dấu vân tay md5 của danh sách lỗi ĐỔI, nhắc lại sau 6 giờ, và báo khi bình thường lại.</p>
<div class="pitfall co-tieu-de"><p><strong>Bot Telegram không nhắn cho bạn TRƯỚC được.</strong> Telegram chỉ cho bot gửi vào cuộc trò chuyện đã từng nhắn cho nó. Dựng bot mà quên bấm START thì mọi request trông đều đúng và không tin nào tới cả. Đây là bước hay bị quên nhất khi dựng lại bộ canh — hãy thử bằng một báo động cố ý ngay ngày dựng.</p></div>

<h3>26 ngày đỏ: cái container job bị bỏ quên</h3>
${slide('dv-09', 26, '26 ngày đỏ vì một container job bị quên — 43 ngày journal của bộ canh')}
<p>Chính journal của bộ canh (đọc chỉ-đọc, 18/08 → 29/09/2026) là lý lẽ mạnh nhất của chương cho mọi điều ở Bài 9.4. Khoảng 263 lần kiểm mỗi ngày. Xanh mỗi ngày tới 25/08, khi cảnh báo chứng chỉ bắt đầu lúc còn 13 ngày. Ngày <strong>03/09 lúc 13:12</strong> xuất hiện một lỗi mới: <code>1 container da CHET (exited)</code>. Container của một job chạy một lần (phân loại câu hỏi đề thi cho một khoá học) đã chạy xong và bị bỏ lại — không có <code>--rm</code> — còn phép kiểm thì coi MỌI container đã thoát là chết. Nó nằm đó tới khi container bị xoá ngày <strong>29/09</strong>; lần kiểm kế tiếp, lúc 02:00:08, in "OK tat ca binh thuong".</p>
<div class="kv-grid">
<div class="kv"><span class="k">6.517 lần kiểm</span><span class="v">có "1 container da CHET" trong khoảng 03/09 tới 29/09.</span></div>
<div class="kv"><span class="k">602 tin Telegram</span><span class="v">từ 03/09 tới 29/09 (tổng 643 kể từ 18/08), có ngày lên tới 70 tin (07/09).</span></div>
<div class="kv"><span class="k">Trong CÙNG kênh đó</span><span class="v">các sự cố thật: chứng chỉ chạm "0 ngày" vào 07–08/09 trước khi được gia hạn, và đĩa chạm 100% vào các ngày 04, 10 và 13/09.</span></div>
<div class="kv"><span class="k">201 cú chập một lần kiểm</span><span class="v">"trang chủ không lên" đúng MỘT lần kiểm; mỗi cú tốn hai tin (đổi, rồi đổi lại). 314 trên 324 lần "trang chủ không lên" là <code>HTTP 000000</code> — không nhận được phản hồi nào, mà nhìn từ mạng nhà thì không phân biệt được với chuyện chính mạng nhà rớt.</span></div>
</div>
<p>Ba bài học, cái nào cũng đã có ở Bài 9.4, giờ gắn thêm giá tiền. <strong>Một báo động lúc nào cũng đỏ thì thôi được đọc</strong>, và những sự cố thật — chứng chỉ còn 0 ngày, đĩa đầy — tới trong một kênh mà ai cũng đã quen lướt qua. <strong>Chỉ đếm cái thật sự hỏng</strong>: một container job đã thoát không phải một dịch vụ bị sập; hãy đếm <code>Exited</code> có mã khác không, hoặc chỉ container thuộc project Compose của bạn, và chạy job một lần bằng <code>docker run --rm</code>. <strong>Đòi hai lần hỏng liên tiếp</strong> và kiểm một địa chỉ bên thứ ba trước khi báo "website sập" từ mạng nhà — 201 cú chập đã chẳng tốn gì.</p>
<div class="out">$ docker ps -a --filter label=dvhoc=09 --filter status=exited --format "{{.Names}}\\t{{.Status}}"
dv09-api	Exited (1) 2 seconds ago
dv09-job-phanloai	Exited (0) 12 seconds ago
$ docker ps -a --filter label=dvhoc=09 --filter status=exited --format "{{.Names}}\\t{{.Status}}" | grep -v "Exited (0)"
dv09-api	Exited (1) 2 seconds ago</div>
<p>Dựng lại trên Mac: một job đã xong (<code>Exited (0)</code>) và một API bị sập (<code>Exited (1)</code>) đều là "đã thoát". Lọc bỏ <code>Exited (0)</code> thì chỉ còn đúng cái đáng lo.</p>

<h3>Công cụ: khi nào tự viết, khi nào không</h3>
${slide('dv-09', 27, 'Chọn công cụ: tự viết, Uptime Kuma, Prometheus + Grafana, Netdata')}
<table><tr><th>Công cụ</th><th>Là gì</th><th>Dùng khi</th></tr>
<tr><td>cron/timer systemd + curl + webhook</td><td>30–150 dòng shell của chương này</td><td>một hai máy chủ, và bạn muốn hiểu từng dòng</td></tr>
<tr><td>Uptime Kuma</td><td>giao diện web tự host (từ 2021; bản 2.5.5 ra 16/09/2026): kiểm HTTP, từ khoá, TCP, DNS, Docker, hơn 90 kênh báo trong đó có Telegram</td><td>bạn muốn trang trạng thái và báo động mà không viết mã — chạy nó trên một máy KHÁC</td></tr>
<tr><td>Prometheus + Grafana</td><td>cơ sở dữ liệu số đo kiểu kéo (pull) với PromQL (<code>predict_linear</code>, <code>histogram_quantile</code>) cộng bảng đồ thị</td><td>nhiều máy hay nhiều dịch vụ, SLO, đồ thị hàng tháng — không đặt cạnh app trên VPS 1 GB</td></tr>
<tr><td>Netdata</td><td>agent số đo mỗi GIÂY có sẵn bảng ở cổng 19999; README của hãng ghi mặc định cỡ 5% CPU và 150 MB RAM</td><td>soi một sự cố ĐANG diễn ra trên một máy</td></tr></table>
<p>Site có trọn một khoá cho bước tiếp theo — <strong>Observability &amp; Monitoring</strong> (log có cấu trúc, chỉ số, trace, cảnh báo, SLO); chương này lo phần bạn cần ngay ngày đầu tiên deploy.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> cho buổi bảo vệ đồ án, nhóm muốn một bộ canh bắt được chuyện "trang chủ trắng trơn mà API vẫn ổn". Hãy dựng một bộ chạy từ một cái máy KHÁC và kiểm NỘI DUNG, không chỉ mã trạng thái.</p>
<ol>
<li>Trên VPS thí nghiệm, thêm một khối server nginx thứ hai ở 8081 mà <code>location /health</code> đúng còn <code>location /</code> trỏ vào một cổng không ai dùng; kiểm cả hai đường từ một container khác: <code>docker run --rm --network dv09-net alpine wget -S -O /dev/null http://dv09-vps:8081/</code>.</li>
<li>Cho app trả một trang lỗi mã 200 (<code>touch /srv/app/CSDL_HONG</code>) rồi so <code>curl -sf</code> với <code>curl -s … | grep -q 'id="trang-chu"'</code>.</li>
<li>Cấp một chứng chỉ 10 ngày bằng <code>openssl req -x509 … -days 10</code>, phục vụ nó ở cổng 443 và kiểm bằng <code>-checkend $((14*86400))</code>.</li>
<li>Chạy hai container gắn nhãn <code>dvhoc=09</code> — một cái thoát 0, một cái thoát 1 — rồi viết phép đếm container "chết" bỏ qua cái thứ nhất.</li>
</ol>
<p><strong>Đạt khi:</strong> phép kiểm của bạn báo 502 ở <code>/</code> trong khi <code>/health</code> 200, bắt được trang lỗi mã 200, thoát 1 với chứng chỉ 10 ngày, và đếm đúng một container chết.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Health check (phép kiểm còn sống)</span><span class="v">Một endpoint rẻ mà bộ giám sát tiến trình hỏi đều đặn để quyết có khởi động lại tiến trình không.</span></div>
<div class="kv"><span class="k">External / synthetic check (kiểm từ bên ngoài)</span><span class="v">Một request làm giống người dùng, từ một máy khác, qua đúng tên miền thật.</span></div>
<div class="kv"><span class="k">Content check (kiểm nội dung)</span><span class="v">Tìm một thứ chỉ trang chạy được mới có, thay vì tin mã trạng thái.</span></div>
<div class="kv"><span class="k">SNI — Server Name Indication (chỉ định tên máy chủ)</span><span class="v">Tên máy gửi trong lúc bắt tay TLS để máy chủ chọn đúng chứng chỉ.</span></div>
<div class="kv"><span class="k">Forced command (lệnh bị ép)</span><span class="v"><code>command=</code> trong <code>authorized_keys</code>: khoá đó chỉ chạy được đúng một lệnh.</span></div>
<div class="kv"><span class="k">Flapping (chập chờn)</span><span class="v">Một phép kiểm hỏng một lần rồi tự hết; báo cho từng cú chập là nhân đôi tiếng ồn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một phép kiểm chỉ chứng minh đúng con đường nó đi: <code>/health</code> 200 và <code>/</code> 502 qua cùng một proxy.</li>
<li>Mã 200 không có nghĩa là "chạy": kiểm nội dung, tên miền thật, và hạn chứng chỉ bằng <code>-checkend</code>.</li>
<li>Canh từ một máy khác — bộ thật chạy trên máy nhà mỗi 5 phút 30 giây, với một khoá SSH chỉ đọc.</li>
<li>Một container job bị quên giữ báo động đỏ 26 ngày và 602 tin, vùi lấp chứng chỉ còn 0 ngày và cái đĩa đầy.</li>
<li>Chỉ đếm cú hỏng thật, đòi hai lần liên tiếp, và chọn công cụ theo quy mô: shell, Uptime Kuma, rồi mới Prometheus.</li>
</ul>
<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Uptime Kuma — bộ giám sát tự host</span><span class="lc-sub">github.com/louislam/uptime-kuma — các kiểu phép kiểm, các kênh báo và lệnh cài Docker một dòng (kiểm 09/2026).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.timer(5)</span><span class="lc-sub">freedesktop.org/software/systemd/man/latest/systemd.timer.html — <code>OnUnitActiveSec=</code> và <code>AccuracySec=</code>, lý do bộ canh máy nhà chạy mỗi 5 phút 30 giây.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Telegram Bot API</span><span class="lc-sub">core.telegram.org/bots/api — <code>sendMessage</code>, và vì sao bot chỉ viết được vào cuộc trò chuyện đã bấm START với nó.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Observability &amp; Monitoring — khoá tiếp theo</span><span class="lc-sub">/courses/observability-monitoring/learn${REF} — log có cấu trúc, chỉ số, trace, cảnh báo và SLO cho một backend Node.js trên VPS.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — proxy_pass và cách khớp location</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass — vì sao một khối location có thể đúng trong khi khối kia thì không, mà đó là toàn bộ cơ chế của cú hỏng ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">curl(1) — --max-time, --fail và --resolve</span><span class="lc-sub">curl.se/docs/manpage.html — riêng <code>--resolve</code> cho phép bạn kiểm một máy chủ cụ thể bằng tên miền THẬT của nó trước khi DNS trỏ vào đó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">openssl-s_client(1)</span><span class="lc-sub">docs.openssl.org/master/man1/openssl-s_client/ — phép kiểm hạn chứng chỉ ở trên, và <code>-servername</code> cho SNI, thiếu nó là bạn kiểm nhầm máy chủ ảo.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kubernetes — liveness, readiness và startup probe</span><span class="lc-sub">kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/ — phát biểu công bố rõ nhất về việc vì sao phép kiểm-để-khởi-động-lại và phép kiểm "nó có chạy không" phải là HAI thứ tách biệt.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — thứ tự khớp location, và chẩn đoán một cú 502</span><span class="lc-sub">/courses/nginx/learn${REF} — một request thật ra rơi vào khối nào, và log lỗi nói gì khi một upstream từ chối kết nối.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 9.6 ─────────────────────────── */
    {
      title: '9.6 — Quiz: monitoring|||9.6 — Quiz: giám sát',
      slug: 'deploy-9-6-quiz',
      type: 'QUIZ',
      description: 'Mười câu tình huống: load average 0,10 khi CPU 100%, trung bình 65 ms với p95 857 ms, -p err không thấy lỗi JSON, docker logs nuốt stderr, vân tay có con số, "000000", /health 200 khi trang chủ 502, và 26 ngày đỏ vì một container job.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.6</span>
<h2>Quiz: monitoring</h2>
<p class="lead">Ten situations from real measurements in this chapter — numbers that were late, numbers that described nobody, searches that found nothing, and an alarm that was red for so long nobody read it. Each answer comes with the reason the most tempting wrong option is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can compute CPU busy from two readings of <code>/proc/stat</code>, and explain why load average lags and PSI does not.</li>
<li>I can get mean, p50, p95 and p99 from a log with <code>sort</code> and <code>awk</code>, and say why percentiles cannot be averaged.</li>
<li>I can query JSON logs from journald with <code>jq -R 'fromjson? | select(…)'</code> and follow one request id through nginx and the app.</li>
<li>I know why <code>journalctl -p err</code>, <code>docker logs | grep</code> and <code>journalctl -u</code> can all miss lines that exist.</li>
<li>I can build an alert that fires on change, reminds, silences with an expiry and announces recovery — and test it with a fake webhook.</li>
<li>I can check a site from another machine by content, hostname and certificate expiry, and count only real failures.</li>
</ul>
${slide('dv-09', 29, 'Bảng tra nhanh Chương 9 (1/2): đo và đọc log')}
${slide('dv-09', 30, 'Bảng tra nhanh Chương 9 (2/2): báo động và canh ngoài')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.6</span>
<h2>Quiz: giám sát</h2>
<p class="lead">Mười tình huống lấy từ các phép đo thật trong chương — những con số đến muộn, những con số không mô tả ai, những lần tìm mà không thấy gì, và một báo động đỏ lâu tới mức không ai còn đọc. Mỗi đáp án kèm lý do vì sao phương án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi tính được CPU bận từ hai lần đọc <code>/proc/stat</code>, và giải thích được vì sao load average đi sau còn PSI thì không.</li>
<li>Tôi lấy được trung bình, p50, p95, p99 từ một cuốn log bằng <code>sort</code> và <code>awk</code>, và nói được vì sao không lấy trung bình các phân vị.</li>
<li>Tôi hỏi được log JSON từ journald bằng <code>jq -R 'fromjson? | select(…)'</code> và lần theo một request id qua nginx và app.</li>
<li>Tôi biết vì sao <code>journalctl -p err</code>, <code>docker logs | grep</code> và <code>journalctl -u</code> đều có thể bỏ sót những dòng có thật.</li>
<li>Tôi dựng được báo động nổ khi trạng thái đổi, biết nhắc lại, tạm im có hạn, báo khi khỏi — và thử nó bằng một webhook giả.</li>
<li>Tôi kiểm được một website từ máy khác theo nội dung, tên miền và hạn chứng chỉ, và chỉ đếm những cú hỏng thật.</li>
</ul>
${slide('dv-09', 29, 'Bảng tra nhanh Chương 9 (1/2): đo và đọc log')}
${slide('dv-09', 30, 'Bảng tra nhanh Chương 9 (2/2): báo động và canh ngoài')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'The site is slow. A teammate runs uptime and says "load average 0.41, the server is idle". You run cat /proc/pressure/cpu and see some avg10=28.72. What do you conclude?|||Website chậm. Bạn cùng nhóm chạy uptime rồi nói "load average 0,41, máy đang rảnh". Bạn chạy cat /proc/pressure/cpu và thấy some avg10=28.72. Bạn kết luận gì?',
            options: [
              'The two numbers disagree, so one of the tools is broken|||Hai con số mâu thuẫn, nên một trong hai công cụ bị hỏng',
              'Load average is a slow moving average; PSI says tasks waited for a CPU 28.7% of the last 10 s, so the CPU is saturated right now|||Load average là trung bình động chậm; PSI nói tác vụ phải chờ CPU trong 28,7% của 10 giây vừa qua, nên CPU đang bão hoà ngay lúc này',
              'PSI counts all processes since boot, so 28.72 says nothing about now|||PSI đếm mọi tiến trình từ lúc khởi động, nên 28,72 chẳng nói gì về hiện tại',
              'Load average below 1 on any machine means the CPU is fine|||Load average dưới 1 trên bất kỳ máy nào đều có nghĩa CPU ổn',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Measured in this chapter: with four cores pinned from t=0 the one-minute load read 0.10 and only 2.62 after a minute; on the lab VPS, 15 runnable tasks showed load 2.81 while PSI already said 28.72%. "One tool is broken" is tempting, but both are correct — they answer different questions: load average describes the last minutes, PSI avg10 the last ten seconds.|||VI: Đo trong chương: bốn nhân bị ghim từ t=0 mà load một phút đọc ra 0,10 và sau một phút mới 2,62; trên VPS thí nghiệm, 15 tác vụ đang chờ chạy mà load là 2,81 trong khi PSI đã nói 28,72%. "Một công cụ hỏng" nghe hấp dẫn, nhưng cả hai đều đúng — chúng trả lời hai câu khác nhau: load average mô tả vài phút đã qua, PSI avg10 mô tả mười giây vừa rồi.',
          },
          {
            question: 'Your cpu.sh prints "delta tong=687" on a 10-core VPS after sleep 1. A teammate wants to change the formula to divide by 1000 (100 jiffies × 10 cores). What happens?|||cpu.sh của bạn in "delta tong=687" trên một VPS 10 nhân sau sleep 1. Bạn cùng nhóm muốn sửa công thức thành chia cho 1000 (100 jiffy × 10 nhân). Chuyện gì xảy ra?',
            options: [
              'Nothing changes; 687 and 1000 are the same after rounding|||Không đổi gì; 687 và 1000 như nhau sau khi làm tròn',
              'The result becomes more accurate, because 1000 is the theoretical value|||Kết quả chính xác hơn, vì 1000 là giá trị lý thuyết',
              'The percentage becomes wrong: busy jiffies must be divided by the measured total of the same interval, whatever it turned out to be|||Tỷ lệ sẽ SAI: số jiffy bận phải chia cho tổng ĐO ĐƯỢC của cùng khoảng đó, dù nó ra bao nhiêu',
              'The script stops working because awk cannot divide by a constant|||Script ngừng chạy vì awk không chia cho hằng số được',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: sleep 1 does not sleep exactly one second and the kernel does not always account 100 ticks per core; the lab measured 687 under load and 1013 idle. Dividing by the measured delta keeps the ratio right. "More accurate with the theoretical value" is the trap: the numerator and denominator must come from the same interval.|||VI: sleep 1 không ngủ đúng một giây và nhân không phải lúc nào cũng ghi đủ 100 tick mỗi nhân; phòng thí nghiệm đo được 687 khi có tải và 1013 khi rảnh. Chia cho delta đo được thì tỷ lệ vẫn đúng. "Chính xác hơn với giá trị lý thuyết" là cái bẫy: tử số và mẫu số phải đến từ CÙNG một khoảng.',
          },
          {
            question: 'Over 1,000 requests the dashboard shows a mean of 65.2 ms, and pv.sh prints p50 18.4 ms, p90 24.2 ms, p95 856.7 ms. What is the best reading?|||Trên 1.000 request, bảng điều khiển hiện trung bình 65,2 ms, còn pv.sh in p50 18,4 ms, p90 24,2 ms, p95 856,7 ms. Cách đọc đúng nhất là gì?',
            options: [
              'Two populations: about 95% fast and about 5% on a slow path; the mean sits in an empty gap and describes nobody|||Hai đám đông: khoảng 95% nhanh và khoảng 5% đi đường chậm; trung bình nằm trong khe trống và không mô tả ai',
              'The API is healthy because 65 ms is below the usual 100 ms target|||API khoẻ vì 65 ms dưới mục tiêu 100 ms thông thường',
              'p95 is an outlier caused by measurement noise and can be ignored|||p95 là một điểm dị thường do nhiễu đo và có thể bỏ qua',
              'Most users wait about 65 ms, a few wait longer|||Phần lớn người dùng chờ khoảng 65 ms, một số ít chờ lâu hơn',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: The histogram had 938 requests at 10–29 ms, 52 at 800–999 ms and zero in the 50–99 ms bucket where the mean lives. A 35× jump between p90 and p95 is the signature of two code paths, not noise. "Most users wait about 65 ms" is the most tempting wrong answer — nobody waited 65 ms.|||VI: Histogram có 938 request ở 10–29 ms, 52 ở 800–999 ms và KHÔNG request nào ở thùng 50–99 ms nơi con trung bình sống. Cú nhảy 35 lần giữa p90 và p95 là chữ ký của hai đường mã, không phải nhiễu. "Phần lớn người dùng chờ khoảng 65 ms" là đáp án sai hấp dẫn nhất — không ai chờ 65 ms cả.',
          },
          {
            question: 'Server A reports p95 = 856.7 ms and server B reports p95 = 24.4 ms. The weekly report needs "p95 of the whole service". What should you do?|||Máy A báo p95 = 856,7 ms và máy B báo p95 = 24,4 ms. Báo cáo tuần cần "p95 của cả dịch vụ". Bạn nên làm gì?',
            options: [
              'Report the average, 440.6 ms, since both servers get similar traffic|||Báo trung bình, 440,6 ms, vì hai máy nhận lưu lượng tương đương',
              'Report the larger value, 856.7 ms, to be safe|||Báo giá trị lớn hơn, 856,7 ms, cho chắc',
              'Report the smaller value, because B served more requests|||Báo giá trị nhỏ hơn, vì B phục vụ nhiều request hơn',
              'Merge the raw timings (or histogram buckets) and compute p95 once — on this data it is 25.9 ms|||Gộp các thời gian thô (hoặc các thùng histogram) rồi tính p95 một lần — trên dữ liệu này nó là 25,9 ms',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Percentiles are properties of a distribution and do not combine arithmetically. On the chapter data the average of the two p95s is 440.6 ms against a true combined p95 of 25.9 ms — 17× off. "Report the larger to be safe" sounds prudent but is still not a percentile of anything.|||VI: Phân vị là tính chất của một phân bố và không gộp bằng số học được. Trên dữ liệu của chương, trung bình hai p95 là 440,6 ms trong khi p95 thật của dữ liệu gộp là 25,9 ms — sai 17 lần. "Báo cái lớn hơn cho chắc" nghe cẩn thận nhưng vẫn không phải phân vị của thứ gì.',
          },
          {
            question: 'After a deploy, users report errors. journalctl -u app -p err prints "-- No entries --", yet the app writes one JSON line per request with "level":"error" on failures. Why?|||Sau một lần deploy, người dùng báo lỗi. journalctl -u app -p err in "-- No entries --", trong khi app ghi một dòng JSON mỗi request với "level":"error" khi hỏng. Vì sao?',
            options: [
              'The deploy wiped the journal, so there is nothing to show|||Lần deploy đã xoá journal, nên không còn gì để hiện',
              'journald stores the service’s stdout at priority info; the word "error" inside the JSON is not a priority, so filter the field with jq instead|||journald cất stdout của service ở mức info; chữ "error" nằm trong JSON không phải là mức ưu tiên, nên hãy lọc trường đó bằng jq',
              'The errors are real only in nginx, not in the app|||Lỗi chỉ có thật ở nginx, không có ở app',
              '-p err only shows kernel messages|||-p err chỉ hiện thông điệp của nhân',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Measured on the lab VPS: "-- No entries --" while grep counted 25 error lines and jq grouped 25 responses with status 500. Priority is set per stream, not read from your text. Note the second trap: plain jq then fails at "Started app.service…", so use jq -R with fromjson? and select(.level == "error"). "The deploy wiped the journal" is wrong — the lines are there, grep sees them.|||VI: Đo trên VPS thí nghiệm: "-- No entries --" trong khi grep đếm được 25 dòng lỗi và jq gom được 25 phản hồi mã 500. Mức ưu tiên được đặt theo luồng, không đọc từ chữ của bạn. Để ý cái bẫy thứ hai: jq trần sẽ chết ở dòng "Started app.service…", nên dùng jq -R kèm fromjson? và select(.level == "error"). "Deploy đã xoá journal" là sai — các dòng vẫn còn, grep thấy chúng.',
          },
          {
            question: 'A container keeps crashing. docker logs api | grep -c -i error prints the line "Error: loading shared library libssl.so.3" on screen and then the number 0. What is going on?|||Một container cứ sập. docker logs api | grep -c -i error in dòng "Error: loading shared library libssl.so.3" lên màn hình rồi in số 0. Chuyện gì đang xảy ra?',
            options: [
              'grep -c counts only lines that start with the pattern|||grep -c chỉ đếm những dòng bắt đầu bằng mẫu',
              'The container restarted between the two outputs|||Container khởi động lại giữa hai lần in',
              'docker logs sends the container’s stderr to your stderr, which bypasses the pipe; add 2>&1 before the pipe|||docker logs gửi stderr của container ra stderr của bạn, thứ đi vòng qua ống dẫn; thêm 2>&1 trước ống',
              'The -i flag makes grep ignore uppercase "Error"|||Cờ -i làm grep bỏ qua chữ "Error" viết hoa',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Reproduced on the Mac: without 2>&1 the count is 0 while the error is visible on the terminal; with 2>&1 it is 1. The line on screen is exactly the proof — it reached the terminal through stderr, not through grep. "The container restarted" is tempting for a crashing container, but the count would not be 0 while the line is printed.|||VI: Dựng lại trên Mac: không có 2>&1 thì đếm ra 0 trong khi dòng lỗi hiện trên màn hình; có 2>&1 thì ra 1. Chính dòng trên màn hình là bằng chứng — nó tới terminal qua stderr chứ không qua grep. "Container khởi động lại" hấp dẫn với một container đang sập, nhưng không làm số đếm ra 0 khi dòng đó vẫn được in.',
          },
          {
            question: 'Your alert script hashes the whole problem list and sends a message whenever the hash changes. With a dead container and a disk rising from 90% to 95%, it sent 6 messages in an hour. What is the best fix?|||Script báo động của bạn băm cả danh sách lỗi và gửi tin mỗi khi mã băm đổi. Với một container chết và đĩa lên từ 90% tới 95%, nó gửi 6 tin trong một giờ. Cách sửa tốt nhất là gì?',
            options: [
              'Run the check every 30 minutes instead of every 5.5 minutes|||Chạy phép kiểm mỗi 30 phút thay vì mỗi 5,5 phút',
              'Stop sending the disk percentage at all|||Thôi hẳn không gửi phần trăm đĩa',
              'Send only the first message ever and never remind|||Chỉ gửi tin đầu tiên và không bao giờ nhắc lại',
              'Remove numbers from the fingerprint (and make "disk critical" a separate problem), keep a 6-hour reminder and a recovery message|||Bỏ con số khỏi vân tay (và biến "đĩa nguy" thành một lỗi riêng), giữ nhắc lại 6 giờ và tin báo khỏi',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Measured with the fake webhook: 6 messages with numbers in the fingerprint, 1 without. The real monitor sent 602 messages in 26 days partly for this reason. Checking less often only delays detection of real failures; never reminding means a missed message is lost forever.|||VI: Đo bằng webhook giả: 6 tin khi vân tay có con số, 1 tin khi bỏ. Bộ canh thật gửi 602 tin trong 26 ngày một phần vì lý do này. Kiểm thưa hơn chỉ làm chậm việc phát hiện cú hỏng thật; không bao giờ nhắc lại nghĩa là lỡ một tin là mất luôn.',
          },
          {
            question: 'A monitor runs MA=$(curl -s -o /dev/null -w "%{http_code}" "$URL" || echo 000). When the server is unreachable, the log shows "HTTP 000000" and a comparison [ "$MA" = "000" ] never matches. Why?|||Một bộ canh chạy MA=$(curl -s -o /dev/null -w "%{http_code}" "$URL" || echo 000). Khi máy chủ không với tới được, log ghi "HTTP 000000" và phép so [ "$MA" = "000" ] không bao giờ khớp. Vì sao?',
            options: [
              'curl already prints 000 through -w and also exits non-zero, so || echo 000 appends a second 000|||curl đã in 000 qua -w và còn thoát khác không, nên || echo 000 nối thêm một 000 nữa',
              'The server returned a custom status code 000000|||Máy chủ trả một mã trạng thái tự đặt 000000',
              'Bash doubles strings inside $( )|||Bash nhân đôi chuỗi bên trong $( )',
              '-s makes curl print the code twice|||-s làm curl in mã hai lần',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Measured: the command printed [000000]; curl alone printed 000 with exit=7 (could not connect). Use MA=$(curl …) and ${MA:-000} if you need a default. The real home monitor logged HTTP 000000 in 314 checks — the alert still fired, which is why nobody noticed. There is no HTTP status 000000; nothing answered at all.|||VI: Đo thật: lệnh in [000000]; riêng curl in 000 với exit=7 (không kết nối được). Dùng MA=$(curl …) và ${MA:-000} nếu cần giá trị mặc định. Bộ canh máy nhà thật ghi HTTP 000000 trong 314 lần kiểm — báo động vẫn nổ, nên không ai để ý. Không có mã HTTP 000000 nào cả; chẳng có ai trả lời.',
          },
          {
            question: 'An external check requests https://your-site/health every 5 minutes and it is always 200, but users say the homepage shows 502. nginx has location /health proxied correctly and location / pointing at a wrong port. How should the check change?|||Một phép kiểm bên ngoài gọi https://your-site/health mỗi 5 phút và luôn 200, nhưng người dùng nói trang chủ báo 502. nginx có location /health chuyển đúng và location / trỏ sai cổng. Nên đổi phép kiểm thế nào?',
            options: [
              'Make /health check the database too, so it goes red|||Cho /health kiểm cả cơ sở dữ liệu để nó chuyển đỏ',
              'Check /health more often, every 30 seconds|||Kiểm /health dày hơn, mỗi 30 giây',
              'Request the real pages users open (/ plus one data route) over the real hostname, and grep for content only a working page has|||Gọi đúng các trang người dùng mở (/ cộng một route dữ liệu) qua tên miền thật, và grep một nội dung chỉ trang chạy được mới có',
              'Move the check onto the VPS so it avoids network noise|||Chuyển phép kiểm lên chính VPS cho khỏi nhiễu mạng',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Measured twice in this chapter: /health 200 and / 502 through the same nginx, from the same box and from another container. The failure lives in a different location block, so no depth of /health finds it. A deeper /health is the most tempting wrong answer — it also risks getting the app restarted during a database blip. Moving the check onto the VPS loses DNS, TLS, firewall and whole-machine failures.|||VI: Đo hai lần trong chương: /health 200 và / 502 qua cùng một nginx, từ chính máy đó và từ một container khác. Cú hỏng nằm ở một khối location khác, nên /health sâu tới đâu cũng không thấy. /health sâu hơn là đáp án sai hấp dẫn nhất — nó còn có nguy cơ làm app bị khởi động lại khi cơ sở dữ liệu nấc một cái. Đưa phép kiểm lên VPS thì mất luôn các cú hỏng DNS, TLS, tường lửa và cả máy.',
          },
          {
            question: 'The home monitor has reported "1 container da CHET (exited)" every 5.5 minutes for 26 days. docker ps -a shows the exited container is a one-off job that finished its work. What is the right fix?|||Bộ canh máy nhà đã báo "1 container da CHET (exited)" mỗi 5,5 phút suốt 26 ngày. docker ps -a cho thấy container đã thoát là một job chạy một lần đã làm xong việc. Cách sửa đúng là gì?',
            options: [
              'Mute the Telegram bot until someone has time to look|||Tắt tiếng bot Telegram tới khi có ai rảnh xem',
              'Remove the finished container, run one-off jobs with --rm, and count only exited containers with a non-zero code (or only the Compose project)|||Xoá container đã xong, chạy job một lần bằng --rm, và chỉ đếm container đã thoát với mã khác không (hoặc chỉ của project Compose)',
              'Raise the alert threshold to 2 dead containers|||Nâng ngưỡng báo động lên 2 container chết',
              'Restart the job container so it is running again|||Khởi động lại container job để nó chạy trở lại',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: The real journal: 6,517 checks and 602 messages between 03/09 and 29/09, while a 0-day certificate and a 100% disk arrived in the same always-red channel. Muting the bot is the tempting answer and the worst one — it silences the real incidents too. Raising the threshold hides the next real crash. Filtering Exited (0) kept only the crashed API in the lab reproduction.|||VI: Journal thật: 6.517 lần kiểm và 602 tin giữa 03/09 và 29/09, trong khi chứng chỉ còn 0 ngày và đĩa 100% đến trong CÙNG cái kênh lúc nào cũng đỏ đó. Tắt tiếng bot là đáp án hấp dẫn và tệ nhất — nó bịt luôn các sự cố thật. Nâng ngưỡng thì giấu cú sập thật kế tiếp. Lọc bỏ Exited (0) chỉ giữ lại đúng cái API bị sập trong bản dựng lại ở phòng thí nghiệm.',
          },
        ],
      },
    },
  ],
};
