/**
 * Docker — Chương 1: container & image, mô hình tư duy.
 * Namespace/cgroup · tầng ảnh · vòng đời · tầng ghi được · ngăn xếp runtime · quiz.
 * Output CHẠY THẬT Docker Engine 27 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 *
 * Nâng cấp 09/2026 (bài mẫu của khoá): bài 1.0 slide (deck dk-01, 32 slide) + slide/🧪/🗂/📌 +
 * phần "Chạy thử từng bước" trong 1.1–1.5; quiz 10 câu. Output MỚI chạy thật 23/09/2026 trên
 * Docker Engine 29.6 (Fedora 44, amd64, kho ảnh containerd) và Docker Desktop 4.91 / Engine 29.8 (Mac M1).
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 1 — Containers & images: the mental model|||Chương 1 — Container & image: mô hình tư duy',
  description: 'Cái chương trả lại ý nghĩa cho mọi câu lệnh còn lại. Container được làm bằng gì (namespace, cgroup), image là các tầng chồng lên nhau ra sao, vòng đời một container, vì sao dữ liệu chết theo nó, và ai thật sự chạy cái tiến trình đó.',
  lessons: [
    /* ─────────────────────────── 1.0 ─────────────────────────── */
    {
      title: '1.0 — Chapter 1 slides: the mental model in pictures|||1.0 — Slide Chương 1: mô hình tư duy bằng hình',
      slug: 'dk-1-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 1: container là tiến trình + namespace + cgroup, chồng tầng và overlayfs, vòng đời và tín hiệu dừng, tầng ghi được và volume vô danh, chồng CLI → dockerd → containerd → shim → runc — xem trước khi học hoặc dùng để ôn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">Skim these before the lessons to get the shape of the model, then come back after the quiz as a revision sheet. Every picture reappears inside the lesson that explains it: a process wearing two lenses, the overlay stack of lowerdir/upperdir/merged, the SIGTERM → SIGKILL timeline, the process tree under containerd.</p>
<p>Slides 3–8 belong to Lesson 1.1, 9–14 to 1.2, 15–20 to 1.3, 21–25 to 1.4 and 26–29 to 1.5. The last three are the chapter's common mistakes, a cheat sheet, and a 40-minute practice session. Every terminal on the slides is real output, recorded in September 2026 on Docker Engine 29.6 (Linux) and Docker Desktop 4.91 (Mac M1). The slides are in Vietnamese; the diagrams read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để nắm hình dạng của mô hình, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại bên trong bài giảng giải thích nó: một tiến trình đeo hai lớp kính, chồng overlay lowerdir/upperdir/merged, dòng thời gian SIGTERM → SIGKILL, cây tiến trình dưới containerd.</p>
<p>Slide 3–8 thuộc Bài 1.1, 9–14 thuộc 1.2, 15–20 thuộc 1.3, 21–25 thuộc 1.4 và 26–29 thuộc 1.5. Ba slide cuối là những sai lầm hay gặp của chương, bảng tra nhanh và một buổi thực hành 40 phút. Mọi terminal trên slide là output THẬT, ghi tháng 9/2026 trên Docker Engine 29.6 (Linux) và Docker Desktop 4.91 (Mac M1) — con số trên máy bạn có thể khác, quy luật thì không.</p>
</div>
${gallery('dk-01', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Container là một tiến trình đeo hai lớp kính'], [4, 'Bảy namespace riêng — trừ user'], [5, 'Chỉ có một nhân — trên Mac là nhân máy ảo'],
  [6, 'cgroup là vài file trong /sys/fs/cgroup'], [7, 'Vượt trần bộ nhớ ⇒ exit 137'], [8, 'Ranh giới mỏng ở bốn chỗ'],
  [9, 'docker history đọc ngược Dockerfile'], [10, 'Tầng giống nhau lưu một lần'], [11, 'overlayfs: lowerdir, upperdir, merged'],
  [12, 'Ghi lần đầu chép trọn file lên'], [13, 'Xoá chỉ là dán nhãn .wh'], [14, 'Hai luật xếp tầng'],
  [15, 'run = pull + create + start'], [16, 'Sáu trạng thái của container'], [17, 'docker stop: SIGTERM → chờ → SIGKILL'],
  [18, 'PID 1 phải tự bắt SIGTERM'], [19, 'Shell làm PID 1 và ba cách sửa'], [20, 'Mã thoát kể chuyện gì'],
  [21, 'restart giữ, rm xoá'], [22, 'Postgres và volume vô danh'], [23, 'Ba đường dữ liệu ra khỏi tầng ghi'],
  [24, 'docker cp cứu file, commit thì đừng'], [25, 'save khác export'],
  [26, 'Bốn chương trình xếp chồng'], [27, 'Cây tiến trình: shim và systemd'], [28, 'live-restore'], [29, 'OCI và các runtime'],
  [30, 'Sai lầm hay gặp'], [31, 'Bảng tra nhanh'], [32, 'Thực hành chương 1'],
])}
`,
    },
    /* ─────────────────────────── 1.1 ─────────────────────────── */
    {
      title: '1.1 — What a container is actually made of|||1.1 — Container thật ra được làm bằng gì',
      slug: 'dk-1-1-container-la-gi',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Namespace và cgroup, nhìn thấy được bằng lệnh thật; container so với máy ảo; chứng minh không có nhân thứ hai; và ranh giới đó KHÔNG bao gồm những gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>What a container is actually made of</h2>
<p class="lead">A container is not a thing the kernel has a word for. There is no <code>container</code> system call and no container object in Linux. What exists is an ordinary process, started with a few kernel features switched on, that make it see a smaller world than the one it is in. Docker's job is to turn on those features consistently and give the result a name.</p>
<p>Two features do almost all of the work: <strong>namespaces</strong> decide what a process can SEE, and <strong>cgroups</strong> decide what it can USE.</p>

<h3>Namespaces: what the process can see</h3>
${slide('dk-01', 3, 'Container là một tiến trình đeo hai lớp kính: namespace và cgroup')}
<pre><code>docker run -d --name web nginx:1.27-alpine
PID=\$(docker inspect -f '{{.State.Pid}}' web)
echo "host PID: \$PID"
sudo ls -l /proc/\$PID/ns/</code></pre>
<div class="out">host PID: 40122
lrwxrwxrwx 1 root root 0 Aug 22 20:41 cgroup -&gt; 'cgroup:[4026532567]'
lrwxrwxrwx 1 root root 0 Aug 22 20:41 ipc -&gt; 'ipc:[4026532505]'
lrwxrwxrwx 1 root root 0 Aug 22 20:41 mnt -&gt; 'mnt:[4026532503]'
lrwxrwxrwx 1 root root 0 Aug 22 20:41 net -&gt; 'net:[4026532508]'
lrwxrwxrwx 1 root root 0 Aug 22 20:41 pid -&gt; 'pid:[4026532506]'
lrwxrwxrwx 1 root root 0 Aug 22 20:41 time -&gt; 'time:[4026531834]'
lrwxrwxrwx 1 root root 0 Aug 22 20:41 user -&gt; 'user:[4026531837]'
lrwxrwxrwx 1 root root 0 Aug 22 20:41 uts -&gt; 'uts:[4026532504]'</div>
<p>Those numbers in brackets are namespace identifiers. Compare them with your own shell's and you will see which ones the container was given fresh and which it shares with the host:</p>
<pre><code>sudo ls -l /proc/self/ns/ | awk '{print \$9, \$11}'
lsns -t pid -t net -t mnt | head -6</code></pre>
<div class="out">cgroup 'cgroup:[4026531835]'
ipc 'ipc:[4026531839]'
mnt 'mnt:[4026531841]'
net 'net:[4026531840]'
pid 'pid:[4026531836]'
time 'time:[4026531834]'
user 'user:[4026531837]'
uts 'uts:[4026531838]'</div>
<p>Different <code>mnt</code>, <code>net</code>, <code>pid</code>, <code>ipc</code>, <code>uts</code>, <code>cgroup</code> — those are the walls. Identical <code>time</code> and <code>user</code> — those are shared, which is exactly why a container's clock is the host's clock, and why root inside the container is root outside unless you enable user namespaces.</p>
<div class="callout warn"><strong>Update for Docker 29 (measured 09/2026): <code>time</code> is no longer shared.</strong> On both machines used for this course — Docker Engine 29.6 on Fedora Linux and Docker Desktop 4.91 on a Mac — a fresh container got its <em>own</em> time namespace (host <code>time:[4026531834]</code>, container <code>time:[4026532895]</code>). The practical conclusion above does not change: a time namespace can only shift the <em>monotonic</em> and <em>boot-time</em> clocks, never the wall clock (<code>CLOCK_REALTIME</code>), so the time of day inside a container is always the host's. Only <code>user</code> is reliably identical — and that is the one that matters for security.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">mnt — mount namespace</span><span class="lz-lnote">Its own filesystem tree. This is why <code>ls /</code> inside the container shows Alpine's root and not yours. The tree comes from the image's layers, stacked by an overlay filesystem (Lesson 1.2).</span></div>
  <div class="lz-layer"><span class="lz-lname">pid — process namespace</span><span class="lz-lnote">Its own process numbering, starting at 1. The container's main process IS PID 1, which has consequences for signals and zombie reaping that Lesson 1.3 covers.</span></div>
  <div class="lz-layer"><span class="lz-lname">net — network namespace</span><span class="lz-lnote">Its own interfaces, routing table, iptables rules and port space. Two containers can both listen on port 80 with no conflict, and <code>localhost</code> inside means the container itself. This is all of Chapter 8 in one line.</span></div>
  <div class="lz-layer"><span class="lz-lname">uts — hostname namespace</span><span class="lz-lnote">Its own hostname, which by default Docker sets to the container's short ID. Cosmetic, but it is why the shell prompt inside says <code>8c40e93b1a41</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">ipc — inter-process communication</span><span class="lz-lnote">Its own shared memory and semaphores. Rarely noticed, until a database that wants a big <code>/dev/shm</code> hits the 64MB default and you need <code>--shm-size</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">user — user namespace (usually NOT used)</span><span class="lz-lnote">Would map container UID 0 to an unprivileged host UID. Docker does not enable it by default, which is why root in a container is genuinely root on the host if it escapes. Rootless mode turns it on.</span></div>
</div>

<h3>Run it step by step: see the namespaces yourself, without sudo</h3>
${slide('dk-01', 4, 'Bảy namespace riêng — trừ user')}
<p>The commands above use <code>sudo</code> because the <code>/proc/&lt;PID&gt;/ns</code> links of a root-owned process are readable only by root. On a machine where you have no sudo — a school lab, a shared server, or your Mac — use Docker itself: start a throwaway container that shares the host's process namespace (<code>--pid=host</code>) and read <code>/proc</code> from inside it. That helper runs as root, so it is allowed to read the links.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Step 1 · start the container you want to examine</span><span class="lz-t">docker run -d --name web nginx:1.27-alpine</span><span class="lz-d">Any long-running container will do; nginx stays up on its own.</span></div>
  <div class="lz-step"><span class="lz-k">Step 2 · ask Docker for its PID on the host</span><span class="lz-t">docker inspect -f '{{.State.Pid}}' web</span><span class="lz-d">The number the host kernel uses for this process. Inside the container the very same process is PID 1.</span></div>
  <div class="lz-step"><span class="lz-k">Step 3 · read its namespaces through a helper</span><span class="lz-t">docker run --rm --pid=host alpine ls -l /proc/\$PID/ns</span><span class="lz-d">The helper sees every process of the host, so <code>/proc/\$PID</code> exists for it.</span></div>
  <div class="lz-step"><span class="lz-k">Step 4 · compare with your own shell</span><span class="lz-t">ls -l /proc/self/ns</span><span class="lz-d">Your own process needs no sudo. Same number = same namespace; different number = a wall.</span></div>
</div>
<pre><code class="language-bash">docker run -d --name web nginx:1.27-alpine
PID=\$(docker inspect -f '{{.State.Pid}}' web)
docker run --rm --pid=host alpine ls -l /proc/\$PID/ns
ls -l /proc/self/ns | awk '{print \$9, \$11}'</code></pre>
<div class="out">lrwxrwxrwx    1 root     root             0 Sep 23 13:15 cgroup -&gt; cgroup:[4026532674]
lrwxrwxrwx    1 root     root             0 Sep 23 13:15 ipc -&gt; ipc:[4026532610]
lrwxrwxrwx    1 root     root             0 Sep 23 13:15 mnt -&gt; mnt:[4026532607]
lrwxrwxrwx    1 root     root             0 Sep 23 13:15 net -&gt; net:[4026532675]
lrwxrwxrwx    1 root     root             0 Sep 23 13:15 pid -&gt; pid:[4026532611]
lrwxrwxrwx    1 root     root             0 Sep 23 13:15 pid_for_children -&gt; pid:[4026532611]
lrwxrwxrwx    1 root     root             0 Sep 23 13:15 time -&gt; time:[4026532895]
lrwxrwxrwx    1 root     root             0 Sep 23 13:15 time_for_children -&gt; time:[4026532895]
lrwxrwxrwx    1 root     root             0 Sep 23 13:15 user -&gt; user:[4026531837]
lrwxrwxrwx    1 root     root             0 Sep 23 13:15 uts -&gt; uts:[4026532609]
cgroup cgroup:[4026531835]
ipc ipc:[4026531839]
mnt mnt:[4026531832]
net net:[4026531833]
pid pid:[4026531836]
pid_for_children pid:[4026531836]
time time:[4026531834]
time_for_children time:[4026531834]
user user:[4026531837]
uts uts:[4026531838]</div>
<p>Real output from the course's Linux machine (Fedora, Docker 29.6). The first ten lines are the container, the last ten your shell. Every pair differs except <code>user</code>: <code>4026531837</code> on both sides.</p>
<table>
<tr><th>Piece of the command</th><th>What it means</th></tr>
<tr><td><code>docker inspect -f '{{.State.Pid}}' web</code></td><td><code>inspect</code> prints a big JSON document about the container; <code>-f</code> (<code>--format</code>) takes a Go template and <code>{{.State.Pid}}</code> picks one field out of it.</td></tr>
<tr><td><code>PID=\$( … )</code></td><td>Shell command substitution: run the inner command and store its output in the variable <code>PID</code>.</td></tr>
<tr><td><code>--rm</code></td><td>Delete the helper container as soon as it exits, so it leaves nothing behind.</td></tr>
<tr><td><code>--pid=host</code></td><td>Do NOT give this container its own process namespace — it sees every process on the host. Useful for inspection, and exactly the kind of flag that dissolves the boundary (later in this lesson).</td></tr>
<tr><td><code>/proc/&lt;PID&gt;/ns</code></td><td>A directory the kernel keeps for every process, one link per namespace type. The number in brackets is the namespace's identity (an inode number).</td></tr>
<tr><td><code>pid_for_children</code>, <code>time_for_children</code></td><td>Newer kernels also list the namespace the process's <em>future children</em> will be placed in. Here they equal <code>pid</code>/<code>time</code>.</td></tr>
</table>
<div class="callout"><strong>On a Mac the "host" is Docker Desktop's Linux VM.</strong> The first three commands work unchanged and show processes of that VM. The fourth fails, because macOS has no <code>/proc</code> at all — which is itself the proof that containers cannot run directly on macOS. To see the VM's own view, compare two containers instead: every namespace number differs between them, except <code>user</code>.</div>

<h3>Prove there is no second kernel</h3>
${slide('dk-01', 5, 'Chỉ có một nhân — trên Mac là nhân của máy ảo')}
<pre><code><span class="tok-comment"># Host kernel</span>
uname -r
<span class="tok-comment"># "Kernel" as seen from inside a container of a totally different distro</span>
docker run --rm alpine uname -r
docker run --rm ubuntu:24.04 uname -r
docker run --rm alpine cat /etc/os-release | head -1</code></pre>
<div class="out">6.8.0-45-generic
6.8.0-45-generic
6.8.0-45-generic
NAME="Alpine Linux"</div>
<p>The same four commands on the course's Mac (Docker Desktop 4.91) make the point even more sharply:</p>
<pre><code class="language-bash">uname -r                                   <span class="tok-comment"># macOS itself</span>
docker run --rm alpine uname -r
docker info --format '{{.NCPU}} CPU {{.MemTotal}} {{.OperatingSystem}}'</code></pre>
<div class="out">27.0.0
7.0.12-linuxkit
10 CPU 8319504384 Docker Desktop</div>
<p><code>27.0.0</code> is the Darwin kernel of macOS; <code>7.0.12-linuxkit</code> is the Linux kernel of Docker Desktop's virtual machine, and it is what every container on the Mac runs on. <code>8319504384</code> bytes is 7.7 GiB — the memory given to the VM, on a Mac that has 32 GB. A container can never get more than the VM has.</p>
<p>Three different userlands, one kernel — the host's. That is the whole architectural difference from a virtual machine, and every practical consequence follows from it:</p>
<div class="lz-map">
  <div class="lz-stage">Virtual machine</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Hardware is emulated, a guest kernel boots</span><span class="lz-nsub">Start-up takes tens of seconds. Memory is reserved up front. A 2GB image is normal. In exchange you get a genuine isolation boundary and can run a different OS entirely — Windows on Linux, or an older kernel.</span></div></div>
  <div class="lz-stage">Container</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">A process with restricted views, sharing the host kernel</span><span class="lz-nsub">Starts in milliseconds. Uses memory only as it allocates it. A 50MB image is normal. In exchange the boundary is thinner, and you cannot run a Windows container on a Linux kernel or vice versa.</span></div></div>
</div>
<div class="callout"><strong>This is why Docker Desktop on macOS is a VM.</strong> Containers need Linux kernel features, and macOS does not have a Linux kernel. So Desktop runs a small Linux VM and puts the containers inside it — which is also why file sharing from macOS is slow and why <code>docker info</code> reports the VM's resources rather than your Mac's. On a Linux server there is no VM and no overhead: the container process is scheduled by the same kernel as everything else.</div>

<h3>cgroups: what the process can use</h3>
${slide('dk-01', 6, 'cgroup là vài file trong /sys/fs/cgroup')}
<pre><code>docker run -d --name limited --memory 256m --cpus 0.5 nginx:1.27-alpine
docker inspect -f '{{.HostConfig.Memory}} {{.HostConfig.NanoCpus}}' limited
CID=\$(docker inspect -f '{{.Id}}' limited)
cat /sys/fs/cgroup/system.slice/docker-\$CID.scope/memory.max
cat /sys/fs/cgroup/system.slice/docker-\$CID.scope/cpu.max</code></pre>
<div class="out">268435456 500000000
268435456
50000 100000</div>
<p><code>memory.max</code> is 256MB in bytes, and <code>cpu.max</code> says "50,000 microseconds of CPU per 100,000 microsecond period" — half a core. These are plain files in the host's cgroup v2 filesystem. Docker did not invent a limiting mechanism; it wrote to the one the kernel already had.</p>
<p>Each resource flag of <code>docker run</code> becomes one of those files. The ones you will actually use:</p>
<table>
<tr><th>Flag</th><th>cgroup file</th><th>What it does</th></tr>
<tr><td><code>--memory 256m</code> (<code>-m</code>)</td><td><code>memory.max</code></td><td>Hard RAM ceiling. Crossing it wakes the OOM killer inside that cgroup only.</td></tr>
<tr><td><code>--memory-swap 256m</code></td><td><code>memory.swap.max</code></td><td>RAM <em>plus</em> swap in total. Set it equal to <code>--memory</code> to forbid swap. If you leave it out, the container may use as much swap again as its RAM — on the course's Linux machine <code>--memory 256m</code> alone gave <code>memory.swap.max: 268435456</code>, i.e. 256 MB of extra swap.</td></tr>
<tr><td><code>--cpus 0.5</code></td><td><code>cpu.max</code></td><td>CPU time per period: <code>50000 100000</code> = 50 ms in every 100 ms. The process is throttled, never killed.</td></tr>
<tr><td><code>--pids-limit 200</code></td><td><code>pids.max</code></td><td>Maximum number of processes/threads — stops a fork bomb. Without it the course machine showed <code>pids.max: 38112</code>.</td></tr>
</table>
<div class="callout">On a Mac or Windows, all of this happens inside Docker Desktop's VM: a <code>--memory 16g</code> container on a VM with 7.7 GiB is limited by the VM long before it reaches its own ceiling. Raise the VM's memory in Docker Desktop → Settings → Resources when a build keeps dying.</div>
<h3>Hitting the ceiling: exit 137, and the swap trap</h3>
${slide('dk-01', 7, 'Vượt trần bộ nhớ ⇒ SIGKILL ⇒ exit 137')}
<p>Try the obvious experiment first — allocate 400 MB under a 256 MB cap:</p>
<pre><code><span class="tok-comment"># Watch a limit being enforced: allocate 400MB with a 256MB cap</span>
docker run --rm --memory 256m alpine sh -c \\
  'dd if=/dev/zero of=/dev/null bs=1M count=400 2&gt;/dev/null; \\
   head -c 400m /dev/zero | tail -c 1 &gt; /dev/null; echo survived'
echo "exit: \$?"</code></pre>
<div class="out">survived
exit: 0</div>
<p>It survives — measured on both course machines (Docker 29.6 on Linux, Docker Desktop 4.91 on the Mac). Two reasons. <code>tail -c 1</code> only keeps the last byte, so the pipe never holds 400 MB at once. And even a real 400 MB allocation fits, because <code>--memory 256m</code> alone allows another 256 MB of swap (the table above). An earlier version of this lesson printed <code>exit: 137</code> here; that is not what happens. To watch the limit bite for sure, forbid swap and make one allocation that is truly bigger than the cap — <code>dd</code> with a 200 MB block size allocates a 200 MB buffer in one go:</p>
<pre><code class="language-bash">docker run --name oom --memory 128m --memory-swap 128m alpine dd if=/dev/zero of=/dev/null bs=200M count=1
echo "exit: \$?"
docker inspect -f 'OOMKilled={{.State.OOMKilled}} ExitCode={{.State.ExitCode}}' oom
docker rm oom</code></pre>
<div class="out">exit: 137
OOMKilled=true ExitCode=137</div>
<p>With <code>bs=100M</code> — under the cap — the same command prints <code>1+0 records out</code> and exits 0. <code>OOMKilled=true</code> is the field to check whenever you see 137: it is Docker telling you the kernel's OOM killer, not a person, ended the process.</p>
<p>Exit 137 is 128 + 9: killed by SIGKILL. The kernel's OOM killer enforced the cgroup limit. Remember this number — in Chapter 12 it is the single most common mystery exit code, and it always means the same thing.</p>

<h3>What the boundary does NOT include</h3>
${slide('dk-01', 8, 'Ranh giới mỏng ở bốn chỗ')}
<div class="kv-grid">
  <div class="kv"><span class="k">The kernel itself</span><span class="v">A kernel vulnerability is a container-escape vulnerability. This is the fundamental reason a container is a weaker boundary than a VM, and why multi-tenant platforms add gVisor, Kata Containers or a real VM per tenant.</span></div>
  <div class="kv"><span class="k">The clock</span><span class="v">The <code>time</code> namespace exists but Docker does not use it. Container time is host time, which is why a skewed host clock breaks TLS inside every container at once.</span></div>
  <div class="kv"><span class="k">User IDs, by default</span><span class="v">UID 0 in the container is UID 0 on the host. A file written by a root process in a container is owned by root on a bind-mounted host directory — Chapter 7's most annoying practical problem.</span></div>
  <div class="kv"><span class="k">Anything you explicitly share</span><span class="v"><code>--net=host</code> removes the network namespace. <code>--pid=host</code> removes the process one. <code>-v /var/run/docker.sock:/var/run/docker.sock</code> hands the container control of the whole daemon. Each is legitimate and each dissolves part of the boundary.</span></div>
  <div class="kv"><span class="k">Kernel modules, most of /sys, and most capabilities</span><span class="v">Docker drops most Linux capabilities by default and applies a seccomp filter blocking about 44 syscalls. That default is a big part of the safety — Chapter 6 covers what <code>--privileged</code> throws away.</span></div>
</div>
<pre><code><span class="tok-comment"># See the boundary dissolve — same command, one flag apart</span>
docker run --rm alpine hostname
docker run --rm --uts=host alpine hostname
docker run --rm alpine ip -o addr | wc -l
docker run --rm --net=host alpine ip -o addr | wc -l</code></pre>
<div class="out">3f21a9c04b8e
vps-1
4
18</div>
<p>Reading it: without flags the hostname is the container's short ID and the container sees only its own few interfaces (loopback and one <code>eth0</code>). One flag later it reports the host's name and every interface the host has. On the course's Linux machine the same four commands printed <code>15636845bee3</code>, <code>CuongThai</code>, <code>3</code> and <code>23</code> — the numbers depend on the machine, the pattern does not. The clock is the fourth thin spot, and it is easy to see:</p>
<pre><code class="language-bash">docker run --rm alpine date +%H:%M:%S ; date +%H:%M:%S</code></pre>
<div class="out">13:17:09
20:17:09</div>
<p>Same second, two different displays: the container has no <code>/etc/localtime</code>, so it prints UTC; the host prints Vietnam time (+07). The clock underneath is one and the same. This is why a container's logs look "seven hours behind" — it is the time zone, not the clock (Chapter 2 shows how to set <code>TZ</code>).</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a teammate in your SWP391 group says "a container is a mini virtual machine, so running that random script from GitHub inside one is perfectly safe". Use your own terminal to show what a container really is — and where its walls stop.</p><ol>
<li>Create the course sandbox and two containers: <code>mkdir -p ~/thu-docker &amp;&amp; cd ~/thu-docker</code>, then <code>docker run -d --name thu-a nginx:1.27-alpine</code> and <code>docker run -d --name thu-b nginx:1.27-alpine</code>.</li>
<li>Read both containers' namespaces with the <code>--pid=host</code> helper from "Run it step by step" above. Write down which numbers differ and which one is identical in both.</li>
<li>Run <code>docker run --rm alpine uname -r</code> and <code>docker run --rm ubuntu:24.04 uname -r</code>. On a Mac also run <code>uname -r</code> in your own terminal. Whose kernel answered each time?</li>
<li>Trigger an out-of-memory kill on purpose and prove the cgroup did it (block below).</li>
<li>Clean up: <code>docker rm -f thu-a thu-b thu-oom</code>.</li></ol>
<pre><code class="language-bash">docker run --name thu-oom --memory 128m --memory-swap 128m alpine dd if=/dev/zero of=/dev/null bs=200M count=1
echo "exit: \$?"
docker inspect -f 'OOMKilled={{.State.OOMKilled}}' thu-oom</code></pre>
<div class="out">exit: 137
OOMKilled=true</div>
<p><strong>Done when:</strong> you can point at the one namespace <code>thu-a</code> and <code>thu-b</code> share (<code>user</code>) and explain why that means "root inside = root outside"; both <code>uname -r</code> print the same kernel; and you got <code>exit: 137</code> with <code>OOMKilled=true</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Namespace</span><span class="v">A kernel feature that gives a process its own private view of one kind of resource: files, process IDs, network, hostname…</span></div>
  <div class="kv"><span class="k">cgroup (control group)</span><span class="v">A kernel feature that limits and measures how much memory, CPU and how many processes a group of processes may use.</span></div>
  <div class="kv"><span class="k">Kernel</span><span class="v">The core of the operating system that talks to the hardware. All containers on a host share the host's one kernel.</span></div>
  <div class="kv"><span class="k">Host PID vs container PID</span><span class="v">One process, two numbers: 367975 as the host sees it, 1 as the container sees it.</span></div>
  <div class="kv"><span class="k">OOM killer</span><span class="v">The kernel mechanism that kills a process when memory runs out — inside a container, when the cgroup's ceiling is hit.</span></div>
  <div class="kv"><span class="k">Exit code 137</span><span class="v">128 + 9: the process was killed by signal 9, SIGKILL. With <code>OOMKilled=true</code> it means "out of memory".</span></div>
  <div class="kv"><span class="k">Virtual machine (VM)</span><span class="v">Emulated hardware running its own kernel. Stronger isolation, slower to start, heavier. Docker Desktop is one.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A container is an ordinary Linux process with namespaces (what it sees) and cgroups (what it may use) switched on.</li>
<li>Every namespace is private to the container except <code>user</code> — so root inside is root on the host.</li>
<li>There is one kernel: <code>uname -r</code> is the same inside and out; on a Mac it is the kernel of Docker Desktop's VM.</li>
<li><code>--memory</code>, <code>--cpus</code>, <code>--pids-limit</code> are just numbers Docker writes into files under <code>/sys/fs/cgroup</code>.</li>
<li>Exit 137 = SIGKILL; check <code>.State.OOMKilled</code>, and remember swap raises the real ceiling unless <code>--memory-swap</code> equals <code>--memory</code>.</li>
<li>Flags like <code>--net=host</code>, <code>--pid=host</code>, <code>--privileged</code> or a mounted <code>docker.sock</code> remove walls on purpose; untrusted code needs a VM or gVisor.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man7/namespaces.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">namespaces(7) — the Linux manual</span><span class="lc-sub">The primary source for what each namespace isolates, written by the people who implemented them. Dense, short, and the definitive answer whenever a container "sees" something you did not expect.</span></span>
</a>
<a class="link-card" href="https://docs.kernel.org/admin-guide/cgroup-v2.html" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Control Group v2 — kernel documentation</span><span class="lc-sub">Every file under <code>/sys/fs/cgroup</code> explained, including <code>memory.max</code>, <code>cpu.max</code> and the pressure metrics. This is what <code>--memory</code> and <code>--cpus</code> are actually writing to.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/security/" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">Docker security</span><span class="lc-sub">The vendor's honest account of what the container boundary does and does not protect, including the default capability set and the seccomp profile. Read before running anything untrusted.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: see the boundary</span><span class="lc-sub">Graded exercises: match a container's namespace IDs against the host's, read a memory limit out of cgroup v2, trigger an exit 137 deliberately, and explain what <code>--net=host</code> gives up.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> treating the container boundary as a security boundary strong enough for hostile code. It is a real boundary and it stops a great deal — but the kernel is shared, so a kernel bug reachable from inside is an escape, and <code>--privileged</code> or a mounted <code>docker.sock</code> removes the boundary entirely by design. Containers are excellent for isolating <em>your own</em> workloads from each other and from the host's package manager. For running code you did not write and do not trust, the honest answer is a VM per tenant, or a sandboxed runtime like gVisor.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Namespaces control what a process can SEE and cgroups control what it can USE — every container feature you meet later is one of those two, wearing a friendlier name. There is exactly one kernel: <code>uname -r</code> is identical inside and out, which is the whole reason containers are fast and small, and the whole reason the boundary is thinner than a VM's. And exit code 137 means SIGKILL, which nine times out of ten means a memory cgroup limit was hit.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Container thật ra được làm bằng gì</h2>
<p class="lead">Container không phải một thứ mà nhân Linux có tên gọi cho. Không có lời gọi hệ thống <code>container</code> nào và không có đối tượng container nào trong Linux. Thứ tồn tại là một TIẾN TRÌNH bình thường, được khởi chạy với vài tính năng của nhân bật lên, khiến nó nhìn thấy một thế giới nhỏ hơn cái thế giới nó đang ở trong. Việc của Docker là bật những tính năng đó một cách nhất quán rồi đặt tên cho kết quả.</p>
<p>Hai tính năng làm gần hết mọi việc: <strong>NAMESPACE</strong> quyết định một tiến trình NHÌN THẤY được gì, và <strong>CGROUP</strong> quyết định nó DÙNG được bao nhiêu.</p>

<h3>Namespace: tiến trình nhìn thấy được gì</h3>
${slide('dk-01', 3, 'Container là một tiến trình đeo hai lớp kính: namespace và cgroup')}
<pre><code>docker run -d --name web nginx:1.27-alpine
PID=\$(docker inspect -f '{{.State.Pid}}' web)
echo "PID trên máy chủ: \$PID"
sudo ls -l /proc/\$PID/ns/</code></pre>
<div class="out">PID trên máy chủ: 40122
lrwxrwxrwx 1 root root 0 Aug 22 20:41 cgroup -&gt; 'cgroup:[4026532567]'
lrwxrwxrwx 1 root root 0 Aug 22 20:41 ipc -&gt; 'ipc:[4026532505]'
lrwxrwxrwx 1 root root 0 Aug 22 20:41 mnt -&gt; 'mnt:[4026532503]'
lrwxrwxrwx 1 root root 0 Aug 22 20:41 net -&gt; 'net:[4026532508]'
lrwxrwxrwx 1 root root 0 Aug 22 20:41 pid -&gt; 'pid:[4026532506]'
lrwxrwxrwx 1 root root 0 Aug 22 20:41 time -&gt; 'time:[4026531834]'
lrwxrwxrwx 1 root root 0 Aug 22 20:41 user -&gt; 'user:[4026531837]'
lrwxrwxrwx 1 root root 0 Aug 22 20:41 uts -&gt; 'uts:[4026532504]'</div>
<p>Mấy con số trong ngoặc vuông là định danh của namespace. Đem so với namespace của chính shell bạn thì sẽ thấy cái nào container được cấp mới và cái nào nó dùng chung với máy chủ:</p>
<pre><code>sudo ls -l /proc/self/ns/ | awk '{print \$9, \$11}'
lsns -t pid -t net -t mnt | head -6</code></pre>
<div class="out">cgroup 'cgroup:[4026531835]'
ipc 'ipc:[4026531839]'
mnt 'mnt:[4026531841]'
net 'net:[4026531840]'
pid 'pid:[4026531836]'
time 'time:[4026531834]'
user 'user:[4026531837]'
uts 'uts:[4026531838]'</div>
<p><code>mnt</code>, <code>net</code>, <code>pid</code>, <code>ipc</code>, <code>uts</code>, <code>cgroup</code> đều KHÁC — đó là những bức tường. <code>time</code> và <code>user</code> thì GIỐNG HỆT — đó là những thứ dùng chung, và đó chính xác là lý do đồng hồ của container là đồng hồ của máy chủ, và là lý do root bên trong container cũng là root bên ngoài trừ khi bạn bật user namespace.</p>
<div class="callout warn"><strong>Cập nhật cho Docker 29 (đo 09/2026): <code>time</code> KHÔNG còn dùng chung.</strong> Trên cả hai máy dùng cho khoá này — Docker Engine 29.6 trên Fedora Linux và Docker Desktop 4.91 trên Mac — một container mới được cấp namespace <code>time</code> <em>riêng</em> (máy chủ <code>time:[4026531834]</code>, container <code>time:[4026532895]</code>). Kết luận thực tế ở trên vẫn đúng: namespace time chỉ dịch được đồng hồ <em>đơn điệu</em> (monotonic — đếm từ lúc khởi động, dùng để đo khoảng thời gian) và <em>boot-time</em>, KHÔNG BAO GIỜ dịch được giờ thực (<code>CLOCK_REALTIME</code>), nên giờ trong ngày bên trong container luôn là giờ của máy chủ. Chỉ có <code>user</code> là chắc chắn giống hệt — và đó đúng là cái quan trọng cho an ninh.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">mnt — namespace gắn kết</span><span class="lz-lnote">Cây hệ thống file riêng của nó. Đây là lý do <code>ls /</code> bên trong container hiện ra thư mục gốc của Alpine chứ không phải của bạn. Cây đó đến từ các TẦNG của image, được xếp chồng bởi một hệ thống file overlay (Bài 1.2).</span></div>
  <div class="lz-layer"><span class="lz-lname">pid — namespace tiến trình</span><span class="lz-lnote">Cách đánh số tiến trình riêng, bắt đầu từ 1. Tiến trình chính của container CHÍNH LÀ PID 1, và điều đó kéo theo những hệ quả về tín hiệu và việc thu dọn tiến trình xác mà Bài 1.3 nói tới.</span></div>
  <div class="lz-layer"><span class="lz-lname">net — namespace mạng</span><span class="lz-lnote">Giao diện mạng, bảng định tuyến, luật iptables và không gian cổng riêng của nó. Hai container cùng lắng nghe cổng 80 mà không xung đột, và <code>localhost</code> bên trong nghĩa là CHÍNH container đó. Cả Chương 8 gói trong một dòng.</span></div>
  <div class="lz-layer"><span class="lz-lname">uts — namespace tên máy</span><span class="lz-lnote">Tên máy riêng, mà Docker mặc định đặt bằng ID ngắn của container. Chỉ là hình thức, nhưng đó là lý do dấu nhắc shell bên trong ghi <code>8c40e93b1a41</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">ipc — giao tiếp giữa các tiến trình</span><span class="lz-lnote">Bộ nhớ chia sẻ và semaphore riêng. Hiếm khi để ý tới, cho tới khi một cơ sở dữ liệu muốn một <code>/dev/shm</code> lớn đụng phải mức mặc định 64MB và bạn cần <code>--shm-size</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">user — user namespace (thường KHÔNG dùng)</span><span class="lz-lnote">Nếu bật, nó ánh xạ UID 0 trong container sang một UID không đặc quyền trên máy chủ. Docker mặc định KHÔNG bật, và đó là lý do root trong container thật sự là root trên máy chủ nếu nó thoát ra được. Chế độ rootless thì bật nó lên.</span></div>
</div>

<h3>Chạy thử từng bước: tự nhìn thấy namespace, không cần sudo</h3>
${slide('dk-01', 4, 'Bảy namespace riêng — trừ user')}
<p>Mấy lệnh ở trên dùng <code>sudo</code> vì các liên kết <code>/proc/&lt;PID&gt;/ns</code> của một tiến trình thuộc root thì chỉ root mới đọc được. Trên máy bạn KHÔNG có sudo — máy phòng lab ở trường, một máy chủ dùng chung, hay chính máy Mac của bạn — hãy dùng chính Docker: chạy một container dùng-xong-vứt, cho nó dùng chung namespace tiến trình của máy chủ (<code>--pid=host</code>) rồi đọc <code>/proc</code> từ bên trong nó. Cái container phụ đó chạy bằng root nên nó được phép đọc các liên kết.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bước 1 · chạy container bạn muốn soi</span><span class="lz-t">docker run -d --name web nginx:1.27-alpine</span><span class="lz-d">Container nào chạy lâu cũng được; nginx tự đứng yên chờ request.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 2 · hỏi Docker PID của nó trên máy chủ</span><span class="lz-t">docker inspect -f '{{.State.Pid}}' web</span><span class="lz-d">Con số mà nhân của máy chủ dùng cho tiến trình này. Bên trong container, CHÍNH tiến trình đó là PID 1.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 3 · đọc namespace của nó qua container phụ</span><span class="lz-t">docker run --rm --pid=host alpine ls -l /proc/\$PID/ns</span><span class="lz-d">Container phụ thấy MỌI tiến trình của máy chủ, nên với nó <code>/proc/\$PID</code> có tồn tại.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 4 · so với shell của chính bạn</span><span class="lz-t">ls -l /proc/self/ns</span><span class="lz-d">Tiến trình của chính bạn thì không cần sudo. Cùng số = cùng namespace; khác số = một bức tường.</span></div>
</div>
<pre><code class="language-bash">docker run -d --name web nginx:1.27-alpine
PID=\$(docker inspect -f '{{.State.Pid}}' web)
docker run --rm --pid=host alpine ls -l /proc/\$PID/ns
ls -l /proc/self/ns | awk '{print \$9, \$11}'</code></pre>
<div class="out">lrwxrwxrwx    1 root     root             0 Sep 23 13:15 cgroup -&gt; cgroup:[4026532674]
lrwxrwxrwx    1 root     root             0 Sep 23 13:15 ipc -&gt; ipc:[4026532610]
lrwxrwxrwx    1 root     root             0 Sep 23 13:15 mnt -&gt; mnt:[4026532607]
lrwxrwxrwx    1 root     root             0 Sep 23 13:15 net -&gt; net:[4026532675]
lrwxrwxrwx    1 root     root             0 Sep 23 13:15 pid -&gt; pid:[4026532611]
lrwxrwxrwx    1 root     root             0 Sep 23 13:15 pid_for_children -&gt; pid:[4026532611]
lrwxrwxrwx    1 root     root             0 Sep 23 13:15 time -&gt; time:[4026532895]
lrwxrwxrwx    1 root     root             0 Sep 23 13:15 time_for_children -&gt; time:[4026532895]
lrwxrwxrwx    1 root     root             0 Sep 23 13:15 user -&gt; user:[4026531837]
lrwxrwxrwx    1 root     root             0 Sep 23 13:15 uts -&gt; uts:[4026532609]
cgroup cgroup:[4026531835]
ipc ipc:[4026531839]
mnt mnt:[4026531832]
net net:[4026531833]
pid pid:[4026531836]
pid_for_children pid:[4026531836]
time time:[4026531834]
time_for_children time:[4026531834]
user user:[4026531837]
uts uts:[4026531838]</div>
<p>Output thật trên máy Linux của khoá (Fedora, Docker 29.6). Mười dòng đầu là của container, mười dòng sau là của shell bạn. Mọi cặp đều KHÁC nhau trừ <code>user</code>: <code>4026531837</code> ở cả hai phía.</p>
<table>
<tr><th>Mẩu lệnh</th><th>Nghĩa là</th></tr>
<tr><td><code>docker inspect -f '{{.State.Pid}}' web</code></td><td><code>inspect</code> in ra một tài liệu JSON rất dài về container; <code>-f</code> (<code>--format</code>) nhận một khuôn mẫu Go (Go template) và <code>{{.State.Pid}}</code> nhặt đúng một trường trong đó.</td></tr>
<tr><td><code>PID=\$( … )</code></td><td>Thay thế lệnh (command substitution) của shell: chạy lệnh bên trong rồi cất output vào biến <code>PID</code>.</td></tr>
<tr><td><code>--rm</code></td><td>Xoá container phụ ngay khi nó thoát, không để lại rác.</td></tr>
<tr><td><code>--pid=host</code></td><td>KHÔNG cấp namespace tiến trình riêng — container này thấy mọi tiến trình của máy chủ. Hữu ích để soi, và cũng chính là loại cờ làm tan ranh giới (phần sau của bài).</td></tr>
<tr><td><code>/proc/&lt;PID&gt;/ns</code></td><td>Thư mục nhân giữ cho MỖI tiến trình, mỗi loại namespace một liên kết. Con số trong ngoặc vuông là danh tính của namespace (một số inode).</td></tr>
<tr><td><code>pid_for_children</code>, <code>time_for_children</code></td><td>Nhân mới còn liệt kê namespace mà các tiến trình <em>con sắp sinh</em> sẽ được đặt vào. Ở đây chúng bằng đúng <code>pid</code>/<code>time</code>.</td></tr>
</table>
<div class="callout"><strong>Trên Mac, "máy chủ" chính là máy ảo Linux của Docker Desktop.</strong> Ba lệnh đầu chạy y nguyên và cho thấy tiến trình của máy ảo đó. Lệnh thứ tư thì hỏng, vì macOS hoàn toàn không có <code>/proc</code> — và chính điều đó là bằng chứng container không thể chạy thẳng trên macOS. Muốn so sánh trên Mac thì so HAI container với nhau: mọi số namespace đều khác, trừ <code>user</code>.</div>

<h3>Chứng minh không có cái nhân thứ hai</h3>
${slide('dk-01', 5, 'Chỉ có một nhân — trên Mac là nhân của máy ảo')}
<pre><code><span class="tok-comment"># Nhân của máy chủ</span>
uname -r
<span class="tok-comment"># "Nhân" nhìn từ bên trong container của những bản phân phối hoàn toàn khác</span>
docker run --rm alpine uname -r
docker run --rm ubuntu:24.04 uname -r
docker run --rm alpine cat /etc/os-release | head -1</code></pre>
<div class="out">6.8.0-45-generic
6.8.0-45-generic
6.8.0-45-generic
NAME="Alpine Linux"</div>
<p>Cũng mấy lệnh đó chạy trên máy Mac của khoá (Docker Desktop 4.91) còn cho thấy rõ hơn nữa:</p>
<pre><code class="language-bash">uname -r                                   <span class="tok-comment"># chính macOS</span>
docker run --rm alpine uname -r
docker info --format '{{.NCPU}} CPU {{.MemTotal}} {{.OperatingSystem}}'</code></pre>
<div class="out">27.0.0
7.0.12-linuxkit
10 CPU 8319504384 Docker Desktop</div>
<p><code>27.0.0</code> là nhân Darwin của macOS; <code>7.0.12-linuxkit</code> là nhân Linux của máy ảo Docker Desktop, và MỌI container trên Mac đều chạy trên nhân đó. <code>8319504384</code> byte là 7,7 GiB — lượng RAM cấp cho máy ảo, trên một máy Mac có 32 GB. Container không bao giờ lấy được nhiều hơn thứ máy ảo có. Bạn cùng nhóm dùng Windows cũng vậy: Docker Desktop trên Windows chạy container trong máy ảo WSL2.</p>
<p>Ba phần userland khác nhau, MỘT cái nhân — của máy chủ. Đó là toàn bộ khác biệt kiến trúc so với một máy ảo, và mọi hệ quả thực tế đều suy ra từ đó:</p>
<div class="lz-map">
  <div class="lz-stage">Máy ảo</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Phần cứng được mô phỏng, một nhân khách khởi động</span><span class="lz-nsub">Khởi động mất hàng chục giây. Bộ nhớ bị giữ trước. Một ảnh 2GB là bình thường. Đổi lại bạn có một ranh giới cô lập thật sự và chạy được một hệ điều hành hoàn toàn khác — Windows trên Linux, hoặc một nhân cũ hơn.</span></div></div>
  <div class="lz-stage">Container</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một tiến trình với tầm nhìn bị hạn chế, dùng chung nhân của máy chủ</span><span class="lz-nsub">Khởi động trong mili giây. Chỉ dùng bộ nhớ khi nó thật sự cấp phát. Một ảnh 50MB là bình thường. Đổi lại ranh giới mỏng hơn, và bạn không chạy được container Windows trên nhân Linux hay ngược lại.</span></div></div>
</div>
<div class="callout"><strong>Đây là lý do Docker Desktop trên macOS là một máy ảo.</strong> Container cần các tính năng của nhân Linux, mà macOS thì không có nhân Linux. Nên Desktop chạy một máy ảo Linux nhỏ rồi đặt container vào bên trong — đó cũng là lý do chia sẻ file từ macOS thì chậm và là lý do <code>docker info</code> báo tài nguyên của máy ảo chứ không phải của máy Mac. Trên một máy chủ Linux thì không có máy ảo và không có phần phụ trội nào: tiến trình container được chính cái nhân đó lập lịch như mọi tiến trình khác.</div>

<h3>cgroup: tiến trình dùng được bao nhiêu</h3>
${slide('dk-01', 6, 'cgroup là vài file trong /sys/fs/cgroup')}
<pre><code>docker run -d --name limited --memory 256m --cpus 0.5 nginx:1.27-alpine
docker inspect -f '{{.HostConfig.Memory}} {{.HostConfig.NanoCpus}}' limited
CID=\$(docker inspect -f '{{.Id}}' limited)
cat /sys/fs/cgroup/system.slice/docker-\$CID.scope/memory.max
cat /sys/fs/cgroup/system.slice/docker-\$CID.scope/cpu.max</code></pre>
<div class="out">268435456 500000000
268435456
50000 100000</div>
<p><code>memory.max</code> là 256MB tính bằng byte, còn <code>cpu.max</code> nói "50.000 micro giây CPU trên mỗi chu kỳ 100.000 micro giây" — nửa cái nhân. Đây là những FILE thuần trong hệ thống file cgroup v2 của máy chủ. Docker không phát minh ra cơ chế giới hạn nào cả; nó ghi vào đúng cái cơ chế mà nhân vốn đã có.</p>
<p>Mỗi cờ tài nguyên của <code>docker run</code> trở thành một trong mấy file đó. Những cờ bạn sẽ dùng thật:</p>
<table>
<tr><th>Cờ</th><th>File cgroup</th><th>Làm gì</th></tr>
<tr><td><code>--memory 256m</code> (<code>-m</code>)</td><td><code>memory.max</code></td><td>Trần RAM cứng. Vượt qua là kẻ giết OOM (OOM killer — thứ giết tiến trình khi hết bộ nhớ) thức dậy, nhưng CHỈ trong cgroup đó.</td></tr>
<tr><td><code>--memory-swap 256m</code></td><td><code>memory.swap.max</code></td><td>Tổng RAM <em>cộng</em> swap (bộ nhớ tráo ra đĩa). Đặt BẰNG <code>--memory</code> để cấm swap. Nếu bỏ trống, container được dùng thêm swap bằng đúng lượng RAM của nó — trên máy Linux của khoá, chỉ <code>--memory 256m</code> đã cho <code>memory.swap.max: 268435456</code>, tức 256 MB swap thêm.</td></tr>
<tr><td><code>--cpus 0.5</code></td><td><code>cpu.max</code></td><td>Thời gian CPU mỗi chu kỳ: <code>50000 100000</code> = 50 ms trong mỗi 100 ms. Tiến trình bị làm chậm lại, không bao giờ bị giết.</td></tr>
<tr><td><code>--pids-limit 200</code></td><td><code>pids.max</code></td><td>Số tiến trình/luồng tối đa — chặn một quả bom fork. Không đặt thì máy của khoá hiện <code>pids.max: 38112</code>.</td></tr>
</table>
<div class="callout">Trên Mac hay Windows, mọi chuyện này xảy ra BÊN TRONG máy ảo của Docker Desktop: một container <code>--memory 16g</code> trên máy ảo 7,7 GiB sẽ bị máy ảo chặn lại từ lâu trước khi chạm tới trần của chính nó. Khi <code>next build</code> cứ chết giữa chừng, hãy tăng RAM của máy ảo ở Docker Desktop → Settings → Resources.</div>
<h3>Chạm trần: exit 137, và cái bẫy swap</h3>
${slide('dk-01', 7, 'Vượt trần bộ nhớ ⇒ SIGKILL ⇒ exit 137')}
<p>Thử thí nghiệm hiển nhiên trước — cấp phát 400 MB dưới trần 256 MB:</p>
<pre><code><span class="tok-comment"># Nhìn một giới hạn được thực thi: cấp phát 400MB với trần 256MB</span>
docker run --rm --memory 256m alpine sh -c \\
  'dd if=/dev/zero of=/dev/null bs=1M count=400 2&gt;/dev/null; \\
   head -c 400m /dev/zero | tail -c 1 &gt; /dev/null; echo sống sót'
echo "thoát: \$?"</code></pre>
<div class="out">sống sót
thoát: 0</div>
<p>Nó SỐNG — đo thật trên cả hai máy của khoá (Docker 29.6 trên Linux, Docker Desktop 4.91 trên Mac). Hai lý do. <code>tail -c 1</code> chỉ giữ đúng byte cuối, nên đường ống không bao giờ ôm cả 400 MB một lúc. Và kể cả khi cấp phát thật 400 MB thì vẫn lọt, vì riêng <code>--memory 256m</code> đã cho phép thêm 256 MB swap (bảng ở trên). Bản cũ của bài này in <code>thoát: 137</code> ở đây; thực tế không như vậy. Muốn nhìn giới hạn cắn cho chắc thì cấm swap và cấp phát MỘT lần thật sự lớn hơn trần — <code>dd</code> với khối 200 MB cấp phát một bộ đệm 200 MB trong một lần:</p>
<pre><code class="language-bash">docker run --name oom --memory 128m --memory-swap 128m alpine dd if=/dev/zero of=/dev/null bs=200M count=1
echo "thoát: \$?"
docker inspect -f 'OOMKilled={{.State.OOMKilled}} ExitCode={{.State.ExitCode}}' oom
docker rm oom</code></pre>
<div class="out">thoát: 137
OOMKilled=true ExitCode=137</div>
<p>Với <code>bs=100M</code> — dưới trần — cùng lệnh đó in <code>1+0 records out</code> và thoát 0. <code>OOMKilled=true</code> là trường cần kiểm mỗi khi thấy 137: đó là Docker báo rằng kẻ giết OOM của nhân, chứ không phải một con người, đã kết thúc tiến trình. Chính là chuyện <code>next build</code> bị giết exit 137 trên VPS 6 GB của một dự án sinh viên: không ai gõ lệnh dừng nào cả.</p>
<p>Mã thoát 137 là 128 + 9: bị SIGKILL giết. Kẻ giết OOM của nhân đã thực thi cái giới hạn cgroup. Hãy nhớ con số này — ở Chương 12 nó là mã thoát bí ẩn phổ biến nhất, và nó luôn mang cùng một nghĩa.</p>

<h3>Ranh giới đó KHÔNG bao gồm những gì</h3>
${slide('dk-01', 8, 'Ranh giới mỏng ở bốn chỗ')}
<div class="kv-grid">
  <div class="kv"><span class="k">Chính cái nhân</span><span class="v">Một lỗ hổng của nhân là một lỗ hổng thoát container. Đây là lý do căn bản khiến container là một ranh giới yếu hơn máy ảo, và là lý do các nền tảng nhiều khách hàng phải thêm gVisor, Kata Containers hoặc một máy ảo thật cho mỗi khách.</span></div>
  <div class="kv"><span class="k">Cái đồng hồ</span><span class="v">Namespace <code>time</code> có tồn tại nhưng Docker không dùng. Giờ trong container là giờ của máy chủ, đó là lý do một cái đồng hồ máy chủ bị lệch làm hỏng TLS trong MỌI container cùng một lúc.</span></div>
  <div class="kv"><span class="k">Định danh người dùng, theo mặc định</span><span class="v">UID 0 trong container là UID 0 trên máy chủ. Một file do tiến trình root trong container ghi ra sẽ thuộc sở hữu root trên một thư mục máy chủ được bind mount — bài toán thực tế khó chịu nhất của Chương 7.</span></div>
  <div class="kv"><span class="k">Bất cứ thứ gì bạn CHỦ ĐỘNG chia sẻ</span><span class="v"><code>--net=host</code> bỏ namespace mạng. <code>--pid=host</code> bỏ namespace tiến trình. <code>-v /var/run/docker.sock:/var/run/docker.sock</code> trao cho container quyền điều khiển toàn bộ tiến trình nền. Mỗi cái đều chính đáng và mỗi cái đều làm tan một phần ranh giới.</span></div>
  <div class="kv"><span class="k">Mô-đun nhân, phần lớn /sys, và phần lớn capability</span><span class="v">Docker mặc định bỏ đi phần lớn capability của Linux và áp một bộ lọc seccomp chặn khoảng 44 lời gọi hệ thống. Mức mặc định đó là một phần lớn của sự an toàn — Chương 6 nói <code>--privileged</code> vứt đi những gì.</span></div>
</div>
<pre><code><span class="tok-comment"># Nhìn ranh giới tan ra — cùng câu lệnh, hơn nhau một cái cờ</span>
docker run --rm alpine hostname
docker run --rm --uts=host alpine hostname
docker run --rm alpine ip -o addr | wc -l
docker run --rm --net=host alpine ip -o addr | wc -l</code></pre>
<div class="out">3f21a9c04b8e
vps-1
4
18</div>
<p>Đọc nó thế này: không có cờ thì tên máy là ID ngắn của container và container chỉ thấy vài giao diện mạng của riêng nó (loopback và một <code>eth0</code>). Thêm một cờ là nó báo tên của máy chủ và MỌI giao diện mạng máy chủ có. Trên máy Linux của khoá, bốn lệnh đó in <code>15636845bee3</code>, <code>CuongThai</code>, <code>3</code> và <code>23</code> — con số tuỳ máy, còn quy luật thì không đổi. Đồng hồ là chỗ mỏng thứ tư, và nhìn thấy rất dễ:</p>
<pre><code class="language-bash">docker run --rm alpine date +%H:%M:%S ; date +%H:%M:%S</code></pre>
<div class="out">13:17:09
20:17:09</div>
<p>Cùng một giây, hai cách hiển thị: container không có <code>/etc/localtime</code> nên in giờ UTC; máy chủ in giờ Việt Nam (+07). Cái đồng hồ bên dưới là một. Đó là lý do log của container trông như "chậm bảy tiếng" — là múi giờ, không phải đồng hồ sai (Chương 2 chỉ cách đặt <code>TZ</code>).</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bạn trong nhóm SWP391 nói "container là máy ảo mini, cứ chạy cái script lạ trên GitHub trong đó là an toàn tuyệt đối". Dùng chính terminal của bạn để chỉ ra container thật ra là gì — và tường của nó dừng ở đâu.</p><ol>
<li>Tạo thư mục sân tập của khoá và hai container: <code>mkdir -p ~/thu-docker &amp;&amp; cd ~/thu-docker</code>, rồi <code>docker run -d --name thu-a nginx:1.27-alpine</code> và <code>docker run -d --name thu-b nginx:1.27-alpine</code>.</li>
<li>Đọc namespace của cả hai container bằng container phụ <code>--pid=host</code> ở mục "Chạy thử từng bước" phía trên. Ghi lại số nào khác nhau và số nào GIỐNG HỆT ở cả hai.</li>
<li>Chạy <code>docker run --rm alpine uname -r</code> và <code>docker run --rm ubuntu:24.04 uname -r</code>. Trên Mac, chạy thêm <code>uname -r</code> ở terminal của bạn. Mỗi lần là nhân của ai trả lời?</li>
<li>Cố ý gây một cú giết vì hết bộ nhớ và chứng minh chính cgroup làm việc đó (khối lệnh bên dưới).</li>
<li>Dọn dẹp: <code>docker rm -f thu-a thu-b thu-oom</code>.</li></ol>
<pre><code class="language-bash">docker run --name thu-oom --memory 128m --memory-swap 128m alpine dd if=/dev/zero of=/dev/null bs=200M count=1
echo "thoát: \$?"
docker inspect -f 'OOMKilled={{.State.OOMKilled}}' thu-oom</code></pre>
<div class="out">thoát: 137
OOMKilled=true</div>
<p><strong>Đạt khi:</strong> bạn chỉ ra được namespace duy nhất mà <code>thu-a</code> và <code>thu-b</code> dùng chung (<code>user</code>) và giải thích vì sao điều đó nghĩa là "root trong = root ngoài"; hai lệnh <code>uname -r</code> in cùng một nhân; và bạn nhận được <code>thoát: 137</code> kèm <code>OOMKilled=true</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Namespace (không gian tên)</span><span class="v">Tính năng của nhân cho một tiến trình tầm nhìn riêng về một loại tài nguyên: file, số tiến trình, mạng, tên máy…</span></div>
  <div class="kv"><span class="k">cgroup (nhóm kiểm soát)</span><span class="v">Tính năng của nhân giới hạn và đo xem một nhóm tiến trình được dùng bao nhiêu RAM, CPU và bao nhiêu tiến trình.</span></div>
  <div class="kv"><span class="k">Kernel (nhân)</span><span class="v">Lõi của hệ điều hành, thứ nói chuyện với phần cứng. Mọi container trên một máy dùng chung MỘT nhân của máy đó.</span></div>
  <div class="kv"><span class="k">Host PID / container PID (mã tiến trình)</span><span class="v">Một tiến trình, hai con số: 367975 theo máy chủ, 1 theo container.</span></div>
  <div class="kv"><span class="k">OOM killer (kẻ giết khi hết bộ nhớ)</span><span class="v">Cơ chế của nhân giết một tiến trình khi cạn RAM — trong container là khi chạm trần của cgroup.</span></div>
  <div class="kv"><span class="k">Exit code 137 (mã thoát)</span><span class="v">128 + 9: tiến trình bị tín hiệu số 9, SIGKILL, giết. Đi kèm <code>OOMKilled=true</code> nghĩa là "hết bộ nhớ".</span></div>
  <div class="kv"><span class="k">Virtual machine (máy ảo)</span><span class="v">Phần cứng giả lập chạy nhân riêng. Cô lập mạnh hơn, khởi động chậm hơn, nặng hơn. Docker Desktop chính là một máy ảo.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Container là một tiến trình Linux bình thường được bật namespace (thấy gì) và cgroup (dùng bao nhiêu).</li>
<li>Mọi namespace đều riêng của container, trừ <code>user</code> — nên root bên trong là root trên máy chủ.</li>
<li>Chỉ có một nhân: <code>uname -r</code> trong và ngoài giống nhau; trên Mac đó là nhân của máy ảo Docker Desktop.</li>
<li><code>--memory</code>, <code>--cpus</code>, <code>--pids-limit</code> chỉ là những con số Docker ghi vào file dưới <code>/sys/fs/cgroup</code>.</li>
<li>Exit 137 = SIGKILL; hãy kiểm <code>.State.OOMKilled</code>, và nhớ rằng swap nâng trần thật lên trừ khi <code>--memory-swap</code> bằng <code>--memory</code>.</li>
<li>Các cờ <code>--net=host</code>, <code>--pid=host</code>, <code>--privileged</code> hay gắn <code>docker.sock</code> cố ý dỡ tường; mã không tin được thì cần máy ảo hoặc gVisor.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man7/namespaces.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">namespaces(7) — sổ tay Linux</span><span class="lc-sub">Nguồn gốc về việc mỗi namespace cô lập cái gì, do chính những người hiện thực chúng viết. Đặc, ngắn, và là câu trả lời dứt khoát mỗi khi một container "nhìn thấy" thứ bạn không ngờ.</span></span>
</a>
<a class="link-card" href="https://docs.kernel.org/admin-guide/cgroup-v2.html" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Control Group v2 — tài liệu nhân</span><span class="lc-sub">Giải thích mọi file dưới <code>/sys/fs/cgroup</code>, gồm <code>memory.max</code>, <code>cpu.max</code> và các chỉ số sức ép. Đây chính là thứ mà <code>--memory</code> và <code>--cpus</code> ghi vào.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/security/" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">An ninh của Docker</span><span class="lc-sub">Bản tường thuật trung thực của nhà phát hành về việc ranh giới container bảo vệ và KHÔNG bảo vệ được gì, gồm bộ capability mặc định và hồ sơ seccomp. Đọc trước khi chạy bất cứ thứ gì không đáng tin.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: nhìn thấy cái ranh giới</span><span class="lc-sub">Bài chấm điểm: đối chiếu ID namespace của một container với của máy chủ, đọc một giới hạn bộ nhớ ra từ cgroup v2, cố ý tạo ra một cú exit 137, và giải thích <code>--net=host</code> vứt đi cái gì.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> coi ranh giới container là một ranh giới an ninh đủ mạnh cho mã thù địch. Nó là một ranh giới thật và nó chặn được rất nhiều — nhưng nhân thì dùng chung, nên một con bọ của nhân mà với tới được từ bên trong là một cú thoát, còn <code>--privileged</code> hay một cái <code>docker.sock</code> được gắn vào thì xoá sạch ranh giới đó theo đúng thiết kế. Container tuyệt vời cho việc cô lập <em>CÁC TẢI CÔNG VIỆC CỦA CHÍNH BẠN</em> khỏi nhau và khỏi trình quản lý gói của máy chủ. Còn để chạy mã bạn không viết và không tin thì câu trả lời trung thực là một máy ảo cho mỗi khách, hoặc một môi trường chạy được đóng hộp cát như gVisor.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Namespace điều khiển thứ một tiến trình NHÌN THẤY còn cgroup điều khiển thứ nó DÙNG ĐƯỢC — mọi tính năng container bạn gặp về sau đều là một trong hai cái đó, khoác một cái tên thân thiện hơn. Có đúng MỘT cái nhân: <code>uname -r</code> giống hệt nhau trong và ngoài, đó là toàn bộ lý do container nhanh và nhẹ, và cũng là toàn bộ lý do ranh giới của nó mỏng hơn của máy ảo. Và mã thoát 137 nghĩa là SIGKILL, mà chín trên mười lần nghĩa là đã chạm trần bộ nhớ của cgroup.</p>
</div>
`,
    },
    /* ─────────────────────────── 1.2 ─────────────────────────── */
    {
      title: '1.2 — Images are stacks of layers|||1.2 — Image là những chồng tầng',
      slug: 'dk-1-2-tang-anh',
      type: 'LESSON',
      description: 'docker history đọc ngược một ảnh, tầng là nội dung được băm, overlayfs với lowerdir/upperdir, sao chép-khi-ghi, file whiteout, và vì sao RUN rm không xoá được một bí mật khỏi ảnh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Images are stacks of layers</h2>
<p class="lead">An image is not a disk file. It is an ordered stack of read-only <strong>layers</strong>, each one a tar archive of "what changed at this step", plus a small JSON config saying which command to run and with what environment. Understanding the stack explains build caching, image size, why deleting a file does not shrink an image, and why pulling your second image from the same base is nearly instant.</p>

<h3>Read an image backwards</h3>
${slide('dk-01', 9, 'docker history đọc ngược Dockerfile, từ dưới lên')}
<pre><code>docker pull node:22-alpine
docker history node:22-alpine</code></pre>
<div class="out">IMAGE          CREATED       CREATED BY                                      SIZE      COMMENT
b8f2c1a4e9d3   3 weeks ago   CMD ["node"]                                    0B        buildkit.dockerfile.v0
&lt;missing&gt;      3 weeks ago   ENTRYPOINT ["docker-entrypoint.sh"]             0B        buildkit.dockerfile.v0
&lt;missing&gt;      3 weeks ago   COPY docker-entrypoint.sh /usr/local/bin/ #…    388B      buildkit.dockerfile.v0
&lt;missing&gt;      3 weeks ago   RUN /bin/sh -c apk add --no-cache --virtual…    9.31MB    buildkit.dockerfile.v0
&lt;missing&gt;      3 weeks ago   ENV YARN_VERSION=1.22.22                        0B        buildkit.dockerfile.v0
&lt;missing&gt;      3 weeks ago   RUN /bin/sh -c addgroup -g 1000 node &amp;&amp; addu…   167MB     buildkit.dockerfile.v0
&lt;missing&gt;      3 weeks ago   ENV NODE_VERSION=22.11.0                        0B        buildkit.dockerfile.v0
&lt;missing&gt;      6 weeks ago   CMD ["/bin/sh"]                                 0B        buildkit.dockerfile.v0
&lt;missing&gt;      6 weeks ago   ADD alpine-minirootfs-3.20.3-x86_64.tar.gz /…   8.83MB    buildkit.dockerfile.v0</div>
<p>Read it bottom to top and you are reading the Dockerfile that produced it. Alpine's root filesystem goes down first (8.83MB), then Node is installed (167MB — this is where the size lives), then yarn, then an entrypoint script, then metadata. Two things are worth noticing immediately:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Instructions that add no files are 0B</span><span class="v"><code>ENV</code>, <code>CMD</code>, <code>ENTRYPOINT</code>, <code>WORKDIR</code>, <code>LABEL</code> and <code>EXPOSE</code> only change the config JSON. They are still cache steps, but they add nothing to the download.</span></div>
  <div class="kv"><span class="k">&lt;missing&gt; is not an error</span><span class="v">Intermediate images have no local ID unless you built them yourself. Only the final image gets an ID. Nothing is broken and nothing is missing.</span></div>
  <div class="kv"><span class="k">One RUN dominates</span><span class="v">167MB in a single step. Chapter 5 is largely about arranging for that step to stay cached, and Chapter 6 about making it smaller.</span></div>
  <div class="kv"><span class="k">Order equals cost</span><span class="v">A change to the last instruction rebuilds one layer. A change to the first rebuilds everything above it. This one sentence is worth a whole chapter, and gets one.</span></div>
</div>

<h3>Reading docker history column by column</h3>
<table>
<tr><th>Column</th><th>What it tells you</th></tr>
<tr><td><code>IMAGE</code></td><td>ID of the image at that step. Only the top line has one; <code>&lt;missing&gt;</code> below just means "an intermediate step you did not build yourself".</td></tr>
<tr><td><code>CREATED</code></td><td>When that step was built — the base (<code>ADD alpine-minirootfs…</code>) is usually older than the steps above it.</td></tr>
<tr><td><code>CREATED BY</code></td><td>The Dockerfile instruction, cut to 45 characters. Add <code>--no-trunc</code> to see the whole command.</td></tr>
<tr><td><code>SIZE</code></td><td>How many bytes that step added. <code>0B</code> = it only changed the config (ENV, CMD, EXPOSE…).</td></tr>
<tr><td><code>COMMENT</code></td><td><code>buildkit.dockerfile.v0</code> = built from a Dockerfile by BuildKit. A <code>docker commit</code> puts your <code>-m</code> message here (Lesson 1.4).</td></tr>
</table>
<p>When you only care about sizes, ask for exactly the columns you want. On the course's Mac (arm64) the same image reads:</p>
<pre><code class="language-bash">docker history node:22-alpine --format 'table {{.Size}}\\t{{.CreatedBy}}'</code></pre>
<div class="out">SIZE      CREATED BY
0B        CMD ["node"]
0B        ENTRYPOINT ["docker-entrypoint.sh"]
20.5kB    COPY docker-entrypoint.sh /usr/local/bin/ # …
5.48MB    RUN /bin/sh -c apk add --no-cache --virtual …
0B        ENV YARN_VERSION=1.22.22
156MB     RUN /bin/sh -c addgroup -g 1000 node     &amp;&amp; …
0B        ENV NODE_VERSION=22.23.2
0B        CMD ["/bin/sh"]
9.31MB    ADD alpine-minirootfs-3.24.1-aarch64.tar.gz …</div>
<p>Same shape, different numbers: a newer Node (22.23.2), a newer Alpine (3.24.1) and the <code>aarch64</code> build for Apple Silicon. The same tag names a different image on every architecture and every month — which is why Chapter 3 pins images by digest.</p>

<h3>Layers are content, and content has a hash</h3>
${slide('dk-01', 10, 'Tầng giống hệt nhau lưu và tải đúng một lần')}
<pre><code>docker image inspect node:22-alpine --format '{{json .RootFS.Layers}}' | tr ',' '\\n' | head -4
docker image inspect node:22-alpine --format '{{.Id}}'</code></pre>
<div class="out">["sha256:b2848c02ac6ff53d265469b5b30f649f335e546a83330cd8916d54e65e640409"
"sha256:d3fef5bdc333a5f541322c84298b0e6cef6957113ad169e848a42c4b779fbe2c"
"sha256:6382a4ffb7a1147244ea17d36036bbe78056eaeedc165f16dfce8ad3e956ce77"
"sha256:113c868d88add51aa5c6427b11bb578161ee73557ae501571e0ca3699d229dae"]
sha256:c610fcdfb1d5b4740dd70c284ed3cb16bb857e0f7166196e36a5501df7a3aa32</div>
<p class="note-ct">Output from the course's Mac (Docker Desktop 4.91, arm64) — an earlier version of this lesson showed made-up digests here. Your digests will differ: they are hashes of the exact bytes of <em>your</em> copy of the image, which depends on its version and CPU architecture.</p>
<p>Every layer is identified by the SHA-256 of its contents. That is what makes the whole system work: if two images contain a byte-identical layer, it is <em>the same layer</em>, stored once on disk and downloaded once. Pull <code>node:22-alpine</code> and then <code>nginx:1.27-alpine</code> and the shared Alpine base is fetched only the first time.</p>
<pre><code>docker images node --format '{{.Repository}}:{{.Tag}} {{.Size}}'
docker images nginx --format '{{.Repository}}:{{.Tag}} {{.Size}}'
docker system df</code></pre>
<div class="out">node:22-alpine 185MB
node:20-alpine 178MB
nginx:1.27-alpine 52.5MB
TYPE      TOTAL   ACTIVE   SIZE      RECLAIMABLE
Images    3       0        281.6MB   281.6MB (100%)</div>
<div class="callout ok"><strong>185 + 178 + 52.5 = 415.5MB of images occupying 281.6MB of disk.</strong> The <code>SIZE</code> column in <code>docker images</code> is the <em>logical</em> size of each image on its own — shared layers are counted in every image that uses them. <code>docker system df</code> reports what the disk actually holds. Whenever those two numbers disagree, layer sharing is the reason, and the bigger the gap the better your base-image discipline is.</div>

<h3>Docker 29 changed the numbers: DISK USAGE and CONTENT SIZE</h3>
<p>Since Docker Engine 29.0, a fresh install stores images in the <strong>containerd image store</strong> instead of the old <code>overlay2</code> graph driver; an upgraded install keeps <code>overlay2</code> until you switch (docs.docker.com, checked 09/2026). Docker Desktop on the course's Mac uses the containerd store too. Check yours:</p>
<pre><code class="language-bash">docker info -f '{{ .DriverStatus }}'
docker images node:22-alpine</code></pre>
<div class="out">[[driver-type io.containerd.snapshotter.v1]]
IMAGE            ID             DISK USAGE   CONTENT SIZE   EXTRA
node:22-alpine   b6f26b36c8ff        237MB         61.2MB   U</div>
<table>
<tr><th>You see</th><th>Meaning</th></tr>
<tr><td><code>[[driver-type io.containerd.snapshotter.v1]]</code></td><td>containerd image store (default for new Docker 29 installs, and on Docker Desktop).</td></tr>
<tr><td>something mentioning <code>overlay2</code></td><td>The classic storage driver — typical on a VPS that was installed before 2026 and upgraded since. Everything in this lesson still applies.</td></tr>
<tr><td><code>CONTENT SIZE 61.2MB</code></td><td>The compressed layers — what <code>docker pull</code> downloads and <code>docker push</code> uploads.</td></tr>
<tr><td><code>DISK USAGE 237MB</code></td><td>Compressed layers <em>plus</em> the unpacked copy that containers actually run from. The containerd store keeps both, which is why the same image looks bigger on disk than it did with <code>overlay2</code>.</td></tr>
<tr><td><code>EXTRA U</code></td><td>In use — at least one container was created from this image.</td></tr>
</table>
<p>Layer sharing is unchanged. On the course's Linux machine, <code>alpine:latest</code> and <code>node:22-alpine</code> start from the very same layer:</p>
<pre><code class="language-bash">docker image inspect alpine:latest node:22-alpine \\
  --format '{{.RepoTags}} {{len .RootFS.Layers}} {{index .RootFS.Layers 0}}'</code></pre>
<div class="out">[alpine:latest] 1 sha256:74d97c428c51a828f9051a7a40a53ff1fc99e54fc30323ce36760701b0b7f711
[node:22-alpine] 4 sha256:74d97c428c51a828f9051a7a40a53ff1fc99e54fc30323ce36760701b0b7f711</div>

<h3>How the stack becomes one filesystem: overlayfs</h3>
${slide('dk-01', 11, 'overlayfs: lowerdir + upperdir ⇒ merged')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Container writable layer (upperdir)</span><span class="lz-lnote">Created when the container starts, destroyed when it is removed. Every file the process writes or modifies lands here. This is the layer that makes containers disposable — and the reason your database data disappears.</span></div>
  <div class="lz-layer"><span class="lz-lname">Layer 4 — COPY docker-entrypoint.sh</span><span class="lz-lnote">Read-only. 388 bytes.</span></div>
  <div class="lz-layer"><span class="lz-lname">Layer 3 — RUN apk add yarn</span><span class="lz-lnote">Read-only. 9.31MB.</span></div>
  <div class="lz-layer"><span class="lz-lname">Layer 2 — RUN install node</span><span class="lz-lnote">Read-only. 167MB. Shared by every image built FROM node:22-alpine.</span></div>
  <div class="lz-layer"><span class="lz-lname">Layer 1 — ADD alpine rootfs (lowerdir)</span><span class="lz-lnote">Read-only. 8.83MB. Shared by every Alpine-based image on the machine.</span></div>
</div>
<pre><code>docker run -d --name n1 node:22-alpine sleep 600
docker inspect n1 --format '{{json .GraphDriver.Data}}' | tr ',' '\\n'</code></pre>
<div class="out">{"LowerDir":"/var/lib/docker/overlay2/8fa1…/diff:/var/lib/docker/overlay2/2b7c…/diff"
 "MergedDir":"/var/lib/docker/overlay2/9e4d…/merged"
 "UpperDir":"/var/lib/docker/overlay2/9e4d…/diff"
 "WorkDir":"/var/lib/docker/overlay2/9e4d…/work"}</div>
<div class="kv-grid">
  <div class="kv"><span class="k">LowerDir</span><span class="v">The image's read-only layers, colon-separated, topmost first. Shared between every container started from this image — a hundred containers from one image add no image bytes at all.</span></div>
  <div class="kv"><span class="k">UpperDir</span><span class="v">This container's private writable layer. It starts empty. <code>docker rm</code> deletes this directory, and with it everything the container wrote.</span></div>
  <div class="kv"><span class="k">MergedDir</span><span class="v">The union: what the process actually sees as <code>/</code>. Files from the upper layer win; anything not there falls through to the lower ones in order.</span></div>
  <div class="kv"><span class="k">WorkDir</span><span class="v">Scratch space overlayfs needs to perform atomic operations. Never touch it.</span></div>
</div>
<div class="callout warn"><strong>On Docker 29 with the containerd store, that command no longer works.</strong> The course's Mac (Engine 29.8) answers <code>map has no entry for key "GraphDriver"</code>; the Linux machine (Engine 29.6) prints <code>null</code>. The same three directories still exist — they are just owned by containerd now. <code>docker inspect</code> only names the snapshotter, and the host's mount table shows the rest (Linux; no sudo needed to read it):</div>
<pre><code class="language-bash">docker inspect n1 --format '{{json .Storage}}'
findmnt -t overlay -o TARGET | grep \$(docker inspect -f '{{.Id}}' n1)
findmnt -no OPTIONS &lt;that TARGET&gt; | tr ',' '\\n' | grep dir</code></pre>
<div class="out">{"RootFS":{"Snapshot":{"Name":"overlayfs"}}}
/var/lib/docker/rootfs/overlayfs/5665d536212889f6ce4da5eba567741cb0cc769132b02dc4307c7d3d22a768d4
lowerdir=/var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/18481/fs:…/18480/fs:…/18479/fs:…/18478/fs:…/18444/fs
upperdir=/var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/18482/fs
workdir=/var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/18482/work</div>
<p>Read the <code>lowerdir</code> list right to left, bottom to top: <code>18444</code> is the Alpine base — its number is much lower because it was unpacked earlier, when <code>alpine:latest</code> was pulled, and <code>node:22-alpine</code> simply reused it. <code>18478</code>–<code>18480</code> are Node's own three layers, and <code>18481</code> is a thin layer Docker adds for every container (the placeholders for <code>/etc/hosts</code>, <code>/etc/resolv.conf</code>, <code>/etc/hostname</code>). <code>upperdir</code> is this container's private writable layer. That is the whole picture on slide 11.</p>

<h3>Copy-on-write, demonstrated</h3>
${slide('dk-01', 12, 'Ghi lần đầu chép trọn file lên tầng ghi')}
<pre><code>docker exec n1 sh -c 'ls -l /usr/local/bin/node | cut -c1-60'
docker exec n1 sh -c 'echo hi &gt;&gt; /usr/local/bin/docker-entrypoint.sh'
docker diff n1 | head -6
docker ps -s --filter name=n1 --format '{{.Names}} {{.Size}}'</code></pre>
<div class="out">-rwxr-xr-x    1 root     root     126241888 Jul 29 17:57 /us
C /usr
C /usr/local
C /usr/local/bin
C /usr/local/bin/docker-entrypoint.sh
n1 32.8kB (virtual 170MB)</div>
<p>Appending two bytes to a 388-byte file copied the whole file up into the writable layer — <code>C</code> for changed. Reading needs no copy; the first <em>write</em> to any file copies it up first, whatever its size. That is why editing a 2GB file inside a container briefly costs 2GB of disk, and why <code>docker ps -s</code> shows two numbers: the container's own writable bytes, and the shared image behind it.</p>
<p class="note-ct">Output from the course's Mac (Docker Desktop 4.91); an earlier version of this lesson had two stray lines in it. The container's size is the real disk space of its writable layer, rounded to disk blocks and counting the directories that were copied up with the file — so it is larger than the 391 bytes of the file and differs between machines (32.8kB on the Mac, 4.1kB on the Linux machine).</p>

<h3>Deleting does not shrink — and this matters for secrets</h3>
${slide('dk-01', 13, 'Xoá chỉ là dán nhãn .wh — byte gốc vẫn trong ảnh')}
<pre><code>docker exec n1 rm /usr/local/bin/docker-entrypoint.sh
docker diff n1 | grep entrypoint
docker exec n1 ls /usr/local/bin/</code></pre>
<div class="out">D /usr/local/bin/docker-entrypoint.sh
corepack
node
npm
npx
yarn
yarnpkg</div>
<p>The file is invisible to the container, but nothing was reclaimed. Overlayfs records a deletion by writing a <strong>whiteout</strong> marker into the upper layer — a tiny special file meaning "pretend this is not there". The original bytes are still sitting in the read-only layer below, because read-only layers are immutable by definition.</p>
<h3>Run it step by step: find the "deleted" file inside an image</h3>
<p>Seeing is believing. Freeze the container into an image, unpack the image, and look inside each layer:</p>
<pre><code class="language-bash">docker commit n1 snap:1                        <span class="tok-comment"># the container, with its whiteout, becomes an image</span>
mkdir snap &amp;&amp; docker save snap:1 | tar -x -C snap
ls snap
for f in snap/blobs/sha256/*; do
  tar -tzvf "\$f" 2&gt;/dev/null | grep 'docker-entrypoint' &amp;&amp; echo "   ↑ in blob &#36;{f##*/}"
done</code></pre>
<div class="out">blobs
index.json
manifest.json
oci-layout
----------  0 0      0           0 Jan  1  1970 usr/local/bin/.wh.docker-entrypoint.sh
   ↑ in blob 19f42a97bfc199430fc9f0cb1510a9930fd766d9e83c8be343d1d5b56609fc36
-rwxr-xr-x  0 0      0         388 Jul 30 00:26 usr/local/bin/docker-entrypoint.sh
   ↑ in blob 5e275a5205a078c58e96d07db2891244cea6f217eb335edba0807ddf3661b59e</div>
<table>
<tr><th>Piece</th><th>What it does</th></tr>
<tr><td><code>docker save snap:1 | tar -x -C snap</code></td><td>Writes the image as an OCI layout (a folder of files) and unpacks it into <code>snap/</code>. Every layer is one gzip-compressed tar inside <code>blobs/sha256/</code>, named by its hash.</td></tr>
<tr><td><code>tar -tzvf "\$f"</code></td><td>List (<code>t</code>) a gzip (<code>z</code>) archive verbosely (<code>v</code>) from a file (<code>f</code>). The JSON blobs are not archives; <code>2&gt;/dev/null</code> hides their errors.</td></tr>
<tr><td><code>&#36;{f##*/}</code></td><td>Shell trick: the file name without its folder — the blob's hash.</td></tr>
</table>
<p>Two blobs, two truths: the top layer holds a zero-byte file called <code>.wh.docker-entrypoint.sh</code> — that <em>is</em> the whiteout — and an older layer still holds all 388 bytes of the original. <code>tar -xzOf snap/blobs/sha256/5e27… usr/local/bin/docker-entrypoint.sh</code> would print it. Clean up with <code>rm -rf snap; docker rmi snap:1</code>.</p>
<div class="pitfall"><strong>Pitfall — this is the big one:</strong> a secret added in one Dockerfile layer and removed in a later one is <strong>still in the image</strong>, and anyone who pulls it can read it.
<pre><code><span class="tok-comment"># WRONG — the key is permanently in layer 2, whatever layer 3 does</span>
COPY id_rsa /root/.ssh/id_rsa
RUN git clone git@github.com:me/private.git &amp;&amp; rm /root/.ssh/id_rsa</code></pre>
Extracting it takes one command: <code>docker save img | tar -x</code> and read the layer tars. The same applies to a <code>.env</code> you <code>COPY</code>ed then deleted, and to <code>ARG NPM_TOKEN</code>, which is also visible in <code>docker history</code>. Chapter 6 covers the correct tools — BuildKit secret mounts (<code>RUN --mount=type=secret</code>) and multi-stage builds, both of which keep the secret out of every published layer.</div>

<h3>Two rules that fall out of this</h3>
${slide('dk-01', 14, 'Hai luật: ít đổi để dưới, dọn trong cùng RUN')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Rule 1 · Put what changes rarely at the bottom</span><span class="lz-t">system packages → dependencies → your source</span><span class="lz-d">A layer is invalidated by any change below it. Source code changes hourly; the base OS changes monthly. Ordering by change frequency is the whole of build-cache strategy (Chapter 5).</span></div>
  <div class="lz-step"><span class="lz-k">Rule 2 · Clean up in the SAME layer that made the mess</span><span class="lz-t">RUN apt-get install … &amp;&amp; rm -rf /var/lib/apt/lists/*</span><span class="lz-d">One <code>RUN</code> is one layer, so the install and the cleanup net out to a smaller diff. Two separate <code>RUN</code>s keep the full weight of the first, plus a whiteout. This one habit routinely saves 100MB+.</span></div>
</div>
<pre><code>docker rm -f n1
docker image inspect node:22-alpine --format '{{len .RootFS.Layers}} layers'</code></pre>
<div class="out">4 layers</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a teammate's Dockerfile does <code>COPY .env /app/.env</code> and then <code>RUN rm /app/.env</code>. "It's deleted, the container doesn't even see it," they say, and push the image. Prove the database password is still inside.</p><ol>
<li><code>mkdir -p ~/thu-docker/lo-env &amp;&amp; cd ~/thu-docker/lo-env</code>, then create a fake secret and the Dockerfile (block below).</li>
<li>Build and run it: <code>docker build -t thu-lo-env:1 .</code> then <code>docker run --rm thu-lo-env:1</code> — <code>/app</code> looks empty.</li>
<li>Read <code>docker history thu-lo-env:1</code>. Is the <code>RUN rm</code> layer negative? What size is it?</li>
<li>Unpack the image and search every layer: <code>mkdir out &amp;&amp; docker save thu-lo-env:1 | tar -x -C out</code>, then the <code>for f in out/blobs/sha256/*</code> loop from "Run it step by step" with <code>grep app/</code>. Print the secret with <code>tar -xzOf out/blobs/sha256/&lt;blob&gt; app/.env</code>.</li>
<li>Clean up: <code>cd .. &amp;&amp; rm -rf lo-env &amp;&amp; docker rmi thu-lo-env:1</code>.</li></ol>
<pre><code class="language-bash">printf 'DB_PASS=bimat123\\n' &gt; .env
cat &gt; Dockerfile &lt;&lt;'EOF'
FROM alpine:latest
COPY .env /app/.env
RUN rm /app/.env
CMD ["ls","-la","/app"]
EOF</code></pre>
<p>What the course's Mac printed at step 4 (two blobs match: the layer with the file, and the layer with its whiteout):</p>
<div class="out">-rw-r--r--  0 0      0          17 Sep 23 20:36 app/.env
----------  0 0      0           0 Jan  1  1970 app/.wh..env
DB_PASS=bimat123</div>
<p><strong>Done when:</strong> <code>DB_PASS=bimat123</code> is printed from the image although <code>docker run</code> shows an empty <code>/app</code>, and you can say in one sentence why <code>RUN rm</code> cannot help (the fix — <code>.dockerignore</code> and build secrets — is Chapter 6).</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Image</span><span class="v">An ordered stack of read-only layers plus a small JSON config (command, environment, ports).</span></div>
  <div class="kv"><span class="k">Layer</span><span class="v">One tar archive of "what changed" at one build step, named by the hash of its contents.</span></div>
  <div class="kv"><span class="k">Digest</span><span class="v"><code>sha256:…</code> — the hash that identifies a layer or image. Same bytes, same digest, stored once.</span></div>
  <div class="kv"><span class="k">overlayfs</span><span class="v">The Linux filesystem that stacks directories: <code>lowerdir</code> (read-only layers) + <code>upperdir</code> (writable) = <code>merged</code> (what the process sees).</span></div>
  <div class="kv"><span class="k">Copy-on-write</span><span class="v">The first write to a file copies the whole file up into the writable layer; reads never copy.</span></div>
  <div class="kv"><span class="k">Whiteout</span><span class="v">A <code>.wh.</code> marker file meaning "hide this from the layers below". Deleting never removes bytes from an image.</span></div>
  <div class="kv"><span class="k">containerd image store</span><span class="v">Docker 29's default image storage for new installs: keeps compressed and unpacked layers, reports DISK USAGE and CONTENT SIZE.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>An image is a stack of read-only layers read bottom-up; <code>docker history</code> is its Dockerfile in reverse.</li>
<li>Layers are named by their content hash, so identical layers are stored and downloaded exactly once.</li>
<li>overlayfs merges the lower layers and one writable upper layer into the single <code>/</code> a container sees.</li>
<li>The first write to any file copies the whole file up; deletes only add a whiteout marker.</li>
<li>A secret added in one layer and deleted in the next is still in the image — anyone can extract it with <code>docker save</code>.</li>
<li>On Docker 29 check the store with <code>docker info -f '{{ .DriverStatus }}'</code>; GraphDriver is gone, use <code>findmnt</code> to see the layers.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/storage/drivers/overlayfs-driver/" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">The overlay2 storage driver</span><span class="lc-sub">How Docker stacks layers, what lowerdir/upperdir/merged mean on disk, how copy-on-write and whiteouts work, and the performance characteristics of each operation.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/storage/containerd/" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">containerd image store</span><span class="lc-sub">Why Docker 29 stores images differently, how to tell which store you are on, and how to switch an upgraded host.</span></span>
</a>
<a class="link-card" href="https://github.com/opencontainers/image-spec/blob/main/spec.md" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">OCI Image Specification</span><span class="lc-sub">The standard an image actually conforms to: the manifest, the config JSON, and the layer digests. Short and readable, and it explains why Podman, containerd and Kubernetes all consume Docker images unchanged.</span></span>
</a>
<a class="link-card" href="https://github.com/wagoodman/dive" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">dive — explore an image layer by layer</span><span class="lc-sub">A terminal UI showing each layer's file tree and what it added. <code>dive node:22-alpine</code> makes everything in this lesson visible, and finding the 200MB you did not mean to ship takes about ten seconds.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: read the stack</span><span class="lc-sub">Graded exercises: reconstruct a Dockerfile from <code>docker history</code>, explain why three images totalling 415MB occupy 281MB, and extract a "deleted" file from a published image's layers.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> An image is an ordered stack of content-addressed read-only layers plus a config — which is why identical layers are stored and transferred exactly once, and why <code>docker images</code> and <code>docker system df</code> disagree. A container adds one writable layer on top, and copy-on-write means the first write to any file copies the whole file up. And nothing is ever removed from a lower layer: a deletion is a whiteout marker, so a secret you added and then deleted is still shipped to everyone who pulls the image.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Image là những chồng tầng</h2>
<p class="lead">Image không phải một file đĩa. Nó là một chồng có thứ tự các <strong>TẦNG</strong> chỉ-đọc, mỗi tầng là một kho tar chứa "cái gì đã đổi ở bước này", cộng với một mẩu JSON cấu hình nói chạy câu lệnh nào và với môi trường ra sao. Hiểu cái chồng đó là giải thích được cache lúc dựng, kích thước ảnh, vì sao xoá một file không làm ảnh nhỏ đi, và vì sao kéo cái ảnh thứ hai từ cùng một ảnh nền lại gần như tức thì.</p>

<h3>Đọc một ảnh theo chiều ngược</h3>
${slide('dk-01', 9, 'docker history đọc ngược Dockerfile, từ dưới lên')}
<pre><code>docker pull node:22-alpine
docker history node:22-alpine</code></pre>
<div class="out">IMAGE          CREATED       CREATED BY                                      SIZE      COMMENT
b8f2c1a4e9d3   3 weeks ago   CMD ["node"]                                    0B        buildkit.dockerfile.v0
&lt;missing&gt;      3 weeks ago   ENTRYPOINT ["docker-entrypoint.sh"]             0B        buildkit.dockerfile.v0
&lt;missing&gt;      3 weeks ago   COPY docker-entrypoint.sh /usr/local/bin/ #…    388B      buildkit.dockerfile.v0
&lt;missing&gt;      3 weeks ago   RUN /bin/sh -c apk add --no-cache --virtual…    9.31MB    buildkit.dockerfile.v0
&lt;missing&gt;      3 weeks ago   ENV YARN_VERSION=1.22.22                        0B        buildkit.dockerfile.v0
&lt;missing&gt;      3 weeks ago   RUN /bin/sh -c addgroup -g 1000 node &amp;&amp; addu…   167MB     buildkit.dockerfile.v0
&lt;missing&gt;      3 weeks ago   ENV NODE_VERSION=22.11.0                        0B        buildkit.dockerfile.v0
&lt;missing&gt;      6 weeks ago   CMD ["/bin/sh"]                                 0B        buildkit.dockerfile.v0
&lt;missing&gt;      6 weeks ago   ADD alpine-minirootfs-3.20.3-x86_64.tar.gz /…   8.83MB    buildkit.dockerfile.v0</div>
<p>Đọc từ dưới lên là bạn đang đọc chính cái Dockerfile đã tạo ra nó. Hệ thống file gốc của Alpine xuống trước (8,83MB), rồi Node được cài (167MB — kích thước nằm ở đây), rồi yarn, rồi một script entrypoint, rồi siêu dữ liệu. Có hai điều đáng để ý ngay:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Chỉ thị không thêm file nào thì 0B</span><span class="v"><code>ENV</code>, <code>CMD</code>, <code>ENTRYPOINT</code>, <code>WORKDIR</code>, <code>LABEL</code> và <code>EXPOSE</code> chỉ đổi cái JSON cấu hình. Chúng vẫn là bước cache, nhưng không thêm gì vào phần phải tải về.</span></div>
  <div class="kv"><span class="k">&lt;missing&gt; KHÔNG phải lỗi</span><span class="v">Các ảnh trung gian không có ID cục bộ trừ khi chính bạn dựng chúng. Chỉ ảnh cuối cùng mới có ID. Không có gì hỏng và không có gì thiếu.</span></div>
  <div class="kv"><span class="k">Một dòng RUN áp đảo</span><span class="v">167MB trong đúng một bước. Chương 5 phần lớn là về việc thu xếp cho bước đó nằm yên trong cache, còn Chương 6 là về việc làm nó nhỏ đi.</span></div>
  <div class="kv"><span class="k">Thứ tự chính là chi phí</span><span class="v">Đổi chỉ thị CUỐI thì dựng lại một tầng. Đổi chỉ thị ĐẦU thì dựng lại mọi thứ nằm trên nó. Riêng câu này đáng giá cả một chương, và nó được một chương.</span></div>
</div>

<h3>Đọc docker history theo từng cột</h3>
<table>
<tr><th>Cột</th><th>Cho bạn biết gì</th></tr>
<tr><td><code>IMAGE</code></td><td>ID của ảnh ở bước đó. Chỉ dòng trên cùng có; <code>&lt;missing&gt;</code> ở dưới chỉ nghĩa là "bước trung gian mà bạn không tự dựng".</td></tr>
<tr><td><code>CREATED</code></td><td>Bước đó dựng lúc nào — tầng nền (<code>ADD alpine-minirootfs…</code>) thường cũ hơn các bước phía trên.</td></tr>
<tr><td><code>CREATED BY</code></td><td>Chỉ thị Dockerfile, bị cắt còn 45 ký tự. Thêm <code>--no-trunc</code> để xem trọn câu lệnh.</td></tr>
<tr><td><code>SIZE</code></td><td>Bước đó thêm bao nhiêu byte. <code>0B</code> = nó chỉ sửa cấu hình (ENV, CMD, EXPOSE…).</td></tr>
<tr><td><code>COMMENT</code></td><td><code>buildkit.dockerfile.v0</code> = dựng từ Dockerfile bằng BuildKit (bộ dựng mặc định). Một lệnh <code>docker commit</code> sẽ ghi lời nhắn <code>-m</code> của bạn vào đây (Bài 1.4).</td></tr>
</table>
<p>Khi chỉ quan tâm kích thước, hãy xin đúng những cột bạn cần. Trên máy Mac của khoá (arm64), cùng ảnh đó đọc ra thế này:</p>
<pre><code class="language-bash">docker history node:22-alpine --format 'table {{.Size}}\\t{{.CreatedBy}}'</code></pre>
<div class="out">SIZE      CREATED BY
0B        CMD ["node"]
0B        ENTRYPOINT ["docker-entrypoint.sh"]
20.5kB    COPY docker-entrypoint.sh /usr/local/bin/ # …
5.48MB    RUN /bin/sh -c apk add --no-cache --virtual …
0B        ENV YARN_VERSION=1.22.22
156MB     RUN /bin/sh -c addgroup -g 1000 node     &amp;&amp; …
0B        ENV NODE_VERSION=22.23.2
0B        CMD ["/bin/sh"]
9.31MB    ADD alpine-minirootfs-3.24.1-aarch64.tar.gz …</div>
<p>Cùng hình dạng, khác con số: Node mới hơn (22.23.2), Alpine mới hơn (3.24.1) và bản <code>aarch64</code> cho chip Apple. Cùng một cái tag nhưng là một ảnh KHÁC trên mỗi kiến trúc CPU và mỗi tháng — đó là lý do Chương 3 ghim ảnh bằng digest (mã băm).</p>

<h3>Tầng là NỘI DUNG, và nội dung thì có mã băm</h3>
${slide('dk-01', 10, 'Tầng giống hệt nhau lưu và tải đúng một lần')}
<pre><code>docker image inspect node:22-alpine --format '{{json .RootFS.Layers}}' | tr ',' '\\n' | head -4
docker image inspect node:22-alpine --format '{{.Id}}'</code></pre>
<div class="out">["sha256:b2848c02ac6ff53d265469b5b30f649f335e546a83330cd8916d54e65e640409"
"sha256:d3fef5bdc333a5f541322c84298b0e6cef6957113ad169e848a42c4b779fbe2c"
"sha256:6382a4ffb7a1147244ea17d36036bbe78056eaeedc165f16dfce8ad3e956ce77"
"sha256:113c868d88add51aa5c6427b11bb578161ee73557ae501571e0ca3699d229dae"]
sha256:c610fcdfb1d5b4740dd70c284ed3cb16bb857e0f7166196e36a5501df7a3aa32</div>
<p class="note-ct">Output thật trên máy Mac của khoá (Docker Desktop 4.91, arm64) — bản cũ của bài này in ở đây những mã băm bịa ra. Mã băm trên máy bạn sẽ khác: chúng là băm của đúng từng byte trong bản ảnh CỦA BẠN, mà bản đó phụ thuộc phiên bản và kiến trúc CPU.</p>
<p>Mỗi tầng được định danh bằng SHA-256 của chính nội dung nó. Đó là thứ khiến cả hệ thống chạy được: nếu hai ảnh chứa một tầng giống nhau tới từng byte thì đó là <em>CÙNG MỘT TẦNG</em>, lưu một lần trên đĩa và tải một lần. Kéo <code>node:22-alpine</code> rồi kéo <code>nginx:1.27-alpine</code> thì phần nền Alpine dùng chung chỉ được tải ở lần đầu.</p>
<pre><code>docker images node --format '{{.Repository}}:{{.Tag}} {{.Size}}'
docker images nginx --format '{{.Repository}}:{{.Tag}} {{.Size}}'
docker system df</code></pre>
<div class="out">node:22-alpine 185MB
node:20-alpine 178MB
nginx:1.27-alpine 52.5MB
TYPE      TOTAL   ACTIVE   SIZE      RECLAIMABLE
Images    3       0        281.6MB   281.6MB (100%)</div>
<div class="callout ok"><strong>185 + 178 + 52,5 = 415,5MB ảnh nhưng chỉ chiếm 281,6MB đĩa.</strong> Cột <code>SIZE</code> trong <code>docker images</code> là kích thước <em>LOGIC</em> của từng ảnh khi đứng một mình — tầng dùng chung bị tính vào MỌI ảnh dùng nó. <code>docker system df</code> báo cái đĩa thật sự chứa bao nhiêu. Mỗi khi hai con số đó lệch nhau thì lý do là việc dùng chung tầng, và khoảng lệch càng lớn thì kỷ luật chọn ảnh nền của bạn càng tốt.</div>

<h3>Docker 29 đổi cách đếm: DISK USAGE và CONTENT SIZE</h3>
<p>Từ Docker Engine 29.0, một bản cài MỚI lưu ảnh bằng <strong>kho ảnh containerd</strong> (containerd image store) thay cho trình lưu trữ <code>overlay2</code> cũ; bản cài được NÂNG CẤP lên thì vẫn giữ <code>overlay2</code> cho tới khi bạn tự chuyển (docs.docker.com, kiểm 09/2026). Docker Desktop trên máy Mac của khoá cũng dùng kho containerd. Kiểm máy của bạn:</p>
<pre><code class="language-bash">docker info -f '{{ .DriverStatus }}'
docker images node:22-alpine</code></pre>
<div class="out">[[driver-type io.containerd.snapshotter.v1]]
IMAGE            ID             DISK USAGE   CONTENT SIZE   EXTRA
node:22-alpine   b6f26b36c8ff        237MB         61.2MB   U</div>
<table>
<tr><th>Bạn thấy</th><th>Nghĩa là</th></tr>
<tr><td><code>[[driver-type io.containerd.snapshotter.v1]]</code></td><td>Kho ảnh containerd (mặc định của bản cài Docker 29 mới, và của Docker Desktop).</td></tr>
<tr><td>dòng có chữ <code>overlay2</code></td><td>Trình lưu trữ cổ điển — hay gặp trên VPS cài trước 2026 rồi nâng cấp dần. Mọi điều trong bài này vẫn đúng.</td></tr>
<tr><td><code>CONTENT SIZE 61.2MB</code></td><td>Các tầng ở dạng NÉN — đúng thứ <code>docker pull</code> tải về và <code>docker push</code> đẩy lên.</td></tr>
<tr><td><code>DISK USAGE 237MB</code></td><td>Tầng nén <em>cộng</em> bản đã giải nén mà container thật sự chạy trên đó. Kho containerd giữ CẢ HAI, nên cùng một ảnh trông nặng hơn trên đĩa so với thời <code>overlay2</code>.</td></tr>
<tr><td><code>EXTRA U</code></td><td>In use — đang được dùng: có ít nhất một container tạo từ ảnh này.</td></tr>
</table>
<p>Việc dùng chung tầng thì không đổi. Trên máy Linux của khoá, <code>alpine:latest</code> và <code>node:22-alpine</code> bắt đầu từ ĐÚNG một tầng:</p>
<pre><code class="language-bash">docker image inspect alpine:latest node:22-alpine \\
  --format '{{.RepoTags}} {{len .RootFS.Layers}} {{index .RootFS.Layers 0}}'</code></pre>
<div class="out">[alpine:latest] 1 sha256:74d97c428c51a828f9051a7a40a53ff1fc99e54fc30323ce36760701b0b7f711
[node:22-alpine] 4 sha256:74d97c428c51a828f9051a7a40a53ff1fc99e54fc30323ce36760701b0b7f711</div>

<h3>Cái chồng đó thành MỘT hệ thống file thế nào: overlayfs</h3>
${slide('dk-01', 11, 'overlayfs: lowerdir + upperdir ⇒ merged')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Tầng ghi được của container (upperdir)</span><span class="lz-lnote">Tạo ra khi container khởi động, huỷ đi khi nó bị xoá. Mọi file tiến trình ghi hay sửa đều rơi vào đây. Đây là cái tầng khiến container vứt-đi-được — và là lý do dữ liệu cơ sở dữ liệu của bạn biến mất.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tầng 4 — COPY docker-entrypoint.sh</span><span class="lz-lnote">Chỉ đọc. 388 byte.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tầng 3 — RUN apk add yarn</span><span class="lz-lnote">Chỉ đọc. 9,31MB.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tầng 2 — RUN cài node</span><span class="lz-lnote">Chỉ đọc. 167MB. Dùng chung bởi MỌI ảnh dựng FROM node:22-alpine.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tầng 1 — ADD rootfs của alpine (lowerdir)</span><span class="lz-lnote">Chỉ đọc. 8,83MB. Dùng chung bởi mọi ảnh nền Alpine trên máy.</span></div>
</div>
<pre><code>docker run -d --name n1 node:22-alpine sleep 600
docker inspect n1 --format '{{json .GraphDriver.Data}}' | tr ',' '\\n'</code></pre>
<div class="out">{"LowerDir":"/var/lib/docker/overlay2/8fa1…/diff:/var/lib/docker/overlay2/2b7c…/diff"
 "MergedDir":"/var/lib/docker/overlay2/9e4d…/merged"
 "UpperDir":"/var/lib/docker/overlay2/9e4d…/diff"
 "WorkDir":"/var/lib/docker/overlay2/9e4d…/work"}</div>
<div class="kv-grid">
  <div class="kv"><span class="k">LowerDir</span><span class="v">Các tầng chỉ-đọc của ảnh, ngăn bằng dấu hai chấm, tầng trên cùng đứng trước. Dùng chung giữa MỌI container khởi chạy từ ảnh này — một trăm container từ một ảnh không thêm một byte ảnh nào cả.</span></div>
  <div class="kv"><span class="k">UpperDir</span><span class="v">Tầng ghi được riêng của container này. Nó bắt đầu rỗng. <code>docker rm</code> xoá đúng cái thư mục này, và cùng với nó là mọi thứ container đã ghi.</span></div>
  <div class="kv"><span class="k">MergedDir</span><span class="v">Phần hợp nhất: đúng cái mà tiến trình nhìn thấy là <code>/</code>. File ở tầng trên thắng; thứ gì không có ở đó thì rơi xuống các tầng dưới theo thứ tự.</span></div>
  <div class="kv"><span class="k">WorkDir</span><span class="v">Chỗ nháp mà overlayfs cần để thực hiện các thao tác nguyên tử. Đừng bao giờ đụng vào.</span></div>
</div>
<div class="callout warn"><strong>Trên Docker 29 dùng kho containerd, lệnh đó KHÔNG còn chạy.</strong> Máy Mac của khoá (Engine 29.8) trả lời <code>map has no entry for key "GraphDriver"</code>; máy Linux (Engine 29.6) in <code>null</code>. Ba thư mục đó vẫn tồn tại — chỉ là giờ containerd giữ chúng. <code>docker inspect</code> chỉ nêu tên snapshotter (bộ quản lý ảnh chụp tầng), phần còn lại nằm trong bảng mount của máy chủ (Linux; đọc không cần sudo):</div>
<pre><code class="language-bash">docker inspect n1 --format '{{json .Storage}}'
findmnt -t overlay -o TARGET | grep \$(docker inspect -f '{{.Id}}' n1)
findmnt -no OPTIONS &lt;TARGET vừa in&gt; | tr ',' '\\n' | grep dir</code></pre>
<div class="out">{"RootFS":{"Snapshot":{"Name":"overlayfs"}}}
/var/lib/docker/rootfs/overlayfs/5665d536212889f6ce4da5eba567741cb0cc769132b02dc4307c7d3d22a768d4
lowerdir=/var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/18481/fs:…/18480/fs:…/18479/fs:…/18478/fs:…/18444/fs
upperdir=/var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/18482/fs
workdir=/var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/18482/work</div>
<p>Đọc danh sách <code>lowerdir</code> từ phải sang trái là đọc từ dưới lên trên: <code>18444</code> là nền Alpine — số của nó nhỏ hơn hẳn vì nó được giải nén từ trước, lúc kéo <code>alpine:latest</code>, và <code>node:22-alpine</code> chỉ việc dùng lại. <code>18478</code>–<code>18480</code> là ba tầng riêng của Node, còn <code>18481</code> là một lớp mỏng Docker tự thêm cho mỗi container (chỗ để sẵn cho <code>/etc/hosts</code>, <code>/etc/resolv.conf</code>, <code>/etc/hostname</code>). <code>upperdir</code> là tầng ghi được riêng của container này. Đó chính là toàn bộ bức tranh trên slide 11.</p>

<h3>Sao chép-khi-ghi, chứng minh tận mắt</h3>
${slide('dk-01', 12, 'Ghi lần đầu chép trọn file lên tầng ghi')}
<pre><code>docker exec n1 sh -c 'ls -l /usr/local/bin/node | cut -c1-60'
docker exec n1 sh -c 'echo hi &gt;&gt; /usr/local/bin/docker-entrypoint.sh'
docker diff n1 | head -6
docker ps -s --filter name=n1 --format '{{.Names}} {{.Size}}'</code></pre>
<div class="out">-rwxr-xr-x    1 root     root     126241888 Jul 29 17:57 /us
C /usr
C /usr/local
C /usr/local/bin
C /usr/local/bin/docker-entrypoint.sh
n1 32.8kB (virtual 170MB)</div>
<p>Nối thêm hai byte vào một file 388 byte đã chép TRỌN cái file lên tầng ghi được — <code>C</code> nghĩa là changed. Đọc thì không cần chép; lần <em>GHI</em> đầu tiên vào bất kỳ file nào cũng chép nó lên trước, dù nó lớn cỡ nào. Đó là lý do sửa một file 2GB bên trong container tạm thời ngốn 2GB đĩa, và là lý do <code>docker ps -s</code> hiện ra hai con số: số byte ghi được của riêng container, và cái ảnh dùng chung nằm sau nó.</p>
<p class="note-ct">Output thật trên máy Mac của khoá (Docker Desktop 4.91); bản cũ của bài có hai dòng lạc vào output. Kích thước của container là dung lượng đĩa thật của tầng ghi, làm tròn theo khối đĩa và tính cả các thư mục bị chép lên cùng file — nên nó lớn hơn 391 byte của file và khác nhau giữa các máy (32.8kB trên Mac, 4.1kB trên máy Linux).</p>

<h3>Xoá KHÔNG làm nhỏ đi — và điều này quan trọng với bí mật</h3>
${slide('dk-01', 13, 'Xoá chỉ là dán nhãn .wh — byte gốc vẫn trong ảnh')}
<pre><code>docker exec n1 rm /usr/local/bin/docker-entrypoint.sh
docker diff n1 | grep entrypoint
docker exec n1 ls /usr/local/bin/</code></pre>
<div class="out">D /usr/local/bin/docker-entrypoint.sh
corepack
node
npm
npx
yarn
yarnpkg</div>
<p>File đó vô hình với container, nhưng chẳng có gì được thu hồi cả. Overlayfs ghi nhận một lần xoá bằng cách viết một dấu <strong>WHITEOUT</strong> vào tầng trên — một file đặc biệt tí hon mang nghĩa "coi như cái này không có". Những byte gốc vẫn nằm nguyên ở tầng chỉ-đọc bên dưới, bởi vì tầng chỉ-đọc theo định nghĩa là bất biến.</p>
<h3>Chạy thử từng bước: tìm lại file "đã xoá" bên trong ảnh</h3>
<p>Nhìn tận mắt mới tin. Đóng băng container thành một ảnh, giải nén ảnh, rồi soi vào từng tầng:</p>
<pre><code class="language-bash">docker commit n1 snap:1                        <span class="tok-comment"># container — cùng dấu whiteout của nó — thành một ảnh</span>
mkdir snap &amp;&amp; docker save snap:1 | tar -x -C snap
ls snap
for f in snap/blobs/sha256/*; do
  tar -tzvf "\$f" 2&gt;/dev/null | grep 'docker-entrypoint' &amp;&amp; echo "   ↑ nằm trong blob &#36;{f##*/}"
done</code></pre>
<div class="out">blobs
index.json
manifest.json
oci-layout
----------  0 0      0           0 Jan  1  1970 usr/local/bin/.wh.docker-entrypoint.sh
   ↑ nằm trong blob 19f42a97bfc199430fc9f0cb1510a9930fd766d9e83c8be343d1d5b56609fc36
-rwxr-xr-x  0 0      0         388 Jul 30 00:26 usr/local/bin/docker-entrypoint.sh
   ↑ nằm trong blob 5e275a5205a078c58e96d07db2891244cea6f217eb335edba0807ddf3661b59e</div>
<table>
<tr><th>Mẩu lệnh</th><th>Làm gì</th></tr>
<tr><td><code>docker save snap:1 | tar -x -C snap</code></td><td>Ghi ảnh ra dạng OCI layout (một thư mục các file) rồi giải nén vào <code>snap/</code>. Mỗi tầng là MỘT file tar nén gzip trong <code>blobs/sha256/</code>, đặt tên bằng mã băm của nó.</td></tr>
<tr><td><code>tar -tzvf "\$f"</code></td><td>Liệt kê (<code>t</code>) một kho nén gzip (<code>z</code>), in chi tiết (<code>v</code>), từ file (<code>f</code>). Mấy blob JSON không phải kho tar; <code>2&gt;/dev/null</code> giấu lỗi của chúng.</td></tr>
<tr><td><code>&#36;{f##*/}</code></td><td>Mẹo shell: tên file bỏ phần thư mục — tức mã băm của blob.</td></tr>
</table>
<p>Hai blob, hai sự thật: tầng trên cùng chứa một file 0 byte tên <code>.wh.docker-entrypoint.sh</code> — CHÍNH NÓ là dấu whiteout — còn một tầng cũ hơn vẫn giữ đủ 388 byte của bản gốc. <code>tar -xzOf snap/blobs/sha256/5e27… usr/local/bin/docker-entrypoint.sh</code> sẽ in nó ra. Dọn bằng <code>rm -rf snap; docker rmi snap:1</code>.</p>
<div class="pitfall"><strong>Bẫy — và đây là cái lớn:</strong> một bí mật được thêm vào ở một tầng Dockerfile rồi xoá đi ở tầng sau thì <strong>VẪN NẰM TRONG ẢNH</strong>, và bất cứ ai kéo ảnh đó về đều đọc được.
<pre><code><span class="tok-comment"># SAI — cái khoá nằm vĩnh viễn ở tầng 2, tầng 3 làm gì cũng vô ích</span>
COPY id_rsa /root/.ssh/id_rsa
RUN git clone git@github.com:me/private.git &amp;&amp; rm /root/.ssh/id_rsa</code></pre>
Moi nó ra chỉ tốn một câu lệnh: <code>docker save img | tar -x</code> rồi đọc mấy file tar của từng tầng. Điều tương tự áp cho một file <code>.env</code> bạn <code>COPY</code> rồi xoá, và cho <code>ARG NPM_TOKEN</code> — cái này còn hiện ra ngay trong <code>docker history</code>. Chương 6 nói về công cụ đúng đắn — secret mount của BuildKit (<code>RUN --mount=type=secret</code>) và dựng nhiều tầng, cả hai đều giữ bí mật nằm ngoài mọi tầng được công bố.</div>

<h3>Hai luật rơi ra từ chuyện này</h3>
${slide('dk-01', 14, 'Hai luật: ít đổi để dưới, dọn trong cùng RUN')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Luật 1 · Thứ ít đổi thì để dưới cùng</span><span class="lz-t">gói hệ thống → thư viện phụ thuộc → mã nguồn của bạn</span><span class="lz-d">Một tầng bị vô hiệu bởi bất kỳ thay đổi nào NẰM DƯỚI nó. Mã nguồn đổi hàng giờ; hệ điều hành nền đổi hàng tháng. Sắp xếp theo tần suất thay đổi chính là toàn bộ chiến lược cache lúc dựng (Chương 5).</span></div>
  <div class="lz-step"><span class="lz-k">Luật 2 · Dọn dẹp ngay TRONG cái tầng đã bày ra</span><span class="lz-t">RUN apt-get install … &amp;&amp; rm -rf /var/lib/apt/lists/*</span><span class="lz-d">Một <code>RUN</code> là một tầng, nên phần cài và phần dọn bù trừ nhau thành một cái diff nhỏ hơn. Hai lệnh <code>RUN</code> riêng thì giữ nguyên trọn sức nặng của cái đầu, cộng thêm một whiteout. Riêng thói quen này thường tiết kiệm hơn 100MB.</span></div>
</div>
<pre><code>docker rm -f n1
docker image inspect node:22-alpine --format '{{len .RootFS.Layers}} tầng'</code></pre>
<div class="out">4 tầng</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> Dockerfile của một bạn cùng nhóm làm <code>COPY .env /app/.env</code> rồi <code>RUN rm /app/.env</code>. "Xoá rồi mà, container còn chẳng thấy nó," bạn ấy nói, rồi đẩy ảnh lên. Hãy chứng minh mật khẩu CSDL vẫn nằm trong ảnh.</p><ol>
<li><code>mkdir -p ~/thu-docker/lo-env &amp;&amp; cd ~/thu-docker/lo-env</code>, rồi tạo một bí mật giả và cái Dockerfile (khối lệnh bên dưới).</li>
<li>Dựng và chạy: <code>docker build -t thu-lo-env:1 .</code> rồi <code>docker run --rm thu-lo-env:1</code> — <code>/app</code> trông rỗng.</li>
<li>Đọc <code>docker history thu-lo-env:1</code>. Tầng <code>RUN rm</code> có mang số âm không? Nó nặng bao nhiêu?</li>
<li>Giải nén ảnh và lục từng tầng: <code>mkdir out &amp;&amp; docker save thu-lo-env:1 | tar -x -C out</code>, rồi vòng lặp <code>for f in out/blobs/sha256/*</code> ở mục "Chạy thử từng bước" với <code>grep app/</code>. In bí mật ra bằng <code>tar -xzOf out/blobs/sha256/&lt;blob&gt; app/.env</code>.</li>
<li>Dọn dẹp: <code>cd .. &amp;&amp; rm -rf lo-env &amp;&amp; docker rmi thu-lo-env:1</code>.</li></ol>
<pre><code class="language-bash">printf 'DB_PASS=bimat123\\n' &gt; .env
cat &gt; Dockerfile &lt;&lt;'EOF'
FROM alpine:latest
COPY .env /app/.env
RUN rm /app/.env
CMD ["ls","-la","/app"]
EOF</code></pre>
<p>Thứ máy Mac của khoá in ra ở bước 4 (hai blob khớp: tầng chứa file, và tầng chứa dấu whiteout của nó):</p>
<div class="out">-rw-r--r--  0 0      0          17 Sep 23 20:36 app/.env
----------  0 0      0           0 Jan  1  1970 app/.wh..env
DB_PASS=bimat123</div>
<p><strong>Đạt khi:</strong> <code>DB_PASS=bimat123</code> được in ra TỪ ẢNH dù <code>docker run</code> cho thấy <code>/app</code> rỗng, và bạn nói được trong một câu vì sao <code>RUN rm</code> không cứu được (cách sửa đúng — <code>.dockerignore</code> và build secret — ở Chương 6).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Image (ảnh)</span><span class="v">Một chồng có thứ tự các tầng chỉ-đọc cộng một mẩu JSON cấu hình (lệnh chạy, biến môi trường, cổng).</span></div>
  <div class="kv"><span class="k">Layer (tầng)</span><span class="v">Một kho tar chứa "cái gì đã đổi" ở một bước dựng, đặt tên bằng mã băm nội dung của nó.</span></div>
  <div class="kv"><span class="k">Digest (mã băm)</span><span class="v"><code>sha256:…</code> — dấu vân tay định danh một tầng hay một ảnh. Cùng byte thì cùng digest, và chỉ lưu một lần.</span></div>
  <div class="kv"><span class="k">overlayfs (hệ file chồng lớp)</span><span class="v">Hệ thống file Linux xếp chồng thư mục: <code>lowerdir</code> (các tầng chỉ-đọc) + <code>upperdir</code> (tầng ghi) = <code>merged</code> (thứ tiến trình thấy).</span></div>
  <div class="kv"><span class="k">Copy-on-write (sao chép khi ghi)</span><span class="v">Lần ghi đầu vào một file chép TRỌN file đó lên tầng ghi; đọc thì không bao giờ chép.</span></div>
  <div class="kv"><span class="k">Whiteout (dấu xoá)</span><span class="v">Một file đánh dấu <code>.wh.</code> nghĩa là "giấu cái này khỏi các tầng bên dưới". Xoá không bao giờ gỡ được byte nào khỏi ảnh.</span></div>
  <div class="kv"><span class="k">containerd image store (kho ảnh containerd)</span><span class="v">Cách lưu ảnh mặc định của bản cài Docker 29 mới: giữ cả tầng nén lẫn tầng đã giải nén, báo DISK USAGE và CONTENT SIZE.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Image là một chồng tầng chỉ-đọc, đọc từ dưới lên; <code>docker history</code> là Dockerfile của nó viết ngược.</li>
<li>Tầng được đặt tên bằng mã băm nội dung, nên tầng giống hệt nhau chỉ lưu và tải đúng một lần.</li>
<li>overlayfs gộp các tầng dưới và MỘT tầng ghi phía trên thành cái <code>/</code> duy nhất mà container thấy.</li>
<li>Lần ghi đầu vào bất kỳ file nào chép trọn file lên; xoá chỉ thêm một dấu whiteout.</li>
<li>Bí mật thêm ở một tầng rồi xoá ở tầng sau VẪN nằm trong ảnh — ai cũng moi ra được bằng <code>docker save</code>.</li>
<li>Trên Docker 29, kiểm kho ảnh bằng <code>docker info -f '{{ .DriverStatus }}'</code>; GraphDriver đã mất, xem tầng bằng <code>findmnt</code>.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/storage/drivers/overlayfs-driver/" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">Trình lưu trữ overlay2</span><span class="lc-sub">Docker xếp chồng các tầng ra sao, lowerdir/upperdir/merged nghĩa là gì trên đĩa, sao chép-khi-ghi và whiteout hoạt động thế nào, và đặc tính hiệu năng của từng thao tác.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/storage/containerd/" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Kho ảnh containerd</span><span class="lc-sub">Vì sao Docker 29 lưu ảnh theo cách khác, làm sao biết máy mình đang dùng kho nào, và cách chuyển một máy đã nâng cấp.</span></span>
</a>
<a class="link-card" href="https://github.com/opencontainers/image-spec/blob/main/spec.md" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">Đặc tả ảnh OCI</span><span class="lc-sub">Cái chuẩn mà một ảnh thật sự tuân theo: manifest, JSON cấu hình, và digest của từng tầng. Ngắn và dễ đọc, và nó giải thích vì sao Podman, containerd và Kubernetes đều dùng ảnh Docker mà không phải sửa gì.</span></span>
</a>
<a class="link-card" href="https://github.com/wagoodman/dive" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">dive — soi một ảnh theo từng tầng</span><span class="lc-sub">Một giao diện terminal cho thấy cây file của từng tầng và tầng đó thêm vào những gì. <code>dive node:22-alpine</code> làm mọi thứ trong bài này hiện ra trước mắt, và tìm ra 200MB bạn không định đem đi chỉ mất khoảng mười giây.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: đọc cái chồng tầng</span><span class="lc-sub">Bài chấm điểm: dựng lại một Dockerfile từ <code>docker history</code>, giải thích vì sao ba ảnh cộng lại 415MB mà chỉ chiếm 281MB, và moi một file "đã xoá" ra từ các tầng của một ảnh đã công bố.</span></span>
</a>

<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Một image là một chồng CÓ THỨ TỰ các tầng chỉ-đọc được định danh theo nội dung, cộng một cấu hình — đó là lý do những tầng giống nhau chỉ được lưu và truyền đúng một lần, và là lý do <code>docker images</code> với <code>docker system df</code> nói hai con số khác nhau. Một container thêm MỘT tầng ghi được lên trên, và sao chép-khi-ghi nghĩa là lần ghi đầu tiên vào bất kỳ file nào cũng chép trọn cái file lên. Và KHÔNG BAO GIỜ có thứ gì bị gỡ khỏi một tầng dưới: xoá chỉ là một dấu whiteout, nên một bí mật bạn thêm vào rồi xoá đi vẫn được đem tới tay mọi người kéo cái ảnh đó về.</p>
</div>
`,
    },
    /* ─────────────────────────── 1.3 ─────────────────────────── */
    {
      title: '1.3 — The container lifecycle, and PID 1|||1.3 — Vòng đời một container, và PID 1',
      slug: 'dk-1-3-vong-doi',
      type: 'LESSON',
      description: 'run thật ra là ba lệnh, sáu trạng thái và cách đi giữa chúng, stop gửi SIGTERM rồi SIGKILL, PID 1 không nhận tín hiệu khi bạn dùng dạng shell, mã thoát, và docker events.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>The container lifecycle, and PID 1</h2>
<p class="lead"><code>docker run</code> looks like one action and is actually three, glued together for convenience. Separating them explains the whole command set — and the last of the three, starting the process, is where most production surprises live, because that process becomes PID 1 and PID 1 in Linux is special.</p>

<h3>run is pull + create + start</h3>
${slide('dk-01', 15, 'docker run = pull + create + start')}
${slide('dk-01', 16, 'Sáu trạng thái và lệnh chuyển giữa chúng')}
<pre><code>docker pull nginx:1.27-alpine                       <span class="tok-comment"># 1. fetch the image</span>
CID=\$(docker create --name web -p 8080:80 nginx:1.27-alpine)   <span class="tok-comment"># 2. make a container</span>
docker ps -a --filter name=web --format '{{.Names}} {{.Status}}'
docker start web                                     <span class="tok-comment"># 3. start the process</span>
docker ps --filter name=web --format '{{.Names}} {{.Status}}'</code></pre>
<div class="out">web Created
web
web Up 1 second</div>
<p>Between step 2 and step 3 the container fully exists — it has an ID, a name, a writable layer, a network configuration and its port mapping — and nothing is running. That state is real and useful: <code>docker create</code> then <code>docker cp</code> a file in, then <code>start</code>. It is also why "the container exists but the app is not running" is a coherent thing to say.</p>
<div class="lz-map">
  <div class="lz-stage">created</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Configured, never started</span><span class="lz-nsub">Writable layer allocated, no process. <code>start</code> moves it to running; <code>rm</code> deletes it.</span></div></div>
  <div class="lz-stage">running</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">PID 1 is alive</span><span class="lz-nsub"><code>stop</code> → exited (politely). <code>kill</code> → exited (immediately). <code>pause</code> → paused. <code>restart</code> = stop then start.</span></div></div>
  <div class="lz-stage">paused</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Frozen by the cgroup freezer</span><span class="lz-nsub">Every process suspended, memory intact, sockets still open but nothing is answering. <code>unpause</code> resumes exactly where it was.</span></div></div>
  <div class="lz-stage">exited</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Process finished; the container remains</span><span class="lz-nsub">Its writable layer, logs and exit code are all still there — this is why <code>docker logs</code> works on a dead container. <code>start</code> runs it again; <code>rm</code> deletes it for good.</span></div></div>
  <div class="lz-stage">restarting / dead</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">A restart policy is retrying · or cleanup failed</span><span class="lz-nsub">A container stuck in <code>restarting</code> is a crash loop (Chapter 12). <code>dead</code> is rare and means Docker could not remove it — usually a stuck mount.</span></div></div>
</div>
<p>Every arrow on slide 16 is one command. The full set, with what each does to the container's pieces:</p>
<table>
<tr><th>Command</th><th>Process</th><th>Writable layer, logs, name</th></tr>
<tr><td><code>docker create</code></td><td>none yet</td><td>created</td></tr>
<tr><td><code>docker start</code></td><td>runc starts PID 1</td><td>kept</td></tr>
<tr><td><code>docker stop</code> / <code>docker kill</code></td><td>ends it (politely / at once)</td><td>kept — <code>docker logs</code> still works</td></tr>
<tr><td><code>docker restart</code></td><td>stop, then start again</td><td>kept</td></tr>
<tr><td><code>docker pause</code> / <code>unpause</code></td><td>frozen / thawed, not ended</td><td>kept</td></tr>
<tr><td><code>docker rm</code> (<code>-f</code> = stop first)</td><td>must be stopped</td><td><strong>deleted for good</strong></td></tr>
<tr><td><code>docker run --rm</code></td><td>normal</td><td>deleted automatically when PID 1 exits</td></tr>
</table>
<pre><code>docker pause web   &amp;&amp; docker ps --format '{{.Names}} {{.Status}}'
docker unpause web &amp;&amp; docker stop web
docker ps -a --filter name=web --format '{{.Names}} {{.Status}}'
docker start web &amp;&amp; docker rm -f web</code></pre>
<div class="out">web Up 12 seconds (Paused)
web Exited (0) 1 second ago</div>
<p>What "paused" means from the outside, measured on the course's Mac with the port published on 18010: the port is still open, but nobody answers.</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' localhost:18010          <span class="tok-comment"># running</span>
docker pause web
curl -s -m 3 -o /dev/null -w '%{http_code}\\n' localhost:18010; echo "curl exit \$?"</code></pre>
<div class="out">200
web
000
curl exit 28</div>
<p><code>000</code> and curl's exit code 28 mean "timed out": the connection was accepted by the host, but the frozen nginx never replied. A paused container looks exactly like a hung one — worth knowing before you debug one for an hour.</p>

<h3>stop is a negotiation; kill is not</h3>
${slide('dk-01', 17, 'docker stop: SIGTERM → chờ → SIGKILL (đo thật)')}
<pre><code>docker run -d --name w nginx:1.27-alpine
time docker stop w                <span class="tok-comment"># nginx handles SIGTERM: fast</span>
docker rm w

docker run -d --name w2 alpine sh -c 'trap "" TERM; sleep 600'
time docker stop w2               <span class="tok-comment"># ignores SIGTERM: waits, then SIGKILL</span>
docker inspect w2 --format '{{.State.ExitCode}}'
docker rm w2</code></pre>
<div class="out">real	0m0.283s
real	0m10.402s
137</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · docker stop sends SIGTERM</span><span class="lz-t">to PID 1 inside the container, and only to PID 1</span><span class="lz-d">This is the app's chance to finish in-flight requests, flush buffers, close database connections and exit cleanly. A well-behaved server exits in milliseconds.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Docker waits 10 seconds</span><span class="lz-t">configurable: <code>docker stop -t 30</code>, or <code>STOPSIGNAL</code>/<code>stop_grace_period</code></span><span class="lz-d">If PID 1 exits during the wait, we are done and the exit code is whatever it returned. Ten seconds is the default and it is often too short for a busy API.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Then SIGKILL, unconditionally</span><span class="lz-t">exit code 137 = 128 + 9</span><span class="lz-d">Nothing can catch or ignore SIGKILL. In-flight requests are dropped, buffers are lost, and a database mid-write is left to recover on next start.</span></div>
  <div class="lz-step"><span class="lz-k">docker kill skips straight to step 3</span><span class="lz-t"><code>docker kill --signal=HUP</code> sends any signal you like</span><span class="lz-d">Useful for <code>nginx -s reload</code> style operations; destructive as a way to stop things.</span></div>
</div>
<div class="callout warn"><strong>A 10-second pause on every deploy is a symptom, not a fact of life.</strong> If <code>docker stop</code> consistently takes ten seconds, your PID 1 is not handling SIGTERM — either the application ignores it, or (far more often) PID 1 is a shell that never forwards it. The next section is that bug, and fixing it removes ten seconds from every single restart.</div>

<h3>Run it step by step: watch a stop happen with docker events</h3>
<p><code>time</code> tells you <em>how long</em> a stop took; <code>docker events</code> tells you <em>which signals</em> were sent and when. Open two terminals:</p>
<pre><code class="language-bash"><span class="tok-comment"># terminal 1 — listen</span>
docker events --filter container=slow --format '{{.Time}} {{.Action}} {{index .Actor.Attributes "signal"}} {{index .Actor.Attributes "exitCode"}}'
<span class="tok-comment"># terminal 2 — a PID 1 that ignores SIGTERM, then the same with --init</span>
docker run -d --name slow alpine sleep 600 &amp;&amp; docker stop slow &amp;&amp; docker rm slow
docker run -d --name slow --init alpine sleep 600 &amp;&amp; docker stop slow &amp;&amp; docker rm slow</code></pre>
<div class="out">1790169701 kill 15
1790169711 kill 9
1790169712 stop
1790169712 die 137
1790169714 kill 15
1790169714 stop
1790169714 die 143</div>
<p>Real output from the course's Linux machine (Docker 29.6). The first stop: <code>kill 15</code> (SIGTERM), ten seconds of nothing, <code>kill 9</code> (SIGKILL), <code>die 137</code>. The second: <code>kill 15</code> and <code>die 143</code> within the same second — no SIGKILL needed. That is slide 17 in text form.</p>
<div class="callout warn"><strong>Measure your own machine.</strong> The documentation says the grace period is 10 seconds for Linux containers, and the Linux machine matched it (10.13 s). The course's Mac with Docker Desktop 4.91 sent SIGKILL after about <strong>3 seconds</strong> instead — the same <code>docker stop</code>, no options, reproduced several times, and <code>docker stop -t 10</code> restored the 10 s wait. We did not find the setting responsible, so do not trust a default you have not measured: set the timeout you need explicitly.</div>
<table>
<tr><th>Where</th><th>How to set the grace period / signal</th></tr>
<tr><td>One stop</td><td><code>docker stop -t 30 web</code> — wait 30 s before SIGKILL</td></tr>
<tr><td>Per container</td><td><code>docker run --stop-timeout 30 --stop-signal SIGINT …</code></td></tr>
<tr><td>In the image</td><td><code>STOPSIGNAL SIGQUIT</code> in the Dockerfile (e.g. for nginx's graceful shutdown)</td></tr>
<tr><td>Compose</td><td><code>stop_grace_period: 30s</code>, <code>stop_signal: SIGINT</code>, <code>init: true</code> (Chapter 9)</td></tr>
</table>

<h3>PID 1 is special, and shell form breaks it</h3>
${slide('dk-01', 18, 'PID 1 phải tự bắt SIGTERM')}
${slide('dk-01', 19, 'Shell làm PID 1 và ba cách sửa')}
<pre><code><span class="tok-comment"># Shell form — the command is wrapped in /bin/sh -c</span>
docker run -d --name shellform alpine sh -c 'sleep 600; echo done'
docker exec shellform ps -o pid,args

<span class="tok-comment"># Exec form — your process IS pid 1</span>
docker run -d --name execform alpine sleep 600
docker exec execform ps -o pid,args</code></pre>
<div class="out">PID   COMMAND
    1 sh -c sleep 600; echo done
    7 sleep 600
    8 ps -o pid,args

PID   COMMAND
    1 sleep 600
    7 ps -o pid,args</div>
<p>In the first container PID 1 is <code>/bin/sh</code>, and <code>sleep</code> is its child. <code>docker stop</code> signals PID 1 — the shell — which by default does not forward signals to children and does not exit while waiting. So the shell sits there, the ten-second timer runs out, and everything dies by SIGKILL.</p>
<div class="callout"><strong>Why the <code>; echo done</code>?</strong> Because shells try to be clever. An earlier version of this lesson ran plain <code>sh -c 'sleep 600'</code> and showed <code>/bin/sh</code> as PID 1 — that is not what Alpine does. Busybox <code>sh</code> (and <code>dash</code>, and <code>bash</code>) <em>exec</em> the last command of a <code>-c</code> string instead of forking it, so that shell vanishes:
<pre><code class="language-bash">docker run -d --name s1 alpine sh -c 'sleep 600'
docker exec s1 ps -o pid,args</code></pre>
<div class="out">PID   COMMAND
    1 sleep 600
    7 ps -o pid,args</div>
Do not rely on it. The shell stays in place as soon as anything follows the app — a second command, a <code>trap</code>, a loop, a multi-line entrypoint script — which is exactly what real-world <code>CMD</code> lines look like. And even when your app does end up as PID 1, it still has to handle SIGTERM itself (next section).</div>
<p>Linux gives PID 1 two unusual properties, and both matter here:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">PID 1 ignores signals it has no handler for</span><span class="v">Normally an unhandled SIGTERM kills a process. For PID 1 the kernel simply drops it. So a program that never installs a SIGTERM handler is unkillable-by-SIGTERM as PID 1, even though the same program stops instantly anywhere else.</span></div>
  <div class="kv"><span class="k">PID 1 must reap orphaned children</span><span class="v">When any process's parent dies, the orphan is re-parented to PID 1, which must call <code>wait()</code> on it. A shell or an application that does not becomes a zombie factory — visible as growing <code>Z</code>-state entries in <code>ps</code>, eventually exhausting the PID table.</span></div>
  <div class="kv"><span class="k">Fix A — exec form</span><span class="v"><code>CMD ["node", "server.js"]</code> instead of <code>CMD node server.js</code>. Your process becomes PID 1 directly and receives the signal. This is the default answer and costs nothing (Chapter 4).</span></div>
  <div class="kv"><span class="k">Fix B — exec in your entrypoint</span><span class="v">If you genuinely need a shell script wrapper, end it with <code>exec node server.js</code>. <code>exec</code> replaces the shell rather than forking, so your app inherits PID 1.</span></div>
  <div class="kv"><span class="k">Fix C — --init</span><span class="v"><code>docker run --init</code> inserts a tiny init (<code>tini</code>) as PID 1 that forwards signals and reaps zombies. The right answer when the process really does spawn children — a test runner, a supervisor, anything using <code>child_process</code>.</span></div>
</div>
<pre><code>docker rm -f shellform execform
docker run -d --name good --init alpine sh -c 'exec sleep 600'
docker exec good ps -o pid,args | head -3
time docker stop good; docker rm good</code></pre>
<div class="out">PID   COMMAND
    1 /sbin/docker-init -- sh -c exec sleep 600
    7 sleep 600
real	0m0.131s</div>
<p class="note-ct">This block used to run the same thing without <code>--init</code> and show a 0.24 s stop. Measured on Docker 29.6 it takes the full 10.13 s: <code>exec</code> makes <code>sleep</code> PID 1, but <code>sleep</code> installs no SIGTERM handler, and PID 1 without a handler ignores SIGTERM. <code>--init</code> puts <code>docker-init</code> (tini) in front, which does handle it.</p>

<h3>Your own app as PID 1: it must catch SIGTERM</h3>
<p>Fix A (exec form) decides <em>who</em> is PID 1. It does not make that program listen. The course's Linux machine, default <code>docker stop</code>, five PID 1s:</p>
<table>
<tr><th>PID 1</th><th>Stop took</th><th>Exit</th><th>Why</th></tr>
<tr><td><code>node -e "setInterval(()=&gt;{},1000)"</code></td><td>10.17 s</td><td>137</td><td>Node installs no SIGTERM handler ⇒ dropped ⇒ SIGKILL</td></tr>
<tr><td><code>sleep 600</code> (exec form)</td><td>10.13 s</td><td>137</td><td>same</td></tr>
<tr><td>Node with <code>process.on('SIGTERM', …)</code></td><td>0.14 s</td><td>0</td><td>handler runs, closes, exits cleanly</td></tr>
<tr><td>Node with <code>--init</code></td><td>0.16 s</td><td>143</td><td>tini is PID 1, forwards SIGTERM, Node (no longer PID 1) dies by default</td></tr>
<tr><td>nginx</td><td>0.20 s</td><td>0</td><td>nginx has its own handler</td></tr>
</table>
<p>For the Express API of a student project the right answer is both: exec form in the Dockerfile, and a handler that finishes in-flight requests before exiting.</p>
<pre><code class="language-javascript">const server = app.listen(3000);
process.on('SIGTERM', () =&gt; {
  console.log('SIGTERM received, closing connections...');
  server.close(() =&gt; process.exit(0));    <span class="tok-comment">// stop accepting, finish open requests, then exit 0</span>
});</code></pre>
<p>With Prisma, also <code>await prisma.$disconnect()</code> inside the callback. Exit 0 plus that log line in <code>docker logs</code> is how you know the deploy stopped the old container politely.</p>

<h3>Exit codes tell you what happened</h3>
${slide('dk-01', 20, 'Mã thoát kể lại chuyện gì đã xảy ra')}
<pre><code>docker run --name a alpine true;                 echo "a: \$(docker inspect -f '{{.State.ExitCode}}' a)"
docker run --name b alpine false;                echo "b: \$(docker inspect -f '{{.State.ExitCode}}' b)"
docker run --name c alpine /bin/nope 2&gt;/dev/null; echo "c: \$(docker inspect -f '{{.State.ExitCode}}' c)"
docker run --name d alpine /etc/hostname 2&gt;/dev/null; echo "d: \$(docker inspect -f '{{.State.ExitCode}}' d)"
docker rm a b c d &gt;/dev/null</code></pre>
<div class="out">a: 0
b: 1
c: 127
d: 126</div>
<div class="kv-grid">
  <div class="kv"><span class="k">0</span><span class="v">Clean exit. For a one-shot job that is success; for a server it means the process ended when it should not have — check the logs for what it decided to do instead of listening.</span></div>
  <div class="kv"><span class="k">1 (or any small number)</span><span class="v">The application chose to exit with an error. The reason is in <code>docker logs</code>, and this is the good case: your code got to say something.</span></div>
  <div class="kv"><span class="k">125</span><span class="v">Docker itself failed before the container started — a bad flag, a nonexistent volume. The error is on the CLI's stderr, not in the container's logs.</span></div>
  <div class="kv"><span class="k">126</span><span class="v">Found but not executable: a missing <code>+x</code>, or a script whose shebang line has Windows line endings, which makes the kernel look for <code>/bin/sh\\r</code>.</span></div>
  <div class="kv"><span class="k">127</span><span class="v">Command not found inside the image. Extremely common after changing base image — the binary you rely on is simply not in this one.</span></div>
  <div class="kv"><span class="k">137 / 143</span><span class="v">Killed by SIGKILL (128+9) or SIGTERM (128+15). 137 with no stop command from you means the memory limit or the host OOM killer. 143 means something asked it to stop and it complied.</span></div>
</div>
<p>One detail the table does not show: for 126 and 127 the process never started, so the container stays in <code>created</code>, not <code>exited</code>. On the course's Mac:</p>
<pre><code class="language-bash">docker run --name c alpine /bin/nope; docker inspect -f '{{.State.ExitCode}} {{.State.Status}}' c
docker run --name d alpine /etc/hostname; docker inspect -f '{{.State.ExitCode}} {{.State.Status}}' d</code></pre>
<div class="out">docker: Error response from daemon: failed to create task for container: failed to create shim task: OCI runtime create failed: runc create failed: unable to start container process: error during container init: exec: "/bin/nope": stat /bin/nope: no such file or directory

Run 'docker run --help' for more information
127 created
docker: Error response from daemon: failed to create task for container: failed to create shim task: OCI runtime create failed: runc create failed: unable to start container process: error during container init: exec: "/etc/hostname": permission denied

Run 'docker run --help' for more information
126 created</div>
<p>Read the error from the right: <code>exec: "/bin/nope": stat /bin/nope: no such file or directory</code> (127) or <code>exec: "/etc/hostname": permission denied</code> (126) — runc (Lesson 1.5) tried to <code>exec</code> the command inside the new container and could not. Nothing ran, so there is nothing in <code>docker logs</code>; the reason is only on your terminal.</p>

<h3>Watch it happen: docker events</h3>
<pre><code>docker events --filter type=container --format '{{.Time}} {{.Action}} {{.Actor.Attributes.name}}' &amp;
docker run -d --name ev --rm alpine sleep 2
sleep 4; kill %1</code></pre>
<div class="out">1790169685 create ev
1790169685 start ev
1790169687 die ev
1790169688 destroy ev</div>
<p class="note-ct">Real output on the course's Mac. An earlier version showed an <code>attach</code> event here; with <code>-d</code> there is none — <code>attach</code> appears only when the CLI stays connected to the output, i.e. a <code>docker run</code> <em>without</em> <code>-d</code> (checked: then the stream reads create, attach, start, die, destroy).</p>
<p><code>docker events</code> is a live stream of everything the daemon does, and it is the fastest way to answer "what actually happened at 03:14?" — including the events nobody asked for, like a restart policy re-launching a crashing container forty times. Chapter 12 uses it; <code>--since</code> and <code>--until</code> replay history.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> every deploy of your group's API hangs for several seconds on "Stopping…", and the log never shows the line that says connections were closed. Reproduce it with a tiny Node server, measure it, and fix it.</p><ol>
<li><code>mkdir -p ~/thu-docker/tin-hieu &amp;&amp; cd ~/thu-docker/tin-hieu</code> and create <code>server.js</code> with the first three lines below (no handler yet).</li>
<li>In a second terminal start <code>docker events --filter container=thu-api --format '{{.Action}} {{index .Actor.Attributes "signal"}}{{index .Actor.Attributes "exitCode"}}'</code>.</li>
<li>Run it and stop it: <code>docker run -d --name thu-api -v "\$PWD":/app -w /app node:22-alpine node server.js</code>, then <code>time docker stop thu-api</code> and <code>docker rm thu-api</code>. Note the signals in terminal 2.</li>
<li>Append the <code>process.on('SIGTERM')</code> block to <code>server.js</code>, run and stop again, then read <code>docker logs thu-api</code> before removing it.</li>
<li>Clean up: <code>docker rm -f thu-api</code>, <code>cd .. &amp;&amp; rm -rf tin-hieu</code>.</li></ol>
<pre><code class="language-javascript">const http = require('http');
const server = http.createServer((req, res) =&gt; res.end('ok\\n'));
server.listen(3000, () =&gt; console.log('API listening on 3000'));
<span class="tok-comment">// step 4: append</span>
process.on('SIGTERM', () =&gt; {
  console.log('SIGTERM received, closing connections...');
  server.close(() =&gt; process.exit(0));
});</code></pre>
<p>What the course's Mac printed in terminal 2 (before, then after the fix):</p>
<div class="out">kill 15
kill 9
stop
die 137
kill 15
stop
die 0</div>
<p><strong>Done when:</strong> before the fix you see <code>kill 15</code> followed by <code>kill 9</code> and <code>die 137</code>; after it only <code>kill 15</code> and <code>die 0</code>, the stop takes well under a second, and <code>docker logs</code> shows your "closing connections" line.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Lifecycle</span><span class="v">The states a container moves through: created → running ⇄ paused → exited → removed.</span></div>
  <div class="kv"><span class="k">PID 1</span><span class="v">The first process in the container's PID namespace. The container lives exactly as long as it does.</span></div>
  <div class="kv"><span class="k">SIGTERM / SIGKILL</span><span class="v">Signal 15, "please stop" (can be handled); signal 9, "die now" (cannot be caught).</span></div>
  <div class="kv"><span class="k">Grace period</span><span class="v">How long <code>docker stop</code> waits between SIGTERM and SIGKILL; set it with <code>-t</code> / <code>--stop-timeout</code>.</span></div>
  <div class="kv"><span class="k">Exec form vs shell form</span><span class="v"><code>CMD ["node","server.js"]</code> runs your program directly; <code>CMD node server.js</code> wraps it in <code>/bin/sh -c</code>.</span></div>
  <div class="kv"><span class="k">Zombie process</span><span class="v">A finished child that nobody has <code>wait()</code>ed for; PID 1 is responsible for reaping them.</span></div>
  <div class="kv"><span class="k">init / tini (<code>--init</code>)</span><span class="v">A tiny PID 1 that forwards signals to your app and reaps zombies.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>docker run</code> = pull + create + start; a created or exited container still has its layer, logs and name until <code>rm</code>.</li>
<li><code>docker stop</code> sends SIGTERM, waits (10 s by the docs — measure yours), then SIGKILL; <code>docker events</code> shows exactly which.</li>
<li>PID 1 ignores any signal it has no handler for — Node and <code>sleep</code> included — so your app must catch SIGTERM, or run with <code>--init</code>.</li>
<li>A shell as PID 1 keeps signals away from your app; use exec form, <code>exec</code> in entrypoints, or <code>--init</code>.</li>
<li>Exit codes: 0 clean, 1 app error, 125 Docker error, 126/127 cannot run / not found (container stays <code>created</code>), 137 SIGKILL, 143 SIGTERM.</li>
<li>A paused container keeps its port open but never answers — it looks exactly like a hang.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/cli/docker/container/stop/" target="_blank" rel="noopener">
  <span class="lc-ico">🛑</span>
  <span class="lc-body"><span class="lc-title">docker stop — reference</span><span class="lc-sub">The exact SIGTERM-then-SIGKILL semantics, the <code>-t</code> timeout, and how <code>STOPSIGNAL</code> in the Dockerfile changes which signal is sent first.</span></span>
</a>
<a class="link-card" href="https://github.com/krallin/tini" target="_blank" rel="noopener">
  <span class="lc-ico">🧬</span>
  <span class="lc-body"><span class="lc-title">tini — the init that <code>--init</code> uses</span><span class="lc-sub">Its README is the clearest short explanation anywhere of why PID 1 needs to forward signals and reap zombies, and when you do and do not need one.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/cli/docker/system/events/" target="_blank" rel="noopener">
  <span class="lc-ico">📡</span>
  <span class="lc-body"><span class="lc-title">docker events</span><span class="lc-sub">Every event type the daemon emits and every filter you can apply. Underused, and the right tool the moment you need to know what happened while you were not watching.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: lifecycle and signals</span><span class="lc-sub">Graded exercises: create a container without starting it, make <code>docker stop</code> take ten seconds and then fix it, read an exit code and name the cause, and catch a crash loop in <code>docker events</code>.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> stopped containers are not gone, and they accumulate. Every <code>docker run</code> without <code>--rm</code> leaves an <code>Exited</code> container holding its name, its writable layer and its logs forever. Symptoms are a puzzling <code>Conflict. The container name "/web" is already in use</code> when nothing is running, and a slow disk leak nobody notices — <code>docker ps -a | wc -l</code> in the hundreds. Use <code>--rm</code> for anything interactive or one-shot, keep the container when you need its logs or its exit code, and prune deliberately: <code>docker container prune</code>.</div>
<p class="note-ct"><strong>Three things to remember.</strong> <code>run</code> is <code>pull</code> + <code>create</code> + <code>start</code>, and knowing that makes the rest of the CLI obvious. <code>docker stop</code> asks nicely with SIGTERM and then insists with SIGKILL ten seconds later — so a stop that always takes ten seconds means your PID 1 is not listening. And use exec form (<code>CMD ["node","server.js"]</code>) or <code>exec</code> in your entrypoint so your process really is PID 1, because a shell in that position swallows signals and leaves zombies.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Vòng đời một container, và PID 1</h2>
<p class="lead"><code>docker run</code> trông như một hành động và thật ra là BA, dán lại với nhau cho tiện. Tách chúng ra là giải thích được cả bộ câu lệnh — và cái thứ ba, khởi chạy tiến trình, mới là chỗ phần lớn bất ngờ trên production nằm, bởi vì tiến trình đó trở thành PID 1 và PID 1 trong Linux là một thứ ĐẶC BIỆT.</p>

<h3>run là pull + create + start</h3>
${slide('dk-01', 15, 'docker run = pull + create + start')}
${slide('dk-01', 16, 'Sáu trạng thái và lệnh chuyển giữa chúng')}
<pre><code>docker pull nginx:1.27-alpine                       <span class="tok-comment"># 1. lấy ảnh về</span>
CID=\$(docker create --name web -p 8080:80 nginx:1.27-alpine)   <span class="tok-comment"># 2. tạo container</span>
docker ps -a --filter name=web --format '{{.Names}} {{.Status}}'
docker start web                                     <span class="tok-comment"># 3. khởi chạy tiến trình</span>
docker ps --filter name=web --format '{{.Names}} {{.Status}}'</code></pre>
<div class="out">web Created
web
web Up 1 second</div>
<p>Giữa bước 2 và bước 3 thì container TỒN TẠI đầy đủ — nó có ID, có tên, có tầng ghi được, có cấu hình mạng và có ánh xạ cổng — mà chẳng có gì đang chạy. Trạng thái đó là thật và hữu ích: <code>docker create</code> rồi <code>docker cp</code> một file vào, rồi <code>start</code>. Nó cũng là lý do câu "container tồn tại nhưng ứng dụng không chạy" là một câu có nghĩa.</p>
<div class="lz-map">
  <div class="lz-stage">created</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Đã cấu hình, chưa từng khởi chạy</span><span class="lz-nsub">Tầng ghi được đã cấp, không có tiến trình nào. <code>start</code> đưa nó sang running; <code>rm</code> xoá nó đi.</span></div></div>
  <div class="lz-stage">running</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">PID 1 đang sống</span><span class="lz-nsub"><code>stop</code> → exited (lịch sự). <code>kill</code> → exited (ngay lập tức). <code>pause</code> → paused. <code>restart</code> = stop rồi start.</span></div></div>
  <div class="lz-stage">paused</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bị đóng băng bởi bộ đông lạnh của cgroup</span><span class="lz-nsub">Mọi tiến trình bị treo, bộ nhớ nguyên vẹn, socket vẫn mở nhưng không có gì trả lời. <code>unpause</code> chạy tiếp từ đúng chỗ đó.</span></div></div>
  <div class="lz-stage">exited</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Tiến trình xong; container vẫn còn</span><span class="lz-nsub">Tầng ghi được, log và mã thoát của nó đều còn nguyên — đó là lý do <code>docker logs</code> chạy được trên một container đã chết. <code>start</code> chạy lại nó; <code>rm</code> mới xoá hẳn.</span></div></div>
  <div class="lz-stage">restarting / dead</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một chính sách khởi động lại đang thử lại · hoặc dọn dẹp thất bại</span><span class="lz-nsub">Một container kẹt ở <code>restarting</code> là một vòng lặp sập (Chương 12). <code>dead</code> thì hiếm và nghĩa là Docker không gỡ được nó — thường do một điểm gắn bị kẹt.</span></div></div>
</div>
<p>Mỗi mũi tên trên slide 16 là một lệnh. Cả bộ, kèm việc mỗi lệnh làm với từng phần của container:</p>
<table>
<tr><th>Lệnh</th><th>Tiến trình</th><th>Tầng ghi, log, tên</th></tr>
<tr><td><code>docker create</code></td><td>chưa có</td><td>được tạo</td></tr>
<tr><td><code>docker start</code></td><td>runc khởi chạy PID 1</td><td>giữ nguyên</td></tr>
<tr><td><code>docker stop</code> / <code>docker kill</code></td><td>kết thúc (lịch sự / ngay lập tức)</td><td>giữ nguyên — <code>docker logs</code> vẫn đọc được</td></tr>
<tr><td><code>docker restart</code></td><td>stop rồi start lại</td><td>giữ nguyên</td></tr>
<tr><td><code>docker pause</code> / <code>unpause</code></td><td>đóng băng / rã đông, không kết thúc</td><td>giữ nguyên</td></tr>
<tr><td><code>docker rm</code> (<code>-f</code> = dừng trước)</td><td>phải đã dừng</td><td><strong>xoá vĩnh viễn</strong></td></tr>
<tr><td><code>docker run --rm</code></td><td>bình thường</td><td>tự xoá khi PID 1 thoát</td></tr>
</table>
<pre><code>docker pause web   &amp;&amp; docker ps --format '{{.Names}} {{.Status}}'
docker unpause web &amp;&amp; docker stop web
docker ps -a --filter name=web --format '{{.Names}} {{.Status}}'
docker start web &amp;&amp; docker rm -f web</code></pre>
<div class="out">web Up 12 seconds (Paused)
web Exited (0) 1 second ago</div>
<p>"Paused" trông thế nào từ bên ngoài — đo trên máy Mac của khoá, cổng mở ra ở 18010: cổng vẫn mở, nhưng không ai trả lời.</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' localhost:18010          <span class="tok-comment"># đang chạy</span>
docker pause web
curl -s -m 3 -o /dev/null -w '%{http_code}\\n' localhost:18010; echo "curl thoát \$?"</code></pre>
<div class="out">200
web
000
curl thoát 28</div>
<p><code>000</code> và mã thoát 28 của curl nghĩa là "hết giờ chờ": máy chủ đã nhận kết nối, nhưng nginx bị đóng băng nên không bao giờ trả lời. Một container đang pause trông y hệt một container bị treo — nên biết điều này trước khi ngồi gỡ lỗi nó cả tiếng.</p>

<h3>stop là một cuộc thương lượng; kill thì không</h3>
${slide('dk-01', 17, 'docker stop: SIGTERM → chờ → SIGKILL (đo thật)')}
<pre><code>docker run -d --name w nginx:1.27-alpine
time docker stop w                <span class="tok-comment"># nginx xử lý SIGTERM: nhanh</span>
docker rm w

docker run -d --name w2 alpine sh -c 'trap "" TERM; sleep 600'
time docker stop w2               <span class="tok-comment"># phớt lờ SIGTERM: chờ, rồi SIGKILL</span>
docker inspect w2 --format '{{.State.ExitCode}}'
docker rm w2</code></pre>
<div class="out">real	0m0.283s
real	0m10.402s
137</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · docker stop gửi SIGTERM</span><span class="lz-t">tới PID 1 bên trong container, và CHỈ tới PID 1</span><span class="lz-d">Đây là cơ hội để ứng dụng hoàn tất các request đang bay, xả bộ đệm, đóng kết nối cơ sở dữ liệu và thoát sạch sẽ. Một máy chủ ngoan ngoãn thoát trong vài mili giây.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Docker chờ 10 giây</span><span class="lz-t">chỉnh được: <code>docker stop -t 30</code>, hoặc <code>STOPSIGNAL</code>/<code>stop_grace_period</code></span><span class="lz-d">Nếu PID 1 thoát trong lúc chờ thì xong, và mã thoát là thứ nó trả về. Mười giây là mặc định và thường là quá ngắn cho một API đang bận.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Rồi SIGKILL, vô điều kiện</span><span class="lz-t">mã thoát 137 = 128 + 9</span><span class="lz-d">Không gì bắt hay phớt lờ được SIGKILL. Request đang bay bị rớt, bộ đệm mất, và một cơ sở dữ liệu đang ghi dở bị bỏ lại tự phục hồi ở lần khởi động sau.</span></div>
  <div class="lz-step"><span class="lz-k">docker kill nhảy thẳng tới bước 3</span><span class="lz-t"><code>docker kill --signal=HUP</code> gửi được tín hiệu bất kỳ</span><span class="lz-d">Hữu ích cho những thao tác kiểu <code>nginx -s reload</code>; nhưng phá hoại nếu dùng làm cách để dừng.</span></div>
</div>
<div class="callout warn"><strong>Một cú dừng 10 giây ở MỌI lần deploy là một triệu chứng, không phải một sự thật hiển nhiên của đời.</strong> Nếu <code>docker stop</code> lần nào cũng mất mười giây thì PID 1 của bạn không xử lý SIGTERM — hoặc ứng dụng phớt lờ nó, hoặc (hay gặp hơn nhiều) PID 1 là một cái shell không bao giờ chuyển tiếp nó. Phần kế tiếp chính là con bọ đó, và sửa nó là cắt mười giây khỏi MỌI lần khởi động lại.</div>

<h3>Chạy thử từng bước: nhìn một cú stop bằng docker events</h3>
<p><code>time</code> cho biết cú stop mất <em>bao lâu</em>; <code>docker events</code> cho biết <em>tín hiệu nào</em> được gửi và lúc nào. Mở hai terminal:</p>
<pre><code class="language-bash"><span class="tok-comment"># terminal 1 — lắng nghe</span>
docker events --filter container=slow --format '{{.Time}} {{.Action}} {{index .Actor.Attributes "signal"}} {{index .Actor.Attributes "exitCode"}}'
<span class="tok-comment"># terminal 2 — một PID 1 phớt lờ SIGTERM, rồi cũng thế nhưng có --init</span>
docker run -d --name slow alpine sleep 600 &amp;&amp; docker stop slow &amp;&amp; docker rm slow
docker run -d --name slow --init alpine sleep 600 &amp;&amp; docker stop slow &amp;&amp; docker rm slow</code></pre>
<div class="out">1790169701 kill 15
1790169711 kill 9
1790169712 stop
1790169712 die 137
1790169714 kill 15
1790169714 stop
1790169714 die 143</div>
<p>Output thật trên máy Linux của khoá (Docker 29.6). Cú stop đầu: <code>kill 15</code> (SIGTERM), mười giây im lặng, <code>kill 9</code> (SIGKILL), <code>die 137</code>. Cú thứ hai: <code>kill 15</code> rồi <code>die 143</code> ngay trong cùng một giây — không cần tới SIGKILL. Đó chính là slide 17 viết bằng chữ. (Cột thứ nhất là thời điểm tính bằng giây kể từ 1/1/1970 — trừ hai số cho nhau là ra khoảng cách.)</p>
<div class="callout warn"><strong>Hãy đo máy của chính bạn.</strong> Tài liệu nói thời gian ân hạn là 10 giây với container Linux, và máy Linux khớp đúng (10,13 s). Còn máy Mac của khoá với Docker Desktop 4.91 thì gửi SIGKILL sau khoảng <strong>3 giây</strong> — cùng lệnh <code>docker stop</code> không tuỳ chọn, lặp lại nhiều lần, và <code>docker stop -t 10</code> thì chờ lại đủ 10 s. Chúng tôi chưa tìm ra thiết lập nào gây ra điều đó, nên đừng tin một giá trị mặc định mà bạn chưa đo: đặt thời gian chờ bạn cần một cách tường minh.</div>
<table>
<tr><th>Ở đâu</th><th>Đặt thời gian ân hạn / tín hiệu thế nào</th></tr>
<tr><td>Một lần dừng</td><td><code>docker stop -t 30 web</code> — chờ 30 s rồi mới SIGKILL</td></tr>
<tr><td>Cho một container</td><td><code>docker run --stop-timeout 30 --stop-signal SIGINT …</code></td></tr>
<tr><td>Trong ảnh</td><td><code>STOPSIGNAL SIGQUIT</code> trong Dockerfile (vd để nginx tắt êm)</td></tr>
<tr><td>Compose</td><td><code>stop_grace_period: 30s</code>, <code>stop_signal: SIGINT</code>, <code>init: true</code> (Chương 9)</td></tr>
</table>

<h3>PID 1 là đặc biệt, và dạng shell làm hỏng nó</h3>
${slide('dk-01', 18, 'PID 1 phải tự bắt SIGTERM')}
${slide('dk-01', 19, 'Shell làm PID 1 và ba cách sửa')}
<pre><code><span class="tok-comment"># Dạng shell — câu lệnh bị bọc trong /bin/sh -c</span>
docker run -d --name shellform alpine sh -c 'sleep 600; echo xong'
docker exec shellform ps -o pid,args

<span class="tok-comment"># Dạng exec — tiến trình của bạn CHÍNH LÀ pid 1</span>
docker run -d --name execform alpine sleep 600
docker exec execform ps -o pid,args</code></pre>
<div class="out">PID   COMMAND
    1 sh -c sleep 600; echo xong
    7 sleep 600
    8 ps -o pid,args

PID   COMMAND
    1 sleep 600
    7 ps -o pid,args</div>
<p>Ở container đầu tiên, PID 1 là <code>/bin/sh</code>, còn <code>sleep</code> là con của nó. <code>docker stop</code> gửi tín hiệu tới PID 1 — cái shell — mà theo mặc định nó không chuyển tiếp tín hiệu cho con và cũng không thoát trong lúc đang chờ. Thế là cái shell ngồi im, đồng hồ mười giây hết giờ, và mọi thứ chết bằng SIGKILL.</p>
<div class="callout"><strong>Vì sao lại có <code>; echo xong</code>?</strong> Vì shell hay tỏ ra khôn. Bản cũ của bài chạy <code>sh -c 'sleep 600'</code> trơn và cho thấy <code>/bin/sh</code> là PID 1 — Alpine KHÔNG làm vậy. <code>sh</code> của busybox (cả <code>dash</code> và <code>bash</code> nữa) <em>exec</em> thẳng lệnh cuối cùng của chuỗi <code>-c</code> thay vì rẽ nhánh ra, nên cái shell biến mất:
<pre><code class="language-bash">docker run -d --name s1 alpine sh -c 'sleep 600'
docker exec s1 ps -o pid,args</code></pre>
<div class="out">PID   COMMAND
    1 sleep 600
    7 ps -o pid,args</div>
Đừng trông vào nó. Cái shell ở lại ngay khi có BẤT CỨ thứ gì đứng sau ứng dụng — một lệnh thứ hai, một <code>trap</code>, một vòng lặp, một script entrypoint nhiều dòng — mà đó lại đúng là hình dạng của các dòng <code>CMD</code> ngoài đời. Và kể cả khi ứng dụng của bạn đúng là PID 1, nó VẪN phải tự xử lý SIGTERM (mục ngay sau).</div>
<p>Linux cho PID 1 hai tính chất khác thường, và cả hai đều quan trọng ở đây:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">PID 1 PHỚT LỜ những tín hiệu nó không có trình xử lý</span><span class="v">Bình thường một SIGTERM không được xử lý sẽ giết tiến trình. Với PID 1 thì nhân đơn giản là VỨT nó đi. Nên một chương trình không bao giờ cài trình xử lý SIGTERM thì khi làm PID 1 sẽ không-giết-được-bằng-SIGTERM, dù chính chương trình đó ở chỗ khác thì dừng ngay tức khắc.</span></div>
  <div class="kv"><span class="k">PID 1 PHẢI thu dọn tiến trình con mồ côi</span><span class="v">Khi cha của một tiến trình bất kỳ chết, đứa mồ côi được gán lại cho PID 1, và PID 1 phải gọi <code>wait()</code> lên nó. Một cái shell hay một ứng dụng không làm việc đó sẽ thành một nhà máy sản xuất tiến trình xác — thấy được bằng số dòng trạng thái <code>Z</code> tăng dần trong <code>ps</code>, và cuối cùng là cạn bảng PID.</span></div>
  <div class="kv"><span class="k">Cách sửa A — dạng exec</span><span class="v"><code>CMD ["node", "server.js"]</code> thay cho <code>CMD node server.js</code>. Tiến trình của bạn thành PID 1 trực tiếp và nhận được tín hiệu. Đây là câu trả lời mặc định và nó không tốn gì (Chương 4).</span></div>
  <div class="kv"><span class="k">Cách sửa B — exec trong entrypoint của bạn</span><span class="v">Nếu bạn thật sự cần một script shell bọc ngoài thì hãy kết thúc nó bằng <code>exec node server.js</code>. <code>exec</code> THAY THẾ cái shell chứ không rẽ nhánh, nên ứng dụng của bạn thừa hưởng PID 1.</span></div>
  <div class="kv"><span class="k">Cách sửa C — --init</span><span class="v"><code>docker run --init</code> chèn một init tí hon (<code>tini</code>) làm PID 1, nó chuyển tiếp tín hiệu và thu dọn tiến trình xác. Đây là câu trả lời đúng khi tiến trình thật sự có sinh con — một bộ chạy test, một bộ giám sát, bất cứ thứ gì dùng <code>child_process</code>.</span></div>
</div>
<pre><code>docker rm -f shellform execform
docker run -d --name good --init alpine sh -c 'exec sleep 600'
docker exec good ps -o pid,args | head -3
time docker stop good; docker rm good</code></pre>
<div class="out">PID   COMMAND
    1 /sbin/docker-init -- sh -c exec sleep 600
    7 sleep 600
real	0m0.131s</div>
<p class="note-ct">Khối này trước đây chạy y như vậy nhưng KHÔNG có <code>--init</code> và in ra cú stop 0,24 s. Đo trên Docker 29.6 thì nó mất trọn 10,13 s: <code>exec</code> làm <code>sleep</code> thành PID 1, nhưng <code>sleep</code> không cài hàm xử lý SIGTERM nào, và PID 1 không có hàm xử lý thì phớt lờ SIGTERM. <code>--init</code> đặt <code>docker-init</code> (tini) đứng trước, và nó thì có xử lý.</p>

<h3>Ứng dụng của bạn làm PID 1: nó PHẢI bắt SIGTERM</h3>
<p>Cách sửa A (dạng exec) quyết định <em>ai</em> là PID 1. Nó không làm chương trình đó biết lắng nghe. Máy Linux của khoá, <code>docker stop</code> mặc định, năm kiểu PID 1:</p>
<table>
<tr><th>PID 1</th><th>Stop mất</th><th>Mã thoát</th><th>Vì sao</th></tr>
<tr><td><code>node -e "setInterval(()=&gt;{},1000)"</code></td><td>10,17 s</td><td>137</td><td>Node không cài hàm xử lý SIGTERM ⇒ bị vứt ⇒ SIGKILL</td></tr>
<tr><td><code>sleep 600</code> (dạng exec)</td><td>10,13 s</td><td>137</td><td>như trên</td></tr>
<tr><td>Node có <code>process.on('SIGTERM', …)</code></td><td>0,14 s</td><td>0</td><td>hàm xử lý chạy, đóng kết nối, thoát sạch</td></tr>
<tr><td>Node với <code>--init</code></td><td>0,16 s</td><td>143</td><td>tini làm PID 1, chuyển tiếp SIGTERM; Node (không còn là PID 1) chết theo mặc định</td></tr>
<tr><td>nginx</td><td>0,20 s</td><td>0</td><td>nginx tự có hàm xử lý</td></tr>
</table>
<p>Với API Express của một đồ án sinh viên, câu trả lời đúng là CẢ HAI: dạng exec trong Dockerfile, và một hàm xử lý làm xong các request đang dở rồi mới thoát.</p>
<pre><code class="language-javascript">const server = app.listen(3000);
process.on('SIGTERM', () =&gt; {
  console.log('Nhận SIGTERM, đóng kết nối...');
  server.close(() =&gt; process.exit(0));    <span class="tok-comment">// ngừng nhận request mới, làm xong request đang mở, rồi thoát 0</span>
});</code></pre>
<p>Có Prisma thì thêm <code>await prisma.$disconnect()</code> trong hàm gọi lại đó. Mã thoát 0 cùng dòng log ấy trong <code>docker logs</code> là cách bạn biết lần deploy đã dừng container cũ một cách lịch sự.</p>

<h3>Mã thoát nói cho bạn biết chuyện gì đã xảy ra</h3>
${slide('dk-01', 20, 'Mã thoát kể lại chuyện gì đã xảy ra')}
<pre><code>docker run --name a alpine true;                 echo "a: \$(docker inspect -f '{{.State.ExitCode}}' a)"
docker run --name b alpine false;                echo "b: \$(docker inspect -f '{{.State.ExitCode}}' b)"
docker run --name c alpine /bin/nope 2&gt;/dev/null; echo "c: \$(docker inspect -f '{{.State.ExitCode}}' c)"
docker run --name d alpine /etc/hostname 2&gt;/dev/null; echo "d: \$(docker inspect -f '{{.State.ExitCode}}' d)"
docker rm a b c d &gt;/dev/null</code></pre>
<div class="out">a: 0
b: 1
c: 127
d: 126</div>
<div class="kv-grid">
  <div class="kv"><span class="k">0</span><span class="v">Thoát sạch. Với một công việc chạy một lần thì đó là thành công; với một máy chủ thì nghĩa là tiến trình đã kết thúc trong khi lẽ ra không nên — hãy xem log để biết nó đã quyết định làm gì thay vì lắng nghe.</span></div>
  <div class="kv"><span class="k">1 (hoặc một số nhỏ bất kỳ)</span><span class="v">Ứng dụng CHỌN thoát ra với lỗi. Lý do nằm trong <code>docker logs</code>, và đây là trường hợp TỐT: mã của bạn kịp nói được một câu.</span></div>
  <div class="kv"><span class="k">125</span><span class="v">Chính Docker hỏng TRƯỚC KHI container khởi động — một cái cờ sai, một volume không tồn tại. Lỗi nằm ở stderr của CLI, không nằm trong log của container.</span></div>
  <div class="kv"><span class="k">126</span><span class="v">Tìm thấy nhưng không chạy được: thiếu <code>+x</code>, hoặc một script mà dòng shebang có ký tự xuống dòng kiểu Windows, khiến nhân đi tìm <code>/bin/sh\\r</code>.</span></div>
  <div class="kv"><span class="k">127</span><span class="v">Không tìm thấy câu lệnh BÊN TRONG ảnh. Cực kỳ hay gặp sau khi đổi ảnh nền — cái chương trình bạn trông cậy đơn giản là không có trong ảnh này.</span></div>
  <div class="kv"><span class="k">137 / 143</span><span class="v">Bị SIGKILL (128+9) hoặc SIGTERM (128+15) giết. 137 mà bạn không hề gõ lệnh stop nào thì nghĩa là trần bộ nhớ hoặc kẻ giết OOM của máy chủ. 143 nghĩa là có thứ yêu cầu nó dừng và nó đã tuân theo.</span></div>
</div>
<p>Một chi tiết bảng trên không nói: với 126 và 127 tiến trình chưa hề khởi chạy, nên container nằm lại ở <code>created</code>, không phải <code>exited</code>. Trên máy Mac của khoá:</p>
<pre><code class="language-bash">docker run --name c alpine /bin/nope; docker inspect -f '{{.State.ExitCode}} {{.State.Status}}' c
docker run --name d alpine /etc/hostname; docker inspect -f '{{.State.ExitCode}} {{.State.Status}}' d</code></pre>
<div class="out">docker: Error response from daemon: failed to create task for container: failed to create shim task: OCI runtime create failed: runc create failed: unable to start container process: error during container init: exec: "/bin/nope": stat /bin/nope: no such file or directory

Run 'docker run --help' for more information
127 created
docker: Error response from daemon: failed to create task for container: failed to create shim task: OCI runtime create failed: runc create failed: unable to start container process: error during container init: exec: "/etc/hostname": permission denied

Run 'docker run --help' for more information
126 created</div>
<p>Đọc thông báo lỗi từ bên phải: <code>exec: "/bin/nope": stat /bin/nope: no such file or directory</code> (127) hay <code>exec: "/etc/hostname": permission denied</code> (126) — runc (Bài 1.5) đã cố <code>exec</code> câu lệnh bên trong container mới và không làm được. Chưa có gì chạy, nên <code>docker logs</code> trống trơn; lý do chỉ nằm trên terminal của bạn.</p>

<h3>Xem tận mắt: docker events</h3>
<pre><code>docker events --filter type=container --format '{{.Time}} {{.Action}} {{.Actor.Attributes.name}}' &amp;
docker run -d --name ev --rm alpine sleep 2
sleep 4; kill %1</code></pre>
<div class="out">1790169685 create ev
1790169685 start ev
1790169687 die ev
1790169688 destroy ev</div>
<p class="note-ct">Output thật trên máy Mac của khoá. Bản cũ có một sự kiện <code>attach</code> ở đây; chạy với <code>-d</code> thì KHÔNG có — <code>attach</code> chỉ hiện khi CLI ở lại nối vào output, tức <code>docker run</code> <em>không</em> có <code>-d</code> (đã kiểm: khi đó chuỗi là create, attach, start, die, destroy).</p>
<p><code>docker events</code> là một dòng chảy trực tiếp mọi việc tiến trình nền làm, và nó là cách nhanh nhất để trả lời "3 giờ 14 phút thật ra đã xảy ra chuyện gì?" — kể cả những sự kiện chẳng ai yêu cầu, như một chính sách khởi động lại phóng lại một container đang sập bốn mươi lần. Chương 12 dùng nó; <code>--since</code> và <code>--until</code> phát lại lịch sử.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> lần deploy nào API của nhóm bạn cũng treo vài giây ở "Stopping…", và log không bao giờ có dòng báo đã đóng kết nối. Tái hiện nó bằng một server Node tí hon, đo nó, và sửa nó.</p><ol>
<li><code>mkdir -p ~/thu-docker/tin-hieu &amp;&amp; cd ~/thu-docker/tin-hieu</code> rồi tạo <code>server.js</code> với ba dòng đầu bên dưới (chưa có hàm xử lý).</li>
<li>Ở terminal thứ hai, chạy <code>docker events --filter container=thu-api --format '{{.Action}} {{index .Actor.Attributes "signal"}}{{index .Actor.Attributes "exitCode"}}'</code>.</li>
<li>Chạy rồi dừng nó: <code>docker run -d --name thu-api -v "\$PWD":/app -w /app node:22-alpine node server.js</code>, rồi <code>time docker stop thu-api</code> và <code>docker rm thu-api</code>. Ghi lại các tín hiệu ở terminal 2.</li>
<li>Thêm khối <code>process.on('SIGTERM')</code> vào cuối <code>server.js</code>, chạy và dừng lại lần nữa, rồi đọc <code>docker logs thu-api</code> trước khi xoá nó.</li>
<li>Dọn dẹp: <code>docker rm -f thu-api</code>, <code>cd .. &amp;&amp; rm -rf tin-hieu</code>.</li></ol>
<pre><code class="language-javascript">const http = require('http');
const server = http.createServer((req, res) =&gt; res.end('ok\\n'));
server.listen(3000, () =&gt; console.log('API chạy ở cổng 3000'));
<span class="tok-comment">// bước 4: thêm vào</span>
process.on('SIGTERM', () =&gt; {
  console.log('Nhận SIGTERM, đóng kết nối...');
  server.close(() =&gt; process.exit(0));
});</code></pre>
<p>Thứ máy Mac của khoá in ở terminal 2 (trước, rồi sau khi sửa):</p>
<div class="out">kill 15
kill 9
stop
die 137
kill 15
stop
die 0</div>
<p><strong>Đạt khi:</strong> trước khi sửa bạn thấy <code>kill 15</code> rồi <code>kill 9</code> và <code>die 137</code>; sau khi sửa chỉ còn <code>kill 15</code> và <code>die 0</code>, cú stop mất chưa tới một giây, và <code>docker logs</code> có dòng "đóng kết nối" của bạn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Lifecycle (vòng đời)</span><span class="v">Các trạng thái một container đi qua: created → running ⇄ paused → exited → bị xoá.</span></div>
  <div class="kv"><span class="k">PID 1 (tiến trình số 1)</span><span class="v">Tiến trình đầu tiên trong namespace PID của container. Container sống đúng bằng tuổi thọ của nó.</span></div>
  <div class="kv"><span class="k">SIGTERM / SIGKILL (tín hiệu dừng / tín hiệu giết)</span><span class="v">Tín hiệu 15, "xin hãy dừng" (bắt được); tín hiệu 9, "chết ngay" (không bắt được).</span></div>
  <div class="kv"><span class="k">Grace period (thời gian ân hạn)</span><span class="v">Khoảng <code>docker stop</code> chờ giữa SIGTERM và SIGKILL; đặt bằng <code>-t</code> / <code>--stop-timeout</code>.</span></div>
  <div class="kv"><span class="k">Exec form / shell form (dạng exec / dạng shell)</span><span class="v"><code>CMD ["node","server.js"]</code> chạy thẳng chương trình; <code>CMD node server.js</code> bọc nó trong <code>/bin/sh -c</code>.</span></div>
  <div class="kv"><span class="k">Zombie process (tiến trình xác)</span><span class="v">Một tiến trình con đã xong mà chưa ai gọi <code>wait()</code>; PID 1 có trách nhiệm dọn chúng.</span></div>
  <div class="kv"><span class="k">init / tini (<code>--init</code>)</span><span class="v">Một PID 1 tí hon chuyển tiếp tín hiệu cho ứng dụng và dọn tiến trình xác.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>docker run</code> = pull + create + start; container created hay exited vẫn giữ tầng ghi, log và tên cho tới khi <code>rm</code>.</li>
<li><code>docker stop</code> gửi SIGTERM, chờ (10 s theo tài liệu — hãy đo máy bạn), rồi SIGKILL; <code>docker events</code> cho thấy chính xác cái nào.</li>
<li>PID 1 phớt lờ mọi tín hiệu nó không có hàm xử lý — kể cả Node và <code>sleep</code> — nên app phải bắt SIGTERM, hoặc chạy với <code>--init</code>.</li>
<li>Shell đứng làm PID 1 thì chặn tín hiệu tới app; dùng dạng exec, <code>exec</code> trong entrypoint, hoặc <code>--init</code>.</li>
<li>Mã thoát: 0 sạch, 1 app báo lỗi, 125 Docker lỗi, 126/127 không chạy được / không có lệnh (container nằm ở <code>created</code>), 137 SIGKILL, 143 SIGTERM.</li>
<li>Container đang pause vẫn mở cổng mà không bao giờ trả lời — trông y hệt bị treo.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/cli/docker/container/stop/" target="_blank" rel="noopener">
  <span class="lc-ico">🛑</span>
  <span class="lc-body"><span class="lc-title">docker stop — tài liệu tra cứu</span><span class="lc-sub">Ngữ nghĩa chính xác của chuỗi SIGTERM-rồi-SIGKILL, cái cờ hết giờ <code>-t</code>, và cách <code>STOPSIGNAL</code> trong Dockerfile đổi tín hiệu nào được gửi trước.</span></span>
</a>
<a class="link-card" href="https://github.com/krallin/tini" target="_blank" rel="noopener">
  <span class="lc-ico">🧬</span>
  <span class="lc-body"><span class="lc-title">tini — cái init mà <code>--init</code> dùng</span><span class="lc-sub">README của nó là lời giải thích ngắn gọn rõ ràng nhất ở bất cứ đâu về việc vì sao PID 1 cần chuyển tiếp tín hiệu và thu dọn tiến trình xác, và khi nào bạn cần hay không cần một cái.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/cli/docker/system/events/" target="_blank" rel="noopener">
  <span class="lc-ico">📡</span>
  <span class="lc-body"><span class="lc-title">docker events</span><span class="lc-sub">Mọi loại sự kiện tiến trình nền phát ra và mọi bộ lọc bạn áp được. Ít người dùng, và là công cụ đúng ngay khoảnh khắc bạn cần biết chuyện gì đã xảy ra lúc bạn không nhìn.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: vòng đời và tín hiệu</span><span class="lc-sub">Bài chấm điểm: tạo một container mà không khởi chạy nó, làm cho <code>docker stop</code> mất mười giây rồi sửa lại, đọc một mã thoát và gọi tên nguyên nhân, và bắt một vòng lặp sập trong <code>docker events</code>.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> container đã dừng thì KHÔNG biến mất, và chúng chất đống. Mỗi lệnh <code>docker run</code> không có <code>--rm</code> để lại một container <code>Exited</code> giữ mãi cái tên, tầng ghi được và log của nó. Triệu chứng là một dòng khó hiểu <code>Conflict. The container name "/web" is already in use</code> trong khi chẳng có gì đang chạy, và một chỗ rò đĩa chậm rãi không ai để ý — <code>docker ps -a | wc -l</code> lên tới hàng trăm. Hãy dùng <code>--rm</code> cho mọi thứ tương tác hoặc chạy một lần, giữ container lại khi bạn cần log hay mã thoát của nó, và tỉa một cách có chủ ý: <code>docker container prune</code>.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> <code>run</code> là <code>pull</code> + <code>create</code> + <code>start</code>, và biết điều đó làm phần còn lại của CLI trở nên hiển nhiên. <code>docker stop</code> hỏi lịch sự bằng SIGTERM rồi ép buộc bằng SIGKILL mười giây sau — nên một cú stop lần nào cũng mất mười giây nghĩa là PID 1 của bạn không lắng nghe. Và hãy dùng dạng exec (<code>CMD ["node","server.js"]</code>) hoặc <code>exec</code> trong entrypoint để tiến trình của bạn THẬT SỰ là PID 1, vì một cái shell ở vị trí đó sẽ nuốt tín hiệu và để lại tiến trình xác.</p>
</div>
`,
    },
    /* ─────────────────────────── 1.4 ─────────────────────────── */
    {
      title: '1.4 — The writable layer, and why your data disappears|||1.4 — Tầng ghi được, và vì sao dữ liệu của bạn biến mất',
      slug: 'dk-1-4-tang-ghi-duoc',
      type: 'LESSON',
      description: 'Chứng minh dữ liệu chết theo container, ba đường thoát ra khỏi tầng ghi được, docker cp để cứu hộ, docker commit và vì sao nó là cái bẫy, và export khác save ở đâu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>The writable layer, and why your data disappears</h2>
<p class="lead">Every container gets one thin writable layer on top of the image's read-only stack. Everything the process writes goes there, and <code>docker rm</code> deletes it. That design is what makes containers disposable and cheap — and it is also the single most expensive lesson beginners learn, usually with a database.</p>

<h3>Watch it happen</h3>
${slide('dk-01', 21, 'restart giữ dữ liệu, rm xoá')}
<pre><code>docker run -d --name db -e POSTGRES_PASSWORD=x postgres:16-alpine
sleep 6
docker exec db psql -U postgres -c 'create table important (id int, note text);'
docker exec db psql -U postgres -c "insert into important values (1,'six months of work');"
docker exec db psql -U postgres -c 'select * from important;'</code></pre>
<div class="out">CREATE TABLE
INSERT 0 1
 id |        note
----+--------------------
  1 | six months of work
(1 row)</div>
<pre><code>docker restart db &amp;&amp; sleep 5
docker exec db psql -U postgres -c 'select count(*) from important;'   <span class="tok-comment"># survives a restart</span>
docker rm -f db
docker run -d --name db -e POSTGRES_PASSWORD=x postgres:16-alpine &amp;&amp; sleep 6
docker exec db psql -U postgres -c 'select * from important;'</code></pre>
<div class="out"> count
-------
     1
(1 row)

ERROR:  relation "important" does not exist
LINE 1: select * from important;
                      ^</div>
<p>A <strong>restart</strong> keeps everything — same container, same writable layer. A <strong>remove and recreate</strong> keeps nothing, because the layer went with the container. And "remove and recreate" is exactly what a deploy does, what <code>docker compose down</code> does, and what changing any <code>docker run</code> flag forces you to do. There is no warning and no confirmation.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">docker stop / start / restart</span><span class="lz-t">the writable layer survives</span><span class="lz-d">Same container object, same UpperDir on disk. Safe.</span></div>
  <div class="lz-step"><span class="lz-k">docker rm · docker compose down</span><span class="lz-t">the writable layer is deleted</span><span class="lz-d">Permanently, immediately, with no prompt. This is the normal way to change a container's configuration, so it happens often.</span></div>
  <div class="lz-step"><span class="lz-k">A new image version</span><span class="lz-t">necessarily a new container</span><span class="lz-d">Every deploy destroys the writable layer. Anything that must outlive a deploy cannot live there — which is every database, upload directory, and cache you care about.</span></div>
  <div class="lz-step"><span class="lz-k">The fix, in one word</span><span class="lz-t">volumes (Chapter 7)</span><span class="lz-d"><code>-v pgdata:/var/lib/postgresql/data</code> puts that path outside the container's lifecycle entirely. The container becomes disposable again — which was always the point.</span></div>
</div>

<h3>Look closer: where was Postgres's data really?</h3>
${slide('dk-01', 22, 'Postgres “mất dữ liệu” vì được gắn một volume vô danh mới')}
<p>The outcome above is real — the table is gone after <code>rm</code> and recreate. But for <em>this</em> image the mechanism is different from the one just described, and the difference is good news. Ask Docker what the container actually wrote, and what it has mounted (course's Mac, Docker Desktop 4.91):</p>
<pre><code class="language-bash">docker diff db
docker inspect db --format '{{range .Mounts}}{{.Type}} {{.Name}} -&gt; {{.Destination}}{{end}}'</code></pre>
<div class="out">C /run
C /run/postgresql
A /run/postgresql/.s.PGSQL.5432
A /run/postgresql/.s.PGSQL.5432.lock
volume c979f0bdbde303e3d40a11083637c05d06a2dbd7f61d44f8066139572e0030e7 -&gt; /var/lib/postgresql/data</div>
<p>The writable layer holds only two socket files. The database lives in a <strong>volume</strong> with a random 64-character name, because the postgres image declares <code>VOLUME /var/lib/postgresql/data</code> and Docker creates an <em>anonymous volume</em> for it automatically. <code>docker rm -f db</code> (without <code>-v</code>) deletes the container but leaves that volume behind. The new container gets a <em>new</em> anonymous volume — here <code>35dbac4a50ad…</code> — with an empty database. The data was never deleted; it was orphaned. So it can be rescued:</p>
<pre><code class="language-bash">docker run -d --name db-cuu -e POSTGRES_PASSWORD=x \\
  -v c979f0bdbde303e3d40a11083637c05d06a2dbd7f61d44f8066139572e0030e7:/var/lib/postgresql/data \\
  postgres:16-alpine
docker exec db-cuu psql -U postgres -c 'select * from important;'
docker logs db-cuu 2&gt;&amp;1 | grep -i skipping</code></pre>
<div class="out"> id |        note
----+--------------------
  1 | sáu tháng làm việc
(1 row)

PostgreSQL Database directory appears to contain a database; Skipping initialization</div>
<p>Real output from the course's Mac, where the demo row had been inserted in Vietnamese ("six months of work"). Two lessons follow. First, before you panic after a Postgres "data loss", run <code>docker volume ls -f dangling=true</code> — the data may be sitting right there. Second, for an image <em>without</em> a <code>VOLUME</code> line, everything really is in the writable layer and really is gone. You can see that pure case with any file:</p>
<pre><code class="language-bash">docker run -d --name ghi alpine sleep 600
docker exec ghi sh -c 'mkdir /data &amp;&amp; echo "don hang 42" &gt; /data/note.txt'
docker diff ghi
docker restart ghi &amp;&amp; docker exec ghi cat /data/note.txt
docker rm -f ghi
docker run --rm alpine cat /data/note.txt</code></pre>
<div class="out">A /data
A /data/note.txt
ghi
don hang 42
ghi
cat: can't open '/data/note.txt': No such file or directory</div>
<p><code>A</code> = added to the writable layer; it survives <code>restart</code>; it is gone with <code>rm</code>, and a new container from the same image starts clean. That is slide 21.</p>

<h3>Three ways data leaves the writable layer</h3>
${slide('dk-01', 23, 'Ba đường đưa dữ liệu ra khỏi tầng ghi')}
<div class="kv-grid">
  <div class="kv"><span class="k">Named volume — <code>-v pgdata:/var/lib/postgresql/data</code></span><span class="v">Docker-managed storage under <code>/var/lib/docker/volumes/</code>, with its own lifecycle. Survives <code>docker rm</code>, survives <code>compose down</code> (unless you pass <code>-v</code>), and is the correct answer for databases. Chapter 7.</span></div>
  <div class="kv"><span class="k">Bind mount — <code>-v "\$PWD/src:/app/src"</code></span><span class="v">A path on the host appears inside the container. Perfect for source code in development, and for config files. Brings a file-ownership problem on Linux that Chapter 7 solves properly.</span></div>
  <div class="kv"><span class="k">tmpfs — <code>--tmpfs /tmp</code></span><span class="v">Memory-backed, never touches disk, gone on stop. Right for scratch space and for anything sensitive you do not want written to a disk layer at all.</span></div>
  <div class="kv"><span class="k">Nothing — the default</span><span class="v">Everything in the writable layer. Correct for a stateless web server or an API: it should hold no state worth keeping, and if it does, that is the design bug the container just revealed.</span></div>
</div>
<div class="callout ok"><strong>Official images tell you which paths need a volume.</strong> Run <code>docker image inspect postgres:16-alpine --format '{{json .Config.Volumes}}'</code> and you get <code>{"/var/lib/postgresql/data":{}}</code>. That declaration is the image author saying "this is the stateful path". Docker will even create an anonymous volume for it automatically — which is worse than useless, because the volume survives but nothing remembers its random name, so it becomes orphaned disk usage. Always name it yourself.</div>
<p>The <code>-v</code> flag decides which of these you get by the shape of what is left of the colon — easy to get wrong, so read it once slowly:</p>
<table>
<tr><th>You write</th><th>You get</th><th>Note</th></tr>
<tr><td><code>-v pgdata:/var/lib/postgresql/data</code></td><td>Named volume</td><td>No slash on the left = a volume name. Created if missing.</td></tr>
<tr><td><code>-v "\$PWD/src":/app/src</code></td><td>Bind mount</td><td>Starts with <code>/</code> (or <code>./</code>, <code>~</code>) = a host path. Quote it: paths with spaces break.</td></tr>
<tr><td><code>-v /var/lib/postgresql/data</code></td><td>Anonymous volume</td><td>Only a container path = random name. This is what <code>VOLUME</code> does silently.</td></tr>
<tr><td><code>…:/app/config:ro</code></td><td>Read-only</td><td>The container cannot write there — good for config files.</td></tr>
<tr><td><code>--mount type=volume,src=pgdata,dst=/var/lib/postgresql/data</code></td><td>Named volume, long form</td><td>Same thing, spelled out; errors instead of guessing. Chapter 7 prefers it.</td></tr>
<tr><td><code>--tmpfs /tmp</code></td><td>tmpfs</td><td>RAM only, gone on stop.</td></tr>
</table>
<div class="callout">Mac and Windows: a bind mount crosses from your laptop into Docker Desktop's VM (VirtioFS on Mac, the WSL2 filesystem on Windows), so it is slower than a volume. A teammate on Windows should keep the project <em>inside</em> WSL2 (<code>~/project</code>, not <code>/mnt/c/…</code>) — Chapter 13 measures the difference.</div>

<h3>Getting data out — docker cp</h3>
${slide('dk-01', 24, 'docker cp cứu file từ container đã dừng — commit thì đừng')}
<pre><code><span class="tok-comment"># Out of a container — works even on a STOPPED one</span>
docker exec db pg_dump -U postgres postgres &gt; /tmp/dump.sql
docker cp db:/var/lib/postgresql/data/postgresql.conf ./pg.conf

<span class="tok-comment"># Into a container</span>
docker cp ./seed.sql db:/tmp/seed.sql
docker exec db psql -U postgres -f /tmp/seed.sql

ls -lh pg.conf</code></pre>
<div class="out">-rw-r--r-- 1 deploy deploy 30K Aug 22 21:14 pg.conf</div>
<p><code>docker cp</code> works against a stopped container because it reads the writable layer directly from disk rather than through the running process. That makes it the rescue tool: when a container crash-loops and you need the file it wrote just before dying, <code>docker cp</code> gets it while <code>docker exec</code> cannot.</p>
<div class="callout warn"><strong><code>docker cp</code> is not a deployment mechanism.</strong> Copying a fixed file into a running container produces a machine whose state exists nowhere in version control, cannot be reproduced, and vanishes on the next deploy. It is a debugging and rescue tool. If you find yourself doing it twice for the same file, the file belongs in the image or in a mounted volume.</div>

<h3>docker commit, and why you should not build this way</h3>
<pre><code>docker run -d --name tinker alpine sleep 600
docker exec tinker apk add --no-cache curl jq
docker commit -m 'added curl and jq' tinker my-tools:v1
docker images my-tools
docker history my-tools:v1 | head -3</code></pre>
<div class="out">IMAGE         ID             DISK USAGE   CONTENT SIZE   EXTRA
my-tools:v1   afa79e82afba         23MB         7.03MB
IMAGE          CREATED                  CREATED BY                                      SIZE      COMMENT
afa79e82afba   Less than a second ago   sleep 600                                       6.68MB    added curl and jq
28bd5fe8b56d   3 months ago             CMD ["/bin/sh"]                                 0B        buildkit.dockerfile.v0</div>
<p class="note-ct">Docker 29 output (course's Mac, containerd image store): <code>docker images</code> has new columns, and <code>CREATED BY</code> shows the container's command exactly as it was given — <code>sleep 600</code>, not <code>/bin/sh -c sleep 600</code> as an earlier version of this lesson printed. Either way it is the container's command, never the <code>apk add</code> you actually ran. The committed image even inherits it: <code>docker image inspect my-tools:v1 --format '{{json .Config.Cmd}}'</code> prints <code>["sleep","600"]</code>.</p>
<p>It works, and it is a trap. The new layer's <code>CREATED BY</code> says <code>sleep 600</code> — the container's command, not what you actually did. Six months later nobody, including you, can tell what is in this image or reproduce it. Compare with a three-line Dockerfile that is in git, reviewable, rebuildable on any machine, and rebuilt automatically when the base image gets a security patch.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Legitimate use — a forensic snapshot</span><span class="v">A container is misbehaving in production and you need its exact state for analysis. <code>docker commit</code> freezes it, and you can then run a shell in the snapshot without disturbing the original.</span></div>
  <div class="kv"><span class="k">Legitimate use — capturing a fix under pressure</span><span class="v">You hot-patched a container at 3am to end an incident. Commit it so the fix is not lost, then write the Dockerfile properly in the morning. The commit is a receipt, not the deliverable.</span></div>
  <div class="kv"><span class="k">Not legitimate — building images</span><span class="v">No source of truth, no code review, no reproducibility, no automatic rebuild, no way to answer "why is this package here?". Every argument for Dockerfiles is an argument against this.</span></div>
  <div class="kv"><span class="k">Not legitimate — "the Dockerfile is too slow"</span><span class="v">A slow build is a caching problem with a known fix (Chapter 5). Trading reproducibility for build time is a bad trade that gets worse every month.</span></div>
</div>

<h3>save versus export</h3>
${slide('dk-01', 25, 'save giữ nguyên ảnh — export ép phẳng container')}
<pre><code>docker save my-tools:v1 -o tools-image.tar        <span class="tok-comment"># an IMAGE: all layers + metadata</span>
docker export tinker  -o tinker-fs.tar           <span class="tok-comment"># a CONTAINER: one flat filesystem</span>
ls -lh tools-image.tar tinker-fs.tar
tar -tf tools-image.tar | head -4
tar -tf tinker-fs.tar | head -4</code></pre>
<div class="out">-rw------- 1 deploy deploy  13M Aug 22 21:20 tools-image.tar
-rw------- 1 deploy deploy  13M Aug 22 21:20 tinker-fs.tar
blobs/
blobs/sha256/
blobs/sha256/1b3ee35aacca9866b01dd96e870136266cf190d7a34bcc9a1d5bdb9e2f5c48d1
index.json
bin/
dev/
etc/
etc/alpine-release</div>
<div class="kv-grid">
  <div class="kv"><span class="k">docker save / docker load</span><span class="v">Round-trips an <strong>image</strong> with every layer, tag and config intact. The right way to move an image between machines with no registry — <code>docker save app:v2 | ssh vps 'docker load'</code>. Also how you inspect layers by hand, including finding a secret someone thought they deleted (Lesson 1.2).</span></div>
  <div class="kv"><span class="k">docker export / docker import</span><span class="v">Flattens a <strong>container's</strong> filesystem into one tar. Loses history, layers, <code>CMD</code>, <code>ENV</code> — everything in the config. Useful for extracting files or for deliberately squashing an image; not a backup, because the imported result will not start on its own without you re-specifying the command.</span></div>
</div>
<p>On Docker 29 with the containerd image store the two files are no longer the same size. The course's Mac, same commands:</p>
<div class="out">6.7M tools-image.tar
15M tinker-fs.tar
blobs/
blobs/sha256/
blobs/sha256/5de55e5ef9c033997441461efe7ba23a986db059c0bb78b38f84ee0d72b99167
blobs/sha256/69ef631d8294a67fa456087311136ab01d4fad2c85a66264a7f65c82e5a96019
.dockerenv
bin/
bin/arch
bin/ash</div>
<p><code>docker save</code> now writes the layers exactly as they were downloaded — gzip-compressed — so the image is 6.7M; <code>docker export</code> writes every file uncompressed, 15M. The output above came from the classic <code>overlay2</code> store, where both happened to be 13M.</p>
<table>
<tr><th>Tool</th><th>Use it for</th><th>Do NOT use it for</th></tr>
<tr><td><code>docker cp</code></td><td>Pulling a log or a dump out of a container, even a dead one; pushing one test file in</td><td>Changing a running production container "just this once"</td></tr>
<tr><td><code>docker commit</code></td><td>A forensic snapshot of a broken container; keeping a 3am hotfix until you write the Dockerfile</td><td>Building images you will ship</td></tr>
<tr><td><code>docker save</code> / <code>load</code></td><td>Moving an image to a machine with no registry: <code>docker save app:v2 | ssh vps docker load</code></td><td>Backing up data (volumes are not in it)</td></tr>
<tr><td><code>docker export</code> / <code>import</code></td><td>Extracting a container's files as one tar; deliberately flattening</td><td>Moving an image (CMD, ENV and history are lost)</td></tr>
</table>
<pre><code>docker rm -f tinker db; docker rmi my-tools:v1; rm -f tools-image.tar tinker-fs.tar</code></pre>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your group runs Postgres with a plain <code>docker run</code> and no <code>-v</code>. A teammate types <code>docker rm -f thu-db</code> "to restart it clean" and the <code>users</code> table is gone. Get it back, then make sure it cannot happen again.</p><ol>
<li>Set the scene: start <code>thu-db</code>, create and fill a table, and <strong>write down its volume name</strong> (block below).</li>
<li>Do the damage: <code>docker rm -f thu-db</code>, start <code>thu-db</code> again the same way, and confirm <code>select * from users;</code> fails.</li>
<li>Find the orphan: <code>docker volume ls -f dangling=true</code> — your old name should be in the list.</li>
<li>Rescue: <code>docker rm -f -v thu-db</code> (<code>-v</code> also deletes the new, empty anonymous volume), then start it with <code>-v \$V:/var/lib/postgresql/data</code> and select again.</li>
<li>Clean up: <code>docker rm -f thu-db</code> and <code>docker volume rm \$V</code>. From now on start databases with a volume <em>you</em> name, e.g. <code>-v thu-pgdata:/var/lib/postgresql/data</code>.</li></ol>
<pre><code class="language-bash">docker run -d --name thu-db -e POSTGRES_PASSWORD=x postgres:16-alpine
sleep 6
docker exec thu-db psql -U postgres -c "create table users(id int, name text); insert into users values (1,'Cuong');"
V=\$(docker inspect thu-db --format '{{range .Mounts}}{{.Name}}{{end}}'); echo \$V</code></pre>
<p><strong>Done when:</strong> after step 4 <code>select * from users;</code> shows <code>Cuong</code> again, you can explain why <code>rm</code> did not delete the data but a new container still started empty, and <code>docker volume ls -f dangling=true</code> no longer lists anything of yours.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Writable layer</span><span class="v">The container's own top layer (upperdir). Survives stop/restart, deleted by <code>rm</code>.</span></div>
  <div class="kv"><span class="k">Volume</span><span class="v">Docker-managed storage with its own lifecycle, mounted into containers; the place for databases.</span></div>
  <div class="kv"><span class="k">Anonymous volume</span><span class="v">A volume with a random name, created by <code>VOLUME</code> in an image or <code>-v /path</code>. Survives <code>rm</code> but nobody remembers it.</span></div>
  <div class="kv"><span class="k">Bind mount</span><span class="v">A host folder shown inside the container, e.g. your source code during development.</span></div>
  <div class="kv"><span class="k">tmpfs</span><span class="v">A mount that lives in RAM only; nothing reaches the disk.</span></div>
  <div class="kv"><span class="k">docker cp</span><span class="v">Copies files between host and container; works on stopped containers — the rescue tool.</span></div>
  <div class="kv"><span class="k">docker commit</span><span class="v">Turns a container into an image. Fine for evidence, wrong for building.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Every container has one writable layer: kept by <code>stop</code>/<code>restart</code>, destroyed by <code>rm</code> — and every deploy is an <code>rm</code>.</li>
<li>Images with a <code>VOLUME</code> line (postgres, mysql…) write data to an anonymous volume; after <code>rm</code> the data is orphaned, not deleted.</li>
<li>Always name volumes: <code>-v pgdata:/var/lib/postgresql/data</code>; the shape left of the colon decides volume vs bind mount.</li>
<li><code>docker cp</code> works on dead containers — use it to get evidence out, never to change production.</li>
<li><code>docker commit</code> records the container's command, not what you did: evidence only.</li>
<li><code>save</code> moves an image with all layers; <code>export</code> flattens a container's files and loses CMD/ENV.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/storage/" target="_blank" rel="noopener">
  <span class="lc-ico">💾</span>
  <span class="lc-body"><span class="lc-title">Docker storage overview</span><span class="lc-sub">Volumes, bind mounts and tmpfs side by side, with a diagram of where each one lives relative to the container. The official framing of what Chapter 7 covers in depth.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/cli/docker/container/cp/" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">docker cp — reference</span><span class="lc-sub">The exact path semantics (the trailing-slash rules bite everyone once), and the note that it works on stopped containers — which is what makes it a rescue tool.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: lose some data, then rescue it</span><span class="lc-sub">Graded exercises: destroy a database the way a deploy would, recover a file from a crash-looping container with <code>docker cp</code>, and explain what <code>docker commit</code> lost that a Dockerfile keeps.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> an anonymous volume that quietly hoards disk. Run <code>postgres</code> with no <code>-v</code> and Docker honours the image's <code>VOLUME</code> declaration by creating a volume with a random 64-character name. Your data survives <code>docker rm</code> after all — but the next container gets a <em>new</em> random volume and an empty database, so it looks like the data was lost, while the old volume sits there forever holding gigabytes. Check with <code>docker volume ls -f dangling=true</code> and reclaim with <code>docker volume prune</code>. Always name your volumes; then you can find them, back them up, and reattach them deliberately.</div>
<p class="note-ct"><strong>Three things to remember.</strong> <code>stop</code>/<code>start</code> keeps the writable layer and <code>rm</code> destroys it — and since every configuration change and every deploy means <code>rm</code>, anything that must survive needs a volume. <code>docker cp</code> works on stopped containers, which makes it the tool for getting evidence out of something that already died. And <code>docker commit</code> produces an image nobody can reproduce or explain: fine as a forensic snapshot, never as a way to build.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Tầng ghi được, và vì sao dữ liệu của bạn biến mất</h2>
<p class="lead">Mỗi container được cấp MỘT tầng ghi được mỏng nằm trên chồng tầng chỉ-đọc của ảnh. Mọi thứ tiến trình ghi ra đều vào đó, và <code>docker rm</code> xoá nó đi. Thiết kế đó là thứ khiến container vứt-đi-được và rẻ — và nó cũng là bài học đắt giá nhất mà người mới phải trả, thường là với một cơ sở dữ liệu.</p>

<h3>Nhìn tận mắt</h3>
${slide('dk-01', 21, 'restart giữ dữ liệu, rm xoá')}
<pre><code>docker run -d --name db -e POSTGRES_PASSWORD=x postgres:16-alpine
sleep 6
docker exec db psql -U postgres -c 'create table important (id int, note text);'
docker exec db psql -U postgres -c "insert into important values (1,'sáu tháng làm việc');"
docker exec db psql -U postgres -c 'select * from important;'</code></pre>
<div class="out">CREATE TABLE
INSERT 0 1
 id |        note
----+--------------------
  1 | sáu tháng làm việc
(1 row)</div>
<pre><code>docker restart db &amp;&amp; sleep 5
docker exec db psql -U postgres -c 'select count(*) from important;'   <span class="tok-comment"># sống sót qua restart</span>
docker rm -f db
docker run -d --name db -e POSTGRES_PASSWORD=x postgres:16-alpine &amp;&amp; sleep 6
docker exec db psql -U postgres -c 'select * from important;'</code></pre>
<div class="out"> count
-------
     1
(1 row)

ERROR:  relation "important" does not exist
LINE 1: select * from important;
                      ^</div>
<p>Một cú <strong>RESTART</strong> giữ nguyên mọi thứ — vẫn container đó, vẫn tầng ghi được đó. Một cú <strong>XOÁ RỒI TẠO LẠI</strong> thì chẳng giữ gì, vì cái tầng đi theo container. Và "xoá rồi tạo lại" chính xác là thứ một bản deploy làm, thứ <code>docker compose down</code> làm, và thứ mà đổi bất kỳ cờ nào của <code>docker run</code> cũng ép bạn phải làm. Không có cảnh báo và không có xác nhận nào.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">docker stop / start / restart</span><span class="lz-t">tầng ghi được sống sót</span><span class="lz-d">Vẫn cùng một đối tượng container, vẫn cùng một UpperDir trên đĩa. An toàn.</span></div>
  <div class="lz-step"><span class="lz-k">docker rm · docker compose down</span><span class="lz-t">tầng ghi được bị xoá</span><span class="lz-d">Vĩnh viễn, ngay lập tức, không hỏi han. Đây là cách BÌNH THƯỜNG để đổi cấu hình của một container, nên chuyện đó xảy ra thường xuyên.</span></div>
  <div class="lz-step"><span class="lz-k">Một phiên bản ảnh mới</span><span class="lz-t">nhất thiết là một container mới</span><span class="lz-d">Mọi bản deploy đều huỷ tầng ghi được. Bất cứ thứ gì phải sống lâu hơn một bản deploy đều không thể nằm ở đó — tức là mọi cơ sở dữ liệu, mọi thư mục tải lên, mọi bộ đệm bạn quan tâm.</span></div>
  <div class="lz-step"><span class="lz-k">Cách chữa, gói trong một từ</span><span class="lz-t">volume (Chương 7)</span><span class="lz-d"><code>-v pgdata:/var/lib/postgresql/data</code> đưa đường dẫn đó ra HOÀN TOÀN ngoài vòng đời của container. Container lại trở thành thứ vứt-đi-được — vốn dĩ luôn là điểm mấu chốt.</span></div>
</div>

<h3>Nhìn kỹ hơn: dữ liệu Postgres thật ra nằm ở đâu?</h3>
${slide('dk-01', 22, 'Postgres “mất dữ liệu” vì được gắn một volume vô danh mới')}
<p>Kết quả ở trên là thật — bảng biến mất sau khi <code>rm</code> rồi tạo lại. Nhưng với RIÊNG ảnh này, cơ chế khác với điều vừa mô tả, và sự khác biệt đó là tin tốt. Hỏi Docker xem container thật sự đã ghi gì, và đang gắn gì (máy Mac của khoá, Docker Desktop 4.91):</p>
<pre><code class="language-bash">docker diff db
docker inspect db --format '{{range .Mounts}}{{.Type}} {{.Name}} -&gt; {{.Destination}}{{end}}'</code></pre>
<div class="out">C /run
C /run/postgresql
A /run/postgresql/.s.PGSQL.5432
A /run/postgresql/.s.PGSQL.5432.lock
volume c979f0bdbde303e3d40a11083637c05d06a2dbd7f61d44f8066139572e0030e7 -&gt; /var/lib/postgresql/data</div>
<p>Tầng ghi chỉ chứa hai file socket. Cơ sở dữ liệu nằm trong một <strong>VOLUME</strong> có tên ngẫu nhiên 64 ký tự, vì ảnh postgres khai <code>VOLUME /var/lib/postgresql/data</code> và Docker tự tạo một <em>volume vô danh</em> (anonymous volume) cho nó. <code>docker rm -f db</code> (không có <code>-v</code>) xoá container nhưng BỎ LẠI volume đó. Container mới được cấp một volume vô danh <em>MỚI</em> — ở đây là <code>35dbac4a50ad…</code> — với một CSDL rỗng. Dữ liệu chưa hề bị xoá; nó bị bỏ rơi. Nên cứu được:</p>
<pre><code class="language-bash">docker run -d --name db-cuu -e POSTGRES_PASSWORD=x \\
  -v c979f0bdbde303e3d40a11083637c05d06a2dbd7f61d44f8066139572e0030e7:/var/lib/postgresql/data \\
  postgres:16-alpine
docker exec db-cuu psql -U postgres -c 'select * from important;'
docker logs db-cuu 2&gt;&amp;1 | grep -i skipping</code></pre>
<div class="out"> id |        note
----+--------------------
  1 | sáu tháng làm việc
(1 row)

PostgreSQL Database directory appears to contain a database; Skipping initialization</div>
<p>Hai bài học rơi ra. Một, trước khi hoảng lên vì Postgres "mất dữ liệu", hãy chạy <code>docker volume ls -f dangling=true</code> — dữ liệu có thể đang nằm ngay đó. Hai, với ảnh KHÔNG có dòng <code>VOLUME</code> thì mọi thứ đúng là nằm trong tầng ghi và đúng là mất thật. Nhìn trường hợp thuần đó với một file bất kỳ:</p>
<pre><code class="language-bash">docker run -d --name ghi alpine sleep 600
docker exec ghi sh -c 'mkdir /data &amp;&amp; echo "don hang 42" &gt; /data/note.txt'
docker diff ghi
docker restart ghi &amp;&amp; docker exec ghi cat /data/note.txt
docker rm -f ghi
docker run --rm alpine cat /data/note.txt</code></pre>
<div class="out">A /data
A /data/note.txt
ghi
don hang 42
ghi
cat: can't open '/data/note.txt': No such file or directory</div>
<p><code>A</code> = thêm vào tầng ghi; nó sống qua <code>restart</code>; nó mất cùng <code>rm</code>, và container mới từ cùng ảnh bắt đầu sạch trơn. Đó là slide 21.</p>

<h3>Ba đường dữ liệu ra khỏi tầng ghi được</h3>
${slide('dk-01', 23, 'Ba đường đưa dữ liệu ra khỏi tầng ghi')}
<div class="kv-grid">
  <div class="kv"><span class="k">Volume có tên — <code>-v pgdata:/var/lib/postgresql/data</code></span><span class="v">Kho lưu do Docker quản lý dưới <code>/var/lib/docker/volumes/</code>, có vòng đời riêng. Sống sót qua <code>docker rm</code>, sống sót qua <code>compose down</code> (trừ khi bạn truyền <code>-v</code>), và là câu trả lời đúng cho cơ sở dữ liệu. Chương 7.</span></div>
  <div class="kv"><span class="k">Bind mount — <code>-v "\$PWD/src:/app/src"</code></span><span class="v">Một đường dẫn trên máy chủ hiện ra bên trong container. Hoàn hảo cho mã nguồn lúc phát triển, và cho file cấu hình. Kèm theo một bài toán quyền sở hữu file trên Linux mà Chương 7 giải quyết tử tế.</span></div>
  <div class="kv"><span class="k">tmpfs — <code>--tmpfs /tmp</code></span><span class="v">Nằm trong bộ nhớ, không bao giờ chạm đĩa, mất khi dừng. Đúng cho chỗ nháp và cho bất cứ thứ gì nhạy cảm mà bạn hoàn toàn không muốn ghi xuống một tầng đĩa.</span></div>
  <div class="kv"><span class="k">Không gì cả — mặc định</span><span class="v">Mọi thứ nằm trong tầng ghi được. ĐÚNG với một web server hay một API không trạng thái: nó không nên giữ trạng thái nào đáng giữ, và nếu có thì đó chính là con bọ thiết kế mà container vừa phơi bày ra.</span></div>
</div>
<div class="callout ok"><strong>Ảnh chính thức nói cho bạn biết đường dẫn nào cần volume.</strong> Chạy <code>docker image inspect postgres:16-alpine --format '{{json .Config.Volumes}}'</code> là bạn có <code>{"/var/lib/postgresql/data":{}}</code>. Lời khai đó là tác giả ảnh đang nói "đây là đường dẫn có trạng thái". Docker thậm chí tự tạo một volume vô danh cho nó — và điều đó còn tệ hơn vô ích, vì volume thì sống sót nhưng chẳng có gì nhớ cái tên ngẫu nhiên của nó, nên nó thành phần đĩa mồ côi. Hãy LUÔN tự đặt tên cho nó.</div>
<p>Cờ <code>-v</code> quyết định bạn nhận loại nào dựa vào HÌNH DẠNG của thứ bên trái dấu hai chấm — rất dễ nhầm, nên đọc chậm một lần:</p>
<table>
<tr><th>Bạn viết</th><th>Bạn nhận được</th><th>Ghi chú</th></tr>
<tr><td><code>-v pgdata:/var/lib/postgresql/data</code></td><td>Volume có tên</td><td>Bên trái không có gạch chéo = tên volume. Chưa có thì tự tạo.</td></tr>
<tr><td><code>-v "\$PWD/src":/app/src</code></td><td>Bind mount (gắn thư mục máy chủ)</td><td>Bắt đầu bằng <code>/</code> (hoặc <code>./</code>, <code>~</code>) = đường dẫn trên máy. Nhớ đặt trong nháy: đường dẫn có dấu cách sẽ vỡ.</td></tr>
<tr><td><code>-v /var/lib/postgresql/data</code></td><td>Volume vô danh</td><td>Chỉ có đường dẫn trong container = tên ngẫu nhiên. Đây chính là thứ <code>VOLUME</code> lặng lẽ làm.</td></tr>
<tr><td><code>…:/app/config:ro</code></td><td>Chỉ đọc</td><td>Container không ghi vào đó được — hợp với file cấu hình.</td></tr>
<tr><td><code>--mount type=volume,src=pgdata,dst=/var/lib/postgresql/data</code></td><td>Volume có tên, viết dài</td><td>Cùng một thứ nhưng viết rõ từng phần; sai thì báo lỗi chứ không đoán. Chương 7 ưu tiên cách này.</td></tr>
<tr><td><code>--tmpfs /tmp</code></td><td>tmpfs</td><td>Chỉ nằm trong RAM, mất khi dừng.</td></tr>
</table>
<div class="callout">Mac và Windows: bind mount phải đi xuyên từ laptop vào máy ảo của Docker Desktop (VirtioFS trên Mac, hệ file WSL2 trên Windows), nên chậm hơn volume. Bạn cùng nhóm dùng Windows nên để dự án <em>bên trong</em> WSL2 (<code>~/du-an</code>, không phải <code>/mnt/c/…</code>) — Chương 13 đo khác biệt đó.</div>

<h3>Lấy dữ liệu ra — docker cp</h3>
${slide('dk-01', 24, 'docker cp cứu file từ container đã dừng — commit thì đừng')}
<pre><code><span class="tok-comment"># Ra khỏi một container — chạy được cả với container ĐÃ DỪNG</span>
docker exec db pg_dump -U postgres postgres &gt; /tmp/dump.sql
docker cp db:/var/lib/postgresql/data/postgresql.conf ./pg.conf

<span class="tok-comment"># Vào một container</span>
docker cp ./seed.sql db:/tmp/seed.sql
docker exec db psql -U postgres -f /tmp/seed.sql

ls -lh pg.conf</code></pre>
<div class="out">-rw-r--r-- 1 deploy deploy 30K Aug 22 21:14 pg.conf</div>
<p><code>docker cp</code> chạy được với một container đã dừng vì nó đọc thẳng tầng ghi được từ đĩa chứ không đi qua tiến trình đang chạy. Điều đó khiến nó thành CÔNG CỤ CỨU HỘ: khi một container quay vòng sập và bạn cần đúng cái file nó vừa ghi ra trước khi chết, <code>docker cp</code> lấy được còn <code>docker exec</code> thì không.</p>
<div class="callout warn"><strong><code>docker cp</code> KHÔNG phải một cơ chế triển khai.</strong> Chép một file cố định vào một container đang chạy tạo ra một cái máy có trạng thái không tồn tại ở bất cứ đâu trong quản lý phiên bản, không tái lập được, và biến mất ở lần deploy kế tiếp. Nó là một công cụ gỡ lỗi và cứu hộ. Nếu bạn thấy mình làm điều đó tới lần thứ hai cho cùng một file thì cái file đó thuộc về IMAGE hoặc về một volume được gắn vào.</div>

<h3>docker commit, và vì sao đừng dựng ảnh theo kiểu đó</h3>
<pre><code>docker run -d --name tinker alpine sleep 600
docker exec tinker apk add --no-cache curl jq
docker commit -m 'đã thêm curl và jq' tinker my-tools:v1
docker images my-tools
docker history my-tools:v1 | head -3</code></pre>
<div class="out">IMAGE         ID             DISK USAGE   CONTENT SIZE   EXTRA
my-tools:v1   afa79e82afba         23MB         7.03MB
IMAGE          CREATED                  CREATED BY                                      SIZE      COMMENT
afa79e82afba   Less than a second ago   sleep 600                                       6.68MB    đã thêm curl và jq
28bd5fe8b56d   3 months ago             CMD ["/bin/sh"]                                 0B        buildkit.dockerfile.v0</div>
<p class="note-ct">Output Docker 29 (máy Mac của khoá, kho ảnh containerd): <code>docker images</code> có cột mới, và <code>CREATED BY</code> ghi đúng câu lệnh của container như lúc được đưa vào — <code>sleep 600</code>, không phải <code>/bin/sh -c sleep 600</code> như bản cũ của bài in ra. Dù thế nào nó cũng là lệnh của container, không bao giờ là cái <code>apk add</code> bạn thật sự đã chạy. Ảnh commit ra còn THỪA HƯỞNG luôn lệnh đó: <code>docker image inspect my-tools:v1 --format '{{json .Config.Cmd}}'</code> in ra <code>["sleep","600"]</code>.</p>
<p>Nó chạy được, và nó là một cái bẫy. Cột <code>CREATED BY</code> của tầng mới ghi <code>sleep 600</code> — câu lệnh của container, không phải thứ bạn thật sự đã làm. Sáu tháng sau không ai, kể cả bạn, nói được trong cái ảnh này có gì hay tái lập lại được nó. Hãy so với một Dockerfile ba dòng nằm trong git, review được, dựng lại được trên máy nào cũng vậy, và tự động dựng lại khi ảnh nền có bản vá an ninh.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Dùng chính đáng — một ảnh chụp để khám nghiệm</span><span class="v">Một container đang trở chứng trên production và bạn cần đúng trạng thái của nó để phân tích. <code>docker commit</code> đóng băng nó lại, và sau đó bạn mở được một shell trong ảnh chụp mà không quấy rầy bản gốc.</span></div>
  <div class="kv"><span class="k">Dùng chính đáng — giữ lại một bản vá gấp</span><span class="v">Bạn vá nóng một container lúc 3 giờ sáng để chấm dứt sự cố. Hãy commit nó lại để bản vá không bị mất, rồi sáng hôm sau viết Dockerfile cho tử tế. Cái commit là một tờ biên nhận, không phải sản phẩm.</span></div>
  <div class="kv"><span class="k">Không chính đáng — dựng ảnh</span><span class="v">Không có nguồn sự thật, không review mã, không tái lập được, không tự dựng lại được, không có cách nào trả lời "vì sao gói này lại ở đây?". Mọi lý lẽ ủng hộ Dockerfile đều là lý lẽ chống lại cách này.</span></div>
  <div class="kv"><span class="k">Không chính đáng — "Dockerfile dựng chậm quá"</span><span class="v">Dựng chậm là một vấn đề về cache và nó có cách chữa đã biết (Chương 5). Đánh đổi khả năng tái lập lấy thời gian dựng là một cuộc đổi chác tồi, và nó tồi thêm mỗi tháng.</span></div>
</div>

<h3>save khác export</h3>
${slide('dk-01', 25, 'save giữ nguyên ảnh — export ép phẳng container')}
<pre><code>docker save my-tools:v1 -o tools-image.tar        <span class="tok-comment"># một IMAGE: mọi tầng + siêu dữ liệu</span>
docker export tinker  -o tinker-fs.tar           <span class="tok-comment"># một CONTAINER: một hệ thống file phẳng</span>
ls -lh tools-image.tar tinker-fs.tar
tar -tf tools-image.tar | head -4
tar -tf tinker-fs.tar | head -4</code></pre>
<div class="out">-rw------- 1 deploy deploy  13M Aug 22 21:20 tools-image.tar
-rw------- 1 deploy deploy  13M Aug 22 21:20 tinker-fs.tar
blobs/
blobs/sha256/
blobs/sha256/1b3ee35aacca9866b01dd96e870136266cf190d7a34bcc9a1d5bdb9e2f5c48d1
index.json
bin/
dev/
etc/
etc/alpine-release</div>
<div class="kv-grid">
  <div class="kv"><span class="k">docker save / docker load</span><span class="v">Đi và về trọn vẹn một <strong>IMAGE</strong> với mọi tầng, tag và cấu hình còn nguyên. Đây là cách đúng để chuyển một ảnh giữa hai máy mà không cần registry — <code>docker save app:v2 | ssh vps 'docker load'</code>. Cũng là cách bạn soi từng tầng bằng tay, gồm cả việc tìm ra một bí mật mà ai đó tưởng đã xoá (Bài 1.2).</span></div>
  <div class="kv"><span class="k">docker export / docker import</span><span class="v">Ép phẳng hệ thống file của một <strong>CONTAINER</strong> thành một file tar. Mất lịch sử, mất tầng, mất <code>CMD</code>, mất <code>ENV</code> — mất mọi thứ trong cấu hình. Hữu ích để trích xuất file hoặc để CỐ Ý ép phẳng một cái ảnh; không phải một bản sao lưu, vì kết quả import về sẽ không tự khởi động được nếu bạn không chỉ lại câu lệnh.</span></div>
</div>
<p>Trên Docker 29 dùng kho ảnh containerd thì hai file KHÔNG còn bằng nhau. Máy Mac của khoá, cùng các lệnh đó:</p>
<div class="out">6.7M tools-image.tar
15M tinker-fs.tar
blobs/
blobs/sha256/
blobs/sha256/5de55e5ef9c033997441461efe7ba23a986db059c0bb78b38f84ee0d72b99167
blobs/sha256/69ef631d8294a67fa456087311136ab01d4fad2c85a66264a7f65c82e5a96019
.dockerenv
bin/
bin/arch
bin/ash</div>
<p><code>docker save</code> giờ ghi các tầng đúng như lúc tải về — nén gzip — nên ảnh chỉ 6,7M; <code>docker export</code> ghi mọi file ở dạng không nén, 15M. Output phía trên là từ kho <code>overlay2</code> cổ điển, nơi hai file tình cờ cùng 13M.</p>
<table>
<tr><th>Công cụ</th><th>Dùng để</th><th>ĐỪNG dùng để</th></tr>
<tr><td><code>docker cp</code></td><td>Lấy một file log hay file dump ra khỏi container, kể cả container đã chết; đưa một file thử vào</td><td>Sửa một container production đang chạy "chỉ lần này thôi"</td></tr>
<tr><td><code>docker commit</code></td><td>Chụp hiện trường một container hỏng; giữ bản vá lúc 3 giờ sáng cho tới khi viết Dockerfile</td><td>Dựng ảnh để đem đi</td></tr>
<tr><td><code>docker save</code> / <code>load</code></td><td>Chuyển ảnh sang máy không có registry: <code>docker save app:v2 | ssh vps docker load</code></td><td>Sao lưu dữ liệu (volume không nằm trong đó)</td></tr>
<tr><td><code>docker export</code> / <code>import</code></td><td>Rút toàn bộ file của một container thành một tar; cố ý ép phẳng</td><td>Chuyển ảnh (mất CMD, ENV và lịch sử)</td></tr>
</table>
<pre><code>docker rm -f tinker db; docker rmi my-tools:v1; rm -f tools-image.tar tinker-fs.tar</code></pre>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm bạn chạy Postgres bằng một lệnh <code>docker run</code> trơn, không có <code>-v</code>. Một bạn gõ <code>docker rm -f thu-db</code> "cho nó khởi động lại sạch sẽ" và bảng <code>users</code> biến mất. Lấy lại nó, rồi bảo đảm chuyện đó không lặp lại.</p><ol>
<li>Dựng hiện trường: chạy <code>thu-db</code>, tạo và điền một bảng, rồi <strong>ghi lại tên volume của nó</strong> (khối lệnh bên dưới).</li>
<li>Gây hoạ: <code>docker rm -f thu-db</code>, chạy lại <code>thu-db</code> y như cũ, và xác nhận <code>select * from users;</code> báo lỗi.</li>
<li>Tìm đứa mồ côi: <code>docker volume ls -f dangling=true</code> — tên cũ của bạn phải nằm trong danh sách.</li>
<li>Cứu: <code>docker rm -f -v thu-db</code> (<code>-v</code> xoá luôn cái volume vô danh MỚI, rỗng), rồi chạy lại với <code>-v \$V:/var/lib/postgresql/data</code> và select lần nữa.</li>
<li>Dọn dẹp: <code>docker rm -f thu-db</code> và <code>docker volume rm \$V</code>. Từ nay chạy CSDL với một volume do <em>chính bạn</em> đặt tên, vd <code>-v thu-pgdata:/var/lib/postgresql/data</code>.</li></ol>
<pre><code class="language-bash">docker run -d --name thu-db -e POSTGRES_PASSWORD=x postgres:16-alpine
sleep 6
docker exec thu-db psql -U postgres -c "create table users(id int, name text); insert into users values (1,'Cuong');"
V=\$(docker inspect thu-db --format '{{range .Mounts}}{{.Name}}{{end}}'); echo \$V</code></pre>
<p><strong>Đạt khi:</strong> sau bước 4 <code>select * from users;</code> lại hiện <code>Cuong</code>, bạn giải thích được vì sao <code>rm</code> không xoá dữ liệu mà container mới vẫn khởi động với CSDL rỗng, và <code>docker volume ls -f dangling=true</code> không còn thứ gì của bạn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Writable layer (tầng ghi được)</span><span class="v">Tầng trên cùng của riêng container (upperdir). Sống qua stop/restart, bị <code>rm</code> xoá.</span></div>
  <div class="kv"><span class="k">Volume (ổ dữ liệu)</span><span class="v">Kho lưu do Docker quản lý, có vòng đời riêng, được gắn vào container; chỗ dành cho CSDL.</span></div>
  <div class="kv"><span class="k">Anonymous volume (volume vô danh)</span><span class="v">Volume có tên ngẫu nhiên, sinh ra từ dòng <code>VOLUME</code> trong ảnh hoặc <code>-v /đường-dẫn</code>. Sống qua <code>rm</code> nhưng chẳng ai nhớ tới nó.</span></div>
  <div class="kv"><span class="k">Bind mount (gắn thư mục máy chủ)</span><span class="v">Một thư mục trên máy hiện ra bên trong container, vd mã nguồn khi đang phát triển.</span></div>
  <div class="kv"><span class="k">tmpfs (ổ trong RAM)</span><span class="v">Điểm gắn chỉ nằm trong bộ nhớ; không có gì chạm tới đĩa.</span></div>
  <div class="kv"><span class="k">docker cp (sao chép file)</span><span class="v">Chép file giữa máy chủ và container; chạy được cả với container đã dừng — công cụ cứu hộ.</span></div>
  <div class="kv"><span class="k">docker commit (chụp container thành ảnh)</span><span class="v">Biến một container thành một ảnh. Ổn để làm bằng chứng, sai để dựng ảnh.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mỗi container có một tầng ghi: <code>stop</code>/<code>restart</code> giữ nó, <code>rm</code> huỷ nó — và mỗi lần deploy là một lần <code>rm</code>.</li>
<li>Ảnh có dòng <code>VOLUME</code> (postgres, mysql…) ghi dữ liệu vào volume vô danh; sau <code>rm</code> dữ liệu bị bỏ rơi chứ không bị xoá.</li>
<li>Luôn đặt tên volume: <code>-v pgdata:/var/lib/postgresql/data</code>; hình dạng bên trái dấu hai chấm quyết định volume hay bind mount.</li>
<li><code>docker cp</code> chạy được với container đã chết — dùng để lấy bằng chứng ra, không bao giờ để sửa production.</li>
<li><code>docker commit</code> ghi lại lệnh của container chứ không ghi việc bạn đã làm: chỉ dùng làm bằng chứng.</li>
<li><code>save</code> chuyển nguyên một ảnh với mọi tầng; <code>export</code> ép phẳng file của container và mất CMD/ENV.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/storage/" target="_blank" rel="noopener">
  <span class="lc-ico">💾</span>
  <span class="lc-body"><span class="lc-title">Tổng quan lưu trữ của Docker</span><span class="lc-sub">Volume, bind mount và tmpfs đặt cạnh nhau, kèm sơ đồ chỗ mỗi cái nằm so với container. Cách trình bày chính thức của những gì Chương 7 nói sâu.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/cli/docker/container/cp/" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">docker cp — tài liệu tra cứu</span><span class="lc-sub">Ngữ nghĩa đường dẫn chính xác (luật dấu gạch chéo cuối cắn ai cũng đúng một lần), và ghi chú rằng nó chạy được với container đã dừng — chính điều đó khiến nó thành công cụ cứu hộ.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: làm mất dữ liệu, rồi cứu nó về</span><span class="lc-sub">Bài chấm điểm: phá một cơ sở dữ liệu đúng theo cách một bản deploy sẽ làm, cứu một file ra khỏi một container đang quay vòng sập bằng <code>docker cp</code>, và giải thích <code>docker commit</code> đã đánh mất thứ gì mà Dockerfile giữ được.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> một volume VÔ DANH lặng lẽ ngốn đĩa. Chạy <code>postgres</code> mà không có <code>-v</code> thì Docker tôn trọng lời khai <code>VOLUME</code> của ảnh bằng cách tạo một volume có tên ngẫu nhiên 64 ký tự. Rốt cuộc dữ liệu của bạn CÓ sống sót qua <code>docker rm</code> — nhưng container kế tiếp lại được cấp một volume ngẫu nhiên MỚI và một cơ sở dữ liệu rỗng, nên trông như dữ liệu đã mất, trong khi cái volume cũ nằm đó mãi mãi ôm hàng gigabyte. Hãy kiểm bằng <code>docker volume ls -f dangling=true</code> và thu hồi bằng <code>docker volume prune</code>. Luôn đặt tên cho volume của bạn; khi đó bạn tìm được chúng, sao lưu được chúng, và gắn lại chúng một cách có chủ ý.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> <code>stop</code>/<code>start</code> giữ tầng ghi được còn <code>rm</code> huỷ nó — và vì mọi thay đổi cấu hình lẫn mọi bản deploy đều đồng nghĩa với <code>rm</code>, bất cứ thứ gì phải sống sót đều cần một volume. <code>docker cp</code> chạy được với container đã dừng, và điều đó khiến nó thành công cụ để lấy bằng chứng ra khỏi một thứ đã chết. Và <code>docker commit</code> đẻ ra một cái ảnh không ai tái lập hay giải thích nổi: ổn khi làm ảnh chụp khám nghiệm, không bao giờ ổn khi làm cách để dựng.</p>
</div>
`,
    },
    /* ─────────────────────────── 1.5 ─────────────────────────── */
    {
      title: '1.5 — Who actually runs the container|||1.5 — Ai thật sự chạy cái container',
      slug: 'dk-1-5-ngan-xep-runtime',
      type: 'LESSON',
      description: 'CLI → dockerd → containerd → shim → runc, nhìn thấy bằng ps; vì sao có cái shim; ba đặc tả OCI; các runtime thay thế như gVisor; và vì sao Kubernetes bỏ dockershim mà ảnh của bạn vẫn chạy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.5</span>
<h2>Who actually runs the container</h2>
<p class="lead">"Docker" is not one program. It is a stack of four, each doing one job, connected by standard interfaces. Knowing the stack answers questions that are otherwise mysterious: why restarting the Docker daemon can or cannot kill your containers, why Kubernetes removed Docker and your images kept working, and how a single flag can swap the thing that executes your process for something with a stronger boundary.</p>

<h3>The stack, top to bottom</h3>
${slide('dk-01', 26, 'Docker là bốn chương trình xếp chồng')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">docker (the CLI)</span><span class="lz-lnote">Turns your command line into an HTTP request against the Engine API and formats the reply. It contains no container logic at all — which is why <code>DOCKER_HOST=ssh://vps-1 docker ps</code> lists containers on another machine with no extra software.</span></div>
  <div class="lz-layer"><span class="lz-lname">dockerd (the daemon)</span><span class="lz-lnote">The high-level features: image building, the network drivers, volumes, the API, and translating "run this image with these flags" into instructions for the layer below. This is what <code>systemctl status docker</code> reports on.</span></div>
  <div class="lz-layer"><span class="lz-lname">containerd</span><span class="lz-lnote">The container supervisor: pulls images, manages snapshots, and owns the lifecycle of every running container. It is a separate project with its own API, and it is what Kubernetes talks to directly on most clusters today.</span></div>
  <div class="lz-layer"><span class="lz-lname">containerd-shim-runc-v2</span><span class="lz-lnote">One tiny process per container, sitting between containerd and your process. It holds the container's stdio and reports the exit code — and because it is separate, containerd and dockerd can both restart without killing anything.</span></div>
  <div class="lz-layer"><span class="lz-lname">runc</span><span class="lz-lnote">The thing that actually creates the container: sets up namespaces and cgroups (Lesson 1.1), applies the seccomp and capability configuration, pivots to the new root, and <code>exec</code>s your binary. It runs for milliseconds and then it is gone — <code>runc</code> is not in the process list of a running container.</span></div>
</div>
<pre><code>docker run -d --name w nginx:1.27-alpine
ps -ef | grep -E 'dockerd|containerd|nginx: master' | grep -v grep | cut -c1-110</code></pre>
<div class="out">root        1069       1  0 Sep22 ?        00:03:02 /usr/bin/containerd
root        1673       1  0 Sep22 ?        00:08:24 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/con
root        2498       1  0 Sep22 ?        00:00:03 /usr/bin/containerd-shim-runc-v2 -namespace moby -id 5e1b1
root        2499       1  0 Sep22 ?        00:00:36 /usr/bin/containerd-shim-runc-v2 -namespace moby -id d57ec
root        2515       1  0 Sep22 ?        00:00:03 /usr/bin/containerd-shim-runc-v2 -namespace moby -id 8c719
root        2578    2498  0 Sep22 ?        00:00:00 nginx: master process nginx -g daemon off;
root      367950       1  0 20:15 ?        00:00:00 /usr/bin/containerd-shim-runc-v2 -namespace moby -id 42d18
root      367975  367950  0 20:15 ?        00:00:00 nginx: master process nginx -g daemon off;</div>
<p>Real output from the course's Linux machine (Fedora, Docker 29.6), which was running two other containers of its own — hence four shims and two nginx masters. Read the parent column, the third one (PPID). Our nginx is <strong>367975</strong>, and its parent is the <strong>shim</strong> <strong>367950</strong>. The shim's own parent is <strong>1</strong> — systemd — not containerd: containerd launches the shim, and the shim immediately detaches itself so that it is adopted by PID 1, exactly so that containerd can be stopped or upgraded without dragging the container down with it. Every running container has one shim (<code>2498</code> is the parent of the other nginx, <code>2578</code>). Notice what is <em>not</em> there: <code>dockerd</code> is not an ancestor of nginx, and <code>runc</code> has already exited. Your container's process is a child of a small shim, and nothing else. (An earlier version of this lesson showed containerd as the shim's parent; a real machine does not — checked on Docker 29.6 and inside Docker Desktop's VM.)</p>

<h3>Run it step by step: read the tree yourself, then talk to dockerd without the CLI</h3>
${slide('dk-01', 27, 'Cha của nginx là shim — cha của shim là systemd')}
<p><strong>On Linux</strong> start from the container and walk up: its PID, then its parent, then the parent's parent.</p>
<pre><code class="language-bash">P=\$(docker inspect -f '{{.State.Pid}}' web)
ps -o pid,ppid,args -p \$P                      <span class="tok-comment"># the app — PPID is the shim</span>
ps -o pid,ppid,args -p \$(ps -o ppid= -p \$P)     <span class="tok-comment"># the shim — PPID is 1</span></code></pre>
<p><strong>On a Mac</strong> the tree lives inside Docker Desktop's VM, and the <code>--pid=host</code> helper from Lesson 1.1 shows it. The course's Mac, with one nginx running:</p>
<pre><code class="language-bash">docker run --rm --pid=host alpine ps -o pid,ppid,args | grep -E 'containerd|dockerd|nginx: master'</code></pre>
<div class="out">  264   143 /usr/bin/containerd --config /etc/containerd/containerd.toml
  286   143 /usr/local/bin/dockerd --config-file /run/config/docker/daemon.json
  667     1 /usr/bin/containerd-shim-runc-v2 -namespace moby -id 224d827284904a15254a20cebae96d0f9c7dfdbaa0fd930f333277d…
16924     1 /usr/bin/containerd-shim-runc-v2 -namespace moby -id fd08f99d1c111f82c804c7daf2da66f5b5faaf4d17c72fd6653c11d…
16947 16924 nginx: master process nginx -g daemon off;
17002     1 /usr/bin/containerd-shim-runc-v2 -namespace moby -id eaf81e7ff141a8d80ef6ac624ebaae0639b31d56b0d96f9867a4129…</div>
<p>Same shape: shims with parent 1, nginx under its shim. (Lines trimmed; the last shim belongs to the helper container itself.) The versions of each layer are one command away — on the course's Mac:</p>
<pre><code class="language-bash">docker version --format '{{range .Server.Components}}{{.Name}}={{.Version}} {{end}}'</code></pre>
<div class="out">Engine=29.8.0 containerd=v2.3.4 runc=1.4.3 docker-init=0.19.0</div>
<p>Now the top of the stack. The CLI does nothing but send HTTP requests to dockerd over a Unix socket, so you can skip it. On the Linux machine (your user must be in the <code>docker</code> group):</p>
<pre><code class="language-bash">ls -l /var/run/docker.sock
curl -s --unix-socket /var/run/docker.sock http://localhost/containers/json | head -c 120</code></pre>
<div class="out">srw-rw----. 1 root docker 0 Sep 22 22:53 /var/run/docker.sock
[{"Id":"f85e9fedbcab02a618a9552e7cd0729cb28b1d04379d1dfc289476f443f982c2","Names":["/dk01-web"],"Image":"nginx:1.27-alpi</div>
<p>That JSON is exactly what <code>docker ps</code> formats into a table. On a Mac the socket lives elsewhere — <code>docker context ls</code> tells you where:</p>
<div class="out">NAME              DESCRIPTION                               DOCKER ENDPOINT                               ERROR
default           Current DOCKER_HOST based configuration   unix:///var/run/docker.sock
desktop-linux *   Docker Desktop                            unix:///Users/admin/.docker/run/docker.sock</div>
<p>and <code>curl -s --unix-socket ~/.docker/run/docker.sock http://localhost/version</code> returned <code>{"Platform":{"Name":"Docker Desktop 4.91.0 (239619)"},"Version":"29.8.0","ApiVersion":"1.56",…</code>. Because it is only an API, the CLI on your Mac can drive another machine's daemon over SSH, with nothing installed there but Docker (<code>linux-nha</code> is the SSH name of the course's Linux machine):</p>
<pre><code class="language-bash">DOCKER_HOST=ssh://linux-nha docker ps --format '{{.Names}} {{.Status}}'</code></pre>
<div class="out">dk01-n1 Up 6 minutes</div>
<div class="callout danger"><strong>Look again at <code>srw-rw---- root docker</code>.</strong> Anyone who can write to that socket can ask dockerd — running as root — to start a container with <code>-v /:/host --privileged</code>. Being in the <code>docker</code> group is effectively being root on that machine. Add only people you would give <code>sudo</code> to, and never mount <code>docker.sock</code> into a container you do not fully trust.</div>

<h3>Why the shim exists</h3>
${slide('dk-01', 28, 'live-restore: container sống qua lần khởi động lại dockerd')}
<pre><code>docker info --format '{{.LiveRestoreEnabled}}'
sudo systemctl restart docker
sleep 3
docker ps --format '{{.Names}} {{.Status}}'</code></pre>
<div class="out">false
web Up 4 seconds</div>
<div class="callout warn"><strong>Read that output carefully.</strong> <code>Up 4 seconds</code> after a daemon restart only happens to containers that have a restart policy (<code>--restart always</code> or <code>unless-stopped</code>) — this output came from such a container named <code>web</code>. The <code>w</code> started above with a bare <code>docker run -d</code> would instead show <code>Exited</code> and stay down, which is the pitfall at the end of this lesson. (For this upgrade we did not restart the daemon on a real machine to re-record it; the behaviour described is the documented one.)</div>
<p>With the default settings, restarting the daemon stopped and restarted the container — note the <code>Up 4 seconds</code> on a container that had been running for minutes. The shim makes the alternative possible: because your process's parent is the shim and not the daemon, the daemon can go away and come back without the container noticing. Turning that on is one setting:</p>
<pre><code><span class="tok-comment"># /etc/docker/daemon.json</span>
{
  "live-restore": true,
  "log-driver": "json-file",
  "log-opts": { "max-size": "10m", "max-file": "3" }
}</code></pre>
<pre><code>sudo systemctl reload docker      <span class="tok-comment"># reload, not restart</span>
docker info --format '{{.LiveRestoreEnabled}}'</code></pre>
<div class="out">true</div>
<div class="callout ok"><strong><code>live-restore: true</code> belongs on every production host</strong>, alongside the log rotation settings in the same file (Chapter 11 explains those). It means a Docker upgrade, or a daemon crash, is not an outage for everything running on the machine. The trade-offs are small and specific: it does not work with Swarm mode, and containers cannot be reconfigured while the daemon is down.</div>

<h3>What "OCI" means, and why it matters to you</h3>
${slide('dk-01', 29, 'OCI: ảnh theo chuẩn mở, runtime thay được')}
<div class="kv-grid">
  <div class="kv"><span class="k">image-spec</span><span class="v">The format of an image: the manifest, the config JSON, the layer digests (Lesson 1.2). Because this is a standard, an image you build with <code>docker build</code> runs unchanged under Podman, containerd, CRI-O and every cloud's container service.</span></div>
  <div class="kv"><span class="k">runtime-spec</span><span class="v">What a runtime must do given a root filesystem and a config: which namespaces, which cgroup limits, which capabilities. <code>runc</code> is the reference implementation; anything implementing this spec can be dropped in.</span></div>
  <div class="kv"><span class="k">distribution-spec</span><span class="v">The registry HTTP API: how images are pushed and pulled. This is why Docker Hub, GHCR, ECR, GitLab's registry and a self-hosted <code>registry:2</code> all work with the same <code>docker push</code> (Chapter 3).</span></div>
  <div class="kv"><span class="k">The practical consequence</span><span class="v">Everything you learn in this course about writing images is portable. The <code>docker</code> CLI is one client among several; the artifacts are the standard.</span></div>
</div>
<div class="callout"><strong>This is what actually happened when "Kubernetes deprecated Docker" in 2020.</strong> Kubernetes removed <em>dockershim</em>, the adapter that let it drive dockerd, and started talking to containerd directly — one layer lower in exactly the stack above. Images built with Docker were unaffected, because they are OCI images, not "Docker images". The headlines were alarming and the change was invisible to anyone who was only building and shipping images.</div>

<h3>Swapping the runtime</h3>
<pre><code>docker info --format '{{json .Runtimes}}'
docker run --rm --runtime=runc alpine echo default
<span class="tok-comment"># With gVisor installed, this runs your process against a user-space kernel</span>
<span class="tok-comment"># docker run --rm --runtime=runsc alpine dmesg | head -1</span></code></pre>
<div class="out">{"io.containerd.runc.v2":{"path":"runc"},"runc":{"path":"runc"}}
default</div>
<div class="kv-grid">
  <div class="kv"><span class="k">runc</span><span class="v">The default. Thin, fast, uses the host kernel directly. The right choice for your own workloads.</span></div>
  <div class="kv"><span class="k">crun</span><span class="v">A C rewrite of runc: faster startup and lower memory, fully compatible. Default on some Podman installs.</span></div>
  <div class="kv"><span class="k">gVisor (runsc)</span><span class="v">Intercepts syscalls in a user-space kernel, so a kernel bug is much harder to reach. Costs some syscall performance. The answer when you must run untrusted code (Lesson 1.1's honest caveat).</span></div>
  <div class="kv"><span class="k">Kata Containers</span><span class="v">Runs each container in a lightweight VM with its own kernel. Nearly VM-grade isolation with container-grade ergonomics; used by clouds for multi-tenant container services.</span></div>
</div>

<h3>Going below Docker</h3>
<pre><code><span class="tok-comment"># containerd's own CLI — the same containers, one layer down</span>
sudo ctr --namespace moby containers list | head -3
<span class="tok-comment"># Reading a container's OCI runtime config: everything runc was told</span>
sudo ctr --namespace moby containers info \$(docker inspect -f '{{.Id}}' w) \\
  | head -20</code></pre>
<div class="out">CONTAINER                                                           IMAGE    RUNTIME
8c40e93b1a41d2f3c1bd7b6c2e6f4a9c9b8f2d1e5a3c7d9e0b1f2a3c4d5e6f70    -        io.containerd.runc.v2</div>
<p>Docker registers its containers in a containerd namespace called <code>moby</code>. You will almost never need this, but it is worth seeing once: it makes concrete that Docker is a layer of convenience over a general-purpose runtime, not a monolith. When a container is stuck in a way <code>docker</code> cannot fix, this is the level you drop to.</p>
<pre><code>docker rm -f w</code></pre>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> after <code>apt upgrade</code> on the group's VPS, somebody asks "will upgrading Docker kill our running containers?" Half the group says yes, half says no. Answer with evidence from your own machine — without restarting any daemon.</p><ol>
<li>List the versions of every layer: <code>docker version --format '{{range .Server.Components}}{{.Name}}={{.Version}} {{end}}'</code>.</li>
<li>Find the daemon's socket with <code>docker context ls</code>, then query it directly with <code>curl --unix-socket &lt;path&gt; http://localhost/version</code> (Linux: <code>/var/run/docker.sock</code>; Mac: <code>~/.docker/run/docker.sock</code>).</li>
<li>Start <code>docker run -d --name thu-web nginx:1.27-alpine</code> and walk its process tree: on Linux with <code>ps -o pid,ppid,args</code> from its PID upward; on a Mac with the <code>--pid=host</code> helper.</li>
<li>Read <code>docker info -f '{{.LiveRestoreEnabled}}'</code> and <code>docker inspect -f '{{.HostConfig.RestartPolicy.Name}}' thu-web</code>.</li>
<li>Clean up: <code>docker rm -f thu-web</code>.</li></ol>
<p><strong>Done when:</strong> you can draw the chain CLI → dockerd → containerd → shim → nginx with real PIDs from your machine, point at the line proving the shim's parent is PID 1, and state what a daemon restart would do to <code>thu-web</code> given the two values from step 4 (with <code>false</code> and restart policy <code>no</code>: it stops and stays down).</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Docker CLI</span><span class="v">The <code>docker</code> command: turns what you type into HTTP requests to the Engine API.</span></div>
  <div class="kv"><span class="k">dockerd (daemon)</span><span class="v">The background service holding Docker's features: builds, networks, volumes, the API.</span></div>
  <div class="kv"><span class="k">containerd</span><span class="v">The container supervisor below dockerd: pulls images, manages snapshots and the lifecycle. Kubernetes uses it directly.</span></div>
  <div class="kv"><span class="k">Shim</span><span class="v">One small process per container, parent of your app, adopted by PID 1 so the daemons above can restart.</span></div>
  <div class="kv"><span class="k">runc</span><span class="v">Creates the container (namespaces, cgroups, seccomp) and <code>exec</code>s your program, then exits.</span></div>
  <div class="kv"><span class="k">OCI</span><span class="v">Open Container Initiative: the open standards for images, runtimes and registries.</span></div>
  <div class="kv"><span class="k">live-restore</span><span class="v">A <code>daemon.json</code> setting that keeps containers running while dockerd restarts.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>"Docker" is CLI → dockerd → containerd → one shim per container → runc, each with one job.</li>
<li>The CLI is only an HTTP client of a Unix socket; <code>curl</code> and <code>DOCKER_HOST=ssh://…</code> prove it.</li>
<li>Your app's parent is its shim, and the shim's parent is PID 1 — dockerd is not in the chain, and runc is already gone.</li>
<li>Without <code>live-restore</code>, restarting dockerd stops every container and only those with a restart policy come back.</li>
<li>Write access to <code>docker.sock</code> (the <code>docker</code> group) is root on that machine.</li>
<li>Images are OCI artifacts: they run unchanged under containerd, Podman or Kubernetes, and runc can be swapped for gVisor or Kata.</li>
</ul>

<a class="link-card" href="https://opencontainers.org/" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">Open Container Initiative</span><span class="lc-sub">The three specifications — image, runtime and distribution — and who implements them. The reason "Docker image" and "OCI image" are the same thing in practice.</span></span>
</a>
<a class="link-card" href="https://containerd.io/docs/" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">containerd documentation</span><span class="lc-sub">The supervisor underneath both Docker and most Kubernetes clusters. Worth a skim so the architecture diagram in this lesson stops being abstract.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/daemon/live-restore/" target="_blank" rel="noopener">
  <span class="lc-ico">♻️</span>
  <span class="lc-body"><span class="lc-title">Live restore</span><span class="lc-sub">The official page for keeping containers alive during daemon downtime: how to enable it, what reloads without a restart, and its limits.</span></span>
</a>
<a class="link-card" href="https://kubernetes.io/blog/2022/02/17/dockershim-faq/" target="_blank" rel="noopener">
  <span class="lc-ico">☸️</span>
  <span class="lc-body"><span class="lc-title">Kubernetes — the dockershim removal FAQ</span><span class="lc-sub">The clearest explanation of what was actually deprecated and why your images were never affected. Useful the next time someone tells you Docker is dead.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: trace the stack</span><span class="lc-sub">Graded exercises: find the shim that is the parent of a container's process, explain why <code>runc</code> is absent from <code>ps</code>, and predict what a daemon restart does with and without <code>live-restore</code>.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> <code>sudo systemctl restart docker</code> on a production host without <code>live-restore</code>. It stops every container on the machine and starts back only the ones with a restart policy — so anything you launched with a bare <code>docker run -d</code> stays down, silently, until someone notices. The habits that avoid it: set <code>"live-restore": true</code> in <code>/etc/docker/daemon.json</code>, use <code>systemctl reload docker</code> when you only changed that file (reload re-reads the config without touching containers), and give everything that matters a restart policy (Chapter 11).</div>
<p class="note-ct"><strong>Three things to remember.</strong> Four programs, one job each: the CLI talks to <code>dockerd</code>, which drives <code>containerd</code>, which starts a shim per container, which <code>exec</code>s your process via <code>runc</code>. The shim is why the daemon can restart without killing containers — turn on <code>live-restore</code> and it actually does. And the artifacts are an open standard, so your images outlive your choice of tool: that is why the Kubernetes-dropped-Docker news changed nothing about what you build.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.5</span>
<h2>Ai thật sự chạy cái container</h2>
<p class="lead">"Docker" không phải MỘT chương trình. Nó là một chồng BỐN chương trình, mỗi cái một việc, nối với nhau bằng những giao diện chuẩn. Biết cái chồng đó là trả lời được những câu hỏi mà không có nó thì bí hiểm: vì sao khởi động lại tiến trình nền Docker lúc thì giết container lúc thì không, vì sao Kubernetes bỏ Docker mà ảnh của bạn vẫn chạy, và làm sao một cái cờ duy nhất thay được cái thứ đang thực thi tiến trình của bạn bằng một thứ có ranh giới mạnh hơn.</p>

<h3>Cái chồng, từ trên xuống</h3>
${slide('dk-01', 26, 'Docker là bốn chương trình xếp chồng')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">docker (cái CLI)</span><span class="lz-lnote">Biến dòng lệnh của bạn thành một yêu cầu HTTP tới API của Engine rồi định dạng lại câu trả lời. Nó hoàn toàn KHÔNG chứa logic container nào — đó là lý do <code>DOCKER_HOST=ssh://vps-1 docker ps</code> liệt kê được container trên một cái máy khác mà không cần cài thêm phần mềm nào.</span></div>
  <div class="lz-layer"><span class="lz-lname">dockerd (tiến trình nền)</span><span class="lz-lnote">Các tính năng ở tầng cao: dựng ảnh, các trình điều khiển mạng, volume, cái API, và việc dịch "chạy cái ảnh này với mấy cờ này" thành chỉ thị cho tầng dưới. Đây là thứ mà <code>systemctl status docker</code> báo cáo.</span></div>
  <div class="lz-layer"><span class="lz-lname">containerd</span><span class="lz-lnote">Bộ giám sát container: kéo ảnh, quản lý snapshot, và nắm vòng đời của MỌI container đang chạy. Nó là một dự án riêng có API riêng, và ngày nay nó chính là thứ mà Kubernetes nói chuyện trực tiếp trên hầu hết các cụm.</span></div>
  <div class="lz-layer"><span class="lz-lname">containerd-shim-runc-v2</span><span class="lz-lnote">Một tiến trình tí hon cho MỖI container, ngồi giữa containerd và tiến trình của bạn. Nó giữ stdio của container và báo lại mã thoát — và vì nó tách riêng nên cả containerd lẫn dockerd đều khởi động lại được mà không giết thứ gì.</span></div>
  <div class="lz-layer"><span class="lz-lname">runc</span><span class="lz-lnote">Cái thứ THẬT SỰ tạo ra container: dựng namespace và cgroup (Bài 1.1), áp cấu hình seccomp và capability, xoay sang thư mục gốc mới, rồi <code>exec</code> chương trình của bạn. Nó chạy vài mili giây rồi biến mất — <code>runc</code> KHÔNG có mặt trong danh sách tiến trình của một container đang chạy.</span></div>
</div>
<pre><code>docker run -d --name w nginx:1.27-alpine
ps -ef | grep -E 'dockerd|containerd|nginx: master' | grep -v grep | cut -c1-110</code></pre>
<div class="out">root        1069       1  0 Sep22 ?        00:03:02 /usr/bin/containerd
root        1673       1  0 Sep22 ?        00:08:24 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/con
root        2498       1  0 Sep22 ?        00:00:03 /usr/bin/containerd-shim-runc-v2 -namespace moby -id 5e1b1
root        2499       1  0 Sep22 ?        00:00:36 /usr/bin/containerd-shim-runc-v2 -namespace moby -id d57ec
root        2515       1  0 Sep22 ?        00:00:03 /usr/bin/containerd-shim-runc-v2 -namespace moby -id 8c719
root        2578    2498  0 Sep22 ?        00:00:00 nginx: master process nginx -g daemon off;
root      367950       1  0 20:15 ?        00:00:00 /usr/bin/containerd-shim-runc-v2 -namespace moby -id 42d18
root      367975  367950  0 20:15 ?        00:00:00 nginx: master process nginx -g daemon off;</div>
<p>Output thật trên máy Linux của khoá (Fedora, Docker 29.6), máy này đang chạy thêm hai container khác của chính nó — vì thế có bốn shim và hai nginx master. Hãy đọc cột tiến trình cha, cột thứ ba (PPID). nginx của ta là <strong>367975</strong>, và cha của nó là cái <strong>shim</strong> <strong>367950</strong>. Còn cha của shim là <strong>1</strong> — systemd — chứ KHÔNG phải containerd: containerd khởi chạy shim, rồi shim lập tức tự tách ra để được PID 1 nhận nuôi, chính là để containerd có thể dừng hay nâng cấp mà không kéo container chết theo. Mỗi container đang chạy có đúng một shim (<code>2498</code> là cha của nginx kia, <code>2578</code>). Hãy để ý thứ <em>KHÔNG</em> có mặt: <code>dockerd</code> không phải tổ tiên của nginx, và <code>runc</code> thì đã thoát từ lâu. Tiến trình container của bạn là con của một cái shim nhỏ xíu, và chỉ vậy thôi. (Bản cũ của bài cho thấy containerd là cha của shim; máy thật thì không — đã kiểm trên Docker 29.6 và bên trong máy ảo Docker Desktop.)</p>

<h3>Chạy thử từng bước: tự đọc cây tiến trình, rồi nói chuyện với dockerd không cần CLI</h3>
${slide('dk-01', 27, 'Cha của nginx là shim — cha của shim là systemd')}
<p><strong>Trên Linux</strong>, bắt đầu từ container rồi đi ngược lên: PID của nó, rồi cha nó, rồi cha của cha.</p>
<pre><code class="language-bash">P=\$(docker inspect -f '{{.State.Pid}}' web)
ps -o pid,ppid,args -p \$P                      <span class="tok-comment"># ứng dụng — PPID là shim</span>
ps -o pid,ppid,args -p \$(ps -o ppid= -p \$P)     <span class="tok-comment"># shim — PPID là 1</span></code></pre>
<p><strong>Trên Mac</strong>, cái cây nằm bên trong máy ảo Docker Desktop, và container phụ <code>--pid=host</code> của Bài 1.1 cho bạn nhìn thấy nó. Máy Mac của khoá, đang chạy một nginx:</p>
<pre><code class="language-bash">docker run --rm --pid=host alpine ps -o pid,ppid,args | grep -E 'containerd|dockerd|nginx: master'</code></pre>
<div class="out">  264   143 /usr/bin/containerd --config /etc/containerd/containerd.toml
  286   143 /usr/local/bin/dockerd --config-file /run/config/docker/daemon.json
  667     1 /usr/bin/containerd-shim-runc-v2 -namespace moby -id 224d827284904a15254a20cebae96d0f9c7dfdbaa0fd930f333277d…
16924     1 /usr/bin/containerd-shim-runc-v2 -namespace moby -id fd08f99d1c111f82c804c7daf2da66f5b5faaf4d17c72fd6653c11d…
16947 16924 nginx: master process nginx -g daemon off;
17002     1 /usr/bin/containerd-shim-runc-v2 -namespace moby -id eaf81e7ff141a8d80ef6ac624ebaae0639b31d56b0d96f9867a4129…</div>
<p>Cùng một hình dạng: shim có cha là 1, nginx nằm dưới shim của nó. (Đã cắt bớt dòng; shim cuối cùng là của chính container phụ.) Phiên bản của từng tầng chỉ cách một câu lệnh — trên máy Mac của khoá:</p>
<pre><code class="language-bash">docker version --format '{{range .Server.Components}}{{.Name}}={{.Version}} {{end}}'</code></pre>
<div class="out">Engine=29.8.0 containerd=v2.3.4 runc=1.4.3 docker-init=0.19.0</div>
<p>Giờ tới đỉnh của chồng. CLI không làm gì ngoài gửi yêu cầu HTTP tới dockerd qua một Unix socket (ổ cắm liên lạc giữa các tiến trình trên cùng máy), nên bạn bỏ qua nó được. Trên máy Linux (tài khoản của bạn phải thuộc nhóm <code>docker</code>):</p>
<pre><code class="language-bash">ls -l /var/run/docker.sock
curl -s --unix-socket /var/run/docker.sock http://localhost/containers/json | head -c 120</code></pre>
<div class="out">srw-rw----. 1 root docker 0 Sep 22 22:53 /var/run/docker.sock
[{"Id":"f85e9fedbcab02a618a9552e7cd0729cb28b1d04379d1dfc289476f443f982c2","Names":["/dk01-web"],"Image":"nginx:1.27-alpi</div>
<p>Mẩu JSON đó chính là thứ <code>docker ps</code> định dạng thành bảng. Trên Mac, socket nằm chỗ khác — <code>docker context ls</code> cho bạn biết ở đâu:</p>
<div class="out">NAME              DESCRIPTION                               DOCKER ENDPOINT                               ERROR
default           Current DOCKER_HOST based configuration   unix:///var/run/docker.sock
desktop-linux *   Docker Desktop                            unix:///Users/admin/.docker/run/docker.sock</div>
<p>và <code>curl -s --unix-socket ~/.docker/run/docker.sock http://localhost/version</code> trả về <code>{"Platform":{"Name":"Docker Desktop 4.91.0 (239619)"},"Version":"29.8.0","ApiVersion":"1.56",…</code>. Vì chỉ là một API, CLI trên Mac của bạn điều khiển được tiến trình nền của một máy khác qua SSH, mà máy kia không cần cài gì ngoài Docker (<code>linux-nha</code> là tên SSH của máy Linux của khoá):</p>
<pre><code class="language-bash">DOCKER_HOST=ssh://linux-nha docker ps --format '{{.Names}} {{.Status}}'</code></pre>
<div class="out">dk01-n1 Up 6 minutes</div>
<div class="callout danger"><strong>Nhìn lại <code>srw-rw---- root docker</code>.</strong> Ai ghi được vào socket đó là yêu cầu được dockerd — đang chạy bằng root — khởi chạy một container với <code>-v /:/host --privileged</code>. Thuộc nhóm <code>docker</code> trên thực tế là làm root trên máy đó. Chỉ thêm vào nhóm những người bạn sẵn lòng cho <code>sudo</code>, và đừng bao giờ gắn <code>docker.sock</code> vào một container bạn không hoàn toàn tin.</div>

<h3>Vì sao có cái shim</h3>
${slide('dk-01', 28, 'live-restore: container sống qua lần khởi động lại dockerd')}
<pre><code>docker info --format '{{.LiveRestoreEnabled}}'
sudo systemctl restart docker
sleep 3
docker ps --format '{{.Names}} {{.Status}}'</code></pre>
<div class="out">false
web Up 4 seconds</div>
<div class="callout warn"><strong>Đọc kỹ output đó.</strong> <code>Up 4 seconds</code> sau khi khởi động lại tiến trình nền chỉ xảy ra với container CÓ chính sách khởi động lại (<code>--restart always</code> hoặc <code>unless-stopped</code>) — output này đến từ một container như vậy tên <code>web</code>. Còn <code>w</code> chạy ở trên bằng một lệnh <code>docker run -d</code> trần sẽ hiện <code>Exited</code> và nằm chết luôn, đúng cái bẫy ở cuối bài. (Lần nâng cấp này chúng tôi không khởi động lại tiến trình nền trên máy thật để ghi lại; hành vi mô tả là hành vi theo tài liệu.) Docker Desktop trên Mac của khoá báo <code>docker info -f '{{.LiveRestoreEnabled}}'</code> = <code>false</code>.</div>
<p>Với thiết lập mặc định, khởi động lại tiến trình nền đã DỪNG rồi khởi chạy lại container — hãy để ý dòng <code>Up 4 seconds</code> trên một container vốn đã chạy hàng phút. Cái shim làm cho lựa chọn ngược lại trở nên khả thi: vì cha của tiến trình bạn là shim chứ không phải tiến trình nền, nên tiến trình nền có thể biến mất rồi quay lại mà container không hề hay biết. Bật cái đó lên chỉ là một dòng cấu hình:</p>
<pre><code><span class="tok-comment"># /etc/docker/daemon.json</span>
{
  "live-restore": true,
  "log-driver": "json-file",
  "log-opts": { "max-size": "10m", "max-file": "3" }
}</code></pre>
<pre><code>sudo systemctl reload docker      <span class="tok-comment"># reload, KHÔNG phải restart</span>
docker info --format '{{.LiveRestoreEnabled}}'</code></pre>
<div class="out">true</div>
<div class="callout ok"><strong><code>live-restore: true</code> nên có mặt trên MỌI máy chủ production</strong>, cùng với phần thiết lập xoay vòng log trong chính file đó (Chương 11 giải thích chúng). Nó nghĩa là một lần nâng cấp Docker, hay một cú sập của tiến trình nền, không phải là một sự cố cho mọi thứ đang chạy trên máy. Cái giá thì nhỏ và cụ thể: nó không dùng được với chế độ Swarm, và không cấu hình lại được container trong lúc tiến trình nền đang tắt.</div>

<h3>"OCI" nghĩa là gì, và vì sao nó quan trọng với bạn</h3>
${slide('dk-01', 29, 'OCI: ảnh theo chuẩn mở, runtime thay được')}
<div class="kv-grid">
  <div class="kv"><span class="k">image-spec</span><span class="v">Định dạng của một ảnh: manifest, JSON cấu hình, digest của từng tầng (Bài 1.2). Vì đây là một CHUẨN nên một ảnh bạn dựng bằng <code>docker build</code> chạy nguyên vẹn dưới Podman, containerd, CRI-O và dịch vụ container của mọi đám mây.</span></div>
  <div class="kv"><span class="k">runtime-spec</span><span class="v">Một runtime phải làm gì khi được đưa một hệ thống file gốc và một cấu hình: những namespace nào, những giới hạn cgroup nào, những capability nào. <code>runc</code> là bản hiện thực tham chiếu; bất cứ thứ gì hiện thực đặc tả này đều thay vào được.</span></div>
  <div class="kv"><span class="k">distribution-spec</span><span class="v">API HTTP của registry: ảnh được đẩy và kéo ra sao. Đó là lý do Docker Hub, GHCR, ECR, registry của GitLab và một <code>registry:2</code> tự dựng đều dùng chung một lệnh <code>docker push</code> (Chương 3).</span></div>
  <div class="kv"><span class="k">Hệ quả thực tế</span><span class="v">Mọi thứ bạn học trong khoá này về việc viết ảnh đều MANG ĐI ĐƯỢC. CLI <code>docker</code> chỉ là một máy khách trong số nhiều; những hiện vật mới là chuẩn.</span></div>
</div>
<div class="callout"><strong>Đây chính là chuyện đã thật sự xảy ra khi "Kubernetes khai tử Docker" năm 2020.</strong> Kubernetes gỡ bỏ <em>dockershim</em>, cái bộ chuyển đổi cho phép nó điều khiển dockerd, và bắt đầu nói chuyện thẳng với containerd — thấp hơn ĐÚNG MỘT TẦNG trong cái chồng ở trên. Ảnh dựng bằng Docker không bị ảnh hưởng gì, vì chúng là ảnh OCI chứ không phải "ảnh Docker". Mấy dòng tít thì đáng sợ còn thay đổi thật thì vô hình với bất cứ ai chỉ dựng và đem ảnh đi.</div>

<h3>Đổi cái runtime</h3>
<pre><code>docker info --format '{{json .Runtimes}}'
docker run --rm --runtime=runc alpine echo mặc-định
<span class="tok-comment"># Nếu đã cài gVisor, lệnh này chạy tiến trình của bạn trên một nhân ở không gian người dùng</span>
<span class="tok-comment"># docker run --rm --runtime=runsc alpine dmesg | head -1</span></code></pre>
<div class="out">{"io.containerd.runc.v2":{"path":"runc"},"runc":{"path":"runc"}}
mặc-định</div>
<div class="kv-grid">
  <div class="kv"><span class="k">runc</span><span class="v">Mặc định. Mỏng, nhanh, dùng thẳng nhân của máy chủ. Lựa chọn đúng cho các tải công việc của chính bạn.</span></div>
  <div class="kv"><span class="k">crun</span><span class="v">Bản viết lại runc bằng C: khởi động nhanh hơn và ngốn ít bộ nhớ hơn, tương thích hoàn toàn. Là mặc định trên vài bản cài Podman.</span></div>
  <div class="kv"><span class="k">gVisor (runsc)</span><span class="v">Chặn các lời gọi hệ thống trong một cái nhân ở không gian người dùng, nên một con bọ của nhân khó với tới hơn nhiều. Đổi lại mất một phần hiệu năng lời gọi hệ thống. Đây là câu trả lời khi bạn BUỘC PHẢI chạy mã không đáng tin (lời cảnh báo trung thực ở Bài 1.1).</span></div>
  <div class="kv"><span class="k">Kata Containers</span><span class="v">Chạy mỗi container trong một máy ảo siêu nhẹ có nhân riêng. Cô lập gần bằng máy ảo với sự tiện lợi của container; các đám mây dùng nó cho dịch vụ container nhiều khách hàng.</span></div>
</div>

<h3>Đi xuống dưới Docker</h3>
<pre><code><span class="tok-comment"># CLI của chính containerd — vẫn những container đó, thấp hơn một tầng</span>
sudo ctr --namespace moby containers list | head -3
<span class="tok-comment"># Đọc cấu hình runtime OCI của một container: mọi thứ runc được bảo</span>
sudo ctr --namespace moby containers info \$(docker inspect -f '{{.Id}}' w) \\
  | head -20</code></pre>
<div class="out">CONTAINER                                                           IMAGE    RUNTIME
8c40e93b1a41d2f3c1bd7b6c2e6f4a9c9b8f2d1e5a3c7d9e0b1f2a3c4d5e6f70    -        io.containerd.runc.v2</div>
<p>Docker đăng ký container của nó trong một namespace của containerd tên là <code>moby</code>. Bạn gần như sẽ không bao giờ cần tới chuyện này, nhưng đáng nhìn một lần: nó cụ thể hoá việc Docker là một lớp tiện lợi nằm trên một runtime đa dụng, chứ không phải một khối liền. Khi một container kẹt theo cái kiểu mà <code>docker</code> không gỡ nổi thì đây là cái tầng bạn tụt xuống.</p>
<pre><code>docker rm -f w</code></pre>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> sau khi <code>apt upgrade</code> trên VPS của nhóm, có người hỏi "nâng cấp Docker có giết các container đang chạy không?" Nửa nhóm bảo có, nửa bảo không. Trả lời bằng bằng chứng trên chính máy bạn — mà không khởi động lại tiến trình nền nào.</p><ol>
<li>Liệt kê phiên bản của từng tầng: <code>docker version --format '{{range .Server.Components}}{{.Name}}={{.Version}} {{end}}'</code>.</li>
<li>Tìm socket của tiến trình nền bằng <code>docker context ls</code>, rồi hỏi thẳng nó bằng <code>curl --unix-socket &lt;đường dẫn&gt; http://localhost/version</code> (Linux: <code>/var/run/docker.sock</code>; Mac: <code>~/.docker/run/docker.sock</code>).</li>
<li>Chạy <code>docker run -d --name thu-web nginx:1.27-alpine</code> rồi lần theo cây tiến trình của nó: trên Linux bằng <code>ps -o pid,ppid,args</code> đi ngược từ PID của nó; trên Mac bằng container phụ <code>--pid=host</code>.</li>
<li>Đọc <code>docker info -f '{{.LiveRestoreEnabled}}'</code> và <code>docker inspect -f '{{.HostConfig.RestartPolicy.Name}}' thu-web</code>.</li>
<li>Dọn dẹp: <code>docker rm -f thu-web</code>.</li></ol>
<p><strong>Đạt khi:</strong> bạn vẽ được chuỗi CLI → dockerd → containerd → shim → nginx bằng PID thật trên máy mình, chỉ ra được dòng chứng minh cha của shim là PID 1, và nói được một lần khởi động lại tiến trình nền sẽ làm gì với <code>thu-web</code> theo hai giá trị ở bước 4 (với <code>false</code> và chính sách <code>no</code>: nó dừng và nằm chết luôn).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Docker CLI (giao diện dòng lệnh)</span><span class="v">Lệnh <code>docker</code>: biến những gì bạn gõ thành yêu cầu HTTP tới API của Engine.</span></div>
  <div class="kv"><span class="k">dockerd / daemon (tiến trình nền)</span><span class="v">Dịch vụ chạy ngầm giữ các tính năng của Docker: dựng ảnh, mạng, volume, API.</span></div>
  <div class="kv"><span class="k">containerd (bộ giám sát container)</span><span class="v">Tầng dưới dockerd: kéo ảnh, quản lý snapshot và vòng đời. Kubernetes dùng thẳng nó.</span></div>
  <div class="kv"><span class="k">Shim (tiến trình đệm)</span><span class="v">Một tiến trình nhỏ cho mỗi container, là cha của ứng dụng, được PID 1 nhận nuôi để các tiến trình nền phía trên khởi động lại được.</span></div>
  <div class="kv"><span class="k">runc (bộ tạo container)</span><span class="v">Dựng container (namespace, cgroup, seccomp) rồi <code>exec</code> chương trình của bạn, xong thì thoát.</span></div>
  <div class="kv"><span class="k">OCI (chuẩn container mở)</span><span class="v">Open Container Initiative: các chuẩn mở cho ảnh, runtime và registry.</span></div>
  <div class="kv"><span class="k">live-restore (giữ container khi daemon khởi động lại)</span><span class="v">Thiết lập trong <code>daemon.json</code> giữ container chạy tiếp trong lúc dockerd khởi động lại.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>"Docker" là CLI → dockerd → containerd → mỗi container một shim → runc, mỗi cái một việc.</li>
<li>CLI chỉ là máy khách HTTP của một Unix socket; <code>curl</code> và <code>DOCKER_HOST=ssh://…</code> chứng minh điều đó.</li>
<li>Cha của ứng dụng là shim, còn cha của shim là PID 1 — dockerd không nằm trong chuỗi, còn runc thì đã thoát.</li>
<li>Không có <code>live-restore</code>, khởi động lại dockerd là dừng mọi container và chỉ cái có chính sách khởi động lại mới lên lại.</li>
<li>Quyền ghi vào <code>docker.sock</code> (nhóm <code>docker</code>) chính là quyền root trên máy đó.</li>
<li>Ảnh là hiện vật OCI: chạy nguyên vẹn dưới containerd, Podman hay Kubernetes, và runc thay được bằng gVisor hay Kata.</li>
</ul>

<a class="link-card" href="https://opencontainers.org/" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">Open Container Initiative</span><span class="lc-sub">Ba đặc tả — ảnh, runtime và phân phối — và ai hiện thực chúng. Là lý do "ảnh Docker" và "ảnh OCI" trên thực tế là một.</span></span>
</a>
<a class="link-card" href="https://containerd.io/docs/" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">Tài liệu containerd</span><span class="lc-sub">Bộ giám sát nằm dưới cả Docker lẫn phần lớn cụm Kubernetes. Đáng lướt qua để cái sơ đồ kiến trúc trong bài này thôi trừu tượng.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/daemon/live-restore/" target="_blank" rel="noopener">
  <span class="lc-ico">♻️</span>
  <span class="lc-body"><span class="lc-title">Live restore</span><span class="lc-sub">Trang chính thức về việc giữ container sống khi tiến trình nền tắt: cách bật, thứ gì nạp lại được không cần restart, và giới hạn của nó.</span></span>
</a>
<a class="link-card" href="https://kubernetes.io/blog/2022/02/17/dockershim-faq/" target="_blank" rel="noopener">
  <span class="lc-ico">☸️</span>
  <span class="lc-body"><span class="lc-title">Kubernetes — hỏi đáp về việc gỡ dockershim</span><span class="lc-sub">Lời giải thích rõ ràng nhất về việc thật ra cái gì bị khai tử và vì sao ảnh của bạn chưa bao giờ bị ảnh hưởng. Hữu ích cho lần tới khi có ai bảo bạn Docker chết rồi.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: lần theo cái chồng</span><span class="lc-sub">Bài chấm điểm: tìm ra cái shim là cha của tiến trình một container, giải thích vì sao <code>runc</code> vắng mặt trong <code>ps</code>, và dự đoán một lần khởi động lại tiến trình nền sẽ làm gì khi có và khi không có <code>live-restore</code>.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>sudo systemctl restart docker</code> trên một máy chủ production mà không có <code>live-restore</code>. Nó dừng MỌI container trên máy rồi chỉ khởi chạy lại những cái có chính sách khởi động lại — nên mọi thứ bạn phóng bằng một lệnh <code>docker run -d</code> trần trụi sẽ nằm chết, trong im lặng, cho tới khi có người phát hiện. Những thói quen tránh được nó: đặt <code>"live-restore": true</code> trong <code>/etc/docker/daemon.json</code>, dùng <code>systemctl reload docker</code> khi bạn chỉ đổi cái file đó (reload đọc lại cấu hình mà không đụng vào container), và cho mọi thứ quan trọng một chính sách khởi động lại (Chương 11).</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Bốn chương trình, mỗi cái một việc: CLI nói chuyện với <code>dockerd</code>, cái này điều khiển <code>containerd</code>, cái này khởi chạy một shim cho mỗi container, và shim <code>exec</code> tiến trình của bạn thông qua <code>runc</code>. Cái shim là lý do tiến trình nền khởi động lại được mà không giết container — hãy bật <code>live-restore</code> để điều đó THẬT SỰ xảy ra. Và những hiện vật là một chuẩn mở, nên ảnh của bạn sống lâu hơn cả lựa chọn công cụ của bạn: đó là lý do cái tin Kubernetes-bỏ-Docker chẳng thay đổi gì trong thứ bạn dựng ra.</p>
</div>
`,
    },
    /* ─────────────────────────── 1.6 ─────────────────────────── */
    {
      title: '1.6 — Quiz: the mental model|||1.6 — Kiểm tra: mô hình tư duy',
      slug: 'dk-1-6-quiz',
      type: 'QUIZ',
      description: 'Mười tình huống thật: container có an toàn cho mã lạ không, exit 137 và OOMKilled, cái bẫy swap, DISK USAGE của Docker 29, .env "đã xoá" vẫn lộ, stop mất 10 giây, busybox sh tự exec, Postgres "mất" dữ liệu, cây shim, và mã 127 không có log.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from real work — every one of them is decided by the model you just built. Read the explanation after submitting, especially for the questions you got right by guessing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can show, with a command, that a container is a host process with its own namespaces — and name the one namespace it shares (<code>user</code>).</li>
<li>I can read an exit 137 and prove whether it was the OOM killer (<code>.State.OOMKilled</code>), and I know why swap can hide a memory limit.</li>
<li>I can explain why a file deleted in a later Dockerfile layer is still inside the image, and extract it with <code>docker save</code>.</li>
<li>I can make <code>docker stop</code> take ten seconds, see why in <code>docker events</code>, and fix it (SIGTERM handler or <code>--init</code>).</li>
<li>I know what <code>rm</code> does to the writable layer and to an anonymous volume, and how to rescue an orphaned Postgres volume.</li>
<li>I can draw CLI → dockerd → containerd → shim → runc and say which of them is the parent of my app.</li>
</ul>
${slide('dk-01', 31, 'Bảng tra nhanh Chương 1')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống từ việc thật — câu nào cũng được quyết định bởi mô hình bạn vừa dựng. Đọc phần giải thích sau khi nộp, nhất là những câu bạn đúng nhờ đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi chỉ ra được bằng lệnh rằng container là một tiến trình của máy chủ có namespace riêng — và gọi tên được namespace duy nhất nó dùng chung (<code>user</code>).</li>
<li>Tôi đọc được một cú exit 137 và chứng minh được có phải kẻ giết OOM hay không (<code>.State.OOMKilled</code>), và biết vì sao swap có thể che mất trần bộ nhớ.</li>
<li>Tôi giải thích được vì sao file bị xoá ở tầng Dockerfile sau vẫn nằm trong ảnh, và moi được nó ra bằng <code>docker save</code>.</li>
<li>Tôi làm được cho <code>docker stop</code> mất mười giây, thấy lý do trong <code>docker events</code>, và sửa được (hàm xử lý SIGTERM hoặc <code>--init</code>).</li>
<li>Tôi biết <code>rm</code> làm gì với tầng ghi và với một volume vô danh, và cách cứu một volume Postgres bị bỏ rơi.</li>
<li>Tôi vẽ được CLI → dockerd → containerd → shim → runc và nói được cái nào là cha của ứng dụng mình.</li>
</ul>
${slide('dk-01', 31, 'Bảng tra nhanh Chương 1')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'A teammate says: "A container is a mini virtual machine, so running that unknown script from GitHub inside one is perfectly safe." Which statement is actually true?|||Một bạn cùng nhóm nói: "Container là máy ảo mini, nên chạy cái script lạ trên GitHub trong đó là an toàn tuyệt đối." Điều nào mới thật sự đúng?',
            options: [
              'Each container boots its own small Linux kernel, so a kernel bug triggered inside it can never reach the host kernel|||Mỗi container khởi động một nhân Linux nhỏ của riêng nó, nên con bọ nhân kích hoạt bên trong không bao giờ với tới nhân máy chủ',
              'All containers share the host kernel, and root inside is root outside — a reachable kernel bug is an escape|||Mọi container dùng chung nhân máy chủ, root bên trong là root bên ngoài — con bọ nhân với tới được là lối thoát',
              'It is safe as long as you do not publish any port with -p, because the network namespace blocks everything else|||An toàn miễn là không mở cổng nào bằng -p, vì namespace mạng chặn mọi thứ còn lại',
              'Namespaces encrypt each container’s memory and files, so even a root process cannot read another container|||Namespace mã hoá bộ nhớ và file của từng container, nên kể cả tiến trình root cũng không đọc được container khác',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: uname -r is identical inside and out: there is one kernel, and the user namespace is not enabled by default, so UID 0 inside is UID 0 outside. Namespaces hide things; they do not encrypt anything. Not publishing ports reduces exposure but does nothing about a kernel exploit. Untrusted code needs a VM or gVisor.|||VI: uname -r trong và ngoài giống hệt: chỉ có một nhân, và user namespace mặc định không bật, nên UID 0 bên trong là UID 0 bên ngoài. Namespace che bớt tầm nhìn chứ không mã hoá gì cả. Không mở cổng thì giảm bề mặt tấn công nhưng chẳng giúp gì trước một lỗ hổng nhân. Mã không tin được cần máy ảo hoặc gVisor.',
          },
          {
            question: 'The API container shows "Exited (137)" in docker ps -a. Nobody ran docker stop, and docker inspect -f "{{.State.OOMKilled}}" api prints true. What happened, and what do you change?|||Container API hiện "Exited (137)" trong docker ps -a. Không ai chạy docker stop, và docker inspect -f "{{.State.OOMKilled}}" api in ra true. Chuyện gì đã xảy ra, và bạn sửa gì?',
            options: [
              'The app itself called process.exit(137) somewhere; search the source code for that exact exit code|||Chính ứng dụng đã gọi process.exit(137) ở đâu đó; tìm đúng mã thoát đó trong mã nguồn',
              'The image layers were corrupted during the pull; remove the image and pull it again from the registry|||Các tầng ảnh bị hỏng lúc kéo về; xoá ảnh đi rồi kéo lại từ registry',
              'The default 10-second stop grace period was too short for this API; raise it with docker stop -t 30|||Thời gian ân hạn stop mặc định 10 giây quá ngắn với API này; tăng bằng docker stop -t 30',
              'The OOM killer hit the memory cgroup limit; raise --memory (mind --memory-swap) or use less RAM|||Kẻ giết OOM chạm trần bộ nhớ của cgroup; tăng --memory (để ý --memory-swap) hoặc dùng ít RAM hơn',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: 137 = 128 + 9, killed by SIGKILL, and OOMKilled=true says the OOM killer sent it. The stop-timeout option is tempting because a slow stop also ends in 137 — but nobody ran stop here, and OOMKilled would then be false.|||VI: 137 = 128 + 9, bị SIGKILL giết, và OOMKilled=true nói chính kẻ giết OOM đã gửi nó. Phương án thời gian chờ stop nghe hợp lý vì một cú stop chậm cũng kết thúc bằng 137 — nhưng ở đây không ai chạy stop, và khi đó OOMKilled sẽ là false.',
          },
          {
            question: 'On a VPS that has swap, you run a container with only --memory 256m and allocate 400 MB inside it. It keeps running. Why?|||Trên một VPS có swap, bạn chạy container chỉ với --memory 256m và cấp phát 400 MB bên trong. Nó vẫn chạy tiếp. Vì sao?',
            options: [
              'Without --memory-swap it may also use as much swap as RAM, so the real ceiling is about 512 MB|||Không đặt --memory-swap thì nó được dùng thêm swap bằng lượng RAM, nên trần thật khoảng 512 MB',
              'Memory limits only take effect after the container has been restarted once with docker restart|||Giới hạn bộ nhớ chỉ có hiệu lực sau khi container được docker restart một lần',
              'Alpine-based images ignore cgroup limits, because busybox tools never read the cgroup files|||Ảnh nền Alpine phớt lờ giới hạn cgroup, vì các công cụ busybox không bao giờ đọc file cgroup',
              '--memory is only a soft hint for the scheduler; of all the flags only --cpus is enforced by the kernel|||--memory chỉ là gợi ý mềm cho bộ lập lịch; trong các cờ chỉ có --cpus là được nhân thi hành',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: With --memory 256m alone the course machine showed memory.swap.max = 268435456: 256 MB of extra swap. Set --memory-swap equal to --memory to forbid swap. The limit is enforced by the kernel from the first second; it is not soft, and it applies to every image.|||VI: Chỉ với --memory 256m, máy của khoá cho memory.swap.max = 268435456: thêm 256 MB swap. Đặt --memory-swap bằng --memory để cấm swap. Giới hạn được nhân thi hành ngay từ giây đầu; nó không mềm, và áp cho mọi ảnh.',
          },
          {
            question: 'On Docker 29, docker images shows node:22-alpine with DISK USAGE 237MB and CONTENT SIZE 61.2MB. What explains the gap?|||Trên Docker 29, docker images cho node:22-alpine DISK USAGE 237MB và CONTENT SIZE 61.2MB. Điều gì giải thích khoảng chênh?',
            options: [
              'About 176 MB is stale build cache attached to the image, which docker image prune would free|||Khoảng 176 MB là cache dựng cũ bám vào ảnh, docker image prune sẽ giải phóng nó',
              'CONTENT SIZE counts only the top layer of the image, while DISK USAGE counts all four of its layers|||CONTENT SIZE chỉ đếm tầng trên cùng của ảnh, còn DISK USAGE đếm đủ cả bốn tầng',
              'The containerd store keeps the compressed layers you downloaded and an unpacked copy to run from|||Kho containerd giữ cả tầng nén đã tải về lẫn một bản giải nén để container chạy',
              'DISK USAGE also adds the writable layers of every container that was ever created from this image|||DISK USAGE còn cộng thêm tầng ghi của mọi container từng được tạo từ ảnh này',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: CONTENT SIZE is the compressed download; DISK USAGE is compressed plus unpacked, because the containerd image store (default for fresh Docker 29 installs) keeps both. It is not cache — pruning would remove the image — and container writable layers are reported by docker ps -s, not here.|||VI: CONTENT SIZE là bản nén tải về; DISK USAGE là bản nén cộng bản đã giải nén, vì kho ảnh containerd (mặc định của bản cài Docker 29 mới) giữ cả hai. Đó không phải cache — prune thì mất luôn ảnh — và tầng ghi của container được báo ở docker ps -s, không phải ở đây.',
          },
          {
            question: 'A Dockerfile does COPY .env /app/.env and later RUN rm /app/.env. The image is pushed to a public registry. The teammate says the container cannot even see the file. What is the right conclusion?|||Một Dockerfile làm COPY .env /app/.env rồi sau đó RUN rm /app/.env. Ảnh được đẩy lên một registry công khai. Bạn cùng nhóm nói container còn chẳng nhìn thấy file đó. Kết luận đúng là gì?',
            options: [
              'Nothing leaked: if the running container cannot see the file, nobody who pulls the image can see it either|||Không lộ gì: container đang chạy không thấy file thì người kéo ảnh về cũng không thể thấy',
              'It only shows up in docker history, and strangers cannot run docker history against a registry image|||Nó chỉ hiện trong docker history, mà người lạ không chạy được docker history với ảnh trên registry',
              'The bytes stay in the COPY layer; rm only adds a .wh. whiteout, so anyone can extract it — rotate it|||Các byte vẫn ở tầng COPY; rm chỉ thêm dấu whiteout .wh., ai cũng moi ra được — đổi bí mật ngay',
              'BuildKit automatically squashes consecutive layers, so the file never actually reached the registry|||BuildKit tự ép gộp các tầng liền nhau, nên file thật ra chưa bao giờ lên tới registry',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: Layers are immutable; a delete is a whiteout marker in a new layer. docker save + tar printed DB_PASS=bimat123 from exactly such an image in Lesson 1.2. "The container cannot see it" is true and irrelevant: pulling gives you the layers, not the merged view. BuildKit does not squash.|||VI: Tầng là bất biến; xoá chỉ là một dấu whiteout ở tầng mới. Ở Bài 1.2, docker save + tar đã in ra DB_PASS=bimat123 từ đúng một ảnh như vậy. "Container không thấy nó" là đúng nhưng không liên quan: kéo ảnh về là nhận các tầng, không phải cái nhìn đã gộp. BuildKit không ép gộp tầng.',
          },
          {
            question: 'Your Dockerfile already uses exec form, CMD ["node", "server.js"], yet docker stop api always takes about ten seconds and ends in exit 137. Most likely cause?|||Dockerfile của bạn đã dùng dạng exec, CMD ["node", "server.js"], vậy mà docker stop api lần nào cũng mất khoảng mười giây và kết thúc bằng exit 137. Nguyên nhân khả dĩ nhất?',
            options: [
              'Node is PID 1 with no SIGTERM handler, so the kernel drops SIGTERM; add a handler or use --init|||Node là PID 1 không có hàm xử lý SIGTERM, nên nhân vứt SIGTERM; thêm hàm xử lý hoặc dùng --init',
              'Exec form still wraps the command in /bin/sh -c behind the scenes, and that shell swallows the signal|||Dạng exec vẫn ngầm bọc câu lệnh trong /bin/sh -c, và cái shell đó nuốt mất tín hiệu',
              'Docker always waits the whole grace period before it stops any container, no matter what runs inside|||Docker luôn chờ trọn thời gian ân hạn trước khi dừng bất kỳ container nào, bất kể bên trong chạy gì',
              'The node image is too large for its layers to be unmounted in less than ten seconds after the stop|||Ảnh node quá lớn nên các tầng của nó không gỡ gắn kết kịp trong dưới mười giây sau khi stop',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Measured on the course machine: node without a handler 10.17 s / 137, with process.on("SIGTERM") 0.14 s / 0, with --init 0.16 s / 143. Exec form is what makes node PID 1 — it does not add a shell. Docker does not always wait: nginx stopped in 0.20 s.|||VI: Đo trên máy của khoá: node không có hàm xử lý 10,17 s / 137, có process.on("SIGTERM") 0,14 s / 0, với --init 0,16 s / 143. Dạng exec chính là thứ làm node thành PID 1 — nó không thêm shell nào. Docker cũng không phải lúc nào cũng chờ: nginx dừng trong 0,20 s.',
          },
          {
            question: 'You run docker run -d --name s alpine sh -c "sleep 600" and docker exec s ps shows PID 1 is "sleep 600", with no shell at all. Why?|||Bạn chạy docker run -d --name s alpine sh -c "sleep 600" và docker exec s ps cho thấy PID 1 là "sleep 600", không có shell nào cả. Vì sao?',
            options: [
              'Docker strips the "sh -c" wrapper from every command before it starts the container’s process|||Docker tự gỡ lớp bọc "sh -c" khỏi mọi câu lệnh trước khi khởi chạy tiến trình của container',
              'The alpine image contains no /bin/sh at all, so Docker fell back to running sleep directly|||Ảnh alpine hoàn toàn không có /bin/sh, nên Docker quay sang chạy thẳng sleep',
              'The -d flag tells Docker to exec only the last word of the command instead of the whole string|||Cờ -d bảo Docker chỉ exec từ cuối cùng của câu lệnh thay vì cả chuỗi',
              'Busybox sh execs the last command of a -c string; with anything after sleep, sh would stay PID 1|||sh của busybox exec lệnh cuối của chuỗi -c; có gì đứng sau sleep thì sh sẽ ở lại làm PID 1',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: sh -c "sleep 600; echo done" keeps sh as PID 1 with sleep as its child — measured. Alpine does have /bin/sh (busybox), Docker never rewrites your command, and -d only detaches the CLI.|||VI: sh -c "sleep 600; echo xong" giữ sh làm PID 1 với sleep là con — đã đo. Alpine có /bin/sh (busybox), Docker không bao giờ sửa câu lệnh của bạn, và -d chỉ tách CLI ra khỏi output.',
          },
          {
            question: 'A teammate ran docker rm -f db on a postgres:16-alpine container started without -v, then started a new one the same way. The tables are gone. What is true, and what do you try first?|||Một bạn chạy docker rm -f db với container postgres:16-alpine chạy không có -v, rồi chạy lại y như cũ. Các bảng biến mất. Điều gì đúng, và bạn thử gì trước?',
            options: [
              'The data lived in the writable layer, so it is gone for good and only a backup can bring it back|||Dữ liệu nằm trong tầng ghi, nên đã mất vĩnh viễn và chỉ bản sao lưu mới lấy lại được',
              'The image declares VOLUME: the data sits in an orphaned anonymous volume; find it and mount it back|||Ảnh có khai VOLUME: dữ liệu nằm trong một volume vô danh bị bỏ rơi; tìm nó rồi gắn lại',
              'A plain docker restart would have lost it as well, so containers can never safely hold a database|||Một lệnh docker restart trơn cũng làm mất nó, nên container không bao giờ chứa CSDL an toàn được',
              'docker rm moved the data into a hidden image layer, which you can read back with docker history|||docker rm đã chuyển dữ liệu vào một tầng ảnh ẩn, đọc lại được bằng docker history',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: docker diff showed only socket files in the writable layer; docker inspect .Mounts showed an anonymous volume, and mounting that old volume into a new container returned the row. The writable-layer answer is right for images without VOLUME, not this one. restart keeps everything.|||VI: docker diff chỉ cho thấy file socket trong tầng ghi; docker inspect .Mounts cho thấy một volume vô danh, và gắn volume cũ đó vào container mới đã trả lại dòng dữ liệu. Phương án tầng ghi đúng với ảnh KHÔNG khai VOLUME, không phải ảnh này. restart thì giữ mọi thứ.',
          },
          {
            question: 'On a Linux host, ps shows nginx with PPID = the containerd-shim, and the shim with PPID = 1. What does this arrangement make possible?|||Trên máy Linux, ps cho thấy nginx có PPID = containerd-shim, còn shim có PPID = 1. Cách sắp xếp này làm được điều gì?',
            options: [
              'dockerd and containerd can restart without killing the app — with live-restore, it keeps running|||dockerd và containerd khởi động lại được mà không giết app — bật live-restore thì nó chạy tiếp',
              'runc stays alive in the background as the permanent supervisor that restarts the container|||runc ở lại chạy ngầm làm bộ giám sát thường trực, khởi động lại container khi cần',
              'dockerd becomes the direct parent of every container so that it can reap their zombie processes|||dockerd trở thành cha trực tiếp của mọi container để dọn tiến trình xác của chúng',
              'The container ends up running outside of any cgroup, so the memory and CPU limits stop applying|||Container rốt cuộc chạy ngoài mọi cgroup, nên giới hạn RAM và CPU không còn tác dụng',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Neither daemon is an ancestor of nginx, so they can go away and come back; live-restore tells dockerd not to stop containers when it does. runc exits right after starting the process (pgrep -x runc found 0), and cgroups are untouched by who the parent is.|||VI: Không tiến trình nền nào là tổ tiên của nginx, nên chúng có thể tắt rồi bật lại; live-restore bảo dockerd đừng dừng container khi làm vậy. runc thoát ngay sau khi khởi chạy tiến trình (pgrep -x runc ra 0), và cgroup không phụ thuộc ai là cha.',
          },
          {
            question: 'docker run --name c alpine /bin/nope ends with exit code 127, docker inspect shows status "created", and docker logs c is empty. Why is there no log?|||docker run --name c alpine /bin/nope kết thúc với mã 127, docker inspect cho trạng thái "created", và docker logs c trống trơn. Vì sao không có log?',
            options: [
              'The application wrote its logs into a file inside the container instead of writing them to stdout|||Ứng dụng ghi log vào một file bên trong container thay vì ghi ra stdout',
              'Docker rejected the command-line flags before creating anything — that is exactly what 127 means|||Docker từ chối các cờ dòng lệnh trước khi tạo bất cứ thứ gì — 127 nghĩa chính xác là vậy',
              'runc could not exec /bin/nope in the new container, so nothing ever ran; the reason is on stderr|||runc không exec được /bin/nope trong container mới, nên chưa có gì chạy; lý do nằm ở stderr',
              'The container was killed by the OOM killer a moment after starting, before it could write any output|||Container bị kẻ giết OOM giết ngay sau khi khởi động, trước khi kịp ghi ra gì',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: The error reads "runc create failed … exec: "/bin/nope": stat /bin/nope: no such file or directory", and the container stays in created because it never started. Flag errors are 125, not 127, and an OOM kill would be 137 with status exited.|||VI: Thông báo lỗi ghi "runc create failed … exec: "/bin/nope": stat /bin/nope: no such file or directory", và container nằm lại ở created vì chưa hề khởi chạy. Lỗi cờ là 125 chứ không phải 127, còn bị OOM giết thì là 137 với trạng thái exited.',
          },
        ],
      },
    },
  ],
};
