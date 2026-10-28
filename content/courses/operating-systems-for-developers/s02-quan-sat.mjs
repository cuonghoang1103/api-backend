/**
 * Operating Systems for Developers — Chương 2: Quan sát Linux hằng ngày (soạn 28/10/2026 theo _HOP-DONG.md).
 * Chủ kênh: "cả ngày làm việc bằng linux: xem tiến trình nào ăn tài nguyên, bộ nhớ cạn hay ổ đĩa đầy, container — mà tôi
 * đọc không hiểu gì" ⇒ chương dạy công cụ BẰNG CÁCH CHẨN ĐOÁN SỰ CỐ (triệu chứng → đo → nguyên nhân → sửa → phòng), phần
 * lớn là sự cố THẬT của chính dự án (CLAUDE.md "Known Error Patterns", ghi chép deploy, sổ tay sự cố), tái hiện an toàn
 * trong container vứt đi.
 *
 * Output CHẠY THẬT — lab/code/ch02/*.sh → lab/out/c2*.out.txt, ba kiểu chạy:
 *   • trong ảnh os-lab (phien):  docker run --rm --label oslab=1 --hostname oslab [cờ] -v "$PWD/ch02":/lab/ch02 -w /lab/ch02 os-lab bash -c "phien <kb>.sh 2>&1"
 *       c21-triage --privileged (dmesg) · c21-nhin --cpus 1 --memory 512m · c22-cpu --cap-add PERFMON --security-opt seccomp=unconfined
 *       c22-load --cpuset-cpus 0,1 · c22-cot, c23-mem (--mount type=volume,dst=/data), c25-net: không cờ · c24-disk --privileged (loop ext4 64 MB)
 *   • trong ảnh phụ os-lab-sd (systemd làm PID 1, ch02/Dockerfile.sd): c26-log, c26-rotate (container os-c26), c27-ssh (c27-dung.sh dựng 2 máy)
 *   • TỪ MÁY CHỦ bằng ch02/phien-host.sh (bash 3.2 của macOS): c22-zombie, c23-oom, c24-pg (postgres:17), c26-docker — đều tạo
 *     container --label oslab=1 rồi xoá; c24-host, c27-mac — lệnh CHỈ ĐỌC trên máy Mac soạn bài.
 * Máy đo: Docker Desktop trên Apple Silicon (arm64, 10 lõi, VM 7,7 GiB, nhân 7.0.12-linuxkit), Node 22, Python 3.14, PostgreSQL 17.11.
 * Đĩa đầy chỉ tái hiện trên file ext4 64–96 MB gắn loop — KHÔNG bao giờ trên đĩa thật.
 * LUẬT escaping: < > → &lt; &gt;; & → &amp;; không backtick trần, không gạch chéo ngược trong thân bài.
 */
import { run, src, card, kv, cmd } from './_ui.mjs';
import { lab } from './_lab.mjs';
import G21 from './giang/os-02-1.mjs';
import G22 from './giang/os-02-2.mjs';
import G23 from './giang/os-02-3.mjs';
import G24 from './giang/os-02-4.mjs';
import G25 from './giang/os-02-5.mjs';
import G26 from './giang/os-02-6.mjs';
import G27 from './giang/os-02-7.mjs';

const L = (href, ico, t, s, cta) => card(href, ico, t, s, cta);
const LNX = (slug) => '/courses/linux-bash/learn?lessonSlug=' + slug;
const OS = (slug) => '/courses/operating-systems-for-developers/learn?lessonSlug=' + slug;
/** Một sự cố theo khung chung của chương: [Triệu chứng, Đo, Nguyên nhân, Sửa, Phòng]. */
const SC = { en: ['Symptom', 'Measure', 'Cause', 'Fix', 'Prevent'], vi: ['Triệu chứng', 'Đo', 'Nguyên nhân', 'Sửa', 'Phòng'] };
const suCo = (lang, o) => `<table>${SC[lang].map((k, i) => `<tr><th>${k}</th><td>${o[i]}</td></tr>`).join('')}</table>`;

export default {
  title: 'Chapter 2 — Observing Linux day to day|||Chương 2 — Quan sát Linux hằng ngày',
  description: 'Tiến trình nào ăn CPU, RAM, đĩa, IO, mạng — học từng công cụ (top, ps, free, vmstat, iostat, df/du, lsof, ss, /proc, journalctl, dmesg, docker stats) bằng cách chẩn đoán lại những sự cố thật của chính dự án này: đĩa đầy giết Postgres, exit 137 khi build, log phình, file đã xoá vẫn giữ chỗ, tiến trình ăn hết CPU, cạn file descriptor, cạn inode, cổng bị chiếm, zombie dồn đống — và đọc được log Claude chạy hằng ngày.',
  lessons: [
    /* ───────────────────────── 2.1 — Phương pháp USE ───────────────────────── */
    {
      title: '2.1 — "Slow" is not a diagnosis: the USE method and the first five minutes|||2.1 — "Chậm" không phải chẩn đoán: phương pháp USE và năm phút đầu tiên',
      slug: 'os-2-1-phuong-phap',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Khung sự cố triệu chứng → đo → nguyên nhân → sửa → phòng; phương pháp USE (Utilization, Saturation, Errors) cho bốn tài nguyên; mười lệnh năm phút đầu tiên chạy thật trên một máy có hai thủ phạm cài sẵn; và những gì container nhìn thấy sai (free, load average).',
      content: `${G21}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>"The site is slow" is a symptom, not a diagnosis</h2>
<p class="lead">Someone in the team chat writes "the VPS is slow". You open a terminal. Which command do you type first, in what order do you look, and how do you know when you have actually found the cause instead of the first scary-looking number? This lesson gives you a method that does not depend on luck: four resources, three questions each, ten commands — and you run them on a box where we have hidden two culprits.</p>
${lab('latency', 'default', 'en', 'Why the order matters: a disk wait is about a hundred thousand times longer than a memory access. A process stuck on the disk uses no CPU and still holds everyone up.')}

<h3>The format every incident in this chapter uses</h3>
<p>Each incident in Chapter 2 is written the way a good postmortem is written — five rows, always in this order. Here is the first real one from this project, told in full in lesson 2.4:</p>
${suCo('en', [
  'Deploy fails with <code>no space left on device</code>; every page that touches the database returns 500, while the homepage (static) still returns 200 — so "the site looks fine".',
  '<code>df -h /</code> → <code>39G 38G 0 100%</code>. <code>docker system df</code> → images ≈ 19 GB, build cache ≈ 4.5 GB. Postgres container <code>Up (unhealthy)</code>.',
  'Old Docker images and build cache filled the disk that also holds Postgres; Postgres could not write its WAL and got stuck in recovery.',
  'Free space the safe way (<code>docker system prune -af</code>, never <code>--volumes</code>) → 100% → 71%; restart Postgres → healthy in under a minute.',
  'A weekly cleanup job that decides by <em>free space</em>, keeps only the last 3 deploy images, and an alert above 85%.',
])}
<p>The point of the format: "Measure" comes <strong>before</strong> "Cause". You write down the evidence that made you believe the cause, so the next person can check it — and so you do not "fix" something by restarting it and destroy the evidence.</p>

<h3>Four resources, three questions: the USE method</h3>
<p>Brendan Gregg's <strong>USE method</strong> says: for every resource, check <strong>U</strong>tilization (how busy is it?), <strong>S</strong>aturation (is work queuing for it?), and <strong>E</strong>rrors (is it failing?). On a Linux server there are four resources you will check every day:</p>
<table>
<tr><th>Resource</th><th>Utilization</th><th>Saturation (queue)</th><th>Errors</th></tr>
<tr><td>CPU</td><td><code>mpstat</code> %usr+%sys, <code>pidstat</code></td><td>load average vs <code>nproc</code>, <code>vmstat</code> column <code>r</code></td><td>rare; throttling in containers (<code>cpu.stat</code>)</td></tr>
<tr><td>Memory</td><td><code>free -m</code> (look at <code>available</code>)</td><td>swapping (<code>vmstat si/so</code>)</td><td>OOM kills in <code>dmesg</code>, exit 137</td></tr>
<tr><td>Disk</td><td><code>iostat -x</code> %util; <code>df -h</code> for space</td><td><code>aqu-sz</code>, <code>await</code>, <code>vmstat b</code>, <code>wa</code></td><td>I/O errors in <code>dmesg</code>, <code>No space left on device</code></td></tr>
<tr><td>Network</td><td><code>sar -n DEV</code> kB/s vs link speed</td><td><code>ss</code> Recv-Q/Send-Q</td><td><code>sar -n ETCP</code> retransmits, resets</td></tr>
</table>
<p>The method protects you from the most common mistake: staring at CPU because <code>top</code> opens on the CPU, while the real problem is a full disk or a queue on the network.</p>
${lab('sysmon', 'calm', 'en', 'A healthy 4-core box, live: read every column of top, then type uptime, vmstat, free -m or df -h and see which command shows which number.')}

<h3>The first five minutes, on a box with something wrong</h3>
<p>We started a container and, before the commands below, silently launched two programs (you will see them at the end). Pretend you do not know what they are. Here are the ten commands, in Gregg's order, with their real output.</p>
<p><strong>1. How long up, and how loaded?</strong></p>
${run('c21-triage', 'uptime')}
<p>Three numbers: the 1-, 5- and 15-minute load averages. 4.17 now, 1.25 fifteen minutes ago: load is <em>rising</em>, the trouble started recently. Load counts tasks running or waiting for a CPU plus tasks waiting on the disk; compare it with the number of CPUs (here 10). Lesson 2.2 measures this properly.</p>
<p><strong>2. Did the kernel complain?</strong></p>
${run('c21-triage', 'dmesg | tail')}
<p>Only network-bridge chatter from Docker. No "Out of memory", no I/O errors, no "segfault". That rules out a whole family of causes in one second.</p>
<p><strong>3. The one-line summary of everything: vmstat</strong></p>
${run('c21-triage', 'vmstat 1 5')}
<p>Ignore the first line (it is an average since boot). Then: <code>r</code> 3–7 tasks runnable, <code>b</code> 1–4 tasks <em>blocked on I/O</em> (state D); <code>bo</code> hundreds of thousands of KB written per second; CPU <code>us</code> ≈ 31–36%, <code>wa</code> 14–28%. Two suspects already: something busy computing, and something writing hard to disk. (The burst of <code>si/so</code> and <code>bi</code> in one row came from another workload in the same VM — this machine is shared, like a real VPS host.)</p>
<p><strong>4–5. Per CPU and per process</strong></p>
${run('c21-triage', 'mpstat 1 1')}
${run('c21-triage', 'pidstat 1 1')}
<p><code>%usr</code> 30% across 10 CPUs is three CPUs' worth. <code>pidstat</code> names it: one <code>node</code> process at <strong>300% CPU</strong>. More than 100% is not a bug: <code>%CPU</code> is counted per core, so 300% means three cores at once — a multi-threaded process.</p>
<p><strong>6–7. Who writes to the disk, and is the disk saturated?</strong></p>
${run('c21-triage', 'pidstat -d')}
${run('c21-triage', 'iostat -dxyz')}
<p><code>pidstat -d</code> names the writer: <code>dd</code>. <code>iostat -x</code> shows the device: about 600 MB/s of writes, each write waiting <code>w_await</code> ≈ 175 ms, with 27 requests queued (<code>aqu-sz</code>) — that is saturation. iostat sees the whole virtual disk (every container in the VM); pidstat sees one process. When the two disagree a lot, someone else is writing too.</p>
<p><strong>8. Memory</strong></p>
${run('c21-triage', 'free -m')}
<p>4.8 GB <code>available</code>: memory is not the problem today. (Lesson 2.3 explains why <code>free</code> is not the column to read.)</p>
<p><strong>9. Network</strong></p>
${run('c21-triage', 'sar -n DEV')}
${run('c21-triage', 'sar -n TCP,ETCP')}
<p>Zero packets, zero retransmits. Network ruled out.</p>
<p><strong>10. Confirm with top</strong></p>
${run('c21-triage', 'top -b -n 1')}
<p>Same story in one screen: <code>11.8 wa</code>, <code>node</code> at 300%, <code>dd</code> running. Note the header line <code>%Cpu(s): 31.8 us … 44.5 id</code>: averaged over 10 CPUs the machine looks half idle — the average hides that three cores are pinned.</p>

<h3>What we planted</h3>
${run('c21-triage', 'ps -o pid,stat')}
${run('c21-triage', 'grep -E')}
<p>A "monthly report" job stuck in an infinite loop on three threads (<code>Threads: 9</code> includes Node's own helpers), and a "backup" script writing 200 MB at a time with <code>O_DIRECT</code>, bypassing the page cache so every byte hits the disk:</p>
${src('ch02/bao-cao.js', 'javascript')}
${src('ch02/sao-luu.sh', 'bash')}
<p>Both were found with <strong>evidence lines</strong>: "pidstat: node 300%", "pidstat -d: dd writes; iostat: aqu-sz 27, w_await 175 ms". That is what you paste into the incident channel — not "CPU high".</p>

<h3>What a container sees — and what it does not</h3>
<p>You will often run these commands <em>inside</em> a container (<code>docker exec</code>). Some of them answer about the whole host, not about your container. Here a container started with <code>--cpus 1 --memory 512m</code>:</p>
${run('c21-nhin', 'nproc', 2)}
${run('c21-nhin', 'free -m', 2)}
${run('c21-nhin', 'cat /proc/loadavg', 2)}
<p><code>nproc</code> respects the CPU quota (1). But <code>free</code> shows the <strong>whole VM's</strong> 7.9 GB while the container may use only 512 MB (<code>memory.max</code> = 536870912); and the load average belongs to the whole machine — 2.43 although this container runs four processes, all idle. Inside a container, read the cgroup files (<code>/sys/fs/cgroup/memory.current</code>, <code>memory.max</code>, <code>cpu.stat</code>) or <code>docker stats</code> from the host. Chapter 11 opens up cgroups properly.</p>

<div class="pitfall co-tieu-de">
<p><strong>"The homepage loads, so the site is up."</strong> On 03/07/2026 this project's homepage kept returning 200 while every API route that touched the database returned 500 — the homepage is static and does not need Postgres. Check the routes that use each resource (an API route that queries the DB), not the one that is cheapest to serve. The same mistake inside a box: <code>%Cpu(s)</code> 45% idle "so CPU is fine", while one single-threaded API is pinned at 100% of its only core.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>Restarting before measuring.</strong> A restart makes the symptom go away and takes the evidence with it: the runaway process, the queue length, the open file handles, the last kernel messages. Spend two minutes on the ten commands first and paste their output into the incident note; then restart if you must.</p>
</div>

<h3>If you have done Linux &amp; Bash Chapter 12</h3>
<p>That chapter taught a troubleshooting method at the command level (dead / slow / strange). This chapter goes underneath: what each column means to the kernel, and why — so that you can tell a disk queue from a CPU queue when both show up as "slow".</p>
${L(LNX('lnx-12-1-phuong-phap'), '🐧', 'Linux &amp; Bash · 12.1 — A troubleshooting method', 'Dead, slow or strange: the command-level checklist.', 'Open')}

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a teammate writes "the VPS is slow since lunch, can you look?". You have five minutes before the meeting and must answer with evidence, not guesses.</p>
<ol>
<li>Start the lab: <code>docker run -it --rm --privileged --name os-tri os-lab</code>, save the two programs shown above as <code>bao-cao.js</code> and <code>sao-luu.sh</code> (better: ask a friend to plant them, or plant something of your own), and start them in the background with <code>node bao-cao.js &amp;</code> and <code>bash sao-luu.sh &amp;</code>.</li>
<li>Run the ten commands in order (<code>uptime</code>, <code>dmesg | tail</code>, <code>vmstat 1 5</code>, <code>mpstat 1 1</code>, <code>pidstat 1 1</code>, <code>pidstat -d 1 1</code>, <code>iostat -dxz 1 2</code>, <code>free -m</code>, <code>sar -n DEV 1 1</code>, <code>top -b -n 1</code>).</li>
<li>Fill a USE table: for CPU, memory, disk, network write one evidence line each (or "OK" with the line that shows it).</li>
<li>Write the incident in the five-row format. Kill the culprits and run <code>vmstat 1 5</code> again to show the "after".</li>
</ol>
<p><strong>Done when:</strong> your note names both culprits by PID and command, quotes one output line per culprit (e.g. <code>node 300%</code>, <code>aqu-sz 27</code>), says which resources were ruled out and how, and shows <code>wa</code> ≈ 0 and <code>us</code> back near 0 after the fix.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['USE method', 'For each resource check Utilization, Saturation and Errors — a checklist that stops you guessing.'],
  ['utilization (mức sử dụng)', 'How busy a resource is: % of time the CPU or disk was doing work.'],
  ['saturation (bão hoà)', 'Work that has to wait for a resource: the run queue, the disk queue (aqu-sz), swapping.'],
  ['load average', 'Average number of tasks running, waiting for a CPU, or waiting on the disk — over 1, 5 and 15 minutes.'],
  ['iowait (wa)', 'Time a CPU sat idle while some task waited for disk I/O. A hint of disk trouble, not a measure of the disk.'],
  ['D state', 'Uninterruptible sleep, usually waiting for the disk; shown in <code>vmstat</code> column <code>b</code>.'],
  ['triage (phân loại sự cố)', 'Quickly narrowing "slow" down to one resource and one process with evidence.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Write incidents as symptom → measure → cause → fix → prevent; evidence before conclusions.</li>
<li>USE: for CPU, memory, disk and network ask how busy, how queued, any errors.</li>
<li>The first five minutes: <code>uptime</code>, <code>dmesg | tail</code>, <code>vmstat</code>, <code>mpstat</code>, <code>pidstat</code> (+<code>-d</code>), <code>iostat -x</code>, <code>free</code>, <code>sar -n DEV/TCP</code>, <code>top</code>.</li>
<li><code>%CPU</code> above 100% means several cores; machine-wide averages hide one pinned core.</li>
<li>Inside a container, <code>free</code> and load average describe the host; read the cgroup files or <code>docker stats</code>.</li>
</ul>
${L('https://www.brendangregg.com/usemethod.html', '📘', 'Brendan Gregg — The USE Method', 'The original description, with checklists for Linux.', 'Open')}
${L('https://www.brendangregg.com/Articles/Netflix_Linux_Perf_Analysis_60s.pdf', '📄', 'Linux performance analysis in 60,000 milliseconds', 'Netflix’s first-minute checklist — the ten commands of this lesson.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>"Web chậm" là triệu chứng, không phải chẩn đoán</h2>
<p class="lead">Ai đó trong nhóm nhắn "VPS chậm quá". Bạn mở terminal. Gõ lệnh nào trước, nhìn theo thứ tự nào, và làm sao biết mình đã tìm ra nguyên nhân thật chứ không phải con số đáng sợ đầu tiên đập vào mắt? Bài này đưa bạn một phương pháp không phụ thuộc may rủi: bốn tài nguyên, mỗi cái ba câu hỏi, mười lệnh — và bạn chạy chúng trên một máy mà ta đã giấu sẵn hai thủ phạm.</p>
${lab('latency', 'default', 'vi', 'Vì sao thứ tự quan trọng: một lần chờ đĩa dài gấp khoảng một trăm nghìn lần một lần đọc RAM. Tiến trình kẹt ở đĩa không dùng CPU mà vẫn làm mọi người phải chờ.')}

<h3>Khung mà mọi sự cố trong chương này dùng</h3>
<p>Mỗi sự cố trong Chương 2 được viết như một bản báo cáo sự cố (postmortem) tử tế — năm dòng, luôn theo thứ tự này. Đây là sự cố thật đầu tiên của chính dự án, kể đầy đủ ở bài 2.4:</p>
${suCo('vi', [
  'Deploy hỏng với <code>no space left on device</code>; mọi trang đụng tới cơ sở dữ liệu trả 500, trong khi trang chủ (tĩnh) vẫn trả 200 — nên "nhìn thì web vẫn ổn".',
  '<code>df -h /</code> → <code>39G 38G 0 100%</code>. <code>docker system df</code> → ảnh ≈ 19 GB, build cache ≈ 4,5 GB. Container Postgres <code>Up (unhealthy)</code>.',
  'Ảnh Docker cũ và build cache lấp đầy chính cái đĩa chứa Postgres; Postgres không ghi được WAL và kẹt ở bước phục hồi.',
  'Giải phóng chỗ an toàn (<code>docker system prune -af</code>, KHÔNG bao giờ <code>--volumes</code>) → 100% xuống 71%; khởi động lại Postgres → khoẻ lại trong chưa đầy một phút.',
  'Job dọn hằng tuần quyết định theo <em>dung lượng còn trống</em>, chỉ giữ 3 ảnh deploy gần nhất, và cảnh báo khi vượt 85%.',
])}
<p>Ý nghĩa của khung: "Đo" đứng <strong>trước</strong> "Nguyên nhân". Bạn ghi lại bằng chứng khiến mình tin vào nguyên nhân đó, để người sau kiểm lại được — và để bạn không "sửa" bằng cách khởi động lại rồi xoá sạch bằng chứng.</p>

<h3>Bốn tài nguyên, ba câu hỏi: phương pháp USE</h3>
<p><strong>Phương pháp USE</strong> của Brendan Gregg nói: với mỗi tài nguyên, kiểm <strong>U</strong>tilization (mức sử dụng — bận tới đâu?), <strong>S</strong>aturation (bão hoà — việc có đang xếp hàng chờ nó không?) và <strong>E</strong>rrors (lỗi — nó có đang hỏng không?). Trên máy chủ Linux có bốn tài nguyên bạn sẽ kiểm hằng ngày:</p>
<table>
<tr><th>Tài nguyên</th><th>Mức sử dụng</th><th>Bão hoà (hàng đợi)</th><th>Lỗi</th></tr>
<tr><td>CPU</td><td><code>mpstat</code> %usr+%sys, <code>pidstat</code></td><td>load average so với <code>nproc</code>, cột <code>r</code> của <code>vmstat</code></td><td>hiếm; bị bóp quota trong container (<code>cpu.stat</code>)</td></tr>
<tr><td>Bộ nhớ</td><td><code>free -m</code> (nhìn cột <code>available</code>)</td><td>swap (<code>vmstat si/so</code>)</td><td>OOM kill trong <code>dmesg</code>, exit 137</td></tr>
<tr><td>Đĩa</td><td><code>iostat -x</code> %util; <code>df -h</code> cho dung lượng</td><td><code>aqu-sz</code>, <code>await</code>, cột <code>b</code> của <code>vmstat</code>, <code>wa</code></td><td>lỗi I/O trong <code>dmesg</code>, <code>No space left on device</code></td></tr>
<tr><td>Mạng</td><td><code>sar -n DEV</code> kB/s so với tốc độ đường truyền</td><td>Recv-Q/Send-Q của <code>ss</code></td><td>truyền lại, reset trong <code>sar -n ETCP</code></td></tr>
</table>
<p>Phương pháp này che cho bạn khỏi lỗi phổ biến nhất: nhìn chằm chằm vào CPU vì <code>top</code> mở ra là thấy CPU, trong khi vấn đề thật là đầy đĩa hay một hàng đợi trên mạng.</p>
${lab('sysmon', 'calm', 'vi', 'Một máy 4 lõi đang khoẻ, chạy thật: đọc từng cột của top, rồi gõ uptime, vmstat, free -m hay df -h để thấy lệnh nào cho ra con số nào.')}

<h3>Năm phút đầu tiên, trên một máy đang có chuyện</h3>
<p>Ta mở một container và, trước các lệnh dưới đây, lặng lẽ chạy hai chương trình (cuối mục sẽ lộ ra). Hãy giả vờ bạn không biết chúng là gì. Đây là mười lệnh, theo thứ tự của Gregg, kèm output thật.</p>
<p><strong>1. Máy chạy bao lâu rồi, tải bao nhiêu?</strong></p>
${run('c21-triage', 'uptime')}
<p>Ba con số: tải trung bình (load average) 1, 5 và 15 phút. Bây giờ 4,17, mười lăm phút trước 1,25: tải đang <em>tăng</em>, sự cố mới bắt đầu gần đây. Load đếm các tác vụ đang chạy hoặc đang chờ CPU cộng các tác vụ đang chờ đĩa; hãy so nó với số CPU (ở đây là 10). Bài 2.2 sẽ đo kỹ chuyện này.</p>
<p><strong>2. Nhân có kêu gì không?</strong></p>
${run('c21-triage', 'dmesg | tail')}
<p>Chỉ có tiếng lách cách của cầu mạng Docker. Không "Out of memory", không lỗi I/O, không "segfault". Loại được cả một họ nguyên nhân trong một giây.</p>
<p><strong>3. Một dòng tóm tắt mọi thứ: vmstat</strong></p>
${run('c21-triage', 'vmstat 1 5')}
<p>Bỏ qua dòng đầu (nó là trung bình từ lúc khởi động). Rồi đọc: <code>r</code> 3–7 tác vụ sẵn sàng chạy, <code>b</code> 1–4 tác vụ <em>bị chặn chờ I/O</em> (trạng thái D); <code>bo</code> hàng trăm nghìn KB ghi ra mỗi giây; CPU <code>us</code> ≈ 31–36%, <code>wa</code> 14–28%. Đã có hai nghi phạm: một thứ đang tính toán hăng say, và một thứ đang ghi đĩa dữ dội. (Đợt <code>si/so</code> và <code>bi</code> ở một dòng là của một việc khác chạy cùng máy ảo — máy này là máy dùng chung, y như máy chủ vật lý chứa các VPS.)</p>
<p><strong>4–5. Theo từng CPU và từng tiến trình</strong></p>
${run('c21-triage', 'mpstat 1 1')}
${run('c21-triage', 'pidstat 1 1')}
<p><code>%usr</code> 30% trên 10 CPU tức là cỡ ba CPU. <code>pidstat</code> gọi tên luôn: một tiến trình <code>node</code> ở <strong>300% CPU</strong>. Trên 100% không phải lỗi: <code>%CPU</code> tính theo từng lõi, nên 300% nghĩa là ba lõi cùng lúc — một tiến trình nhiều luồng.</p>
<p><strong>6–7. Ai đang ghi đĩa, và đĩa có bão hoà không?</strong></p>
${run('c21-triage', 'pidstat -d')}
${run('c21-triage', 'iostat -dxyz')}
<p><code>pidstat -d</code> chỉ mặt kẻ ghi: <code>dd</code>. <code>iostat -x</code> cho thấy thiết bị: khoảng 600 MB/s ghi, mỗi lần ghi chờ <code>w_await</code> ≈ 175 ms, với 27 yêu cầu đang xếp hàng (<code>aqu-sz</code>) — đó là bão hoà. iostat nhìn cả ổ đĩa ảo (mọi container trong máy ảo); pidstat nhìn một tiến trình. Khi hai bên lệch nhau nhiều, nghĩa là còn ai đó khác cũng đang ghi.</p>
<p><strong>8. Bộ nhớ</strong></p>
${run('c21-triage', 'free -m')}
<p>4,8 GB <code>available</code>: hôm nay bộ nhớ không phải vấn đề. (Bài 2.3 giải thích vì sao <code>free</code> không phải cột nên đọc.)</p>
<p><strong>9. Mạng</strong></p>
${run('c21-triage', 'sar -n DEV')}
${run('c21-triage', 'sar -n TCP,ETCP')}
<p>Không gói tin nào, không lần truyền lại nào. Loại mạng.</p>
<p><strong>10. Xác nhận bằng top</strong></p>
${run('c21-triage', 'top -b -n 1')}
<p>Cùng câu chuyện trên một màn hình: <code>11.8 wa</code>, <code>node</code> 300%, <code>dd</code> đang chạy. Để ý dòng đầu <code>%Cpu(s): 31.8 us … 44.5 id</code>: lấy trung bình trên 10 CPU thì máy trông như rảnh một nửa — con số trung bình giấu đi chuyện ba lõi đang bị ghim chặt.</p>

<h3>Ta đã cài gì</h3>
${run('c21-triage', 'ps -o pid,stat')}
${run('c21-triage', 'grep -E')}
<p>Một job "báo cáo cuối tháng" kẹt vòng lặp vô hạn trên ba luồng (<code>Threads: 9</code> tính cả các luồng phụ của chính Node), và một script "sao lưu" ghi mỗi lần 200 MB bằng <code>O_DIRECT</code>, bỏ qua page cache nên từng byte đều đập xuống đĩa:</p>
${src('ch02/bao-cao.js', 'javascript')}
${src('ch02/sao-luu.sh', 'bash')}
<p>Cả hai được tìm ra bằng <strong>dòng bằng chứng</strong>: "pidstat: node 300%", "pidstat -d: dd đang ghi; iostat: aqu-sz 27, w_await 175 ms". Đó là thứ bạn dán vào kênh sự cố — chứ không phải "CPU cao".</p>

<h3>Container nhìn thấy gì — và không thấy gì</h3>
<p>Bạn sẽ thường chạy các lệnh này <em>bên trong</em> container (<code>docker exec</code>). Vài lệnh trả lời về cả máy chủ chứ không về container của bạn. Đây là một container mở với <code>--cpus 1 --memory 512m</code>:</p>
${run('c21-nhin', 'nproc', 2)}
${run('c21-nhin', 'free -m', 2)}
${run('c21-nhin', 'cat /proc/loadavg', 2)}
<p><code>nproc</code> tôn trọng quota CPU (1). Nhưng <code>free</code> báo 7,9 GB của <strong>cả máy ảo</strong> trong khi container chỉ được dùng 512 MB (<code>memory.max</code> = 536870912); và load average là của cả máy — 2,43 dù container này chỉ có bốn tiến trình, đều đang rảnh. Trong container, hãy đọc các file cgroup (<code>/sys/fs/cgroup/memory.current</code>, <code>memory.max</code>, <code>cpu.stat</code>) hoặc <code>docker stats</code> từ máy chủ. Chương 11 sẽ mổ cgroup cho kỹ.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Trang chủ vẫn lên, vậy là web vẫn sống."</strong> Ngày 03/07/2026 trang chủ của dự án này vẫn trả 200 trong khi mọi route API đụng tới cơ sở dữ liệu đều trả 500 — trang chủ là trang tĩnh, không cần Postgres. Hãy kiểm những route dùng tới từng tài nguyên (một route API có truy vấn DB), đừng kiểm cái rẻ nhất để phục vụ. Cùng lỗi đó bên trong máy: <code>%Cpu(s)</code> rảnh 45% "vậy CPU ổn", trong khi một API đơn luồng đang bị ghim 100% ở đúng một lõi duy nhất của nó.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>Khởi động lại trước khi đo.</strong> Khởi động lại làm triệu chứng biến mất và mang luôn bằng chứng đi: tiến trình chạy loạn, độ dài hàng đợi, các file đang mở, những dòng log cuối của nhân. Bỏ hai phút cho mười lệnh trước, dán output vào ghi chú sự cố; rồi hãy khởi động lại nếu buộc phải.</p>
</div>

<h3>Nếu bạn đã học Linux &amp; Bash Chương 12</h3>
<p>Chương đó dạy phương pháp gỡ lỗi ở mức lệnh (chết / chậm / lạ). Chương này đi xuống bên dưới: mỗi cột có nghĩa gì với nhân, và vì sao — để bạn phân biệt được hàng đợi đĩa với hàng đợi CPU khi cả hai cùng hiện ra là "chậm".</p>
${L(LNX('lnx-12-1-phuong-phap'), '🐧', 'Linux &amp; Bash · 12.1 — Phương pháp gỡ lỗi', 'Chết, chậm hay lạ: danh sách kiểm ở mức lệnh.', 'Mở')}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một bạn trong nhóm nhắn "VPS chậm từ trưa tới giờ, xem giúp với". Bạn có năm phút trước cuộc họp và phải trả lời bằng bằng chứng, không đoán.</p>
<ol>
<li>Mở lab: <code>docker run -it --rm --privileged --name os-tri os-lab</code>, lưu hai chương trình ở trên thành <code>bao-cao.js</code> và <code>sao-luu.sh</code> (hay hơn: nhờ một bạn cài giùm, hoặc tự cài một thủ phạm của riêng bạn), rồi chạy ở nền bằng <code>node bao-cao.js &amp;</code> và <code>bash sao-luu.sh &amp;</code>.</li>
<li>Chạy mười lệnh theo thứ tự (<code>uptime</code>, <code>dmesg | tail</code>, <code>vmstat 1 5</code>, <code>mpstat 1 1</code>, <code>pidstat 1 1</code>, <code>pidstat -d 1 1</code>, <code>iostat -dxz 1 2</code>, <code>free -m</code>, <code>sar -n DEV 1 1</code>, <code>top -b -n 1</code>).</li>
<li>Điền bảng USE: với CPU, bộ nhớ, đĩa, mạng, mỗi thứ viết một dòng bằng chứng (hoặc "OK" kèm dòng cho thấy điều đó).</li>
<li>Viết sự cố theo khung năm dòng. Diệt hai thủ phạm rồi chạy lại <code>vmstat 1 5</code> để có ảnh "sau khi sửa".</li>
</ol>
<p><strong>Đạt khi:</strong> ghi chú của bạn gọi tên cả hai thủ phạm bằng PID và lệnh, trích một dòng output cho mỗi thủ phạm (vd <code>node 300%</code>, <code>aqu-sz 27</code>), nói rõ tài nguyên nào đã loại trừ và bằng cách nào, và cho thấy <code>wa</code> ≈ 0, <code>us</code> về gần 0 sau khi sửa.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['USE method (phương pháp USE)', 'Với mỗi tài nguyên kiểm Mức sử dụng, Bão hoà và Lỗi — một danh sách kiểm giúp bạn khỏi đoán mò.'],
  ['utilization (mức sử dụng)', 'Tài nguyên bận tới đâu: % thời gian CPU hay đĩa đang làm việc.'],
  ['saturation (bão hoà)', 'Việc phải chờ một tài nguyên: hàng đợi chạy, hàng đợi đĩa (aqu-sz), swap.'],
  ['load average (tải trung bình)', 'Số tác vụ trung bình đang chạy, chờ CPU, hoặc chờ đĩa — trong 1, 5 và 15 phút.'],
  ['iowait (wa)', 'Thời gian một CPU ngồi rảnh trong khi có tác vụ chờ I/O đĩa. Là gợi ý có chuyện ở đĩa, không phải số đo của đĩa.'],
  ['D state (trạng thái D)', 'Ngủ không ngắt được, thường là đang chờ đĩa; hiện ở cột <code>b</code> của <code>vmstat</code>.'],
  ['triage (phân loại sự cố)', 'Thu hẹp nhanh "chậm" về một tài nguyên và một tiến trình, có bằng chứng.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Viết sự cố theo triệu chứng → đo → nguyên nhân → sửa → phòng; bằng chứng trước kết luận.</li>
<li>USE: với CPU, bộ nhớ, đĩa và mạng hỏi bận tới đâu, có xếp hàng không, có lỗi không.</li>
<li>Năm phút đầu tiên: <code>uptime</code>, <code>dmesg | tail</code>, <code>vmstat</code>, <code>mpstat</code>, <code>pidstat</code> (+<code>-d</code>), <code>iostat -x</code>, <code>free</code>, <code>sar -n DEV/TCP</code>, <code>top</code>.</li>
<li><code>%CPU</code> trên 100% nghĩa là nhiều lõi; số trung bình cả máy giấu đi một lõi đang bị ghim.</li>
<li>Trong container, <code>free</code> và load average nói về máy chủ; hãy đọc file cgroup hoặc <code>docker stats</code>.</li>
</ul>
${L('https://www.brendangregg.com/usemethod.html', '📘', 'Brendan Gregg — Phương pháp USE', 'Bản mô tả gốc, kèm danh sách kiểm cho Linux.', 'Mở')}
${L('https://www.brendangregg.com/Articles/Netflix_Linux_Perf_Analysis_60s.pdf', '📄', 'Phân tích hiệu năng Linux trong 60.000 mili giây', 'Danh sách kiểm phút đầu tiên của Netflix — mười lệnh của bài này.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 2.2 — CPU ───────────────────────── */
    {
      title: '2.2 — Who eats the CPU: top, ps, pidstat and the load average|||2.2 — Ai ăn CPU: top, ps, pidstat và tải trung bình',
      slug: 'os-2-2-cpu',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Đọc từng dòng, từng cột của top; us/sy/ni/wa/st đo thật; load average là hàng đợi chứ không phải phần trăm (6 việc trên 2 lõi); cột STAT của ps; sự cố một regex kiểm email ghim 100% CPU làm sập API (tìm ra bằng perf) và zombie dồn đống tới mức container không fork nổi.',
      content: `${G22}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Who eats the CPU — and how to read what top is telling you</h2>
<p class="lead"><code>top</code> is the first screen everyone opens and the one almost nobody reads correctly. Is a load average of 4 bad? Why does a process show 300% CPU? Why can a machine be "70% idle" while your API does not answer at all? This lesson reads every line and column with numbers we produced on purpose, then walks through two CPU incidents: a runaway regular expression and a pile of zombies.</p>
${lab('scheduler', 'multicore', 'en', 'Several runnable tasks sharing a few cores: each core runs one at a time, the rest wait in the run queue — the waiting is what the load average counts.')}

<h3>The five header lines of top</h3>
<p>We started three CPU-bound programs of different kinds and took one snapshot (<code>-b</code> = batch mode, so it prints instead of drawing a screen):</p>
${run('c22-cot', 'sleep 2; top')}
<table>
<tr><th>Line</th><th>What it says</th></tr>
<tr><td><code>top - 17:50:42 up 7:50, … load average: 1.05, 1.28, 0.82</code></td><td>Clock, uptime, and the 1/5/15-minute load average (same as <code>uptime</code>).</td></tr>
<tr><td><code>Tasks: 7 total, 4 running, 3 sleeping, 0 stopped, 0 zombie</code></td><td>Process counts by state. A growing <code>zombie</code> count is an incident (below).</td></tr>
<tr><td><code>%Cpu(s): 14.4 us, 6.3 sy, 9.9 ni, 69.4 id, 0.0 wa, 0.0 hi, 0.0 si, 0.0 st</code></td><td>Where CPU time went, averaged over <strong>all</strong> CPUs. Read below.</td></tr>
<tr><td><code>MiB Mem</code> / <code>MiB Swap</code></td><td>Memory — lesson 2.3. Look at <code>avail Mem</code>, not <code>free</code>.</td></tr>
<tr><td>columns</td><td><code>PR NI</code> priority and nice · <code>VIRT RES SHR</code> virtual, resident, shared memory (KiB) · <code>S</code> state · <code>%CPU</code> per core · <code>TIME+</code> CPU time used.</td></tr>
</table>
<p>One honest oddity: <code>dd</code> and <code>node</code> show <code>110.0</code> although each is single-threaded. A batch <code>top</code> snapshot measures over a very short interval, so single samples jitter by ±10%; read a few samples (<code>top -b -n 3 -d 1</code>) or use <code>pidstat</code> for steady numbers.</p>

<h3>us, sy, ni, wa, st — each measured</h3>
<p>The three programs: <code>dd bs=1</code> copies one byte per system call, so it spends its life in the kernel; <code>nice -n 19 node</code> spins at the lowest priority; a plain <code>node</code> spins at normal priority. Per CPU:</p>
${run('c22-cot', 'mpstat -P ALL')}
<ul>
<li><strong>us</strong> (user): your code running. CPU 0 is the plain <code>node</code> loop: 98% usr.</li>
<li><strong>sy</strong> (system): the kernel working <em>for</em> a process — system calls, page faults. CPU 6 is <code>dd</code>: 68% sys, because every byte costs a <code>read</code> and a <code>write</code> syscall (Chapter 1.3).</li>
<li><strong>ni</strong> (nice): user code of processes with a positive nice value. CPU 7 is the niced <code>node</code>: 100% nice. In <code>top</code> it shows <code>NI 19</code>, <code>PR 39</code>.</li>
<li><strong>wa</strong> (iowait): idle CPUs while some task waits for the disk — you saw 12–28% in lesson 2.1.</li>
<li><strong>hi/si</strong>: hardware and software interrupts (network packets, timers). <strong>st</strong> (steal): time the hypervisor gave your virtual CPU to <em>another</em> VM. Zero here; on a cheap VPS a steady <code>st</code> of 10–20% means you are paying for CPU you are not getting.</li>
</ul>
<p>The machine-wide line says <code>14.4 us</code>: three busy programs on ten CPUs are "only" 30% of the machine. <code>vmstat</code> shows the same split in its last columns, with <code>r</code> = runnable tasks:</p>
${run('c22-cot', 'vmstat 1 3')}

<h3>Load average is a queue, not a percentage</h3>
<p>To see what load means, we pinned a container to <strong>two</strong> cores (<code>--cpuset-cpus 0,1</code>) and started <strong>six</strong> busy loops, then waited 65 seconds:</p>
${run('c22-load', 'nproc')}
${run('c22-load', 'uptime', 2)}
${run('c22-load', 'mpstat -P 0,1')}
${run('c22-load', 'top -b -n 1')}
${run('c22-load', 'ps -o pid,psr')}
<p>Read it together. Both cores are at 100%. Six processes share them, so each gets about a third of a core — no process shows 100%, yet the box is saturated three times over: four tasks are always <em>waiting</em>. The machine-wide <code>%Cpu(s)</code> says 80% idle because eight other cores of the VM are free — but these six cannot use them. The load average counts the waiting: it climbed to 4.37 after one minute and keeps rising toward ~6 plus whatever else the VM runs (the 1-minute figure is an exponentially damped average, so after one minute it has covered only about 63% of a jump). In <code>/proc/loadavg</code>, <code>7/726</code> means 7 tasks runnable right now out of 726 tasks (threads) on the whole machine.</p>
<p>The rule: <strong>compare load with the number of CPUs it can use</strong>. Load 4 on 10 free cores is fine; load 4 on 2 cores is a queue of two. And on Linux, load also counts tasks stuck in <code>D</code> state (waiting for disk) — so a high load with idle CPUs points at the disk, not the CPU.</p>
${lab('sysmon', 'cpuhog', 'en', 'Inject a CPU hog on the 4-core box and watch it happen: one core pinned, %Cpu(s) barely moves, load climbs minute by minute. Find the PID, then kill or renice it.')}

<h3>ps: STAT and sorting</h3>
<p><code>ps</code> is a snapshot you can filter and sort, which makes it better than <code>top</code> for scripts and incident notes. We created one process in each state:</p>
${run('c22-cot', 'sleep 1; ps -eo')}
<table>
<tr><th>STAT</th><th>Meaning</th><th>Here</th></tr>
<tr><td><code>R</code></td><td>running or runnable (on a CPU or in the run queue)</td><td><code>ps</code> itself</td></tr>
<tr><td><code>S</code></td><td>sleeping, waiting for an event (timer, socket, child)</td><td><code>sleep 300</code>, <code>python3</code></td></tr>
<tr><td><code>D</code></td><td>uninterruptible sleep — usually disk I/O; even <code>kill -9</code> waits</td><td>the <code>dd</code> in lesson 2.1</td></tr>
<tr><td><code>T</code></td><td>stopped (<code>SIGSTOP</code>, Ctrl-Z, a debugger)</td><td><code>sleep 301</code> after <code>kill -STOP</code></td></tr>
<tr><td><code>Z</code></td><td>zombie: exited, parent has not called <code>wait()</code></td><td>the forked <code>python3</code> child, RSS 0</td></tr>
<tr><td>suffixes</td><td><code>s</code> session leader · <code>l</code> multi-threaded · <code>N</code> low priority (nice &gt; 0) · <code>&lt;</code> high priority · <code>+</code> foreground</td><td><code>RNl</code> = niced multi-threaded node</td></tr>
</table>
${run('c22-cot', 'ps -eo pid,comm,%cpu,%mem,rss --sort')}
<p><code>--sort=-rss</code> (or <code>-%cpu</code>) puts the biggest first; the minus means descending.</p>

<h3>Incident: one regular expression freezes the whole API</h3>
${suCo('en', [
  '<code>/health</code> stops answering; every request times out. Nothing in the logs.',
  '<code>top</code>/<code>ps</code>: one <code>node</code> at 90–100% CPU, without a break. <code>pidstat</code>: 100% <code>%usr</code>, 0% <code>%system</code>. <code>perf</code>: 100% of samples inside one <code>RegExp</code>.',
  'An e-mail check with a nested quantifier backtracks exponentially on a long input; Node runs your JavaScript on <strong>one</strong> thread, so the whole server is stuck inside that one call.',
  'Kill/restart the process to recover; rewrite the regex without nested quantifiers (or use a parser/RE2); reject long input before matching.',
  'Lint for unsafe regexes, cap input length at the edge, run untrusted pattern matching off the main thread with a timeout, and monitor a real endpoint.',
])}
${src('ch02/api.js', 'javascript')}
${run('c22-cpu', "curl -s 'localhost:3000/check?email=cuong")}
${run('c22-cpu', 'for n in 40 45 50')}
<p>A normal address takes 1 ms. A crafted one with 40, 45, 50 letters takes 26 ms, 173 ms, 1 174 ms — about ×6.7 for every five extra letters. 64 letters means minutes. Send one and check the API from another client:</p>
${run('c22-cpu', '(curl -s', 2)}
<p><code>exit=28</code> is curl's "operation timed out". The process is alive, it just never comes back to the event loop. Measure:</p>
${run('c22-cpu', 'top -b -n 1')}
${run('c22-cpu', 'pidstat -u')}
${run('c22-cpu', 'grep ctxt')}
<p>100% <code>%usr</code> and 0% <code>%system</code>: pure computation in user space — your code, not the kernel and not the disk. The context-switch counters confirm it: <code>voluntary</code> stays at 10 (it never sleeps, never waits for I/O) while <code>nonvoluntary</code> grows (67 → 81) only because the scheduler takes the CPU away now and then. And the machine-wide <code>%Cpu(s)</code> says <code>10.4 us</code> — "CPU 90% idle" — while the API is dead. Which code? <code>perf</code> samples the stack 499 times a second (Node needs <code>--perf-basic-prof</code> so perf can name JIT-compiled functions):</p>
${run('c22-cpu', 'perf record')}
${run('c22-cpu', 'kill -9')}

<h3>Incident: zombies pile up until nothing can start</h3>
${suCo('en', [
  'A screenshot/PDF service in Docker (Chromium-style: the browser spawns helpers in the background) slowly stops working: helpers fail to start, then even <code>docker exec</code> into the container fails.',
  '<code>ps</code>: dozens of <code>Z</code> processes whose parent is PID 1; <code>top</code>: <code>31 zombie</code>; <code>pids.current</code> = <code>pids.max</code>; logs: <code>Cannot fork</code>; <code>docker exec</code>: <code>Resource temporarily unavailable</code>.',
  'The orphaned helpers are re-parented to PID 1 — which is <code>node</code>, and Node only <code>wait()</code>s for children it started itself. Nobody reaps them; each zombie keeps a PID until the container’s budget is gone.',
  'Restart the container with <code>--init</code> (tini as PID 1 reaps every orphan); <code>kill -9</code> on a zombie does nothing.',
  '<code>init: true</code> in compose (or <code>--init</code>) for every container whose program spawns children; a <code>pids</code> limit so a leak hurts one container, not the host; alert on the zombie count.',
])}
${src('ch02/chup-anh.js', 'javascript')}
${run('c22-zombie', 'docker exec os-c22z ps', 3)}
${run('c22-zombie', "docker exec os-c22z sh -c 'Z=")}
<p>26 zombies after 1.5 seconds. And no, you cannot kill a zombie: it is already dead — <code>kill -9</code> returns and the <code>Z</code> line is still there. It is only an entry in the process table holding its exit status for a parent that will never ask. Eight seconds later the container's PID budget (60) is gone:</p>
${run('c22-zombie', 'sleep 8', 2)}
<p>The helpers cannot fork, and even Docker cannot start a process inside the container to let you look. Same program, one flag:</p>
${run('c22-zombie', 'docker run -d --name os-c22z-init', 4)}
<p>PID 1 is now <code>docker-init</code> (tini); it reaps every orphan, so after the same six seconds there are 0 zombies and 14 PIDs in use, and the service did 114 jobs instead of dying. This is lesson 1.5 (PID 1 in containers) turning into an outage.</p>
${L(OS('os-1-5-pid1'), '🧠', 'Lesson 1.5 — PID 1 in containers', 'Why PID 1 must reap orphans and forward signals, and what tini does.', 'Open')}
${lab('process', 'zombie', 'en', 'A child exits, the parent never calls wait(): the child stays as Z holding its PID. Step through it, then let the parent die and watch init reap it.')}
${lab('sysmon', 'zombies', 'en', 'The same incident on a live box: Tasks … zombie keeps growing, kill -9 on a Z does nothing, killing the parent clears them all.')}

<div class="pitfall co-tieu-de">
<p><strong>"CPU is only 10%, so it cannot be the CPU."</strong> Machine-wide <code>%Cpu(s)</code> is an average over every core. A single-threaded server (Node, Python, Redis) can be pinned at 100% of its one core while the average says 90% idle. Always look per process (<code>pidstat</code>, <code>top</code> sorted by <code>%CPU</code>) and per core (<code>mpstat -P ALL</code>).</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>Reading load without counting cores.</strong> Load 4.37 is a disaster on the 2-core container above and nothing on 10 idle cores. Always pair it with <code>nproc</code> — and remember that inside a container the load average is the <em>host's</em>.</p>
</div>

<h3>If you have done Linux &amp; Bash 5.2</h3>
<p>There you learned to drive <code>top</code> and <code>ps</code>. Here every column was produced by a program we wrote on purpose — so you know what makes <code>sy</code> rise (syscalls), what makes <code>ni</code> non-zero (nice), and why load is a queue.</p>
${L(LNX('lnx-5-2-top-tai-bo-nho'), '🐧', 'Linux &amp; Bash · 5.2 — top, load and memory', 'Driving top and ps at the command level.', 'Open')}

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> after a deploy, the team's Node API freezes for minutes at random; nothing is logged, and a restart "fixes" it until the next time.</p>
<ol>
<li>Run <code>api.js</code> (above) in the lab with <code>node --perf-basic-prof api.js &amp;</code>. Time <code>/check</code> with 40, 45 and 50 letters and plot how fast it grows.</li>
<li>Send a 64-letter request in the background. Prove the freeze with <code>curl -m 2 …/health; echo $?</code> and identify the process with <code>ps -eo pid,stat,%cpu,comm --sort=-%cpu</code>.</li>
<li>Show that the time is user time (<code>pidstat -u -p PID 1 3</code>) and that <code>nonvoluntary_ctxt_switches</code> grows while <code>voluntary</code> does not. Name the guilty function with <code>perf record -g -p PID</code> + <code>perf report</code> (container needs <code>--cap-add PERFMON --security-opt seccomp=unconfined</code>).</li>
<li>Fix: rewrite <code>EMAIL</code> without a nested quantifier (e.g. <code>/^[^@ ]+@[^@ ]+$/</code> then a length check), and add a guard that rejects inputs longer than 254 characters before matching. Re-run step 2.</li>
</ol>
<p><strong>Done when:</strong> you have the four evidence lines (timeout exit 28, 100% %usr, growing involuntary switches, perf showing the RegExp) and, after the fix, the 64-letter request returns in a few milliseconds while <code>/health</code> keeps answering.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['%CPU', 'CPU used by one process, per core: 300% = three cores busy at once.'],
  ['us / sy / ni', 'User code / kernel work on behalf of processes / user code of niced processes.'],
  ['wa / st', 'CPUs idle while tasks wait for disk / time the hypervisor gave your vCPU to another VM.'],
  ['load average (tải trung bình)', 'Damped average of tasks running, runnable or in D state, over 1/5/15 min — compare with core count.'],
  ['STAT', 'Process state in ps: R, S, D, T, Z plus suffixes s, l, N, &lt;, +.'],
  ['ReDoS', 'Regular-expression denial of service: an input that makes a backtracking regex run for exponential time.'],
  ['zombie (Z)', 'A finished process whose parent has not called wait(); costs only a PID slot — but those run out.'],
  ['involuntary context switch', 'The scheduler took the CPU away (time slice over); a pure CPU loop has only these.'],
])}

