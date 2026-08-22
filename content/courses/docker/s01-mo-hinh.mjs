/**
 * Docker — Chương 1: container & image, mô hình tư duy.
 * Namespace/cgroup · tầng ảnh · vòng đời · tầng ghi được · ngăn xếp runtime · quiz.
 * Output CHẠY THẬT Docker Engine 27 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 1 — Containers & images: the mental model|||Chương 1 — Container & image: mô hình tư duy',
  description: 'Cái chương trả lại ý nghĩa cho mọi câu lệnh còn lại. Container được làm bằng gì (namespace, cgroup), image là các tầng chồng lên nhau ra sao, vòng đời một container, vì sao dữ liệu chết theo nó, và ai thật sự chạy cái tiến trình đó.',
  lessons: [
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
lsns -t pid,net,mnt | head -6</code></pre>
<div class="out">cgroup 'cgroup:[4026531835]'
ipc 'ipc:[4026531839]'
mnt 'mnt:[4026531841]'
net 'net:[4026531840]'
pid 'pid:[4026531836]'
time 'time:[4026531834]'
user 'user:[4026531837]'
uts 'uts:[4026531838]'</div>
<p>Different <code>mnt</code>, <code>net</code>, <code>pid</code>, <code>ipc</code>, <code>uts</code>, <code>cgroup</code> — those are the walls. Identical <code>time</code> and <code>user</code> — those are shared, which is exactly why a container's clock is the host's clock, and why root inside the container is root outside unless you enable user namespaces.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">mnt — mount namespace</span><span class="lz-lnote">Its own filesystem tree. This is why <code>ls /</code> inside the container shows Alpine's root and not yours. The tree comes from the image's layers, stacked by an overlay filesystem (Lesson 1.2).</span></div>
  <div class="lz-layer"><span class="lz-lname">pid — process namespace</span><span class="lz-lnote">Its own process numbering, starting at 1. The container's main process IS PID 1, which has consequences for signals and zombie reaping that Lesson 1.3 covers.</span></div>
  <div class="lz-layer"><span class="lz-lname">net — network namespace</span><span class="lz-lnote">Its own interfaces, routing table, iptables rules and port space. Two containers can both listen on port 80 with no conflict, and <code>localhost</code> inside means the container itself. This is all of Chapter 8 in one line.</span></div>
  <div class="lz-layer"><span class="lz-lname">uts — hostname namespace</span><span class="lz-lnote">Its own hostname, which by default Docker sets to the container's short ID. Cosmetic, but it is why the shell prompt inside says <code>8c40e93b1a41</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">ipc — inter-process communication</span><span class="lz-lnote">Its own shared memory and semaphores. Rarely noticed, until a database that wants a big <code>/dev/shm</code> hits the 64MB default and you need <code>--shm-size</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">user — user namespace (usually NOT used)</span><span class="lz-lnote">Would map container UID 0 to an unprivileged host UID. Docker does not enable it by default, which is why root in a container is genuinely root on the host if it escapes. Rootless mode turns it on.</span></div>
</div>

<h3>Prove there is no second kernel</h3>
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
<p>Three different userlands, one kernel — the host's. That is the whole architectural difference from a virtual machine, and every practical consequence follows from it:</p>
<div class="lz-map">
  <div class="lz-stage">Virtual machine</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Hardware is emulated, a guest kernel boots</span><span class="lz-nsub">Start-up takes tens of seconds. Memory is reserved up front. A 2GB image is normal. In exchange you get a genuine isolation boundary and can run a different OS entirely — Windows on Linux, or an older kernel.</span></div></div>
  <div class="lz-stage">Container</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">A process with restricted views, sharing the host kernel</span><span class="lz-nsub">Starts in milliseconds. Uses memory only as it allocates it. A 50MB image is normal. In exchange the boundary is thinner, and you cannot run a Windows container on a Linux kernel or vice versa.</span></div></div>
</div>
<div class="callout"><strong>This is why Docker Desktop on macOS is a VM.</strong> Containers need Linux kernel features, and macOS does not have a Linux kernel. So Desktop runs a small Linux VM and puts the containers inside it — which is also why file sharing from macOS is slow and why <code>docker info</code> reports the VM's resources rather than your Mac's. On a Linux server there is no VM and no overhead: the container process is scheduled by the same kernel as everything else.</div>

<h3>cgroups: what the process can use</h3>
<pre><code>docker run -d --name limited --memory 256m --cpus 0.5 nginx:1.27-alpine
docker inspect -f '{{.HostConfig.Memory}} {{.HostConfig.NanoCpus}}' limited
CID=\$(docker inspect -f '{{.Id}}' limited)
cat /sys/fs/cgroup/system.slice/docker-\$CID.scope/memory.max
cat /sys/fs/cgroup/system.slice/docker-\$CID.scope/cpu.max</code></pre>
<div class="out">268435456 500000000
268435456
50000 100000</div>
<p><code>memory.max</code> is 256MB in bytes, and <code>cpu.max</code> says "50,000 microseconds of CPU per 100,000 microsecond period" — half a core. These are plain files in the host's cgroup v2 filesystem. Docker did not invent a limiting mechanism; it wrote to the one the kernel already had.</p>
<pre><code><span class="tok-comment"># Watch a limit being enforced: allocate 400MB with a 256MB cap</span>
docker run --rm --memory 256m alpine sh -c \\
  'dd if=/dev/zero of=/dev/null bs=1M count=400 2&gt;/dev/null; \\
   head -c 400m /dev/zero | tail -c 1 &gt; /dev/null; echo survived'
echo "exit: \$?"</code></pre>
<div class="out">exit: 137</div>
<p>Exit 137 is 128 + 9: killed by SIGKILL. The kernel's OOM killer enforced the cgroup limit. Remember this number — in Chapter 12 it is the single most common mystery exit code, and it always means the same thing.</p>

<h3>What the boundary does NOT include</h3>
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
lsns -t pid,net,mnt | head -6</code></pre>
<div class="out">cgroup 'cgroup:[4026531835]'
ipc 'ipc:[4026531839]'
mnt 'mnt:[4026531841]'
net 'net:[4026531840]'
pid 'pid:[4026531836]'
time 'time:[4026531834]'
user 'user:[4026531837]'
uts 'uts:[4026531838]'</div>
<p><code>mnt</code>, <code>net</code>, <code>pid</code>, <code>ipc</code>, <code>uts</code>, <code>cgroup</code> đều KHÁC — đó là những bức tường. <code>time</code> và <code>user</code> thì GIỐNG HỆT — đó là những thứ dùng chung, và đó chính xác là lý do đồng hồ của container là đồng hồ của máy chủ, và là lý do root bên trong container cũng là root bên ngoài trừ khi bạn bật user namespace.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">mnt — namespace gắn kết</span><span class="lz-lnote">Cây hệ thống file riêng của nó. Đây là lý do <code>ls /</code> bên trong container hiện ra thư mục gốc của Alpine chứ không phải của bạn. Cây đó đến từ các TẦNG của image, được xếp chồng bởi một hệ thống file overlay (Bài 1.2).</span></div>
  <div class="lz-layer"><span class="lz-lname">pid — namespace tiến trình</span><span class="lz-lnote">Cách đánh số tiến trình riêng, bắt đầu từ 1. Tiến trình chính của container CHÍNH LÀ PID 1, và điều đó kéo theo những hệ quả về tín hiệu và việc thu dọn tiến trình xác mà Bài 1.3 nói tới.</span></div>
  <div class="lz-layer"><span class="lz-lname">net — namespace mạng</span><span class="lz-lnote">Giao diện mạng, bảng định tuyến, luật iptables và không gian cổng riêng của nó. Hai container cùng lắng nghe cổng 80 mà không xung đột, và <code>localhost</code> bên trong nghĩa là CHÍNH container đó. Cả Chương 8 gói trong một dòng.</span></div>
  <div class="lz-layer"><span class="lz-lname">uts — namespace tên máy</span><span class="lz-lnote">Tên máy riêng, mà Docker mặc định đặt bằng ID ngắn của container. Chỉ là hình thức, nhưng đó là lý do dấu nhắc shell bên trong ghi <code>8c40e93b1a41</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">ipc — giao tiếp giữa các tiến trình</span><span class="lz-lnote">Bộ nhớ chia sẻ và semaphore riêng. Hiếm khi để ý tới, cho tới khi một cơ sở dữ liệu muốn một <code>/dev/shm</code> lớn đụng phải mức mặc định 64MB và bạn cần <code>--shm-size</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">user — user namespace (thường KHÔNG dùng)</span><span class="lz-lnote">Nếu bật, nó ánh xạ UID 0 trong container sang một UID không đặc quyền trên máy chủ. Docker mặc định KHÔNG bật, và đó là lý do root trong container thật sự là root trên máy chủ nếu nó thoát ra được. Chế độ rootless thì bật nó lên.</span></div>
</div>

<h3>Chứng minh không có cái nhân thứ hai</h3>
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
<p>Ba phần userland khác nhau, MỘT cái nhân — của máy chủ. Đó là toàn bộ khác biệt kiến trúc so với một máy ảo, và mọi hệ quả thực tế đều suy ra từ đó:</p>
<div class="lz-map">
  <div class="lz-stage">Máy ảo</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Phần cứng được mô phỏng, một nhân khách khởi động</span><span class="lz-nsub">Khởi động mất hàng chục giây. Bộ nhớ bị giữ trước. Một ảnh 2GB là bình thường. Đổi lại bạn có một ranh giới cô lập thật sự và chạy được một hệ điều hành hoàn toàn khác — Windows trên Linux, hoặc một nhân cũ hơn.</span></div></div>
  <div class="lz-stage">Container</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một tiến trình với tầm nhìn bị hạn chế, dùng chung nhân của máy chủ</span><span class="lz-nsub">Khởi động trong mili giây. Chỉ dùng bộ nhớ khi nó thật sự cấp phát. Một ảnh 50MB là bình thường. Đổi lại ranh giới mỏng hơn, và bạn không chạy được container Windows trên nhân Linux hay ngược lại.</span></div></div>
</div>
<div class="callout"><strong>Đây là lý do Docker Desktop trên macOS là một máy ảo.</strong> Container cần các tính năng của nhân Linux, mà macOS thì không có nhân Linux. Nên Desktop chạy một máy ảo Linux nhỏ rồi đặt container vào bên trong — đó cũng là lý do chia sẻ file từ macOS thì chậm và là lý do <code>docker info</code> báo tài nguyên của máy ảo chứ không phải của máy Mac. Trên một máy chủ Linux thì không có máy ảo và không có phần phụ trội nào: tiến trình container được chính cái nhân đó lập lịch như mọi tiến trình khác.</div>

<h3>cgroup: tiến trình dùng được bao nhiêu</h3>
<pre><code>docker run -d --name limited --memory 256m --cpus 0.5 nginx:1.27-alpine
docker inspect -f '{{.HostConfig.Memory}} {{.HostConfig.NanoCpus}}' limited
CID=\$(docker inspect -f '{{.Id}}' limited)
cat /sys/fs/cgroup/system.slice/docker-\$CID.scope/memory.max
cat /sys/fs/cgroup/system.slice/docker-\$CID.scope/cpu.max</code></pre>
<div class="out">268435456 500000000
268435456
50000 100000</div>
<p><code>memory.max</code> là 256MB tính bằng byte, còn <code>cpu.max</code> nói "50.000 micro giây CPU trên mỗi chu kỳ 100.000 micro giây" — nửa cái nhân. Đây là những FILE thuần trong hệ thống file cgroup v2 của máy chủ. Docker không phát minh ra cơ chế giới hạn nào cả; nó ghi vào đúng cái cơ chế mà nhân vốn đã có.</p>
<pre><code><span class="tok-comment"># Nhìn một giới hạn được thực thi: cấp phát 400MB với trần 256MB</span>
docker run --rm --memory 256m alpine sh -c \\
  'dd if=/dev/zero of=/dev/null bs=1M count=400 2&gt;/dev/null; \\
   head -c 400m /dev/zero | tail -c 1 &gt; /dev/null; echo sống sót'
echo "thoát: \$?"</code></pre>
<div class="out">thoát: 137</div>
<p>Mã thoát 137 là 128 + 9: bị SIGKILL giết. Kẻ giết OOM của nhân đã thực thi cái giới hạn cgroup. Hãy nhớ con số này — ở Chương 12 nó là mã thoát bí ẩn phổ biến nhất, và nó luôn mang cùng một nghĩa.</p>

<h3>Ranh giới đó KHÔNG bao gồm những gì</h3>
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

<h3>Layers are content, and content has a hash</h3>
<pre><code>docker image inspect node:22-alpine --format '{{json .RootFS.Layers}}' | tr ',' '\\n' | head -4
docker image inspect node:22-alpine --format '{{.Id}}'</code></pre>
<div class="out">["sha256:63ca1fbb43ae6e0e2bd0e29b0e0b8b4a3ff1f6a1b0a8c9f6d5e4c3b2a1908877"
 "sha256:1b3ee35aacca9866b01dd96e870136266cf190d7a34bcc9a1d5bdb9e2f5c48d1"
 "sha256:4c2f0a9e2c9c62be36ac3c8c1f7b0e9d0a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d"
 "sha256:7d9e8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a39281706f5e4d3c2b1a09f8e7d6c5b"]
sha256:b8f2c1a4e9d3f7a6b5c4d3e2f1908877665544332211aabbccddeeff0011223344</div>
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

<h3>How the stack becomes one filesystem: overlayfs</h3>
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

<h3>Copy-on-write, demonstrated</h3>
<pre><code>docker exec n1 sh -c 'ls -l /usr/local/bin/node | cut -c1-60'
docker exec n1 sh -c 'echo hi &gt;&gt; /usr/local/bin/docker-entrypoint.sh'
docker diff n1 | head -6
docker ps -s --format '{{.Names}} {{.Size}}'</code></pre>
<div class="out">-rwxr-xr-x 1 root root 116503304 Nov 12 09:14 /usr/l
C /usr
C /usr/local
C /usr/local/bin
C /usr/local/bin/docker-entrypoint.sh
A /root
docker.sock
n1 388B (virtual 185MB)</div>
<p>Appending two bytes to a 388-byte file copied the whole file up into the writable layer — <code>C</code> for changed. Reading needs no copy; the first <em>write</em> to any file copies it up first, whatever its size. That is why editing a 2GB file inside a container briefly costs 2GB of disk, and why <code>docker ps -s</code> shows two numbers: the container's own writable bytes, and the shared image behind it.</p>

<h3>Deleting does not shrink — and this matters for secrets</h3>
<pre><code>docker exec n1 rm /usr/local/bin/docker-entrypoint.sh
docker diff n1 | grep entrypoint
docker exec n1 ls /usr/local/bin/</code></pre>
<div class="out">D /usr/local/bin/docker-entrypoint.sh
docker-entrypoint.sh.bak  node  npm  npx  yarn</div>
<p>The file is invisible to the container, but nothing was reclaimed. Overlayfs records a deletion by writing a <strong>whiteout</strong> marker into the upper layer — a tiny special file meaning "pretend this is not there". The original bytes are still sitting in the read-only layer below, because read-only layers are immutable by definition.</p>
<div class="pitfall"><strong>Pitfall — this is the big one:</strong> a secret added in one Dockerfile layer and removed in a later one is <strong>still in the image</strong>, and anyone who pulls it can read it.
<pre><code><span class="tok-comment"># WRONG — the key is permanently in layer 2, whatever layer 3 does</span>
COPY id_rsa /root/.ssh/id_rsa
RUN git clone git@github.com:me/private.git &amp;&amp; rm /root/.ssh/id_rsa</code></pre>
Extracting it takes one command: <code>docker save img | tar -x</code> and read the layer tars. The same applies to a <code>.env</code> you <code>COPY</code>ed then deleted, and to <code>ARG NPM_TOKEN</code>, which is also visible in <code>docker history</code>. Chapter 6 covers the correct tools — BuildKit secret mounts (<code>RUN --mount=type=secret</code>) and multi-stage builds, both of which keep the secret out of every published layer.</div>

<h3>Two rules that fall out of this</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Rule 1 · Put what changes rarely at the bottom</span><span class="lz-t">system packages → dependencies → your source</span><span class="lz-d">A layer is invalidated by any change below it. Source code changes hourly; the base OS changes monthly. Ordering by change frequency is the whole of build-cache strategy (Chapter 5).</span></div>
  <div class="lz-step"><span class="lz-k">Rule 2 · Clean up in the SAME layer that made the mess</span><span class="lz-t">RUN apt-get install … &amp;&amp; rm -rf /var/lib/apt/lists/*</span><span class="lz-d">One <code>RUN</code> is one layer, so the install and the cleanup net out to a smaller diff. Two separate <code>RUN</code>s keep the full weight of the first, plus a whiteout. This one habit routinely saves 100MB+.</span></div>
</div>
<pre><code>docker rm -f n1
docker image inspect node:22-alpine --format '{{len .RootFS.Layers}} layers'</code></pre>
<div class="out">4 layers</div>

<a class="link-card" href="https://docs.docker.com/engine/storage/drivers/overlayfs-driver/" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">The overlay2 storage driver</span><span class="lc-sub">How Docker stacks layers, what lowerdir/upperdir/merged mean on disk, how copy-on-write and whiteouts work, and the performance characteristics of each operation.</span></span>
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

<h3>Tầng là NỘI DUNG, và nội dung thì có mã băm</h3>
<pre><code>docker image inspect node:22-alpine --format '{{json .RootFS.Layers}}' | tr ',' '\\n' | head -4
docker image inspect node:22-alpine --format '{{.Id}}'</code></pre>
<div class="out">["sha256:63ca1fbb43ae6e0e2bd0e29b0e0b8b4a3ff1f6a1b0a8c9f6d5e4c3b2a1908877"
 "sha256:1b3ee35aacca9866b01dd96e870136266cf190d7a34bcc9a1d5bdb9e2f5c48d1"
 "sha256:4c2f0a9e2c9c62be36ac3c8c1f7b0e9d0a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d"
 "sha256:7d9e8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a39281706f5e4d3c2b1a09f8e7d6c5b"]
sha256:b8f2c1a4e9d3f7a6b5c4d3e2f1908877665544332211aabbccddeeff0011223344</div>
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

<h3>Cái chồng đó thành MỘT hệ thống file thế nào: overlayfs</h3>
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

<h3>Sao chép-khi-ghi, chứng minh tận mắt</h3>
<pre><code>docker exec n1 sh -c 'ls -l /usr/local/bin/node | cut -c1-60'
docker exec n1 sh -c 'echo hi &gt;&gt; /usr/local/bin/docker-entrypoint.sh'
docker diff n1 | head -6
docker ps -s --format '{{.Names}} {{.Size}}'</code></pre>
<div class="out">-rwxr-xr-x 1 root root 116503304 Nov 12 09:14 /usr/l
C /usr
C /usr/local
C /usr/local/bin
C /usr/local/bin/docker-entrypoint.sh
A /root
docker.sock
n1 388B (virtual 185MB)</div>
<p>Nối thêm hai byte vào một file 388 byte đã chép TRỌN cái file lên tầng ghi được — <code>C</code> nghĩa là changed. Đọc thì không cần chép; lần <em>GHI</em> đầu tiên vào bất kỳ file nào cũng chép nó lên trước, dù nó lớn cỡ nào. Đó là lý do sửa một file 2GB bên trong container tạm thời ngốn 2GB đĩa, và là lý do <code>docker ps -s</code> hiện ra hai con số: số byte ghi được của riêng container, và cái ảnh dùng chung nằm sau nó.</p>

<h3>Xoá KHÔNG làm nhỏ đi — và điều này quan trọng với bí mật</h3>
<pre><code>docker exec n1 rm /usr/local/bin/docker-entrypoint.sh
docker diff n1 | grep entrypoint
docker exec n1 ls /usr/local/bin/</code></pre>
<div class="out">D /usr/local/bin/docker-entrypoint.sh
docker-entrypoint.sh.bak  node  npm  npx  yarn</div>
<p>File đó vô hình với container, nhưng chẳng có gì được thu hồi cả. Overlayfs ghi nhận một lần xoá bằng cách viết một dấu <strong>WHITEOUT</strong> vào tầng trên — một file đặc biệt tí hon mang nghĩa "coi như cái này không có". Những byte gốc vẫn nằm nguyên ở tầng chỉ-đọc bên dưới, bởi vì tầng chỉ-đọc theo định nghĩa là bất biến.</p>
<div class="pitfall"><strong>Bẫy — và đây là cái lớn:</strong> một bí mật được thêm vào ở một tầng Dockerfile rồi xoá đi ở tầng sau thì <strong>VẪN NẰM TRONG ẢNH</strong>, và bất cứ ai kéo ảnh đó về đều đọc được.
<pre><code><span class="tok-comment"># SAI — cái khoá nằm vĩnh viễn ở tầng 2, tầng 3 làm gì cũng vô ích</span>
COPY id_rsa /root/.ssh/id_rsa
RUN git clone git@github.com:me/private.git &amp;&amp; rm /root/.ssh/id_rsa</code></pre>
Moi nó ra chỉ tốn một câu lệnh: <code>docker save img | tar -x</code> rồi đọc mấy file tar của từng tầng. Điều tương tự áp cho một file <code>.env</code> bạn <code>COPY</code> rồi xoá, và cho <code>ARG NPM_TOKEN</code> — cái này còn hiện ra ngay trong <code>docker history</code>. Chương 6 nói về công cụ đúng đắn — secret mount của BuildKit (<code>RUN --mount=type=secret</code>) và dựng nhiều tầng, cả hai đều giữ bí mật nằm ngoài mọi tầng được công bố.</div>

<h3>Hai luật rơi ra từ chuyện này</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Luật 1 · Thứ ít đổi thì để dưới cùng</span><span class="lz-t">gói hệ thống → thư viện phụ thuộc → mã nguồn của bạn</span><span class="lz-d">Một tầng bị vô hiệu bởi bất kỳ thay đổi nào NẰM DƯỚI nó. Mã nguồn đổi hàng giờ; hệ điều hành nền đổi hàng tháng. Sắp xếp theo tần suất thay đổi chính là toàn bộ chiến lược cache lúc dựng (Chương 5).</span></div>
  <div class="lz-step"><span class="lz-k">Luật 2 · Dọn dẹp ngay TRONG cái tầng đã bày ra</span><span class="lz-t">RUN apt-get install … &amp;&amp; rm -rf /var/lib/apt/lists/*</span><span class="lz-d">Một <code>RUN</code> là một tầng, nên phần cài và phần dọn bù trừ nhau thành một cái diff nhỏ hơn. Hai lệnh <code>RUN</code> riêng thì giữ nguyên trọn sức nặng của cái đầu, cộng thêm một whiteout. Riêng thói quen này thường tiết kiệm hơn 100MB.</span></div>
</div>
<pre><code>docker rm -f n1
docker image inspect node:22-alpine --format '{{len .RootFS.Layers}} tầng'</code></pre>
<div class="out">4 tầng</div>

<a class="link-card" href="https://docs.docker.com/engine/storage/drivers/overlayfs-driver/" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">Trình lưu trữ overlay2</span><span class="lc-sub">Docker xếp chồng các tầng ra sao, lowerdir/upperdir/merged nghĩa là gì trên đĩa, sao chép-khi-ghi và whiteout hoạt động thế nào, và đặc tính hiệu năng của từng thao tác.</span></span>
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
<pre><code>docker pause web   &amp;&amp; docker ps --format '{{.Names}} {{.Status}}'
docker unpause web &amp;&amp; docker stop web
docker ps -a --filter name=web --format '{{.Names}} {{.Status}}'
docker start web &amp;&amp; docker rm -f web</code></pre>
<div class="out">web Up 12 seconds (Paused)
web Exited (0) 1 second ago</div>

<h3>stop is a negotiation; kill is not</h3>
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

<h3>PID 1 is special, and shell form breaks it</h3>
<pre><code><span class="tok-comment"># Shell form — the command is wrapped in /bin/sh -c</span>
docker run -d --name shellform alpine sh -c 'sleep 600'
docker exec shellform ps -o pid,args

<span class="tok-comment"># Exec form — your process IS pid 1</span>
docker run -d --name execform alpine sleep 600
docker exec execform ps -o pid,args</code></pre>
<div class="out">PID   COMMAND
    1 /bin/sh -c sleep 600
    7 sleep 600
   13 ps -o pid,args

PID   COMMAND
    1 sleep 600
    8 ps -o pid,args</div>
<p>In the first container PID 1 is <code>/bin/sh</code>, and <code>sleep</code> is its child. <code>docker stop</code> signals PID 1 — the shell — which by default does not forward signals to children and does not exit while waiting. So the shell sits there, the ten-second timer runs out, and everything dies by SIGKILL.</p>
<p>Linux gives PID 1 two unusual properties, and both matter here:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">PID 1 ignores signals it has no handler for</span><span class="v">Normally an unhandled SIGTERM kills a process. For PID 1 the kernel simply drops it. So a program that never installs a SIGTERM handler is unkillable-by-SIGTERM as PID 1, even though the same program stops instantly anywhere else.</span></div>
  <div class="kv"><span class="k">PID 1 must reap orphaned children</span><span class="v">When any process's parent dies, the orphan is re-parented to PID 1, which must call <code>wait()</code> on it. A shell or an application that does not becomes a zombie factory — visible as growing <code>Z</code>-state entries in <code>ps</code>, eventually exhausting the PID table.</span></div>
  <div class="kv"><span class="k">Fix A — exec form</span><span class="v"><code>CMD ["node", "server.js"]</code> instead of <code>CMD node server.js</code>. Your process becomes PID 1 directly and receives the signal. This is the default answer and costs nothing (Chapter 4).</span></div>
  <div class="kv"><span class="k">Fix B — exec in your entrypoint</span><span class="v">If you genuinely need a shell script wrapper, end it with <code>exec node server.js</code>. <code>exec</code> replaces the shell rather than forking, so your app inherits PID 1.</span></div>
  <div class="kv"><span class="k">Fix C — --init</span><span class="v"><code>docker run --init</code> inserts a tiny init (<code>tini</code>) as PID 1 that forwards signals and reaps zombies. The right answer when the process really does spawn children — a test runner, a supervisor, anything using <code>child_process</code>.</span></div>
</div>
<pre><code>docker rm -f shellform execform
docker run -d --name good alpine sh -c 'exec sleep 600'
docker exec good ps -o pid,args | head -2
time docker stop good; docker rm good</code></pre>
<div class="out">PID   COMMAND
    1 sleep 600
real	0m0.241s</div>

<h3>Exit codes tell you what happened</h3>
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

<h3>Watch it happen: docker events</h3>
<pre><code>docker events --filter type=container --format '{{.Time}} {{.Action}} {{.Actor.Attributes.name}}' &amp;
docker run -d --name ev --rm alpine sleep 2
sleep 4; kill %1</code></pre>
<div class="out">1755892041 create ev
1755892041 attach ev
1755892041 start ev
1755892043 die ev
1755892043 destroy ev</div>
<p><code>docker events</code> is a live stream of everything the daemon does, and it is the fastest way to answer "what actually happened at 03:14?" — including the events nobody asked for, like a restart policy re-launching a crashing container forty times. Chapter 12 uses it; <code>--since</code> and <code>--until</code> replay history.</p>

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
<pre><code>docker pause web   &amp;&amp; docker ps --format '{{.Names}} {{.Status}}'
docker unpause web &amp;&amp; docker stop web
docker ps -a --filter name=web --format '{{.Names}} {{.Status}}'
docker start web &amp;&amp; docker rm -f web</code></pre>
<div class="out">web Up 12 seconds (Paused)
web Exited (0) 1 second ago</div>

<h3>stop là một cuộc thương lượng; kill thì không</h3>
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

<h3>PID 1 là đặc biệt, và dạng shell làm hỏng nó</h3>
<pre><code><span class="tok-comment"># Dạng shell — câu lệnh bị bọc trong /bin/sh -c</span>
docker run -d --name shellform alpine sh -c 'sleep 600'
docker exec shellform ps -o pid,args

<span class="tok-comment"># Dạng exec — tiến trình của bạn CHÍNH LÀ pid 1</span>
docker run -d --name execform alpine sleep 600
docker exec execform ps -o pid,args</code></pre>
<div class="out">PID   COMMAND
    1 /bin/sh -c sleep 600
    7 sleep 600
   13 ps -o pid,args

PID   COMMAND
    1 sleep 600
    8 ps -o pid,args</div>
<p>Ở container đầu tiên, PID 1 là <code>/bin/sh</code>, còn <code>sleep</code> là con của nó. <code>docker stop</code> gửi tín hiệu tới PID 1 — cái shell — mà theo mặc định nó không chuyển tiếp tín hiệu cho con và cũng không thoát trong lúc đang chờ. Thế là cái shell ngồi im, đồng hồ mười giây hết giờ, và mọi thứ chết bằng SIGKILL.</p>
<p>Linux cho PID 1 hai tính chất khác thường, và cả hai đều quan trọng ở đây:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">PID 1 PHỚT LỜ những tín hiệu nó không có trình xử lý</span><span class="v">Bình thường một SIGTERM không được xử lý sẽ giết tiến trình. Với PID 1 thì nhân đơn giản là VỨT nó đi. Nên một chương trình không bao giờ cài trình xử lý SIGTERM thì khi làm PID 1 sẽ không-giết-được-bằng-SIGTERM, dù chính chương trình đó ở chỗ khác thì dừng ngay tức khắc.</span></div>
  <div class="kv"><span class="k">PID 1 PHẢI thu dọn tiến trình con mồ côi</span><span class="v">Khi cha của một tiến trình bất kỳ chết, đứa mồ côi được gán lại cho PID 1, và PID 1 phải gọi <code>wait()</code> lên nó. Một cái shell hay một ứng dụng không làm việc đó sẽ thành một nhà máy sản xuất tiến trình xác — thấy được bằng số dòng trạng thái <code>Z</code> tăng dần trong <code>ps</code>, và cuối cùng là cạn bảng PID.</span></div>
  <div class="kv"><span class="k">Cách sửa A — dạng exec</span><span class="v"><code>CMD ["node", "server.js"]</code> thay cho <code>CMD node server.js</code>. Tiến trình của bạn thành PID 1 trực tiếp và nhận được tín hiệu. Đây là câu trả lời mặc định và nó không tốn gì (Chương 4).</span></div>
  <div class="kv"><span class="k">Cách sửa B — exec trong entrypoint của bạn</span><span class="v">Nếu bạn thật sự cần một script shell bọc ngoài thì hãy kết thúc nó bằng <code>exec node server.js</code>. <code>exec</code> THAY THẾ cái shell chứ không rẽ nhánh, nên ứng dụng của bạn thừa hưởng PID 1.</span></div>
  <div class="kv"><span class="k">Cách sửa C — --init</span><span class="v"><code>docker run --init</code> chèn một init tí hon (<code>tini</code>) làm PID 1, nó chuyển tiếp tín hiệu và thu dọn tiến trình xác. Đây là câu trả lời đúng khi tiến trình thật sự có sinh con — một bộ chạy test, một bộ giám sát, bất cứ thứ gì dùng <code>child_process</code>.</span></div>
</div>
<pre><code>docker rm -f shellform execform
docker run -d --name good alpine sh -c 'exec sleep 600'
docker exec good ps -o pid,args | head -2
time docker stop good; docker rm good</code></pre>
<div class="out">PID   COMMAND
    1 sleep 600
real	0m0.241s</div>

<h3>Mã thoát nói cho bạn biết chuyện gì đã xảy ra</h3>
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

<h3>Xem tận mắt: docker events</h3>
<pre><code>docker events --filter type=container --format '{{.Time}} {{.Action}} {{.Actor.Attributes.name}}' &amp;
docker run -d --name ev --rm alpine sleep 2
sleep 4; kill %1</code></pre>
<div class="out">1755892041 create ev
1755892041 attach ev
1755892041 start ev
1755892043 die ev
1755892043 destroy ev</div>
<p><code>docker events</code> là một dòng chảy trực tiếp mọi việc tiến trình nền làm, và nó là cách nhanh nhất để trả lời "3 giờ 14 phút thật ra đã xảy ra chuyện gì?" — kể cả những sự kiện chẳng ai yêu cầu, như một chính sách khởi động lại phóng lại một container đang sập bốn mươi lần. Chương 12 dùng nó; <code>--since</code> và <code>--until</code> phát lại lịch sử.</p>

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

<h3>Three ways data leaves the writable layer</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Named volume — <code>-v pgdata:/var/lib/postgresql/data</code></span><span class="v">Docker-managed storage under <code>/var/lib/docker/volumes/</code>, with its own lifecycle. Survives <code>docker rm</code>, survives <code>compose down</code> (unless you pass <code>-v</code>), and is the correct answer for databases. Chapter 7.</span></div>
  <div class="kv"><span class="k">Bind mount — <code>-v "\$PWD/src:/app/src"</code></span><span class="v">A path on the host appears inside the container. Perfect for source code in development, and for config files. Brings a file-ownership problem on Linux that Chapter 7 solves properly.</span></div>
  <div class="kv"><span class="k">tmpfs — <code>--tmpfs /tmp</code></span><span class="v">Memory-backed, never touches disk, gone on stop. Right for scratch space and for anything sensitive you do not want written to a disk layer at all.</span></div>
  <div class="kv"><span class="k">Nothing — the default</span><span class="v">Everything in the writable layer. Correct for a stateless web server or an API: it should hold no state worth keeping, and if it does, that is the design bug the container just revealed.</span></div>
</div>
<div class="callout ok"><strong>Official images tell you which paths need a volume.</strong> Run <code>docker image inspect postgres:16-alpine --format '{{json .Config.Volumes}}'</code> and you get <code>{"/var/lib/postgresql/data":{}}</code>. That declaration is the image author saying "this is the stateful path". Docker will even create an anonymous volume for it automatically — which is worse than useless, because the volume survives but nothing remembers its random name, so it becomes orphaned disk usage. Always name it yourself.</div>

<h3>Getting data out — docker cp</h3>
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
<div class="out">REPOSITORY  TAG   IMAGE ID       CREATED         SIZE
my-tools    v1    5c8d1f2a7b3e   2 seconds ago   12.7MB
IMAGE          CREATED         CREATED BY                    SIZE      COMMENT
5c8d1f2a7b3e   2 seconds ago   /bin/sh -c sleep 600          4.68MB    added curl and jq
&lt;missing&gt;      6 weeks ago     CMD ["/bin/sh"]               0B</div>
<p>It works, and it is a trap. The new layer's <code>CREATED BY</code> says <code>sleep 600</code> — the container's command, not what you actually did. Six months later nobody, including you, can tell what is in this image or reproduce it. Compare with a three-line Dockerfile that is in git, reviewable, rebuildable on any machine, and rebuilt automatically when the base image gets a security patch.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Legitimate use — a forensic snapshot</span><span class="v">A container is misbehaving in production and you need its exact state for analysis. <code>docker commit</code> freezes it, and you can then run a shell in the snapshot without disturbing the original.</span></div>
  <div class="kv"><span class="k">Legitimate use — capturing a fix under pressure</span><span class="v">You hot-patched a container at 3am to end an incident. Commit it so the fix is not lost, then write the Dockerfile properly in the morning. The commit is a receipt, not the deliverable.</span></div>
  <div class="kv"><span class="k">Not legitimate — building images</span><span class="v">No source of truth, no code review, no reproducibility, no automatic rebuild, no way to answer "why is this package here?". Every argument for Dockerfiles is an argument against this.</span></div>
  <div class="kv"><span class="k">Not legitimate — "the Dockerfile is too slow"</span><span class="v">A slow build is a caching problem with a known fix (Chapter 5). Trading reproducibility for build time is a bad trade that gets worse every month.</span></div>
</div>

<h3>save versus export</h3>
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
<pre><code>docker rm -f tinker db; docker rmi my-tools:v1; rm -f tools-image.tar tinker-fs.tar</code></pre>

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

<h3>Ba đường dữ liệu ra khỏi tầng ghi được</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Volume có tên — <code>-v pgdata:/var/lib/postgresql/data</code></span><span class="v">Kho lưu do Docker quản lý dưới <code>/var/lib/docker/volumes/</code>, có vòng đời riêng. Sống sót qua <code>docker rm</code>, sống sót qua <code>compose down</code> (trừ khi bạn truyền <code>-v</code>), và là câu trả lời đúng cho cơ sở dữ liệu. Chương 7.</span></div>
  <div class="kv"><span class="k">Bind mount — <code>-v "\$PWD/src:/app/src"</code></span><span class="v">Một đường dẫn trên máy chủ hiện ra bên trong container. Hoàn hảo cho mã nguồn lúc phát triển, và cho file cấu hình. Kèm theo một bài toán quyền sở hữu file trên Linux mà Chương 7 giải quyết tử tế.</span></div>
  <div class="kv"><span class="k">tmpfs — <code>--tmpfs /tmp</code></span><span class="v">Nằm trong bộ nhớ, không bao giờ chạm đĩa, mất khi dừng. Đúng cho chỗ nháp và cho bất cứ thứ gì nhạy cảm mà bạn hoàn toàn không muốn ghi xuống một tầng đĩa.</span></div>
  <div class="kv"><span class="k">Không gì cả — mặc định</span><span class="v">Mọi thứ nằm trong tầng ghi được. ĐÚNG với một web server hay một API không trạng thái: nó không nên giữ trạng thái nào đáng giữ, và nếu có thì đó chính là con bọ thiết kế mà container vừa phơi bày ra.</span></div>
</div>
<div class="callout ok"><strong>Ảnh chính thức nói cho bạn biết đường dẫn nào cần volume.</strong> Chạy <code>docker image inspect postgres:16-alpine --format '{{json .Config.Volumes}}'</code> là bạn có <code>{"/var/lib/postgresql/data":{}}</code>. Lời khai đó là tác giả ảnh đang nói "đây là đường dẫn có trạng thái". Docker thậm chí tự tạo một volume vô danh cho nó — và điều đó còn tệ hơn vô ích, vì volume thì sống sót nhưng chẳng có gì nhớ cái tên ngẫu nhiên của nó, nên nó thành phần đĩa mồ côi. Hãy LUÔN tự đặt tên cho nó.</div>

<h3>Lấy dữ liệu ra — docker cp</h3>
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
<div class="out">REPOSITORY  TAG   IMAGE ID       CREATED         SIZE
my-tools    v1    5c8d1f2a7b3e   2 seconds ago   12.7MB
IMAGE          CREATED         CREATED BY                    SIZE      COMMENT
5c8d1f2a7b3e   2 seconds ago   /bin/sh -c sleep 600          4.68MB    đã thêm curl và jq
&lt;missing&gt;      6 weeks ago     CMD ["/bin/sh"]               0B</div>
<p>Nó chạy được, và nó là một cái bẫy. Cột <code>CREATED BY</code> của tầng mới ghi <code>sleep 600</code> — câu lệnh của container, không phải thứ bạn thật sự đã làm. Sáu tháng sau không ai, kể cả bạn, nói được trong cái ảnh này có gì hay tái lập lại được nó. Hãy so với một Dockerfile ba dòng nằm trong git, review được, dựng lại được trên máy nào cũng vậy, và tự động dựng lại khi ảnh nền có bản vá an ninh.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Dùng chính đáng — một ảnh chụp để khám nghiệm</span><span class="v">Một container đang trở chứng trên production và bạn cần đúng trạng thái của nó để phân tích. <code>docker commit</code> đóng băng nó lại, và sau đó bạn mở được một shell trong ảnh chụp mà không quấy rầy bản gốc.</span></div>
  <div class="kv"><span class="k">Dùng chính đáng — giữ lại một bản vá gấp</span><span class="v">Bạn vá nóng một container lúc 3 giờ sáng để chấm dứt sự cố. Hãy commit nó lại để bản vá không bị mất, rồi sáng hôm sau viết Dockerfile cho tử tế. Cái commit là một tờ biên nhận, không phải sản phẩm.</span></div>
  <div class="kv"><span class="k">Không chính đáng — dựng ảnh</span><span class="v">Không có nguồn sự thật, không review mã, không tái lập được, không tự dựng lại được, không có cách nào trả lời "vì sao gói này lại ở đây?". Mọi lý lẽ ủng hộ Dockerfile đều là lý lẽ chống lại cách này.</span></div>
  <div class="kv"><span class="k">Không chính đáng — "Dockerfile dựng chậm quá"</span><span class="v">Dựng chậm là một vấn đề về cache và nó có cách chữa đã biết (Chương 5). Đánh đổi khả năng tái lập lấy thời gian dựng là một cuộc đổi chác tồi, và nó tồi thêm mỗi tháng.</span></div>
</div>

<h3>save khác export</h3>
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
<pre><code>docker rm -f tinker db; docker rmi my-tools:v1; rm -f tools-image.tar tinker-fs.tar</code></pre>

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
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">docker (the CLI)</span><span class="lz-lnote">Turns your command line into an HTTP request against the Engine API and formats the reply. It contains no container logic at all — which is why <code>DOCKER_HOST=ssh://vps-1 docker ps</code> lists containers on another machine with no extra software.</span></div>
  <div class="lz-layer"><span class="lz-lname">dockerd (the daemon)</span><span class="lz-lnote">The high-level features: image building, the network drivers, volumes, the API, and translating "run this image with these flags" into instructions for the layer below. This is what <code>systemctl status docker</code> reports on.</span></div>
  <div class="lz-layer"><span class="lz-lname">containerd</span><span class="lz-lnote">The container supervisor: pulls images, manages snapshots, and owns the lifecycle of every running container. It is a separate project with its own API, and it is what Kubernetes talks to directly on most clusters today.</span></div>
  <div class="lz-layer"><span class="lz-lname">containerd-shim-runc-v2</span><span class="lz-lnote">One tiny process per container, sitting between containerd and your process. It holds the container's stdio and reports the exit code — and because it is separate, containerd and dockerd can both restart without killing anything.</span></div>
  <div class="lz-layer"><span class="lz-lname">runc</span><span class="lz-lnote">The thing that actually creates the container: sets up namespaces and cgroups (Lesson 1.1), applies the seccomp and capability configuration, pivots to the new root, and <code>exec</code>s your binary. It runs for milliseconds and then it is gone — <code>runc</code> is not in the process list of a running container.</span></div>
</div>
<pre><code>docker run -d --name w nginx:1.27-alpine
ps -ef | grep -E 'dockerd|containerd|nginx: master' | grep -v grep | cut -c1-110</code></pre>
<div class="out">root      1102     1  /usr/bin/containerd
root      1287     1  /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
root     40100  1102  /usr/bin/containerd-shim-runc-v2 -namespace moby -id 8c40e93b1a41… -address /run/…
root     40122 40100  nginx: master process nginx -g daemon off;</div>
<p>Read the parent column. <code>containerd</code> (1102) started the <strong>shim</strong> (40100), and the shim is the parent of <strong>nginx</strong> (40122). Notice what is <em>not</em> there: <code>dockerd</code> is not an ancestor of nginx, and <code>runc</code> has already exited. Your container's process is a child of a small shim, and nothing else.</p>

<h3>Why the shim exists</h3>
<pre><code>docker info --format '{{.LiveRestoreEnabled}}'
sudo systemctl restart docker
sleep 3
docker ps --format '{{.Names}} {{.Status}}'</code></pre>
<div class="out">false
web Up 4 seconds</div>
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

<a class="link-card" href="https://opencontainers.org/" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">Open Container Initiative</span><span class="lc-sub">The three specifications — image, runtime and distribution — and who implements them. The reason "Docker image" and "OCI image" are the same thing in practice.</span></span>
</a>
<a class="link-card" href="https://containerd.io/docs/" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">containerd documentation</span><span class="lc-sub">The supervisor underneath both Docker and most Kubernetes clusters. Worth a skim so the architecture diagram in this lesson stops being abstract.</span></span>
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
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">docker (cái CLI)</span><span class="lz-lnote">Biến dòng lệnh của bạn thành một yêu cầu HTTP tới API của Engine rồi định dạng lại câu trả lời. Nó hoàn toàn KHÔNG chứa logic container nào — đó là lý do <code>DOCKER_HOST=ssh://vps-1 docker ps</code> liệt kê được container trên một cái máy khác mà không cần cài thêm phần mềm nào.</span></div>
  <div class="lz-layer"><span class="lz-lname">dockerd (tiến trình nền)</span><span class="lz-lnote">Các tính năng ở tầng cao: dựng ảnh, các trình điều khiển mạng, volume, cái API, và việc dịch "chạy cái ảnh này với mấy cờ này" thành chỉ thị cho tầng dưới. Đây là thứ mà <code>systemctl status docker</code> báo cáo.</span></div>
  <div class="lz-layer"><span class="lz-lname">containerd</span><span class="lz-lnote">Bộ giám sát container: kéo ảnh, quản lý snapshot, và nắm vòng đời của MỌI container đang chạy. Nó là một dự án riêng có API riêng, và ngày nay nó chính là thứ mà Kubernetes nói chuyện trực tiếp trên hầu hết các cụm.</span></div>
  <div class="lz-layer"><span class="lz-lname">containerd-shim-runc-v2</span><span class="lz-lnote">Một tiến trình tí hon cho MỖI container, ngồi giữa containerd và tiến trình của bạn. Nó giữ stdio của container và báo lại mã thoát — và vì nó tách riêng nên cả containerd lẫn dockerd đều khởi động lại được mà không giết thứ gì.</span></div>
  <div class="lz-layer"><span class="lz-lname">runc</span><span class="lz-lnote">Cái thứ THẬT SỰ tạo ra container: dựng namespace và cgroup (Bài 1.1), áp cấu hình seccomp và capability, xoay sang thư mục gốc mới, rồi <code>exec</code> chương trình của bạn. Nó chạy vài mili giây rồi biến mất — <code>runc</code> KHÔNG có mặt trong danh sách tiến trình của một container đang chạy.</span></div>
</div>
<pre><code>docker run -d --name w nginx:1.27-alpine
ps -ef | grep -E 'dockerd|containerd|nginx: master' | grep -v grep | cut -c1-110</code></pre>
<div class="out">root      1102     1  /usr/bin/containerd
root      1287     1  /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
root     40100  1102  /usr/bin/containerd-shim-runc-v2 -namespace moby -id 8c40e93b1a41… -address /run/…
root     40122 40100  nginx: master process nginx -g daemon off;</div>
<p>Hãy đọc cột tiến trình cha. <code>containerd</code> (1102) khởi chạy cái <strong>shim</strong> (40100), và shim là cha của <strong>nginx</strong> (40122). Hãy để ý thứ <em>KHÔNG</em> có mặt: <code>dockerd</code> không phải tổ tiên của nginx, và <code>runc</code> thì đã thoát từ lâu. Tiến trình container của bạn là con của một cái shim nhỏ xíu, và chỉ vậy thôi.</p>

<h3>Vì sao có cái shim</h3>
<pre><code>docker info --format '{{.LiveRestoreEnabled}}'
sudo systemctl restart docker
sleep 3
docker ps --format '{{.Names}} {{.Status}}'</code></pre>
<div class="out">false
web Up 4 seconds</div>
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

<a class="link-card" href="https://opencontainers.org/" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">Open Container Initiative</span><span class="lc-sub">Ba đặc tả — ảnh, runtime và phân phối — và ai hiện thực chúng. Là lý do "ảnh Docker" và "ảnh OCI" trên thực tế là một.</span></span>
</a>
<a class="link-card" href="https://containerd.io/docs/" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">Tài liệu containerd</span><span class="lc-sub">Bộ giám sát nằm dưới cả Docker lẫn phần lớn cụm Kubernetes. Đáng lướt qua để cái sơ đồ kiến trúc trong bài này thôi trừu tượng.</span></span>
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
      description: 'Tám câu về namespace với cgroup, tầng ảnh dùng chung, whiteout và bí mật, run là ba lệnh, PID 1 với dạng shell, exit 137, tầng ghi được, và cái shim.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on the model. Every one of them comes back as a practical problem in a later chapter, so it is worth being sure now.</p>
<div class="callout ok">Aim for 7/8. The three that matter most in real work: why a "deleted" secret is still in the image (1.2), why <code>docker stop</code> sometimes takes exactly ten seconds (1.3), and what <code>docker rm</code> does to your data (1.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về mô hình. Câu nào cũng quay lại thành một vấn đề thực tế ở chương sau, nên đáng chắc chắn ngay bây giờ.</p>
<div class="callout ok">Hãy nhắm 7/8. Ba câu quan trọng nhất trong việc thật: vì sao một bí mật "đã xoá" vẫn nằm trong ảnh (bài 1.2), vì sao <code>docker stop</code> đôi khi mất đúng mười giây (bài 1.3), và <code>docker rm</code> làm gì với dữ liệu của bạn (bài 1.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What do namespaces and cgroups each control?|||Namespace và cgroup mỗi cái điều khiển thứ gì?',
            options: [
              'Namespaces control CPU shares; cgroups control filesystem access|||Namespace điều khiển phần CPU; cgroup điều khiển truy cập hệ thống file',
              'Namespaces control what a process can SEE (filesystem, processes, network, hostname); cgroups control what it can USE (memory, CPU, I/O)|||Namespace điều khiển thứ tiến trình NHÌN THẤY (hệ thống file, tiến trình, mạng, tên máy); cgroup điều khiển thứ nó DÙNG ĐƯỢC (bộ nhớ, CPU, I/O)',
              'They are two names for the same kernel feature|||Chúng là hai tên gọi của cùng một tính năng của nhân',
              'Namespaces are a Docker invention; cgroups come from the kernel|||Namespace là phát minh của Docker; cgroup thì đến từ nhân',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'docker images lists three images totalling 415MB, but docker system df reports 281MB on disk. Which is wrong?|||docker images liệt kê ba ảnh cộng lại 415MB, nhưng docker system df báo 281MB trên đĩa. Cái nào sai?',
            options: [
              'docker images is wrong; it double-counts compressed layers|||docker images sai; nó đếm hai lần các tầng đã nén',
              'Neither — docker images shows each image’s LOGICAL size, counting shared layers in every image that uses them; system df shows what the disk actually holds|||Không cái nào sai — docker images cho thấy kích thước LOGIC của từng ảnh, tính cả tầng dùng chung vào mọi ảnh dùng chúng; system df cho thấy đĩa thật sự chứa bao nhiêu',
              'system df is wrong; it ignores the build cache|||system df sai; nó bỏ qua bộ đệm dựng',
              'The difference is filesystem compression|||Khác biệt là do nén của hệ thống file',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A Dockerfile does COPY id_rsa /root/.ssh/ in one instruction and rm /root/.ssh/id_rsa in a later one. Is the key in the published image?|||Một Dockerfile làm COPY id_rsa /root/.ssh/ ở một chỉ thị rồi rm /root/.ssh/id_rsa ở chỉ thị sau. Cái khoá có nằm trong ảnh đã công bố không?',
            options: [
              'No — the rm removed it before the image was finalised|||Không — lệnh rm đã gỡ nó đi trước khi ảnh được chốt lại',
              'Yes — layers are immutable, so the later layer only writes a whiteout marker; the original bytes stay in the earlier layer and anyone who pulls the image can extract them|||CÓ — tầng là bất biến, nên tầng sau chỉ ghi một dấu whiteout; những byte gốc vẫn nằm ở tầng trước và bất cứ ai kéo ảnh về đều moi ra được',
              'Only if the image is pushed to a public registry|||Chỉ khi ảnh được đẩy lên một registry công khai',
              'Only on Windows, where overlayfs is unavailable|||Chỉ trên Windows, nơi không có overlayfs',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What three operations does docker run combine?|||docker run gộp ba thao tác nào?',
            options: [
              'build, tag and push|||build, tag và push',
              'pull the image, create the container, start the process — and each is a separate command you can run yourself|||kéo ảnh về, tạo container, khởi chạy tiến trình — và mỗi cái là một câu lệnh riêng mà bạn tự chạy được',
              'create a volume, create a network, start the process|||tạo volume, tạo mạng, khởi chạy tiến trình',
              'stop any old container, remove it, start a new one|||dừng container cũ, xoá nó, khởi chạy cái mới',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'docker stop on your app always takes exactly ten seconds. What is the most likely cause?|||docker stop lên ứng dụng của bạn lần nào cũng mất đúng mười giây. Nguyên nhân khả dĩ nhất là gì?',
            options: [
              'Docker always waits ten seconds before stopping a container|||Docker luôn chờ mười giây trước khi dừng một container',
              'PID 1 is not handling SIGTERM — usually because the CMD is in shell form, so PID 1 is /bin/sh, which neither exits nor forwards the signal; Docker then sends SIGKILL after the grace period|||PID 1 không xử lý SIGTERM — thường là vì CMD viết ở dạng shell, nên PID 1 là /bin/sh, cái này vừa không thoát vừa không chuyển tiếp tín hiệu; sau thời gian ân hạn Docker gửi SIGKILL',
              'The image is too large to unmount quickly|||Ảnh quá lớn nên gỡ gắn kết không nhanh được',
              'The container is writing logs that must be flushed|||Container đang ghi log và phải xả hết bộ đệm',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A container exits with code 137 and you never ran docker stop. What happened?|||Một container thoát với mã 137 và bạn chưa hề chạy docker stop. Chuyện gì đã xảy ra?',
            options: [
              'The application called process.exit(137)|||Ứng dụng đã gọi process.exit(137)',
              'It was killed by SIGKILL (128+9) — almost always the memory cgroup limit or the host OOM killer; check docker inspect .State.OOMKilled and dmesg|||Nó bị SIGKILL giết (128+9) — gần như luôn là trần bộ nhớ của cgroup hoặc kẻ giết OOM của máy chủ; hãy kiểm docker inspect .State.OOMKilled và dmesg',
              'The image was corrupted during the pull|||Ảnh bị hỏng trong lúc kéo về',
              'The entrypoint script was not executable|||Script entrypoint không có quyền thực thi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your PostgreSQL container has data. Which of these destroys it?|||Container PostgreSQL của bạn đang có dữ liệu. Thao tác nào dưới đây huỷ nó?',
            options: [
              'docker restart — restarting resets the writable layer|||docker restart — khởi động lại là đặt lại tầng ghi được',
              'docker rm (and therefore every deploy and every docker compose down) — the writable layer is deleted with the container, unless the data path is on a volume|||docker rm (và do đó là mọi bản deploy lẫn mọi lệnh docker compose down) — tầng ghi được bị xoá cùng container, trừ khi đường dẫn dữ liệu nằm trên một volume',
              'docker stop — stopping frees the container’s storage|||docker stop — dừng lại là giải phóng kho lưu của container',
              'docker pause — pausing flushes the writable layer|||docker pause — tạm dừng là xả sạch tầng ghi được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why can the Docker daemon be restarted without killing running containers when live-restore is on?|||Vì sao tiến trình nền Docker khởi động lại được mà không giết container đang chạy khi live-restore đang bật?',
            options: [
              'The daemon saves and reloads each container’s memory to disk|||Tiến trình nền lưu rồi nạp lại bộ nhớ của từng container xuống đĩa',
              'Because each container’s parent is a small per-container shim started by containerd, not dockerd — so the daemon is not in the process tree at all|||Vì cha của mỗi container là một cái shim nhỏ riêng cho từng container do containerd khởi chạy, không phải dockerd — nên tiến trình nền hoàn toàn không nằm trong cây tiến trình đó',
              'Containers are frozen by the cgroup freezer during the restart|||Container bị bộ đông lạnh của cgroup đóng băng trong lúc khởi động lại',
              'runc keeps running and re-attaches the containers afterwards|||runc vẫn chạy tiếp rồi gắn lại các container sau đó',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
