/**
 * Linux & Bash — Chương 14: Linux chuyên sâu — nhân, hiệu năng, lưu trữ & bảo mật (chương MỚI, 09/2026).
 * Bên trong nhân (syscall, /proc, /sys, namespaces, cgroups v2, capabilities, OOM) · hiệu năng theo phương pháp USE
 * (mpstat, pidstat, vmstat, PSI, perf, iostat, fio, sar, iperf3) · lưu trữ (GPT trên file loop, mkfs, fstab, LVM,
 * swap file, checksum, rsync -c) · bảo mật sâu (ed25519, sshd -T, nftables, fail2ban cho log của app, SELinux,
 * AppArmor, sudoers hẹp, auditd, lynis) · quiz 10 câu.
 * LUẬT: backtick → &#96;; ${ của bash → \${; < > & trong code → &lt; &gt; &amp;; gạch chéo ngược viết đôi.
 * KHÔNG dùng <svg> (hình đi qua deck lx-14, 32 slide).
 * Output CHẠY THẬT 28/09/2026: container ubuntu:24.04 arm64 (nhân 7.0.12-linuxkit của Docker Desktop, systemd 255
 * khi chạy /sbin/init, --privileged NGẮN hạn, --memory 512m), Fedora 44 (linux-nha, SELinux enforcing, chỉ đọc +
 * ~/lxhoc-14), macOS 27 (chỉ lệnh đọc + thư mục nháp). Nối tiếp — không dạy lại — Bài 5.1 (/proc, strace), 5.2
 * (OOM, ulimit), 9.5 (ufw/nftables cơ bản), 10.1 (df -i), 10.2 (sha256sum), 11.3 (sshd -T, fail2ban mức nền),
 * 12.1 (USE nhập môn), 12.3 (vmstat, iostat).
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Chapter 14 — Linux in depth: kernel, performance, storage & security|||Chương 14 — Linux chuyên sâu: nhân, hiệu năng, lưu trữ & bảo mật',
  description: 'Mở nắp cái máy: syscall và /proc, container thật ra là namespaces + cgroups + capabilities, đo hiệu năng theo phương pháp USE tới tận hàm tốn CPU, dựng đĩa và LVM trên file mà không sợ hỏng, và gia cố máy chủ bằng những thứ bạn KIỂM được chứ không chỉ tin.',
  lessons: [
    /* ─────────────────────────── 14.0 ─────────────────────────── */
    {
      title: '14.0 — Chapter 14 slides: the kernel, performance, storage and security in pictures|||14.0 — Slide Chương 14: nhân, hiệu năng, lưu trữ và bảo mật bằng hình',
      slug: 'lnx-14-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 14: syscall và strace -c, /proc và /sys, 8 namespace, nsenter, cgroup v2 và systemd-run, capabilities, phương pháp USE, mpstat/pidstat, PSI, perf và flame graph, iostat/fio, sar/iperf3, năm tầng lưu trữ, GPT trên file loop, fstab, LVM, ext4/XFS, checksum, nftables, fail2ban, SELinux, sudoers hẹp, lynis và auditd.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">Chapters 10–12 taught you to run and repair a server. This chapter opens the lid. Skim the slides first to see its shape, then come back after the quiz as a revision sheet: what a system call costs (measured — the same megabyte written 200 times slower), the eight namespaces that make a "container", a cgroup killing a process at exactly 64 MB, a machine that looks 90% idle while one core is on fire, a flame graph built from a real <code>perf</code> profile, a disk grown by 250 MB while it was being written to, a firewall written by hand and tested from another machine, and two "narrow" sudo rules that hand out root.</p>
<p>Slides 3–9 belong to Lesson 14.1 (inside the kernel), 10–15 to 14.2 (performance), 16–21 to 14.3 (storage) and 22–28 to 14.4 (security). The last four are the chapter's common mistakes, a two-page cheat sheet and a 45-minute practice session. Every terminal is real output recorded on 28/09/2026 — in a short-lived privileged Ubuntu 24.04 container running real systemd, on a Fedora 44 machine with SELinux enforcing, and on a Mac. The slides are in Vietnamese; diagrams and code read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Chương 10–12 dạy bạn vận hành và chữa một máy chủ. Chương này mở nắp nó ra. Lướt bộ slide trước để thấy hình dạng của chương, rồi quay lại sau bài kiểm tra như một tờ ôn tập: một system call (lời gọi hệ thống) tốn bao nhiêu — đo thật: cùng một megabyte mà chậm gấp 200 lần; tám namespace làm nên cái gọi là "container"; một cgroup giết tiến trình đúng ở mốc 64 MB; một cái máy trông rảnh 90% trong khi một lõi đang cháy; một flame graph (biểu đồ ngọn lửa) dựng từ số đo <code>perf</code> thật; một ổ đĩa được nới thêm 250 MB ngay lúc đang bị ghi; một bộ luật tường lửa tự tay viết và thử từ máy khác; và hai luật sudo "hẹp" mà vẫn trao quyền root.</p>
<p>Slide 3–9 thuộc Bài 14.1 (bên trong nhân), 10–15 thuộc 14.2 (hiệu năng), 16–21 thuộc 14.3 (lưu trữ), 22–28 thuộc 14.4 (bảo mật). Bốn slide cuối là những sai lầm hay gặp, bảng tra nhanh hai trang và một buổi thực hành 45 phút. Mọi terminal trên slide là output THẬT, ghi ngày 28/09/2026 — trong một container Ubuntu 24.04 đặc quyền chạy systemd thật (dựng lên rồi xoá ngay), trên máy Fedora 44 bật SELinux, và trên Mac. Con số trên máy bạn sẽ khác; quy luật thì không.</p>
</div>
${gallery('lx-14', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Mọi việc thật đều đi qua một syscall'], [4, '/proc và /sys'], [5, 'Container = tiến trình + 8 namespace'],
  [6, 'unshare, lsns, nsenter, user namespace'], [7, 'cgroup v2: memory.max, cpu.max, pids.max'], [8, 'systemd-run, MemoryMax, OOMScoreAdjust'],
  [9, 'Capabilities'],
  [10, 'Phương pháp USE'], [11, 'Một lõi kịch trần: mpstat -P ALL, pidstat'], [12, 'Bão hoà: vmstat r, PSI'],
  [13, 'perf và flame graph'], [14, 'Đĩa: iostat -x, fio'], [15, 'Mạng: iperf3, sar -n DEV, ss -s'],
  [16, 'Năm tầng lưu trữ'], [17, 'Chia đĩa trên file loop'], [18, 'fstab: UUID và nofail'], [19, 'LVM: nới khi đang chạy'],
  [20, 'ext4 hay XFS, swap file'], [21, 'Checksum và rsync -c'],
  [22, 'Bảo mật nhiều lớp'], [23, 'SSH: ed25519 và sshd -T'], [24, 'nftables tự viết'], [25, 'fail2ban cho log của app'],
  [26, 'SELinux: nhãn'], [27, 'sudoers hẹp mà vẫn thành root'], [28, 'lynis và auditd'],
  [29, 'Sai lầm hay gặp'], [30, 'Bảng tra nhanh (1/2)'], [31, 'Bảng tra nhanh (2/2)'], [32, 'Thực hành chương 14'],
])}
`,
    },
    /* ─────────────────────────── 14.1 ─────────────────────────── */
    {
      title: '14.1 — Inside the kernel: system calls, /proc, namespaces, cgroups and capabilities|||14.1 — Bên trong nhân: system call, /proc, namespaces, cgroups và capabilities',
      slug: 'lnx-14-1-ben-trong-nhan',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Mọi chương trình nói chuyện với nhân qua system call (đo bằng strace -c), nhân mở cửa sổ qua /proc và /sys, và "container" thật ra là ba cơ chế của nhân ghép lại: namespaces che tầm nhìn, cgroups đặt trần tài nguyên, capabilities chẻ nhỏ quyền root — kèm OOM killer và oom_score_adj.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.1</span>
<h2>Inside the kernel</h2>
<p class="lead">You have used <code>docker run --memory 512m</code>, read <code>Exited (137)</code>, and watched a process vanish because "the OOM killer got it". This lesson shows the machinery underneath every one of those phrases. There is no magic in a container: it is an ordinary Linux process that the kernel has been asked to <em>see less</em> (namespaces), <em>use less</em> (cgroups) and <em>be allowed less</em> (capabilities). Once you can build that by hand in a few commands, Docker stops being a black box — and so does every "why was my process killed?" at 3am.</p>

<h3>Why this matters, and where it came from</h3>
<p>Every lesson so far has treated the kernel as the part you do not touch. That works until something happens that no userspace tool explains: a script that is inexplicably slow, a container killed with no log line, a root user inside Docker who still cannot <code>mount</code>. The pieces you are about to meet arrived one at a time over twenty years, and each solved a real problem:</p>
<table>
<tr><th>Year</th><th>Kernel</th><th>What arrived</th><th>Why</th></tr>
<tr><td>1999</td><td>2.2</td><td><strong>Capabilities</strong> — root's power split into separate units</td><td>so a program that only needs one privileged act does not get all of them</td></tr>
<tr><td>2002</td><td>2.4.19</td><td>The first namespace: <strong>mount</strong></td><td>a process could have its own view of the directory tree</td></tr>
<tr><td>2006–2008</td><td>2.6.19 – 2.6.24</td><td>UTS, IPC, PID, network namespaces; <strong>cgroups</strong> (from Google engineers) in 2.6.24</td><td>isolating and metering workloads on shared machines</td></tr>
<tr><td>2013</td><td>3.8</td><td>User namespaces usable without root; Docker released the same year</td><td>"root inside, nobody outside" — the basis of rootless containers</td></tr>
<tr><td>2016</td><td>4.5 / 4.6</td><td><strong>cgroup v2</strong> made official; cgroup namespace</td><td>v1's controllers had grown uncoordinated; v2 is one tree with one set of rules</td></tr>
</table>
<p>The dates come from the kernel's own manual pages (<code>capabilities(7)</code>, <code>clone(2)</code>, <code>cgroups(7)</code>). Docker, Podman, Kubernetes and systemd are all <em>clients</em> of these same kernel features; none of them invented isolation.</p>

<h3>System calls: the only door into the kernel</h3>
${slide('lx-14', 3, 'Mọi việc thật đều đi qua một syscall')}
<p>A program running in <strong>user space</strong> cannot touch the disk, the network or another process directly. To do anything real it asks the kernel through a <strong>system call</strong> (<code>read</code>, <code>write</code>, <code>openat</code>, <code>clone</code>, <code>execve</code>…). Each call is a switch from user mode to kernel mode and back — cheap, but not free. Lesson 5.1 used <code>strace</code> to <em>watch</em> <code>fork</code> and <code>exec</code>; here you use it to <em>count</em>. The cleanest demonstration writes the same megabyte two ways:</p>
<pre><code>time dd if=/dev/zero of=/tmp/a bs=1 count=1000000 status=none     <span class="tok-comment"># 1 byte per call</span>
time dd if=/dev/zero of=/tmp/b bs=1M count=1 status=none           <span class="tok-comment"># 1 MiB in one call</span>
strace -c -e trace=read,write dd if=/dev/zero of=/tmp/c bs=1 count=100000 status=none</code></pre>
<div class="out">real	0m0.638s   user 0m0.179s   sys 0m0.459s
real	0m0.003s   user 0m0.000s   sys 0m0.003s
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
 56.89    0.840222           8    100000           write
 43.11    0.636618           6    100001           read
------ ----------- ----------- --------- --------- ----------------
100.00    1.476840           7    200001           total</div>
<p>Same data, roughly 200 times slower, and most of the time is <code>sys</code> — time spent in the kernel, not in <code>dd</code>'s own code. That is the whole reason buffered I/O exists, and why a script that appends to a file one <code>echo</code> at a time inside a loop of a million iterations crawls. Read the <code>-c</code> table column by column: <code>calls</code> is how many times, <code>usecs/call</code> the average cost, <code>errors</code> how many failed (a column full of <code>ENOENT</code> errors on <code>openat</code> often reveals a program searching twenty paths for a config file). Note the last line too: under <code>strace</code> the 100,000-byte run took 1.48 s of syscall time. Tracing itself slows the program down heavily — never leave <code>strace</code> attached to a production process longer than you need.</p>
<table>
<tr><th>Flag</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>-c</code></td><td>Do not print each call; print a summary table at the end</td><td><code>strace -c ls /</code></td></tr>
<tr><td><code>-f</code></td><td>Follow children and threads (needed for shells, servers)</td><td><code>strace -f -e trace=execve bash -c '…'</code></td></tr>
<tr><td><code>-e trace=</code></td><td>Only these calls, or a class: <code>%file</code>, <code>%network</code>, <code>%process</code></td><td><code>strace -e trace=%file node app.js</code></td></tr>
<tr><td><code>-p PID</code></td><td>Attach to an already running process (root or same user)</td><td><code>strace -p 4121 -f</code></td></tr>
<tr><td><code>-T</code> · <code>-tt</code></td><td>Time spent in each call · wall-clock timestamp</td><td><code>openat(…) = 3 &lt;0.000066&gt;</code></td></tr>
<tr><td><code>-s N</code> · <code>-o file</code></td><td>Show N characters of strings · write the trace to a file</td><td><code>strace -s 200 -o t.txt curl …</code></td></tr>
<tr><td><code>-w</code> · <code>-S calls</code></td><td>With <code>-c</code>: wall time instead of CPU time · sort by count</td><td><code>strace -c -w -S calls …</code></td></tr>
</table>

<h3>/proc and /sys: the kernel as a filesystem</h3>
${slide('lx-14', 4, '/proc và /sys: nhân mở cửa sổ dạng file')}
<p>Lesson 5.1 introduced <code>/proc/PID/</code>. Two more windows matter at this depth. <code>/proc/sys/</code> holds the kernel's tunables, the same values the <code>sysctl</code> command reads and writes (a dot in the name is a slash in the path: <code>vm.swappiness</code> = <code>/proc/sys/vm/swappiness</code>). And <code>/sys</code> (sysfs) describes devices and kernel objects: every network card under <code>/sys/class/net/</code>, every block device under <code>/sys/block/</code>, and the entire cgroup tree under <code>/sys/fs/cgroup/</code>. None of these files exists on disk; the kernel generates the contents when you read them.</p>
<pre><code>grep -E "^(Name|State|VmRSS|CapEff)" /proc/self/status
sysctl vm.swappiness net.ipv4.ip_forward
cat /sys/class/net/eth0/mtu /sys/class/net/eth0/operstate</code></pre>
<div class="out">Name:	grep
State:	R (running)
VmRSS:	    1540 kB
CapEff:	000001ffffffffff
vm.swappiness = 60
net.ipv4.ip_forward = 1
65535
up</div>
<p>A change made with <code>sysctl -w</code> lasts until reboot. To make it permanent, put it in a file under <code>/etc/sysctl.d/</code> and apply it:</p>
<pre><code>echo "net.ipv4.ip_unprivileged_port_start = 80" &gt; /etc/sysctl.d/99-cong.conf
sysctl -p /etc/sysctl.d/99-cong.conf       <span class="tok-comment"># apply this one file</span>
sysctl --system                            <span class="tok-comment"># re-apply EVERY file, in order</span></code></pre>
<div class="out">net.ipv4.ip_unprivileged_port_start = 80
* Applying /usr/lib/sysctl.d/99-protect-links.conf ...
* Applying /etc/sysctl.d/99-sysctl.conf ...
* Applying /etc/sysctl.conf ...</div>
<div class="callout warn"><strong>A privileged container shares the host's kernel settings.</strong> Most <code>net.*</code> values belong to a network namespace, so changing them inside a container only affects that container. But <code>vm.*</code>, <code>kernel.*</code> and <code>fs.*</code> are global: running <code>sysctl --system</code> inside a <code>--privileged</code> container while writing this lesson re-applied Ubuntu's defaults (<code>kernel.yama.ptrace_scope</code>, <code>vm.max_map_count</code>, <code>fs.protected_regular</code>…) to the whole Docker Desktop virtual machine. Harmless that time, and gone after Docker restarts — but it is exactly why <code>--privileged</code> is for short experiments, never for a service.</div>

<h3>Namespaces: a container is a process that sees less</h3>
${slide('lx-14', 5, 'Container = tiến trình thường + 8 namespace')}
<p>A <strong>namespace</strong> wraps one kind of global resource so that the processes inside get their own private copy. There are eight kinds today: <code>pid</code> (process numbers), <code>mnt</code> (the mount table), <code>net</code> (interfaces, ports, firewall rules), <code>uts</code> (hostname), <code>ipc</code>, <code>user</code> (user and group IDs), <code>cgroup</code> and <code>time</code>. A Docker container is simply a process started inside a fresh set of them. You can make one without Docker, with <code>unshare</code> from util-linux:</p>
<pre><code>unshare --pid --fork --mount-proc bash -c "sleep 100 &amp; ps -e -o pid,ppid,comm"
hostname; unshare --uts bash -c "hostname may-thu; hostname"; hostname
unshare --net ip -br link show lo</code></pre>
<div class="out">    PID    PPID COMMAND
      1       0 bash
      2       1 sleep
      3       1 ps
vps-14
may-thu
vps-14
lo               DOWN           00:00:00:00:00:00 &lt;LOOPBACK&gt;</div>
<p>Three results, three namespaces. In the new PID namespace, <code>bash</code> is PID 1 and sees only its own children — exactly what you see inside a container, and why Lesson 5.1's "PID 1 never reaps zombies" trap appears in containers at all. The UTS namespace let us rename the machine and the rename vanished when <code>bash</code> exited. The new network namespace has nothing but a loopback that is <em>down</em>: no card, no route, no internet. Docker's job after that is to plug a virtual cable (<code>veth</code>) into it.</p>
<table>
<tr><th><code>unshare</code> flag</th><th>New namespace</th><th>Note</th></tr>
<tr><td><code>--pid --fork</code></td><td>PID</td><td><code>--fork</code> is required: the <em>child</em> becomes PID 1, not <code>unshare</code> itself</td></tr>
<tr><td><code>--mount-proc</code></td><td>(mount + fresh <code>/proc</code>)</td><td>without it, <code>ps</code> still reads the host's <code>/proc</code> and shows every process</td></tr>
<tr><td><code>--uts</code> · <code>--ipc</code></td><td>hostname · IPC</td><td>cheap; containers always get both</td></tr>
<tr><td><code>--net</code></td><td>network</td><td>starts with only <code>lo</code>, down</td></tr>
<tr><td><code>--user --map-root-user</code></td><td>user</td><td>works WITHOUT root; you become "root" mapped to your own UID</td></tr>
<tr><td><code>--mount</code> · <code>--cgroup</code> · <code>--time</code></td><td>mount · cgroup · time</td><td>the remaining three</td></tr>
</table>

<h3>Seeing and entering namespaces: lsns, nsenter, and the fake root</h3>
${slide('lx-14', 6, 'unshare tạo, lsns liệt kê, nsenter bước vào')}
<p>Every process's namespaces are listed as links in <code>/proc/PID/ns/</code>; two processes share a namespace when the numbers match. <code>lsns</code> reads them for you, and <code>nsenter</code> runs a command <em>inside</em> another process's namespaces:</p>
<pre><code>unshare --uts --pid --fork --mount-proc bash -c "hostname hop-kin; exec sleep 300" &amp;
P=$(pgrep -f "^sleep 300"); lsns -p "$P"
nsenter -t "$P" -u -p -m bash -c "hostname; ps -e -o pid,comm"</code></pre>
<div class="out">        NS TYPE   NPROCS   PID USER COMMAND
4026532969 net         5     1 root sleep infinity
4026533236 mnt         2   109 root unshare --uts --pid --fork --mount-proc bash -c hostname hop-kin; exec sleep 300
4026533238 uts         2   109 root unshare --uts --pid --fork --mount-proc bash -c hostname hop-kin; exec sleep 300
4026533239 pid         1   111 root &#96;-sleep 300
hop-kin
    PID COMMAND
      1 sleep
      3 ps</div>
<p>Read <code>lsns -p</code> as "which namespaces is this process in": it shares <code>net</code> (and others, cut here) with PID 1 of the machine, but has its own <code>mnt</code>, <code>uts</code> and <code>pid</code>. <code>nsenter -t PID -u -p -m</code> then joins exactly those three, so our <code>bash</code> sees the hostname <code>hop-kin</code> and a process list where <code>sleep</code> is PID 1. That is precisely what <code>docker exec -it web sh</code> does: find the container's main PID, enter its namespaces, start a shell. When <code>docker exec</code> is not available (a crashed Docker daemon, a stripped image with no shell), <code>nsenter -t "$(docker inspect -f '{{.State.Pid}}' web)" -n ss -ltn</code> still lets a root user look inside — here, using the host's own <code>ss</code> inside the container's network namespace.</p>
<p>The user namespace is the one that works without root at all:</p>
<pre><code>id -u
unshare --user --map-root-user bash -c "id; touch /etc/x; cat /proc/self/uid_map"</code></pre>
<div class="out">1001
uid=0(root) gid=0(root) groups=0(root)
touch: cannot touch '/etc/x': Permission denied
         0       1001          1</div>
<p>Inside, <code>id</code> says root. Outside, the kernel still sees UID 1001 — the <code>uid_map</code> line reads "UID 0 inside = UID 1001 outside, for 1 ID" — so <code>/etc</code> stays read-only. That mapping is the foundation of rootless Docker and Podman: a container escape lands you as an ordinary user, not as the host's root. The course <a href="/courses/docker">Docker</a> builds on everything in this section.</p>

<h3>cgroups v2: a ceiling for a group of processes</h3>
${slide('lx-14', 7, 'cgroup v2: memory.max, cpu.max, pids.max')}
<p>Namespaces limit what a process can <em>see</em>; <strong>control groups</strong> limit what it can <em>use</em>. With cgroup v2 (the only kind on Ubuntu 24.04, Fedora and every current distribution) there is one tree, mounted at <code>/sys/fs/cgroup</code>. Every directory is a group; its files are its settings; writing a PID into <code>cgroup.procs</code> moves that process into the group. This is the very file Docker writes when you pass <code>--memory</code> — inside a container started with <code>--memory 512m</code>, <code>cat /sys/fs/cgroup/memory.max</code> prints <code>536870912</code>. Built by hand in a privileged container:</p>
<pre><code>cd /sys/fs/cgroup
mkdir init; for p in $(cat cgroup.procs); do echo "$p" &gt; init/cgroup.procs; done
echo "+memory +cpu +pids" &gt; cgroup.subtree_control
mkdir demo; echo 64M &gt; demo/memory.max; echo 0 &gt; demo/memory.swap.max
bash -c 'echo $$ &gt; /sys/fs/cgroup/demo/cgroup.procs
         python3 -c "b=bytearray(200*1024*1024)"; echo "exit=$?"'
cat demo/memory.events</code></pre>
<div class="out">bash: line 1:   166 Killed                  python3 -c "b=bytearray(200*1024*1024)"
exit=137
low 0
high 0
max 38
oom 1
oom_kill 1
oom_group_kill 0</div>
<p>The second line explains a rule that trips everyone: <strong>no internal processes</strong>. A cgroup that hands controllers down to its children (<code>cgroup.subtree_control</code>) may not itself contain processes, so we first moved everything into a leaf called <code>init</code>. Then the experiment: a 200 MB allocation in a 64 MB group dies with <code>SIGKILL</code> — exit 137 = 128 + 9, the number from Lesson 5.3 — and <code>memory.events</code> records <code>oom_kill 1</code>. That counter is the proof to look for when a container "just disappears": <code>docker inspect -f '{{.State.OOMKilled}}'</code> reads the same fact.</p>
<p>CPU and process-count limits work the same way. <code>cpu.max</code> is "quota period" in microseconds, so <code>20000 100000</code> means 20 ms of CPU in every 100 ms — 20% of one core:</p>
<pre><code>mkdir cpu20; echo "20000 100000" &gt; cpu20/cpu.max
bash -c 'echo $$ &gt; /sys/fs/cgroup/cpu20/cgroup.procs; timeout 5 bash -c "while :; do :; done"'
grep -E "usage_usec|nr_throttled|throttled_usec" cpu20/cpu.stat
mkdir p5; echo 5 &gt; p5/pids.max
bash -c 'echo $$ &gt; /sys/fs/cgroup/p5/cgroup.procs; for i in 1 2 3 4 5 6; do sleep 30 &amp; done; wait'</code></pre>
<div class="out">usage_usec 1021854
nr_throttled 51
throttled_usec 4063814
bash: fork: retry: Resource temporarily unavailable
bash: fork: retry: Resource temporarily unavailable</div>
<p>Five seconds of a busy loop consumed 1.02 s of CPU (20%), and the kernel throttled it 51 times. <code>nr_throttled</code> climbing on a production container is the tell-tale that a CPU limit, not slow code, is making it slow. The <code>pids.max</code> group refused the sixth process: this is also how a fork bomb is stopped cold.</p>
<table>
<tr><th>File</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>cgroup.procs</code></td><td>PIDs in this group; write one to move it</td><td><code>echo $$ &gt; g/cgroup.procs</code></td></tr>
<tr><td><code>cgroup.subtree_control</code></td><td>Controllers handed to children</td><td><code>echo +memory &gt; cgroup.subtree_control</code></td></tr>
<tr><td><code>memory.max</code> · <code>memory.high</code></td><td>Hard ceiling (OOM-kill beyond) · soft ceiling (slow down and reclaim)</td><td><code>echo 512M &gt; g/memory.max</code></td></tr>
<tr><td><code>memory.current</code> · <code>memory.peak</code></td><td>Usage now · highest ever</td><td><code>cat g/memory.peak</code> → <code>67108864</code></td></tr>
<tr><td><code>memory.events</code></td><td>Counters: <code>oom</code>, <code>oom_kill</code>, <code>high</code>…</td><td>the first file to read after a 137</td></tr>
<tr><td><code>cpu.max</code> · <code>cpu.weight</code></td><td>Hard quota · relative share under contention (default 100)</td><td><code>echo "50000 100000" &gt; g/cpu.max</code></td></tr>
<tr><td><code>cpu.stat</code></td><td><code>usage_usec</code>, <code>nr_throttled</code>, <code>throttled_usec</code></td><td>is the limit biting?</td></tr>
<tr><td><code>pids.max</code> · <code>io.max</code></td><td>Maximum tasks · per-device I/O limits</td><td><code>echo 100 &gt; g/pids.max</code></td></tr>
</table>

<h3>Let systemd do it: MemoryMax, systemd-run and OOMScoreAdjust</h3>
${slide('lx-14', 8, 'systemd-run, MemoryMax, OOMScoreAdjust')}
<p>On a real server you never create cgroups by hand: systemd owns the tree, and every service already lives in its own group (<code>systemd-cgls</code> draws it). You set limits as unit directives — <code>MemoryMax=</code>, <code>CPUQuota=</code>, <code>TasksMax=</code> — which Lesson 11.1 put in a drop-in. <code>systemd-run</code> applies the same directives to a one-off command, which makes it the fastest way to <em>test</em> a limit:</p>
<pre><code>systemd-run --scope -p MemoryMax=64M -p MemorySwapMax=0 --unit=thu-bo-nho \\
  python3 -c "b=bytearray(200*1024*1024)"; echo "exit=$?"
journalctl -n 6 -o cat | grep -iE "thu-bo-nho|oom"
systemd-run --unit=nang -p MemoryMax=64M -p MemorySwapMax=0 \\
  python3 -c "import time; b=bytearray(40*1024*1024); time.sleep(60)"
systemctl status nang --no-pager | grep Memory
systemd-cgtop -n1 -b --order=memory | head -4</code></pre>
<div class="out">Running as unit: thu-bo-nho.scope; invocation ID: 9ed3d2525a5d42658e767645c6abe837
exit=137
Memory cgroup out of memory: Killed process 59344 (python3) total-vm:219292kB, anon-rss:65328kB, … oom_score_adj:0
thu-bo-nho.scope: A process of this unit has been killed by the OOM killer.
thu-bo-nho.scope: Failed with result 'oom-kill'.
Running as unit: nang.service; invocation ID: 1dc8aa465dc94e96833f6642b3ef40de
     Memory: 43.0M (max: 64.0M swap max: 0B available: 21.0M peak: 43.0M)
/                                                       14      -    85.9M        -        -
system.slice                                            10      -    77.0M        -        -
system.slice/nang.service                                1      -    43.0M        -        -</div>
<p><code>--scope</code> runs the command in your terminal but inside its own cgroup; without it, <code>systemd-run</code> creates a transient <code>.service</code> that runs in the background. The same works without root on a machine with a user systemd: on Fedora, <code>systemd-run --user --scope -p MemoryMax=64M -p MemorySwapMax=0 python3 -c "b=bytearray(200*1024*1024)"</code> also ended with <code>exit=137</code>.</p>
<p>When the <em>whole machine</em> runs out of memory (not one group), the kernel's OOM killer picks a victim by a score, readable in <code>/proc/PID/oom_score</code>. You bias the choice with <code>oom_score_adj</code>, from −1000 ("never kill me") to +1000 ("kill me first"). Lesson 5.2 showed the kill itself; this is the knob:</p>
<pre><code>choom -p 125                     <span class="tok-comment"># read score and adjustment</span>
choom -p 125 -n 500              <span class="tok-comment"># make it a preferred victim</span>
systemd-run --unit=quan-trong -p OOMScoreAdjust=-900 sleep 300
choom -p "$(systemctl show -p MainPID --value quan-trong)"</code></pre>
<div class="out">pid 125's current OOM score: 670
pid 125's current OOM score adjust value: 0
pid 125's OOM score adjust value changed from 0 to 500
pid 144's current OOM score: 67
pid 144's current OOM score adjust value: -900</div>
<p>In a unit file, <code>OOMScoreAdjust=-900</code> protects your database; <code>+500</code> on a batch job volunteers it first. An ordinary user may <em>raise</em> their own process's value (writing <code>300</code> worked) but not lower it: writing <code>-100</code> as a normal user failed with <code>Permission denied</code>. Two related limits live elsewhere and were covered earlier: per-process <code>ulimit</code> and <code>LimitNOFILE=</code> (Lesson 5.2).</p>

<h3>Capabilities: root, split into pieces</h3>
${slide('lx-14', 9, 'Capabilities')}
<p>Since Linux 2.2, "root" is not one privilege but about forty separate <strong>capabilities</strong> (41 on this kernel): <code>CAP_NET_BIND_SERVICE</code> (open a port below 1024), <code>CAP_CHOWN</code>, <code>CAP_KILL</code>, <code>CAP_SYS_ADMIN</code> (the catch-all: mount, set the hostname, many more)… A process's effective set is the <code>CapEff</code> hex mask in <code>/proc/PID/status</code>; <code>capsh --decode</code> turns it into names. Docker gives a container's root only 14 of them:</p>
<pre><code>docker run --rm ubuntu:24.04 grep CapEff /proc/self/status
capsh --decode=00000000a80425fb
docker run --rm --cap-drop ALL ubuntu:24.04 chown nobody /tmp</code></pre>
<div class="out">CapEff:	00000000a80425fb
0x00000000a80425fb=cap_chown,cap_dac_override,cap_fowner,cap_fsetid,cap_kill,cap_setgid,cap_setuid,cap_setpcap,cap_net_bind_service,cap_net_raw,cap_sys_chroot,cap_mknod,cap_audit_write,cap_setfcap
chown: changing ownership of '/tmp': Operation not permitted</div>
<p>That is why <code>hostname x</code> or <code>mount</code> fails inside a normal container even as root: no <code>cap_sys_admin</code>. It works the other way too — you can give an ordinary program exactly one privilege instead of running it as root. Here a normal user starts a web server on port 80 (the container's <code>ip_unprivileged_port_start</code> was set back to the usual 1024 first; Docker sets it to 0 inside containers):</p>
<pre><code>cp /usr/bin/python3.12 /usr/local/bin/py-web
su an -c "/usr/local/bin/py-web -m http.server 80"
setcap cap_net_bind_service=+ep /usr/local/bin/py-web
getcap /usr/local/bin/py-web
su an -c 'timeout 2 /usr/local/bin/py-web -m http.server 80; echo rc=$?'
getcap /usr/bin/ping</code></pre>
<div class="out">PermissionError: [Errno 13] Permission denied
/usr/local/bin/py-web cap_net_bind_service=ep
rc=124
/usr/bin/ping cap_net_raw=ep</div>
<p><code>rc=124</code> means <code>timeout</code> had to kill it — the server was up and listening. <code>+ep</code> = add to the file's <em>effective</em> and <em>permitted</em> sets. <code>ping</code> ships the same way: one capability instead of the setuid-root bit of Lesson 4.3. For a service, prefer the systemd directives <code>AmbientCapabilities=CAP_NET_BIND_SERVICE</code> with <code>User=app</code>, and in Docker <code>--cap-drop ALL --cap-add NET_BIND_SERVICE</code>.</p>
<div class="pitfall co-tieu-de"><strong>Never <code>setcap</code> a general-purpose interpreter.</strong> The demo copied Python to <code>/usr/local/bin/py-web</code> on purpose. Putting <code>cap_net_bind_service</code> — let alone <code>cap_sys_admin</code> or <code>cap_dac_override</code> — on <code>/usr/bin/python3</code> hands that power to <em>every</em> Python script any user runs, and the next package upgrade silently removes it anyway. Give the capability to the service (<code>AmbientCapabilities=</code>) or to a dedicated binary, and audit with <code>getcap -r / 2&gt;/dev/null</code>.</div>

<h3>Try it step by step: a "container" in five commands</h3>
<p>In a throwaway privileged container (<code>docker run --rm -it --privileged --name lab-ns ubuntu:24.04 bash</code>, then <code>apt-get update &amp;&amp; apt-get install -y python3 libcap2-bin</code>), build the three ingredients by hand and check each one:</p>
<ol>
<li><code>unshare --pid --uts --net --mount --fork --mount-proc bash</code> — you are now PID 1 in your own namespaces. Check with <code>echo $$</code> (→ <code>1</code>), <code>ps -e</code> (two processes), <code>ip -br link</code> (only <code>lo</code>).</li>
<li><code>hostname hop-cua-toi; hostname</code>, then from a second terminal <code>docker exec lab-ns hostname</code> — the outside name did not change.</li>
<li>Back in the outer shell, create a cgroup with <code>memory.max=64M</code> as above and move the inner shell's PID into it (find it with <code>lsns -t pid</code>).</li>
<li>Inside, run the 200 MB <code>bytearray</code> — expect <code>Killed</code> and <code>oom_kill 1</code> in <code>memory.events</code>.</li>
<li><code>capsh --drop=cap_chown -- -c "touch /tmp/x; chown nobody /tmp/x"</code> — root, and still <code>Operation not permitted</code>.</li>
</ol>
<p>That is, piece for piece, what <code>docker run --memory 64m --cap-drop CHOWN</code> sets up. Exit and the container vanishes with everything in it.</p>

<h3>How macOS and WSL differ</h3>
<table>
<tr><th>Topic</th><th>Linux (Ubuntu/Fedora)</th><th>macOS 27 (measured)</th><th>WSL2</th></tr>
<tr><td>Kernel</td><td>Linux</td><td>XNU (Darwin 27.0.0) — none of this lesson exists</td><td>a real Linux kernel built by Microsoft</td></tr>
<tr><td><code>/proc</code></td><td>yes</td><td><code>ls: /proc: No such file or directory</code>; use <code>sysctl kern.…</code>, <code>ps</code>, <code>vm_stat</code></td><td>yes</td></tr>
<tr><td>Tracing syscalls</td><td><code>strace</code></td><td><code>dtruss</code>, blocked by SIP: <code>DTrace requires additional privileges</code></td><td><code>strace</code> works</td></tr>
<tr><td>Namespaces, cgroups</td><td>yes</td><td>no — Docker Desktop runs a Linux VM (kernel <code>7.0.12-linuxkit</code> here) and every container lives inside it</td><td>yes (cgroup v2)</td></tr>
</table>
<p>So on a Mac, "try it in a container" is the right answer for this whole chapter: the kernel you are poking is the Docker VM's, not macOS's.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your team's API container on the VPS "restarts by itself" a few times a day with <code>Exited (137)</code> and nothing in its log. Prove what is killing it, using a throwaway container (<code>docker run --rm -it --privileged --memory 512m ubuntu:24.04 bash</code>, then <code>apt-get install -y python3 strace util-linux</code>).</p><ol>
<li>Make a cgroup <code>api</code> with <code>memory.max = 100M</code> and <code>memory.swap.max = 0</code> (remember the "no internal processes" step).</li>
<li>Move a shell into it and run <code>python3 -c "b=bytearray(300*1024*1024)"; echo $?</code>.</li>
<li>Read <code>api/memory.events</code> and <code>api/memory.peak</code>; write down the two numbers that prove it was an OOM kill inside the group, not a crash.</li>
<li>Run <code>strace -c -f python3 -c "print(1)"</code> and find the syscall with the most calls.</li>
<li>Show that the container's root lacks <code>cap_sys_admin</code>: start a second container WITHOUT <code>--privileged</code> and compare <code>grep CapEff /proc/self/status</code>.</li></ol>
<p><strong>Done when:</strong> you have <code>exit 137</code>, <code>oom_kill 1</code> and a <code>memory.peak</code> of about <code>104857600</code>; you can name the most frequent syscall; and the two <code>CapEff</code> values differ (<code>000001ffffffffff</code> vs <code>00000000a80425fb</code>).</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">System call (syscall)</span><span class="v">The only way a program asks the kernel to do something real: read, write, open, create a process.</span></div>
  <div class="kv"><span class="k">User space / kernel space</span><span class="v">Where your programs run versus where the kernel runs with full hardware access.</span></div>
  <div class="kv"><span class="k">sysfs / procfs</span><span class="v">Virtual filesystems (<code>/sys</code>, <code>/proc</code>) through which the kernel shows and accepts settings.</span></div>
  <div class="kv"><span class="k">Namespace</span><span class="v">A private copy of one global resource (PIDs, hostname, network…) for a group of processes.</span></div>
  <div class="kv"><span class="k">Control group (cgroup)</span><span class="v">A group of processes with shared resource limits and counters, as a directory in <code>/sys/fs/cgroup</code>.</span></div>
  <div class="kv"><span class="k">Throttling</span><span class="v">The kernel pausing a group that used up its CPU quota for this period.</span></div>
  <div class="kv"><span class="k">Capability</span><span class="v">One piece of root's power, grantable on its own (<code>CAP_NET_BIND_SERVICE</code>).</span></div>
  <div class="kv"><span class="k">oom_score_adj</span><span class="v">A −1000…+1000 bias on which process the OOM killer picks first.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Everything real goes through a syscall; <code>strace -c</code> counts them, and a million tiny writes cost ~200× one big write.</li>
<li><code>/proc/sys</code> = <code>sysctl</code>; make changes permanent in <code>/etc/sysctl.d/</code>, and remember global keys are shared with a privileged container.</li>
<li>A container is a process in new namespaces; <code>unshare</code> creates them, <code>lsns</code> lists them, <code>nsenter</code> (what <code>docker exec</code> does) enters them.</li>
<li>cgroup v2 is one tree of directories; <code>memory.max</code>, <code>cpu.max</code> and <code>pids.max</code> are the limits, <code>memory.events</code> and <code>cpu.stat</code> the evidence.</li>
<li>On a real server let systemd manage cgroups: <code>MemoryMax=</code>, <code>systemd-run -p …</code> to test, <code>OOMScoreAdjust=</code> to choose who dies first.</li>
<li>Capabilities replace "run it as root": grant one (<code>setcap</code>, <code>AmbientCapabilities=</code>, <code>--cap-add</code>) and drop the rest.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man7/namespaces.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">namespaces(7)</span><span class="lc-sub">The eight namespace types, the <code>/proc/PID/ns</code> links and the kernel versions they arrived in.</span></span>
</a>
<a class="link-card" href="https://docs.kernel.org/admin-guide/cgroup-v2.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Control Group v2 — the kernel's own documentation</span><span class="lc-sub">Every interface file (<code>memory.max</code>, <code>cpu.max</code>, <code>memory.events</code>…) and the "no internal processes" rule, from the source.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man7/capabilities.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">capabilities(7)</span><span class="lc-sub">What each capability allows, and the permitted/effective/ambient sets behind <code>+ep</code>.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/strace.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">strace(1)</span><span class="lc-sub">All the filters (<code>-e trace=%file</code>, <code>%network</code>…) and the summary options used in this lesson.</span></span>
</a>
<a class="link-card codelab" href="/courses/docker" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Docker — full course on this site</span><span class="lc-sub">What Docker builds on top of namespaces, cgroups and capabilities: images, volumes, networks, Compose.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Code Lab: Linux &amp; Bash</span><span class="lc-sub">Graded exercises for the whole course, in a real shell.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>"It was killed" is not a diagnosis until you know by whom.</strong> Exit 137 only says SIGKILL. It could be the cgroup limit (<code>memory.events</code> → <code>oom_kill</code>), the whole machine's OOM killer (<code>journalctl -k | grep -i "out of memory"</code>), <code>docker stop</code> giving up after 10 seconds (Lesson 5.3), or a person with <code>kill -9</code>. Check the counters before raising a limit — a leaking process given twice the memory just dies half as often.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Count before you guess: <code>strace -c</code> and <code>cpu.stat</code> turn "it feels slow" into numbers. A container is not a VM — it is your kernel with a narrower view, which is why a <code>--privileged</code> one can change your host. And the evidence for every kill is written down somewhere: <code>memory.events</code>, the kernel log, or <code>docker inspect</code>.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.1</span>
<h2>Bên trong nhân</h2>
<p class="lead">Bạn đã gõ <code>docker run --memory 512m</code>, đã đọc <code>Exited (137)</code>, đã thấy một tiến trình biến mất vì "OOM killer bắt nó". Bài này cho bạn thấy bộ máy nằm dưới từng câu nói đó. Container chẳng có phép màu nào: nó là một tiến trình Linux bình thường mà nhân được yêu cầu cho <em>thấy ít hơn</em> (namespaces — không gian tên), <em>dùng ít hơn</em> (cgroups — nhóm kiểm soát) và <em>được phép ít hơn</em> (capabilities — năng lực con của root). Một khi bạn tự dựng được nó bằng vài lệnh, Docker thôi là hộp đen — và câu hỏi "vì sao tiến trình của tôi bị giết?" lúc 3 giờ sáng cũng vậy.</p>

<h3>Vì sao cần biết, và những thứ này từ đâu ra</h3>
<p>Tới giờ, mọi bài đều coi nhân là phần không đụng tới. Cách đó ổn cho tới khi xảy ra thứ mà không công cụ nào ở tầng người dùng giải thích nổi: một script chậm vô lý, một container bị giết mà log không có dòng nào, một người dùng root bên trong Docker vẫn không <code>mount</code> được. Những mảnh bạn sắp gặp tới từng cái một trong suốt hai mươi năm, và mỗi cái giải một bài toán thật:</p>
<table>
<tr><th>Năm</th><th>Nhân</th><th>Thứ gì ra đời</th><th>Để làm gì</th></tr>
<tr><td>1999</td><td>2.2</td><td><strong>Capabilities</strong> — quyền của root chẻ thành từng phần riêng</td><td>chương trình chỉ cần MỘT việc đặc quyền thì không phải nhận tất cả</td></tr>
<tr><td>2002</td><td>2.4.19</td><td>Namespace đầu tiên: <strong>mount</strong></td><td>một tiến trình có cách nhìn cây thư mục của riêng nó</td></tr>
<tr><td>2006–2008</td><td>2.6.19 – 2.6.24</td><td>Namespace UTS, IPC, PID, mạng; <strong>cgroups</strong> (do kỹ sư Google đóng góp) vào 2.6.24</td><td>cô lập và đo đếm các khối việc chạy chung một máy</td></tr>
<tr><td>2013</td><td>3.8</td><td>User namespace dùng được không cần root; Docker ra đời cùng năm</td><td>"root bên trong, người thường bên ngoài" — nền của container rootless</td></tr>
<tr><td>2016</td><td>4.5 / 4.6</td><td><strong>cgroup v2</strong> chính thức; cgroup namespace</td><td>các bộ điều khiển của v1 mọc lên rời rạc; v2 là một cây với một bộ luật</td></tr>
</table>
<p>Các mốc lấy từ chính trang hướng dẫn của nhân (<code>capabilities(7)</code>, <code>clone(2)</code>, <code>cgroups(7)</code>). Docker, Podman, Kubernetes và systemd đều là <em>khách hàng</em> của cùng những tính năng này của nhân; không ai trong số đó phát minh ra sự cô lập.</p>

<h3>System call: cánh cửa duy nhất vào nhân</h3>
${slide('lx-14', 3, 'Mọi việc thật đều đi qua một syscall')}
<p>Một chương trình chạy ở <strong>user space</strong> (vùng người dùng) không được tự đụng vào đĩa, mạng hay tiến trình khác. Muốn làm bất cứ việc gì thật, nó phải nhờ nhân qua một <strong>system call</strong> (lời gọi hệ thống — <code>read</code>, <code>write</code>, <code>openat</code>, <code>clone</code>, <code>execve</code>…). Mỗi lời gọi là một lần chuyển từ chế độ người dùng sang chế độ nhân rồi quay về — rẻ, nhưng không miễn phí. Bài 5.1 dùng <code>strace</code> để <em>xem</em> <code>fork</code> và <code>exec</code>; ở đây ta dùng nó để <em>đếm</em>. Cách chứng minh gọn nhất là ghi cùng một megabyte theo hai kiểu:</p>
<pre><code>time dd if=/dev/zero of=/tmp/a bs=1 count=1000000 status=none     <span class="tok-comment"># mỗi lời gọi 1 byte</span>
time dd if=/dev/zero of=/tmp/b bs=1M count=1 status=none           <span class="tok-comment"># 1 MiB trong một lời gọi</span>
strace -c -e trace=read,write dd if=/dev/zero of=/tmp/c bs=1 count=100000 status=none</code></pre>
<div class="out">real	0m0.638s   user 0m0.179s   sys 0m0.459s
real	0m0.003s   user 0m0.000s   sys 0m0.003s
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
 56.89    0.840222           8    100000           write
 43.11    0.636618           6    100001           read
------ ----------- ----------- --------- --------- ----------------
100.00    1.476840           7    200001           total</div>
<p>Cùng dữ liệu, chậm hơn khoảng 200 lần, và phần lớn thời gian là <code>sys</code> — thời gian nằm trong nhân, không phải trong mã của <code>dd</code>. Đó là toàn bộ lý do bộ đệm I/O tồn tại, và vì sao một script nối vào file bằng từng lệnh <code>echo</code> trong một vòng lặp một triệu lượt lại bò như rùa. Đọc bảng của <code>-c</code> từng cột: <code>calls</code> là số lần gọi, <code>usecs/call</code> là giá trung bình mỗi lần (micro giây), <code>errors</code> là số lần hỏng (một cột đầy lỗi <code>ENOENT</code> ở <code>openat</code> thường lộ ra một chương trình đang dò hai mươi đường dẫn để tìm file cấu hình). Để ý cả dòng cuối: dưới <code>strace</code>, lượt 100.000 byte tốn 1,48 giây thời gian syscall. Bản thân việc theo dõi làm chương trình chậm đi rất nhiều — đừng bao giờ để <code>strace</code> bám vào một tiến trình production lâu hơn mức cần.</p>
<table>
<tr><th>Cờ</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>-c</code></td><td>Không in từng lời gọi; cuối cùng in một bảng tổng kết</td><td><code>strace -c ls /</code></td></tr>
<tr><td><code>-f</code></td><td>Theo cả tiến trình con và luồng (cần cho shell, server)</td><td><code>strace -f -e trace=execve bash -c '…'</code></td></tr>
<tr><td><code>-e trace=</code></td><td>Chỉ những lời gọi này, hoặc một nhóm: <code>%file</code>, <code>%network</code>, <code>%process</code></td><td><code>strace -e trace=%file node app.js</code></td></tr>
<tr><td><code>-p PID</code></td><td>Bám vào một tiến trình đang chạy (root hoặc cùng người dùng)</td><td><code>strace -p 4121 -f</code></td></tr>
<tr><td><code>-T</code> · <code>-tt</code></td><td>Thời gian nằm trong mỗi lời gọi · mốc giờ đồng hồ</td><td><code>openat(…) = 3 &lt;0.000066&gt;</code></td></tr>
<tr><td><code>-s N</code> · <code>-o file</code></td><td>Hiện N ký tự của chuỗi · ghi dấu vết ra file</td><td><code>strace -s 200 -o t.txt curl …</code></td></tr>
<tr><td><code>-w</code> · <code>-S calls</code></td><td>Đi với <code>-c</code>: tính thời gian thực thay vì thời gian CPU · xếp theo số lần gọi</td><td><code>strace -c -w -S calls …</code></td></tr>
</table>

<h3>/proc và /sys: nhân dưới dạng một hệ thống file</h3>
${slide('lx-14', 4, '/proc và /sys: nhân mở cửa sổ dạng file')}
<p>Bài 5.1 đã giới thiệu <code>/proc/PID/</code>. Ở độ sâu này có thêm hai cửa sổ quan trọng. <code>/proc/sys/</code> chứa các núm vặn của nhân, cũng chính là những giá trị lệnh <code>sysctl</code> đọc và ghi (dấu chấm trong tên là dấu gạch chéo trong đường dẫn: <code>vm.swappiness</code> = <code>/proc/sys/vm/swappiness</code>). Còn <code>/sys</code> (sysfs) mô tả thiết bị và các đối tượng của nhân: mọi card mạng dưới <code>/sys/class/net/</code>, mọi thiết bị khối dưới <code>/sys/block/</code>, và cả cây cgroup dưới <code>/sys/fs/cgroup/</code>. Không file nào trong đó nằm trên đĩa; nhân sinh ra nội dung đúng lúc bạn đọc.</p>
<pre><code>grep -E "^(Name|State|VmRSS|CapEff)" /proc/self/status
sysctl vm.swappiness net.ipv4.ip_forward
cat /sys/class/net/eth0/mtu /sys/class/net/eth0/operstate</code></pre>
<div class="out">Name:	grep
State:	R (running)
VmRSS:	    1540 kB
CapEff:	000001ffffffffff
vm.swappiness = 60
net.ipv4.ip_forward = 1
65535
up</div>
<p>Thay đổi bằng <code>sysctl -w</code> chỉ sống tới lần khởi động lại. Muốn giữ lâu dài, ghi vào một file dưới <code>/etc/sysctl.d/</code> rồi áp dụng:</p>
<pre><code>echo "net.ipv4.ip_unprivileged_port_start = 80" &gt; /etc/sysctl.d/99-cong.conf
sysctl -p /etc/sysctl.d/99-cong.conf       <span class="tok-comment"># áp dụng riêng file này</span>
sysctl --system                            <span class="tok-comment"># áp lại MỌI file, theo thứ tự</span></code></pre>
<div class="out">net.ipv4.ip_unprivileged_port_start = 80
* Applying /usr/lib/sysctl.d/99-protect-links.conf ...
* Applying /etc/sysctl.d/99-sysctl.conf ...
* Applying /etc/sysctl.conf ...</div>
<div class="callout warn"><strong>Container đặc quyền dùng CHUNG các thiết lập nhân với máy chủ.</strong> Phần lớn giá trị <code>net.*</code> thuộc về một network namespace, nên đổi trong container chỉ ảnh hưởng container đó. Nhưng <code>vm.*</code>, <code>kernel.*</code> và <code>fs.*</code> là toàn cục: lúc soạn bài này, chạy <code>sysctl --system</code> trong một container <code>--privileged</code> đã áp lại các mặc định của Ubuntu (<code>kernel.yama.ptrace_scope</code>, <code>vm.max_map_count</code>, <code>fs.protected_regular</code>…) lên CẢ máy ảo của Docker Desktop. Lần đó vô hại và mất đi khi Docker khởi động lại — nhưng đó chính là lý do <code>--privileged</code> chỉ dành cho thí nghiệm ngắn, không bao giờ cho một dịch vụ.</div>

<h3>Namespaces: container là một tiến trình thấy ít hơn</h3>
${slide('lx-14', 5, 'Container = tiến trình thường + 8 namespace')}
<p>Một <strong>namespace</strong> (không gian tên) bọc một loại tài nguyên toàn cục để các tiến trình bên trong có bản riêng của chúng. Hiện có tám loại: <code>pid</code> (số hiệu tiến trình), <code>mnt</code> (bảng gắn kết), <code>net</code> (card mạng, cổng, luật tường lửa), <code>uts</code> (tên máy), <code>ipc</code>, <code>user</code> (mã người dùng và nhóm), <code>cgroup</code> và <code>time</code>. Một container Docker chỉ đơn giản là một tiến trình được khởi động bên trong một bộ namespace mới. Bạn tự làm được mà không cần Docker, bằng <code>unshare</code> của util-linux:</p>
<pre><code>unshare --pid --fork --mount-proc bash -c "sleep 100 &amp; ps -e -o pid,ppid,comm"
hostname; unshare --uts bash -c "hostname may-thu; hostname"; hostname
unshare --net ip -br link show lo</code></pre>
<div class="out">    PID    PPID COMMAND
      1       0 bash
      2       1 sleep
      3       1 ps
vps-14
may-thu
vps-14
lo               DOWN           00:00:00:00:00:00 &lt;LOOPBACK&gt;</div>
<p>Ba kết quả, ba namespace. Trong PID namespace mới, <code>bash</code> là PID 1 và chỉ thấy con của chính nó — y hệt những gì bạn thấy trong container, và là lý do cái bẫy "PID 1 không bao giờ dọn xác" của Bài 5.1 lại xuất hiện trong container. UTS namespace cho ta đổi tên máy, và cái tên mới biến mất khi <code>bash</code> thoát. Network namespace mới chẳng có gì ngoài một loopback đang <em>tắt</em>: không card, không tuyến đường, không internet. Việc của Docker sau đó là cắm một sợi cáp ảo (<code>veth</code>) vào.</p>
<table>
<tr><th>Cờ của <code>unshare</code></th><th>Namespace mới</th><th>Ghi chú</th></tr>
<tr><td><code>--pid --fork</code></td><td>PID</td><td>bắt buộc có <code>--fork</code>: tiến trình <em>con</em> mới là PID 1, không phải bản thân <code>unshare</code></td></tr>
<tr><td><code>--mount-proc</code></td><td>(mount + <code>/proc</code> mới)</td><td>thiếu nó, <code>ps</code> vẫn đọc <code>/proc</code> của máy và thấy mọi tiến trình</td></tr>
<tr><td><code>--uts</code> · <code>--ipc</code></td><td>tên máy · IPC</td><td>rẻ; container luôn có cả hai</td></tr>
<tr><td><code>--net</code></td><td>mạng</td><td>bắt đầu chỉ với <code>lo</code>, đang tắt</td></tr>
<tr><td><code>--user --map-root-user</code></td><td>người dùng</td><td>chạy được KHÔNG cần root; bạn thành "root" ánh xạ vào UID của chính mình</td></tr>
<tr><td><code>--mount</code> · <code>--cgroup</code> · <code>--time</code></td><td>mount · cgroup · time</td><td>ba loại còn lại</td></tr>
</table>

<h3>Nhìn và bước vào namespace: lsns, nsenter, và ông root giả</h3>
${slide('lx-14', 6, 'unshare tạo, lsns liệt kê, nsenter bước vào')}
<p>Namespace của mỗi tiến trình được liệt kê dưới dạng liên kết trong <code>/proc/PID/ns/</code>; hai tiến trình chung một namespace khi các con số trùng nhau. <code>lsns</code> đọc giùm bạn, còn <code>nsenter</code> chạy một lệnh <em>bên trong</em> các namespace của một tiến trình khác:</p>
<pre><code>unshare --uts --pid --fork --mount-proc bash -c "hostname hop-kin; exec sleep 300" &amp;
P=$(pgrep -f "^sleep 300"); lsns -p "$P"
nsenter -t "$P" -u -p -m bash -c "hostname; ps -e -o pid,comm"</code></pre>
<div class="out">        NS TYPE   NPROCS   PID USER COMMAND
4026532969 net         5     1 root sleep infinity
4026533236 mnt         2   109 root unshare --uts --pid --fork --mount-proc bash -c hostname hop-kin; exec sleep 300
4026533238 uts         2   109 root unshare --uts --pid --fork --mount-proc bash -c hostname hop-kin; exec sleep 300
4026533239 pid         1   111 root &#96;-sleep 300
hop-kin
    PID COMMAND
      1 sleep
      3 ps</div>
<p>Đọc <code>lsns -p</code> như "tiến trình này nằm trong những namespace nào": nó dùng chung <code>net</code> (và vài cái khác, đã cắt bớt) với PID 1 của máy, nhưng có <code>mnt</code>, <code>uts</code> và <code>pid</code> riêng. Rồi <code>nsenter -t PID -u -p -m</code> nhập đúng ba cái đó, nên <code>bash</code> của ta thấy tên máy <code>hop-kin</code> và một danh sách tiến trình trong đó <code>sleep</code> là PID 1. Đó chính xác là việc <code>docker exec -it web sh</code> làm: tìm PID chính của container, vào các namespace của nó, mở một shell. Khi không có <code>docker exec</code> (daemon Docker đã sập, hoặc image bị lược sạch không có shell), root vẫn nhìn vào trong được bằng <code>nsenter -t "$(docker inspect -f '{{.State.Pid}}' web)" -n ss -ltn</code> — dùng lệnh <code>ss</code> của máy chủ bên trong network namespace của container.</p>
<p>User namespace là loại chạy được mà không cần root chút nào:</p>
<pre><code>id -u
unshare --user --map-root-user bash -c "id; touch /etc/x; cat /proc/self/uid_map"</code></pre>
<div class="out">1001
uid=0(root) gid=0(root) groups=0(root)
touch: cannot touch '/etc/x': Permission denied
         0       1001          1</div>
<p>Bên trong, <code>id</code> nói là root. Bên ngoài, nhân vẫn thấy UID 1001 — dòng <code>uid_map</code> đọc là "UID 0 bên trong = UID 1001 bên ngoài, cho 1 mã" — nên <code>/etc</code> vẫn chỉ đọc. Phép ánh xạ đó là nền móng của Docker và Podman kiểu rootless: thoát được khỏi container thì bạn cũng chỉ là một người dùng thường, không phải root của máy chủ. Khoá <a href="/courses/docker">Docker</a> xây trên mọi thứ trong mục này.</p>

<h3>cgroups v2: một cái trần cho một nhóm tiến trình</h3>
${slide('lx-14', 7, 'cgroup v2: memory.max, cpu.max, pids.max')}
<p>Namespace giới hạn tiến trình được <em>thấy</em> gì; <strong>control group</strong> (nhóm kiểm soát) giới hạn nó được <em>dùng</em> bao nhiêu. Với cgroup v2 (loại duy nhất trên Ubuntu 24.04, Fedora và mọi bản phân phối hiện hành) chỉ có một cây, gắn ở <code>/sys/fs/cgroup</code>. Mỗi thư mục là một nhóm; các file trong đó là thiết lập của nhóm; ghi một PID vào <code>cgroup.procs</code> là dời tiến trình đó vào nhóm. Đây chính là file Docker ghi khi bạn truyền <code>--memory</code> — trong một container chạy với <code>--memory 512m</code>, <code>cat /sys/fs/cgroup/memory.max</code> in ra <code>536870912</code>. Dựng bằng tay trong một container đặc quyền:</p>
<pre><code>cd /sys/fs/cgroup
mkdir init; for p in $(cat cgroup.procs); do echo "$p" &gt; init/cgroup.procs; done
echo "+memory +cpu +pids" &gt; cgroup.subtree_control
mkdir demo; echo 64M &gt; demo/memory.max; echo 0 &gt; demo/memory.swap.max
bash -c 'echo $$ &gt; /sys/fs/cgroup/demo/cgroup.procs
         python3 -c "b=bytearray(200*1024*1024)"; echo "exit=$?"'
cat demo/memory.events</code></pre>
<div class="out">bash: line 1:   166 Killed                  python3 -c "b=bytearray(200*1024*1024)"
exit=137
low 0
high 0
max 38
oom 1
oom_kill 1
oom_group_kill 0</div>
<p>Dòng thứ hai giải thích một luật làm ai cũng vấp: <strong>không có tiến trình ở nút trong</strong>. Một cgroup đã trao bộ điều khiển xuống cho các nhóm con (<code>cgroup.subtree_control</code>) thì bản thân nó không được chứa tiến trình, nên trước tiên ta dời mọi thứ vào một nút lá tên <code>init</code>. Rồi tới thí nghiệm: xin 200 MB trong một nhóm 64 MB thì chết bằng <code>SIGKILL</code> — mã 137 = 128 + 9, con số của Bài 5.3 — và <code>memory.events</code> ghi lại <code>oom_kill 1</code>. Bộ đếm đó là bằng chứng phải tìm khi một container "tự dưng biến mất": <code>docker inspect -f '{{.State.OOMKilled}}'</code> đọc cùng sự thật ấy.</p>
<p>Giới hạn CPU và số tiến trình chạy y như vậy. <code>cpu.max</code> là "hạn mức chu kỳ" tính bằng micro giây, nên <code>20000 100000</code> nghĩa là 20 ms CPU trong mỗi 100 ms — 20% của một lõi:</p>
<pre><code>mkdir cpu20; echo "20000 100000" &gt; cpu20/cpu.max
bash -c 'echo $$ &gt; /sys/fs/cgroup/cpu20/cgroup.procs; timeout 5 bash -c "while :; do :; done"'
grep -E "usage_usec|nr_throttled|throttled_usec" cpu20/cpu.stat
mkdir p5; echo 5 &gt; p5/pids.max
bash -c 'echo $$ &gt; /sys/fs/cgroup/p5/cgroup.procs; for i in 1 2 3 4 5 6; do sleep 30 &amp; done; wait'</code></pre>
<div class="out">usage_usec 1021854
nr_throttled 51
throttled_usec 4063814
bash: fork: retry: Resource temporarily unavailable
bash: fork: retry: Resource temporarily unavailable</div>
<p>Năm giây vòng lặp bận chỉ ăn được 1,02 giây CPU (20%), và nhân đã kìm nó 51 lần. <code>nr_throttled</code> tăng dần trên một container production là dấu hiệu cho thấy chính cái trần CPU — chứ không phải mã chậm — đang làm nó chậm. Nhóm có <code>pids.max</code> từ chối tiến trình thứ sáu: đây cũng là cách một fork bomb (quả bom nhân bản) bị chặn đứng.</p>
<table>
<tr><th>File</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>cgroup.procs</code></td><td>Các PID trong nhóm; ghi một PID vào là dời nó sang</td><td><code>echo $$ &gt; g/cgroup.procs</code></td></tr>
<tr><td><code>cgroup.subtree_control</code></td><td>Bộ điều khiển trao xuống nhóm con</td><td><code>echo +memory &gt; cgroup.subtree_control</code></td></tr>
<tr><td><code>memory.max</code> · <code>memory.high</code></td><td>Trần cứng (vượt là OOM-kill) · trần mềm (bị làm chậm và thu hồi bớt)</td><td><code>echo 512M &gt; g/memory.max</code></td></tr>
<tr><td><code>memory.current</code> · <code>memory.peak</code></td><td>Đang dùng · cao nhất từng dùng</td><td><code>cat g/memory.peak</code> → <code>67108864</code></td></tr>
<tr><td><code>memory.events</code></td><td>Bộ đếm: <code>oom</code>, <code>oom_kill</code>, <code>high</code>…</td><td>file đầu tiên phải đọc sau một mã 137</td></tr>
<tr><td><code>cpu.max</code> · <code>cpu.weight</code></td><td>Hạn mức cứng · phần chia tương đối khi tranh nhau (mặc định 100)</td><td><code>echo "50000 100000" &gt; g/cpu.max</code></td></tr>
<tr><td><code>cpu.stat</code></td><td><code>usage_usec</code>, <code>nr_throttled</code>, <code>throttled_usec</code></td><td>trần có đang cắn không?</td></tr>
<tr><td><code>pids.max</code> · <code>io.max</code></td><td>Số tác vụ tối đa · giới hạn I/O theo từng thiết bị</td><td><code>echo 100 &gt; g/pids.max</code></td></tr>
</table>

<h3>Để systemd làm: MemoryMax, systemd-run và OOMScoreAdjust</h3>
${slide('lx-14', 8, 'systemd-run, MemoryMax, OOMScoreAdjust')}
<p>Trên một máy chủ thật bạn không bao giờ tự tay tạo cgroup: systemd sở hữu cả cây, và mỗi dịch vụ đã sống trong nhóm riêng của nó (<code>systemd-cgls</code> vẽ ra cho bạn). Bạn đặt giới hạn bằng chỉ thị trong unit — <code>MemoryMax=</code>, <code>CPUQuota=</code>, <code>TasksMax=</code> — mà Bài 11.1 đã đặt trong một drop-in. <code>systemd-run</code> áp đúng những chỉ thị đó cho một lệnh chạy một lần, nên nó là cách nhanh nhất để <em>thử</em> một giới hạn:</p>
<pre><code>systemd-run --scope -p MemoryMax=64M -p MemorySwapMax=0 --unit=thu-bo-nho \\
  python3 -c "b=bytearray(200*1024*1024)"; echo "exit=$?"
journalctl -n 6 -o cat | grep -iE "thu-bo-nho|oom"
systemd-run --unit=nang -p MemoryMax=64M -p MemorySwapMax=0 \\
  python3 -c "import time; b=bytearray(40*1024*1024); time.sleep(60)"
systemctl status nang --no-pager | grep Memory
systemd-cgtop -n1 -b --order=memory | head -4</code></pre>
<div class="out">Running as unit: thu-bo-nho.scope; invocation ID: 9ed3d2525a5d42658e767645c6abe837
exit=137
Memory cgroup out of memory: Killed process 59344 (python3) total-vm:219292kB, anon-rss:65328kB, … oom_score_adj:0
thu-bo-nho.scope: A process of this unit has been killed by the OOM killer.
thu-bo-nho.scope: Failed with result 'oom-kill'.
Running as unit: nang.service; invocation ID: 1dc8aa465dc94e96833f6642b3ef40de
     Memory: 43.0M (max: 64.0M swap max: 0B available: 21.0M peak: 43.0M)
/                                                       14      -    85.9M        -        -
system.slice                                            10      -    77.0M        -        -
system.slice/nang.service                                1      -    43.0M        -        -</div>
<p><code>--scope</code> chạy lệnh ngay trong terminal của bạn nhưng bên trong một cgroup riêng; không có nó, <code>systemd-run</code> tạo ra một <code>.service</code> tạm chạy ở hậu cảnh. Cách này cũng chạy được không cần root trên máy có systemd của người dùng: trên Fedora, <code>systemd-run --user --scope -p MemoryMax=64M -p MemorySwapMax=0 python3 -c "b=bytearray(200*1024*1024)"</code> cũng kết thúc bằng <code>exit=137</code>.</p>
<p>Khi <em>cả cái máy</em> cạn bộ nhớ (không phải một nhóm), OOM killer của nhân chọn nạn nhân theo một điểm số, đọc được ở <code>/proc/PID/oom_score</code>. Bạn nắn lựa chọn đó bằng <code>oom_score_adj</code>, từ −1000 ("đừng bao giờ giết tôi") tới +1000 ("giết tôi trước"). Bài 5.2 cho thấy cú giết; đây là cái núm:</p>
<pre><code>choom -p 125                     <span class="tok-comment"># đọc điểm và độ lệch</span>
choom -p 125 -n 500              <span class="tok-comment"># cho nó thành nạn nhân ưu tiên</span>
systemd-run --unit=quan-trong -p OOMScoreAdjust=-900 sleep 300
choom -p "$(systemctl show -p MainPID --value quan-trong)"</code></pre>
<div class="out">pid 125's current OOM score: 670
pid 125's current OOM score adjust value: 0
pid 125's OOM score adjust value changed from 0 to 500
pid 144's current OOM score: 67
pid 144's current OOM score adjust value: -900</div>
<p>Trong file unit, <code>OOMScoreAdjust=-900</code> che chở cho cơ sở dữ liệu của bạn; <code>+500</code> trên một việc chạy lô thì xung phong cho nó chết trước. Người dùng thường được <em>tăng</em> giá trị cho tiến trình của mình (ghi <code>300</code> thì được) nhưng không được giảm: ghi <code>-100</code> với tư cách người thường báo <code>Permission denied</code>. Hai giới hạn liên quan nằm ở chỗ khác và đã học: <code>ulimit</code> theo tiến trình và <code>LimitNOFILE=</code> (Bài 5.2).</p>

<h3>Capabilities: root, chẻ thành từng mảnh</h3>
${slide('lx-14', 9, 'Capabilities')}
<p>Từ Linux 2.2, "root" không còn là một quyền duy nhất mà là khoảng bốn mươi <strong>capability</strong> (năng lực) riêng biệt (41 trên nhân này): <code>CAP_NET_BIND_SERVICE</code> (mở cổng dưới 1024), <code>CAP_CHOWN</code>, <code>CAP_KILL</code>, <code>CAP_SYS_ADMIN</code> (cái túi đựng tất cả: mount, đổi tên máy và nhiều thứ nữa)… Tập hiệu lực của một tiến trình là mặt nạ hex <code>CapEff</code> trong <code>/proc/PID/status</code>; <code>capsh --decode</code> dịch nó thành tên. Docker chỉ trao cho root trong container 14 năng lực:</p>
<pre><code>docker run --rm ubuntu:24.04 grep CapEff /proc/self/status
capsh --decode=00000000a80425fb
docker run --rm --cap-drop ALL ubuntu:24.04 chown nobody /tmp</code></pre>
<div class="out">CapEff:	00000000a80425fb
0x00000000a80425fb=cap_chown,cap_dac_override,cap_fowner,cap_fsetid,cap_kill,cap_setgid,cap_setuid,cap_setpcap,cap_net_bind_service,cap_net_raw,cap_sys_chroot,cap_mknod,cap_audit_write,cap_setfcap
chown: changing ownership of '/tmp': Operation not permitted</div>
<p>Đó là lý do <code>hostname x</code> hay <code>mount</code> thất bại trong một container thường dù là root: không có <code>cap_sys_admin</code>. Theo chiều ngược lại cũng được — bạn có thể trao cho một chương trình bình thường đúng MỘT đặc quyền thay vì chạy nó bằng root. Ở đây một người dùng thường mở web server ở cổng 80 (trước đó đặt <code>ip_unprivileged_port_start</code> của container về mức thường gặp 1024; Docker đặt nó bằng 0 trong container):</p>
<pre><code>cp /usr/bin/python3.12 /usr/local/bin/py-web
su an -c "/usr/local/bin/py-web -m http.server 80"
setcap cap_net_bind_service=+ep /usr/local/bin/py-web
getcap /usr/local/bin/py-web
su an -c 'timeout 2 /usr/local/bin/py-web -m http.server 80; echo rc=$?'
getcap /usr/bin/ping</code></pre>
<div class="out">PermissionError: [Errno 13] Permission denied
/usr/local/bin/py-web cap_net_bind_service=ep
rc=124
/usr/bin/ping cap_net_raw=ep</div>
<p><code>rc=124</code> nghĩa là <code>timeout</code> phải giết nó — server đã lên và đang nghe. <code>+ep</code> = thêm vào tập <em>effective</em> (hiệu lực) và <em>permitted</em> (được phép) của file. <code>ping</code> được đóng gói y như thế: một năng lực thay vì bit setuid-root của Bài 4.3. Với một dịch vụ, hãy ưu tiên chỉ thị của systemd <code>AmbientCapabilities=CAP_NET_BIND_SERVICE</code> cùng <code>User=app</code>, còn trong Docker là <code>--cap-drop ALL --cap-add NET_BIND_SERVICE</code>.</p>
<div class="pitfall co-tieu-de"><strong>Đừng bao giờ <code>setcap</code> cho một trình thông dịch dùng chung.</strong> Bài mẫu cố tình chép Python ra <code>/usr/local/bin/py-web</code>. Gắn <code>cap_net_bind_service</code> — huống chi <code>cap_sys_admin</code> hay <code>cap_dac_override</code> — lên <code>/usr/bin/python3</code> là trao quyền đó cho <em>mọi</em> script Python của mọi người dùng, và lần nâng cấp gói kế tiếp còn lặng lẽ xoá nó đi. Hãy trao năng lực cho dịch vụ (<code>AmbientCapabilities=</code>) hoặc cho một file thực thi riêng, và rà soát bằng <code>getcap -r / 2&gt;/dev/null</code>.</div>

<h3>Chạy thử từng bước: một "container" trong năm lệnh</h3>
<p>Trong một container đặc quyền dùng xong vứt (<code>docker run --rm -it --privileged --name lab-ns ubuntu:24.04 bash</code>, rồi <code>apt-get update &amp;&amp; apt-get install -y python3 libcap2-bin</code>), tự dựng ba nguyên liệu bằng tay và kiểm từng cái:</p>
<ol>
<li><code>unshare --pid --uts --net --mount --fork --mount-proc bash</code> — giờ bạn là PID 1 trong các namespace của riêng mình. Kiểm bằng <code>echo $$</code> (→ <code>1</code>), <code>ps -e</code> (hai tiến trình), <code>ip -br link</code> (chỉ có <code>lo</code>).</li>
<li><code>hostname hop-cua-toi; hostname</code>, rồi từ terminal thứ hai <code>docker exec lab-ns hostname</code> — tên bên ngoài không đổi.</li>
<li>Quay ra shell ngoài, tạo một cgroup <code>memory.max=64M</code> như trên và dời PID của shell bên trong vào đó (tìm nó bằng <code>lsns -t pid</code>).</li>
<li>Bên trong, chạy cái <code>bytearray</code> 200 MB — chờ đợi <code>Killed</code> và <code>oom_kill 1</code> trong <code>memory.events</code>.</li>
<li><code>capsh --drop=cap_chown -- -c "touch /tmp/x; chown nobody /tmp/x"</code> — là root mà vẫn <code>Operation not permitted</code>.</li>
</ol>
<p>Đó, từng mảnh một, chính là những gì <code>docker run --memory 64m --cap-drop CHOWN</code> dựng lên. Thoát ra là container biến mất cùng mọi thứ bên trong.</p>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Chủ đề</th><th>Linux (Ubuntu/Fedora)</th><th>macOS 27 (đo thật)</th><th>WSL2</th></tr>
<tr><td>Nhân</td><td>Linux</td><td>XNU (Darwin 27.0.0) — không có thứ nào trong bài này</td><td>một nhân Linux thật do Microsoft dựng</td></tr>
<tr><td><code>/proc</code></td><td>có</td><td><code>ls: /proc: No such file or directory</code>; dùng <code>sysctl kern.…</code>, <code>ps</code>, <code>vm_stat</code></td><td>có</td></tr>
<tr><td>Theo dõi syscall</td><td><code>strace</code></td><td><code>dtruss</code>, bị SIP chặn: <code>DTrace requires additional privileges</code></td><td><code>strace</code> chạy được</td></tr>
<tr><td>Namespaces, cgroups</td><td>có</td><td>không — Docker Desktop chạy một máy ảo Linux (nhân <code>7.0.12-linuxkit</code> ở đây) và mọi container sống trong đó</td><td>có (cgroup v2)</td></tr>
</table>
<p>Nên trên Mac, "thử trong một container" là câu trả lời đúng cho cả chương này: cái nhân bạn đang chọc vào là nhân của máy ảo Docker, không phải của macOS.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> container API của nhóm trên VPS "tự khởi động lại" vài lần mỗi ngày với <code>Exited (137)</code> và log không có gì. Hãy chứng minh cái gì đang giết nó, bằng một container dùng xong vứt (<code>docker run --rm -it --privileged --memory 512m ubuntu:24.04 bash</code>, rồi <code>apt-get install -y python3 strace util-linux</code>).</p><ol>
<li>Tạo một cgroup <code>api</code> với <code>memory.max = 100M</code> và <code>memory.swap.max = 0</code> (nhớ bước "không có tiến trình ở nút trong").</li>
<li>Dời một shell vào đó và chạy <code>python3 -c "b=bytearray(300*1024*1024)"; echo $?</code>.</li>
<li>Đọc <code>api/memory.events</code> và <code>api/memory.peak</code>; ghi lại hai con số chứng minh đó là một cú OOM-kill bên trong nhóm, không phải một lần sập.</li>
<li>Chạy <code>strace -c -f python3 -c "print(1)"</code> và tìm syscall được gọi nhiều lần nhất.</li>
<li>Chứng minh root của container thiếu <code>cap_sys_admin</code>: mở container thứ hai KHÔNG có <code>--privileged</code> rồi so <code>grep CapEff /proc/self/status</code>.</li></ol>
<p><strong>Đạt khi:</strong> bạn có <code>exit 137</code>, <code>oom_kill 1</code> và <code>memory.peak</code> khoảng <code>104857600</code>; bạn gọi được tên syscall nhiều lần nhất; và hai giá trị <code>CapEff</code> khác nhau (<code>000001ffffffffff</code> với <code>00000000a80425fb</code>).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">System call (lời gọi hệ thống)</span><span class="v">Cách duy nhất để chương trình nhờ nhân làm việc thật: đọc, ghi, mở file, tạo tiến trình.</span></div>
  <div class="kv"><span class="k">User space / kernel space (vùng người dùng / vùng nhân)</span><span class="v">Nơi chương trình của bạn chạy, so với nơi nhân chạy với toàn quyền phần cứng.</span></div>
  <div class="kv"><span class="k">sysfs / procfs (hệ thống file ảo)</span><span class="v"><code>/sys</code> và <code>/proc</code>: nhân trưng ra và nhận thiết lập qua đó, không nằm trên đĩa.</span></div>
  <div class="kv"><span class="k">Namespace (không gian tên)</span><span class="v">Bản riêng của một tài nguyên toàn cục (PID, tên máy, mạng…) cho một nhóm tiến trình.</span></div>
  <div class="kv"><span class="k">Control group — cgroup (nhóm kiểm soát)</span><span class="v">Một nhóm tiến trình chung giới hạn và bộ đếm tài nguyên, là một thư mục trong <code>/sys/fs/cgroup</code>.</span></div>
  <div class="kv"><span class="k">Throttling (bị kìm)</span><span class="v">Nhân tạm dừng một nhóm đã tiêu hết hạn mức CPU của chu kỳ hiện tại.</span></div>
  <div class="kv"><span class="k">Capability (năng lực)</span><span class="v">Một mảnh quyền của root, trao riêng được (<code>CAP_NET_BIND_SERVICE</code>).</span></div>
  <div class="kv"><span class="k">oom_score_adj (độ lệch điểm OOM)</span><span class="v">Con số −1000…+1000 nắn việc OOM killer chọn tiến trình nào chết trước.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mọi việc thật đều qua một syscall; <code>strace -c</code> đếm chúng, và một triệu lần ghi lẻ tẻ tốn ~200 lần một lần ghi lớn.</li>
<li><code>/proc/sys</code> = <code>sysctl</code>; giữ thay đổi lâu dài trong <code>/etc/sysctl.d/</code>, và nhớ các khoá toàn cục là dùng chung với container đặc quyền.</li>
<li>Container là một tiến trình trong các namespace mới; <code>unshare</code> tạo, <code>lsns</code> liệt kê, <code>nsenter</code> (thứ <code>docker exec</code> làm) bước vào.</li>
<li>cgroup v2 là một cây thư mục; <code>memory.max</code>, <code>cpu.max</code>, <code>pids.max</code> là giới hạn, <code>memory.events</code> và <code>cpu.stat</code> là bằng chứng.</li>
<li>Trên máy chủ thật để systemd lo cgroup: <code>MemoryMax=</code>, <code>systemd-run -p …</code> để thử, <code>OOMScoreAdjust=</code> để chọn ai chết trước.</li>
<li>Capabilities thay cho "chạy bằng root": trao đúng một cái (<code>setcap</code>, <code>AmbientCapabilities=</code>, <code>--cap-add</code>) và bỏ hết phần còn lại.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man7/namespaces.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">namespaces(7)</span><span class="lc-sub">Tám loại namespace, các liên kết <code>/proc/PID/ns</code> và phiên bản nhân mà mỗi loại xuất hiện.</span></span>
</a>
<a class="link-card" href="https://docs.kernel.org/admin-guide/cgroup-v2.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Control Group v2 — tài liệu của chính nhân Linux</span><span class="lc-sub">Mọi file giao diện (<code>memory.max</code>, <code>cpu.max</code>, <code>memory.events</code>…) và luật "không tiến trình ở nút trong", từ gốc.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man7/capabilities.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">capabilities(7)</span><span class="lc-sub">Mỗi năng lực cho phép gì, và các tập permitted/effective/ambient đằng sau <code>+ep</code>.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/strace.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">strace(1)</span><span class="lc-sub">Mọi bộ lọc (<code>-e trace=%file</code>, <code>%network</code>…) và các tuỳ chọn tổng kết dùng trong bài.</span></span>
</a>
<a class="link-card codelab" href="/courses/docker" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Docker — khoá đầy đủ trên trang này</span><span class="lc-sub">Docker dựng gì trên namespaces, cgroups và capabilities: image, volume, mạng, Compose.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Code Lab: Linux &amp; Bash</span><span class="lc-sub">Bài tập có chấm điểm cho cả khoá, trong một shell thật.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>"Nó bị giết" chưa phải là chẩn đoán khi bạn chưa biết AI giết.</strong> Mã 137 chỉ nói là SIGKILL. Có thể là trần của cgroup (<code>memory.events</code> → <code>oom_kill</code>), OOM killer của cả máy (<code>journalctl -k | grep -i "out of memory"</code>), <code>docker stop</code> hết kiên nhẫn sau 10 giây (Bài 5.3), hay một người gõ <code>kill -9</code>. Hãy đọc bộ đếm trước khi nâng giới hạn — một tiến trình rò rỉ bộ nhớ được cho gấp đôi RAM thì chỉ chết thưa đi một nửa.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Đếm trước khi đoán: <code>strace -c</code> và <code>cpu.stat</code> biến "cảm thấy chậm" thành con số. Container không phải máy ảo — nó là nhân của bạn với tầm nhìn hẹp hơn, và đó là lý do một container <code>--privileged</code> có thể đổi được máy chủ của bạn. Và bằng chứng của mọi cú giết đều được ghi lại ở đâu đó: <code>memory.events</code>, log của nhân, hoặc <code>docker inspect</code>.</p>
</div>
`,
    },
    /* ─────────────────────────── 14.2 ─────────────────────────── */
    {
      title: '14.2 — Performance with the USE method: CPU, memory, disk and network down to the function|||14.2 — Hiệu năng theo phương pháp USE: CPU, bộ nhớ, đĩa và mạng, xuống tới từng hàm',
      slug: 'lnx-14-2-hieu-nang',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Đi hết bảng USE của Brendan Gregg cho từng tài nguyên: mpstat -P ALL và pidstat tìm lõi và tiến trình nghẽn, vmstat và PSI đo hàng chờ, perf và flame graph chỉ ra hàm tốn CPU, iostat -x và fio đọc đĩa đúng cách, sar/ss/nstat/iperf3 cho mạng — và lịch sử sysstat để trả lời "đêm qua lúc 2 giờ máy ra sao".',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.2</span>
<h2>Performance with the USE method</h2>
<p class="lead">Lesson 12.1 gave you a sixty-second sweep and a first look at the USE method; Lesson 12.3 read <code>vmstat</code> and <code>iostat</code> during an incident. This lesson finishes the job. You will walk the whole USE table resource by resource, learn the <code>sysstat</code> tools that answer each cell, and then go one level deeper than any of them: <code>perf</code>, which tells you not just <em>which process</em> is burning CPU but <em>which function</em>. Every number below was measured on a 10-vCPU Ubuntu 24.04 machine; no load ran longer than twelve seconds.</p>

<h3>The method: every resource, three questions</h3>
${slide('lx-14', 10, 'Phương pháp USE')}
<p>Brendan Gregg published the USE method in 2012 and summarises it in one line: <em>"For every resource, check utilization, saturation, and errors."</em> He defines the terms precisely, and the definitions are what make it work:</p>
<ul>
<li><strong>Utilization</strong> — the average time the resource was busy doing work, usually a percentage over an interval ("one disk at 90%").</li>
<li><strong>Saturation</strong> — how much extra work is waiting because the resource cannot take it, usually a queue length ("an average run queue of four").</li>
<li><strong>Errors</strong> — a count of error events. Check them first: they are the quickest to interpret and often the whole answer.</li>
</ul>
<p>On his own page he estimates it "solves about 80% of server issues with 5% of the effort". The discipline is to fill in <em>every</em> cell before digging into one, because the goal is the resource that is <em>exhausted</em>, not the one that is <em>interesting</em>. And beware averages: Gregg describes a customer whose monitoring never showed CPU above 80% in five-minute averages while the CPUs sat at 100% for seconds at a time — low average utilization does not rule out saturation. That is why the tools below sample every second.</p>

<h3>The toolbox: sysstat, and history you already have</h3>
<p>Most of the tools come in one package: <code>sudo apt install sysstat</code> (Fedora: <code>sudo dnf install sysstat</code>) gives <code>mpstat</code>, <code>pidstat</code>, <code>iostat</code> and <code>sar</code>. On Ubuntu 24.04 it also installs a systemd timer that records a snapshot every ten minutes, so <code>sar</code> can answer "what was the machine doing at 2am?" after the fact:</p>
<pre><code>systemctl list-timers --all | grep sysstat
sar -q -f /var/log/sysstat/sa28          <span class="tok-comment"># saDD = day of the month</span></code></pre>
<div class="out">Mon 2026-09-28 16:50:00 UTC  5min Mon 2026-09-28 16:40:03 UTC 4min 9s ago sysstat-collect.timer  sysstat-collect.service
Tue 2026-09-29 00:07:00 UTC    7h -                                      - sysstat-summary.timer  sysstat-summary.service
16:16:02     LINUX RESTART	(10 CPU)
16:20:24      runq-sz  plist-sz   ldavg-1   ldavg-5  ldavg-15   blocked
16:30:03            0       683      0.14      0.30      0.69         0
16:40:03            0       692      0.12      0.17      0.42         0</div>
<p>One surprise worth knowing: <code>/etc/default/sysstat</code> on the same machine still says <code>ENABLED="false"</code>. That variable only controls the old cron script (<code>debian-sa1</code>); the systemd timer runs <code>/usr/lib/sysstat/sa1</code> directly and ignores it. <code>lynis</code> (Lesson 14.4) read the file and reported "sysstat disabled" — while <code>sa28</code> was being written every ten minutes. Check with <code>ls /var/log/sysstat/</code>, not by reading a config file.</p>
<table>
<tr><th>Command</th><th>Flag</th><th>Meaning</th></tr>
<tr><td><code>mpstat</code></td><td><code>-P ALL 1</code></td><td>Every core separately, every second</td></tr>
<tr><td><code>pidstat</code></td><td><code>-u</code> · <code>-r</code> · <code>-d</code> · <code>-t</code> · <code>-p PID</code></td><td>Per process: CPU · memory and page faults · disk I/O · per thread · one process</td></tr>
<tr><td><code>iostat</code></td><td><code>-x</code> · <code>-z</code> · <code>-m</code></td><td>Extended device columns · hide idle devices · megabytes</td></tr>
<tr><td><code>sar</code></td><td><code>-u</code> · <code>-q</code> · <code>-r</code> · <code>-n DEV</code> · <code>-n EDEV</code> · <code>-f file</code></td><td>CPU · run queue and load · memory · network traffic · network errors · read history</td></tr>
<tr><td><code>vmstat</code></td><td><code>1</code> · <code>-S M</code> · <code>-w</code></td><td>Every second · units in MB · wide columns (from procps, no install needed)</td></tr>
</table>

<h3>CPU utilization: "90% idle" while one core is maxed out</h3>
${slide('lx-14', 11, 'Một lõi kịch trần: mpstat -P ALL, pidstat')}
<p>The classic misreading: <code>top</code>'s header says the CPU is 90% idle, so the CPU cannot be the problem. Run a single-threaded busy loop on a 10-core machine and look properly:</p>
<pre><code>python3 ban.py &amp;                                   <span class="tok-comment"># an 8-second single-threaded loop</span>
mpstat -P ALL 2 1 | grep Average
pidstat -u 2 1 | grep -E "Average|UID" | sort -k8 -nr | head -3</code></pre>
<div class="out">Average:     CPU    %usr   %nice    %sys %iowait    %irq   %soft  %steal  %guest  %gnice   %idle
Average:     all   10.26    0.00    0.20    0.10    0.00    0.55    0.00    0.00    0.00   88.89
Average:       5  100.00    0.00    0.00    0.00    0.00    0.00    0.00    0.00    0.00    0.00
…
Average:        0       235  100.00    0.00    0.00    0.00  100.00     -  python3
Average:      UID       PID    %usr %system  %guest   %wait    %CPU   CPU  Command</div>
<p>The <code>all</code> line — 10% — is exactly one core out of ten. <code>-P ALL</code> shows the truth: core 5 at 100%, nothing left to give. <code>pidstat</code> names the culprit. The conclusion changes the fix completely: this application is single-threaded, so a bigger server with more cores will not make it one bit faster; you need faster code, or several worker processes (Node's cluster mode, several Gunicorn workers). The columns worth knowing in <code>mpstat</code>: <code>%usr</code> your code, <code>%sys</code> the kernel working for it (high = many syscalls, Lesson 14.1), <code>%iowait</code> idle while waiting for disk, <code>%steal</code> time the hypervisor gave your vCPU to another customer — on a cheap VPS a steady <code>%steal</code> above a few percent means a noisy neighbour, not your code.</p>

<h3>CPU saturation: count the queue, not the percentage</h3>
${slide('lx-14', 12, 'Bão hoà: vmstat r, PSI')}
<p>A CPU at 100% is not necessarily in trouble; work <em>waiting</em> for a CPU is. Twenty CPU-bound workers on ten cores, for twelve seconds:</p>
<pre><code>stress-ng --cpu 20 --timeout 12s -q &amp;
vmstat 1 4
cat /proc/pressure/cpu
cat /proc/loadavg</code></pre>
<div class="out">procs -----------memory---------- ---swap-- -----io---- -system-- -------cpu-------
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st gu
23  0 452384 646692 1691380 2874872    6    9    75   327 1148    1  0  0 99  0  0  0
20  0 452384 646692 1691384 2874868    0    0     0   148 7830 2961 99  1  0  0  0  0
20  0 452384 646692 1691384 2874868    0    0     0     0 7856 2819 100  0  0  0  0  0
20  0 452384 646692 1691384 2874868    0    0     0     0 8130 3055 100  0  0  0  0  0
some avg10=31.37 avg60=7.11 avg300=2.23 total=509912285
full avg10=0.00 avg60=0.00 avg300=0.00 total=0
1.94 1.03 1.14 23/696 276</div>
<p>Ignore <code>vmstat</code>'s first line — it is an average since boot (its <code>id 99</code> tells you nothing about now). After that, <code>r</code> = 20: twenty tasks running or runnable on ten cores, so on average half of them are waiting. That is saturation. The second signal is newer and better: <strong>PSI</strong> (pressure stall information, since Linux 4.20) in <code>/proc/pressure/cpu</code>. <code>some avg10=31.37</code> means that over the last ten seconds, at least one task was stalled waiting for CPU 31% of the time. <code>full</code> (all tasks stalled at once) is meaningful for memory and I/O. Now look at the load average: 1.94. The load average is an exponentially damped average, so three seconds into a burst it has barely moved — the same trap as Gregg's five-minute averages. PSI's <code>avg10</code> reacts within seconds; so does <code>r</code>.</p>
<p>The same three files exist for the other resources: <code>/proc/pressure/memory</code> (tasks stalled reclaiming or swapping) and <code>/proc/pressure/io</code>. And every cgroup has its own <code>cpu.pressure</code>, <code>memory.pressure</code>, <code>io.pressure</code> — so you can ask "is <em>this service</em> starving?" rather than "is the machine?".</p>

<h3>perf and flame graphs: which function is eating the CPU</h3>
${slide('lx-14', 13, 'perf và flame graph')}
<p>Once <code>pidstat</code> has named the process, the next question is where inside it the time goes. <code>perf</code> is the kernel's own profiler (on Ubuntu it ships in <code>linux-tools-$(uname -r)</code>). It samples each CPU's call stack many times a second; functions that appear in many samples are where the time is. Three commands cover most needs:</p>
<pre><code>perf stat -e task-clock,context-switches,page-faults -- python3 -c "sum(range(10**7))"
perf record -F 999 -g -- python3 -X perf app.py     <span class="tok-comment"># 999 samples/s, with call stacks</span>
perf report --stdio --children --sort sym | grep "py::"</code></pre>
<div class="out">            146.08 msec task-clock                       #    0.994 CPUs utilized
                 1      context-switches                 #    6.846 /sec
               819      page-faults                      #    5.607 K/sec
   &lt;not supported&gt;      cycles
    96.60%     0.00%  [.] py::&lt;module&gt;:/tmp/app.py
    96.60%     0.00%  [.] py::xu_ly_don:/tmp/app.py
    93.96%     0.00%  [.] py::tinh_thue:/tmp/app.py
    67.55%     3.40%  [.] py::tinh_thue.&lt;locals&gt;.&lt;genexpr&gt;:/tmp/app.py
     2.64%     0.00%  [.] py::doc_cau_hinh:/tmp/app.py</div>
<p>The script called two functions in a loop, <code>tinh_thue</code> (tax calculation) and <code>doc_cau_hinh</code> (read config). The profile settles any argument about which to optimise: 94% of samples were inside <code>tinh_thue</code>, 2.6% in <code>doc_cau_hinh</code>. Making the config reader ten times faster would save almost nothing. Three practical notes. <code>-X perf</code> (Python 3.12+) is what turns Python functions into names <code>perf</code> can show; without it you see the interpreter's C functions. A stripped binary shows only addresses — profiling <code>gzip</code> printed lines like <code>0x0000000000003104</code> until debug symbols are installed. And in virtual machines and containers the hardware counters are usually missing (<code>cycles &lt;not supported&gt;</code>), but software events like <code>task-clock</code> and <code>cpu-clock</code> sampling still work. <code>perf top</code> is the live version, like <code>top</code> for functions; on a normal user account it needs <code>kernel.perf_event_paranoid</code> ≤ 2 (the default on Fedora 44 is 2, which allows profiling your own processes).</p>
<p>A <strong>flame graph</strong>, which Gregg released in December 2011, draws the same samples as a picture: each box is a function, the one below it is its caller, and the <em>width</em> is the share of samples. The x-axis is not time — boxes are sorted alphabetically so that identical stacks merge. You read it by looking for wide plateaus near the top. The slide redraws the numbers above; to generate the real SVG:</p>
<pre><code>git clone --depth 1 https://github.com/brendangregg/FlameGraph
perf script | ./FlameGraph/stackcollapse-perf.pl &gt; out.folded
./FlameGraph/flamegraph.pl out.folded &gt; flame.svg      <span class="tok-comment"># open in a browser</span></code></pre>

<h3>Memory: available, page cache, and the swap columns</h3>
<p>Lesson 5.2 explained why "free" near zero is normal. At USE level: <strong>utilization</strong> is <code>free -m</code>'s <code>available</code> column against <code>total</code>; <strong>saturation</strong> is the kernel having to work to find memory — <code>vmstat</code>'s <code>si</code>/<code>so</code> (swap in/out per second) non-zero and rising, or <code>/proc/pressure/memory</code> above zero; <strong>errors</strong> are OOM kills in <code>journalctl -k</code> or a cgroup's <code>memory.events</code> (Lesson 14.1). To see how much of a file is sitting in the page cache, <code>fincore</code> (package <code>util-linux-extra</code> on Ubuntu) answers directly:</p>
<pre><code>free -m
fincore du-lieu.txt</code></pre>
<div class="out">               total        used        free      shared  buff/cache   available
Mem:            7934        2808         459          88        4952        5125
Swap:           1023         427         596
  RES PAGES  SIZE FILE
81.1M 20750 81.1M du-lieu.txt</div>
<p>459 MB "free" but 5,125 MB <code>available</code>: most of the 4.9 GB <code>buff/cache</code> is file contents the kernel will drop the moment a program needs the memory — including all 81 MB of that file. <code>pidstat -r 1</code> adds per-process memory and <code>majflt/s</code> (major page faults: pages that had to be read back from disk — a steady stream means the working set does not fit).</p>

<h3>Disk: read await and aqu-sz, not just %util</h3>
${slide('lx-14', 14, 'Đĩa: iostat -x, fio')}
<p>To see a disk under load without hurting anything, <code>fio</code> generates a controlled workload in one file. Eight seconds of 4 KiB random writes, sixteen in flight at once, bypassing the page cache (<code>--direct=1</code>), while <code>iostat</code> watches:</p>
<pre><code>fio --name=ghi-ngau-nhien --filename=/var/tmp/fio.dat --size=128M --rw=randwrite --bs=4k \\
    --direct=1 --ioengine=libaio --iodepth=16 --runtime=8 --time_based --group_reporting &amp;
iostat -xz 1 2
pidstat -d 1 2 | tail -1</code></pre>
<div class="out">Device   r/s  rkB/s … w/s       wkB/s     wrqm/s %wrqm w_await wareq-sz … aqu-sz  %util
vda     0.00   0.00 … 64017.00 256068.00  0.00   0.00    0.17     4.00 …  10.77  66.20
Average:        0     34997      0.00 374157.21      0.00       0  fio
  write: IOPS=44.7k, BW=174MiB/s (183MB/s)(1398MiB/8016msec); 0 zone resets
     | 99.00th=[  1975], 99.50th=[  2737], 99.90th=[  5014], 99.95th=[  6456],</div>
<p>Read it the USE way. <strong>Utilization</strong>: <code>%util</code> 66% — but on SSD and NVMe, which serve many requests in parallel, <code>%util</code> only means "the device had at least one request in progress 66% of the time"; a device at 100% can often take much more. <strong>Saturation</strong>: <code>aqu-sz</code> 10.77 requests queued on average, and <code>w_await</code> 0.17 ms per write including queueing — fast. A slow HDD or an overloaded cloud volume shows the opposite: <code>w_await</code> of tens of milliseconds with <code>aqu-sz</code> climbing. <strong>Errors</strong>: <code>journalctl -k | grep -i "i/o error"</code>, or a filesystem remounted read-only. <code>pidstat -d</code> answers "who is writing?" when <code>iotop</code> is not installed. And fio's percentile line is what users feel: the average write took 0.35 ms, but 1% took longer than 1.975 ms and 0.1% longer than 5 ms. Delete the test file afterwards; never point <code>fio</code> at a device path (<code>/dev/sda</code>) you care about — writing to it destroys the filesystem.</p>

<h3>Network: throughput, errors and queues</h3>
${slide('lx-14', 15, 'Mạng: iperf3, sar -n DEV, ss -s')}
<p><code>iperf3</code> measures the throughput between two machines: one side runs <code>iperf3 -s</code>, the other connects. Between two containers on the same host (so the number is memory speed, not a real link):</p>
<pre><code>iperf3 -s -p 19140                        <span class="tok-comment"># machine A</span>
iperf3 -c lx14-srv -p 19140 -t 5          <span class="tok-comment"># machine B</span>
sar -n DEV 1 3 | grep -E "IFACE|eth0" | tail -2
sar -n EDEV 1 1 | grep -E "IFACE|eth0" | tail -2
ss -s; nstat -az TcpRetransSegs TcpExtListenOverflows</code></pre>
<div class="out">[ ID] Interval           Transfer     Bitrate         Retr
[  5]   0.00-5.00   sec  27.1 GBytes  46.5 Gbits/sec  3491             sender
Average:        IFACE   rxpck/s   txpck/s    rxkB/s    txkB/s   rxcmp/s   txcmp/s  rxmcst/s   %ifutil
Average:         eth0  50715.33 129778.67   3269.43 5720310.46      0.00      0.00      0.00    468.61
Average:        IFACE   rxerr/s   txerr/s    coll/s  rxdrop/s  txdrop/s  txcarr/s  rxfram/s  rxfifo/s  txfifo/s
Average:         eth0      0.00      0.00      0.00      0.00      0.00      0.00      0.00      0.00      0.00
TCP:   103 (estab 0, closed 102, orphaned 0, timewait 2)
TcpRetransSegs                  0                  0.0
TcpExtListenOverflows           0                  0.0</div>
<p><strong>Utilization</strong>: <code>rxkB/s</code> and <code>txkB/s</code> against the link's real capacity — not <code>%ifutil</code>, which here claims 468% because a virtual <code>veth</code> interface reports a nominal speed that has nothing to do with reality. On any VM, trust absolute numbers. <strong>Saturation</strong>: retransmissions (<code>TcpRetransSegs</code> rising), and <code>TcpExtListenOverflows</code> — connections dropped because the application did not <code>accept()</code> them fast enough (the <code>Recv-Q</code> of Lesson 12.1's <code>ss -lnt</code>). <strong>Errors</strong>: <code>sar -n EDEV</code> or <code>ip -s link</code>: <code>rxerr</code>, <code>rxdrop</code>. <code>ss -s</code> is the one-line census: thousands of <code>timewait</code> on a busy proxy is normal; thousands of <code>estab</code> on a small API means clients are not closing connections.</p>

<h3>Try it step by step: the full USE sweep in one container</h3>
<p>In <code>docker run --rm -it --name lab-use --memory 512m ubuntu:24.04 bash</code> with <code>apt-get update &amp;&amp; apt-get install -y sysstat stress-ng fio iproute2 python3</code>:</p>
<ol>
<li><strong>Baseline</strong> (nothing running): <code>mpstat -P ALL 1 1</code>, <code>vmstat 1 3</code>, <code>cat /proc/pressure/cpu</code>. Write down <code>r</code>, <code>%idle</code>, <code>some avg10</code>.</li>
<li><strong>One core</strong>: <code>timeout 10 python3 -c "while True: pass" &amp;</code> then <code>mpstat -P ALL 2 1</code> — find the one core at 100%, and <code>pidstat -u 2 1</code> for the PID.</li>
<li><strong>Saturation</strong>: <code>stress-ng --cpu $(( $(nproc) * 2 )) --timeout 10s -q &amp;</code> then <code>vmstat 1 5</code> — <code>r</code> should be about twice <code>nproc</code>; <code>cat /proc/pressure/cpu</code> — <code>avg10</code> well above zero.</li>
<li><strong>Disk</strong>: the <code>fio</code> command above with <code>--runtime=6</code>, plus <code>iostat -xz 1 3</code> in a second <code>docker exec</code> shell. Note <code>w_await</code> and <code>aqu-sz</code>, then <code>rm /var/tmp/fio.dat</code>.</li>
<li><strong>Memory</strong>: <code>free -m</code> before and after <code>head -c 100M /dev/urandom &gt; /tmp/x; cat /tmp/x &gt; /dev/null</code> — watch <code>buff/cache</code> grow while <code>available</code> barely moves.</li>
</ol>

<h3>How macOS and WSL differ</h3>
<table>
<tr><th>Need</th><th>Linux</th><th>macOS 27 (measured)</th><th>WSL2</th></tr>
<tr><td>Per-core CPU</td><td><code>mpstat -P ALL</code></td><td>no <code>mpstat</code>/<code>sar</code>; <code>top -o cpu</code>, Activity Monitor</td><td>as Linux (<code>apt install sysstat</code>)</td></tr>
<tr><td>Disk</td><td><code>iostat -xz</code></td><td>BSD <code>iostat</code>: different columns (<code>KB/t tps MB/s</code> per disk, then <code>us sy id</code> and load)</td><td>as Linux, but the virtual disk is a file on Windows</td></tr>
<tr><td>Memory</td><td><code>free</code>, <code>vmstat</code>, PSI</td><td><code>vm_stat</code> (pages of 16384 bytes), <code>memory_pressure</code>, <code>sysctl vm.swapusage</code></td><td>as Linux; WSL's memory is capped by <code>.wslconfig</code></td></tr>
<tr><td>Profiler</td><td><code>perf</code></td><td>not available; Instruments or <code>sample PID</code></td><td>not from Ubuntu's <code>linux-tools</code> packages (they are built for Ubuntu's kernels, not WSL's)</td></tr>
</table>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the night before your SWP391 demo, the booking API "gets slow at random"; the VPS dashboard shows CPU at 12%. Prove or rule out each resource with numbers, in a throwaway container (<code>--memory 512m</code>, packages from "Try it step by step").</p><ol>
<li>Save <code>app.py</code> with two functions, one doing <code>sum(i*0.1 for i in range(20000))</code> in a loop and one doing <code>sum(range(2000))</code>; run it under <code>perf record -F 999 -g -- python3 -X perf app.py</code> (install <code>linux-tools-generic</code> and call <code>/usr/lib/linux-tools/*/perf</code> if <code>perf</code> complains about the kernel version).</li>
<li>Read <code>perf report --stdio --children --sort sym | grep py::</code> and name the function to optimise, with its percentage.</li>
<li>While the script runs again, take <code>mpstat -P ALL 2 1</code> and <code>pidstat -u 2 1</code>: which core, which PID.</li>
<li>Create CPU saturation with <code>stress-ng</code> for at most 12 seconds and capture <code>r</code> from <code>vmstat</code> and <code>some avg10</code> from PSI.</li>
<li>Write a four-line USE verdict: CPU (U/S/E), memory, disk, network — each with the one number that decided it.</li></ol>
<p><strong>Done when:</strong> the profile names one function above 80%; you found one core at ~100% while <code>all</code> was low; <code>r</code> exceeded <code>nproc</code> and <code>avg10</code> was above 0 during the stress run; and your verdict cites a number for every line.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Utilization</span><span class="v">The share of time a resource was busy.</span></div>
  <div class="kv"><span class="k">Saturation</span><span class="v">Work queued because the resource could not take it — measured as a queue length or waiting time.</span></div>
  <div class="kv"><span class="k">Run queue (r)</span><span class="v">Tasks running or ready to run; above the number of cores means some are waiting.</span></div>
  <div class="kv"><span class="k">PSI — pressure stall information</span><span class="v">Percentage of time tasks were stalled waiting for CPU, memory or I/O (<code>/proc/pressure</code>).</span></div>
  <div class="kv"><span class="k">Steal time</span><span class="v">CPU time the hypervisor gave to another virtual machine while yours wanted it.</span></div>
  <div class="kv"><span class="k">Profiler / sampling</span><span class="v">A tool that records call stacks many times a second to show where time is spent.</span></div>
  <div class="kv"><span class="k">Flame graph</span><span class="v">A picture of sampled stacks: width = share of samples, not time order.</span></div>
  <div class="kv"><span class="k">await / aqu-sz</span><span class="v">Average time per disk request including queueing / average queue length.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>USE: for every resource check utilization, saturation and errors — the whole table before any one cell.</li>
<li><code>mpstat -P ALL</code> finds the maxed-out core that the <code>all</code> average hides; <code>pidstat</code> names the process.</li>
<li>Saturation is a queue: <code>vmstat</code>'s <code>r</code> above the core count, PSI's <code>avg10</code> above zero; load averages react too slowly for bursts.</li>
<li><code>perf record -g</code> + <code>perf report</code> (and a flame graph) name the function; Python needs <code>-X perf</code>, stripped binaries show only addresses.</li>
<li>For disks read <code>await</code> and <code>aqu-sz</code>; <code>%util</code> overstates trouble on SSDs, and fio's p99 is what users feel.</li>
<li>For networks trust kB/s, drops and retransmissions over <code>%ifutil</code>; <code>sar</code> keeps ten-minute history on Ubuntu 24.04 by default.</li>
</ul>

<a class="link-card" href="https://www.brendangregg.com/usemethod.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">The USE Method — Brendan Gregg</span><span class="lc-sub">The original page: definitions, the resource list, and why low average utilization does not rule out saturation.</span></span>
</a>
<a class="link-card" href="https://www.brendangregg.com/USEmethod/use-linux.html" target="_blank" rel="noopener">
  <span class="lc-ico">🗒️</span>
  <span class="lc-body"><span class="lc-title">USE Method: Linux Performance Checklist</span><span class="lc-sub">Every cell of the table filled in with Linux commands — the page to keep open during an incident.</span></span>
</a>
<a class="link-card" href="https://www.brendangregg.com/flamegraphs.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔥</span>
  <span class="lc-body"><span class="lc-title">Flame Graphs</span><span class="lc-sub">How to read them, how they are made, and why the x-axis is not time.</span></span>
</a>
<a class="link-card" href="https://perfwiki.github.io/main/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">perf wiki</span><span class="lc-sub">The official tutorial for <code>perf stat</code>, <code>record</code>, <code>report</code> and <code>top</code>.</span></span>
</a>
<a class="link-card" href="https://docs.python.org/3/howto/perf_profiling.html" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Python support for the Linux perf profiler</span><span class="lc-sub">What <code>-X perf</code> does and how Python function names end up in <code>perf report</code>.</span></span>
</a>
<a class="link-card" href="https://www.kernel.org/doc/html/latest/accounting/psi.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">PSI — Pressure Stall Information</span><span class="lc-sub">The kernel's documentation for <code>/proc/pressure</code>: what <code>some</code> and <code>full</code> mean.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>A benchmark on a shared machine measures the neighbours too.</strong> The <code>mpstat</code> baseline on the test machine already showed one core at 72% before any experiment started — other containers were running on the same VM. Always take a baseline with nothing of yours running, keep load tests short, and never run <code>stress-ng</code> or <code>fio</code> on a production server: the "experiment" becomes the incident.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Averages hide the problem: per core, per second, per percentile. Saturation (a queue, a stall) matters more than utilization (a percentage). And stop at the level that answers the question — <code>pidstat</code> is usually enough; reach for <code>perf</code> when you must choose which function to rewrite.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.2</span>
<h2>Hiệu năng theo phương pháp USE</h2>
<p class="lead">Bài 12.1 cho bạn một cuộc quét sáu mươi giây và cái nhìn đầu tiên về phương pháp USE; Bài 12.3 đọc <code>vmstat</code> và <code>iostat</code> giữa một sự cố. Bài này làm cho trọn. Bạn sẽ đi hết bảng USE, từng tài nguyên một, học các công cụ của <code>sysstat</code> trả lời từng ô, rồi đi sâu hơn tất cả chúng một tầng: <code>perf</code>, thứ không chỉ nói <em>tiến trình nào</em> đang đốt CPU mà nói <em>hàm nào</em>. Mọi con số dưới đây đo trên một máy Ubuntu 24.04 có 10 vCPU; không tải nào chạy quá mười hai giây.</p>

<h3>Phương pháp: mỗi tài nguyên, ba câu hỏi</h3>
${slide('lx-14', 10, 'Phương pháp USE')}
<p>Brendan Gregg công bố phương pháp USE năm 2012 và tóm nó trong một dòng: <em>"For every resource, check utilization, saturation, and errors."</em> (Với mọi tài nguyên, hãy kiểm mức dùng, mức bão hoà và lỗi.) Ông định nghĩa các chữ rất chặt, và chính định nghĩa làm cho phương pháp chạy được:</p>
<ul>
<li><strong>Utilization</strong> (mức dùng) — thời gian trung bình tài nguyên bận làm việc, thường là phần trăm trong một khoảng ("một đĩa bận 90%").</li>
<li><strong>Saturation</strong> (mức bão hoà) — lượng việc thừa đang phải chờ vì tài nguyên không nhận kịp, thường là độ dài hàng chờ ("hàng chờ CPU trung bình là bốn").</li>
<li><strong>Errors</strong> (lỗi) — số lần xảy ra lỗi. Kiểm cái này trước: nó dễ đọc nhất và nhiều khi là toàn bộ câu trả lời.</li>
</ul>
<p>Trên trang của mình, ông ước tính nó "giải được khoảng 80% sự cố máy chủ với 5% công sức". Kỷ luật ở đây là điền <em>mọi</em> ô trước khi đào sâu vào một ô, vì mục tiêu là tài nguyên <em>đã cạn</em>, không phải tài nguyên <em>thú vị</em>. Và hãy dè chừng số trung bình: Gregg kể về một khách hàng mà hệ thống giám sát chưa bao giờ thấy CPU vượt 80% theo trung bình năm phút, trong khi CPU nằm ở 100% từng quãng vài giây — mức dùng trung bình thấp không loại trừ được bão hoà. Đó là lý do các công cụ bên dưới lấy mẫu mỗi giây.</p>

<h3>Hộp đồ nghề: sysstat, và lịch sử bạn đã có sẵn</h3>
<p>Phần lớn công cụ nằm trong một gói: <code>sudo apt install sysstat</code> (Fedora: <code>sudo dnf install sysstat</code>) cho bạn <code>mpstat</code>, <code>pidstat</code>, <code>iostat</code> và <code>sar</code>. Trên Ubuntu 24.04 nó còn cài một timer systemd ghi một bản chụp mỗi mười phút, nên <code>sar</code> trả lời được câu "lúc 2 giờ sáng máy đang làm gì?" sau khi mọi chuyện đã qua:</p>
<pre><code>systemctl list-timers --all | grep sysstat
sar -q -f /var/log/sysstat/sa28          <span class="tok-comment"># saDD = ngày trong tháng</span></code></pre>
<div class="out">Mon 2026-09-28 16:50:00 UTC  5min Mon 2026-09-28 16:40:03 UTC 4min 9s ago sysstat-collect.timer  sysstat-collect.service
Tue 2026-09-29 00:07:00 UTC    7h -                                      - sysstat-summary.timer  sysstat-summary.service
16:16:02     LINUX RESTART	(10 CPU)
16:20:24      runq-sz  plist-sz   ldavg-1   ldavg-5  ldavg-15   blocked
16:30:03            0       683      0.14      0.30      0.69         0
16:40:03            0       692      0.12      0.17      0.42         0</div>
<p>Một bất ngờ đáng biết: trên cùng cái máy đó, <code>/etc/default/sysstat</code> vẫn ghi <code>ENABLED="false"</code>. Biến này chỉ điều khiển script cron cũ (<code>debian-sa1</code>); timer systemd gọi thẳng <code>/usr/lib/sysstat/sa1</code> và lờ nó đi. <code>lynis</code> (Bài 14.4) đọc file đó và báo "sysstat đang tắt" — trong khi <code>sa28</code> vẫn được ghi đều mười phút một lần. Kiểm bằng <code>ls /var/log/sysstat/</code>, đừng kiểm bằng cách đọc một file cấu hình.</p>
<table>
<tr><th>Lệnh</th><th>Cờ</th><th>Nghĩa</th></tr>
<tr><td><code>mpstat</code></td><td><code>-P ALL 1</code></td><td>Từng lõi riêng, mỗi giây</td></tr>
<tr><td><code>pidstat</code></td><td><code>-u</code> · <code>-r</code> · <code>-d</code> · <code>-t</code> · <code>-p PID</code></td><td>Theo tiến trình: CPU · bộ nhớ và lỗi trang · I/O đĩa · theo luồng · một tiến trình</td></tr>
<tr><td><code>iostat</code></td><td><code>-x</code> · <code>-z</code> · <code>-m</code></td><td>Cột mở rộng của thiết bị · ẩn thiết bị đang rảnh · đơn vị megabyte</td></tr>
<tr><td><code>sar</code></td><td><code>-u</code> · <code>-q</code> · <code>-r</code> · <code>-n DEV</code> · <code>-n EDEV</code> · <code>-f file</code></td><td>CPU · hàng chờ và tải · bộ nhớ · lưu lượng mạng · lỗi mạng · đọc lịch sử</td></tr>
<tr><td><code>vmstat</code></td><td><code>1</code> · <code>-S M</code> · <code>-w</code></td><td>Mỗi giây · đơn vị MB · cột rộng (thuộc procps, không cần cài)</td></tr>
</table>

<h3>Mức dùng CPU: "rảnh 90%" trong khi một lõi đã kịch trần</h3>
${slide('lx-14', 11, 'Một lõi kịch trần: mpstat -P ALL, pidstat')}
<p>Cách đọc sai kinh điển: dòng đầu của <code>top</code> nói CPU rảnh 90%, vậy CPU không thể là thủ phạm. Chạy một vòng lặp bận đơn luồng trên máy 10 lõi rồi nhìn cho đúng cách:</p>
<pre><code>python3 ban.py &amp;                                   <span class="tok-comment"># vòng lặp đơn luồng 8 giây</span>
mpstat -P ALL 2 1 | grep Average
pidstat -u 2 1 | grep -E "Average|UID" | sort -k8 -nr | head -3</code></pre>
<div class="out">Average:     CPU    %usr   %nice    %sys %iowait    %irq   %soft  %steal  %guest  %gnice   %idle
Average:     all   10.26    0.00    0.20    0.10    0.00    0.55    0.00    0.00    0.00   88.89
Average:       5  100.00    0.00    0.00    0.00    0.00    0.00    0.00    0.00    0.00    0.00
…
Average:        0       235  100.00    0.00    0.00    0.00  100.00     -  python3
Average:      UID       PID    %usr %system  %guest   %wait    %CPU   CPU  Command</div>
<p>Dòng <code>all</code> — 10% — đúng bằng một lõi trên mười. <code>-P ALL</code> cho thấy sự thật: lõi 5 ở 100%, không còn gì để cho thêm. <code>pidstat</code> gọi tên thủ phạm. Kết luận này đổi hẳn cách sửa: ứng dụng chạy đơn luồng, nên một máy chủ to hơn nhiều lõi hơn không làm nó nhanh thêm chút nào; bạn cần mã nhanh hơn, hoặc nhiều tiến trình worker (chế độ cluster của Node, nhiều worker Gunicorn). Các cột đáng biết của <code>mpstat</code>: <code>%usr</code> mã của bạn, <code>%sys</code> nhân làm việc cho nó (cao = nhiều syscall, Bài 14.1), <code>%iowait</code> rảnh vì đang chờ đĩa, <code>%steal</code> thời gian trình ảo hoá lấy vCPU của bạn đưa cho khách khác — trên VPS rẻ, <code>%steal</code> đều đều trên vài phần trăm nghĩa là hàng xóm ồn ào, không phải mã của bạn.</p>

<h3>Bão hoà CPU: đếm hàng chờ, đừng nhìn phần trăm</h3>
${slide('lx-14', 12, 'Bão hoà: vmstat r, PSI')}
<p>CPU ở 100% chưa chắc đã có chuyện; việc phải <em>chờ</em> CPU mới là chuyện. Hai mươi worker ăn CPU trên mười lõi, trong mười hai giây:</p>
<pre><code>stress-ng --cpu 20 --timeout 12s -q &amp;
vmstat 1 4
cat /proc/pressure/cpu
cat /proc/loadavg</code></pre>
<div class="out">procs -----------memory---------- ---swap-- -----io---- -system-- -------cpu-------
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st gu
23  0 452384 646692 1691380 2874872    6    9    75   327 1148    1  0  0 99  0  0  0
20  0 452384 646692 1691384 2874868    0    0     0   148 7830 2961 99  1  0  0  0  0
20  0 452384 646692 1691384 2874868    0    0     0     0 7856 2819 100  0  0  0  0  0
20  0 452384 646692 1691384 2874868    0    0     0     0 8130 3055 100  0  0  0  0  0
some avg10=31.37 avg60=7.11 avg300=2.23 total=509912285
full avg10=0.00 avg60=0.00 avg300=0.00 total=0
1.94 1.03 1.14 23/696 276</div>
<p>Bỏ qua dòng đầu của <code>vmstat</code> — nó là trung bình kể từ lúc khởi động (<code>id 99</code> của nó chẳng nói gì về hiện tại). Sau đó, <code>r</code> = 20: hai mươi tác vụ đang chạy hoặc sẵn sàng chạy trên mười lõi, nên trung bình một nửa đang phải chờ. Đó là bão hoà. Tín hiệu thứ hai mới hơn và tốt hơn: <strong>PSI</strong> (pressure stall information — thông tin nghẽn do áp lực, có từ Linux 4.20) trong <code>/proc/pressure/cpu</code>. <code>some avg10=31.37</code> nghĩa là trong mười giây vừa qua, có ít nhất một tác vụ bị treo chờ CPU trong 31% thời gian. <code>full</code> (mọi tác vụ cùng bị treo) có nghĩa với bộ nhớ và I/O. Giờ nhìn load average: 1,94. Load average là một trung bình giảm dần theo hàm mũ, nên ba giây sau khi tải ập tới nó gần như chưa nhúc nhích — đúng cái bẫy trung bình năm phút của Gregg. <code>avg10</code> của PSI phản ứng trong vài giây; <code>r</code> cũng vậy.</p>
<p>Ba file tương tự có cho các tài nguyên khác: <code>/proc/pressure/memory</code> (tác vụ bị treo vì phải thu hồi bộ nhớ hoặc swap) và <code>/proc/pressure/io</code>. Và mỗi cgroup có <code>cpu.pressure</code>, <code>memory.pressure</code>, <code>io.pressure</code> riêng — nên bạn hỏi được "<em>dịch vụ này</em> có đang đói không?" thay vì "cả máy có đói không?".</p>

<h3>perf và flame graph: hàm nào đang ăn CPU</h3>
${slide('lx-14', 13, 'perf và flame graph')}
<p>Khi <code>pidstat</code> đã gọi tên tiến trình, câu hỏi kế tiếp là thời gian đi đâu bên trong nó. <code>perf</code> là bộ đo hiệu năng (profiler) của chính nhân Linux (trên Ubuntu nằm trong gói <code>linux-tools-$(uname -r)</code>). Nó lấy mẫu ngăn xếp lời gọi của từng CPU nhiều lần mỗi giây; hàm nào xuất hiện trong nhiều mẫu thì thời gian nằm ở đó. Ba lệnh lo được phần lớn nhu cầu:</p>
<pre><code>perf stat -e task-clock,context-switches,page-faults -- python3 -c "sum(range(10**7))"
perf record -F 999 -g -- python3 -X perf app.py     <span class="tok-comment"># 999 mẫu/giây, kèm ngăn xếp</span>
perf report --stdio --children --sort sym | grep "py::"</code></pre>
<div class="out">            146.08 msec task-clock                       #    0.994 CPUs utilized
                 1      context-switches                 #    6.846 /sec
               819      page-faults                      #    5.607 K/sec
   &lt;not supported&gt;      cycles
    96.60%     0.00%  [.] py::&lt;module&gt;:/tmp/app.py
    96.60%     0.00%  [.] py::xu_ly_don:/tmp/app.py
    93.96%     0.00%  [.] py::tinh_thue:/tmp/app.py
    67.55%     3.40%  [.] py::tinh_thue.&lt;locals&gt;.&lt;genexpr&gt;:/tmp/app.py
     2.64%     0.00%  [.] py::doc_cau_hinh:/tmp/app.py</div>
<p>Script gọi hai hàm trong một vòng lặp, <code>tinh_thue</code> và <code>doc_cau_hinh</code>. Bản đo khép lại mọi tranh cãi nên tối ưu cái nào: 94% số mẫu nằm trong <code>tinh_thue</code>, 2,6% trong <code>doc_cau_hinh</code>. Làm hàm đọc cấu hình nhanh gấp mười lần cũng gần như chẳng tiết kiệm được gì. Ba ghi chú thực tế. <code>-X perf</code> (Python 3.12 trở lên) là thứ biến hàm Python thành cái tên mà <code>perf</code> hiển thị được; thiếu nó bạn chỉ thấy các hàm C của trình thông dịch. Một file thực thi đã bị lược ký hiệu (stripped) chỉ hiện địa chỉ — đo <code>gzip</code> in ra những dòng như <code>0x0000000000003104</code> cho tới khi cài ký hiệu gỡ lỗi. Và trong máy ảo, container thì bộ đếm phần cứng thường không có (<code>cycles &lt;not supported&gt;</code>), nhưng sự kiện phần mềm như <code>task-clock</code> và lấy mẫu theo <code>cpu-clock</code> vẫn chạy. <code>perf top</code> là bản chạy trực tiếp, như <code>top</code> nhưng cho hàm; với tài khoản thường nó cần <code>kernel.perf_event_paranoid</code> ≤ 2 (mặc định của Fedora 44 là 2, cho phép đo tiến trình của chính mình).</p>
<p><strong>Flame graph</strong> (biểu đồ ngọn lửa), do Gregg công bố tháng 12/2011, vẽ chính những mẫu đó thành hình: mỗi hộp là một hàm, hộp ngay dưới là hàm đã gọi nó, và <em>bề rộng</em> là tỉ lệ số mẫu. Trục ngang KHÔNG phải thời gian — các hộp được xếp theo tên để những ngăn xếp giống nhau gộp lại. Bạn đọc nó bằng cách tìm những cao nguyên rộng ở gần đỉnh. Slide vẽ lại các con số ở trên; để sinh file SVG thật:</p>
<pre><code>git clone --depth 1 https://github.com/brendangregg/FlameGraph
perf script | ./FlameGraph/stackcollapse-perf.pl &gt; out.folded
./FlameGraph/flamegraph.pl out.folded &gt; flame.svg      <span class="tok-comment"># mở bằng trình duyệt</span></code></pre>

<h3>Bộ nhớ: available, page cache, và các cột swap</h3>
<p>Bài 5.2 đã giải thích vì sao "free" gần bằng 0 là bình thường. Ở mức USE: <strong>mức dùng</strong> là cột <code>available</code> của <code>free -m</code> so với <code>total</code>; <strong>bão hoà</strong> là nhân phải vất vả tìm bộ nhớ — <code>si</code>/<code>so</code> của <code>vmstat</code> (swap vào/ra mỗi giây) khác 0 và đang tăng, hoặc <code>/proc/pressure/memory</code> lớn hơn 0; <strong>lỗi</strong> là những cú OOM-kill trong <code>journalctl -k</code> hoặc trong <code>memory.events</code> của một cgroup (Bài 14.1). Muốn biết bao nhiêu phần của một file đang nằm trong page cache (bộ đệm trang), <code>fincore</code> (gói <code>util-linux-extra</code> trên Ubuntu) trả lời thẳng:</p>
<pre><code>free -m
fincore du-lieu.txt</code></pre>
<div class="out">               total        used        free      shared  buff/cache   available
Mem:            7934        2808         459          88        4952        5125
Swap:           1023         427         596
  RES PAGES  SIZE FILE
81.1M 20750 81.1M du-lieu.txt</div>
<p>459 MB "free" nhưng 5.125 MB <code>available</code>: phần lớn 4,9 GB <code>buff/cache</code> là nội dung file mà nhân sẽ vứt bỏ ngay khi một chương trình cần bộ nhớ — gồm cả trọn 81 MB của file kia. <code>pidstat -r 1</code> thêm bộ nhớ theo từng tiến trình và <code>majflt/s</code> (major page fault — lỗi trang lớn: những trang phải đọc lại từ đĩa; đều đều liên tục nghĩa là tập làm việc không vừa RAM).</p>

<h3>Đĩa: đọc await và aqu-sz, đừng chỉ nhìn %util</h3>
${slide('lx-14', 14, 'Đĩa: iostat -x, fio')}
<p>Muốn xem một đĩa dưới tải mà không làm hỏng gì, <code>fio</code> sinh ra một khối việc có kiểm soát trên một file. Tám giây ghi ngẫu nhiên từng khối 4 KiB, mười sáu yêu cầu cùng bay một lúc, đi thẳng qua page cache (<code>--direct=1</code>), trong khi <code>iostat</code> theo dõi:</p>
<pre><code>fio --name=ghi-ngau-nhien --filename=/var/tmp/fio.dat --size=128M --rw=randwrite --bs=4k \\
    --direct=1 --ioengine=libaio --iodepth=16 --runtime=8 --time_based --group_reporting &amp;
iostat -xz 1 2
pidstat -d 1 2 | tail -1</code></pre>
<div class="out">Device   r/s  rkB/s … w/s       wkB/s     wrqm/s %wrqm w_await wareq-sz … aqu-sz  %util
vda     0.00   0.00 … 64017.00 256068.00  0.00   0.00    0.17     4.00 …  10.77  66.20
Average:        0     34997      0.00 374157.21      0.00       0  fio
  write: IOPS=44.7k, BW=174MiB/s (183MB/s)(1398MiB/8016msec); 0 zone resets
     | 99.00th=[  1975], 99.50th=[  2737], 99.90th=[  5014], 99.95th=[  6456],</div>
<p>Đọc theo kiểu USE. <strong>Mức dùng</strong>: <code>%util</code> 66% — nhưng với SSD và NVMe, những thiết bị phục vụ nhiều yêu cầu song song, <code>%util</code> chỉ có nghĩa "thiết bị có ít nhất một yêu cầu đang xử lý trong 66% thời gian"; một thiết bị ở 100% thường vẫn gánh được nhiều hơn nữa. <strong>Bão hoà</strong>: <code>aqu-sz</code> trung bình 10,77 yêu cầu đang xếp hàng, và <code>w_await</code> 0,17 ms cho mỗi lần ghi kể cả thời gian xếp hàng — nhanh. Một ổ HDD chậm hay một ổ cloud quá tải cho thấy điều ngược lại: <code>w_await</code> hàng chục mili giây và <code>aqu-sz</code> leo dần. <strong>Lỗi</strong>: <code>journalctl -k | grep -i "i/o error"</code>, hoặc hệ thống file bị gắn lại ở chế độ chỉ đọc. <code>pidstat -d</code> trả lời "ai đang ghi?" khi máy không cài <code>iotop</code>. Còn dòng phân vị của fio là thứ người dùng cảm nhận: trung bình một lần ghi mất 0,35 ms, nhưng 1% mất hơn 1,975 ms và 0,1% mất hơn 5 ms. Xoá file thử sau khi xong; và đừng bao giờ trỏ <code>fio</code> vào một đường dẫn thiết bị (<code>/dev/sda</code>) mà bạn quý — ghi vào đó là phá hệ thống file.</p>

<h3>Mạng: băng thông, lỗi và hàng chờ</h3>
${slide('lx-14', 15, 'Mạng: iperf3, sar -n DEV, ss -s')}
<p><code>iperf3</code> đo băng thông giữa hai máy: một bên chạy <code>iperf3 -s</code>, bên kia kết nối tới. Giữa hai container trên cùng một máy (nên con số là tốc độ bộ nhớ, không phải một đường truyền thật):</p>
<pre><code>iperf3 -s -p 19140                        <span class="tok-comment"># máy A</span>
iperf3 -c lx14-srv -p 19140 -t 5          <span class="tok-comment"># máy B</span>
sar -n DEV 1 3 | grep -E "IFACE|eth0" | tail -2
sar -n EDEV 1 1 | grep -E "IFACE|eth0" | tail -2
ss -s; nstat -az TcpRetransSegs TcpExtListenOverflows</code></pre>
<div class="out">[ ID] Interval           Transfer     Bitrate         Retr
[  5]   0.00-5.00   sec  27.1 GBytes  46.5 Gbits/sec  3491             sender
Average:        IFACE   rxpck/s   txpck/s    rxkB/s    txkB/s   rxcmp/s   txcmp/s  rxmcst/s   %ifutil
Average:         eth0  50715.33 129778.67   3269.43 5720310.46      0.00      0.00      0.00    468.61
Average:        IFACE   rxerr/s   txerr/s    coll/s  rxdrop/s  txdrop/s  txcarr/s  rxfram/s  rxfifo/s  txfifo/s
Average:         eth0      0.00      0.00      0.00      0.00      0.00      0.00      0.00      0.00      0.00
TCP:   103 (estab 0, closed 102, orphaned 0, timewait 2)
TcpRetransSegs                  0                  0.0
TcpExtListenOverflows           0                  0.0</div>
<p><strong>Mức dùng</strong>: <code>rxkB/s</code> và <code>txkB/s</code> so với năng lực thật của đường truyền — không phải <code>%ifutil</code>, ở đây khẳng định 468% vì một card ảo <code>veth</code> tự khai một tốc độ danh nghĩa chẳng dính gì tới thực tế. Trên mọi máy ảo, tin con số tuyệt đối. <strong>Bão hoà</strong>: gói phải gửi lại (<code>TcpRetransSegs</code> tăng), và <code>TcpExtListenOverflows</code> — kết nối bị bỏ vì ứng dụng không <code>accept()</code> kịp (chính là <code>Recv-Q</code> trong <code>ss -lnt</code> của Bài 12.1). <strong>Lỗi</strong>: <code>sar -n EDEV</code> hoặc <code>ip -s link</code>: <code>rxerr</code>, <code>rxdrop</code>. <code>ss -s</code> là bản điều tra dân số một dòng: hàng nghìn <code>timewait</code> trên một proxy bận là bình thường; hàng nghìn <code>estab</code> trên một API nhỏ nghĩa là trình khách không chịu đóng kết nối.</p>

<h3>Chạy thử từng bước: trọn cuộc quét USE trong một container</h3>
<p>Trong <code>docker run --rm -it --name lab-use --memory 512m ubuntu:24.04 bash</code> với <code>apt-get update &amp;&amp; apt-get install -y sysstat stress-ng fio iproute2 python3</code>:</p>
<ol>
<li><strong>Mốc nền</strong> (chưa chạy gì): <code>mpstat -P ALL 1 1</code>, <code>vmstat 1 3</code>, <code>cat /proc/pressure/cpu</code>. Ghi lại <code>r</code>, <code>%idle</code>, <code>some avg10</code>.</li>
<li><strong>Một lõi</strong>: <code>timeout 10 python3 -c "while True: pass" &amp;</code> rồi <code>mpstat -P ALL 2 1</code> — tìm lõi duy nhất ở 100%, và <code>pidstat -u 2 1</code> để lấy PID.</li>
<li><strong>Bão hoà</strong>: <code>stress-ng --cpu $(( $(nproc) * 2 )) --timeout 10s -q &amp;</code> rồi <code>vmstat 1 5</code> — <code>r</code> phải vào khoảng gấp đôi <code>nproc</code>; <code>cat /proc/pressure/cpu</code> — <code>avg10</code> lớn hơn 0 rõ rệt.</li>
<li><strong>Đĩa</strong>: lệnh <code>fio</code> ở trên với <code>--runtime=6</code>, kèm <code>iostat -xz 1 3</code> trong một shell <code>docker exec</code> thứ hai. Ghi lại <code>w_await</code> và <code>aqu-sz</code>, rồi <code>rm /var/tmp/fio.dat</code>.</li>
<li><strong>Bộ nhớ</strong>: <code>free -m</code> trước và sau <code>head -c 100M /dev/urandom &gt; /tmp/x; cat /tmp/x &gt; /dev/null</code> — nhìn <code>buff/cache</code> tăng trong khi <code>available</code> gần như đứng yên.</li>
</ol>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Nhu cầu</th><th>Linux</th><th>macOS 27 (đo thật)</th><th>WSL2</th></tr>
<tr><td>CPU theo lõi</td><td><code>mpstat -P ALL</code></td><td>không có <code>mpstat</code>/<code>sar</code>; dùng <code>top -o cpu</code>, Activity Monitor</td><td>như Linux (<code>apt install sysstat</code>)</td></tr>
<tr><td>Đĩa</td><td><code>iostat -xz</code></td><td><code>iostat</code> kiểu BSD: cột khác hẳn (<code>KB/t tps MB/s</code> cho từng đĩa, rồi <code>us sy id</code> và tải)</td><td>như Linux, nhưng đĩa ảo là một file trên Windows</td></tr>
<tr><td>Bộ nhớ</td><td><code>free</code>, <code>vmstat</code>, PSI</td><td><code>vm_stat</code> (trang 16384 byte), <code>memory_pressure</code>, <code>sysctl vm.swapusage</code></td><td>như Linux; bộ nhớ của WSL bị giới hạn bởi <code>.wslconfig</code></td></tr>
<tr><td>Profiler</td><td><code>perf</code></td><td>không có; dùng Instruments hoặc <code>sample PID</code></td><td>không lấy được từ gói <code>linux-tools</code> của Ubuntu (gói đó dựng cho nhân của Ubuntu, không phải nhân của WSL)</td></tr>
</table>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> đêm trước buổi demo SWP391, API đặt lịch "thỉnh thoảng chậm vô cớ"; bảng điều khiển của VPS cho thấy CPU 12%. Hãy chứng minh hoặc loại trừ từng tài nguyên bằng con số, trong một container dùng xong vứt (<code>--memory 512m</code>, cài các gói như ở "Chạy thử từng bước").</p><ol>
<li>Lưu <code>app.py</code> có hai hàm, một hàm làm <code>sum(i*0.1 for i in range(20000))</code> trong vòng lặp, một hàm làm <code>sum(range(2000))</code>; chạy nó dưới <code>perf record -F 999 -g -- python3 -X perf app.py</code> (cài <code>linux-tools-generic</code> và gọi <code>/usr/lib/linux-tools/*/perf</code> nếu <code>perf</code> phàn nàn về phiên bản nhân).</li>
<li>Đọc <code>perf report --stdio --children --sort sym | grep py::</code> và gọi tên hàm cần tối ưu, kèm phần trăm.</li>
<li>Trong lúc script chạy lại, chụp <code>mpstat -P ALL 2 1</code> và <code>pidstat -u 2 1</code>: lõi nào, PID nào.</li>
<li>Tạo bão hoà CPU bằng <code>stress-ng</code> tối đa 12 giây và ghi lại <code>r</code> của <code>vmstat</code> cùng <code>some avg10</code> của PSI.</li>
<li>Viết một kết luận USE bốn dòng: CPU (U/S/E), bộ nhớ, đĩa, mạng — mỗi dòng kèm đúng một con số đã quyết định nó.</li></ol>
<p><strong>Đạt khi:</strong> bản đo gọi tên một hàm trên 80%; bạn tìm được một lõi ở ~100% trong khi <code>all</code> thấp; lúc chạy stress <code>r</code> vượt <code>nproc</code> và <code>avg10</code> lớn hơn 0; và kết luận của bạn dẫn một con số cho từng dòng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Utilization (mức dùng)</span><span class="v">Tỉ lệ thời gian một tài nguyên bận.</span></div>
  <div class="kv"><span class="k">Saturation (mức bão hoà)</span><span class="v">Việc phải xếp hàng vì tài nguyên không nhận kịp — đo bằng độ dài hàng chờ hay thời gian chờ.</span></div>
  <div class="kv"><span class="k">Run queue — r (hàng chờ chạy)</span><span class="v">Tác vụ đang chạy hoặc sẵn sàng chạy; vượt số lõi nghĩa là có tác vụ đang phải chờ.</span></div>
  <div class="kv"><span class="k">PSI — pressure stall information (thông tin nghẽn)</span><span class="v">Phần trăm thời gian tác vụ bị treo chờ CPU, bộ nhớ hoặc I/O (<code>/proc/pressure</code>).</span></div>
  <div class="kv"><span class="k">Steal time (thời gian bị lấy)</span><span class="v">Thời gian CPU mà trình ảo hoá đưa cho máy ảo khác trong lúc máy bạn đang cần.</span></div>
  <div class="kv"><span class="k">Profiler / sampling (bộ đo / lấy mẫu)</span><span class="v">Công cụ ghi ngăn xếp lời gọi nhiều lần mỗi giây để thấy thời gian nằm ở đâu.</span></div>
  <div class="kv"><span class="k">Flame graph (biểu đồ ngọn lửa)</span><span class="v">Hình của các ngăn xếp đã lấy mẫu: bề rộng = tỉ lệ mẫu, không phải thứ tự thời gian.</span></div>
  <div class="kv"><span class="k">await / aqu-sz (thời gian chờ / độ dài hàng)</span><span class="v">Thời gian trung bình một yêu cầu đĩa kể cả xếp hàng / độ dài hàng chờ trung bình.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>USE: với mọi tài nguyên kiểm mức dùng, bão hoà và lỗi — hết cả bảng rồi mới đào vào một ô.</li>
<li><code>mpstat -P ALL</code> tìm ra lõi kịch trần mà trung bình <code>all</code> giấu đi; <code>pidstat</code> gọi tên tiến trình.</li>
<li>Bão hoà là một hàng chờ: <code>r</code> của <code>vmstat</code> vượt số lõi, <code>avg10</code> của PSI lớn hơn 0; load average phản ứng quá chậm với tải đột ngột.</li>
<li><code>perf record -g</code> + <code>perf report</code> (và flame graph) gọi tên hàm; Python cần <code>-X perf</code>, file thực thi bị lược ký hiệu chỉ hiện địa chỉ.</li>
<li>Với đĩa đọc <code>await</code> và <code>aqu-sz</code>; <code>%util</code> nói quá trên SSD, còn p99 của fio là thứ người dùng cảm nhận.</li>
<li>Với mạng tin kB/s, gói rớt và gói gửi lại hơn <code>%ifutil</code>; trên Ubuntu 24.04 <code>sar</code> giữ lịch sử mười phút một lần sẵn rồi.</li>
</ul>

<a class="link-card" href="https://www.brendangregg.com/usemethod.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">The USE Method — Brendan Gregg</span><span class="lc-sub">Trang gốc: định nghĩa, danh sách tài nguyên, và vì sao mức dùng trung bình thấp không loại trừ bão hoà.</span></span>
</a>
<a class="link-card" href="https://www.brendangregg.com/USEmethod/use-linux.html" target="_blank" rel="noopener">
  <span class="lc-ico">🗒️</span>
  <span class="lc-body"><span class="lc-title">USE Method: Linux Performance Checklist</span><span class="lc-sub">Mọi ô của bảng điền sẵn bằng lệnh Linux — trang nên mở sẵn khi có sự cố.</span></span>
</a>
<a class="link-card" href="https://www.brendangregg.com/flamegraphs.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔥</span>
  <span class="lc-body"><span class="lc-title">Flame Graphs</span><span class="lc-sub">Cách đọc, cách tạo, và vì sao trục ngang không phải thời gian.</span></span>
</a>
<a class="link-card" href="https://perfwiki.github.io/main/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">perf wiki</span><span class="lc-sub">Hướng dẫn chính thức cho <code>perf stat</code>, <code>record</code>, <code>report</code> và <code>top</code>.</span></span>
</a>
<a class="link-card" href="https://docs.python.org/3/howto/perf_profiling.html" target="_blank" rel="noopener">
  <span class="lc-ico">🐍</span>
  <span class="lc-body"><span class="lc-title">Python support for the Linux perf profiler</span><span class="lc-sub"><code>-X perf</code> làm gì và tên hàm Python lọt vào <code>perf report</code> bằng cách nào.</span></span>
</a>
<a class="link-card" href="https://www.kernel.org/doc/html/latest/accounting/psi.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">PSI — Pressure Stall Information</span><span class="lc-sub">Tài liệu của nhân về <code>/proc/pressure</code>: <code>some</code> và <code>full</code> nghĩa là gì.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>Đo trên máy dùng chung là đo luôn cả hàng xóm.</strong> Mốc nền <code>mpstat</code> trên máy thử đã cho thấy một lõi ở 72% trước khi thí nghiệm nào bắt đầu — các container khác đang chạy trên cùng máy ảo. Luôn lấy mốc nền khi chưa có gì của bạn chạy, giữ phép thử tải thật ngắn, và đừng bao giờ chạy <code>stress-ng</code> hay <code>fio</code> trên máy chủ production: "thí nghiệm" sẽ trở thành sự cố.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Số trung bình giấu vấn đề: hãy nhìn theo từng lõi, từng giây, từng phân vị. Bão hoà (một hàng chờ, một lần treo) quan trọng hơn mức dùng (một con số phần trăm). Và dừng ở tầng trả lời được câu hỏi — thường <code>pidstat</code> là đủ; chỉ với tới <code>perf</code> khi bạn phải chọn viết lại hàm nào.</p>
</div>
`,
    },
    /* ─────────────────────────── 14.3 ─────────────────────────── */
    {
      title: '14.3 — Disks and filesystems: partitions, fstab, LVM, swap and checksums|||14.3 — Đĩa và hệ thống file: phân vùng, fstab, LVM, swap và checksum',
      slug: 'lnx-14-3-luu-tru',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Năm tầng từ đĩa tới thư mục, dựng thật trên một file loop: phân vùng GPT bằng parted, mkfs.ext4 và XFS, blkid và UUID, /etc/fstab với nofail và findmnt --verify, LVM nới ổ đĩa khi ứng dụng vẫn đang ghi, swap file, và kiểm tính toàn vẹn bằng sha256sum, b3sum và rsync -c.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.3</span>
<h2>Disks and filesystems</h2>
<p class="lead">Lesson 10.1 taught you to find what fills a disk. This lesson is about the disk itself: how a raw device becomes the directory <code>/srv/db</code>, how to add one so that it survives a reboot without being able to <em>prevent</em> the reboot, and how to grow it while the database is still writing. The obvious problem with practising this is that the commands destroy data. So every experiment here runs on a <strong>file</strong> pretending to be a disk — a loop device — inside a throwaway privileged container. Nothing on your real machine can be touched.</p>

<h3>Five layers from a disk to a directory</h3>
${slide('lx-14', 16, 'Năm tầng lưu trữ')}
<p>Between the hardware and the path you <code>cd</code> into there are up to five layers, and most storage confusion is two of them being mixed up:</p>
<ol>
<li><strong>Disk and partitions</strong> — a device (<code>/dev/sda</code>, <code>/dev/nvme0n1</code>, <code>/dev/vda</code> on a VPS) divided by a partition table into <code>sda1</code>, <code>nvme0n1p1</code>…</li>
<li><strong>LVM</strong> (optional) — pools partitions or whole disks and hands out flexible "logical volumes".</li>
<li><strong>Filesystem</strong> — ext4, XFS, btrfs: the structure that turns blocks into files, directories and inodes.</li>
<li><strong>Mount</strong> — attaching that filesystem at a directory, now or at every boot via <code>/etc/fstab</code>.</li>
<li><strong>The directory you see</strong> — which is only a window onto layer 3.</li>
</ol>
<p><code>lsblk -f</code> shows layers 1–4 at once. On the Fedora machine used for this course:</p>
<pre><code>lsblk -f</code></pre>
<div class="out">NAME        FSTYPE FSVER LABEL  UUID                                 FSAVAIL FSUSE% MOUNTPOINTS
sda
|-sda1      vfat   FAT32        4A22-94E0                             578.8M     3% /boot/efi
|-sda2      ext4   1.0          47e89fa2-98ff-48b5-a59a-c59507667285    1.2G    33% /boot
&#96;-sda3      btrfs        backup 88f2f4b2-c815-454a-89ca-a73980d20cce  235.9G    50% /mnt/backup
zram0       swap   1     zram0  8ce85e9f-6e56-43d8-91d9-ab281e5097ce                [SWAP]
nvme0n1
&#96;-nvme0n1p1 btrfs        fedora 1a1af067-0972-4e89-b962-83b397aec5d7  195.1G    56% /home
                                                                                    /</div>
<p>Read it as a tree: disk <code>sda</code> has three partitions — a small FAT32 one for the UEFI bootloader, an ext4 <code>/boot</code>, and a btrfs backup volume; the NVMe disk has one btrfs partition that is mounted twice, at <code>/</code> and <code>/home</code> (two btrfs subvolumes — Fedora's default layout). <code>zram0</code> is swap in compressed RAM, not on a disk at all. The <code>UUID</code> column is what <code>/etc/fstab</code> should refer to, as you will see.</p>

<h3>A disk made of a file: truncate, losetup, parted</h3>
${slide('lx-14', 17, 'Chia đĩa trên file loop')}
<p>A <strong>loop device</strong> makes a regular file behave like a block device. Everything below ran in <code>docker run -it --privileged --name lx14-sd ubuntu:24.04</code> (packages <code>parted lvm2 xfsprogs</code>) — <code>--privileged</code> is needed to create block devices, which is why the container is deleted straight afterwards.</p>
<pre><code>mkdir -p /srv/lab &amp;&amp; cd /srv/lab
truncate -s 1G dia1.img &amp;&amp; ls -lhs dia1.img
L=$(losetup -fP --show dia1.img); echo "$L"
parted -s "$L" mklabel gpt \\
  mkpart du-lieu ext4 1MiB 301MiB \\
  mkpart lvm 301MiB 100% set 2 lvm on
parted -s "$L" print</code></pre>
<div class="out">0 -rw-r--r-- 1 root root 1.0G Sep 28 16:20 dia1.img
/dev/loop0
Model: Loopback device (loopback)
Disk /dev/loop0: 1074MB
Sector size (logical/physical): 512B/512B
Partition Table: gpt

Number  Start   End     Size   File system  Name     Flags
 1      1049kB  316MB   315MB               du-lieu
 2      316MB   1073MB  757MB               lvm      lvm</div>
<p>The first column of <code>ls -lhs</code> is the space really used: <strong>0</strong> for a "1.0G" file. <code>truncate</code> makes a <em>sparse</em> file — the size is a promise and blocks are allocated only when written — so practising with a 1 GB disk costs nothing. <code>losetup -f</code> picks the first free loop device, <code>-P</code> asks the kernel to scan for partitions, <code>--show</code> prints the name. Then <code>parted</code> writes a <strong>GPT</strong> partition table (the modern format: up to 128 partitions, disks beyond 2 TiB, a backup copy at the end of the disk; the old <strong>MBR</strong> stops at 2 TiB and 4 primary partitions). Starting the first partition at <code>1MiB</code> keeps it aligned to the physical blocks of any SSD. <code>fdisk</code> does the same job interactively; <code>parted -s</code> is scriptable.</p>
<p>Two container quirks you will not see on a real server, reported honestly: <code>parted</code> printed <code>udevadm: not found</code> several times, and the partition nodes <code>/dev/loop0p1</code>/<code>p2</code> did not appear, because no udev runs inside a container. The kernel had created the partitions (they were in <code>/proc/partitions</code> as <code>259:0</code> and <code>259:1</code>), so <code>mknod /dev/loop0p1 b 259 0</code> made them usable. For the same reason <code>lsblk -f</code> shows empty columns in a container — it reads udev's database — while <code>blkid</code> reads the disk directly.</p>

<h3>A filesystem, its UUID, and the inode count you choose now</h3>
<pre><code>mkfs.ext4 -q -L du-lieu /dev/loop0p1
blkid /dev/loop0p1
mkdir -p /mnt/du-lieu &amp;&amp; mount /dev/loop0p1 /mnt/du-lieu
df -hT /mnt/du-lieu; df -i /mnt/du-lieu</code></pre>
<div class="out">/dev/loop0p1: LABEL="du-lieu" UUID="a48bb7be-b8c1-4bd7-b05f-86148d1b37f8" BLOCK_SIZE="4096" TYPE="ext4" PARTLABEL="du-lieu" PARTUUID="20860cca-cd95-4f8b-8ad0-d53c014881de"
Filesystem     Type  Size  Used Avail Use% Mounted on
/dev/loop0p1   ext4  265M   24K  244M   1% /mnt/du-lieu
Filesystem     Inodes IUsed IFree IUse% Mounted on
/dev/loop0p1    76800    11 76789    1% /mnt/du-lieu</div>
<p>Two identifiers came out. The filesystem <code>UUID</code> is created by <code>mkfs</code> and changes only if you reformat; the <code>PARTUUID</code> belongs to the GPT partition entry. Device names (<code>/dev/sdb1</code>) are neither: they are handed out in the order disks are discovered, and adding a disk can shuffle them. The 300 MiB partition shows a <code>Size</code> of 265M because ext4's journal and metadata come off the top, and only 244M <code>Avail</code> because of the 5% root reserve of Lesson 10.1. And the <code>df -i</code> line is the one Lesson 10.1 warned about: ext4 fixes the number of inodes (76,800 here, one per 4 KiB) at <code>mkfs</code> time. For a volume that will hold millions of tiny files (a cache, a mail spool), choose more now — <code>mkfs.ext4 -i 4096</code> (one inode per 4 KiB of space) or <code>-N 500000</code> — because you cannot add them later.</p>
<table>
<tr><th>Command</th><th>Flag</th><th>Meaning</th></tr>
<tr><td><code>losetup</code></td><td><code>-f --show</code> · <code>-P</code> · <code>-d DEV</code> · <code>-a</code></td><td>first free device, print it · scan partitions · detach · list all</td></tr>
<tr><td><code>parted -s</code></td><td><code>mklabel gpt</code> · <code>mkpart NAME FS START END</code> · <code>set N lvm on</code> · <code>print</code></td><td>new table · new partition · flag · show</td></tr>
<tr><td><code>mkfs.ext4</code></td><td><code>-L</code> · <code>-i BYTES</code> · <code>-N COUNT</code> · <code>-m PCT</code> · <code>-q</code></td><td>label · bytes per inode · inode count · root reserve % · quiet</td></tr>
<tr><td><code>blkid</code> · <code>lsblk</code></td><td><code>-s UUID -o value</code> · <code>-f</code> · <code>-o NAME,SIZE,…</code></td><td>just the UUID (for scripts) · filesystems · chosen columns</td></tr>
<tr><td><code>findmnt</code></td><td><code>TARGET</code> · <code>--real</code> · <code>--verify</code></td><td>what is mounted there · real filesystems only · check fstab</td></tr>
</table>

<h3>/etc/fstab: mount by UUID, and never let a disk stop the boot</h3>
${slide('lx-14', 18, 'fstab: UUID và nofail')}
<p>A mount made by hand disappears at reboot. <code>/etc/fstab</code> lists what to mount at boot, one line per filesystem, six fields: <em>device · mount point · type · options · dump · fsck order</em>. Refer to the device by <code>UUID=</code>, and read the real lines on the Fedora machine carefully:</p>
<div class="out">UUID=47e89fa2-98ff-48b5-a59a-c59507667285 /boot ext4 defaults 1 2
UUID=88f2f4b2-c815-454a-89ca-a73980d20cce /mnt/backup btrfs defaults,noatime,compress=zstd:1,nofail,x-systemd.device-timeout=10 0 0</div>
<p>The backup disk's options are the lesson. <code>nofail</code>: if this disk is missing, boot anyway. <code>x-systemd.device-timeout=10</code>: wait at most 10 seconds for it instead of the default 90. Without those, a backup disk that dies or is unplugged sends the machine into emergency mode at boot — on a VPS, before SSH starts, so you are locked out until you find the provider's web console. Add a line, then <strong>check before you reboot</strong>:</p>
<pre><code>U=$(blkid -s UUID -o value /dev/loop0p1)
echo "UUID=$U /mnt/du-lieu ext4 defaults,nofail 0 2" &gt;&gt; /etc/fstab
findmnt --verify --tab-file /etc/fstab
mount -a &amp;&amp; findmnt /mnt/du-lieu
<span class="tok-comment"># the same check on a broken file:</span>
echo "UUID=sai-mot-chu /mnt/x ext4 defaults 0 2" &gt; /tmp/fstab.sai
findmnt --verify --tab-file /tmp/fstab.sai</code></pre>
<div class="out">0 parse errors, 0 errors, 1 warning
   [W] your fstab has been modified, but systemd still uses the old version;
       use 'systemctl daemon-reload' to reload
TARGET       SOURCE       FSTYPE OPTIONS
/mnt/du-lieu /dev/loop0p1 ext4   rw,relatime
/mnt/x
   [E] unreachable on boot required target: No such file or directory
   [E] unreachable on boot required source: UUID=sai-mot-chu
0 parse errors, 2 errors, 1 warning</div>
<p><code>findmnt --verify</code> caught both problems a reboot would have found the hard way: the mount point does not exist, and no disk has that UUID. Its warning is worth obeying too: systemd turns fstab into <code>.mount</code> units, so after editing fstab run <code>systemctl daemon-reload</code>. <code>mount -a</code> mounts everything in fstab that is not yet mounted — a good last test, because a typo fails here, not at 4am. The last two fields: <em>dump</em> is always <code>0</code> on modern systems; <em>fsck order</em> is <code>1</code> for <code>/</code>, <code>2</code> for other ext4 filesystems, <code>0</code> for XFS and btrfs (they have their own repair tools) and for anything you do not want checked.</p>

<h3>LVM: grow a volume while the application is writing</h3>
${slide('lx-14', 19, 'LVM: nới khi đang chạy')}
<p>A partition has a fixed size and position; enlarging it usually means unmounting, and often means the partition after it must move. <strong>LVM</strong> (Logical Volume Manager) inserts a layer that removes that problem. Disks or partitions become <strong>PVs</strong> (physical volumes); PVs are pooled into a <strong>VG</strong> (volume group) cut into 4 MiB <em>extents</em>; from the pool you create <strong>LVs</strong> (logical volumes) that behave like partitions but can grow, span several disks, and be snapshotted. Many VPS images and every RHEL/Fedora Server install use it.</p>
<pre><code>pvcreate /dev/loop0p2
vgcreate vg_app /dev/loop0p2
lvcreate -n lv_db -L 400M vg_app
pvs; vgs; lvs</code></pre>
<div class="out">  Physical volume "/dev/loop0p2" successfully created.
  Volume group "vg_app" successfully created
  Logical volume "lv_db" created.
  PV           VG     Fmt  Attr PSize   PFree
  /dev/loop0p2 vg_app lvm2 a--  720.00m 320.00m
  VG     #PV #LV #SN Attr   VSize   VFree
  vg_app   1   1   0 wz--n- 720.00m 320.00m
  LV    VG     Attr       LSize   Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  lv_db vg_app -wi-a----- 400.00m</div>
<p>The LV appears as <code>/dev/vg_app/lv_db</code> (a link to <code>/dev/mapper/vg_app-lv_db</code>). Put ext4 on it, mount it at <code>/srv/db</code>, fill it to 100% — the situation of a database that has just run out of room — and grow it without stopping anything:</p>
<pre><code>mkfs.ext4 -q /dev/vg_app/lv_db &amp;&amp; mkdir -p /srv/db &amp;&amp; mount /dev/vg_app/lv_db /srv/db
fallocate -l 330M /srv/db/data.bin; df -h /srv/db | tail -1
lvextend -r -L +250M vg_app/lv_db
df -h /srv/db | tail -1</code></pre>
<div class="out">/dev/mapper/vg_app-lv_db  359M  331M  352K 100% /srv/db
  Rounding size to boundary between physical extents: 252.00 MiB.
  Size of logical volume vg_app/lv_db changed from 400.00 MiB (100 extents) to 652.00 MiB (163 extents).
  Logical volume vg_app/lv_db successfully resized.
resize2fs 1.47.0 (5-Feb-2023)
Filesystem at /dev/mapper/vg_app-lv_db is mounted on /srv/db; on-line resizing required
The filesystem on /dev/mapper/vg_app-lv_db is now 166912 (4k) blocks long.
/dev/mapper/vg_app-lv_db  598M  331M  236M  59% /srv/db</div>
<p><code>-r</code> is the important flag: it resizes the <em>filesystem</em> too (it called <code>resize2fs</code> for us, "on-line", while mounted). Without <code>-r</code> the LV grows and <code>df</code> still says 100%, because the filesystem inside does not know — the most common "I extended it and nothing changed" mistake. When the pool itself is empty, add a disk to it (on a VPS: attach a new volume in the provider's panel; it appears as <code>/dev/vdb</code>):</p>
<pre><code>truncate -s 512M dia2.img; L2=$(losetup -f --show dia2.img)
pvcreate "$L2"; vgextend vg_app "$L2"
lvextend -r -l +100%FREE vg_app/lv_db
df -h /srv/db | tail -1
lsblk /dev/loop0 /dev/loop1</code></pre>
<div class="out">  Physical volume "/dev/loop1" successfully created.
  Volume group "vg_app" successfully extended
/dev/mapper/vg_app-lv_db  1.2G  331M  773M  30% /srv/db
NAME             MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
loop0              7:0    0    1G  0 loop
|-loop0p1        259:0    0  300M  0 part /mnt/du-lieu
&#96;-loop0p2        259:1    0  722M  0 part
  &#96;-vg_app-lv_db 253:0    0  1.2G  0 lvm  /srv/db
loop1              7:1    0  512M  0 loop
&#96;-vg_app-lv_db   253:0    0  1.2G  0 lvm  /srv/db</div>
<p><code>lsblk</code> now draws one LV standing on two disks. <code>-l +100%FREE</code> counts in extents: "all the free space in the group". In a container, LVM also needed <code>udev_sync = 0</code> and <code>udev_rules = 0</code> in <code>/etc/lvm/lvm.conf</code> (again, no udev); on a real server leave them alone.</p>
<table>
<tr><th>Command</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>pvcreate</code> · <code>pvs</code></td><td>Make a disk/partition a PV · list PVs</td><td><code>pvcreate /dev/vdb</code></td></tr>
<tr><td><code>vgcreate</code> · <code>vgextend</code> · <code>vgs</code></td><td>New group · add a PV · list</td><td><code>vgextend vg_app /dev/vdb</code></td></tr>
<tr><td><code>lvcreate -n NAME -L SIZE</code></td><td>New LV of a fixed size (<code>-l 100%FREE</code> = all remaining)</td><td><code>lvcreate -n lv_db -L 20G vg_app</code></td></tr>
<tr><td><code>lvextend -r</code></td><td>Grow LV <em>and</em> filesystem, online</td><td><code>lvextend -r -L +10G vg_app/lv_db</code></td></tr>
<tr><td><code>lvreduce -r</code></td><td>Shrink (ext4 only, unmounts first; never XFS)</td><td>take a backup first</td></tr>
<tr><td><code>lvs -o +devices</code></td><td>Which disks each LV lives on</td><td><code>lvs -o lv_name,lv_size,devices</code></td></tr>
</table>

<h3>ext4 or XFS — and a swap file</h3>
${slide('lx-14', 20, 'ext4 hay XFS, swap file')}
<p>Ubuntu and Debian default to <strong>ext4</strong>; RHEL, Rocky and Fedora Server default to <strong>XFS</strong>; Fedora Workstation (the <code>lsblk</code> above) uses <strong>btrfs</strong>. All three grow online. The difference that bites: <strong>XFS cannot be shrunk, ever</strong>:</p>
<pre><code>mkfs.xfs -q /dev/vg_x/lv_x; mount /dev/vg_x/lv_x /mnt/x
lvreduce -r -y -L 200M vg_x/lv_x</code></pre>
<div class="out">fsadm: Xfs filesystem shrinking is unsupported.
  /usr/sbin/fsadm failed: 1
  Filesystem resize failed.</div>
<p>So on XFS, give a volume the size it needs and grow it later; never over-allocate "to be safe" expecting to take space back. ext4 can shrink, but only unmounted. XFS allocates inodes dynamically, so it does not suffer the "inodes full, space free" problem of Lesson 10.1.</p>
<p>Lesson 11.3 explained <em>why</em> a small VPS wants swap. Here is how, on a filesystem you control (a swap file must be fully allocated, so use <code>fallocate</code> or <code>dd</code>, never <code>truncate</code>):</p>
<pre><code>fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile &amp;&amp; swapon --show
echo '/swapfile none swap sw 0 0' &gt;&gt; /etc/fstab</code></pre>
<div class="out">Setting up swapspace version 1, size = 128 MiB (134213632 bytes)
no label, UUID=dadf7b16-ce42-4357-ab71-53d02aa59cab
NAME             TYPE  SIZE   USED PRIO
/var/lib/swap    file 1024M 441.8M   -1
/srv/db/swapfile file  128M     0B   -1</div>
<p>(Measured with a 128 MB file on the practice volume and removed with <code>swapoff</code> straight after — the <code>/var/lib/swap</code> line is Docker Desktop's own swap, visible because swap is a kernel-wide setting, like the <code>sysctl</code> values of Lesson 14.1.)</p>

<h3>Checksums: proving two files are the same</h3>
${slide('lx-14', 21, 'Checksum và rsync -c')}
<p>Lesson 10.2 used <code>sha256sum</code> to check a download. The same tool proves a backup or a copy is intact — and it fails loudly on a single changed byte:</p>
<pre><code>head -c 300M /dev/urandom &gt; goi.tar
sha256sum goi.tar &gt; goi.tar.sha256
sha256sum -c goi.tar.sha256
printf "\\x00" | dd of=goi.tar bs=1 seek=1000 conv=notrunc status=none
sha256sum -c goi.tar.sha256; echo "rc=$?"</code></pre>
<div class="out">goi.tar: OK
goi.tar: FAILED
sha256sum: WARNING: 1 computed checksum did NOT match
rc=1</div>
<p>Because <code>-c</code> exits 1 on a mismatch, it belongs directly in a backup script: <code>sha256sum -c backup.sha256 || { echo "backup corrupt" &gt;&amp;2; exit 1; }</code>. <strong>BLAKE3</strong> (<code>b3sum</code>, package <code>b3sum</code>) is a newer hash designed to run on many cores. On the same 300 MB: <code>sha256sum</code> 0.158 s, <code>b3sum</code> 0.060 s, but <code>b3sum --num-threads 1</code> 0.295 s — on this ARM machine the CPU has SHA-256 instructions, so single-threaded SHA-256 wins and BLAKE3 wins only by using several cores. Measure on your own hardware before choosing.</p>
<p>The subtler trap is in <code>rsync</code> (Lesson 9.4). By default it decides a file is unchanged when <strong>size and modification time</strong> match — the "quick check" — without reading the contents. Make the two coincide and it silently skips a changed file:</p>
<pre><code>mkdir nguon dich; echo "PORT=3000" &gt; nguon/app.env; rsync -a nguon/ dich/
echo "PORT=4000" &gt; nguon/app.env; touch -r dich/app.env nguon/app.env   <span class="tok-comment"># same size, same mtime</span>
rsync -av nguon/ dich/ | sed -n 2p; cat dich/app.env
rsync -avc nguon/ dich/ | sed -n 2p; cat dich/app.env</code></pre>
<div class="out">
PORT=3000
app.env
PORT=4000</div>
<p>The first run transferred nothing (line 2 is empty) and the old <code>PORT=3000</code> stayed. <code>-c</code> (<code>--checksum</code>) hashes every file on both sides and caught it. It is slower — every byte is read — so use it for verification runs and for small configuration trees, not for every hourly sync of a large data directory.</p>

<h3>Try it step by step: the whole chain, then clean up</h3>
<ol>
<li><code>docker run -it --privileged --name lab-disk ubuntu:24.04 bash</code>, then <code>apt-get update &amp;&amp; apt-get install -y parted lvm2 xfsprogs</code>; set <code>udev_sync = 0</code> and <code>udev_rules = 0</code> in <code>/etc/lvm/lvm.conf</code>.</li>
<li><code>truncate -s 1G d.img; L=$(losetup -fP --show d.img)</code>; one GPT partition with <code>set 1 lvm on</code>; <code>mknod</code> the partition node from <code>/proc/partitions</code> if it is missing.</li>
<li><code>pvcreate</code> → <code>vgcreate vg_lab</code> → <code>lvcreate -n data -L 300M vg_lab</code> → <code>mkfs.ext4</code> → <code>mount</code> at <code>/srv/data</code>.</li>
<li>Add it to fstab by UUID with <code>nofail</code>; <code>findmnt --verify</code>; <code>umount /srv/data &amp;&amp; mount -a</code>.</li>
<li><code>lvextend -r -L +100M vg_lab/data</code> while <code>dd if=/dev/zero of=/srv/data/x bs=1M count=200</code> runs in another shell; compare <code>df -h</code> before and after.</li>
<li>Clean up in reverse order: <code>umount /srv/data; vgremove -y vg_lab; pvremove "\${L}p1"; losetup -d "$L"</code>, then <code>exit</code> and <code>docker rm lab-disk</code>. Always detach loop devices one by one with <code>-d</code>; <code>losetup -D</code> detaches every loop device on the machine, including ones other software (snaps on Ubuntu, Docker's VM) may be using.</li>
</ol>

<h3>How macOS and WSL differ</h3>
<table>
<tr><th>Job</th><th>Linux</th><th>macOS 27 (measured)</th><th>WSL2</th></tr>
<tr><td>List disks</td><td><code>lsblk -f</code>, <code>blkid</code></td><td><code>diskutil list</code> — APFS <em>containers</em> holding <em>volumes</em>, a concept close to LVM's VG and LV</td><td><code>lsblk</code> shows virtual <code>sdX</code> disks; Windows drives appear under <code>/mnt/c</code></td></tr>
<tr><td>Disk from a file</td><td><code>losetup</code></td><td><code>hdiutil create</code> / <code>hdiutil attach</code> (disk images)</td><td><code>losetup</code> works</td></tr>
<tr><td>Mount at boot</td><td><code>/etc/fstab</code></td><td>automatic for APFS; fstab is rarely used</td><td><code>/etc/fstab</code> inside the distro, plus <code>wsl --mount</code> from Windows for a physical disk</td></tr>
<tr><td>LVM, XFS, ext4</td><td>yes</td><td>no (APFS; <code>mkfs.ext4</code> does not exist)</td><td>yes</td></tr>
<tr><td>Checksums</td><td><code>sha256sum</code>, <code>b3sum</code></td><td><code>/sbin/sha256sum</code> exists and <code>-c</code> works; also <code>shasum -a 256</code>; no <code>b3sum</code></td><td>as Linux</td></tr>
</table>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the team's PostgreSQL volume on the VPS is 95% full two days before the defence, and the provider lets you attach a second disk. Rehearse the whole operation on files first, in a privileged throwaway container.</p><ol>
<li>Build <code>vg_pg</code> from a 600 MB file disk and a 300 MB LV <code>lv_pg</code> with ext4, mounted at <code>/var/lib/pg-lab</code> and listed in fstab by UUID with <code>nofail</code>. Prove the line with <code>findmnt --verify</code>.</li>
<li>Fill it to 100% with <code>fallocate</code>, then simulate "attach a disk": a second 400 MB file, <code>pvcreate</code>, <code>vgextend</code>.</li>
<li>Grow the LV by all free space in one command, while a loop appends a line to a file on it every 0.2 s.</li>
<li>Copy the data directory to <code>/root/copy</code> with <code>rsync -a</code>, change one byte in a copied file keeping size and mtime (<code>touch -r</code>), and show that <code>rsync -av</code> does not repair it but <code>rsync -avc</code> does; confirm with <code>sha256sum</code>.</li>
<li>Tear everything down and prove <code>losetup -a</code> is empty.</li></ol>
<p><strong>Done when:</strong> <code>df -h</code> shows the volume grew with no <code>umount</code>; the appended file kept growing during the resize; <code>findmnt --verify</code> reported 0 errors; the byte-flip was fixed only by <code>-c</code>; <code>losetup -a</code> prints nothing.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Block device</span><span class="v">A device read and written in blocks (disks, partitions, loop devices, LVs).</span></div>
  <div class="kv"><span class="k">Loop device</span><span class="v">A kernel device that makes a regular file behave like a disk.</span></div>
  <div class="kv"><span class="k">Sparse file</span><span class="v">A file whose size is larger than the blocks it really occupies until written.</span></div>
  <div class="kv"><span class="k">GPT / MBR</span><span class="v">The modern and the legacy partition-table formats.</span></div>
  <div class="kv"><span class="k">UUID</span><span class="v">A unique ID written into a filesystem at <code>mkfs</code>, stable across device renames.</span></div>
  <div class="kv"><span class="k">PV / VG / LV</span><span class="v">LVM's physical volume, volume group (the pool) and logical volume (the flexible "partition").</span></div>
  <div class="kv"><span class="k">Extent</span><span class="v">The fixed-size unit (4 MiB by default) LVM hands out from a VG.</span></div>
  <div class="kv"><span class="k">Checksum / hash</span><span class="v">A short fingerprint of a file's contents; one changed byte changes it completely.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Disk → partition → (LVM) → filesystem → mount → directory; <code>lsblk -f</code> shows the tree, <code>blkid</code> the UUIDs.</li>
<li>Practise on a sparse file with <code>losetup</code> in a throwaway container; <code>parted -s</code> writes GPT partitions from a script.</li>
<li>fstab: always <code>UUID=</code>, add <code>nofail</code> to any non-essential disk, and run <code>findmnt --verify</code> and <code>mount -a</code> before a reboot.</li>
<li>LVM pools disks; <code>vgextend</code> adds a disk, <code>lvextend -r</code> grows volume and filesystem together while mounted.</li>
<li>XFS never shrinks, ext4 fixes its inode count at <code>mkfs</code>; a swap file is <code>fallocate</code> + <code>chmod 600</code> + <code>mkswap</code> + <code>swapon</code> + fstab.</li>
<li><code>sha256sum -c</code> fails loudly on one changed byte; <code>rsync</code> without <code>-c</code> trusts size and mtime.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man8/lvm.8.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">lvm(8)</span><span class="lc-sub">The map of every LVM command, from <code>pvcreate</code> to snapshots.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man8/lvextend.8.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">lvextend(8)</span><span class="lc-sub"><code>-r</code>/<code>--resizefs</code>, sizes in extents and percentages (<code>+100%FREE</code>).</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man5/fstab.5.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">fstab(5)</span><span class="lc-sub">The six fields, <code>UUID=</code>/<code>LABEL=</code>, and options such as <code>nofail</code>.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man8/losetup.8.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">losetup(8)</span><span class="lc-sub">Loop devices: <code>-f</code>, <code>-P</code>, <code>-d</code>, and why <code>-D</code> is broader than you think.</span></span>
</a>
<a class="link-card" href="https://github.com/BLAKE3-team/BLAKE3" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">BLAKE3</span><span class="lc-sub">The hash behind <code>b3sum</code>: design, benchmarks and the multi-threaded mode.</span></span>
</a>
<a class="link-card codelab" href="/courses/deploy-vps" target="_blank" rel="noopener">
  <span class="lc-ico">🖥️</span>
  <span class="lc-body"><span class="lc-title">Deploy to a VPS — full course on this site</span><span class="lc-sub">Where these disks live in practice: attaching volumes, backups and restores on a real server.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>Growing the LV is not growing the filesystem.</strong> <code>lvextend -L +10G vg/lv</code> without <code>-r</code> succeeds, and <code>df</code> still shows the old size and 100% — the extra space sits in the volume, invisible to ext4. Either always pass <code>-r</code>, or follow up with <code>resize2fs /dev/vg/lv</code> (ext4) or <code>xfs_growfs /mount/point</code> (XFS — note it takes the mount point, not the device).</div>
<p class="note-ct"><strong>Three things to remember.</strong> Rehearse destructive disk work on a loop file first — it costs nothing and is identical to the real thing. Mount by UUID with <code>nofail</code>, and verify fstab before you reboot, not after. And "the copy finished" is not "the copy is correct": a checksum is the only proof.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.3</span>
<h2>Đĩa và hệ thống file</h2>
<p class="lead">Bài 10.1 dạy bạn tìm thứ gì làm đầy một cái đĩa. Bài này nói về chính cái đĩa: một thiết bị thô trở thành thư mục <code>/srv/db</code> như thế nào, thêm một đĩa sao cho nó sống qua lần khởi động lại mà không có khả năng <em>chặn</em> lần khởi động đó, và nới nó ra trong khi cơ sở dữ liệu vẫn đang ghi. Rắc rối hiển nhiên khi tập mấy việc này là các lệnh phá dữ liệu. Vì vậy mọi thí nghiệm ở đây chạy trên một <strong>file</strong> đóng vai cái đĩa — một loop device (thiết bị vòng) — bên trong một container đặc quyền dùng xong vứt. Không có gì trên máy thật của bạn bị đụng tới.</p>

<h3>Năm tầng từ cái đĩa tới cái thư mục</h3>
${slide('lx-14', 16, 'Năm tầng lưu trữ')}
<p>Giữa phần cứng và đường dẫn bạn <code>cd</code> vào có tới năm tầng, và phần lớn sự lẫn lộn về lưu trữ là do trộn hai tầng với nhau:</p>
<ol>
<li><strong>Đĩa và phân vùng</strong> — một thiết bị (<code>/dev/sda</code>, <code>/dev/nvme0n1</code>, trên VPS là <code>/dev/vda</code>) được bảng phân vùng chia thành <code>sda1</code>, <code>nvme0n1p1</code>…</li>
<li><strong>LVM</strong> (tuỳ chọn) — gom phân vùng hoặc cả đĩa thành bể chung rồi cấp ra các "ổ logic" linh hoạt.</li>
<li><strong>Hệ thống file</strong> — ext4, XFS, btrfs: cấu trúc biến các khối thành file, thư mục và inode.</li>
<li><strong>Gắn (mount)</strong> — gắn hệ thống file đó vào một thư mục, ngay bây giờ hoặc ở mọi lần khởi động qua <code>/etc/fstab</code>.</li>
<li><strong>Thư mục bạn thấy</strong> — chỉ là một khung cửa sổ nhìn vào tầng 3.</li>
</ol>
<p><code>lsblk -f</code> cho thấy tầng 1–4 cùng lúc. Trên máy Fedora dùng cho khoá này:</p>
<pre><code>lsblk -f</code></pre>
<div class="out">NAME        FSTYPE FSVER LABEL  UUID                                 FSAVAIL FSUSE% MOUNTPOINTS
sda
|-sda1      vfat   FAT32        4A22-94E0                             578.8M     3% /boot/efi
|-sda2      ext4   1.0          47e89fa2-98ff-48b5-a59a-c59507667285    1.2G    33% /boot
&#96;-sda3      btrfs        backup 88f2f4b2-c815-454a-89ca-a73980d20cce  235.9G    50% /mnt/backup
zram0       swap   1     zram0  8ce85e9f-6e56-43d8-91d9-ab281e5097ce                [SWAP]
nvme0n1
&#96;-nvme0n1p1 btrfs        fedora 1a1af067-0972-4e89-b962-83b397aec5d7  195.1G    56% /home
                                                                                    /</div>
<p>Đọc nó như một cái cây: đĩa <code>sda</code> có ba phân vùng — một phân vùng FAT32 nhỏ cho trình khởi động UEFI, một <code>/boot</code> ext4, và một ổ sao lưu btrfs; đĩa NVMe có một phân vùng btrfs được gắn hai lần, ở <code>/</code> và <code>/home</code> (hai subvolume của btrfs — bố cục mặc định của Fedora). <code>zram0</code> là swap nằm trong RAM nén, hoàn toàn không ở trên đĩa. Cột <code>UUID</code> là thứ <code>/etc/fstab</code> nên dùng để chỉ tới, như bạn sẽ thấy.</p>

<h3>Một cái đĩa làm từ file: truncate, losetup, parted</h3>
${slide('lx-14', 17, 'Chia đĩa trên file loop')}
<p><strong>Loop device</strong> biến một file thường thành thứ hành xử như một thiết bị khối. Mọi thứ dưới đây chạy trong <code>docker run -it --privileged --name lx14-sd ubuntu:24.04</code> (cài <code>parted lvm2 xfsprogs</code>) — cần <code>--privileged</code> để tạo thiết bị khối, và đó là lý do container bị xoá ngay sau khi xong.</p>
<pre><code>mkdir -p /srv/lab &amp;&amp; cd /srv/lab
truncate -s 1G dia1.img &amp;&amp; ls -lhs dia1.img
L=$(losetup -fP --show dia1.img); echo "$L"
parted -s "$L" mklabel gpt \\
  mkpart du-lieu ext4 1MiB 301MiB \\
  mkpart lvm 301MiB 100% set 2 lvm on
parted -s "$L" print</code></pre>
<div class="out">0 -rw-r--r-- 1 root root 1.0G Sep 28 16:20 dia1.img
/dev/loop0
Model: Loopback device (loopback)
Disk /dev/loop0: 1074MB
Sector size (logical/physical): 512B/512B
Partition Table: gpt

Number  Start   End     Size   File system  Name     Flags
 1      1049kB  316MB   315MB               du-lieu
 2      316MB   1073MB  757MB               lvm      lvm</div>
<p>Cột đầu tiên của <code>ls -lhs</code> là dung lượng thật sự bị chiếm: <strong>0</strong> cho một file "1.0G". <code>truncate</code> tạo một file <em>thưa</em> (sparse) — kích thước chỉ là lời hứa, khối chỉ được cấp khi có dữ liệu ghi vào — nên tập với cái đĩa 1 GB chẳng tốn gì. <code>losetup -f</code> chọn loop device trống đầu tiên, <code>-P</code> bảo nhân quét phân vùng, <code>--show</code> in ra cái tên. Rồi <code>parted</code> ghi một bảng phân vùng <strong>GPT</strong> (định dạng hiện đại: tới 128 phân vùng, đĩa lớn hơn 2 TiB, có bản sao dự phòng ở cuối đĩa; <strong>MBR</strong> cũ dừng ở 2 TiB và 4 phân vùng chính). Bắt đầu phân vùng đầu tiên ở <code>1MiB</code> giữ cho nó thẳng hàng với khối vật lý của mọi loại SSD. <code>fdisk</code> làm cùng việc theo kiểu hỏi–đáp; <code>parted -s</code> thì viết vào script được.</p>
<p>Hai điều kỳ quặc của container mà bạn sẽ không gặp trên máy chủ thật, nói thật cho đủ: <code>parted</code> in ra <code>udevadm: not found</code> vài lần, và các nút thiết bị <code>/dev/loop0p1</code>/<code>p2</code> không xuất hiện, vì trong container không có udev chạy. Nhân đã tạo phân vùng (chúng có trong <code>/proc/partitions</code> với số <code>259:0</code> và <code>259:1</code>), nên <code>mknod /dev/loop0p1 b 259 0</code> làm chúng dùng được. Cũng vì lý do đó mà <code>lsblk -f</code> hiện cột trống trong container — nó đọc cơ sở dữ liệu của udev — còn <code>blkid</code> thì đọc thẳng trên đĩa.</p>

<h3>Một hệ thống file, UUID của nó, và số inode bạn phải chọn ngay bây giờ</h3>
<pre><code>mkfs.ext4 -q -L du-lieu /dev/loop0p1
blkid /dev/loop0p1
mkdir -p /mnt/du-lieu &amp;&amp; mount /dev/loop0p1 /mnt/du-lieu
df -hT /mnt/du-lieu; df -i /mnt/du-lieu</code></pre>
<div class="out">/dev/loop0p1: LABEL="du-lieu" UUID="a48bb7be-b8c1-4bd7-b05f-86148d1b37f8" BLOCK_SIZE="4096" TYPE="ext4" PARTLABEL="du-lieu" PARTUUID="20860cca-cd95-4f8b-8ad0-d53c014881de"
Filesystem     Type  Size  Used Avail Use% Mounted on
/dev/loop0p1   ext4  265M   24K  244M   1% /mnt/du-lieu
Filesystem     Inodes IUsed IFree IUse% Mounted on
/dev/loop0p1    76800    11 76789    1% /mnt/du-lieu</div>
<p>Có hai mã định danh. <code>UUID</code> của hệ thống file do <code>mkfs</code> tạo ra và chỉ đổi khi bạn định dạng lại; <code>PARTUUID</code> thuộc về mục phân vùng trong GPT. Tên thiết bị (<code>/dev/sdb1</code>) không phải cả hai: chúng được phát theo thứ tự nhân phát hiện đĩa, và cắm thêm một đĩa có thể xáo trộn chúng. Phân vùng 300 MiB chỉ hiện <code>Size</code> 265M vì nhật ký (journal) và siêu dữ liệu của ext4 lấy mất phần đầu, và <code>Avail</code> chỉ còn 244M vì 5% dự trữ cho root của Bài 10.1. Còn dòng <code>df -i</code> chính là thứ Bài 10.1 đã cảnh báo: ext4 chốt số inode (ở đây 76.800, cứ 4 KiB một inode) ngay lúc <code>mkfs</code>. Với một ổ sẽ chứa hàng triệu file tí hon (bộ nhớ đệm, hàng đợi thư), hãy chọn nhiều hơn ngay từ bây giờ — <code>mkfs.ext4 -i 4096</code> (mỗi 4 KiB dung lượng một inode) hoặc <code>-N 500000</code> — vì sau này không thêm được.</p>
<table>
<tr><th>Lệnh</th><th>Cờ</th><th>Nghĩa</th></tr>
<tr><td><code>losetup</code></td><td><code>-f --show</code> · <code>-P</code> · <code>-d DEV</code> · <code>-a</code></td><td>thiết bị trống đầu tiên, in tên · quét phân vùng · tháo ra · liệt kê hết</td></tr>
<tr><td><code>parted -s</code></td><td><code>mklabel gpt</code> · <code>mkpart TÊN FS ĐẦU CUỐI</code> · <code>set N lvm on</code> · <code>print</code></td><td>bảng mới · phân vùng mới · bật cờ · xem</td></tr>
<tr><td><code>mkfs.ext4</code></td><td><code>-L</code> · <code>-i BYTE</code> · <code>-N SỐ</code> · <code>-m %</code> · <code>-q</code></td><td>nhãn · số byte cho mỗi inode · tổng số inode · % dự trữ cho root · im lặng</td></tr>
<tr><td><code>blkid</code> · <code>lsblk</code></td><td><code>-s UUID -o value</code> · <code>-f</code> · <code>-o NAME,SIZE,…</code></td><td>chỉ UUID (cho script) · hệ thống file · chọn cột</td></tr>
<tr><td><code>findmnt</code></td><td><code>ĐÍCH</code> · <code>--real</code> · <code>--verify</code></td><td>cái gì đang gắn ở đó · chỉ hệ thống file thật · kiểm fstab</td></tr>
</table>

<h3>/etc/fstab: gắn bằng UUID, và đừng bao giờ để một cái đĩa chặn việc khởi động</h3>
${slide('lx-14', 18, 'fstab: UUID và nofail')}
<p>Gắn bằng tay thì mất khi khởi động lại. <code>/etc/fstab</code> liệt kê những gì phải gắn lúc khởi động, mỗi hệ thống file một dòng, sáu trường: <em>thiết bị · điểm gắn · loại · tuỳ chọn · dump · thứ tự fsck</em>. Chỉ tới thiết bị bằng <code>UUID=</code>, và đọc kỹ các dòng thật trên máy Fedora:</p>
<div class="out">UUID=47e89fa2-98ff-48b5-a59a-c59507667285 /boot ext4 defaults 1 2
UUID=88f2f4b2-c815-454a-89ca-a73980d20cce /mnt/backup btrfs defaults,noatime,compress=zstd:1,nofail,x-systemd.device-timeout=10 0 0</div>
<p>Tuỳ chọn của ổ sao lưu chính là bài học. <code>nofail</code>: đĩa này mà thiếu thì vẫn cứ khởi động. <code>x-systemd.device-timeout=10</code>: chờ nó tối đa 10 giây thay vì 90 giây mặc định. Thiếu hai thứ đó, một ổ sao lưu hỏng hoặc bị rút ra sẽ đẩy máy vào chế độ khẩn cấp (emergency mode) lúc khởi động — trên VPS, trước cả khi SSH lên, nên bạn bị khoá ngoài cho tới khi tìm ra bảng điều khiển web của nhà cung cấp. Thêm một dòng, rồi <strong>kiểm trước khi khởi động lại</strong>:</p>
<pre><code>U=$(blkid -s UUID -o value /dev/loop0p1)
echo "UUID=$U /mnt/du-lieu ext4 defaults,nofail 0 2" &gt;&gt; /etc/fstab
findmnt --verify --tab-file /etc/fstab
mount -a &amp;&amp; findmnt /mnt/du-lieu
<span class="tok-comment"># cùng phép kiểm đó trên một file hỏng:</span>
echo "UUID=sai-mot-chu /mnt/x ext4 defaults 0 2" &gt; /tmp/fstab.sai
findmnt --verify --tab-file /tmp/fstab.sai</code></pre>
<div class="out">0 parse errors, 0 errors, 1 warning
   [W] your fstab has been modified, but systemd still uses the old version;
       use 'systemctl daemon-reload' to reload
TARGET       SOURCE       FSTYPE OPTIONS
/mnt/du-lieu /dev/loop0p1 ext4   rw,relatime
/mnt/x
   [E] unreachable on boot required target: No such file or directory
   [E] unreachable on boot required source: UUID=sai-mot-chu
0 parse errors, 2 errors, 1 warning</div>
<p><code>findmnt --verify</code> bắt được cả hai lỗi mà một lần khởi động lại sẽ tìm ra theo cách đau đớn: điểm gắn không tồn tại, và không đĩa nào có UUID đó. Lời cảnh báo của nó cũng đáng nghe theo: systemd dịch fstab thành các unit <code>.mount</code>, nên sau khi sửa fstab hãy chạy <code>systemctl daemon-reload</code>. <code>mount -a</code> gắn mọi thứ trong fstab chưa được gắn — một phép thử cuối rất tốt, vì gõ sai sẽ hỏng ở đây chứ không phải lúc 4 giờ sáng. Hai trường cuối: <em>dump</em> luôn là <code>0</code> trên hệ thống hiện đại; <em>thứ tự fsck</em> là <code>1</code> cho <code>/</code>, <code>2</code> cho các hệ thống file ext4 khác, <code>0</code> cho XFS và btrfs (chúng có công cụ sửa lỗi riêng) và cho thứ gì bạn không muốn bị kiểm.</p>

<h3>LVM: nới ổ đĩa trong khi ứng dụng vẫn đang ghi</h3>
${slide('lx-14', 19, 'LVM: nới khi đang chạy')}
<p>Một phân vùng có kích thước và vị trí cố định; nới nó thường phải tháo gắn, và nhiều khi phải dời cả phân vùng đứng sau nó. <strong>LVM</strong> (Logical Volume Manager — trình quản lý ổ logic) chèn thêm một tầng để xoá bỏ rắc rối đó. Đĩa hoặc phân vùng trở thành <strong>PV</strong> (physical volume — ổ vật lý); các PV được gom vào một <strong>VG</strong> (volume group — nhóm ổ) chia thành các <em>extent</em> (khoanh) 4 MiB; từ cái bể đó bạn tạo các <strong>LV</strong> (logical volume — ổ logic) hành xử như phân vùng nhưng nới được, trải qua nhiều đĩa, và chụp snapshot được. Nhiều image VPS và mọi bản cài RHEL/Fedora Server đều dùng nó.</p>
<pre><code>pvcreate /dev/loop0p2
vgcreate vg_app /dev/loop0p2
lvcreate -n lv_db -L 400M vg_app
pvs; vgs; lvs</code></pre>
<div class="out">  Physical volume "/dev/loop0p2" successfully created.
  Volume group "vg_app" successfully created
  Logical volume "lv_db" created.
  PV           VG     Fmt  Attr PSize   PFree
  /dev/loop0p2 vg_app lvm2 a--  720.00m 320.00m
  VG     #PV #LV #SN Attr   VSize   VFree
  vg_app   1   1   0 wz--n- 720.00m 320.00m
  LV    VG     Attr       LSize   Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  lv_db vg_app -wi-a----- 400.00m</div>
<p>LV hiện ra là <code>/dev/vg_app/lv_db</code> (một liên kết tới <code>/dev/mapper/vg_app-lv_db</code>). Đặt ext4 lên nó, gắn vào <code>/srv/db</code>, làm đầy tới 100% — đúng tình cảnh một cơ sở dữ liệu vừa hết chỗ — rồi nới nó mà không dừng thứ gì:</p>
<pre><code>mkfs.ext4 -q /dev/vg_app/lv_db &amp;&amp; mkdir -p /srv/db &amp;&amp; mount /dev/vg_app/lv_db /srv/db
fallocate -l 330M /srv/db/data.bin; df -h /srv/db | tail -1
lvextend -r -L +250M vg_app/lv_db
df -h /srv/db | tail -1</code></pre>
<div class="out">/dev/mapper/vg_app-lv_db  359M  331M  352K 100% /srv/db
  Rounding size to boundary between physical extents: 252.00 MiB.
  Size of logical volume vg_app/lv_db changed from 400.00 MiB (100 extents) to 652.00 MiB (163 extents).
  Logical volume vg_app/lv_db successfully resized.
resize2fs 1.47.0 (5-Feb-2023)
Filesystem at /dev/mapper/vg_app-lv_db is mounted on /srv/db; on-line resizing required
The filesystem on /dev/mapper/vg_app-lv_db is now 166912 (4k) blocks long.
/dev/mapper/vg_app-lv_db  598M  331M  236M  59% /srv/db</div>
<p><code>-r</code> là cờ quan trọng: nó nới cả <em>hệ thống file</em> (nó gọi <code>resize2fs</code> giùm ta, kiểu "on-line", trong lúc đang gắn). Thiếu <code>-r</code>, LV lớn thêm mà <code>df</code> vẫn báo 100%, vì hệ thống file bên trong không hề biết — lỗi "tôi nới rồi mà chẳng thay đổi gì" hay gặp nhất. Khi chính cái bể cũng cạn, hãy thêm một đĩa vào (trên VPS: gắn thêm một volume trong bảng điều khiển của nhà cung cấp; nó hiện ra là <code>/dev/vdb</code>):</p>
<pre><code>truncate -s 512M dia2.img; L2=$(losetup -f --show dia2.img)
pvcreate "$L2"; vgextend vg_app "$L2"
lvextend -r -l +100%FREE vg_app/lv_db
df -h /srv/db | tail -1
lsblk /dev/loop0 /dev/loop1</code></pre>
<div class="out">  Physical volume "/dev/loop1" successfully created.
  Volume group "vg_app" successfully extended
/dev/mapper/vg_app-lv_db  1.2G  331M  773M  30% /srv/db
NAME             MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
loop0              7:0    0    1G  0 loop
|-loop0p1        259:0    0  300M  0 part /mnt/du-lieu
&#96;-loop0p2        259:1    0  722M  0 part
  &#96;-vg_app-lv_db 253:0    0  1.2G  0 lvm  /srv/db
loop1              7:1    0  512M  0 loop
&#96;-vg_app-lv_db   253:0    0  1.2G  0 lvm  /srv/db</div>
<p><code>lsblk</code> giờ vẽ một LV đứng trên hai cái đĩa. <code>-l +100%FREE</code> đếm theo extent: "toàn bộ chỗ trống trong nhóm". Trong container, LVM còn cần <code>udev_sync = 0</code> và <code>udev_rules = 0</code> trong <code>/etc/lvm/lvm.conf</code> (lại vì không có udev); trên máy chủ thật đừng đụng vào chúng.</p>
<table>
<tr><th>Lệnh</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>pvcreate</code> · <code>pvs</code></td><td>Biến đĩa/phân vùng thành PV · liệt kê PV</td><td><code>pvcreate /dev/vdb</code></td></tr>
<tr><td><code>vgcreate</code> · <code>vgextend</code> · <code>vgs</code></td><td>Nhóm mới · thêm PV · liệt kê</td><td><code>vgextend vg_app /dev/vdb</code></td></tr>
<tr><td><code>lvcreate -n TÊN -L CỠ</code></td><td>LV mới cỡ cố định (<code>-l 100%FREE</code> = hết phần còn lại)</td><td><code>lvcreate -n lv_db -L 20G vg_app</code></td></tr>
<tr><td><code>lvextend -r</code></td><td>Nới LV <em>và</em> hệ thống file, khi đang chạy</td><td><code>lvextend -r -L +10G vg_app/lv_db</code></td></tr>
<tr><td><code>lvreduce -r</code></td><td>Thu nhỏ (chỉ ext4, phải tháo gắn trước; XFS thì không bao giờ)</td><td>sao lưu trước đã</td></tr>
<tr><td><code>lvs -o +devices</code></td><td>Mỗi LV nằm trên những đĩa nào</td><td><code>lvs -o lv_name,lv_size,devices</code></td></tr>
</table>

<h3>ext4 hay XFS — và một swap file</h3>
${slide('lx-14', 20, 'ext4 hay XFS, swap file')}
<p>Ubuntu và Debian mặc định dùng <strong>ext4</strong>; RHEL, Rocky và Fedora Server mặc định dùng <strong>XFS</strong>; Fedora Workstation (cái <code>lsblk</code> ở trên) dùng <strong>btrfs</strong>. Cả ba đều nới được khi đang chạy. Khác biệt làm đau: <strong>XFS không bao giờ thu nhỏ được</strong>:</p>
<pre><code>mkfs.xfs -q /dev/vg_x/lv_x; mount /dev/vg_x/lv_x /mnt/x
lvreduce -r -y -L 200M vg_x/lv_x</code></pre>
<div class="out">fsadm: Xfs filesystem shrinking is unsupported.
  /usr/sbin/fsadm failed: 1
  Filesystem resize failed.</div>
<p>Vậy trên XFS, hãy cho ổ đúng cỡ nó cần rồi nới dần; đừng bao giờ cấp dư "cho chắc" rồi mong lấy lại chỗ. ext4 thu nhỏ được, nhưng chỉ khi đã tháo gắn. XFS cấp inode động, nên nó không mắc cảnh "hết inode mà còn dung lượng" của Bài 10.1.</p>
<p>Bài 11.3 đã giải thích <em>vì sao</em> một VPS nhỏ cần swap. Đây là cách làm, trên một hệ thống file bạn tự dựng (swap file phải được cấp chỗ thật toàn bộ, nên dùng <code>fallocate</code> hoặc <code>dd</code>, đừng dùng <code>truncate</code>):</p>
<pre><code>fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile &amp;&amp; swapon --show
echo '/swapfile none swap sw 0 0' &gt;&gt; /etc/fstab</code></pre>
<div class="out">Setting up swapspace version 1, size = 128 MiB (134213632 bytes)
no label, UUID=dadf7b16-ce42-4357-ab71-53d02aa59cab
NAME             TYPE  SIZE   USED PRIO
/var/lib/swap    file 1024M 441.8M   -1
/srv/db/swapfile file  128M     0B   -1</div>
<p>(Đo bằng một file 128 MB trên ổ tập và gỡ ngay bằng <code>swapoff</code> — dòng <code>/var/lib/swap</code> là swap riêng của Docker Desktop, hiện ra vì swap là thiết lập toàn nhân, giống các giá trị <code>sysctl</code> của Bài 14.1.)</p>

<h3>Checksum: chứng minh hai file giống hệt nhau</h3>
${slide('lx-14', 21, 'Checksum và rsync -c')}
<p>Bài 10.2 dùng <code>sha256sum</code> để kiểm một file tải về. Cùng công cụ đó chứng minh một bản sao lưu hay một bản chép còn nguyên vẹn — và nó kêu to chỉ vì một byte bị đổi:</p>
<pre><code>head -c 300M /dev/urandom &gt; goi.tar
sha256sum goi.tar &gt; goi.tar.sha256
sha256sum -c goi.tar.sha256
printf "\\x00" | dd of=goi.tar bs=1 seek=1000 conv=notrunc status=none
sha256sum -c goi.tar.sha256; echo "rc=$?"</code></pre>
<div class="out">goi.tar: OK
goi.tar: FAILED
sha256sum: WARNING: 1 computed checksum did NOT match
rc=1</div>
<p>Vì <code>-c</code> thoát với mã 1 khi lệch, nó nằm thẳng trong script sao lưu được: <code>sha256sum -c backup.sha256 || { echo "bản sao lưu hỏng" &gt;&amp;2; exit 1; }</code>. <strong>BLAKE3</strong> (<code>b3sum</code>, gói <code>b3sum</code>) là một hàm băm mới hơn, thiết kế để chạy trên nhiều lõi. Cùng 300 MB: <code>sha256sum</code> 0,158 giây, <code>b3sum</code> 0,060 giây, nhưng <code>b3sum --num-threads 1</code> 0,295 giây — trên máy ARM này CPU có lệnh SHA-256 riêng, nên SHA-256 đơn luồng thắng và BLAKE3 chỉ thắng nhờ dùng nhiều lõi. Đo trên phần cứng của chính bạn rồi hãy chọn.</p>
<p>Cái bẫy tinh vi hơn nằm ở <code>rsync</code> (Bài 9.4). Mặc định nó coi một file là không đổi khi <strong>cỡ và giờ sửa</strong> trùng nhau — cái gọi là "quick check" (kiểm nhanh) — mà không đọc nội dung. Cho hai thứ đó trùng khớp là nó lặng lẽ bỏ qua một file đã bị sửa:</p>
<pre><code>mkdir nguon dich; echo "PORT=3000" &gt; nguon/app.env; rsync -a nguon/ dich/
echo "PORT=4000" &gt; nguon/app.env; touch -r dich/app.env nguon/app.env   <span class="tok-comment"># cùng cỡ, cùng giờ sửa</span>
rsync -av nguon/ dich/ | sed -n 2p; cat dich/app.env
rsync -avc nguon/ dich/ | sed -n 2p; cat dich/app.env</code></pre>
<div class="out">
PORT=3000
app.env
PORT=4000</div>
<p>Lượt đầu không chép gì (dòng 2 trống) và <code>PORT=3000</code> cũ vẫn nằm đó. <code>-c</code> (<code>--checksum</code>) băm mọi file ở cả hai phía và bắt được nó. Nó chậm hơn — phải đọc từng byte — nên dùng cho những lượt kiểm tra và cho cây cấu hình nhỏ, đừng dùng cho mọi lượt đồng bộ hằng giờ của một thư mục dữ liệu lớn.</p>

<h3>Chạy thử từng bước: trọn cả chuỗi, rồi dọn dẹp</h3>
<ol>
<li><code>docker run -it --privileged --name lab-disk ubuntu:24.04 bash</code>, rồi <code>apt-get update &amp;&amp; apt-get install -y parted lvm2 xfsprogs</code>; đặt <code>udev_sync = 0</code> và <code>udev_rules = 0</code> trong <code>/etc/lvm/lvm.conf</code>.</li>
<li><code>truncate -s 1G d.img; L=$(losetup -fP --show d.img)</code>; một phân vùng GPT với <code>set 1 lvm on</code>; <code>mknod</code> nút phân vùng theo <code>/proc/partitions</code> nếu nó không có.</li>
<li><code>pvcreate</code> → <code>vgcreate vg_lab</code> → <code>lvcreate -n data -L 300M vg_lab</code> → <code>mkfs.ext4</code> → <code>mount</code> vào <code>/srv/data</code>.</li>
<li>Thêm vào fstab bằng UUID kèm <code>nofail</code>; <code>findmnt --verify</code>; <code>umount /srv/data &amp;&amp; mount -a</code>.</li>
<li><code>lvextend -r -L +100M vg_lab/data</code> trong lúc <code>dd if=/dev/zero of=/srv/data/x bs=1M count=200</code> đang chạy ở shell khác; so <code>df -h</code> trước và sau.</li>
<li>Dọn theo thứ tự ngược: <code>umount /srv/data; vgremove -y vg_lab; pvremove "\${L}p1"; losetup -d "$L"</code>, rồi <code>exit</code> và <code>docker rm lab-disk</code>. Luôn tháo loop device từng cái bằng <code>-d</code>; <code>losetup -D</code> tháo MỌI loop device trên máy, kể cả cái mà phần mềm khác (snap trên Ubuntu, máy ảo của Docker) có thể đang dùng.</li>
</ol>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Việc</th><th>Linux</th><th>macOS 27 (đo thật)</th><th>WSL2</th></tr>
<tr><td>Liệt kê đĩa</td><td><code>lsblk -f</code>, <code>blkid</code></td><td><code>diskutil list</code> — các <em>container</em> APFS chứa các <em>volume</em>, một khái niệm gần giống VG và LV của LVM</td><td><code>lsblk</code> hiện các đĩa ảo <code>sdX</code>; ổ của Windows hiện ở <code>/mnt/c</code></td></tr>
<tr><td>Đĩa từ một file</td><td><code>losetup</code></td><td><code>hdiutil create</code> / <code>hdiutil attach</code> (ảnh đĩa)</td><td><code>losetup</code> chạy được</td></tr>
<tr><td>Gắn lúc khởi động</td><td><code>/etc/fstab</code></td><td>APFS tự lo; fstab hầu như không dùng</td><td><code>/etc/fstab</code> bên trong distro, cộng <code>wsl --mount</code> từ phía Windows cho một đĩa vật lý</td></tr>
<tr><td>LVM, XFS, ext4</td><td>có</td><td>không (APFS; không có <code>mkfs.ext4</code>)</td><td>có</td></tr>
<tr><td>Checksum</td><td><code>sha256sum</code>, <code>b3sum</code></td><td>có <code>/sbin/sha256sum</code> và <code>-c</code> chạy được; thêm <code>shasum -a 256</code>; không có <code>b3sum</code></td><td>như Linux</td></tr>
</table>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> ổ PostgreSQL của nhóm trên VPS đầy 95% khi còn hai ngày nữa là bảo vệ đồ án, và nhà cung cấp cho phép gắn thêm một đĩa thứ hai. Hãy tập trọn thao tác trên file trước, trong một container đặc quyền dùng xong vứt.</p><ol>
<li>Dựng <code>vg_pg</code> từ một đĩa-file 600 MB và một LV <code>lv_pg</code> 300 MB định dạng ext4, gắn ở <code>/var/lib/pg-lab</code> và ghi vào fstab bằng UUID kèm <code>nofail</code>. Chứng minh dòng đó đúng bằng <code>findmnt --verify</code>.</li>
<li>Làm đầy nó tới 100% bằng <code>fallocate</code>, rồi giả lập "gắn thêm đĩa": một file thứ hai 400 MB, <code>pvcreate</code>, <code>vgextend</code>.</li>
<li>Nới LV bằng toàn bộ chỗ trống trong một lệnh, trong khi một vòng lặp cứ 0,2 giây nối một dòng vào một file trên ổ đó.</li>
<li>Chép thư mục dữ liệu sang <code>/root/copy</code> bằng <code>rsync -a</code>, đổi một byte trong một file đã chép mà giữ nguyên cỡ và giờ sửa (<code>touch -r</code>), rồi cho thấy <code>rsync -av</code> không sửa được nó còn <code>rsync -avc</code> thì có; xác nhận bằng <code>sha256sum</code>.</li>
<li>Dỡ bỏ mọi thứ và chứng minh <code>losetup -a</code> rỗng.</li></ol>
<p><strong>Đạt khi:</strong> <code>df -h</code> cho thấy ổ đã lớn lên mà không cần <code>umount</code>; file đang được nối vẫn tiếp tục dài ra trong lúc nới; <code>findmnt --verify</code> báo 0 lỗi; byte bị đổi chỉ được sửa bằng <code>-c</code>; <code>losetup -a</code> không in gì.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Block device (thiết bị khối)</span><span class="v">Thiết bị đọc ghi theo từng khối (đĩa, phân vùng, loop device, LV).</span></div>
  <div class="kv"><span class="k">Loop device (thiết bị vòng)</span><span class="v">Thiết bị của nhân biến một file thường thành thứ hành xử như cái đĩa.</span></div>
  <div class="kv"><span class="k">Sparse file (file thưa)</span><span class="v">File có kích thước lớn hơn số khối nó thật sự chiếm, cho tới khi có dữ liệu ghi vào.</span></div>
  <div class="kv"><span class="k">GPT / MBR (bảng phân vùng)</span><span class="v">Định dạng bảng phân vùng hiện đại và định dạng cũ.</span></div>
  <div class="kv"><span class="k">UUID (mã định danh duy nhất)</span><span class="v">Mã ghi vào hệ thống file lúc <code>mkfs</code>, không đổi khi tên thiết bị đổi.</span></div>
  <div class="kv"><span class="k">PV / VG / LV (ổ vật lý / nhóm ổ / ổ logic)</span><span class="v">Ba tầng của LVM: đĩa góp vào, cái bể chung, và "phân vùng" linh hoạt cấp ra từ bể.</span></div>
  <div class="kv"><span class="k">Extent (khoanh)</span><span class="v">Đơn vị cỡ cố định (mặc định 4 MiB) mà LVM cấp ra từ một VG.</span></div>
  <div class="kv"><span class="k">Checksum / hash (tổng kiểm / hàm băm)</span><span class="v">Dấu vân tay ngắn của nội dung file; đổi một byte là nó đổi hoàn toàn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đĩa → phân vùng → (LVM) → hệ thống file → gắn → thư mục; <code>lsblk -f</code> vẽ cái cây, <code>blkid</code> cho UUID.</li>
<li>Tập trên một file thưa với <code>losetup</code> trong container dùng xong vứt; <code>parted -s</code> ghi phân vùng GPT từ script.</li>
<li>fstab: luôn <code>UUID=</code>, thêm <code>nofail</code> cho mọi đĩa không thiết yếu, và chạy <code>findmnt --verify</code> cùng <code>mount -a</code> trước khi khởi động lại.</li>
<li>LVM gom đĩa thành bể; <code>vgextend</code> thêm đĩa, <code>lvextend -r</code> nới cả ổ lẫn hệ thống file trong lúc đang gắn.</li>
<li>XFS không bao giờ thu nhỏ, ext4 chốt số inode lúc <code>mkfs</code>; swap file là <code>fallocate</code> + <code>chmod 600</code> + <code>mkswap</code> + <code>swapon</code> + fstab.</li>
<li><code>sha256sum -c</code> kêu to chỉ vì một byte; <code>rsync</code> thiếu <code>-c</code> thì tin vào cỡ và giờ sửa.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man8/lvm.8.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">lvm(8)</span><span class="lc-sub">Tấm bản đồ mọi lệnh của LVM, từ <code>pvcreate</code> tới snapshot.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man8/lvextend.8.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">lvextend(8)</span><span class="lc-sub"><code>-r</code>/<code>--resizefs</code>, cỡ tính theo extent và phần trăm (<code>+100%FREE</code>).</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man5/fstab.5.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">fstab(5)</span><span class="lc-sub">Sáu trường, <code>UUID=</code>/<code>LABEL=</code>, và các tuỳ chọn như <code>nofail</code>.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man8/losetup.8.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">losetup(8)</span><span class="lc-sub">Loop device: <code>-f</code>, <code>-P</code>, <code>-d</code>, và vì sao <code>-D</code> rộng hơn bạn nghĩ.</span></span>
</a>
<a class="link-card" href="https://github.com/BLAKE3-team/BLAKE3" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">BLAKE3</span><span class="lc-sub">Hàm băm đứng sau <code>b3sum</code>: thiết kế, số đo và chế độ nhiều luồng.</span></span>
</a>
<a class="link-card codelab" href="/courses/deploy-vps" target="_blank" rel="noopener">
  <span class="lc-ico">🖥️</span>
  <span class="lc-body"><span class="lc-title">Deploy lên VPS — khoá đầy đủ trên trang này</span><span class="lc-sub">Những cái đĩa này sống ở đâu trong thực tế: gắn volume, sao lưu và phục hồi trên một máy chủ thật.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>Nới LV không phải là nới hệ thống file.</strong> <code>lvextend -L +10G vg/lv</code> thiếu <code>-r</code> vẫn báo thành công, và <code>df</code> vẫn hiện cỡ cũ và 100% — phần thêm nằm trong ổ logic, ext4 không nhìn thấy. Hoặc luôn truyền <code>-r</code>, hoặc làm tiếp <code>resize2fs /dev/vg/lv</code> (ext4) hay <code>xfs_growfs /điểm/gắn</code> (XFS — để ý nó nhận điểm gắn, không nhận thiết bị).</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Tập mọi thao tác phá đĩa trên một file loop trước — không tốn gì và giống hệt đồ thật. Gắn bằng UUID kèm <code>nofail</code>, và kiểm fstab trước khi khởi động lại, không phải sau. Và "chép xong rồi" không phải là "chép đúng rồi": chỉ checksum mới là bằng chứng.</p>
</div>
`,
    },
    /* ─────────────────────────── 14.4 ─────────────────────────── */
    {
      title: '14.4 — Security in depth: SSH keys, nftables, fail2ban, SELinux, narrow sudo, lynis|||14.4 — Bảo mật sâu: khoá SSH, nftables, fail2ban, SELinux, sudo hẹp, lynis',
      slug: 'lnx-14-4-bao-mat-sau',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Phòng thủ nhiều lớp mà lớp nào cũng KIỂM được: khoá ed25519 và sshd -T -C, tự viết bộ luật nftables rồi thử từ máy khác, fail2ban đọc log của chính ứng dụng, nhãn SELinux (sự cố thật trên Fedora) và AppArmor, hai luật sudo "hẹp" vẫn trao quyền root và cách sửa, auditd và điểm cứng hoá của lynis.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.4</span>
<h2>Security in depth</h2>
<p class="lead">Lesson 11.3 took a new VPS through its first hour: key-only SSH proven with <code>sshd -T</code>, the "first value wins" trap in <code>sshd_config.d</code>, a firewall, fail2ban at its default settings, automatic updates. Lesson 9.5 showed that <code>ufw</code> and <code>firewalld</code> are front ends to nftables. This lesson goes one level down on each layer and adds the ones a first hour skips: firewall rules you write and can read, fail2ban watching <em>your application's</em> log, mandatory access control (SELinux, AppArmor), sudo rules that look narrow and are not, an audit trail, and a scanner that grades the whole machine. The rule for every layer is the same one the <code>sshd</code> story taught: a configuration file says what you <em>meant</em>; only a command that reads the <em>effective</em> state, or a real attempt from outside, says what is true.</p>

<h3>Layers, each with its own proof</h3>
${slide('lx-14', 22, 'Bảo mật nhiều lớp')}
<p>"Defence in depth" means no single layer has to be perfect: a stolen password is useless when SSH accepts only keys; a vulnerable web app cannot read <code>/etc/shadow</code> when SELinux confines it; a user who gets a shell still cannot become root when sudo is narrow. From the outside in: the firewall, SSH, fail2ban, sudo, mandatory access control, and then the audit trail and updates that tell you when something slipped. For each one, this lesson gives you the command that <em>verifies</em> it rather than the file that <em>configures</em> it — <code>nft list ruleset</code> plus a connection from another machine, <code>sshd -T</code>, <code>fail2ban-regex</code>, <code>sudo -l</code> and an actual escalation attempt, <code>ls -Z</code>, <code>lynis</code>.</p>

<h3>SSH: ed25519 keys, and sshd -T with a pretend client</h3>
${slide('lx-14', 23, 'SSH: ed25519 và sshd -T')}
<p>If you still make RSA keys out of habit, compare (on the Mac, OpenSSH_10.3p1):</p>
<pre><code>time ssh-keygen -q -t ed25519 -a 100 -C "an@laptop" -f k_ed -N ''
time ssh-keygen -q -t rsa -b 4096 -C "an@laptop" -f k_rsa -N ''
wc -c k_ed.pub k_rsa.pub
ssh-keygen -lf k_ed.pub</code></pre>
<div class="out">ssh-keygen … 0.00s user 0.01s system 65% cpu 0.013 total
ssh-keygen … 0.90s user 0.01s system 95% cpu 0.954 total
      91 k_ed.pub
     735 k_rsa.pub
256 SHA256:pLC+2JcSU63uge/9CIKkNASIuMiLX9uIZyYSukdrSEs an@laptop (ED25519)</div>
<p>An Ed25519 key is generated about 70 times faster, its public half is 91 bytes instead of 735 (one short line in <code>authorized_keys</code>), and it is the type current OpenSSH prefers. <code>-N ''</code> was only for the demo: a real private key should have a passphrase, unlocked once per session by <code>ssh-agent</code> (Lesson 9.3). <code>-a 100</code> sets how many rounds of key derivation protect that passphrase — it slows down someone guessing it, and does nothing if there is no passphrase.</p>
<p>On the server, Lesson 11.3's rule stands: never trust the file, ask <code>sshd -T</code>. Two additions matter for a team server. <code>AllowGroups</code> limits who may log in at all, and <code>Match</code> blocks give some users different rules — here an <code>sftp-only</code> group that can transfer files but not get a shell or open tunnels. <code>sshd -T</code> alone ignores <code>Match</code>; <code>-C</code> describes a pretend connection so you can see what <em>that</em> user would get:</p>
<pre><code>cat /etc/ssh/sshd_config.d/01-cung.conf
sshd -t &amp;&amp; echo "sshd -t: OK"
sshd -T | grep -E "^(passwordauthentication|permitrootlogin|allowgroups|maxauthtries|logingracetime|x11forwarding) "
sshd -T -C user=ban,host=x,addr=10.0.0.5 | grep -E "^(forcecommand|allowtcpforwarding) "</code></pre>
<div class="out">PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin no
AllowGroups ssh-users
MaxAuthTries 3
LoginGraceTime 20
X11Forwarding no
Match Group sftp-only
    ForceCommand internal-sftp
    AllowTcpForwarding no
sshd -t: OK
logingracetime 20
maxauthtries 3
permitrootlogin no
passwordauthentication no
x11forwarding no
allowgroups ssh-users
allowtcpforwarding no
forcecommand internal-sftp</div>
<p>One detail from the measurement: before the user <code>ban</code> existed, the same <code>-C</code> query printed <code>forcecommand none</code> — <code>Match Group</code> looks the user up, and a user who does not exist is in no group. Test with real accounts.</p>
<table>
<tr><th>Directive</th><th>Meaning</th><th>Sensible value</th></tr>
<tr><td><code>PasswordAuthentication</code> · <code>KbdInteractiveAuthentication</code></td><td>Password logins (both paths)</td><td><code>no</code>, <code>no</code></td></tr>
<tr><td><code>PermitRootLogin</code></td><td>Direct root login</td><td><code>no</code> (or <code>prohibit-password</code>)</td></tr>
<tr><td><code>AllowGroups</code> · <code>AllowUsers</code></td><td>Whitelist; everyone else is refused</td><td>a group you are in</td></tr>
<tr><td><code>MaxAuthTries</code> · <code>LoginGraceTime</code></td><td>Attempts per connection · seconds to finish logging in</td><td><code>3</code> · <code>20</code></td></tr>
<tr><td><code>X11Forwarding</code> · <code>AllowTcpForwarding</code></td><td>Graphical forwarding · tunnels (Lesson 9.3)</td><td><code>no</code> unless needed</td></tr>
<tr><td><code>Match Group G</code> + <code>ForceCommand internal-sftp</code></td><td>File transfer only, no shell</td><td>for upload-only accounts</td></tr>
</table>

<h3>nftables: a ruleset you wrote and can read</h3>
${slide('lx-14', 24, 'nftables tự viết')}
<p>Lesson 9.5 read the rules that <code>ufw</code> writes. On a server without ufw — RHEL-family machines, containers, a router — you write <code>/etc/nftables.conf</code> yourself, and it is short. A <strong>table</strong> holds <strong>chains</strong>; a base chain hooks into a point on the packet's path (<code>input</code> for traffic to this machine) with a default <strong>policy</strong>; <strong>rules</strong> are read top to bottom and the first verdict wins; a <strong>set</strong> is a named list the rules can test against, which you can change without reloading anything:</p>
<pre><code>#!/usr/sbin/nft -f
flush ruleset

table inet loc {
    set chan_ip {
        type ipv4_addr
        flags timeout
    }

    chain vao {
        type filter hook input priority filter; policy drop;

        ct state established,related accept
        ct state invalid drop
        iif "lo" accept
        ip saddr @chan_ip counter drop
        meta l4proto icmp accept
        tcp dport 22 ct state new limit rate 10/minute accept
        tcp dport { 80, 443, 19141 } accept
        counter comment "roi xuong day = bi chan"
    }
}</code></pre>
<p>Read it line by line. <code>inet</code> = one table for IPv4 and IPv6. <code>policy drop</code> = anything not explicitly accepted is dropped. <code>ct state established,related accept</code> = replies to connections this machine opened (and the rest of connections already accepted) pass — without it, <code>apt</code> and <code>curl</code> break the moment you set <code>policy drop</code>. <code>iif "lo"</code> = local traffic. The set <code>chan_ip</code> is a ban list whose entries expire. SSH is accepted but new connections are rate-limited. The last rule only <em>counts</em> what falls through to the policy — a free diagnostic. Check the syntax without applying, apply, then test from <em>another</em> machine (a second container, 172.17.0.8):</p>
<pre><code>nft -c -f /etc/nftables.conf &amp;&amp; echo "cu phap OK"
nft -f /etc/nftables.conf
<span class="tok-comment"># from 172.17.0.8:</span>
curl -s -o /dev/null -m 3 -w "cong 19141: %{http_code}\\n" http://172.17.0.5:19141/
curl -s -o /dev/null -m 3 -w "cong 19142: %{http_code}\\n" http://172.17.0.5:19142/ || echo "cong 19142: curl exit $?"
nft list chain inet loc vao | grep counter</code></pre>
<div class="out">cu phap OK
cong 19141: 200
cong 19142: 000
cong 19142: curl exit 28
		ip saddr @chan_ip counter packets 0 bytes 0 drop
		counter packets 3 bytes 180 comment "roi xuong day = bi chan"</div>
<p>Port 19141 answered 200; 19142 — a server was listening there too — timed out (curl exit 28), because a dropped packet gets no reply at all. The fall-through counter recorded exactly the 3 SYN packets curl tried. Now ban the client for ten minutes by adding it to the set, no reload needed:</p>
<pre><code>nft add element inet loc chan_ip { 172.17.0.8 timeout 10m }
nft list set inet loc chan_ip | grep elements
<span class="tok-comment"># from 172.17.0.8 again: port 19141 now times out too</span>
nft list chain inet loc vao | grep chan_ip
nft delete element inet loc chan_ip { 172.17.0.8 }</code></pre>
<div class="out">		elements = { 172.17.0.8 timeout 10m expires 9m59s999ms }
cong 19141: 000
cong 19141: curl exit 28
		ip saddr @chan_ip counter packets 3 bytes 180 drop</div>
<p>That is exactly how fail2ban's nftables action works, as you will see in a moment. Two last points. Rules loaded with <code>nft -f</code> live in the kernel until reboot; to load the file at boot, <code>systemctl enable nftables</code> (its unit runs <code>ExecStart=/usr/sbin/nft -f /etc/nftables.conf</code>, and it was <code>disabled</code> by default on this Ubuntu). And when experimenting on a remote machine, schedule a safety net first — <code>(sleep 300; nft flush ruleset) &amp;</code> — so a rule that locks you out undoes itself in five minutes.</p>
<table>
<tr><th>Command</th><th>Meaning</th></tr>
<tr><td><code>nft -c -f FILE</code></td><td>Check syntax only (<code>-c</code> = check)</td></tr>
<tr><td><code>nft -f FILE</code></td><td>Load a file (with <code>flush ruleset</code> at the top: replace everything atomically)</td></tr>
<tr><td><code>nft list ruleset</code> · <code>nft list chain inet T C</code></td><td>Show everything · one chain, with counters</td></tr>
<tr><td><code>nft -a list chain …</code> · <code>nft delete rule inet T C handle N</code></td><td>Show rule handles · delete one rule</td></tr>
<tr><td><code>nft add element inet T S { IP timeout 1h }</code></td><td>Add to a set, with expiry</td></tr>
<tr><td><code>nft flush ruleset</code></td><td>Remove ALL rules (everything allowed again)</td></tr>
</table>

<h3>fail2ban for your own application's log</h3>
${slide('lx-14', 25, 'fail2ban cho log của app')}
<p>Lesson 11.3 turned on fail2ban's ready-made <code>sshd</code> jail. Its real power is that a jail is just <em>a log file + a regular expression + a ban action</em>, so it can protect your own login page. Suppose the booking API logs failures like <code>2026-09-28 16:30:02 WARN LOGIN FAIL user=admin ip=203.0.113.7</code>. A filter describes the line, with <code>&lt;HOST&gt;</code> where the IP is:</p>
<pre><code><span class="tok-comment"># /etc/fail2ban/filter.d/app-login.conf</span>
[Definition]
failregex = ^.* LOGIN FAIL user=\\S+ ip=&lt;HOST&gt;$
ignoreregex =</code></pre>
<p>Test the filter against sample lines <em>before</em> enabling anything — this is the step that turns "fail2ban does nothing" from a mystery into a two-second check:</p>
<pre><code>fail2ban-regex /tmp/mau.log /etc/fail2ban/filter.d/app-login.conf</code></pre>
<div class="out">Failregex: 2 total
Lines: 3 lines, 0 ignored, 2 matched, 1 missed
|- Missed line(s):
|  2026-09-28 16:30:01 INFO LOGIN OK user=an ip=198.51.100.4</div>
<p>Two failures matched, the successful login correctly missed. Then the jail, in a <code>.local</code> file (the <code>.conf</code> files are replaced by package upgrades — <code>lynis</code> flags exactly this):</p>
<pre><code><span class="tok-comment"># /etc/fail2ban/jail.d/app-login.local</span>
[app-login]
enabled   = true
filter    = app-login
logpath   = /var/log/app/login.log
backend   = polling
maxretry  = 5
findtime  = 10m
bantime   = 1h
port      = 80,443
banaction = nftables-multiport</code></pre>
<pre><code>fail2ban-client reload
for i in 1 2 3 4 5 6; do echo "$(date '+%F %T') WARN LOGIN FAIL user=admin ip=203.0.113.7" &gt;&gt; /var/log/app/login.log; done
fail2ban-client status app-login
nft list ruleset | sed -n '/f2b/,$p'</code></pre>
<div class="out">Status for the jail: app-login
|- Filter
|  |- Currently failed:	1
|  |- Total failed:	6
|  &#96;- File list:	/var/log/app/login.log
&#96;- Actions
   |- Currently banned:	1
   |- Total banned:	1
   &#96;- Banned IP list:	203.0.113.7
table inet f2b-table {
	set addr-set-app-login {
		type ipv4_addr
		elements = { 203.0.113.7 }
	}

	chain f2b-chain {
		type filter hook input priority filter - 1; policy accept;
		tcp dport { 80, 443 } ip saddr @addr-set-app-login reject with icmp port-unreachable
	}
}</div>
<p>Six failures, one ban, and underneath exactly the pattern from the previous section: a table of its own, a set of banned addresses, one rule that rejects them on ports 80 and 443 only. <code>fail2ban-client set app-login unbanip 203.0.113.7</code> lifts it. Behind a reverse proxy (nginx, Cloudflare), make sure the application logs the <em>client's</em> IP, not the proxy's — otherwise the first ban blocks everyone.</p>

<h3>SELinux: the label decides, not rwx</h3>
${slide('lx-14', 26, 'SELinux: nhãn')}
<p>Everything so far is <em>discretionary</em> access control: the owner of a file decides its permissions, and root can do anything. <strong>Mandatory access control</strong> (MAC) adds a policy that even root's processes must obey. Fedora and RHEL use <strong>SELinux</strong> (released by the NSA in 2000); Ubuntu and Debian use <strong>AppArmor</strong>. On the Fedora machine, read-only:</p>
<pre><code>getenforce
sestatus | head -5
ls -Z /etc/shadow /usr/sbin/sshd ~/.bashrc
ps -eZ | grep -E " (sshd|chronyd|dockerd)$"</code></pre>
<div class="out">Enforcing
SELinux status:                 enabled
SELinuxfs mount:                /sys/fs/selinux
SELinux root directory:         /etc/selinux
Loaded policy name:             targeted
Current mode:                   enforcing
       system_u:object_r:shadow_t:s0 /etc/shadow
    system_u:object_r:sshd_exec_t:s0 /usr/sbin/sshd
unconfined_u:object_r:user_home_t:s0 /home/…/.bashrc
system_u:system_r:chronyd_t:s0      866 ?        00:00:00 chronyd
system_u:system_r:sshd_t:s0-s0:c0.c1023 1041 ?   00:00:02 sshd
system_u:system_r:container_runtime_t:s0 1620 ?  01:17:08 dockerd</div>
<p>Every file and every process carries a label <code>user:role:type:level</code>, and the part that matters is the <strong>type</strong>. The <code>targeted</code> policy says, in effect, "a process of type <code>sshd_t</code> may read files of type <code>sshd_exec_t</code>, <code>ssh_home_t</code>…"; anything not allowed is denied — even if <code>ls -l</code> says <code>644</code>. Which label a path <em>should</em> have is in the policy too: <code>matchpathcon /var/www/html/index.html</code> answers <code>httpd_sys_content_t</code>. The classic trap is the difference between <code>mv</code> and <code>cp</code>, reproduced without root in a home directory:</p>
<pre><code>echo a &gt; /tmp/lx14-mv.txt; echo b &gt; /tmp/lx14-cp.txt
mv /tmp/lx14-mv.txt .; cp /tmp/lx14-cp.txt .
ls -Z lx14-mv.txt lx14-cp.txt
restorecon -v lx14-mv.txt</code></pre>
<div class="out"> unconfined_u:object_r:user_tmp_t:s0 lx14-mv.txt
unconfined_u:object_r:user_home_t:s0 lx14-cp.txt
Relabeled /home/…/lxhoc-14/lx14-mv.txt from unconfined_u:object_r:user_tmp_t:s0 to unconfined_u:object_r:user_home_t:s0</div>
<p><code>cp</code> creates a new file, which gets the label of its new directory. <code>mv</code> moves the existing file, <strong>label included</strong>. Build a site in your home directory, <code>sudo mv</code> it into <code>/var/www/html</code>, and nginx gets 403 on files whose permissions are perfect, because they are still labelled <code>user_home_t</code>. <code>restorecon -Rv /var/www/html</code> resets every label to what the policy says.</p>
<p>When SELinux does deny something, <code>setroubleshoot</code> writes an explanation to the journal. This real one from the course's Fedora machine (23/09) came from an SSH remote port forward to port 18030:</p>
<pre><code>journalctl -t setroubleshoot --since -30d</code></pre>
<div class="out">SELinux is preventing sshd-session from name_bind access on the tcp_socket port 18030.

*****  Plugin bind_ports (92.2 confidence) suggests   ************************
If you want to allow sshd-session to bind to network port 18030
Then you need to modify the port type.
Do
# semanage port -a -t ssh_port_t -p tcp 18030

*****  Plugin catchall (1.41 confidence) suggests   **************************
…
# ausearch -c 'sshd-session' --raw | audit2allow -M my-sshdsession
# semodule -X 300 -i my-sshdsession.pp</div>
<p>This is the Fedora twin of the "Port 993 had no effect" story in the contract of this course: the SSH configuration was right and it still failed, one layer below. The plugins are ranked. The 92.2% suggestion is the precise fix: tell the policy that port 18030 is an SSH port. The 1.41% catch-all — generate a module from whatever was denied with <code>audit2allow</code> and load it — permits the exact denied operation and anything else in that log, and should be your last resort after reading what it grants. The reasons behind a denial are in <code>sudo ausearch -m AVC -ts recent | audit2why</code>, and on/off switches for common needs are booleans: <code>getsebool httpd_can_network_connect</code> printed <code>off</code> on this machine — the reason an nginx reverse proxy on Fedora returns 502 until someone runs <code>sudo setsebool -P httpd_can_network_connect on</code>. What you should never do is <code>setenforce 0</code> "to test" and forget it.</p>
<p><strong>AppArmor</strong> (Ubuntu) takes a different approach: instead of labelling every file, it gives each confined program a <em>profile</em> listing the paths it may use, in <code>/etc/apparmor.d/</code>. Lesson 4.5 showed its denial (<code>apparmor="DENIED" … profile="/usr/sbin/mysqld"</code>) in <code>dmesg</code>. The commands: <code>sudo aa-status</code> (which profiles are loaded, in enforce or complain mode), <code>sudo aa-complain PROFILE</code> (log instead of block, while you work out what is missing), <code>sudo aa-enforce PROFILE</code>. In our Docker Desktop container <code>aa-status</code> printed only <code>apparmor not present.</code> — the virtual machine's kernel has no AppArmor — so practise it on a real Ubuntu VM or VPS.</p>

<h3>Narrow sudo that is not narrow</h3>
${slide('lx-14', 27, 'sudoers hẹp mà vẫn thành root')}
<p>Lesson 4.4 wrote a narrow sudoers rule. The trap is that many ordinary programs can run other programs — and whatever they run inherits root. Two rules that look harmless, tested as the normal user <code>an</code> in a container:</p>
<pre><code><span class="tok-comment"># /etc/sudoers.d/an — WRONG</span>
an ALL=(root) NOPASSWD: /usr/bin/find
an ALL=(root) NOPASSWD: /usr/bin/less /var/log/*</code></pre>
<pre><code>sudo -l | tail -2
sudo find /tmp -maxdepth 0 -exec /bin/sh -c "id" \\;
sudo less /var/log/../../etc/shadow | head -2</code></pre>
<div class="out">    (root) NOPASSWD: /usr/bin/find
    (root) NOPASSWD: /usr/bin/less /var/log/*
uid=0(root) gid=0(root) groups=0(root)
root:*:20707:0:99999:7:::
daemon:*:20707:0:99999:7:::</div>
<p><code>find -exec</code> runs any command as root. And in sudoers, <code>*</code> matches <em>any characters including <code>/</code> and <code>..</code></em>, so <code>/var/log/*</code> matches <code>/var/log/../../etc/shadow</code> (and <code>less</code> can also start a shell with <code>!sh</code>). The GTFOBins project catalogues hundreds of programs with such escapes: editors, pagers, <code>tar</code>, <code>awk</code>, <code>git</code>, <code>docker</code>… The fixes, verified:</p>
<pre><code><span class="tok-comment"># /etc/sudoers.d/an — BETTER</span>
Cmnd_Alias APP_CMDS = /usr/bin/systemctl restart nang.service, /usr/bin/journalctl -u nang.service *
an ALL=(root) NOPASSWD: APP_CMDS
an ALL=(root) NOPASSWD: NOEXEC: /usr/bin/find
an ALL=(root) sudoedit /etc/nang/app.env</code></pre>
<pre><code>visudo -c -q &amp;&amp; echo "visudo OK"
sudo find /tmp -maxdepth 0 -exec /bin/sh -c id \\;
sudo -n systemctl stop nang.service</code></pre>
<div class="out">visudo OK
find: ‘/bin/sh’: Permission denied
sudo: a password is required</div>
<p><strong>Full command lines</strong> in a <code>Cmnd_Alias</code>: "restart this one service", not "systemctl anything". <code>NOEXEC:</code> stops the allowed program from starting others (it works through a preloaded library, so it covers dynamically linked programs, not statically linked ones — prefer not granting such programs at all). <strong><code>sudoedit</code></strong> lets a user edit one root-owned file with their <em>own</em> editor running as themselves, instead of granting <code>sudo vim</code>, which is a root shell with extra steps. <code>stop</code> was not in the list, so sudo asked for a password (<code>-n</code> = never prompt). Check any user's powers with <code>sudo -l -U an</code>, and syntax with <code>visudo -c</code> before logging out.</p>

<h3>An audit trail, a score, and updates that apply themselves</h3>
${slide('lx-14', 28, 'lynis và auditd')}
<p><strong>lynis</strong> (from CISOfy, package <code>lynis</code>) runs a few hundred checks and prints a hardening index with suggestions, each with a test ID:</p>
<pre><code>lynis audit system --quick --no-colors</code></pre>
<div class="out">  Hardening index : 64 [############        ]
  Tests performed : 238
  ! Found one or more vulnerable packages. [PKGS-7392]
  * Install needrestart, alternatively to debian-goodies, … [DEB-0831]
  * Copy /etc/fail2ban/jail.conf to jail.local to prevent it being changed by updates. [DEB-0880]
  * Default umask in /etc/login.defs could be more strict like 027 [AUTH-9328]
  * Enable sysstat to collect accounting (disabled) [ACCT-9626]
  * Enable auditd to collect audit information [ACCT-9628]
  …</div>
<p>Two warnings and forty suggestions on a fresh container. Use the index to compare the <em>same</em> machine before and after your changes, and read each suggestion critically: <code>lynis show details ACCT-9626</code> explains the test, and this one is wrong on Ubuntu 24.04 — it read <code>ENABLED="false"</code> from <code>/etc/default/sysstat</code> while the systemd timer was recording history every ten minutes (Lesson 14.2). Some suggestions (separate partitions for <code>/tmp</code> and <code>/var</code>) are for installation time, not for a running VPS.</p>
<p><strong>auditd</strong> records security-relevant events in the kernel — who changed <code>/etc/sudoers</code>, who ran what as root — to <code>/var/log/audit/audit.log</code>, where even root's shell history cannot hide them. Rules live in <code>/etc/audit/rules.d/*.rules</code>:</p>
<pre><code>-w /etc/sudoers -p wa -k sudoers            <span class="tok-comment"># watch: write or attribute change</span>
-w /etc/sudoers.d/ -p wa -k sudoers
-w /etc/ssh/sshd_config.d/ -p wa -k sshd</code></pre>
<p>Load them with <code>sudo augenrules --load</code>; read the trail with <code>sudo ausearch -k sudoers -i</code> (<code>-i</code> turns numeric IDs into names) and summaries with <code>sudo aureport --auth --summary</code>. Honestly reported: none of this ran here. In the container, <code>auditctl -w /etc/sudoers -p wa -k sudoers</code> answered <code>Error sending add rule data request (Operation not permitted)</code>: the kernel has one audit system that is not divided by namespace, so containers cannot configure it. Try it on a VM or VPS you own.</p>
<p>Finally, updates. Lesson 11.3 set up <code>unattended-upgrades</code> on Ubuntu. On Fedora 44 (dnf5), the equivalent is the separate package <code>dnf5-plugin-automatic</code> — not installed on the test machine — which provides <code>/etc/dnf/automatic.conf</code> (set <code>apply_updates = yes</code>) and a <code>dnf5-automatic.timer</code> to enable.</p>

<h3>Try it step by step: harden and verify one container</h3>
<ol>
<li><code>docker run -d --privileged --name lab-sec ubuntu:24.04 sleep infinity</code>; inside, <code>apt-get install -y nftables fail2ban openssh-server sudo lynis python3 curl</code>.</li>
<li>Run <code>lynis audit system --quick</code> and write down the hardening index.</li>
<li>Write the <code>/etc/nftables.conf</code> above, <code>nft -c -f</code>, <code>nft -f</code>; from a second container confirm one port answers and one times out; read the counters.</li>
<li>Create <code>01-cung.conf</code> for sshd, add yourself to <code>ssh-users</code>, check <code>sshd -T</code> and <code>sshd -T -C user=…</code>.</li>
<li>Add the <code>find</code> sudoers rule, escalate with <code>-exec</code>, then fix it and prove the escalation fails.</li>
<li>Run <code>lynis</code> again, compare the index, then <code>docker rm -f lab-sec</code>.</li>
</ol>

<h3>How macOS and WSL differ</h3>
<table>
<tr><th>Layer</th><th>Linux</th><th>macOS 27 (measured)</th><th>WSL2</th></tr>
<tr><td>Firewall</td><td>nftables (ufw/firewalld on top)</td><td>Application Firewall (<code>socketfilterfw --getglobalstate</code> → <code>Firewall is enabled. (State = 1)</code>) and <code>pfctl</code></td><td>the Windows firewall filters traffic into WSL; nftables inside the distro also works</td></tr>
<tr><td>MAC</td><td>SELinux / AppArmor</td><td>SIP (<code>csrutil status</code> → <code>enabled</code>) and the app sandbox</td><td>none by default</td></tr>
<tr><td>SSH keys</td><td><code>ssh-keygen -t ed25519</code></td><td>identical; the passphrase can be kept in the Keychain</td><td>identical</td></tr>
<tr><td>sudo rules</td><td><code>/etc/sudoers.d</code></td><td>same file format, same <code>visudo</code></td><td>as Linux</td></tr>
</table>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> a teammate's SWP391 demo server has password SSH, no firewall, and a sudoers line <code>dev ALL=(root) NOPASSWD: /usr/bin/vim /etc/nginx/*</code> "so they can edit nginx config". You have 20 minutes before the lecturer connects. Work in a privileged throwaway container.</p><ol>
<li>Prove the sudoers line is a root shell: as <code>dev</code>, get <code>id</code> to print <code>uid=0</code> (hint: vim's <code>:!</code>, or the <code>*</code> + <code>..</code> trick).</li>
<li>Replace it with <code>sudoedit /etc/nginx/sites-available/app</code> and prove <code>dev</code> can edit that file but no longer get root.</li>
<li>Write an nftables ruleset that allows only 22, 80, 443, with SSH rate-limited; test one allowed and one blocked port from a second container.</li>
<li>Add a fail2ban jail for a fake app log and get <code>fail2ban-client status</code> to show one banned IP.</li>
<li>Compare <code>lynis</code>'s hardening index before and after.</li></ol>
<p><strong>Done when:</strong> the escalation worked before and fails after; <code>nft -c</code> is silent and the blocked port gives curl exit 28; the jail lists one banned IP and <code>nft list ruleset</code> shows it in a set; the lynis index went up.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Defence in depth</span><span class="v">Several independent layers, so one failure is not a breach.</span></div>
  <div class="kv"><span class="k">Ruleset / chain / hook / policy</span><span class="v">nftables' structure: tables of chains attached to points on the packet path, with a default verdict.</span></div>
  <div class="kv"><span class="k">Connection tracking (ct state)</span><span class="v">The kernel remembering connections so replies can be allowed as "established".</span></div>
  <div class="kv"><span class="k">Jail / filter</span><span class="v">fail2ban's unit: a log, a regular expression for failures, and a ban action.</span></div>
  <div class="kv"><span class="k">Mandatory access control (MAC)</span><span class="v">A system-wide policy that even root's processes must obey (SELinux, AppArmor).</span></div>
  <div class="kv"><span class="k">SELinux label / type</span><span class="v"><code>user:role:type:level</code> on every file and process; the type decides access.</span></div>
  <div class="kv"><span class="k">Privilege escalation</span><span class="v">Turning limited access into more (usually root), e.g. through a program that can run others.</span></div>
  <div class="kv"><span class="k">Audit trail</span><span class="v">A tamper-resistant record of who did what, kept by auditd.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Every layer needs a proof that reads the effective state: <code>nft list ruleset</code> + a test from outside, <code>sshd -T -C</code>, <code>fail2ban-regex</code>, <code>sudo -l</code>, <code>ls -Z</code>, <code>lynis</code>.</li>
<li>Ed25519 keys with a passphrase; <code>AllowGroups</code> and <code>Match</code> blocks, checked for a specific user with <code>sshd -T -C user=…</code>.</li>
<li>A readable nftables ruleset is a dozen lines: <code>policy drop</code>, <code>ct state established</code>, a rate-limited SSH, sets for bans; <code>nft -c</code> first, <code>systemctl enable nftables</code> to persist.</li>
<li>fail2ban can guard any log: filter with <code>&lt;HOST&gt;</code>, test with <code>fail2ban-regex</code>, jail in a <code>.local</code> file.</li>
<li>SELinux decides by label type: <code>mv</code> keeps labels, <code>restorecon</code> fixes them, read setroubleshoot's ranked advice, never leave <code>setenforce 0</code>.</li>
<li>sudo: full command lines, no wildcards, <code>NOEXEC</code>, <code>sudoedit</code>; check programs against GTFOBins.</li>
</ul>

<a class="link-card" href="https://wiki.nftables.org/wiki-nftables/index.php/Main_Page" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">nftables wiki</span><span class="lc-sub">The official reference: tables, chains, sets, verdict maps and a quick reference of the <code>nft</code> syntax.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man5/sshd_config.5.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">sshd_config(5)</span><span class="lc-sub">Every directive in this lesson, including <code>Match</code>, <code>AllowGroups</code> and <code>ForceCommand</code>.</span></span>
</a>
<a class="link-card" href="https://github.com/fail2ban/fail2ban" target="_blank" rel="noopener">
  <span class="lc-ico">🚫</span>
  <span class="lc-body"><span class="lc-title">fail2ban</span><span class="lc-sub">Source, filters and actions shipped with it — read <code>filter.d/</code> to write your own.</span></span>
</a>
<a class="link-card" href="https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/using_selinux/index" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">Using SELinux — Red Hat documentation</span><span class="lc-sub">Labels, booleans, <code>semanage</code>, troubleshooting denials with <code>audit2why</code>.</span></span>
</a>
<a class="link-card" href="https://documentation.ubuntu.com/server/how-to/security/apparmor/" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">AppArmor — Ubuntu Server documentation</span><span class="lc-sub">Profiles, enforce and complain modes, and the <code>aa-*</code> tools.</span></span>
</a>
<a class="link-card" href="https://gtfobins.github.io/" target="_blank" rel="noopener">
  <span class="lc-ico">⚠️</span>
  <span class="lc-body"><span class="lc-title">GTFOBins</span><span class="lc-sub">Programs that can escape to a shell or read files when given sudo — check before you grant.</span></span>
</a>
<a class="link-card" href="https://cisofy.com/lynis/" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">Lynis — CISOfy</span><span class="lc-sub">The auditing tool used here: what it checks and how to read its report.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>Locking yourself out is the most common hardening failure.</strong> <code>AllowGroups ssh-users</code> without adding yourself to the group, <code>policy drop</code> before the SSH rule, a typo in <code>sshd_config</code> followed by a restart — each one cuts the branch you are sitting on. Keep one session open, apply changes from a second, test a new login from a third, and for firewall work schedule an automatic rollback (<code>(sleep 300; nft flush ruleset) &amp;</code>) before loading new rules.</div>
<p class="note-ct"><strong>Three things to remember.</strong> A config file is intent; <code>sshd -T</code>, <code>nft list ruleset</code>, <code>ls -Z</code> and a real attempt are proof. Grant the least: one command line in sudo, one port in the firewall, one capability instead of root. And read the tool's advice before you obey it — both setroubleshoot's ranking and lynis' suggestions can be wrong for your machine.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.4</span>
<h2>Bảo mật sâu</h2>
<p class="lead">Bài 11.3 đưa một VPS mới qua giờ đầu tiên của nó: SSH chỉ nhận khoá và chứng minh bằng <code>sshd -T</code>, cái bẫy "giá trị đầu tiên thắng" trong <code>sshd_config.d</code>, một bức tường lửa, fail2ban ở mức mặc định, cập nhật tự động. Bài 9.5 cho thấy <code>ufw</code> và <code>firewalld</code> chỉ là giao diện phía trước của nftables. Bài này đi xuống thêm một tầng ở từng lớp và thêm những lớp mà giờ đầu tiên bỏ qua: luật tường lửa bạn tự viết và đọc được, fail2ban canh log của <em>chính ứng dụng</em>, kiểm soát truy cập bắt buộc (SELinux, AppArmor), những luật sudo trông hẹp mà không hẹp, một dấu vết kiểm toán, và một công cụ chấm điểm cả cái máy. Luật cho mọi lớp đều là luật mà câu chuyện <code>sshd</code> đã dạy: file cấu hình nói bạn <em>định</em> làm gì; chỉ có một lệnh đọc trạng thái <em>đang hiệu lực</em>, hoặc một lần thử thật từ bên ngoài, mới nói điều gì là thật.</p>

<h3>Nhiều lớp, lớp nào cũng có bằng chứng riêng</h3>
${slide('lx-14', 22, 'Bảo mật nhiều lớp')}
<p>"Phòng thủ nhiều lớp" (defence in depth) nghĩa là không lớp nào phải hoàn hảo: một mật khẩu bị lộ vô dụng khi SSH chỉ nhận khoá; một ứng dụng web có lỗ hổng không đọc được <code>/etc/shadow</code> khi SELinux nhốt nó; một người dùng có được shell vẫn không thành root khi sudo hẹp. Từ ngoài vào trong: tường lửa, SSH, fail2ban, sudo, kiểm soát truy cập bắt buộc, rồi tới dấu vết kiểm toán và cập nhật để báo cho bạn khi có gì đó lọt qua. Với mỗi lớp, bài này đưa bạn lệnh <em>kiểm chứng</em> nó chứ không phải file <em>cấu hình</em> nó — <code>nft list ruleset</code> cộng một kết nối từ máy khác, <code>sshd -T</code>, <code>fail2ban-regex</code>, <code>sudo -l</code> và một lần thử leo quyền thật, <code>ls -Z</code>, <code>lynis</code>.</p>

<h3>SSH: khoá ed25519, và sshd -T với một trình khách giả định</h3>
${slide('lx-14', 23, 'SSH: ed25519 và sshd -T')}
<p>Nếu bạn vẫn tạo khoá RSA theo thói quen, hãy so (trên Mac, OpenSSH_10.3p1):</p>
<pre><code>time ssh-keygen -q -t ed25519 -a 100 -C "an@laptop" -f k_ed -N ''
time ssh-keygen -q -t rsa -b 4096 -C "an@laptop" -f k_rsa -N ''
wc -c k_ed.pub k_rsa.pub
ssh-keygen -lf k_ed.pub</code></pre>
<div class="out">ssh-keygen … 0.00s user 0.01s system 65% cpu 0.013 total
ssh-keygen … 0.90s user 0.01s system 95% cpu 0.954 total
      91 k_ed.pub
     735 k_rsa.pub
256 SHA256:pLC+2JcSU63uge/9CIKkNASIuMiLX9uIZyYSukdrSEs an@laptop (ED25519)</div>
<p>Khoá Ed25519 được tạo nhanh hơn khoảng 70 lần, nửa công khai của nó chỉ 91 byte thay vì 735 (một dòng ngắn trong <code>authorized_keys</code>), và đó là loại mà OpenSSH hiện nay ưu tiên. <code>-N ''</code> chỉ để làm mẫu: khoá bí mật thật nên có mật khẩu (passphrase), mở khoá một lần mỗi phiên bằng <code>ssh-agent</code> (Bài 9.3). <code>-a 100</code> đặt số vòng dẫn xuất khoá bảo vệ mật khẩu đó — nó làm chậm kẻ đoán mật khẩu, và chẳng làm gì khi không có mật khẩu.</p>
<p>Trên máy chủ, luật của Bài 11.3 vẫn giữ nguyên: đừng tin file, hãy hỏi <code>sshd -T</code>. Có hai điều bổ sung quan trọng với máy chủ của nhóm. <code>AllowGroups</code> giới hạn ai được đăng nhập, còn khối <code>Match</code> cho một số người dùng luật khác — ở đây là nhóm <code>sftp-only</code> chỉ được chuyển file, không được shell, không được mở đường hầm. <code>sshd -T</code> trần bỏ qua <code>Match</code>; <code>-C</code> mô tả một kết nối giả định để bạn thấy <em>người đó</em> sẽ nhận được gì:</p>
<pre><code>cat /etc/ssh/sshd_config.d/01-cung.conf
sshd -t &amp;&amp; echo "sshd -t: OK"
sshd -T | grep -E "^(passwordauthentication|permitrootlogin|allowgroups|maxauthtries|logingracetime|x11forwarding) "
sshd -T -C user=ban,host=x,addr=10.0.0.5 | grep -E "^(forcecommand|allowtcpforwarding) "</code></pre>
<div class="out">PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin no
AllowGroups ssh-users
MaxAuthTries 3
LoginGraceTime 20
X11Forwarding no
Match Group sftp-only
    ForceCommand internal-sftp
    AllowTcpForwarding no
sshd -t: OK
logingracetime 20
maxauthtries 3
permitrootlogin no
passwordauthentication no
x11forwarding no
allowgroups ssh-users
allowtcpforwarding no
forcecommand internal-sftp</div>
<p>Một chi tiết từ phép đo: trước khi người dùng <code>ban</code> tồn tại, cùng câu hỏi <code>-C</code> đó in ra <code>forcecommand none</code> — <code>Match Group</code> phải tra người dùng, mà người không tồn tại thì chẳng thuộc nhóm nào. Hãy thử bằng tài khoản thật.</p>
<table>
<tr><th>Chỉ thị</th><th>Nghĩa</th><th>Giá trị hợp lý</th></tr>
<tr><td><code>PasswordAuthentication</code> · <code>KbdInteractiveAuthentication</code></td><td>Đăng nhập bằng mật khẩu (cả hai lối)</td><td><code>no</code>, <code>no</code></td></tr>
<tr><td><code>PermitRootLogin</code></td><td>Đăng nhập thẳng bằng root</td><td><code>no</code> (hoặc <code>prohibit-password</code>)</td></tr>
<tr><td><code>AllowGroups</code> · <code>AllowUsers</code></td><td>Danh sách trắng; ai khác đều bị từ chối</td><td>một nhóm có bạn trong đó</td></tr>
<tr><td><code>MaxAuthTries</code> · <code>LoginGraceTime</code></td><td>Số lần thử mỗi kết nối · số giây để đăng nhập xong</td><td><code>3</code> · <code>20</code></td></tr>
<tr><td><code>X11Forwarding</code> · <code>AllowTcpForwarding</code></td><td>Chuyển tiếp đồ hoạ · đường hầm (Bài 9.3)</td><td><code>no</code> nếu không cần</td></tr>
<tr><td><code>Match Group G</code> + <code>ForceCommand internal-sftp</code></td><td>Chỉ chuyển file, không có shell</td><td>cho tài khoản chỉ để tải lên</td></tr>
</table>

<h3>nftables: một bộ luật bạn tự viết và đọc được</h3>
${slide('lx-14', 24, 'nftables tự viết')}
<p>Bài 9.5 đã đọc những luật mà <code>ufw</code> viết ra. Trên máy không có ufw — họ RHEL, container, một bộ định tuyến — bạn tự viết <code>/etc/nftables.conf</code>, và nó ngắn thôi. Một <strong>table</strong> (bảng) chứa các <strong>chain</strong> (chuỗi); một chuỗi gốc móc vào một điểm trên đường đi của gói tin (<code>input</code> cho lưu lượng đi VÀO máy này) với một <strong>policy</strong> (chính sách) mặc định; các <strong>rule</strong> (luật) được đọc từ trên xuống và phán quyết đầu tiên thắng; một <strong>set</strong> (tập) là một danh sách có tên để luật so vào, và bạn đổi nó mà không phải nạp lại gì:</p>
<pre><code>#!/usr/sbin/nft -f
flush ruleset

table inet loc {
    set chan_ip {
        type ipv4_addr
        flags timeout
    }

    chain vao {
        type filter hook input priority filter; policy drop;

        ct state established,related accept
        ct state invalid drop
        iif "lo" accept
        ip saddr @chan_ip counter drop
        meta l4proto icmp accept
        tcp dport 22 ct state new limit rate 10/minute accept
        tcp dport { 80, 443, 19141 } accept
        counter comment "roi xuong day = bi chan"
    }
}</code></pre>
<p>Đọc từng dòng. <code>inet</code> = một bảng cho cả IPv4 lẫn IPv6. <code>policy drop</code> = thứ gì không được chấp nhận rõ ràng thì bị vứt. <code>ct state established,related accept</code> = gói trả lời cho các kết nối mà máy này mở ra (và phần còn lại của những kết nối đã được chấp nhận) được qua — thiếu dòng này, <code>apt</code> và <code>curl</code> hỏng ngay khi bạn đặt <code>policy drop</code>. <code>iif "lo"</code> = lưu lượng nội bộ. Tập <code>chan_ip</code> là danh sách cấm có hạn dùng. SSH được nhận nhưng kết nối mới bị giới hạn tần suất. Luật cuối chỉ <em>đếm</em> những gì rơi xuống tới policy — một phép chẩn đoán miễn phí. Kiểm cú pháp mà chưa áp dụng, áp dụng, rồi thử từ một máy <em>khác</em> (container thứ hai, 172.17.0.8):</p>
<pre><code>nft -c -f /etc/nftables.conf &amp;&amp; echo "cu phap OK"
nft -f /etc/nftables.conf
<span class="tok-comment"># từ 172.17.0.8:</span>
curl -s -o /dev/null -m 3 -w "cong 19141: %{http_code}\\n" http://172.17.0.5:19141/
curl -s -o /dev/null -m 3 -w "cong 19142: %{http_code}\\n" http://172.17.0.5:19142/ || echo "cong 19142: curl exit $?"
nft list chain inet loc vao | grep counter</code></pre>
<div class="out">cu phap OK
cong 19141: 200
cong 19142: 000
cong 19142: curl exit 28
		ip saddr @chan_ip counter packets 0 bytes 0 drop
		counter packets 3 bytes 180 comment "roi xuong day = bi chan"</div>
<p>Cổng 19141 trả 200; cổng 19142 — cũng có server đang nghe ở đó — thì hết giờ (curl exit 28), vì một gói bị vứt không nhận được trả lời nào cả. Bộ đếm cuối ghi lại đúng 3 gói SYN mà curl đã thử. Giờ cấm trình khách đó mười phút bằng cách thêm nó vào tập, không cần nạp lại:</p>
<pre><code>nft add element inet loc chan_ip { 172.17.0.8 timeout 10m }
nft list set inet loc chan_ip | grep elements
<span class="tok-comment"># lại từ 172.17.0.8: giờ cả cổng 19141 cũng hết giờ</span>
nft list chain inet loc vao | grep chan_ip
nft delete element inet loc chan_ip { 172.17.0.8 }</code></pre>
<div class="out">		elements = { 172.17.0.8 timeout 10m expires 9m59s999ms }
cong 19141: 000
cong 19141: curl exit 28
		ip saddr @chan_ip counter packets 3 bytes 180 drop</div>
<p>Đó chính xác là cách hành động nftables của fail2ban làm việc, như bạn sẽ thấy ngay dưới đây. Hai điểm cuối. Luật nạp bằng <code>nft -f</code> sống trong nhân tới lần khởi động lại; muốn nạp file lúc khởi động thì <code>systemctl enable nftables</code> (unit của nó chạy <code>ExecStart=/usr/sbin/nft -f /etc/nftables.conf</code>, và mặc định nó <code>disabled</code> trên Ubuntu này). Và khi thử nghiệm trên một máy ở xa, hãy đặt lưới an toàn trước — <code>(sleep 300; nft flush ruleset) &amp;</code> — để một luật lỡ khoá bạn ở ngoài sẽ tự gỡ sau năm phút.</p>
<table>
<tr><th>Lệnh</th><th>Nghĩa</th></tr>
<tr><td><code>nft -c -f FILE</code></td><td>Chỉ kiểm cú pháp (<code>-c</code> = check)</td></tr>
<tr><td><code>nft -f FILE</code></td><td>Nạp một file (có <code>flush ruleset</code> ở đầu: thay tất cả một cách nguyên tử)</td></tr>
<tr><td><code>nft list ruleset</code> · <code>nft list chain inet T C</code></td><td>Xem tất cả · một chuỗi, kèm bộ đếm</td></tr>
<tr><td><code>nft -a list chain …</code> · <code>nft delete rule inet T C handle N</code></td><td>Hiện số handle của luật · xoá một luật</td></tr>
<tr><td><code>nft add element inet T S { IP timeout 1h }</code></td><td>Thêm vào tập, có hạn dùng</td></tr>
<tr><td><code>nft flush ruleset</code></td><td>Xoá MỌI luật (mọi thứ lại được cho qua)</td></tr>
</table>

<h3>fail2ban cho log của chính ứng dụng</h3>
${slide('lx-14', 25, 'fail2ban cho log của app')}
<p>Bài 11.3 bật jail <code>sshd</code> làm sẵn của fail2ban. Sức mạnh thật của nó là một jail chỉ gồm <em>một file log + một biểu thức chính quy + một hành động cấm</em>, nên nó bảo vệ được cả trang đăng nhập của bạn. Giả sử API đặt lịch ghi lần đăng nhập hỏng như <code>2026-09-28 16:30:02 WARN LOGIN FAIL user=admin ip=203.0.113.7</code>. Một bộ lọc mô tả dòng đó, với <code>&lt;HOST&gt;</code> ở chỗ địa chỉ IP:</p>
<pre><code><span class="tok-comment"># /etc/fail2ban/filter.d/app-login.conf</span>
[Definition]
failregex = ^.* LOGIN FAIL user=\\S+ ip=&lt;HOST&gt;$
ignoreregex =</code></pre>
<p>Thử bộ lọc trên các dòng mẫu <em>trước khi</em> bật bất cứ thứ gì — đây là bước biến "fail2ban chẳng làm gì cả" từ một bí ẩn thành một phép kiểm hai giây:</p>
<pre><code>fail2ban-regex /tmp/mau.log /etc/fail2ban/filter.d/app-login.conf</code></pre>
<div class="out">Failregex: 2 total
Lines: 3 lines, 0 ignored, 2 matched, 1 missed
|- Missed line(s):
|  2026-09-28 16:30:01 INFO LOGIN OK user=an ip=198.51.100.4</div>
<p>Hai lần hỏng khớp, lần đăng nhập thành công bị bỏ qua đúng như mong muốn. Rồi tới jail, trong một file <code>.local</code> (file <code>.conf</code> bị thay khi nâng cấp gói — <code>lynis</code> chỉ ra đúng chuyện này):</p>
<pre><code><span class="tok-comment"># /etc/fail2ban/jail.d/app-login.local</span>
[app-login]
enabled   = true
filter    = app-login
logpath   = /var/log/app/login.log
backend   = polling
maxretry  = 5
findtime  = 10m
bantime   = 1h
port      = 80,443
banaction = nftables-multiport</code></pre>
<pre><code>fail2ban-client reload
for i in 1 2 3 4 5 6; do echo "$(date '+%F %T') WARN LOGIN FAIL user=admin ip=203.0.113.7" &gt;&gt; /var/log/app/login.log; done
fail2ban-client status app-login
nft list ruleset | sed -n '/f2b/,$p'</code></pre>
<div class="out">Status for the jail: app-login
|- Filter
|  |- Currently failed:	1
|  |- Total failed:	6
|  &#96;- File list:	/var/log/app/login.log
&#96;- Actions
   |- Currently banned:	1
   |- Total banned:	1
   &#96;- Banned IP list:	203.0.113.7
table inet f2b-table {
	set addr-set-app-login {
		type ipv4_addr
		elements = { 203.0.113.7 }
	}

	chain f2b-chain {
		type filter hook input priority filter - 1; policy accept;
		tcp dport { 80, 443 } ip saddr @addr-set-app-login reject with icmp port-unreachable
	}
}</div>
<p>Sáu lần hỏng, một lệnh cấm, và bên dưới đúng khuôn mẫu của mục trước: một bảng riêng, một tập địa chỉ bị cấm, một luật từ chối chúng chỉ ở cổng 80 và 443. <code>fail2ban-client set app-login unbanip 203.0.113.7</code> gỡ cấm. Nếu đứng sau một reverse proxy (nginx, Cloudflare), hãy chắc chắn ứng dụng ghi IP của <em>trình khách</em>, không phải IP của proxy — không thì lệnh cấm đầu tiên chặn luôn tất cả mọi người.</p>

<h3>SELinux: nhãn quyết định, không phải rwx</h3>
${slide('lx-14', 26, 'SELinux: nhãn')}
<p>Mọi thứ cho tới giờ là kiểm soát truy cập <em>tuỳ ý</em> (discretionary): chủ file quyết định quyền của nó, và root làm gì cũng được. <strong>Kiểm soát truy cập bắt buộc</strong> (mandatory access control — MAC) thêm một chính sách mà ngay cả tiến trình của root cũng phải tuân. Fedora và RHEL dùng <strong>SELinux</strong> (do NSA công bố năm 2000); Ubuntu và Debian dùng <strong>AppArmor</strong>. Trên máy Fedora, chỉ đọc:</p>
<pre><code>getenforce
sestatus | head -5
ls -Z /etc/shadow /usr/sbin/sshd ~/.bashrc
ps -eZ | grep -E " (sshd|chronyd|dockerd)$"</code></pre>
<div class="out">Enforcing
SELinux status:                 enabled
SELinuxfs mount:                /sys/fs/selinux
SELinux root directory:         /etc/selinux
Loaded policy name:             targeted
Current mode:                   enforcing
       system_u:object_r:shadow_t:s0 /etc/shadow
    system_u:object_r:sshd_exec_t:s0 /usr/sbin/sshd
unconfined_u:object_r:user_home_t:s0 /home/…/.bashrc
system_u:system_r:chronyd_t:s0      866 ?        00:00:00 chronyd
system_u:system_r:sshd_t:s0-s0:c0.c1023 1041 ?   00:00:02 sshd
system_u:system_r:container_runtime_t:s0 1620 ?  01:17:08 dockerd</div>
<p>Mọi file và mọi tiến trình đều mang một nhãn <code>user:role:type:level</code>, và phần quan trọng là <strong>type</strong> (kiểu). Chính sách <code>targeted</code> nói đại ý: "một tiến trình kiểu <code>sshd_t</code> được đọc file kiểu <code>sshd_exec_t</code>, <code>ssh_home_t</code>…"; thứ gì không được cho phép thì bị từ chối — kể cả khi <code>ls -l</code> nói <code>644</code>. Một đường dẫn <em>nên</em> mang nhãn gì cũng nằm trong chính sách: <code>matchpathcon /var/www/html/index.html</code> trả lời <code>httpd_sys_content_t</code>. Cái bẫy kinh điển là khác biệt giữa <code>mv</code> và <code>cp</code>, dựng lại được mà không cần root, ngay trong thư mục nhà:</p>
<pre><code>echo a &gt; /tmp/lx14-mv.txt; echo b &gt; /tmp/lx14-cp.txt
mv /tmp/lx14-mv.txt .; cp /tmp/lx14-cp.txt .
ls -Z lx14-mv.txt lx14-cp.txt
restorecon -v lx14-mv.txt</code></pre>
<div class="out"> unconfined_u:object_r:user_tmp_t:s0 lx14-mv.txt
unconfined_u:object_r:user_home_t:s0 lx14-cp.txt
Relabeled /home/…/lxhoc-14/lx14-mv.txt from unconfined_u:object_r:user_tmp_t:s0 to unconfined_u:object_r:user_home_t:s0</div>
<p><code>cp</code> tạo một file mới, nên file mới nhận nhãn của thư mục mới. <code>mv</code> dời chính file cũ, <strong>mang theo cả nhãn</strong>. Dựng trang web trong thư mục nhà, <code>sudo mv</code> nó vào <code>/var/www/html</code>, là nginx trả 403 cho những file có quyền hoàn hảo, vì chúng vẫn mang nhãn <code>user_home_t</code>. <code>restorecon -Rv /var/www/html</code> đặt lại mọi nhãn về đúng như chính sách quy định.</p>
<p>Khi SELinux thật sự từ chối một việc, <code>setroubleshoot</code> ghi lời giải thích vào journal. Lời giải thích thật dưới đây, từ chính máy Fedora của khoá học (23/09), sinh ra từ một lần chuyển tiếp cổng ngược qua SSH tới cổng 18030:</p>
<pre><code>journalctl -t setroubleshoot --since -30d</code></pre>
<div class="out">SELinux is preventing sshd-session from name_bind access on the tcp_socket port 18030.

*****  Plugin bind_ports (92.2 confidence) suggests   ************************
If you want to allow sshd-session to bind to network port 18030
Then you need to modify the port type.
Do
# semanage port -a -t ssh_port_t -p tcp 18030

*****  Plugin catchall (1.41 confidence) suggests   **************************
…
# ausearch -c 'sshd-session' --raw | audit2allow -M my-sshdsession
# semodule -X 300 -i my-sshdsession.pp</div>
<p>Đây là bản sao phía Fedora của câu chuyện "thêm Port 993 mà không có tác dụng" của dự án: cấu hình SSH đúng mà vẫn hỏng, vì một tầng nằm bên dưới. Các gợi ý được xếp hạng. Gợi ý 92,2% là cách sửa chính xác: báo cho chính sách biết cổng 18030 là một cổng SSH. Gợi ý "vét" 1,41% — sinh một module từ bất cứ thứ gì đã bị từ chối bằng <code>audit2allow</code> rồi nạp vào — cho phép đúng thao tác bị chặn và mọi thứ khác nằm trong log đó, và chỉ nên là phương án cuối cùng sau khi đã đọc nó cấp những gì. Lý do đằng sau một lần từ chối nằm trong <code>sudo ausearch -m AVC -ts recent | audit2why</code>, còn những công tắc bật/tắt cho nhu cầu phổ biến là các boolean: <code>getsebool httpd_can_network_connect</code> in ra <code>off</code> trên máy này — lý do một nginx làm reverse proxy trên Fedora trả 502 cho tới khi có người chạy <code>sudo setsebool -P httpd_can_network_connect on</code>. Điều không bao giờ nên làm là <code>setenforce 0</code> "để thử" rồi quên luôn.</p>
<p><strong>AppArmor</strong> (Ubuntu) đi đường khác: thay vì dán nhãn cho mọi file, nó cho mỗi chương trình bị nhốt một <em>hồ sơ</em> (profile) liệt kê những đường dẫn được dùng, nằm trong <code>/etc/apparmor.d/</code>. Bài 4.5 đã cho thấy dòng từ chối của nó (<code>apparmor="DENIED" … profile="/usr/sbin/mysqld"</code>) trong <code>dmesg</code>. Các lệnh: <code>sudo aa-status</code> (hồ sơ nào đang nạp, ở chế độ enforce hay complain), <code>sudo aa-complain HỒ_SƠ</code> (ghi log thay vì chặn, trong lúc bạn tìm xem còn thiếu gì), <code>sudo aa-enforce HỒ_SƠ</code>. Trong container Docker Desktop của ta, <code>aa-status</code> chỉ in ra <code>apparmor not present.</code> — nhân của máy ảo không có AppArmor — nên hãy tập nó trên một máy ảo hoặc VPS Ubuntu thật.</p>

<h3>sudo "hẹp" mà không hẹp</h3>
${slide('lx-14', 27, 'sudoers hẹp mà vẫn thành root')}
<p>Bài 4.4 đã viết một luật sudoers hẹp. Cái bẫy là rất nhiều chương trình bình thường chạy được chương trình khác — và thứ chúng chạy thừa hưởng quyền root. Hai luật trông vô hại, thử với người dùng thường <code>an</code> trong container:</p>
<pre><code><span class="tok-comment"># /etc/sudoers.d/an — SAI</span>
an ALL=(root) NOPASSWD: /usr/bin/find
an ALL=(root) NOPASSWD: /usr/bin/less /var/log/*</code></pre>
<pre><code>sudo -l | tail -2
sudo find /tmp -maxdepth 0 -exec /bin/sh -c "id" \\;
sudo less /var/log/../../etc/shadow | head -2</code></pre>
<div class="out">    (root) NOPASSWD: /usr/bin/find
    (root) NOPASSWD: /usr/bin/less /var/log/*
uid=0(root) gid=0(root) groups=0(root)
root:*:20707:0:99999:7:::
daemon:*:20707:0:99999:7:::</div>
<p><code>find -exec</code> chạy bất kỳ lệnh nào với quyền root. Còn trong sudoers, <code>*</code> khớp <em>mọi ký tự, kể cả <code>/</code> và <code>..</code></em>, nên <code>/var/log/*</code> khớp luôn <code>/var/log/../../etc/shadow</code> (và <code>less</code> còn mở được shell bằng <code>!sh</code>). Dự án GTFOBins liệt kê hàng trăm chương trình có lối thoát kiểu này: trình soạn thảo, trình xem trang, <code>tar</code>, <code>awk</code>, <code>git</code>, <code>docker</code>… Cách sửa, đã kiểm:</p>
<pre><code><span class="tok-comment"># /etc/sudoers.d/an — TỐT HƠN</span>
Cmnd_Alias APP_CMDS = /usr/bin/systemctl restart nang.service, /usr/bin/journalctl -u nang.service *
an ALL=(root) NOPASSWD: APP_CMDS
an ALL=(root) NOPASSWD: NOEXEC: /usr/bin/find
an ALL=(root) sudoedit /etc/nang/app.env</code></pre>
<pre><code>visudo -c -q &amp;&amp; echo "visudo OK"
sudo find /tmp -maxdepth 0 -exec /bin/sh -c id \\;
sudo -n systemctl stop nang.service</code></pre>
<div class="out">visudo OK
find: ‘/bin/sh’: Permission denied
sudo: a password is required</div>
<p><strong>Viết đủ cả dòng lệnh</strong> trong một <code>Cmnd_Alias</code>: "khởi động lại đúng dịch vụ này", không phải "systemctl gì cũng được". <code>NOEXEC:</code> chặn chương trình được phép khởi động chương trình khác (nó làm việc qua một thư viện nạp trước, nên có tác dụng với chương trình liên kết động, không với chương trình liên kết tĩnh — tốt nhất là đừng cấp những chương trình như thế). <strong><code>sudoedit</code></strong> cho người dùng sửa một file của root bằng trình soạn thảo <em>của chính họ</em>, chạy với quyền của chính họ, thay vì cấp <code>sudo vim</code> — thứ thật ra là một shell root đi đường vòng. <code>stop</code> không có trong danh sách, nên sudo đòi mật khẩu (<code>-n</code> = không bao giờ hỏi). Xem quyền của bất kỳ ai bằng <code>sudo -l -U an</code>, và kiểm cú pháp bằng <code>visudo -c</code> trước khi đăng xuất.</p>

<h3>Dấu vết kiểm toán, một điểm số, và cập nhật tự áp dụng</h3>
${slide('lx-14', 28, 'lynis và auditd')}
<p><strong>lynis</strong> (của CISOfy, gói <code>lynis</code>) chạy vài trăm phép kiểm rồi in ra một chỉ số cứng hoá (hardening index) kèm các gợi ý, mỗi gợi ý có mã phép kiểm:</p>
<pre><code>lynis audit system --quick --no-colors</code></pre>
<div class="out">  Hardening index : 64 [############        ]
  Tests performed : 238
  ! Found one or more vulnerable packages. [PKGS-7392]
  * Install needrestart, alternatively to debian-goodies, … [DEB-0831]
  * Copy /etc/fail2ban/jail.conf to jail.local to prevent it being changed by updates. [DEB-0880]
  * Default umask in /etc/login.defs could be more strict like 027 [AUTH-9328]
  * Enable sysstat to collect accounting (disabled) [ACCT-9626]
  * Enable auditd to collect audit information [ACCT-9628]
  …</div>
<p>Hai cảnh báo và bốn mươi gợi ý trên một container mới tinh. Dùng chỉ số để so <em>cùng một</em> máy trước và sau khi bạn thay đổi, và đọc từng gợi ý một cách tỉnh táo: <code>lynis show details ACCT-9626</code> giải thích phép kiểm, và phép này SAI trên Ubuntu 24.04 — nó đọc <code>ENABLED="false"</code> trong <code>/etc/default/sysstat</code> trong khi timer systemd vẫn ghi lịch sử mười phút một lần (Bài 14.2). Vài gợi ý (phân vùng riêng cho <code>/tmp</code> và <code>/var</code>) là việc của lúc cài máy, không phải của một VPS đang chạy.</p>
<p><strong>auditd</strong> ghi lại các sự kiện liên quan bảo mật ngay trong nhân — ai đã sửa <code>/etc/sudoers</code>, ai đã chạy gì bằng root — vào <code>/var/log/audit/audit.log</code>, nơi mà ngay cả lịch sử shell của root cũng không che được. Luật nằm trong <code>/etc/audit/rules.d/*.rules</code>:</p>
<pre><code>-w /etc/sudoers -p wa -k sudoers            <span class="tok-comment"># canh: ghi hoặc đổi thuộc tính</span>
-w /etc/sudoers.d/ -p wa -k sudoers
-w /etc/ssh/sshd_config.d/ -p wa -k sshd</code></pre>
<p>Nạp chúng bằng <code>sudo augenrules --load</code>; đọc dấu vết bằng <code>sudo ausearch -k sudoers -i</code> (<code>-i</code> đổi mã số thành tên) và tổng kết bằng <code>sudo aureport --auth --summary</code>. Nói thật cho đủ: phần này KHÔNG chạy được ở đây. Trong container, <code>auditctl -w /etc/sudoers -p wa -k sudoers</code> trả lời <code>Error sending add rule data request (Operation not permitted)</code>: nhân chỉ có một hệ thống audit và nó không chia theo namespace, nên container không cấu hình được. Hãy thử trên một máy ảo hoặc VPS của bạn.</p>
<p>Cuối cùng, cập nhật. Bài 11.3 đã dựng <code>unattended-upgrades</code> trên Ubuntu. Trên Fedora 44 (dnf5), thứ tương đương là gói riêng <code>dnf5-plugin-automatic</code> — máy thử chưa cài — cung cấp <code>/etc/dnf/automatic.conf</code> (đặt <code>apply_updates = yes</code>) và một <code>dnf5-automatic.timer</code> để bật.</p>

<h3>Chạy thử từng bước: gia cố và kiểm chứng một container</h3>
<ol>
<li><code>docker run -d --privileged --name lab-sec ubuntu:24.04 sleep infinity</code>; bên trong, <code>apt-get install -y nftables fail2ban openssh-server sudo lynis python3 curl</code>.</li>
<li>Chạy <code>lynis audit system --quick</code> và ghi lại chỉ số cứng hoá.</li>
<li>Viết <code>/etc/nftables.conf</code> như trên, <code>nft -c -f</code>, <code>nft -f</code>; từ container thứ hai xác nhận một cổng trả lời và một cổng hết giờ; đọc bộ đếm.</li>
<li>Tạo <code>01-cung.conf</code> cho sshd, thêm chính bạn vào <code>ssh-users</code>, kiểm <code>sshd -T</code> và <code>sshd -T -C user=…</code>.</li>
<li>Thêm luật sudoers cho <code>find</code>, leo quyền bằng <code>-exec</code>, rồi sửa và chứng minh lần leo quyền thất bại.</li>
<li>Chạy lại <code>lynis</code>, so chỉ số, rồi <code>docker rm -f lab-sec</code>.</li>
</ol>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Lớp</th><th>Linux</th><th>macOS 27 (đo thật)</th><th>WSL2</th></tr>
<tr><td>Tường lửa</td><td>nftables (ufw/firewalld ở trên)</td><td>Application Firewall (<code>socketfilterfw --getglobalstate</code> → <code>Firewall is enabled. (State = 1)</code>) và <code>pfctl</code></td><td>tường lửa Windows lọc lưu lượng vào WSL; nftables bên trong distro cũng chạy</td></tr>
<tr><td>MAC</td><td>SELinux / AppArmor</td><td>SIP (<code>csrutil status</code> → <code>enabled</code>) và sandbox của ứng dụng</td><td>mặc định không có</td></tr>
<tr><td>Khoá SSH</td><td><code>ssh-keygen -t ed25519</code></td><td>y hệt; mật khẩu của khoá có thể giữ trong Keychain</td><td>y hệt</td></tr>
<tr><td>Luật sudo</td><td><code>/etc/sudoers.d</code></td><td>cùng định dạng file, cùng <code>visudo</code></td><td>như Linux</td></tr>
</table>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> máy chủ demo SWP391 của bạn cùng nhóm cho đăng nhập SSH bằng mật khẩu, không có tường lửa, và có dòng sudoers <code>dev ALL=(root) NOPASSWD: /usr/bin/vim /etc/nginx/*</code> "để bạn ấy sửa cấu hình nginx". Bạn có 20 phút trước khi giảng viên kết nối vào. Làm trong một container đặc quyền dùng xong vứt.</p><ol>
<li>Chứng minh dòng sudoers đó là một shell root: với tư cách <code>dev</code>, làm cho <code>id</code> in ra <code>uid=0</code> (gợi ý: <code>:!</code> của vim, hoặc mẹo <code>*</code> + <code>..</code>).</li>
<li>Thay nó bằng <code>sudoedit /etc/nginx/sites-available/app</code> và chứng minh <code>dev</code> vẫn sửa được file đó nhưng không lên root được nữa.</li>
<li>Viết một bộ luật nftables chỉ cho qua 22, 80, 443, với SSH bị giới hạn tần suất; thử một cổng được phép và một cổng bị chặn từ container thứ hai.</li>
<li>Thêm một jail fail2ban cho một file log ứng dụng giả và làm cho <code>fail2ban-client status</code> hiện một IP bị cấm.</li>
<li>So chỉ số cứng hoá của <code>lynis</code> trước và sau.</li></ol>
<p><strong>Đạt khi:</strong> lần leo quyền thành công trước và thất bại sau; <code>nft -c</code> im lặng và cổng bị chặn cho curl exit 28; jail liệt kê một IP bị cấm và <code>nft list ruleset</code> cho thấy nó nằm trong một tập; chỉ số lynis tăng lên.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Defence in depth (phòng thủ nhiều lớp)</span><span class="v">Nhiều lớp độc lập, để một lớp hỏng chưa thành một vụ xâm nhập.</span></div>
  <div class="kv"><span class="k">Ruleset / chain / hook / policy (bộ luật / chuỗi / móc / chính sách)</span><span class="v">Cấu trúc của nftables: bảng chứa chuỗi gắn vào các điểm trên đường đi gói tin, kèm một phán quyết mặc định.</span></div>
  <div class="kv"><span class="k">Connection tracking — ct state (theo dõi kết nối)</span><span class="v">Nhân nhớ các kết nối để gói trả lời được cho qua là "established".</span></div>
  <div class="kv"><span class="k">Jail / filter (buồng giam / bộ lọc)</span><span class="v">Đơn vị của fail2ban: một log, một biểu thức chính quy cho lần hỏng, và một hành động cấm.</span></div>
  <div class="kv"><span class="k">Mandatory access control — MAC (kiểm soát truy cập bắt buộc)</span><span class="v">Chính sách toàn hệ thống mà ngay cả tiến trình của root cũng phải tuân (SELinux, AppArmor).</span></div>
  <div class="kv"><span class="k">SELinux label / type (nhãn / kiểu)</span><span class="v"><code>user:role:type:level</code> trên mọi file và tiến trình; kiểu quyết định quyền truy cập.</span></div>
  <div class="kv"><span class="k">Privilege escalation (leo thang đặc quyền)</span><span class="v">Biến quyền hạn chế thành quyền lớn hơn (thường là root), ví dụ qua một chương trình chạy được chương trình khác.</span></div>
  <div class="kv"><span class="k">Audit trail (dấu vết kiểm toán)</span><span class="v">Bản ghi khó xoá về ai đã làm gì, do auditd giữ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Lớp nào cũng cần một bằng chứng đọc trạng thái đang hiệu lực: <code>nft list ruleset</code> + thử từ ngoài, <code>sshd -T -C</code>, <code>fail2ban-regex</code>, <code>sudo -l</code>, <code>ls -Z</code>, <code>lynis</code>.</li>
<li>Khoá Ed25519 có mật khẩu; <code>AllowGroups</code> và khối <code>Match</code>, kiểm cho từng người cụ thể bằng <code>sshd -T -C user=…</code>.</li>
<li>Một bộ luật nftables dễ đọc chỉ chừng chục dòng: <code>policy drop</code>, <code>ct state established</code>, SSH có hạn mức, tập để cấm; <code>nft -c</code> trước, <code>systemctl enable nftables</code> để giữ qua reboot.</li>
<li>fail2ban canh được mọi log: bộ lọc có <code>&lt;HOST&gt;</code>, thử bằng <code>fail2ban-regex</code>, jail trong file <code>.local</code>.</li>
<li>SELinux quyết định theo kiểu của nhãn: <code>mv</code> giữ nhãn, <code>restorecon</code> sửa nhãn, đọc lời khuyên có xếp hạng của setroubleshoot, đừng bao giờ để nguyên <code>setenforce 0</code>.</li>
<li>sudo: đủ dòng lệnh, không ký tự đại diện, <code>NOEXEC</code>, <code>sudoedit</code>; tra chương trình trên GTFOBins.</li>
</ul>

<a class="link-card" href="https://wiki.nftables.org/wiki-nftables/index.php/Main_Page" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">nftables wiki</span><span class="lc-sub">Tài liệu chính thức: bảng, chuỗi, tập, verdict map và bảng tra nhanh cú pháp <code>nft</code>.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man5/sshd_config.5.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">sshd_config(5)</span><span class="lc-sub">Mọi chỉ thị trong bài, gồm cả <code>Match</code>, <code>AllowGroups</code> và <code>ForceCommand</code>.</span></span>
</a>
<a class="link-card" href="https://github.com/fail2ban/fail2ban" target="_blank" rel="noopener">
  <span class="lc-ico">🚫</span>
  <span class="lc-body"><span class="lc-title">fail2ban</span><span class="lc-sub">Mã nguồn, các bộ lọc và hành động đi kèm — đọc <code>filter.d/</code> để tự viết cái của bạn.</span></span>
</a>
<a class="link-card" href="https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/using_selinux/index" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">Using SELinux — tài liệu Red Hat</span><span class="lc-sub">Nhãn, boolean, <code>semanage</code>, gỡ rối lần từ chối bằng <code>audit2why</code>.</span></span>
</a>
<a class="link-card" href="https://documentation.ubuntu.com/server/how-to/security/apparmor/" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">AppArmor — tài liệu Ubuntu Server</span><span class="lc-sub">Hồ sơ, chế độ enforce và complain, và bộ công cụ <code>aa-*</code>.</span></span>
</a>
<a class="link-card" href="https://gtfobins.github.io/" target="_blank" rel="noopener">
  <span class="lc-ico">⚠️</span>
  <span class="lc-body"><span class="lc-title">GTFOBins</span><span class="lc-sub">Những chương trình thoát ra shell hoặc đọc được file khi được cấp sudo — tra trước khi cấp.</span></span>
</a>
<a class="link-card" href="https://cisofy.com/lynis/" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">Lynis — CISOfy</span><span class="lc-sub">Công cụ kiểm toán dùng trong bài: nó kiểm những gì và đọc báo cáo thế nào.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>Tự khoá mình ở ngoài là thất bại gia cố phổ biến nhất.</strong> <code>AllowGroups ssh-users</code> mà quên thêm chính mình vào nhóm, <code>policy drop</code> đặt trước luật SSH, gõ sai <code>sshd_config</code> rồi khởi động lại — mỗi cái đều là cưa cành mình đang ngồi. Giữ một phiên đang mở, áp thay đổi từ phiên thứ hai, thử đăng nhập mới từ phiên thứ ba, và với tường lửa thì đặt lịch tự gỡ (<code>(sleep 300; nft flush ruleset) &amp;</code>) trước khi nạp luật mới.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> File cấu hình là ý định; <code>sshd -T</code>, <code>nft list ruleset</code>, <code>ls -Z</code> và một lần thử thật mới là bằng chứng. Cấp ít nhất có thể: một dòng lệnh trong sudo, một cổng trong tường lửa, một capability thay cho root. Và đọc lời khuyên của công cụ trước khi làm theo — cả thứ hạng của setroubleshoot lẫn gợi ý của lynis đều có thể sai với cái máy của bạn.</p>
</div>
`,
    },
    /* ─────────────────────────── 14.5 ─────────────────────────── */
    {
      title: '14.5 — Quiz: Linux in depth|||14.5 — Kiểm tra: Linux chuyên sâu',
      slug: 'lnx-14-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống: đếm syscall của một vòng lặp ghi file, policy drop làm apt treo, exit 137 và memory.events, nr_throttled, một lõi kịch trần, vmstat r và PSI, lvextend thiếu -r, fstab thiếu nofail, sudoers có dấu *, và SELinux sau khi mv.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from real machines — a script that is slow for no visible reason, a container that keeps dying with 137, a disk that "grew" without growing, a sudo rule that was supposed to be harmless. Every answer about output was run for real on Ubuntu 24.04 (or Fedora 44 for SELinux). Aim for 8/10; each explanation says why the tempting wrong answer is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can count a program's system calls with <code>strace -c</code> and explain why many small writes are slow.</li>
<li>I can build a namespace with <code>unshare</code>, enter one with <code>nsenter</code>, and set a cgroup limit and read <code>memory.events</code>.</li>
<li>I can walk the USE table with <code>mpstat -P ALL</code>, <code>pidstat</code>, <code>vmstat</code>, PSI, <code>iostat -x</code> and <code>sar</code>, and profile a function with <code>perf</code>.</li>
<li>I can partition a loop-file disk, put it in fstab by UUID with <code>nofail</code>, and grow an LVM volume online with <code>lvextend -r</code>.</li>
<li>I can write an nftables ruleset and a fail2ban jail and prove both from another machine.</li>
<li>I can read an SELinux label, fix it with <code>restorecon</code>, and spot a sudoers rule that hands out root.</li>
</ul>
${slide('lx-14', 30, 'Bảng tra nhanh Chương 14 (1/2)')}
${slide('lx-14', 31, 'Bảng tra nhanh Chương 14 (2/2)')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống lấy từ máy thật — một script chậm mà không thấy lý do, một container cứ chết với mã 137, một ổ đĩa "đã nới" mà không lớn thêm, một luật sudo tưởng là vô hại. Mọi đáp án về output đều đã chạy thật trên Ubuntu 24.04 (hoặc Fedora 44 với phần SELinux). Nhắm 8/10; mỗi lời giải thích nói vì sao phương án hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đếm được syscall của một chương trình bằng <code>strace -c</code> và giải thích được vì sao nhiều lần ghi nhỏ lại chậm.</li>
<li>Tôi tạo được namespace bằng <code>unshare</code>, bước vào bằng <code>nsenter</code>, đặt được giới hạn cgroup và đọc <code>memory.events</code>.</li>
<li>Tôi đi hết bảng USE bằng <code>mpstat -P ALL</code>, <code>pidstat</code>, <code>vmstat</code>, PSI, <code>iostat -x</code> và <code>sar</code>, và đo được một hàm bằng <code>perf</code>.</li>
<li>Tôi chia phân vùng được trên một đĩa-file, ghi nó vào fstab bằng UUID kèm <code>nofail</code>, và nới một ổ LVM khi đang chạy bằng <code>lvextend -r</code>.</li>
<li>Tôi viết được một bộ luật nftables và một jail fail2ban, rồi chứng minh cả hai từ một máy khác.</li>
<li>Tôi đọc được nhãn SELinux, sửa nó bằng <code>restorecon</code>, và nhận ra một luật sudoers đang trao quyền root.</li>
</ul>
${slide('lx-14', 30, 'Bảng tra nhanh Chương 14 (1/2)')}
${slide('lx-14', 31, 'Bảng tra nhanh Chương 14 (2/2)')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'A script runs for i in $(seq 100000); do echo "$i" >> out.txt; done and is slow. strace -f -c shows about 100,000 openat, 100,000 write and 200,000 close calls. Which rewrite makes the FEWEST system calls?|||Một script chạy for i in $(seq 100000); do echo "$i" >> out.txt; done và chậm. strace -f -c cho thấy khoảng 100.000 openat, 100.000 write và 200.000 close. Cách viết lại nào tạo ÍT system call NHẤT?',
            options: [
              'Keep the loop and add sync after done|||Giữ vòng lặp và thêm sync sau done',
              'Replace echo with printf "%s\\n" "$i" inside the same loop|||Thay echo bằng printf "%s\\n" "$i" trong cùng vòng lặp',
              'seq 100000 > out.txt',
              'Move the redirection after the loop: done > out.txt|||Dời chuyển hướng ra sau vòng lặp: done > out.txt',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Measured: seq 100000 > out.txt made 143 write calls in total, because seq buffers its output and writes 4 KiB at a time. Moving the redirection after done (the tempting answer) removes the open/close pairs but bash still writes each line separately — about 100,143 writes. printf changes nothing about the count, and sync adds calls.|||VI: Đo thật: seq 100000 > out.txt chỉ tốn tổng cộng 143 lần write, vì seq gom output vào bộ đệm và ghi mỗi lần 4 KiB. Dời chuyển hướng ra sau done (phương án hấp dẫn) bỏ được các cặp open/close nhưng bash vẫn ghi từng dòng một — khoảng 100.143 lần write. printf không đổi được số lần gọi, còn sync thì thêm lời gọi.',
          },
          {
            question: 'You load an nftables ruleset: policy drop on input, then iif "lo" accept and tcp dport { 22, 80, 443 } accept. Your SSH session still works, but apt update hangs and curl https://example.com ends with exit 28. Which line is missing?|||Bạn nạp một bộ luật nftables: policy drop ở input, rồi iif "lo" accept và tcp dport { 22, 80, 443 } accept. Phiên SSH vẫn chạy, nhưng apt update treo và curl https://example.com kết thúc với exit 28. Thiếu dòng nào?',
            options: [
              'ct state established,related accept',
              'tcp sport { 80, 443 } drop',
              'An output chain with policy drop|||Một chain output với policy drop',
              'meta l4proto icmp accept',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Replies to connections the server opens (DNS answers, the web server answering curl) arrive on the input hook with a random local port, so policy drop discards them; measured: curl exit 28 with the rule missing, 200 after nft flush ruleset. SSH still works only because your incoming port 22 is explicitly accepted. ICMP (the tempting answer) is useful but not what carries HTTP or DNS replies.|||VI: Gói trả lời cho các kết nối do máy chủ mở ra (câu trả lời DNS, web server trả lời curl) đi vào móc input tới một cổng ngẫu nhiên, nên policy drop vứt chúng; đo thật: thiếu dòng này thì curl exit 28, nft flush ruleset xong thì 200. SSH vẫn chạy chỉ vì cổng 22 đi vào được cho phép rõ ràng. ICMP (phương án hấp dẫn) có ích nhưng không phải thứ mang gói trả lời HTTP hay DNS.',
          },
          {
            question: 'A container restarts several times a day with Exited (137) and nothing in its log. Inside it, cat /sys/fs/cgroup/memory.events shows oom_kill 3. What killed it?|||Một container khởi động lại vài lần mỗi ngày với Exited (137) và log không có gì. Bên trong nó, cat /sys/fs/cgroup/memory.events cho thấy oom_kill 3. Cái gì đã giết nó?',
            options: [
              'docker stop timing out after 10 seconds and sending SIGKILL|||docker stop hết 10 giây chờ rồi gửi SIGKILL',
              'A segmentation fault in the application|||Một lỗi segmentation fault trong ứng dụng',
              'The host machine running out of RAM|||Máy chủ cạn RAM',
              'The container reaching its own cgroup memory limit (memory.max, set by --memory)|||Container chạm trần bộ nhớ cgroup của chính nó (memory.max, do --memory đặt)',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: memory.events belongs to the container’s own cgroup; oom_kill counts kills inside that group because memory.max was hit (measured: 64M limit, 200 MB allocation → exit 137, oom_kill 1). A host-wide OOM would show in journalctl -k without the group limit being the cause; docker stop also gives 137 but does not touch oom_kill; a segfault is signal 11, exit 139.|||VI: memory.events thuộc cgroup riêng của container; oom_kill đếm những lần bị giết bên trong nhóm vì chạm memory.max (đo thật: trần 64M, xin 200 MB → exit 137, oom_kill 1). OOM của cả máy sẽ hiện trong journalctl -k chứ không phải do trần của nhóm; docker stop cũng cho 137 nhưng không làm tăng oom_kill; segfault là tín hiệu 11, mã 139.',
          },
          {
            question: 'An API container is slow, yet the host shows 30% CPU. cat /sys/fs/cgroup/cpu.stat inside the container shows nr_throttled rising by hundreds per minute. What is the most likely cause?|||Một container API chạy chậm, nhưng máy chủ chỉ 30% CPU. cat /sys/fs/cgroup/cpu.stat trong container cho thấy nr_throttled tăng hàng trăm mỗi phút. Nguyên nhân khả dĩ nhất?',
            options: [
              'The disk is saturated|||Đĩa đang bão hoà',
              'Its CPU quota (cpu.max, e.g. from --cpus) is used up each period and the kernel pauses it|||Hạn mức CPU của nó (cpu.max, ví dụ do --cpus) bị tiêu hết mỗi chu kỳ và nhân tạm dừng nó',
              'Too many open files|||Mở quá nhiều file',
              'The host needs more cores|||Máy chủ cần thêm lõi',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: nr_throttled counts periods in which the group exhausted its quota and was paused (measured: cpu.max 20000/100000 gave 1.02 s of CPU in 5 s and nr_throttled 51). The host has idle CPU, so more cores (the tempting answer) would change nothing — the limit is artificial. Disk and file-descriptor problems do not increase this counter.|||VI: nr_throttled đếm số chu kỳ mà nhóm tiêu hết hạn mức và bị dừng (đo thật: cpu.max 20000/100000 cho 1,02 giây CPU trong 5 giây và nr_throttled 51). Máy chủ vẫn còn CPU rảnh, nên thêm lõi (phương án hấp dẫn) chẳng đổi được gì — cái trần là nhân tạo. Đĩa và bộ mô tả file không làm bộ đếm này tăng.',
          },
          {
            question: 'On a 10-core VPS, top says the CPU is about 90% idle, but requests are slow. mpstat -P ALL 2 1 shows all 10.26 %usr and core 5 at 100.00 %usr; pidstat shows one python3 at 100% CPU. What will moving to a 20-core VPS do?|||Trên VPS 10 lõi, top nói CPU rảnh khoảng 90%, nhưng request chậm. mpstat -P ALL 2 1 cho thấy all 10.26 %usr và lõi 5 ở 100.00 %usr; pidstat cho thấy một tiến trình python3 100% CPU. Chuyển sang VPS 20 lõi sẽ ra sao?',
            options: [
              'Twice as fast, because there are twice as many cores|||Nhanh gấp đôi, vì gấp đôi số lõi',
              'Faster, because the idle cores absorb the load|||Nhanh hơn, vì các lõi rảnh sẽ gánh bớt tải',
              'Almost nothing: the app is single-threaded and already uses one full core|||Gần như chẳng gì: ứng dụng chạy đơn luồng và đã dùng hết một lõi',
              'Slower, because of more context switches|||Chậm hơn, vì nhiều lần chuyển ngữ cảnh hơn',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: 10% "all" on 10 cores is exactly one core; -P ALL shows it at 100%. A single-threaded process cannot use a second core, so more cores do not help; you need faster code or several worker processes. "Idle cores absorb the load" is the misreading this question is about.|||VI: 10% "all" trên 10 lõi đúng bằng một lõi; -P ALL cho thấy nó ở 100%. Một tiến trình đơn luồng không dùng được lõi thứ hai, nên thêm lõi không giúp gì; bạn cần mã nhanh hơn hoặc nhiều tiến trình worker. "Các lõi rảnh sẽ gánh bớt" chính là cách đọc sai mà câu này nhắm tới.',
          },
          {
            question: 'During a burst, vmstat 1 shows r = 20 on a 10-core machine, /proc/pressure/cpu shows some avg10=31.37, and the 1-minute load average is only 1.94. What is the correct reading?|||Giữa một đợt tải, vmstat 1 cho thấy r = 20 trên máy 10 lõi, /proc/pressure/cpu cho thấy some avg10=31.37, còn load average 1 phút chỉ 1.94. Đọc thế nào mới đúng?',
            options: [
              'The CPU is saturated: about half the runnable tasks wait, and tasks were stalled 31% of the last 10 s; the load average lags behind a burst|||CPU đang bão hoà: khoảng một nửa số tác vụ sẵn sàng phải chờ, và tác vụ bị treo 31% trong 10 giây qua; load average trễ so với một đợt tải đột ngột',
              'No problem: a load of 1.94 on 10 cores is low|||Không sao: load 1.94 trên 10 lõi là thấp',
              'Memory pressure, because PSI is above zero|||Áp lực bộ nhớ, vì PSI lớn hơn 0',
              'The disk is the bottleneck, because r counts I/O waits|||Đĩa là nút thắt, vì r đếm cả việc chờ I/O',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: r counts running plus runnable tasks (blocked I/O is column b), so 20 on 10 cores means a queue. PSI’s some avg10 reacts within seconds; the load average is an exponentially damped average that barely moved three seconds into the burst — trusting it (the tempting answer) is Gregg’s averaging trap. This PSI line is from /proc/pressure/cpu, not memory.|||VI: r đếm tác vụ đang chạy cộng sẵn sàng chạy (chờ I/O là cột b), nên 20 trên 10 lõi là có hàng chờ. some avg10 của PSI phản ứng trong vài giây; load average là trung bình giảm dần theo hàm mũ, ba giây sau khi tải ập tới gần như chưa nhúc nhích — tin vào nó (phương án hấp dẫn) là cái bẫy trung bình của Gregg. Dòng PSI này lấy từ /proc/pressure/cpu, không phải bộ nhớ.',
          },
          {
            question: 'The database volume is at 100%. You run lvextend -L +10G vg_app/lv_db, it prints "successfully resized", yet df -h /srv/db still shows the old size at 100%. What now?|||Ổ của cơ sở dữ liệu đầy 100%. Bạn chạy lvextend -L +10G vg_app/lv_db, nó báo "successfully resized", vậy mà df -h /srv/db vẫn hiện cỡ cũ ở 100%. Giờ làm gì?',
            options: [
              'Reboot so the kernel re-reads the partition table|||Khởi động lại để nhân đọc lại bảng phân vùng',
              'Unmount /srv/db and remount it|||Tháo /srv/db rồi gắn lại',
              'Run vgextend to add the space to the volume group|||Chạy vgextend để thêm chỗ vào nhóm ổ',
              'Grow the filesystem too: resize2fs /dev/vg_app/lv_db (or use lvextend -r next time)|||Nới cả hệ thống file: resize2fs /dev/vg_app/lv_db (hoặc lần sau dùng lvextend -r)',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: lvextend without -r grows only the logical volume; ext4 inside still has its old size. resize2fs grows it online (measured with -r: 359M at 100% → 598M at 59% while mounted). Remounting or rebooting does not resize a filesystem, and vgextend is for when the pool itself is out of space — here the LV already grew.|||VI: lvextend thiếu -r chỉ nới ổ logic; ext4 bên trong vẫn giữ cỡ cũ. resize2fs nới nó khi đang gắn (đo thật với -r: 359M đầy 100% → 598M còn 59% trong lúc vẫn gắn). Gắn lại hay khởi động lại không nới hệ thống file, còn vgextend dành cho lúc chính cái bể hết chỗ — ở đây LV đã lớn lên rồi.',
          },
          {
            question: 'You add UUID=… /mnt/backup ext4 defaults 0 2 to /etc/fstab for an external backup disk. A month later the disk dies and the VPS is rebooted. What happens, and what would have prevented it?|||Bạn thêm UUID=… /mnt/backup ext4 defaults 0 2 vào /etc/fstab cho một đĩa sao lưu gắn ngoài. Một tháng sau đĩa hỏng và VPS được khởi động lại. Chuyện gì xảy ra, và điều gì đã ngăn được nó?',
            options: [
              'Nothing: a missing disk is skipped automatically|||Không sao: đĩa thiếu được tự động bỏ qua',
              'Boot waits for the device, then drops to emergency mode before SSH starts; nofail (and findmnt --verify before rebooting) prevents it|||Khởi động chờ thiết bị rồi rơi vào chế độ khẩn cấp trước khi SSH lên; nofail (và findmnt --verify trước khi khởi động lại) ngăn được chuyện này',
              'fsck repairs the missing disk because the last field is 2|||fsck sửa cái đĩa bị thiếu vì trường cuối là 2',
              'systemd mounts an empty tmpfs at /mnt/backup instead|||systemd gắn một tmpfs trống vào /mnt/backup thay thế',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: A filesystem in fstab without nofail is required for boot; if its device never appears, systemd times out (90 s by default) and enters emergency mode — on a VPS, before SSH. nofail makes it optional (the real Fedora line adds x-systemd.device-timeout=10), and findmnt --verify reported "unreachable on boot required source" for a bad UUID. fsck cannot repair a disk that is not there.|||VI: Một hệ thống file trong fstab mà không có nofail là bắt buộc cho việc khởi động; thiết bị không bao giờ xuất hiện thì systemd hết giờ chờ (mặc định 90 giây) và vào chế độ khẩn cấp — trên VPS là trước cả SSH. nofail biến nó thành tuỳ chọn (dòng thật trên Fedora còn thêm x-systemd.device-timeout=10), và findmnt --verify đã báo "unreachable on boot required source" cho một UUID sai. fsck không sửa được cái đĩa không hề có mặt.',
          },
          {
            question: 'sudoers contains an ALL=(root) NOPASSWD: /usr/bin/less /var/log/* "so an can read logs". What does sudo less /var/log/../../etc/shadow | head -1 print when run by an?|||sudoers có dòng an ALL=(root) NOPASSWD: /usr/bin/less /var/log/* "để an đọc log". Khi an chạy sudo less /var/log/../../etc/shadow | head -1 thì in ra gì?',
            options: [
              'The first line of /etc/shadow, e.g. root:*:20707:0:99999:7:::|||Dòng đầu của /etc/shadow, ví dụ root:*:20707:0:99999:7:::',
              'Sorry, user an is not allowed to execute … as root|||Sorry, user an is not allowed to execute … as root',
              'less: /var/log/../../etc/shadow: Permission denied',
              'sudo: a password is required',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: In sudoers, * matches any characters including / and .., so the path matches the rule and less runs as root — measured: it printed root:*:20707:0:99999:7:::. The "not allowed" message (the tempting answer) is what you would expect from a careful matcher, but sudo’s wildcard is not one. Grant exact paths, use sudoedit for editing, and check GTFOBins (less can also run !sh).|||VI: Trong sudoers, * khớp mọi ký tự kể cả / và .., nên đường dẫn khớp luật và less chạy bằng root — đo thật: in ra root:*:20707:0:99999:7:::. Câu "not allowed" (phương án hấp dẫn) là điều bạn chờ đợi ở một bộ so khớp cẩn thận, nhưng ký tự đại diện của sudo không phải như vậy. Hãy cấp đúng đường dẫn, dùng sudoedit để sửa file, và tra GTFOBins (less còn chạy được !sh).',
          },
          {
            question: 'On Fedora (SELinux enforcing) you build a site in ~/site, then sudo mv ~/site/* /var/www/html/. The files are 644, the directories 755, and nginx still returns 403. What fixes it properly?|||Trên Fedora (SELinux enforcing) bạn dựng trang trong ~/site rồi sudo mv ~/site/* /var/www/html/. File là 644, thư mục 755, vậy mà nginx vẫn trả 403. Cách sửa đúng?',
            options: [
              'sudo chmod -R 777 /var/www/html',
              'sudo restorecon -Rv /var/www/html',
              'sudo setenforce 0',
              'sudo chown -R nginx:nginx /var/www/html',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: mv keeps a file’s SELinux label, so the files are still user_home_t, which the web server’s domain may not read; cp would have given them the directory’s label. restorecon resets labels to the policy’s (matchpathcon says httpd_sys_content_t) — measured on Fedora 44: mv kept user_tmp_t, restorecon relabelled it. setenforce 0 “works” by switching the protection off for everything; chmod/chown do not touch labels.|||VI: mv giữ nguyên nhãn SELinux của file, nên chúng vẫn là user_home_t, loại mà miền của web server không được đọc; cp thì đã cho chúng nhãn của thư mục mới. restorecon đặt lại nhãn theo chính sách (matchpathcon nói httpd_sys_content_t) — đo thật trên Fedora 44: mv giữ user_tmp_t, restorecon dán lại nhãn đúng. setenforce 0 "chạy được" bằng cách tắt bảo vệ cho mọi thứ; chmod/chown không đụng tới nhãn.',
          },
        ],
      },
    },
  ],
};