<h3>📌 Summary</h3>
<ul>
<li><code>top</code>: load, task states, CPU split, memory, then per-process columns; <code>%CPU</code> is per core.</li>
<li><code>us</code> = your code, <code>sy</code> = syscalls, <code>ni</code> = niced code, <code>wa</code> = waiting for disk, <code>st</code> = stolen by the hypervisor.</li>
<li>Load is a queue: 6 busy tasks on 2 cores ⇒ load → 6, each gets a third of a core. Compare with the cores the work can use.</li>
<li>A runaway CPU loop: 100% <code>%usr</code>, only involuntary switches, <code>perf</code> names the function. One-threaded servers die from one bad request.</li>
<li>Zombies cannot be killed; fix the parent or put an init (<code>--init</code>) at PID 1 — or the PID budget runs out and nothing can start.</li>
</ul>
${L('https://man7.org/linux/man-pages/man1/top.1.html', '📄', 'man 1 top', 'Every field of the summary area and task columns.', 'Open')}
${L('https://www.brendangregg.com/blog/2017-08-08/linux-load-averages.html', '📘', 'Brendan Gregg — Linux load averages: solving the mystery', 'Why Linux load includes D state, with the kernel history.', 'Open')}
${L('https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS', '🛡️', 'OWASP — Regular expression Denial of Service', 'How evil regexes work and how to avoid them.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Ai ăn CPU — và cách đọc những gì top đang nói</h2>
<p class="lead"><code>top</code> là màn hình ai cũng mở đầu tiên và gần như không ai đọc đúng. Load average 4 có tệ không? Vì sao một tiến trình hiện 300% CPU? Vì sao máy "rảnh 70%" mà API của bạn không trả lời nổi? Bài này đọc từng dòng, từng cột bằng những con số ta cố ý tạo ra, rồi đi qua hai sự cố CPU: một biểu thức chính quy chạy loạn và một đống zombie.</p>
${lab('scheduler', 'multicore', 'vi', 'Nhiều tác vụ sẵn sàng chạy dùng chung vài lõi: mỗi lõi chạy một việc một lúc, số còn lại chờ trong hàng đợi chạy — phần chờ đó chính là thứ load average đếm.')}

<h3>Năm dòng đầu của top</h3>
<p>Ta chạy ba chương trình nặng CPU thuộc ba kiểu khác nhau rồi chụp một lần (<code>-b</code> = chế độ batch, in ra thay vì vẽ màn hình):</p>
${run('c22-cot', 'sleep 2; top')}
<table>
<tr><th>Dòng</th><th>Nó nói gì</th></tr>
<tr><td><code>top - 17:50:42 up 7:50, … load average: 1.05, 1.28, 0.82</code></td><td>Đồng hồ, thời gian máy chạy, và load average 1/5/15 phút (giống <code>uptime</code>).</td></tr>
<tr><td><code>Tasks: 7 total, 4 running, 3 sleeping, 0 stopped, 0 zombie</code></td><td>Số tiến trình theo trạng thái. Số <code>zombie</code> tăng dần là một sự cố (ở dưới).</td></tr>
<tr><td><code>%Cpu(s): 14.4 us, 6.3 sy, 9.9 ni, 69.4 id, 0.0 wa, 0.0 hi, 0.0 si, 0.0 st</code></td><td>Thời gian CPU đi đâu, trung bình trên <strong>tất cả</strong> CPU. Đọc ở dưới.</td></tr>
<tr><td><code>MiB Mem</code> / <code>MiB Swap</code></td><td>Bộ nhớ — bài 2.3. Nhìn <code>avail Mem</code>, đừng nhìn <code>free</code>.</td></tr>
<tr><td>các cột</td><td><code>PR NI</code> độ ưu tiên và nice · <code>VIRT RES SHR</code> bộ nhớ ảo, thường trú, dùng chung (KiB) · <code>S</code> trạng thái · <code>%CPU</code> tính theo lõi · <code>TIME+</code> thời gian CPU đã dùng.</td></tr>
</table>
<p>Một chỗ lạ cần nói thật: <code>dd</code> và <code>node</code> hiện <code>110.0</code> dù mỗi cái chỉ có một luồng. Một lần chụp <code>top</code> ở chế độ batch đo trong một khoảng rất ngắn, nên từng mẫu lẻ dao động ±10%; hãy đọc vài mẫu (<code>top -b -n 3 -d 1</code>) hoặc dùng <code>pidstat</code> để có số ổn định.</p>

<h3>us, sy, ni, wa, st — đo từng cái</h3>
<p>Ba chương trình: <code>dd bs=1</code> chép một byte cho mỗi lời gọi hệ thống, nên nó sống cả đời trong nhân; <code>nice -n 19 node</code> quay vòng ở độ ưu tiên thấp nhất; một <code>node</code> thường quay vòng ở độ ưu tiên bình thường. Theo từng CPU:</p>
${run('c22-cot', 'mpstat -P ALL')}
<ul>
<li><strong>us</strong> (user): mã của bạn đang chạy. CPU 0 là vòng lặp <code>node</code> thường: 98% usr.</li>
<li><strong>sy</strong> (system): nhân làm việc <em>hộ</em> một tiến trình — lời gọi hệ thống, lỗi trang. CPU 6 là <code>dd</code>: 68% sys, vì mỗi byte tốn một syscall <code>read</code> và một <code>write</code> (Chương 1.3).</li>
<li><strong>ni</strong> (nice): mã người dùng của các tiến trình có nice dương. CPU 7 là <code>node</code> đã nice: 100% nice. Trong <code>top</code> nó hiện <code>NI 19</code>, <code>PR 39</code>.</li>
<li><strong>wa</strong> (iowait): CPU rảnh trong khi có tác vụ chờ đĩa — bạn đã thấy 12–28% ở bài 2.1.</li>
<li><strong>hi/si</strong>: ngắt phần cứng và ngắt mềm (gói tin mạng, bộ hẹn giờ). <strong>st</strong> (steal — bị lấy cắp): thời gian hypervisor đem CPU ảo của bạn cho một máy ảo <em>khác</em>. Ở đây bằng 0; trên một VPS giá rẻ, <code>st</code> đều đều 10–20% nghĩa là bạn đang trả tiền cho phần CPU mình không nhận được.</li>
</ul>
<p>Dòng cả máy nói <code>14.4 us</code>: ba chương trình bận rộn trên mười CPU "chỉ" là 30% của máy. <code>vmstat</code> cho cùng cách chia ở các cột cuối, với <code>r</code> = số tác vụ sẵn sàng chạy:</p>
${run('c22-cot', 'vmstat 1 3')}

<h3>Load average là một hàng đợi, không phải phần trăm</h3>
<p>Để thấy load nghĩa là gì, ta ghim một container vào <strong>hai</strong> lõi (<code>--cpuset-cpus 0,1</code>) và chạy <strong>sáu</strong> vòng lặp bận, rồi chờ 65 giây:</p>
${run('c22-load', 'nproc')}
${run('c22-load', 'uptime', 2)}
${run('c22-load', 'mpstat -P 0,1')}
${run('c22-load', 'top -b -n 1')}
${run('c22-load', 'ps -o pid,psr')}
<p>Đọc chung với nhau. Cả hai lõi đều 100%. Sáu tiến trình chia nhau, nên mỗi cái được chừng một phần ba lõi — không tiến trình nào hiện 100%, vậy mà máy đã bão hoà gấp ba: luôn có bốn tác vụ đang <em>chờ</em>. Dòng <code>%Cpu(s)</code> của cả máy báo rảnh 80% vì tám lõi khác của máy ảo đang trống — nhưng sáu tiến trình này không được dùng chúng. Load average đếm phần đang chờ: nó leo lên 4,37 sau một phút và tiếp tục tăng dần về khoảng 6 cộng với mọi thứ khác máy ảo đang chạy (con số 1 phút là trung bình giảm dần theo hàm mũ, nên sau một phút nó mới đi được chừng 63% của một cú nhảy). Trong <code>/proc/loadavg</code>, <code>7/726</code> nghĩa là 7 tác vụ đang sẵn sàng chạy ngay lúc này trên tổng 726 tác vụ (luồng) của cả máy.</p>
<p>Quy tắc: <strong>so load với số CPU mà công việc được phép dùng</strong>. Load 4 trên 10 lõi rảnh là ổn; load 4 trên 2 lõi là một hàng đợi hai việc. Và trên Linux, load còn đếm cả tác vụ kẹt ở trạng thái <code>D</code> (chờ đĩa) — nên load cao mà CPU rảnh là đang chỉ vào đĩa, không phải CPU.</p>
${lab('sysmon', 'cpuhog', 'vi', 'Bơm một kẻ ăn CPU vào máy 4 lõi và nhìn nó diễn ra: một lõi bị ghim, %Cpu(s) gần như không đổi, load leo dần theo từng phút. Tìm PID, rồi kill hoặc renice nó.')}

<h3>ps: STAT và sắp xếp</h3>
<p><code>ps</code> là một tấm ảnh chụp mà bạn lọc và sắp xếp được, nên nó hợp với script và ghi chú sự cố hơn <code>top</code>. Ta tạo mỗi trạng thái một tiến trình:</p>
${run('c22-cot', 'sleep 1; ps -eo')}
<table>
<tr><th>STAT</th><th>Nghĩa</th><th>Ở đây</th></tr>
<tr><td><code>R</code></td><td>đang chạy hoặc sẵn sàng chạy (trên CPU hoặc trong hàng đợi chạy)</td><td>chính <code>ps</code></td></tr>
<tr><td><code>S</code></td><td>đang ngủ, chờ một sự kiện (bộ hẹn giờ, socket, tiến trình con)</td><td><code>sleep 300</code>, <code>python3</code></td></tr>
<tr><td><code>D</code></td><td>ngủ không ngắt được — thường là I/O đĩa; đến <code>kill -9</code> cũng phải chờ</td><td>cái <code>dd</code> ở bài 2.1</td></tr>
<tr><td><code>T</code></td><td>đã dừng (<code>SIGSTOP</code>, Ctrl-Z, trình gỡ lỗi)</td><td><code>sleep 301</code> sau <code>kill -STOP</code></td></tr>
<tr><td><code>Z</code></td><td>zombie: đã thoát, cha chưa gọi <code>wait()</code></td><td>con <code>python3</code> được fork ra, RSS 0</td></tr>
<tr><td>hậu tố</td><td><code>s</code> trưởng phiên · <code>l</code> nhiều luồng · <code>N</code> ưu tiên thấp (nice &gt; 0) · <code>&lt;</code> ưu tiên cao · <code>+</code> tiền cảnh</td><td><code>RNl</code> = node đã nice, nhiều luồng</td></tr>
</table>
${run('c22-cot', 'ps -eo pid,comm,%cpu,%mem,rss --sort')}
<p><code>--sort=-rss</code> (hoặc <code>-%cpu</code>) đưa cái lớn nhất lên đầu; dấu trừ nghĩa là giảm dần.</p>

<h3>Sự cố: một biểu thức chính quy làm đông cứng cả API</h3>
${suCo('vi', [
  '<code>/health</code> ngừng trả lời; mọi request đều hết thời gian chờ. Log không có gì.',
  '<code>top</code>/<code>ps</code>: một <code>node</code> ở 90–100% CPU, không lúc nào nghỉ. <code>pidstat</code>: 100% <code>%usr</code>, 0% <code>%system</code>. <code>perf</code>: 100% số mẫu nằm trong một <code>RegExp</code>.',
  'Một regex kiểm email có lượng từ lồng nhau, quay lui theo cấp số nhân với một input dài; Node chạy JavaScript của bạn trên <strong>một</strong> luồng, nên cả máy chủ kẹt trong đúng một lời gọi đó.',
  'Diệt/khởi động lại tiến trình để hồi phục; viết lại regex không có lượng từ lồng nhau (hoặc dùng bộ phân tích/RE2); từ chối input quá dài trước khi so khớp.',
  'Lint để bắt regex nguy hiểm, giới hạn độ dài input ngay ở cửa vào, chạy so khớp mẫu không tin cậy ngoài luồng chính và có thời hạn, và giám sát một endpoint thật.',
])}
${src('ch02/api.js', 'javascript')}
${run('c22-cpu', "curl -s 'localhost:3000/check?email=cuong")}
${run('c22-cpu', 'for n in 40 45 50')}
<p>Một địa chỉ bình thường mất 1 ms. Một địa chỉ cố tình dựng với 40, 45, 50 chữ cái mất 26 ms, 173 ms, 1 174 ms — khoảng ×6,7 cho mỗi năm chữ thêm vào. 64 chữ là tính bằng phút. Gửi một cái rồi kiểm API từ một client khác:</p>
${run('c22-cpu', '(curl -s', 2)}
<p><code>exit=28</code> là mã "hết thời gian chờ" của curl. Tiến trình vẫn sống, chỉ là nó không bao giờ quay lại event loop. Đo:</p>
${run('c22-cpu', 'top -b -n 1')}
${run('c22-cpu', 'pidstat -u')}
${run('c22-cpu', 'grep ctxt')}
<p>100% <code>%usr</code> và 0% <code>%system</code>: thuần tính toán ở không gian người dùng — là mã của bạn, không phải nhân cũng không phải đĩa. Bộ đếm chuyển ngữ cảnh xác nhận điều đó: <code>voluntary</code> đứng yên ở 10 (nó không bao giờ ngủ, không bao giờ chờ I/O) trong khi <code>nonvoluntary</code> tăng (67 → 81) chỉ vì bộ lập lịch thỉnh thoảng giành CPU lại. Còn <code>%Cpu(s)</code> của cả máy báo <code>10.4 us</code> — "CPU rảnh 90%" — trong khi API đã chết. Đoạn mã nào? <code>perf</code> lấy mẫu stack 499 lần mỗi giây (Node cần <code>--perf-basic-prof</code> để perf gọi được tên các hàm đã biên dịch JIT):</p>
${run('c22-cpu', 'perf record')}
${run('c22-cpu', 'kill -9')}

<h3>Sự cố: zombie dồn đống tới mức không gì khởi động nổi</h3>
${suCo('vi', [
  'Một dịch vụ chụp ảnh trang/xuất PDF trong Docker (kiểu Chromium: trình duyệt đẻ các tiến trình phụ chạy nền) dần dần ngừng chạy: tiến trình phụ không khởi động được, rồi đến cả <code>docker exec</code> vào container cũng hỏng.',
  '<code>ps</code>: hàng chục tiến trình <code>Z</code> có cha là PID 1; <code>top</code>: <code>31 zombie</code>; <code>pids.current</code> = <code>pids.max</code>; log: <code>Cannot fork</code>; <code>docker exec</code>: <code>Resource temporarily unavailable</code>.',
  'Các tiến trình phụ mồ côi được giao lại cho PID 1 — mà PID 1 là <code>node</code>, và Node chỉ <code>wait()</code> những con do chính nó tạo. Không ai thu dọn chúng; mỗi zombie giữ một PID cho tới khi hết ngân sách PID của container.',
  'Khởi động lại container với <code>--init</code> (tini làm PID 1 thu dọn mọi tiến trình mồ côi); <code>kill -9</code> lên zombie chẳng làm gì cả.',
  '<code>init: true</code> trong compose (hoặc <code>--init</code>) cho mọi container có chương trình đẻ tiến trình con; đặt giới hạn <code>pids</code> để rò rỉ chỉ hại một container chứ không hại cả máy; cảnh báo theo số zombie.',
])}
${src('ch02/chup-anh.js', 'javascript')}
${run('c22-zombie', 'docker exec os-c22z ps', 3)}
${run('c22-zombie', "docker exec os-c22z sh -c 'Z=")}
<p>26 zombie sau 1,5 giây. Và không, bạn không giết được zombie: nó đã chết rồi — <code>kill -9</code> trả về mà dòng <code>Z</code> vẫn nằm đó. Nó chỉ còn là một mục trong bảng tiến trình, giữ mã thoát cho một người cha sẽ không bao giờ hỏi tới. Tám giây sau ngân sách PID của container (60) cạn sạch:</p>
${run('c22-zombie', 'sleep 8', 2)}
<p>Tiến trình phụ không fork được, và đến Docker cũng không mở nổi một tiến trình bên trong container để bạn vào xem. Cùng chương trình, thêm một cờ:</p>
${run('c22-zombie', 'docker run -d --name os-c22z-init', 4)}
<p>PID 1 giờ là <code>docker-init</code> (tini); nó thu dọn mọi tiến trình mồ côi, nên sau cùng sáu giây có 0 zombie và 14 PID đang dùng, và dịch vụ làm được 114 việc thay vì chết. Đây là bài 1.5 (PID 1 trong container) biến thành một sự cố thật.</p>
${L(OS('os-1-5-pid1'), '🧠', 'Bài 1.5 — PID 1 trong container', 'Vì sao PID 1 phải thu dọn tiến trình mồ côi và chuyển tín hiệu, và tini làm gì.', 'Mở')}
${lab('process', 'zombie', 'vi', 'Con thoát, cha không bao giờ gọi wait(): con nằm lại ở trạng thái Z giữ PID của nó. Bấm từng bước, rồi cho cha chết và xem init thu dọn nó.')}
${lab('sysmon', 'zombies', 'vi', 'Cùng sự cố trên một máy đang chạy: số zombie trong dòng Tasks cứ tăng, kill -9 lên một Z chẳng có tác dụng, giết tiến trình cha thì dọn sạch tất cả.')}

<div class="pitfall co-tieu-de">
<p><strong>"CPU mới 10%, không thể là do CPU."</strong> <code>%Cpu(s)</code> của cả máy là trung bình trên mọi lõi. Một máy chủ đơn luồng (Node, Python, Redis) có thể bị ghim 100% ở đúng một lõi của nó trong khi trung bình báo rảnh 90%. Luôn nhìn theo từng tiến trình (<code>pidstat</code>, <code>top</code> sắp theo <code>%CPU</code>) và từng lõi (<code>mpstat -P ALL</code>).</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>Đọc load mà không đếm lõi.</strong> Load 4,37 là thảm hoạ với container 2 lõi ở trên và chẳng là gì với 10 lõi đang rảnh. Luôn đặt nó cạnh <code>nproc</code> — và nhớ rằng trong container, load average là của <em>máy chủ</em>.</p>
</div>

<h3>Nếu bạn đã học Linux &amp; Bash 5.2</h3>
<p>Ở đó bạn học cách điều khiển <code>top</code> và <code>ps</code>. Ở đây mỗi cột được sinh ra bởi một chương trình ta cố ý viết — nên bạn biết cái gì làm <code>sy</code> tăng (syscall), cái gì làm <code>ni</code> khác 0 (nice), và vì sao load là một hàng đợi.</p>
${L(LNX('lnx-5-2-top-tai-bo-nho'), '🐧', 'Linux &amp; Bash · 5.2 — top, tải và bộ nhớ', 'Điều khiển top và ps ở mức lệnh.', 'Mở')}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> sau một lần deploy, API Node của nhóm thỉnh thoảng đông cứng vài phút; log không ghi gì, và khởi động lại thì "hết" cho tới lần sau.</p>
<ol>
<li>Chạy <code>api.js</code> (ở trên) trong lab bằng <code>node --perf-basic-prof api.js &amp;</code>. Đo thời gian <code>/check</code> với 40, 45 và 50 chữ cái và vẽ xem nó tăng nhanh cỡ nào.</li>
<li>Gửi một request 64 chữ ở nền. Chứng minh API đông cứng bằng <code>curl -m 2 …/health; echo $?</code> và chỉ ra tiến trình bằng <code>ps -eo pid,stat,%cpu,comm --sort=-%cpu</code>.</li>
<li>Chỉ ra thời gian là thời gian người dùng (<code>pidstat -u -p PID 1 3</code>) và <code>nonvoluntary_ctxt_switches</code> tăng trong khi <code>voluntary</code> không đổi. Gọi tên hàm có tội bằng <code>perf record -g -p PID</code> + <code>perf report</code> (container cần <code>--cap-add PERFMON --security-opt seccomp=unconfined</code>).</li>
<li>Sửa: viết lại <code>EMAIL</code> không có lượng từ lồng nhau (vd <code>/^[^@ ]+@[^@ ]+$/</code> rồi kiểm độ dài), và thêm một chốt từ chối input dài quá 254 ký tự trước khi so khớp. Chạy lại bước 2.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có đủ bốn dòng bằng chứng (hết giờ exit 28, 100% %usr, chuyển ngữ cảnh bị giành tăng dần, perf chỉ vào RegExp) và, sau khi sửa, request 64 chữ trả về trong vài mili giây trong khi <code>/health</code> vẫn trả lời đều.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['%CPU', 'CPU một tiến trình dùng, tính theo lõi: 300% = ba lõi bận cùng lúc.'],
  ['us / sy / ni', 'Mã người dùng / nhân làm việc hộ tiến trình / mã người dùng của tiến trình đã nice.'],
  ['wa / st', 'CPU rảnh trong khi tác vụ chờ đĩa / thời gian hypervisor đem vCPU của bạn cho máy ảo khác.'],
  ['load average (tải trung bình)', 'Trung bình giảm dần của số tác vụ đang chạy, sẵn sàng chạy hoặc ở trạng thái D, trong 1/5/15 phút — so với số lõi.'],
  ['STAT', 'Trạng thái tiến trình trong ps: R, S, D, T, Z cùng các hậu tố s, l, N, &lt;, +.'],
  ['ReDoS', 'Từ chối dịch vụ bằng biểu thức chính quy: một input khiến regex quay lui chạy thời gian cấp số nhân.'],
  ['zombie (Z)', 'Tiến trình đã xong mà cha chưa gọi wait(); chỉ tốn một ô PID — nhưng ô PID có hạn.'],
  ['involuntary context switch (chuyển ngữ cảnh bị giành)', 'Bộ lập lịch lấy CPU lại (hết lượt); một vòng lặp CPU thuần chỉ có loại này.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>top</code>: tải, trạng thái tác vụ, cách chia CPU, bộ nhớ, rồi tới các cột theo tiến trình; <code>%CPU</code> tính theo lõi.</li>
<li><code>us</code> = mã của bạn, <code>sy</code> = syscall, <code>ni</code> = mã đã nice, <code>wa</code> = chờ đĩa, <code>st</code> = bị hypervisor lấy mất.</li>
<li>Load là hàng đợi: 6 việc bận trên 2 lõi ⇒ load → 6, mỗi việc được một phần ba lõi. So với số lõi mà công việc được dùng.</li>
<li>Vòng lặp CPU chạy loạn: 100% <code>%usr</code>, chỉ có chuyển ngữ cảnh bị giành, <code>perf</code> gọi tên hàm. Máy chủ đơn luồng chết vì một request xấu.</li>
<li>Zombie không giết được; sửa tiến trình cha hoặc đặt một init (<code>--init</code>) làm PID 1 — không thì ngân sách PID cạn và không gì khởi động nổi.</li>
</ul>
${L('https://man7.org/linux/man-pages/man1/top.1.html', '📄', 'man 1 top', 'Mọi trường của vùng tóm tắt và các cột tiến trình.', 'Mở')}
${L('https://www.brendangregg.com/blog/2017-08-08/linux-load-averages.html', '📘', 'Brendan Gregg — Giải mã load average của Linux', 'Vì sao load của Linux tính cả trạng thái D, kèm lịch sử trong nhân.', 'Mở')}
${L('https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS', '🛡️', 'OWASP — Từ chối dịch vụ bằng biểu thức chính quy', 'Regex "độc" hoạt động ra sao và cách tránh.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 2.3 — Bộ nhớ ───────────────────────── */
    {
      title: '2.3 — Memory: free, available, and the exit-137 build|||2.3 — Bộ nhớ: free, available, và bản build chết với exit 137',
      slug: 'os-2-3-bo-nho',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Đọc free và /proc/meminfo: vì sao "free" gần 0 là bình thường và available mới là con số thật; page cache đo thật (ghi 400 MB, đọc lại nhanh gấp 3); RSS vs VSZ và một rò rỉ bộ nhớ Node; sự cố thật exit 137 khi build Next.js song song trên VPS 6 GB, tái hiện trên "VPS 1 GB" kèm memory.events, dmesg, docker stats — và exit 133 khi Node tự chạm trần heap.',
      content: `${G23}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>"Only 1 GB free" — is the box running out of memory?</h2>
<p class="lead">You run <code>free -m</code> on an 8 GB server and see 996 MB free. Panic, buy a bigger plan? Then one day a deploy dies halfway through <code>next build</code> with <code>exit 137</code> and no error message at all. This lesson teaches the one memory column that matters, shows the page cache filling and emptying with real numbers, catches a leak with <code>ps</code>, and replays the exit-137 incident of this project on a 1 GB "VPS".</p>
${lab('process', 'oom137', 'en', 'A container hits its memory limit: the kernel sends SIGKILL, the process gets no chance to log anything, and the exit code is 128 + 9 = 137.')}

<h3>Reading free: available, not free</h3>
${run('c23-mem', 'free -m')}
<table>
<tr><th>Column</th><th>Meaning</th></tr>
<tr><td><code>total</code></td><td>RAM the kernel can use (7934 MiB in this VM).</td></tr>
<tr><td><code>used</code></td><td>Memory taken by processes and the kernel that cannot simply be dropped.</td></tr>
<tr><td><code>free</code></td><td>RAM nobody is using at all — <em>wasted</em> RAM. Linux tries to keep this small on purpose.</td></tr>
<tr><td><code>buff/cache</code></td><td>The page cache: copies of file contents kept in RAM so the next read does not touch the disk. Given back the moment programs need it.</td></tr>
<tr><td><code>available</code></td><td>The kernel's estimate of how much a new program could get <strong>without swapping</strong>: free + the cache it can drop. <strong>This is the number to watch.</strong></td></tr>
</table>
<p>Here: 996 MB free but 4 671 MB available. The machine is fine. The same numbers come from <code>/proc/meminfo</code>, which every tool (and every monitoring agent) reads:</p>
${run('c23-mem', 'grep -E')}

<h3>The page cache, filling and emptying</h3>
<p>Write a 400 MB file and watch the columns:</p>
${run('c23-mem', 'dd if=/dev/urandom', 2)}
<p><code>buff/cache</code> grew from 4 030 to 4 430 MB and <code>free</code> dropped by 380 MB — the file's contents are now in RAM. Yet <code>available</code> barely moved (4 671 → 4 692): cache counts as available. Now ask the kernel to drop just this file from the cache (<code>posix_fadvise(DONTNEED)</code>), then read it twice:</p>
${run('c23-mem', 'python3 -c', 4)}
<p>Dropped: cache back to 4 030, free back up. First read: 8.9 GB/s, and the cache grows by 400 MB again as the file is pulled in. Second read: <strong>28 GB/s</strong>, about three times faster, straight from RAM. (Honest note: this lab's "disk" is a file on the Mac's SSD that macOS itself caches, so even the first read is fast; on a real cloud disk the gap is far wider.) Delete the file and its cache disappears with it:</p>
${run('c23-mem', 'rm /data/big.bin')}
${lab('pagecache', 'warm', 'en', 'Read the same file cold, then warm: the first pass goes to the disk page by page, the second is served from the page cache — the buff/cache column you just watched grow.')}
<p>So a server whose <code>free</code> is near zero is usually a server using its spare RAM as a disk cache — exactly what you want. Worry when <code>available</code> shrinks and keeps shrinking, or when <code>vmstat</code> shows swapping:</p>
${run('c23-mem', 'vmstat -S M')}
<p><code>swpd</code> (swap in use), <code>si</code>/<code>so</code> (MB swapped in/out per second) all 0: no memory pressure. Steady non-zero <code>si</code>/<code>so</code> means programs are fighting over RAM — Chapter 8 measures that (thrashing).</p>
${lab('vm', 'pressure', 'en', 'Shrink the number of RAM frames and watch page faults climb: this is what steady si/so in vmstat looks like from the inside.')}

<h3>RSS, VSZ and a leak you can watch grow</h3>
<p>A small API with a home-made cache that never evicts anything — the most common kind of backend "memory leak": not forgetting to free, but keeping a reference forever:</p>
${src('ch02/ro-ri.js', 'javascript')}
${run('c23-mem', 'ps -o pid,rss,vsz,comm -p')}
${run('c23-mem', 'for i in')}
${run('c23-mem', "grep -E '^(VmRSS")}
${run('c23-mem', 'ps -eo pid,rss,vsz,%mem,comm --sort')}
<p>RSS (resident set size, KB actually in RAM) went from 49 MB to 373 MB after 1 500 distinct ids × 200 KB — the growth matches the cache exactly. <code>VmHWM</code> is the peak ("high-water mark"). <code>RssAnon</code> is the heap and buffers; <code>RssFile</code> is the code and libraries mapped from files. VSZ (1 GB) is reserved address space and says little (lesson 1.1). To catch a leak: sample RSS over time (<code>pidstat -r 60</code>, or a monitoring graph) and look for a line that only goes up under steady traffic.</p>
${lab('sysmon', 'memleak', 'en', 'A leak on a live box: available shrinks, the cache is squeezed, swap starts, then the OOM killer ends it and systemd restarts the service — watch free -m and dmesg along the way.')}

<h3>Incident: next build dies with exit 137</h3>
${suCo('en', [
  'On 06/07/2026 a deploy on the 6 GB VPS stopped in the middle of <code>next build</code>: <code>exit 137</code>, no stack trace, no "error".',
  '137 = 128 + 9 → the process got SIGKILL. The backend and frontend images were being built <strong>at the same time</strong>, on a cold cache (the build cache was pruned after every deploy). In the lab below the kernel says it outright: <code>Memory cgroup out of memory: Killed process … (node)</code>, and <code>memory.events</code> counts <code>oom_kill</code>.',
  'Two big Node builds in parallel needed more RAM than the box had; the kernel’s OOM killer picked the largest process and killed it. Node had permission (<code>--max-old-space-size</code>) to grow past the real RAM, so it never hit its own limit first.',
  'Build one image at a time (<code>deploy.sh</code> step 2a became sequential) — later, move builds off the VPS entirely (<code>deploy-nha.sh</code> builds on a 31 GB home machine).',
  'Size Node’s heap below the real limit, never run two heavy builds on a small box, watch <code>docker stats</code> during builds, and alert on OOM kills.',
])}
<p>Reproduce it on a "VPS" with 1 GB and no swap. <code>build.js</code> imitates a bundler that keeps growing its in-memory module graph; with target 600 it peaks at ~660 MB:</p>
${src('ch02/build.js', 'javascript')}
${run('c23-oom', 'docker run --rm --name os-c23a')}
${run('c23-oom', 'docker run --rm --name os-c23b')}
${run('c23-oom', 'docker run --rm --label oslab=1 --privileged')}
<p>One build fits (exit 0). Two at once: around 900 MB together the kernel kills one, the survivor grows again and is killed too — <code>oom_kill 2</code>, both <code>exit=137</code>, and not a word from Node, because SIGKILL cannot be caught. The only record is in the kernel log. The fix of 06/07, sequential builds, on the same box:</p>
${run('c23-oom', 'docker run --rm --name os-c23c')}
${lab('cgroup', 'oom', 'en', 'The container’s memory on a timeline: usage climbs to memory.max, the kernel reclaims what it can, then SIGKILL — exit 137. Compare with the high preset, where memory.high throttles instead of killing.')}
<p>Two variations worth recognising:</p>
${run('c23-oom', 'docker run --rm --name os-c23d')}
${run('c23-oom', 'docker run --name os-c23e', 2)}
<p>With a heap limit <em>below</em> the container limit (<code>--max-old-space-size=256</code>), Node stops itself with a readable <code>FATAL ERROR: … JavaScript heap out of memory</code>; on this arm64 lab the exit code is 133 (128 + SIGTRAP, V8's own crash) — on x86-64 servers you usually see 134 (128 + SIGABRT). Either way: Node's own limit, a message in the log. With the heap limit above the container limit and the build as the container's main process, Docker records <code>OOMKilled=true ExitCode=137</code>.</p>

<h3>Watching container memory: docker stats</h3>
${run('c23-oom', 'docker stats')}
${run('c23-oom', 'docker exec os-c23f')}
<p><code>docker stats</code> reads the container's cgroup: 627 MiB used of a 1 GiB limit (61%). Inside, <code>memory.current</code>/<code>memory.max</code> say the same in bytes — while <code>free</code> inside the very same container reports the VM's 7.9 GB. During a build on a small VPS, keep <code>docker stats</code> open in a second terminal.</p>

<div class="pitfall co-tieu-de">
<p><strong>"free is almost zero — we need more RAM."</strong> Linux fills spare RAM with the page cache on purpose and gives it back on demand. Judge by <code>available</code> and by swapping (<code>si/so</code>), never by <code>free</code>. A box with 100 MB free and 4 GB available is healthy; a box with 2 GB free and <code>available</code> dropping every hour has a leak.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>A heap limit bigger than the box.</strong> <code>NODE_OPTIONS=--max-old-space-size=4096</code> on a 1 GB container (or a 6 GB VPS running two builds) tells V8 it may grow past the RAM that exists. Then the kernel, not Node, ends the story — with SIGKILL, exit 137 and no message. Set the heap a bit below the real limit so failures are loud and readable.</p>
</div>

<h3>Where this goes deeper</h3>
<p>Chapter 8 opens the mechanism: how the page cache is reclaimed, what swap and swappiness do, how the OOM killer scores its victims, and the full exit-137 study with Node, JVM and container limits. Lesson 1.4 explains the 128 + N rule.</p>
${L(OS('os-8-4-exit137'), '🧠', 'Lesson 8.4 — The exit-137 incident, measured', 'The same incident from the kernel side: oom_score, cgroup v2 events, limits for Node and JVM.', 'Open')}
${L(OS('os-1-4-vong-doi'), '🧠', 'Lesson 1.4 — States, signals and exit codes', 'Why 137 means SIGKILL and 143 means SIGTERM.', 'Open')}

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> your team's CI/deploy keeps failing with "exit 137" in the frontend step, only on the small server, never on laptops.</p>
<ol>
<li>Save <code>build.js</code> and run one build in <code>docker run --rm --memory 1g --memory-swap 1g … node --max-old-space-size=4096 build.js 600</code>. Note the peak RSS.</li>
<li>Run two builds in the same container at once (as in the lesson). Read <code>/sys/fs/cgroup/memory.events</code> before the container exits and find the kernel's line with <code>dmesg | grep -i "killed process"</code> (privileged container).</li>
<li>Make it pass twice: (a) sequential builds; (b) parallel builds with <code>--max-old-space-size=350</code> each — what changes in the error and the exit code?</li>
<li>Start one build with a 60-second hold (<code>build.js 600 x 60</code>) detached and read it with <code>docker stats --no-stream</code> and with <code>free -m</code> inside. Explain the difference.</li>
</ol>
<p><strong>Done when:</strong> you can show <code>oom_kill</code> counting up, quote the kernel's "Killed process" line, explain why 137 has no stack trace while the heap-limit failure prints <code>FATAL ERROR</code>, and you have a passing configuration.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['available', 'Memory a new program could get without swapping: free RAM plus cache that can be dropped. The column to watch.'],
  ['buff/cache · page cache', 'File contents kept in RAM to avoid disk reads; reclaimed automatically when programs need memory.'],
  ['RSS · VmHWM', 'Resident set size: RAM a process really uses now · its peak since start.'],
  ['VSZ', 'Virtual size: address space reserved, mostly untouched — not a measure of RAM use.'],
  ['OOM killer', 'Kernel code that, when memory (or a cgroup limit) runs out, kills a process with SIGKILL.'],
  ['memory.max · memory.events', 'cgroup v2 files: the container’s memory limit · counters including oom_kill.'],
  ['exit 137', '128 + 9: the process was killed by SIGKILL — in containers almost always the OOM killer.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Read <code>available</code>, not <code>free</code>; a near-zero <code>free</code> is the page cache doing its job.</li>
<li>The page cache grew by the 400 MB we wrote, made the re-read 3× faster here, and vanished with the file.</li>
<li>Leaks show as RSS that only grows under steady traffic; sample it over time.</li>
<li>Exit 137 = SIGKILL = (in containers) the OOM killer; no message from the app, the evidence is in <code>dmesg</code> and <code>memory.events</code>.</li>
<li>Do heavy builds one at a time on small servers, keep Node's heap below the real limit, and watch <code>docker stats</code>.</li>
</ul>
${L('https://man7.org/linux/man-pages/man1/free.1.html', '📄', 'man 1 free', 'Exact definitions of used, buff/cache and available.', 'Open')}
${L('https://docs.docker.com/engine/containers/resource_constraints/', '🐳', 'Docker — Resource constraints', 'Memory limits, swap, and what happens when a container hits them.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>"Chỉ còn 1 GB free" — máy sắp hết bộ nhớ thật à?</h2>
<p class="lead">Bạn chạy <code>free -m</code> trên một máy chủ 8 GB và thấy free 996 MB. Hoảng, mua gói lớn hơn? Rồi một hôm một lần deploy chết giữa chừng <code>next build</code> với <code>exit 137</code> và không có lấy một dòng báo lỗi. Bài này dạy đúng một cột bộ nhớ đáng xem, cho thấy page cache đầy lên rồi rỗng đi bằng số thật, bắt một rò rỉ bằng <code>ps</code>, và dựng lại sự cố exit 137 của chính dự án này trên một "VPS" 1 GB.</p>
${lab('process', 'oom137', 'vi', 'Một container chạm trần bộ nhớ: nhân gửi SIGKILL, tiến trình không kịp ghi gì, và mã thoát là 128 + 9 = 137.')}

<h3>Đọc free: available, không phải free</h3>
${run('c23-mem', 'free -m')}
<table>
<tr><th>Cột</th><th>Nghĩa</th></tr>
<tr><td><code>total</code></td><td>RAM nhân dùng được (7934 MiB trong máy ảo này).</td></tr>
<tr><td><code>used</code></td><td>Bộ nhớ các tiến trình và nhân đang chiếm mà không thể cứ thế bỏ đi.</td></tr>
<tr><td><code>free</code></td><td>RAM chẳng ai dùng — RAM <em>lãng phí</em>. Linux cố tình giữ con số này nhỏ.</td></tr>
<tr><td><code>buff/cache</code></td><td>Page cache: bản sao nội dung file giữ trong RAM để lần đọc sau khỏi chạm đĩa. Được trả lại ngay khi chương trình cần.</td></tr>
<tr><td><code>available</code></td><td>Ước lượng của nhân về lượng bộ nhớ một chương trình mới có thể nhận <strong>mà không phải swap</strong>: free + phần cache bỏ được. <strong>Đây là con số cần theo dõi.</strong></td></tr>
</table>
<p>Ở đây: free 996 MB nhưng available 4 671 MB. Máy ổn. Cùng các con số đó nằm trong <code>/proc/meminfo</code>, thứ mà mọi công cụ (và mọi agent giám sát) đều đọc:</p>
${run('c23-mem', 'grep -E')}

<h3>Page cache, đầy lên rồi rỗng đi</h3>
<p>Ghi một file 400 MB và nhìn các cột:</p>
${run('c23-mem', 'dd if=/dev/urandom', 2)}
<p><code>buff/cache</code> tăng từ 4 030 lên 4 430 MB và <code>free</code> giảm 380 MB — nội dung file giờ nằm trong RAM. Vậy mà <code>available</code> gần như không đổi (4 671 → 4 692): cache được tính là "có sẵn". Giờ nhờ nhân bỏ riêng file này khỏi cache (<code>posix_fadvise(DONTNEED)</code>), rồi đọc nó hai lần:</p>
${run('c23-mem', 'python3 -c', 4)}
<p>Đã bỏ: cache về lại 4 030, free tăng lên. Lần đọc đầu: 8,9 GB/s, và cache lại tăng 400 MB khi file được kéo vào. Lần thứ hai: <strong>28 GB/s</strong>, nhanh gấp khoảng ba lần, đọc thẳng từ RAM. (Nói thật: "đĩa" của lab này là một file trên SSD của máy Mac mà chính macOS cũng cache, nên đến lần đọc đầu cũng nhanh; trên một ổ đĩa cloud thật, khoảng cách còn lớn hơn nhiều.) Xoá file đi thì cache của nó cũng biến mất theo:</p>
${run('c23-mem', 'rm /data/big.bin')}
${lab('pagecache', 'warm', 'vi', 'Đọc cùng một file lúc nguội rồi lúc ấm: lượt đầu đi xuống đĩa từng trang, lượt sau được phục vụ từ page cache — đúng cái cột buff/cache bạn vừa thấy tăng lên.')}
<p>Vậy một máy chủ có <code>free</code> gần bằng 0 thường là máy đang dùng RAM thừa làm cache cho đĩa — đúng thứ bạn muốn. Hãy lo khi <code>available</code> co lại và cứ co mãi, hoặc khi <code>vmstat</code> cho thấy đang swap:</p>
${run('c23-mem', 'vmstat -S M')}
<p><code>swpd</code> (swap đang dùng), <code>si</code>/<code>so</code> (MB swap vào/ra mỗi giây) đều bằng 0: không có áp lực bộ nhớ. <code>si</code>/<code>so</code> khác 0 đều đặn nghĩa là các chương trình đang giành nhau RAM — Chương 8 sẽ đo chuyện đó (thrashing).</p>
${lab('vm', 'pressure', 'vi', 'Giảm số khung RAM và nhìn lỗi trang leo thang: đây là hình dạng của si/so đều đặn trong vmstat khi nhìn từ bên trong.')}

<h3>RSS, VSZ và một rò rỉ bạn nhìn thấy nó lớn dần</h3>
<p>Một API nhỏ với bộ đệm tự viết không bao giờ xoá gì — kiểu "rò rỉ bộ nhớ" phổ biến nhất ở backend: không phải quên giải phóng, mà là giữ tham chiếu mãi mãi:</p>
${src('ch02/ro-ri.js', 'javascript')}
${run('c23-mem', 'ps -o pid,rss,vsz,comm -p')}
${run('c23-mem', 'for i in')}
${run('c23-mem', "grep -E '^(VmRSS")}
${run('c23-mem', 'ps -eo pid,rss,vsz,%mem,comm --sort')}
<p>RSS (resident set size — số KB thật sự nằm trong RAM) đi từ 49 MB lên 373 MB sau 1 500 id khác nhau × 200 KB — mức tăng khớp đúng với bộ đệm. <code>VmHWM</code> là mức đỉnh ("vạch nước cao nhất"). <code>RssAnon</code> là heap và buffer; <code>RssFile</code> là mã và thư viện ánh xạ từ file. VSZ (1 GB) là vùng địa chỉ giữ chỗ, chẳng nói được bao nhiêu (bài 1.1). Để bắt rò rỉ: lấy mẫu RSS theo thời gian (<code>pidstat -r 60</code>, hoặc một biểu đồ giám sát) và tìm một đường chỉ đi lên trong khi lưu lượng đều đều.</p>
${lab('sysmon', 'memleak', 'vi', 'Một vụ rò rỉ trên máy đang chạy: available co dần, cache bị ép, bắt đầu swap, rồi OOM killer kết thúc và systemd chạy lại dịch vụ — theo dõi free -m và dmesg dọc đường.')}

<h3>Sự cố: next build chết với exit 137</h3>
${suCo('vi', [
  'Ngày 06/07/2026 một lần deploy trên VPS 6 GB dừng giữa <code>next build</code>: <code>exit 137</code>, không stack trace, không chữ "error" nào.',
  '137 = 128 + 9 → tiến trình nhận SIGKILL. Ảnh backend và frontend đang được build <strong>cùng lúc</strong>, trên cache nguội (build cache bị dọn sau mỗi lần deploy). Trong lab ở dưới, nhân nói thẳng ra: <code>Memory cgroup out of memory: Killed process … (node)</code>, và <code>memory.events</code> đếm <code>oom_kill</code>.',
  'Hai bản build Node lớn chạy song song cần nhiều RAM hơn máy có; OOM killer của nhân chọn tiến trình lớn nhất và giết nó. Node được phép (<code>--max-old-space-size</code>) phình quá RAM thật, nên nó không bao giờ chạm trần của chính nó trước.',
  'Build từng ảnh một (bước 2a của <code>deploy.sh</code> chuyển sang tuần tự) — về sau, đưa hẳn việc build ra khỏi VPS (<code>deploy-nha.sh</code> build trên máy nhà 31 GB).',
  'Đặt heap của Node thấp hơn trần thật, không bao giờ chạy hai bản build nặng trên máy nhỏ, theo dõi <code>docker stats</code> lúc build, và cảnh báo khi có OOM kill.',
])}
<p>Dựng lại trên một "VPS" 1 GB không swap. <code>build.js</code> bắt chước một bundler cứ phình đồ thị module trong bộ nhớ; với đích 600 nó đạt đỉnh ~660 MB:</p>
${src('ch02/build.js', 'javascript')}
${run('c23-oom', 'docker run --rm --name os-c23a')}
${run('c23-oom', 'docker run --rm --name os-c23b')}
${run('c23-oom', 'docker run --rm --label oslab=1 --privileged')}
<p>Một bản build vừa (exit 0). Hai bản cùng lúc: khoảng 900 MB cộng lại thì nhân giết một cái, cái còn lại phình tiếp rồi cũng bị giết — <code>oom_kill 2</code>, cả hai <code>exit=137</code>, và Node không nói được lời nào, vì SIGKILL không bắt được. Bằng chứng duy nhất nằm trong log của nhân. Cách sửa ngày 06/07, build tuần tự, trên cùng cái máy đó:</p>
${run('c23-oom', 'docker run --rm --name os-c23c')}
${lab('cgroup', 'oom', 'vi', 'Bộ nhớ của container trên một dòng thời gian: mức dùng leo tới memory.max, nhân thu hồi được gì thì thu, rồi SIGKILL — exit 137. So với preset high, nơi memory.high bóp chậm thay vì giết.')}
<p>Hai biến thể nên nhận ra:</p>
${run('c23-oom', 'docker run --rm --name os-c23d')}
${run('c23-oom', 'docker run --name os-c23e', 2)}
<p>Khi trần heap <em>thấp hơn</em> trần container (<code>--max-old-space-size=256</code>), Node tự dừng với một dòng đọc được <code>FATAL ERROR: … JavaScript heap out of memory</code>; trên lab arm64 này mã thoát là 133 (128 + SIGTRAP, V8 tự đánh sập) — trên máy chủ x86-64 bạn thường gặp 134 (128 + SIGABRT). Đằng nào cũng vậy: trần của chính Node, có thông báo trong log. Khi trần heap cao hơn trần container và bản build là tiến trình chính của container, Docker ghi <code>OOMKilled=true ExitCode=137</code>.</p>

<h3>Theo dõi bộ nhớ container: docker stats</h3>
${run('c23-oom', 'docker stats')}
${run('c23-oom', 'docker exec os-c23f')}
<p><code>docker stats</code> đọc cgroup của container: dùng 627 MiB trên trần 1 GiB (61%). Bên trong, <code>memory.current</code>/<code>memory.max</code> nói đúng như vậy bằng byte — trong khi <code>free</code> trong chính container đó lại báo 7,9 GB của máy ảo. Khi build trên một VPS nhỏ, hãy mở sẵn <code>docker stats</code> ở terminal thứ hai.</p>

<div class="pitfall co-tieu-de">
<p><strong>"free gần bằng 0 — phải nâng RAM."</strong> Linux cố tình lấp RAM thừa bằng page cache và trả lại khi cần. Hãy đánh giá bằng <code>available</code> và chuyện có swap hay không (<code>si/so</code>), đừng bao giờ bằng <code>free</code>. Một máy có free 100 MB và available 4 GB là khoẻ; một máy có free 2 GB mà <code>available</code> giảm dần mỗi giờ là đang rò rỉ.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>Trần heap to hơn cả cái máy.</strong> <code>NODE_OPTIONS=--max-old-space-size=4096</code> trên container 1 GB (hay VPS 6 GB chạy hai bản build) là bảo V8 được phép phình quá lượng RAM có thật. Khi đó nhân, chứ không phải Node, kết thúc câu chuyện — bằng SIGKILL, exit 137 và không một lời nhắn. Hãy đặt heap thấp hơn trần thật một chút để lỗi xảy ra to và đọc được.</p>
</div>

<h3>Đi sâu hơn ở đâu</h3>
<p>Chương 8 mở cơ chế ra: page cache được thu hồi thế nào, swap và swappiness làm gì, OOM killer chấm điểm nạn nhân ra sao, và bài nghiên cứu đầy đủ về exit 137 với giới hạn của Node, JVM và container. Bài 1.4 giải thích quy tắc 128 + N.</p>
${L(OS('os-8-4-exit137'), '🧠', 'Bài 8.4 — Sự cố exit 137, đo thật', 'Cùng sự cố nhìn từ phía nhân: oom_score, sự kiện cgroup v2, giới hạn cho Node và JVM.', 'Mở')}
${L(OS('os-1-4-vong-doi'), '🧠', 'Bài 1.4 — Trạng thái, tín hiệu và mã thoát', 'Vì sao 137 nghĩa là SIGKILL và 143 nghĩa là SIGTERM.', 'Mở')}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> CI/deploy của nhóm cứ hỏng với "exit 137" ở bước frontend, chỉ trên máy chủ nhỏ, chưa bao giờ trên laptop.</p>
<ol>
<li>Lưu <code>build.js</code> và chạy một bản build trong <code>docker run --rm --memory 1g --memory-swap 1g … node --max-old-space-size=4096 build.js 600</code>. Ghi lại RSS đỉnh.</li>
<li>Chạy hai bản build trong cùng container cùng lúc (như trong bài). Đọc <code>/sys/fs/cgroup/memory.events</code> trước khi container thoát và tìm dòng của nhân bằng <code>dmesg | grep -i "killed process"</code> (container privileged).</li>
<li>Làm cho nó qua bằng hai cách: (a) build tuần tự; (b) build song song với <code>--max-old-space-size=350</code> mỗi bản — lỗi và mã thoát thay đổi thế nào?</li>
<li>Chạy nền một bản build giữ 60 giây (<code>build.js 600 x 60</code>) rồi đọc nó bằng <code>docker stats --no-stream</code> và bằng <code>free -m</code> bên trong. Giải thích chỗ khác nhau.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra được <code>oom_kill</code> tăng lên, trích được dòng "Killed process" của nhân, giải thích vì sao 137 không có stack trace còn lỗi trần heap lại in <code>FATAL ERROR</code>, và có một cấu hình chạy qua.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['available (khả dụng)', 'Bộ nhớ một chương trình mới có thể nhận mà không phải swap: RAM trống cộng phần cache bỏ được. Cột cần theo dõi.'],
  ['buff/cache · page cache', 'Nội dung file giữ trong RAM để khỏi đọc đĩa; tự được thu hồi khi chương trình cần bộ nhớ.'],
  ['RSS · VmHWM', 'Resident set size: RAM tiến trình đang dùng thật · mức đỉnh từ lúc chạy.'],
  ['VSZ', 'Kích thước ảo: vùng địa chỉ giữ chỗ, phần lớn chưa chạm tới — không phải số đo RAM.'],
  ['OOM killer (bộ diệt khi hết bộ nhớ)', 'Mã của nhân, khi hết bộ nhớ (hoặc chạm trần cgroup), giết một tiến trình bằng SIGKILL.'],
  ['memory.max · memory.events', 'File cgroup v2: trần bộ nhớ của container · các bộ đếm, trong đó có oom_kill.'],
  ['exit 137', '128 + 9: tiến trình bị SIGKILL — trong container gần như luôn là OOM killer.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đọc <code>available</code>, không đọc <code>free</code>; <code>free</code> gần 0 là page cache đang làm đúng việc của nó.</li>
<li>Page cache tăng đúng 400 MB ta ghi, giúp lần đọc lại nhanh gấp 3 ở đây, và biến mất cùng file.</li>
<li>Rò rỉ hiện ra thành RSS chỉ tăng trong khi lưu lượng đều; hãy lấy mẫu nó theo thời gian.</li>
<li>Exit 137 = SIGKILL = (trong container) OOM killer; ứng dụng không nói gì, bằng chứng nằm ở <code>dmesg</code> và <code>memory.events</code>.</li>
<li>Build nặng từng cái một trên máy chủ nhỏ, đặt heap Node thấp hơn trần thật, và theo dõi <code>docker stats</code>.</li>
</ul>
${L('https://man7.org/linux/man-pages/man1/free.1.html', '📄', 'man 1 free', 'Định nghĩa chính xác của used, buff/cache và available.', 'Mở')}
${L('https://docs.docker.com/engine/containers/resource_constraints/', '🐳', 'Docker — Giới hạn tài nguyên', 'Trần bộ nhớ, swap, và chuyện gì xảy ra khi container chạm trần.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 2.4 — Đĩa ───────────────────────── */
    {
      title: '2.4 — Disk full and slow I/O: df, du, inodes, lsof and the night Postgres died|||2.4 — Đầy đĩa và I/O chậm: df, du, inode, lsof và đêm Postgres chết',
      slug: 'os-2-4-dia-io',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Sự cố thật: build cache và ảnh Docker cũ làm đầy đĩa VPS ⇒ Postgres PANIC, kẹt phục hồi, khởi động lại vô tận — tái hiện trên file ext4 96 MB; máy Mac đầy đĩa vì video và cache build, Docker.raw 926 GB "ảo"; file đã xoá vẫn giữ 30 MB (lsof +L1); cạn inode khi df -h mới 15%; du tìm thủ phạm; đọc iostat.',
      content: `${G24}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>When the disk fills up, the database is the first to die</h2>
<p class="lead">"No space left on device" is the most common outage of a small self-hosted project — this one has had it five times on the VPS and several times on the development Mac. And disk-full has disguises: a disk that is full although <code>du</code> finds nothing, a disk that says "no space" while <code>df</code> shows 85% free. This lesson replays each one on a tiny throw-away disk (an ext4 file of 64–96 MB attached through a loop device — never the real disk) and teaches the commands that tell them apart.</p>
${lab('latency', 'default', 'en', 'The disk is the slowest stop before the network. When processes queue for it, CPUs sit in iowait and everything above the disk — the database first — slows down or stops.')}

<h3>df: how full is each filesystem</h3>
${run('c24-disk', 'df -h /mnt/vps')}
${run('c24-disk', 'df -i /mnt/vps')}
${run('c24-disk', 'tune2fs -l')}
<p>A 64 MB file formatted as ext4 shows <code>Size 60M</code> (metadata takes the rest) but <code>Avail</code> only 55M: ext4 <strong>reserves 5%</strong> of blocks (819 × 4 KB here) for root, so that root can still log in and clean up when users have filled the disk. Remember it: a database running as user <code>postgres</code> hits "no space" while <code>df</code> still shows a few percent; a root process can eat the reserve too. <code>df -i</code> counts something else: <strong>inodes</strong>, one per file or directory — 2 048 here, chosen small on purpose.</p>

<h3>Incident: build cache fills the disk, Postgres dies</h3>
${suCo('en', [
  '03/07/2026: deploy fails pulling images with <code>no space left on device</code>; every API route using the database returns 500 with Prisma <code>FATAL: the database system is not yet accepting connections</code>; the homepage still returns 200.',
  '<code>df -h /</code>: <code>39G 38G 0 100%</code>. <code>docker system df</code>: images ≈ 19 GB, build cache ≈ 4.5 GB. <code>docker ps</code>: postgres <code>Up (unhealthy)</code>.',
  'Postgres shares the root disk with <code>/var/lib/docker</code>. Old images and build cache grew with every deploy until nothing was left; Postgres could not write WAL, crashed, and could not finish recovery.',
  '<code>docker system prune -af &amp;&amp; docker builder prune -af</code> (~10 GB back, 100% → 71% — never with <code>--volumes</code>, that deletes database volumes); <code>docker restart</code> postgres → healthy in under a minute; re-run the failed deploy.',
  'A weekly cleanup job — later fixed to decide by <em>free space</em>, not age, and to delete old <em>tagged</em> deploy images keeping 3; builds moved off the VPS (no build cache there); alert at 85%.',
])}
<p>It came back four times, each teaching something: 12/07 (86% full, <code>next build</code> hit 100% while writing its cache — the build failed before the swap, so production survived); 18/08 (build cache had grown to 7.6 GB on the disk holding Postgres; the disk fell to 1.8 GB during a build); 27/08 (509 MB left of 49 GB: each deploy tagged images with the commit SHA, so old images were <em>tagged</em>, and <code>docker image prune -f</code> only removes untagged ones); 05/09 (97%, the weekly job ran "green" and freed 0 bytes — 40 tagged images held 27.66 GB). Now the reproduction: Postgres 17 with its data on a 96 MB ext4 disk, and a "build cache" written by root on the same disk.</p>
${run('c24-pg', 'docker run -d --name os-c24-pg', 3)}
${run('c24-pg', "docker exec os-c24-pg bash -c 'mkdir")}
${run('c24-pg', 'docker exec os-c24-pg psql -U postgres -c "insert into orders(note) select', 2)}
<p>First symptom: writes fail with <code>could not extend file … No space left on device</code>. The database process is still up, so the app looks half alive: every write fails. Then Postgres must write a checkpoint:</p>
${run('c24-pg', 'docker exec os-c24-pg psql -U postgres -c "checkpoint"', 4)}
<p>Read the log lines in order: the checkpointer <code>PANIC</code>s (Postgres refuses to continue when it cannot persist data — that is the right call), the postmaster kills every backend (<code>terminated by signal 6: Aborted</code>), tries automatic recovery, recovery cannot create a new WAL file (<code>FATAL: could not write to file "pg_wal/xlogtemp…"</code>), and it shuts down. Docker's <code>--restart unless-stopped</code> starts it again, it cannot even write its lock file, and the container sits in <code>Restarting (1)</code>; <code>docker exec</code> refuses. A restart policy cannot fix a full disk. The fix is space:</p>
${run('c24-pg', 'docker stop os-c24-pg', 4)}
<p><code>du</code> names the occupant (44 MB of "build cache" next to 40 MB of database), we delete what can be rebuilt, Postgres replays its WAL (<code>redo done</code>) and all 20 000 rows are there. That is also why you <strong>never delete files inside the database directory</strong> to make room: the space must come from things that can be regenerated — caches, old images, old logs.</p>
<p>What <code>docker system df</code> tells you, on the Mac this course was written on:</p>
${run('c24-host', 'docker system df')}
<p><code>SIZE</code> is what each kind of object takes; <code>RECLAIMABLE</code> is what nothing currently uses (images with no container, stopped containers, unused volumes, build cache). <code>ACTIVE</code> counts the ones in use. Reclaim with the matching <code>prune</code> — and read what it will delete first.</p>

<h3>Incident: the development Mac fills up, Docker Desktop hangs</h3>
${suCo('en', [
  '27/10/2026 ~19:15: Claude Code reports <code>ENOSPC</code> and cannot run any command; a publish job dies. 28/10: the Mac is down to 1.4 GB and Docker Desktop stops responding.',
  '<code>df -h /System/Volumes/Data</code>; <code>du -sh</code> on the usual suspects: the video folder, <code>$TMPDIR</code>, <code>node_modules/.cache</code>, Docker’s disk image.',
  'Intermediate files nobody deleted: 235 compressed lecture videos (≈ 25 GB) kept after upload; each video render leaving a ~12 GB bundle in <code>$TMPDIR</code>; a webpack cache that had grown to 109 GB; Docker’s VM disk file at 46 GB.',
  'Delete what is already uploaded or can be rebuilt (with the owner’s OK); clean <code>$TMPDIR/remotion-*</code> between renders.',
  'Pipelines delete their intermediates after a verified upload; check <code>df</code> before a long job and warn below 20 GB.',
])}
${run('c24-host', 'df -h')}
${run('c24-host', 'ls -lh', 2)}
<p>Docker Desktop keeps the whole Linux VM disk in one <strong>sparse file</strong>: <code>ls</code> shows its maximum size (926 GB — larger than the 39 GB actually free!), <code>du</code> shows the blocks really used (47 GB). Pruning inside Docker frees space <em>inside</em> the VM; the file on the Mac gives it back only later. When the Mac's disk is full, the VM's disk cannot grow either — which is how Docker Desktop ends up hanging.</p>

<h3>Finding who uses the space: du</h3>
${run('c24-disk', 'du -xh --max-depth=1')}
<p><code>du</code> walks the files you can still see and adds up their blocks; <code>-x</code> stays on one filesystem, <code>--max-depth=1</code> gives one line per top folder, <code>sort -h</code> understands K/M/G. Repeat one level down in the biggest folder until you reach the culprit. On a real server, <code>ncdu -x /</code> does the same interactively (arrows to descend, <code>d</code> to delete) — install it before you need it, because a full disk may refuse to install anything.</p>

<h3>Incident: you deleted the 30 MB log, and df did not move</h3>
${suCo('en', [
  '"I removed the huge log file but the disk is still full." <code>df</code> says 31 MB used, <code>du</code> finds 4 KB.',
  '<code>lsof +L1</code> lists files with link count 0 that are still open: <code>python3 … 3w … app.log (deleted)</code>.',
  'A file is freed when its last <strong>name</strong> and its last <strong>open descriptor</strong> are gone. <code>rm</code> removed the name; the app still holds fd 3 and keeps writing into a file nobody can see.',
  'Truncate through the descriptor (<code>: &gt; /proc/PID/fd/3</code>) or restart the process. Next time, truncate instead of deleting a live log.',
  'Rotate logs with tools that tell the app or use copytruncate (lesson 2.6); Docker’s own logs need <code>max-size</code>. The VPS cleanup job truncates oversized container logs with <code>truncate -s 0</code> — never <code>rm</code> — for exactly this reason.',
])}
${src('ch02/ghi-log.py', 'python')}
${run('c24-disk', 'mkdir -p /mnt/vps/log', 2)}
${run('c24-disk', 'rm /mnt/vps/log/app.log', 4)}
${run('c24-disk', ': >', 1)}
<p><code>NLINK 0</code> with <code>SIZE/OFF 31457280</code>: 30 MB held by a file that has no name. <code>/proc/PID/fd/3</code> still points to it with the word <code>(deleted)</code>, and writing an empty string through that link truncates the very file the process holds — 31 MB back, without restarting the app.</p>

${lab('sysmon', 'diskfull', 'en', 'A log fills the disk on a live box: rm the log while the app still holds it and df does not move; find it with lsof +L1, then truncate.')}
<h3>Incident: "No space left on device" with 85% of the disk free</h3>
${suCo('en', [
  'Creating any file fails with <code>No space left on device</code>, yet <code>df -h</code> shows 15% used.',
  '<code>df -i</code>: <code>IUse% 100%</code>. Counting files per folder finds one folder with thousands of tiny files.',
  'Every file needs an inode; the filesystem has a fixed number, set when it was formatted. Millions of tiny files (session files, cache thumbnails, mail queues, <code>node_modules</code>) run out of inodes long before bytes.',
  'Delete the tiny files that are safe to lose (expired sessions, caches); then <code>df -i</code> recovers immediately.',
  'Keep sessions and caches in Redis/a database instead of one-file-per-item; schedule cleanup (<code>find -mtime +N -delete</code>, systemd-tmpfiles); format data disks with more inodes (<code>mkfs.ext4 -i</code>) if you truly need many small files.',
])}
${run('c24-disk', 'mkdir /mnt/vps/sessions', 4)}
${run('c24-disk', 'for d in /mnt/vps', 2)}
<p>2 034 tiny session files used every inode: 8.2 MB of data, 100% of inodes, and even <code>touch deploy.lock</code> fails. Deleting them gave back 2 034 inodes at once.</p>

<h3>Writes that half-succeed</h3>
${run('c24-disk', 'dd if=/dev/zero of=/mnt/vps/log/big')}
<p>When the disk fills in the middle of a write, the program gets an error — but the half-written file stays: 20 MB of a 40 MB file. Any code that writes files must check every write's result and clean up the partial file; any script must check exit codes (<code>set -e</code>). Root also went past the 5% reserve here (<code>Avail 0</code>, 100%).</p>

<h3>Slow I/O: reading iostat -x</h3>
<p>Disk trouble is not only "full". In lesson 2.1 the backup job made the disk <em>slow</em>; the columns that showed it:</p>
${run('c21-triage', 'iostat -dxyz')}
<table>
<tr><th>Column</th><th>Meaning</th><th>Worry when</th></tr>
<tr><td><code>r/s</code>, <code>w/s</code>, <code>wkB/s</code></td><td>requests and throughput</td><td>close to what the disk can do</td></tr>
<tr><td><code>w_await</code> (<code>r_await</code>)</td><td>average ms per request, queue time included — what your app feels</td><td>tens of ms on an SSD (here 175 ms)</td></tr>
<tr><td><code>aqu-sz</code></td><td>average number of requests waiting or in service — saturation</td><td>consistently above ~1 per device queue</td></tr>
<tr><td><code>%util</code></td><td>time the device had at least one request</td><td>near 100% on a single old disk; on SSDs and virtual disks it can read 100% with room left, so trust <code>await</code> and <code>aqu-sz</code> more</td></tr>
</table>
${lab('sysmon', 'iostorm', 'en', 'An I/O storm: load high while the CPUs are idle, tasks in D state, await climbing. Find the writer and calm it with ionice -c3.')}
<p>To find <em>who</em> does the I/O, use <code>pidstat -d 1</code> (per-process kB read/written per second) — or <code>iotop</code> where it is installed.</p>

<div class="pitfall co-tieu-de">
<p><strong><code>docker system prune --volumes</code> to "free space fast".</strong> Volumes are where databases keep their data. The prune that saved the VPS on 03/07 was deliberately run <em>without</em> <code>--volumes</code>. Prune images and build cache; delete volumes one by one, by name, after checking nothing uses them.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>Deleting a live log with <code>rm</code>.</strong> The space comes back only when the writer closes the file. Use <code>truncate -s 0 file</code> (or <code>: &gt; file</code>), and confirm with <code>lsof +L1</code> that nothing deleted is still held open.</p>
</div>

<h3>If you have done Linux &amp; Bash 10.1</h3>
<p>That lesson covered <code>df</code>/<code>du</code> and cleaning a full disk at the command level. This one adds what the kernel is doing — inodes, reserved blocks, the name-versus-descriptor rule — and the order in which a database fails.</p>
${L(LNX('lnx-10-1-dia-day'), '🐧', 'Linux &amp; Bash · 10.1 — A full disk', 'df, du and cleaning up at the command level.', 'Open')}

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> the API returns 500 on every write, and the on-call message says "No space left on device" — but <code>df -h</code> looks fine. You must find which of the three disk-full kinds it is.</p>
<ol>
<li>In a privileged lab container build a small disk: <code>truncate -s 64M /tmp/d.img &amp;&amp; mkfs.ext4 -q -N 2048 /tmp/d.img &amp;&amp; mkdir /mnt/d &amp;&amp; mount -o loop /tmp/d.img /mnt/d</code>.</li>
<li>Kind 1: fill it with a file and find it with <code>du -xh --max-depth=1 /mnt/d | sort -h</code>.</li>
<li>Kind 2: start <code>ghi-log.py /mnt/d/app.log</code>, <code>rm</code> the log, show <code>df</code> vs <code>du</code>, find it with <code>lsof +L1</code>, free it through <code>/proc/PID/fd</code>.</li>
<li>Kind 3: create small files until it fails; show <code>df -h</code> vs <code>df -i</code>; count per folder; clean up.</li>
</ol>
<p><strong>Done when:</strong> for each kind you have the one command whose output proves it (<code>du</code> / <code>lsof +L1</code> / <code>df -i</code>) and the "after" output showing the space or inodes back — and you unmounted the test disk (<code>umount /mnt/d</code>).</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['df vs du', 'df asks the filesystem how many blocks are used; du adds up the files it can find by name. They disagree when deleted files are still open.'],
  ['inode', 'The on-disk record of one file or directory; a filesystem has a fixed number of them.'],
  ['reserved blocks', 'ext4 keeps 5% of blocks for root so the system can still be repaired when users fill the disk.'],
  ['deleted-but-open', 'A file whose name is gone but which a process still holds; its space returns only when the last fd closes.'],
  ['sparse file', 'A file whose apparent size (ls) is larger than the blocks it really uses (du) — like Docker Desktop’s VM disk.'],
  ['await · aqu-sz', 'Average time per I/O including queueing · average number of I/Os in flight — latency and saturation of a disk.'],
  ['build cache', 'Docker’s stored build layers: rebuildable, so the first thing to prune when a disk fills.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A full disk kills databases first: Postgres PANICs, fails recovery and crash-loops until space is freed — the data survives if you free the <em>right</em> things.</li>
<li><code>df -h</code> for space, <code>df -i</code> for inodes, <code>du -xh --max-depth=1 | sort -h</code> to find the culprit, <code>docker system df</code> for Docker.</li>
<li>df ≫ du ⇒ deleted-but-open: <code>lsof +L1</code>, then truncate through <code>/proc/PID/fd</code> or restart.</li>
<li>"No space" with free bytes ⇒ inodes; tiny files belong in Redis/a DB or need a cleanup timer.</li>
<li>Slow disk: watch <code>await</code> and <code>aqu-sz</code> in <code>iostat -x</code>; <code>pidstat -d</code> names the process.</li>
</ul>
${L('https://www.postgresql.org/docs/17/diskusage.html', '🐘', 'PostgreSQL 17 — Monitoring disk usage', 'Includes “Disk full failure”: what Postgres does when the data disk or the WAL disk fills.', 'Open')}
${L('https://man7.org/linux/man-pages/man8/lsof.8.html', '📄', 'man 8 lsof', 'Including +L1 for open files that have been unlinked.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Khi đĩa đầy, cơ sở dữ liệu là thứ chết đầu tiên</h2>
<p class="lead">"No space left on device" là sự cố phổ biến nhất của một dự án nhỏ tự vận hành — dự án này đã dính năm lần trên VPS và nhiều lần trên máy Mac phát triển. Và đầy đĩa có nhiều lớp vỏ: một ổ đầy mà <code>du</code> chẳng tìm thấy gì, một ổ báo "hết chỗ" trong khi <code>df</code> còn trống 85%. Bài này dựng lại từng kiểu trên một ổ đĩa vứt đi tí hon (một file ext4 64–96 MB gắn qua loop device — không bao giờ là đĩa thật) và dạy các lệnh giúp phân biệt chúng.</p>
${lab('latency', 'default', 'vi', 'Đĩa là chặng chậm nhất trước mạng. Khi tiến trình xếp hàng chờ nó, CPU ngồi iowait và mọi thứ phía trên đĩa — cơ sở dữ liệu đầu tiên — chậm lại hoặc dừng hẳn.')}

<h3>df: từng hệ thống file đầy tới đâu</h3>
${run('c24-disk', 'df -h /mnt/vps')}
${run('c24-disk', 'df -i /mnt/vps')}
${run('c24-disk', 'tune2fs -l')}
<p>Một file 64 MB định dạng ext4 hiện <code>Size 60M</code> (phần còn lại là siêu dữ liệu) nhưng <code>Avail</code> chỉ 55M: ext4 <strong>giữ lại 5%</strong> số khối (ở đây 819 × 4 KB) cho root, để root vẫn đăng nhập và dọn được khi người dùng đã lấp đầy đĩa. Hãy nhớ: một cơ sở dữ liệu chạy bằng người dùng <code>postgres</code> sẽ dính "hết chỗ" khi <code>df</code> vẫn còn vài phần trăm; còn tiến trình root thì ăn được cả phần dự trữ. <code>df -i</code> đếm thứ khác: <strong>inode</strong>, mỗi file hay thư mục một cái — ở đây 2 048, cố tình chọn nhỏ.</p>

<h3>Sự cố: build cache làm đầy đĩa, Postgres chết</h3>
${suCo('vi', [
  '03/07/2026: deploy hỏng ở bước kéo ảnh với <code>no space left on device</code>; mọi route API dùng cơ sở dữ liệu trả 500 với lỗi Prisma <code>FATAL: the database system is not yet accepting connections</code>; trang chủ vẫn trả 200.',
  '<code>df -h /</code>: <code>39G 38G 0 100%</code>. <code>docker system df</code>: ảnh ≈ 19 GB, build cache ≈ 4,5 GB. <code>docker ps</code>: postgres <code>Up (unhealthy)</code>.',
  'Postgres dùng chung đĩa gốc với <code>/var/lib/docker</code>. Ảnh cũ và build cache phình theo mỗi lần deploy cho tới khi hết sạch chỗ; Postgres không ghi được WAL, sập, và không phục hồi xong được.',
  '<code>docker system prune -af &amp;&amp; docker builder prune -af</code> (lấy lại ~10 GB, 100% → 71% — KHÔNG BAO GIỜ kèm <code>--volumes</code>, cờ đó xoá volume của cơ sở dữ liệu); <code>docker restart</code> postgres → khoẻ lại chưa tới một phút; chạy lại lần deploy hỏng.',
  'Job dọn hằng tuần — về sau được sửa để quyết định theo <em>dung lượng trống</em> chứ không theo tuổi, và xoá các ảnh deploy cũ <em>có tag</em>, chỉ giữ 3; việc build dời khỏi VPS (ở đó không còn build cache); cảnh báo ở 85%.',
])}
<p>Nó quay lại bốn lần nữa, lần nào cũng dạy thêm một điều: 12/07 (đầy 86%, <code>next build</code> chạm 100% khi ghi cache — build hỏng trước bước tráo ảnh, nên production sống sót); 18/08 (build cache phình tới 7,6 GB trên chính đĩa chứa Postgres; đĩa tụt còn 1,8 GB giữa một lần build); 27/08 (còn 509 MB trên 49 GB: mỗi lần deploy gắn tag ảnh theo mã commit, nên ảnh cũ là ảnh <em>có tag</em>, mà <code>docker image prune -f</code> chỉ xoá ảnh không tag); 05/09 (97%, job hằng tuần chạy "xanh" và giải phóng 0 byte — 40 ảnh có tag giữ 27,66 GB). Giờ dựng lại: Postgres 17 với dữ liệu trên một đĩa ext4 96 MB, và một "build cache" do root ghi lên cùng đĩa đó.</p>
${run('c24-pg', 'docker run -d --name os-c24-pg', 3)}
${run('c24-pg', "docker exec os-c24-pg bash -c 'mkdir")}
${run('c24-pg', 'docker exec os-c24-pg psql -U postgres -c "insert into orders(note) select', 2)}
<p>Triệu chứng đầu tiên: ghi thất bại với <code>could not extend file … No space left on device</code>. Tiến trình cơ sở dữ liệu vẫn sống, nên ứng dụng trông như còn sống một nửa: mọi thao tác ghi đều hỏng. Rồi Postgres phải ghi một checkpoint:</p>
${run('c24-pg', 'docker exec os-c24-pg psql -U postgres -c "checkpoint"', 4)}
<p>Đọc các dòng log theo thứ tự: tiến trình checkpointer <code>PANIC</code> (Postgres từ chối chạy tiếp khi không lưu được dữ liệu — đó là quyết định đúng), postmaster giết mọi backend (<code>terminated by signal 6: Aborted</code>), thử phục hồi tự động, bước phục hồi không tạo nổi file WAL mới (<code>FATAL: could not write to file "pg_wal/xlogtemp…"</code>), và nó tắt. <code>--restart unless-stopped</code> của Docker bật nó lại, nó không ghi nổi cả file khoá, và container nằm ở <code>Restarting (1)</code>; <code>docker exec</code> từ chối. Chính sách khởi động lại không chữa được đĩa đầy. Cách chữa là chỗ trống:</p>
${run('c24-pg', 'docker stop os-c24-pg', 4)}
<p><code>du</code> gọi tên kẻ chiếm chỗ (44 MB "build cache" bên cạnh 40 MB cơ sở dữ liệu), ta xoá thứ dựng lại được, Postgres chạy lại WAL (<code>redo done</code>) và đủ cả 20 000 dòng. Đó cũng là lý do bạn <strong>không bao giờ xoá file trong thư mục cơ sở dữ liệu</strong> để lấy chỗ: chỗ trống phải đến từ những thứ sinh lại được — cache, ảnh cũ, log cũ.</p>
<p><code>docker system df</code> cho bạn biết gì, trên chính máy Mac soạn khoá học này:</p>
${run('c24-host', 'docker system df')}
<p><code>SIZE</code> là dung lượng mỗi loại đối tượng chiếm; <code>RECLAIMABLE</code> là phần hiện không có gì dùng (ảnh không container nào chạy, container đã dừng, volume không ai gắn, build cache). <code>ACTIVE</code> đếm những cái đang được dùng. Lấy lại bằng lệnh <code>prune</code> tương ứng — và đọc kỹ nó sẽ xoá gì trước đã.</p>

<h3>Sự cố: máy Mac phát triển đầy đĩa, Docker Desktop treo</h3>
${suCo('vi', [
  '27/10/2026 khoảng 19:15: Claude Code báo <code>ENOSPC</code> và không chạy nổi lệnh nào; một job đăng bài chết. 28/10: máy Mac còn 1,4 GB và Docker Desktop ngừng phản hồi.',
  '<code>df -h /System/Volumes/Data</code>; <code>du -sh</code> lên các nghi phạm quen mặt: thư mục video, <code>$TMPDIR</code>, <code>node_modules/.cache</code>, file đĩa của Docker.',
  'Những file trung gian không ai xoá: 235 video bài giảng bản nén (≈ 25 GB) để lại sau khi đã tải lên; mỗi lượt render video để lại một bundle ~12 GB trong <code>$TMPDIR</code>; một cache webpack đã phình tới 109 GB; file đĩa máy ảo của Docker 46 GB.',
  'Xoá những gì đã tải lên rồi hoặc dựng lại được (có sự đồng ý của chủ máy); dọn <code>$TMPDIR/remotion-*</code> giữa các lượt render.',
  'Quy trình tự xoá file trung gian sau khi đã kiểm chứng tải lên xong; kiểm <code>df</code> trước mỗi việc dài và báo động khi dưới 20 GB.',
])}
${run('c24-host', 'df -h')}
${run('c24-host', 'ls -lh', 2)}
<p>Docker Desktop giữ toàn bộ ổ đĩa của máy ảo Linux trong một <strong>file thưa (sparse file)</strong>: <code>ls</code> báo kích thước tối đa của nó (926 GB — lớn hơn cả 39 GB đang trống!), <code>du</code> báo số khối thật sự dùng (47 GB). Prune bên trong Docker giải phóng chỗ <em>bên trong</em> máy ảo; file trên Mac phải một lúc sau mới trả lại. Khi đĩa Mac đầy, đĩa của máy ảo cũng không lớn thêm được — Docker Desktop treo là vì thế.</p>

<h3>Tìm xem ai đang chiếm chỗ: du</h3>
${run('c24-disk', 'du -xh --max-depth=1')}
<p><code>du</code> đi qua các file bạn còn thấy được và cộng số khối của chúng; <code>-x</code> ở yên trên một hệ thống file, <code>--max-depth=1</code> cho mỗi thư mục cấp một một dòng, <code>sort -h</code> hiểu K/M/G. Lặp lại thêm một cấp trong thư mục lớn nhất tới khi gặp thủ phạm. Trên máy chủ thật, <code>ncdu -x /</code> làm đúng việc đó theo kiểu tương tác (phím mũi tên để đi xuống, <code>d</code> để xoá) — hãy cài nó trước khi cần, vì đĩa đã đầy có thể từ chối cài thêm bất cứ thứ gì.</p>

<h3>Sự cố: đã xoá file log 30 MB mà df không nhúc nhích</h3>
${suCo('vi', [
  '"Mình xoá file log to đùng rồi mà đĩa vẫn đầy." <code>df</code> báo dùng 31 MB, <code>du</code> chỉ tìm thấy 4 KB.',
  '<code>lsof +L1</code> liệt kê các file có số liên kết 0 mà vẫn đang mở: <code>python3 … 3w … app.log (deleted)</code>.',
  'Một file chỉ được giải phóng khi <strong>cái tên</strong> cuối cùng và <strong>file descriptor</strong> cuối cùng của nó đều đã mất. <code>rm</code> xoá cái tên; ứng dụng vẫn giữ fd 3 và cứ ghi tiếp vào một file không ai nhìn thấy.',
  'Cắt file qua chính descriptor đó (<code>: &gt; /proc/PID/fd/3</code>) hoặc khởi động lại tiến trình. Lần sau, hãy cắt (truncate) thay vì xoá một file log đang sống.',
  'Xoay vòng log bằng công cụ biết báo cho ứng dụng hoặc dùng copytruncate (bài 2.6); log của chính Docker cần <code>max-size</code>. Job dọn VPS cắt log container quá cỡ bằng <code>truncate -s 0</code> — không bao giờ <code>rm</code> — chính vì lý do này.',
])}
${src('ch02/ghi-log.py', 'python')}
${run('c24-disk', 'mkdir -p /mnt/vps/log', 2)}
${run('c24-disk', 'rm /mnt/vps/log/app.log', 4)}
${run('c24-disk', ': >', 1)}
<p><code>NLINK 0</code> với <code>SIZE/OFF 31457280</code>: 30 MB bị giữ bởi một file không còn tên. <code>/proc/PID/fd/3</code> vẫn trỏ tới nó kèm chữ <code>(deleted)</code>, và ghi một chuỗi rỗng qua đường dẫn đó sẽ cắt đúng cái file mà tiến trình đang giữ — lấy lại 31 MB, không cần khởi động lại ứng dụng.</p>

${lab('sysmon', 'diskfull', 'vi', 'Một file log làm đầy đĩa trên máy đang chạy: rm file log khi ứng dụng còn giữ nó thì df không nhúc nhích; tìm bằng lsof +L1, rồi truncate.')}
<h3>Sự cố: "No space left on device" khi đĩa còn trống 85%</h3>
${suCo('vi', [
  'Tạo bất kỳ file nào cũng hỏng với <code>No space left on device</code>, vậy mà <code>df -h</code> mới dùng 15%.',
  '<code>df -i</code>: <code>IUse% 100%</code>. Đếm số file theo từng thư mục thấy một thư mục chứa hàng nghìn file tí hon.',
  'File nào cũng cần một inode; hệ thống file có một số lượng cố định, chốt lúc định dạng. Hàng triệu file tí hon (file session, ảnh thu nhỏ trong cache, hàng đợi thư, <code>node_modules</code>) cạn inode từ lâu trước khi cạn byte.',
  'Xoá những file tí hon mất cũng không sao (session hết hạn, cache); <code>df -i</code> hồi lại ngay.',
  'Để session và cache trong Redis/cơ sở dữ liệu thay vì mỗi mục một file; hẹn giờ dọn (<code>find -mtime +N -delete</code>, systemd-tmpfiles); định dạng đĩa dữ liệu với nhiều inode hơn (<code>mkfs.ext4 -i</code>) nếu thật sự cần rất nhiều file nhỏ.',
])}
${run('c24-disk', 'mkdir /mnt/vps/sessions', 4)}
${run('c24-disk', 'for d in /mnt/vps', 2)}
<p>2 034 file session tí hon dùng hết mọi inode: 8,2 MB dữ liệu, 100% inode, và đến <code>touch deploy.lock</code> cũng hỏng. Xoá chúng đi trả lại ngay 2 034 inode.</p>

<h3>Những lần ghi thành công một nửa</h3>
${run('c24-disk', 'dd if=/dev/zero of=/mnt/vps/log/big')}
<p>Khi đĩa đầy giữa chừng một lần ghi, chương trình nhận lỗi — nhưng file viết dở thì ở lại: 20 MB của một file 40 MB. Mã nào ghi file cũng phải kiểm kết quả từng lần ghi và dọn file dở dang; script nào cũng phải kiểm mã thoát (<code>set -e</code>). Ở đây root còn ăn lấn qua cả phần dự trữ 5% (<code>Avail 0</code>, 100%).</p>

<h3>I/O chậm: đọc iostat -x</h3>
<p>Rắc rối ở đĩa không chỉ là "đầy". Ở bài 2.1 job sao lưu làm đĩa <em>chậm</em>; các cột đã cho thấy điều đó:</p>
${run('c21-triage', 'iostat -dxyz')}
<table>
<tr><th>Cột</th><th>Nghĩa</th><th>Đáng lo khi</th></tr>
<tr><td><code>r/s</code>, <code>w/s</code>, <code>wkB/s</code></td><td>số yêu cầu và thông lượng</td><td>gần mức đĩa làm được</td></tr>
<tr><td><code>w_await</code> (<code>r_await</code>)</td><td>số ms trung bình mỗi yêu cầu, tính cả thời gian xếp hàng — thứ ứng dụng của bạn cảm thấy</td><td>hàng chục ms trên SSD (ở đây 175 ms)</td></tr>
<tr><td><code>aqu-sz</code></td><td>số yêu cầu trung bình đang chờ hoặc đang được phục vụ — độ bão hoà</td><td>đều đặn trên khoảng 1 mỗi hàng đợi thiết bị</td></tr>
<tr><td><code>%util</code></td><td>thời gian thiết bị có ít nhất một yêu cầu</td><td>gần 100% trên một ổ cũ đơn lẻ; với SSD và đĩa ảo nó có thể báo 100% mà vẫn còn sức, nên tin <code>await</code> và <code>aqu-sz</code> hơn</td></tr>
</table>
${lab('sysmon', 'iostorm', 'vi', 'Một cơn bão I/O: load cao trong khi CPU rảnh, tác vụ ở trạng thái D, await tăng vọt. Tìm kẻ ghi và hãm nó bằng ionice -c3.')}
<p>Để tìm <em>ai</em> đang làm I/O, dùng <code>pidstat -d 1</code> (kB đọc/ghi mỗi giây theo từng tiến trình) — hoặc <code>iotop</code> nếu máy có cài.</p>

<div class="pitfall co-tieu-de">
<p><strong><code>docker system prune --volumes</code> để "giải phóng nhanh".</strong> Volume là nơi cơ sở dữ liệu giữ dữ liệu. Lần prune cứu VPS ngày 03/07 được chạy cố ý <em>không có</em> <code>--volumes</code>. Prune ảnh và build cache; còn volume thì xoá từng cái, theo tên, sau khi đã kiểm không có gì dùng tới.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>Xoá file log đang sống bằng <code>rm</code>.</strong> Chỗ trống chỉ quay về khi tiến trình ghi đóng file. Hãy dùng <code>truncate -s 0 file</code> (hoặc <code>: &gt; file</code>), và xác nhận bằng <code>lsof +L1</code> rằng không còn file đã xoá nào bị giữ mở.</p>
</div>

<h3>Nếu bạn đã học Linux &amp; Bash 10.1</h3>
<p>Bài đó dạy <code>df</code>/<code>du</code> và dọn một ổ đầy ở mức lệnh. Bài này thêm phần nhân đang làm gì — inode, khối dự trữ, quy tắc tên-và-descriptor — và thứ tự một cơ sở dữ liệu gục ngã.</p>
${L(LNX('lnx-10-1-dia-day'), '🐧', 'Linux &amp; Bash · 10.1 — Đĩa đầy', 'df, du và dọn dẹp ở mức lệnh.', 'Mở')}

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> API trả 500 với mọi thao tác ghi, và tin nhắn trực báo "No space left on device" — nhưng <code>df -h</code> trông vẫn ổn. Bạn phải tìm ra nó thuộc kiểu đầy đĩa nào trong ba kiểu.</p>
<ol>
<li>Trong một container lab privileged, dựng một ổ nhỏ: <code>truncate -s 64M /tmp/d.img &amp;&amp; mkfs.ext4 -q -N 2048 /tmp/d.img &amp;&amp; mkdir /mnt/d &amp;&amp; mount -o loop /tmp/d.img /mnt/d</code>.</li>
<li>Kiểu 1: lấp đầy bằng một file và tìm nó bằng <code>du -xh --max-depth=1 /mnt/d | sort -h</code>.</li>
<li>Kiểu 2: chạy <code>ghi-log.py /mnt/d/app.log</code>, <code>rm</code> file log, cho thấy <code>df</code> lệch <code>du</code>, tìm ra bằng <code>lsof +L1</code>, giải phóng qua <code>/proc/PID/fd</code>.</li>
<li>Kiểu 3: tạo file nhỏ tới khi hỏng; cho thấy <code>df -h</code> so với <code>df -i</code>; đếm theo thư mục; dọn.</li>
</ol>
<p><strong>Đạt khi:</strong> với mỗi kiểu bạn có đúng một lệnh mà output chứng minh nó (<code>du</code> / <code>lsof +L1</code> / <code>df -i</code>) và output "sau khi sửa" cho thấy chỗ trống hoặc inode đã quay lại — và bạn đã gỡ ổ thử (<code>umount /mnt/d</code>).</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['df vs du', 'df hỏi hệ thống file đã dùng bao nhiêu khối; du cộng các file nó tìm được theo tên. Hai bên lệch nhau khi file đã xoá vẫn đang mở.'],
  ['inode', 'Bản ghi trên đĩa của một file hay thư mục; một hệ thống file có số lượng cố định.'],
  ['reserved blocks (khối dự trữ)', 'ext4 giữ 5% số khối cho root để vẫn sửa được hệ thống khi người dùng lấp đầy đĩa.'],
  ['deleted-but-open (đã xoá nhưng còn mở)', 'File đã mất tên nhưng còn tiến trình giữ; chỗ của nó chỉ quay về khi fd cuối cùng đóng.'],
  ['sparse file (file thưa)', 'File có kích thước biểu kiến (ls) lớn hơn số khối thật sự dùng (du) — như đĩa máy ảo của Docker Desktop.'],
  ['await · aqu-sz', 'Thời gian trung bình mỗi I/O tính cả xếp hàng · số I/O trung bình đang chạy — độ trễ và độ bão hoà của đĩa.'],
  ['build cache', 'Các lớp build Docker lưu lại: dựng lại được, nên là thứ đầu tiên đem prune khi đĩa đầy.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đĩa đầy giết cơ sở dữ liệu trước tiên: Postgres PANIC, phục hồi thất bại và khởi động lại vô tận tới khi có chỗ — dữ liệu còn nguyên nếu bạn giải phóng <em>đúng</em> thứ.</li>
<li><code>df -h</code> cho dung lượng, <code>df -i</code> cho inode, <code>du -xh --max-depth=1 | sort -h</code> để tìm thủ phạm, <code>docker system df</code> cho Docker.</li>
<li>df ≫ du ⇒ file đã xoá nhưng còn mở: <code>lsof +L1</code>, rồi cắt qua <code>/proc/PID/fd</code> hoặc khởi động lại.</li>
<li>"Hết chỗ" khi còn byte trống ⇒ inode; file tí hon nên nằm trong Redis/cơ sở dữ liệu hoặc cần hẹn giờ dọn.</li>
<li>Đĩa chậm: nhìn <code>await</code> và <code>aqu-sz</code> trong <code>iostat -x</code>; <code>pidstat -d</code> gọi tên tiến trình.</li>
</ul>
${L('https://www.postgresql.org/docs/17/diskusage.html', '🐘', 'PostgreSQL 17 — Theo dõi dung lượng đĩa', 'Có mục “Disk full failure”: Postgres làm gì khi đĩa dữ liệu hoặc đĩa WAL bị đầy.', 'Mở')}
${L('https://man7.org/linux/man-pages/man8/lsof.8.html', '📄', 'man 8 lsof', 'Gồm cả +L1 cho các file đang mở đã bị xoá tên.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 2.5 — Mạng và file descriptor ───────────────────────── */
    {
      title: '2.5 — Ports and file descriptors: ss, lsof, EADDRINUSE and EMFILE|||2.5 — Cổng và file descriptor: ss, lsof, EADDRINUSE và EMFILE',
      slug: 'os-2-5-mang-fd',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Đọc ss -tulpn và ss -s; ai giữ cổng (ss, lsof, fuser) và sự cố thật "giết theo cổng" khi Next.js tự đổi tên tiến trình thành next-server — kể cả lsof trên Linux cũng bỏ sót; TIME_WAIT và dải cổng tạm; rò rỉ file descriptor tới EMFILE, giới hạn mềm/cứng và vì sao Node tự nâng giới hạn mềm.',
      content: `${G25}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2>Who holds the port, who holds the files</h2>
<p class="lead">Two errors every backend developer meets: <code>listen EADDRINUSE: address already in use :::3000</code> and <code>EMFILE: too many open files</code>. Both are about the same kernel object — the file descriptor, which for a network server is also how it holds its port. This lesson reads the socket table with <code>ss</code>, finds the owner of a port three ways (one of which fails in a way that bit this project), and lets a server leak descriptors until it breaks.</p>
${lab('process', 'shell', 'en', 'fork copies the parent’s file-descriptor table: a child started by your dev server inherits its sockets too — one way a port stays "in use" after you killed the process you were looking at.')}

<h3>Reading ss -tulpn</h3>
<p>A Node API on port 3000 and a Python server on 8080 that listens only on localhost:</p>
${run('c25-net', 'ss -tulpn')}
<p>Flags: <code>-t</code> TCP, <code>-u</code> UDP, <code>-l</code> listening sockets only, <code>-p</code> show the process, <code>-n</code> numbers instead of names. Columns: <code>Local Address:Port</code> <code>127.0.0.1:8080</code> accepts connections only from this machine, <code>*:3000</code> from every interface (exactly the difference between "works on my laptop" and "reachable from outside"). <code>users:(("node",pid=9,fd=18))</code> — the process and the <strong>file descriptor</strong> number that is the listening socket. On a listening socket <code>Send-Q</code> is the accept backlog (511 for Node, 5 for Python's simple server) and <code>Recv-Q</code> is how many finished connections are waiting for <code>accept()</code> — if that number stays high, the app is not keeping up.</p>

<h3>Incident: the old server keeps the port</h3>
${suCo('en', [
  '30/07/2026: after rebuilding the 3D playground the page spun forever; the fix needed a restart of Next, and the restarted server died with <code>EADDRINUSE</code> — while the <em>old</em> server, still serving stale files, stayed alive.',
  '<code>pkill -f "next start"</code> and <code>pkill -f "standalone/server.js"</code> both matched nothing. <code>ps</code> showed the process as <code>next-server (v…)</code>.',
  'Next.js renames its own process (<code>process.title</code>), overwriting the command line; patterns built from the command you typed no longer match.',
  'Kill <strong>by port</strong>: find the PID that owns the listening socket and kill that.',
  'Stop servers by port or by a PID file, not by name patterns; verify the port is free (<code>ss -ltn</code>) before starting.',
])}
${run('c25-net', 'node api.js; echo', 1, { max: 7 })}
<p>Node's own message: <code>errno: -98</code>, <code>syscall: 'listen'</code> — the kernel refused <code>bind</code>/<code>listen</code> because a socket already owns that address. Three ways to find the owner:</p>
${run('c25-net', "ss -ltnp 'sport", 1)}
${run('c25-net', 'lsof -nP -iTCP:3000', 3)}
<p>Now the twist. A stand-in for Next that renames itself exactly like Next 14 does:</p>
${src('ch02/fake-next.js', 'javascript')}
${run('c25-net', 'node fake-next.js', 7)}
<p>The name is now <code>next-server (v14.</code> (cut to the length of the original command line), so <code>pkill -f "next start"</code> — and even <code>pkill -f fake-next.js</code> — return 1, "nothing matched". And on Linux there is a second surprise: <code>lsof -ti:3000</code> also returns nothing. The <code>lsof</code> in our lab (4.99.4) skips processes whose name contains a parenthesis — we checked with titles <code>next-server</code> (found) and <code>next-server (v14)</code> (missed). <code>ss</code> reads the socket table directly and still shows the owner, and <code>fuser -k 3000/tcp</code> kills it; <code>curl exit=7</code> (connection refused) proves nothing listens any more. On macOS, <code>lsof -ti:3000</code> does see Next (lesson 2.7 shows it) — which is why "kill by port with lsof" worked on the Mac where this incident happened.</p>

<h3>ss -s and TIME_WAIT</h3>
<p>Three hundred quick requests with <code>curl</code>, each a new TCP connection:</p>
${run('c25-net', 'for i in $(seq 1 300)')}
${run('c25-net', 'ss -tan state time-wait | head', 3)}
<p>300 sockets in <code>TIME_WAIT</code>: the side that closes a TCP connection keeps it for about a minute so late packets cannot confuse a new connection on the same ports. Harmless in hundreds. But each outgoing connection also uses a local <strong>ephemeral port</strong> from <code>32768–60999</code> — about 28 000. A client that opens a fresh connection for every request to the same database or API can run out of them under load (<code>EADDRNOTAVAIL: Cannot assign requested address</code>). The fix is reuse — HTTP keep-alive and connection pools — not kernel tweaks.</p>

<h3>Incident: the API runs out of file descriptors</h3>
${suCo('en', [
  'After hours of traffic, every request that writes the audit log fails with <code>EMFILE: too many open files</code>; a restart fixes it for a while. The health check stays green.',
  '<code>ls /proc/PID/fd | wc -l</code> sits at the limit; <code>/proc/PID/limits</code>: <code>Max open files 64 64</code>; <code>lsof -p PID</code> grouped by file: the same log files open again and again.',
  'Each request opens a file and never closes it — a descriptor leak. Every file, socket, pipe and DB connection needs an fd, so at the limit the process can do nothing new.',
  'Close what you open (<code>fs.closeSync</code>, <code>try/finally</code>, or APIs that close for you); restart to recover now.',
  'Monitor the fd count per process; set realistic limits (systemd <code>LimitNOFILE=</code>, Docker <code>--ulimit nofile=</code>) — but a higher limit only delays a leak; make health checks exercise what requests use.',
])}
${src('ch02/ro-ri-fd.js', 'javascript')}
<p>First, the limits themselves. Each process has a <strong>soft</strong> limit (what applies) and a <strong>hard</strong> limit (how far it may raise the soft one without privilege):</p>
${run('c25-net', 'ulimit -n', 3)}
<p>Docker's default here is 1 048 576. In bash, <code>ulimit -Sn 64</code> lowers the soft limit to 64. But Node <strong>raises its own soft limit to the hard limit at startup</strong>, so for Node the number that matters is the hard one. To make the leak visible we lower both to 64 and send 70 requests:</p>
${run('c25-net', 'ulimit -n 64', 6)}
<p>63 descriptors open out of 64: the next <code>open()</code> fails. <code>lsof</code> grouped by file shows the leak's shape — the same audit files open about nine times each — next to Node's own pipes and sockets. And <code>/health</code> still answers <code>ok</code>, because it opens nothing; a health check that does not touch the files, the database or the disk will happily report "healthy" while every real request fails (the same lesson as the static homepage in 2.1). Raising the limit of a running process needs privilege:</p>
${run('c25-net', 'prlimit')}
<p>The real fix is in the code — one <code>closeSync</code>. Five hundred requests later the process holds 19 descriptors — the leaky version held 63 after only 70:</p>
${run('c25-net', 'kill $(pgrep -f ro-ri-fd.js)', 2)}
${run('c25-net', 'cat /proc/sys/fs/file-nr')}
<p>System-wide, <code>file-nr</code> shows open file handles (905) against the kernel maximum (effectively unlimited here). Per-process limits are what you hit in practice.</p>

<div class="pitfall co-tieu-de">
<p><strong><code>pkill -f "next start"</code> and friends.</strong> Programs may rename themselves (<code>process.title</code>), and a pattern can also match the very shell that runs it (a one-liner containing the pattern kills itself). To stop a server, use its port (<code>fuser -k 3000/tcp</code>, or the PID from <code>ss -ltnp</code>) or a PID file, then confirm with <code>ss -ltn 'sport = :3000'</code>.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>"Just raise ulimit."</strong> With a leak, a limit of 1 048 576 only turns a crash after minutes into a crash after days — and meanwhile the process holds thousands of files and sockets. Raise limits for legitimately busy servers; for a count that only grows, find the <code>open</code> without a <code>close</code>.</p>
</div>

<h3>If you have done Linux &amp; Bash 9.1</h3>
<p>That lesson introduced interfaces, ports and DNS. Here the port is followed down to the kernel: a listening socket is a file descriptor of one process, and that is why the owner can be found, why it can be inherited, and why a process can run out.</p>
${L(LNX('lnx-9-1-giao-dien-cong-dns'), '🐧', 'Linux &amp; Bash · 9.1 — Interfaces, ports, DNS', 'ip, ss and name resolution at the command level.', 'Open')}

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> your dev server will not start ("address already in use") after a crash, and in production the audit endpoint fails with EMFILE every few days.</p>
<ol>
<li>Start <code>api.js</code> twice and read the error. Find the owner with <code>ss -ltnp</code>, <code>lsof -nP -iTCP:3000 -sTCP:LISTEN</code> and <code>fuser 3000/tcp</code>; free the port.</li>
<li>Start <code>fake-next.js</code>. Show that <code>pkill -f</code> with the command you typed matches nothing, that <code>lsof -ti:3000</code> misses it, and that <code>ss</code>/<code>fuser</code> do not. Free the port by port.</li>
<li>With <code>ulimit -n 64</code>, run <code>ro-ri-fd.js</code> and send requests until EMFILE. Record the fd count and the <code>lsof</code> grouping.</li>
<li>Fix the leak (add the close), repeat 500 requests, and show that the fd count stays flat.</li>
</ol>
<p><strong>Done when:</strong> you can free a port held by a renamed process in one command, explain why the health check stayed green during EMFILE, and show a flat fd count after the fix.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['file descriptor (fd)', 'A small integer naming one open file, socket or pipe of a process; listed in /proc/PID/fd.'],
  ['listening socket', 'The socket a server binds to an address:port; its fd is what "holds the port".'],
  ['EADDRINUSE', 'bind/listen failed: another socket already owns that address and port.'],
  ['EMFILE', 'The process reached its open-file limit (RLIMIT_NOFILE); nothing new can be opened or accepted.'],
  ['soft / hard limit', 'The limit in force / the ceiling the soft limit may be raised to without privilege.'],
  ['TIME_WAIT', 'State a closed TCP connection stays in (about a minute) on the side that closed first.'],
  ['ephemeral port', 'Local port the kernel picks for an outgoing connection, from ip_local_port_range.'],
  ['Recv-Q / Send-Q', 'On a listening socket: connections waiting for accept() / the backlog size.'],
])}

<h3>📌 Summary</h3>
<ul>
<li><code>ss -tulpn</code>: what listens where, and which process and fd own it; <code>127.0.0.1</code> is local-only, <code>*</code>/<code>0.0.0.0</code> is every interface.</li>
<li>Find a port's owner with <code>ss -ltnp</code>, <code>fuser</code> or <code>lsof</code> — and know that renamed processes (Next's <code>next-server (v…)</code>) escape <code>pkill -f</code> and, on Linux, this <code>lsof</code>.</li>
<li>Hundreds of TIME_WAIT are normal; opening a new connection per request can exhaust ephemeral ports — reuse connections.</li>
<li>EMFILE = fd limit reached: count <code>/proc/PID/fd</code>, read <code>/proc/PID/limits</code>, group <code>lsof -p</code> to find the leak, fix the close.</li>
<li>Node lifts its soft fd limit to the hard limit; set the hard limit where it runs (systemd, Docker).</li>
</ul>
${L('https://man7.org/linux/man-pages/man8/ss.8.html', '📄', 'man 8 ss', 'Socket statistics: filters, states, -p, -s.', 'Open')}
${L('https://man7.org/linux/man-pages/man2/getrlimit.2.html', '📄', 'man 2 getrlimit', 'RLIMIT_NOFILE, soft and hard limits, and who may raise them.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2>Ai giữ cổng, ai giữ file</h2>
<p class="lead">Hai lỗi lập trình viên backend nào cũng gặp: <code>listen EADDRINUSE: address already in use :::3000</code> và <code>EMFILE: too many open files</code>. Cả hai cùng nói về một đối tượng của nhân — file descriptor, mà với một máy chủ mạng thì đó cũng chính là cách nó giữ cổng. Bài này đọc bảng socket bằng <code>ss</code>, tìm chủ của một cổng bằng ba cách (một cách hỏng theo đúng kiểu đã làm khổ dự án này), và để một máy chủ rò rỉ descriptor cho tới khi nó gãy.</p>
${lab('process', 'shell', 'vi', 'fork chép cả bảng file descriptor của cha: một tiến trình con mà dev server của bạn khởi chạy cũng thừa hưởng socket của nó — một lý do cổng vẫn "đang bận" sau khi bạn đã giết đúng tiến trình mình nhìn thấy.')}

<h3>Đọc ss -tulpn</h3>
<p>Một API Node ở cổng 3000 và một máy chủ Python ở 8080 chỉ nghe trên localhost:</p>
${run('c25-net', 'ss -tulpn')}
<p>Các cờ: <code>-t</code> TCP, <code>-u</code> UDP, <code>-l</code> chỉ socket đang nghe, <code>-p</code> hiện tiến trình, <code>-n</code> hiện số thay vì tên. Các cột: <code>Local Address:Port</code> <code>127.0.0.1:8080</code> chỉ nhận kết nối từ chính máy này, <code>*:3000</code> nhận từ mọi giao diện mạng (đúng chỗ khác nhau giữa "chạy được trên laptop" và "bên ngoài vào được"). <code>users:(("node",pid=9,fd=18))</code> — tiến trình và số <strong>file descriptor</strong> chính là socket đang nghe. Với socket đang nghe, <code>Send-Q</code> là cỡ hàng đợi accept (511 với Node, 5 với máy chủ đơn giản của Python) còn <code>Recv-Q</code> là số kết nối đã xong bắt tay đang chờ <code>accept()</code> — con số đó cứ cao mãi nghĩa là ứng dụng không theo kịp.</p>

<h3>Sự cố: máy chủ cũ vẫn giữ cổng</h3>
${suCo('vi', [
  '30/07/2026: sau khi dựng lại sân chơi 3D, trang quay vòng tải mãi; cách sửa cần khởi động lại Next, và máy chủ mới chết với <code>EADDRINUSE</code> — trong khi máy chủ <em>cũ</em>, vẫn phục vụ file cũ, sống nhăn.',
  '<code>pkill -f "next start"</code> và <code>pkill -f "standalone/server.js"</code> đều không khớp gì. <code>ps</code> hiện tiến trình là <code>next-server (v…)</code>.',
  'Next.js tự đổi tên tiến trình của mình (<code>process.title</code>), ghi đè lên dòng lệnh; các mẫu dựng từ lệnh bạn đã gõ không còn khớp.',
  'Giết <strong>theo cổng</strong>: tìm PID đang giữ socket nghe rồi giết đúng nó.',
  'Dừng máy chủ theo cổng hoặc theo file PID, không theo mẫu tên; kiểm cổng đã trống (<code>ss -ltn</code>) trước khi khởi động.',
])}
${run('c25-net', 'node api.js; echo', 1, { max: 7 })}
<p>Thông điệp của chính Node: <code>errno: -98</code>, <code>syscall: 'listen'</code> — nhân từ chối <code>bind</code>/<code>listen</code> vì đã có một socket sở hữu địa chỉ đó. Ba cách tìm chủ:</p>
${run('c25-net', "ss -ltnp 'sport", 1)}
${run('c25-net', 'lsof -nP -iTCP:3000', 3)}
<p>Giờ tới khúc quanh. Một bản đóng thế cho Next, tự đổi tên y như Next 14:</p>
${src('ch02/fake-next.js', 'javascript')}
${run('c25-net', 'node fake-next.js', 7)}
<p>Tên giờ là <code>next-server (v14.</code> (bị cắt theo độ dài dòng lệnh gốc), nên <code>pkill -f "next start"</code> — và đến cả <code>pkill -f fake-next.js</code> — đều trả 1, "không khớp gì". Và trên Linux còn một bất ngờ thứ hai: <code>lsof -ti:3000</code> cũng chẳng trả gì. <code>lsof</code> trong lab của ta (4.99.4) bỏ qua tiến trình có tên chứa dấu ngoặc đơn — ta đã thử với tên <code>next-server</code> (tìm thấy) và <code>next-server (v14)</code> (bỏ sót). <code>ss</code> đọc thẳng bảng socket nên vẫn hiện ra chủ, và <code>fuser -k 3000/tcp</code> giết được nó; <code>curl exit=7</code> (bị từ chối kết nối) chứng minh không còn ai nghe nữa. Trên macOS, <code>lsof -ti:3000</code> có thấy Next (bài 2.7 cho xem) — vì thế "giết theo cổng bằng lsof" đã chạy được trên chiếc Mac nơi sự cố xảy ra.</p>

<h3>ss -s và TIME_WAIT</h3>
<p>Ba trăm request nhanh bằng <code>curl</code>, mỗi cái một kết nối TCP mới:</p>
${run('c25-net', 'for i in $(seq 1 300)')}
${run('c25-net', 'ss -tan state time-wait | head', 3)}
<p>300 socket ở <code>TIME_WAIT</code>: bên đóng kết nối TCP giữ nó khoảng một phút để các gói đến trễ không làm rối một kết nối mới trên cùng cặp cổng. Vài trăm cái thì vô hại. Nhưng mỗi kết nối đi ra cũng dùng một <strong>cổng tạm (ephemeral port)</strong> từ <code>32768–60999</code> — khoảng 28 000 cổng. Một client mở kết nối mới cho mỗi request tới cùng một cơ sở dữ liệu hay API có thể cạn chúng khi tải cao (<code>EADDRNOTAVAIL: Cannot assign requested address</code>). Cách chữa là tái sử dụng — HTTP keep-alive và pool kết nối — chứ không phải chỉnh nhân.</p>

<h3>Sự cố: API cạn file descriptor</h3>
${suCo('vi', [
  'Sau vài giờ có lưu lượng, mọi request ghi nhật ký kiểm toán đều hỏng với <code>EMFILE: too many open files</code>; khởi động lại thì hết được một lúc. Health check vẫn xanh.',
  '<code>ls /proc/PID/fd | wc -l</code> đứng ngay trần; <code>/proc/PID/limits</code>: <code>Max open files 64 64</code>; <code>lsof -p PID</code> gom theo file: cùng mấy file log được mở đi mở lại.',
  'Mỗi request mở một file mà không bao giờ đóng — rò rỉ descriptor. File, socket, pipe, kết nối DB đều cần một fd, nên khi chạm trần tiến trình không làm được gì mới nữa.',
  'Đóng những gì đã mở (<code>fs.closeSync</code>, <code>try/finally</code>, hoặc các API tự đóng giùm); khởi động lại để hồi phục ngay.',
  'Theo dõi số fd của từng tiến trình; đặt giới hạn hợp lý (systemd <code>LimitNOFILE=</code>, Docker <code>--ulimit nofile=</code>) — nhưng giới hạn cao hơn chỉ hoãn một vụ rò rỉ; cho health check chạm vào những gì request thật dùng tới.',
])}
${src('ch02/ro-ri-fd.js', 'javascript')}
<p>Trước hết là chính các giới hạn. Mỗi tiến trình có một giới hạn <strong>mềm</strong> (cái đang áp dụng) và một giới hạn <strong>cứng</strong> (mức tối đa nó được tự nâng giới hạn mềm lên mà không cần đặc quyền):</p>
${run('c25-net', 'ulimit -n', 3)}
<p>Mặc định của Docker ở đây là 1 048 576. Trong bash, <code>ulimit -Sn 64</code> hạ giới hạn mềm xuống 64. Nhưng Node <strong>tự nâng giới hạn mềm của nó lên bằng giới hạn cứng ngay khi khởi động</strong>, nên với Node con số quyết định là giới hạn cứng. Để thấy rò rỉ, ta hạ cả hai xuống 64 rồi gửi 70 request:</p>
${run('c25-net', 'ulimit -n 64', 6)}
<p>63 descriptor đang mở trên 64: lần <code>open()</code> tiếp theo hỏng. <code>lsof</code> gom theo file cho thấy hình dạng vụ rò — cùng mấy file kiểm toán mở chừng chín lần mỗi cái — bên cạnh pipe và socket của chính Node. Còn <code>/health</code> vẫn trả <code>ok</code>, vì nó chẳng mở gì; một health check không chạm vào file, cơ sở dữ liệu hay đĩa sẽ vui vẻ báo "khoẻ" trong khi mọi request thật đều hỏng (cùng bài học với trang chủ tĩnh ở bài 2.1). Muốn nâng giới hạn của một tiến trình đang chạy thì cần đặc quyền:</p>
${run('c25-net', 'prlimit')}
<p>Cách sửa thật nằm trong mã — một dòng <code>closeSync</code>. Năm trăm request sau, tiến trình giữ 19 descriptor — bản rò rỉ đã giữ 63 chỉ sau 70 request:</p>
${run('c25-net', 'kill $(pgrep -f ro-ri-fd.js)', 2)}
${run('c25-net', 'cat /proc/sys/fs/file-nr')}
<p>Ở mức cả hệ thống, <code>file-nr</code> cho số file handle đang mở (905) so với mức tối đa của nhân (ở đây coi như không giới hạn). Thực tế thứ bạn chạm phải là giới hạn theo từng tiến trình.</p>

<div class="pitfall co-tieu-de">
<p><strong><code>pkill -f "next start"</code> và đồng bọn.</strong> Chương trình có thể tự đổi tên (<code>process.title</code>), và một mẫu tên còn có thể khớp với chính cái shell đang chạy nó (một lệnh một dòng chứa đúng mẫu đó sẽ tự giết mình). Để dừng một máy chủ, hãy dùng cổng của nó (<code>fuser -k 3000/tcp</code>, hoặc PID lấy từ <code>ss -ltnp</code>) hay một file PID, rồi xác nhận bằng <code>ss -ltn 'sport = :3000'</code>.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>"Cứ nâng ulimit lên."</strong> Khi có rò rỉ, giới hạn 1 048 576 chỉ biến một cú sập sau vài phút thành một cú sập sau vài ngày — mà trong lúc đó tiến trình ôm hàng nghìn file và socket. Hãy nâng giới hạn cho máy chủ bận rộn chính đáng; còn với một con số chỉ tăng, hãy tìm lệnh <code>open</code> không có <code>close</code>.</p>
</div>

<h3>Nếu bạn đã học Linux &amp; Bash 9.1</h3>
<p>Bài đó giới thiệu giao diện mạng, cổng và DNS. Ở đây cổng được lần xuống tới nhân: một socket đang nghe là một file descriptor của một tiến trình, và đó là lý do tìm được chủ của nó, nó bị thừa hưởng được, và một tiến trình có thể cạn chúng.</p>
${L(LNX('lnx-9-1-giao-dien-cong-dns'), '🐧', 'Linux &amp; Bash · 9.1 — Giao diện mạng, cổng, DNS', 'ip, ss và phân giải tên ở mức lệnh.', 'Mở')}

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> dev server không chịu khởi động ("address already in use") sau một lần sập, còn ở production endpoint kiểm toán hỏng với EMFILE vài ngày một lần.</p>
<ol>
<li>Chạy <code>api.js</code> hai lần và đọc lỗi. Tìm chủ cổng bằng <code>ss -ltnp</code>, <code>lsof -nP -iTCP:3000 -sTCP:LISTEN</code> và <code>fuser 3000/tcp</code>; giải phóng cổng.</li>
<li>Chạy <code>fake-next.js</code>. Cho thấy <code>pkill -f</code> với lệnh bạn đã gõ không khớp gì, <code>lsof -ti:3000</code> bỏ sót nó, còn <code>ss</code>/<code>fuser</code> thì không. Giải phóng cổng theo cổng.</li>
<li>Với <code>ulimit -n 64</code>, chạy <code>ro-ri-fd.js</code> và gửi request tới khi EMFILE. Ghi lại số fd và cách <code>lsof</code> gom nhóm.</li>
<li>Sửa rò rỉ (thêm lệnh đóng), lặp lại 500 request, và cho thấy số fd đứng yên.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn giải phóng được cổng do một tiến trình đã đổi tên giữ bằng đúng một lệnh, giải thích được vì sao health check vẫn xanh trong lúc EMFILE, và cho thấy số fd đứng yên sau khi sửa.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['file descriptor (fd)', 'Một số nguyên nhỏ đặt tên cho một file, socket hay pipe đang mở của tiến trình; liệt kê trong /proc/PID/fd.'],
  ['listening socket (socket đang nghe)', 'Socket máy chủ gắn vào một địa chỉ:cổng; fd của nó chính là thứ "giữ cổng".'],
  ['EADDRINUSE', 'bind/listen thất bại: đã có socket khác sở hữu địa chỉ và cổng đó.'],
  ['EMFILE', 'Tiến trình chạm giới hạn số file mở (RLIMIT_NOFILE); không mở hay nhận thêm được gì.'],
  ['soft / hard limit (giới hạn mềm / cứng)', 'Giới hạn đang áp dụng / mức trần mà giới hạn mềm được nâng tới khi không có đặc quyền.'],
  ['TIME_WAIT', 'Trạng thái một kết nối TCP đã đóng ở lại (khoảng một phút) trên phía đóng trước.'],
  ['ephemeral port (cổng tạm)', 'Cổng cục bộ nhân chọn cho một kết nối đi ra, lấy từ ip_local_port_range.'],
  ['Recv-Q / Send-Q', 'Với socket đang nghe: số kết nối chờ accept() / cỡ hàng đợi backlog.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>ss -tulpn</code>: cái gì nghe ở đâu, tiến trình và fd nào sở hữu nó; <code>127.0.0.1</code> là chỉ trong máy, <code>*</code>/<code>0.0.0.0</code> là mọi giao diện.</li>
<li>Tìm chủ cổng bằng <code>ss -ltnp</code>, <code>fuser</code> hoặc <code>lsof</code> — và nhớ rằng tiến trình đã đổi tên (<code>next-server (v…)</code> của Next) lọt khỏi <code>pkill -f</code> và, trên Linux, cả <code>lsof</code> bản này.</li>
<li>Vài trăm TIME_WAIT là bình thường; mở kết nối mới cho mỗi request có thể cạn cổng tạm — hãy tái sử dụng kết nối.</li>
<li>EMFILE = chạm trần fd: đếm <code>/proc/PID/fd</code>, đọc <code>/proc/PID/limits</code>, gom <code>lsof -p</code> để tìm rò rỉ, sửa chỗ đóng.</li>
<li>Node tự nâng giới hạn fd mềm lên bằng giới hạn cứng; hãy đặt giới hạn cứng ở nơi nó chạy (systemd, Docker).</li>
</ul>
${L('https://man7.org/linux/man-pages/man8/ss.8.html', '📄', 'man 8 ss', 'Thống kê socket: bộ lọc, trạng thái, -p, -s.', 'Mở')}
${L('https://man7.org/linux/man-pages/man2/getrlimit.2.html', '📄', 'man 2 getrlimit', 'RLIMIT_NOFILE, giới hạn mềm và cứng, và ai được nâng chúng.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 2.6 — Nhật ký ───────────────────────── */
    {
      title: '2.6 — The logs the system keeps: systemctl, journalctl, dmesg and logs that eat the disk|||2.6 — Nhật ký của hệ thống: systemctl, journalctl, dmesg và log ăn hết đĩa',
      slug: 'os-2-6-nhat-ky',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Đọc systemctl status từng dòng; dịch vụ chết vòng lặp "Start request repeated too quickly"; lọc journalctl theo dịch vụ, thời gian, mức ưu tiên; dòng OOM của nhân trong dmesg/journalctl -k; sự cố log phình không giới hạn — journald (+16 MB trong 20 giây) và Docker json-file (44 MB trong 5 giây) — sửa bằng xoay vòng; logrotate create vs copytruncate.',
      content: `${G26}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.6</span>
<h2>The logs the system keeps — and the logs that fill the disk</h2>
<p class="lead">When something died at 3 a.m., the logs are the only witness. On a Linux server there are three places to ask: <strong>systemd</strong> (<code>systemctl</code>: is the service up, how often did it restart?), the <strong>journal</strong> (<code>journalctl</code>: what did it print, and when?) and the <strong>kernel log</strong> (<code>dmesg</code>: did the kernel kill something?). And logs are themselves a classic incident: written forever, rotated never. This lesson runs a real systemd inside a throw-away container so every command below is the one you would type on a VPS.</p>
${lab('process', 'oom137', 'en', 'The kernel’s verdict leaves a trace: the OOM kill you step through here is exactly the "Killed process … (node)" line you will find with dmesg and journalctl -k.')}

<h3>systemctl status, line by line</h3>
<p>Our API (<code>api-log.js</code>: one access line per second, one database timeout every five) runs as a systemd service:</p>
${run('c26-log', 'systemctl status ctw-api')}
<table>
<tr><th>Line</th><th>What it tells you</th></tr>
<tr><td><code>Loaded: … ctw-api.service; enabled</code></td><td>Where the unit file is, and <code>enabled</code> = starts at boot.</td></tr>
<tr><td><code>Active: active (running) since … 12s ago</code></td><td>State and since when — a service that "has been up 12 s" every time you look is restarting.</td></tr>
<tr><td><code>Main PID: 127 (node)</code></td><td>The process to inspect with <code>ps</code>, <code>/proc/127</code>, <code>pidstat</code>.</td></tr>
<tr><td><code>Tasks: 7</code>, <code>Memory: 10M (max: 300M …)</code>, <code>CPU: 28ms</code></td><td>Read from the service's cgroup: threads, memory with its limit (<code>MemoryMax=</code> in the unit) and peak, CPU time.</td></tr>
<tr><td><code>CGroup:</code></td><td>Every process of the service — children included.</td></tr>
<tr><td>last lines</td><td>The 10 most recent journal lines of this unit.</td></tr>
</table>
<p>A service that keeps dying looks like this:</p>
${run('c26-log', 'systemctl --failed')}
${run('c26-log', 'journalctl -u bao-cao')}
<p>The report job points at a file that does not exist, exits 1, systemd restarts it (<code>Restart=on-failure</code>), four times, then gives up: <code>Start request repeated too quickly</code> (<code>StartLimitBurst=4</code> within 30 s) and the unit is <code>failed</code>. That protection is good — a crash loop would otherwise burn CPU and flood the log. After fixing the cause: <code>systemctl reset-failed bao-cao &amp;&amp; systemctl start bao-cao</code>.</p>

${lab('cgroup', 'restart', 'en', 'The die-and-restart loop on a timeline: each start grows until the limit kills it and the supervisor starts it again — what a service flapping between "active" and "failed" looks like from the inside.')}
<h3>journalctl: filter before you read</h3>
${run('c26-log', 'journalctl -u ctw-api --since')}
${run('c26-log', 'journalctl -u ctw-api -p err', 2)}
<ul>
<li><code>-u UNIT</code> one service · <code>--since "-30s"</code>, <code>--since "10 min ago"</code>, <code>--since "2026-10-28 18:00" --until …</code> a time window — line the logs up with the moment of the incident · <code>-n 50</code> last lines · <code>-f</code> follow live · <code>-b</code> this boot only · <code>-o short-iso</code> unambiguous timestamps with time zone.</li>
<li><code>-p err</code> shows priority 3 (err) and worse. journald only knows a line is an error if the program says so: here the app prefixes error lines with <code>&lt;3&gt;</code> (systemd's <code>SyslogLevelPrefix</code>); plain <code>console.error</code> output is logged as info. If <code>-p err</code> finds nothing, search the text: <code>journalctl -u ctw-api | grep -i error</code>.</li>
</ul>

<h3>The kernel's own log: dmesg and journalctl -k</h3>
<p>When the kernel kills a process, the process cannot log it — the kernel does. Run a program with a 64 MB memory limit as a one-off unit:</p>
${run('c26-log', 'systemd-run --unit=oom-demo', 3)}
${run('c26-log', 'journalctl -k', 2)}
<p>Three witnesses agree. systemd: <code>Result: oom-kill</code>, <code>status=9/KILL</code>. The kernel log (via <code>journalctl -k</code>, or <code>dmesg -T</code> for human-readable time): <code>Memory cgroup out of memory: Killed process 85118 (node)</code>, with <code>anon-rss:63532kB</code> — the ~64 MB it had when it died. This is the line to search for whenever something exits with 137 (lesson 2.3). Other kernel lines worth grepping: <code>segfault</code>, <code>I/O error</code>, <code>EXT4-fs error</code>, <code>blocked for more than 120 seconds</code> (a task stuck in D state).</p>

<h3>Incident: logs that grow until the disk is full</h3>
${suCo('en', [
  'Disk usage climbs every day with no deploy; the weekly VPS cleanup has a dedicated step "Truncate container logs &gt; 200MB" plus <code>journalctl --vacuum-time=7d</code>, and on 12/07/2026 vacuuming the journal was part of getting a full disk back.',
  '<code>journalctl --disk-usage</code>; for Docker, <code>docker inspect -f "{{.HostConfig.LogConfig}}"</code> shows <code>json-file map[]</code> — no size limit; <code>du</code> on the container log files.',
  'Docker’s default <code>json-file</code> driver keeps every line a container ever printed; the project’s <code>docker-compose.yml</code> sets no <code>logging:</code> options. journald keeps up to its size cap — by default 10% of the filesystem (at most 4 GB), and a chatty service fills it fast.',
  'Rotate: journald <code>SystemMaxUse=</code>/<code>MaxRetentionSec=</code>; Docker <code>max-size</code> + <code>max-file</code> per service (or in <code>daemon.json</code>); <code>logrotate</code> for plain files. Free space now with <code>journalctl --rotate</code> + <code>--vacuum-size</code>, and <code>truncate</code> — never <code>rm</code> — on live logs.',
  'Ship every service with log limits from day one; log at info, not debug, in production; alert on disk growth rate, not only on 90%.',
])}
<p><strong>journald.</strong> A "chatty" service that logs a debug line on every loop, for 20 seconds:</p>
${run('c26-log', 'journalctl --disk-usage', 1)}
${run('c26-log', 'systemctl start chatty', 4)}
<p>37 505 lines in 20 seconds took the journal from 8 MB to 24 MB — the journal stores each line with metadata (time, PID, unit, cgroup…), roughly 400+ bytes per short line. Now clean up — and notice the trap:</p>
${run('c26-log', 'journalctl --vacuum-size=10M', 4)}
<p>The first vacuum freed <strong>0 B</strong>: vacuum deletes only <em>archived</em> journal files, never the active one being written. <code>--rotate</code> archives the active file first; then the same vacuum frees 21.7 MB. To make it permanent, put limits in a drop-in file and restart journald.</p>
<p><strong>Docker json-file.</strong> The same chatty loop in a container, five seconds, default settings vs. a rotated one:</p>
${run('c26-docker', 'docker info')}
${run('c26-docker', 'docker run -d --name os-c26-chatty', 3)}
${run('c26-docker', 'docker run -d --name os-c26-rot', 4)}
<p>Default: <code>map[]</code>, no limit — 822 854 lines, 44 MB of text in five seconds (more on disk, since json-file wraps every line in JSON with a timestamp). With <code>max-size=1m max-file=3</code> Docker rotates and keeps at most three 1 MB files: <code>docker logs</code> now holds 0.9 MB, the newest lines. For a compose project, per service:</p>
${cmd('services:', '  backend:', '    logging:', '      driver: json-file', '      options:', '        max-size: "10m"', '        max-file: "3"')}
<p>Setting <code>"log-opts"</code> in <code>/etc/docker/daemon.json</code> makes it the default — but only for containers created afterwards; existing containers keep their old config until they are recreated.</p>

<h3>logrotate: create or copytruncate</h3>
<p>For apps that write their own log files, <code>logrotate</code> renames and compresses them on a timer. The default way, <code>create</code>, has a trap that connects straight back to lesson 2.4:</p>
${src('ch02/ghi-mai.py', 'python')}
${run('c26-rotate', 'mkdir -p /var/log/ctw', 5)}
<p>After rotation the new <code>app.log</code> is 0 bytes and stays 0, while <code>app.log.1</code> keeps growing: the app opened the file once, its fd follows the <strong>inode</strong>, not the name, so it writes into the renamed file. When logrotate later deletes the oldest copy, that becomes a deleted-but-open file still eating space. Two fixes: tell the app to reopen its file after rotation (<code>postrotate</code> sends a signal the app handles), or let logrotate copy then truncate in place:</p>
${run('c26-rotate', 'python3 ghi-mai.py', 4)}
<p>With <code>copytruncate</code> the app keeps writing to <code>app.log</code> (request 169 is there), the old lines went to <code>app.log.1.gz</code> (up to request 85). The cost: lines written between the copy and the truncate can be lost — acceptable for access logs, not for audit trails. On systemd machines logrotate runs from <code>logrotate.timer</code>, daily.</p>

<div class="pitfall co-tieu-de">
<p><strong>"I ran journalctl --vacuum-size and nothing was freed."</strong> Vacuum never touches the active journal file. Run <code>journalctl --rotate</code> first, then vacuum — and set <code>SystemMaxUse</code> so it never comes to this again.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>Trusting <code>-p err</code> to find all errors.</strong> Most apps print errors as ordinary lines (priority info); <code>-p err</code> only sees what was labelled as an error. Filter by unit and time first, then grep the text.</p>
</div>

<h3>If you have done Linux &amp; Bash 10.3 and 11.1</h3>
<p>Those lessons taught writing unit files and the basic journalctl flags. This one reads systemd's answers under stress — crash loops, OOM kills — and treats logs as a resource that can take the server down.</p>
${L(LNX('lnx-10-3-log-journalctl'), '🐧', 'Linux &amp; Bash · 10.3 — Logs and journalctl', 'Reading logs at the command level.', 'Open')}
${L(LNX('lnx-11-1-systemd-unit'), '🐧', 'Linux &amp; Bash · 11.1 — systemd units', 'Writing and managing services.', 'Open')}

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> the VPS disk grows ~2 GB a day without deploys, and last night the API "restarted by itself". You must find out what the logs say and stop them from eating the disk.</p>
<ol>
<li>Start the systemd lab image (<code>Dockerfile.sd</code> in the course lab) and install <code>ctw-api.service</code> and <code>bao-cao.service</code>. Read <code>systemctl status</code> of both and find the restart loop in <code>journalctl -u</code>.</li>
<li>Run the OOM one-off unit (<code>systemd-run -p MemoryMax=64M -p MemorySwapMax=0 …</code>) and find the kernel's "Killed process" line twice: <code>journalctl -k</code> and <code>dmesg -T</code>.</li>
<li>Start <code>chatty.service</code> for 20 s; measure the journal before/after; free the space with <code>--rotate</code> + <code>--vacuum-size</code>; add a <code>SystemMaxUse</code> drop-in.</li>
<li>From the host, run a chatty container without and with <code>--log-opt max-size=1m --log-opt max-file=3</code> and compare <code>docker logs … | wc -c</code>.</li>
</ol>
<p><strong>Done when:</strong> you can name why <code>bao-cao</code> failed and the restart policy that stopped it, quote the kernel's OOM line, show the journal shrinking only after <code>--rotate</code>, and show a container whose logs stay under ~3 MB however long it runs.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['unit · systemctl', 'A service (or timer, socket…) managed by systemd · the command to inspect and control units.'],
  ['journald · journalctl', 'systemd’s log collector · the command that reads and filters its journal.'],
  ['priority (mức ưu tiên)', 'Syslog level of a line: 0 emerg … 3 err … 6 info, 7 debug; -p err shows 0–3.'],
  ['StartLimitBurst', 'How many restarts systemd allows within StartLimitIntervalSec before marking a unit failed.'],
  ['dmesg / journalctl -k', 'The kernel ring buffer — OOM kills, segfaults, disk errors.'],
  ['vacuum · rotate', 'Delete old archived journal files · close the active file and start a new one.'],
  ['json-file · max-size', 'Docker’s default log driver · the option that makes it rotate.'],
  ['copytruncate', 'logrotate mode: copy the log, then truncate the original in place, so the writer needs no reopen.'],
])}

<h3>📌 Summary</h3>
<ul>
<li><code>systemctl status</code>: state and uptime, main PID, cgroup memory/CPU, last lines; <code>--failed</code> lists what gave up.</li>
<li><code>journalctl -u … --since … -p …</code>: narrow by unit, time and priority before reading.</li>
<li>Kernel kills are in the kernel log: <code>dmesg -T</code> / <code>journalctl -k</code>, look for <code>Killed process</code>.</li>
<li>Logs are a disk incident waiting to happen: journald and Docker json-file need limits; vacuum needs <code>--rotate</code> first.</li>
<li>File logs: <code>create</code> rotation leaves the app writing to the old file unless it reopens; <code>copytruncate</code> avoids that at a small risk.</li>
</ul>
${L('https://www.freedesktop.org/software/systemd/man/latest/journalctl.html', '📄', 'journalctl(1)', 'Every filter: -u, --since, -p, -k, --vacuum-*, --rotate.', 'Open')}
${L('https://docs.docker.com/engine/logging/drivers/json-file/', '🐳', 'Docker — JSON File logging driver', 'max-size, max-file and where container logs live.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.6</span>
<h2>Nhật ký hệ thống giữ lại — và những nhật ký làm đầy đĩa</h2>
<p class="lead">Khi có gì đó chết lúc 3 giờ sáng, log là nhân chứng duy nhất. Trên máy chủ Linux có ba chỗ để hỏi: <strong>systemd</strong> (<code>systemctl</code>: dịch vụ có đang chạy không, đã khởi động lại bao nhiêu lần?), <strong>journal</strong> (<code>journalctl</code>: nó đã in gì, vào lúc nào?) và <strong>log của nhân</strong> (<code>dmesg</code>: nhân có giết thứ gì không?). Và chính log cũng là một sự cố kinh điển: ghi mãi, chẳng bao giờ xoay vòng. Bài này chạy một systemd thật bên trong một container vứt đi, nên mọi lệnh dưới đây đúng là lệnh bạn sẽ gõ trên VPS.</p>
${lab('process', 'oom137', 'vi', 'Phán quyết của nhân để lại dấu vết: lần OOM kill bạn bấm qua ở đây chính là dòng "Killed process … (node)" bạn sẽ tìm thấy bằng dmesg và journalctl -k.')}

<h3>systemctl status, từng dòng</h3>
<p>API của ta (<code>api-log.js</code>: mỗi giây một dòng truy cập, cứ năm giây một lần DB hết giờ) chạy như một dịch vụ systemd:</p>
${run('c26-log', 'systemctl status ctw-api')}
<table>
<tr><th>Dòng</th><th>Nó cho bạn biết gì</th></tr>
<tr><td><code>Loaded: … ctw-api.service; enabled</code></td><td>File unit nằm ở đâu, và <code>enabled</code> = tự chạy khi khởi động máy.</td></tr>
<tr><td><code>Active: active (running) since … 12s ago</code></td><td>Trạng thái và từ lúc nào — một dịch vụ lần nào bạn nhìn cũng "mới chạy 12 giây" là đang khởi động lại liên tục.</td></tr>
<tr><td><code>Main PID: 127 (node)</code></td><td>Tiến trình để soi bằng <code>ps</code>, <code>/proc/127</code>, <code>pidstat</code>.</td></tr>
<tr><td><code>Tasks: 7</code>, <code>Memory: 10M (max: 300M …)</code>, <code>CPU: 28ms</code></td><td>Đọc từ cgroup của dịch vụ: số luồng, bộ nhớ kèm trần (<code>MemoryMax=</code> trong unit) và đỉnh, thời gian CPU.</td></tr>
<tr><td><code>CGroup:</code></td><td>Mọi tiến trình của dịch vụ — kể cả tiến trình con.</td></tr>
<tr><td>các dòng cuối</td><td>10 dòng journal mới nhất của unit này.</td></tr>
</table>
<p>Một dịch vụ cứ chết đi chết lại trông như thế này:</p>
${run('c26-log', 'systemctl --failed')}
${run('c26-log', 'journalctl -u bao-cao')}
<p>Job báo cáo trỏ tới một file không tồn tại, thoát với mã 1, systemd bật lại nó (<code>Restart=on-failure</code>), bốn lần, rồi bỏ cuộc: <code>Start request repeated too quickly</code> (<code>StartLimitBurst=4</code> trong 30 giây) và unit thành <code>failed</code>. Lớp bảo vệ đó là tốt — không có nó, một vòng lặp sập sẽ đốt CPU và làm lụt log. Sau khi sửa nguyên nhân: <code>systemctl reset-failed bao-cao &amp;&amp; systemctl start bao-cao</code>.</p>

${lab('cgroup', 'restart', 'vi', 'Vòng chết–chạy lại trên một dòng thời gian: mỗi lần chạy lại phình tới khi chạm trần thì bị giết và trình giám sát bật lại — hình dạng bên trong của một dịch vụ cứ nhảy giữa "active" và "failed".')}
<h3>journalctl: lọc trước rồi mới đọc</h3>
${run('c26-log', 'journalctl -u ctw-api --since')}
${run('c26-log', 'journalctl -u ctw-api -p err', 2)}
<ul>
<li><code>-u UNIT</code> một dịch vụ · <code>--since "-30s"</code>, <code>--since "10 min ago"</code>, <code>--since "2026-10-28 18:00" --until …</code> một khung thời gian — xếp log thẳng hàng với thời điểm sự cố · <code>-n 50</code> các dòng cuối · <code>-f</code> theo dõi trực tiếp · <code>-b</code> chỉ lần khởi động này · <code>-o short-iso</code> mốc giờ rõ ràng có múi giờ.</li>
<li><code>-p err</code> hiện mức 3 (err) và tệ hơn. journald chỉ biết một dòng là lỗi nếu chương trình nói vậy: ở đây ứng dụng thêm tiền tố <code>&lt;3&gt;</code> vào các dòng lỗi (<code>SyslogLevelPrefix</code> của systemd); output <code>console.error</code> thông thường được ghi ở mức info. Nếu <code>-p err</code> không tìm thấy gì, hãy tìm theo chữ: <code>journalctl -u ctw-api | grep -i error</code>.</li>
</ul>

<h3>Log riêng của nhân: dmesg và journalctl -k</h3>
<p>Khi nhân giết một tiến trình, tiến trình đó không ghi log được — nhân ghi. Chạy một chương trình với trần bộ nhớ 64 MB dưới dạng một unit dùng một lần:</p>
${run('c26-log', 'systemd-run --unit=oom-demo', 3)}
${run('c26-log', 'journalctl -k', 2)}
<p>Ba nhân chứng khớp nhau. systemd: <code>Result: oom-kill</code>, <code>status=9/KILL</code>. Log của nhân (qua <code>journalctl -k</code>, hoặc <code>dmesg -T</code> để có giờ dễ đọc): <code>Memory cgroup out of memory: Killed process 85118 (node)</code>, với <code>anon-rss:63532kB</code> — khoảng 64 MB nó đang giữ lúc chết. Đây là dòng cần tìm mỗi khi có thứ gì thoát với mã 137 (bài 2.3). Những dòng khác của nhân đáng grep: <code>segfault</code>, <code>I/O error</code>, <code>EXT4-fs error</code>, <code>blocked for more than 120 seconds</code> (một tác vụ kẹt ở trạng thái D).</p>

<h3>Sự cố: log phình cho tới khi đầy đĩa</h3>
${suCo('vi', [
  'Dung lượng đĩa tăng mỗi ngày dù không deploy; job dọn VPS hằng tuần có hẳn một bước "Truncate container logs &gt; 200MB" cộng <code>journalctl --vacuum-time=7d</code>, và ngày 12/07/2026 dọn journal là một phần của việc cứu một ổ đĩa đầy.',
  '<code>journalctl --disk-usage</code>; với Docker, <code>docker inspect -f "{{.HostConfig.LogConfig}}"</code> cho thấy <code>json-file map[]</code> — không có trần dung lượng; <code>du</code> lên các file log của container.',
  'Driver mặc định <code>json-file</code> của Docker giữ mọi dòng một container từng in ra; <code>docker-compose.yml</code> của dự án không đặt tuỳ chọn <code>logging:</code> nào. journald giữ tới trần của nó — mặc định 10% hệ thống file (tối đa 4 GB), và một dịch vụ lắm lời lấp đầy nó rất nhanh.',
  'Xoay vòng: journald <code>SystemMaxUse=</code>/<code>MaxRetentionSec=</code>; Docker <code>max-size</code> + <code>max-file</code> cho từng dịch vụ (hoặc trong <code>daemon.json</code>); <code>logrotate</code> cho file thường. Lấy chỗ ngay bằng <code>journalctl --rotate</code> + <code>--vacuum-size</code>, và <code>truncate</code> — không bao giờ <code>rm</code> — với log đang sống.',
  'Dịch vụ nào cũng có giới hạn log ngay từ ngày đầu; production ghi ở mức info, không phải debug; cảnh báo theo tốc độ tăng của đĩa, không chỉ khi chạm 90%.',
])}
<p><strong>journald.</strong> Một dịch vụ "lắm lời" in một dòng debug mỗi vòng lặp, trong 20 giây:</p>
${run('c26-log', 'journalctl --disk-usage', 1)}
${run('c26-log', 'systemctl start chatty', 4)}
<p>37 505 dòng trong 20 giây đưa journal từ 8 MB lên 24 MB — journal lưu mỗi dòng kèm siêu dữ liệu (giờ, PID, unit, cgroup…), khoảng hơn 400 byte cho một dòng ngắn. Giờ dọn — và để ý cái bẫy:</p>
${run('c26-log', 'journalctl --vacuum-size=10M', 4)}
<p>Lần vacuum đầu giải phóng <strong>0 B</strong>: vacuum chỉ xoá các file journal đã <em>lưu trữ</em>, không bao giờ đụng tới file đang được ghi. <code>--rotate</code> lưu trữ file đang ghi trước; rồi cùng lệnh vacuum đó giải phóng 21,7 MB. Muốn bền vững, đặt giới hạn trong một file drop-in rồi khởi động lại journald.</p>
<p><strong>Docker json-file.</strong> Cùng vòng lặp lắm lời trong container, năm giây, mặc định so với một cái có xoay vòng:</p>
${run('c26-docker', 'docker info')}
${run('c26-docker', 'docker run -d --name os-c26-chatty', 3)}
${run('c26-docker', 'docker run -d --name os-c26-rot', 4)}
<p>Mặc định: <code>map[]</code>, không giới hạn — 822 854 dòng, 44 MB chữ trong năm giây (trên đĩa còn nhiều hơn, vì json-file bọc mỗi dòng trong JSON kèm mốc giờ). Với <code>max-size=1m max-file=3</code> Docker xoay vòng và giữ tối đa ba file 1 MB: <code>docker logs</code> giờ chỉ còn 0,9 MB, những dòng mới nhất. Với một dự án compose, đặt cho từng dịch vụ:</p>
${cmd('services:', '  backend:', '    logging:', '      driver: json-file', '      options:', '        max-size: "10m"', '        max-file: "3"')}
<p>Đặt <code>"log-opts"</code> trong <code>/etc/docker/daemon.json</code> sẽ biến nó thành mặc định — nhưng chỉ cho các container tạo ra sau đó; container đang có vẫn giữ cấu hình cũ cho tới khi được tạo lại.</p>

<h3>logrotate: create hay copytruncate</h3>
<p>Với ứng dụng tự ghi file log, <code>logrotate</code> đổi tên và nén chúng theo lịch. Cách mặc định, <code>create</code>, có một cái bẫy nối thẳng về bài 2.4:</p>
${src('ch02/ghi-mai.py', 'python')}
${run('c26-rotate', 'mkdir -p /var/log/ctw', 5)}
<p>Sau khi xoay vòng, <code>app.log</code> mới có 0 byte và cứ 0 mãi, trong khi <code>app.log.1</code> tiếp tục lớn lên: ứng dụng mở file một lần, fd của nó bám theo <strong>inode</strong> chứ không theo tên, nên nó ghi vào file đã bị đổi tên. Khi logrotate về sau xoá bản cũ nhất, đó thành một file đã xoá mà còn mở, vẫn ăn chỗ. Hai cách sửa: bảo ứng dụng mở lại file sau khi xoay vòng (<code>postrotate</code> gửi một tín hiệu mà ứng dụng xử lý), hoặc để logrotate chép rồi cắt tại chỗ:</p>
${run('c26-rotate', 'python3 ghi-mai.py', 4)}
<p>Với <code>copytruncate</code> ứng dụng tiếp tục ghi vào <code>app.log</code> (request 169 nằm đó), các dòng cũ sang <code>app.log.1.gz</code> (tới request 85). Cái giá: những dòng ghi giữa lúc chép và lúc cắt có thể mất — chấp nhận được với log truy cập, không được với nhật ký kiểm toán. Trên máy dùng systemd, logrotate chạy từ <code>logrotate.timer</code>, mỗi ngày một lần.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Tôi đã chạy journalctl --vacuum-size mà chẳng giải phóng được gì."</strong> Vacuum không bao giờ đụng file journal đang ghi. Chạy <code>journalctl --rotate</code> trước, rồi mới vacuum — và đặt <code>SystemMaxUse</code> để không bao giờ phải tới mức này nữa.</p>
</div>
<div class="pitfall co-tieu-de">
<p><strong>Tin <code>-p err</code> sẽ tìm ra mọi lỗi.</strong> Phần lớn ứng dụng in lỗi như dòng bình thường (mức info); <code>-p err</code> chỉ thấy những gì đã được gắn nhãn lỗi. Lọc theo unit và thời gian trước, rồi grep theo chữ.</p>
</div>

<h3>Nếu bạn đã học Linux &amp; Bash 10.3 và 11.1</h3>
<p>Hai bài đó dạy viết file unit và các cờ cơ bản của journalctl. Bài này đọc câu trả lời của systemd khi bị dồn ép — vòng lặp sập, OOM kill — và coi log như một tài nguyên có thể đánh sập máy chủ.</p>
${L(LNX('lnx-10-3-log-journalctl'), '🐧', 'Linux &amp; Bash · 10.3 — Log và journalctl', 'Đọc log ở mức lệnh.', 'Mở')}
${L(LNX('lnx-11-1-systemd-unit'), '🐧', 'Linux &amp; Bash · 11.1 — Unit của systemd', 'Viết và quản lý dịch vụ.', 'Mở')}

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> đĩa VPS tăng ~2 GB mỗi ngày dù không deploy, và đêm qua API "tự khởi động lại". Bạn phải tìm xem log nói gì và chặn chúng ăn đĩa.</p>
<ol>
<li>Chạy ảnh lab có systemd (<code>Dockerfile.sd</code> trong lab của khoá) và cài <code>ctw-api.service</code>, <code>bao-cao.service</code>. Đọc <code>systemctl status</code> của cả hai và tìm vòng lặp khởi động lại trong <code>journalctl -u</code>.</li>
<li>Chạy unit OOM dùng một lần (<code>systemd-run -p MemoryMax=64M -p MemorySwapMax=0 …</code>) và tìm dòng "Killed process" của nhân ở hai nơi: <code>journalctl -k</code> và <code>dmesg -T</code>.</li>
<li>Chạy <code>chatty.service</code> 20 giây; đo journal trước/sau; giải phóng chỗ bằng <code>--rotate</code> + <code>--vacuum-size</code>; thêm một drop-in <code>SystemMaxUse</code>.</li>
<li>Từ máy chủ, chạy một container lắm lời không có và có <code>--log-opt max-size=1m --log-opt max-file=3</code> rồi so <code>docker logs … | wc -c</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nói được vì sao <code>bao-cao</code> hỏng và chính sách khởi động lại nào đã chặn nó, trích được dòng OOM của nhân, cho thấy journal chỉ co lại sau <code>--rotate</code>, và có một container mà log luôn dưới ~3 MB dù chạy bao lâu.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['unit · systemctl', 'Một dịch vụ (hoặc timer, socket…) do systemd quản lý · lệnh để xem và điều khiển unit.'],
  ['journald · journalctl', 'Bộ gom log của systemd · lệnh đọc và lọc journal của nó.'],
  ['priority (mức ưu tiên)', 'Mức syslog của một dòng: 0 emerg … 3 err … 6 info, 7 debug; -p err hiện 0–3.'],
  ['StartLimitBurst', 'Số lần khởi động lại systemd cho phép trong StartLimitIntervalSec trước khi đánh dấu unit là failed.'],
  ['dmesg / journalctl -k', 'Vùng đệm vòng của nhân — OOM kill, segfault, lỗi đĩa.'],
  ['vacuum · rotate', 'Xoá các file journal cũ đã lưu trữ · đóng file đang ghi và mở file mới.'],
  ['json-file · max-size', 'Driver log mặc định của Docker · tuỳ chọn khiến nó xoay vòng.'],
  ['copytruncate', 'Chế độ logrotate: chép file log rồi cắt bản gốc tại chỗ, để tiến trình ghi khỏi phải mở lại.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>systemctl status</code>: trạng thái và thời gian chạy, PID chính, bộ nhớ/CPU của cgroup, các dòng cuối; <code>--failed</code> liệt kê những gì đã bỏ cuộc.</li>
<li><code>journalctl -u … --since … -p …</code>: thu hẹp theo unit, thời gian và mức ưu tiên trước khi đọc.</li>
<li>Những lần nhân giết nằm trong log của nhân: <code>dmesg -T</code> / <code>journalctl -k</code>, tìm <code>Killed process</code>.</li>
<li>Log là một sự cố đĩa đang chờ xảy ra: journald và Docker json-file cần giới hạn; vacuum cần <code>--rotate</code> trước.</li>
<li>Log dạng file: xoay vòng kiểu <code>create</code> khiến ứng dụng ghi tiếp vào file cũ trừ khi nó mở lại; <code>copytruncate</code> tránh được điều đó với một rủi ro nhỏ.</li>
</ul>
${L('https://www.freedesktop.org/software/systemd/man/latest/journalctl.html', '📄', 'journalctl(1)', 'Mọi bộ lọc: -u, --since, -p, -k, --vacuum-*, --rotate.', 'Mở')}
${L('https://docs.docker.com/engine/logging/drivers/json-file/', '🐳', 'Docker — Driver log JSON File', 'max-size, max-file và nơi log container được lưu.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 2.7 — Đọc cùng Claude ───────────────────────── */
    {
      title: '2.7 — Read along with Claude: real sessions annotated, and the one-page cheatsheet|||2.7 — Đọc cùng Claude: phiên làm việc thật có chú thích, và bảng tra một trang',
      slug: 'os-2-7-doc-cung-claude',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bốn bản ghi lệnh đúng kiểu Claude chạy hằng ngày — kiểm đĩa máy Mac, tìm tiến trình và cổng, kiểm sức khoẻ VPS qua ssh, deploy bằng rsync rồi smoke-test — chú thích từng dòng để đọc được log của Claude; cộng bảng tra "5 phút đầu tiên khi máy chậm" theo phương pháp USE và bảng triệu chứng → lệnh cho chín sự cố của chương.',
      content: `${G27}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.7</span>
<h2>Read along with Claude</h2>
<p class="lead">"The things you do every day, I read and understand nothing" — this lesson is the answer to that sentence. Below are four transcripts of exactly the kind Claude runs while working on this project: checking the Mac's disk, finding what runs and who holds a port, checking a server over ssh, deploying with rsync and smoke-testing. Each is real output, annotated line by line. At the end: the one page to keep open when a machine is slow.</p>
${lab('process', 'sandbox', 'en', 'Build a small process tree yourself — fork, exit, wait, kill — and read the ps table after each step. Every transcript below is a ps/top/ss table like this one.')}

<h3>How to read any transcript</h3>
<ol>
<li>A line starting with <code>$</code> is a command; everything until the next <code>$</code> is its output.</li>
<li>Read the command as a <strong>question</strong> first ("how full is the disk?"). Flags change the question: <code>-h</code> human units, <code>-n</code> numbers not names, <code>-p</code> show processes.</li>
<li>Read the <strong>header row</strong>; then find the one or two numbers that answer the question. Most output is context.</li>
<li>Look for <strong>exit codes</strong> (<code>exit=…</code>, <code>echo $?</code>): 0 = fine; anything else means "read the line before".</li>
</ol>

<h3>Transcript 1 — "Is the Mac running out of disk?"</h3>
<p>Claude checks this before every long job (video renders, builds) since the Mac filled up on 27–28/10. Run on the Mac this course was written on, read-only:</p>
${run('c27-mac', 'df -h', 4)}
<table>
<tr><th>Line</th><th>What it means</th></tr>
<tr><td><code>df -h /System/Volumes/Data</code></td><td>On macOS your files live on the "Data" volume, not <code>/</code>. <code>-h</code> = GiB/MiB.</td></tr>
<tr><td><code>926Gi 847Gi 39Gi 96%</code></td><td>Size, used, <strong>available</strong>, percent. 39 GB free: above the 20 GB warning line, fine for today. macOS <code>df</code> also prints inodes (<code>iused 5.3M</code>, <code>%iused 1%</code>) — no inode problem.</td></tr>
<tr><td><code>du -sh frontend/node_modules …</code></td><td><code>-s</code> one total per argument. 1.5 GB of packages, 1.4 GB of Next build output, 750 MB backend packages — all <strong>rebuildable</strong> (<code>npm ci</code>, <code>next build</code>), so deletable in an emergency.</td></tr>
<tr><td><code>du -sh "$TMPDIR"</code> → 6.1G</td><td>The per-user temp folder, where video renders leave ~12 GB bundles. 6.1 GB today, worth a look later.</td></tr>
<tr><td><code>docker system df</code></td><td>Docker's share: 33 GB of images (11 GB reclaimable), 9.7 GB volumes, 5.7 GB build cache with 0 active. Reclaimable ≠ "delete now": volumes may hold databases.</td></tr>
</table>
<p>The decision Claude writes after this: "39 GB free, no action; largest rebuildable items listed". It does not delete anything of the owner's without asking.</p>

<h3>Transcript 2 — "What is running, and who holds the port?"</h3>
${run('c27-mac', 'pgrep -l node', 3)}
<table>
<tr><th>Line</th><th>What it means</th></tr>
<tr><td><code>pgrep -l node</code></td><td>PIDs of processes named <code>node</code>, with their names. <code>-l</code> (not <code>-fl</code>) on purpose: <code>-f</code> prints full command lines, which can contain tokens and passwords.</td></tr>
<tr><td><code>ps -axo pid,%cpu,rss,etime,comm -m</code></td><td>All processes, chosen columns, <code>-m</code> = sorted by memory (macOS). <code>RSS</code> in KB, <code>ELAPSED</code> = running for.</td></tr>
<tr><td><code>next-server (v14.2.35)</code> 1.4 GB, 15 h</td><td>A Next.js dev/preview server left running since this morning — note it renamed itself (lesson 2.5).</td></tr>
<tr><td><code>…Virtualization.VirtualMachine</code> 5.3 GB, 357% CPU</td><td>Docker Desktop's Linux VM. 357% = 3.5 cores: the containers of other jobs running inside it at that moment.</td></tr>
<tr><td><code>claude</code></td><td>Claude Code itself (≈ 1 GB).</td></tr>
<tr><td><code>lsof -nP -iTCP:3123 -sTCP:LISTEN</code></td><td>Who listens on TCP port 3123: PID 96158. The macOS <code>lsof</code> shows the executable name <code>node</code> and finds it fine — unlike the Linux <code>lsof</code> in lesson 2.5.</td></tr>
</table>
<div class="pitfall co-tieu-de">
<p><strong>A <code>pkill -f</code> that killed itself.</strong> On 26/10/2026 a clean-up script ran <code>ssh host 'pkill -f "f5-train|…"; rm -rf ~/f5-train …'</code>. The remote shell's own command line contained "f5-train" (in the <code>rm -rf</code> part), so <code>pkill -f</code> matched and killed the very shell running it: nothing was deleted, the log was empty, and the script still printed "✓ done". Found only by checking with <code>ls</code> afterwards. Rules: delete first and kill by exact name (no <code>-f</code>) or by PID; and always verify the result with a separate command.</p>
</div>

<h3>Transcript 3 — "Is the server healthy?" over ssh</h3>
<p>Two lab containers stand in for the home machine and the VPS (systemd, sshd and our API running as <code>ctw-web</code>). The commands are the shape of the deploy scripts' checks:</p>
${run('c27-ssh', 'ssh -o BatchMode=yes -o ConnectTimeout=5 vps', 4)}
<table>
<tr><th>Line</th><th>What it means</th></tr>
<tr><td><code>-o BatchMode=yes</code></td><td>Never prompt for a password or passphrase: in a script, fail instead of hanging forever.</td></tr>
<tr><td><code>-o ConnectTimeout=5</code></td><td>Give up after 5 s if the host does not answer (blocked port, wrong IP).</td></tr>
<tr><td><code>Warning: Permanently added 'vps' …</code></td><td>First connection: the server's host key was saved to <code>known_hosts</code>. If it ever changes unexpectedly, ssh refuses — that protects you from a man in the middle.</td></tr>
<tr><td><code>vps-lab</code>, <code>up 8:12, load average …</code></td><td>The remote <code>hostname; uptime</code>: you are on the right machine, and its load.</td></tr>
<tr><td><code>overlay 911G 48G 818G 6% /</code></td><td>Remote <code>df -h /</code> (in the lab the root is Docker's overlay; on a VPS it is a real disk like <code>/dev/vda1</code>).</td></tr>
<tr><td><code>Mem: 7934 3205 3382 156 1700 4728</code></td><td>The <code>Mem:</code> row of <code>free -m</code>; last number = available.</td></tr>
<tr><td><code>active</code>, <code>NRestarts=0</code>, <code>MemoryCurrent=10719232</code></td><td>The service is up, systemd never had to restart it (no crash loop), and it uses ~10 MB (bytes).</td></tr>
<tr><td><code>-p 2222 … Connection refused</code>, <code>exit=255</code></td><td>Nothing listens on that port. 255 is ssh's <strong>own</strong> failure code; when the connection works, ssh exits with the remote command's code instead.</td></tr>
</table>

<h3>Transcript 4 — "Deploy": rsync progress and the smoke test</h3>
<p><code>deploy.sh</code> (the fallback deploy path) copies the working tree to the server with rsync. An 81 MB "build" of 1 503 files, with bandwidth capped to 20 MB/s so the progress is visible:</p>
${run('c27-ssh', 'du -sh /srv/build', 3)}
<table>
<tr><th>Piece</th><th>What it means</th></tr>
<tr><td><code>-a</code> <code>-z</code> <code>--delete</code></td><td>Archive (keep permissions, times, links), compress on the wire, delete files on the server that no longer exist locally.</td></tr>
<tr><td><code>--info=progress2</code></td><td>One progress line for the whole transfer instead of one per file. The <code>tr</code> and <code>awk</code> after it only turn the in-place updates into lines and keep 7 of them plus the summary, for this page.</td></tr>
<tr><td><code>52,428,800 63% 19.98MB/s 0:00:02</code></td><td>Bytes so far, percent of total, current speed (the 20 MB/s cap), time left (estimated).</td></tr>
<tr><td><code>(xfr#2, to-chk=1502/1505)</code></td><td>2 files transferred so far; 1 502 of 1 505 entries still to check. <code>to-chk=0/1505</code> = done.</td></tr>
<tr><td><code>sent 83,255,621 bytes … speedup is 1.00</code></td><td>First sync: everything went over the wire; speedup 1 = no saving.</td></tr>
<tr><td>after a one-line change: <code>sent 32,774 bytes</code>, <code>speedup is 1,308.58</code></td><td>rsync compared checksums and sent only the changed block plus the file list: 32 KB instead of 83 MB.</td></tr>
</table>
${run('c27-ssh', "ssh vps 'for p in")}
<p>The smoke test after a deploy reads HTTP status codes, by the rule this project learned the hard way: <strong>200</strong> = route mounted and public, <strong>401</strong> = mounted but needs login — both healthy; <strong>404</strong> = the route is not mounted at all, i.e. a stale or partial build. A 404 on a route that should exist fails the deploy.</p>

<h3>📋 The one page: the first five minutes when a machine is slow</h3>
<table>
<tr><th>#</th><th>Run</th><th>Look at</th><th>Bad sign → go to</th></tr>
<tr><td>1</td><td><code>uptime</code></td><td>load 1/5/15 vs <code>nproc</code></td><td>load ≫ cores, or rising → 2.2</td></tr>
<tr><td>2</td><td><code>dmesg -T | tail</code> (or <code>journalctl -k -n 50</code>)</td><td>kernel complaints</td><td><code>Killed process</code> → 2.3/2.6 · <code>I/O error</code> → 2.4</td></tr>
<tr><td>3</td><td><code>vmstat 1 5</code></td><td><code>r</code>, <code>b</code>, <code>si/so</code>, <code>us sy wa st</code></td><td><code>b</code>&gt;0 + <code>wa</code> → disk · <code>si/so</code>&gt;0 → memory · <code>st</code> → noisy host</td></tr>
<tr><td>4</td><td><code>mpstat -P ALL 1 1</code></td><td>per-core usage</td><td>one core at 100% → a single-threaded hog (2.2)</td></tr>
<tr><td>5</td><td><code>pidstat 1 1</code> · <code>pidstat -d 1 1</code></td><td>per-process CPU · disk I/O</td><td>the culprit's PID and command</td></tr>
<tr><td>6</td><td><code>iostat -dxz 1 2</code></td><td><code>await</code>, <code>aqu-sz</code>, <code>%util</code></td><td>tens–hundreds of ms, queue &gt; 1 → 2.4</td></tr>
<tr><td>7</td><td><code>free -m</code></td><td><code>available</code></td><td>small and shrinking → 2.3</td></tr>
<tr><td>8</td><td><code>df -h</code> · <code>df -i</code></td><td>Use%, IUse%</td><td>&gt; 90% → 2.4</td></tr>
<tr><td>9</td><td><code>ss -s</code> · <code>ss -tulpn</code></td><td>connections, listeners</td><td>huge TIME_WAIT, missing listener → 2.5</td></tr>
<tr><td>10</td><td><code>top -b -n 1</code> · <code>systemctl --failed</code> · <code>docker stats --no-stream</code></td><td>the whole picture</td><td>confirm before you change anything</td></tr>
</table>
<p><strong>Symptom → first command</strong>, for the nine incidents of this chapter:</p>
<table>
<tr><th>Symptom</th><th>First command</th><th>Lesson</th></tr>
<tr><td>"No space left on device"</td><td><code>df -h</code>, then <code>du -xh --max-depth=1 / | sort -h</code>, <code>docker system df</code></td><td>2.4</td></tr>
<tr><td>Deleted a big file, space did not come back</td><td><code>lsof +L1</code></td><td>2.4</td></tr>
<tr><td>"No space" but df shows free space</td><td><code>df -i</code></td><td>2.4</td></tr>
<tr><td>Exit 137 / killed with no error</td><td><code>dmesg -T | grep -i "killed process"</code>, <code>docker inspect -f '{{.State.OOMKilled}}'</code></td><td>2.3</td></tr>
<tr><td>Disk grows every day</td><td><code>journalctl --disk-usage</code>, <code>docker inspect -f '{{.HostConfig.LogConfig}}'</code></td><td>2.6</td></tr>
<tr><td>API frozen, CPU "only 10%"</td><td><code>ps -eo pid,stat,%cpu,comm --sort=-%cpu | head</code>, <code>pidstat -u -p PID 1 3</code></td><td>2.2</td></tr>
<tr><td>EMFILE: too many open files</td><td><code>ls /proc/PID/fd | wc -l</code>, <code>cat /proc/PID/limits</code></td><td>2.5</td></tr>
<tr><td>EADDRINUSE</td><td><code>ss -ltnp 'sport = :PORT'</code>, then <code>fuser -k PORT/tcp</code></td><td>2.5</td></tr>
<tr><td>"Cannot fork" / many Z in ps</td><td><code>ps -eo stat,pid,ppid,comm | grep '^Z'</code>, <code>cat /sys/fs/cgroup/pids.current</code></td><td>2.2</td></tr>
</table>

<h3>Your turn: the mystery box</h3>
<p>Before the practice, try the cheat sheet on a box whose problem you do not know. The hints stay hidden until you give your diagnosis.</p>
${lab('sysmon', 'mystery', 'en', 'A random incident (CPU hog, leak, full disk, I/O storm, fork bomb or zombies). Run the ten commands, name the resource and the process, then fix it.')}
<h3>🧪 Practice (20 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> the next time Claude (or a teammate) pastes a terminal log into the chat, you want to follow it without asking "what does that mean?".</p>
<ol>
<li>On your own machine run transcript 1 and 2 (macOS: as shown; Linux: <code>df -h /</code>, <code>ps -eo pid,%cpu,rss,etime,comm --sort=-rss | head</code>, <code>ss -ltnp</code>).</li>
<li>For each command write the question it asks in one sentence, then the line of output that answers it.</li>
<li>Take any real log from your own work (a deploy, a build, a Claude session) of 10–20 lines and annotate it the same way: command, header, the number that matters, exit code.</li>
<li>Print the one-page table and, next time something is slow, follow it top to bottom before changing anything.</li>
</ol>
<p><strong>Done when:</strong> you can explain every line of the four transcripts above without looking at the notes, and you have one annotated log of your own.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['transcript (bản ghi lệnh)', 'Commands (lines starting with $) followed by their real output, in order.'],
  ['BatchMode', 'ssh option: never prompt; fail instead — required in scripts.'],
  ['known_hosts', 'File of server host keys ssh has seen; a changed key is refused.'],
  ['exit 255 (ssh)', 'ssh itself failed (could not connect/authenticate); otherwise ssh returns the remote command’s code.'],
  ['rsync delta transfer', 'Sending only changed blocks, found by checksums — why the second sync sent 32 KB.'],
  ['to-chk', 'rsync progress: entries still to check / total; 0 means finished.'],
  ['smoke test', 'Quick checks right after a deploy: 200/401 = route mounted, 404 = stale build.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Read a transcript as question (command) → header → the number that answers → exit code.</li>
<li>Disk checks: <code>df -h</code> for space, <code>du -sh</code> for suspects, <code>docker system df</code> for Docker; never delete the owner's data without asking.</li>
<li>Process checks: <code>pgrep -l</code> (not <code>-fl</code>, it leaks command lines), <code>ps … -m</code>/<code>--sort</code>, <code>lsof</code>/<code>ss</code> for ports; beware <code>pkill -f</code> matching itself.</li>
<li>ssh in scripts: <code>BatchMode</code>, <code>ConnectTimeout</code>; 255 = ssh's own failure. rsync: <code>progress2</code>, <code>to-chk</code>, speedup.</li>
<li>Keep the one-page table: ten commands in USE order, and the symptom → first-command map.</li>
</ul>
${L('https://man7.org/linux/man-pages/man1/rsync.1.html', '📄', 'rsync(1)', 'Every option, including --info=progress2 and what speedup means.', 'Open')}
${L('https://man.openbsd.org/ssh', '📄', 'ssh(1)', 'Options such as BatchMode and ConnectTimeout, and the exit status rule.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.7</span>
<h2>Đọc cùng Claude</h2>
<p class="lead">"Những thứ bạn làm hằng ngày tôi đọc không hiểu gì" — bài này là câu trả lời cho câu đó. Dưới đây là bốn bản ghi lệnh đúng kiểu Claude chạy khi làm dự án này: kiểm đĩa máy Mac, tìm cái gì đang chạy và ai giữ cổng, kiểm một máy chủ qua ssh, deploy bằng rsync rồi smoke-test. Mỗi bản là output thật, chú thích từng dòng. Cuối bài: một trang duy nhất để mở sẵn khi máy chậm.</p>
${lab('process', 'sandbox', 'vi', 'Tự dựng một cây tiến trình nhỏ — fork, exit, wait, kill — và đọc bảng ps sau mỗi bước. Mọi bản ghi bên dưới đều là một bảng ps/top/ss như thế này.')}

<h3>Cách đọc một bản ghi lệnh bất kỳ</h3>
<ol>
<li>Dòng bắt đầu bằng <code>$</code> là một lệnh; mọi thứ cho tới dấu <code>$</code> kế tiếp là output của nó.</li>
<li>Đọc lệnh như một <strong>câu hỏi</strong> trước ("đĩa đầy tới đâu?"). Cờ đổi câu hỏi: <code>-h</code> đơn vị dễ đọc, <code>-n</code> số thay vì tên, <code>-p</code> hiện tiến trình.</li>
<li>Đọc <strong>dòng tiêu đề</strong>; rồi tìm một hai con số trả lời câu hỏi. Phần lớn output chỉ là bối cảnh.</li>
<li>Tìm <strong>mã thoát</strong> (<code>exit=…</code>, <code>echo $?</code>): 0 = ổn; khác 0 nghĩa là "đọc dòng ngay phía trên".</li>
</ol>

<h3>Bản ghi 1 — "Máy Mac có sắp hết đĩa không?"</h3>
<p>Claude kiểm câu này trước mỗi việc dài (render video, build) kể từ lần máy Mac đầy đĩa ngày 27–28/10. Chạy trên chính máy Mac soạn khoá này, chỉ đọc:</p>
${run('c27-mac', 'df -h', 4)}
<table>
<tr><th>Dòng</th><th>Nghĩa là gì</th></tr>
<tr><td><code>df -h /System/Volumes/Data</code></td><td>Trên macOS file của bạn nằm ở volume "Data", không phải <code>/</code>. <code>-h</code> = GiB/MiB.</td></tr>
<tr><td><code>926Gi 847Gi 39Gi 96%</code></td><td>Dung lượng, đã dùng, <strong>còn trống</strong>, phần trăm. Trống 39 GB: trên ngưỡng cảnh báo 20 GB, hôm nay ổn. <code>df</code> của macOS in cả inode (<code>iused 5.3M</code>, <code>%iused 1%</code>) — không có vấn đề inode.</td></tr>
<tr><td><code>du -sh frontend/node_modules …</code></td><td><code>-s</code> một tổng cho mỗi đối số. 1,5 GB gói, 1,4 GB output build của Next, 750 MB gói backend — đều <strong>dựng lại được</strong> (<code>npm ci</code>, <code>next build</code>), nên lúc khẩn cấp xoá được.</td></tr>
<tr><td><code>du -sh "$TMPDIR"</code> → 6.1G</td><td>Thư mục tạm của người dùng, nơi các lượt render video để lại bundle ~12 GB. Hôm nay 6,1 GB, để xem sau.</td></tr>
<tr><td><code>docker system df</code></td><td>Phần của Docker: 33 GB ảnh (11 GB lấy lại được), 9,7 GB volume, 5,7 GB build cache với 0 cái đang dùng. Lấy lại được ≠ "xoá ngay": volume có thể đang chứa cơ sở dữ liệu.</td></tr>
</table>
<p>Kết luận Claude ghi sau bước này: "trống 39 GB, không cần làm gì; đã liệt kê các mục lớn dựng lại được". Nó không xoá gì của chủ máy mà không hỏi.</p>

<h3>Bản ghi 2 — "Cái gì đang chạy, và ai giữ cổng?"</h3>
${run('c27-mac', 'pgrep -l node', 3)}
<table>
<tr><th>Dòng</th><th>Nghĩa là gì</th></tr>
<tr><td><code>pgrep -l node</code></td><td>PID các tiến trình tên <code>node</code>, kèm tên. Cố ý dùng <code>-l</code> (không phải <code>-fl</code>): <code>-f</code> in nguyên dòng lệnh, mà dòng lệnh có thể chứa token và mật khẩu.</td></tr>
<tr><td><code>ps -axo pid,%cpu,rss,etime,comm -m</code></td><td>Mọi tiến trình, các cột tự chọn, <code>-m</code> = sắp theo bộ nhớ (macOS). <code>RSS</code> tính bằng KB, <code>ELAPSED</code> = đã chạy được bao lâu.</td></tr>
<tr><td><code>next-server (v14.2.35)</code> 1,4 GB, 15 giờ</td><td>Một server dev/xem trước của Next.js bị bỏ chạy từ sáng — để ý nó đã tự đổi tên (bài 2.5).</td></tr>
<tr><td><code>…Virtualization.VirtualMachine</code> 5,3 GB, 357% CPU</td><td>Máy ảo Linux của Docker Desktop. 357% = 3,5 lõi: container của các việc khác đang chạy bên trong nó lúc đó.</td></tr>
<tr><td><code>claude</code></td><td>Chính Claude Code (≈ 1 GB).</td></tr>
<tr><td><code>lsof -nP -iTCP:3123 -sTCP:LISTEN</code></td><td>Ai đang nghe cổng TCP 3123: PID 96158. <code>lsof</code> của macOS hiện tên file chạy <code>node</code> và tìm thấy bình thường — khác với <code>lsof</code> trên Linux ở bài 2.5.</td></tr>
</table>
<div class="pitfall co-tieu-de">
<p><strong>Một lệnh <code>pkill -f</code> tự giết chính nó.</strong> Ngày 26/10/2026 một script dọn dẹp chạy <code>ssh host 'pkill -f "f5-train|…"; rm -rf ~/f5-train …'</code>. Dòng lệnh của chính cái shell ở xa có chứa chữ "f5-train" (trong phần <code>rm -rf</code>), nên <code>pkill -f</code> khớp và giết luôn cái shell đang chạy nó: không xoá được gì, log trống trơn, và script vẫn in "✓ xong". Chỉ phát hiện ra nhờ kiểm lại bằng <code>ls</code>. Quy tắc: xoá trước, giết theo đúng tên (không <code>-f</code>) hoặc theo PID; và luôn nghiệm thu kết quả bằng một lệnh riêng.</p>
</div>

<h3>Bản ghi 3 — "Máy chủ có khoẻ không?" qua ssh</h3>
<p>Hai container lab đóng vai máy nhà và VPS (systemd, sshd và API của ta chạy dưới tên <code>ctw-web</code>). Các lệnh có đúng dáng các bước kiểm của script deploy:</p>
${run('c27-ssh', 'ssh -o BatchMode=yes -o ConnectTimeout=5 vps', 4)}
<table>
<tr><th>Dòng</th><th>Nghĩa là gì</th></tr>
<tr><td><code>-o BatchMode=yes</code></td><td>Không bao giờ hỏi mật khẩu hay passphrase: trong script, thà hỏng còn hơn treo mãi.</td></tr>
<tr><td><code>-o ConnectTimeout=5</code></td><td>Bỏ cuộc sau 5 giây nếu máy không trả lời (cổng bị chặn, sai IP).</td></tr>
<tr><td><code>Warning: Permanently added 'vps' …</code></td><td>Lần kết nối đầu: khoá máy chủ được lưu vào <code>known_hosts</code>. Nếu nó đổi bất ngờ, ssh từ chối — thứ bảo vệ bạn khỏi kẻ đứng giữa.</td></tr>
<tr><td><code>vps-lab</code>, <code>up 8:12, load average …</code></td><td><code>hostname; uptime</code> chạy ở xa: bạn đang ở đúng máy, và tải của nó.</td></tr>
<tr><td><code>overlay 911G 48G 818G 6% /</code></td><td><code>df -h /</code> ở xa (trong lab gốc là overlay của Docker; trên VPS là một ổ thật như <code>/dev/vda1</code>).</td></tr>
<tr><td><code>Mem: 7934 3205 3382 156 1700 4728</code></td><td>Dòng <code>Mem:</code> của <code>free -m</code>; số cuối = available.</td></tr>
<tr><td><code>active</code>, <code>NRestarts=0</code>, <code>MemoryCurrent=10719232</code></td><td>Dịch vụ đang chạy, systemd chưa từng phải khởi động lại nó (không có vòng lặp sập), và nó dùng ~10 MB (tính bằng byte).</td></tr>
<tr><td><code>-p 2222 … Connection refused</code>, <code>exit=255</code></td><td>Không có gì nghe ở cổng đó. 255 là mã lỗi <strong>của chính ssh</strong>; khi kết nối được, ssh thoát với mã của lệnh chạy ở xa.</td></tr>
</table>

<h3>Bản ghi 4 — "Deploy": tiến độ rsync và smoke test</h3>
<p><code>deploy.sh</code> (đường deploy dự phòng) chép cây làm việc lên máy chủ bằng rsync. Một "bản build" 81 MB gồm 1 503 file, băng thông bị chặn ở 20 MB/s để thấy được tiến độ:</p>
${run('c27-ssh', 'du -sh /srv/build', 3)}
<table>
<tr><th>Phần</th><th>Nghĩa là gì</th></tr>
<tr><td><code>-a</code> <code>-z</code> <code>--delete</code></td><td>Lưu trữ (giữ quyền, giờ, liên kết), nén khi truyền, xoá trên máy chủ những file không còn ở máy gửi.</td></tr>
<tr><td><code>--info=progress2</code></td><td>Một dòng tiến độ cho cả lượt chuyển thay vì mỗi file một dòng. Phần <code>tr</code> và <code>awk</code> phía sau chỉ biến các lần cập nhật tại chỗ thành từng dòng rồi giữ 7 dòng cùng phần tổng kết, cho trang này.</td></tr>
<tr><td><code>52,428,800 63% 19.98MB/s 0:00:02</code></td><td>Số byte đã chuyển, phần trăm tổng, tốc độ hiện tại (trần 20 MB/s), thời gian còn lại (ước lượng).</td></tr>
<tr><td><code>(xfr#2, to-chk=1502/1505)</code></td><td>Đã chuyển 2 file; còn 1 502 trên 1 505 mục phải kiểm. <code>to-chk=0/1505</code> = xong.</td></tr>
<tr><td><code>sent 83,255,621 bytes … speedup is 1.00</code></td><td>Lần đồng bộ đầu: mọi thứ đều đi qua dây; speedup 1 = không tiết kiệm được gì.</td></tr>
<tr><td>sau khi sửa một dòng: <code>sent 32,774 bytes</code>, <code>speedup is 1,308.58</code></td><td>rsync so checksum và chỉ gửi khối thay đổi cộng danh sách file: 32 KB thay vì 83 MB.</td></tr>
</table>
${run('c27-ssh', "ssh vps 'for p in")}
<p>Smoke test sau deploy đọc mã trạng thái HTTP, theo đúng quy tắc dự án này đã học bằng giá đắt: <strong>200</strong> = route đã gắn và công khai, <strong>401</strong> = đã gắn nhưng cần đăng nhập — cả hai đều khoẻ; <strong>404</strong> = route hoàn toàn chưa được gắn, tức một bản build cũ hoặc dở dang. Một route đáng ra phải có mà trả 404 thì deploy coi như hỏng.</p>

<h3>📋 Một trang duy nhất: năm phút đầu tiên khi máy chậm</h3>
<table>
<tr><th>#</th><th>Chạy</th><th>Nhìn vào</th><th>Dấu hiệu xấu → sang</th></tr>
<tr><td>1</td><td><code>uptime</code></td><td>load 1/5/15 so với <code>nproc</code></td><td>load ≫ số lõi, hoặc đang tăng → 2.2</td></tr>
<tr><td>2</td><td><code>dmesg -T | tail</code> (hoặc <code>journalctl -k -n 50</code>)</td><td>nhân có kêu gì</td><td><code>Killed process</code> → 2.3/2.6 · <code>I/O error</code> → 2.4</td></tr>
<tr><td>3</td><td><code>vmstat 1 5</code></td><td><code>r</code>, <code>b</code>, <code>si/so</code>, <code>us sy wa st</code></td><td><code>b</code>&gt;0 + <code>wa</code> → đĩa · <code>si/so</code>&gt;0 → bộ nhớ · <code>st</code> → máy chủ vật lý quá tải</td></tr>
<tr><td>4</td><td><code>mpstat -P ALL 1 1</code></td><td>mức dùng từng lõi</td><td>một lõi 100% → một kẻ ăn CPU đơn luồng (2.2)</td></tr>
<tr><td>5</td><td><code>pidstat 1 1</code> · <code>pidstat -d 1 1</code></td><td>CPU · I/O đĩa theo tiến trình</td><td>PID và lệnh của thủ phạm</td></tr>
<tr><td>6</td><td><code>iostat -dxz 1 2</code></td><td><code>await</code>, <code>aqu-sz</code>, <code>%util</code></td><td>hàng chục–hàng trăm ms, hàng đợi &gt; 1 → 2.4</td></tr>
<tr><td>7</td><td><code>free -m</code></td><td><code>available</code></td><td>nhỏ và đang co lại → 2.3</td></tr>
<tr><td>8</td><td><code>df -h</code> · <code>df -i</code></td><td>Use%, IUse%</td><td>&gt; 90% → 2.4</td></tr>
<tr><td>9</td><td><code>ss -s</code> · <code>ss -tulpn</code></td><td>kết nối, các cổng đang nghe</td><td>TIME_WAIT khổng lồ, thiếu cổng đang nghe → 2.5</td></tr>
<tr><td>10</td><td><code>top -b -n 1</code> · <code>systemctl --failed</code> · <code>docker stats --no-stream</code></td><td>toàn cảnh</td><td>xác nhận trước khi thay đổi bất cứ gì</td></tr>
</table>
<p><strong>Triệu chứng → lệnh đầu tiên</strong>, cho chín sự cố của chương:</p>
<table>
<tr><th>Triệu chứng</th><th>Lệnh đầu tiên</th><th>Bài</th></tr>
<tr><td>"No space left on device"</td><td><code>df -h</code>, rồi <code>du -xh --max-depth=1 / | sort -h</code>, <code>docker system df</code></td><td>2.4</td></tr>
<tr><td>Đã xoá file lớn mà chỗ không quay lại</td><td><code>lsof +L1</code></td><td>2.4</td></tr>
<tr><td>"Hết chỗ" mà df còn trống</td><td><code>df -i</code></td><td>2.4</td></tr>
<tr><td>Exit 137 / bị giết không báo lỗi</td><td><code>dmesg -T | grep -i "killed process"</code>, <code>docker inspect -f '{{.State.OOMKilled}}'</code></td><td>2.3</td></tr>
<tr><td>Đĩa tăng mỗi ngày</td><td><code>journalctl --disk-usage</code>, <code>docker inspect -f '{{.HostConfig.LogConfig}}'</code></td><td>2.6</td></tr>
<tr><td>API đông cứng, CPU "mới 10%"</td><td><code>ps -eo pid,stat,%cpu,comm --sort=-%cpu | head</code>, <code>pidstat -u -p PID 1 3</code></td><td>2.2</td></tr>
<tr><td>EMFILE: too many open files</td><td><code>ls /proc/PID/fd | wc -l</code>, <code>cat /proc/PID/limits</code></td><td>2.5</td></tr>
<tr><td>EADDRINUSE</td><td><code>ss -ltnp 'sport = :PORT'</code>, rồi <code>fuser -k PORT/tcp</code></td><td>2.5</td></tr>
<tr><td>"Cannot fork" / nhiều Z trong ps</td><td><code>ps -eo stat,pid,ppid,comm | grep '^Z'</code>, <code>cat /sys/fs/cgroup/pids.current</code></td><td>2.2</td></tr>
</table>

<h3>Tới lượt bạn: chiếc máy bí ẩn</h3>
<p>Trước bài thực hành, thử bảng tra trên một chiếc máy mà bạn không biết nó đang bị gì. Gợi ý sẽ ẩn cho tới khi bạn đưa ra chẩn đoán.</p>
${lab('sysmon', 'mystery', 'vi', 'Một sự cố ngẫu nhiên (ăn CPU, rò bộ nhớ, đầy đĩa, bão I/O, fork bomb hoặc zombie). Chạy mười lệnh, gọi tên tài nguyên và tiến trình, rồi sửa nó.')}
<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> lần tới Claude (hay một bạn trong nhóm) dán một đoạn log terminal vào cuộc trò chuyện, bạn muốn đọc theo được mà không phải hỏi "cái đó nghĩa là gì?".</p>
<ol>
<li>Trên máy của bạn, chạy bản ghi 1 và 2 (macOS: như trong bài; Linux: <code>df -h /</code>, <code>ps -eo pid,%cpu,rss,etime,comm --sort=-rss | head</code>, <code>ss -ltnp</code>).</li>
<li>Với mỗi lệnh, viết câu hỏi nó đặt ra trong một câu, rồi dòng output trả lời câu đó.</li>
<li>Lấy một đoạn log thật bất kỳ từ việc của bạn (một lần deploy, một lần build, một phiên làm việc với Claude) dài 10–20 dòng và chú thích theo đúng cách đó: lệnh, dòng tiêu đề, con số quan trọng, mã thoát.</li>
<li>In bảng một trang ra và, lần tới có gì chậm, đi từ trên xuống dưới trước khi thay đổi bất cứ thứ gì.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn giải thích được mọi dòng của bốn bản ghi ở trên mà không nhìn chú thích, và có một đoạn log của chính mình đã chú thích xong.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['transcript (bản ghi lệnh)', 'Các lệnh (dòng bắt đầu bằng $) nối tiếp bởi output thật của chúng, theo thứ tự.'],
  ['BatchMode', 'Tuỳ chọn ssh: không bao giờ hỏi; hỏng luôn — bắt buộc trong script.'],
  ['known_hosts', 'File chứa khoá các máy chủ ssh đã gặp; khoá đổi thì bị từ chối.'],
  ['exit 255 (ssh)', 'Chính ssh hỏng (không kết nối/xác thực được); còn lại ssh trả về mã của lệnh chạy ở xa.'],
  ['rsync delta transfer (truyền phần chênh)', 'Chỉ gửi các khối đã đổi, tìm bằng checksum — vì thế lần đồng bộ thứ hai chỉ gửi 32 KB.'],
  ['to-chk', 'Tiến độ rsync: số mục còn phải kiểm / tổng số; 0 nghĩa là xong.'],
  ['smoke test', 'Các phép kiểm nhanh ngay sau deploy: 200/401 = route đã gắn, 404 = bản build cũ.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đọc bản ghi lệnh theo thứ tự câu hỏi (lệnh) → dòng tiêu đề → con số trả lời → mã thoát.</li>
<li>Kiểm đĩa: <code>df -h</code> cho dung lượng, <code>du -sh</code> cho nghi phạm, <code>docker system df</code> cho Docker; không bao giờ xoá dữ liệu của chủ máy khi chưa hỏi.</li>
<li>Kiểm tiến trình: <code>pgrep -l</code> (không dùng <code>-fl</code>, nó làm lộ dòng lệnh), <code>ps … -m</code>/<code>--sort</code>, <code>lsof</code>/<code>ss</code> cho cổng; coi chừng <code>pkill -f</code> khớp với chính nó.</li>
<li>ssh trong script: <code>BatchMode</code>, <code>ConnectTimeout</code>; 255 = chính ssh hỏng. rsync: <code>progress2</code>, <code>to-chk</code>, speedup.</li>
<li>Giữ bảng một trang: mười lệnh theo thứ tự USE, và bảng triệu chứng → lệnh đầu tiên.</li>
</ul>
${L('https://man7.org/linux/man-pages/man1/rsync.1.html', '📄', 'rsync(1)', 'Mọi tuỳ chọn, kể cả --info=progress2 và ý nghĩa của speedup.', 'Mở')}
${L('https://man.openbsd.org/ssh', '📄', 'ssh(1)', 'Các tuỳ chọn như BatchMode và ConnectTimeout, và quy tắc mã thoát.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 2.8 — Quiz ───────────────────────── */
    {
      title: '2.8 — Chapter 2 check|||2.8 — Kiểm tra Chương 2',
      slug: 'os-2-8-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống dựng trên output đo thật của chương: CPU "mới 10%" mà API chết, load trên 2 lõi, free vs available, exit 137 khi build, file đã xoá vẫn giữ chỗ, cạn inode, giết theo cổng khi Next tự đổi tên, zombie làm cạn PID, vacuum journal, và Postgres đầy đĩa.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Check</span>
<h2>Can you read a sick Linux box?</h2>
<p class="lead">Ten scenarios, each built on output you saw measured in this chapter. The skill being tested is the one you need on a bad night: read a real number, know what it means, pick the next command or the safe fix.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can run the first-five-minutes checklist and write an incident as symptom → measure → cause → fix → prevent.</li>
<li>I can read top's header and columns, tell us/sy/ni/wa/st apart, and compare load with the number of cores.</li>
<li>I read <code>available</code>, not <code>free</code>, and I can recognise an OOM kill (137, dmesg, memory.events).</li>
<li>I can tell the three kinds of "disk full" apart with <code>du</code>, <code>lsof +L1</code> and <code>df -i</code>.</li>
<li>I can find who holds a port or leaks file descriptors, and read systemctl, journalctl and Docker log settings.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Bạn đã đọc được một máy Linux đang ốm chưa?</h2>
<p class="lead">Mười tình huống, câu nào cũng dựng trên output bạn đã thấy đo thật trong chương. Kỹ năng được kiểm là thứ bạn cần vào một đêm tồi tệ: đọc một con số thật, biết nó nghĩa là gì, chọn lệnh tiếp theo hoặc cách sửa an toàn.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi chạy được danh sách năm phút đầu tiên và viết sự cố theo triệu chứng → đo → nguyên nhân → sửa → phòng.</li>
<li>Tôi đọc được dòng đầu và các cột của top, phân biệt us/sy/ni/wa/st, và so load với số lõi.</li>
<li>Tôi đọc <code>available</code>, không đọc <code>free</code>, và nhận ra một lần OOM kill (137, dmesg, memory.events).</li>
<li>Tôi phân biệt được ba kiểu "đầy đĩa" bằng <code>du</code>, <code>lsof +L1</code> và <code>df -i</code>.</li>
<li>Tôi tìm được ai giữ cổng hay rò rỉ file descriptor, và đọc được systemctl, journalctl cùng cấu hình log của Docker.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          { question: '<code>/health</code> of a Node API times out (curl exit 28). <code>top</code> shows <code>%Cpu(s): 10.4 us, 89.6 id</code> and one <code>node</code> process at 90.9% CPU; <code>pidstat</code> shows it at 100% <code>%usr</code>, 0% <code>%system</code>. What is going on?|||<code>/health</code> của một API Node hết thời gian chờ (curl exit 28). <code>top</code> báo <code>%Cpu(s): 10.4 us, 89.6 id</code> và một tiến trình <code>node</code> ở 90,9% CPU; <code>pidstat</code> cho thấy nó 100% <code>%usr</code>, 0% <code>%system</code>. Chuyện gì đang xảy ra?',
            options: ['The machine is 90% idle, so the problem must be the network|||Máy rảnh 90%, nên vấn đề phải nằm ở mạng', 'The single JavaScript thread is pinned at 100% of one core in user code (e.g. a runaway regex); the machine-wide average hides it|||Luồng JavaScript duy nhất bị ghim 100% ở một lõi trong mã người dùng (vd một regex chạy loạn); trung bình cả máy che mất điều đó', 'The disk is saturated; the process is waiting for I/O|||Đĩa bão hoà; tiến trình đang chờ I/O', 'The kernel is busy with system calls on behalf of node|||Nhân đang bận làm syscall hộ node'],
            correctIndex: 1, points: 1,
            explanation: 'EN: %CPU is per core; 10.4 us on 10 CPUs is one core. 100% %usr with 0% %system means pure user-space computation — in lesson 2.2 perf named the RegExp. Disk waiting would show as wa/D state with low %usr; "the machine is idle" is the trap the average sets.|||VI: %CPU tính theo lõi; 10,4 us trên 10 CPU là đúng một lõi. 100% %usr với 0% %system nghĩa là thuần tính toán ở không gian người dùng — ở bài 2.2 perf đã gọi tên cái RegExp. Chờ đĩa sẽ hiện thành wa/trạng thái D với %usr thấp; "máy đang rảnh" là cái bẫy mà con số trung bình giăng ra.' },
          { question: 'A container is pinned to 2 cores (<code>--cpuset-cpus 0,1</code>) and runs 6 busy loops. After 65 s: <code>load average: 4.37, …</code>, each node shows 20–50% in top, <code>%Cpu(s)</code> 80% idle. Which statement is right?|||Một container bị ghim vào 2 lõi (<code>--cpuset-cpus 0,1</code>) và chạy 6 vòng lặp bận. Sau 65 giây: <code>load average: 4.37, …</code>, mỗi node hiện 20–50% trong top, <code>%Cpu(s)</code> rảnh 80%. Câu nào đúng?',
            options: ['Nothing is wrong: no process reaches 100%|||Không có gì sai: không tiến trình nào chạm 100%', 'Load is a percentage: 4.37% of the machine is used|||Load là phần trăm: 4,37% của máy đang được dùng', 'There is spare CPU: 80% idle means you can start more work in this container|||Còn thừa CPU: rảnh 80% nghĩa là có thể chạy thêm việc trong container này', 'The two allowed cores are saturated: about four tasks always wait, and the 1-minute load is still climbing toward ~6|||Hai lõi được phép đã bão hoà: luôn có khoảng bốn tác vụ phải chờ, và load 1 phút vẫn đang leo về khoảng 6'],
            correctIndex: 3, points: 1,
            explanation: 'EN: Load counts runnable tasks (plus D state); compare it with the cores the work can use — here 2. mpstat showed cores 0 and 1 at 100%. The 80% idle belongs to the eight other cores this container may not use, and the 1-minute average reaches only ~63% of a jump after one minute.|||VI: Load đếm tác vụ sẵn sàng chạy (cộng trạng thái D); so nó với số lõi công việc được dùng — ở đây là 2. mpstat cho thấy lõi 0 và 1 ở 100%. Phần rảnh 80% là của tám lõi khác mà container này không được dùng, và trung bình 1 phút sau một phút mới đi được khoảng 63% của một cú nhảy.' },
          { question: '<code>free -m</code> on a 7 934 MB machine: <code>used 3262, free 996, buff/cache 4030, available 4671</code>. <code>vmstat</code> shows <code>si</code>/<code>so</code> = 0. What do you conclude?|||<code>free -m</code> trên máy 7 934 MB: <code>used 3262, free 996, buff/cache 4030, available 4671</code>. <code>vmstat</code> cho <code>si</code>/<code>so</code> = 0. Bạn kết luận gì?',
            options: ['Healthy: about 4.6 GB can still be given to programs without swapping; most "used-looking" memory is reclaimable page cache|||Khoẻ: vẫn còn khoảng 4,6 GB cấp được cho chương trình mà không phải swap; phần lớn bộ nhớ "trông như đã dùng" là page cache thu hồi được', 'Almost out of memory: only 996 MB free|||Gần hết bộ nhớ: chỉ còn trống 996 MB', 'Drop the caches every hour to keep free memory high|||Xoá cache mỗi giờ để giữ bộ nhớ trống ở mức cao', 'There is a leak because buff/cache is larger than used|||Có rò rỉ vì buff/cache lớn hơn used'],
            correctIndex: 0, points: 1,
            explanation: 'EN: available = free + droppable cache: the kernel’s estimate of what new programs can get. In lesson 2.3 writing 400 MB grew buff/cache by 400 MB while available barely moved, and deleting the file gave it back. Dropping caches only makes the next reads slow; a leak shows as RSS/available drifting over time, not as a big cache.|||VI: available = free + phần cache bỏ được: ước lượng của nhân về lượng chương trình mới có thể nhận. Ở bài 2.3 ghi 400 MB làm buff/cache tăng 400 MB trong khi available gần như đứng yên, và xoá file thì trả lại. Xoá cache chỉ làm các lần đọc sau chậm đi; rò rỉ hiện ra thành RSS/available trôi dần theo thời gian, không phải một cái cache lớn.' },
          { question: 'On a 1 GB container two <code>node --max-old-space-size=4096 build.js</code> run in parallel. Output: <code>Killed</code> twice, <code>exit=137</code> twice, no stack trace; <code>memory.events</code>: <code>oom_kill 2</code>. What happened, and what is a correct fix?|||Trên container 1 GB, hai <code>node --max-old-space-size=4096 build.js</code> chạy song song. Output: hai lần <code>Killed</code>, hai lần <code>exit=137</code>, không stack trace; <code>memory.events</code>: <code>oom_kill 2</code>. Chuyện gì xảy ra, và cách sửa đúng là gì?',
            options: ['V8 hit its heap limit; raise --max-old-space-size to 8192|||V8 chạm trần heap; nâng --max-old-space-size lên 8192', 'A bug in build.js crashed it with a segfault|||Một lỗi trong build.js làm nó sập vì segfault', 'The kernel OOM killer sent SIGKILL (128 + 9) when the container hit its limit; build one at a time and/or keep Node’s heap below the real limit|||OOM killer của nhân gửi SIGKILL (128 + 9) khi container chạm trần; build từng cái một và/hoặc giữ heap của Node thấp hơn trần thật', 'Docker stopped the container with SIGTERM because it ran too long|||Docker dừng container bằng SIGTERM vì nó chạy quá lâu'],
            correctIndex: 2, points: 1,
            explanation: 'EN: 137 = SIGKILL, which cannot be caught, so Node prints nothing; oom_kill counts the kernel’s kills. A V8 heap-limit failure looks different: "FATAL ERROR: … JavaScript heap out of memory" and exit 133/134. Raising the heap flag makes it worse. Sequential builds passed in the lab, as on the VPS after 06/07/2026.|||VI: 137 = SIGKILL, không bắt được, nên Node không in gì; oom_kill đếm số lần nhân giết. Lỗi chạm trần heap của V8 trông khác: "FATAL ERROR: … JavaScript heap out of memory" và exit 133/134. Nâng cờ heap chỉ làm tệ hơn. Build tuần tự chạy qua trong lab, đúng như trên VPS sau ngày 06/07/2026.' },
          { question: 'You <code>rm</code> a 30 MB log that an app is still writing. <code>df -h</code> still shows 31M used; <code>du -sh</code> of the folder shows 4.0K. How do you find and free the space without restarting the app?|||Bạn <code>rm</code> một file log 30 MB mà ứng dụng vẫn đang ghi. <code>df -h</code> vẫn báo dùng 31M; <code>du -sh</code> thư mục đó báo 4.0K. Làm sao tìm và giải phóng chỗ mà không khởi động lại ứng dụng?',
            options: ['Run fsck; the filesystem is corrupted|||Chạy fsck; hệ thống file bị hỏng', 'Wait: ext4 frees deleted files in the background after a few minutes|||Chờ: ext4 tự giải phóng file đã xoá ở nền sau vài phút', '<code>lsof +L1</code> finds the deleted-but-open file and its fd; truncate it with <code>: &gt; /proc/PID/fd/N</code>|||<code>lsof +L1</code> tìm ra file đã xoá nhưng còn mở và fd của nó; cắt nó bằng <code>: &gt; /proc/PID/fd/N</code>', 'Delete the folder too, so du and df agree|||Xoá luôn thư mục, để du và df khớp nhau'],
            correctIndex: 2, points: 1,
            explanation: 'EN: Space is freed when both the last name and the last open descriptor are gone; rm removed only the name. lsof +L1 showed "python3 … 3w … app.log (deleted)" with NLINK 0, and truncating through /proc/PID/fd/3 brought df back to 156K. Nothing is corrupted and nothing happens by waiting.|||VI: Chỗ được giải phóng khi cả cái tên cuối cùng lẫn descriptor mở cuối cùng đều mất; rm chỉ xoá cái tên. lsof +L1 cho thấy "python3 … 3w … app.log (deleted)" với NLINK 0, và cắt qua /proc/PID/fd/3 đưa df về 156K. Không có gì hỏng và chờ cũng chẳng có gì xảy ra.' },
          { question: '<code>touch /srv/deploy.lock</code> fails with <code>No space left on device</code>, yet <code>df -h</code> shows the filesystem 15% used. What is the first command to run?|||<code>touch /srv/deploy.lock</code> hỏng với <code>No space left on device</code>, vậy mà <code>df -h</code> báo hệ thống file mới dùng 15%. Lệnh đầu tiên cần chạy là gì?',
            options: ['<code>df -i</code> — the filesystem is out of inodes (too many tiny files); find the folder with the most files and clean it|||<code>df -i</code> — hệ thống file cạn inode (quá nhiều file tí hon); tìm thư mục có nhiều file nhất và dọn', '<code>free -m</code> — memory is full|||<code>free -m</code> — bộ nhớ đầy', '<code>lsof +L1</code> — a deleted file is held open|||<code>lsof +L1</code> — một file đã xoá đang bị giữ mở', '<code>iostat -x</code> — the disk is too slow to accept writes|||<code>iostat -x</code> — đĩa chậm quá không nhận ghi được'],
            correctIndex: 0, points: 1,
            explanation: 'EN: Every file needs an inode, and their number is fixed at format time. In lesson 2.4, 2 034 session files used 100% of inodes with only 8.2 MB of data; deleting them restored inodes at once. A deleted-but-open file shows as df ≫ du with bytes used, not as free bytes; a slow disk does not return ENOSPC.|||VI: File nào cũng cần một inode, và số lượng của chúng cố định từ lúc định dạng. Ở bài 2.4, 2 034 file session dùng hết 100% inode với chỉ 8,2 MB dữ liệu; xoá chúng là inode quay lại ngay. File đã xoá nhưng còn mở hiện ra thành df ≫ du với byte đã dùng, không phải byte còn trống; đĩa chậm không trả ENOSPC.' },
          { question: 'A Next.js server keeps port 3000. <code>ps</code> shows it as <code>next-server (v14.</code>; <code>pkill -f "next start"</code> returns 1; on the Linux box <code>lsof -ti:3000</code> prints nothing. What frees the port reliably?|||Một server Next.js cứ giữ cổng 3000. <code>ps</code> hiện nó là <code>next-server (v14.</code>; <code>pkill -f "next start"</code> trả về 1; trên máy Linux <code>lsof -ti:3000</code> không in gì. Cách nào giải phóng cổng chắc chắn?',
            options: ['Reboot the machine|||Khởi động lại máy', '<code>pkill -f node</code>|||<code>pkill -f node</code>', 'Start the new server on 3000 anyway; Linux will move the old one|||Cứ khởi động server mới ở 3000; Linux sẽ dời server cũ đi', 'Kill by port: <code>fuser -k 3000/tcp</code>, or the PID shown by <code>ss -ltnp "sport = :3000"</code>|||Giết theo cổng: <code>fuser -k 3000/tcp</code>, hoặc PID mà <code>ss -ltnp "sport = :3000"</code> hiện ra'],
            correctIndex: 3, points: 1,
            explanation: 'EN: Next renames its process (process.title), so name patterns stop matching; the lab’s lsof 4.99.4 also skipped a process name containing "(". ss reads the socket table and showed pid=51; fuser -k killed it and curl then failed with exit 7. pkill -f node may kill every Node process on the box; a second listen just fails with EADDRINUSE.|||VI: Next tự đổi tên tiến trình (process.title), nên các mẫu theo tên không còn khớp; lsof 4.99.4 trong lab còn bỏ qua tên tiến trình có chứa "(". ss đọc bảng socket và hiện pid=51; fuser -k giết nó và curl sau đó hỏng với exit 7. pkill -f node có thể giết mọi tiến trình Node trên máy; listen lần hai thì chỉ hỏng với EADDRINUSE.' },
          { question: 'A screenshot service in Docker (PID 1 = node) slowly stops working. Logs: <code>sh: 0: Cannot fork</code>; <code>docker exec</code> fails with <code>Resource temporarily unavailable</code>; earlier <code>ps</code> showed dozens of <code>Z</code> processes with PPID 1. What is the fix?|||Một dịch vụ chụp ảnh trong Docker (PID 1 = node) dần dần ngừng chạy. Log: <code>sh: 0: Cannot fork</code>; <code>docker exec</code> hỏng với <code>Resource temporarily unavailable</code>; trước đó <code>ps</code> hiện hàng chục tiến trình <code>Z</code> có PPID 1. Cách sửa là gì?',
            options: ['<code>kill -9</code> every zombie PID|||<code>kill -9</code> từng PID zombie', 'Run the container with <code>--init</code> (or <code>init: true</code>) so PID 1 reaps orphans; zombies cannot be killed, only reaped|||Chạy container với <code>--init</code> (hoặc <code>init: true</code>) để PID 1 thu dọn tiến trình mồ côi; zombie không giết được, chỉ thu dọn được', 'Raise the memory limit; zombies use RAM|||Nâng trần bộ nhớ; zombie tốn RAM', 'Lower the nice value of node|||Hạ giá trị nice của node'],
            correctIndex: 1, points: 1,
            explanation: 'EN: Orphaned helpers are re-parented to PID 1; node only waits for its own children, so they stay Z and each holds a PID until pids.max (60) is used up — then neither the app nor docker exec can fork. kill -9 on a zombie did nothing in the lab; with --init (tini) there were 0 zombies and 14 PIDs. Zombies use no RAM and no CPU.|||VI: Các tiến trình phụ mồ côi được giao cho PID 1; node chỉ wait các con của chính nó, nên chúng nằm lại ở Z và mỗi cái giữ một PID cho tới khi dùng hết pids.max (60) — lúc đó cả ứng dụng lẫn docker exec đều không fork được. kill -9 lên zombie không có tác dụng trong lab; với --init (tini) có 0 zombie và 14 PID. Zombie không tốn RAM hay CPU.' },
          { question: 'The journal uses 24 MB after a chatty service ran. <code>journalctl --vacuum-size=10M</code> reports <code>freed 0B</code> for every directory. Why, and what next?|||Journal chiếm 24 MB sau khi một dịch vụ lắm lời chạy. <code>journalctl --vacuum-size=10M</code> báo <code>freed 0B</code> ở mọi thư mục. Vì sao, và làm gì tiếp?',
            options: ['Vacuum only deletes archived journal files, never the active one: run <code>journalctl --rotate</code>, then vacuum again — and set <code>SystemMaxUse</code>|||Vacuum chỉ xoá các file journal đã lưu trữ, không bao giờ đụng file đang ghi: chạy <code>journalctl --rotate</code>, rồi vacuum lại — và đặt <code>SystemMaxUse</code>', 'The journal is already under 10 MB|||Journal vốn đã dưới 10 MB', 'You must delete /var/log/journal by hand with rm|||Bạn phải xoá /var/log/journal bằng tay với rm', 'Vacuum needs the --volumes flag|||Vacuum cần cờ --volumes'],
            correctIndex: 0, points: 1,
            explanation: 'EN: Measured in lesson 2.6: the first vacuum freed 0 B, then --rotate + the same vacuum deleted a 21.7 MB archived file and usage went from 24 MB to 8 MB. Deleting journal files by hand under a running journald is the deleted-but-open trap again.|||VI: Đo thật ở bài 2.6: lần vacuum đầu giải phóng 0 B, rồi --rotate + đúng lệnh vacuum đó xoá một file lưu trữ 21,7 MB và dung lượng đi từ 24 MB xuống 8 MB. Xoá tay file journal khi journald đang chạy lại là cái bẫy file đã xoá mà còn mở.' },
          { question: 'The Postgres container shows <code>Restarting (1)</code>. Logs: <code>PANIC: could not write to file … No space left on device</code>, then <code>FATAL: could not write lock file "postmaster.pid"</code>. <code>du</code> shows 44 MB of build cache and 40 MB of database on the same 96 MB disk. What do you do?|||Container Postgres hiện <code>Restarting (1)</code>. Log: <code>PANIC: could not write to file … No space left on device</code>, rồi <code>FATAL: could not write lock file "postmaster.pid"</code>. <code>du</code> cho thấy 44 MB build cache và 40 MB cơ sở dữ liệu trên cùng một đĩa 96 MB. Bạn làm gì?',
            options: ['Delete old files in <code>pg_wal</code> to make room|||Xoá các file cũ trong <code>pg_wal</code> để lấy chỗ', 'Increase the restart policy so it retries faster|||Tăng chính sách khởi động lại để nó thử lại nhanh hơn', 'Free space from rebuildable things (build cache, old images — never database files, never <code>--volumes</code>), then start Postgres and let it replay its WAL|||Lấy chỗ từ những thứ dựng lại được (build cache, ảnh cũ — không bao giờ là file cơ sở dữ liệu, không bao giờ <code>--volumes</code>), rồi khởi động Postgres và để nó chạy lại WAL', '<code>docker system prune -af --volumes</code> to free everything at once|||<code>docker system prune -af --volumes</code> để giải phóng mọi thứ một lần'],
            correctIndex: 2, points: 1,
            explanation: 'EN: In lesson 2.4, removing the 44 MB build cache let Postgres start, log "redo done … ready to accept connections" and all 20 000 rows were there — as on the VPS on 03/07/2026 (prune without --volumes, restart). WAL files are needed for recovery; deleting them can lose data. A restart policy cannot create free space, and --volumes deletes the database volume itself.|||VI: Ở bài 2.4, xoá 44 MB build cache giúp Postgres khởi động, ghi "redo done … ready to accept connections" và đủ cả 20 000 dòng — đúng như trên VPS ngày 03/07/2026 (prune không --volumes, khởi động lại). File WAL cần cho việc phục hồi; xoá chúng có thể mất dữ liệu. Chính sách khởi động lại không tạo ra chỗ trống, còn --volumes xoá luôn volume chứa cơ sở dữ liệu.' },
        ],
      },
    },
  ],
};
